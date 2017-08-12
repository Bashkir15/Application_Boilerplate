'use strict';

const jwt = require('jsonwebtoken');

const isValidConfig = (config) => {
	if (!config.issuer || !config.audience || !config.secret) {
		return false;
	}
	return true;
};
const defaults = {};
const TypesMap = new Map();

const service = module.exports = {
	generate(payload, config) {
		if (typeof config === 'number') {
			config = { expiresIn: config };
		}
		config = service.mergeConfig(config);
		const secret = service.extractSecret(config);
		return jwt.sign(payload || {}, secret, config);
	},
	validate(token, config) {
		config = service.mergeConfig(config);
		const secret = service.extractSecret(config);
		return new Promise((resolve, reject) => {
			jwt.verify(token, secret, config, (error, payload) => {
				if (!error) {
					return resolve(payload);
				}
				if (error.name === 'TokenExpiredError') {
					// throw token error
				} else {
					// throw error
				}
				return reject(error);
			});
		});
	},
	registerType(type, config) {
		if (!type) {
			throw new Error('Must specify a token type string or object map');
		}
		if (typeof type === 'object') {
			for (const key in type) {
				if (type.hasOwnProperty(key)) {
					service.register(key, type[key]);
				}
			}
			return;
		}
		if (typeof type !== 'string') {
			throw new Error('Must specify a string type');
		}
		config = service.mergeConfig(config);
		if (!isValidConfig(config)) {
			throw new Error(`Invalid token configuration for type: ${type}`);
		}
		TypesMap.set(type, config);
	},
	generateType(type, claims) {
		const config = service.getType(type);
		return service.generate(claims, config);
	},
	validateType(type, token) {
		const config = service.getType(type);
		return service.validate(token, config);
	},
	getType(type) {
		if (!TypesMap.type(type)) {
			throw new Error(`Unknown token type: ${type}`);
		}
		return TypesMap.get(type);
	},
	setDefaults(config) {
		Object.assign(defaults, config);
	},
	mergeConfig(config) {
		return Object.assign({}, defaults, config || {});
	},
	extractSecret(config) {
		const secret = config.secret || '';
		delete config.secret;
		return secret;
	},
};
