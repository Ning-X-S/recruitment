//显示屏蔽企业
$(".content .mr_myresume_l .mr_mr_head .privacy_settings").hover(function(){
    $(this).children(".privacy_settings_tip").show();
},function(){
    $(this).children(".privacy_settings_tip").hide();
})
//关闭屏蔽企业
$(".content .mr_myresume_l .mr_mr_head .privacy_settings .privacy_settings_close").on("click",function(){
    $(".content .mr_myresume_l .mr_mr_head .privacy_settings .privacy_settings_tip").hide();
})
//编辑个人信息
$(".content .mr_myresume_l .mr_mr_head .mr_baseinfo .mr_edit").on("click",function(){
    $(this).parent().addClass("dn");
    $(this).parent().next("form").children().removeClass("dn");
    $(".mr_head_r").addClass("mr_add_grey");
    $(this).removeClass("mr_add_grey");
})
$(".content .mr_myresume_l .mr_mr_head .mr_baseinfo form .cancel").on("click",function(){
    $(this).parent().parent().addClass("dn");
    $(this).parent().parent().parent().prev().removeClass("dn");
    $(".content .mr_myresume_l .mr_mr_head .mr_baseinfo .mr_head_r").removeClass("mr_add_grey");
    $(".mr_head_r").removeClass("mr_add_grey");
})
//切换男女
$(".mr_sex span").on("click",function(){
    $(".mr_sex span").removeClass("active");
    $(this).addClass("active");
})
$("#olinfoForm .form_wrap").on("click",function(event){
    event.stopPropagation();
    if($(this).children(".xl_list").hasClass("dn")){
        $("#olinfoForm .xl_list").addClass("dn");
        $(this).children(".xl_list").removeClass('dn');
    }else{
        $(this).children(".xl_list").addClass('dn');
    }
})
//添加
var flag=0;
$(".mr_moudle_head .mr_head_r").on("click",function(){
    if(flag==0){
        $(".content .mr_myresume_l .mr_mr_head .mr_baseinfo .mr_head_r").addClass("mr_add_grey");
        $(".mr_head_r").addClass("mr_add_grey");
        $(this).removeClass("mr_add_grey");
        $(this).parents('.mr_moudle_head').next(".mr_moudle_content").children("form").removeClass("dn");
        $(this).children("em").text("取消");
        $(this).parents('.mr_moudle_head').next(".mr_moudle_content").children("form").nextAll(".mr_empty_add").addClass("dn");
        $(this).parents('.mr_moudle_head').next(".mr_moudle_content").children("form").prevAll(".me_skill_list").addClass("dn");
        flag=1;
    }else{
        $(".content .mr_myresume_l .mr_mr_head .mr_baseinfo .mr_head_r").removeClass("mr_add_grey");
        $(".mr_head_r").removeClass("mr_add_grey");
        $(this).parents('.mr_moudle_head').next(".mr_moudle_content").children("form").addClass("dn");
        $(this).children("em").text("添加");
        if(!$(this).parents('.mr_moudle_head').next(".mr_moudle_content").children("form").nextAll(".list_show").is(":empty")){
            $(this).parents('.mr_moudle_head').next(".mr_moudle_content").children("form").nextAll(".mr_empty_add").addClass("dn");
        }else{
        }
        $(this).parents('.mr_moudle_head').next(".mr_moudle_content").children("form").prevAll(".me_skill_list").removeClass("dn");
        flag=0;
    }
})
$(".mr_cancel").on("click",function(){
    $(".mr_head_r").removeClass("mr_add_grey");
    $(this).parents('form').addClass("dn");
    $(this).parents('.mr_moudle_content').prev(".mr_moudle_head").children().children("em").text("添加");
    if(!$(this).parents('form').nextAll(".list_show").is(":empty")){
        $(this).parents('form').nextAll(".mr_empty_add").addClass("dn");
    }
    flag=0;
})
$(".mr_empty_add").on("click",function(){
    $(this).addClass("dn");
    $(this).prev("form").removeClass("dn");
    $(this).parents('.mr_moudle_content').prev(".mr_moudle_head").children(".mr_head_r").children("em").text("取消");
    flag=1;
})
//时间二级菜单
var bb=0;
$(".mr_timed_div").on("click",function(event){
    event.stopPropagation();
    var flag=$(this).index();
    $(".mr_timed_div .mr_calendar_ym").hide();
    if(bb==0){
        $(this).children(".mr_calendar_ym").show();
        bb=1;
    }else{
        $(this).children(".mr_calendar_ym").hide();
        bb=0;
    }
})
$(".mr_calendar_ym .mr_year li").on("click",function(){
    $(this).siblings("li").removeClass("active");
    $(this).addClass("active");
    bb=0;
})
$(".mr_calendar_ym .mr_month span").on("click",function(){
    $(this).parent("li").siblings("li").children("span").removeClass("active");
    $(this).addClass("active");
    var end=$(this).text();
    var start=$(this).parents(".mr_month").siblings(".mr_year").children(".active").text();
    var times=start+"."+end;
    times=times.substring(0,times.length-1);
    $(this).parents(".mr_calendar_ym").siblings(".mr_btn").attr("value",times);
})
//热门城市
$(".mr_job_city").on("click",function(event){
    event.stopPropagation();
    if($(this).children(".xl_list:last-child").hasClass("dn")){
        $(this).children(".xl_list:last-child").removeClass("dn");
    }else{
        $(this).children(".xl_list:last-child").addClass("dn");
    }
})
$(".mr_job_city li span").on("click",function(event){
    event.stopPropagation();
    $(".mr_job_city li span").removeClass("mr_on");
    $(this).addClass("mr_on");
    $(".mr_job_city li .mr_city").addClass("dn");
    $(this).next(".mr_city").removeClass("dn");
})
$(".mr_job_city li .mr_city li").on("click",function(){
    $(".mr_job_city li .mr_city li").removeClass("mr_on");
    $(this).addClass("mr_on");
    $(this).parents(".xl_list").addClass("dn");
})
//学历菜单
$(".mr_timed_div").on("click",function(){
    if($(this).children(".xl_list").hasClass("dn")){
        $(".xl_list").addClass("dn");
        $(this).children(".xl_list").removeClass("dn");
    }else{
        $(".xl_list").addClass("dn");
        $(this).children(".xl_list").addClass("dn");
    }
})
$(".xl_list li").on("click",function(event){
    event.stopPropagation();
    var id=$(this).attr("data-id");
    var text=$(this).text();
    $(this).parents(".xl_list").prev(".mr_btn").val(text);
    $(this).parents(".xl_list").prev(".mr_btn").attr("data-id",id);
    $(this).parents(".xl_list").prev().prev(".mr_button").val(text);
    $(this).parents(".xl_list").prev().prev(".mr_button").attr("data-id",id);
    $(".xl_list").addClass("dn");
})
//工作年限
$(".form_wrap").on("click",function(){
    console.log(111);
    if($(this).children(".xl_list").hasClass("dn")){
        console.log('true');
        $(this).children(".xl_list").removeClass("dn");
    }else{
        console.log('false');
        $(this).children(".xl_list").addClass("dn");
    }
})
//切换作品
$(".mr_worksshow_tab span").on("click",function(){
    var index=$(this).index();
    $(".mr_worksshow_tab span").removeClass("selected");
    $(".mr_moudle_content .add_worksshow_form:eq("+index+") .mr_worksshow_tab span:eq("+index+")").addClass("selected");
    $(".mr_moudle_content .add_worksshow_form").addClass("dn");
    $(".mr_moudle_content .add_worksshow_form:eq("+index+")").removeClass("dn");
})
//技能熟练程度
//function drag(){
var tag = false,ox = 0,left = 0,bgleft = 0,offsetLeft=0;
$(".mr_skill_circle").on("mousedown",function(e) {
    ox = e.pageX - left;
    tag = true;
    bgleft=$(".mr_skill_plan").offset().left;
});
$(".mr_skill_circle").on("mousemove",function(e) {
    if (tag) {
        left = e.pageX-bgleft;
        if (left <= 0) {
            left = 0;
        }else if (left > 420) {
            left = 420;
        }
        $(this).css('left', left+122);
        $(this).prevAll(".mr_skill_plan").children("em").width(parseInt((left/420)*100)+"%");
        if(parseInt((left/420)*100)<=25){
            $(this).children("em").text("了解");
        }else if(parseInt((left/420)*100)<=50){
            $(this).children("em").text("掌握");
        }else if(parseInt((left/420)*100)<=75){
            $(this).children("em").text("熟悉");
        }else {
            $(this).children("em").text("专家");
        }
    }
});
$(document).on("mouseup",function(e) {
    tag = false;
});
$(".mr_skill_plan").on("click",function(e) {
    if (!tag) {
        bgleft = $(this).offset().left;
        left = e.pageX - bgleft;
        if (left <= 0) {
            left = 0;
        }else if (left > 420) {
            left = 420;
        }
        $(this).nextAll(".mr_skill_circle").css('left', left+120);
        $(this).children("em").width(left);
        if(parseInt((left/420)*100)<=25){
            $(this).nextAll(".mr_skill_circle").children("em").text("了解");
        }else if(parseInt((left/420)*100)<=50){
            $(this).nextAll(".mr_skill_circle").children("em").text("掌握");
        }else if(parseInt((left/420)*100)<=75){
            $(this).nextAll(".mr_skill_circle").children("em").text("熟悉");
        }else {
            $(this).nextAll(".mr_skill_circle").children("em").text("专家");
        }
    }
});
//}
//关闭所用菜单
$("body").on("click",function (e){
    $(".mr_timed_div .mr_calendar_ym").hide();
    $(".xl_list").addClass("dn");
    bb=0;
})
//编辑
function cancel(id){
    console.log(id);
    $(".mr_content_r .mr_edit").addClass("mr_add_grey");
    $("#jobview"+id+"").addClass("dn");
    $("#jobform"+id+"").removeClass("dn");
}
//取消
function editor(id){
    $("#jobview"+id+"").removeClass("dn");
    $("#jobform"+id+"").addClass("dn");
    $(".mr_content_r .mr_edit").removeClass("mr_add_grey");
}
//工作经历 * 删除
function workEliminate(id){
    $(".mr_content_r .mr_edit").removeClass("mr_add_grey");
    $("#jobview"+id+"").remove();
    $("#jobform"+id+"").remove();
    var url='http://localhost:8080/web/rest/resume/deletework.htm';
    workAjax(url,id);
}
//工作经历 * 更新
function workUpdate(id){
    $(".mr_content_r .mr_edit").removeClass("mr_add_grey");
    var index=$("#jobview"+id+"").index();
    var url='http://localhost:8080/web/rest/resume/updatework.htm',
    iid=parseInt($("#workExperience .updatejob_wrap #jobform"+id+" .mr_expid").val()),
    companyName=null,autoPosition=null,
    start=$("#workExperience .updatejob_wrap #jobform"+id+" .mr_time_area .mr_sta_time .mr_btn").val(),
    end=$("#workExperience .updatejob_wrap #jobform"+id+" .mr_time_area .mr_end_time .mr_btn").val(),
    logo=$("#workExperience .updatejob_wrap #jobform"+id+" .mr_flag").val(),
    text=$("#workExperience .updatejob_wrap #jobform"+id+" .wrap_editor textarea").val();
    if($("#workExperience .updatejob_wrap #jobform"+id+" .mr_input_div .companyName").val()){
        companyName=$("#workExperience .updatejob_wrap #jobform"+id+" .mr_input_div .companyName").val();
    }else{
        $("#workExperience .updatejob_wrap #jobform"+id+" #companyName-error").show();
    }
    if($("#workExperience .updatejob_wrap #jobform"+id+" .mr_input_div .autoPosition").val()){
        autoPosition=$("#workExperience .updatejob_wrap #jobform"+id+" .mr_input_div .autoPosition").val();
    }else{
        $("#workExperience .updatejob_wrap #jobform"+id+" #positionName-error").show();
    }
    if(companyName!==null&&autoPosition!==null){
        $("#jobform"+id+"").remove();
        $("#jobview"+id+"").remove();
        workAjax(url,iid,companyName,autoPosition,start,end,logo,text,index)
    }
}
//教育经历 * 删除
function educationEliminate(id){
    $(".mr_content_r .mr_edit").removeClass("mr_add_grey");
    $("#jobview"+id+"").remove();
    $("#jobform"+id+"").remove();
    var url='http://localhost:8080/web/rest/resume/deleteeducational.htm';
    workAjax(url,id);
}
//教育经历 * 更新
function educationUpdate(id){
    $(".mr_content_r .mr_edit").removeClass("mr_add_grey");
    var index=$("#jobview"+id+"edu").index();
    var url='http://localhost:8080/web/rest/resume/updateeducational.htm',
    iid=parseInt($("#educationalBackground .list_show #jobform"+id+"edu .mr_expid").val()),
    schoolName=null,major=null,
    uid=parseInt($("#educationalBackground #jobform"+id+"edu .mr_time_area .mr_timed_div:eq("+0+") .mr_btn").attr("data-id")),
    year=parseInt($("#educationalBackground #jobform"+id+"edu .mr_time_area .mr_timed_div:eq("+1+") .mr_btn").val());
    if($("#educationalBackground .list_show #jobform"+id+"edu .mr_input_div .autoCollege").val()){
        schoolName=$("#educationalBackground .list_show #jobform"+id+"edu .mr_input_div .autoCollege").val();
    }else{
        $("#educationalBackground .list_show #jobform"+id+"edu #companyName-error").show();
    }
    if($("#educationalBackground .list_show #jobform"+id+"edu .mr_input_div .autoMajor").val()){
        major=$("#educationalBackground .list_show #jobform"+id+"edu .mr_input_div .autoMajor").val();
    }else{
        $("#educationalBackground .list_show #jobform"+id+"edu #positionName-error").show();
    }
    if(schoolName!==null&&major!==null){
        $("#jobform"+id+"edu").remove();
        $("#jobview"+id+"edu").remove();
        educationAjax(url,id,schoolName,major,uid,year,index)
    }
}
//项目经验 * 删除
function projectEliminate(id){
    var arr=id.split('p');
    $(".mr_content_r .mr_edit").removeClass("mr_add_grey");
    $("#jobview"+id+"").remove();
    $("#jobform"+id+"").remove();
    var url='http://localhost:8080/web/rest/resume/deleteproject.htm';
    workAjax(url,parseInt(arr[0]));
}
//项目经验 * 更新
function projectUpdate(id){
    var arr=id.split('p');
    var index=$("#jobview"+id+"").index();
    $(".mr_content_r .mr_edit").removeClass("mr_add_grey");
    var url='http://localhost:8080/web/rest/resume/updateproject.htm',
    name=null,duty=null,startDate=null,endDate=null,note=null,
    link=$("#projectExperience #jobform"+id+" .mr_prolink #yourDuty").val();
    if($("#projectExperience #jobform"+id+" .mr_input_div #projectName").val()){
        name=$("#projectExperience #jobform"+id+" .mr_input_div #projectName").val();
    }else{
        $("#projectExperience #jobform"+id+" #projectName-error").show();
    }
    if($("#projectExperience #jobform"+id+" .mr_input_div #thePost").val()){
        duty=$("#projectExperience #jobform"+id+" .mr_input_div #thePost").val();
    }else{
        $("#projectExperience #jobform"+id+" #thePost-error").show();
    }
    if($("#projectExperience #jobform"+id+" .mr_time_area .mr_timed_div:eq("+0+") .mr_btn").val()){
        startDate=$("#projectExperience #jobform"+id+" .mr_time_area .mr_timed_div:eq("+0+") .mr_btn").val();
    }else{
        $("#projectExperience #jobform"+id+" .mr_time_area .mr_timed_div:eq("+0+")").css("margin-bottom","25px");
        $("#projectExperience #jobform"+id+" .mr_time_area .mr_timed_div:eq("+0+") #startTime-error").show();
    }
    if($("#projectExperience #jobform"+id+" .mr_time_area .mr_timed_div:eq("+1+") .mr_btn").val()){
        endDate=$("#projectExperience #jobform"+id+" .mr_time_area .mr_timed_div:eq("+1+") .mr_btn").val();
    }else{
        $("#projectExperience #jobform"+id+" .mr_time_area .mr_timed_div:eq("+1+")").css("margin-bottom","25px");
        $("#projectExperience #jobform"+id+" .mr_time_area .mr_timed_div:eq("+1+") #endTime-error").show();
    }
    if($("#projectExperience #jobform"+id+" .wrap_editor textarea").val()){
        note=$("#projectExperience #jobform"+id+" .mr_input_div #thePost").val();
    }else{
        $("#projectExperience #jobform"+id+" #ueditor_textarea_editorValue-error").show();
    }
    if(name!=null&&duty!=null&&note!=null&&startDate!=null&&endDate!=null){
        $("#jobform"+id+"").remove();
        $("#jobview"+id+"").remove();
        projectAjax(url,parseInt(arr[0]),name,duty,startDate,endDate,note,link,index);
    }
}
//添加工作经历
$("#workExperience #addJobForm .mr_ope .mr_save").on("click",function(){
    var url='http://localhost:8080/web/rest/resume/addwork.htm',
    id=null,companyName=null,autoPosition=null,start=null,end=null,
    logo=$("#companylogopath").val(),text=$(".item_container_target .wrap_editor textarea").val();
    if($("#workExperience .mr_input_div .companyName").val().length){
        companyName=$("#workExperience .mr_input_div .companyName").val();
    }else{
        $("#workExperience #companyName-error").show();
    }
    if($("#workExperience .mr_input_div .autoPosition").val().length){
        autoPosition=$("#workExperience .mr_input_div .autoPosition").val();
    }else{
        $("#workExperience #positionName-error").show();
    }
    if($("#workExperience #addJobForm .mr_time_area .mr_timed_div:eq("+0+") .mr_btn").val().length){
        start=$("#addJobForm .mr_time_area .mr_timed_div:eq("+0+") .mr_btn").val();
    }else{
        $("#workExperience #addJobForm .mr_time_area .mr_timed_div:eq("+0+")").css("margin-bottom","20px");
        $("#workExperience #addJobForm .mr_time_area .mr_timed_div:eq("+0+") #startTime-error").show();
    }
    if($("#workExperience #addJobForm .mr_time_area .mr_timed_div:eq("+1+") .mr_btn").val().length){
        end=$("#workExperience #addJobForm .mr_time_area .mr_timed_div:eq("+1+") .mr_btn").val();
    }else{
        $("#workExperience #addJobForm .mr_time_area .mr_timed_div:eq("+1+")").css("margin-bottom","20px");
        $("#workExperience #addJobForm .mr_time_area .mr_timed_div:eq("+1+") #endTime-error").show();
    }
    if(companyName!==null&&autoPosition!==null&&start!==null,end!==null){
        if(text==null){
            workAjax(url,id,companyName,autoPosition,start,end);
        }else if(logo==null){
            workAjax(url,id,companyName,autoPosition,start,end,logo);
        }else{
            workAjax(url,id,companyName,autoPosition,start,end,logo,text);
        }
        $(this).parents(".jobExpForm").addClass("dn");
        $(this).parents(".item_container_target").children(".mr_moudle_head").find("em").text("编辑");
        $(".mr_head_r").removeClass("mr_add_grey");
        flag=0;
    }
})
//添加教育经历
$("#educationalBackground #addEduForm .mr_save").on("click",function(){
    var url='http://localhost:8080/web/rest/resume/addeducational.htm',
    iid=null,schoolName=null,major=null,id=null,year=null;
    if($("#educationalBackground #addEduForm .autoCollege").val().length){
        schoolName=$("#educationalBackground #addEduForm .autoCollege").val();
    }else{
        $("#educationalBackground #addEduForm #schoolName-error").show();
    }
    if($("#educationalBackground #addEduForm .autoMajor").val().length){
        major=$("#educationalBackground #addEduForm .autoMajor").val();
    }else{
        $("#educationalBackground #addEduForm #positionName-error").show();
    }
    if($("#educationalBackground #addEduForm .mr_timed_div:eq("+0+") .mr_btn").attr("data-id")){
        id=parseInt($("#educationalBackground #addEduForm .mr_timed_div:eq("+0+") .mr_btn").attr("data-id"));
    }else{
        $("#educationalBackground #addEduForm .mr_timed_div:eq("+0+")").css("margin-bottom","20px");
        $("#educationalBackground #addEduForm .mr_timed_div:eq("+0+") #degree_text-error").show();
    }
    if($("#educationalBackground #addEduForm .mr_timed_div:eq("+1+") .mr_btn").val().length){
        year= parseInt($("#educationalBackground #addEduForm .mr_timed_div:eq("+1+") .mr_btn").val());
    }else{
        $("#educationalBackground #addEduForm .mr_timed_div:eq("+1+")").css("margin-bottom","20px");
        $("#educationalBackground #addEduForm .mr_timed_div:eq("+1+") #graduate_text-error").show();
    }
    if(schoolName!==null&&major!==null&&id!==null,year!==null){
        educationAjax(url,iid,schoolName,major,id,year);
        $("#educationalBackground #addEduForm").addClass("dn");
        $("#educationalBackground .mr_moudle_head .mr_head_r em").text("添加");
        $(".mr_head_r").removeClass("mr_add_grey");
        flag=0;
    }
})
//添加项目经验
$("#projectExperience #addProForm .mr_ope .mr_save").on("click",function(){
    var url="http://localhost:8080/web/rest/resume/addproject.htm",
    name=null,duty=null,note=null,startDate=null,endDate=null,
    link=$("#projectExperience #addProForm .mr_prolink #pro_link").val();
    if($("#projectExperience #addProForm .mr_input_div #projectName").val()){
        name=$("#projectExperience #addProForm .mr_input_div #projectName").val();
    }else{
        $("#projectExperience #addProForm #projectName-error").show();
    }
    if($("#projectExperience #addProForm .mr_input_div #thePost").val()){
        duty=$("#projectExperience #addProForm .mr_input_div #thePost").val();
    }else{
        $("#projectExperience #addProForm #thePost-error").show();
    }
    if($("#projectExperience #addProForm .mr_time_area .mr_timed_div:eq("+0+") .mr_btn").val()){
        startDate=$("#projectExperience #addProForm .mr_time_area .mr_timed_div:eq("+0+") .mr_btn").val();
    }else{
        $("#projectExperience #addProForm .mr_time_area .mr_timed_div:eq("+0+")").css("margin-bottom","25px");
        $("#projectExperience #addProForm .mr_time_area .mr_timed_div:eq("+0+") #startTime-error").show();
    }
    if($("#projectExperience #addProForm .mr_time_area .mr_timed_div:eq("+1+") .mr_btn").val()){
        endDate=$("#projectExperience #addProForm .mr_time_area .mr_timed_div:eq("+1+") .mr_btn").val();
    }else{
        $("#projectExperience #addProForm .mr_time_area .mr_timed_div:eq("+1+")").css("margin-bottom","25px");
        $("#projectExperience #addProForm .mr_time_area .mr_timed_div:eq("+1+") #endTime-error").show();
    }
    if($("#projectExperience #addProForm .wrap_editor textarea").val()){
        note=$("#projectExperience #addProForm .mr_input_div #thePost").val();
    }else{
        $("#projectExperience #addProForm #ueditor_textarea_editorValue-error").show();
    }
    if(name!=null&&duty!=null&&note!=null&&startDate!=null&&endDate!=null){
        projectAjax(url,name,duty,startDate,endDate,note,link)
        $("#projectExperience #addProForm").addClass("dn");
        $("#projectExperience .mr_moudle_head .mr_head_r em").text("添加");
        $(".mr_head_r").removeClass("mr_add_grey");
        flag=0;
    }
})
//个人简历
$(".mr_mr_head .mr_baseinfo #olinfoForm .mr_ope .mr_save:eq("+0+")").on("click",function(){
    var edge=$(".mr_mr_head .mr_baseinfo #olinfoForm .mr_showidentity_div #shenfen").val(),
    phone=null,
    email=null,
    sex=$(".mr_mr_head .mr_baseinfo #olinfoForm .mr_sex .active em").text(),
    birthday=$(".mr_mr_head .mr_baseinfo #olinfoForm .mr_years #mr_year").val()-$(".mr_mr_head .mr_baseinfo #olinfoForm .mr_months #mr_month").val()-$(".mr_mr_head .mr_baseinfo #olinfoForm .mr_days #mr_day").val(),
    workYear=parseInt($(".mr_mr_head .mr_baseinfo #olinfoForm .normal_s .xl_list li").attr("data-id")),
    degree=parseInt($(".mr_mr_head .mr_baseinfo #olinfoForm .normal_s #xl").attr("data-id"));
    if($(".mr_mr_head .mr_baseinfo #olinfoForm .mobile_s #sess_phone").val().length){
        phone=$(".mr_mr_head .mr_baseinfo #olinfoForm .mobile_s #sess_phone").val();
    }else{
        $(".mr_mr_head .mr_baseinfo #olinfoForm #mr_mobile-error").show();
    }
    if($(".mr_mr_head .mr_baseinfo #olinfoForm .email_s #sess_email").val().length){
        email=$(".mr_mr_head .mr_baseinfo #olinfoForm .email_s #sess_email").val();
    }else{
        $(".mr_mr_head .mr_baseinfo #olinfoForm #mr_email-error").show();
    }
    if(phone!==null&&email!==null){
        personalAjax(edge,phone,email,sex,birthday,workYear,degree);
        $(".mr_mr_head .mr_baseinfo #olinfoForm").attr("onsubmit","111");
    }
})
//修改技能
$(".mr_mr_head .mr_baseinfo #introduceForm .save").on("click",function(){
    var edge=$(".mr_mr_head .mr_baseinfo #introduceForm #mr_intro").val();
    skillsAjax(edge);
//    $(".mr_mr_head .mr_baseinfo .mr_p_introduce").removeClass("dn");
//    $(".mr_mr_head .mr_baseinfo #introduceForm").addClass("dn");
})
//自我描述
$("#selfDescription #upSelfForm .mr_ope .mr_save").on("click",function(){
    var note=$("#selfDescription #upSelfForm .wrap_editor textarea").val();
    introduce(note);
    $(".mr_head_r").removeClass("mr_add_grey");
})
//工作经历
function workAjax(url,id,name,duty,startDate,endDate,logo,note,length){
    $.ajax({
        type: 'POST',
        url: url,
        dataType: 'json',
        data :{"id":id,"companyName":name,"post": duty,"startDate":startDate,"endDate":endDate,"logo":logo,"note":note},
        async : false,
        success: function(data){
            console.log(data);
            if(id==null){
               var source   = document.getElementById("work-template").innerHTML;
               var template = Handlebars.compile(source);
               var html    = template(data);
               $("#workExperience .updatejob_wrap").prepend(html);
            }else{
                var source   = document.getElementById("work-template").innerHTML;
                var template = Handlebars.compile(source);
                var html    = template(data);
                if(length==0){
                    $("#workExperience .list_show  .updatejob_wrap").children().eq(length).before(html);
                }else{
                    $("#workExperience .list_show .updatejob_wrap").children().eq(length).after(html);
                }
            }
        },
        error: function(xhr, type){

        }
    });
}
//教育经历
function educationAjax(url,iid,schoolName,major,id,year,length){
    $.ajax({
        type: 'POST',
        url: url,
        dataType: 'json',
        data :{"id":iid,"schoolName":schoolName,"major": major,"degree.id":id,"year":year},
        async : false,
        success: function(data){
            console.log(data);
            if(iid==null){
                var source   = document.getElementById("education-template").innerHTML;
                var template = Handlebars.compile(source);
                var html    = template(data);
                $("#educationalBackground .list_show").prepend(html);
            }else{
                var source   = document.getElementById("education-template").innerHTML;
                var template = Handlebars.compile(source);
                var html    = template(data);
                console.log(length);
                if(length==0){
                    $("#educationalBackground .list_show").children().eq(length).before(html);
                }else{
                    $("#educationalBackground .list_show").children().eq(length).after(html);
                }
            }
        },
        error: function(xhr, type){

        }
    });
}
//修改个人简历
function personalAjax(edge,phone,email,sex,birthday,workYear,degree){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/web/rest/resume/updateresume.htm',
        dataType: 'json',
        data :{"edge":edge,"phone": phone,"email":email,"sex":sex,"birthday":birthday,"workYear.id":workYear,"degree.id":degree},
        async : false,
        success: function(data){
                console.log(111);
            console.log(data);
        },
        error: function(xhr, type){

        }
    });
}
//修改个人技能
function skillsAjax(edge,phone,email,sex,birthday,workYear,degree){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/web/rest/resume/updateresume.htm',
        dataType: 'json',
        data :{"edge":edge},
        async : false,
        success: function(data){
            console.log(data);
        },
        error: function(xhr, type){

        }
    });
}
//自我描述
function introduce(note){
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/web/rest/resume/updateresume.htm',
        dataType: 'json',
        data :{"note":note},
        async : false,
        success: function(data){
            console.log(data);
            if(data.code==0){
                $("#selfDescription .self_des_list .mr_self_r").text(note);
                $("#selfDescription #upSelfForm").addClass("dn");
                $("#selfDescription .self_des_list").removeClass("dn");
                $("#selfDescription .mr_moudle_head .mr_head_r em").text("编辑");
            }
        },
        error: function(xhr, type){

        }
    });
}
//项目经验
function projectAjax(url,id,name,duty,startDate,endDate,note,link,length){
    $.ajax({
        type: 'POST',
        url: url,
        dataType: 'json',
        data :{"id":id,"name":name,"duty":duty,"startDate": startDate,"endDate":endDate,"note":note,"link":link},
        async : false,
        success: function(data){
            console.log(data);
            if(id==null){
               var source   = document.getElementById("project-template").innerHTML;
               var template = Handlebars.compile(source);
               var html    = template(data);
               $("#projectExperience .list_show").prepend(html);
            }else{
                console.log(length);
                var source   = document.getElementById("project-template").innerHTML;
                var template = Handlebars.compile(source);
                var html    = template(data);
                console.log(html);
                console.log(length);
                if(length==0){
                    $("#projectExperience .list_show").children().eq(length).before(html);
                }else{
                    $("#projectExperience .list_show").children().eq(length).after(html);
                }
            }
        },
        error: function(xhr, type){

        }
        });
}