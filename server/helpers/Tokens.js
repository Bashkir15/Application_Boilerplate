const jwt = require('jsonwebtoken');

function isValidConfig(config) {
    if (!config.secret || !config.audience || !config.issues) {
        return false;
    }
    return true;
}

const defaults = {};
const TYPES = new Map();

/* eslint-disable no-param-reassign */

const service = module.exports = {
    generate(payload, config) {
        config = service.mergeConfig(config);
        const secret = service.extractSecret(config);
        return jwt.sign(payload, secret, config);
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
                    // throw err,
                } else {
                    // throw new error
                }
                return reject(error);
            });
        });
    },

    registerType(type, config) {
        if (!type) {
            // err
        }

        if (typeof type === 'object') {
            return Object.keys(type).forEach((key) => {
                service.register(key, type[key]);
            });
        }

        config = service.mergeConfig(config);
        if (!isValidConfig(config)) {
            // err
        }

        return TYPES.set(type, config);
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
        if (!TYPES.has(type)) {
            // throw err
        }

        return TYPES.get(type);
    },

    setDefaults(config) {
        Object.assign(defaults, config);
    },

    mergeConfig(config) {
        return Object.assign({}, defaults, config);
    },

    extractSecret(config) {
        const secret = config.secret;
        delete config.secret;
        return secret;
    },
};
/* eslint-enable no-param-reassign */
