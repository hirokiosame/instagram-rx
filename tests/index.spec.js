const operators = require('rxjs/operators');
const Instagram = require('..');
const util = require('util');


test('Should get hashtag post locations', (done) => {
	const ig = new Instagram();
	const wiretap = jest.fn(res => console.log(util.inspect(res, { colors: true })));

	ig.hashtag('londoneats').posts()
		.pipe(
			operators.concatMap(({ shortcode }) => ig.media(shortcode).details()),
			operators.filter(fullPost => fullPost.location),
			operators.distinct(fullPost => fullPost.location.id),
			operators.concatMap(fullPost => ig.location(fullPost.location.id).details()),
			operators.take(20),
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
	const wiretap = jest.fn(res => console.log(util.inspect(res, { colors: true })));

	ig.user('foodandsachi').posts()
		.pipe(
			operators.concatMap(({ shortcode }) => ig.media(shortcode).details()),
			operators.filter(fullPost => fullPost.location),
			operators.distinct(fullPost => fullPost.location.id),
			operators.concatMap(fullPost => ig.location(fullPost.location.id).details()),
			operators.take(20),
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

