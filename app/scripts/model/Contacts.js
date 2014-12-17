define([ 'backbone', 'envconfig'], function(Backbone ,Envconfig) {

    'use strict';
    var _model = Backbone.Model.extend({
    	url: function() {
			return Envconfig.addcontact;
		}
    });
    return _model
});
