const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

    isEmailVerified: {
        type: Boolean,
        default: false,
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
        user.password = hash;
        next();
        
    } catch (error) {
        return next(error);
    }
});

userSchema.methods = {
    comparePassword: function(candidatePassword, cb) {
        const user = this;
        bcrypt.compare(candidatePassword, user.password, (error, isMatch) => {
            if (error) {
                return cb(error);
            }
            cb(null, isMatch);
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

function populate(query) {
    return query;

}
userSchema.statics = {
    findById: function(id) {
        const query = this.findById(id);
        return populate(query);
    },

    findByEmail: function(email) {
        const query = this.findOne({
            email: email,
        });
        return populate(query);
    },
};

const User = mongoose.model('User', userSchema);

module.exports = {
    User,
};
