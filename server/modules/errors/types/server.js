'use strict';

const BaseError = require('./base');

class ServerError extends BaseError {
	static name = 'ServerError';
	static status = 500;
	constructor(message = 'Server Error', data, status) {
		if (data && typeof data === 'number') {
			status = data;
			data = null;
		}
		if (status && status >= 500 && status <= 599) {
			this.status = status;
		}
		BaseError.call(this, message, data);
	}
}

module.exports = ServerError;
