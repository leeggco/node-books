var mongoose = require('mongoose')
var User = require('../models/user') 
var Community = require('../models/community')

exports.index = function(req, res){
	res.render('community', {title:'社区 | 天天书屋', current:'community'})

}


















