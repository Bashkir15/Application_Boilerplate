(function() {
	'use strict';

	angular.module('application.boiler.users')
	.factory('appUsers', appUsers);

	/* @ngInject */
	function appUsers ($resource) {
		return {
			single: $resource('users/:username/:action', {

			}, {
				forgot: {
					method: 'POST',
					params: {action: 'forgot'}
				}
			}),

			authenticate: $resource('users/authenticate'),

			reset: $resource('users/forgot/reset')
		};
	}
}());