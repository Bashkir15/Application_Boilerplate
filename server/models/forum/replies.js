import mongoose from 'mongoose'
import { escape } from 'lodash'

const escapeProperty = (value) => escape(value);

const ReplySchema = new mongoose.Schema({
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
		required: true,
		ref: 'User'
	},

	thread: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Thread'
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
	}
});


ReplySchema.pre('remove', (next) => {
	this.model('Thread').update({comments: this._id}, {$pull: {comments: {$in: [this._id]}}}, next);
});

ReplySchema.methods = {
	toJson: () => {
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
		this.liked = this.likes.includes(user._id);
		this.disliked = this.dislikes.includes(user._id);
		this.saved = this.saves.includes(user._id);

		return obj;
	}
}

mogoose.model('Reply', ReplySchema);