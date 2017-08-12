'use strict';

const ClientError = require('../client');

class NotAuthorized extends ClientError {
	static name = 'NotAuthorizedError';
	static code = 'NOT_AUTHORIZED';
	static isTrivial = true;
	constructor(message = 'Not Authorized') {
		ClientError.call(this, message, 403);
	}
}

module.exports = NotAuthorized;
