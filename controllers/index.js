var mongoose = require('mongoose')
var Book = require('../models/book')
var Category = require('../models/category')
var Pics = require('../models/pics')
var superagent = require('superagent')
var cheerio = require('cheerio')
var qn = require('qn')

exports.index = function(req, res){
	Book.count({}, function(err, total){
		Book.find({}, function(err, obj){
			Category.find({}, function(err, data){
				var arrfs = [];
				for (var i = 0; i < data.length; i++){
					var clen = data[i].books.length;
					var mark = (clen / total)  * 50;
					if( mark > 16){
						mark = 16;
					}
					arrfs[i] = mark + 12;
				}
				
				res.render('', {
					title: '首页 | 天天书屋',
					current:'home', json: obj,
					categories: data,
					arrfs: arrfs
				})
			})
		}).sort({'pv': -1}).limit(7);
	})
	
	var getUrl = 'http://www.socwall.com';
	superagent.get(getUrl)
    .end(function (err, sres) {
      if (err) {
        return err;
      }
 
      var $ = cheerio.load(sres.text);
      var picSrc = $('#content .wallpaper .image img').attr('src');
			var fullSrc = getUrl + picSrc;

		
			console.log(getUrl + picSrc)
			var qnurl = 'http://7xkl18.com1.z0.glb.clouddn.com/'
			var client = qn.create({
				accessKey: 'b8T--dSC-MiUe9St8zKbicb6BU8RxPJsTIBxsj-I',
				secretKey: 'Z_pw1clvrmvginYUwycttV0yX36jEHfVT4F0GpNf',
				bucket: 'ttbooks',
				domain: 'http://ttbooks.u.qiniudn.com'
			});

			// upload a file with custom key
			client.uploadFile(fullSrc, {key: '1232'}, function (err, result) {

				var _Pic = new Pics({
					small: fullSrc,
					from: getUrl
				});
				
				_Pic.save(function(err, data){ 
					if(err) console.log(err);
					
					console.log('data:'+data);
					console.log('result:'+result);
				});
			});
      
    });

/*	
	console.log('111');
	superagent.get('http://www.socwall.com/')
    .end(function (err, sres) {
      // 常规的错误处理
      if (err) {
        return err;
      }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text);
      var items = [];
      $('#content .wallpaper .image img').each(function (idx, element) {
        var $element = $(element);
				console.log($element)
        items.push({
          src: $element.attr('src')
        });
      });

      console.log($)
      console.log(items)
    });
*/

}























