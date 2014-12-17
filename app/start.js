require.config({

    paths: {
        jquery: 'scripts/vendors/jquery',
        text: 'scripts/vendors/text',
        underscore: 'scripts/vendors/underscore',//For Templating
        backbone: 'scripts/vendors/backbone', //Banckbone Library heard of Backbone App
        bootstrapmodal: 'scripts/vendors/bootstrap-modal',//For model window(popup)
		bootstrap: 'scripts/vendors/bootstrap',//For model window(popup)
        modelbinder: 'scripts/vendors/Backbone.ModelBinder', // FOr Backbone Two Way binding
        envconfig:    'scripts/conf/devconfig'
    },
    
    //Shim is used in requireJS module to define dependencies
    shim: {
        underscore: {
            exports: "_"
        },
        bootstrap: {
           deps: ['jquery'],
            exports: 'bootstrap'
        },
        bootstrapmodal: {
           deps: ['jquery','bootstrap'],
            exports: 'bootstrapmodal'
        },
        backbone: {
            deps: ['underscore', 'jquery','bootstrap','bootstrapmodal'],
            exports: 'Backbone'
        },
        jquery: {
            exports: '$'
        }
    }
});

require(['scripts/Application'], function(Application) {
			'use strict';
		//instantiate the Application
		var application = new Application();
		//initialize the application instance
		application.init();

});