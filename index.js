const operators = require('rxjs/operators');
const retry = require('./utils/retry');
const extractSharedData = require('./utils/extractSharedData');
const User = require('./lib/User');
const Media = require('./lib/Media');
const Location = require('./lib/Location');
const Hashtag = require('./lib/Hashtag');
const createRequest = require('./utils/createRequest');
const createDB = require('./utils/database');

process.on('unhandledRejection', (reason, promise) => {
	console.log(reason, promise);
});

class InstagramRx {

	constructor({
		cacheMaxAge = 1000 * 60,
		jar,
	} = {}) {
		this.request = createRequest({
			cacheMaxAge,
			jar,
		});

		this.db = createDB();
	}

	login(username, password) {
		console.assert(username, 'Username must be provided');
		console.assert(password, 'Password must be provided');

		return this.request.sharedData('/')
			.pipe(
				operators.map(({ config }) => config.csrf_token),
				operators.concatMap(csrf_token => this.request('/accounts/login/ajax/', {
					// resolveWithFullResponse: true,
					method: 'POST',
					headers: {
						'X-CSRFToken': csrf_token,
					},
					form: { username, password },
				})),
				operators.tap(() => this.request.chrome()),
			);
	}


	logout() {
		return this.request('/accounts/logout/ajax/');
	}

	search(query) {
		// curl 'https://www.instagram.com/web/search/topsearch/?context=blended&query=priv' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36' --compressed
	}

	location(id) {
		return new Location(this.request, { id });
	}

	hashtag(hashtag) {
		return new Hashtag(this.request, { hashtag });
	}

	media(shortcode) {
		return new Media(this.request, { shortcode });
	}

	user(username) {
		return new User(this, { username });
	}
}

module.exports = InstagramRx;
