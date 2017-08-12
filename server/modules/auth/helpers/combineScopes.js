'use strict';

const { scopes } = require('../../../config/constants');

module.exports = function combineScopes(roles) {
	const combined = new Set();
	roles.forEach(role => scopes[role].forEach(role => combined.add(role)));
	return Array.from(combined.values());
};
