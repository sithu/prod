angular.module('prod').controller('HomeCtrl', [
	function() {
		this.tableTitle = 'Order List';
		this.orders = [
			{
				id: 1, description: 'A Order', status: 'Completed'
			},
			{
				id: 2, description: 'B Order', status: 'Waiting'
			}
		];
	}

]);