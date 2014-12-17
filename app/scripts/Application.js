define([
    'backbone',
    'underscore',
    'scripts/BackboneRouter',
], function(Backbone,_, BackboneRouter) {

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
    Application.prototype.showContactList = function() {debugger;
            //Avoid creating multipl Object.
            console.log('Application.js : Route to = '+this.router.routes.customerlist+ ' method')
    }

    return Application;
});