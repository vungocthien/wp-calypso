/**
 * Internal dependencies
 */
import { getSelectedSiteId } from 'state/ui/selectors';
import request from '../../request';
import {
	WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST,
	WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST_SUCCESS,
	WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST_FAILURE,
	WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST,
	WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST_SUCCESS,
	WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST_FAILURE,
	WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT,
	WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT_SUCCESS,
	WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT_FAILURE,
	WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT,
	WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT_SUCCESS,
	WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT_FAILURE,
	WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST,
	WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST_SUCCESS,
	WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST_FAILURE,
	WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST,
	WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST_SUCCESS,
	WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST_FAILURE,
	WOOCOMMERCE_MAILCHIMP_CAMPAIGN_DEFAULTS_SUBMIT,
	WOOCOMMERCE_MAILCHIMP_CAMPAIGN_DEFAULTS_SUBMIT_SUCCESS,
	WOOCOMMERCE_MAILCHIMP_CAMPAIGN_DEFAULTS_SUBMIT_FAILURE,
	WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT,
	WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT_SUCCESS,
	WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT_FAILURE,
} from 'woocommerce/state/action-types';

const mailchimpSettingsRequest = ( siteId ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST,
	siteId
} );

const mailchimpSettingsRequestSuccess = ( siteId, settings ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST_SUCCESS,
	siteId,
	settings
} );

const mailchimpSettingsRequestFailure = ( siteId, { error } ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_SETTINGS_REQUEST_FAILURE,
	siteId,
	error
} );

const mailchimpApiKeySubmit = ( siteId ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT,
	siteId
} );

const mailchimpApiKeySubmitSuccess = ( siteId, settings ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT_SUCCESS,
	siteId,
	settings
} );

const mailchimpApiKeySubmitFailure = ( siteId, { error } ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_API_KEY_SUBMIT_FAILURE,
	siteId,
	error
} );

const mailchimpStoreInfoSubmit = ( siteId ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT,
	siteId
} );

const mailchimpStoreInfoSubmitSuccess = ( siteId, settings ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT_SUCCESS,
	siteId,
	settings
} );

const mailchimpStoreInfoSubbmitFailure = ( siteId, { error } ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_STORE_INFO_SUBMIT_FAILURE,
	siteId,
	error
} );

const mailchimpCampaignDefaultsSubmit = ( siteId ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_CAMPAIGN_DEFAULTS_SUBMIT,
	siteId
} );

const mailchimpCampaignDefaultsSubmitSuccess = ( siteId, settings ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_CAMPAIGN_DEFAULTS_SUBMIT_SUCCESS,
	siteId,
	settings
} );

const mailchimpCampaignDefaultsSubmitFailure = ( siteId, { error } ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_CAMPAIGN_DEFAULTS_SUBMIT_FAILURE,
	siteId,
	error
} );

const mailchimpListsRequest = ( siteId ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST,
	siteId
} );

const mailchimpListsRequestSuccess = ( siteId, lists ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST_SUCCESS,
	siteId,
	lists
} );

const mailchimpListsRequestFailure = ( siteId, { error } ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_LISTS_REQUEST_FAILURE,
	siteId,
	error
} );

const mailchimpSyncStatusRequest = ( siteId ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST,
	siteId
} );

const mailchimpSyncStatusRequestSuccess = ( siteId, syncStatus ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST_SUCCESS,
	siteId,
	syncStatus
} );

const mailchimpSyncStatusRequestFailure = ( siteId, { error } ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_SYNC_STATUS_REQUEST_FAILURE,
	siteId,
	error
} );

const mailchimpResyncRequest = ( siteId ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST,
	siteId
} );

const mailchimpResyncRequestSuccess = ( siteId, syncStatus ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST_SUCCESS,
	siteId,
	syncStatus
} );

const mailchimpResyncRequestFailure = ( siteId, { error } ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_RESYNC_REQUEST_FAILURE,
	siteId,
	error
} );

const mailchimpNewsletterSettingsSubmit = ( siteId ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT,
	siteId
} );

const mailchimpNewsletterSettingsSubmitSuccess = ( siteId, settings ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT_SUCCESS,
	siteId,
	settings
} );

const mailchimpNewsletterSettingsSubmitFailure = ( siteId, { error } ) => ( {
	type: WOOCOMMERCE_MAILCHIMP_NEWSLETTER_SETTINGS_SUBMIT_FAILURE,
	siteId,
	error
} );

