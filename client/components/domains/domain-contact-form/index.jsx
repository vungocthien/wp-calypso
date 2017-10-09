/*eslint-disable*/

/**
 * External dependencies
 *
 * @format
 */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import {
	camelCase,
	deburr,
	first,
	head,
	includes,
	indexOf,
	intersection,
	isEqual,
	kebabCase,
	last,
	map,
	noop,
	omit,
	pick,
	reduce,
} from 'lodash';

/**
 * Internal dependencies
 */
import { CountrySelect, StateSelect, Input, HiddenInput } from 'my-sites/domains/components/form';
import FormButton from 'components/forms/form-button';

import FormFieldset from 'components/forms/fieldset';
import formState from 'lib/form-state';
import { cartItems } from 'lib/cart-values';
import { countries } from 'components/phone-input/data';
import FormPhoneMediaInput from 'components/forms/form-phone-media-input';

import { forDomainRegistrations as countriesListForDomainRegistrations } from 'lib/countries-list';
import { CHECKOUT_EU_ADDRESS_FORMAT_COUNTRY_CODES } from 'my-sites/checkout/constants';

const wpcom = wp.undocumented(),
	countriesList = countriesListForDomainRegistrations();

const customFormTypes = [
	{
		keys: [ 'FR', 'DE' ],
		className: 'eu-address-fields',
		fields: [
			'firstName',
			'lastName',
			'organization',
			'email',
			'phone',
			'fax',
			'address',
			'city',
			'postalCode',
			'countryCode',
		],
	},
];

/*
	Use an array of field names for each region to dictate which fields to render and in which order
	Q: why not do this for the entire form?
	A: we can, but do we need to?
 */
const usAddressFieldNames = [
	'firstName',
	'lastName',
	'organization',
	'email',
	'phone',
	'fax',
	'address',
	'city',
	'state',
	'postalCode',
	'countryCode',
];

const euAddressFieldNames = [
	'firstName',
	'lastName',
	'organization',
	'email',
	'phone',
	'fax',
	'address',
	'city',
	'postalCode',
	'countryCode',
];

const needsOnlyGoogleAppsDetailsAddressFieldNames = [ 'postalCode', 'countryCode' ];

export class DomainAddressForm extends PureComponent {
	static propTypes = {
		countryCode: PropTypes.string,
		onSubmit: PropTypes.func,
		contactDetails: PropTypes.object,
	};

	static defaultProps = {
		countryCode: 'US',
		onSubmit: noop,
		contactDetails: {},
	};

	constructor( props, context ) {
		super( props, context );
		this.fieldNames = [
			'firstName',
			'lastName',
			'organization',
			'email',
			'phone',
			'address1',
			'address2',
			'city',
			'state',
			'postalCode',
			'countryCode',
			'fax',
		];
		this.state = {
			form: null,
			phoneCountryCode: 'US',
		};
		this.inputRefs = {};
		this.inputRefCallbacks = {};

		/*
			Store all possible address fields
			Q: why are we doing this?
			A: So we can run the region-specific fieldname lists over it :)
			A: We're managing the controlled elements in this Component, to split it we'd need to pass control methods/properties down as props,
			and also import the fields

		 */
		this.addressFieldRenderMethods = {};
	}

	componentWillMount() {
		this.formStateController = formState.Controller( {
			fieldNames: this.fieldNames,
			loadFunction: this.loadFormStateFromRedux,
			sanitizerFunction: this.sanitize,
			validatorFunction: this.validate,
			onNewState: this.setFormState,
			onError: this.handleFormControllerError,
		} );

		// create pointers to our address field rendering methods
		this.usForm = {
			address: this.renderAddressFields,
			city: this.renderCityField,
			fax: this.renderFaxField,
			state: this.renderStateField,
			postalCode: this.renderPostalCodeField,
			countryCode: this.renderCityField,
		};
	}

	componentDidUpdate( prevProps, prevState ) {
		const previousFormValues = formState.getAllFieldValues( prevState.form );
		const currentFormValues = formState.getAllFieldValues( this.state.form );
		if ( ! isEqual( previousFormValues, currentFormValues ) ) {
			this.props.updateContactDetailsCache( this.getMainFieldValues() );
		}
	}

	loadFormStateFromRedux = fn => {
		// only load the properties relevant to the main form fields
		fn( null, pick( this.props.contactDetails, this.fieldNames ) );
	};

