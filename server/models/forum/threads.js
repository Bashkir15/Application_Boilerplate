import mongoose from 'mongoose'
import _ from 'lodash'

const escapeProperty = (value) => _escape(value);

const ThreadSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},

	lastUpdated: {
		type: Date,
		default: Date.now
	},

	title: {
		type: String,
		required: true,
		get: escapeProperty
	},

	link: {
		type: String,
		required: false,
		get: escapeProperty
	},

	hasLink: {
		type: Boolean,
		default: false
	},

	content: {
		type: String,
		required: false,
		get: escapeProperty
	},

	creator: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'User'
	},

	section: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Section'
	},

	views: {
		type: Number,
		default: 0
	},

	likes: [{
		type: mongoose.Schema.ObjectId,
		required: false,
		ref: 'User'
	}],

	liked: {
		type: Boolean,
		default: false
	},

	dislikes: [{
		type: mongoose.Schema.ObjectId,
		required: false,
		ref: 'User'
	}],

	disliked: {
		type: Boolean,
		default: false
	},

	saves: [{
		type: mongoose.Schema.ObjectId,
		required: false,
		ref: 'User'
	}],

	saved: {
		type: Boolean,
		default: false
	},

	score: {
		type: Number,
		default: 0
	}
});


ThreadSchema.pre('remove', (next) => {
	this.model('Section').update({threads: this._id}, {$pull: {threads: {$in: [this._id]}}}, next);
});

ThreadSchema.methods = {
	toJSON: () => {
		let obj = this.toObject();

		if (obj.creator) {
			delete obj.creator.password;
		}

		if (obj.likes || obj.dislikes) {
			obj.score = obj.likes.length - obj.dislikes.length;
		}

		return obj;
	},

	afterSave: (user) => {
		let obj = this;
		obj.liked = obj.likes.includes(user._id);
		obj.disliked = obj.dislikes.includes(user._id);
		obj.saved = obj.saves.includes(user._id);

		return obj;
	},

	getMentionedUsers: (cb) => {
		const User = mongoose.model('User');
		let re = /@([A-Za-z0-9]+)/g;
		let usernames = this.content.match(re);

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
	}
};

mongoose.model('Thread', ThreadSchema);