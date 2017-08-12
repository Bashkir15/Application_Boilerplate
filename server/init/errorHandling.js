'use strict';

const errors = require('../modules/errors/index');
const sentry = require('../services/Raven');
const { NODE_ENV, SENTRY_DSN, SENTRY_CONFIG, ERROR_MIDDLEWARE } = process.env;

if (NODE_ENV !== 'production') {
	Error.stackTraceLimit = Infinity;
}

if (SENTRY_DSN) {
	sentry(SENTRY_DSN, SENTRY_CONFIG);
}

errors.use(ERROR_MIDDLEWARE.concat(['send']));
