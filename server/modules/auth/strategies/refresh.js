const passport = require('passport');
const mongoose = require('mongoose');
const RefreshStrategy = require('../helpers/customRefresh');
const validateToken = require('../helpers/validateToken');
const findByClaims = require('../helpers/findByClaims');

module.exports = () => {
    passport.use(new RefreshStrategy((refreshToken, cb) => {
        validateToken(refreshToken)
            .then(findByClaims)
            .then(([user, claims]) => cb(null, user, claims))
            .catch(cb);
    }));
};
