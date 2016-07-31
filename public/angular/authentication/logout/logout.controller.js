(function() {
	'use strict';

	angular.module('application.boiler.authentication')
	.controller('LogoutController', LogoutController);

	/* @ngInject */
	function LogoutController ($rootScope, $state, appStorage) {
		appStorage.remove('user');
		appStorage.remove('boilerToken');
		$rootScope.$broadcast('loggedOut');
		$state.go('landing');
	}
}());