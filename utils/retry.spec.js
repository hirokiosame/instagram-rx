const retry = require('./retry');


test('shouldnt retry', async () => {
	const fn = jest.fn();

	await retry(() => new Promise((resolve) => resolve(fn()))).toPromise();

	expect(fn).toHaveBeenCalledTimes(1);
});

test('should retry', async () => {
	const fn = jest.fn();

	let i = 0;
	await retry(() => new Promise((resolve, reject) => {
		if (++i === 2) {
			resolve();
		} else {
			reject('Next try');
		}
	})).toPromise();
}, 22 * 1000);
