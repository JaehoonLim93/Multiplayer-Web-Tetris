var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/login";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbase = db.db("login");
  dbase.createCollection("users", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});
