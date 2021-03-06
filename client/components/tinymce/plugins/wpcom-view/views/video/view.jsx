/**
 * External dependencies
 *
 * @format
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { merge } from 'lodash';

/**
 * Internal dependencies
 */
import resizableView from '../../resizable-view';
import { getSelectedSiteId } from 'state/ui/selectors';
import { stringify, parse } from 'lib/shortcode';
import Shortcode from 'components/shortcode';

function VideoView( { siteId, content, width } ) {
	if ( ! siteId || ! width ) {
		return null;
	}

	const shortcode = stringify(
		merge(
			{
				attrs: {
					named: {
						w: width,
					},
				},
			},
			parse( content )
		)
	);

	return <Shortcode { ...{ siteId, width } }>{ shortcode }</Shortcode>;
}

VideoView.propTypes = {
	siteId: PropTypes.number,
	content: PropTypes.string,
	width: PropTypes.number,
};

export default connect( state => ( {
	siteId: getSelectedSiteId( state ),
} ) )( resizableView( VideoView ) );
