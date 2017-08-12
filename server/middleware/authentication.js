'use strict';

const passport = require('passport');
const errors = require('../modules/errors');
const { ExpiredTokenError, InvalidTokenError } = errors;

module.exports = function authenticate(req, res, next) {
	passport.authenticate('bearer', {
		session: false,
	}, (error, user, claims) => {
		if (error instanceof ExpiredTokenError) {
			return next();
		}
		if (error instanceof InvalidTokenError) {
			return next();
		}
		if (error) {
			return next(error);
		}
		if (claims) {
			req.claims = claims;
		}
		next();
	})(req, res, next);
};
