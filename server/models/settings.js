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

	name: String,

	value: String,

	creator: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	}
});

SettingsSchema.methods = {
	toJSON: function() {
		var obj = this.toObject();

		if (obj.creator) {
			delete obj.creator.password;
			delete obj.creator.token;
		}

		return obj;
	}
};

mongoose.model('Setting', SettingsSchema);