define([
    'backbone',
    'underscore',
    'scripts/BackboneRouter',
    'scripts/Controller',
], function(Backbone,_, BackboneRouter,CustomerController) {

    "use strict";

    var Application = function () { };

    // Add/mix in the ability of Application to respond to / post events
    _.extend(Application.prototype, Backbone.Events);

    Application.prototype.init = function () {
        var r = new BackboneRouter(this);
        this.router = r;
        if(!Backbone.history.start( {root:"/backbonespa/app/customer"} )){
                    r.navigate("/customerlist", true);
        }
        this.bindEvents();
    };

    Application.prototype.bindEvents = function() {
        this.listenTo(Backbone, "refreshContactList", this.showContactList);

    }

    /* loads the cusotmerlist view */
    Application.prototype.showContactList = function() {
            //Avoid creating multipl Object.
        if(this.CustomerController==null || this.CustomerController==='undefined') {
               this.CustomerController = new CustomerController({
                   el: "#contacts"
               });
        }
        this.CustomerController.show();
    }

    return Application;
});