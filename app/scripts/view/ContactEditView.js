define([
        'jquery',
        'backbone',
        'modelbinder',
        'text!scripts/template/contactEdit.html',
        'scripts/model/Contacts',
        ], function($, Backbone, ModelBinder, contactsEditTemplate, ModelContact) {
	"use strict";

	
	var ContactsEditView = Backbone.View.extend({

		template: _.template(contactsEditTemplate),
		model:ModelContact,
		modelBinder: undefined,

		initialize: function(){
			this.modelBinder = new Backbone.ModelBinder();
			this.template =  contactsEditTemplate;

		},

		events: { 
			'click .close ,.closebtn' : 'closeDialog',
			'click .btn-primary' : 'updateContact',
			
		},
		
		closeDialog:function() {
				$('.modal-backdrop').remove();
				Backbone.trigger("refreshContactList");
		},
		
		updateContact:function() {
				$('.modal-backdrop').remove();
				Backbone.trigger('updateContactInServer',{updateContact:this.model});

		},
		render: function() {
			
			var contact = this.model.contact;
			var contactsModel =new ModelContact(this.model.contact);
			this.model=contactsModel
			this.template=contactsEditTemplate;
			this.template= _.template(this.template);
            this.$el.html(this.template({contact: contact}));
			this.modelBinder.bind(this.model, this.el, Backbone.ModelBinder.createDefaultBindings(this.el, 'data-name'));
 			
 			return this;
		},
		
	});

	return ContactsEditView;
});