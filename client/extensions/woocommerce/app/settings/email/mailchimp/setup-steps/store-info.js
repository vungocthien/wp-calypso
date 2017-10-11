/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormTextInput from 'components/forms/form-text-input';
import FormInputValidation from 'components/forms/form-input-validation';
import TimeZone from 'components/timezone';
import SettingsPaymentsLocationCurrency from 'woocommerce/app/settings/payments/payments-location-currency.js';
import { translate } from 'i18n-calypso';
import LanguagePicker from 'components/language-picker';
import config from 'config';

const fields = [
	{ name: 'store_name', label: translate( 'Store Name' ) },
	{ name: 'store_phone', label: translate( 'Phone' ) },
	{ name: 'admin_email', label: translate( 'Admin Email' ) },
];

export default ( { storeData, onChange, validateFields } ) => {
	const onTimezoneSelect = ( value ) => {
		const e = { target: {
			name: 'store_timezone',
			value
		} };
		onChange( e );
	};

	const selectLanguage = ( e ) => {
		const event = { target: {
			name: 'store_locale',
			value: e.target.value,
		} };
		onChange( event );
	};

	return (
		<FormFieldset className="setup-steps__store-info-field">
			<div>{ translate( 'Make sure that store informatin is correct. Every field is required' ) }</div>
			<SettingsPaymentsLocationCurrency />
			{ fields.map( ( item, index ) => (
				<div key={ index }>
					<FormLabel>
						{ item.label }
					</FormLabel>
					<FormTextInput
						name={ item.name }
						isError={ validateFields && ! storeData[ item.name ] }
						onChange={ onChange }
						value={ storeData[ item.name ] || '' }
					/>
					{ ( validateFields && ! storeData[ item.name ] ) && <FormInputValidation iserror text="field is required" /> }
				</div>
			) ) }
			<FormLabel>
				{ translate( 'Locale' ) }
				<LanguagePicker
					languages={ config( 'languages' ) }
					valueKey="langSlug"
					value={ storeData.store_locale }
					onChange={ selectLanguage }
				/>
			</FormLabel>
			<FormLabel>
				{ translate( 'Store Timezone' ) }
			</FormLabel>
			<TimeZone
				selectedZone={ storeData.store_timezone }
				onSelect={ onTimezoneSelect } />
		</FormFieldset>
	);
};
