(function() {
	'use strict';

	angular.module('application.boiler.authentication')
	.controller('ProfileInfoController', ProfileInfoController);

	/* @ngInject */
	function ProfileInfoController ($state, $stateParams, $timeout, appUsers, appToast) {
		var vm = this;
		var username = $stateParams.username;
		vm.getUser = getUser;
		vm.submit = submit;

		function getUser() {
			var userData = appUsers.single.get({username: username}, function() {
				vm.user = userData.res.record;
				vm.user.gender = vm.user.gender;
				vm.user.phone = vm.user.phone;
			});
		}

		function submit() {
			var user = appUsers.single.get({username: username}, function() {
				user.gender = vm.user.gender;
				user.phone = vm.user.phone;

				user.$edit({username: username}, function(response) {
					if (response.success) {
						appToast.success('yay!');
					} else {
						appToast.error(response.res.message);
					}
				});
			});
		}

		getUser();
	}
}());