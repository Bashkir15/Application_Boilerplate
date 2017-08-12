'use strict';

const ClientError = require('../client');

class NotFound extends ClientError {
	static name = 'NotFoundError';
	static code = 'NOT_FOUND_ERROR';
	static isTrivial = true;
	constructor(message = 'Not Found') {
		ClientError.call(this, message);
	}
}

module.exports = NotFound;
