$(document).ready(function () {
    //鼠标经过菜单
    $('.menu-box').mouseover(function (e) {
        var menuBoxs = $('.menu-box');
        for (var i = 0; i < menuBoxs.length; i++) {
            var obj = menuBoxs[i];
            $(obj).find('.menu-main').removeClass('active');
            $(obj).find('.menu-sub').addClass('dn');
        }
        //主菜单
        $(this).find('.menu-main').addClass('active');
        //子菜单
        $(this).find('.menu-sub').removeClass('dn');

    });
    //鼠标离开菜单
    $('.menu-box').mouseout(function (e) {
        var menuBoxs = $('.menu-box');
        for (var i = 0; i < menuBoxs.length; i++) {
            var obj = menuBoxs[i];
            $(obj).find('.menu-main').removeClass('active');
            $(obj).find('.menu-sub').addClass('dn');
        }
    });
    //首页轮播图
    var mySwiper = new Swiper('.swiper-container', {
        loop: true,

        autoplay : 3000,

        // 如果需要分页器
        pagination: '.swiper-pagination',

        // 如果需要前进后退按钮
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
    })
    //职位Tab切换
    $('.job-tab li').click(function () {
        //tab 激活
        var tabs = $('.job-tab li');
        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            $(tab).removeClass('active');
        }
        $(this).addClass('active');
        //tab 内容切换
        var conts = $('.job-list').children('div');
        for (var j = 0; j < conts.length; j++) {
            var cont = conts[j];
            $(cont).addClass('dn');
        }
        var activeTabCls = $(this).data("tab");
        $('.job-list .' + activeTabCls).removeClass('dn');
    });
    /*$('.user-info .info').mouseover(function () {
        $('#infoDropdown').removeClass('dn');
    });
    $('.user-info .info').mouseout(function () {
        $('#infoDropdown').mouseout(function () {
            $('#infoDropdown').addClass('dn');
        });
    });*/
});