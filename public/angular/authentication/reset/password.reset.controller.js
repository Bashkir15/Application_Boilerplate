(function() {
	'use strict';

	angular.module('application.boiler.authentication')
	.controller('PasswordResetController', PasswordResetController);

	/* @ngInject */
	function PasswordResetController ($state, $mdDialog, appUsers, appToast) {
		var vm = this;
		vm.close = close;
		vm.generateReset = generateReset;
		vm.attempt = {
			email: ''
		};

		function close() {
			$mdDialog.hide();
		}

		function generateReset() {
			var generateToken = new appUsers.single({
				email: vm.attempt.email
			});

			generateToken.$forgot({email: vm.attempt.email}, function (response) {
				if (response.success) {
					vm.tokenSent = true;
					appToast.success('Yay@');
				} else {
					appToast.error(response.res.message);
				}
			});
		}
	}
}());