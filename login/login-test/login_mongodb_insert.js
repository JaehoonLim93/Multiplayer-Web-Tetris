var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/logindb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbase = db.db("logindb");
  var myobj = { name: "Ben", address: "Park Lane 38" };
  dbase.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
