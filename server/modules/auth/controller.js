const passport = require('passport');
const moment = require('moment');
const tokens = require('../../helpers/Tokens');

module.exports = {
    forget(req, res) {
        res.clearCookie('refreshToken', {
            secure: appConfig.REFRESH_TOKEN_COOKIE_SECURE,
            httpOnly: true,
        });
        res.end();
    },

    token(req, res, next) {
        const { grantType, remember, secureStatus } = req.body;

        function authCheck(error, user) {
            if (error) {
                // new error
            } else if (!user) {
                // error
            } else if (user.isSuspended) {
                // throw error
            }

            req.user = user;
            const claims = user.getClaims();

            if (secureStatus && grantType === 'password') {
                claims.secureStatus = moment()
                    .add(appConfig.SECURE_STATUS_EXPIRATION, 'seconds')
                    .toJSON();
            }

            const accessToken = tokens.generate('access', claims);

            if (remember) {
                const refreshToken = tokens.generate('refresh', user.getClaims());
                res.cookie('refreshToken', refreshToken, {
                    maxAge: global.config.REFRESH_TOKEN_COOKIE_MAX_AGE * 1000,
                    secure: global.config.REFRESH_TOKEN_COOKIE_SECURE,
                    httpOnly: true
                });
            }

            return res.send({
                accessToken,
            });
        }

        switch(grantType) {
            case 'password':
                passport.authenticate('local', authCheck)(req, res, next);
                break;
            case 'refreshToken':
                passport.authenticate('refresh', authCheck)(req, res, next);
                break;
        }
    },

    ensureAdmin(req, res, next) {
        if (!req.user || !req.user.hasRole('admin')) {
            res.status(403).send();
        }
        next();
    },

    ensureAuthenticated(req, res, next) {
        passport.authenticate('bearer', {
            session: false,
        }, (error, user) => {
            if (error) {
                // throw
            } else if (!user) {
                // throw
            } else if (user.isSuspended) {
                // THROW
            }

            req.user = user;
            next();
        })(req, res, next);
    },
};
