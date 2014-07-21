// Property Details Page - index.js
// FIXME: Move Property model to here

_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};

var PropertyView = Backbone.View.extend({
    el: '#properties_table',

    initialize: function () {
        _.bindAll(this);
    },
      
    clear: function() {
        this.$el.html('');
    },

    load : function() {
        this.model.fetch( {
          success: this.loadCompleteHandler,
          error: this.errorHandler
        });
    }, 

    loadCompleteHandler : function() {
        this.render();
    },

    errorHandler : function() {
        throw "Error loading JSON file";
    },

    template: _.template("<tr><td><a href=\"/view/application/{{app_id}}\">{{ app_name }}</a></td><td>TBD</td></tr>"),
    
    render: function () {
        console.log(this.model.get('config'));
    }
});

