const operators = require('rxjs/operators');
const Instagram = require('..');
const util = require('util');

test('Should get location details', async () => {
	const ig = new Instagram();
	const details = await ig.location('846436491').details().toPromise();

	expect(details).toHaveProperty('id');
	expect(details).toHaveProperty('name');
});

test('Should get location top posts', (done) => {
	const ig = new Instagram();
	const wiretap = jest.fn(/*console.log*/);

	ig.location('846436491').topPosts()
		.subscribe({
			next: wiretap,
			complete() {
				expect(wiretap).toHaveBeenCalled();
				done();
			},
		});
}, 1000 * 10);

test('Should get location posts', (done) => {
	const ig = new Instagram();
	const wiretap = jest.fn(console.log);

	ig.location('846436491').posts()
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
