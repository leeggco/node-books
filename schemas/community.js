var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectId = Schema.Types.ObjectId;
var autoIncrement = require('mongoose-auto-increment');   //自增ID 模块
    autoIncrement.initialize(mongoose.connection);        //初始化
	
var CommunitySchema = new Schema({
	topic: String,
	pv: { type: Number, default: 0 },
	content: String,
 	from : [{type: objectId, ref: "Users"}],
	reply : [{
		from : {type: objectId, ref: "Users"},
		to : {type: objectId, ref: "Users"},
		create_time : { type: Date, default: Date.now }, 
		content : String
	}],
	create_time : { type: Date, default: Date.now },        //创建时间
	update_time : { type: Date, default: Date.now },        //更新时间
})

CommunitySchema.plugin(autoIncrement.plugin, {
  model: 'Community',
  field: 'cmid',
  startAt: 1000,
  incrementBy: 1
});















