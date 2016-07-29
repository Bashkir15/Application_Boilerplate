(function() {
	'use strict';

	angular.module('application.boiler.settings')
	.config(settingsConfig);

	/* @ngInject */
	function settingsConfig ($stateProvider) {
		$stateProvider.state('setting', {
			url: '/settings/:name',
			templateUrl: '/angular/settings/create/settings.html',
			controller: 'SettingsController',
			controllerAs: 'vm'
		});
	}
}());