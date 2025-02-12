/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import {useMemo} from 'react';

const useFilterItemKeys = (filterKeys, filterValues) => {
	return useMemo(() => {
		const filterItemKeys = {};

		Object.entries(filterKeys).forEach(([key, value]) => {
			if (filterValues[key] && filterValues[key]) {
				filterItemKeys[value] = filterValues[key].map(item => item.key);
			}
		});

		return filterItemKeys;
	}, [filterKeys, filterValues]);
};

export {useFilterItemKeys};
