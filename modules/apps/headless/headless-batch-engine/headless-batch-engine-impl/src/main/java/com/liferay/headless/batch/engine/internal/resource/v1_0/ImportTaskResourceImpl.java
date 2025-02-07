/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.headless.batch.engine.internal.resource.v1_0;

import com.liferay.batch.engine.BatchEngineImportTaskExecutor;
import com.liferay.batch.engine.BatchEngineTaskExecuteStatus;
import com.liferay.batch.engine.BatchEngineTaskOperation;
import com.liferay.batch.engine.ItemClassRegistry;
import com.liferay.batch.engine.configuration.BatchEngineImportTaskConfiguration;
import com.liferay.batch.engine.model.BatchEngineImportTask;
import com.liferay.batch.engine.service.BatchEngineImportTaskLocalService;
import com.liferay.headless.batch.engine.dto.v1_0.ImportTask;
import com.liferay.headless.batch.engine.resource.v1_0.ImportTaskResource;
import com.liferay.petra.executor.PortalExecutorManager;
import com.liferay.petra.io.StreamUtil;
import com.liferay.portal.configuration.metatype.bnd.util.ConfigurableUtil;
import com.liferay.portal.kernel.util.File;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.PropsUtil;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.vulcan.multipart.BinaryFile;
import com.liferay.portal.vulcan.multipart.MultipartBody;

import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;

import java.util.AbstractMap;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.ws.rs.core.MultivaluedMap;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;

/**
 * @author Ivica Cardic
 */
@Component(
	configurationPid = "com.liferay.batch.engine.configuration.BatchEngineImportTaskConfiguration",
	properties = "OSGI-INF/liferay/rest/v1_0/import-task.properties",
	property = "batch.engine=true", scope = ServiceScope.PROTOTYPE,
	service = ImportTaskResource.class
)
public class ImportTaskResourceImpl extends BaseImportTaskResourceImpl {

	@Override
	public ImportTask deleteImportTask(
			String className, String version, String callbackURL,
			MultipartBody multipartBody)
		throws Exception {

		return _importFile(
			BatchEngineTaskOperation.DELETE,
			multipartBody.getBinaryFile("file"), callbackURL, className, null,
			version);
	}

	@Override
	public ImportTask getImportTask(Long importTaskId) throws Exception {
		return _toImportTask(
			_batchEngineImportTaskLocalService.getBatchEngineImportTask(
				importTaskId));
	}

	@Override
	public ImportTask postImportTask(
			String className, String version, String callbackURL,
			String fieldNameMapping, MultipartBody multipartBody)
		throws Exception {

		return _importFile(
			BatchEngineTaskOperation.CREATE,
			multipartBody.getBinaryFile("file"), callbackURL, className,
			fieldNameMapping, version);
	}

	@Override
	public ImportTask putImportTask(
			String className, String version, String callbackURL,
			MultipartBody multipartBody)
		throws Exception {

		return _importFile(
			BatchEngineTaskOperation.UPDATE,
			multipartBody.getBinaryFile("file"), callbackURL, className, null,
			version);
	}

	@Activate
	protected void activate(Map<String, Object> properties) {
		BatchEngineImportTaskConfiguration batchEngineImportTaskConfiguration =
			ConfigurableUtil.createConfigurable(
				BatchEngineImportTaskConfiguration.class, properties);

		_batchSize = batchEngineImportTaskConfiguration.batchSize();

		if (_batchSize <= 0) {
			_batchSize = 1;
		}

		Properties batchSizeProperties = PropsUtil.getProperties(
			"batch.size.", true);

		for (Map.Entry<Object, Object> entry : batchSizeProperties.entrySet()) {
			_itemClassBatchSizeMap.put(
				String.valueOf(entry.getKey()),
				GetterUtil.getInteger(entry.getValue()));
		}
	}

	private Map.Entry<byte[], String> _getContentAndExtensionFromCompressedFile(
			InputStream inputStream)
		throws IOException {

		ZipInputStream zipInputStream = new ZipInputStream(inputStream);

		ZipEntry zipEntry = zipInputStream.getNextEntry();

		return new AbstractMap.SimpleImmutableEntry<>(
			StreamUtil.toByteArray(zipInputStream),
			_file.getExtension(zipEntry.getName()));
	}

