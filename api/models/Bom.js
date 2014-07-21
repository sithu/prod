/**
 * Bom
 *
 * @module      :: Bom
 * @description :: Bill of Materials model for an application or service.
 * @docs		:: http://wiki.payments.intuit.net/BOM
 */

var BOM = {
    
    attributes: {
        name: {
            type: 'STRING',
            required: true
        },
        version: {
            type: 'STRING',
            required: true
        },
        deps: { type: 'array' }
    },
};

module.exports = BOM;