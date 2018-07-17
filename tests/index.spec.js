const operators = require('rxjs/operators');
const Instagram = require('..');
const debug = require('debug');
const log = debug('IG-test:index');


test('Should get hashtag post locations', (done) => {
	const ig = new Instagram();
	const wiretap = jest.fn(log);

	ig.hashtag('londoneats').posts()
		.pipe(
			operators.concatMap(({ shortcode }) => ig.media(shortcode).details()),
			operators.filter(fullPost => fullPost.location),
			operators.distinct(fullPost => fullPost.location.id),
			operators.concatMap(fullPost => ig.location(fullPost.location.id).details()),
			operators.take(10),
			operators.reduce((acc, val) => (acc.push(val), acc), []),
		)
		.subscribe({
			next: wiretap,
			complete() {
				expect(wiretap).toHaveBeenCalled();
				done();
			},
			error: console.error,
		});
}, 1000 * 1000);

test('Should get user post locations', (done) => {
	const ig = new Instagram();
	const wiretap = jest.fn(log);

	ig.user('foodandsachi').posts()
		.pipe(
			operators.concatMap(({ shortcode }) => ig.media(shortcode).details()),
			operators.filter(fullPost => fullPost.location),
			operators.distinct(fullPost => fullPost.location.id),
			operators.concatMap(fullPost => ig.location(fullPost.location.id).details()),
			operators.take(10),
			operators.reduce((acc, val) => (acc.push(val), acc), []),
		)
		.subscribe({
			next: wiretap,
			complete() {
				expect(wiretap).toHaveBeenCalled();
				done();
			},
			error: console.error,
		});
}, 1000 * 1000);

