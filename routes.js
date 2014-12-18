
var _ = require('underscore');
  
exports.routes = function(app, contacts_json) {

 var individualRoutes = {

    allContacts: function(req, res) {
      var allContacts = _(contacts_json).values();
      res.send(allContacts);
    },

    updateContact: function(req, res) {
      var contact = req.body;
      for (var  i = 0; i < contacts_json.length; i++) {
          if(contacts_json[i].id==contact.id){
              contacts_json[i]=contact;
               console.log('contact Updated Successfully, Id ='+contact.id);
               res.send(200);
              return;
          }
      }
      res.send({msg: 'Failed to Update contact ' + contact}, 404);
    },

    addContact: function(req, res) {debugger;
        var contact = req.body;
        
        if(contacts_json.length>0) {
            contact.id=parseInt(contacts_json[contacts_json.length-1].id)+1;
        }
        else {
              contact.id='101';//start contact.id with 101
        }
        contacts_json[contacts_json.length]=contact;
        console.log('contact Added Successfully, Id ='+contact.id);
        res.send(200);
    },
    deleteContact: function(req, res) {
       var id = req.params.id;
          for (var  i = 0; i < contacts_json.length; i++) {
            if(contacts_json[i].id==id){
                contacts_json.splice(i,1);
                console.log('contact Deleted Successfully, Id ='+id);
                res.send({msg:'contact Delete, id='+id },200);
              return;
            }
        }
      res.send({msg: 'Failed to Delete contact, id='+id}, 404);
    }
  };
  
  // NodeJS API endpoint URL : Basic Curd Operation
  app.get('/api/contacts', individualRoutes.allContacts);
  app.put('/api/contacts', individualRoutes.updateContact);
  app.post('/api/contacts', individualRoutes.addContact);
  app.delete('/api/contacts/:id', individualRoutes.deleteContact);

};
