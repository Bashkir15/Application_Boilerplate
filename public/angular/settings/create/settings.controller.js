(function() {
	'use strict';

	angular.module('application.boiler.settings')
	.controller('SettingsController', SettingsController);

	/* @ngInject */
	function SettingsController ($state, appSettings, appToast) {
		var vm = this;
		vm.getSettings = getSettings;
		vm.save = save;


		function getSettings() {
			var systemSettings = appSettings.single.get({}, function() {
				if (systemSettings.res.hasNoSettings) {
					appToast.success('Here you can set your settings');
				} else {
					vm.settings = systemSettings.res.item
					vm.settings.theme = vm.settings.theme
				}
			});
		}


		function save (isValid) {
			var newSettings = new appSettings.single({
				theme: vm.settings.theme
			});

			newSettings.$save(function (response) {
				if (response.success) {
					appToast.success('Your settings are saved');
				} else {
					appToast.error(response.res.message);
				}
			});
		}

		getSettings();
	}
}());