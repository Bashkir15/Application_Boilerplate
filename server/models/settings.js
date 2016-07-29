import mongoose from 'mongoose';
import _ from 'lodash';

var escapeProperty = function (value) {
	return _.escape(value);
};

var SettingsSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},

	lastUpdated: {
		type: Date,
		default: Date.now
	},

	theme: {
		type: String,
		get: escapeProperty
	},

	layout: {
		type: String,
		get: escapeProperty
	},

	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	}
});

SettingsSchema.methods = {
	toJSON: function() {
		var obj = this.toObject();

		if (obj.user) {
			delete obj.user.password;
			delete obj.user.token;
		}

		return obj;
	}
}