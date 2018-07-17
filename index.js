const request = require('request-promise-native');
const { Cookie } = require('tough-cookie');
const util = require('util');
const Rx = require('rxjs');
const operators = require('rxjs/operators');
const User = require('./lib/User');
const Media = require('./lib/Media');
const Location = require('./lib/Location');
const Hashtag = require('./lib/Hashtag');
const md5 = require('./utils/md5');
const retry = require('./utils/retry');
const extractSharedData = require('./utils/extractSharedData');

process.on('unhandledRejection', (reason, promise) => {
	console.log(reason, promise);
});

class InstagramRx {

	constructor(options) {
	}

	search(query) {
		// curl 'https://www.instagram.com/web/search/topsearch/?context=blended&query=priv' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36' --compressed
	}

	location(id) {
		return new Location({ id });
	}

	hashtag(hashtag) {
		return new Hashtag({ hashtag });
	}

	media(shortcode) {
		return new Media({ shortcode });
	}

	user(username) {
		return new User({ username });
	}
}

module.exports = InstagramRx;
