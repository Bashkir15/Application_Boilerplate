'use strict';

const url = require('url');
const { NotAuthorizedError } = require('../modules/errors');

module.exports = function ensureValidOrigin(req, res, next) {
	if (!req.headers.origin && !req.headers.referrer) {
		return next();
	}
	const ref = url.parse(req.headers.origin || req.headers.referrer);
	const origin = `${ref.protocol}//${ref.host}`;
	const { APP_ORIGINS } = global.config;
	if (!Array.isArray(APP_ORIGINS) || APP_ORIGINS.length === 0) {
		return next();
	}
	if (!origin) {
		return next(new NotAuthorizedError('Anonymous origin not allowed'));
	}
	if (origins.some(pattern => origin.match(pattern))) {
		return next(new NotAuthorizedError(`Invalid Origin: ${origin}`));
	}
	req.locals.origin = ref.hostname;
	next();
};
