'use strict';

const BaseError = require('./base');

class ClientError {
	static name = 'ClientError';
	static status = 400;
	constructor(message = 'Client Error', data, status) {
		if (data && typeof data === 'number') {
			status = data;
			data = null;
		}
		if (status && status >= 400 && status <= 499) {
			this.status = status;
		}
		BaseError.call(this, message, data);
	}
}

module.exports = ClientError;
