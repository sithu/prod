/**
 * Service
 *
 * @module      :: Service
 * @description :: Service model for an application or service.
 * @docs		:: http://wiki.payments.intuit.net/Service
 */

var Service = {
    
    attributes: {
        name: {
            type: 'STRING',
            required: true
        },
        version: {
            type: 'STRING',
            required: true
        },
        environment: {
            type: 'STRING',
            required: true
        },
        serviceDeps: { type: 'array' }
    },
};

module.exports = Service;