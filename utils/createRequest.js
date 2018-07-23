const _request = require('request-promise-native');
const { CookieJar } = require('tough-cookie');
const md5 = require('./md5');
const retry = require('../utils/retry');
const Rx = require('rxjs');
const rxo = require('rxjs/operators');
const extractSharedData = require('./extractSharedData');

function promisfiy(fn) {
	return new Promise((resolve, reject) => {
		fn((err, data) => {
			if (err) { return reject(err); }
			resolve(data);
		});
	});
}

module.exports = function createRequest({
	cacheMaxAge = 1000 * 60 * 10,
	jar = _request.jar(),
} = {}) {
	const cache = require('lru-cache')({
		max_age: cacheMaxAge,
	});

	const req = _request.defaults({
		baseUrl: 'https://www.instagram.com',
		uri: '',
		json: true,
		gzip: true,
		headers: {
			'accept': '*/*',
			'accept-language': 'en-US,en;q=0.9',
			'x-requested-with': 'XMLHttpRequest',
			'referer': 'https://www.instagram.com/',
			'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
		},
		jar,
	});

	function request(...args) {
		const key = JSON.stringify(args);
		if (cache.has(key)) {
			return Rx.from(Promise.resolve(cache.get(key)));
		}

		return retry(() => req(...args)).pipe(
			rxo.tap(res => cache.set(key, res))
		);
	}

	Object.assign(request, {

		sharedData(...args) {
			return this(...args)
				.pipe(
					rxo.map(src => extractSharedData(src)),
				);
		},

		graphql({ rhx_gis, query_hash, variables }) {
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
		},

		deleteCookies() {
			jar._jar = new CookieJar(undefined, { looseMode: true });
		},

		async chrome() {
			const cookieJar = await promisfiy(cb => jar._jar.serialize(cb));
			const cookies = cookieJar.cookies.map(cookie => ({
				name: cookie.key,
				value: cookie.value,
				domain: cookie.domain,
				path: cookie.path,
				expires: ~~(Date.parse(cookie.expires) / 1000),
				httpOnly: cookie.httpOnly,
				secure: cookie.secure,
				sameSite: 'Lax',
			}));

			const puppeteer = require('puppeteer');
			const browser = await puppeteer.launch({
				// headless: false,
			});
			process.on('exit', () => browser.close());
			process.on('SIGINT', () => browser.close());

			const page = await browser.newPage();
			await page.setRequestInterception(true);
			page.on('request', (req) => {
				if (['image', 'font', 'media'].includes(req.resourceType())) {
					req.abort();
					return;
				}

				req.continue();
			});

			await page.setCookie(...cookies);
			await page.goto('https://instagram.com');

			setInterval(() => {
				// page.reload();
				page.$('[role=presentation] button:last-child').then(el => (el && el.click()));

				const selector = Math.random() > 0.5 ? '.coreSpriteDesktopNavExplore' : '.coreSpriteDesktopNavProfile';
				// console.log('Clicking', { selector });
				page.click(selector).catch(() => {});
			}, 5000);
		},
	});

	return request;
};
