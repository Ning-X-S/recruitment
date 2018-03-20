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
    });
    $('#mr_mr_head .mr_cancel').on({
        click: function () {
            $(".mr_p_info").show();
            $(".mr_info_edit").addClass("dn");
        }
    });
    $('.mr_head_r').click(function () {
        if ($(this).hasClass("mr_add_grey")){return;}

        if ("添加" == $(this).children('em').text()){
            $('.mr_head_r').addClass('mr_add_grey');
            $('.mr_c_r_t').addClass('mr_up_grey');
            $(this).parent().next().children().first().removeClass("dn"), $(this).removeClass("mr_add_grey").removeClass("mr_up_grey").addClass("mr_addup_cel").children('em').text('取消');
        }else if ("编辑" == $(this).children('em').text()){
            $('.mr_head_r').addClass('mr_add_grey');
            $('.mr_c_r_t').addClass('mr_up_grey');
            $(this).parent().next().children().first().removeClass("dn"),$(this).parent().next().find(".self_des_list").addClass("dn"), $(this).removeClass("mr_add_grey").removeClass("mr_up_grey").addClass("mr_addup_cel").children('em').text('取消');
        }else if ("上传" == $(this).children('em').text()){

        }else{
            $('.mr_head_r').removeClass('mr_add_grey');
            $('.mr_c_r_t').removeClass('mr_up_grey');
            $(this).parent().next().children().first().addClass("dn"), $(this).removeClass("mr_add_grey").removeClass("mr_up_grey").removeClass("mr_addup_cel").children('em').text('添加');
            if ($(this).parent().next().find(".self_des_list").hasClass("dn")){
                $(this).parent().next().find(".self_des_list").removeClass("dn");
                $(this).children('em').text('编辑');
            }
        }
    });


    $('#workExperience .mr_cancel').on({
        click: function () {
            $(this).parent().parent().parent().prev().removeClass("dn");
            $(this).parent().parent().parent().addClass("dn");
            $("#workExperience").find(".mr_head_r em").text("添加");
            $('.mr_head_r').removeClass('mr_add_grey');
            $('.mr_c_r_t').removeClass('mr_up_grey');
        }
    });
    $('#educationalBackground .mr_c_r_t').on({
        click: function () {
            if ($(this).hasClass("mr_up_grey")){return;}
            $(this).parent().parent().next().removeClass("dn");
            $(this).parent().parent().addClass("dn");
            $('.mr_head_r').addClass('mr_add_grey');
            $('.mr_c_r_t').addClass('mr_up_grey');
        }
    });
    $('#educationalBackground .mr_cancel').on({
        click: function () {
            $(this).parent().parent().parent().prev().removeClass("dn");
            $(this).parent().parent().parent().addClass("dn");
            $("#educationalBackground").find(".mr_head_r em").text("添加");
            $('.mr_head_r').removeClass('mr_add_grey');
            $('.mr_c_r_t').removeClass('mr_up_grey');
        }
    });
    $('#self-introduction .mr_c_r_t').on({
        click: function () {
            $(this).parent().parent().next().removeClass("dn");
            $(this).parent().parent().addClass("dn");
            $('.mr_head_r').addClass('mr_add_grey');
            $('.mr_c_r_t').addClass('mr_up_grey');
        }
    });
    $('#self-introduction .mr_empty_add').on({
        click: function () {
            $(this).addClass("dn");
            $(this).prev().removeClass("dn");
            $('.mr_head_r').addClass('mr_add_grey');
            $('.mr_c_r_t').addClass('mr_up_grey');
        }
    });
    $('#self-introduction .mr_cancel').on({
        click: function () {
            $(this).parent().parent().parent().parent().find(".self_des_list").removeClass("dn");
            $(this).parent().parent().parent().parent().prev().find(".mr_head_r").children("em").text("编辑");
            $(this).parent().parent().parent().addClass("dn");
            $('.mr_head_r').removeClass('mr_add_grey');
            $('.mr_c_r_t').removeClass('mr_up_grey');
        }
    });
    $('.mr_self_s').click(function (e) {

         $(".form_wrap").removeClass("select_color");
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

    $('.mr_man').click(function () {
        $("#sex").val("男");
        $(this).addClass("active").find("i").addClass("active");
        $(".mr_sex .mr_women").removeClass("active").find("i").removeClass("active");
    });
    $('.mr_women').click(function () {
        $("#sex").val("女");
        $(this).addClass("active").find("i").addClass("active");
        $(".mr_sex .mr_man").removeClass("active").find("i").removeClass("active");
    });


});
function getCountDays(a,c){
    var _=[31,28,31,30,31,30,31,31,30,31,30,31];
    return(a-0)%4==0&&c-0==2?29:_[c-1];
};