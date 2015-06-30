var mongoose = require('mongoose');
var UserSchema = require('../schemas/user')
var	User = mongoose.model('Users', UserSchema)

module.exports = User