export const requestSettings = ( siteId ) => ( dispatch, getState ) => {
	const state = getState();
	if ( ! siteId ) {
		siteId = getSelectedSiteId( state );
	}

	dispatch( mailchimpSettingsRequest( siteId ) );

	return request( siteId ).get( 'mailchimp' )
		.then( settings => {
			dispatch( mailchimpSettingsRequestSuccess( siteId, settings ) );
		} )
		.catch( error => {
			dispatch( mailchimpSettingsRequestFailure( siteId, error ) );
		} );
};

export const submitMailChimpApiKey = ( siteId, apiKey ) => ( dispatch, getState ) => {
	const state = getState();
	if ( ! siteId ) {
		siteId = getSelectedSiteId( state );
	}

	dispatch( mailchimpApiKeySubmit( siteId ) );

	return request( siteId ).put( 'mailchimp/api_key', { mailchimp_api_key: apiKey } )
		.then( settings => {
			dispatch( mailchimpApiKeySubmitSuccess( siteId, settings ) );
		} )
		.catch( error => {
			dispatch( mailchimpApiKeySubmitFailure( siteId, error ) );
		} );
};

export const submitMailchimpStoreInfo = ( siteId, storeInfo ) => ( dispatch, getState ) => {
	const state = getState();
	if ( ! siteId ) {
		siteId = getSelectedSiteId( state );
	}

	dispatch( mailchimpStoreInfoSubmit( siteId ) );

	return request( siteId ).put( 'mailchimp/store_info', storeInfo )
		.then( settings => {
			dispatch( mailchimpStoreInfoSubmitSuccess( siteId, settings ) );
		} )
		.catch( error => {
			dispatch( mailchimpStoreInfoSubbmitFailure( siteId, error ) );
		} );
};

export const submitMailchimpCampaignDefaults = ( siteId, campaignDefaults ) => ( dispatch, getState ) => {
	const state = getState();
	if ( ! siteId ) {
		siteId = getSelectedSiteId( state );
	}

	dispatch( mailchimpCampaignDefaultsSubmit( siteId ) );

	return request( siteId ).put( 'mailchimp/campaign_defaults', campaignDefaults )
		.then( settings => {
			dispatch( mailchimpCampaignDefaultsSubmitSuccess( siteId, settings ) );
		} )
		.catch( error => {
			dispatch( mailchimpCampaignDefaultsSubmitFailure( siteId, error ) );
		} );
};

export const requestLists = ( siteId ) => ( dispatch, getState ) => {
	const state = getState();
	if ( ! siteId ) {
		siteId = getSelectedSiteId( state );
	}

	dispatch( mailchimpListsRequest( siteId ) );

	return request( siteId ).get( 'mailchimp/newsletter_setting' )
		.then( lists => {
			dispatch( mailchimpListsRequestSuccess( siteId, lists ) );
		} )
		.catch( error => {
			dispatch( mailchimpListsRequestFailure( siteId, error ) );
		} );
};

export const requestSyncStatus = ( siteId ) => ( dispatch, getState ) => {
	const state = getState();
	if ( ! siteId ) {
		siteId = getSelectedSiteId( state );
	}
	dispatch( mailchimpSyncStatusRequest( siteId ) );

	return request( siteId ).get( 'mailchimp/sync' )
		.then( sync_status => {
			dispatch( mailchimpSyncStatusRequestSuccess( siteId, sync_status ) );
		} )
		.catch( error => {
			dispatch( mailchimpSyncStatusRequestFailure( siteId, error ) );
		} );
};

export const requestResync = ( siteId ) => ( dispatch, getState ) => {
	const state = getState();
	if ( ! siteId ) {
		siteId = getSelectedSiteId( state );
	}
	dispatch( mailchimpResyncRequest( siteId ) );

	return request( siteId ).put( 'mailchimp/sync' )
		.then( sync_status => {
			dispatch( mailchimpResyncRequestSuccess( siteId, sync_status ) );
		} )
		.catch( error => {
			dispatch( mailchimpResyncRequestFailure( siteId, error ) );
		} );
};

export const submitMailchimpNewsletterSettings = ( siteId, newsLetter ) => ( dispatch, getState ) => {
	const state = getState();
	if ( ! siteId ) {
		siteId = getSelectedSiteId( state );
	}

	dispatch( mailchimpNewsletterSettingsSubmit( siteId ) );

	return request( siteId ).put( 'mailchimp/newsletter_setting', newsLetter )
		.then( settings => {
			dispatch( mailchimpNewsletterSettingsSubmitSuccess( siteId, settings ) );
		} )
		.catch( error => {
			dispatch( mailchimpNewsletterSettingsSubmitFailure( siteId, error ) );
		} );
};
