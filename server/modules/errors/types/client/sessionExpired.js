'use strict';

const ClientError = require('../client');

class SessionExpired extends ClientError {
	static name = 'SessionExpiredError';
	static code = 'SESSION_EXPIRED;
	static isTrivial = true;
	constructor(message = 'Session Expired') {
		ClientError.call(this, message);
	}
}

module.exports = SessionExpired;
