var mongoose = require('mongoose')
var BookSchema = require('../schemas/book')
var Books = mongoose.model('Books', BookSchema)

module.exports = Books