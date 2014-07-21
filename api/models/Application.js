/**
 * Application
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

   attributes: {
     	app_id: {
     		type: 'string',
     		required: true,
         unique: true,
     		index: { unique: true }
   	},
    version: {
      type: 'integer',
      defaultsTo: '0',
      min: 0
    },
   	config: {
   		type: 'json'
   	}
  },

   beforeUpdate: function(attributes, next) {
      // increment the current version on every update
      attributes.version++;
      next();
   }

};
