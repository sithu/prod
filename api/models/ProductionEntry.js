/**
* ProductionEntry.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {

        status : { 
            type: 'string',
            required: true,
            defaultsTo: 'WAITING_FOR_EMPLOYEE_ASSIGNMENT'
        },

        shiftName : { type: 'string' },

        machineName : { type: 'string' },

        assignedEmployeeName : { type: 'string' },

        plannedQuantity : { 
            type: 'integer',
            required : true,
            min : 1,
            max : 100000
        },

        goodQuantity : { 
            type: 'integer', 
            defaultsTo : '0'
        },

        badQuantity : { 
            type: 'integer', 
            defaultsTo : '0'
        },

        estimatedTimeToFinishInHour : { type: 'float' },

        startAt : { type: 'DateTime' },

        endAt : { type: 'DateTime' },

        reasonIfDelay : { type: 'string' },

        comment : { type: 'string' },

        forOrder : {
            model : 'Order',
            columnName: 'order_id'
        }
    }, // end attributes

    // triggers
    beforeUpdate: function(attributes, next) {
        var status = attributes.status;
      
        if(status == 'IN_PRODUCTION' && attributes.startAt == null) {
            attributes.startAt = new Date();
         
        } else if(status == 'DONE' && attributes.endAt == null) {
            attributes.endAt = new Date(); 
        } 

        next(); // NOTE: If you miss this callback, this trigger will take very long time.
    }, // end beforeUpdate()

    afterUpdate: function(attributes, next) {
        var status = attributes.status;
      
        // updates the counters
        if(status == 'DONE') {
            attributes.forOrder.completedQuantity += attributes.goodQuantity; 
        } 

        next(); // NOTE: If you miss this callback, this trigger will take very long time.
    } // end afterUpdate()

};

