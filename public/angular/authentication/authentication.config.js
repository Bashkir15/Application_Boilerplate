(function() {
	'use strict';

	angular.module('application.boiler.authentication')
	.config(authConfig);

	/* @ngInject */
	function authConfig ($stateProvider) {
		$stateProvider.state('signup', {
			url: '/signup',
			templateUrl: '/angular/authentication/signup/signup.html',
			controller: 'SignupController',
			controllerAs: 'vm'
		});

		$stateProvider.state('login', {
			url: '/login',
			templateUrl: '/angular/authentication/login/login.html',
			controller: 'LoginController',
			controllerAs: 'vm'
		});
	}
}());