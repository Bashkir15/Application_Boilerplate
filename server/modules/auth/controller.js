const passport = require('passport');
const moment = require('moment');
const tokens = require('../../helpers/Tokens');

module.exports = {
    token(req, res, next) {
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
            const accessToken = tokens.generate('access', claims);

            return res.send({
                accessToken,
            });
        }

        passport.authenticate('local', authCheck)(req, res, next);
    },

    ensureAdmin(req, res, next) {
        if (!req.user || !req.user.hasRole('admin')) {
            res.status(403).send();
        }
        next();
    },

    ensureAuthenticate(req, res, next) {
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
