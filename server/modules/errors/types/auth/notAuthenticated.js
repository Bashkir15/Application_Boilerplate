'use strict';

const ClientError = require('../client');

class NotAuthenticated extends ClientError {
	static name = 'NotAuthenticatedError';
	static code = 'NOT_AUTHENTICATED';
	constructor(message = 'Not Authenticated') {
		ClientError.call(this, message, 403);
	}
}

module.exports = NotAuthenticated;
