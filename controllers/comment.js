var mongoose = require('mongoose')
var User = require('../models/user') 
var Comment = require('../models/comment') 

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
				console.log(comment)
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


