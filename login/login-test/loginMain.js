var express = require('express');
var router = express.Router();
var User = require('users.js');

router.get('/', function(req, res, next){
	res.render('index', {title: 'Express' });
});

router.post('/register', function(req, res){
	var userid = req.body.userid;
	var password = req.body.password;
	var username = req.body.username;

	var newuser = new User();
	newuser.username = username;
	newuser.userid = userid;
	newuser.password = password;

	newuser.save(function(err, savedUser){
		if(err){
			console.log(err);
			return res.status(500).send();
		}

		return res.status(200).send();
	})
})

module.exports = router;
