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

module.exports = {
    setDefaults(config) {
        Object.assign(defaults, config);
    },

    register(type, config) {
        if (!type) {
            return;
        }

        if (typeof type === 'object') {
            return Object.keys(type).forEach(key => {
                this.register(key, type[key]);
            });
        }

        const mergedConfig = Object.assign({}, defaults, config);
        if (!isValidConfig(mergedConfig)) {
            // throw err
        }

        TYPES.set(type, mergedConfig);
    },

    generate(type, claims) {
        if (!TYPES.has(type)) {
            console.log('unknown token')
        }

        let config = TYPES.get(type);
        return jwt.sign(claims, config.secret, {
            audience: config.audience,
            issuer: config.issuer,
            expiresIn: config.expiration,
        });
    },

    validate(type, token) {
        if (!TYPES.has(type)) {
            return Promise.reject(
                // throw err
            );
        }

        const config = TYPES.get(type);

        return new Promise((resolve, reject) => {
            jwt.verify(token, config.secret, {
                audience: config.audience,
                issuer: config.issuer,
            }, (error, payload) => {
                if (!error) {
                    return resolve(payload);
                }
                if (error.name === 'TokenExpiredError') {
                    // throw err
                } else {
                    // throw err
                }
                return reject(error);
            });
        });
    },

    getExpiration(type) {
        if (!TYPES.has(type)) {
            // throw err
        }

        let config = TYPES.get(type);
        return config.expiration || 0;
    },

    getId(payload) {
        if (!payload || !payload.id) {
            // throw err
        }
        return payload.id;
    },
};
/* eslint-enable no-param-reassign */
