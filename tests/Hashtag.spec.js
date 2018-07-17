const operators = require('rxjs/operators');
const Instagram = require('..');
const debug = require('debug');
const log = debug('IG-test:Hashtag');

test('Should get hashtag details', async () => {
	const ig = new Instagram();
	const details = await ig.hashtag('londoneats').details().toPromise();
	expect(details).toHaveProperty('name');
});

test('Should get hashtag top posts', (done) => {
	const ig = new Instagram();
	const wiretap = jest.fn(log);

	ig.hashtag('londoneats').topPosts()
		.subscribe({
			next: wiretap,
			complete() {
				expect(wiretap).toHaveBeenCalled();
				done();
			},
			error: console.err,
		});
}, 1000 * 10);

test('Should get hashtag posts', (done) => {
	const ig = new Instagram();
	const wiretap = jest.fn(log);

	ig.hashtag('londoneats').posts()
		.pipe(
			operators.take(10),
		)
		.subscribe({
			next: wiretap,
			complete() {
				expect(wiretap).toHaveBeenCalled();
				done();
			},
			error: console.err,
		});
}, 1000 * 1000);
