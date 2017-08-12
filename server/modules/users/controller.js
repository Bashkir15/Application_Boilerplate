'use strict';

const User = require('./model').User;
const { UsedToken } = require('../auth/tokenModel');

module.exports = {
    list(req, res) {
        const users = req.users.map(user => user.toJSON());
        res.json(users);
    },
    get(req, res) {
        const user = req.user.toJSON();
        const status = req.isCreate ? 201 : 200;
        res.status(status).json(user);
    },
    create(req, res, next) {
        const data = User.parseData(req.data);
        req.isCreate = true;

        new User(data)
            .then(user => req.user = user)
            .then(next)
            .catch(next);
    },
    update(req, res, next) {
        const { user } = req;
        const data = User.parseData(req.data);
        user.setProperties(data);

        const emailChanged = user.isModified('email');
        if (emailChanged) {
            user.isEmailVerified = false;
        }
        user.save()
            .then((user) => {
                if (emailChanged) {
                    /*
                    mailer
                        .create('user/verify-email-address', req, user)
                        .then(email => email.send())
                        .catch(error => errors.handler(error, req)); */

                }
                req.user = user;
            })
            .then(next)
            .catch(next);
    },
    delete(req, res, next) {
        const { user } = req;
        user.remove()
            .then(() => res.status(204).end())
            .catch(next);
    },
    updatePassword(req, res, next) {
        const { user, claims, body } = req;
        user.password = body.password;
        user.save()
            .then((user) => {
                /*
                mailer
                    .create('user/credentials-changed', req, user)
                    .then(email => email.send())
                    .catch(error => errors.handler(error, req)); */
                UsedToken.markAsUsed(claims)
                    .catch(error => console.log(error));
                res.end();
            })
            .catch(next);
    },
    verifyEmail(req, res, next) {
        const { user } = req;
        user.isEmailVerified = true;
        user.save()
            .then(() => res.end())
            .catch(next);
    },
    exists(req, res, next) {
        const filter = {};
        const allowed = ['username', 'email'];
        for (const key in req.query) {
            if (req.query.hasOwnProperty(key) && allowed.includes(key)) {
                filter[key] = req.query[key];
            }
        }
        if (Object.keys(filter).length === 0) {
            return res.json({ exists: false });
        }
        User.find(filter)
            .limit(1)
            .then(users => users.length > 0)
            .then(exists => res.json({ exists }))
            .catch(next);
    },
    setClaimedId(req, res, next) {
        req.userId = req.claims.user;
        next();
    },
    findByQuery(req, res, next) {
        User.find({})
            .then(users => req.users = users)
            .then(next)
            .catch(next);
    },
    findByEmail(req, res, next) {
        const { email } = req.body;
        if (!email) {
            return next();
        }

        User.find({ email })
            .select('username firstName lastName')
            .then((users) => {
                if (users.length === 0) {
                    console.log('no users found');
                }
                req.users = users;
            })
            .then(next)
            .catch(next);
    },
    ensureUsernameNotInUse(checkId) {
        return function (req, res, next) {
            const { username } = req.body;
            const filter = { username };
            if (checkId) {
                filter._id = {
                    $ne: req.userId,
                };
            }

            User.findOne(filter)
                .then((user) => {
                    if (user) {
                        console.log('exists');
                    }
                })
                .then(next)
                .catch(next)
        }
    },
    updateLastActive(req, res, next) {
        const { user } = req;
        user.lastActive = Date.now();
        user.save().catch(error => console.log(error));
        next();
    },
    collectData(req, res, next) {
        const isCreate = !req.userId;
        req.data = req.body;
        next();
    },
};

