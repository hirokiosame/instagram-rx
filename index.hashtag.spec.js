const operators = require('rxjs/operators');
const Instagram = require('./index');
const util = require('util');

// test('Should get hashtag details', async () => {
// 	const ig = new Instagram();
// 	const details = await ig.hashtag('londoneats').details().toPromise();
// 	expect(details).toHaveProperty('name');
// });

// test('Should get hashtag top posts', (done) => {
// 	const ig = new Instagram();
// 	const wiretap = jest.fn(/*console.log*/);

// 	ig.hashtag('londoneats').topPosts()
// 		.subscribe({
// 			next: wiretap,
// 			complete() {
// 				expect(wiretap).toHaveBeenCalled();
// 				done();
// 			},
// 			error() {

// 			},
// 		});
// }, 1000 * 10);

test('Should get hashtag posts', (done) => {
	const ig = new Instagram();
	const wiretap = jest.fn(console.log);

	ig.hashtag('londoneats').posts()
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

// test('Should get hashtag post locations', (done) => {
// 	const ig = new Instagram();
// 	const wiretap = jest.fn(console.log);

// 	ig.hashtag('londoneats').posts()
// 		.pipe(
// 			operators.flatMap(({ shortcode }) => ig.media(shortcode).details()),
// 			operators.filter(fullPost => fullPost.location),
// 			operators.distinct(fullPost => fullPost.location.id),
// 			operators.flatMap(fullPost => ig.location(fullPost.location.id).details())
// 		)
// 		.subscribe({
// 			next: wiretap,
// 			complete() {
// 				expect(wiretap).toHaveBeenCalled();
// 				done();
// 			},
// 			error() {

// 			},
// 		});
// }, 1000 * 1000);

