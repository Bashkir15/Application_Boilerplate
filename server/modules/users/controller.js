const mongoose = require('mongoose');
const tokens = require('../../helpers/Tokens');
const User = require('./model').User;

module.exports = {
    create(req, res, next) {
        User.create(req.body)
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
};
