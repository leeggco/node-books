var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectId = Schema.Types.ObjectId;
var autoIncrement = require('mongoose-auto-increment');   //����ID ģ��
    autoIncrement.initialize(mongoose.connection);        //��ʼ��
	
var CommunitySchema = new Schema({
	title: String,
	content: String,
	pv: { type: Number, default: 0 },
	reply_count: { type: Number, default: 0 },
	create_time : { type: Date, default: Date.now },        //����ʱ��
	update_time : { type: Date, default: Date.now },        //����ʱ��
	from : [{type: objectId, ref: "Users"}],
	reply : [{type: objectId, ref: "Comment"}]
})

CommunitySchema.plugin(autoIncrement.plugin, {
  model: 'Community',
  field: 'cmid',
  startAt: 1000,
  incrementBy: 1
});

CommunitySchema.pre('save', function(next) {
  if (this.isNew) {
    this.create_time = this.update_time = Date.now()
  }
  else {
    this.update_time = Date.now()
  }

  next()
})

module.exports = CommunitySchema













