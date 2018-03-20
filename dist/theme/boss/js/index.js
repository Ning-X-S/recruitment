$(function(){
    /*列表划出划入*/
    $(".job-menu dl").on("mouseover",function () {
        $(".job-menu dl").removeClass("cur");
        $(this).addClass("cur");
    });
    $(".job-menu dl").on("mouseout",function () {
        $(this).removeClass("cur");
    });

    /*地点点击事件*/
    $(".city-sel").on("click",function(event){
        event.stopPropagation();
        $(".position-box").hide();
        $(".industry-box").hide();
        if($(this).hasClass("show-city")){
            $(this).removeClass("show-city");
            $(".city-box").hide();
        }else{
            $(this).addClass("show-city");
            $(".city-box").show();
        }
    });
    /*职位类型点击事件*/
    var positionFlag = true;
    $(".position-sel").on("click",function(event){
        event.stopPropagation();
        $(".industry-box").hide();
        $(".city-sel").removeClass("show-city");
        $(".city-box").hide();
        if(positionFlag){
            $(".position-box").show();
            positionFlag = false ;
        }else{
            $(".position-box").hide();
            positionFlag = true ;
        }
    });
    /*行业点击事件*/
    var industryFlag = true ;
    $(".industry-sel").on("click",function(event){
        event.stopPropagation();
        $(".city-sel").removeClass("show-city");
        $(".position-box").hide();
        $(".city-box").hide();
        if(industryFlag){
            $(".industry-box").show();
            industryFlag = false ;
        }else{
            $(".industry-box").hide();
            industryFlag = true ;
        }
    });
    /*推荐*/
    $(".ipt-search").on("focus",function () {
        $(".suggest-result").show();
    });
    $(".ipt-search").on("blur",function () {
        $(".suggest-result").hide();
    });

    /*联动事件*/
    $(".dorpdown-province li").on("mouseover",function () {
        $(".dorpdown-province li").removeClass("cur");
        $(this).addClass("cur");
        $(".dorpdown-city ul").removeClass("show");
        $(".dorpdown-city ul").eq($(this).index()).addClass("show");
    });
    /*tab切换*/
    $(".job-tab-box h3 span").on("click",function () {
        $(".job-tab-box h3 span").removeClass("cur");
        $(this).addClass("cur");
        $(".job-tab-box ul").removeClass("cur");
        $(".job-tab-box ul").eq($(this).index()).addClass("cur");
    });
    $(".company-tab-box h3 span").on("click",function () {
        $(".company-tab-box h3 span").removeClass("cur");
        $(this).addClass("cur");
        $(".company-tab-box ul").removeClass("cur");
        $(".company-tab-box ul").eq($(this).index()).addClass("cur");
    });

    /*点击body隐藏*/
    $("#wrap").on("click",function () {
        $(".city-sel").removeClass("show-city");
        $(".city-box").hide();
        $(".industry-box").hide();
        $(".position-box").hide();
    });
});