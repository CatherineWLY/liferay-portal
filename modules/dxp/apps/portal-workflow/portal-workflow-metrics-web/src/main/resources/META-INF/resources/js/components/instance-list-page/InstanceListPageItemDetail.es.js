/* eslint-disable react-hooks/exhaustive-deps */
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

import React, {useContext, useEffect, useState} from 'react';

import Icon from '../../shared/components/Icon.es';
import moment from '../../shared/util/moment.es';
import {AppContext} from '../AppContext.es';
import {InstanceListContext} from './store/InstanceListPageStore.es';

function InstanceListPageItemDetail({processId}) {
	const {client} = useContext(AppContext);
	const [instance, setInstance] = useState({});
	const {instanceId} = useContext(InstanceListContext);

	useEffect(() => {
		if (instanceId) {
			fetchData(instanceId, processId).then(data => setInstance(data));
		}
	}, [fetchData, instanceId, processId]);

	const fetchData = (instanceId, processId) => {
		return client
			.get(`/processes/${processId}/instances/${instanceId}`)
			.then(({data}) => data);
	};

	const {
		assetTitle,
		assetType,
		assigneeUsers,
		creatorUser,
		dateCompletion,
		dateCreated,
		slaResults = [],
		slaStatus,
		status,
		taskNames = []
	} = instance;

	const completed = status === 'Completed';
	const empty = slaResults.length === 0;
	const overdue = slaStatus === 'Overdue';
	const slaOpen = slaResults.filter(({status}) =>
		['Running', 'Paused'].includes(status)
	);
	const slaResolved = slaResults.filter(({status}) => status === 'Stopped');

	let styleName = 'text-danger';

	if (empty) {
		styleName = 'text-info';
	} else if (status === 'Completed') {
		styleName = 'text-secondary';
	} else if (status === 'Pending' && slaStatus === 'OnTime') {
		styleName = 'text-success';
	}

	let iconTitleName = 'check-circle';

	if (empty) {
		iconTitleName = 'hr';
	} else if (overdue) {
		iconTitleName = 'exclamation-circle';
	}

	return (
		<div
			aria-labelledby="instanceDetailModalLabel"
			className="fade modal"
			id="instanceDetailModal"
			role="dialog"
			style={{display: 'none'}}
			tabIndex="-1"
		>
			<div className="modal-dialog modal-lg">
				<div className="modal-content">
					<div className="modal-header">
						<div
							className="font-weight-medium modal-title"
							id="instanceDetailModalLabel"
						>
							<span
								className={`modal-title-indicator ${styleName}`}
							>
								<Icon iconName={iconTitleName} />
							</span>

							{`${Liferay.Language.get('item')} #${instanceId}`}
						</div>
						<button
							aria-labelledby="Close"
							className="close"
							data-dismiss="modal"
							role="button"
							type="button"
						>
							<Icon iconName="times" />
						</button>
					</div>
					<div className="modal-body">
						<InstanceListPageItemDetail.SectionTitle>
							{Liferay.Language.get('due-date-by-sla')}
						</InstanceListPageItemDetail.SectionTitle>

						{slaResults.length === 0 && (
							<p>
								<span className="font-weight-medium text-muted">
									{Liferay.Language.get(
										'no-sla-records-for-this-item'
									)}
								</span>
							</p>
						)}

						{!!slaOpen.length && (
							<InstanceListPageItemDetail.SectionSubTitle>
								{`${Liferay.Language.get(
									'open'
								).toUpperCase()} (${slaOpen.length})`}
							</InstanceListPageItemDetail.SectionSubTitle>
						)}

						{slaOpen.map(item => (
							<InstanceListPageItemDetail.Item
								key={item.id}
								{...item}
							/>
						))}

						{!!slaResolved.length && (
							<InstanceListPageItemDetail.SectionSubTitle>
								{`${Liferay.Language.get(
									'resolved'
								).toUpperCase()} (${slaResolved.length})`}
							</InstanceListPageItemDetail.SectionSubTitle>
						)}

						{slaResolved.map(item => (
							<InstanceListPageItemDetail.Item
								key={item.id}
								{...item}
							/>
						))}

						<InstanceListPageItemDetail.SectionTitle className="mt-5">
							{Liferay.Language.get('process-details')}
						</InstanceListPageItemDetail.SectionTitle>

						<InstanceListPageItemDetail.SectionAttribute
							description={Liferay.Language.get('process-status')}
							detail={status}
						/>

						<InstanceListPageItemDetail.SectionAttribute
							description={Liferay.Language.get('created-by')}
							detail={creatorUser ? creatorUser.name : ''}
						/>

						{!!dateCreated && (
							<InstanceListPageItemDetail.SectionAttribute
								description={Liferay.Language.get(
									'creation-date'
								)}
								detail={moment
									.utc(dateCreated)
									.format(
										Liferay.Language.get('mmm-dd-yyyy-lt')
									)}
							/>
						)}

						<InstanceListPageItemDetail.SectionAttribute
							description={Liferay.Language.get('asset-type')}
							detail={assetType}
						/>

						<InstanceListPageItemDetail.SectionAttribute
							description={Liferay.Language.get('asset-title')}
							detail={assetTitle}
						/>

						{!completed && (
							<InstanceListPageItemDetail.SectionAttribute
								description={Liferay.Language.get(
									'current-step'
								)}
								detail={taskNames.join(', ')}
							/>
						)}

						{completed && !!dateCompletion && (
							<InstanceListPageItemDetail.SectionAttribute
								description={Liferay.Language.get('end-date')}
								detail={moment
									.utc(dateCompletion)
									.format(
										Liferay.Language.get('mmm-dd-yyyy-lt')
									)}
							/>
						)}

						{!completed && (
							<InstanceListPageItemDetail.SectionAttribute
								description={Liferay.Language.get(
									'current-assignee'
								)}
								detail={
									assigneeUsers
										? assigneeUsers
												.map(user => user.name)
												.join(', ')
										: Liferay.Language.get('unassigned')
								}
							/>
						)}

						<a
							className="btn btn-secondary btn-sm font-weight-medium mb-1 mt-3"
							href={`/group/control_panel/manage/-/workflow_instance/view/${instanceId}`}
							target="_blank"
						>
							{Liferay.Language.get('go-to-submission-page')}

							<span className="inline-item inline-item-after">
								<Icon iconName="shortcut" />
							</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

InstanceListPageItemDetail.Item = ({
	dateOverdue,
	name,
	onTime,
	remainingTime,
	status
}) => {
	let bgColor = 'danger';
	let iconClassName = 'text-danger';
	let iconName = 'exclamation-circle';
	let statusText = `(${Liferay.Language.get('resolved-overdue')})`;

	if (onTime) {
		bgColor = 'success';
		iconClassName = 'text-success';
		iconName = 'check-circle';
	}

	if (status === 'Paused') {
		statusText = `(${Liferay.Language.get('sla-paused')})`;
	} else if (status === 'Running') {
		const remainingTimePositive = onTime
			? remainingTime
			: remainingTime * -1;

		const remainingTimeUTC = moment.utc(remainingTimePositive);

		const durationText =
			remainingTimeUTC.format('D') -
			1 +
			remainingTimeUTC.format('[d] HH[h] mm[min]');

		let onTimeText = Liferay.Language.get('overdue');

		if (onTime) {
			onTimeText = Liferay.Language.get('left');
		}

		statusText = `${moment
			.utc(dateOverdue)
			.format(
				Liferay.Language.get('mmm-dd-yyyy-lt')
			)} (${durationText} ${onTimeText})`;
	} else if (status === 'Stopped' && onTime) {
		statusText = `(${Liferay.Language.get('resolved-on-time')})`;
	}

	return (
		<p>
			<span
				className={`bg-${bgColor}-light sticker`}
				style={{height: '1.5rem', width: '1.5rem'}}
			>
				<span className="inline-item" style={{fontSize: '10px'}}>
					<Icon elementClasses={iconClassName} iconName={iconName} />
				</span>
			</span>

			<span className="font-weight-medium small text-secondary">{` ${name} `}</span>

			<span className="small">{statusText}</span>
		</p>
	);
};

InstanceListPageItemDetail.SectionTitle = ({children, className = ''}) => {
	const classNames = `${className} font-weight-medium mb-4`;

	return <h4 className={classNames}>{children}</h4>;
};

InstanceListPageItemDetail.SectionSubTitle = ({children}) => {
	return (
		<h5 className="font-weight-medium mb-4 mt-4 text-secondary">
			{children}
		</h5>
	);
};

InstanceListPageItemDetail.SectionAttribute = ({description, detail}) => {
	return (
		<p className="row">
			<span className="col-2 font-weight-medium small text-secondary">
				{`${description} `}
			</span>

			<span className="col small" data-testid="instanceDetailSpan">
				{detail}
			</span>
		</p>
	);
};

export default InstanceListPageItemDetail;
