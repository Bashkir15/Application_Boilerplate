const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../users/model').User;

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, (email, password, cb) => {
        User.findByEmail(email)
        .then(user => {
            if (!user) {
                return cb(null, false);
            }
            user.comparePassword(password, (error, isMatch) => {
                if (error) {
                    return cb(error);
                }
                if (!isMatch) {
                    return cb(null, false);
                }
                return cb(null, user);
            })
        })
        .catch(error => {
            return cb(error);
        });
    }));
}; 
