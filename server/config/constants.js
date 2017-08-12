'use strict';

const roles = {
	USER  : 'user',
	ADMIN : 'admin',
};
const scopes = {
	[roles.USER]: [
		'user:own',
		'user:password'
	],
	[roles.ADMIN]: [
		'user:own',
		'user:password',
		'user:read',
		'user:write'
	],
};

module.exports = {
	roles,
	scopes,
};
