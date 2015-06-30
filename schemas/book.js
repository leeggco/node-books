var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var objectId = Schema.Types.ObjectId;
var autoIncrement = require('mongoose-auto-increment');   //自增ID 模块
    autoIncrement.initialize(mongoose.connection);        //初始化
    
var BookSchema = new Schema({
  name: String,                                          //名称
  author: String,                                        //作者
  category: [{type: objectId, ref: 'Category'}],         //分类
  from: [{type: objectId, ref: 'Users'}],                //贡献人
  image: String,                                         //封面
  press: String,                                         //出版社
  isbn: String,                                          //ISBN
  page: {type: String, default: '未知'},                 //页数
  sky_drive: String,                                     //网盘地址
  description: String,                                   //内容简介
  press_time: String,                                    //出版时间
  url: String,                                           //官网链接
  average: { type: String, default: '0' },               //豆瓣评分
  create_time: { type: Date, default: Date.now },        //创建时间
  update_time: { type: Date, default: Date.now },        //更新时间
  pv: { type: Number, default: 0 },                      //浏览次数
  dv: { type: Number, default: 0 },                      //下载次数
  thanks: [{                                             //感谢次数
    user: {type: objectId, ref: 'Users'},
    username: String,
    at: {type: Date, default: Date.now }
  }],
  visitors: [{
    user: {
      uid: {type: objectId, ref: 'Users'},
      username: String,
      gravatar: String
    },
    at: {type: Date, default: Date.now },
    navigator: String
  }]
});

BookSchema.plugin(autoIncrement.plugin, {
  model: 'Books',
  field: 'bid',
  startAt: 1000,
  incrementBy: 1
});

BookSchema.pre('save', function(next) {
  if (this.isNew) {
    this.create_time = this.update_time = Date.now()
  }
  else {
    this.update_time = Date.now()
  }

  next()
})
module.exports = BookSchema













