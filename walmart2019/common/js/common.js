//初始值
var isMobile=/^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/; //手机号码验证规则
var c_width=$(window).width();
var c_height=$(window).height();
var num=Math.floor(Math.random()*5);//取0-4的随机数
///////////////将移动端click事件转换为touchstart事件，目的为了实现在移动端点击相应慢///////////////
///////////////////////////////////////////////////////////////////////////////////////////
//var isTouch = ('ontouchstart' in document.documentElement) ? 'touchend' : 'click', _on = $.fn.on;
//$.fn.on = function(){
//	arguments[0] = (arguments[0] === 'click') ? isTouch: arguments[0];
//	return _on.apply(this, arguments);
//};
////////////////////////////////////////////////////////////
/////////////////////////所有自定义JS////////////////////////
////////////////////////////////////////////////////////////
$(function() {
	//点击关闭错误提示
	$(".error").click(function(){
		$(".error").fadeOut(200);
	})
	//解决IOS微信6.7.4输入框失去焦点，软键盘关闭后，被撑起的页面无法回退到原来正常的位置
	$("input,select").blur(function(){
		setTimeout(function(){
			var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
			window.scrollTo(0, Math.max(scrollHeight - 1, 0));
		},100)
    })

	//滚动条
	if($(".jscrollbar").length){
		$(".jscrollbar").mCustomScrollbar({
			scrollInertia:300
		});
	}
	//点击弹出城市
	if($(".city_t").length){
		$(".city_t").click(function(){
			if ($(this).attr("data-type") === '2') {
        $(".pop_box").fadeIn(200);
        gb_height();
			}
		})
	}
	//点击按钮的效果
	$(".btnclick").click(function(e){
		var c = $(this);
		var id=c.data('id');
		var pops=c.data('pop');
		var closes=c.data('close');
		var url=c.data('url');
		c.addClass('rubber-a');
		setTimeout(function() {
			c.removeClass('rubber-a');
			if(url){
				location.href = url;
			}else if(id){
				$(".col_layout").fadeOut(200);
				$("."+id+"_box").fadeIn(200);
			}else if(pops){
				$("."+pops+"_box").fadeIn(200);
			}else if(closes){
				$("."+closes+"_box").fadeOut(200);
			}
		}, 600);
		/*if(!submits){
			e.preventDefault();
		}*/
	});
});

//配置部分页面内容高度
function gb_height(){
	var c_height=$(window).height();
	//弹出内容高度
	if($(".pop_nr").length){
		var p_height=c_height-250
		$(".pop_nr").css({
			"height":p_height+"px",
			"margin-top":"-"+(p_height/2)+"px"
		})
		$(".memdian_list").height(p_height-260);
	}
}


//错误提示
function error(text){
	var timeout;
	clearTimeout(timeout);
	$(".error").stop().fadeIn(200).html(text);
	timeout = setTimeout(function(){
		$(".error").stop().fadeOut(200);
	},4000)
}
