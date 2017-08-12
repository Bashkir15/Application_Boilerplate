'use strict';

const { ObjectId } = require('mongoose').Types;

module.exports = function setId(key) {
	return function(req, res, next, id) {
		if (!ObjectId.isValid(id)) {
			return next('route');
		}
		req[key] = new ObjectId(id);
		next();
	};
};
