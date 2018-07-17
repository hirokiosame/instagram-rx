const Rx = require('rxjs');
const operators = require('rxjs/operators');
const md5 = require('../utils/md5');
const request = require('../utils/request');
const retry = require('../utils/retry');
const extractSharedData = require('../utils/extractSharedData');
const debug = require('debug');
const _log = debug('IG:User');
const random = (min, max) => (max - min) * Math.random() + min;

class User {

	constructor({ username } = {}) {
		this.username = username;

		this.initialReq = retry(() => request(`/${username}/`))
		.pipe(
			operators.map(src => extractSharedData(src)),
			operators.map(data => [
				data.entry_data.ProfilePage[0].graphql.user,
				data.rhx_gis,
			]),
		);
	}

	details() {
		const log = _log.bind(null, 'details');
		log({ username: this.username });

		return this.initialReq
			.pipe(
				operators.map(([user]) => user),
				operators.tap(undefined, undefined, () => log({ username: this.username }, 'Complete'))
			);
	}

	posts() {
		const log = _log.bind(null, 'posts');
		log({ username: this.username });
		return this.initialReq
			.pipe(
				operators.flatMap(([user, rhx_gis]) => Rx.concat(
					Rx.from(user.edge_owner_to_timeline_media.edges),
					(user.edge_owner_to_timeline_media.edges.length ? this._nextPage(rhx_gis, user.id, user.edge_owner_to_timeline_media.page_info) : []),
				)),
				operators.pluck('node'),
				operators.tap(undefined, undefined, () => log({ username: this.username }, 'Complete'))
			);
	}

	_nextPage(rhx_gis, userId, page_info) {
		const log = _log.bind(null, '_nextPage');

		if (!page_info.has_next_page) { return []; }

		return retry(() => {
			log({ username: this.username, rhx_gis, page_info });

			return request.graphql({
				rhx_gis,
				query_hash: 'bd0d6d184eefd4d0ce7036c11ae58ed9',
				variables: {
					id: userId,
					first: 100,
					after: page_info.end_cursor,
				},
			});	
		})
		.pipe(
			operators.delay(random(5000, 15000)),
			// operators.tap(r => console.log({ r })),
			operators.map(({ data }) => data.user.edge_owner_to_timeline_media),
			operators.flatMap(posts => Rx.concat(
				Rx.from(posts.edges),
				this._nextPage(rhx_gis, userId, posts.page_info),
			)),
		);
	}
}

module.exports = User;
