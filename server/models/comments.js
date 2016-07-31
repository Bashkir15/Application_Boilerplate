import mongoose from 'mongoose';
import _ from 'lodash';

const escapeProperty = function (value) {
	return _.escape(value);
}

var CommentSchema = new mongoose.Schema({
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
		get: escapeProperty
	},

	creator: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},

	post: {
		type: mongoose.Schema.ObjectId,
		ref: 'Post',
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
	}
});

CommentSchema.methods = {
	toJSON: function() {
		var obj = this.toObject();

		if (obj.creator) {
			delete obj.creator.password;
			delete obj.creator.following;
		}

		return obj;
	},

	afterSave: function (user) {
		var obj = this;
		this.liked = this.likes.indexOf(user._id) != -1;
		this.disliked = this.dislikes.indexOf(user._id) != -1;
		this.saved = this.saves.indexOf(user._id != -1);
		return obj;
	}
};

mongoose.model("Comment", CommentSchema);