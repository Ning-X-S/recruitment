(function () {
    var siteurl = $('#siteurl').val();
    $.validator.setTheme("default", {
        msgClass: "n-bottom"
    });
    $('#step1Btn').click(function () {
        $('#step1').trigger("validate");
        $('#step1').on('valid.form', function(e, form){
            //验证通过
            $('#step1').hide();
            $('#step2').show();
            $('#step2Icon').addClass('active')
        });
    });
    $('#step2Btn').click(function () {
        $('#step2').trigger("validate");
        $('#step2').on('valid.form', function(e, form){
            //验证通过
            $('#submitPhone').val($('#phone').val());
            form.submit();
        });
    });
    $('#step1').validator({
        rules: {
            // 使用正则表达式定义规则
            mobile: [/^1[3-9]\d{9}$/, '请填写有效的手机号']
        },
        fields: {
            // 对字段 username 应用规则 mobile
            'phone': {
                rule: 'required; mobile; remote(GET:'+ siteurl +'account/validPhone2.htm, phone: '+ $('#phone').val() +')',
                msg: {
                    required: '请输入手机号码'
                }
            },
            'code': {
                rule: 'required;length[4]; remote(GET: '+ siteurl +'account/validCode.htm, phone :'+ $('#phone').val() +', code: '+$('#code').val()+')',
                msg: {
                    required: '请输入验证码'
                }
            },
        }
    });
    $('#step2').validator({
        fields: {
            'password': {
                rule: 'required;length[6~16]',
                msg: {
                    required: '请输入新密码'
                }
            },
            'rePassword': {
                rule: 'required;match(password)',
                msg: {
                    required: '请输入确认密码',
                    match: '两次输入密码不一致'
                }
            }
        }
    });
    $('#send_verify').click(function () {
        var phone = $('#phone').val();
        if (!validatemobile(phone)) {
            return false;
        }
        time(this);
        $.post(siteurl + 'account/sendCode.htm', {'phone': phone, 'common': 0}, function (res) {
            //console.log(`收到回复：${res}`);
        })
    });
    var wait = 60;

    function time(o) {
        if (wait === 0) {
            o.removeAttribute("disabled");
            o.value = "免费获取验证码";
            wait = 60;
        } else {
            o.setAttribute("disabled", true);
            o.value = "重新发送(" + wait + ")";
            wait--;
            setTimeout(function () {
                    time(o)
                },
                1000)
        }
    }

    function validatemobile(mobile) {
        if (mobile.length === 0) {
            layer.alert("请输入手机号码", {
                icon: 7,
                skin: 'layer-ext-moon'
            });
            return false;
        }
        if (mobile.length != 11) {
            layer.alert("请输入有效的手机号码", {
                icon: 7,
                skin: 'layer-ext-moon'
            });
            return false;
        }

        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!myreg.test(mobile)) {
            layer.alert("请输入有效的手机号码", {
                icon: 7,
                skin: 'layer-ext-moon'
            });
            return false;
        }
        return true;
    }
})();