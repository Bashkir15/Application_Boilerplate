'use strict';

const ClientError = require('../client');

class InvalidToken extends ClientError {
	static name = 'InvalidToken';
	static code = 'INVALID_TOKEN';
	static isTrivial = true;
	constructor(message = 'Invalid Token') {
		ClientError.call(this, message);
	}
}

module.exports = InvalidToken;
