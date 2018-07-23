const Rx = require('rxjs');
const operators = require('rxjs/operators');
const md5 = require('../utils/md5');
const retry = require('../utils/retry');
const extractSharedData = require('../utils/extractSharedData');
const debug = require('debug');
const _log = debug('IG:Hashtag');
const random = (min, max) => (max - min) * Math.random() + min;

class Hashtag {

	constructor(request, { hashtag } = {}) {
		this.hashtag = hashtag;

		this.initialReq = retry(() => request(`/explore/tags/${hashtag}/`))
		.pipe(
			operators.map(src => extractSharedData(src)),
			operators.map(data => [
				data.entry_data.TagPage[0].graphql.hashtag,
				data.rhx_gis,
			]),
		);
	}

	details() {
		const log = _log.bind(null, 'details');
		log({ hashtag: this.hashtag });
		return this.initialReq
			.pipe(
				operators.map(([hashtag]) => hashtag),
				operators.tap(undefined, undefined, () => log({ hashtag: this.hashtag }, 'Complete'))
			);
	}

	topPosts() {
		const log = _log.bind(null, 'topPosts');
		log({ hashtag: this.hashtag });
		return this.details()
			.pipe(
				operators.flatMap(details => details.edge_hashtag_to_top_posts.edges),
				operators.pluck('node'),
				operators.tap(undefined, undefined, () => log({ hashtag: this.hashtag }, 'Complete'))
			)
	}

	posts() {
		const log = _log.bind(null, 'posts');
		log({ hashtag: this.hashtag });
		return this.initialReq
			.pipe(
				operators.flatMap(([hashtag, rhx_gis]) => Rx.concat(
					Rx.from(hashtag.edge_hashtag_to_media.edges),
					this._nextPage(rhx_gis, hashtag.edge_hashtag_to_media.page_info),
				)),
				operators.pluck('node'),
				operators.tap(undefined, undefined, () => log({ hashtag: this.hashtag }, 'Complete'))
			);
	}

	_nextPage(rhx_gis, page_info) {
		const log = _log.bind(null, '_nextPage');

		if (!page_info.has_next_page) { return []; }

		return retry(() => {
			log({ hashtag: this.hashtag, rhx_gis, page_info });

			return request.graphql({
				rhx_gis,
				query_hash: 'ded47faa9a1aaded10161a2ff32abb6b',
				variables: {
					tag_name: this.hashtag,
					first: 3,
					after: page_info.end_cursor,
				},
			});
		})
		.pipe(
			operators.delay(random(5000, 15000)),
			operators.map(({ data }) => data.hashtag.edge_hashtag_to_media),
			operators.flatMap(posts => Rx.concat(
				Rx.from(posts.edges),
				this._nextPage(rhx_gis, posts.page_info),
			)),
		);
	}
}

module.exports = Hashtag;
