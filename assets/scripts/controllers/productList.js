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