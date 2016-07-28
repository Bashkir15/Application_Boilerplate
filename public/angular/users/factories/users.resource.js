(function() {
	'use strict';

	angular.module('application.boiler.users')
	.factory('appUsers', appUsers);

	/* @ngInject */
	function appUsers ($resource) {
		return {
			single: $resource('users/:userId', {
				userId: '@_id'
			}),

			authenticate: $resource('users/authenticate')
		};
	}
}());