'use strict';

const { Schema, model } = require('mongoose');
const PostSchema = new Schema({
	created: {
		type: Date,
		default: Date.now,
	},
	lastUpdated: {
		type: Date,
	},
	content: {
		type: String,
		required: true,
	},
	attachment: {
		type: String,
	},
	hasAttachment: {
		type: Boolean,
		default: false,
	},
	creator: {
		type: Schema.ObjectId,
		ref: 'User',
		required: true,
	},
	likes: [{
		type: Schema.ObjectId,
		ref: 'User',
		required: false,
	}],
	liked: {
		type: Boolean,
		default: false,
	},
	shares: [{
		type: Schema.ObjectId,
		ref: 'User',
		required: false,
	}],
	shared: {
		type: Boolean,
		default: false,
	},
	saves: [{
		type: Schema.ObjectId,
		ref: 'User',
		required: false,
	}],
	saved: {
		type: Boolean,
		default: false,
	},
});

PostSchema.pre('save', function(next) {
	this.lastUpdated = Date.now();
});

PostSchema.methods = {
	toJSON() {
		const obj = this.toObject();
		if (obj.creator) {
			obj.creator.password = '';
		}
		return obj;
	},
	afterSave(user) {
		const obj = this;
		this.liked = this.likes.includes(user._id);
		this.shared = this.shares.includes(user._id);
		this.saved = this.saves.includes(user._id);
		return obj;
	},
	getMentionedUsers(cb) {
		const re = /@([A-Za-z0-9]+)/g;
		const usernames = this.content.match(re);
		const { User } = require('../users/model');

		if (!usernames || !usernames.length) {
			return [];
		}

		usernames.map((username, i) => {
			usernames[i] = username.substring(1);
		});


		User.find({username: {$in: usernames}})
		.exec((err, users) => {
			if (cb) {
				cb(err, users);
			}
		});
	},
};

const Post = model('Post', PostSchema);
module.exports = {
	Post,
};
