angular.module('prod').controller('RawMaterialCtrl', [
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