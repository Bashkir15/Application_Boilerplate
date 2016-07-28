(function() {
	'use strict';

	angular.module('application.boiler.authentication')
	.controller('LoginController', LoginController);

	/* @ngInject */
	function LoginController ($state, $rootScope, appStorage, appUsers) {
		var vm = this;
		vm.login = login;
		vm.postLogin = postLogin;
		vm.user = {
			email: '',
			password: ''
		};

		function login (isValid) {
			if (isValid) {
				var auth = new appUsers.authenticate({
					email: vm.user.email,
					password: vm.user.password
				});

				auth.$save(function (response) {
					if (response.success) {
						alert('yay!');
						postLogin(response.res.record, response.res.token);
					} else {
						alert(response.res.message);
					}
				});
			} else {
				alert('oh no!');
			}
		}

		function postLogin (user, token) {
			var serializedUser = angular.toJson(user);
			appStorage.set('user', serializedUser);
			appStorage.set('boilerToken', token);
			$rootScope.$broadcast('loggedIn');
		}
	}
}());