define([
    'jquery',
    'backbone',
    'scripts/Application'
], function($, Backbone, Application) {

    "use strict";

    /**
     * The SPARouter is akin to a java UrlMapping.  This simply maps routes (urls) to an appropriate call to the SelfServiceApplication object.
     * @type {*}
     */
    
    var BackboneRouter = Backbone.Router.extend({
  
        initialize: function(application) {
            //Simple function to automatically log routes that were triggered by filtering route
            this.Application = application;
        },


        routes: {
            "customerlist" : "doContactList"
        },  
        
        doContactList: function() {
            this.Application.showContactList();
        }
    });
    return BackboneRouter;
});
