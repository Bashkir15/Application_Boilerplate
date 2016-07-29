(function() {
	'use strict';

	angular.module('application.boiler.utilities')
	.factory('tokenHttpInterceptor', tokenHttpInterceptor);

	/* @ngInject */
	function tokenHttpInterceptor (appStorage) {
		return {
			request: function (config) {
				config.headers.Authorization = 'Bearer ' + appStorage.get('boilerToken');
				return config;
			}
		}
	}
}());