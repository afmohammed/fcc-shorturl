var mongodb = require('mongodb');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true});

// <Your code here >
var ShortUrlSchema = new mongoose.Schema({
  ShortUrlID: Number,
  url: String
});
var ShortUrl = mongoose.model('ShortUrl', ShortUrlSchema);
var TotalRecords = 1;

var AbdTest = new ShortUrl;
//AbdTest.url = "http://www.google.com";
var createAndSaveUrl = function(newUrl, done) {
  var count = ShortUrl.countDocuments(function(err, total){
    console.log("here1");    
    if (err){return done(err);}    
        TotalRecords = total + 1;
        //console.log("total" + total);  
        AbdTest.url = "http://" + newUrl;
        AbdTest.ShortUrlID = TotalRecords;        
        AbdTest.save(function(err, data){
          console.log("inSave");
          if (err){
            return done(err);
          }
          console.log('createAndSaveUrl: ' + data);
          return done(null, data);
        });
  });  
};

var findUrlById = function(urlId, done) {  
  //ShortUrl.findById({_id: urlId}, function (err, data) {
  ShortUrl.find({ShortUrlID: urlId}, "url", function (err, data) {
    //console.log("id" + urlId);
      if (err) {
        //console.log("here1");
        return done(err);
      }
        //console.log('urlId: ' + data);
        return done(null, data);
      });  
}; 

var findAll = function(done) {  
  //ShortUrl.count(function (err, data) {
  ShortUrl.find(function(err,data){
      if (err) {
        return done(err);
      }
        //console.log('urlId: ' + data);
        return done(null, data);
      });  
}; 

  //5d53f793eba49a493559a835
var findOneByUrl = function(url, done) {

  ShortUrl.findOne({url: url}, function (err, data) {
      if (err) {
        return done(err);
      }
        console.log('findOneByUrl: ' + data);
        return done(null, data);
      });  
};

var removeAll = function(url, done) {
  ShortUrl.deleteMany(function (err, data) {
      if (err) {
        return done(err);
      }    
  });
};

/*var findEditThenSave = function(url, done) {
  ShortUrl.findById({_id: personId}, (err, data) => {
    if (err) { done(err) }    
    data.favoriteFoods.push(foodToAdd);
    data.save((err, data) => {
    if (err) { done(err) }
    else { done(null, data) }
  });
    // done(null, data);
  });
*/

exports.ShortUrlModel = ShortUrl;
exports.createAndSaveUrl = createAndSaveUrl;
exports.findUrlById = findUrlById;
exports.findAll = findAll;
exports.removeAll = removeAll;