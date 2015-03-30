angular.module('prod').controller('LoginCtrl', [ '$http', 'UserService', 
	function($http, User) {
		this.title = 'Login';

		this.login = function() {
			var config = {};

			$http(config)
			.success(function(data, status, headers, config) {
				console.log('calling to login API');
				if (data.status) {
					User.isLogged = true;
					User.username = data.username;
				} else {
					User.isLogged = false;
					User.username = '';
				}
			})
			.error(function(data, status, headers, config) {
				console.log('failed to call login API');
				User.isLogged = false;
				User.username = '';
			})
		}
	}

]);