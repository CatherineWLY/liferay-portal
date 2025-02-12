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

import pathToRegexp from 'path-to-regexp';
import React from 'react';
import {Redirect, withRouter} from 'react-router-dom';

import Icon from '../Icon.es';

/**
 * @class
 * @memberof shared/components
 */
class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {redirect: false, value: ''};
	}

	componentWillReceiveProps({match: {params}}) {
		const {search = ''} = params || {};
		const {value} = this.state;

		if (search !== value) {
			this.setState({
				value: search
			});
		}
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();

		this.setState({redirect: true});
	}

	render() {
		const {disabled} = this.props;
		const {redirect, value} = this.state;
		let placeholder = Liferay.Language.get('search-for');

		if (redirect) {
			const {
				location: {search},
				match: {params, path}
			} = this.props;

			const values = {page: 1};

			delete params.search;

			if (value && value.trim()) {
				values.search = encodeURIComponent(value);
			}

			const pathname = pathToRegexp.compile(path)({...params, ...values});

			// eslint-disable-next-line react/no-direct-mutation-state
			this.state.redirect = false;

			return <Redirect to={{pathname, search}} />;
		}

		if (typeof this.props.placeholder === 'string') {
			placeholder = this.props.placeholder;
		}

		return (
			<form
				method="GET"
				onSubmit={this.handleSubmit.bind(this)}
				role="search"
			>
				<div className="input-group">
					<div className="input-group-item">
						<input
							className="form-control input-group-inset input-group-inset-after"
							disabled={disabled}
							onChange={this.handleChange.bind(this)}
							placeholder={placeholder}
							type="text"
							value={value}
						/>
						<span className="input-group-inset-item input-group-inset-item-after">
							<button
								className="btn btn-unstyled"
								disabled={disabled}
								type="submit"
							>
								<Icon iconName="search" />
							</button>
						</span>
					</div>
				</div>
			</form>
		);
	}
}

export default withRouter(Search);
