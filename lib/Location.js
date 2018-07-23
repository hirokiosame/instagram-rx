const Rx = require('rxjs');
const rxo = require('rxjs/operators');
const debug = require('debug');
const _log = debug('IG:Location');

class Location {

	constructor(request, { id } = {}) {
		this.request = request;
		this.id = id;

		this.initialReq = request.sharedData(`/explore/locations/${id}/`)
		.pipe(
			rxo.map(data => [
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
				rxo.map(([location]) => location),
				rxo.tap(undefined, undefined, () => log({ location: this.id }, 'Complete'))
			);
	}

	topPosts() {
		const log = _log.bind(null, 'topPosts');
		log({ location: this.id });
		return this.details()
			.pipe(
				rxo.flatMap(details => details.edge_location_to_top_posts.edges),
				rxo.pluck('node'),
				rxo.tap(undefined, undefined, () => log({ location: this.id }, 'Complete'))
			);
	}

	posts() {
		const log = _log.bind(null, 'posts');
		log({ location: this.id });
		return this.initialReq
			.pipe(
				rxo.flatMap(
					([location, rhx_gis]) => [
						location.edge_location_to_media.edges,
						this._nextPage(rhx_gis, location.edge_location_to_media.page_info),
					]
				),
				rxo.flatMap(_ => _),
				rxo.pluck('node'),
				rxo.tap(undefined, undefined, () => log({ location: this.id }, 'Complete'))
			);
	}

	_nextPage(rhx_gis, page_info) {
		const log = _log.bind(null, '_nextPage');
		log({ location: this.id, rhx_gis, page_info });

		if (!page_info.has_next_page) { return []; }

		return this.request.graphql({
			rhx_gis,
			query_hash: 'ac38b90f0f3981c42092016a37c59bf7',
			variables: {
				id: this.id,
				first: 12,
				after: page_info.end_cursor,
			},
		})
		.pipe(
			rxo.map(({ data }) => data.location.edge_location_to_media),
			rxo.flatMap(posts => [
				posts.edges,
				this._nextPage(rhx_gis, posts.page_info),
			]),
			rxo.flatMap(_ => _),
		);
	}
}

module.exports = Location;
