var mongoose = require('mongoose')
var User = require('../models/user') 
var moment = require('moment')
var Comment = require('../models/comment')
var Community = require('../models/community')

exports.index = function(req, res){
	Community
		.find({})
		.populate({
			path: 'from',
			select: 'username gravatar uid'
		})
		.sort({'update_time': -1})
		.limit(10)
		.exec(function(err, data){
			for(var i = 0; i < data.length; i++){
				if(data[i].content.length >= 140){
					var random = parseInt(10 * Math.random()) + 140 
					data[i].content = data[i].content.substring(0, random) + '...'
				}
			}
			//data = data.content.toSting().substring(0, random)
			console.log(data)
			res.render('community', {title:'社区 | 天天书屋', current:'community', json: data, moment: moment})
		})
}

exports.issuePage = function(req, res){
	var cmid = req.params.cmid
	
	Community
		.findOne({'cmid': cmid})
		.populate({
			path: 'from',
			select: 'username gravatar uid'
		})
		.exec(function(err, data){
			Comment
				.find({'issue': data._id})
				.populate('from')
				.populate('reply.from reply.to username gravatar uid')
				.sort({'create_time': -1})
				.exec(function(err, comments){
					console.log(data)
					console.log(comments)
					data.content = '<p class="elp">' + data.content.replace(/\n/img, '</p><p class="elp">') + '</p>';
					res.render('issue', {
						title: data.title +  ' | 天天书屋', 
						current:'community', 
						json: data, 
						comments: comments,
						moment: moment
					})
				})
		})
}

exports.newIssue = function(req, res){
	var issue = req.body
	var _user = req.session.user
	User.findOne({'username': _user}, function(err, user){
		var _uid = user._id
		var _issue = new Community(issue)
		_issue.from = user._id
		_issue.save(function(err, data){
			if(err){
				console.log(err)
			}else {
				User.update({'_id': user._id}, {$push: {'topics': data._id}}, function(err, updated){
					if(err){
						console.log(err)
					}else{
						res.redirect('/community/'+ data.cmid)
					}
				})
			}
		})
	})
}


