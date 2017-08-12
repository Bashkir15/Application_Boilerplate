'use strict';

const Raven = require('raven');
let client = null;

module.exports = function(DSN, config = {}, cb) {
	if (!client && !DSN) {
		throw new Error('eep');
	}
	if (!config.environment) {
		config.enviroment = process.env.NODE_ENV;
	}
	if (DSN) {
		cb = cb || function() {
			console.log('exiting due to uncaught exception');
			process.exit(1);
		};

		Raven.config(DSN, config).install(cb);
		client = Raven;
	}
	return client;
}
