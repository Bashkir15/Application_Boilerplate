const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now,
    },

    lastUpdated: {
        type: Date,
        default: Date.now,
    },

    name: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        unique: true,
        required: true,
    },

    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    roles: {
        type: Array,
        default: ['authorized'],
    },

    loggedIn: {
        type: Boolean,
        default: false,
    },

    loginAttempts: {
        type: Number,
        default: 0,
        required: true,
    },

    lockUntil: {
        type: Number,
    },

    limitReacted: {
        type: Number,
        required: true,
        default: 0,
    },
});
