$(function () {
    /*设置*/
    $('.privacy_settings_img').click(function () {
        window.location.href = "../account/resumePrivacy.htm";
    });
    $('.over').mouseover(function () {
        $(this).addClass("mr_active").find(".mr_edit").removeClass("dn");
    });
    $('.over').mouseout(function () {
        $(this).removeClass("mr_active").find(".mr_edit").addClass("dn");
    });
    $('#name_edit').click(function () {
        $(".mr_p_name").hide();
        $("#mr_name").val($(".mr_p_name .mr_name").text());
        $(".mr_name_edit").removeClass("dn");
        $("#nameForm").find("input#mr_name")[0].focus();
    });
    $('.cancel').click(function () {
        $(this).parent().parent().prev().show();
        $(this).parent().addClass("dn");
    });
    $('#intro_edit').click(function () {
        $(".mr_p_introduce").hide();
        "0" == $(this).attr("data-type") && $("#mr_intro").val($(".mr_p_introduce .mr_intro").text());
        $(".mr_intro_edit").removeClass("dn");
        $("#mr_intro").focus();
        $("#introduceForm .mroneError").hide();
    });
    $('.mr_edit_on').click(function () {
        $(".mr_p_info").hide();
        $(".mr_info_edit").removeClass("dn");
        $('#shenfen').val($(this).attr('data-shenfen'));
        var sex = $(this).attr('data-sex');
        $(".mr_sex span,.mr_sex i").removeClass("active"), "男" == sex ? ($(".mr_sex .mr_man").addClass("active"), $(".mr_sex .mr_man i").addClass("active")) : "女" == sex && ($(".mr_sex .mr_women").addClass("active"), $(".mr_sex .mr_women i").addClass("active"));
        $("#xl").val($(this).attr("data-xl"));
        $("#gznx").val($(this).attr("data-gzjy"));
        if ($("#mr_mobile").val($(this).attr("data-mobile")), $("#mr_email").val($(this).attr("data-email")), $("#szcs").val($(this).attr("data-city")), $(".mr_sns a").length > 0) {
            $(".mr_add_sns").show(), $(".sns_empty").hide();
            var g = "";
            $(".mr_sns a").each(function() {
                var a = $(this).data("sns"),
                    c = $(this).data("site"),
                    _ = "sns" + a;
                g += '<div class="form_wrap mr_sns_m">', g += '	<i class="' + _ + '"></i>', g += '	<em class="mr_ok"></em>', g += '	<a href="javascript:;" class="sns_del"></a>', g += '	<input type="text" id="' + _ + '" name="' + _ + '" data-sns="' + a + '" class="mr_button" value="' + c + '"/>', g += "</div>"
            }), $(".mr_info_edit .sns_area").html(g)
        }
        0 == $(".sns_area .mr_sns_m").length && ($(".mr_add_sns").hide(), $(".sns_empty").show()), $("#olinfoForm .mr_info_edit").removeClass("dn")
    });
    $('#mr_mr_head .mr_cancel').on({
        click: function () {
            $(".mr_p_info").show();
            $(".mr_info_edit").addClass("dn");
        }
    });
    $('.mr_head_r').click(function () {
        if ("添加" == $(this).children('em').text()){
            $('.mr_head_r').addClass('mr_add_grey');
            $('.mr_c_r_t').addClass('mr_up_grey');
            $(this).parent().next().children().first().show(), $(this).removeClass("mr_add_grey").removeClass("mr_up_grey").addClass("mr_addup_cel").children('em').text('取消');
        }else{
            $('.mr_head_r').removeClass('mr_add_grey');
            $('.mr_c_r_t').removeClass('mr_up_grey');
            $(this).parent().next().children().first().hide(), $(this).removeClass("mr_add_grey").removeClass("mr_up_grey").removeClass("mr_addup_cel").children('em').text('添加');
        }
    });
    $('#workExperience .mr_c_r_t').on({
        click: function () {
            $(this).parent().parent().parent().next().show();
            $(this).parent().parent().parent().hide();
            $('.mr_head_r').addClass('mr_add_grey');
            $('.mr_c_r_t').addClass('mr_up_grey');
        }
    });
    $('#workExperience .mr_cancel').on({
        click: function () {
            $(this).parent().parent().parent().prev().toggle();
            $(this).parent().parent().parent().toggle();
            $("#workExperience").find(".mr_head_r em").text("添加");
            $('.mr_head_r').removeClass('mr_add_grey');
            $('.mr_c_r_t').removeClass('mr_up_grey');
        }
    });
    $('#educationalBackground .mr_c_r_t').on({
        click: function () {
            $(this).parent().parent().next().show();
            $(this).parent().parent().hide();
            $('.mr_head_r').addClass('mr_add_grey');
            $('.mr_c_r_t').addClass('mr_up_grey');
        }
    });
    $('#educationalBackground .mr_cancel').on({
        click: function () {
            $(this).parent().parent().parent().prev().toggle();
            $(this).parent().parent().parent().toggle();
            $("#educationalBackground").find(".mr_head_r em").text("添加");
            $('.mr_head_r').removeClass('mr_add_grey');
            $('.mr_c_r_t').removeClass('mr_up_grey');
        }
    });
    $('#projectExperience .mr_c_r_t').on({
        click: function () {
            $(this).parent().parent().parent().next().show();
            $(this).parent().parent().parent().hide();
            $('.mr_head_r').addClass('mr_add_grey');
            $('.mr_c_r_t').addClass('mr_up_grey');
        }
    });
    $('#projectExperience .mr_empty_add').on({
        click: function () {
            $(this).hide();
            $(this).prev().show();
            $('.mr_head_r').addClass('mr_add_grey');
            $('.mr_c_r_t').addClass('mr_up_grey');
        }
    });
    $('#projectExperience .mr_cancel').on({
        click: function () {
            $(this).parent().parent().parent().prev().toggle();
            $(this).parent().parent().parent().toggle();
            $("#projectExperience").find(".mr_head_r em").text("添加");
            $('.mr_head_r').removeClass('mr_add_grey');
            $('.mr_c_r_t').removeClass('mr_up_grey');
        }
    });
    $('.mr_self_s').click(function (e) {
        e.stopPropagation(), $(".form_wrap").removeClass("select_color");
        var a = $(this).find(".xl_list");
        a.is(":hidden") && $(this).addClass("select_color"), a.toggle();
    });
    $('.mr_self_s').mouseover(function () {
        $(this).hasClass("active") && $(this).removeClass("active");
    });
    $('.mr_self_s').mouseout(function () {
        var a = $(this).find(".xl_list");
        a.is(":hidden") && $(this).addClass("active");
    });
    $('.ul_self_state').on("click","li",function () {
        $("#self_state").val($(this).text());
        $(this).parent().parent().removeClass('dn');
    });
    $('.md_flag').click(function () {
        $(".mr_module li").removeClass("active");
        $(this).addClass("active");
        var a = $(this).data("md");
        $('html, body').animate({scrollTop: $("#" + a).offset().top}, 500);
    });
    $(window).scroll(function(event){
        var t = document.documentElement.scrollTop || document.body.scrollTop;
        var top_div = $( ".scroll_fix" );
        if( t >= 210 ) {
            top_div.addClass('mr_myresume_r_fix');
        } else {
            top_div.removeClass('mr_myresume_r_fix');
        }
    });

    /**
     * 个人信息表单
     */
    $('.normal_s').click(function () {
        $(this).find('.xl_list').toggle();
        $('.select_color').removeClass('select_color');
        $(this).addClass('select_color');
    });
    $(".ul_shenfen").on("click","li", function(){
        $("#shenfen").val($(this).text());
        $(this).parent().parent().removeClass('dn');
        $(".select_color").removeClass("select_color");
    });
    $('.mr_man').click(function () {
        $(this).addClass("active").find("i").addClass("active");
        $(".mr_sex .mr_women").removeClass("active").find("i").removeClass("active");
    });
    $('.mr_women').click(function () {
        $(this).addClass("active").find("i").addClass("active");
        $(".mr_sex .mr_man").removeClass("active").find("i").removeClass("active");
    });
    $('.city_s').click(function () {
        $(this).find('.xl_list').toggle();
        $('.select_color').removeClass('select_color');
        $(this).addClass('select_color');
    });
    $('.ul_year').on("click","li",function () {
        var a = $("#mr_year").val();
        $("#mr_year").val($(this).text());
        $(this).parent().parent().removeClass('dn');
        $(".select_color").removeClass("select_color");
        a != $(this).text() && !!$("#mr_month").val() && function(a, c) {
            $("#olinfoForm .mr_days").show().find("#mr_day").val("01");
            for (var _ = getCountDays(a, c), h = [], i = 1; _ >= i; i++) h.push(10 > i ? "<li>0" + i + "</li>" : "<li>" + i + "</li>");
            $("#olinfoForm .mr_days .ul_day").html(h.join(""));
        }($("#mr_year").val(), $("#mr_month").val())
    });
    $('.ul_month').on("click","li",function () {
        var a = $("#mr_month").val();
        $("#mr_month").val($(this).text());
        $(this).parent().parent().removeClass('dn');
        $(".select_color").removeClass("select_color");
        a != $(this).text() && !!$("#mr_year").val() && function(a, c) {
            $("#olinfoForm .mr_days").show().find("#mr_day").val("01");
            for (var _ = getCountDays(a, c), h = [], i = 1; _ >= i; i++) h.push(10 > i ? "<li>0" + i + "</li>" : "<li>" + i + "</li>");
            $("#olinfoForm .mr_days .ul_day").html(h.join(""));
        }($("#mr_year").val(), $("#mr_month").val())
    });
    $('.ul_day').on("click","li",function () {
        $("#mr_day").val($(this).text());
        $(this).parent().parent().removeClass('dn');
        $(".select_color").removeClass("select_color");
    });
    $('.ul_xl').on("click","li",function () {
        $("#xl").val($(this).text());
        $(this).parent().parent().removeClass('dn');
        $(".select_color").removeClass("select_color");
    });
    $('.ul_gznx').on("click","li",function () {
        $("#gznx").val($(this).text());
        $(this).parent().parent().removeClass('dn');
        $(".select_color").removeClass("select_color");
    });
    $('.mr_province').on("click","li",function (e) {
        e.stopPropagation();
        $('.mr_province span').removeClass("mr_on");
        $('.mr_city').hide();
        $(this).find("span").addClass("mr_on");
        $(this).find("ul").show();
    });
    $('.mr_city').on("click","li",function (e) {
        e.stopPropagation();
        $("#szcs").val($(this).text());
        $('.mr_city li').removeClass("mr_on");
        $(this).addClass("mr_on");
        $(this).parent().hide();
        $('.xl_list').hide();
    });
    $('.mr_timed_div').click(function (e) {
        $(this).find('.mr_calendar_ym').toggle();
        e.stopPropagation();
    });
    $('.mr_year').on("click","li",function (e) {
        e.stopPropagation();
        var a = $(this);
        a.siblings().removeClass("active");
        a.addClass("active");

    });
    $('.mr_month').on("click","li",function (e) {
        var a = $(this);
        var b = a.parent().prev().children(".active");
        var c = a.parent().parent().parent().find(".mr_btn");
        c.val(b.text()+ '.' + (a.index()+1));
        a.siblings().find("span").removeClass("active");
        a.find("span").addClass("active");
    });
});
function getCountDays(a,c){
    var _=[31,28,31,30,31,30,31,31,30,31,30,31];
    return(a-0)%4==0&&c-0==2?29:_[c-1];
};