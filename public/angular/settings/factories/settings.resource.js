(function() {
	'use strict';

	angular.module('application.boiler.settings')
	.factory('appSettings', appSettings);

	/* @ngInject */
	function appSettings ($resource) {
		return {
			single: $resource('settings/')
		};
	}
}());