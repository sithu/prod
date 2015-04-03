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