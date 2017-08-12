'use strict';

const Token = require('../../../services/Token');
const ensureTokenUnused = require('./ensureTokenUnused');

module.exports = function validateToken(token) {
	if (!token) {
		return Promise.resolve(false);
	}
	return Token
		.validate(token)
		.then(ensureTokenUnused);
};
