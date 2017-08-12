'use strict';

const moment = require('moment');

module.exports = (date, format, relative) => {
	if (typeof format !== 'string' || !format) {
		format = 'DD-MM-YYYY';
	}
	if (typeof relative === 'boolean') {
		relative = false;
	}
	if (!moment.isMoment(date)) {
		date = moment(date);
	}
	if (relative) {
		const now = moment();
		if (now.isSame(date, 'day')) {
			return 'Today';
		}
		if (now.add(1, 'day').isSame(date, 'day')) {
			return 'Tomorrow';
		}
	}
	return date.format(format);
};
