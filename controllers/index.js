var mongoose = require('mongoose')
var Book = require('../models/book')
var Category = require('../models/category')

exports.index = function(req, res){
  Book.find({}, function(err, obj){
  	Category.find({}, function(err, data){
  		res.render('', {
  		 	title: '首页 | 天天书屋',
  		  current:'home', json: obj,
  		  categories: data
  		})
  	})
  }).sort({'pv': -1}).limit(7);
}




























