/*eslint-disable*/
/**
 * External dependencies
 *
 * @format
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */

export class UsAddressFieldsRender extends PureComponent {
	static propTypes = {
		renderMethodArray: PropTypes.array,
	};

	static defaultProps = {
		renderMethodArray: [],
	};

	render() {
		const { renderMethodArray } = this.props;
		return (
			<div className="domains__address-fields us-address-fields">
				{ renderMethodArray.map( item => {
					return item();
				} ) }
			</div>
		);
	}
}

export default UsAddressFieldsRender;
