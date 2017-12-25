
var express = require('express');
var cors = require('cors');
var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(cors());

app.post('/login', function(req, res){
 // console.log(req.body.name);
 // console.log(req);
 // console.log(req.body);

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/login";

if(req.body.mode === 'insert'){
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbase = db.db("login");
  var myobj = { name: req.body.name, score: req.body.score };
  var mysort = { score: -1 };
  dbase.collection("users").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
  dbase.collection("users").find().sort(mysort).limit(10).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    var responseData = {'result' : 'ok', 'person' : req.body.name, 'db' : result}
    res.json(responseData);
    db.close();
  });
}); // insert

}else{
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbase = db.db("login");
  var mysort = { score: -1 };
  dbase.collection("users").find().sort(mysort).limit(10).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    var responseData = {'result' : 'ok', 'db' : result}
    res.json(responseData);
    db.close();
  });
});
} // search

  // 서버에서는 JSON.stringify 필요없음
})

app.listen(3017, function(){
  console.log("start! express server is running on port 3013")
});


