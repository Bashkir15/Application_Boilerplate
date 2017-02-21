import mongoose from 'mongoose'
import _ from 'lodash'

const escapeProperty = (value) => {
	return _escape(value);
};

const SectionSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},

	name: {
		type: String,
		unique: true,
		required: true,
		get: escapeProperty
	},

	description: {
		type: String,
		required: true,
		get: escapeProperty
	},

	creator: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'User'
	},

	subscribers: [{
		type: mongoose.Schema.ObjectId,
		required: false,
		ref: 'User'
	}],

	subscribed: {
		type: Boolean,
		default: false
	},

	picture: {
		type: String
	},

	moderators: [{
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'User'
	}]
});

SectionSchema.methods = {
	toJson: () => {
		let obj = this.toObject();

		if (obj.creator) {
			delete obj.creator.password;
		}

		return obj;
	},

	afterSave: (user) => {
		let obj = this;
		obj.subscribed = obj.subscribers.includes(user._id);
		return obj;
	}
}

mongoose.model('Section', SectionSchema);