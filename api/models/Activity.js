/**
 * Activity.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	autosubscribe: ['destroy', 'update', 'create'],

	attributes: {
		app_id   :  {
			type : 'string',
			required : true
		},
		action   : {
			type : 'string',
			required : true
		},
		key  : {
			type : 'string'
		},
      from_value : {
      },
      to_value : {
      },
      changed_by : {
      	type : 'string'
      },
      version  : { 
      	type : 'integer'
      },
      timestamp: {
      	type : 'datetime',
      	required : true
      }
	}

};
