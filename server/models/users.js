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

	following: [{
		type: mongoose.Schema.ObjectId,
		requried: true,
		ref: 'User'
	}],

	profileViews: {
		type: Number,
		default: 0
	},

	socketId: {
		type: String,
		default: ''
	},

	loggedIn: {
		type: Boolean,
		default: false
	},

	activationCode: {
		type: String
	},

	loginAttempts: {
		type: Number,
		required: true,
		default: 0
	},

	lockUntil: {
		type: Number
	},

	limitReached: {
		type: Number,
		required: true,
		default: 0
	},

	secureLock: {
		type: Boolean,
		default: false
	},

	resetPasswordToken: String,
	resetPasswordExpires: Date
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

UserSchema.virtual('isLocked').get(function() {
	// check for a lockUntil timestamp

	return !!(this.lockUntil && this.lockUntil > Date.now());
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
	},

	incorrectLoginAttempts: function (callback) {
		// If there has been a previous lock that has since expired, reset to 1

		if (this.lockUntil && this.lockUntil < Date.now()) {
			return this.update({
				$set: { loginAttempts: 1, limitReached: 0 },
				$unset: { lockUntil: 1 }
			}, callback);
		}

		// Otherwise, we will increment the login attempts

		var updates = {
			$inc: { loginAttempts: 1 }
		};

		// then we will lock the account if the limit has been reached if it is not locked already

		if (this.loginAttempts + 1 > 5 && !this.isLocked) {
			updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000, limitReached: 1}
		}

		// if they have reached the limit more than once, we will increase the lock time

		if (this.loginAttempts + 1 > 5 && this.limitReached == 1 && !this.isLocked) {
			updates.$set = { lockUntil: Date.now() + 4 * 60 * 60 * 1000, limitReached: 2}
		}

		if (this.loginAttempts + 1 > 3 && this.limitReached == 2 && !this.isLocked) {
			updates.$set = { lockUntil: Date.now() + 8 * 60 * 60 * 1000, limitReached: 3}
		}

		// If the user reaches the third limit and still fails, their account must be manually unlocked

		if (this.loginAttempts + 1 > 3 && this.limitReached == 3 && !this.isLocked) {
			updates.$set = { lockUntil: Date.now() + 10000 * 60 * 60 * 1000, limitReached: 4, secureLock: true}
		}

		return this.update(updates, callback);
	},

	toJSON: function() {
		var obj = this.toObject();
		delete obj.password;
		delete obj.activationCode;
		delete obj.following;
	}
};

mongoose.model("User", UserSchema);