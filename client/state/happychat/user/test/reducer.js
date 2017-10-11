/** @format */

/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { HAPPYCHAT_CONNECTED, DESERIALIZE } from 'state/action-types';
import { geoLocation } from '../reducer';

describe( '#geoLocation()', () => {
	test( 'should default to null', () => {
		const state = geoLocation( undefined, {} );

		expect( state ).to.be.null;
	} );

	test( 'should set the current user geolocation', () => {
		const state = geoLocation( null, {
			type: HAPPYCHAT_CONNECTED,
			user: {
				geo_location: {
					country_long: 'Romania',
					city: 'Timisoara',
				},
			},
		} );

		expect( state ).to.eql( { country_long: 'Romania', city: 'Timisoara' } );
	} );

	test( 'returns valid geolocation', () => {
		const state = geoLocation(
			{ country_long: 'Romania', city: 'Timisoara' },
			{
				type: DESERIALIZE,
			}
		);

		expect( state ).to.eql( { country_long: 'Romania', city: 'Timisoara' } );
	} );
} );
