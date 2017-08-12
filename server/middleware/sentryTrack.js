'use strict';

const raven = require('../services/Raven');

module.exports = (error, req, res, next) => {
	if (error.isTrivial) {
		return next(error);
	}
	const client = raven();
	const data = {};
	client.setUserContext();

	if (req) {
		const user = req.me;
		const serverUrl = req.originalUrl;
		const clientUrl = req.headers.referrer;
		const clientVersion = req.headers['x-header'];
		const { body, query, headers } = req;
		const method = req.method.toUpperCase();

		data.extra = {
			serverUrl, clientUrl, clientVersion, body, query,
			headers, method,
		};

		if (user && user._id) {
			client.setUserContext({ id: user._id.toString()});
		}
	}

	client.captureException(error);
	next(error);
};
