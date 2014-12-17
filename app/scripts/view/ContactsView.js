define([
    'jquery',
    'backbone',
    'text!scripts/template/contacts.html'    
], function($, Backbone, contactsTemplate) {
    "use strict";

    var ContactsView = Backbone.View.extend({

        template:_.template(contactsTemplate),

        initialize: function() {
            //if (this.options.template) {
              this.template =  contactsTemplate;
            //}
        },
        events: { 
            'click .editContact' : 'editContactView',
            'click .addContact' : 'addContactView',
            'click .removeContact' : 'removeContact',

        },

        editContactView: function(e) {
            var contacts = this.model.toJSON();
            var contactId = e.target.id;
            var cont=contacts[0];
            //TODO:empty & undefined check needs to verify once EBPi expose/return actual data
            _(contacts).each(function(contact) { 
                if( (contact.id ==contactId) 
                    ||  (undefined ==contact.id &&  contactId=='')) {
                    Backbone.trigger("editContactView",{contact : contact});
                    return;
                }
            }); 
        },

        addContactView: function(e) {
            Backbone.trigger("addContactView");

        },

        removeContact: function(e) {
            var contactid=e.target.id;
            Backbone.trigger("removeContactFromServer",{contactid:contactid});  
        },
        
        render: function() {

            var contacts = this.model.toJSON();
            this.template =  contactsTemplate;
            this.template= _.template(this.template);
            if(contacts && contacts.length > 0) {
                   this.$el.html(this.template({contacts: contacts}));
               }
                else {
                    this.$el.html(this.template({contacts: contacts}));
                }


            }
    });

    return ContactsView;
});