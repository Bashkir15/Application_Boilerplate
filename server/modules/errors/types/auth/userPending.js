'use strict';

const NotAuthenticatedError = require('./notAuthenticated');

class UserPending extends NotAuthenticatedError {
	static name = 'UserPendingError';
	static code = 'USER_PENDING';
	constructor(message = 'User pending approval') {
		NotAuthenticatedError.call(this, message);
	}
}

module.exports = UserPending;
