/*var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var objectId = Schema.Types.ObjectId;
var autoIncrement = require('mongoose-auto-increment');   //自增ID 模块
    autoIncrement.initialize(mongodb.mongoose.connection);   //初始化

var BooksSchema = new Schema({
  name : String,      //名称
  author : String,    //作者
  category : [],      //分类
  image : String,     //封面
  press : String,     //出版社
  isbn : String,      //isbn
  page : String,      //页数
  sky_drive : String,  //网盘地址
  description : String,  //内容简介
  press_time : String,   //出版时间
  url : String,                 //官网链接
  create_time : { type: Date, default: Date.now },   //创建时间
  update_time : { type: Date, default: Date.now },   //更新时间
  pv : { type: Number, default: 0 },    //浏览次数
  dv : { type: Number, default: 0 }    //下载次数
});

var BooksTerms = new Schema({
  name : String,
  books: [{type: objectId, ref: 'Book'}],
  create_time : { type: Date, default: Date.now },   //创建时间
  update_time : { type: Date, default: Date.now },   //更新时间
});

BooksSchema.plugin(autoIncrement.plugin, {
  model: 'Books',
  field: 'bId',
  startAt: 1000,
  incrementBy: 1
});

BooksTerms.plugin(autoIncrement.plugin, {
  model: 'Terms',
  field: 'term_id',
  startAt: 1,
  incrementBy: 1
});

//BooksSchema.plugin(autoIncrement.plugin, 'Books');

var Books = mongodb.mongoose.model("Books", BooksSchema);
var Terms = mongodb.mongoose.model("Terms", BooksTerms);
function BooksDAO(){}

BooksDAO.prototype.save = function(obj, callback) {
  var instance = new Books(obj);
  instance.save(function(err, book){
    callback(err, book);
  });
};

BooksDAO.prototype.term_save = function(obj, callback) {
  var instance = new Terms(obj);
  instance.name = obj.category;
  instance.save(function(err, tmer){
    callback(err, tmer);
  });
};

BooksDAO.prototype.findByIdAndUpdate = function(obj,callback){
  var _id = obj._id;
  delete obj._id;
  Books.findOneAndUpdate(_id, obj, function(err,obj){
    callback(err, obj);
  });
}

BooksDAO.prototype.findByName = function(name, callback) {
  Books.findOne({name:name}, function(err, obj){
    callback(err, obj);
  });
};

BooksDAO.prototype.findByBid = function(obj, callback) {
  console.log('bId:' + obj);
  Books.findOne({bId:obj}, function(err, obj){
    callback(err, obj);
  });
};

BooksDAO.prototype.findNewTen = function(callback){
 
   Books.find({"bId":{"$lte": 1006}}, function(err, obj){
    if(err){
      console.log(err);
    }else {
      callback(err, obj);
    }
  });

};

module.exports = new BooksDAO();



*/
