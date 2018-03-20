$(function () {
    $('#resumeTab li').click(function () {
        var lis = $('#resumeTab li');
        for (var i = 0; i < lis.length; i++) {
            var obj = lis[i];
            $(obj).removeClass('active');
            var refTmp = $(obj).data('href');
            $(refTmp).removeClass('active');
        }
        $(this).addClass('active');
        var ref = $(this).data('href');
        $(ref).addClass('active');
    });
    $('.content-list li').click(function () {
        var lis = $('.content-list li');
        for (var i = 0; i < lis.length; i++) {
            var obj = lis[i];
            $(obj).removeClass('active');
        }
        $(this).addClass('active');
    });
});