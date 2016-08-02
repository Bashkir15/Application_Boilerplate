(function() {
	'use strict';

	angular.module('application.boiler.dashboard')
	.config(dashboardConfig);

	/* @ngInject */
	function dashboardConfig($stateProvider) {
		$stateProvider.state('dashboard', {
			url: '/dashboard/:username',
			templateUrl: '/angular/dashboard/dashboard.html',
			controller: 'DashboardController',
			controllerAs: 'vm'
		});

		$stateProvider.state('dashboard.home', {
			url: '/home',
			templateUrl: '/angular/dashboard/home/home.html',
			controller: 'DashboardHomeController',
			controllerAs: 'vm'
		});
	}
}());