const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const validateToken = require('../helpers/validateToken');
const findUserByClaims = require('../helpers/findUserByClaims');

module.exports = () => {
    passport.use(new BearerStrategy((accessToken, cb) => {
        validateToken(accessToken)
            .then(findUserByClaims)
            .then(([user, claims]) => cb(null, user, claims))
            .catch(cb);
    }));
};
