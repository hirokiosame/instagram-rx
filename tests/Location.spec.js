const operators = require('rxjs/operators');
const Instagram = require('..');
const debug = require('debug');
const log = debug('IG-test:User');


test('Should get location details', async () => {
	const ig = new Instagram();
	const details = await ig.location('846436491').details().toPromise();

	expect(details).toHaveProperty('id');
	expect(details).toHaveProperty('name');
});

test('Should get location top posts', (done) => {
	const ig = new Instagram();
	const wiretap = jest.fn(log);

	ig.location('846436491').topPosts()
		.subscribe({
			next: wiretap,
			complete() {
				expect(wiretap).toHaveBeenCalled();
				done();
			},
			error: console.err,
		});
}, 1000 * 10);

test('Should get location posts', (done) => {
	const ig = new Instagram();
	const wiretap = jest.fn(log);

	ig.location('846436491').posts()
		.subscribe({
			next: wiretap,
			complete() {
				expect(wiretap).toHaveBeenCalled();
				done();
			},
			error: console.err,
		});
}, 1000 * 1000);
