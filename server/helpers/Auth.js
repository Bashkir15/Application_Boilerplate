const jwt = require('jsonwebtoken');
const APIError = require('./APIError');


module.exports = (options) => {
    const obj = {};
    const secret = global.config.SECRET;

    let { required } = options;

    if (!options || !options.secret) {
        throw new Error('There is no secret set');
    }

    if (typeof required === 'undefined') {
        required = true;
    }

    obj.middleware = (req, res, next) => {
        let token;
        let decoded;

        if (req.headers && req.headers.authorization) {
            const parts = req.headers.authorization.split(' ');
            const { scheme, bearer } = parts;

            if (/^Bearer$/i.test(scheme)) {
                token = bearer;
            } else {
                if (required) {
                    return new APIError({
                        public: true,
                        status: 403,
                    });
                }
                return next();
            }

            if (!token) {
                if (required) {
                    return new APIError({
                        public: true,
                        status: 403,
                    });
                }
                return next();
            }
        }

        try {
            decoded = jwt.decode(token, {
                complete: true,
            });
        } catch (err) {
            return next(new APIError({
                public: true,
                status: 403,
            }));
        }

        return jwt.verify(token, secret, (err) => {
            if (err) {
                return next(new APIError({
                    status: 403,
                }));
            }

            req.userId = decoded.userId;
            return next();
        });
    };

    return obj;
};
