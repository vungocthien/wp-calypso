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
import { CHECKOUT_EU_ADDRESS_FORMAT_COUNTRY_CODES } from 'my-sites/domains/components/domain-form-fieldsets/constants';

const needsOnlyGoogleAppsFields = [ 'email', 'postalCode' ];

const defaultRegionAddressFieldsets = {
	className: 'us-address-fields',
	fields: [ 'address', 'postalCode', 'state', 'city' ],
};

const regionAddressFieldsets = [
	{
		keys: CHECKOUT_EU_ADDRESS_FORMAT_COUNTRY_CODES,
		className: 'eu-address-fields',
		fields: [ 'address', 'postalCode', 'city' ],
	},
];

/**
 * regionAddressFieldsetComponent Objects
 * @typedef {Object} regionAddressFieldsetDefinitionObject
 * @property {Array<String>} keys array of country codes
 * @property {ReactElement} component corresponding address for the country code
 */

/**
 * @param {Array<regionAddressFieldsetDefinitionObject>} formTypesArray array of region address fieldset components and keys
 * @param {String} key countryCode
 * @returns {ReactElement} the address field component for the countryCode
 */
function getAddressFields( formTypesArray, key ) {
	const formTypesArrayLength = formTypesArray.length;
	let fieldDefinition;
	for ( let i = 0; i < formTypesArrayLength; i++ ) {
		if (
			Array.isArray( formTypesArray[ i ].keys ) &&
			formTypesArray[ i ].keys.indexOf( key ) > -1
		) {
			fieldDefinition = formTypesArray[ i ];
			break;
		}
	}
	return fieldDefinition;
}

export class RenderDomainFieldset extends PureComponent {
	static propTypes = {
		needsOnlyGoogleAppsDetails: PropTypes.bool,
		countryCode: PropTypes.string,
	};

	static defaultProps = {
		needsOnlyGoogleAppsDetails: false,
		countryCode: 'US',
	};

	renderAddressFields( countryCode ) {
		const fieldDefinition =
			getAddressFields( regionAddressFieldsets, countryCode ) || defaultRegionAddressFieldsets;

		return (
			<div
				className={ `domain-form-fieldsets__address-fields ${ fieldDefinition.className || '' }` }
			>
				{ fieldDefinition.fields.map( fieldName => {
					return this.props[ fieldName ] && this.props[ fieldName ]();
				} ) }
			</div>
		);
	}

	renderNeedsOnlyGoogleAppsFields() {
		return (
			<div className="domain-form-fieldsets__address-fields g-apps-fields">
				{ needsOnlyGoogleAppsFields.map( fieldName => {
					return this.props[ fieldName ] && this.props[ fieldName ]();
				} ) }
			</div>
		);
	}

	render() {
		const { countryCode, needsOnlyGoogleAppsDetails } = this.props;

		if ( needsOnlyGoogleAppsDetails ) {
			return this.renderNeedsOnlyGoogleAppsFields();
		}

		if ( countryCode ) {
			return this.renderAddressFields( countryCode );
		}
	}
}

export default RenderDomainFieldset;
