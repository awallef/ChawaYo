// NATIF
var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');

// CONFIG
var access_token = Settings.data('access_token');
var api_token = Settings.data('api_token');
var api = 'https://api.justyo.co/';

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

// YO API CALLS
var sendYo = function(contact){
  console.log('sendYo');
  console.log('api_token: '+api_token);
  console.log('username: '+contact.username);
  ajax({ url: api+'yo/', type: 'json',method:'post', data:{
    api_token: api_token,
    username: contact.username
  } },
    function(data, status, req) {
      console.log(data);
    },
    function(data, status, req) {
      console.log('error on loading');
    }
  );
};

// YO API VIEWS
var displayContacts = function(){
  console.log('displayContacts');
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
      
    console.log('contactMenu select');
    
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
    var contact = contacts[e.itemIndex];

    sendYo(contact);

    var card = new UI.Card({
      backgroundColor : 0xffb300,
    });
    card.title(e.item.title);
    card.body('Yo sent!!!');
    card.show();
  });
  contactMenu.show();
};

var loadContacts = function(){
  console.log('loadContacts: ' + api+'contacts/?access_token='+access_token );
  ajax({ url: api+'contacts/?access_token='+access_token, type: 'json' },
    function(data, status, req) {
      console.log(data);
      contacts = data.contacts;
      displayContacts();
    },
    function(data, status, req) {
      console.log('error on loading');
    }
  );
};


// SETUP
Settings.config(
  {url: 'http://yo.3xw.ch/'},
  function(e) {
    console.log('loading...');
  },
  function(e) {
    var options = e.options;
    console.log(options);
    console.log(options.access_token);
    console.log(options.api_token);
    Settings.data('access_token', options.access_token);
    Settings.data('api_token', options.api_token);
    access_token = Settings.data('access_token');
    api_token = Settings.data('api_token');
    loadContacts();
    
    if (e.failed) {
      console.log(e.response);
    }

  }
);


//initialize
if( !access_token || !api_token ){
  displayConfig();
}else{
 loadContacts();
}
