module.exports = {
	title: 'users',
	description: 'instagram users',
	version: 0,
	type: 'object',
	properties: {
		username: {
			type: 'string',
			primary: true,
		},
		rhx_gis: {
			type: 'string',
		},
		auth_user: {
			ref: 'user',
			type: 'string',
		},
		user_data: {
			type: 'object',
		},
	},
	// required: [],
};
