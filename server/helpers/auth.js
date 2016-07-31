import jwt from 'jsonwebtoken';

module.exports = {
	ensureAuthorized: function (req, res, next) {
		var mongoose = require('mongoose');
		var User = mongoose.model('User');
		var bearerToken;
		var bearerHeader = req.headers["authorization"];

		if (typeof bearerHeader !== 'undefined') {
			var bearer = bearerHeader.split(" ");
			bearerToken = bearer[1];
			req.token = bearerToken;

			User.findOne({token: req.token})
			.populate('following')
			.exec((err, user) => {
				if (err || !user) {
					return res.sendStatus(403);
				}

				req.user = user;
				next();
			});

		} else {
			return res.sendStatus(403);
		}		
	},

	justGetUser: function (req, res, next) {
		var mongoose = require('mongoose');
		var User = mongoose.model("User");
		var bearerToken;
		var bearerHeader = req.headers["authorization"];

		if (typeof bearerHeader !== 'undefined') {
			var bearer = bearerHeader.split(" ");
			bearerToken = bearer[1];
			req.token = bearerToken;

			User.findOne({token: req.token})
			.populate('following')
			.exec((err, user) => {
				if (user) {
					req.user = user;
				}

				next();
			});
		}
	}
};