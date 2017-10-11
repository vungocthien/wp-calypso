/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * @param {Object} state Whole Redux state tree
 * @param {Number} [siteId] Site ID to check. If not provided, the Site ID selected in the UI will be used
 * @return {Object} Object containing payment methods
 */
export const isRequestingSettings = ( state, siteId ) => {
	const path =
		[ 'extensions',
			'woocommerce',
			'sites',
			siteId,
			'settings',
			'email',
			'settingsRequest' ];

	return get( state, path, false );
};

export const requestingSettingsError = ( state, siteId ) => {
	const path =
		[ 'extensions',
			'woocommerce',
			'sites',
			siteId,
			'settings',
			'email',
			'settingsRequestError' ];

	return get( state, path, false );
};

export const mailchimpSettings = ( state, siteId ) => {
	const path =
		[ 'extensions',
			'woocommerce',
			'sites',
			siteId,
			'settings',
			'email',
			'settings' ];

	return get( state, path, null );
};

export const isSubbmittingApiKey = ( state, siteId ) => {
	const path =
		[ 'extensions',
			'woocommerce',
			'sites',
			siteId,
			'settings',
			'email',
			'apiKeySubmit' ];

	return get( state, path, false );
};

export const isSubmittingNewsletterSetting = ( state, siteId ) => {
	const path =
		[ 'extensions',
			'woocommerce',
			'sites',
			siteId,
			'settings',
			'email',
			'newsletterSettingsSubmit' ];

	return get( state, path, false );
};

export const newsletterSettingsSubmitError = ( state, siteId ) => {
	const path =
		[ 'extensions',
			'woocommerce',
			'sites',
			siteId,
			'settings',
			'email',
			'newsletterSettingsSubmitError' ];

	return get( state, path, false );
};

export const isApiKeyCorrect = ( state, siteId ) => {
	const path =
		[ 'extensions',
			'woocommerce',
			'sites',
			siteId,
			'settings',
			'email',
			'apiKeyCorrect' ];

	return get( state, path, true );
};

export const isRequestingLists = ( state, siteId ) => {
	const path =
		[ 'extensions',
			'woocommerce',
			'sites',
			siteId,
			'settings',
			'email',
			'listsRequest' ];

	return get( state, path, false );
};

export const syncStatus = ( state, siteId ) => {
	const path =
		[ 'extensions',
			'woocommerce',
			'sites',
			siteId,
			'settings',
			'email',
			'syncStatus' ];

	return get( state, path, false );
};

export const isRequestingSyncStatus = ( state, siteId ) => {
	const path =
		[ 'extensions',
			'woocommerce',
			'sites',
			siteId,
			'settings',
			'email',
			'syncStatusRequest' ];

	return get( state, path, false );
};

export const isRequestingResync = ( state, siteId ) => {
	const path =
		[ 'extensions',
			'woocommerce',
			'sites',
			siteId,
			'settings',
			'email',
			'resyncRequest' ];

	return get( state, path, false );
};
