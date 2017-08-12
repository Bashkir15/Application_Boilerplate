const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const errors = require('../errors/index');
const roles = require('../../config/constants');
const combineScopes = require('../auth/helpers/combineScopes');
const { ValidationError } = errors;

const userSchema = new mongoose.Schema({
    created: {
        type    : Date,
        default : Date.now,
    },

    lastUpdated: {
        type    : Date,
        default : Date.now,
    },

    firstName: {
        type: String,
        required: true,
        trim: true,
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
    },

    username: {
        type     : String,
        unique   : true,
        required : true,
        trim     : true,
    },

    email: {
        type     : String,
        unique   : true,
        required : true,
        trim     : true,
    },

    password: {
        type     : String,
        required : true,
        trim     : true,
    },

    roles: {
        type: [{
            type: String,
            enum: Object.values(roles),
        }],
        default: [roles.USER],
    },
    isEmailVerified: {
        type    : Boolean,
        default : false,
    },
    lastActive: Date,
    loggedIn: {
        type    : Boolean,
        default : false,
    },

    loginAttempts: {
        type     : Number,
        default  : 0,
        required : true,
    },

    lockUntil: {
        type : Number,
    },

    limitReacted: {
        type     : Number,
        required : true,
        default  : 0,
    },
});

userSchema.index({ username: 1 }, { unique: true });

userSchema.statics.parseData = function(data) {
    return data;
};

userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    if (!this.password) {
        return next(new ValidationError({
            fields: {
                password: {
                    type: 'required',
                },
            },
        }));
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


userSchema.virtual('emailWithName').get(function() {
    const { email, firstName, lastName } = this;
    if (!email) {
        return '';
    }
    if (firstName || lastName) {
        return `${`${firstName} ${lastName}`.trim()} <${email}>`;
    }
});
userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});


userSchema.methods = {
    comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
    },
    hasRole(role) {
        return this.roles.includes(role);
    },
    getClaims() {
        return {
            user: this._id.toString(),
            roles: this.roles,
            scope: combineScopes(this.roles).join(' '),
        };
    },
    incorrectLoginAttempts(cb) {
        if (this.lockUntil && this.lockUntil < Date.now()) {
            return this.update({
                $set: { 
                    loginAttempts: 1,
                    limitReached: 0
                },
                $unset: { lockUntil: 1}
            }, cb);
        }

        const updates = {
            $inc: {
                loginAttempts: 1
            }
        };

        if (this.loginAttempts + 1 > 5 && !this.isLocked) {
            updates.$set = {
                lockUntil: Date.now() + 2 * 60 * 60 * 1000,
                limitReached: 1
            }
        }

        if (this.loginAttempts + 1 > 5 && this.limitReached == 1 && !this.isLocked) {
            updates.$set = {
                lockUntil: Date.now() + 4 * 60 * 60 * 1000,
                limitReached: 2
            }
        }

        if (this.loginAttempts + 1 > 3 && this.limitReached == 2 && !this.isLocked) {
            updates.$set = {
                lockUntil: Date.now() + 8 * 60 * 60 * 1000,
                limitReached: 3
            }
        }

        if (this.loginAttempts + 1 > 3 && this.limitReached == 3 && !this.isLocked) {
            updates.$set = {
                lockUntil: Date.now() + 10000 * 60 * 60 * 1000,
                limitReached: 4,
                secureLock: true
            }
        }

        return this.update(updates, cb);
    },
    toJSON() {
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
