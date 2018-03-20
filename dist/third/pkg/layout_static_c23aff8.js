;
/*!/common/widgets/header_c_static/modules/emailvalid/main.js*/
define("common/widgets/header_c_static/modules/emailvalid/main", ["require", "exports", "module", "dep/jquery-colorbox/jquery.colorbox"], function (require) {
    require("dep/jquery-colorbox/jquery.colorbox"), $("#resend").size() > 0 && $("#resend").click(function () {
        $.ajax({type: "POST", url: GLOBAL_DOMAIN.ctx + "/user/resendActivatedMail"}).done(function (c) {
            c.success ? $.colorbox({inline: !0, href: "#resend_success", title: "验证邮件发送成功"}) : alert(c.msg)
        })
    })
});
;
/*!/common/widgets/header_c_static/layout/main.js*/
define("common/widgets/header_c_static/layout/main", ["require", "exports", "module", "common/widgets/passport/passport", "dep/jquery.cookie/jquery.cookie", "dep/artTemplate/dist/template", "common/widgets/common/msgPopup"], function (require) {
    function a() {
        PASSPORT.on("autologin:succ", function () {
            PASSPORT.util.tinfo("autologin:succ"), window.location.reload()
        }), PASSPORT.on("autologin:fail", function () {
            PASSPORT.util.tinfo("autologin:fail"), $("#header_menu").remove(), $("#header_login").show()
        }), PASSPORT.auto(), PASSPORT.on("popuplogin:succ", function () {
            PASSPORT.util.tinfo("popuplogin:succ"), window.location.reload()
        }), PASSPORT.on("popuplogin:fail", function () {
            PASSPORT.util.tinfo("popuplogin:fail")
        }), $(".passport_login_pop").each(function () {
            $(this).click(function () {
                PASSPORT.popup()
            })
        })
    }

    require("common/widgets/passport/passport"), require("dep/jquery.cookie/jquery.cookie");
    var c = require("dep/artTemplate/dist/template");
    !function (g) {
        if (g) {
            var _ = '<ul class="lg_tbar_r" id="header_menu">\n    <!-- if has unread message, add class unreaded -->\n    <li class="msg_dropdown" data-lg-tj-track-code="index_message">\n        <a class="msg_group" href="javascript:;" data-lg-tj-id="5h00" data-lg-tj-no="idnull" data-lg-tj-cid="idnull" rel="nofollow">\n            消息\n            <em class="msg_amount hide" id="headMsgAmount"></em>\n        </a>\n        <div class="lg_msg_popup">\n            <div class="lg_msg_pu_body" id="lgPopupMsgBody">\n\n            </div>\n            <div class="lg_msg_pu_footer">\n                <a href="{{GLOBAL_DOMAIN.ctx}}/message/settingsdetail.html" target="_blank" class="lg_msg_setting fl"><i class="lg_msg_avatar setting_i" data-lg-tj-id="18B0" data-lg-tj-no="idnull" data-lg-tj-cid="idnull"></i>&nbsp;</a>\n                <a href="{{GLOBAL_DOMAIN.ctx}}/message/msgdetail.html" class="lg_msg_more fr" data-lg-tj-id="18A0" data-lg-tj-no="idnull" data-lg-tj-cid="idnull">查看更多</a>\n            </div>\n        </div>\n    </li>\n    <li>\n        <a href="{{GLOBAL_DOMAIN.ctx}}/resume/myresume.html" class="bl" data-lg-tj-id="5700" data-lg-tj-no="idnull" data-lg-tj-cid="idnull" rel="nofollow" data-lg-tj-track-code="index_resume">我的简历</a>\n    </li>\n    <li>\n        <a href="{{GLOBAL_DOMAIN.ctx}}/mycenter/delivery.html" class="bl" id="deliveryLink" data-lg-tj-id="5800" data-lg-tj-no="idnull" data-lg-tj-cid="idnull" rel="nofollow" data-lg-tj-track-code="index_deliver" data-lg-tj-track-type="1">投递箱</a>\n        <em class="noticeDot dn" id="noticeDot_delivery"></em>\n    </li>\n    <li>\n        <a href="{{GLOBAL_DOMAIN.ctx}}/mycenter/collections.html" class="bl" data-lg-tj-id="5900" data-lg-tj-no="idnull" data-lg-tj-cid="idnull" rel="nofollow" data-lg-tj-track-code="index_favorite" data-lg-tj-track-type="1">收藏夹</a>\n    </li>\n    <li class="user_dropdown" data-lg-tj-track-code="index_user">\n        <span class="unick bl">{{username}}</span>\n        <em class="noticeDot dn" id="noticeDot_name"></em>\n        <i></i>\n        <ul>\n            <li>\n                <a href="{{GLOBAL_DOMAIN.ctx}}/s/subscribe.html" data-lg-tj-id="5a00" data-lg-tj-no="idnull" data-lg-tj-cid="idnull" rel="nofollow">我的订阅</a>\n            </li>\n            <li>\n                <a href="{{GLOBAL_DOMAIN.ctx}}/mycenter/invitation.html" id="invitationLink" data-lg-tj-id="5b00" data-lg-tj-no="idnull" data-lg-tj-cid="idnull" rel="nofollow" data-lg-gatj-msg="header_c,职位邀请,number">职位邀请</a>\n                <em class="noticeDot dn" id="noticeDot_invitation"></em>\n            </li>\n\n            <li>\n                <a href="{{GLOBAL_DOMAIN.actx}}/account/cuser/userInfo.html" data-lg-tj-id="5c00" data-lg-tj-no="idnull" data-lg-tj-cid="idnull" rel="nofollow">帐号设置</a>\n            </li>\n\n            <li>\n                <a href="{{GLOBAL_DOMAIN.ectx}}/dashboard/index.htm?from=c_index" data-lg-tj-id="5d00" data-lg-tj-no="idnull" data-lg-tj-cid="idnull" rel="nofollow">去企业版</a>\n            </li>\n\n            <li>\n                <a href="{{GLOBAL_DOMAIN.FE_frontLogout}}" data-lg-tj-id="5e00" data-lg-tj-no="idnull" data-lg-tj-cid="idnull" rel="nofollow">退出</a>\n            </li>\n        </ul>\n    </li>\n</ul>\n';
            $("#lg_tbar .inner").append(c.compile(_)({
                username: decodeURIComponent(g),
                GLOBAL_DOMAIN: window.GLOBAL_DOMAIN,
                cdndomain: window.GLOBAL_CDN_DOMAIN
            })), $("#header_menu").show(), PASSPORT.util.rpc({
                url: GLOBAL_DOMAIN.ctx + "/frontLoginStatus.do",
                succ: function (c) {
                    PASSPORT.util.tinfo("getLoginStatus:succ:" + c), c && "false" != c ? require("common/widgets/common/msgPopup") : a()
                },
                fail: function (c) {
                    PASSPORT.util.tinfo("getLoginStatus:fail:" + c), a()
                }
            })
        } else a()
    }($.cookie("unick"))
});
;
/*!/common/widgets/footer_c_static/modules/feedback/feedback.js*/
define("common/widgets/footer_c_static/modules/feedback/feedback", ["require", "exports", "module", "dep/jquery.cookie/jquery.cookie", "common/widgets/common/userinfo"], function (require) {
    require("dep/jquery.cookie/jquery.cookie"), require("common/widgets/common/userinfo")
});
;
/*!/common/widgets/footer_c_static/layout/main.js*/
define("common/widgets/footer_c_static/layout/main", ["require", "exports", "module"], function () {
    function c() {
        $("#backtop").css("background-position-x", "-38px"), $("html, body").animate({scrollTop: 0}, 1e3, function () {
            $("#backtop").css("background-position-x", "0")
        })
    }

    function a(c) {
        $(window).height() - c > $(document.body).height() ? $("#footer").addClass("footer_fix") : $("#footer").removeClass("footer_fix")
    }

    $(".footer_app, .footer_wechat, .footer_mina").hover(function () {
        $("img", this).stop().fadeIn(200)
    }, function () {
        $("img", this).stop().fadeOut(200)
    }), $(window).scroll(function () {
        (document.documentElement.scrollTop || document.body.scrollTop) > 0 ? $("#backtop").show() : $("#backtop").hide()
    }), $("#backtop").click(function () {
        c()
    }), a(0), $(window).resize(function () {
        a($("#footer").hasClass("footer_fix") ? 68 : 0)
    }), $(document).ready(function () {
        $("img[data-delay-src]").each(function () {
            var c = $(this), a = (c.attr("data-delay-src") || "").replace(/https?\:/i, document.location.protocol);
            c.attr("src", a.replace("www.lagou.com", window.GLOBAL_CDN_DOMAIN))
        })
    })
});