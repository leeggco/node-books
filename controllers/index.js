var mongoose = require('mongoose')
var Book = require('../models/book')
var Category = require('../models/category')


exports.index = function(req, res){
	Book.count({}, function(err, total){
		Book.find({}, function(err, obj){
			Category.find({}, function(err, data){
				var arrfs = [];
				for (var i = 0; i < data.length; i++){
					var clen = data[i].books.length;
					var mark = (clen / total)  * 50;
					if( mark > 16){
						mark = 16;
					}
					arrfs[i] = mark + 12;
				}
				res.render('', {
					title: '首页 | 天天书屋',
					current:'home', json: obj,
					categories: data,
					arrfs: arrfs
				})
			})
		}).sort({'pv': -1}).limit(7);
	})
	

		


}
























