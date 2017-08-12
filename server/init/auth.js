'use strict';

const { resolve } = require('path');
const glob = require('glob');
const chalk = require('chalk');

console.log('Loading authentication strategies');
glob.sync('./server/modules/auth/strategies/**/*.js')
	.forEach((strategyPath) => {
		console.log(chalk.grey(' - %s'), strategyPath.replace('./server/', ''));
		require(resolve(strategyPath))();
	});
	