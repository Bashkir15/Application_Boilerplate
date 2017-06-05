const jwt = require('jsonwebtoken');
const APIError = require('./APIError');


const wrapSecret = secret => cb => secret;

module.exports = (options) => {
    const obj = {};

    let { required, secret } = options;

    if (!options || !options.secret) {
        throw new Error('There is no secret set');
    }

    if (typeof required === 'undefined') {
        required = true;
    }

    if (typeof secret !== 'function') {
        secret = wrapSecret(secret);
    }

    obj.middleware = (req, res, next) => {
        let token;
        let decoded;

        if (req.headers && req.headers.authorization) {
            const parts = req.headers.authorization.split(' ');
            const [ scheme, bearer ] = parts;

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

       /* return async () => {
            const arity = secret.length;

            try {
                if (arity == 4) {
                    secret(req, decoded.header, decoded.userId);
                } else {
                    secret(req, decoded.userId);
                }
            } catch (err) {
                throw new Error(err);
            }
        }
        .then(() => {
            jwt.verify(token, secret, (err) => {
                if (err && required) {
                    return next(new APIError({
                        status: 403,
                    }));
                } 

                req.userId = decoded.userId;
                return next();
            });
        }); */
    };

    return obj;
};
