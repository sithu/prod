angular.module('prod').factory('ProductService', ['$http', 
	function($http) {
		return {
			getProducts: function() {
				return $http.get('/api/v1/product');
			}
		} // end return
}]);