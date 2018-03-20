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

/*!common/components/pagination/jquery.pagination.js*/
;define('common/components/pagination/jquery.pagination', ['require', 'exports', 'module'], function(require, exports, module) {

  /*!
   * myPagination Jquery Pagination Plug-in Library v4.0
   * 
   * http://linapex.blog.163.com/blog/static/1892375162011523101954885/ 
   *
   * Date: 2011/7/18 19:47
   */
  (function($) {
  	$.fn.pager = function(param) {
  		init(param, $(this));
  		return $(this)
  	};
  	function init(param, obj) {
  		if (param && param instanceof Object) {
  			var options;
  			var currPage;
  			var form;
  			var pageCount;
  			var pageSize;
  			var tempPage;
  			var defaults = new Object({
  				currPage : 1,
  				pageCount : 10,
  				pageSize : 5,
  				pageNOName: 'pageNo',
  				form: 'searchForm',
  				cssStyle : 'myself',
  				ajax : {
  					on : false,
  					pageCountId : 'pageCount',
  					param : {
  						on : false,
  						pageNo : 1
  					},
  					ajaxStart : function() {
  						return false
  					}
  				},
  				info : {
  					first : '首页',
  					last : '尾页',
  					next : '下一页',
  					prev : '上一页',
  					first_on : true,
  					last_on : true,
  					next_on : true,
  					prev_on : true,
  					msg_on : true,
  					link : 'javascript:;',
  					msg : '',
  					text : {
  						width : '22px'
  					}
  				}
  			});
  			function getCurrPage() {
  				if (options.info && options.info.cookie_currPageKey && options.info.cookie_currPage) {
  					var cookie_currPage = $.cookie(options.info.cookie_currPageKey + "_currPage");
  					if (cookie_currPage != "" && cookie_currPage != null) {
  						return cookie_currPage;
  					}
  				}
  				if (options.currPage) {
  					return options.currPage;
  				} else {
  					return defaults.currPage;
  				}
  			}
  			function getPageNOName() {
  				if(options.pageNOName) {
  					return options.pageNOName;
  				} else {
  					return defaults.pageNOName;
  				}
  			}
  			function getForm() {
  				if(options.form) {
  					return options.form;
  				} else {
  					return defaults.form;
  				}
  			}
  			function getPageCount() {
  				if (options.pageCount) {
  					return options.pageCount;
  				} else if(options.pageCount==0) {
  					return 1;
  				} else {
  					return defaults.pageCount;
  				}
  			}
  			function getPageSize() {
  				if (options.pageSize) {
  					return options.pageSize;
  				} else {
  					return defaults.pageSize;
  				}
  			}
  			function getCssStyle() {
  				if (options.cssStyle) {
  					return options.cssStyle
  				} else {
  					return defaults.cssStyle
  				}
  			}
  			function getAjax() {
  				if (options.ajax && options.ajax.on) {
  					return options.ajax
  				} else {
  					return defaults.ajax
  				}
  			}
  			function getParam() {
  				if (options.ajax.param && options.ajax.param.on) {
  					options.ajax.param.pageNo = currPage;
  					return options.ajax.param
  				} else {
  					defaults.ajax.param.pageNo = currPage;
  					return defaults.ajax.param
  				}
  			}
  			function getFirst() {
  				if (options.info && options.info.first_on == false) {
  					return ""
  				}
  				if (options.info && options.info.first_on && options.info.first) {
  					var str = "<a href='" + getLink() + "' title='1'>"
  							+ options.info.first + "</a>";
  					return str
  				} else {
  					var str = "<a href='" + getLink() + "' title='1'>"
  							+ defaults.info.first + "</a>";
  					return str
  				}
  			}
  			function getLast(pageCount) {
  				if (options.info && options.info.last_on == false) {
  					return ""
  				}
  				if (options.info && options.info.last_on && options.info.last) {
  					var str = "<a href='" + getLink() + "' title='" + pageCount
  							+ "'>" + options.info.last + "</a>";
  					return str
  				} else {
  					var str = "<a href='" + getLink() + "' title='" + pageCount
  							+ "'>" + defaults.info.last + "</a>";
  					return str
  				}
  			}
  			function getPrev() {
  				if (options.info && options.info.prev_on == false) {
  					return ""
  				}
  				if (options.info && options.info.prev) {
  					return options.info.prev
  				} else {
  					return defaults.info.prev
  				}
  			}
  			function getNext() {
  				if (options.info && options.info.next_on == false) {
  					return ""
  				}
  				if (options.info && options.info.next) {
  					return options.info.next
  				} else {
  					return defaults.info.next
  				}
  			}
  			function getLink() {
  				if (options.info && options.info.link) {
  					return options.info.link
  				} else {
  					return defaults.info.link
  				}
  			}
  			function getMsg() {
  				var input = "<input type='text' value='" + currPage + "' >";
  				if (options.info && options.info.msg_on == false) {
  					return false
  				}
  				if (options.info && options.info.msg) {
  					var str = options.info.msg;
  					str = str.replace("{currText}", input);
  					str = str.replace("{currPage}", currPage);
  					str = str.replace("{sumPage}", pageCount);
  					return str
  				} else {
  					var str = defaults.info.msg;
  					str = str.replace("{currText}", input);
  					str = str.replace("{currPage}", currPage);
  					str = str.replace("{sumPage}", pageCount);
  					return str
  				}
  			}
  			function getText() {
  				var msg = getMsg();
  				if (msg) {
  					msg = $(msg)
  				} else {
  					return ""
  				}
  				var input = msg.children(":text");
  				if (options.info && options.info.text) {
  					var css = options.info.text;
  					for (temp in css) {
  						var val = eval("css." + temp);
  						input.css(temp, val)
  					}
  					return msg.html()
  				} else {
  					var css = defaults.info.text;
  					for (temp in css) {
  						var val = eval("css." + temp);
  						input.css(temp, val)
  					}
  					return msg.html()
  				}
  			}
  			function getPageCountId() {
  				if (options.ajax && options.ajax.pageCountId) {
  					return options.ajax.pageCountId
  				} else {
  					return defaults.ajax.pageCountId
  				}
  			}
  			function getAjaxStart() {
  				if (options.ajax && options.ajax.ajaxStart) {
  					options.ajax.ajaxStart()
  				} else {
  					defaults.ajax.ajaxStart
  				}
  			}
  			function saveCurrPage(page) {
  				if (options.info && options.info.cookie_currPageKey
  						&& options.info.cookie_currPage) {
  					var key = options.info.cookie_currPageKey + "_currPage";
  					$.cookie(key, page)
  				}
  			}
  			function getInt(val) {
  				return parseInt(val, 10);
  			}
  			function isCode(val) {
  				if (val < 1) {
  					alert("输入值不能小于1。");
  					return false
  				}
  				var patrn = /^[0-9]{1,8}$/;
  				if (!patrn.exec(val)) {
  					alert("请输入正确的数字。");
  					return false
  				}
  				if (val > pageCount) {
  					alert("输入值不能大于总页数。");
  					return false
  				}
  				return true
  			}
  			function updateView() {
  				currPage = getInt(currPage);
  				pageCount = getInt(pageCount);
  				var link = getLink();
  				var firstPage = lastPage = 1;
  				if (currPage - tempPage > 0) {
  					firstPage = currPage - tempPage
  				} else {
  					firstPage = 1
  				}
  				if (firstPage + pageSize > pageCount) {
  					lastPage = pageCount + 1;
  					firstPage = lastPage - pageSize
  				} else {
  					lastPage = firstPage + pageSize
  				}
  				var content = "";
  				content += getFirst();
  				if (currPage == 1) {
  					content += "<span class=\"disabled\" title=\"" + getPrev()
  							+ "\">" + getPrev() + " </span>"
  				} else {
  					content += "<a href='" + link + "' title='"
  							+ (currPage - 1) + "'>" + getPrev() + " </a>"
  				}
  				if (firstPage <= 0) {
  					firstPage = 1
  				}
  				for (firstPage; firstPage < lastPage; firstPage++) {
  					if (firstPage == currPage) {
  						content += "<span class=\"current\" title=\""
  								+ firstPage + "\">" + firstPage + "</span>"
  					} else {
  						content += "<a href='" + link + "' title='" + firstPage
  								+ "'>" + firstPage + "</a>"
  					}
  				}
  				if (currPage == pageCount) {
  					content += "<span class=\"disabled\" title=\"" + getNext()
  							+ "\">" + getNext() + " </span>"
  				} else {
  					content += "<a href='" + link + "' title='"
  							+ (currPage + 1) + "'>" + getNext() + " </a>"
  				}
  				content += getLast(pageCount);
  				content += getText();
  				obj.html(content);
  				obj.children(":text").keypress(function(event) {
  					var keycode = event.which;
  					if (keycode == 13) {
  						var page = $(this).val();
  						if(page > pageCount) page = pageCount;
  						if(!getAjax().on) {
  							if (!isCode(page)) {
  								return false;
  							}
  							var formObj = $("#"+getForm());
  							formObj.append("<input type='hidden' name='"+getPageNOName()+"' value='"+page+"'>");
  							formObj.submit();
  						} else {
  							if (isCode(page)) {
  								obj.children("a").unbind("click");
  								obj.children("a").each(function() {
  									$(this).click(function() {
  										return false
  									})
  								});
  								createView(page)
  							}
  						}
  						
  						
  					}
  				});
  				obj.children("a").each(function(i) {
  					var page = this.title;
  					$(this).click(function() {
  						obj.children("a").unbind("click");
  						obj.children("a").each(function() {
  							$(this).click(function() {
  								return false;
  							})
  						});
  						if(!getAjax().on) {
  							var formObj = $("#"+getForm());
  							formObj.append("<input type='hidden' name='"+getPageNOName()+"' value='"+page+"'>");
  							formObj.submit();
  						} else {
  							createView(page);
  							$(this).focus();
  						}
  						return false;
  					})
  				})
  			}			
  			function createView(page) {
  				currPage = page;
  				saveCurrPage(page);
  				var ajax = getAjax();
  				if (ajax.on) {
  					getAjaxStart();
  					var varUrl = ajax.url;
  					var param = getParam();
  					$
  							.ajax({
  								url : varUrl,
  								type : 'GET',
  								data : param,
  								contentType : "application/x-www-form-urlencoded;utf-8",
  								async : true,
  								cache : false,
  								timeout : 60000,
  								error : function() {
  									alert("访问服务器超时，请重试，谢谢！")
  								},
  								success : function(data) {
  									loadPageCount({
  										dataType : ajax.dataType,
  										callback : ajax.callback,
  										data : data
  									});
  									updateView()
  								}
  							})
  				} else {
  					updateView()
  				}
  			}
  			function checkParam() {
  				if (currPage < 1) {
  					console.log("配置参数错误\n错误代码:-1");
  					currPage = 1;
  				}
  				if (currPage > pageCount) {
  					console.log("配置参数错误\n错误代码:-2");
  					currPage = pageCount;
  				}
  				if (pageSize < 2) {
  					console.log("配置参数错误\n错误代码:-3");
  					return false;
  				}
  				return true;
  			}
  			function loadPageCount(options) {
  				if (options.dataType) {
  					var data = options.data;
  					var resultPageCount = false;
  					var isB = true;
  					var pageCountId = getPageCountId();
  					switch (options.dataType) {
  					case "json":
  						data =  data ;
  						//resultPageCount = eval("data." + pageCountId);
  						break;
  					case "xml":
  						resultPageCount = $(data).find(pageCountId).text();
  						break;
  					default:
  						isB = false;
  						var callback = options.callback + "(data)";
  						eval(callback);
  						resultPageCount = $("#" + pageCountId).val();
  						break
  					}
  					if (resultPageCount) {
  						pageCount = resultPageCount
  					}
  					if (isB) {
  						var callback = options.callback.call(this,data);
  					}
  				}
  			}
  			options = param;
  			currPage = getCurrPage();
  			pageCount = getPageCount();
  			pageSize = getPageSize();
  			tempPage = getInt(pageSize / 2);
  			var cssStyle = getCssStyle();
  			obj.addClass(cssStyle);
  			if (checkParam()) {
  				updateView();
  				createView(currPage)
  			}
  		}
  	}
  })(jQuery);
  

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

/*!common/widgets/contact-plus-manager/main.js*/
;/**
 * plus 联系客户经理操作
 * 
 * @author fayipan@lagou.com
 * @date 2017/02/16
 */
define('common/widgets/contact-plus-manager/main', ['require', 'exports', 'module'], function (require, exports, module) {
    var selector = '#contact-plus-manager';
    var $root = $(selector);

    $(document).on('scroll mousewheel', selector, function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    $root.on('click', '.modal-ok-btn', function (e) {
        $root.modal('hide');
    });

    function show() {
        $.ajax({
            url: '../crmMsg/sendCrmMessage.json',
            data: {
                type: 4
            }
        }).done(function (data, textStatus, jqXHR) {
            var state = parseInt(data.state, 10);
            var displayText = '抱歉，系统开了个小差，请稍后重试。';
            var btnText = '好的';

            if ( state === 1 ) {
                displayText = '已经将贵公司的职位数超额情况告知了拉勾客户经理，客户经理会尽快与贵公司的拉勾平台负责人取得联系。';
            } else if ( state === 10001 ) {
                btnText = '关闭';
                displayText = '拉勾客户经理已经获知了您的状况，请勿短时间内重复联系。';
            }
            
            $root.find('.infos').text(displayText);
            $root.find('.modal-ok-btn').text(btnText);
            $root.modal('show');
        });
    }

    $(document).on('click', '.TRIGGER-contact-plus-manager', function () {
        show();
    });

    module.exports = {
        show: show
    };
});

/*!positions/modules/plus-positon-tips-widget/main.js*/
;/**
 * 拉勾+ 新增职位发布额度组件
 *
 * @author fayipan@lagou.com
 */
define('positions/modules/plus-positon-tips-widget/main', ['require', 'exports', 'module', 'common/components/push/NotifyClient', 'common/widgets/contact-plus-manager/main'], function (require, exports, module) {
    var $globalSearchboxTail = $('#global-searchbox-tail'); // 拉勾+ 服务提醒

    /**
     * 拉勾+ 产品说明
     */
    $globalSearchboxTail.on('mouseenter', '.icon-warning-v1', function (e) {
        $globalSearchboxTail.find('.plus-service-status').css({
            left: ( $(this).position().left - 98 ) + 'px'
        }).fadeIn();
    });
    $globalSearchboxTail.on('mouseleave', '.icon-warning-v1', function (e) {
        $globalSearchboxTail.find('.plus-service-status').fadeOut();
    });

    /**
     * 发布职位数、在线职位数 hover 提示
     */
    $globalSearchboxTail.on('mouseenter', '.trigger-tips', function (e) {
        clearTimeout($globalSearchboxTail.timer);
        if ( $globalSearchboxTail.find('.open-plus-service').is(':hidden') ) {
            $globalSearchboxTail.find('.open-plus-service').fadeIn();
        }
    });
    $globalSearchboxTail.on('mouseleave', '.trigger-tips', function (e) {
        clearTimeout($globalSearchboxTail.timer);

        $globalSearchboxTail.timer = setTimeout(function () {
            $globalSearchboxTail.find('.open-plus-service').fadeOut();
        }, 500);
    });
    $globalSearchboxTail.on('mouseenter', '.open-plus-service', function (e) {
        clearTimeout($globalSearchboxTail.timer);
    });
    $globalSearchboxTail.on('mouseleave', '.open-plus-service', function (e) {
        var $me = $(this);
        $globalSearchboxTail.timer = setTimeout(function () {
            $me.fadeOut();
        }, 500);
    });

    var notifyClient = require('common/components/push/NotifyClient');
    var plusManager = require('common/widgets/contact-plus-manager/main');
    /**
     * window.parent.postMessage({
     *     type: 'WINMSG_CONTACT_PLUS_MANAGER'
     * }, '*');
     */
    notifyClient.bind('WINMSG_CONTACT_PLUS_MANAGER', function (evt, data) {
        plusManager.show();
    });
});

/*!positions/modules/add-recruiter-pop/main.js*/
;/**
 * 邀请新成员弹窗逻辑
 */

define('positions/modules/add-recruiter-pop/main', ['require', 'exports', 'module'], function(require, exports, module) {	
    
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
    //$('#add-member').on('hidden.bs.modal', function (e) {
    //    $('.container').css('overflow','auto');
    //});
    //$('#add-member').on('shown.bs.modal', function (e) {
    //    $('.container').css('overflow','hidden');
    //});

    $('.recruiter-list-submit').on('click',function(e){
        /*var data=[];
        $('.recruiter-list input[name=recruiters]:checked').each(function(i,ele){
            data[i]=$(ele).val();
        });*/
        //lg.getaddRecruiterMemberCheckBoxList().getValue();
        var that=this;
        $.ajax({
            url: '../recruiter/saveRecruiter.json',
            dataType: 'json',
            type:"POST",
            data:{recruiterIdArray:lg.getaddRecruiterMemberCheckBoxList().getValue().join(','),positionId:$(this).attr('data-item'), source:'position'},
            cache:false
        }).success(function(result) {
            if(result.state==1){
                $('#add-member').modal('hide');
                $('.mds-sub-content [data-item='+$(that).attr('data-item')+']').find('.selecter').children('span').text(lg.getaddRecruiterMemberCheckBoxList().getValue().length);

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
		invite_box.find('.invite-email-list>input').each(function(i,ele){
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
		if(success){
			$.ajax({
                url:"../recruiter/addRecruiterByEmails.json",
                data:{positionId:$(this).attr('data-item'),emailArray:params.join(','), source:'position'},
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
/*!positions/modules/group-share-position-pop/main.js*/
;/**
 * 邀请新成员弹窗逻辑
 */

define('positions/modules/group-share-position-pop/main', ['require', 'exports', 'module', "dep/artTemplate/dist/template"], function(require, exports, module) {

    var template =  require("dep/artTemplate/dist/template");
    //$('#groupSharePosition').on('hidden.bs.modal', function (e) {
    //    $('.container').css('overflow','auto');
    //});
    //$('#groupSharePosition').on('shown.bs.modal', function (e) {
    //    $('.container').css('overflow','hidden');
    //
    //   // $('[data-propertyname="sharefilterSelect"]').find('input').val('');
    //});
    lg.QueryString();
    $('.group-share-position a').on('click', function (e) {
        if(typeof lg.AllMembers =='undefined') {
            $.ajax({
                url: '../member/all_members.json',
                dataType: 'json',
                data: {positionId: lg.get('positionId')},
                cache: false
            }).success(function (result) {
                if (result.state == 1) {
                    lg.AllMembers = result.content.data.members;
                    var sharefilterSelect = new lg.Widgets.Controls.FilterSelect({
                        name: 'sharefilterSelect',
                        dataSource: lg.AllMembers,
                        key:'name email receiveEmail',
                        showSelect:true,
                        placeHolder: '查找同事'
                    });
                    sharefilterSelect.on('select', function (e) {
                        /*e.itemData.isChecked = true;
                        addRecruiterFilterSelect.getElement().parent().removeClass('noselects');
                        addRecruiterMemberCheckBoxList.addItem(e.itemData);*/
                        //filterGridView.setFilterValue()
                    });
                }
            });
        }else{
            var sharefilterSelect = new lg.Widgets.Controls.FilterSelect({
                name: 'sharefilterSelect',
                dataSource: lg.AllMembers,
                key:'name email receiveEmail',
                showSelect:true,
                placeHolder: '查找同事'
            });
            sharefilterSelect.on('select', function (e) {
                /*e.itemData.isChecked = true;
                 addRecruiterFilterSelect.getElement().parent().removeClass('noselects');
                 addRecruiterMemberCheckBoxList.addItem(e.itemData);*/
            });
        }

        if(typeof lg.AllPositions =='undefined'){
            $.ajax({
                url:'queryPositionsOfMine.json'
            }).success(function(result){
                if(result.state==1){
                    lg.AllPositions = [];
                    for(var i= 0,len=result.content.data.positions.length;i<len;i++){
                        lg.AllPositions[i] = result.content.data.positions[i]
                        lg.AllPositions[i].id = result.content.data.positions[i].positionId;
                    }
                    //lg.AllPositions = result.content.data.positions;

                    var filterGridView = new lg.Widgets.Controls.FilterGridView({
                        name:'filterGridView',
                        dataSource:lg.AllPositions,
                        key:['positionName','city','department','channelName'],
                        template:  '<td class="filter-gridview-row clearfix"><div class="positionName">{{positionName}}</div>'+
                                        '<div class="second-info">'+
                                        '{{if channelName}}'+
                                            '<span>{{channelName}}</span>'+
                                        '{{/if}}'+
                                        '{{if department}}'+
                                        '<span>{{department}}</span>'+
                                        '{{/if}}'+
                                        '{{if city}}'+
                                        '<span>{{city}}</span>'+
                                        '{{/if}}'+
                                        '{{if deliverCount || deliverCount === 0}}'+
                                        ' &nbsp;&nbsp;&nbsp;<i class="icon-resume-lib"> {{deliverCount}}'+
                                        '{{/if}}'+
                                        '</div>'+
                                    '</td>',
                        templateEng:template
                    });
                    $('.filter-gridview-box').find('.filterInput').hide();
                    $('.filter-gridview-box').find('.filterInput input').val('');
                    $('#groupSharePosition').modal('show');
                }
            });
        }else{
            var filterGridView = new lg.Widgets.Controls.FilterGridView({
                name:'filterGridView',
                dataSource:lg.AllPositions,
                key:['positionName','city','department','channelName'],
            template:       '<td class="filter-gridview-row clearfix"><div class="positionName">{{positionName}}</div>'+
                                '<div class="second-info">'+
                                '{{if channelName}}'+
                                '<span>{{channelName}}</span>'+
                                '{{/if}}'+
                                '{{if department}}'+
                                '<span>{{department}}</span>'+
                                '{{/if}}'+
                                '{{if city}}'+
                                '<span>{{city}}</span>'+
                                '{{/if}}'+
                                '</div>'+
                            '</td>',
                templateEng:template
            });
            $('.filter-gridview-box').find('.filterInput').hide();
            $('.filter-gridview-box').find('.filterInput input').val('');
            $('#groupSharePosition').modal('show');
        }

    });

    $('#groupSharePosition').on('click', '.submit',function (e) {
        var data = {};
        data.positionIds = lg.getfilterGridView().getValue().join(',');
        data.source='position';
        data.userId = lg.getsharefilterSelect().getValue().userId;
        $.ajax({
            url:'../recruiter/batchAddRecruiter.json',
            data:data,
            type:'POST'
        }).success(function (result) {
            if(result.state==1){
                $('#groupSharePosition').modal('hide');
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
    });

    $('.filter-gridview-box').on('click','.search', function (e) {
        $('.filter-gridview-box').find('.filterInput').find('input').val('');
        $('.filter-gridview-box').find('.filterInput').find('input').focus();
        $('.filter-gridview-box').find('.filterInput').toggle();
    });

    $('.filter-gridview-box').find('.filterInput .input').on('keyup  blur change focus', function (e) {
        lg.getfilterGridView().setFilterValue($(this).val());
    });

    $('.filter-gridview-box').on('click','.selectAll', function (e) {
        lg.getfilterGridView().setSelectAll(true);
    });

    $('.filter-gridview-box').on('click','.selectNone', function (e) {
        lg.getfilterGridView().setSelectAll(false);
    });

});

/*!positions/page/my-positions-list-online/main.js*/
;/**
 * B端主页业务入口文件
 * 此文件应当只包含：
 *     require( 'xxx' );
 *     require( 'xxx' );
 * 等语句，每一个require为每一个子模块的入口文件
 *
 * @author stormlu@lagou.com
 */

define('positions/page/my-positions-list-online/main', ['require', 'exports', 'module', 'common/widgets/header/main', 'common/widgets/navigation/main', 'dep/jquery-placeholder/jquery.placeholder', 'common/components/pagination/jquery.pagination', 'common/static/js/lagou.mini', 'common/components/filterSelect/main', 'common/components/filterGridView/main', 'common/components/memberCheckBoxList/main', 'positions/modules/plus-positon-tips-widget/main', 'positions/modules/add-recruiter-pop/main', 'positions/modules/group-share-position-pop/main'], function(require, exports, module) {
    require('common/widgets/header/main');
    require('common/widgets/navigation/main');
    require('dep/jquery-placeholder/jquery.placeholder');
    require('common/components/pagination/jquery.pagination');

    $('input').placeholder();


    //拉勾 框架
    require('common/static/js/lagou.mini');

    require('common/components/filterSelect/main');
    require('common/components/filterGridView/main');
    require('common/components/memberCheckBoxList/main');
    require('positions/modules/plus-positon-tips-widget/main');

    var userData={};
    var userInfo = CONST_VARS('user') || {};
    var goodsInfo = CONST_VARS('goodsInfo') || {};
    var freshedText = ( goodsInfo.lagouJiaCompany && !goodsInfo.pause ? '1' : '3' ) + '天内请勿重复刷新';
    var $groupRefreshPositions = $('.group-refresh-position');

    function setString(str, len) {
    var strlen = 0;
    var s = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 128) {
            strlen += 2;
        } else {
            strlen++;
        }
        s += str.charAt(i);
        if (strlen >= len) {
            if(i==(str.length-1)){
                return s;
            }
            return s+'...';
        }
    }
    return s;
    }
    $('.add-recruiter').on('click',function(e){
        var $positionItem = $(this).closest('.position-list-item');
        var title = $positionItem.find('.title .position-name').text();
        var source = $positionItem.find('.source').text().replace(/\[|\]/g,'');
        var department = $positionItem.find('.department').text();
        var city = $positionItem.find('.city').text();
        var positionId = $positionItem.attr('data-item');
        var positionOwnerId = $positionItem.attr('data-position-owner-id');
        $('.recruiter-list-submit').attr('data-item',positionId);
        $('.invite-email-submit').attr('data-item',positionId);
        // 招聘职位字数控制
        var title_s = '';
        if(title.length >10){
            title_s = title.substring(0,10)+'...';
        }else{
            title_s = title
        }

        var department_s='';
        if(department.length>10) {
        	department_s = department.substring(0,10)+'...';
        }
        else {
        	department_s=department;
        }

        $('#add-member .invite-title').html('共享职位<em title="'+title+'">&nbsp;-&nbsp;'+title_s+'</em>' + (source?'<span>'+source+'</span>' : '') + (department_s?'<span title="'+department+'">'+department_s+'</span>':'') + (city?'<span>'+city+'</span>':''));
        var that = this;
        if(typeof lg.AllMembers === 'undefined') {
            $.ajax({
                url: '../member/all_members.json',
                dataType: 'json',
                data:{positionId:$(that).closest('li').attr('data-item')},
                cache:false
            }).success(function(result) {
                    if(result.state==1){
                        lg.AllMembers = result.content.data.members;
                        getRecruiters(positionOwnerId);
                    }
            });
        } else {
            getRecruiters(positionOwnerId);
        }
        function getRecruiters(positionOwnerId){
            $.ajax({
                url: '../recruiter/getRecruitersByPositionId.json',
                dataType: 'json',
                data:{positionId:$(that).closest('li').attr('data-item')},
                cache:false
            }).success(function(data) {
                    if(data.state==1){
                        $('.recruiter-list-select').empty();
                        //响应太慢，成假死状态，先展示弹窗，再处理数据
                        $('#add-member').modal('show');
                         var html = '';
                         var myMembers = [];

                         //数据量大时循环次数太多，优化一下
                         // for(var i=0,len = lg.AllMembers.length; i<len; i++){
                         //     var member=lg.AllMembers[i];
                         //     var isRecruiter = false;
                         //     for(var j = 0,len1 = data.content.data.recruiters.length; j<len1; j++){
                         //         var recruiterId = data.content.data.recruiters[j];
                         //         if(member.userId == recruiterId){
                         //             lg.AllMembers[i].isChecked = true;
                         //             myMembers.push(lg.AllMembers[i]);
                         //         }
                         //     }

                         // }

                         var transFilterList = lg.AllMembers;
                         for(var i= 0,len=transFilterList.length;i<len;i++){
                            if(typeof lg.AllMemberIdArr == 'undefined') {
                                lg.AllMemberIdArr = [];
                                lg.AllMemberIdArr.push(transFilterList[i].userId);
                            } else {
                                lg.AllMemberIdArr.push(transFilterList[i].userId);
                            }
                             transFilterList[i].email = transFilterList[i].email?transFilterList[i].email.substring(0,transFilterList[i].email.indexOf('@')):transFilterList[i].email;
                             transFilterList[i].receiveEmail = transFilterList[i].receiveEmail?transFilterList[i].receiveEmail.substring(0,transFilterList[i].receiveEmail.indexOf('@')):transFilterList[i].receiveEmail;
                         }

                         var memberI = {};
                         for(var j = 0,len1 = data.content.data.recruiters.length; j<len1; j++){
                             var recruiterId = data.content.data.recruiters[j];
                             var index = lg.AllMemberIdArr.indexOf(recruiterId);
                             // 不要直接修改lg.AllMembers[index]，缓存会影响后续
                             memberI = $.extend({}, lg.AllMembers[index]);
                             if(index !== -1){
                                 memberI.isChecked = true;
                                 if (('' + recruiterId) === positionOwnerId) {
                                    memberI.isDisabled = true;
                                 }
                                 myMembers.push(memberI);
                             }
                         }


                         var addRecruiterMemberCheckBoxList = new lg.Widgets.Controls.MemberCheckBoxList({
                             name:'addRecruiterMemberCheckBoxList',
                             dataSource:myMembers,
                             onlyShowSelected:true
                         });
                         var addRecruiterFilterSelect = new lg.Widgets.Controls.FilterSelect({
                             name:'addRecruiterFilterSelect',
                             key:['name','email','receiveEmail'],
                             dataSource:transFilterList,
                             placeHolder:'查找同事'
                         });

                         addRecruiterFilterSelect.on('select', function (e) {
                             if(typeof e != 'undefined' && typeof e.itemData != 'undefined'){
                                var itemData = $.extend({}, e.itemData);
                                 itemData.isChecked=true;
                                 if (('' + itemData.userId) === positionOwnerId) {
                                    itemData.isDisabled = true;
                                 }
                                 addRecruiterMemberCheckBoxList.addItem(itemData);
                             }
                         });
                        var invite_box = $('.invite-box');
                        $(invite_box.find('.invite-email-list')[0]).siblings('.invite-email-list').remove();
                        invite_box.find('.invite-email-list>input').val('').removeClass('error');
                        $($('.mds-tab a')[0]).trigger('click');

                    }
            });
        }
    });


    //刷新职位
    $('.recruiter-reflash').on('click', function (e) {
        var $me = $(this);
        var btnText = $.trim($me.text());
        var posUserId = $me.attr('data-userid');
        var confirmText = '';

        if ( $me.attr('disabled') === 'disabled' ){
           return;
        }

        if ( btnText === freshedText || btnText === '已刷新' ) {
            return;
        }

        if ( goodsInfo.onlinePositionCount > goodsInfo.onlinePositionMaxCount ) {
            if ( goodsInfo.lagouJiaCompany && goodsInfo.miniLagouJia && goodsInfo.pause ) {
                confirmText = '由于贵公司拉勾网在线职位数超额，<em style="color:#0099ff;">拉勾网职位暂不可刷新。</em>请下线部分职位以发布更多新职位。';
            } else if ( goodsInfo.lagouJiaCompany ) {
                confirmText = '由于贵公司拉勾网在线职位数超额，<em style="color:#0099ff;">拉勾网职位暂不可刷新。</em>请下线部分职位或联系拉勾客户经理获取更多在线职位数。';
            } else {
                confirmText = '由于贵公司拉勾网在线职位数超额，<em style="color:#0099ff;">拉勾网职位暂不可刷新。</em>请下线部分职位或升级拉勾+ 获取更多在线职位数。';
            }

            return new lg.Widgets.Controls.Confirm({
                content: confirmText,
                submitText: '关闭',
                noCancelBtn: true,
                SubmitBtn: function (e) {
                    e.control.setRemove();
                }
            });
        }

        $.ajax({
            url: 'refreshPosition.json',
            dataType: 'json',
            data: {
                positionId: $me.closest('li').attr('data-item')
            },
            type: 'POST',
            cache: false
        }).done(function (result) {
            var state = parseInt(result.state, 10);
            var currentUserId = userInfo.id;

            if ( state === 1) {
                $($($me.closest('.position-item-bottom').children('div')[0]).find('span')[0]).text('刚刚');
                $me.text('已刷新').css('color', '#c1c1c1');
                $me.attr('disabled', 'disabled');
            } else if ( state === 403) {
                if ( typeof result.content.data.publisherId !== 'undefined' && result.content.data.publisherId == currentUserId ) {
                    confirmText = '你的有效职位数已达普通用户上限，暂时不可刷新职位，请下线次要职位，或开通拉勾+ 服务';
                } else {
                    confirmText = result.content.data.publisherName + '的有效职位数已达普通用户上限，暂时不可刷新职位，请通知Ta下线次要职位，或开通拉勾+ 服务。';
                }
            } else if ( state === 404) {
                if ( typeof result.content.data.publisherId !== 'undefined' && result.content.data.publisherId == currentUserId ) {
                    confirmText = '工作地址不规范，请编辑职位后再刷新职位。';
                } else {
                    confirmText = '工作地址不规范，请通知' + result.content.data.publisherName + '编辑职位后再刷新职位。';
                }
            } else {
                confirmText = '刷新失败，拉勾网的职位' + ( goodsInfo.lagouJiaCompany ? '1' : '3' ) + '天内只能刷新一次';
            }

            if ( confirmText.length > 0 ) {
                new lg.Widgets.Controls.Confirm({
                    content: confirmText,
                    submitText: '确定',
                    noCancelBtn: true,
                    SubmitBtn: function (e) {
                        e.control.setRemove();
                    }
                });
            }
        });
    });

    //刷新职位 职位下线 弹窗
    $('.position-offline').on('click',function(e){
        var that = this;
        if($(that).hasClass('disabled'))return;
        var confirm = new lg.Widgets.Controls.Confirm({
           content:'下线'+$(that).closest('li.position-list-item').find('.title .position-name').text()+'后，你可以在「已下线」中重新发布',
           submitText:"好的",
           cancelText:"取消",
           SubmitBtn:function(e){
               $.ajax({
                    url: 'offlinePosition.json',
                    dataType: 'json',
                    data:{positionId:$(that).closest('li.position-list-item').attr('data-item')},
                    type:'POST',
                    cache:false
                }).done(function(result) {
                    if(result.state==1){
                        window.location.reload();
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
                    }else{
                        var confirm = new lg.Widgets.Controls.Confirm({
                            content:'<div>下线职位失败！ </div>',
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
           CancelBtn:function(e){
           }
        });
    });

    //展开下拉列表
    $('.dropdown .more_toggle').on('click',function(e){
        if ($(this).next('.toggle_menu').is(':hidden')) {
            $(this).next('.toggle_menu').show();
        } else {
            $(this).next('.toggle_menu').hide();
        }
        e.stopPropagation();
    });
    //点击空白收起下拉菜单
    $(document).on('click',function(e){
        e.stopPropagation();
        var ele = $('.more_toggle');
        if( !ele.is(e.target) && ele.has(e.target).length === 0 ){
            if($('.dropdown .toggle_menu').is(":visible")){
                $('.dropdown .toggle_menu').hide();
            }
        }
    });

    //pingbi position
    $('.shield_position').on('click',function(e){
        var that = this;
        if($(that).hasClass('disabled'))return;
        var confirm = new lg.Widgets.Controls.Confirm({
            content:'屏蔽后，候选人、简历库、报表模块将不再展示该职位收到的简历',
            submitText:"了解，屏蔽职位",
            cancelText:"取消",
            SubmitBtn:function(e){
                $.ajax({
                    url: 'shield.json',
                    dataType: 'json',
                    data:{positionId:$(that).closest('li.position-list-item').attr('data-item')},
                    type:'POST',
                    cache:false
                }).done(function(result) {
                    if(result.state==1){
                        window.location.reload();
                        e.control.setRemove();
                    }else{
                        alert('屏蔽职位失败！');
                    }

                });
            },
            CancelBtn:function(e){
            }
        });
    });
    //一键刷新职位

    $groupRefreshPositions.on('click', 'a', function (e) {
        var disableClass = 'disable-group-refresh';
        var strText = '来自拉勾的职位将立即刷新，其他渠道的职位可能会有时间延迟，请耐心等待。';

        if ( goodsInfo.onlinePositionCount > goodsInfo.onlinePositionMaxCount ) { // 在线职位超过上限
            strText = '由于贵公司拉勾网在线职位数超额，<em style="color:#0099ff;">拉勾网职位暂不可刷新；</em>其他渠道的职位依然可刷新，但可能会有延迟，请耐心等待。';
        }

        if ( $groupRefreshPositions.hasClass(disableClass) ) {
            return;
        }

        new lg.Widgets.Controls.Confirm({
            content: strText,
            submitText: '好的',
            cancelText: '取消',
            SubmitBtn: function (e) {
                $.ajax({
                    url: 'batchrefreshPosition.json',
                    dataType: 'json',
                    type: 'GET'
                }).done(function (result) {
                    $groupRefreshPositions.addClass(disableClass);

                    if ( parseInt(result.state, 10) === 1 ) {
                        var $positionList = $(".position-list .position-list-item");
                        var btnText = '';

                        for ( var i = 0, len = $positionList.length; i < len; i++ ) {
                            var tempPositionId = $positionList.eq(i).attr("data-item");
                            var $btn = $positionList.eq(i).find(".recruiter-reflash");
                            var btnText = $.trim($btn.text());

                            if ( btnText === '已刷新' ) {
                                $btn.text(freshedText).css('color', '#c1c1c1');
                            } else if ( result.content.data.refreshResult[tempPositionId] ) {
                                $btn.text('已刷新').css('color', '#c1c1c1');
                            } else {
                                $btn.text('刷新失败').css('color', '#c1c1c1');
                            }

                            $btn.attr('disabled', 'disabled');
                        }
                        e.control.setRemove();
                    }
                });
            }
        });
    });

    //add member pop
    require('positions/modules/add-recruiter-pop/main');
    //group-share-position pop
    require('positions/modules/group-share-position-pop/main');
    //删除成员
    $('.remove').on('click',function(e){

        if($(this).hasClass('disabled'))return;
        var content = $('.mds-confirm').find('.mds-confirm-content');
        var submit = $('.mds-confirm').find('.mds-confirm-submit');
        var concel = $('.mds-confirm').find('.mds-confirm-concel');
        content.text('被移出的同事，将不能再访问本公司，并会解除此账号的招聘服务（删除账号数据），请确定无误后再操作。');

        submit.text('了解,转让给'+$($(this).closest('tr').find('td>span')[0]).text());
        submit.on('click',{rmUserId:$(this).closest('tr').attr('data-item'),companyId:userData.companyId},function(e){
            $.ajax({
                url: '../member/remove.json',
                dataType: 'json',
                data:e.data,
                type:'POST',
                cache:false
            }).done(function(result) {
                if(result.state==1){
                    document.location.reload();
                }

            });

        });
        concel.on('click',function (e) {
            $('.mds-confirm').hide();
        })
        $('.mds-confirm').show();

    });

    //转让管理员权限
    $('.transfer').on('click',function(e){
        if($(this).hasClass('disabled'))return;
        var content = $('.mds-confirm').find('.mds-confirm-content');
        var submit = $('.mds-confirm').find('.mds-confirm-submit');
        var concel = $('.mds-confirm').find('.mds-confirm-concel');
        content.text('转让后，你将失去管理员权限。');
        submit.text('了解,转让给'+$($(this).closest('tr').find('td>span')[0]).text());
        submit.one('click',{rmUserId:$(this).closest('tr').attr('data-item'),companyId:userData.companyId},function(e){
            $.ajax({
                url: '../member/reset_manager.json',
                dataType: 'json',
                data:e.data,
                type:'POST',
                cache:false
            }).done(function(result) {
                if(result.state==1){
                    document.location.reload();
                }

            });

        });
        concel.one('click',function (e) {
            $('.mds-confirm').hide();
        })
        $('.mds-confirm').show();

    });
    //
    var _Pagination = $("#pagination");
    var total_count = _Pagination.data('total-count');
    var total_page_count = _Pagination.data('total-page-count');
    var page_size = _Pagination.data('page-size');
    var page_no = _Pagination.data('page-no');

    _Pagination.pager({
          currPage: page_no,
          pageNOName: "pageNo",
          form: "positionListForm",
          pageCount: total_page_count,
          pageSize:  9
    });

    // 拉勾+推广提示
    $(".remind-close").click(function(){
        $(".to-plus-remind").css("display","none");
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
