function iselect_fun() {
    $(".iselect_input").each(function (a) {
        $(this).click(function () {
            $(".iselect_layer").eq(a).fadeIn("fast")
        })
    }), $(".iselect_input").hover(function () {
    }, function () {
        $(".iselect_layer").hide()
    }), $(".select_btn").find("input").hover(), $(".iselect_layer").hover(function () {
        $(this).show()
    }, function () {
        $(this).fadeOut("fast")
    }), $(".iselect_layer").each(function (a) {
        $(this).find("span").click(function () {
            $('.iselect_input,input[name="type"]').val($(this).text()), $(".iselect_layer").fadeOut("fast")
        })
    })
}

function clearMsg(a) {
    var b = $("#new_message_count").data("code");
    $.post("/action/jobMessage/clearMsg", {messageCountId: a, user_code: b}, function (b, c) {
        "success" == c && b.result && $("#new-message-" + a).remove()
    })
}

function praiseCompany(a, b) {
    var c = $("#praise_company_count_" + a), d = $("#praise_company_" + a);
    d.hasClass("on") ? c.text(parseInt(c.text()) - 1) : c.text(parseInt(c.text()) + 1), $.post("/action/jobCompany/praiseCompany", {
        target_id: a,
        user_code: b
    }, function (a, b) {
    })
}

function addWelfareTagToCompany(a, b) {
    var c = $(".welfaretag a[data-id=" + a + "]").text(), d = $(".welfaretag a[data-id=" + a + "]").data("code");
    $.post("/action/jobCompany/addWelfareTag", {tag_id: a, company_id: b, user_code: d}, function (d, e) {
        if ("success" == e && d.result) {
            var f = d.data;
            $(".welfaretag a[data-id=" + a + "]").remove();
            var g = "<a href='' class='btn btn-sm btn-default alert' role='alert'><span>" + c + "</span><button type='button' class='close' data-dismiss='alert' onclick='removeWelfareTagFromCompany(" + f + ", " + b + ")'><span aria-hidden='true'>×</span></button></a>";
            $("#company-welfare-tags a.btn-add-welfare").before(g)
        }
    })
}

function removeWelfareTagFromCompany(a, b) {
    var c = $("#company-welfare-tags").data("code");
    $.post("/action/jobCompany/removeWelfareTag", {
        company_welfare_id: a,
        company_id: b,
        user_code: c
    }, function (b, c) {
        "success" == c && b.result && $("#company-welfare-tags a[data-id=" + a + "]").remove()
    })
}

function deliverResume(a, b) {
    $.post("/action/jobDeliver/deliver", {position: a, user_code: b}, function (a, b) {
        "success" == b && alert(a.msg)
    })
}

function deletePosition(a, b) {
    confirm("确定要删除当前职位吗？不可恢复！") && $.post("/action/jobPosition/deletePosition", {
        position: a,
        user_code: b
    }, function (a, b) {
        "success" == b && (alert(a.msg), location.reload())
    })
}

function refreshPosition(a, b) {
    $.post("/action/jobPosition/refreshPosition", {position: a, user_code: b}, function (b, c) {
        "success" == c && (b.result ? $("#btn_refresh_position_" + a).prop("onclick", null).html("已刷新") : alert(b.msg))
    })
}

function closePosition(a, b) {
    $.post("/action/jobPosition/closePosition", {position: a, user_code: b}, function (a, b) {
        "success" == b && (alert(a.msg), location.reload())
    })
}

function reopenPosition(a, b) {
    $.post("/action/jobPosition/reopenPosition", {position: a, user_code: b}, function (a, b) {
        "success" == b && (alert(a.msg), location.reload())
    })
}

function filterSkill(a) {
    $.post("/action/jobCommon/filterSkills", {
        user_code: a,
        description: $("textarea[name='description']").val()
    }, function (a, b) {
        if ("success" == b && a.result) {
            var c = $("input[name='skills']").val();
            if ("" != c) {
                if ("" != a.data) {
                    for (var d = new String(a.data).split(","), e = $("input[name='skills']").val(), f = e.split(","), g = 0; g < d.length; g++) {
                        for (var h = d[g], i = !1, j = 0; j < f.length; j++) if (h == f[j]) {
                            i = !0;
                            break
                        }
                        i || (e = e + "," + h)
                    }
                    $("input[name='skills']").val(e)
                }
            } else $("input[name='skills']").val(a.data)
        }
    })
}

