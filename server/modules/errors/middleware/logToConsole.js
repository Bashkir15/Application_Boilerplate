'use strict';

const chalk = require('chalk');
const types = require('../types');
const { ReportedError } = types;

module.exports = function(error, req, res, next) {
	if (error instanceof ReportedError) {
		return next();
	}
	if (error.stack && !error.isTrivial) {
		console.log(chalk.red(error.stack));
	} else {
		console.log(chalk.red(`${error.name} ${error.message ? ': `${error.message}`' : ''}`));
	}
	next(error);
};
