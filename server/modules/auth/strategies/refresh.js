const passport = require('passport');
const mongoose = require('mongoose');
const RefreshStrategy = require('../../helpers/Refresh');
const tokens = require('../../helpers/Tokens');
const User = require('../../users/model').User;

module.exports = () => {
    passport.use(new RefreshStrategy((refreshToken, cb) => {
        if (!refreshToken) {
            return cb(null, false);
        }

        tokens.validate('refresh', refreshToken)
            .then(tokens.getId)
            .then(id => User.findById(id))
            .then(user => {
                if (!user) {
                    // err
                }
                return cb(null, user);
            })
            .catch(cb);
    }));
};
