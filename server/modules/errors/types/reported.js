'use strict';

const BaseError = require('./base');

class ReportedError extends BaseError {
	static name = 'ReportedError';
	constructor(message, stack, origin = 'client', context) {
		this.stack = stack;
		this.origin = origin;
		if (context) {
			this.context = context;
		}
		BaseError.call(this, message);
	}
}

module.exports = ReportedError;
