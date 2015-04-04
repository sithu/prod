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