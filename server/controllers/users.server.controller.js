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

		User.count({}, function (err, len) {
			if (len) {
				roles.push('admin');
			}

			var user = new User(req.body);
			var token = jwt.sign(user, global.config.secret, { expiresInMinutes: 180});
			user.provider = 'local';
			user.roles = roles;
			user.save(function (err, user) {
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

	return obj;
};