const util = require('util');
const Strategy = require('passport-strategy');

function RefreshStrategy(options, verify) {
    if (typeof options === 'function') {
        verify = options;
        options = {};
    }

    Strategy.call(this);
    this.name = 'refresh';
    this._verify = verify;
}

util.inherits(RefreshStrategy, Strategy);

RefreshStrategy.prototype.authenticate = (req) => {
    let refreshToken;

    if (req.cookies.refreshToken) {
        refreshToken = req.cookies.refreshToken;
    }

    function verified(error, user, info) {
        if (error) {
            return this.error(error);
        }
        if (!user) {
            info = info || {};
            self.fail('invalid-token', info);
        }
        self.success(user, info);
    }

    this._verify(refreshToken, verified);
};

module.exports = RefreshStrategy;