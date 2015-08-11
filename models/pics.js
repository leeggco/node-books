var mongoose = require('mongoose');
var PicSchema = require('../schemas/pics')
var	Pics = mongoose.model('Pics', PicSchema)

module.exports = Pics