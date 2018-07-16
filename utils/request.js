const request = require('request-promise-native');
const { CookieJar } = require('tough-cookie');
const md5 = require('./md5');
const queue = require('async/queue');

const jar = request.jar();
const req = request.defaults({
	baseUrl: 'https://www.instagram.com',
	uri: '',
	json: true,
	headers: {
		'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
	},
	jar,
});

const q = queue(function({ args }, callback) {
	req(...args).then(function(result) {
		callback(null, result);
	});
}, 2);

module.exports = req;

module.exports.graphql = function({ rhx_gis, query_hash, variables }) {
	variables = JSON.stringify(variables);

	return req('/graphql/query/', {
		headers: {
			'x-instagram-gis': md5(`${rhx_gis}:${variables}`),
		},
		qs: {
			query_hash,
			variables,
		},
	});
};

// = function(...args) {
// 	return new Promise((resolve, reject) => {
// 		q.push({args}, function(err, result) {
// 			if (err) {
// 				return reject(err);
// 			}

// 			resolve(result);
// 		});
// 	});
// }


module.exports.deleteCookies = function() {
	jar._jar = new CookieJar(undefined, { looseMode: true });
};

