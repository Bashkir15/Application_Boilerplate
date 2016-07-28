import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import json from '../helpers/json';
import crypto from 'crypto';
import async from 'async';
import nodemailer from 'nodemailer';
import mailer from '../helpers/mailer';

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
			var token = jwt.sign(user, global.config.secret, { expiresIn: 10800});
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
					var token = jwt.sign(user, global.config.secret, { expiresInMinutes: 10800 });
					//if there is no lock or failed attempts, just return the user

					if (!user.loginAttempts && !user.lockUntil && !user.secureLock) {
						
							return json.good({
								record: user,
								token: token
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

	obj.single = function (req, res) {
		User.findOne({username: req.params.username})
		.populate('following')
		.exec(function (err, user) {
			if (err) {
				return json.bad(err, res);
			} else if (user) {
				var alreadyFollowing;

				// check if the user requesting this is following the user being requested

				var isInArray = req.user.following.some((follow) => {
					return follow.equals(user._id);
				});

				if (isInArray) {
					alreadyFollowing = true;
				} else {
					alreadyFollowing = false;
				}

				user.save(function (err, item) {
					if (err) {
						return json.bad(err, res);
					}

					json.good({
						record: item,
						alreadyFollowing: alreadyFollowing
					}, res);
				});
			} else {
				return json.bad({message: 'Sorry, that user could not be found'}, res);
			}
		});
	};

	obj.follow = function (req, res) {
		var currentUser = req.user;
		var toFollow = req.params.name;

		User.findOne({username: req.params.username})
		.populate('following')
		.exec(function (err, user) {
			if (err) {
				return json.bad(err, res);
			} else {
				if (currentUser.following.indexOf(user._id) !== -1) {
					return json.bad({message: 'Sorry, you are already following that user'}, res);
				}

				currentUser.following.push(user._id);
				currentUser.save((err, item) => {
					if (err) {
						return json.bad(err, res);
					}

					json.good({
						record: item
					}, res);
				});
			}
		});
	};

	obj.unfollow = function (req, res) {
		var currentUser = req.user;
		var toUnfollow = req.params.name;

		User.findOne({username: req.params.username})
		.populate('following')
		.exec((err, user) => {
			if (err) {
				return json.bad(err, res);
			} else {
				if (currentUser.following.indexOf(user._id) !== -1) {
					currentUser.following.splice(currentUser.indexOf(user._id), 1);
					currentUser.save((err, item) => {
						if (err) {
							return json.bad(err, res);
						}

						json.good({
							record: item
						}, res);
					});
				} else {
					return json.bad({message: 'Sorry, you are not following that user'}, res);
				}
			}
		});
	};

	obj.profile = function (req, res) {
		User.findOne({username: req.params.username})
		.populate('following')
		.exec((err, user) => {
			if (err) {
				return json.bad(err, res);
			}

			user.profileViews += 1;
			user.save((err, item) => {
				if (err) {
					return json.bad(err, res);
				}

				json.good({
					record: item
				}, res);
			});
		});
	};

	obj.search = function (req, res) {
		var keyword = req.params.keyword;
		var criteria = {};

		if (req.query.onlyUsernames) {
			criteria = {
				username: new RegExp(keyword, 'ig')
			};
		} else {
			criteria = {
				$or: [

					{
						name: new RegExp(keyword, 'ig')
					},

					{
						username: new RegExp(keyword, 'ig')
					}
				]
			};
		}

		// Don't let the user search for themselves

		criteria._id = { $ne: req.user._id};

		User.find(criteria, null).exec((err, items) => {
			if (err) {
				return json.bad(err, res);
			}

			json.good({
				items: items
			}, res);
		});
	};

	obj.forgot = function (req, res) {
		async.waterfall([
			function (done) {
				crypto.randomBytes(20, (err, buff) => {
					var token = buf.toString('hex');
					done(err, token);
				});
			},

			function (token, done) {
				User.findOne({email: req.body.email}, (err, user) => {
					if (!user) {
						return json.bad({message: 'Sorry, there is no user with that email'}, res);
					}

					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + 3600000;

					user.save((err) => {
						done(err, token, user);
					});
				});
			},

			function (token, user, done) {
				var mailTransport = mailer.transport;
				var mailOptions = {
					to: user.email,
					from: 'authentication.boilerplate@gmail.com',
					subject: 'You account password reset',
					text: 'You are receiving this because you (or someone else) has requested to reset your password. Please click on \n\n' +
					'Please click on the following link or paste it into your browser to complete the process \n\n' + 
					'http://' + global.config.host + global.config.port + '/reset/' + token + '\n\n' + 
					'if you did not send this, ignore and your password will remain unchanged'
				};

				mailTransport.sendMail(mailOptions, (err) => {
					done(err, 'done');
				});
			}
		], function (err) {
			var success = true;

			if (err) {
				return json.bad(err, res);
			}

			json.good({
				record: success
			}, res);
		});
	};

	obj.processReset = function (req, res) {
		async.waterfall([
			function (done) {
				User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}}, function (err, user) {
					if (err) {
						return json.bad(err, res);
					}

					if (!user) {
						return json.bad({message: 'The password reset token is invalid or has expired, please try again'}, res);
					}

					user.password = req.body.password;
					user.resetPasswordToken = undefined;
					user.resetPasswordExpires = undefined;

					user.save((err) => {
						var token = jwt.sign(user, global.config.secret, { expiresIn: 10800});

						if (err) {
							return json.bad(err, res);
						}

						json.good({
							record: user,
							token: token
						}, res);
					});
				});
			},

			function (user, done) {
				var mailTransport = mailer.transport;
				var mailOptions = {
					to: user.email,
					from: 'authenticaton.boilerplate@gmail.com',
					subject: 'Your password has been changed',
					text: 'This is a confirmation to let you know that the password for your account with the email ' + user.email + ' has just been changed'
				};

				mailTransport.sendMail(mailTransport, (err) => {
					done(err);
				});
			}
		], function (err) {
			if (err) {
				return json.bad(err);
			}

			json.good({
				record: user
			}, res);
		});
	};

	obj.recent = function (req, res) {
		User.find({}).sort({'created': -1}).limit(20)
		.exec((err, users) => {
			if (err) {
				return json.bad(err, res);
			}

			json.good({
				records: users
			}, res);
		});
	};

	obj.destroy = function (req, res) {
		User.findOne({username: req.params.username}, (err, user) => {
			if (err) {
				return json.bad(err, res);
			}

			if (!req.user.isAdmin) {
				res.sendStatus(403);
			}

			user.remove((err) => {
				if (err) {
					return json.bad(err, res);
				}

				json.good({}, res);
			});
		});
	};

	return obj;
};