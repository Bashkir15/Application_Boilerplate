(function() {
	'use strict';

	angular.module('application.boiler.authentication')
	.config(authConfig);

	/* @ngInject */
	function authConfig ($stateProvider) {

		$stateProvider.state('auth', {
			templateUrl: '/angular/authentication/auth.html',
			abstract: true
		});

		$stateProvider.state('auth.signup', {
			url: '/signup',
			templateUrl: '/angular/authentication/signup/signup.html',
			controller: 'SignupController',
			controllerAs: 'vm'
		});

		$stateProvider.state('auth.login', {
			url: '/login',
			templateUrl: '/angular/authentication/login/login.html',
			controller: 'LoginController',
			controllerAs: 'vm'
		});

		$stateProvider.state('auth.logout', {
			url: '/logout',
			templateUrl: '/angular/landing/landing.html',
			controller: 'LogoutController'
		});
	}
}());