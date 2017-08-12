'use strict';

const service = {
	middlewares: {},
	types: ['normalize', 'log-to-console', 'send'],
	register(key, handler) {
		service.middlewares[key] = handler;
	},
	use(types) {
		if (!Array.isArray(types)) {
			throw new Error('Must declare a types array');
		}
		service.types = types;
	},
	middleware(types = service.types) {
		return types
			.map(type => service.middlewares[type])
			.filter(handler => !!handler);
	},
	handler(error, req) {
		const stack = service.middleware();
		if (stack.length === 0) {
			return;
		}

		let i = 0;
		const next = (error) => {
			if (stack[i] && typeof stack[i] === 'function') {
				stack[i++](error, req, null, next);
			}
		};
		next(error);
	}
};

const path = './middleware/';
const middleware = ['normalize', 'log-to-console', 'send', 'sentry-track'];
middleware.forEach(name => service.register(name, require(path + name)));

const types = require('./types');
for (const type in types) {
	if (types.hasOwnProperty(type)) {
		service[type] = types[type];
	}
}

module.exports = service;
