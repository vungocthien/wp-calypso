/**
 * External dependencies
 *
 * @format
 */

import React from 'react';
import PropTypes from 'prop-types';
import identity from 'lodash/identity';
import noop from 'lodash/noop';

/**
 * Internal dependencies
 */
import { CHECKOUT_EU_ADDRESS_FORMAT_COUNTRY_CODES } from 'my-sites/domains/components/domain-form-fieldsets/constants';
import UsAddressFields from 'my-sites/domains/components/domain-form-fieldsets/us-address-fieldset';
import EuAddressFields from 'my-sites/domains/components/domain-form-fieldsets/eu-address-fieldset';

const regionAddressFieldsetComponents = [
	{
		keys: CHECKOUT_EU_ADDRESS_FORMAT_COUNTRY_CODES,
		component: EuAddressFields,
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
function getAddressComponent( formTypesArray, key ) {
	const formTypesArrayLength = formTypesArray.length;
	let Component;
	for ( let i = 0; i < formTypesArrayLength; i++ ) {
		if (
			Array.isArray( formTypesArray[ i ].keys ) &&
			formTypesArray[ i ].keys.indexOf( key ) > -1
		) {
			Component = formTypesArray[ i ].component;
			break;
		}
	}
	return Component;
}

const RegionAddressFieldsets = ( { getFieldProps, translate, countryCode } ) => {
	if ( countryCode ) {
		const Component =
			getAddressComponent( regionAddressFieldsetComponents, countryCode ) || UsAddressFields;
		return (
			<Component
				getFieldProps={ getFieldProps }
				translate={ translate }
				countryCode={ countryCode }
			/>
		);
	}
	return null;
};

RegionAddressFieldsets.propTypes = {
	getFieldProps: PropTypes.func,
	translate: PropTypes.func,
	countryCode: PropTypes.string,
};

RegionAddressFieldsets.defaultProps = {
	getFieldProps: noop,
	translate: identity,
	countryCode: 'US',
};

export default RegionAddressFieldsets;
