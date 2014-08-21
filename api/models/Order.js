/**
* Order.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {

   	name : { type: 'string' },

   	status : { type: 'string' },

   	quantity : { type: 'integer' },

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
   	}
  }
};

