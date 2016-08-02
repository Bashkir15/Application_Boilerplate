import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import json from '../helpers/json';
import crypto from 'crypto';
import async from 'async';
import nodemailer from 'nodemailer';
import mailer from '../helpers/mailer';

var User = mongoose.model('User');



/**

	~~  Contents  ~~


	Authentication Methods: {
		obj.create = User Creation,
		obj.authentication = Login User,
		obj.forgot = Send User Reset Token,
		obj.processReset = Reset User Password
	}

	User Actions: {
		obj.single = Return A Single User,
		obj.follow = Follow A User,
		obj.unfollow = Unfollow A User,
		obj.profile = View Profile & Increment profileViews
		obj.editProfile = Edit Profile Info
	}

	User Utilities: {
		obj.search = Keyword Search For Users,
		obj.recent = Last 20 Users Created
	}

	Admin Methods: {
		obj.destroy = Delete A User Permenantly
	}
	
	
   *
**/


module.exports = function() {
	var obj = {};

/*********************************************************************************************

									Authentication Methods

**********************************************************************************************



	/**
	  *
	   Create a new User
	  *
	**/



	obj.create = function (req, res) {
		var roles = ['authenticated'];

		/**
		 *
		 	Check if there are any users,
		 	if not, the first user should be
		 	the Admin
		**/

		User.count({}, function (err, len) {
			if (!len) {
				roles.push('admin');
			}

			var user = new User(req.body);
			user.token = jwt.sign(user, global.config.secret);
			user.provider = 'local';
			user.roles = roles;
			user.save(function (err) {
				if (err) {
					return json.bad(err, res);
				}



				json.good({
					record: user,
					token: user.token
				}, res);
			});
		});
	};




	/**
	  *
	  	Login in an existing User
	  *
	 **/




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

					return user.update(updates, (err, item) => {
						if (err) {
							return json.bad(err, res);
						}

						json.good({
							record: user,
							token: user.token
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




	/**
	  *
	  	Send the user an email with a resetToken to reset their password
	  *
	**/




	obj.forgot = function (req, res) {
		async.waterfall([
				function (done) {
					crypto.randomBytes(20, (err, buf) => {
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
					var mailTransport = nodemailer.createTransport({
						service: global.config.mailer.service,
						auth: {
							user: global.config.mailer.auth.user,
							pass: global.config.mailer.auth.pass
						}
					});

					var mailOptions = {
						to: user.email,
						from: global.config.mailer.user,
						subject: 'Your password reset',
						text: user.resetPasswordToken
					};

					mailTransport.sendMail(mailOptions, (err, info) => {
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
			}
		);
		/*User.findOne({email: req.body.email}, (err, user) => {
			if (err) {
				return json.bad(err, res);
			}

			if (!user) {
				return json.bad({message: 'Sorry, there is no user with that email'}, res);
			}


			var mailTransport = nodemailer.createTransport({
				service: global.config.mailer.service,
				auth: {
					user: global.config.mailer.auth.user,
					pass: global.config.mailer.auth.pass
				}
			});

			var mailOptions = {
				to: user.email,
				from: global.config.mailer.user,
				subject: 'Your password reset',
				text:  user.activationCode
			};

			mailTransport.sendMail(mailOptions, (error, info) => {
				if (err) {
					return json.bad(err, res);
				}

				json.good({
					record: user
				}, res);
			});
		});
		async.waterfall([
			function (done) {
				crypto.randomBytes(20, (err, buf) => {
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
		}); */
	};




	/**
	  *
	  	If the user sends back the correct resetToken, allow them to reset their password and then confirm by email
	  *
	**/




	obj.processReset = function (req, res) {
		async.waterfall([
			function (done) {
				User.findOne({resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now()}}, function (err, user) {
					if (err) {
						return json.bad(err, res);
					}

					if (!user) {
						return json.bad({message: 'The password reset token is invalid or has expired, please try again'}, res);
					}

					user.password = req.body.password
					user.resetPasswordToken = undefined;
					user.resetPasswordExpires = undefined;

					user.save((err) => {

						if (err) {
							return json.bad(err, res);
						}

						json.good({
							record: user,
							token: user.token
						}, res);
					});
				});
			},

			function (user, done) {
				var mailTransport = nodemailer.createTransport({
					service: global.config.mailer.service,
					auth: {
						user: global.config.mailer.auth.user,
						pass: global.config.mailer.auth.pass
					}
				});
				var mailOptions = {
					to: user.email,
					from: global.config.mailer.auth.user,
					subject: 'Your password has been changed',
					text: 'This is a confirmation to let you know that the password for your account with the email ' + user.email + ' has just been changed'
				};

				mailTransport.sendMail(mailTransport, (err, info) => {
					done(err, 'done');
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







/*********************************************************************************************

									User Actions

**********************************************************************************************




	/**
	  *
	  	Find a single user by their username
	  *
	 **/




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




	/**
	  *
	  	Find a user by their username and follow them if you are not already
	  *
	**/




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




	/**
	  *
	  	Find a user by their username and unfollow them if you are not already
	  *
	**/





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




	/**
	  *
	  	Find a user by their usernames and return their profile. This method is different from the .single method because
	  	it will properly count profileViews instead of incrementing them everytime the single method gets called regardless
	  	of whether it is a profile of not
	  *
	**/




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




	/**
	  *
	  	Find a user by their usernames and then update their profile information, or if no information is provider
	  	return their default infomation
	  *
	**/

	obj.editProfile = function (req, res) {
		User.findOne({username: req.params.username})
		.exec((err, user) => {
			if (err) {
				return json.bad(err, res);
			}

			user.gender = req.body.gender || user.gender;
			user.phone = req.body.phone || user.phone;
			user.occupation = req.body.occupation || user.occupation;
			user.bio = req.body.bio || user.bio;
			user.save((err) => {
				if (err) {
					return json.bad(err, res);
				}

				json.good({
					record: user
				}, res);
			});
		});
	};




/*********************************************************************************************

									User Utilities 

*********************************************************************************************/




	/**
	  *
	  	Take a keyword and search (global and case-insensitive) for either only usernames matching 
	  	the keyword or either usernames or names matching the keyword and responds with those users
	  *
	**/





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





	/**
	  *
	  	Searches the entire user collection and returns the last 20 users created.
	  *
	**/



	

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





/*********************************************************************************************

									Admin Methods 

*********************************************************************************************/




	
	/**
	  *
	  	Find one user by their username and delete them permenantly
	  *
	**/





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