const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userService = require('../../users/service');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    }, (req, username, password, cb) => {
        if (!username || password) {
            return Promise.resolve(null);
        }
        userService
            .findByUsername(username)
            .then((user) => {
                if (!user) {
                    return cb(null, false);
                }
                if (user.secureLock) {
                    const error = {
                        message: `Sorry, due to the number of incorrect attempts your account has been locked. Please contact us to resolve this`,
                    };
                    return cb(error, false);
                }
                if (user.isLocked) {
                    return user.incorrectLoginAttempts((err) => {
                        if (err) {
                            return cb(err, false);
                        }
                        const error = {
                            message: `Sorry, you've reached the max number of login attempts. Your account has been locked until ${user.lockUntil}`,
                        };
                        return cb(error, false);
                    });
                }
                return user.comparePassword(password)
                    .then((isMatch) => {
                        if (isMatch) {
                            if (!user.loginAttempts && !user.lockUntil && !user.secureLock) {
                                return cb(null, user);
                            }

                            const updates = {
                                $set: {
                                    loginAttempts : 0,
                                    limitReacted  : 0,
                                },
                                $unset: {
                                    lockUntil : 1,
                                },
                            };

                            return user.update(updates)
                                .then(() => cb(null, user));
                        }
                        return user.incorrectLoginAttempts()
                            .then(() => cb(null, false));
                    });
            })
            .catch(cb)
    }));
};
