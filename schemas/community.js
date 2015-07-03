var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectId = Schema.Types.ObjectId;
var autoIncrement = require('mongoose-auto-increment');   //����ID ģ��
    autoIncrement.initialize(mongoose.connection);        //��ʼ��
	
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
	create_time : { type: Date, default: Date.now },        //����ʱ��
	update_time : { type: Date, default: Date.now },        //����ʱ��
})

CommunitySchema.plugin(autoIncrement.plugin, {
  model: 'Community',
  field: 'cmid',
  startAt: 1000,
  incrementBy: 1
});















