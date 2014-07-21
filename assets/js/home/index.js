// Home Page - index.js
var ApplicationModel = Backbone.Model.extend({
    urlRoot: '/api/v1/application'
});

var ApplicationCollection = Backbone.Collection.extend({
    url: '/api/v1/application',
    model: ApplicationModel,
    comparator: 'name'
});

_.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
};

var ApplicationsView = Backbone.View.extend({
    el: '#applicationTable',

    initialize: function () {
        _.bindAll(this);
    },
      
    clear: function() {
        this.$el.html('');
    },

    load : function() {
        this.collection.fetch( {
          success: this.loadCompleteHandler,
          error: this.errorHandler
        });
    }, 

    loadCompleteHandler : function(){
        this.render();
    },

    errorHandler : function(){
        throw "Error loading JSON file";
    },

    template: _.template("<tr><td><a href=\"/view/application/{{app_id}}\">{{ app_name }}</a></td><td>TBD</td></tr>"),
    
    render: function () {
        this.collection.each(function(application) {
            this.$el.append(this.template(application.toJSON()));
        }, this);
    }
});
 
var applications = new ApplicationCollection();
var applicationsView = new ApplicationsView({collection: applications});

applicationsView.load();

