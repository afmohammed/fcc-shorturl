'use strict';

var express = require('express');
//var mongo = require('mongodb');
//var mongoose = require('mongoose');

var cors = require('cors');

var app = express();
var router = express.Router();

var enableCORS = function(req, res, next) {
  if (!process.env.DISABLE_XORIGIN) {
    var allowedOrigins = ['https://marsh-glazer.gomix.me','https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin;
    if(!process.env.XORIGIN_RESTRICT || allowedOrigins.indexOf(origin) > -1) {
      console.log(req.method);
      res.set({
        "Access-Control-Allow-Origin" : origin,
        "Access-Control-Allow-Methods" : "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers" : "Origin, X-Requested-With, Content-Type, Accept"
      });
    }
  }
  next();
};

// Basic Configuration 
var port = process.env.PORT || 3000;
var timeout = 10000;

/** this project needs a db !! **/ 
//mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());


/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var bodyParser = require('body-parser');

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

var ShortURL = require('./mySql.js').ShortUrlModel;

var createURL = require('./mySql.js').createAndSaveUrl;
app.get('/newurl/:enterUrl', function(req, res, next) {
  // in case of incorrect function use wait timeout then respond
  var t = setTimeout(() => { next({message: 'timeout'}) }, timeout);
  createURL(req.params.enterUrl,function(err, data) {
    clearTimeout(t);
    if(err) { return (next(err)); }
    if(!data) {
      console.log('Missing `done()` argument');
      return next({message: 'Missing callback argument'});
    }
     ShortURL.findById(data._id, function(err, newUrl) {
       if(err) { return (next(err)); }
       res.json(newUrl);
       //newUrl.remove();
     });
  });
});

var findById = require('./mySql.js').findUrlById;
app.get('/shorturl/:id', function(req, res, next) {
  //console.log("Id: " + req.params.id);
  findById(req.params.id, function(err, data) {
    if(err) { return (next(err)); }
    var jsonData = data;
    console.log("value " + jsonData[0]["url"]);
    //res.json(data);
    //res.send(jsonData[0]["url"]);        
    res.redirect(301, jsonData[0]["url"]);
    //res.redirect(301, "https://www.google.com");
  });
});

var findAll = require('./mySql.js').findAll;
app.get('/findAll/', function(req, res, next) {
  findAll(function(err, data) {
    res.json(data);
  });
});

var removeAll = require('./mySql.js').removeAll;
app.get('/removeAll/', function(req, res, next) {
  removeAll(function(err, data) {
    if(err) { return (next(err)); }
    res.json("{Data is removed}");
  });
});

app.use('/_api', enableCORS, router);

app.listen(port, function () {
  console.log('Node.js listening ...');
});

/*examples
https://wooded-wire.glitch.me/findall
https://wooded-wire.glitch.me/removeall
https://wooded-wire.glitch.me/newurl/www.milestechnologies.com
https://wooded-wire.glitch.me/shorturl/1
*/