	private Map<String, Serializable> _getParameters() {
		Map<String, Serializable> parameters = new HashMap<>();

		MultivaluedMap<String, String> queryParameters =
			contextUriInfo.getQueryParameters();

		for (Map.Entry<String, List<String>> entry :
				queryParameters.entrySet()) {

			String key = entry.getKey();

			if (_ignoredParameters.contains(key)) {
				continue;
			}

			List<String> values = entry.getValue();

			if (!values.isEmpty()) {
				parameters.put(key, values.get(0));
			}
		}

		return parameters;
	}

	private ImportTask _importFile(
			BatchEngineTaskOperation batchEngineTaskOperation,
			BinaryFile binaryFile, String callbackURL, String className,
			String fieldNameMappingString, String version)
		throws Exception {

		Class<?> clazz = _itemClassRegistry.getItemClass(className);

		if (clazz == null) {
			throw new IllegalArgumentException(
				"Unknown class name: " + className);
		}

		ExecutorService executorService =
			_portalExecutorManager.getPortalExecutor(
				ImportTaskResourceImpl.class.getName());

		byte[] content = null;
		String extension = null;

		if (StringUtil.endsWith(binaryFile.getFileName(), "zip")) {
			Map.Entry<byte[], String> entry =
				_getContentAndExtensionFromCompressedFile(
					binaryFile.getInputStream());

			content = entry.getKey();
			extension = entry.getValue();
		}
		else {
			content = StreamUtil.toByteArray(binaryFile.getInputStream());
			extension = _file.getExtension(binaryFile.getFileName());
		}

		BatchEngineImportTask batchEngineImportTask =
			_batchEngineImportTaskLocalService.addBatchEngineImportTask(
				contextCompany.getCompanyId(), contextUser.getUserId(),
				_itemClassBatchSizeMap.getOrDefault(className, _batchSize),
				callbackURL, className, content,
				StringUtil.upperCase(extension),
				BatchEngineTaskExecuteStatus.INITIAL.name(),
				_toMap(fieldNameMappingString), batchEngineTaskOperation.name(),
				_getParameters(), version);

		executorService.submit(
			() -> _batchEngineImportTaskExecutor.execute(
				batchEngineImportTask));

		return _toImportTask(batchEngineImportTask);
	}

	private ImportTask _toImportTask(
		BatchEngineImportTask batchEngineImportTask) {

		return new ImportTask() {
			{
				className = batchEngineImportTask.getClassName();
				contentType = batchEngineImportTask.getContentType();
				endTime = batchEngineImportTask.getEndTime();
				errorMessage = batchEngineImportTask.getErrorMessage();
				executeStatus = ImportTask.ExecuteStatus.valueOf(
					batchEngineImportTask.getExecuteStatus());
				id = batchEngineImportTask.getBatchEngineImportTaskId();
				operation = ImportTask.Operation.valueOf(
					batchEngineImportTask.getOperation());
				startTime = batchEngineImportTask.getStartTime();
				version = batchEngineImportTask.getVersion();
			}
		};
	}

	private Map<String, String> _toMap(String fieldNameMappingString) {
		if (Validator.isNull(fieldNameMappingString)) {
			return Collections.emptyMap();
		}

		Map<String, String> fieldNameMappingMap = new HashMap<>();

		String[] fieldNameMappings = StringUtil.split(
			fieldNameMappingString, ',');

		for (String fieldNameMapping : fieldNameMappings) {
			String[] fieldNames = StringUtil.split(fieldNameMapping, '=');

			fieldNameMappingMap.put(fieldNames[0], fieldNames[1]);
		}

		return fieldNameMappingMap;
	}

	private static final Set<String> _ignoredParameters = new HashSet<>(
		Arrays.asList("callbackURL", "fieldNameMapping"));

	@Reference
	private BatchEngineImportTaskExecutor _batchEngineImportTaskExecutor;

	@Reference
	private BatchEngineImportTaskLocalService
		_batchEngineImportTaskLocalService;

	private int _batchSize;

	@Reference
	private File _file;

	private final Map<String, Integer> _itemClassBatchSizeMap = new HashMap<>();

	@Reference
	private ItemClassRegistry _itemClassRegistry;

	@Reference
	private PortalExecutorManager _portalExecutorManager;

}