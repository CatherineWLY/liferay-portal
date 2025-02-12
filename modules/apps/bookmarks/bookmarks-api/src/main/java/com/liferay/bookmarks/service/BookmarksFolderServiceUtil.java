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

package com.liferay.bookmarks.service;

import org.osgi.framework.Bundle;
import org.osgi.framework.FrameworkUtil;
import org.osgi.util.tracker.ServiceTracker;

/**
 * Provides the remote service utility for BookmarksFolder. This utility wraps
 * <code>com.liferay.bookmarks.service.impl.BookmarksFolderServiceImpl</code> and is an
 * access point for service operations in application layer code running on a
 * remote server. Methods of this service are expected to have security checks
 * based on the propagated JAAS credentials because this service can be
 * accessed remotely.
 *
 * @author Brian Wing Shun Chan
 * @see BookmarksFolderService
 * @generated
 */
public class BookmarksFolderServiceUtil {

	/**
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify this class directly. Add custom service methods to <code>com.liferay.bookmarks.service.impl.BookmarksFolderServiceImpl</code> and rerun ServiceBuilder to regenerate this class.
	 */

	/**
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify or reference this interface directly. Always use {@link BookmarksFolderServiceUtil} to access the bookmarks folder remote service. Add custom service methods to <code>com.liferay.bookmarks.service.impl.BookmarksFolderServiceImpl</code> and rerun ServiceBuilder to automatically copy the method declarations to this interface.
	 */
	public static com.liferay.bookmarks.model.BookmarksFolder addFolder(
			long parentFolderId, String name, String description,
			com.liferay.portal.kernel.service.ServiceContext serviceContext)
		throws com.liferay.portal.kernel.exception.PortalException {

		return getService().addFolder(
			parentFolderId, name, description, serviceContext);
	}

	public static void deleteFolder(long folderId)
		throws com.liferay.portal.kernel.exception.PortalException {

		getService().deleteFolder(folderId);
	}

	public static void deleteFolder(
			long folderId, boolean includeTrashedEntries)
		throws com.liferay.portal.kernel.exception.PortalException {

		getService().deleteFolder(folderId, includeTrashedEntries);
	}

	public static com.liferay.bookmarks.model.BookmarksFolder getFolder(
			long folderId)
		throws com.liferay.portal.kernel.exception.PortalException {

		return getService().getFolder(folderId);
	}

	public static java.util.List<Long> getFolderIds(long groupId, long folderId)
		throws com.liferay.portal.kernel.exception.PortalException {

		return getService().getFolderIds(groupId, folderId);
	}

	public static java.util.List<com.liferay.bookmarks.model.BookmarksFolder>
		getFolders(long groupId) {

		return getService().getFolders(groupId);
	}

	public static java.util.List<com.liferay.bookmarks.model.BookmarksFolder>
		getFolders(long groupId, long parentFolderId) {

		return getService().getFolders(groupId, parentFolderId);
	}

	public static java.util.List<com.liferay.bookmarks.model.BookmarksFolder>
		getFolders(long groupId, long parentFolderId, int start, int end) {

		return getService().getFolders(groupId, parentFolderId, start, end);
	}

	public static java.util.List<com.liferay.bookmarks.model.BookmarksFolder>
		getFolders(
			long groupId, long parentFolderId, int status, int start, int end) {

		return getService().getFolders(
			groupId, parentFolderId, status, start, end);
	}

	public static java.util.List<Object> getFoldersAndEntries(
		long groupId, long folderId) {

		return getService().getFoldersAndEntries(groupId, folderId);
	}

	public static java.util.List<Object> getFoldersAndEntries(
		long groupId, long folderId, int status) {

		return getService().getFoldersAndEntries(groupId, folderId, status);
	}

	public static java.util.List<Object> getFoldersAndEntries(
		long groupId, long folderId, int status, int start, int end) {

		return getService().getFoldersAndEntries(
			groupId, folderId, status, start, end);
	}

	public static int getFoldersAndEntriesCount(long groupId, long folderId) {
		return getService().getFoldersAndEntriesCount(groupId, folderId);
	}

	public static int getFoldersAndEntriesCount(
		long groupId, long folderId, int status) {

		return getService().getFoldersAndEntriesCount(
			groupId, folderId, status);
	}

	public static int getFoldersCount(long groupId, long parentFolderId) {
		return getService().getFoldersCount(groupId, parentFolderId);
	}

	public static int getFoldersCount(
		long groupId, long parentFolderId, int status) {

		return getService().getFoldersCount(groupId, parentFolderId, status);
	}

	/**
	 * Returns the OSGi service identifier.
	 *
	 * @return the OSGi service identifier
	 */
	public static String getOSGiServiceIdentifier() {
		return getService().getOSGiServiceIdentifier();
	}

	public static void getSubfolderIds(
		java.util.List<Long> folderIds, long groupId, long folderId,
		boolean recurse) {

		getService().getSubfolderIds(folderIds, groupId, folderId, recurse);
	}

	public static java.util.List<Long> getSubfolderIds(
		long groupId, long folderId, boolean recurse) {

		return getService().getSubfolderIds(groupId, folderId, recurse);
	}

	public static void mergeFolders(long folderId, long parentFolderId)
		throws com.liferay.portal.kernel.exception.PortalException {

		getService().mergeFolders(folderId, parentFolderId);
	}

	public static com.liferay.bookmarks.model.BookmarksFolder moveFolder(
			long folderId, long parentFolderId)
		throws com.liferay.portal.kernel.exception.PortalException {

		return getService().moveFolder(folderId, parentFolderId);
	}

	public static com.liferay.bookmarks.model.BookmarksFolder
			moveFolderFromTrash(long folderId, long parentFolderId)
		throws com.liferay.portal.kernel.exception.PortalException {

		return getService().moveFolderFromTrash(folderId, parentFolderId);
	}

	public static com.liferay.bookmarks.model.BookmarksFolder moveFolderToTrash(
			long folderId)
		throws com.liferay.portal.kernel.exception.PortalException {

		return getService().moveFolderToTrash(folderId);
	}

	public static void restoreFolderFromTrash(long folderId)
		throws com.liferay.portal.kernel.exception.PortalException {

		getService().restoreFolderFromTrash(folderId);
	}

	public static void subscribeFolder(long groupId, long folderId)
		throws com.liferay.portal.kernel.exception.PortalException {

		getService().subscribeFolder(groupId, folderId);
	}

	public static void unsubscribeFolder(long groupId, long folderId)
		throws com.liferay.portal.kernel.exception.PortalException {

		getService().unsubscribeFolder(groupId, folderId);
	}

	public static com.liferay.bookmarks.model.BookmarksFolder updateFolder(
			long folderId, long parentFolderId, String name, String description,
			com.liferay.portal.kernel.service.ServiceContext serviceContext)
		throws com.liferay.portal.kernel.exception.PortalException {

		return getService().updateFolder(
			folderId, parentFolderId, name, description, serviceContext);
	}

	public static BookmarksFolderService getService() {
		return _serviceTracker.getService();
	}

	private static ServiceTracker
		<BookmarksFolderService, BookmarksFolderService> _serviceTracker;

	static {
		Bundle bundle = FrameworkUtil.getBundle(BookmarksFolderService.class);

		ServiceTracker<BookmarksFolderService, BookmarksFolderService>
			serviceTracker =
				new ServiceTracker
					<BookmarksFolderService, BookmarksFolderService>(
						bundle.getBundleContext(), BookmarksFolderService.class,
						null);

		serviceTracker.open();

		_serviceTracker = serviceTracker;
	}

}