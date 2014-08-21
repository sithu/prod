/**
* ProductionEntry.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {

        status : { type: 'string' },

        shiftName : { type: 'string' },

        machineName : { type: 'string' },

        staffName : { type: 'string' },

        plannedQuantity : { type: 'integer' },

        finishedQuantity : { type: 'integer' },

        defectQuantity : { type: 'integer' },

        estimatedTimeToFinishInHour : { type: 'float' },

        startAt : { type: 'DateTime' },

        endAt : { type: 'DateTime' },

        reasonIfDelay : { type: 'string' },

        comment : { type: 'string' },

        forOrder : {
            model : 'Order',
            columnName: 'order_id'
        }
    }
};

