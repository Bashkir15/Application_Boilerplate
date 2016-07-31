import mongoose from 'mongoose';
import _ from 'lodash';

const escapeProperty = function (value) {
	return _.escape(value);
};

var PostSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},

	lastUpdated: {
		type: Date,
		default: Date.now
	},

	content: {
		type: String,
		required: true,	
	},

	creator: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},

	likes: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: false
	},

	liked: {
		type: Boolean,
		default: false
	},

	dislikes: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: false
	},

	disliked: {
		type: Boolean,
		default: false
	},

	saves: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: false
	},

	saved: {
		type: Boolean,
		default: false
	},

	subscribers: [{
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: false
	}]
});

PostSchema.methods = {
	toJSON: function() {
		var obj = this.toObject();

		if (obj.creator) {
			delete obj.creator.password;
			delete obj.creator.following;
		}

		return obj;
	},

	afterSave: function(user) {
		var obj = this;
		obj.liked = obj.likes.indexOf(user._id) != -1;
		obj.disliked = obj.dislikes.indexOf(user._id) != -1;
		obj.saved = obj.saves.indexOf(user._id) != -1;
		return obj;
	},

	getMentionedUsers: function (callback) {

		var re = /@([A-Za-z0-9_]+)/g;
		var usernames = this.content.match(re);
		var User = mongoose.model("User");

		if (!usernames || !usernames.length) {
			return [];
		}

		usernames.map((username, i) => {
			usernames[i] = username.substring(1);
		});

		User.find({username: { $in: usernames}})
		.exec((err, users) => {
			if (cb) {
				cb(err, users);
			}
		});
	}
};

mongoose.model("Post", PostSchema);