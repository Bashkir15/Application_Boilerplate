(function() {
	'use strict';

	angular.module('application.boiler.authentication')
	.controller('LoginController', LoginController);

	/* @ngInject */
	function LoginController ($state, $rootScope, $timeout, $mdDialog, appStorage, appUsers, appToast) {
		var vm = this;
		vm.checkRemember = checkRemember;
		vm.openPasswordReset = openPasswordReset;
		vm.login = login;
		vm.postLogin = postLogin;
		vm.user = {
			email: '',
			password: ''
		};

		function checkRemember() {
			var storedEmail = appStorage.get('userEmail');

			if (storedEmail) {
				vm.user.email = atob(storedEmail);
				vm.isRemembered = true;
			} else {
				vm.user.email = '';
			}
		}

		function openPasswordReset() {
			$mdDialog.show({
				controller: 'PasswordResetController',
				controllerAs: 'vm',
				templateUrl: '/angular/authentication/reset/password.reset.html'
			}).finally(function() {

			});
		}

		function login (isValid) {
			vm.isLoading = true;

			$timeout(function() {
				if (isValid) {
					var auth = new appUsers.authenticate({
						email: vm.user.email,
						password: vm.user.password
					});

					if (typeof vm.remember !== 'undefined') {
						var rememberEmail = btoa(vm.user.email);
						appStorage.set('userEmail', rememberEmail);
					}

					if (typeof vm.forget !== 'undefined') {
						appStorage.remove('userEmail');
					}

					auth.$save(function (response) {
						if (response.success) {
							vm.isLoading = false;
							vm.isSuccess = true;
							appToast.success('Welcome back, ' + response.res.record.name);
							postLogin(response.res.record, response.res.token);
						} else {
							vm.isLoading = false;
							vm.tryAgain = true;
							appToast.error(response.res.message);
						}
					});
				} else {
					vm.isLoading = false;
					vm.tryAgain = true;
					appToast.error('Hmm... Something seems to be missing');
				}
			}, 500);
		}

		function postLogin (user, token) {
			var serializedUser = angular.toJson(user);
			appStorage.set('user', serializedUser);
			appStorage.set('boilerToken', token);
			$rootScope.$broadcast('loggedIn');
		}

		checkRemember();
	}
}());