const operators = require('rxjs/operators');
const Instagram = require('..');
const debug = require('debug');
const log = debug('IG-test:User');
const util = require('util')

test('Should get user details', async () => {
	const ig = new Instagram();

	const details = await ig.user('instagram').details().toPromise();
	expect(details).toHaveProperty('id');
	expect(details).toHaveProperty('username');
}, 1000 * 1000);

test('Should get user posts', (done) => {
	const ig = new Instagram();
	const wiretap = jest.fn(log);

	ig.user('instagram').posts()
		.pipe(
			operators.take(10)
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


describe('Logged in', async () => {
	const ig = new Instagram();

	beforeAll(() =>
		ig.login(process.env.USER, process.env.PW).toPromise()
	);

	test('Should get user following', async (done) => {
		const wiretap = jest.fn(log);

		ig.user('instagram').following()
			.pipe(
				operators.take(10)
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

	test('Should get user followers', async (done) => {
		const wiretap = jest.fn(log);

		ig.user('instagram').followers()
			.pipe(
				operators.take(10)
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

	test('Should get user tagged', async (done) => {
		const wiretap = jest.fn(log);

		ig.user('instagram').tagged()
			.pipe(
				operators.take(10)
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

	test('Should get user stories', async (done) => {
		const wiretap = jest.fn(log);

		ig.user('instagram').stories()
			.subscribe({
				next: wiretap,
				complete() {
					expect(wiretap).toHaveBeenCalled();
					done();
				},
				error: console.err,
			});
	}, 1000 * 1000);
});

test('Should not get private user posts', (done) => {
	const ig = new Instagram();
	const wiretap = jest.fn(log);

	ig.user('bevwins').posts()
		.subscribe({
			next: wiretap,
			complete() {
				expect(wiretap).not.toHaveBeenCalled();
				done();
			},
			error: console.err,
		});
}, 1000 * 1000);
