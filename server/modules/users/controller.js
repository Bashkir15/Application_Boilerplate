const mongoose = require('mongoose');
const tokens = require('../../helpers/Tokens');
//const mailer = require('../../helpers/Mailer');
const User = require('./model').User;

module.exports = {
    create(req, res, next) {
        User.create(req.body)
            .then(user => {
                verifyEmailAddressEmail(user)
                    .then(email => mailer.send(email))
                    .catch('errorhandler')
                return user;
            })
            .then(user => {
                const json = user.toJSON();
                json.accessToken = tokens.generate('access', user.getClaims())
                return json;
            })
            .then(user => {
                res.status(201).json(user);
            })
            .catch(next);
    },

    exists(req, res, next) {
        User.find(req.body).limit(1)
            .then(users => (users.length > 0))
            .then(exists => {
                res.json({
                    exists,
                });
            })
            .catch(next);
    },

    findById(req, res, next, id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new Error());
        }

        User.findById(id)
            .then(user => {
                if (!user) {
                    // throw error
                }
                req.user = user;
                next();
            })
            .catch(next);
    },

    findByEmail(req, res, next) {
        if (!req.body.email) {
            return next();
        }

        User.findOne({
            email: req.body.email,
        }).then(user => {
            req.user = user;
            next();
        }).catch(next);
    },

    sendVerificationEmail(req, res, next) {
        const user = req.user;
        verifyEmailAddressEmail(user)
            .then(email => meailer.send(email))
            .then(() => res.end())
            .cache(next);
    },

    verifyEmail(req, res, next) {
        const token = req.body.token;

        tokens.validate('verifyEmail', token)
            .then(tokens.getId)
            .then(id => User.findOneAndUpdate({
                _id: id
            }, {
                isEmailVerified: true,
            }))
            .then(() => {
                res.json({
                    isValid: true,
                })
            })
            .catch(next);
    },

    
};
