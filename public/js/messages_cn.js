jQuery.extend(jQuery.validator.messages, {
  required: "内容不能为空",
	remote: "请修正该字段",
	email: "请输入正确格式的电子邮件",
	url: "请输入合法的网址",
	date: "请输入合法的日期",
	dateISO: "请输入合法的日期 (ISO).",
	number: "请输入合法的数字",
	digits: "只能输入整数",
	creditcard: "请输入合法的信用卡号",
	equalTo: "请再次输入相同的值",
	accept: "请输入拥有合法后缀名的字符串",
	maxlength: jQuery.validator.format("长度最多{0}个字哦"),
	minlength: jQuery.validator.format("长度最少是{0}个字哦"),
	rangelength: jQuery.validator.format("长度需介于{0} 和 {1} "),
	range: jQuery.validator.format("长度需介于 {0} 和 {1} 之间的值"),
	max: jQuery.validator.format("长度需大为{0} 的值"),
	min: jQuery.validator.format("长度需最小为{0} 的值")
});

jQuery.validator.addMethod("stringCheck", function(value, element) {       
    return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);       
 }, "只能包括中文字、英文字母、数字和下划线");  

$(function(){
	$("#signinForm").validate({
		rules:{
			username:{
				required:true,
				rangelength:[4,15]
			},
			password:{
				required:true,
				rangelength:[6,18]
			}
		},
		messages:{
			username:{
				required:"用户名长度请控制在4~15个字符以内"
			},
			password:{
				required: "密码不能为空",
			}
		}
	});
});

$("#signupForm").validate({
	rules:{
		username:{
			required:true,
			rangelength:[4,15]
		},
		email:{
			required:true,
			email:true
		},
		password:{
			required:true,
			rangelength:[6,18]
		},
		Rpassword:{
			equalTo:"#singupPassword"
		}                    
	},
	messages:{
		username:{
			required:"用户名长度请控制在4~15个字符以内"
		},
		email:{
			required:"不能为空",
			email:"邮件格式不正确"
		},
		password:{
			required: "不能为空",
		},
		Rpassword:{
			equalTo:"两次密码输入不一致"
		}                                    
	}
});

$("#addform").validate({
	rules:{
		name:{
			required:true
		},
		author:{
			required:true
		},
		categoryName:{
			required:true
		},
		image:{
			required:true
		},
		sky_drive:{
			required:true
		}                    
	}
});

$('#issueForm').validate({
	rules:{
		title: {
			required:true,
			minlength:5
		},
		content: {
			required:true,
			minlength:2
		}
	}
});

$('#replyForm').validate({
	rules:{
		content: {
			required:true,
		}
	}
});



