/**
* Order.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {

   	name : { type: 'string' },

   	status : { 
         type: 'string',
         required: true,
         defaultsTo: 'READY_FOR_PRODUCTION'
      },

      priority : { 
         type: 'integer',
         defaultsTo: '3',
         min: 1,
         max: 5 
      },

   	quantity : { 
         type: 'integer',
         min: 1,
         max: 100000
      },

   	rawMaterialQuantityRequired : { type: 'integer' },

   	estimatedTimeToFinishInHour : { type: 'float' },

   	productionStartAt : { type: 'DateTime' },

   	productionEndAt : { type: 'DateTime' },

   	comment : { type: 'string' },

   	forProduct : {
   		model: 'Product',
         columnName: 'product_id'
   	},

   	productionEntries : {
   		collection : 'ProductionEntry',
   		via : 'forOrder'
   	},
   
   }, // end attributes

   // triggers
   beforeCreate: function(attributes, next) {
      var count = attributes.quantity;
      var product_id = attributes.forProduct;
      Product.findOne(product_id).populate('rawMaterial').exec(
         function(err, product) {
            if(err) return next(err);
            // Calculates number of raw material bags needed
            var totalProductWeight = count * product.weight;
            attributes.rawMaterialQuantityRequired = totalProductWeight / product.rawMaterial.weight;
            
            // TODO: inventory feature: update raw material inventory
            // product.rawMaterial.count -= attributes.rawMaterialQuantityRequired;

            // Calculates total estimated time to finish
            var totalHrs = (count * product.timeToBuildInSec) / (60 * 60);
            // round to 2 decimal places
            attributes.estimatedTimeToFinishInHour = +(Math.round(totalHrs + "e+2")  + "e-2");;

            next();
         });
   },

   beforeUpdate: function(attributes, next) {
      var status = attributes.status;
      
      if(status == 'IN_PRODUCTION' && attributes.productionStartAt == null) {
         attributes.productionStartAt = new Date();
         
      } else if(status == 'FINISH_PRODUCTION' && attributes.productionEndAt == null) {
         attributes.productionEndAt = new Date(); 
      } 

      next(); // NOTE: If you miss this callback, this trigger will take very long time.
   }

};

