$(document).ready(function(){
	
  $('.issues-search .btn-success').click(function(){
		$('.new-issue').slideDown(200);
	})
  $('#issueForm .btn-cancel').click(function(){
		$('.new-issue').slideUp(200);
		$('#issueForm .issue-title').val('');
		$('#issueForm .issue-content').val('');
	})
	
	$('.issues-search .btn-cance').click(function(){
		$('.new-issue').slideDown(200);
	})
	
	$('.issue-list li').mouseenter(function(event){
		$(this).find('.operate').show();
	})
	
	$('.issue-list li').mouseleave(function(event){
		$(this).find('.operate').hide();
	})
	
  $('.item-content-wrap .item-content').hover(function(){
  	$(this).find('.reply').toggle()
  	$(this).find('.unlogin').toggle()
  });

  $('.item-content-ft .reply').click(function(){
  	$('.reply-box').hide();
  	$(this).next('.reply-box').toggle();
  });
	
	$('.item-content-ft .unlogin').click(function(){
		$(this).parent().find('.error').remove();
  	$(this).before('<span class="error">请先登录，再回复</span>')
		$(this).parent().find('.error').delay(2000).fadeOut(300);
  });
	
	
	
	//Ajax methods
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

  $('.reply-box .reply-btn').click(function(){
  	var data = $(this).parent().parent().prev('.reply');
  	var txt = $(this).parent().prev().find('.reply-text').val();
  	var cid = data.attr('data-cid');
  	var to = data.attr('data-uid');
  	var bid = data.attr('data-bid');
  	var from = data.attr('data-user');
  	var is_id = $('#is_id').val();
		var href = window.location.href;
		var url = '';
		
		if(href.indexOf('detail') > -1){
			url = '/set_comment';
		}else if(href.indexOf('community') > -1){
			url = '/issue_comment';
		}
		
		if(txt == ''){
			$(this).parent().prev().find('.reply-text').attr('placeholder', '请输入内容').addClass('error')
		}else {
			
			$.ajax({
				type: 'post',
				url: url,
				data: {'cid': cid, 'bid': bid, 'from': from, 'to': to, 'content' : txt, 'is_id': is_id},
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
        if(data.status === 'success'){
          _this.unbind('click')
          _this.addClass('iconActived')
					showResText(data.status, data.resTxt)
        }
      }
    })
  })
	
  $('#tolaud').bind('click', function(){
    var _this = $(this);
    var from = _this.attr('data-from');
    var pid = _this.attr('data-pid');

    $.ajax({
      type: 'post',
      url: '/tolaud',
      data: {'from': from, 'pid': pid},
      success: function(data){
        if(data.status === 'success'){
          _this.unbind('click')
          _this.addClass('fa-thumbs-up')
					_this.next().text(parseInt(_this.next().text()) + 1);
					//showResText(data.status, data.resTxt)
        }
      }
    })
  })
	
	$('.issue-edit').click(function(){
		var cmid = $(this).attr('data-cmid');
		
		$.ajax({
			type: 'get',
			url: '/issue_operate',
			data: {'cmid': cmid, 'handle': 'edit'},
			success: function(data){
				if(data.status === 'success'){
					var is_id = data.msg._id;
					var title = data.msg.title;
					var content = data.msg.content;
					var formscroll = $('.cm-subnav').offset().top + 60;
					$('#issueForm').append('<input type="hidden" name="is_id" value="'+is_id+'" />');
					$('#issueForm .submitIssue').val('更新');
					$('#newIssue .issue-title').val(title)
					$('#newIssue .issue-content').val(content)
					$('#newIssue').slideDown(200);
					$('body').animate({ scrollTop: formscroll + 'px' }, 200);
				}
			}
		});
	});
	
	$('.del-btn').click(function(){
		var type = $(this).attr('data-type');
		var id = $(this).attr('data-id');
		$('#myModal .btn-data').attr({'data-type': type, 'data-id': id})
	});
	
	$('#myModal .btn-data').click(function(){
		var that = $(this);
		var type = that.attr('data-type');
		var id = that.attr('data-id');
		that.unbind('click');
		
		$.ajax({
			type: 'post',
			url: '/issueDel',
			data: {'type': type, 'id': id},
			success: function(data){
				console.log(data)
				if(data.status === 'success'){
					$('#myModal').fadeOut(100);
					$('.modal-backdrop').fadeOut(100);
					$('.issue-'+ id).fadeOut(500);
					showResText(data.status, data.resTxt)
				}
			}
		});
	});
	
	$('.comment-box .del').click(function(){
		var that = $(this);
		var type = that.attr('data-type');
		var id = that.attr('data-id');
		var isid = that.attr('data-isid');
		var bid = that.attr('data-bid');
		var pid = that.attr('data-pid');
		that.unbind('click');
		console.log(bid);
		$.ajax({
			type: 'post',
			url: '/commentDel',
			data: {'type': type, 'id': id, 'pid': pid, 'isid': isid, 'bid': bid},
			success: function(data){
				console.log(data)
				if(data.status === 'success'){
					that.parentsUntil('.comment-box').parent().slideUp(100);
					showResText(data.status, data.resTxt)
				}
			}
		});
	});

	function showResText(status, str){
		if(status === 'success'){
			var html = '<div class="resTxt rtsuccess">'+str+'</div>';
		}else if(status === 'error'){
			var html = '<div class="resTxt rterror">'+str+'</div>';
		}
		$('body').append(html);
		
		var $resTxt = $('.resTxt');
		$resTxt.slideDown(200);
		$resTxt.delay(1500).slideUp(200, function(){
			$resTxt.remove();
		});
	}
	
});
