var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var crypto = require('crypto')
var objectId = Schema.Types.ObjectId
var autoIncrement = require('mongoose-auto-increment')  	//自增ID 模块
    autoIncrement.initialize(mongoose.connection)         //初始化

var PicSchema = new Schema({
  small: String,																					
	large: {type: String, default: 'unknow' },
	remark : {type: String, default: 'none' },
	author: {type: String, default: 'unknow' },
	from: {type: String, default: 'unknow' },
	create_time: { type: Date, default: Date.now },        //创建时间
  update_time: { type: Date, default: Date.now },        //更新时间
  pv: { type: Number, default: 0 },                      //浏览次数
});

PicSchema.plugin(autoIncrement.plugin, {
  model: 'Pics',
  field: 'pid',
  startAt: 1,
  incrementBy: 1
});


module.exports = PicSchema



