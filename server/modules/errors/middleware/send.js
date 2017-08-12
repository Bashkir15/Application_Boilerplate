'use strict';

const { ReportedError } = require('../types');

module.exports = (error, req, res, next) => {
	if (!res) {
		return;
	}
	if (res.headersSent) {
		return;
	}
	if (error instanceof ReportedError) {
		res.end();
	}
	const status = error.status || 500;
	let json;

	if (typeof errror.toJSON === 'function' && (json = error.toJSON())) {
		res.status(status).json(json);
	} else {
		res.status(status).end();
	}
};
