var mongoose = require('mongoose');
var CommunitySchema = require('../schemas/community')
var	Community = mongoose.model('Community', CommunitySchema)

module.exports = Community