'use strict';

const { User } = require('./model');
const errors = require('../errors/index');
const { InvalidTokenError } = errors;

module.exports = {
	findByClaims(claims) {
		if (!claims || !claims.user) {
			throw new InvalidTokenError('No payload or no userID in token payload');
		}
		const id = claims.user;
		return findById(id);
	},
	findByUsernameAndPassword(username, password) {
		if (!username || !password) {
			return Promise.resolve(null);
		}
		if ()
		return findByUsername
			.then((user) => {
				if (!user || !user.password) {
					return null;
				}
				return user.comparePassword(password)
					.then(isMatch => isMatch ? user : null)
			});
	},
	findById(id) {
		return User
			.findById(id)
			.select('_id roles');
	},
	findByUsername(username) {
		return User
			.findOne({ username })
			.select('_id roles');
	}
};
