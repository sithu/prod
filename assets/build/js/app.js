/**
 * To enable a hamburger icon in resized screen.
 */
$(document).ready(function() {
    $(".button-collapse").sideNav(
        {
            menuWidth: 240, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        }
    );
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
        .when('/products', {
            templateUrl : 'views/pages/products.html',
            controller  : 'ProductListCtrl as productListCtrl'
        })
        .when('/new_product', {
            templateUrl : 'views/pages/new_product.html',
            controller  : 'ProductCtrl as productCtrl'
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
angular.module('prod').controller('ProductCtrl', [
	function() {
		this.title = 'New Product';
		this.colors = [ 
			'red', 'yellow', 'green', 'blue', 'black', 'cyan' 
		];
		this.selection = [];

		this.toggleSelection = function toggleSelection(color) {
			var idx = this.selection.indexOf(color);

			if (idx > 1) {
				this.selection.splice(idx, 1);
			} else {
				this.selection.push(color);
			}
		};

		this.product = {};
		this.product.name = '';
		this.product.type = '';
		this.product.timeToBuildInSec = '';
		this.product.weight = '';
		this.product.price = '';
		this.product.color = '';


		this.create = function(product) {
			console.log("creating a new product:" 
				+ product.name + ":" + product.quantity 
				+ ":" + this.selection.length);
		};

	}

]);
angular.module('prod').controller('ProductListCtrl', [
	function() {
		this.title = 'Product List';
		this.product = {};
		this.product.description = '';
		this.product.product = '';
		this.product.quantity = '';

		this.products = [
			{
				name: '4-Leg Chair', type: 'Chair', timeToBuildInSec: '25', weight: '1.25'
			},
			{
				name: 'Children basket', type: 'Basket', timeToBuildInSec: '35', weight: '0.55'
			}
		];

		this.create = function(product) {
			console.log("creating a new product:" + product.name + ":" + product.quantity);
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