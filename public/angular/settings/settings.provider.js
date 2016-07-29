(function() {
	'use strict';

	angular.module("application.boiler.settings")
	.provider('settingsProvider', settingsProvider);

	/* @ngInject */
	function settingsProvider () {
		var settingsDefault = {
			theme: 'default'
		};

		var settings = {};

		this.getDefaultOptions = getDefaultOptions;
		this.setDefaultOptions = setDefaultOptions;

		function getDefaultOptions(name) {
			return settingsDefault[name];
		}

		function setDefaultOptions (name, val) {
			settings[name] = val;
		}

		angular.extend(settings, settingsDefault);


		this.$get = function() {
			function setOption (name, val) {
				settings[name] = val;
			}

			function updateSettingsFromState (event, toState) {
				for (var options in settingsDefault) {
					settings[options] = settingsDefault[options];
				}

				var settingsOverrides = angular.isDefined(toState.data) && angular.isDefined(toState.data.settings) ? toState.data.settings : {};
				angular.extend(settings, settingsDefault, settingsOverrides);
			}

			return {
				settings: settings,
				setOption: setOption,
				updateSettingsFromState: updateSettingsFromState
			};
		};
	}
}());