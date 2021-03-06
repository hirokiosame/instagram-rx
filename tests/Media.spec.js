const operators = require('rxjs/operators');
const Instagram = require('..');
const debug = require('debug');
const log = debug('IG-test:Media');


test('Should get media details', async () => {
	const ig = new Instagram();

	const details = await ig.media('Be3rTNplCHf').details().toPromise();
	expect(details).toHaveProperty('id');
	expect(details).toHaveProperty('shortcode');
}, 1000 * 1000);
