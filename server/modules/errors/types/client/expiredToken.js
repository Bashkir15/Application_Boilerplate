'use strict';

const InvalidTokenError = require('./invalidToken');

class ExpiredToken extends InvalidTokenError {
	static name = 'ExpiredTokenError';
	static code = 'EXPIRED_TOKEN';
	constructor(message = 'Token Expired') {
		InvalidTokenError.call(this, message);
	}
}

module.exports = ExpiredToken;
