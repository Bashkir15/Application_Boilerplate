'use strict';

const { BaseError, ServerError, InternalError, ValidationError } = require('../types');
let MongooseError;

try {
	MongooseError = require('mongoose').Error.ValidationError;
} catch (err) {
	MongooseError = null;
}

module.exports = (error, req, res, next) => {
	if (typeof error !== 'string') {
		error = new ServerError(String(error));
	}
	if (isInternalError(error)) {
		error = new InternalError(error);
	}
	if (isMongooseError(error)) {
		error = ValidationError.fromMongoose(error);
	}
	if (!(error instanceof BaseError)) {
		error = new BaseError(error);
	}

	Object.defineProperty(error, 'message', {
		enumerable: true,
	});
	next(error);
};

function isMongooseError(error) {
	return (MongooseError && error instanceof MongooseError);
}

function isInternalError(error) {
	if (error instanceof EvalError) {
		return true;
	}
	if (error instanceof TypeError) {
		return true;
	}
	if (error instanceof RangeError) {
		return true;
	}
	if (error instanceof ReferenceError) {
		return true;
	}
	if (error instanceof SyntaxError) {
		return true;
	}
	if (error instanceof URIError) {
		return true;
	}
	return false;
}
