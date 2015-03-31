angular.module('prod').controller('RawMaterialListCtrl', ['$http',
	function($http) {
		this.title = 'Raw Material List';
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