function addNewAddrStreet() {
    var a = $('[name="addr"]'), b = a.find(".select-label input[type='text']"),
        c = a.find(".select-label input[name='addr_street']"), d = $("input[name='new_addr_street']").val(),
        e = $("#new_addr_street_tip");
    0 == d.trim().length ? e.html("请输入正确内容！").show() : ($(a).find(".option").removeClass("active"), $(a).find("[data-type='option']").prepend("<div class='option active' value='" + d + "'>" + d + "</div>"), $(b).val(d), $(c).val(d), $("input[name='new_addr_street']").val(""), $("#new_addr_street_btn").click(), e.hide())
}

function collectPosition(a, b) {
    var c = $("#position-collection-count-" + a), d = $("#collect-position-" + a);
    d.hasClass("on") ? c.text(parseInt(c.text()) - 1) : c.text(parseInt(c.text()) + 1), $.post("/action/jobPosition/collectPosition", {
        obj_id: a,
        user_code: b
    }, function (a, b) {
        "success" == b && a.result
    })
}

function unCollectPosition(a, b) {
    $.post("/action/jobPosition/collectPosition", {obj_id: a, user_code: b}, function (b, c) {
        "success" == c && b.result && $("#collection_" + a).remove()
    })
}

function topPosition(a, b) {
    $.post("/action/jobPosition/topPosition", {obj_id: a, user_code: b}, function (c, d) {
        "success" == d && c.result && $("#top-position-btn-" + a).attr("href", "javascript:unTopPosition(" + a + ",'" + b + "');").html("<small>取消推荐</small>")
    })
}

function unTopPosition(a, b) {
    $.post("/action/jobPosition/unTopPosition", {obj_id: a, user_code: b}, function (c, d) {
        "success" == d && c.result && $("#top-position-btn-" + a).attr("href", "javascript:topPosition(" + a + ",'" + b + "');").html("<small>推荐</small>")
    })
}

function bottomPosition(a, b) {
    $.post("/action/jobPosition/bottomPosition", {obj_id: a, user_code: b}, function (c, d) {
        "success" == d && c.result && $("#bottom-position-btn-" + a).attr("href", "javascript:unBottomPosition(" + a + ",'" + b + "');").html("<small>取消置底</small>")
    })
}

function unBottomPosition(a, b) {
    $.post("/action/jobPosition/unBottomPosition", {obj_id: a, user_code: b}, function (c, d) {
        "success" == d && c.result && $("#bottom-position-btn-" + a).attr("href", "javascript:bottomPosition(" + a + ",'" + b + "');").html("<small>置底</small>")
    })
}

function select_fun() {
    $(".iselect_layer").find("li").hover(function () {
        $(this).css("background", "#efefef")
    }, function () {
        $(this).css("background", "none")
    }), $(".select_input").each(function (a) {
        $(this).click(function () {
            $(".iselect_layer").eq(a).css("left", $(this).offset().left), $(".iselect_layer").eq(a).css("top", $(this).offset().top + $(this).height()), $(".iselect_layer").eq(a).width($(this).width() + 20), $(".iselect_layer").eq(a).fadeIn("fast")
        })
    }), $(".select_input").hover(function () {
    }, function () {
        $(".iselect_layer").hide()
    }), $(".iselect_layer").hover(function () {
        $(this).show()
    }, function () {
        $(this).fadeOut("fast")
    }), $(".iselect_layer").each(function (a) {
        $(this).find("li").click(function () {
            $(".select_input").eq(a).val($(this).text()), $(".iselect_layer").fadeOut("fast")
        })
    })
}

