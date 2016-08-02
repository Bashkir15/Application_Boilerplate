(function() {
	'use strict';

	angular.module('application.boiler.dashboard')
	.controller('DashboardController', DashboardController);

	/* @ngInject */
	function DashboardController ($state, $stateParams, appUsers) {
		var vm = this;
		var username = $stateParams.username;
	}
}());