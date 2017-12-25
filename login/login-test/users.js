var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	userid: {type: String, unique: true},
	username: String,
	password: {type: String}
});

var User = mongoose.model('myuser', userSchema);
module.exports = User;
