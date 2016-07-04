// NATIF
var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');

// CONFIG
var TOKEN = Settings.data('token');
var config = {
  url: 'http://yo.3xw.ch',
  api: 'https://api.justyo.co/',
};
var contacts = [];
var contactMenu = null;
var config = new UI.Card({
  title: 'Settings',
  body: 'Please go to this app settimg panel into your phone.',
});

// config pannel
var displayConfig = function(){
  config.show();
};

var getToken = function(){
  Settings.config(
    config,
    function(e) {},
    function(e) {
      var options = JSON.stringify(e.options);
      console.log(options);
      if (e.failed) {
        console.log(e.response);
      }else{
        TOKEN = options.token;
        loadContacts();
      }

    }
  );
};

// YO API CALLS
var loadContacts = function(){
  ajax({ url: config.api+'contacts/?access_token='+TOKEN, type: 'json' },
    function(data, status, req) {
      console.log(data);
      contacts = data.contacts;
    }
  );
};

var sendYo = function(contact){
  ajax({ url: config.api+'yo/'+TOKEN, type: 'json',method:'post', data:{
    access_token: TOKEN,
    username: contact.username
  } },
    function(data, status, req) {
      console.log(data);
    }
  );
};

// YO API VIEWS
var displayContacts = function(){

  var items = [];
  for( var i in contacts ){
    items.push({
      title: contacts[i].username
    });
  }

  contactMenu = new UI.Menu({
    sections: [{
      items: items
    }]
  });

  contactMenu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
    var contact = contacts[e.itemIndex];

    sendYo(contact);

    var card = new UI.Card({
      status: {
        backgroundColor: 0xffb300,
        separator: Feature.round('none', 'dotted'),
      },
      backgroundColor : 0xffb300,
    });
    card.title(e.item.title);
    card.body('Yo sent!!!');
    card.show();
  });
  contactMenu.show();
};


//initialize
if( !TOKEN ){
  displayConfig();
}else{
  displayContacts();
}
