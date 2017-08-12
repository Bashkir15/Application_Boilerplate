'use strict';

const ClientError = require('../client');

class BadRequest extends ClientError {
	static name = 'BadRequestError';
	static code = 'BAD_REQUEST';
	constructor(message = 'Bad Request') {
		ClientError.call(this, message);
	}
}

module.exports = BadRequest;
