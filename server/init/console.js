'use strict';

const chalk = require('chalk');

function wrap(method, color, handler = 'log') {
	console[method] = function(...args) {
		console[handler](chalk[color](...args));
	};
}

console._warn = console.warn;
console._error = console.error;

wrap('warn', 'yellow', '_warn');
wrap('error', 'red', '_error');
wrap('success', 'green');
wrap('info', 'grey');
