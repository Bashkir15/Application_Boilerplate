import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import json from '../helpers/json';
var User = mongoose.model('User');

module.exports = function() {
	var obj = {};

	obj.create = function (req, res) {
		var roles = ['authenticated'];

		/**
		 *
		 	Check if there are any users,
		 	if not, the first user should be
		 	the Admin
		**/

		User.count({}, (err, len) => {
			if (len) {
				roles.push('admin');
			}

			var user = new User(req.body);
			var token = jwt.sign(user, global.config.secret, { expiresInMinutes: 180});
			user.provider = 'local';
			user.roles = roles;
			user.save((err, user) => {
				if (err) {
					return json.bad(err, res);
				}

				json.good({
					record: user,
					token: token
				}, res);
			});
		});
	};

	obj.authenticate = function (req, res) {
		User.findOne({email: req.body.email}, function (err, user) {
			if (err) {
				return json.bad(err, res);
			}

			if (user.isLocked) {
				return user.incorrectLoginAttempts((err) => {
					if (err) {
						return json.bad(err, res);
					}

					json.bad({message: 'Sorry, you have reached the maximum number of login attempts and your account is locked until ' + user.lockUntil}, res);
				});
			}

			if (user.secureLock) {
				return json.bad({message: 'Sorry, you account has reached the login limit several times and for your security the account has been locked until further notice. Please contact us so we can get the straightened out.'}, res);
			}

			//	test for matching password

			user.comparePassword(req.body.password, (err, isMatch) => {
				if (err) {
					return json.bad(err, res);
				}

				if (isMatch) {
					var token = jwt.sign(user, global.config.secret, { expiresInMinutes: 180 });
					//if there is no lock or failed attempts, just return the user

					if (!user.loginAttempts && !user.lockUntil && !user.secureLock) {
						return json.good({
							record: user,
							token: user.token
						}, res);
					}

					var updates = {
						$set: { loginAttempts: 0, limitReached: 0},
						$unset: { lockUntil: 1}
					};

					return user.update(updates, (err) => {
						if (err) {
							return json.bad(err, res);
						}

						json.good({
							record: user,
							token: token
						}, res);
					});
				}

				// otherwise the password is incorrect and we will increment our login attempts

				user.incorrectLoginAttempts((err) => {
					var totalAttempts;
					if (err) {
						return json.bad(err, res);
					}

					if (user.limitReached >= 2) {
						totalAttempts = 3;
					} else {
						totalAttempts = 5;
					}

					json.bad({message: 'Sorry, either your email or password are incorrect. You have ' + (totalAttempts - user.loginAttempts) + ' remaining until your account is locked.'}, res);
				});
			});
		});
	};

	return obj;
};