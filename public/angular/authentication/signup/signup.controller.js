(function() {
	'use strict';

	angular.module('application.boiler.authentication')
	.controller('SignupController', SignupController);

	/* @ngInject */
	function SignupController ($state, $rootScope, appStorage, appUsers) {

		var vm = this;

		vm.signup = signup;
		vm.postSignup = postSignup;
		vm.user = {

			name: '',
			username: '',
			email: '',
			password: ''

		};

		function signup (isValid) {

			if (isValid) {

				var user = new appUsers.single({

					name: vm.user.name,
					username: vm.user.username,
					email: vm.user.email,
					password: vm.user.password

				});

				user.$save(function (response) {
					if (response.success) {
						alert('yay!');
						postSignup(response.res.record, response.res.token);
					} else {
						alert(response.res.message);
					}
				});

			} else {

				alert('oh no!');
			}
		}

		function postSignup (user, token) {

			var serializedUser = angular.toJson(user);

			appStorage.set('user', serializedUser);
			appStorage.set('boilerToken', token);

			$rootScope.$broadcast('loggedIn');
		}
	}
}());