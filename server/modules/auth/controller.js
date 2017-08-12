'use strict';

const passport = require('passport');
const moment = require('moment');
const { ObjectId } = require('mongoose').Types;
const Token = require('../../services/Token');
const { UsedToken } = require('./tokenModel');
const errors = require('../errors/index');
const { ServerError, NotAuthenticatedError, NotAuthorizedError, BadRequestError } = errors;

module.exports = {
    forget(req, res) {
        const { API_BASE_PATH } = global.config;
        res.clearCookie('refresh_token', {
            secure: req.secure,
            httpOnly: true,
            path: `${API_BASE_PATH}/auth/token`,
        });
        res.end();
    },
    token(req, res, next) {
        const { SECURE_STATUS_EXPIRATION, TOKEN_EXP_ACCESS, TOKEN_EXP_REFRESH, REFRESH_TOKEN_COOKIE_MAX_AGE, API_BASE_PATH, COOKIE_MAX_AGE } = global.config;
        const { body } = req;
        const grantType = body.grantType || body.grant_type;
        const secureStatus = body.secureStatus || body.secure_status;
        let remember = !!body.remember;

        function authCallback(error, user, claims) {
            if (error) {
                return next(new NotAuthenticatedError(error));
            }
            if (!user) {
                return next(new NotAuthenticatedError());
            }
            const payload = user.getClaims();
            if (secureStatus && grantType === 'password') {
                payload.secureStatus = moment().add(SECURE_STATUS_EXPIRATION, 'seconds').toJSON();
            }
            const accessToken = Token.generate(payload, TOKEN_EXP_ACCESS);

            if (grantType === 'refresh_token') {
                UsedToken.markAsUsed(claims)
                    .catch(error => console.log(error));
                remember = true;
            }

            if (remember) {
                const id = new ObjectId();
                const payload = Object.assign(user.getClaims(), {
                    id: id.toString(),
                    once: true,
                    scope: '',
                });
                const refreshToken = Token.generate(payload, TOKEN_EXP_REFRESH);
                res.cookie('refresh_token', refreshToken, {
                    maxAge: COOKIE_MAX_AGE * 1000,
                    secure: req.secure,
                    httpOnly: true,
                    path: `${API_BASE_PATH}/auth/token`,
                });
            }
            return res.send({
                access_token: accessToken,
                token_type: 'Bearer',
                expires_in: TOKEN_EXP_ACCESS,
            });

            switch (grantType) {
                case 'password':
                    passport.authenticate('local', authCallback)(req, res, next);
                    break;
                case 'refresh_token':
                    passport.authenticate('refresh', authCallback)(req, res, next);
                    break;
                default:
                    next(new BadRequestError('Invalid grant type'));
                    break;
            }
        }
    },
    ensureAuthenticated(...roles) {
        return function(req, res, next) {
            const { claims } = req;
            if (!claims) {
                return next(new NotAuthenticatedError());
            }
            if (roles.length && !roles.some(role => claims.roles.includes(role))) {
                return next(new NotAuthorizedError('Invalid Role'));
            }
            next();
        };
    },
    ensureScope(...scopes) {
        return function(req, res, next) {
            const { claims } = req;
            if (!claims) {
                return next(new NotAuthenticatedError());
            }
            if (!claims.scope) {
                return next(new NotAuthorizedError('No Scope Provided'));
            }
            const claimed = claims.scope.split(' ');
            const checked = scopes.join(' ').split(' ');
            const match = checked.some(scope => claimed.includes(scope));
            if (!match) {
                return next(new NotAuthorizedError('Insufficient Scope'));
            }
            next();
        };
    },
    belongsTo(itemKey, ownerKey, propKey, roles) {
        if (Array.isArray(propKey)) {
            roles = propKey;
            propKey = undefined;
        }
        if (typeof propKey === 'undefined') {
            switch (ownerKey) {
                case 'me':
                    propKey = user;
                    break;
            }
        }
        if (!propKey) {
            throw new Error('Missing propKey and unknown ownerKey');
        }

        return function(req, res, next) {
            const { claims } = req;
            const owner = req[ownerKey];
            const item = req[itemKey];

            if (roles && roles.some(role => claims.includes(role))) {
                return next();
            }
            if (typeof owner === 'undefined') {
                return next(new ServerError(`Owner of type ${ownerKey} has not been loaded`));
            }
            if (typeof item === 'undefined') {
                return next(new ServerError(`Item of type ${itemKey} has not been loaded`));;
            }
            if (typeof item[propKey] === 'undefined') {
                return next(new ServerError(`Item of type: ${itemKey} has no ${propKey} property`));
            }
            const prop = item[propKey];
            let _id = prop;

            if (typeof prop === 'object' && prop._id instanceof ObjectId) {
                _id = prop._id;
            }
            if (!owner._id.equals(_id)) {
                return next(new NotAuthorizedError());
            }
            next();
        }
    }
};

