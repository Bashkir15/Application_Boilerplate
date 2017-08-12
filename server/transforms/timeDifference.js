'use strict';

const moment = require('moment');

module.exports = (date) => {
	if (!moment.isMoment(date)) {
		return '';
	}
	const days = date.diff(moment(), 'days');
	if (days > 1) {
		return date.fromNow();
	}
	if (days < -1) {
		return date.toNow();
	}
	return 'Today';
};
