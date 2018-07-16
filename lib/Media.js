const Rx = require('rxjs');
const operators = require('rxjs/operators');
const md5 = require('../utils/md5');
const request = require('../utils/request');
const retry = require('../utils/retry');
const extractSharedData = require('../utils/extractSharedData');
const debug = require('debug');
const _log = debug('IG:Media');

class Media {

	constructor({ shortcode } = {}) {
		this.shortcode = shortcode;

		this.initialReq = retry(() => request(`/p/${shortcode}/`))
		.pipe(
			operators.map(src => extractSharedData(src))
		);
	}

	details() {
		const log = _log.bind(null, 'details');
		log({ media: this.shortcode });

		return this.initialReq
			.pipe(operators.map(data => data.entry_data.PostPage[0].graphql.shortcode_media));
	}


		// return {
		// 	details() {
		// 		return initialReq
		// 			.pipe(operators.map(data => data.entry_data.PostPage[0].graphql.shortcode_media));
		// 	},

		// 	comments() {
		// 	},

		// 	likes() {
		// 		// curl 'https://www.instagram.com/graphql/query/?query_hash=9ddeef64b046d1fc5d3a05b16581e0c6&variables=%7B%22shortcode%22%3A%22BfzEfy-lK1N%22%2C%22first%22%3A24%7D' -H 'pragma: no-cache' -H 'cookie: csrftoken=xg2KCbpBegw96Pa5wjI1QXqPVMM6fGIA; ds_user_id=23225714; mid=WYaa0AAEAAFeOII5tIG2COACx_h5; mcd=3; fbm_124024574287414=base_domain=.instagram.com; shbid=17919; rur=ASH; ig_cb=1; shbts=1530547820.286511; sessionid=IGSCbe63cffe1d8bd68808d5d5fd0c0ff8f6b48259330c1b1952a1776c2cb22fa207%3AedCqICDWxo7rkkWf3DhbzkmyTL1DNdqC%3A%7B%22_auth_user_id%22%3A23225714%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%2C%22_token%22%3A%2223225714%3AsicrRC3XeFSzyuVh5sDPqGNqtBEJLs62%3A2fac9725012c2c09d178874a8f8fd83d261abec6f76b3abd13edee4a0edf06d1%22%2C%22_platform%22%3A4%2C%22_remote_ip%22%3A%22126.197.2.207%22%2C%22_mid%22%3A%22WYaa0AAEAAFeOII5tIG2COACx_h5%22%2C%22_user_agent_md5%22%3A%22c3f4880a341235d5e458bb552045ed84%22%2C%22_token_ver%22%3A2%2C%22last_refreshed%22%3A1530748106.9421594143%7D; urlgen="{\"time\": 1530748106\054 \"92.90.17.174\": 15557}:1farb6:BJ4D1x9HjCLwAY1FYUTCEKZG4Ak"' -H 'accept-encoding: gzip, deflate, br' -H 'accept-language: en-US,en;q=0.9' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36' -H 'accept: */*' -H 'cache-control: no-cache' -H 'authority: www.instagram.com' -H 'x-requested-with: XMLHttpRequest' -H 'x-instagram-gis: aa1afc09bb5332c059a91690074f8fad' -H 'referer: https://www.instagram.com/p/BfzEfy-lK1N/liked_by/' --compressed
		// 	},
		// };
}

module.exports = Media;
