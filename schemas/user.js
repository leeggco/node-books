var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var crypto = require('crypto')
var objectId = Schema.Types.ObjectId
var autoIncrement = require('mongoose-auto-increment')  	//自增ID 模块
    autoIncrement.initialize(mongoose.connection)         //初始化
    
var userSchema = new Schema({
	username: String, 																		//用户名
	password: String, 																		//密码
	nickname: String, 																		//昵称
	email: String,    																		//邮箱
	intro: String,		 																	//简介
	sex: String,																			//性别
	location: String,																		//地区
	gravatar: String, 																		//头像
	devote: String,   																		//贡献分数
	role: {type: Number,default: 0},														//权限级别
	topics: [{type: objectId, ref: 'Community'}], 					//我的主题
	down_list: [{type: objectId, ref: 'Books'}], 					//下载列表
	pv_list: [{type: objectId, ref: 'Books'}],   					//浏览列表
	devote_list: [{type: objectId, ref: 'Books'}], 					//上传列表
	devote_count: { type: Number, default: 0 },						//上传数量
	createTime: { type: Date, default: Date.now }, 					//创建时间
	updateTime: { type: Date, default: Date.now }, 					//更新时间
	visitors: [{
    user: {
      uid: {type: objectId, ref: 'Users'},
      username: String,
      gravatar: String
    },
    at: {type: Date, default: Date.now }
  }]																							//访问设备、时间
});

userSchema.plugin(autoIncrement.plugin, {
  model: 'Users',
  field: 'uid',
  startAt: 1000,
  incrementBy: 1
});

userSchema.pre('save', function(next){
	var user = this 

	if(user.isNew){
		this.createTime = this.updateTime = Date.now()
	}
	else{
		this.updateTime = Date.now()
	}

	console.log('user:' + user)
  var md5sum = crypto.createHash('sha1')
  md5sum.update(user.password, 'utf8')
  var str = md5sum.digest('hex')
  user.password = str
  console.log(str)

  next()
})


userSchema.methods = {
	comparePassword: function(password, dbpassword , cb){
	  var md5sum = crypto.createHash('sha1')
	  md5sum.update(password, 'utf8')
	  var str = md5sum.digest('hex')
		
		if(str === dbpassword){		//加密密码比对
			cb(null, true)
		}
	}
}

userSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort('updateTime')
			.exec(cb)
	},
	findById: function(id, cb){
		return this
			.findOne({_id: id})
			.exec(cb)
	},
	beMD5: function(data){
		var md5 = crypto.createHash('md5')
			md5.update(data, 'utf8')
			md5 = md5.digest('hex')
			console.log(md5)
			return md5
	},
	getAvatar: function(user, cb){
		return this.findOne({username: user})
		.exec(cb)

	}
}



module.exports = userSchema













