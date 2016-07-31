(function() {
	'use strict';

	angular.module('application.boiler.settings')
	.factory('appSettings', appSettings);

	/* @ngInject */
	function appSettings ($resource, $rootScope) {
		return {
			cache: {},
			single: $resource('settings/'),
			fetch: function (callback) {
				var vm = this;
				var settings = vm.single.get({}, function() {
					for (var i in settings.res.items) {
						var setting = settings.res.items[i];
						vm.cache[setting.name] = setting.value;
					}

					$rootScope.settings = vm.cache;
					return callback ? callback(vm.cache) : true;
				});
			}
		};
	}
}());