$(function () {
    $(".iselect_layer").each(function (a) {
        $(".iselect_input").eq(a).val($(".iselect_layer").eq(a).find("span.on").eq(0).text())
    }), select_fun()
}), function (a) {
    a.fn.extend({
        disappear: function (b, c) {
            var d = this;
            return a(document).click(function (a) {
                a.target != d[0] && a.target != b && c()
            }), this
        }
    })
}(jQuery), $(document).ready(function (a) {
    var b = $("[disappears]");
    $(document).click(function () {
        $(b).hide()
    });
    $(b).click(function (a) {
        a.stopPropagation()
    }), $.easing.def = "easeOutBounce", $("a.dropdown-toggle").click(function (a) {
        var b = $(this).next("ul").find("li.submenu");
        $("a.dropdown-toggle i").not(this).addClass("glyphicon-menu-right"), $("li.submenu").not(b).slideUp("slow"), $(this).find("i").toggleClass("glyphicon-menu-down"), b.slideToggle("slow"), a.preventDefault()
    }), $(".radios input").iCheck({
        checkboxClass: "icheckbox_square",
        radioClass: "iradio_square",
        increaseArea: "20%"
    }), $(".choice input").iCheck({
        radioClass: "iradio_choice",
        increaseArea: "20%"
    }), $(".job-operation").selectric(), $(".birth").datetimepicker({
        format: "yyyy.mm",
        language: "zh-CN",
        weekStart: 1,
        autoclose: !0,
        startView: 3,
        minView: 3,
        forceParse: !1
    }), $(".exp-time").datetimepicker({
        format: "yyyy.mm.dd",
        language: "zh-CN",
        autoclose: !0,
        minView: 3
    }), $(".exp-year").datetimepicker({
        format: "yyyy.mm.dd",
        language: "zh-CN",
        autoclose: !0,
        minView: 2,
        startView: "decade",
        initialDate: "1990.01.01"
    }), $(".exp-times").datetimepicker({
        format: "mm-dd  hh:ii",
        language: "zh-CN",
        autoclose: !0
    }), $(".Scrollbar .selectricScroll").addClass("mCustomScrollbar"), $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    }), $("[max-input]").keyup(function (a) {
        var b = $(this).val().length, c = $(this).attr("max-input"), d = $(this).attr("tip-elem"),
            e = $(this).val().substr(0, c), f = c - b, g = !("undefined" == typeof $(this).attr("asc"));
        $(this).val(e), g ? b > c - 1 ? $(d).text(c + "/" + c).css({
            color: "red",
            "font-weight": "bold"
        }) : $(d).text(b + "/" + c).css({
            color: "#999",
            "font-weight": "normal"
        }) : f >= 1 ? $(d).text(f).css({color: "#999", "font-weight": "normal"}) : $(d).text("0").css({
            color: "red",
            "font-weight": "bold"
        })
    }), $("[max-input]").each(function (a) {
        $(this).trigger("keyup")
    }), $("[box]").click(function (a) {
        var b = $(this).attr("box");
        $(b).toggle(), a.stopPropagation()
    }), $("[box-close]").click(function (a) {
        var b = $(this).attr("box-close");
        $(b).hide()
    }), $(".filter .headers").click(function (a) {
        $(this).next("div.dropdown").slideToggle(), $(this).find("i").toggleClass("glyphicon-menu-down")
    }), $(".dropdown a").click(function (a) {
        $(this).toggleClass("active").siblings("a").removeClass("active")
    }), $(".more-citys span").click(function (a) {
        $(".more-citys span").removeClass("active"), $(this).toggleClass("active").siblings("span").removeClass("active")
    }), $(".pressed").click(function (a) {
        $(this).toggleClass("on")
    }), $(".ejects").click(function (a) {
        dropdowns = $(this).parents().find(".dropdowns"), dropdowns.toggleClass("hide")
    }), $(".remarks").click(function (a) {
        var b = $(this).next(".remarks-con"), c = $(".remarks-con");
        $(this).addClass("on"), $(".remarks").not(this).removeClass("on"), $(c).not(b).slideUp("slow"), $(b).slideToggle("slow"), a.stopPropagation()
    }), $(".Boxs-con").bind({
        mouseover: function (a) {
            $(this).find(".glyphicon").addClass("glyphicon-menu-down")
        }, mouseout: function (a) {
            $(this).find(".glyphicon").removeClass("glyphicon-menu-down")
        }
    }), $(".optCity").on("click", "#cityName", function (a) {
        var b = $(".optCity .city-lists");
        $(b).toggleClass("show")
    }), $(".form-lists").on("click", "#category", function (a) {
        var b = $(this).parents().find(".dropdown"), c = $(b).find("div.sub"), d = $(b).find("a");
        $(b).toggleClass("show"), $(c).removeClass("show"), $(d).removeClass("font-green")
    }).on("click", ".dropdown .sub span", function (a) {
        var b = $(".form-lists").find("#category"), c = $(".form-lists").find("#categorySub"),
            d = $(this).parents("li").children("a").find("span").text();
        $(b).val(d), $(c).val($(this).html())
    }).on("click", ".property input", function (a) {
        var b = $(this).is("#internship"), c = $(this).parents("ul").find("#experience");
        b ? $(c).hide() : $(c).show()
    }), $(".hr-manage .city-tabs a").click(function (a) {
        a.stopPropagation(), $(this).tab("show")
    }), screen.width > 768 && $(".form-lists").on("mouseover", ".dropdown a", function (a) {
        var b = $(".form-lists .dropdown a"), c = $(this).next("div.sub"), d = $(".form-lists .dropdown div.sub");
        d.removeClass("show"), b.removeClass("font-green"), $(this).addClass("font-green"), c.addClass("show");
        var e = $(".form-lists .dropdown").height(), f = $(this).next("div.sub").height();
        e > f && $(c).outerHeight(e), $(".form-lists .dropdown div.sub span").mouseover(function (a) {
            var b = $(".form-lists .dropdown div.sub span");
            $(b).removeClass("hover"), $(this).addClass("hover")
        })
    }), $(".city-lists").on("click", ".tab-content span", function (a) {
        var b = $(this).parents(".optCity").find("input#cityName"), c = $(this).html(),
            d = $(this).parents(".city-lists");
        $(this).toggleClass("active").siblings("").removeClass("active"), $(b).val(c), $(d).hide()
    }), $(".adds-fo").click(function () {
        var a = $(".add-infos"), b = $(".add-infos #site");
        $(a).toggleClass("hide"), $(b).focus()
    }), $("#save").click(function (a) {
        $("#site").val();
        $("#address").selectBox("detach").selectBox("attach")
    }), $(document).bind({
        click: function (a) {
            var b = ($(".dropdown"), $("#category")[0]);
            a.target != b && $(".dropdown").removeClass("show")
        }
    }), $(document).bind({
        click: function (a) {
            var b = ($(".city-lists"), $("#cityName")[0]);
            a.target != b && $(".city-lists").removeClass("show")
        }
    }), $(".checkall,.checkall .iCheck-helper").click(function (a) {
        var b = $(".checkboxs").find("[name=checkbox]"), c = $(".icheckbox_square"),
            d = ($(".checkall .icheckbox_square"), $(".checkall input").is(":checked"));
        $(b).each(function () {
            d ? ($(this).prop("checked", !0), $(c).addClass("checked")) : ($(this).prop("checked", !1), $(c).removeClass("checked"))
        })
    }), $(".Adds,.add-notice .hr-cancel").click(function (a) {
        var b = $(this).parents(".tab-pane").find(".add-notice");
        $(b).toggle(), $(".hr-modify").hide(), $(".fonts").show()
    }), $(".hr-pencil,.hr-modify .hr-cancel").click(function (a) {
        var b = $(this).parents(".modulars").find(".fonts"), c = $(b).next(".hr-modify"),
            d = $(this).parents(".tab-pane").find(".add-notice");
        $(c).toggle(), $(b).toggle(), $(".hr-modify").not(c).hide(), $(".fonts").not(b).show(), $(d).hide()
    }), $(".visitor").on("click", ".box .btn-more", function (a) {
        var b = $(this).parents(".box").find(".more-list"), c = $(".visitor .box .more-list"),
            d = $(".visitor .box .btn-more");
        $(b).slideToggle(), $(c).not(b).slideUp(), $(this).toggleClass("up"), $(d).not(this).removeClass("up")
    }), $(".arrow").bind({
        click: function (a) {
            var b = $(this).parents(".delivery-box").find(".Boxs"),
                c = $(this).parents(".delivery-box").find(".detailed");
            $(".delivery-box .detailed").not(c).addClass("hide"), $(".delivery-box .Boxs").not(b).removeClass("on"), $(b).toggleClass("on"), $(c).toggleClass("hide")
        }
    }), $(".choice a.check").click(function (a) {
        $(this).toggleClass("active")
    }), $(".gender label").click(function (a) {
        var b = $(this).find("i");
        $(".gender label i").removeClass("active"), $(b).toggleClass("active")
    }), $(window).scroll(function () {
        var a = $(window).scrollTop();
        a > 30 ? $("#move_to_top").show() : $("#move_to_top").hide()
    }), $("#move_to_top").on("click", function (a) {
        $("body,html").animate({scrollTop: 0}, 500)
    })
}), $(".operatings").on("click", ".collect", function (a) {
    var b = $(this).is(".on"), c = $(".collect-tip .collect-text");
    b ? $(c).html("已收藏该职位，") : $(c).html("已取消该收藏，")
}), $("[alert-tip]").on("click", function (a) {
    var b = $(this).attr("alert-tip");
    $(b).stop().fadeIn(100), setTimeout(function () {
        $(b).fadeOut(500)
    }, 1500)
}), $(".tip,.bubble").on("click", ".close", function (a) {
    $(this).parent().remove()
}), $(".Scroll").mCustomScrollbar({
    advanced: {updateOnBrowserResize: Boolean},
    horizontalScroll: !1
}), $(document).ready(function (a) {
    $("[param]").click(function (a) {
        for (var b = window.location.protocol + "//" + window.location.host + window.location.pathname, c = window.location.href, d = c.replace(b, "").replace(/^\?/g, "").split("&"), e = {}, f = 0; f < d.length; f++) if ("" != d[f]) {
            var g = d[f].split("=");
            e[g[0]] = g[1]
        }
        var h = $(this).attr("param"), i = $(this).attr("value");
        e[h] = i;
        var j = "?";
        for (var k in e) "p" != k && (j = j + k + "=" + e[k] + "&");
        j = j.replace(/&$/g, ""), j = window.location.pathname + j, window.location.href = j
    })
}), function (a) {
    a.fn.autoTextarea = function (b) {
        var c = {maxHeight: null, minHeight: a(this).height()}, d = a.extend({}, c, b);
        return a(this).each(function () {
            a(this).bind("paste cut keydown keyup focus blur", function () {
                var a, b = this.style;
                this.style.height = d.minHeight + "px", this.scrollHeight > d.minHeight && (d.maxHeight && this.scrollHeight > d.maxHeight ? (a = d.maxHeight, b.overflowY = "scroll") : (a = this.scrollHeight, b.overflowY = "hidden"), b.height = a + "px")
            })
        })
    }
}(jQuery), $(document).ready(function (a) {
    $(".bus-editor").click(function (a) {
        var b = $(this).parents().find(".panel-body>.bus-info"), c = $(this).parents().find(".bus-editors");
        $(b).toggleClass("hide"), $(c).toggleClass("hide")
    }), $(".onCollect").click(function (a) {
        $(this).toggleClass("on")
    }), $(".company").on("click", ".editors .editor", function (a) {
        var b = $(".basic .comFrom"), c = $(".basic .comInfo");
        $(b).toggleClass("hide"), $(c).toggleClass("hide")
    }), $("textarea[data-type='max-height']").autoTextarea({maxHeight: 120})
}), $(function () {
    $(".iselect_layer").each(function (a) {
        $(".select_input").eq(a).val($(".iselect_layer").eq(a).find("li").eq(0).text())
    }), iselect_fun()
}), $(document).on("click", ".pagination ul.ajax_pager li a", function (a) {
    var b = $(a.target).data("pager-href"), c = $(a.target).parents("ul.ajax_pager").data("ajax-target-id"),
        d = $(a.target).parents("ul.ajax_pager").data("action-uri"),
        e = $(a.target).parents("ul.ajax_pager").data("anchor");
    $("#" + c).load(d, b, function () {
        void 0 != e && (location.href = e)
    })
}), $(document).ready(function (a) {
    function b() {
        $(".myself .boxs").slideDown(), $(".myself .edits").slideDown(), $(".myself .edit-info").slideUp(), $(".myself").removeClass("on")
    }

    $(".resume").on("click", ".dropdown .sub span", function (a) {
        var b = $(".form-lists").find("#category");
        $(b).val($(this).html())
    }).on("click", "input.city-choice", function (a) {
        var b = $(this).parents("span").next(".city-list");
        $(b).show(), $(".select").removeClass("select-open"), $(".form-lists .dropdown").removeClass("show");
        var c = $("input.city-choice").val().split(";"), d = $(".city-list .tab-content span");
        c.length > 1 && c.pop(), $(d).each(function (a, b) {
            for (i = 0; i < c.length; i++) $(this).text() == c[i] && $(this).addClass("active")
        }), a.stopPropagation()
    });
    var c = {
        eduSelect: function (a) {
            var b = a.parents(".boxs").find("select");
            b.each(function (a, b) {
                var c = $(b), d = $(c).children(), e = $(c).attr("value");
                d.each(function (a, b) {
                    var c = $(b).attr("value");
                    e == c && $(this).attr("selected", !0)
                })
            })
        }
    };
    $(".resume").on("click", ".edit", function () {
        var a = $(this);
        c.eduSelect(a)
    }), $(".city-list").on("click", "span", function (a) {
        var b = $(this).parents("").find("#city-choice"),
            c = ($(".city-list .tab-content span.active"), $(".city-list .tab-content span")), d = b.val(),
            e = $(this).html();
        $(this).hasClass("active") ? ($(b).val($(b).val().replace($(this).html() + ";", "")), c.each(function (a, b) {
            var c = $(b);
            c.html() === e && c.toggleClass("active")
        }), $(b).removeClass("inputError font-red-w")) : d && d.split(";").length > 3 ? $(b).addClass("inputError font-red-w") : ($(b).val($(b).val() + $(this).html() + ";"), c.each(function (a, b) {
            var c = $(b);
            $(a);
            c.html() === e && c.toggleClass("active")
        }))
    }), $(".city-tabs a").click(function (a) {
        a.preventDefault(), $(this).tab("show")
    }), $(".basic .edit,.basic .icons .cancel").click(function (a) {
        var b = $(this).parents(".basic").find(".basic-info"), c = $(this).parents(".basic").find(".basic-form");
        $(b).toggleClass("hide"), $(c).toggleClass("hide")
    }), $(".panel .edits,.panel .edit-info .cancels").click(function (a) {
        var b = $(this).parents(".panel"), c = $(b).find(".boxs"), d = $(b).find(".edit-info"), e = $(b).find(".edits"),
            f = $(".modify"), g = $(".box-info");
        $(e).slideToggle(""), $(c).slideToggle(""), $(d).slideToggle(""), $(b).toggleClass("on"), $(f).slideUp(), $(g).slideDown(), $(".panel.code .edit,.panel.code .boxs-list").slideDown(""), $(".panel.code .edit-info").slideUp(""), $(".panel.code .boxs-group").addClass("on"), $(".boxs").not(c).removeClass("on")
    }), $(".panel").on("click", ".adds,.add-infos .cancel", function (a) {
        var c = $(this).parents(".panel").find(".add-infos"), d = $(".panel-body .modify"),
            e = c.find("input:first:not([data-lang])")[0];
        c.slideToggle().addClass("on"), d.slideUp(""), e && e.focus(), $(".box-info").slideDown(""), $(".add-infos").not(c).slideUp(""), $(".boxs").removeClass("on"), b()
    }).on("click", ".edit,.boxs .modify .cancel", function () {
        var a = $(this).parents(".boxs"), c = $(a).find(".box-info"), d = $(c).next(".modify"), e = $(".add-infos");
        c.slideToggle(), a.addClass("on"), d.slideToggle(""), e.slideUp(""), $(".modify").not(d).slideUp(""), $(".box-info").not(c).slideDown(""), $(".boxs").not(a).removeClass("on"), b()
    }).on("click", ".cancel", function () {
        var a = $(this).parents(".boxs");
        a.removeClass("on")
    });
    var d = $(".integrity .integ").text();
    $(".integrity .progress-bar").css({width: d}), $(".pencil1,.cancel1").click(function (a) {
        var b = $(this).attr("state"), c = $(this).attr("display"), d = $(".panel-body .modify"),
            e = $(".panel-body .box-info");
        $(b).slideToggle(""), $(c).slideToggle(""), $(d).slideUp(""), $(e).slideDown("")
    });
    var e = $(".FloatNav")[0];
    e && $(window).scroll(function () {
        var a = $(".FloatNav .radios"), b = $(".resume .FloatNav").offset().top, c = $(this).scrollTop();
        b > c ? a.removeClass("float") : a.addClass("float")
    }), $("div.nav-toggle").click(function (a) {
        var b = $(this).next();
        $(b).slideToggle("")
    }), $(".fls").on("mouseover", "a", function (a) {
        $(this).addClass("hover").siblings().removeClass("hover")
    }).mouseout(function () {
        $(".fls a:eq(3)").addClass("hover").siblings().removeClass("hover")
    })
});