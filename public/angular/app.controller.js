(function() {
	'use strict';

	angular.module('application.boiler')
	.controller('AppController', AppController);

	/* @ngInject */
	function AppController ($rootScope, $state, $mdSidenav, appAuth, appSettings, appToast, settingsProvider) {
		var vm = this;
		vm.openUserMenu = openUserMenu;
		vm.updateLoginStatus = updateLoginStatus;
		vm.initializeSettings = initializeSettings;

		function openUserMenu() {
			$mdSidenav('left').toggle();
		}

		function updateLoginStatus() {
			$rootScope.isLoggedIn = appAuth.isLoggedIn();
			$rootScope.user = appAuth.getUser();
		}

		function initializeSettings() {
			if (appAuth.isLoggedIn()) {
				var settingsData = appSettings.single.get({}, function() {
					if (settingsData.res.hasNoSettings) {
						$rootScope.settings = settingsProvider.settings;
					} else {
						$rootScope.settings = settingsData.res.item;
					}
				});
			} else {
				$rootScope.settings = settingsProvider.settings;
			}
		}

		updateLoginStatus();
		initializeSettings();

		$rootScope.$on('loggedIn', function() {
			updateLoginStatus();
		});

		$rootScope.$on('loggedOut', function() {
			updateLoginStatus();
		});

		$rootScope.$on('settingsUpdate', function() {
			initializeSettings();
		});
	}
}());