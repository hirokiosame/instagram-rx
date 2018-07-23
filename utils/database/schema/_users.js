module.exports = {
	title: 'users',
	description: 'describes a simple hero',
	version: 0,
	type: 'object',
	properties: {
		username: {
			type: 'string',
			primary: true,
		},
		id: {
			type: 'string',
			final: true,
			index: true,
		},
		is_private: {
			type: 'boolean',
		},
		is_verified: {
			type: 'boolean',
		},
		country_block: {
			type: 'boolean',
		},
		full_name: {
			type: 'string',
		},
		biography: {
			type: 'string',
		},
		external_url: {
			type: ['null', 'string'],
		},
		external_url_linkshimmed: {
			type: ['null', 'string'],
		},
		edge_followed_by: {
			type: 'object',
		},
		edge_follow: {
			type: 'object',
		},
		has_channel: {
			type: 'boolean',
		},
		highlight_reel_count: {
			type: 'number',
		},
		profile_pic_url: {
			type: 'string',
		},
		profile_pic_url_hd: {
			type: 'string',
		},
		connected_fb_page: {
			type: 'null',
		},


		followed_by_viewer: {
			type: 'boolean',
		},
		follows_viewer: {
			type: 'boolean',
		},
		blocked_by_viewer: {
			type: 'boolean',
		},
		has_blocked_viewer: {
			type: 'boolean',
		},
		requested_by_viewer: {
			type: 'boolean',
		},
		has_requested_viewer: {
			type: 'boolean',
		},
		mutual_followers: {
			type: ['null', 'object'],
		},

		edge_felix_combined_post_uploads: {
			type: 'object',
		},
		edge_felix_combined_draft_uploads: {
			type: 'object',
		},
		edge_felix_video_timeline: {
			type: 'object',
		},
		edge_felix_drafts: {
			type: 'object',
		},
		edge_felix_pending_post_uploads: {
			type: 'object',
		},
		edge_felix_pending_draft_uploads: {
			type: 'object',
		},
		edge_owner_to_timeline_media: {
			type: 'object',
		},
		edge_saved_media: {
			type: 'object',
		},
		edge_media_collections: {
			type: 'object'
		},
	},
	// required: [],
};
