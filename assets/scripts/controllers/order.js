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