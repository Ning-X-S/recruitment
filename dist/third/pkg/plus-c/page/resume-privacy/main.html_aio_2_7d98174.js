/*!plus-c/modules/resume-privacy/main.js*/
;define("plus-c/modules/resume-privacy/main",["require","exports","module"],function(){function a(a){$.ajax({url:GLOBAL_DOMAIN.sctx+"/companyshort/"+a+"/4",data:{companyName:a},type:"POST",dataType:"json"}).done(function(c){if($("#companySuggestion li").remove(),c.COMPANYSHORT&&c.COMPANYSHORT.length>0){for(var _='<li data-index="0" class="suggest_selected">屏蔽“'+a+"”公司</li>",i=0;i<c.COMPANYSHORT.length;i++)c.COMPANYSHORT[i].name!=a&&(_+='<li data-index="'+(i+1)+'">'+c.COMPANYSHORT[i].cont+"</li>");$("#companySuggestion").append(_),$("#companySuggestion").show(),b=!0}else $("#companySuggestion").hide()})}function c(){if(3==$(".btn_radio_active").data("type"))$(".ipt_content").hide(),$(".company_list").hide();else{{$(".block_company")}$.ajax({url:ctx+"/mycenter/getShieldSuffix.json",type:"POST",data:{},dataType:"json"}).done(function(a){if(1==a.state){if(a.content.data.hasData){for(var c="",i=0;i<a.content.data.list.length;i++)c+="<li><span><span>"+a.content.data.list[i].suffix+'</span><i class="delete_btn" data-id="'+a.content.data.list[i].id+'">删除</i></span></li>';$(".company_list li").remove(),$(".company_list").append(c)}if($(".company_list li"))var _=$(".company_list li").length;5==_?($(".ipt_btn").addClass("ipt_btn_disabled"),v=!1):($(".ipt_btn").removeClass("ipt_btn_disabled"),v=!0)}else alert(a.message)})}}function _(){2!=$(".btn_radio_active").data("type")&&$.ajax({url:ctx+"/mycenter/openMyResume.json",type:"POST",data:{openStatus:2},dataType:"json"}).done(function(a){1==a.state&&($(".btn_radio_active").removeClass("btn_radio_active"),$(".btn_radio").eq(1).addClass("btn_radio_active"))})}var y,h=500,v=!0;2!=$(".flagBtn").val()?($(".ipt_content").hide(),$(".company_list").hide()):($(".ipt_content").show(),$(".company_list").show()),$(".search_company").on("focus",function(){$(".company_list li").length<5&&$(this).addClass("onfocus_ipt")}),$(".search_company").on("blur",function(){$(this).removeClass("onfocus_ipt")}),v=$(".company_list li").length>4?!1:!0;var b=!0;$(".search_company").on("keyup focus",function(e){$(".search_company").css("borderColor","#0099ff");var c=$(this),_=$.trim(c.val());y=e.timeStamp,b=!((38==e.which?1:0)||(40==e.which?1:0)||(13==e.which?1:0)),setTimeout(function(){var c=_+"";y-e.timeStamp==0&&1==b&&(""!=c?a(_):($("#companySuggestion").hide(),$("#companySuggestion li").remove()))},h)}),c(),$("#companySuggestion").on("click","li",function(){0!=$(this).data("index")&&$(".search_company").val($(this).text()),$("#companySuggestion").hide(),$("#companySuggestion li").remove(),$(this).removeClass("onfocus_ipt")}),$(document).on("click",function(){$("#companySuggestion").hide(),$("#companySuggestion li").remove()}),$(".company_list").on("click",".delete_btn",function(){var a=$(this).parent().parent("li"),c=$(this).data("id");_(),$.ajax({url:ctx+"/mycenter/deleteShieldSuffix.json",type:"POST",data:{suffixId:c},dataType:"json"}).done(function(c){1==c.state?(a.remove(),$(".ipt_btn").hasClass("ipt_btn_disabled")?$(".ipt_btn").removeClass("ipt_btn_disabled"):"",v=!0):alert(c.message)})}),$(".btn_radio").on("click",function(){var a=$(this),_=$(this).data("type");a.hasClass("btn_radio_active")||$.ajax({url:ctx+"/mycenter/openMyResume.json",type:"POST",data:{openStatus:_},dataType:"json"}).done(function(y){1==y.state?($(".btn_radio_active").removeClass("btn_radio_active"),0==a.hasClass("btn_radio_active")&&a.addClass("btn_radio_active"),3==_||1==_?($(".ipt_content").hide(),$(".company_list").hide()):(c(),$(".ipt_content").show(),$(".company_list").show())):405==y.state})}),$(".ipt_btn").on("click",function(){var a=$.trim($(".search_company").val());_(),v&&""!=a?$.ajax({url:ctx+"/mycenter/saveShieldSuffix.json",type:"POST",data:{suffix:a},dataType:"json"}).done(function(a){if(1==a.state&&a.content.data&&a.content.data.record){var c="<li><span><span>"+a.content.data.record.suffix+'</span><i class="delete_btn" data-id="'+a.content.data.record.id+'">删除</i></span></li>';if($(".company_list").append(c),$(".company_list li")&&0!=$(".company_list li").length){var _=$(".company_list li").length;5==_?($(".ipt_btn").addClass("ipt_btn_disabled"),v=!1):($(".ipt_btn").removeClass("ipt_btn_disabled"),v=!0)}$(".search_company").val("")}else 1==a.state?$(".search_company").val(""):alert(a.message)}):$(".search_company").css("borderColor","#ff414f")})});
/*!plus-c/page/resume-privacy/main.js*/
;define("plus-c/page/resume-privacy/main",["require","exports","module","dep/jquery-colorbox/jquery.colorbox","plus-c/modules/resume-privacy/main"],function(require){require("dep/jquery-colorbox/jquery.colorbox"),require("plus-c/modules/resume-privacy/main")});