const Rx = require('rxjs');
const operators = require('rxjs/operators');
const md5 = require('../utils/md5');
const request = require('../utils/request');
const retry = require('../utils/retry');
const extractSharedData = require('../utils/extractSharedData');
const debug = require('debug');

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
		const log = debug('IG:User:details');
		log({ username: this.username });

		return this.initialReq
			.pipe(
				operators.map(([user]) => user),
				operators.tap(undefined, undefined, () => log({ username: this.username }, 'Complete'))
			);
	}

	posts() {
		const log = debug('IG:User:posts');
		log({ username: this.username });
		return this.initialReq
			.pipe(
				operators.flatMap(
					([user, rhx_gis]) => [
						user.edge_owner_to_timeline_media.edges,
						this._nextPage(rhx_gis, user.id, user.edge_owner_to_timeline_media.page_info),
					]
				),
				operators.flatMap(_ => _),
				operators.pluck('node'),
				operators.tap(undefined, undefined, () => log({ location: this.id }, 'Complete'))
			);
	}

	_nextPage(rhx_gis, userId, page_info) {
		const log = debug('IG:User:_nextPage');
		log({ username: this.username, rhx_gis, page_info });

		if (!page_info.has_next_page) { return []; }

		const variables = JSON.stringify({
			id: userId,
			first: 100,
			after: page_info.end_cursor,
		});

		return retry(() => request('/graphql/query/', {
			headers: {
				'x-instagram-gis': md5(`${rhx_gis}:${variables}`),
			},
			qs: {
				query_hash: 'bd0d6d184eefd4d0ce7036c11ae58ed9',
				variables,
			},
		}))
		.pipe(
			// operators.tap(r => console.log({ r })),
			operators.map(({ data }) => data.user.edge_owner_to_timeline_media),
			operators.flatMap(posts => [
				posts.edges,
				this._nextPage(rhx_gis, userId, posts.page_info),
			]),
			operators.flatMap(_ => _),
		);
	}
}

module.exports = User;
