angular.module('prod').factory('OrderService', ['$http', 
	function($http) {
		return {
			getOrders: function() {
				return $http.get('/api/v1/order');
			},

			createOrder: function(order) {
				return $http.post('/api/v1/order', order);
			}
		} // end return
}]);