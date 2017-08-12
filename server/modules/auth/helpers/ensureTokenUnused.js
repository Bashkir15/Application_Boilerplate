'use strict';

const Token = require('../../../services/Token');
const { UsedToken } = require('../tokenModel');

module.exports = function ensureTokenUnused(claims) {
	return UsedToken
		.checkIfUsed(claims)
		.then((used) => {
			if (used) {
				throw new Error('used');
			}
			return claims;
		});
};
