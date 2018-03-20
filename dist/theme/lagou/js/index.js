//首页 * 职位扩展
$(".content .container-body .sidebar .menu_box").hover(function(){
    $(this).addClass("current");
},function(){
    $(this).removeClass("current");
})

//首页 * 轮播图
var mySwiper = new Swiper ('.swiper-container', {
   loop: true,
   autoplay : 3000,
   // 如果需要分页器
   pagination: '.swiper-pagination',

   // 如果需要前进后退按钮
   nextButton: '.swiper-button-next',
   prevButton: '.swiper-button-prev',
 })
$(".swiper-container").hover(function(){
   mySwiper.stopAutoplay();
},function(){
   mySwiper.startAutoplay();
})

//首页 * 职位切换
$(".content .container-body .position_list:eq("+0+")").show();
$(".content .container-body .module-tabs ul li").on("click",function(){
    var flag=$(this).index();
    $(".content .container-body .module-tabs ul li").removeClass("active");
    $(this).addClass("active");
    $(".content .container-body .position_list").hide();
    $(".content .container-body .position_list:eq("+flag+")").show();
})

//首页 * 友情链接
var flag=0;
$(".linkbox dl .expansion").on("click",function(){
    if(flag==0){
        $(".linkbox").height('auto');
        $(".linkbox dl .expansion i").css({"transform":"rotate(-180deg)"})
        flag=1;
    }else{
        $(".linkbox").height(99);
        $(".linkbox dl .expansion i").css({"transform":"rotate(0deg)"})
        flag=0;
    }
})