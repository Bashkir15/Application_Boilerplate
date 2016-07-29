(function() {
	'use strict';

	angular.module('application.boiler.authentication')
	.controller('SignupController', SignupController);

	/* @ngInject */
	function SignupController ($state, $rootScope, appStorage, appUsers, appToast, appAuth) {

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
						appToast.success('Welcome, ' + response.res.record.name);
						postSignup(response.res.record, response.res.token);
					} else {
						appToast.error(response.res.message);
					}
				});

			} else {

				appToast.error('Hmm... Something seems to be missing');
			}
		}

		function postSignup (user, token) {
			var serialized = angular.toJson(user);
			appStorage.set('user', serialized);
			appStorage.set('boilerToken', token);

			$rootScope.$broadcast('loggedIn');
		}
	}
})();