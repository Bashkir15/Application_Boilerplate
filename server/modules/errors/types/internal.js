'use strict';

const BaseError = require('./base');

class InternalError extends BaseError {
	static name = 'InternalError';
	static code = 'INTERNAL_ERROR';
	constructor(error) {
		BaseError.call(this, error);
	}
}

module.exports = InternalError;
