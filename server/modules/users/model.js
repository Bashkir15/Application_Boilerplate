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

    usedTokens: [String],

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

userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
    } catch (error) {
        return next(error);
    }
};

userSchema.methods = {
    comparePasswords: function(candidatePassword, callback) {
        bcrypt.compare(candidatePassword, this.password, (error, isMatch) => {
            if (error) {
                return cb(error);
            }
            cb(null, itMatch);
        });
    },

    hasRole: function(role) {
        return this.roles.includes(role);
    },

    getClaims: function() {
        return {
            id: this._id.toString(),
            roles: this.roles,
        };
    },

    toJSON: function() {
        const obj = this.toObject();
        obj.password = '';
        obj.usedTokens = [];
        return obj;
    },
};

const User = mongoose.model('User', userSchema);

module.exports = {
    User,
};
