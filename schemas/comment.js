var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectId = Schema.Types.ObjectId;
var autoIncrement = require('mongoose-auto-increment');   //自增ID 模块
    autoIncrement.initialize(mongoose.connection);        //初始化
    
var CommentSchema = new Schema({
  book : [{type: objectId, ref: "Books"}],
  from : [{type: objectId, ref: "Users"}],
  reply : [{
    from : {type: objectId, ref: "Users"},
    to : {type: objectId, ref: "Users"},
    create_time : { type: Date, default: Date.now }, 
    content : String
  }],
  content: String,
  create_time : { type: Date, default: Date.now },        //创建时间
  update_time : { type: Date, default: Date.now },        //更新时间
});

CommentSchema.plugin(autoIncrement.plugin, {
  model: 'Comment',
  field: 'cid',
  startAt: 1000,
  incrementBy: 1
});

CommentSchema.pre('save', function(next){
  if(this.isNew){
    this.create_time = this.update_time = Date.now()
  } else{
    this.update_time = Date.now()
  }

  next()
})

CommentSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('update_time')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = CommentSchema













