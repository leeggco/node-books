var mongoose = require('mongoose')
var MovieSchema = require('../schemas/category')
var Category = mongoose.model('Category', MovieSchema)

module.exports = Category