(function() {
	'use strict';

	angular.module('application.boiler.users')
	.config(userConfig);

	/* @ngInject */
	function userConfig ($stateProvider) {
		$stateProvider.state('profile', {
			url: '/profile/:username',
			abstract: true,
			templateUrl: '/angular/users/profile/profile.html',
			controller: 'ProfileController',
			controllerAs: 'vm'
		});

		$stateProvider.state('profile.overview', {
			url: '/overview',
			templateUrl: '/angular/users/profile/overview/overview.html',
			controller: 'ProfileOverviewController',
			controllerAs: 'vm'
		});
	}
}());