const Rx = require('rxjs');
const operators = require('rxjs/operators');
const md5 = require('../utils/md5');
const request = require('../utils/request');
const retry = require('../utils/retry');
const extractSharedData = require('../utils/extractSharedData');
const debug = require('debug');
const _log = debug('IG:Location');

class Location {

	constructor({ id } = {}) {
		this.id = id;

		this.initialReq = retry(() => request(`/explore/locations/${id}/`))
		.pipe(
			operators.map(src => extractSharedData(src)),
			operators.map(data => [
				data.entry_data.LocationsPage[0].graphql.location,
				data.rhx_gis,
			]),
		);
	}

	details() {
		const log = _log.bind(null, 'details');
		log({ location: this.id });
		return this.initialReq
			.pipe(
				operators.map(([location]) => location),
				operators.tap(undefined, undefined, () => log({ location: this.id }, 'Complete'))
			);
	}

	topPosts() {
		const log = _log.bind(null, 'topPosts');
		log({ location: this.id });
		return this.details()
			.pipe(
				operators.flatMap(details => details.edge_location_to_top_posts.edges),
				operators.pluck('node'),
				operators.tap(undefined, undefined, () => log({ location: this.id }, 'Complete'))
			);
	}

	posts() {
		const log = _log.bind(null, 'posts');
		log({ location: this.id });
		return this.initialReq
			.pipe(
				operators.flatMap(
					([location, rhx_gis]) => [
						location.edge_location_to_media.edges,
						this._nextPage(rhx_gis, location.edge_location_to_media.page_info),
					]
				),
				operators.flatMap(_ => _),
				operators.pluck('node'),
				operators.tap(undefined, undefined, () => log({ location: this.id }, 'Complete'))
			);
	}

	_nextPage(rhx_gis, page_info) {
		const log = _log.bind(null, '_nextPage');
		log({ location: this.id, rhx_gis, page_info });

		if (!page_info.has_next_page) { return []; }

		const variables = JSON.stringify({
			id: this.id,
			first: 12,
			after: page_info.end_cursor,
		});

		return retry(() => request('/graphql/query/', {
			headers: {
				'x-instagram-gis': md5(`${rhx_gis}:${variables}`),
			},
			qs: {
				query_hash: 'ac38b90f0f3981c42092016a37c59bf7',
				variables,
			},
		}))
		.pipe(
			// operators.tap((data) => log(data)),
			operators.map(({ data }) => data.location.edge_location_to_media),
			operators.flatMap(posts => [
				posts.edges,
				this._nextPage(rhx_gis, posts.page_info),
			]),
			operators.flatMap(_ => _),
		);
	}
}

module.exports = Location;
