var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectId = Schema.Types.ObjectId;
var autoIncrement = require('mongoose-auto-increment');   //自增ID 模块
    autoIncrement.initialize(mongoose.connection);   //初始化


var Category = new Schema({
  name : String,
  upperCase : String,
  books: [{type: objectId, ref: 'Books'}],
  create_time : { type: Date, default: Date.now },   //创建时间
  update_time : { type: Date, default: Date.now },   //更新时间
});

Category.plugin(autoIncrement.plugin, {
  model: 'Category',
  field: 'cid',
  startAt: 1,
  incrementBy: 1
});

module.exports = Category