const Rx = require('rxjs');
const operators = require('rxjs/operators');
const { deleteCookies } = require('./request');

function retry(fn) {
	return Rx.defer(fn)
	.pipe(operators.retryWhen(errors => errors.pipe(
		operators.tap(err => console.log('Retrying in 20s', err/*err.statusCode, err.options.uri*/)),
		operators.tap(err => {
			deleteCookies();
		}),
		operators.delayWhen((err) => Rx.timer((err.statusCode === 429) ? 5000 : 20000)),
		// operators.delay(20000),
		operators.take(10),
		operators.concat(Rx.throwError('Retried 3 times and failed'))
	)));
}

module.exports = retry;
