/*!dep/history.js/scripts/compressed/json2.js*/
;typeof JSON!="object"&&(JSON={}),function(){"use strict";function f(e){return e<10?"0"+e:e}function quote(e){return escapable.lastIndex=0,escapable.test(e)?'"'+e.replace(escapable,function(e){var t=meta[e];return typeof t=="string"?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var n,r,i,s,o=gap,u,a=t[e];a&&typeof a=="object"&&typeof a.toJSON=="function"&&(a=a.toJSON(e)),typeof rep=="function"&&(a=rep.call(t,e,a));switch(typeof a){case"string":return quote(a);case"number":return isFinite(a)?String(a):"null";case"boolean":case"null":return String(a);case"object":if(!a)return"null";gap+=indent,u=[];if(Object.prototype.toString.apply(a)==="[object Array]"){s=a.length;for(n=0;n<s;n+=1)u[n]=str(n,a)||"null";return i=u.length===0?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+o+"]":"["+u.join(",")+"]",gap=o,i}if(rep&&typeof rep=="object"){s=rep.length;for(n=0;n<s;n+=1)typeof rep[n]=="string"&&(r=rep[n],i=str(r,a),i&&u.push(quote(r)+(gap?": ":":")+i))}else for(r in a)Object.prototype.hasOwnProperty.call(a,r)&&(i=str(r,a),i&&u.push(quote(r)+(gap?": ":":")+i));return i=u.length===0?"{}":gap?"{\n"+gap+u.join(",\n"+gap)+"\n"+o+"}":"{"+u.join(",")+"}",gap=o,i}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(e){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(e){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(e,t,n){var r;gap="",indent="";if(typeof n=="number")for(r=0;r<n;r+=1)indent+=" ";else typeof n=="string"&&(indent=n);rep=t;if(!t||typeof t=="function"||typeof t=="object"&&typeof t.length=="number")return str("",{"":e});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(e,t){var n,r,i=e[t];if(i&&typeof i=="object")for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r=walk(i,n),r!==undefined?i[n]=r:delete i[n]);return reviver.call(e,t,i)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();
/*!common/static/trumbowys/trumbowyg.js*/
;/**
 * Trumbowyg v2.1.0 - A lightweight WYSIWYG editor
 * Trumbowyg core file
 * ------------------------
 * @link http://alex-d.github.io/Trumbowyg
 * @license MIT
 * @author Alexandre Demode (Alex-D)
 *         Twitter : @AlexandreDemode
 *         Website : alex-d.fr
 */

jQuery.trumbowyg = {
    langs: {
        en: {
            viewHTML: 'View HTML',

            undo: 'Undo',
            redo: 'Redo',

            formatting: 'Formatting',
            p: 'Paragraph',
            blockquote: 'Quote',
            code: 'Code',
            header: 'Header',

            bold: 'Bold',
            italic: 'Italic',
            strikethrough: 'Stroke',
            underline: '下划线',

            strong: '加粗',
            em: 'Emphasis',
            del: 'Deleted',

            superscript: 'Superscript',
            subscript: 'Subscript',

            unorderedList: '无序排列',
            orderedList: '有序排列',

            insertImage: 'Insert Image',
            link: 'Link',
            createLink: '插入链接',
            unlink: '取消链接',

            //测试
            test:'插入信息',
            /*testTitle1:'testTitle1',
             testTitle2:'testTitle2',*/
            candidateName:'候选人姓名',
            positionName:'担任职位',
            companyName:'公司全称',
            companyShortName:'公司简称',
            HRName:'HR姓名',
            HREmail:'HR邮箱',
            departmentName:'所属部门',
            entryDate:'入职日期',

            justifyLeft: 'Align Left',
            justifyCenter: 'Align Center',
            justifyRight: 'Align Right',
            justifyFull: 'Align Justify',

            horizontalRule: 'Insert horizontal rule',
            removeformat: 'Remove format',

            fullscreen: 'Fullscreen',

            close: 'Close',

            submit: '确定',
            reset: '取消',

            required: 'Required',
            description: 'Description',
            title: 'Title',
            text: '文本',
            target: 'Target'
        }
    },

    // Plugins
    plugins: {},

    // SVG Path globally
    svgPath: null
};


(function (navigator, window, document, $) {
    'use strict';

    $.fn.trumbowyg = function (options, params) {
        var trumbowygDataName = 'trumbowyg';
        if (options === Object(options) || !options) {
            return this.each(function () {
                if (!$(this).data(trumbowygDataName)) {
                    $(this).data(trumbowygDataName, new Trumbowyg(this, options));
                }
            });
        }
        if (this.length === 1) {
            try {
                var t = $(this).data(trumbowygDataName);
                switch (options) {
                    // Exec command
                    case 'execCmd':
                        return t.execCmd(params.cmd, params.param, params.forceCss);

                    // Modal box
                    case 'openModal':
                        return t.openModal(params.title, params.content);
                    case 'closeModal':
                        return t.closeModal();
                    case 'openModalInsert':
                        return t.openModalInsert(params.title, params.fields, params.callback);

                    // Range
                    case 'saveRange':
                        return t.saveRange();
                    case 'getRange':
                        return t.range;
                    case 'getRangeText':
                        return t.getRangeText();
                    case 'restoreRange':
                        return t.restoreRange();

                    // Enable/disable
                    case 'enable':
                        return t.toggleDisable(false);
                    case 'disable':
                        return t.toggleDisable(true);

                    // Destroy
                    case 'destroy':
                        return t.destroy();

                    // Empty
                    case 'empty':
                        return t.empty();

                    // HTML
                    case 'html':
                        return t.html(params);
                }
            } catch (c) {
            }
        }

        return false;
    };

    // @param: editorElem is the DOM element
    var Trumbowyg = function (editorElem, options) {
        var t = this,
            trumbowygIconsId = 'trumbowyg-icons';

        // Get the document of the element. It use to makes the plugin
        // compatible on iframes.
        t.doc = editorElem.ownerDocument || document;

        // jQuery object of the editor
        t.$ta = $(editorElem); // $ta : Textarea
        t.$c = $(editorElem); // $c : creator

        options = options || {};

        // Localization management
        if (options.lang != null || $.trumbowyg.langs[options.lang] != null) {
            t.lang = $.extend(true, {}, $.trumbowyg.langs.en, $.trumbowyg.langs[options.lang]);
        } else {
            t.lang = $.trumbowyg.langs.en;
        }

        // SVG path
        var svgPathOption = $.trumbowyg.svgPath != null ? $.trumbowyg.svgPath : options.svgPath;
        var imgURL =  options.imgURL;
        t.imgURL = imgURL;
        t.hasSvg = svgPathOption !== false;
        t.svgPath = !!t.doc.querySelector('base') ? window.location : '';
        if ($('#' + trumbowygIconsId, t.doc).length === 0 && svgPathOption !== false) {
            if (svgPathOption == null) {
                try {
                    throw new Error();
                } catch (e) {
                    var stackLines = e.stack.split('\n');

                    for (var i in stackLines) {
                        if (!stackLines[i].match(/http[s]?:\/\//)) {
                            continue;
                        }
                        svgPathOption = stackLines[Number(i)].match(/((http[s]?:\/\/.+\/)([^\/]+\.js))(\?.*)?:/)[1].split('/');
                        svgPathOption.pop();
                        svgPathOption = svgPathOption.join('/') + '/ui/icons.svg';
                        break;
                    }
                }
            }

            var div = t.doc.createElement('div');
            div.id = trumbowygIconsId;
            t.doc.body.insertBefore(div, t.doc.body.childNodes[0]);
            /*$.ajax({
             async: true,
             type: 'GET',
             contentType: 'image/svg',
             dataType: 'xml',
             url: svgPathOption,
             data: null,
             beforeSend: null,
             complete: null,
             success: function (data) {
             div.innerHTML = new XMLSerializer().serializeToString(data.documentElement);
             }
             });*/
        }


        /**
         * When the button is associated to a empty object
         * fn and title attributs are defined from the button key value
         *
         * For example
         *      foo: {}
         * is equivalent to :
         *      foo: {
             *          fn: 'foo',
             *          title: this.lang.foo
             *      }
         */
        var h = t.lang.header, // Header translation
            isBlinkFunction = function () {
                return (window.chrome || (window.Intl && Intl.v8BreakIterator)) && 'CSS' in window;
            };
        t.btnsDef = {
            viewHTML: {
                fn: 'toggle'
            },

            undo: {
                isSupported: isBlinkFunction,
                key: 'Z'
            },
            redo: {
                isSupported: isBlinkFunction,
                key: 'Y'
            },

            p: {
                fn: 'formatBlock'
            },
            blockquote: {
                fn: 'formatBlock'
            },
            h1: {
                fn: 'formatBlock',
                title: h + ' 1'
            },
            h2: {
                fn: 'formatBlock',
                title: h + ' 2'
            },
            h3: {
                fn: 'formatBlock',
                title: h + ' 3'
            },
            h4: {
                fn: 'formatBlock',
                title: h + ' 4'
            },
            subscript: {
                tag: 'sub'
            },
            superscript: {
                tag: 'sup'
            },

            bold: {
                key: 'B'
            },
            italic: {
                key: 'I'
            },
            underline: {
                tag: 'u'
            },
            strikethrough: {
                tag: 'strike'
            },

            strong: {
                fn: 'bold',
                key: 'B'
            },
            em: {
                fn: 'italic',
                key: 'I'
            },
            del: {
                fn: 'strikethrough'
            },

            createLink: {
                key: 'K',
                tag: 'a'
            },
            unlink: {},

            insertImage: {},

            justifyLeft: {
                tag: 'left',
                forceCss: true
            },
            justifyCenter: {
                tag: 'center',
                forceCss: true
            },
            justifyRight: {
                tag: 'right',
                forceCss: true
            },
            justifyFull: {
                tag: 'justify',
                forceCss: true
            },

            unorderedList: {
                fn: 'insertUnorderedList',
                tag: 'ul'
            },
            orderedList: {
                fn: 'insertOrderedList',
                tag: 'ol'
            },

            horizontalRule: {
                fn: 'insertHorizontalRule'
            },

            removeformat: {},

            fullscreen: {
                class: 'trumbowyg-not-disable'
            },
            close: {
                fn: 'destroy',
                class: 'trumbowyg-not-disable'
            },

            // Dropdowns
            formatting: {
                dropdown: ['p', 'blockquote', 'h1', 'h2', 'h3', 'h4'],
                ico: 'p',
            },
            link: {
                dropdown: ['createLink', 'unlink']
            },
            test: {
                dropdown: ['candidateName', 'positionName','departmentName','entryDate','companyName','companyShortName','HRName','HREmail'],
                ico: 'p',
                showTitle:true
            },
            candidateName: {},
            positionName: {},
            companyName: {},
            companyShortName: {},
            HRName: {},
            HREmail: {},
            departmentName: {},
            entryDate: {}
        };

        // Defaults Options
        t.o = $.extend(true, {}, {
            lang: 'en',

            fixedBtnPane: false,
            fixedFullWidth: false,
            autogrow: false,

            prefix: 'trumbowyg-',

            semantic: true,
            resetCss: false,
            removeformatPasted: false,
            tagsToRemove: [],

            btnsGrps: {
                design: ['bold', 'italic', 'underline', 'strikethrough'],
                //semantic: ['strong', 'em', 'del'],
                semantic: ['strong', 'underline'],
                justify: ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                lists: ['unorderedList', 'orderedList'],
                links: ['createLink', 'unlink']
            },
            btns: [
                ['viewHTML'],
                ['undo', 'redo'],
                ['formatting'],
                'btnGrp-semantic',
                ['superscript', 'subscript'],
                ['link'],
                ['insertImage'],
                'btnGrp-justify',
                'btnGrp-lists',
                ['horizontalRule'],
                ['removeformat'],
                ['fullscreen'],
                'btnGrp-links'
            ],
            // For custom button definitions
            btnsDef: {},

            inlineElementsSelector: 'a,abbr,acronym,b,caption,cite,code,col,dfn,dir,dt,dd,em,font,hr,i,kbd,li,q,span,strikeout,strong,sub,sup,u,img',

            pasteHandlers: [],

            imgDblClickHandler: function () {
                var $img = $(this),
                    src = $img.attr('src'),
                    base64 = '(Base64)';

                if (src.indexOf('data:image') === 0) {
                    src = base64;
                }

                if($img.attr('data-mds-key')){
                    return;
                }

                t.openModalInsert(t.lang.insertImage, {
                    url: {
                        label: 'URL',
                        value: src,
                        required: true
                    },
                    alt: {
                        label: t.lang.description,
                        value: $img.attr('alt')
                    }
                }, function (v) {
                    if (v.src !== base64) {
                        $img.attr({
                            src: v.src
                        });
                    }
                    $img.attr({
                        alt: v.alt
                    });
                    return true;
                });
                return false;
            },

            plugins: {}
        }, options);

        t.disabled = t.o.disabled || (editorElem.nodeName === 'TEXTAREA' && editorElem.disabled);

        if (options.btns) {
            t.o.btns = options.btns;
        } else if (!t.o.semantic) {
            t.o.btns[4] = 'btnGrp-design';
        }

        $.each(t.o.btnsDef, function (btnName, btnDef) {
            t.addBtnDef(btnName, btnDef);
        });

        // Keyboard shortcuts are load in this array
        t.keys = [];

        // Tag to button dynamically hydrated
        t.tagToButton = {};
        t.tagHandlers = [];

        // Admit multiple paste handlers
        t.pasteHandlers = [].concat(t.o.pasteHandlers);

        t.init();
    };

    Trumbowyg.prototype = {
        init: function () {
            var t = this;
            t.height = t.$ta.height();

            t.initPlugins();

            try {
                // Disable image resize, try-catch for old IE
                t.doc.execCommand('enableObjectResizing', false, false);
            } catch (e) {
            }
            t.doc.execCommand('defaultParagraphSeparator', false, 'p');

            t.buildEditor();
            t.buildBtnPane();

            t.fixedBtnPaneEvents();

            t.buildOverlay();

            setTimeout(function () {
                if (t.disabled) {
                    t.toggleDisable(true);
                }
                t.$c.trigger('tbwinit');
            });
        },

        candidateName: function () {
            var t = this;
            t.saveRange();
            t.insertKey(arguments[0])
        },
        positionName: function () {
            var t = this;
            t.saveRange();
            t.insertKey(arguments[0])
        },
        companyName: function () {
            var t = this;
            t.saveRange();
            t.insertKey(arguments[0])
        },
        companyShortName: function () {
            var t = this;
            t.saveRange();
            t.insertKey(arguments[0])
        },
        HRName: function () {
            var t = this;
            t.saveRange();
            t.insertKey(arguments[0])
        },
        HREmail: function () {
            var t = this;
            t.saveRange();
            t.insertKey(arguments[0])
        },
        departmentName: function () {
            var t = this;
            t.saveRange();
            t.insertKey(arguments[0])
        },
        entryDate: function () {
            var t = this;
            t.saveRange();
            t.insertKey(arguments[0])
        },
        insertKey: function (title) {
            var t = this;
            t.saveRange();
            var v = {
                url:t.imgURL,
                alt:'候选人姓名'
            }
            if(typeof $.trumbowyg.params != 'undefined' && typeof $.trumbowyg.params[title] != 'undefined'){
                document.execCommand("inserthtml",'',$.trumbowyg.params[title])
            }else{
                t.restoreRange();
                t.doc.execCommand('insertImage', false, v.url);
                t.saveRange();
                $('img[src="'+v.url+'"]:not([alt])', t.$box).attr('alt', v.alt).addClass(title).attr('data-mds-key',true);
            }
            t.syncCode();
            t.$c.trigger('tbwchange');
        },
        /*   testTitle1: function () {
         var t = this;
         t.saveRange();
         var v = {
         url:'../test/sdfa.png',
         alt:'候选人候选人'
         }
         //t.execCmd('testTitle1', v.url);
         t.restoreRange();
         t.doc.execCommand('insertImage', false, t.textToUrl(v.alt));
         t.saveRange();

         $('img[src="' + t.textToUrl(v.alt) + '"]:not([alt])', t.$box).attr('alt', v.alt).attr('data-mds-key',true);
         t.syncCode();
         t.$c.trigger('tbwchange');
         },
         textToUrl: function (text) {
         var canvasdom = document.createElement('canvas');
         var ctx = canvasdom.getContext('2d');
         ctx.font = "70px 微软雅黑";
         ctx.fillStyle = '#333333';
         var text = ctx.fillText(text,50,100);
         var image = new Image();
         return canvasdom.toDataURL("image/png");
         },*/

        addBtnDef: function (btnName, btnDef) {
            this.btnsDef[btnName] = btnDef;
        },

        buildEditor: function () {
            var t = this,
                prefix = t.o.prefix,
                html = '';

            t.$box = $('<div/>', {
                class: prefix + 'box ' + prefix + 'editor-visible ' + prefix + t.o.lang + ' trumbowyg'
            });

            // $ta = Textarea
            // $ed = Editor
            t.isTextarea = t.$ta.is('textarea');
            if (t.isTextarea) {
                html = t.$ta.val();
                t.$ed = $('<div/>');
                t.$box
                    .insertAfter(t.$ta)
                    .append(t.$ed, t.$ta);
            } else {
                t.$ed = t.$ta;
                html = t.$ed.html();

                t.$ta = $('<textarea/>', {
                    name: t.$ta.attr('id'),
                    height: t.height
                }).val(html);

                t.$box
                    .insertAfter(t.$ed)
                    .append(t.$ta, t.$ed);
                t.syncCode();
            }

            t.$ta
                .addClass(prefix + 'textarea')
                .attr('tabindex', -1)
            ;

            t.$ed
                .addClass(prefix + 'editor')
                .attr({
                    contenteditable: true,
                    dir: t.lang._dir || 'ltr'
                })
                .html(html)
            ;

            if (t.o.tabindex) {
                t.$ed.attr('tabindex', t.o.tabindex);
            }

            if (t.$c.is('[placeholder]')) {
                t.$ed.attr('placeholder', t.$c.attr('placeholder'));
            }

            if (t.o.resetCss) {
                t.$ed.addClass(prefix + 'reset-css');
            }

            if (!t.o.autogrow) {
                t.$ta.add(t.$ed).css({
                    height: t.height
                });
            }

            t.semanticCode();


            t._ctrl = false;
            t.$ed
                .on('dblclick', 'img', t.o.imgDblClickHandler)
                .on('keydown', function (e) {
                    t._composition = (e.which === 229);

                    if (e.ctrlKey) {
                        t._ctrl = true;
                        var k = t.keys[String.fromCharCode(e.which).toUpperCase()];

                        try {
                            t.execCmd(k.fn, k.param);
                            return false;
                        } catch (c) {
                        }
                    }
                })
                .on('keyup', function (e) {
                    if (e.which >= 37 && e.which <= 40) {
                        return;
                    }

                    if (e.ctrlKey && (e.which === 89 || e.which === 90)) {
                        t.$c.trigger('tbwchange');
                    } else if (!t._ctrl && e.which !== 17 && !t._composition) {
                        t.semanticCode(false, e.which === 13);
                        t.$c.trigger('tbwchange');
                    }

                    setTimeout(function () {
                        t._ctrl = false;
                    }, 200);
                })
                .on('mouseup keydown keyup', function () {
                    t.updateButtonPaneStatus();
                })
                .on('focus blur', function (e) {
                    t.$c.trigger('tbw' + e.type);
                    if (e.type === 'blur') {
                        $('.' + prefix + 'active-button', t.$btnPane).removeClass(prefix + 'active-button ' + prefix + 'active');
                    }
                })
                .on('cut', function () {
                    t.$c.trigger('tbwchange');
                })
                .on('paste', function (e) {
                    if (t.o.removeformatPasted) {
                        e.preventDefault();

                        try {
                            // IE
                            var text = window.clipboardData.getData('Text');

                            try {
                                // <= IE10
                                t.doc.selection.createRange().pasteHTML(text);
                            } catch (c) {
                                // IE 11
                                t.doc.getSelection().getRangeAt(0).insertNode(t.doc.createTextNode(text));
                            }
                        } catch (d) {
                            // Not IE
                            t.execCmd('insertText', (e.originalEvent || e).clipboardData.getData('text/plain'));
                        }
                    }

                    // Call pasteHandlers
                    $.each(t.pasteHandlers, function (i, pasteHandler) {
                        pasteHandler(e);
                    });

                    setTimeout(function () {
                        if (t.o.semantic) {
                            t.semanticCode(false, true);
                        } else {
                            t.syncCode();
                        }
                        t.$c.trigger('tbwpaste', e);
                    }, 0);
                });
            t.$ta.on('keyup paste', function () {
                t.$c.trigger('tbwchange');
            });

            $(t.doc).on('keydown', function (e) {
                if (e.which === 27) {
                    t.closeModal();
                    return false;
                }
            });
        },


        // Build button pane, use o.btns option
        buildBtnPane: function () {
            var t = this,
                prefix = t.o.prefix;

            var $btnPane = t.$btnPane = $('<div/>', {
                class: prefix + 'button-pane'
            });
            $.each(t.o.btns, function (i, btnGrps) {
                // Managment of group of buttons
                try {
                    var b = btnGrps.split('btnGrp-');
                    if (b[1] != null) {
                        btnGrps = t.o.btnsGrps[b[1]];
                    }
                } catch (c) {
                }

                if (!$.isArray(btnGrps)) {
                    btnGrps = [btnGrps];
                }

                var $btnGroup = $('<div/>', {
                    class: prefix + 'button-group ' + ((btnGrps.indexOf('fullscreen') >= 0) ? prefix + 'right' : '')
                });
                $.each(btnGrps, function (i, btn) {
                    try { // Prevent buildBtn error
                        var $item;

                        if (t.isSupportedBtn(btn)) { // It's a supported button
                            $item = t.buildBtn(btn);
                        }

                        $btnGroup.append($item);
                    } catch (c) {
                    }
                });
                $btnPane.append($btnGroup);
            });

            t.$box.prepend($btnPane);
        },


        // Build a button and his action
        buildBtn: function (btnName) { // btnName is name of the button
            var t = this,
                prefix = t.o.prefix,
                btn = t.btnsDef[btnName],
                isDropdown = btn.dropdown,
                textDef = t.lang[btnName] || btnName,
//http://mds.lagou.com:8080/static/common/static/trumbowys/ui/icons.svg
                $btn = $('<button/>', {
                    type: 'button',
                    class: prefix + btnName + '-button ' + (btn.class || ''),
                    //html: t.hasSvg ? '<svg><use xlink:href="../../https@/' + t.svgPath.hostname + t.svgPath.pathname + '#'+ prefix + (btn.ico || btnName).replace(/([A-Z]+)/g, '-$1').toLowerCase() + '"/></svg>' : '',
                    //html: btn.showTitle? (textDef+'<i class="icon-arrow-down-after"></i>') : (t.hasSvg ? '<svg><use xlink:href="../static/hr/common/static/js/trumbowys/ui/icons.svg' + '#'+ prefix + (btn.ico || btnName).replace(/([A-Z]+)/g, '-$1').toLowerCase() + '"/></svg>' :''),
                    html: btn.showTitle? (textDef+'<i class="icon-arrow-down-after"></i>') : ('<i class="icon-'+btnName+'"></i>'),
                    title:(btn.title || btn.text || textDef) + ((btn.key) ? ' (Ctrl + ' + btn.key + ')' : ''),
                    tabindex: -1,
                    mousedown: function () {
                        if (!isDropdown || $('.' + btnName + '-' + prefix + 'dropdown', t.$box).is(':hidden')) {
                            $('body', t.doc).trigger('mousedown');
                        }

                        if (t.$btnPane.hasClass(prefix + 'disable') && !$(this).hasClass(prefix + 'active') && !$(this).hasClass(prefix + 'not-disable')) {
                            return false;
                        }

                        t.execCmd((isDropdown ? 'dropdown' : false) || btn.fn || btnName, btn.param || btnName, btn.forceCss || false);

                        return false;
                    }
                });

            if (isDropdown) {
                $btn.addClass(prefix + 'open-dropdown');
                var dropdownPrefix = prefix + 'dropdown',
                    $dropdown = $('<div/>', { // the dropdown
                        class: dropdownPrefix + '-' + btnName + ' ' + dropdownPrefix + ' ' + prefix + 'fixed-top',
                        'data-dropdown': btnName
                    });
                $.each(isDropdown, function (i, def) {
                    if (t.btnsDef[def] && t.isSupportedBtn(def)) {
                        $dropdown.append(t.buildSubBtn(def));
                    }
                });
                t.$box.append($dropdown.hide());
            } else if (btn.key) {
                t.keys[btn.key] = {
                    fn: btn.fn || btnName,
                    param: btn.param || btnName
                };
            }

            if (!isDropdown) {
                t.tagToButton[(btn.tag || btnName).toLowerCase()] = btnName;
            }

            return $btn;
        },
        // Build a button for dropdown menu
        // @param n : name of the subbutton
        buildSubBtn: function (btnName) {
            var t = this,
                prefix = t.o.prefix,
                btn = t.btnsDef[btnName];

            if (btn.key) {
                t.keys[btn.key] = {
                    fn: btn.fn || btnName,
                    param: btn.param || btnName
                };
            }

            t.tagToButton[(btn.tag || btnName).toLowerCase()] = btnName;

            return $('<button/>', {
                type: 'button',
                class: prefix + btnName + '-dropdown-button' + (btn.ico ? ' ' + prefix + btn.ico + '-button' : ''),
                //html: t.hasSvg ? '<svg><use xlink:href="' + t.svgPath + '#'+ prefix + (btn.ico || btnName).replace(/([A-Z]+)/g, '-$1').toLowerCase() + '"/></svg>'+ (btn.text || btn.title || t.lang[btnName] || btnName) : '',
                html: t.hasSvg ? '<i class="icon-'+btnName+'"></i>'+ (btn.text || btn.title || t.lang[btnName] || btnName) : '',
                title: ((btn.key) ? ' (Ctrl + ' + btn.key + ')' : null),
                style: btn.style || null,
                mousedown: function () {
                    $('body', t.doc).trigger('mousedown');

                    t.execCmd(btn.fn || btnName, btn.param || btnName, btn.forceCss || false);

                    return false;
                }
            });
        },
        // Check if button is supported
        isSupportedBtn: function (b) {
            try {
                return this.btnsDef[b].isSupported();
            } catch (c) {
            }
            return true;
        },

        // Build overlay for modal box
        buildOverlay: function () {
            var t = this;
            t.$overlay = $('<div/>', {
                class: t.o.prefix + 'overlay'
            }).css({
                top: t.$btnPane.outerHeight(),
                height: (t.$ed.outerHeight() + 1) + 'px'
            }).appendTo(t.$box);
            return t.$overlay;
        },
        showOverlay: function () {
            var t = this;
            $(window).trigger('scroll');
            t.$overlay.fadeIn(200);
            t.$box.addClass(t.o.prefix + 'box-blur');
        },
        hideOverlay: function () {
            var t = this;
            t.$overlay.fadeOut(50);
            t.$box.removeClass(t.o.prefix + 'box-blur');
        },

        // Management of fixed button pane
        fixedBtnPaneEvents: function () {
            var t = this,
                fixedFullWidth = t.o.fixedFullWidth,
                $box = t.$box;

            if (!t.o.fixedBtnPane) {
                return;
            }

            t.isFixed = false;

            $(window)
                .on('scroll resize', function () {
                    if (!$box) {
                        return;
                    }

                    t.syncCode();

                    var scrollTop = $(window).scrollTop(),
                        offset = $box.offset().top + 1,
                        bp = t.$btnPane,
                        oh = bp.outerHeight() - 2;

                    if ((scrollTop - offset > 0) && ((scrollTop - offset - t.height) < 0)) {
                        if (!t.isFixed) {
                            t.isFixed = true;
                            bp.css({
                                position: 'fixed',
                                top: 0,
                                left: fixedFullWidth ? '0' : 'auto',
                                zIndex: 7
                            });
                            $([t.$ta, t.$ed]).css({marginTop: bp.height()});
                        }
                        bp.css({
                            width: fixedFullWidth ? '100%' : (($box.width() - 1) + 'px')
                        });

                        $('.' + t.o.prefix + 'fixed-top', $box).css({
                            position: fixedFullWidth ? 'fixed' : 'absolute',
                            top: fixedFullWidth ? oh : oh + (scrollTop - offset) + 'px',
                            zIndex: 15
                        });
                    } else if (t.isFixed) {
                        t.isFixed = false;
                        bp.removeAttr('style');
                        $([t.$ta, t.$ed]).css({marginTop: 0});
                        $('.' + t.o.prefix + 'fixed-top', $box).css({
                            position: 'absolute',
                            top: oh
                        });
                    }
                });
        },

        // Disable editor
        toggleDisable: function (disable) {
            var t = this,
                prefix = t.o.prefix;

            t.disabled = disable;

            if (disable) {
                t.$ta.attr('disabled', true);
            } else {
                t.$ta.removeAttr('disabled');
            }
            t.$box.toggleClass(prefix + 'disabled', disable);
            t.$ed.attr('contenteditable', !disable);
        },

        // Destroy the editor
        destroy: function () {
            var t = this,
                prefix = t.o.prefix,
                height = t.height;

            if (t.isTextarea) {
                t.$box.after(
                    t.$ta
                        .css({height: height})
                        .val(t.html())
                        .removeClass(prefix + 'textarea')
                        .show()
                );
            } else {
                t.$box.after(
                    t.$ed
                        .css({height: height})
                        .removeClass(prefix + 'editor')
                        .removeAttr('contenteditable')
                        .html(t.html())
                        .show()
                );
            }

            t.$ed.off('dblclick', 'img');

            t.destroyPlugins();

            t.$box.remove();
            t.$c.removeData('trumbowyg');
            $('body').removeClass(prefix + 'body-fullscreen');
        },


        // Empty the editor
        empty: function () {
            this.$ta.val('');
            this.syncCode(true);
        },


        // Function call when click on viewHTML button
        toggle: function () {
            var t = this,
                prefix = t.o.prefix;
            t.semanticCode(false, true);
            setTimeout(function () {
                t.doc.activeElement.blur();
                t.$box.toggleClass(prefix + 'editor-hidden ' + prefix + 'editor-visible');
                t.$btnPane.toggleClass(prefix + 'disable');
                $('.' + prefix + 'viewHTML-button', t.$btnPane).toggleClass(prefix + 'active');
                if (t.$box.hasClass(prefix + 'editor-visible')) {
                    t.$ta.attr('tabindex', -1);
                } else {
                    t.$ta.removeAttr('tabindex');
                }
            }, 0);
        },

        // Open dropdown when click on a button which open that
        dropdown: function (name) {
            var t = this,
                d = t.doc,
                prefix = t.o.prefix,
                $dropdown = $('[data-dropdown=' + name + ']', t.$box),
                $btn = $('.' + prefix + name + '-button', t.$btnPane),
                show = $dropdown.is(':hidden');

            $('body', d).trigger('mousedown');

            if (show) {
                var o = $btn.offset().left;
                $btn.addClass(prefix + 'active');

                $dropdown.css({
                    position: 'absolute',
                    top: $btn.offset().top - t.$btnPane.offset().top + $btn.outerHeight(),
                    left: (t.o.fixedFullWidth && t.isFixed) ? o + 'px' : (o - t.$btnPane.offset().left) + 'px'
                }).show();

                $(window).trigger('scroll');

                $('body', d).on('mousedown', function () {
                    $('.' + prefix + 'dropdown', d).hide();
                    $('.' + prefix + 'active', d).removeClass(prefix + 'active');
                    $('body', d).off('mousedown');
                });
            }
        },


        // HTML Code management
        html: function (html) {
            var t = this;
            if (html != null) {
                t.$ta.val(html);
                t.syncCode(true);
                return t;
            }
            return t.$ta.val();
        },
        syncTextarea: function () {
            var t = this;
            t.$ta.val(t.$ed.text().trim().length > 0 || t.$ed.find('hr,img,embed,input').length > 0 ? t.$ed.html() : '');
        },
        syncCode: function (force) {
            var t = this;
            if (!force && t.$ed.is(':visible')) {
                t.syncTextarea();
            } else {
                t.$ed.html(t.$ta.val());
            }

            if (t.o.autogrow) {
                t.height = t.$ed.height();
                if (t.height !== t.$ta.css('height')) {
                    t.$ta.css({height: t.height});
                    t.$c.trigger('tbwresize');
                }
            }
        },

        // Analyse and update to semantic code
        // @param force : force to sync code from textarea
        // @param full  : wrap text nodes in <p>
        semanticCode: function (force, full) {
            var t = this;
            t.saveRange();
            t.syncCode(force);

            $(t.o.tagsToRemove.join(','), t.$ed).remove();

            if (t.o.semantic) {
                t.semanticTag('b', 'strong');
                t.semanticTag('i', 'em');
                t.semanticTag('strike', 'del');

                if (full) {
                    var inlineElementsSelector = t.o.inlineElementsSelector,
                        blockElementsSelector = ':not(' + inlineElementsSelector + ')';

                    // Wrap text nodes in span for easier processing
                    t.$ed.contents().filter(function () {
                        return this.nodeType === 3 && this.nodeValue.trim().length > 0;
                    }).wrap('<span data-tbw/>');

                    // Wrap groups of inline elements in paragraphs (recursive)
                    var wrapInlinesInParagraphsFrom = function ($from) {
                        if ($from.length !== 0) {
                            var $finalParagraph = $from.nextUntil(blockElementsSelector).addBack().wrapAll('<p/>').parent(),
                                $nextElement = $finalParagraph.nextAll(inlineElementsSelector).first();
                            $finalParagraph.next('br').remove();
                            wrapInlinesInParagraphsFrom($nextElement);
                        }
                    };
                    wrapInlinesInParagraphsFrom(t.$ed.children(inlineElementsSelector).first());

                    t.semanticTag('div', 'p', true);

                    // Unwrap paragraphs content, containing nothing usefull
                    t.$ed.find('p').filter(function () {
                        // Don't remove currently being edited element
                        if (t.range && this === t.range.startContainer) {
                            return false;
                        }
                        return $(this).text().trim().length === 0 && $(this).children().not('br,span').length === 0;
                    }).contents().unwrap();

                    // Get rid of temporial span's
                    $('[data-tbw]', t.$ed).contents().unwrap();

                    // Remove empty <p>
                    t.$ed.find('p:empty').remove();
                }

                t.restoreRange();

                t.syncTextarea();
            }
        },

        semanticTag: function (oldTag, newTag, copyAttributes) {
            $(oldTag, this.$ed).each(function () {
                var $oldTag = $(this);
                $oldTag.wrap('<' + newTag + '/>');
                if (copyAttributes) {
                    $.each($oldTag.prop('attributes'), function () {
                        $oldTag.parent().attr(this.name, this.value);
                    });
                }
                $oldTag.contents().unwrap();
            });
        },

        // Function call when user click on "Insert Link"
        createLink: function () {
            var t = this,
                documentSelection = t.doc.getSelection(),
                node = documentSelection.focusNode,
                url,
                title,
                target;

            while (['A', 'DIV'].indexOf(node.nodeName) < 0) {
                node = node.parentNode;
            }

            if (node && node.nodeName === 'A') {
                var $a = $(node);
                url = $a.attr('href');
                title = $a.attr('title');
                target = $a.attr('target');
                var range = t.doc.createRange();
                range.selectNode(node);
                documentSelection.addRange(range);
            }

            t.saveRange();

            t.openModalInsert(t.lang.createLink, {
                url: {
                    label: '链接',
                    required: true,
                    value: url
                },
                text: {
                    label: t.lang.text,
                    value: t.getRangeText()
                }
            }, function (v) { // v is value
                var link = $(['<a href="', v.url, '">', v.text, '</a>'].join(''));
                t.range.deleteContents();
                t.range.insertNode(link[0]);
                return true;
            });
        },


        unlink: function () {
            var t = this,
                documentSelection = t.doc.getSelection(),
                node = documentSelection.focusNode;

            if (documentSelection.isCollapsed) {
                while (['A', 'DIV'].indexOf(node.nodeName) < 0) {
                    node = node.parentNode;
                }

                if (node && node.nodeName === 'A') {
                    var range = t.doc.createRange();
                    range.selectNode(node);
                    documentSelection.addRange(range);
                }
            }
            t.execCmd('unlink', undefined, undefined, true);
        },
        insertImage: function () {
            var t = this;
            t.saveRange();
            t.openModalInsert(t.lang.insertImage, {
                url: {
                    label: 'URL',
                    required: true
                },
                alt: {
                    label: t.lang.description,
                    value: t.getRangeText()
                }
            }, function (v) { // v are values
                t.execCmd('insertImage', v.url);
                $('img[src="' + v.url + '"]:not([alt])', t.$box).attr('alt', v.alt);
                return true;
            });
        },
        fullscreen: function () {
            var t = this,
                prefix = t.o.prefix,
                fullscreenCssClass = prefix + 'fullscreen',
                isFullscreen;

            t.$box.toggleClass(fullscreenCssClass);
            isFullscreen = t.$box.hasClass(fullscreenCssClass);
            $('body').toggleClass(prefix + 'body-fullscreen', isFullscreen);
            $(window).trigger('scroll');
            t.$c.trigger('tbw' + (isFullscreen ? 'open' : 'close') + 'fullscreen');
        },


        /*
         * Call method of trumbowyg if exist
         * else try to call anonymous function
         * and finaly native execCommand
         */
        execCmd: function (cmd, param, forceCss, skipTrumbowyg) {
            var t = this;
            skipTrumbowyg = !!skipTrumbowyg || '';

            if (cmd !== 'dropdown') {
                t.$ed.focus();
            }

            t.doc.execCommand('styleWithCSS', false, forceCss || false);

            try {
                t[cmd + skipTrumbowyg](param);
            } catch (c) {
                try {
                    cmd(param);
                } catch (e2) {
                    if (cmd === 'insertHorizontalRule') {
                        param = undefined;
                    } else if (cmd === 'formatBlock' && (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') !== -1)) {
                        param = '<' + param + '>';
                    }

                    t.doc.execCommand(cmd, false, param);

                    t.syncCode();
                    t.semanticCode(false, true);
                }

                if (cmd !== 'dropdown') {
                    t.updateButtonPaneStatus();
                    t.$c.trigger('tbwchange');
                }
            }
        },


        // Open a modal box
        openModal: function (title, content) {
            var t = this,
                prefix = t.o.prefix;

            // No open a modal box when exist other modal box
            if ($('.' + prefix + 'modal-box', t.$box).length > 0) {
                return false;
            }

            t.saveRange();
            t.showOverlay();

            // Disable all btnPane btns
            t.$btnPane.addClass(prefix + 'disable');

            // Build out of ModalBox, it's the mask for animations
            var $modal = $('<div/>', {
                class: prefix + 'modal ' + prefix + 'fixed-top'
            }).css({
                top: t.$btnPane.height()
            }).appendTo(t.$box);

            // Click on overlay close modal by cancelling them
            t.$overlay.one('click', function () {
                $modal.trigger('tbwcancel');
                return false;
            });

            // Build the form
            var $form = $('<form/>', {
                action: '',
                html: content
            })
                .on('submit', function () {
                    $modal.trigger('tbwconfirm');
                    return false;
                })
                .on('reset', function () {
                    $modal.trigger('tbwcancel');
                    return false;
                });


            // Build ModalBox and animate to show them
            var $box = $('<div/>', {
                class: prefix + 'modal-box',
                html: $form
            })
                .css({
                    top: '-' + t.$btnPane.outerHeight() + 'px',
                    opacity: 0
                })
                .appendTo($modal)
                .animate({
                    top: 0,
                    opacity: 1
                }, 100);


            // Append title
            $('<span/>', {
                text: title,
                class: prefix + 'modal-title'
            }).prependTo($box);

            $modal.height($box.outerHeight() + 10);


            // Focus in modal box
            $('input:first', $box).focus();


            // Append Confirm and Cancel buttons
            t.buildModalBtn('submit', $box);
            t.buildModalBtn('reset', $box);


            $(window).trigger('scroll');

            return $modal;
        },
        // @param n is name of modal
        buildModalBtn: function (n, $modal) {
            var t = this,
                prefix = t.o.prefix;

            return $('<button/>', {
                class: prefix + 'modal-button ' + prefix + 'modal-' + n,
                type: n,
                text: t.lang[n] || n
            }).appendTo($('form', $modal));
        },
        // close current modal box
        closeModal: function () {
            var t = this,
                prefix = t.o.prefix;

            t.$btnPane.removeClass(prefix + 'disable');
            t.$overlay.off();

            // Find the modal box
            var $mb = $('.' + prefix + 'modal-box', t.$box);

            $mb.animate({
                top: '-' + $mb.height()
            }, 100, function () {
                $mb.parent().remove();
                t.hideOverlay();
            });

            t.restoreRange();
        },
        // Preformated build and management modal
        openModalInsert: function (title, fields, cmd) {
            var t = this,
                prefix = t.o.prefix,
                lg = t.lang,
                html = '',
                CONFIRM_EVENT = 'tbwconfirm';

            $.each(fields, function (fieldName, field) {
                var l = field.label,
                    n = field.name || fieldName;

                html += '<label><input type="' + (field.type || 'text') + '" name="' + n + '" value="' + (field.value || '').replace(/"/g, '&quot;') + '"><span class="' + prefix + 'input-infos"><span>' +
                    ((!l) ? (lg[fieldName] ? lg[fieldName] : fieldName) : (lg[l] ? lg[l] : l)) +
                    '</span></span></label>';
            });

            return t.openModal(title, html)
                .on(CONFIRM_EVENT, function () {
                    var $form = $('form', $(this)),
                        valid = true,
                        values = {};

                    $.each(fields, function (fieldName, field) {
                        var $field = $('input[name="' + fieldName + '"]', $form);

                        values[fieldName] = $.trim($field.val());

                        // Validate value
                        if (field.required && values[fieldName] === '') {
                            valid = false;
                            t.addErrorOnModalField($field, t.lang.required);
                        } else if (field.pattern && !field.pattern.test(values[fieldName])) {
                            valid = false;
                            t.addErrorOnModalField($field, field.patternError);
                        }
                    });

                    if (valid) {
                        t.restoreRange();

                        if (cmd(values, fields)) {
                            t.syncCode();
                            t.$c.trigger('tbwchange');
                            t.closeModal();
                            $(this).off(CONFIRM_EVENT);
                        }
                    }
                })
                .one('tbwcancel', function () {
                    $(this).off(CONFIRM_EVENT);
                    t.closeModal();
                });
        },
        addErrorOnModalField: function ($field, err) {
            var prefix = this.o.prefix,
                $label = $field.parent();

            $field
                .on('change keyup', function () {
                    $label.removeClass(prefix + 'input-error');
                });

            $label
                .addClass(prefix + 'input-error')
                .find('input+span')
                .append(
                $('<span/>', {
                    class: prefix + 'msg-error',
                    text: err
                })
            );
        },


        // Range management
        saveRange: function () {
            var t = this,
                documentSelection = t.doc.getSelection();

            t.range = null;

            if (documentSelection.rangeCount) {
                var savedRange = t.range = documentSelection.getRangeAt(0),
                    range = t.doc.createRange(),
                    rangeStart;
                range.selectNodeContents(t.$ed[0]);
                range.setEnd(savedRange.startContainer, savedRange.startOffset);
                rangeStart = (range + '').length;
                t.metaRange = {
                    start: rangeStart,
                    end: rangeStart + (savedRange + '').length
                };
            }
        },
        restoreRange: function () {
            var t = this,
                metaRange = t.metaRange,
                savedRange = t.range,
                documentSelection = t.doc.getSelection(),
                range;

            if (!savedRange) {
                return;
            }

            if (metaRange && metaRange.start !== metaRange.end) { // Algorithm from http://jsfiddle.net/WeWy7/3/
                var charIndex = 0,
                    nodeStack = [t.$ed[0]],
                    node,
                    foundStart = false,
                    stop = false;

                range = t.doc.createRange();

                while (!stop && (node = nodeStack.pop())) {
                    if (node.nodeType === 3) {
                        var nextCharIndex = charIndex + node.length;
                        if (!foundStart && metaRange.start >= charIndex && metaRange.start <= nextCharIndex) {
                            range.setStart(node, metaRange.start - charIndex);
                            foundStart = true;
                        }
                        if (foundStart && metaRange.end >= charIndex && metaRange.end <= nextCharIndex) {
                            range.setEnd(node, metaRange.end - charIndex);
                            stop = true;
                        }
                        charIndex = nextCharIndex;
                    } else {
                        var cn = node.childNodes,
                            i = cn.length;

                        while (i > 0) {
                            i -= 1;
                            nodeStack.push(cn[i]);
                        }
                    }
                }
            }

            documentSelection.removeAllRanges();
            documentSelection.addRange(range || savedRange);
        },
        getRangeText: function () {
            return this.range + '';
        },

        updateButtonPaneStatus: function () {
            var t = this,
                prefix = t.o.prefix,
                tags = t.getTagsRecursive(t.doc.getSelection().focusNode.parentNode),
                activeClasses = prefix + 'active-button ' + prefix + 'active';

            $('.' + prefix + 'active-button', t.$btnPane).removeClass(activeClasses);
            $.each(tags, function (i, tag) {
                var btnName = t.tagToButton[tag.toLowerCase()],
                    $btn = $('.' + prefix + btnName + '-button', t.$btnPane);

                if ($btn.length > 0) {
                    $btn.addClass(activeClasses);
                } else {
                    try {
                        $btn = $('.' + prefix + 'dropdown .' + prefix + btnName + '-dropdown-button', t.$box);
                        var dropdownBtnName = $btn.parent().data('dropdown');
                        $('.' + prefix + dropdownBtnName + '-button', t.$box).addClass(activeClasses);
                    } catch (e) {
                    }
                }
            });
        },
        getTagsRecursive: function (element, tags) {
            var t = this;
            tags = tags || [];

            var tag = element.tagName;
            if (tag === 'DIV') {
                return tags;
            }
            if (tag === 'P' && element.style.textAlign !== '') {
                tags.push(element.style.textAlign);
            }

            $.each(t.tagHandlers, function (i, tagHandler) {
                tags = tags.concat(tagHandler(element, t));
            });

            tags.push(tag);

            return t.getTagsRecursive(element.parentNode, tags);
        },

        // Plugins
        initPlugins: function () {
            var t = this;
            t.loadedPlugins = [];
            $.each($.trumbowyg.plugins, function (name, plugin) {
                if (!plugin.shouldInit || plugin.shouldInit(t)) {
                    plugin.init(t);
                    if (plugin.tagHandler) {
                        t.tagHandlers.push(plugin.tagHandler);
                    }
                    t.loadedPlugins.push(plugin);
                }
            });
        },
        destroyPlugins: function () {
            $.each(this.loadedPlugins, function (i, plugin) {
                if (plugin.destroy) {
                    plugin.destroy();
                }
            });
        }
    };
})(navigator, window, document, jQuery);

/*!common/static/trumbowys/langs/fr.min.js*/
;/* ===========================================================
 * fr.js
 * French translation for Trumbowyg
 * http://alex-d.github.com/Trumbowyg
 * ===========================================================
 * Author : Alexandre Demode (Alex-D)
 *          Twitter : @AlexandreDemode
 *          Website : alex-d.fr
 */
jQuery.trumbowyg.langs.fr={viewHTML:"Voir le HTML",undo:"Annuler",redo:"Refaire",formatting:"Format",p:"Paragraphe",blockquote:"Citation",code:"Code",header:"Titre",bold:"Gras",italic:"Italique",strikethrough:"Rayé",underline:"Souligné",strong:"Fort",em:"Emphase",del:"Supprimé",superscript:"Exposant",subscript:"Indice",unorderedList:"Liste à puces",orderedList:"Liste ordonnée",insertImage:"Insérer une image",insertVideo:"Insérer une video",link:"Lien",createLink:"Insérer un lien",unlink:"Supprimer le lien",justifyLeft:"Aligner à gauche",justifyCenter:"Centrer",justifyRight:"Aligner à droite",justifyFull:"Justifier",horizontalRule:"Insérer un séparateur horizontal",fullscreen:"Plein écran",close:"Fermer",submit:"Valider",reset:"Annuler",required:"Obligatoire",description:"Description",title:"Titre",text:"Texte",target:"Cible"};
/*!common/static/js/tingyun-rum.js*/
;window._ty_rum&&window._ty_rum.server||function(t){function r(t){switch(typeof t){case"object":if(!t)return"null";if(t instanceof Array){for(var e="[",n=0;n<t.length;n++)e+=(n>0?",":"")+r(t[n]);return e+"]"}var e="{",n=0;for(var a in t)if("function"!=typeof t[a]){var o=r(t[a]);e+=(n>0?",":"")+r(a)+":"+o,n++}return e+"}";case"string":return'"'+t.replace(/([\"\\])/g,"\\$1").replace(/\n/g,"\\n")+'"';case"number":return t.toString();case"boolean":return t?"true":"false";case"function":return r(t.toString());case"undefined":default:return'"undefined"'}}function e(t){return O?O(t):t}function n(){return Date.now?Date.now():(new Date).valueOf()}function a(t,r,e){function n(){var t=N.args.apply(this,arguments);return r(o,t,e)}var a,o=t[t.length-1];if("function"==typeof o){switch(o.length){case 0:a=function(){return n.apply(this,arguments)};break;case 1:a=function(t){return n.apply(this,arguments)};break;case 2:a=function(t,r){return n.apply(this,arguments)};break;case 3:a=function(t,r,e){return n.apply(this,arguments)};break;case 4:a=function(t,r,e,a){return n.apply(this,arguments)};break;case 5:a=function(t,r,e,a,o){return n.apply(this,arguments)};break;default:for(var i=[],s=0,u=o.length;u>s;s++)i.push("_"+s);a=eval("(function(){return function("+i.join(",")+"){var args = [].slice.call(arguments, 0);return r(o, args, e);};})();")}t[t.length-1]=a}return t}function o(t,r){return t&&r&&(t.moduleName=r),t}function i(t,r,e){return function(){try{E=r,e&&s(r),t.apply(this,arguments),e&&u()}catch(n){throw e&&u(),o(n,r)}}}function s(r){N.each(["setTimeout","setInterval"],function(e){N.wrap(!0,t,e,function(t){return function(){var e,n=N.args.apply(this,arguments),a=n[0];return"function"==typeof a&&(e=i(a,r,!0)),e&&(n[0]=e),t.apply?t.apply(this,n):Function.prototype.apply.apply(t,[t,n])}})})}function u(){N.each(["setTimeout","setInterval"],function(r){N.unwrap(t,r)})}function c(t){P&&N.wrap(!1,P.prototype,"addEventListener",function(r){return function(){var e,n=N.args.apply(this,arguments),a=n[1];return"function"==typeof a&&(e=i(a,t,!0)),e&&(n[1]=e),r.apply(this,n)}}),s(t)}function f(){P&&N.unwrap(P.prototype,"addEventListener"),u()}function l(t){return function(t,r){}}function p(){if(this.errors.length){var t=function(t){var r=[],e={};N.each(t,function(t){var r=_(t[1],t[2],t[3],t[6]);e[r]?e[r][4]+=1:e[r]=[t[1],t[2],t[3],"#"==t[4]?x.URL:t[4],1,t[5],t[6],t[7]]});for(var n in e)r.push(e[n]);return r}(this.errors),r=this;N.POST(N.mkurl(D.server.beacon,"err",{fu:q?q:q++,os:parseInt((n()-(B||D.st))/1e3)}),N.stringify({datas:t}),{},function(t,e){t||(r.errors=[])})}}function d(){U.initend()}function h(){"complete"===x.readyState&&U.initend()}function m(t){function r(){U.send()}return D.load_time?!0:(U.initend(),D.load_time=n(),void(9===t?r():setTimeout(r,0)))}function y(){X||m(9),N.bind(p,U)(),X=1}function v(){U.touch||(U.touch=n())}function g(t){if(t[6]){var r=t[4],e=t[5];if(e&&"string"==typeof e&&r){e=e.split(/\n/);var n=C.exec(e[0]);n||(n=C.exec(e[1])),n&&n[1]!=r&&(t[4]=n[1]||r,t[2]=n[2]||t[2],t[3]=n[3]||t[3])}}}function _(t,r,e,n){return t+r+e+(n?n:"")}function w(r){var e=arguments,a="unknown",o=[n()];if(0!=e.length){if("string"==typeof r){var i=e.length<4?e.length:4;o[1]=e[0],i>2&&(o[2]=e[2],o[3]=0,o[4]=e[1]),i>3&&e[3]&&(o[3]=e[3])}else if(r instanceof Event||t.ErrorEvent&&r instanceof ErrorEvent){if(o[1]=r.message||(r.error&&r.error.constructor.name)+(r.error&&r.error.message)||"",o[2]=r.lineno?r.lineno:0,o[3]=r.colno?r.colno:0,o[4]=r.filename||r.error&&r.error.fileName||r.target&&r.target.baseURI||"",o[4]==x.URL&&(o[4]="#"),r.error){o[5]=r.error.stack,o[6]=r.error.moduleName;var s=_(o[1],o[2],o[3],o[6]);o[7]=j[s]?0:1,j[s]=!0}else o[5]=null,o[6]=null,o[7]=0;if(o[1]===a&&o[4]===a)return;g(o)}U.errors.push(o)}}function S(t){return function(){var r=arguments;if(!this._ty_wrap){var e=N.args.apply(this,r);this._ty_rum={method:e[0],url:e[1],start:n()}}try{return t.apply(this,r)}catch(a){return Function.prototype.apply.call(t,this,r)}}}function T(r){return"string"==typeof r?r.length:t.ArrayBuffer&&r instanceof ArrayBuffer?r.byteLength:t.Blob&&r instanceof Blob?r.size:r&&r.length?r.length:0}function b(r){return function(){function e(t){var r,e,a=p._ty_rum;if(a){if(4!==a.readyState&&(a.end=n()),a.s=p.status,""==p.responseType||"text"==p.responseType)a.res=T(p.responseText);else if(p.response)a.res=T(p.response);else try{a.res=T(p.responseText)}catch(o){a.res=0}if(a.readyState=p.readyState,a.cb_time=d,r=[a.method+" "+a.url,a.s>0?a.end-a.start:0,d,a.s,a.s>0?0:t,a.res,a.req],a.r&&(e=i(p),e&&(e=e.xData)&&(r.push(e.id),r.push(e.action),r.push(e.time&&e.time.duration),r.push(e.time&&e.time.qu))),D.aa.push(r),D.server.custom_urls&&D.server.custom_urls.length&&!U.ct){if(!D.pattern){D.pattern=[];for(var s=0;s<D.server.custom_urls.length;s++)D.pattern.push(new RegExp(D.server.custom_urls[s]))}for(var s=0;s<D.pattern.length;s++)if(a.url.match(D.pattern[s])){U.ct=a.end+d;break}}U.sa(),p._ty_rum=null}}function a(){4==p.readyState&&e(0)}function i(r){var e;if(r.getResponseHeader){var n=N.parseJSON(r.getResponseHeader("X-Tingyun-Tx-Data"));n&&n.r&&r._ty_rum&&n.r+""==r._ty_rum.r+""&&(e={name:r._ty_rum.url,xData:n},$&&t._ty_rum.c_ra.push(e))}return e}function c(t){return function(){var r,e;4==p.readyState&&p._ty_rum&&(p._ty_rum.end=r=n(),p._ty_rum.readyState=4);try{E&&s(E),e=t.apply(this,arguments),E&&u()}catch(i){throw i=o(i,E),E&&u(),E=null,i}return 4==p.readyState&&(d=n()-r),a(),e}}function f(t){return function(){var r=p._ty_rum;return r?"progress"==t?!0:("abort"==t?e(905):"loadstart"==t?r.start=n():"error"==t?e(990):"timeout"==t&&e(903),!0):!0}}function l(t,r){r instanceof Array||(r=[r]);for(var e=0;e<r.length;e++){var n=r[e];N.sh(t,n,f(n),!1)}}if(!this._ty_wrap){this._ty_rum.start=n(),this._ty_rum.req=arguments[0]?T(arguments[0]):0;var p=this,d=0,h=N.wrap(!1,this,"onreadystatechange",c);h||N.sh(this,"readystatechange",a,!1),l(this,["error","progress","abort","load","loadstart","loadend","timeout"]),h||setTimeout(function(){N.wrap(!1,p,"onreadystatechange",c)},0)}var m=function(){function t(t){var r={},e=/^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?/.exec(t);return e&&(r.protocol=e[1]?e[1]+":":"http:",r.hostname=e[3],r.port=e[4]||""),r}return function(r){var e=location;if(r=N.trim(r)){if(r=r.toLowerCase(),r.startsWith("//")&&(r=e.protocol+r),!r.startsWith("http"))return!0;var n=t(r),a=n.protocol===e.protocol&&n.hostname===e.hostname;return a&&(a=n.port===e.port?!0:!e.port&&("http:"===e.protocol&&"80"===n.port||"https:"===e.protocol&&"443"===n.port)),a}return!1}}(),y=arguments;try{var v=D.server;v&&v.id&&this._ty_rum&&m(this._ty_rum.url)&&(this._ty_rum.r=(new Date).getTime()%1e8,this.setRequestHeader&&this.setRequestHeader("X-Tingyun-Id",v.id+";r="+this._ty_rum.r))}catch(g){}try{return r.apply(this,y)}catch(_){return Function.prototype.apply.call(r,this,y)}}}var E,k=t.XMLHttpRequest,x=document,R=Object.defineProperty,L=t.define,P=t.EventTarget,q=0,C=new RegExp("([a-z]+:/{2,3}.*):(\\d+):(\\d+)"),O=t.encodeURIComponent,B=null,N={wrap:function(t,r,e,n,a){try{var o=r[e]}catch(i){if(!t)return!1}if(!o&&!t)return!1;if(o&&o._ty_wrap)return!1;try{r[e]=n(o,a)}catch(i){return!1}return r[e]._ty_wrap=[o],!0},unwrap:function(t,r){try{var e=t[r]._ty_wrap;e&&(t[r]=e[0])}catch(n){}},each:function(t,r){if(t){var e;for(e=0;e<t.length&&(!t[e]||!r(t[e],e,t));e+=1);}},mkurl:function(r,a){var o=arguments,i=/^https/i.test(x.URL)?"https":"http";if(i=i+"://"+r+"/"+a+"@av=1.0.0&v=1.3.2&key="+e(D.server.key)+"&ref="+e(x.URL)+"&rand="+n()+"&pvid="+F,"pf"!==a&&D&&(D.agent=D.agent||t._ty_rum.agent,D.agent&&D.agent.n&&(i+="&n="+e(D.agent.n))),o.length>2){var s=o[2];for(var u in s)i+="&"+u+"="+s[u]}return A.host&&(i+="&cshst="+e(A.host)),A.url&&(i+="&csurl="+e(A.url)),i},GET:function(t,r){function e(){r&&r.apply(this,arguments),n.parentNode&&n.parentNode.removeChild(n)}if(navigator&&navigator.sendBeacon&&M.test(t))return navigator.sendBeacon(t,null);var n=x.createElement("img");return n.setAttribute("src",t),n.setAttribute("style","display:none"),this.sh(n,"readystatechange",function(){("loaded"==n.readyState||4==n.readyState)&&e("loaded")},!1),this.sh(n,"load",function(){return e("load"),!0},!1),this.sh(n,"error",function(){return e("error"),!0},!1),x.body.appendChild(n)},fpt:function(t,r,e){function n(t,r,e){var n=x.createElement(t);try{for(var a in r)n[a]=r[a]}catch(o){var i="<"+t;for(var a in r)i+=" "+a+'="'+r[a]+'"';i+=">",e||(i+="</"+t+">"),n=x.createElement(i)}return n}var a=n("div",{style:"display:none"},!1),o=n("iframe",{name:"_ty_rum_frm",width:0,height:0,style:"display:none"},!1),i=n("form",{style:"display:none",action:t,enctype:"application/x-www-form-urlencoded",method:"post",target:"_ty_rum_frm"},!1),s=n("input",{name:"data",type:"hidden"},!0);return s.value=r,i.appendChild(s),a.appendChild(o),a.appendChild(i),x.body.appendChild(a),i.submit(),o.onreadystatechange=function(){("complete"===o.readyState||4===o.readyState)&&(e(null,o.innerHTML),x.body.removeChild(a))},!0},POST:function(r,e,n,a){if(this.ie)return this.fpt(r,e,a);if(navigator&&navigator.sendBeacon&&M.test(r)){var o=navigator.sendBeacon(r,e);return a(!o),o}var i;if(t.XDomainRequest)return i=new XDomainRequest,i.open("POST",r),i.onload=function(){a(null,i.responseText)},this.sh(i,"load",function(){a(null,i.responseText)},!1),this.sh(i,"error",function(){a("POST("+r+")error")},!1),this.wrap(!0,i,"onerror",function(t){return function(){return a&&a("post error",i.responseText),!0}}),i.send(e),!0;if(!k)return!1;i=new k,i.overrideMimeType&&i.overrideMimeType("text/html");try{i._ty_wrap=1}catch(s){}var u=0;i.onreadystatechange=function(){4==i.readyState&&200==i.status&&(0==u&&a(null,i.responseText),u++)},i.onerror&&this.wrap(!0,i,"onerror",function(t){return function(){return a("post error",i.responseText),"function"==typeof t?t.apply(this,arguments):!0}});try{i.open("POST",r,!0)}catch(s){return this.fpt(r,e,a)}for(var c in n)i.setRequestHeader(c,n[c]);return i.send(e),!0},sh:function(t,r,e,n){return t.addEventListener?t.addEventListener(r,e,n):t.attachEvent?t.attachEvent("on"+r,e):!1},args:function(){for(var t=[],r=0;r<arguments.length;r++)t.push(arguments[r]);return t},stringify:r,parseJSON:function(r){if(r&&"string"==typeof r){var e=t.JSON?t.JSON.parse:function(t){return new Function("return "+t)()};return e(r)}return null},trim:I?function(t){return null==t?"":I.call(t)}:function(t){return null==t?"":t.toString().replace(/^\s+/,"").replace(/\s+$/,"")},extend:function(t,r){if(t&&r)for(var e in r)r.hasOwnProperty(e)&&(t[e]=r[e]);return t},bind:function(t,r){return function(){t.apply(r,arguments)}}},A={},D=t._ty_rum=N.extend({st:n(),ra:[],c_ra:[],aa:[],snd_du:function(){return this.server.adu?1e3*this.server.adu:1e4},cc:function(){return this.server.ac?this.server.ac:10},config:function(t,r){var e;if("object"==typeof t)e=t;else{if("string"!=typeof t||void 0===r)throw new Error("illegal arguments");e={},e[t]=r}for(var n in e)A[n]=e[n];return this}},t._ty_rum||{});var ty_rum=D;ty_rum.server = {id:'ZNj0zYzD4bo',beacon:'beacon.tingyun.com',beacon_err:'beacon-err.tingyun.com',key:'g-s2TEaJ8sA',trace_threshold:7000,custom_urls:[],sr:1.0};if(D.server&&!(D.server.sr&&Math.random()>=D.server.sr)){var I=String.prototype.trim;String.prototype.startsWith||(String.prototype.startsWith=function(t,r){return r=r||0,this.indexOf(t,r)===r});var M=/^http/i,F=function(){function t(){return(65536*(1+Math.random())|0).toString(16).substring(1)}return t()+"-"+t()+t()}();try{R&&R(t,"define",{get:function(){return L},set:function(t){"function"==typeof t&&(t.amd||t.cmd)?(L=function(){var r=N.args.apply(this,arguments);if(3!==r.length)return t.apply(this,r);var e="string"==typeof r[0]?r[0]:"anonymous";return t.apply(this,a(r,function(t,r,e){var n;try{E=e,c(e),n=t.apply(this,r),f()}catch(a){throw f(),o(a,e)}return n},e))},N.extend(L,t)):L=t},configurable:!0})}catch(H){}var $=t.performance?t.performance:t.Performance;$&&(N.sh($,"resourcetimingbufferfull",function(){var t=$.getEntriesByType("resource");t&&(D.ra=D.ra.concat(t),$.clearResourceTimings())},!1),N.sh($,"webkitresourcetimingbufferfull",function(){var t=$.getEntriesByType("resource");t&&(D.ra=D.ra.concat(t),$.webkitClearResourceTimings())},!1));for(var U=D.metric={ready:function(){return D.load_time},initend:function(){function t(){U.sa()}D.end_time||(D.end_time=n(),this._h=setInterval(t,2e3))},send:function(){function r(){function r(t){return a[t]>0?a[t]-i:0}var n={};if($&&$.timing){var a=$.timing;i=a.navigationStart;var o=r("domainLookupStart"),s=r("domainLookupEnd"),u=r("redirectStart"),c=r("redirectEnd"),f=r("connectStart"),l=r("connectEnd");n={f:r("fetchStart"),qs:r("requestStart"),rs:r("responseStart"),re:r("responseEnd"),os:r("domContentLoadedEventStart"),oe:r("domContentLoadedEventEnd"),oi:r("domInteractive"),oc:r("domComplete"),ls:r("loadEventStart"),le:r("loadEventEnd"),tus:r("unloadEventStart"),tue:r("unloadEventEnd")},l-f>0&&(n.cs=f,n.ce=l),s-o>0&&(n.ds=o,n.de=s),(c-u>0||c>0)&&(n.es=u,n.ee=c),0==n.le&&(n.ue=D.load_time-i);var p;if(a.msFirstPaint)p=a.msFirstPaint;else if(t.chrome&&chrome.loadTimes){var d=chrome.loadTimes();d&&d.firstPaintTime&&(p=1e3*d.firstPaintTime)}else D.firstPaint&&(p=D.firstPaint);p&&(n.fp=Math.round(p-i)),a.secureConnectionStart&&(n.sl=r("secureConnectionStart"))}else n={t:i,os:D.end_time-i,ls:D.load_time-i};n.je=U.errors.length,U.ct&&(n.ct=U.ct-i),U.touch&&(n.fi=U.touch-i);var h=D.agent||t._ty_rum&&t._ty_rum.agent;return h&&(n.id=e(h.id),n.a=h.a,n.q=h.q,n.tid=e(h.tid),n.n=e(h.n)),n.sh=t.screen&&t.screen.height,n.sw=t.screen&&t.screen.width,n}function a(r){var e=t._ty_rum.c_ra;if(r)for(var n=e.length-1;n>=0;n--)if(r.indexOf(e[n].name)>-1)return e[n].xData;return null}function o(t){function r(t){return f[t]>0?f[t]:0}if(t<D.server.trace_threshold)return null;var n=$;if(n&&n.getEntriesByType){var o={tr:!0,tt:e(x.title),charset:x.characterSet},s=D.ra,u=n.getEntriesByType("resource");u&&(s=s.concat(u),n.webkitClearResourceTimings&&n.webkitClearResourceTimings(),n.clearResourceTimings&&n.clearResourceTimings()),o.res=[];for(var c=0;c<s.length;c++){var f=s[c],l={o:r("startTime"),rt:f.initiatorType,n:f.name,f:r("fetchStart"),ds:r("domainLookupStart"),de:r("domainLookupEnd"),cs:r("connectStart"),ce:r("connectEnd"),sl:r("secureConnectionStart"),qs:r("requestStart"),rs:r("responseStart"),re:r("responseEnd")},p=a(f.name);p&&(l.aid=p.id,l.atd=p.trId,l.an=p.action,l.aq=p.time&&p.time.qu,l.as=p.time&&p.time.duration),o.res.push(l)}if(U.errors.length){o.err=[];for(var c=0,d=U.errors,h=d.length;h>c;c++)o.err.push({o:Math.round(d[c][0]-i),e:d[c][1],l:d[c][2],c:d[c][3],r:d[c][4],ec:h,s:d[c][5],m:d[c][6],ep:d[c][7]})}return o}return null}if(this.sended)return!1;if(!this.ready())return!1;var i=D.st,s={};try{pf=r(),s=o(pf.ls>0?pf.ls:D.load_time-i)}catch(u){}s=s?N.stringify(s):"";var c=N.mkurl(D.server.beacon,"pf",pf);B=n(),0!=s.length&&N.POST(c,s,{},l("POST"))||N.GET(c);var f=N.bind(p,this);return f(),setInterval(f,1e4),this.sended=!0,this.sa(1),!0},sa:function(t){(this.ready()||t)&&(t||(t=!this._last_send||n()-this._last_send>D.snd_du()||D.aa.length>=D.cc()),D.aa.length>0&&t&&(this._last_send=n(),N.POST(N.mkurl(D.server.beacon,"xhr"),N.stringify({xhr:D.aa}),{},l("POST")),D.aa=[]))},errors:[]},X=null,j={},z=[["load",m],["beforeunload",y],["pagehide",y],["unload",y]],J=0;J<z.length;J++)N.sh(t,z[J][0],z[J][1],!1);t.addEventListener?N.sh(t,"error",w,!1):t.onerror=function(t,r,e,n,a){var o=[t,e,n,r==x.URL?"#":r];if(a){var i=_(t,e,n,a.moduleName);o=o.concat([1,a.stack,a.moduleName,j[i]?0:1]),j[i]=!0}g(o),U.errors.push(o)};for(var W=[["scroll",v],["keypress",v],["click",v],["DOMContentLoaded",d],["readystatechange",h]],J=0;J<W.length;J++)N.sh(x,W[J][0],W[J][1],!1);if(N.wrap(!1,t,"requestAnimationFrame",function(r){return function(){return D.firstPaint=n(),t.requestAnimationFrame=r,r.apply(this,arguments)}}),k)if(k.prototype)N.wrap(!1,k.prototype,"open",S),N.wrap(!1,k.prototype,"send",b);else{N.ie=7;var G=k;t.XMLHttpRequest=function(){var t=new G;return N.wrap(!1,t,"open",S),N.wrap(!1,t,"send",b),t}}else t.ActiveXObject&&(N.ie=6)}}(window);
/*!common/components/jquery-niceScroll/jquery.nicescroll.min.js*/
;(function(a){if(typeof define==="function"&&define.amd){define('common/components/jquery-niceScroll/jquery.nicescroll.min', ["jquery"],a)}else{if(typeof exports==="object"){module.exports=a(require("jquery"))}else{a(jQuery)}}}(function(m){var f=false;var k=false;var i=0;var p=2000;var d=0;var e=m;function w(){var v=document.getElementsByTagName("script");var y=v.length?v[v.length-1].src.split("?")[0]:"";return(y.split("/").length>0)?y.split("/").slice(0,-1).join("/")+"/":""}var u=["webkit","ms","moz","o"];var g=window.requestAnimationFrame||false;var h=window.cancelAnimationFrame||false;if(!g){for(var s in u){var n=u[s];if(!g){g=window[n+"RequestAnimationFrame"]}if(!h){h=window[n+"CancelAnimationFrame"]||window[n+"CancelRequestAnimationFrame"]}}}var a=window.MutationObserver||window.WebKitMutationObserver||false;var c={zindex:"auto",cursoropacitymin:0,cursoropacitymax:1,cursorcolor:"#424242",cursorwidth:"5px",cursorborder:"1px solid #fff",cursorborderradius:"5px",scrollspeed:60,mousescrollstep:8*3,touchbehavior:false,hwacceleration:true,usetransition:true,boxzoom:false,dblclickzoom:true,gesturezoom:true,grabcursorenabled:true,autohidemode:true,background:"",iframeautoresize:true,cursorminheight:32,preservenativescrolling:true,railoffset:false,railhoffset:false,bouncescroll:true,spacebarenabled:true,railpadding:{top:0,right:0,left:0,bottom:0},disableoutline:true,horizrailenabled:true,railalign:"right",railvalign:"bottom",enabletranslate3d:true,enablemousewheel:true,enablekeyboard:true,smoothscroll:true,sensitiverail:true,enablemouselockapi:true,cursorfixedheight:false,directionlockdeadzone:6,hidecursordelay:400,nativeparentscrolling:true,enablescrollonselection:true,overflowx:true,overflowy:true,cursordragspeed:0.3,rtlmode:"auto",cursordragontouch:false,oneaxismousemode:"auto",scriptpath:w(),preventmultitouchscrolling:true};var j=false;var t=function(){if(j){return j}var E=document.createElement("DIV"),z=E.style,B=navigator.userAgent,y=navigator.platform,C={};C.haspointerlock="pointerLockElement" in document||"webkitPointerLockElement" in document||"mozPointerLockElement" in document;C.isopera=("opera" in window);C.isopera12=(C.isopera&&("getUserMedia" in navigator));C.isoperamini=(Object.prototype.toString.call(window.operamini)==="[object OperaMini]");C.isie=(("all" in document)&&("attachEvent" in E)&&!C.isopera);C.isieold=(C.isie&&!("msInterpolationMode" in z));C.isie7=C.isie&&!C.isieold&&(!("documentMode" in document)||(document.documentMode==7));C.isie8=C.isie&&("documentMode" in document)&&(document.documentMode==8);C.isie9=C.isie&&("performance" in window)&&(document.documentMode>=9);C.isie10=C.isie&&("performance" in window)&&(document.documentMode==10);C.isie11=("msRequestFullscreen" in E)&&(document.documentMode>=11);C.isieedge=(navigator.userAgent.match(/Edge\/12\./));C.isie9mobile=/iemobile.9/i.test(B);if(C.isie9mobile){C.isie9=false}C.isie7mobile=(!C.isie9mobile&&C.isie7)&&/iemobile/i.test(B);C.ismozilla=("MozAppearance" in z);C.iswebkit=("WebkitAppearance" in z);C.ischrome=("chrome" in window);C.ischrome22=(C.ischrome&&C.haspointerlock);C.ischrome26=(C.ischrome&&("transition" in z));C.cantouch=("ontouchstart" in document.documentElement)||("ontouchstart" in window);C.hasmstouch=(window.MSPointerEvent||false);C.hasw3ctouch=(window.PointerEvent||false)&&((navigator.MaxTouchPoints>0)||(navigator.msMaxTouchPoints>0));C.ismac=/^mac$/i.test(y);C.isios=(C.cantouch&&/iphone|ipad|ipod/i.test(y));C.isios4=((C.isios)&&!("seal" in Object));C.isios7=((C.isios)&&("webkitHidden" in document));C.isandroid=(/android/i.test(B));C.haseventlistener=("addEventListener" in E);C.trstyle=false;C.hastransform=false;C.hastranslate3d=false;C.transitionstyle=false;C.hastransition=false;C.transitionend=false;var D;var v=["transform","msTransform","webkitTransform","MozTransform","OTransform"];for(D=0;D<v.length;D++){if(typeof z[v[D]]!="undefined"){C.trstyle=v[D];break}}C.hastransform=(!!C.trstyle);if(C.hastransform){z[C.trstyle]="translate3d(1px,2px,3px)";C.hastranslate3d=/translate3d/.test(z[C.trstyle])}C.transitionstyle=false;C.prefixstyle="";C.transitionend=false;v=["transition","webkitTransition","msTransition","MozTransition","OTransition","OTransition","KhtmlTransition"];var A=["","-webkit-","-ms-","-moz-","-o-","-o","-khtml-"];var G=["transitionend","webkitTransitionEnd","msTransitionEnd","transitionend","otransitionend","oTransitionEnd","KhtmlTransitionEnd"];for(D=0;D<v.length;D++){if(v[D] in z){C.transitionstyle=v[D];C.prefixstyle=A[D];C.transitionend=G[D];break}}if(C.ischrome26){C.prefixstyle=A[1]}C.hastransition=(C.transitionstyle);function F(){var H=["-webkit-grab","-moz-grab","grab"];if((C.ischrome&&!C.ischrome22)||C.isie){H=[]}for(var I=0;I<H.length;I++){var J=H[I];z.cursor=J;if(z.cursor==J){return J}}return"url(//mail.google.com/mail/images/2/openhand.cur),n-resize"}C.cursorgrabvalue=F();C.hasmousecapture=("setCapture" in E);C.hasMutationObserver=(a!==false);E=null;j=C;return C};var b=function(A,E){var J=this;this.version="3.6.6";this.name="nicescroll";this.me=E;this.opt={doc:e("body"),win:false};e.extend(this.opt,c);this.opt.snapbackspeed=80;if(A||false){for(var G in J.opt){if(typeof A[G]!="undefined"){J.opt[G]=A[G]}}}this.doc=J.opt.doc;this.iddoc=(this.doc&&this.doc[0])?this.doc[0].id||"":"";this.ispage=/^BODY|HTML/.test((J.opt.win)?J.opt.win[0].nodeName:this.doc[0].nodeName);this.haswrapper=(J.opt.win!==false);this.win=J.opt.win||(this.ispage?e(window):this.doc);this.docscroll=(this.ispage&&!this.haswrapper)?e(window):this.win;this.body=e("body");this.viewport=false;this.isfixed=false;this.iframe=false;this.isiframe=((this.doc[0].nodeName=="IFRAME")&&(this.win[0].nodeName=="IFRAME"));this.istextarea=(this.win[0].nodeName=="TEXTAREA");this.forcescreen=false;this.canshowonmouseevent=(J.opt.autohidemode!="scroll");this.onmousedown=false;this.onmouseup=false;this.onmousemove=false;this.onmousewheel=false;this.onkeypress=false;this.ongesturezoom=false;this.onclick=false;this.onscrollstart=false;this.onscrollend=false;this.onscrollcancel=false;this.onzoomin=false;this.onzoomout=false;this.view=false;this.page=false;this.scroll={x:0,y:0};this.scrollratio={x:0,y:0};this.cursorheight=20;this.scrollvaluemax=0;this.isrtlmode=(this.opt.rtlmode=="auto")?((this.win[0]==window?this.body:this.win).css("direction")=="rtl"):(this.opt.rtlmode===true);this.scrollrunning=false;this.scrollmom=false;this.observer=false;this.observerremover=false;this.observerbody=false;do{this.id="ascrail"+(p++)}while(document.getElementById(this.id));this.rail=false;this.cursor=false;this.cursorfreezed=false;this.selectiondrag=false;this.zoom=false;this.zoomactive=false;this.hasfocus=false;this.hasmousefocus=false;this.visibility=true;this.railslocked=false;this.locked=false;this.hidden=false;this.cursoractive=true;this.wheelprevented=false;this.overflowx=J.opt.overflowx;this.overflowy=J.opt.overflowy;this.nativescrollingarea=false;this.checkarea=0;this.events=[];this.saved={};this.delaylist={};this.synclist={};this.lastdeltax=0;this.lastdeltay=0;this.detected=t();var I=e.extend({},this.detected);this.canhwscroll=(I.hastransform&&J.opt.hwacceleration);this.ishwscroll=(this.canhwscroll&&J.haswrapper);this.hasreversehr=(this.isrtlmode&&!I.iswebkit);this.istouchcapable=false;if(I.cantouch&&!I.isios&&!I.isandroid&&(I.iswebkit||I.ismozilla)){this.istouchcapable=true;I.cantouch=false}if(!J.opt.enablemouselockapi){I.hasmousecapture=false;I.haspointerlock=false}this.debounced=function(N,O,M){var L=J.delaylist[N];J.delaylist[N]=O;if(!L){J.debouncedelayed=setTimeout(function(){if(!J){return}var P=J.delaylist[N];J.delaylist[N]=false;P.call(J)},M)}};var F=false;this.synched=function(M,N){function L(){if(F){return}g(function(){F=false;for(var P in J.synclist){var O=J.synclist[P];if(O){O.call(J)}J.synclist[P]=false}});F=true}J.synclist[M]=N;L();return M};this.unsynched=function(L){if(J.synclist[L]){J.synclist[L]=false}};this.css=function(M,L){for(var N in L){J.saved.css.push([M,N,M.css(N)]);M.css(N,L[N])}};this.scrollTop=function(L){return(typeof L=="undefined")?J.getScrollTop():J.setScrollTop(L)};this.scrollLeft=function(L){return(typeof L=="undefined")?J.getScrollLeft():J.setScrollLeft(L)};var z=function(M,L,N,R,Q,P,O){this.st=M;this.ed=L;this.spd=N;this.p1=R||0;this.p2=Q||1;this.p3=P||0;this.p4=O||1;this.ts=(new Date()).getTime();this.df=this.ed-this.st};z.prototype={B2:function(L){return 3*L*L*(1-L)},B3:function(L){return 3*L*(1-L)*(1-L)},B4:function(L){return(1-L)*(1-L)*(1-L)},getNow:function(){var L=(new Date()).getTime();var M=1-((L-this.ts)/this.spd);var N=this.B2(M)+this.B3(M)+this.B4(M);return(M<0)?this.ed:this.st+Math.round(this.df*N)},update:function(L,M){this.st=this.getNow();this.ed=L;this.spd=M;this.ts=(new Date()).getTime();this.df=this.ed-this.st;return this}};function K(){var L=J.doc.css(I.trstyle);if(L&&(L.substr(0,6)=="matrix")){return L.replace(/^.*\((.*)\)$/g,"$1").replace(/px/g,"").split(/, +/)}return false}if(this.ishwscroll){this.doc.translate={x:0,y:0,tx:"0px",ty:"0px"};if(I.hastranslate3d&&I.isios){this.doc.css("-webkit-backface-visibility","hidden")}this.getScrollTop=function(M){if(!M){var L=K();if(L){return(L.length==16)?-L[13]:-L[5]}if(J.timerscroll&&J.timerscroll.bz){return J.timerscroll.bz.getNow()}}return J.doc.translate.y};this.getScrollLeft=function(M){if(!M){var L=K();if(L){return(L.length==16)?-L[12]:-L[4]}if(J.timerscroll&&J.timerscroll.bh){return J.timerscroll.bh.getNow()}}return J.doc.translate.x};this.notifyScrollEvent=function(L){var M=document.createEvent("UIEvents");M.initUIEvent("scroll",false,true,window,1);M.niceevent=true;L.dispatchEvent(M)};var y=(this.isrtlmode)?1:-1;if(I.hastranslate3d&&J.opt.enabletranslate3d){this.setScrollTop=function(M,L){J.doc.translate.y=M;J.doc.translate.ty=(M*-1)+"px";J.doc.css(I.trstyle,"translate3d("+J.doc.translate.tx+","+J.doc.translate.ty+",0px)");if(!L){J.notifyScrollEvent(J.win[0])}};this.setScrollLeft=function(M,L){J.doc.translate.x=M;J.doc.translate.tx=(M*y)+"px";J.doc.css(I.trstyle,"translate3d("+J.doc.translate.tx+","+J.doc.translate.ty+",0px)");if(!L){J.notifyScrollEvent(J.win[0])}}}else{this.setScrollTop=function(M,L){J.doc.translate.y=M;J.doc.translate.ty=(M*-1)+"px";J.doc.css(I.trstyle,"translate("+J.doc.translate.tx+","+J.doc.translate.ty+")");if(!L){J.notifyScrollEvent(J.win[0])}};this.setScrollLeft=function(M,L){J.doc.translate.x=M;J.doc.translate.tx=(M*y)+"px";J.doc.css(I.trstyle,"translate("+J.doc.translate.tx+","+J.doc.translate.ty+")");if(!L){J.notifyScrollEvent(J.win[0])}}}}else{this.getScrollTop=function(){return J.docscroll.scrollTop()};this.setScrollTop=function(L){return setTimeout(function(){J.docscroll.scrollTop(L)},1)};this.getScrollLeft=function(){if(J.detected.ismozilla&&J.isrtlmode){return Math.abs(J.docscroll.scrollLeft())}return J.docscroll.scrollLeft()};this.setScrollLeft=function(L){return setTimeout(function(){J.docscroll.scrollLeft((J.detected.ismozilla&&J.isrtlmode)?-L:L)},1)}}this.getTarget=function(L){if(!L){return false}if(L.target){return L.target}if(L.srcElement){return L.srcElement}return false};this.hasParent=function(M,N){if(!M){return false}var L=M.target||M.srcElement||M||false;while(L&&L.id!=N){L=L.parentNode||false}return(L!==false)};function B(){var M=J.win;if("zIndex" in M){return M.zIndex()}while(M.length>0){if(M[0].nodeType==9){return false}var L=M.css("zIndex");if(!isNaN(L)&&L!=0){return parseInt(L)}M=M.parent()}return false}var H={thin:1,medium:3,thick:5};function D(O,Q,N){var M=O.css(Q);var L=parseFloat(M);if(isNaN(L)){L=H[M]||0;var P=(L==3)?((N)?(J.win.outerHeight()-J.win.innerHeight()):(J.win.outerWidth()-J.win.innerWidth())):1;if(J.isie8&&L){L+=1}return(P)?L:0}return L}this.getDocumentScrollOffset=function(){return{top:window.pageYOffset||document.documentElement.scrollTop,left:window.pageXOffset||document.documentElement.scrollLeft}};this.getOffset=function(){if(J.isfixed){var N=J.win.offset();var M=J.getDocumentScrollOffset();N.top-=M.top;N.left-=M.left;return N}var O=J.win.offset();if(!J.viewport){return O}var L=J.viewport.offset();return{top:O.top-L.top,left:O.left-L.left}};this.updateScrollBar=function(M){if(J.ishwscroll){J.rail.css({height:J.win.innerHeight()-(J.opt.railpadding.top+J.opt.railpadding.bottom)});if(J.railh){J.railh.css({width:J.win.innerWidth()-(J.opt.railpadding.left+J.opt.railpadding.right)})}}else{var N=J.getOffset();var Q={top:N.top,left:N.left-(J.opt.railpadding.left+J.opt.railpadding.right)};Q.top+=D(J.win,"border-top-width",true);Q.left+=(J.rail.align)?J.win.outerWidth()-D(J.win,"border-right-width")-J.rail.width:D(J.win,"border-left-width");var O=J.opt.railoffset;if(O){if(O.top){Q.top+=O.top}if(O.left){Q.left+=O.left}}if(!J.railslocked){J.rail.css({top:Q.top,left:Q.left,height:((M)?M.h:J.win.innerHeight())-(J.opt.railpadding.top+J.opt.railpadding.bottom)})}if(J.zoom){J.zoom.css({top:Q.top+1,left:(J.rail.align==1)?Q.left-20:Q.left+J.rail.width+4})}if(J.railh&&!J.railslocked){var Q={top:N.top,left:N.left};var O=J.opt.railhoffset;if(!!O){if(!!O.top){Q.top+=O.top}if(!!O.left){Q.left+=O.left}}var P=(J.railh.align)?Q.top+D(J.win,"border-top-width",true)+J.win.innerHeight()-J.railh.height:Q.top+D(J.win,"border-top-width",true);var L=Q.left+D(J.win,"border-left-width");J.railh.css({top:P-(J.opt.railpadding.top+J.opt.railpadding.bottom),left:L,width:J.railh.width})}}};this.doRailClick=function(O,N,M){var L,R,P,Q;if(J.railslocked){return}J.cancelEvent(O);if(N){L=(M)?J.doScrollLeft:J.doScrollTop;P=(M)?((O.pageX-J.railh.offset().left-(J.cursorwidth/2))*J.scrollratio.x):((O.pageY-J.rail.offset().top-(J.cursorheight/2))*J.scrollratio.y);L(P)}else{L=(M)?J.doScrollLeftBy:J.doScrollBy;P=(M)?J.scroll.x:J.scroll.y;Q=(M)?O.pageX-J.railh.offset().left:O.pageY-J.rail.offset().top;R=(M)?J.view.w:J.view.h;L((P>=Q)?R:-R)}};J.hasanimationframe=(g);J.hascancelanimationframe=(h);if(!J.hasanimationframe){g=function(L){return setTimeout(L,15-Math.floor((+new Date())/1000)%16)};h=clearInterval}else{if(!J.hascancelanimationframe){h=function(){J.cancelAnimationFrame=true}}}this.init=function(){J.saved.css=[];if(I.isie7mobile){return true}if(I.isoperamini){return true}if(I.hasmstouch){J.css((J.ispage)?e("html"):J.win,{"-ms-touch-action":"none"})}J.zindex="auto";if(!J.ispage&&J.opt.zindex=="auto"){J.zindex=B()||"auto"}else{J.zindex=J.opt.zindex}if(!J.ispage&&J.zindex!="auto"){if(J.zindex>d){d=J.zindex}}if(J.isie&&J.zindex==0&&J.opt.zindex=="auto"){J.zindex="auto"}if(!J.ispage||(!I.cantouch&&!I.isieold&&!I.isie9mobile)){var P=J.docscroll;if(J.ispage){P=(J.haswrapper)?J.win:J.doc}if(!I.isie9mobile){J.css(P,{"overflow-y":"hidden"})}if(J.ispage&&I.isie7){if(J.doc[0].nodeName=="BODY"){J.css(e("html"),{"overflow-y":"hidden"})}else{if(J.doc[0].nodeName=="HTML"){J.css(e("body"),{"overflow-y":"hidden"})}}}if(I.isios&&!J.ispage&&!J.haswrapper){J.css(e("body"),{"-webkit-overflow-scrolling":"touch"})}var Q=e(document.createElement("div"));Q.css({position:"relative",top:0,"float":"right",width:J.opt.cursorwidth,height:"0px","background-color":J.opt.cursorcolor,border:J.opt.cursorborder,"background-clip":"padding-box","-webkit-border-radius":J.opt.cursorborderradius,"-moz-border-radius":J.opt.cursorborderradius,"border-radius":J.opt.cursorborderradius});Q.hborder=parseFloat(Q.outerHeight()-Q.innerHeight());Q.addClass("nicescroll-cursors");J.cursor=Q;var O=e(document.createElement("div"));O.attr("id",J.id);O.addClass("nicescroll-rails nicescroll-rails-vr");var U,aa,M=["left","right","top","bottom"];for(var W in M){aa=M[W];U=J.opt.railpadding[aa];(U)?O.css("padding-"+aa,U+"px"):J.opt.railpadding[aa]=0}O.append(Q);O.width=Math.max(parseFloat(J.opt.cursorwidth),Q.outerWidth());O.css({width:O.width+"px",zIndex:J.zindex,background:J.opt.background,cursor:"default"});O.visibility=true;O.scrollable=true;O.align=(J.opt.railalign=="left")?0:1;J.rail=O;J.rail.drag=false;var L=false;if(J.opt.boxzoom&&!J.ispage&&!I.isieold){L=document.createElement("div");J.bind(L,"click",J.doZoom);J.bind(L,"mouseenter",function(){J.zoom.css("opacity",J.opt.cursoropacitymax)});J.bind(L,"mouseleave",function(){J.zoom.css("opacity",J.opt.cursoropacitymin)});J.zoom=e(L);J.zoom.css({cursor:"pointer","z-index":J.zindex,backgroundImage:"url("+J.opt.scriptpath+"zoomico.png)",height:18,width:18,backgroundPosition:"0px 0px"});if(J.opt.dblclickzoom){J.bind(J.win,"dblclick",J.doZoom)}if(I.cantouch&&J.opt.gesturezoom){J.ongesturezoom=function(ad){if(ad.scale>1.5){J.doZoomIn(ad)}if(ad.scale<0.8){J.doZoomOut(ad)}return J.cancelEvent(ad)};J.bind(J.win,"gestureend",J.ongesturezoom)}}J.railh=false;var T;if(J.opt.horizrailenabled){J.css(P,{"overflow-x":"hidden"});var Q=e(document.createElement("div"));Q.css({position:"absolute",top:0,height:J.opt.cursorwidth,width:"0px","background-color":J.opt.cursorcolor,border:J.opt.cursorborder,"background-clip":"padding-box","-webkit-border-radius":J.opt.cursorborderradius,"-moz-border-radius":J.opt.cursorborderradius,"border-radius":J.opt.cursorborderradius});if(I.isieold){Q.css({overflow:"hidden"})}Q.wborder=parseFloat(Q.outerWidth()-Q.innerWidth());Q.addClass("nicescroll-cursors");J.cursorh=Q;T=e(document.createElement("div"));T.attr("id",J.id+"-hr");T.addClass("nicescroll-rails nicescroll-rails-hr");T.height=Math.max(parseFloat(J.opt.cursorwidth),Q.outerHeight());T.css({height:T.height+"px",zIndex:J.zindex,background:J.opt.background});T.append(Q);T.visibility=true;T.scrollable=true;T.align=(J.opt.railvalign=="top")?0:1;J.railh=T;J.railh.drag=false}if(J.ispage){O.css({position:"fixed",top:"0px",height:"100%"});(O.align)?O.css({right:"0px"}):O.css({left:"0px"});J.body.append(O);if(J.railh){T.css({position:"fixed",left:"0px",width:"100%"});(T.align)?T.css({bottom:"0px"}):T.css({top:"0px"});J.body.append(T)}}else{if(J.ishwscroll){if(J.win.css("position")=="static"){J.css(J.win,{position:"relative"})}var R=(J.win[0].nodeName=="HTML")?J.body:J.win;e(R).scrollTop(0).scrollLeft(0);if(J.zoom){J.zoom.css({position:"absolute",top:1,right:0,"margin-right":O.width+4});R.append(J.zoom)}O.css({position:"absolute",top:0});(O.align)?O.css({right:0}):O.css({left:0});R.append(O);if(T){T.css({position:"absolute",left:0,bottom:0});(T.align)?T.css({bottom:0}):T.css({top:0});R.append(T)}}else{J.isfixed=(J.win.css("position")=="fixed");var X=(J.isfixed)?"fixed":"absolute";if(!J.isfixed){J.viewport=J.getViewport(J.win[0])}if(J.viewport){J.body=J.viewport;if((/fixed|absolute/.test(J.viewport.css("position")))==false){J.css(J.viewport,{position:"relative"})}}O.css({position:X});if(J.zoom){J.zoom.css({position:X})}J.updateScrollBar();J.body.append(O);if(J.zoom){J.body.append(J.zoom)}if(J.railh){T.css({position:X});J.body.append(T)}}if(I.isios){J.css(J.win,{"-webkit-tap-highlight-color":"rgba(0,0,0,0)","-webkit-touch-callout":"none"})}if(I.isie&&J.opt.disableoutline){J.win.attr("hideFocus","true")}if(I.iswebkit&&J.opt.disableoutline){J.win.css({outline:"none"})}}if(J.opt.autohidemode===false){J.autohidedom=false;J.rail.css({opacity:J.opt.cursoropacitymax});if(J.railh){J.railh.css({opacity:J.opt.cursoropacitymax})}}else{if((J.opt.autohidemode===true)||(J.opt.autohidemode==="leave")){J.autohidedom=e().add(J.rail);if(I.isie8){J.autohidedom=J.autohidedom.add(J.cursor)}if(J.railh){J.autohidedom=J.autohidedom.add(J.railh)}if(J.railh&&I.isie8){J.autohidedom=J.autohidedom.add(J.cursorh)}}else{if(J.opt.autohidemode=="scroll"){J.autohidedom=e().add(J.rail);if(J.railh){J.autohidedom=J.autohidedom.add(J.railh)}}else{if(J.opt.autohidemode=="cursor"){J.autohidedom=e().add(J.cursor);if(J.railh){J.autohidedom=J.autohidedom.add(J.cursorh)}}else{if(J.opt.autohidemode=="hidden"){J.autohidedom=false;J.hide();J.railslocked=false}}}}}if(I.isie9mobile){J.scrollmom=new r(J);J.onmangotouch=function(){var ag=J.getScrollTop();var ah=J.getScrollLeft();if((ag==J.scrollmom.lastscrolly)&&(ah==J.scrollmom.lastscrollx)){return true}var al=ag-J.mangotouch.sy;var ad=ah-J.mangotouch.sx;var af=Math.round(Math.sqrt(Math.pow(ad,2)+Math.pow(al,2)));if(af==0){return}var ai=(al<0)?-1:1;var aj=(ad<0)?-1:1;var ak=+new Date();if(J.mangotouch.lazy){clearTimeout(J.mangotouch.lazy)}if(((ak-J.mangotouch.tm)>80)||(J.mangotouch.dry!=ai)||(J.mangotouch.drx!=aj)){J.scrollmom.stop();J.scrollmom.reset(ah,ag);J.mangotouch.sy=ag;J.mangotouch.ly=ag;J.mangotouch.sx=ah;J.mangotouch.lx=ah;J.mangotouch.dry=ai;J.mangotouch.drx=aj;J.mangotouch.tm=ak}else{J.scrollmom.stop();J.scrollmom.update(J.mangotouch.sx-ad,J.mangotouch.sy-al);J.mangotouch.tm=ak;var ae=Math.max(Math.abs(J.mangotouch.ly-ag),Math.abs(J.mangotouch.lx-ah));J.mangotouch.ly=ag;J.mangotouch.lx=ah;if(ae>2){J.mangotouch.lazy=setTimeout(function(){J.mangotouch.lazy=false;J.mangotouch.dry=0;J.mangotouch.drx=0;J.mangotouch.tm=0;J.scrollmom.doMomentum(30)},100)}}};var V=J.getScrollTop();var ab=J.getScrollLeft();J.mangotouch={sy:V,ly:V,dry:0,sx:ab,lx:ab,drx:0,lazy:false,tm:0};J.bind(J.docscroll,"scroll",J.onmangotouch)}else{if(I.cantouch||J.istouchcapable||J.opt.touchbehavior||I.hasmstouch){J.scrollmom=new r(J);J.ontouchstart=function(ai){if(ai.pointerType&&ai.pointerType!=2&&ai.pointerType!="touch"){return false}J.hasmoving=false;if(!J.railslocked){var ae;if(I.hasmstouch){ae=(ai.target)?ai.target:false;while(ae){var ag=e(ae).getNiceScroll();if((ag.length>0)&&(ag[0].me==J.me)){break}if(ag.length>0){return false}if((ae.nodeName=="DIV")&&(ae.id==J.id)){break}ae=(ae.parentNode)?ae.parentNode:false}}J.cancelScroll();ae=J.getTarget(ai);if(ae){var an=(/INPUT/i.test(ae.nodeName))&&(/range/i.test(ae.type));if(an){return J.stopPropagation(ai)}}if(!("clientX" in ai)&&("changedTouches" in ai)){ai.clientX=ai.changedTouches[0].clientX;ai.clientY=ai.changedTouches[0].clientY}if(J.forcescreen){var ad=ai;ai={original:(ai.original)?ai.original:ai};ai.clientX=ad.screenX;ai.clientY=ad.screenY}J.rail.drag={x:ai.clientX,y:ai.clientY,sx:J.scroll.x,sy:J.scroll.y,st:J.getScrollTop(),sl:J.getScrollLeft(),pt:2,dl:false};if(J.ispage||!J.opt.directionlockdeadzone){J.rail.drag.dl="f"}else{var am={w:e(window).width(),h:e(window).height()};var aj={w:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),h:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)};var af=Math.max(0,aj.h-am.h);var al=Math.max(0,aj.w-am.w);if(!J.rail.scrollable&&J.railh.scrollable){J.rail.drag.ck=(af>0)?"v":false}else{if(J.rail.scrollable&&!J.railh.scrollable){J.rail.drag.ck=(al>0)?"h":false}else{J.rail.drag.ck=false}}if(!J.rail.drag.ck){J.rail.drag.dl="f"}}if(J.opt.touchbehavior&&J.isiframe&&I.isie){var ak=J.win.position();J.rail.drag.x+=ak.left;J.rail.drag.y+=ak.top}J.hasmoving=false;J.lastmouseup=false;J.scrollmom.reset(ai.clientX,ai.clientY);if(!I.cantouch&&!this.istouchcapable&&!ai.pointerType){var ah=(ae)?/INPUT|SELECT|TEXTAREA/i.test(ae.nodeName):false;if(!ah){if(!J.ispage&&I.hasmousecapture){ae.setCapture()}if(J.opt.touchbehavior){if(ae.onclick&&!(ae._onclick||false)){ae._onclick=ae.onclick;ae.onclick=function(ao){if(J.hasmoving){return false}ae._onclick.call(this,ao)}}return J.cancelEvent(ai)}return J.stopPropagation(ai)}if(/SUBMIT|CANCEL|BUTTON/i.test(e(ae).attr("type"))){pc={tg:ae,click:false};J.preventclick=pc}}}};J.ontouchend=function(ad){if(!J.rail.drag){return true}if(J.rail.drag.pt==2){if(ad.pointerType&&ad.pointerType!=2&&ad.pointerType!="touch"){return false}J.scrollmom.doMomentum();J.rail.drag=false;if(J.hasmoving){J.lastmouseup=true;J.hideCursor();if(I.hasmousecapture){document.releaseCapture()}if(!I.cantouch){return J.cancelEvent(ad)}}}else{if(J.rail.drag.pt==1){return J.onmouseup(ad)}}};var Z=(J.opt.touchbehavior&&J.isiframe&&!I.hasmousecapture);J.ontouchmove=function(am,ah){if(!J.rail.drag){return false}if(am.targetTouches&&J.opt.preventmultitouchscrolling){if(am.targetTouches.length>1){return false}}if(am.pointerType&&am.pointerType!=2&&am.pointerType!="touch"){return false}if(J.rail.drag.pt==2){if(I.cantouch&&(I.isios)&&(typeof am.original=="undefined")){return true}J.hasmoving=true;if(J.preventclick&&!J.preventclick.click){J.preventclick.click=J.preventclick.tg.onclick||false;J.preventclick.tg.onclick=J.onpreventclick}var an=e.extend({original:am},am);am=an;if(("changedTouches" in am)){am.clientX=am.changedTouches[0].clientX;am.clientY=am.changedTouches[0].clientY}if(J.forcescreen){var ae=am;am={original:(am.original)?am.original:am};am.clientX=ae.screenX;am.clientY=ae.screenY}var ai,aj;aj=ai=0;if(Z&&!ah){var ao=J.win.position();aj=-ao.left;ai=-ao.top}var af=am.clientY+ai;var aq=(af-J.rail.drag.y);var ag=am.clientX+aj;var ar=(ag-J.rail.drag.x);var ak=J.rail.drag.st-aq;if(J.ishwscroll&&J.opt.bouncescroll){if(ak<0){ak=Math.round(ak/2)}else{if(ak>J.page.maxh){ak=J.page.maxh+Math.round((ak-J.page.maxh)/2)}}}else{if(ak<0){ak=0;af=0}if(ak>J.page.maxh){ak=J.page.maxh;af=0}}var al;if(J.railh&&J.railh.scrollable){al=(J.isrtlmode)?ar-J.rail.drag.sl:J.rail.drag.sl-ar;if(J.ishwscroll&&J.opt.bouncescroll){if(al<0){al=Math.round(al/2)}else{if(al>J.page.maxw){al=J.page.maxw+Math.round((al-J.page.maxw)/2)}}}else{if(al<0){al=0;ag=0}if(al>J.page.maxw){al=J.page.maxw;ag=0}}}var ap=false;if(J.rail.drag.dl){ap=true;if(J.rail.drag.dl=="v"){al=J.rail.drag.sl}else{if(J.rail.drag.dl=="h"){ak=J.rail.drag.st}}}else{var au=Math.abs(aq);var ad=Math.abs(ar);var at=J.opt.directionlockdeadzone;if(J.rail.drag.ck=="v"){if(au>at&&(ad<=(au*0.3))){J.rail.drag=false;return true}else{if(ad>at){J.rail.drag.dl="f";e("body").scrollTop(e("body").scrollTop())}}}else{if(J.rail.drag.ck=="h"){if(ad>at&&(au<=(ad*0.3))){J.rail.drag=false;return true}else{if(au>at){J.rail.drag.dl="f";e("body").scrollLeft(e("body").scrollLeft())}}}}}J.synched("touchmove",function(){if(J.rail.drag&&(J.rail.drag.pt==2)){if(J.prepareTransition){J.prepareTransition(0)}if(J.rail.scrollable){J.setScrollTop(ak)}J.scrollmom.update(ag,af);if(J.railh&&J.railh.scrollable){J.setScrollLeft(al);J.showCursor(ak,al)}else{J.showCursor(ak)}if(I.isie10){document.selection.clear()}}});if(I.ischrome&&J.istouchcapable){ap=false}if(ap){return J.cancelEvent(am)}}else{if(J.rail.drag.pt==1){return J.onmousemove(am)}}}}J.onmousedown=function(af,ad){if(J.rail.drag&&J.rail.drag.pt!=1){return}if(J.railslocked){return J.cancelEvent(af)}J.cancelScroll();J.rail.drag={x:af.clientX,y:af.clientY,sx:J.scroll.x,sy:J.scroll.y,pt:1,hr:(!!ad)};var ae=J.getTarget(af);if(!J.ispage&&I.hasmousecapture){ae.setCapture()}if(J.isiframe&&!I.hasmousecapture){J.saved.csspointerevents=J.doc.css("pointer-events");J.css(J.doc,{"pointer-events":"none"})}J.hasmoving=false;return J.cancelEvent(af)};J.onmouseup=function(ad){if(J.rail.drag){if(J.rail.drag.pt!=1){return true}if(I.hasmousecapture){document.releaseCapture()}if(J.isiframe&&!I.hasmousecapture){J.doc.css("pointer-events",J.saved.csspointerevents)}J.rail.drag=false;if(J.hasmoving){J.triggerScrollEnd()}return J.cancelEvent(ad)}};J.onmousemove=function(ae){if(J.rail.drag){if(J.rail.drag.pt!=1){return}if(I.ischrome&&ae.which==0){return J.onmouseup(ae)}J.cursorfreezed=true;J.hasmoving=true;if(J.rail.drag.hr){J.scroll.x=J.rail.drag.sx+(ae.clientX-J.rail.drag.x);if(J.scroll.x<0){J.scroll.x=0}var af=J.scrollvaluemaxw;if(J.scroll.x>af){J.scroll.x=af}}else{J.scroll.y=J.rail.drag.sy+(ae.clientY-J.rail.drag.y);if(J.scroll.y<0){J.scroll.y=0}var ad=J.scrollvaluemax;if(J.scroll.y>ad){J.scroll.y=ad}}J.synched("mousemove",function(){if(J.rail.drag&&(J.rail.drag.pt==1)){J.showCursor();if(J.rail.drag.hr){if(J.hasreversehr){J.doScrollLeft(J.scrollvaluemaxw-Math.round(J.scroll.x*J.scrollratio.x),J.opt.cursordragspeed)}else{J.doScrollLeft(Math.round(J.scroll.x*J.scrollratio.x),J.opt.cursordragspeed)}}else{J.doScrollTop(Math.round(J.scroll.y*J.scrollratio.y),J.opt.cursordragspeed)}}});return J.cancelEvent(ae)}else{J.checkarea=0}};if(I.cantouch||J.opt.touchbehavior){J.onpreventclick=function(ad){if(J.preventclick){J.preventclick.tg.onclick=J.preventclick.click;J.preventclick=false;return J.cancelEvent(ad)}};J.bind(J.win,"mousedown",J.ontouchstart);J.onclick=(I.isios)?false:function(ad){if(J.lastmouseup){J.lastmouseup=false;return J.cancelEvent(ad)}else{return true}};if(J.opt.grabcursorenabled&&I.cursorgrabvalue){J.css((J.ispage)?J.doc:J.win,{cursor:I.cursorgrabvalue});J.css(J.rail,{cursor:I.cursorgrabvalue})}}else{var N=function(af){if(!J.selectiondrag){return}if(af){var ae=J.win.outerHeight();var ag=(af.pageY-J.selectiondrag.top);if(ag>0&&ag<ae){ag=0}if(ag>=ae){ag-=ae}J.selectiondrag.df=ag}if(J.selectiondrag.df==0){return}var ad=-Math.floor(J.selectiondrag.df/6)*2;J.doScrollBy(ad);J.debounced("doselectionscroll",function(){N()},50)};if("getSelection" in document){J.hasTextSelected=function(){return(document.getSelection().rangeCount>0)}}else{if("selection" in document){J.hasTextSelected=function(){return(document.selection.type!="None")}}else{J.hasTextSelected=function(){return false}}}J.onselectionstart=function(ad){if(J.ispage){return}J.selectiondrag=J.win.offset()};J.onselectionend=function(ad){J.selectiondrag=false};J.onselectiondrag=function(ad){if(!J.selectiondrag){return}if(J.hasTextSelected()){J.debounced("selectionscroll",function(){N(ad)},250)}}}if(I.hasw3ctouch){J.css(J.rail,{"touch-action":"none"});J.css(J.cursor,{"touch-action":"none"});J.bind(J.win,"pointerdown",J.ontouchstart);J.bind(document,"pointerup",J.ontouchend);J.bind(document,"pointermove",J.ontouchmove)}else{if(I.hasmstouch){J.css(J.rail,{"-ms-touch-action":"none"});J.css(J.cursor,{"-ms-touch-action":"none"});J.bind(J.win,"MSPointerDown",J.ontouchstart);J.bind(document,"MSPointerUp",J.ontouchend);J.bind(document,"MSPointerMove",J.ontouchmove);J.bind(J.cursor,"MSGestureHold",function(ad){ad.preventDefault()});J.bind(J.cursor,"contextmenu",function(ad){ad.preventDefault()})}else{if(this.istouchcapable){J.bind(J.win,"touchstart",J.ontouchstart);J.bind(document,"touchend",J.ontouchend);J.bind(document,"touchcancel",J.ontouchend);J.bind(document,"touchmove",J.ontouchmove)}}}if(J.opt.cursordragontouch||(!I.cantouch&&!J.opt.touchbehavior)){J.rail.css({cursor:"default"});J.railh&&J.railh.css({cursor:"default"});J.jqbind(J.rail,"mouseenter",function(){if(!J.ispage&&!J.win.is(":visible")){return false}if(J.canshowonmouseevent){J.showCursor()}J.rail.active=true});J.jqbind(J.rail,"mouseleave",function(){J.rail.active=false;if(!J.rail.drag){J.hideCursor()}});if(J.opt.sensitiverail){J.bind(J.rail,"click",function(ad){J.doRailClick(ad,false,false)});J.bind(J.rail,"dblclick",function(ad){J.doRailClick(ad,true,false)});J.bind(J.cursor,"click",function(ad){J.cancelEvent(ad)});J.bind(J.cursor,"dblclick",function(ad){J.cancelEvent(ad)})}if(J.railh){J.jqbind(J.railh,"mouseenter",function(){if(!J.ispage&&!J.win.is(":visible")){return false}if(J.canshowonmouseevent){J.showCursor()}J.rail.active=true});J.jqbind(J.railh,"mouseleave",function(){J.rail.active=false;if(!J.rail.drag){J.hideCursor()}});if(J.opt.sensitiverail){J.bind(J.railh,"click",function(ad){J.doRailClick(ad,false,true)});J.bind(J.railh,"dblclick",function(ad){J.doRailClick(ad,true,true)});J.bind(J.cursorh,"click",function(ad){J.cancelEvent(ad)});J.bind(J.cursorh,"dblclick",function(ad){J.cancelEvent(ad)})}}}if(!I.cantouch&&!J.opt.touchbehavior){J.bind((I.hasmousecapture)?J.win:document,"mouseup",J.onmouseup);J.bind(document,"mousemove",J.onmousemove);if(J.onclick){J.bind(document,"click",J.onclick)}J.bind(J.cursor,"mousedown",J.onmousedown);J.bind(J.cursor,"mouseup",J.onmouseup);if(J.railh){J.bind(J.cursorh,"mousedown",function(ad){J.onmousedown(ad,true)});J.bind(J.cursorh,"mouseup",J.onmouseup)}if(!J.ispage&&J.opt.enablescrollonselection){J.bind(J.win[0],"mousedown",J.onselectionstart);J.bind(document,"mouseup",J.onselectionend);J.bind(J.cursor,"mouseup",J.onselectionend);if(J.cursorh){J.bind(J.cursorh,"mouseup",J.onselectionend)}J.bind(document,"mousemove",J.onselectiondrag)}if(J.zoom){J.jqbind(J.zoom,"mouseenter",function(){if(J.canshowonmouseevent){J.showCursor()}J.rail.active=true});J.jqbind(J.zoom,"mouseleave",function(){J.rail.active=false;if(!J.rail.drag){J.hideCursor()}})}}else{J.bind((I.hasmousecapture)?J.win:document,"mouseup",J.ontouchend);J.bind(document,"mousemove",J.ontouchmove);if(J.onclick){J.bind(document,"click",J.onclick)}if(J.opt.cursordragontouch){J.bind(J.cursor,"mousedown",J.onmousedown);J.bind(J.cursor,"mouseup",J.onmouseup);J.cursorh&&J.bind(J.cursorh,"mousedown",function(ad){J.onmousedown(ad,true)});J.cursorh&&J.bind(J.cursorh,"mouseup",J.onmouseup)}}if(J.opt.enablemousewheel){if(!J.isiframe){J.bind((I.isie&&J.ispage)?document:J.win,"mousewheel",J.onmousewheel)}J.bind(J.rail,"mousewheel",J.onmousewheel);if(J.railh){J.bind(J.railh,"mousewheel",J.onmousewheelhr)}}if(!J.ispage&&!I.cantouch&&!(/HTML|^BODY/.test(J.win[0].nodeName))){if(!J.win.attr("tabindex")){J.win.attr({tabindex:i++})}J.jqbind(J.win,"focus",function(ad){f=(J.getTarget(ad)).id||true;J.hasfocus=true;if(J.canshowonmouseevent){J.noticeCursor()}});J.jqbind(J.win,"blur",function(ad){f=false;J.hasfocus=false});J.jqbind(J.win,"mouseenter",function(ad){k=(J.getTarget(ad)).id||true;J.hasmousefocus=true;if(J.canshowonmouseevent){J.noticeCursor()}});J.jqbind(J.win,"mouseleave",function(){k=false;J.hasmousefocus=false;if(!J.rail.drag){J.hideCursor()}})}}J.onkeypress=function(ai){if(J.railslocked&&J.page.maxh==0){return true}ai=(ai)?ai:window.e;var ah=J.getTarget(ai);if(ah&&/INPUT|TEXTAREA|SELECT|OPTION/.test(ah.nodeName)){var aj=ah.getAttribute("type")||ah.type||false;if((!aj)||!(/submit|button|cancel/i.tp)){return true}}if(e(ah).attr("contenteditable")){return true}if(J.hasfocus||(J.hasmousefocus&&!f)||(J.ispage&&!f&&!k)){var af=ai.keyCode;if(J.railslocked&&af!=27){return J.cancelEvent(ai)}var ag=ai.ctrlKey||false;var ad=ai.shiftKey||false;var ae=false;switch(af){case 38:case 63233:J.doScrollBy(24*3);ae=true;break;case 40:case 63235:J.doScrollBy(-24*3);ae=true;break;case 37:case 63232:if(J.railh){(ag)?J.doScrollLeft(0):J.doScrollLeftBy(24*3);ae=true}break;case 39:case 63234:if(J.railh){(ag)?J.doScrollLeft(J.page.maxw):J.doScrollLeftBy(-24*3);ae=true}break;case 33:case 63276:J.doScrollBy(J.view.h);ae=true;break;case 34:case 63277:J.doScrollBy(-J.view.h);ae=true;break;case 36:case 63273:(J.railh&&ag)?J.doScrollPos(0,0):J.doScrollTo(0);ae=true;break;case 35:case 63275:(J.railh&&ag)?J.doScrollPos(J.page.maxw,J.page.maxh):J.doScrollTo(J.page.maxh);ae=true;break;case 32:if(J.opt.spacebarenabled){(ad)?J.doScrollBy(J.view.h):J.doScrollBy(-J.view.h);ae=true}break;case 27:if(J.zoomactive){J.doZoom();ae=true}break}if(ae){return J.cancelEvent(ai)}}};if(J.opt.enablekeyboard){J.bind(document,(I.isopera&&!I.isopera12)?"keypress":"keydown",J.onkeypress)}J.bind(document,"keydown",function(ae){var ad=ae.ctrlKey||false;if(ad){J.wheelprevented=true}});J.bind(document,"keyup",function(ae){var ad=ae.ctrlKey||false;if(!ad){J.wheelprevented=false}});J.bind(window,"blur",function(ad){J.wheelprevented=false});J.bind(window,"resize",J.lazyResize);J.bind(window,"orientationchange",J.lazyResize);J.bind(window,"load",J.lazyResize);if(I.ischrome&&!J.ispage&&!J.haswrapper){var Y=J.win.attr("style");var ac=parseFloat(J.win.css("width"))+1;J.win.css("width",ac);J.synched("chromefix",function(){J.win.attr("style",Y)})}J.onAttributeChange=function(ad){J.lazyResize(J.isieold?250:30)};if(a!==false){J.observerbody=new a(function(ad){ad.forEach(function(ae){if(ae.type=="attributes"){return(e("body").hasClass("modal-open")&&J.doc.parents(".modal-dialog").length===0)?J.hide():J.show()}});if(document.body.scrollHeight!=J.page.maxh){return J.lazyResize(30)}});J.observerbody.observe(document.body,{childList:true,subtree:true,characterData:false,attributes:true,attributeFilter:["class"]})}if(!J.ispage&&!J.haswrapper){if(a!==false){J.observer=new a(function(ad){ad.forEach(J.onAttributeChange)});J.observer.observe(J.win[0],{childList:true,characterData:false,attributes:true,subtree:false});J.observerremover=new a(function(ad){ad.forEach(function(af){if(af.removedNodes.length>0){for(var ae in af.removedNodes){if(!!J&&(af.removedNodes[ae]==J.win[0])){return J.remove()}}}})});J.observerremover.observe(J.win[0].parentNode,{childList:true,characterData:false,attributes:false,subtree:false})}else{J.bind(J.win,(I.isie&&!I.isie9)?"propertychange":"DOMAttrModified",J.onAttributeChange);if(I.isie9){J.win[0].attachEvent("onpropertychange",J.onAttributeChange)}J.bind(J.win,"DOMNodeRemoved",function(ad){if(ad.target==J.win[0]){J.remove()}})}}if(!J.ispage&&J.opt.boxzoom){J.bind(window,"resize",J.resizeZoom)}if(J.istextarea){J.bind(J.win,"keydown",J.lazyResize);J.bind(J.win,"mouseup",J.lazyResize)}J.lazyResize(30)}if(this.doc[0].nodeName=="IFRAME"){var S=function(){J.iframexd=false;var ag;try{ag="contentDocument" in this?this.contentDocument:this.contentWindow.document;var ad=ag.domain}catch(af){J.iframexd=true;ag=false}if(J.iframexd){if("console" in window){console.log("NiceScroll error: policy restriced iframe")}return true}J.forcescreen=true;if(J.isiframe){J.iframe={doc:e(ag),html:J.doc.contents().find("html")[0],body:J.doc.contents().find("body")[0]};J.getContentSize=function(){return{w:Math.max(J.iframe.html.scrollWidth,J.iframe.body.scrollWidth),h:Math.max(J.iframe.html.scrollHeight,J.iframe.body.scrollHeight)}};J.docscroll=e(J.iframe.body)}if(!I.isios&&J.opt.iframeautoresize&&!J.isiframe){J.win.scrollTop(0);J.doc.height("");var ae=Math.max(ag.getElementsByTagName("html")[0].scrollHeight,ag.body.scrollHeight);J.doc.height(ae)}J.lazyResize(30);if(I.isie7){J.css(e(J.iframe.html),{"overflow-y":"hidden"})}J.css(e(J.iframe.body),{"overflow-y":"hidden"});if(I.isios&&J.haswrapper){J.css(e(ag.body),{"-webkit-transform":"translate3d(0,0,0)"})}if("contentWindow" in this){J.bind(this.contentWindow,"scroll",J.onscroll)}else{J.bind(ag,"scroll",J.onscroll)}if(J.opt.enablemousewheel){J.bind(ag,"mousewheel",J.onmousewheel)}if(J.opt.enablekeyboard){J.bind(ag,(I.isopera)?"keypress":"keydown",J.onkeypress)}if(I.cantouch||J.opt.touchbehavior){J.bind(ag,"mousedown",J.ontouchstart);J.bind(ag,"mousemove",function(ah){return J.ontouchmove(ah,true)});if(J.opt.grabcursorenabled&&I.cursorgrabvalue){J.css(e(ag.body),{cursor:I.cursorgrabvalue})}}J.bind(ag,"mouseup",J.ontouchend);if(J.zoom){if(J.opt.dblclickzoom){J.bind(ag,"dblclick",J.doZoom)}if(J.ongesturezoom){J.bind(ag,"gestureend",J.ongesturezoom)}}};if(this.doc[0].readyState&&this.doc[0].readyState=="complete"){setTimeout(function(){S.call(J.doc[0],false)},500)}J.bind(this.doc,"load",S)}};this.showCursor=function(L,M){if(J.cursortimeout){clearTimeout(J.cursortimeout);J.cursortimeout=0}if(!J.rail){return}if(J.autohidedom){J.autohidedom.stop().css({opacity:J.opt.cursoropacitymax});J.cursoractive=true}if(!J.rail.drag||J.rail.drag.pt!=1){if((typeof L!="undefined")&&(L!==false)){J.scroll.y=Math.round(L*1/J.scrollratio.y)}if(typeof M!="undefined"){J.scroll.x=Math.round(M*1/J.scrollratio.x)}}J.cursor.css({height:J.cursorheight,top:J.scroll.y});if(J.cursorh){var N=(J.hasreversehr)?J.scrollvaluemaxw-J.scroll.x:J.scroll.x;(!J.rail.align&&J.rail.visibility)?J.cursorh.css({width:J.cursorwidth,left:N+J.rail.width}):J.cursorh.css({width:J.cursorwidth,left:N});J.cursoractive=true}if(J.zoom){J.zoom.stop().css({opacity:J.opt.cursoropacitymax})}};this.hideCursor=function(L){if(J.cursortimeout){return}if(!J.rail){return}if(!J.autohidedom){return}if(J.hasmousefocus&&J.opt.autohidemode=="leave"){return}J.cursortimeout=setTimeout(function(){if(!J.rail.active||!J.showonmouseevent){J.autohidedom.stop().animate({opacity:J.opt.cursoropacitymin});if(J.zoom){J.zoom.stop().animate({opacity:J.opt.cursoropacitymin})}J.cursoractive=false}J.cursortimeout=0},L||J.opt.hidecursordelay)};this.noticeCursor=function(L,M,N){J.showCursor(M,N);if(!J.rail.active){J.hideCursor(L)}};this.getContentSize=(J.ispage)?function(){return{w:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),h:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)}}:(J.haswrapper)?function(){return{w:J.doc.outerWidth()+parseInt(J.win.css("paddingLeft"))+parseInt(J.win.css("paddingRight")),h:J.doc.outerHeight()+parseInt(J.win.css("paddingTop"))+parseInt(J.win.css("paddingBottom"))}}:function(){return{w:J.docscroll[0].scrollWidth,h:J.docscroll[0].scrollHeight}};this.onResize=function(P,N){if(!J||!J.win){return false}if(!J.haswrapper&&!J.ispage){if(J.win.css("display")=="none"){if(J.visibility){J.hideRail().hideRailHr()}return false}else{if(!J.hidden&&!J.visibility){J.showRail().showRailHr()}}}var S=J.page.maxh;var M=J.page.maxw;var O={h:J.view.h,w:J.view.w};J.view={w:(J.ispage)?J.win.width():parseInt(J.win[0].clientWidth),h:(J.ispage)?J.win.height():parseInt(J.win[0].clientHeight)};J.page=(N)?N:J.getContentSize();J.page.maxh=Math.max(0,J.page.h-J.view.h);J.page.maxw=Math.max(0,J.page.w-J.view.w);if((J.page.maxh==S)&&(J.page.maxw==M)&&(J.view.w==O.w)&&(J.view.h==O.h)){if(!J.ispage){var R=J.win.offset();if(J.lastposition){var L=J.lastposition;if((L.top==R.top)&&(L.left==R.left)){return J}}J.lastposition=R}else{return J}}if(J.page.maxh==0){J.hideRail();J.scrollvaluemax=0;J.scroll.y=0;J.scrollratio.y=0;J.cursorheight=0;J.setScrollTop(0);if(J.rail){J.rail.scrollable=false}}else{J.page.maxh-=(J.opt.railpadding.top+J.opt.railpadding.bottom);J.rail.scrollable=true}if(J.page.maxw==0){J.hideRailHr();J.scrollvaluemaxw=0;J.scroll.x=0;J.scrollratio.x=0;J.cursorwidth=0;J.setScrollLeft(0);if(J.railh){J.railh.scrollable=false}}else{J.page.maxw-=(J.opt.railpadding.left+J.opt.railpadding.right);if(J.railh){J.railh.scrollable=(J.opt.horizrailenabled)}}J.railslocked=(J.locked)||((J.page.maxh==0)&&(J.page.maxw==0));if(J.railslocked){if(!J.ispage){J.updateScrollBar(J.view)}return false}if(!J.hidden&&!J.visibility){J.showRail().showRailHr()}else{if(J.railh&&(!J.hidden&&!J.railh.visibility)){J.showRailHr()}}if(J.istextarea&&J.win.css("resize")&&J.win.css("resize")!="none"){J.view.h-=20}J.cursorheight=Math.min(J.view.h,Math.round(J.view.h*(J.view.h/J.page.h)));J.cursorheight=(J.opt.cursorfixedheight)?J.opt.cursorfixedheight:Math.max(J.opt.cursorminheight,J.cursorheight);J.cursorwidth=Math.min(J.view.w,Math.round(J.view.w*(J.view.w/J.page.w)));J.cursorwidth=(J.opt.cursorfixedheight)?J.opt.cursorfixedheight:Math.max(J.opt.cursorminheight,J.cursorwidth);J.scrollvaluemax=J.view.h-J.cursorheight-J.cursor.hborder-(J.opt.railpadding.top+J.opt.railpadding.bottom);if(J.railh){J.railh.width=(J.page.maxh>0)?(J.view.w-J.rail.width):J.view.w;J.scrollvaluemaxw=J.railh.width-J.cursorwidth-J.cursorh.wborder-(J.opt.railpadding.left+J.opt.railpadding.right)}if(!J.ispage){J.updateScrollBar(J.view)}J.scrollratio={x:(J.page.maxw/J.scrollvaluemaxw),y:(J.page.maxh/J.scrollvaluemax)};var Q=J.getScrollTop();if(Q>J.page.maxh){J.doScrollTop(J.page.maxh)}else{J.scroll.y=Math.round(J.getScrollTop()*(1/J.scrollratio.y));J.scroll.x=Math.round(J.getScrollLeft()*(1/J.scrollratio.x));if(J.cursoractive){J.noticeCursor()}}if(J.scroll.y&&(J.getScrollTop()==0)){J.doScrollTo(Math.floor(J.scroll.y*J.scrollratio.y))}return J};this.resize=J.onResize;this.lazyResize=function(L){L=(isNaN(L))?30:L;J.debounced("resize",J.resize,L);return J};function v(O,M,N,L){J._bind(O,M,function(Q){var Q=(Q)?Q:window.event;var P={original:Q,target:Q.target||Q.srcElement,type:"wheel",deltaMode:Q.type=="MozMousePixelScroll"?0:1,deltaX:0,deltaZ:0,preventDefault:function(){Q.preventDefault?Q.preventDefault():Q.returnValue=false;return false},stopImmediatePropagation:function(){(Q.stopImmediatePropagation)?Q.stopImmediatePropagation():Q.cancelBubble=true}};if(M=="mousewheel"){P.deltaY=-1/40*Q.wheelDelta;Q.wheelDeltaX&&(P.deltaX=-1/40*Q.wheelDeltaX)}else{P.deltaY=Q.detail}return N.call(O,P)},L)}this.jqbind=function(N,L,M){J.events.push({e:N,n:L,f:M,q:true});e(N).bind(L,M)};this.bind=function(R,N,Q,L){var P=("jquery" in R)?R[0]:R;if(N=="mousewheel"){if("onwheel" in J.win){J._bind(P,"wheel",Q,L||false)}else{var M=(typeof document.onmousewheel!="undefined")?"mousewheel":"DOMMouseScroll";v(P,M,Q,L||false);if(M=="DOMMouseScroll"){v(P,"MozMousePixelScroll",Q,L||false)}}}else{if(P.addEventListener){if(I.cantouch&&/mouseup|mousedown|mousemove/.test(N)){var O=(N=="mousedown")?"touchstart":(N=="mouseup")?"touchend":"touchmove";J._bind(P,O,function(T){if(T.touches){if(T.touches.length<2){var S=(T.touches.length)?T.touches[0]:T;S.original=T;Q.call(this,S)}}else{if(T.changedTouches){var S=T.changedTouches[0];S.original=T;Q.call(this,S)}}},L||false)}J._bind(P,N,Q,L||false);if(I.cantouch&&N=="mouseup"){J._bind(P,"touchcancel",Q,L||false)}}else{J._bind(P,N,function(S){S=S||window.event||false;if(S){if(S.srcElement){S.target=S.srcElement}}if(!("pageY" in S)){S.pageX=S.clientX+document.documentElement.scrollLeft;S.pageY=S.clientY+document.documentElement.scrollTop}return((Q.call(P,S)===false)||L===false)?J.cancelEvent(S):true})}}};if(I.haseventlistener){this._bind=function(O,M,N,L){J.events.push({e:O,n:M,f:N,b:L,q:false});O.addEventListener(M,N,L||false)};this.cancelEvent=function(L){if(!L){return false}var L=(L.original)?L.original:L;L.preventDefault();L.stopPropagation();if(L.preventManipulation){L.preventManipulation()}return false};this.stopPropagation=function(L){if(!L){return false}var L=(L.original)?L.original:L;L.stopPropagation();return false};this._unbind=function(N,L,M,O){N.removeEventListener(L,M,O)}}else{this._bind=function(O,M,N,L){J.events.push({e:O,n:M,f:N,b:L,q:false});if(O.attachEvent){O.attachEvent("on"+M,N)}else{O["on"+M]=N}};this.cancelEvent=function(L){var L=window.event||false;if(!L){return false}L.cancelBubble=true;L.cancel=true;L.returnValue=false;return false};this.stopPropagation=function(L){var L=window.event||false;if(!L){return false}L.cancelBubble=true;return false};this._unbind=function(N,L,M,O){if(N.detachEvent){N.detachEvent("on"+L,M)}else{N["on"+L]=false}}}this.unbindAll=function(){for(var L=0;L<J.events.length;L++){var M=J.events[L];(M.q)?M.e.unbind(M.n,M.f):J._unbind(M.e,M.n,M.f,M.b)}};this.showRail=function(){if((J.page.maxh!=0)&&(J.ispage||J.win.css("display")!="none")){J.visibility=true;J.rail.visibility=true;J.rail.css("display","block")}return J};this.showRailHr=function(){if(!J.railh){return J}if((J.page.maxw!=0)&&(J.ispage||J.win.css("display")!="none")){J.railh.visibility=true;J.railh.css("display","block")}return J};this.hideRail=function(){J.visibility=false;J.rail.visibility=false;J.rail.css("display","none");return J};this.hideRailHr=function(){if(!J.railh){return J}J.railh.visibility=false;J.railh.css("display","none");return J};this.show=function(){J.hidden=false;J.railslocked=false;return J.showRail().showRailHr()};this.hide=function(){J.hidden=true;J.railslocked=true;return J.hideRail().hideRailHr()};this.toggle=function(){return(J.hidden)?J.show():J.hide()};this.remove=function(){J.stop();if(J.cursortimeout){clearTimeout(J.cursortimeout)}if(J.debouncedelayed){clearTimeout(J.debouncedelayed)}J.doZoomOut();J.unbindAll();if(I.isie9){J.win[0].detachEvent("onpropertychange",J.onAttributeChange)}if(J.observer!==false){J.observer.disconnect()}if(J.observerremover!==false){J.observerremover.disconnect()}if(J.observerbody!==false){J.observerbody.disconnect()}J.events=null;if(J.cursor){J.cursor.remove()}if(J.cursorh){J.cursorh.remove()}if(J.rail){J.rail.remove()}if(J.railh){J.railh.remove()}if(J.zoom){J.zoom.remove()}for(var M=0;M<J.saved.css.length;M++){var O=J.saved.css[M];O[0].css(O[1],(typeof O[2]=="undefined")?"":O[2])}J.saved=false;J.me.data("__nicescroll","");var L=e.nicescroll;L.each(function(Q){if(!this){return}if(this.id===J.id){delete L[Q];for(var P=++Q;P<L.length;P++,Q++){L[Q]=L[P]}L.length--;if(L.length){delete L[L.length]}}});for(var N in J){J[N]=null;delete J[N]}J=null};this.scrollstart=function(L){this.onscrollstart=L;return J};this.scrollend=function(L){this.onscrollend=L;return J};this.scrollcancel=function(L){this.onscrollcancel=L;return J};this.zoomin=function(L){this.onzoomin=L;return J};this.zoomout=function(L){this.onzoomout=L;return J};this.isScrollable=function(N){var O=(N.target)?N.target:N;if(O.nodeName=="OPTION"){return true}while(O&&(O.nodeType==1)&&!(/^BODY|HTML/.test(O.nodeName))){var L=e(O);var M=L.css("overflowY")||L.css("overflowX")||L.css("overflow")||"";if(/scroll|auto/.test(M)){return(O.clientHeight!=O.scrollHeight)}O=(O.parentNode)?O.parentNode:false}return false};this.getViewport=function(N){var O=(N&&N.parentNode)?N.parentNode:false;while(O&&(O.nodeType==1)&&!(/^BODY|HTML/.test(O.nodeName))){var L=e(O);if(/fixed|absolute/.test(L.css("position"))){return L}var M=L.css("overflowY")||L.css("overflowX")||L.css("overflow")||"";if((/scroll|auto/.test(M))&&(O.clientHeight!=O.scrollHeight)){return L}if(L.getNiceScroll().length>0){return L}O=(O.parentNode)?O.parentNode:false}return false};this.triggerScrollEnd=function(){if(!J.onscrollend){return}var M=J.getScrollLeft();var L=J.getScrollTop();var N={type:"scrollend",current:{x:M,y:L},end:{x:M,y:L}};J.onscrollend.call(J,N)};function C(Q,N,P){var M,L;if(Q.deltaMode==0){M=-Math.floor(Q.deltaX*(J.opt.mousescrollstep/(18*3)));L=-Math.floor(Q.deltaY*(J.opt.mousescrollstep/(18*3)))}else{if(Q.deltaMode==1){M=-Math.floor(Q.deltaX*J.opt.mousescrollstep);L=-Math.floor(Q.deltaY*J.opt.mousescrollstep)}}if(N&&J.opt.oneaxismousemode&&(M==0)&&L){M=L;L=0;if(P){var O=(M<0)?(J.getScrollLeft()>=J.page.maxw):(J.getScrollLeft()<=0);if(O){L=M;M=0}}}if(M){if(J.scrollmom){J.scrollmom.stop()}J.lastdeltax+=M;J.debounced("mousewheelx",function(){var R=J.lastdeltax;J.lastdeltax=0;if(!J.rail.drag){J.doScrollLeftBy(R)}},15)}if(L){if(J.opt.nativeparentscrolling&&P&&!J.ispage&&!J.zoomactive){if(L<0){if(J.getScrollTop()>=J.page.maxh){return true}}else{if(J.getScrollTop()<=0){return true}}}if(J.scrollmom){J.scrollmom.stop()}J.lastdeltay+=L;J.debounced("mousewheely",function(){var R=J.lastdeltay;J.lastdeltay=0;if(!J.rail.drag){J.doScrollBy(R)}},15)}Q.stopImmediatePropagation();return Q.preventDefault()}this.onmousewheel=function(O){if(J.wheelprevented){return}if(J.railslocked){J.debounced("checkunlock",J.resize,250);return true}if(J.rail.drag){return J.cancelEvent(O)}if(J.opt.oneaxismousemode=="auto"&&O.deltaX!=0){J.opt.oneaxismousemode=false}if(J.opt.oneaxismousemode&&O.deltaX==0){if(!J.rail.scrollable){if(J.railh&&J.railh.scrollable){return J.onmousewheelhr(O)}else{return true}}}var M=+(new Date());var L=false;if(J.opt.preservenativescrolling&&((J.checkarea+600)<M)){J.nativescrollingarea=J.isScrollable(O);L=true}J.checkarea=M;if(J.nativescrollingarea){return true}var N=C(O,false,L);if(N){J.checkarea=0}return N};this.onmousewheelhr=function(N){if(J.wheelprevented){return}if(J.railslocked||!J.railh.scrollable){return true}if(J.rail.drag){return J.cancelEvent(N)}var M=+(new Date());var L=false;if(J.opt.preservenativescrolling&&((J.checkarea+600)<M)){J.nativescrollingarea=J.isScrollable(N);L=true}J.checkarea=M;if(J.nativescrollingarea){return true}if(J.railslocked){return J.cancelEvent(N)}return C(N,true,L)};this.stop=function(){J.cancelScroll();if(J.scrollmon){J.scrollmon.stop()}J.cursorfreezed=false;J.scroll.y=Math.round(J.getScrollTop()*(1/J.scrollratio.y));J.noticeCursor();return J};this.getTransitionSpeed=function(M){var N=Math.round(J.opt.scrollspeed*10);var L=Math.min(N,Math.round((M/20)*J.opt.scrollspeed));return(L>20)?L:0};if(!J.opt.smoothscroll){this.doScrollLeft=function(L,M){var N=J.getScrollTop();J.doScrollPos(L,N,M)};this.doScrollTop=function(N,M){var L=J.getScrollLeft();J.doScrollPos(L,N,M)};this.doScrollPos=function(M,P,N){var L=(M>J.page.maxw)?J.page.maxw:M;if(L<0){L=0}var O=(P>J.page.maxh)?J.page.maxh:P;if(O<0){O=0}J.synched("scroll",function(){J.setScrollTop(O);J.setScrollLeft(L)})};this.cancelScroll=function(){}}else{if(J.ishwscroll&&I.hastransition&&J.opt.usetransition&&!!J.opt.smoothscroll){this.prepareTransition=function(O,L){var N=(L)?((O>20)?O:0):J.getTransitionSpeed(O);var M=(N)?I.prefixstyle+"transform "+N+"ms ease-out":"";if(!J.lasttransitionstyle||J.lasttransitionstyle!=M){J.lasttransitionstyle=M;J.doc.css(I.transitionstyle,M)}return N};this.doScrollLeft=function(L,M){var N=(J.scrollrunning)?J.newscrolly:J.getScrollTop();J.doScrollPos(L,N,M)};this.doScrollTop=function(N,M){var L=(J.scrollrunning)?J.newscrollx:J.getScrollLeft();J.doScrollPos(L,N,M)};this.doScrollPos=function(L,P,O){var M=J.getScrollTop();var N=J.getScrollLeft();if(((J.newscrolly-M)*(P-M)<0)||((J.newscrollx-N)*(L-N)<0)){J.cancelScroll()}if(J.opt.bouncescroll==false){if(P<0){P=0}else{if(P>J.page.maxh){P=J.page.maxh}}if(L<0){L=0}else{if(L>J.page.maxw){L=J.page.maxw}}}if(J.scrollrunning&&L==J.newscrollx&&P==J.newscrolly){return false}J.newscrolly=P;J.newscrollx=L;J.newscrollspeed=O||false;if(J.timer){return false}J.timer=setTimeout(function(){var W=J.getScrollTop();var U=J.getScrollLeft();var X={};X.x=L-U;X.y=P-W;X.px=U;X.py=W;var Q=Math.round(Math.sqrt(Math.pow(X.x,2)+Math.pow(X.y,2)));var S=(J.newscrollspeed&&J.newscrollspeed>1)?J.newscrollspeed:J.getTransitionSpeed(Q);if(J.newscrollspeed&&J.newscrollspeed<=1){S*=J.newscrollspeed}J.prepareTransition(S,true);if(J.timerscroll&&J.timerscroll.tm){clearInterval(J.timerscroll.tm)}if(S>0){if(!J.scrollrunning&&J.onscrollstart){var V={type:"scrollstart",current:{x:U,y:W},request:{x:L,y:P},end:{x:J.newscrollx,y:J.newscrolly},speed:S};J.onscrollstart.call(J,V)}if(I.transitionend){if(!J.scrollendtrapped){J.scrollendtrapped=true;J.bind(J.doc,I.transitionend,J.onScrollTransitionEnd,false)}}else{if(J.scrollendtrapped){clearTimeout(J.scrollendtrapped)}J.scrollendtrapped=setTimeout(J.onScrollTransitionEnd,S)}var R=W;var T=U;J.timerscroll={bz:new z(R,J.newscrolly,S,0,0,0.58,1),bh:new z(T,J.newscrollx,S,0,0,0.58,1)};if(!J.cursorfreezed){J.timerscroll.tm=setInterval(function(){J.showCursor(J.getScrollTop(),J.getScrollLeft())},60)}}J.synched("doScroll-set",function(){J.timer=0;if(J.scrollendtrapped){J.scrollrunning=true}J.setScrollTop(J.newscrolly);J.setScrollLeft(J.newscrollx);if(!J.scrollendtrapped){J.onScrollTransitionEnd()}})},50)};this.cancelScroll=function(){if(!J.scrollendtrapped){return true}var L=J.getScrollTop();var M=J.getScrollLeft();J.scrollrunning=false;if(!I.transitionend){clearTimeout(I.transitionend)}J.scrollendtrapped=false;J._unbind(J.doc[0],I.transitionend,J.onScrollTransitionEnd);J.prepareTransition(0);J.setScrollTop(L);if(J.railh){J.setScrollLeft(M)}if(J.timerscroll&&J.timerscroll.tm){clearInterval(J.timerscroll.tm)}J.timerscroll=false;J.cursorfreezed=false;J.showCursor(L,M);return J};this.onScrollTransitionEnd=function(){if(J.scrollendtrapped){J._unbind(J.doc[0],I.transitionend,J.onScrollTransitionEnd)}J.scrollendtrapped=false;J.prepareTransition(0);if(J.timerscroll&&J.timerscroll.tm){clearInterval(J.timerscroll.tm)}J.timerscroll=false;var L=J.getScrollTop();var M=J.getScrollLeft();J.setScrollTop(L);if(J.railh){J.setScrollLeft(M)}J.noticeCursor(false,L,M);J.cursorfreezed=false;if(L<0){L=0}else{if(L>J.page.maxh){L=J.page.maxh}}if(M<0){M=0}else{if(M>J.page.maxw){M=J.page.maxw}}if((L!=J.newscrolly)||(M!=J.newscrollx)){return J.doScrollPos(M,L,J.opt.snapbackspeed)}if(J.onscrollend&&J.scrollrunning){J.triggerScrollEnd()}J.scrollrunning=false}}else{this.doScrollLeft=function(L,M){var N=(J.scrollrunning)?J.newscrolly:J.getScrollTop();J.doScrollPos(L,N,M)};this.doScrollTop=function(N,M){var L=(J.scrollrunning)?J.newscrollx:J.getScrollLeft();J.doScrollPos(L,N,M)};this.doScrollPos=function(U,S,Q){var S=((typeof S=="undefined")||(S===false))?J.getScrollTop(true):S;if((J.timer)&&(J.newscrolly==S)&&(J.newscrollx==U)){return true}if(J.timer){h(J.timer)}J.timer=0;var T=J.getScrollTop();var W=J.getScrollLeft();if(((J.newscrolly-T)*(S-T)<0)||((J.newscrollx-W)*(U-W)<0)){J.cancelScroll()}J.newscrolly=S;J.newscrollx=U;if(!J.bouncescroll||!J.rail.visibility){if(J.newscrolly<0){J.newscrolly=0}else{if(J.newscrolly>J.page.maxh){J.newscrolly=J.page.maxh}}}if(!J.bouncescroll||!J.railh.visibility){if(J.newscrollx<0){J.newscrollx=0}else{if(J.newscrollx>J.page.maxw){J.newscrollx=J.page.maxw}}}J.dst={};J.dst.x=U-W;J.dst.y=S-T;J.dst.px=W;J.dst.py=T;var P=Math.round(Math.sqrt(Math.pow(J.dst.x,2)+Math.pow(J.dst.y,2)));J.dst.ax=J.dst.x/P;J.dst.ay=J.dst.y/P;var V=0;var O=P;if(J.dst.x==0){V=T;O=S;J.dst.ay=1;J.dst.py=0}else{if(J.dst.y==0){V=W;O=U;J.dst.ax=1;J.dst.px=0}}var L=J.getTransitionSpeed(P);if(Q&&Q<=1){L*=Q}if(L>0){J.bzscroll=(J.bzscroll)?J.bzscroll.update(O,L):new z(V,O,L,0,1,0,1)}else{J.bzscroll=false}if(J.timer){return}if((T==J.page.maxh&&S>=J.page.maxh)||(W==J.page.maxw&&U>=J.page.maxw)){J.checkContentSize()}var R=1;function N(){if(J.cancelAnimationFrame){return true}J.scrollrunning=true;R=1-R;if(R){return(J.timer=g(N)||1)}var X=0;var ac,ab;var aa=ab=J.getScrollTop();if(J.dst.ay){aa=(J.bzscroll)?J.dst.py+(J.bzscroll.getNow()*J.dst.ay):J.newscrolly;var Z=aa-ab;if((Z<0&&aa<J.newscrolly)||(Z>0&&aa>J.newscrolly)){aa=J.newscrolly}J.setScrollTop(aa);if(aa==J.newscrolly){X=1}}else{X=1}var Y=ac=J.getScrollLeft();if(J.dst.ax){Y=(J.bzscroll)?J.dst.px+(J.bzscroll.getNow()*J.dst.ax):J.newscrollx;var Z=Y-ac;if((Z<0&&Y<J.newscrollx)||(Z>0&&Y>J.newscrollx)){Y=J.newscrollx}J.setScrollLeft(Y);if(Y==J.newscrollx){X+=1}}else{X+=1}if(X==2){J.timer=0;J.cursorfreezed=false;J.bzscroll=false;J.scrollrunning=false;if(aa<0){aa=0}else{if(aa>J.page.maxh){aa=J.page.maxh}}if(Y<0){Y=0}else{if(Y>J.page.maxw){Y=J.page.maxw}}if((Y!=J.newscrollx)||(aa!=J.newscrolly)){J.doScrollPos(Y,aa)}else{if(J.onscrollend){J.triggerScrollEnd()}}}else{J.timer=g(N)||1}}J.cancelAnimationFrame=false;J.timer=1;if(J.onscrollstart&&!J.scrollrunning){var M={type:"scrollstart",current:{x:W,y:T},request:{x:U,y:S},end:{x:J.newscrollx,y:J.newscrolly},speed:L};J.onscrollstart.call(J,M)}N();if((T==J.page.maxh&&S>=T)||(W==J.page.maxw&&U>=W)){J.checkContentSize()}J.noticeCursor()};this.cancelScroll=function(){if(J.timer){h(J.timer)}J.timer=0;J.bzscroll=false;J.scrollrunning=false;return J}}}this.doScrollBy=function(L,O){var Q=0;if(O){Q=Math.floor((J.scroll.y-L)*J.scrollratio.y)}else{var P=(J.timer)?J.newscrolly:J.getScrollTop(true);Q=P-L}if(J.bouncescroll){var N=Math.round(J.view.h/2);if(Q<-N){Q=-N}else{if(Q>(J.page.maxh+N)){Q=(J.page.maxh+N)}}}J.cursorfreezed=false;var M=J.getScrollTop(true);if(Q<0&&M<=0){return J.noticeCursor()}else{if(Q>J.page.maxh&&M>=J.page.maxh){J.checkContentSize();return J.noticeCursor()}}J.doScrollTop(Q)};this.doScrollLeftBy=function(M,P){var L=0;if(P){L=Math.floor((J.scroll.x-M)*J.scrollratio.x)}else{var Q=(J.timer)?J.newscrollx:J.getScrollLeft(true);L=Q-M}if(J.bouncescroll){var O=Math.round(J.view.w/2);if(L<-O){L=-O}else{if(L>(J.page.maxw+O)){L=(J.page.maxw+O)}}}J.cursorfreezed=false;var N=J.getScrollLeft(true);if(L<0&&N<=0){return J.noticeCursor()}else{if(L>J.page.maxw&&N>=J.page.maxw){return J.noticeCursor()}}J.doScrollLeft(L)};this.doScrollTo=function(N,L){var M=(L)?Math.round(N*J.scrollratio.y):N;if(M<0){M=0}else{if(M>J.page.maxh){M=J.page.maxh}}J.cursorfreezed=false;J.doScrollTop(N)};this.checkContentSize=function(){var L=J.getContentSize();if((L.h!=J.page.h)||(L.w!=J.page.w)){J.resize(false,L)}};J.onscroll=function(L){if(J.rail.drag){return}if(!J.cursorfreezed){J.synched("scroll",function(){J.scroll.y=Math.round(J.getScrollTop()*(1/J.scrollratio.y));if(J.railh){J.scroll.x=Math.round(J.getScrollLeft()*(1/J.scrollratio.x))}J.noticeCursor()})}};J.bind(J.docscroll,"scroll",J.onscroll);this.doZoomIn=function(Q){if(J.zoomactive){return}J.zoomactive=true;J.zoomrestore={style:{}};var L=["position","top","left","zIndex","backgroundColor","marginTop","marginBottom","marginLeft","marginRight"];var P=J.win[0].style;for(var N in L){var M=L[N];J.zoomrestore.style[M]=(typeof P[M]!="undefined")?P[M]:""}J.zoomrestore.style.width=J.win.css("width");J.zoomrestore.style.height=J.win.css("height");J.zoomrestore.padding={w:J.win.outerWidth()-J.win.width(),h:J.win.outerHeight()-J.win.height()};if(I.isios4){J.zoomrestore.scrollTop=e(window).scrollTop();e(window).scrollTop(0)}J.win.css({position:(I.isios4)?"absolute":"fixed",top:0,left:0,"z-index":d+100,margin:"0px"});var O=J.win.css("backgroundColor");if(O==""||/transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(O)){J.win.css("backgroundColor","#fff")}J.rail.css({"z-index":d+101});J.zoom.css({"z-index":d+102});J.zoom.css("backgroundPosition","0px -18px");J.resizeZoom();if(J.onzoomin){J.onzoomin.call(J)}return J.cancelEvent(Q)};this.doZoomOut=function(L){if(!J.zoomactive){return}J.zoomactive=false;J.win.css("margin","");J.win.css(J.zoomrestore.style);if(I.isios4){e(window).scrollTop(J.zoomrestore.scrollTop)}J.rail.css({"z-index":J.zindex});J.zoom.css({"z-index":J.zindex});J.zoomrestore=false;J.zoom.css("backgroundPosition","0px 0px");J.onResize();if(J.onzoomout){J.onzoomout.call(J)}return J.cancelEvent(L)};this.doZoom=function(L){return(J.zoomactive)?J.doZoomOut(L):J.doZoomIn(L)};this.resizeZoom=function(){if(!J.zoomactive){return}var L=J.getScrollTop();J.win.css({width:e(window).width()-J.zoomrestore.padding.w+"px",height:e(window).height()-J.zoomrestore.padding.h+"px"});J.onResize();J.setScrollTop(Math.min(J.page.maxh,L))};this.init();e.nicescroll.push(this)};var r=function(y){var v=this;this.nc=y;this.lastx=0;this.lasty=0;this.speedx=0;this.speedy=0;this.lasttime=0;this.steptime=0;this.snapx=false;this.snapy=false;this.demulx=0;this.demuly=0;this.lastscrollx=-1;this.lastscrolly=-1;this.chkx=0;this.chky=0;this.timer=0;this.time=function(){return +new Date()};this.reset=function(B,A){v.stop();var z=v.time();v.steptime=0;v.lasttime=z;v.speedx=0;v.speedy=0;v.lastx=B;v.lasty=A;v.lastscrollx=-1;v.lastscrolly=-1};this.update=function(F,E){var z=v.time();v.steptime=z-v.lasttime;v.lasttime=z;var G=E-v.lasty;var H=F-v.lastx;var C=v.nc.getScrollTop();var D=v.nc.getScrollLeft();var A=C+G;var B=D+H;v.snapx=(B<0)||(B>v.nc.page.maxw);v.snapy=(A<0)||(A>v.nc.page.maxh);v.speedx=H;v.speedy=G;v.lastx=F;v.lasty=E};this.stop=function(){v.nc.unsynched("domomentum2d");if(v.timer){clearTimeout(v.timer)}v.timer=0;v.lastscrollx=-1;v.lastscrolly=-1};this.doSnapy=function(A,B){var z=false;if(B<0){B=0;z=true}else{if(B>v.nc.page.maxh){B=v.nc.page.maxh;z=true}}if(A<0){A=0;z=true}else{if(A>v.nc.page.maxw){A=v.nc.page.maxw;z=true}}(z)?v.nc.doScrollPos(A,B,v.nc.opt.snapbackspeed):v.nc.triggerScrollEnd()};this.doMomentum=function(A){var M=v.time();var B=(A)?M+A:v.lasttime;var C=v.nc.getScrollLeft();var N=v.nc.getScrollTop();var I=v.nc.page.maxh;var z=v.nc.page.maxw;v.speedx=(z>0)?Math.min(60,v.speedx):0;v.speedy=(I>0)?Math.min(60,v.speedy):0;var H=B&&(M-B)<=60;if((N<0)||(N>I)||(C<0)||(C>z)){H=false}var J=(v.speedy&&H)?v.speedy:false;var K=(v.speedx&&H)?v.speedx:false;if(J||K){var L=Math.max(16,v.steptime);if(L>50){var F=L/50;v.speedx*=F;v.speedy*=F;L=50}v.demulxy=0;v.lastscrollx=v.nc.getScrollLeft();v.chkx=v.lastscrollx;v.lastscrolly=v.nc.getScrollTop();v.chky=v.lastscrolly;var E=v.lastscrollx;var D=v.lastscrolly;var G=function(){var O=((v.time()-M)>600)?0.04:0.02;if(v.speedx){E=Math.floor(v.lastscrollx-(v.speedx*(1-v.demulxy)));v.lastscrollx=E;if((E<0)||(E>z)){O=0.1}}if(v.speedy){D=Math.floor(v.lastscrolly-(v.speedy*(1-v.demulxy)));v.lastscrolly=D;if((D<0)||(D>I)){O=0.1}}v.demulxy=Math.min(1,v.demulxy+O);v.nc.synched("domomentum2d",function(){if(v.speedx){var Q=v.nc.getScrollLeft();if(Q!=v.chkx){v.stop()}v.chkx=E;v.nc.setScrollLeft(E)}if(v.speedy){var P=v.nc.getScrollTop();if(P!=v.chky){v.stop()}v.chky=D;v.nc.setScrollTop(D)}if(!v.timer){v.nc.hideCursor();v.doSnapy(E,D)}});if(v.demulxy<1){v.timer=setTimeout(G,L)}else{v.stop();v.nc.hideCursor();v.doSnapy(E,D)}};G()}else{v.doSnapy(v.nc.getScrollLeft(),v.nc.getScrollTop())}}};var l=m.fn.scrollTop;m.cssHooks.pageYOffset={get:function(A,z,v){var y=e.data(A,"__nicescroll")||false;return(y&&y.ishwscroll)?y.getScrollTop():l.call(A)},set:function(y,z){var v=e.data(y,"__nicescroll")||false;(v&&v.ishwscroll)?v.setScrollTop(parseInt(z)):l.call(y,z);return this}};m.fn.scrollTop=function(y){if(typeof y=="undefined"){var v=(this[0])?e.data(this[0],"__nicescroll")||false:false;return(v&&v.ishwscroll)?v.getScrollTop():l.call(this)}else{return this.each(function(){var z=e.data(this,"__nicescroll")||false;(z&&z.ishwscroll)?z.setScrollTop(parseInt(y)):l.call(e(this),y)})}};var q=m.fn.scrollLeft;e.cssHooks.pageXOffset={get:function(A,z,v){var y=e.data(A,"__nicescroll")||false;return(y&&y.ishwscroll)?y.getScrollLeft():q.call(A)},set:function(y,z){var v=e.data(y,"__nicescroll")||false;(v&&v.ishwscroll)?v.setScrollLeft(parseInt(z)):q.call(y,z);return this}};m.fn.scrollLeft=function(y){if(typeof y=="undefined"){var v=(this[0])?e.data(this[0],"__nicescroll")||false:false;return(v&&v.ishwscroll)?v.getScrollLeft():q.call(this)}else{return this.each(function(){var z=e.data(this,"__nicescroll")||false;(z&&z.ishwscroll)?z.setScrollLeft(parseInt(y)):q.call(e(this),y)})}};var x=function(A){var y=this;this.length=0;this.name="nicescrollarray";this.each=function(D){for(var B=0,C=0;B<y.length;B++){D.call(y[B],C++)}return y};this.push=function(B){y[y.length]=B;y.length++};this.eq=function(B){return y[B]};if(A){for(var v=0;v<A.length;v++){var z=e.data(A[v],"__nicescroll")||false;if(z){this[this.length]=z;this.length++}}}return this};function o(A,v,z){for(var y=0;y<v.length;y++){z(A,v[y])}}o(x.prototype,["show","hide","toggle","onResize","resize","remove","stop","doScrollPos"],function(v,y){v[y]=function(){var z=arguments;return this.each(function(){this[y].apply(this,z)})}});m.fn.getNiceScroll=function(v){if(typeof v=="undefined"){return new x(this)}else{var y=this[v]&&e.data(this[v],"__nicescroll")||false;return y}};m.extend(m.expr[":"],{nicescroll:function(v){return(e.data(v,"__nicescroll"))?true:false}});e.fn.niceScroll=function(A,y){if(typeof y=="undefined"){if((typeof A=="object")&&!("jquery" in A)){y=A;A=false}}y=e.extend({},y);var v=new x();if(typeof y=="undefined"){y={}}if(A||false){y.doc=e(A);y.win=e(this)}var z=!("doc" in y);if(!z&&!("win" in y)){y.win=e(this)}this.each(function(){var B=e(this).data("__nicescroll")||false;if(!B){y.doc=(z)?e(this):y.doc;B=new b(y,e(this));e(this).data("__nicescroll",B)}v.push(B)});return(v.length==1)?v[0]:v};window.NiceScroll={getjQuery:function(){return m}};if(!e.nicescroll){e.nicescroll=new x();e.nicescroll.options=c}}));

/*!common/components/push/socket.io.js*/
;(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define('common/components/push/socket.io', [],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.io = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var url = _dereq_('url');
var parser = _dereq_('socket.io-parser');
var Manager = _dereq_('manager');
var debug = _dereq_('debug')('socket.io-client');

/**
 * Module exports.
 */

module.exports = exports = lookup;

/**
 * Managers cache.
 */

var cache = exports.managers = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('../../localhost/a');`
 *   `io('../../localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function lookup(uri, opts) {
  if (typeof uri == 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url(uri);
  var source = parsed.source;
  var id = parsed.id;
  var path = parsed.path;
  var sameNamespace = cache[id] && path in cache[id].nsps;
  var newConnection = opts.forceNew || opts['force new connection'] ||
                      false === opts.multiplex || sameNamespace;

  var io;

  if (newConnection) {
    debug('ignoring socket cache for %s', source);
    io = Manager(source, opts);
  } else {
    if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = Manager(source, opts);
    }
    io = cache[id];
  }

  return io.socket(parsed.path);
}

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = parser.protocol;

/**
 * `connect`.
 *
 * @param {String} uri
 * @api public
 */

exports.connect = lookup;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

exports.Manager = _dereq_('manager');
exports.Socket = _dereq_('socket');

},{"manager":2,"socket":4,"url":5,"debug":14,"socket.io-parser":41}],2:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var eio = _dereq_('engine.io-client');
var Socket = _dereq_('socket');
var Emitter = _dereq_('component-emitter');
var parser = _dereq_('socket.io-parser');
var on = _dereq_('on');
var bind = _dereq_('component-bind');
var debug = _dereq_('debug')('socket.io-client:manager');
var indexOf = _dereq_('indexof');
var Backoff = _dereq_('backo2');

/**
 * IE6+ hasOwnProperty
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Module exports
 */

module.exports = Manager;

/**
 * `Manager` constructor.
 *
 * @param {String} engine instance or engine uri/opts
 * @param {Object} options
 * @api public
 */

function Manager(uri, opts){
  if (!(this instanceof Manager)) return new Manager(uri, opts);
  if (uri && ('object' == typeof uri)) {
    opts = uri;
    uri = undefined;
  }
  opts = opts || {};

  opts.path = opts.path || '../socket.io';
  this.nsps = {};
  this.subs = [];
  this.opts = opts;
  this.reconnection(opts.reconnection !== false);
  this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
  this.reconnectionDelay(opts.reconnectionDelay || 1000);
  this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
  this.randomizationFactor(opts.randomizationFactor || 0.5);
  this.backoff = new Backoff({
    min: this.reconnectionDelay(),
    max: this.reconnectionDelayMax(),
    jitter: this.randomizationFactor()
  });
  this.timeout(null == opts.timeout ? 20000 : opts.timeout);
  this.readyState = 'closed';
  this.uri = uri;
  this.connecting = [];
  this.lastPing = null;
  this.encoding = false;
  this.packetBuffer = [];
  this.encoder = new parser.Encoder();
  this.decoder = new parser.Decoder();
  this.autoConnect = opts.autoConnect !== false;
  if (this.autoConnect) this.open();
}

/**
 * Propagate given event to sockets and emit on `this`
 *
 * @api private
 */

Manager.prototype.emitAll = function() {
  this.emit.apply(this, arguments);
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
    }
  }
};

/**
 * Update `socket.id` of all sockets
 *
 * @api private
 */

Manager.prototype.updateSocketIds = function(){
  for (var nsp in this.nsps) {
    if (has.call(this.nsps, nsp)) {
      this.nsps[nsp].id = this.engine.id;
    }
  }
};

/**
 * Mix in `Emitter`.
 */

Emitter(Manager.prototype);

/**
 * Sets the `reconnection` config.
 *
 * @param {Boolean} true/false if it should automatically reconnect
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnection = function(v){
  if (!arguments.length) return this._reconnection;
  this._reconnection = !!v;
  return this;
};

/**
 * Sets the reconnection attempts config.
 *
 * @param {Number} max reconnection attempts before giving up
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionAttempts = function(v){
  if (!arguments.length) return this._reconnectionAttempts;
  this._reconnectionAttempts = v;
  return this;
};

/**
 * Sets the delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelay = function(v){
  if (!arguments.length) return this._reconnectionDelay;
  this._reconnectionDelay = v;
  this.backoff && this.backoff.setMin(v);
  return this;
};

Manager.prototype.randomizationFactor = function(v){
  if (!arguments.length) return this._randomizationFactor;
  this._randomizationFactor = v;
  this.backoff && this.backoff.setJitter(v);
  return this;
};

/**
 * Sets the maximum delay between reconnections.
 *
 * @param {Number} delay
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.reconnectionDelayMax = function(v){
  if (!arguments.length) return this._reconnectionDelayMax;
  this._reconnectionDelayMax = v;
  this.backoff && this.backoff.setMax(v);
  return this;
};

/**
 * Sets the connection timeout. `false` to disable
 *
 * @return {Manager} self or value
 * @api public
 */

Manager.prototype.timeout = function(v){
  if (!arguments.length) return this._timeout;
  this._timeout = v;
  return this;
};

/**
 * Starts trying to reconnect if reconnection is enabled and we have not
 * started reconnecting yet
 *
 * @api private
 */

Manager.prototype.maybeReconnectOnOpen = function() {
  // Only try to reconnect if it's the first time we're connecting
  if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
    // keeps reconnection from firing twice for the same reconnection loop
    this.reconnect();
  }
};


/**
 * Sets the current transport `socket`.
 *
 * @param {Function} optional, callback
 * @return {Manager} self
 * @api public
 */

Manager.prototype.open =
Manager.prototype.connect = function(fn){
  debug('readyState %s', this.readyState);
  if (~this.readyState.indexOf('open')) return this;

  debug('opening %s', this.uri);
  this.engine = eio(this.uri, this.opts);
  var socket = this.engine;
  var self = this;
  this.readyState = 'opening';
  this.skipReconnect = false;

  // emit `open`
  var openSub = on(socket, 'open', function() {
    self.onopen();
    fn && fn();
  });

  // emit `connect_error`
  var errorSub = on(socket, 'error', function(data){
    debug('connect_error');
    self.cleanup();
    self.readyState = 'closed';
    self.emitAll('connect_error', data);
    if (fn) {
      var err = new Error('Connection error');
      err.data = data;
      fn(err);
    } else {
      // Only do this if there is no fn to handle the error
      self.maybeReconnectOnOpen();
    }
  });

  // emit `connect_timeout`
  if (false !== this._timeout) {
    var timeout = this._timeout;
    debug('connect attempt will timeout after %d', timeout);

    // set timer
    var timer = setTimeout(function(){
      debug('connect attempt timed out after %d', timeout);
      openSub.destroy();
      socket.close();
      socket.emit('error', 'timeout');
      self.emitAll('connect_timeout', timeout);
    }, timeout);

    this.subs.push({
      destroy: function(){
        clearTimeout(timer);
      }
    });
  }

  this.subs.push(openSub);
  this.subs.push(errorSub);

  return this;
};

/**
 * Called upon transport open.
 *
 * @api private
 */

Manager.prototype.onopen = function(){
  debug('open');

  // clear old subs
  this.cleanup();

  // mark as open
  this.readyState = 'open';
  this.emit('open');

  // add new subs
  var socket = this.engine;
  this.subs.push(on(socket, 'data', bind(this, 'ondata')));
  this.subs.push(on(socket, 'ping', bind(this, 'onping')));
  this.subs.push(on(socket, 'pong', bind(this, 'onpong')));
  this.subs.push(on(socket, 'error', bind(this, 'onerror')));
  this.subs.push(on(socket, 'close', bind(this, 'onclose')));
  this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
};

/**
 * Called upon a ping.
 *
 * @api private
 */

Manager.prototype.onping = function(){
  this.lastPing = new Date;
  this.emitAll('ping');
};

/**
 * Called upon a packet.
 *
 * @api private
 */

Manager.prototype.onpong = function(){
  this.emitAll('pong', new Date - this.lastPing);
};

/**
 * Called with data.
 *
 * @api private
 */

Manager.prototype.ondata = function(data){
  this.decoder.add(data);
};

/**
 * Called when parser fully decodes a packet.
 *
 * @api private
 */

Manager.prototype.ondecoded = function(packet) {
  this.emit('packet', packet);
};

/**
 * Called upon socket error.
 *
 * @api private
 */

Manager.prototype.onerror = function(err){
  debug('error', err);
  this.emitAll('error', err);
};

/**
 * Creates a new socket for the given `nsp`.
 *
 * @return {Socket}
 * @api public
 */

Manager.prototype.socket = function(nsp){
  var socket = this.nsps[nsp];
  if (!socket) {
    socket = new Socket(this, nsp);
    this.nsps[nsp] = socket;
    var self = this;
    socket.on('connecting', onConnecting);
    socket.on('connect', function(){
      socket.id = self.engine.id;
    });

    if (this.autoConnect) {
      // manually call here since connecting evnet is fired before listening
      onConnecting();
    }
  }

  function onConnecting() {
    if (!~indexOf(self.connecting, socket)) {
      self.connecting.push(socket);
    }
  }

  return socket;
};

/**
 * Called upon a socket close.
 *
 * @param {Socket} socket
 */

Manager.prototype.destroy = function(socket){
  var index = indexOf(this.connecting, socket);
  if (~index) this.connecting.splice(index, 1);
  if (this.connecting.length) return;

  this.close();
};

/**
 * Writes a packet.
 *
 * @param {Object} packet
 * @api private
 */

Manager.prototype.packet = function(packet){
  debug('writing packet %j', packet);
  var self = this;

  if (!self.encoding) {
    // encode, then write to engine with result
    self.encoding = true;
    this.encoder.encode(packet, function(encodedPackets) {
      for (var i = 0; i < encodedPackets.length; i++) {
        self.engine.write(encodedPackets[i], packet.options);
      }
      self.encoding = false;
      self.processPacketQueue();
    });
  } else { // add packet to the queue
    self.packetBuffer.push(packet);
  }
};

/**
 * If packet buffer is non-empty, begins encoding the
 * next packet in line.
 *
 * @api private
 */

Manager.prototype.processPacketQueue = function() {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var pack = this.packetBuffer.shift();
    this.packet(pack);
  }
};

/**
 * Clean up transport subscriptions and packet buffer.
 *
 * @api private
 */

Manager.prototype.cleanup = function(){
  debug('cleanup');

  var sub;
  while (sub = this.subs.shift()) sub.destroy();

  this.packetBuffer = [];
  this.encoding = false;
  this.lastPing = null;

  this.decoder.destroy();
};

/**
 * Close the current socket.
 *
 * @api private
 */

Manager.prototype.close =
Manager.prototype.disconnect = function(){
  debug('disconnect');
  this.skipReconnect = true;
  this.reconnecting = false;
  if ('opening' == this.readyState) {
    // `onclose` will not fire because
    // an open event never happened
    this.cleanup();
  }
  this.backoff.reset();
  this.readyState = 'closed';
  if (this.engine) this.engine.close();
};

/**
 * Called upon engine close.
 *
 * @api private
 */

Manager.prototype.onclose = function(reason){
  debug('onclose');

  this.cleanup();
  this.backoff.reset();
  this.readyState = 'closed';
  this.emit('close', reason);

  if (this._reconnection && !this.skipReconnect) {
    this.reconnect();
  }
};

/**
 * Attempt a reconnection.
 *
 * @api private
 */

Manager.prototype.reconnect = function(){
  if (this.reconnecting || this.skipReconnect) return this;

  var self = this;

  if (this.backoff.attempts >= this._reconnectionAttempts) {
    debug('reconnect failed');
    this.backoff.reset();
    this.emitAll('reconnect_failed');
    this.reconnecting = false;
  } else {
    var delay = this.backoff.duration();
    debug('will wait %dms before reconnect attempt', delay);

    this.reconnecting = true;
    var timer = setTimeout(function(){
      if (self.skipReconnect) return;

      debug('attempting reconnect');
      self.emitAll('reconnect_attempt', self.backoff.attempts);
      self.emitAll('reconnecting', self.backoff.attempts);

      // check again for the case socket closed in above events
      if (self.skipReconnect) return;

      self.open(function(err){
        if (err) {
          debug('reconnect attempt error');
          self.reconnecting = false;
          self.reconnect();
          self.emitAll('reconnect_error', err.data);
        } else {
          debug('reconnect success');
          self.onreconnect();
        }
      });
    }, delay);

    this.subs.push({
      destroy: function(){
        clearTimeout(timer);
      }
    });
  }
};

/**
 * Called upon successful reconnect.
 *
 * @api private
 */

Manager.prototype.onreconnect = function(){
  var attempt = this.backoff.attempts;
  this.reconnecting = false;
  this.backoff.reset();
  this.updateSocketIds();
  this.emitAll('reconnect', attempt);
};

},{"on":3,"socket":4,"backo2":8,"component-bind":11,"component-emitter":12,"debug":14,"engine.io-client":16,"indexof":33,"socket.io-parser":41}],3:[function(_dereq_,module,exports){

/**
 * Module exports.
 */

module.exports = on;

/**
 * Helper for subscriptions.
 *
 * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
 * @param {String} event name
 * @param {Function} callback
 * @api public
 */

function on(obj, ev, fn) {
  obj.on(ev, fn);
  return {
    destroy: function(){
      obj.removeListener(ev, fn);
    }
  };
}

},{}],4:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var parser = _dereq_('socket.io-parser');
var Emitter = _dereq_('component-emitter');
var toArray = _dereq_('to-array');
var on = _dereq_('on');
var bind = _dereq_('component-bind');
var debug = _dereq_('debug')('socket.io-client:socket');
var hasBin = _dereq_('has-binary');

/**
 * Module exports.
 */

module.exports = exports = Socket;

/**
 * Internal events (blacklisted).
 * These events can't be emitted by the user.
 *
 * @api private
 */

var events = {
  connect: 1,
  connect_error: 1,
  connect_timeout: 1,
  connecting: 1,
  disconnect: 1,
  error: 1,
  reconnect: 1,
  reconnect_attempt: 1,
  reconnect_failed: 1,
  reconnect_error: 1,
  reconnecting: 1,
  ping: 1,
  pong: 1
};

/**
 * Shortcut to `Emitter#emit`.
 */

var emit = Emitter.prototype.emit;

/**
 * `Socket` constructor.
 *
 * @api public
 */

function Socket(io, nsp){
  this.io = io;
  this.nsp = nsp;
  this.json = this; // compat
  this.ids = 0;
  this.acks = {};
  this.receiveBuffer = [];
  this.sendBuffer = [];
  this.connected = false;
  this.disconnected = true;
  if (this.io.autoConnect) this.open();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Subscribe to open, close and packet events
 *
 * @api private
 */

Socket.prototype.subEvents = function() {
  if (this.subs) return;

  var io = this.io;
  this.subs = [
    on(io, 'open', bind(this, 'onopen')),
    on(io, 'packet', bind(this, 'onpacket')),
    on(io, 'close', bind(this, 'onclose'))
  ];
};

/**
 * "Opens" the socket.
 *
 * @api public
 */

Socket.prototype.open =
Socket.prototype.connect = function(){
  if (this.connected) return this;

  this.subEvents();
  this.io.open(); // ensure open
  if ('open' == this.io.readyState) this.onopen();
  this.emit('connecting');
  return this;
};

/**
 * Sends a `message` event.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.send = function(){
  var args = toArray(arguments);
  args.unshift('message');
  this.emit.apply(this, args);
  return this;
};

/**
 * Override `emit`.
 * If the event is in `events`, it's emitted normally.
 *
 * @param {String} event name
 * @return {Socket} self
 * @api public
 */

Socket.prototype.emit = function(ev){
  if (events.hasOwnProperty(ev)) {
    emit.apply(this, arguments);
    return this;
  }

  var args = toArray(arguments);
  var parserType = parser.EVENT; // default
  if (hasBin(args)) { parserType = parser.BINARY_EVENT; } // binary
  var packet = { type: parserType, data: args };

  packet.options = {};
  packet.options.compress = !this.flags || false !== this.flags.compress;

  // event ack callback
  if ('function' == typeof args[args.length - 1]) {
    debug('emitting packet with ack id %d', this.ids);
    this.acks[this.ids] = args.pop();
    packet.id = this.ids++;
  }

  if (this.connected) {
    this.packet(packet);
  } else {
    this.sendBuffer.push(packet);
  }

  delete this.flags;

  return this;
};

/**
 * Sends a packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.packet = function(packet){
  packet.nsp = this.nsp;
  this.io.packet(packet);
};

/**
 * Called upon engine `open`.
 *
 * @api private
 */

Socket.prototype.onopen = function(){
  debug('transport is open - connecting');

  // write connect packet if necessary
  if ('../default.htm' != this.nsp) {
    this.packet({ type: parser.CONNECT });
  }
};

/**
 * Called upon engine `close`.
 *
 * @param {String} reason
 * @api private
 */

Socket.prototype.onclose = function(reason){
  debug('close (%s)', reason);
  this.connected = false;
  this.disconnected = true;
  delete this.id;
  this.emit('disconnect', reason);
};

/**
 * Called with socket packet.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onpacket = function(packet){
  if (packet.nsp != this.nsp) return;

  switch (packet.type) {
    case parser.CONNECT:
      this.onconnect();
      break;

    case parser.EVENT:
      this.onevent(packet);
      break;

    case parser.BINARY_EVENT:
      this.onevent(packet);
      break;

    case parser.ACK:
      this.onack(packet);
      break;

    case parser.BINARY_ACK:
      this.onack(packet);
      break;

    case parser.DISCONNECT:
      this.ondisconnect();
      break;

    case parser.ERROR:
      this.emit('error', packet.data);
      break;
  }
};

/**
 * Called upon a server event.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onevent = function(packet){
  var args = packet.data || [];
  debug('emitting event %j', args);

  if (null != packet.id) {
    debug('attaching ack callback to event');
    args.push(this.ack(packet.id));
  }

  if (this.connected) {
    emit.apply(this, args);
  } else {
    this.receiveBuffer.push(args);
  }
};

/**
 * Produces an ack callback to emit with an event.
 *
 * @api private
 */

Socket.prototype.ack = function(id){
  var self = this;
  var sent = false;
  return function(){
    // prevent double callbacks
    if (sent) return;
    sent = true;
    var args = toArray(arguments);
    debug('sending ack %j', args);

    var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
    self.packet({
      type: type,
      id: id,
      data: args
    });
  };
};

/**
 * Called upon a server acknowlegement.
 *
 * @param {Object} packet
 * @api private
 */

Socket.prototype.onack = function(packet){
  var ack = this.acks[packet.id];
  if ('function' == typeof ack) {
    debug('calling ack %s with %j', packet.id, packet.data);
    ack.apply(this, packet.data);
    delete this.acks[packet.id];
  } else {
    debug('bad ack %s', packet.id);
  }
};

/**
 * Called upon server connect.
 *
 * @api private
 */

Socket.prototype.onconnect = function(){
  this.connected = true;
  this.disconnected = false;
  this.emit('connect');
  this.emitBuffered();
};

/**
 * Emit buffered events (received and emitted).
 *
 * @api private
 */

Socket.prototype.emitBuffered = function(){
  var i;
  for (i = 0; i < this.receiveBuffer.length; i++) {
    emit.apply(this, this.receiveBuffer[i]);
  }
  this.receiveBuffer = [];

  for (i = 0; i < this.sendBuffer.length; i++) {
    this.packet(this.sendBuffer[i]);
  }
  this.sendBuffer = [];
};

/**
 * Called upon server disconnect.
 *
 * @api private
 */

Socket.prototype.ondisconnect = function(){
  debug('server disconnect (%s)', this.nsp);
  this.destroy();
  this.onclose('io server disconnect');
};

/**
 * Called upon forced client/server side disconnections,
 * this method ensures the manager stops tracking us and
 * that reconnections don't get triggered for this.
 *
 * @api private.
 */

Socket.prototype.destroy = function(){
  if (this.subs) {
    // clean subscriptions to avoid reconnections
    for (var i = 0; i < this.subs.length; i++) {
      this.subs[i].destroy();
    }
    this.subs = null;
  }

  this.io.destroy(this);
};

/**
 * Disconnects the socket manually.
 *
 * @return {Socket} self
 * @api public
 */

Socket.prototype.close =
Socket.prototype.disconnect = function(){
  if (this.connected) {
    debug('performing disconnect (%s)', this.nsp);
    this.packet({ type: parser.DISCONNECT });
  }

  // remove socket from pool
  this.destroy();

  if (this.connected) {
    // fire events
    this.onclose('io client disconnect');
  }
  return this;
};

/**
 * Sets the compress flag.
 *
 * @param {Boolean} if `true`, compresses the sending data
 * @return {Socket} self
 * @api public
 */

Socket.prototype.compress = function(compress){
  this.flags = this.flags || {};
  this.flags.compress = compress;
  return this;
};

},{"on":3,"component-bind":11,"component-emitter":12,"debug":14,"has-binary":31,"socket.io-parser":41,"to-array":44}],5:[function(_dereq_,module,exports){
(function (global){

/**
 * Module dependencies.
 */

var parseuri = _dereq_('parseuri');
var debug = _dereq_('debug')('socket.io-client:url');

/**
 * Module exports.
 */

module.exports = url;

/**
 * URL parser.
 *
 * @param {String} url
 * @param {Object} An object meant to mimic window.location.
 *                 Defaults to window.location.
 * @api public
 */

function url(uri, loc){
  var obj = uri;

  // default to window.location
  var loc = loc || global.location;
  if (null == uri) uri = loc.protocol + '//' + loc.host;

  // relative path support
  if ('string' == typeof uri) {
    if ('../default.htm' == uri.charAt(0)) {
      if ('../default.htm' == uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }

    if (!/^(https?|wss?):\/\//.test(uri)) {
      debug('protocol-less url %s', uri);
      if ('undefined' != typeof loc) {
        uri = loc.protocol + '//' + uri;
      } else {
        uri = '../../https@/' + uri;
      }
    }

    // parse
    debug('parse %s', uri);
    obj = parseuri(uri);
  }

  // make sure we treat `localhost:80` and `localhost` equally
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = '80';
    }
    else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = '443';
    }
  }

  obj.path = obj.path || '../default.htm';

  var ipv6 = obj.host.indexOf(':') !== -1;
  var host = ipv6 ? '[' + obj.host + ']' : obj.host;

  // define unique id
  obj.id = obj.protocol + '://' + host + ':' + obj.port;
  // define href
  obj.href = obj.protocol + '://' + host + (loc && loc.port == obj.port ? '' : (':' + obj.port));

  return obj;
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"debug":14,"parseuri":39}],6:[function(_dereq_,module,exports){
module.exports = after

function after(count, callback, err_cb) {
    var bail = false
    err_cb = err_cb || noop
    proxy.count = count

    return (count === 0) ? callback() : proxy

    function proxy(err, result) {
        if (proxy.count <= 0) {
            throw new Error('after called too many times')
        }
        --proxy.count

        // after first error, rest are passed to err_cb
        if (err) {
            bail = true
            callback(err)
            // future error callbacks will go to error handler
            callback = err_cb
        } else if (proxy.count === 0 && !bail) {
            callback(null, result)
        }
    }
}

function noop() {}

},{}],7:[function(_dereq_,module,exports){
/**
 * An abstraction for slicing an arraybuffer even when
 * ArrayBuffer.prototype.slice is not supported
 *
 * @api public
 */

module.exports = function(arraybuffer, start, end) {
  var bytes = arraybuffer.byteLength;
  start = start || 0;
  end = end || bytes;

  if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

  if (start < 0) { start += bytes; }
  if (end < 0) { end += bytes; }
  if (end > bytes) { end = bytes; }

  if (start >= bytes || start >= end || bytes === 0) {
    return new ArrayBuffer(0);
  }

  var abv = new Uint8Array(arraybuffer);
  var result = new Uint8Array(end - start);
  for (var i = start, ii = 0; i < end; i++, ii++) {
    result[ii] = abv[i];
  }
  return result.buffer;
};

},{}],8:[function(_dereq_,module,exports){

/**
 * Expose `Backoff`.
 */

module.exports = Backoff;

/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */

Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};

/**
 * Reset the number of attempts.
 *
 * @api public
 */

Backoff.prototype.reset = function(){
  this.attempts = 0;
};

/**
 * Set the minimum duration
 *
 * @api public
 */

Backoff.prototype.setMin = function(min){
  this.ms = min;
};

/**
 * Set the maximum duration
 *
 * @api public
 */

Backoff.prototype.setMax = function(max){
  this.max = max;
};

/**
 * Set the jitter
 *
 * @api public
 */

Backoff.prototype.setJitter = function(jitter){
  this.jitter = jitter;
};


},{}],9:[function(_dereq_,module,exports){
/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
(function(chars){
  "use strict";

  exports.encode = function(arraybuffer) {
    var bytes = new Uint8Array(arraybuffer),
    i, len = bytes.buffer.byteLength, base64 = "";

    for (i = 0; i < len; i+=3) {
      base64 += chars[bytes.buffer[i] >> 2];
      base64 += chars[((bytes.buffer[i] & 3) << 4) | (bytes.buffer[i + 1] >> 4)];
      base64 += chars[((bytes.buffer[i + 1] & 15) << 2) | (bytes.buffer[i + 2] >> 6)];
      base64 += chars[bytes.buffer[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + "=";
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + "==";
    }

    return base64;
  };

  exports.decode =  function(base64) {
    var bufferLength = base64.length * 0.75,
    len = base64.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

    if (base64[base64.length - 1] === "=") {
      bufferLength--;
      if (base64[base64.length - 2] === "=") {
        bufferLength--;
      }
    }

    var arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i+=4) {
      encoded1 = chars.indexOf(base64[i]);
      encoded2 = chars.indexOf(base64[i+1]);
      encoded3 = chars.indexOf(base64[i+2]);
      encoded4 = chars.indexOf(base64[i+3]);

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  };
})("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
},{}],10:[function(_dereq_,module,exports){
(function (global){
/**
 * Create a blob builder even when vendor prefixes exist
 */

var BlobBuilder = global.BlobBuilder
  || global.WebKitBlobBuilder
  || global.MSBlobBuilder
  || global.MozBlobBuilder;

/**
 * Check if Blob constructor is supported
 */

var blobSupported = (function() {
  try {
    var a = new Blob(['hi']);
    return a.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if Blob constructor supports ArrayBufferViews
 * Fails in Safari 6, so we need to map to ArrayBuffers there.
 */

var blobSupportsArrayBufferView = blobSupported && (function() {
  try {
    var b = new Blob([new Uint8Array([1,2])]);
    return b.size === 2;
  } catch(e) {
    return false;
  }
})();

/**
 * Check if BlobBuilder is supported
 */

var blobBuilderSupported = BlobBuilder
  && BlobBuilder.prototype.append
  && BlobBuilder.prototype.getBlob;

/**
 * Helper function that maps ArrayBufferViews to ArrayBuffers
 * Used by BlobBuilder constructor and old browsers that didn't
 * support it in the Blob constructor.
 */

function mapArrayBufferViews(ary) {
  for (var i = 0; i < ary.length; i++) {
    var chunk = ary[i];
    if (chunk.buffer instanceof ArrayBuffer) {
      var buf = chunk.buffer;

      // if this is a subarray, make a copy so we only
      // include the subarray region from the underlying buffer
      if (chunk.byteLength !== buf.byteLength) {
        var copy = new Uint8Array(chunk.byteLength);
        copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
        buf = copy.buffer;
      }

      ary[i] = buf;
    }
  }
}

function BlobBuilderConstructor(ary, options) {
  options = options || {};

  var bb = new BlobBuilder();
  mapArrayBufferViews(ary);

  for (var i = 0; i < ary.length; i++) {
    bb.append(ary[i]);
  }

  return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
};

function BlobConstructor(ary, options) {
  mapArrayBufferViews(ary);
  return new Blob(ary, options || {});
};

module.exports = (function() {
  if (blobSupported) {
    return blobSupportsArrayBufferView ? global.Blob : BlobConstructor;
  } else if (blobBuilderSupported) {
    return BlobBuilderConstructor;
  } else {
    return undefined;
  }
})();

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{}],11:[function(_dereq_,module,exports){
/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

},{}],12:[function(_dereq_,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],13:[function(_dereq_,module,exports){

module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};
},{}],14:[function(_dereq_,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = _dereq_('debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

},{"debug":15}],15:[function(_dereq_,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = _dereq_('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":36}],16:[function(_dereq_,module,exports){

module.exports =  _dereq_('lib/');

},{"lib/default.htm":17}],17:[function(_dereq_,module,exports){

module.exports = _dereq_('socket');

/**
 * Exports parser
 *
 * @api public
 *
 */
module.exports.parser = _dereq_('engine.io-parser');

},{"socket":18,"engine.io-parser":27}],18:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var transports = _dereq_('transports');
var Emitter = _dereq_('component-emitter');
var debug = _dereq_('debug')('engine.io-client:socket');
var index = _dereq_('indexof');
var parser = _dereq_('engine.io-parser');
var parseuri = _dereq_('parseuri');
var parsejson = _dereq_('parsejson');
var parseqs = _dereq_('parseqs');

/**
 * Module exports.
 */

module.exports = Socket;

/**
 * Noop function.
 *
 * @api private
 */

function noop(){}

/**
 * Socket constructor.
 *
 * @param {String|Object} uri or options
 * @param {Object} options
 * @api public
 */

function Socket(uri, opts){
  if (!(this instanceof Socket)) return new Socket(uri, opts);

  opts = opts || {};

  if (uri && 'object' == typeof uri) {
    opts = uri;
    uri = null;
  }

  if (uri) {
    uri = parseuri(uri);
    opts.hostname = uri.host;
    opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';
    opts.port = uri.port;
    if (uri.query) opts.query = uri.query;
  } else if (opts.host) {
    opts.hostname = parseuri(opts.host).host;
  }

  this.secure = null != opts.secure ? opts.secure :
    (global.location && 'https:' == location.protocol);

  if (opts.hostname && !opts.port) {
    // if no port is specified manually, use the protocol default
    opts.port = this.secure ? '443' : '80';
  }

  this.agent = opts.agent || false;
  this.hostname = opts.hostname ||
    (global.location ? location.hostname : 'localhost');
  this.port = opts.port || (global.location && location.port ?
       location.port :
       (this.secure ? 443 : 80));
  this.query = opts.query || {};
  if ('string' == typeof this.query) this.query = parseqs.decode(this.query);
  this.upgrade = false !== opts.upgrade;
  this.path = (opts.path || '../engine.io').replace(/\/$/, '') + '/';
  this.forceJSONP = !!opts.forceJSONP;
  this.jsonp = false !== opts.jsonp;
  this.forceBase64 = !!opts.forceBase64;
  this.enablesXDR = !!opts.enablesXDR;
  this.timestampParam = opts.timestampParam || 't';
  this.timestampRequests = opts.timestampRequests;
  this.transports = opts.transports || ['polling', 'websocket'];
  this.readyState = '';
  this.writeBuffer = [];
  this.policyPort = opts.policyPort || 843;
  this.rememberUpgrade = opts.rememberUpgrade || false;
  this.binaryType = null;
  this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
  this.perMessageDeflate = false !== opts.perMessageDeflate ? (opts.perMessageDeflate || {}) : false;

  if (true === this.perMessageDeflate) this.perMessageDeflate = {};
  if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
    this.perMessageDeflate.threshold = 1024;
  }

  // SSL options for Node.js client
  this.pfx = opts.pfx || null;
  this.key = opts.key || null;
  this.passphrase = opts.passphrase || null;
  this.cert = opts.cert || null;
  this.ca = opts.ca || null;
  this.ciphers = opts.ciphers || null;
  this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? null : opts.rejectUnauthorized;

  // other options for Node.js client
  var freeGlobal = typeof global == 'object' && global;
  if (freeGlobal.global === freeGlobal) {
    if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
      this.extraHeaders = opts.extraHeaders;
    }
  }

  this.open();
}

Socket.priorWebsocketSuccess = false;

/**
 * Mix in `Emitter`.
 */

Emitter(Socket.prototype);

/**
 * Protocol version.
 *
 * @api public
 */

Socket.protocol = parser.protocol; // this is an int

/**
 * Expose deps for legacy compatibility
 * and standalone browser access.
 */

Socket.Socket = Socket;
Socket.Transport = _dereq_('transport');
Socket.transports = _dereq_('transports');
Socket.parser = _dereq_('engine.io-parser');

/**
 * Creates transport of the given type.
 *
 * @param {String} transport name
 * @return {Transport}
 * @api private
 */

Socket.prototype.createTransport = function (name) {
  debug('creating transport "%s"', name);
  var query = clone(this.query);

  // append engine.io protocol identifier
  query.EIO = parser.protocol;

  // transport name
  query.transport = name;

  // session id if we already have one
  if (this.id) query.sid = this.id;

  var transport = new transports[name]({
    agent: this.agent,
    hostname: this.hostname,
    port: this.port,
    secure: this.secure,
    path: this.path,
    query: query,
    forceJSONP: this.forceJSONP,
    jsonp: this.jsonp,
    forceBase64: this.forceBase64,
    enablesXDR: this.enablesXDR,
    timestampRequests: this.timestampRequests,
    timestampParam: this.timestampParam,
    policyPort: this.policyPort,
    socket: this,
    pfx: this.pfx,
    key: this.key,
    passphrase: this.passphrase,
    cert: this.cert,
    ca: this.ca,
    ciphers: this.ciphers,
    rejectUnauthorized: this.rejectUnauthorized,
    perMessageDeflate: this.perMessageDeflate,
    extraHeaders: this.extraHeaders
  });

  return transport;
};

function clone (obj) {
  var o = {};
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      o[i] = obj[i];
    }
  }
  return o;
}

/**
 * Initializes transport to use and starts probe.
 *
 * @api private
 */
Socket.prototype.open = function () {
  var transport;
  if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1) {
    transport = 'websocket';
  } else if (0 === this.transports.length) {
    // Emit error on next tick so it can be listened to
    var self = this;
    setTimeout(function() {
      self.emit('error', 'No transports available');
    }, 0);
    return;
  } else {
    transport = this.transports[0];
  }
  this.readyState = 'opening';

  // Retry with the next transport if the transport is disabled (jsonp: false)
  try {
    transport = this.createTransport(transport);
  } catch (e) {
    this.transports.shift();
    this.open();
    return;
  }

  transport.open();
  this.setTransport(transport);
};

/**
 * Sets the current transport. Disables the existing one (if any).
 *
 * @api private
 */

Socket.prototype.setTransport = function(transport){
  debug('setting transport %s', transport.name);
  var self = this;

  if (this.transport) {
    debug('clearing existing transport %s', this.transport.name);
    this.transport.removeAllListeners();
  }

  // set up transport
  this.transport = transport;

  // set up transport listeners
  transport
  .on('drain', function(){
    self.onDrain();
  })
  .on('packet', function(packet){
    self.onPacket(packet);
  })
  .on('error', function(e){
    self.onError(e);
  })
  .on('close', function(){
    self.onClose('transport close');
  });
};

/**
 * Probes a transport.
 *
 * @param {String} transport name
 * @api private
 */

Socket.prototype.probe = function (name) {
  debug('probing transport "%s"', name);
  var transport = this.createTransport(name, { probe: 1 })
    , failed = false
    , self = this;

  Socket.priorWebsocketSuccess = false;

  function onTransportOpen(){
    if (self.onlyBinaryUpgrades) {
      var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
      failed = failed || upgradeLosesBinary;
    }
    if (failed) return;

    debug('probe transport "%s" opened', name);
    transport.send([{ type: 'ping', data: 'probe' }]);
    transport.once('packet', function (msg) {
      if (failed) return;
      if ('pong' == msg.type && 'probe' == msg.data) {
        debug('probe transport "%s" pong', name);
        self.upgrading = true;
        self.emit('upgrading', transport);
        if (!transport) return;
        Socket.priorWebsocketSuccess = 'websocket' == transport.name;

        debug('pausing current transport "%s"', self.transport.name);
        self.transport.pause(function () {
          if (failed) return;
          if ('closed' == self.readyState) return;
          debug('changing transport and sending upgrade packet');

          cleanup();

          self.setTransport(transport);
          transport.send([{ type: 'upgrade' }]);
          self.emit('upgrade', transport);
          transport = null;
          self.upgrading = false;
          self.flush();
        });
      } else {
        debug('probe transport "%s" failed', name);
        var err = new Error('probe error');
        err.transport = transport.name;
        self.emit('upgradeError', err);
      }
    });
  }

  function freezeTransport() {
    if (failed) return;

    // Any callback called by transport should be ignored since now
    failed = true;

    cleanup();

    transport.close();
    transport = null;
  }

  //Handle any error that happens while probing
  function onerror(err) {
    var error = new Error('probe error: ' + err);
    error.transport = transport.name;

    freezeTransport();

    debug('probe transport "%s" failed because of error: %s', name, err);

    self.emit('upgradeError', error);
  }

  function onTransportClose(){
    onerror("transport closed");
  }

  //When the socket is closed while we're probing
  function onclose(){
    onerror("socket closed");
  }

  //When the socket is upgraded while we're probing
  function onupgrade(to){
    if (transport && to.name != transport.name) {
      debug('"%s" works - aborting "%s"', to.name, transport.name);
      freezeTransport();
    }
  }

  //Remove all listeners on the transport and on self
  function cleanup(){
    transport.removeListener('open', onTransportOpen);
    transport.removeListener('error', onerror);
    transport.removeListener('close', onTransportClose);
    self.removeListener('close', onclose);
    self.removeListener('upgrading', onupgrade);
  }

  transport.once('open', onTransportOpen);
  transport.once('error', onerror);
  transport.once('close', onTransportClose);

  this.once('close', onclose);
  this.once('upgrading', onupgrade);

  transport.open();

};

/**
 * Called when connection is deemed open.
 *
 * @api public
 */

Socket.prototype.onOpen = function () {
  debug('socket open');
  this.readyState = 'open';
  Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;
  this.emit('open');
  this.flush();

  // we check for `readyState` in case an `open`
  // listener already closed the socket
  if ('open' == this.readyState && this.upgrade && this.transport.pause) {
    debug('starting upgrade probes');
    for (var i = 0, l = this.upgrades.length; i < l; i++) {
      this.probe(this.upgrades[i]);
    }
  }
};

/**
 * Handles a packet.
 *
 * @api private
 */

Socket.prototype.onPacket = function (packet) {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

    this.emit('packet', packet);

    // Socket is live - any packet counts
    this.emit('heartbeat');

    switch (packet.type) {
      case 'open':
        this.onHandshake(parsejson(packet.data));
        break;

      case 'pong':
        this.setPing();
        this.emit('pong');
        break;

      case 'error':
        var err = new Error('server error');
        err.code = packet.data;
        this.onError(err);
        break;

      case 'message':
        this.emit('data', packet.data);
        this.emit('message', packet.data);
        break;
    }
  } else {
    debug('packet received with socket readyState "%s"', this.readyState);
  }
};

/**
 * Called upon handshake completion.
 *
 * @param {Object} handshake obj
 * @api private
 */

Socket.prototype.onHandshake = function (data) {
  this.emit('handshake', data);
  this.id = data.sid;
  this.transport.query.sid = data.sid;
  this.upgrades = this.filterUpgrades(data.upgrades);
  this.pingInterval = data.pingInterval;
  this.pingTimeout = data.pingTimeout;
  this.onOpen();
  // In case open handler closes socket
  if  ('closed' == this.readyState) return;
  this.setPing();

  // Prolong liveness of socket on heartbeat
  this.removeListener('heartbeat', this.onHeartbeat);
  this.on('heartbeat', this.onHeartbeat);
};

/**
 * Resets ping timeout.
 *
 * @api private
 */

Socket.prototype.onHeartbeat = function (timeout) {
  clearTimeout(this.pingTimeoutTimer);
  var self = this;
  self.pingTimeoutTimer = setTimeout(function () {
    if ('closed' == self.readyState) return;
    self.onClose('ping timeout');
  }, timeout || (self.pingInterval + self.pingTimeout));
};

/**
 * Pings server every `this.pingInterval` and expects response
 * within `this.pingTimeout` or closes connection.
 *
 * @api private
 */

Socket.prototype.setPing = function () {
  var self = this;
  clearTimeout(self.pingIntervalTimer);
  self.pingIntervalTimer = setTimeout(function () {
    debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
    self.ping();
    self.onHeartbeat(self.pingTimeout);
  }, self.pingInterval);
};

/**
* Sends a ping packet.
*
* @api private
*/

Socket.prototype.ping = function () {
  var self = this;
  this.sendPacket('ping', function(){
    self.emit('ping');
  });
};

/**
 * Called on `drain` event
 *
 * @api private
 */

Socket.prototype.onDrain = function() {
  this.writeBuffer.splice(0, this.prevBufferLen);

  // setting prevBufferLen = 0 is very important
  // for example, when upgrading, upgrade packet is sent over,
  // and a nonzero prevBufferLen could cause problems on `drain`
  this.prevBufferLen = 0;

  if (0 === this.writeBuffer.length) {
    this.emit('drain');
  } else {
    this.flush();
  }
};

/**
 * Flush write buffers.
 *
 * @api private
 */

Socket.prototype.flush = function () {
  if ('closed' != this.readyState && this.transport.writable &&
    !this.upgrading && this.writeBuffer.length) {
    debug('flushing %d packets in socket', this.writeBuffer.length);
    this.transport.send(this.writeBuffer);
    // keep track of current length of writeBuffer
    // splice writeBuffer and callbackBuffer on `drain`
    this.prevBufferLen = this.writeBuffer.length;
    this.emit('flush');
  }
};

/**
 * Sends a message.
 *
 * @param {String} message.
 * @param {Function} callback function.
 * @param {Object} options.
 * @return {Socket} for chaining.
 * @api public
 */

Socket.prototype.write =
Socket.prototype.send = function (msg, options, fn) {
  this.sendPacket('message', msg, options, fn);
  return this;
};

/**
 * Sends a packet.
 *
 * @param {String} packet type.
 * @param {String} data.
 * @param {Object} options.
 * @param {Function} callback function.
 * @api private
 */

Socket.prototype.sendPacket = function (type, data, options, fn) {
  if('function' == typeof data) {
    fn = data;
    data = undefined;
  }

  if ('function' == typeof options) {
    fn = options;
    options = null;
  }

  if ('closing' == this.readyState || 'closed' == this.readyState) {
    return;
  }

  options = options || {};
  options.compress = false !== options.compress;

  var packet = {
    type: type,
    data: data,
    options: options
  };
  this.emit('packetCreate', packet);
  this.writeBuffer.push(packet);
  if (fn) this.once('flush', fn);
  this.flush();
};

/**
 * Closes the connection.
 *
 * @api private
 */

Socket.prototype.close = function () {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    this.readyState = 'closing';

    var self = this;

    if (this.writeBuffer.length) {
      this.once('drain', function() {
        if (this.upgrading) {
          waitForUpgrade();
        } else {
          close();
        }
      });
    } else if (this.upgrading) {
      waitForUpgrade();
    } else {
      close();
    }
  }

  function close() {
    self.onClose('forced close');
    debug('socket closing - telling transport to close');
    self.transport.close();
  }

  function cleanupAndClose() {
    self.removeListener('upgrade', cleanupAndClose);
    self.removeListener('upgradeError', cleanupAndClose);
    close();
  }

  function waitForUpgrade() {
    // wait for upgrade to finish since we can't send packets while pausing a transport
    self.once('upgrade', cleanupAndClose);
    self.once('upgradeError', cleanupAndClose);
  }

  return this;
};

/**
 * Called upon transport error
 *
 * @api private
 */

Socket.prototype.onError = function (err) {
  debug('socket error %j', err);
  Socket.priorWebsocketSuccess = false;
  this.emit('error', err);
  this.onClose('transport error', err);
};

/**
 * Called upon transport close.
 *
 * @api private
 */

Socket.prototype.onClose = function (reason, desc) {
  if ('opening' == this.readyState || 'open' == this.readyState || 'closing' == this.readyState) {
    debug('socket close with reason: "%s"', reason);
    var self = this;

    // clear timers
    clearTimeout(this.pingIntervalTimer);
    clearTimeout(this.pingTimeoutTimer);

    // stop event from firing again for transport
    this.transport.removeAllListeners('close');

    // ensure transport won't stay open
    this.transport.close();

    // ignore further transport communication
    this.transport.removeAllListeners();

    // set ready state
    this.readyState = 'closed';

    // clear session id
    this.id = null;

    // emit close event
    this.emit('close', reason, desc);

    // clean buffers after, so users can still
    // grab the buffers on `close` event
    self.writeBuffer = [];
    self.prevBufferLen = 0;
  }
};

/**
 * Filters upgrades, returning only those matching client transports.
 *
 * @param {Array} server upgrades
 * @api private
 *
 */

Socket.prototype.filterUpgrades = function (upgrades) {
  var filteredUpgrades = [];
  for (var i = 0, j = upgrades.length; i<j; i++) {
    if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
  }
  return filteredUpgrades;
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"transport":19,"transports":20,"component-emitter":26,"debug":14,"engine.io-parser":27,"indexof":33,"parsejson":37,"parseqs":38,"parseuri":39}],19:[function(_dereq_,module,exports){
/**
 * Module dependencies.
 */

var parser = _dereq_('engine.io-parser');
var Emitter = _dereq_('component-emitter');

/**
 * Module exports.
 */

module.exports = Transport;

/**
 * Transport abstract constructor.
 *
 * @param {Object} options.
 * @api private
 */

function Transport (opts) {
  this.path = opts.path;
  this.hostname = opts.hostname;
  this.port = opts.port;
  this.secure = opts.secure;
  this.query = opts.query;
  this.timestampParam = opts.timestampParam;
  this.timestampRequests = opts.timestampRequests;
  this.readyState = '';
  this.agent = opts.agent || false;
  this.socket = opts.socket;
  this.enablesXDR = opts.enablesXDR;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;
}

/**
 * Mix in `Emitter`.
 */

Emitter(Transport.prototype);

/**
 * Emits an error.
 *
 * @param {String} str
 * @return {Transport} for chaining
 * @api public
 */

Transport.prototype.onError = function (msg, desc) {
  var err = new Error(msg);
  err.type = 'TransportError';
  err.description = desc;
  this.emit('error', err);
  return this;
};

/**
 * Opens the transport.
 *
 * @api public
 */

Transport.prototype.open = function () {
  if ('closed' == this.readyState || '' == this.readyState) {
    this.readyState = 'opening';
    this.doOpen();
  }

  return this;
};

/**
 * Closes the transport.
 *
 * @api private
 */

Transport.prototype.close = function () {
  if ('opening' == this.readyState || 'open' == this.readyState) {
    this.doClose();
    this.onClose();
  }

  return this;
};

/**
 * Sends multiple packets.
 *
 * @param {Array} packets
 * @api private
 */

Transport.prototype.send = function(packets){
  if ('open' == this.readyState) {
    this.write(packets);
  } else {
    throw new Error('Transport not open');
  }
};

/**
 * Called upon open
 *
 * @api private
 */

Transport.prototype.onOpen = function () {
  this.readyState = 'open';
  this.writable = true;
  this.emit('open');
};

/**
 * Called with data.
 *
 * @param {String} data
 * @api private
 */

Transport.prototype.onData = function(data){
  var packet = parser.decodePacket(data, this.socket.binaryType);
  this.onPacket(packet);
};

/**
 * Called with a decoded packet.
 */

Transport.prototype.onPacket = function (packet) {
  this.emit('packet', packet);
};

/**
 * Called upon close.
 *
 * @api private
 */

Transport.prototype.onClose = function () {
  this.readyState = 'closed';
  this.emit('close');
};

},{"component-emitter":26,"engine.io-parser":27}],20:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies
 */

var XMLHttpRequest = _dereq_('xmlhttprequest-ssl');
var XHR = _dereq_('polling-xhr');
var JSONP = _dereq_('polling-jsonp');
var websocket = _dereq_('websocket');

/**
 * Export transports.
 */

exports.polling = polling;
exports.websocket = websocket;

/**
 * Polling transport polymorphic constructor.
 * Decides on xhr vs jsonp based on feature detection.
 *
 * @api private
 */

function polling(opts){
  var xhr;
  var xd = false;
  var xs = false;
  var jsonp = false !== opts.jsonp;

  if (global.location) {
    var isSSL = 'https:' == location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    xd = opts.hostname != location.hostname || port != opts.port;
    xs = opts.secure != isSSL;
  }

  opts.xdomain = xd;
  opts.xscheme = xs;
  xhr = new XMLHttpRequest(opts);

  if ('open' in xhr && !opts.forceJSONP) {
    return new XHR(opts);
  } else {
    if (!jsonp) throw new Error('JSONP disabled');
    return new JSONP(opts);
  }
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"polling-jsonp":21,"polling-xhr":22,"websocket":24,"xmlhttprequest-ssl":25}],21:[function(_dereq_,module,exports){
(function (global){

/**
 * Module requirements.
 */

var Polling = _dereq_('polling');
var inherit = _dereq_('component-inherit');

/**
 * Module exports.
 */

module.exports = JSONPPolling;

/**
 * Cached regular expressions.
 */

var rNewline = /\n/g;
var rEscapedNewline = /\\n/g;

/**
 * Global JSONP callbacks.
 */

var callbacks;

/**
 * Callbacks count.
 */

var index = 0;

/**
 * Noop.
 */

function empty () { }

/**
 * JSONP Polling constructor.
 *
 * @param {Object} opts.
 * @api public
 */

function JSONPPolling (opts) {
  Polling.call(this, opts);

  this.query = this.query || {};

  // define global callbacks array if not present
  // we do this here (lazily) to avoid unneeded global pollution
  if (!callbacks) {
    // we need to consider multiple engines in the same page
    if (!global.___eio) global.___eio = [];
    callbacks = global.___eio;
  }

  // callback identifier
  this.index = callbacks.length;

  // add callback to jsonp global
  var self = this;
  callbacks.push(function (msg) {
    self.onData(msg);
  });

  // append to query string
  this.query.j = this.index;

  // prevent spurious errors from being emitted when the window is unloaded
  if (global.document && global.addEventListener) {
    global.addEventListener('beforeunload', function () {
      if (self.script) self.script.onerror = empty;
    }, false);
  }
}

/**
 * Inherits from Polling.
 */

inherit(JSONPPolling, Polling);

/*
 * JSONP only supports binary as base64 encoded strings
 */

JSONPPolling.prototype.supportsBinary = false;

/**
 * Closes the socket.
 *
 * @api private
 */

JSONPPolling.prototype.doClose = function () {
  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  if (this.form) {
    this.form.parentNode.removeChild(this.form);
    this.form = null;
    this.iframe = null;
  }

  Polling.prototype.doClose.call(this);
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

JSONPPolling.prototype.doPoll = function () {
  var self = this;
  var script = document.createElement('script');

  if (this.script) {
    this.script.parentNode.removeChild(this.script);
    this.script = null;
  }

  script.async = true;
  script.src = this.uri();
  script.onerror = function(e){
    self.onError('jsonp poll error',e);
  };

  var insertAt = document.getElementsByTagName('script')[0];
  insertAt.parentNode.insertBefore(script, insertAt);
  this.script = script;

  var isUAgecko = 'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);

  if (isUAgecko) {
    setTimeout(function () {
      var iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      document.body.removeChild(iframe);
    }, 100);
  }
};

/**
 * Writes with a hidden iframe.
 *
 * @param {String} data to send
 * @param {Function} called upon flush.
 * @api private
 */

JSONPPolling.prototype.doWrite = function (data, fn) {
  var self = this;

  if (!this.form) {
    var form = document.createElement('form');
    var area = document.createElement('textarea');
    var id = this.iframeId = 'eio_iframe_' + this.index;
    var iframe;

    form.className = 'socketio';
    form.style.position = 'absolute';
    form.style.top = '-1000px';
    form.style.left = '-1000px';
    form.target = id;
    form.method = 'POST';
    form.setAttribute('accept-charset', 'utf-8');
    area.name = 'd';
    form.appendChild(area);
    document.body.appendChild(form);

    this.form = form;
    this.area = area;
  }

  this.form.action = this.uri();

  function complete () {
    initIframe();
    fn();
  }

  function initIframe () {
    if (self.iframe) {
      try {
        self.form.removeChild(self.iframe);
      } catch (e) {
        self.onError('jsonp polling iframe removal error', e);
      }
    }

    try {
      // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
      var html = '<iframe src="javascript:0" name="'+ self.iframeId +'">';
      iframe = document.createElement(html);
    } catch (e) {
      iframe = document.createElement('iframe');
      iframe.name = self.iframeId;
      iframe.src = 'javascript:0';
    }

    iframe.id = self.iframeId;

    self.form.appendChild(iframe);
    self.iframe = iframe;
  }

  initIframe();

  // escape \n to prevent it from being converted into \r\n by some UAs
  // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
  data = data.replace(rEscapedNewline, '\\\n');
  this.area.value = data.replace(rNewline, '\\n');

  try {
    this.form.submit();
  } catch(e) {}

  if (this.iframe.attachEvent) {
    this.iframe.onreadystatechange = function(){
      if (self.iframe.readyState == 'complete') {
        complete();
      }
    };
  } else {
    this.iframe.onload = complete;
  }
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"polling":23,"component-inherit":13}],22:[function(_dereq_,module,exports){
(function (global){
/**
 * Module requirements.
 */

var XMLHttpRequest = _dereq_('xmlhttprequest-ssl');
var Polling = _dereq_('polling');
var Emitter = _dereq_('component-emitter');
var inherit = _dereq_('component-inherit');
var debug = _dereq_('debug')('engine.io-client:polling-xhr');

/**
 * Module exports.
 */

module.exports = XHR;
module.exports.Request = Request;

/**
 * Empty function
 */

function empty(){}

/**
 * XHR Polling constructor.
 *
 * @param {Object} opts
 * @api public
 */

function XHR(opts){
  Polling.call(this, opts);

  if (global.location) {
    var isSSL = 'https:' == location.protocol;
    var port = location.port;

    // some user agents have empty `location.port`
    if (!port) {
      port = isSSL ? 443 : 80;
    }

    this.xd = opts.hostname != global.location.hostname ||
      port != opts.port;
    this.xs = opts.secure != isSSL;
  } else {
    this.extraHeaders = opts.extraHeaders;
  }
}

/**
 * Inherits from Polling.
 */

inherit(XHR, Polling);

/**
 * XHR supports binary
 */

XHR.prototype.supportsBinary = true;

/**
 * Creates a request.
 *
 * @param {String} method
 * @api private
 */

XHR.prototype.request = function(opts){
  opts = opts || {};
  opts.uri = this.uri();
  opts.xd = this.xd;
  opts.xs = this.xs;
  opts.agent = this.agent || false;
  opts.supportsBinary = this.supportsBinary;
  opts.enablesXDR = this.enablesXDR;

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  // other options for Node.js client
  opts.extraHeaders = this.extraHeaders;

  return new Request(opts);
};

/**
 * Sends data.
 *
 * @param {String} data to send.
 * @param {Function} called upon flush.
 * @api private
 */

XHR.prototype.doWrite = function(data, fn){
  var isBinary = typeof data !== 'string' && data !== undefined;
  var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
  var self = this;
  req.on('success', fn);
  req.on('error', function(err){
    self.onError('xhr post error', err);
  });
  this.sendXhr = req;
};

/**
 * Starts a poll cycle.
 *
 * @api private
 */

XHR.prototype.doPoll = function(){
  debug('xhr poll');
  var req = this.request();
  var self = this;
  req.on('data', function(data){
    self.onData(data);
  });
  req.on('error', function(err){
    self.onError('xhr poll error', err);
  });
  this.pollXhr = req;
};

/**
 * Request constructor
 *
 * @param {Object} options
 * @api public
 */

function Request(opts){
  this.method = opts.method || 'GET';
  this.uri = opts.uri;
  this.xd = !!opts.xd;
  this.xs = !!opts.xs;
  this.async = false !== opts.async;
  this.data = undefined != opts.data ? opts.data : null;
  this.agent = opts.agent;
  this.isBinary = opts.isBinary;
  this.supportsBinary = opts.supportsBinary;
  this.enablesXDR = opts.enablesXDR;

  // SSL options for Node.js client
  this.pfx = opts.pfx;
  this.key = opts.key;
  this.passphrase = opts.passphrase;
  this.cert = opts.cert;
  this.ca = opts.ca;
  this.ciphers = opts.ciphers;
  this.rejectUnauthorized = opts.rejectUnauthorized;

  // other options for Node.js client
  this.extraHeaders = opts.extraHeaders;

  this.create();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Request.prototype);

/**
 * Creates the XHR object and sends the request.
 *
 * @api private
 */

Request.prototype.create = function(){
  var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;

  var xhr = this.xhr = new XMLHttpRequest(opts);
  var self = this;

  try {
    debug('xhr open %s: %s', this.method, this.uri);
    xhr.open(this.method, this.uri, this.async);
    try {
      if (this.extraHeaders) {
        xhr.setDisableHeaderCheck(true);
        for (var i in this.extraHeaders) {
          if (this.extraHeaders.hasOwnProperty(i)) {
            xhr.setRequestHeader(i, this.extraHeaders[i]);
          }
        }
      }
    } catch (e) {}
    if (this.supportsBinary) {
      // This has to be done after open because Firefox is stupid
      // http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
      xhr.responseType = 'arraybuffer';
    }

    if ('POST' == this.method) {
      try {
        if (this.isBinary) {
          xhr.setRequestHeader('Content-type', 'application/octet-stream');
        } else {
          xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
        }
      } catch (e) {}
    }

    // ie6 check
    if ('withCredentials' in xhr) {
      xhr.withCredentials = true;
    }

    if (this.hasXDR()) {
      xhr.onload = function(){
        self.onLoad();
      };
      xhr.onerror = function(){
        self.onError(xhr.responseText);
      };
    } else {
      xhr.onreadystatechange = function(){
        if (4 != xhr.readyState) return;
        if (200 == xhr.status || 1223 == xhr.status) {
          self.onLoad();
        } else {
          // make sure the `error` event handler that's user-set
          // does not throw in the same tick and gets caught here
          setTimeout(function(){
            self.onError(xhr.status);
          }, 0);
        }
      };
    }

    debug('xhr data %s', this.data);
    xhr.send(this.data);
  } catch (e) {
    // Need to defer since .create() is called directly fhrom the constructor
    // and thus the 'error' event can only be only bound *after* this exception
    // occurs.  Therefore, also, we cannot throw here at all.
    setTimeout(function() {
      self.onError(e);
    }, 0);
    return;
  }

  if (global.document) {
    this.index = Request.requestsCount++;
    Request.requests[this.index] = this;
  }
};

/**
 * Called upon successful response.
 *
 * @api private
 */

Request.prototype.onSuccess = function(){
  this.emit('success');
  this.cleanup();
};

/**
 * Called if we have data.
 *
 * @api private
 */

Request.prototype.onData = function(data){
  this.emit('data', data);
  this.onSuccess();
};

/**
 * Called upon error.
 *
 * @api private
 */

Request.prototype.onError = function(err){
  this.emit('error', err);
  this.cleanup(true);
};

/**
 * Cleans up house.
 *
 * @api private
 */

Request.prototype.cleanup = function(fromError){
  if ('undefined' == typeof this.xhr || null === this.xhr) {
    return;
  }
  // xmlhttprequest
  if (this.hasXDR()) {
    this.xhr.onload = this.xhr.onerror = empty;
  } else {
    this.xhr.onreadystatechange = empty;
  }

  if (fromError) {
    try {
      this.xhr.abort();
    } catch(e) {}
  }

  if (global.document) {
    delete Request.requests[this.index];
  }

  this.xhr = null;
};

/**
 * Called upon load.
 *
 * @api private
 */

Request.prototype.onLoad = function(){
  var data;
  try {
    var contentType;
    try {
      contentType = this.xhr.getResponseHeader('Content-Type').split(';')[0];
    } catch (e) {}
    if (contentType === 'application/octet-stream') {
      data = this.xhr.response;
    } else {
      if (!this.supportsBinary) {
        data = this.xhr.responseText;
      } else {
        try {
          data = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response));
        } catch (e) {
          var ui8Arr = new Uint8Array(this.xhr.response);
          var dataArray = [];
          for (var idx = 0, length = ui8Arr.length; idx < length; idx++) {
            dataArray.push(ui8Arr[idx]);
          }

          data = String.fromCharCode.apply(null, dataArray);
        }
      }
    }
  } catch (e) {
    this.onError(e);
  }
  if (null != data) {
    this.onData(data);
  }
};

/**
 * Check if it has XDomainRequest.
 *
 * @api private
 */

Request.prototype.hasXDR = function(){
  return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
};

/**
 * Aborts the request.
 *
 * @api public
 */

Request.prototype.abort = function(){
  this.cleanup();
};

/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */

if (global.document) {
  Request.requestsCount = 0;
  Request.requests = {};
  if (global.attachEvent) {
    global.attachEvent('onunload', unloadHandler);
  } else if (global.addEventListener) {
    global.addEventListener('beforeunload', unloadHandler, false);
  }
}

function unloadHandler() {
  for (var i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"polling":23,"component-emitter":26,"component-inherit":13,"debug":14,"xmlhttprequest-ssl":25}],23:[function(_dereq_,module,exports){
/**
 * Module dependencies.
 */

var Transport = _dereq_('../transport');
var parseqs = _dereq_('parseqs');
var parser = _dereq_('engine.io-parser');
var inherit = _dereq_('component-inherit');
var yeast = _dereq_('yeast');
var debug = _dereq_('debug')('engine.io-client:polling');

/**
 * Module exports.
 */

module.exports = Polling;

/**
 * Is XHR2 supported?
 */

var hasXHR2 = (function() {
  var XMLHttpRequest = _dereq_('xmlhttprequest-ssl');
  var xhr = new XMLHttpRequest({ xdomain: false });
  return null != xhr.responseType;
})();

/**
 * Polling interface.
 *
 * @param {Object} opts
 * @api private
 */

function Polling(opts){
  var forceBase64 = (opts && opts.forceBase64);
  if (!hasXHR2 || forceBase64) {
    this.supportsBinary = false;
  }
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(Polling, Transport);

/**
 * Transport name.
 */

Polling.prototype.name = 'polling';

/**
 * Opens the socket (triggers polling). We write a PING message to determine
 * when the transport is open.
 *
 * @api private
 */

Polling.prototype.doOpen = function(){
  this.poll();
};

/**
 * Pauses polling.
 *
 * @param {Function} callback upon buffers are flushed and transport is paused
 * @api private
 */

Polling.prototype.pause = function(onPause){
  var pending = 0;
  var self = this;

  this.readyState = 'pausing';

  function pause(){
    debug('paused');
    self.readyState = 'paused';
    onPause();
  }

  if (this.polling || !this.writable) {
    var total = 0;

    if (this.polling) {
      debug('we are currently polling - waiting to pause');
      total++;
      this.once('pollComplete', function(){
        debug('pre-pause polling complete');
        --total || pause();
      });
    }

    if (!this.writable) {
      debug('we are currently writing - waiting to pause');
      total++;
      this.once('drain', function(){
        debug('pre-pause writing complete');
        --total || pause();
      });
    }
  } else {
    pause();
  }
};

/**
 * Starts polling cycle.
 *
 * @api public
 */

Polling.prototype.poll = function(){
  debug('polling');
  this.polling = true;
  this.doPoll();
  this.emit('poll');
};

/**
 * Overloads onData to detect payloads.
 *
 * @api private
 */

Polling.prototype.onData = function(data){
  var self = this;
  debug('polling got data %s', data);
  var callback = function(packet, index, total) {
    // if its the first message we consider the transport open
    if ('opening' == self.readyState) {
      self.onOpen();
    }

    // if its a close packet, we close the ongoing requests
    if ('close' == packet.type) {
      self.onClose();
      return false;
    }

    // otherwise bypass onData and handle the message
    self.onPacket(packet);
  };

  // decode payload
  parser.decodePayload(data, this.socket.binaryType, callback);

  // if an event did not trigger closing
  if ('closed' != this.readyState) {
    // if we got data we're not polling
    this.polling = false;
    this.emit('pollComplete');

    if ('open' == this.readyState) {
      this.poll();
    } else {
      debug('ignoring poll - transport state "%s"', this.readyState);
    }
  }
};

/**
 * For polling, send a close packet.
 *
 * @api private
 */

Polling.prototype.doClose = function(){
  var self = this;

  function close(){
    debug('writing close packet');
    self.write([{ type: 'close' }]);
  }

  if ('open' == this.readyState) {
    debug('transport open - closing');
    close();
  } else {
    // in case we're trying to close while
    // handshaking is in progress (GH-164)
    debug('transport not open - deferring close');
    this.once('open', close);
  }
};

/**
 * Writes a packets payload.
 *
 * @param {Array} data packets
 * @param {Function} drain callback
 * @api private
 */

Polling.prototype.write = function(packets){
  var self = this;
  this.writable = false;
  var callbackfn = function() {
    self.writable = true;
    self.emit('drain');
  };

  var self = this;
  parser.encodePayload(packets, this.supportsBinary, function(data) {
    self.doWrite(data, callbackfn);
  });
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

Polling.prototype.uri = function(){
  var query = this.query || {};
  var schema = this.secure ? 'https' : 'http';
  var port = '';

  // cache busting is forced
  if (false !== this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  if (!this.supportsBinary && !query.sid) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // avoid port if default for schema
  if (this.port && (('https' == schema && this.port != 443) ||
     ('http' == schema && this.port != 80))) {
    port = ':' + this.port;
  }

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

},{"../transport":19,"component-inherit":13,"debug":14,"engine.io-parser":27,"parseqs":38,"xmlhttprequest-ssl":25,"yeast":46}],24:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var Transport = _dereq_('../transport');
var parser = _dereq_('engine.io-parser');
var parseqs = _dereq_('parseqs');
var inherit = _dereq_('component-inherit');
var yeast = _dereq_('yeast');
var debug = _dereq_('debug')('engine.io-client:websocket');
var BrowserWebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Get either the `WebSocket` or `MozWebSocket` globals
 * in the browser or the WebSocket-compatible interface
 * exposed by `ws` for Node environment.
 */

var WebSocket = BrowserWebSocket || (typeof window !== 'undefined' ? null : _dereq_('ws'));

/**
 * Module exports.
 */

module.exports = WS;

/**
 * WebSocket transport constructor.
 *
 * @api {Object} connection options
 * @api public
 */

function WS(opts){
  var forceBase64 = (opts && opts.forceBase64);
  if (forceBase64) {
    this.supportsBinary = false;
  }
  this.perMessageDeflate = opts.perMessageDeflate;
  Transport.call(this, opts);
}

/**
 * Inherits from Transport.
 */

inherit(WS, Transport);

/**
 * Transport name.
 *
 * @api public
 */

WS.prototype.name = 'websocket';

/*
 * WebSockets support binary
 */

WS.prototype.supportsBinary = true;

/**
 * Opens socket.
 *
 * @api private
 */

WS.prototype.doOpen = function(){
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var self = this;
  var uri = this.uri();
  var protocols = void(0);
  var opts = {
    agent: this.agent,
    perMessageDeflate: this.perMessageDeflate
  };

  // SSL options for Node.js client
  opts.pfx = this.pfx;
  opts.key = this.key;
  opts.passphrase = this.passphrase;
  opts.cert = this.cert;
  opts.ca = this.ca;
  opts.ciphers = this.ciphers;
  opts.rejectUnauthorized = this.rejectUnauthorized;
  if (this.extraHeaders) {
    opts.headers = this.extraHeaders;
  }

  this.ws = BrowserWebSocket ? new WebSocket(uri) : new WebSocket(uri, protocols, opts);

  if (this.ws.binaryType === undefined) {
    this.supportsBinary = false;
  }

  if (this.ws.supports && this.ws.supports.binary) {
    this.supportsBinary = true;
    this.ws.binaryType = 'buffer';
  } else {
    this.ws.binaryType = 'arraybuffer';
  }

  this.addEventListeners();
};

/**
 * Adds event listeners to the socket
 *
 * @api private
 */

WS.prototype.addEventListeners = function(){
  var self = this;

  this.ws.onopen = function(){
    self.onOpen();
  };
  this.ws.onclose = function(){
    self.onClose();
  };
  this.ws.onmessage = function(ev){
    self.onData(ev.data);
  };
  this.ws.onerror = function(e){
    self.onError('websocket error', e);
  };
};

/**
 * Override `onData` to use a timer on iOS.
 * See: https://gist.github.com/mloughran/2052006
 *
 * @api private
 */

if ('undefined' != typeof navigator
  && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
  WS.prototype.onData = function(data){
    var self = this;
    setTimeout(function(){
      Transport.prototype.onData.call(self, data);
    }, 0);
  };
}

/**
 * Writes data to socket.
 *
 * @param {Array} array of packets.
 * @api private
 */

WS.prototype.write = function(packets){
  var self = this;
  this.writable = false;

  // encodePacket efficient as it uses WS framing
  // no need for encodePayload
  var total = packets.length;
  for (var i = 0, l = total; i < l; i++) {
    (function(packet) {
      parser.encodePacket(packet, self.supportsBinary, function(data) {
        if (!BrowserWebSocket) {
          // always create a new object (GH-437)
          var opts = {};
          if (packet.options) {
            opts.compress = packet.options.compress;
          }

          if (self.perMessageDeflate) {
            var len = 'string' == typeof data ? global.Buffer.byteLength(data) : data.length;
            if (len < self.perMessageDeflate.threshold) {
              opts.compress = false;
            }
          }
        }

        //Sometimes the websocket has already been closed but the browser didn't
        //have a chance of informing us about it yet, in that case send will
        //throw an error
        try {
          if (BrowserWebSocket) {
            // TypeError is thrown when passing the second argument on Safari
            self.ws.send(data);
          } else {
            self.ws.send(data, opts);
          }
        } catch (e){
          debug('websocket closed before onclose event');
        }

        --total || done();
      });
    })(packets[i]);
  }

  function done(){
    self.emit('flush');

    // fake drain
    // defer to next tick to allow Socket to clear writeBuffer
    setTimeout(function(){
      self.writable = true;
      self.emit('drain');
    }, 0);
  }
};

/**
 * Called upon close
 *
 * @api private
 */

WS.prototype.onClose = function(){
  Transport.prototype.onClose.call(this);
};

/**
 * Closes socket.
 *
 * @api private
 */

WS.prototype.doClose = function(){
  if (typeof this.ws !== 'undefined') {
    this.ws.close();
  }
};

/**
 * Generates uri for connection.
 *
 * @api private
 */

WS.prototype.uri = function(){
  var query = this.query || {};
  var schema = this.secure ? 'wss' : 'ws';
  var port = '';

  // avoid port if default for schema
  if (this.port && (('wss' == schema && this.port != 443)
    || ('ws' == schema && this.port != 80))) {
    port = ':' + this.port;
  }

  // append timestamp to URI
  if (this.timestampRequests) {
    query[this.timestampParam] = yeast();
  }

  // communicate binary support capabilities
  if (!this.supportsBinary) {
    query.b64 = 1;
  }

  query = parseqs.encode(query);

  // prepend ? to query
  if (query.length) {
    query = '?' + query;
  }

  var ipv6 = this.hostname.indexOf(':') !== -1;
  return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
};

/**
 * Feature detection for WebSocket.
 *
 * @return {Boolean} whether this transport is available.
 * @api public
 */

WS.prototype.check = function(){
  return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"../transport":19,"component-inherit":13,"debug":14,"engine.io-parser":27,"parseqs":38,"ws":undefined,"yeast":46}],25:[function(_dereq_,module,exports){
// browser shim for xmlhttprequest module
var hasCORS = _dereq_('has-cors');

module.exports = function(opts) {
  var xdomain = opts.xdomain;

  // scheme must be same when usign XDomainRequest
  // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
  var xscheme = opts.xscheme;

  // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
  // https://github.com/Automattic/engine.io-client/pull/217
  var enablesXDR = opts.enablesXDR;

  // XMLHttpRequest can be disabled on IE
  try {
    if ('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) { }

  // Use XDomainRequest for IE8 if enablesXDR is true
  // because loading bar keeps flashing when using jsonp-polling
  // https://github.com/yujiosaka/socke.io-ie8-loading-example
  try {
    if ('undefined' != typeof XDomainRequest && !xscheme && enablesXDR) {
      return new XDomainRequest();
    }
  } catch (e) { }

  if (!xdomain) {
    try {
      return new ActiveXObject('Microsoft.XMLHTTP');
    } catch(e) { }
  }
}

},{"has-cors":32}],26:[function(_dereq_,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],27:[function(_dereq_,module,exports){
(function (global){
/**
 * Module dependencies.
 */

var keys = _dereq_('keys');
var hasBinary = _dereq_('has-binary');
var sliceBuffer = _dereq_('arraybuffer.slice');
var base64encoder = _dereq_('base64-arraybuffer');
var after = _dereq_('after');
var utf8 = _dereq_('utf8');

/**
 * Check if we are running an android browser. That requires us to use
 * ArrayBuffer with polling transports...
 *
 * http://ghinda.net/jpeg-blob-ajax-android/
 */

var isAndroid = navigator.userAgent.match(/Android/i);

/**
 * Check if we are running in PhantomJS.
 * Uploading a Blob with PhantomJS does not work correctly, as reported here:
 * https://github.com/ariya/phantomjs/issues/11395
 * @type boolean
 */
var isPhantomJS = /PhantomJS/i.test(navigator.userAgent);

/**
 * When true, avoids using Blobs to encode payloads.
 * @type boolean
 */
var dontSendBlobs = isAndroid || isPhantomJS;

/**
 * Current protocol version.
 */

exports.protocol = 3;

/**
 * Packet types.
 */

var packets = exports.packets = {
    open:     0    // non-ws
  , close:    1    // non-ws
  , ping:     2
  , pong:     3
  , message:  4
  , upgrade:  5
  , noop:     6
};

var packetslist = keys(packets);

/**
 * Premade error packet.
 */

var err = { type: 'error', data: 'parser error' };

/**
 * Create a blob api even for blob builder when vendor prefixes exist
 */

var Blob = _dereq_('blob');

/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */

exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
  if ('function' == typeof supportsBinary) {
    callback = supportsBinary;
    supportsBinary = false;
  }

  if ('function' == typeof utf8encode) {
    callback = utf8encode;
    utf8encode = null;
  }

  var data = (packet.data === undefined)
    ? undefined
    : packet.data.buffer || packet.data;

  if (global.ArrayBuffer && data instanceof ArrayBuffer) {
    return encodeArrayBuffer(packet, supportsBinary, callback);
  } else if (Blob && data instanceof global.Blob) {
    return encodeBlob(packet, supportsBinary, callback);
  }

  // might be an object with { base64: true, data: dataAsBase64String }
  if (data && data.base64) {
    return encodeBase64Object(packet, callback);
  }

  // Sending data as a utf-8 string
  var encoded = packets[packet.type];

  // data fragment is optional
  if (undefined !== packet.data) {
    encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
  }

  return callback('' + encoded);

};

function encodeBase64Object(packet, callback) {
  // packet data is an object { base64: true, data: dataAsBase64String }
  var message = 'b' + exports.packets[packet.type] + packet.data.data;
  return callback(message);
}

/**
 * Encode packet helpers for binary types
 */

function encodeArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var data = packet.data;
  var contentArray = new Uint8Array(data);
  var resultBuffer = new Uint8Array(1 + data.byteLength);

  resultBuffer[0] = packets[packet.type];
  for (var i = 0; i < contentArray.length; i++) {
    resultBuffer[i+1] = contentArray[i];
  }

  return callback(resultBuffer.buffer);
}

function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  var fr = new FileReader();
  fr.onload = function() {
    packet.data = fr.result;
    exports.encodePacket(packet, supportsBinary, true, callback);
  };
  return fr.readAsArrayBuffer(packet.data);
}

function encodeBlob(packet, supportsBinary, callback) {
  if (!supportsBinary) {
    return exports.encodeBase64Packet(packet, callback);
  }

  if (dontSendBlobs) {
    return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
  }

  var length = new Uint8Array(1);
  length[0] = packets[packet.type];
  var blob = new Blob([length.buffer, packet.data]);

  return callback(blob);
}

/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */

exports.encodeBase64Packet = function(packet, callback) {
  var message = 'b' + exports.packets[packet.type];
  if (Blob && packet.data instanceof global.Blob) {
    var fr = new FileReader();
    fr.onload = function() {
      var b64 = fr.result.split(',')[1];
      callback(message + b64);
    };
    return fr.readAsDataURL(packet.data);
  }

  var b64data;
  try {
    b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
  } catch (e) {
    // iPhone Safari doesn't let you apply with typed arrays
    var typed = new Uint8Array(packet.data);
    var basic = new Array(typed.length);
    for (var i = 0; i < typed.length; i++) {
      basic[i] = typed[i];
    }
    b64data = String.fromCharCode.apply(null, basic);
  }
  message += global.btoa(b64data);
  return callback(message);
};

/**
 * Decodes a packet. Changes format to Blob if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */

exports.decodePacket = function (data, binaryType, utf8decode) {
  // String data
  if (typeof data == 'string' || data === undefined) {
    if (data.charAt(0) == 'b') {
      return exports.decodeBase64Packet(data.substr(1), binaryType);
    }

    if (utf8decode) {
      try {
        data = utf8.decode(data);
      } catch (e) {
        return err;
      }
    }
    var type = data.charAt(0);

    if (Number(type) != type || !packetslist[type]) {
      return err;
    }

    if (data.length > 1) {
      return { type: packetslist[type], data: data.substring(1) };
    } else {
      return { type: packetslist[type] };
    }
  }

  var asArray = new Uint8Array(data);
  var type = asArray[0];
  var rest = sliceBuffer(data, 1);
  if (Blob && binaryType === 'blob') {
    rest = new Blob([rest]);
  }
  return { type: packetslist[type], data: rest };
};

/**
 * Decodes a packet encoded in a base64 string
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */

exports.decodeBase64Packet = function(msg, binaryType) {
  var type = packetslist[msg.charAt(0)];
  if (!global.ArrayBuffer) {
    return { type: type, data: { base64: true, data: msg.substr(1) } };
  }

  var data = base64encoder.decode(msg.substr(1));

  if (binaryType === 'blob' && Blob) {
    data = new Blob([data]);
  }

  return { type: type, data: data };
};

/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */

exports.encodePayload = function (packets, supportsBinary, callback) {
  if (typeof supportsBinary == 'function') {
    callback = supportsBinary;
    supportsBinary = null;
  }

  var isBinary = hasBinary(packets);

  if (supportsBinary && isBinary) {
    if (Blob && !dontSendBlobs) {
      return exports.encodePayloadAsBlob(packets, callback);
    }

    return exports.encodePayloadAsArrayBuffer(packets, callback);
  }

  if (!packets.length) {
    return callback('0:');
  }

  function setLengthHeader(message) {
    return message.length + ':' + message;
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, !isBinary ? false : supportsBinary, true, function(message) {
      doneCallback(null, setLengthHeader(message));
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(results.join(''));
  });
};

/**
 * Async array map using after
 */

function map(ary, each, done) {
  var result = new Array(ary.length);
  var next = after(ary.length, done);

  var eachWithIndex = function(i, el, cb) {
    each(el, function(error, msg) {
      result[i] = msg;
      cb(error, result);
    });
  };

  for (var i = 0; i < ary.length; i++) {
    eachWithIndex(i, ary[i], next);
  }
}

/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */

exports.decodePayload = function (data, binaryType, callback) {
  if (typeof data != 'string') {
    return exports.decodePayloadAsBinary(data, binaryType, callback);
  }

  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var packet;
  if (data == '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

  var length = ''
    , n, msg;

  for (var i = 0, l = data.length; i < l; i++) {
    var chr = data.charAt(i);

    if (':' != chr) {
      length += chr;
    } else {
      if ('' == length || (length != (n = Number(length)))) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      msg = data.substr(i + 1, n);

      if (length != msg.length) {
        // parser error - ignoring payload
        return callback(err, 0, 1);
      }

      if (msg.length) {
        packet = exports.decodePacket(msg, binaryType, true);

        if (err.type == packet.type && err.data == packet.data) {
          // parser error in individual packet - ignoring payload
          return callback(err, 0, 1);
        }

        var ret = callback(packet, i + n, l);
        if (false === ret) return;
      }

      // advance cursor
      i += n;
      length = '';
    }
  }

  if (length != '') {
    // parser error - ignoring payload
    return callback(err, 0, 1);
  }

};

/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {ArrayBuffer} encoded payload
 * @api private
 */

exports.encodePayloadAsArrayBuffer = function(packets, callback) {
  if (!packets.length) {
    return callback(new ArrayBuffer(0));
  }

  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(data) {
      return doneCallback(null, data);
    });
  }

  map(packets, encodeOne, function(err, encodedPackets) {
    var totalLength = encodedPackets.reduce(function(acc, p) {
      var len;
      if (typeof p === 'string'){
        len = p.length;
      } else {
        len = p.byteLength;
      }
      return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
    }, 0);

    var resultArray = new Uint8Array(totalLength);

    var bufferIndex = 0;
    encodedPackets.forEach(function(p) {
      var isString = typeof p === 'string';
      var ab = p;
      if (isString) {
        var view = new Uint8Array(p.length);
        for (var i = 0; i < p.length; i++) {
          view[i] = p.charCodeAt(i);
        }
        ab = view.buffer;
      }

      if (isString) { // not true binary
        resultArray[bufferIndex++] = 0;
      } else { // true binary
        resultArray[bufferIndex++] = 1;
      }

      var lenStr = ab.byteLength.toString();
      for (var i = 0; i < lenStr.length; i++) {
        resultArray[bufferIndex++] = parseInt(lenStr[i]);
      }
      resultArray[bufferIndex++] = 255;

      var view = new Uint8Array(ab);
      for (var i = 0; i < view.length; i++) {
        resultArray[bufferIndex++] = view[i];
      }
    });

    return callback(resultArray.buffer);
  });
};

/**
 * Encode as Blob
 */

exports.encodePayloadAsBlob = function(packets, callback) {
  function encodeOne(packet, doneCallback) {
    exports.encodePacket(packet, true, true, function(encoded) {
      var binaryIdentifier = new Uint8Array(1);
      binaryIdentifier[0] = 1;
      if (typeof encoded === 'string') {
        var view = new Uint8Array(encoded.length);
        for (var i = 0; i < encoded.length; i++) {
          view[i] = encoded.charCodeAt(i);
        }
        encoded = view.buffer;
        binaryIdentifier[0] = 0;
      }

      var len = (encoded instanceof ArrayBuffer)
        ? encoded.byteLength
        : encoded.size;

      var lenStr = len.toString();
      var lengthAry = new Uint8Array(lenStr.length + 1);
      for (var i = 0; i < lenStr.length; i++) {
        lengthAry[i] = parseInt(lenStr[i]);
      }
      lengthAry[lenStr.length] = 255;

      if (Blob) {
        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
        doneCallback(null, blob);
      }
    });
  }

  map(packets, encodeOne, function(err, results) {
    return callback(new Blob(results));
  });
};

/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary
 *
 * @param {ArrayBuffer} data, callback method
 * @api public
 */

exports.decodePayloadAsBinary = function (data, binaryType, callback) {
  if (typeof binaryType === 'function') {
    callback = binaryType;
    binaryType = null;
  }

  var bufferTail = data;
  var buffers = [];

  var numberTooLong = false;
  while (bufferTail.byteLength > 0) {
    var tailArray = new Uint8Array(bufferTail);
    var isString = tailArray[0] === 0;
    var msgLength = '';

    for (var i = 1; ; i++) {
      if (tailArray[i] == 255) break;

      if (msgLength.length > 310) {
        numberTooLong = true;
        break;
      }

      msgLength += tailArray[i];
    }

    if(numberTooLong) return callback(err, 0, 1);

    bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
    msgLength = parseInt(msgLength);

    var msg = sliceBuffer(bufferTail, 0, msgLength);
    if (isString) {
      try {
        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
      } catch (e) {
        // iPhone Safari doesn't let you apply to typed arrays
        var typed = new Uint8Array(msg);
        msg = '';
        for (var i = 0; i < typed.length; i++) {
          msg += String.fromCharCode(typed[i]);
        }
      }
    }

    buffers.push(msg);
    bufferTail = sliceBuffer(bufferTail, msgLength);
  }

  var total = buffers.length;
  buffers.forEach(function(buffer, i) {
    callback(exports.decodePacket(buffer, binaryType, true), i, total);
  });
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"keys":28,"after":6,"arraybuffer.slice":7,"base64-arraybuffer":9,"blob":10,"has-binary":29,"utf8":45}],28:[function(_dereq_,module,exports){

/**
 * Gets the keys for an object.
 *
 * @return {Array} keys
 * @api private
 */

module.exports = Object.keys || function keys (obj){
  var arr = [];
  var has = Object.prototype.hasOwnProperty;

  for (var i in obj) {
    if (has.call(obj, i)) {
      arr.push(i);
    }
  }
  return arr;
};

},{}],29:[function(_dereq_,module,exports){
(function (global){

/*
 * Module requirements.
 */

var isArray = _dereq_('isarray');

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Right now only Buffer and ArrayBuffer are supported..
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary(data) {

  function _hasBinary(obj) {
    if (!obj) return false;

    if ( (global.Buffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
         (global.Blob && obj instanceof Blob) ||
         (global.File && obj instanceof File)
        ) {
      return true;
    }

    if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
          if (_hasBinary(obj[i])) {
              return true;
          }
      }
    } else if (obj && 'object' == typeof obj) {
      if (obj.toJSON) {
        obj = obj.toJSON();
      }

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
          return true;
        }
      }
    }

    return false;
  }

  return _hasBinary(data);
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"isarray":34}],30:[function(_dereq_,module,exports){

/**
 * Returns `this`. Execute this without a "context" (i.e. without it being
 * attached to an object of the left-hand side), and `this` points to the
 * "global" scope of the current JS execution.
 */

module.exports = (function () { return this; })();

},{}],31:[function(_dereq_,module,exports){
(function (global){

/*
 * Module requirements.
 */

var isArray = _dereq_('isarray');

/**
 * Module exports.
 */

module.exports = hasBinary;

/**
 * Checks for binary data.
 *
 * Right now only Buffer and ArrayBuffer are supported..
 *
 * @param {Object} anything
 * @api public
 */

function hasBinary(data) {

  function _hasBinary(obj) {
    if (!obj) return false;

    if ( (global.Buffer && global.Buffer.isBuffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
         (global.Blob && obj instanceof Blob) ||
         (global.File && obj instanceof File)
        ) {
      return true;
    }

    if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
          if (_hasBinary(obj[i])) {
              return true;
          }
      }
    } else if (obj && 'object' == typeof obj) {
      // see: https://github.com/Automattic/has-binary/pull/4
      if (obj.toJSON && 'function' == typeof obj.toJSON) {
        obj = obj.toJSON();
      }

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
          return true;
        }
      }
    }

    return false;
  }

  return _hasBinary(data);
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"isarray":34}],32:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var global = _dereq_('global');

/**
 * Module exports.
 *
 * Logic borrowed from Modernizr:
 *
 *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
 */

try {
  module.exports = 'XMLHttpRequest' in global &&
    'withCredentials' in new global.XMLHttpRequest();
} catch (err) {
  // if XMLHttp support is disabled in IE then it will throw
  // when trying to create
  module.exports = false;
}

},{"global":30}],33:[function(_dereq_,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],34:[function(_dereq_,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],35:[function(_dereq_,module,exports){
(function (global){
/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
;(function () {
  // Detect the `define` function exposed by asynchronous module loaders. The
  // strict `define` check is necessary for compatibility with `r.js`.
  var isLoader = typeof define === "function" && define.amd;

  // A set of types used to distinguish objects from primitives.
  var objectTypes = {
    "function": true,
    "object": true
  };

  // Detect the `exports` object exposed by CommonJS implementations.
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  // Use the `global` object exposed by Node (including Browserify via
  // `insert-module-globals`), Narwhal, and Ringo as the default context,
  // and the `window` object in browsers. Rhino exports a `global` function
  // instead.
  var root = objectTypes[typeof window] && window || this,
      freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

  if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
    root = freeGlobal;
  }

  // Public: Initializes JSON 3 using the given `context` object, attaching the
  // `stringify` and `parse` functions to the specified `exports` object.
  function runInContext(context, exports) {
    context || (context = root["Object"]());
    exports || (exports = root["Object"]());

    // Native constructor aliases.
    var Number = context["Number"] || root["Number"],
        String = context["String"] || root["String"],
        Object = context["Object"] || root["Object"],
        Date = context["Date"] || root["Date"],
        SyntaxError = context["SyntaxError"] || root["SyntaxError"],
        TypeError = context["TypeError"] || root["TypeError"],
        Math = context["Math"] || root["Math"],
        nativeJSON = context["JSON"] || root["JSON"];

    // Delegate to the native `stringify` and `parse` implementations.
    if (typeof nativeJSON == "object" && nativeJSON) {
      exports.stringify = nativeJSON.stringify;
      exports.parse = nativeJSON.parse;
    }

    // Convenience aliases.
    var objectProto = Object.prototype,
        getClass = objectProto.toString,
        isProperty, forEach, undef;

    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
    var isExtended = new Date(-3509827334573292);
    try {
      // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
      // results for certain dates in Opera >= 10.53.
      isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
        // Safari < 2.0.2 stores the internal millisecond time value correctly,
        // but clips the values returned by the date methods to the range of
        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
    } catch (exception) {}

    // Internal: Determines whether the native `JSON.stringify` and `parse`
    // implementations are spec-compliant. Based on work by Ken Snyder.
    function has(name) {
      if (has[name] !== undef) {
        // Return cached feature test result.
        return has[name];
      }
      var isSupported;
      if (name == "bug-string-char-index") {
        // IE <= 7 doesn't support accessing string characters using square
        // bracket notation. IE 8 only supports this for primitives.
        isSupported = "a"[0] != "a";
      } else if (name == "json") {
        // Indicates whether both `JSON.stringify` and `JSON.parse` are
        // supported.
        isSupported = has("json-stringify") && has("json-parse");
      } else {
        var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
        // Test `JSON.stringify`.
        if (name == "json-stringify") {
          var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
          if (stringifySupported) {
            // A test function object with a custom `toJSON` method.
            (value = function () {
              return 1;
            }).toJSON = value;
            try {
              stringifySupported =
                // Firefox 3.1b1 and b2 serialize string, number, and boolean
                // primitives as object literals.
                stringify(0) === "0" &&
                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                // literals.
                stringify(new Number()) === "0" &&
                stringify(new String()) == '""' &&
                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                // does not define a canonical JSON representation (this applies to
                // objects with `toJSON` properties as well, *unless* they are nested
                // within an object or array).
                stringify(getClass) === undef &&
                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                // FF 3.1b3 pass this test.
                stringify(undef) === undef &&
                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                // respectively, if the value is omitted entirely.
                stringify() === undef &&
                // FF 3.1b1, 2 throw an error if the given value is not a number,
                // string, array, object, Boolean, or `null` literal. This applies to
                // objects with custom `toJSON` methods as well, unless they are nested
                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                // methods entirely.
                stringify(value) === "1" &&
                stringify([value]) == "[1]" &&
                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                // `"[null]"`.
                stringify([undef]) == "[null]" &&
                // YUI 3.0.0b1 fails to serialize `null` literals.
                stringify(null) == "null" &&
                // FF 3.1b1, 2 halts serialization if an array contains a function:
                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                // elides non-JSON values from objects and arrays, unless they
                // define custom `toJSON` methods.
                stringify([undef, getClass, null]) == "[null,null,null]" &&
                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                stringify(null, value) === "1" &&
                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                // serialize extended years.
                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                // The milliseconds are optional in ES 5, but required in 5.1.
                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                // four-digit years instead of six-digit years. Credits: @Yaffle.
                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                // values less than 1000. Credits: @Yaffle.
                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
            } catch (exception) {
              stringifySupported = false;
            }
          }
          isSupported = stringifySupported;
        }
        // Test `JSON.parse`.
        if (name == "json-parse") {
          var parse = exports.parse;
          if (typeof parse == "function") {
            try {
              // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
              // Conforming implementations should also coerce the initial argument to
              // a string prior to parsing.
              if (parse("0") === 0 && !parse(false)) {
                // Simple parsing test.
                value = parse(serialized);
                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                if (parseSupported) {
                  try {
                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                    parseSupported = !parse('"\t"');
                  } catch (exception) {}
                  if (parseSupported) {
                    try {
                      // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                      // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                      // certain octal literals.
                      parseSupported = parse("01") !== 1;
                    } catch (exception) {}
                  }
                  if (parseSupported) {
                    try {
                      // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                      // points. These environments, along with FF 3.1b1 and 2,
                      // also allow trailing commas in JSON objects and arrays.
                      parseSupported = parse("1.") !== 1;
                    } catch (exception) {}
                  }
                }
              }
            } catch (exception) {
              parseSupported = false;
            }
          }
          isSupported = parseSupported;
        }
      }
      return has[name] = !!isSupported;
    }

    if (!has("json")) {
      // Common `[[Class]]` name aliases.
      var functionClass = "[object Function]",
          dateClass = "[object Date]",
          numberClass = "[object Number]",
          stringClass = "[object String]",
          arrayClass = "[object Array]",
          booleanClass = "[object Boolean]";

      // Detect incomplete support for accessing string characters by index.
      var charIndexBuggy = has("bug-string-char-index");

      // Define additional utility methods if the `Date` methods are buggy.
      if (!isExtended) {
        var floor = Math.floor;
        // A mapping between the months of the year and the number of days between
        // January 1st and the first of the respective month.
        var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
        // Internal: Calculates the number of days between the Unix epoch and the
        // first day of the given month.
        var getDay = function (year, month) {
          return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
        };
      }

      // Internal: Determines if a property is a direct property of the given
      // object. Delegates to the native `Object#hasOwnProperty` method.
      if (!(isProperty = objectProto.hasOwnProperty)) {
        isProperty = function (property) {
          var members = {}, constructor;
          if ((members.__proto__ = null, members.__proto__ = {
            // The *proto* property cannot be set multiple times in recent
            // versions of Firefox and SeaMonkey.
            "toString": 1
          }, members).toString != getClass) {
            // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
            // supports the mutable *proto* property.
            isProperty = function (property) {
              // Capture and break the object's prototype chain (see section 8.6.2
              // of the ES 5.1 spec). The parenthesized expression prevents an
              // unsafe transformation by the Closure Compiler.
              var original = this.__proto__, result = property in (this.__proto__ = null, this);
              // Restore the original prototype chain.
              this.__proto__ = original;
              return result;
            };
          } else {
            // Capture a reference to the top-level `Object` constructor.
            constructor = members.constructor;
            // Use the `constructor` property to simulate `Object#hasOwnProperty` in
            // other environments.
            isProperty = function (property) {
              var parent = (this.constructor || constructor).prototype;
              return property in this && !(property in parent && this[property] === parent[property]);
            };
          }
          members = null;
          return isProperty.call(this, property);
        };
      }

      // Internal: Normalizes the `for...in` iteration algorithm across
      // environments. Each enumerated key is yielded to a `callback` function.
      forEach = function (object, callback) {
        var size = 0, Properties, members, property;

        // Tests for bugs in the current environment's `for...in` algorithm. The
        // `valueOf` property inherits the non-enumerable flag from
        // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
        (Properties = function () {
          this.valueOf = 0;
        }).prototype.valueOf = 0;

        // Iterate over a new instance of the `Properties` class.
        members = new Properties();
        for (property in members) {
          // Ignore all properties inherited from `Object.prototype`.
          if (isProperty.call(members, property)) {
            size++;
          }
        }
        Properties = members = null;

        // Normalize the iteration algorithm.
        if (!size) {
          // A list of non-enumerable properties inherited from `Object.prototype`.
          members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
          // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
          // properties.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, length;
            var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
            for (property in object) {
              // Gecko <= 1.0 enumerates the `prototype` property of functions under
              // certain conditions; IE does not.
              if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                callback(property);
              }
            }
            // Manually invoke the callback for each non-enumerable property.
            for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
          };
        } else if (size == 2) {
          // Safari <= 2.0.4 enumerates shadowed properties twice.
          forEach = function (object, callback) {
            // Create a set of iterated properties.
            var members = {}, isFunction = getClass.call(object) == functionClass, property;
            for (property in object) {
              // Store each property name to prevent double enumeration. The
              // `prototype` property of functions is not enumerated due to cross-
              // environment inconsistencies.
              if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                callback(property);
              }
            }
          };
        } else {
          // No bugs detected; use the standard `for...in` algorithm.
          forEach = function (object, callback) {
            var isFunction = getClass.call(object) == functionClass, property, isConstructor;
            for (property in object) {
              if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                callback(property);
              }
            }
            // Manually invoke the callback for the `constructor` property due to
            // cross-environment inconsistencies.
            if (isConstructor || isProperty.call(object, (property = "constructor"))) {
              callback(property);
            }
          };
        }
        return forEach(object, callback);
      };

      // Public: Serializes a JavaScript `value` as a JSON string. The optional
      // `filter` argument may specify either a function that alters how object and
      // array members are serialized, or an array of strings and numbers that
      // indicates which properties should be serialized. The optional `width`
      // argument may be either a string or number that specifies the indentation
      // level of the output.
      if (!has("json-stringify")) {
        // Internal: A map of control characters and their escaped equivalents.
        var Escapes = {
          92: "\\\\",
          34: '\\"',
          8: "\\b",
          12: "\\f",
          10: "\\n",
          13: "\\r",
          9: "\\t"
        };

        // Internal: Converts `value` into a zero-padded string such that its
        // length is at least equal to `width`. The `width` must be <= 6.
        var leadingZeroes = "000000";
        var toPaddedString = function (width, value) {
          // The `|| 0` expression is necessary to work around a bug in
          // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
          return (leadingZeroes + (value || 0)).slice(-width);
        };

        // Internal: Double-quotes a string `value`, replacing all ASCII control
        // characters (characters with code unit values between 0 and 31) with
        // their escaped equivalents. This is an implementation of the
        // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
        var unicodePrefix = "\\u00";
        var quote = function (value) {
          var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
          var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
          for (; index < length; index++) {
            var charCode = value.charCodeAt(index);
            // If the character is a control character, append its Unicode or
            // shorthand escape sequence; otherwise, append the character as-is.
            switch (charCode) {
              case 8: case 9: case 10: case 12: case 13: case 34: case 92:
                result += Escapes[charCode];
                break;
              default:
                if (charCode < 32) {
                  result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                  break;
                }
                result += useCharIndex ? symbols[index] : value.charAt(index);
            }
          }
          return result + '"';
        };

        // Internal: Recursively serializes an object. Implements the
        // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
        var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
          var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
          try {
            // Necessary for host object support.
            value = object[property];
          } catch (exception) {}
          if (typeof value == "object" && value) {
            className = getClass.call(value);
            if (className == dateClass && !isProperty.call(value, "toJSON")) {
              if (value > -1 / 0 && value < 1 / 0) {
                // Dates are serialized according to the `Date#toJSON` method
                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                // for the ISO 8601 date time string format.
                if (getDay) {
                  // Manually compute the year, month, date, hours, minutes,
                  // seconds, and milliseconds if the `getUTC*` methods are
                  // buggy. Adapted from @Yaffle's `date-shim` project.
                  date = floor(value / 864e5);
                  for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                  for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                  date = 1 + date - getDay(year, month);
                  // The `time` value specifies the time within the day (see ES
                  // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                  // to compute `A modulo B`, as the `%` operator does not
                  // correspond to the `modulo` operation for negative numbers.
                  time = (value % 864e5 + 864e5) % 864e5;
                  // The hours, minutes, seconds, and milliseconds are obtained by
                  // decomposing the time within the day. See section 15.9.1.10.
                  hours = floor(time / 36e5) % 24;
                  minutes = floor(time / 6e4) % 60;
                  seconds = floor(time / 1e3) % 60;
                  milliseconds = time % 1e3;
                } else {
                  year = value.getUTCFullYear();
                  month = value.getUTCMonth();
                  date = value.getUTCDate();
                  hours = value.getUTCHours();
                  minutes = value.getUTCMinutes();
                  seconds = value.getUTCSeconds();
                  milliseconds = value.getUTCMilliseconds();
                }
                // Serialize extended years correctly.
                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                  "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                  // Months, dates, hours, minutes, and seconds should have two
                  // digits; milliseconds should have three.
                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                  // Milliseconds are optional in ES 5.0, but required in 5.1.
                  "." + toPaddedString(3, milliseconds) + "Z";
              } else {
                value = null;
              }
            } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
              // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
              // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
              // ignores all `toJSON` methods on these objects unless they are
              // defined directly on an instance.
              value = value.toJSON(property);
            }
          }
          if (callback) {
            // If a replacement function was provided, call it to obtain the value
            // for serialization.
            value = callback.call(object, property, value);
          }
          if (value === null) {
            return "null";
          }
          className = getClass.call(value);
          if (className == booleanClass) {
            // Booleans are represented literally.
            return "" + value;
          } else if (className == numberClass) {
            // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
            // `"null"`.
            return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
          } else if (className == stringClass) {
            // Strings are double-quoted and escaped.
            return quote("" + value);
          }
          // Recursively serialize objects and arrays.
          if (typeof value == "object") {
            // Check for cyclic structures. This is a linear search; performance
            // is inversely proportional to the number of unique nested objects.
            for (length = stack.length; length--;) {
              if (stack[length] === value) {
                // Cyclic structures cannot be serialized by `JSON.stringify`.
                throw TypeError();
              }
            }
            // Add the object to the stack of traversed objects.
            stack.push(value);
            results = [];
            // Save the current indentation level and indent one additional level.
            prefix = indentation;
            indentation += whitespace;
            if (className == arrayClass) {
              // Recursively serialize array elements.
              for (index = 0, length = value.length; index < length; index++) {
                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                results.push(element === undef ? "null" : element);
              }
              result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
            } else {
              // Recursively serialize object members. Members are selected from
              // either a user-specified list of property names, or the object
              // itself.
              forEach(properties || value, function (property) {
                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                if (element !== undef) {
                  // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                  // is not the empty string, let `member` {quote(property) + ":"}
                  // be the concatenation of `member` and the `space` character."
                  // The "`space` character" refers to the literal space
                  // character, not the `space` {width} argument provided to
                  // `JSON.stringify`.
                  results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                }
              });
              result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
            }
            // Remove the object from the traversed object stack.
            stack.pop();
            return result;
          }
        };

        // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
        exports.stringify = function (source, filter, width) {
          var whitespace, callback, properties, className;
          if (objectTypes[typeof filter] && filter) {
            if ((className = getClass.call(filter)) == functionClass) {
              callback = filter;
            } else if (className == arrayClass) {
              // Convert the property names array into a makeshift set.
              properties = {};
              for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
            }
          }
          if (width) {
            if ((className = getClass.call(width)) == numberClass) {
              // Convert the `width` to an integer and create a string containing
              // `width` number of space characters.
              if ((width -= width % 1) > 0) {
                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
              }
            } else if (className == stringClass) {
              whitespace = width.length <= 10 ? width : width.slice(0, 10);
            }
          }
          // Opera <= 7.54u2 discards the values associated with empty string keys
          // (`""`) only if they are used directly within an object member list
          // (e.g., `!("" in { "": 1})`).
          return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
        };
      }

      // Public: Parses a JSON source string.
      if (!has("json-parse")) {
        var fromCharCode = String.fromCharCode;

        // Internal: A map of escaped control characters and their unescaped
        // equivalents.
        var Unescapes = {
          92: "\\",
          34: '"',
          47: "../default.htm",
          98: "\b",
          116: "\t",
          110: "\n",
          102: "\f",
          114: "\r"
        };

        // Internal: Stores the parser state.
        var Index, Source;

        // Internal: Resets the parser state and throws a `SyntaxError`.
        var abort = function () {
          Index = Source = null;
          throw SyntaxError();
        };

        // Internal: Returns the next token, or `"$"` if the parser has reached
        // the end of the source string. A token may be a string, number, `null`
        // literal, or Boolean literal.
        var lex = function () {
          var source = Source, length = source.length, value, begin, position, isSigned, charCode;
          while (Index < length) {
            charCode = source.charCodeAt(Index);
            switch (charCode) {
              case 9: case 10: case 13: case 32:
                // Skip whitespace tokens, including tabs, carriage returns, line
                // feeds, and space characters.
                Index++;
                break;
              case 123: case 125: case 91: case 93: case 58: case 44:
                // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                // the current position.
                value = charIndexBuggy ? source.charAt(Index) : source[Index];
                Index++;
                return value;
              case 34:
                // `"` delimits a JSON string; advance to the next character and
                // begin parsing the string. String tokens are prefixed with the
                // sentinel `@` character to distinguish them from punctuators and
                // end-of-string tokens.
                for (value = "@", Index++; Index < length;) {
                  charCode = source.charCodeAt(Index);
                  if (charCode < 32) {
                    // Unescaped ASCII control characters (those with a code unit
                    // less than the space character) are not permitted.
                    abort();
                  } else if (charCode == 92) {
                    // A reverse solidus (`\`) marks the beginning of an escaped
                    // control character (including `"`, `\`, and `/`) or Unicode
                    // escape sequence.
                    charCode = source.charCodeAt(++Index);
                    switch (charCode) {
                      case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                        // Revive escaped control characters.
                        value += Unescapes[charCode];
                        Index++;
                        break;
                      case 117:
                        // `\u` marks the beginning of a Unicode escape sequence.
                        // Advance to the first character and validate the
                        // four-digit code point.
                        begin = ++Index;
                        for (position = Index + 4; Index < position; Index++) {
                          charCode = source.charCodeAt(Index);
                          // A valid sequence comprises four hexdigits (case-
                          // insensitive) that form a single hexadecimal value.
                          if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                            // Invalid Unicode escape sequence.
                            abort();
                          }
                        }
                        // Revive the escaped character.
                        value += fromCharCode("0x" + source.slice(begin, Index));
                        break;
                      default:
                        // Invalid escape sequence.
                        abort();
                    }
                  } else {
                    if (charCode == 34) {
                      // An unescaped double-quote character marks the end of the
                      // string.
                      break;
                    }
                    charCode = source.charCodeAt(Index);
                    begin = Index;
                    // Optimize for the common case where a string is valid.
                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
                      charCode = source.charCodeAt(++Index);
                    }
                    // Append the string as-is.
                    value += source.slice(begin, Index);
                  }
                }
                if (source.charCodeAt(Index) == 34) {
                  // Advance to the next character and return the revived string.
                  Index++;
                  return value;
                }
                // Unterminated string.
                abort();
              default:
                // Parse numbers and literals.
                begin = Index;
                // Advance past the negative sign, if one is specified.
                if (charCode == 45) {
                  isSigned = true;
                  charCode = source.charCodeAt(++Index);
                }
                // Parse an integer or floating-point value.
                if (charCode >= 48 && charCode <= 57) {
                  // Leading zeroes are interpreted as octal literals.
                  if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                    // Illegal octal literal.
                    abort();
                  }
                  isSigned = false;
                  // Parse the integer component.
                  for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                  // Floats cannot contain a leading decimal point; however, this
                  // case is already accounted for by the parser.
                  if (source.charCodeAt(Index) == 46) {
                    position = ++Index;
                    // Parse the decimal component.
                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal trailing decimal.
                      abort();
                    }
                    Index = position;
                  }
                  // Parse exponents. The `e` denoting the exponent is
                  // case-insensitive.
                  charCode = source.charCodeAt(Index);
                  if (charCode == 101 || charCode == 69) {
                    charCode = source.charCodeAt(++Index);
                    // Skip past the sign following the exponent, if one is
                    // specified.
                    if (charCode == 43 || charCode == 45) {
                      Index++;
                    }
                    // Parse the exponential component.
                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                    if (position == Index) {
                      // Illegal empty exponent.
                      abort();
                    }
                    Index = position;
                  }
                  // Coerce the parsed value to a JavaScript number.
                  return +source.slice(begin, Index);
                }
                // A negative sign may only precede numbers.
                if (isSigned) {
                  abort();
                }
                // `true`, `false`, and `null` literals.
                if (source.slice(Index, Index + 4) == "true") {
                  Index += 4;
                  return true;
                } else if (source.slice(Index, Index + 5) == "false") {
                  Index += 5;
                  return false;
                } else if (source.slice(Index, Index + 4) == "null") {
                  Index += 4;
                  return null;
                }
                // Unrecognized token.
                abort();
            }
          }
          // Return the sentinel `$` character if the parser has reached the end
          // of the source string.
          return "$";
        };

        // Internal: Parses a JSON `value` token.
        var get = function (value) {
          var results, hasMembers;
          if (value == "$") {
            // Unexpected end of input.
            abort();
          }
          if (typeof value == "string") {
            if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
              // Remove the sentinel `@` character.
              return value.slice(1);
            }
            // Parse object and array literals.
            if (value == "[") {
              // Parses a JSON array, returning a new JavaScript array.
              results = [];
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing square bracket marks the end of the array literal.
                if (value == "]") {
                  break;
                }
                // If the array literal contains elements, the current token
                // should be a comma separating the previous element from the
                // next.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "]") {
                      // Unexpected trailing `,` in array literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each array element.
                    abort();
                  }
                }
                // Elisions and leading commas are not permitted.
                if (value == ",") {
                  abort();
                }
                results.push(get(value));
              }
              return results;
            } else if (value == "{") {
              // Parses a JSON object, returning a new JavaScript object.
              results = {};
              for (;; hasMembers || (hasMembers = true)) {
                value = lex();
                // A closing curly brace marks the end of the object literal.
                if (value == "}") {
                  break;
                }
                // If the object literal contains members, the current token
                // should be a comma separator.
                if (hasMembers) {
                  if (value == ",") {
                    value = lex();
                    if (value == "}") {
                      // Unexpected trailing `,` in object literal.
                      abort();
                    }
                  } else {
                    // A `,` must separate each object member.
                    abort();
                  }
                }
                // Leading commas are not permitted, object property names must be
                // double-quoted strings, and a `:` must separate each property
                // name and value.
                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                  abort();
                }
                results[value.slice(1)] = get(lex());
              }
              return results;
            }
            // Unexpected token encountered.
            abort();
          }
          return value;
        };

        // Internal: Updates a traversed object member.
        var update = function (source, property, callback) {
          var element = walk(source, property, callback);
          if (element === undef) {
            delete source[property];
          } else {
            source[property] = element;
          }
        };

        // Internal: Recursively traverses a parsed JSON object, invoking the
        // `callback` function for each value. This is an implementation of the
        // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
        var walk = function (source, property, callback) {
          var value = source[property], length;
          if (typeof value == "object" && value) {
            // `forEach` can't be used to traverse an array in Opera <= 8.54
            // because its `Object#hasOwnProperty` implementation returns `false`
            // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
            if (getClass.call(value) == arrayClass) {
              for (length = value.length; length--;) {
                update(value, length, callback);
              }
            } else {
              forEach(value, function (property) {
                update(value, property, callback);
              });
            }
          }
          return callback.call(source, property, value);
        };

        // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
        exports.parse = function (source, callback) {
          var result, value;
          Index = 0;
          Source = "" + source;
          result = get(lex());
          // If a JSON string contains multiple tokens, it is invalid.
          if (lex() != "$") {
            abort();
          }
          // Reset the parser state.
          Index = Source = null;
          return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
        };
      }
    }

    exports["runInContext"] = runInContext;
    return exports;
  }

  if (freeExports && !isLoader) {
    // Export for CommonJS environments.
    runInContext(root, freeExports);
  } else {
    // Export for web browsers and JavaScript engines.
    var nativeJSON = root.JSON,
        previousJSON = root["JSON3"],
        isRestored = false;

    var JSON3 = runInContext(root, (root["JSON3"] = {
      // Public: Restores the original value of the global `JSON` object and
      // returns a reference to the `JSON3` object.
      "noConflict": function () {
        if (!isRestored) {
          isRestored = true;
          root.JSON = nativeJSON;
          root["JSON3"] = previousJSON;
          nativeJSON = previousJSON = null;
        }
        return JSON3;
      }
    }));

    root.JSON = {
      "parse": JSON3.parse,
      "stringify": JSON3.stringify
    };
  }

  // Export for asynchronous module loaders.
  if (isLoader) {
    define(function () {
      return JSON3;
    });
  }
}).call(this);

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{}],36:[function(_dereq_,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = '' + str;
  if (str.length > 10000) return;
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],37:[function(_dereq_,module,exports){
(function (global){
/**
 * JSON parse.
 *
 * @see Based on jQuery#parseJSON (MIT) and JSON2
 * @api private
 */

var rvalidchars = /^[\],:{}\s]*$/;
var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
var rtrimLeft = /^\s+/;
var rtrimRight = /\s+$/;

module.exports = function parsejson(data) {
  if ('string' != typeof data || !data) {
    return null;
  }

  data = data.replace(rtrimLeft, '').replace(rtrimRight, '');

  // Attempt to parse using the native JSON parser first
  if (global.JSON && JSON.parse) {
    return JSON.parse(data);
  }

  if (rvalidchars.test(data.replace(rvalidescape, '@')
      .replace(rvalidtokens, ']')
      .replace(rvalidbraces, ''))) {
    return (new Function('return ' + data))();
  }
};
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{}],38:[function(_dereq_,module,exports){
/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */

exports.encode = function (obj) {
  var str = '';

  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length) str += '&';
      str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
    }
  }

  return str;
};

/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */

exports.decode = function(qs){
  var qry = {};
  var pairs = qs.split('&');
  for (var i = 0, l = pairs.length; i < l; i++) {
    var pair = pairs[i].split('=');
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
};

},{}],39:[function(_dereq_,module,exports){
/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */

var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

var parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];

module.exports = function parseuri(str) {
    var src = str,
        b = str.indexOf('['),
        e = str.indexOf(']');

    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }

    var m = re.exec(str || ''),
        uri = {},
        i = 14;

    while (i--) {
        uri[parts[i]] = m[i] || '';
    }

    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }

    return uri;
};

},{}],40:[function(_dereq_,module,exports){
(function (global){
/*global Blob,File*/

/**
 * Module requirements
 */

var isArray = _dereq_('isarray');
var isBuf = _dereq_('is-buffer');

/**
 * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
 * Anything with blobs or files should be fed through removeBlobs before coming
 * here.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @api public
 */

exports.deconstructPacket = function(packet){
  var buffers = [];
  var packetData = packet.data;

  function _deconstructPacket(data) {
    if (!data) return data;

    if (isBuf(data)) {
      var placeholder = { _placeholder: true, num: buffers.length };
      buffers.push(data);
      return placeholder;
    } else if (isArray(data)) {
      var newData = new Array(data.length);
      for (var i = 0; i < data.length; i++) {
        newData[i] = _deconstructPacket(data[i]);
      }
      return newData;
    } else if ('object' == typeof data && !(data instanceof Date)) {
      var newData = {};
      for (var key in data) {
        newData[key] = _deconstructPacket(data[key]);
      }
      return newData;
    }
    return data;
  }

  var pack = packet;
  pack.data = _deconstructPacket(packetData);
  pack.attachments = buffers.length; // number of binary 'attachments'
  return {packet: pack, buffers: buffers};
};

/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @api public
 */

exports.reconstructPacket = function(packet, buffers) {
  var curPlaceHolder = 0;

  function _reconstructPacket(data) {
    if (data && data._placeholder) {
      var buf = buffers[data.num]; // appropriate buffer (should be natural order anyway)
      return buf;
    } else if (isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        data[i] = _reconstructPacket(data[i]);
      }
      return data;
    } else if (data && 'object' == typeof data) {
      for (var key in data) {
        data[key] = _reconstructPacket(data[key]);
      }
      return data;
    }
    return data;
  }

  packet.data = _reconstructPacket(packet.data);
  packet.attachments = undefined; // no longer useful
  return packet;
};

/**
 * Asynchronously removes Blobs or Files from data via
 * FileReader's readAsArrayBuffer method. Used before encoding
 * data as msgpack. Calls callback with the blobless data.
 *
 * @param {Object} data
 * @param {Function} callback
 * @api private
 */

exports.removeBlobs = function(data, callback) {
  function _removeBlobs(obj, curKey, containingObject) {
    if (!obj) return obj;

    // convert any blob
    if ((global.Blob && obj instanceof Blob) ||
        (global.File && obj instanceof File)) {
      pendingBlobs++;

      // async filereader
      var fileReader = new FileReader();
      fileReader.onload = function() { // this.result == arraybuffer
        if (containingObject) {
          containingObject[curKey] = this.result;
        }
        else {
          bloblessData = this.result;
        }

        // if nothing pending its callback time
        if(! --pendingBlobs) {
          callback(bloblessData);
        }
      };

      fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
    } else if (isArray(obj)) { // handle array
      for (var i = 0; i < obj.length; i++) {
        _removeBlobs(obj[i], i, obj);
      }
    } else if (obj && 'object' == typeof obj && !isBuf(obj)) { // and object
      for (var key in obj) {
        _removeBlobs(obj[key], key, obj);
      }
    }
  }

  var pendingBlobs = 0;
  var bloblessData = data;
  _removeBlobs(bloblessData);
  if (!pendingBlobs) {
    callback(bloblessData);
  }
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{"is-buffer":42,"isarray":34}],41:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var debug = _dereq_('debug')('socket.io-parser');
var json = _dereq_('json3');
var isArray = _dereq_('isarray');
var Emitter = _dereq_('component-emitter');
var binary = _dereq_('binary');
var isBuf = _dereq_('is-buffer');

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = 4;

/**
 * Packet types.
 *
 * @api public
 */

exports.types = [
  'CONNECT',
  'DISCONNECT',
  'EVENT',
  'BINARY_EVENT',
  'ACK',
  'BINARY_ACK',
  'ERROR'
];

/**
 * Packet type `connect`.
 *
 * @api public
 */

exports.CONNECT = 0;

/**
 * Packet type `disconnect`.
 *
 * @api public
 */

exports.DISCONNECT = 1;

/**
 * Packet type `event`.
 *
 * @api public
 */

exports.EVENT = 2;

/**
 * Packet type `ack`.
 *
 * @api public
 */

exports.ACK = 3;

/**
 * Packet type `error`.
 *
 * @api public
 */

exports.ERROR = 4;

/**
 * Packet type 'binary event'
 *
 * @api public
 */

exports.BINARY_EVENT = 5;

/**
 * Packet type `binary ack`. For acks with binary arguments.
 *
 * @api public
 */

exports.BINARY_ACK = 6;

/**
 * Encoder constructor.
 *
 * @api public
 */

exports.Encoder = Encoder;

/**
 * Decoder constructor.
 *
 * @api public
 */

exports.Decoder = Decoder;

/**
 * A socket.io Encoder instance
 *
 * @api public
 */

function Encoder() {}

/**
 * Encode a packet as a single string if non-binary, or as a
 * buffer sequence, depending on packet type.
 *
 * @param {Object} obj - packet object
 * @param {Function} callback - function to handle encodings (likely engine.write)
 * @return Calls callback with Array of encodings
 * @api public
 */

Encoder.prototype.encode = function(obj, callback){
  debug('encoding packet %j', obj);

  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
    encodeAsBinary(obj, callback);
  }
  else {
    var encoding = encodeAsString(obj);
    callback([encoding]);
  }
};

/**
 * Encode packet as string.
 *
 * @param {Object} packet
 * @return {String} encoded
 * @api private
 */

function encodeAsString(obj) {
  var str = '';
  var nsp = false;

  // first is type
  str += obj.type;

  // attachments if we have them
  if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
    str += obj.attachments;
    str += '-';
  }

  // if we have a namespace other than `/`
  // we append it followed by a comma `,`
  if (obj.nsp && '../default.htm' != obj.nsp) {
    nsp = true;
    str += obj.nsp;
  }

  // immediately followed by the id
  if (null != obj.id) {
    if (nsp) {
      str += ',';
      nsp = false;
    }
    str += obj.id;
  }

  // json data
  if (null != obj.data) {
    if (nsp) str += ',';
    str += json.stringify(obj.data);
  }

  debug('encoded %j as %s', obj, str);
  return str;
}

/**
 * Encode packet as 'buffer sequence' by removing blobs, and
 * deconstructing packet into object with placeholders and
 * a list of buffers.
 *
 * @param {Object} packet
 * @return {Buffer} encoded
 * @api private
 */

function encodeAsBinary(obj, callback) {

  function writeEncoding(bloblessData) {
    var deconstruction = binary.deconstructPacket(bloblessData);
    var pack = encodeAsString(deconstruction.packet);
    var buffers = deconstruction.buffers;

    buffers.unshift(pack); // add packet info to beginning of data list
    callback(buffers); // write all the buffers
  }

  binary.removeBlobs(obj, writeEncoding);
}

/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 * @api public
 */

function Decoder() {
  this.reconstructor = null;
}

/**
 * Mix in `Emitter` with Decoder.
 */

Emitter(Decoder.prototype);

/**
 * Decodes an ecoded packet string into packet JSON.
 *
 * @param {String} obj - encoded packet
 * @return {Object} packet
 * @api public
 */

Decoder.prototype.add = function(obj) {
  var packet;
  if ('string' == typeof obj) {
    packet = decodeString(obj);
    if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) { // binary packet's json
      this.reconstructor = new BinaryReconstructor(packet);

      // no attachments, labeled binary but no binary data to follow
      if (this.reconstructor.reconPack.attachments === 0) {
        this.emit('decoded', packet);
      }
    } else { // non-binary full packet
      this.emit('decoded', packet);
    }
  }
  else if (isBuf(obj) || obj.base64) { // raw binary data
    if (!this.reconstructor) {
      throw new Error('got binary data when not reconstructing a packet');
    } else {
      packet = this.reconstructor.takeBinaryData(obj);
      if (packet) { // received final buffer
        this.reconstructor = null;
        this.emit('decoded', packet);
      }
    }
  }
  else {
    throw new Error('Unknown type: ' + obj);
  }
};

/**
 * Decode a packet String (JSON data)
 *
 * @param {String} str
 * @return {Object} packet
 * @api private
 */

function decodeString(str) {
  var p = {};
  var i = 0;

  // look up type
  p.type = Number(str.charAt(0));
  if (null == exports.types[p.type]) return error();

  // look up attachments if type binary
  if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
    var buf = '';
    while (str.charAt(++i) != '-') {
      buf += str.charAt(i);
      if (i == str.length) break;
    }
    if (buf != Number(buf) || str.charAt(i) != '-') {
      throw new Error('Illegal attachments');
    }
    p.attachments = Number(buf);
  }

  // look up namespace (if any)
  if ('../default.htm' == str.charAt(i + 1)) {
    p.nsp = '';
    while (++i) {
      var c = str.charAt(i);
      if (',' == c) break;
      p.nsp += c;
      if (i == str.length) break;
    }
  } else {
    p.nsp = '../default.htm';
  }

  // look up id
  var next = str.charAt(i + 1);
  if ('' !== next && Number(next) == next) {
    p.id = '';
    while (++i) {
      var c = str.charAt(i);
      if (null == c || Number(c) != c) {
        --i;
        break;
      }
      p.id += str.charAt(i);
      if (i == str.length) break;
    }
    p.id = Number(p.id);
  }

  // look up json data
  if (str.charAt(++i)) {
    try {
      p.data = json.parse(str.substr(i));
    } catch(e){
      return error();
    }
  }

  debug('decoded %s as %j', str, p);
  return p;
}

/**
 * Deallocates a parser's resources
 *
 * @api public
 */

Decoder.prototype.destroy = function() {
  if (this.reconstructor) {
    this.reconstructor.finishedReconstruction();
  }
};

/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 * @api private
 */

function BinaryReconstructor(packet) {
  this.reconPack = packet;
  this.buffers = [];
}

/**
 * Method to be called when binary data received from connection
 * after a BINARY_EVENT packet.
 *
 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
 * @return {null | Object} returns null if more binary data is expected or
 *   a reconstructed packet object if all buffers have been received.
 * @api private
 */

BinaryReconstructor.prototype.takeBinaryData = function(binData) {
  this.buffers.push(binData);
  if (this.buffers.length == this.reconPack.attachments) { // done with buffer list
    var packet = binary.reconstructPacket(this.reconPack, this.buffers);
    this.finishedReconstruction();
    return packet;
  }
  return null;
};

/**
 * Cleans up binary packet reconstruction variables.
 *
 * @api private
 */

BinaryReconstructor.prototype.finishedReconstruction = function() {
  this.reconPack = null;
  this.buffers = [];
};

function error(data){
  return {
    type: exports.ERROR,
    data: 'parser error'
  };
}

},{"binary":40,"is-buffer":42,"component-emitter":43,"debug":14,"isarray":34,"json3":35}],42:[function(_dereq_,module,exports){
(function (global){

module.exports = isBuf;

/**
 * Returns true if obj is a buffer or an arraybuffer.
 *
 * @api private
 */

function isBuf(obj) {
  return (global.Buffer && global.Buffer.isBuffer(obj)) ||
         (global.ArrayBuffer && obj instanceof ArrayBuffer);
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{}],43:[function(_dereq_,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],44:[function(_dereq_,module,exports){
module.exports = toArray

function toArray(list, index) {
    var array = []

    index = index || 0

    for (var i = index || 0; i < list.length; i++) {
        array[i - index] = list[i]
    }

    return array
}

},{}],45:[function(_dereq_,module,exports){
(function (global){
/*! https://mths.be/utf8js v2.0.0 by @mathias */
;(function(root) {

	// Detect free variables `exports`
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	// Taken from https://mths.be/punycode
	function ucs2decode(string) {
		var output = [];
		var counter = 0;
		var length = string.length;
		var value;
		var extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Taken from https://mths.be/punycode
	function ucs2encode(array) {
		var length = array.length;
		var index = -1;
		var value;
		var output = '';
		while (++index < length) {
			value = array[index];
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
		}
		return output;
	}

	function checkScalarValue(codePoint) {
		if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
			throw Error(
				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
				' is not a scalar value'
			);
		}
	}
	/*--------------------------------------------------------------------------*/

	function createByte(codePoint, shift) {
		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
	}

	function encodeCodePoint(codePoint) {
		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
			return stringFromCharCode(codePoint);
		}
		var symbol = '';
		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
		}
		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
			checkScalarValue(codePoint);
			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
			symbol += createByte(codePoint, 6);
		}
		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
			symbol += createByte(codePoint, 12);
			symbol += createByte(codePoint, 6);
		}
		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
		return symbol;
	}

	function utf8encode(string) {
		var codePoints = ucs2decode(string);
		var length = codePoints.length;
		var index = -1;
		var codePoint;
		var byteString = '';
		while (++index < length) {
			codePoint = codePoints[index];
			byteString += encodeCodePoint(codePoint);
		}
		return byteString;
	}

	/*--------------------------------------------------------------------------*/

	function readContinuationByte() {
		if (byteIndex >= byteCount) {
			throw Error('Invalid byte index');
		}

		var continuationByte = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		if ((continuationByte & 0xC0) == 0x80) {
			return continuationByte & 0x3F;
		}

		// If we end up here, it’s not a continuation byte
		throw Error('Invalid continuation byte');
	}

	function decodeSymbol() {
		var byte1;
		var byte2;
		var byte3;
		var byte4;
		var codePoint;

		if (byteIndex > byteCount) {
			throw Error('Invalid byte index');
		}

		if (byteIndex == byteCount) {
			return false;
		}

		// Read first byte
		byte1 = byteArray[byteIndex] & 0xFF;
		byteIndex++;

		// 1-byte sequence (no continuation bytes)
		if ((byte1 & 0x80) == 0) {
			return byte1;
		}

		// 2-byte sequence
		if ((byte1 & 0xE0) == 0xC0) {
			var byte2 = readContinuationByte();
			codePoint = ((byte1 & 0x1F) << 6) | byte2;
			if (codePoint >= 0x80) {
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 3-byte sequence (may include unpaired surrogates)
		if ((byte1 & 0xF0) == 0xE0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
			if (codePoint >= 0x0800) {
				checkScalarValue(codePoint);
				return codePoint;
			} else {
				throw Error('Invalid continuation byte');
			}
		}

		// 4-byte sequence
		if ((byte1 & 0xF8) == 0xF0) {
			byte2 = readContinuationByte();
			byte3 = readContinuationByte();
			byte4 = readContinuationByte();
			codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
				(byte3 << 0x06) | byte4;
			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
				return codePoint;
			}
		}

		throw Error('Invalid UTF-8 detected');
	}

	var byteArray;
	var byteCount;
	var byteIndex;
	function utf8decode(byteString) {
		byteArray = ucs2decode(byteString);
		byteCount = byteArray.length;
		byteIndex = 0;
		var codePoints = [];
		var tmp;
		while ((tmp = decodeSymbol()) !== false) {
			codePoints.push(tmp);
		}
		return ucs2encode(codePoints);
	}

	/*--------------------------------------------------------------------------*/

	var utf8 = {
		'version': '2.0.0',
		'encode': utf8encode,
		'decode': utf8decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return utf8;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = utf8;
		} else { // in Narwhal or RingoJS v0.7.0-
			var object = {};
			var hasOwnProperty = object.hasOwnProperty;
			for (var key in utf8) {
				hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.utf8 = utf8;
	}

}(this));

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {})
},{}],46:[function(_dereq_,module,exports){
'use strict';

var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('')
  , length = 64
  , map = {}
  , seed = 0
  , i = 0
  , prev;

/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
  var encoded = '';

  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);

  return encoded;
}

/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
  var decoded = 0;

  for (i = 0; i < str.length; i++) {
    decoded = decoded * length + map[str.charAt(i)];
  }

  return decoded;
}

/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
  var now = encode(+new Date());

  if (now !== prev) return seed = 0, prev = now;
  return now +'.'+ encode(seed++);
}

//
// Map each character to its index.
//
for (; i < length; i++) map[alphabet[i]] = i;

//
// Expose the `yeast`, `encode` and `decode` functions.
//
yeast.encode = encode;
yeast.decode = decode;
module.exports = yeast;

},{}]},{},[1])(1)
});

/*!common/components/store/store.js*/
;"use strict"
// Module export pattern from
// https://github.com/umdjs/umd/blob/master/returnExports.js
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('common/components/store/store', [], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.store = factory();
  }
}(this, function () {

    // Store.js
    var store = {},
        win = window,
        doc = win.document,
        localStorageName = 'localStorage',
        scriptTag = 'script',
        storage

    store.disabled = false
    store.version = '1.3.17'
    store.set = function(key, value) {}
    store.get = function(key, defaultVal) {}
    store.has = function(key) { return store.get(key) !== undefined }
    store.remove = function(key) {}
    store.clear = function() {}
    store.transact = function(key, defaultVal, transactionFn) {
        if (transactionFn == null) {
            transactionFn = defaultVal
            defaultVal = null
        }
        if (defaultVal == null) {
            defaultVal = {}
        }
        var val = store.get(key, defaultVal)
        transactionFn(val)
        store.set(key, val)
    }
    store.getAll = function() {}
    store.forEach = function() {}

    store.serialize = function(value) {
        return JSON.stringify(value)
    }
    store.deserialize = function(value) {
        if (typeof value != 'string') { return undefined }
        try { return JSON.parse(value) }
        catch(e) { return value || undefined }
    }

    // Functions to encapsulate questionable FireFox 3.6.13 behavior
    // when about.config::dom.storage.enabled === false
    // See https://github.com/marcuswestin/store.js/issues#issue/13
    function isLocalStorageNameSupported() {
        try { return (localStorageName in win && win[localStorageName]) }
        catch(err) { return false }
    }

    if (isLocalStorageNameSupported()) {
        storage = win[localStorageName]
        store.set = function(key, val) {
            if (val === undefined) { return store.remove(key) }
            storage.setItem(key, store.serialize(val))
            return val
        }
        store.get = function(key, defaultVal) {
            var val = store.deserialize(storage.getItem(key))
            return (val === undefined ? defaultVal : val)
        }
        store.remove = function(key) { storage.removeItem(key) }
        store.clear = function() { storage.clear() }
        store.getAll = function() {
            var ret = {}
            store.forEach(function(key, val) {
                ret[key] = val
            })
            return ret
        }
        store.forEach = function(callback) {
            for (var i=0; i<storage.length; i++) {
                var key = storage.key(i)
                callback(key, store.get(key))
            }
        }
    } else if (doc.documentElement.addBehavior) {
        var storageOwner,
            storageContainer
        // Since #userData storage applies only to specific paths, we need to
        // somehow link our data to a specific path.  We choose /favicon.ico
        // as a pretty safe option, since all browsers already make a request to
        // this URL anyway and being a 404 will not hurt us here.  We wrap an
        // iframe pointing to the favicon in an ActiveXObject(htmlfile) object
        // (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
        // since the iframe access rules appear to allow direct access and
        // manipulation of the document element, even for a 404 page.  This
        // document can be used instead of the current document (which would
        // have been limited to the current path) to perform #userData storage.
        try {
            storageContainer = new ActiveXObject('htmlfile')
            storageContainer.open()
            storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="../favicon.ico"></iframe>')
            storageContainer.close()
            storageOwner = storageContainer.w.frames[0].document
            storage = storageOwner.createElement('div')
        } catch(e) {
            // somehow ActiveXObject instantiation failed (perhaps some special
            // security settings or otherwse), fall back to per-path storage
            storage = doc.createElement('div')
            storageOwner = doc.body
        }
        var withIEStorage = function(storeFunction) {
            return function() {
                var args = Array.prototype.slice.call(arguments, 0)
                args.unshift(storage)
                // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
                // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
                storageOwner.appendChild(storage)
                storage.addBehavior('#default#userData')
                storage.load(localStorageName)
                var result = storeFunction.apply(store, args)
                storageOwner.removeChild(storage)
                return result
            }
        }

        // In IE7, keys cannot start with a digit or contain certain chars.
        // See https://github.com/marcuswestin/store.js/issues/40
        // See https://github.com/marcuswestin/store.js/issues/83
        var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
        var ieKeyFix = function(key) {
            return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
        }
        store.set = withIEStorage(function(storage, key, val) {
            key = ieKeyFix(key)
            if (val === undefined) { return store.remove(key) }
            storage.setAttribute(key, store.serialize(val))
            storage.save(localStorageName)
            return val
        })
        store.get = withIEStorage(function(storage, key, defaultVal) {
            key = ieKeyFix(key)
            var val = store.deserialize(storage.getAttribute(key))
            return (val === undefined ? defaultVal : val)
        })
        store.remove = withIEStorage(function(storage, key) {
            key = ieKeyFix(key)
            storage.removeAttribute(key)
            storage.save(localStorageName)
        })
        store.clear = withIEStorage(function(storage) {
            var attributes = storage.XMLDocument.documentElement.attributes
            storage.load(localStorageName)
            while (attributes.length) {
                storage.removeAttribute(attributes[0].name)
            }
            storage.save(localStorageName)
        })
        store.getAll = function(storage) {
            var ret = {}
            store.forEach(function(key, val) {
                ret[key] = val
            })
            return ret
        }
        store.forEach = withIEStorage(function(storage, callback) {
            var attributes = storage.XMLDocument.documentElement.attributes
            for (var i=0, attr; attr=attributes[i]; ++i) {
                callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
            }
        })
    }

    return store
}));

/*!common/components/quickstartConfig/main.js*/
;/**
 * 快速入门配置
 * 使用window.localStorage记录用户快速入门完成状态
 * 主要用于新功能气泡提示
 *
 * @author fayipan@lagou.com
 */
define('common/components/quickstartConfig/main', ['require', 'exports', 'module'], function (require, exports, module) {
    var lsKey = 'quickstartConfig';
    var localStorage = window.localStorage;
    var JSON = window.JSON;
    var setting = {};

    (function () { // 加载localStorage数据，初始化setting对象
        var strValue = localStorage.getItem(lsKey);
        if (typeof strValue === 'string') {            
            try {
                setting = JSON.parse(strValue);
            } catch (e) {}
        } else {
            storageSync();
        }
    }) ();

    // 数据更新同步到localStorage
    function storageSync () {
        localStorage.setItem(lsKey, JSON.stringify(setting || {}));
    }

    module.exports = {
        get: function (k) {
            return setting[k];
        },
        set: function (k, val) {
            setting[k] = val;
            storageSync();
            return val;
        },
        remove: function (k) {
            delete setting[k];
            storageSync();
        },
        clear: function () {
            setting = {};
            storageSync();
        }
    };
});

/*!common/static/js/modules/Utils.js*/
;/**
 * Created by lagou on 16/3/3.
 */
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/static/js/modules/Utils', [], definition)
    else this[name] = definition()
})('Utils', function () {
    /**-----------------------------------------------------------------  start
     * 公共工具箱
     */
    var lg = window.lg = window.lg || {};
    lg.Utils = lg.Utils || {};
    /**
     * lg.Utils={}
     * {
 *      getNewId()
 *      Formate()
 *      .
 *      .
 *      .
 * }
     */

    /**
     * 判断对象val 是否等于 {}
     * @param val
     * @returns {boolean}
     */
    lg.Utils.setCookie = function (name,value) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }
    lg.Utils.getCookie = function (name) {
        var temp = document.cookie.split(';');
        var cookie = {};
        for(var i= 0,len=temp.length;i<len;i++){
            cookie[temp[i].split('=')[0].trim()] = temp[i].split('=')[1].trim();
        }
        return cookie[name]||'';
    }
    
    /**
     * 判断对象val 是否等于 {}
     * @param val
     * @returns {boolean}
     */
    // 跨域cookie
    lg.Utils.docCookies = {
      getItem: function (sKey) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
      },
      setCookie: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
          switch (vEnd.constructor) {
            case Number:
              sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
              break;
            case String:
              sExpires = "; expires=" + vEnd;
              break;
            case Date:
              sExpires = "; expires=" + vEnd.toUTCString();
              break;
          }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
      },
      removeItem: function (sKey, sPath, sDomain) {
        if (!sKey || !this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
        return true;
      },
      hasItem: function (sKey) {
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
      },
      keys:  function () {
        /* optional method: you can safely remove it! */
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
      }
    };
    lg.Utils.setLocalStorage = function (name,value) {
        //JSON.stringify()
        if(localStorage && localStorage.setItem && JSON && JSON.stringify){
            localStorage.setItem(name,JSON.stringify(value));
        }else{
            return false;
        }
    }
    lg.Utils.getLocalStorage = function (name) {
        if(localStorage && localStorage.getItem && JSON && JSON.parse){
            var temp = localStorage.getItem(name);
            var data = {};
            data = temp !='undefined'?JSON.parse(temp):'';
            return data;
        }else{
            return false;
        }

    }
    /**
     * 用户头像里中文的截取策略
     * @param name
     * @returns {string}
     */
    lg.Utils.splitNameStr = function (name) {
        if(!name) return '';
        var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]+/g;
        var rs = name.match(reg);
        if(rs && rs.length>0){
            var result = rs[rs.length-1];
            return result.substr(((result.length-2)<0?0:(result.length-2)),2);
        }else{
            return name.substr(0,2);
        }
    }
    /**
     * 格式化事件 todo...
     * @param val
     * @returns {string}
     */
    lg.Utils.format = function (val) {
        var result = '';
        if(val){
            result+=val.substr(0,4);
            result+='-'+val.substr(5,2);
            result+='-'+val.substr(8,2);
            result+=' '+val.substr(12,5);
        }
        return result;
    }
    /**
     * 获取制定元素左上角距离window左侧的距离
     * @param elem
     * @returns {*}
     */
    lg.Utils.pageX = function (elem) {
        //检查我们是否已经到了根元素
        return elem.offsetParent ?
            //如果我们还能往上，则将当前偏移与向上递归的值相加
        elem.offsetLeft + pageX( elem.offsetParent ) :
            //否则，取当前偏移
            elem.offsetLeft;
    };
    /**
     * 获取制定元素左上角距离window顶部的距离
     * @param elem
     * @returns {*}
     */
//计算元素的Y(垂直，顶)位置
    lg.Utils.pageY = function (elem) {
        //检查我们是否已经到了根元素
        return elem.offsetParent ?
            //如果我们还能往上，则将当前偏移与向上递归的值相加
        elem.offsetTop + pageY( elem.offsetParent ) :
            //否则，取当前偏移
            elem.offsetTop;
    }
    /**
     * 判断是否是空对象,即没有属性
     * @param val
     * @returns {boolean}
     */
    lg.Utils.isNullObject = function (val) {
        if (typeof val === "object" && !(val instanceof Array)) {
            var hasProp = false;
            for (var prop in val) {
                hasProp = true;
                break;
            }
            return hasProp;
        }
    }
    /**
     * 自动加...  汉字当成两个算
     * @param str
     * @param len
     * @returns {*}
     */
    lg.Utils.setString = function (str, len, hasNoDotted) {
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
                if (i == (str.length - 1)) {
                    return s;
                }
                return s +(hasNoDotted?'':'...');
            }
        }
        return s;
    }
    /**
     * 返回长度  汉字当成两个算
     * @param str
     * @returns {int}
     */
    lg.Utils.getStringLength = function (str) {
        var strlen = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 128) {
                strlen += 2;
            } else {
                strlen++;
            }
        }
        return strlen;
    }
    /**
     * textarea 内容里面的换行符号换成<br>
     * @param str
     * @returns {XML|string|*}
     */
    lg.Utils.replaceTextarea = function (str){
        var reg=new RegExp("\n","g");
        var reg1=new RegExp(" ","g");

        str = str.replace(reg,"<br>");
        str = str.replace(reg1,"<p>");

        return str;
    }
    /**
     * 将2016-06-20 15:30 格式化为2016年06月20日 15:30
     * @param str
     * @returns {XML|string|*}
     */
    lg.Utils.formatDateToZH = function (str){
        return str.substr(0,4)+'年'+str.substr(5,2)+'月'+str.substr(8,2)+'日 '+str.substr(11,6)
    };
    /**
     * 带有<br>的内容转成textarea 里面的 /n
     * @param str
     * @returns {XML|string|*}
     * @constructor
     */
    lg.Utils.Textareareplace = function (str){
        var reg=new RegExp("<br>","g");
        var reg1=new RegExp("<p>","g");

        str = str.replace(reg,"\n");
        str = str.replace(reg1," ");

        return str;
    }
    /**
     * 收藏 添加书签
     */
    lg.Utils.addBookMark = function (url, title) {
        //function addFavorite(url, title) {
        if(window.external && 'addFavorite' in window.external){ // IE
            window.external.addFavorite(url, title);
        } else if(window.sidebar && window.sidebar.addPanel) { // Firefox23后被弃用
            window.sidebar.addPanel(url, title);
        } else if(window.opera && window.print) { // rel=sidebar，读取a链接的href，title 注：opera也转战webkit内核了
            this.title = title;
            return true;
        } else { // webkit - safari/chrome
            //alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
            var confirm = new lg.Widgets.Controls.Confirm({
                content:'您可以尝试通过快捷键' + (navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D 加入到收藏夹~',
                submitText:"确定",
                SubmitBtn:function(e){
                    e.control.setRemove();
                },
                noCancelBtn:true
            });
        }
        //}
        /*var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd': 'CTRL';
         try{
         if (document.all) { //IE类浏览器
         try {
         debugger;
         window.external.toString(); //360浏览器不支持window.external，无法收藏
         var confirm = new lg.Widgets.Controls.Confirm({
         content:'国内开发的360浏览器等不支持主动加入收藏。\n您可以尝试通过浏览器菜单栏 或快捷键 ctrl+D 试试。',
         submitText:"确定",
         SelfClass:'pipline-confirm',
         SubmitBtn:function(e){
         e.control.setRemove();
         },
         noCancelBtn:true
         });
         }
         catch (e){
         try{
         window.external.addFavorite(window.location, document.title);
         }
         catch (e){
         window.external.addToFavoritesBar(window.location, document.title);  //IE8
         }
         }
         }
         else if (window.sidebar) { //firfox等浏览器
         window.sidebar.addPanel(document.title, window.location, "");
         }
         else {
         var confirm = new lg.Widgets.Controls.Confirm({
         content:'您可以尝试通过快捷键' + ctrl + ' + D 加入到收藏夹~',
         submitText:"确定",
         SelfClass:'pipline-confirm',
         SubmitBtn:function(e){
         e.control.setRemove();
         },
         noCancelBtn:true
         });
         }
         }
         catch (e){
         var confirm = new lg.Widgets.Controls.Confirm({
         content:'因为IE浏览器存在bug，添加收藏失败！\n解决办法：在注册表中查找\n HKEY_CLASSES_ROOT\\TypeLib\\{EAB22AC0-30C1-11CF-A7EB-0000C05BAE0B}\\1.1\\0\\win32 \n将 C:\\WINDOWS\\system32\\shdocvw.dll 改为 C:../../file@//WINDOWS//system32//ieframe.dll ',
         submitText:"确定",
         SelfClass:'pipline-confirm',
         SubmitBtn:function(e){
         e.control.setRemove();
         },
         noCancelBtn:true
         });
         }*/
    }
    /**
     * 动态加载script 加载js
     * @param url
     * @param callback
     */
    lg.Utils.loadScript = function (url, callback) {
        var script = document.createElement('script');
        script.type = "text/javascript";
        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others: Firefox, Safari, Chrome, and Opera
            script.onload = function () {
                callback();
            };
        }
        script.src = url;
        document.body.appendChild(script);
    }
    /**
     * 初始化url 并解析成key:value  获取用lg.get(key),设置用lg.set(key,value)
     * @param qs
     * @constructor
     */
    lg.QueryString = function (qs) {
        //对href做特殊处理、对于单页面应用有些浏览器获取不到id、mode，暂时处理，后续通
        this.p = {};
        if (!qs)
            qs = (history&&(typeof history.replaceState == 'function'))&&location.search||(window.location.hash&& window.location.hash||'')||'';
        if (qs) {
            var b = qs.indexOf((history&&(typeof history.replaceState == 'function'))&&'?'||'#');
            qs = qs.substr(b + 1);
            if (qs.length > 0) {
                qs = qs.replace(/\+/g, ' ');
                var a = qs.split('&');
                for (var i = 0; i < a.length; i++) {
                    var t = a[i].split('=');
                    var n = t[0];
                    var v = (t.length == 2) ? t[1] : n;
                    this.p[n] = v;
                }
            }
        }
        this.set = function (name, value) {
            this.p[name] = value;
            return this;
        };
        this.get = function (name, def) {
            var v = this.p[name];
            return (v != null) ? v : def;
        };
        this.has = function (name) {
            return this.p[name] != null;
        };
        this.del = function (name) {
            delete this.p[name];
        };
        this.toStrUrlP = function () {
            var r = '?';
            var a = [];
            var i = 0;
            for (var k in this.p) {

                k ? a[i++] = k + '=' + this.p[k] : '';
                /*r += k + '=' + this.p[k] + '&';*/
            }

            return ((history&&(typeof history.replaceState == 'function'))&&r||'') + a.join('&') + ((history&&(typeof history.replaceState == 'function'))&&(window.location.hash&& window.location.hash||'')||'');
        };
        this.getCurrentUrl = function (BaseUrl) {
            var url = BaseUrl || window.location.protocol + '//' + window.location.host + window.location.pathname;
            return url+this.toStrUrlP();
        };
        this.UpdateUrl = function (BaseUrl) {
            var url = BaseUrl || window.location.protocol + '//' + window.location.host + window.location.pathname;
            if(history&&(typeof history.replaceState == 'function')){
                history.replaceState({id: "yun.lagou.com"}, "候选人", url + this.toStrUrlP());
            }else{
                //History.pushState({state:1,rand:Math.random()}, "候选人", this.toStrUrlP());
                if(lg.has('_suid')){
                    lg.del('_suid');
                }
                var paramsStr = this.toStrUrlP();
	            //History.pushState({state:1,rand:Math.random()}, "候选人", this.toStrUrlP());
                //History.replaceState({state:3,rand:Math.random()}, "候选人", paramsStr);
                document.location.hash=paramsStr;
            }
            //history.pushState({id: "yun.lagou.com"}, "候选人", url + this.toStrUrlP());replaceState
        };
    };
    lg.QueryStringByUrl = function (qs) {
        //对href做特殊处理、对于单页面应用有些浏览器获取不到id、mode，暂时处理，后续通
        var obj = {};
        obj.p = {};
        if (!qs)
            qs = (history&&(typeof history.replaceState == 'function'))&&location.search||(window.location.hash&& window.location.hash||'')||'';
        if (qs) {
            var b = qs.indexOf((history&&(typeof history.replaceState == 'function'))&&'?'||'#');
            qs = qs.substr(b + 1);
            if (qs.length > 0) {
                qs = qs.replace(/\+/g, ' ');
                var list = qs.split('&');
                for (var i = 0; i < list.length; i++) {
                    var t = list[i].split('=');
                    var n = t[0];
                    var v = (t.length == 2) ? t[1] : n;
                    obj.p[n] = v;
                }
            }
        }
        obj.set = function (name, value) {
            this.p[name] = value;
            return this;
        };
        obj.get = function (name, def) {
            var v = this.p[name];
            return (v != null) ? v : def;
        };
        obj.has = function (name) {
            return this.p[name] != null;
        };
        obj.del = function (name) {
            delete this.p[name];
        };
        obj.toStrUrlP = function () {
            var r = '?';
            var a = [];
            var i = 0;
            for (var k in this.p) {
                k ? a[i++] = k + '=' + this.p[k] : '';
                /*r += k + '=' + this.p[k] + '&';*/
            }

            return ((history&&(typeof history.replaceState == 'function'))&&r||'') + a.join('&') + ((history&&(typeof history.replaceState == 'function'))&&(window.location.hash&& window.location.hash||'')||'');
        };
	    obj.UpdateUrl = function (BaseUrl) {
		    var url = BaseUrl || window.location.protocol + '//' + window.location.host + window.location.pathname;
		    if(history&&(typeof history.replaceState == 'function')){
			    history.replaceState({id: "yun.lagou.com"}, "候选人", url + this.toStrUrlP());
		    }else{
			    //History.pushState({state:1,rand:Math.random()}, "候选人", this.toStrUrlP());
			    if(lg.has('_suid')){
				    lg.del('_suid');
			    }
			    var paramsStr = this.toStrUrlP();
			    //History.pushState({state:1,rand:Math.random()}, "候选人", this.toStrUrlP());
			    //History.replaceState({state:3,rand:Math.random()}, "候选人", paramsStr);
			    document.location.hash=paramsStr;
		    }
		    //history.pushState({id: "yun.lagou.com"}, "候选人", url + this.toStrUrlP());replaceState
	    };
        return obj;
    };
    /**
     * 获取一个hash 值
     * @param str
     * @param caseSensitive
     * @returns {number}
     */
    lg.Utils.getHash = function (str, caseSensitive) {
        if (!caseSensitive) {
            str = str.toLowerCase();
        }
        // 1315423911=b'1001110011001111100011010100111'
        var hash = 1315423911, i, ch;
        for (i = str.length - 1; i >= 0; i--) {
            ch = str.charCodeAt(i);
            hash ^= ((hash << 5) + ch + (hash >> 2));
        }

        return (hash & 0x7FFFFFFF);
    }
    /**
     * 动态获取随机码 默认返回4位数字
     * @param num
     * @returns {*}
     */
    lg.Utils.getRandom = function (num) {
        window._LG_RANDOM ? '' : window._LG_RANDOM = {};
        var _lg_random = window._LG_RANDOM || {},
            _num = num || 4,
            _random = getRandomSimple();
        while (_lg_random[_random]) {
            _random = getRandomSimple();
            if (!_lg_random[_random]) break;
        }
        window._LG_RANDOM[_random] = _random;
        return _random;
        //随即返回随机数  --  可能重复
        function getRandomSimple() {
            var random = '';
            for (var i = 0; i < _num; i++) {
                var r = Math.floor(Math.random() * 10);
                random += r.toString();
            }
            return random.toString();
        }
    }
    lg.Utils.switchSizeLgImg = function (url,width,height) {
        var width = width || 60;
        var height = height || 60;
        url = '../../https@img.yingjobs.com/thumbnail_'+width+'x'+height+'/'+url;
        return url;
    }
});

/*!common/static/js/modules/Base.js*/
;/**
 * Created by lagou on 16/3/3.
 */
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/static/js/modules/Base', [], definition)
    else this[name] = definition()
})('Base', function () {
    /**
     *命名空间
     *
     * lg = {
     *      Utils
     *      Widgets
     *      Views
     *      Models
     *      Cache
     *      TempletEngine
     *      Routers
     *      Events
     *      .
     *      .
     *      .
     * }
     */
    var lg = window.lg = window.lg || {};

    /**
     * 扩展Array的indexOf 方法
     * 兼容处理
     */
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt /*, from*/) {
            var len = this.length >>> 0;

            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                ? Math.ceil(from)
                : Math.floor(from);
            if (from < 0)
                from += len;
            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt)
                    return from;
            }
            return -1;
        };
    }

    /**
     * 扩展String的trim方法
     * 兼容处理
     */
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/(^\s*)|(\s*$)/g, "");
        }
        String.prototype.ltrim = function () {
            return this.replace(/(^\s*)/g, "");
        }
        String.prototype.rtrim = function () {
            return this.replace(/(\s*$)/g, "");
        }
    }

    Date.prototype.pattern = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        var week = {
            "0": "../u65e5",
            "1": "../u4e00",
            "2": "../u4e8c",
            "3": "../u4e09",
            "4": "../u56db",
            "5": "../u4e94",
            "6": "../u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "../u661f/u671f" : "../u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }


    lg.Cache = lg.Cache || {};
    lg.Cache.Views = lg.Cache.Views || {};
    lg.Cache.Controls = lg.Cache.Controls || {};
    lg.Cache.set = function (name,val) {
        lg.Cache[name] = val;
    }
    lg.Cache.del = function (name) {
        if(typeof lg.Cache[name] == 'undefined'){
            return;
        };
        delete lg.Cache[name];
    }
    lg.Cache.has = function (name) {
        if(typeof lg.Cache[name] == 'undefined'){
            return false;
        };
        return true;
    }
    lg.Cache.get = function (name) {
        if(typeof lg.Cache[name] == 'undefined'){
            return undefined;
        };
        return lg.Cache[name];
    }
    lg.setControl = function (name, func) {
        if (!name)return;
        lg.Cache.Controls[name] = func;
        lg['get' + name] = function () {
            return lg.Cache.Controls[name];
        }
    }
    lg.setView = function (name, func) {
        lg.Cache.Views[name] = func;
        lg['get' + name] = function () {
            return lg.Cache.Views[name];
        }
    }


    /**
     * 命名控件 - 控件
     */
    lg.Widgets = lg.Widgets || {};

    /**
     * 控件命名空间
     * @type {{}}
     */
    lg.Widgets.Controls = {};
    lg.Widgets.Controls.Extend = function (controlType, func) {
        lg.Widgets.Controls[controlType] = func(controlType);
    };


    /**
     * 命名控件 - 视图
     */

    lg.Views = lg.Views || {};


    /**
     * 命名控件 - 模型
     */
    lg.Models = lg.Models || {};
    lg.Models.BaseViewModel = function (viewName, options) {
        if (viewName) {
            this._name = viewName;
        }
        this._name = '';
        $.extend(this._options, options);
    }
});

/*!common/static/js/modules/Event.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 *
 * 扩展控件支持自定义事件功能  $.extend(lg.Widgets.BaseControl.prototype, lg.Event);  扩展控件时间机制
 */


(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/static/js/modules/Event', [], definition)
    else this[name] = definition()
})('Event', function () {

    /**
     * Event 是扩展lg 的事件绑定触发解绑机制
     * @type {*|{}}
     */
    var lg = window.lg = window.lg || {};
    lg.Event = lg.Event || {};

    lg.Event._events = {};
    /**
     * 事件绑定定义
     * @param eventName
     * @param data
     * @param func
     * @returns {lg.Event}
     */
    lg.Event.on = function (eventName, data, func) {
        if (typeof data == 'function') {
            func = data;
        }
        this._events[eventName] = this._events[eventName] || []
        this._events[eventName].push({
            data: data,
            func: func
        });
        return this;

    }
    /**
     * 事件解绑
     * @param eventName
     * @param func
     * @returns {lg.Event}
     */
    lg.Event.un = function (eventName, func) {
        var events = this._events;

        // 移除所有事件
        if (0 === arguments.length) {
            this._events = {};
            return this;
        }

        var listeners = events[eventName];
        if (!listeners) {
            return this;
        }

        // 移除指定事件下的所有监听器
        if (1 === arguments.length) {
            delete events[eventName];
            return this;
        }

        // 移除指定监听器（包括对once的处理）
        var cb;
        for (var i = 0; i < listeners.length; i++) {
            cb = listeners[i];
            if (cb === listener || cb.listener === listener) {
                listeners.splice(i, 1);
                break;
            }
        }
        return this;
    };
    /**
     * 事件触发
     * @param eventName
     * @returns {lg.Event}
     */
    lg.Event.trigger = function (eventName) {
        var events = this._events;
        var listeners = events[eventName];
        var args = Array.prototype.slice.call(arguments, 1);

        if (listeners) {
            listeners = listeners.slice(0);
            for (var i = 0, len = listeners.length; i < len; i++) {
                listeners[i].func.apply(this, args);
            }
        }
        return this;
    };

});
/*!common/static/js/modules/BaseControl.js*/
;/**
 * Created by lagou on 16/3/3.
 */
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/static/js/modules/BaseControl', [], definition)
    else this[name] = definition()
})('BaseControl', function () {
    /**
     * 控件基础够着函数
     * @param options
     * @constructor
     */
    require('common/static/js/modules/Utils');
    var lg = window.lg = window.lg || {};
    lg.Widgets = window.lg.Widgets || {};
    lg.Widgets.BaseControl = function (options) {
        this._name = '';
        this._option = {};
        this.Event = lg.Event;
        this._data = {};
        this._value = '';
        this._isDirty = false;
        this._isValueField = true;
        this._data.valid = this._data.valid || {};
        this._data.valid.validResult = {};
        this._data.valid._map = {
            require: {
                mode: 'require',
                isUse: false,
                status: false,
                data: '',
                message: '必填',
                level: '3',
                trigger: []
            },
            re_pwd: {
                mode: 'repeat-password',
                isUse: false,
                status: false,
                data: '',
                message: '',
                level: '2',
                trigger: []
            },
            min_len: {
                mode: 'min-length',
                isUse: false,
                status: false,
                data: '',
                message: '最小长度',
                level: '1',
                trigger: []
            },
            max_len: {
                mode: 'max-length',
                isUse: false,
                status: false,
                data: '',
                message: '最大长度',
                level: '1',
                trigger: []

            },
            pattern: {
                mode: 'pattern',
                isUse: false,
                status: false,
                data: '',
                message: '',
                level: '2',
                trigger: []
            },
            ajax: {
                mode: 'ajax',
                isUse: false,
                status: false,
                data: '',
                message: '',
                level: '2',
                trigger: []
            }
        }
        $.extend(this._option, options);
        if (this._option.validRules) {
            for (var i = 0, len = this._option.validRules.length; i < len; i++) {
                var item = this._option.validRules[i];
                if (this._data.valid._map[item.mode]) {
                    this._data.valid._map[item.mode].isUse = true;
                    this._data.valid._map[item.mode].data = item.data;
                    this._data.valid._map[item.mode].message = item.message;
                    this._data.valid._map[item.mode].level = item.level || this._data.valid._map[item.mode].level;

                } else {
                    this._data.valid._map[item.mode] = {
                        mode: item.mode,
                        isUse: true,
                        status: false,
                        data: item.data,
                        message: item.message,
                        level: 0
                    }
                }
                if (item.trigger) {
                    this._data.valid._map[item.mode].trigger = item.trigger.split(',');
                } else {
                    this._data.valid._map[item.mode].trigger.push('blur');
                }
            }
        }
        this._id = lg.Utils.getRandom();
        this._selector = this._option.parentName ? '[data-view="' + this._option.parentName + '"] [data-propertyname="' + this._option.name + '"]' : '[data-propertyname="' + this._option.name + '"]'
        this._element = typeof this._option.name == 'string' ? $(this._selector) : this._option.name;
        typeof this.init == 'function' ? this.init() : '';
        /*    this.setControl();*/
        this._events = {};
        lg.setControl(this._option.name, this);
    }
    /**
     * 获取是否是输入值的域
     * @returns {string}
     */
    lg.Widgets.BaseControl.prototype.getIsValueField = function () {
        return this._isValueField;
    }
    lg.Widgets.BaseControl.prototype.setIsValueField = function (val) {
        var value = false;
        if (val) {
            value = true;
        }
        this._isValueField = value;
    }
    /**
     * 获取控件实例名
     * @returns {string}
     */
    lg.Widgets.BaseControl.prototype.getName = function () {
        return this._option.name;
    }
    lg.Widgets.BaseControl.prototype.getElement = function () {
        return this._element;
    }
    /**
     * 初始化控件
     * @param options
     */
    lg.Widgets.BaseControl.prototype.BaseInit = function (options) {
        this.setData(options); //初始化控件参数
        if (this._option && typeof this._option.value != 'undefined') {
            this.setValue(this._option.value);
        }
        var that = this;
        var isVisible = true;
        if (!this._option.isFocusShow) {
            this.getElement().find('input[type="text"],input[type="password"],input[type="checkbox"],input.btn_outline').on('focus', function (e) {
                that.setValidMessage();
            });
        }
        typeof this._option.isVisible == 'undefined' ? isVisible : isVisible = this._option.isVisible;
        if (!isVisible) {
            this.setVisible(isVisible);
        }
        //验证触发事件定义    ==> keyup blur
        this.getElement().find('input[type="text"],input[type="password"]').on('blur keydown change keyup', {control: this}, function (e) {
            var that = e.data.control;
            if (e.type == 'keydown') {
                that._isDirty = true;
            }
            var value = that.getValue();
            var validResult = that.getIsValid(value, e.type);
            if (that._isDirty && that.getSelfIsValided() && (e.type == "keyup" || e.type == "change")) {

                if (that._option.keyup) {
                    that.execValid(that.getValue());
                    that._option.keyup.call(this, {
                        control: that,
                        isValidat: true,
                        parent: lg.Cache.Views[that._option.parentName],
                        linkFor: lg.Cache.Views[that._option.parentName].field[that._option.linkFor]
                    })
                }
            } else if (that._isDirty &&that.getSelfIsValided() && (e.type == "blur")) {
                if (that._option.keyupvalid) {
                    that.execValid(that.getValue());
                    that._option.keyupvalid.call(this, {
                        control: that,
                        isValidat: true,
                        parent: lg.Cache.Views[that._option.parentName],
                        linkFor: lg.Cache.Views[that._option.parentName].field[that._option.linkFor]
                    })
                }
            } else if (that._isDirty && !that.getSelfIsValided() && (e.type == "keyup" || e.type == "change")) {

                if (that._option.keyup) {
                    that.execValid(that.getValue());
                    that._option.keyup.call(this, {
                        control: that,
                        isValidat: false,
                        parent: lg.Cache.Views[that._option.parentName],
                        linkFor: lg.Cache.Views[that._option.parentName].field[that._option.linkFor]
                    })
                }
            }
            if (lg.Utils.isNullObject(validResult)) {
                that.setValidMessage(validResult);
                return;
            } else {
                that.setValidMessage();
            }

        });
    }

    lg.Widgets.BaseControl.prototype.showMessage = function (val) {
        this.getElement().find('[data-valid-message]').length ? '' : this.getElement().append('<span style="display:none;" data-valid-message class="input_tips"></span>');
        if (this._option.showMessage) {
            this.getElement().find('[data-valid-message]').show();
        } else {
            this.getElement().find('[data-valid-message]').hide();
        }
        var messageBox = this.getElement().find('[data-valid-message]');
        var message = messageBox.html();
        if (lg.Utils.isNullObject(val)) {
            messageBox.empty();
            var messageList = '';

            messageBox.html(val.message);
            messageBox.show();
            this.getElement().find('input[type="text"]').addClass('input_warning');
            this.getElement().find('input[type="password"]').addClass('input_warning');
        } else {
            messageBox.remove();
            this.getElement().find('input[type="text"]').removeClass('input_warning');
            this.getElement().find('input[type="password"]').removeClass('input_warning');
        }
    }
    lg.Widgets.BaseControl.prototype.setValidMessage = function (val, from) {
        if (this._option.forbidAddMessageBySelf) {
            if (from == "CollectData") {
                this.getElement().find('[data-valid-message]').length ? '' : this.getElement().append('<span style="display: none;" data-valid-message class="input_tips"></span>');
                if (this._option.showMessage) {
                    this.getElement().find('[data-valid-message]').show();
                } else {
                    this.getElement().find('[data-valid-message]').hide();
                }
                var messageBox = this.getElement().find('[data-valid-message]');
            } else {
                var messageBox = this.getElement().find('[data-valid-message]');
                if (!messageBox && messageBox.length > 0) {
                    return;
                }
            }

        } else {
            this.getElement().find('[data-valid-message]').length ? '' : this.getElement().append('<span style="display: none;" data-valid-message class="input_tips"></span>');
            if (this._option.showMessage) {
                this.getElement().find('[data-valid-message]').show();
            } else {
                this.getElement().find('[data-valid-message]').hide();
            }

            var messageBox = this.getElement().find('[data-valid-message]');
        }


        var message = messageBox.html();
        if (lg.Utils.isNullObject(val || {})) {
            messageBox.empty();
            var messageList = '';
            var level = 0;
            for (var item in val) {
                typeof val[item].level != 'undefined' ? (level = (level < val[item].level) ? val[item].level : level) : '';
            }
            for (var item in val) {
                if (typeof val[item].level != 'undefined' && level == val[item].level) {
                    messageList = val[item].message;
                }
            }
            messageBox.html(messageList);
            if (this._option.showMessage) {
                // this.getElement().find('[data-valid-message]').show();
                messageBox.show();
            } else {
                //this.getElement().find('[data-valid-message]').hide();
                messageBox.hide();
            }
            this._option.validCallBack?this._option.validCallBack.call(this,this.getElement().find('[data-valid-message]').text()):'';
            this.getElement().find('input[type="text"]').addClass('input_warning');
            this.getElement().find('input[type="password"]').addClass('input_warning');
        } else {
            messageBox.remove();
            this.getElement().find('input[type="text"]').removeClass('input_warning');
            this.getElement().find('input[type="password"]').removeClass('input_warning');
        }
    }
    /**
     *设置控件参数
     * @param data
     */
    lg.Widgets.BaseControl.prototype.setData = function (data) {
        for (var item in data) {
            this['set' + item] = data[item];
        }
    }

    /**
     *初始化
     * @param data
     */
    lg.Widgets.BaseControl.prototype.setClear = function () {

        this.getElement().find('input.input_warning').removeClass('input_warning');
        this.getElement().find('[data-valid-message]').remove();
        this.getElement().find('input[type="text"],input[type="password"]').val('');
        this._isDirty = false;
        this.getElement().find('input[type="text"],input[type="password"]').blur();
    }

    /**
     * 获取控件是否只读
     * @returns {boolean}
     */
    lg.Widgets.BaseControl.prototype.getIsReadOnly = function () {
        return this.getElement().attr('readonly') ? true : false;
    }

    /**
     * 设置控件是否只读
     * @param val
     */
    lg.Widgets.BaseControl.prototype.setReadOnly = function (val) {
        var value = false;
        if (val) {
            value = true;
        }
        value ? this.getElement().attr('readonly', value) : this.getElement().removeAttr('readonly');
        if (value) {
            this.getElement().attr('readonly', value);
            this.getElement().find('input').attr('readonly', value);
        } else {
            this.getElement().removeAttr('readonly');
            this.getElement().find('input').removeAttr('readonly');
        }
    }
    /**
     * 获取parent节点
     * @param val
     */
    lg.Widgets.BaseControl.prototype.getParent = function () {
        return lg.Cache.Views[this._option.parentName];
    }
    /**
     * 获取控件是否可用
     * @returns {boolean}
     */
    lg.Widgets.BaseControl.prototype.getIsDisabled = function () {
        return this.getElement().attr('disabled') ? true : false;
    }

    /**
     * 设置是否获取焦点
     * @param val
     * @returns {*}
     */
    lg.Widgets.BaseControl.prototype.setFocus = function (val) {
        var value = false;
        if (val) {
            value = true;
            this.getElement().find('input[type ="text"]').focus();
        }
        //this.getElement().find('input[text]').focus();
    }
    /**
     * 设置控件是否可用
     * @param val
     */
    lg.Widgets.BaseControl.prototype.setDisable = function (val) {
        var value = false;
        if (val) {
            value = true;
        }
        value ? this.getElement().attr('disabled', value) : this.getElement().removeAttr('disabled');
        if (value) {
            this.getElement().attr('disabled', value);
            this.getElement().find('input').attr('disabled', value);
        } else {
            this.getElement().removeAttr('disabled');
            this.getElement().find('input').removeAttr('disabled');
        }
    }

    /**
     * 获取控件是否可见
     * @returns {boolean}
     */
    lg.Widgets.BaseControl.prototype.getIsVisible = function () {
        return this.getElement().css('display') != 'none' ? true : false;
    }

    /**
     * 设置控件是否可见
     * @param val
     */
    lg.Widgets.BaseControl.prototype.setVisible = function (val) {
        var value = 'none';
        if (val) {
            value = 'block';
        }
        this.getElement().css('display', value);
    }

    /**
     * 获取验证结果
     * @returns {Array}
     */
    lg.Widgets.BaseControl.prototype.getIsValid = function (val, type) {
        this.execValid(val, type);
        return this._data.valid.validResult;
    }

    /**
     * 设置控件验证规则
     * @param val
     */
    lg.Widgets.BaseControl.prototype.setValid = function (val) {
        for (var item in val) {
            this._data.valid._map[item].is = val[item];
        }
    }
    /**
     * 获取值
     * @param val
     */
    lg.Widgets.BaseControl.prototype.getValue = function () {
        var thid_input = this.getElement().find('input');
        this._value = thid_input.val();
        if (this._value != '') {
            this._value = this._value.trim();
        }
        return this._value;
    }

    lg.Widgets.BaseControl.prototype.setValue = function (val) {
        this._value = val;
        this.getElement().find('input').val(val);
        this._isDirty= true;
    }
    /**
     * 执行验证规则
     * @param val
     */
    lg.Widgets.BaseControl.prototype.execValid = function (val, type) {
        var thisType = type || 'blur';
        if (typeof val == 'undefined' || !this.getIsVisible()) return;
        for (var item in this._data.valid._map) {
            if (typeof this._data.valid._map[item] == 'object') {
                if (this._data.valid._map[item].isUse) {
                    if (this._data.valid._map[item].mode == 'require') {
                        this.controlValidResult((val.length == 0) && this._isDirty && (this._data.valid._map[item].trigger.indexOf(thisType) > -1), item, type);
                    }
                    if (this._data.valid._map[item].mode == 'min-len') {
                        this.controlValidResult((val.length < this._data.valid._map[item].data) && this._isDirty && (this._data.valid._map[item].trigger.indexOf(thisType) > -1), item, type);
                    }
                    if (this._data.valid._map[item].mode == 'max-len') {
                        this.controlValidResult((val.length > this._data.valid._map[item].data) && this._isDirty && (this._data.valid._map[item].trigger.indexOf(thisType) > -1), item, type);
                    }
                    if (this._data.valid._map[item].mode == 'repeat-password') {
                        var pwd = lg.Cache.Views[this._option.parentName].field[this._option.linkFor].getValue();
                        var repwd = this.getValue();
                        this.controlValidResult((pwd != repwd) && this._isDirty && (this._data.valid._map[item].trigger.indexOf(thisType) > -1), item, type);
                    }
                    if (this._data.valid._map[item].mode == 'pattern') {

                        if (typeof this._data.valid._map[item].data == 'string') {
                            var data = this._data.valid._map[item].data.split('||');
                            var temp = false;
                            for (var i = 0, len = data.length; i < len; i++) {
                                var reg = eval(data[i]);
                                temp = temp || reg.test(val);
                            }
                        }else if(typeof this._data.valid._map[item].data == 'function'){
                            var temp = false;
                            temp = this._data.valid._map[item].data(val);
                        } else {
                            var data = this._data.valid._map[item].data;
                            var temp = false;
                            for (var i in data) {
                                if (typeof data[i] != 'function') {
                                    temp = temp || data[i].test(val);
                                }
                            }
                        }
                        this.controlValidResult((!temp) && this._isDirty && (this._data.valid._map[item].trigger.indexOf(thisType) > -1), item, type);
                    }
                }
            }

        }
    }
    lg.Widgets.BaseControl.prototype.getSelfIsValided = function () {
        var value = true;
        var val = this.getValue();
        if (typeof val == 'undefined') return false;
        for (var item in this._data.valid._map) {
            if (typeof this._data.valid._map[item] == 'object') {
                if (this._data.valid._map[item].isUse) {
                    if (this._data.valid._map[item].mode == 'require') {
                        value && (val.length != 0) ? value = true : value = false;
                    }
                    if (this._data.valid._map[item].mode == 'min-len') {
                        value && (val.length > this._data.valid._map[item].data) ? value = true : value = false;
                    }
                    if (this._data.valid._map[item].mode == 'max-len') {
                        value && (val.length < this._data.valid._map[item].data) ? value = true : value = false;
                    }
                    if (this._data.valid._map[item].mode == 'repeat-password') {
                        var pwd = lg.Cache.Views[this._option.parentName].field[this._option.linkFor].getValue();
                        var repwd = this.getValue();
                        value && (pwd == repwd) ? value = true : value = false;
                    }
                    if (this._data.valid._map[item].mode == 'pattern') {
                        if (typeof this._data.valid._map[item].data == 'string') {
                            var data = this._data.valid._map[item].data.split('||');
                            var temp = false;
                            for (var i = 0, len = data.length; i < len; i++) {
                                var reg = eval(data[i]);
                                temp = temp || reg.test(val);
                            }
                        }else if(typeof this._data.valid._map[item].data == 'function'){
                            var temp = false;
                            temp = this._data.valid._map[item].data(val);
                        } else {
                            var data = this._data.valid._map[item].data;
                            var temp = false;
                            for (var i in data) {
                                if (typeof data[i] != 'function') {
                                    temp = temp || data[i].test(val);
                                }
                            }
                        }
                        value && temp ? value = true : value = false;

                    }
                }
            }

        }
        return value;
    }
    lg.Widgets.BaseControl.prototype.controlValidResult = function (val, item, type) {
        //var result = type ==""
        if (!!val) {
            this._data.valid.validResult[this._data.valid._map[item].mode] = this._data.valid._map[item];
            this._data.valid.validResult[this._data.valid._map[item].mode].triggerType = type;
        } else {
            delete this._data.valid.validResult[this._data.valid._map[item].mode]
        }
    }
    /**
     * 扩展控件支持自定义事件功能
     */
    $.extend(lg.Widgets.BaseControl.prototype, lg.Event);
});

/*!common/static/js/modules/FormControls.js*/
;/**
 * Created by lagou on 16/3/3.
 */
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/static/js/modules/FormControls', [], definition)
    else this[name] = definition()
})('FormControls', function () {
    /**
     * 手机号
     * @param controlType
     * @param func
     * @constructor
     */
    lg.Widgets.Controls.Extend("Phone", function (controlType) {
        var _shieldChar;
        var control = function (id, options) {
            lg.Widgets.BaseControl.call(this, id, options);
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        return control;
    });
    lg.Widgets.Controls.Extend("TextArea", function (controlType) {
        var _shieldChar;
        var control = function (id, options) {
            lg.Widgets.BaseControl.call(this, id, options);
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.getValue = function () {
            return this.getElement().find('textarea').val();
        };
        return control;
    });
    /**
     * 手机号验证码控件
     */
    lg.Widgets.Controls.Extend("PhoneVerificationCode", function (controlType) {
        var _shieldChar;
        var control = function (id, options) {
            lg.Widgets.BaseControl.call(this, id, options);
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;

        /**
         * 获取设置的时长
         * @returns {number|*}
         */
        control.prototype.getTopTime = function () {
            return this._option.topTime || 60;
        }

        /**
         * 设置总时长
         * @param val
         */
        control.prototype.setTopTime = function (val) {
            this._option.topTime = val;
        }

        /**
         *获取验证码获取总次数
         * @returns {*}
         */
        control.prototype.getopCount = function () {
            return this._option.topCount || null;
        }
        control.prototype.getTotalCount = function (val) {
            return this._option.totalCount;
        }
        control.prototype.setTotalTimeTemp = function () {
            this.totalTimeTemp = this.getTopTime();
        }
        control.prototype.setTimeLine = function (val) {
            this._option.timeLine = val;
        }
        control.prototype.getPhoneVerificationCodeUrl = function () {
            return this._option.url;
        }
        control.prototype.getVerificationButton = function () {
            return this.getElement().find('input[type="button"]');
        }

        control.prototype.getVerificationInput = function () {
            return this.getElement().find('input[type="text"]');
        }
        control.prototype.getCodeIsDisabled = function () {
            return this.getElement().find('input[type="button"]').hasClass('btn_disabled');
        }
        control.prototype.setCodeIsDisabled = function (val) {
            var value = false;
            if (val) {
                value = true;
                this.getElement().find('input[type="button"]').addClass('btn_disabled');
                return value;
            } else {
                this.getElement().find('input[type="button"]').removeClass('btn_disabled');
                return value;
            }

        }
        control.prototype.getLinkFor = function () {
            return lg.Cache.Views[this._option.parentName].field[this._option.linkFor];
        }
        control.prototype.init = function () {
            //this.count = this.getTotalCount();
            this.timeLine = null;
            this.isActive = false;
            //var that = this;
            //if(this._option.codeIsDisabled){
            this.setCodeIsDisabled(this._option.codeIsDisabled);
            //}

            var linkFor = lg.Cache.Views[this._option.parentName].field[this._option.linkFor];

            if (!linkFor.getSelfIsValided() && linkFor._option.keyup) {
                this.getVerificationButton().val((typeof this._option.postfix != 'string') ? '获取验证码' : '获取');

            } else if (linkFor.getSelfIsValided() && linkFor._option.keyup) {
                this.getVerificationButton().removeClass('btn_disabled').val((typeof this._option.postfix != 'string') ? '获取验证码' : '获取');
            }
            this.totalTimeTemp = this.getTopTime();
            this.getElement().find('input[type="button"]').one('click', {
                control: this
            }, function (e) {
                var that = e.data.control;
                var isValidateLinkAndVerifyCode = true;
                var linkFor = lg.Cache.Views[that._option.parentName].field[that._option.linkFor];
                var verifyCode = lg.Cache.Views[that._option.parentName].field[that._option.verifyCode];
                if (verifyCode.getIsVisible()) {
                    verifyCode.getSelfIsValided() && isValidateLinkAndVerifyCode ? isValidateLinkAndVerifyCode = true : isValidateLinkAndVerifyCode = false;
                }
                linkFor.getSelfIsValided() && isValidateLinkAndVerifyCode ? isValidateLinkAndVerifyCode = true : isValidateLinkAndVerifyCode = false;
                if (isValidateLinkAndVerifyCode) {
                    that.setDisable(true);
                    if (!that.getCodeIsDisabled() && that.getIsDisabled()) {
                        that.isActive = true;
                        that._option.click.call(this, {
                            control: that,
                            parent: lg.Cache.Views[that._option.parentName],
                            linkFor: linkFor
                        })


                    }
                } else {

                    linkFor._isDirty = true;
                    linkFor.setValidMessage(linkFor.getIsValid(linkFor.getValue()), 'CollectData');
                    if (verifyCode.getIsVisible()) {
                        verifyCode._isDirty = true;
                        verifyCode.setValidMessage(verifyCode.getIsValid(verifyCode.getValue()), 'CollectData');
                    }
                    that.init();
                }

                //e.data.control.starttime(e.data.control);
            });
        }
        control.prototype.getVerificationCode = function () {

        }
        control.prototype.setClear = function () {

            this.getElement().find('input.input_warning').removeClass('input_warning');
            this.getElement().find('[data-valid-message]').remove();
            this.getElement().find('input[type="text"],input[type="password"]').val('');
            this._isDirty = false;
            this.getElement().find('input[type="text"],input[type="password"]').blur();
            clearInterval(this.timeLine);

            var objEvt = $._data(this.getElement().find('input[type="button"]')[0], "events");
            if (objEvt && objEvt["click"]) {
                //console.info(objEvt["click"]);
                //alert("bind click");
            }
            else {
                this.init();
            }
            this.timeLine = null;
            this.setDisable(false);
            var linkFor = lg.Cache.Views[this._option.parentName].field[this._option.linkFor];
            if (!linkFor.getSelfIsValided() && linkFor._option.keyup) {
                //this.init();
                this.getVerificationButton().val((typeof this._option.postfix != 'string') ? '获取验证码' : '获取');

            } else {
                //this.init();

                this.getVerificationButton().removeClass('btn_disabled').val((typeof this._option.postfix != 'string') ? '获取验证码' : '获取');

            }
        }
        control.prototype.starttime = function (that) {
            if (!that.timeLine) {
                that.totalTimeTemp = that.getTopTime();

                that.timeLine = setInterval(function () {
                    var self = lg.Cache.Views[that._option.parentName].field[that.getName()];
                    self.totalTimeTemp--;
                    var text = (typeof self._option.postfix != 'string') ? '秒后重试' : self._option.postfix + 's';
                    self.getVerificationButton().addClass('btn_disabled').val(self.totalTimeTemp + text);
                    if (self.totalTimeTemp == -1) {
                        clearInterval(self.timeLine);
                        self.timeLine = null;
                        that.setDisable(false);
                        var linkFor = lg.Cache.Views[that._option.parentName].field[that._option.linkFor];
                        if (!linkFor.getSelfIsValided() && linkFor._option.keyup) {
                            self.init();
                            self.getVerificationButton().val((typeof self._option.postfix != 'string') ? '获取验证码' : '获取');

                        } else {

                            self.init();
                            self.getVerificationButton().removeClass('btn_disabled').val((typeof self._option.postfix != 'string') ? '获取验证码' : '获取');
                        }
                        //self.getVerificationButton().removeClass('btn_disabled').val((typeof self._option.postfix!='string')?'获取验证码':'获取');
                        // self.getVerificationButton().
                        //self.count--;
                    }
                }, 1000);
            }
            /*else if (that.count == 0) {
             console.log(that);
             //window.localStorage.getItem('')
             that.showMessage({message:that._option.totalTips||"已经达到限定次数"})
             }*/
        }
        return control;
    });
    /**
     * 密码控件
     */
    lg.Widgets.Controls.Extend("Password", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.getValue = function () {
            var thid_input = this.getElement().find('input[type="password"]');
            this._value = thid_input[0].value;
            this._value = typeof this._value == 'undefined' ? '' : this._value;
            this._value = this._value.trim();
            return this._value;
        }
        return control;
    });
    /**
     * 确认密码控件
     */
    lg.Widgets.Controls.Extend("RepeatPassword", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.getValue = function () {
            var thid_input = this.getElement().find('input[type="password"]');
            this._value = thid_input[0].value;
            this._value = typeof this._value == 'undefined' ? '' : this._value;
            this._value = this._value.trim();
            return this._value;
        }
        return control;
    });
    /**
     * 邮箱控件
     */
    lg.Widgets.Controls.Extend("Email", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        return control;
    });

    /**
     * 图形验证码控件
     */
    lg.Widgets.Controls.Extend("VerifyCode", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function () {
            //ar url = this.getVerifyCodeUrl();
            //this.getVerifyCodeImg().attr("src", url);
            this.getVerifyCodeReflashButton().on('click', {
                control: this
            }, function (e) {

                var url = e.data.control.getVerifyCodeUrl();
                var img = $('<img class="yzm" />');
                if (e.data.type == 'init') {
                    if (e.data.control.getVerifyCodeImg().attr("src")) {
                        return;
                    } else {
                        img.attr('src', url);
                        $('[data-controltype="VerifyCode"]').find('img').remove();
                        $('[data-controltype="VerifyCode"]').find('input').after(img);
                    }//?'':img.attr('src',url);
                } else {
                    img.attr('src', url);
                    $('[data-controltype="VerifyCode"]').find('img').remove();
                    $('[data-controltype="VerifyCode"]').find('input').after(img);
                }

                //e.data.control.getVerifyCodeImg().attr("src", url);
            });
        }
        control.prototype.getVerifyCode = function () {
            this.getVerifyCodeReflashButton().trigger('click', {
                control: this,
                type: 'init'
            });
        }
        control.prototype.getFrom = function () {
            return this._option.from || 'register';
        }
        control.prototype.getVerifyCodeUrl = function () {
            var url = this._option.url + '?from=' + this.getFrom() + '&refresh=' + new Date().getTime();
            return url;
        }
        control.prototype.getVerifyCodeReflashButton = function () {
            return this.getElement().find('a');
        }
        control.prototype.getVerifyCodeInput = function () {
            return this.getElement().find('input');
        }
        control.prototype.getVerifyCodeImg = function () {
            return this.getElement().find('img');
        }
        return control;
    });

    /**
     * 切换控件
     */
    lg.Widgets.Controls.Extend("Switch", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.getValue = function () {
            return this.getElement().find('.btn_active').attr('data-myvalue') || '';
        }

        return control;
    });
    /**
     * CheckBox
     */
    lg.Widgets.Controls.Extend("CheckBox", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.getValue = function () {
            var chk_value = [];
            this.getElement().find('input[type="checkbox"]:checked').each(function () {
                chk_value.push($(this).attr("data-myvalue"));
            });
            return chk_value;
        }
        return control;
    });
    lg.Widgets.Controls.Extend("Button", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this._isValueField = false;
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function () {
            this.isActive = false;
            this.getElement().find('[type="button"]').on('click', {
                control: this
            }, function (e) {
                var that = e.data.control;
                that.isActive = true;
                that._option.click.call(this, {
                    control: that,
                    parent: lg.Cache.Views[that._option.parentName]
                })
                //console.log(lg.Cache.Views[that._option.parentName].CollectData());
            });
        }
        return control;
    });

});
/*!common/static/js/modules/View.js*/
;/**
 * Created by lagou on 16/3/3.
 */
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/static/js/modules/View', [], definition)
    else this[name] = definition()
})('BaseView', function () {
    lg.Views.BaseView = function (options) {
        this._name = '';
        this._children = [];
        this._Validation = {};
        this._options = {};
        this.childrenData = {};
        this.field = {};
        if (options) {
            this._name = options.name;
        }
        $.extend(this._options, options);
        this._element = typeof options.name == 'string' ? $('[data-view="' + this._name + '"]') : this._name;

        lg.setView(this._name, this);
        this.init();
        this._events = {};
    }


    lg.Views.BaseView.prototype.getElement = function () {
        return this._element;
    }
    lg.Views.BaseView.prototype.setClear = function () {
        for (var item in this.field) {
            this.field[item].setClear();
        }
    }
    lg.Views.BaseView.prototype.getControl = function (name) {
        if (!name)return;
        return this.field[name];
    }
    lg.Views.BaseView.prototype.setVisible = function (val) {
        var value = true;
        if (!val) {
            value = false;
        }
        ;
        value ? this.getElement().show() : this.getElement().hide();
    }
    lg.Views.BaseView.prototype.ValidatForm = function () {

        for (var item in this.field) {
            var temp = {};
            var i = {};
            if (this.field[item].getIsValueField()) {
                this.field[item]._isDirty = true;
                i = this.field[item].getIsValid(this.field[item].getValue());
            }
            if (lg.Utils.isNullObject(i)) {
                this._Validation[item] = i;
            } else {
                delete this._Validation[item];
            }
            //?(delete this._Validation[item]):this._Validation[item]=i;

        }
        if (lg.Utils.isNullObject(this._Validation)) {
            for (var item in this._Validation) {
                this.field[item].setValidMessage(this._Validation[item], 'CollectData')
            }
            return false;
        }
        return true;
    }
    lg.Views.BaseView.prototype.CollectData = function (val) {
        this.childrenData.isValidate = true;
        if (!val) {
            this.childrenData.isValidate = this.ValidatForm();
        }

        for (var item in this.field) {
            if (this.field[item].getIsValueField()) {
                this.childrenData[item] = this.field[item] ? this.field[item].getValue() : '';
            }
        }
        return this.childrenData;
    }
    lg.Views.BaseView.prototype.setValue = function (val) {
        for (var item in this.field) {
            if(this.field[item] && val[item]){
                this.childrenData[item] = this.field[item] ? this.field[item].setValue((val[item]?val[item]:"")) : '';
            }
        }
        return this.childrenData;
    }
    lg.Views.BaseView.prototype.init = function () {
        this._options;
        this._options.fields ? this.initControls(this._options.fields) : '';


    }
    lg.Views.BaseView.prototype.initControls = function (fields) {
        for (var i = 0, len = fields.length; i < len; i++) {
            fields[i].parentName = this._name;
            this.field[fields[i].name] = new lg.Widgets.Controls[fields[i].controlType](fields[i]);
            this.field[fields[i].name].BaseInit()
            //typeof this.field[fields[i].name].init == "function"?this.field[fields[i].name].init():'';
        }
    }
    lg.Views.BaseView.prototype.setValue = function (val) {
        for (var item in this.field) {
            if(this.field[item] && val[item]){
                this.childrenData[item] = this.field[item] ? this.field[item].setValue((val[item]?val[item]:"")) : '';
            }
        }
        return this.childrenData;
    }
    lg.Views.BaseView.prototype.addControls = function (fields) {
        for (var i = 0, len = fields.length; i < len; i++) {
            fields[i].parentName = this._name;
            this.field[fields[i].name] = new lg.Widgets.Controls[fields[i].controlType](fields[i]);
            this.field[fields[i].name].BaseInit()
            //typeof this.field[fields[i].name].init == "function"?this.field[fields[i].name].init():'';
        }
    }
    lg.Views.BaseView.prototype.extend = function (name, func) {
        this[name] = func;
    }

    /**
     * 扩展控件支持自定义事件功能
     */
    $.extend(lg.Views.BaseView.prototype, lg.Event);
//------------------------------------------------------------------  end

});
/*!common/components/textBox/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 文本控件
 */
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/textBox/main', [], definition)
    else this[name] = definition()
})('Utils', function () {

    lg.Widgets.Controls.Extend("TextBox", function (controlType) {
        var _shieldChar;
        var control = function (id, options) {
            lg.Widgets.BaseControl.call(this, id, options);
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        return control;
    });
});
/*!common/components/confirm/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */
/**
 * 确认控件
 */
/**
 * @require "common/components/confirm/main.less"
 **/
/**

 lg.Widgets.Controls.Confirm({
 title:'xxx'         //控件实例名字
 noCancelBtn:true   //不要取消按钮
 submitText:'xxx'   //自定义确认按钮文案
 cancelText:'xxx'   //自定义取消按钮文案
 backClass:'xxx'    //设置背景遮罩层样式className
 decoration:'xxx'   //设置弹框样式className
 SubmitBtn:function(e){}   //设置定义确认按钮绑定事件
 CancelBtn:function(e){}   //设置定义取消按钮绑定事件
 BackClose:true     //设置点击弹框外关闭弹框
 })
 lg.getxxx().setSureBtnDisabled(true|false)  //设置确认按钮是否不可点

 lg.getxxx().setShow(true|false)             //显示或隐藏弹框

 lg.getxxx().setSureBtnText(xxx)             //动态设置确认按钮文案

 lg.getxxx().setCancelBtnText(xxx)           //动态设置取消按钮文案

 */
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/confirm/main', [], definition)
    else this[name] = definition()
})('Confirm', function () {
    /**
     * 确认控件
     */
    lg.Widgets.Controls.Extend("Confirm", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this._isValueField = false;
            this._id = lg.Utils.getRandom();
            this._element = this.getTemplete().attr('data-confirm-id', this._id);
            $('body').append(this._element);

            this.init();
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.init = function (options) {
            this.getElement().attr('data-id', lg.Utils.getRandom());
            if (options) {
                $.extend(this._option, options)
            }
            if (this._option.defaultText) {
                this.setValue(this._option.defaultText);
            }
            this._option.cancelText?'':(!this._option.noCancelBtn?(this._option.cancelText = "取消"):'');

            if(this._option.noCancelBtn){
                this._option.submitText?'':(this._option.submitText = "确定");
            }
            if(this._option.decoration){
                this.getElement().addClass(this._option.decoration);
            }
            if(this._option.backClass){
                this.getElementBack().addClass(this._option.backClass);
            }
            var that = this;
            if (this._option) {
                that.setElementHeader(that._option.title || '');
                that.setElementContent(that._option.content || '');
                if (that._option.content.length < 20) {
                    that.getElementContent().css('text-align', 'center');
                } else {
                    that.getElementContent().css('text-align', 'left');
                }
                that.setSureBtnText(that._option.submitText);
                that.setCancelBtnText(that._option.cancelText);
                this._option.noCancelBtn?this.getElement().find('.lg-confirm-concel').hide():this.getElement().find('.lg-confirm-concel').show();
                this._option.noSubmitBtn?this.getElement().find('.lg-confirm-submit').hide():this.getElement().find('.lg-confirm-submit').show();
            }
            this.getElement().off('click');
            this.getElement().on('click', '.lg-confirm-concel', function (e) {
                if (that._option.CancelBtn) {
                    that._option.CancelBtn.call(that, {control: that,from:'concel'});
                }
                if(that._option.CancelNoClose){
                    return;
                }
                that.setRemove();
            });
            this.getElementBack().on('click', function (e) {
                if($(e.target).hasClass('lg-tranparent')){
                    that.trigger('backClick');
                    if(that._option.BackClose){
                        that.setRemove();
                    }
                }
            })
            this.getElement().on('click', '.lg-confirm-submit', function (e) {
                if (that._option.SubmitBtn) {
                    that._option.SubmitBtn.call(that, {control: that, event: e});
                }
                if (that.isClose) {
                    that.setRemove();
                }
            });
            if(this._option.noCloseBtn){
                this.getElementHeaderClose().hide();
            }else{
                this.getElementHeaderClose().show();
            }
            this.getElementHeaderClose().on('click', function (e) {
                if (that._option.CancelBtn) {
                    that._option.CancelBtn.call(that, {control: that,from:'close'});
                }
                that.setRemove();
            });
            if (this._option.isBackClose == true) {
                this.getElementBack().on('click', function (e) {
                    that.setRemove();
                });
            }
            this.trigger('ready', this);
        }
        /**
         * 获取取消按钮Dom
         * @returns {*}
         */
        control.prototype.getCancelBtn = function () {
            return this.getElement().find('.mds-confirm-concel');
        }
        /**
         * 定义模板
         * @returns {*}
         */
        control.prototype.getTemplete = function () {
            var templateStr = '<div class="lg-tranparent"><div class="lg-confirm clearfix" >'
                + '<div class="lg-confirm-title"><span class="title"></span><span class="MDS-icon-modal-close icon-close"></span></div>'
                + '<div class="lg-confirm-content"></div>'
                + '<div class="lg-confirm-footer">'
                + '<a class="btn btn_active btn_green lg-confirm-submit"></a>'
                + '<a class="lg-confirm-concel"></a>'
                + '</div>'
                + '</div></div>';
            return $(templateStr);
        }
        /**
         * 设置弹框是否显示
         * @param val
         */
        control.prototype.setShow = function (val) {
            var value = false;
            if (val) {
                value = true;
            }
            value ? this.getElement().show() : this.getElement().hide();
        }
        /**
         * 获取背景遮罩层Dom
         * @returns {*}
         */
        control.prototype.getElementBack = function () {
            return $('[data-confirm-id="' + this._id + '"]') || this._element;
        }
        /**
         * 获取背景遮罩层Dom
         * @returns {*}
         */
        control.prototype.getElement = function () {
            return this.getElementBack().find('.lg-confirm');
        }
        /**
         * 移除弹框
         * @returns {*}
         */
        control.prototype.setRemove = function () {
            this.trigger('closeCallBack');
            this.getElementBack().remove();
        }
        /**
         * 获取header Dom
         * @returns {*}
         */
        control.prototype.getElementHeader = function () {
            return this.getElement().find('.lg-confirm-title .title');
        }
        /**
         * 设置header
         * @param val
         */
        control.prototype.setElementHeader = function (val) {
            this.getElement().find('.lg-confirm-title .title').text(val);
        }
        /**
         * 获取取消按钮 Dom
         * @returns {*}
         */
        control.prototype.getElementHeaderClose = function () {
            return this.getElement().find('.lg-confirm-title .MDS-icon-modal-close');
        }
        /**
         * 获取Content Dom
         * @returns {*}
         */
        control.prototype.getElementContent = function () {
            return this.getElement().find('.lg-confirm-content');
        }
        /**
         * 修改Content Dom
         * @param val
         */
        control.prototype.setElementContent = function (val) {
            this.getElement().find('.lg-confirm-content').html(val);
        }
        /**
         * 获取Footer Dom
         * @returns {*}
         */
        control.prototype.getElementFooter = function () {
            return this.getElement().find('lg-confirm-footer');
        }
        /**
         * 获取确认按钮 Dom
         * @returns {*}
         */
        control.prototype.getSureBtn = function () {
            return this.getElement().find('.lg-confirm-submit');
        }
        /**
         * 设置确认按钮是否可用
         * @param val
         */
        control.prototype.setSureBtnDisabled = function (val) {
            if(val){
                this.getSureBtn().addClass('btn_disabled');
                this.getSureBtn().removeClass('btn_active');
            }else{
                this.getSureBtn().removeClass('btn_disabled');
                this.getSureBtn().addClass('btn_active');
            }
        }
        /**
         * 设置确认按钮文案
         * @param val
         */
        control.prototype.setSureBtnText = function (val) {
            this.getElement().find('.lg-confirm-submit').html(val);
        }
        /**
         * 设置取消按钮文案
         * @param val
         */
        control.prototype.setCancelBtnText = function (val) {
            this.getElement().find('.lg-confirm-concel').html(val);
        }
        return control;
    });
});

/*!common/static/js/lagou.mini.js*/
;/**
 * Created by storm on 16/3/3.
 */
define('common/static/js/lagou.mini', ['require', 'exports', 'module', 'common/static/js/modules/Utils', 'common/static/js/modules/Base', 'common/static/js/modules/Event', 'common/static/js/modules/BaseControl', 'common/static/js/modules/FormControls', 'common/static/js/modules/View', 'common/components/textBox/main', 'common/components/confirm/main', 'common/components/quickstartConfig/main'], function(require, exports, module) {
    require('common/static/js/modules/Utils');
    require('common/static/js/modules/Base');
    require('common/static/js/modules/Event');
    require('common/static/js/modules/BaseControl');
    require('common/static/js/modules/FormControls');
    require('common/static/js/modules/View');
    require('common/components/textBox/main');
    require('common/components/confirm/main');
    require('common/components/quickstartConfig/main');
});

/*!common/components/checkbox/main.js*/
;/**
 * Created by lagou on 16/3/3.
 */

/**
 * radio
 */
/**
 * @require "common/components/checkbox/main.less"
 **/
(function (name, definition) {
	if (typeof module != 'undefined' && module.exports) module.exports = definition()
	else if (typeof define == 'function' && define.amd) define('common/components/checkbox/main', [], definition)
	else this[name] = definition()
})('CheckBox', function () {
	lg.Widgets.Controls.Extend("CheckBox", function (controlType) {
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
			if(this._option.decoration){
				this.getElement().addClass(this._option.decoration);
			}
			this.getElement().empty();
			var html = '';
			for (var i = 0, len = this._option.dataSource.length; i < len; i++) {
				var itemData = this._option.dataSource[i];
				itemData.id = !itemData.id?this._option.dataSource[i].id=lg.Utils.getRandom():itemData.id;
				this._dataList[itemData.id] = itemData;
				var checkBox = '<label data-item-id="'+itemData.id+'" for="'+itemData.id+'" class="box-checkbox '+(itemData.disabled?'disabled':'')+'">'+
					'<input type="checkbox" value="" id="'+itemData.id+'" name="'+that._id+'" class="checkbox" data-text="" '+(itemData.select?' checked="checked" ':'')+'/>'+
					'<i class="icon-check'+(itemData.select?'ed':'')+'box"></i>'+
					'<span class="checkbox-text">'+itemData.text+'</span>'+
					'</label>';
				html+=checkBox;
				itemData.select?this._dataList[itemData.id].isSelect = true:this._dataList[itemData.id].isSelect = false;
			}
			html+='';
			this.getElement().append(html);
			this.getElement().addClass('checkbox-list');
			this.getElement().addClass('clearfix');
			this.getElement().off('click');
			this.getElement().on('click','input', function (e) {
				/*that.getElement().find('input').each(function(i,ele){
					$(ele).prop('checked',false);
					$(ele).parent().find('i').removeClass('icon-checkedbox').addClass('icon-checkbox');
					that._dataList[$(ele).prop('id')].select = false;
				});*/
				if($(this).closest('label').hasClass('disabled')){
					return;
				}
				if($(this).attr('checked')){
					$(this).removeAttr('checked',false);
					that._dataList[$(this).prop('id')].isSelect = false;
					$(this).parent().find('i').addClass('icon-checkbox').removeClass('icon-checkedbox');
				}else{
					$(this).attr('checked',true);
					that._dataList[$(this).prop('id')].isSelect = true;
					$(this).parent().find('i').removeClass('icon-checkbox').addClass('icon-checkedbox');
				}
				that._value = that._dataList[$(this).attr('id')];
				that.trigger('select',that._dataList[$(this).attr('id')]);
			});

		}
		control.prototype.getValue = function () {
			var result = [];
			for(var item in this._dataList){
				if(typeof this._dataList[item] != 'function'){
					if(this._option.key && this._dataList[item].isSelect && this._dataList[item][this._option.key]){
						result.push(this._dataList[item][this._option.key]);
					}
				}
			}
			return result;
		}
		/**
		 * todo
		 * @param val
		 */
		control.prototype.setValue = function (val) {

		}
		control.prototype.setSelectByValue = function (val,noselect) {
			var itemData = {};
			for(var item in this._dataList){
				if(typeof this._dataList[item] != 'function'){
					if(this._dataList[item].val == val){
						itemData = this._dataList[item];
					}
				}
			}
			if(noselect){
				if(itemData.isSelect) {
					this.getSubInputById(itemData.id).trigger('click');
				}
			}else{
				this.getSubInputById(itemData.id).trigger('click');
			}
		}
		control.prototype.getSubInputById = function (val) {
			return this.getElement().find('[id="'+val+'"]');
		}
		control.prototype.setDisabled = function (val,noDisabled) {
			var itemData = {};
			for(var item in this._dataList){
				if(typeof this._dataList[item] != 'function'){
					if(this._dataList[item].val == val){
						itemData = this._dataList[item];
					}
					//result.push(this.dataList[item].val||this.dataList[item].text);
				}
			}
			if(noDisabled){
				this.getSubInputById(itemData.id).closest('label').removeClass('disabled');
			}else{
				this.getSubInputById(itemData.id).closest('label').addClass('disabled');
			}
		}
		return control;
	});
});
/*!common/components/newGuidPop/main.js*/
;/**
 * 确认控件
 *
 * Created by lagou on 16/3/3.
 */

/**
 * @require "common/components/newGuidPop/main.less"
 **/
(function (name, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define('common/components/newGuidPop/main', [], definition)
    else this[name] = definition()
})('NewGuidPop', function () {
    /**
     * 气泡引导控件
     */
    lg.Widgets.Controls.Extend("NewGuidPop", function (controlType) {
        var _shieldChar;
        var control = function (options) {
            lg.Widgets.BaseControl.call(this, options);
            this._isValueField = false;
            this.newGuidInit(options);
        };
        control.prototype = new lg.Widgets.BaseControl();
        control.prototype.controlType = controlType;
        control.prototype.newGuidInit = function (options) {
            if (options) {
                $.extend(this._option, options)
            }
            this.sortRule = [
                {name:'MockResumeGuid',steps:['piplineHover','newResumeHover','passNewHover']},
                {name:'AtSelfAndTransformResumeGuid',steps:['LinkHover','CommontHover','transformResumeHover']},
                {name:'sharePositionGuid',steps:['positionDropDownHover','positionItemHover','sharePositionHover']},
                {name:'addMemberGuid',steps:['addHover','addMember']},
                {name:'helpGuid',steps:['addHover']}
            ];
            this.initDataList = {
                MockResumeGuid:{
                    steps:{
                        piplineHover:{
                            stepName:'piplineHover',
                            active:'hover',
                            position:'right',
                            tips:'所有的候选人都在这里，快来挑选你的千里马吧',
                            state:true,
                            index:0
                        },
                        newResumeHover:{
                            stepName:'newResumeHover',
                            active:'hover',
                            position:'right',
                            tips:'我们为你准备了一份独特的简历，<span style="color:#0099ff;cursor: pointer;" class="guideStepTipsItemClick">点我获取</span> ~ 赶快打开看看！',
                            state:true,
                            itemClick: function (e) {
                                $.ajax({
                                    url:'../guide/mock.json',
                                }).success(function (result) {
                                    if(result.state==1){
                                        var itemData = result.content.data.resumeVo;
                                        if(!lg.getresume_list().dataList[itemData.id]){
                                            var num = $($('.pipline-tab').find('[data-stage="NEW"]').find('span')[1]).text();
                                            num = num.substr(1,num.length-2);
                                            $('.pipline-tab').find('[data-stage="NEW"]').html('<span>新简历</span><span>（'+(1+parseInt(num))+'）</span>').attr('data-stagenum',(1+parseInt(num)))
                                        }
                                        lg.getresume_list().updateResume(result.content.data.resumeVo,true);
                                        lg.getresume_list().triggerFirst();
                                    }
                                });
                                lg.getnewGuid().getNext('MockResumeGuid','newResumeHover');
                            },
                            index:1
                        },
                        passNewHover:{
                            stepName:'passNewHover',
                            active:'hover',
                            position:'up',
                            tips:'这么优秀的候选人还犹豫什么，赶快通过初筛吧！',
                            state:true,
                            index:2
                        }
                    },
                    length:3,
                    state:false,
                    All:false,
                    newEnable:true
                },
                AtSelfAndTransformResumeGuid:{
                    steps:{
                        LinkHover:{
                            stepName:'LinkHover',
                            active:'hover',
                            position:'down',
                            tips:'处理完新简历，来这记录沟通情况吧~',
                            state:true,
                            index:0
                        },
                        CommontHover:{
                            stepName:'CommontHover',
                            active:'hover',
                            position:'down',
                            decoration:'CommontHover',
                            tips:'像微信一样！同事，即可快速转发简历。Tips:可以试试@{{}}哦~',
                            state:true,
                            index:1
                        },
                        transformResumeHover:{
                            stepName:'transformResumeHover',
                            active:'hover',
                            position:'right',
                            tips:'转发给自己的简历，可以在这里看看~',
                            state:true,
                            index:2
                        }
                    },
                    length:3,
                    state:true,
                    All:false
                },
                sharePositionGuid:{
                    steps:{
                        positionDropDownHover:{
                            active:'hover',
                            position:'down',
                            tips:'点击这里，就可以只查看某个职位收到的简历~',
                            state:true,
                            index:0
                        },
                        positionItemHover:{
                            active:'hover',
                            position:'right',
                            tips:'点击这里，就可以只查看某个职位收到的简历~',
                            state:true,
                            index:1,
                            click: function (e) {
                                lg.getnewGuid().getNext('sharePositionGuid','positionItemHover');
                            }
                        },
                        sharePositionHover:{
                            active:'hover',
                            position:'down',
                            tips:'点击这里，就可以将这个职位收到的简历全部自动转发给同事哦~',
                            state:true,
                            index:2,
                            click: function (e) {
                                lg.getnewGuid().getNext('sharePositionGuid','sharePositionHover');
                            }
                        }
                    },
                    state:true,
                    length:3,
                    All:true
                },
                addMemberGuid:{
                    steps:{
                        addHover:{
                            active:'hover',
                            position:'down',
                            tips:'这里是各种快捷入口~',
                            state:true,
                            index:0
                        },
                        addMember:{
                            active:'hover',
                            position:'right',
                            tips:'招聘绝不只是你一个人的事儿，邀请同事加入，从此告别没完没了的邮件转发和当面催促。',
                            state:true,
                            index:1,
                            click: function (e) {
                                lg.getnewGuid().getNext('addMemberGuid','addMember');
                            }
                        }
                    },
                    state:true,
                    length:2,
                    All:true
                },
                helpGuid:{
                    steps:{
                        addHover:{
                            stepName:'addHover',
                            active:'hover',
                            position:'down',
                            tips:'进入帮助中心，了解更多提高招聘效率的秘诀~~',
                            state:true,
                            index:0,
                            click: function (e) {
                                lg.getnewGuid().getNext('helpGuid','addHover');
                            }
                        }
                    },
                    length:1,
                    state:true,
                    All:false
                }
            };
            this.initDataList['AtSelfAndTransformResumeGuid'].steps['CommontHover'].tips = '像微信一样@同事，即可快速转发简历。Tips:可以试试@'+$('#UserName').val()+'哦~'
            this.dataList = {};

            var that = this;
            $.ajax({
                url:'../guide/guideInfo.json'
            }).success(function (result) {
                if(result.state == 1){
                    if(!result.content.data.guideInfo){
                        that.updateServer();
                        that.dataList = that.getStringToGuideInfo(result.content.data.guideInfo);
                        that.initGuid();
                    }else{
                        that.dataList = that.getStringToGuideInfo(result.content.data.guideInfo);
                        that.initGuid();
                    }
                }
            });
        }
        /**
         * 当第一次引导的时候初始化用户guide信息
         * @returns {string}
         */
        control.prototype.initString = function () {
            var data = '';
            for(var item in this.initDataList){
                if(typeof this.initDataList[item] != 'function'){
                    var itemGuide = '';
                    if(data.length>0){
                        data+='#';
                    }
                    itemGuide+=item+':'+(this.initDataList[item].state?'1':'0');
                    itemGuide+='&';
                    var temp = true;
                    for(var step in this.initDataList[item].steps){
                        if(typeof this.initDataList[item].steps[step] != 'function'){
                            if(!temp){
                                itemGuide+=','
                            }
                            temp = false;
                            itemGuide+=step+':'+(this.initDataList[item].steps[step].state?'1':'0');
                        }
                    }
                    if(this.initDataList[item].All){
                        itemGuide+='&';
                        itemGuide+='All:'+(this.initDataList[item].All?'1':'0');
                    }
                    if(this.initDataList[item].newEnable){
                        itemGuide+='&';
                        itemGuide+='newEnable:'+(this.initDataList[item].newEnable?'1':'0');
                    }
                    data+=itemGuide;
                }
            }
            return data;
        }
        /**
         * 初始化气泡引导
         */
        control.prototype.initGuid = function () {
            this.initCurrentPop();
        }
        /**
         * 初始化当前气泡引导Dom
         */
        control.prototype.initCurrentPop = function () {
            var step = this.getCurrentStep();
            if(step.guideName && step.stepName){
                if(step.guideName == 'MockResumeGuid' && step.stepName == 'passNewHover' && lg && typeof lg.get == 'function' && lg.get('stage') != 'NEW'){
                    return;
                }else{
                    this.initPop(step.guideName,step.stepName);
                }
            }
        }
        /**
         * 获取当前应该显示的step信息
         * @returns {{}}
         */
        control.prototype.getCurrentStep = function () {
            var step = {};
            for(var i=0;i<this.sortRule.length;i++){
                this.dataList[this.sortRule[i].name]
                for(var j=0;j<this.sortRule[i].steps.length;j++){
                    if((typeof step.guideName =='undefined') && this.dataList[this.sortRule[i].name] && this.dataList[this.sortRule[i].name].steps[this.sortRule[i].steps[j]].state ||((typeof step.guideName =='undefined') && this.dataList[this.sortRule[i].name]  && this.dataList[this.sortRule[i].name].steps[this.sortRule[i].steps[j]].state && this.dataList[this.sortRule[i].name].newEnable)){
                        // ||((typeof step.guideName =='undefined') && !this.dataList[this.sortRule[i].name].steps[this.sortRule[i].steps[j]].state && this.dataList[this.sortRule[i].name].newEnable
                        step.guideName = this.sortRule[i].name;
                        step.stepName = this.sortRule[i].steps[j];
                    }
                }
            }
            return step;
        }
        /**
         * 更新指定气泡的用户信息
         * @param guideName
         * @param stepName
         */
        control.prototype.update = function (guideName,stepName) {
            if(!this.dataList[guideName] || !this.dataList[guideName].steps[stepName]){
                return;
            }

            var itemData = this.dataList[guideName].steps[stepName];
            if(!itemData.state){
                return;
            }

            itemData.All = this.dataList[guideName].All;
            //itemData.state = this.dataList[guideName].state;
            if(itemData.All){
                //if(this.dataList[guideName].length==(itemData.index+1)){
                for(var step in this.dataList[guideName].steps){

                    if(typeof this.dataList[guideName].steps !='function' && this.dataList[guideName].steps[step].index <= itemData.index){
                        this.dataList[guideName].steps[step].state=false;
                    }
                }
                if((itemData.index+1) == this.initDataList[guideName].length){
                    this.dataList[guideName].All = false;
                }
                //this.dataList[guideName].All = false;
                this.updateServer();
                //}
            }else{
                this.dataList[guideName].steps[stepName].state=false;
                if(this.dataList[guideName].steps[stepName].newEnable){
                    this.dataList[guideName].steps[stepName].newEnable=false;
                }
                this.updateServer();
            }
            //if(itemData.state){
            //this.updateServer();
            //}

        }
        /**
         * 更新用户引导的信息
         */
        control.prototype.updateServer = function (guideInfo) {
            $.ajax({
                url:'../guide/updateGuideInfo.json',
                data:{guideInfo:guideInfo || this.getGuideInfoToString()}
            }).success(function (result) {
                if(result.state == 1){

                }
            });
        }
        /**
         * 初始化指定气泡引导的 Dom
         * @param guideName
         * @param stepName
         */
        control.prototype.initPop = function (guideName,stepName) {
            var that = this;
            //this.isContinue = true;
            if(guideName=='MockResumeGuid' && stepName == 'newResumeHover' && typeof this.isContinue =='undefined'){
                $.ajax({
                    'url':'../guide/hasPosition.json',
                    async: false
                }).success(function (result) {
                    if(result.state!=1){
                        that.isContinue = false;
                        return;
                    }
                    if(!result.content.data.isGuide){
                        that.isContinue = false;
                        return;
                    }
                    if(result.state == 1 && result.content.data.isGuide){
                        that.isContinue = true;
                    }
                });
            }
            if(!that.isContinue){
                return;
            }
            var itemData = this.dataList[guideName].steps[stepName];
            if(!itemData.state){
                return;
            }
            var guidPopHandler = this.getPopHandler(guideName,stepName);
            var guidBubbleHandler = this.getBubbleHandler(guideName,stepName);
            if(guidBubbleHandler.length==0){
                itemData.decoration?guidPopHandler.addClass(itemData.decoration):'';
                guidPopHandler.append('<div data-step-pop class="'+(itemData.position||'down')+'" ></div><div data-step-tips-pop class="'+(itemData.position||'down')+'" style="display: none;">'+itemData.tips+'</div>')
                guidPopHandler.on('mouseover', function (e) {
                    $(this).children('[data-step-pop]').hide();
                    $(this).children('[data-step-tips-pop]').show();
                });
                guidPopHandler.on('mouseout', function (e) {
                    $(this).children('[data-step-pop]').show();
                    $(this).children('[data-step-tips-pop]').hide();
                });
                 guidPopHandler.on('click','.guideStepTipsItemClick',{control:this}, function (e) {
                 var control = e.data.control;
                 typeof control.initDataList[$(this).closest('[data-guid]').attr('data-guid')].steps[$(this).closest('[data-step]').attr('data-step')].itemClick=='function'?control.initDataList[$(this).closest('[data-guid]').attr('data-guid')].steps[$(this).closest('[data-step]').attr('data-step')].itemClick.call(this,e):'';
                 //control.trigger('itemClick');
                 });
                guidPopHandler.on('click',{control:this}, function (e) {
                    var control = e.data.control;
                    typeof control.initDataList[$(this).attr('data-guid')].steps[$(this).attr('data-step')].click=='function'?control.initDataList[$(this).attr('data-guid')].steps[$(this).attr('data-step')].click.call(this,e):'';
                });
            }
        }
        /**
         * 获取指定位置的气泡引导的是否可显示
         * @param guideName
         * @param stepName
         * @returns {*}
         */
        control.prototype.getState = function (guideName,stepName) {
            if(!this.dataList[guideName] || !this.dataList[guideName].steps[stepName]){
                return;
            }
            var itemData = this.dataList[guideName].steps[stepName];
            return itemData.state;
        }
        /**
         * 显示指定气泡引导的气泡
         * @param guideName
         * @param stepName
         */
        control.prototype.setShow = function (guideName,stepName) {
            if(!this.dataList[guideName] || !this.dataList[guideName].steps[stepName]){
                return;
            }
            var itemData = this.dataList[guideName].steps[stepName];
            if(!itemData.state){
                return;
            }
            var that = this;
            //setTimeout(function () {
                var guidPopHandler = that.getPopHandler(guideName,stepName);
                var guidBubbleHandler = that.getBubbleHandler(guideName,stepName);
                if(guidBubbleHandler.length==0){
                    that.initPop(guideName,stepName);
                    guidBubbleHandler.show();
                }else{
                    guidBubbleHandler.show();
                }
            //},2000);
        }
        control.prototype.getNext = function (guideName,stepName) {
           /* if(!this.isGuide){
                return;
            }*/
            var that = this;

            var currentStep = this.getCurrentStep();
            if(this.dataList && this.dataList[guideName] && this.dataList[guideName].All){
                this.setHide(guideName,stepName);
                this.update(guideName,stepName);
                this.setShow(guideName,stepName);
                return;
            }else if(!currentStep || currentStep.stepName != stepName || currentStep.guideName != guideName){
                return;
            }
            this.setHide(guideName,stepName);
            this.update(guideName,stepName);
            //this.isContinue = true;
            if(guideName=='MockResumeGuid' && stepName == 'piplineHover' && typeof this.isContinue =='undefined'){
                $.ajax({
                    'url':'../guide/hasPosition.json',
                    async: false
                }).success(function (result) {
                    if(result.state!=1){
                        that.isContinue = false;
                        return;
                    }
                    if(!result.content.data.isGuide){
                        that.isContinue = false;
                        return;
                    }
                    if(result.state == 1 && result.content.data.isGuide){
                        that.isContinue = true;
                    }
                });
            }
            if(!that.isContinue){
                return;
            }
            this.setShow(guideName,stepName);
            this.initCurrentPop()

        }
        /**
         * 设置制定气泡引导隐藏
         * @param guideName
         * @param stepName
         */
        control.prototype.setHide = function (guideName,stepName) {
            var guidPopHandler = this.getPopHandler(guideName,stepName);
            var guidBubbleHandler = this.getBubbleHandler(guideName,stepName);
            var guidTipsHandler = this.getTipsHandler(guideName,stepName);
            if(guidBubbleHandler.length==0){
                //this.initPop(guideName,stepName);
                //guidPopHandler.show();
            }else{
                guidBubbleHandler.remove();
                guidTipsHandler.remove();
            }
        }
        /**
         * 获取制定气泡引导 jquery对象
         * @param guideName
         * @param stepName
         * @returns {*|jQuery|HTMLElement}
         */
        control.prototype.getPopHandler = function (guideName,stepName) {
            return $('[data-guid="'+guideName+'"][data-step="'+stepName+'"]');
        }
        /**
         * 获取制定气泡引导的气泡 jquery对象
         * @param guideName
         * @param stepName
         * @returns {*|jQuery}
         */
        control.prototype.getBubbleHandler = function (guideName,stepName) {
            return $('[data-guid="'+guideName+'"][data-step="'+stepName+'"]').children('[data-step-pop]');
        }
        /**
         * 获取制定气泡引导的tipsPop jquery对象
         * @param guideName
         * @param stepName
         * @returns {*|jQuery}
         */
        control.prototype.getTipsHandler = function (guideName,stepName) {
            return $('[data-guid="'+guideName+'"][data-step="'+stepName+'"]').children('[data-step-tips-pop]');
        }
        /**
         * 规定的格式转化为待提交的字符串格式
         * @returns {string}
         */
        control.prototype.getGuideInfoToString = function () {
            //var guideInfo = 'MockResumeGuid:1&piplineHover:1,newResumeHover:1,passNewHover:1&All:1#MockResumeGuid:1&steps:piplineHover:1,newResumeHover:1,passNewHover:1';
            //var data = [];
            //guideInfo = guideInfo.split('#');
            //if(this.dataList)
            var data = '';
            for(var item in this.dataList){
                if(typeof this.dataList[item] != 'function'){
                    var itemGuide = '';
                    if(data.length>0){
                        data+='#';
                    }
                    itemGuide+=item+':'+(this.dataList[item].state?'1':'0');
                    itemGuide+='&';
                    var temp = true;
                    for(var step in this.dataList[item].steps){
                        if(typeof this.dataList[item].steps[step] != 'function'){
                            if(!temp){
                                itemGuide+=','
                            }
                            temp = false;
                            itemGuide+=step+':'+(this.dataList[item].steps[step].state?'1':'0');
                        }
                    }
                    if(typeof this.dataList[item].newEnable !='undefined'){
                        itemGuide+='&';
                        itemGuide+='newEnable:'+(this.dataList[item].newEnable?'0':'0');
                    }
                    itemGuide+='&';
                    itemGuide+='All:'+(this.dataList[item].All?'1':'0');
                    data+=itemGuide;
                }
            }
            if(!data){
                data = this.initString();
            }
            return data;
        }
        /**
         * 字符串转化为规定的格式
         * @param guideInfo
         * @returns {Array}
         */
        control.prototype.getStringToGuideInfo = function (guideInfo) {
            //'MockResumeGuid:1&steps:piplineHover:1,newResumeHover:1,passNewHover:1&All:1#MockResumeGuid:1&steps:piplineHover:1,newResumeHover:1,passNewHover:1&All:1'
            //var guideInfo = guideInfo || this.guideInfo;
            var init = true;
            guideInfo?init = false:'';
            var guideInfo = guideInfo || this.initString();
            var data = [];
            guideInfo = guideInfo.split('#');
            var and = (!init?'&amp;':'&');
            var result  = guideInfo.map(function (e, i) {
                var itemGuide = {};
                itemGuide.name = e.split(and)[0].split(':')[0];
                itemGuide.state = e.split(and)[0].split(':')[1];
                itemGuide.stepsTemp = e.split(and)[1];
                itemGuide.stepsTemp = itemGuide.stepsTemp.split(',');
                itemGuide.tsteps = [];
                for(var j= 0,len=itemGuide.stepsTemp.length;j<len;j++){
                    itemGuide.tsteps[j] = {name:itemGuide.stepsTemp[j].split(':')[0],state:(itemGuide.stepsTemp[j].split(':')[1]=='1'?true:false)}
                }
                delete itemGuide.stepsTemp;
                if(e.split(and).length==4){
                    itemGuide.All = e.split(and)[3].split(':')[1];
                    itemGuide.newEnable = e.split(and)[2].split(':')[1];
                }
                if(e.split(and).length==3){
                    itemGuide.All = e.split(and)[2].split(':')[1];
                }
               /* if(e.split(and).length>2){
                    itemGuide.newEnable = e.split(and)[2].split(':')[1];
                }*/
                return itemGuide;
            });
            for(var i= 0,len = result.length;i<len;i++){
                var item = {};
                item = result[i];
                item.state =( item.state=='1'?true:false);
                item.All =( item.All=='1'?true:false);
                if(item.newEnable){
                    item.newEnable =( item.newEnable=='1'?true:false);
                }else if(this.initDataList[item.name].newEnable){
                    item.newEnable = true;
                }
                item.steps = {};
                for(var j= 0,lenj = item.tsteps.length;j<lenj;j++){
                    item.steps[item.tsteps[j].name] = {};
                    item.steps[item.tsteps[j].name].state = item.newEnable?true:item.tsteps[j].state;
                    item.steps[item.tsteps[j].name].tips = this.initDataList[item.name].steps[item.tsteps[j].name].tips;
                    item.steps[item.tsteps[j].name].active = this.initDataList[item.name].steps[item.tsteps[j].name].active?this.initDataList[item.name].steps[item.tsteps[j].name].active:'';
                    item.steps[item.tsteps[j].name].index = this.initDataList[item.name].steps[item.tsteps[j].name].index?this.initDataList[item.name].steps[item.tsteps[j].name].index:0;
                    item.steps[item.tsteps[j].name].position = this.initDataList[item.name].steps[item.tsteps[j].name].position? this.initDataList[item.name].steps[item.tsteps[j].name].position:'';
                    item.steps[item.tsteps[j].name].decoration = this.initDataList[item.name].steps[item.tsteps[j].name].decoration?this.initDataList[item.name].steps[item.tsteps[j].name].decoration:'';
                }
                delete item.tsteps;
                data[result[i].name] = item;
            }
            for(var item in this.initDataList){
                if(typeof this.initDataList[item] !='function'){
                    if(!data[item]){
                        data[item] = this.initDataList[item];
                    }
                }
            }
            return data;
            //console.log(result);
        }
        return control;
    });
});

/*!common/static/js/jquery.qrcode.min.js*/
;define('common/static/js/jquery.qrcode.min', ['require', 'exports', 'module'], function(require, exports, module) {

  
  (function(r){r.fn.qrcode=function(h){var s;function u(a){this.mode=s;this.data=a}function o(a,c){this.typeNumber=a;this.errorCorrectLevel=c;this.modules=null;this.moduleCount=0;this.dataCache=null;this.dataList=[]}function q(a,c){if(void 0==a.length)throw Error(a.length+"/"+c);for(var d=0;d<a.length&&0==a[d];)d++;this.num=Array(a.length-d+c);for(var b=0;b<a.length-d;b++)this.num[b]=a[b+d]}function p(a,c){this.totalCount=a;this.dataCount=c}function t(){this.buffer=[];this.length=0}u.prototype={getLength:function(){return this.data.length},
      write:function(a){for(var c=0;c<this.data.length;c++)a.put(this.data.charCodeAt(c),8)}};o.prototype={addData:function(a){this.dataList.push(new u(a));this.dataCache=null},isDark:function(a,c){if(0>a||this.moduleCount<=a||0>c||this.moduleCount<=c)throw Error(a+","+c);return this.modules[a][c]},getModuleCount:function(){return this.moduleCount},make:function(){if(1>this.typeNumber){for(var a=1,a=1;40>a;a++){for(var c=p.getRSBlocks(a,this.errorCorrectLevel),d=new t,b=0,e=0;e<c.length;e++)b+=c[e].dataCount;
      for(e=0;e<this.dataList.length;e++)c=this.dataList[e],d.put(c.mode,4),d.put(c.getLength(),j.getLengthInBits(c.mode,a)),c.write(d);if(d.getLengthInBits()<=8*b)break}this.typeNumber=a}this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(a,c){this.moduleCount=4*this.typeNumber+17;this.modules=Array(this.moduleCount);for(var d=0;d<this.moduleCount;d++){this.modules[d]=Array(this.moduleCount);for(var b=0;b<this.moduleCount;b++)this.modules[d][b]=null}this.setupPositionProbePattern(0,0);this.setupPositionProbePattern(this.moduleCount-
      7,0);this.setupPositionProbePattern(0,this.moduleCount-7);this.setupPositionAdjustPattern();this.setupTimingPattern();this.setupTypeInfo(a,c);7<=this.typeNumber&&this.setupTypeNumber(a);null==this.dataCache&&(this.dataCache=o.createData(this.typeNumber,this.errorCorrectLevel,this.dataList));this.mapData(this.dataCache,c)},setupPositionProbePattern:function(a,c){for(var d=-1;7>=d;d++)if(!(-1>=a+d||this.moduleCount<=a+d))for(var b=-1;7>=b;b++)-1>=c+b||this.moduleCount<=c+b||(this.modules[a+d][c+b]=
      0<=d&&6>=d&&(0==b||6==b)||0<=b&&6>=b&&(0==d||6==d)||2<=d&&4>=d&&2<=b&&4>=b?!0:!1)},getBestMaskPattern:function(){for(var a=0,c=0,d=0;8>d;d++){this.makeImpl(!0,d);var b=j.getLostPoint(this);if(0==d||a>b)a=b,c=d}return c},createMovieClip:function(a,c,d){a=a.createEmptyMovieClip(c,d);this.make();for(c=0;c<this.modules.length;c++)for(var d=1*c,b=0;b<this.modules[c].length;b++){var e=1*b;this.modules[c][b]&&(a.beginFill(0,100),a.moveTo(e,d),a.lineTo(e+1,d),a.lineTo(e+1,d+1),a.lineTo(e,d+1),a.endFill())}return a},
      setupTimingPattern:function(){for(var a=8;a<this.moduleCount-8;a++)null==this.modules[a][6]&&(this.modules[a][6]=0==a%2);for(a=8;a<this.moduleCount-8;a++)null==this.modules[6][a]&&(this.modules[6][a]=0==a%2)},setupPositionAdjustPattern:function(){for(var a=j.getPatternPosition(this.typeNumber),c=0;c<a.length;c++)for(var d=0;d<a.length;d++){var b=a[c],e=a[d];if(null==this.modules[b][e])for(var f=-2;2>=f;f++)for(var i=-2;2>=i;i++)this.modules[b+f][e+i]=-2==f||2==f||-2==i||2==i||0==f&&0==i?!0:!1}},setupTypeNumber:function(a){for(var c=
          j.getBCHTypeNumber(this.typeNumber),d=0;18>d;d++){var b=!a&&1==(c>>d&1);this.modules[Math.floor(d/3)][d%3+this.moduleCount-8-3]=b}for(d=0;18>d;d++)b=!a&&1==(c>>d&1),this.modules[d%3+this.moduleCount-8-3][Math.floor(d/3)]=b},setupTypeInfo:function(a,c){for(var d=j.getBCHTypeInfo(this.errorCorrectLevel<<3|c),b=0;15>b;b++){var e=!a&&1==(d>>b&1);6>b?this.modules[b][8]=e:8>b?this.modules[b+1][8]=e:this.modules[this.moduleCount-15+b][8]=e}for(b=0;15>b;b++)e=!a&&1==(d>>b&1),8>b?this.modules[8][this.moduleCount-
      b-1]=e:9>b?this.modules[8][15-b-1+1]=e:this.modules[8][15-b-1]=e;this.modules[this.moduleCount-8][8]=!a},mapData:function(a,c){for(var d=-1,b=this.moduleCount-1,e=7,f=0,i=this.moduleCount-1;0<i;i-=2)for(6==i&&i--;;){for(var g=0;2>g;g++)if(null==this.modules[b][i-g]){var n=!1;f<a.length&&(n=1==(a[f]>>>e&1));j.getMask(c,b,i-g)&&(n=!n);this.modules[b][i-g]=n;e--; -1==e&&(f++,e=7)}b+=d;if(0>b||this.moduleCount<=b){b-=d;d=-d;break}}}};o.PAD0=236;o.PAD1=17;o.createData=function(a,c,d){for(var c=p.getRSBlocks(a,
      c),b=new t,e=0;e<d.length;e++){var f=d[e];b.put(f.mode,4);b.put(f.getLength(),j.getLengthInBits(f.mode,a));f.write(b)}for(e=a=0;e<c.length;e++)a+=c[e].dataCount;if(b.getLengthInBits()>8*a)throw Error("code length overflow. ("+b.getLengthInBits()+">"+8*a+")");for(b.getLengthInBits()+4<=8*a&&b.put(0,4);0!=b.getLengthInBits()%8;)b.putBit(!1);for(;!(b.getLengthInBits()>=8*a);){b.put(o.PAD0,8);if(b.getLengthInBits()>=8*a)break;b.put(o.PAD1,8)}return o.createBytes(b,c)};o.createBytes=function(a,c){for(var d=
      0,b=0,e=0,f=Array(c.length),i=Array(c.length),g=0;g<c.length;g++){var n=c[g].dataCount,h=c[g].totalCount-n,b=Math.max(b,n),e=Math.max(e,h);f[g]=Array(n);for(var k=0;k<f[g].length;k++)f[g][k]=255&a.buffer[k+d];d+=n;k=j.getErrorCorrectPolynomial(h);n=(new q(f[g],k.getLength()-1)).mod(k);i[g]=Array(k.getLength()-1);for(k=0;k<i[g].length;k++)h=k+n.getLength()-i[g].length,i[g][k]=0<=h?n.get(h):0}for(k=g=0;k<c.length;k++)g+=c[k].totalCount;d=Array(g);for(k=n=0;k<b;k++)for(g=0;g<c.length;g++)k<f[g].length&&
  (d[n++]=f[g][k]);for(k=0;k<e;k++)for(g=0;g<c.length;g++)k<i[g].length&&(d[n++]=i[g][k]);return d};s=4;for(var j={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,
      78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(a){for(var c=a<<10;0<=j.getBCHDigit(c)-j.getBCHDigit(j.G15);)c^=j.G15<<j.getBCHDigit(c)-j.getBCHDigit(j.G15);return(a<<10|c)^j.G15_MASK},getBCHTypeNumber:function(a){for(var c=a<<12;0<=j.getBCHDigit(c)-
  j.getBCHDigit(j.G18);)c^=j.G18<<j.getBCHDigit(c)-j.getBCHDigit(j.G18);return a<<12|c},getBCHDigit:function(a){for(var c=0;0!=a;)c++,a>>>=1;return c},getPatternPosition:function(a){return j.PATTERN_POSITION_TABLE[a-1]},getMask:function(a,c,d){switch(a){case 0:return 0==(c+d)%2;case 1:return 0==c%2;case 2:return 0==d%3;case 3:return 0==(c+d)%3;case 4:return 0==(Math.floor(c/2)+Math.floor(d/3))%2;case 5:return 0==c*d%2+c*d%3;case 6:return 0==(c*d%2+c*d%3)%2;case 7:return 0==(c*d%3+(c+d)%2)%2;default:throw Error("bad maskPattern:"+
      a);}},getErrorCorrectPolynomial:function(a){for(var c=new q([1],0),d=0;d<a;d++)c=c.multiply(new q([1,l.gexp(d)],0));return c},getLengthInBits:function(a,c){if(1<=c&&10>c)switch(a){case 1:return 10;case 2:return 9;case s:return 8;case 8:return 8;default:throw Error("mode:"+a);}else if(27>c)switch(a){case 1:return 12;case 2:return 11;case s:return 16;case 8:return 10;default:throw Error("mode:"+a);}else if(41>c)switch(a){case 1:return 14;case 2:return 13;case s:return 16;case 8:return 12;default:throw Error("mode:"+
      a);}else throw Error("type:"+c);},getLostPoint:function(a){for(var c=a.getModuleCount(),d=0,b=0;b<c;b++)for(var e=0;e<c;e++){for(var f=0,i=a.isDark(b,e),g=-1;1>=g;g++)if(!(0>b+g||c<=b+g))for(var h=-1;1>=h;h++)0>e+h||c<=e+h||0==g&&0==h||i==a.isDark(b+g,e+h)&&f++;5<f&&(d+=3+f-5)}for(b=0;b<c-1;b++)for(e=0;e<c-1;e++)if(f=0,a.isDark(b,e)&&f++,a.isDark(b+1,e)&&f++,a.isDark(b,e+1)&&f++,a.isDark(b+1,e+1)&&f++,0==f||4==f)d+=3;for(b=0;b<c;b++)for(e=0;e<c-6;e++)a.isDark(b,e)&&!a.isDark(b,e+1)&&a.isDark(b,e+
      2)&&a.isDark(b,e+3)&&a.isDark(b,e+4)&&!a.isDark(b,e+5)&&a.isDark(b,e+6)&&(d+=40);for(e=0;e<c;e++)for(b=0;b<c-6;b++)a.isDark(b,e)&&!a.isDark(b+1,e)&&a.isDark(b+2,e)&&a.isDark(b+3,e)&&a.isDark(b+4,e)&&!a.isDark(b+5,e)&&a.isDark(b+6,e)&&(d+=40);for(e=f=0;e<c;e++)for(b=0;b<c;b++)a.isDark(b,e)&&f++;a=Math.abs(100*f/c/c-50)/5;return d+10*a}},l={glog:function(a){if(1>a)throw Error("glog("+a+")");return l.LOG_TABLE[a]},gexp:function(a){for(;0>a;)a+=255;for(;256<=a;)a-=255;return l.EXP_TABLE[a]},EXP_TABLE:Array(256),
      LOG_TABLE:Array(256)},m=0;8>m;m++)l.EXP_TABLE[m]=1<<m;for(m=8;256>m;m++)l.EXP_TABLE[m]=l.EXP_TABLE[m-4]^l.EXP_TABLE[m-5]^l.EXP_TABLE[m-6]^l.EXP_TABLE[m-8];for(m=0;255>m;m++)l.LOG_TABLE[l.EXP_TABLE[m]]=m;q.prototype={get:function(a){return this.num[a]},getLength:function(){return this.num.length},multiply:function(a){for(var c=Array(this.getLength()+a.getLength()-1),d=0;d<this.getLength();d++)for(var b=0;b<a.getLength();b++)c[d+b]^=l.gexp(l.glog(this.get(d))+l.glog(a.get(b)));return new q(c,0)},mod:function(a){if(0>
      this.getLength()-a.getLength())return this;for(var c=l.glog(this.get(0))-l.glog(a.get(0)),d=Array(this.getLength()),b=0;b<this.getLength();b++)d[b]=this.get(b);for(b=0;b<a.getLength();b++)d[b]^=l.gexp(l.glog(a.get(b))+c);return(new q(d,0)).mod(a)}};p.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],
      [4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,
          116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,
          43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,
          3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,
          55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,
          45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];p.getRSBlocks=function(a,c){var d=p.getRsBlockTable(a,c);if(void 0==d)throw Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+c);for(var b=d.length/3,e=[],f=0;f<b;f++)for(var h=d[3*f+0],g=d[3*f+1],j=d[3*f+2],l=0;l<h;l++)e.push(new p(g,j));return e};p.getRsBlockTable=function(a,c){switch(c){case 1:return p.RS_BLOCK_TABLE[4*(a-1)+0];case 0:return p.RS_BLOCK_TABLE[4*(a-1)+1];case 3:return p.RS_BLOCK_TABLE[4*
  (a-1)+2];case 2:return p.RS_BLOCK_TABLE[4*(a-1)+3]}};t.prototype={get:function(a){return 1==(this.buffer[Math.floor(a/8)]>>>7-a%8&1)},put:function(a,c){for(var d=0;d<c;d++)this.putBit(1==(a>>>c-d-1&1))},getLengthInBits:function(){return this.length},putBit:function(a){var c=Math.floor(this.length/8);this.buffer.length<=c&&this.buffer.push(0);a&&(this.buffer[c]|=128>>>this.length%8);this.length++}};"string"===typeof h&&(h={text:h});h=r.extend({},{render:"canvas",width:256,height:256,typeNumber:-1,
      correctLevel:2,background:"#ffffff",foreground:"#000000"},h);return this.each(function(){var a;if("canvas"==h.render){a=new o(h.typeNumber,h.correctLevel);a.addData(h.text);a.make();var c=document.createElement("canvas");c.width=h.width;c.height=h.height;for(var d=c.getContext("2d"),b=h.width/a.getModuleCount(),e=h.height/a.getModuleCount(),f=0;f<a.getModuleCount();f++)for(var i=0;i<a.getModuleCount();i++){d.fillStyle=a.isDark(f,i)?h.foreground:h.background;var g=Math.ceil((i+1)*b)-Math.floor(i*b),
      j=Math.ceil((f+1)*b)-Math.floor(f*b);d.fillRect(Math.round(i*b),Math.round(f*e),g,j)}}else{a=new o(h.typeNumber,h.correctLevel);a.addData(h.text);a.make();c=r("<table></table>").css("width",h.width+"px").css("height",h.height+"px").css("border","0px").css("border-collapse","collapse").css("background-color",h.background);d=h.width/a.getModuleCount();b=h.height/a.getModuleCount();for(e=0;e<a.getModuleCount();e++){f=r("<tr></tr>").css("height",b+"px").appendTo(c);for(i=0;i<a.getModuleCount();i++)r("<td></td>").css("width",
      d+"px").css("background-color",a.isDark(e,i)?h.foreground:h.background).appendTo(f)}}a=c;jQuery(a).appendTo(this)})}})(jQuery);

});