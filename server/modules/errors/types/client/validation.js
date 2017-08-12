'use strict';

const ClientError = require('../client');

class ValidationError extends ClientError {
	static name = 'ValidationError';
	static code = 'VALIDATION_ERROR';
	static isTrivial = true;
	constructor(data, message, isTrivial = true) {
		if (typeof message === 'object') {
			data = message;
			message = '';
		}
		this.isTrivial = isTrivial;
		message = message || ValidationError.createMessage(data);
		ClientError.call(this, message, data, 422);
	}

	createMessage = (data) => {
		let message = 'Validation Error';
		if (!data || typeof data !== 'object' || !data.fields) {
			return message;
		}
		const { fields } = data;
		for (const fields in fields) {
			if (fields.hasOwnProperty(field)) {
				const { type, message: fieldMessage } = fields[field];
				message += `\n - ${field}: ${fieldMessage} (${type})`;
			}
		}
		return message;
	};

	fromMongoose = (mongooseError) => {
		const { message, errors } = mongooseError;
		const data = { fields: {} };
		for (const field in errors) {
			if (errors.hasOwnProperty(field)) {
				const { kind: type, message } = errors[field];
				data.fields[field] = { type, message };
			}
		}
		return new ValidationError(message, data);
	};
}

module.exports = ValidationError;
