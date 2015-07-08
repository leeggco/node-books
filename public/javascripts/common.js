$(document).ready(function(){
	$('#douban').blur(function(){
		var id = $(this).val();
		$.ajax({
			type: 'get',
			url: 'https://api.douban.com/v2/book/' + id,
			dataType: 'jsonp',
			jsonp: 'callback',
			jsonpCallback: 'jsonpCallback',
			crossDomain: true,
			success: function(data){
				$('#average').val(data.rating.average)
				$('#name').val(data.title)
				$('#author').val(data.author[0])
				$('#categoryName').val(data.tags[0].name)
				$('#isbn').val(data.isbn10)
				$('#page').val(data.pages)
				$('#image').val(data.images.large)
				$('#press').val(data.publisher)
				$('#press_time').val(data.pubdate)
				$('#description').val(data.summary)
			}
		})
	});

	var record = false;
	var retime = null;
	$('.download-link').click(function(){
		var bid = $(this).attr('bid');
		clearTimeout(retime);
		if(record == false){
			$.ajax({
				type: 'post',
				url: '/record_download',
				data: {'bid': bid},
				success: function(data){
				}
			})	
			record = true;
		}

		retime = setTimeout(function(){
			record = false
		}, 300000)
	});

  $('.item-content-wrap .item-content').hover(function(){
  	$(this).find('.reply').toggle()
  });

  $('.item-content-ft .reply').click(function(){
  	$('.reply-box').hide();
  	$(this).next('.reply-box').toggle();
  });
	
  $('.reply-box .reply-btn').click(function(){
  	var data = $(this).parent().parent().prev('.reply');
  	var txt = $(this).parent().prev().find('.reply-text').val();
  	var cid = data.attr('data-cid');
  	var to = data.attr('data-uid');
  	var from = data.attr('data-user');
			
		if(txt == ''){
			$(this).parent().prev().find('.reply-text').attr('placeholder', '请输入内容').addClass('error')
		}else {
			$.ajax({
				type: 'post',
				url: '/set_comment',
				data: {'cid':cid, 'from':from, 'to': to, 'content' : txt},
				success: function(data){
					if(data.msg === 'success'){
						window.location.reload();
					}
				}
			});
		}
  });

  $('#toThx').bind('click', function(){
    var _this = $(this);
    var from = _this.attr('data-from');
    var bid = _this.attr('data-bid');

    $.ajax({
      type: 'post',
      url: '/tothx',
      data: {'from': from, 'bid': bid},
      success: function(data){
        if(data.msg === 'success'){
          _this.unbind('click')
          _this.addClass('iconActived')
        }
      }
    })
  })
	
  $('.issues-search .btn-success').click(function(){
		$('.new-issue').slideToggle(200);
	})
	
	$('.issue-list li').hover(function(event){
		console.log(event)
		$(this).find('.operate').toggle();
	})
	
	$('.issue-edit').click(function(){
		var cmid = $(this).attr('data-cmid');
		
		$.ajax({
			type: 'get',
			url: '/issue_operate',
			data: {'cmid': cmid, 'handle': 'edit'},
			success: function(data){
				if(data.status === 'success'){
					var cmid = data.msg.cmid;
					var title = data.msg.title;
					var content = data.msg.content;
					$('#issueForm').append('<input type="hidden" name="cmid" value="'+cmid+'" />');
					$('#newIssue .issue-title').val(title)
					$('#newIssue .issue-content').val(content)
					$('#newIssue').slideDown(200);
				}
			}
		})
	})
	
	
});