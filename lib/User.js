const Rx = require('rxjs');
const rxo = require('rxjs/operators');
const random = (min, max) => (max - min) * Math.random() + min;


function getNextPage({
	$,
	page_info,
	query_hash,
	rhx_gis,
	variables,
}) {
	if (page_info && !page_info.has_next_page) { return Rx.empty(); }

	return $.request.graphql({
		rhx_gis,
		query_hash,
		variables: {
			first: 100,
			after: page_info && page_info.end_cursor,
			...variables,
		},
	});
};


function iteratePages(args) {
	const { $, pageProp, data, rhx_gis, query_hash, variables, dataPath } = args;
	const page = data && data[pageProp];
	if (page && !page.edges.length) {
		return [];
	}

	return Rx.concat(
		page ? Rx.from(page.edges) : [],
		getNextPage({
			$,
			rhx_gis,
			query_hash,
			page_info: page && page.page_info,
			variables,
		})
		.pipe(
			rxo.pluck(...dataPath.split('.')),
			rxo.concatMap(data => iteratePages({
				...args,
				data,
			})),
		)
	);
}

class User {

	constructor($, { username } = {}) {
		this.$ = $;
		this.username = username;

		this.initialReq = this.$.db.pipe(
			rxo.concatMap(db => db.users.findOne(this.username).exec()),
			rxo.concatMap(user => {
				if (user) {
					return Rx.from([user.toJSON()]);
				}

				return this.$.request.sharedData(`/${username}/`)
				.pipe(
					rxo.map(data => ({
						rhx_gis: data.rhx_gis,
						user_data: data.entry_data.ProfilePage[0].graphql.user,
					})),
					rxo.tap((data) =>
						this.$.db.pipe(
							rxo.concatMap(db => db.users.insert({
								...data,
								username: this.username,
							}))
						).toPromise()
					)
				);
			}),
		);
	}

	details() {
		return this.initialReq.pipe(rxo.pluck('user_data'));
	}

	posts() {
		return this.initialReq.pipe(
			rxo.concatMap(
				({ rhx_gis, user_data }) => iteratePages({
					$: this.$,
					rhx_gis,
					data: user_data,
					pageProp: 'edge_owner_to_timeline_media',
					query_hash: 'bd0d6d184eefd4d0ce7036c11ae58ed9',
					variables: { id: user_data.id },
					dataPath: 'data.user',
				})
			),
			rxo.pluck('node'),
		);
	}

	following({ perPage = 24 } = {}) {
		// Assert logged in

		return this.initialReq.pipe(
			rxo.concatMap(({ user_data, rhx_gis }) =>
				iteratePages({
					$: this.$,
					rhx_gis,
					query_hash: '9335e35a1b280f082a47b98c5aa10fa4',
					variables: {
						id: user_data.id,
						first: perPage,
					},
					dataPath: 'data.user',
					pageProp: 'edge_follow',
				})
			),
			rxo.pluck('node'),
		);
	}

	followers({ perPage = 24 } = {}) {
		// Assert logged in

		return this.initialReq.pipe(
			rxo.concatMap(({ user_data, rhx_gis }) =>
				iteratePages({
					$: this.$,
					rhx_gis,
					query_hash: '149bef52a3b2af88c0fec37913fe1cbc',
					variables: {
						id: user_data.id,
						first: perPage,
					},
					dataPath: 'data.user',
					pageProp: 'edge_followed_by',
				})
			),
			rxo.pluck('node'),
		);
	}

	tagged({ perPage = 24 } = {}) {
		// Assert logged in

		return this.initialReq.pipe(
			rxo.concatMap(({ user_data, rhx_gis }) =>
				iteratePages({
					$: this.$,
					rhx_gis,
					query_hash: 'e31a871f7301132ceaab56507a66bbb7',
					variables: {
						id: user_data.id,
						first: perPage,
					},
					dataPath: 'data.user',
					pageProp: 'edge_user_to_photos_of_you',
				})
			),
			rxo.pluck('node'),
		);
	}

	stories() {
		return this.initialReq.pipe(
			rxo.concatMap(({ user_data, rhx_gis }) => this.$.request.graphql({
				rhx_gis,
				query_hash: '45246d3fe16ccc6577e0bd297a5db1ab',
				variables: {
					reel_ids: [user_data.id],
					tag_names: [],
					location_ids: [],
					highlight_reel_ids: [],
					precomposed_overlay: false,
				}
			})),
			rxo.pluck('data', 'reels_media'),
		);
	}
}

module.exports = User;
