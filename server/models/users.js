import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import _ from 'lodash';

const validatePresenceOf = function (value) {
	return (this.provider && this.provider !== 'local') || (value && value.length);
};

const escapeProperty = function (value) {
	return _.escape(value);
}

var UserSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},

	name: {
		type: String,
		required: true,
		get: escapeProperty
	},

	username: {
		type: String,
		requried: true,
		unique: true,
		get: escapeProperty,
		match: [/^\w+$/, 'Sorry, usernames']
	},

	email: {
		type: String,
		required: true,
		unique: true
	},

	password: {
		type: String,
		requried: true,
		get: escapeProperty,
		validate: [validatePresenceOf, 'Sorry, your password cannot be blank']
	},

	roles: {
		type: Array,
		default: ['authenticated']
	},

	provider: {
		type: String,
		default: 'local'
	},

	activationCode: {
		type: String
	}
});

UserSchema.pre('save', function(next) {
	var user = this;

	if (!user.isModified('password')) {
		return next();
	}

	bcrypt.genSalt(10, function (err, salt) {
		if (err) {
			return next(err);
		}

		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) {
				return next(err);
			}

			user.password = hash;
			user.activationCode = Date.now().toString().substr(4, 4) + Date.now().toString().substr(6, 4) + Date.now().toString();
			next();
		});
	});
});

UserSchema.methods = {
	hasRole: function(role) {
		var roles = this.roles;
		roles.indexOf('admin') !== -1 || roles.indexOf(role) !== -1;
	},

	isAdmin: function() {
		return this.roles.indexOf('admin') !== -1;
	},

	comparePassword: function (candidatePassword, callback) {
		var user = this;
		bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
			if (err) {
				return callback(err);
			}

			callback(null, isMatch);
		});
	}
};

mongoose.model("User", UserSchema);