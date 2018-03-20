//触顶隐藏
if($(document).scrollTop()==0){
    $("#backtop").hide();
}else{
    $("#backtop").show();
}
$(window).scroll(function(){
    if($(document).scrollTop()==0){
        $("#backtop").hide();
    }else{
        $("#backtop").show();
    }
});

//点击返回顶部
$("#backtop").on("click",function(){
    $('body,html').animate({scrollTop:0},500)
})

//悬浮显示二维码
$(".footer .inner_wrapper a").hover(function(){
    $(this).children("img").show();
},function(){
    $(this).children("img").hide();
})