	sanitize = ( fieldValues, onComplete ) => {
		const sanitizedFieldValues = Object.assign( {}, fieldValues );
		this.fieldNames.forEach( fieldName => {
			if ( typeof fieldValues[ fieldName ] === 'string' ) {
				// TODO: Deep
				sanitizedFieldValues[ fieldName ] = deburr( fieldValues[ fieldName ].trim() );
				if ( fieldName === 'postalCode' ) {
					sanitizedFieldValues[ fieldName ] = sanitizedFieldValues[ fieldName ].toUpperCase();
				}
			}
		} );

		onComplete( sanitizedFieldValues );
	};

	validate = ( fieldValues, onComplete ) => {
		if ( this.needsOnlyGoogleAppsDetails() ) {
			wpcom.validateGoogleAppsContactInformation(
				fieldValues,
				this.generateValidationHandler( onComplete )
			);
			return;
		}

		const allFieldValues = this.getMainFieldValues();
		const domainNames = map( cartItems.getDomainRegistrations( this.props.cart ), 'meta' );
		wpcom.validateDomainContactInformation(
			allFieldValues,
			domainNames,
			this.generateValidationHandler( onComplete )
		);
	};

	generateValidationHandler( onComplete ) {
		return ( error, data ) => {
			const messages = ( data && data.messages ) || {};
			onComplete( error, messages );
		};
	}

	needsOnlyGoogleAppsDetails() {
		return (
			cartItems.hasGoogleApps( this.props.cart ) &&
			! cartItems.hasDomainRegistration( this.props.cart )
		);
	}

	handleFormControllerError = error => {
		throw error;
	};

	handleChangeEvent = event => {
		// Resets the state field every time the user selects a different country
		if ( event.target.name === 'country-code' ) {
			this.formStateController.handleFieldChange( {
				name: 'state',
				value: '',
				hideError: true,
			} );

			if ( ! formState.getFieldValue( this.state.form, 'phone' ) ) {
				this.setState( {
					phoneCountryCode: event.target.value,
				} );
			}
		}

		this.formStateController.handleFieldChange( {
			name: event.target.name,
			value: event.target.value,
		} );
	};

	handlePhoneChange = ( { value, countryCode } ) => {
		this.formStateController.handleFieldChange( {
			name: 'phone',
			value,
		} );

		this.setState( {
			phoneCountryCode: countryCode,
		} );
	};

	getMainFieldValues() {
		const mainFieldValues = formState.getAllFieldValues( this.state.form );
		return {
			...mainFieldValues,
			phone: toIcannFormat( mainFieldValues.phone, countries[ this.state.phoneCountryCode ] ),
		};
	}

	focusFirstError() {
		const firstErrorName = kebabCase( head( formState.getInvalidFields( this.state.form ) ).name );
		const firstErrorRef = this.inputRefs[ firstErrorName ] || this.refs[ firstErrorName ];
		firstErrorRef.focus();
	}

	// We want to cache the functions to avoid triggering unnecessary rerenders
	getInputRefCallback( name ) {
		if ( ! this.inputRefCallbacks[ name ] ) {
			this.inputRefCallbacks[ name ] = el => {
				this.inputRefs[ name ] = el;
				return this.inputRefs[ name ];
			};
		}

		return this.inputRefCallbacks[ name ];
	}

	getFieldProps( name ) {
		const ref = name === 'state' ? { inputRef: this.getInputRefCallback( name ) } : { ref: name };
		return {
			name,
			...ref,
			additionalClasses: 'checkout-field',
			value: formState.getFieldValue( this.state.form, name ) || '',
			isError: formState.isFieldInvalid( this.state.form, name ),
			disabled: formState.isFieldDisabled( this.state.form, name ),
			onChange: this.handleChangeEvent,
			// The keys are mapped to snake_case when going to API and camelCase when the response is parsed and we are using
			// kebab-case for HTML, so instead of using different variations all over the place, this accepts kebab-case and
			// converts it to camelCase which is the format stored in the formState.
			errorMessage: ( formState.getFieldErrorMessages( this.state.form, camelCase( name ) ) || [] )
				.join( '\n' ),
			eventFormName: 'Checkout Form',
		};
	}

	focusFirstError() {
		const firstErrorName = kebabCase( head( formState.getInvalidFields( this.state.form ) ).name );
		const firstErrorRef = this.inputRefs[ firstErrorName ] || this.refs[ firstErrorName ];
		firstErrorRef.focus();
	}

	handleSubmitButtonClick = event => {
		event.preventDefault();

		this.formStateController.handleSubmit( hasErrors => {
			if ( hasErrors ) {
				this.focusFirstError();
				return;
			}

			this.props.onSubmit();
		} );
	};

	needsFax() {
		return (
			this.props.contactDetails.countryCode === 'NL' && cartItems.hasTld( this.props.cart, 'nl' )
		);
	}

