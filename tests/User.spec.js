const operators = require('rxjs/operators');
const Instagram = require('..');
const util = require('util');


test('Should get user details', async () => {
	const ig = new Instagram();

	const details = await ig.user('private.number_').details().toPromise();
	expect(details).toHaveProperty('id');
	expect(details).toHaveProperty('username');
}, 1000 * 1000);

test('Should get user posts', (done) => {
	const ig = new Instagram();
	const wiretap = jest.fn(p => console.log(util.inspect(p, { colors: true })));

	ig.user('private.number_').posts()
		.pipe(
			operators.take(10)
		)
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


test('Should not get private user posts', (done) => {
	const ig = new Instagram();
	const wiretap = jest.fn(console.log);

	ig.user('bevwins').posts()
		.subscribe({
			next: wiretap,
			complete() {
				expect(wiretap).not.toHaveBeenCalled();
				done();
			},
			error(err) {
				console.error(err);
			},
		});
}, 1000 * 1000);
