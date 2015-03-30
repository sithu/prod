/**
 * To enable a hamburger icon in resized screen.
 */
$(document).ready(function() {
    $(".button-collapse").sideNav();
    /*
    $(".button-collapse").sideNav(
        {
            menuWidth: 240, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        }
    );
    */
    console.log("loaded settings");
});


angular.module('prod', [
    'ngRoute',
    'ngAnimate',
    'ngResource',
    'ngSanitize'
]).config(['$routeProvider', function ($routeProvider) {

    $routeProvider.
        when('/', {
            templateUrl : 'views/pages/home.html',
            controller  : 'HomeCtrl as homeCtrl'
        })
        .when('/new_order', {
            templateUrl : 'views/pages/new_order.html',
            controller  : 'OrderCtrl as orderCtrl'
        })
        .when('/login', {
            templateUrl : 'views/pages/login.html',
            controller : 'LoginCtrl as loginCtrl'
        })
        .otherwise({
            redirectTo : '/'
        });

}]);

angular.module('prod').controller('HomeCtrl', [
	function() {
		this.tableTitle = 'Order List';
		this.orders = [
			{
				id: 1, description: 'A Order', status: 'Completed'
			},
			{
				id: 2, description: 'B Order', status: 'Waiting'
			},
			{
				id: 3, description: 'A Order', status: 'Completed'
			},
			{
				id: 4, description: 'B Order', status: 'Waiting'
			},
			{
				id: 5, description: 'A Order', status: 'Completed'
			},
			{
				id: 6, description: 'B Order', status: 'Waiting'
			},
			{
				id: 7, description: 'A Order', status: 'Completed'
			},
			{
				id: 8, description: 'B Order', status: 'Waiting'
			},
			{
				id: 9, description: 'A Order', status: 'Completed'
			},
			{
				id: 10, description: 'B Order', status: 'Waiting'
			}
		];
	}

]);
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
angular.module('prod').controller('OrderCtrl', [
	function() {
		this.title = 'New Order';
		this.order = {};
		this.order.description = '';
		this.order.product = '';
		this.order.quantity = '';

		this.create = function(order) {
			console.log("creating a new order:" + order.product + ":" + order.quantity);
		}	

	}

]);
angular.module('prod').factory('UserService', [function() {
   var sdo = {
      isLogged: false,
      username: ''
   };
   return sdo;
}]);