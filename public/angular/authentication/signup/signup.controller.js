(function() {
	'use strict';

	angular.module('application.boiler.authentication')
	.controller('SignupController', SignupController);

	/* @ngInject */
	function SignupController ($state, $rootScope, $timeout, $location, appStorage, appUsers, appToast, appAuth) {

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
			vm.isLoading = true;

			$timeout(function() {
				if (isValid) {

					var user = new appUsers.single({

						name: vm.user.name,
						username: vm.user.username,
						email: vm.user.email,
						password: vm.user.password

					});

					user.$save(function (response) {
						if (response.success) {
							vm.isLoading = false;
							vm.isSuccess = true;
							appToast.success('Welcome, ' + response.res.record.name);
							postSignup(response.res.record, response.res.token);
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

		function postSignup (user, token) {
			var serialized = angular.toJson(user);
			appStorage.set('user', serialized);
			appStorage.set('boilerToken', token);
			$location.url(user.username + '/profile-info');
			$rootScope.$broadcast('loggedIn');
		}
	}
})();