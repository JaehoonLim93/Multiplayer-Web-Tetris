var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/logindb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var query = { address: "Park Lane 38" };
  var dbase = db.db("logindb");
  dbase.collection("customers").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
