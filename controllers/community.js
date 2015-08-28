var mongoose = require('mongoose')
var User = require('../models/user') 
var moment = require('moment')
var _ = require('underscore')
var Pics = require('../models/pics')
var Comment = require('../models/comment')
var Community = require('../models/community')

exports.index = function(req, res){
	var sort = req.query.sort;
	
	if(sort === 'hot'){
		Community
			.find({})
			.populate({
				path: 'from',
				select: 'username gravatar uid'
			})
			.sort({'pv': -1})
			.limit(10)
			.exec(function(err, data){
				for(var i = 0; i < data.length; i++){
					if(data[i].content.length >= 140){
						var random = parseInt(10 * Math.random()) + 140 
						data[i].content = data[i].content.substring(0, random) + '...'
					}
				}
				Pics.find({}, function(err, pic){
					var lauded = false;
					for (var i = 0; i < pic[0].lauds.length; i++){
						if(pic[0].lauds[i].username == req.session.user && req.session.user != undefined){
							lauded = true
						}
					}
					res.render('community', {
						title:'社区 | 天天书屋', 
						current:'community', 
						json: data, 
						sort:'hot',
						lauded: lauded,
						wd:'',
						pic: pic,
						moment: moment
					})
				}).sort({_id: -1}).limit(1)
			})
	}else {
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

			Pics.find({}, function(err, pic){
				var lauded = false;
				for (var i = 0; i < pic[0].lauds.length; i++){
					if(pic[0].lauds[i].username == req.session.user && req.session.user != undefined){
						lauded = true
					}
				}
				res.render('community', {
					title:'社区 | 天天书屋', 
					current:'community', 
					sort:'new',
					lauded: lauded,
					json: data, 
					wd:'',
					pic: pic,
					moment: moment
				})
			}).sort({_id: -1}).limit(1)
		})
	}

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
					Community.update({'_id': data._id}, {$inc: {'pv': 1}}, function(err, data){
						if(err) console.log(err)
					})
					data.content = '<p class="elp">' + data.content.replace(/\n/img, '</p><p class="elp">') + '</p>';

					Pics.find({}, function(err, pic){
						var lauded = false;
						for (var i = 0; i < pic[0].lauds.length; i++){
							if(pic[0].lauds[i].username == req.session.user && req.session.user != undefined){
								lauded = true
							}
						}
						res.render('issue', {
							title: data.title +  ' | 天天书屋', 
							current:'community', 
							json: data, 
							lauded: lauded,
							comments: comments,
							pic: pic,
							moment: moment
						})
					}).sort({_id: -1}).limit(1)
				})
		})
}

exports.newIssue = function(req, res){
	var issue = req.body
	var id = issue.is_id
	var _user = req.session.user
	var sources = {title: issue.title, content: issue.content}
	
	if(id){
		Community.findById(id, function(err, data){
			if (err) {
        console.log(err)
      }

      _issue = _.extend(data, sources)
			console.log(_issue);
      _issue.save(function(err, data){
      	if (err) {
          console.log(err)
        }
        console.log(data);
        res.redirect('/community/'+ data.cmid)
      })
		})
	}else {
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
}

exports.issueDel = function(req, res){
	var type = req.body.type;
	var id = req.body.id;
	
	if(type === 'issue'){
		Community.findOne({'cmid': id}, function(err, data){
			var cq = data.reply;
			var uq = data.from;
			console.log(data);
			Comment.remove({_id: {$in: cq}}, function(err, cb){
				console.log('评论表删除');
			})
			
			User.update({_id: data.from}, {$pull: {'topics': 'ObjectId("'+data._id+'")'}}, function(err, cb){
				console.log('用户表删除');
			})
			Community.remove({_id: data._id}, function(err, cb){
				console.log('社区表删除');
				res.send({'status': 'success', 'resTxt': '已删除！'})
			})
		})
	}
}

// 社区搜索
exports.search = function(req, res){
	var wd = req.query.wd
	
	Community
		.find({title:  {$regex: wd, $options:'i'} })
		.populate({
			path: 'from',
			select: 'username gravatar uid'
		})
		.exec(function(err, data){
			Pics.find({}, function(err, pic){
				var lauded = false;
				for (var i = 0; i < pic[0].lauds.length; i++){
					if(pic[0].lauds[i].username == req.session.user && req.session.user != undefined){
						lauded = true
					}
				}
				res.render('community', {
					title: '搜索结果页 | 天天书屋',
					current:'community', 
					lauded: lauded,
					json: data,
					sort: '',
					pic: pic,
					moment: moment,
					wd: wd
				})
			}).sort({_id: -1}).limit(1)

		})
}
