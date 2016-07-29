(function() {
	'use strict';

	angular.module('application.boiler')
	.controller('AppController', AppController);

	/* @ngInject */
	function AppController ($rootScope, $state, appAuth, appSettings, appToast, settingsProvider) {
		var vm = this;
		vm.updateLoginStatus = updateLoginStatus;
		vm.initializeSettings = initializeSettings;

		function updateLoginStatus() {
			$rootScope.isLoggedIn = appAuth.isLoggedIn();
			$rootScope.user = appAuth.getUser();
		}

		function initializeSettings() {
			$rootScope.settings = settingsProvider.settings;
		}

		updateLoginStatus();
		initializeSettings();

		$rootScope.$on('loggedIn', function() {
			updateLoginStatus();
		});

		$rootScope.$on('loggedOut', function() {
			updateLoginStatus();
		});
	}
}());