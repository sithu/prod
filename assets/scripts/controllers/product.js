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