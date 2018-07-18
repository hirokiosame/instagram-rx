const _request = require('request-promise-native');
const { CookieJar } = require('tough-cookie');
const md5 = require('./md5');

module.exports = function createRequest({ cacheMaxAge = 1000 * 60 * 10 } = {}) {
	const cache = require('lru-cache')({
		max_age: cacheMaxAge,
	});

	const jar = _request.jar();
	const req = _request.defaults({
		baseUrl: 'https://www.instagram.com',
		uri: '',
		json: true,
		gzip: true,
		headers: {
			'x-requested-with': 'XMLHttpRequest',
			'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
		},
		jar,
	});

	function request(...args) {
		const key = JSON.stringify(args);
		if (cache.has(key)) {
			return Promise.resolve(cache.get(key));
		}

		return req(...args).then(res => (cache.set(key, res), res));
	}

	request.graphql = function({ rhx_gis, query_hash, variables }) {
		variables = JSON.stringify(variables);

		return this('/graphql/query/', {
			headers: {
				'x-instagram-gis': md5(`${rhx_gis}:${variables}`),
			},
			qs: {
				query_hash,
				variables,
			},
		});
	};

	request.deleteCookies = function() {
		jar._jar = new CookieJar(undefined, { looseMode: true });
	};

	return request;
};
