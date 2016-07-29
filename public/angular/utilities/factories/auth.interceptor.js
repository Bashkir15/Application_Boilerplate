(function() {
	'use strict';

	angular.module('application.boiler.utilities')
	.factory('tokenHttpInterceptor', tokenHttpInterceptor);

	/* @ngInject */
	function tokenHttpInterceptor ($rootScope, appStorage) {
		return {
			request: function (config) {
				config.headers.Authorization = 'Bearer ' + appStorage.get('boilerToken');
				return config;
			},

			responseError: function (response) {
				if (response.status === 401 || response.status === 403) {
					$rootScope.$broadcast('noAccess');
				}
			}
		}
	}
}());