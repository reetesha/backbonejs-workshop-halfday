define([
        'jquery',
        'backbone',
        'modelbinder',
        'text!scripts/template/ContactAdd.html',
        'scripts/model/Contacts',
        ], function($, Backbone, ModelBinder, contactsAddTemplate, ModelContact) {
	
	"use strict";

	
	var ContactsAddView = Backbone.View.extend({

		template: _.template(contactsAddTemplate),
		model:ModelContact,
		modelBinder: undefined,

		initialize: function(){
			this.modelBinder = new Backbone.ModelBinder();
			this.template =  contactsAddTemplate;
		},

		events: { 
			'click .close ,.closebtn' : 'closeDialog',
			'click .btn-primary' : 'addContact',
		},
		
		closeDialog:function() {
				$('.modal-backdrop').remove();
				Backbone.trigger("refreshContactList");
		},
		addContact:function() {
				$('.modal-backdrop').remove();
				Backbone.trigger('addContactInServer',{updateContact:this.model});

		},
		
		render: function() {
			var contactsModel =new ModelContact();
			this.model=contactsModel;
			this.template=contactsAddTemplate;
			this.$el.html(this.template);
			this.modelBinder.bind(this.model, this.el, Backbone.ModelBinder.createDefaultBindings(this.el, 'data-name'));	
			return this;
		},
		
	});

	return ContactsAddView;
});