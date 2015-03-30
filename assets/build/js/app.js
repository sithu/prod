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
angular.module('prod').controller('ProductCtrl', ['$http', 
	function($http) {
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
			product.color = this.selection.join();
			product.type = '';
			console.log(product);
			$http.post('/api/v1/product', product)
				.success(function(data) {
					console.log(data);
				})
				.error(function(data) {
					console.log("Error:" + data);
				});
		}; // end create()

	}

]);
angular.module('prod').controller('ProductListCtrl', ['$http',
	function($http) {
		this.title = 'Product List';
		var self = this;
		self.products = [];

		var getAllProducts = function() {
			return $http.get('/api/v1/product').then(function(response) {
				console.log(response.data);
				self.products = response.data;
			}, function(errResponse) {
				console.error('Error while fetching products:' + errResponse);
			});
		};

		getAllProducts();

	}

]);
angular.module('prod').factory('UserService', [function() {
   var sdo = {
      isLogged: false,
      username: ''
   };
   return sdo;
}]);