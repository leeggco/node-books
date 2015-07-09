var mongoose = require('mongoose')
var User = require('../models/user') 
var Comment = require('../models/comment') 
var Community = require('../models/community')

exports.save = function(req, res){
	var _comment = req.body
	var _cid = _comment.cid
	var _bid = _comment.bid
	var _user = _comment.from
	
	if(_cid){
		User.findOne({username: _user}, function(err, user){
			Comment.findOne({_id: _cid}, function(err, comment){
				var reply = {
					from: user._id,
					to: _comment.to,
					content: _comment.content
				}
				comment.reply.push(reply)
				comment.save(function(err, comment){
					if(err){
						console.log(err)
					}
					res.send({msg: 'success', data: {}})
				})
			})
		})
	}else {
		User.findOne({username: _user}, function(err, user){
			_comment.from = user._id
			var comment = new Comment(_comment)
			comment.save(function(err, comment){
				if(err){
					console.log(err)
				}

				res.redirect('/detail/'+ _bid + '#comment' )
			})
		})
	}
}


exports.isSave = function(req, res){
	var _comment = req.body
	var _cid = _comment.cid
	var _cmid = _comment.cmid
	var _user = _comment.from
	var is_id = _comment.is_id

	if(_cid){
		User.findOne({username: _user}, function(err, user){
			Comment.findOne({_id: _cid}, function(err, comment){
				var reply = {
					from: user._id,
					to: _comment.to,
					content: _comment.content
				}
				comment.reply.push(reply)
				Community.update({'_id': is_id}, {$inc: {'reply_count': 1}}, function(err, cb){
					if(err){
						console.log(err)
					}
				})
				
				comment.save(function(err, comment){
					if(err){
						console.log(err)
					}
					res.send({msg: 'success', data: {}})
				})
			})
		})
	}else {
		User.findOne({username: _user}, function(err, user){
			_comment.from = user._id
			var comment = new Comment(_comment)
			comment.save(function(err, comment){
				if(err){
					console.log(err)
				}
				Community.update({'_id': _comment.issue}, {$push: {'reply': comment._id}, $inc: {'reply_count': 1}}, function(err, data){
					if(err){
						console.log(err)
					}else {
						res.redirect('/community/'+ _cmid + '#comment' )
					}
				})
			})
		})
	}
}

exports.isOperate = function(req, res){
	var cmid = req.query.cmid
	var handle = req.query.handle
	
	if(handle === 'edit'){
		Community.findOne({'cmid': cmid}, {'cmid':1, 'title':1, 'content': 1}, function(err, data){
			if(err){
				console.log(err)
			}else {
				res.send({msg: data, status: 'success'})
			}
		})
	}
}



