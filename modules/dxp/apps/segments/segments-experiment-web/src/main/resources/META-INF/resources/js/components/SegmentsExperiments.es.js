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

import ClayButton from '@clayui/button';
import ClayDropDown from '@clayui/drop-down';
import {ClaySelect} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import ClayTabs from '@clayui/tabs';
import PropTypes from 'prop-types';
import React, {useContext, useState} from 'react';

import SegmentsExperimentsContext from '../context.es';
import {StateContext} from '../state/context.es';
import {SegmentsExperienceType} from '../types.es';
import {NO_EXPERIMENT_ILLUSTRATION_FILE_NAME} from '../util/contants.es';
import {statusToLabelDisplayType, STATUS_DRAFT} from '../util/statuses.es';
import ClickGoalPicker from './ClickGoalPicker/ClickGoalPicker.es';
import ExperimentsHistory from './ExperimentsHistory.es';
import SegmentsExperimentsActions from './SegmentsExperimentsActions.es';
import SegmentsExperimentsDetails from './SegmentsExperimentsDetails.es';
import Variants from './Variants/Variants.es';

const TABS_STATES = {
	ACTIVE: 0,
	HISTORY: 1
};

function SegmentsExperiments({
	onCreateSegmentsExperiment,
	onDeleteSegmentsExperiment,
	onEditSegmentsExperiment,
	onEditSegmentsExperimentStatus,
	onSelectSegmentsExperienceChange,
	onTargetChange,
	segmentsExperiences = []
}) {
	const [dropdown, setDropdown] = useState(false);
	const [activeTab, setActiveTab] = useState(TABS_STATES.ACTIVE);
	const {experiment, experimentHistory, selectedExperienceId} = useContext(
		StateContext
	);
	const {assetsPath} = useContext(SegmentsExperimentsContext);

	const _selectedExperienceId = experiment
		? experiment.segmentsExperienceId
		: selectedExperienceId;
	const noExperimentIllustration = `${assetsPath}${NO_EXPERIMENT_ILLUSTRATION_FILE_NAME}`;

	return (
		<>
			{segmentsExperiences.length > 1 && (
				<>
					<div className="form-group">
						<label>
							{Liferay.Language.get('select-experience')}
						</label>
						<ClaySelect
							defaultValue={_selectedExperienceId}
							onChange={_handleExperienceSelection}
						>
							{segmentsExperiences.map(segmentsExperience => {
								return (
									<ClaySelect.Option
										key={
											segmentsExperience.segmentsExperienceId
										}
										label={segmentsExperience.name}
										value={
											segmentsExperience.segmentsExperienceId
										}
									/>
								);
							})}
						</ClaySelect>
					</div>
					<hr />
				</>
			)}

			<ClayTabs justified={true}>
				<ClayTabs.Item
					active={activeTab == TABS_STATES.ACTIVE}
					onClick={() => setActiveTab(TABS_STATES.ACTIVE)}
				>
					{Liferay.Language.get('active-test')}
				</ClayTabs.Item>
				<ClayTabs.Item
					active={activeTab == TABS_STATES.HISTORY}
					onClick={() => setActiveTab(TABS_STATES.HISTORY)}
				>
					{Liferay.Language.get('history')}
					{' (' + experimentHistory.length + ')'}
				</ClayTabs.Item>
			</ClayTabs>

			<ClayTabs.Content
				activeIndex={activeTab}
				className="pt-3"
				fade={false}
			>
				<ClayTabs.TabPane>
					{experiment && (
						<>
							<div className="align-items-center d-flex justify-content-between">
								<h4 className="mb-0 text-dark text-truncate">
									{experiment.name}
								</h4>

								{experiment.editable && (
									<ClayDropDown
										active={dropdown}
										data-testid="segments-experiments-drop-down"
										onActiveChange={setDropdown}
										trigger={
											<ClayButton
												aria-label={Liferay.Language.get(
													'show-actions'
												)}
												borderless
												className="btn-monospaced"
												displayType="secondary"
											>
												<ClayIcon symbol="ellipsis-v" />
											</ClayButton>
										}
									>
										<ClayDropDown.ItemList>
											<ClayDropDown.Item
												onClick={_handleEditExperiment}
											>
												{Liferay.Language.get('edit')}
											</ClayDropDown.Item>
											<ClayDropDown.Item
												onClick={
													_handleDeleteActiveExperiment
												}
											>
												{Liferay.Language.get('delete')}
											</ClayDropDown.Item>
										</ClayDropDown.ItemList>
									</ClayDropDown>
								)}
							</div>

							<ClayLabel
								displayType={statusToLabelDisplayType(
									experiment.status.value
								)}
							>
								{experiment.status.label}
							</ClayLabel>

							<SegmentsExperimentsDetails
								segmentsExperiment={experiment}
							/>

							{experiment.goal.value === 'click' && (
								<ClickGoalPicker
									allowEdit={
										experiment.status.value === STATUS_DRAFT
									}
									onSelectClickGoalTarget={selector => {
										onTargetChange(selector);
									}}
									target={experiment.goal.target}
								/>
							)}

							<Variants
								selectedSegmentsExperienceId={
									selectedExperienceId
								}
							/>

							<SegmentsExperimentsActions
								onEditSegmentsExperimentStatus={
									onEditSegmentsExperimentStatus
								}
							/>
						</>
					)}

					{!experiment && (
						<div className="text-center">
							<img
								alt=""
								className="my-3"
								src={noExperimentIllustration}
								width="120px"
							/>
							<h4 className="text-dark">
								{Liferay.Language.get(
									'no-active-tests-were-found-for-the-selected-experience'
								)}
							</h4>
							<p>
								{Liferay.Language.get(
									'create-test-help-message'
								)}
							</p>
							<ClayButton
								displayType="secondary"
								onClick={() =>
									onCreateSegmentsExperiment(
										selectedExperienceId
									)
								}
							>
								{Liferay.Language.get('create-test')}
							</ClayButton>
						</div>
					)}
				</ClayTabs.TabPane>
				<ClayTabs.TabPane>
					<ExperimentsHistory
						experimentHistory={experimentHistory}
						onDeleteSegmentsExperiment={onDeleteSegmentsExperiment}
					/>
				</ClayTabs.TabPane>
			</ClayTabs.Content>
		</>
	);

	function _handleDeleteActiveExperiment() {
		const confirmed = confirm(
			Liferay.Language.get('are-you-sure-you-want-to-delete-this')
		);

		if (confirmed)
			return onDeleteSegmentsExperiment(experiment.segmentsExperimentId);
	}

	function _handleExperienceSelection(event) {
		const segmentsExperienceId = event.target.value;

		onSelectSegmentsExperienceChange(segmentsExperienceId);
	}

	function _handleEditExperiment() {
		onEditSegmentsExperiment();
	}
}

SegmentsExperiments.propTypes = {
	onCreateSegmentsExperiment: PropTypes.func.isRequired,
	onDeleteSegmentsExperiment: PropTypes.func.isRequired,
	onEditSegmentsExperiment: PropTypes.func.isRequired,
	onEditSegmentsExperimentStatus: PropTypes.func.isRequired,
	onSelectSegmentsExperienceChange: PropTypes.func.isRequired,
	onTargetChange: PropTypes.func.isRequired,
	segmentsExperiences: PropTypes.arrayOf(SegmentsExperienceType)
};

export default SegmentsExperiments;
