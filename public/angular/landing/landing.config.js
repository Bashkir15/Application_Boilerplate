(function() {
	'use strict';

	angular.module('application.boiler.landing')
	.config(landingConfig);

	/* @ngInject */
	function landingConfig($stateProvider) {
		$stateProvider.state('landing', {
			url: '/home',
			templateUrl: '/angular/landing/landing.html',
			controller: 'LandingController',
			controllerAs: 'vm'
		});
	}
}());