var Books = require('./../models/Books.js');

exports.bookAdd = function(req, res) {
    console.log('------------req.params.name:'+ req.params.name);
    if(req.params.name){  //update
        return res.render('admin_add', {
            title:req.params.name+'|书籍|管理|1',
            label:'编辑书籍:'+req.params.name,
            book:req.params.name
        });
    } else {
        return res.render('admin_add',{
            title:'新增加|书籍|管理| 2',
            label:'新增书籍',
            book:false
        });
    }
};

exports.doBookAdd = function(req, res) {
    var obj = req.body
    var catId = obj.category
    var catName = obj.categoryName

    var _book = new Books(obj)
    _book.save(function(err, data){
        
        if(err){
          console.log(err)
        }
        console.log(data)
    })

    /*
    Books.findOne({name: obj.name}, function(err, book){
        console.log('111');
    });

    Books.term_save(obj, function(err, tmer){
        if(err) {
           console.log(err);
        } else {
           var _id = tmer._id;
           obj.category = _id;
           Books.save(obj, function(err, book){
                if(err) {
                     res.redirect('/');
                } else {
                    res.redirect('/detail/'+ book.bId);
                }
           });
        }
    });
    */

};

/*
exports.bookJSON = function(req, res) {
    Books.findByName(req.params.name,function(err, obj){
        res.send(obj);
    });
}
*/

exports.detail = function(req, res) {
    console.log('req.params.bId:' + req.params.bId);
    Books.findByBid(req.params.bId, function(err, obj){
        if(err){
            console.log('读取失败');
        }else {
            console.log('读取成功');
        }

        //res.send(obj);
        //res.render('/detail', { title: '详情页', data: obj });
        //return obj;
        res.render('detail', { title: obj.name + ' | 天天书屋' , json: obj });
    });

}

exports.bookHomePage = function(req, res){
    console.log('req:' + req);
    console.log('res:' + res);

    Books.findNewTen(function(err, obj){
        if(err){
            console.log('读取失败');
        }else {
            console.log('读取成功22');
        }
        res.render('', { title: '首页 | 天天书屋' , json: obj });
    });
}

