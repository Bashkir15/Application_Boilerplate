(function() {
	'use strict';

	angular.module('application.boiler.utilities')
	.factory('appAuth', appAuth);

	/* @ngInject */
	function appAuth (appStorage) {
		var service = {
			getUser: getUser,
			getToken: getToken,
			isLoggedIn: isLoggedIn
		};

		return service;

		function getUser() {
			var serialized = appStorage.get('user');

			if (serialized) {
				return angular.fromJson(serialized);
			} else {
				return;
			}
		}

		function getToken() {
			return appStorage.get('boilerToken');
		}

		function isLoggedIn() {
			return appStorage.get('boilerToken');
		}
	}
}());