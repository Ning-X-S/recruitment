/*!common/static/js/exposure.js*/
;/*
 * 曝光量统计
 *
 * 接口地址
 * https://a.lagou.com/json
 *
 * 参数 - 值 - 含义
 * lt   - trackshow                              - 日志输出类型 (固定取值)
 * a    - 9R00_idnull_0_id34_1992                - 编码id组（逗号分隔）
 * t    - p                                      - 曝光类型
 * v    - 0                                      - 版本号
 * dl   - http://www.lagou.com/jobs/618831.html  - 当前页URL
 * dr   - http://www.lagou.com                   - referrer
 * time - new Date().getTime()                   - 时间戳
 *
 * 使用方法
 * 1. 同步渲染节点添加如下属性即可
 *    data-tj-exposure="on"   =>   固定取值，开启曝光统计
 *    data-lg-tj-type="gg"    =>   曝光统计类型，自定义
 *    data-lg-tj-id="Sc00"    =>   编码ID，取值唯一。请到 http://meta.lagou.com/code 申请
 *    data-lg-tj-no="0001"    =>   节点位置编号
 *    data-lg-tj-cid="1043"   =>   业务ID
 *
 *  简招控制台通栏广告实例：
 *  <a data-tj-exposure="on" data-lg-tj-type="gg" data-lg-tj-id="Sc00" data-lg-tj-no="0001" data-lg-tj-cid="1043" href="../../activity.lagou.com/topic/rqzmax.html" target="_blank">
 *      <img src="../../www.lagou.com/i/image/M00/65/60/Cgp3O1gHTUyAFdxQAAECVS_5F3cu4129.JPG" alt="顶部通栏广告" class="a-x-d-banner" />
 *  </a>
 *
 * 2. 异步渲染节点除了添加第一条中的属性，需在节点插入文档DOM之后调用: exposure();
 *
 */

define('common/static/js/exposure', ['require', 'exports', 'module'], function(require, exports, module) {

    exports.exposure = exposure;

    var analyseUri = {
        jsonURL: window.location.protocol + '//a.lagou.com/json'
    };

    /**
     * 判断 Array 对象
     */
    function _isArray(arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    }

    /**
     * 发送广告曝光量统计
     * 
     * @param  {Array} tjCodes  [要统计的编码ID组]
     * @param  {String} type    [曝光统计的类型]
     * @param  {Array} abts     [a/b-test类型，可选]
     */
    function _log(tjCodes, type, abts) {

        if (!_isArray(tjCodes)) {
            return;
        }

        var tjCodesStr = [];
        for (var i = 0; i < tjCodes.length; i++) {
            var tjItem = tjCodes[i];

            if (_isArray(tjItem) && tjItem.length >= 3) {
                tjCodesStr.push(_getTjId(tjItem[0], tjItem[1], tjItem[2]));
            }
        };

        var imgGet = new Image();
        var params = {
            "lt": 'trackshow',
            "a": tjCodesStr.join(','),
            "t": type,
            "v": 0,
            "dl": encodeURIComponent(window.location.href),
            "dr": encodeURIComponent(window.location.protocol + '//' + window.location.hostname),
            "time": new Date().getTime()
        }

        if (_isArray(abts)) { // A/B Test参数，暂时未使用
            params.abt = abts.join(',');
        }

        var paramsArr = [];
        for (var item in params) {
            paramsArr.push(item + '=' + params[item]);
        }
        imgGet.src = analyseUri.jsonURL + '?' + paramsArr.join('&');
    }

    /**
     * 获取编码统计ID 
     */
    function _getTjId(id, no, cid) {
        return [$.trim(id), $.trim(no), 0, $.trim(cid), Math.round(Math.random() * 10000)].join('_');
    }

    function exposure() {
        $(document).ready(function() {
            var cache = {};

            $('[data-tj-exposure=on]').each(function() {
                var $me = $(this);
                var id = $me.attr('data-lg-tj-id');
                var no = $me.attr('data-lg-tj-no') || 'idnull';
                var cid = $me.attr('data-lg-tj-cid') || 'idnull';
                var type = $me.attr('data-lg-tj-type') || 'idnull';
                var abt = $me.attr('data-lg-tj-abt') || '';

                var groupName = type;
                if (!cache[groupName]) {
                    cache[groupName] = {};
                    cache[groupName].normalCodes = [];
                    cache[groupName].abtCodes = [];
                    cache[groupName].abtStrategies = [];
                    cache[groupName].type = type;
                }
                if (!abt) {
                    cache[groupName].normalCodes.push([id, no, cid])
                } else {
                    cache[groupName].abtCodes.push([id, no, cid]);
                    cache[groupName].abtStrategies.push(abt);
                }

                $me.attr('data-tj-exposure', 'off'); // 避免重复发送
            });

            for (var groupName in cache) {
                cache[groupName].normalCodes.length > 0 && _log(cache[groupName].normalCodes, cache[groupName].type);
                cache[groupName].abtCodes.length > 0 && _log(cache[groupName].abtCodes, cache[groupName].type, cache[groupName].abtStrategies);
            }
        });
    }

    exposure(); // 统计页面同步节点曝光日志

    /* show日志曝光统计 post jobs id array to plat */
    exports.postoA = function(params) {
        if (!params) return;
        var arr = [];
        var img = new Image();
        for (var i in params) {
            arr.push(i + '=' + params[i]);
        }
        arr.push('time=' + new Date().getTime())
        img.src = document.location.protocol + '//a.lagou.com/show?' + arr.join('&');
    }

});

/*!common/widgets/report_list/main.js*/
;define('common/widgets/report_list/main', ['require', 'exports', 'module', "common/components/jquery-niceScroll/jquery.nicescroll.min", 'dep/artTemplate/dist/template', 'common/static/js/exposure'], function(require, exports, module){
	// 以后请引用/common/components目录下修复了已知bug的nicescroll插件
	require("common/components/jquery-niceScroll/jquery.nicescroll.min");
	var template = require('dep/artTemplate/dist/template');
	var exposure = require('common/static/js/exposure').exposure;

	if($('.report_diaglog').length>0){
		var report_diaglog = $('.report_diaglog')
		var report_pop = $('#report_pop')
		report_diaglog.show();
		report_pop.show();
		report_pop.animate({marginLeft:"-302px"},500)
		getReportList();
	}
	function getReportList(){
		$.ajax({
			url: GLOBAL_DOMAIN.ectx + "/industryReport/reportList.json",
			data:{
				companyId:$('#UserConpanyId').val()
			}
		}).done(function(rs){
			if(rs.state == 1){
				var tpl = "{{each reportList as item i}}\n<li class=\"relists\" data-id=\"{{item.id}}\">\n\t<span class=\"sopt\">[</span>\n\t<span class=\"speed_title\">{{item.seedTitle}}</span>\n\t<span class=\"sopt\">]</span>\n\t<a href=\"{{item.url}}\" class=\"title\" target=\"_blank\" data-tj-exposure=\"on\" data-lg-tj-type=\"news\" data-lg-tj-id=\"19aj\" data-lg-tj-no=\"{{if i < 9}}000{{i+1}}{{else}}0010{{/if}}\" data-lg-tj-cid=\"{{item.id}}\">{{item.title}}</a>\n\t<span class=\"delete report_delete\" data-id=\"{{item.id}}\" data-tj-exposure=\"on\" data-lg-tj-type=\"news\" data-lg-tj-id=\"19aj\" data-lg-tj-no=\"idnull\" data-lg-tj-cid=\"{{item.id}}\">不喜欢</span>\n</li>\n{{/each}}\n{{if reportList.length == 0}}\n\t<li class=\"no_report\">暂时没有报道，求职者无法查看，有内容时自动显示。</li>\n{{/if}}\n";
		        var dataList = rs.content.data.companyReportList
				var htmlStr = template.compile(tpl)({
						reportList: dataList
					});
		        $('ul.report_list').append(htmlStr);
		       	$('.report_list').niceScroll({
                    cursorcolor: '#0099ff',
                    cursorborder: "2px solid #f8f8f8",
                    cursorwidth: "3px",
                    scrollspeed: 6,
                    cursorminheight: 60,
                    cursoropacitymax: 0.8

     			});
     			//曝光埋点
        		exposure();
			}
		})
	}

	$(document).on('click','.try_it',function(){
		$('.step1').hide();
	})
	$(document).on('click','.think_btn,.is_cancel',function(e){
		$.ajax({
			url: GLOBAL_DOMAIN.ectx + "/industryReport/cancelPop.json"
		}).done(function(rs){
			if(rs.state == 1){
				var report_diaglog = $('.report_diaglog')
				var report_pop = $('#report_pop')
				report_diaglog.hide();
				report_pop.hide();
			}
		})
	})
	$(document).on('click','.rechecked',function(){
		$(this).addClass('recheck').removeClass('rechecked')
		$(this).data('state','0')
	})
	$(document).on('click','.recheck',function(){
		$(this).addClass('rechecked').removeClass('recheck')
		$(this).data('state','1')
	})

	var arr_ids = [];
	$(document).on('click','.report_delete',function(){
		arr_ids.push($(this).data('id'))
		$(this).parents('li.relists').remove();
		if($('.report_list li').length == 0){
			$('.report_list').append('<li class="no_report">暂时没有报道，求职者无法查看，有内容时自动显示。</li>')
		}
		$(".report_list").getNiceScroll().resize()
	})
	$(document).on('click','.is_ok',function(){
		var ids = "";
		var updateState = $('.check_update i').data('state');
		ids = arr_ids.join(',')
		$.ajax({
			url: GLOBAL_DOMAIN.ectx + "/industryReport/submitReport.json",
			data:{
				reportIds:ids,
				updateState:updateState
			}
		}).done(function(rs){
			if(rs.state == 1){
				var report_diaglog = $('.report_diaglog')
				var report_pop = $('#report_pop')
				report_diaglog.hide();
				report_pop.hide();
				var newTab=window.open('about:blank');
				var url = "../../https@hr.lagou.com/company/gongsi/"+rs.content.data.lagouCompanyId+".html"
				// window.open(url);
				newTab.location.href=url;

			}
		})
	})

});

/*!piplines/modules/filter-option/main.js*/
;
define('piplines/modules/filter-option/main', ['require', 'exports', 'module', 'common/components/jquery-niceScroll/jquery.nicescroll.min'], function(require, exports, module) {
	// 以后请引用/common/components目录下修复了已知bug的nicescroll插件
	require('common/components/jquery-niceScroll/jquery.nicescroll.min');
	var $rfo = $('.resume-filter-option'),
		$positions = $('.positions');
	var hasMorePositions =  $positions.prop('scrollHeight')>40?true:false;
	var defaultHeight = $positions.prop('scrollHeight')>92?92:$positions.prop('scrollHeight');
	var oriContainerBottom = parseInt($('.container').css('bottom'),10);
	var oriRFOHeght = $('.resume-filter-option').outerHeight(true);
/*	$positions.niceScroll({
		'cursorborder': 'none',
		cursorcolor: '#aeb1b3',
		'cursorwidth': '6px',
		'scrollspeed': '6',
		cursoropacitymax: 0.8
	});*/
	if(hasMorePositions){
		$positions.find('.has_more').show();
		$positions.find('.has_more').on('click',function(e){
			var _this = $(this);
			if($positions.css('height')=="32px"){
				$positions.addClass('positions_box');
				$positions.css('height','inherit');
				_this.html('收起<i class="icon-arrow-up"> </i>');

				// 20为计算过程中多计算出来的margin
				$('.container').css('top', _this.parents('.resume-filter-option').outerHeight() + $rfo.get(0).offsetTop + 20 );
				$('.container').css('bottom', oriContainerBottom - _this.parents('.resume-filter-option').outerHeight( true ) + oriRFOHeght);
			}else{
				$('.positions_box').css('height','32px');
				_this.html('更多<i class="icon-arrow-down"></i>');
				$positions.removeClass('positions_box');
				$('.container').css('top', _this.parents('.resume-filter-option').outerHeight() + $rfo.get(0).offsetTop + 20 );
				$('.container').css('bottom', oriContainerBottom);
			}
		});
	}
	if( $positions.find('.has_more').text() == '更多' ) {
		/*var currentId = $positions.find('.current').attr('data-id');
		var currentName = $positions.find('.current').text();
		if(currentId != 0){
			$positions.find('.current').remove();
			$positions.find('[data-id="0"]').after('<span data-id="'+currentId+'" class="current"> '+currentName+'</span>')
		}*/
		$positions.css('height','32px');
		$('.container').css('top', $rfo.outerHeight() + $rfo.get(0).offsetTop + 20 );
		$('.container').css('bottom', oriContainerBottom - $positions.find('.has_more').parents('.resume-filter-option').outerHeight( true ) + oriRFOHeght);
	}
	/*if(hasMorePositions){
		$positions.find('.has_more').show();
		$positions.find('.has_more').on('click',function(e){
			var _this = $(this);
			if($positions.css('height')=="32px"){
				$positions.addClass('positions_box');
				$positions.css('height',defaultHeight+'px');
				$positions.css('overflow','hidden');
				_this.html('收起<i class="icon-arrow-up"> </i>');

				// 20为计算过程中多计算出来的margin
				$('.container').css('top', _this.parents('.resume-filter-option').outerHeight() + $rfo.get(0).offsetTop + 20 );
				$('.container').css('bottom', oriContainerBottom - _this.parents('.resume-filter-option').outerHeight( true ) + oriRFOHeght);
			}else{
				$('.positions_box').css('height','32px');
				$positions.css('overflow','hidden');
				_this.html('更多<i class="icon-arrow-down"></i>');
				$positions.removeClass('positions_box');
				$('.container').css('top', _this.parents('.resume-filter-option').outerHeight() + $rfo.get(0).offsetTop + 20 );
				$('.container').css('bottom', oriContainerBottom);
			}
			$positions.getNiceScroll().resize();
		});
		if($positions.find('.current').length>0&&$('.positions').find('.current').attr('data-id')!=0){
			$positions.addClass('positions_box');
			$positions.css('height',"32px");
			$positions.css('overflow','hidden');
			$positions.find('.has_more').html('收起<i class="icon-arrow-up"></i>');
		}
	}
	if( $positions.find('.has_more').text() == '收起' ) {
		$positions.addClass('positions_box');
		$positions.css('height',defaultHeight+'px');
		$positions.css('overflow','hidden');
		$('.container').css('top', $rfo.outerHeight() + $rfo.get(0).offsetTop + 20 );
		$('.container').css('bottom', oriContainerBottom - $positions.find('.has_more').parents('.resume-filter-option').outerHeight( true ) + oriRFOHeght);
	}*/
	$rfo.on('click', 'span', function(){
		if( $(this).hasClass('current') ) return false;
		if( $(this).hasClass('disabled') )return false;
		if( $(this).hasClass('add-channel') ){
			var url = "../settings/channel/my_channels.htm";
			$(this).attr({'href':url,'target':'_blank'});
			window.open(url,'_blank');
			return;
		}

		var id = $(this).data('id');
		var opt = $(this).parents('dl').data('opt');// resumeType resumeStage

		$rfo.find('input[name="'+opt+'"]').val(id);
		filterSubmit();
	});

	(function() {
		var $rfo = $('.resume-filter-option'),
			$container = $('.container');
		$container.css('top', $rfo.get(0).offsetTop + $rfo.outerHeight() + 20);
	})();

	$('.lagou-channel-items em').on( 'click', function () {
		var _this = $(this),
			$i = _this.find( 'i' );
		if( $i.hasClass('icon-checkbox') ) {
			$i.attr( 'class', 'icon-checkedbox ');
		}
		else {
			$i.attr( 'class', 'icon-checkbox' );
		}

		var tagArr = [],
			plusId = $('input[name="plusId"]').val();
		if( plusId != '0' ) {
			tagArr = plusId.split(',');
		}

		if( $i.hasClass( 'icon-checkbox' ) ) {
			for( var k = 0, len = tagArr.length; k < len; k++ ) {
				if( _this.data( 'tag' ) == tagArr[k] ) {
					tagArr.splice( k, 1 );
					break;
				}
			}
		}
		else {
			tagArr.push( _this.data( 'tag' ) );
		}

		// 如果没有内容，plusStr = 'NONE'
		var plusStr = tagArr.join(',');
		if ( !plusStr ) {
			plusStr = '0';
		}
		$('input[name="plusId"]').val( plusStr );

		filterSubmit();
	});

	function filterSubmit() {
		lg.set( 'positionId', $('input[name=positionId]').val() );

		//清空 防止不能正常跳转
		lg.del( 'channelId' );
		lg.del( 'plus' );
		lg.del('coo');

		var channelId = $('input[name="channelId"]').val();
		var coo = $('input[name="coo"]').val();
		var params = '&channelId=' + channelId + '&coo=' + coo;
		if ( channelId == 1 ) {
			params += '&plus=' + $('input[name=plusId]').val();
		}
		window.location.href = lg.getCurrentUrl() + params;
	}
});


/*!piplines/modules/event/main.js*/
;define('piplines/modules/event/main', ['require', 'exports', 'module'], function(require, exports, module) {

	$.ajax({
        url: '../../https@activity.lagou.com/activityapi/lamp/getSpeedEntryData',
        // url: '../../10.1.200.143_3A10320/activityapi/lamp/getSpeedEntryData',
        dataType: 'jsonp',
        jsonp: "jsoncallback",
        data: {
            hrId: window.CONST_VARS('user').id
        },
        success:function(data){
        	if(data.state == 1 && data.content){
        		$('.hour-list img').attr('src',data.content.logo);
        		$('.hour-list span').eq(0).text(data.content.positionName+'['+data.content.city+']');
        		$('.hour-list span').eq(1).text(data.content.salary);
        		var expire = data.content.workYear ? '经验' + data.content.workYear : "";
        		var grade = data.content.education ? data.content.education : ""
        		var nature = data.content.jobNature ? data.content.jobNature : ""
        		if(expire !="" && (grade !="" || nature != "")){
        			expire +='/'
        		}
        		if(nature !=""){
        			grade += '../default.htm'
        		}
        		$('.hour-list .expire').text(expire+grade+nature);
        		for(var i=0;i<3;i++){
        			$('.date_month').eq(i).text(data.content.options[i].date)
        			$('.date_date').eq(i).text(data.content.options[i].week)
        			if(data.content.options[i].remainNum == 0){
        				$('.select_check').eq(i).addClass('done_check');
        				$('.has_done').eq(i).show();
        				$('.no_done').eq(i).hide();
        			}else{
        				$('.no_done').eq(i).find('span').text(data.content.options[i].remainNum)
        				$('.no_done').eq(i).show()
        				$('.has_done').eq(i).hide();
        			}
        		}
        		$('.select_check').each(function(){
        			if(!$(this).hasClass('done_check') && !$(this).hasClass('has_select_check') && $('.has_select_check').length == 0){
        				$(this).addClass('has_select_check');        			}
        		})
        		if(data.success){
        			if($('#active24hour').length >0){
						$('#active24hour').modal('show')
					}
        		}
        	}

        }
	})

	$(document).on('click','.select_check',function(e){
		if($(this).hasClass('done_check') == false){
			$(this).addClass('has_select_check').parent().siblings('li').find('.select_check').removeClass('has_select_check')
		}
	})
	$(document).on('click','.agree_check',function(){
		if($(this).hasClass('has_agree_check')){
			$(this).removeClass('has_agree_check');
			$('.apply').addClass('disapply').removeClass('apply')
		}else{
			$(this).addClass('has_agree_check')
			$('.disapply').addClass('apply').removeClass('disapply')
		}
	})
	$(document).on('click','.apply',function(){
		$.ajax({
	        url: '../../https@activity.lagou.com/activityapi/lamp/saveSpeedEntry',
	        // url: '../../10.1.200.143_3A10320/activityapi/lamp/saveSpeedEntry',
	        dataType: 'jsonp',
	        jsonp: "jsoncallback",
	        data: {
	            hrId: window.CONST_VARS('user').id,
	            date:$('.has_select_check').data('index')
	        },
	        success:function(data){
	        	if(data.state ==200){
	        		$('.close').click();
	        	}else if(data.state == 300){

	        	}else if(data.state == 3){
	        		$('.close').click();
	        		alert('抱歉，报名入口已关闭')
	        	}else if(data.state == 4){
	        		$('.close').click();
	        		alert('抱歉，您已报过名')
	        	}else if(data.state == 5){
	        		$('.close').click();
	        		alert('抱歉该日期报名已满')
	        	}else{

	        	}

	        }
		})
	})
	$(document).on('click','.abandon',function(){
		$.ajax({
	        url: '../../https@activity.lagou.com/activityapi/lamp/refuseToast',
	        // url: '../../10.1.200.143_3A10320/activityapi/lamp/refuseToast',
	        dataType: 'jsonp',
	        jsonp: "jsoncallback",
	        data: {
	            hrId: window.CONST_VARS('user').id
	        },
	        success:function(data){
	        	if(data.state == 200){
	        		$('.close').click();
	        	}
	        }
		})
	})
	// $('body').on('click','.24hour-class',function(){
	// 	$.ajax({
	//         url: '../../https@activity.lagou.com/activityapi/lamp/refuseToast',
	//         // url: '../../10.1.200.143_3A10320/activityapi/lamp/refuseToast',
	//         dataType: 'jsonp',
	//         jsonp: "jsoncallback",
	//         data: {
	//             hrId: window.CONST_VARS('user').id
	//         },
	//         success:function(data){
	//         	if(data.state == 200){
	//         		$('#active24hour').hide();
	//         		$('.modal-backdrop').hide();
	//         	}
	//         }
	// 	})
	// })



});

/*!dep/jquery-placeholder/jquery.placeholder.js*/
;/*!
 * jQuery Placeholder Plugin v2.3.1
 * https://github.com/mathiasbynens/jquery-placeholder
 *
 * Copyright 2011, 2015 Mathias Bynens
 * Released under the MIT license
 */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define('dep/jquery-placeholder/jquery.placeholder', ['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {

    /****
     * Allows plugin behavior simulation in modern browsers for easier debugging. 
     * When setting to true, use attribute "placeholder-x" rather than the usual "placeholder" in your inputs/textareas 
     * i.e. <input type="text" placeholder-x="my placeholder text" />
     */
    var debugMode = false; 

    // Opera Mini v7 doesn't support placeholder although its DOM seems to indicate so
    var isOperaMini = Object.prototype.toString.call(window.operamini) === '[object OperaMini]';
    var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini && !debugMode;
    var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini && !debugMode;
    var valHooks = $.valHooks;
    var propHooks = $.propHooks;
    var hooks;
    var placeholder;
    var settings = {};

    if (isInputSupported && isTextareaSupported) {

        placeholder = $.fn.placeholder = function() {
            return this;
        };

        placeholder.input = true;
        placeholder.textarea = true;

    } else {

        placeholder = $.fn.placeholder = function(options) {

            var defaults = {customClass: 'placeholder'};
            settings = $.extend({}, defaults, options);

            return this.filter((isInputSupported ? 'textarea' : ':input') + '[' + (debugMode ? 'placeholder-x' : 'placeholder') + ']')
                .not('.'+settings.customClass)
                .not(':radio, :checkbox, [type=hidden]')
                .bind({
                    'focus.placeholder': clearPlaceholder,
                    'blur.placeholder': setPlaceholder
                })
                .data('placeholder-enabled', true)
                .trigger('blur.placeholder');
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
            'get': function(element) {

                var $element = $(element);
                var $passwordInput = $element.data('placeholder-password');

                if ($passwordInput) {
                    return $passwordInput[0].value;
                }

                return $element.data('placeholder-enabled') && $element.hasClass(settings.customClass) ? '' : element.value;
            },
            'set': function(element, value) {

                var $element = $(element);
                var $replacement;
                var $passwordInput;

                if (value !== '') {

                    $replacement = $element.data('placeholder-textinput');
                    $passwordInput = $element.data('placeholder-password');

                    if ($replacement) {
                        clearPlaceholder.call($replacement[0], true, value) || (element.value = value);
                        $replacement[0].value = value;

                    } else if ($passwordInput) {
                        clearPlaceholder.call(element, true, value) || ($passwordInput[0].value = value);
                        element.value = value;
                    }
                }

                if (!$element.data('placeholder-enabled')) {
                    element.value = value;
                    return $element;
                }

                if (value === '') {
                    
                    element.value = value;
                    
                    // Setting the placeholder causes problems if the element continues to have focus.
                    if (element != safeActiveElement()) {
                        // We can't use `triggerHandler` here because of dummy text/password inputs :(
                        setPlaceholder.call(element);
                    }

                } else {
                    
                    if ($element.hasClass(settings.customClass)) {
                        clearPlaceholder.call(element);
                    }

                    element.value = value;
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                return $element;
            }
        };

        if (!isInputSupported) {
            valHooks.input = hooks;
            propHooks.value = hooks;
        }

        if (!isTextareaSupported) {
            valHooks.textarea = hooks;
            propHooks.value = hooks;
        }

        $(function() {
            // Look for forms
            $(document).delegate('form', 'submit.placeholder', function() {
                
                // Clear the placeholder values so they don't get submitted
                var $inputs = $('.'+settings.customClass, this).each(function() {
                    clearPlaceholder.call(this, true, '');
                });

                setTimeout(function() {
                    $inputs.each(setPlaceholder);
                }, 10);
            });
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function() {

            var clearPlaceholders = true;

            try {
                // Prevent IE javascript:void(0) anchors from causing cleared values
                if (document.activeElement.toString() === 'javascript:void(0)') {
                    clearPlaceholders = false;
                }
            } catch (exception) { }

            if (clearPlaceholders) {
                $('.'+settings.customClass).each(function() {
                    this.value = '';
                });
            }
        });
    }

    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {};
        var rinlinejQuery = /^jQuery\d+$/;

        $.each(elem.attributes, function(i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });

        return newAttrs;
    }

    function clearPlaceholder(event, value) {
        
        var input = this;
        var $input = $(this);
        
        if (input.value === $input.attr((debugMode ? 'placeholder-x' : 'placeholder')) && $input.hasClass(settings.customClass)) {
            
            input.value = '';
            $input.removeClass(settings.customClass);

            if ($input.data('placeholder-password')) {

                $input = $input.hide().nextAll('input[type="password"]:first').show().attr('id', $input.removeAttr('id').data('placeholder-id'));
                
                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                if (event === true) {
                    $input[0].value = value;

                    return value;
                }

                $input.focus();

            } else {
                input == safeActiveElement() && input.select();
            }
        }
    }

    function setPlaceholder(event) {
        var $replacement;
        var input = this;
        var $input = $(this);
        var id = input.id;

        // If the placeholder is activated, triggering blur event (`$input.trigger('blur')`) should do nothing.
        if (event && event.type === 'blur' && $input.hasClass(settings.customClass)) {
            return;
        }

        if (input.value === '') {
            if (input.type === 'password') {
                if (!$input.data('placeholder-textinput')) {
                    
                    try {
                        $replacement = $input.clone().prop({ 'type': 'text' });
                    } catch(e) {
                        $replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
                    }

                    $replacement
                        .removeAttr('name')
                        .data({
                            'placeholder-enabled': true,
                            'placeholder-password': $input,
                            'placeholder-id': id
                        })
                        .bind('focus.placeholder', clearPlaceholder);

                    $input
                        .data({
                            'placeholder-textinput': $replacement,
                            'placeholder-id': id
                        })
                        .before($replacement);
                }

                input.value = '';
                $input = $input.removeAttr('id').hide().prevAll('input[type="text"]:first').attr('id', $input.data('placeholder-id')).show();

            } else {
                
                var $passwordInput = $input.data('placeholder-password');

                if ($passwordInput) {
                    $passwordInput[0].value = '';
                    $input.attr('id', $input.data('placeholder-id')).show().nextAll('input[type="password"]:last').hide().removeAttr('id');
                }
            }

            $input.addClass(settings.customClass);
            $input[0].value = $input.attr((debugMode ? 'placeholder-x' : 'placeholder'));

        } else {
            $input.removeClass(settings.customClass);
        }
    }

    function safeActiveElement() {
        // Avoid IE9 `document.activeElement` of death
        try {
            return document.activeElement;
        } catch (exception) {}
    }
}));

/*!dep/datetimepicker/jquery.datetimepicker.js*/
;/**
 * @preserve jQuery DateTimePicker plugin v2.4.5
 * @homepage http://xdsoft.net/jqplugins/datetimepicker/
 * (c) 2014, Chupurnov Valeriy.
 */
/*global document,window,jQuery,setTimeout,clearTimeout,HighlightedDate,getCurrentValue*/
(function ($) {
	'use strict';
	var default_options  = {
		i18n: {
			en: { // English
				months: [
					"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
				],
				dayOfWeek: [
					"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
				]
			},
			ch: { // Simplified Chinese
				months: [
					"1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"
				],
				dayOfWeek: [
					"日", "一", "二", "三", "四", "五", "六"
				]
			},
			zh: { //Simplified Chinese (简体中文)
				months: [
					"一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"
				],
				dayOfWeek: [
					"日", "一", "二", "三", "四", "五", "六"
				]
			}
		},
		value: '',
		lang: 'ch',

		format:	'Y-m-d H:i',
		formatTime:	'H:i',
		formatDate:	'Y/m/d',

		startDate:	false, // new Date(), '1986/12/08', '-1970/01/05','-1970/01/05',
		step: 30,
		monthChangeSpinner: true,

		closeOnDateSelect: false,
		closeOnTimeSelect: true,
		closeOnWithoutClick: true,
		closeOnInputClick: true,

		timepicker: true,
		datepicker: true,
		weeks: false,

		defaultTime: false,	// use formatTime format (ex. '10:00' for formatTime:	'H:i')
		defaultDate: false,	// use formatDate format (ex new Date() or '1986/12/08' or '-1970/01/05' or '-1970/01/05')

		minDate: false,
		maxDate: false,
		minTime: false,
		maxTime: false,
		disabledMinTime: false,
		disabledMaxTime: false,

		allowTimes: [],
		opened: false,
		initTime: true,
		inline: false,
		theme: '',

		onSelectDate: function () {},
		onSelectTime: function () {},
		onChangeMonth: function () {},
		onChangeYear: function () {},
		onChangeDateTime: function () {},
		onShow: function () {},
		onClose: function () {},
		onGenerate: function () {},

		withoutCopyright: true,
		inverseButton: false,
		hours12: false,
		next: 'xdsoft_next',
		prev : 'xdsoft_prev',
		dayOfWeekStart: 0,
		parentID: 'body',
		timeHeightInTimePicker: 25,
		timepickerScrollbar: true,
		todayButton: false,
		prevButton: true,
		nextButton: true,
		defaultSelect: true,

		scrollMonth: false,
		scrollTime: true,
		scrollInput: false,

		lazyInit: false,
		mask: false,
		validateOnBlur: true,
		allowBlank: true,
		yearStart: 1980,
		yearEnd: 2050,
		monthStart: 0,
		monthEnd: 11,
		style: '',
		id: '',
		fixed: false,
		roundTime: 'round', // ceil, floor
		className: '',
		weekends: [],
		highlightedDates: [],
		highlightedPeriods: [],
		disabledDates : [],
		disabledWeekDays: [],
		yearOffset: 0,
		beforeShowDay: null,

		enterLikeTab: true,
        showApplyButton: false
	};
	// fix for ie8
	if (!window.getComputedStyle) {
		window.getComputedStyle = function (el, pseudo) {
			this.el = el;
			this.getPropertyValue = function (prop) {
				var re = /(\-([a-z]){1})/g;
				if (prop === 'float') {
					prop = 'styleFloat';
				}
				if (re.test(prop)) {
					prop = prop.replace(re, function (a, b, c) {
						return c.toUpperCase();
					});
				}
				return el.currentStyle[prop] || null;
			};
			return this;
		};
	}
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (obj, start) {
			var i, j;
			for (i = (start || 0), j = this.length; i < j; i += 1) {
				if (this[i] === obj) { return i; }
			}
			return -1;
		};
	}
	Date.prototype.countDaysInMonth = function () {
		return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
	};
	$.fn.xdsoftScroller = function (percent) {
		return this.each(function () {
			var timeboxparent = $(this),
				pointerEventToXY = function (e) {
					var out = {x: 0, y: 0},
						touch;
					if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
						touch  = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						out.x = touch.clientX;
						out.y = touch.clientY;
					} else if (e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
						out.x = e.clientX;
						out.y = e.clientY;
					}
					return out;
				},
				move = 0,
				timebox,
				parentHeight,
				height,
				scrollbar,
				scroller,
				maximumOffset = 100,
				start = false,
				startY = 0,
				startTop = 0,
				h1 = 0,
				touchStart = false,
				startTopScroll = 0,
				calcOffset = function () {};
			if (percent === 'hide') {
				timeboxparent.find('.xdsoft_scrollbar').hide();
				return;
			}
			if (!$(this).hasClass('xdsoft_scroller_box')) {
				timebox = timeboxparent.children().eq(0);
				parentHeight = timeboxparent[0].clientHeight;
				height = timebox[0].offsetHeight;
				scrollbar = $('<div class="xdsoft_scrollbar"></div>');
				scroller = $('<div class="xdsoft_scroller"></div>');
				scrollbar.append(scroller);

				timeboxparent.addClass('xdsoft_scroller_box').append(scrollbar);
				calcOffset = function calcOffset(event) {
					var offset = pointerEventToXY(event).y - startY + startTopScroll;
					if (offset < 0) {
						offset = 0;
					}
					if (offset + scroller[0].offsetHeight > h1) {
						offset = h1 - scroller[0].offsetHeight;
					}
					timeboxparent.trigger('scroll_element.xdsoft_scroller', [maximumOffset ? offset / maximumOffset : 0]);
				};

				scroller
					.on('touchstart.xdsoft_scroller mousedown.xdsoft_scroller', function (event) {
						if (!parentHeight) {
							timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percent]);
						}

						startY = pointerEventToXY(event).y;
						startTopScroll = parseInt(scroller.css('margin-top'), 10);
						h1 = scrollbar[0].offsetHeight;

						if (event.type === 'mousedown') {
							if (document) {
								$(document.body).addClass('xdsoft_noselect');
							}
							$([document.body, window]).on('mouseup.xdsoft_scroller', function arguments_callee() {
								$([document.body, window]).off('mouseup.xdsoft_scroller', arguments_callee)
									.off('mousemove.xdsoft_scroller', calcOffset)
									.removeClass('xdsoft_noselect');
							});
							$(document.body).on('mousemove.xdsoft_scroller', calcOffset);
						} else {
							touchStart = true;
							event.stopPropagation();
							event.preventDefault();
						}
					})
					.on('touchmove', function (event) {
						if (touchStart) {
							event.preventDefault();
							calcOffset(event);
						}
					})
					.on('touchend touchcancel', function (event) {
						touchStart =  false;
						startTopScroll = 0;
					});

				timeboxparent
					.on('scroll_element.xdsoft_scroller', function (event, percentage) {
						if (!parentHeight) {
							timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percentage, true]);
						}
						percentage = percentage > 1 ? 1 : (percentage < 0 || isNaN(percentage)) ? 0 : percentage;

						scroller.css('margin-top', maximumOffset * percentage);

						setTimeout(function () {
							timebox.css('marginTop', -parseInt((timebox[0].offsetHeight - parentHeight) * percentage, 10));
						}, 10);
					})
					.on('resize_scroll.xdsoft_scroller', function (event, percentage, noTriggerScroll) {
						var percent, sh;
						parentHeight = timeboxparent[0].clientHeight;
						height = timebox[0].offsetHeight;
						percent = parentHeight / height;
						sh = percent * scrollbar[0].offsetHeight;
						if (percent > 1) {
							scroller.hide();
						} else {
							//scroller.show();
							scroller.css('height', parseInt(sh > 10 ? sh : 10, 10));
							maximumOffset = scrollbar[0].offsetHeight - scroller[0].offsetHeight;
							if (noTriggerScroll !== true) {
								timeboxparent.trigger('scroll_element.xdsoft_scroller', [percentage || Math.abs(parseInt(timebox.css('marginTop'), 10)) / (height - parentHeight)]);
							}
						}
					});

				timeboxparent.on('mousewheel', function (event) {
					var top = Math.abs(parseInt(timebox.css('marginTop'), 10));

					top = top - (event.deltaY * 20);
					if (top < 0) {
						top = 0;
					}

					timeboxparent.trigger('scroll_element.xdsoft_scroller', [top / (height - parentHeight)]);
					event.stopPropagation();
					return false;
				});

				timeboxparent.on('touchstart', function (event) {
					start = pointerEventToXY(event);
					startTop = Math.abs(parseInt(timebox.css('marginTop'), 10));
				});

				timeboxparent.on('touchmove', function (event) {
					if (start) {
						event.preventDefault();
						var coord = pointerEventToXY(event);
						timeboxparent.trigger('scroll_element.xdsoft_scroller', [(startTop - (coord.y - start.y)) / (height - parentHeight)]);
					}
				});

				timeboxparent.on('touchend touchcancel', function (event) {
					start = false;
					startTop = 0;
				});
			}
			timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percent]);
		});
	};

	$.fn.datetimepicker = function (opt) {
		var KEY0 = 48,
			KEY9 = 57,
			_KEY0 = 96,
			_KEY9 = 105,
			CTRLKEY = 17,
			DEL = 46,
			ENTER = 13,
			ESC = 27,
			BACKSPACE = 8,
			ARROWLEFT = 37,
			ARROWUP = 38,
			ARROWRIGHT = 39,
			ARROWDOWN = 40,
			TAB = 9,
			F5 = 116,
			AKEY = 65,
			CKEY = 67,
			VKEY = 86,
			ZKEY = 90,
			YKEY = 89,
			ctrlDown	=	false,
			options = ($.isPlainObject(opt) || !opt) ? $.extend(true, {}, default_options, opt) : $.extend(true, {}, default_options),

			lazyInitTimer = 0,
			createDateTimePicker,
			destroyDateTimePicker,

			lazyInit = function (input) {
				input
					.on('open.xdsoft focusin.xdsoft mousedown.xdsoft', function initOnActionCallback(event) {
						if (input.is(':disabled') || input.data('xdsoft_datetimepicker')) {
							return;
						}
						clearTimeout(lazyInitTimer);
						lazyInitTimer = setTimeout(function () {

							if (!input.data('xdsoft_datetimepicker')) {
								createDateTimePicker(input);
							}
							input
								.off('open.xdsoft focusin.xdsoft mousedown.xdsoft', initOnActionCallback)
								.trigger('open.xdsoft');
						}, 100);
					});
			};

		createDateTimePicker = function (input) {
			var datetimepicker = $('<div class="xdsoft_datetimepicker xdsoft_noselect"></div>'),
				xdsoft_copyright = $('<div class="xdsoft_copyright"><a target="_blank" href="../../xdsoft.net/jqplugins/datetimepicker/default.htm">xdsoft.net</a></div>'),
				datepicker = $('<div class="xdsoft_datepicker active"></div>'),
				mounth_picker = $('<div class="xdsoft_mounthpicker"><button type="button" class="xdsoft_prev"><i class="icon-arrow-left"></i></button>' +
					'<div class="xdsoft_label xdsoft_month"><span></span></div>' +
					'<div class="xdsoft_label xdsoft_year"><span></span></div>' +
					'<button type="button" class="xdsoft_next"><i class="icon-arrow-right"></i></button></div>'),
				calendar = $('<div class="xdsoft_calendar"></div>'),
				timepicker = $('<div class="xdsoft_timepicker active"><button type="button" class="xdsoft_prev"><i class="icon-arrow-up"></i></button><div class="xdsoft_time_box"></div><button type="button" class="xdsoft_next"><i class="icon-arrow-down"></i></button></div>'),
				timeboxparent = timepicker.find('.xdsoft_time_box').eq(0),
				timebox = $('<div class="xdsoft_time_variant"></div>'),
                applyButton = $('<button type="button" class="xdsoft_save_selected blue-gradient-button">Save Selected</button>'),
				monthselect = $('<div class="xdsoft_select xdsoft_monthselect"><div></div></div>'),
				yearselect = $('<div class="xdsoft_select xdsoft_yearselect"><div></div></div>'),
				triggerAfterOpen = false,
				XDSoft_datetime,
				//scroll_element,
				xchangeTimer,
				timerclick,
				current_time_index,
				setPos,
				timer = 0,
				timer1 = 0,
				_xdsoft_datetime;

			if (options.id) {
				datetimepicker.attr('id', options.id);
			}
			if (options.style) {
				datetimepicker.attr('style', options.style);
			}
			if (options.weeks) {
				datetimepicker.addClass('xdsoft_showweeks');
			}

			datetimepicker.addClass('xdsoft_' + options.theme);
			datetimepicker.addClass(options.className);

			mounth_picker
				.find('.xdsoft_month span')
					.after(monthselect);
			mounth_picker
				.find('.xdsoft_year span')
					.after(yearselect);

			mounth_picker
				.find('.xdsoft_month,.xdsoft_year')
					.on('mousedown.xdsoft', function (event) {
					var select = $(this).find('.xdsoft_select').eq(0),
						val = 0,
						top = 0,
						visible = select.is(':visible'),
						items,
						i;

					mounth_picker
						.find('.xdsoft_select')
							.hide();
					if (_xdsoft_datetime.currentTime) {
						val = _xdsoft_datetime.currentTime[$(this).hasClass('xdsoft_month') ? 'getMonth' : 'getFullYear']();
					}

					select[visible ? 'hide' : 'show']();
					for (items = select.find('div.xdsoft_option'), i = 0; i < items.length; i += 1) {
						if (items.eq(i).data('value') === val) {
							break;
						} else {
							top += items[0].offsetHeight;
						}
					}

					select.xdsoftScroller(top / (select.children()[0].offsetHeight - (select[0].clientHeight)));
					event.stopPropagation();
					return false;
				});

			mounth_picker
				.find('.xdsoft_select')
					.xdsoftScroller()
				.on('mousedown.xdsoft', function (event) {
					event.stopPropagation();
					event.preventDefault();
				})
				.on('mousedown.xdsoft', '.xdsoft_option', function (event) {

					if (_xdsoft_datetime.currentTime === undefined || _xdsoft_datetime.currentTime === null) {
						_xdsoft_datetime.currentTime = _xdsoft_datetime.now();
					}

					var year = _xdsoft_datetime.currentTime.getFullYear();
					if (_xdsoft_datetime && _xdsoft_datetime.currentTime) {
						_xdsoft_datetime.currentTime[$(this).parent().parent().hasClass('xdsoft_monthselect') ? 'setMonth' : 'setFullYear']($(this).data('value'));
					}

					$(this).parent().parent().hide();

					datetimepicker.trigger('xchange.xdsoft');
					if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
						options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
					}

					if (year !== _xdsoft_datetime.currentTime.getFullYear() && $.isFunction(options.onChangeYear)) {
						options.onChangeYear.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
					}
				});

			datetimepicker.setOptions = function (_options) {
				var highlightedDates = {},
					getCaretPos = function (input) {
						try {
							if (document.selection && document.selection.createRange) {
								var range = document.selection.createRange();
								return range.getBookmark().charCodeAt(2) - 2;
							}
							if (input.setSelectionRange) {
								return input.selectionStart;
							}
						} catch (e) {
							return 0;
						}
					},
					setCaretPos = function (node, pos) {
						node = (typeof node === "string" || node instanceof String) ? document.getElementById(node) : node;
						if (!node) {
							return false;
						}
						if (node.createTextRange) {
							var textRange = node.createTextRange();
							textRange.collapse(true);
							textRange.moveEnd('character', pos);
							textRange.moveStart('character', pos);
							textRange.select();
							return true;
						}
						if (node.setSelectionRange) {
							node.setSelectionRange(pos, pos);
							return true;
						}
						return false;
					},
					isValidValue = function (mask, value) {
						var reg = mask
							.replace(/([\[\]\/\{\}\(\)\-\.\+]{1})/g, '\\$1')
							.replace(/_/g, '{digit+}')
							.replace(/([0-9]{1})/g, '{digit$1}')
							.replace(/\{digit([0-9]{1})\}/g, '[0-$1_]{1}')
							.replace(/\{digit[\+]\}/g, '[0-9_]{1}');
						return (new RegExp(reg)).test(value);
					};
				options = $.extend(true, {}, options, _options);

				if (_options.allowTimes && $.isArray(_options.allowTimes) && _options.allowTimes.length) {
					options.allowTimes = $.extend(true, [], _options.allowTimes);
				}

				if (_options.weekends && $.isArray(_options.weekends) && _options.weekends.length) {
					options.weekends = $.extend(true, [], _options.weekends);
				}

				if (_options.highlightedDates && $.isArray(_options.highlightedDates) && _options.highlightedDates.length) {
					$.each(_options.highlightedDates, function (index, value) {
						var splitData = $.map(value.split(','), $.trim),
							exDesc,
							hDate = new HighlightedDate(Date.parseDate(splitData[0], options.formatDate), splitData[1], splitData[2]), // date, desc, style
							keyDate = hDate.date.dateFormat(options.formatDate);
						if (highlightedDates[keyDate] !== undefined) {
							exDesc = highlightedDates[keyDate].desc;
							if (exDesc && exDesc.length && hDate.desc && hDate.desc.length) {
								highlightedDates[keyDate].desc = exDesc + "\n" + hDate.desc;
							}
						} else {
							highlightedDates[keyDate] = hDate;
						}
					});

					options.highlightedDates = $.extend(true, [], highlightedDates);
				}

				if (_options.highlightedPeriods && $.isArray(_options.highlightedPeriods) && _options.highlightedPeriods.length) {
					highlightedDates = $.extend(true, [], options.highlightedDates);
					$.each(_options.highlightedPeriods, function (index, value) {
						var splitData = $.map(value.split(','), $.trim),
							dateTest = Date.parseDate(splitData[0], options.formatDate), // start date
							dateEnd = Date.parseDate(splitData[1], options.formatDate),
							desc = splitData[2],
							hDate,
							keyDate,
							exDesc,
							style = splitData[3];

						while (dateTest <= dateEnd) {
							hDate = new HighlightedDate(dateTest, desc, style);
							keyDate = dateTest.dateFormat(options.formatDate);
							dateTest.setDate(dateTest.getDate() + 1);
							if (highlightedDates[keyDate] !== undefined) {
								exDesc = highlightedDates[keyDate].desc;
								if (exDesc && exDesc.length && hDate.desc && hDate.desc.length) {
									highlightedDates[keyDate].desc = exDesc + "\n" + hDate.desc;
								}
							} else {
								highlightedDates[keyDate] = hDate;
							}
						}
					});

					options.highlightedDates = $.extend(true, [], highlightedDates);
				}

				if (_options.disabledDates && $.isArray(_options.disabledDates) && _options.disabledDates.length) {
					options.disabledDates = $.extend(true, [], _options.disabledDates);
				}

				if (_options.disabledWeekDays && $.isArray(_options.disabledWeekDays) && _options.disabledWeekDays.length) {
				    options.disabledWeekDays = $.extend(true, [], _options.disabledWeekDays);
				}

				if ((options.open || options.opened) && (!options.inline)) {
					input.trigger('open.xdsoft');
				}

				if (options.inline) {
					triggerAfterOpen = true;
					datetimepicker.addClass('xdsoft_inline');
					input.after(datetimepicker).hide();
				}

				if (options.inverseButton) {
					options.next = 'xdsoft_prev';
					options.prev = 'xdsoft_next';
				}

				if (options.datepicker) {
					datepicker.addClass('active');
				} else {
					datepicker.removeClass('active');
				}

				if (options.timepicker) {
					timepicker.addClass('active');
				} else {
					timepicker.removeClass('active');
				}

				if (options.value) {
					_xdsoft_datetime.setCurrentTime(options.value);
					if (input && input.val) {
						input.val(_xdsoft_datetime.str);
					}
				}

				if (isNaN(options.dayOfWeekStart)) {
					options.dayOfWeekStart = 0;
				} else {
					options.dayOfWeekStart = parseInt(options.dayOfWeekStart, 10) % 7;
				}

				if (!options.timepickerScrollbar) {
					timeboxparent.xdsoftScroller('hide');
				}

				if (options.minDate && /^-(.*)$/.test(options.minDate)) {
					options.minDate = _xdsoft_datetime.strToDateTime(options.minDate).dateFormat(options.formatDate);
				}

				if (options.maxDate &&  /^\+(.*)$/.test(options.maxDate)) {
					options.maxDate = _xdsoft_datetime.strToDateTime(options.maxDate).dateFormat(options.formatDate);
				}

				applyButton.toggle(options.showApplyButton);

				mounth_picker
					.find('.xdsoft_today_button')
						.css('visibility', !options.todayButton ? 'hidden' : 'visible');

				mounth_picker
					.find('.' + options.prev)
						.css('visibility', !options.prevButton ? 'hidden' : 'visible');

				mounth_picker
					.find('.' + options.next)
						.css('visibility', !options.nextButton ? 'hidden' : 'visible');

				if (options.mask) {
					input.off('keydown.xdsoft');

					if (options.mask === true) {
						options.mask = options.format
							.replace(/Y/g, '9999')
							.replace(/F/g, '9999')
							.replace(/m/g, '19')
							.replace(/d/g, '39')
							.replace(/H/g, '29')
							.replace(/i/g, '59')
							.replace(/s/g, '59');
					}

					if ($.type(options.mask) === 'string') {
						if (!isValidValue(options.mask, input.val())) {
							input.val(options.mask.replace(/[0-9]/g, '_'));
						}

						input.on('keydown.xdsoft', function (event) {
							var val = this.value,
								key = event.which,
								pos,
								digit;

							if (((key >= KEY0 && key <= KEY9) || (key >= _KEY0 && key <= _KEY9)) || (key === BACKSPACE || key === DEL)) {
								pos = getCaretPos(this);
								digit = (key !== BACKSPACE && key !== DEL) ? String.fromCharCode((_KEY0 <= key && key <= _KEY9) ? key - KEY0 : key) : '_';

								if ((key === BACKSPACE || key === DEL) && pos) {
									pos -= 1;
									digit = '_';
								}

								while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
									pos += (key === BACKSPACE || key === DEL) ? -1 : 1;
								}

								val = val.substr(0, pos) + digit + val.substr(pos + 1);
								if ($.trim(val) === '') {
									val = options.mask.replace(/[0-9]/g, '_');
								} else {
									if (pos === options.mask.length) {
										event.preventDefault();
										return false;
									}
								}

								pos += (key === BACKSPACE || key === DEL) ? 0 : 1;
								while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
									pos += (key === BACKSPACE || key === DEL) ? -1 : 1;
								}

								if (isValidValue(options.mask, val)) {
									this.value = val;
									setCaretPos(this, pos);
								} else if ($.trim(val) === '') {
									this.value = options.mask.replace(/[0-9]/g, '_');
								} else {
									input.trigger('error_input.xdsoft');
								}
							} else {
								if (([AKEY, CKEY, VKEY, ZKEY, YKEY].indexOf(key) !== -1 && ctrlDown) || [ESC, ARROWUP, ARROWDOWN, ARROWLEFT, ARROWRIGHT, F5, CTRLKEY, TAB, ENTER].indexOf(key) !== -1) {
									return true;
								}
							}

							event.preventDefault();
							return false;
						});
					}
				}
				if (options.validateOnBlur) {
					input
						.off('blur.xdsoft')
						.on('blur.xdsoft', function () {
							if (options.allowBlank && !$.trim($(this).val()).length) {
								$(this).val(null);
								datetimepicker.data('xdsoft_datetime').empty();
							} else if (!Date.parseDate($(this).val(), options.format)) {
								var splittedHours   = +([$(this).val()[0], $(this).val()[1]].join('')),
									splittedMinutes = +([$(this).val()[2], $(this).val()[3]].join(''));

								// parse the numbers as 0312 => 03:12
								if (!options.datepicker && options.timepicker && splittedHours >= 0 && splittedHours < 24 && splittedMinutes >= 0 && splittedMinutes < 60) {
									$(this).val([splittedHours, splittedMinutes].map(function (item) {
										return item > 9 ? item : '0' + item;
									}).join(':'));
								} else {
									$(this).val((_xdsoft_datetime.now()).dateFormat(options.format));
								}

								datetimepicker.data('xdsoft_datetime').setCurrentTime($(this).val());
							} else {
								datetimepicker.data('xdsoft_datetime').setCurrentTime($(this).val());
							}

							datetimepicker.trigger('changedatetime.xdsoft');
						});
				}
				options.dayOfWeekStartPrev = (options.dayOfWeekStart === 0) ? 6 : options.dayOfWeekStart - 1;

				datetimepicker
					.trigger('xchange.xdsoft')
					.trigger('afterOpen.xdsoft');
			};

			datetimepicker
				.data('options', options)
				.on('mousedown.xdsoft', function (event) {
					event.stopPropagation();
					event.preventDefault();
					yearselect.hide();
					monthselect.hide();
					return false;
				});

			//scroll_element = timepicker.find('.xdsoft_time_box');
			timeboxparent.append(timebox);
			timeboxparent.xdsoftScroller();

			datetimepicker.on('afterOpen.xdsoft', function () {
				timeboxparent.xdsoftScroller();
			});

			datetimepicker
				.append(datepicker)
				.append(timepicker);

			if (options.withoutCopyright !== true) {
				datetimepicker
					.append(xdsoft_copyright);
			}

			datepicker
				.append(mounth_picker)
				.append(calendar)
				.append(applyButton);

			$(options.parentID)
				.append(datetimepicker);

			XDSoft_datetime = function () {
				var _this = this;
				_this.now = function (norecursion) {
					var d = new Date(),
						date,
						time;

					if (!norecursion && options.defaultDate) {
						date = _this.strToDateTime(options.defaultDate);
						d.setFullYear(date.getFullYear());
						d.setMonth(date.getMonth());
						d.setDate(date.getDate());
					}

					if (options.yearOffset) {
						d.setFullYear(d.getFullYear() + options.yearOffset);
					}

					if (!norecursion && options.defaultTime) {
						time = _this.strtotime(options.defaultTime);
						d.setHours(time.getHours());
						d.setMinutes(time.getMinutes());
					}
					return d;
				};

				_this.isValidDate = function (d) {
					if (Object.prototype.toString.call(d) !== "[object Date]") {
						return false;
					}
					return !isNaN(d.getTime());
				};

				_this.setCurrentTime = function (dTime) {
					_this.currentTime = (typeof dTime === 'string') ? _this.strToDateTime(dTime) : _this.isValidDate(dTime) ? dTime : _this.now();
					datetimepicker.trigger('xchange.xdsoft');
				};

				_this.empty = function () {
					_this.currentTime = null;
				};

				_this.getCurrentTime = function (dTime) {
					return _this.currentTime;
				};

				_this.nextMonth = function () {

					if (_this.currentTime === undefined || _this.currentTime === null) {
						_this.currentTime = _this.now();
					}

					var month = _this.currentTime.getMonth() + 1,
						year;
					if (month === 12) {
						_this.currentTime.setFullYear(_this.currentTime.getFullYear() + 1);
						month = 0;
					}

					year = _this.currentTime.getFullYear();

					_this.currentTime.setDate(
						Math.min(
							new Date(_this.currentTime.getFullYear(), month + 1, 0).getDate(),
							_this.currentTime.getDate()
						)
					);
					_this.currentTime.setMonth(month);

					if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
						options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
					}

					if (year !== _this.currentTime.getFullYear() && $.isFunction(options.onChangeYear)) {
						options.onChangeYear.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
					}

					datetimepicker.trigger('xchange.xdsoft');
					return month;
				};

				_this.prevMonth = function () {

					if (_this.currentTime === undefined || _this.currentTime === null) {
						_this.currentTime = _this.now();
					}

					var month = _this.currentTime.getMonth() - 1;
					if (month === -1) {
						_this.currentTime.setFullYear(_this.currentTime.getFullYear() - 1);
						month = 11;
					}
					_this.currentTime.setDate(
						Math.min(
							new Date(_this.currentTime.getFullYear(), month + 1, 0).getDate(),
							_this.currentTime.getDate()
						)
					);
					_this.currentTime.setMonth(month);
					if (options.onChangeMonth && $.isFunction(options.onChangeMonth)) {
						options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
					}
					datetimepicker.trigger('xchange.xdsoft');
					return month;
				};

				_this.getWeekOfYear = function (datetime) {
					var onejan = new Date(datetime.getFullYear(), 0, 1);
					return Math.ceil((((datetime - onejan) / 86400000) + onejan.getDay() + 1) / 7);
				};

				_this.strToDateTime = function (sDateTime) {
					var tmpDate = [], timeOffset, currentTime;

					if (sDateTime && sDateTime instanceof Date && _this.isValidDate(sDateTime)) {
						return sDateTime;
					}

					tmpDate = /^(\+|\-)(.*)$/.exec(sDateTime);
					if (tmpDate) {
						tmpDate[2] = Date.parseDate(tmpDate[2], options.formatDate);
					}
					if (tmpDate  && tmpDate[2]) {
						timeOffset = tmpDate[2].getTime() - (tmpDate[2].getTimezoneOffset()) * 60000;
						currentTime = new Date((_this.now(true)).getTime() + parseInt(tmpDate[1] + '1', 10) * timeOffset);
					} else {
						currentTime = sDateTime ? Date.parseDate(sDateTime, options.format) : _this.now();
					}

					if (!_this.isValidDate(currentTime)) {
						currentTime = _this.now();
					}

					return currentTime;
				};

				_this.strToDate = function (sDate) {
					if (sDate && sDate instanceof Date && _this.isValidDate(sDate)) {
						return sDate;
					}

					var currentTime = sDate ? Date.parseDate(sDate, options.formatDate) : _this.now(true);
					if (!_this.isValidDate(currentTime)) {
						currentTime = _this.now(true);
					}
					return currentTime;
				};

				_this.strtotime = function (sTime) {
					if (sTime && sTime instanceof Date && _this.isValidDate(sTime)) {
						return sTime;
					}
					var currentTime = sTime ? Date.parseDate(sTime, options.formatTime) : _this.now(true);
					if (!_this.isValidDate(currentTime)) {
						currentTime = _this.now(true);
					}
					return currentTime;
				};

				_this.str = function () {
					return _this.currentTime.dateFormat(options.format);
				};
				_this.currentTime = this.now();
			};

			_xdsoft_datetime = new XDSoft_datetime();

			applyButton.on('click', function (e) {//pathbrite
                e.preventDefault();
                datetimepicker.data('changed', true);
                _xdsoft_datetime.setCurrentTime(getCurrentValue());
                input.val(_xdsoft_datetime.str());
                datetimepicker.trigger('close.xdsoft');
            });
			mounth_picker
				.find('.xdsoft_today_button')
				.on('mousedown.xdsoft', function () {
					datetimepicker.data('changed', true);
					_xdsoft_datetime.setCurrentTime(0);
					datetimepicker.trigger('afterOpen.xdsoft');
				}).on('dblclick.xdsoft', function () {
					var currentDate = _xdsoft_datetime.getCurrentTime(), minDate, maxDate;
					currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
					minDate = _xdsoft_datetime.strToDate(options.minDate);
					minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
					if (currentDate < minDate) {
						return;
					}
					maxDate = _xdsoft_datetime.strToDate(options.maxDate);
					maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
					if (currentDate > maxDate) {
						return;
					}
					input.val(_xdsoft_datetime.str());
					datetimepicker.trigger('close.xdsoft');
				});
			mounth_picker
				.find('.xdsoft_prev,.xdsoft_next')
				.on('mousedown.xdsoft', function () {
					var $this = $(this),
						timer = 0,
						stop = false;

					(function arguments_callee1(v) {
						if ($this.hasClass(options.next)) {
							_xdsoft_datetime.nextMonth();
						} else if ($this.hasClass(options.prev)) {
							_xdsoft_datetime.prevMonth();
						}
						if (options.monthChangeSpinner) {
							if (!stop) {
								timer = setTimeout(arguments_callee1, v || 100);
							}
						}
					}(500));

					$([document.body, window]).on('mouseup.xdsoft', function arguments_callee2() {
						clearTimeout(timer);
						stop = true;
						$([document.body, window]).off('mouseup.xdsoft', arguments_callee2);
					});
				});

			timepicker
				.find('.xdsoft_prev,.xdsoft_next')
				.on('mousedown.xdsoft', function () {
					var $this = $(this),
						timer = 0,
						stop = false,
						period = 110;
					(function arguments_callee4(v) {
						var pheight = timeboxparent[0].clientHeight,
							height = timebox[0].offsetHeight,
							top = Math.abs(parseInt(timebox.css('marginTop'), 10));
						if ($this.hasClass(options.next) && (height - pheight) - options.timeHeightInTimePicker >= top) {
							timebox.css('marginTop', '-' + (top + options.timeHeightInTimePicker) + 'px');
						} else if ($this.hasClass(options.prev) && top - options.timeHeightInTimePicker >= 0) {
							timebox.css('marginTop', '-' + (top - options.timeHeightInTimePicker) + 'px');
						}
						timeboxparent.trigger('scroll_element.xdsoft_scroller', [Math.abs(parseInt(timebox.css('marginTop'), 10) / (height - pheight))]);
						period = (period > 10) ? 10 : period - 10;
						if (!stop) {
							timer = setTimeout(arguments_callee4, v || period);
						}
					}(500));
					$([document.body, window]).on('mouseup.xdsoft', function arguments_callee5() {
						clearTimeout(timer);
						stop = true;
						$([document.body, window])
							.off('mouseup.xdsoft', arguments_callee5);
					});
				});

			xchangeTimer = 0;
			// base handler - generating a calendar and timepicker
			datetimepicker
				.on('xchange.xdsoft', function (event) {
					clearTimeout(xchangeTimer);
					xchangeTimer = setTimeout(function () {

						if (_xdsoft_datetime.currentTime === undefined || _xdsoft_datetime.currentTime === null) {
							_xdsoft_datetime.currentTime = _xdsoft_datetime.now();
						}

						var table =	'',
							start = new Date(_xdsoft_datetime.currentTime.getFullYear(), _xdsoft_datetime.currentTime.getMonth(), 1, 12, 0, 0),
							i = 0,
							j,
							today = _xdsoft_datetime.now(),
							maxDate = false,
							minDate = false,
							hDate,
							day,
							d,
							y,
							m,
							w,
							classes = [],
							customDateSettings,
							newRow = true,
							time = '',
							h = '',
							line_time,
							description;

						while (start.getDay() !== options.dayOfWeekStart) {
							start.setDate(start.getDate() - 1);
						}

						table += '<table><thead><tr>';

						if (options.weeks) {
							table += '<th></th>';
						}

						for (j = 0; j < 7; j += 1) {
							table += '<th>' + options.i18n[options.lang].dayOfWeek[(j + options.dayOfWeekStart) % 7] + '</th>';
						}

						table += '</tr></thead>';
						table += '<tbody>';

						if (options.maxDate !== false) {
							maxDate = _xdsoft_datetime.strToDate(options.maxDate);
							maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59, 999);
						}

						if (options.minDate !== false) {
							minDate = _xdsoft_datetime.strToDate(options.minDate);
							minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
						}

						while (i < _xdsoft_datetime.currentTime.countDaysInMonth() || start.getDay() !== options.dayOfWeekStart || _xdsoft_datetime.currentTime.getMonth() === start.getMonth()) {
							classes = [];
							i += 1;

							day = start.getDay();
							d = start.getDate();
							y = start.getFullYear();
							m = start.getMonth();
							w = _xdsoft_datetime.getWeekOfYear(start);
							description = '';

							classes.push('xdsoft_date');

							if (options.beforeShowDay && $.isFunction(options.beforeShowDay.call)) {
								customDateSettings = options.beforeShowDay.call(datetimepicker, start);
							} else {
								customDateSettings = null;
							}

							if ((maxDate !== false && start > maxDate) || (minDate !== false && start < minDate) || (customDateSettings && customDateSettings[0] === false)) {
								classes.push('xdsoft_disabled');
							} else if (options.disabledDates.indexOf(start.dateFormat(options.formatDate)) !== -1) {
								classes.push('xdsoft_disabled');
							} else if (options.disabledWeekDays.indexOf(day) !== -1) {
							    classes.push('xdsoft_disabled');
							}

							if (customDateSettings && customDateSettings[1] !== "") {
								classes.push(customDateSettings[1]);
							}

							if (_xdsoft_datetime.currentTime.getMonth() !== m) {
								classes.push('xdsoft_other_month xdsoft_disabled');
							}

							if ((options.defaultSelect || datetimepicker.data('changed')) && _xdsoft_datetime.currentTime.dateFormat(options.formatDate) === start.dateFormat(options.formatDate)) {
								classes.push('xdsoft_current');
							}

							if (today.dateFormat(options.formatDate) === start.dateFormat(options.formatDate)) {
								classes.push('xdsoft_today');
							}

							if (start.getDay() === 0 || start.getDay() === 6 || options.weekends.indexOf(start.dateFormat(options.formatDate)) !== -1) {
								classes.push('xdsoft_weekend');
							}

							if (options.highlightedDates[start.dateFormat(options.formatDate)] !== undefined) {
								hDate = options.highlightedDates[start.dateFormat(options.formatDate)];
								classes.push(hDate.style === undefined ? 'xdsoft_highlighted_default' : hDate.style);
								description = hDate.desc === undefined ? '' : hDate.desc;
							}

							if (options.beforeShowDay && $.isFunction(options.beforeShowDay)) {
								classes.push(options.beforeShowDay(start));
							}

							if (newRow) {
								table += '<tr>';
								newRow = false;
								if (options.weeks) {
									table += '<th>' + w + '</th>';
								}
							}

							table += '<td data-date="' + d + '" data-month="' + m + '" data-year="' + y + '"' + ' class="xdsoft_date xdsoft_day_of_week' + start.getDay() + ' ' + classes.join(' ') + '" title="' + description + '">' +
										'<div>' + d + '</div>' +
									'</td>';

							if (start.getDay() === options.dayOfWeekStartPrev) {
								table += '</tr>';
								newRow = true;
							}

							start.setDate(d + 1);
						}
						table += '</tbody></table>';

						calendar.html(table);
						mounth_picker.find('.xdsoft_label span').eq(0).text(options.i18n[options.lang].months[_xdsoft_datetime.currentTime.getMonth()]);
						mounth_picker.find('.xdsoft_label span').eq(1).text(_xdsoft_datetime.currentTime.getFullYear());
						if(mounth_picker.find('.xdsoft_prev').css('visibility') == 'visible'){
							mounth_picker.find('.xdsoft_prev').nextAll('.xdsoft_label').addClass('text')
						}
						// generate timebox
						time = '';
						h = '';
						m = '';
						line_time = function line_time(h, m) {
							var now = _xdsoft_datetime.now(), optionDateTime, current_time;
							now.setHours(h);
							h = parseInt(now.getHours(), 10);
							now.setMinutes(m);
							m = parseInt(now.getMinutes(), 10);
							optionDateTime = new Date(_xdsoft_datetime.currentTime);
							optionDateTime.setHours(h);
							optionDateTime.setMinutes(m);
							classes = [];
							if ((options.minDateTime !== false && options.minDateTime > optionDateTime) || (options.maxTime !== false && _xdsoft_datetime.strtotime(options.maxTime).getTime() < now.getTime()) || (options.minTime !== false && _xdsoft_datetime.strtotime(options.minTime).getTime() > now.getTime())) {
								classes.push('xdsoft_disabled');
							}
							if ((options.minDateTime !== false && options.minDateTime > optionDateTime) || ((options.disabledMinTime !== false && now.getTime() > _xdsoft_datetime.strtotime(options.disabledMinTime).getTime()) && (options.disabledMaxTime !== false && now.getTime() < _xdsoft_datetime.strtotime(options.disabledMaxTime).getTime()))) {
								classes.push('xdsoft_disabled');
							}

							current_time = new Date(_xdsoft_datetime.currentTime);
							current_time.setHours(parseInt(_xdsoft_datetime.currentTime.getHours(), 10));
							current_time.setMinutes(Math[options.roundTime](_xdsoft_datetime.currentTime.getMinutes() / options.step) * options.step);

							if ((options.initTime || options.defaultSelect || datetimepicker.data('changed')) && current_time.getHours() === parseInt(h, 10) && (options.step > 59 || current_time.getMinutes() === parseInt(m, 10))) {
								if (options.defaultSelect || datetimepicker.data('changed')) {
									classes.push('xdsoft_current');
								} else if (options.initTime) {
									classes.push('xdsoft_init_time');
								}
							}
							if (parseInt(today.getHours(), 10) === parseInt(h, 10) && parseInt(today.getMinutes(), 10) === parseInt(m, 10)) {
								classes.push('xdsoft_today');
							}
							time += '<div class="xdsoft_time ' + classes.join(' ') + '" data-hour="' + h + '" data-minute="' + m + '">' + now.dateFormat(options.formatTime) + '</div>';
						};

						if (!options.allowTimes || !$.isArray(options.allowTimes) || !options.allowTimes.length) {
							for (i = 0, j = 0; i < (options.hours12 ? 12 : 24); i += 1) {
								for (j = 0; j < 60; j += options.step) {
									h = (i < 10 ? '0' : '') + i;
									m = (j < 10 ? '0' : '') + j;
									line_time(h, m);
								}
							}
						} else {
							for (i = 0; i < options.allowTimes.length; i += 1) {
								h = _xdsoft_datetime.strtotime(options.allowTimes[i]).getHours();
								m = _xdsoft_datetime.strtotime(options.allowTimes[i]).getMinutes();
								line_time(h, m);
							}
						}

						timebox.html(time);

						opt = '';
						i = 0;

						for (i = parseInt(options.yearStart, 10) + options.yearOffset; i <= parseInt(options.yearEnd, 10) + options.yearOffset; i += 1) {
							opt += '<div class="xdsoft_option ' + (_xdsoft_datetime.currentTime.getFullYear() === i ? 'xdsoft_current' : '') + '" data-value="' + i + '">' + i + '</div>';
						}
						yearselect.children().eq(0)
												.html(opt);

						for (i = parseInt(options.monthStart, 10), opt = ''; i <= parseInt(options.monthEnd, 10); i += 1) {
							opt += '<div class="xdsoft_option ' + (_xdsoft_datetime.currentTime.getMonth() === i ? 'xdsoft_current' : '') + '" data-value="' + i + '">' + options.i18n[options.lang].months[i] + '</div>';
						}
						monthselect.children().eq(0).html(opt);
						$(datetimepicker)
							.trigger('generate.xdsoft');
					}, 10);
					event.stopPropagation();
				})
				.on('afterOpen.xdsoft', function () {
					if (options.timepicker) {
						var classType, pheight, height, top;
						if (timebox.find('.xdsoft_current').length) {
							classType = '.xdsoft_current';
						} else if (timebox.find('.xdsoft_init_time').length) {
							classType = '.xdsoft_init_time';
						}
						if (classType) {
							pheight = timeboxparent[0].clientHeight;
							height = timebox[0].offsetHeight;
							top = timebox.find(classType).index() * options.timeHeightInTimePicker + 1;
							if ((height - pheight) < top) {
								top = height - pheight;
							}
							timeboxparent.trigger('scroll_element.xdsoft_scroller', [parseInt(top, 10) / (height - pheight)]);
						} else {
							timeboxparent.trigger('scroll_element.xdsoft_scroller', [0]);
						}
					}
				});

			timerclick = 0;
			calendar
				.on('click.xdsoft', 'td', function (xdevent) {
					xdevent.stopPropagation();  // Prevents closing of Pop-ups, Modals and Flyouts in Bootstrap
					timerclick += 1;
					var $this = $(this),
						currentTime = _xdsoft_datetime.currentTime;

					if (currentTime === undefined || currentTime === null) {
						_xdsoft_datetime.currentTime = _xdsoft_datetime.now();
						currentTime = _xdsoft_datetime.currentTime;
					}

					if ($this.hasClass('xdsoft_disabled')) {
						return false;
					}

					currentTime.setDate(1);
					currentTime.setFullYear($this.data('year'));
					currentTime.setMonth($this.data('month'));
					currentTime.setDate($this.data('date'));

					datetimepicker.trigger('select.xdsoft', [currentTime]);

					input.val(_xdsoft_datetime.str());
					if ((timerclick > 1 || (options.closeOnDateSelect === true || (options.closeOnDateSelect === false && !options.timepicker))) && !options.inline) {
						datetimepicker.trigger('close.xdsoft');
					}

					if (options.onSelectDate &&	$.isFunction(options.onSelectDate)) {
						options.onSelectDate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), xdevent);
					}

					datetimepicker.data('changed', true);
					datetimepicker.trigger('xchange.xdsoft');
					datetimepicker.trigger('changedatetime.xdsoft');
					setTimeout(function () {
						timerclick = 0;
					}, 200);
				});

			timebox
				.on('click.xdsoft', 'div', function (xdevent) {
					xdevent.stopPropagation();
					var $this = $(this),
						currentTime = _xdsoft_datetime.currentTime;

					if (currentTime === undefined || currentTime === null) {
						_xdsoft_datetime.currentTime = _xdsoft_datetime.now();
						currentTime = _xdsoft_datetime.currentTime;
					}

					if ($this.hasClass('xdsoft_disabled')) {
						return false;
					}
					currentTime.setHours($this.data('hour'));
					currentTime.setMinutes($this.data('minute'));
					datetimepicker.trigger('select.xdsoft', [currentTime]);

					datetimepicker.data('input').val(_xdsoft_datetime.str());

                    if (options.inline !== true && options.closeOnTimeSelect === true) {
                        datetimepicker.trigger('close.xdsoft');
                    }

					if (options.onSelectTime && $.isFunction(options.onSelectTime)) {
						options.onSelectTime.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), xdevent);
					}
					datetimepicker.data('changed', true);
					datetimepicker.trigger('xchange.xdsoft');
					datetimepicker.trigger('changedatetime.xdsoft');
				});


			datepicker
				.on('mousewheel.xdsoft', function (event) {
					if (!options.scrollMonth) {
						return true;
					}
					if (event.deltaY < 0) {
						_xdsoft_datetime.nextMonth();
					} else {
						_xdsoft_datetime.prevMonth();
					}
					return false;
				});

			input
				.on('mousewheel.xdsoft', function (event) {
					if (!options.scrollInput) {
						return true;
					}
					if (!options.datepicker && options.timepicker) {
						current_time_index = timebox.find('.xdsoft_current').length ? timebox.find('.xdsoft_current').eq(0).index() : 0;
						if (current_time_index + event.deltaY >= 0 && current_time_index + event.deltaY < timebox.children().length) {
							current_time_index += event.deltaY;
						}
						if (timebox.children().eq(current_time_index).length) {
							timebox.children().eq(current_time_index).trigger('mousedown');
						}
						return false;
					}
					if (options.datepicker && !options.timepicker) {
						datepicker.trigger(event, [event.deltaY, event.deltaX, event.deltaY]);
						if (input.val) {
							input.val(_xdsoft_datetime.str());
						}
						datetimepicker.trigger('changedatetime.xdsoft');
						return false;
					}
				});

			datetimepicker
				.on('changedatetime.xdsoft', function (event) {
					if (options.onChangeDateTime && $.isFunction(options.onChangeDateTime)) {
						var $input = datetimepicker.data('input');
						options.onChangeDateTime.call(datetimepicker, _xdsoft_datetime.currentTime, $input, event);
						delete options.value;
						$input.trigger('change');
					}
				})
				.on('generate.xdsoft', function () {
					if (options.onGenerate && $.isFunction(options.onGenerate)) {
						options.onGenerate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
					}
					if (triggerAfterOpen) {
						datetimepicker.trigger('afterOpen.xdsoft');
						triggerAfterOpen = false;
					}
				})
				.on('click.xdsoft', function (xdevent) {
					xdevent.stopPropagation();
				});

			current_time_index = 0;

			setPos = function () {
				var offset = datetimepicker.data('input').offset(), top = offset.top + datetimepicker.data('input')[0].offsetHeight - 1, left = offset.left, position = "absolute", node;
				if (options.fixed) {
					top -= $(window).scrollTop();
					left -= $(window).scrollLeft();
					position = "fixed";
				} else {
					if (top + datetimepicker[0].offsetHeight > $(window).height() + $(window).scrollTop()) {
						top = offset.top - datetimepicker[0].offsetHeight + 1;
					}
					if (top < 0) {
						top = 0;
					}
					if (left + datetimepicker[0].offsetWidth > $(window).width()) {
						left = $(window).width() - datetimepicker[0].offsetWidth;
					}
				}

				node = datetimepicker[0];
				do {
					node = node.parentNode;
					if (window.getComputedStyle(node).getPropertyValue('position') === 'relative' && $(window).width() >= node.offsetWidth) {
						left = left - (($(window).width() - node.offsetWidth) / 2);
						break;
					}
				} while (node.nodeName !== 'HTML');
				datetimepicker.css({
					left: left,
					top: top,
					position: position
				});
			};
			datetimepicker
				.on('open.xdsoft', function (event) {
					var onShow = true;
					if (options.onShow && $.isFunction(options.onShow)) {
						onShow = options.onShow.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), event);
					}
					if (onShow !== false) {
						datetimepicker.show();
						setPos();
						$(window)
							.off('resize.xdsoft', setPos)
							.on('resize.xdsoft', setPos);

						if (options.closeOnWithoutClick) {
							$([document.body, window]).on('mousedown.xdsoft', function arguments_callee6() {
								datetimepicker.trigger('close.xdsoft');
								$([document.body, window]).off('mousedown.xdsoft', arguments_callee6);
							});
						}
					}
				})
				.on('close.xdsoft', function (event) {
					var onClose = true;
					mounth_picker
						.find('.xdsoft_month,.xdsoft_year')
							.find('.xdsoft_select')
								.hide();
					if (options.onClose && $.isFunction(options.onClose)) {
						onClose = options.onClose.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'), event);
					}
					if (onClose !== false && !options.opened && !options.inline) {
						datetimepicker.hide();
					}
					event.stopPropagation();
				})
				.on('toggle.xdsoft', function (event) {
					if (datetimepicker.is(':visible')) {
						datetimepicker.trigger('close.xdsoft');
					} else {
						datetimepicker.trigger('open.xdsoft');
					}
				})
				.data('input', input);

			timer = 0;
			timer1 = 0;

			datetimepicker.data('xdsoft_datetime', _xdsoft_datetime);
			datetimepicker.setOptions(options);

			function getCurrentValue() {
				var ct = false, time;

				if (options.startDate) {
					ct = _xdsoft_datetime.strToDate(options.startDate);
				} else {
					ct = options.value || ((input && input.val && input.val()) ? input.val() : '');
					if (ct) {
						ct = _xdsoft_datetime.strToDateTime(ct);
					} else if (options.defaultDate) {
						ct = _xdsoft_datetime.strToDateTime(options.defaultDate);
						if (options.defaultTime) {
							time = _xdsoft_datetime.strtotime(options.defaultTime);
							ct.setHours(time.getHours());
							ct.setMinutes(time.getMinutes());
						}
					}
				}

				if (ct && _xdsoft_datetime.isValidDate(ct)) {
					datetimepicker.data('changed', true);
				} else {
					ct = '';
				}

				return ct || 0;
			}

			_xdsoft_datetime.setCurrentTime(getCurrentValue());

			input
				.data('xdsoft_datetimepicker', datetimepicker)
				.on('open.xdsoft focusin.xdsoft mousedown.xdsoft', function (event) {
					if (input.is(':disabled') || (input.data('xdsoft_datetimepicker').is(':visible') && options.closeOnInputClick)) {
						return;
					}
					clearTimeout(timer);
					timer = setTimeout(function () {
						if (input.is(':disabled')) {
							return;
						}

						triggerAfterOpen = true;
						_xdsoft_datetime.setCurrentTime(getCurrentValue());

						datetimepicker.trigger('open.xdsoft');
					}, 100);
				})
				.on('keydown.xdsoft', function (event) {
					var val = this.value, elementSelector,
						key = event.which;
					if ([ENTER].indexOf(key) !== -1 && options.enterLikeTab) {
						elementSelector = $("input:visible,textarea:visible");
						datetimepicker.trigger('close.xdsoft');
						elementSelector.eq(elementSelector.index(this) + 1).focus();
						return false;
					}
					if ([TAB].indexOf(key) !== -1) {
						datetimepicker.trigger('close.xdsoft');
						return true;
					}
				});
		};
		destroyDateTimePicker = function (input) {
			var datetimepicker = input.data('xdsoft_datetimepicker');
			if (datetimepicker) {
				datetimepicker.data('xdsoft_datetime', null);
				datetimepicker.remove();
				input
					.data('xdsoft_datetimepicker', null)
					.off('.xdsoft');
				$(window).off('resize.xdsoft');
				$([window, document.body]).off('mousedown.xdsoft');
				if (input.unmousewheel) {
					input.unmousewheel();
				}
			}
		};
		$(document)
			.off('keydown.xdsoftctrl keyup.xdsoftctrl')
			.on('keydown.xdsoftctrl', function (e) {
				if (e.keyCode === CTRLKEY) {
					ctrlDown = true;
				}
			})
			.on('keyup.xdsoftctrl', function (e) {
				if (e.keyCode === CTRLKEY) {
					ctrlDown = false;
				}
			});
		return this.each(function () {
			var datetimepicker = $(this).data('xdsoft_datetimepicker'), $input;
			if (datetimepicker) {
				if ($.type(opt) === 'string') {
					switch (opt) {
					case 'show':
						$(this).select().focus();
						datetimepicker.trigger('open.xdsoft');
						break;
					case 'hide':
						datetimepicker.trigger('close.xdsoft');
						break;
					case 'toggle':
						datetimepicker.trigger('toggle.xdsoft');
						break;
					case 'destroy':
						destroyDateTimePicker($(this));
						break;
					case 'reset':
						this.value = this.defaultValue;
						if (!this.value || !datetimepicker.data('xdsoft_datetime').isValidDate(Date.parseDate(this.value, options.format))) {
							datetimepicker.data('changed', false);
						}
						datetimepicker.data('xdsoft_datetime').setCurrentTime(this.value);
						break;
					case 'validate':
						$input = datetimepicker.data('input');
						$input.trigger('blur.xdsoft');
						break;
					}
				} else {
					datetimepicker
						.setOptions(opt);
				}
				return 0;
			}
			if ($.type(opt) !== 'string') {
				if (!options.lazyInit || options.open || options.inline) {
					createDateTimePicker($(this));
				} else {
					lazyInit($(this));
				}
			}
		});
	};
	$.fn.datetimepicker.defaults = default_options;
}(jQuery));

function HighlightedDate(date, desc, style) {
	"use strict";
	this.date = date;
	this.desc = desc;
	this.style = style;
}

(function () {
/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 3.1.12
 *
 * Requires: jQuery 1.2.2+
 */
!function(a){"function"==typeof define&&define.amd?define('dep/datetimepicker/jquery.datetimepicker', ["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});

// Parse and Format Library
//http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/
/*
 * Copyright (C) 2004 Baron Schwartz <baron at sequent dot org>
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by the
 * Free Software Foundation, version 2.1.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
 * details.
 */
Date.parseFunctions={count:0};Date.parseRegexes=[];Date.formatFunctions={count:0};Date.prototype.dateFormat=function(b){if(b=="unixtime"){return parseInt(this.getTime()/1000);}if(Date.formatFunctions[b]==null){Date.createNewFormat(b);}var a=Date.formatFunctions[b];return this[a]();};Date.createNewFormat=function(format){var funcName="format"+Date.formatFunctions.count++;Date.formatFunctions[format]=funcName;var codePrefix="Date.prototype."+funcName+" = function() {return ";var code="";var special=false;var ch="";for(var i=0;i<format.length;++i){ch=format.charAt(i);if(!special&&ch=="\\"){special=true;}else{if(special){special=false;code+="'"+String.escape(ch)+"' + ";}else{code+=Date.getFormatCode(ch);}}}if(code.length==0){code="\"\"";}else{code=code.substring(0,code.length-3);}eval(codePrefix+code+";}");};Date.getFormatCode=function(a){switch(a){case"d":return"String.leftPad(this.getDate(), 2, '0') + ";case"D":return"Date.dayNames[this.getDay()].substring(0, 3) + ";case"j":return"this.getDate() + ";case"l":return"Date.dayNames[this.getDay()] + ";case"S":return"this.getSuffix() + ";case"w":return"this.getDay() + ";case"z":return"this.getDayOfYear() + ";case"W":return"this.getWeekOfYear() + ";case"F":return"Date.monthNames[this.getMonth()] + ";case"m":return"String.leftPad(this.getMonth() + 1, 2, '0') + ";case"M":return"Date.monthNames[this.getMonth()].substring(0, 3) + ";case"n":return"(this.getMonth() + 1) + ";case"t":return"this.getDaysInMonth() + ";case"L":return"(this.isLeapYear() ? 1 : 0) + ";case"Y":return"this.getFullYear() + ";case"y":return"('' + this.getFullYear()).substring(2, 4) + ";case"a":return"(this.getHours() < 12 ? 'am' : 'pm') + ";case"A":return"(this.getHours() < 12 ? 'AM' : 'PM') + ";case"g":return"((this.getHours() %12) ? this.getHours() % 12 : 12) + ";case"G":return"this.getHours() + ";case"h":return"String.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";case"H":return"String.leftPad(this.getHours(), 2, '0') + ";case"i":return"String.leftPad(this.getMinutes(), 2, '0') + ";case"s":return"String.leftPad(this.getSeconds(), 2, '0') + ";case"O":return"this.getGMTOffset() + ";case"T":return"this.getTimezone() + ";case"Z":return"(this.getTimezoneOffset() * -60) + ";default:return"'"+String.escape(a)+"' + ";}};Date.parseDate=function(a,c){if(c=="unixtime"){return new Date(!isNaN(parseInt(a))?parseInt(a)*1000:0);}if(Date.parseFunctions[c]==null){Date.createParser(c);}var b=Date.parseFunctions[c];return Date[b](a);};Date.createParser=function(format){var funcName="parse"+Date.parseFunctions.count++;var regexNum=Date.parseRegexes.length;var currentGroup=1;Date.parseFunctions[format]=funcName;var code="Date."+funcName+" = function(input) {\nvar y = -1, m = -1, d = -1, h = -1, i = -1, s = -1, z = -1;\nvar d = new Date();\ny = d.getFullYear();\nm = d.getMonth();\nd = d.getDate();\nvar results = input.match(Date.parseRegexes["+regexNum+"]);\nif (results && results.length > 0) {";var regex="";var special=false;var ch="";for(var i=0;i<format.length;++i){ch=format.charAt(i);if(!special&&ch=="\\"){special=true;}else{if(special){special=false;regex+=String.escape(ch);}else{obj=Date.formatCodeToRegex(ch,currentGroup);currentGroup+=obj.g;regex+=obj.s;if(obj.g&&obj.c){code+=obj.c;}}}}code+="if (y > 0 && z > 0){\nvar doyDate = new Date(y,0);\ndoyDate.setDate(z);\nm = doyDate.getMonth();\nd = doyDate.getDate();\n}";code+="if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n{return new Date(y, m, d, h, i, s);}\nelse if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n{return new Date(y, m, d, h, i);}\nelse if (y > 0 && m >= 0 && d > 0 && h >= 0)\n{return new Date(y, m, d, h);}\nelse if (y > 0 && m >= 0 && d > 0)\n{return new Date(y, m, d);}\nelse if (y > 0 && m >= 0)\n{return new Date(y, m);}\nelse if (y > 0)\n{return new Date(y);}\n}return null;}";Date.parseRegexes[regexNum]=new RegExp("^"+regex+"$",'i');eval(code);};Date.formatCodeToRegex=function(b,a){switch(b){case"D":return{g:0,c:null,s:"(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)"};case"j":case"d":return{g:1,c:"d = parseInt(results["+a+"], 10);\n",s:"(\\d{1,2})"};case"l":return{g:0,c:null,s:"(?:"+Date.dayNames.join("|")+")"};case"S":return{g:0,c:null,s:"(?:st|nd|rd|th)"};case"w":return{g:0,c:null,s:"\\d"};case"z":return{g:1,c:"z = parseInt(results["+a+"], 10);\n",s:"(\\d{1,3})"};case"W":return{g:0,c:null,s:"(?:\\d{2})"};case"F":return{g:1,c:"m = parseInt(Date.monthNumbers[results["+a+"].substring(0, 3)], 10);\n",s:"("+Date.monthNames.join("|")+")"};case"M":return{g:1,c:"m = parseInt(Date.monthNumbers[results["+a+"]], 10);\n",s:"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"};case"n":case"m":return{g:1,c:"m = parseInt(results["+a+"], 10) - 1;\n",s:"(\\d{1,2})"};case"t":return{g:0,c:null,s:"\\d{1,2}"};case"L":return{g:0,c:null,s:"(?:1|0)"};case"Y":return{g:1,c:"y = parseInt(results["+a+"], 10);\n",s:"(\\d{4})"};case"y":return{g:1,c:"var ty = parseInt(results["+a+"], 10);\ny = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n",s:"(\\d{1,2})"};case"a":return{g:1,c:"if (results["+a+"] == 'am') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",s:"(am|pm)"};case"A":return{g:1,c:"if (results["+a+"] == 'AM') {\nif (h == 12) { h = 0; }\n} else { if (h < 12) { h += 12; }}",s:"(AM|PM)"};case"g":case"G":case"h":case"H":return{g:1,c:"h = parseInt(results["+a+"], 10);\n",s:"(\\d{1,2})"};case"i":return{g:1,c:"i = parseInt(results["+a+"], 10);\n",s:"(\\d{2})"};case"s":return{g:1,c:"s = parseInt(results["+a+"], 10);\n",s:"(\\d{2})"};case"O":return{g:0,c:null,s:"[+-]\\d{4}"};case"T":return{g:0,c:null,s:"[A-Z]{3}"};case"Z":return{g:0,c:null,s:"[+-]\\d{1,5}"};default:return{g:0,c:null,s:String.escape(b)};}};Date.prototype.getTimezone=function(){return this.toString().replace(/^.*? ([A-Z]{3}) [0-9]{4}.*$/,"$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/,"$1$2$3");};Date.prototype.getGMTOffset=function(){return(this.getTimezoneOffset()>0?"-":"+")+String.leftPad(Math.floor(Math.abs(this.getTimezoneOffset())/60),2,"0")+String.leftPad(Math.abs(this.getTimezoneOffset())%60,2,"0");};Date.prototype.getDayOfYear=function(){var a=0;Date.daysInMonth[1]=this.isLeapYear()?29:28;for(var b=0;b<this.getMonth();++b){a+=Date.daysInMonth[b];}return a+this.getDate();};Date.prototype.getWeekOfYear=function(){var b=this.getDayOfYear()+(4-this.getDay());var a=new Date(this.getFullYear(),0,1);var c=(7-a.getDay()+4);return String.leftPad(Math.ceil((b-c)/7)+1,2,"0");};Date.prototype.isLeapYear=function(){var a=this.getFullYear();return((a&3)==0&&(a%100||(a%400==0&&a)));};Date.prototype.getFirstDayOfMonth=function(){var a=(this.getDay()-(this.getDate()-1))%7;return(a<0)?(a+7):a;};Date.prototype.getLastDayOfMonth=function(){var a=(this.getDay()+(Date.daysInMonth[this.getMonth()]-this.getDate()))%7;return(a<0)?(a+7):a;};Date.prototype.getDaysInMonth=function(){Date.daysInMonth[1]=this.isLeapYear()?29:28;return Date.daysInMonth[this.getMonth()];};Date.prototype.getSuffix=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";case 2:case 22:return"nd";case 3:case 23:return"rd";default:return"th";}};String.escape=function(a){return a.replace(/('|\\)/g,"\\$1");};String.leftPad=function(d,b,c){var a=new String(d);if(c==null){c=" ";}while(a.length<b){a=c+a;}return a;};Date.daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];Date.monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];Date.dayNames=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];Date.y2kYear=50;Date.monthNumbers={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};Date.patterns={ISO8601LongPattern:"Y-m-d H:i:s",ISO8601ShortPattern:"Y-m-d",ShortDatePattern:"n/j/Y",LongDatePattern:"l, F d, Y",FullDateTimePattern:"l, F d, Y g:i:s A",MonthDayPattern:"F d",ShortTimePattern:"g:i A",LongTimePattern:"g:i:s A",SortableDateTimePattern:"Y-m-d\\TH:i:s",UniversalSortableDateTimePattern:"Y-m-d H:i:sO",YearMonthPattern:"F, Y"};
}());

/*!dep/history.js/scripts/bundled-uncompressed/html4+html5/jquery.history.js*/
;define('dep/history.js/scripts/bundled-uncompressed/html4+html5/jquery.history', ['require', 'exports', 'module'], function(require, exports, module) {

  /*
      json2.js
      2012-10-08
  
      Public Domain.
  
      NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
  
      See http://www.JSON.org/js.html
  
  
      This code should be minified before deployment.
      See http://javascript.crockford.com/jsmin.html
  
      USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
      NOT CONTROL.
  
  
      This file creates a global JSON object containing two methods: stringify
      and parse.
  
          JSON.stringify(value, replacer, space)
              value       any JavaScript value, usually an object or array.
  
              replacer    an optional parameter that determines how object
                          values are stringified for objects. It can be a
                          function or an array of strings.
  
              space       an optional parameter that specifies the indentation
                          of nested structures. If it is omitted, the text will
                          be packed without extra whitespace. If it is a number,
                          it will specify the number of spaces to indent at each
                          level. If it is a string (such as '\t' or '&nbsp;'),
                          it contains the characters used to indent at each level.
  
              This method produces a JSON text from a JavaScript value.
  
              When an object value is found, if the object contains a toJSON
              method, its toJSON method will be called and the result will be
              stringified. A toJSON method does not serialize: it returns the
              value represented by the name/value pair that should be serialized,
              or undefined if nothing should be serialized. The toJSON method
              will be passed the key associated with the value, and this will be
              bound to the value
  
              For example, this would serialize Dates as ISO strings.
  
                  Date.prototype.toJSON = function (key) {
                      function f(n) {
                          // Format integers to have at least two digits.
                          return n < 10 ? '0' + n : n;
                      }
  
                      return this.getUTCFullYear()   + '-' +
                           f(this.getUTCMonth() + 1) + '-' +
                           f(this.getUTCDate())      + 'T' +
                           f(this.getUTCHours())     + ':' +
                           f(this.getUTCMinutes())   + ':' +
                           f(this.getUTCSeconds())   + 'Z';
                  };
  
              You can provide an optional replacer method. It will be passed the
              key and value of each member, with this bound to the containing
              object. The value that is returned from your method will be
              serialized. If your method returns undefined, then the member will
              be excluded from the serialization.
  
              If the replacer parameter is an array of strings, then it will be
              used to select the members to be serialized. It filters the results
              such that only members with keys listed in the replacer array are
              stringified.
  
              Values that do not have JSON representations, such as undefined or
              functions, will not be serialized. Such values in objects will be
              dropped; in arrays they will be replaced with null. You can use
              a replacer function to replace those with JSON values.
              JSON.stringify(undefined) returns undefined.
  
              The optional space parameter produces a stringification of the
              value that is filled with line breaks and indentation to make it
              easier to read.
  
              If the space parameter is a non-empty string, then that string will
              be used for indentation. If the space parameter is a number, then
              the indentation will be that many spaces.
  
              Example:
  
              text = JSON.stringify(['e', {pluribus: 'unum'}]);
              // text is '["e",{"pluribus":"unum"}]'
  
  
              text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
              // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'
  
              text = JSON.stringify([new Date()], function (key, value) {
                  return this[key] instanceof Date ?
                      'Date(' + this[key] + ')' : value;
              });
              // text is '["Date(---current time---)"]'
  
  
          JSON.parse(text, reviver)
              This method parses a JSON text to produce an object or array.
              It can throw a SyntaxError exception.
  
              The optional reviver parameter is a function that can filter and
              transform the results. It receives each of the keys and values,
              and its return value is used instead of the original value.
              If it returns what it received, then the structure is not modified.
              If it returns undefined then the member is deleted.
  
              Example:
  
              // Parse the text. Values that look like ISO date strings will
              // be converted to Date objects.
  
              myData = JSON.parse(text, function (key, value) {
                  var a;
                  if (typeof value === 'string') {
                      a =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                      if (a) {
                          return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                              +a[5], +a[6]));
                      }
                  }
                  return value;
              });
  
              myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                  var d;
                  if (typeof value === 'string' &&
                          value.slice(0, 5) === 'Date(' &&
                          value.slice(-1) === ')') {
                      d = new Date(value.slice(5, -1));
                      if (d) {
                          return d;
                      }
                  }
                  return value;
              });
  
  
      This is a reference implementation. You are free to copy, modify, or
      redistribute.
  */
  
  /*jslint evil: true, regexp: true */
  
  /*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
      call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
      getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
      lastIndex, length, parse, prototype, push, replace, slice, stringify,
      test, toJSON, toString, valueOf
  */
  
  
  // Create a JSON object only if one does not already exist. We create the
  // methods in a closure to avoid creating global variables.
  
  if (typeof JSON !== 'object') {
      JSON = {};
  }
  
  (function () {
      'use strict';
  
      function f(n) {
          // Format integers to have at least two digits.
          return n < 10 ? '0' + n : n;
      }
  
      if (typeof Date.prototype.toJSON !== 'function') {
  
          Date.prototype.toJSON = function (key) {
  
              return isFinite(this.valueOf())
                  ? this.getUTCFullYear()     + '-' +
                      f(this.getUTCMonth() + 1) + '-' +
                      f(this.getUTCDate())      + 'T' +
                      f(this.getUTCHours())     + ':' +
                      f(this.getUTCMinutes())   + ':' +
                      f(this.getUTCSeconds())   + 'Z'
                  : null;
          };
  
          String.prototype.toJSON      =
              Number.prototype.toJSON  =
              Boolean.prototype.toJSON = function (key) {
                  return this.valueOf();
              };
      }
  
      var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
          escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
          gap,
          indent,
          meta = {    // table of character substitutions
              '\b': '\\b',
              '\t': '\\t',
              '\n': '\\n',
              '\f': '\\f',
              '\r': '\\r',
              '"' : '\\"',
              '\\': '\\\\'
          },
          rep;
  
  
      function quote(string) {
  
  // If the string contains no control characters, no quote characters, and no
  // backslash characters, then we can safely slap some quotes around it.
  // Otherwise we must also replace the offending characters with safe escape
  // sequences.
  
          escapable.lastIndex = 0;
          return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
              var c = meta[a];
              return typeof c === 'string'
                  ? c
                  : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          }) + '"' : '"' + string + '"';
      }
  
  
      function str(key, holder) {
  
  // Produce a string from holder[key].
  
          var i,          // The loop counter.
              k,          // The member key.
              v,          // The member value.
              length,
              mind = gap,
              partial,
              value = holder[key];
  
  // If the value has a toJSON method, call it to obtain a replacement value.
  
          if (value && typeof value === 'object' &&
                  typeof value.toJSON === 'function') {
              value = value.toJSON(key);
          }
  
  // If we were called with a replacer function, then call the replacer to
  // obtain a replacement value.
  
          if (typeof rep === 'function') {
              value = rep.call(holder, key, value);
          }
  
  // What happens next depends on the value's type.
  
          switch (typeof value) {
          case 'string':
              return quote(value);
  
          case 'number':
  
  // JSON numbers must be finite. Encode non-finite numbers as null.
  
              return isFinite(value) ? String(value) : 'null';
  
          case 'boolean':
          case 'null':
  
  // If the value is a boolean or null, convert it to a string. Note:
  // typeof null does not produce 'null'. The case is included here in
  // the remote chance that this gets fixed someday.
  
              return String(value);
  
  // If the type is 'object', we might be dealing with an object or an array or
  // null.
  
          case 'object':
  
  // Due to a specification blunder in ECMAScript, typeof null is 'object',
  // so watch out for that case.
  
              if (!value) {
                  return 'null';
              }
  
  // Make an array to hold the partial results of stringifying this object value.
  
              gap += indent;
              partial = [];
  
  // Is the value an array?
  
              if (Object.prototype.toString.apply(value) === '[object Array]') {
  
  // The value is an array. Stringify every element. Use null as a placeholder
  // for non-JSON values.
  
                  length = value.length;
                  for (i = 0; i < length; i += 1) {
                      partial[i] = str(i, value) || 'null';
                  }
  
  // Join all of the elements together, separated with commas, and wrap them in
  // brackets.
  
                  v = partial.length === 0
                      ? '[]'
                      : gap
                      ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                      : '[' + partial.join(',') + ']';
                  gap = mind;
                  return v;
              }
  
  // If the replacer is an array, use it to select the members to be stringified.
  
              if (rep && typeof rep === 'object') {
                  length = rep.length;
                  for (i = 0; i < length; i += 1) {
                      if (typeof rep[i] === 'string') {
                          k = rep[i];
                          v = str(k, value);
                          if (v) {
                              partial.push(quote(k) + (gap ? ': ' : ':') + v);
                          }
                      }
                  }
              } else {
  
  // Otherwise, iterate through all of the keys in the object.
  
                  for (k in value) {
                      if (Object.prototype.hasOwnProperty.call(value, k)) {
                          v = str(k, value);
                          if (v) {
                              partial.push(quote(k) + (gap ? ': ' : ':') + v);
                          }
                      }
                  }
              }
  
  // Join all of the member texts together, separated with commas,
  // and wrap them in braces.
  
              v = partial.length === 0
                  ? '{}'
                  : gap
                  ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                  : '{' + partial.join(',') + '}';
              gap = mind;
              return v;
          }
      }
  
  // If the JSON object does not yet have a stringify method, give it one.
  
      if (typeof JSON.stringify !== 'function') {
          JSON.stringify = function (value, replacer, space) {
  
  // The stringify method takes a value and an optional replacer, and an optional
  // space parameter, and returns a JSON text. The replacer can be a function
  // that can replace values, or an array of strings that will select the keys.
  // A default replacer method can be provided. Use of the space parameter can
  // produce text that is more easily readable.
  
              var i;
              gap = '';
              indent = '';
  
  // If the space parameter is a number, make an indent string containing that
  // many spaces.
  
              if (typeof space === 'number') {
                  for (i = 0; i < space; i += 1) {
                      indent += ' ';
                  }
  
  // If the space parameter is a string, it will be used as the indent string.
  
              } else if (typeof space === 'string') {
                  indent = space;
              }
  
  // If there is a replacer, it must be a function or an array.
  // Otherwise, throw an error.
  
              rep = replacer;
              if (replacer && typeof replacer !== 'function' &&
                      (typeof replacer !== 'object' ||
                      typeof replacer.length !== 'number')) {
                  throw new Error('JSON.stringify');
              }
  
  // Make a fake root object containing our value under the key of ''.
  // Return the result of stringifying the value.
  
              return str('', {'': value});
          };
      }
  
  
  // If the JSON object does not yet have a parse method, give it one.
  
      if (typeof JSON.parse !== 'function') {
          JSON.parse = function (text, reviver) {
  
  // The parse method takes a text and an optional reviver function, and returns
  // a JavaScript value if the text is a valid JSON text.
  
              var j;
  
              function walk(holder, key) {
  
  // The walk method is used to recursively walk the resulting structure so
  // that modifications can be made.
  
                  var k, v, value = holder[key];
                  if (value && typeof value === 'object') {
                      for (k in value) {
                          if (Object.prototype.hasOwnProperty.call(value, k)) {
                              v = walk(value, k);
                              if (v !== undefined) {
                                  value[k] = v;
                              } else {
                                  delete value[k];
                              }
                          }
                      }
                  }
                  return reviver.call(holder, key, value);
              }
  
  
  // Parsing happens in four stages. In the first stage, we replace certain
  // Unicode characters with escape sequences. JavaScript handles many characters
  // incorrectly, either silently deleting them, or treating them as line endings.
  
              text = String(text);
              cx.lastIndex = 0;
              if (cx.test(text)) {
                  text = text.replace(cx, function (a) {
                      return '\\u' +
                          ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                  });
              }
  
  // In the second stage, we run the text against regular expressions that look
  // for non-JSON patterns. We are especially concerned with '()' and 'new'
  // because they can cause invocation, and '=' because it can cause mutation.
  // But just to be safe, we want to reject all unexpected forms.
  
  // We split the second stage into 4 regexp operations in order to work around
  // crippling inefficiencies in IE's and Safari's regexp engines. First we
  // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
  // replace all simple value tokens with ']' characters. Third, we delete all
  // open brackets that follow a colon or comma or that begin the text. Finally,
  // we look to see that the remaining characters are only whitespace or ']' or
  // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
  
              if (/^[\],:{}\s]*$/
                      .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                          .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                          .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
  
  // In the third stage we use the eval function to compile the text into a
  // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
  // in JavaScript: it can begin a block or an object literal. We wrap the text
  // in parens to eliminate the ambiguity.
  
                  j = eval('(' + text + ')');
  
  // In the optional fourth stage, we recursively walk the new structure, passing
  // each name/value pair to a reviver function for possible transformation.
  
                  return typeof reviver === 'function'
                      ? walk({'': j}, '')
                      : j;
              }
  
  // If the text is not JSON parseable, then a SyntaxError is thrown.
  
              throw new SyntaxError('JSON.parse');
          };
      }
  }());/**
   * History.js jQuery Adapter
   * @author Benjamin Arthur Lupton <contact@balupton.com>
   * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
   * @license New BSD License <http://creativecommons.org/licenses/BSD/>
   */
  
  // Closure
  (function(window,undefined){
  	"use strict";
  
  	// Localise Globals
  	var
  		History = window.History = window.History||{},
  		jQuery = window.jQuery;
  
  	// Check Existence
  	if ( typeof History.Adapter !== 'undefined' ) {
  		throw new Error('History.js Adapter has already been loaded...');
  	}
  
  	// Add the Adapter
  	History.Adapter = {
  		/**
  		 * History.Adapter.bind(el,event,callback)
  		 * @param {Element|string} el
  		 * @param {string} event - custom and standard events
  		 * @param {function} callback
  		 * @return {void}
  		 */
  		bind: function(el,event,callback){
  			jQuery(el).bind(event,callback);
  		},
  
  		/**
  		 * History.Adapter.trigger(el,event)
  		 * @param {Element|string} el
  		 * @param {string} event - custom and standard events
  		 * @param {Object=} extra - a object of extra event data (optional)
  		 * @return {void}
  		 */
  		trigger: function(el,event,extra){
  			jQuery(el).trigger(event,extra);
  		},
  
  		/**
  		 * History.Adapter.extractEventData(key,event,extra)
  		 * @param {string} key - key for the event data to extract
  		 * @param {string} event - custom and standard events
  		 * @param {Object=} extra - a object of extra event data (optional)
  		 * @return {mixed}
  		 */
  		extractEventData: function(key,event,extra){
  			// jQuery Native then jQuery Custom
  			var result = (event && event.originalEvent && event.originalEvent[key]) || (extra && extra[key]) || undefined;
  
  			// Return
  			return result;
  		},
  
  		/**
  		 * History.Adapter.onDomLoad(callback)
  		 * @param {function} callback
  		 * @return {void}
  		 */
  		onDomLoad: function(callback) {
  			jQuery(callback);
  		}
  	};
  
  	// Try and Initialise History
  	if ( typeof History.init !== 'undefined' ) {
  		History.init();
  	}
  
  })(window);
  
  /**
   * History.js HTML4 Support
   * Depends on the HTML5 Support
   * @author Benjamin Arthur Lupton <contact@balupton.com>
   * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
   * @license New BSD License <http://creativecommons.org/licenses/BSD/>
   */
  
  (function(window,undefined){
  	"use strict";
  
  	// ========================================================================
  	// Initialise
  
  	// Localise Globals
  	var
  		document = window.document, // Make sure we are using the correct document
  		setTimeout = window.setTimeout||setTimeout,
  		clearTimeout = window.clearTimeout||clearTimeout,
  		setInterval = window.setInterval||setInterval,
  		History = window.History = window.History||{}; // Public History Object
  
  	// Check Existence
  	if ( typeof History.initHtml4 !== 'undefined' ) {
  		throw new Error('History.js HTML4 Support has already been loaded...');
  	}
  
  
  	// ========================================================================
  	// Initialise HTML4 Support
  
  	// Initialise HTML4 Support
  	History.initHtml4 = function(){
  		// Initialise
  		if ( typeof History.initHtml4.initialized !== 'undefined' ) {
  			// Already Loaded
  			return false;
  		}
  		else {
  			History.initHtml4.initialized = true;
  		}
  
  
  		// ====================================================================
  		// Properties
  
  		/**
  		 * History.enabled
  		 * Is History enabled?
  		 */
  		History.enabled = true;
  
  
  		// ====================================================================
  		// Hash Storage
  
  		/**
  		 * History.savedHashes
  		 * Store the hashes in an array
  		 */
  		History.savedHashes = [];
  
  		/**
  		 * History.isLastHash(newHash)
  		 * Checks if the hash is the last hash
  		 * @param {string} newHash
  		 * @return {boolean} true
  		 */
  		History.isLastHash = function(newHash){
  			// Prepare
  			var oldHash = History.getHashByIndex(),
  				isLast;
  
  			// Check
  			isLast = newHash === oldHash;
  
  			// Return isLast
  			return isLast;
  		};
  
  		/**
  		 * History.isHashEqual(newHash, oldHash)
  		 * Checks to see if two hashes are functionally equal
  		 * @param {string} newHash
  		 * @param {string} oldHash
  		 * @return {boolean} true
  		 */
  		History.isHashEqual = function(newHash, oldHash){
  			newHash = encodeURIComponent(newHash).replace(/%25/g, "%");
  			oldHash = encodeURIComponent(oldHash).replace(/%25/g, "%");
  			return newHash === oldHash;
  		};
  
  		/**
  		 * History.saveHash(newHash)
  		 * Push a Hash
  		 * @param {string} newHash
  		 * @return {boolean} true
  		 */
  		History.saveHash = function(newHash){
  			// Check Hash
  			if ( History.isLastHash(newHash) ) {
  				return false;
  			}
  
  			// Push the Hash
  			History.savedHashes.push(newHash);
  
  			// Return true
  			return true;
  		};
  
  		/**
  		 * History.getHashByIndex()
  		 * Gets a hash by the index
  		 * @param {integer} index
  		 * @return {string}
  		 */
  		History.getHashByIndex = function(index){
  			// Prepare
  			var hash = null;
  
  			// Handle
  			if ( typeof index === 'undefined' ) {
  				// Get the last inserted
  				hash = History.savedHashes[History.savedHashes.length-1];
  			}
  			else if ( index < 0 ) {
  				// Get from the end
  				hash = History.savedHashes[History.savedHashes.length+index];
  			}
  			else {
  				// Get from the beginning
  				hash = History.savedHashes[index];
  			}
  
  			// Return hash
  			return hash;
  		};
  
  
  		// ====================================================================
  		// Discarded States
  
  		/**
  		 * History.discardedHashes
  		 * A hashed array of discarded hashes
  		 */
  		History.discardedHashes = {};
  
  		/**
  		 * History.discardedStates
  		 * A hashed array of discarded states
  		 */
  		History.discardedStates = {};
  
  		/**
  		 * History.discardState(State)
  		 * Discards the state by ignoring it through History
  		 * @param {object} State
  		 * @return {true}
  		 */
  		History.discardState = function(discardedState,forwardState,backState){
  			//History.debug('History.discardState', arguments);
  			// Prepare
  			var discardedStateHash = History.getHashByState(discardedState),
  				discardObject;
  
  			// Create Discard Object
  			discardObject = {
  				'discardedState': discardedState,
  				'backState': backState,
  				'forwardState': forwardState
  			};
  
  			// Add to DiscardedStates
  			History.discardedStates[discardedStateHash] = discardObject;
  
  			// Return true
  			return true;
  		};
  
  		/**
  		 * History.discardHash(hash)
  		 * Discards the hash by ignoring it through History
  		 * @param {string} hash
  		 * @return {true}
  		 */
  		History.discardHash = function(discardedHash,forwardState,backState){
  			//History.debug('History.discardState', arguments);
  			// Create Discard Object
  			var discardObject = {
  				'discardedHash': discardedHash,
  				'backState': backState,
  				'forwardState': forwardState
  			};
  
  			// Add to discardedHash
  			History.discardedHashes[discardedHash] = discardObject;
  
  			// Return true
  			return true;
  		};
  
  		/**
  		 * History.discardedState(State)
  		 * Checks to see if the state is discarded
  		 * @param {object} State
  		 * @return {bool}
  		 */
  		History.discardedState = function(State){
  			// Prepare
  			var StateHash = History.getHashByState(State),
  				discarded;
  
  			// Check
  			discarded = History.discardedStates[StateHash]||false;
  
  			// Return true
  			return discarded;
  		};
  
  		/**
  		 * History.discardedHash(hash)
  		 * Checks to see if the state is discarded
  		 * @param {string} State
  		 * @return {bool}
  		 */
  		History.discardedHash = function(hash){
  			// Check
  			var discarded = History.discardedHashes[hash]||false;
  
  			// Return true
  			return discarded;
  		};
  
  		/**
  		 * History.recycleState(State)
  		 * Allows a discarded state to be used again
  		 * @param {object} data
  		 * @param {string} title
  		 * @param {string} url
  		 * @return {true}
  		 */
  		History.recycleState = function(State){
  			//History.debug('History.recycleState', arguments);
  			// Prepare
  			var StateHash = History.getHashByState(State);
  
  			// Remove from DiscardedStates
  			if ( History.discardedState(State) ) {
  				delete History.discardedStates[StateHash];
  			}
  
  			// Return true
  			return true;
  		};
  
  
  		// ====================================================================
  		// HTML4 HashChange Support
  
  		if ( History.emulated.hashChange ) {
  			/*
  			 * We must emulate the HTML4 HashChange Support by manually checking for hash changes
  			 */
  
  			/**
  			 * History.hashChangeInit()
  			 * Init the HashChange Emulation
  			 */
  			History.hashChangeInit = function(){
  				// Define our Checker Function
  				History.checkerFunction = null;
  
  				// Define some variables that will help in our checker function
  				var lastDocumentHash = '',
  					iframeId, iframe,
  					lastIframeHash, checkerRunning,
  					startedWithHash = Boolean(History.getHash());
  
  				// Handle depending on the browser
  				if ( History.isInternetExplorer() ) {
  					// IE6 and IE7
  					// We need to use an iframe to emulate the back and forward buttons
  
  					// Create iFrame
  					iframeId = 'historyjs-iframe';
  					iframe = document.createElement('iframe');
  
  					// Adjust iFarme
  					// IE 6 requires iframe to have a src on HTTPS pages, otherwise it will throw a
  					// "This page contains both secure and nonsecure items" warning.
  					iframe.setAttribute('id', iframeId);
  					iframe.setAttribute('src', '#');
  					iframe.style.display = 'none';
  
  					// Append iFrame
  					document.body.appendChild(iframe);
  
  					// Create initial history entry
  					iframe.contentWindow.document.open();
  					iframe.contentWindow.document.close();
  
  					// Define some variables that will help in our checker function
  					lastIframeHash = '';
  					checkerRunning = false;
  
  					// Define the checker function
  					History.checkerFunction = function(){
  						// Check Running
  						if ( checkerRunning ) {
  							return false;
  						}
  
  						// Update Running
  						checkerRunning = true;
  
  						// Fetch
  						var
  							documentHash = History.getHash(),
  							iframeHash = History.getHash(iframe.contentWindow.document);
  
  						// The Document Hash has changed (application caused)
  						if ( documentHash !== lastDocumentHash ) {
  							// Equalise
  							lastDocumentHash = documentHash;
  
  							// Create a history entry in the iframe
  							if ( iframeHash !== documentHash ) {
  								//History.debug('hashchange.checker: iframe hash change', 'documentHash (new):', documentHash, 'iframeHash (old):', iframeHash);
  
  								// Equalise
  								lastIframeHash = iframeHash = documentHash;
  
  								// Create History Entry
  								iframe.contentWindow.document.open();
  								iframe.contentWindow.document.close();
  
  								// Update the iframe's hash
  								iframe.contentWindow.document.location.hash = History.escapeHash(documentHash);
  							}
  
  							// Trigger Hashchange Event
  							History.Adapter.trigger(window,'hashchange');
  						}
  
  						// The iFrame Hash has changed (back button caused)
  						else if ( iframeHash !== lastIframeHash ) {
  							//History.debug('hashchange.checker: iframe hash out of sync', 'iframeHash (new):', iframeHash, 'documentHash (old):', documentHash);
  
  							// Equalise
  							lastIframeHash = iframeHash;
  							
  							// If there is no iframe hash that means we're at the original
  							// iframe state.
  							// And if there was a hash on the original request, the original
  							// iframe state was replaced instantly, so skip this state and take
  							// the user back to where they came from.
  							if (startedWithHash && iframeHash === '') {
  								History.back();
  							}
  							else {
  								// Update the Hash
  								History.setHash(iframeHash,false);
  							}
  						}
  
  						// Reset Running
  						checkerRunning = false;
  
  						// Return true
  						return true;
  					};
  				}
  				else {
  					// We are not IE
  					// Firefox 1 or 2, Opera
  
  					// Define the checker function
  					History.checkerFunction = function(){
  						// Prepare
  						var documentHash = History.getHash()||'';
  
  						// The Document Hash has changed (application caused)
  						if ( documentHash !== lastDocumentHash ) {
  							// Equalise
  							lastDocumentHash = documentHash;
  
  							// Trigger Hashchange Event
  							History.Adapter.trigger(window,'hashchange');
  						}
  
  						// Return true
  						return true;
  					};
  				}
  
  				// Apply the checker function
  				History.intervalList.push(setInterval(History.checkerFunction, History.options.hashChangeInterval));
  
  				// Done
  				return true;
  			}; // History.hashChangeInit
  
  			// Bind hashChangeInit
  			History.Adapter.onDomLoad(History.hashChangeInit);
  
  		} // History.emulated.hashChange
  
  
  		// ====================================================================
  		// HTML5 State Support
  
  		// Non-Native pushState Implementation
  		if ( History.emulated.pushState ) {
  			/*
  			 * We must emulate the HTML5 State Management by using HTML4 HashChange
  			 */
  
  			/**
  			 * History.onHashChange(event)
  			 * Trigger HTML5's window.onpopstate via HTML4 HashChange Support
  			 */
  			History.onHashChange = function(event){
  				//History.debug('History.onHashChange', arguments);
  
  				// Prepare
  				var currentUrl = ((event && event.newURL) || History.getLocationHref()),
  					currentHash = History.getHashByUrl(currentUrl),
  					currentState = null,
  					currentStateHash = null,
  					currentStateHashExits = null,
  					discardObject;
  
  				// Check if we are the same state
  				if ( History.isLastHash(currentHash) ) {
  					// There has been no change (just the page's hash has finally propagated)
  					//History.debug('History.onHashChange: no change');
  					History.busy(false);
  					return false;
  				}
  
  				// Reset the double check
  				History.doubleCheckComplete();
  
  				// Store our location for use in detecting back/forward direction
  				History.saveHash(currentHash);
  
  				// Expand Hash
  				if ( currentHash && History.isTraditionalAnchor(currentHash) ) {
  					//History.debug('History.onHashChange: traditional anchor', currentHash);
  					// Traditional Anchor Hash
  					History.Adapter.trigger(window,'anchorchange');
  					History.busy(false);
  					return false;
  				}
  
  				// Create State
  				currentState = History.extractState(History.getFullUrl(currentHash||History.getLocationHref()),true);
  
  				// Check if we are the same state
  				if ( History.isLastSavedState(currentState) ) {
  					//History.debug('History.onHashChange: no change');
  					// There has been no change (just the page's hash has finally propagated)
  					History.busy(false);
  					return false;
  				}
  
  				// Create the state Hash
  				currentStateHash = History.getHashByState(currentState);
  
  				// Check if we are DiscardedState
  				discardObject = History.discardedState(currentState);
  				if ( discardObject ) {
  					// Ignore this state as it has been discarded and go back to the state before it
  					if ( History.getHashByIndex(-2) === History.getHashByState(discardObject.forwardState) ) {
  						// We are going backwards
  						//History.debug('History.onHashChange: go backwards');
  						History.back(false);
  					} else {
  						// We are going forwards
  						//History.debug('History.onHashChange: go forwards');
  						History.forward(false);
  					}
  					return false;
  				}
  
  				// Push the new HTML5 State
  				//History.debug('History.onHashChange: success hashchange');
  				History.pushState(currentState.data,currentState.title,encodeURI(currentState.url),false);
  
  				// End onHashChange closure
  				return true;
  			};
  			History.Adapter.bind(window,'hashchange',History.onHashChange);
  
  			/**
  			 * History.pushState(data,title,url)
  			 * Add a new State to the history object, become it, and trigger onpopstate
  			 * We have to trigger for HTML4 compatibility
  			 * @param {object} data
  			 * @param {string} title
  			 * @param {string} url
  			 * @return {true}
  			 */
  			History.pushState = function(data,title,url,queue){
  				//History.debug('History.pushState: called', arguments);
  
  				// We assume that the URL passed in is URI-encoded, but this makes
  				// sure that it's fully URI encoded; any '%'s that are encoded are
  				// converted back into '%'s
  				url = encodeURI(url).replace(/%25/g, "%");
  
  				// Check the State
  				if ( History.getHashByUrl(url) ) {
  					throw new Error('History.js does not support states with fragment-identifiers (hashes/anchors).');
  				}
  
  				// Handle Queueing
  				if ( queue !== false && History.busy() ) {
  					// Wait + Push to Queue
  					//History.debug('History.pushState: we must wait', arguments);
  					History.pushQueue({
  						scope: History,
  						callback: History.pushState,
  						args: arguments,
  						queue: queue
  					});
  					return false;
  				}
  
  				// Make Busy
  				History.busy(true);
  
  				// Fetch the State Object
  				var newState = History.createStateObject(data,title,url),
  					newStateHash = History.getHashByState(newState),
  					oldState = History.getState(false),
  					oldStateHash = History.getHashByState(oldState),
  					html4Hash = History.getHash(),
  					wasExpected = History.expectedStateId == newState.id;
  
  				// Store the newState
  				History.storeState(newState);
  				History.expectedStateId = newState.id;
  
  				// Recycle the State
  				History.recycleState(newState);
  
  				// Force update of the title
  				History.setTitle(newState);
  
  				// Check if we are the same State
  				if ( newStateHash === oldStateHash ) {
  					//History.debug('History.pushState: no change', newStateHash);
  					History.busy(false);
  					return false;
  				}
  
  				// Update HTML5 State
  				History.saveState(newState);
  
  				// Fire HTML5 Event
  				if(!wasExpected)
  					History.Adapter.trigger(window,'statechange');
  
  				// Update HTML4 Hash
  				if ( !History.isHashEqual(newStateHash, html4Hash) && !History.isHashEqual(newStateHash, History.getShortUrl(History.getLocationHref())) ) {
  					History.setHash(newStateHash,false);
  				}
  				
  				History.busy(false);
  
  				// End pushState closure
  				return true;
  			};
  
  			/**
  			 * History.replaceState(data,title,url)
  			 * Replace the State and trigger onpopstate
  			 * We have to trigger for HTML4 compatibility
  			 * @param {object} data
  			 * @param {string} title
  			 * @param {string} url
  			 * @return {true}
  			 */
  			History.replaceState = function(data,title,url,queue){
  				//History.debug('History.replaceState: called', arguments);
  
  				// We assume that the URL passed in is URI-encoded, but this makes
  				// sure that it's fully URI encoded; any '%'s that are encoded are
  				// converted back into '%'s
  				url = encodeURI(url).replace(/%25/g, "%");
  
  				// Check the State
  				if ( History.getHashByUrl(url) ) {
  					throw new Error('History.js does not support states with fragment-identifiers (hashes/anchors).');
  				}
  
  				// Handle Queueing
  				if ( queue !== false && History.busy() ) {
  					// Wait + Push to Queue
  					//History.debug('History.replaceState: we must wait', arguments);
  					History.pushQueue({
  						scope: History,
  						callback: History.replaceState,
  						args: arguments,
  						queue: queue
  					});
  					return false;
  				}
  
  				// Make Busy
  				History.busy(true);
  
  				// Fetch the State Objects
  				var newState        = History.createStateObject(data,title,url),
  					newStateHash = History.getHashByState(newState),
  					oldState        = History.getState(false),
  					oldStateHash = History.getHashByState(oldState),
  					previousState   = History.getStateByIndex(-2);
  
  				// Discard Old State
  				History.discardState(oldState,newState,previousState);
  
  				// If the url hasn't changed, just store and save the state
  				// and fire a statechange event to be consistent with the
  				// html 5 api
  				if ( newStateHash === oldStateHash ) {
  					// Store the newState
  					History.storeState(newState);
  					History.expectedStateId = newState.id;
  	
  					// Recycle the State
  					History.recycleState(newState);
  	
  					// Force update of the title
  					History.setTitle(newState);
  					
  					// Update HTML5 State
  					History.saveState(newState);
  
  					// Fire HTML5 Event
  					//History.debug('History.pushState: trigger popstate');
  					History.Adapter.trigger(window,'statechange');
  					History.busy(false);
  				}
  				else {
  					// Alias to PushState
  					History.pushState(newState.data,newState.title,newState.url,false);
  				}
  
  				// End replaceState closure
  				return true;
  			};
  
  		} // History.emulated.pushState
  
  
  
  		// ====================================================================
  		// Initialise
  
  		// Non-Native pushState Implementation
  		if ( History.emulated.pushState ) {
  			/**
  			 * Ensure initial state is handled correctly
  			 */
  			if ( History.getHash() && !History.emulated.hashChange ) {
  				History.Adapter.onDomLoad(function(){
  					History.Adapter.trigger(window,'hashchange');
  				});
  			}
  
  		} // History.emulated.pushState
  
  	}; // History.initHtml4
  
  	// Try to Initialise History
  	if ( typeof History.init !== 'undefined' ) {
  		History.init();
  	}
  
  })(window);
  /**
   * History.js Core
   * @author Benjamin Arthur Lupton <contact@balupton.com>
   * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
   * @license New BSD License <http://creativecommons.org/licenses/BSD/>
   */
  
  (function(window,undefined){
  	"use strict";
  
  	// ========================================================================
  	// Initialise
  
  	// Localise Globals
  	var
  		console = window.console||undefined, // Prevent a JSLint complain
  		document = window.document, // Make sure we are using the correct document
  		navigator = window.navigator, // Make sure we are using the correct navigator
  		sessionStorage = window.sessionStorage||false, // sessionStorage
  		setTimeout = window.setTimeout,
  		clearTimeout = window.clearTimeout,
  		setInterval = window.setInterval,
  		clearInterval = window.clearInterval,
  		JSON = window.JSON,
  		alert = window.alert,
  		History = window.History = window.History||{}, // Public History Object
  		history = window.history; // Old History Object
  
  	try {
  		sessionStorage.setItem('TEST', '1');
  		sessionStorage.removeItem('TEST');
  	} catch(e) {
  		sessionStorage = false;
  	}
  
  	// MooTools Compatibility
  	JSON.stringify = JSON.stringify||JSON.encode;
  	JSON.parse = JSON.parse||JSON.decode;
  
  	// Check Existence
  	if ( typeof History.init !== 'undefined' ) {
  		throw new Error('History.js Core has already been loaded...');
  	}
  
  	// Initialise History
  	History.init = function(options){
  		// Check Load Status of Adapter
  		if ( typeof History.Adapter === 'undefined' ) {
  			return false;
  		}
  
  		// Check Load Status of Core
  		if ( typeof History.initCore !== 'undefined' ) {
  			History.initCore();
  		}
  
  		// Check Load Status of HTML4 Support
  		if ( typeof History.initHtml4 !== 'undefined' ) {
  			History.initHtml4();
  		}
  
  		// Return true
  		return true;
  	};
  
  
  	// ========================================================================
  	// Initialise Core
  
  	// Initialise Core
  	History.initCore = function(options){
  		// Initialise
  		if ( typeof History.initCore.initialized !== 'undefined' ) {
  			// Already Loaded
  			return false;
  		}
  		else {
  			History.initCore.initialized = true;
  		}
  
  
  		// ====================================================================
  		// Options
  
  		/**
  		 * History.options
  		 * Configurable options
  		 */
  		History.options = History.options||{};
  
  		/**
  		 * History.options.hashChangeInterval
  		 * How long should the interval be before hashchange checks
  		 */
  		History.options.hashChangeInterval = History.options.hashChangeInterval || 100;
  
  		/**
  		 * History.options.safariPollInterval
  		 * How long should the interval be before safari poll checks
  		 */
  		History.options.safariPollInterval = History.options.safariPollInterval || 500;
  
  		/**
  		 * History.options.doubleCheckInterval
  		 * How long should the interval be before we perform a double check
  		 */
  		History.options.doubleCheckInterval = History.options.doubleCheckInterval || 500;
  
  		/**
  		 * History.options.disableSuid
  		 * Force History not to append suid
  		 */
  		History.options.disableSuid = History.options.disableSuid || true;
  
  		/**
  		 * History.options.storeInterval
  		 * How long should we wait between store calls
  		 */
  		History.options.storeInterval = History.options.storeInterval || 1000;
  
  		/**
  		 * History.options.busyDelay
  		 * How long should we wait between busy events
  		 */
  		History.options.busyDelay = History.options.busyDelay || 250;
  
  		/**
  		 * History.options.debug
  		 * If true will enable debug messages to be logged
  		 */
  		History.options.debug = History.options.debug || false;
  
  		/**
  		 * History.options.initialTitle
  		 * What is the title of the initial state
  		 */
  		History.options.initialTitle = History.options.initialTitle || document.title;
  
  		/**
  		 * History.options.html4Mode
  		 * If true, will force HTMl4 mode (hashtags)
  		 */
  		History.options.html4Mode = History.options.html4Mode || false;
  
  		/**
  		 * History.options.delayInit
  		 * Want to override default options and call init manually.
  		 */
  		History.options.delayInit = History.options.delayInit || false;
  
  
  		// ====================================================================
  		// Interval record
  
  		/**
  		 * History.intervalList
  		 * List of intervals set, to be cleared when document is unloaded.
  		 */
  		History.intervalList = [];
  
  		/**
  		 * History.clearAllIntervals
  		 * Clears all setInterval instances.
  		 */
  		History.clearAllIntervals = function(){
  			var i, il = History.intervalList;
  			if (typeof il !== "undefined" && il !== null) {
  				for (i = 0; i < il.length; i++) {
  					clearInterval(il[i]);
  				}
  				History.intervalList = null;
  			}
  		};
  
  
  		// ====================================================================
  		// Debug
  
  		/**
  		 * History.debug(message,...)
  		 * Logs the passed arguments if debug enabled
  		 */
  		History.debug = function(){
  			if ( (History.options.debug||false) ) {
  				History.log.apply(History,arguments);
  			}
  		};
  
  		/**
  		 * History.log(message,...)
  		 * Logs the passed arguments
  		 */
  		History.log = function(){
  			// Prepare
  			var
  				consoleExists = !(typeof console === 'undefined' || typeof console.log === 'undefined' || typeof console.log.apply === 'undefined'),
  				textarea = document.getElementById('log'),
  				message,
  				i,n,
  				args,arg
  				;
  
  			// Write to Console
  			if ( consoleExists ) {
  				args = Array.prototype.slice.call(arguments);
  				message = args.shift();
  				if ( typeof console.debug !== 'undefined' ) {
  					console.debug.apply(console,[message,args]);
  				}
  				else {
  					console.log.apply(console,[message,args]);
  				}
  			}
  			else {
  				message = ("\n"+arguments[0]+"\n");
  			}
  
  			// Write to log
  			for ( i=1,n=arguments.length; i<n; ++i ) {
  				arg = arguments[i];
  				if ( typeof arg === 'object' && typeof JSON !== 'undefined' ) {
  					try {
  						arg = JSON.stringify(arg);
  					}
  					catch ( Exception ) {
  						// Recursive Object
  					}
  				}
  				message += "\n"+arg+"\n";
  			}
  
  			// Textarea
  			if ( textarea ) {
  				textarea.value += message+"\n-----\n";
  				textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
  			}
  			// No Textarea, No Console
  			else if ( !consoleExists ) {
  				alert(message);
  			}
  
  			// Return true
  			return true;
  		};
  
  
  		// ====================================================================
  		// Emulated Status
  
  		/**
  		 * History.getInternetExplorerMajorVersion()
  		 * Get's the major version of Internet Explorer
  		 * @return {integer}
  		 * @license Public Domain
  		 * @author Benjamin Arthur Lupton <contact@balupton.com>
  		 * @author James Padolsey <https://gist.github.com/527683>
  		 */
  		History.getInternetExplorerMajorVersion = function(){
  			var result = History.getInternetExplorerMajorVersion.cached =
  					(typeof History.getInternetExplorerMajorVersion.cached !== 'undefined')
  				?	History.getInternetExplorerMajorVersion.cached
  				:	(function(){
  						var v = 3,
  								div = document.createElement('div'),
  								all = div.getElementsByTagName('i');
  						while ( (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->') && all[0] ) {}
  						return (v > 4) ? v : false;
  					})()
  				;
  			return result;
  		};
  
  		/**
  		 * History.isInternetExplorer()
  		 * Are we using Internet Explorer?
  		 * @return {boolean}
  		 * @license Public Domain
  		 * @author Benjamin Arthur Lupton <contact@balupton.com>
  		 */
  		History.isInternetExplorer = function(){
  			var result =
  				History.isInternetExplorer.cached =
  				(typeof History.isInternetExplorer.cached !== 'undefined')
  					?	History.isInternetExplorer.cached
  					:	Boolean(History.getInternetExplorerMajorVersion())
  				;
  			return result;
  		};
  
  		/**
  		 * History.emulated
  		 * Which features require emulating?
  		 */
  
  		if (History.options.html4Mode) {
  			History.emulated = {
  				pushState : true,
  				hashChange: true
  			};
  		}
  
  		else {
  
  			History.emulated = {
  				pushState: !Boolean(
  					window.history && window.history.pushState && window.history.replaceState
  					&& !(
  						(/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i).test(navigator.userAgent) /* disable for versions of iOS before version 4.3 (8F190) */
  						|| (/AppleWebKit\/5([0-2]|3[0-2])/i).test(navigator.userAgent) /* disable for the mercury iOS browser, or at least older versions of the webkit engine */
  					)
  				),
  				hashChange: Boolean(
  					!(('onhashchange' in window) || ('onhashchange' in document))
  					||
  					(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8)
  				)
  			};
  		}
  
  		/**
  		 * History.enabled
  		 * Is History enabled?
  		 */
  		History.enabled = !History.emulated.pushState;
  
  		/**
  		 * History.bugs
  		 * Which bugs are present
  		 */
  		History.bugs = {
  			/**
  			 * Safari 5 and Safari iOS 4 fail to return to the correct state once a hash is replaced by a `replaceState` call
  			 * https://bugs.webkit.org/show_bug.cgi?id=56249
  			 */
  			setHash: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),
  
  			/**
  			 * Safari 5 and Safari iOS 4 sometimes fail to apply the state change under busy conditions
  			 * https://bugs.webkit.org/show_bug.cgi?id=42940
  			 */
  			safariPoll: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)),
  
  			/**
  			 * MSIE 6 and 7 sometimes do not apply a hash even it was told to (requiring a second call to the apply function)
  			 */
  			ieDoubleCheck: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8),
  
  			/**
  			 * MSIE 6 requires the entire hash to be encoded for the hashes to trigger the onHashChange event
  			 */
  			hashEscape: Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 7)
  		};
  
  		/**
  		 * History.isEmptyObject(obj)
  		 * Checks to see if the Object is Empty
  		 * @param {Object} obj
  		 * @return {boolean}
  		 */
  		History.isEmptyObject = function(obj) {
  			for ( var name in obj ) {
  				if ( obj.hasOwnProperty(name) ) {
  					return false;
  				}
  			}
  			return true;
  		};
  
  		/**
  		 * History.cloneObject(obj)
  		 * Clones a object and eliminate all references to the original contexts
  		 * @param {Object} obj
  		 * @return {Object}
  		 */
  		History.cloneObject = function(obj) {
  			var hash,newObj;
  			if ( obj ) {
  				hash = JSON.stringify(obj);
  				newObj = JSON.parse(hash);
  			}
  			else {
  				newObj = {};
  			}
  			return newObj;
  		};
  
  
  		// ====================================================================
  		// URL Helpers
  
  		/**
  		 * History.getRootUrl()
  		 * Turns "../../mysite.com/dir/page.html@asd" into "../../mysite.com"
  		 * @return {String} rootUrl
  		 */
  		History.getRootUrl = function(){
  			// Create
  			var rootUrl = document.location.protocol+'//'+(document.location.hostname||document.location.host);
  			if ( document.location.port||false ) {
  				rootUrl += ':'+document.location.port;
  			}
  			rootUrl += '../default.htm';
  
  			// Return
  			return rootUrl;
  		};
  
  		/**
  		 * History.getBaseHref()
  		 * Fetches the `href` attribute of the `<base >` element if it exists
  		 * @return {String} baseHref
  		 */
  		History.getBaseHref = function(){
  			// Create
  			var
  				baseElements = document.getElementsByTagName('base'),
  				baseElement = null,
  				baseHref = '';
  
  			// Test for Base Element
  			if ( baseElements.length === 1 ) {
  				// Prepare for Base Element
  				baseElement = baseElements[0];
  				baseHref = baseElement.href.replace(/[^\/]+$/,'');
  			}
  
  			// Adjust trailing slash
  			baseHref = baseHref.replace(/\/+$/,'');
  			if ( baseHref ) baseHref += '../';
  
  			// Return
  			return baseHref;
  		};
  
  		/**
  		 * History.getBaseUrl()
  		 * Fetches the baseHref or basePageUrl or rootUrl (whichever one exists first)
  		 * @return {String} baseUrl
  		 */
  		History.getBaseUrl = function(){
  			// Create
  			var baseUrl = History.getBaseHref()||History.getBasePageUrl()||History.getRootUrl();
  
  			// Return
  			return baseUrl;
  		};
  
  		/**
  		 * History.getPageUrl()
  		 * Fetches the URL of the current page
  		 * @return {String} pageUrl
  		 */
  		History.getPageUrl = function(){
  			// Fetch
  			var
  				State = History.getState(false,false),
  				stateUrl = (State||{}).url||History.getLocationHref(),
  				pageUrl;
  
  			// Create
  			pageUrl = stateUrl.replace(/\/+$/,'').replace(/[^\/]+$/,function(part,index,string){
  				return (/\./).test(part) ? part : part+'../default.htm';
  			});
  
  			// Return
  			return pageUrl;
  		};
  
  		/**
  		 * History.getBasePageUrl()
  		 * Fetches the Url of the directory of the current page
  		 * @return {String} basePageUrl
  		 */
  		History.getBasePageUrl = function(){
  			// Create
  			var basePageUrl = (History.getLocationHref()).replace(/[#\?].*/,'').replace(/[^\/]+$/,function(part,index,string){
  				return (/[^\/]$/).test(part) ? '' : part;
  			}).replace(/\/+$/,'')+'../default.htm';
  
  			// Return
  			return basePageUrl;
  		};
  
  		/**
  		 * History.getFullUrl(url)
  		 * Ensures that we have an absolute URL and not a relative URL
  		 * @param {string} url
  		 * @param {Boolean} allowBaseHref
  		 * @return {string} fullUrl
  		 */
  		History.getFullUrl = function(url,allowBaseHref){
  			// Prepare
  			var fullUrl = url, firstChar = url.substring(0,1);
  			allowBaseHref = (typeof allowBaseHref === 'undefined') ? true : allowBaseHref;
  
  			// Check
  			if ( /[a-z]+\:\/\//.test(url) ) {
  				// Full URL
  			}
  			else if ( firstChar === '../default.htm' ) {
  				// Root URL
  				fullUrl = History.getRootUrl()+url.replace(/^\/+/,'');
  			}
  			else if ( firstChar === '#' ) {
  				// Anchor URL
  				fullUrl = History.getPageUrl().replace(/#.*/,'')+url;
  			}
  			else if ( firstChar === '?' ) {
  				// Query URL
  				fullUrl = History.getPageUrl().replace(/[\?#].*/,'')+url;
  			}
  			else {
  				// Relative URL
  				if ( allowBaseHref ) {
  					fullUrl = History.getBaseUrl()+url.replace(/^(\.\/)+/,'');
  				} else {
  					fullUrl = History.getBasePageUrl()+url.replace(/^(\.\/)+/,'');
  				}
  				// We have an if condition above as we do not want hashes
  				// which are relative to the baseHref in our URLs
  				// as if the baseHref changes, then all our bookmarks
  				// would now point to different locations
  				// whereas the basePageUrl will always stay the same
  			}
  
  			// Return
  			return fullUrl.replace(/\#$/,'');
  		};
  
  		/**
  		 * History.getShortUrl(url)
  		 * Ensures that we have a relative URL and not a absolute URL
  		 * @param {string} url
  		 * @return {string} url
  		 */
  		History.getShortUrl = function(url){
  			// Prepare
  			var shortUrl = url, baseUrl = History.getBaseUrl(), rootUrl = History.getRootUrl();
  
  			// Trim baseUrl
  			if ( History.emulated.pushState ) {
  				// We are in a if statement as when pushState is not emulated
  				// The actual url these short urls are relative to can change
  				// So within the same session, we the url may end up somewhere different
  				shortUrl = shortUrl.replace(baseUrl,'');
  			}
  
  			// Trim rootUrl
  			shortUrl = shortUrl.replace(rootUrl,'/');
  
  			// Ensure we can still detect it as a state
  			if ( History.isTraditionalAnchor(shortUrl) ) {
  				shortUrl = './'+shortUrl;
  			}
  
  			// Clean It
  			shortUrl = shortUrl.replace(/^(\.\/)+/g,'default.htm').replace(/\#$/,'');
  
  			// Return
  			return shortUrl;
  		};
  
  		/**
  		 * History.getLocationHref(document)
  		 * Returns a normalized version of document.location.href
  		 * accounting for browser inconsistencies, etc.
  		 *
  		 * This URL will be URI-encoded and will include the hash
  		 *
  		 * @param {object} document
  		 * @return {string} url
  		 */
  		History.getLocationHref = function(doc) {
  			doc = doc || document;
  
  			// most of the time, this will be true
  			if (doc.URL === doc.location.href)
  				return doc.location.href;
  
  			// some versions of webkit URI-decode document.location.href
  			// but they leave document.URL in an encoded state
  			if (doc.location.href === decodeURIComponent(doc.URL))
  				return doc.URL;
  
  			// FF 3.6 only updates document.URL when a page is reloaded
  			// document.location.href is updated correctly
  			if (doc.location.hash && decodeURIComponent(doc.location.href.replace(/^[^#]+/, "")) === doc.location.hash)
  				return doc.location.href;
  
  			if (doc.URL.indexOf('#') == -1 && doc.location.href.indexOf('#') != -1)
  				return doc.location.href;
  			
  			return doc.URL || doc.location.href;
  		};
  
  
  		// ====================================================================
  		// State Storage
  
  		/**
  		 * History.store
  		 * The store for all session specific data
  		 */
  		History.store = {};
  
  		/**
  		 * History.idToState
  		 * 1-1: State ID to State Object
  		 */
  		History.idToState = History.idToState||{};
  
  		/**
  		 * History.stateToId
  		 * 1-1: State String to State ID
  		 */
  		History.stateToId = History.stateToId||{};
  
  		/**
  		 * History.urlToId
  		 * 1-1: State URL to State ID
  		 */
  		History.urlToId = History.urlToId||{};
  
  		/**
  		 * History.storedStates
  		 * Store the states in an array
  		 */
  		History.storedStates = History.storedStates||[];
  
  		/**
  		 * History.savedStates
  		 * Saved the states in an array
  		 */
  		History.savedStates = History.savedStates||[];
  
  		/**
  		 * History.noramlizeStore()
  		 * Noramlize the store by adding necessary values
  		 */
  		History.normalizeStore = function(){
  			History.store.idToState = History.store.idToState||{};
  			History.store.urlToId = History.store.urlToId||{};
  			History.store.stateToId = History.store.stateToId||{};
  		};
  
  		/**
  		 * History.getState()
  		 * Get an object containing the data, title and url of the current state
  		 * @param {Boolean} friendly
  		 * @param {Boolean} create
  		 * @return {Object} State
  		 */
  		History.getState = function(friendly,create){
  			// Prepare
  			if ( typeof friendly === 'undefined' ) { friendly = true; }
  			if ( typeof create === 'undefined' ) { create = true; }
  
  			// Fetch
  			var State = History.getLastSavedState();
  
  			// Create
  			if ( !State && create ) {
  				State = History.createStateObject();
  			}
  
  			// Adjust
  			if ( friendly ) {
  				State = History.cloneObject(State);
  				State.url = State.cleanUrl||State.url;
  			}
  
  			// Return
  			return State;
  		};
  
  		/**
  		 * History.getIdByState(State)
  		 * Gets a ID for a State
  		 * @param {State} newState
  		 * @return {String} id
  		 */
  		History.getIdByState = function(newState){
  
  			// Fetch ID
  			var id = History.extractId(newState.url),
  				str;
  
  			if ( !id ) {
  				// Find ID via State String
  				str = History.getStateString(newState);
  				if ( typeof History.stateToId[str] !== 'undefined' ) {
  					id = History.stateToId[str];
  				}
  				else if ( typeof History.store.stateToId[str] !== 'undefined' ) {
  					id = History.store.stateToId[str];
  				}
  				else {
  					// Generate a new ID
  					while ( true ) {
  						id = (new Date()).getTime() + String(Math.random()).replace(/\D/g,'');
  						if ( typeof History.idToState[id] === 'undefined' && typeof History.store.idToState[id] === 'undefined' ) {
  							break;
  						}
  					}
  
  					// Apply the new State to the ID
  					History.stateToId[str] = id;
  					History.idToState[id] = newState;
  				}
  			}
  
  			// Return ID
  			return id;
  		};
  
  		/**
  		 * History.normalizeState(State)
  		 * Expands a State Object
  		 * @param {object} State
  		 * @return {object}
  		 */
  		History.normalizeState = function(oldState){
  			// Variables
  			var newState, dataNotEmpty;
  
  			// Prepare
  			if ( !oldState || (typeof oldState !== 'object') ) {
  				oldState = {};
  			}
  
  			// Check
  			if ( typeof oldState.normalized !== 'undefined' ) {
  				return oldState;
  			}
  
  			// Adjust
  			if ( !oldState.data || (typeof oldState.data !== 'object') ) {
  				oldState.data = {};
  			}
  
  			// ----------------------------------------------------------------
  
  			// Create
  			newState = {};
  			newState.normalized = true;
  			newState.title = oldState.title||'';
  			newState.url = History.getFullUrl(oldState.url?oldState.url:(History.getLocationHref()));
  			newState.hash = History.getShortUrl(newState.url);
  			newState.data = History.cloneObject(oldState.data);
  
  			// Fetch ID
  			newState.id = History.getIdByState(newState);
  
  			// ----------------------------------------------------------------
  
  			// Clean the URL
  			newState.cleanUrl = newState.url.replace(/\??\&_suid.*/,'');
              newState.cleanUrl = newState.cleanUrl.replace(/#.*?/,'');
  			newState.url = newState.cleanUrl;
  
  			// Check to see if we have more than just a url
  			dataNotEmpty = !History.isEmptyObject(newState.data);
  
  			// Apply
  			if ( (newState.title || dataNotEmpty) && History.options.disableSuid !== true ) {
  				// Add ID to Hash
  				newState.hash = History.getShortUrl(newState.url).replace(/\??\&_suid.*/,'');
  				if ( !/\?/.test(newState.hash) ) {
  					newState.hash += '?';
  				}
  				newState.hash += '&_suid='+newState.id;
  			}
  
  			// Create the Hashed URL
  			newState.hashedUrl = History.getFullUrl(newState.hash);
  
  			// ----------------------------------------------------------------
  
  			// Update the URL if we have a duplicate
  			if ( (History.emulated.pushState || History.bugs.safariPoll) && History.hasUrlDuplicate(newState) ) {
  				newState.url = newState.hashedUrl;
  			}
  
  			// ----------------------------------------------------------------
  
  			// Return
  			return newState;
  		};
  
  		/**
  		 * History.createStateObject(data,title,url)
  		 * Creates a object based on the data, title and url state params
  		 * @param {object} data
  		 * @param {string} title
  		 * @param {string} url
  		 * @return {object}
  		 */
  		History.createStateObject = function(data,title,url){
  			// Hashify
  			var State = {
  				'data': data,
  				'title': title,
  				'url': url
  			};
  
  			// Expand the State
  			State = History.normalizeState(State);
  
  			// Return object
  			return State;
  		};
  
  		/**
  		 * History.getStateById(id)
  		 * Get a state by it's UID
  		 * @param {String} id
  		 */
  		History.getStateById = function(id){
  			// Prepare
  			id = String(id);
  
  			// Retrieve
  			var State = History.idToState[id] || History.store.idToState[id] || undefined;
  
  			// Return State
  			return State;
  		};
  
  		/**
  		 * Get a State's String
  		 * @param {State} passedState
  		 */
  		History.getStateString = function(passedState){
  			// Prepare
  			var State, cleanedState, str;
  
  			// Fetch
  			State = History.normalizeState(passedState);
  
  			// Clean
  			cleanedState = {
  				data: State.data,
  				title: passedState.title,
  				url: passedState.url
  			};
  
  			// Fetch
  			str = JSON.stringify(cleanedState);
  
  			// Return
  			return str;
  		};
  
  		/**
  		 * Get a State's ID
  		 * @param {State} passedState
  		 * @return {String} id
  		 */
  		History.getStateId = function(passedState){
  			// Prepare
  			var State, id;
  
  			// Fetch
  			State = History.normalizeState(passedState);
  
  			// Fetch
  			id = State.id;
  
  			// Return
  			return id;
  		};
  
  		/**
  		 * History.getHashByState(State)
  		 * Creates a Hash for the State Object
  		 * @param {State} passedState
  		 * @return {String} hash
  		 */
  		History.getHashByState = function(passedState){
  			// Prepare
  			var State, hash;
  
  			// Fetch
  			State = History.normalizeState(passedState);
  
  			// Hash
  			hash = State.hash;
  
  			// Return
  			return hash;
  		};
  
  		/**
  		 * History.extractId(url_or_hash)
  		 * Get a State ID by it's URL or Hash
  		 * @param {string} url_or_hash
  		 * @return {string} id
  		 */
  		History.extractId = function ( url_or_hash ) {
  			// Prepare
  			var id,parts,url, tmp;
  
  			// Extract
  			
  			// If the URL has a #, use the id from before the #
  			if (url_or_hash.indexOf('#') != -1)
  			{
  				tmp = url_or_hash.split("#")[0];
  			}
  			else
  			{
  				tmp = url_or_hash;
  			}
  			
  			parts = /(.*)\&_suid=([0-9]+)$/.exec(tmp);
  			url = parts ? (parts[1]||url_or_hash) : url_or_hash;
  			id = parts ? String(parts[2]||'') : '';
  
  			// Return
  			return id||false;
  		};
  
  		/**
  		 * History.isTraditionalAnchor
  		 * Checks to see if the url is a traditional anchor or not
  		 * @param {String} url_or_hash
  		 * @return {Boolean}
  		 */
  		History.isTraditionalAnchor = function(url_or_hash){
  			// Check
  			var isTraditional = !(/[\/\?\.]/.test(url_or_hash));
  
  			// Return
  			return isTraditional;
  		};
  
  		/**
  		 * History.extractState
  		 * Get a State by it's URL or Hash
  		 * @param {String} url_or_hash
  		 * @return {State|null}
  		 */
  		History.extractState = function(url_or_hash,create){
  			// Prepare
  			var State = null, id, url;
  			create = create||false;
  
  			// Fetch SUID
  			id = History.extractId(url_or_hash);
  			if ( id ) {
  				State = History.getStateById(id);
  			}
  
  			// Fetch SUID returned no State
  			if ( !State ) {
  				// Fetch URL
  				url = History.getFullUrl(url_or_hash);
  
  				// Check URL
  				id = History.getIdByUrl(url)||false;
  				if ( id ) {
  					State = History.getStateById(id);
  				}
  
  				// Create State
  				if ( !State && create && !History.isTraditionalAnchor(url_or_hash) ) {
  					State = History.createStateObject(null,null,url);
  				}
  			}
  
  			// Return
  			return State;
  		};
  
  		/**
  		 * History.getIdByUrl()
  		 * Get a State ID by a State URL
  		 */
  		History.getIdByUrl = function(url){
  			// Fetch
  			var id = History.urlToId[url] || History.store.urlToId[url] || undefined;
  
  			// Return
  			return id;
  		};
  
  		/**
  		 * History.getLastSavedState()
  		 * Get an object containing the data, title and url of the current state
  		 * @return {Object} State
  		 */
  		History.getLastSavedState = function(){
  			return History.savedStates[History.savedStates.length-1]||undefined;
  		};
  
  		/**
  		 * History.getLastStoredState()
  		 * Get an object containing the data, title and url of the current state
  		 * @return {Object} State
  		 */
  		History.getLastStoredState = function(){
  			return History.storedStates[History.storedStates.length-1]||undefined;
  		};
  
  		/**
  		 * History.hasUrlDuplicate
  		 * Checks if a Url will have a url conflict
  		 * @param {Object} newState
  		 * @return {Boolean} hasDuplicate
  		 */
  		History.hasUrlDuplicate = function(newState) {
  			// Prepare
  			var hasDuplicate = false,
  				oldState;
  
  			// Fetch
  			oldState = History.extractState(newState.url);
  
  			// Check
  			hasDuplicate = oldState && oldState.id !== newState.id;
  
  			// Return
  			return hasDuplicate;
  		};
  
  		/**
  		 * History.storeState
  		 * Store a State
  		 * @param {Object} newState
  		 * @return {Object} newState
  		 */
  		History.storeState = function(newState){
  			// Store the State
  			History.urlToId[newState.url] = newState.id;
  
  			// Push the State
  			History.storedStates.push(History.cloneObject(newState));
  
  			// Return newState
  			return newState;
  		};
  
  		/**
  		 * History.isLastSavedState(newState)
  		 * Tests to see if the state is the last state
  		 * @param {Object} newState
  		 * @return {boolean} isLast
  		 */
  		History.isLastSavedState = function(newState){
  			// Prepare
  			var isLast = false,
  				newId, oldState, oldId;
  
  			// Check
  			if ( History.savedStates.length ) {
  				newId = newState.id;
  				oldState = History.getLastSavedState();
  				oldId = oldState.id;
  
  				// Check
  				isLast = (newId === oldId);
  			}
  
  			// Return
  			return isLast;
  		};
  
  		/**
  		 * History.saveState
  		 * Push a State
  		 * @param {Object} newState
  		 * @return {boolean} changed
  		 */
  		History.saveState = function(newState){
  			// Check Hash
  			if ( History.isLastSavedState(newState) ) {
  				return false;
  			}
  
  			// Push the State
  			History.savedStates.push(History.cloneObject(newState));
  
  			// Return true
  			return true;
  		};
  
  		/**
  		 * History.getStateByIndex()
  		 * Gets a state by the index
  		 * @param {integer} index
  		 * @return {Object}
  		 */
  		History.getStateByIndex = function(index){
  			// Prepare
  			var State = null;
  
  			// Handle
  			if ( typeof index === 'undefined' ) {
  				// Get the last inserted
  				State = History.savedStates[History.savedStates.length-1];
  			}
  			else if ( index < 0 ) {
  				// Get from the end
  				State = History.savedStates[History.savedStates.length+index];
  			}
  			else {
  				// Get from the beginning
  				State = History.savedStates[index];
  			}
  
  			// Return State
  			return State;
  		};
  		
  		/**
  		 * History.getCurrentIndex()
  		 * Gets the current index
  		 * @return (integer)
  		*/
  		History.getCurrentIndex = function(){
  			// Prepare
  			var index = null;
  			
  			// No states saved
  			if(History.savedStates.length < 1) {
  				index = 0;
  			}
  			else {
  				index = History.savedStates.length-1;
  			}
  			return index;
  		};
  
  		// ====================================================================
  		// Hash Helpers
  
  		/**
  		 * History.getHash()
  		 * @param {Location=} location
  		 * Gets the current document hash
  		 * Note: unlike location.hash, this is guaranteed to return the escaped hash in all browsers
  		 * @return {string}
  		 */
  		History.getHash = function(doc){
  			var url = History.getLocationHref(doc),
  				hash;
  			hash = History.getHashByUrl(url);
  			return hash;
  		};
  
  		/**
  		 * History.unescapeHash()
  		 * normalize and Unescape a Hash
  		 * @param {String} hash
  		 * @return {string}
  		 */
  		History.unescapeHash = function(hash){
  			// Prepare
  			var result = History.normalizeHash(hash);
  
  			// Unescape hash
  			result = decodeURIComponent(result);
  
  			// Return result
  			return result;
  		};
  
  		/**
  		 * History.normalizeHash()
  		 * normalize a hash across browsers
  		 * @return {string}
  		 */
  		History.normalizeHash = function(hash){
  			// Prepare
  			var result = hash.replace(/[^#]*#/,'').replace(/#.*/, '');
  
  			// Return result
  			return result;
  		};
  
  		/**
  		 * History.setHash(hash)
  		 * Sets the document hash
  		 * @param {string} hash
  		 * @return {History}
  		 */
  		History.setHash = function(hash,queue){
  			// Prepare
  			var State, pageUrl;
  
  			// Handle Queueing
  			if ( queue !== false && History.busy() ) {
  				// Wait + Push to Queue
  				//History.debug('History.setHash: we must wait', arguments);
  				History.pushQueue({
  					scope: History,
  					callback: History.setHash,
  					args: arguments,
  					queue: queue
  				});
  				return false;
  			}
  
  			// Log
  			//History.debug('History.setHash: called',hash);
  
  			// Make Busy + Continue
  			History.busy(true);
  
  			// Check if hash is a state
  			State = History.extractState(hash,true);
  			if ( State && !History.emulated.pushState ) {
  				// Hash is a state so skip the setHash
  				//History.debug('History.setHash: Hash is a state so skipping the hash set with a direct pushState call',arguments);
  
  				// PushState
  				History.pushState(State.data,State.title,State.url,false);
  			}
  			else if ( History.getHash() !== hash ) {
  				// Hash is a proper hash, so apply it
  
  				// Handle browser bugs
  				if ( History.bugs.setHash ) {
  					// Fix Safari Bug https://bugs.webkit.org/show_bug.cgi?id=56249
  
  					// Fetch the base page
  					pageUrl = History.getPageUrl();
  
  					// Safari hash apply
  					History.pushState(null,null,pageUrl+'#'+hash,false);
  				}
  				else {
  					// Normal hash apply
  					document.location.hash = hash;
  				}
  			}
  
  			// Chain
  			return History;
  		};
  
  		/**
  		 * History.escape()
  		 * normalize and Escape a Hash
  		 * @return {string}
  		 */
  		History.escapeHash = function(hash){
  			// Prepare
  			var result = History.normalizeHash(hash);
  
  			// Escape hash
  			result = window.encodeURIComponent(result);
  
  			// IE6 Escape Bug
  			if ( !History.bugs.hashEscape ) {
  				// Restore common parts
  				result = result
  					.replace(/\%21/g,'!')
  					.replace(/\%26/g,'&')
  					.replace(/\%3D/g,'=')
  					.replace(/\%3F/g,'?');
  			}
  
  			// Return result
  			return result;
  		};
  
  		/**
  		 * History.getHashByUrl(url)
  		 * Extracts the Hash from a URL
  		 * @param {string} url
  		 * @return {string} url
  		 */
  		History.getHashByUrl = function(url){
  			// Extract the hash
  			var hash = String(url)
  				.replace(/([^#]*)#?([^#]*)#?(.*)/, '$2')
  				;
  
  			// Unescape hash
  			hash = History.unescapeHash(hash);
  
  			// Return hash
  			return hash;
  		};
  
  		/**
  		 * History.setTitle(title)
  		 * Applies the title to the document
  		 * @param {State} newState
  		 * @return {Boolean}
  		 */
  		History.setTitle = function(newState){
  			// Prepare
  			var title = newState.title,
  				firstState;
  
  			// Initial
  			if ( !title ) {
  				firstState = History.getStateByIndex(0);
  				if ( firstState && firstState.url === newState.url ) {
  					title = firstState.title||History.options.initialTitle;
  				}
  			}
  
  			// Apply
  			try {
  				document.getElementsByTagName('title')[0].innerHTML = title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
  			}
  			catch ( Exception ) { }
  			document.title = title;
  
  			// Chain
  			return History;
  		};
  
  
  		// ====================================================================
  		// Queueing
  
  		/**
  		 * History.queues
  		 * The list of queues to use
  		 * First In, First Out
  		 */
  		History.queues = [];
  
  		/**
  		 * History.busy(value)
  		 * @param {boolean} value [optional]
  		 * @return {boolean} busy
  		 */
  		History.busy = function(value){
  			// Apply
  			if ( typeof value !== 'undefined' ) {
  				//History.debug('History.busy: changing ['+(History.busy.flag||false)+'] to ['+(value||false)+']', History.queues.length);
  				History.busy.flag = value;
  			}
  			// Default
  			else if ( typeof History.busy.flag === 'undefined' ) {
  				History.busy.flag = false;
  			}
  
  			// Queue
  			if ( !History.busy.flag ) {
  				// Execute the next item in the queue
  				clearTimeout(History.busy.timeout);
  				var fireNext = function(){
  					var i, queue, item;
  					if ( History.busy.flag ) return;
  					for ( i=History.queues.length-1; i >= 0; --i ) {
  						queue = History.queues[i];
  						if ( queue.length === 0 ) continue;
  						item = queue.shift();
  						History.fireQueueItem(item);
  						History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
  					}
  				};
  				History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
  			}
  
  			// Return
  			return History.busy.flag;
  		};
  
  		/**
  		 * History.busy.flag
  		 */
  		History.busy.flag = false;
  
  		/**
  		 * History.fireQueueItem(item)
  		 * Fire a Queue Item
  		 * @param {Object} item
  		 * @return {Mixed} result
  		 */
  		History.fireQueueItem = function(item){
  			return item.callback.apply(item.scope||History,item.args||[]);
  		};
  
  		/**
  		 * History.pushQueue(callback,args)
  		 * Add an item to the queue
  		 * @param {Object} item [scope,callback,args,queue]
  		 */
  		History.pushQueue = function(item){
  			// Prepare the queue
  			History.queues[item.queue||0] = History.queues[item.queue||0]||[];
  
  			// Add to the queue
  			History.queues[item.queue||0].push(item);
  
  			// Chain
  			return History;
  		};
  
  		/**
  		 * History.queue (item,queue), (func,queue), (func), (item)
  		 * Either firs the item now if not busy, or adds it to the queue
  		 */
  		History.queue = function(item,queue){
  			// Prepare
  			if ( typeof item === 'function' ) {
  				item = {
  					callback: item
  				};
  			}
  			if ( typeof queue !== 'undefined' ) {
  				item.queue = queue;
  			}
  
  			// Handle
  			if ( History.busy() ) {
  				History.pushQueue(item);
  			} else {
  				History.fireQueueItem(item);
  			}
  
  			// Chain
  			return History;
  		};
  
  		/**
  		 * History.clearQueue()
  		 * Clears the Queue
  		 */
  		History.clearQueue = function(){
  			History.busy.flag = false;
  			History.queues = [];
  			return History;
  		};
  
  
  		// ====================================================================
  		// IE Bug Fix
  
  		/**
  		 * History.stateChanged
  		 * States whether or not the state has changed since the last double check was initialised
  		 */
  		History.stateChanged = false;
  
  		/**
  		 * History.doubleChecker
  		 * Contains the timeout used for the double checks
  		 */
  		History.doubleChecker = false;
  
  		/**
  		 * History.doubleCheckComplete()
  		 * Complete a double check
  		 * @return {History}
  		 */
  		History.doubleCheckComplete = function(){
  			// Update
  			History.stateChanged = true;
  
  			// Clear
  			History.doubleCheckClear();
  
  			// Chain
  			return History;
  		};
  
  		/**
  		 * History.doubleCheckClear()
  		 * Clear a double check
  		 * @return {History}
  		 */
  		History.doubleCheckClear = function(){
  			// Clear
  			if ( History.doubleChecker ) {
  				clearTimeout(History.doubleChecker);
  				History.doubleChecker = false;
  			}
  
  			// Chain
  			return History;
  		};
  
  		/**
  		 * History.doubleCheck()
  		 * Create a double check
  		 * @return {History}
  		 */
  		History.doubleCheck = function(tryAgain){
  			// Reset
  			History.stateChanged = false;
  			History.doubleCheckClear();
  
  			// Fix IE6,IE7 bug where calling history.back or history.forward does not actually change the hash (whereas doing it manually does)
  			// Fix Safari 5 bug where sometimes the state does not change: https://bugs.webkit.org/show_bug.cgi?id=42940
  			if ( History.bugs.ieDoubleCheck ) {
  				// Apply Check
  				History.doubleChecker = setTimeout(
  					function(){
  						History.doubleCheckClear();
  						if ( !History.stateChanged ) {
  							//History.debug('History.doubleCheck: State has not yet changed, trying again', arguments);
  							// Re-Attempt
  							tryAgain();
  						}
  						return true;
  					},
  					History.options.doubleCheckInterval
  				);
  			}
  
  			// Chain
  			return History;
  		};
  
  
  		// ====================================================================
  		// Safari Bug Fix
  
  		/**
  		 * History.safariStatePoll()
  		 * Poll the current state
  		 * @return {History}
  		 */
  		History.safariStatePoll = function(){
  			// Poll the URL
  
  			// Get the Last State which has the new URL
  			var
  				urlState = History.extractState(History.getLocationHref()),
  				newState;
  
  			// Check for a difference
  			if ( !History.isLastSavedState(urlState) ) {
  				newState = urlState;
  			}
  			else {
  				return;
  			}
  
  			// Check if we have a state with that url
  			// If not create it
  			if ( !newState ) {
  				//History.debug('History.safariStatePoll: new');
  				newState = History.createStateObject();
  			}
  
  			// Apply the New State
  			//History.debug('History.safariStatePoll: trigger');
  			History.Adapter.trigger(window,'popstate');
  
  			// Chain
  			return History;
  		};
  
  
  		// ====================================================================
  		// State Aliases
  
  		/**
  		 * History.back(queue)
  		 * Send the browser history back one item
  		 * @param {Integer} queue [optional]
  		 */
  		History.back = function(queue){
  			//History.debug('History.back: called', arguments);
  
  			// Handle Queueing
  			if ( queue !== false && History.busy() ) {
  				// Wait + Push to Queue
  				//History.debug('History.back: we must wait', arguments);
  				History.pushQueue({
  					scope: History,
  					callback: History.back,
  					args: arguments,
  					queue: queue
  				});
  				return false;
  			}
  
  			// Make Busy + Continue
  			History.busy(true);
  
  			// Fix certain browser bugs that prevent the state from changing
  			History.doubleCheck(function(){
  				History.back(false);
  			});
  
  			// Go back
  			history.go(-1);
  
  			// End back closure
  			return true;
  		};
  
  		/**
  		 * History.forward(queue)
  		 * Send the browser history forward one item
  		 * @param {Integer} queue [optional]
  		 */
  		History.forward = function(queue){
  			//History.debug('History.forward: called', arguments);
  
  			// Handle Queueing
  			if ( queue !== false && History.busy() ) {
  				// Wait + Push to Queue
  				//History.debug('History.forward: we must wait', arguments);
  				History.pushQueue({
  					scope: History,
  					callback: History.forward,
  					args: arguments,
  					queue: queue
  				});
  				return false;
  			}
  
  			// Make Busy + Continue
  			History.busy(true);
  
  			// Fix certain browser bugs that prevent the state from changing
  			History.doubleCheck(function(){
  				History.forward(false);
  			});
  
  			// Go forward
  			history.go(1);
  
  			// End forward closure
  			return true;
  		};
  
  		/**
  		 * History.go(index,queue)
  		 * Send the browser history back or forward index times
  		 * @param {Integer} queue [optional]
  		 */
  		History.go = function(index,queue){
  			//History.debug('History.go: called', arguments);
  
  			// Prepare
  			var i;
  
  			// Handle
  			if ( index > 0 ) {
  				// Forward
  				for ( i=1; i<=index; ++i ) {
  					History.forward(queue);
  				}
  			}
  			else if ( index < 0 ) {
  				// Backward
  				for ( i=-1; i>=index; --i ) {
  					History.back(queue);
  				}
  			}
  			else {
  				throw new Error('History.go: History.go requires a positive or negative integer passed.');
  			}
  
  			// Chain
  			return History;
  		};
  
  
  		// ====================================================================
  		// HTML5 State Support
  
  		// Non-Native pushState Implementation
  		if ( History.emulated.pushState ) {
  			/*
  			 * Provide Skeleton for HTML4 Browsers
  			 */
  
  			// Prepare
  			var emptyFunction = function(){};
  			History.pushState = History.pushState||emptyFunction;
  			History.replaceState = History.replaceState||emptyFunction;
  		} // History.emulated.pushState
  
  		// Native pushState Implementation
  		else {
  			/*
  			 * Use native HTML5 History API Implementation
  			 */
  
  			/**
  			 * History.onPopState(event,extra)
  			 * Refresh the Current State
  			 */
  			History.onPopState = function(event,extra){
  				// Prepare
  				var stateId = false, newState = false, currentHash, currentState;
  
  				// Reset the double check
  				History.doubleCheckComplete();
  
  				// Check for a Hash, and handle apporiatly
  				currentHash = History.getHash();
  				if ( currentHash ) {
  					// Expand Hash
  					currentState = History.extractState(currentHash||History.getLocationHref(),true);
  					if ( currentState ) {
  						// We were able to parse it, it must be a State!
  						// Let's forward to replaceState
  						//History.debug('History.onPopState: state anchor', currentHash, currentState);
  						History.replaceState(currentState.data, currentState.title, currentState.url, false);
  					}
  					else {
  						// Traditional Anchor
  						//History.debug('History.onPopState: traditional anchor', currentHash);
  						History.Adapter.trigger(window,'anchorchange');
  						History.busy(false);
  					}
  
  					// We don't care for hashes
  					History.expectedStateId = false;
  					return false;
  				}
  
  				// Ensure
  				stateId = History.Adapter.extractEventData('state',event,extra) || false;
  
  				// Fetch State
  				if ( stateId ) {
  					// Vanilla: Back/forward button was used
  					newState = History.getStateById(stateId);
  				}
  				else if ( History.expectedStateId ) {
  					// Vanilla: A new state was pushed, and popstate was called manually
  					newState = History.getStateById(History.expectedStateId);
  				}
  				else {
  					// Initial State
  					newState = History.extractState(History.getLocationHref());
  				}
  
  				// The State did not exist in our store
  				if ( !newState ) {
  					// Regenerate the State
  					newState = History.createStateObject(null,null,History.getLocationHref());
  				}
  
  				// Clean
  				History.expectedStateId = false;
  
  				// Check if we are the same state
  				if ( History.isLastSavedState(newState) ) {
  					// There has been no change (just the page's hash has finally propagated)
  					//History.debug('History.onPopState: no change', newState, History.savedStates);
  					History.busy(false);
  					return false;
  				}
  
  				// Store the State
  				History.storeState(newState);
  				History.saveState(newState);
  
  				// Force update of the title
  				History.setTitle(newState);
  
  				// Fire Our Event
  				History.Adapter.trigger(window,'statechange');
  				History.busy(false);
  
  				// Return true
  				return true;
  			};
  			History.Adapter.bind(window,'popstate',History.onPopState);
  
  			/**
  			 * History.pushState(data,title,url)
  			 * Add a new State to the history object, become it, and trigger onpopstate
  			 * We have to trigger for HTML4 compatibility
  			 * @param {object} data
  			 * @param {string} title
  			 * @param {string} url
  			 * @return {true}
  			 */
  			History.pushState = function(data,title,url,queue){
  				//History.debug('History.pushState: called', arguments);
  
  				// Check the State
  				if ( History.getHashByUrl(url) && History.emulated.pushState ) {
  					throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
  				}
  
  				// Handle Queueing
  				if ( queue !== false && History.busy() ) {
  					// Wait + Push to Queue
  					//History.debug('History.pushState: we must wait', arguments);
  					History.pushQueue({
  						scope: History,
  						callback: History.pushState,
  						args: arguments,
  						queue: queue
  					});
  					return false;
  				}
  
  				// Make Busy + Continue
  				History.busy(true);
  
  				// Create the newState
  				var newState = History.createStateObject(data,title,url);
  
  				// Check it
  				if ( History.isLastSavedState(newState) ) {
  					// Won't be a change
  					History.busy(false);
  				}
  				else {
  					// Store the newState
  					History.storeState(newState);
  					History.expectedStateId = newState.id;
  
  					// Push the newState
  					history.pushState(newState.id,newState.title,newState.url);
  
  					// Fire HTML5 Event
  					History.Adapter.trigger(window,'popstate');
  				}
  
  				// End pushState closure
  				return true;
  			};
  
  			/**
  			 * History.replaceState(data,title,url)
  			 * Replace the State and trigger onpopstate
  			 * We have to trigger for HTML4 compatibility
  			 * @param {object} data
  			 * @param {string} title
  			 * @param {string} url
  			 * @return {true}
  			 */
  			History.replaceState = function(data,title,url,queue){
  				//History.debug('History.replaceState: called', arguments);
  
  				// Check the State
  				if ( History.getHashByUrl(url) && History.emulated.pushState ) {
  					throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
  				}
  
  				// Handle Queueing
  				if ( queue !== false && History.busy() ) {
  					// Wait + Push to Queue
  					//History.debug('History.replaceState: we must wait', arguments);
  					History.pushQueue({
  						scope: History,
  						callback: History.replaceState,
  						args: arguments,
  						queue: queue
  					});
  					return false;
  				}
  
  				// Make Busy + Continue
  				History.busy(true);
  
  				// Create the newState
  				var newState = History.createStateObject(data,title,url);
  
  				// Check it
  				if ( History.isLastSavedState(newState) ) {
  					// Won't be a change
  					History.busy(false);
  				}
  				else {
  					// Store the newState
  					History.storeState(newState);
  					History.expectedStateId = newState.id;
  
  					// Push the newState
  					history.replaceState(newState.id,newState.title,newState.url);
  
  					// Fire HTML5 Event
  					History.Adapter.trigger(window,'popstate');
  				}
  
  				// End replaceState closure
  				return true;
  			};
  
  		} // !History.emulated.pushState
  
  
  		// ====================================================================
  		// Initialise
  
  		/**
  		 * Load the Store
  		 */
  		if ( sessionStorage ) {
  			// Fetch
  			try {
  				History.store = JSON.parse(sessionStorage.getItem('History.store'))||{};
  			}
  			catch ( err ) {
  				History.store = {};
  			}
  
  			// Normalize
  			History.normalizeStore();
  		}
  		else {
  			// Default Load
  			History.store = {};
  			History.normalizeStore();
  		}
  
  		/**
  		 * Clear Intervals on exit to prevent memory leaks
  		 */
  		History.Adapter.bind(window,"unload",History.clearAllIntervals);
  
  		/**
  		 * Create the initial State
  		 */
  		History.saveState(History.storeState(History.extractState(History.getLocationHref(),true)));
  
  		/**
  		 * Bind for Saving Store
  		 */
  		if ( sessionStorage ) {
  			// When the page is closed
  			History.onUnload = function(){
  				// Prepare
  				var	currentStore, item, currentStoreString;
  
  				// Fetch
  				try {
  					currentStore = JSON.parse(sessionStorage.getItem('History.store'))||{};
  				}
  				catch ( err ) {
  					currentStore = {};
  				}
  
  				// Ensure
  				currentStore.idToState = currentStore.idToState || {};
  				currentStore.urlToId = currentStore.urlToId || {};
  				currentStore.stateToId = currentStore.stateToId || {};
  
  				// Sync
  				for ( item in History.idToState ) {
  					if ( !History.idToState.hasOwnProperty(item) ) {
  						continue;
  					}
  					currentStore.idToState[item] = History.idToState[item];
  				}
  				for ( item in History.urlToId ) {
  					if ( !History.urlToId.hasOwnProperty(item) ) {
  						continue;
  					}
  					currentStore.urlToId[item] = History.urlToId[item];
  				}
  				for ( item in History.stateToId ) {
  					if ( !History.stateToId.hasOwnProperty(item) ) {
  						continue;
  					}
  					currentStore.stateToId[item] = History.stateToId[item];
  				}
  
  				// Update
  				History.store = currentStore;
  				History.normalizeStore();
  
  				// In Safari, going into Private Browsing mode causes the
  				// Session Storage object to still exist but if you try and use
  				// or set any property/function of it it throws the exception
  				// "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to
  				// add something to storage that exceeded the quota." infinitely
  				// every second.
  				currentStoreString = JSON.stringify(currentStore);
  				try {
  					// Store
  					sessionStorage.setItem('History.store', currentStoreString);
  				}
  				catch (e) {
  					if (e.code === DOMException.QUOTA_EXCEEDED_ERR) {
  						if (sessionStorage.length) {
  							// Workaround for a bug seen on iPads. Sometimes the quota exceeded error comes up and simply
  							// removing/resetting the storage can work.
  							sessionStorage.removeItem('History.store');
  							sessionStorage.setItem('History.store', currentStoreString);
  						} else {
  							// Otherwise, we're probably private browsing in Safari, so we'll ignore the exception.
  						}
  					} else {
  						throw e;
  					}
  				}
  			};
  
  			// For Internet Explorer
  			History.intervalList.push(setInterval(History.onUnload,History.options.storeInterval));
  
  			// For Other Browsers
  			History.Adapter.bind(window,'beforeunload',History.onUnload);
  			History.Adapter.bind(window,'unload',History.onUnload);
  
  			// Both are enabled for consistency
  		}
  
  		// Non-Native pushState Implementation
  		if ( !History.emulated.pushState ) {
  			// Be aware, the following is only for native pushState implementations
  			// If you are wanting to include something for all browsers
  			// Then include it above this if block
  
  			/**
  			 * Setup Safari Fix
  			 */
  			if ( History.bugs.safariPoll ) {
  				History.intervalList.push(setInterval(History.safariStatePoll, History.options.safariPollInterval));
  			}
  
  			/**
  			 * Ensure Cross Browser Compatibility
  			 */
  			if ( navigator.vendor === 'Apple Computer, Inc.' || (navigator.appCodeName||'') === 'Mozilla' ) {
  				/**
  				 * Fix Safari HashChange Issue
  				 */
  
  				// Setup Alias
  				History.Adapter.bind(window,'hashchange',function(){
  					History.Adapter.trigger(window,'popstate');
  				});
  
  				// Initialise Alias
  				if ( History.getHash() ) {
  					History.Adapter.onDomLoad(function(){
  						History.Adapter.trigger(window,'hashchange');
  					});
  				}
  			}
  
  		} // !History.emulated.pushState
  
  
  	}; // History.initCore
  
  	// Try to Initialise History
  	if (!History.options || !History.options.delayInit) {
  		History.init();
  	}
  
  })(window);
  

});
/*!common/static/js/modules/Tab.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 页签控件
 */
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/static/js/modules/Tab', [], definition)
    else this[name] = definition()
})('Tab', function () {

    lg.Widgets.Controls.Extend("Tab", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this._isValueField = false;
            $.extend(this._option, options);
            this.init();
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function () {
            /* this.getStageList();*/
        }
        control.prototype.getElement = function () {
            /* this.getStageList();*/
            return $('[data-propertyname="' + this._option.name + '"]');
        }
        control.prototype.getStageList = function () {
            this.stageList = {
                "NEW": this.getElement().find('[data-stage="NEW"]'),
                "LINK": this.getElement().find('[data-stage="LINK"]'),
                "INTERVIEW": this.getElement().find('[data-stage="INTERVIEW"]'),
                "OFFER": this.getElement().find('[data-stage="OFFER"]'),
                "CHECK_IN": this.getElement().find('[data-stage="CHECK_IN"]')
            }
            this.stageNumList = {
                "NEW": parseInt(this.getElement().find('[data-stage="NEW"]').attr('data-stagenum')),
                "LINK": parseInt(this.getElement().find('[data-stage="LINK"]').attr('data-stagenum')),
                "INTERVIEW": parseInt(this.getElement().find('[data-stage="INTERVIEW"]').attr('data-stagenum')),
                "OFFER": parseInt(this.getElement().find('[data-stage="OFFER"]').attr('data-stagenum')),
                "CHECK_IN": parseInt(this.getElement().find('[data-stage="CHECK_IN"]').attr('data-stagenum'))
            };
        }
        control.prototype.setStageNum = function (add, reduce) {
            this.UpdateStageNum(add, reduce);
        }
        control.prototype.getStage = function (stage) {
            return this.getElement().find('[data-stage="' + stage + '"]');
        }
        control.prototype.UpdateStageNum = function (add, reduce) {
            var stageNumList = {
                "NEW": parseInt(this.getElement().find('[data-stage="NEW"]').attr('data-stagenum')),
                "LINK": parseInt(this.getElement().find('[data-stage="LINK"]').attr('data-stagenum')),
                "INTERVIEW": parseInt(this.getElement().find('[data-stage="INTERVIEW"]').attr('data-stagenum')),
                "OFFER": parseInt(this.getElement().find('[data-stage="OFFER"]').attr('data-stagenum')),
                "CHECK_IN": parseInt(this.getElement().find('[data-stage="CHECK_IN"]').attr('data-stagenum'))
            };
            if (this.getStage(add)) {
                this.getStage(add).attr('data-stagenum', (stageNumList[add] + 1)).find('span:last').text('（' + (stageNumList[add] + 1) + '）');
            }
            if (this.getStage(reduce)) {
                this.getStage(reduce).attr('data-stagenum', (stageNumList[reduce] - 1)<0?0:(stageNumList[reduce] - 1)).find('span:last').text('（' + ((stageNumList[reduce] - 1)<0?0:(stageNumList[reduce] - 1)) + '）');
            }


        }
        return control;
    });

});
/*!common/components/userPhoto/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 用户头像控件
 */
/**

 lg.Widgets.Controls.Confirm({
 name:'xxx'         //控件实例名字
 photoUrl:''   //图片路径
 })

 */
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/userPhoto/main', [], definition)
    else this[name] = definition()
})('UserPhoto', function () {

    lg.Widgets.Controls.Extend("UserPhoto", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this._isValueField = false;
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function (options) {
            if (options) {
                $.extend(this._option, options)
            }
            if (!options) {
                return;
            }
            this.getElement().empty();
            if (typeof this._option.photoUrl =='string' && this._option.photoUrl.length>0) {
	            var url = '';
	            if(this._option.photoUrl.indexOf('https')==0){
		            url = this._option.photoUrl
	            }else{
		            url = '../../https@img.yingjobs.com/thumbnail_50x50/yun/'+this._option.photoUrl;
	            }
	            this.getElement().append('<img class="photo-detail" src="' + url + '" />');
            } else {
                this.getElement().append('<div class="photo-detail bg_' + (this._option.randomNum || 0) + '">' + this._option.text.toUpperCase() + '</div>')
            }
        }
        return control;
    });
});

/*!common/components/userInfomationView/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 用户信息
 */
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/userInfomationView/main', [], definition)
    else this[name] = definition()
})('UserInfomationView', function () {

    /**
     * 用户信息
     */
    lg.Widgets.Controls.Extend("UserInfomationView", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this._isValueField = false;
            this._option.Data
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function (options) {
            if (options) {
                $.extend(this._option, options)
            }
            if (!options) {
                return;
            }
            this.itemData = this._option.dataSource;
            this._option.limit =  this._option.limit|| 10;
            this.setDataSource(this._option.dataSource)
        }
        control.prototype.getSubmitBtn = function () {
            return this.getElement().find('.add-label-btn-type')
        }
        control.prototype.getSubmitBtn = function () {
            return this.getElement().find('.add-label-btn-type')
        }
        control.prototype.getLabelBox = function () {
            return this.getElement().find('.labels')
        }
        control.prototype.getEditeBox = function () {
            return this.getElement().find('.edite-box');
        }
        control.prototype.setTags = function (data) {
            var html = '';
            var tags = '';
            this.getLabelBox().empty();
            if (data && data.length > 0) {
                for (var i = 0, len = data.length; i < len; i++) {
                    if(data[i] == "PLUS") {
                        this._option.limit = 11;
                        tags += '<div class="plusTag"> &nbsp;&nbsp; PLUS</div>';
                    } else {
                        tags += '<div>' + data[i] + ( (!this._option.unEditable)? '<span class="MDS-icon-modal-close icon-close"></span>':'')+'</div>';
                    }
                }
            }
            var add =(!this._option.unEditable)? '<div class="add-label-btn-type"><input style="display: none;" type="text"  maxlength="10" placeholder="输入标签" class="tag-input" /><span><i class="icon-add"></i> 添加标签</span></div>':'';
            if(data&&data.length==this._option.limit){
                html +=tags;
            }else{
                html +=tags+add;
            }

            this.getLabelBox().append(html);
        }
        control.prototype.setDataSource = function (dataSource) {
            if (!dataSource || ( !!dataSource.resumeVoo && !dataSource.resumeVoo.resumeVo ) ) {
                return;
            }
            this.itemData = dataSource;
            this.getElement().empty();
            var that = this;
            var html = '';
            var chatHtml = '';
            var recommendHtml = '';
            var phoneHtml = '';
            var backgroundCheckHtml = '';
            var sexSVG = '';

            var everPositions = '<li class="ever_positions">应聘：<a target="_blank" href="/position/redirectOriginalPage.htm?positionId='+dataSource.positionId+'&companyId='+dataSource.companyId+'">'+dataSource.positionName+'</a>';
            if(this.itemData.everPositions&&this.itemData.everPositions.length>0){
                if(this.itemData.everPositions.length==1){
                    everPositions += ' ('+(!this._option.noLink?'<a href="/resume/list.htm?phone='+this.itemData.phone+'&email='+this.itemData.email+'" target="blank">':'')+'曾于 '+this.itemData.everPositions[0].deliverTime+ ' 应聘过' + this.itemData.everPositions[0].positionName+(!this._option.noLink?'</a>':'')+')';
                }else{
                    everPositions += ' ('+(!this._option.noLink?'<a href="/resume/list.htm?phone='+this.itemData.phone+'&email='+this.itemData.email+'" target="blank">':'')+'曾应聘过 '+this.itemData.everPositions[0].positionName +'、'+ this.itemData.everPositions[1].positionName+'…等'+this.itemData.everPositions.length+'个职位 '+(!this._option.noLink?'</a>':'')+')';
                }
            }
            everPositions+='</li>';
            var splitPhone;
            if(dataSource.phone){
                splitPhone = dataSource.phone.replace(/(^\d{3}|\d{4}\B)/g,function (matched,index,originalText) {
                    return matched + '<i class = "split_phone"></i>';
                });
            }else{
                splitPhone = "";
            }

            if (dataSource.isCanChat) {
                if (dataSource.msgCount > 0) {
                    chatHtml += '<a class="btn btn_green is_can_chat with_chat_msgs" href="/im/ChatAfterDelivered/createsession.htm?resumeId=' + dataSource.id + '" target="_blank" data-lg-tj-id="19gz" data-lg-tj-no="idnull" data-lg-tj-cid="' + dataSource.userId + '">'
                                 + '<span>' + (dataSource.msgCount >= 50 ? '50+' : dataSource.msgCount) + '</span> 条沟通记录'
                             + '</a>';
                } else {
                    chatHtml += '<a class="btn btn_green is_can_chat" href="/im/ChatAfterDelivered/createsession.htm?resumeId=' + dataSource.id + '" target="_blank" data-lg-tj-id="19gz" data-lg-tj-no="idnull" data-lg-tj-cid="' + dataSource.userId + '">'
                                 + '和Ta聊聊 <i class="icon-chat"></i>'
                             + '</a>';
                }
            }
            if(!lg.get('pubCode')){
                var userHasChanceText = '';
                if($('#hasActivityCoupon').length>0 && $('#hasActivityCoupon').val() == 'true'){
                    userHasChanceText = '你有<i style="color:#0099ff;">1</i>次免单机会，请尽快使用';
                }else if(($('#backgroundCheckRest').length>0 && $('#backgroundCheckRest').val() <= 100 && $('#backgroundCheckRest').val() > 0) && ($('#hasMonthCoupon').length>0 && $('#hasMonthCoupon').val() == 'true')){
                    userHasChanceText = '一共还剩' + $('#backgroundCheckRest').val() + '个免单机会，手慢无!';
                }
                backgroundCheckHtml = '<a class="btn btn_green is_can_chat" href="/beidiao/order/create.htm?resumeId=' + dataSource.id + '" target="_blank">'
                    + '背调Ta<i class="icon-search"></i>'
                    + '</a><span style="font-size: 12px;color: #999;margin-left: 10px">'
                    + userHasChanceText
                    + '</span>';
            }
            //拉勾发布的职位 && 改简历不为新简历 && 显示推荐人才按钮
            if(dataSource.channelId == -1 && dataSource.stage != 'NEW' && dataSource.isShowRecTip){
                recommendHtml = '<a class="btn btn_green is_can_chat" href="/search/index.htm?strongly=true&positionId=' + dataSource.lagouPositionId + '" target="_blank" data-lg-tj-id="2ik0" data-lg-tj-no="idnull" data-lg-tj-cid="' + dataSource.userId + '">'
                                 + '<span>' + (dataSource.recCandidateNum > 100 ? '100+' : dataSource.recCandidateNum) + '</span> 位相似人才'
                             + '</a>';
             }

            // 简历右上角 更多 添加【和Ta聊聊】或者【背调Ta】
            (function moreDropdownInfo( outerObj ) {
                var html = '';
                var $moreDropdownEle = $('.more_dropdown');

                // 如果有【背调Ta】或者【和ta聊聊】将其删除（这里居然被调用了三次，，，以最后一次为准，删除上次生成的）
                var startIndex = $( $moreDropdownEle.find('.separator') ).index();
                if ( startIndex != -1 ) {
                    var endIndex = $( $moreDropdownEle.find('.separator')[1] ).index();
                    for( var i = endIndex; i >= startIndex; i-- ) {
                        $( $moreDropdownEle.find( 'li' )[i] ).remove();
                    }
                }

                // 增加 【和Ta聊聊】或者【背调Ta】
                if( !outerObj.lg.get('pubCode') ) {
                    html +='<li><a href="/beidiao/order/create.htm?resumeId=' + outerObj.dataSource.id + '" target="_blank">'
                    + '背调Ta'
                    + '</a></li>';
                }
                else {
                    html +='<li class="disabled"><a href="javascript:;">'
                    + '背调Ta'
                    + '</a></li>';
                }

                if ( outerObj.dataSource.isCanChat ) {
                    html += '<li><a href="/im/ChatAfterDelivered/createsession.htm?resumeId=' + outerObj.dataSource.id + '" target="_blank">'
                                 + '和Ta聊聊'
                             + '</a></li>';
                }
                else {
                    html += '<li class="disabled"><a href="javascript:;">'
                                 + '和Ta聊聊'
                             + '</a></li>';
                }
                if( html != '' ) {
                    html = '<li class="separator"></li>' + html + '<li class="separator"></li>';
                    $moreDropdownEle.find('li').eq(1).after( html );
                }
            })(
                {
                    dataSource: dataSource,
                    lg: lg
                }
            );

            // 将PLUS标签放到第一个
            function firstPlus(arr) {
                if(arr.indexOf("PLUS") !== -1) {
                    arr = arr.slice(0,arr.indexOf("PLUS")).concat(arr.slice(arr.indexOf("PLUS")+1,arr.length));
                    arr.unshift("PLUS");
                    return arr;
                }
                return arr;
            }

            var socialAccountsHtml = "";
            var baseInfoArr = [];
            var socialAccountsArr = dataSource.resumeVoo ? dataSource.resumeVoo.resumeVo.socialAccounts : [];
            if( socialAccountsArr.length > 0 ) {
                for( var i = 0, len = socialAccountsArr.length; i < len; i++ ) {
                    socialAccountsHtml += '<a href="' + socialAccountsArr[i].accountUrl + '" target="_blank" data-sns="' + socialAccountsArr[i].accountId + '" data-site="' + socialAccountsArr[i].accountUrl + '" class="sns sns' + socialAccountsArr[i].accountId + '"><span><em></em></span></a>';
                }
            }
            if( dataSource.resumeVoo && dataSource.resumeVoo.resumeVo && dataSource.resumeVoo.resumeVo.ageNum != -1 ) {
                baseInfoArr.push( '<span title="' + dataSource.resumeVoo.resumeVo.birthYear + '年' + dataSource.resumeVoo.resumeVo.birthMonth + '月出生" style="margin-right:0; cursor: pointer;">' + dataSource.resumeVoo.resumeVo.ageNum + '岁' + '</span>');
            }
            baseInfoArr.push( dataSource.workYear > 0 ? dataSource.workYear + '年工作经验' : '应届' );
            dataSource.educational ? baseInfoArr.push( dataSource.educational ) : '';
            (dataSource.resumeVoo&&dataSource.resumeVoo.resumeVo&&dataSource.resumeVoo.resumeVo.liveCity)? baseInfoArr.push( dataSource.resumeVoo.resumeVo.liveCity ) : '';
            //if (!lg.get('pubCode')) {
            phoneHtml = '<li class="relations">'
                        + baseInfoArr.join(' / ')
                      + '</li>'
                      + '<li class="relations tips-remind">'
                          + socialAccountsHtml
                          + '手机：<span class="phone-tips">' + splitPhone + (dataSource.province?('<span>&nbsp;('+dataSource.province+')</span>'):'')+'</span>&nbsp;&nbsp;'
                          + '邮箱：<a class="info-email-url" href="mailto:' + ( dataSource.email ? dataSource.email : '' ) + '">'
                                    + ( dataSource.email ? dataSource.email : '' )
                               + '</a>'
                      + '</li>';
            sexSVG = dataSource.sex || '';
            if( sexSVG == '男' ) {
               sexSVG = '<i class="icon-man" title="男"></i>';
            }
            else if( sexSVG == '女' ) {
               sexSVG = '<i class="icon-woman" title="女"></i>';
            }
            //}

            html += '<li class="name">'
                      + dataSource.candidateName
                      + sexSVG
                      + recommendHtml
                      + chatHtml
                      + backgroundCheckHtml
                  + '</li>'
                  + phoneHtml
                  + '<li class="labels ' + ( (this._option.unEditable) ? 'unEditable' : '' ) + ' clearfix">';

            if (dataSource.tags) {
                dataSource.tags = firstPlus(dataSource.tags);
                for (var i = 0, len = dataSource.tags.length; i < len; i++) {
                    if(dataSource.tags[i] == "PLUS") {
                        this._option.limit = 11;
                        html += '<div class="plusTag"> &nbsp;&nbsp; PLUS</div>';
                    } else {
                        html += '<div>' + dataSource.tags[i] +( (!this._option.unEditable)? '<span class="MDS-icon-modal-close icon-close"></span>':'')+'</div>'
                    }

                }
            }
            var add =  (!this._option.unEditable)? '<div class="add-label-btn-type"><input style="display: none;" type="text"  maxlength="10" placeholder="输入标签" class="tag-input" /><span><i class="icon-add"></i> 添加标签</span></div>':'';
            if(dataSource.tags&&dataSource.tags.length>(that._option.limit-1)){

            }else{
                html +=add;
            }
            html += '</li';
            var that = this;

            this.getElement().append(html);
            var objEvt = $._data(this.getElement()[0], "events");
            if (objEvt && objEvt["keyup"]) {
            }
            else {
                that.getElement().on('keyup blur', '.add-label-btn-type>input', function (e) {
                    if(e.keyCode == 13) {
                        var tag = that.getElement().find('.tag-input').val();
                        if (tag.length < (that._option.limit+1) && tag && tag.length>0) {
                            that.getElement().find('.tag-input').hide();
                            that.getElement().find('.add-label-btn-type>span').show();
                        } else {
                            that.getElement().find('.tag-input').hide();
                            that.getElement().find('.add-label-btn-type>span').show();
                        }
                    }else{
                        if(e.type=='focusout' || e.type == 'blur'){
                            var tag = $('.tag-input').val();
                            if (tag.length < (that._option.limit+1) && tag && tag.length>0) {
                                $.ajax({
                                    url: 'add_tag.json',
                                    data: {resumeId: that.itemData.id, tag: that.getElement().find('.tag-input').val()},
                                    type: "POST"
                                }).success(function (result) {
                                    if (result.state == 1) {
                                        that.setTags(result.content.rows);
                                        if(typeof lg.getpiplineLeftView !='undefined'){
                                            lg.getpiplineLeftView().field['resume_list'].dataList[that.itemData.id].tags = result.content.rows;
                                        }
                                        if(typeof lg.getpiplineRigetView !='undefined'){
                                            lg.getpiplineRigetView().trigger('updateCommentList');
                                        }
                                        that.getElement().find('.tag-input').hide();
                                        that.getElement().find('.add-label-btn-type>span').show();
                                    }
                                    else if(result.state==403) {
                                        alert('标签不能超过10个');
                                    }
                                    else {
                                        console.log(result);
                                    }
                                })
                            } else {
                                that.getElement().find('.tag-input').hide();
                                that.getElement().find('.add-label-btn-type>span').show();
                            }
                        }
                    }
                });
                this.getElement().on('click', '.add-label-btn-type>span', function (e) {
                    that.getElement().find('.tag-input').show();
                    that.getElement().find('.tag-input').focus();
                    that.getElement().find('.add-label-btn-type>span').hide();
                });
                this.getElement().on('click', '.MDS-icon-modal-close', function (e) {
                    $.ajax({
                        url: 'del_tag.json',
                        data: {resumeId:  that.itemData.id, tag: $(this).parent().text()},
                        type: "POST"
                    }).success(function (result) {
                        if (result.state == 1) {
                            that.setTags(result.content.rows);
                            if(typeof lg.getpiplineLeftView !='undefined'){
                                lg.Cache.Views.piplineLeftView.field['resume_list'].dataList[lg.get('resumeId')].tags = result.content.rows;
                            }
                            if(typeof lg.getpiplineRigetView !='undefined'){
                                lg.getpiplineRigetView().trigger('updateCommentList');
                            }
                        } else {
                            console.log(result);
                        }
                    })
                });
            }
        }
        return control;
    });
});

/*!common/components/topTips/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 顶部tips
 */

/**

 lg.Widgets.Controls.TopTips({
 name:'xxx'         //控件实例名字
 hasNoBack:true     //是否含有遮罩层
 needHoverStop:true //鼠标放上去是否停顿
 decoration:'xxx'   //实例定义样式 className
 })

 lg.getxxx().setShow(true|false)             //显示或隐藏弹框

 */
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/topTips/main', [], definition)
    else this[name] = definition()
})('TopTips', function () {

    lg.Widgets.Controls.Extend("TopTips", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            this._isValueField = false;
            this._id = lg.Utils.getRandom();
            this._element = this.getTemplete().attr('data-confirm-id', this._id);
            $('body').append(this._element);
            //lg.Widgets.BaseControl.call(this, options);

            this.init(options);
        };
        $.extend(control.prototype, lg.Event);
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function (options) {
            //this.getElement().attr('data-id', lg.Utils.getRandom());
            if (options) {
                $.extend(this._option, options)
            }
            var that = this;
            if (this._option) {
                that.setElementHeader(that._option.header || '');

            }
            if (this._option.hasNoBack) {
                setTimeout(function () {
                    that.getElementBack().removeClass('lg-tranparent');
                }, 500);
            }
            this.getElementHeaderClose().on('click', function (e) {
                that.setRemove();
            });
            if (this._option.isBackClose == true) {
                this.getElementBack().on('click', function (e) {
                    that.setRemove();
                });
            }
            this.getElement().addClass('lg-toptips');
            var that = this;
            if(this._option.needHoverStop){
                that.getElement().on('mouseover', function (e) {
                    clearTimeout(that.timeLine);
                    that.timeLine = setTimeout(function () {
                        that.setRemove();
                    }, 5000);
                });
                /*that.getElement().on('mouseover','.lg-confirm', function (e) {
                 that.setRemove();
                 });*/
                that.getElement().on('click','.item-click', function (e) {
                    //clearTimeout(that.timeLine);
                    that.trigger('itemClick');
                    that.setRemove();
                });
            }
            if(this._option.decoration){
                that.getElement().addClass(this._option.decoration);
            }
            this.timeLine = setTimeout(function () {
                that.setRemove();
            }, 5000);
        }
        control.prototype.getCancelBtn = function () {
            return this.getElement().find('.mds-confirm-concel');
        }
        control.prototype.getTemplete = function () {
            var templateStr = '<div class="lg-tranparent"><div class="lg-confirm clearfix" >'
                + '<div class="lg-confirm-title"><span class="title"></span><span class="MDS-icon-modal-close icon-close" aria-hidden="true"></span></div>'
                + '</div></div>';
            return $(templateStr);
        }

        control.prototype.setShow = function (val) {
            var value = false;
            if (val) {
                value = true;
            }
            value ? this.getElement().show() : this.getElement().hide();
        }
        control.prototype.getElementBack = function () {
            return $('[data-confirm-id="' + this._id + '"]') || this._element;
        }
        control.prototype.getElement = function () {
            return this.getElementBack().children('div');
        }
        control.prototype.setRemove = function () {
            this.getElementBack().remove();
        }
        control.prototype.getElementHeader = function () {
            return this.getElement().find('.lg-confirm-title .title');
        }
        control.prototype.setElementHeader = function (val) {
            this.getElement().find('.lg-confirm-title .title').html(val);
        }
        control.prototype.getElementHeaderClose = function () {
            return this.getElement().find('.lg-confirm-title .MDS-icon-modal-close');
        }
        control.prototype.setElementContent = function (val) {
            this.getElement().find('.lg-confirm-content').html(val);
        }
        return control;
    });
});
/*!common/components/toolBar/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 工具条控件
 */
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/toolBar/main', [], definition)
    else this[name] = definition()
})('ToolBar', function () {

    /**
     * 工具条控件
     */
    lg.Widgets.Controls.Extend("ToolBar", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this._isValueField = false;
            this.getAllToolBarFuncs();

        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function (options) {
            if (options) {
                $.extend(this._option, options)
                this.itemData = this._option.dataSource || {};
            }
            if (!options) {
                return;
            }
            var that = this;
            if (!that.itemData)return;
            this.setStage(this.itemData.stage);
            this.setInitToolBar();
        }
        control.prototype.setInitToolBar = function () {
            var that = this;
            this.getElement().find('[data-stage]').each(function (index, el) {
                var stageView = $(el).attr('data-stage').split(',');
                var isVisible = false;
                if (!that.itemData)return;
                for (var i = 0, len = stageView.length; i < len; i++) {
                    if (stageView[i] == that.itemData.stage) {
                        isVisible = true;
                    }
                }
                var disabledList = $(el).attr('data-btn-disabled') ? $(el).attr('data-btn-disabled').split(',') : '';
                var isDisable = false;
                for (var i = 0, len = disabledList.length; i < len; i++) {
                    if (disabledList[i] == that.itemData.stage) {
                        isDisable = true;
                    }
                }

                var use = $(el).attr('data-btn-use');
                if (isVisible) {
                    $(el).show();
                } else {
                    $(el).hide();
                }
                if (isDisable) {
                    $(el).addClass('disabled');
                    if( $(el).attr( 'data-btn-use' ) == 'enterInterview' ) {
                        $( '.interview-again, .interview-again a' ).show();
                    }
                    else {
                        $( '.interview-again' ).hide();
                    }

                } else {
                    $(el).removeClass('disabled');
                }
                if ( (use == "decideLater" && that.itemData.subStage == "DECIDE_LATER") || (use == "offerSended" && that.itemData.subStage == "OFFER_SEND") || (use == "markTbd" && that.itemData.subStage == "TBD")) {
                    $(el).hide();
                }
            });
            this.getElement().find('[data-stage]').off('click');
            this.getElement().find('[data-stage]').on('click', {control: that}, function (e) {
                var use = $(this).attr('data-btn-use');
                if(!use && $(this).attr('href') && $(this).attr('href').indexOf('http') != -1 ) {
                    return;
                }
                if ($(this).hasClass('disabled'))return;
                e.data.control.toolBarFuncs[use](e);
            });
            /*}*/
        }

        control.prototype.getAllToolBarFuncs = function () {
            var that = this;
            that.toolBarFuncs = {};
            that.toolBarFuncs.currentChange = function (e) {
                that.trigger('currentChange', e);
            }
            that.toolBarFuncs.asCandidate = function (e) {
                that.trigger('asCandidate', e);
            }
            that.toolBarFuncs.markTbd = function (e) {
                that.trigger('markTbd', e);
            }
            //阶段下拉
            that.toolBarFuncs.enterInit = function (e) {
                that.trigger('enterInit', e);
            }
            that.toolBarFuncs.enterNew = function (e) {
                that.trigger('enterNew', e);
            }
            that.toolBarFuncs.enterLink = function (e) {
                that.trigger('enterLink', e);
            }
            that.toolBarFuncs.enterInterview = function (e) {
                that.trigger('enterInterview', e);
            }
            that.toolBarFuncs.enterOffer = function (e) {
                that.trigger('enterOffer', e);
            }
            that.toolBarFuncs.enterCheckIn = function (e) {
                that.trigger('enterCheckIn', e);
            }
            that.toolBarFuncs.enterEmploy = function (e) {
                that.trigger('enterEmploy', e);
            }

            //revertCandidate
            that.toolBarFuncs.revertCandidate = function (e) {
                that.trigger('revertCandidate', e);
            }
            // 外层按钮
            that.toolBarFuncs.transmitResume = function (e) {
                that.trigger('transmitResume', e);
            }
            that.toolBarFuncs.reInterview = function (e) {
                that.trigger('reInterview', e);
            }
            that.toolBarFuncs.editeInterviewTime = function (e) {
                that.trigger('editeInterviewTime', e);
            }
            that.toolBarFuncs.offerSended = function (e) {
                that.trigger('offerSended', e);
            }
            that.toolBarFuncs.abandonOffer = function (e) {
                that.trigger('abandonOffer', e);
            }
            that.toolBarFuncs.editeEmployTime = function (e) {
                that.trigger('editeEmployTime', e);
            }
            that.toolBarFuncs.outEmploy = function (e) {
                that.trigger('outEmploy', e);
            }
            that.toolBarFuncs.outResume = function (e) {
                that.trigger('outResume', e);
            }
            that.toolBarFuncs.reportBreak = function (e) {
                that.trigger('reportBreak', e);
            }
            that.toolBarFuncs.resumeForge = function (e) {
                that.trigger('resumeForge', e);
            }
            //标记候选人
            that.toolBarFuncs.arrangeInterviewWait = function (e) {
                that.trigger('arrangeInterviewWait', e);
            }
            that.toolBarFuncs.unLink = function (e) {
                that.trigger('unLink', e);
            }
            // 更多下拉

            that.toolBarFuncs.decideLater = function (e) {
                that.trigger('decideLater', e);
            }
            that.toolBarFuncs.transmitResume = function (e) {
                that.trigger('transmitResume', e);
            }
            that.toolBarFuncs.recommendOther = function (e) {
                that.trigger('recommendOther', e);
            }
            that.toolBarFuncs.editeResume = function (e) {
                that.trigger('editeResume', e);
            }
            that.toolBarFuncs.prePage = function (e) {
                that.trigger('prePage', e);
            }
            that.toolBarFuncs.nextPage = function (e) {
                that.trigger('nextPage', e);
            }
            that.toolBarFuncs.writeComment = function (e) {
                that.trigger('writeComment', e);
            }
        }
        control.prototype.getSubInfo = function (stage, subStage) {
            this.stage = {
                'INIT': {
                    'stageText': '新简历',
                    'nextStage': 'NEW',
                    'NOT_READ': "",
                    'WAIT_FEEDBACK': "",
                    'READ': "",
                    'use': "enterNew"
                },
                'NEW': {
                    'stageText': '待沟通',
                    'nextStage': 'LINK',
                    'NOT_READ': "",
                    'WAIT_FEEDBACK': "",
                    'READ': "",
                    'use': "enterLink"
                },
                'LINK': {
                    'stageText': '面试',
                    'nextStage': 'INTERVIEW',
                    'LINK_WAIT': "",
                    'LINK_LATE': "",
                    'use': "enterInterview"
                },
                'INTERVIEW': {
                    'stageText': '待录用',
                    'nextStage': 'OFFER',
                    'INTERVIEW_WAIT': "",
                    'INTERVIEW_END': "",
                    'DECIDE_LATER': "",
                    'use': "enterOffer"
                },
                'OFFER': {
                    'stageText': '待入职',
                    'nextStage': 'CHECK_IN',
                    'OFFER_WAIT': "",
                    'OFFER_SEND': "",
                    'CHECK_IN': "",
                    'use': "enterCheckIn"
                },
                'CHECK_IN': {
                    'stageText': '已入职（简历库）',
                    'nextStage': 'EMPLOYED',
                    'EMPLOYED': "",
                    'OFFER_SEND': "",
                    'CHECK_IN': "",
                    'use': "enterEmploy"
                },
                'EMPLOYED': {
                    'stageText': '恢复为候选人（新简历）',
                    'nextStage': 'NEW',
                    'OFFER_SEND': "",
                    'use': "enterNew"
                },
                'OBSOLETE': {
                    'nextStage': 'NEW',
                    'stageText': '恢复为候选人（新简历）',
                    'OBSOLETE': "",
                    'use': "revertCandidate"
                }
            };
            if (stage) {
                return this.stage[stage];
            }
            return this.stage;
        }
        control.prototype.setDisableDelay = function (val, time) {
            if (time) {
                var that = this;
                setTimeout(function () {
                    that.setDisable(val)
                    $('.detail-header .current').removeClass('disabled');
                }, time || 1000);
            } else {
                $('.detail-header .current').addClass('disabled');
                this.setDisable(val);
            }
        }
        control.prototype.setDisable = function (val, time) {
            var value = false;
            if (val) {
                value = true;
            }
            value ? this.getElement().attr('disabled', value) : this.getElement().removeAttr('disabled');
            if (value) {
                this.getElement().attr('disabled', value);
                this.getElement().find('a').attr('disabled', value);
            } else {
                this.getElement().removeAttr('disabled');
                this.getElement().find('a').removeAttr('disabled');
            }
        }

        control.prototype.setStageNum = function (addStage, reduceStage) {
            var linkList = {

                'LINK': 'pop',
                'INTERVIEW': 'pass_interview.json',
                'OFFER': 'ensure_offer.json',
                'CHECK_IN': 'employ.json'
            }
            return linkList[stage];
        }
        control.prototype.getStageDropdownURl = function (stage) {
            var linkList = {
                'NEW': 'pass_select.json',
                'LINK': 'pop',
                'INTERVIEW': 'pass_interview.json',
                'OFFER': 'ensure_offer.json',
                'CHECK_IN': 'employ.json'
            }
            return linkList[stage];
        }
        control.prototype.getStageDropdownMenuURl = function (stage) {
            var linkList = {
                // 'INIT': 'read.json',
                'NEW': 'toStageNew.json',
                'LINK': 'pass_select.json',
                'INTERVIEW': 'pop',
                'OFFER': 'pass_interview.json',
                'CHECK_IN': 'ensure_offer.json',
                'EMPLOYED': 'employ.json',
                'OBSOLETE': 'obsolete.json',
            }
            return linkList[stage];
        }
        control.prototype.setStage = function (stage) {
            lg.set('stage', stage);
            lg.UpdateUrl();
            this.setStageDropdownCurrent(stage);
            this.setStageDropdownMenu(stage);
            this.setOutResume(stage);
        }
        control.prototype.setOutResume = function () {
            return this.getElement().find('.line-dropdown');
        }
        control.prototype.getStageDropdown = function () {
            return this.getElement().find('.line-dropdown');
        }
        control.prototype.getStageDropdownMenu = function () {
            return this.getElement().find('.line-dropdown').find('.dropdown-menu>li');
        }
        control.prototype.setStageDropdownMore = function (stage) {

        }
        control.prototype.getStageDropdownMore = function (stage) {
            return this.getElement().find('.more-dropdown');
        }
        control.prototype.setStageDropdownMenu = function (stage) {
            this.getStageDropdown().find('.dropdown-menu>li').removeClass('disabled');
            this.getStageDropdown().find('.dropdown-menu [data-stage="' + stage + '"]').addClass('disabled');
        }
        control.prototype.setStageDropdownCurrent = function (stage) {
            var itemStage = this.getSubInfo();

            var $changeEle = $('.entry-process-options .to-be-commu');
            if( window.CONST_VARS('user').isYunUser && itemStage[stage].stageText == '待入职' ) {
                $changeEle.find('a').remove();
                $changeEle.find('.icon-move-to2').hide().after('<a calss="yun-of-offer" href="../../https@yun.lagou.com/offer/requirement.htm@resumeId=' + lg.get('resumeId') + '" data-toggle="modal">发 Offer</a>');
            }
            else if( window.CONST_VARS('user').isYunUser && window.CONST_VARS('user').isCanEntry && itemStage[stage].stageText == '已入职（简历库）' ) {
                $changeEle.find('a').remove();
                $changeEle.find('.icon-move-to2').hide().after('<a calss="yun-of-entry" href="../../https@yun.lagou.com/entry/create.htm@resumeId=' + lg.get('resumeId') + '" data-toggle="modal">办理入职</a>');
            }
            else {
                $changeEle.find('.icon-move-to2').show()
                $changeEle.find('a').text( itemStage[stage].stageText ).attr({ 'href': 'javascript:;', 'class': 'current', 'data-toggle': ''});
            }

            this.getStageDropdownCurrent().attr('data-stage', stage);
            if(itemStage[stage].use=='revertCandidate'){
                this.getStageDropdownCurrent().attr('data-stage', stage);
            }else{
                this.getStageDropdownCurrent().attr('data-stage', stage);
            }
            this.getStageDropdownCurrent().attr('title', itemStage[stage].stageText);
            this.getStageDropdownCurrent().html( itemStage[stage].stageText );
            this.getStageDropdownCurrent().attr('data-btn-use', itemStage[stage].use);

            // 针对非【Offer请求被驳回】【Offer失效】样式回归。这样直接通过class获取元素实际上对基础类已经造成了污染，但是，，，哎，原来代码没有理解透彻加时间紧急先保障运行吧，，
            var $processEle = $('.entry-process-options .to-be-commu');
            $processEle.removeClass('to-be-commu-nboder');
            if( $changeEle.find('a').text() != '发 Offer' && $changeEle.find('a').text() != '办理入职' ) {
                $processEle.find('i').show();
            }
        }
        control.prototype.getStageDropdownCurrent = function () {
            return this.getElement().find('.current');
        }
        control.prototype.getTransmitResume = function () {
            return this.getElement().find('.transmit-resume');
        }
        control.prototype.getOutResume = function () {
            return this.getElement().find('.out-resume');
        }
        control.prototype.getMoreDropdown = function () {
            return this.getElement().find('.more-dropdown');
        }
        control.prototype.UpdateToolbar = function (itemData) {
            this.setStage(itemData.stage);
        }
        return control;
    });
});

/*!common/components/text/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 文本控件
 */
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/text/main', [], definition)
    else this[name] = definition()
})('Text', function () {

    lg.Widgets.Controls.Extend("Text", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this._isValueField = false;
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function (options) {
            if (options) {
                $.extend(this._option, options)
            }
            if (this._option.defaultText) {
                this.setValue(this._option.defaultText);
            }
            if (!this._option.isVisible) {
                this.getPre().hide();
            } else {
                this.getPre().show();
                this.getElement().css('display', 'inline');
            }
        }
        control.prototype.getPre = function () {
            return this.getElement().prev();
        }
        control.prototype.setVisible = function (val) {
            var value = true;
            if (!val) {
                value = false;
            }
            if (value) {
                this.getPre().show();
                this.getElement().css('display', 'inline');
            } else {
                this.getPre().hide();
                this.getElement().css('display', 'none');
            }

        }
        control.prototype.setValue = function (val) {
            this.getElement().text(val)
        }
        control.prototype.getValue = function () {
            return this.getElement().text()
        }
        return control;
    });
});
/*!common/components/memberCheckBoxList/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 头像checkboxList
 */
/**
 * @require "common/components/memberCheckBoxList/main.less"
 **/
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/memberCheckBoxList/main', [], definition)
    else this[name] = definition()
})('MemberCheckBoxList', function () {
    lg.Widgets.Controls.Extend("MemberCheckBoxList", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this._isValueField = false;
            this.init();
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function (options) {
            if (options) {
                $.extend(this._option, options)
            }
            if (!this._option.dataSource) {
                return;
            }
            this.getElement().empty();
            var html = '';
            for (var i = 0, len = this._option.dataSource.length; i < len; i++) {
                var member = this._option.dataSource[i];
                if(this._option.onlyShowSelected && member.isChecked){
                    var portrait = !member.portrait?'<div class="bg_'+member.userId%4+'">'+lg.Utils.splitNameStr(member.name)+'</div>':'<img src="../../https@img.yingjobs.com/thumbnail_50x50/yun/'+member.portrait+'" />';

                    html+='<li '+(this._option.onlyShowName?'style="height:57px;"':'')+'><label  title="' + (member.email || '') + '">'+
                        '<input type="checkbox" name="recruiters" ';
                    html+= (member.isChecked ? ' checked ' : '');
                    html+= (member.isDisabled ? ' disabled ' : '');
                    var name = lg.Utils.setString(member.name?member.name:'',6);
                    var title = lg.Utils.setString(member.title?member.title:'',10);
                    if(this._option.onlyShowName){
                        title='';
                    }
                    html+='value="'+member.userId+'"/>'+
                        portrait+
                        '<span><span></span></span>'+
                        '</label><div title="'+member.name+'" class="name">'+name+'</div>'+(member.isActive?'<div title="'+member.title+'">'+title+'</div>':'<div title="'+title+'">(未激活)</div>')+'</li>';
                }else{
                    var portrait = !member.portrait?'<div class="bg_'+member.userId%4+'">'+lg.Utils.splitNameStr(member.name)+'</div>':'<img src="../../https@img.yingjobs.com/thumbnail_50x50/yun/'+member.portrait+'" />';

                    html+='<li '+(this._option.onlyShowName?'style="height:57px;"':'')+'><label  title="' + (member.email || '') + '">'+
                        '<input type="checkbox" name="recruiters" ';
                    html+= (member.isChecked ? ' checked ' : '');
                    html+= (member.isDisabled ? ' disabled ' : '');
                    var name = lg.Utils.setString(member.name?member.name:'',6);
                    var title = lg.Utils.setString(member.title?member.title:'',10);
                    if(this._option.onlyShowName){
                        title='';
                    }
                    html+='value="'+member.userId+'"/>'+
                        portrait+
                        '<span><span></span></span>'+
                        '</label><div title="'+member.name+'" class="name">'+name+'</div>'+(member.isActive?'<div title="'+member.title+'">'+title+'</div>':'<div title="'+title+'">(未激活)</div>')+'</li>';
                }

            }
            this.getElement().append(html);
        }
        control.prototype.addItem = function (itemData) {
            var html = '';
            var member = itemData;
            if(this.getElement().find('[value="'+itemData.userId+'"]').length>0){
                return;
            }
            var portrait = !member.portrait?'<div class="bg_'+member.userId%4+'">'+lg.Utils.splitNameStr(member.name)+'</div>':'<img src="../../https@img.yingjobs.com/thumbnail_50x50/yun/'+member.portrait+'" />';

            html+='<li><label  title="' + (member.email || '') + '">'+
                '<input type="checkbox" name="recruiters" ';
            html+= (member.isChecked ? ' checked ' : '');
            html+= (member.isDisabled ? ' disabled ' : '');
            var name = lg.Utils.setString(member.name?member.name:'',6);
            var title = lg.Utils.setString(member.title?member.title:'',10);
            html+='value="'+member.userId+'"/>'+
                portrait+
                '<span><span></span></span>'+
                '</label><div title="'+member.name+'">'+name+'</div>'+(itemData.isActive?'<div title="'+member.title+'">'+title+'</div>':'<div title="'+member.title+'">(未激活)</div>')+'</li>';
            this.getElement().append(html);
        }
        control.prototype.getValue = function () {
            var data = [];
            this.getElement().find('input[name=recruiters]:checked').each(function(i,ele){
                data[i]=$(ele).val();
            });
            return data;
        }
        return control;
    });
});

/*!common/components/filterSelect/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 输入框选择过滤控件
 */
/**
 * @require "common/components/filterSelect/main.less"
 **/
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/filterSelect/main', [], definition)
    else this[name] = definition()
})('FilterSelect', function () {
    lg.Widgets.Controls.Extend("FilterSelect", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this._isValueField = true;
            this.init();
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function (options) {
            if (options) {
                $.extend(this._option, options)
            }

            var that = this;
            this._dataList={};
            this.getElement().find('ul').remove();
            if(this.getElement().find('input').length==0){
                var placeHolder = this._option.placeHolder||'';
                this.getElement().append('<input class="input" type="text" placeholder="'+placeHolder+'" value="'+(this.getElement().attr('value')||'')+'"/>');
            }else{
                var placeHolder = this._option.placeHolder||'';
                this.getElement().find('input').val(this.getElement().attr('value') || this.getElement().find('input').val() ||'');
                this.getElement().find('input').attr('placeHolder',placeHolder);
            }
            if(this._option.maxLength){
                this.getElement().find('input').attr('maxLength',this._option.maxLength);
            }
            if (!this._option.dataSource) {
                return;
            }
            var html = '<ul class="filter-select-menu" data-select-list style="display: none;">';
            for (var i = 0, len = this._option.dataSource.length; i < len; i++) {
                var item = this._option.dataSource[i];
                this._dataList[item[this.getIdentifyKey()]]=item;
                html+=this.getTemplate(item);
            }
            html+='</ul>'
            this.getElement().append(html);
            this.getElement().off('focus')
            this.getElement().on('focus','input', function (e) {
                that.getListShow();
                that.getList().find('li').show();
                that.setFilter('');
                if(that._option.showSelect) {
                    $(this).select();
                }
            });
            if(this._option.blurClear){
                this.getElement().off('blur')
                this.getElement().on('blur','input', function (e) {
                    //that.setValue(that.getValue(true)&&that.getValue(true)[that.getIdentifyKey()],true);
                    that.getInput().val(that.getValue(true)[that._option.showKey]&&that.getValue(true)[that._option.showKey]||'');
                });
            }
            this.getElement().off('keyup');
            this.getElement().on('keyup','input', function (e) {
                if(that.getInputValue().length){
                    that.setFilter(that.getInputValue())

                }else{
                    that.getList().find('li').show();
                }

            });
            var that = this;
            this.getElement().off('click');
            this.getElement().on('click',function(e){
                if($(e.target).closest('[data-select-list] li').length>0){
                    if(that._option.showSelect){
                        var showKey = that._option.showKey || 'name';
                        var showKeys = showKey.split(',');
                        var value = '';
                        for(var i = 0,len = showKeys.length;i<len;i++){
                            var itemList = that._dataList[$(e.target).closest('li').attr('data-item-id')];
                            if(itemList[showKeys[i]] && itemList[showKeys[i]].length>0 && (value.length==0)){
                                value = itemList[showKeys[i]]?itemList[showKeys[i]]:'';
                            }
                        }
                        that.getInput().val(value);
                    }else{
                        that.getInput().val('');
                    }
                    that.setClickValue(that._dataList[$(e.target).closest('li').attr('data-item-id')]);
                    that.trigger('select',{itemData:that._dataList[$(e.target).closest('li').attr('data-item-id')]});
                    that.getList().hide();
                    that.getInput().trigger('blur');
                }else if($(e.target).hasClass('input')){
                    $('body').find('[data-select-list]').hide();
                    that.getListShow();
                }else{
                    that.getList().hide();
                }
            });


            $('body').on('click', function (e) {
                if($(e.target).closest('.filter-select').length==0){
                    that.getList().hide();
                    interview_sign = false;
                }
            });
        }
        control.prototype.getTemplate = function (item) {
            var result = '';
            if(this._option.template && this._option.templateEng){
                var render = this.getTemplateRender();
                result =  '<li class="'+(this._option.itemClass?this._option.itemClass:'')+'" data-item-id="'+item[this.getIdentifyKey()]+'">' +render(item)+'</li>';
            }else{
                var back = item.portrait ? '<img title=";'+item.name+'" src="' + (/^https?\:\/\//.test(item.portrait) ? item.portrait : '../../https@img.yingjobs.com/thumbnail_50x50/yun/' + item.portrait.replace(/^[\/]+/, '')) + '" />' : '<span class="participator-photo bg_' + item[this.getIdentifyKey()] % 4 + '" title="'+item.name+'">' + lg.Utils.splitNameStr(item.name) + '</span>'
                result = '<li class="photo img-text" data-item-id="'+item[this.getIdentifyKey()]+'">' + back + '<span class="name">'+item.name+'</span></li>'
            }
            return result;
        }

        control.prototype.getTemplateRender = function (template) {

            return this._option.templateEng.compile( template || this._option.template||'');

        }

        control.prototype.getKey = function () {
            if(this._option.key || this._option.key.length == 0){
                this._key = 'name';
            };
            if(typeof this._option.key=='string'){
                this._key=this._option.key.split(' ');
            }else{
                this._key = this._option.key
            }
            return this._key;
        }
        control.prototype.getIdentifyKey = function () {
            if(!this._option.identifyKey){
                this._identifyKey = 'userId';
            }else{
                this._identifyKey = this._option.identifyKey;
            }
            return this._identifyKey;
        }
        /*  control.prototype.setFilter = function (val) {
         this.getList().find('.name').each(function (i, ele) {
         var index = $(ele).text().toLowerCase().indexOf(val.replace(/\'/,''));
         if(index<0){
         $(ele).closest('li').hide();
         }else{
         $(ele).closest('li').show();
         }
         });
         }*/
        control.prototype.setFilter = function (val) {
            var filter = val.replace(/\'/,'').toLowerCase();
            if(!filter){
                this.getListShow();
                return;
            };
            var that = this;
            var key = this.getKey();
            this.getList().find('li').each(function (i, ele) {
                var id = $(ele).attr('data-item-id');
                var isShow = false;
                if(that._dataList[id]){
                    for(var i= 0,len=key.length;i<len;i++){
                        if(!isShow && typeof that._dataList[id][key[i]] !='undefind'){
                            var index =that._dataList[id][key[i]]? that._dataList[id][key[i]].toLowerCase().indexOf(filter):-1;
                            if(index>-1){
                                isShow = true;
                            }
                        }
                    }
                }
                if(isShow){
                    $(ele).show();
                }else{
                    $(ele).hide();
                }
            });
            if(this.getList().height()<202){
                //this.getList().css('top',-this.getList().height());
                this.getList().css('top',(that._option&&that._option.dropDownDirection=='down')?'inherit':-this.getList().height());
            }else{
                this.getList().css('top','202px');
            }
            if(!this.getList().find('li').is(':Visible')){
                this.getList().css('border','none');
            }else{
                this.getList().css('border','1px solid #eeeeee');
            }
        }
        /*if ((parent.offset().top + parent.outerHeight() + options.outerHeight() + 20) > $(window).height() + $(window).scrollTop()) {
            parent.addClass('overflowing');
        } else {
            parent.removeClass('overflowing');
        }*/
        control.prototype.getList = function () {
            return this.getElement().find('[data-select-list]');
        }
        control.prototype.getListShow = function () {
            var parent = this.getElement();
            var options = this.getList();
            if ((parent.offset().top + parent.outerHeight() + options.outerHeight() + 20) > $(window).height() + $(window).scrollTop()) {
                if(this.getList().height()<202){
                    this.getList().css('top',-this.getList().height());
                }else{
                    this.getList().css('top','202px');
                }
                parent.addClass('overflowing');
            } else {
                if($('#candidatePage').size()>0) {
                    this.getList().css('top',parent.height());  // 候选人页bug暂时修复
                } else{
                    this.getList().css('top','inherit');
                }
                parent.removeClass('overflowing');
            }
            this.getList().show();
        }
        control.prototype.getInput = function () {
            return this.getElement().find('input');
        }
        control.prototype.getValue = function(allItemData){
            return allItemData?this._value:(this._option.showKey?this.getElement().find('input').val():this._value);
        }
        control.prototype.clearValue = function(){
            this.getElement().find('input').val('');
            this._value = '';
        }
        control.prototype.setClickValue = function(val){
            this._value = val;
        }
        control.prototype.setValue = function(val,byKey){
            if(byKey){
                this._value = this._dataList[val];
                this._option.showKey?this.getElement().find('input').val(this._value[this._option.showKey]):this._value = val;
            }else{
                this._option.showKey?this.getElement().find('input').val(val):this._value = val;
            }
        }
        control.prototype.getInputValue = function () {
            return this.getElement().find('input').val();
        }
        return control;
    });
});

/*!common/components/filterGridView/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 过滤表格控件
 */
/**
 * @require "common/components/filterGridView/main.less"
 **/
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/filterGridView/main', [], definition)
    else this[name] = definition()
})('FilterGridView', function () {
    lg.Widgets.Controls.Extend("FilterGridView", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this._isValueField = false;
            this._dataList = {};
            this.init();
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function (options) {
            if (options) {
                $.extend(this._option, options)
            }
            if (!this._option.dataSource) {
                return;
            }
            this.getElement().empty();
            var html = '';
            this._dataList = {};
            var render = this.getTemplateEng().compile(this._option.template||'');
            for (var i = 0, len = this._option.dataSource.length; i < len; i++) {
                var itemData = this._option.dataSource[i];
                this._dataList[itemData.id] = this._option.dataSource[i];
                var checkbox = '';
                if( itemData.freeze ) {
                    checkbox = '<td class="checkbox-col freeze-father"><i class="icon-no"></i><div class="freeze-tips"><span>更改候选人阶段操作暂不可用，无法执行淘汰操作</span></div></td>';
                }
                else {
                    checkbox = '<td class="checkbox-col"><label for="'+itemData.id+'" class="box_checkbox">'+
                        '<input type="checkbox" value="" id="'+itemData.id+'" name="filterGridView" class="checkbox" data-text="">'+
                        '<span class="checkbox_icon"></span>'+
                        '</label></td>';
                    this._option.noChoose?(checkbox=''):'';
                }

                html+='<tr data-item-id="'+itemData.id+'">'+checkbox+ render(itemData)+'</tr>';
            }
            if(this._option.header){
                var checkboxSelectAll = '<th class="checkbox-col"><label for="selectAll" class="box_checkbox">'+
                    '<input type="checkbox" value="" id="selectAll" name="filterGridView" class="checkbox" data-text="">'+
                    '<span class="checkbox_icon"></span>'+
                    '</label></th>';
                    this._option.noChoose?(checkboxSelectAll=''):'';
            }
            var that = this;
            this.getElement().append('<table class="table">'+(this._option.header?(checkboxSelectAll+this._option.header):'')+html+'</table>');
            this.getElement().on('click','td input', function (e) {
                if(that.getElement().find('td input:checked').length == that.getElement().find('td input').length){
                    that.getElement().find('th input').prop('checked',true);
                }else{
                    that.getElement().find('th input').prop('checked',false);
                }
                that.trigger('changeSelect',{control:that,data:that._dataList[$(this).attr('id')]});
            });
            if(this._option.header){
                this.getElement().find('#selectAll').on('click', function (e) {
                    if($(this).prop('checked')){
                        that.setSelectAll(true);
                        that.trigger('changeSelect',{control:that,data:{}});
                    }else{
                        that.setSelectAll(false);
                        that.trigger('changeSelect',{control:that,data:{}});
                    }
                });
            }
        }
        control.prototype.addItem = function (itemData) {
            return null;
        }
        control.prototype.delItem = function (val) {
            delete this._dataList[val];
            this.getElement().find('[data-item-id="'+val+'"]').remove()
        }
        control.prototype.setSelectAll = function (val) {
            var value = false;
            val?(value = true):(value = false);
            this.getList().find('input[name="filterGridView"]').prop('checked',value);
        }
        control.prototype.getKey = function () {
            if(this._option.key || this._option.key.length == 0){
                this._key = 'name';
            };
            if(typeof this._option.key=='string'){
                this._key=this._option.key.split(' ');
            }else{
                this._key = this._option.key
            }
            return this._key;
        }
        control.prototype.getList = function () {
            return this.getElement().find('tr');
        }
        control.prototype.setFilterValue = function (val) {
            var filter = val.replace(/\'/,'').toLowerCase();
            if(!filter){
                this.getList().show();
                return;
            };
            var that = this;
            var key = this.getKey();
            this.getList().each(function (i, ele) {
                var id = $(ele).attr('data-item-id');
                var isShow = false;
                if(that._dataList[id]){
                    for(var i= 0,len=key.length;i<len;i++){
                        if(!isShow && typeof that._dataList[id][key[i]] !='undefind'){
                            var index =that._dataList[id][key[i]]? that._dataList[id][key[i]].toLowerCase().indexOf(filter):-1;
                            if(index>-1){
                                isShow = true;
                            }
                        }
                    }
                }
                if(isShow){
                    $(ele).show();
                }else{
                    $(ele).hide();
                }
            });
            var hasData = false;
            this.getList().each(function (i, ele) {
                if($(ele).css('display')!='none'){
                    hasData=true;
                }
            });
        }
        control.prototype.getTemplateEng = function () {
            return this._option.templateEng;
        }
        control.prototype.getValue = function () {
            var data = [];
            this.getElement().find('td input').each(function(i,ele){
                if($(ele).prop('checked')){
                    data.push($(ele).attr('id'));
                }
            });
            return data;
        }
        return control;
    });
});

/*!common/components/cooperatorList/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 参与者列表控件
 */
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/cooperatorList/main', [], definition)
    else this[name] = definition()
})('CooperatorList', function () {
    /**
     * 参与者列表控件
     */
    lg.Widgets.Controls.Extend("CooperatorList", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this._isValueField = false;
            this.dataList = {};
            this.init();
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function (options) {
            if (options) {
                $.extend(this._option, options)
            }
            if (!this._option.dataSource) {
                return;
            }
            this.dataList = this.dataList || {};
            this.getElement().empty();
            var html = '';
            var moreList = '<li class="more_list"><a class="participator-photo bg_more" >...</a><ul class="toggle_menu" style="display: none">';
            for (var i = 0, len = this._option.dataSource.length; i < len; i++) {
                this.dataList[this._option.dataSource[i].id] = this._option.dataSource[i];
                if(i>(this._option.limitNum-1)){
                    var item = this._option.dataSource[i];
                    var back = item.portrait ? '<img title="'+item.nickName+'" src="' + (/^https?\:\/\//.test(item.portrait) ? item.portrait : ('../../https@img.yingjobs.com/thumbnail_50x50/yun/' + item.portrait.replace(/^[\/]+/, ''))) + '" />' : '<span class="participator-photo bg_' + item.id % 4 + '" title="'+item.nickName+'">' + lg.Utils.splitNameStr(item.nickName) + '</span>'
                    moreList+='<li class="photo">' + back + '<span class="name">'+item.nickName+'</span></li>'
                }else{
                    var item = this._option.dataSource[i];
                    var back = item.portrait ? '<img title="'+item.nickName+'" src="' + (/^https?\:\/\//.test(item.portrait) ? item.portrait : ('../../https@img.yingjobs.com/thumbnail_50x50/yun/' + item.portrait.replace(/^[\/]+/, ''))) + '" />' : '<span class="participator-photo bg_' + item.id % 4 + '" title="'+item.nickName+'">' + lg.Utils.splitNameStr(item.nickName) + '</span>'
                    html += '<li class="photo">' + back + '</li>'
                }
            }
            if(this._option.limitNum<this._option.dataSource.length){
                moreList+='</ul></li>';
                html+=moreList;
            }
            this.getElement().empty();
            this.getElement().append(html);
            this.getElement().append();
            //this.setDataSource(this._option.dataSource);
            this.getElement().find('.more_list .bg_more').on('click',this.getElement(),function(e){
                if($(this).next('.toggle_menu').is(':hidden')){
                    $('.toggle_menu').hide();
                    $('.infobox').hide();
                    $(this).next('.toggle_menu').show();
                    $(this).next('.infobox').show();
                }else{
                    $(this).next('.infobox').hide();
                    $(this).next('.toggle_menu').hide();
                }
                e.stopPropagation();
            })

        }
        return control;
    });
});

/*!common/components/commentList/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 评论列表控件
 */
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/commentList/main', [], definition)
    else this[name] = definition()
})('CommentList', function () {
    /**
     * 评论列表控件
     */
    lg.Widgets.Controls.Extend("CommentList", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this._isValueField = false;
            this.init();
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function (options) {
            if (options) {
                $.extend(this._option, options)
            }
            this.getElement().empty();
            if (!this._option.dataSource) {
                return;
            }
            var showNum = this._option.showNum||3;
            var datacommentslist = this._option.dataSource;
            var html = '';
            for (var i = 0, len = datacommentslist.length; i < len; i++) {
                if( !!datacommentslist[i].operate && !!datacommentslist[i].operate.operateType && !this.getTemplate(datacommentslist[i].operate.operateType) ) {
                   continue;
                }
                var source = typeof datacommentslist[i].operate == "undefined" ? '' : this.getTemplate(datacommentslist[i].operate.operateType);
                var item = datacommentslist[i];

                var isShow = i < showNum ? 'block' : 'none';
                if (source == '') {
                    var content=item.comment.content;

                    var atSplit=content.split(']');
                    for(var j=0;j<atSplit.length;j++) {
                        var temp=atSplit[j]+']';
                        content=content.replace(temp,temp.replace(/\[at id='(.*)' name='(.*)'\/\]/,'<a class="atwho-inserted">_40$2 _3C/a>'));
                    }

                    var background = item.comment.userPortrait ? '<img src="../../https@img.yingjobs.com/thumbnail_50x50/yun/' + item.comment.userPortrait + '" alt="">' : '<span class="avatar_name bg_' + Math.abs(item.comment.userId) % 4 + '">' + lg.Utils.splitNameStr(item.comment.userName) + '</span>'
                    html += '<li style="display:' + isShow + '" class="' + (i == 0 ? 'end' : '') + ' clearfix comment-box" data-item-user-id="'+item.comment.userId+'" data-item-user-name="'+item.comment.userName+'">'
                        + '<div class="avatar fl">'
                        + background
                        + '</div>'
                        + '<div class="' + (i == (showNum-1)? '' : 'state') + ' comment-content fl">'
                        + '<p>'
                        + '<span class="username">' + item.comment.userName + '</span>'
                        + '<span class="date">' + item.createTime.substr(4, 2) + '-' + item.createTime.substr(6, 2) + '</span>'
                        + '<span class="time">' + item.createTime.substr(9, 2) + ':' + item.createTime.substr(11, 2) + '</span>'
                        + '</p>'
                        + '<p>'
                        + '<span class="commet_text">' + content + '</span>'
                        + '</p>'
                        + '</div>'
                        + (this._option.showToRecomment?'<a class="toRecomment">回复</a>':'')
                        + '</li>';
                } else {
                    var render = this.getTemplateEng().compile(source);
                    if(datacommentslist[i].operate.parameters.interviewTime && datacommentslist[i].operate.parameters.interviewTime.indexOf('-') > -1 ){
                        var interviewTime = datacommentslist[i].operate.parameters.interviewTime;
                        datacommentslist[i].operate.parameters.interviewTime = lg.Utils.formatDateToZH(interviewTime);
                    }
                    if(datacommentslist[i].operate.parameters.newInterviewTime && datacommentslist[i].operate.parameters.newInterviewTime.indexOf('-') > -1 ){
                        var changedTime = datacommentslist[i].operate.parameters.newInterviewTime;
                        datacommentslist[i].operate.parameters.newInterviewTime = lg.Utils.formatDateToZH(changedTime);
                    }
                    if(datacommentslist[i].operate.parameters.newCompleteTime && datacommentslist[i].operate.parameters.newCompleteTime.indexOf('-') > -1) {
                        var changedTime = datacommentslist[i].operate.parameters.newCompleteTime;
                        datacommentslist[i].operate.parameters.newCompleteTime = lg.Utils.formatDateToZH(changedTime);
                    }
                    if ((len - 1) == i) {
                        html += '<li style="display:' + isShow + '" class="' + (i == 0 ? 'end' : '') + ' start">' + render(datacommentslist[i].operate.parameters) + '<span class="date">' + item.createTime.substr(4, 2) + '-' + item.createTime.substr(6, 2) + '</span><span class="time">' + item.createTime.substr(9, 2) + ':' + item.createTime.substr(11, 2) + '</span></li>'

                    } else {
                        if (i == (showNum-1)) {
                            html += '<li style="display:' + isShow + '" class="' + (i == 0 ? 'end' : '') + ' start"><div>' + render(datacommentslist[i].operate.parameters) + '<span class="date">' + item.createTime.substr(4, 2) + '-' + item.createTime.substr(6, 2) + '</span><span class="time">' + item.createTime.substr(9, 2) + ':' + item.createTime.substr(11, 2) + '</span></div></li>'
                        } else {
                            html += '<li style="display:' + isShow + '" class="' + (i == 0 ? 'end' : '') + ' start"><div class="state">' + render(datacommentslist[i].operate.parameters) + '<span class="date">' + item.createTime.substr(4, 2) + '-' + item.createTime.substr(6, 2) + '</span><span class="time">' + item.createTime.substr(9, 2) + ':' + item.createTime.substr(11, 2) + '</span></div></li>'
                        }
                    }
                }

            }
            if (this.getCommentList().length == 0) {
                this.getElement().append('<ul class="comment" ></ul>');
            }
            var that = this;
            this.getCommentList().append(html);
            this.getCommentList().on('click','.toRecomment', function (e) {
                var $li = $(this).closest('li');
                var itemData = {
                    userId:$li.attr('data-item-user-id'),
                    userName:$li.attr('data-item-user-name')
                }
                that.trigger('toRecomment',itemData);
            })
            //this.setDataSource(this._option.dataSource);
            if (this._option.dataSource && this._option.dataSource.length > showNum) {
                this.setMoreBtn();
            }

        }
        control.prototype.setMoreBtn = function () {

            if (this._option.dataSource.length) {
                var that = this;
                that.getCommentList().attr('data-toggle', false);
                this.getElement().append('<div class="more_btn" ><button class="btn btn_green toggle-commemt-list" style="padding:0 16px;font-size: 14px;height: 33px;line-height: 33px;">查看更多</button></div>');
                this.getElement().find('.toggle-commemt-list').on('click', function (e) {
                    var toggle = that.getCommentList().attr('data-toggle');
                    var showNum = that._option.showNum||3;
                    if (toggle == "true") {
                        that.getCommentList().find('li').each(function (i, el) {
                            if (i == (showNum-1)) {
                                $($(el).children('div')[$(el).children('div').length-1]).removeClass('state');
                            } else if (i > (showNum-1)) {
                                $(el).hide();
                            }
                        });
                        that.getCommentList().attr('data-toggle', false);
                        $(this).html('查看更多');
                    } else {
                        that.getCommentList().find('li').each(function (i, el) {
                            if (i == (showNum-1)) {
                                $($(el).children('div')[$(el).children('div').length-1]).addClass('state');
                            } else if (i > (showNum-1)) {
                                $(el).show();
                            }
                        });
                        $(this).html('收起更多');
                        that.getCommentList().attr('data-toggle', true);
                    }
                });
            }
        }
        control.prototype.getCommentList = function () {
            return this.getElement().find('.comment');
        }
        control.prototype.getTemplateEng = function () {
            return this._option.templateEng;
        }
        control.prototype.getTemplate = function (type) {
            var commentTemplates = {
                "UPLOAD_RESUME": '{{operateUserName}} 添加了简历 {{resumeName}}',
                "DELIVER_RESUME": '候选人通过 {{channelName}} 投递了 {{positionName}}',
                "ADD_CANDIDATE": '{{operateUserName}} 添加了简历 {{resumeName}}',
                "ADD_POSITION_RECOMMEND_CANDIDATE": '{{operateUserName}} 为 {{positionName}} 推荐了候选人 {{resumeName}}',
                "RECOVER_CANDIDATE": '{{operateUserName}} 恢复了候选人 {{resumeName}}',
                "MARK_CANDIDATE": '{{operateUserName}} 将 {{resumeName}} 标记为候选人',
                "CANDIDATE_FILTRATION": '{{operateUserName}} 将候选人移动到 待沟通',
                "CANDIDATE_INTERVIEW": '{{operateUserName}} 为候选人安排了面试 面试时间：{{interviewTime}} 联系人：@{{contactUserName}}',
                "CANDIDATE_PASS_INTERVIEW": '{{operateUserName}} 将候选人移动到 待录用',
                "OFFER": '{{operateUserName}} 已发出Offer',
                "CANDIDATE_CHECK_OFFER": '{{operateUserName}} 将候选人移动到 待入职',
                "CANDIDATE_COMPLETE": '{{operateUserName}} 将候选人标记为 已入职',
                "ELIMINATE_CANDIDATE": '{{operateUserName}} 淘汰了候选人',
                "CANDIDATE_ABANDON_OFFER": '{{operateUserName}} 将候选人标记为 放弃Offer',
                "CANDIDATE_NOT_COMPLETE": '{{operateUserName}} 将候选人标记为 未入职',
                "MARK_WAIT_FEEDBACK": '{{operateUserName}} 将候选人标记为 等待反馈',
                "MARK_REDIAL_LATER": '{{operateUserName}} 将候选人标记为 需再联系',
                "MARK_PENDING": '{{operateUserName}} 将候选人标记为 已面试-备选待定',
                "FORWARD_RESUME": '{{operateUserName}} 转发了简历',
                "EDIT_CANDIDATE": '{{operateUserName}} 编辑了候选人',
                "UPDATE_RESUME": '{{operateUserName}} 更新了简历',
                "ADD_CANDIDATE_TAG": '{{operateUserName}} 为候选人添加了标签 {{tagName}}',
                "DELETE_CANDIDATE_TAG": '{{operateUserName}} 为候选人删除了标签 {{tagName}}',
                "EDIT_INTERVIEW_TIME": '{{operateUserName}} 修改了面试时间：{{newInterviewTime}}',
                "EDIT_COMPLETE_TIME": '{{operateUserName}} 修改了入职时间：{{newCompleteTime}}',
                "RECOMMEND_CANDIDATE_TO_POSITION": '{{operateUserName}} 将候选人推荐到了 {{targetPositionName}}',
                "INVITE": '{{invitedUserName}} 被 {{operateUserName}} 邀请加入',
                "JOIN_POSITION": '{{operateUserName}} 加入了{{targetPositionName}} 的招聘小组',
                "QUIT_POSITION": '{{operateUserName}} 离开了{{targetPositionName}} 的招聘小组',
                "AUTO_REJECTION": '由于您未在5个工作日内及时处理该候选人的简历，该候选人已经被自动回绝。',
                "WAIT_INVITE_INTERVIEW": '{{operateUserName}} 将候选人标记为 待约面试',
                "COMMENT": '<li><div><img src="" /></div><div><div><span>Cobra</span><span>2015-10-45 23:12</span><span>回复</span><span>删除</span></div><div>asdfasdf<span>@Vee</span>dsfasdfadfa</div></div></li>',
                "MOVE_TO_NEW_RESUME": '{{operateUserName}} 将候选人移动到 新简历',
                "MOVE_TO_INTERVIEW": '{{operateUserName}} 将候选人移动到 面试',
                "YUN_OFFER_CREATE": '{{yunOperateUserName||"你的同事"}} 创建了Offer',
                "YUN_OFFER_SEND": '{{yunOperateUserName||"你的同事"}} 发送了Offer',
                "YUN_OFFER_REPEAL": '{{yunOperateUserName||"你的同事"}} 撤销了Offer',
                "YUN_OFFER_ENSURE": '候选人 确认了Offer',
                "YUN_OFFER_REFUSE": '候选人 拒绝了Offer',
                "YUN_OFFER_ABANDON_ENTRY": '候选人 拒绝了Offer',
                "YUN_OFFER_ENTRY": '候选人 已入职',
                "YUN_OFFER_RESEND": '{{yunOperateUserName||"你的同事"}} 重发了Offer',
                "YUN_OFFER_INVALID": 'Offer到达有效期，已自动失效',
                "YUN_OFFER_READ_OFFER": '候选人阅读了Offer',
                "YUN_OFFER_CREATE_APPROVE": '{{yunOperateUserName||"你的同事"}} 提交了Offer审批',
                "YUN_OFFER_APPROVE_PASS": '{{yunOperateUserName||"你的同事"}} 通过了Offer审批',
                "YUN_OFFER_REFUSE_APPROVE": '{{yunOperateUserName||"你的同事"}} 驳回了Offer审批',
                "YUN_OFFER_CANCEL_APPROVE": '{{yunOperateUserName||"你的同事"}} 撤销了Offer审批',
                "YUN_ENTRY_READ_OFFER": '{{yunStaffName}} 已阅读Offer',
                "YUN_ENTRY_ENSURE_OFFER": '{{yunStaffName}} 确认了Offer',
                "YUN_ENTRY_CREATE_ENTRY": '{{yunOperateUserName||"你的同事"}} 添加了待入职员工，并邀请完善信息',
                "YUN_ENTRY_READ": '{{yunStaffName}} 浏览了信息登记表',
                "YUN_ENTRY_WAIT_REVIEW": '{{yunStaffName}} 完善了信息登记表',
                "YUN_ENTRY_RESEND_INVITATION": '{{yunOperateUserName||"你的同事"}} 重新邀请{{yunStaffName}}完善信息',
                "YUN_ENTRY_REVIEWED": '{{yunOperateUserName||"你的同事"}} 审核并通过了{{yunStaffName}}的信息登记表',
                "YUN_ENTRY_UPDATE_ENTRYDATE": '{{yunOperateUserName||"你的同事"}} 调整了{{yunStaffName}}的入职日期，从 <em>{{oldValue||"无"}}</em> 调整至 <em>{{newValue||"无"}}</em>',
                "YUN_ENTRY_ABANDON_ENTRY": '{{yunStaffName}} 放弃入职',
                "YUN_ENTRY_REFUSE": '{{yunStaffName}} 拒绝了Offer',
                "YUN_ENTRY_INVALID": 'Offer到达有效期，已自动失效',
                "YUN_ENTRY_ENTRY": '{{yunOperateUserName||"你的同事"}} 将{{yunStaffName}}标记为已入职'
            };
            return commentTemplates[type];
        }
        return control;
    });
});

/*!common/components/cartList/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 列表控件
 */
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/cartList/main', [], definition)
    else this[name] = definition()
})('CartList', function () {
    /**
     * 列表控件
     */
    lg.Widgets.Controls.Extend("CartList", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this._isValueField = false;
            this.isDisable = false;
        };

        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function () {
            this.dataList = {};
            this.Cache = [];
            this.setDataSource(this._option.dataSource);
            lg.QueryString()
            this.positionId = lg.get('positionId') || this._option.positionId || 0;
            this.stage = lg.get('stage') || this._option.stage || 0;
            if (this._option.top && (this._option.dataSource.length>0)) {
                this.getElement().css('top', "94px");
            }
            this.endTime = this.getEndTime(this.stage)
        }

        control.prototype.addCache = function(resumeId){
            if(this.Cache.indexOf(resumeId)>-1){
                this.Cache.splice(this.Cache.indexOf(resumeId), 1);
                this.Cache.push(resumeId);
            }else{
                if(this.Cache.length == 5){
                    this.Cache.push(resumeId);
                    this.delCache(this.Cache.shift());
                }else{
                    this.Cache.push(resumeId);
                }
            }


        }
        control.prototype.delCache = function(resumeId){
            if(typeof this.dataList[resumeId] =='undefined'){
                return;
            }
            delete this.dataList[resumeId].doc;
        }
        control.prototype.getSubInfo = function (stage, subStage) {
            this.stage = {
                'NEW': {
                    'stageText': '通过初筛',
                    'nextStage': 'LINK',
                    'NOT_READ': "",
                    'WAIT_FEEDBACK': "",
                    'READ': ""
                },
                'LINK': {
                    'stageText': '邀请面试',
                    'nextStage': 'INTERVIEW',
                    'LINK_WAIT': "",
                    'LINK_LATE': ""
                },
                'INTERVIEW': {
                    'stageText': '通过面试',
                    'nextStage': 'OFFER',
                    'INTERVIEW_WAIT': "",
                    'INTERVIEW_END': "",
                    'DECIDE_LATER': ""
                },
                'OFFER': {
                    'stageText': '标记已录用',
                    'nextStage': 'CHECK_IN',
                    'OFFER_WAIT': "",
                    'OFFER_SEND': "",
                    'CHECK_IN': ""
                },
                'CHECK_IN': {
                    'stageText': '标记已入职',
                    'nextStage': 'EMPLOYED',
                    'EMPLOYED': "",
                    'OFFER_SEND': "",
                    'CHECK_IN': ""
                },
                'EMPLOYED': {
                    'stageText': '待入职',
                    'nextStage': 'LINK',
                    'OFFER_SEND': ""
                },
                'OBSOLETE': {
                    'nextStage': '',
                    'stageText': '已淘汰',
                    'OBSOLETE': ""
                }
            };
            if (stage) {
                return this.stage[stage];
            }
            return this.stage;
        }

        control.prototype.setSubStage = function (val) {
            $(val).addClass('active');
        }
        control.prototype.setActive = function (val) {
            $(val).siblings('li').removeClass('active');
            $(val).addClass('active');
        }
        control.prototype.getActivePre = function () {
            return this.getElement().find('li.active').prev();
        }
        control.prototype.getActivePreData = function () {
            return this.dataList[this.getElement().find('li.active').prev().attr('data-item')];
        }
        control.prototype.getActive = function () {
            return this.getElement().find('li.active');
        }
        control.prototype.getActiveData = function () {
            return this.dataList[this.getElement().find('li.active').attr('data-item')];
        }
        control.prototype.getActiveNext = function () {
            return this.getElement().find('li.active').next();
        }
        control.prototype.getActiveNextData = function () {
            return this.dataList[this.getActiveNext().attr('data-item')];
        }
        control.prototype.getStage = function (val) {
            var itemData = this.getActiveData()
            this.dataList[itemData.id].stage = val || 0;
        }
        control.prototype.setStage = function (stage) {
            var itemData = this.getActiveData();
            lg.UpdateUrl();
            this.setStageInfo(itemData);
        }

        control.prototype.getEndTime = function (itemData) {
            //var currentStage = stage || this.stage;
            if (!this.getElement().find('li').last().attr('data-item'))return;
            var data = this.dataList[itemData.id];
            if (!data)return;
            var endTimeRule = {
                "NEW": 'stageEnterTime',
                "LINK": 'stageEnterTime',
                "INTERVIEW": 'interviewTime',
                "OFFER": 'stageEnterTime',
                "CHECK_IN": lg.get('positionId') == -1 ? 'stageEnterTime' : 'entryTime'
            };
            return data[endTimeRule[data.stage]];
        }
        control.prototype.updateResume = function (itemData,addTop) {
            var that = this;
            that.dataList[itemData.id] = itemData;
            var itemData = that.dataList[itemData.id];
            if (itemData.stage == "EMPLOYED" || itemData.stage == 'OBSOLETE' || itemData.needNext) {
                var $target =  this.getElement().find('[data-item="' + itemData.id + '"]'); // 当前元素
                delete that.dataList[itemData.id];
                if (that.getElement().find('li').length === 1) {
                    lg.Cache.Views.piplineRigetView.getElement().addClass('no-resume')
                }else{
                    // 如果有下一个 激活下一个, 否则激活上一个
                    var $next = that.getActiveNext();
                    if($next.length ===0 ){
                        var $pre = that.getActivePre();
                        $pre.trigger('click');
                    } else {
                        $next.trigger('click');
                    }
                    itemData = that.getActiveData();    // 更新 itemData
                }
                $target.remove();   // 删除当前元素
                this.getNextPage();
            }

            this.getElement().find('[data-item="' + itemData.id + '"]').empty();
            if(addTop && this.getElement().find('[data-item="' + itemData.id + '"]').length == 0){
                this.getElement().prepend(this.getItemTemplate(itemData));
            }else{
                this.getElement().find('[data-item="' + itemData.id + '"]').append(this.getItemTemplate(itemData,true));
                //lg.Cache.Views['piplineRigetView'].field['resume_toolbar'].UpdateToolbar(itemData);
            }


        }
        control.prototype.getRead = function () {

        }
        control.prototype.getSubStageInfo = function (data) {
            var newHtml = '<span>'+ data.deliverDays + '天前投递</span>';
            if (data.deadlineStatus === 3) { // 超期，超过5个工作日
                newHtml = '<span style="color:#FD5F39;">' + data.deliverDays + '天前投递</span>';
            } else if (data.deadlineStatus === 1 || data.deadlineStatus === undefined) { // 正常（默认），非 NEW 简历或者3个工作日之内
                newHtml = data.deliverDays === 0 ? '今天投递' : '<span>'+ data.deliverDays + '天前投递</span>';
            } else if (data.deadlineStatus === 2) { // 即将超期，超过3个工作日没超过5个工作日
                newHtml = '<span data-deadday= "' + Math.max(data.deliverDaysWillProcess, 0) + '" class="dot-hover">' + data.deliverDays + '天前投递</span>'
                        + '<span class="tips-card-data-holder"><span class="card-dot">请于<span class="card-day">' + String(data.after5Workday).replace(/(\d{4})\-(\d{2})\-(\d{2}).*/,'$1'+'/'+'$2'+'/'+'$3') + '</span>之前处理</span></span>';
            }
            var state = {
                "NEW": newHtml,
                "LINK": newHtml,
                "INTERVIEW":data.interviewTime ? (data.subStage == "INTERVIEW_WAIT" ? ((new Date(data.interviewTime.replace(/-/g,'/')).getTime() - new Date().getTime()) > 0) ? '面试时间：' + this.getInterviewTime(data.interviewTime) : '已面试' : data.subStage == "DECIDE_LATER" ? '已面试（备选待定）' : '') : '',
                "OFFER": (data.phone ? data.phone : '') + (data.subStage == "LINK_LATE" ? '（需再联系）' : ((data.subStage == 'ARRANGE_INTERVIEW_WAIT' ? '（待约面试）' : ''))),
                "CHECK_IN": (data.phone ? data.phone : '') + (data.subStage == "LINK_LATE" ? '（需再联系）' : ((data.subStage == 'ARRANGE_INTERVIEW_WAIT' ? '（待约面试）' : '')))
            }

            return state[data.stage];
        }
        control.prototype.getInterviewTime = function (dateTime) {
            var date = new Date(dateTime.replace(/-/g,'/'));
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var dateList = this.getDatePropertyList();
            return (dateList[dateTime.substring(0, 10)] ? dateList[dateTime.substring(0, 10)] : dateTime.substr(5, 5)) + " " + dateTime.substr(11, 5);
        }
        control.prototype.getDatePropertyList = function () {
            var date = new Date().getTime();
            var dateTime = 24 * 60 * 60 * 1000;
            var todayWeek = new Date().getDay();
            var weekText = '下周';
            var weekList = {
                1: '一',
                2: '二',
                3: '三',
                4: '四',
                5: '五',
                6: '六',
                7: '日'
            };
            var dayNum = 0;
            var dateList = {};
            dateList[new Date(date + dateTime * dayNum++).pattern('yyyy-MM-dd')] = '今天';
            dateList[new Date(date + dateTime * dayNum++).pattern('yyyy-MM-dd')] = '明天';
            dateList[new Date(date + dateTime * dayNum++).pattern('yyyy-MM-dd')] = '后天';
            var todayWeek = new Date().getDay();
            if (todayWeek == 0) {
                todayWeek = 7;
            }
            if (todayWeek < 5) {
                for (var i = 0, len = (7 - (todayWeek + 2)); i < len; i++) {
                    dateList[new Date(date + dateTime * dayNum++).pattern('yyyy-MM-dd')] = "周" + weekList[todayWeek + i + 3];
                }
            }
            var dateNextWeek = new Date(date + dateTime * dayNum).getDay();
            if (dateNextWeek == 0) {
                dateNextWeek = 7;
            }
            for (var i = 0, len = (7 - dateNextWeek + 1); i < len; i++) {
                dateList[new Date(date + dateTime * dayNum++).pattern('yyyy-MM-dd')] = "下周" + weekList[dateNextWeek + i];
            }
            return dateList;
        }
        control.prototype.getRangeDays = function (dateTime) {
            var str = dateTime;
            if (!str) {
                return;
            }
            var result = new Date() - new Date(str.substring(0, 16).replace(/-/g,'/'));
            if (result < 0) {
                return 0;
            }
            return Math.floor(result / (1000 * 60 * 60 * 24));
        }
        control.prototype.getItemTemplate = function (dataSource,innerString) {
            //按id获取一个hash确定头像颜色
            //var back = typeof itemData.portrait == 'string' ? '<img src="../' + itemData.portrait + '" />' : '<span class="photo_name bg_' + lg.Utils.getHash(itemData.id) % 4 + '">' + itemData.candidateName.substring(0, 1).toUpperCase() + '</span>'
            //按照渠道确定头像颜色

            /* begin    title texthidden部分内容计算 */
            var titleText = '',
                positionStr = '';
            if( lg.get('positionId') <= 0 ) {

                // 不是按职位查的，获取职位名称
                positionStr = lg.Utils.setString(dataSource.positionName,16);
            }
           
            if ( !!dataSource.workYear ) {

                // 有工作经验
                titleText = positionStr == '' ? ( '' +  (dataSource.lastCompanyName || '') ) : ( positionStr + ( !!dataSource.lastCompanyName ? '../' + dataSource.lastCompanyName : '' ) );
                // titleText = !dataSource.lastCompanyName ? '' + positionStr : dataSource.lastCompanyName + ( ( positionStr == '' ) ? '' : '../' + positionStr );
            }
            else {

                // 无工作经验
                titleText = positionStr == '' ? ( '' +  (dataSource.lastSchoolName || '') ) : ( positionStr + ( !!dataSource.lastSchoolName ? '../' + dataSource.lastSchoolName : '' ) );
                // titleText = !dataSource.lastSchoolName ? '' + positionStr : dataSource.lastSchoolName + ( ( positionStr == '' ) ? '' : '../' + positionStr );
            }
            /* end    title texthidden部分内容计算 */

            var html = '';
            var isActive = lg.get('resumeId') && lg.get('resumeId') == dataSource.id ? ' active ' : '';
            var noRead = dataSource.subStage == 'NOT_READ' ? ' noread ' : '';
            var back = (typeof dataSource.userPortrait == 'string'&& dataSource.userPortrait.length>0 )? '<img src="' + (!(dataSource.userPortrait.indexOf('https')==0)?('../../https@img.yingjobs.com/thumbnail_50x50/'+dataSource.userPortrait):dataSource.userPortrait) + '" />' : '<span class="photo_name bg_' + ( (dataSource.userId % 4) || 0 ) + '">' + (dataSource.candidateName?dataSource.candidateName.substring(0, 1).toUpperCase():'') + '</span>'
            html +=(!innerString?  '<li class="dotCardHover'+isActive + noRead + (lg.get('positionId') != 0 ? ' single ' : '') + '" data-endtime="' + dataSource[this.getEndTime(dataSource.stage)] + '" data-item="' + dataSource.id + '" data-positionid="'+dataSource.positionId+'" data-userid="'+dataSource.userId+'">':'')
                + '<div class="photo">' + back + '</div>'
                + '<div class="info '+(dataSource.subStage=='TBD'?'tdb':'')+'">'
                + '<div class="name texthidden">' +dataSource.candidateName + '<span class="nickName">' + ( ( !!dataSource.nickName && dataSource.nickName != dataSource.candidateName ) ? dataSource.nickName : '' ) + '</span></div>'
                + '<div class="title texthidden">' + (titleText || '--') + '</div>'
                + '<div class="state">' + this.getSubStageInfo(dataSource) + '</div>'
                + '</div>'
                + (!innerString? '</li>':'')
            return html;
        }
        control.prototype.setDataSource = function (dataSource) {
            if (!dataSource || dataSource.length === 0) {
                return;
            }
            var that = this;
            var html = '';

            /**
             * 判断列表中的条目的stage 是否为NEW，如果是则需要添加过期提示。其他不需要处理
             */

            for (var i = 0, len = dataSource.length; i < len; i++) {
                if(typeof that.dataList[dataSource[i].id] !='undefined'){
                    that.dataList[dataSource[i].id] = dataSource[i];
                    continue;
                }
                this.dataList[dataSource[i].id] = dataSource[i];
                html += this.getItemTemplate(dataSource[i]);
            }

            var that = this;
            lg.QueryString();
            lg.UpdateUrl();
            this.getElement().append(html);

            this.getElement().on('mouseenter', '.dot-hover', function (e) {
                var $me = $(this);
                var $wrapper = $('.unread-resume-tips-wrapper');
                var $contentPosition = $('.content-list').position();
                var $mePosition = $me.closest('.dotCardHover').position();
                $wrapper.html($me.parents('li').find('.tips-card-data-holder').html());
                $wrapper.css({
                    top: $contentPosition.top + $mePosition.top + 55,
                    left: 170
                }).show();
                e.stopPropagation();
            });

            this.getElement().on('mouseleave','.dot-hover', function (e) {
                $('.unread-resume-tips-wrapper').hide();
                e.stopPropagation();
            });

            this.getElement().on('click', 'li', function (e) {
                var $li = $(this);
                var resumeId = $(this).attr('data-item');
                if ($(this).hasClass('noread') && resumeId) {
                    $li.removeClass('noread');
                    $.ajax({
                        url: 'read.json',
                        data: {resumeId: resumeId}
                    }).success(function (result) {
                        if (result.state == 1) {
                            $li.removeClass('noread');
                        }
                    });
                }
                that.setActive($li);
                var itemData = that.getActiveData();
                lg.set('resumeId', $(this).attr('data-item'));
                lg.UpdateUrl();

                that.trigger('itemClick',{control:that});
            });

            this.getElement().on('scroll', function (e) {
                if (!that.isDisable) {
                    if($(this)[0].scrollHeight == ($(this)[0].scrollTop+$(this)[0].clientHeight)){
                        if (that._option.hasMore) {
                            that.getNextPage();
                        }
                    }
                }
            });

            this.scroll();

        }
        control.prototype.scroll = function () {
            if( this.getElement().prop('clientHeight')==this.getElement().prop('scrollHeight')){
                this.getNextPage();
            }
        }
        control.prototype.getNextPage = function () {
            if(!this._option.hasMore){
                return;
            }
            this.isDisable = true;
            var params = {
                stage: lg.get('stage'),
                positionId: lg.get('positionId'),
                timeStr: this._option.timeStr,
                coo:lg.get('coo')
            };
            var that = this;
            $.ajax({
                url: "list.json",
                data: params
            }).success(function (result) {
                that._option.hasMore = result.content.data.hasMore;
                that._option.timeStr = result.content.data.timeStr;

                var html = '';
                if (result.content.rows && result.content.rows.length > 0) {
                    var dataSource = result.content.rows;
                    for (var i = 0, len = dataSource.length; i < len; i++) {
                        if(typeof that.dataList[dataSource[i].id] !='undefined'){
                            that.dataList[dataSource[i].id] = dataSource[i];
                            continue;
                        }
                        that.dataList[dataSource[i].id] = dataSource[i];
                        html += that.getItemTemplate(dataSource[i]);
                    }
                };
                that.getElement().append(html)
                that.isDisable = false;
                that.scroll();
            });
        }
        control.prototype.triggerClick = function () {
            if (this.getActive().length == 1) {
                this.getActive().trigger('click');
            }else{
                if(this._option.directRid){
                    this.getElement().find(':first').trigger('click');
                }else if(lg.get('stage')!='NEW'){
                    this.getElement().find(':first').trigger('click');
                }
            }
        }
        control.prototype.triggerFirst = function () {
            this.getElement().find(':first').trigger('click');
        }
        return control;
    });
});

/*!common/components/resumePreviewToolBar/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 确认控件
 */
/**
 * @require "common/components/resumePreviewToolBar/main.less"
 **/
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/resumePreviewToolBar/main', [], definition)
    else this[name] = definition()
})('ResumePreViewToolBar', function () {
    /**
     * 确认控件
     */
    lg.Widgets.Controls.Extend("ResumePreViewToolBar", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this.init();
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function (options) {
            var toolbar = "<div class='preview-toolbar clearfix' style='display: none;'><div class='btn toolbar-btn preview-toolbar-download' title='下载'><i class='icon-download'></i></div><div class='btn toolbar-btn preview-toolbar-print' title='打印'><i class='icon-print'></i></div><div title='复制' class='btn toolbar-btn preview-toolbar-copy'><i class='icon-auto-copy'></i></div><div title='转发' class='btn toolbar-btn preview-toolbar-trans'><i class='icon-share-resume'></i></div></div>";
            if(this.getToolBar().length==0){
                this.getElement().append(toolbar);
            }
            var that = this;
            /**
             * 工具条 下载 按钮事件
             */
            this.getToolBar().off('click','.preview-toolbar-download');
            this.getToolBar().on('click','.preview-toolbar-download', downloadResume);
            function downloadResume(e) {
                 /**/
                if(lg.has('pubCode')){
                    window.location.href = "/pub/resume/download.htm?pubCode=" + lg.get('pubCode');
                }else{
                    window.location.href = "/resume/download.htm?resumeId=" + lg.get('resumeId');
                }
               /* }else{
                    that._option.doc.download();
                }*/
            }
            /**
             * 解析失败提示下载
             */
            $(".download-resume").on('click', downloadResume);

            /**
             * 工具条 打印 按钮事件
             */
            this.getToolBar().off('click','.preview-toolbar-print');
            this.getToolBar().on('click','.preview-toolbar-print', function (e) {
                //that.trigger('print');
                that._option.doc.print();
            });
            /**
             * 工具条 转发 按钮事件
             */
            this.getToolBar().off('click','.preview-toolbar-trans');
            this.getToolBar().on('click','.preview-toolbar-trans', function (e) {
                lg.getresume_toolbar().trigger('transmitResume',{data:{control:lg.getresume_toolbar()}});
            });

            /**
             * 工具条 开启复制 按钮事件
             */
            this.getToolBar().off('click','.preview-toolbar-copy');
            this.getToolBar().on('click','.preview-toolbar-copy', function (e) {
                lg.getresume_toolbar().trigger('copyResume',{data:{control:lg.getresume_toolbar()}});
            });

            /**
             * 工具条 备注 按钮事件
             */
            this.getToolBar().off('click','.preview-toolbar-comment');
            this.getToolBar().on('click','.preview-toolbar-comment', function (e) {
                if ($('#resumeProcessTab').css('display') == 'none') {
                    $('.nav-tabs [href="#resumeProcessTab"]').trigger('click');
                }
                var editor = document.getElementById('commentInput');
                editor.focus();
            });
            /**
             * 工具条 待定 按钮事件
            */
            this.getToolBar().off('click','.preview-toolbar-tbd');
            this.getToolBar().on('click','.preview-toolbar-tbd', function (e) {
                lg.getresume_toolbar().trigger('markTbd',{data:{control:lg.getresume_toolbar()}});
            });

            /**
             * 工具条 淘汰 按钮事件
             */
            this.getToolBar().off('click','.preview-toolbar-out');
            this.getToolBar().on('click','.preview-toolbar-out', function (e) {
                var outFuncs = {
                    'NEW': 'outResume',
                    'LINK': 'outResume',
                    'INTERVIEW': 'outResume',
                    'OFFER': 'outResume',
                    'CHECK_IN': 'outResume'
                }
                if (outFuncs[lg.getresume_toolbar().itemData.stage]) {
                    lg.getresume_toolbar().trigger(outFuncs[lg.getresume_toolbar().itemData.stage], {data: {control: lg.getresume_toolbar()}});
                }
            });
            /**
             * 工具条 发Offer 按钮事件
             */
            this.getToolBar().off('click','.preview-toolbar-sendoffer');
            this.getToolBar().on('click','.preview-toolbar-sendoffer', function (e) {
                $('[href="#sendOfferTab"]').trigger('click');
            });
            /**
             * 工具条 通过 按钮事件
             */
            this.getToolBar().off('click','.preview-toolbar-pass');
            this.getToolBar().on('click','.preview-toolbar-pass', function (e) {
                lg.getresume_toolbar().getElement().find('.current').trigger('click');
            });
            /**
             * 工具条 面试 按钮事件
             */
            this.getToolBar().off('click','.preview-toolbar-interview');
            this.getToolBar().on('click','.preview-toolbar-interview', function (e) {
                lg.getresume_toolbar().getElement().find("[data-btn-use='enterInterview']").trigger('click');
            });
        }
        control.prototype.getElement = function () {
            if(!this._option.selector){
                return;
            }
            return $(this._option.selector);
        }
        control.prototype.setShow = function (val) {
            if(val){
                this.getToolBar().show()
            }else{
                this.getToolBar().hide()
            }
        }
        control.prototype.getToolBar = function () {
            return this.getElement().find('.preview-toolbar')
        }
        control.prototype.downloadUrl =  function () {
            if(this.resumeId && !this.type){
                return this.downloadUri = "/resume/download.htm?resumeId=" + this.resumeId;
            }else{
                return this.downloadUri = "/pub/resume/download.htm?pubCode=" + this.type;
            }

        }
        /**
         * 根据数据源  初始化 预览工具条
         * @param dataSource
         */
        control.prototype.setDataSource = function (dataSource) {
            if(!dataSource){
                return;
            }
            this.resumeId = dataSource.id;
            this.type = lg.get('pubCode');
            if(typeof dataSource.doc !='undefined'){
                this._option.doc = dataSource.doc;
                $('.preview-toolbar-download').show();
                $('.preview-toolbar-print').show();
            }else{
                this._option.doc = '';
                if(typeof dataSource.fileId != 'undefined'){
                    $('.preview-toolbar-download').show();
                }else{
                    $('.preview-toolbar-download').hide();
                }
                // $('.preview-toolbar-print').hide();
            }

            if(lg.get('pubCode')){
                $('.preview-toolbar-out').hide();
                $('.preview-toolbar-pass').hide();
                $('.preview-toolbar-trans').hide();
                $('.preview-toolbar-comment').hide();
                $('.preview-toolbar-tbd').hide();
                $('.preview-toolbar-sendoffer').hide();
                $('.preview-toolbar-download').css('margin-left','0');
                $('.preview-toolbar').css('width','97px');
                if(this._option.doc == ''){
                    // $('.preview-toolbar').css('width','48px');
                }
            }else{
                if(lg.get('stage')=='NEW' && lg.getresume_toolbar() && lg.getresume_toolbar().itemData && lg.getresume_toolbar().itemData.subStage != "TBD"){
                    $('.preview-toolbar-tbd').hide();
                }else{
                    $('.preview-toolbar-tbd').hide();
                }
                if(lg.get('stage')=='NEW' && lg.getresume_toolbar() && lg.getresume_toolbar().itemData){
                    // $('.preview-toolbar-print').hide();
                    $('.preview-toolbar-interview').show();
                }
                if(lg.get('stage')=='OFFER'){
                   $('.preview-toolbar-sendoffer').show();
                }else{
                    $('.preview-toolbar-sendoffer').hide();
                }
            }
        }
        return control;
    });
});

/*!common/components/tags/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 标签
 */
/**
 * @require "common/components/tags/main.less"
 **/
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/tags/main', [], definition)
    else this[name] = definition()
})('Tags', function () {

    /**
     * 用户信息
     */
    lg.Widgets.Controls.Extend("Tags", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this._isValueField = false;
            this._option.Data
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function (options) {
            if (options) {
                $.extend(this._option, options)
            }
            this.itemData = this._option.dataSource;
            this._option.limit =  this._option.limit|| 10;
            this.setDataSource(this._option.dataSource)
        }
        control.prototype.getSubmitBtn = function () {
            return this.getElement().find('.add-label-btn-type')
        }
        control.prototype.getSubmitBtn = function () {
            return this.getElement().find('.add-label-btn-type')
        }
        control.prototype.getLabelBox = function () {
            return this.getElement().find('.labels')
        }
        control.prototype.getEditeBox = function () {
            return this.getElement().find('.edite-box');
        }
        control.prototype.setTags = function (data) {
            var html = '';
            var tags = '';
            this.getLabelBox().empty();
            if (data && data.length > 0) {
                for (var i = 0, len = data.length; i < len; i++) {
                    if(data[i] == "PLUS") {
                        this._option.limit = 11;
                        tags += '<div class="plusTag"> &nbsp;&nbsp; PLUS</div>';
                    } else {
                        tags += '<div>' + data[i] + ( (!this._option.unEditable)? '<span class="tags_close icon-close"></span>':'')+'</div>';
                    }
                }
            }
            var add =(!this._option.unEditable)? '<div class="add-label-btn-type"><input style="display: none;" type="text"  maxlength="10" placeholder="输入标签" class="tag-input" /><span><i class="icon-add"></i> 添加标签</span></div>':'';
            if(data&&data.length==this._option.limit){
                html +=tags;
            }else{
                html +=tags + add;
            }

            this.getLabelBox().append(html);
        }
        control.prototype.setDataSource = function (dataSource) {
            if (!dataSource) {
                return;
            }
            this.itemData = dataSource;
            this.getElement().empty();
            var that = this;
            var html = '';
            html += '<div class="labels clearfix">';
            var add =  (!this._option.unEditable)? '<div class="add-label-btn-type"><input style="display: none;" type="text"  maxlength="10" placeholder="输入标签" class="tag-input" /><span><i class="icon-add"></i> 添加标签</span></div>':'';

            if (dataSource.tags) {
                for (var i = 0, len = dataSource.tags.length; i < len; i++) {
                    if(dataSource.tags[i] == "PLUS") {
                        that._option.limit = 11;
                        html += '<div class="plusTag"> &nbsp;&nbsp; PLUS</div>';
                    } else {
                        html += '<div>' + dataSource.tags[i] +( (!this._option.unEditable)? '<span class="tags_close icon-close"></span>':'')+'</div>';
                    }
                }
            }
            if(dataSource.tags&&dataSource.tags.length>(that._option.limit-1)){

            }else{
                html += add;
            }
            html += '</div>';
            this.getElement().append(html);
            var objEvt = $._data(this.getElement()[0], "events");
            if (objEvt && objEvt["keyup"]) {
                //console.info(objEvt["click"]);
                //alert("bind click");
            }
            else {
                this.getElement().on('keyup blur', '.add-label-btn-type>input', function (e) {
                    if(e.keyCode == 13) {
                        var tag = that.getElement().find('.tag-input').val();
                        if (tag.length < (that._option.limit+1) && tag && tag.length>0) {
                            /*$.ajax({
                                url: 'add_tag.json',
                                data: {resumeId: lg.get('resumeId')||itemData.id, tag: $('.tag-input').val()},
                                type: "POST"
                            }).success(function (result) {
                                if (result.state == 1) {
                                    that.setTags(result.content.rows);
                                    if(typeof lg.getpiplineLeftView !='undefined'){
                                        lg.getpiplineLeftView().field['resume_list'].dataList[that.itemData.id].tags = result.content.rows;
                                    }
                                    if(typeof lg.getuserInfo !='undefined'){
                                        if(typeof  lg.getpiplineLeftView !='undefined'){
                                            lg.getuserInfo().init({dataSource:lg.getpiplineLeftView().field['resume_list'].dataList[lg.get('resumeId')||itemData.id]});

                                        }else{
                                            itemData.tags = result.content.rows;
                                            lg.getuserInfo().init({dataSource:itemData});
                                        }
                                    }
                                    that.getElement().find('.tag-input').hide();
                                    that.getElement().find('.add-label-btn-type>span').show();
                                }
                                else if(result.state==403) {
                                    alert('标签不能超过10个');
                                }
                                else {
                                    console.log(result);
                                }
                            })*/
                            that.getElement().find('.tag-input').hide();
                            that.getElement().find('.add-label-btn-type>span').show();
                        } else {
                            that.getElement().find('.tag-input').val('');
                            that.getElement().find('.tag-input').hide();
                            that.getElement().find('.add-label-btn-type>span').show();
                        }
                    }else{
                        if(e.type=='focusout' || e.type == 'blur'){
                            var tag = that.getElement().find('.tag-input').val();
                            if (tag.length < (that._option.limit+1) && tag && tag.length>0) {
                                $.ajax({
                                    url: 'add_tag.json',
                                    data: {resumeId: lg.get('resumeId')||itemData.id, tag: tag},
                                    type: "POST"
                                }).success(function (result) {
                                    if (result.state == 1) {
                                        that.setTags(result.content.rows);
                                        if(typeof lg.getpiplineLeftView !='undefined'){
                                            lg.getpiplineLeftView().field['resume_list'].dataList[lg.get('resumeId')||itemData.id].tags = result.content.rows;
                                        }
                                        if(typeof lg.getpiplineRigetView !='undefined'){
                                            lg.getpiplineRigetView().trigger('updateCommentList');
                                        }
                                        if(typeof lg.getuserInfo !='undefined'){
                                            if(typeof  lg.getpiplineLeftView !='undefined'){
                                                lg.getuserInfo().init({dataSource:lg.getpiplineLeftView().field['resume_list'].dataList[lg.get('resumeId')||itemData.id]});

                                            }else{
                                                itemData.tags = result.content.rows;
                                                lg.getuserInfo().init({dataSource:itemData});
                                            }
                                        }
                                        that.getElement().find('.tag-input').val('');
                                        that.getElement().find('.tag-input').hide();
                                        that.getElement().find('.add-label-btn-type>span').show();
                                    }
                                    else if(result.state==403) {
                                        alert('标签不能超过10个');
                                    }
                                    else {
                                        console.log(result);
                                    }
                                })
                            } else {
                                that.getElement().find('.tag-input').val('');
                                that.getElement().find('.tag-input').hide();
                                that.getElement().find('.add-label-btn-type>span').show();
                            }
                        }
                    }
                });
                this.getElement().on('click', '.add-label-btn-type>span', function (e) {
                    that.getElement().find('.tag-input').show();
                    that.getElement().find('.tag-input').focus();
                    that.getElement().find('.add-label-btn-type>span').hide();

                });
                this.getElement().on('click', '.tags_close', function (e) {
                    $.ajax({
                        url: 'del_tag.json',
                        data: {resumeId:  lg.get('resumeId')||itemData.id, tag: $(this).parent().text()},
                        type: "POST"
                    }).success(function (result) {
                        if (result.state == 1) {
                            that.setTags(result.content.rows);
                            if(typeof lg.getpiplineLeftView !='undefined'){
                                lg.Cache.Views.piplineLeftView.field['resume_list'].dataList[lg.get('resumeId')||itemData.id].tags = result.content.rows;
                            }
                            if(typeof lg.getuserInfo !='undefined'){
                                if(typeof  lg.getpiplineLeftView !='undefined'){
                                    lg.getuserInfo().init({dataSource:lg.getpiplineLeftView().field['resume_list'].dataList[lg.get('resumeId')||itemData.id]});

                                }else{
                                    itemData.tags = result.content.rows;
                                    lg.getuserInfo().init({dataSource:itemData});
                                }
                            }
                            if(typeof lg.getpiplineRigetView !='undefined'){
                                lg.getpiplineRigetView().trigger('updateCommentList');
                            }
                        } else {
                            console.log(result);
                        }
                    })
                });
            }
        }
        return control;
    });
});

/*!common/components/radio/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */

/**
 * radio
 */
/**
 * @require "common/components/radio/main.less"
 **/
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/radio/main', [], definition)
    else this[name] = definition()
})('Radio', function () {
    lg.Widgets.Controls.Extend("Radio", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this._isValueField = false;
            this.init();
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function (options) {
            if (options) {
                $.extend(this._option, options)
            }
            if (!this._option.dataSource) {
                return;
            }
            var that = this;
            this._dataList={};
            this._value = {};

            this.getElement().empty();
            var html = '';
            for (var i = 0, len = this._option.dataSource.length; i < len; i++) {
                var itemData = this._option.dataSource[i];
                itemData.id = !itemData.id?this._option.dataSource[i].id=lg.Utils.getRandom():itemData.id;
                this._dataList[itemData.id] = itemData;
                var radio = '<label data-item-id="'+itemData.id+'" for="'+itemData.id+'" class="box-radio">'+
                    '<input type="radio" value="" id="'+itemData.id+'" name="'+that._id+'" class="radio" data-text="" '+(itemData.select?' checked="checked" ':'')+'/>'+
                    '<i class="icon-radio-'+(itemData.select?'on':'off')+'"></i>'+
                    '<span class="radio-text">'+itemData.text+'</span>'+
                    '</label>';
                html+=radio;
                itemData.select?this._value = itemData:'';
            }
            html+=''
            this.getElement().append(html);
            this.getElement().addClass('radio-list');
            this.getElement().addClass('clearfix');
            this.getElement().off('click');
            this.getElement().on('click','input', function (e) {
                that.getElement().find('input').each(function(i,ele){
                    $(ele).prop('checked',false);
                    $(ele).parent().find('i').removeClass('icon-radio-on').addClass('icon-radio-off');
                    that._dataList[$(ele).prop('id')].select = false;
                });
                that._dataList[$(this).prop('id')].select = true;
                $(this).prop('checked',true);
                $(this).parent().find('i').removeClass('icon-radio-off').addClass('icon-radio-on');
                that._value = that._dataList[$(this).attr('id')];
                that.trigger('select',that._dataList[$(this).attr('id')]);
            });

        }
        control.prototype.getValue = function () {
            return this._value;
        }
        control.prototype.setValue = function (val) {
            this._value = val;
            var val = val;
            this.getElement().find('.radio-text').each(function (i, ele) {
                if($(ele).text() == val || $(ele).closest('label').attr('data-item-id')==val){
                    $(ele).closest('label').find('input').trigger('click');
                }
            });
        }
        return control;
    });
});
/*!common/components/interviewInfomation/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 确认控件
 */
/**
 * @require "common/components/interviewInfomation/main.less"
 **/
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/interviewInfomation/main', [], definition)
    else this[name] = definition()
})('InterviewInfomation', function () {
    /**
     * 确认控件
     */
    lg.Widgets.Controls.Extend("InterviewInfomation", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this.init();
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function (options) {
            if (options) {
                $.extend(this._option, options)
            }
            /*if(typeof this._option.dataSource == 'undefined'){
                return;
            }*/

            this.setDataSource(this._option.dataSource);
        }

        control.prototype.setDataSource = function (dataSource) {
            this.dataList = {};
            var that = this;
            this.getElement().on('click','.option', function (e) {
                var $item = $(this).closest('li');
                that.setValue(that.dataList[$item.attr('data-item-id')]);
                that.trigger('select',{control:that,data:that.dataList[$item.attr('data-item-id')]});
            });
            if(!dataSource || dataSource.length==0){
                return ;
            }
            this.getElement().empty();
            var html = '';
            this.dataList = {};
            //var isSelect = ;
            for(var i= 0,len=dataSource.length;i<len;i++){
                var itemId = dataSource[i].id;
                this.dataList[itemId] = dataSource[i];
                this.dataList[itemId].itemId = itemId;
                if(this.dataList[itemId].isSelect){
                    this._value = this.dataList[itemId];
                    var isSelect = itemId;
                }
                html += this.getItemString(this.dataList[itemId]);
            }
            this.getElement().append(html);
            /*if(typeof isSelect != 'undefined'){
                this.setActive(isSelect);
            }*/

        }
        control.prototype.setShow = function (val) {
            if(val){
                this.getElement().show();
            }else{
                this.getElement().hide();
            }
        }
        control.prototype.addItem = function (item) {
            var itemId = item.id;
            this.dataList[itemId] = item;
            this.dataList[itemId].itemId = itemId;
            this.getElement().append(this.getItemString(this.dataList[itemId]));
            this.setValue(this.dataList[itemId]);
            //this.setActive(itemId);
            this.trigger('select',{control:this,data:this.dataList[itemId]});
        }
        control.prototype.setActive = function (val) {
            this.getElement().find('li').removeClass('active');
            this.getElement().find('li[data-item-id="'+val+'"]').addClass('active');
        }
        control.prototype.getValue = function () {
            return this._value;
        }
        control.prototype.setValue = function (item) {
            this._value = item;
        }
        control.prototype.getLength = function () {
            return this.getElement().find('li').length;
        }
        control.prototype.getItemString = function (item) {
            return '<li data-item-id="'+item.itemId+'">'+
            '<span class="name">'+item.linkMan+'</span>'+
            '<span class="address">'+item.address+'</span>'+
            '<span class="tel">'+item.linkPhone+'</span>'+
            '<span class="option">选择该信息</span>'+
            '</li>';
        }
        return control;
    });
});
/*!common/components/datepicker/jquery.ui.datepicker.js*/
;/*! jQuery UI - v1.11.4 - 2015-10-09
* http://jqueryui.com
* Includes: core.js, widget.js, mouse.js, position.js, datepicker.js, menu.js, selectmenu.js
* Copyright 2015 jQuery Foundation and other contributors; Licensed MIT */

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define('common/components/datepicker/jquery.ui.datepicker', ["jquery"], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {
/*!
 * jQuery UI Core 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */


// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.11.4",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	scrollParent: function( includeHidden ) {
		var position = this.css( "position" ),
			excludeStaticParent = position === "absolute",
			overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
			scrollParent = this.parents().filter( function() {
				var parent = $( this );
				if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
					return false;
				}
				return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
			}).eq( 0 );

		return position === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
	},

	uniqueId: (function() {
		var uuid = 0;

		return function() {
			return this.each(function() {
				if ( !this.id ) {
					this.id = "ui-id-" + ( ++uuid );
				}
			});
		};
	})(),

	removeUniqueId: function() {
		return this.each(function() {
			if ( /^ui-id-\d+$/.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap='#" + mapName + "']" )[ 0 ];
		return !!img && visible( img );
	}
	return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}

// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	disableSelection: (function() {
		var eventType = "onselectstart" in document.createElement( "div" ) ?
			"selectstart" :
			"mousedown";

		return function() {
			return this.bind( eventType + ".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
		};
	})(),

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	}
});

// $.ui.plugin is deprecated. Use $.widget() extensions instead.
$.ui.plugin = {
	add: function( module, option, set ) {
		var i,
			proto = $.ui[ module ].prototype;
		for ( i in set ) {
			proto.plugins[ i ] = proto.plugins[ i ] || [];
			proto.plugins[ i ].push( [ option, set[ i ] ] );
		}
	},
	call: function( instance, name, args, allowDisconnected ) {
		var i,
			set = instance.plugins[ name ];

		if ( !set ) {
			return;
		}

		if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
			return;
		}

		for ( i = 0; i < set.length; i++ ) {
			if ( instance.options[ set[ i ][ 0 ] ] ) {
				set[ i ][ 1 ].apply( instance.element, args );
			}
		}
	}
};


/*!
 * jQuery UI Widget 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */


var widget_uuid = 0,
	widget_slice = Array.prototype.slice;

$.cleanData = (function( orig ) {
	return function( elems ) {
		var events, elem, i;
		for ( i = 0; (elem = elems[i]) != null; i++ ) {
			try {

				// Only trigger remove when necessary to save time
				events = $._data( elem, "events" );
				if ( events && events.remove ) {
					$( elem ).triggerHandler( "remove" );
				}

			// http://bugs.jquery.com/ticket/8235
			} catch ( e ) {}
		}
		orig( elems );
	};
})( $.cleanData );

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = widget_slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = widget_slice.call( arguments, 1 ),
			returnValue = this;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( options === "instance" ) {
					returnValue = instance;
					return false;
				}
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {

			// Allow multiple hashes to be passed on init
			if ( args.length ) {
				options = $.widget.extend.apply( null, [ options ].concat(args) );
			}

			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} );
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = widget_uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled", !!value );

			// If the widget is becoming disabled, then nothing is interactive
			if ( value ) {
				this.hoverable.removeClass( "ui-state-hover" );
				this.focusable.removeClass( "ui-state-focus" );
			}
		}

		return this;
	},

	enable: function() {
		return this._setOptions({ disabled: false });
	},
	disable: function() {
		return this._setOptions({ disabled: true });
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) +
			this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );

		// Clear the stack to avoid memory leaks (#10056)
		this.bindings = $( this.bindings.not( element ).get() );
		this.focusable = $( this.focusable.not( element ).get() );
		this.hoverable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

var widget = $.widget;


/*!
 * jQuery UI Position 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */

(function() {

$.ui = $.ui || {};

var cachedScrollbarWidth, supportsOffsetFractions,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-x" ),
			overflowY = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowY ? $.position.scrollbarWidth() : 0,
			height: hasOverflowX ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] ),
			isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
		return {
			element: withinElement,
			isWindow: isWindow,
			isDocument: isDocument,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),

			// support: jQuery 1.6.x
			// jQuery 1.6 doesn't support .outerWidth/Height() on documents or windows
			width: isWindow || isDocument ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow || isDocument ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[0].preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !supportsOffsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem: elem
				});
			}
		});

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			} else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
					position.top += myOffset + atOffset + offset;
				}
			} else if ( overBottom > 0 ) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function() {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	supportsOffsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

})();

var position = $.ui.position;


/*!
 * jQuery UI Datepicker 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/datepicker/
 */


$.extend($.ui, { datepicker: { version: "1.11.4" } });

var datepicker_instActive;

function datepicker_getZindex( elem ) {
	var position, value;
	while ( elem.length && elem[ 0 ] !== document ) {
		// Ignore z-index if position is set to a value where z-index is ignored by the browser
		// This makes behavior of this function consistent across browsers
		// WebKit always returns auto if the element is positioned
		position = elem.css( "position" );
		if ( position === "absolute" || position === "relative" || position === "fixed" ) {
			// IE returns 0 when zIndex is not specified
			// other browsers return a string
			// we ignore the case of nested elements with an explicit value of 0
			// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
			value = parseInt( elem.css( "zIndex" ), 10 );
			if ( !isNaN( value ) && value !== 0 ) {
				return value;
			}
		}
		elem = elem.parent();
	}

	return 0;
}
/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function Datepicker() {
	this._curInst = null; // The current instance in use
	this._keyEvent = false; // If the last event was a key event
	this._disabledInputs = []; // List of date picker inputs that have been disabled
	this._datepickerShowing = false; // True if the popup picker is showing , false if not
	this._inDialog = false; // True if showing within a "dialog", false if not
	this._mainDivId = "ui-datepicker-div"; // The ID of the main datepicker division
	this._inlineClass = "ui-datepicker-inline"; // The name of the inline marker class
	this._appendClass = "ui-datepicker-append"; // The name of the append marker class
	this._triggerClass = "ui-datepicker-trigger"; // The name of the trigger marker class
	this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog marker class
	this._disableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
	this._unselectableClass = "ui-datepicker-unselectable"; // The name of the unselectable cell marker class
	this._currentClass = "ui-datepicker-current-day"; // The name of the current day marker class
	this._dayOverClass = "ui-datepicker-days-cell-over"; // The name of the day hover marker class
	this.regional = []; // Available regional settings, indexed by language code
	this.regional[""] = { // Default regional settings
		closeText: "Done", // Display text for close link
		prevText: "Prev", // Display text for previous month link
		nextText: "Next", // Display text for next month link
		currentText: "Today", // Display text for current month link
		monthNames: ["January","February","March","April","May","June",
			"July","August","September","October","November","December"], // Names of months for drop-down and formatting
		monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
		dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // For formatting
		dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"], // Column headings for days starting at Sunday
		weekHeader: "Wk", // Column header for week of the year
		dateFormat: "mm/dd/yy", // See format options on parseDate
		firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
		isRTL: false, // True if right-to-left language, false if left-to-right
		showMonthAfterYear: false, // True if the year select precedes month, false for month then year
		yearSuffix: "" // Additional text to append to the year in the month headers
	};
	this._defaults = { // Global defaults for all the date picker instances
		showOn: "focus", // "focus" for popup on focus,
			// "button" for trigger button, or "both" for either
		showAnim: "fadeIn", // Name of jQuery animation for popup
		showOptions: {}, // Options for enhanced animations
		defaultDate: null, // Used when field is blank: actual date,
			// +/-number for offset from today, null for today
		appendText: "", // Display text following the input box, e.g. showing the format
		buttonText: "...", // Text for trigger button
		buttonImage: "", // URL for trigger button image
		buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
		hideIfNoPrevNext: false, // True to hide next/previous month links
			// if not applicable, false to just disable them
		navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
		gotoCurrent: false, // True if today link goes back to current selection instead
		changeMonth: false, // True if month can be selected directly, false if only prev/next
		changeYear: false, // True if year can be selected directly, false if only prev/next
		yearRange: "c-10:c+10", // Range of years to display in drop-down,
			// either relative to today's year (-nn:+nn), relative to currently displayed year
			// (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
		showOtherMonths: false, // True to show dates in other months, false to leave blank
		selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
		showWeek: false, // True to show week of the year, false to not show it
		calculateWeek: this.iso8601Week, // How to calculate the week of the year,
			// takes a Date and returns the number of the week for it
		shortYearCutoff: "+10", // Short year values < this are in the current century,
			// > this are in the previous century,
			// string value starting with "+" for current year + value
		minDate: null, // The earliest selectable date, or null for no limit
		maxDate: null, // The latest selectable date, or null for no limit
		duration: "fast", // Duration of display/closure
		beforeShowDay: null, // Function that takes a date and returns an array with
			// [0] = true if selectable, false if not, [1] = custom CSS class name(s) or "",
			// [2] = cell title (optional), e.g. $.datepicker.noWeekends
		beforeShow: null, // Function that takes an input field and
			// returns a set of custom settings for the date picker
		onSelect: null, // Define a callback function when a date is selected
		onChangeMonthYear: null, // Define a callback function when the month or year is changed
		onClose: null, // Define a callback function when the datepicker is closed
		numberOfMonths: 1, // Number of months to show at a time
		showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
		stepMonths: 1, // Number of months to step back/forward
		stepBigMonths: 12, // Number of months to step back/forward for the big links
		altField: "", // Selector for an alternate field to store selected dates into
		altFormat: "", // The date format to use for the alternate field
		constrainInput: true, // The input is constrained by the current date format
		showButtonPanel: false, // True to show button panel, false to not show it
		autoSize: false, // True to size the input for the date format, false to leave as is
		disabled: false, // The initial disabled state
		selectmenuOptions: {}
	};
	$.extend(this._defaults, this.regional[""]);
	this.regional.en = $.extend( true, {}, this.regional[ "" ]);
	this.regional[ "en-US" ] = $.extend( true, {}, this.regional.en );
	this.dpDiv = datepicker_bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
}

$.extend(Datepicker.prototype, {
	/* Class name added to elements to indicate already configured with a date picker. */
	markerClassName: "hasDatepicker",

	//Keep track of the maximum number of rows displayed (see #7043)
	maxRows: 4,

	// TODO rename to "widget" when switching to widget factory
	_widgetDatepicker: function() {
		return this.dpDiv;
	},

	/* Override the default settings for all instances of the date picker.
	 * @param  settings  object - the new settings to use as defaults (anonymous object)
	 * @return the manager object
	 */
	setDefaults: function(settings) {
		datepicker_extendRemove(this._defaults, settings || {});
		return this;
	},

	/* Attach the date picker to a jQuery selection.
	 * @param  target	element - the target input field or division or span
	 * @param  settings  object - the new settings to use for this date picker instance (anonymous)
	 */
	_attachDatepicker: function(target, settings) {
		var nodeName, inline, inst;
		nodeName = target.nodeName.toLowerCase();
		inline = (nodeName === "div" || nodeName === "span");
		if (!target.id) {
			this.uuid += 1;
			target.id = "dp" + this.uuid;
		}
		inst = this._newInst($(target), inline);
		inst.settings = $.extend({}, settings || {});
		if (nodeName === "input") {
			this._connectDatepicker(target, inst);
		} else if (inline) {
			this._inlineDatepicker(target, inst);
		}
	},

	/* Create a new instance object. */
	_newInst: function(target, inline) {
		var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"); // escape jQuery meta chars
		return {id: id, input: target, // associated target
			selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
			drawMonth: 0, drawYear: 0, // month being drawn
			inline: inline, // is datepicker inline or not
			dpDiv: (!inline ? this.dpDiv : // presentation div
			datepicker_bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")))};
	},

	/* Attach the date picker to an input field. */
	_connectDatepicker: function(target, inst) {
		var input = $(target);
		inst.append = $([]);
		inst.trigger = $([]);
		if (input.hasClass(this.markerClassName)) {
			return;
		}
		this._attachments(input, inst);
		input.addClass(this.markerClassName).keydown(this._doKeyDown).
			keypress(this._doKeyPress).keyup(this._doKeyUp);
		this._autoSize(inst);
		$.data(target, "datepicker", inst);
		//If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
		if( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
	},

	/* Make attachments based on settings. */
	_attachments: function(input, inst) {
		var showOn, buttonText, buttonImage,
			appendText = this._get(inst, "appendText"),
			isRTL = this._get(inst, "isRTL");

		if (inst.append) {
			inst.append.remove();
		}
		if (appendText) {
			inst.append = $("<span class='" + this._appendClass + "'>" + appendText + "</span>");
			input[isRTL ? "before" : "after"](inst.append);
		}

		input.unbind("focus", this._showDatepicker);

		if (inst.trigger) {
			inst.trigger.remove();
		}

		showOn = this._get(inst, "showOn");
		if (showOn === "focus" || showOn === "both") { // pop-up date picker when in the marked field
			input.focus(this._showDatepicker);
		}
		if (showOn === "button" || showOn === "both") { // pop-up date picker when button clicked
			buttonText = this._get(inst, "buttonText");
			buttonImage = this._get(inst, "buttonImage");
			inst.trigger = $(this._get(inst, "buttonImageOnly") ?
				$("<img/>").addClass(this._triggerClass).
					attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
				$("<button type='button'></button>").addClass(this._triggerClass).
					html(!buttonImage ? buttonText : $("<img/>").attr(
					{ src:buttonImage, alt:buttonText, title:buttonText })));
			input[isRTL ? "before" : "after"](inst.trigger);
			inst.trigger.click(function() {
				if ($.datepicker._datepickerShowing && $.datepicker._lastInput === input[0]) {
					$.datepicker._hideDatepicker();
				} else if ($.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0]) {
					$.datepicker._hideDatepicker();
					$.datepicker._showDatepicker(input[0]);
				} else {
					$.datepicker._showDatepicker(input[0]);
				}
				return false;
			});
		}
	},

	/* Apply the maximum length for the date format. */
	_autoSize: function(inst) {
		if (this._get(inst, "autoSize") && !inst.inline) {
			var findMax, max, maxI, i,
				date = new Date(2009, 12 - 1, 20), // Ensure double digits
				dateFormat = this._get(inst, "dateFormat");

			if (dateFormat.match(/[DM]/)) {
				findMax = function(names) {
					max = 0;
					maxI = 0;
					for (i = 0; i < names.length; i++) {
						if (names[i].length > max) {
							max = names[i].length;
							maxI = i;
						}
					}
					return maxI;
				};
				date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
					"monthNames" : "monthNamesShort"))));
				date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
					"dayNames" : "dayNamesShort"))) + 20 - date.getDay());
			}
			inst.input.attr("size", this._formatDate(inst, date).length);
		}
	},

	/* Attach an inline date picker to a div. */
	_inlineDatepicker: function(target, inst) {
		var divSpan = $(target);
		if (divSpan.hasClass(this.markerClassName)) {
			return;
		}
		divSpan.addClass(this.markerClassName).append(inst.dpDiv);
		$.data(target, "datepicker", inst);
		this._setDate(inst, this._getDefaultDate(inst), true);
		this._updateDatepicker(inst);
		this._updateAlternate(inst);
		//If disabled option is true, disable the datepicker before showing it (see ticket #5665)
		if( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
		// Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
		// http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
		inst.dpDiv.css( "display", "block" );
	},

	/* Pop-up the date picker in a "dialog" box.
	 * @param  input element - ignored
	 * @param  date	string or Date - the initial date to display
	 * @param  onSelect  function - the function to call when a date is selected
	 * @param  settings  object - update the dialog date picker instance's settings (anonymous object)
	 * @param  pos int[2] - coordinates for the dialog's position within the screen or
	 *					event - with x/y coordinates or
	 *					leave empty for default (screen centre)
	 * @return the manager object
	 */
	_dialogDatepicker: function(input, date, onSelect, settings, pos) {
		var id, browserWidth, browserHeight, scrollX, scrollY,
			inst = this._dialogInst; // internal instance

		if (!inst) {
			this.uuid += 1;
			id = "dp" + this.uuid;
			this._dialogInput = $("<input type='text' id='" + id +
				"' style='position: absolute; top: -100px; width: 0px;'/>");
			this._dialogInput.keydown(this._doKeyDown);
			$("body").append(this._dialogInput);
			inst = this._dialogInst = this._newInst(this._dialogInput, false);
			inst.settings = {};
			$.data(this._dialogInput[0], "datepicker", inst);
		}
		datepicker_extendRemove(inst.settings, settings || {});
		date = (date && date.constructor === Date ? this._formatDate(inst, date) : date);
		this._dialogInput.val(date);

		this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
		if (!this._pos) {
			browserWidth = document.documentElement.clientWidth;
			browserHeight = document.documentElement.clientHeight;
			scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
			scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			this._pos = // should use actual width/height below
				[(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
		}

		// move input on screen for focus, but hidden behind dialog
		this._dialogInput.css("left", (this._pos[0] + 20) + "px").css("top", this._pos[1] + "px");
		inst.settings.onSelect = onSelect;
		this._inDialog = true;
		this.dpDiv.addClass(this._dialogClass);
		this._showDatepicker(this._dialogInput[0]);
		if ($.blockUI) {
			$.blockUI(this.dpDiv);
		}
		$.data(this._dialogInput[0], "datepicker", inst);
		return this;
	},

	/* Detach a datepicker from its control.
	 * @param  target	element - the target input field or division or span
	 */
	_destroyDatepicker: function(target) {
		var nodeName,
			$target = $(target),
			inst = $.data(target, "datepicker");

		if (!$target.hasClass(this.markerClassName)) {
			return;
		}

		nodeName = target.nodeName.toLowerCase();
		$.removeData(target, "datepicker");
		if (nodeName === "input") {
			inst.append.remove();
			inst.trigger.remove();
			$target.removeClass(this.markerClassName).
				unbind("focus", this._showDatepicker).
				unbind("keydown", this._doKeyDown).
				unbind("keypress", this._doKeyPress).
				unbind("keyup", this._doKeyUp);
		} else if (nodeName === "div" || nodeName === "span") {
			$target.removeClass(this.markerClassName).empty();
		}

		if ( datepicker_instActive === inst ) {
			datepicker_instActive = null;
		}
	},

	/* Enable the date picker to a jQuery selection.
	 * @param  target	element - the target input field or division or span
	 */
	_enableDatepicker: function(target) {
		var nodeName, inline,
			$target = $(target),
			inst = $.data(target, "datepicker");

		if (!$target.hasClass(this.markerClassName)) {
			return;
		}

		nodeName = target.nodeName.toLowerCase();
		if (nodeName === "input") {
			target.disabled = false;
			inst.trigger.filter("button").
				each(function() { this.disabled = false; }).end().
				filter("img").css({opacity: "1.0", cursor: ""});
		} else if (nodeName === "div" || nodeName === "span") {
			inline = $target.children("." + this._inlineClass);
			inline.children().removeClass("ui-state-disabled");
			inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
				prop("disabled", false);
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value === target ? null : value); }); // delete entry
	},

	/* Disable the date picker to a jQuery selection.
	 * @param  target	element - the target input field or division or span
	 */
	_disableDatepicker: function(target) {
		var nodeName, inline,
			$target = $(target),
			inst = $.data(target, "datepicker");

		if (!$target.hasClass(this.markerClassName)) {
			return;
		}

		nodeName = target.nodeName.toLowerCase();
		if (nodeName === "input") {
			target.disabled = true;
			inst.trigger.filter("button").
				each(function() { this.disabled = true; }).end().
				filter("img").css({opacity: "0.5", cursor: "default"});
		} else if (nodeName === "div" || nodeName === "span") {
			inline = $target.children("." + this._inlineClass);
			inline.children().addClass("ui-state-disabled");
			inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
				prop("disabled", true);
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value === target ? null : value); }); // delete entry
		this._disabledInputs[this._disabledInputs.length] = target;
	},

	/* Is the first field in a jQuery collection disabled as a datepicker?
	 * @param  target	element - the target input field or division or span
	 * @return boolean - true if disabled, false if enabled
	 */
	_isDisabledDatepicker: function(target) {
		if (!target) {
			return false;
		}
		for (var i = 0; i < this._disabledInputs.length; i++) {
			if (this._disabledInputs[i] === target) {
				return true;
			}
		}
		return false;
	},

	/* Retrieve the instance data for the target control.
	 * @param  target  element - the target input field or division or span
	 * @return  object - the associated instance data
	 * @throws  error if a jQuery problem getting data
	 */
	_getInst: function(target) {
		try {
			return $.data(target, "datepicker");
		}
		catch (err) {
			throw "Missing instance data for this datepicker";
		}
	},

	/* Update or retrieve the settings for a date picker attached to an input field or division.
	 * @param  target  element - the target input field or division or span
	 * @param  name	object - the new settings to update or
	 *				string - the name of the setting to change or retrieve,
	 *				when retrieving also "all" for all instance settings or
	 *				"defaults" for all global defaults
	 * @param  value   any - the new value for the setting
	 *				(omit if above is an object or to retrieve a value)
	 */
	_optionDatepicker: function(target, name, value) {
		var settings, date, minDate, maxDate,
			inst = this._getInst(target);

		if (arguments.length === 2 && typeof name === "string") {
			return (name === "defaults" ? $.extend({}, $.datepicker._defaults) :
				(inst ? (name === "all" ? $.extend({}, inst.settings) :
				this._get(inst, name)) : null));
		}

		settings = name || {};
		if (typeof name === "string") {
			settings = {};
			settings[name] = value;
		}

		if (inst) {
			if (this._curInst === inst) {
				this._hideDatepicker();
			}

			date = this._getDateDatepicker(target, true);
			minDate = this._getMinMaxDate(inst, "min");
			maxDate = this._getMinMaxDate(inst, "max");
			datepicker_extendRemove(inst.settings, settings);
			// reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
			if (minDate !== null && settings.dateFormat !== undefined && settings.minDate === undefined) {
				inst.settings.minDate = this._formatDate(inst, minDate);
			}
			if (maxDate !== null && settings.dateFormat !== undefined && settings.maxDate === undefined) {
				inst.settings.maxDate = this._formatDate(inst, maxDate);
			}
			if ( "disabled" in settings ) {
				if ( settings.disabled ) {
					this._disableDatepicker(target);
				} else {
					this._enableDatepicker(target);
				}
			}
			this._attachments($(target), inst);
			this._autoSize(inst);
			this._setDate(inst, date);
			this._updateAlternate(inst);
			this._updateDatepicker(inst);
		}
	},

	// change method deprecated
	_changeDatepicker: function(target, name, value) {
		this._optionDatepicker(target, name, value);
	},

	/* Redraw the date picker attached to an input field or division.
	 * @param  target  element - the target input field or division or span
	 */
	_refreshDatepicker: function(target) {
		var inst = this._getInst(target);
		if (inst) {
			this._updateDatepicker(inst);
		}
	},

	/* Set the dates for a jQuery selection.
	 * @param  target element - the target input field or division or span
	 * @param  date	Date - the new date
	 */
	_setDateDatepicker: function(target, date) {
		var inst = this._getInst(target);
		if (inst) {
			this._setDate(inst, date);
			this._updateDatepicker(inst);
			this._updateAlternate(inst);
		}
	},

	/* Get the date(s) for the first entry in a jQuery selection.
	 * @param  target element - the target input field or division or span
	 * @param  noDefault boolean - true if no default date is to be used
	 * @return Date - the current date
	 */
	_getDateDatepicker: function(target, noDefault) {
		var inst = this._getInst(target);
		if (inst && !inst.inline) {
			this._setDateFromField(inst, noDefault);
		}
		return (inst ? this._getDate(inst) : null);
	},

	/* Handle keystrokes. */
	_doKeyDown: function(event) {
		var onSelect, dateStr, sel,
			inst = $.datepicker._getInst(event.target),
			handled = true,
			isRTL = inst.dpDiv.is(".ui-datepicker-rtl");

		inst._keyEvent = true;
		if ($.datepicker._datepickerShowing) {
			switch (event.keyCode) {
				case 9: $.datepicker._hideDatepicker();
						handled = false;
						break; // hide on tab out
				case 13: sel = $("td." + $.datepicker._dayOverClass + ":not(." +
									$.datepicker._currentClass + ")", inst.dpDiv);
						if (sel[0]) {
							$.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
						}

						onSelect = $.datepicker._get(inst, "onSelect");
						if (onSelect) {
							dateStr = $.datepicker._formatDate(inst);

							// trigger custom callback
							onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
						} else {
							$.datepicker._hideDatepicker();
						}

						return false; // don't submit the form
				case 27: $.datepicker._hideDatepicker();
						break; // hide on escape
				case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							-$.datepicker._get(inst, "stepBigMonths") :
							-$.datepicker._get(inst, "stepMonths")), "M");
						break; // previous month/year on page up/+ ctrl
				case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							+$.datepicker._get(inst, "stepBigMonths") :
							+$.datepicker._get(inst, "stepMonths")), "M");
						break; // next month/year on page down/+ ctrl
				case 35: if (event.ctrlKey || event.metaKey) {
							$.datepicker._clearDate(event.target);
						}
						handled = event.ctrlKey || event.metaKey;
						break; // clear on ctrl or command +end
				case 36: if (event.ctrlKey || event.metaKey) {
							$.datepicker._gotoToday(event.target);
						}
						handled = event.ctrlKey || event.metaKey;
						break; // current on ctrl or command +home
				case 37: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), "D");
						}
						handled = event.ctrlKey || event.metaKey;
						// -1 day on ctrl or command +left
						if (event.originalEvent.altKey) {
							$.datepicker._adjustDate(event.target, (event.ctrlKey ?
								-$.datepicker._get(inst, "stepBigMonths") :
								-$.datepicker._get(inst, "stepMonths")), "M");
						}
						// next month/year on alt +left on Mac
						break;
				case 38: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, -7, "D");
						}
						handled = event.ctrlKey || event.metaKey;
						break; // -1 week on ctrl or command +up
				case 39: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), "D");
						}
						handled = event.ctrlKey || event.metaKey;
						// +1 day on ctrl or command +right
						if (event.originalEvent.altKey) {
							$.datepicker._adjustDate(event.target, (event.ctrlKey ?
								+$.datepicker._get(inst, "stepBigMonths") :
								+$.datepicker._get(inst, "stepMonths")), "M");
						}
						// next month/year on alt +right
						break;
				case 40: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, +7, "D");
						}
						handled = event.ctrlKey || event.metaKey;
						break; // +1 week on ctrl or command +down
				default: handled = false;
			}
		} else if (event.keyCode === 36 && event.ctrlKey) { // display the date picker on ctrl+home
			$.datepicker._showDatepicker(this);
		} else {
			handled = false;
		}

		if (handled) {
			event.preventDefault();
			event.stopPropagation();
		}
	},

	/* Filter entered characters - based on date format. */
	_doKeyPress: function(event) {
		var chars, chr,
			inst = $.datepicker._getInst(event.target);

		if ($.datepicker._get(inst, "constrainInput")) {
			chars = $.datepicker._possibleChars($.datepicker._get(inst, "dateFormat"));
			chr = String.fromCharCode(event.charCode == null ? event.keyCode : event.charCode);
			return event.ctrlKey || event.metaKey || (chr < " " || !chars || chars.indexOf(chr) > -1);
		}
	},

	/* Synchronise manual entry and field/alternate field. */
	_doKeyUp: function(event) {
		var date,
			inst = $.datepicker._getInst(event.target);

		if (inst.input.val() !== inst.lastVal) {
			try {
				date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
					(inst.input ? inst.input.val() : null),
					$.datepicker._getFormatConfig(inst));

				if (date) { // only if valid
					$.datepicker._setDateFromField(inst);
					$.datepicker._updateAlternate(inst);
					$.datepicker._updateDatepicker(inst);
				}
			}
			catch (err) {
			}
		}
		return true;
	},

	/* Pop-up the date picker for a given input field.
	 * If false returned from beforeShow event handler do not show.
	 * @param  input  element - the input field attached to the date picker or
	 *					event - if triggered by focus
	 */
	_showDatepicker: function(input) {
		input = input.target || input;
		if (input.nodeName.toLowerCase() !== "input") { // find from button/image trigger
			input = $("input", input.parentNode)[0];
		}

		if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput === input) { // already here
			return;
		}

		var inst, beforeShow, beforeShowSettings, isFixed,
			offset, showAnim, duration;

		inst = $.datepicker._getInst(input);
		if ($.datepicker._curInst && $.datepicker._curInst !== inst) {
			$.datepicker._curInst.dpDiv.stop(true, true);
			if ( inst && $.datepicker._datepickerShowing ) {
				$.datepicker._hideDatepicker( $.datepicker._curInst.input[0] );
			}
		}

		beforeShow = $.datepicker._get(inst, "beforeShow");
		beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
		if(beforeShowSettings === false){
			return;
		}
		datepicker_extendRemove(inst.settings, beforeShowSettings);

		inst.lastVal = null;
		$.datepicker._lastInput = input;
		$.datepicker._setDateFromField(inst);

		if ($.datepicker._inDialog) { // hide cursor
			input.value = "";
		}
		if (!$.datepicker._pos) { // position below input
			$.datepicker._pos = $.datepicker._findPos(input);
			$.datepicker._pos[1] += input.offsetHeight; // add the height
		}

		isFixed = false;
		$(input).parents().each(function() {
			isFixed |= $(this).css("position") === "fixed";
			return !isFixed;
		});

		offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
		$.datepicker._pos = null;
		//to avoid flashes on Firefox
		inst.dpDiv.empty();
		// determine sizing offscreen
		inst.dpDiv.css({position: "absolute", display: "block", top: "-1000px"});
		$.datepicker._updateDatepicker(inst);
		// fix width for dynamic number of date pickers
		// and adjust position before showing
		offset = $.datepicker._checkOffset(inst, offset, isFixed);
		inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
			"static" : (isFixed ? "fixed" : "absolute")), display: "none",
			left: offset.left + "px", top: offset.top + "px"});

		if (!inst.inline) {
			showAnim = $.datepicker._get(inst, "showAnim");
			duration = $.datepicker._get(inst, "duration");
			inst.dpDiv.css( "z-index", datepicker_getZindex( $( input ) ) + 1 );
			$.datepicker._datepickerShowing = true;

			if ( $.effects && $.effects.effect[ showAnim ] ) {
				inst.dpDiv.show(showAnim, $.datepicker._get(inst, "showOptions"), duration);
			} else {
				inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
			}

			if ( $.datepicker._shouldFocusInput( inst ) ) {
				inst.input.focus();
			}

			$.datepicker._curInst = inst;
		}
	},

	/* Generate the date picker content. */
	_updateDatepicker: function(inst) {
		this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
		datepicker_instActive = inst; // for delegate hover events

		inst.dpDiv.empty();
		var changeMonth = this._get(inst, "changeMonth"),
		    changeYear = this._get(inst, "changeYear"),
		    selectmenuOptions = this._get(inst, "selectmenuOptions");
		changeMonth && $(".ui-datepicker-month").selectmenu("destroy");
		changeYear && $(".ui-datepicker-year").selectmenu("destroy");

		inst.dpDiv.append(this._generateHTML(inst));
		changeMonth && $('.ui-datepicker-month').selectmenu(selectmenuOptions);
		changeYear && $('.ui-datepicker-year').selectmenu(selectmenuOptions);
		this._attachHandlers(inst);

		var origyearshtml,
			numMonths = this._getNumberOfMonths(inst),
			cols = numMonths[1],
			width = 17,
			activeCell = inst.dpDiv.find( "." + this._dayOverClass + " a" );

		if ( activeCell.length > 0 ) {
			datepicker_handleMouseover.apply( activeCell.get( 0 ) );
		}

		inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
		if (cols > 1) {
			inst.dpDiv.addClass("ui-datepicker-multi-" + cols).css("width", (width * cols) + "em");
		}
		inst.dpDiv[(numMonths[0] !== 1 || numMonths[1] !== 1 ? "add" : "remove") +
			"Class"]("ui-datepicker-multi");
		inst.dpDiv[(this._get(inst, "isRTL") ? "add" : "remove") +
			"Class"]("ui-datepicker-rtl");

		if (inst === $.datepicker._curInst && $.datepicker._datepickerShowing && $.datepicker._shouldFocusInput( inst ) ) {
			inst.input.focus();
		}

		// deffered render of the years select (to avoid flashes on Firefox)
		if( inst.yearshtml ){
			origyearshtml = inst.yearshtml;
			setTimeout(function(){
				//assure that inst.yearshtml didn't change.
				if( origyearshtml === inst.yearshtml && inst.yearshtml ){
					inst.dpDiv.find("select.ui-datepicker-year:first").replaceWith(inst.yearshtml);
				}
				origyearshtml = inst.yearshtml = null;
			}, 0);
		}
	},

	// #6694 - don't focus the input if it's already focused
	// this breaks the change event in IE
	// Support: IE and jQuery <1.9
	_shouldFocusInput: function( inst ) {
		return inst.input && inst.input.is( ":visible" ) && !inst.input.is( ":disabled" ) && !inst.input.is( ":focus" );
	},

	/* Check positioning to remain on screen. */
	_checkOffset: function(inst, offset, isFixed) {
		var dpWidth = inst.dpDiv.outerWidth(),
			dpHeight = inst.dpDiv.outerHeight(),
			inputWidth = inst.input ? inst.input.outerWidth() : 0,
			inputHeight = inst.input ? inst.input.outerHeight() : 0,
			viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft()),
			viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

		offset.left -= (this._get(inst, "isRTL") ? (dpWidth - inputWidth) : 0);
		offset.left -= (isFixed && offset.left === inst.input.offset().left) ? $(document).scrollLeft() : 0;
		offset.top -= (isFixed && offset.top === (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

		// now check if datepicker is showing outside window viewport - move to a better place if so.
		offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
			Math.abs(offset.left + dpWidth - viewWidth) : 0);
		offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
			Math.abs(dpHeight + inputHeight) : 0);

		return offset;
	},

	/* Find an object's position on the screen. */
	_findPos: function(obj) {
		var position,
			inst = this._getInst(obj),
			isRTL = this._get(inst, "isRTL");

		while (obj && (obj.type === "hidden" || obj.nodeType !== 1 || $.expr.filters.hidden(obj))) {
			obj = obj[isRTL ? "previousSibling" : "nextSibling"];
		}

		position = $(obj).offset();
		return [position.left, position.top];
	},

	/* Hide the date picker from view.
	 * @param  input  element - the input field attached to the date picker
	 */
	_hideDatepicker: function(input) {
		var showAnim, duration, postProcess, onClose,
			inst = this._curInst;

		if (!inst || (input && inst !== $.data(input, "datepicker"))) {
			return;
		}

		if (this._datepickerShowing) {
			showAnim = this._get(inst, "showAnim");
			duration = this._get(inst, "duration");
			postProcess = function() {
				$.datepicker._tidyDialog(inst);
			};

			// DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
			if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) ) {
				inst.dpDiv.hide(showAnim, $.datepicker._get(inst, "showOptions"), duration, postProcess);
			} else {
				inst.dpDiv[(showAnim === "slideDown" ? "slideUp" :
					(showAnim === "fadeIn" ? "fadeOut" : "hide"))]((showAnim ? duration : null), postProcess);
			}

			if (!showAnim) {
				postProcess();
			}
			this._datepickerShowing = false;

			onClose = this._get(inst, "onClose");
			if (onClose) {
				onClose.apply((inst.input ? inst.input[0] : null), [(inst.input ? inst.input.val() : ""), inst]);
			}

			this._lastInput = null;
			if (this._inDialog) {
				this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" });
				if ($.blockUI) {
					$.unblockUI();
					$("body").append(this.dpDiv);
				}
			}
			this._inDialog = false;
		}
	},

	/* Tidy up after a dialog display. */
	_tidyDialog: function(inst) {
		inst.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
	},

	/* Close date picker if clicked elsewhere. */
	_checkExternalClick: function(event) {
		if (!$.datepicker._curInst) {
			return;
		}

		var $target = $(event.target),
			inst = $.datepicker._getInst($target[0]);

		var $selects = $("#" + $.datepicker._mainDivId).find("select");
		for (var i = 0, n = $selects.length; i < n; i++) {
			var $menu = $("#" + $selects.eq(i)[0].id + "-menu");
			if ($menu.length > 0 && $.contains($menu[0], $target[0])) {
				show = true;
				return;
			}
		}

		if ( ( ( $target[0].id !== $.datepicker._mainDivId &&
				$target.parents("#" + $.datepicker._mainDivId).length === 0 &&
				!$target.hasClass($.datepicker.markerClassName) &&
				!$target.closest("." + $.datepicker._triggerClass).length &&
				$.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI) ) ) ||
			( $target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst !== inst ) ) {
				$.datepicker._hideDatepicker();
		}
	},

	/* Adjust one of the date sub-fields. */
	_adjustDate: function(id, offset, period) {
		var target = $(id),
			inst = this._getInst(target[0]);

		if (this._isDisabledDatepicker(target[0])) {
			return;
		}
		this._adjustInstDate(inst, offset +
			(period === "M" ? this._get(inst, "showCurrentAtPos") : 0), // undo positioning
			period);
		this._updateDatepicker(inst);
	},

	/* Action for current link. */
	_gotoToday: function(id) {
		var date,
			target = $(id),
			inst = this._getInst(target[0]);

		if (this._get(inst, "gotoCurrent") && inst.currentDay) {
			inst.selectedDay = inst.currentDay;
			inst.drawMonth = inst.selectedMonth = inst.currentMonth;
			inst.drawYear = inst.selectedYear = inst.currentYear;
		} else {
			date = new Date();
			inst.selectedDay = date.getDate();
			inst.drawMonth = inst.selectedMonth = date.getMonth();
			inst.drawYear = inst.selectedYear = date.getFullYear();
		}
		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Action for selecting a new month/year. */
	_selectMonthYear: function(id, select, period) {
		var target = $(id),
			inst = this._getInst(target[0]);

		inst["selected" + (period === "M" ? "Month" : "Year")] =
		inst["draw" + (period === "M" ? "Month" : "Year")] =
			parseInt(select.options[select.selectedIndex].value,10);

		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Action for selecting a day. */
	_selectDay: function(id, month, year, td) {
		var inst,
			target = $(id);

		if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
			return;
		}

		inst = this._getInst(target[0]);
		inst.selectedDay = inst.currentDay = $("a", td).html();
		inst.selectedMonth = inst.currentMonth = month;
		inst.selectedYear = inst.currentYear = year;
		this._selectDate(id, this._formatDate(inst,
			inst.currentDay, inst.currentMonth, inst.currentYear));
	},

	/* Erase the input field and hide the date picker. */
	_clearDate: function(id) {
		var target = $(id);
		this._selectDate(target, "");
	},

	/* Update the input field with the selected date. */
	_selectDate: function(id, dateStr) {
		var onSelect,
			target = $(id),
			inst = this._getInst(target[0]);

		dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
		if (inst.input) {
			inst.input.val(dateStr);
		}
		this._updateAlternate(inst);

		onSelect = this._get(inst, "onSelect");
		if (onSelect) {
			onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
		} else if (inst.input) {
			inst.input.trigger("change"); // fire the change event
		}

		if (inst.inline){
			this._updateDatepicker(inst);
		} else {
			this._hideDatepicker();
			this._lastInput = inst.input[0];
			if (typeof(inst.input[0]) !== "object") {
				inst.input.focus(); // restore focus
			}
			this._lastInput = null;
		}
	},

	/* Update any alternate field to synchronise with the main field. */
	_updateAlternate: function(inst) {
		var altFormat, date, dateStr,
			altField = this._get(inst, "altField");

		if (altField) { // update alternate field too
			altFormat = this._get(inst, "altFormat") || this._get(inst, "dateFormat");
			date = this._getDate(inst);
			dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
			$(altField).each(function() { $(this).val(dateStr); });
		}
	},

	/* Set as beforeShowDay function to prevent selection of weekends.
	 * @param  date  Date - the date to customise
	 * @return [boolean, string] - is this date selectable?, what is its CSS class?
	 */
	noWeekends: function(date) {
		var day = date.getDay();
		return [(day > 0 && day < 6), ""];
	},

	/* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
	 * @param  date  Date - the date to get the week for
	 * @return  number - the number of the week within the year that contains this date
	 */
	iso8601Week: function(date) {
		var time,
			checkDate = new Date(date.getTime());

		// Find Thursday of this week starting on Monday
		checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

		time = checkDate.getTime();
		checkDate.setMonth(0); // Compare with Jan 1
		checkDate.setDate(1);
		return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
	},

	/* Parse a string value into a date object.
	 * See formatDate below for the possible formats.
	 *
	 * @param  format string - the expected format of the date
	 * @param  value string - the date in the above format
	 * @param  settings Object - attributes include:
	 *					shortYearCutoff  number - the cutoff year for determining the century (optional)
	 *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
	 *					dayNames		string[7] - names of the days from Sunday (optional)
	 *					monthNamesShort string[12] - abbreviated names of the months (optional)
	 *					monthNames		string[12] - names of the months (optional)
	 * @return  Date - the extracted date value or null if value is blank
	 */
	parseDate: function (format, value, settings) {
		if (format == null || value == null) {
			throw "Invalid arguments";
		}

		value = (typeof value === "object" ? value.toString() : value + "");
		if (value === "") {
			return null;
		}

		var iFormat, dim, extra,
			iValue = 0,
			shortYearCutoffTemp = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff,
			shortYearCutoff = (typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp :
				new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10)),
			dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
			dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
			monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
			monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
			year = -1,
			month = -1,
			day = -1,
			doy = -1,
			literal = false,
			date,
			// Check whether a format character is doubled
			lookAhead = function(match) {
				var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
				if (matches) {
					iFormat++;
				}
				return matches;
			},
			// Extract a number from the string value
			getNumber = function(match) {
				var isDoubled = lookAhead(match),
					size = (match === "@" ? 14 : (match === "!" ? 20 :
					(match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
					minSize = (match === "y" ? size : 1),
					digits = new RegExp("^\\d{" + minSize + "," + size + "}"),
					num = value.substring(iValue).match(digits);
				if (!num) {
					throw "Missing number at position " + iValue;
				}
				iValue += num[0].length;
				return parseInt(num[0], 10);
			},
			// Extract a name from the string value and convert to an index
			getName = function(match, shortNames, longNames) {
				var index = -1,
					names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
						return [ [k, v] ];
					}).sort(function (a, b) {
						return -(a[1].length - b[1].length);
					});

				$.each(names, function (i, pair) {
					var name = pair[1];
					if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
						index = pair[0];
						iValue += name.length;
						return false;
					}
				});
				if (index !== -1) {
					return index + 1;
				} else {
					throw "Unknown name at position " + iValue;
				}
			},
			// Confirm that a literal character matches the string value
			checkLiteral = function() {
				if (value.charAt(iValue) !== format.charAt(iFormat)) {
					throw "Unexpected literal at position " + iValue;
				}
				iValue++;
			};

		for (iFormat = 0; iFormat < format.length; iFormat++) {
			if (literal) {
				if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
					literal = false;
				} else {
					checkLiteral();
				}
			} else {
				switch (format.charAt(iFormat)) {
					case "d":
						day = getNumber("d");
						break;
					case "D":
						getName("D", dayNamesShort, dayNames);
						break;
					case "o":
						doy = getNumber("o");
						break;
					case "m":
						month = getNumber("m");
						break;
					case "M":
						month = getName("M", monthNamesShort, monthNames);
						break;
					case "y":
						year = getNumber("y");
						break;
					case "@":
						date = new Date(getNumber("@"));
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "!":
						date = new Date((getNumber("!") - this._ticksTo1970) / 10000);
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "'":
						if (lookAhead("'")){
							checkLiteral();
						} else {
							literal = true;
						}
						break;
					default:
						checkLiteral();
				}
			}
		}

		if (iValue < value.length){
			extra = value.substr(iValue);
			if (!/^\s+/.test(extra)) {
				throw "Extra/unparsed characters found in date: " + extra;
			}
		}

		if (year === -1) {
			year = new Date().getFullYear();
		} else if (year < 100) {
			year += new Date().getFullYear() - new Date().getFullYear() % 100 +
				(year <= shortYearCutoff ? 0 : -100);
		}

		if (doy > -1) {
			month = 1;
			day = doy;
			do {
				dim = this._getDaysInMonth(year, month - 1);
				if (day <= dim) {
					break;
				}
				month++;
				day -= dim;
			} while (true);
		}

		date = this._daylightSavingAdjust(new Date(year, month - 1, day));
		if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
			throw "Invalid date"; // E.g. 31/02/00
		}
		return date;
	},

	/* Standard date formats. */
	ATOM: "yy-mm-dd", // RFC 3339 (ISO 8601)
	COOKIE: "D, dd M yy",
	ISO_8601: "yy-mm-dd",
	RFC_822: "D, d M y",
	RFC_850: "DD, dd-M-y",
	RFC_1036: "D, d M y",
	RFC_1123: "D, d M yy",
	RFC_2822: "D, d M yy",
	RSS: "D, d M y", // RFC 822
	TICKS: "!",
	TIMESTAMP: "@",
	W3C: "yy-mm-dd", // ISO 8601

	_ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
		Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

	/* Format a date object into a string value.
	 * The format can be combinations of the following:
	 * d  - day of month (no leading zero)
	 * dd - day of month (two digit)
	 * o  - day of year (no leading zeros)
	 * oo - day of year (three digit)
	 * D  - day name short
	 * DD - day name long
	 * m  - month of year (no leading zero)
	 * mm - month of year (two digit)
	 * M  - month name short
	 * MM - month name long
	 * y  - year (two digit)
	 * yy - year (four digit)
	 * @ - Unix timestamp (ms since 01/01/1970)
	 * ! - Windows ticks (100ns since 01/01/0001)
	 * "..." - literal text
	 * '' - single quote
	 *
	 * @param  format string - the desired format of the date
	 * @param  date Date - the date value to format
	 * @param  settings Object - attributes include:
	 *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
	 *					dayNames		string[7] - names of the days from Sunday (optional)
	 *					monthNamesShort string[12] - abbreviated names of the months (optional)
	 *					monthNames		string[12] - names of the months (optional)
	 * @return  string - the date in the above format
	 */
	formatDate: function (format, date, settings) {
		if (!date) {
			return "";
		}

		var iFormat,
			dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
			dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
			monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
			monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
			// Check whether a format character is doubled
			lookAhead = function(match) {
				var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
				if (matches) {
					iFormat++;
				}
				return matches;
			},
			// Format a number, with leading zero if necessary
			formatNumber = function(match, value, len) {
				var num = "" + value;
				if (lookAhead(match)) {
					while (num.length < len) {
						num = "0" + num;
					}
				}
				return num;
			},
			// Format a name, short or long as requested
			formatName = function(match, value, shortNames, longNames) {
				return (lookAhead(match) ? longNames[value] : shortNames[value]);
			},
			output = "",
			literal = false;

		if (date) {
			for (iFormat = 0; iFormat < format.length; iFormat++) {
				if (literal) {
					if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
						literal = false;
					} else {
						output += format.charAt(iFormat);
					}
				} else {
					switch (format.charAt(iFormat)) {
						case "d":
							output += formatNumber("d", date.getDate(), 2);
							break;
						case "D":
							output += formatName("D", date.getDay(), dayNamesShort, dayNames);
							break;
						case "o":
							output += formatNumber("o",
								Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
							break;
						case "m":
							output += formatNumber("m", date.getMonth() + 1, 2);
							break;
						case "M":
							output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
							break;
						case "y":
							output += (lookAhead("y") ? date.getFullYear() :
								(date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
							break;
						case "@":
							output += date.getTime();
							break;
						case "!":
							output += date.getTime() * 10000 + this._ticksTo1970;
							break;
						case "'":
							if (lookAhead("'")) {
								output += "'";
							} else {
								literal = true;
							}
							break;
						default:
							output += format.charAt(iFormat);
					}
				}
			}
		}
		return output;
	},

	/* Extract all possible characters from the date format. */
	_possibleChars: function (format) {
		var iFormat,
			chars = "",
			literal = false,
			// Check whether a format character is doubled
			lookAhead = function(match) {
				var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
				if (matches) {
					iFormat++;
				}
				return matches;
			};

		for (iFormat = 0; iFormat < format.length; iFormat++) {
			if (literal) {
				if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
					literal = false;
				} else {
					chars += format.charAt(iFormat);
				}
			} else {
				switch (format.charAt(iFormat)) {
					case "d": case "m": case "y": case "@":
						chars += "0123456789";
						break;
					case "D": case "M":
						return null; // Accept anything
					case "'":
						if (lookAhead("'")) {
							chars += "'";
						} else {
							literal = true;
						}
						break;
					default:
						chars += format.charAt(iFormat);
				}
			}
		}
		return chars;
	},

	/* Get a setting value, defaulting if necessary. */
	_get: function(inst, name) {
		return inst.settings[name] !== undefined ?
			inst.settings[name] : this._defaults[name];
	},

	/* Parse existing date and initialise date picker. */
	_setDateFromField: function(inst, noDefault) {
		if (inst.input.val() === inst.lastVal) {
			return;
		}

		var dateFormat = this._get(inst, "dateFormat"),
			dates = inst.lastVal = inst.input ? inst.input.val() : null,
			defaultDate = this._getDefaultDate(inst),
			date = defaultDate,
			settings = this._getFormatConfig(inst);

		try {
			date = this.parseDate(dateFormat, dates, settings) || defaultDate;
		} catch (event) {
			dates = (noDefault ? "" : dates);
		}
		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		inst.currentDay = (dates ? date.getDate() : 0);
		inst.currentMonth = (dates ? date.getMonth() : 0);
		inst.currentYear = (dates ? date.getFullYear() : 0);
		this._adjustInstDate(inst);
	},

	/* Retrieve the default date shown on opening. */
	_getDefaultDate: function(inst) {
		return this._restrictMinMax(inst,
			this._determineDate(inst, this._get(inst, "defaultDate"), new Date()));
	},

	/* A date may be specified as an exact value or a relative one. */
	_determineDate: function(inst, date, defaultDate) {
		var offsetNumeric = function(offset) {
				var date = new Date();
				date.setDate(date.getDate() + offset);
				return date;
			},
			offsetString = function(offset) {
				try {
					return $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
						offset, $.datepicker._getFormatConfig(inst));
				}
				catch (e) {
					// Ignore
				}

				var date = (offset.toLowerCase().match(/^c/) ?
					$.datepicker._getDate(inst) : null) || new Date(),
					year = date.getFullYear(),
					month = date.getMonth(),
					day = date.getDate(),
					pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
					matches = pattern.exec(offset);

				while (matches) {
					switch (matches[2] || "d") {
						case "d" : case "D" :
							day += parseInt(matches[1],10); break;
						case "w" : case "W" :
							day += parseInt(matches[1],10) * 7; break;
						case "m" : case "M" :
							month += parseInt(matches[1],10);
							day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
							break;
						case "y": case "Y" :
							year += parseInt(matches[1],10);
							day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
							break;
					}
					matches = pattern.exec(offset);
				}
				return new Date(year, month, day);
			},
			newDate = (date == null || date === "" ? defaultDate : (typeof date === "string" ? offsetString(date) :
				(typeof date === "number" ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));

		newDate = (newDate && newDate.toString() === "Invalid Date" ? defaultDate : newDate);
		if (newDate) {
			newDate.setHours(0);
			newDate.setMinutes(0);
			newDate.setSeconds(0);
			newDate.setMilliseconds(0);
		}
		return this._daylightSavingAdjust(newDate);
	},

	/* Handle switch to/from daylight saving.
	 * Hours may be non-zero on daylight saving cut-over:
	 * > 12 when midnight changeover, but then cannot generate
	 * midnight datetime, so jump to 1AM, otherwise reset.
	 * @param  date  (Date) the date to check
	 * @return  (Date) the corrected date
	 */
	_daylightSavingAdjust: function(date) {
		if (!date) {
			return null;
		}
		date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
		return date;
	},

	/* Set the date(s) directly. */
	_setDate: function(inst, date, noChange) {
		var clear = !date,
			origMonth = inst.selectedMonth,
			origYear = inst.selectedYear,
			newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));

		inst.selectedDay = inst.currentDay = newDate.getDate();
		inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
		inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
		if ((origMonth !== inst.selectedMonth || origYear !== inst.selectedYear) && !noChange) {
			this._notifyChange(inst);
		}
		this._adjustInstDate(inst);
		if (inst.input) {
			inst.input.val(clear ? "" : this._formatDate(inst));
		}
	},

	/* Retrieve the date(s) directly. */
	_getDate: function(inst) {
		var startDate = (!inst.currentYear || (inst.input && inst.input.val() === "") ? null :
			this._daylightSavingAdjust(new Date(
			inst.currentYear, inst.currentMonth, inst.currentDay)));
			return startDate;
	},

	/* Attach the onxxx handlers.  These are declared statically so
	 * they work with static code transformers like Caja.
	 */
	_attachHandlers: function(inst) {
		var stepMonths = this._get(inst, "stepMonths"),
			id = "#" + inst.id.replace( /\\\\/g, "\\" );
		inst.dpDiv.find("[data-handler]").map(function () {
			var handler = {
				prev: function () {
					$.datepicker._adjustDate(id, -stepMonths, "M");
				},
				next: function () {
					$.datepicker._adjustDate(id, +stepMonths, "M");
				},
				hide: function () {
					$.datepicker._hideDatepicker();
				},
				today: function () {
					$.datepicker._gotoToday(id);
				},
				selectDay: function () {
					$.datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this);
					return false;
				},
				selectMonth: function () {
					$.datepicker._selectMonthYear(id, this, "M");
					return false;
				},
				selectYear: function () {
					$.datepicker._selectMonthYear(id, this, "Y");
					return false;
				}
			};
			$(this).bind(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
		});
	},

	/* Generate the HTML for the current state of the date picker. */
	_generateHTML: function(inst) {
		var maxDraw, prevText, prev, nextText, next, currentText, gotoDate,
			controls, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin,
			monthNames, monthNamesShort, beforeShowDay, showOtherMonths,
			selectOtherMonths, defaultDate, html, dow, row, group, col, selectedDate,
			cornerClass, calender, thead, day, daysInMonth, leadDays, curRows, numRows,
			printDate, dRow, tbody, daySettings, otherMonth, unselectable,
			tempDate = new Date(),
			today = this._daylightSavingAdjust(
				new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())), // clear time
			isRTL = this._get(inst, "isRTL"),
			showButtonPanel = this._get(inst, "showButtonPanel"),
			hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext"),
			navigationAsDateFormat = this._get(inst, "navigationAsDateFormat"),
			numMonths = this._getNumberOfMonths(inst),
			showCurrentAtPos = this._get(inst, "showCurrentAtPos"),
			stepMonths = this._get(inst, "stepMonths"),
			isMultiMonth = (numMonths[0] !== 1 || numMonths[1] !== 1),
			currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
				new Date(inst.currentYear, inst.currentMonth, inst.currentDay))),
			minDate = this._getMinMaxDate(inst, "min"),
			maxDate = this._getMinMaxDate(inst, "max"),
			drawMonth = inst.drawMonth - showCurrentAtPos,
			drawYear = inst.drawYear;

		if (drawMonth < 0) {
			drawMonth += 12;
			drawYear--;
		}
		if (maxDate) {
			maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
				maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
			maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
			while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
				drawMonth--;
				if (drawMonth < 0) {
					drawMonth = 11;
					drawYear--;
				}
			}
		}
		inst.drawMonth = drawMonth;
		inst.drawYear = drawYear;

		prevText = this._get(inst, "prevText");
		prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
			this._getFormatConfig(inst)));

		prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
			"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click'" +
			" title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w") + "'>" + prevText + "</span></a>" :
			(hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+ prevText +"'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w") + "'>" + prevText + "</span></a>"));

		nextText = this._get(inst, "nextText");
		nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
			this._getFormatConfig(inst)));

		next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
			"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click'" +
			" title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e") + "'>" + nextText + "</span></a>" :
			(hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+ nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e") + "'>" + nextText + "</span></a>"));

		currentText = this._get(inst, "currentText");
		gotoDate = (this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today);
		currentText = (!navigationAsDateFormat ? currentText :
			this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));

		controls = (!inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
			this._get(inst, "closeText") + "</button>" : "");

		buttonPanel = (showButtonPanel) ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (isRTL ? controls : "") +
			(this._isInRange(inst, gotoDate) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'" +
			">" + currentText + "</button>" : "") + (isRTL ? "" : controls) + "</div>" : "";

		firstDay = parseInt(this._get(inst, "firstDay"),10);
		firstDay = (isNaN(firstDay) ? 0 : firstDay);

		showWeek = this._get(inst, "showWeek");
		dayNames = this._get(inst, "dayNames");
		dayNamesMin = this._get(inst, "dayNamesMin");
		monthNames = this._get(inst, "monthNames");
		monthNamesShort = this._get(inst, "monthNamesShort");
		beforeShowDay = this._get(inst, "beforeShowDay");
		showOtherMonths = this._get(inst, "showOtherMonths");
		selectOtherMonths = this._get(inst, "selectOtherMonths");
		defaultDate = this._getDefaultDate(inst);
		html = "";
		dow;
		for (row = 0; row < numMonths[0]; row++) {
			group = "";
			this.maxRows = 4;
			for (col = 0; col < numMonths[1]; col++) {
				selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
				cornerClass = " ui-corner-all";
				calender = "";
				if (isMultiMonth) {
					calender += "<div class='ui-datepicker-group";
					if (numMonths[1] > 1) {
						switch (col) {
							case 0: calender += " ui-datepicker-group-first";
								cornerClass = " ui-corner-" + (isRTL ? "right" : "left"); break;
							case numMonths[1]-1: calender += " ui-datepicker-group-last";
								cornerClass = " ui-corner-" + (isRTL ? "left" : "right"); break;
							default: calender += " ui-datepicker-group-middle"; cornerClass = ""; break;
						}
					}
					calender += "'>";
				}
				calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" +
					(/all|left/.test(cornerClass) && row === 0 ? (isRTL ? next : prev) : "") +
					(/all|right/.test(cornerClass) && row === 0 ? (isRTL ? prev : next) : "") +
					this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
					row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
					"</div><table class='ui-datepicker-calendar'><thead>" +
					"<tr>";
				thead = (showWeek ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "");
				for (dow = 0; dow < 7; dow++) { // days of the week
					day = (dow + firstDay) % 7;
					thead += "<th scope='col'" + ((dow + firstDay + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" +
						"<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + "</span></th>";
				}
				calender += thead + "</tr></thead><tbody>";
				daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
				if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
					inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
				}
				leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
				curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
				numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
				this.maxRows = numRows;
				printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
				for (dRow = 0; dRow < numRows; dRow++) { // create date picker rows
					calender += "<tr>";
					tbody = (!showWeek ? "" : "<td class='ui-datepicker-week-col'>" +
						this._get(inst, "calculateWeek")(printDate) + "</td>");
					for (dow = 0; dow < 7; dow++) { // create date picker days
						daySettings = (beforeShowDay ?
							beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, ""]);
						otherMonth = (printDate.getMonth() !== drawMonth);
						unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
							(minDate && printDate < minDate) || (maxDate && printDate > maxDate);
						tbody += "<td class='" +
							((dow + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
							(otherMonth ? " ui-datepicker-other-month" : "") + // highlight days from other months
							((printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent) || // user pressed key
							(defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime()) ?
							// or defaultDate is current printedDate and defaultDate is selectedDate
							" " + this._dayOverClass : "") + // highlight selected day
							(unselectable ? " " + this._unselectableClass + " ui-state-disabled": "") +  // highlight unselectable days
							(otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + // highlight custom dates
							(printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "") + // highlight selected day
							(printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) + "'" + // highlight today (if different)
							((!otherMonth || showOtherMonths) && daySettings[2] ? " title='" + daySettings[2].replace(/'/g, "&#39;") + "'" : "") + // cell title
							(unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
							(otherMonth && !showOtherMonths ? "&#xa0;" : // display for other months
							(unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
							(printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
							(printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "") + // highlight selected day
							(otherMonth ? " ui-priority-secondary" : "") + // distinguish dates from other months
							"' href='#'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
						printDate.setDate(printDate.getDate() + 1);
						printDate = this._daylightSavingAdjust(printDate);
					}
					calender += tbody + "</tr>";
				}
				drawMonth++;
				if (drawMonth > 11) {
					drawMonth = 0;
					drawYear++;
				}
				calender += "</tbody></table>" + (isMultiMonth ? "</div>" +
							((numMonths[0] > 0 && col === numMonths[1]-1) ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
				group += calender;
			}
			html += group;
		}
		html += buttonPanel;
		inst._keyEvent = false;
		return html;
	},

	/* Generate the month and year header. */
	_generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
			secondary, monthNames, monthNamesShort) {

		var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear,
			changeMonth = this._get(inst, "changeMonth"),
			changeYear = this._get(inst, "changeYear"),
			showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
			html = "<div class='ui-datepicker-title'>",
			monthHtml = "";

		// month selection
		if (secondary || !changeMonth) {
			monthHtml += "<span class='ui-datepicker-month'>" + monthNames[drawMonth] + "</span>";
		} else {
			inMinYear = (minDate && minDate.getFullYear() === drawYear);
			inMaxYear = (maxDate && maxDate.getFullYear() === drawYear);
			monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
			for ( month = 0; month < 12; month++) {
				if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
					monthHtml += "<option value='" + month + "'" +
						(month === drawMonth ? " selected='selected'" : "") +
						">" + monthNamesShort[month] + "</option>";
				}
			}
			monthHtml += "</select>";
		}

		if (!showMonthAfterYear) {
			html += monthHtml + (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
		}

		// year selection
		if ( !inst.yearshtml ) {
			inst.yearshtml = "";
			if (secondary || !changeYear) {
				html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
			} else {
				// determine range of years to display
				years = this._get(inst, "yearRange").split(":");
				thisYear = new Date().getFullYear();
				determineYear = function(value) {
					var year = (value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) :
						(value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) :
						parseInt(value, 10)));
					return (isNaN(year) ? thisYear : year);
				};
				year = determineYear(years[0]);
				endYear = Math.max(year, determineYear(years[1] || ""));
				year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
				endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
				inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
				for (; year <= endYear; year++) {
					inst.yearshtml += "<option value='" + year + "'" +
						(year === drawYear ? " selected='selected'" : "") +
						">" + year + "</option>";
				}
				inst.yearshtml += "</select>";

				html += inst.yearshtml;
				inst.yearshtml = null;
			}
		}

		html += this._get(inst, "yearSuffix");
		if (showMonthAfterYear) {
			html += (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "") + monthHtml;
		}
		html += "</div>"; // Close datepicker_header
		return html;
	},

	/* Adjust one of the date sub-fields. */
	_adjustInstDate: function(inst, offset, period) {
		var year = inst.drawYear + (period === "Y" ? offset : 0),
			month = inst.drawMonth + (period === "M" ? offset : 0),
			day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + (period === "D" ? offset : 0),
			date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, day)));

		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		if (period === "M" || period === "Y") {
			this._notifyChange(inst);
		}
	},

	/* Ensure a date is within any min/max bounds. */
	_restrictMinMax: function(inst, date) {
		var minDate = this._getMinMaxDate(inst, "min"),
			maxDate = this._getMinMaxDate(inst, "max"),
			newDate = (minDate && date < minDate ? minDate : date);
		return (maxDate && newDate > maxDate ? maxDate : newDate);
	},

	/* Notify change of month/year. */
	_notifyChange: function(inst) {
		var onChange = this._get(inst, "onChangeMonthYear");
		if (onChange) {
			onChange.apply((inst.input ? inst.input[0] : null),
				[inst.selectedYear, inst.selectedMonth + 1, inst]);
		}
	},

	/* Determine the number of months to show. */
	_getNumberOfMonths: function(inst) {
		var numMonths = this._get(inst, "numberOfMonths");
		return (numMonths == null ? [1, 1] : (typeof numMonths === "number" ? [1, numMonths] : numMonths));
	},

	/* Determine the current maximum date - ensure no time components are set. */
	_getMinMaxDate: function(inst, minMax) {
		return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
	},

	/* Find the number of days in a given month. */
	_getDaysInMonth: function(year, month) {
		return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
	},

	/* Find the day of the week of the first of a month. */
	_getFirstDayOfMonth: function(year, month) {
		return new Date(year, month, 1).getDay();
	},

	/* Determines if we should allow a "next/prev" month display change. */
	_canAdjustMonth: function(inst, offset, curYear, curMonth) {
		var numMonths = this._getNumberOfMonths(inst),
			date = this._daylightSavingAdjust(new Date(curYear,
			curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));

		if (offset < 0) {
			date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
		}
		return this._isInRange(inst, date);
	},

	/* Is the given date in the accepted range? */
	_isInRange: function(inst, date) {
		var yearSplit, currentYear,
			minDate = this._getMinMaxDate(inst, "min"),
			maxDate = this._getMinMaxDate(inst, "max"),
			minYear = null,
			maxYear = null,
			years = this._get(inst, "yearRange");
			if (years){
				yearSplit = years.split(":");
				currentYear = new Date().getFullYear();
				minYear = parseInt(yearSplit[0], 10);
				maxYear = parseInt(yearSplit[1], 10);
				if ( yearSplit[0].match(/[+\-].*/) ) {
					minYear += currentYear;
				}
				if ( yearSplit[1].match(/[+\-].*/) ) {
					maxYear += currentYear;
				}
			}

		return ((!minDate || date.getTime() >= minDate.getTime()) &&
			(!maxDate || date.getTime() <= maxDate.getTime()) &&
			(!minYear || date.getFullYear() >= minYear) &&
			(!maxYear || date.getFullYear() <= maxYear));
	},

	/* Provide the configuration settings for formatting/parsing. */
	_getFormatConfig: function(inst) {
		var shortYearCutoff = this._get(inst, "shortYearCutoff");
		shortYearCutoff = (typeof shortYearCutoff !== "string" ? shortYearCutoff :
			new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
		return {shortYearCutoff: shortYearCutoff,
			dayNamesShort: this._get(inst, "dayNamesShort"), dayNames: this._get(inst, "dayNames"),
			monthNamesShort: this._get(inst, "monthNamesShort"), monthNames: this._get(inst, "monthNames")};
	},

	/* Format the given date for display. */
	_formatDate: function(inst, day, month, year) {
		if (!day) {
			inst.currentDay = inst.selectedDay;
			inst.currentMonth = inst.selectedMonth;
			inst.currentYear = inst.selectedYear;
		}
		var date = (day ? (typeof day === "object" ? day :
			this._daylightSavingAdjust(new Date(year, month, day))) :
			this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
		return this.formatDate(this._get(inst, "dateFormat"), date, this._getFormatConfig(inst));
	}
});

/*
 * Bind hover events for datepicker elements.
 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
 * Global datepicker_instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
 */
function datepicker_bindHover(dpDiv) {
	var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
	return dpDiv.delegate(selector, "mouseout", function() {
			$(this).removeClass("ui-state-hover");
			if (this.className.indexOf("ui-datepicker-prev") !== -1) {
				$(this).removeClass("ui-datepicker-prev-hover");
			}
			if (this.className.indexOf("ui-datepicker-next") !== -1) {
				$(this).removeClass("ui-datepicker-next-hover");
			}
		})
		.delegate( selector, "mouseover", datepicker_handleMouseover );
}

function datepicker_handleMouseover() {
	if (!$.datepicker._isDisabledDatepicker( datepicker_instActive.inline? datepicker_instActive.dpDiv.parent()[0] : datepicker_instActive.input[0])) {
		$(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
		$(this).addClass("ui-state-hover");
		if (this.className.indexOf("ui-datepicker-prev") !== -1) {
			$(this).addClass("ui-datepicker-prev-hover");
		}
		if (this.className.indexOf("ui-datepicker-next") !== -1) {
			$(this).addClass("ui-datepicker-next-hover");
		}
	}
}

/* jQuery extend now ignores nulls! */
function datepicker_extendRemove(target, props) {
	$.extend(target, props);
	for (var name in props) {
		if (props[name] == null) {
			target[name] = props[name];
		}
	}
	return target;
}

/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
					Object - settings for attaching new datepicker functionality
   @return  jQuery object */
$.fn.datepicker = function(options){

	/* Verify an empty collection wasn't passed - Fixes #6976 */
	if ( !this.length ) {
		return this;
	}

	/* Initialise the date picker. */
	if (!$.datepicker.initialized) {
		$(document).mousedown($.datepicker._checkExternalClick);
		$.datepicker.initialized = true;
	}

	/* Append datepicker main container to body if not exist. */
	if ($("#"+$.datepicker._mainDivId).length === 0) {
		$("body").append($.datepicker.dpDiv);
	}

	var otherArgs = Array.prototype.slice.call(arguments, 1);
	if (typeof options === "string" && (options === "isDisabled" || options === "getDate" || options === "widget")) {
		return $.datepicker["_" + options + "Datepicker"].
			apply($.datepicker, [this[0]].concat(otherArgs));
	}
	if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
		return $.datepicker["_" + options + "Datepicker"].
			apply($.datepicker, [this[0]].concat(otherArgs));
	}
	return this.each(function() {
		typeof options === "string" ?
			$.datepicker["_" + options + "Datepicker"].
				apply($.datepicker, [this].concat(otherArgs)) :
			$.datepicker._attachDatepicker(this, options);
	});
};

$.datepicker = new Datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new Date().getTime();
$.datepicker.version = "1.11.4";

var datepicker = $.datepicker;


/*!
 * jQuery UI Menu 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/menu/
 */


var menu = $.widget( "ui.menu", {
	version: "1.11.4",
	defaultElement: "<ul>",
	delay: 300,
	options: {
		icons: {
			submenu: "ui-icon-carat-1-e"
		},
		items: "> *",
		menus: "ul",
		position: {
			my: "left-1 top",
			at: "right top"
		},
		role: "menu",

		// callbacks
		blur: null,
		focus: null,
		select: null
	},

	_create: function() {
		this.activeMenu = this.element;

		// Flag used to prevent firing of the click handler
		// as the event bubbles up through nested menus
		this.mouseHandled = false;
		this.element
			.uniqueId()
			.addClass( "ui-menu ui-widget ui-widget-content" )
			.toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length )
			.attr({
				role: this.options.role,
				tabIndex: 0
			});

		if ( this.options.disabled ) {
			this.element
				.addClass( "ui-state-disabled" )
				.attr( "aria-disabled", "true" );
		}

		this._on({
			// Prevent focus from sticking to links inside menu after clicking
			// them (focus should always stay on UL during navigation).
			"mousedown .ui-menu-item": function( event ) {
				event.preventDefault();
			},
			"click .ui-menu-item": function( event ) {
				var target = $( event.target );
				if ( !this.mouseHandled && target.not( ".ui-state-disabled" ).length ) {
					this.select( event );

					// Only set the mouseHandled flag if the event will bubble, see #9469.
					if ( !event.isPropagationStopped() ) {
						this.mouseHandled = true;
					}

					// Open submenu on click
					if ( target.has( ".ui-menu" ).length ) {
						this.expand( event );
					} else if ( !this.element.is( ":focus" ) && $( this.document[ 0 ].activeElement ).closest( ".ui-menu" ).length ) {

						// Redirect focus to the menu
						this.element.trigger( "focus", [ true ] );

						// If the active item is on the top level, let it stay active.
						// Otherwise, blur the active item since it is no longer visible.
						if ( this.active && this.active.parents( ".ui-menu" ).length === 1 ) {
							clearTimeout( this.timer );
						}
					}
				}
			},
			"mouseenter .ui-menu-item": function( event ) {
				// Ignore mouse events while typeahead is active, see #10458.
				// Prevents focusing the wrong item when typeahead causes a scroll while the mouse
				// is over an item in the menu
				if ( this.previousFilter ) {
					return;
				}
				var target = $( event.currentTarget );
				// Remove ui-state-active class from siblings of the newly focused menu item
				// to avoid a jump caused by adjacent elements both having a class with a border
				target.siblings( ".ui-state-active" ).removeClass( "ui-state-active" );
				this.focus( event, target );
			},
			mouseleave: "collapseAll",
			"mouseleave .ui-menu": "collapseAll",
			focus: function( event, keepActiveItem ) {
				// If there's already an active item, keep it active
				// If not, activate the first item
				var item = this.active || this.element.find( this.options.items ).eq( 0 );

				if ( !keepActiveItem ) {
					this.focus( event, item );
				}
			},
			blur: function( event ) {
				this._delay(function() {
					if ( !$.contains( this.element[0], this.document[0].activeElement ) ) {
						this.collapseAll( event );
					}
				});
			},
			keydown: "_keydown"
		});

		this.refresh();

		// Clicks outside of a menu collapse any open menus
		this._on( this.document, {
			click: function( event ) {
				if ( this._closeOnDocumentClick( event ) ) {
					this.collapseAll( event );
				}

				// Reset the mouseHandled flag
				this.mouseHandled = false;
			}
		});
	},

	_destroy: function() {
		// Destroy (sub)menus
		this.element
			.removeAttr( "aria-activedescendant" )
			.find( ".ui-menu" ).addBack()
				.removeClass( "ui-menu ui-widget ui-widget-content ui-menu-icons ui-front" )
				.removeAttr( "role" )
				.removeAttr( "tabIndex" )
				.removeAttr( "aria-labelledby" )
				.removeAttr( "aria-expanded" )
				.removeAttr( "aria-hidden" )
				.removeAttr( "aria-disabled" )
				.removeUniqueId()
				.show();

		// Destroy menu items
		this.element.find( ".ui-menu-item" )
			.removeClass( "ui-menu-item" )
			.removeAttr( "role" )
			.removeAttr( "aria-disabled" )
			.removeUniqueId()
			.removeClass( "ui-state-hover" )
			.removeAttr( "tabIndex" )
			.removeAttr( "role" )
			.removeAttr( "aria-haspopup" )
			.children().each( function() {
				var elem = $( this );
				if ( elem.data( "ui-menu-submenu-carat" ) ) {
					elem.remove();
				}
			});

		// Destroy menu dividers
		this.element.find( ".ui-menu-divider" ).removeClass( "ui-menu-divider ui-widget-content" );
	},

	_keydown: function( event ) {
		var match, prev, character, skip,
			preventDefault = true;

		switch ( event.keyCode ) {
		case $.ui.keyCode.PAGE_UP:
			this.previousPage( event );
			break;
		case $.ui.keyCode.PAGE_DOWN:
			this.nextPage( event );
			break;
		case $.ui.keyCode.HOME:
			this._move( "first", "first", event );
			break;
		case $.ui.keyCode.END:
			this._move( "last", "last", event );
			break;
		case $.ui.keyCode.UP:
			this.previous( event );
			break;
		case $.ui.keyCode.DOWN:
			this.next( event );
			break;
		case $.ui.keyCode.LEFT:
			this.collapse( event );
			break;
		case $.ui.keyCode.RIGHT:
			if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
				this.expand( event );
			}
			break;
		case $.ui.keyCode.ENTER:
		case $.ui.keyCode.SPACE:
			this._activate( event );
			break;
		case $.ui.keyCode.ESCAPE:
			this.collapse( event );
			break;
		default:
			preventDefault = false;
			prev = this.previousFilter || "";
			character = String.fromCharCode( event.keyCode );
			skip = false;

			clearTimeout( this.filterTimer );

			if ( character === prev ) {
				skip = true;
			} else {
				character = prev + character;
			}

			match = this._filterMenuItems( character );
			match = skip && match.index( this.active.next() ) !== -1 ?
				this.active.nextAll( ".ui-menu-item" ) :
				match;

			// If no matches on the current filter, reset to the last character pressed
			// to move down the menu to the first item that starts with that character
			if ( !match.length ) {
				character = String.fromCharCode( event.keyCode );
				match = this._filterMenuItems( character );
			}

			if ( match.length ) {
				this.focus( event, match );
				this.previousFilter = character;
				this.filterTimer = this._delay(function() {
					delete this.previousFilter;
				}, 1000 );
			} else {
				delete this.previousFilter;
			}
		}

		if ( preventDefault ) {
			event.preventDefault();
		}
	},

	_activate: function( event ) {
		if ( !this.active.is( ".ui-state-disabled" ) ) {
			if ( this.active.is( "[aria-haspopup='true']" ) ) {
				this.expand( event );
			} else {
				this.select( event );
			}
		}
	},

	refresh: function() {
		var menus, items,
			that = this,
			icon = this.options.icons.submenu,
			submenus = this.element.find( this.options.menus );

		this.element.toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length );

		// Initialize nested menus
		submenus.filter( ":not(.ui-menu)" )
			.addClass( "ui-menu ui-widget ui-widget-content ui-front" )
			.hide()
			.attr({
				role: this.options.role,
				"aria-hidden": "true",
				"aria-expanded": "false"
			})
			.each(function() {
				var menu = $( this ),
					item = menu.parent(),
					submenuCarat = $( "<span>" )
						.addClass( "ui-menu-icon ui-icon " + icon )
						.data( "ui-menu-submenu-carat", true );

				item
					.attr( "aria-haspopup", "true" )
					.prepend( submenuCarat );
				menu.attr( "aria-labelledby", item.attr( "id" ) );
			});

		menus = submenus.add( this.element );
		items = menus.find( this.options.items );

		// Initialize menu-items containing spaces and/or dashes only as dividers
		items.not( ".ui-menu-item" ).each(function() {
			var item = $( this );
			if ( that._isDivider( item ) ) {
				item.addClass( "ui-widget-content ui-menu-divider" );
			}
		});

		// Don't refresh list items that are already adapted
		items.not( ".ui-menu-item, .ui-menu-divider" )
			.addClass( "ui-menu-item" )
			.uniqueId()
			.attr({
				tabIndex: -1,
				role: this._itemRole()
			});

		// Add aria-disabled attribute to any disabled menu item
		items.filter( ".ui-state-disabled" ).attr( "aria-disabled", "true" );

		// If the active item has been removed, blur the menu
		if ( this.active && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
			this.blur();
		}
	},

	_itemRole: function() {
		return {
			menu: "menuitem",
			listbox: "option"
		}[ this.options.role ];
	},

	_setOption: function( key, value ) {
		if ( key === "icons" ) {
			this.element.find( ".ui-menu-icon" )
				.removeClass( this.options.icons.submenu )
				.addClass( value.submenu );
		}
		if ( key === "disabled" ) {
			this.element
				.toggleClass( "ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
		}
		this._super( key, value );
	},

	focus: function( event, item ) {
		var nested, focused;
		this.blur( event, event && event.type === "focus" );

		this._scrollIntoView( item );

		this.active = item.first();
		focused = this.active.addClass( "ui-state-focus" ).removeClass( "ui-state-active" );
		// Only update aria-activedescendant if there's a role
		// otherwise we assume focus is managed elsewhere
		if ( this.options.role ) {
			this.element.attr( "aria-activedescendant", focused.attr( "id" ) );
		}

		// Highlight active parent menu item, if any
		this.active
			.parent()
			.closest( ".ui-menu-item" )
			.addClass( "ui-state-active" );

		if ( event && event.type === "keydown" ) {
			this._close();
		} else {
			this.timer = this._delay(function() {
				this._close();
			}, this.delay );
		}

		nested = item.children( ".ui-menu" );
		if ( nested.length && event && ( /^mouse/.test( event.type ) ) ) {
			this._startOpening(nested);
		}
		this.activeMenu = item.parent();

		this._trigger( "focus", event, { item: item } );
	},

	_scrollIntoView: function( item ) {
		var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
		if ( this._hasScroll() ) {
			borderTop = parseFloat( $.css( this.activeMenu[0], "borderTopWidth" ) ) || 0;
			paddingTop = parseFloat( $.css( this.activeMenu[0], "paddingTop" ) ) || 0;
			offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
			scroll = this.activeMenu.scrollTop();
			elementHeight = this.activeMenu.height();
			itemHeight = item.outerHeight();

			if ( offset < 0 ) {
				this.activeMenu.scrollTop( scroll + offset );
			} else if ( offset + itemHeight > elementHeight ) {
				this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
			}
		}
	},

	blur: function( event, fromFocus ) {
		if ( !fromFocus ) {
			clearTimeout( this.timer );
		}

		if ( !this.active ) {
			return;
		}

		this.active.removeClass( "ui-state-focus" );
		this.active = null;

		this._trigger( "blur", event, { item: this.active } );
	},

	_startOpening: function( submenu ) {
		clearTimeout( this.timer );

		// Don't open if already open fixes a Firefox bug that caused a .5 pixel
		// shift in the submenu position when mousing over the carat icon
		if ( submenu.attr( "aria-hidden" ) !== "true" ) {
			return;
		}

		this.timer = this._delay(function() {
			this._close();
			this._open( submenu );
		}, this.delay );
	},

	_open: function( submenu ) {
		var position = $.extend({
			of: this.active
		}, this.options.position );

		clearTimeout( this.timer );
		this.element.find( ".ui-menu" ).not( submenu.parents( ".ui-menu" ) )
			.hide()
			.attr( "aria-hidden", "true" );

		submenu
			.show()
			.removeAttr( "aria-hidden" )
			.attr( "aria-expanded", "true" )
			.position( position );
	},

	collapseAll: function( event, all ) {
		clearTimeout( this.timer );
		this.timer = this._delay(function() {
			// If we were passed an event, look for the submenu that contains the event
			var currentMenu = all ? this.element :
				$( event && event.target ).closest( this.element.find( ".ui-menu" ) );

			// If we found no valid submenu ancestor, use the main menu to close all sub menus anyway
			if ( !currentMenu.length ) {
				currentMenu = this.element;
			}

			this._close( currentMenu );

			this.blur( event );
			this.activeMenu = currentMenu;
		}, this.delay );
	},

	// With no arguments, closes the currently active menu - if nothing is active
	// it closes all menus.  If passed an argument, it will search for menus BELOW
	_close: function( startMenu ) {
		if ( !startMenu ) {
			startMenu = this.active ? this.active.parent() : this.element;
		}

		startMenu
			.find( ".ui-menu" )
				.hide()
				.attr( "aria-hidden", "true" )
				.attr( "aria-expanded", "false" )
			.end()
			.find( ".ui-state-active" ).not( ".ui-state-focus" )
				.removeClass( "ui-state-active" );
	},

	_closeOnDocumentClick: function( event ) {
		return !$( event.target ).closest( ".ui-menu" ).length;
	},

	_isDivider: function( item ) {

		// Match hyphen, em dash, en dash
		return !/[^\-\u2014\u2013\s]/.test( item.text() );
	},

	collapse: function( event ) {
		var newItem = this.active &&
			this.active.parent().closest( ".ui-menu-item", this.element );
		if ( newItem && newItem.length ) {
			this._close();
			this.focus( event, newItem );
		}
	},

	expand: function( event ) {
		var newItem = this.active &&
			this.active
				.children( ".ui-menu " )
				.find( this.options.items )
				.first();

		if ( newItem && newItem.length ) {
			this._open( newItem.parent() );

			// Delay so Firefox will not hide activedescendant change in expanding submenu from AT
			this._delay(function() {
				this.focus( event, newItem );
			});
		}
	},

	next: function( event ) {
		this._move( "next", "first", event );
	},

	previous: function( event ) {
		this._move( "prev", "last", event );
	},

	isFirstItem: function() {
		return this.active && !this.active.prevAll( ".ui-menu-item" ).length;
	},

	isLastItem: function() {
		return this.active && !this.active.nextAll( ".ui-menu-item" ).length;
	},

	_move: function( direction, filter, event ) {
		var next;
		if ( this.active ) {
			if ( direction === "first" || direction === "last" ) {
				next = this.active
					[ direction === "first" ? "prevAll" : "nextAll" ]( ".ui-menu-item" )
					.eq( -1 );
			} else {
				next = this.active
					[ direction + "All" ]( ".ui-menu-item" )
					.eq( 0 );
			}
		}
		if ( !next || !next.length || !this.active ) {
			next = this.activeMenu.find( this.options.items )[ filter ]();
		}

		this.focus( event, next );
	},

	nextPage: function( event ) {
		var item, base, height;

		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isLastItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.nextAll( ".ui-menu-item" ).each(function() {
				item = $( this );
				return item.offset().top - base - height < 0;
			});

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.find( this.options.items )
				[ !this.active ? "first" : "last" ]() );
		}
	},

	previousPage: function( event ) {
		var item, base, height;
		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isFirstItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.prevAll( ".ui-menu-item" ).each(function() {
				item = $( this );
				return item.offset().top - base + height > 0;
			});

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.find( this.options.items ).first() );
		}
	},

	_hasScroll: function() {
		return this.element.outerHeight() < this.element.prop( "scrollHeight" );
	},

	select: function( event ) {
		// TODO: It should never be possible to not have an active item at this
		// point, but the tests don't trigger mouseenter before click.
		this.active = this.active || $( event.target ).closest( ".ui-menu-item" );
		var ui = { item: this.active };
		if ( !this.active.has( ".ui-menu" ).length ) {
			this.collapseAll( event, true );
		}
		this._trigger( "select", event, ui );
	},

	_filterMenuItems: function(character) {
		var escapedCharacter = character.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" ),
			regex = new RegExp( "^" + escapedCharacter, "i" );

		return this.activeMenu
			.find( this.options.items )

			// Only match on items, not dividers or other content (#10571)
			.filter( ".ui-menu-item" )
			.filter(function() {
				return regex.test( $.trim( $( this ).text() ) );
			});
	}
});


/*!
 * jQuery UI Selectmenu 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/selectmenu
 */


var selectmenu = $.widget( "ui.selectmenu", {
	version: "1.11.4",
	defaultElement: "<select>",
	options: {
		appendTo: null,
		disabled: null,
		icons: {
			button: "ui-icon-triangle-1-s"
		},
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		width: null,

		// callbacks
		change: null,
		close: null,
		focus: null,
		open: null,
		select: null
	},

	_create: function() {
		var selectmenuId = this.element.uniqueId().attr( "id" );
		this.ids = {
			element: selectmenuId,
			button: selectmenuId + "-button",
			menu: selectmenuId + "-menu"
		};

		this._drawButton();
		this._drawMenu();

		if ( this.options.disabled ) {
			this.disable();
		}
	},

	_drawButton: function() {
		var that = this;

		// Associate existing label with the new button
		this.label = $( "label[for='" + this.ids.element + "']" ).attr( "for", this.ids.button );
		this._on( this.label, {
			click: function( event ) {
				this.button.focus();
				event.preventDefault();
			}
		});

		// Hide original select element
		this.element.hide();

		// Create button
		this.button = $( "<span>", {
			"class": "ui-selectmenu-button ui-widget ui-state-default ui-corner-all",
			tabindex: this.options.disabled ? -1 : 0,
			id: this.ids.button,
			role: "combobox",
			"aria-expanded": "false",
			"aria-autocomplete": "list",
			"aria-owns": this.ids.menu,
			"aria-haspopup": "true"
		})
			.insertAfter( this.element );

		$( "<span>", {
			"class": "ui-icon " + this.options.icons.button
		})
			.prependTo( this.button );

		this.buttonText = $( "<span>", {
			"class": "ui-selectmenu-text"
		})
			.appendTo( this.button );

		this._setText( this.buttonText, this.element.find( "option:selected" ).text() );
		this._resizeButton();

		this._on( this.button, this._buttonEvents );
		this.button.one( "focusin", function() {

			// Delay rendering the menu items until the button receives focus.
			// The menu may have already been rendered via a programmatic open.
			if ( !that.menuItems ) {
				that._refreshMenu();
			}
		});
		this._hoverable( this.button );
		this._focusable( this.button );
	},

	_drawMenu: function() {
		var that = this;

		// Create menu
		this.menu = $( "<ul>", {
			"aria-hidden": "true",
			"aria-labelledby": this.ids.button,
			id: this.ids.menu
		});

		// Wrap menu
		this.menuWrap = $( "<div>", {
			"class": "ui-selectmenu-menu ui-front"
		})
			.append( this.menu )
			.appendTo( this._appendTo() );

		// Initialize menu widget
		this.menuInstance = this.menu
			.menu({
				role: "listbox",
				select: function( event, ui ) {
					event.preventDefault();

					// support: IE8
					// If the item was selected via a click, the text selection
					// will be destroyed in IE
					that._setSelection();

					that._select( ui.item.data( "ui-selectmenu-item" ), event );
				},
				focus: function( event, ui ) {
					var item = ui.item.data( "ui-selectmenu-item" );

					// Prevent inital focus from firing and check if its a newly focused item
					if ( that.focusIndex != null && item.index !== that.focusIndex ) {
						that._trigger( "focus", event, { item: item } );
						if ( !that.isOpen ) {
							that._select( item, event );
						}
					}
					that.focusIndex = item.index;

					that.button.attr( "aria-activedescendant",
						that.menuItems.eq( item.index ).attr( "id" ) );
				}
			})
			.menu( "instance" );

		// Adjust menu styles to dropdown
		this.menu
			.addClass( "ui-corner-bottom" )
			.removeClass( "ui-corner-all" );

		// Don't close the menu on mouseleave
		this.menuInstance._off( this.menu, "mouseleave" );

		// Cancel the menu's collapseAll on document click
		this.menuInstance._closeOnDocumentClick = function() {
			return false;
		};

		// Selects often contain empty items, but never contain dividers
		this.menuInstance._isDivider = function() {
			return false;
		};
	},

	refresh: function() {
		this._refreshMenu();
		this._setText( this.buttonText, this._getSelectedItem().text() );
		if ( !this.options.width ) {
			this._resizeButton();
		}
	},

	_refreshMenu: function() {
		this.menu.empty();

		var item,
			options = this.element.find( "option" );

		if ( !options.length ) {
			return;
		}

		this._parseOptions( options );
		this._renderMenu( this.menu, this.items );

		this.menuInstance.refresh();
		this.menuItems = this.menu.find( "li" ).not( ".ui-selectmenu-optgroup" );

		item = this._getSelectedItem();

		// Update the menu to have the correct item focused
		this.menuInstance.focus( null, item );
		this._setAria( item.data( "ui-selectmenu-item" ) );

		// Set disabled state
		this._setOption( "disabled", this.element.prop( "disabled" ) );
	},

	open: function( event ) {
		if ( this.options.disabled ) {
			return;
		}

		// If this is the first time the menu is being opened, render the items
		if ( !this.menuItems ) {
			this._refreshMenu();
		} else {

			// Menu clears focus on close, reset focus to selected item
			this.menu.find( ".ui-state-focus" ).removeClass( "ui-state-focus" );
			this.menuInstance.focus( null, this._getSelectedItem() );
		}

		this.isOpen = true;
		this._toggleAttr();
		this._resizeMenu();
		this._position();

		this._on( this.document, this._documentClick );

		this._trigger( "open", event );
	},

	_position: function() {
		this.menuWrap.position( $.extend( { of: this.button }, this.options.position ) );
	},

	close: function( event ) {
		if ( !this.isOpen ) {
			return;
		}

		this.isOpen = false;
		this._toggleAttr();

		this.range = null;
		this._off( this.document );

		this._trigger( "close", event );
	},

	widget: function() {
		return this.button;
	},

	menuWidget: function() {
		return this.menu;
	},

	_renderMenu: function( ul, items ) {
		var that = this,
			currentOptgroup = "";

		$.each( items, function( index, item ) {
			if ( item.optgroup !== currentOptgroup ) {
				$( "<li>", {
					"class": "ui-selectmenu-optgroup ui-menu-divider" +
						( item.element.parent( "optgroup" ).prop( "disabled" ) ?
							" ui-state-disabled" :
							"" ),
					text: item.optgroup
				})
					.appendTo( ul );

				currentOptgroup = item.optgroup;
			}

			that._renderItemData( ul, item );
		});
	},

	_renderItemData: function( ul, item ) {
		return this._renderItem( ul, item ).data( "ui-selectmenu-item", item );
	},

	_renderItem: function( ul, item ) {
		var li = $( "<li>" );

		if ( item.disabled ) {
			li.addClass( "ui-state-disabled" );
		}
		this._setText( li, item.label );

		return li.appendTo( ul );
	},

	_setText: function( element, value ) {
		if ( value ) {
			element.text( value );
		} else {
			element.html( "&#160;" );
		}
	},

	_move: function( direction, event ) {
		var item, next,
			filter = ".ui-menu-item";

		if ( this.isOpen ) {
			item = this.menuItems.eq( this.focusIndex );
		} else {
			item = this.menuItems.eq( this.element[ 0 ].selectedIndex );
			filter += ":not(.ui-state-disabled)";
		}

		if ( direction === "first" || direction === "last" ) {
			next = item[ direction === "first" ? "prevAll" : "nextAll" ]( filter ).eq( -1 );
		} else {
			next = item[ direction + "All" ]( filter ).eq( 0 );
		}

		if ( next.length ) {
			this.menuInstance.focus( event, next );
		}
	},

	_getSelectedItem: function() {
		return this.menuItems.eq( this.element[ 0 ].selectedIndex );
	},

	_toggle: function( event ) {
		this[ this.isOpen ? "close" : "open" ]( event );
	},

	_setSelection: function() {
		var selection;

		if ( !this.range ) {
			return;
		}

		if ( window.getSelection ) {
			selection = window.getSelection();
			selection.removeAllRanges();
			selection.addRange( this.range );

		// support: IE8
		} else {
			this.range.select();
		}

		// support: IE
		// Setting the text selection kills the button focus in IE, but
		// restoring the focus doesn't kill the selection.
		this.button.focus();
	},

	_documentClick: {
		mousedown: function( event ) {
			if ( !this.isOpen ) {
				return;
			}

			if ( !$( event.target ).closest( ".ui-selectmenu-menu, #" + this.ids.button ).length ) {
				this.close( event );
			}
		}
	},

	_buttonEvents: {

		// Prevent text selection from being reset when interacting with the selectmenu (#10144)
		mousedown: function() {
			var selection;

			if ( window.getSelection ) {
				selection = window.getSelection();
				if ( selection.rangeCount ) {
					this.range = selection.getRangeAt( 0 );
				}

			// support: IE8
			} else {
				this.range = document.selection.createRange();
			}
		},

		click: function( event ) {
			this._setSelection();
			this._toggle( event );
		},

		keydown: function( event ) {
			var preventDefault = true;
			switch ( event.keyCode ) {
				case $.ui.keyCode.TAB:
				case $.ui.keyCode.ESCAPE:
					this.close( event );
					preventDefault = false;
					break;
				case $.ui.keyCode.ENTER:
					if ( this.isOpen ) {
						this._selectFocusedItem( event );
					}
					break;
				case $.ui.keyCode.UP:
					if ( event.altKey ) {
						this._toggle( event );
					} else {
						this._move( "prev", event );
					}
					break;
				case $.ui.keyCode.DOWN:
					if ( event.altKey ) {
						this._toggle( event );
					} else {
						this._move( "next", event );
					}
					break;
				case $.ui.keyCode.SPACE:
					if ( this.isOpen ) {
						this._selectFocusedItem( event );
					} else {
						this._toggle( event );
					}
					break;
				case $.ui.keyCode.LEFT:
					this._move( "prev", event );
					break;
				case $.ui.keyCode.RIGHT:
					this._move( "next", event );
					break;
				case $.ui.keyCode.HOME:
				case $.ui.keyCode.PAGE_UP:
					this._move( "first", event );
					break;
				case $.ui.keyCode.END:
				case $.ui.keyCode.PAGE_DOWN:
					this._move( "last", event );
					break;
				default:
					this.menu.trigger( event );
					preventDefault = false;
			}

			if ( preventDefault ) {
				event.preventDefault();
			}
		}
	},

	_selectFocusedItem: function( event ) {
		var item = this.menuItems.eq( this.focusIndex );
		if ( !item.hasClass( "ui-state-disabled" ) ) {
			this._select( item.data( "ui-selectmenu-item" ), event );
		}
	},

	_select: function( item, event ) {
		var oldIndex = this.element[ 0 ].selectedIndex;

		// Change native select element
		this.element[ 0 ].selectedIndex = item.index;
		this._setText( this.buttonText, item.label );
		this._setAria( item );
		this._trigger( "select", event, { item: item } );

		if ( item.index !== oldIndex ) {
			this._trigger( "change", event, { item: item } );
		}

		this.close( event );
	},

	_setAria: function( item ) {
		var id = this.menuItems.eq( item.index ).attr( "id" );

		this.button.attr({
			"aria-labelledby": id,
			"aria-activedescendant": id
		});
		this.menu.attr( "aria-activedescendant", id );
	},

	_setOption: function( key, value ) {
		if ( key === "icons" ) {
			this.button.find( "span.ui-icon" )
				.removeClass( this.options.icons.button )
				.addClass( value.button );
		}

		this._super( key, value );

		if ( key === "appendTo" ) {
			this.menuWrap.appendTo( this._appendTo() );
		}

		if ( key === "disabled" ) {
			this.menuInstance.option( "disabled", value );
			this.button
				.toggleClass( "ui-state-disabled", value )
				.attr( "aria-disabled", value );

			this.element.prop( "disabled", value );
			if ( value ) {
				this.button.attr( "tabindex", -1 );
				this.close();
			} else {
				this.button.attr( "tabindex", 0 );
			}
		}

		if ( key === "width" ) {
			this._resizeButton();
		}
	},

	_appendTo: function() {
		var element = this.options.appendTo;

		if ( element ) {
			element = element.jquery || element.nodeType ?
				$( element ) :
				this.document.find( element ).eq( 0 );
		}

		if ( !element || !element[ 0 ] ) {
			element = this.element.closest( ".ui-front" );
		}

		if ( !element.length ) {
			element = this.document[ 0 ].body;
		}

		return element;
	},

	_toggleAttr: function() {
		this.button
			.toggleClass( "ui-corner-top", this.isOpen )
			.toggleClass( "ui-corner-all", !this.isOpen )
			.attr( "aria-expanded", this.isOpen );
		this.menuWrap.toggleClass( "ui-selectmenu-open", this.isOpen );
		this.menu.attr( "aria-hidden", !this.isOpen );
	},

	_resizeButton: function() {
		var width = this.options.width;

		if ( !width ) {
			width = this.element.show().outerWidth();
			this.element.hide();
		}

		this.button.outerWidth( width );
	},

	_resizeMenu: function() {
		this.menu.outerWidth( Math.max(
			this.button.outerWidth(),

			// support: IE10
			// IE10 wraps long text (possibly a rounding bug)
			// so we add 1px to avoid the wrapping
			this.menu.width( "" ).outerWidth() + 1
		) );
	},

	_getCreateOptions: function() {
		return { disabled: this.element.prop( "disabled" ) };
	},

	_parseOptions: function( options ) {
		var data = [];
		options.each(function( index, item ) {
			var option = $( item ),
				optgroup = option.parent( "optgroup" );
			data.push({
				element: option,
				index: index,
				value: option.val(),
				label: option.text(),
				optgroup: optgroup.attr( "label" ) || "",
				disabled: optgroup.prop( "disabled" ) || option.prop( "disabled" )
			});
		});
		this.items = data;
	},

	_destroy: function() {
		this.menuWrap.remove();
		this.button.remove();
		this.element.show();
		this.element.removeUniqueId();
		this.label.attr( "for", this.ids.element );
	}
});



}));

/*!common/components/datepicker/main.js*/
;define('common/components/datepicker/main', ['require', 'exports', 'module', 'common/components/datepicker/jquery.ui.datepicker'], function(require, exports, module) {

  /**
   * @require "common/components/datepicker/jquery.ui.datepicker.css"
  **/
  require('common/components/datepicker/jquery.ui.datepicker');
  $.datepicker.regional['zh-CN'] = {
      closeText: '关闭',
      prevText: '上月',
      nextText: '下月',
      currentText: '今天',
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
      weekHeader: '周',
      dateFormat: 'yy-mm-dd',
      firstDay: 1,
      showMonthAfterYear: true,
  };
  $.datepicker.setDefaults($.datepicker.regional['zh-CN']);
  

});
/*!common/components/fancyselect/fancyselect.js*/
;define('common/components/fancyselect/fancyselect', ['require', 'exports', 'module'], function(require, exports, module) {

  // Generated by CoffeeScript 1.4.0
  (function() {
    var $;
  
    $ = window.jQuery || window.Zepto || window.$;
  
    $.fn.fancySelect = function(opts) {
      var isiOS, settings;
      if (opts == null) {
        opts = {};
      }
      settings = $.extend({
        forceiOS: false,
        includeBlank: false,
        optionTemplate: function(optionEl) {
          return optionEl.text();
        },
        triggerTemplate: function(optionEl) {
          return optionEl.text();
        }
      }, opts);
      isiOS = !!navigator.userAgent.match(/iP(hone|od|ad)/i);
      return this.each(function() {
        var copyOptionsToList, disabled, options, sel, trigger, updateTriggerText, wrapper;
        sel = $(this);
        if (sel.hasClass('fancified') || sel[0].tagName !== 'SELECT') {
          return;
        }
        sel.addClass('fancified');
        sel.css({
          width: 1,
          height: 1,
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0
        });
        sel.wrap('<div class="fancy-select">');
        wrapper = sel.parent();
        if (sel.data('class')) {
          wrapper.addClass(sel.data('class'));
        }
        wrapper.append('<div class="trigger icon-arrow-down-after">');
        if (!(isiOS && !settings.forceiOS)) {
          wrapper.append('<ul class="options">');
        }
        trigger = wrapper.find('.trigger');
        options = wrapper.find('.options');
        disabled = sel.prop('disabled');
        if (disabled) {
          wrapper.addClass('disabled');
        }
        updateTriggerText = function() {
          var triggerHtml;
          triggerHtml = settings.triggerTemplate(sel.find(':selected'));
          return trigger.html(triggerHtml);
        };
        sel.on('blur.fs', function() {
          if (trigger.hasClass('open')) {
            return setTimeout(function() {
              return trigger.trigger('close.fs');
            }, 120);
          }
        });
        trigger.on('close.fs', function() {
          trigger.removeClass('open');
          return options.removeClass('open');
        });
        trigger.on('click.fs', function() {
          var offParent, parent;
          if (!disabled) {
            trigger.toggleClass('open');
            if (isiOS && !settings.forceiOS) {
              if (trigger.hasClass('open')) {
                return sel.focus();
              }
            } else {
              if (trigger.hasClass('open')) {
                parent = trigger.parent();
                offParent = parent.offsetParent();
                if ((parent.offset().top + parent.outerHeight() + options.outerHeight() + 20) > $(window).height() + $(window).scrollTop()) {
                  options.addClass('overflowing');
                } else {
                  options.removeClass('overflowing');
                }
              }
              options.toggleClass('open');
              if (!isiOS) {
                return sel.focus();
              }
            }
          }
        });
        sel.on('enable', function() {
          sel.prop('disabled', false);
          wrapper.removeClass('disabled');
          disabled = false;
          return copyOptionsToList();
        });
        sel.on('disable', function() {
          sel.prop('disabled', true);
          wrapper.addClass('disabled');
          return disabled = true;
        });
        sel.on('change.fs', function(e) {
          if (e.originalEvent && e.originalEvent.isTrusted) {
            return e.stopPropagation();
          } else {
            return updateTriggerText();
          }
        });
        sel.on('keydown', function(e) {
          var hovered, newHovered, w;
          w = e.which;
          hovered = options.find('.hover');
          hovered.removeClass('hover');
          if (!options.hasClass('open')) {
            if (w === 13 || w === 32 || w === 38 || w === 40) {
              e.preventDefault();
              return trigger.trigger('click.fs');
            }
          } else {
            if (w === 38) {
              e.preventDefault();
              if (hovered.length && hovered.index() > 0) {
                hovered.prev().addClass('hover');
              } else {
                options.find('li:last-child').addClass('hover');
              }
            } else if (w === 40) {
              e.preventDefault();
              if (hovered.length && hovered.index() < options.find('li').length - 1) {
                hovered.next().addClass('hover');
              } else {
                options.find('li:first-child').addClass('hover');
              }
            } else if (w === 27) {
              e.preventDefault();
              trigger.trigger('click.fs');
            } else if (w === 13 || w === 32) {
              e.preventDefault();
              hovered.trigger('click.fs');
            } else if (w === 9) {
              if (trigger.hasClass('open')) {
                trigger.trigger('close.fs');
              }
            }
            newHovered = options.find('.hover');
            if (newHovered.length) {
              options.scrollTop(0);
              return options.scrollTop(newHovered.position().top - 12);
            }
          }
        });
        options.on('click.fs', 'li', function(e) {
          var clicked;
          clicked = $(this);
          sel.val(clicked.data('raw-value'));
          if (!isiOS) {
            sel.trigger('blur.fs').trigger('focus.fs');
          }
          options.find('.selected').removeClass('selected');
          clicked.addClass('selected');
          trigger.addClass('selected');
          return sel.val(clicked.data('raw-value')).trigger('change.fs').trigger('blur.fs').trigger('focus.fs');
        });
        options.on('mouseenter.fs', 'li', function() {
          var hovered, nowHovered;
          nowHovered = $(this);
          hovered = options.find('.hover');
          hovered.removeClass('hover');
          return nowHovered.addClass('hover');
        });
        options.on('mouseleave.fs', 'li', function() {
          return options.find('.hover').removeClass('hover');
        });
        copyOptionsToList = function() {
          var selOpts;
          updateTriggerText();
          if (isiOS && !settings.forceiOS) {
            return;
          }
          selOpts = sel.find('option');
          return sel.find('option').each(function(i, opt) {
            var optHtml;
            opt = $(opt);
            if (!opt.prop('disabled') && (opt.val() || settings.includeBlank)) {
              optHtml = settings.optionTemplate(opt);
              if (opt.prop('selected')) {
                return options.append("<li data-raw-value=\"" + (opt.val()) + "\" class=\"selected\">" + optHtml + "</li>");
              } else {
                return options.append("<li data-raw-value=\"" + (opt.val()) + "\">" + optHtml + "</li>");
              }
            }
          });
        };
        sel.on('update.fs', function() {
          wrapper.find('.options').empty();
          return copyOptionsToList();
        });
        return copyOptionsToList();
      });
    };
  
  }).call(this);
  

});
/*!dep/Caret.js/dist/jquery.caret.js*/
;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define('dep/Caret.js/dist/jquery.caret', ["jquery"], function ($) {
      return (root.returnExportsGlobal = factory($));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
}(this, function ($) {

/*
  Implement Github like autocomplete mentions
  http://ichord.github.com/At.js

  Copyright (c) 2013 chord.luo@gmail.com
  Licensed under the MIT license.
*/

/*
本插件操作 textarea 或者 input 内的插入符
只实现了获得插入符在文本框中的位置，我设置
插入符的位置.
*/

"use strict";
var EditableCaret, InputCaret, Mirror, Utils, discoveryIframeOf, methods, oDocument, oFrame, oWindow, pluginName, setContextBy;

pluginName = 'caret';

EditableCaret = (function() {
  function EditableCaret($inputor) {
    this.$inputor = $inputor;
    this.domInputor = this.$inputor[0];
  }

  EditableCaret.prototype.setPos = function(pos) {
    return this.domInputor;
  };

  EditableCaret.prototype.getIEPosition = function() {
    return this.getPosition();
  };

  EditableCaret.prototype.getPosition = function() {
    var inputor_offset, offset;
    offset = this.getOffset();
    inputor_offset = this.$inputor.offset();
    offset.left -= inputor_offset.left;
    offset.top -= inputor_offset.top;
    return offset;
  };

  EditableCaret.prototype.getOldIEPos = function() {
    var preCaretTextRange, textRange;
    textRange = oDocument.selection.createRange();
    preCaretTextRange = oDocument.body.createTextRange();
    preCaretTextRange.moveToElementText(this.domInputor);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    return preCaretTextRange.text.length;
  };

  EditableCaret.prototype.getPos = function() {
    var clonedRange, pos, range;
    if (range = this.range()) {
      clonedRange = range.cloneRange();
      clonedRange.selectNodeContents(this.domInputor);
      clonedRange.setEnd(range.endContainer, range.endOffset);
      pos = clonedRange.toString().length;
      clonedRange.detach();
      return pos;
    } else if (oDocument.selection) {
      return this.getOldIEPos();
    }
  };

  EditableCaret.prototype.getOldIEOffset = function() {
    var range, rect;
    range = oDocument.selection.createRange().duplicate();
    range.moveStart("character", -1);
    rect = range.getBoundingClientRect();
    return {
      height: rect.bottom - rect.top,
      left: rect.left,
      top: rect.top
    };
  };

  EditableCaret.prototype.getOffset = function(pos) {
    var clonedRange, offset, range, rect, shadowCaret;
    if (oWindow.getSelection && (range = this.range())) {
      if (range.endOffset - 1 > 0 && range.endContainer === !this.domInputor) {
        clonedRange = range.cloneRange();
        clonedRange.setStart(range.endContainer, range.endOffset - 1);
        clonedRange.setEnd(range.endContainer, range.endOffset);
        rect = clonedRange.getBoundingClientRect();
        offset = {
          height: rect.height,
          left: rect.left + rect.width,
          top: rect.top
        };
        clonedRange.detach();
      }
      if (!offset || (offset != null ? offset.height : void 0) === 0) {
        clonedRange = range.cloneRange();
        shadowCaret = $(oDocument.createTextNode("|"));
        clonedRange.insertNode(shadowCaret[0]);
        clonedRange.selectNode(shadowCaret[0]);
        rect = clonedRange.getBoundingClientRect();
        offset = {
          height: rect.height,
          left: rect.left,
          top: rect.top
        };
        shadowCaret.remove();
        clonedRange.detach();
      }
    } else if (oDocument.selection) {
      offset = this.getOldIEOffset();
    }
    if (offset) {
      offset.top += $(oWindow).scrollTop();
      offset.left += $(oWindow).scrollLeft();
    }
    return offset;
  };

  EditableCaret.prototype.range = function() {
    var sel;
    if (!oWindow.getSelection) {
      return;
    }
    sel = oWindow.getSelection();
    if (sel.rangeCount > 0) {
      return sel.getRangeAt(0);
    } else {
      return null;
    }
  };

  return EditableCaret;

})();

InputCaret = (function() {
  function InputCaret($inputor) {
    this.$inputor = $inputor;
    this.domInputor = this.$inputor[0];
  }

  InputCaret.prototype.getIEPos = function() {
    var endRange, inputor, len, normalizedValue, pos, range, textInputRange;
    inputor = this.domInputor;
    range = oDocument.selection.createRange();
    pos = 0;
    if (range && range.parentElement() === inputor) {
      normalizedValue = inputor.value.replace(/\r\n/g, "\n");
      len = normalizedValue.length;
      textInputRange = inputor.createTextRange();
      textInputRange.moveToBookmark(range.getBookmark());
      endRange = inputor.createTextRange();
      endRange.collapse(false);
      if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
        pos = len;
      } else {
        pos = -textInputRange.moveStart("character", -len);
      }
    }
    return pos;
  };

  InputCaret.prototype.getPos = function() {
    if (oDocument.selection) {
      return this.getIEPos();
    } else {
      return this.domInputor.selectionStart;
    }
  };

  InputCaret.prototype.setPos = function(pos) {
    var inputor, range;
    inputor = this.domInputor;
    if (oDocument.selection) {
      range = inputor.createTextRange();
      range.move("character", pos);
      range.select();
    } else if (inputor.setSelectionRange) {
      inputor.setSelectionRange(pos, pos);
    }
    return inputor;
  };

  InputCaret.prototype.getIEOffset = function(pos) {
    var h, textRange, x, y;
    textRange = this.domInputor.createTextRange();
    pos || (pos = this.getPos());
    textRange.move('character', pos);
    x = textRange.boundingLeft;
    y = textRange.boundingTop;
    h = textRange.boundingHeight;
    return {
      left: x,
      top: y,
      height: h
    };
  };

  InputCaret.prototype.getOffset = function(pos) {
    var $inputor, offset, position;
    $inputor = this.$inputor;
    if (oDocument.selection) {
      offset = this.getIEOffset(pos);
      offset.top += $(oWindow).scrollTop() + $inputor.scrollTop();
      offset.left += $(oWindow).scrollLeft() + $inputor.scrollLeft();
      return offset;
    } else {
      offset = $inputor.offset();
      position = this.getPosition(pos);
      return offset = {
        left: offset.left + position.left - $inputor.scrollLeft(),
        top: offset.top + position.top - $inputor.scrollTop(),
        height: position.height
      };
    }
  };

  InputCaret.prototype.getPosition = function(pos) {
    var $inputor, at_rect, end_range, format, html, mirror, start_range;
    $inputor = this.$inputor;
    format = function(value) {
      value = value.replace(/<|>|`|"|&/g, '?').replace(/\r\n|\r|\n/g, "<br/>");
      if (/firefox/i.test(navigator.userAgent)) {
        value = value.replace(/\s/g, '&nbsp;');
      }
      return value;
    };
    if (pos === void 0) {
      pos = this.getPos();
    }
    start_range = $inputor.val().slice(0, pos);
    end_range = $inputor.val().slice(pos);
    html = "<span style='position: relative; display: inline;'>" + format(start_range) + "</span>";
    html += "<span id='caret' style='position: relative; display: inline;'>|</span>";
    html += "<span style='position: relative; display: inline;'>" + format(end_range) + "</span>";
    mirror = new Mirror($inputor);
    return at_rect = mirror.create(html).rect();
  };

  InputCaret.prototype.getIEPosition = function(pos) {
    var h, inputorOffset, offset, x, y;
    offset = this.getIEOffset(pos);
    inputorOffset = this.$inputor.offset();
    x = offset.left - inputorOffset.left;
    y = offset.top - inputorOffset.top;
    h = offset.height;
    return {
      left: x,
      top: y,
      height: h
    };
  };

  return InputCaret;

})();

Mirror = (function() {
  Mirror.prototype.css_attr = ["borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopStyle", "borderRightStyle", "borderBottomStyle", "borderLeftStyle", "borderTopWidth", "boxSizing", "fontFamily", "fontSize", "fontWeight", "height", "letterSpacing", "lineHeight", "marginBottom", "marginLeft", "marginRight", "marginTop", "outlineWidth", "overflow", "overflowX", "overflowY", "paddingBottom", "paddingLeft", "paddingRight", "paddingTop", "textAlign", "textOverflow", "textTransform", "whiteSpace", "wordBreak", "wordWrap"];

  function Mirror($inputor) {
    this.$inputor = $inputor;
  }

  Mirror.prototype.mirrorCss = function() {
    var css,
      _this = this;
    css = {
      position: 'absolute',
      left: -9999,
      top: 0,
      zIndex: -20000
    };
    if (this.$inputor.prop('tagName') === 'TEXTAREA') {
      this.css_attr.push('width');
    }
    $.each(this.css_attr, function(i, p) {
      return css[p] = _this.$inputor.css(p);
    });
    return css;
  };

  Mirror.prototype.create = function(html) {
    this.$mirror = $('<div></div>');
    this.$mirror.css(this.mirrorCss());
    this.$mirror.html(html);
    this.$inputor.after(this.$mirror);
    return this;
  };

  Mirror.prototype.rect = function() {
    var $flag, pos, rect;
    $flag = this.$mirror.find("#caret");
    pos = $flag.position();
    rect = {
      left: pos.left,
      top: pos.top,
      height: $flag.height()
    };
    this.$mirror.remove();
    return rect;
  };

  return Mirror;

})();

Utils = {
  contentEditable: function($inputor) {
    return !!($inputor[0].contentEditable && $inputor[0].contentEditable === 'true');
  }
};

methods = {
  pos: function(pos) {
    if (pos || pos === 0) {
      return this.setPos(pos);
    } else {
      return this.getPos();
    }
  },
  position: function(pos) {
    if (oDocument.selection) {
      return this.getIEPosition(pos);
    } else {
      return this.getPosition(pos);
    }
  },
  offset: function(pos) {
    var offset;
    offset = this.getOffset(pos);
    return offset;
  }
};

oDocument = null;

oWindow = null;

oFrame = null;

setContextBy = function(settings) {
  var iframe;
  if (iframe = settings != null ? settings.iframe : void 0) {
    oFrame = iframe;
    oWindow = iframe.contentWindow;
    return oDocument = iframe.contentDocument || oWindow.document;
  } else {
    oFrame = void 0;
    oWindow = window;
    return oDocument = document;
  }
};

discoveryIframeOf = function($dom) {
  var error;
  oDocument = $dom[0].ownerDocument;
  oWindow = oDocument.defaultView || oDocument.parentWindow;
  try {
    return oFrame = oWindow.frameElement;
  } catch (_error) {
    error = _error;
  }
};

$.fn.caret = function(method, value, settings) {
  var caret;
  if (methods[method]) {
    if ($.isPlainObject(value)) {
      setContextBy(value);
      value = void 0;
    } else {
      setContextBy(settings);
    }
    caret = Utils.contentEditable(this) ? new EditableCaret(this) : new InputCaret(this);
    return methods[method].apply(caret, [value]);
  } else {
    return $.error("Method " + method + "does not exist on jQuery.caret");
  }
};

$.fn.caret.EditableCaret = EditableCaret;

$.fn.caret.InputCaret = InputCaret;

$.fn.caret.Utils = Utils;

$.fn.caret.apis = methods;


}));

/*!dep/At.js/dist/js/jquery.atwho.js*/
;/*! jquery.atwho - v1.4.0 %>
* Copyright (c) 2015 chord.luo <chord.luo@gmail.com>;
* homepage: http://ichord.github.com/At.js
* Licensed MIT
*/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('dep/At.js/dist/js/jquery.atwho', ["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
}(this, function (jquery) {

var $, Api, App, Controller, DEFAULT_CALLBACKS, EditableController, KEY_CODE, Model, TextareaController, View,
  slice = [].slice,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

$ = jquery;

App = (function() {
  function App(inputor) {
    this.currentFlag = null;
    this.controllers = {};
    this.aliasMaps = {};
    this.$inputor = $(inputor);
    this.setupRootElement();
    this.listen();
  }

  App.prototype.createContainer = function(doc) {
    var ref;
    if ((ref = this.$el) != null) {
      ref.remove();
    }
    return $(doc.body).append(this.$el = $("<div class='atwho-container'></div>"));
  };

  App.prototype.setupRootElement = function(iframe, asRoot) {
    var error;
    if (asRoot == null) {
      asRoot = false;
    }
    if (iframe) {
      this.window = iframe.contentWindow;
      this.document = iframe.contentDocument || this.window.document;
      this.iframe = iframe;
    } else {
      this.document = this.$inputor[0].ownerDocument;
      this.window = this.document.defaultView || this.document.parentWindow;
      try {
        this.iframe = this.window.frameElement;
      } catch (_error) {
        error = _error;
        this.iframe = null;
        if ($.fn.atwho.debug) {
          throw new Error("iframe auto-discovery is failed.\nPlease use `setIframe` to set the target iframe manually.\n" + error);
        }
      }
    }
    return this.createContainer((this.iframeAsRoot = asRoot) ? this.document : document);
  };

  App.prototype.controller = function(at) {
    var c, current, currentFlag, ref;
    if (this.aliasMaps[at]) {
      current = this.controllers[this.aliasMaps[at]];
    } else {
      ref = this.controllers;
      for (currentFlag in ref) {
        c = ref[currentFlag];
        if (currentFlag === at) {
          current = c;
          break;
        }
      }
    }
    if (current) {
      return current;
    } else {
      return this.controllers[this.currentFlag];
    }
  };

  App.prototype.setContextFor = function(at) {
    this.currentFlag = at;
    return this;
  };

  App.prototype.reg = function(flag, setting) {
    var base, controller;
    controller = (base = this.controllers)[flag] || (base[flag] = this.$inputor.is('[contentEditable]') ? new EditableController(this, flag) : new TextareaController(this, flag));
    if (setting.alias) {
      this.aliasMaps[setting.alias] = flag;
    }
    controller.init(setting);
    return this;
  };

  App.prototype.listen = function() {
    return this.$inputor.on('compositionstart', (function(_this) {
      return function(e) {
        var ref;
        if ((ref = _this.controller()) != null) {
          ref.view.hide();
        }
        _this.isComposing = true;
        return null;
      };
    })(this)).on('compositionend', (function(_this) {
      return function(e) {
        _this.isComposing = false;
        return null;
      };
    })(this)).on('keyup.atwhoInner', (function(_this) {
      return function(e) {
        return _this.onKeyup(e);
      };
    })(this)).on('keydown.atwhoInner', (function(_this) {
      return function(e) {
        return _this.onKeydown(e);
      };
    })(this)).on('blur.atwhoInner', (function(_this) {
      return function(e) {
        var c;
        if (c = _this.controller()) {
          c.expectedQueryCBId = null;
          return c.view.hide(e, c.getOpt("displayTimeout"));
        }
      };
    })(this)).on('click.atwhoInner', (function(_this) {
      return function(e) {
        return _this.dispatch(e);
      };
    })(this)).on('scroll.atwhoInner', (function(_this) {
      return function() {
        var lastScrollTop;
        lastScrollTop = _this.$inputor.scrollTop();
        return function(e) {
          var currentScrollTop, ref;
          currentScrollTop = e.target.scrollTop;
          if (lastScrollTop !== currentScrollTop) {
            if ((ref = _this.controller()) != null) {
              ref.view.hide(e);
            }
          }
          lastScrollTop = currentScrollTop;
          return true;
        };
      };
    })(this)());
  };

  App.prototype.shutdown = function() {
    var _, c, ref;
    ref = this.controllers;
    for (_ in ref) {
      c = ref[_];
      c.destroy();
      delete this.controllers[_];
    }
    this.$inputor.off('.atwhoInner');
    return this.$el.remove();
  };

  App.prototype.dispatch = function(e) {
    var _, c, ref, results;
    ref = this.controllers;
    results = [];
    for (_ in ref) {
      c = ref[_];
      results.push(c.lookUp(e));
    }
    return results;
  };

  App.prototype.onKeyup = function(e) {
    var ref;
    switch (e.keyCode) {
      case KEY_CODE.ESC:
        e.preventDefault();
        if ((ref = this.controller()) != null) {
          ref.view.hide();
        }
        break;
      case KEY_CODE.DOWN:
      case KEY_CODE.UP:
      case KEY_CODE.CTRL:
      case KEY_CODE.ENTER:
        $.noop();
        break;
      case KEY_CODE.P:
      case KEY_CODE.N:
        if (!e.ctrlKey) {
          this.dispatch(e);
        }
        break;
      default:
        this.dispatch(e);
    }
  };

  App.prototype.onKeydown = function(e) {
    var ref, view;
    view = (ref = this.controller()) != null ? ref.view : void 0;
    if (!(view && view.visible())) {
      return;
    }
    switch (e.keyCode) {
      case KEY_CODE.ESC:
        e.preventDefault();
        view.hide(e);
        break;
      case KEY_CODE.UP:
        e.preventDefault();
        view.prev();
        break;
      case KEY_CODE.DOWN:
        e.preventDefault();
        view.next();
        break;
      case KEY_CODE.P:
        if (!e.ctrlKey) {
          return;
        }
        e.preventDefault();
        view.prev();
        break;
      case KEY_CODE.N:
        if (!e.ctrlKey) {
          return;
        }
        e.preventDefault();
        view.next();
        break;
      case KEY_CODE.TAB:
      case KEY_CODE.ENTER:
      case KEY_CODE.SPACE:
        if (!view.visible()) {
          return;
        }
        if (!this.controller().getOpt('spaceSelectsMatch') && e.keyCode === KEY_CODE.SPACE) {
          return;
        }
        if (!this.controller().getOpt('tabSelectsMatch') && e.keyCode === KEY_CODE.TAB) {
          return;
        }
        if (view.highlighted()) {
          e.preventDefault();
          view.choose(e);
        } else {
          view.hide(e);
        }
        break;
      default:
        $.noop();
    }
  };

  return App;

})();

Controller = (function() {
  Controller.prototype.uid = function() {
    return (Math.random().toString(16) + "000000000").substr(2, 8) + (new Date().getTime());
  };

  function Controller(app1, at1) {
    this.app = app1;
    this.at = at1;
    this.$inputor = this.app.$inputor;
    this.id = this.$inputor[0].id || this.uid();
    this.expectedQueryCBId = null;
    this.setting = null;
    this.query = null;
    this.pos = 0;
    this.range = null;
    if ((this.$el = $("#atwho-ground-" + this.id, this.app.$el)).length === 0) {
      this.app.$el.append(this.$el = $("<div id='atwho-ground-" + this.id + "'></div>"));
    }
    this.model = new Model(this);
    this.view = new View(this);
  }

  Controller.prototype.init = function(setting) {
    this.setting = $.extend({}, this.setting || $.fn.atwho["default"], setting);
    this.view.init();
    return this.model.reload(this.setting.data);
  };

  Controller.prototype.destroy = function() {
    this.trigger('beforeDestroy');
    this.model.destroy();
    this.view.destroy();
    return this.$el.remove();
  };

  Controller.prototype.callDefault = function() {
    var args, error, funcName;
    funcName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    try {
      return DEFAULT_CALLBACKS[funcName].apply(this, args);
    } catch (_error) {
      error = _error;
      return $.error(error + " Or maybe At.js doesn't have function " + funcName);
    }
  };

  Controller.prototype.trigger = function(name, data) {
    var alias, eventName;
    if (data == null) {
      data = [];
    }
    data.push(this);
    alias = this.getOpt('alias');
    eventName = alias ? name + "-" + alias + ".atwho" : name + ".atwho";
    return this.$inputor.trigger(eventName, data);
  };

  Controller.prototype.callbacks = function(funcName) {
    return this.getOpt("callbacks")[funcName] || DEFAULT_CALLBACKS[funcName];
  };

  Controller.prototype.getOpt = function(at, default_value) {
    var e;
    try {
      return this.setting[at];
    } catch (_error) {
      e = _error;
      return null;
    }
  };

  Controller.prototype.insertContentFor = function($li) {
    var data, tpl;
    tpl = this.getOpt('insertTpl');
    data = $.extend({}, $li.data('item-data'), {
      'atwho-at': this.at
    });
    return this.callbacks("tplEval").call(this, tpl, data, "onInsert");
  };

  Controller.prototype.renderView = function(data) {
    var searchKey;
    searchKey = this.getOpt("searchKey");
    data = this.callbacks("sorter").call(this, this.query.text, data.slice(0, 1001), searchKey);
    return this.view.render(data.slice(0, this.getOpt('limit')));
  };

  Controller.arrayToDefaultHash = function(data) {
    var i, item, len, results;
    if (!$.isArray(data)) {
      return data;
    }
    results = [];
    for (i = 0, len = data.length; i < len; i++) {
      item = data[i];
      if ($.isPlainObject(item)) {
        results.push(item);
      } else {
        results.push({
          name: item
        });
      }
    }
    return results;
  };

  Controller.prototype.lookUp = function(e) {
    var query, wait;
    if (e && e.type === 'click' && !this.getOpt('lookUpOnClick')) {
      return;
    }
    if (this.getOpt('suspendOnComposing') && this.app.isComposing) {
      return;
    }
    query = this.catchQuery(e);
    
    if(query && query.text){
    	query.text = query.text.replace(/'/g, '');
    }
    
    if (!query) {
      this.expectedQueryCBId = null;
      return query;
    }
    this.app.setContextFor(this.at);
    if (wait = this.getOpt('delay')) {
      this._delayLookUp(query, wait);
    } else {
      this._lookUp(query);
    }
    return query;
  };

  Controller.prototype._delayLookUp = function(query, wait) {
    var now, remaining;
    now = Date.now ? Date.now() : new Date().getTime();
    this.previousCallTime || (this.previousCallTime = now);
    remaining = wait - (now - this.previousCallTime);
    if ((0 < remaining && remaining < wait)) {
      this.previousCallTime = now;
      this._stopDelayedCall();
      return this.delayedCallTimeout = setTimeout((function(_this) {
        return function() {
          _this.previousCallTime = 0;
          _this.delayedCallTimeout = null;
          return _this._lookUp(query);
        };
      })(this), wait);
    } else {
      this._stopDelayedCall();
      if (this.previousCallTime !== now) {
        this.previousCallTime = 0;
      }
      return this._lookUp(query);
    }
  };

  Controller.prototype._stopDelayedCall = function() {
    if (this.delayedCallTimeout) {
      clearTimeout(this.delayedCallTimeout);
      return this.delayedCallTimeout = null;
    }
  };

  Controller.prototype._generateQueryCBId = function() {
    return {};
  };

  Controller.prototype._lookUp = function(query) {
    var _callback;
    _callback = function(queryCBId, data) {
      if (queryCBId !== this.expectedQueryCBId) {
        return;
      }
      if (data && data.length > 0) {
        return this.renderView(this.constructor.arrayToDefaultHash(data));
      } else {
        return this.view.hide();
      }
    };
    this.expectedQueryCBId = this._generateQueryCBId();
    return this.model.query(query.text, $.proxy(_callback, this, this.expectedQueryCBId));
  };

  return Controller;

})();

TextareaController = (function(superClass) {
  extend(TextareaController, superClass);

  function TextareaController() {
    return TextareaController.__super__.constructor.apply(this, arguments);
  }

  TextareaController.prototype.catchQuery = function() {
    var caretPos, content, end, isString, query, start, subtext;
    content = this.$inputor.val();
    caretPos = this.$inputor.caret('pos', {
      iframe: this.app.iframe
    });
    subtext = content.slice(0, caretPos);
    query = this.callbacks("matcher").call(this, this.at, subtext, this.getOpt('startWithSpace'));
    
    isString = typeof query === 'string';
    if (isString && query.length < this.getOpt('minLen', 0)) {
      return;
    }
    if (isString && query.length <= this.getOpt('maxLen', 20)) {
      start = caretPos - query.length;
      end = start + query.length;
      this.pos = start;
      query = {
        'text': query,
        'headPos': start,
        'endPos': end
      };
      this.trigger("matched", [this.at, query.text]);
    } else {
      query = null;
      this.view.hide();
    }
    return this.query = query;
  };

  TextareaController.prototype.rect = function() {
    var c, iframeOffset, scaleBottom;
    if (!(c = this.$inputor.caret('offset', this.pos - 1, {
      iframe: this.app.iframe
    }))) {
      return;
    }
    if (this.app.iframe && !this.app.iframeAsRoot) {
      iframeOffset = $(this.app.iframe).offset();
      c.left += iframeOffset.left;
      c.top += iframeOffset.top;
    }
    scaleBottom = this.app.document.selection ? 0 : 2;
    return {
      left: c.left,
      top: c.top,
      bottom: c.top + c.height + scaleBottom
    };
  };

  TextareaController.prototype.insert = function(content, $li) {
    var $inputor, source, startStr, suffix, text;
    $inputor = this.$inputor;
    source = $inputor.val();
    startStr = source.slice(0, Math.max(this.query.headPos - this.at.length, 0));
    suffix = (suffix = this.getOpt('suffix')) === "" ? suffix : suffix || " ";
    content += suffix;
    text = "" + startStr + content + (source.slice(this.query['endPos'] || 0));
    $inputor.val(text);
    $inputor.caret('pos', startStr.length + content.length, {
      iframe: this.app.iframe
    });
    if (!$inputor.is(':focus')) {
      $inputor.focus();
    }
    return $inputor.change();
  };

  return TextareaController;

})(Controller);

EditableController = (function(superClass) {
  extend(EditableController, superClass);

  function EditableController() {
    return EditableController.__super__.constructor.apply(this, arguments);
  }

  EditableController.prototype._getRange = function() {
    var sel;
    sel = this.app.window.getSelection();
    if (sel.rangeCount > 0) {
      return sel.getRangeAt(0);
    }
  };

  EditableController.prototype._setRange = function(position, node, range) {
    if (range == null) {
      range = this._getRange();
    }
    if (!range) {
      return;
    }
    node = $(node)[0];
    if (position === 'after') {
      range.setEndAfter(node);
      range.setStartAfter(node);
    } else {
      range.setEndBefore(node);
      range.setStartBefore(node);
    }
    range.collapse(false);
    return this._clearRange(range);
  };

  EditableController.prototype._clearRange = function(range) {
    var sel;
    if (range == null) {
      range = this._getRange();
    }
    sel = this.app.window.getSelection();
    if (this.ctrl_a_pressed == null) {
      sel.removeAllRanges();
      return sel.addRange(range);
    }
  };

  EditableController.prototype._movingEvent = function(e) {
    var ref;
    return e.type === 'click' || ((ref = e.which) === KEY_CODE.RIGHT || ref === KEY_CODE.LEFT || ref === KEY_CODE.UP || ref === KEY_CODE.DOWN);
  };

  EditableController.prototype._unwrap = function(node) {
    var next;
    node = $(node).unwrap().get(0);
    if ((next = node.nextSibling) && next.nodeValue) {
      node.nodeValue += next.nodeValue;
      $(next).remove();
    }
    return node;
  };

  EditableController.prototype.catchQuery = function(e) {
    var $inserted, $query, _range, index, inserted, isString, lastNode, matched, offset, query, query_content, range;
    
    if (!(range = this._getRange())) {
      return;
    }
    if (!range.collapsed) {
      return;
    }
    if (e.which === KEY_CODE.ENTER) {
      ($query = $(range.startContainer).closest('.atwho-query')).contents().unwrap();
      if ($query.is(':empty')) {
        $query.remove();
      }
      ($query = $(".atwho-query", this.app.document)).text($query.text()).contents().last().unwrap();
      this._clearRange();
      return;
    }
    if (/firefox/i.test(navigator.userAgent)) {
      if ($(range.startContainer).is(this.$inputor)) {
        this._clearRange();
        return;
      }
      if (e.which === KEY_CODE.BACKSPACE && range.startContainer.nodeType === document.ELEMENT_NODE && (offset = range.startOffset - 1) >= 0) {
        _range = range.cloneRange();
        _range.setStart(range.startContainer, offset);
        if ($(_range.cloneContents()).contents().last().is('.atwho-inserted')) {
          inserted = $(range.startContainer).contents().get(offset);
          this._setRange('after', $(inserted).contents().last());
        }
      } else if (e.which === KEY_CODE.LEFT && range.startContainer.nodeType === document.TEXT_NODE) {
        $inserted = $(range.startContainer.previousSibling);
        if ($inserted.is('.atwho-inserted') && range.startOffset === 0) {
          this._setRange('after', $inserted.contents().last());
        }
      }
    }
    $(range.startContainer).closest('.atwho-inserted').addClass('atwho-query').siblings().removeClass('atwho-query');
    if (($query = $(".atwho-query", this.app.document)).length > 0 && $query.is(':empty') && $query.text().length === 0) {
      $query.remove();
    }
    if (!this._movingEvent(e)) {
      $query.removeClass('atwho-inserted');
    }
    if ($query.length > 0) {
      switch (e.which) {
        case KEY_CODE.LEFT:
          this._setRange('before', $query.get(0), range);
          $query.removeClass('atwho-query');
          return;
        case KEY_CODE.RIGHT:
          this._setRange('after', $query.get(0).nextSibling, range);
          $query.removeClass('atwho-query');
          return;
      }
    }
    if ($query.length > 0 && (query_content = $query.attr('data-atwho-at-query'))) {
      $query.empty().html(query_content).attr('data-atwho-at-query', null);
      this._setRange('after', $query.get(0), range);
    }
    _range = range.cloneRange();
    _range.setStart(range.startContainer, 0);
    matched = this.callbacks("matcher").call(this, this.at, _range.toString(), this.getOpt('startWithSpace'));
    isString = typeof matched === 'string';
    if ($query.length === 0 && isString && (index = range.startOffset - this.at.length - matched.length) >= 0) {
      range.setStart(range.startContainer, index);
      $query = $('<span/>', this.app.document).attr(this.getOpt("editableAtwhoQueryAttrs")).addClass('atwho-query');
      range.surroundContents($query.get(0));
      lastNode = $query.contents().last().get(0);
      if (/firefox/i.test(navigator.userAgent)) {
        range.setStart(lastNode, lastNode.length);
        range.setEnd(lastNode, lastNode.length);
        this._clearRange(range);
      } else {
        this._setRange('after', lastNode, range);
      }
    }
    if (isString && matched.length < this.getOpt('minLen', 0)) {
      return;
    }
    if (isString && matched.length <= this.getOpt('maxLen', 20)) {
      query = {
        text: matched,
        el: $query
      };
      this.trigger("matched", [this.at, query.text]);
      return this.query = query;
    } else {
      this.view.hide();
      this.query = {
        el: $query
      };
      if ($query.text().indexOf(this.at) >= 0) {
        if (this._movingEvent(e) && $query.hasClass('atwho-inserted')) {
          $query.removeClass('atwho-query');
        } else if (false !== this.callbacks('afterMatchFailed').call(this, this.at, $query)) {
          this._setRange("after", this._unwrap($query.text($query.text()).contents().first()));
        }
      }
      return null;
    }
  };

  EditableController.prototype.rect = function() {
    var $iframe, iframeOffset, rect;
    rect = this.query.el.offset();
    if (this.app.iframe && !this.app.iframeAsRoot) {
      iframeOffset = ($iframe = $(this.app.iframe)).offset();
      rect.left += iframeOffset.left - this.$inputor.scrollLeft();
      rect.top += iframeOffset.top - this.$inputor.scrollTop();
    }
    rect.bottom = rect.top + this.query.el.height();
    return rect;
  };

  EditableController.prototype.insert = function(content, $li) {
    var data, range, suffix, suffixNode;
    suffix = (suffix = this.getOpt('suffix')) === "" ? suffix : suffix || "\u00A0";
    data = $li.data('item-data');
    this.query.el.removeClass('atwho-query').addClass('atwho-inserted').html(content).attr('data-atwho-at-query', "" + data['atwho-at'] + this.query.text);
    if (range = this._getRange()) {
      range.setEndAfter(this.query.el[0]);
      range.collapse(false);
      range.insertNode(suffixNode = this.app.document.createTextNode("\u200D" + suffix));
      this._setRange('after', suffixNode, range);
    }
    if (!this.$inputor.is(':focus')) {
      this.$inputor.focus();
    }
    return this.$inputor.change();
  };

  return EditableController;

})(Controller);

Model = (function() {
  function Model(context) {
    this.context = context;
    this.at = this.context.at;
    this.storage = this.context.$inputor;
  }

  Model.prototype.destroy = function() {
    return this.storage.data(this.at, null);
  };

  Model.prototype.saved = function() {
    return this.fetch() > 0;
  };

  Model.prototype.query = function(query, callback) {
    var _remoteFilter, data, searchKey;
    data = this.fetch();
    searchKey = this.context.getOpt("searchKey");
    data = this.context.callbacks('filter').call(this.context, query, data, searchKey) || [];
    _remoteFilter = this.context.callbacks('remoteFilter');
    if (data.length > 0 || (!_remoteFilter && data.length === 0)) {
      return callback(data);
    } else {
      return _remoteFilter.call(this.context, query, callback);
    }
  };

  Model.prototype.fetch = function() {
    return this.storage.data(this.at) || [];
  };

  Model.prototype.save = function(data) {
    return this.storage.data(this.at, this.context.callbacks("beforeSave").call(this.context, data || []));
  };

  Model.prototype.load = function(data) {
    if (!(this.saved() || !data)) {
      return this._load(data);
    }
  };

  Model.prototype.reload = function(data) {
    return this._load(data);
  };

  Model.prototype._load = function(data) {
    if (typeof data === "string") {
      return $.ajax(data, {
        dataType: "json"
      }).done((function(_this) {
        return function(data) {
          return _this.save(data);
        };
      })(this));
    } else {
      return this.save(data);
    }
  };

  return Model;

})();

View = (function() {
  function View(context) {
    this.context = context;
    this.$el = $("<div class='atwho-view'><ul class='atwho-view-ul'></ul></div>");
    this.timeoutID = null;
    this.context.$el.append(this.$el);
    this.bindEvent();
  }

  View.prototype.init = function() {
    var id;
    id = this.context.getOpt("alias") || this.context.at.charCodeAt(0);
    return this.$el.attr({
      'id': "at-view-" + id
    });
  };

  View.prototype.destroy = function() {
    return this.$el.remove();
  };

  View.prototype.bindEvent = function() {
    var $menu;
    $menu = this.$el.find('ul');
    return $menu.on('mouseenter.atwho-view', 'li', function(e) {
      $menu.find('.cur').removeClass('cur');
      return $(e.currentTarget).addClass('cur');
    }).on('click.atwho-view', 'li', (function(_this) {
      return function(e) {
        $menu.find('.cur').removeClass('cur');
        $(e.currentTarget).addClass('cur');
        _this.choose(e);
        return e.preventDefault();
      };
    })(this));
  };

  View.prototype.visible = function() {
    return this.$el.is(":visible");
  };

  View.prototype.highlighted = function() {
    return this.$el.find(".cur").length > 0;
  };

  View.prototype.choose = function(e) {
    var $li, content;
    if (($li = this.$el.find(".cur")).length) {
      content = this.context.insertContentFor($li);
      this.context._stopDelayedCall();
      this.context.insert(this.context.callbacks("beforeInsert").call(this.context, content, $li), $li);
      this.context.trigger("inserted", [$li, e]);
      this.hide(e);
    }
    if (this.context.getOpt("hideWithoutSuffix")) {
      return this.stopShowing = true;
    }
  };

  View.prototype.reposition = function(rect) {
    var _window, offset, overflowOffset, ref;
    _window = this.context.app.iframeAsRoot ? this.context.app.window : window;
    if (rect.bottom + this.$el.height() - $(_window).scrollTop() > $(_window).height()) {
      rect.bottom = rect.top - this.$el.height();
    }
    if (rect.left > (overflowOffset = $(_window).width() - this.$el.width() - 5)) {
      rect.left = overflowOffset;
    }
    offset = {
      left: rect.left,
      top: rect.bottom
    };
    if ((ref = this.context.callbacks("beforeReposition")) != null) {
      ref.call(this.context, offset);
    }
    this.$el.offset(offset);
    return this.context.trigger("reposition", [offset]);
  };

  View.prototype.next = function() {
    var cur, next;
    cur = this.$el.find('.cur').removeClass('cur');
    next = cur.next();
    if (!next.length) {
      next = this.$el.find('li:first');
    }
    next.addClass('cur');
    return this.scrollTop(Math.max(0, cur.innerHeight() * (next.index() + 2) - this.$el.height()));
  };

  View.prototype.prev = function() {
    var cur, prev;
    cur = this.$el.find('.cur').removeClass('cur');
    prev = cur.prev();
    if (!prev.length) {
      prev = this.$el.find('li:last');
    }
    prev.addClass('cur');
    return this.scrollTop(Math.max(0, cur.innerHeight() * (prev.index() + 2) - this.$el.height()));
  };

  View.prototype.scrollTop = function(scrollTop) {
    var scrollDuration;
    scrollDuration = this.context.getOpt('scrollDuration');
    if (scrollDuration) {
      return this.$el.animate({
        scrollTop: scrollTop
      }, scrollDuration);
    } else {
      return this.$el.scrollTop(scrollTop);
    }
  };

  View.prototype.show = function() {
    var rect;
    if (this.stopShowing) {
      this.stopShowing = false;
      return;
    }
    if (!this.visible()) {
      this.$el.show();
      this.$el.scrollTop(0);
      this.context.trigger('shown');
    }
    if (rect = this.context.rect()) {
      return this.reposition(rect);
    }
  };

  View.prototype.hide = function(e, time) {
    var callback;
    if (!this.visible()) {
      return;
    }
    if (isNaN(time)) {
      this.$el.hide();
      return this.context.trigger('hidden', [e]);
    } else {
      callback = (function(_this) {
        return function() {
          return _this.hide();
        };
      })(this);
      clearTimeout(this.timeoutID);
      return this.timeoutID = setTimeout(callback, time);
    }
  };

  View.prototype.render = function(list) {
    var $li, $ul, i, item, len, li, tpl;
    if (!($.isArray(list) && list.length > 0)) {
      this.hide();
      return;
    }
    this.$el.find('ul').empty();
    $ul = this.$el.find('ul');
    tpl = this.context.getOpt('displayTpl');
    for (i = 0, len = list.length; i < len; i++) {
      item = list[i];
      item = $.extend({}, item, {
        'atwho-at': this.context.at
      });
      li = this.context.callbacks("tplEval").call(this.context, tpl, item, "onDisplay");
      $li = $(this.context.callbacks("highlighter").call(this.context, li, this.context.query.text));
      $li.data("item-data", item);
      $ul.append($li);
    }
    this.show();
    if (this.context.getOpt('highlightFirst')) {
      return $ul.find("li:first").addClass("cur");
    }
  };

  return View;

})();

KEY_CODE = {
  DOWN: 40,
  UP: 38,
  ESC: 27,
  TAB: 9,
  ENTER: 13,
  CTRL: 17,
  A: 65,
  P: 80,
  N: 78,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  BACKSPACE: 8,
  SPACE: 32
};

DEFAULT_CALLBACKS = {
  beforeSave: function(data) {
    return Controller.arrayToDefaultHash(data);
  },
  matcher: function(flag, subtext, should_startWithSpace, acceptSpaceBar) {
    var _a, _y, match, regexp, space;
    flag = flag.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    if (should_startWithSpace) {
      flag = '(?:^|\\s)' + flag;
    }
    _a = decodeURI("%C3%80");
    _y = decodeURI("%C3%BF");
    space = acceptSpaceBar ? "\ " : "";
    regexp = new RegExp(flag + "([A-Za-z" + _a + "-" + _y + "0-9_" + space + "\'\.\+\-]*)$|" + flag + "([^\\x00-\\xff]*)$", 'gi');
    match = regexp.exec(subtext);
    if (match) {
      return match[2] || match[1];
    } else {
      return null;
    }
  },
  filter: function(query, data, searchKey) {
    var _results, i, item, len;
    _results = [];
    var searchKeyArr = searchKey.split(' ');
    for (i = 0, len = data.length; i < len; i++) {
      item = data[i];
      if(searchKeyArr.length==1){
        if (~new String(item[searchKey]).toLowerCase().indexOf(query.toLowerCase())) {
          _results.push(item);
        }
      }else{
        var isShow  = false;
        for(var j= 0,len1=searchKeyArr.length;j<len1;j++){
          if (!isShow && ~new String(item[searchKeyArr[j]]).toLowerCase().indexOf(query.toLowerCase())) {
            isShow=true;
          }
        }
        if(isShow){
          _results.push(item);
        }
      }

    /*  if (~new String(item[searchKey]).toLowerCase().indexOf(query.toLowerCase())) {
        _results.push(item);
      }*/
    }
    return _results;
  },
  remoteFilter: null,
  sorter: function(query, items, searchKey) {
    var _results, i, item, len;
    if (!query) {
      return items;
    }
    _results = [];
    var density = this.getOpt('density');
    var searchKeyArr = searchKey.split(' ');
    for (i = 0, len = items.length; i < len; i++) {
      item = items[i];
      if(searchKeyArr.length==1){
        item.atwho_order = new String(item[searchKey]).toLowerCase().indexOf(query.toLowerCase());
        if (item.atwho_order > -1) {
          _results.push(item);
        }
      }else{
        var isShow  = false;
        for(var j= 0,len1=searchKeyArr.length;j<len1;j++){
          if (!isShow && ~new String(item[searchKeyArr[j]]).toLowerCase().indexOf(query.toLowerCase())) {
            isShow=true;
            
            item.atwho_order = new String(item[searchKeyArr[j]]).toLowerCase().indexOf(query.toLowerCase())
            					+ (10 * j)
            					+ 20 * (item[density].indexOf('img')>-1? 0:1);
          }
        }
        if(isShow&&item.atwho_order>-1){
          _results.push(item);
        }
      }

      /*  if (~new String(item[searchKey]).toLowerCase().indexOf(query.toLowerCase())) {
       _results.push(item);
       }*/
    }
    /*for (i = 0, len = items.length; i < len; i++) {
      item = items[i];
      item.atwho_order = new String(item[searchKey]).toLowerCase().indexOf(query.toLowerCase());
      if (item.atwho_order > -1) {
        _results.push(item);
      }
    }*/
    return _results.sort(function(a, b) {
      return a.atwho_order - b.atwho_order;
    });
  },
  tplEval: function(tpl, map) {
    var error, template;
    template = tpl;
    try {
      if (typeof tpl !== 'string') {
        template = tpl(map);
      }
      return template.replace(/\$\{([^\}]*)\}/g, function(tag, key, pos) {
        return map[key];
      });
    } catch (_error) {
      error = _error;
      return "";
    }
  },
  highlighter: function(li, query) {
    var regexp;
    if (!query) {
      return li;
    }
    regexp = new RegExp(">\\s*(\\w*?)(" + query.replace("+", "\\+") + ")(\\w*)\\s*<", 'ig');
    return li.replace(regexp, function(str, $1, $2, $3) {
      return '> ' + $1 + '<strong>' + $2 + '</strong>' + $3 + ' <';
    });
  },
  beforeInsert: function(value, $li) {
    return value;
  },
  beforeReposition: function(offset) {
    return offset;
  },
  afterMatchFailed: function(at, el) {}
};

Api = {
  load: function(at, data) {
    var c;
    if (c = this.controller(at)) {
      return c.model.load(data);
    }
  },
  isSelecting: function() {
    var ref;
    return !!((ref = this.controller()) != null ? ref.view.visible() : void 0);
  },
  hide: function() {
    var ref;
    return (ref = this.controller()) != null ? ref.view.hide() : void 0;
  },
  reposition: function() {
    var c;
    if (c = this.controller()) {
      return c.view.reposition(c.rect());
    }
  },
  setIframe: function(iframe, asRoot) {
    this.setupRootElement(iframe, asRoot);
    return null;
  },
  run: function() {
    return this.dispatch();
  },
  destroy: function() {
    this.shutdown();
    return this.$inputor.data('atwho', null);
  }
};

$.fn.atwho = function(method) {
  var _args, result;
  _args = arguments;
  result = null;
  this.filter('textarea, input, [contenteditable=""], [contenteditable=true]').each(function() {
    var $this, app;
    if (!(app = ($this = $(this)).data("atwho"))) {
      $this.data('atwho', (app = new App(this)));
    }
    if (typeof method === 'object' || !method) {
      return app.reg(method.at, method);
    } else if (Api[method] && app) {
      return result = Api[method].apply(app, Array.prototype.slice.call(_args, 1));
    } else {
      return $.error("Method " + method + "does not exist on jQuery.atwho");
    }
  });
  if (result != null) {
    return result;
  } else {
    return this;
  }
};

$.fn.atwho["default"] = {
  at: void 0,
  alias: void 0,
  data: null,
  displayTpl: "<li>${name}</li>",
  insertTpl: "${atwho-at}${name}",
  callbacks: DEFAULT_CALLBACKS,
  searchKey: "name",
  suffix: void 0,
  hideWithoutSuffix: false,
  startWithSpace: false,
  highlightFirst: true,
  limit: 5,
  maxLen: 20,
  minLen: 0,
  displayTimeout: 300,
  delay: null,
  spaceSelectsMatch: false,
  tabSelectsMatch: true,
  editableAtwhoQueryAttrs: {},
  scrollDuration: 150,
  suspendOnComposing: false,
  lookUpOnClick: true,
  density:'photo'
};

$.fn.atwho.debug = false;


}));

/*!common/components/resumepreview/page.js*/
;define('common/components/resumepreview/page', ['require', 'exports', 'module'], function(require, exports, module) {

  function Page(resumeId, index, width) {
      this.resumeId = resumeId;
      this.index = index;
      this.width = width;
  
      this.$page = $('<div style="width: ' + width + 'px" class="preview-page" data-index="' + index + '"><div class="graph-layer"></div><div class="text-layer"></div><div class="annotation-layer"></div></div>');
  
      this.$graphContent = undefined;
      this.graphType = undefined;
      this.graphTypeState = 0;    // 0 null; 1 dom ready; 2 ok; 3 error
  
      this.$printGraphContent = undefined;
  
      this.pdfPage = undefined;
      this.scale = 1;
      this.pdfWidth = 595;    // PDF默认宽度
      this.pdfPrintWidth = 1250;  // 打印时使用的PDF宽度
  }
  
  Page.prototype.bind = function () {
      this.$page.bind.apply(this.$page, arguments);
  }
  
  Page.prototype.trigger = function () {
      this.$page.trigger.apply(this.$page, arguments);
  }
  
  Page.prototype.setGraphContent = function ($graphContent, graphType) {
      var self = this;
      self.$graphContent = $graphContent;
      self.graphType = graphType;
      if (graphType === 'img') {
          self.graphTypeState = 1;
          self.$page.find('.graph-layer').append($graphContent);
          $graphContent.on('load', function () {
              self.graphTypeState = 2;
              self.trigger('graphLayerLoad', [self.index, self.graphType]);
          });
  
          $graphContent.on('error', function () {
              self.graphTypeState = 3;
              self.trigger('graphLayerError', [self.index, self.graphType]);
          });
      } else if (graphType === 'canvas') {
          self.$page.find('.graph-layer').append($graphContent);
          self.graphTypeState = 2;
          self.trigger('graphLayerLoad', [self.index, self.graphType]);
      } else if (graphType === 'doc') {
          self.$page.find('.graph-layer').append($graphContent);
          self.graphTypeState = 2;
          self.trigger('graphLayerLoad', [self.index, self.graphType]);
      }
  }
  
  Page.prototype.getGraphContent = function () {
      return this.$graphContent;
  }
  
  Page.prototype.setPDFPage = function (pdfPage, pdfWidth, scale) {
      var self = this;
      self.pdfPage = pdfPage;
      self.scale = scale;
      self.pdfWidth = pdfWidth;
  
      // 链接层
      var promise = _extractAnnotation(pdfPage);
      promise.then(function (links) {
          var links = links || [];
          var $annotationLayer = self.$page.find('.annotation-layer');
          var html = '';
          for (var i = 0; i < links.length; i++) {
              var link = links[i];
              var rect = link.rect;
              var left = rect[0] * scale;
              var bottom = rect[1] * scale;
              var w = (rect[2] - rect[0]) * scale;
              var h = (rect[3] - rect[1]) * scale;
              html += '<a target="_blank" title="' + link.url + '" style="left:' + left + 'px; bottom:' + bottom + 'px; width:' + w + 'px; height:' + h + 'px;" href= "' + link.url + '"></a>';
          }
          $annotationLayer.append(html);
      });
  
      // 文本层
      var promise = _extractText(pdfPage, scale);
      promise.then(function (result) {
          var texts = result.texts;
          var $textLayer = self.$page.find('.text-layer');
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          var lastFontSize = null;
          var lastFontFamily = null;
  
          var html = '';
          for (var i = 0; i < texts.length; i++) {
              var text = texts[i];
              var textContent = text.content;
  
              // 过滤无用字符
              textContent = textContent.replace(/■/g, function () {
                  return ''
              });
              if (textContent.length === 0) {
                  continue;
              }
  
              var fontSize = text.fontSize + 'px';
              var fontFamily = text.fontFamily;
              var left = text.left;
              var scaleX = scale;
              if (fontSize !== lastFontSize || fontFamily !== lastFontFamily) {
                  ctx.font = fontSize + ' ' + fontFamily;
                  var canvasWidth = ctx.measureText(textContent).width;
                  scaleX = scale * text.width / canvasWidth;
              }
              html += '<div style="height: ' + text.height + 'px; left: ' + left + 'px; top:' + text.top + 'px; font-size: ' + fontSize + '; font-family: ' + fontFamily + '; transform: scaleX(' + scaleX + ');">' + textContent + '</div>';
          }
          $textLayer.append(html);
      });
  }
  
  Page.prototype.getPrintPage = function () {
      if (this.$printGraphContent !== undefined) {
          return this.$printGraphContent;
      }
      if (this.graphType === 'img') {
          this.$printGraphContent = this.$graphContent.clone();
          this.$printGraphContent.css('width', '100%');
      }
      else if (this.graphType === 'doc') {
          this.$printGraphContent = $( this.$graphContent );
      }
      else {
          var page = this.pdfPage;
          var scale = this.pdfPrintWidth / this.pdfWidth;
          var viewport = page.getViewport(scale);
          var canvas = document.createElement("canvas");
          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          var renderContext = {
              canvasContext: context,
              viewport: viewport
          };
          page.render(renderContext);
          this.$printGraphContent = $(canvas);
      }
      return this.$printGraphContent;
  }
  
  function _extractAnnotation(pdfPage) {
      return new Promise(function (resolve) {
          var links = [];
          pdfPage.getAnnotations().then(function (annotations) {
              var annotations = annotations || [];
              for (var i = 0; i < annotations.length; i++) {
                  var annotation = annotations[i];
                  if (annotation.subtype !== 'Link') {
                      continue;
                  }
                  var link = {
                      url: annotation.url,
                      rect: annotation.rect
                  };
                  links.push(link);
              }
              resolve(links);
          });
      });
  }
  
  function _extractText(page, scale) {
      return new Promise(function (resolve) {
          var result = {};
          var viewport = page.getViewport(scale);
          result.rotation = viewport.rotation;
  
          page.getTextContent().then(function (textContent) {
              var styles = textContent.styles || [];
              var texts = [];
  
              var items = textContent.items || [];
              for (var i = 0; i < items.length; i++) {
                  var item = items[i];
  
                  // filter
                  var content = item.str;
                  if (!/\S/.test(content)) {
                      continue;
                  }
  
                  var text = {};
  
                  var tx = PDFJS.Util.transform(
                      PDFJS.Util.transform(viewport.transform, item.transform),
                      [1, 0, 0, -1, 0, 0]);
                  var style = styles[item.fontName];
  
                  // angle
                  var angle = Math.atan2(tx[1], tx[0]);
                  if (style.vertical) {
                      angle += Math.PI / 2;
                  }
                  // font height
                  var fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
                  var fontAscent = fontHeight;
                  if (style.ascent) {
                      fontAscent = style.ascent * fontAscent;
                  } else if (style.descent) {
                      fontAscent = (1 + style.descent) * fontAscent;
                  }
  
                  // left and top
                  var left;
                  var top;
                  if (angle === 0) {
                      left = tx[4];
                      top = tx[5] - fontAscent;
                  } else {
                      left = tx[4] + (fontAscent * Math.sin(angle));
                      top = tx[5] - (fontAscent * Math.cos(angle));
                  }
  
                  text.left = left;
                  text.top = top;
                  text.fontSize = fontHeight;
                  text.fontFamily = style.fontFamily;
                  text.content = item.str;
                  text.width = item.width;
                  text.height = item.height;
                  texts.push(text);
              }
              result.texts = texts;
              resolve(result);
          });
      });
  }
  
  module.exports = Page;

});
/*!common/components/resumepreview/doc.js*/
;define('common/components/resumepreview/doc', ['require', 'exports', 'module', 'common/components/resumepreview/page', "dep/artTemplate/dist/template"], function(require, exports, module) {

  var Page = require('common/components/resumepreview/page');
  
  function Doc(resumeId, type, width, pageCount, itemData) {
      this.resumeId = resumeId;
      this.type = type;
      this.pageCount = pageCount || 0;
      this.width = width || 1241;
  
      this.autoShow = true;   // 自动渲染
  
      this.pdfUri = undefined;
      this.downloadUri = undefined;
      this.imageUri = undefined;
      this.loadImagePages = 0;    // 当预览方式为图片的时候，已经加载的页面的数量
      this.firstLoadImagePageNum = 5; // 当预览方式为图片的时候，首次加载的页数
  
      this.$doc = $('<div data-resume-id = "' + this.resumeId + '" class="' + this.type + ' preview-doc"></div>');
      this.$loadRestPageButton = $('<div class="preview-loadrest"></div>');
      this.$print = $('<div data-resume-id = "' + this.resumeId + '" class="' + ( this.type == "ONLINE_RESUME" ? 'online-resume-print' : 'preview-print' ) + '"></div>');
      this.printLock = false;
      this.mountState = false;    //false unmonut, true mount
  
      this.pages = [];
      this.load = false;
      this.restLoad = true;
  
      this.graphType = undefined;
      this.textAndLinkState = 0;    // null start done
      this.itemData = itemData ? itemData : window.itemData;
  
      _init.call(this);   // 初始化
  }
  
  Doc.prototype.mount = function (selector) {
      if (this.mountState === true) {
          return;
      }
      var $parent = $(selector);
      if ($parent.length > 0) {
          this.mountState = true;
          $parent.append(this.$doc);
      }
  }
  
  Doc.prototype.unmount = function () {
      if (this.mountState === false) return;
      this.mountState = false;
      this.$doc.detach();
  }
  
  Doc.prototype.bind = function () {
      this.$doc.bind.apply(this.$doc, arguments);
  }
  
  Doc.prototype.trigger = function () {
      this.$doc.trigger.apply(this.$doc, arguments);
  }
  
  /**
   * 打印
   */
  Doc.prototype.print = function () {
      // check and lock
      if (this.printLock === true) return;
      if (this.restLoad === false) {
          _loadRestPages.call(this);
      }
      this.printLock = true;
      var self = this;
      $(document.body).append(self.$print);
      for (var i = 1; i <= self.pageCount; i++) {
          self.$print.append(self.pages[i].getPrintPage());
      }
      window.setTimeout(function () {
          window.print();
          self.printLock = false;
          self.$print.remove();
      }, 1000);
  }
  
  /**
   * 下载简历
   */
  Doc.prototype.download = function () {
      window.location.href = this.downloadUri;
  }
  
  /**
   * 加载文本和链接
   */
  Doc.prototype.renderTextAndLink = function () {
      var self = this;
      if (self.textAndLinkState > 0) return;
      self.textAndLinkState = 1;
      require(['common/static/pdfjs/pdf'], function () {
          PDFJS.workerSrc = _getPDFJSWorkerSrc();
          PDFJS.cMapUrl = _getCMapUrl();
          PDFJS.cMapPacked = true;
          PDFJS.getDocument(self.pdfUri).then(function (pdfDoc) {
              for (var i = 0; i < self.pageCount; i++) {
                  (function (index) {
                      pdfDoc.getPage(index).then(function (page) {
                          var originWidth = page.getViewport(1).width;    // PDF 文档原始宽度
                          var scale = self.width / originWidth;
                          self.pages[index].setPDFPage(page, originWidth, scale);
                      });
                  })(i + 1);
              }
          });
      });
  }
  
  /**
   * 对 ResumePreview 进行初始化
   * @private
   */
  function _init() {
      var type = this.type;
      if (type === 'PDF') {
          this.pdfUri = '../resume/' + this.resumeId + '.pdfa';
          this.downloadUri = "/resume/download.htm?resumeId=" + this.resumeId;
          this.graphType = 'canvas';
          _initPDFPreview.call(this);
      } else if (type === 'IMAGE') {
          this.imageUri = '../resume/' + this.resumeId + '/page_image_INDEX.pnga';
          this.downloadUri = "/resume/download.htm?resumeId=" + this.resumeId;
          this.pdfUri = '../resume/' + this.resumeId + '.pdfa';
          this.graphType = 'img';
          _initImagePreview.call(this);
      } else if ( type === 'ONLINE_RESUME' ) {
  
          // 在线简历
          this.downloadUri = "/resume/download.htm?resumeId=" + this.resumeId;
          this.graphType = 'doc';
           _initOnlinePreview.call(this);
      } else if ( type == 'PUB_ONLINE_RESUME') {
  
          // 在线简历
          this.downloadUri = "/resume/download.htm?resumeId=" + this.resumeId;
          this.graphType = 'doc';
           _initOnlinePreview.call(this);
      }
      else if (type === 'PUB_PDF') {
          this.pdfUri = '../pub/resume/' + this.resumeId + '.pdfa';
          this.downloadUri = "/pub/resume/download.htm?pubCode=" + this.resumeId;
          this.graphType = 'canvas';
          _initPDFPreview.call(this);
      } else if (type === 'PUB_IMAGE') {
          this.imageUri = '../pub/resume/' + this.resumeId + '/page_image_INDEX.pnga';
          this.downloadUri = "/pub/resume/download.htm?pubCode=" + this.resumeId;
          this.pdfUri = '../pub/resume/' + this.resumeId + '.pdfa';
          this.graphType = 'img';
          _initImagePreview.call(this);
      } else {
          console.error("unsupported resume preview type.", this.resumePreviewType)
      }
  }
  
  /**
   * 当具体页码确定后执行
   * @private
   */
  function _onPageCountConfirm() {
      var self = this;
      for (var i = 1; i <= this.pageCount; i++) {
          var page = self.pages[i] = new Page(self.resumeId, i, self.width);
          self.$doc.append(page.$page);
      }
      for (var i = 1; i <= this.pageCount; i++) {
          var page = self.pages[i];
          page.bind('graphLayerError', function (event, index, graphType) {
              _onPageLoad.call(self, index, false);
          });
          page.bind('graphLayerLoad', function (event, index, graphType) {
              _onPageLoad.call(self, index, true);
          });
      }
  }
  
  function _onPageLoad(index, status) {
      var count = 0;
      if (this.pageCount > this.firstLoadImagePageNum) {
          // 分为两次加载
          var firstLoadCount = 0;
          for (var i = 1; i <= this.pageCount; i++) {
              var page = this.pages[i];
              if (index <= this.firstLoadImagePageNum && i <= this.firstLoadImagePageNum) {
                  // 判断第一次加载的的 firstLoadImagePageNum 页是否加载完毕
                  if (page.graphTypeState >= 2) {
                      firstLoadCount++;
                  }
              }
              if (page.graphTypeState >= 2) {
                  count++;
              }
          }
          if (firstLoadCount === this.firstLoadImagePageNum) {
              // 首次加载的页面加载完毕
              this.trigger('load');
          }
      } else {
          // 没有分为两次加载，直接判断是否全部页面加载完毕
          for (var i = 1; i <= this.pageCount; i++) {
              var page = this.pages[i];
              if (page.graphTypeState >= 2) {
                  count++;
              }
          }
      }
      if (count === this.pageCount) {
          this.load = true;
          this.trigger('load');
      }
  }
  
  /**
   * 加载剩余的页面
   */
  function _loadRestPages() {
      if (this.restLoad === true) {
          return;
      } else {
          this.restLoad = true;
      }
      var self = this;
      self.$loadRestPageButton.remove();
      if (self.type !== 'IMAGE' && self.type !== 'PUB_IMAGE') {
          return;
      }
      if (self.pageCount > self.loadImagePages) {
          for (var i = self.loadImagePages + 1; i <= self.pageCount; i++) {
              (function (index) {
                  var imageUri = self.imageUri.replace('INDEX', (index - 1));
                  var $img = $('<img src="' + imageUri + '" />');
                  $img.css('width', self.width);
                  self.pages[index].setGraphContent($img, 'img');
              })(i);
          }
      }
  }
  
  function _initImagePreview() {
      var self = this;
      var $loadRestPageButton = self.$loadRestPageButton;
      var firstLoadImagePageNum = self.firstLoadImagePageNum;
  
      _onPageCountConfirm.call(self);    // 确定页码
  
      if (self.pageCount > firstLoadImagePageNum) {
          self.loadImagePages = firstLoadImagePageNum;
          $loadRestPageButton.text('加载剩余' + (self.pageCount - firstLoadImagePageNum) + '页');
          self.restLoad = false;
      } else {
          self.loadImagePages = self.pageCount
      }
      for (var i = 1; i <= self.loadImagePages; i++) {
          (function (index) {
              var imageUri = self.imageUri.replace('INDEX', (index - 1));
              var $img = $('<img src="' + imageUri + '" />');
              $img.css('width', self.width);
              self.pages[index].setGraphContent($img, 'img');
          })(i);
      }
      $loadRestPageButton.on('click', function () {
          _loadRestPages.call(self);
      });
      self.$doc.append($loadRestPageButton);
  }
  
  function _initPDFPreview() {
      var self = this;
      self.textAndLinkState = 1;
      require(['common/static/pdfjs/pdf'], function () {
          PDFJS.workerSrc = _getPDFJSWorkerSrc();
          PDFJS.cMapUrl = _getCMapUrl();
          PDFJS.cMapPacked = true;
          PDFJS.getDocument(self.pdfUri).then(function (pdfDoc) {
              self.pdfDoc = pdfDoc;
              var pageCount = self.pageCount = pdfDoc.pdfInfo.numPages;
              _onPageCountConfirm.call(self);    // 确定页码
              for (var i = 0; i < pageCount; i++) {
                  (function (index) {
                      pdfDoc.getPage(index).then(function (page) {
                          var originWidth = page.getViewport(1).width;    // PDF 文档原始宽度
                          var scale = self.width / originWidth;
                          var viewport = page.getViewport(scale);
                          var canvas = document.createElement("canvas");
                          var context = canvas.getContext('2d');
                          canvas.height = viewport.height;
                          canvas.width = viewport.width;
                          var renderContext = {
                              canvasContext: context,
                              viewport: viewport
                          };
                          page.render(renderContext);
                          var $canvas = $(canvas);
                          self.pages[index].setGraphContent($canvas, 'canvas');
                          self.pages[index].setPDFPage(page, originWidth, scale);
                      });
                  })(i + 1);
              }
          }, function (err) {
              console.error(err);
          });
      });
  }
  
  function _initOnlinePreview() {
      var self = this;
      self.textAndLinkState = 1;
      var template = require("dep/artTemplate/dist/template");
      var tpl = "<div class=\"mr_created mr_preview\">\n    <div class=\"mr_myresume_l mrcenter\">\n        <div id=\"mr_mr_head\">\n            <div class=\"resume-position-header mr_w604\">\n            <div class=\"lagou-logo\"><i class=\"icon-logo3\"></i></div>\n\n            <div class=\"mr_baseinfo\">\n               <!--  <div class=\"mr_p_name mr_w604 clearfixs\">\n                    <span class=\"mr_name\">{{data.resumeVo.name}}</span>\n                </div> -->\n                <div class=\"mr_p_info mr_infoed mr_w604 clearfixs\">     \n                    <div class=\"info_t\">\n                        <span class=\"mr_name\">{{data.resumeVo.name}}</span>\n                        {{if data.resumeVo.oneWord}}\n                        <div class=\"mr_p_introduce mr_w604 clearfixs\">\n                            <span class=\"mr_intro\">{{data.resumeVo.oneWord}}</span>\n                        </div>\n                        {{/if}}\n\n                    \t{{if data.resumeVo.userIdentity == 0}}\n                    \t\t{{if data.resumeVo.workYear == '应届毕业生'}}\n                    \t\t\t{{if data.resumeVo.latestEducationExperience && data.resumeVo.latestEducationExperience.professional}}\n                                <span  class=\"shenfen\">\n                                    <i class=\"icon-briefcase\"></i>\n                                    <em data-id=\"0\" title=\"{{data.resumeVo.latestEducationExperience.professional}} · {{data.resumeVo.latestEducationExperience.schoolName}}\">{{data.resumeVo.latestEducationExperience.professional}} · {{data.resumeVo.latestEducationExperience.schoolName}}</em>\n                                </span>\n                                {{else if data.resumeVo.latestEducationExperience && data.resumeVo.latestEducationExperience.positionName}}\n                                <span class=\"shenfen\">\n                                    <i class=\"icon-briefcase\"></i>\n                                    <em data-id=\"0\" title=\"{{data.resumeVo.latestEducationExperience.positionName}} · {{data.resumeVo.latestEducationExperience.companyName}}\">{{data.resumeVo.latestEducationExperience.positionName}} · {{data.resumeVo.latestEducationExperience.companyName}}</em>\n                                </span>\n                                {{/if}}\n                            {{else}}\n                            \t{{if data.resumeVo.latestWorkExperience && data.resumeVo.latestWorkExperience.positionName}}\n                                <span class=\"shenfen\">\n                                    <i class=\"icon-briefcase\"></i>\n                                    <em data-id=\"0\" title=\"{{data.resumeVo.latestWorkExperience.positionName}} · {{data.resumeVo.latestWorkExperience.companyName}}\">{{data.resumeVo.latestWorkExperience.positionName}} · {{data.resumeVo.latestWorkExperience.companyName}}</em>\n                                </span>\n                                {{else if data.resumeVo.latestEducationExperience && data.resumeVo.latestEducationExperience.professional}}\n                                <span class=\"shenfen\">\n                                    <i class=\"icon-briefcase\"></i>\n                                    <em data-id=\"0\" title=\"{{data.resumeVo.latestEducationExperience.professional}} · {{data.resumeVo.latestEducationExperience.schoolName}}\">{{data.resumeVo.latestEducationExperience.professional}} · {{data.resumeVo.latestEducationExperience.schoolName}}</em>\n                                </span>\n                                {{/if}}                             \n                            {{/if}}\n                        {{else if data.resumeVo.userIdentity == 1}}\n                        \t{{if data.resumeVo.latestEducationExperience && data.resumeVo.latestEducationExperience.professional}}\n                            <span class=\"shenfen\">\n                                <i class=\"icon-briefcase\"></i>\n                                <em data-id=\"1\" title=\"{{data.resumeVo.latestEducationExperience.professional}} · {{data.resumeVo.latestEducationExperience.schoolName}}\">{{data.resumeVo.latestEducationExperience.professional}} · {{data.resumeVo.latestEducationExperience.schoolName}}</em>\n                            </span> \n                            {{else if data.resumeVo.latestWorkExperience && data.resumeVo.latestWorkExperience.positionName}}\n                            <span class=\"shenfen\">\n                                <i class=\"icon-briefcase\"></i>\n                                <em data-id=\"2\" title=\"{{data.resumeVo.latestWorkExperience.positionName}} · {{data.resumeVo.latestWorkExperience.companyName}}\">{{data.resumeVo.latestWorkExperience.positionName}} · {{data.resumeVo.latestWorkExperience.companyName}}</em>\n                            </span>\n                            {{/if}}\n                        {{else if data.resumeVo.userIdentity == 2}}\n                        \t{{if data.resumeVo.latestWorkExperience && data.resumeVo.latestWorkExperience.positionName}}                    \n                            <span class=\"shenfen\">\n                                <i class=\"icon-briefcase\"></i>\n                                <em data-id=\"2\" title=\"{{data.resumeVo.latestWorkExperience.positionName}} · {{data.resumeVo.latestWorkExperience.companyName}}\">{{data.resumeVo.latestWorkExperience.positionName}} · {{data.resumeVo.latestWorkExperience.companyName}}</em>\n                            </span>\n                            {{else if data.resumeVo.latestEducationExperience && data.resumeVo.latestEducationExperience.professional}}\n                            <span class=\"shenfen\">\n                                <i class=\"icon-briefcase\"></i>\n                                <em data-id=\"1\" title=\"{{data.resumeVo.latestEducationExperience.professional}} · {{data.resumeVo.latestEducationExperience.schoolName}}\">{{data.resumeVo.latestEducationExperience.professional}} · {{data.resumeVo.latestEducationExperience.schoolName}}</em>\n                            </span>                                 \n                            {{/if}}\n                        {{/if}}\n                    </div>\n                </div>\n                {{if data.resumeVo.email || data.resumeVo.phone}}\n                    <div class=\"info_b mr_w604\">\n                        {{if data.resumeVo.phone}}\n                            <span class=\"mobile\"><i class=\"icon-phone\"></i><em>{{data.resumeVo.phone}}</em></span>\n                        {{/if}}\n                        {{if data.resumeVo.email}}\n                            <span class=\"email\"><i class=\"icon-email\"></i><em>{{data.resumeVo.email}}</em></span>\n                        {{/if}}\n                    </div>\n                {{/if}}\n\n                    \n            </div>\n        </div>  \n        <div class=\"mr_content\">\n            <div class=\"mr_w604\">\n            \t{{if data.resumeVo.workExperiences.length > 0}}\n                <div id=\"workExperience\">\n                    <div>\n                        <div class=\"mr_moudle_head clearfixs\">\n                            <div class=\"mr_head_l\">\n                                <div class=\"mr_title\">\n                                    <span class=\"mr_title_l\"></span><span class=\"mr_title_c\">{{if data.resumeVo.workYear == '应届毕业生'}} 实习经历  {{else}} 工作经历 {{/if}}</span><span class=\"mr_title_r\"></span>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"mr_moudle_content\">\n                            <div class=\"list_show\">\n                            \t{{each data.resumeVo.workExperiences as work index}}\n                                <div class=\"mr_jobe_list\">\n\t                                <div class=\"clearfixs\">\n\t                                    <div class=\"mr_content_l\">\n\t                                        {{if work.companyLogo != undefined && work.companyLogo != ''}}\n\t                                        <div class=\"l1\">\n\t                                            <img src=\"{{(function(){return /https?:\\/\\//.test(work.companyLogo) ? work.companyLogo : '../../https@/' +  __cdndomain + '/' +\n                                            work.companyLogo})()}}\" alt=\"{{work.companyLogo}}\" />\n\t                                        </div>\n\t                                        {{/if}}\n\t                                        <div class=\"l2\">\n\t                                            <h4>{{work.companyName}}</h4>\n\t                                            <span>{{work.positionName}}</span>\n\t                                        </div>\n\t                                    </div>\n\t                                    <div class=\"mr_content_r\">\n\t                                        <span>{{work.startDate}} — {{work.endDate}}</span>\n\t                                    </div>                          \n\t                                </div>\n\t                                {{if work.workContent}}\n\t                                <div class=\"mr_content_m\">\n\t                                \t{{#work.workContent}}\n\t                                </div>\n\t                                {{/if}}\n                                </div>  \n                                {{/each}}\n                            </div>\n                        </div>                      \n                    </div>\n                </div>\n                {{/if}}\n                \n                {{if data.resumeVo.educationExperiences.length > 0}}\n                <div id=\"educationalBackground\">\n                    <div>\n                        <div class=\"mr_moudle_head clearfixs\">\n                            <div class=\"mr_head_l\">\n                                <div class=\"mr_title\">\n                                    <span class=\"mr_title_l\"></span><span class=\"mr_title_c\">教育经历</span><span class=\"mr_title_r\"></span>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"mr_moudle_content\">\n                        \t{{each data.resumeVo.educationExperiences as education index}}\n                            <div class=\"clearfixs mb46 mr_jobe_list\">\n                                <div class=\"mr_content_l clearfix\">\n                                    {{if education.schoolBadge != undefined && education.schoolBadge != ''}}\n                                    <div class=\"l1\">\n                                        <img src=\"//{{__cdndomain}}/{{education.schoolBadge}}\" alt=\"{{education.schoolBadge}}\" />\n                                    </div>\n                                    {{/if}}\n                                    <div class=\"l2\">\n                                        <h4>{{education.schoolName}}</h4>\n                                        <span>{{education.education}} · {{education.professional}}</span>\n                                    </div>\n                                </div>\n                                <div class=\"mr_content_r\">\n                                    {{if education.whetherGraduate}}\n                                    <span>{{education.endDate}}年毕业</span>\n                                    {{else}}\n                                    <span>{{education.endDate}}年毕业（预计）</span>\n                                    {{/if}}\n                                </div>                          \n                            </div>\n                            {{/each}}\n                        </div>                      \n                    </div>\n                </div>\n                {{/if}}\n                \n                {{if data.resumeVo.projectExperiences.length > 0}}\n                <div id=\"projectExperience\">\n                    <div>\n                        <div class=\"mr_moudle_head clearfixs\">\n                            <div class=\"mr_head_l\">\n                                <div class=\"mr_title\">\n                                    <span class=\"mr_title_l\"></span><span class=\"mr_title_c\">项目经验</span><span class=\"mr_title_r\"></span>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"mr_moudle_content mr_w604\">\n                            <div class=\"list_show\">\n                            \t{{each data.resumeVo.projectExperiences as item index}}\n                                <div class=\"mr_jobe_list\" data-id=\"$!item.id\" >             \n                                    <div class=\"clearfixs\">\n                                        <div class=\"mr_content_l\">\n                                            <div class=\"l2\">\n                                                {{if item.projectUrl}}\n                                                <a class=\"projectTitle\"  target=\"_blank\" href=\"{{item.projectUrl}}\"><span></span>{{item.projectName}}</a>\n                                                {{else}}\n                                                <a class=\"projectTitle nourl\">{{item.projectName}}</a>\n                                                {{/if}}\n                                                <p>{{item.positionName}}</p>\n                                            </div>\n                                        </div>\n                                        <div class=\"mr_content_r\">\n                                            <span>{{item.startDate}} - {{item.endDate}}</span>\n                                        </div>                          \n                                    </div>\n                                    <div class=\"mr_content_m ueditor_unparse\">\n                                        {{#item.projectRemark}}\n                                    </div>  \n                                </div>\n                                {{/each}}\n                        \t</div>\n                        </div>                      \n                    </div>\n                </div>\n                {{/if}}\n\n                {{if data.resumeVo.workShows.length > 0}}\n                <div id=\"worksShow\">\n                    <div>\n                        <div class=\"mr_moudle_head clearfixs\">\n                            <div class=\"mr_head_l\">\n                                <div class=\"mr_title\">\n                                    <span class=\"mr_title_l\"></span><span class=\"mr_title_c\">作品展示</span><span class=\"mr_title_r\"></span>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"mr_moudle_content\">\n                        \t{{each data.resumeVo.workShows as work index}}\n                            \t{{if work.url}}\n\t                            <div class=\"mr_work_online\">\n\t                                <div class=\"mr_wo_show\">\n\t                                    <div>\n\t                                        <div class=\"mr_c_r_t\">\n\t                                            &nbsp;\n\t                                        </div>  \n\t                                    </div>         \n\t                                    <div class=\"mr_self_site\">\n\t                                        <a class=\"mr_self_sitelink\" href=\"{{(function(){return /https?:\\/\\//.test(work.url) ? work.url : 'http://'+work.url})()}}\" target=\"_blank\">{{work.url}}</a>\n\t                                    </div>\n\t                                    <div class=\"mr_wo_preview\">\n\t                                        {{#work.workName}}\n\t                                    </div>\n\t                                </div>                                                              \n\t                            </div>\n\t                            {{/if}}\n\t                        {{/each}}\n                            \n                            {{each data.resumeVo.workShows as work index}}\n                            \t{{if work.imageUrl}}\n\t                            <div class=\"mr_work_upload\">\n\t                                <div class=\"mr_wu_show\"> \n\t                                    <div class=\"mr_wu_t\">\n\t                                        <a href=\"//{{__cdndomain}}/{{work.imageUrl}}\" target=\"_blank\">\n\t                                            <img class=\"wh43\" src=\"//{{__cdndomain}}/{{work.cutImageUrl}}\" alt=\"{{work.workTitle}}\" />\n\t                                        </a>\n\t                                    </div>\n\t                                    <div class=\"mr_wu_con\">\n\t                                        {{if work.workTitle}}\n\t                                        <div class=\"clearfixs\">\n\t                                            <div class=\"mr_content_l\">\n\t                                                <div class=\"l2\">\n\t                                                \t{{if work.workTitle}}\n\t                                                    <span style=\"width:610px\">[&nbsp;{{work.workTitle}}&nbsp;]</span>\n\t                                                    {{/if}}\n\t                                                </div>\n\t                                            </div>\n\t                                            \n\t                                        </div>\n\t                                        {{/if}}\n\t                                        <div class=\"mr_wu_con_m\">\n\t                                            {{#work.workDescribe}}\n\t                                        </div>                                          \n\t                                    </div>\n\t                                </div>\n\t                            </div>\n\t                            {{/if}}     \n\t                        {{/each}}\n                        </div>  \n                    </div>\n                </div>\n                {{/if}}  \n\n                {{if data.resumeVo.myRemark}}\n                <div id=\"selfDescription\">\n                    <div>\n                        <div class=\"mr_moudle_head clearfixs\">\n                            <div class=\"mr_head_l\">\n                                <div class=\"mr_title\">\n                                    <span class=\"mr_title_l\"></span><span class=\"mr_title_c\">自我描述</span><span class=\"mr_title_r\"></span>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"mr_moudle_content clearfixs\">\n                            <div class=\"mr_self_l\">\n                                <i></i>\n                                <img src=\"//{{__cdndomain}}/{{data.resumeVo.headPic}}\" alt=\"{{data.resumeVo.name}}\" />\n                            </div>  \n                            <div class=\"mr_self_r\">\n                                {{#data.resumeVo.myRemark}}                                 \n                            </div>                                                      \n                        </div>                      \n                    </div>\n                </div>  \n                {{/if}}\n                {{if data.resumeVo.expectJob}}  \n                <div id=\"expectJob\" {{if data.resumeVo.expectJob.length > 0}} class=\"dn item_container_target\" {{else}} class=\"item_container_target\" {{/if}}>\n\t                <div>\n\t                    <div class=\"mr_moudle_head clearfixs mr_w604\">\n\t                        <div class=\"mr_head_l\">\n\t                            <div class=\"mr_title\">\n\t                                <span class=\"mr_title_l\"></span><span class=\"mr_title_c\">期望工作</span><span class=\"mr_title_r\"></span>\n\t                            </div>\n\t                        </div>\n\t                    </div>\n\t                    <div class=\"mr_moudle_content clearfixs mr_w604\">\n\t                        <div class=\"expectjob_list{{if data.resumeVo.expectJob.positionName == ''}} dn{{/if}}\">\n\t                            <input id=\"expHideId\" type=\"hidden\" value=\"{{data.resumeVo.expectJob.id}}\" />\n\t                            <div class=\"mr_job_info\" data-id=\"{{data.resumeVo.expectJob.id}}\">\n\t                                <ul class=\"clearfixs\">\n\t                                    <li class=\"mr_name_li{{if !data.resumeVo.expectJob.positionName}} dn{{/if}}\"><i class=\"icon-tie\"></i><span class=\"mr_job_name\" title=\"{{data.resumeVo.expectJob.positionName}}\">{{data.resumeVo.expectJob.positionName}}</span></li>\n\t                                    <li class=\"mr_jobtype_li{{if !data.resumeVo.expectJob.positionType}} dn{{/if}}\"><i class=\"icon-time\"></i><span class=\"mr_job_type\" title=\"{{data.resumeVo.expectJob.positionType}}\">{{data.resumeVo.expectJob.positionType}}</span></li>\n\t                                    <li class=\"mr_city_li{{if !data.resumeVo.expectJob.city}} dn{{/if}}\" ><i class=\"icon-location\"></i><span class=\"mr_job_adr\" title=\"{{data.resumeVo.expectJob.city}}\">{{data.resumeVo.expectJob.city}}</span></li>\n\t                                    <li class=\"mr_jobrange_li{{if !data.resumeVo.expectJob.salarys}} dn{{/if}}\"><i class=\"icon-money\"></i><span class=\"mr_job_range\" title=\"{{data.resumeVo.expectJob.salarys}}\">{{data.resumeVo.expectJob.salarys}}</span></li>\n\t                                </ul>\n\t                            </div>\n\t                            {{if data.resumeVo.expectJob.addExplain}}\n\t                            <div class=\"mr_job_des\">\n\t                                <i class=\"icon-left-quotes mr_job_t\"></i>\n\t                                <i class=\"icon-right-quotes mr_job_b\"></i>\n\t                                <div class=\"mr_expjob_content\">\n\t                                \t{{#data.resumeVo.expectJob.addExplain}}\n\t                                </div>  \n\t                            </div>\n\t                            {{/if}}\n\t                        </div>                                      \n\t                    </div>                      \n\t                </div>\n            \t</div>\n                {{/if}}\n                \n                {{if data.resumeVo.skillEvaluates.length > 0}}\n                <div id=\"skillsAssess\">\n                    <div>\n                        <div class=\"mr_moudle_head clearfixs\">\n                            <div class=\"mr_head_l\">\n                                <div class=\"mr_title\">\n                                    <span class=\"mr_title_l\"></span><span class=\"mr_title_c\">技能评价</span><span class=\"mr_title_r\"></span>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"mr_moudle_content\">\n                        \t{{each data.resumeVo.skillEvaluates as skill index}}\n                            <div class=\"mr_skill_con\">\n                                <span class=\"mr_skill_name\" title=\"{{skill.skillName}}\">{{skill.skillName}}</span>\n                                <span class=\"mr_skill_plan\" data-skillLevel = \"{{skill.skillPercent}}\">\n                                    <em style=\"width: {{skill.skillPercent*420/100 + 10}}px;\"></em>\n                                </span>\n                                <span class=\"mr_skill_level\">{{skill.masterLevel}}</span>\n                            </div>\n                            {{/each}} \n                        </div>                      \n                    </div>\n                </div>\n                {{/if}}\n                \n                {{if data.resumeVo.userDefine}}\n                <div id=\"customBlock\">\n                    <div>\n                        <div class=\"mr_moudle_head clearfixs\">\n                            <div class=\"mr_head_l\">\n                                <div class=\"mr_title\">\n                                    <span class=\"mr_line_tl\" id=\"width604\"></span>\n                                    <div class=\"cust_title\">\n                                        <span>{{data.resumeVo.userDefine.titleName}}</span>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"mr_moudle_content olpf\">\n                            {{#data.resumeVo.userDefine.titleContent}}\n                        </div> \n                    </div>\n                </div>                      \n                {{/if}}\n            </div>\n            \n            <div class=\"mr_self_state\">\n            \t{{if data.resumeVo.workYear == \"应届毕业生\" && data.resumeVo.status == \"\"}}\n                <div class=\"form_wrap mr_self_s resume_status\">\n                    ·&nbsp;我是应届毕业生&nbsp;·                                       \n                </div>\n                {{else if data.resumeVo.workYear != \"应届毕业生\" && data.resumeVo.status == ''}}\n                <div class=\"form_wrap mr_self_s resume_status\">\n                    ·&nbsp;我目前已离职，可快速到岗&nbsp;·                                      \n                </div>\n                {{else if data.resumeVo.status != ''}}\n                <div class=\"form_wrap mr_self_s resume_status\">\n                    ·&nbsp;{{data.resumeVo.status}}&nbsp;·                                 \n                </div>\n                {{/if}}\n            </div>\n        </div>  \n    \n        <div class=\"mr_bottom_r\" id=\"mr_pre_bot\">\n            <span>© {{data.resumeVo.name}}  简历更新于{{data.resumeVo.refreshTime}}. Powered by Lagou.com</span>\n        </div>\n    </div>\n</div> ";
      _onPageCountConfirm.call(self);    // 确定页码
      var render = template.compile(tpl);
      // self.itemData.resumeVoo.lgsctx = GLOBAL_DOMAIN.lgsctx;
      var $html = render({
          data: self.itemData.resumeVoo
          // data: this.itemData ? this.itemData.resumeVoo : itemData.resumeVoo
      });
      self.pages[1].setGraphContent($html, 'doc');  // arttemplate填充
  }
  
  
  /**
   * 这是个潜规则
   * @returns {string}
   * @private
   */
  function _getPDFJSWorkerSrc() {
      return '../../https@/' + GLOBAL_CDN_DOMAIN + '/mds/static/common/static/pdfjs/pdf.worker_60cf458.js';
  }
  
  /**
   * 这是个潜规则
   * @returns {string}
   * @private
   */
  function _getCMapUrl() {
      var cmapUrl = '../../https@/' + GLOBAL_CDN_DOMAIN + '/mds/static/common/static/pdfjs/cmaps/Adobe-GB1-UCS2.bcmap';
      return cmapUrl.substring(0, cmapUrl.lastIndexOf('/') + 1);
  }
  
  
  module.exports = Doc;
  

});
/*!common/components/resumepreview/preview.js*/
;define('common/components/resumepreview/preview', ['require', 'exports', 'module', 'common/components/resumepreview/doc'], function(require, exports, module) {

  var Doc = require('common/components/resumepreview/doc');
  
  /**
   *
   * @param selector 选择器
   * @param {String} type - PDF, IMAGE, PUB_PDF, PUB_IMAGE
   * @param resumeId - resumeId 或者 pubCode
   * @param {Number} pageCount
   * @param {Number} width - 默认宽度827
   * @constructor
   */
  function preview(resumeId, type, pageCount, width, selector, itemData) {
      // 创建新的实例
      var doc = new Doc(resumeId, type, width, pageCount, itemData);
      if (selector) {
          doc.mount(selector);
      }
      return doc;
  }
  module.exports = {
      preview: preview
  };

});
/*!piplines/modules/left-list/main.js*/
;/**
 * 邀请新成员弹窗逻辑
 */

define('piplines/modules/left-list/main', ['require', 'exports', 'module', 'common/components/fancyselect/fancyselect', 'dep/Caret.js/dist/jquery.caret', 'dep/At.js/dist/js/jquery.atwho', "dep/artTemplate/dist/template", 'common/components/resumepreview/preview'], function (require, exports, module) {
    require('common/components/fancyselect/fancyselect');
    require('dep/Caret.js/dist/jquery.caret');
    require('dep/At.js/dist/js/jquery.atwho');
    var template = require("dep/artTemplate/dist/template");
    var preview = require('common/components/resumepreview/preview');
    var imgUrl = lg.imgUrl = '../../https@/' + GLOBAL_CDN_DOMAIN + '/mds/static/piplines/modules/common/img/offer-add-key_cac6ae5.png';

    function switchKey(template, reverse) {
        var result = template;
        if (typeof reverse != 'undefined' && reverse) {
            result = html_decode(result);
            result = result.replace(/\[key=candidateName\]/g, '<img src="'+imgUrl+'" alt="候选人姓名" class="candidateName" data-mds-key="true">');
            result = result.replace(/\[key=positionName\]/g, '<img src="'+imgUrl+'" alt="候选人姓名" class="positionName" data-mds-key="true">');
            result = result.replace(/\[key=companyName]/g, '<img src="'+imgUrl+'" alt="候选人姓名" class="companyName" data-mds-key="true">');
            result = result.replace(/\[key=companyShortName]/g, '<img src="'+imgUrl+'" alt="候选人姓名" class="companyShortName" data-mds-key="true">');
            result = result.replace(/\[key=HRName]/g, '<img src="'+imgUrl+'" alt="候选人姓名" class="HRName" data-mds-key="true">');
            result = result.replace(/\[key=HREmail\]/g, '<img src="'+imgUrl+'" alt="候选人姓名" class="HREmail" data-mds-key="true">');
            result = result.replace(/\[key=departmentName\]/g, '<img src="'+imgUrl+'" alt="候选人姓名" class="departmentName" data-mds-key="true">');
        } else {
            result = result.replace(/<img[^<>]*?candidateName[^<>]*?>/g, '[key=candidateName]');
            result = result.replace(/<img[^<>]*?positionName[^<>]*?>/g, '[key=positionName]');
            result = result.replace(/<img[^<>]*?companyName[^<>]*?>/g, '[key=companyName]');
            result = result.replace(/<img[^<>]*?companyShortName[^<>]*?>/g, '[key=companyShortName]');
            result = result.replace(/<img[^<>]*?HRName[^<>]*?>/g, '[key=HRName]');
            result = result.replace(/<img[^<>]*?HREmail[^<>]*?>/g, '[key=HREmail]');
            result = result.replace(/<img[^<>]*?departmentName[^<>]*?>/g, '[key=departmentName]');
            result = html_encode(result);
        }
        return result;
    }
    function html_encode(str){
        str = str.replace(/&/g, '&amp;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/"/g, '&quot;');
        str = str.replace(/'/g, '&#039;');
        return str;
    }
    function html_decode(str){
        str = str.replace(/&amp;/g, '&');
        str = str.replace(/&lt;/g, '<');
        str = str.replace(/&gt;/g, '>');
        str = str.replace(/&quot;/g, '"');
        str = str.replace(/&#039;/g, "'");
        return str;
    }

    // 看板左侧列表滚动条
    $('.tab-content .left-content .content-list').niceScroll({
        'cursorborder': 'none',
        cursorcolor: '#aeb1b3',
        'cursorwidth': '6px',
        'scrollspeed': '6'
    });
    $('.content-list').on('scroll', function (e) {
        var $this = $(this),
            viewH = $(this).height(), // 可见高度
            contentH = $(this).get(0).scrollHeight, // 内容高度
            scrollTop = $(this).scrollTop(); // 滚动高度
        if (scrollTop / (contentH - viewH) >= 0.95) { // 到达底部100px时,加载新内容
            $('.content-list').trigger('resume.loadpage');
        }
    });
    $('.left_position>li').on('click', function (e) {
        if ($(this).children('a').hasClass('active')) {

        } else {
            $(this).siblings('li').children('a').removeClass('active');
            $(this).children('a').addClass('active');
        }
    });

    // 新简历 -- 是否自动切换下一跳
    if (lg.Utils.getLocalStorage('isAutoSwitchNext') != false) {
        lg.Utils.setLocalStorage('isAutoSwitchNext', true);
    }

    /**
     * 解析url
     * lg.get('resumeId')   获取url里面的resumeId
     * lg.get('stage')     获取url里面的stage
     * lg.get('positionId')获取url里面的positionId
     *
     */
    lg.QueryString();

    // 看板右侧黄色tips 切换  -- 保存标签提示,切换阶段简历的提示
    lg.detailTips = {
        random: (Math.random() - 0.5) > 0,
        tipsCookie: [{cookieName: 'pipTips', dom: 'pip_resume_rang_tips'}, {
            cookieName: 'pipBookMarkTips',
            dom: 'pip_resume_add_bookmark_tips'
        }],
        tipsCookieShowList: [],
        randomShowHandler: '',
        getTipsTrue: function () {
            var isShow = false;
            if (lg.detailTips.tipsCookie) {
                for (var i = 0, len = lg.detailTips.tipsCookie.length; i < len; i++) {
                    if (!lg.Utils.getCookie(lg.detailTips.tipsCookie[i].cookieName)) {
                        isShow = true;
                        lg.detailTips.tipsCookieShowList.push(lg.detailTips.tipsCookie[i]);
                    }
                }
            }
            if (lg.detailTips.tipsCookieShowList.length > 0) {
                if (typeof lg.detailTips.randomShowHandler == 'string') {
                    lg.detailTips.randomShowHandler = Math.floor(lg.detailTips.tipsCookieShowList.length * Math.random());
                    $('.' + lg.detailTips.tipsCookieShowList[lg.detailTips.randomShowHandler].dom).find('.MDS-icon-modal-close').on('click', function (e) {
                        lg.Utils.setCookie(lg.detailTips.tipsCookieShowList[lg.detailTips.randomShowHandler].cookieName, true);
                        $('.' + lg.detailTips.tipsCookieShowList[lg.detailTips.randomShowHandler].dom).remove();
                    });
                }
            };
            return isShow;
        }
    };

    // 看板右侧黄色tips初始化
    lg.Utils.setCookie('pipBookMarkTips', true);
    lg.detailTips.getTipsTrue();

    // 根据lg.set('stage'),lg.set('positionId'),lg.set('resumeId') 把参数写在url里面 改变url
    lg.UpdateUrl();

    // 获取当前的stage和positionId
    var params = {
        stage: lg.get('stage'),
        positionId: lg.get('positionId'),
        channelId: lg.get('channelId'),
        plus: lg.get('plus'),
        coo:lg.get('coo')
    };

    // 获取是否是否定位到第一条
    if (lg.has('directRid')) {
        params.directRid = lg.get('directRid');
    }

    // 创建页面的右侧view
    var piplineRigetView = new lg.Views.BaseView({
        name: 'piplineRigetView',
        fields: [{
            name: 'resume_photo',
            init: 'no',
            controlType: "UserPhoto"
        }, {
            name: 'userInfo',
            init: 'no',
            controlType: "UserInfomationView"
        }, {
            name: 'resume_toolbar',
            init: 'no',
            controlType: "ToolBar"
        }]
    });

    // 不同阶段评论输入框的placeholder
    var commet = {
        "NEW": '@同事转发简历，或随手记下你对候选人的评价，评论内容候选人看不到哦~',
        "LINK": '@同事转发简历，或随手记下你和候选人的沟通情况，评论内容候选人看不到哦~',
        "INTERVIEW": '@同事转发简历，或随手记下候选人的面试评价，评论内容候选人看不到哦~',
        "OFFER": '@同事转发简历，或随手记下你和候选人的沟通情况，评论内容候选人看不到哦~',
        "CHECK_IN": '@同事转发简历，或随手记下你和候选人的沟通情况，评论内容候选人看不到哦~'
    };
    // 不同阶段评论 收起按钮 的文案
    var commet_text = {
        "NEW": '填写评论',
        "LINK": '填写沟通情况',
        "INTERVIEW": '填写面试情况',
        "OFFER": '填写沟通情况',
        "CHECK_IN": '填写沟通情况'
    };

    // 更新招聘进程和参与者列表
    piplineRigetView.on('updateCommentList', function (e) {
        //initSendOfferTab();

        /* 评论、操作记录部分信息重新加载。right-detail的main.js中有更新的事件绑定 */
        (function () {
            var lock = false;
            var resumeid = lg.get('resumeId');
            var notiesData;
            var noticeAt = ['RESUME_AT'];
            var noticeDot = ['COMMENT_NEW'];

            //给id和类型匹配的id记下来
            var savedTips = {
                idAt:[],
                idDot:[]
            };

            loadNewNotifications();

            //点击评论 操作记录，小红点 @ 消失
            $('.comment_tips_add').on('click',function(){
                if($(this).hasClass('msg')){
                    $('.comment_tips_add').removeClass('msg');
                    markReadNew();
                } else if($(this).find('.new-tips-mark').is(':visible')){
                    $('.resume-review .new-tips-mark').hide();
                    markReadNew();
                }
            });

            // 评论查询
            function loadNewNotifications () {
                $.get(GLOBAL_DOMAIN.ectx + "/notification/unReadNotifications.json", function (resp) {
                    var state = parseInt(resp.state, 10);
                    var sign = null;

                    if ( state === 1 ) {
                        var content = resp.content || {};
                        var notifications = content.rows || [];
                        notiesData = notifications.map(function(item){
                            return{
                                id:item.id,
                                resumeId:item.params.resumeId,
                                type:item.type
                            };
                        });
                        for(var i = 0; i < notiesData.length; i++){
                            for(var j = 0; j < noticeAt.length; j++){
                                if(notiesData[i].resumeId == resumeid && notiesData[i].type == noticeAt[j]){
                                    savedTips.idAt.push( parseInt(notiesData[i].id,10) );
                                }
                            }
                            for(var j = 0; j < noticeDot.length; j++){
                                if(notiesData[i].resumeId == resumeid && notiesData[i].type == noticeDot[j]){
                                    savedTips.idDot.push( parseInt(notiesData[i].id,10) );
                                }
                            }
                        }
                        if( savedTips.idAt.length > 0 ){
                            $('.resume-review .new-tips-mark').show();
                            $('.comment_tips_add').removeClass('msg');
                        } else if( savedTips.idDot.length > 0 ){
                            $('.comment_tips_add').addClass('msg');
                            $('.resume-review .new-tips-mark').hide();
                        }else{
                            $('.comment_tips_add').removeClass('msg');
                            $('.resume-review .new-tips-mark').hide();
                        }
                    }
                }, 'json');
            }

            function markReadNew(){
                if ( lock ) {
                    return;
                }
                lock = true;

                var sendData = savedTips.idAt.concat(savedTips.idDot).join(',').trim();
                $.post(GLOBAL_DOMAIN.ectx + "/notification/markRead.json", {
                    notificationId:sendData
                }, function (resp) {
                    locked = false;

                    var state = parseInt(resp.state, 10);
                    if ( state === 1 ) {

                    }
                }, 'json');
            }
        })();

        /* 应聘记录信息信息重新加载。right-detail的main.js中有更新的事件绑定 */
        (function () {
            //应聘记录的消息提示
            //数据准备
            var locked = false;
            var tipsData;
            var phone = $('.user-info .tips-remind .phone-tips').text().trim();
            var email = $('.user-info .tips-remind .info-email-url').text().trim();

            loadUnReadResumeNew();

            //点击应聘记录，小红点消失
            $('.records_tips_add').on('click',function(){
                if( $(this).hasClass('msg')){
                    markRead ();
                    $('.records_tips_add').removeClass('msg');
                }
            });

            function loadUnReadResumeNew (){
                $.get(GLOBAL_DOMAIN.ectx + "/can/getUnReadResumeNew.json", function (resp) {
                    var state = parseInt(resp.state, 10);

                    if ( state === 1 ) {
                        var content = resp.content || {};
                        var unReadResumes = content.data.data || [];
                        if(unReadResumes == []){
                            return;
                        }
                        var loadDatas = unReadResumes.map(function(item){
                            return{
                                phone:item.params.phone,
                                email:item.params.email
                            };
                        });
                        var loadPhone = loadDatas.map(function(item){
                            return item.phone
                        }).indexOf(phone);
                        var loadEmail = loadDatas.map(function(item){
                            return item.email
                        }).indexOf(email);
                        if( loadPhone != -1 && loadEmail != -1 ){
                            $('.records_tips_add').addClass('msg');
                            tipsData = unReadResumes.map(function(item){
                                return {
                                    phone:item.params.phone,
                                    email:item.params.email,
                                    id:item.id
                                };
                            });
                        }
                    }
                }, 'json');
            }

            function markRead () {
                var sendData = [];
                if ( locked ) {
                    return;
                }
                locked = true;
                console.log('tipsData:');
                console.log( tipsData );
                if( tipsData.length != 0 ){
                    for(var i = 0; i < tipsData.length; i++){
                        if(tipsData[i].email == email && tipsData[i].phone == phone){
                            sendData.push(parseInt(tipsData[i].id,10));
                        }
                    }
                }

                $.post(GLOBAL_DOMAIN.ectx + "/notification/markRead.json", {
                    notificationId:sendData.join(',')
                }, function (resp) {
                    locked = false;

                    var state = parseInt(resp.state, 10);
                    if ( state === 1 ) {
                        console.log('mark read ok');
                    }
                }, 'json');
            }
        })();

        (function () {
            var $yunOfOffer = $('.yun-of-offer');
            var $yunOfEntry = $('.yun-of-entry');
            if( $yunOfOffer.length > 0 ) {
                $yunOfOffer.attr( 'href', '../../https@yun.lagou.com/offer/requirement.htm@resumeId=' + lg.get('resumeId') );
                $yunOfOffer.attr( 'data-module', '../../https@yun.lagou.com/offer/requirement.htm@resumeId=' + lg.get('resumeId') );
            }
            if( $yunOfEntry.length > 0 ) {
                $yunOfEntry.attr( 'href', '../../https@yun.lagou.com/entry/create.htm@resumeId=' + lg.get('resumeId') );
                $yunOfEntry.attr( 'data-module', '../../https@yun.lagou.com/entry/create.htm@resumeId=' + lg.get('resumeId') );
            }
        })();

        /*
        * 返回拉勾云简历的状态
        * type==1: 显示锁定的文案   type==2: 不进行锁定，正常显示
        */
        var yunstatus = {
            "APPROVING":{
                type:1,
                value:'Offer请求审批中'
            },
            "APPROVE_PASS":{
                type:1,
                value:'Offer请求审批通过'
            },
            "WAIT_SEND":{
                type:1,
                value:'Offer待发送'
            },
            "WAIT_ENSURE":{
                type:1,
                value:'Offer待确认'
            },
            "WAIT_PERFECT":{
                type:1,
                value:'Offer已确认，入职登记表待完善'
            },
            "WAIT_ENTRY":{
                type:1,
                value:'Offer已确认，入职登记表待完善'
            },
            "WAIT_REVIEW":{
                type:1,
                value:'入职登记表待审核'
            },
            "REVIEWED":{
                type:1,
                value:'入职登记表已审核'
            },
            "APPROVE_FAIL":{
                type:2,
                value:'Offer请求被驳回'
            },
            "INVALID":{
                type:2,
                value:'Offer失效'
            }
        };
        var resumeIds = lg.get('resumeId');

        (function(){
            //拿到拉勾云的状态,是拉勾云的才进行以下步骤
            if( CONST_VARS('user')['isYunUser'] ){
                if( lg.get('stage') == 'OFFER' || lg.get('stage') == 'CHECK_IN' ){
                    $.get('../resume/order/'+ resumeIds +'.json',function(resp){
                        if( resp.state === 1 || resp.state === 405 ){
                            var yunvalue = resp.content.data.yunstatus;
                            if( yunvalue != "" ){
                                var type = parseInt(yunstatus[yunvalue].type,10);
                                if( type === 1){
                                    $('.offer-in-progress').text(yunstatus[yunvalue].value).show();
                                    $('.entry-process-options').hide();
                                    $('.out-options').hide();
                                }
                                else if ( type === 2 && lg.get('stage') == 'OFFER' ) {
                                    $('.offer-in-progress').hide();
                                    $('.entry-process-options').show();
                                    var $processEle = $('.entry-process-options .to-be-commu');

                                    // 针对【Offer请求被驳回】【Offer失效】对a链接的父元素的样式重置
                                    $processEle.addClass('to-be-commu-nboder');
                                    $processEle.find('i').hide();

                                    // 针对【Offer请求被驳回】【Offer失效】对a链接的样式重置
                                    $processEle.find('a').text(yunstatus[yunvalue].value).attr({ 'href': 'javascript:;', 'class': 'current', 'data-toggle': ''});

                                    // 未知绑定了很多click，所以这里清除之前所有的click之后重新绑定
                                    $('.entry-process-options').unbind('click');
                                    $('.entry-process-options').on( 'click', '.toggle_menu-selected', function( e ) {
                                        if( $processEle.text() == 'Offer请求被驳回' || $processEle.text() == 'Offer失效' ) {
                                            var $toggle = $(this).next();
                                            if($toggle.is(":visible")){
                                                $toggle.fadeOut();
                                            }else{
                                                $('.header-right-toolbar .toggle_selected').fadeOut();
                                                $toggle.fadeIn();
                                            }
                                            e.stopPropagation();
                                        }
                                    });
                                    if( yunvalue == 'APPROVE_FAIL' || yunvalue == 'INVALID' ) {
                                        $('.out-options').show();
                                    }
                                    else {
                                        $('.out-options').hide();
                                    }
                                }
                            }
                            else if ( lg.get('stage') == 'OFFER' ) {
                                $('.offer-in-progress').hide();
                                $('.entry-process-options').show();
                                $('.out-options').show();
                            }
                            if( yunvalue == "" && $('.offer-in-progress').is(":visible") ){
                                $('.offer-in-progress').hide();
                            }
                            if( yunvalue == "" && $('.entry-process-options').is(":hidden") ){
                                $('.entry-process-options').show();
                            }
                            if( yunvalue == "" && $('.out-options').is(":hidden") ){
                                $('.out-options').show();
                            }
                        }
                    },'json');
                }

                else{
                    if( $('.offer-in-progress').is(":visible") ){
                        $('.offer-in-progress').hide();
                    }
                    if( $('.entry-process-options').is(":hidden")){
                        $('.entry-process-options').show();
                    }
                    if( $('.out-options').is(":hidden") && lg.get('stage') != 'OBSOLETE'){
                        $('.out-options').show();
                    }
                    else if( $('.out-options').is(":visible") && lg.get('stage') == 'OBSOLETE') {
                        $('.out-options').hide();
                    }
                }
            }
        })();

        /**
         * 左侧列表切换时候 e会传参过来
         * 如果从列表过来第一次加载,以后都是缓存
         */
        if(e && typeof e.cooperators != 'undefined'){
            new lg.Widgets.Controls.CommentList({
                name: 'commentList',
                dataSource: e.comments,
                templateEng: template,
                showToRecomment: true,
                showNum:100
            });// 回复,showToRecomment:true
            new lg.Widgets.Controls.CooperatorList({
                name: 'cooperatorList',
                dataSource: e.cooperators,
                limitNum: 10
            });
            return;
        }
        // 评论输入框内 placeholder 文案随着阶段改变
        $('#commentInput').attr('placeholder', commet[lg.get('stage')]);
        // 招聘进程更新
        $.ajax({
            url: '../resume/process.json',
            data: {resumeId: lg.get('resumeId')}
        }).success(function (e) {
            if (e.state == 1) {
                new lg.Widgets.Controls.CommentList({
                    name: 'commentList',
                    dataSource: e.content.data.data && e.content.data.data.comments,
                    templateEng: template,
                    showToRecomment: true,
                    showNum:100
                });// 回复,showToRecomment:true
                new lg.Widgets.Controls.CooperatorList({
                    name: 'cooperatorList',
                    dataSource: e.content.data.data && e.content.data.data.cooperators,
                    limitNum: 10
                });
                if(lg.getresume_list().dataList[lg.get('resumeId')]){
                    lg.getresume_list().dataList[lg.get('resumeId')].cooperators = e.content.data.data && e.content.data.data.cooperators  || [];
                    lg.getresume_list().dataList[lg.get('resumeId')].comments = e.content.data.data && e.content.data.data.comments || [];
                }

                // 列表点击回复的时候定位到评论输入框,并把选中的人输入到评论框里
                lg.getcommentList().on('toRecomment', function (e) {
                    $('#commentInput').append('<span class="atwho-inserted" data-atwho-at-query="@"><span data-item-id="' + e.userId + '">@' + e.userName + '</span></span>&zwj;&nbsp;');
                    if ($('.detail-resume-comment').find('.toggle-box-content').css('display') == 'none') {
                        $('#toggle_submit_commemt').trigger('click');
                    }
                    editor.focus();
                });
            };
        });
        // 简历预览控件工具条->通过按钮 ->文案随着阶段改变
        $('.preview-toolbar-pass').html(lg.getresume_toolbar().getSubInfo(lg.getresume_toolbar().itemData.stage).stageText+' <i class="icon-yes"></i>');
        $('.preview-toolbar-pass').attr('data-guid','MockResumeGuid');
        $('.preview-toolbar-pass').attr('data-step','passNewHover');
        if(lg.getresume_toolbar().itemData.stage=="NEW"){
            lg.getnewGuid().initGuid();
        }
        lg.getresumePreviewToolBar().setDataSource(lg.getresume_list().getActiveData());
    });

    // 改变阶段下 如待沟通等的数字  -- 后端同步更新
    piplineRigetView.on('updateNumbers', function (e) {
        $.ajax({
            url: 'count.json',
            data: {stage: lg.get('stage'), positionId: lg.get('positionId')}
        }).success(function (result) {
            if (result.state == 1) {
                for (var item in result.content.data) {
                    if (typeof result.content.data[item] == 'number')
                        $('[data-propertyname="' + item + '"]').text(result.content.data[item]);
                }
            }
        });
    });

    //// 发送offer初始化
    //function initSendOfferTab (e) {
    //    var itemData = lg.getresume_list().getActiveData();
    //    if(typeof itemData =='undefined'){
    //       return;
    //    }
    //    (itemData.subStage == 'OFFER_SEND')?$('[href="#sendOfferTab"]').text('重发Offer'):$('[href="#sendOfferTab"]').text('发Offer');
    //    $('.step1').trigger('click');
    //    $('.common-error').hide();
    //    if(itemData.stage == 'OFFER'){
    //
    //        $('[href="#sendOfferTab"]').parent().show();
    //        if(lg.getofferInfoView){
    //            lg.getofferInfoView().setClear();
    //        }
    //        if(itemData.subStage == 'OFFER_SEND'){
    //            // sendOffer && sendOffer[lg.get('resumeId')]
    //            if(typeof itemData.offerVo != 'undefined'){
    //                lg.getofferInfoView().setClear();
    //                lg.gettopicView().setClear();
    //                var temp = {};
    //                temp.offer_name = itemData.offerVo.name ;
    //                temp.offer_phone = itemData.offerVo.phone;
    //                temp.offer_email = itemData.offerVo.email
    //                temp.offer_employTime = itemData.offerVo.entryDate.substr(0,10);
    //                temp.offer_department = itemData.offerVo.departmentName;
    //                temp.offer_title = itemData.offerVo.positionTitleName;
    //                lg.getofferInfoView().setValue(temp);
    //                $('#OfferInfoBox #OfferSex').val(itemData.offerVo.sex||"男");
    //                $('#OfferInfoBox #OfferSex').trigger('update.fs');
    //                lg.gettopic().setValue(itemData.offerVo.topic||'');
    //                $('#sendOfferBox #trumbowygEditor').html(itemData.offerVo.content||'');
    //                if(itemData.offerVo.attachmentName){
    //                    var fileName = itemData.offerVo.attachmentName;
    //                    var text = fileName.substring(fileName.lastIndexOf('/')+1);
    //                    $('.offer-attachment  .offer-show-name .file-name').text(text);
    //                    $('.offer-attachment .offer-show-name').show();
    //                    $('.offer-attachment .offer-attachment-add').hide();
    //                }
    //            }else{
    //                $.ajax({
    //                    url:'../hr/offer/offerByResumeId.json',
    //                    data:{resumeId:itemData.id}
    //                }).success(function (result) {
    //                    if(result.state==1){
    //                        itemData.offerVo = result.content.data.offerVo;
    //                        lg.getresume_list().dataList[itemData.id] ? lg.getresume_list().dataList[itemData.id].offerVo = result.content.data.offerVo : '';
    //                        lg.getofferInfoView().setClear();
    //                        lg.gettopicView().setClear();
    //                        $('.trumbowyg-box').css('border','1px solid #DDD');
    //                        var temp = {};
    //                        temp.offer_name = itemData.offerVo.name ;
    //                        temp.offer_phone = itemData.offerVo.phone;
    //                        temp.offer_email = itemData.offerVo.email
    //                        temp.offer_employTime = itemData.offerVo.entryDate?itemData.offerVo.entryDate.substr(0,10):'';
    //                        temp.offer_department = itemData.offerVo.departmentName;
    //                        temp.offer_title = itemData.offerVo.positionTitleName;
    //                        lg.getofferInfoView().setValue(temp);
    //                        $('#OfferInfoBox #OfferSex').val(itemData.offerVo.sex||"男");
    //                        $('#OfferInfoBox #OfferSex').trigger('update.fs');
    //                        lg.gettopic().setValue(itemData.offerVo.topic||'');
    //                        $('#sendOfferBox #trumbowygEditor').html(itemData.offerVo.content||'');
    //                        if(itemData.offerVo.attachmentName){
    //                            var fileName = itemData.offerVo.attachmentName;
    //                            var text = fileName.substring(fileName.lastIndexOf('/')+1);
    //                            $('.offer-attachment  .offer-show-name .file-name').text(text);
    //                            $('.offer-attachment .offer-show-name').show();
    //                            $('.offer-attachment .offer-attachment-add').hide();
    //                        }
    //                    }else{
    //                        lg.getofferInfoView().setClear();
    //                        lg.gettopicView().setClear();
    //                        $('.trumbowyg-box').css('border','1px solid #DDD');
    //                        var temp = {};
    //                        temp.offer_name = itemData.candidateName ;
    //                        temp.offer_phone = itemData.phone||'';
    //                        temp.offer_email = itemData.email||'';
    //                        if(lg.getofferInfoView){
    //                            lg.getofferInfoView().setValue(temp);
    //                        }
    //                        $('#OfferInfoBox #OfferSex').val((itemData.sex != '女'?"男":'女'));
    //                        $('#OfferInfoBox #OfferSex').trigger('update.fs');
    //                        if(lg.Cache.has('offerDefaultTemplate')){
    //                            lg.gettopic().setValue(lg.Cache.get('offerDefaultTemplate').topic||'');
    //                            $('#sendOfferBox #trumbowygEditor').html(lg.Cache.get('offerDefaultTemplate').content||'');
    //                        }else{
    //                            lg.gettopic().setValue('');
    //                            $('#sendOfferBox #trumbowygEditor').html('');
    //                        }
    //                        $('.offer-attachment .offer-show-name').hide();
    //                        $('.offer-attachment .offer-attachment-add').show();
    //                    }
    //                });
    //            }
    //            lg.getoffer_phone().setReadOnly(true);
    //        }else{
    //            var sendOffer = lg.Utils.getLocalStorage('SendOffer');
    //            var temp = {};
    //            lg.getofferInfoView().setClear();
    //            lg.gettopicView().setClear();
    //            $('.trumbowyg-box').css('border','1px solid #DDD');
    //            if(sendOffer && sendOffer[lg.get('resumeId')]){
    //                temp.offer_name = sendOffer[lg.get('resumeId')].name ;
    //                temp.offer_phone = sendOffer[lg.get('resumeId')].phone;
    //                temp.offer_email = sendOffer[lg.get('resumeId')].email;
    //                temp.offer_employTime = sendOffer[lg.get('resumeId')].entryDate.substr(0,10);
    //                temp.offer_department = sendOffer[lg.get('resumeId')].departmentName;
    //                temp.offer_title = sendOffer[lg.get('resumeId')].positionTitleName;
    //                $('#OfferInfoBox #OfferSex').val((sendOffer[lg.get('resumeId')].sex != '女'?"男":'女'));
    //            }else{
    //                temp.offer_name = itemData.candidateName ;
    //                temp.offer_phone = itemData.phone||'';
    //                temp.offer_email = itemData.email||'';
    //                $('#OfferInfoBox #OfferSex').val((itemData.sex != '女'?"男":'女'));
    //            }
    //
    //
    //            $('#OfferInfoBox #OfferSex').trigger('update.fs');
    //
    //            if(lg.Cache.has('offerDefaultTemplate')){
    //                lg.gettopic().setValue(lg.Cache.get('offerDefaultTemplate').topic||'');
    //                $('#sendOfferBox #trumbowygEditor').html(lg.Cache.get('offerDefaultTemplate').content||'');
    //            }else{
    //                $.ajax({
    //                    url:'../settings/template/offer_temp.json'
    //                }).success(function (result) {
    //                    if(result.state==1){
    //                        lg.Cache.set('offerDefaultTemplate',result.content.data.offerTemplate);
    //                        lg.gettopic().setValue(lg.Cache.get('offerDefaultTemplate').topic||'');
    //                        $('#sendOfferBox #trumbowygEditor').html(lg.Cache.get('offerDefaultTemplate').content||'');
    //                    }
    //                });
    //            }
    //            $('.offer-attachment .offer-show-name').hide();
    //            $('.offer-attachment .offer-attachment-add').show();
    //            if(lg.getofferInfoView){
    //                $('#OfferInfoBox .control-box').empty();
    //                for(var i = 0,len=1;i<len;i++){
    //                    var html = '';
    //                    html+='<div class="filter-select" data-propertyname="offer_email_copy_'+i+'">' +
    //                        '<input type="text" class="input" placeholder="邮箱">' +
    //                        '</div>';
    //                    $('#OfferInfoBox .control-box').append(html);
    //                    lg.getofferInfoView().addControls([
    //                        {
    //                            name: 'offer_email_copy_'+i,
    //                            placeHolder: '邮箱',
    //                            showSelect:true,
    //                            showKey:'receiveEmail,email',
    //                            key: 'name email receiveEmail',
    //                            dataSource: lg.Cache.get('allMembers'),
    //                            showMessage:true,
    //                            validRules: [{
    //                                mode: 'pattern',
    //                                isUse: true,
    //                                status: false,
    //                                data:{nolen:/^\S{0,0}$/,email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i},
    //                                message: '请输入有效的邮箱'
    //                            }],
    //                            controlType: "FilterSelect"
    //                        }
    //                    ]);
    //                }
    //            }
    //            if(lg.getofferInfoView){
    //                lg.getofferInfoView().setValue(temp);
    //            }
    //            lg.getoffer_phone().setReadOnly(false);
    //        }
    //        $('#OfferInfoBox').show();
    //        $('#sendOfferBox').hide();
    //        $('#successOffer').hide();
    //        $('#sendOfferTab .step1').trigger('click');
    //
    //    }else{
    //        $('[href="#sendOfferTab"]').parent().hide();
    //    }
    //}

    // 默认页面已经来获取一次
    lg.getpiplineRigetView().trigger('updateNumbers');

    // 左侧列表
    $.ajax({
        url: "list.json",
        data: params,
        cache:false
    }).success(function (result) {
        if (result.state == 1) {
            var len = result.content.rows.length;
            var piplineLeftView = new lg.Views.BaseView({
                name: 'piplineLeftView',
                fields: [{
                    name: 'resume_list',
                    dataSource: result.content.rows,
                    directRid: lg.has('directRid') ? true : false,
                    top: lg.get('stage') === "NEW",
                    hasMore: result.content.data.hasMore,
                    timeStr: result.content.data.timeStr,
                    deadlineHasComeCount: result.content.data.deadlineHasComeCount,
                    deadlineWillComeCount: result.content.data.deadlineWillComeCount,
                    controlType: "CartList"
                }]
            });

            // 是否定位某一份简历  定位后删除 自定位一次
            if (lg.has('directRid')) {
                lg.del('directRid');
                lg.UpdateUrl();
            }
            var reqTimes = 0;
            var timerReq,previewAjax;
            // 左侧列表单击事件定义
            piplineLeftView.getControl('resume_list').on('itemClick', function (e) {
                if(typeof previewAjax !== 'undefined') {
                    previewAjax.abort();
                }
                window.clearTimeout(timerReq);
                reqTimes = 0;
                $('#resumeTab').removeClass('fix-top');
                var itemData = e.control.getActiveData();
                $('[href="#outResumeTab"]').parent().hide();
                if(typeof itemData == 'undefined'){
                    window.location.reload();
                    return;
                }
                $('.nav-tabs [href="#resumePreViewTab"]').trigger('click');

                piplineRigetView.getControl('resume_photo').init({
                    randomNum: ( itemData.userId % 4 ),
                    text: itemData.candidateName.substring(0, 1),
                    photoUrl: itemData.portrait || ''
                });
                piplineRigetView.getControl('userInfo').init({
                    dataSource: e.control.getActiveData()
                });
                lg.getuserInfo().setVisible(true);
                if (typeof lg.getediteBox != 'undefined') {
                    lg.getediteBox().setVisible(false);
                }
                $('.detail-content').attr('data-scrollTop',18);
                /**
                 * 应聘职位和曾应聘过的职位控制和显示
                 */
                $('.ever_position').find('.resume-position').html('<a target="_blank" href="/position/redirectOriginalPage.htm?positionId=' + itemData.positionId + '&companyId=' + itemData.companyId + '">' + itemData.positionName + '</a>');
                $('.ever_position').find('.ever_position_list').text('');

                if( typeof itemData.resumeVoo == 'undefined' ) {
                    $.ajax({
                        url: '../resume/order/' + itemData.id + '.json',
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        success: function ( res ) {
                            if( res.state == 1 ) {
                                itemData.resumeVoo = res.content.data;
                            }
                        },
                        error: function ( res ) {
                            console.log( '../resume/order/' + itemData.id + '.json请求失败' );
                        }
                    });
                }

                if (typeof itemData.everPositions == 'undefined' && itemData.phone && itemData.email) {
                    $.ajax({
                        url: '../resume/searchSameResume.json',
                        data: {
                            id: e.control.getActiveData().id,
                            email: e.control.getActiveData().email,
                            phone: e.control.getActiveData().phone,
                            positionId: e.control.getActiveData().positionId
                        },
                    }).success(function (data) {
                        var params = lg.QueryStringByUrl(this.url);
                        var everPositions = [];
                        if(!(data&& data.content&& data.content.rows)){
                            return;
                        }
                        for (var i = 0, len = data.content.rows.length; i < len; i++) {
                            if (params.get('positionId') != data.content.rows[i].positionId) {
                                everPositions.push(data.content.rows[i]);
                            }

                        }
                         lg.getresume_list().dataList[params.get('id')] ? lg.getresume_list().dataList[params.get('id')].everPositions = everPositions : '';
                         piplineRigetView.getControl('userInfo').init({
                             dataSource: e.control.getActiveData()
                         });
                         lg.getpiplineRigetView().trigger('everPositionsShow',e.control.getActiveData());
                         lg.getpiplineRigetView().trigger('relativeInformation',e.control.getActiveData());
                    });
                } else {
                    if (itemData.everPositions && itemData.everPositions.length > 0) {
                        lg.getpiplineRigetView().trigger('everPositionsShow',itemData);
                    }
                    lg.getpiplineRigetView().trigger('relativeInformation',e.control.getActiveData());
                }
                if(!itemData.province && itemData.phone){
                    $.ajax({
                        url:'../../https@apis.juhe.cn/mobile/get@key=0143d121b153e1f0b2a7ad3ec1c770a0',
                        data:{phone:itemData.phone},
                        dataType:'jsonp',                          //指定为jsonp类型
                        jsonp:'callback',                          //服务器端获取回调函数名的key，对应后台有$_GET['callback']='getName';callback是默认值
                        jsonpCallback:'__GetZoneResult_',
                    }).success(function (result) {
                        if(result.resultcode==200 && (result.result.city ||result.result.province)){
                            itemData.province = result.result.city ||result.result.province;
                            lg.getresume_list().dataList[lg.get('resumeId')].province = itemData.province;
                            lg.getpiplineRigetView().getControl('userInfo').init({
                                dataSource: e.control.getActiveData()
                            });
                            lg.getpiplineRigetView().trigger('relativeInformation',e.control.getActiveData());
                        }
                    });
                }
                if (typeof itemData.isCanChat == 'undefined') {
                    $.ajax({
                        url: '../im/ChatAfterDelivered/canChat.json',
                        data: {resumeId: lg.get('resumeId')}
                    }).success(function (data) {
                        if (data.state == 1) {
                            lg.getresume_list().dataList[lg.get('resumeId')].isCanChat = true;

                            lg.getresume_list().dataList[lg.get('resumeId')].msgCount = data.content.data.msgCount;
                        } else {
                            lg.getresume_list().dataList[lg.get('resumeId')].isCanChat = false;
                        }
                        piplineRigetView.getControl('userInfo').init({
                            dataSource: e.control.getActiveData()
                        });
                    });
                } else {
                    piplineRigetView.getControl('userInfo').init({
                        dataSource: e.control.getActiveData()
                    });
                }
                $('#commentInput').attr('placeholder', commet[itemData.stage]);
                piplineRigetView.getControl('resume_toolbar').init({
                    dataSource: e.control.getActiveData()
                });
                piplineRigetView.getElement().removeClass('no-resume');
                if (lg.detailTips.tipsCookieShowList.length > 0) {
                    if (!lg.Utils.getCookie(lg.detailTips.tipsCookieShowList[lg.detailTips.randomShowHandler])) {
                        if ($('.right-content').hasClass('.no-resume')) {
                            $('.' + lg.detailTips.tipsCookieShowList[lg.detailTips.randomShowHandler].dom).hide();
                        } else {
                            $('.' + lg.detailTips.tipsCookieShowList[lg.detailTips.randomShowHandler].dom).show();
                        }
                    } else {
                        $('.' + lg.detailTips.tipsCookieShowList[lg.detailTips.randomShowHandler].dom).hide();
                    }
                }
                var resumePreViewData = {};

                // 图片或者pdf的itemData.doc == 'undefined'时走else，这里暂时把 在线简历排除了，回头需要详细看代码捋清楚才能往else中加
                if (typeof itemData.fileId != 'undefined' && ( typeof itemData.doc == 'undefined' || itemData.doc.type == 'ONLINE_RESUME' ) ) {
                    function requestAgain() {
                        if(reqTimes>=4) {reqTimes = 0;}
                        previewAjax = $.ajax({
                            url: '../resume/preview_info.json',
                            data: {resumeId: lg.get('resumeId')}
                        }).success(function (data) {
                            reqTimes++;
                            if (data.state == 1) {
                                $('.loading').hide();
                                $('.changing-fail').hide();
                                window.clearTimeout(timerReq);
                                var type = data.content.data.previewType;
                                var resumeId = lg.get('resumeId');
                                var pageCount = data.content.data.pageCount;

                                if(window.doc){
                                    window.doc.unmount();
                                }
                                if( data.content.data.isOnlineResume ) {
                                    type = 'ONLINE_RESUME';
                                }
                                if( !pageCount ) {
                                    pageCount = 1;
                                }
                                var doc = window.doc = preview.preview(resumeId, type, pageCount, 827,  '.resume-preview', itemData);
                                itemData.doc = doc;
                                lg.getresume_list().addCache(itemData.id);
                                $.extend(lg.getresume_list().dataList[itemData.id],itemData);
                                doc.bind('load', function(){
                                    $('.detail-content').getNiceScroll().resize();
                                   lg.getresumePreviewToolBar().setDataSource(itemData);
                                    lg.getresumePreviewToolBar().setShow(true);
                                    if(itemData.doc.textAndLinkState ==0){
                                        //是否显示复制
                                        if(itemData.openCopy){
                                            $('.preview-toolbar-copy').hide();
                                            $('.pip_resume_copy_switch_tips').hide();
                                        }else{
                                           $('.pip_resume_copy_switch_tips').show();
                                            $('.preview-toolbar-copy').show();
                                            $('.preview-toolbar-copy').removeClass('disabled-style');
                                        }
                                    }else{
                                        $('.pip_resume_copy_switch_tips').hide();
                                        $('.preview-toolbar-copy').hide();
                                    }
                                });
                                if( type == 'ONLINE_RESUME' && doc.load == true ) {
                                    doc.trigger('load');
                                }
                            }
                            else{
                                $('.changing-fail').hide();

                                // 清空在线简历内容
                                $('.resume-preview .graph-layer').empty();
                                $('.loading').show();
                                // 请求对简历再次解析
                                if(reqTimes >=1 && reqTimes <=4) {
                                    $.ajax({
                                        url: "../resume/preview/reportFailed.json",
                                        data: {resumeId: lg.get('resumeId')},
                                        fail: function(){
                                            console.log('请求再次解析失败');
                                        }
                                    });
                                }
                                timerReq = window.setTimeout(requestAgain,3000);
                                if(reqTimes >= 4) {

                                    window.clearTimeout(timerReq);
                                    reqTimes = 0;
                                     if(window.doc){
                                         window.doc.unmount();
                                         if(typeof  itemData.doc != 'undefined'){
                                             window.doc = itemData.doc;
                                             itemData.doc.mount('.resume-preview');
                                             if(itemData.doc.textAndLinkState ==0){
                                                 $('.pip_resume_copy_switch_tips').show();
                                                 $('.preview-toolbar-copy').show();
                                                 $('.preview-toolbar-copy').removeClass('disabled-style');
                                             }else{
                                                 $('.pip_resume_copy_switch_tips').hide();
                                                 $('.preview-toolbar-copy').hide();
                                             }
                                         }
                                     }
                                     $('.loading').hide();
                                     $('.changing-fail').show();
                                     $('.pip_resume_copy_switch_tips').hide();
                                     // $('#resumePreViewTab .not-data div').html('简历转换失败，请直接下载简历');
                                     $('#resumePreViewTab').addClass('no-resume-PreView');
                                     $('.detail-resume-review').find('.toggle-box-content').hide();
                                     //$('.detail-resume-review').find('.toggle-box-header').find('a').hide();
                                     $('.detail-resume-review').find('.toggle-box-header').find('a').text('');
                                     lg.getresumePreviewToolBar().setDataSource(itemData);
                                     lg.getresumePreviewToolBar().setShow(true);
                                    /* lg.getresumePreviewToolBar().setShow(true);
                                     $('.preview-toolbar').hide();*/
                                }
                            }
                        });
                    }
                    requestAgain();
                }else{
                    if(window.doc){
                        $('.loading').hide();
                        lg.getresume_list().addCache(itemData.id);
                        window.doc.unmount();
                        if(typeof  itemData.doc != 'undefined'){
                            window.doc = itemData.doc;
                            itemData.doc.mount('.resume-preview');
                            if(itemData.doc.textAndLinkState ==0){
                                $('.pip_resume_copy_switch_tips').show();
                                $('.preview-toolbar-copy').removeClass('disabled-style');
                                $('.preview-toolbar-copy').show();
                            }else{
                                $('.pip_resume_copy_switch_tips').hide();
                                $('.preview-toolbar-copy').hide();
                            }
                        }
                    }
                    lg.getresumePreviewToolBar().setDataSource(itemData);
                    lg.getresumePreviewToolBar().setShow(true);
                }

                if (typeof itemData.fileId == 'undefined') {
                    $('#resumePreViewTab .not-data div').text('未上传简历');
                    $('#resumePreViewTab').addClass('no-resume-PreView');
                    $('.detail-resume-review').find('.toggle-box-content').hide();
                    $('.detail-resume-review').find('.toggle-box-header').find('a').text('');
                }

                else if(typeof itemData.pdfId !== 'undefined'){
                    $('.detail-resume-review').find('.toggle-box-header').find('a').show();
                    $('#resumePreViewTab').removeClass('no-resume-PreView');
                    var toggle_text = $('.detail-resume-review').find('.toggle-box-header').find('a').text();
                }

                //是否显示复制
                if(itemData.openCopy){
                    $('.preview-toolbar-copy').hide();
                    $('.pip_resume_copy_switch_tips').hide();
                }

                $('.commet_box').find('#submitComment').off('click');
                $('.commet_box').find('#submitComment').on('click', function (e) {
                    var self = this;

                    var comment = $('#commentInput').text();
                    if (comment.length == 0) {
                        $('#commentInput').addClass("input_warning");
                    }
                    else if (comment.length > 500) {
                        $('#commentInput').addClass("input_warning");
                        var confirm = new lg.Widgets.Controls.Confirm({
                            content: '内容过长',
                            submitText: "确定",
                            SubmitBtn: function (e) {
                                e.control.setRemove();
                            },
                            noCancelBtn: true
                        });
                    }
                    else {
                        $('#commentInput').removeClass("input_warning");
                        var cooperatorIds = [];
                        $('#commentInput').find('[data-item-id]').each(function (i, el) {
                            var uid = $(el).attr('data-item-id');
                            var username = $(el).text();
                            comment = comment.replace(username, "[at id='" + uid + "' name='" + username.substring(1) + "'/]");
                            cooperatorIds.push(uid);
                        });
                        if($(self).prop('disabled'))return;
                        $(self).prop('disabled',true);
                        $.ajax({
                            method: 'post',
                            url: '../resume/createComment.json',
                            data: {
                                resumeId: itemData.id,
                                content: comment,
                                atIds: cooperatorIds.join(',')
                            }
                        }).success(function (data) {
                            $(self).prop('disabled',false);
                            if (data.state == 1) {
                                $('#commentInput').text('');
                                if (data.state == 1) {
                                    piplineRigetView.trigger('updateCommentList');
                                    if(cooperatorIds.length>0){
                                        lg.getnewGuid().getNext('AtSelfAndTransformResumeGuid','CommontHover');
                                    }
                                }
                            }
                            else {
                                var content = '';
                                if (data.state == 210)
                                    content = '内容过长';
                                else {
                                    content = '系统错误';
                                }
                                var confirm = new lg.Widgets.Controls.Confirm({
                                    content: content,
                                    submitText: "确定",
                                    SubmitBtn: function (e) {
                                        e.control.setRemove();
                                    },
                                    noCancelBtn: true
                                });
                            }
                        });
                    }
                });
                $('.commet_box').find('#cancelBtn').off('click');
                $('.commet_box').find('#cancelBtn').on('click', function (e) {
                    $('#commentInput').attr('data-cooperator-ids', '');
                    $('#commentInput').text('');
                    $('#toggle_submit_commemt').click();
                });

                $('#commentInput').attr('data-cooperator-ids', '');
                $('#commentInput').text('');
                if(!lg.Cache.has('allMembers')){
                    $.ajax({
                        url: '../member/all_members.json',
                    }).success(function (e) {
                        if (e.state == 1) {
                            lg.getpiplineRigetView().trigger('atInit',e.content.data.members);
                            var allmemberKeyValue = {};
                            for(var i= 0,len=e.content.data.members.length;i<len;i++){
                                var item = e.content.data.members[i];
                                allmemberKeyValue[item.userId]=item;
                            }
                            lg.Cache.set('allmemberKeyValue',allmemberKeyValue);
                        }
                    });
                }else{

                    lg.getpiplineRigetView().trigger('atInit',lg.Cache.get('allMembers'));
                }

                //评论数据加载
                piplineRigetView.trigger('updateCommentList',itemData);
                if ($('#toggle_submit_commemt').closest('.toggle-box').find('.toggle-box-content').is(':visible')) {
                    $('#toggle_submit_commemt').text('收起');
                } else {
                    $('#toggle_submit_commemt').text(commet_text[itemData.stage]);
                }
                //focusComment
                if(lg.has('focusComment')){
                    lg.getresumePreviewToolBar().getElement().find('.preview-toolbar-comment').trigger('click');
                    lg.del('focusComment');
                }
                $('detail-content').scrollTop(0);
                if (lg.has('writeComment')) {
                    $('[data-btn-use="writeComment"]').trigger('click');
                    lg.del('writeComment');
                    lg.UpdateUrl();
                }
                if (lg.has('openinterview')) {
                    $('[data-btn-use="reInterview"]').trigger('click');
                    lg.del('openinterview');
                    lg.UpdateUrl();
                }
            });

            //曾应聘于 初始化
            piplineRigetView.on('everPositionsShow', function (e) {
                var itemData = e;
                var everPositions = '';
                if (itemData.everPositions && itemData.everPositions.length == 1) {
                    if( itemData.everPositions[0].deliverTime ) {
                        everPositions += '（<a href="/resume/list.htm?phone=' + itemData.phone + '&email=' + itemData.email + '" target="blank">曾于' + itemData.everPositions[0].deliverTime.substr(0, 4) + '/' + itemData.everPositions[0].deliverTime.substr(4, 2) + '/' + itemData.everPositions[0].deliverTime.substr(6, 2) + '应聘过' + itemData.everPositions[0].positionName + '</a>）';
                    }
                } else if(itemData.everPositions && itemData.everPositions.length > 1) {
                    everPositions += '（<a href="/resume/list.htm?phone=' + itemData.phone + '&email=' + itemData.email + '" target="blank">曾应聘过 ' + lg.Utils.setString(itemData.everPositions[0].positionName,10) + '等' + itemData.everPositions.length + '个职位 ' + '</a>)';
                }
            });

            //相关信息 初始化
            piplineRigetView.on('relativeInformation', function (e) {
                var itemData = e;
                var content = '';
                var channelType = {
                    LOCAL:'本地人才库',
                    LAGOU:'拉勾网',
                    ZHILIN:'智联招聘',
                    JOB_51:'前程无忧',
                    LIEPIN:'猎聘网'
                }
                var StageType = {
                    INIT:'<span style="color:#0099ff;">本地人才库</span>',
                    NEW:'<span style="color:#0099ff;">新简历</span>',
                    LINK:'<span style="color:#0099ff;">待沟通</span>',
                    INTERVIEW:'<span style="color:#0099ff;">面试</span>',
                    OFFER:'<span style="color:#0099ff;">待录用</span>',
                    CHECK_IN:'<span style="color:#0099ff;">待入职</span>',
                    OBSOLETE:'<span style="color:#fd5f39;">已淘汰</span>',
                    EMPLOYED:'<span style="color:#0099ff;">已入职</span>'
                }
                if (itemData.everPositions && itemData.everPositions.length >0) {
                    for(var i= 0,len=itemData.everPositions.length;i<len;i++){
                        content+='<li>'+
                            ('<span class="delever-time">'+itemData.everPositions[i].deliverTime+'</span>')+
                            '<span>'+itemData.everPositions[i].positionName+'</span>'+
                            (StageType[itemData.everPositions[i].resumeStage])+
                            ((lg.Cache.get('allmemberKeyValue'))&&(window.CONST_VARS('user').id!=itemData.everPositions[i].resumeOwnerId)?('<span>招聘者：'+(lg.Cache.get('allmemberKeyValue')[itemData.everPositions[i].resumeOwnerId]&& lg.Cache.get('allmemberKeyValue')[itemData.everPositions[i].resumeOwnerId].name||'同事')+'</span>'+'<a target="_blank" class="check-records" href="/position/redirectOriginalPage.htm?positionId='+itemData.everPositions[i].positionId+'" >查看职位>></a>'):('<a target="_blank" class="check-records" href="../resume/'+itemData.everPositions[i].id+'.htm" >查看应聘详情 >></a>'))+
                            '</li>';
                    }
                }else{
                    content='无';
                }
                $('#resumeRalativeTab .ever-positions').show();
                $('#resumeRalativeTab .ever-positions ul').empty().append(content);

            });

            //@初始化
            piplineRigetView.on('atInit', function (e) {
                var members = e;
                members = $.map(members, function (value, i) {
                    var back = value.portrait ? '<img src="../../https@img.yingjobs.com/thumbnail_50x50/yun/' + value.portrait + '" />' : '<span class="bg_' + (value.userId % 4) + '">' + lg.Utils.splitNameStr(value.name) + '</span>';
                    return {
                        id: value.userId,
                        name: value.name,
                        photo: back,
                        email: value.email ? value.email.substring(0, value.email.indexOf('@')) : '',
                        receiveEmail: value.receiveEmail ? value.receiveEmail.substring(0, value.receiveEmail.indexOf('@')) : ''
                    }
                });
                var at_config = {
                    at: "@",
                    data: members,
                    insertTpl: '@${name}',
                    searchKey: 'name receiveEmail email',
                    displayTpl: '<li data-id="${id}" class="at_user_item">${photo}<span class="name">${name}</span></li>',
                    limit: 200,
                    callbacks: {
                        beforeInsert: function (at, el) {
                            return '<span data-item-id="' + $(el).attr('data-id') + '">' + at + '</span>';
                        }
                    }
                }
                $('#commentInput').atwho(at_config);
            });



            //操作阶段按钮
            piplineRigetView.getControl('resume_toolbar').on('enterNew', function (e) {
                leftDropDownFunction(e);
            });
            piplineRigetView.getControl('resume_toolbar').on('enterLink', function (e) {
                leftDropDownFunction(e);
            });
            piplineRigetView.getControl('resume_toolbar').on('enterInterview', function (e) {
                leftDropDownFunction(e);
            });
            piplineRigetView.getControl('resume_toolbar').on('enterOffer', function (e) {
                leftDropDownFunction(e);
            });
            piplineRigetView.getControl('resume_toolbar').on('enterCheckIn', function (e) {
                leftDropDownFunction(e);
            });
            piplineRigetView.getControl('resume_toolbar').on('enterEmploy', function (e) {
                leftDropDownFunction(e);
            });

            //过阶段时候,文案里面 阶段对应的文案
            function getStageText(stage) {
                var stageList = {
                    'NEW': '新简历',
                    'LINK': '待沟通',
                    'INTERVIEW': '面试',
                    'OFFER': '待录用',
                    'CHECK_IN': '待入职',
                    'EMPLOYED': '已入职',
                    'OBSOLETE': '淘汰'
                }
                return stageList[stage];
            }

            function leftDropDownFunction(e) {
                var that = e.data.control;
                var itemData = that.itemData;
                if (that.getIsDisabled()) {

                } else {
                    that.setDisable(true);
                    var $source = $(arguments[0].currentTarget);
                    var stage = $source.hasClass('current') ? lg.get('stage') : $source.attr('data-btn-use-stage');
                    var itemStage = that.getSubInfo(stage);
                    var options = that.getStageDropdownMenuURl($source.hasClass('current') ? itemStage.nextStage : stage);
                    if (options != 'pop') {
                        if ($source.hasClass('current') && $source.attr('data-btn-use') == 'enterNew') {
                            $.ajax({
                                url: options,
                                type: "POST",
                                data: {resumeId: itemData.id}
                            }).success(function (result) {
                                if (result.state == 1) {
                                    var confirm = new lg.Widgets.Controls.TopTips({
                                        header: itemData.candidateName + '已进入 <span style="color:#0099ff">' + getStageText(result.content.data.resumeVo.stage) + '</span> 阶段' + (lg.Utils.getLocalStorage('isAutoSwitchNext') ? '，自动为你切换至下一份简历' : '') + '。<span class="item-click">' + (lg.Utils.getLocalStorage('isAutoSwitchNext') ? '不再自动切换' : '恢复自动切换') + '。</span>',
                                        needHoverStop: true,
                                        hasNoBack: true,
                                        decoration: "left_list_toptips"
                                    });
                                    confirm.on('itemClick', function (e) {
                                        lg.Utils.setLocalStorage('isAutoSwitchNext', lg.Utils.getLocalStorage('isAutoSwitchNext') ? false : true);
                                    });
                                    $('.nav-tabs [href="#resumePreViewTab"]').trigger('click');
                                    var stageTab = new lg.Widgets.Controls.Tab({name: 'stage-tab'});
                                    stageTab.setStageNum(result.content.data.resumeVo.stage, itemData.stage);
                                    that.setStage(stage);
                                    that.init({dataSource: result.content.data.resumeVo});
                                    lg.set('stage', stage);
                                    lg.UpdateUrl();
                                    if (lg.Utils.getLocalStorage('isAutoSwitchNext')) {
                                        result.content.data.resumeVo.needNext = true;
                                    }
                                    lg.getnewGuid().getNext('MockResumeGuid','passNewHover');
                                    lg.getresume_list().updateResume(result.content.data.resumeVo);
                                    piplineRigetView.trigger('updateCommentList');
                                    that.setDisableDelay(false, 1000);
                                }else if(result.state == 1997){
                                    var confirm = new lg.Widgets.Controls.Confirm({
                                        content:'<div>页面已失效，请刷新后重试 </div>',
                                        submitText:"确定",
                                        SubmitBtn:function(e){
                                            window.location.reload();
                                            e.control.setRemove();
                                        },
                                        noCancelBtn:true
                                    });
                                }else{
                                    var confirm = new lg.Widgets.Controls.Confirm({
                                        content:'<div>系统错误，请刷新后重试 </div>',
                                        submitText:"确定",
                                        SubmitBtn:function(e){
                                            window.location.reload();
                                            e.control.setRemove();
                                        },
                                        noCancelBtn:true
                                    });
                                }
                            });
                        }
                        else{
                            $.ajax({
                                url: options,
                                type: "POST",
                                data: {resumeId: itemData.id}
                            }).success(function (result) {
                                if (result.state == 1) {
                                    var nowStage = result.content.data.resumeVo.stage;
                                    var confirm = new lg.Widgets.Controls.TopTips({
                                        header: itemData.candidateName + '已进入 <span style="color:#0099ff">' + getStageText(result.content.data.resumeVo.stage) + '</span> 阶段',
                                        hasNoBack: true,
                                        decoration: "left_list_toptips"
                                    });
                                    $('.nav-tabs [href="#resumePreViewTab"]').trigger('click');
                                    var stageTab = new lg.Widgets.Controls.Tab({name: 'stage-tab'});
                                    stageTab.setStageNum(result.content.data.resumeVo.stage, itemData.stage);
                                    that.setStage(stage);
                                    that.init({dataSource: result.content.data.resumeVo});
                                    lg.set('stage', result.content.data.resumeVo.stage);
                                    lg.UpdateUrl();
                                    lg.getresume_list().updateResume(result.content.data.resumeVo);
                                    piplineRigetView.trigger('updateCommentList');
                                    that.setDisableDelay(false, 1000);
                                }else if(result.state == 1997){
                                    var confirm = new lg.Widgets.Controls.Confirm({
                                        content:'<div>页面已失效，请刷新后重试 </div>',
                                        submitText:"确定",
                                        SubmitBtn:function(e){
                                            window.location.reload();
                                            e.control.setRemove();
                                        },
                                        noCancelBtn:true
                                    });
                                }else{
                                    var confirm = new lg.Widgets.Controls.Confirm({
                                        content:'<div>系统错误，请刷新后重试 </div>',
                                        submitText:"确定",
                                        SubmitBtn:function(e){
                                            window.location.reload();
                                            e.control.setRemove();
                                        },
                                        noCancelBtn:true
                                    });
                                }
                            });
                        }
                    } else {
                        //进入面试阶段 触发的事件
                        //以防面试弹框里面预览过 初始化面试弹框
                        $('.back-interview-btn').trigger('click');

                        //初始化面试弹框 -- 初始化面试信息
                        lg.getpiplineRigetView().trigger('setArrInterView',{control:that});
                    }
                }
            }

            // 转发简历操作  -- 初始化转发简历弹框
            piplineRigetView.getControl('resume_toolbar').on('transmitResume', function (e) {
                var that = e.data.control;
                var itemData = that.itemData;
                var title = itemData.candidateName;
                var positionName = itemData.positionName;
                $('.transmit-resume-header').html('转发简历 ' + title + '（' + positionName + '）<div style="margin-top:3px;color:#999;font-size:14px;">转发后，对方将能够查看简历收到的评论及招聘进程</div>');
                $.ajax({
                    url: '../resume/pubCode.json',
                    dataType: 'json',
                    data: {resumeId: lg.get('resumeId')},
                    cache: false
                }).success(function (result) {
                    var url = (window.location.protocol + '//' + window.location.host + '/pub/resume.htm?pubCode=' + result.content.data.pubCode);
                    $('#invite-input-url').val(url);
                });
                var that = this;
                if(!lg.Cache.has('allMembers')){
                    $.ajax({
                        url: '../member/all_members.json',
                    }).success(function (result) {
                        if (result.state == 1) {
                            lg.Cache.set('allMembers',result.content.data.members);
                            if (result.state == 1) {
                                lg.getpiplineRigetView().trigger('transmitResumeInit',result.content.data.members);
                            }
                            var allmemberKeyValue = {};
                            for(var i= 0,len=result.content.data.members.length;i<len;i++){
                                var item = result.content.data.members[i];
                                allmemberKeyValue[item.userId]=item;
                            }
                            lg.Cache.set('allmemberKeyValue',allmemberKeyValue);
                        }
                    });
                }else{
                    lg.getpiplineRigetView().trigger('transmitResumeInit',lg.Cache.get('allMembers'));
                }

            });

            // 转发简历操作  -- 初始化转发简历弹框 初始化
            piplineRigetView.on('transmitResumeInit', function (e) {
                function getFilterMembers (data){
                    var transFilterList = [];
                    for (var i = 0, len = data.length; i < len; i++) {
                        var item = {};
                        $.extend(item,data[i]);
                        transFilterList.push(item);
                        transFilterList[i].showEmail = transFilterList[i].email ? transFilterList[i].email: transFilterList[i].receiveEmail;
                        transFilterList[i].email = transFilterList[i].email ? transFilterList[i].email.substring(0, transFilterList[i].email.indexOf('@')) : transFilterList[i].email;
                        transFilterList[i].receiveEmail = transFilterList[i].receiveEmail ? transFilterList[i].receiveEmail.substring(0, transFilterList[i].receiveEmail.indexOf('@')) : transFilterList[i].receiveEmail;
                    }
                    return transFilterList;
                }
                var transFilterSelect = new lg.Widgets.Controls.FilterSelect({
                    name: 'transFilterSelect',
                    placeHolder: '查找同事',
                    key: 'name email receiveEmail',
                    dataSource: getFilterMembers(e)
                })
                var transMemberCheckBoxList = new lg.Widgets.Controls.MemberCheckBoxList({
                    name: 'transMemberCheckBoxList',
                    dataSource: [],
                    onlyShowSelected: true
                });
                transFilterSelect.getElement().parent().addClass('noselects');
                transFilterSelect.on('select', function (e) {
                    e.itemData.isChecked = true;
                    transFilterSelect.getElement().parent().removeClass('noselects');
                    transMemberCheckBoxList.addItem(e.itemData);
                });
                var invite_box = $('.invite-box');
                $(invite_box.find('.invite-email-list')[0]).siblings('.invite-email-list').remove();
                invite_box.find('.invite-email-list>input').val('').removeClass('error');
                $('#transmit-resume .modal-dialog').css('width', '764px');
                $($('#transmit-resume .modal-content')[1]).hide();
                $($('#transmit-resume .modal-content')[0]).show();
                $('#transmit-resume').off('shown.bs.modal');
                $('#transmit-resume').on('shown.bs.modal', function (e) {
                    lg.gettransFilterSelect().getElement().find('input').trigger('click')

                });
                $('#transmit-resume').modal('show');
                $('.nav-tabs [href="#invite"]').trigger('click');
                $('#tansAddInfo').val('');
            });

            //再次面试 事件
            piplineRigetView.getControl('resume_toolbar').on('reInterview', function (e) {
                var that = e.data.control;
                var itemData = that.itemData;
                $('.back-interview-btn').trigger('click');
                lg.getpiplineRigetView().trigger('setArrInterView',{control:that});

                // 如果是【再次面试】只有邀请面试的tab
                $('#arr_inerview .titles-move').addClass('moveto-style').removeClass('titles-active').hide();
                $('#arr_inerview .titles-send').addClass('titles-active');
                $('#invited-information').show();
                $('#invited-moveto-interview').hide();
                $('#arr_inerview .titles-layer').show();
                $('.titles-move-preview').removeClass('no-show');
                $('.titles-layer').hide();
                $('.titles-move-preview').hide();
            });

            //新简历阶段 待定按钮
            piplineRigetView.getControl('resume_toolbar').on('markTbd', function (e) {
                $.ajax({
                    url: 'markTbd.json',
                    data: {resumeId: lg.get('resumeId')}
                }).success(function (result) {
                    lg.getresume_list().updateResume(result.content.data.resumeVo);
                    lg.getresume_toolbar().init({dataSource: result.content.data.resumeVo});
                    $('.preview-toolbar-tbd').hide();
                    lg.getpiplineRigetView().trigger('updateCommentList');
                });
            });

            // 开启复制
            piplineRigetView.getControl('resume_toolbar').on('copyResume', function (e) {
                if(lg.getresume_list().getActiveData() && lg.getresume_list().getActiveData().doc && true){
                    lg.getresume_list().getActiveData().doc.renderTextAndLink();
                }
                $('.pip_resume_copy_switch_tips').hide();
                $('.preview-toolbar-copy').addClass('disabled-style');
            });

            piplineRigetView.on('setArrInterView', function (e) {
                var that = e.control;
                var itemData = that.itemData;
                var setArrInterViewSendNotic = new lg.Widgets.Controls.CheckBox({
                    name: 'setArrInterViewSendNotic',
                    key:'val',
                    dataSource: [{
                        text: '同时向 '+itemData.candidateName+'（'+itemData.email+'）发送通知',
                        select: true,
                        val:1
                    }]
                });
                lg.getsetArrInterViewSendNotic().trigger('select');
                lg.getsetArrInterViewSendNotic().on('select', function (e) {
                    if(e.isSelect){
                        $('.interview-preview-btn').show();
                        $('#interviewInfo').show();
                        $('.interview_Info').show();
                    }else{
                        $('.interview-preview-btn').hide();
                        $('#interviewInfo').hide();
                        $('.interview_Info').hide();
                    };
                });
                lg.getsetArrInterViewSendNotic().trigger('select',{isSelect:true});
                $('.content_position').text(itemData.positionName);
                $('.content_can_name').text(itemData.candidateName);
                if(typeof  lg.getarrInterViewAddressList == 'function'){
                    delete lg.getarrInterViewAddressList;
                }
                var arrInterViewAddressList = new lg.Widgets.Controls.InterviewInfomation({
                    name: 'arrInterViewAddressList',
                });

                arrInterViewAddressList.on('select', function (e) {
                    $('.address_select').empty();
                    var item = e.data;
                    $('.address_select').append(
                        '<li>'+
                        '<span class="name">'+item.linkMan+'</span>'+
                        '<span class="address">'+item.address+'</span>'+
                        '<span class="tel"><i class="icon-warning"></i>'+item.linkPhone+'</span>'+
                        '</li>'
                    );
                    lg.getarrInterViewAddressList().setShow(false);
                    if(lg.getarrInterViewAddressList().getLength() > 1){
                        $('.more_address').html('查看全部面试信息<i class="icon-arrow-down"></i>').show();
                        $('.address_select').show();
                        $('.more_address').off('click');
                        $('.more_address').on('click', function (e) {
                            lg.getarrInterViewAddressList().setShow(true);
                            if(lg.getarrInterViewAddressList().getLength() == 20){
                                $('.more_address').hide();
                            }else{
                                $('.more_address').html('<span style="color:#0099ff;">暂无可选，新增面试信息</span>').show();
                                $('.more_address').off('click');
                                $('.more_address').on('click', function (e) {
                                    $('.more_address').hide();
                                    $('.address-edite').show();
                                    lg.gettemplateView().setClear();
                                    lg.getarrInterViewAddressList().setShow(false);
                                    $('.address_select').hide();

                                });
                            }

                        });
                    }else{
                        $('.more_address').html('<span style="color:#0099ff;">暂无可选，新增面试信息</span>').show();
                        $('.more_address').off('click');
                        $('.more_address').on('click', function (e) {
                            $('.more_address').hide();
                            $('.address-edite').show();
                            lg.gettemplateView().setClear();
                            lg.getarrInterViewAddressList().setShow(false);
                            $('.address_select').hide();
                        });
                    }
                });
                $('.address_select').empty();
                var templateView = new lg.Views.BaseView({
                    name: 'templateView',
                    fields: [{
                        name: 'linkPhone',
                        showMessage:false,
                        validRules: [{
                            mode: 'require',
                            data: '',
                            message: '请输入联系电话',
                            trigger: 'blur'
                        }, {
                            mode: 'pattern',
                            isUse: true,
                            status: false,
                            data:{phone:/^(0|86|17951)?((13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[57])[0-9]{8})$/ ,tel:/(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^[0-9]{3,4}\-[0-9]{7,8}\-[0-9]{3,5}$)|(^[0-9]{7,8}\-[0-9]{3,5}$)|(^\([0-9]{3,4}\)[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{7,8}\-[0-9]{3,5}$)|(^1[3,4,5,7,8]{1}[0-9]{9}$)/},
                            message: '请输入有效的电话'
                        }

                        ],
                        controlType: "TextBox"
                    }, {
                        name: 'linkMan',
                        showMessage:false,
                        validRules: [{
                            mode: 'require',
                            data: '',
                            message: '请输入联系人'
                        }, {
                            mode: 'pattern',
                            data: '/^[\\S\\s]{0,16}$/',
                            message: '请输入6-16位，字母区分大小写'
                        }],
                        controlType: "TextBox"
                    }, {
                        name: 'address',
                        showMessage:false,
                        validRules: [{
                            mode: 'require',
                            data: '',
                            message: '请输入面试地点'
                        }, {
                            mode: 'pattern',
                            data: '/^[\\S\\s]{0,50}$/',
                            message: '请输入50字以内的面试地点'
                        }],
                        controlType: "TextBox"
                    }]
                });
                $('.address-edite').find('.interview-address-submit').off('click');
                $('.address-edite').find('.interview-address-submit').on('click', function (e) {
                    var phone = $('.address-edite').find('#interview-phone').val();
                    var linkMan = $('.address-edite').find('#interview-recuriterName').val();
                    var address = $('.address-edite').find('#interview-address').val();
                    var id = $('.address-edite').attr('data-templateid');
                    var url = '../settings/template/update_in_temp.json';
                    if (!id) {
                        url = '../settings/template/create_in_temp.json';
                    }
                    var html = '';
                    var params = templateView.CollectData();
                    if(params.isValidate) {
                        $.ajax({
                            url: url,
                            data: {
                                templateId: id,
                                linkPhone: phone,
                                linkMan: linkMan,
                                address: address,
                                templateName: linkMan
                            }
                        }).success(function (result) {
                            if (result.state == 1) {
                                var item = result.content.data.template;
                                $('.address-edite').hide();
                                lg.getarrInterViewAddressList().setShow(false);
                                lg.getarrInterViewAddressList().addItem(item);
                            }
                            else if (result.state == 204) {
                                alert('联系方式格式错误');
                            }
                            else {
                                alert(result.message);
                            }
                        });
                    }
                });
                $('.address-edite').find('.interview-address-cancel').off('click');
                $('.address-edite').find('.interview-address-cancel').on('click', function (e) {

                    if(lg.getarrInterViewAddressList().getLength() > 1){
                        $('.more_address').html('查看全部面试信息<i class="icon-arrow-down"></i>').show();
                        $('.address-edite').hide();
                        $('.address_select').show();
                        $('.more_address').off('click');
                        $('.more_address').on('click', function (e) {
                            lg.getarrInterViewAddressList().setShow(true);
                            if(lg.getarrInterViewAddressList().getLength() == 20){
                                $('.more_address').hide();
                            }else{
                                $('.more_address').html('<span style="color:#0099ff;">暂无可选，新增面试信息</span>').show();
                                $('.more_address').off('click');
                                $('.more_address').on('click', function (e) {
                                    $('.more_address').hide();
                                    $('.address-edite').show();
                                    lg.gettemplateView().setClear();
                                    lg.getarrInterViewAddressList().setShow(false);
                                    $('.address_select').hide();
                                });
                            }

                        });
                    }else if(lg.getarrInterViewAddressList().getLength() == 1){
                        $('.more_address').show();
                        $('.address_select').show();
                        $('.address-edite').hide();
                    }else{
                        $('.more_address').hide();
                        $('.address-edite').show();
                        lg.gettemplateView().setClear();
                    }
                });
                $.ajax({
                    url: '../settings/template/in_temp.json',
	                cache:false,
                    data: {positionId: itemData.positionId}
                }).success(function (result) {
                    if(result.state == 1){
                        $('.address_select').empty();
                        if(result.content.rows.length>0){
                            var item = result.content.rows[0];
                            $('.address_select').append(
                                '<li>'+
                                '<span class="name">'+item.linkMan+'</span>'+
                                '<span class="address">'+item.address+'</span>'+
                                '<span class="tel"><i class="icon-warning"></i>'+item.linkPhone+'</span>'+
                                '</li>'
                            );
                            if(result.content.rows.length != 1){
                                $('.more_address').html('查看全部面试信息<i class="icon-arrow-down"></i>').show();
                                $('.address_select').show();
                                $('.more_address').off('click');
                                $('.more_address').on('click', function (e) {
                                    lg.getarrInterViewAddressList().setShow(true);
                                    if(lg.getarrInterViewAddressList().getLength() == 20){
                                        $('.more_address').hide();
                                    }else{
                                        $('.more_address').html('<span style="color:#0099ff;">暂无可选，新增面试信息</span>').show();
                                        $('.more_address').off('click');
                                        $('.more_address').on('click', function (e) {
                                            $('.more_address').hide();
                                            $('.address-edite').show();
                                            lg.gettemplateView().setClear();
                                            lg.getarrInterViewAddressList().setShow(false);
                                            $('.address_select').hide();
                                        });
                                    }
                                });
                            }else{
                                $('.more_address').html('<span style="color:#0099ff;">暂无可选，新增面试信息</span>').show();
                                $('.address_select').show();
                                $('.more_address').show();
                                $('.more_address').off('click');
                                $('.more_address').on('click', function (e) {
                                    $('.more_address').hide();
                                    $('.address-edite').show();
                                    lg.gettemplateView().setClear();
                                    lg.getarrInterViewAddressList().setShow(false);
                                    $('.address_select').hide();
                                });
                            }
                            result.content.rows.length > 1?$('.more_address').html('查看全部面试信息<i class="icon-arrow-down"></i>').show():$('.more_address').html('<span style="color:#0099ff;">暂无可选，新增面试信息</span>').show();//$('.more_address').html('暂无可选，新增面试信息').show()
                            result.content.rows[0].isSelect = true;
                            lg.getarrInterViewAddressList().setDataSource(result.content.rows);

                            lg.getarrInterViewAddressList().setShow(false);
                        }else{
                            $('.more_address').hide();
                            lg.getarrInterViewAddressList().setShow(false);
                            $('.address-edite').show();
                            $('.address_select').show();
                            lg.gettemplateView().setClear();
                        }
                        lg.getarrInterViewAddressList().getElement().niceScroll({
                            'cursorborder': 'none',
                            cursorcolor: '#aeb1b3',
                            'cursorwidth': '6px',
                            'scrollspeed': '6',
                            cursoropacitymax: 0.8
                        });
                    }else{
                        var confirm = new lg.Widgets.Controls.Confirm({
                            content:'<div>页面已失效，请刷新后重试('+result.state+') </div>',
                            submitText:"确定",
                            SubmitBtn:function(e){
                                window.location.reload();
                                e.control.setRemove();
                            },
                            noCancelBtn:true
                        });
                    }


                }).fail(function () {
                    var confirm = new lg.Widgets.Controls.Confirm({
                        content:'<div>页面已失效，请刷新后重试(500) </div>',
                        submitText:"确定",
                        SubmitBtn:function(e){
                            window.location.reload();
                            e.control.setRemove();
                        },
                        noCancelBtn:true
                    });
                    $(self).prop('disabled',false);
                });
                var positionEmailList = lg.Utils.getLocalStorage('positionEmailList');
                $('#arr_inerview').find('[data-view="inviteEmailPhone"]').find('[data-propertyname]').remove();
                if(positionEmailList && positionEmailList[itemData.positionId]&&positionEmailList[itemData.positionId].length>0){
                    for(var i= 0,len=positionEmailList[itemData.positionId].length;i<len;i++){
                        var listData = positionEmailList[itemData.positionId];
                        $('#interview-email-phone-add').trigger('click');
                        lg['getinviteEmailFilterSelect'+(i+1)]().setValue(listData.forwardEmails?listData.forwardEmails.split(',')[i]:'');
                        lg['getinvitePhone'+(i+1)]().setValue(listData.forwardPhones?listData.forwardPhones.split(',')[i]:'');
                    }
                }else{
                    $('#interview-email-phone-add').trigger('click');
                    $('#interview-email-phone-add').trigger('click');
                }
                var positionAddInfoList = lg.Utils.getLocalStorage('positionAddInfoList');
                if(positionAddInfoList && positionAddInfoList[itemData.positionId]&&positionAddInfoList[itemData.positionId].length>0){
                    $('#arr_inerview #addInfo').val(positionAddInfoList[itemData.positionId]);
                }else{
                    $('#arr_inerview #addInfo').val('');
                }
                //显示面试弹窗
                //是否显示移动到面试
                if(itemData.haveInterview){
                    $('#arr_inerview .titles-send').removeClass('titles-active');
                    $('#arr_inerview .titles-move').removeClass('moveto-style').addClass('titles-active').show();
                    $('#invited-information').hide();
                    $('#invited-moveto-interview').show();
                    $('#arr_inerview .titles-layer').hide();
                    $('.titles-move-preview').removeClass('no-show');
                }else{
                    $('#arr_inerview .titles-move').addClass('moveto-style').removeClass('titles-active').show();
                    $('#arr_inerview .titles-send').addClass('titles-active');
                    $('#invited-information').show();
                    $('#invited-moveto-interview').hide();
                    $('#arr_inerview .titles-layer').show();
                    $('.titles-move-preview').addClass('no-show');
                }
                $('#arr_inerview').modal('show');
                $('#arr_inerview').on('hidden.bs.modal', function (e) {
                    lg.getresume_toolbar().setDisableDelay(false, 1000);
                })
            });

            /*格式化日期*/
            function formatDate(strTime, defaultValue) {
                if (strTime == undefined || strTime == null || strTime == '') {
                    if (defaultValue == undefined) {
                        return '未知';
                    }
                    return defaultValue;
                }
                var date = new Date(strTime.replace(/-/g, '/'));
                var year = date.getFullYear();
                var month = ((date.getMonth() + 1) <= 9) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
                var day = ((date.getDate()) <= 9) ? '0' + (date.getDate()) : (date.getDate());
                var hour = ((date.getHours()) <= 9) ? '0' + (date.getHours()) : (date.getHours());
                var minute = ((date.getMinutes()) <= 9) ? '0' + (date.getMinutes()) : (date.getMinutes());
                return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
            }

            //修改面试时间
            piplineRigetView.getControl('resume_toolbar').on('editeInterviewTime', function (e) {
                var that = e.data.control;
                var itemData = that.itemData;
                var confirm = new lg.Widgets.Controls.Confirm({
                    header: '当前面试时间',
                    content: '<div class="datetimeText"><span>' + formatDate(itemData.interviewTime) + '</span><span class="edite">修改</span></div><div class="editeBox" style="display:none;width:auto;margin: 0px 0 15px 0;"><input type="text" class="input" id="editeInterViewTime" readonly = "readonly"></div><div style="color:#999;margin-top: 10px;">修改后将向候选人发送通知</div>',
                    submitText: "确定",
                    cancelText: "取消",
                    decoration: "date_change",
                    SubmitBtn: function (e) {
                        var interViewTime = $('#editeInterViewTime').val().replace(/\//g, '-');
                        if (itemData.interviewTime != $('#editeInterViewTime').val() && $('#editeInterViewTime').val()) {
                            $.ajax({
                                url: 'set_interview_time.json',
                                dataType: 'json',
                                data: {
                                    resumeId: itemData.id,
                                    interviewTimeStr: interViewTime+':00',
                                    interviewTime: new Date(interViewTime.replace(/-/g, '/')).getTime()
                                },
                                type: 'POST',
                                cache: false
                            }).done(function (result) {
                                if (result.state == 1) {
                                    lg.getpiplineRigetView().trigger('updateNumbers');
                                    that.init({dataSource: result.content.data.resumeVo});
                                    lg.getresume_list().updateResume(result.content.data.resumeVo);
                                    e.control.setRemove();
                                    piplineRigetView.trigger('updateCommentList');
                                }
                            });
                        } else {
                            e.control.setRemove();
                        }

                    },
                    CancelBtn: function (e) {
                    }
                });
                confirm.getElement().find('.edite').on('click', function (e) {
                    confirm.getElement().find('.datetimeText').hide();
                    confirm.getElement().find('.editeBox').show();
                    confirm.getElement().find('#editeInterViewTime').datetimepicker({
                        step: 30,
                        fixed: true,
                        allowTimes: [
                            '07:00',
                            '07:30',
                            '08:00',
                            '08:30',
                            '09:00',
                            '09:30',
                            '10:00',
                            '10:30',
                            '11:00',
                            '11:30',
                            '12:00',
                            '12:30',
                            '13:00',
                            '13:30',
                            '14:00',
                            '14:30',
                            '15:00',
                            '15:30',
                            '16:00',
                            '16:30',
                            '17:00',
                            '17:30',
                            '18:00',
                            '18:30',
                            '19:00',
                            '19:30',
                            '20:00',
                            '20:30',
                            '21:00',
                            '21:30',
                            '22:00',
                            '22:30',
                            '23:00',
                            '23:30'
                        ]
                    });

                    confirm.getElement().find('#editeInterViewTime').val(formatDate(itemData.interviewTime, ''));
                    confirm.getElement().find('#editeInterViewTime').trigger('focus');
                });
            });

            //offer已发出 按钮
            piplineRigetView.getControl('resume_toolbar').on('offerSended', function (e) {

                var that = e.data.control;
                $.ajax({
                    url: 'send_offer.json',
                    data: {resumeId: lg.get('resumeId')},
                    type: 'POST'
                }).success(function (result) {
                    if (result.state == 1) {
                        lg.getpiplineRigetView().trigger('updateNumbers');
                        that.init({dataSource: result.content.data.resumeVo});
                        lg.getresume_list().updateResume(result.content.data.resumeVo);
                        var num = lg.getofferWait().getElement().text();
                        lg.getofferWait().getElement().text(parseInt(num) - 1);
                        piplineRigetView.trigger('updateCommentList');
                    }
                });
            });

            //放弃Offer
            piplineRigetView.getControl('resume_toolbar').on('abandonOffer', function (e) {
                var out = this;
                var that = e.data.control;
                var itemData = that.itemData;
                if (that.getIsDisabled()) {

                } else {
                    $('.lg-confirm').addClass('pipline-confirm');
                    var confirm = new lg.Widgets.Controls.Confirm({
                        content: '淘汰后，' + itemData.candidateName + '  将移入简历库，不会向对方发送通知，是否确认淘汰？',
                        submitText: "确认，淘汰Ta",
                        cancelText: "取消",
                        SubmitBtn: function (e) {
                            $.ajax({
                                url: 'obsolete.json',
                                dataType: 'json',
                                data: {resumeId: itemData.id},
                                type: 'POST',
                                cache: false
                            }).done(function (result) {
                                if (result.state == 1) {
                                    var stageTab = new lg.Widgets.Controls.Tab({name: 'stage-tab'});
                                    stageTab.setStageNum(result.content.data.resumeVo.stage, itemData.stage);
                                    that.init({dataSource: result.content.data.resumeVo});
                                    lg.getresume_list().updateResume(result.content.data.resumeVo);
                                    var confirm = new lg.Widgets.Controls.TopTips({
                                        header: !lg.Utils.isNullObject(lg.getresume_list().dataList) ? '淘汰成功' : '淘汰成功，已为你切换至下一份简历',
                                        hasNoBack: true,
                                        decoration: "left_list_toptips"
                                    });
                                    e.control.setRemove();
                                    //数字
                                    $.ajax({
                                        url: 'count.json',
                                        data: {stage: lg.get('stage'), positionId: lg.get('positionId')}
                                    }).success(function (result) {
                                        if (result.state == 1) {
                                            for (var item in result.content.data) {
                                                if (typeof result.content.data[item] == 'number')
                                                    $('[data-propertyname="' + item + '"]').text(result.content.data[item]);
                                            }
                                        }
                                    });
                                    piplineRigetView.trigger('updateCommentList');

                                }else if(result.state == 1997){
                                    var confirm = new lg.Widgets.Controls.Confirm({
                                        content:'<div>页面已失效，请刷新后重试 </div>',
                                        submitText:"确定",
                                        SubmitBtn:function(e){
                                            window.location.reload();
                                            e.control.setRemove();
                                        },
                                        noCancelBtn:true
                                    });
                                }
                            });
                        },
                        CancelBtn: function (e) {
                        }
                    });

                }
            });

            //放鸽子
            piplineRigetView.getControl('resume_toolbar').on('reportBreak', function (e) {
                var out = this;
                var that = e.data.control;
                var itemData = that.itemData;
                if (that.getIsDisabled()) {

                } else {
                    var confirm = new lg.Widgets.Controls.Confirm({
                        content: '<h3 style="text-align: center; font-weight: bold; margin-top: 0;">投诉并淘汰候选人</h3><div style="margin: 0 14px;">候选人不会收到任何通知，但会向其他企业展示Ta的诚信记录，是否确认投诉？</div><div style="margin: 14px 14px 0 14px">投诉理由：候选人放鸽子</div>',
                        submitText: "投诉并淘汰",
                        cancelText: "取消",
                        SubmitBtn: function (e) {
                            $.ajax({
                                url: 'report.json',
                                dataType: 'json',
                                data: {resumeId: itemData.id, type: 1},
                                type: 'POST',
                                cache: false
                            }).done(function (result) {
                                if (result.state == 1) {
                                    $.ajax({
                                        url: 'add_tag.json',
                                        data: {resumeId: itemData.id, tag: '放鸽子'},
                                        type: "POST"
                                    }).success(function (result) {
                                        if (result.state == 1) {
                                            lg.getuserInfo().setTags(result.content.rows);
                                            if (typeof lg.getpiplineLeftView != 'undefined') {
                                                lg.getpiplineLeftView().field['resume_list'].dataList[itemData.id].tags = result.content.rows;
                                            }
                                        }
                                        lg.getpiplineRigetView().trigger('updateCommentList');
                                    });

                                    e.control.setRemove();
                                    //数字
                                    $.ajax({
                                        url: 'count.json',
                                        data: {stage: lg.get('stage'), positionId: lg.get('positionId')}
                                    }).success(function (result) {
                                        if (result.state == 1) {
                                            for (var item in result.content.data) {
                                                if (typeof result.content.data[item] == 'number')
                                                    $('[data-propertyname="' + item + '"]').text(result.content.data[item]);
                                            }
                                        }
                                    });


                                }
                            });

                            var data = {};
                            data.reason = '放鸽子';
                            data.content = '经过我们评估，认为您与该职位不太合适，无法通过面试阶段。相信更好的机会一定还在翘首期盼着您，赶快调整心态，做好充足的准备重新出发吧！';
                            data.resumeId = lg.get('resumeId');
                            data.needNotice = false; // 这个参数控制的是是否发邮件通知，需求改为都不发邮件，传不传这个参数都将不再发送邮件
                            $.ajax({
                                url: 'obsolete.json',
                                data: data
                            }).success(function (result) {
                                if(result.state == 1){
                                    var itemData = lg.Cache.Views.piplineLeftView.field['resume_list'].getActiveData();
                                    var stageTab = new lg.Widgets.Controls.Tab({name: 'stage-tab'});
                                    stageTab.setStageNum(result.content.data.resumeVo.stage, itemData.stage);
                                    lg.getpiplineRigetView().getControl('resume_toolbar').init({dataSource: result.content.data.resumeVo});
                                    lg.getresume_list().updateResume(result.content.data.resumeVo);
                                    lg.getpiplineRigetView().trigger('updateCommentList');
                                    lg.getpiplineRigetView().trigger('updateNumbers');
                                    var confirm = new lg.Widgets.Controls.TopTips({
                                        header: !lg.Utils.isNullObject(lg.getresume_list().dataList) ? '淘汰成功' : '淘汰成功，已为你切换至下一份简历',
                                        hasNoBack: true,
                                        decoration: "left_list_toptips"
                                    });
                                    e.control.setRemove();
                                }else if(result.state == 1997){
                                    var confirm = new lg.Widgets.Controls.Confirm({
                                        content:'<div>页面已失效，请刷新后重试 </div>',
                                        submitText:"确定",
                                        SubmitBtn:function(e){
                                            window.location.reload();
                                            e.control.setRemove();
                                        },
                                        noCancelBtn:true
                                    });
                                }

                            });
                        },
                        CancelBtn: function (e) {
                        }
                    });

                }
            });

            //简历造假
            piplineRigetView.getControl('resume_toolbar').on('resumeForge', function (e) {
                var out = this;
                var that = e.data.control;
                var itemData = that.itemData;
                if (that.getIsDisabled()) {

                } else {
                    var confirm = new lg.Widgets.Controls.Confirm({
                        content: '<h3 style="text-align: center; font-weight: bold; margin-top: 0;">投诉并淘汰候选人</h3><div style="margin: 0 14px;">候选人不会收到任何通知，但会向其他企业展示Ta的诚信记录，是否确认投诉？</div><div style="margin: 14px 14px 0 14px">投诉理由：候选人简历造假</div>',
                        submitText: "投诉并淘汰",
                        cancelText: "取消",
                        SubmitBtn: function (e) {
                            $.ajax({
                                url: 'report.json',
                                dataType: 'json',
                                data: {resumeId: itemData.id, type: 2},
                                type: 'POST',
                                cache: false
                            }).done(function (result) {
                                if (result.state == 1) {
                                    $.ajax({
                                        url: 'add_tag.json',
                                        data: {resumeId: itemData.id, tag: '简历造假'},
                                        type: "POST"
                                    }).success(function (result) {
                                        if (result.state == 1) {
                                            lg.getuserInfo().setTags(result.content.rows);
                                            if (typeof lg.getpiplineLeftView != 'undefined') {
                                                lg.getpiplineLeftView().field['resume_list'].dataList[itemData.id].tags = result.content.rows;
                                            }

                                        }
                                        lg.getpiplineRigetView().trigger('updateCommentList');
                                    });

                                    e.control.setRemove();
                                    //数字
                                    $.ajax({
                                        url: 'count.json',
                                        data: {stage: lg.get('stage'), positionId: lg.get('positionId')}
                                    }).success(function (result) {
                                        if (result.state == 1) {
                                            for (var item in result.content.data) {
                                                if (typeof result.content.data[item] == 'number')
                                                    $('[data-propertyname="' + item + '"]').text(result.content.data[item]);
                                            }
                                        }
                                    });
                                }
                            });
                                var data = {};
                                data.reason = '简历造假';
                                data.content = '经过我们评估，认为您与该职位不太合适，无法通过面试阶段。相信更好的机会一定还在翘首期盼着您，赶快调整心态，做好充足的准备重新出发吧！';
                                data.resumeId = lg.get('resumeId');
                                data.needNotice = false; // 这个参数控制的是是否发邮件通知，需求改为都不发邮件，传不传这个参数都将不再发送邮件
                                $.ajax({
                                    url: 'obsolete.json',
                                    data: data
                                }).success(function (result) {
                                    if(result.state == 1) {
                                        var itemData = lg.Cache.Views.piplineLeftView.field['resume_list'].getActiveData();
                                        var stageTab = new lg.Widgets.Controls.Tab({name: 'stage-tab'});
                                        stageTab.setStageNum(result.content.data.resumeVo.stage, itemData.stage);
                                        lg.getpiplineRigetView().getControl('resume_toolbar').init({dataSource: result.content.data.resumeVo});
                                        lg.getresume_list().updateResume(result.content.data.resumeVo);
                                        lg.getpiplineRigetView().trigger('updateCommentList');
                                        lg.getpiplineRigetView().trigger('updateNumbers');
                                        var confirm = new lg.Widgets.Controls.TopTips({
                                            header: !lg.Utils.isNullObject(lg.getresume_list().dataList) ? '淘汰成功' : '淘汰成功，已为你切换至下一份简历',
                                            hasNoBack: true,
                                            decoration: "left_list_toptips"
                                        });
                                        e.control.setRemove();
                                    }else if(result.state == 1997){
                                        var confirm = new lg.Widgets.Controls.Confirm({
                                            content:'<div>页面已失效，请刷新后重试 </div>',
                                            submitText:"确定",
                                            SubmitBtn:function(e){
                                                window.location.reload();
                                                e.control.setRemove();
                                            },
                                            noCancelBtn:true
                                        });
                                    }
                                });
                            // }
                        },
                        CancelBtn: function (e) {
                        }
                    });

                }
            });

            //修改入职时间
            piplineRigetView.getControl('resume_toolbar').on('editeEmployTime', function (e) {
                var that = e.data.control;
                var itemData = that.itemData;
                var confirm = new lg.Widgets.Controls.Confirm({
                    header: '当前入职时间',
                    content: '<div class="datetimeText"><span>' + formatDate(itemData.entryTime, '未填写入职时间') + '</span><span class="edite">修改</span></div><div class="editeBox" style="display:none;width:auto;margin:0"><input type="text" class="input" id="editeEmployTime" placeholder="未填写入职时间" readonly = "readonly"></div>',
                    submitText: "确定",
                    cancelText: "取消",
                    decoration: "date_change",
                    SubmitBtn: function (e) {
                        var entryTime = $('#editeEmployTime').val().replace(/\//g, '-');
                        if (itemData.entryTime != entryTime && $('#editeEmployTime').val()) {
                            $.ajax({
                                url: 'set_entry_time.json',
                                dataType: 'json',
                                data: {
                                    resumeId: itemData.id,
                                    entryTime: new Date(entryTime.replace(/-/g, '/')).toUTCString()
                                },
                                type: 'POST',
                                cache: false
                            }).done(function (result) {
                                if (result.state == 1) {
                                    that.init({dataSource: result.content.data.resumeVo});
                                    lg.getresume_list().updateResume(result.content.data.resumeVo);
                                    e.control.setRemove();
                                    piplineRigetView.trigger('updateCommentList');

                                }
                            });
                        } else {
                            e.control.setRemove();
                        }

                    },
                    CancelBtn: function (e) {
                    }
                });
                confirm.getElement().find('.edite').on('click', function (e) {
                    confirm.getElement().find('.datetimeText').hide();
                    confirm.getElement().find('.editeBox').show();
                    confirm.getElement().find('#editeEmployTime').datetimepicker({
                        step: 30,
                        fixed: true,
                        allowTimes: [
                            '07:00',
                            '07:30',
                            '08:00',
                            '08:30',
                            '09:00',
                            '09:30',
                            '10:00',
                            '10:30',
                            '11:00',
                            '11:30',
                            '12:00',
                            '12:30',
                            '13:00',
                            '13:30',
                            '14:00',
                            '14:30',
                            '15:00',
                            '15:30',
                            '16:00',
                            '16:30',
                            '17:00',
                            '17:30',
                            '18:00',
                            '18:30',
                            '19:00',
                            '19:30',
                            '20:00',
                            '20:30',
                            '21:00',
                            '21:30',
                            '22:00',
                            '22:30',
                            '23:00',
                            '23:30'
                        ]
                    });
                    confirm.getElement().find('#editeEmployTime').val(formatDate(itemData.entryTime, ''));
                    confirm.getElement().find('#editeEmployTime').trigger('focus');
                });
            });

            //未入职
            piplineRigetView.getControl('resume_toolbar').on('outEmploy', function (e) {
                var out = this;
                var that = e.data.control;
                var itemData = that.itemData;
                if (that.getIsDisabled()) {

                } else {
                    //that.setDisable(true);
                    var self = this;
                    $('.lg-confirm').addClass('pipline-confirm');
                    var confirm = new lg.Widgets.Controls.Confirm({
                        content: '淘汰后，' + itemData.candidateName + '  将移入简历库，不会向对方发送通知，是否确认淘汰？',
                        submitText: "确认，淘汰Ta",
                        cancelText: "取消",
                        SubmitBtn: function (e) {
                            $.ajax({
                                url: 'obsolete.json',
                                dataType: 'json',
                                data: {resumeId: itemData.id},
                                type: 'POST',
                                cache: false
                            }).done(function (result) {
                                if (result.state == 1) {
                                    $(self).html('<i class="icon-knock-out"></i> 已淘汰');
                                    var stageTab = new lg.Widgets.Controls.Tab({name: 'stage-tab'});
                                    stageTab.setStageNum(result.content.data.resumeVo.stage, itemData.stage);
                                    that.init({dataSource: result.content.data.resumeVo});
                                    lg.getresume_list().updateResume(result.content.data.resumeVo);
                                    var confirm = new lg.Widgets.Controls.TopTips({
                                        header: !lg.Utils.isNullObject(lg.getresume_list().dataList) ? '淘汰成功' : '淘汰成功，已为你切换至下一份简历',
                                        hasNoBack: true,
                                        decoration: "left_list_toptips"
                                    });
                                    e.control.setRemove();
                                    //数字
                                    $.ajax({
                                        url: 'count.json',
                                        data: {stage: lg.get('stage'), positionId: lg.get('positionId')}
                                    }).success(function (result) {
                                        if (result.state == 1) {
                                            for (var item in result.content.data) {
                                                if (typeof result.content.data[item] == 'number')
                                                    $('[data-propertyname="' + item + '"]').text(result.content.data[item]);
                                            }
                                        }
                                    });
                                    piplineRigetView.trigger('updateCommentList');

                                }else if(result.state == 1997){
                                    var confirm = new lg.Widgets.Controls.Confirm({
                                        content:'<div>页面已失效，请刷新后重试 </div>',
                                        submitText:"确定",
                                        SubmitBtn:function(e){
                                            window.location.reload();
                                            e.control.setRemove();
                                        },
                                        noCancelBtn:true
                                    });
                                }
                            });
                        },
                        CancelBtn: function (e) {
                        }
                    });

                }
            });
            function chechboxInit() {

            }
            //淘汰
            piplineRigetView.getControl('resume_toolbar').on('outResume', function (e) {
                var out = this;
                var that = e.data.control;
                var itemData = that.itemData;
                var stage = lg.get('stage');

                $("#outResume .outResumeRadio").show();
                $("#outResume .otherOutResumeRadio").hide();
                if (that.getIsDisabled()) {
                    return;
                } else {
                    var tags = new lg.Widgets.Controls.Tags({
                        name:'tagsList',
                        dataSource:itemData
                    });
                    if(stage=='CHECK_IN'||stage=='OFFER'){
                        // "待入职"阶段，或者“待录用”阶段
                        var self = this;
                        $(".update-out-template").hide();
                        $(".update-radio").hide();
                        var othersOptions = [{
                            text: '接受其他Offer',
                            select: true
                        }, {
                            text: '角色/职责不符'
                        }, {
                            text: '内部升职/转岗'
                        }, {
                            text: '薪资不满意'
                        }, {
                            text: '工作地点'
                        }, {
                            text: '其它'
                        }
                        ];
                        var outResumeAddTagCheckBox = new lg.Widgets.Controls.CheckBox({
                            name: 'outResumeAddTagCheckBox',
                            key:'val',
                            class:'add_tags_checkbox',
                            dataSource: [{
                                text: '将 '+itemData.candidateName+' 加入人才储备',
                                val:1
                            }]
                        });
                        var outResumeRadio = new lg.Widgets.Controls.Radio({
                            name: 'outResumeRadio',
                            dataSource: (othersOptions)
                        });
                    }else{
                            piplineRigetView.getControl('resume_toolbar').trigger('outResumeTemplateAjax',{itemData:itemData});
                    }


                    if( stage=="NEW" || stage=="LINK" || stage == 'INTERVIEW' ) {
                        // "新简历"、“待沟通”、 “面试”阶段
                        if (stage == 'INTERVIEW') {
                            $('#outResume').find('.sub-description').css({
                                'border-bottom': 'none',
                                'margin-bottom': '0',
                                'padding-bottom': '0',
                                'margin-top': '10px'
                            });
                        }

                        $.ajax({url:'canSendRefuse.json',
                            data:{resumeId:lg.get('resumeId')}
                        }).success(function (result) {
                            if(result.state==1){
                                var emailSendChannel = result.content.data.emailSendChannel;
                                if (emailSendChannel == "NONE") {
                                    // 无勾选发邮件按钮
                                    showoutResumePop(false);
                                } else {
                                    // 可勾选发邮件
                                    showoutResumePop(true);
                                }

                            }else if(result.state == 1997){
                                var confirm = new lg.Widgets.Controls.Confirm({
                                    content:'<div>页面已失效，请刷新后重试 </div>',
                                    submitText:"确定",
                                    SubmitBtn:function(e){
                                        window.location.reload();
                                        e.control.setRemove();
                                    },
                                    noCancelBtn:true
                                });
                            }else{
                                var confirm = new lg.Widgets.Controls.Confirm({
                                    content:'<div>页面已失效，请刷新后重试(500) </div>',
                                    submitText:"确定",
                                    SubmitBtn:function(e){
                                        window.location.reload();
                                        e.control.setRemove();
                                    },
                                    noCancelBtn:true
                                });
                            }
                        }).fail(function () {
                            var confirm = new lg.Widgets.Controls.Confirm({
                                content:'<div>页面已失效，请刷新后重试(500) </div>',
                                submitText:"确定",
                                SubmitBtn:function(e){
                                    window.location.reload();
                                    e.control.setRemove();
                                },
                                noCancelBtn:true
                            });
                        });
                    } else {
                        //其他阶段 包括CHECK_IN、OFFER等，强制不发邮件
                        showoutResumePop(false);
                    }



                }


                /**
                 * [showoutResumePop description]
                 * @param  {boolean} canSendEmail 是否可以发送邮件，涉及相应按钮和文案的显隐
                 * @return {[type]}              [description]
                 */
                function showoutResumePop(canSendEmail) {
                    var outResumeSendNotice, outResumeComment, outResumeShowExplain;
                    if (canSendEmail) {
                        // 有可勾选发送邮件按钮
                        outResumeSendNotice = new lg.Widgets.Controls.CheckBox({
                            name: 'outResumeSendNotice',
                            key:'val',
                            class:'send_notice_checkbox',
                            dataSource: [{
                                text: '向' + itemData.candidateName + (itemData.email ? ('('+ itemData.email + ')') : '') + '发送通知，并填写解释说明',
                                select: true,
                                val:1
                            }]
                        });

                        outResumeComment = new lg.Widgets.Controls.CheckBox({
                            name: 'outResumeComment',
                            key:'val',
                            class:'show_comment_checkbox',
                            dataSource: [{
                                text: '将解释说明发送至简历评价，便于其他同事查看',
                                // select: true,
                                val:1
                            }]
                        });
                        outResumeSendNotice.on('select', function (e) {
                            if(e.isSelect){
                                $('#outResume .preview_edite').show();
                                $('#outResume .preview_title').show();
                                lg.getoutResumeComment()._element.show();

                            }else{
                                $('#outResume .preview_edite').hide();
                                $('#outResume .preview_title').hide();
                                lg.getoutResumeComment()._element.hide();
                                lg.getoutResumeComment().setSelectByValue(1,true);

                            }
                        });
                        lg.getoutResumeSendNotice()._element.show();
                        lg.getoutResumeComment()._element.show();
                        if (lg.getoutResumeShowExplain) {
                            lg.getoutResumeShowExplain().setSelectByValue(1,true);
                            lg.getoutResumeShowExplain()._element.hide();
                        }
                        $('#outResume .preview_edite').show();
                        $('#outResume .preview_title').show();
                        $('.submit-label').hide();

                    } else {
                        // 无可勾选发送邮件按钮
                        outResumeShowExplain = new lg.Widgets.Controls.CheckBox({
                            name: 'outResumeShowExplain',
                            key:'val',
                            class:'show_explain_checkbox',
                            dataSource: [{
                                text: '填写说明，并发送至简历评价，便于其他同事查看',
                                val:1
                            }]
                        });
                        outResumeComment = new lg.Widgets.Controls.CheckBox({
                            name: 'outResumeComment',
                            key:'val',
                            class:'show_comment_checkbox',
                            dataSource: [{
                                text: '将解释说明发送至简历评价，便于其他同事查看',
                                val:1
                            }]
                        });
                        outResumeShowExplain.on('select', function (e) {
                            if(e.isSelect){
                                $('#outResume .preview_edite').show();
                                $('#outResume .preview_title').show();
                                $('#outResume .radio-list').css('margin-bottom','10px');
                                lg.getoutResumeComment().setSelectByValue(1);
                            }else{
                                $('#outResume .preview_edite').hide();
                                $('#outResume .preview_title').hide();
                                $('#outResume .radio-list').css('margin-bottom','20px');
                                lg.getoutResumeComment().setSelectByValue(1,true);
                            }
                        });
                        if (lg.getoutResumeSendNotice) {
                            //状态切换时要重置发邮件的勾选按钮
                            lg.getoutResumeSendNotice().setSelectByValue(1,true);
                            lg.getoutResumeSendNotice()._element.hide();
                        }

                        lg.getoutResumeShowExplain().setSelectByValue(1,true);
                        lg.getoutResumeShowExplain()._element.show();
                        lg.getoutResumeComment()._element.hide();
                        $('#outResume .preview_edite').hide();
                        $('#outResume .preview_title').hide();
                        $(".update-out-template").hide();
                        $('.submit-label').text('不会向候选人发送通知，但此操作无法撤销，是否确认？').show();
                    }

                    $('#outResume').modal('show');

                }


            });


            //模板ajax请求
            piplineRigetView.getControl('resume_toolbar').on('outResumeTemplateAjax', function (e) {
                var itemData = e.itemData;
                $.ajax({
                    url:"../settings/template/refuse_temp.json"
                }).success(function (data) {
                    if(data.state == 1){
                        var Options = data.content.rows.map(function (i,index) {
                            var item = {
                                text: i.templateName,
                                id: i.id,
                                content: i.content
                            };
                            return item;
                        });
                        var self = this;
                        var outResumeAddTagCheckBox = new lg.Widgets.Controls.CheckBox({
                            name: 'outResumeAddTagCheckBox',
                            key:'val',
                            class:'add_tags_checkbox',
                            dataSource: [{
                                text: '将 '+itemData.candidateName+' 加入人才储备',
                                val:1
                            }]
                        });
                        var outResumeRadio = new lg.Widgets.Controls.Radio({
                            name: 'outResumeRadio',
                            dataSource: (Options)
                        });
                        var str = '\r\n' + '——' + (lg.Cache.has('MyCompany') && lg.Cache.get('MyCompany').shortName ? lg.Cache.get('MyCompany').shortName : $('#UserConpany').val()) + (lg.Cache.get('MyInfo').title ? lg.Cache.get('MyInfo').title : '') + ' ' + $('#hrName4JD').val();
                        outResumeRadio.on('select', function (e) {
                            $('#outresumeContent').val(e.content + str);
                        });
                        if (lg.get('stage') == 'INTERVIEW') {
                            outResumeRadio.setValue(lg.Utils.getLocalStorage('outResumeInterviewStoreId')||Options[5].text);
                        }else{
                            outResumeRadio.setValue(lg.Utils.getLocalStorage('outResumeStoreId')||Options[0].text);
                        }
                    }else if(data.state == 1997){
                        var confirm = new lg.Widgets.Controls.Confirm({
                            content:'<div>页面已失效，请刷新后重试 </div>',
                            submitText:"确定",
                            SubmitBtn:function(e){
                                window.location.reload();
                                e.control.setRemove();
                            },
                            noCancelBtn:true
                        });
                    }else{
                        var confirm = new lg.Widgets.Controls.Confirm({
                            content:'<div>页面已失效，请刷新后重试('+data.state+') </div>',
                            submitText:"确定",
                            SubmitBtn:function(e){
                                window.location.reload();
                                e.control.setRemove();
                            },
                            noCancelBtn:true
                        });
                    }
                }).fail(function () {
                    var confirm = new lg.Widgets.Controls.Confirm({
                        content:'<div>页面已失效，请刷新后重试(500) </div>',
                        submitText:"确定",
                        SubmitBtn:function(e){
                            window.location.reload();
                            e.control.setRemove();
                        },
                        noCancelBtn:true
                    });
                });;
            });

            //未接通
            piplineRigetView.getControl('resume_toolbar').on('unLink', function (e) {
                var that = e.data.control;
                $.ajax({
                    url: 'link_later.json',
                    data: {resumeId: lg.get('resumeId')},
                    type: 'POST'
                }).success(function (result) {
                    if (result.state == 1) {
                        lg.getpiplineRigetView().trigger('updateNumbers');
                        that.init({dataSource: result.content.data.resumeVo});
                        lg.getresume_list().updateResume(result.content.data.resumeVo);
                        piplineRigetView.trigger('updateCommentList');

                    }
                });
            });

            //待约面试
            piplineRigetView.getControl('resume_toolbar').on('arrangeInterviewWait', function (e) {
                var that = e.data.control;
                $.ajax({
                    url: 'arr_interview_wait.json',
                    data: {resumeId: lg.get('resumeId')},
                    type: 'POST'
                }).success(function (result) {
                    if (result.state == 1) {
                        lg.getpiplineRigetView().trigger('updateNumbers');
                        that.init({dataSource: result.content.data.resumeVo});
                        lg.getresume_list().updateResume(result.content.data.resumeVo);
                        piplineRigetView.trigger('updateCommentList');

                    }
                });
            });

            //标记为备选待定
            piplineRigetView.getControl('resume_toolbar').on('decideLater', function (e) {

                var that = e.data.control;
                $.ajax({
                    url: 'decide_later.json',
                    data: {resumeId: lg.get('resumeId')},
                    type: 'POST'
                }).success(function (result) {
                    if (result.state == 1) {
                        lg.getpiplineRigetView().trigger('updateNumbers');
                        that.init({dataSource: result.content.data.resumeVo});
                        lg.getresume_list().updateResume(result.content.data.resumeVo);
                        var num = lg.getautoRefuse().getElement().text();
                        lg.getautoRefuse().getElement().text(parseInt(num) + 1);
                        piplineRigetView.trigger('updateCommentList');

                    }
                });
            });

            //推荐到其他职位
            piplineRigetView.getControl('resume_toolbar').on('recommendOther', function (e) {
                var recommendOther = this;
                var that = e.data.control;
                var itemData = that.itemData;
                if (that.getIsDisabled()) {

                } else {
                    var self = this;
                    var confirm = new lg.Widgets.Controls.Confirm({
                        content: '<div>选择需要推荐到职位</div><select id="otherPositionList"><option>未选择</option></select>',
                        submitText: "确定",
                        cancelText: "取消",
                        SubmitBtn: function (e) {
                            var positionId = $('#otherPositionList').val();
                            if (positionId) {
                                $.ajax({
                                    url: 'recommend.json',
                                    dataType: 'json',
                                    data: {resumeId: itemData.id, positionId: positionId},
                                    type: 'POST',
                                    cache: false
                                }).done(function (result) {
                                    if (result.state == 1) {
                                        piplineRigetView.trigger('updateCommentList');
                                        e.control.setRemove();
                                    } else {
                                        if (e.control.getElementContent().find('[data-valid-message]').length > 0) {
                                            e.control.getElementContent().find('[data-valid-message]').text(result.message);
                                        } else {
                                            e.control.getElementContent().append('<span style="" data-valid-message="" class="input_tips">' + result.message + '</span>')
                                        }
                                    }
                                });
                            }
                        },
                        CancelBtn: function (e) {
                        }
                    });
                    $.ajax({
                        url: '../position/queryPositionsOfMyCompany.json'
                    }).success(function (result) {
                        if (result.state == 1) {
                            var html = '';
                            for (var i = 0, len = result.content.data.positions.length; i < len; i++) {
                                var position = result.content.data.positions[i];
                                html += '<option value="' + position.positionId + '">' + (position.department ? position.positionName + ' / ' + position.department : position.positionName) + '</option>';
                            }
                            confirm.getElement().find('#otherPositionList').append(html);
                            $('#otherPositionList').fancySelect();
                        }
                    });
                }
            });

            //修改简历
            piplineRigetView.getControl('resume_toolbar').on('editeResume', function (e) {
                var self = e.data.control;
                var itemData = self.itemData;
                lg.getuserInfo().setVisible(false);
                $('#workYear').val(itemData.workYear);
                $('#educational').fancySelect();
                $('#educational').val(itemData.educational || '未填写').trigger('change');
                ;
                $('#sex').fancySelect()
                $('#sex').val(itemData.sex || '未填写').trigger('change');

                // 每次点击编辑都会在【确定】上绑定事件导致在【确定】上绑定多个事件，结果点【确定】就会出现很多条相同评论，所以在【确定】上绑定事件前先清除一下所有之前绑定的事件
                $('.editeBox .submit .btn').unbind();
                var editeBox = new lg.Views.BaseView({
                    name: 'editeBox',
                    fields: [{
                        name: 'phone',
                        value: itemData.phone,
                        validRules: [{
                            mode: 'require',
                            data: '',
                            message: '',
                            showMessage: false,
                            trigger: 'blur'

                        }, {
                            mode: 'pattern',
                            isUse: true,
                            status: false,
                            data: {phone: /^(0|86|17951)?((13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[57])[0-9]{8})$/},
                            message: ''
                        }
                        ],
                        controlType: "TextBox"
                    }, {
                        name: 'workYear',
                        value: itemData.workYear,
                        controlType: "TextBox",
                        validRules: [{
                            mode: 'require',
                            data: '',
                            message: ''
                        }, {
                            mode: 'pattern',
                            data: {workyear: /^[0-9]*$/},
                            message: ''
                        }],
                    }, {
                        name: 'email',
                        value: itemData.email,
                        validRules: [{
                            mode: 'require',
                            data: '',
                            message: ''
                        }, {
                            mode: 'pattern',
                            data: {email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i},
                            message: ''
                        }],
                        controlType: "TextBox"
                    }, {
                        name: 'lastCompanyName',
                        validRules: [{
                            mode: 'pattern',
                            data: '/^[\\S\\s]{0,20}$/',
                            message: ''
                        }],
                        value: itemData.lastCompanyName,
                        controlType: "TextBox"
                    }, {
                        name: 'candidateName',
                        value: itemData.candidateName,
                        validRules: [{
                            mode: 'require',
                            data: '',
                            message: ''
                        }, {
                            mode: 'pattern',
                            data: '/^[\\S\\s]{1,16}$/',
                            message: ''
                        }],
                        controlType: "TextBox"
                    }, {
                        name: 'submit',
                        validRules: [],
                        controlType: "Button",
                        url: "../resume/update.json",
                        click: function (e) {
                            var that = e;
                            var params = that.parent.CollectData();
                            if (params.isValidate) {
                                params.resumeId = lg.get('resumeId');
                                params.education = $('#educational').val();
                                params.sex = $('#sex').val();
                                params.sex = params.sex === '未填写' ? '' : params.sex;
                                params.education = params.education === '未填写' ? '' : params.education;
                                $.ajax({
                                    url: that.control._option.url,
                                    data: params,
                                    type: 'post',
                                    dataType: 'json',
                                    cache: false
                                }).done(function (result) {
                                    var stateList = {
                                        1: {message: "成功", linkFor: 'submit', level: 'info'},
                                        201: {message: "resumeId 不能为空", linkFor: 'submit', level: 'info'},
                                        202: {message: "candidateName 不能为空", linkFor: 'candidateName', level: 'info'},
                                        203: {message: "phone 不能为空", linkFor: 'phone', level: 'info'},
                                        204: {message: "email 不能为空", linkFor: 'email', level: 'info'},
                                        205: {message: "phone 不能为空", linkFor: 'phone', level: 'info'},
                                        206: {message: "email 格式不对", linkFor: 'email', level: 'info'},
                                        207: {message: "sex 格式不对", linkFor: 'phone', level: 'info'},
                                        208: {message: "lastCompanyName长度超过限制20", linkFor: 'lastCompanyName', level: 'info'},
                                        303: {message: "无权限操作此简历", linkFor: 'submit', level: 'info'},
                                        401: {message: "更新的简历不存在", linkFor: 'submit', level: 'info'}
                                    }
                                    if (stateList[result.state] && result.state != 1) {
                                        that.parent.field[stateList[result.state].linkFor].showMessage({
                                            message: stateList[result.state].message
                                        });
                                    }
                                    if (result.state == 1) {
                                        $.extend(lg.getresume_list().dataList[result.content.data.resumeVo.id], result.content.data.resumeVo);
                                        var extendData = lg.getresume_list().dataList[result.content.data.resumeVo.id];
                                        lg.getuserInfo().init({dataSource: extendData});
                                        lg.getuserInfo().setVisible(true);
                                        lg.getediteBox().setVisible(false);
                                        self.init({dataSource: result.content.data.resumeVo});
                                        lg.getresume_list().updateResume(result.content.data.resumeVo);
                                        piplineRigetView.trigger('updateCommentList');

                                    }

                                });
                            }
                        }
                    }]
                });
                $('[data-propertyname="cancel"]').on('click', function (e) {
                    lg.getuserInfo().setVisible(true);
                    lg.getediteBox().setVisible(false);
                    lg.getediteBox().setClear();
                });

                lg.getediteBox().setVisible(true);
            });

            //上一份简历
            piplineRigetView.getControl('resume_toolbar').on('prePage', function (e) {
                lg.getresume_list().getActivePre().trigger('click');
            });

            //下一份简历
            piplineRigetView.getControl('resume_toolbar').on('nextPage', function (e) {
                lg.getresume_list().getActiveNext().trigger('click');
            });
            //默认是否选中第一条 ----- 1,这里有定位时候默认选中第一个 2,选中一个以后 刷新时候 还会默认选中刚才选中一条
            piplineLeftView.field['resume_list'].triggerClick();
            //24小时极速入职
            $.ajax({
                url:'../../https@activity.lagou.com/activityapi/lamp/getSpeedResume',
                // url:'../../10.1.200.143_3A10320/activityapi/lamp/getSpeedResume',
                dataType: 'jsonp',
                jsonp: "jsoncallback",
                data: {
                    hrId: window.CONST_VARS('user').id
                },
                success:function(data){
                    if(data.state == 200 && data.content){
                        var arr = [];
                        $('.dotCardHover').each(function(){
                            var _this = $(this)
                            var positionId = _this.data('positionid');
                            var userId = _this.data('userid')
                            for(var i=0;i<data.content.length;i++){
                                if(positionId == data.content[i].positionId && userId == data.content[i].userId){
                                    if(data.content[i].status == "WAIT"){
                                        var hour_tip = "待处理"+" "+data.content[i].countDownStr
                                    }else{
                                        var hour_tip = "未按时处理，将被处罚"
                                    }
                                    if(_this.find('.state').find('span').length ==0){
                                        _this.find('.state').text(hour_tip).css('color','#fe6633');

                                    }else{
                                        _this.find('.state').find('span').text(hour_tip).css('color','#fe6633');
                                    }

                                    var str = '<span class="hour_icon"></span>'
                                    _this.append(str);
                                }
                            }
                        })
                        for(var j=0;j<data.content.length;j++){
                            if(data.content[j].countDown > 0){
                                arr.push(data.content[j].countDown+','+data.content[j].countDownStr);
                            }
                        }
                        arr.sort();
                        var hourtips = '<p class="hours_tips" style="color:#999;font-size:14px;margin-top:12px;">'+'"收到的简历"中搜索'+'<span style="color:#fe6633;">'+'"极速入职"'+'</span>'+',集中处理"24小时极速入职"的新简历。'+'<span style="color:#fe6633;">'+arr[0].split(',')[1]+'</span>'+'后有新简历过期，超时未处理将受处罚。'+'</p>'
                        $('#searchForm').after(hourtips)
                        $('#main-content-wrapper').css('border-top','none');
                        $('#main-content-wrapper').css('margin-top','50px')
                        $('.fields').prepend('<span class="category hour24category" data-preType="1">' + "收到的简历" + '</span>');
                        $('.fields input[name="keyword"]').attr('placeholder','姓名 / 手机 / 邮箱 / 职位 / 公司 / 标签 等');
                        $('.fields input[name="keyword"]').val('极速入职');
                        $('#searchForm .input-tips').fadeOut();

                    }

                }
            })

        }
    });

     piplineRigetView.getControl('resume_toolbar').on('writeComment', function (e) {
        $('.comment_tips_add').trigger('click');
        var editor = document.getElementById('commentInput');
        editor.focus();
     });

    //评论框绑定focus 并定位到文字内容最后
    var editor = document.getElementById('commentInput');
    if(editor) {
        editor.onfocus = function () {
            window.setTimeout(function () {
                var sel, range;
                if (window.getSelection && document.createRange) {
                    range = document.createRange();
                    range.selectNodeContents(editor);
                    range.collapse(true);
                    range.setEnd(editor, editor.childNodes.length);
                    range.setStart(editor, editor.childNodes.length);
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (document.body.createTextRange) {
                    range = document.body.createTextRange();
                    range.moveToElementText(editor);
                    range.collapse(true);
                    range.select();
                }
            }, 1);
        }
    }

    /*异步获取当前用户所在公司的信息  并保存到lg.Cache.get('MyCompany')下 访问方式就是lg.Cache.set('MyCompany')  lg.Cache.has('MyCompany')
     lg.Cache.get('MyCompany') => {
     createTime:"20151128T115901+0800",
     id:xxx,
     name:"北京xxx网络技术有限公司",
     shortName:"xxx",
     updateTime:"20160303T164029+0800",
     userId:xxx
     }*/
    if(!lg.Cache.has('MyCompany')){
        $.ajax({
            url: '../company/curr_company_info.json'
        }).success(function (e) {
            if (e.state == 1) {
                lg.Cache.set('MyCompany',e.content.data.companyInfo)
            }
        });
    }

    if(!lg.Cache.has('allMembers')){
        $.ajax({
            url: '../member/all_members.json',
        }).success(function (result) {
            if (result.state == 1) {
                lg.Cache.set('allMembers',result.content.data.members);
                var allmemberKeyValue = {};
                for (var i = 0, len = lg.Cache.get('allMembers').length; i < len; i++) {
                    if (window.CONST_VARS('user').id == lg.Cache.get('allMembers')[i].userId) {
                        lg.Cache.set('MyInfo',lg.Cache.get('allMembers')[i]);
                    }
                    var item = result.content.data.members[i];
                    allmemberKeyValue[item.userId]=item;
                }
                lg.Cache.set('allmemberKeyValue',allmemberKeyValue);
            }
        });
    }else{
        for (var i = 0, len = lg.Cache.get('allMembers').length; i < len; i++) {
            if (window.CONST_VARS('user').id == lg.Cache.get('allMembers')[i].userId) {
                lg.Cache.set('MyInfo',lg.Cache.get('allMembers')[i]);
            }
        }
    };

    /**
     * 简历预览工具条
     * @type {lg.Widgets.Controls.ResumePreViewToolBar}
     */
    var resumePreviewToolBar = new lg.Widgets.Controls.ResumePreViewToolBar({
        name:'resumePreviewToolBar',
        selector:'.detail-content'
    });
    $('.pip_resume_copy_switch_tips').on('click','.openCopy', function (e) {
        if(lg.getresume_list().getActiveData() && lg.getresume_list().getActiveData().doc && true){
            lg.getresume_list().getActiveData().doc.renderTextAndLink();
        }
        $('.pip_resume_copy_switch_tips').hide();
        $('.preview-toolbar-copy').addClass('disabled-style');
    });

});

/*!piplines/modules/right-detail/main.js*/
;/**
 * 邀请新成员弹窗逻辑
 */

define('piplines/modules/right-detail/main', ['require', 'exports', 'module', "dep/artTemplate/dist/template", "common/components/push/NotifyClient"], function(require, exports, module) {
    $('.detail-content').niceScroll({'cursorborder':'none',cursorcolor:'#aeb1b3','cursorwidth':'6px','scrollspeed':'6'});
    $('.detail-content').on('scroll',function(e){
        $('#atwho-ground-commentInput>div').hide();
    });
    var template = require("dep/artTemplate/dist/template");
    var notifyClient = require("common/components/push/NotifyClient");

    $('#resumeTab').click(function (e) {
        if($(e.target).attr('id')=='resumeTab'){
            $('.detail-content').scrollTop(0);
        }
    });

    //添加评论 展开/折叠
    $('#toggle_submit_commemt').click(function(e){
        var toggle_content = $(this).closest('.detail-resume-comment').find('.toggle-box-content');
        if(toggle_content.is(':visible')){
            toggle_content.hide();
            $(this).text(commet_text[lg.get('stage')]);
            $('#commentInput').attr('placeholder',commet[lg.get('stage')]);
        }else{
            toggle_content.show();
            $(this).text('收起');
        }

    });
    //简历预览 展开/折叠
    $('#toggle_preView').click(function(e){
        var toggle_content = $(this).closest('.detail-resume-review').find('.toggle-box-content');
        if(toggle_content.css('display')=="block"){
            toggle_content.hide();
            $(this).text('展开');
        }else{
            toggle_content.show();
            $(this).text('收起');
        }

    });

    //看板 打开简历 发表评论输入框前的用户头像
    var userId = window.CONST_VARS('user').id;
    var userName = CONST_VARS('user')['name'];
    var userPortrait = CONST_VARS('user')['portrait'];
    if(userPortrait ==""){
        $('.user_avatar').empty();
        $('.user_avatar').append('<span class="bg_'+(userId%4)+'">'+lg.Utils.splitNameStr(userName)+'</span>');

    }else{
        $('.user_avatar').empty();
        $('.user_avatar').append('<img src="' + (/^https?\:\/\//.test(userPortrait) ? userPortrait : '../' + userPortrait.replace(/^[\/]+/, '')) + '" alt="用户头像" />');
    }
    var commet = {
        "NEW":'@同事转发简历，或随手记下你对候选人的评价，评论内容候选人看不到哦~',
        "LINK":'@同事转发简历，或随手记下你和候选人的沟通情况，评论内容候选人看不到哦~',
        "INTERVIEW":'@同事转发简历，或随手记下候选人的面试评价，评论内容候选人看不到哦~',
        "OFFER":'@同事转发简历，或随手记下你和候选人的沟通情况，评论内容候选人看不到哦~',
        "CHECK_IN":'@同事转发简历，或随手记下你和候选人的沟通情况，评论内容候选人看不到哦~'
    };
    var commet_text = {
        "NEW":'填写评论',
        "LINK":'填写沟通情况',
        "INTERVIEW":'填写面试情况',
        "OFFER":'填写沟通情况',
        "CHECK_IN":'填写沟通情况'
    };

    //var imgUrl = lg.imgUrl = lg.imgUrl || __uri('../common/img/offer-add-key.png');
    //$('#trumbowygEditor').trumbowyg({
    //    semantic: false,
    //    btns: [
    //        ['test'],
    //        'btnGrp-semantic',
    //        'btnGrp-lists',
    //        'btnGrp-links',
    //        ['fullscreen']
    //    ],
    //    imgURL:lg.imgUrl
    //});
    //$('#trumbowygEditor').on('tbwopenfullscreen', function(){
    //    $('.pip_resume_offer_tips').hide();
    //});
    //$('#trumbowygEditor').on('tbwclosefullscreen', function(){
    //    $('.pip_resume_offer_tips').show();
    //});
    //
    //$('#OfferInfoBox .submit-btn').on('click', function (e) {
    //
    //        if(lg.getresume_list().getActiveData().stage == 'OFFER' && lg.getresume_list().getActiveData().subStage == 'OFFER_SEND'){
    //            var params = getofferInfoViewParams();
    //            if(!params.isValidate){
    //                return;
    //            }
    //            if(lg.Utils.isNullObject(lg.Utils.getLocalStorage('SendOffer'))){
    //                var SendOffer = lg.Utils.getLocalStorage('SendOffer');
    //                SendOffer[lg.get('resumeId')] = SendOffer[lg.get('resumeId')]?($.extend(SendOffer[lg.get('resumeId')],params)):params;
    //            }else{
    //                var SendOffer = {};
    //                SendOffer[lg.get('resumeId')] = SendOffer[lg.get('resumeId')]?($.extend(SendOffer[lg.get('resumeId')],params)):params;
    //            }
    //            lg.Utils.setLocalStorage('SendOffer',SendOffer);
    //            $('#OfferInfoBox').hide();
    //            $('#sendOfferBox').show();
    //            $.trumbowyg.params = {
    //                candidateName:params.name,
    //                positionName:params.positionTitleName,
    //                departmentName:params.departmentName,
    //                companyName:lg.Cache.get('hrInfomation').companyName,
    //                companyShortName:lg.Cache.get('hrInfomation').companyShortName,
    //                HRName:lg.Cache.get('hrInfomation').hrName,
    //                HREmail:lg.Cache.get('hrInfomation').hrEmail,
    //                entryDate:params.entryDate
    //            }
    //            $('#trumbowygEditor').html(switchKey($('#trumbowygEditor').html(),true,$.trumbowyg.params));
    //        }else if((lg.getoffer_phone().getElement().find('[data-valid-message]').length==0 || lg.getoffer_phone().getElement().find('[data-valid-message]').css('display')=='none')){
    //            var params = getofferInfoViewParams();
    //            if(!params.isValidate){
    //                return;
    //            }
    //            //$.ajax({url:'../hr/offer/canSend.json',data:{phone:params.phone}}).success(function (result) {
    //            //    if(result.state == 1 && params.isValidate){
    //            //        if(lg.Utils.isNullObject(lg.Utils.getLocalStorage('SendOffer'))){
    //            //            var SendOffer = lg.Utils.getLocalStorage('SendOffer');
    //            //            SendOffer[lg.get('resumeId')] = SendOffer[lg.get('resumeId')]?($.extend(SendOffer[lg.get('resumeId')],params)):params;
    //            //        }else{
    //            //            var SendOffer = {};
    //            //            SendOffer[lg.get('resumeId')] = SendOffer[lg.get('resumeId')]?($.extend(SendOffer[lg.get('resumeId')],params)):params;
    //            //        }
    //            //        lg.Utils.setLocalStorage('SendOffer',SendOffer);
    //            //        $('#OfferInfoBox').hide();
    //            //        $('#sendOfferBox').show();
    //            //        $.trumbowyg.params = {
    //            //            candidateName:params.name,
    //            //            positionName:params.positionTitleName,
    //            //            departmentName:params.departmentName,
    //            //            companyName:lg.Cache.get('hrInfomation').companyName,
    //            //            companyShortName:lg.Cache.get('hrInfomation').companyShortName,
    //            //            HRName:lg.Cache.get('hrInfomation').hrName,
    //            //            HREmail:lg.Cache.get('hrInfomation').hrEmail,
    //            //            entryDate:params.entryDate
    //            //        }
    //            //        $('#trumbowygEditor').html(switchKey($('#trumbowygEditor').html(),true,$.trumbowyg.params));
    //            //    }else if(result.state==401){
    //            //        lg.getoffer_phone().showMessage({message:'用户已在入职流程'})
    //            //    }else if(result.state==402){
    //            //        lg.getoffer_phone().showMessage({message:'用户已在OFFER流程'})
    //            //    }
    //            //});
    //        }
    //});
    //$('#OfferInfoBox .addCopy').on('click', function (e) {
    //    var parent = $('#OfferInfoBox .offer_email_copy .control-box');
    //    var index = $('[data-view="offerInfoView"]').find('[data-propertyname^="offer_email_copy_"]').length;
    //    var email_input =   '<div class="filter-select" data-propertyname="offer_email_copy_'+index+'">' +
    //        '<input type="text" class="input" placeholder="选择同事或填写邮箱地址">' +
    //        '</div>';
    //    //添加元素
    //    parent.append(email_input);
    //    lg.getofferInfoView().addControls([
    //        {
    //            name: 'offer_email_copy_'+index,
    //            placeHolder: '选择同事或填写邮箱地址',
    //            showSelect:true,
    //            showKey:'receiveEmail,email',
    //            key: 'name email receiveEmail',
    //            dataSource: lg.Cache.get('allMembers'),
    //            showMessage:true,
    //            validRules: [{
    //                mode: 'pattern',
    //                isUse: true,
    //                status: false,
    //                data:{nolen:/^\S{0,0}$/,email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i},
    //                message: '请输入有效的邮箱'
    //            }],
    //            controlType: "FilterSelect"
    //        }
    //    ]);
    //});

    //var offerInfoView = new lg.Views.BaseView({
    //    name: 'offerInfoView',
    //    fields: [{
    //        name: 'offer_name',
    //        showMessage:true,
    //        validRules: [{
    //            mode: 'require',
    //            data: '',
    //            message: '请输入候选人姓名',
    //            trigger: 'blur'
    //        }, {
    //            mode: 'pattern',
    //            isUse: true,
    //            status: false,
    //            data: '/^[\\S\\s]{1,10}$/',
    //            message: '请输入1-10位候选人姓名'
    //        }
    //
    //        ],
    //        controlType: "TextBox"
    //    }, {
    //        name: 'offer_phone',
    //        showMessage:true,
    //        validRules: [{
    //            mode: 'require',
    //            data: '',
    //            message: '请输入联系人'
    //        }, {
    //            mode: 'pattern',
    //            data: {phone: /^(0|86|17951)?((13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[57])[0-9]{8})$/},
    //            message: '请输入有效的手机号'
    //        }],
    //        controlType: "TextBox",
    //        keyupvalid:function(e){
    //            if($('[href="#sendOfferTab"]').text() != '重发Offer'){
    //
    //                $.ajax({url:'../hr/offer/canSend.json',data:{phone:e.control._value}}).success(function (result) {
    //                    if(result.state == 1){
    //
    //                    }else if(result.state==401){
    //                        e.control.showMessage({message:'用户已在入职流程'})
    //                    }else if(result.state==402){
    //                        e.control.showMessage({message:'用户已在OFFER流程'})
    //                    }
    //                });
    //            }
    //
    //        },
    //    }, {
    //        name: 'offer_email',
    //        showMessage: true,
    //        validRules: [{
    //            mode: 'require',
    //            data: '',
    //            message: '请输入邮箱'
    //        }, {
    //            mode: 'pattern',
    //            data: {email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i},
    //            message: '请输入有效的邮箱'
    //        }],
    //        controlType: "TextBox"
    //    },{
    //        name: 'offer_email_copy_0',
    //        placeHolder: '选择同事或填写邮箱地址',
    //        showSelect:true,
    //        showKey:'receiveEmail,email',
    //        key: 'name email receiveEmail',
    //        dataSource: lg.Cache.get('allMembers'),
    //        showMessage:true,
    //        validRules: [{
    //            mode: 'pattern',
    //            isUse: true,
    //            status: false,
    //            data:{nolen:/^\S{0,0}$/,email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i},
    //            message: '请输入有效的邮箱'
    //        }],
    //        controlType: "FilterSelect"
    //    }, {
    //        name: 'offer_employTime',
    //        showMessage:true,
    //        validRules: [{
    //            mode: 'require',
    //            data: '',
    //            message: '请选择入职时间'
    //        }, {
    //            mode: 'pattern',
    //            data: {dateTime:/\d{4}-\d{2}-\d{2}/},
    //            message: '请选择入职时间'
    //        }],
    //        controlType: "TextBox"
    //    }, {
    //        name: 'offer_department',
    //        placeHolder: '选择或填写部门',
    //        showSelect:true,
    //        showKey:'name',
    //        key: 'name',
    //        identifyKey:'departmentId',
    //        dataSource: getFilterDepartMents(),
    //        showMessage:true,
    //        template:'<span>{{name}}</span>',
    //        templateEng:template,
    //        validRules: [{
    //            mode: 'pattern',
    //            isUse: true,
    //            status: false,
    //            data: '/^[\\S\\s]{1,20}$/',
    //            message: '请输入有效的所属部门'
    //        }],
    //        controlType: "FilterSelect"
    //    }, {
    //        name: 'offer_title',
    //        placeHolder: '选择或填写职位',
    //        showSelect:true,
    //        showKey:'name',
    //        key: 'name',
    //        identifyKey:'titleId',
    //        dataSource: getFilterTitles(),
    //        showMessage:true,
    //        template:'<span>{{name}}</span>',
    //        templateEng:template,
    //        validRules: [{
    //            mode: 'pattern',
    //            isUse: true,
    //            status: false,
    //            data: '/^[\\S\\s]{1,20}$/',
    //            message: '请输入有效的职位'
    //        }],
    //        controlType: "FilterSelect"
    //    }]
    //});
    getFilterMembers();
    function getFilterMembers() {
        if (!lg.Cache.has('positionTitleList')) {
            $.ajax({
                url:'../member/all_members.json',
            }).success(function (e) {
                if(e.state==1){
                    lg.Cache.set('allMembers', e.content.data.members)
                    //var copyCount = $('[data-view="offerInfoView"]').find('[data-propertyname^="offer_email_copy_"]').length;
                    //for(var i=0,len=copyCount;i<len;i++){
                    //    lg['getoffer_email_copy_'+i]().init({
                    //        name: 'offer_email_copy_' + i,
                    //        placeHolder: '选择同事或填写邮箱地址',
                    //        showSelect: true,
                    //        showKey: 'receiveEmail,email',
                    //        key: 'name email receiveEmail',
                    //        dataSource: e.content.data.members,
                    //        showMessage: true,
                    //        validRules: [{
                    //            mode: 'pattern',
                    //            isUse: true,
                    //            status: false,
                    //            data: {
                    //                nolen: /^\S{0,0}$/,
                    //                email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
                    //            },
                    //            message: '请输入有效的邮箱'
                    //        }],
                    //        controlType: "FilterSelect"
                    //    });
                    //}
                    return e.content.data.allMembers;
                }
            });
        } else {
            return lg.Cache.get('allMembers');
        }
    }
    //getFilterTitles();
    function getFilterTitles() {
        if (!lg.Cache.has('positionTitleList')) {
            $.ajax({
                url:'../hr/entry/getAllTitle.json',
            }).success(function (e) {
                if(e.state==1){
                    lg.Cache.set('positionTitleList', e.content.data.positionTitleList);
                    lg.getoffer_title().init({
                        name: 'offer_title',
                        placeHolder: '选择或填写职位',
                        showSelect: true,
                        showKey: 'name',
                        key: 'name',
                        identifyKey: 'titleId',
                        dataSource: e.content.data.positionTitleList,
                        showMessage: true,
                        template:'<span>{{name}}</span>',
                        templateEng:template,
                        validRules: [{
                            mode: 'pattern',
                            isUse: true,
                            status: false,
                            data: '/^[\\S\\s]{1,20}$/',
                            message: '请输入有效的职位'
                        }],
                        controlType: "FilterSelect"
                    });
                    return e.content.data.positionTitleList;
                }
            });


        } else {
            return lg.Cache.get('positionTitleList');
        }
    }
    //getFilterDepartMents();
    function getFilterDepartMents() {
        if (!lg.Cache.has('departmentList')) {
            $.ajax({
                url:'../hr/entry/getAllDepartment.json',
            }).success(function (e) {
                if(e.state==1){
                    lg.Cache.set('departmentList', e.content.data.departmentList);
                    lg.getoffer_department().init({
                        name: 'offer_department',
                        placeHolder: '选择或填写部门',
                        showSelect: true,
                        showKey: 'name',
                        key: 'name',
                        identifyKey: 'departmentId',
                        dataSource: e.content.data.departmentList,
                        showMessage: true,
                        template:'<span>{{name}}</span>',
                        templateEng:template,
                        validRules: [{
                            mode: 'pattern',
                            isUse: true,
                            status: false,
                            data: '/^[\\S\\s]{1,20}$/',
                            message: '请输入有效的所属部门'
                        }],
                        controlType: "FilterSelect"
                    })
                    return e.content.data.departmentList;
                }
            });
        } else {
            return lg.Cache.get('departmentList');
        }
    }
    function getofferInfoViewParams(){
        var params = lg.getofferInfoView().CollectData();
        var result = {};
        var query = lg.QueryStringByUrl();
        if(query.has('offerId')){
            result.offerId = query.get('offerId');
        }
        result.isValidate = params.isValidate;
        result.name = params.offer_name;
        result.sex = $('#OfferSex').val();
        result.phone = params.offer_phone;
        result.email = params.offer_email;
        result.entryDate = params.offer_employTime;
        result.departmentName = params.offer_department;
        result.positionTitleName = params.offer_title;
        result.forwardEmails = [];

        for (var item in params) {
            if (item.indexOf('offer_email_copy_') > -1) {
                if (params[item].length > 0) {
                    result.forwardEmails.push(params['offer_email_copy_' + result.forwardEmails.length]);
                }
            }
        }
        return result;
    }
    $('#OfferSex').fancySelect();
    $('[data-propertyname="offer_employTime"] input').datetimepicker({
        timepicker:false,
        format:'Y-m-d'
    });
    $('.offer-attachment .offer-attachment-add').on("click",function(e){
        $('.offer-attachment #offerattachment').trigger('click');
    });
    $('.offer-attachment #offerattachment').on("change",function(e){
        var fileName = $(this).val();
        var fileUrlList = fileName.split("\\");
        var len = fileUrlList.length;
        $('.offer-attachment  .offer-show-name .file-name').text(fileUrlList[len-1]);
        $('.offer-attachment .offer-show-name').show();
        $('.offer-attachment .offer-attachment-add').hide();
        $('.common-error').hide();
    });
    $('.offer-attachment  .offer-show-name a').on('click', function (e) {
        $('.offer-attachment .offer-show-name').hide();
        $('.offer-attachment .offer-attachment-add').show();
        $('.common-error').hide();
    });
    function offerHandleResponse(loadedFrame, element) {
        var result, responseStr = $(loadedFrame).contents().find('body').text();
        try {
            result = JSON.parse(responseStr);
        } catch(e) {
            result = responseStr;
        }

        element.siblings().remove();
        element.unwrap();

        var stateList = {
            1: {message: "成功",linkFor: 'description',level: 'info'},
            201: {message: "resumeId不能为空",linkFor: 'description',level: 'info'},
            202: {message: "content不能为空",linkFor: 'description',level: 'info'},
            203: {message: "content超过20000",linkFor: 'description',level: 'info'},
            204: {message: "name不能为空",linkFor: 'description',level: 'info'},
            205: {message: "phone不能为空",linkFor: 'description',level: 'info'},
            206: {message: "email不能为空",linkFor: 'description',level: 'info'},
            207: {message: "entryDate不能为空",linkFor: 'description',level: 'info'},
            208: {message: "sex不能为空",linkFor: 'description',level: 'info'},
            209: {message: "department不能为空",linkFor: 'description',level: 'info'},
            210: {message: "positionTitleName不能为空",linkFor: 'description',level: 'info'},
            211: {message: "email格式不正确",linkFor: 'description',level: 'info'},
            212: {message: "phone格式不正确",linkFor: 'description',level: 'info'},
            213: {message: "转发邮箱格式不正确",linkFor: 'description',level: 'info'},
            214: {message: "topic不能为空",linkFor: 'description',level: 'info'},
            401: {message: "简历不存在",linkFor: 'description',level: 'info'},
            402: {message: "不是offer阶段,操作不被允许",linkFor: 'description',level: 'info'},
            403: {message: "附件太大了，请上传10MB以内的附件", linkFor: 'description', level: 'info'},
            330: {message: "操作权限不足",linkFor: 'description',level: 'info'}
        }
        if (result.state && stateList[result.state] && result.state != 1) {
            $('.common-error [data-valid-message]').text(stateList[result.state].message)
            $('.common-error').show();
        }else{
            $('.common-error').hide();
        }
        if (result.state == 1) {
            var editeresume = {};
            var temp = {};
            var resumeVo = lg.getofferInfoView().CollectData();
            editeresume.resumeId = lg.get('resumeId');
            editeresume.candidateName = resumeVo.offer_name;
            editeresume.phone = resumeVo.offer_phone;
            editeresume.email = resumeVo.offer_email;
            editeresume.sex = $('#OfferSex').val() || '男' ;
            editeresume.educational = lg.getresume_list().getActiveData().educational || '其他';
            editeresume.workYear = lg.getresume_list().getActiveData().workYear||0;
            $.ajax({
                url:'../resume/update.json',
                data:editeresume
            }).success(function (data) {
                if(data.state==1){
                    $.extend(lg.getresume_list().dataList[data.content.data.resumeVo.id], data.content.data.resumeVo);
                    var extendData = lg.getresume_list().dataList[data.content.data.resumeVo.id];
                    lg.getuserInfo().init({dataSource: extendData});
                    lg.getuserInfo().setVisible(true);
                    lg.getresume_toolbar().init({dataSource: data.content.data.resumeVo});
                    lg.getresume_list().updateResume(data.content.data.resumeVo);
                    //lg.getpiplineRigetView().trigger('updateCommentList');
                }
            });
            lg.getpiplineRigetView().trigger('updateCommentList');
            var resumeVo=result.content.data.resumeVo;
            (resumeVo.subStage == 'OFFER_SEND')?$('[href="#sendOfferTab"]').text('重发Offer'):$('[href="#sendOfferTab"]').text('发Offer');
            lg.getuserInfo().init({dataSource:resumeVo});
            lg.getresume_list().updateResume(resumeVo);
            (resumeVo.subStage == 'OFFER_SEND')?$('[href="#sendOfferTab"]').text('重发Offer'):$('[href="#sendOfferTab"]').text('发Offer');

            $('#OfferInfoBox').hide();
            $('#sendOfferBox').hide();
            $('#successOffer').show();
        }
    };
    var offerWrapElement = function(element,params) {
        var frame_id = 'ajaxUploader-iframe-' + Math.round(new Date().getTime() / 1000)
        $('body').after('<iframe width="0" height="0" style="display:none;" name="'+frame_id+'" id="'+frame_id+'"/>');
        $('#'+frame_id).get(0).onload = function() {
            offerHandleResponse(this, element);
        };

        element.wrap(function() {
            return '<form action="send_offer.json" method="POST" enctype="multipart/form-data" target="'+frame_id+'" />'
        })
            .before(function() {
                var key, html = '';
                for(key in params) {
                    var paramVal = params[key];
                    if (typeof paramVal === 'function') {
                        paramVal = paramVal();
                    }
                    html += '<input type="hidden" name="' + key + '" value="' + paramVal + '" />';
                }
                return html;
            });
    }
    $('#sendOfferBox .send-offer-submit').on('click', function (e) {
        var params = getofferInfoViewParams();
        var topicView = lg.gettopicView().CollectData();
        params.topic = lg.gettopicView().CollectData().topic
        params.content = $('#sendOfferBox #trumbowygEditor').html();
        if(params.content.length>0){
            $('#sendOfferBox #trumbowygEditor').html($('#sendOfferBox #trumbowygEditor').html().replace(/<!--[\w\W\r\n]*?-->/gmi, ''));
            params.content = $('#sendOfferBox #trumbowygEditor').html();
        }
        if(params.content.length==0 || $('#trumbowygEditor').text().length>20000){
            $('.trumbowyg-box').css('border','1px solid #fd5f39');
            return;
        }else{
            $('.trumbowyg-box').css('border','1px solid #DDD');
        }
        if (params.isValidate && topicView.isValidate) {
            params.forwardEmails = params.forwardEmails.join(',');
            delete params.isValidate;
            params.entryDate = new Date(params.entryDate).toUTCString();
            if($('.offer-attachment-add').css('display')=='none'){
                params.hasAttachment = 1;
            }else{
                params.hasAttachment = 0;
            }
            params.resumeId = lg.get('resumeId');
            var p = lg.QueryStringByUrl();
            if(p.has('offerId')){
                params.offerId = p.get('offerId');
            }
            params.content = switchKey(params.content);

            offerWrapElement($('#offerattachment'), params);
            $('#offerattachment').parent('form').submit();
        }
    });

    // 点击编辑按钮
    $( '#editResume' ).on( 'click', function () {
        //再次点击的时候走取消逻辑
        if( $('.editeBox').is(":visible") && $('.user-info').is(":hidden") ){
            $('.editeBox').find('[data-propertyname="cancel"]').trigger( 'click' );
        }
        else{
            $('.more_dropdown').find('a[data-btn-use="editeResume"]').trigger( 'click' );
        }
    });

    //点击展开下拉列表
    $('.more_toggle_parent .more_toggle').on('click',function(e){
        var $toggle = $(this).parent('.toggle_menu-selected').next();
        if($toggle.is(":visible")){
            $toggle.fadeOut();
        }else{
            $('.header-right-toolbar .toggle_selected').fadeOut();
            $toggle.fadeIn();
        }
        e.stopPropagation();
    });

    $(document).on('click',function(e){
        e.stopPropagation();
        var ele = $('.toggle-menu');
        var area = $('.hover_style');
        if( (!ele.is(e.target) && ele.has(e.target).length === 0 ) || (!area.is(e.target) && area.has(e.target).length === 0 ) ){
            if($('.toggle-menu').is(":visible")){
                $('.toggle-menu').hide();
            }
            if($('.hover_style').is(":visible")){
                $('.hover_style').hide();
            }
        }
    });


    /**
     * 预览
     */
    $('#sendOfferBox .send-offer-review').on('click', function (e) {
        var confirm = new lg.Widgets.Controls.Confirm({
            content: '<div class="offer-review-header">Offer预览</div><div class="offer-review-sub-header"><span class="offer-review-title">'
            +lg.gettopic().getValue()
            +'</span><span class="offer-review-receive">发给'
            +lg.getofferInfoView().CollectData().offer_name
            +'</span></div><div class="offer-review-content">'
            + $("#trumbowygEditor").html()
            +'<a class="confirm-offer-btn">确认offer</a></div>'
            + ($(".offer-show-name").css("display")!= 'none'?('<div class="offer-review-file">'+$(".offer-show-name .file-name").text()+'</div>'):""),
            backClass: "offer-review-back",
            submitText: "没问题，立即发送",
            noCancelBtn: false,
            cancelText: "返回修改",
            decoration: "offer-review",
            BackClose:true,
            SubmitBtn:function(e){
                $('#sendOfferBox .send-offer-submit').trigger("click");
                e.control.setRemove();
            },
            CancelBtn:function(e){
                e.control.setRemove();
            }
        });
    });

    $('#sendOfferTab .step1').on('click', function (e) {
        $('#OfferInfoBox').show();
        $('#sendOfferBox').hide();
    });
    $('#sendOfferTab .toCommentTab').on('click', function (e) {
        $('.nav-tabs [href="#resumeProcessTab"]').trigger('click');
    });
    //if(!lg.Cache.has('offerDefaultTemplate')){
    //    $.ajax({
    //        url:'../settings/template/offer_temp.json'
    //    }).success(function (result) {
    //        if(result.state==1){
    //            lg.Cache.set('offerDefaultTemplate',result.content.data.offerTemplate);
    //        }
    //    });
    //}
    //if(!lg.Cache.has('hrInfomation')){
	 //   lg.Cache.set('hrInfomation',{});
    //    //$.ajax({
    //    //    url:'../hr/offer/tip_vals.json'
    //    //}).success(function (data) {
    //    //    if(data.state==1){
    //    //        lg.Cache.set('hrInfomation',data.content.data)
    //    //    }
    //    //})
    //}
    function switchKey(template, reverse, params) {
        var result = template;
        if (typeof reverse != 'undefined' && reverse) {
            result = html_decode(result);
            result = result.replace(/\[key=candidateName\]/g,params?params.candidateName : '<img src="'+imgUrl+'" alt="候选人姓名" class="candidateName" data-mds-key="true">');
            result = result.replace(/\[key=positionName\]/g, params?params.positionName : '<img src="'+imgUrl+'" alt="候选人姓名" class="positionName" data-mds-key="true">');
            result = result.replace(/\[key=companyName]/g, params?params.companyName : '<img src="'+imgUrl+'" alt="候选人姓名" class="companyName" data-mds-key="true">');
            result = result.replace(/\[key=companyShortName]/g, params?params.companyShortName : '<img src="'+imgUrl+'" alt="候选人姓名" class="companyShortName" data-mds-key="true">');
            result = result.replace(/\[key=HRName]/g, params?params.HRName : '<img src="'+imgUrl+'" alt="候选人姓名" class="HRName" data-mds-key="true">');
            result = result.replace(/\[key=HREmail\]/g,params?params.HREmail :  '<img src="'+imgUrl+'" alt="候选人姓名" class="HREmail" data-mds-key="true">');
            result = result.replace(/\[key=departmentName\]/g,params?params.departmentName :  '<img src="'+imgUrl+'" alt="候选人姓名" class="departmentName" data-mds-key="true">');
            result = result.replace(/\[key=entryDate\]/g,params?params.entryDate :  '<img src="'+imgUrl+'" alt="候选人姓名" class="entryDate" data-mds-key="true">');
        } else {
            result = result.replace(/<img[^<>]*?candidateName[^<>]*?>/g, '[key=candidateName]');
            result = result.replace(/<img[^<>]*?positionName[^<>]*?>/g, '[key=positionName]');
            result = result.replace(/<img[^<>]*?companyName[^<>]*?>/g, '[key=companyName]');
            result = result.replace(/<img[^<>]*?companyShortName[^<>]*?>/g, '[key=companyShortName]');
            result = result.replace(/<img[^<>]*?HRName[^<>]*?>/g, '[key=HRName]');
            result = result.replace(/<img[^<>]*?HREmail[^<>]*?>/g, '[key=HREmail]');
            result = result.replace(/<img[^<>]*?departmentName[^<>]*?>/g, '[key=departmentName]');
            result = result.replace(/<img[^<>]*?entryDate[^<>]*?>/g, '[key=entryDate]');
            result = html_encode(result);
        }
        return result;
    }
    function html_encode(str){
        str = str.replace(/&/g, '&amp;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/"/g, '&quot;');
        str = str.replace(/'/g, '&#039;');
        return str;
    }
    function html_decode(str){
        str = str.replace(/&amp;/g, '&');
        str = str.replace(/&lt;/g, '<');
        str = str.replace(/&gt;/g, '>');
        str = str.replace(/&quot;/g, '"');
        str = str.replace(/&#039;/g, "'");
        return str;
    }
    var topicView = new lg.Views.BaseView({
        name:'topicView',
        fields: [{
            name: 'topic',
            showMessage: false,
            validRules: [{
                mode: 'require',
                data: '',
                message: '请输入邮件主题',
                trigger: 'blur'
            }, {
                mode: 'pattern',
                isUse: true,
                status: false,
                data: '/^[\\S\\s]{1,50}$/',
                message: '请输入1-50位邮件主题'
            }

            ],
            controlType: "TextBox"
        }]
    });

    // 有消息发过来, 查询一次
    notifyClient.bind('NOTIFICATION_UPDATE', function (event, content) {
        loadNewNotifications();
    });

    function loadNewNotifications () {

        //评论 操作记录的消息提示
        var lock = false;
        var resumeid = lg.get('resumeId');
        var notiesData;
        var noticeAt = ['RESUME_AT'];
        var noticeDot = ['COMMENT_NEW'];
        var savedTips = {
            idAt:[],
            idDot:[]
        };      //给id和类型匹配的id记下来
        $.get(GLOBAL_DOMAIN.ectx + "/notification/unReadNotifications.json", function (resp) {
            var state = parseInt(resp.state, 10);
            var sign = null;

            if ( state === 1 ) {
                var content = resp.content || {};
                var notifications = content.rows || [];
                notiesData = notifications.map(function(item){
                    return{
                        id:item.id,
                        resumeId:item.params.resumeId,
                        type:item.type
                    };
                });
                for(var i = 0; i < notiesData.length; i++){
                    for(var j = 0; j < noticeAt.length; j++){
                        if(notiesData[i].resumeId == resumeid && notiesData[i].type == noticeAt[j]){
                            savedTips.idAt.push( parseInt(notiesData[i].id,10) );
                        }
                    }
                    for(var j = 0; j < noticeDot.length; j++){
                        if(notiesData[i].resumeId == resumeid && notiesData[i].type == noticeDot[j]){
                            savedTips.idDot.push( parseInt(notiesData[i].id,10) );
                        }
                    }
                }
                if( savedTips.idAt.length > 0 ){
                    $('.resume-review .new-tips-mark').show();
                    $('.comment_tips_add').removeClass('msg');
                } else if( savedTips.idDot.length > 0 ){
                    $('.comment_tips_add').addClass('msg');
                    $('.resume-review .new-tips-mark').hide();
                }else{
                    $('.comment_tips_add').removeClass('msg');
                    $('.resume-review .new-tips-mark').hide();
                }
            }
        }, 'json');
    }

    // 有消息发过来, 查询一次
    notifyClient.bind('NOTIFICATION_UPDATE', function (event, content) {
        loadUnReadResumeNew();
    });

    //应聘记录的消息提示
    function loadUnReadResumeNew (){
        var tipsData = [];
        var phone = $('.user-info .tips-remind .phone-tips').text().trim();
        var email = $('.user-info .tips-remind .info-email-url').text().trim();
        $.get(GLOBAL_DOMAIN.ectx + "/can/getUnReadResumeNew.json", function (resp) {
            var state = parseInt(resp.state, 10);
            if ( state === 1 ) {
                var content = resp.content || {};
                var unReadResumes = content.data.data || [];
                if(unReadResumes == []){
                    return;
                }
                var loadDatas = unReadResumes.map(function(item){
                    return{
                        phone:item.params.phone,
                        email:item.params.email
                    };
                });
                var loadPhone = loadDatas.map(function(item){
                    return item.phone
                }).indexOf(phone);
                var loadEmail = loadDatas.map(function(item){
                    return item.email
                }).indexOf(email);
                if( loadPhone != -1 && loadEmail != -1 ){
                    $('.records_tips_add').addClass('msg');
                    tipsData = unReadResumes.map(function(item){
                        return {
                            phone:item.params.phone,
                            email:item.params.email,
                            id:item.id
                        };
                    });
                }
            }
        }, 'json');
    }

    //判断显示候选人支持聊天不
    // $.get('../im/ChatAfterDelivered/canChat.json',{
    //     resumeId: lg.get('resumeId')
    // },function(resp){

    // },'json');

});







/*!common/widgets/add-recruiter-pop/main.js*/
;/**
 * 邀请新成员弹窗逻辑
 */

define('common/widgets/add-recruiter-pop/main', ['require', 'exports', 'module'], function(require, exports, module) {	
    
    var left_position_tab = $('.left_position>li');
    left_position_tab.each(function(i) {
        $(this).click(function() {
            if($(this).not(':visible')){
                $(this).addClass('active').siblings().removeClass('active');
                $(this).siblings('.left_position_tab_active').stop().animate({
                    'left': $(this).offsetParent().context.offsetLeft
                }, 400);
            }else{
                $(this).addClass('active').siblings().removeClass('active');
            }
        });
    });
    var tab = $('.mds-tab> li');
    tab.each(function(i) {
        $(this).click(function() {
            if($(this).not(':visible')){
                $(this).addClass('active').siblings().removeClass('active');
                $(this).siblings('.tab_active').stop().animate({
                    'left': $(this).offsetParent().context.offsetLeft
                }, 400);
            }else{
                $(this).addClass('active').siblings().removeClass('active');
            }
        });
    });
    $('.mds-tab a').click(function (e) {
      e.preventDefault()
      $(this).tab('show');
    })
    $('#add_recruiter_submit').on('click',function(e){
        var data=[];
        $('.member_checkbox_list input[name=recruiters]:checked').each(function(i,ele){
        	data[i]=$(ele).val();
        });
        var that=this;
        $.ajax({
            url: '../recruiter/saveRecruiter.json',
            dataType: 'json',
            type:"POST",
            data:{recruiterIdArray:lg.getaddRecruiterMemberCheckBoxList().getValue().join(','),positionId:lg.get('positionId'), source:'candidate'},
            cache:false
        }).success(function(result) {
            if(result.state==1){
                $('#add-member').modal('hide');
                $('[data-item='+$(that).attr('data-item')+']').find('.selecter').children('span').text(data.length);
            }else if(result.state == 1997){
                var confirm = new lg.Widgets.Controls.Confirm({
                    content:'<div>页面已失效，请刷新后重试 </div>',
                    submitText:"确定",
                    SubmitBtn:function(e){
                        window.location.reload();
                        e.control.setRemove();
                    },
                    noCancelBtn:true
                });
            }else{
                var confirm = new lg.Widgets.Controls.Confirm({
                    content:'<div>至少要有 1 位职位共享者 </div>',
                    submitText:"确定",
                    SubmitBtn:function(e){
                        e.control.setRemove();
                    },
                    noCancelBtn:true
                });
            }
        })
    });


	//添加邮箱
	$('#add-recruiter-invite-email-add').on('click', function(){
		var email_input = '<div class="form-group add-recruiter-invite-input add-recruiter-invite-email add-recruiter-invite-email-list">' + 
			    		    '<input type="email" class="input" placeholder="请输入同事的邮箱">' + 
			  			  '</div>';
		
		var _me = $(this);

		_me.before(email_input);

	});
    
	//提交邮箱
	$('.add-recruiter-invite-email-submit').on('click', function(){
		var invite_box = $('.add-recruiter-invite-box');
		var success = true;
        var params = [];
		invite_box.find('.add-recruiter-invite-email-list>input').each(function(i,ele){
			var email = $.trim( $(this).val() );
            if(email.length>0 && !isEmail(email) ) {
                $(this).addClass('error');
                success=false;
            }else{
                $(this).removeClass('error');
            }
            if(email.length>0){
                params[i]=email;
            }
            
		});
        if(params.length==0){
            $(invite_box.find('.add-recruiter-invite-email-list>input')[0]).addClass('error');
            success=false;
        }
		if(success){
			$.ajax({
                url:"../recruiter/addRecruiterByEmails.json",
                data:{positionId:lg.get('positionId'),emailArray:params.join(','), source:'candidate'},
                type:"POST"
            }).done(function(result){
                if(result.state==1){
                    $('#add-member').modal('hide');
                }else if(result.state == 1997){
                    var confirm = new lg.Widgets.Controls.Confirm({
                        content:'<div>页面已失效，请刷新后重试 </div>',
                        submitText:"确定",
                        SubmitBtn:function(e){
                            window.location.reload();
                            e.control.setRemove();
                        },
                        noCancelBtn:true
                    });
                }else{
                    var confirm = new lg.Widgets.Controls.Confirm({
                        content:'<div>系统错误，请刷新后重试 </div>',
                        submitText:"确定",
                        SubmitBtn:function(e){
                            window.location.reload();
                            e.control.setRemove();
                        },
                        noCancelBtn:true
                    });
                }
            });

		} 
	});
    
    //email validate
    function isEmail(str){
        var reg = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
        return reg.test(str);
    }


});
/*!common/widgets/out-resume-pop/main.js*/
;/**
 * 淘汰
 */

define('common/widgets/out-resume-pop/main', ['require', 'exports', 'module'], function(require, exports, module) {

    $('#outResume').on('click','.concel', function (e) {
        $('#outResume').modal('hide');
    });
    $("#outResume").on('click','.update-radio',function () {
        if($("#outResume .otherOutResumeRadio").css("display") != 'block'){
            var othersOptions = [{
                text: '接受其他Offer',
                select: true
            }, {
                text: '角色/职责不符'
            }, {
                text: '内部升职/转岗'
            }, {
                text: '薪资不满意'
            }, {
                text: '工作地点'
            }, {
                text: '其它'
            }
            ];
            var otherOutResumeRadio = new lg.Widgets.Controls.Radio({
                name: 'otherOutResumeRadio',
                dataSource: (othersOptions)
            });
            $("#outResume .outResumeRadio").hide();
            $("#outResume .otherOutResumeRadio").show();
            var str = '\r\n' + '——' + (lg.Cache.has('MyCompany') && lg.Cache.get('MyCompany').shortName ? lg.Cache.get('MyCompany').shortName : $('#UserConpany').val()) + (lg.Cache.get('MyInfo').title ? lg.Cache.get('MyInfo').title : '') + ' ' + $('#UserName').val();
            $('#outresumeContent').val(''+str);
            $('.update-radio').text('切换为淘汰候选人 >>');
        }else{
            $("#outResume .otherOutResumeRadio").hide().empty();
            $("#outResume .outResumeRadio").show();
            $("#outResume .outResumeRadio input").eq(0).click();
            $('.update-radio').text('切换到候选人放弃 >>');
        }
    });
    $('#outresumeContent').on('input propertychange', function (e) {
        $(this).height(parseFloat($(this).css("min-height"))).height(this.scrollHeight - parseFloat($(this).css("padding-top")) - parseFloat($(this).css("padding-bottom")));
    });
    $('#outResume').on('click','.submit', function (e) {
        var data = {};
        if($("#outResume .otherOutResumeRadio").css("display") == 'block'){
            data.reason = lg.getotherOutResumeRadio().getValue().text;
        }else{
            data.reason = lg.getoutResumeRadio ? lg.getoutResumeRadio().getValue().text:'';
        }
        data.content = $('#outresumeContent').val();
        data.resumeId = lg.get('resumeId');
        if($(this).prop('disabled')!='true'){
            $(this).prop('disabled',true);
        }else{
            return;
        }
        var self = this;

        var stage = lg.Cache.Views.piplineLeftView.field['resume_list'].getActiveData().stage;

        // NEW、LINK、INTERVIEW 可勾选是否发邮件
        if( (stage === 'NEW' || stage === 'LINK' || stage === 'INTERVIEW') &&
                (lg.getoutResumeSendNotice && lg.getoutResumeSendNotice().getValue().length>0) ){

            data.needNotice = true;
        } else {
            data.needNotice = false;
        }


        if(data.content.length>500){
            $('#outresumeContent').css('border-color','#fd5f39');
            return;
        }

        $.ajax({
            url:'obsolete.json',
            data:data
        }).success(function (result) {
            if(result.state==1){

                lg.Utils.setLocalStorage('outResumeStoreId',lg.getoutResumeRadio().getValue().id);
                if(lg.Cache.Views.piplineLeftView.field['resume_list'].getActiveData().stage=='INTERVIEW'){
                    lg.Utils.setLocalStorage('outResumeInterviewStoreId',lg.getoutResumeRadio().getValue().id);
                }
                if(lg.getoutResumeAddTagCheckBox().getValue().length>0){
                    $.ajax({
                        url: 'add_tag.json',
                        data: {resumeId: lg.get('resumeId'), tag: '人才储备'},
                        type: "POST"
                    })
                }
                if(lg.getoutResumeComment().getValue().length>0){
                    var resumeId = lg.get('resumeId');
                    var comment = '候选人已淘汰，解释说明：' + $('#outresumeContent').val();
                    $.ajax({
                        method: 'post',
                        url: '../resume/createComment.json',
                        data: {
                            resumeId: resumeId,
                            content: comment
                        }
                    })
                }
                var itemData = lg.Cache.Views.piplineLeftView.field['resume_list'].getActiveData();
                var stageTab = new lg.Widgets.Controls.Tab({name:'stage-tab'});
                stageTab.setStageNum(result.content.data.resumeVo.stage,itemData.stage);
                lg.getpiplineRigetView().getControl('resume_toolbar').init({dataSource:result.content.data.resumeVo});
                lg.getresume_list().updateResume(result.content.data.resumeVo);
                lg.getpiplineRigetView().trigger('updateCommentList');
                lg.getpiplineRigetView().trigger('updateNumbers');
                $('#outResume').modal('hide');
//                $('[href="#outResumeTab"]').parent().hide().parent().find('[href="#resumeProcessTab"]').find('a').trigger('click');
                var confirm = new lg.Widgets.Controls.TopTips({
                    header:!lg.Utils.isNullObject(lg.getresume_list().dataList)?'淘汰成功':'淘汰成功，已为你切换至下一份简历',
                    hasNoBack:true,
                    decoration: "left_list_toptips"
                });


            } else if(result.state==201) {
                var confirm = new lg.Widgets.Controls.Confirm({
                    content:'简历ID不能为空',
                    submitText:"确定",
                    noCancelBtn:true,
                    SubmitBtn:function(e){
                        e.control.setRemove();
                    }
                });
            } else if(result.state==204) {
                var confirm = new lg.Widgets.Controls.Confirm({
                    content:'淘汰原因不合法',
                    submitText:"确定",
                    noCancelBtn:true,
                    SubmitBtn:function(e){
                        e.control.setRemove();
                    }
                });
            } else if(result.state==205) {
                var confirm = new lg.Widgets.Controls.Confirm({
                    content:'解释说明长度不能超过500',
                    submitText:"确定",
                    noCancelBtn:true,
                    SubmitBtn:function(e){
                        e.control.setRemove();
                    }
                });
            } else if(result.state==330) {
                var confirm = new lg.Widgets.Controls.Confirm({
                    content:'无权操作此简历',
                    submitText:"确定",
                    noCancelBtn:true,
                    SubmitBtn:function(e){
                        e.control.setRemove();
                    }
                });
            } else if(result.state==401) {
                var confirm = new lg.Widgets.Controls.Confirm({
                    content:'简历不存在',
                    submitText:"确定",
                    noCancelBtn:true,
                    SubmitBtn:function(e){
                        e.control.setRemove();
                    }
                });
            } else if(result.state==402) {
                var confirm = new lg.Widgets.Controls.Confirm({
                    content:'禁止操作',
                    submitText:"确定",
                    noCancelBtn:true,
                    SubmitBtn:function(e){
                        e.control.setRemove();
                    }
                });
            }else if(result.state == 1997){
                var confirm = new lg.Widgets.Controls.Confirm({
                    content:'<div>页面已失效，请刷新后重试 </div>',
                    submitText:"确定",
                    SubmitBtn:function(e){
                        window.location.reload();
                        e.control.setRemove();
                    },
                    noCancelBtn:true
                });
            }else{
                //window.location.reload();
                var confirm = new lg.Widgets.Controls.Confirm({
                    content:'<div>页面已失效，请刷新后重试(500) </div>',
                    submitText:"确定",
                    SubmitBtn:function(e){
                        window.location.reload();
                        e.control.setRemove();
                    },
                    noCancelBtn:true
                });
            }
            $(self).prop('disabled',false);
        }).fail(function () {
            var confirm = new lg.Widgets.Controls.Confirm({
                content:'<div>页面已失效，请刷新后重试(500) </div>',
                submitText:"确定",
                SubmitBtn:function(e){
                    window.location.reload();
                    e.control.setRemove();
                },
                noCancelBtn:true
            });
        });
    });
});

/*!common/widgets/transmit-resume-pop/main.js*/
;/**
 * 邀请新成员弹窗逻辑
 */

define('common/widgets/transmit-resume-pop/main', ['require', 'exports', 'module', 'common/components/quickstartConfig/main'], function(require, exports, module) {
    var quickstartConfig = require('common/components/quickstartConfig/main');

    if (!quickstartConfig.get('atColleagueHidden')) {
        $('#transmit-resume .at-colleague .hot-bubble-mark').show();
    }
    $('#transmit-resume').on('click', '.at-colleague', function (e) {
        quickstartConfig.set('atColleagueHidden', true);
        $('#transmit-resume .at-colleague .hot-bubble-mark').hide();
    });

    var tab = $('.mds-tab> li');
    tab.each(function(i) {
        $(this).click(function() {
            if($(this).not(':visible')){
                $(this).addClass('active').siblings().removeClass('active');
                $(this).siblings('.tab_active').stop().animate({
                    'left': $(this).offsetParent().context.offsetLeft
                }, 400);
            }else{
                $(this).addClass('active').siblings().removeClass('active');
            }
        });
    });
$('.mds-tab a').click(function (e) {
  e.preventDefault()
  $(this).tab('show');
});
    var myList = [];
    $('.transmit-resume-pop-recruiter-list').on('click','input[name=recruiters]', function (e) {
        var data = [];
        $('.transmit-resume-pop-recruiter-list input[name=recruiters]:checked').each(function(i,ele){
            if($(ele).prop('checked')){
                data[i]=$(ele).val();
            }
        });
        if(data.length>20){
            $(this).prop('checked',false);
            $(this).removeAttr('checked');
        }
    })
    $('#transmit_resume_submit').on('click',function(e){
        var data=[];
        $('.transmit-resume-pop-recruiter-list input[name=recruiters]:checked').each(function(i,ele){
            if($(ele).prop('checked')){
                data[i]=$(ele).val();
            }
        });
        var that=this;
        var member = lg.gettransMemberCheckBoxList().getValue();
        var addInfoStr= '';
        for(var i= 0,len = member.length;i<len;i++){
            for(var j= 0,lenj=lg.Cache.get('allMembers').length;j<lenj;j++){
                if(member[i]==lg.Cache.get('allMembers')[j].userId){
                    addInfoStr+= "[at id='" + member[i] + "' name='" + lg.Cache.get('allMembers')[j].name + "'/] "
                }
            }
        }
        $.ajax({
            url: '../resume/station_forward.json',
            dataType: 'json',
            type:"POST",
            data:{userIds:lg.gettransMemberCheckBoxList().getValue().join(','),resumeId:lg.get('resumeId'),addInfo:addInfoStr+$('#tansAddInfo').val()},
            cache:false
        }).success(function(result) {
            if(result.state==1){
                lg.getpiplineRigetView().trigger('updateCommentList');
                $('#transmit-resume').modal('hide');

            } else if(result.state==241) {
            	alert('最少选择一名同事');
            }
            else{
                alert(result.message);
            }
        })
    });

    $('.invite-tips>a.regetpuburl').on('click',function(e){
        $.ajax({
            url: '../resume/newPubCode.json',
            dataType: 'json',
            data:{resumeId:lg.get('resumeId')},
            cache:false
        }).success(function(result) {
            var url= (window.location.protocol + '//' + window.location.host + '/pub/resume.htm?pubCode='+result.content.data.pubCode);
            $('#invite-input-url').val(url);
        })
    });
    //复制公开链接
    $('#basic-addon2').on('click', function(){
        var text = $('#invite-input-url').val();
        $.ajax({
            url: '../resume/forward.json',
            dataType: 'json',
            data:{resumeId:lg.get('resumeId')},
            cache:false
        }).success(function(result) {
            if(result.state==1){
                lg.getpiplineRigetView().trigger('updateCommentList');
            }
        })
        CopyToClipboard(text);
    });

    //添加邮箱
    $('#invite-email-add').on('click', function(){
        var email_input = '<div class="form-group invite-input invite-email invite-email-list">' +
                            '<input type="email" class="input" placeholder="请输入同事的邮箱">' +
                          '</div>';

        var _me = $(this);

        _me.before(email_input);

    });

    //提交邮箱
    $('.invite-email-submit').on('click', function(){
        var invite_box = $('.invite-box');
        var success = true;
        var params = [];
        invite_box.find('.invite-email-list>input').each(function(i){
            var email = $.trim( $(this).val() );
            if(email.length>0 && !isEmail(email) ) {
                $(this).addClass('error');
                success=false;
            }else{
                $(this).removeClass('error');
            }
            if(email.length>0){
                params[i]=email;
            }
        });
        if(params.length==0){
            $(invite_box.find('.invite-email-list>input')[0]).addClass('error');
            success=false;
        }
        var that = this;
        if(success){
            $.ajax({
                url:"../resume/forward.json",
                data:{emails:params.join(','),resumeId:lg.get('resumeId')},
                type:"POST"
            }).done(function(result){
                if(result.state==1){
                    //$('#transmit-resume .transmit-success-tips').text('简历已成功转发至 '+params[0]+' 等'+(params.length||0)+'个邮箱');
                    //$(that).closest('.modal-content').css('display','none');
                    //$('#transmit-resume .modal-dialog').css('width','654px');
                    //$(that).closest('.modal-content').siblings().css('display','block');
                    $('#transmit-resume').modal('hide');
                    lg.getpiplineRigetView().trigger('updateCommentList');
                }
            });

        }
    });
    $('#transmit-resume .transmit-success').on('click','button', function (e) {
        var invite_box = $('.invite-box');
        var success = true;
        var params = [];
        invite_box.find('.invite-email-list>input').each(function(i){
            var email = $.trim( $(this).val() );
            if(email.length>0 && !isEmail(email) ) {
                $(this).addClass('error');
                success=false;
            }else{
                $(this).removeClass('error');
            }
            if(email.length>0){
                params[i]=email;
            }
        });
        if(params.length==0){
            $(invite_box.find('.invite-email-list>input')[0]).addClass('error');
            success=false;
        }
        var that = this;
        if(success){
            $.ajax({
                url:"../s_invite/inviteAndSharePositions.json",//s_invite/inviteAndSharePositions.json?inviteeEmails=email的数组&positionIds=职位的数组
                data:{inviteeEmails:params.join(','),positionIds:''},
                type:"POST"
            }).done(function(result){
                $('#transmit-resume').modal('hide');
            });
        }
    });
    // $('.invite-box').find('.form-control').each(function(i){
    //  var _me = $(this);
    //  _me.keyup(function(){alert(_me.val())
    //      var email = $.trim( _me.val() );
    //          if( email == '' ) return;
    //          if( isEmail(email) ) {
    //              _me.removeClass('error');
    //          }else{
    //              _me.addClass('error');
    //          }
    //  })
    // })

    //email validate
    function isEmail(str){
        var reg = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
        return reg.test(str);
    }

    //clipboard
    function CopyToClipboard(textToClipboard) {

        var success = true;

        // Internet Explorer
        if (window.clipboardData) {

            window.clipboardData.setData("Text", textToClipboard);

        }
        else {

            // create a temporary element for the execCommand method
            var forExecElement = CreateElementForExecCommand (textToClipboard);

            /* Select the contents of the element
                (the execCommand for 'copy' method works on the selection) */
            SelectContent (forExecElement);

            var supported = true;

            // UniversalXPConnect privilege is required for clipboard access in Firefox
            try {
                if (window.netscape && netscape.security) {
                    netscape.security.PrivilegeManager.enablePrivilege ("UniversalXPConnect");
                }

                // Copy the selected content to the clipboard
                // Works in Firefox and in Safari before version 5
                success = document.execCommand ("copy", false, null);
            }
            catch (e) {
                success = false;
            }

            // remove the temporary element
            document.body.removeChild (forExecElement);

        }

        if (success) {
            alert ("复制成功");
        }
        else {
            alert ("复制失败，请手动复制该链接");
        }

    }

    function CreateElementForExecCommand (textToClipboard) {
        var forExecElement = document.createElement ("div");
        // place outside the visible area
        forExecElement.style.position = "absolute";
        forExecElement.style.left = "-10000px";
        forExecElement.style.top = "-10000px";
        // write the necessary text into the element and append to the document
        forExecElement.textContent = textToClipboard;
        document.body.appendChild (forExecElement);
        // the contentEditable mode is necessary for the  execCommand method in Firefox
        forExecElement.contentEditable = true;

        return forExecElement;
    }

    function SelectContent (element) {
        // first create a range
        var rangeToSelect = document.createRange ();
        rangeToSelect.selectNodeContents (element);

        // select the contents
        var selection = window.getSelection ();
        selection.removeAllRanges ();
        selection.addRange (rangeToSelect);
    }



});

/*!common/widgets/arr_inerview-pop/main.js*/
;/**
 * 邀请新成员弹窗逻辑
 */

define('common/widgets/arr_inerview-pop/main', ['require', 'exports', 'module'], function(require, exports, module) {

    $("#interviewTime").datetimepicker({
        step: 30,
        allowTimes:[
            '07:00',
            '07:30',
            '08:00',
            '08:30',
            '09:00',
            '09:30',
            '10:00',
            '10:30',
            '11:00',
            '11:30',
            '12:00',
            '12:30',
            '13:00',
            '13:30',
            '14:00',
            '14:30',
            '15:00',
            '15:30',
            '16:00',
            '16:30',
            '17:00',
            '17:30',
            '18:00',
            '18:30',
            '19:00',
            '19:30',
            '20:00',
            '20:30',
            '21:00',
            '21:30',
            '22:00',
            '22:30',
            '23:00',
            '23:30'
        ]
    });
    function getStageText(stage){
        var stageList = {
            'NEW':'新简历',
            'LINK':'待沟通',
            'INTERVIEW':'面试',
            'OFFER':'待录用',
            'CHECK_IN':'待入职',
            'EMPLOYED':'已入职',
            'OBSOLETE':'淘汰'
        }
        return stageList[stage];
    }
    if(!lg.Cache.has('allMembers')){
        $.ajax({
            url: '../member/all_members.json',
            dataType: 'json',
            cache: false
        }).success(function (result) {
            if (result.state == 1) {
                lg.Cache.set('allMembers',result.content.data.members);
                if (result.state == 1) {
                    initEmailList(lg.Cache.get('allMembers'));
                }
            }
        });
    }else{
        initEmailList(lg.Cache.get('allMembers'));
    }
    function initEmailList (data){
        var inviteEmailPhone = new lg.Views.BaseView({
            name: 'inviteEmailPhone',
            fields: [{
                name: 'inviteEmailFilterSelect1',
                placeHolder: '请输入同事的邮箱地址，选填',
                showSelect:true,
                showKey:'showEmail',
                key: 'name email receiveEmail',
                dataSource: getFilterMembers(data),
                showMessage:true,
                validRules: [{
                    mode: 'pattern',
                    isUse: true,
                    status: false,
                    data:{nolen:/^\S{0,0}$/,email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i},
                    message: '请输入有效的邮箱'
                }],
                controlType: "FilterSelect"
            }, {
                name: 'invitePhone1',
                showMessage:true,
                validRules: [{
                    mode: 'pattern',
                    data:{phone:/^(0|86|17951)?((13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[57])[0-9]{8})$/,nolen:/^\S{0,0}$/},
                    message: '请输入有效的手机号'
                }],
                controlType: "TextBox"
            },{
                name: 'inviteEmailFilterSelect2',
                placeHolder: '请输入同事的邮箱地址，选填',
                showSelect:true,
                showKey:'showEmail',
                key: 'name email receiveEmail',
                dataSource: getFilterMembers(data),
                showMessage:true,
                validRules: [{
                    mode: 'pattern',
                    isUse: true,
                    status: false,
                    data:{nolen:/^\S{0,0}$/,email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i},
                    message: '请输入有效的邮箱'
                }],
                controlType: "FilterSelect"
            }, {
                name: 'invitePhone2',
                showMessage:true,
                validRules: [{
                    mode: 'pattern',
                    data:{phone:/^(0|86|17951)?((13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[57])[0-9]{8})$/,nolen:/^\S{0,0}$/},
                    message: '请输入有效的手机号'
                }],
                controlType: "TextBox"
            }]
        });
        lg.getinviteEmailFilterSelect1().on('select', function (e) {
            e.itemData.isChecked = true;
            if(e.itemData.phone || e.itemData.contact){
                lg.getinvitePhone1().setValue(e.itemData.contact || e.itemData.phone);
            };
        });
    }
    function getFilterMembers (data){
        var transFilterList = [];
        for (var i = 0, len = data.length; i < len; i++) {
            var item = {};
            $.extend(item,data[i]);
            transFilterList.push(item);
            transFilterList[i].showEmail = transFilterList[i].email ? transFilterList[i].email: transFilterList[i].receiveEmail;
            transFilterList[i].email = transFilterList[i].email ? transFilterList[i].email.substring(0, transFilterList[i].email.indexOf('@')) : transFilterList[i].email;
            transFilterList[i].receiveEmail = transFilterList[i].receiveEmail ? transFilterList[i].receiveEmail.substring(0, transFilterList[i].receiveEmail.indexOf('@')) : transFilterList[i].receiveEmail;
        }
        return transFilterList;
    }
    //添加邮箱
    $('#interview-email-phone-add').on('click', function(){
        var parent = $('[data-view="inviteEmailPhone"]');
        var index = $('[data-view="inviteEmailPhone"]').find('[data-propertyname]').length/2+1;
        var email_input =   '<div class="invite-input filter-select" data-propertyname="inviteEmailFilterSelect'+index+'">' +
                                '<input type="text" class="input" placeholder="面试官邮箱地址">' +
                            '</div>'+
                            '<div class="invite-input " data-propertyname="invitePhone'+index+'">' +
                                '<input type="text" class="input" placeholder="手机号，用于面试前提醒">' +
                            '</div>';
        //添加元素
        parent.append(email_input);

        lg.getinviteEmailPhone().addControls([{
                name: 'inviteEmailFilterSelect'+index,
                placeHolder: '面试官邮箱地址',
                showSelect:true,
                showKey:'showEmail',
                key: 'name email receiveEmail',
                dataSource: getFilterMembers(lg.Cache.get('allMembers')),
                showMessage:true,
                validRules: [{
                    mode: 'pattern',
                    isUse: true,
                    status: false,
                    data:{nolen:/^\S{0,0}$/,email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i},
                    message: '请输入有效的邮箱'
                }],
                controlType: "FilterSelect"
            }, {
                name: 'invitePhone'+index,
                showMessage:true,
                validRules: [{
                    mode: 'pattern',
                    data:{phone:/^(0|86|17951)?((13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[57])[0-9]{8})$/,nolen:/^\S{0,0}$/},
                    message: '请输入有效的手机号'
                }],
                controlType: "TextBox"
            }]);
        lg['getinviteEmailFilterSelect'+index]().on('select', function (e) {
            e.itemData.isChecked = true;
            e.itemData.isChecked = true;
            if(e.itemData.phone || e.itemData.contact){
                lg['getinvitePhone'+index]().setValue(e.itemData.contact || e.itemData.phone);
            };
        });
    });

    // 点击移动到面试中的移动
    $('#btnMove').on( 'click', function () {
        $.ajax({
            url: 'move_to_interview.json',
            data: {
                resumeId: lg.get('resumeId')
            },
            type: 'POST',
            dataType: 'json',
            success: function ( result ) {

                // 获取当前阶段： 需要区分候选人页面和简历详情页
                var $stageEle = $('.content-container .top-left .job-tag');
                var nowStage = $stageEle.text().trim();
                if( result.state == 1 ) {
                    if(!nowStage){
                        lg.getpiplineRigetView().trigger('updateNumbers');
                        var itemData = lg.Cache.Views.piplineLeftView.field['resume_list'].getActiveData();
                        var itemStage = lg.Cache.Views.piplineLeftView.field['resume_list'].getSubInfo(itemData.stage);
                        var stageTab = new lg.Widgets.Controls.Tab({name:'stage-tab'});
                        if(itemData.stage!=result.content.data.resumeVo.stage){
                            stageTab.setStageNum(result.content.data.resumeVo.stage,itemData.stage);
                        }

                        lg.getpiplineRigetView().getControl('resume_toolbar').setStage(itemStage.nextStage);

                        lg.getpiplineRigetView().getControl('resume_toolbar').init({dataSource:result.content.data.resumeVo});
                        lg.getresume_list().updateResume(result.content.data.resumeVo);

                        lg.getpiplineRigetView().getControl('resume_toolbar').setDisableDelay(false,3000);

                    }
                    else {
                        lg.getpiplineRigetView().getControl('resume_toolbar').setStage('INTERVIEW');
                        lg.getpiplineRigetView().getControl('resume_toolbar').init({dataSource:result.content.data.resumeVo});
                        $stageEle.text( '面试' );
                    }

                    $('#arr_inerview').modal('hide');
                    var confirm = new lg.Widgets.Controls.TopTips({
                        header:result.content.data.resumeVo.candidateName+'已进入 <span style="color:#0099ff">'+getStageText(result.content.data.resumeVo.stage)+'</span> 阶段',
                        hasNoBack:true,
                        decoration: "left_list_toptips"
                    });
                    lg.getpiplineRigetView().trigger('updateCommentList');
                    $('.interview-again').show().find('a').show();
                }
            },
            error: function ( result ) {
                console.log( 'move_to_interview.json' + '请求出错' );
            }
        });
    });

    // 点击发送面试信息中的按钮
    $('.interview-email-submit').on('click',function(e){
        var itemTemplate = lg.getarrInterViewAddressList().getValue();
        if(!lg.getarrInterViewAddressList().getValue()){
            if($('.address-edite').css('display')=='none'){
                $('.add-address').trigger('click');
                $('.address-edite').find('.interview-address-submit').trigger('click');
                var confirm = new lg.Widgets.Controls.Confirm({
                    content:'请先保存面试信息',
                    submitText:"确定",
                    SubmitBtn:function(e){
                        e.control.setRemove();
                    },
                    noCancelBtn:true
                });
            }else{
                var isValidate = lg.gettemplateView().CollectData().isValidate;
                var confirm = new lg.Widgets.Controls.Confirm({
                    content:'请先保存面试信息',
                    submitText:"确定",
                    SubmitBtn:function(e){
                        e.control.setRemove();
                    },
                    noCancelBtn:true
                });
            }
            return;
        }
        var params = {
            resumeId:lg.get('resumeId'),
            linkMan:itemTemplate.linkMan,
            templateId:itemTemplate.id,
            linkPhone:itemTemplate.linkPhone,
            address:itemTemplate.address,
            interviewTime:$('#interviewTime').val(),
            addInfo:$('#addInfo').val(),
            sendNotice:lg.getsetArrInterViewSendNotic().getValue().length>0?1:0,
            templateName:itemTemplate.templateName
        };
        if(!params.linkMan || !params.linkPhone || !params.address){
            var confirm = new lg.Widgets.Controls.Confirm({
                content:'<div>请<a style="color: #0099ff;" href="../settings/template/interview_temlate.htm">前往招聘设置</a>，补全面试信息</div>',
                submitText:"确定",
                SubmitBtn:function(e){
                    window.location.href = '../settings/template/interview_temlate.htm';
                    e.control.setRemove();
                },
                noCancelBtn:true
            });
            return;
        }
        var invite_box = $('.invite-box');
        var addInfo = $('#addInfo').val();

        if(addInfo.length>500){
            success=false;
            $('#addInfo').addClass('error');
        }else{
            $('#addInfo').removeClass('error');
        }
        var memberListData = lg.getinviteEmailPhone().CollectData();

        if(memberListData.isValidate&&(addInfo.length>0 && addInfo.length<500||addInfo.length==0)){
            if($('[data-view="inviteEmailPhone"] [data-propertyname]').length){
                params.forwardEmails = [];
                params.forwardPhones = [];
                for(var i= 0,len=(($('[data-view="inviteEmailPhone"] [data-propertyname]').length)/2);i<len;i++){
                    if(memberListData['inviteEmailFilterSelect'+(i+1)] || memberListData['invitePhone'+(i+1)]){
                        params.forwardEmails.push(memberListData['inviteEmailFilterSelect'+(i+1)]);
                        params.forwardPhones.push(memberListData['invitePhone'+(i+1)]);
                    }
                }
                params.forwardEmails.length>0 ? params.forwardEmails = params.forwardEmails.join(','):(delete params.forwardEmails);
                params.forwardPhones.length>0 ? params.forwardPhones = params.forwardPhones.join(','):(delete params.forwardPhones);
            }
            if(!params.interviewTime){
                $('#interviewTime').addClass('error');
                return;
            }else{
                $('#interviewTime').removeClass('error');
            }
            params.interviewTimeStr = params.interviewTime+':00';
            params.interviewTime = new Date(params.interviewTime.replace(/-/g,'/')).getTime();
            console.log(params);

            $.ajax({
                url:'arr_inerview.json',
                type:'POST',
                data:params
            }).success(function(result){
                if(result.state==1){
                    if(params.forwardEmails && params.forwardEmails.split(',').length>0 || params.forwardPhones && params.forwardPhones.split(',').length>0){
                        var positionEmailList = lg.Utils.getLocalStorage('positionEmailList') ||{};
                        positionEmailList[lg.Cache.Views.piplineLeftView.field['resume_list'].getActiveData().positionId] = {
                            forwardEmails:params.forwardEmails,
                            forwardPhones:params.forwardPhones,
                            length:params.forwardEmails.split(',').length
                        };
                        lg.Utils.setLocalStorage('positionEmailList',positionEmailList);
                    }
                    if(params.addInfo.length){
                        var positionAddInfoList = lg.Utils.getLocalStorage('positionAddInfoList') ||{};
                        positionAddInfoList[lg.Cache.Views.piplineLeftView.field['resume_list'].getActiveData().positionId] = $('#addInfo').val();
                        lg.Utils.setLocalStorage('positionAddInfoList',positionAddInfoList);
                    }
                    lg.getpiplineRigetView().trigger('updateNumbers');
                    var itemData = lg.Cache.Views.piplineLeftView.field['resume_list'].getActiveData();
                    var itemStage = lg.Cache.Views.piplineLeftView.field['resume_list'].getSubInfo(itemData.stage);
                    var stageTab = new lg.Widgets.Controls.Tab({name:'stage-tab'});
                    if(itemData.stage!=result.content.data.resumeVo.stage){
                        stageTab.setStageNum(result.content.data.resumeVo.stage,itemData.stage);
                    }

                    lg.getpiplineRigetView().getControl('resume_toolbar').setStage(itemStage.nextStage);

                    lg.getpiplineRigetView().getControl('resume_toolbar').init({dataSource:result.content.data.resumeVo});
                    lg.getresume_list().updateResume(result.content.data.resumeVo);

                    lg.getpiplineRigetView().getControl('resume_toolbar').setDisableDelay(false,3000);
                    lg.getpiplineRigetView().getControl('resume_toolbar').setStage('INTERVIEW');
                    lg.getpiplineRigetView().getControl('resume_toolbar').init({dataSource:result.content.data.resumeVo});
                    $('#arr_inerview').modal('hide');
                    var confirm = new lg.Widgets.Controls.TopTips({
                        header:result.content.data.resumeVo.candidateName+'已进入 <span style="color:#0099ff">'+getStageText(result.content.data.resumeVo.stage)+'</span> 阶段',
                        hasNoBack:true,
                        decoration: "left_list_toptips"
                    });
                    lg.getpiplineRigetView().trigger('updateCommentList');
                } else if (result.state==207) {
                    $('#addInfo').addClass('error');
                }else if (result.state==206) {
                    $('#arr_inerview .error-tips').show();
                    $('#arr_inerview .icon-warning').show();
                }else if(result.state == 1997){
                    var confirm = new lg.Widgets.Controls.Confirm({
                        content:'<div>页面已失效，请刷新后重试 </div>',
                        submitText:"确定",
                        SubmitBtn:function(e){
                            window.location.reload();
                            e.control.setRemove();
                        },
                        noCancelBtn:true
                    });
                }else if(result.state == 405){
	                var confirm = new lg.Widgets.Controls.Confirm({
		                content:'<div>'+(result.message||'')+'</div>',
		                submitText:"确定",
		                SubmitBtn:function(e){
			                $('#interviewTime').keydown().focus();
			                e.control.setRemove();
		                },
		                noCancelBtn:true
	                });
                } else {
                    $('#arr_inerview .error-tips').hide();
                    $('#arr_inerview .icon-warning').hide();
                    var confirm = new lg.Widgets.Controls.Confirm({
                        content:'<div>页面已失效，请刷新后重试('+result.state+') </div>',
                        submitText:"确定",
                        SubmitBtn:function(e){
                            window.location.reload();
                            e.control.setRemove();
                        },
                        noCancelBtn:true
                    });
                }
            }).fail(function () {
                var confirm = new lg.Widgets.Controls.Confirm({
                    content:'<div>页面已失效，请刷新后重试(500) </div>',
                    submitText:"确定",
                    SubmitBtn:function(e){
                        window.location.reload();
                        e.control.setRemove();
                    },
                    noCancelBtn:true
                });
            });
        }
    });
    //提交邮箱
    //email validate
    function isEmail(str){
        var reg = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
        return reg.test(str);
    }
    //声明变量标记是否点击预览
    var interview_sign = false;
    //面试邮件预览
    $('.interview-preview-btn').on('click', function (e) {
        var itemTemplate = lg.getarrInterViewAddressList().getValue();
        if(!lg.getarrInterViewAddressList().getValue()){
            if($('.address-edite').css('display')=='none'){
                $('.add-address').trigger('click');
                $('.address-edite').find('.interview-address-submit').trigger('click');
                var confirm = new lg.Widgets.Controls.Confirm({
                    content:'请先保存面试信息',
                    submitText:"确定",
                    SubmitBtn:function(e){
                        e.control.setRemove();
                    },
                    noCancelBtn:true
                });
            }else{
                var isValidate = lg.gettemplateView().CollectData().isValidate;
                var confirm = new lg.Widgets.Controls.Confirm({
                    content:'请先保存面试信息',
                    submitText:"确定",
                    SubmitBtn:function(e){
                        e.control.setRemove();
                    },
                    noCancelBtn:true
                });
            }
            return;
        }
        var params = {
            resumeId:lg.get('resumeId'),
            linkMan:itemTemplate.linkMan,
            templateId:itemTemplate.id,
            linkPhone:itemTemplate.linkPhone,
            address:itemTemplate.address,
            interviewTime:$('#interviewTime').val(),
            addInfo:$('#addInfo').val(),
            sendNotice:lg.getsetArrInterViewSendNotic().getValue().length>0?1:0,
            templateName:itemTemplate.templateName
        };
        var forwardEmails = [];
        var invite_box = $('.invite-box');
        var success = true;
        invite_box.find('.invite-email-list>input').each(function(i,ele){
            var email = $.trim( $(this).val() );
            if(email.length>0 && !isEmail(email) ) {
                $(this).addClass('error');
                success=false;
            }else{
                $(this).removeClass('error');
            }
            if(email.length>0){
                forwardEmails.push(email);
            }
        });
        if(forwardEmails.length==0){
            $(invite_box.find('.invite-email-list>input')[0]).addClass('error');
            success=false;
        }
        var addInfo = $('#addInfo').val();

        if(addInfo.length>500){
            success=false;
            $('#addInfo').addClass('error');
        }else{
            $('#addInfo').removeClass('error');
        }
        if((forwardEmails.length>0&&success&&(addInfo.length>0 && addInfo.length<500||addInfo.length==0))||(forwardEmails.length==0&&(addInfo.length>0 && addInfo.length<500||addInfo.length==0))) {
            params.forwardEmails = forwardEmails.join(',');
            if (!params.interviewTime) {
                $('#interviewTime').addClass('error');
                return;
            } else {
                $('#interviewTime').removeClass('error');
            }
            var data = {
                linkMan:itemTemplate.linkMan,
                templateId:itemTemplate.id,
                linkPhone:itemTemplate.linkPhone,
                address:itemTemplate.address,
                interviewTime:$('#interviewTime').val(),
            };
            $('#arr_inerview .company-info').empty();
            $('#arr_inerview .company-info').append('<div><span class="position">'+lg.Cache.Views.piplineLeftView.field['resume_list'].getActiveData().positionName+'</span>面试邀请 - <span class="company">'+(lg.Cache.has('MyCompany') && lg.Cache.get('MyCompany').shortName?lg.Cache.get('MyCompany').shortName:$('#UserConpany').val())+'</span></div><div class="can-info">发给：<span class="can-info-email">'+lg.Cache.Views.piplineLeftView.field['resume_list'].getActiveData().candidateName+'</span></div>');
            $('#arr_inerview .email-to').text(lg.Cache.Views.piplineLeftView.field['resume_list'].getActiveData().candidateName+'，您好～');
            $('#arr_inerview .interview-info').empty();
            var html = '';
            html += (data.interviewTime?'<li>面试公司：<span>'+(lg.Cache.has('MyCompany') && lg.Cache.get('MyCompany').shortName?lg.Cache.get('MyCompany').shortName:$('#UserConpany').val())+'</span></li>':'');
            html += (data.interviewTime?'<li>面试职位：<span>'+lg.Cache.Views.piplineLeftView.field['resume_list'].getActiveData().positionName+'</span></li>':'');
            html += (data.interviewTime?'<li>面试时间：<span>'+data.interviewTime+'</span></li>':'');
            html += (data.address?'<li>面试地点：<span>'+data.address+'</span></li>':'');
            html += (data.linkMan?'<li>联系人：<span>'+data.linkMan+'</span></li>':'');
            html += (data.linkPhone?'<li>联系电话：<span>'+data.linkPhone+'</span></li>':'');
            $('#arr_inerview .interview-info').append(html);
            function replaceTextarea1(str){
                var reg=new RegExp("\n","g");
                var reg1=new RegExp(" ","g");

                str = str.replace(reg,"<br>");
                str = str.replace(reg1,"<p>");

                return str;
            }
            $('#arr_inerview .preview-interview .description').html(replaceTextarea1($('#addInfo').val()));
            $(this).closest('.modal-content').css('display','none');
            $('#arr_inerview .modal-dialog').css('width','654px');
            $(this).closest('.modal-content').siblings().css('display','block');
            interview_sign = true;
        }

    });
    //返回修改面试邮件
    $('.back-interview-btn').on('click', function (e) {
        interview_sign = false;
        $(this).closest('.modal-content').css('display','none');
        $('#arr_inerview .modal-dialog').css('width','764px');
        $(this).closest('.modal-content').siblings().css('display','block');
    });
    $('.interview-preview-submit-btn').on('click', function (e) {
        interview_sign = false;
        $('#arr_inerview .interview-email-submit').trigger('click');
    });

    //切换到移动到面试
    $('.titles-move').on('click',function(){
        $('#arr_inerview .titles-move').addClass('titles-active');
        $('#arr_inerview .titles-send').removeClass('titles-active');
        $('#invited-information').hide();
        $('#invited-moveto-interview').show();
    });

    //预览页面切换到移动到面试
    $('.titles-move-preview').on('click',function(){
        if($('.titles-move-preview').hasClass('no-show')){
            return;
        }
        $('#arr_inerview .titles-move').addClass('titles-active');
        $('#arr_inerview .titles-send').removeClass('titles-active');
        $('#invited-information').hide();
        $('#invited-moveto-interview').show();
        $(this).closest('.modal-content').css('display','none');
        $(this).closest('.modal-content').siblings().css('display','block');
    });

    //切换到面试信息
    $('.titles-send').on('click',function(){
        if(interview_sign){
            $(this).closest('.modal-content').css('display','none');
            $(this).closest('.modal-content').siblings().css('display','block');
        }
        $('#arr_inerview .titles-move').removeClass('titles-active');
        $('#arr_inerview .titles-send').addClass('titles-active');
        $('#invited-information').show();
        $('#invited-moveto-interview').hide();
    });

    //判断选择的面试时间是否是过去时间
    $('#interviewTime').on('change', function (e) {
        if(new Date().getTime()-new Date($(this).val().replace(/-/g,'/')).getTime()>0){
            ($(this).parent().find('.input_tips').length == 0)&&$(this).after('<span class="input_tips" data-valid-message style="line-height: 35px;margin-left: 10px;">所选时间发生在过去</span>');
        }else{
            ($(this).parent().find('.input_tips').length > 0)&&$(this).parent().find('.input_tips').remove();
        }
    });
});

/*!piplines/page/piplines-list/main.js*/
;/**
 * B端主页业务入口文件
 * 此文件应当只包含：
 *     require( 'xxx' );
 *     require( 'xxx' );
 * 等语句，每一个require为每一个子模块的入口文件
 *
 * @author stormlu@lagou.com
 */

define('piplines/page/piplines-list/main', ['require', 'exports', 'module', 'common/widgets/header/main', 'common/widgets/navigation/main', 'dep/jquery-placeholder/jquery.placeholder', 'dep/datetimepicker/jquery.datetimepicker', 'common/components/jquery-niceScroll/jquery.nicescroll.min', 'dep/history.js/scripts/bundled-uncompressed/html4+html5/jquery.history', 'common/static/js/lagou.mini', 'common/static/js/modules/FormControls', 'common/static/js/modules/Tab', 'common/components/userPhoto/main', 'common/components/userInfomationView/main', 'common/components/topTips/main', 'common/components/toolBar/main', 'common/components/text/main', 'common/components/memberCheckBoxList/main', 'common/components/filterSelect/main', 'common/components/filterGridView/main', 'common/components/cooperatorList/main', 'common/components/commentList/main', 'common/components/cartList/main', 'common/components/resumePreviewToolBar/main', 'common/components/tags/main', 'common/components/radio/main', 'common/components/checkbox/main', 'common/components/interviewInfomation/main', 'common/components/datepicker/main', "common/components/push/NotifyClient", 'piplines/modules/left-list/main', 'piplines/modules/right-detail/main', 'common/widgets/add-recruiter-pop/main', 'common/widgets/out-resume-pop/main', 'common/widgets/transmit-resume-pop/main', 'common/widgets/arr_inerview-pop/main'], function(require, exports, module) {

    require('common/widgets/header/main');
    require('common/widgets/navigation/main');

    require('dep/jquery-placeholder/jquery.placeholder');
    require('dep/datetimepicker/jquery.datetimepicker');
    require('common/components/jquery-niceScroll/jquery.nicescroll.min');
    require('dep/history.js/scripts/bundled-uncompressed/html4+html5/jquery.history');

    //拉勾 框架
    require('common/static/js/lagou.mini');

    //控件
    require('common/static/js/modules/FormControls');
    require('common/static/js/modules/Tab');
    require('common/components/userPhoto/main');
    require('common/components/userInfomationView/main');
    require('common/components/topTips/main');
    require('common/components/toolBar/main');
    require('common/components/text/main');
    require('common/components/memberCheckBoxList/main');
    require('common/components/filterSelect/main');
    require('common/components/filterGridView/main');
    require('common/components/cooperatorList/main');
    require('common/components/commentList/main');
    require('common/components/cartList/main');
    require('common/components/resumePreviewToolBar/main');
    require('common/components/tags/main');
    require('common/components/radio/main');
    require('common/components/checkbox/main');
    require('common/components/interviewInfomation/main');
    //日历
    require('common/components/datepicker/main');
    $('body').niceScroll({'cursorborder':'none',cursorcolor:'#aeb1b3','cursorwidth':'6px','scrollspeed':'6'});

    lg.QueryString();
    lg.set('positionId',$('.position_dropdown_toggle').attr('data-position-id'));

    lg.set('stage',$('.pipline-tab li.active a').attr('data-stage'));
    lg.UpdateUrl();
    if(lg.get('positionId')==0){
        $('.top-position-tab').find('[data-position-id-tab="0"]').closest('li').addClass('active');
    }else if(lg.get('positionId')==-1){
        $('.top-position-tab').find('[data-position-id-tab="-1"]').closest('li').addClass('active');
    }else{
        $('.top-position-tab').find('[data-position-id-tab="list"]').addClass('active');
    }
    $('.pipline-position-dropdown .dropdown-menu a,.top-position-tab>ul>li>a').on('click',function(e){
        lg.QueryString();
        lg.set('positionId',$(this).attr('data-position-id')||$(this).attr('data-position-id-tab'));
        lg.set('stage',$('.pipline-tab').find('li.active a').attr('data-stage'));
        if(lg.get('positionId')==-1 && lg.getnewGuid().getBubbleHandler('AtSelfAndTransformResumeGuid','transformResumeHover').length==1){
            lg.getnewGuid().getNext('AtSelfAndTransformResumeGuid','transformResumeHover');
        }
        window.location.href=lg.getCurrentUrl();
    });
    lg.getnewGuid().update('MockResumeGuid','piplineHover');
    //新简历接受新简历消息
    var notifyClient = require("common/components/push/NotifyClient");
    notifyClient.bind('FIND_NEW_STAGE_RESUME', function (event, content) {
        var item = JSON.parse(content);
        //loadUnReadNotifications();  // 有消息发过来, 查询一次
        setTimeout(function () {
            $.ajax({
                url:'../resume/'+item.id+'.json'
            }).success(function (data) {
                if(data.state==1){
                    var itemData = {};
                    $.extend(itemData, data.content.data.resumeVo);
                    if(typeof lg != 'undefined' && typeof lg.getresume_list != 'undefined' && ($('.pipline-tab .active a[data-stage="NEW"]').length>0) && typeof itemData !='undefined' && itemData.stage=="NEW"){
                       if(($('.top-position-tab li.active a[data-position-id-tab="0"]').length>0) && ($('#UserConpanyId').val()==itemData.companyId)){
                            if(!lg.getresume_list().dataList[itemData.id]){
                                var num = $($('.pipline-tab').find('[data-stage="NEW"]').find('span')[1]).text();
                                num = num.substr(1,num.length-2);
                                $('.pipline-tab').find('[data-stage="NEW"]').html('<span>新简历</span><span>（'+(1+parseInt(num))+'）</span>').attr('data-stagenum',(1+parseInt(num)));
                            };
                            lg.getresume_list().updateResume(itemData,true);
                        }else{
                            if($('.position_dropdown_toggle').attr('data-position-id')==itemData.positionId && $('#UserConpanyId').val()==itemData.companyId){
                                if(!lg.getresume_list().dataList[itemData.id]){
                                    var num = $($('.pipline-tab').find('[data-stage="NEW"]').find('span')[1]).text();
                                    num = num.substr(1,num.length-2);
                                    $('.pipline-tab').find('[data-stage="NEW"]').html('<span>新简历</span><span>（'+(1+parseInt(num))+'）</span>').attr('data-stagenum',(1+parseInt(num)))
                                }
                                lg.getresume_list().updateResume(itemData,true);

                            }
                        }
                    };
                    if(typeof lg != 'undefined' && typeof lg.getpiplineRigetView != 'undefined'){
                        lg.getpiplineRigetView().trigger('updateNumbers',itemData);
                    };

                }
            });
        },10000)
    });

    $('.pipline-tab').find('a').on('click',function (e) {
        if($(this).hasClass('outresume')){
            window.open('../resume/list.htm@resumeType=3');
            return;
        };
        lg.QueryString();
        var stage = $(this).attr('data-stage');
        var positionId = $('.pipline-position-dropdown').find('.position_dropdown_toggle').attr('data-position-id');
        lg.set('stage',stage);
        lg.set('positionId',positionId);
        window.location.href=lg.getCurrentUrl();
        if($(this).attr('data-stage')=="LINK"){
            lg.getnewGuid().getNext('AtSelfAndTransformResumeGuid','LinkHover');
        }
    });
    require('piplines/modules/left-list/main');
    require('piplines/modules/right-detail/main');
    require('common/widgets/add-recruiter-pop/main');
    require('common/widgets/out-resume-pop/main');
    require('common/widgets/transmit-resume-pop/main');
    require('common/widgets/arr_inerview-pop/main');
    $.ajax({
        url:'../position/queryPositionsOfMine.json'
    }).success(function(result){
        if(result.state==1){
        	var positionId=lg.get('positionId');
        	if(positionId==-1) {
        		$(".content-header").hide();
        		$(".content-list").css('top','94px');
        		$(".content-list").css('border-top','1px solid #d5dadf');
        	}


            var html = '';
            for(var i= 0,len=result.content.data.positions.length;i<len;i++){
                var position = result.content.data.positions[i];
                html+='<li ><a data-position-id="'+position.positionId+'" data-position-name="' + position.positionName + '" data-position-department="'+ position.department +'" data-position-channel-name="' + position.channelName + '" title="'+(position.department?position.positionName+' / '+position.department:position.positionName)+(position.channelName?' - '+position.channelName:'')+'" >'+(position.department?position.positionName+' / '+position.department:position.positionName)+(position.channelName?' - '+position.channelName:'')+'</a></li>';
            }

            $('.pipline-position-dropdown .toggle_menu').append('<ul style="max-height: 400px;overflow: auto;">'+html+'</ul>');
        }
    });

    $('.pipline-position-dropdown .toggle_menu').on('click','a',function(e){
        var positionId = $(this).attr('data-position-id');
        lg.set('positionId',positionId);
        lg.getnewGuid().getNext('sharePositionGuid','positionItemHover');
        window.location.href=lg.getCurrentUrl();
    });
    $.ajax({
        url:'cout_tip_cooperator_resume.json'
    }).success(function (result) {
        var num = result.content.data.count?result.content.data.count:'0';
        if(num >= 99){
            num = 99;
            $('.top-position-tab .tans').find('a').html('转发给我的简历<span class="tip-num">'+num+'</span>')
        }else if(num == 0){
            $('.top-position-tab .tans').find('a').html('转发给我的简历').css("padding-right","0");
        }else{
            $('.top-position-tab .tans').find('a').html('转发给我的简历<span class="tip-num">'+num+'</span>')
        }
    });
    $('.addCans').on('click', function (e) {
        var confirm = new lg.Widgets.Controls.Confirm({
            content:'<div>请输入候选人的基本信息</div>'
            +'<div data-view="addCansView" class="addCansView">'
            +'<div class="candidateName" data-propertyname="candidateName"><input class="input" type="text" placeholder="姓名(必填)" /></div>'
            +'<div class="email" data-propertyname="email"><input class="input" type="text" placeholder="邮箱(必填)" /></div>'
            +'<div class="phone" data-propertyname="phone"><input class="input" type="text" placeholder="手机(必填)" /></div>'
            +'<div class="channel clearfix" data-propertyname="channel"><select id="channel"><option value="-1">自有渠道</option><option value="-2">内部推荐</option></select></div>'
            +'<div class="file clearfix" data-propertyname="file"><button class="btn btn_active btn_green" style="padding:0 20px;height:36px;line-height:36px;">上传简历</button><div id="fileName" style="display:none;"></div><input style="display: none;" name="file" id="file" type="file" multiple="multiple" /></div>'
            +'<div class="description clearfix" data-propertyname="description"><textarea class="textarea"  placeholder="描述" /></div>'
            +'</div>',
            submitText:"添加候选人",
            name:'addCans',
            cancelText:"取消",
            SubmitBtn:function(e){

                var that = e;
                var params = addCansView.CollectData();
                if (params.isValidate) {
                    params.positionId = lg.get('positionId');
                    params.channelId = $('#channel').val();
                    wrapElement($('#file'),params);
                    $('#file').parent('form').submit(function(e) { e.stopPropagation(); }).submit();
                }else{
                    e.control.isClose=false;
                    addCansView.getControl('description').showMessage({
                        message: '请输入正确的候选人信息'
                    });
                }
            },
            CancelBtn:function(e){

            }
        });
        var handleResponse = function(loadedFrame, element) {
            var result, responseStr = $(loadedFrame).contents().text();
            try {
                result = JSON.parse(responseStr);
            } catch(e) {
                result = responseStr;
            }

            // Tear-down the wrapper form
            element.siblings().remove();
            element.unwrap();

            var stateList = {
                1: {message: "成功",linkFor: 'description',level: 'info'},
                201: {message: "职位Id不能为空",linkFor: 'description',level: 'info'},
                202: {message: "渠道Id不能为空",linkFor: 'description',level: 'info'},
                203: {message: "candidatenName不能为空",linkFor: 'description',level: 'info'},
                204: {message: "email格式不对",linkFor: 'description',level: 'info'},
                205: {message: "phone格式不对",linkFor: 'description',level: 'info'},
                206: {message: "文件过大：请上传10M以内的简历",linkFor: 'description',level: 'info'},
                207: {message: "请上传pdf、doc、docx、txt格式的简历",linkFor: 'description',level: 'info'},
                330: {message: "没有权限操作该职位",linkFor: 'description',level: 'info'},
                401: {message: "上传DFS异常",linkFor: 'description',level: 'info'},
                402: {message: "上传DFS异常",linkFor: 'description',level: 'info'},
                403: {message: "简历已存在",linkFor: 'description',level: 'info'},
                404: {message: "未知异常",linkFor: 'description',level: 'info'}
            }
            if (stateList[result.state] && result.state != 1) {
                addCansView.getControl('description').showMessage({
                    message: stateList[result.state].message
                });
            }
            if (result.state == 1) {
            	var resumeVo=result.content.data.resumeVo;
                lg.getuserInfo().init({dataSource:resumeVo});
                lg.getresume_list().updateResume(resumeVo);
                confirm.setRemove();
                lg.set('stage','NEW');
                lg.set('resumeId',resumeVo.id);
                lg.UpdateUrl();
                window.location.reload();
            }
        };
        var wrapElement = function(element,params) {
            // Create an iframe to submit through, using a semi-unique ID
            var frame_id = 'ajaxUploader-iframe-' + Math.round(new Date().getTime() / 1000)
            $('body').after('<iframe width="0" height="0" style="display:none;" name="'+frame_id+'" id="'+frame_id+'"/>');
            $('#'+frame_id).get(0).onload = function() {
                handleResponse(this, element);
            };

            // Wrap it in a form
            element.wrap(function() {
                return '<form action="../resume/uploadCandidate.json" method="POST" enctype="multipart/form-data" target="'+frame_id+'" />'
            })
                // Insert <input type='hidden'>'s for each param
                .before(function() {
                    var key, html = '';
                    for(key in params) {
                        var paramVal = params[key];
                        if (typeof paramVal === 'function') {
                            paramVal = paramVal();
                        }
                        html += '<input type="hidden" name="' + key + '" value="' + paramVal + '" />';
                    }
                    return html;
                });
        }
        confirm.getElement().css('top','69px');
        confirm.getElement().find('input:eq(0)').focus();
        $('#channel').fancySelect();
        $('[data-propertyname="file"]').find('button').on("click",function(e){
            $(this).siblings('input').trigger('click');
        });
        $('[data-propertyname="file"]').find('#file').on("change",function(e){
            var fileName = $(this).val();
            fileUrlList = fileName.split("\\");
            var len = fileUrlList.length;
            $('#fileName').text(fileUrlList[len-1]);
            $('#fileName').show();
        });

        var addCansView =new lg.Views.BaseView({
            name: 'addCansView',
            fields: [{
                name: 'phone',
                validRules: [{
                    mode: 'require',
                    data: '',
                    message: '',
                    showMessage:false,
                    trigger: 'blur'
                }, {
                    mode: 'pattern',
                    isUse: true,
                    status: false,
                    data:{phone:/^(0|86|17951)?((13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[57])[0-9]{8})$/},
                    message: ''
                }
                ],
                controlType: "TextBox"
            }, {
                name: 'description',
                controlType: "TextArea"
            }, {
                name: 'email',
                validRules: [{
                    mode: 'require',
                    data: '',
                    message: ''
                }, {
                    mode: 'pattern',
                    data: {email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i},
                    message: ''
                }],
                controlType: "TextBox"
            }, {
                name: 'candidateName',
                validRules: [{
                    mode: 'require',
                    data: '',
                    message: ''
                }, {
                    mode: 'pattern',
                    data: '/^[\\S\\s]{1,10}$/',
                    message: '请填写正确的基本信息'
                }],
                controlType: "TextBox"
            }]
        });
    })

    $('.add-pipline-recruiter').on('click',function(e){
        var title = $('.position_dropdown_toggle').attr('data-position-name');
        var channelName = $('.position_dropdown_toggle').attr('data-position-channelName');
        var source = (channelName?channelName.replace(/\[|\]/g,'') : '');
        var department = $('.position_dropdown_toggle').attr('data-position-department');
        var city = $('.position_dropdown_toggle').attr('data-position-city');
        var positionId = $('.position_dropdown_toggle').attr('data-position-id');


        $('.recruiter-list-submit').attr('data-item',positionId);
        $('.add-recruiter-invite-email-submit').attr('data-item',positionId);
        // 招聘职位字数控制
        var title_s = '';
        if(title.length >10){
            title_s = title.substring(0,10)+'...';
        }else{
            title_s = title
        }
        $('.add-recruiter-invite-title').html('共享职位<em titile="'+title+'">&nbsp;-&nbsp;'+title_s+'</em>' + (source?'<span>'+source+'</span>' : '') + (department?'<span>'+department+'</span>':'') + (city?'<span>'+city+'</span>':''));
        var that = this;
        $.ajax({
            url: '../member/all_members.json',
        }).success(function(result) {
            if(result.state==1){
                $.ajax({
                    url: '../recruiter/getRecruitersByPositionId.json',
                    dataType: 'json',
                    data:{positionId:lg.get('positionId')},
                    cache:false
                }).success(function(data) {
                    if(data.state==1&&result.state==1){
                        lg.AllMember = result.content.data.members;
                        $('.recruiter-list-select').empty();
                        var html = '';
                        var myMembers = [];
                        for(var i=0,len=result.content.data.members.length;i<len;i++){
                            var member= $.extend({}, lg.AllMember[i]);
                            var isRecruiter = false;
                            for(var j=0,len1=data.content.data.recruiters.length;j<len1;j++){
                                var recruiterId = data.content.data.recruiters[j]
                                if(member.userId==recruiterId){
                                    member.isChecked=true;
                                    if(('' + recruiterId) === $('#positionOwnerId').val()) {
                                        //不可取消勾选职位发布者
                                        member.isDisabled = true;
                                    }
                                    myMembers.push(member);
                                }
                            }
                        }
                        var transFilterList = lg.AllMember;
                        for(var i= 0,len=transFilterList.length;i<len;i++){
                            transFilterList[i].email = transFilterList[i].email?transFilterList[i].email.substring(0,transFilterList[i].email.indexOf('@')):transFilterList[i].email;
                            transFilterList[i].receiveEmail = transFilterList[i].receiveEmail?transFilterList[i].receiveEmail.substring(0,transFilterList[i].receiveEmail.indexOf('@')):transFilterList[i].receiveEmail;
                        }
                        var addRecruiterFilterSelect = new lg.Widgets.Controls.FilterSelect({
                            name:'addRecruiterFilterSelect',
                            dataSource:transFilterList,
                            key:'name email receiveEmail',
                            placeHolder:'查找同事'
                        });
                        if(myMembers.length <= 0){
                            addRecruiterFilterSelect.getElement().parent().addClass('noselects');
                        } else {
                            addRecruiterFilterSelect.getElement().parent().removeClass('noselects');
                        }
                        var addRecruiterMemberCheckBoxList = new lg.Widgets.Controls.MemberCheckBoxList({
                            name:'addRecruiterMemberCheckBoxList',
                            dataSource:myMembers,
                            onlyShowSelected:true
                        });
                        addRecruiterFilterSelect.on('select', function (e) {
                            var itemData = $.extend({}, e.itemData);
                            itemData.isChecked=true;
                            if (('' + itemData.userId) === $('#positionOwnerId').val()) {
                                //不可取消勾选职位发布者
                               itemData.isDisabled = true;
                            }
                            addRecruiterFilterSelect.getElement().parent().removeClass('noselects');
                            addRecruiterMemberCheckBoxList.addItem(itemData);
                        });

                        var invite_box = $('.add-recruiter-invite-box');
                        $(invite_box.find('.add-recruiter-invite-email-list')[0]).siblings('.add-recruiter-invite-email-list').remove();
                        invite_box.find('.add-recruiter-invite-email-list>input').val('').removeClass('error');
                        $($('.mds-tab a')[0]).trigger('click');
                        $('#add-member').modal('show');
                    }
                });
            }
        });


    });
    var timer = '';
    // 页面自动往下滚，超过rightOffsetTop时停止
    function scrollTop (){
        var top = $('.detail-content')[0].scrollTop;
        clearInterval(timer);
        timer = setInterval(function(){
            var rightOffsetTop = $('.right-content').offset().top;
            var now = $('body').scrollTop()||$('html').scrollTop();
            var speed = rightOffsetTop/40;
            speed = speed>0?Math.ceil(speed):Math.floor(speed);
            if($('.detail-content').scrollTop() > ($('.user-detail-information')[0].clientHeight+55)){
                !$('#resumeTab').hasClass('fix-top')&&$('#resumeTab').addClass('fix-top');
            }else{
                $('#resumeTab').removeClass('fix-top');
            }
            if(($('body').scrollTop()||$('html').scrollTop() ) + $(window).height()==Math.max($('body')[0].scrollHeight , $('html')[0].scrollHeight)){
                clearInterval(timer);
            }else{
                $('body').scrollTop(now+speed);
                $('html').scrollTop(now+speed);
            }

        }, 3);
    }

    var sign = 10;
    $('.detail-content').on('scroll', function (e) {
        var scrtop =$('.detail-content').scrollTop();
        var preScroll = $('.detail-content').attr('data-scrollTop');
        // if(typeof preScroll != 'undefined'){
        //     $('.detail-content').scrollTop(preScroll);
        //     $('.detail-content').removeAttr('data-scrollTop');
        //     return;
        // }
        if($('.detail-content').scrollTop() > ($('.user-detail-information')[0].clientHeight+55)){
            if(($('body').scrollTop()||$('html').scrollTop() ) + $(window).height()==Math.max($('body')[0].scrollHeight , $('html')[0].scrollHeight)) {
                !$('#resumeTab').hasClass('fix-top')&&$('#resumeTab').addClass('fix-top');
            }
        }else{
            $('#resumeTab').removeClass('fix-top');
        }
        if (scrtop > sign) {
            sign = scrtop;
            if(scrtop>10){
                scrollTop();
            }
        }

        if (scrtop < sign) {
            sign = scrtop;
            if(scrtop<10){
                //$('#resumeTab').removeClass('fix-top');
                // scrollFunc()
            }
        }

    });
    /**
     * 滚动条加载更多
     * 判断是向上滚动还是向下滚动
     * @param e
     */
    var toTopTimer = '';
    function scrollFunc (e) {
        clearInterval(timer);
        timer=setInterval(function(){
            var now=$('body').scrollTop()||$('html').scrollTop();
            var speed=105/10;
            speed=speed>0?Math.ceil(speed):Math.floor(speed);
            if(($('body').scrollTop()||$('html').scrollTop())==0){
                clearInterval(timer);
            }
            $('body').scrollTop(now-speed);
            $('html').scrollTop(now-speed);
        }, 30);
    };
    function scrollBottom (e) {
        e = e || window.event;
        var top = $('.detail-content').scrollTop();
        // IE/Opera/Chrome e.wheelDelta=120  火狐e.detail=-3
        if ((e.wheelDelta > 0 || e.detail == -3) && $('.detail-content').scrollTop() == 0) {
            //scrollFunc()
        }
    }

    // $(window).on('scroll',function(e){
    //   //var rightOffsetTop = $('.right-content').offset().top;
    //   if($('body').scrollTop() + $(window).height()==$('body').scrollHeight) {
    //       $('#resumeTab').addClass('fix-top');
    //   }else if($('.detail-content').scrollTop() > ($('.user-detail-information')[0].clientHeight+55)){
    //       $('#resumeTab').removeClass('fix-top');
    //   }
    // });
    var signBody = 0;
    $(window).on('scroll',function(e){

        var scrtop =($('body').scrollTop()||$('html').scrollTop() );
        if (scrtop > signBody) {
            signBody = scrtop;
        }

        if (scrtop < signBody) {
            signBody = scrtop;
            clearInterval(timer);
        }

        if(($('body').scrollTop()||$('html').scrollTop() ) + $(window).height()==Math.max($('body')[0].scrollHeight , $('html')[0].scrollHeight)) {
            clearInterval(timer);
            if($('.detail-content').scrollTop() > ($('.user-detail-information')[0].clientHeight+55)){
              $('#resumeTab').addClass('fix-top');
            }else{
                $('#resumeTab').removeClass('fix-top');
            }
            $('body').scrollTop($('body')[0].scrollHeight);
            $('html').scrollTop($('html')[0].scrollHeight)
        }else{
            $('#resumeTab').removeClass('fix-top');
        }
    });
    // var body = $('body').length>0&&$('body')[0]||$('html').length>0&&$('html')[0]
    // if (body.addEventListener) {
    //    body.addEventListener('DOMMouseScroll', bodyScrollFunc, false);
    // }
    // body.onmousewheel = bodyScrollFunc;//IE/Opera/Chrome



    $('.pip_resume_add_bookmark_tips').find('.addbootmark').text((navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D');

    $('.batch_out_resume_layout').find('.to_batch_btn').on('click', function (e) {
        $('.batch_out_resume_layout').find('.to_batch_concel_btn').trigger('click');
    });
    $('.batch_out_resume_layout').find('.to_batch_concel_btn').on('click', function (e) {
       lg.Utils.setLocalStorage('NoBatchOutResume',new Date().getFullYear()+'-'+(new Date().getMonth()<10?('0'+new Date().getMonth()):new Date().getMonth())+'-'+new Date().getDate());
        $('.batch_out_resume_layout').hide();
    });
    var currentStageNumber =$('.pipline-tab .active').find('a span').last().text().replace('（','').replace('）','');
    if(currentStageNumber > 30 && (!lg.Utils.getLocalStorage('NoBatchOutResume') || (lg.Utils.getLocalStorage('NoBatchOutResume') < (new Date().getFullYear()+'-'+(new Date().getMonth()<10?('0'+new Date().getMonth()):new Date().getMonth())+'-'+new Date().getDate())))){
        $('.batch_out_resume_layout').show();
    }else{
        $('.batch_out_resume_layout').hide();
    }

    /**************显示休假**********/
    /**个人休假**/
    $('.tips-card').on('click','#holiday-how',function(){
        //显示第一个休假窗口
        $('.select-layer').show();
        $('#select-holiday-time').show();
        refreshHolidayBtnState();
    });

    /**日历显示**/
    $('#holiday-begintime').datepicker({
        dateFormat: "yy-mm-dd",
        changeYear: true,
        changeMonth: true,
        yearRange: 'c-3:c+3',
        minDate:1,
        selectmenuOptions: {
            width: 126,
            position: {
                my: "left top+3px"
            },
            change: function(e, ui) {
                $(this).change();
            }
        },
        onSelect: function(dateText, instance) {
            instance.input.prev('label').remove();
        },
        onClose: function( selectedDate ) {
            $( "#holiday-endtime" ).datepicker( "option", "minDate", selectedDate );
            $( "#holiday-endtime" ).val('休假结束日期');
            refreshHolidayBtnState();
        }
    });

    $('#holiday-begin-icon').click(function(){
        $('#holiday-begintime').focus();
    });

    $('#holiday-endtime').datepicker({
        dateFormat: "yy-mm-dd",
        changeYear: true,
        changeMonth: true,
        yearRange: 'c-3:c+3',
        minDate:$( "#holiday-begintime" ).val(),
        selectmenuOptions: {
            width: 126,
            position: {
                my: "left top+3px"
            },
            change: function(e, ui) {
                $(this).change();
            }
        },
        onSelect: function(dateText, instance) {
            instance.input.prev('label').remove();
        },
        onClose: function() {
            refreshHolidayBtnState();
        }
    });

    $('#holiday-end-icon').click(function(){
        $('#holiday-endtime').focus();
    });

    /**没选择时间的情况**/
    refreshHolidayBtnState();
    function refreshHolidayBtnState(){
        if($('#holiday-begintime').val() =='休假开始日期'||$('#holiday-endtime').val() =='休假结束日期'){
            $('#holiday-begintimeBtn').attr('href', '#');
            $('#holiday-begintimeBtn').css({"background": "#b2b2b2","border-bottom": "2px solid #b2b2b2","cursor":"default"});
            $('#holiday-begintimeBtn').addClass('disable');
        }else{
            $('#holiday-begintimeBtn').attr('href', 'javascript:;');
            $('#holiday-begintimeBtn').css({"background": "#1caa7d","border-bottom": "2px solid #1caa7d","cursor":"pointer"});
            $('#holiday-begintimeBtn').removeClass('disable');
        }
    }

    /**确认休假时间**/
    var fromDate,endDate;
    $('#holiday-begintimeBtn').click(function(){
        var beginDay = $('#holiday-begintime').val();
        var endDay = $('#holiday-endtime').val();
        if($('#holiday-begintimeBtn').hasClass('disable')){
            return;
        }
        $.ajax({
            type:'POST',
            data:{fromDate:beginDay,endDate:endDay},
            url:'../holiday/preAddVacation.json',
            dataType:'json'
        }).done(function(result){
            if(result.state == 1){
                if($('#holiday-begintimeBtn').hasClass('disable') == false){
                    $('#select-holiday-time').hide();
                    $('#holiday-time-selected').show();
                    var vacation = eval("(" + result.content.data.vacation + ")");
                    fromDate = vacation.fromDate;
                    endDate = vacation.endDate;
                    $('.decision .cha').text(vacation.intervalDays);
                    $('.decision .bengin-day').text(vacation.fromDate);
                    $('.decision .end-day').text(vacation.endDate);
                }else{
                    return;
                }
            }else{
                alert(result.message);
                $('.select-layer').hide();
            }
        });
    });

    /**取消选择休假时间**/
    $('#holiday-save-close').click(function(){
        $('.select-layer').hide();
        $('#select-holiday-time').hide();
        $('#holiday-begintime').val('休假开始日期');
        $('#holiday-endtime').val('休假结束日期');
    });

    /**愉快的决定提交**/
    $('#happy-decision').click(function(){
        var fromDate = $('.decision .bengin-day').text();
        var endDate = $('.decision .end-day').text();
        $.ajax({
            type:'POST',
            url:'../holiday/addVacation.json',
            data:{
                fromDate:fromDate,
                endDate:endDate
            },
            dataType:'json',
            success: function ( data ) {
                if( data.state == 1){
                    $('.select-layer').hide();
                    $('.tips-card').find('.tips').attr('id','has-holiday');
                    $('.tips-card .tips').text('已设定休假');
                    $('.tips-icon-question').find('.tips-icon').removeClass('icon-question').addClass('icon-finish');
                    $('#holiday-time-selected').hide();
                    $('#holiday-begin-done').text(fromDate);
                    $('#holiday-end-done').text(endDate);
                }else if( data.state == -1){
                    alert(data.message);
                    if( data.message == "你已经设定了休假，不可重复设定"){
                        $('.select-layer').hide();
                        $('.tips-card').find('.tips').attr('id','has-holiday');
                        $('.tips-card .tips').text('已设定休假');
                        $('.tips-icon-question').find('.tips-icon').removeClass('icon-question').addClass('icon-finish');
                        $('#holiday-time-selected').hide();
                    }
                }
            },
            error: function ( data ) {

            }
        });
    });


    /**愉快决定后的取消**/
    $('#holiday-happy-close').click(function(){
        $('.select-layer').hide();
        $('#holiday-time-selected').hide();
        $('#holiday-begintime').val('休假开始日期');
        $('#holiday-endtime').val('休假结束日期');
    });

    //已经设定休假后点击的弹窗
    $('.tips-card').on('click','#has-holiday',function(){
        //显示第三个休假窗口
        $.ajax({
            url:'../holiday/getVacation.json',
            success:function(result){
                if(result.state == 1){
                    var data = result.content.data && result.content.data.vacation||{};
                    data = JSON.parse(data);
                    $('#holiday-time-done .cha').text(data.statusDesc);
                    $('#holiday-time-done .left-state .cha').text(data.intervalDays);
                    $('#holiday-time-done .bengin-day').text(data.fromDateDotStr);
                    $('#holiday-time-done .end-day').text(data.endDateDotStr);
                    $('#holiday-time-done').show();
                    $('.select-layer').show();
                }else{
                    alert(result.message);
                }
            }
        })

    });

    /**取消休假**/
    $('#cancleVacation').click(function(){
        $.ajax({
            type:'POST',
            url:'../holiday/cancelVacation.json',
            dataType:'json'
        }).done(function(result){
            if(result.state == 1 ){
                $('#holiday-time-done').hide();
                $('.select-layer').hide();
                $('.tips-card').find('.tips').attr('id','holiday-how');
                $('.tips-card .tips').text('个人休假怎么办？');
                $('.tips-icon-question').find('.tips-icon').removeClass('icon-finish').addClass('icon-question');

                //将选择休假时间设置为默认显示
                $('#holiday-begintime').val('休假开始日期');
                $('#holiday-endtime').val('休假结束日期');
            }else{
                alert(result.message);
            }
        });
    });

    /**取消休假后的取消**/
    $('#holiday-done-close').click(function(){
        $('#holiday-time-done').hide();
        $('.select-layer').hide();
    });

    $(document).on('mouseenter', '.with_chat_msgs', function (e) {
        var $me = $(this);
        $me.data('backupHtml', $me.html());
        $me.html('继续聊聊 <i class="icon-chat"></i>');
    });

    $(document).on('mouseleave', '.with_chat_msgs', function (e) {
        var $me = $(this);
        $me.html($me.data('backupHtml'));
    });

    //显示第一个休假窗口
    function holidayHow(e){
        $('#select-holiday-time').show();
        e.stopPropagation();
        e.preventDefault();
    }
    //显示第三个休假窗口
    function holidayDone(e){
        $('#holiday-time-done').show();
        e.stopPropagation();
        e.preventDefault();
    }

    //点击遮罩层关闭窗口
    $('.select-layer').click(function(){
        $('.select-layer').hide();
        $('#select-holiday-time').hide();
        $('#holiday-time-done').hide();
        $('#holiday-time-selected').hide();
    });

    (function () { // G20峰会休假轮播提醒
        $.ajax({
            url: '../dashboard/getCityFromIp.json',
            dataType: 'json'
        }).done(function (data, textStatus, jqXHR) {
            var i = 0;
            var $wrapper = $('.slide-tips .tips-wrapper');

            if (parseInt(data.state, 10) === 1) {
                if (data.content.data.cityId !== '6-0-0') { // 杭州
                    $wrapper.find('.tip-text-g20').remove();
                }

                if ($wrapper.children().length > 1) {
                    setInterval(function () {
                        var top = 0 - (i+1) * 27;
                        $wrapper.css('top', top + 'px');
                        $($wrapper.children().get(i++)).clone().appendTo($wrapper);
                    }, 8000);
                }
            }
        });
    })();
	//体验新版候选人
	$('.switch-new-apply').on('click', function (e) {
		(typeof sa != 'undefined')&&sa.track('CANDIDATE_GREY_TRYNEW', {
			createCompanyMethod: '候选人_灰度_体验新版',
			company_Name: document.querySelector('#UserConpany')&&document.querySelector('#UserConpany').value,
			company_ShortName: document.querySelector('#UserConpanyShortName')&&document.querySelector('#UserConpanyShortName').value,
			company_ID: document.querySelector('#UserConpanyId')&&document.querySelector('#UserConpanyId').value,
			user_ID: document.querySelector('#UserId')&&document.querySelector('#UserId').value
		});
		$('.quick-bar .to_new').click();
	});
});

/*!common/components/gd-map/main.js*/
;// 高德地图 jsApi
define('common/components/gd-map/main', ['require', 'exports', 'module'], function(require, exports, module) {

	var isIniting = false,
		maxInitNuM = 5,
		configArr = [];

	/**
	 * [loadMap 加载高德地图]
	 * @param  {[type]} config [加载高德地图jsApi]
	 * config.key {[String]} [可选，调用高德地图jsApi的key，默认值高德开放平台中名为lg-pc-js-api的key]，多次调用以第一次为准
	 * config.plugins {[Array]} [可选，要加载的插件列表]
	 * config.handler {[Function]} [加载成功回调]
	 */
	function loadMap(config) {

		if (maxInitNuM <= 0) {
			maxInitNuM == 0 && console.log('地图加载失败');
			return;
		} else if (typeof AMap === 'undefined' && !isIniting) {
			config.handler && configArr.push(config);
			// 首次加载初始化地图
			initMap(config);
		} else {
			// 加载中放入队列，已加载完成直接执行
			config.handler && (isIniting ? configArr.push(config) : (function() {
				config.plugins && config.plugins.length > 0 ? AMap.plugin(config.plugins, config.handler) : config.handler();
			})());
		}

	}

	function initMap(config) {

		isIniting = true;
		maxInitNuM--;
		// 测试 key 无域名白名单
		// var key = config.key || '605035169b9263eb3bc2906e2e8261c9';
		var key = config.key || 'ca71f341bd8d847d79b958d2c40b4532';

		var script = document.createElement("script");
		script.src = '../../https@webapi.amap.com/maps@v=1.3&key=' + key + '&callback=gdMapInit';
		document.body.appendChild(script);

		window.gdMapInit = function() {
			for (var i = 0; i < configArr.length; i++) {
				configArr[i].plugins && configArr[i].plugins.length > 0 ? AMap.plugin(configArr[i].plugins, configArr[i].handler) : configArr[i].handler();
			};
			isIniting = false;
		}
	}


    // 根据ip获取用户当前城市
    function getCityFromIp (cb) {
        loadMap({
            plugins: ['AMap.CitySearch'],
            handler: function() {
                //实例化城市查询类
                var citysearch = new AMap.CitySearch();
                //自动获取用户IP，返回当前城市
                citysearch.getLocalCity(function(status, result) {
                    result = result || {};
                    if (status === 'complete' && result.info === 'OK') {
                        if(result.city){
                            result.city = result.city.replace(/市$/, '');
                        }
                    }else{
                        result.city = '不限';
                    }
                    cb && cb(result);
                });
            }
        });
    }


    module.exports = {
        getCityFromIp: getCityFromIp,
        loadMap: loadMap
    };


});
