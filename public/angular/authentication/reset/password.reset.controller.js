(function() {
	'use strict';

	angular.module('application.boiler.authentication')
	.controller('PasswordResetController', PasswordResetController);

	/* @ngInject */
	function PasswordResetController ($state, $mdDialog, appUsers, appToast) {
		var vm = this;
		vm.close = close;
		vm.generateReset = generateReset;
		vm.attemptReset = attemptReset;
		vm.attempt = {
			email: '',
			token: '',
			password: '',
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
					appToast.success('Great! Now you can check your email for your token');
				} else {
					appToast.error(response.res.message);
				}
			});
		}

		function attemptReset() {
			var sendToken = new appUsers.reset({
				token: vm.attempt.token,
				password: vm.attempt.password
			});

			sendToken.$save(function (response) {
				if (response.success) {
					appToast.success('Hooray!');
				} else {
					appToast.error(response.res.message);
				}
			});
		}
	}
}());