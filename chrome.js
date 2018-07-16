const puppeteer = require('puppeteer');

class Instagram {

	constructor() {
		this.ready = this.initialize();
	}

	async initialize() {

		this.browser = await puppeteer.launch({
			headless: false,
		});

		this.page = await this.browser.newPage();
		await this.page.setViewport({width: 1000, height: 1000});
		await this.page.setRequestInterception(true);


		this.page.on('request', (interceptedRequest) => {
			if (this.recording) {
				this.recording.push(interceptedRequest);
			}

			interceptedRequest.continue();
		});
	}

	startRecording() {
		const recording = [];
		this.recording = recording;

		return {
			stop() {
				this.recording = null;

				return recording;
			},
		};
	}

	async login(username, password) {
		await this.ready;
		await this.page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });
		await this.page.type('input[name="username"]', username);
		await this.page.type('input[name="password"]', password);


		const recording = this.startRecording();

		await this.page.click('form button');
		await this.page.waitForNavigation({ waitUntil: 'networkidle2' });

		const result = recording.stop();

		console.log(result);

		// await browser.close();
	}
}


(async () => {

	const ig = new Instagram();

	ig.login('hiroki.osame', 'renegade');

})();
