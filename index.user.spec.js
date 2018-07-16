const operators = require('rxjs/operators');
const Instagram = require('./index');
const util = require('util');


test('Should get user details', async () => {
	const ig = new Instagram();

	const details = await ig.user('nikitz___').details().toPromise();
	expect(details).toHaveProperty('id');
	expect(details).toHaveProperty('username');
}, 1000 * 1000);

test('Should get user posts', (done) => {
	const ig = new Instagram();
	const wiretap = jest.fn(/*console.log*/);

	ig.user('nikitz___').posts()
		.subscribe({
			next: wiretap,
			complete() {
				expect(wiretap).toHaveBeenCalled();
				done();
			},
			error(err) {
				console.error(err);
			},
		});
}, 1000 * 1000);
