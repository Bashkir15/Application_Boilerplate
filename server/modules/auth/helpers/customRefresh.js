'use strict';

const util = require('util');
const Strategy = require('passport-strategy');

class RefreshStrategy extends Strategy {
	constructor(options, verify) {
		if (typeof options === 'function') {
			verify = options;
			options = {};
		}

		Strategy.call(this);
		this.name = 'refresh';
		this._verify = verify;
	}

	authenticate = (req) => {
		const refreshToken = req.cookies.refresh_token || req.cookies.refreshToken || null;
		this._verify(refreshToken, (error, user, info) => {
			if (error) {
				return this.error(error);
			}
			if (!user) {
				info = info || {};
				return this.fail('invalid_token', info);
			}
			this.success(user, info);
		}, req);
	};
}

module.exports = RefreshStrategy;
