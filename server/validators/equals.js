'use strict';

module.exports = function equals(value, check) {
	if (value !== check) {
		throw new Error(`expected value to equal ${check}`);
	}
};
