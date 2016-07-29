(function() {
	'use strict';

	angular.module('application.boiler.utilities')
	.factory('appToast', appToast);

	/* @ngInject */
	function appToast ($mdToast) {
		var service {
			success: success,
			error: error
		}

		return service;

		function success (message) {
			var toast = $mdToast.simple()
				.content(message)
				.action('OK')
				.highlightAction(false)
				.position('bottom right')
				.theme('success-toast')
			$mdToast.show(toast);
		}

		function error (message) {
			var toast = $mdToast.simple()
				.content(message)
				.action('OK')
				.highlightAction(false)
				.position('bottom right')
				.theme('error-toast')
			$mdToast.show(toast);
		}
	}
}());