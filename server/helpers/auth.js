module.exports = {
	ensureAuthorized: function (req, res, next) {
		var mongoose = require('mongoose');
		//var User = mongoose.model('User');
		var bearerToken;
		var bearerHeader = req.headers["authorization"];

		if (typeof bearerHeader !== 'undefined') {
			var bearer = bearerHeader.split(" ");
			bearerToken = bearer[1];
			req.token = bearerToken;

			jwt.verify(req.token, global.config.secret, (err, payload) => {
				if (err) {
					return next(err);
				}

				req.user = payload;
				next();
			});
		} else {
			return res.json(403, 'Sorry, you need to be logged in');
		}		
	},

	justGetUser: function (req, res, next) {
		var mongoose = require('mongoose');
		var bearerToken;
		var bearerHeader = req.headers["authorization"];

		if (typeof bearerHeader !== 'undefined') {
			var bearer = bearerHeader.split(" ");
			bearerToken = bearer[1];
			req.token = bearerToken;

			jwt.verify(req.token, global.config.secret, (err, payload) => {
				if (err) {
					return next(err);
				}

				req.user = payload;
				next();
			});
		}
	}
};