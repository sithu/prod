/**
 * To enable a hamburger icon in resized screen.
 */
$(document).ready(function() {
    $(".button-collapse").sideNav(
        {
            menuWidth: 210, // Default is 240
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
        .when('/raw_materials', {
            templateUrl : 'views/pages/raw_materials.html',
            controller  : 'RawMaterialListCtrl as rawMaterialListCtrl'
        })
        .when('/new_raw_material', {
            templateUrl : 'views/pages/new_raw_material.html',
            controller  : 'RawMaterialCtrl as rawMaterialCtrl'
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
	'ProductService',
	'OrderService',
	'$location',
	function(ProductService, OrderService, $location) {
		this.title = 'New Order';
		this.order = {};
		this.order.name = '';
		this.order.quantity = '';
		this.priority = [ 'Express', 'Can Wait', 'Regular' ];

		var self = this;
		self.products = [];
		self.selectedProduct = null;
		self.colors = [];
		self.selectedColor = null;
		self.selectedPriority = 'Regular';

		ProductService.getProducts().then(function(resp) {
			self.products = resp.data;
			if (self.products && self.products.length > 0) {
				self.selectedProduct = self.products[0];
				self.colors = self.selectedProduct.color.split(',');
				if (self.colors && self.colors.length > 0) {
					self.selectedColor = self.colors[0];
				}
			}
		});

		self.updateColors = function() {
			if (self.selectedProduct.color) {
				self.colors = self.selectedProduct.color.split(',');
				if (self.colors && self.colors.length > 0) {
					self.selectedColor = self.colors[0];
				}
			} else {
				self.colors = [];
			}
		}

		self.create = function(order) {
			order.forProduct = self.selectedProduct.id;
			order.color = self.selectedColor;
			console.log(order);
			
			OrderService.createOrder(order).then(function(success) {
				$location.path('/');
				Materialize.toast('Your new order was successfully added!', 4000);
			}, function(err) {
				console.log(err);
				Materialize.toast('Failed to create this new order!', 4000);
			});
		};		

	}

]);
angular.module('prod').controller('OrderListCtrl', ['OrderService',
	function(OrderService) {
		this.title = 'Order List';
		var self = this;
		self.orders = [];

		var getAllOrders = function() {
			OrderService.getOrders().then(function(response) {
				self.orders = response.data;
			}, function(err) {
				console.error('Error while fetching orders:' + err);
				Materialize.toast('Failed to retrieve orders!', 4000);
			});
		};

		getAllOrders();

	}

]);
angular.module('prod').controller('ProductCtrl', ['$http', '$location',
	function($http, $location) {
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
					$location.path('/products');
				})
				.error(function(data) {
					console.log("Error:" + data);
					toast('Failed to add this new product!', 4000);
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
				toast('Failed to load all products!', 4000);
			});
		};

		getAllProducts();

	}

]);
angular.module('prod').controller('RawMaterialCtrl', [
	'ProductService',
	'RawMaterialService',
	'$location',
	function(ProductService, RawMaterialService, $location) {
		this.title = 'New Raw Material';
		
		this.material = {};

		var self = this;
		self.products = [];
		self.selectedProduct = null;
		self.colors = [];
		self.selectedColor = null;
		
		ProductService.getProducts().then(function(resp) {
			self.products = resp.data;
			if (self.products && self.products.length > 0) {
				self.selectedProduct = self.products[0];
				self.colors = self.selectedProduct.color.split(',');
				if (self.colors && self.colors.length > 0) {
					self.selectedColor = self.colors[0];
				}
			}
		});

		self.updateColors = function() {
			if (self.selectedProduct.color) {
				self.colors = self.selectedProduct.color.split(',');
				if (self.colors && self.colors.length > 0) {
					self.selectedColor = self.colors[0];
				}
			} else {
				self.colors = [];
			}
		}

		self.create = function(material) {
			material.forProduct = self.selectedProduct.id;
			material.color = self.selectedColor;
			console.log(material);

			RawMaterialService.createRawMaterial(material).then(function(success) {
				$location.path('/raw_materials');
				Materialize.toast(material.name +' was successfully added!', 4000);
			}, function(err) {
				console.log(err);
				Materialize.toast('Failed to add ' + material.name, 4000);	
			});
		}

	}

]);
angular.module('prod').controller('RawMaterialListCtrl', [
	'RawMaterialService',
	function(RawMaterialService) {
		this.title = 'Raw Material List';
		
		var self = this;
		self.rawMaterials = [];

		RawMaterialService.getRawMaterials().then(function(resp) {
			self.rawMaterials = resp.data;
		});
	}

]);
angular.module('prod').factory('OrderService', ['$http', 
	function($http) {
		return {
			getOrders: function() {
				return $http.get('/api/v1/order?sort=id DESC');
			},

			createOrder: function(order) {
				return $http.post('/api/v1/order', order);
			}
		} // end return
}]);
angular.module('prod').factory('ProductService', ['$http', 
	function($http) {
		return {
			getProducts: function() {
				return $http.get('/api/v1/product');
			}
		} // end return
}]);
angular.module('prod').factory('RawMaterialService', ['$http', 
	function($http) {
		return {
			getRawMaterials: function() {
				return $http.get('/api/v1/rawmaterial');
			},

			createRawMaterial: function(material) {
				return $http.post('/api/v1/rawmaterial', material);
			}
		} // end return
}]);
angular.module('prod').factory('UserService', [function() {
   var sdo = {
      isLogged: false,
      username: ''
   };
   return sdo;
}]);