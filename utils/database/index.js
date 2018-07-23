const Rx = require('rxjs');
const RxDB = require('rxdb');

RxDB.plugin(require('pouchdb-adapter-leveldb'));
const memdown = require('memdown');


const schemas = [
	'users',
];
async function setup() {
	const db = await RxDB.create({
		name: 'instagramrx' + Date.now(),
		adapter: memdown,
		ignoreDuplicate: true,
		multiInstance: false,         // <- multiInstance (default: true)
		// password: 'myPassword',     // <- password (optional)
	});

	await Promise.all(
		schemas
		.map(schemaName => require(`./schema/${schemaName}`))
		.map(schema => db.collection({
			name: schema.title,
			schema: schema,
		}))
	);

	return db;
}

module.exports = () => Rx.from(setup());
