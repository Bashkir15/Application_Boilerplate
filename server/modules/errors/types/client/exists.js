'use strict';

const ClientError = require('../client');

class ExistsError extends ClientError {
	static name = 'ExistsError';
	static code = 'EXISTS';
	static isTrivial = true;
	constructor(message = 'Already Exists', data) {
		ClientError.call(this, message, data, 409);
	}
}

module.exports = ExistsError;