	renderNameFields() {
		return (
			<div>
				<Input
					autoFocus
					label={ this.props.translate( 'First Name' ) }
					{ ...this.getFieldProps( 'first-name' ) }
				/>

				<Input
					label={ this.props.translate( 'Last Name' ) }
					{ ...this.getFieldProps( 'last-name' ) }
				/>
			</div>
		);
	}

	renderOrganizationField() {
		return (
			<HiddenInput
				label={ this.props.translate( 'Organization' ) }
				text={ this.props.translate(
					'Registering this domain for a company? + Add Organization Name',
					'Registering these domains for a company? + Add Organization Name',
					{
						count: this.getNumberOfDomainRegistrations(),
					}
				) }
				{ ...this.getFieldProps( 'organization' ) }
			/>
		);
	}

	renderEmailField() {
		return <Input label={ this.props.translate( 'Email' ) } { ...this.getFieldProps( 'email' ) } />;
	}

	renderCountryField() {
		return (
			<CountrySelect
				label={ this.props.translate( 'Country' ) }
				countriesList={ countriesList }
				{ ...this.getFieldProps( 'country-code' ) }
			/>
		);
	}

	renderFaxField() {
		return this.needsFax() ? (
			<Input label={ this.props.translate( 'Fax' ) } { ...this.getFieldProps( 'fax' ) } />
		) : null;
	}

	renderPhoneField() {
		const label = this.props.translate( 'Phone' );

		return (
			<FormPhoneMediaInput
				label={ label }
				countriesList={ countriesList }
				countryCode={ this.state.phoneCountryCode }
				onChange={ this.handlePhoneChange }
				{ ...omit( this.getFieldProps( 'phone' ), 'onChange' ) }
			/>
		);
	}

	renderAddressFields() {
		return (
			<div>
				<Input
					label={ this.props.translate( 'Address' ) }
					maxLength={ 40 }
					{ ...this.getFieldProps( 'address-1' ) }
				/>

				<HiddenInput
					label={ this.props.translate( 'Address Line 2' ) }
					text={ this.props.translate( '+ Add Address Line 2' ) }
					maxLength={ 40 }
					{ ...this.getFieldProps( 'address-2' ) }
				/>
			</div>
		);
	}

	renderCityField() {
		return <Input label={ this.props.translate( 'City' ) } { ...this.getFieldProps( 'city' ) } />;
	}

	renderStateField() {
		const countryCode = formState.getFieldValue( this.state.form, 'countryCode' );

		return (
			<StateSelect
				label={ this.props.translate( 'State' ) }
				countryCode={ countryCode }
				{ ...this.getFieldProps( 'state' ) }
			/>
		);
	}

	renderPostalCodeField() {
		return (
			<Input
				label={ this.props.translate( 'Postal Code' ) }
				{ ...this.getFieldProps( 'postal-code' ) }
			/>
		);
	}

	renderCountryDependentAddressFields( needsOnlyGoogleAppsDetails ) {
		const { isStateRequiredInAddress } = this.props;
		return (
			<div className="checkout__domain-details-country-dependent-address-fields">
				{ ! needsOnlyGoogleAppsDetails && this.renderAddressFields() }
				{ ! needsOnlyGoogleAppsDetails && this.renderCityField() }
				{ isStateRequiredInAddress && ! needsOnlyGoogleAppsDetails && this.renderStateField() }
				{ this.renderPostalCodeField() }
			</div>
		);
	}

	renderSubmitButton() {
		const continueText = this.hasAnotherStep()
			? this.props.translate( 'Continue' )
			: this.props.translate( 'Continue to Checkout' );

		return (
			<FormButton
				className="checkout__domain-details-form-submit-button"
				onClick={ this.handleSubmitButtonClick }
			>
				{ continueText }
			</FormButton>
		);
	}

	render() {
		const needsOnlyGoogleAppsDetails = this.needsOnlyGoogleAppsDetails();
		<form>
			{ this.renderNameFields() }
			{ ! needsOnlyGoogleAppsDetails && this.renderOrganizationField() }
			{ ! needsOnlyGoogleAppsDetails && this.renderEmailField() }
			{ ! needsOnlyGoogleAppsDetails && this.renderPhoneField() }
			{ ! needsOnlyGoogleAppsDetails && this.needsFax() && this.renderFaxField() }
			{ this.shouldDisplayAddressFieldset() &&
				this.renderCountryDependentAddressFields( needsOnlyGoogleAppsDetails ) }
			{ this.renderCountryField() }
			{ this.renderSubmitButton() }
		</form>;
	}
}

export default localize( DomainAddressForm );
