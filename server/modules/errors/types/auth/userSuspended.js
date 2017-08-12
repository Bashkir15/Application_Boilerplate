'use strict';

const NotAuthenticatedError = require('./notAuthenticated');

class UserSuspended extends NotAuthenticatedError {
	static name = 'UserSuspendedError';
	static code = 'USER_SUSPENDED';
	static isTrivial = true;
	constructor(message = 'User Suspended') {
		NotAuthenticatedError.call(this, message);
	}
}

module.exports = UserSuspended;
