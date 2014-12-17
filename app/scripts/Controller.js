define([
    'jquery',
    'backbone',
    'scripts/view/ContactsView',
    'scripts/view/ContactEditView',
    'scripts/view/ContactAddView',
    'scripts/model/Contacts',
    'scripts/collection/Contacts',
    'text!scripts/template/contacts.html',
    'envconfig'
], function($, Backbone, ContactsView, ContactEditView, ContactAddView, ContactModel, ContactCollection, contactsTemplate, EnvConfig) {
    "use strict";

    
    var ContactsController = Backbone.View.extend({

        model: {},

        initialize: function() {
                //Backbone Listern :
                this.listenTo(Backbone, "editContactView", this.editContact);
                this.listenTo(Backbone, "addContactView", this.addContact);                
                this.listenTo(Backbone, "updateContactInServer", this.updateContactInServer);
                this.listenTo(Backbone, "addContactInServer", this.addContactInServer);
                this.listenTo(Backbone, "removeContactFromServer", this.removeContactFromServer);
        },

        show: function() {
            
            var self = this;
            var contactCollection=new ContactCollection();
            
            var response = contactCollection.fetch({url : EnvConfig.getcontacts});
            
            response.done(function( ) {
                    self.model = contactCollection;
                    self.view = new ContactsView();
                    self.view.model = self.model;
                    self.renderView();
            });

            response.fail(function(model, response, options  ) {
                      self.model = {};
                      self.renderView();
            });

        },

        renderView: function() {
            this.view = new ContactsView();
            this.view.model = this.model;
            this.view.render();
            this.$el.html( this.view.el );
        },
        
        updateContactInServer: function(eventData) {debugger;
            
            var contactModel=new ContactModel();

              contactModel.save(eventData.updateContact, {
                    success: function(model, resp) {
                         Backbone.trigger("refreshContactList");
                    },
                    error: function() {
                            Backbone.trigger("refreshContactList");
                    }
               });

        },

        addContactInServer: function(eventData) {
            
            var self;
            var contactModel=new ContactModel();

              contactModel.save(eventData.updateContact, {
                    success: function(model, resp) {
                         Backbone.trigger("refreshContactList");
                    },
                    error: function() {
                            Backbone.trigger("refreshContactList");
                    }
               });

        },
        
        removeContactFromServer: function(eventData) {
            
            var contactModel=new ContactModel();
            contactModel=this.model.get(eventData.contactid);
            contactModel.url=contactModel.url+'/'+eventData.contactid;
            contactModel.destroy({
                    success: function(model, response) {
                        alert('Selected Customer Deleted successfully ')
                        Backbone.trigger("refreshContactList");
                    },
                    error: function() {
                        alert('Error Deleting Selected Customer')
                        Backbone.trigger("refreshContactList");
                    }
            });
        
        },
        
       

        editContact: function(contact) {
            this.editView = new ContactEditView();
            this.model = contact;
            this.editView.model = this.model;
            this.editView.render();
            this.$el.html( this.editView.el ); 
           
        },

        addContact: function(contact) {
            this.addView = new ContactAddView();
            this.model = contact;
            this.addView.model = this.model;
            this.addView.render();
            this.$el.html( this.addView.el ); 
        },
        
    });

    return ContactsController;
});
