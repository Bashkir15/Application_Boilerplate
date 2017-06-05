const passport = require('passport');
const mongoose = require('mongoose');
const BearerStrategy = require('passport-http-bearer').Strategy;
const tokens = require('../../../helpers/Tokens');
const User = require('../../users/model').User;

module.exports = () => {
    passport.use(new BearerStrategy((accessToken, cb) => {
        tokens.validate('access', accessToken)
            .then(tokens.getId)
            .then(id => {
                User.findOne({_id: _id});
            })
            .then(user => {
                if (!user) {
                    // err
                }
                return cb(null, user);
            })
            .catch(cb);
    }));
};
