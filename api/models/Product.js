/**
* Product.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {

   	name : { type: 'string' },

   	type : { type: 'string' },

   	timeToBuildInSec : { type: 'integer' },

   	weight : { type: 'float' },

   	price : { type: 'float' },

   	color : { type: 'string' },

   	rawMaterial: {
   		model: 'RawMaterial',
         columnName: 'rawmaterial_id'
   	},

   	orders: {
   		collection: 'Order',
   		via: 'forProduct'
   	}
  }
};

