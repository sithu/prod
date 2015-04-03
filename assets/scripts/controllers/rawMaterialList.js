angular.module('prod').controller('RawMaterialListCtrl', [
	'RawMaterialService',
	function(RawMaterialService) {
		this.title = 'Raw Material List';
		
		var self = this;
		self.rawMaterials = [];

		RawMaterialService.getRawMaterials().then(function(resp) {
			self.rawMaterials = resp.data;
		});
	}

]);