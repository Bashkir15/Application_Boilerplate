(function() {
	'use strict';

	angular.module('application.boiler')
	.config(applicationConfig);

	/* @ngInject */
	function applicationConfig ($stateProvider, $urlRouterProvider, $httpProvider) {
		$urlRouterProvider.when('', '/home');
		$urlRouterProvider.when('/', '/home');
		$urlRouterProvider.otherwise('/home');
		$httpProvider.interceptors.push('tokenHttpInterceptor');
	}
}());