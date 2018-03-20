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
/*!resume-lib/modules/filter-option/main.js*/
;
define('resume-lib/modules/filter-option/main', ['require', 'exports', 'module'], function(require, exports, module) {


	var rfo = $('.resume-filter-option');
	var hasMorePositions =  $('.positions').prop('scrollHeight')>40?true:false;
	if(hasMorePositions){
		//
		$('.positions').find('.has_more').show();
		// $('.positions_box').css('height','inherit');
		$('.positions').find('.has_more').on('click',function(e){
			if($('.positions').css('height')=="32px"){
				$('.positions').addClass('positions_box');
				$('.positions').css('height','inherit');
				$(this).html('收起<i style="-moz-transform:rotate(0deg); -webkit-transform:rotate(0deg);transform:rotate(0deg);"> </i>');
			}else{
				$('.positions_box').css('height','32px');
				$(this).html('更多<i> </i>');
				$('.positions').removeClass('positions_box');
			}
		});
		if($('.positions').find('.current').length>0&&$('.positions').find('.current').attr('data-id')!=0){
			$('.positions').addClass('positions_box');
			$('.positions').css('height','inherit');
			$('.positions').find('.has_more').html('收起<i style="-moz-transform:rotate(0deg); -webkit-transform:rotate(0deg);transform:rotate(0deg);"> </i>');
		}
	}
	rfo.on('click', 'span', function(){
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

		rfo.find('input[name="'+opt+'"]').val(id);

		if(opt == 'resumeStage'){
			if(rfo.find('input[name="resumeType"]').val()==1||rfo.find('input[name="resumeType"]').val()==3||rfo.find('input[name="resumeType"]').val()==4){
				rfo.find('input[name="resumeStage"]').val(0);
			}
		}else if(opt == 'resumeType'){
			if(rfo.find('input[name="resumeType"]').val() != 2){
				rfo.find('input[name="resumeStage"]').val(0);
			}
		}

		if(rfo.find('input[name="resumeStage"]').val() != 0){
			rfo.find('input[name="resumeType"]').val(2);
		}

		if( rfo.find('input[name="channelType"]').val() != 1 ){
			rfo.find('input[name="plus"]').val('');
		}

		$('#resumeSearchForm').submit();
	});

	//是否plus渠道选择的标志
	$('.lagou-channel-items em').on( 'click', function () {
		var _this = $(this),
			$i = _this.find( 'i' );
		if( $i.hasClass('icon-checkbox') ) {
			$i.attr( 'class', 'icon-checkedbox ');
		}else {
			$i.attr( 'class', 'icon-checkbox' );
		}

		var tagArr = [],
			plusId = $('input[name="plus"]').val();
		if( plusId != '0' ) {
			tagArr = plusId.split(',');
		}

		if( $i.hasClass( 'icon-checkbox' ) ) {
			for( var k = 0, len = tagArr.length; k < len; k++ ) {
				if( _this.attr( 'data-tag' ) == tagArr[k] ) {
					tagArr.splice( k, 1 );
					break;
				}
			}
		}else {
			tagArr.push( _this.data( 'tag' ) );
		}

		// 如果没有内容，plusStr = '0'
		var plusStr = tagArr.join(',');
		if ( !plusStr ) {
			plusStr = '0';
		}
		$('input[name="plus"]').val( plusStr );

		$('#resumeSearchForm').submit();
	});
});

/*!resume-lib/modules/resume-list/main.js*/
;
define('resume-lib/modules/resume-list/main', ['require', 'exports', 'module'], function(require, exports, module) {
	var _Pagination = $("#pagination");
	var total_count = _Pagination.data('total-count');
	var total_page_count = _Pagination.data('total-page-count');
	var page_size = _Pagination.data('page-size');
	var page_no = _Pagination.data('page-no');
  
   	_Pagination.pager({
		  currPage: page_no,
	      pageNOName: "pageNo",
	      form: "resumeSearchForm",
	      pageCount: total_page_count,
	      pageSize:  9
	});

   	$('#searchForm').on('change', 'input[name=keyword]', function(event) {
   		$('#resumeSearchForm input[name=keyword]').val($(this).val());
   	});
   	if($('#searchForm .fields input').val() == "极速入职"){
   		$('.resume_stage').each(function(){
   			if($(this).text() == "新简历"){
   				$(this).css('color','#fe6633')
   			}
   		})
   		
   	}
   	

});

/*!resume-lib/page/main.js*/
;/**
 * 简历库主页业务入口文件
 * 此文件应当只包含：
 *     require( 'xxx' );
 *     require( 'xxx' );
 * 等语句，每一个require为每一个子模块的入口文件
 *
 * @author vee@lagou.com
 */

define('resume-lib/page/main', ['require', 'exports', 'module', 'dep/jquery-placeholder/jquery.placeholder', 'common/components/pagination/jquery.pagination', 'common/widgets/header/main', 'common/widgets/navigation/main', 'resume-lib/modules/filter-option/main', 'resume-lib/modules/resume-list/main'], function(require, exports, module) {

    require('dep/jquery-placeholder/jquery.placeholder');
    require('common/components/pagination/jquery.pagination');

    $('input').placeholder();

    //header
    require('common/widgets/header/main');

    //navigation
    require('common/widgets/navigation/main');

    //filter
    require('resume-lib/modules/filter-option/main');

    //table
    require('resume-lib/modules/resume-list/main');
  /*   var temp = document.cookie.split(';');
     var cookie = {};
     for(var i= 0,len=temp.length;i<len;i++){
     cookie[temp[i].split('=')[0]] = temp[i].split('=')[1];
     }*/
   /* function setCookie(name,value)
    {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }

//读取cookies
    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

        if(arr=document.cookie.match(reg))

            return (arr[2]);
        else
            return null;
    }*/
     if(!lg.Utils.getCookie('resTips')){
         $('.lib_resume_rang_tips').show();
     }else{
         $('.lib_resume_rang_tips').hide();
     }
    $('.lib_resume_rang_tips').find('.MDS-icon-modal-close').on('click', function (e) {
        lg.Utils.setCookie('resTips',true);
        $('.lib_resume_rang_tips').remove();
    })
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
