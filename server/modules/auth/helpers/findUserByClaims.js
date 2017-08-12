'use strict';

const { findByClaims } = require('../../users/service');

module.exports = function findUserByClaims(claims) {
	if (!claims) {
		return Promise.resolve([false, null]);
	}
	return findByClaims(claims)
		.then((user) => {
			if (!user) {
				throw new Error('NO user!');
			}
			return [user, claims];
		});
};
