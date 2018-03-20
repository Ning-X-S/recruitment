(function ($) {
    var tpl = $('#templete').html();
    $('#add').click(function () {
        var target = $('#add').data('target');
        $(target).show();
    });
    $('.cancel').click(function () {
        $('.edit-modules').hide();
    });
    $('.edit').click(function () {
        var par = $(this).parent().parent().parent();
        par.next().show();
    });
    $('.delete').click(function () {
        var url = $(this).data('href');
        layer.confirm('确定要删除？', {
            btn: ['删除','取消'] //按钮
        }, function(){
            $.get(url, function (res) {
                window.location.reload();
            })
        }, function(){

        });
    });
    //邀请同事
    $('.invite').click(function () {
        layer.open({
            title: '邀请同事',
            type: 1,
            area: ['764px', '569px'], //宽高
            content: $('#inviteForm').html()
        });
    });
})(jQuery);
