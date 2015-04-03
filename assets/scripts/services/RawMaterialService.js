angular.module('prod').factory('RawMaterialService', ['$http', 
	function($http) {
		return {
			getRawMaterials: function() {
				return $http.get('/api/v1/rawmaterial');
			},

			createRawMaterial: function(material) {
				return $http.post('/api/v1/rawmaterial', material);
			}
		} // end return
}]);