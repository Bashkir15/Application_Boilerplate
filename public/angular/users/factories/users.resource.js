(function() {
	'use strict';

	angular.module('application.boiler.users')
	.factory('appUsers', appUsers);

	/* @ngInject */
	function appUsers ($resource) {
		return {
			single: $resource('users/:userId/:action', {
				userId: '@_id'
			}, {
				forgot: {
					method: 'POST',
					params: {action: 'forgot'}
				}
			}),

			authenticate: $resource('users/authenticate'),

			forgot: $resource('users/forgot'),
			reset: $resource('users/forgot/:token')
		};
	}
}());