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

import {useEffect, useMemo, useState} from 'react';

import {useRouterParams} from '../../../hooks/useRouterParams.es';
import {buildFallbackItems} from '../util/filterEvents.es';

const useFilterState = (dispatch, filterKey) => {
	const {filters} = useRouterParams();
	const [items, setItems] = useState([]);

	const selectedKeys = filters[filterKey];

	const selectedItems = useMemo(() => {
		if (selectedKeys) {
			if (selectedKeys && items.length) {
				return items.filter(role => selectedKeys.includes(role.key));
			}

			return buildFallbackItems(selectedKeys);
		}

		return null;
	}, [items, selectedKeys]);

	useEffect(() => {
		dispatch({filterKey, selectedItems});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedItems]);

	return {items, selectedItems, setItems};
};

export {useFilterState};
