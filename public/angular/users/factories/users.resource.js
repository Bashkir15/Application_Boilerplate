(function() {
	'use strict';

	angular.module('application.boiler.users')
	.factory('appUsers', appUsers);

	/* @ngInject */
	function appUsers ($resource) {
		return {
			single: $resource('users/:username/:action', {

			}, {

				follow: {
					method: 'POST',
					params: {action: 'follow'}
				},

				unfollow: {
					method: 'POST',
					params: {action: 'follow'}
				},

				edit: {
					method: 'POST',
					params: {action: 'edit'}
				},

				destroy: {
					method: 'POST',
					params: {action: 'destroy'}
				},

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