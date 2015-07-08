var mongoose = require('mongoose')
var User = require('../models/user')
var moment = require('moment') 
var _ = require('underscore')
var fs = require('fs')
var path = require('path')
var formidable = require('formidable')
var util = require('util')
var uuid = require('node-uuid')


// 登录页面
exports.showSignin = function(req, res){
	res.render('signin',{
		title: '登录 | 天天书屋',
    current: 'signin'
	});
}

// 注册页面
exports.showSignup = function(req, res){
	res.render('signup',{
		title: '注册 | 天天书屋',
    current: 'signup'
	});
}

// 登出页面
exports.Signout = function(req, res){
	delete req.session.user

	res.redirect('/')
}

// 个人资料编辑
exports.uedit = function(req, res){
  var username = req.session.user
  User.findOne({username: username}, function(err, user){
    res.render('uedit', {
      title: '编辑个人资料 | 天天书屋',
      current: 'uedit',
      json: user
    })
    console.log(user)
  })
}

// 编辑个人资料
exports.updateUserInfos = function(req, res){
  var editData = req.body
  var username = req.session.user
  var intro = editData.intro
  var sex = editData.sex
  var location = editData.location
  var gravatar = editData.gravatar

  User.update(
    {username: username}, 
    {$set: {'intro': intro, 'sex': sex, 'location': location, 'gravatar': gravatar }}, 
    function(err, data){
      if(err){
        console.log(err)
      }else {
        res.redirect('/u/' + username)
      }
    }
  )
}

// 头像上传
exports.fileUpload = function(req, res){

  var form = new formidable.IncomingForm();
      form.uploadDir = 'public/avatars/';      //设置上传目录
      form.keepExtensions = true;             //保留后缀
      form.maxFieldsSize = 2 * 1024 * 1024;  //文件大小

  form.parse(req, function(err, fields, files) {
    var extName = '';  //后缀名

    switch (files.inputfile.type) {
        case 'image/pjpeg':
            extName = 'jpg';
            break;
        case 'image/jpeg':
            extName = 'jpg';
            break;         
        case 'image/png':
            extName = 'png';
            break;
        case 'image/x-png':
            extName = 'png';
            break;         
    }

    if(extName.length == 0){
      res.locals.error = '只支持png和jpg格式图片';
      res.render('/', { title: TITLE });
      return;                   
    }

    var avatarName = uuid.v1() + '.' + extName;
    var newPath = form.uploadDir + avatarName;

    fs.renameSync(files.inputfile.path, newPath);   //重命名
    res.send({'imgurl': '/avatars/'+ avatarName});                 //返回数据
  });
}

// 个人中心
exports.userCenter = function(req, res){
  var username = req.params.name;
  var visitname = req.session.user;
  var visitors;

  User.aggregate([
      {$match: {'username': username}},
      {$unwind: '$visitors'},
      {$sort: {'visitors.at': -1}},
      {$project: {_id: 0, 'visitors.at': 1, 'visitors.user': 1}},
      {$limit: 3},
    ], function(err, data){
      visitors = data
  })

  User
    .findOne({username: username})
    .populate({
      path:'devote_list', 
      select: 'bid name image pv dv create_time thanks',
      limit:5,
      sort: {'devote_list.create_time': -1}
    })
    .exec(function(err, data){
      if(err){
        console.log(err)
      }
      console.log(data)
      res.render('u',{
        title: username + ' | 天天书屋',
        current: 'userCenter',
        json: data,
        moment: moment,
        visitors: visitors
      });

      if(username != visitname){
        User.findOne({username: visitname}, function(err, user){
          var d = new Date()
          var y = d.getFullYear()
          var m = d.getMonth()
          var d = d.getDate()
          var x = new Date(y,m,d)
          var isHased = false

          if(err){
            console.log(err)
          }

          if(user){
            for (var i=0; i< data.visitors.length; i++){
              if(user._id.toString() === data.visitors[i].user.uid.toString() && data.visitors[i].at > x){
                isHased = true
                break
              }
            }
          }

          if(!isHased && user){
            console.log('update!!!')
            User.update(
              {username: username}, 
              {$push: {
                visitors: {
                    user: {
                      uid: user._id,
                      username: user.username,
                      gravatar: user.gravatar
                    }
                  }
                }
              },
              function(err, data){
                console.log(data)
              }
            )
          }else {
            console.log('hased!')
          }
        })
      }
    })
}

// 贡献排行
exports.dedicate = function(req, res){
  User.find({}, function(err, data){
    console.log(data)
    res.render('dedicate', {
      title: '贡献排行 | 天天书屋',
      json: data,
      current: 'dedicate'
    })
  }).sort({'devote_count': -1}).limit(20)

}

exports.signup = function(req, res){
	var _user = req.body
  User.findOne({username: _user.username}, function(err, data){
  	if(err){
  		console.log(err)
  	}
  	if(data){
  		res.redirect('/signin')
  	}
  	else{
  		user = new User(_user)
  		user.gravatar = 'http://cn.gravatar.com/avatar/' + User.beMD5(user.email)
  		user.save(function(err, data){
  			if(err){
  				console.log(err)
  			}
  			res.redirect('/signin')
  		})
  	}
  })
}

exports.signin = function(req, res){
  var _user = req.body
  var username = _user.username
  var password = _user.password

  User.findOne({username: username}, function(err, data){
  	if(err){
  		console.log(err)
  	}
  	if (!data) {
      return res.redirect('/signup')
    }
  	else{
	    data.comparePassword(password, data.password, function(err, isMatch) {
	      if (err) {
	        console.log(err)
	      }
	      if (isMatch) {
	        req.session.user = data.username;
	        console.log('登录成功！')
	        return res.redirect('/')
	      }
	      else {
	      	console.log('登录失败！')
	        return res.redirect('/signin')
	      }
	    })
  	}
  })
}

exports.singinRequired = function(req, res, next){
	var user = req.session.user 

	if(!user){
		res.redirect('/signin')
	}

	next()
}

exports.adminRequired = function(req, res, next){
	var user = req.session.user 

	if(user.role < 10){
		res.redirect('/')
	}

	next()
}




















