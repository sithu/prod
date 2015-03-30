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