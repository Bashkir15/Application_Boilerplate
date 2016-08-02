(function() {
	'use strict';

	angular.module('application.boiler.users')
	.controller('ProfileController', ProfileController);

	/* @ngInject */
	function ProfileController ($state, $stateParams, appUsers) {
		var vm = this;
		var username = $stateParams.username;
		vm.profile = [];
		vm.getProfile = getProfile;

		function getProfile() {
			var profileData = appUsers.single.get({username: username}, function() {
				vm.profile = [profileData.res.record];
			});
		}

		getProfile();
	}
}());