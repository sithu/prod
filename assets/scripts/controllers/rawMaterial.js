angular.module('prod').controller('RawMaterialCtrl', [
	'ProductService',
	'RawMaterialService',
	'$location',
	function(ProductService, RawMaterialService, $location) {
		this.title = 'New Raw Material';
		
		this.material = {};

		var self = this;
		self.products = [];
		self.selectedProduct = null;
		self.colors = [];
		self.selectedColor = null;
		
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

		self.create = function(material) {
			material.forProduct = self.selectedProduct.id;
			material.color = self.selectedColor;
			console.log(material);

			RawMaterialService.createRawMaterial(material).then(function(success) {
				$location.path('/raw_materials');
				Materialize.toast(material.name +' was successfully added!', 4000);
			}, function(err) {
				console.log(err);
				Materialize.toast('Failed to add ' + material.name, 4000);	
			});
		}

	}

]);