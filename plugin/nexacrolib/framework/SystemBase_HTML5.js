//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacro17-public-license-readme-1.1.html
//
//==============================================================================

// ==============================================================================
// nexacro system Utility API's
// ==============================================================================

// ============================================================================
if (nexacro._Browser != "Runtime")
{
    "use strict";

    if (!nexacro.nexacro_init)
    {
        nexacro.nexacro_init = {};
    }
    var _process = true;

    if (window._popup && window.opener && window.opener != window)
    {
        const parent_ref = window.opener.__getopenerinstance();

        window._application = parent_ref.application ? parent_ref.application : null;
        nexacro._environment = parent_ref.nexacro._environment;
        nexacro.__parentismodule = parent_ref.nexacro.ismodule;

        system = parent_ref.system;
        nexacro._errortable = parent_ref.nexacro._errortable;
        nexacro._StringResource = parent_ref.nexacro._StringResource;

        nexacro._theme_uri = parent_ref.nexacro._theme_uri;
        nexacro._component_uri = parent_ref.nexacro._component_uri;
        nexacro._project_absolutepath = parent_ref.nexacro._project_absolutepath;
        nexacro._typedefinition_url = parent_ref.nexacro._typedefinition_url;

        //css map file 
        /*
        nexacro._css_predefine_maps = parent_ref.nexacro._css_predefine_maps;
        nexacro._dimension_maps = parent_ref.nexacro._dimension_maps;
        nexacro._include_status_map = parent_ref.nexacro._include_status_map;
        nexacro._has_listview_expand_status = parent_ref.nexacro._has_listview_expand_status;
        nexacro._apply_markup_validation = parent_ref.nexacro._apply_markup_validation;
        nexacro._CSS_STATUS = parent_ref.nexacro._CSS_STATUS;
        nexacro._CSS_USERSTATUS = parent_ref.nexacro._CSS_USERSTATUS;
        //imagecachelist in css map file
        nexacro._ImgInfoCacheList = parent_ref.nexacro._ImgInfoCacheList;
        //initvaluefile 
        nexacro.nexacro_init = parent_ref.nexacro.nexacro_init;
        */
    }

    if (!nexacro._Init_systembase_html)
    {
        nexacro._Init_systembase_html = true;

        function __traceImpl()
        {
            if (window.console)
            {
                const a = arguments;
                const n = arguments.length;
                if (globalThis.chrome && globalThis.chrome.webview)
                {
                    var msgs = [];
                    for (var i = 0; i < n; i++)
                    {
                        if (arguments[i] === undefined)
                            msgs.push("undefined");
                        else if (arguments[i] === null)
                            msgs.push("null");
                        else
                            msgs.push(arguments[i]);
                    }
                    var msg = msgs.join(' ');

                    return nexacro._writeTraceLog(4, msg, false, nexacro._loglevel);
                }
                switch (n)
                {
                    case 1:
                        window.console.log(a[0] + '');
                        break;
                    case 2:
                        window.console.log(a[0], ' ', a[1]);
                        break;
                    case 3:
                        window.console.log(a[0], ' ', a[1], ' ', a[2]);
                        break;
                    case 4:
                        window.console.log(a[0], ' ', a[1], ' ', a[2], ' ', a[3]);
                        break;
                    case 5:
                        window.console.log(a[0], ' ', a[1], ' ', a[2], ' ', a[3], ' ', a[4]);
                        break;
                    case 6:
                        window.console.log(a[0], ' ', a[1], ' ', a[2], ' ', a[3], ' ', a[4], ' ', a[5]);
                        break;
                    case 7:
                        window.console.log(a[0], ' ', a[1], ' ', a[2], ' ', a[3], ' ', a[4], ' ', a[5], ' ', a[6]);
                        break;
                    case 8:
                        window.console.log(a[0], ' ', a[1], ' ', a[2], ' ', a[3], ' ', a[4], ' ', a[5], ' ', a[6], ' ', a[7]);
                        break;
                    case 9:
                        window.console.log(a[0], ' ', a[1], ' ', a[2], ' ', a[3], ' ', a[4], ' ', a[5], ' ', a[6], ' ', a[7], ' ', a[8]);
                        break;
                    case 10:
                        window.console.log(a[0], ' ', a[1], ' ', a[2], ' ', a[3], ' ', a[4], ' ', a[5], ' ', a[6], ' ', a[7], ' ', a[8], ' ', a[9]);
                        break;
                }
            }
            else
            {
                let str;
                if (nexacro._OS == "Windows Phone")
                {
                    str = arguments[0];
                    let params = '{"message":"' + str + '"}';
                    let jsonstr = 'DebugConsole,Debug,' + this._id + ',' + params;
                    window.external.Notify(jsonstr);
                }
            }
        }
        //==============================================================================
        // trace Function
        //==============================================================================

        if (trace)
        {
            trace = nexacro.ismodule
                ? __traceImpl
                : (window.trace = __traceImpl);
        }



        nexacro._nexacroconsole = function (str, w, h)
        {
            var target = document.body;//document.getElementById("mainframe");
            var console = document.getElementById("nexacroconsole");

            if (!console)
            {
                console = document.createElement("div");
                console.id = "nexacroconsole";
                //console.className = "nexacroconsole";
                console.style.backgroundColor = "black";
                console.style.color = "white";
                console.style.fontSize = "34";
                console.style.position = "absolute";
                console.style.left = 100;
                console.style.top = 100;
                console.style.width = 100;
                console.style.height = 100;

                if (w)
                {
                    console.style.width = (parseInt(w) | 0) + "px";
                }
                if (h)
                {
                    console.style.height = (parseInt(h) | 0) + "px";
                }

                if (target)
                {
                    target.appendChild(console);
                }
            }

            console.innerHTML = str;// + "<br>" +console.innerHTML;
        };

        nexacro._traceV8CallStack = nexacro._emptyFn;
        nexacro._peekWindowHandleMessageQueuePassing = nexacro._emptyFn;
        nexacro._blockWindowHandleMessage = nexacro._emptyFn;
        //==============================================================================
        // Browser Type detection
        //==============================================================================
        // i:HTML5, 2:Legacy, 9:Runtime
        nexacro._Browser_RoundBorder = 1; // 0:none, 1:HTML5/Runtime, 2:Legacy
        nexacro._Browser_Gradient = 1; // 0:none, 1:HTML5/Runtime, 2:Legacy
        nexacro._Browser_Transform = 1; // 0:none, 1:HTML5/Runtime, 2:Legacy
        nexacro._Browser_Transform3d = 1; // 0:none, 1:HTML5/Runtime, 2:Legacy
        nexacro._Browser_BorderImage = 1; // 0:none, 1:HTML5/Runtime, 2:Legacy

        nexacro._OS = "";           // (like systemtype)    - Windows, Windows Phone, iOS, Android, Mac OS, Linux
        if (!navigator.userAgentData)
            nexacro._OSVersion = "";    // (OS Version String)  - Windows 7, Linux, iOS 5, Android 3.1, Mac OS X, ...
        nexacro._DEVICE = "";       // Web/Desktop Runtime : "", Mobile App(Android Runtime, Hybrid) : mobideproducttype
        nexacro._SystemType = "";   // win32(Win64 없음), ipad, iphone, android, winphone, mac, linux
        nexacro._BrowserLang = "";
        //nexacro._use_stringresource = false;  -> Environment.usestringresource 사용
        nexacro._StringResourceLang = "";
        if (nexacro._Browser == "MobileSafari")
        {
            nexacro._Browser_Transform3d = 2;
        }
        else if (nexacro._Browser == "Safari")
        {
            nexacro._Browser_Transform = 2;
            nexacro._Browser_Transform3d = 2;
        }
        else if (nexacro._Browser == "WebKit")
        {
            nexacro._Browser_RoundBorder = 2;
            nexacro._Browser_BorderImage = 2;
            nexacro._Browser_Gradient = 2;
            nexacro._Browser_Transform = 2;
            nexacro._Browser_Transform3d = 0;
            nexacro._Browser_BorderImage = 2;
        }

        // detect OS
        (function ()
        {
            var _regexp_detectos = [
                { OS: "Windows", systype: "win32", expr: "Windows\\sNT\\s([0-9\\.]*)" },
                { OS: "Windows Phone", systype: "win32", expr: "Windows Phone.*OS\\s([\\d_]+)" },
                { OS: "Mac OS", systype: "mac", expr: "Mac\\sOS[\\s|a-z|A-Z]+\\s([\\d_]+)" },
                { OS: "iOS", systype: "ipad", expr: "iPad[\\s|a-z|A-Z|;]+OS\\s([\\d_]+)" },
                { OS: "iOS", systype: "iphone", expr: "iPhone\\sOS\\s([\\d_]+)" },
                { OS: "Android", systype: "android", expr: "Android\\s+([\\d.]+)" },
                { OS: "Linux", systype: "linux", expr: "Linux\\s+([\\w]+)" }
            ];

            var cnt = _regexp_detectos.length, version;
            for (var i = 0; i < cnt; i++)
            {
                var info = _regexp_detectos[i];
                version = navigator.userAgent.match(new RegExp(info.expr, 'i'));
                if (version)
                {
                    if (!navigator.userAgentData)
                        nexacro._OSVersion = version[1].replace(/_/g, '.');

                    if (info.OS === "Mac OS")
                    {
                        if (navigator.maxTouchPoints > 0)
                        {
                            info.OS = "iOS";
                            info.systype = "ipad";
                            nexacro._SystemTypeEx = "ProforMouseEvent"; // nexacro._OSVersion >= "14.0.1" mac os는 버전이 다름
                            nexacro._MobileDesktopMode = true;
                        }
                    }
                    else if (info.OS === "iOS")
                    {
                        if (nexacro._OSVersion >= "13.4") // ipad 13.4부터 마우스 지원
                            nexacro._SystemTypeEx = "ProforMouseEvent";
                    }
                    else if (info.OS === "Linux")
                    {
                        if (("ontouchstart" in window) && (window.navigator.maxTouchPoints > 0))
                        {
                            nexacro._AndroidDesktopMode = true;
                        }
                    }

                    nexacro._OS = info.OS;
                    // Mobile Web에서는 Device 정보를 정확히 모르기 때문에 체크하지 않아야 함.
                    nexacro._SystemType = info.systype;
                    break;
                }
            }

            if (nexacro._OS === "")
            {
                version = navigator.userAgent.match("Android");

                if (version)
                    nexacro._OS = version[0];
            }
        })();



        if (navigator)
        {
            nexacro._BrowserLang = (navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage);
            nexacro._SystemLang = (navigator.systemLanguage || nexacro._BrowserLang);

            if (navigator.userAgentData)
            {
                nexacro._setHighEntropyAgentInfo = function (info)
                {
                    var _osversion = parseFloat(info.platformVersion);
                    nexacro._accurateModel = info.model;
                    if (info.platform == "Windows")
                    {
                        if (_osversion >= 11)
                        {
                            nexacro._OSVersion = "11.0"
                        }
                        else if (_osversion >= 1)
                        {
                            nexacro._OSVersion = "10.0"
                        }
                        else if (_osversion == 0.3)
                        {
                            nexacro._OSVersion = "6.3"
                        }
                        else if (_osversion == 0.2)
                        {
                            nexacro._OSVersion = "6.2"
                        }
                        else if (_osversion == 0.1)
                        {
                            nexacro._OSVersion = "6.1"
                        }
                        else
                        {
                            nexacro._OSVersion = "11.0"
                        }
                    }
                    else if (info.platform == "macOS")
                    {
                        // 성능 비교 필요
                        nexacro._OSVersion = info.platformVersion;
                    }
                    else
                    {
                        // 성능 비교 필요
                        nexacro._OSVersion = _osversion;
                    }
                    if (!nexacro.System)
                    {
                        nexacro.System = {};
                    }
                    nexacro.System.osversion = nexacro._getOSVersion();
                }

                nexacro._initAccurateAgent = function (callbackFn)
                {
                    return navigator.userAgentData.getHighEntropyValues(["architecture", "model", "platform", "platformVersion", "fullVersionList"]).then(function (info)
                    {
                        callbackFn(info);
                    });
                };
            }
        }



        // for Browser's status
        nexacro._checkDocument =
        {
            hasInnerText: document.documentElement.innerText !== undefined,
            hasTextContent: document.documentElement.textContent !== undefined,
            hasElementFromPoint: document.documentElement.elementFromPoint !== undefined,
            hasScreenLeftTop: (document.defaultView || document.parentWindow).screenLeft !== undefined,
            hasGetBoxObjectFor: document.getBoxObjectFor !== undefined,
            hasGetBoundingClientRect: document.documentElement.getBoundingClientRect !== undefined,
            hasOnInput: document.documentElement.oninput !== undefined,
            quirksMode: document.compatMode === "BackCompat",
            strictMode: document.compatMode === "CSS1Compat"
        };

        //==============================================================================
        if (nexacro._Browser == "MobileSafari")
        {
            nexacro.KeyCode_ImeInput = 0;
        }
        else
        {
            nexacro.KeyCode_ImeInput = 229;
        }

        //==============================================================================
        // error Function

        // KISA 보안취약점(6-2) 지적사항
        /*
        nexacro._error = function (e, at)
        {
            var msg = [];
            msg.push(e.toString());
            if (at && at.length)
            {
                msg.push("at : " + at);
            }
            if (e.fileName)
            {
                msg.push("at : " + e.fileName + ": " + e.lineNumber);
            }
            if (self.__debuginfo)
            {
                msg.push("at : " + self.__debuginfo);
            }
            trace(msg.join('\n'));
        };
        */
        nexacro._called_msg_window = false;
        nexacro._alert = function (cur_frame, str/*, caption, type*/)
        {
            var handle, _window;
            if (cur_frame instanceof nexacro.Frame || cur_frame instanceof nexacro.Form)
            {
                _window = cur_frame._getWindow();
                if (_window)
                {
                    _window._cancelEvent();
                    handle = _window.handle;
                }
                else
                    handle = nexacro._getMainWindowHandle();
            }
            else
            {
                handle = nexacro._getMainWindowHandle();
            }

            nexacro._called_msg_window = true;
            nexacro._cur_drag_info = null;
            nexacro._cur_repeat_info = null;
            nexacro._cur_track_info = null;
            nexacro._cur_extra_track_info = null;

            str = nexacro._toString(str);
            handle.alert(str);
        };

        nexacro._confirm = function (cur_frame, str, caption, type)
        {
            var handle, _window;
            if (cur_frame instanceof nexacro.Frame || cur_frame instanceof nexacro.Form)
            {
                _window = cur_frame._getWindow();
                if (_window)
                {
                    _window._cancelEvent();
                    handle = _window.handle;
                }
                else
                    handle = nexacro._getMainWindowHandle();
            }
            else
            {
                handle = nexacro._getMainWindowHandle();
            }
            nexacro._called_msg_window = true;

            if (nexacro._macOSWebView)
            {
                var jsonStr = JSON.stringify({
                    text: str,
                    caption: caption,
                    type: type
                });
                return handle.confirm(jsonStr);
            }

            return handle.confirm(str);
        };

        //==============================================================================
        nexacro._setCookie = function (name, value, expires, bsecure)
        {
            if (!name)
                return;

            var prevalue = nexacro._getCookie(name);
            if (!nexacro._isNull(prevalue) && (value == prevalue))
                return;

            var v = name + "=" + value;
            if (expires)
            {
                if (typeof (expires) == "string")
                {
                    expires = "; expires=" + expires;
                }
                else if ((typeof expires) == "object" && (expires instanceof Date))
                {
                    expires = "; expires=" + expires.toGMTString();
                }
            }
            else
            {
                expires = "";
            }

            v += expires;
            v += "; path=/";
            if (bsecure)
                v += "; secure";

            document.cookie = v;
        };

        nexacro._getCookie = function (name)
        {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');

            for (var i = 0; i < ca.length; i++)
            {
                var c = ca[i];
                while (c.charAt(0) == ' ')
                {
                    c = c.substring(1);
                }
                if (c.indexOf(nameEQ) === 0)
                {
                    return c.substring(nameEQ.length);
                }
            }
            return null;
        };

        nexacro._removeCookie = function (name)
        {
            var expires = new Date();
            expires.setDate(expires.getDate() - 1);

            nexacro._setCookie(name, "", expires);
        };

        // sandbox
        nexacro._setFileSecureLevel = nexacro._emptyFn;
        nexacro._setNetworkSecureLevel = nexacro._emptyFn;
        nexacro._setEnableInspector = nexacro._emptyFn;
        nexacro._setEnableScreenCapture = nexacro._emptyFn;
        nexacro._setEnableCookie = nexacro._emptyFn;
        nexacro._setEnableCache = nexacro._emptyFn;
        nexacro._setEnableClipboard = nexacro._emptyFn;


        // css

        nexacro._setRootNodeClassName = function ()
        {
            const env = nexacro.getEnvironment();
            const root = document.documentElement;
            if (!env.csscollisionpreventkey || !root)
                return;

            const rootClasses = root.className.split(/\s+/);

            const remainedClasses = rootClasses.filter(
                (cls) => !cls.endsWith(env.csscollisionpreventkey)
            );

            const addedClasses = env._rootcssclasslist.map(
                (item) => `${item}_${env.csscollisionpreventkey}`
            );

            const newClasses = [...remainedClasses, ...addedClasses].filter(Boolean).join(" ");

            root.className = newClasses;
        };

        // get Exception Message
        if (nexacro._Browser == "Gecko")
        {
            nexacro._getExceptionMessage = function (e)
            {
                var msg = e.toString() + "\r\n"; // + sourceName;
                msg += "\r\n" + e.stack;

                return msg;
            };
            nexacro._getEvalExceptionMessage = function (e, src_url, base_line)
            {
                var msg = e.toString() + '\r\nat line ' + (e.lineNumber - base_line);
                msg += ', in eval script(' + decodeURI(src_url) + ')';
                return msg;
            };
        }
        else if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
        {
            // for error message
            Error.prepareStackTrace = function (error, stack)
            {
                return stack;
            };

            nexacro._getExceptionMessage = function (e)
            {
                var msg = e.toString();
                if (e.stack && e.stack.length > 0)
                {
                    for (var i = 0; i < e.stack.length; i++)
                    {
                        var frame = e.stack[i];
                        var url = frame.getEvalOrigin() || frame.getScriptNameOrSourceURL() + ":" + frame.getLineNumber();
                        msg += "\r\nat line " + frame.getLineNumber() + ", in function: " + frame.getMethodName() + " in " + decodeURI(url);
                    }
                }
                return msg;
            };
            nexacro._getEvalExceptionMessage = function (e, src_url/*, base_line*/)
            {
                var msg = e.toString() + '\r\nin eval script(' + decodeURI(src_url) + ')';
                return msg;
            };
        }
        else if (nexacro._BrowserType == "WebKit")
        {
            nexacro._getExceptionMessage = function (e)
            {
                var sourceName = e.sourceURL ? decodeURI(e.sourceURL) : "(anonymous)";
                var lineNumber = e.line;

                var msg = e.toString() + "\r\n" + sourceName + ' (at line ' + lineNumber + ')';
                if (e.stack) msg += "\r\n" + e.stack;

                return msg;
            };
            nexacro._getEvalExceptionMessage = function (e, src_url/*, base_line*/)
            {
                var msg = e.toString() + '\r\nin eval script(' + decodeURI(src_url) + ')';
                return msg;
            };
        }
        else
        {
            nexacro._getExceptionMessage = function (e)
            {
                var msg = e.toString();
                if (e.stack) msg += "\r\n" + e.stack;
                return msg;
            };
            nexacro._getEvalExceptionMessage = function (e, src_url/*, base_line*/)
            {
                var msg = e.toString() + '\r\nin eval script(' + decodeURI(src_url) + ')';
                return msg;
            };
        }

        nexacro.__appendDOMNode = function (parent_node, node)
        {
            parent_node.appendChild(node);
        };
        nexacro.__insertDOMNode = function (parent_node, node, before_node)
        {
            if (before_node)
                parent_node.insertBefore(node, before_node);
            else
                parent_node.appendChild(node);
        };

        nexacro.__removeDOMNode = function (parent_node, node)
        {
            if (node && parent_node)
            {
                // 닫히고 있는 window에서 호출될 경우 object가 망가져있어서 사용할수 없는 인터페이스라는 오류가 발생한다.
                try
                {
                    parent_node.removeChild(node);
                }
                catch (e)
                {
                    nexacro._settracemsg(e);
                }
            }
        };
        nexacro.__unlinkDOMNode = function (parent_node, node)
        {
            // unlink use for temp : use it always unlink & append pare
            if (node && parent_node)
            {
                parent_node.removeChild(node);
            }
        };
        nexacro.__removeDOMAllChildren = function (parent_node)
        {
            if (parent_node)
            {
                // 닫히고 있는 window에서 호출될 경우 object가 망가져있어서 사용할수 없는 인터페이스라는 오류가 발생한다.
                try
                {
                    var node = parent_node.firstChild;
                    while (node)
                    {
                        parent_node.removeChild(node);
                        node = parent_node.firstChild;
                    }
                }
                catch (e)
                {
                    nexacro._settracemsg(e);
                }
            }
        };

        //=============================================================================
        // DOM Node Tree Controll APIs : HTML only
        //=============================================================================
        nexacro.__getPrevDOMNode = function (node)
        {
            do
            {
                node = node.prevSibling;
            }
            while (node && node.nodeType != 1);
            return node;
        };
        nexacro.__getNextDOMNode = function (node)
        {
            do
            {
                node = node.nextSibling;
            }
            while (node && node.nodeType != 1);
            return node;
        };

        //nexacro.__getFirstChildDOMNode = function (node)
        //{
        //    var child_node = node.firstChild;
        //    while (child_node && child_node.nodeType != 1)
        //        child_node = child_node.nextSibling;
        //    return child_node;
        //};
        nexacro.__getLastChildDOMNode = function (node)
        {
            var child_node = node.lastChild;
            while (child_node && child_node.nodeType != 1)
                child_node = child_node.prevSibling;
            return child_node;
        };

        nexacro.__bringDOMNodeToFront = function (node)
        {
            // send to Last
            var parent_node = node.parentNode;
            if (parent_node)
            {
                var last_node = nexacro.__getLastChildDOMNode(parent_node);
                if (node != last_node)
                {
                    //IE에서 removeChild 하면 Memory Leak발생하기 때문에 바로 appendChild한다.
                    parent_node.appendChild(node);
                }
            }
        };
        nexacro.__sendDOMNodeToBack = function (node)
        {
            // send to First
            var parent_node = node.parentNode;
            if (parent_node)
            {
                var first_node = parent_node.firstChild;
                if (node != first_node)
                {
                    //IE에서 removeChild 하면 Memory Leak발생하기 때문에 바로 appendChild한다.
                    parent_node.insertBefore(node, first_node);
                }
            }
        };

        nexacro.__moveDOMNodeToPrev = function (node, target_node)
        {
            if (target_node && target_node != node)
            {
                var parent_node = node.parentNode;
                if (parent_node && parent_node == target_node.parentNode)
                {
                    //next check
                    var next_node = nexacro.__getNextDOMNode(target_node);
                    if (next_node != node)
                    {
                        //IE에서 removeChild 하면 Memory Leak발생하기 때문에 바로 appendChild한다.
                        if (next_node)
                        {
                            parent_node.insertBefore(node, next_node);
                        }
                        else
                        {
                            parent_node.appendChild(node);
                        }
                    }
                }
            }
        };

        nexacro.__moveDOMNodeToNext = function (node, target_node)
        {
            if (target_node && target_node != node)
            {
                var parent_node = node.parentNode;
                if (parent_node && parent_node == target_node.parentNode)
                {
                    //prev check
                    var target_prev_node = nexacro.__getPrevDOMNode(target_node);
                    if (target_prev_node != node)
                    {
                        //IE에서 removeChild 하면 Memory Leak발생하기 때문에 바로 appendChild한다.
                        parent_node.insertBefore(node, target_node);
                    }
                }
            }
        };

        //=============================================================================
        // DOM Node Control APIs : HTML only
        //=============================================================================
        nexacro.__setDOMNode_ClassName = function (node, classname)
        {
            node.className = classname;
        };

        nexacro.__setDOMNode_Status = function (node, status)
        {
            node[nexacro._CSS_STATUS] = status; // setAttribute로 설정 안되는 경우가 있음. 예) readonly
            node.setAttribute(nexacro._CSS_STATUS, status);
        };
        nexacro.__setDomNode_PopOver = function (node)
        {
            if (!node.hasAttribute("popover"))
                node.setAttribute("popover", "manual");
        };

        nexacro.__actionDomNode_TogglePopOver = function (node)
        {
            if (node.hasAttribute("popover"))
                node.togglePopover();
        };
        nexacro.__actionDomNode_ShowPopOver = function (node)
        {
            if (node.hasAttribute("popover"))
                node.showPopover();
        };
        nexacro.__actionDomNode_HidePopOver = function (node)
        {
            if (node.hasAttribute("popover"))
                node.hidePopover();
        }


        nexacro.__setDOMNode_Text = function (node, text)
        {
            node.text = text;
        };

        nexacro.__getHTMLAttr_Status = function (status)
        {
            return " " + nexacro._CSS_STATUS + "=" + status;
        };

        nexacro.__setDOMNode_UserStatus = function (node, userstatus)
        {
            node[nexacro._CSS_USERSTATUS] = status;
            node.setAttribute(nexacro._CSS_USERSTATUS, userstatus);

            node.className = node.className; // for refreshing bug // 소나큐브무시 : IE8 미지원으로 추후 코드 정리 예정
        };

        nexacro.__getHTMLAttr_UserStatus = function (userstatus)
        {
            return " " + nexacro._CSS_USERSTATUS + "=" + userstatus;
        };

        if (nexacro._OS == "iOS")
        {
            nexacro.__setDOMNode_Enable = function (node, enable_flag)
            {
                node.disabled = (enable_flag ? false : true);

                // for iOS : [RP_37187] - Text not visible when input node was disable
                node.style.nexaStatusDisabled = node.disabled;
                if (enable_flag)
                {
                    node.style.opacity = "";
                    node.style.webkitTextFillColor = "";
                }
                else
                {
                    node.style.opacity = 1;
                    node.style.webkitTextFillColor = node.style.color;
                }
            };

            nexacro.__getHTMLStyle_Enable = function (enable_flag, color)
            {
                if (!enable_flag)
                {
                    return "opacity:1;-webkit-text-fill-color:" + (color ? color._sysvalue : "") + ";";
                }
                else
                {
                    return "";
                }
            };
        }
        else
        {
            nexacro.__setDOMNode_Enable = function (node, enable_flag)
            {
                node.disabled = (enable_flag ? false : true);
            };

            nexacro.__getHTMLStyle_Enable = function (/*enable_flag*/)
            {
                return "";
            };
        }

        nexacro.__setTextAreaDOMNode_Enable = function (node, enable_flag)
        {
            nexacro.__setDOMNode_Enable(node, enable_flag);
            nexacro.__setDOMNode_Selectable(node, enable_flag);
        };

        nexacro.__getHTMLAttr_Enable = function (enable_flag)
        {
            return (enable_flag ? "" : " disabled='true'");
        };

        nexacro.__getTextAreaHTMLAttr_Enable = function (enable_flag)
        {
            return enable_flag ? nexacro.__getHTMLAttr_Selectable(enable_flag) : (" disabled='true'" + nexacro.__getHTMLAttr_Selectable(enable_flag));
        };

        if (nexacro._Browser == "Opera")
        {
            nexacro.__getHTMLAttr_Selectable = function (selectable_flag)
            {
                return " unselectable=" + (selectable_flag ? "'off'" : "'on'");
            };
            nexacro.__getHTMLStyle_Selectable = function (/*selectable_flag*/)
            {
                return "";
            };
        }
        else if (nexacro._BrowserType == "Gecko")
        {
            nexacro.__getHTMLAttr_Selectable = function (/*selectable_flag*/)
            {
                return "";
            };
            nexacro.__getHTMLStyle_Selectable = function (selectable_flag)
            {
                return selectable_flag ? "" : "-moz-user-select:none;";
            };
        }
        else if (nexacro._BrowserType == "WebKit")
        {
            nexacro.__getHTMLAttr_Selectable = function (/*selectable_flag*/)
            {
                return "";
            };
            nexacro.__getHTMLStyle_Selectable = function (selectable_flag)
            {
                return selectable_flag ? "" : "-webkit-user-select:none;";
            };
        }
        else
        {
            nexacro.__getHTMLAttr_Selectable = function (/*selectable_flag*/)
            {
                return "";
            };
            nexacro.__getHTMLStyle_Selectable = function (selectable_flag)
            {
                return selectable_flag ? "" : "user-select:none;";
            };
        }

        nexacro.__setDOMNode_ReadOnly = function (node, readonly_flag)
        {
            node.readOnly = readonly_flag;
        };

        nexacro.__getHTMLAttr_ReadOnly = function (readonly_flag)
        {
            return (readonly_flag ? " readonly" : "");
        };

        nexacro.__setDOMNode_TabIndex = function (node, index)
        {
            node.tabIndex = index;
        };
        nexacro.__getHTMLAttr_TabIndex = function (index)
        {
            return " tabindex ='" + index + "' ";
        };

        nexacro.__setDOMNode_Id = function (node, parentid, id)
        {
            node.id = parentid + id;
        };

        nexacro.__setDOMNode_ToolTip = function (node, tooltiptext/*, tooltiptype*/)
        {
            // title이 설정되면 controlelement에 focus를 주면 nexacontentsbox의 innertext까지 읽는 문제 발생.
            if (nexacro._AccessibilityUtil.isUseTooltipText())
            {
                if (nexacro._isNull(tooltiptext))
                    nexacro.__removeHTMLAttr_Property(node, "title");
                else
                    nexacro.__setDOMNode_Title(node, tooltiptext);
            }
        };

        //nexacro.__getDOMNode_ToolTip = function (node)
        //{
        //	if (node)
        //		return node.title;
        //	return "";
        //}
        nexacro.__setDOMNodeStyle_WordWrap = function (node_style, wordwrap)
        {
            if (wordwrap == "char") // 오페라는 word가 english로 동작함.
            {
                node_style.whiteSpace = "pre-wrap";
                node_style.wordWrap = "break-word";
                node_style.wordBreak = "break-all";
            }
            else if (wordwrap == "english")
            {
                node_style.whiteSpace = "pre-wrap";
                node_style.wordWrap = "break-word";
                node_style.wordBreak = "normal";
            }
            else if (wordwrap == "none")
            {
                node_style.whiteSpace = "pre";
                node_style.wordWrap = "normal";
                node_style.wordBreak = "";
            }
            else
            {
                node_style.whiteSpace = "";
                node_style.wordWrap = "";
                node_style.wordBreak = "";
            }
        };

        if (nexacro._Browser == "Opera")
        {
            nexacro.__setDOMNode_Selectable = function (node, selectable_flag)
            {
                node.unselectable = selectable_flag ? "off" : "on";
            };
            nexacro.__isDOMNodeSelectable = function (node)
            {
                return (node.unselectable == "off");
            };
        }
        else if (nexacro._BrowserType == "Gecko")
        {
            nexacro.__setDOMNode_Selectable = function (node, selectable_flag)
            {
                node.style.MozUserSelect = selectable_flag ? "" : "none";
            };
            nexacro.__isDOMNodeSelectable = function (node)
            {
                return (node.style.MozUserSelect === "");
            };
        }
        else if (nexacro._BrowserType == "WebKit")
        {
            nexacro.__setDOMNode_Selectable = function (node, selectable_flag)
            {
                node.style.webkitUserSelect = selectable_flag ? "" : "none";
            };
            nexacro.__isDOMNodeSelectable = function (node)
            {
                return (node.style.webkitUserSelect === "");
            };
        }
        else
        {
            nexacro.__setDOMNode_Selectable = function (node, selectable_flag)
            {
                node.style.userSelect = selectable_flag ? "" : "none";
            };
            nexacro.__isDOMNodeSelectable = function (node)
            {
                return (node.style.userSelect === "");
            };
        }

        nexacro.__setDOMNode_Title = function (node, text)
        {
            if (!text)
            {
                text = "";
            }

            if (!node.title || node.title != text)
                return node.title = text;
        };

        // nexacro.__setDOMNode_MaxLength : only for inputfilterextDOMNode
        nexacro.__setDOMNode_MaxLength = function (node, maxlength)
        {
            node.maxLength = (maxlength > 0) ? maxlength : 65535;
        };

        //-----------------------------------------------------------------------------
        // new DOM API for 14.1
        //-----------------------------------------------------------------------------
        if (nexacro._OS == "iOS")
        {
            nexacro.__setDOMStyle_ColorObject = function (node_style, color)
            {
                // for iOS : [RP_37187] - Text not visible when input node was disable
                if (node_style.nexaStatusDisabled)
                {
                    node_style.webkitTextFillColor = (color ? color._sysvalue : "");
                }
                else
                {
                    node_style.color = (color ? color._sysvalue : "");
                }
            };
        }
        else
        {
            nexacro.__setDOMStyle_ColorObject = function (node_style, color)
            {
                node_style.color = (color ? color._sysvalue : "");
            };
        }

        nexacro.__getHTMLStyle_ColorObject = function (color)
        {
            return color ? ("color:" + color._sysvalue + ";") : "";
        };

        nexacro.__setDOMStyle_FontObject = function (node_style, font)
        {
            if (font && font.value)
                node_style.font = font.value;
            else
                node_style.font = "";
        };

        nexacro.__getHTMLStyle_FontObject = function (font)
        {
            return (font && font.value) ? ("font:" + nexacro._encodeXml(font.value) + ";") : "";
        };

        nexacro.__setDOMStyle_TextDecorationObject = function (node_style, decoration)
        {
            if (decoration && decoration.value)
                node_style.textDecoration = decoration.value;
            else
                node_style.textDecoration = "";
        };
        nexacro.__getHTMLStyle_TextDecorationObject = function (decoration)
        {
            return (decoration && decoration.value) ? ("text-decoration:" + decoration.value + ";") : "";
        };

        nexacro.__setDOMStyle_LineHeightObject = function (node_style, lineheight)
        {
            if (lineheight && lineheight.value)
                node_style.lineHeight = lineheight.value;
            else
                node_style.lineHeight = "";
        };
        nexacro.__getHTMLStyle_LineHeightObject = function (lineheight)
        {
            return (lineheight && lineheight.value) ? ("line-height:" + lineheight.value + ";") : "";
        };

        nexacro.__setDOMStyle_WordSpacingObject = function (node_style, wordspacing)
        {
            if (wordspacing && wordspacing.value)
                node_style.wordSpacing = wordspacing.value;
            else
                node_style.wordSpacing = "";
        };

        nexacro.__getHTMLStyle_WordSpacingObject = function (wordspacing)
        {
            return (wordspacing && wordspacing.value) ? ("word-spacing:" + wordspacing.value + ";") : "";
        };

        nexacro.__setDOMStyle_LetterSpacingObject = function (node_style, letterspacing)
        {
            if (letterspacing && letterspacing.value)
                node_style.letterSpacing = parseInt(letterspacing.value) + "px";
            else
                node_style.letterSpacing = "";
        };

        nexacro.__getHTMLStyle_LetterSpacingObject = function (letterspacing)
        {
            return (letterspacing && letterspacing.value) ? ("letter-spacing:" + letterspacing.value + ";") : "";
        };

        nexacro.__getHTMLStyle_WordWrap = function (wordwrap)
        {
            if (wordwrap == "char")
                return "white-space:pre-wrap; word-wrap:break-word; word-break:break-all;";
            else if (wordwrap == "english")
                return "white-space:pre-wrap; word-wrap:break-word; word-break:normal;";
            else
                return "white-space:pre; word-wrap:normal;word-break:normal;";
        };

        //-----------------------------------------------------------------------------
        if (nexacro._Browser_RoundBorder == 1)
        {
            nexacro.__setDOMStyle_BorderRadiusObject = function (node_style, borderRadius, rtl)
            {
                if (rtl)
                    node_style.borderRadius = (borderRadius ? borderRadius.rtlvalue : "");
                else
                    node_style.borderRadius = (borderRadius ? borderRadius.value : "");
            };
            nexacro.__getHTMLStyle_BorderRadiusObject = function (borderRadius, rtl)
            {
                if (rtl)
                    return borderRadius ? ("border-radius:" + borderRadius.rtlvalue + ";") : "";
                else
                    return borderRadius ? ("border-radius:" + borderRadius.value + ";") : "";
            };
        }
        else if (nexacro._Browser_RoundBorder == 2)
        { // legacy
            if (nexacro._Browser == "Gecko")
            {
                nexacro.__setDOMStyle_BorderRadiusObject = function (node_style, borderRadius, rtl)
                {
                    if (rtl)
                        node_style.MozBorderRadius = (borderRadius ? borderRadius.rtlvalue : "");
                    else
                        node_style.MozBorderRadius = (borderRadius ? borderRadius.value : "");
                };
                nexacro.__getHTMLStyle_BorderRadiusObject = function (borderRadius, rtl)
                {
                    if (rtl)
                        return borderRadius ? ("-moz-border-radius:" + borderRadius.rtlvalue + ";") : "";
                    else
                        return borderRadius ? ("-moz-border-radius:" + borderRadius.value + ";") : "";
                };
            }
            else if (nexacro._BrowserType == "WebKit")
            {
                nexacro.__setDOMStyle_BorderRadiusObject = function (node_style, borderRadius, rtl)
                {
                    if (borderRadius)
                    {
                        if (rtl)
                            node_style.webkitBorderRadius = borderRadius.rtlvalue;
                        else
                            node_style.webkitBorderRadius = borderRadius.value;
                    }
                    else
                    {
                        node_style.webkitBorderRadius = "";
                    }
                };
                nexacro.__getHTMLStyle_BorderRadiusObject = function (borderRadius, rtl)
                {
                    if (rtl)
                        return borderRadius ? ("-webkit-border-radius:" + borderRadius.rtlvalue + ";") : "";
                    else
                        return borderRadius ? ("-webkit-border-radius:" + borderRadius.value + ";") : "";
                };
            }
        }

        nexacro.__setDOMStyle_BorderObject = function (node_style, border, rtl)
        {
            if (border)
            {
                if (border._single)
                    node_style.border = border.value;
                else
                {
                    var right_value;
                    if (border.bottom) // > 3
                    {
                        if (border.left)
                        {   //4
                            if (rtl)
                            {
                                node_style.borderRight = border.left.value;
                                node_style.borderLeft = border.right.value;
                            }
                            else
                            {
                                node_style.borderRight = border.right.value;
                                node_style.borderLeft = border.left.value;
                            }
                            node_style.borderTop = border.top.value;
                            node_style.borderBottom = border.bottom.value;

                        }
                        else //3
                        {
                            right_value = border.right.value;
                            /*if (rtl)
                            {
                                right_value = border.right.rtlvalue;
                            } */
                            node_style.borderTop = border.top.value;
                            node_style.borderRight = right_value;
                            node_style.borderBottom = border.bottom.value;
                            node_style.borderLeft = right_value;
                        }
                    }
                    else //2
                    {
                        right_value = border.right.value;
                        /*if (rtl)
                        {
                            right_value = border.right.rtlvalue;
                        } */
                        var top_value = border.top.value;
                        node_style.borderTop = top_value;
                        node_style.borderRight = right_value;
                        node_style.borderBottom = top_value;
                        node_style.borderLeft = right_value;
                    }
                }
            }
            else
                node_style.border = "";
        };

        nexacro.__setDOMStyle_BorderLeftNone = function (node_style, borderleftnone, border)
        {
            if (borderleftnone)
                node_style.borderLeft = "none";
            else
                node_style.borderLeft = (border) ? border.left.value : "";
        };

        nexacro.__getHTMLStyle_BorderLeftNone = function (/*border*/)
        {
            return "border-left:none;";
        };

        nexacro.__setDOMStyle_BorderTopNone = function (node_style, bordertopnone, border)
        {
            if (bordertopnone)
                node_style.borderTop = "none";
            else
                node_style.borderTop = (border) ? border.top.value : "";
        };

        nexacro.__getHTMLStyle_BorderTopNone = function (/*border*/)
        {
            return "border-top:none;";
        };

        nexacro.__setDOMStyle_BorderRightNone = function (node_style, borderrightnone, border)
        {
            if (borderrightnone)
                node_style.borderRight = "none";
            else
                node_style.borderRight = (border) ? border.right.value : "";
        };

        nexacro.__getHTMLStyle_BorderRightNone = function (/*border*/)
        {
            return "border-right:none;";
        };

        nexacro.__setDOMStyle_BorderBottomNone = function (node_style, borderbottomnone, border)
        {
            if (borderbottomnone)
                node_style.borderBottom = "none";
            else
                node_style.borderBottom = (border) ? border.bottom.value : "";
        };

        nexacro.__getHTMLStyle_BorderBottomNone = function (/*border*/)
        {
            return "border-bottom:none;";
        };

        nexacro.__setDOMStyle_BorderNone = function (node_style, borderleft, bordertop, borderright, borderbottom, border, rtl)
        {
            if (rtl)
            {
                if (borderleft)
                    node_style.borderRight = "none";
                else
                    node_style.borderRight = (border) ? border.left.value : "";

                if (borderright)
                    node_style.borderLeft = "none";
                else
                    node_style.borderLeft = (border) ? border.right.value : "";
            }
            else
            {
                if (borderleft)
                    node_style.borderLeft = "none";
                else
                    node_style.borderLeft = (border) ? border.left.value : "";

                if (borderright)
                    node_style.borderRight = "none";
                else
                    node_style.borderRight = (border) ? border.right.value : "";
            }

            if (bordertop)
                node_style.borderTop = "none";
            else
                node_style.borderTop = (border) ? border.top.value : "";

            if (borderbottom)
                node_style.borderBottom = "none";
            else
                node_style.borderBottom = (border) ? border.bottom.value : "";
        };

        nexacro.__getHTMLStyle_BorderObject = function (border, rtl)
        {
            if (border)
            {
                if (border._single)
                    return ("border:" + border.value + ";");
                else
                {
                    if (rtl)
                    {
                        return "border-top:" + border.top.value + ";border-right:" + border.left.value +
                            ";border-bottom:" + border.bottom.value + ";border-left:" + border.right.value + ";";
                    }
                    else
                    {
                        return "border-top:" + border.top.value + ";border-right:" + border.right.value +
                            ";border-bottom:" + border.bottom.value + ";border-left:" + border.left.value + ";";
                    }
                }
            }
            return "";
        };

        nexacro.__setDOMStyle_BackgroundObject = function (node_style, background, rtl)
        {
            if (background)
            {
                node_style.background = nexacro.__getHTMLStyle_BackgroundObject_Shorthand(background, rtl);
            }
            else
            {
                node_style.background = "";
            }
        };

        nexacro.__getHTMLStyle_BackgroundObject = function (background, rtl)
        {
            var str = "";
            if (background)
            {
                str = "background:";
                str += nexacro.__getHTMLStyle_BackgroundObject_Shorthand(background, rtl);
                str += ";";
            }

            return str;
        };

        nexacro.__getHTMLStyle_BackgroundObject_Shorthand = function (background, rtl)
        {
            var str = "";

            if (background.origin)
                str = background.origin;

            if (background.clip)
                str += " " + background.clip;


            if (background.url && background.url != "none")
            {
                if (rtl)
                {
                    str += " url(" + background._sysrtlurl + ") ";
                    str += background.repeat;
                    str += " " + background.rtlpos_x + " " + background.pos_y;
                }
                else
                {
                    str += " url(" + background._sysurl + ") ";
                    str += background.repeat;
                    str += " " + background.pos_x + " " + background.pos_y;
                }
            }
            else if (background.gradient)
            {
                if (rtl)
                    str += " " + (background.gradient._sysrtlvalue ? background.gradient._sysrtlvalue : background.gradient._sysvalue);
                else
                    str += " " + background.gradient._sysvalue;

                /* set default background position for background size */
                if (background.size)
                {
                    str += " 0% 0%";
                }
            }

            if (background.size)
            {
                str += " / " + background.size;
            }

            if (background.color)
            {
                str += " " + background.color._sysvalue;
            }

            return str;
        };

        //-----------------------------------------------------------------------------
        nexacro.__setDOMStyle_MarginObject = function (node_style, margin, rtl)
        {
            if (rtl)
                node_style.margin = (margin ? margin.rtlvalue : "");
            else
                node_style.margin = (margin ? margin.value : "");
        };
        nexacro.__getHTMLStyle_MarginObject = function (margin, rtl)
        {
            if (rtl)
                return margin ? ("margin:" + margin.rtlvalue + ";") : "";
            else
                return margin ? ("margin:" + margin.value + ";") : "";
        };

        nexacro.__setDOMStyle_PaddingObject = function (node_style, padding, rtl)
        {
            if (padding)
            {
                if (rtl && padding.rtlvalue)
                {
                    node_style.padding = padding.rtlvalue;
                }
                else
                {
                    node_style.padding = padding.value;
                }
            }
            else
                node_style.padding = "";
        };
        nexacro.__getHTMLStyle_PaddingObject = function (padding, rtl)
        {
            if (rtl && padding.rtlvalue)
            {
                return padding ? ("padding:" + padding.rtlvalue + ";") : "";
            }
            else
            {
                return padding ? ("padding:" + padding.value + ";") : "";
            }
        };

        nexacro.__getHTMLStylePaddingLeft = function (left, rtl)
        {
            if (rtl)
                return "padding-right:" + left + "px";
            else
                return "padding-left:" + left + "px;";
        };
        nexacro.__getHTMLStylePaddingTop = function (top)
        {
            return "padding-top:" + top + "px;";
        };
        nexacro.__getHTMLStylePaddingRight = function (right, rtl)
        {
            if (rtl)
                return "padding-left:" + right + "px;";
            else
                return "padding-right:" + right + "px;";
        };
        nexacro.__getHTMLStylePaddingBottom = function (bottom)
        {
            return "padding-bottom:" + bottom + "px;";
        };

        //-----------------------------------------------------------------------------
        nexacro.__setDOMStyle_CursorObject = function (node_style, cursor)
        {
            node_style.cursor = (cursor ? cursor._sysvalue : "");
        };
        nexacro.__getHTMLStyle_CursorObject = function (cursor)
        {
            return cursor ? ("cursor:" + cursor._sysvalue + ";") : "";
        };

        nexacro.__setDOMStyle_OpacityObject = function (node_style, opacity)
        {
            node_style.opacity = (opacity ? opacity._sysvalue : "");
        };

        nexacro.__getHTMLStyle_OpacityObject = function (opacity)
        {
            return opacity ? ("opacity:" + opacity._sysvalue + ";") : "";
        };

        nexacro.__setDOMStyle_ShadowObject = function (node_style, shadow, rtl)
        {
            if (rtl)
            {
                node_style.boxShadow = (shadow ? shadow.rtlvalue : "");
            }
            else
            {
                node_style.boxShadow = (shadow ? shadow.value : "");
            }
        };
        nexacro.__getHTMLStyle_ShadowObject = function (shadow, rtl)
        {
            if (rtl)
            {
                return shadow ? ("box-shadow:" + shadow.rtlvalue + ";") : "";
            }
            else
            {
                return shadow ? ("box-shadow:" + shadow.value + ";") : "";
            }
        };
        nexacro.__setDOMStyle_Filter = nexacro._emptyFn;

        // Fluid Layout Component Dom getter
        nexacro.__getHTMLStyle_FluidLayoutDefaultPosition = function ()
        {
            return "position:sticky;";
        };

        nexacro.__getHTMLStyle_LayoutBasis = function (layoutbasis)
        {
            if (layoutbasis)
            {
                if (layoutbasis.type == "horizontal")
                    return "flex-basis:" + layoutbasis.width + ";";
                else if (layoutbasis.type == "vertical")
                    return "flex-basis:" + layoutbasis.height + ";";
            }
        };

        nexacro.__getHTMLStyle_FlexGrow = function (flexgrow)
        {
            return "flex-grow:" + flexgrow + ";";
        };

        nexacro.__getHTMLStyle_FlexShrink = function (flexshrink)
        {
            return "flex-shrink:" + flexshrink + ";";
        };

        nexacro.__getHTMLStyle_LayoutOrder = function (layoutorder)
        {
            return layoutorder ? ("order:" + layoutorder + ";") : "";
        };

        nexacro.__getHTMLStyle_TableCellArea = function (tablecellarea)
        {
            return tablecellarea ? ("grid-area:" + tablecellarea + ";") : "";
        };

        //-----------------------------------------------------------------------------
        nexacro.__setDOMStyle_textAlign = function (node_style, halign, rtl)
        {
            if (halign)
            {
                if (rtl)
                {
                    switch (halign)
                    {
                        case "left":
                            node_style.textAlign = "right";
                            break;
                        case "right":
                            node_style.textAlign = "left";
                            break;
                        default:
                            node_style.textAlign = halign;
                            break;
                    }
                }
                else
                {
                    node_style.textAlign = halign;
                }
            }
            else
            {
                node_style.textAlign = "";
            }
        };
        nexacro.__getHTMLStyle_textAlign = function (halign, rtl)
        {
            if (rtl)
            {
                switch (halign)
                {
                    case "left":
                        halign = "right";
                        break;
                    case "right":
                        halign = "left";
                        break;
                    default:
                        break;
                }
                return halign ? ("text-align:" + halign + ";") : "";
            }
            else
            {
                return halign ? ("text-align:" + halign + ";") : "";
            }
        };

        nexacro.__setDOMStyle_verticalAlign = function (node_style, valign)
        {
            if (valign)
            {
                node_style.verticalAlign = valign;
            }
            else
            {
                node_style.verticalAlign = "";
            }
        };
        nexacro.__getHTMLStyle_verticalAlign = function (valign)
        {
            return valign ? ("vertical-align:" + valign + ";") : "";
        };

        nexacro.__getHTMLStyle_lineHeight = function (lineheight)
        {
            return lineheight ? ("line-height:" + lineheight + ";") : "";
        };

        //-----------------------------------------------------------------------------
        if (nexacro._Browser_BorderImage == 1)
        {
            nexacro.__setDOMStyle_EdgeObject = function (node_style, edge)
            {
                if (edge)
                {
                    node_style.borderImage = "url(" + edge._sysurl + ")" + edge.edge_y + ' ' + edge.edge_x + ' fill / ' + edge.edge_y + 'px ' + edge.edge_x + 'px';
                }
                else
                {
                    node_style.borderImage = "";
                }
            };
            nexacro.__getHTMLStyle_EdgeObject = function (edge)
            {
                if (edge)
                {
                    return "border-image:url(" + edge._sysurl + ") " + edge.edge_y + ' ' + edge.edge_x + ' fill / ' + edge.edge_y + 'px ' + edge.edge_x + 'px;';
                }
                else
                {
                    return "";
                }
            };
        }
        else if (nexacro._Browser_BorderImage == 2)
        {
            if (nexacro._Browser == "Gecko")
            {
                nexacro.__setDOMStyle_EdgeObject = function (node_style, edge)
                {
                    if (edge)
                    {
                        //Firefox에서는 이미지가 로드되기전에 border가 잠시 나타나는 문제가 있다.
                        node_style.borderColor = "transparent";
                        node_style.MozBorderImage = "url(" + edge._sysurl + ")" + edge.edge_y + ' ' + edge.edge_x + ' fill / ' + edge.edge_y + 'px ' + edge.edge_x + 'px';
                    }
                    else
                    {
                        node_style.borderWidth = "";
                        node_style.MozBorderImage = "";
                    }
                };
                nexacro.__getHTMLStyle_EdgeObject = function (edge)
                {
                    if (edge)
                    {
                        return "border-color:transparent;-moz-border-image:url(" + edge._sysurl + ") " + edge.edge_y + ' ' + edge.edge_x + ' fill / ' + edge.edge_y + 'px ' + edge.edge_x + 'px;';
                    }
                    else
                    {
                        return "";
                    }
                };
            }
            else if (nexacro._Browser == "WebKit" || nexacro._Browser == "Safari" || nexacro._Browser == "MobileSafari")
            {
                nexacro.__setDOMStyle_EdgeObject = function (node_style, edge/*, zoom*/)
                {
                    if (edge)
                    {
                        // update contents
                        node_style.borderWidth = edge.edge_y + "px " + edge.edge_x + "px";
                        node_style.webkitBorderImage = "url(" + edge._sysurl + ") " + edge.edge_y + ' ' + edge.edge_x + " fill";
                    }
                    else
                    {
                        node_style.borderWidth = "";
                        node_style.webkitBorderImage = "";
                    }
                };
                nexacro.__getHTMLStyle_EdgeObject = function (edge)
                {
                    if (edge)
                    {
                        return "border-width:" + edge.edge_y + "px " + edge.edge_x + "px;-webkit-border-image:url(" + edge._sysurl + ") " + edge.edge_y + ' ' + edge.edge_x + " fill";
                    }
                    else
                    {
                        return "";
                    }
                };
            }
            else if (nexacro._Browser == "Opera")
            {
                nexacro.__setDOMStyle_EdgeObject = function (node_style, edge/*, zoom*/)
                {
                    // update contents
                    if (edge)
                    {
                        node_style.OBorderImage = "url(" + edge._sysurl + ") " + edge.edge_y + ' ' + edge.edge_x + ' fill / ' + edge.edge_y + 'px ' + edge.edge_x + 'px';
                    }
                    else
                    {
                        node_style.OBorderImage = "";
                    }
                };
                nexacro.__getHTMLStyle_EdgeObject = function (edge)
                {
                    if (edge)
                    {
                        return "-o-border-image:url(" + edge._sysurl + ") " + edge.edge_y + ' ' + edge.edge_x + ' fill / ' + edge.edge_y + 'px ' + edge.edge_x + 'px;';
                    }
                    else
                    {
                        return "";
                    }
                };
            }
        }
        else
        { // IE7,8,9
            nexacro.__setDOMStyle_EdgeObject = nexacro._emptyFn;
            nexacro.__getHTMLStyle_EdgeObject = function (/*edge*/)
            {
                return "";
            };
        }

        nexacro.__setDOMStyle_TextWidth = function (node_style, width)
        {
            node_style.width = (width | 0) + "px";
        };

        nexacro.__clearDOMStyle_TextWidth = function (node_style)
        {
            node_style.width = "";
        };

        nexacro.__getHTMLStyle_TextWidth = function (textwidth)
        {
            return "width:" + (textwidth | 0) + "px;";
        };

        nexacro.__setDOMStyle_Overflow = function (node_style, v)
        {
            node_style.overflow = v;
        };

        nexacro.__clearDOMStyle_Overflow = function (node_style)
        {
            node_style.overflow = "";
        };

        nexacro.__getHTMLStyle_Overflow = function (v)
        {
            return "overflow:" + v + ";";
        };

        nexacro.__setDOMNodeStylePointerEvents = function (node_style, value)
        {
            node_style.pointerEvents = value;
        };

        nexacro.__getHTMLStyle_PointerEvents = function (v)
        {
            return "pointer-events:" + v + ";";
        };

        nexacro.__setDOMStyle_Clippath = function (node_style, v)
        {
            node_style.clipPath = v;
        };

        nexacro.__clearDOMStyle_Clippath = function (node_style)
        {
            node_style.clipPath = "";
        };

        nexacro.__getHTMLStyle_Clippath = function (v)
        {
            return "clip-path:" + v + ";";
        };

        //-----------------------------------------------------------------------------
        // endof new DOM API for 14.1
        //-----------------------------------------------------------------------------

        //-----------------------------------------------------------------------------
        // direct DOM Handling API for 14.1
        //-----------------------------------------------------------------------------
        nexacro.__setDOMNode_ImageUrl = function (node, imgurl)
        {
            node.src = imgurl;
        };
        nexacro.__getHTMLAttr_ImageUrl = function (imgurl)
        {
            return " src='" + imgurl + "'";
        };

        nexacro.__setCanvasNodeSize = function (node, width, height)
        {
            if (width >= 0 && height >= 0)
            {
                node.width = width;
                node.height = height;
            }
        };

        //---------------------------------------------------------------------------
        // scroll position
        nexacro.__setDOMNode_Offset = function (node, offset_x, offset_y)
        {
            node.scrollLeft = offset_x;
            node.scrollTop = offset_y;
        };

        nexacro.__setDOMNode_HScrollPos = function (node, pos, rtl)
        {
            if (rtl)
            {
                node.scrollLeft = -pos;
            }
            else
            {
                node.scrollLeft = pos;
            }
        };

        nexacro.__setDOMNode_VScrollPos = function (node, pos)
        {
            node.scrollTop = pos;
        };

        //---------------------------------------------------------------------------
        // style position
        nexacro.__setDOMStyle_Pos = function (node_style, left, top, rtl)
        {
            if (left != null)
            {
                if (rtl)
                {
                    node_style.left = "";
                    node_style.right = left + "px";
                }
                else
                {
                    node_style.right = "";
                    node_style.left = left + "px";
                }
            }
            if (top != null)
                node_style.top = top + "px";
        };
        nexacro.__clearDOMStyle_Pos = function (node_style)
        {
            node_style.left = "";
            node_style.right = "";
            node_style.top = "";
        };
        nexacro.__getHTMLStyle_Pos = function (left, top, rtl)
        {
            if (rtl)
            {
                return "right:" + left + "px;top:" + top + "px;";
            }
            else
            {
                return "left:" + left + "px;top:" + top + "px;";
            }
        };

        nexacro.__setDOMStyle_Size = function (node_style, width, height)
        {
            if (width >= 0 && height >= 0)
            {
                node_style.width = width + "px";
                node_style.height = height + "px";
            }
        };

        nexacro.__setDOMStyle_FluidSize = function (node_style, layoutbasis)
        {
            if (layoutbasis.width)
                node_style.width = layoutbasis.width;
            if (layoutbasis.height)
                node_style.height = layoutbasis.height;
            //if (layoutbasis.maxwidth || node_style.maxWidth)
            node_style.maxWidth = layoutbasis.maxwidth ? layoutbasis.maxwidth : "";
            //if (layoutbasis.minwidth || node_style.minWidth)
            node_style.minWidth = layoutbasis.minwidth ? layoutbasis.minwidth : "";
            //if (layoutbasis.maxheight  || node_style.maxheight)
            node_style.maxHeight = layoutbasis.maxheight ? layoutbasis.maxheight : "";
            //if (layoutbasis.minheight || node_style.minHeight)
            node_style.minHeight = layoutbasis.minheight ? layoutbasis.minheight : "";
        };

        nexacro.__setDOMStyle_PercentageSize = function (node_style, width, height)
        {
            if (width >= 0 && height >= 0)
            {
                node_style.width = width + "%";
                node_style.height = height + "%";
            }
        };

        nexacro.__clearDOMStyle_Size = function (node_style)
        {
            node_style.width = "";
            node_style.height = "";
        };
        nexacro.__getHTMLStyle_Size = function (width, height)
        {
            return "width:" + width + "px;height:" + height + "px;";
        };

        nexacro.__getHTMLStyle_FluidSize = function (layoutbasis)
        {
            var str = "";

            if (layoutbasis.width)
                str += "width:" + layoutbasis.width + ";";
            if (layoutbasis.height)
                str += "height:" + layoutbasis.height + ";";
            if (layoutbasis.maxwidth)
                str += "max-width:" + layoutbasis.maxwidth + ";";
            if (layoutbasis.minwidth)
                str += "min-width:" + layoutbasis.minwidth + ";";
            if (layoutbasis.maxheight)
                str += "max-height:" + layoutbasis.maxheight + ";";
            if (layoutbasis.minheight)
                str += "min-height:" + layoutbasis.minheight + ";";
            return str;
        };

        nexacro.__setCanvasNodeStylePos = function (node_style, left, top)
        {
            node_style.left = left + "px";
            node_style.top = top + "px";
        };

        //-----------------------------------------------------------------------------
        // display attribute change
        if (nexacro._Browser == "MobileSafari")
        {
            nexacro.__setDOMStyle_Visible = function (node_style, visible_flag)
            {
                node_style.visibility = (visible_flag == true) ? "" : "hidden";
                node_style.display = (visible_flag == true) ? "" : "none";
            };
            nexacro.__getHTMLStyle_Visible = function (visible_flag)
            {
                return (visible_flag == true) ? "" : "visibility:hidden; display:none;";
            };
        }
        else
        {
            nexacro.__setDOMStyle_Visible = function (node_style, visible_flag)
            {
                node_style.visibility = (visible_flag == true) ? "" : "hidden";
            };
            nexacro.__getHTMLStyle_Visible = function (visible_flag)
            {
                return (visible_flag == true) ? "" : "visibility:hidden;";
            };
        }

        nexacro.__setDOMStyle_ForceVisibility = function (node_style, visible_flag)
        {
            node_style.visibility = (visible_flag === true) ? "visible" : "hidden";
        };

        nexacro.__setDOMStyle_Display = function (node_style, v)
        {
            node_style.display = v;
        };

        nexacro.__getHTMLStyle_Display = function (v)
        {
            return ("display:" + v + ";");
        };

        nexacro.__setDOMStyle_Clip = function (node_style, v)
        {
            if (v == "none")
                node_style.clip = "rect(0px, 0px, 0px, 0px)";
            else
                node_style.clip = "";
        };

        nexacro.__getHTMLStyle_Clip = function (v)
        {
            if (v == "none")
                return "clip:rect(0px,0px,0px,0px);";
        };

        nexacro.__setDOMStyle_BKImageUrl = function (node_style, imgurl)
        {
            node_style.backgroundImage = "url(" + imgurl + ")";
        };
        nexacro.__getHTMLStyle_BKImageUrl = function (imgurl)
        {
            return "background-image:url(" + imgurl + ");";
        };

        nexacro.__setDOMStyle_BKImageUrl2 = function (node_style, imgurl)
        {
            node_style.backgroundImage = imgurl;
        };
        nexacro.__getHTMLStyle_BKImageUrl2 = function (imgurl)
        {
            return "background-image:" + imgurl + ";";
        };

        nexacro.__setDOMStyle_BKImageAlign = function (node_style, halign, valign)
        {
            node_style.backgroundPosition = halign + " " + (valign == "middle" ? "center" : valign);
        };

        if (nexacro._Browser == "Gecko")
        {
            nexacro.__setDOMStyle_BKImageTextAlign = function (node_style, halign)
            {
                if (node_style.hasOwnProperty("backgroundPositionX"))
                {
                    node_style.backgroundPositionX = halign;
                    return;
                }

                var valign = "";
                var v = node_style.backgroundPosition + "";
                if (v.length > 0)
                {
                    var align = v.split(/\s+/);
                    valign = align[1] ? (" " + align[1]) : "";
                }

                node_style.backgroundPosition = halign + valign;
            };

            nexacro.__setDOMStyle_BKImageVerticalAlign = function (node_style, valign)
            {
                if (node_style.hasOwnProperty("backgroundPositionY"))
                {
                    node_style.backgroundPositionY = valign;
                    return;
                }

                var halign = "left"; //default

                var v = node_style.backgroundPosition + "";
                if (v.length > 0)
                {
                    var align = v.split(/\s+/);
                    halign = align[0] ? align[0] : "";
                }

                node_style.backgroundPosition = halign + " " + valign;
            };

            nexacro.__clearDOMStyle_BKImageTextAlign = function (node_style)
            {
                if (node_style.hasOwnProperty("backgroundPositionX"))
                {
                    node_style.backgroundPositionX = "";
                    return;
                }

                var v = node_style.backgroundPosition + "";
                var halign = "left";    //default
                var valign = "";
                if (v.length > 0)
                {
                    var align = v.split(/\s+/);
                    valign = align[1] ? align[1] : "";
                }

                if (!valign)
                    node_style.backgroundPosition = "";
                else
                    node_style.backgroundPosition = halign + " " + valign;
            };

            nexacro.__clearDOMStyle_BKImageVerticalAlign = function (node_style)
            {
                if (node_style.hasOwnProperty("backgroundPositionY"))
                {
                    node_style.backgroundPositionY = "";
                    return;
                }

                var v = node_style.backgroundPosition + "";
                var halign = "";
                if (v.length > 0)
                {
                    var align = v.split(/\s+/);
                    halign = align[0] ? align[0] : "";
                }

                node_style.backgroundPosition = halign;
            };

            nexacro.__getHTMLStyle_BKImageAlign = function (halign, valign)
            {
                var bkimagealign = "";
                if (halign)
                    bkimagealign = "background-position-x:" + halign + ";";
                if (valign)
                    bkimagealign += "background-position-y:" + valign + ";";
                return bkimagealign;
            };
        }
        else
        {
            nexacro.__setDOMStyle_BKImageTextAlign = function (node_style, halign)
            {
                node_style.backgroundPositionX = halign;
            };

            nexacro.__setDOMStyle_BKImageVerticalAlign = function (node_style, valign)
            {
                node_style.backgroundPositionY = valign;
            };

            nexacro.__clearDOMStyle_BKImageTextAlign = function (node_style)
            {
                node_style.backgroundPositionX = "";
            };

            nexacro.__clearDOMStyle_BKImageVerticalAlign = function (node_style)
            {
                node_style.backgroundPositionY = "";
            };

            nexacro.__getHTMLStyle_BKImageAlign = function (halign, valign)
            {
                var bkimagealign = "";
                if (halign)
                    bkimagealign = "background-position-x:" + halign + ";";
                if (valign)
                    bkimagealign += "background-position-y:" + valign + ";";
                return bkimagealign;
            };
        }



        nexacro.__clearDOMStyle_BKImageAlign = function (node_style)
        {
            node_style.backgroundPosition = "";
        };


        nexacro.__setDOMNode_Value = function (node, value)
        {
            node.value = value;
        };

        //==============================================================================
        nexacro.__setDOMStyle_Zindex = function (node_style, zindex)
        {
            node_style.zIndex = zindex;
        };

        nexacro.__getDOMNode_Zoom = function (node_style)
        {
            return node_style.zoom;
        };

        nexacro.__setDOMNode_Zoom = function (node_style, zoomFactor)
        {
            node_style.zoom = zoomFactor + "%";
        };

        nexacro.__setDOMStyle_Direction = function (node_style, direction)
        {
            if (direction)
                node_style.direction = "rtl";
            else
                node_style.direction = "ltr";
        };

        nexacro.__getHTMLStyle_Direction = function (direction)
        {
            return (direction === true) ? ("direction:rtl;") : "direction:ltr;";
        };

        //transform 함수 강제 호출시 필요
        if (nexacro._Browser_Transform3d === 0)
        { // not support
            nexacro.__setDOMStyle_TranslateR = function (node_style, offset_x, offset_y)
            {
                nexacro.__setDOMStyle_Pos(node_style, offset_x, offset_y);
            };

            nexacro.__clearDOMStyle_TranslateR = function (node_style)
            {
                node_style.left = "0px";
                node_style.top = "0px";
            };

        }
        else if (nexacro._Browser_Transform3d == 1)
        { // HTML5
            nexacro.__setDOMStyle_TranslateR = function (node_style, offset_x, offset_y)
            {
                node_style.transform = "translate(" + offset_x + "px, " + offset_y + "px)";
            };

            nexacro.__clearDOMStyle_TranslateR = function (node_style)
            {
                node_style.transform = "";
            };
        }
        else if (nexacro._Browser_Transform3d == 2)
        { // Lagacy
            if (nexacro._BrowserType == "WebKit")
            {
                nexacro.__setDOMStyle_TranslateR = function (node_style, offset_x, offset_y)
                {
                    node_style.WebkitTransform = "translate(" + offset_x + "px, " + offset_y + "px)";
                };
                nexacro.__clearDOMStyle_TranslateR = function (node_style)
                {
                    node_style.WebkitTransform = "";
                };

            }
            else if (nexacro._Browser == "Gecko")
            {
                nexacro.__setDOMStyle_TranslateR = function (node_style, offset_x, offset_y)
                {
                    node_style.MozTransform = "translate(" + offset_x + "px, " + offset_y + "px)";
                };
                nexacro.__clearDOMStyle_TranslateR = function (node_style)
                {
                    node_style.MozTransform = "";
                };

            }
            else if (nexacro._Browser == "Opera")
            {
                nexacro.__setDOMStyle_TranslateR = function (node_style, offset_x, offset_y)
                {
                    node_style.OTransform = "translate(" + offset_x + "px, " + offset_y + "px)";
                };

                nexacro.__clearDOMStyle_TranslateR = function (node_style)
                {
                    node_style.OTransform = "";
                };
            }
        }

        nexacro._Browser_Transform3d = 0;   //기존 동작 유지를 위해 설정시점을 늦춤

        if (nexacro._Browser_Transform3d === 0)
        { // not support
            nexacro.__setDOMStyle_Translate = function (node_style, offset_x, offset_y, rtl)
            {
                nexacro.__setDOMStyle_Pos(node_style, offset_x, offset_y, rtl);
            };
            nexacro.__setDOMStyle_TranslateX = function (node_style, pos, rtl)
            {
                node_style.left = pos + "px";
            };
            nexacro.__setDOMStyle_TranslateY = function (node_style, pos)
            {
                node_style.top = pos + "px";
            };
            nexacro.__clearDOMStyle_Translate = function (node_style)
            {
                node_style.left = "0px";
                node_style.right = "0px";
                node_style.top = "0px";
            };
        }
        else if (nexacro._Browser_Transform3d == 1)
        { // HTML5
            nexacro.__setDOMStyle_Translate = function (node_style, offset_x, offset_y)
            {
                node_style.transform = "translate3d(" + offset_x + "px, " + offset_y + "px, 0)";
            };
            nexacro.__setDOMStyle_TranslateX = function (node_style, pos)
            {
                node_style.transform = "translateX(" + pos + "px)";
            };
            nexacro.__setDOMStyle_TranslateY = function (node_style, pos)
            {
                node_style.transform = "translateY(" + pos + "px)";
            };
            nexacro.__clearDOMStyle_Translate = function (node_style)
            {
                node_style.transform = "";
            };
        }
        else if (nexacro._Browser_Transform3d == 2)
        { // Lagacy
            if (nexacro._BrowserType == "WebKit")
            {
                nexacro.__setDOMStyle_Translate = function (node_style, offset_x, offset_y)
                {
                    node_style.WebkitTransform = "translate3d(" + offset_x + "px, " + offset_y + "px, 0)";
                };
                nexacro.__setDOMStyle_TranslateX = function (node_style, pos)
                {
                    node_style.WebkitTransform = "translateX(" + pos + "px)";
                };
                nexacro.__setDOMStyle_TranslateY = function (node_style, pos)
                {
                    node_style.WebkitTransform = "translateY(" + pos + "px)";
                };
                nexacro.__clearDOMStyle_Translate = function (node_style)
                {
                    node_style.WebkitTransform = "";
                };
            }
            else if (nexacro._Browser == "Gecko")
            {
                nexacro.__setDOMStyle_Translate = function (node_style, offset_x, offset_y)
                {
                    node_style.MozTransform = "translate3d(" + offset_x + "px, " + offset_y + "px, 0)";
                };
                nexacro.__setDOMStyle_TranslateX = function (node_style, pos)
                {
                    node_style.MozTransform = "translateX(" + pos + "px)";
                };
                nexacro.__setDOMStyle_TranslateY = function (node_style, pos)
                {
                    node_style.MozTransform = "translateY(" + pos + "px)";
                };
                nexacro.__clearDOMStyle_Translate = function (node_style)
                {
                    node_style.MozTransform = "";
                };
            }
            else if (nexacro._Browser == "Opera")
            {
                nexacro.__setDOMStyle_Translate = function (node_style, offset_x, offset_y)
                {
                    node_style.OTransform = "translate3d(" + offset_x + "px, " + offset_y + "px, 0)";
                };
                nexacro.__setDOMStyle_TranslateX = function (node_style, pos)
                {
                    node_style.OTransform = "translateX(" + pos + "px)";
                };
                nexacro.__setDOMStyle_TranslateY = function (node_style, pos)
                {
                    node_style.OTransform = "translateY(" + pos + "px)";
                };
                nexacro.__clearDOMStyle_Translate = function (node_style)
                {
                    node_style.OTransform = "";
                };
            }
        }

        nexacro.__setDOMStyle_Transition = function (node_style, val)
        {
            node_style.transition = val;
            node_style.webkitTransition = val;
        };

        //-----------------------------------------------------------------------------
        // Fluid Layout
        //-----------------------------------------------------------------------------
        nexacro.__setDOMStyle_LayoutFluidPos = function (node_style)
        {
            node_style.position = "sticky";
        };

        nexacro.__clearDOMStyle_LayoutFluidPos = function (node_style)
        {
            node_style.position = "";
        };

        nexacro.__setDOMStyle_LayoutDirection = function (node_style, layoutdirection)
        {
            if (layoutdirection == "row")
            {
                node_style.flexDirection = "row";
            }
            else if (layoutdirection == "column")
            {
                node_style.flexDirection = "column";
            }
        };

        nexacro.__getHTMLStyle_CompLayoutType = function (layouttype)
        {
            if (layouttype == "horizontal")
            {
                return "display:flex;flex-direction:row;";
            }
            else if (layouttype == "vertical")
            {
                return "display:flex;flex-direction:column;";
            }
            else if (layouttype == "table")
            {
                // 일단 row 기본으로
                return "display:grid;flex-direction:row;";
            }
            return "";
        };

        nexacro.__setDOMStyle_CompLayoutType = function (node_style, layouttype)
        {
            if (layouttype == "horizontal")
            {
                node_style.display = "flex";
                node_style.flexDirection = "row";
            }
            else if (layouttype == "vertical")
            {
                node_style.display = "flex";
                node_style.flexDirection = "column";
            }
            else if (layouttype == "table")
            {
                node_style.display = "grid";
                // 일단 row 기본으로
                node_style.flexDirection = "row";
                //display autorow/col
                node_style.gridAutoRows = "0px";
                node_style.gridAutoColumns = "0px";
            }
            else // default
            {
                node_style.position = "";
                node_style.display = "";
            }
        };

        // for fluid Layout
        nexacro.__setDOMStyle_LayoutType = function (node_style, layouttype)
        {
            if (layouttype == "horizontal")
            {
                //    node_style.position = "sticky";//
                node_style.display = "flex";
                node_style.flexDirection = "row";
            }
            else if (layouttype == "vertical")
            {
                //        node_style.position = "sticky";//
                node_style.display = "flex";
                node_style.flexDirection = "column";
            }
            else if (layouttype == "table")
            {
                //        node_style.position = "sticky";//
                node_style.display = "grid";
                // 일단 row 기본으로
                node_style.flexDirection = "row";
                //display autorow/col
                node_style.gridAutoRows = "0px";
                node_style.gridAutoColumns = "0px";
            }
            else // default
            {
                node_style.position = "";
                node_style.display = "";
            }
        };

        nexacro.__getHTMLStyle_LayoutGap = function (layouthorizontalgap, layoutverticalgap)
        {
            if (layouthorizontalgap > -1 && layoutverticalgap > -1)
            {
                return "gap:" + layoutverticalgap + "px " + layouthorizontalgap + "px;";
            }
            else if (layouthorizontalgap > -1 && !layoutverticalgap)
            {
                return "gap:" + "0px " + layouthorizontalgap + "px;";
            }
            else if (layoutverticalgap > -1 && !layouthorizontalgap)
            {
                return "gap:" + layoutverticalgap + "px " + "0px;";
            }
            return "";
        };

        nexacro.__setDOMStyle_LayoutGap = function (node_style, layouthorizontalgap, layoutverticalgap)
        {
            if (layouthorizontalgap > -1 && layoutverticalgap > -1)
            {
                node_style.gap = layoutverticalgap + "px " + layouthorizontalgap + "px";
            }
            else if (layouthorizontalgap > -1 && !layoutverticalgap)
            {
                node_style.gap = "0px " + layouthorizontalgap + "px";
            }
            else if (layoutverticalgap > -1 && !layouthorizontalgap)
            {
                node_style.gap = layoutverticalgap + "px " + "0px";
            }
        };

        nexacro.__clearDOMStyle_LayoutGap = function (node_style)
        {
            node_style.gap = "";
        };


        if ((nexacro._OS == "Mac OS" || nexacro._OS == "iOS") || nexacro._Browser == "MobileSafari")
        {
            nexacro.__getHTMLStyle_FlexMainAxisAlign = function (flexmainaxisalign)
            {
                if (flexmainaxisalign)
                {
                    if (flexmainaxisalign == "start") flexmainaxisalign = "flex-start";
                    if (flexmainaxisalign == "end") flexmainaxisalign = "flex-end";

                    return "justify-content:" + flexmainaxisalign + ";";
                }
                return "";
            };
            nexacro.__setDOMStyle_FlexMainAxisAlign = function (node_style, flexmainaxisalign)
            {
                if (flexmainaxisalign)
                {
                    if (flexmainaxisalign == "start") flexmainaxisalign = "flex-start";
                    if (flexmainaxisalign == "end") flexmainaxisalign = "flex-end";

                    node_style.justifyContent = flexmainaxisalign;
                }
            };

            nexacro.__getHTMLStyle_FlexCrossAxisAlign = function (flexcrossaxisalign)
            {
                if (flexcrossaxisalign)
                {
                    if (flexcrossaxisalign == "start") flexcrossaxisalign = "flex-start";
                    if (flexcrossaxisalign == "end") flexcrossaxisalign = "flex-end";

                    return "align-items:" + flexcrossaxisalign + ";";
                }
                return "";
            };
            nexacro.__setDOMStyle_FlexCrossAxisAlign = function (node_style, flexcrossaxisalign)
            {
                if (flexcrossaxisalign)
                {
                    if (flexcrossaxisalign == "start") flexcrossaxisalign = "flex-start";
                    if (flexcrossaxisalign == "end") flexcrossaxisalign = "flex-end";

                    node_style.alignItems = flexcrossaxisalign;
                }
            };

            nexacro.__getHTMLStyle_FlexCrossAxisWrapAlign = function (FlexCrossAxisWrapAlign)
            {
                if (FlexCrossAxisWrapAlign)
                {
                    if (FlexCrossAxisWrapAlign == "start") FlexCrossAxisWrapAlign = "flex-start";
                    if (FlexCrossAxisWrapAlign == "end") FlexCrossAxisWrapAlign = "flex-end";

                    return "align-content:" + FlexCrossAxisWrapAlign + ";";
                }
                return "";
            };
            nexacro.__setDOMStyle_FlexCrossAxisWrapAlign = function (node_style, flexcrossaxiswrapalign)
            {
                if (flexcrossaxiswrapalign)
                {
                    if (flexcrossaxiswrapalign == "start") flexcrossaxiswrapalign = "flex-start";
                    if (flexcrossaxiswrapalign == "end") flexcrossaxiswrapalign = "flex-end";

                    node_style.alignContent = flexcrossaxiswrapalign;
                }
            };

            nexacro.__getHTMLStyle_TableCellHAlign = function (tablecellHalign)
            {
                if (tablecellHalign)
                {
                    if (tablecellHalign == "start") tablecellHalign = "flex-start";
                    if (tablecellHalign == "end") tablecellHalign = "flex-end";

                    return "justify-content:" + tablecellHalign + ";";
                }
                return "";
            };
            nexacro.__setDOMStyle_TableCellHAlign = function (node_style, tablecellHalign)
            {
                if (tablecellHalign)
                {
                    if (tablecellHalign == "start") tablecellHalign = "flex-start";
                    if (tablecellHalign == "end") tablecellHalign = "flex-end";

                    node_style.justifyContent = tablecellHalign;
                }
            };

            nexacro.__getHTMLStyle_TableCellVAlign = function (tablecellValign)
            {
                if (tablecellValign)
                {
                    if (tablecellValign == "start") tablecellValign = "flex-start";
                    if (tablecellValign == "end") tablecellValign = "flex-end";

                    return "align-content:" + tablecellValign + ";";
                }
                return "";
            };
            nexacro.__setDOMStyle_TableCellVAlign = function (node_style, tablecellValign)
            {
                if (tablecellValign)
                {
                    if (tablecellValign == "start") tablecellValign = "flex-start";
                    if (tablecellValign == "end") tablecellValign = "flex-end";

                    node_style.alignContent = tablecellValign;
                }
            };

            nexacro.__getHTMLStyle_TableCellinCompHAlign = function (tablecellincompHalign)
            {
                if (tablecellincompHalign)
                {
                    if (tablecellincompHalign == "start") tablecellincompHalign = "flex-start";
                    if (tablecellincompHalign == "end") tablecellincompHalign = "flex-end";

                    return "justify-items:" + tablecellincompHalign + ";";
                }
                return "";
            };
            nexacro.__setDOMStyle_TableCellinCompHAlign = function (node_style, tablecellincompHalign)
            {
                if (tablecellincompHalign)
                {
                    if (tablecellincompHalign == "start") tablecellincompHalign = "flex-start";
                    if (tablecellincompHalign == "end") tablecellincompHalign = "flex-end";

                    node_style.justifyItems = tablecellincompHalign;
                }
            };

            nexacro.__getHTMLStyle_TableCellinCompVAlign = function (tablecellincompValign)
            {
                if (tablecellincompValign)
                {
                    if (tablecellincompValign == "start") tablecellincompValign = "flex-start";
                    if (tablecellincompValign == "end") tablecellincompValign = "flex-end";

                    return "align-items:" + tablecellincompValign + ";";
                }
                return "";
            };
            nexacro.__setDOMStyle_TableCellinCompVAlign = function (node_style, tablecellincompValign)
            {
                if (tablecellincompValign)
                {
                    if (tablecellincompValign == "start") tablecellincompValign = "flex-start";
                    if (tablecellincompValign == "end") tablecellincompValign = "flex-end";

                    node_style.alignItems = tablecellincompValign;
                }
            };
        }
        else
        {
            nexacro.__getHTMLStyle_FlexMainAxisAlign = function (flexmainaxisalign)
            {
                if (flexmainaxisalign)
                {
                    return "justify-content:" + flexmainaxisalign + ";";
                }
                return "";
            };
            nexacro.__setDOMStyle_FlexMainAxisAlign = function (node_style, flexmainaxisalign)
            {
                if (flexmainaxisalign)
                {
                    node_style.justifyContent = flexmainaxisalign;
                }
            };

            nexacro.__getHTMLStyle_FlexCrossAxisAlign = function (flexcrossaxisalign)
            {
                if (flexcrossaxisalign)
                {
                    return "align-items:" + flexcrossaxisalign + ";";
                }
                return "";
            };
            nexacro.__setDOMStyle_FlexCrossAxisAlign = function (node_style, flexcrossaxisalign)
            {
                if (flexcrossaxisalign)
                {
                    node_style.alignItems = flexcrossaxisalign;
                }
            };

            nexacro.__getHTMLStyle_FlexCrossAxisWrapAlign = function (FlexCrossAxisWrapAlign)
            {
                if (FlexCrossAxisWrapAlign)
                {
                    return "align-content:" + FlexCrossAxisWrapAlign + ";";
                }
                return "";
            };
            nexacro.__setDOMStyle_FlexCrossAxisWrapAlign = function (node_style, flexcrossaxiswrapalign)
            {
                if (flexcrossaxiswrapalign)
                {
                    node_style.alignContent = flexcrossaxiswrapalign;
                }
            };

            nexacro.__getHTMLStyle_TableCellHAlign = function (tablecellHalign)
            {
                if (tablecellHalign)
                {
                    return "justify-content:" + tablecellHalign + ";";
                }
                return "";
            };
            nexacro.__setDOMStyle_TableCellHAlign = function (node_style, tablecellHalign)
            {
                if (tablecellHalign)
                {
                    node_style.justifyContent = tablecellHalign;
                }
            };

            nexacro.__getHTMLStyle_TableCellVAlign = function (tablecellValign)
            {
                if (tablecellValign)
                {
                    return "align-content:" + tablecellValign + ";";
                }
                return "";
            };
            nexacro.__setDOMStyle_TableCellVAlign = function (node_style, tablecellValign)
            {
                if (tablecellValign)
                {
                    node_style.alignContent = tablecellValign;
                }
            };

            nexacro.__getHTMLStyle_TableCellinCompHAlign = function (tablecellincompHalign)
            {
                if (tablecellincompHalign)
                {
                    return "justify-items:" + tablecellincompHalign + ";";
                }
                return "";
            };
            nexacro.__setDOMStyle_TableCellinCompHAlign = function (node_style, tablecellincompHalign)
            {
                if (tablecellincompHalign)
                {
                    node_style.justifyItems = tablecellincompHalign;
                }
            };

            nexacro.__getHTMLStyle_TableCellinCompVAlign = function (tablecellincompValign)
            {
                if (tablecellincompValign)
                {
                    return "align-items:" + tablecellincompValign + ";";
                }
                return "";
            };
            nexacro.__setDOMStyle_TableCellinCompVAlign = function (node_style, tablecellincompValign)
            {
                if (tablecellincompValign)
                {
                    node_style.alignItems = tablecellincompValign;
                }
            };
        }

        nexacro.__getHTMLStyle_FlexMainAxisAlign = function (justifyitems)
        {
            return justifyitems ? ("justify-items:" + justifyitems + ";") : "";
        };

        nexacro.__getHTMLStyle_FlexCrossAxisAlign = function (alignitems)
        {
            return alignitems ? ("align-items:" + alignitems + ";") : "";
        };

        nexacro.__setDOMStyle_FlexWrap = function (node_style, flexwrap)
        {
            if (flexwrap == "wrap")
            {
                node_style.flexWrap = "wrap";
            }
            else
            {
                node_style.flexWrap = "nowrap";
            }
        };

        nexacro.__getHTMLStyle_TableTemplate = function (tabletemplate)
        {
            if (tabletemplate)
            {
                return "grid-template:" + tabletemplate + ";";
            }
            return "";
        };


        nexacro.__setDOMStyle_TableTemplate = function (node_style, tabletemplate)
        {
            if (tabletemplate)
            {
                node_style.gridTemplate = tabletemplate; //"250px / auto auto"
            }

        };

        nexacro.__clearDOMStyle_TableTemplate = function (node_style)
        {
            node_style.gridTemplate = "";
        };

        nexacro.__getHTMLStyle_TableTemplateArea = function (tabletemplatearea)
        {
            if (tabletemplatearea)
            {
                return "grid-template-areas:" + tabletemplatearea + ";"; // ". . . myArea myArea"
            }
            return "";
        };
        nexacro.__setDOMStyle_TableTemplateArea = function (node_style, tabletemplatearea)
        {
            if (tabletemplatearea)
            {
                node_style.gridTemplateAreas = tabletemplatearea; // ". . . myArea myArea"
            }
        };

        nexacro.__clearDOMStyle_TableTemplateArea = function (node_style)
        {
            node_style.gridTemplateAreas = "";
        };

        nexacro.__getHTMLStyle_TableDirection = function (tabledirection)
        {
            if (tabledirection == "horizontal")
            {
                return "grid-auto-flow:row;";
            }
            else if (tabledirection == "vertical")
            {
                return "grid-auto-flow:column;";
            }
            return "";
        };
        nexacro.__setDOMStyle_TableDirection = function (node_style, tabledirection)
        {
            if (tabledirection == "horizontal")
            {
                node_style.gridAutoFlow = "row";

            }
            else if (tabledirection == "vertical")
            {
                node_style.gridAutoFlow = "column";
            }

        };

        nexacro.__setDOMStyle_LayoutSpacing = function (node_style, layoutspacing, rtl)
        {
            if (layoutspacing)
            {
                if (rtl && layoutspacing.rtlvalue)
                {
                    node_style.padding = layoutspacing.rtlvalue;
                }
                else
                {
                    node_style.padding = layoutspacing.value;
                }

            }
            else
                node_style.padding = "";
        };

        nexacro.__getHTMLStyle_LayoutSpacing = function (node_style, layoutspacing, rtl)
        {
            if (layoutspacing)
            {
                if (rtl && layoutspacing.rtlvalue)
                {
                    return "padding:" + layoutspacing.rtlvalue + ";";
                }
                else
                {
                    return "padding:" + layoutspacing.value + ";";
                }

            }
            return "";
        };

        nexacro.__clearDOMStyle_LayoutSpacing = function (node_style)
        {
            node_style.padding = "";
        };

        // Fluid Layout Component Dom setter
        nexacro.__setDOMStyle_LayoutBasis = function (node_style, layoutbasis)
        {
            if (layoutbasis)
            {
                if (layoutbasis.type == "horizontal")
                    node_style.flexBasis = layoutbasis.width;
                else if (layoutbasis.type == "vertical")
                    node_style.flexBasis = layoutbasis.height;
            }
        };

        nexacro.__setDOMStyle_FlexGrow = function (node_style, flexgrow)
        {
            node_style.flexGrow = flexgrow;
        };

        nexacro.__setDOMStyle_FlexShrink = function (node_style, flexshrink)
        {
            node_style.flexShrink = flexshrink;
        };

        nexacro.__setDOMStyle_LayoutOrder = function (node_style, layoutorder)
        {
            node_style.order = layoutorder;
        };

        nexacro.__setDOMStyle_TableCellArea = function (node_style, tablecellarea)
        {
            node_style.gridArea = tablecellarea;
        };

        nexacro.__clearDOMStyle_TableCellArea = function (node_style)
        {
            node_style.gridArea = "";
        };

        nexacro.__clearDOMStyle_LayoutBasis = function (node_style)
        {
            node_style.flexBasis = "";
        };
        //==============================================================================
        // HTML Node Text Setting util
        // has textContents & innerText
        // for use cache Object : use closure
        (function ()
        {
            nexacro.__setDOMNode_SinglelineText = function (node, text)
            {
                var re_check = /\r|\n/;
                var re_newline = /\r\n|\n|\r/g;
                // must be setted to node : whiteSpace="pre", wordWrap="normal"
                if (re_check.test(text))
                    node.textContent = text.replace(re_newline, " ");
                else
                    node.textContent = text;
            };
            nexacro.__getHTMLAttr_SinglelineText = function (text)
            {
                var re_check = /\r|\n/;
                var re_newline = /\r\n|\n|\r/g;

                if (re_check.test(text))
                    text = text.replace(re_newline, " ");
                return text;
            };

            nexacro.__setDOMNode_MultilineText = function (node, text)
            {
                // must be setted to node : whiteSpace="pre", wordWrap="normal"
                //var re_check = /\r|\n/;
                //var re_newline = /\r\n|\n|\r/g;
                var carriagereturn = /\r/g;

                var ch = text.charAt(text.length - 1);  // html에서 마지막 문자가 개행일때 화면상에 개행처리 안해줌. 개행 하나 더 입력
                if (ch == "\n" || ch == "\r")
                    text += "\n";

                //if (re_check.test(text))
                //    text = text.replace(re_newline, "\n");
                text = text.replace(carriagereturn, "");

                node.textContent = text;
            };
            nexacro.__getHTMLAttr_MultilineText = function (text)
            {
                //var re_check = /\r|\n/;
                //var re_newline = /\r\n|\n|\r/g;
                var carriagereturn = /\r/g;

                var ch = text.charAt(text.length - 1);  // html에서 마지막 문자가 개행일때 화면상에 개행처리 안해줌. 개행 하나 더 입력
                if (ch == "\n" || ch == "\r")
                    text += "\n";

                //if (re_check.test(text))
                //    text = text.replace(re_newline, "\n");
                text = text.replace(carriagereturn, "");

                return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;");
            };

            nexacro.__setTextAreaDOMNode_Text = function (node, text)
            {
                // must be setted to node : whiteSpace="pre", wordWrap="normal"
                node.value = text;
            };
        })();

        //process new line , not exist singleline
        nexacro.__setDOMNode_Text = function (node, text/*, _wordwrap*/)
        {
            // if (_wordwrap == "none")
            //     nexacro.__setDOMNode_SinglelineText(node, text);
            // else
            nexacro.__setDOMNode_MultilineText(node, text);
        };

        nexacro.__getHTMLAttr_Text = function (text/*, _wordwrap*/)
        {
            //if (_wordwrap == "none")
            //    return nexacro.__getHTMLAttr_SinglelineText(text);
            // else
            return nexacro.__getHTMLAttr_MultilineText(text);
        };

        nexacro.__setDOMNode_DecorateText = function (node, text)
        {
            node.innerHTML = nexacro._decorateString(text);
        };
        nexacro.__getHTMLAttr_DecorateText = function (text)
        {
            return nexacro._decorateString(text);
        };

        nexacro.__setHTMLAttr_Property = function (node, property, value)
        {
            node.setAttribute(property, value);
        };

        nexacro.__getHTMLAttr_Property = function (node, property)
        {
            return node.getAttribute(property);
        };

        nexacro.__removeHTMLAttr_Property = function (node, property)
        {
            node.removeAttribute(property);
        };

        nexacro.__setHTMLElem_Property = function (node, property, value)
        {
            node[property] = value;
        };

        //-----------------------------------------------------------------------------
        // endof new DOM API for 14.1
        //-----------------------------------------------------------------------------

        //-----------------------------------------------------------------------------
        // old DOM Handling API for 14.1
        //-----------------------------------------------------------------------------
        nexacro.__setDOMStyle_Absolute = function (node_style)
        {
            node_style.position = "absolute";
            node_style.overflow = "hidden";
        };
        //nexacro.__setDOMStyle_Relative = function (node_style)
        //{
        //    node_style.position = "relative";
        //    node_style.overflow = "hidden";
        //};
        nexacro.__setDOMStyle_Fixed = function (node_style)
        {
            node_style.position = "fixed";
            node_style.overflow = "hidden";
        };

        nexacro.__setDOMStyle_AbsoluteTransparent = function (node_style)
        {
            node_style.position = "absolute";
            node_style.overflow = "hidden";

            node_style.overflowX = "hidden";
            node_style.overflowY = "hidden";

            node_style.backgroundColor = "transparent";
        };

        nexacro.__getHTMLStyle_AbsoluteTransparent = function ()
        {
            return "position:absolute;overflow:hidden:overflow-x:hidden;overflow-y:hidden;background:transparent;";
        };

        //nexacro.__setDOMStyle_TextOverFlow = function (node_style)
        //{
        //    node_style.textOverflow = "ellipsis";
        //    node_style.whiteSpace = "nowrap";
        //    node_style.overflow = "hidden";
        //};

        // for TextArea
        if (nexacro._OS == "Android" || nexacro._Browser == "Opera")
        {
            nexacro.__setTextAreaDOMStyle_AbsoluteTransparent = function (node_style)
            {
                node_style.position = "absolute";
                node_style.overflow = "hidden";
                node_style.backgroundColor = "transparent";
            };

            nexacro.__getTextAreaHTMLStyle_AbsoluteTransparent = function ()
            {
                return "position:absolute;overflow:hidden;overflow-x:hidden;overflow-y:hidden;background:transparent;";
            };
        }
        else
        {
            nexacro.__setTextAreaDOMStyle_AbsoluteTransparent = function (node_style)
            {
                node_style.position = "absolute";
                node_style.overflow = "scroll";
                node_style.backgroundColor = "transparent";
            };

            nexacro.__getTextAreaHTMLStyle_AbsoluteTransparent = function ()
            {
                return "position:absolute;overflow:scroll;overflow-x:scroll;overflow-y:scroll;background:transparent;";
            };
        }

        //iOS Mobile Web Browser
        nexacro.__setMobileIframeDOMNodeStyleScroll = function (node_style)
        {
            node_style.overflow = "auto";
            node_style.webkitOverflowScrolling = "touch";
        };

        //disable pull-down refresh for android chrome
        if (nexacro._OS == "Android" && nexacro._Browser == "Chrome" && nexacro._BrowserVersion >= 63)
        {
            nexacro.__setDOMStyle_overscrollBehavior = function (node_style)
            {
                node_style.overscrollBehavior = "contain";
            };
        }
        else
        {
            nexacro.__setDOMStyle_overscrollBehavior = nexacro._emptyFn;
        }

        //-----------------------------------------------------------------------------------
        // Control Style API Function
        //-----------------------------------------------------------------------------------
        if (nexacro._Browser == "WebKit" || nexacro._Browser == "Safari" || nexacro._Browser == "MobileSafari")
        {
            nexacro.__setInputDOMNodeStyleAlignXY = function (node_style, halign, valign, parent_height, parent_width, txt_height)
            {
                node_style.textAlign = halign;
                if (valign && parent_height && txt_height)
                {
                    switch (valign)
                    {
                        case "top":
                            node_style.top = "0px";
                            node_style.height = txt_height + "px";
                            break;
                        case "middle":
                            node_style.top = "0px";
                            node_style.height = parent_height + "px";
                            break;
                        case "bottom":
                            node_style.top = (parent_height - txt_height) + "px";
                            node_style.height = txt_height + "px";
                            break;
                    }
                }
            };
        }
        else
        {
            nexacro.__setInputDOMNodeStyleAlignXY = function (node_style, halign, valign, parent_height, parent_width, txt_height)
            {
                node_style.textAlign = halign;
                if (valign && parent_height && txt_height)
                {
                    switch (valign)
                    {
                        case "top":
                            node_style.paddingTop = "0px";
                            node_style.paddingBottom = (parent_height - txt_height) > 0 ? (parent_height - txt_height) + "px" : "0px";
                            break;
                        case "middle":
                            node_style.paddingTop = "0px";
                            node_style.paddingBottom = "0px";
                            break;
                        case "bottom":
                            node_style.paddingTop = (parent_height - txt_height) + "px";
                            node_style.paddingBottom = "0px";
                            break;
                    }
                }
            };
        }

        nexacro.__setTextAreaDOMNodeStyleAlignXY = function (node_style, halign, valign, blank_height)
        {
            node_style.textAlign = halign;

            switch (valign)
            {
                case "top":
                    node_style.paddingTop = "0px";
                    node_style.paddingBottom = "0px";
                    break;
                case "middle":
                    node_style.paddingTop = (blank_height / 2) + "px";
                    node_style.paddingBottom = "0px";
                    break;
                case "bottom":
                    node_style.paddingTop = blank_height + "px";
                    node_style.paddingBottom = "0px";
                    break;
            }
        };

        //-----------------------------------------------------------------------------

        nexacro.__setDOMStyle_LineHeight = function (node_style, lineheight)
        {
            node_style.lineHeight = (lineheight < 0) ? "" : lineheight + "px";
        };

        nexacro.__setDOMStyle_WordWrap = function (node_style, use_wordwrap)
        {
            if (use_wordwrap == "char") // 오페라는 word가 english로 동작함.
            {
                node_style.whiteSpace = "pre-wrap";
                node_style.wordWrap = "break-word";
                node_style.wordBreak = "break-all";
            }
            else if (use_wordwrap == "english")
            {
                node_style.whiteSpace = "pre-wrap";
                node_style.wordWrap = "break-word";
                node_style.wordBreak = "";
            }
            else
            {
                node_style.whiteSpace = "pre";
                node_style.wordWrap = "normal";
                node_style.wordBreak = "";
            }
        };

        nexacro.__setTextAreaDOMNode_Wrap = function (node, wordwrap)
        {
            if (wordwrap == "char" || wordwrap == "english")
                node.wrap = "hard";
            else
                node.wrap = "off";
        };

        nexacro.__setTextAreaDOMNode_WordWrap = function (node, wordwrap)
        {
            var node_style = node.style;

            if (wordwrap == "char" || wordwrap == "english")
                node.wrap = "hard";
            else
                node.wrap = "off";

            nexacro.__setDOMStyle_WordWrap(node_style, wordwrap);
        };

        nexacro.__setDOMNode_FocusBorder = function (/*node, border*/)
        {
            // TODO
        };

        nexacro.__setDOMNode_TabIndentSize = function (node, nTabSize)
        {
            //TODO : 2014.01.14
            //Implemented by zoo
            //Chrome only
            var node_style = node.style;

            node_style.tabSize = nTabSize;
        };

        nexacro.__setDOMNode_SelectBackgroundColor = function (/*node, color*/)
        {
            //TODO :
        };
        nexacro.__setDOMNode_SelectColor = function (/*node, color*/)
        {
            //TODO :
        };
        nexacro.__setDOMNode_CaretColor = function (/*node, color*/)
        {
            //TODO :
        };
        nexacro.__setDOMNode_CompositeColor = function (/*node, color*/)
        {
            //TODO :
        };

        if (nexacro._Browser_Transform === 0)
        { // not support
            nexacro.__setDOMStyle_TransformMirror = function (/*node_style, bMirror*/)
            {
            };
            nexacro.__setDOMStyle_TransformScale = function (/*node_style, scale*/)
            {
            };

            nexacro.__getHTMLStyle_TransformMirror = function (/*bMirror*/)
            {
                return "";
            };
            nexacro.__getHTMLStyle_TransformScale = function (/*scale*/)
            {
                return "";
            };
        }
        else if (nexacro._Browser_Transform == 1)
        { // HTML5
            nexacro.__setDOMStyle_TransformMirror = function (node_style, bMirror)
            {
                var value = "";
                if (bMirror)
                {
                    value = "ScaleX(-1)";
                }
                node_style.transform = value;
            };
            nexacro.__setDOMStyle_TransformScale = function (node_style, scale)
            {
                node_style.transformOrigin = "0 0";
                node_style.transform = "scale(" + scale + ", " + scale + ")";
            };

            nexacro.__getHTMLStyle_TransformMirror = function (bMirror)
            {
                if (bMirror)
                    return "transform:ScaleX(-1);";
                return "";
            };
            nexacro.__getHTMLStyle_TransformScale = function (scale)
            {
                return "transform-origin:0 0;transform:scale(" + scale + "," + scale + ");";
            };
        }
        else if (nexacro._Browser_Transform == 2)
        { // Legacy
            if (nexacro._BrowserType == "WebKit")
            {
                nexacro.__setDOMStyle_TransformMirror = function (node_style, bMirror)
                {
                    var value = "";
                    if (bMirror)
                    {
                        value = "ScaleX(-1)";
                    }
                    node_style.WebkitTransform = value;
                };
                nexacro.__setDOMStyle_TransformScale = function (node_style, scale)
                {
                    // RTL Mirror 기능과 중첩될 경우 문제가 발생할 가능성이 있으나
                    // Mirror는 BackgroundImage에 적용되고 Scale은 Form의 Container에만 적용이 된다.
                    // 동시 사용될 경우 다른 방식으로 구현해야 함.
                    node_style.WebkitTransformOriginX = 0;
                    node_style.WebkitTransformOriginY = 0;
                    node_style.WebkitTransform = "scale(" + scale + ", " + scale + ")";
                };

                nexacro.__getHTMLStyle_TransformMirror = function (bMirror)
                {
                    if (bMirror)
                        return "-webkit-transform:ScaleX(-1);";
                    return "";
                };
                nexacro.__getHTMLStyle_TransformScale = function (scale)
                {
                    return "-webkit-transform-origin:0 0;-webkit-transform:scale(" + scale + "," + scale + ");";
                };
            }
            else if (nexacro._BrowserType == "Gecko")
            {
                nexacro.__setDOMStyle_TransformMirror = function (node_style, bMirror)
                {
                    var value = "";
                    if (bMirror)
                    {
                        value = "ScaleX(-1)";
                    }
                    node_style.MozTransform = value;
                };
                nexacro.__setDOMStyle_TransformScale = function (node_style, scale)
                {
                    node_style.MozTransformOrigin = "0px 0px";
                    node_style.MozTransform = "scale(" + scale + ", " + scale + ")";
                };

                nexacro.__getHTMLStyle_TransformMirror = function (bMirror)
                {
                    if (bMirror)
                        return "-moz-transform:ScaleX(-1);";
                    return "";
                };
                nexacro.__getHTMLStyle_TransformScale = function (scale)
                {
                    return "-moz-transform-origin:0px 0px;-moz-transform:scale(" + scale + "," + scale + ");";
                };
            }
            else if (nexacro._BrowserType == "Opera")
            {
                nexacro.__setDOMStyle_TransformMirror = function (node_style, bMirror)
                {
                    var value = "";
                    if (bMirror)
                    {
                        value = "ScaleX(-1)";
                    }
                    node_style.OTransform = value;
                };
                nexacro.__setDOMStyle_TransformScale = function (node_style, scale)
                {
                    node_style.OTransformOriginX = 0;
                    node_style.OTransformOriginY = 0;
                    node_style.OTransform = "scale(" + scale + ", " + scale + ")";
                };

                nexacro.__getHTMLStyle_TransformMirror = function (bMirror)
                {
                    if (bMirror)
                        return "-o-transform:ScaleX(-1);";
                    return "";
                };
                nexacro.__getHTMLStyle_TransformScale = function (scale)
                {
                    return "-o-transform-origin-x:0;-o-transform-origin-y:0;-o-transform:scale(" + scale + "," + scale + ");";
                };
            }
        }

        //====================================================
        // Input
        //====================================================
        nexacro.__changeInputDOMNodeType = function (node, type)
        {
            if (node.type != type)
                node.setAttribute("type", type);
            return node;
        };

        nexacro.__setDOMNode_Type = function (node, type)
        {
            if (node.type != type)
            {
                node.setAttribute("type", type);
            }
        };

        // inputtype  공통화
        nexacro.__getHTMLAttr_InputType = function (inputtype)
        {
            switch (inputtype)
            {
                case "password":
                case "date":
                case "tel":
                case "search":
                case "text":
                case "email":
                case "url":
                case "number":
                    return " type = '" + inputtype + "'";
                default:  /* case: text*/
                    return " type = 'text'";
            }
        };

        // mobile component만 쓰지 않게되어 inputmode 공통화
        nexacro.__setDOMNode_InputMode = function (node, inputmode)
        {
            if (node.inputMode != inputmode)
            {
                // Chrome 119 버전에서 text 명시하면 엔터시 삭제되는 현상으로 default(text)는 명시 안하도록 수정 101433
                node.inputMode = (inputmode != "text" ? inputmode : "");
            }
        };

        nexacro.__getHTMLAttr_InputMode = function (inputmode)
        {
            if (inputmode)
            {
                // Chrome 119 버전에서 text 명시하면 엔터시 삭제되는 현상으로 default(text)는 명시 안하도록 수정 101433
                return " inputmode = '" + (inputmode != "text" ? inputmode : "") + "'";
            }
            return "";
        };

        nexacro.__setDOMNode_ImeMode = function (node, mode)
        {
            var imemodestr = null;
            if (mode == "alpha" || mode == "alpha,full")
            {
                imemodestr = "inactive";
            }
            else if (mode == "hangul" || mode == "hangul,full")
            {
                imemodestr = "active";
            }
            else if (mode == "katakana" || mode == "katakana,full")
            {
                imemodestr = "auto";
            }
            else if (mode == "hiragana")
            {
                imemodestr = "active";
            }
            else if (mode == "direct")
            {
                imemodestr = "inactive";
            }
            else if (mode == "disabled")
            {
                imemodestr = "disabled";
            }
            else
            {
                imemodestr = "";
            }
            node.style.imeMode = imemodestr;
        };

        nexacro.__setDOMNodeTextTransform = function (node, mode)
        {
            var modestr = null;
            if (mode == "upper")
            {
                modestr = "uppercase";
            }
            else if (mode == "lower")
            {
                modestr = "lowercase";
            }
            else
            {
                modestr = "";
            }
            node.style.textTransform = modestr;
        };

        nexacro.__setDOMNode_Select = function (_doc, node)
        {
            node.select();
        };

        nexacro.__setDOMNode_Autocomplete = function (node, value)
        {
            node.autocomplete = value;
        };

        nexacro.__getHTMLAttr_Autocomplete = function (value)
        {
            return " autocomplete='" + value + "'";
        };

        nexacro.__setInputDOMNode_SetSelect = function (_doc, node, start, end, byblur)
        {
            if (typeof start == 'number')
            {
                end = (typeof end == 'number') ? end : start;
                if (node.setSelectionRange)
                {
                    //The input element's type ('date', 'number', 'email') does not support selection.
                    if (node.type != "date" && node.type != "number" && node.type != "email")
                        node.setSelectionRange(start, end);
                }
                else if (node.createTextRange)
                {
                    var range = node.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', start);
                    range.select();
                }
            }
        };

        nexacro.__setTextAreaDOMNodeSetSelect = function (_doc, node, start, end)
        {
            if (typeof start == 'number')
            {
                if (node.setSelectionRange)
                {
                    node.setSelectionRange(start, end);
                }
                else if (node.createTextRange)
                {
                    var range = node.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', start);
                    range.select();
                }
            }
        };

        nexacro.__getInputDOMNodeCaretPos = function (_doc, node)
        {
            //if (_doc.activeElement != node)
            //    return -1;

            var sel = nexacro.__getInputDOMNodeSelectionRange(_doc, node);
            return { begin: sel[0], end: sel[1] };
        };

        nexacro.__getTextAreaDOMNodeCaretPos = function (_doc, node)
        {
            //if (_doc.activeElement != node)
            //    return -1;

            var sel = nexacro.__getTextAreaDOMNodeSelectionRange(_doc, node);
            return { begin: sel[0], end: sel[1] };
        };

        nexacro.__getInputDOMNodeSelectionRange = function (_doc, node)
        {
            var begin = 0, end = 0, direction = "none";
            if (node.setSelectionRange)
            {
                try
                {
                    //The input element's type ('text', 'search', 'tel', 'url', 'password') does apply selection.
                    //textarea type does apply selection by nexacro.__getTextAreaDOMNodeSelectionRange function
                    var node_type = node.type;
                    if (node_type == "text" || node_type == "search" || node_type == "tel" || node_type == "url" || node_type == "password")
                    {
                        begin = node.selectionStart;
                        end = node.selectionEnd;
                        direction = ('selectionDirection' in node ? node.selectionDirection : "none");
                    }
                }
                catch (e)
                {
                    nexacro._settracemsg(e);
                }
            }
            else if (_doc.selection && _doc.selection.createRange)
            {
                var range = _doc.selection.createRange();
                begin = 0 - range.duplicate().moveStart('character', -100000);
                end = begin + range.text.length;
            }

            return [begin, end, direction];
        };

        nexacro.__getTextAreaDOMNodeSelectionRange = function (_doc, node)
        {
            var begin = 0, end = 0, direction = "none";
            var value = node.value;
            var len = value ? value.length : 0;

            if (node.setSelectionRange)
            {
                begin = node.selectionStart;
                end = node.selectionEnd;
                direction = ('selectionDirection' in node ? node.selectionDirection : "none");

                if (begin > len) begin = len;     // enter로 줄바꿈할때 IE버그로 begin/end pos값이 잘못 취득되는 문제있음.
                if (end > len) end = len;

                //begin += value.slice(0, begin).split('\n').length - 1;
                //end += value.slice(0, end).split('\n').length - 1;
            }
            else if (_doc.selection && _doc.selection.createRange)
            {
                var range = _doc.selection.createRange();
                if (range && range.parentElement() == node)
                {
                    var n_value = value.replace(/\r\n/g, '\n');
                    len = n_value.length;

                    var txtRange = node.createTextRange();
                    txtRange.moveToBookmark(range.getBookmark());
                    var endRange = node.createTextRange();
                    endRange.collapse(false);

                    if (txtRange.compareEndPoints('StartToEnd', endRange) > -1)
                    {
                        begin = end = len;
                    }
                    else
                    {
                        begin = -txtRange.moveStart('character', -len);
                        //begin += n_value.slice(0, begin).split('\n').length - 1;
                        if (txtRange.compareEndPoints('EndToEnd', endRange) > -1)
                        {
                            end = len;
                        }
                        else
                        {
                            end = -txtRange.moveEnd('character', -len);
                            //end += n_value.slice(0, end).split('\n').length - 1;
                        }
                    }
                }
            }

            return [begin, end, direction];
        };

        // recognize '\t' charater
        nexacro.__getTextAreaDOMNodeCaretLine = function (_doc, node, wordwrap, font)
        {
            if (!font)
            {
                var _win = _doc.defaultView || _doc.parentWindow;
                var font_val = _win.getComputedStyle(node).getPropertyValue("font");
                font = nexacro.FontObject(font_val);
            }

            var start = 0;
            var text, textarr, len;
            var line;
            var cache_manager, cache_value;
            var text_size, content_width, font_height;
            if (typeof node.selectionStart == "number" && typeof node.selectionEnd == "number")
            {
                if (node.selectionDirection == "backward")
                    start = node.selectionEnd;
                else // forward | none
                    start = node.selectionStart;

                text = node.value.slice(0, start);
                textarr = text.split("\n");
                if (textarr == null)
                    return 1;

                len = textarr.length;
                if (wordwrap != "none" && len > 0 && font != null)
                {
                    cache_value = font._sysvalue + " " + wordwrap + " " + undefined + " " + undefined + " " + false;
                    cache_manager = nexacro._getTextSizeCacheManager(font, wordwrap, null, null, false, "", cache_value);

                    line = 0;
                    font_height = cache_manager.font_height;
                    content_width = parseInt(node.clientWidth);
                    for (var i = 0; i < len; i++)
                    {
                        text_size = nexacro._getTextAreaWordwrapTextSize(cache_manager, textarr[i], content_width);
                        line += Math.round(text_size[1] / font_height);
                    }

                    return line;
                }
                else
                {
                    return len;
                }
            }
            else
            {
                node.setActive();

                var range = _doc.selection.createRange();
                if (range && range.parentElement() == node)
                {
                    len = node.value.length;

                    var textInputRange = node.createTextRange();
                    textInputRange.moveToBookmark(range.getBookmark());

                    var endRange = node.createTextRange();
                    endRange.collapse(false);

                    if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1)
                    {
                        text = node.value;
                    }
                    else
                    {
                        start = -textInputRange.moveStart("character", -len);
                        text = node.value.slice(0, start);
                    }

                    textarr = text.replace(/\r\n/g, "\n").split("\n");
                    if (textarr == null)
                        return 1;

                    len = textarr.length;
                    if (wordwrap != "none" && len > 0 && font != null)
                    {
                        content_width = parseInt(node.clientWidth);

                        cache_value = font._sysvalue + " " + wordwrap + " " + undefined + " " + undefined + " " + false;
                        cache_manager = nexacro._getTextSizeCacheManager(font, wordwrap, null, null, false, "", cache_value);

                        line = 0;
                        font_height = cache_manager.font_height;
                        for (var j = 0; j < len; j++)
                        {
                            text_size = nexacro._getTextAreaWordwrapTextSize(cache_manager, textarr[j], content_width);
                            line += Math.round(text_size[1] / font_height);
                        }
                        return line;
                    }
                    else
                    {
                        return len;
                    }
                }
            }
            return 0;
        };

        // recognize '\t' charater
        nexacro.__getTextAreaDOMNodeTextLineCount = function (_doc, node, text, wordwrap, font)
        {
            if (!font)
            {
                var _win = _doc.defaultView || _doc.parentWindow;
                var font_val = _win.getComputedStyle(node).getPropertyValue("font");
                font = nexacro.FontObject(font_val);
            }

            if (text == "")     // first line
                return 1;

            if (wordwrap != "none" && font != null)
            {
                var cache_value = font._sysvalue + " " + wordwrap + " " + undefined + " " + undefined + " " + false;
                var cache_manager = nexacro._getTextSizeCacheManager(font, wordwrap, null, null, false, "", cache_value);

                var font_height = cache_manager.font_height;
                var content_width = parseInt(node.clientWidth);
                var text_size = nexacro._getTextAreaWordwrapTextSize(cache_manager, text, content_width);
                return Math.round(text_size[1] / font_height);
            }
            else
            {
                var textarr = text.replace(/\r\n/g, "\n").split("\n");
                return textarr.length;
            }
        };

        nexacro.__getDOMNodeValue = function (node)
        {
            if (node)
                return node.value;
        };

        //=============================================================================
        nexacro.__getHTMLStyleAbsolute = function ()
        {
            return "position:absolute;overflow:hidden;";
        };
        nexacro.__getHTMLStyleRelative = function ()
        {
            return "position:relative;overflow:hidden;";
        };
        nexacro.__getHTMLStyleAbsoluteTransparent = function ()
        {
            return "position:absolute;overflow:hidden;background-color:transparent;";
        };

        //For iOS
        nexacro.__getHTMLStyleMobileIframeDOMNodeStyleScroll = function ()
        {
            return " overflow : auto; webkitOverflowScrolling :touch;";
        };

        // for TextArea

        nexacro.__getTextAreaHTMLStyleAbsoluteTransparent = function ()
        {
            return "position:relative;overflow:scroll;background-color:transparent;";
        };

        //iOS Mobile Web Browser
        nexacro.__getMobileIframeHTMLStyleScroll = function ()
        {
            return "overflow:auto;-webkit-overflow-scrolling:touch;";
        };

        nexacro.__getHTMLStylePosLeftTop = function (left, top)
        {
            return "position:absolute;overflow:hidden;left:" + (left | 0) + "px;top:" + (top | 0) + "px;";
        };
        nexacro.__getHTMLStylePosRightTop = function (right, top)
        {
            return "position:absolute;overflow:hidden;right:" + (right | 0) + "px;top:" + (top | 0) + "px;";
        };
        nexacro.__getHTMLStylePosLeftBottom = function (left, bottom)
        {
            return "position:absolute;overflow:hidden;left:" + (left | 0) + "px;bottom:" + (bottom | 0) + "px;";
        };
        nexacro.__getHTMLStylePosRightBottom = function (right, bottom)
        {
            return "position:absolute;overflow:hidden;right:" + (right | 0) + "px;bottom:" + (bottom | 0) + "px;";
        };

        nexacro.__getHTMLStylePosSize = function (left, top, width, height)
        {
            return "position:absolute;overflow:hidden;" +
                "left:" + (left | 0) + "px;" + "top:" + (top | 0) + "px;" +
                "width:" + (width | 0) + "px;" + "height:" + (height | 0) + "px;";
        };
        nexacro.__getHTMLStylePosUnitSize = function (left, top, width, height)
        {
            return "position:absolute;overflow:hidden;" +
                "left:" + (left | 0) + "px;" + "top:" + (top | 0) + "px;" +
                "width:" + width + ";" + "height:" + height + ";";
        };

        nexacro.__getHTMLStylePos = function (left, top)
        {
            return "left:" + (left | 0) + "px;" + "top:" + (top | 0) + "px;";
        };
        nexacro.__getHTMLStyleSize = function (width, height)
        {
            if (width >= 0 && height >= 0)
            {
                return "width:" + (width | 0) + "px;" + "height:" + (height | 0) + "px;";
            }
            return "";
        };
        nexacro.__getHTMLStyleUnitSize = function (width, height)
        {
            return "width:" + (width | 0) + ";" + "height:" + (height | 0) + ";";
        };

        //-----------------------------------------------------------------------------
        nexacro.__getHTMLAttrSize = function (width, height)
        {
            if (width >= 0 && height >= 0)
            {
                return " width='" + width + "px' height='" + height + "px'";
            }
            return "";
        };
        nexacro.__getHTMLCanvasAttrSize = function (width, height)
        {
            if (width >= 0 && height >= 0)
            {
                return " width='" + width + "' height='" + height + "'";
            }
            return "";
        };

        (function ()
        {
            var re_check = /\r|\n/;
            var re_newline = /\r\n|\n|\r/g;
            nexacro.__getSinglelineText = function (text)
            {
                if (re_check.test(text))
                {
                    return text.replace(re_newline, " ");
                }
                else
                {
                    return text;
                }
            };
        })();

        if (nexacro._BrowserType == "WebKit")
        {
            nexacro.__getInputHTMLStyleAlignXY = function (halign, valign, container_height, txt_height)
            {
                var halign_str = "text-align:" + halign + ";";
                if (valign == "top")
                {
                    return halign_str + "top:0px;height:" + txt_height + "px;";
                }
                else if (valign == "middle")
                {
                    return halign_str + "top:0px;height:" + container_height + "px;";
                }
                else if (valign == "bottom")
                {
                    return halign_str + "top:" + (container_height - txt_height) + "px;height:" + txt_height + "px;";
                }
                return halign_str;
            };
        }
        else
        {
            nexacro.__getInputHTMLStyleAlignXY = function (halign, valign, container_height, txt_height)
            {
                var halign_str = "text-align:" + halign + ";";
                if (valign == "top")
                {
                    return halign_str + "padding-top:0px;padding-bottom:" + (container_height - txt_height) + "px;";
                }
                else if (valign == "middle")
                {
                    return halign_str + "padding-top:0px;padding-bottom:0px;";
                }
                else if (valign == "bottom")
                {
                    return halign_str + "padding-top:" + (container_height - txt_height) + "px;padding-bottom:0px;";
                }
                return halign_str;
            };
        }

        nexacro.__getTextAreaHTMLStyleAlignXY = function (halign, valign, blank_height)
        {
            blank_height = blank_height >= 0 ? blank_height : 0;
            if (valign == "top")
            {
                return "text-align:" + halign + ";padding-top:0px;padding-bottom:0px;";
            }
            else if (valign == "middle")
            {
                return "text-align:" + halign + ";padding-top:" + (blank_height / 2) + "px;padding-bottom:0px;";
            }
            else if (valign == "bottom")
            {
                return "text-align:" + halign + ";padding-top:" + blank_height + "px;padding-bottom:0px;";
            }
            return "text-align:" + halign + ";";
        };

        nexacro.__getHTMLStyleVAlignMargin = function (valign, container_height, txt_height)
        {
            var offset = 0;
            if (valign == "middle")
            {
                offset = (container_height - txt_height) / 2;
            }
            else if (valign == "bottom")
            {
                offset = (container_height - txt_height);
            }
            return "margin-top:" + offset + "px;";
        };

        nexacro.__getHTMLStyleCursor = function (cursor, deftype)
        {
            var cur_type = (cursor && !cursor._is_empty) ? cursor._value : (deftype ? deftype : "arrow");
            if (cur_type == "no")
            {
                cur_type = "not-allowed"; // it was not work in opera
            }
            else if (cur_type == "hand")
            {
                cur_type = "pointer";
            }
            else if (cur_type == "text")
            {
                cur_type = "text";
            }
            else if (cur_type == "arrow")
            {
                cur_type = "default";
            }
            else if (cur_type == "arrowwait")
            {
                cur_type = "progress";
            }
            return "cursor:" + cur_type + ";";
        };

        nexacro.__setDOMStyle_LineHeight = function (lineheight)
        {
            return (lineheight < 0) ? "" : "line-height:" + lineheight + "px;";
        };

        nexacro.__getHTMLAttrFocusBorder = function (/*shadow*/)
        {
            // TODO
            return "";
        };

        nexacro.__getHTMLAttr_TabIndentSize = function (/*size*/)
        {
            // TODO
            return "";
        };

        nexacro.__getHTMLAttr_MaxLength = function (maxlength)
        {
            return " maxLength='" + ((maxlength > 0) ? maxlength : 65535) + "'";
        };

        nexacro.__getDOMAccessibilityStr_Labelfor = function (name, value)
        {
            return "";
        };

        nexacro.__getDOMNode_Alt = function (text)
        {
            return " alt ='" + (text ? text : "") + "'";
        };


        //====================================================
        // Input
        //====================================================
        //nexacro.__getHTMLStyleDecorateText = function (text)
        //{
        //    "text-decoration:" + nexacro._encodeXML(nexacro._decorateString(text)) + ";";
        //};

        nexacro.__getHTMLStyle_ImeMode = function (mode)
        {
            var imemodestr = null;
            if (mode == "alpha" || mode == "alpha,full")
            {
                imemodestr = "inactive";
            }
            else if (mode == "hangul" || mode == "hangul,full")
            {
                imemodestr = "active";
            }
            else if (mode == "katakana" || mode == "katakana,full")
            {
                imemodestr = "auto";
            }
            else if (mode == "hiragana")
            {
                imemodestr = "active";
            }
            else if (mode == "direct")
            {
                imemodestr = "inactive";
            }
            else if (mode == "disabled")
            {
                imemodestr = "disabled";
            }
            else
            {
                return "";
            }
            return "ime-mode:" + imemodestr + ";";
        };

        nexacro.__getHTMLAttrSelectBackgroundColor = function (/*color*/)
        {
            // TODO
            return "";
        };
        nexacro.__getHTMLAttrSelectColor = function (/*color*/)
        {
            // TODO
            return "";
        };
        nexacro.__getHTMLAttrCaretColor = function (/*color*/)
        {
            // TODO
            return "";
        };
        nexacro.__getHTMLAttrCompositeColor = function (/*color*/)
        {
            // TODO
            return "";
        };

        nexacro.__getHTMLStyle_TextTransfrom = function (mode)
        {
            var modestr = null;
            if (mode == "upper")
            {
                modestr = "uppercase";
            }
            else if (mode == "lower")
            {
                modestr = "lowercase";
            }
            else
            {
                return "";
            }
            return "text-transform:" + modestr + ";";
        };

        nexacro.__getHTMLStyle_TouchAction = function (value)
        {
            if (value)
                return "touch-action:" + value + ";";
            return "";
        };

        nexacro.__setDOMStyle_TouchAction = function (node_style, value)
        {
            node_style.touchAction = value;
        };

        //=============================================================================
        // focus
        nexacro.__isActiveWindow = function (_doc)
        {
            if (_doc.hasFocus)
                return _doc.hasFocus();
        };

        // 최초 실행시 Window의 active여부를 알수 없기때문에 내부 플래그 세팅을 위해 호출
        // Window의 Active여부를 리턴한다. 내부 flag변수도 세팅한다.
        nexacro._checkWindowActive = function (_window)
        {
            var is_active;
            var _doc = _window._doc;
            if (_doc)
            {
                if (_doc.hasFocus)
                {
                    is_active = _doc.hasFocus();
                    _window._is_active_window = is_active;
                }

                // hasFocus 미지원 브라우저 -> 최초에는 어쩔수가 없음.
                if (is_active === undefined)
                    is_active = _window._is_active_window;
            }

            return is_active;
        };

        nexacro.__setDOMNode_Focus = function (node, selffocus)
        {
            var is_active_window;
            // hasFocus로 체크하는 것이 정확하나 Google Chrome이 alert직후 hasFocus가 false로 나오는 문제로
            // alert직후 setFocus를 호출하면 무시된다. 때문에 비 IE계열은 hasFocus체크를 하지 않음 2013.08.26 neoarc

            var owner_doc = (node.ownerDocument || node.document);

            // active window flag 통일 (nexacro.Window)
            var _window = nexacro._findDocumentWindow(owner_doc, node);
            if (_window)
            {
                let isfocus = false;
                if (nexacro.ismodule)
                {
                    isfocus = (_window.handle == document.activeElement || _window.handle.contains(document.activeElement))
                }
                else
                {
                    if (owner_doc.hasFocus)
                        isfocus = owner_doc.hasFocus();
                }

                //if (owner_doc.hasFocus)
                //    is_active_window = _window._is_active_window || owner_doc.hasFocus();
                //else
                is_active_window = _window._is_active_window || isfocus;
            }

            if (is_active_window)
            {
                if (selffocus)
                {
                    // focus 시 scroll이 튀는 현상 제거
                    node.focus({ preventScroll: true });
                }
                else
                {
                    if (!nexacro.ismodule || !_window)
                    {
                        var owner_body = owner_doc.body;
                        if (owner_body)
                            owner_body.focus();
                    }
                    else
                    {

                        _window.root._control_element.handle.focus();
                        //_window.handle.focus();
                    }

                }
            }
        };

        nexacro.__setInputDOMNodeFocus = function (node, trigger_type)
        {
            var is_active_window;
            // hasFocus로 체크하는 것이 정확하나 Google Chrome이 alert직후 hasFocus가 false로 나오는 문제로
            // alert직후 setFocus를 호출하면 무시된다. 때문에 비 IE계열은 hasFocus체크를 하지 않음 2013.08.26 neoarc

            var owner_doc = (node.ownerDocument || node.document);

            // active window flag 통일 (nexacro.Window)
            var _window = nexacro._findDocumentWindow(owner_doc, node);
            if (_window)
            {
                let isfocus = false;
                if (nexacro.ismodule)
                {
                    isfocus = (_window.handle == document.activeElement || _window.handle.contains(document.activeElement))
                }
                else
                {
                    if (owner_doc.hasFocus)
                        isfocus = owner_doc.hasFocus();
                }

                /*if (owner_doc.hasFocus)
                    is_active_window = _window._is_active_window || owner_doc.hasFocus();
                else*/
                is_active_window = _window._is_active_window || isfocus;
            }

            // TODO : FF
            var bFocus = true;
            var evt = window.event;
            var elem = node._linked_element;
            if (evt)
            {
                var evt_node = evt.target;
                // 직접적으로 focus를 주는 action은 node.focus() 하면 안됨.
                if (node == evt_node)
                {
                    if ((nexacro._Browser == "Chrome" || nexacro._Browser == "Edge") && nexacro._isDesktop() && node != document.activeElement && trigger_type == "focus")
                    {
                        //;
                    }
                    else if (nexacro._Browser == "Gecko" && nexacro._isDesktop() && evt_node._linked_element.parent_elem.linkedcontrol._status == "mouseover" &&
                        (trigger_type == "tabkey" || trigger_type == "shifttabkey" || trigger_type == "lbuttondown" || trigger_type == "lbutton"))
                    {
                        // FF에서 mouseover 상태에서 tabkey/shifttabkey로 focus 들어오는 상황 캐럿이 이동 되지 않음
                        // evt_node가 이동되는 focus쪽에서 발생된상황 (얘만 이상하네)
                    }
                    else
                        bFocus = false;
                }
                else if (!elem._is_sys_focused && node !== evt_node)
                {
                    var evt_elem = evt_node._linked_element;
                    if (evt_elem && trigger_type == "focus")
                        evt.preventDefault();
                    else if (evt_elem && trigger_type == "touch" && elem.autoselect)
                        evt.preventDefault();

                }
            }

            if (is_active_window && bFocus)
            {
                if (trigger_type == "touch")
                    node.focus();
                else
                    node.focus({ preventScroll: true });
            }
        };

        if (nexacro._OS == "iOS")
        {
            nexacro.__setDOMNode_Blur = nexacro._emptyFn;
        }
        else
        {
            nexacro.__setDOMNode_Blur = function (node)
            {
                node.blur();
            };
        }

        if (nexacro._OS == "Android")
        {
            nexacro.__setDOMNode_ScrollintoView = function (node, alignWithTop)
            {
                node.scrollIntoView(alignWithTop ? alignWithTop : false);
            };
        }
        else
        {
            nexacro.__setDOMNode_ScrollintoView = nexacro._emptyFn;
        }


        nexacro._removeInputDOMNodeCaret = function (node)
        {
            if (node)
            {
                var owner_doc = (node.ownerDocument || node.document);
                var owner_win = owner_doc.defaultView || owner_doc.parentWindow;

                var pos = nexacro.__getInputDOMNodeCaretPos(owner_doc, node);
                if (pos)
                {
                    var begin = pos.begin;
                    var end = pos.end;

                    if (begin == end)
                    {
                        var selection;
                        if ('selection' in document)
                        {
                            selection = document.selection;
                            var range = selection.createRange();
                            if (node == range.parentElement())
                            {
                                selection.empty();
                            }
                        }
                        else if (owner_win.getSelection)
                        {
                            selection = owner_win.getSelection();
                            selection.removeAllRanges();
                        }
                    }
                }
            }
        };

        //nre hybrid 전용;
        if (globalThis.chrome && globalThis.chrome.webview)
        {
            nexacro.__setDOMNode_WebkitAppRegion = function (node, value)
            {
                if (node && node.style)
                    node.style.WebkitAppRegion = value;
            };
        }
        else
        {
            nexacro.__setDOMNode_WebkitAppRegion = nexacro._emptyFn;
        }
        //==============================================================================
        // canvas
        //==============================================================================

        nexacro._degreesToRadians = function (degrees)
        {
            return degrees * (Math.PI / 180);
        };

        nexacro._radiansToDegrees = function (radians)
        {
            return radians * (180 / Math.PI);
        };

        nexacro.__setCanvasFillColor = function (canvas, color)
        {
            //canvas._draw_ctx.fillStyle = nexacro._getWebColorFromXreColor(color.value);
            canvas._draw_ctx.fillStyle = color.value;
        };

        nexacro.__setCanvasFillPattern = function (canvas, fillstyle)
        {
            canvas._draw_ctx.fillStyle = fillstyle.value;
        };
        nexacro.__setCanvasFillGradation = function (canvas, fillstyle)
        {
            canvas._draw_ctx.fillStyle = fillstyle;
        };

        nexacro.__setCanvasFillStyle = function (canvas, clrrgb/*, clra*/)
        {
            canvas._draw_ctx.fillStyle = clrrgb;
        };
        nexacro.__setCanvasStrokeStyle = function (canvas, color)
        {
            canvas._draw_ctx.strokeStyle = color._sysvalue;
        };
        nexacro.__setCanvasLineCap = function (canvas, eCapType)
        {
            canvas._draw_ctx.lineCap = eCapType;
        };
        nexacro.__setCanvasLineJoin = function (canvas, eJoinType)
        {
            canvas._draw_ctx.lineJoin = eJoinType;
        };
        nexacro.__setCanvasLineWidth = function (canvas, nSize)
        {
            canvas._draw_ctx.lineWidth = nSize;
        };
        nexacro.__setCanvasLineStyle = function (canvas, lineType)
        {
            var linewidth = canvas._draw_ctx.lineWidth;
            var dashArray;
            //var dashOffset;

            if (linewidth == null) return;
            switch (lineType)
            {
                case "dotted":
                    dashArray = [1 * linewidth, 1 * linewidth];
                    //dashOffset = 1*linewidth;
                    break;
                case "dashed":
                    dashArray = [2 * linewidth, 2 * linewidth];
                    //dashOffset = 2*linewidth;
                    break;
                case "solid":
                default:
                    dashArray = null;
                    //dashOffset = null;
                    break;


            }
            if (dashArray && dashArray.length)
            {
                if ('setLineDash' in canvas._draw_ctx)
                {
                    canvas._draw_ctx.setLineDash(dashArray);
                    //canvas._draw_ctx.lineDashOffset = dashOffset;
                }
                else if ('mozDash' in canvas._draw_ctx)
                {
                    canvas._draw_ctx.mozDash = dashArray;
                    //canvas._draw_ctx.mozDashOffset = dashOffset;
                }
            }
        };
        nexacro.__setCanvasMiterLimit = function (canvas, nLimit)
        {
            canvas._draw_ctx.miterLimit = nLimit;
        };
        nexacro.__setCanvasShadowColor = function (canvas/*, clrRGA, clrA*/)
        {
            canvas._draw_ctx.shadowColor = canvas._shadowColor;
        };
        nexacro.__setCanvasShadowOffsetX = function (canvas, sX)
        {
            canvas._draw_ctx.shadowOffsetX = sX;
        };
        nexacro.__setCanvasShadowOffsetY = function (canvas, sY)
        {
            canvas._draw_ctx.shadowOffsetY = sY;
        };
        nexacro.__setCanvasShadowBlur = function (canvas, nFact)
        {
            canvas._draw_ctx.shadowBlur = nFact;
        };
        nexacro.__setCanvasFont = function (canvas, font, sysvalue)
        {
            canvas._draw_ctx.font = sysvalue;
        };
        nexacro.__setCanvasTextAlign = function (canvas, eAlignValue)
        {
            canvas._draw_ctx.textAlign = eAlignValue;
        };
        nexacro.__setCanvasTextBaseline = function (canvas, eBaseValue)
        {
            canvas._draw_ctx.textBaseline = eBaseValue;
        };

        nexacro.__drawCanvasBeginPath = function (canvas)
        {
            canvas._draw_ctx.beginPath();
        };
        nexacro.__drawCanvasClosePath = function (canvas)
        {
            canvas._draw_ctx.closePath();
        };
        nexacro.__drawCanvasFillRect = function (canvas, x, y, dx, dy)
        {
            var ctx = canvas._draw_ctx;
            ctx.rect(x, y, dx, dy);
            ctx.fill();
            ctx.beginPath();
        };
        nexacro.__drawCanvasStrokeRect = function (canvas, x, y, dx, dy)
        {
            canvas._draw_ctx.strokeRect(x, y, dx, dy);
        };
        nexacro.__drawCanvasRect = function (canvas, x, y, dx, dy)
        {
            var ctx = canvas._draw_ctx;
            ctx.rect(x, y, dx, dy);
            ctx.stroke();
            ctx.beginPath();
        };
        nexacro.__drawCanvasClearRect = function (canvas, x, y, dx, dy)
        {
            canvas._draw_ctx.clearRect(x, y, dx, dy);
        };

        nexacro.__drawCanvaslineTo = function (canvas, x, y)
        {
            canvas._draw_ctx.lineTo(x, y);
        };
        nexacro.__drawCanvasmoveTo = function (canvas, x, y)
        {
            canvas._draw_ctx.moveTo(x, y);
        };
        nexacro.__drawCanvasQuadraticCurveTo = function (canvas, cp1x, cp1y, cp2x, cp2y)
        {
            canvas._draw_ctx.quadraticCurveTo(cp1x, cp1y, cp2x, cp2y);
        };
        nexacro.__drawCanvasBezierCurveTo = function (canvas, cp1x, cp1y, cp2x, cp2y, x, y)
        {
            canvas._draw_ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        };
        nexacro.__darwCanvasArc = function (canvas, x, y, r, sA, eA, eCw)
        {
            canvas._draw_ctx.arc(x, y, r, sA, eA, eCw);
        };
        nexacro.__drawCanvasArcTo = function (canvas, x, y, x2, y2, r)
        {
            canvas._draw_ctx.arcTo(x, y, x2, y2, r);
        };

        nexacro.__isPointInCanvasPath = function (canvas, x, y)
        {
            return canvas._draw_ctx.isPointInPath(x, y);
        };
        nexacro.__clipCanvas = function (canvas)
        {
            canvas._draw_ctx.clip();
        };
        nexacro.__setCanvasTransform = function (canvas, a, b, c, d, e, f)
        {
            canvas._draw_ctx.setTransform(a, b, c, d, e, f);
        };
        nexacro.__measureCanvas = function (canvas, text)
        {
            canvas._draw_ctx.measureText(text);
        };
        nexacro.__createCanvasPattern = function (canvas, imagesource, repeat_opt)
        {
            return canvas._draw_ctx.createPattern(imagesource, repeat_opt);
        };
        nexacro.__createCanvasLinearGradient = function (canvas, aX0, aY0, aX1, aY1)
        {
            return canvas._draw_ctx.createLinearGradient(aX0, aY0, aX1, aY1);
        };
        nexacro.__createCanvasRadialGradient = function (canvas, x0, y0, x1, y1, r0, r1)
        {
            return canvas._draw_ctx.createRadialGradient(x0, y0, x1, y1, r0, r1);
        };
        nexacro.__rectCanvas = function (canvas, x, y, w, h)
        {
            canvas._draw_ctx.rect(x, y, w, h);
        };
        nexacro.__fillCanvas = function (canvas)
        {
            canvas._draw_ctx.fill();
        };
        nexacro.__strokeCanvas = function (canvas)
        {
            canvas._draw_ctx.stroke();
        };
        nexacro.__fillCanvasRect = function (canvas, x, y, dx, dy)
        {
            canvas._draw_ctx.fillRect(x, y, dx, dy);
        };
        nexacro.__scaleCanvas = function (canvas, dx, dy)
        {
            canvas._draw_ctx.scale(dx, dy);
        };
        nexacro.__rotateCanvas = function (canvas, angle)
        {
            canvas._draw_ctx.rotate(angle);
        };
        nexacro.__translateCanvas = function (canvas, dX, dY)
        {
            canvas._draw_ctx.translate(dX, dY);
        };
        nexacro.__transformCanvas = function (canvas, a, b, c, d, e, f)
        {
            canvas._draw_ctx.transform(a, b, c, d, e, f);
        };
        nexacro.__drawCanvasFillText = function (canvas, text, x, y, maxWidth)
        {
            if (maxWidth)
                canvas._draw_ctx.fillText(text, x, y, maxWidth);
            else
                canvas._draw_ctx.fillText(text, x, y);
        };
        nexacro.__drawCanvasStrokeText = function (canvas, text, x, y, maxWidth)
        {
            if (maxWidth)
                canvas._draw_ctx.strokeText(text, x, y, maxWidth);
            else
                canvas._draw_ctx.strokeText(text, x, y);
        };

        nexacro.__drawCanvasImage = function (canvas, image, x, y, imgWidth, imgHeight)
        {
            canvas._draw_ctx.drawImage(image, x, y, imgWidth, imgHeight);
        };
        nexacro.__setCanvasGlobalAlpha = function (canvas, f)
        {
            canvas._draw_ctx.globalAlpha = f;
        };
        nexacro.__setCanvasGlobalCompositeOperation = function (canvas, eOperation)
        {
            canvas._draw_ctx.globalCompositeOperation = eOperation;
        };
        nexacro.__toDataURLCanvas = function (canvas, imgType, ImgOption)
        {
            var url;
            var ln = arguments.length;
            switch (ln)
            {
                case 1:
                    url = canvas._draw_node.toDataURL();
                    break;
                case 2:
                    url = canvas._draw_node.toDataURL(imgType);
                    break;
                case 3:
                    url = canvas._draw_node.toDataURL(imgType, ImgOption);
                    break;
            }
            if (url)
            {
                var imgObj = new nexacro.Image();
                imgObj.set_src(url);
                return imgObj;
            }
        };
        nexacro.__restoreCanvas = function (canvas)
        {
            canvas._draw_ctx.restore();
        };
        nexacro.__saveCanvas = function (canvas)
        {
            canvas._draw_ctx.save();
        };

        //==============================================================================
        // Util Functions
        //==============================================================================
        // for use object cache : use closure
        (function ()
        {
            // for multiple replace -- single replacement with map function is fast
            var re_special_htmlchar = /&|"|'|\<|\>|\r|\n/g;
            function _replace_htmlChar(chr)
            {
                if (chr == "&") return "&amp;";
                else if (chr == "'") return "&#39;";
                else if (chr == '"') return "&quot;";
                else if (chr == "<") return "&lt;";
                else if (chr == ">") return "&gt;";
                else if (chr == "\r") return "";
                else if (chr == "\n") return "<br/>";
                else return chr;
            }
            nexacro.__toInnerHTMLText = function (text)
            {
                return text.replace(re_special_htmlchar, _replace_htmlChar);
            };
        })();

        (function ()
        {
            var re_special_xmlchar = /[&"'\<\>\r\n\t ]/g;
            function _encode_xmlChar(chr)
            {
                if (chr == "&") return "&amp;";
                else if (chr == "'") return "&#39;";
                else if (chr == '"') return "&quot;";
                else if (chr == "<") return "&lt;";
                else if (chr == ">") return "&gt;";
                else if (chr == "\r") return "&#13;";
                else if (chr == "\n") return "&#10;";
                else if (chr == "\t") return "&#9;";
                else if (chr == " ") return "&#32;";
                else return chr;
            }
            nexacro._encodeXml = function (str)
            {
                if (!nexacro._isNull(str))  //passing an empty-string
                {
                    return str.replace(re_special_xmlchar, _encode_xmlChar);
                }
            };

            var re_encoded_xmlchar = /&#[0-9]+;|&[a-z]+;/g;
            function _decode_xmlStr(str)
            {
                if (str.charAt(1) == "#")
                {
                    return String.fromCharCode(str.substring(2, str.length - 1) | 0);
                }
                else
                {
                    var code = str.substring(1, str.length - 1);
                    if (code == "amp") return "&";
                    else if (code == "quot") return "\"";
                    else if (code == "apos") return "\'";
                    else if (code == "lt") return "<";
                    else if (code == "gt") return ">";
                    else return "";
                }
            }
            nexacro._decodeXml = function (str)
            {
                if (!nexacro._isNull(str))
                {
                    if (str.indexOf("&") >= 0)
                        return str.replace(re_encoded_xmlchar, _decode_xmlStr);
                    return str;
                }
            };
        })();

        nexacro._getDisplayText = function (text/*, _type*/)
        {
            return text;
        };

        nexacro._getHTMLOuter = function (node, doc)
        {
            if (!node || !node.tagName) return '';
            var txt = node.outerHTML;
            if (!txt)
            {
                var el = doc.createElement("div");

                el.appendChild(node);
                txt = el.innerHTML;
                //                el = null;
            }

            return txt;
        };

        nexacro._getCloneNode = function (node)
        {
            return node.cloneNode(true);
        };

        nexacro._makeFakePrintNode = function (comps)
        {
            var remove_targets = [];
            for (var i = 0, len = comps.length; i < len; i++)
            {
                var comp = comps[i];
                var doc = comp.document;
                if (doc)
                {
                    var canvases = doc.getElementsByTagName("canvas");
                    if (canvases && canvases.length)
                    {
                        var cv = doc.createElement("canvas");
                        var context = cv.getContext("2d");

                        var w, h, j, cv_len;
                        w = h = 0;

                        for (j = 0, cv_len = canvases.length; j < cv_len; j++)
                        {
                            if (w < canvases[j].clientWidth)
                                w = canvases[j].clientWidth;

                            if (h < canvases[j].clientHeight)
                                h = canvases[j].clientHeight;
                        }
                        cv.width = w;
                        cv.height = h;

                        for (j = 0, cv_len = canvases.length; j < cv_len; j++)
                        {
                            try
                            {
                                context.drawImage(canvases[j], parseInt(canvases[j].style.left), parseInt(canvases[j].style.top), canvases[j].clientWidth, canvases[j].clientHeight);
                            }
                            catch (e)
                            {
                                //;
                                nexacro._settracemsg(e);
                            }
                        }

                        var fake_chart_node = document.createElement("img");
                        fake_chart_node.src = cv.toDataURL("image/png");

                        var client_elem = comps[i]._control_element._client_elem;
                        if (client_elem)
                        {
                            var style = client_elem.handle.style;
                            fake_chart_node.style.position = style.position;
                            fake_chart_node.style.left = style.left;
                            fake_chart_node.style.top = style.top;
                            fake_chart_node.style.width = style.width;
                            fake_chart_node.style.height = style.height;
                        }

                        comp._control_element.handle.appendChild(fake_chart_node);
                        remove_targets.push(fake_chart_node);
                    }
                }
            }
            return remove_targets;
        };

        nexacro._searchFakePrintNode = function (comp, make_targets)
        {
            if (comp._is_form)
            {
                var comps = comp._p_components;
                for (var i = 0, len = comps.length; i < len; i++)
                {
                    if (comps[i]._type_name == "WebBrowser" || comps[i]._type_name == "WebView")
                    {
                        make_targets.push(comps[i]);
                    }
                    else if (comps[i]._is_form) //recursive
                    {
                        make_targets = nexacro._searchFakePrintNode(comps[i], make_targets);
                    }
                }
            }

            return make_targets;
        };

        nexacro._getScreenPrintString = function (comp)
        {
            return nexacro._beforePrintCheckPlugin(comp, undefined, undefined, undefined, undefined, true);
        };

        nexacro._beforePrintCheckPlugin = function (comp, refform, defaultprint, valign, halign, _is_get_string)
        {
            var make_targets = [];
            var remove_targets = [];

            // DIv, TabPage, PopupDiv
            if (comp._is_container)
            {
                if (comp._is_popup_control)
                {
                    // PopupDiv
                    if (comp.visible && comp.form)
                    {
                        comp = comp.form;
                    }
                }
                else
                {
                    if (comp.form)
                    {
                        comp = comp.form;
                    }
                }
            }

            if (comp._is_form)
            {
                if (!_is_get_string)
                {
                    var has_WebBroeser = nexacro._hasWebBrowser(comp);
                    if (has_WebBroeser)
                    {
                        var _win_handle = comp._getWindowHandle();
                        if (_win_handle)
                        {
                            _win_handle.print();
                            return true;
                        }
                        return false;
                    }
                }

                make_targets = nexacro._searchFakePrintNode(comp, make_targets);
                remove_targets = nexacro._makeFakePrintNode(make_targets);
            }
            else if (!_is_get_string && (comp._type_name == "WebBrowser" || comp._type_name == "WebView"))
            {
                nexacro._printInnerContents(comp);
                return;
            }

            var ret = nexacro._print(comp, comp._refform, defaultprint, valign, halign, undefined, undefined, _is_get_string);

            for (var i = 0, len = remove_targets.length; i < len; i++)
            {
                remove_targets[i].parentNode.removeChild(remove_targets[i]);
            }

            return ret;
        };

        nexacro._print = function (pThis, refform, defaultprint, valign, halign, canvas_cnt, clone_handle, _is_get_string)
        {
            var form_elem = refform.getElement();
            var doc = form_elem._getRootWindowHandle();
            var control_elem = pThis.getElement();

            //var clone_handle = pThis._control_element._handle.cloneNode(true);
            var i = 0;
            if (!clone_handle)
            {
                clone_handle = nexacro._getCloneNode(control_elem.handle);

                // Grid는 Size를 키울 필요없음 전체 Print 하려면 사용자가 조정해야함 (메뉴얼 참조)
                // scroll은 이동 시켜줘야함
                if (pThis instanceof nexacro.Grid)
                {
                    clone_handle = nexacro._adjustScrollPosToPrint(pThis, clone_handle);
                }
                else
                {
                    if (pThis._is_form)
                    {
                        // Print는 하위 1단계까지만 recursive 하는게 의미있음
                        clone_handle = nexacro._adjustScrollPosToPrint(pThis, clone_handle, true);
                    }

                    var width = Math.max(control_elem.client_width, control_elem.container_maxwidth);
                    var height = Math.max(control_elem.client_height, control_elem.container_maxheight);

                    if (width)
                    {
                        clone_handle.style.width = width + "px";
                        if (clone_handle.firstChild)
                            clone_handle.firstChild.style.width = width + "px";
                    }
                    if (height)
                    {
                        clone_handle.style.height = height + "px";
                        if (clone_handle.firstChild)
                            clone_handle.firstChild.style.height = height + "px";
                    }
                }

                if (clone_handle.lastChild && clone_handle.lastChild.id == clone_handle.id + ".vscrollbar")
                {
                    clone_handle.removeChild(clone_handle.lastChild);
                }
                if (clone_handle.lastChild && clone_handle.lastChild.id == clone_handle.id + ".hscrollbar")
                {
                    clone_handle.removeChild(clone_handle.lastChild);
                }

                if (!_is_get_string)
                {
                    /* Sketch는 겉모양만 출력 */
                    var canvas_handles = control_elem.handle.getElementsByTagName("canvas");
                    if (canvas_handles.length)
                    {
                        var img_data, img_temp;

                        nexacro._print_canvasimage_loadcnt = 0;
                        nexacro._print_canvasimage = [];

                        for (i = 0; i < canvas_handles.length; i++)
                        {
                            img_data = canvas_handles[i].toDataURL();
                            if (img_data.indexOf("image") > -1)
                            {
                                nexacro._print_canvasimage[i] = img_temp = new Image();
                                img_temp.onload = function ()
                                {
                                    nexacro._print_canvasimage_loadcnt++;
                                    nexacro._print(pThis, refform, "", "", "", canvas_handles.length, clone_handle);
                                };
                                img_temp.src = img_data;
                            }
                            else
                            {
                                //width, height = 0
                                nexacro._print_canvasimage_loadcnt++;
                                nexacro._print_canvasimage[i] = img_temp;
                            }
                        }
                        return true;
                    }
                }
            }
            else
            {
                if (nexacro._print_canvasimage_loadcnt < canvas_cnt)
                    return;
            }

            // left top으로 맞춤
            clone_handle.style.left = "0px";
            clone_handle.style.top = "0px";
            clone_handle.style.overflow = ""; // overflow hidden bug in ie

            if (clone_handle.firstChild)
            {
                if (clone_handle.firstChild.firstChild && clone_handle.firstChild.firstChild.className == "nexacontainer")
                {
                    clone_handle.firstChild.firstChild.style.top = "0px"; // inner scroll position
                    clone_handle.firstChild.firstChild.style.left = "0px"; // inner scroll position
                }
            }
            var html = '<HTML lang=\"' + nexacro._BrowserLang.substr(0, 2) + '\">\n<HEAD>\n';
            /* set head tag for print */
            if (doc.getElementsByTagName != null)
            {
                var headTags = doc.getElementsByTagName("head");

                if (headTags.length > 0)
                {
                    var head_child = headTags[0].lastChild;
                    while (head_child)
                    {
                        if (head_child.tagName.toLowerCase() == "script")
                        {
                            var prev_child = head_child.previousElementSibling;
                            headTags[0].removeChild(head_child);
                            head_child = prev_child;
                        }
                        else
                        {
                            head_child = head_child.previousElementSibling;
                        }
                    }

                    html += headTags[0].innerHTML;
                }
            }

            var obj = clone_handle.firstChild;
            while (obj)
            {
                if (obj.style && obj.style.transform)
                {
                    obj.style.transform = "";
                    break;
                }
                else
                {
                    obj = obj.firstChild;
                }
            }

            if (clone_handle.getElementsByTagName != null)
            {
                var inputTags = clone_handle.getElementsByTagName("input");
                var temp = control_elem.handle.getElementsByTagName("input");

                for (i = 0; i < inputTags.length; i++)
                {
                    inputTags[i].setAttribute("value", temp[i].value);
                }

                inputTags = clone_handle.getElementsByTagName("textarea");
                temp = control_elem.handle.getElementsByTagName("textarea");

                var n = inputTags.length;
                for (i = 0; i < n; i++)
                {
                    inputTags[i].overflow = "hidden";
                    pThis = temp[i]._linked_element;

                    if (temp[i].value)
                    {
                        if (inputTags[i].outerHTML.indexOf("></textarea>") > -1)
                            inputTags[i].insertAdjacentText("afterBegin", temp[i].value);
                        else if (pThis.displaynulltext && inputTags[i].innerHTML == pThis.displaynulltext)
                            inputTags[i].innerHTML = temp[i].value;
                    }
                }
            }

            var classnames = "";
            var parent_node = control_elem.handle.parentNode;
            while (parent_node)
            {
                classnames += (parent_node.className ? parent_node.className : "") + " ";
                parent_node = parent_node.parentNode;
            };

            var strhtml = nexacro._getHTMLOuter(clone_handle, doc);

            html += "<style> .Grid .GridBandControl .nexacontainer > .nexacontentsbox, .Grid .GridBandControl .nexainnercontainer > .nexacontentsbox { position : absolute;} </style>";
            html += '\n</HEAD>\n\n';


            var str_bodystyle = '" style="margin: 0px; border: none; overflow: hidden; left: 0px; top: 0px; direction: inherit;';

            if (_is_get_string)
            {
                html += '<BODY class="' + classnames + str_bodystyle + '\">\n';
                html += strhtml;
                html += '</BODY>\n\n</HTML>\n\n';

                return html;
            }
            else
            {
                var bind_onload = '" onLoad="setTimeout(function () { self.print(); self.close();},100)"';
                html += '<BODY class="' + classnames + bind_onload + str_bodystyle + '\">\n';
                html += strhtml;
                html += '</BODY>\n\n</HTML>\n\n';
            }

            var wnd = window;
            if (refform && refform._control_element && refform._control_element.linkedcontrol && refform._control_element.linkedcontrol._getWindow()._doc.parentWindow)
            {
                wnd = doc.parentWindow;
            }

            var printWin = window.open("", "printSpecial", "top=" + wnd.screenTop + ",left=" + wnd.screenLeft + ", width=" + screen.width * 0.8 + ",height=" + screen.height);

            if (printWin)
            {
                var printWinDoc = printWin.document;
                if (printWinDoc)
                {
                    printWinDoc.open();
                    printWinDoc.write(html);
                    if (nexacro._Browser == "Safari")   // sync 처리시 화면이 나오지 않는 문제.
                        setTimeout(function () { printWin.document.close(); }, 100);
                    else
                        printWin.document.close();

                    var source_containers = [];

                    source_containers = control_elem.handle.getElementsByClassName("nexacontainer");

                    for (i = 0; i < source_containers.length; i++)
                    {
                        var child = printWinDoc.getElementById(source_containers[i].id).firstChild;

                        if (child.className == "nexainnercontainer")
                        {
                            if (source_containers[i].scrollLeft != 0)
                            {
                                child.style.left = -source_containers[i].scrollLeft;
                            }
                            if (source_containers[i].scrollTop != 0)
                            {
                                child.style.top = -source_containers[i].scrollTop;
                            }
                        }
                    }

                    //Canvas 계열 draw
                    if (nexacro._Browser == "Chrome" || nexacro._Browser == "Safari" || nexacro._Browser == "Edge")
                    {
                        var images = nexacro._print_canvasimage;
                        if (images)
                        {
                            var canvas_arr = printWin.document.getElementsByTagName("canvas");

                            for (i = 0; i < images.length; i++)
                            {
                                var ctx = canvas_arr[i].getContext('2d');
                                ctx.drawImage(images[i], 0, 0);
                            }

                            nexacro._print_canvasimage_loadcnt = undefined;
                            nexacro._print_canvasimage = undefined;
                        }
                    }
                    else
                    {
                        printWin.addEventListener('load', function ()
                        {
                            var images = nexacro._print_canvasimage;
                            if (images)
                            {
                                var canvas_arr = printWin.document.getElementsByTagName("canvas");

                                for (var i = 0; i < images.length; i++)
                                {
                                    var ctx = canvas_arr[i].getContext('2d');
                                    ctx.drawImage(images[i], 0, 0);
                                }

                                nexacro._print_canvasimage_loadcnt = undefined;
                                nexacro._print_canvasimage = undefined;
                            }
                        });
                    }
                    return true;
                }
            }
            return false;
        };

        nexacro._printInnerContents = function (comp)
        {
            try
            {
                comp.callMethod("print");
                return true;
            }
            catch (e)
            {
                return false;
            }
        };

        // Print element에 Scroll 이동 반영 (Grid, Div)
        nexacro._adjustScrollPosToPrint = function (comp, clone_handle, is_first)
        {
            // Print는 하위 1단계까지만 recursive 하는게 의미있음
            if (comp._is_form && is_first)
            {
                var comps = comp.components;
                for (let i = 0; i < comps.length; i++)
                {
                    clone_handle = nexacro._adjustScrollPosToPrint(comps[i], clone_handle, false);
                }
            }
            else
            {
                var clone_elems = [];
                if (clone_handle)
                {
                    clone_elems = clone_handle.getElementsByClassName("nexacontainer");
                }

                var control_elem = null;
                var hscroll_pos = 0, vscroll_pos = 0;

                if (comp instanceof nexacro.Div && comp.form)
                {
                    var _form = comp.form;

                    if (is_first === false)
                    {
                        // Div 내부 form의 recursive 동작, Print는 하위 1단계까지만 recursive 하는게 의미있음
                        clone_handle = nexacro._adjustScrollPosToPrint(_form, clone_handle, true);
                    }

                    control_elem = _form.getElement();
                    if (control_elem && control_elem._client_elem)
                    {
                        hscroll_pos = control_elem.scroll_left;
                        vscroll_pos = control_elem.scroll_top;

                        if (hscroll_pos > 0 || vscroll_pos > 0)
                        {
                            var client_width = control_elem.width;
                            var client_height = control_elem.height;
                            var container_elem = clone_elems[control_elem._client_elem.name];

                            if (container_elem)
                            {
                                // scroll 만큼 position 변경
                                container_elem.style.left = "-" + hscroll_pos + "px";
                                container_elem.style.top = "-" + vscroll_pos + "px";

                                // scroll 만큼 size 확장
                                container_elem.style.width = client_width + hscroll_pos + "px";
                                container_elem.style.height = client_height + vscroll_pos + "px";
                            }
                        }
                    }
                }
                else if (comp instanceof nexacro.Grid)
                {
                    // scroll은 이동 시켜줘야함
                    control_elem = comp.getElement();
                    if (control_elem && control_elem.handle)
                    {
                        hscroll_pos = control_elem.scroll_left;
                        if (hscroll_pos > 0)
                        {
                            // scroll로 이동된 곳을 표시 active element가 아니기 때문에 left와 width를 조정 반영
                            var adjust_left = "-" + hscroll_pos + "px";
                            var adjust_width = control_elem.client_width + hscroll_pos + "px";

                            var row_elem = null;
                            var row_elems = control_elem.handle.getElementsByClassName("nexacontainer");
                            for (var i = 0; i < row_elems.length; i++)
                            {
                                if (row_elems[i].id.indexOf("containerbody") > -1)
                                {
                                    row_elem = clone_elems[row_elems[i].id];
                                    if (row_elem)
                                    {
                                        row_elem.style.left = adjust_left;
                                        row_elem.style.width = adjust_width;
                                    }
                                }
                            }

                            adjust_left = null;
                            adjust_width = null;
                        }
                    }
                }
            }

            return clone_handle;
        };

        nexacro._saveToImageFile = nexacro._emptyFn;
        nexacro._saveCanvasToImageFile = nexacro._emptyFn;
        nexacro._saveToImageBase64String2 = nexacro._emptyFn;
        nexacro._saveToImageBase64StringM2 = nexacro._emptyFn;
        nexacro._exportPDF = nexacro._emptyFn;

        //==============================================================================
        // IFrame Manager
        //==============================================================================

        /* srcdoc 로 변경하고, nexacro 객체 참조를 onload를 통해서 하도록 변경 */

        nexacro._managerFrameDoc = null;
        nexacro._managerFrameNode = null;
        nexacro._managerFrameSrc = "<html lang=\"" + nexacro._BrowserLang.substr(0, 2) + "\">\n"
            + "<head>\n"
            + "<style> .calculate_image { position: absolute; height: auto; width: auto; left: 0px; top: 0px; } </style>"
            + "<style> .calculate_text { position: absolute; height: auto; width: auto; left: 0px; top: 0px; } </style>"
            + "</head>\n"
            + "<body style='margin:0;border:none;'>\n"
            /*+ "<script type='text/javascript'>\n"
            + "nexacro = parent.nexacro;"
            + 'nexacro._imgloadhandler_onload_forward = function(e) { nexacro._imgloadhandler_onload(e.target); };'
            + 'nexacro._imgloadhandler_onerror_forward = function (e) { nexacro._imgloadhandler_onerror(e.target); };'
            + "</script>\n"*/
            + "</body>\n"
            + "</html>";


        nexacro._managerPopupFrameSrc = "<html lang=\"" + nexacro._BrowserLang.substr(0, 2) + "\">\n"
            + "<head/>\n"
            + "<body style='margin:0;border:none;'>\n"
            /*+ "<script type='text/javascript'>\n"
            + "nexacro = parent.nexacro;"
            + "</script>\n"*/
            + "</body>\n"
            + "</html>";

        nexacro._preparePopupManagerFrame = function (popupWin)
        {
            var _doc = popupWin.document;
            var iframeobj = _doc.createElement("IFRAME");
            iframeobj.frameborder = "0";
            iframeobj.overflow = "hidden";
            iframeobj.style.visibility = 'hidden';
            iframeobj.style.position = 'absolute';
            iframeobj.style.border = 'none';

            var str_title = nexacro._getErrorMessge("msg_accessibility_emptyframe");
            nexacro.__setDOMNode_Title(iframeobj, str_title);
            //iframeobj.src = "about:blank";
            iframeobj.srcdoc = nexacro._managerPopupFrameSrc;

            _doc.body.appendChild(iframeobj);
            iframeobj.onload = () =>
            {
                var _frame_doc = iframeobj.contentDocument;
                iframeobj.contentWindow.nexacro = nexacro;
                nexacro._managerPopupFrameNode = iframeobj;
                nexacro._managerPopupFrameDoc = _frame_doc;
            }



            /*_frame_doc.open();
            _frame_doc.write(nexacro._managerPopupFrameSrc);
            _frame_doc.close();*/

        };

        /*
        before -> argument[0] : callbackfn, argument[1] : fontface_info
        after -> argument[0] : window, argument[1] : document, argument[2] : onloadframework
        */
        nexacro._prepareManagerFrame = function (win, doc, callbackfn, screeninfo)
        {
            let version = 24;
            let externalcallbackfn;
            let fontface_info;
            if (arguments.length >= 3)
            {
                version = 26;
                if (!nexacro.ismodule)
                    nexacro._initHTMLSysEvent(arguments[0], arguments[1]);
                externalcallbackfn = callbackfn;
                callbackfn = nexacro._initEnvironment_new;

                const env = nexacro.getEnvironment();
                fontface_info = env && env.on_getUserFontInfo ? env.on_getUserFontInfo() : null;
            }
            else if (arguments.length < 3)
            {
                callbackfn = win;
                fontface_info = doc;
                win = window;
                doc = document;
            }

            var iframeobj = doc.createElement("IFRAME");
            iframeobj.title = "";
            iframeobj.frameborder = "0";
            iframeobj.style.overflow = "hidden";
            iframeobj.style.visibility = 'hidden';
            iframeobj.style.position = 'absolute';
            iframeobj.style.border = 'none';
            if (nexacro._OS == "iOS")
                iframeobj.style.display = 'none'; //ios hybrid에선 iframe이 visibility 로 hidden 되지 않음.

            var str_title = nexacro._getErrorMessge("msg_accessibility_emptyframe");
            nexacro.__setDOMNode_Title(iframeobj, str_title);


            //iframeobj.src = "about:blank";


            var iframe_src = nexacro._managerFrameSrc;
            let taskcallback = function () { };
            const userfontnode = doc.getElementById("userfont");
            if (fontface_info && userfontnode)
            {
                iframe_src = iframe_src.slice(0, iframe_src.indexOf("</head>")) +
                    userfontnode.outerHTML + "\n" +
                    iframe_src.slice(iframe_src.indexOf("</head>"));
            }
            iframeobj.srcdoc = iframe_src;
            doc.body.appendChild(iframeobj);
            iframeobj.onload = () =>
            {
                var _frame_doc = iframeobj.contentDocument;

                iframeobj.contentWindow.nexacro = nexacro;
                var script = _frame_doc.createElement("script");
                script.type = "text/javascript";
                script.textContent = `
                    nexacro._imgloadhandler_onload_forward = function(e) {
                        nexacro._imgloadhandler_onload(e.target);
                    };
                    nexacro._imgloadhandler_onerror_forward = function(e) {
                        nexacro._imgloadhandler_onerror(e.target);
                    };
                `;
                _frame_doc.body.appendChild(script);
                nexacro._managerFrameNode = iframeobj;
                nexacro._managerFrameDoc = _frame_doc;
                taskcallback();
            }
            taskcallback = () =>
            {
                var iframe_doc = iframeobj.contentDocument;

                //iframe_doc.open();
                //iframe_doc.write(iframe_src);
                //iframe_doc.close();



                // 제너레이션 작업 완료후 삭제
                if (!callbackfn)
                    return;

                var i, info, node_serif;
                if (fontface_info && userfontnode)
                {
                    var info_len = fontface_info.length;
                    var load_cnt = info_len;
                    nexacro._fontface_info = [];
                    nexacro._loading_index = [];
                    var is_loaded = false;
                    function font_onload(font)
                    {
                        load_cnt--;
                        if (!load_cnt && callbackfn && !is_loaded)
                        {
                            nexacro._fontface_info = null;
                            nexacro._loading_index = null;

                            callbackfn.call(this, externalcallbackfn, screeninfo);
                            is_loaded = true;
                        }
                    }
                    function font_onerror(font)
                    {
                        // error notify console
                        var str = nexacro.MakeReferenceError(this, "loading_error", font.family);
                        str = str.toString();

                        /*  eslint-disable no-console */
                        console.log(str.substr(16));    // "ReferenceError: " 제거

                        load_cnt--;
                        if (!load_cnt && callbackfn && !is_loaded)
                        {
                            nexacro._fontface_info = null;
                            nexacro._loading_index = null;

                            callbackfn.call(this, externalcallbackfn, screeninfo);
                            is_loaded = true;
                        }
                    }

                    if ("fonts" in iframe_doc)
                    {
                        var use_shadow = !!doc.body.attachShadow;
                        if (use_shadow)
                        {
                            var fontsetss = doc.fonts;
                            var len = fontsetss.size;
                            var trial_cnt = 0;
                            // shadowdom 사용시 userfont size 에 iframe 사용안함 (body 사용)
                            doc.fonts.forEach(function (fontface)
                            {
                                fontface.load().then(font_onload.bind(null, fontface), font_onerror.bind(null, fontface));
                            });
                            if (len > 0)
                            {
                                var loadinterval = setInterval(() =>
                                {
                                    var cnt = 0;
                                    trial_cnt++;
                                    fontsetss.forEach(function (fontface)
                                    {
                                        var fontface_status = fontface.status;
                                        if (fontface_status == "loaded" || fontface_status == "error")
                                            cnt++;
                                    });
                                    if (is_loaded || trial_cnt > 100) //10s
                                        clearInterval(loadinterval);
                                    else if (cnt >= len)
                                    {
                                        clearInterval(loadinterval);
                                        callbackfn.call(this, externalcallbackfn, screeninfo);
                                        is_loaded = true;
                                    }
                                }, 100);
                            }
                        }
                        else
                        {
                            iframe_doc.fonts.forEach(function (fontface)
                            {
                                fontface.load().then(font_onload.bind(null, fontface), font_onerror.bind(null, fontface));
                            });
                        }
                    }
                    else
                    {
                        iframe_doc._start_usefontload_time = new Date();

                        function fontfaceLoad(idx)
                        {
                            if (idx == null && nexacro._loading_index.length)
                                idx = nexacro._loading_index.pop();

                            var iframe_doc = nexacro._managerFrameDoc;
                            var info = nexacro._fontface_info[idx];
                            if (info)
                            {
                                node_serif = iframe_doc.getElementById(info._node_id);
                                if (node_serif)
                                {
                                    node_serif.style.fontFamily = info.family + ", serif";

                                    if (info._serif_width != node_serif.clientWidth || info._serif_height != node_serif.clientHeight)
                                    {
                                        font_onload(info);
                                    }
                                    else if ((new Date() - iframe_doc._start_usefontload_time) > 3000)
                                    {
                                        font_onerror(info);
                                    }
                                    else
                                    {
                                        nexacro._loading_index.push(idx);
                                        win.setTimeout(fontfaceLoad, 200);
                                    }
                                }
                                else
                                {
                                    font_onerror(info);
                                }
                            }
                        }

                        for (i = 0; i < info_len; i++)
                        {
                            node_serif = null;

                            info = fontface_info[i];

                            node_serif = doc.createElement("div");
                            node_serif.id = info.family + info.style + info.weight;
                            node_serif.setAttribute("aria-hidden", "true");
                            node_serif.setAttribute("role", "document");
                            node_serif.setAttribute("aria-label", " ");

                            node_serif.style.cssText = "display:block;position:absolute;width:auto;height:auto;line-height:normal;margin:0;padding:0;white-space:nowrap;font-variant:normal;font-size:15pt;font-family:serif;font-style:" + info.style + ";font-weight:" + info.weight + ";";

                            node_serif.textContent = "fontfaceTest";


                            iframe_doc.body.appendChild(node_serif);

                            info._node_id = info.family + info.style + info.weight;
                            info._serif_width = node_serif.clientWidth;
                            info._serif_height = node_serif.clientHeight;

                            nexacro._fontface_info.push(info);
                            fontfaceLoad(i);
                        }
                    }
                }
                else
                {
                    callbackfn.call(this, externalcallbackfn, screeninfo);
                }
            };
        };

        nexacro._destroyManagerFrame = function (_win_handle)
        {
            var dest_handle = nexacro._getWindowDestinationHandle(_win_handle);
            if (nexacro._managerFrameNode && dest_handle)
            {
                nexacro.__removeDOMNode(dest_handle, nexacro._managerFrameNode);
            }
            nexacro._managerFrameNode = null;
            nexacro._managerFrameDoc = null;

        };

        nexacro._destroyPopupFrameInfo = function (win)
        {
            if (win && win._popupframes)
            {
                win._popupframes.clear();
                win._popupframes = null;
            }
        };

        //==============================================================================
        // ShadowDOM Manager
        //==============================================================================
        nexacro._managerShadowRoot = null;
        nexacro._managerShadowDoc = null;

        nexacro._createManagerShadow = function (root_name)
        {
            var node = document.createElement(root_name);
            if (node)
            {
                node.style.visibility = "hidden";

                document.body.appendChild(node);

                nexacro._managerShadowRoot = node;
                nexacro._managerShadowDoc = node.attachShadow({ mode: 'open' });
            }
        };

        nexacro._destroyManagerShadow = function (_win_handle)
        {
            var dest_handle = nexacro._getWindowDestinationHandle(_win_handle);
            if (nexacro._managerShadowRoot && dest_handle)
            {
                nexacro.__removeDOMNode(dest_handle, nexacro._managerShadowRoot);
            }
            nexacro._managerShadowRoot = null;
            nexacro._managerShadowDoc = null;
        };

        //==============================================================================
        // TextInfoCacheManager ( new )
        //==============================================================================
        nexacro._TextCacheNodeCnt = 0;
        nexacro._TextSizeCacheManagers = {};

        nexacro._TextInfoCacheManager = function (font, wordwrap, wordspacing, letterspacing, usedecorate, textalign, verticalalign, refer_font)
        {
            this.font = font;
            this.wordspacing = wordspacing ? wordspacing : undefined;
            this.letterspacing = letterspacing ? letterspacing : undefined;
            this.usedecorate = usedecorate;
            this.textalign = textalign;
            this.verticalalign = verticalalign;

            // convert to absolute unit FontObject
            this._font = nexacro._convertToAbsUnitFontObj(font, refer_font);

            if (wordwrap == true || wordwrap == "true" || wordwrap == undefined)
            {
                wordwrap = "char";
            }
            else if (wordwrap == false || wordwrap == "false")
            {
                wordwrap = "none";
            }
            this.wordwrap = wordwrap;

            this.node_canvas = null;
            this.node_div = null;
            this.node_textarea = null;

            this.font_height = 0;
            this.space_width = 0;

            this.cache = {};

            this._createCalcNode();
            this._initFontInfo();
        };
        var _pTextInfoCacheManager = nexacro._createPrototype(Object, nexacro._TextInfoCacheManager);
        nexacro._TextInfoCacheManager.prototype = _pTextInfoCacheManager;

        _pTextInfoCacheManager._createCalcNode = function ()
        {
            var target;

            // create node
            var node_div = this._createNode("div");
            var node_textarea = this._createNode("textarea");
            var node_canvas = document.createElement("canvas");

            // prepare
            var use_shadow = !!document.body.attachShadow;
            if (use_shadow)
            {
                // create shadow
                if (!nexacro._managerShadowRoot)
                {
                    nexacro._createManagerShadow("calc-contents");
                }

                target = nexacro._managerShadowDoc;
            }
            else
            {
                target = nexacro._managerFrameDoc.body;
            }

            if (node_canvas)
            {
                var ctx = node_canvas.getContext('2d');
                ctx.font = this._font._sysvalue;
            }

            // append node
            target.appendChild(node_div);
            target.appendChild(node_textarea);

            // assign node
            this.node_div = node_div;
            this.node_textarea = node_textarea;
            this.node_canvas = node_canvas;

            nexacro._TextCacheNodeCnt++;
        };

        _pTextInfoCacheManager._createNode = function (tag_name)
        {
            var node = document.createElement(tag_name);
            node.id = "calculate_" + tag_name + "_" + nexacro._TextCacheNodeCnt;

            node.style.position = "absolute";
            node.style.left = "0px";
            node.style.top = "0px";
            node.style.visibility = "hidden";
            this._setStyleFont(node.style, this._font);
            nexacro.__setDOMStyle_WordWrap(node.style, this.wordwrap);

            if (tag_name == "div")
            {
                node.style.width = "auto";
                node.style.height = "auto";

                if (this.letterspacing)
                {
                    nexacro.__setDOMStyle_LetterSpacingObject(node.style, this.letterspacing);
                }

                if (this.wordspacing)
                {
                    nexacro.__setDOMStyle_WordSpacingObject(node.style, this.wordspacing);
                }
            }
            else if (tag_name == "textarea")
            {
                node.style.width = "1px";
                node.style.height = "1px";
                node.style.overflow = "hidden";
                node.style.visibility = "hidden";
            }

            return node;
        };

        _pTextInfoCacheManager._setStyleFont = function (node_style, font)
        {
            node_style.font = font._sysvalue;
        };

        _pTextInfoCacheManager._initFontInfo = function ()
        {
            var node = this.node_div;
            var use_letterspacing = !!this.letterspacing;
            var use_wordspacing = !!this.wordspacing;
            var use_fontface = document.getElementById("userfont");

            nexacro.__setDOMNode_SinglelineText(node, "gH한");
            var nonspace_rect = node.getBoundingClientRect();

            nexacro.__setDOMNode_SinglelineText(node, "g H한");
            var space_rect = node.getBoundingClientRect();

            this.font_height = nonspace_rect.height;

            if (use_letterspacing || use_wordspacing || use_fontface)
            {
                this.space_width = space_rect.width - nonspace_rect.width;
            }
            else
            {
                var ctx = this.node_canvas.getContext('2d');
                this.space_width = ctx.measureText(" ").width;
            }
        };

        _pTextInfoCacheManager.getWordTextWidth = function (word)
        {
            var node, ctx;
            var use_letterspacing = !!this.letterspacing;
            var use_decorate = this.usedecorate;
            var use_fontface = document.getElementById("userfont");
            var cache_key = use_letterspacing ? word + " " + this.letterspacing : word;
            if (typeof (this.cache[cache_key]) == "function")
                cache_key = this.cache[cache_key].name + "_fn"; // prevent prototype chain error

            var text_width = this.cache[cache_key];
            if (text_width == null)
            {
                if (use_letterspacing || use_decorate || use_fontface)
                {
                    node = this.node_div;
                    node.style.width = "auto";

                    try
                    {
                        if (use_decorate)
                        {
                            nexacro.__setDOMNode_DecorateText(node, word);
                        }
                        else
                        {
                            nexacro.__setDOMNode_SinglelineText(node, word);
                        }
                    }
                    catch (e)
                    {
                        nexacro._settracemsg(e);
                    }

                    text_width = node.clientWidth;
                }
                else
                {
                    node = this.node_canvas;
                    ctx = node.getContext('2d');

                    text_width = ctx.measureText(word).width;
                }

                this.cache[cache_key] = text_width;
            }

            return text_width;
        };

        _pTextInfoCacheManager.getWordWrapTextSize = function (text, width)
        {
            var strw = text + "#div_width" + width;
            var strh = strw + "#div_height";

            var text_width = this.cache[strw];
            var text_height = this.cache[strh];

            if (text_width == null)
            {
                var node = this.node_div;
                node.style.width = width + "px";

                var disp = node.style.display;
                var posi = node.style.position;
                var change = false;

                if (nexacro._OS == "iOS") // ios에서 align에 따라 line 간격이 달라지는 현상이 있음. 다른 환경에서 필요시 분기 추가가능.
                {
                    if (this.textalign)
                    {
                        node.style.display = "table-cell";
                        node.style.textAlign = this.textalign;
                        change = true;
                    }

                    if (this.verticalalign)
                    {
                        node.style.position = "relative";
                        node.style.display = "table-cell";
                        node.style.verticalAlign = this.verticalalign;
                        change = true;
                    }
                }

                try
                {
                    if (this.usedecorate)
                    {
                        nexacro.__setDOMNode_DecorateText(node, text);
                    }
                    else
                    {
                        nexacro.__setDOMNode_MultilineText(node, text);
                    }
                }
                catch (e)
                {
                    nexacro._settracemsg(e);
                }

                text_width = node.clientWidth;
                text_height = node.clientHeight;

                this.cache[strw] = text_width;
                this.cache[strh] = text_height;

                if (change)
                {
                    node.style.display = disp;
                    node.style.position = posi;
                    node.style.textAlign = "";
                    node.style.verticalAlign = "";
                }

                nexacro.__setDOMNode_MultilineText(node, "");
            }

            return [text_width, text_height];
        };

        _pTextInfoCacheManager.getTextAreaWordwrapTextSize = function (text, width)
        {
            var node = this.node_textarea;
            node.style.width = width + "px";

            var strw, strh, text_width, text_height;

            var bcache = (text.length <= 1024) ? true : false;
            if (bcache)
            {
                strw = text + "#textarea_width" + width;
                strh = strw + "#textarea_height";

                text_width = this.cache[strw];
                text_height = this.cache[strh];

                try
                {
                    nexacro.__setTextAreaDOMNode_Text(node, text);
                }
                catch (e)
                {
                    nexacro._settracemsg(e);
                }

                text_width = node.scrollWidth;
                text_height = node.scrollHeight;

                this.cache[strw] = text_width;
                this.cache[strh] = text_height;
            }
            else
            {
                nexacro.__setTextAreaDOMNode_Text(node, text);

                text_width = node.scrollWidth;
                text_height = node.scrollHeight;
            }

            nexacro.__setTextAreaDOMNode_Text(node, "");

            return [text_width, text_height];
        };

        (function ()
        {
            // for RegExpcahe : use closure
            var re_newline = /\r\n|\n|\r/;
            var re_space = /\s/;

            nexacro.__getSinglelineTextSize = function (manager, text)
            {
                var words = text;
                var text_size = 0;

                if (!manager.usedecorate)
                {
                    words = text.split(re_space);

                    var wcnt = words.length;
                    if (wcnt > 1)
                    {
                        var idx_fullspace = text.indexOf("　");
                        if (idx_fullspace > -1)
                        {
                            text_size = manager.getWordTextWidth(text);
                        }
                        else
                        {
                            for (var i = 0; i < wcnt; i++)
                            {
                                var word = words[i];
                                if (word)
                                {
                                    text_size += manager.getWordTextWidth(word);
                                }
                            }

                            text_size += (wcnt - 1) * manager.space_width;
                        }
                    }
                    else
                    {
                        text_size = manager.getWordTextWidth(text);
                    }
                }
                else
                {
                    text_size = manager.getWordTextWidth(words);
                }

                return text_size;
            };

            nexacro._getSinglelineTextSize = function (manager, text)
            {
                var text_width = nexacro.__getSinglelineTextSize(manager, text.replace(/\r\n|\n|\r/, ' '));
                return [text_width, manager.font_height];
            };

            nexacro._getMultilineTextSize = function (manager, text)
            {
                var lines = text.split(re_newline);
                var lcnt = lines.length;
                var text_width = 0;
                for (var i = 0; i < lcnt; i++)
                {
                    var line_width = nexacro.__getSinglelineTextSize(manager, lines[i]);
                    if (line_width > text_width)
                        text_width = line_width;
                }
                return [text_width, manager.font_height * lcnt];
            };

            nexacro._getWordwrapTextSize = function (manager, text, content_width)
            {
                var text_size = manager.getWordWrapTextSize(text, content_width);
                return text_size;
            };

            // tab(\t) preserved
            nexacro._getTextAreaWordwrapTextSize = function (manager, text, content_width)
            {
                var text_size = manager.getTextAreaWordwrapTextSize(text, content_width);
                return text_size;
            };
        })();

        nexacro._getTextSizeCacheManager = function (font, wordwrap, wordspacing, letterspacing, usedecoration, cache_value, textalign, verticalalign, refer_font)
        {
            cache_value = cache_value ? cache_value : font._sysvalue;

            var cache_manager = nexacro._TextSizeCacheManagers[cache_value];
            if (cache_manager == null)
            {
                cache_manager = new nexacro._TextInfoCacheManager(font, wordwrap, wordspacing, letterspacing, usedecoration, textalign, verticalalign, refer_font);
                if (cache_manager.font_height > 0)
                {
                    nexacro._TextSizeCacheManagers[cache_value] = cache_manager;
                }
            }

            return cache_manager;
        }

        nexacro._getTextSize = function (text, font, multiline, content_width, wordwrap, wordspacing, letterspacing, usedecoration, textalign, verticalalign, refer_font)
        {
            if (content_width == 0) content_width = -1;

            if (text && text.length > 0 && font && font._sysvalue)
            {
                wordspacing = wordspacing ? wordspacing : undefined;
                letterspacing = letterspacing ? letterspacing : undefined;

                var cache_value = font._sysvalue + " " + wordwrap + " " + wordspacing + " " + letterspacing + " " + usedecoration + (refer_font ? (" " + refer_font._sysvalue) : "");
                var cache_manager = nexacro._getTextSizeCacheManager(font, wordwrap, wordspacing, letterspacing, usedecoration, cache_value, textalign, verticalalign, refer_font);

                //check multiline
                if (multiline === undefined)
                {
                    var newline = /(\r\n|\n|\r)/.exec(text);
                    if (newline)
                    {
                        multiline = true;
                    }
                }

                if (multiline)
                {
                    if (content_width != null)
                    {
                        return nexacro._getWordwrapTextSize(cache_manager, text, content_width);
                    }
                    else
                    {
                        return nexacro._getMultilineTextSize(cache_manager, text);
                    }
                }
                else
                {
                    return nexacro._getSinglelineTextSize(cache_manager, text);
                }
            }
            return [0, 0];
        };

        // wordspading, letterspacing은 제공(메뉴얼 및 코드)된 적이 없음
        // nexacro.getTextSize(strText, strFont [, nLimitWidth, strWordWrap, [refObj]])
        nexacro.getTextSize = function (text, font, width, wordwrap, refobj, wordspacing, letterspacing)
        {
            if (font)
                font = nexacro.FontObject(font);

            if (typeof (wordwrap) == "string")
                wordwrap = wordwrap.toLowerCase();

            if (wordwrap === true || wordwrap == "true")
                wordwrap = "char";
            else if (wordwrap === false || wordwrap == "false" || wordwrap == undefined)
                wordwrap = "none";

            var line = true;

            if (wordwrap == "none")
                line = false;
            else if (wordwrap == "line")
                wordwrap = null;

            // 입력된 font가 em, rem 인경우 refobj의 font를 취득하여 기준 font-size로 활용 (refobj 없으면 mainframe)
            var unit = font._unit, refer_font;
            if (unit.indexOf("em") > -1)
            {
                if (width instanceof nexacro.Component)
                {
                    refobj = width;
                }

                if (!refobj || unit == "rem")
                {
                    // refobj 없으면 application을 찾을 수 없을 수도 있다.
                    const app = nexacro.getApplication();
                    if (app)
                        refobj = app.mainframe;
                }

                if (refobj)
                {
                    refer_font = refobj._getCurrentStyleInheritValue("font");
                }
            }

            var retn = nexacro._getTextSize(text, font, line, width, wordwrap, wordspacing, letterspacing, undefined, undefined, undefined, refer_font);
            var obj = { nx: retn[0], ny: retn[1] };

            return obj;
        };


        nexacro._getTextBaseline = function (textBaseline, y, h)
        {
            //canvas._textBaseline --------- 0 = alphabetic, 1 = hanging, 2 = top, 3 = bottom, 4 = middle
            var cony = y;
            var s = h / 7; // seven is magic number
            if (textBaseline == 3) // bottom
                cony -= h / 3 - s;
            else if (textBaseline == 2) //top
                cony += h / 2;
            else if (textBaseline === 0) //alphabetic
                cony = y - h / 3 + s;
            else if (textBaseline == 1) //hanging
                cony = y + h / 2 + s;
            return cony;
        };

        //==============================================================================
        // ImgInfoCacheManager
        //==============================================================================
        nexacro._ImgInfoCacheManager =
        {
            cnt: 0,
            ready: [],
            loadinglist: {},
            get_imgnode: function (img_url)
            {
                var node = this.find_imgnode(img_url);
                if (node == null)
                {
                    var _doc = nexacro._managerFrameDoc;
                    node = _doc.createElement("img");
                    node.id = "calculate_img_" + this.cnt;
                    // if (nexacro._enableaccessibility)
                    nexacro.__setDOMNode_Alt(node, "");
                    //-------------------------------------------------------------
                    // 큰 이미지가 iframe안의 body에 바로 붙게될경우 iframe 밖의 body 스크롤에 영향을 미침 (iOS)
                    if (nexacro._allow_default_pinchzoom)
                    {
                        var imgcontainer = _doc.getElementById("calculate_img_container");
                        if (!imgcontainer)
                        {
                            imgcontainer = _doc.createElement("div");
                            imgcontainer.id = "calculate_img_container";
                            imgcontainer.style.position = 'absolute';
                            imgcontainer.style.overflow = 'hidden';
                            imgcontainer.style.width = "1px";
                            imgcontainer.style.height = "1px";
                            _doc.body.appendChild(imgcontainer);
                        }
                        imgcontainer.appendChild(node);
                    }
                    else
                        _doc.body.appendChild(node);
                    this.cnt++;
                }
                return node;
            },
            restore_imgnode: function (node)
            {
                if (!node._keep)
                {
                    var src = node.getAttributeNode("src");
                    if (src)
                        node.removeAttributeNode(src);
                }

                this.ready.push(node);
            },
            find_imgnode: function (img_url)
            {
                for (var i = 0, objs = this.ready, len = objs.length; i < len; i++)
                {
                    var obj = objs[i];
                    if (obj.src == img_url)
                        return obj;
                }
            },
            remove_imgnode: function (node)
            {
                var _doc = nexacro._managerFrameDoc;
                var parent = _doc.body;
                if (nexacro._allow_default_pinchzoom)
                {
                    var imgcontainer = _doc.getElementById("calculate_img_container");
                    if (imgcontainer)
                    {
                        parent = imgcontainer;
                    }
                }
                if (parent.contains(node))
                    parent.removeChild(node);
                this.ready.pop();
            },
            clear_imgnode: function ()
            {
                var node = null;
                var _doc = nexacro._managerFrameDoc;
                var parent = _doc.body;
                if (nexacro._allow_default_pinchzoom)
                {
                    var imgcontainer = _doc.getElementById("calculate_img_container");
                    if (imgcontainer)
                    {
                        parent = imgcontainer;
                    }
                }
                while (this.ready.length > 0)
                {
                    node = this.ready.pop();
                    if (parent.contains(node))
                        nexacro.__removeDOMNode(parent, node);
                    //node = null;
                }
                this.ready = null;
                this.ready = [];
            }
        };

        nexacro._imgloadhandler_onload = function (node)
        {
            var img_url = node._cacheurl;
            node._cacheurl = null;

            var width = node.naturalWidth || node.width;
            var height = node.naturalHeight || node.height;

            //set to Cache & remove loadinglist
            nexacro._ImgInfoCacheList[img_url] = { width: width, height: height };
            delete nexacro._ImgInfoCacheManager.loadinglist[img_url];

            nexacro._stopSysObserving(node, "load", "onload", nexacro._imgloadhandler_onload_forward);
            nexacro._stopSysObserving(node, "error", "onerror", nexacro._imgloadhandler_onerror_forward);

            if (node._callbackList)
            {
                var callbacklist = node._callbackList;
                var cnt = callbacklist.length;
                for (var i = 0; i < cnt; i++)
                {
                    callbacklist[i].callback.call(callbacklist[i].target, img_url, width, height);
                    callbacklist[i].target = null;
                }
                node._callbackList = null;
            }
            nexacro._ImgInfoCacheManager.restore_imgnode(node);
            nexacro._ImgInfoCacheManager.remove_imgnode(node);//실제 iframe 내부 dom node 삭제
            //nexacro._ImgInfoCacheManager.clear_imgnode(node);
        };

        nexacro._imgloadhandler_onerror = function (node)
        {
            var img_url = node._cacheurl;
            delete node._cacheurl;
            node._cacheurl = null;

            // set to Cache
            nexacro._ImgInfoCacheList[img_url] = { width: 0, height: 0 };
            delete nexacro._ImgInfoCacheManager.loadinglist[img_url];

            nexacro._stopSysObserving(node, "load", "onload", nexacro._imgloadhandler_onload_forward);
            nexacro._stopSysObserving(node, "error", "onerror", nexacro._imgloadhandler_onerror_forward);

            if (node._callbackList)
            {
                var callbacklist = node._callbackList;
                var cnt = callbacklist.length;
                for (var i = 0; i < cnt; i++)
                {
                    callbacklist[i].callback.call(callbacklist[i].target, img_url, 0, 0, node, -1);
                }
                delete node._callbackList;
                node._callbackList = null;
            }
            nexacro._ImgInfoCacheManager.restore_imgnode(node);
        };

        nexacro._getImageSize = function (src, callbackFn, pThis, base_url)
        {
            if (!src) return null;
            if (src.substring(0, 4).toLowerCase() == "url(")
            {
                src = src.substring(5, src.length - 2);
            }

            if (!src)
            {
                return null;
            }

            var img_url = src;
            var retval = nexacro._ImgInfoCacheList[img_url];
            if (retval)
            {
                return retval;
            }
            var format = nexacro._transImageBase64StringFormat(img_url, false, true);
            if (format)
            {
                if (format.ext == "" && nexacro._Browser == "Chrome" || nexacro._BrowserType == "Opera" || nexacro._Browser == "Edge")
                {
                    img_url = format.data + "/*" + format.encode + format.contents;
                }
                else
                {
                    img_url = format.alldata;
                }
            }
            else
            {
                img_url = nexacro._getImageLocation(src, base_url);
            }


            retval = nexacro._ImgInfoCacheList[img_url];
            if (retval)
            {
                if (retval.height == 0 && img_url.indexOf(".svg") > 0)
                {
                    //Do nothing
                }
                else
                    return retval;
            }

            if (img_url)
            {
                var imgnode = nexacro._ImgInfoCacheManager.loadinglist[img_url];
                if (imgnode)
                {
                    imgnode._callbackList.push({ target: pThis, callback: callbackFn });
                }
                else
                {
                    imgnode = nexacro._ImgInfoCacheManager.get_imgnode("");
                    nexacro._ImgInfoCacheManager.loadinglist[img_url] = imgnode;
                    imgnode._callbackList = [{ target: pThis, callback: callbackFn }];
                    imgnode._cacheurl = img_url;
                    nexacro._observeSysEvent(imgnode, "load", "onload", nexacro._imgloadhandler_onload_forward);
                    nexacro._observeSysEvent(imgnode, "error", "onerror", nexacro._imgloadhandler_onerror_forward);
                    imgnode.src = img_url;
                }
                retval = nexacro._ImgInfoCacheList[img_url];

                //imgnode = null;
            }
            return retval ? retval : null;
        };

        nexacro._getImageViewSize = function (src, callbackFn, pThis, base_url)
        {
            if (!src) return null;
            if (src.substring(0, 4).toLowerCase() == "url(")
            {
                src = src.substring(5, src.length - 2);
            }

            if (!src)
            {
                return null;
            }

            var img_url = src;
            var retval = nexacro._ImgInfoCacheList[img_url];
            if (retval)
            {
                return retval;
            }
            var format = nexacro._transImageBase64StringFormat(img_url, false, true);
            if (format)
            {
                if (format.ext == "" && nexacro._Browser == "Chrome" || nexacro._BrowserType == "Opera" || nexacro._Browser == "Edge")
                {
                    img_url = format.data + "/*" + format.encode + format.contents;
                }
                else
                {
                    img_url = format.alldata;
                }
            }
            else
            {
                img_url = nexacro._getImageLocation(src, base_url);
            }

            retval = nexacro._ImgInfoCacheList[img_url];
            if (retval)
            {
                return retval;
            }

            if (img_url)
            {
                var imgnode = nexacro._ImgInfoCacheManager.loadinglist[img_url];
                if (imgnode)
                {
                    imgnode._callbackList.push({ target: pThis, callback: callbackFn });
                }
                else
                {
                    imgnode = nexacro._ImgInfoCacheManager.get_imgnode("");
                    nexacro._ImgInfoCacheManager.loadinglist[img_url] = imgnode;
                    imgnode._callbackList = [{ target: pThis, callback: callbackFn }];
                    imgnode._cacheurl = img_url;
                    nexacro._observeSysEvent(imgnode, "load", "onload", nexacro._imgloadhandler_onload_forward);
                    nexacro._observeSysEvent(imgnode, "error", "onerror", nexacro._imgloadhandler_onerror_forward);
                    imgnode.setAttribute("src", img_url);
                }
                retval = nexacro._ImgInfoCacheList[img_url];

                //imgnode = null;
            }
            return retval ? retval : null;
        };

        nexacro._getImageObject = function (src, callbackFn, pThis, base_url)
        {
            if (src.substring(0, 4).toLowerCase() == "url(")
            {
                src = src.substring(5, src.length - 2);
            }

            if (!src)
                return null;

            var img_url = src;
            var format = nexacro._transImageBase64StringFormat(src, false, true);
            if (!format)
            {
                img_url = nexacro._getImageLocation(src, base_url);
            }

            if (img_url)
            {
                var retval;

                var imgnode = nexacro._ImgInfoCacheManager.loadinglist[img_url];
                if (imgnode)
                {
                    imgnode._keep = true;
                    imgnode._callbackList.push({ target: pThis, callback: callbackFn });
                    retval = nexacro._ImgInfoCacheList[img_url];
                    if (retval) nexacro._imgloadhandler_onload_forward(imgnode);
                }
                else
                {
                    //keep setting
                    imgnode = nexacro._ImgInfoCacheManager.get_imgnode(img_url);
                    imgnode._keep = true;
                    var imagesize = nexacro._ImgInfoCacheList[img_url];
                    if (imagesize)
                    {
                        imgnode.src = img_url;
                        callbackFn.call(pThis, img_url, imagesize.width, imagesize.height, imgnode);
                    }
                    else
                    {
                        nexacro._ImgInfoCacheManager.loadinglist[img_url] = imgnode;
                        imgnode._callbackList = [{ target: pThis, callback: callbackFn }];
                        imgnode._cacheurl = img_url;
                        nexacro._observeSysEvent(imgnode, "load", "onload", nexacro._imgloadhandler_onload_forward);
                        nexacro._observeSysEvent(imgnode, "error", "onerror", nexacro._imgloadhandler_onerror_forward);
                        imgnode.src = img_url;
                    }
                }
                return imgnode;
            }

            return null;
        };

        //==============================================================================
        // FileUpload / Download Utils
        //==============================================================================
        nexacro._IframeManager =
        {
            formlist: [],
            create_form: function (name, iframe_id, pThis)
            {
                var _doc = nexacro._managerFrameDoc;
                var node = _doc.createElement("FORM");
                node.id = name;
                node.name = name;
                node.enctype = "multipart/form-data";
                node.encoding = "multipart/form-data";
                node.method = "post";
                node.target = iframe_id;

                var uploadiframe = _doc.createElement("IFRAME");
                uploadiframe.name = node.target;
                uploadiframe.id = node.target;

                var str_title = nexacro._getErrorMessge("msg_accessibility_emptyframe");
                nexacro.__setDOMNode_Title(uploadiframe, str_title);

                var inputlist = [];

                nexacro._observeSysEvent(uploadiframe, "load", "onload", nexacro._fileinputhandler_onload_forward);
                this.formlist.push({ form: node, inputlist: inputlist, uploadiframe: uploadiframe });

                node.appendChild(uploadiframe);
                _doc.body.appendChild(node);
                return uploadiframe;
            },
            search_form: function (form_id)
            {
                var form = null;
                for (var i = 0; i < this.formlist.length; i++)
                {
                    if (this.formlist[i].form.id == form_id)
                    {
                        form = this.formlist[i].form;
                        return { idx: i, node: form };
                    }
                }
                return form;
            },
            search_iframe: function (form_target)
            {
                var iframe = null;
                for (var i = 0; i < this.formlist.length; i++)
                {
                    if (this.formlist[i].uploadiframe.id == form_target)
                    {
                        iframe = this.formlist[i].uploadiframe;
                        return { idx: i, node: iframe };
                    }
                }
                return iframe;
            },
            search_input: function (form, input_id)
            {
                var input = null;
                for (var j = 0; j < form.node.length; j++)
                {
                    if (form.node[j].name == input_id)
                    {
                        input = form.node[j];
                        return { idx: j, node: input };
                    }
                }
                return input;
            },

            get_node: function (id)
            {
                var form = this.search_form(id);
                var iframe = this.search_iframe(form.node.target);
                return iframe.node.contentWindow.document;
            },
            get_window: function (id)
            {
                var form = this.search_form(id);
                var iframe = this.search_iframe(form.node.target);
                return iframe.node.contentWindow;
            },
            get_doc: function (node)
            {
                var xmlDoc = node;
                if (node.XMLDocument)
                {
                    xmlDoc = node.XMLDocument;
                }
                return xmlDoc;
            }
        };

        nexacro._getXMLDocument = function (id)
        {
            var manager = nexacro._IframeManager;
            var node = null, xmldoc = null;
            if (manager)
            {
                node = manager.get_node(id);
                if (node)
                {
                    xmldoc = manager.get_doc(node);
                }
            }
            return xmldoc;
        };
        nexacro._getDataFromDOM = function (doc)
        {
            return doc.body.innerHTML;
        };

        nexacro._findclick = function (comp_name, item_comp_name, item_comp)
        {
            if (nexacro._OS == "iOS" && nexacro._isHybrid && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var params = {
                    multiselect: item_comp._input_node.multiple
                };
                var json = {
                    id: item_comp._id,
                    div: "FileUpload",
                    method: "find",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }
            else
            {
                var manager = nexacro._IframeManager;
                if (manager)
                {
                    var input = manager.search_input(manager.search_form(comp_name), item_comp_name);
                    if (input)
                        input.node.click();
                }
            }
        };

        nexacro._file_changed = nexacro._emptyFn;

        nexacro._setMultipleFile = function (comp_name, item_comp_name, flag)
        {
            var manager = nexacro._IframeManager;
            if (manager)
            {
                var input = manager.search_input(manager.search_form(comp_name), item_comp_name);
                if (input)
                    input.node.multiple = flag;
            }
        };

        nexacro._get_hidden_frame = function (form_id)
        {
            var manager = nexacro._IframeManager;
            return manager.search_form(form_id);
        };

        nexacro._create_hidden_frame = function (name, callback_fn, pThis, type)
        {
            // API변경하기 이전동작의 호환성 유지를 위해 매개변수 맞춤처리 추가.
            var form_id = new Date().valueOf().toString();
            if (typeof callback_fn != "function")
            {
                form_id = callback_fn;
                callback_fn = pThis;
                pThis = type;
                type = "fileupload";
            }

            if (type == "fileupload" || type == "import")
            {
                var iframe = nexacro._IframeManager.create_form(name, form_id, pThis);
                if (iframe)
                {
                    pThis._hidden_frame_handle = iframe;
                    iframe._callbackList = [{ target: pThis, callback: callback_fn }];
                }
            }

            if (nexacro._OS == "Android" && nexacro._isHybrid && nexacro._isHybrid())
            {
                if (type == "filedownload" || type == "export")
                {
                    pThis._hidden_frame_handle = pThis._id = nexacro.Device.makeID();
                    nexacro.Device._userCreatedObj[pThis._id] = pThis;

                    var jsonobj = {
                        id: pThis._id,
                        div: "FileDownload",
                        method: "constructor",
                        params: ""
                    };
                    var jsonstr = JSON.stringify(jsonobj);

                    nexacro.Device.exec(jsonstr);
                }
            }
            else if (nexacro._macOSWebView)
            {
                if (type == "filedownload")
                {
                    pThis._hidden_frame_handle = pThis._id = nexacro.Device.makeID();
                    nexacro.Device._userCreatedObj[pThis._id] = pThis;
                }
            }
        };

        nexacro._destroy_hidden_frame = function (form_id, pThis, type)
        {
            // API변경하기 이전동작의 호환성 유지를 위해 null처리 추가.
            if (type == "fileupload" || type == "import" || type == null)
            {
                var _doc = nexacro._managerFrameDoc;
                var manager = nexacro._IframeManager;
                var form = manager.search_form(form_id);
                var inputlist = manager.formlist[form.idx].inputlist;

                var inputnode = null;
                if (form && form.node)
                {
                    while (inputlist.length > 0)
                    {
                        inputnode = inputlist.pop();
                        delete inputnode._callbackList;
                        inputnode._callbackList = null;
                        nexacro.__removeDOMNode(form.node, inputnode);
                        //inputnode = null;
                    }
                    var ret_iframe = manager.formlist[form.idx].uploadiframe;
                    if (ret_iframe)
                    {
                        nexacro._stopSysObserving(ret_iframe, "load", "onload", nexacro._fileinputhandler_onload_forward);
                        delete ret_iframe._callbackList;
                        ret_iframe._callbackList = null;
                        nexacro.__removeDOMNode(form.node, ret_iframe);
                        //ret_iframe = null;
                    }
                    nexacro.__removeDOMNode(_doc.body, form.node);
                    manager.formlist.splice(form.idx, 1);
                    form.node = null;
                }
            }

            if (nexacro._OS == "Android" && nexacro._isHybrid && nexacro._isHybrid())
            {
                if (type == "filedownload" || type == "export")
                {
                    delete nexacro.Device._userCreatedObj[pThis._id];

                    var jsonobj = {
                        id: pThis._id,
                        div: "FileDownload",
                        method: "destroy",
                        params: ""
                    };
                    var jsonstr = JSON.stringify(jsonobj);
                    nexacro.Device.exec(jsonstr);
                }
            }
            else if (nexacro._macOSWebView)
            {
                if (type == "filedownload")
                {
                    delete nexacro.Device._userCreatedObj[pThis._id];
                }
            }
        };

        if (nexacro._Browser == "Safari")
        {
            nexacro._download = function (url, is_popup_frame, handle)
            {
                if (nexacro._macOSWebView)
                {
                    var urlWithId = "nexacrodownload-" + handle + "-" + url;
                    window.location.href = urlWithId;
                }
                else
                {
                    var download = window.open('');
                    download.location = url;
                    download.setTimeout('window.close();', 500);
                }
            };

            nexacro._downloadExport = nexacro._download;
        }
        else if ((nexacro._Browser == "MobileSafari" || nexacro._Browser == "Chrome") && nexacro._OS == "iOS")
        {
            nexacro._download = function (url, is_popup_frame)
            {
                if (nexacro._isHybrid())
                {
                    var params = {
                        url: url
                    };
                    var json = {
                        id: "",
                        div: "Browser",
                        method: "execBrowser",
                        params: params
                    };

                    var jsonstr = JSON.stringify(json);
                    nexacro.Device.exec(jsonstr);
                }
                else
                {
                    var bChange = false;

                    var version_arr = nexacro._OSVersion.split(".");
                    var major_version = version_arr[0];
                    var minor_version = version_arr[1];
                    var third_version = version_arr.length == 3 ? version_arr[2] : null;

                    if (major_version >= 8 && minor_version >= 1)
                    {
                        if (minor_version == 1)
                        {
                            if (third_version && third_version >= 3)
                            {
                                bChange = true;
                            }
                        }
                        else
                        {
                            bChange = true;
                        }
                    }

                    if (bChange)
                    {
                        var download = window.open('');
                        setTimeout(function () { download.location = url; }, 1200);
                    }
                    else
                    {
                        window.open(url);
                    }
                }
            };

            nexacro._downloadExport = nexacro._download;
        }
        else
        {
            nexacro._download = function (url, is_popup_frame, handle)
            {
                if (nexacro._OS == "Android" && nexacro._isHybrid && nexacro._isHybrid())
                {
                    var params = {
                        url: url
                    };

                    var jsonobj = {
                        id: handle,
                        div: "FileDownload",
                        method: "download",
                        params: params
                    };

                    var jsonstr = JSON.stringify(jsonobj);
                    nexacro.Device.exec(jsonstr);
                }
                else
                {
                    if (is_popup_frame)
                    {
                        window.open(url, "_self");
                    }
                    else
                    {
                        window.open(url);
                    }
                }
            };

            if (nexacro._Browser == "Chrome" || nexacro._Browser == "Gecko" || nexacro._Browser == "Opera" || nexacro._Browser == "Edge")
            {
                nexacro._downloadExport = function (url, is_popup_frame, evtTarget)
                {
                    if (nexacro._OS == "Android" && nexacro._isHybrid && nexacro._isHybrid())
                    {
                        nexacro._download(url, is_popup_frame);
                        return;
                    }

                    var index = url.lastIndexOf(".");
                    var extension;

                    const isDownloadOpeningSymbol = Symbol.for('isDownloadOpening');
                    const downloadstart = () =>
                    {
                        window[isDownloadOpeningSymbol] = true;
                    }
                    const downloadend = () =>
                    {
                        delete window[isDownloadOpeningSymbol];
                    }
                    if (index > 0)
                    {
                        extension = url.substr(index + 1);
                        if (extension == "xlsx" || extension == "xls")
                        {

                            // 전역 심볼 flag로 변경 (globalcontext or esm)
                            downloadstart();
                            nexacro._downloadTransfer(null, url, null, evtTarget, "GET");

                            setTimeout(function ()
                            {
                                downloadend();
                            }, 1000);

                            return;
                        }
                    }
                    window.open(url);
                };
            }
            else
            {
                nexacro._downloadExport = nexacro._download;
            }
        }

        nexacro._append_hidden_item = function (form_id, input_id, callback_fn, pThis, handle, multiselect)
        {
            var _doc = nexacro._managerFrameDoc;
            var manager = nexacro._IframeManager;
            var form = manager.search_form(form_id);
            var input = null;
            if (form && form.node)
            {
                var node = form.node;
                input = _doc.createElement("INPUT");
                input.type = "file";
                if (multiselect)
                {
                    input.multiple = multiselect;
                }
                input.name = input_id;

                input._callbackList = [{ target: pThis, callback: callback_fn }];
                manager.formlist[form.idx].inputlist.push(input);

                node.appendChild(input);
                nexacro._observeSysEvent(input, "change", "onchange", nexacro._fileinputhandler_onchange_forward);
            }
            pThis._input_node = input;
        };

        nexacro._remove_hidden_item = function (form_id, input_id)
        {
            var manager = nexacro._IframeManager;
            var form = manager.search_form(form_id);
            if (form && form.node)
            {
                var input = manager.search_input(form, input_id);
                if (input && input.node)
                {
                    nexacro._stopSysObserving(input.node, "change", "onchange", nexacro._fileinputhandler_onchange_forward);
                    nexacro.__removeDOMNode(form.node, input.node);
                    manager.formlist[form.idx].inputlist.splice(input.idx, 1);
                }
            }
        };

        nexacro._submit = function (form_id, action)
        {
            var manager = nexacro._IframeManager;
            var form = manager.search_form(form_id);
            if (form && form.node)
            {
                var node = form.node;
                node.action = action;
                node.submit();
            }
        };

        /* timeout시 uploadiframe의 onload이벤트 발생안되는 브라우져를 XMLHttpRequest로 처리 */
        nexacro._request_submit = function (form_id, action, pthis)
        {
            var manager = nexacro._IframeManager;
            var form = manager.search_form(form_id);
            if (form && form.node)
            {
                var node = form.node;
                var httprequest = nexacro.__createHttpRequest();

                var _handle = httprequest.handle;
                if (_handle && _handle.upload)
                {
                    var formdata = new FormData(node);

                    _handle._comp = pthis;
                    _handle.ontimeout = pthis._bindUploadDataHandler;
                    _handle.onreadystatechange = pthis._bindUploadDataHandler;
                    _handle.open("POST", action);
                    _handle.send(formdata);
                }
            }
        };

        nexacro._change_inputnode_name = function (node, name)
        {
            if (node)
                node.name = name;
        };

        nexacro._setImportCommand = function (comp_name, item_comp_name, item_comp, handle, value)
        {
            var manager = nexacro._IframeManager;
            if (manager)
            {
                var input = manager.search_input(manager.search_form(comp_name), item_comp_name);
                if (input)
                    input.node.value = value;
                else
                    return false;
            }
            return true;
        };

        nexacro._append_hidden_textitem = function (form_id, input_id)
        {
            var _doc;
            _doc = nexacro._managerFrameDoc;
            var manager = nexacro._IframeManager;
            var form = manager.search_form(form_id);
            var input = null;
            if (form && form.node)
            {
                var node = form.node;
                input = _doc.createElement("INPUT");
                input.type = "text";
                input.name = input_id;

                manager.formlist[form.idx].inputlist.push(input);

                node.appendChild(input);
            }
        };

        nexacro._fileinputhandler_onchange_forward = function (evt)
        {
            var target = evt.target;
            if (target)
            {
                var value = "";
                var value_arr = [];

                var node_value = target.value;
                var files = target.files;
                if (target.multiple)
                {
                    var fLen = files.length;
                    if (fLen > 0)
                    {
                        for (var j = 0; j < fLen; j++)
                        {
                            if (j > 0) value += ", ";
                            var file_name = files[j].name;
                            value_arr[j] = file_name;
                            value += file_name;
                        }
                    }
                }
                else
                {
                    value = value_arr[0] = node_value;
                }

                var callbacklist = target._callbackList;
                if (callbacklist)
                {
                    for (var i = 0, cnt = callbacklist.length; i < cnt; i++)
                    {
                        callbacklist[i].callback.call(callbacklist[i].target, value, files, value_arr);
                    }
                }
            }
        };
        nexacro._fileinputhandler_onload_forward = function (evt)
        {

            var target = evt.target;
            if (target)
            {
                var callbacklist = target._callbackList;
                if (callbacklist)
                {
                    for (var i = 0, cnt = callbacklist.length; i < cnt; i++)
                    {
                        callbacklist[i].callback.call(callbacklist[i].target, target);
                    }
                }
            }
        };

        //==============================================================================
        // FileDialog Utils
        //==============================================================================
        nexacro._createFileDialogHandle = function (target)
        {
            var callbackfn;
            var callback_onclose = function (target)
            {
                return function (e)
                {
                    var i, vfile, vfiles;
                    var path;
                    var reason = this.multiple ? 3 : 1;
                    var files = this.files;
                    if (files && files.length)
                    {
                        // FileObject 지원 브라우저.
                        for (i = 0, vfiles = []; i < files.length; i++)
                        {
                            vfile = new nexacro.VirtualFile("vfile" + (new Date().valueOf().toString()) + i, "", files[i]);

                            vfile._setFullPath("");
                            vfile._setPath("");
                            vfile._setFileName(files[i].name);

                            vfiles.push(vfile);
                        }

                        target.on_close(reason, path, vfiles);

                        // 필요시 브라우저 분리
                        nexacro._stopSysObserving(this, "change", "onchange", callbackfn);
                        this.value = "";
                        nexacro._observeSysEvent(this, "change", "onchange", callbackfn);
                    }
                    else
                    {
                        var input_handle = e.srcElement;
                        if (input_handle)
                        {
                            vfile = new nexacro.VirtualFile("vfile" + (new Date().valueOf().toString()), "", input_handle);

                            // VirtualFile property set
                            var filename = input_handle.value ? input_handle.value.substring(input_handle.value.lastIndexOf("\\") + 1) : "";

                            vfile._setFullPath("");
                            vfile._setPath("");
                            vfile._setFileName(filename);

                            vfiles = [vfile];
                        }

                        target.on_close(reason, path, vfiles);
                        target._handle = null;
                    }
                };
            };

            if ((nexacro._OS == "iOS" || nexacro._OS == "Android") && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                target._id = nexacro.Device.makeID();
                nexacro.Device._userCreatedObj[target._id] = target;

                var params = {
                    defaultextension: target.defaultextension,
                    filter: target.filter,
                    filterindex: target.filterindex
                };
                var json = {
                    id: target._id,
                    div: "FileDialog",
                    method: "constructor",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);

                return;
            }
            else
            {
                var input = document.createElement("input");
                input.id = input.name = "dialogfile" + new Date().valueOf().toString();
                input.type = "file";

                callbackfn = callback_onclose(target);
                nexacro._observeSysEvent(input, "change", "onchange", callbackfn);

                var _doc = nexacro._managerFrameDoc;
                _doc.body.appendChild(input);

                return input;
            }
        };

        nexacro._openFileDialogHandle = function (target, strTitle, constOpenMode, strInitialPath, strFileName, strDialogtype)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android") && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var params = {
                    strTitle: strTitle,
                    constOpenMode: constOpenMode,
                    strInitialPath: strInitialPath,
                    strFileName: strFileName,
                    defaultextension: target.defaultextension,
                    accept: target.accept,
                    filterindex: target.filterindex,
                    EnvironmentPath: target.EnvironmentPath
                };
                var jsonobj = {
                    id: target._id,
                    div: "FileDialog",
                    method: "open",
                    params: params
                };

                var jsonstr = JSON.stringify(jsonobj);
                nexacro.Device.exec(jsonstr);
            }
            else
            {
                if (target && target._handle)
                {
                    target._handle.multiple = (constOpenMode == 3) ? true : false;
                    target._handle.click();
                }
            }
        };

        nexacro._setFileDialogHandleAccept = function (target, v)
        {
            if (target && target._handle)
            {
                target._handle.accept = v;
            }
        };

        nexacro._destroyFileDialogHandle = function (target)
        {
            if (nexacro._OS == "iOS" && nexacro._isHybrid && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                delete nexacro.Device._userCreatedObj[target._id];

                var json = {
                    id: target._id,
                    div: "FileDialog",
                    method: "destroy",
                    params: ""
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }
        };

        nexacro._setFileDialogHandleAsync = nexacro._emptyFn;
        nexacro._setFileDialogHandleDefaultExtension = nexacro._emptyFn;
        nexacro._setFileDialogHandleFilter = nexacro._emptyFn;
        nexacro._setFileDialogHandleFilterIndex = nexacro._emptyFn;

        //==============================================================================
        // VirtualFile Utils
        //==============================================================================
        nexacro._createVirtualFileHandle = function (target, file)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                target._id = nexacro.Device.makeID();
                nexacro.Device._userCreatedObj[target._id] = target;

                var params = {
                    strFilename: target.filename,
                    fullpath: target.fullpath,
                    path: target.path
                };
                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "constructor",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }
            else
            {
                if (file)
                    return file;
            }

            return true;
        };
        nexacro._destroyVirtualFileHandle = function (target)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                delete nexacro.Device._userCreatedObj[target._id];

                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "destroy",
                    params: ""
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }

            return true;
        };

        nexacro._openVirtualFileHandle = function (target, strFileName, nConstOptions)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var params = {
                    strFilename: target.fullpath,
                    nOptions: nConstOptions
                };
                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "open",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);

                return true;
            }
            else
            {
                return target.on_success(1, "", "", null, 0, true);
            }
        };
        nexacro._closeVirtualFileHandle = function (target)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "close",
                    params: ""
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }
            else
            {
                return target.on_success(2, "", "", null, 0, true);
            }
        };
        nexacro._readVirtualFileHandle = function (target, nLength, strCharset)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var params = {
                    nLength: nLength,
                    strCharset: strCharset
                };
                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "read",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }

            return true;
        };
        nexacro._readlineVirtualFileHandle = function (target, strDelimeter, strCharset)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                if (/[\r\n\"\t]/.test(strDelimeter))
                {
                    strDelimeter = strDelimeter.replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(/\"/g, "\\\"");
                }

                var params = {
                    strDelimeter: strDelimeter,
                    strCharset: strCharset
                };
                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "readLine",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }

            return true;
        };
        nexacro._seekVirtualFileHandle = function (target, nOffset, nOption)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var params = {
                    nOffset: nOffset,
                    nOption: nOption
                };
                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "seek",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }

            return true;
        };
        nexacro._writeVirtualFileHandle = function (target, varData, strCharset)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var params = {
                    varData: varData,
                    strCharset: strCharset
                };
                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "write",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }

            return true;
        };

        nexacro._removeVirtualFileHandle = function (target, strDeletePath)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var params = {
                    strFilePath: strDeletePath
                };
                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "remove",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }

            return true;
        };
        nexacro._copyVirtualFileHandle = function (target, path, destpath)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var params = {
                    path: path,
                    destpath: destpath
                };
                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "copy",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }

            return true;
        };
        nexacro._renameVirtualFileHandle = function (target, path, destpath)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var params = {
                    path: path,
                    destpath: destpath
                };
                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "rename",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                var ret = nexacro.Device.exec(jsonstr);
            }

            return true;
        };

        //only windows 
        nexacro._setVirtualFileHandleAsync = function (target, async)
        {
            if (nexacro._OS == "Windows" && nexacro._isHybrid())
            {
                var params = {
                    async: async
                };
                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "async",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                var ret = nexacro.Device.exec(jsonstr);

                return nexacro._toBoolean(ret);
            }
        };

        nexacro._getFileListVirtualFileHandle = function (target, strPath, strSearchExpr, nConstOptions)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                strSearchExpr = nexacro.base64Encode(strSearchExpr);

                var params = {
                    strPath: strPath,
                    strSearchExpr: strSearchExpr,
                    constOption: nConstOptions
                };
                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "getFileList",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }

            return true;
        };
        nexacro._getFileSizeVirtualFileHandle = function (target, strfullpath)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var params = {
                    strPath: strfullpath
                };
                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "getFileSize",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }
            else
            {
                if (target._handle)
                {
                    target.on_success(9, "", "", null, target._handle.size, true);
                    return true;
                }
                else
                {
                    target.on_error(-1, "ObjectError");
                    return false;
                }
            }
        };

        nexacro._isExistVirtualFileHandle = function (target, isExistPath)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var params = {
                    strPath: isExistPath
                };
                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "isExist",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }

            return true;
        };

        nexacro._createDirectoryVirtualFileHandle = function (target, strPath, bAllCreate)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var params = {
                    strPath: strPath,
                    bAllCreate: bAllCreate
                };
                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "createDirectory",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }

            return true;
        };
        nexacro._deleteDirectoryVirtualFileHandle = function (target, strPath, bAllChild)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var params = {
                    strPath: strPath,
                    bAllChild: bAllChild
                };
                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "deleteDirectory",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }

            return true;
        };
        nexacro._renameDirectoryVirtualFileHandle = function (target, strPath, strNewName)
        {
            if ((nexacro._OS == "iOS" || nexacro._OS == "Android" || nexacro._OS == "Windows")
                && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var params = {
                    strPath: strPath,
                    strNewName: strNewName
                };

                var json = {
                    id: target._id,
                    div: "VirtualFile",
                    method: "renameDirectory",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }
        };

        nexacro._getFileAttributeList = function (strFilelist)
        {
            var obj = strFilelist ? nexacro._executeGlobalEvalStr('(' + strFilelist + ')') : "";
            if (obj)
            {
                var fileattrlist = obj.fileattrlist;
                var temparr = [];

                for (var i = 0, len = fileattrlist.length; i < len; i++)
                {
                    temparr.push(new nexacro._FileAttribute(fileattrlist[i]));
                }

                return temparr;
            }
            else
            {
                return "";
            }
        };

        //==============================================================================
        // Drag&Drop Utils
        //==============================================================================
        nexacro._convertVirtualFileList = function (filelist)
        {
            if (!filelist || filelist.length === 0)
            {
                return null;
            }

            var virtualFiles = [];
            var fileCount = filelist.length;
            for (var i = 0; i < fileCount; i++)
            {
                var originalFile = filelist[i];
                var timestamp = new Date().valueOf().toString();
                var uniqueId = "vfile" + timestamp + i;

                var virtualFile = new nexacro.VirtualFile(uniqueId, "", originalFile);

                if (nexacro._macOSWebView)
                {
                    var params = {
                        filename: originalFile.name,
                    };
                    var requestParams = {
                        id: "0000",
                        div: "FileDrop",
                        method: "getRelativePath",
                        params: params
                    };
                    var jsonString = JSON.stringify(requestParams);
                    var relativePath = nexacro.Device.exec(jsonString, true);

                    virtualFile._setFullPath(relativePath + originalFile.name);
                    virtualFile._setPath(relativePath);
                }

                virtualFile._setFileName(originalFile.name);

                virtualFiles.push(virtualFile);
            }

            return virtualFiles;
        };

        //==============================================================================
        // Transfer Utils
        //==============================================================================
        nexacro._uploadTransfer = function (filelist, postdatalist, url, index, evttarget)
        {
            var i, len;
            var transferitems = {};
            var callback_onload;
            for (i = 0, len = filelist.length; i < len; i++)
            {
                if (filelist[i]._handle)
                {
                    if ((nexacro._OS == "iOS" || nexacro._OS == "Android") && nexacro._isHybrid && nexacro._isHybrid() || nexacro._macOSWebView)
                    {
                        transferitems[filelist._idArray[i]] = filelist[i];
                    }
                    else
                    {
                        transferitems[filelist._idArray[i]] = filelist[i]._handle;
                    }
                }
            }

            var postdataitems = {};
            for (i = 0, len = postdatalist.length; i < len; i++)
            {
                postdataitems[postdatalist._idArray[i]] = postdatalist[i];
            }

            if (nexacro._OS == "iOS" && nexacro._isHybrid && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                callback_onload = function ()
                {
                    return function (status, data, url, errcode, httpcode, loaded, total)
                    {
                        if (status < 0)
                        {
                            evttarget.on_error(9901, "", httpcode, url, index);
                        }
                        else if (status == 4)
                        {
                            evttarget.on_progress(loaded, total, index);
                        }
                        else
                        {
                            data = data.trimLeft();
                            var data_type = data.slice(0, 5).toUpperCase();

                            if (data_type.indexOf("<?XML") == 0) data_type = "XML";
                            if (data_type.indexOf("SSV") == 0) data_type = "SSV";
                            if (data_type.indexOf("{") == 0) data_type = "JSON";

                            if (data_type == "XML")
                            {
                                data = nexacro._parseXMLDocument(data);
                            }

                            if (nexacro._Deserializer[data_type])
                            {
                                data = nexacro._Deserializer[data_type](data);
                            }

                            evttarget.on_load(data, url, index);
                        }
                    };
                };

                nexacro._uploadTransferXHR(transferitems, postdataitems, url, callback_onload());
            }
            else if (nexacro._OS == "Android" && nexacro._isHybrid && nexacro._isHybrid())
            {
                var FILE_SEPERATOR = "|";
                var POSTDATA_SEPERATOR = "&";

                var filelist = transferitems;
                var postdatalist = postdataitems;

                var filelistkeys = Object.keys(filelist);
                var i, len, fileliststr, postdatastr;
                for (i = 0, len = filelistkeys.length, fileliststr = ""; i < len; i++)
                {
                    fileliststr += filelist[filelistkeys[i]].fullpath;
                    fileliststr += (i < len - 1) ? FILE_SEPERATOR : "";
                }

                var postdatalistkeys = Object.keys(postdatalist);
                for (i = 0, len = postdatalistkeys.length, postdatastr = ""; i < len; i++)
                {
                    postdatastr += postdatalistkeys[i];
                    postdatastr += "=";
                    postdatastr += postdatalist[postdatalistkeys[i]];
                    postdatastr += (i < len - 1) ? POSTDATA_SEPERATOR : "";
                }

                var params = {
                    url: url,
                    postdata: postdatastr,
                    filelist: fileliststr,
                    filelistkeys: filelistkeys
                };
                var jsonobj = {
                    id: evttarget._id,
                    div: "FileUpTransfer",
                    method: "fileUpload",
                    params: params
                };

                var jsonstr = JSON.stringify(jsonobj);
                nexacro.Device.exec(jsonstr);
            }
            else
            {
                callback_onload = function ()
                {
                    var checkStatus = function (ajax)
                    {
                        var status = ajax.readyState;
                        if (status == 4)
                        {
                            if (ajax.status === 0)
                            {
                                return 0;
                            }
                            else
                            {
                                var ret = ajax.status || 200;

                                return (ret >= 200 && ret < 300) ? ret : -ret;
                            }
                        }
                        else
                        {
                            return status === 0 ? 1 : status;
                        }
                    };

                    return function (e)
                    {
                        if (e instanceof Event)
                        {
                            if (e.type == "progress")
                            {
                                evttarget.on_progress(e.loaded, e.total, index);
                            }
                            else
                            {
                                var ajax = e.srcElement || e.target;
                                var status = evttarget._aborted ? -1 : checkStatus(ajax);
                                var data, data_type;
                                if (status > 0)
                                {
                                    if (status >= 4)
                                    {
                                        // XHR success
                                        if (nexacro._isSameOrigin(url, nexacro._project_absolutepath))
                                        {
                                            // non cors
                                            data = nexacro.trimLeft(ajax.response);
                                            data_type = data.slice(0, 5).toUpperCase();

                                            if (data_type.indexOf("<?XML") == 0) data_type = "XML";
                                            if (data_type.indexOf("SSV") == 0) data_type = "SSV";
                                            if (data_type.indexOf("{") == 0) data_type = "JSON";

                                            if (data_type == "XML")
                                            {
                                                data = ajax.responseXML ? ajax.responseXML : nexacro._parseXMLDocument(data);
                                            }

                                            if (nexacro._Deserializer[data_type])
                                            {
                                                data = nexacro._Deserializer[data_type](data);
                                                evttarget.on_load(data, url, index);
                                            }
                                        }
                                        else
                                        {
                                            // cors
                                            var _doc = nexacro._managerFrameDoc;
                                            if (_doc)
                                            {
                                                data = nexacro.trimLeft(ajax.response);
                                                data_type = data.slice(0, 5).toUpperCase();

                                                if (data_type.indexOf("<?XML") == 0) data_type = "XML";
                                                if (data_type.indexOf("SSV") == 0) data_type = "SSV";
                                                if (data_type.indexOf("{") == 0) data_type = "JSON";

                                                if (data_type == "XML")
                                                {
                                                    data = ajax.responseXML ? ajax.responseXML : nexacro._parseXMLDocument(data);
                                                }

                                                if (nexacro._Deserializer[data_type])
                                                {
                                                    data = nexacro._Deserializer[data_type](data);
                                                    evttarget.on_load(data, url, index);
                                                }
                                                else
                                                {
                                                    // cors message 형식 response 처리
                                                    var win = evttarget._getForm()._getWindow();
                                                    if (win)
                                                    {
                                                        var frame = _doc.createElement("IFRAME");
                                                        _doc.body.appendChild(frame);

                                                        var frame_win = frame.contentWindow;
                                                        var frame_doc = frame.contentDocument;
                                                        if (frame_win && frame_win.postMessage && frame_doc)
                                                        {
                                                            // set postmessage que
                                                            data = { id: evttarget.id, userdata: [url, index], target: evttarget, func: evttarget.on_message };
                                                            win._postmsg_data_que.push(data);

                                                            frame_doc.open();
                                                            frame_doc.write(ajax.response);
                                                            frame_doc.close();

                                                            // iframe postmessage
                                                            nexacro._postMessage(evttarget.id + "--boundary--", frame_win, null, '*');
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    // XHR error
                                    if (e.type == "error" || status == -404)
                                    {
                                        evttarget._aborted = true;
                                        evttarget.on_error(9901, "", ajax.status, url, index);

                                        ajax.abort();
                                        return;
                                    }
                                    else if (e.type == "abort")
                                    {
                                        if (evttarget._user_aborted)
                                            evttarget.on_error(9901, "", ajax.status, url, index);

                                        evttarget._handle = null;
                                        return;
                                    }
                                    else if (e.type == "load")
                                    {
                                        evttarget.on_error(9901, "", ajax.status, url, index);
                                        return;
                                    }
                                    else if (e.type == "timeout")
                                    {
                                        return;
                                    }
                                }
                            }
                        }
                        else
                        {
                            var errmsg = "";
                            if (e instanceof DOMException)
                            {
                                errmsg = e.code + " " + e.message;
                            }
                            else
                            {
                                errmsg = e;
                            }

                            evttarget.on_error(9901, errmsg, 0, url, index);
                        }
                    };
                };

                nexacro._uploadTransferXHR(transferitems, postdataitems, url, callback_onload());
            }
        };

        nexacro._uploadTransferSubmit = function (filelist, postdatalist, url, callback_load, id)
        {
            var _doc = nexacro._managerFrameDoc;
            if (_doc)
            {
                // transfer 하나에 form + iframe 한개
                var frame, i;
                var form = _doc.getElementById(id);

                if (!form)
                {
                    var rand_id = new Date().valueOf().toString();
                    form = _doc.createElement("FORM");
                    form.id = id;
                    form.name = id;
                    form.enctype = "multipart/form-data";
                    form.encoding = "multipart/form-data";
                    form.method = "POST";
                    form.target = rand_id;

                    if (nexacro._BrowserVersion < 9)
                    {
                        frame = _doc.createElement("<IFRAME id='" + rand_id + "' name='" + rand_id + "'/>");
                    }
                    else
                    {
                        frame = _doc.createElement("IFRAME");
                        frame.id = frame.name = rand_id;
                    }

                    form.appendChild(frame);
                    _doc.body.appendChild(form);

                    nexacro._observeSysEvent(frame, "load", "onload", callback_load);
                }

                for (i in filelist)
                {
                    if (filelist[i] && filelist[i].parentElement && filelist[i].parentElement.name != form.name)
                    {
                        form.appendChild(filelist[i]);
                    }
                }
                for (i in postdatalist)
                {
                    if (postdatalist[i] && postdatalist[i].parentElement && postdatalist[i].parentElement.name != form.name)
                    {
                        var node = _doc.getElementById(i);
                        if (!node)
                        {
                            node = _doc.createElement("input");
                            node.type = "hidden";
                            node.name = node.id = i;
                            node.value = postdatalist[i];

                            form.appendChild(node);
                        }
                    }
                }

                form.action = url;
                form.submit();
            }
        };

        nexacro._uploadTransferXHR = function (filelist, postdatalist, url, callbackFn)
        {
            var ajax;
            if (nexacro._OS == "iOS" && nexacro._isHybrid && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                ajax = nexacro.__createFakeHttpRequest(4, false, true); // file upload mode
                ajax = ajax.handle;
                ajax._filelist = filelist;
                ajax._postdatalist = postdatalist;
            }
            else
            {
                ajax = new XMLHttpRequest();
            }

            if (!window.FormData || !ajax.upload)
            {
                return;
            }

            var method = "POST";
            var async = true;

            var formdata = new FormData();
            for (var i in filelist)
            {
                formdata.append(i, filelist[i]);
            }
            for (i in postdatalist)
            {
                formdata.append(i, postdatalist[i]);
            }

            try
            {
                // xhr open
                ajax.open(method, url, async);

                // xhr event
                ajax.onreadystatechange = callbackFn;
                ajax.onerror = callbackFn;
                ajax.onabort = callbackFn;

                ajax.upload.onprogress = callbackFn;

                // xhr send
                ajax.send(formdata);
            }
            catch (e)
            {
                callbackFn(e);
            }
        };

        nexacro._downloadTransfer = function (postdatalist, downloadurl, saveurl, evttarget, method)
        {
            // HTML은 saveurl 미지원
            var callback_onload = function ()
            {
                // download jsp 응답 지원시 onload 필요.
                return null;
            };

            if ((nexacro._OS == "iOS" || nexacro._OS == "Android") && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var POSTDATA_SEPERATOR = "&";

                //var postdatalistkeys = Object ? Object.keys(postdatalist) : "";
                var postdatalistkeys = Object.keys(postdatalist);
                for (var i = 0, len = postdatalistkeys.length, postdatastr = ""; i < len; i++)
                {
                    postdatastr += postdatalistkeys[i];
                    postdatastr += "=";
                    postdatastr += postdatalist[postdatalistkeys[i]];
                    postdatastr += (i < len - 1) ? POSTDATA_SEPERATOR : "";
                }

                var jsonstr;
                if (nexacro._OS == "iOS") 
                {
                    var params = {
                        url: downloadurl,
                        postdatalist: postdatastr
                    };
                    var json = {
                        id: "",
                        div: "Browser",
                        method: "execBrowser",
                        params: params
                    };
                    jsonstr = JSON.stringify(json);
                }
                else
                {
                    var params = {
                        url: downloadurl,
                        postdatalist: postdatastr
                    };
                    var jsonobj = {
                        id: evttarget._id,
                        div: "FileDownTransfer",
                        method: "download",
                        params: params
                    };
                    jsonstr = JSON.stringify(jsonobj);
                }

                nexacro.Device.exec(jsonstr);
            }
            else
            {
                nexacro._downloadTransferSubmit(postdatalist, downloadurl, callback_onload(), evttarget.id, method);
            }
        };

        nexacro._downloadTransferSubmit = function (postdatalist, url, callback_load, id, method)
        {
            var _doc = nexacro._managerFrameDoc;
            if (_doc)
            {
                // iframe 한개
                // transfer 의 filelist만큼의 폼.
                var frame;
                var form = _doc.getElementById(id + url);
                if (!form)
                {
                    var rand_id = new Date().valueOf().toString();

                    form = _doc.createElement("FORM");
                    form.id = form.name = id + url;
                    if (method)
                        form.method = method;
                    else
                        form.method = "POST";
                    if (nexacro._OS == "iOS")
                    {
                        form.target = "_blank";
                    }
                    else
                    {
                        form.target = rand_id;
                    }

                    if (nexacro._BrowserVersion < 9)
                    {
                        frame = _doc.createElement("<IFRAME id='" + rand_id + "' name='" + rand_id + "'/>");
                    }
                    else
                    {
                        frame = _doc.createElement("IFRAME");
                        frame.id = frame.name = rand_id;
                    }

                    form.appendChild(frame);
                    _doc.body.appendChild(form);

                    nexacro._observeSysEvent(frame, "load", "onload", callback_load);
                }

                var existingPostDataList = new Map();
                for (var element of form.elements)
                {
                    if (element.tagName == "IFRAME")
                        continue;

                    existingPostDataList.set(element.name, element);
                }

                for (var i in postdatalist)
                {
                    var node = existingPostDataList.get(i);
                    if (node)
                    {
                        if (node.value != postdatalist[i])
                            node.value = postdatalist[i];

                        existingPostDataList.delete(i);
                    }
                    else
                    {
                        node = _doc.createElement("input");
                        node.type = "hidden";
                        node.name = node.id = i;
                        node.value = postdatalist[i];

                        form.appendChild(node);
                    }
                }

                for (var element of existingPostDataList)
                {
                    form.removeChild(element[1]);
                }

                form.action = nexacro._encodeURI(url);
                form.submit();
            }
        };

        nexacro._isEqualTransferFile = function (orgVFile, targetVFile)
        {
            if (!orgVFile || !targetVFile)
                return false;

            var org_handle = orgVFile._handle;
            var trg_handle = targetVFile._handle;

            if (!org_handle || !trg_handle)
                return false;

            var org_symbol = org_handle.toString();
            var trg_symbol = trg_handle.toString();
            if (org_symbol == "[object File]" && trg_symbol == "[object File]")
            {
                // File이 같을려면 name && size && type && lastModified  이 모두 같아야함
                if ((org_handle.name == trg_handle.name) &&
                    (org_handle.size == trg_handle.size) &&
                    (org_handle.type == trg_handle.type) &&
                    (org_handle.lastModified == trg_handle.lastModified))
                    return true;
            }
            else
            {
                if (org_handle.tagName == "INPUT" && trg_handle.tagName == "INPUT")
                {
                    if (org_handle.value == trg_handle.value)
                        return true;
                }
                else if (nexacro._OS == "iOS" && nexacro._isHybrid && nexacro._isHybrid())
                {
                    if (orgVFile.fullpath == targetVFile.fullpath)
                        return true;
                }
            }

            return false;
        };

        //==============================================================================
        // showModal Utils
        //==============================================================================
        nexacro._showModalSync = nexacro._emptyFn;
        nexacro._showModalWindow = nexacro._emptyFn;
        if (globalThis.chrome && globalThis.chrome.webview)
        {
            nexacro._showModalSync = function (childframe, str_id, _parent_frame, arr_arg, opener)
            {
                if (childframe != null)
                {
                    return childframe._showModalSync(str_id, _parent_frame, arr_arg, opener);
                }
            };

            nexacro._showModalWindow = function (childframe, str_id, parent_frame, arr_arg, opener)
            {
                if (childframe)
                    return childframe._showModalWindow(str_id, parent_frame, arr_arg, opener);
            };
        }

        //==============================================================================
        // Script Load Utils
        //==============================================================================
        // __createHttpRequest (html only)
        nexacro.__createHttpRequest = function (win_handle)
        {
            var _ajax = {};
            //_ajax._destroy = nexacro._emptyFn;
            _ajax._destroy = function ()
            {
                if (this.handle)
                {
                    if (this._reader)
                    {
                        delete this._reader;
                        this._reader = null;
                    }

                    delete this.handle.responseText;
                    delete this.handle['onreadystatechange'];
                    this.handle.onreadystatechange = null;
                    delete this.handle;
                    this.handle = null;
                }
            };

            if (win_handle)
                _ajax.handle = new win_handle.XMLHttpRequest();
            else
                _ajax.handle = new XMLHttpRequest();

            return _ajax;
        };

        nexacro.__createFakeHttpRequest = function (ndatatype, compress, async, reqtype)
        {
            var _ajax = {};
            _ajax._destroy = function () { if (this.handle) this.handle.destory(); };
            _ajax.handle = new nexacro.FakeXMLHttpRequest("FakeXMLHttpRequest", this, ndatatype, compress, async, reqtype);
            return _ajax;
        };

        nexacro.__checkAjaxSuccess = function (ajax)
        {
            var ajax_handle = ajax.handle;
            if (ajax_handle.readyState == 4)
            {
                var statusNum = ajax_handle.status || 200;
                return (statusNum >= 200 && statusNum < 300) ? statusNum : -statusNum;
            }
            //ajax_handle = null;
            return 0;
        };
        nexacro.__checkAjaxStatus = function (ajax)
        {
            var ajax_handle = ajax.handle;
            var ajaxstatus = ajax_handle.readyState;
            if (ajaxstatus == 4)
            {
                // File Protocol일땐 안타도록.
                if (ajax._protocol != 2)
                {
                    //chrome, ff
                    if (ajax_handle.status === 0 && ajax_handle.statusText === "")
                    {
                        return 0;
                    }
                }

                var statusNum = ajax_handle.status || 200;
                //ajax_handle = null;
                return (statusNum >= 200 && statusNum < 300) ? statusNum : -statusNum;
            }
            else
            {
                //ajax_handle = null;
                return ajaxstatus === 0 ? 1 : ajaxstatus;
            }
        };


        nexacro.__bindLoadModuleHandler = function (_ajax, pthis)
        {
            return function (e)
            {
                if (!_ajax || !_ajax.handle) return;
                var ajax_handle = _ajax.handle;
                var is_abort = _ajax.aborted;
                var status = (is_abort ? -1 : nexacro.__checkAjaxStatus(_ajax));
                var cookie = "";
                if (status > 0)
                {
                    if (status >= 4)
                    {
                        if (pthis.context)
                        {
                            if (pthis.context._is_component)
                                cookie = pthis.context._getWindow()._doc.cookie;
                            else
                                cookie = document ? document.cookie : null;
                        }
                        var data;
                        if (ajax_handle.responseType == "arraybuffer")
                        {
                            const inbuf = ajax_handle.response;
                            let arr = nexacro.lzssDecode(inbuf);
                            if (!arr)
                            {
                                arr = new Uint8Array(inbuf);
                            }

                            let encoding = "utf-8";
                            if (arr[0] == 0xEF && arr[1] == 0xBB && arr[2] == 0xBF)
                            {
                                encoding = "utf-8";
                            }
                            else if (arr[0] == 0xFE && arr[1] == 0xFF)
                            {
                                encoding = "utf-16be";
                            }
                            else if (arr[0] == 0xFF && arr[1] == 0xFE)
                            {
                                encoding = "utf-16le";
                            }
                            let decoder = new TextDecoder(encoding);
                            data = decoder.decode(arr);
                        }
                        else
                        {
                            data = ajax_handle.responseText;
                        }

                        var last_modified = ajax_handle.getResponseHeader("Last-Modified");

                        pthis.on_load_module(data, cookie, last_modified);
                        _ajax._destroy();
                        _ajax = null;
                        pthis = null;
                    }
                }
                else
                {
                    if (status == -304)     //Not Modified
                    {
                        if (pthis.context)
                        {
                            if (pthis.context._is_component)
                                cookie = pthis.context._getWindow()._doc.cookie;
                            else
                                cookie = document ? document.cookie : null;
                        }

                        pthis.bcache = false;
                        var m_cache = nexacro._CacheList[pthis.path];
                        pthis.on_load_module(m_cache.data, cookie, m_cache.last_modified);
                        _ajax._destroy();
                        _ajax = null;
                        pthis = null;
                    }
                    else
                    {
                        var locationurl = "", extramsg = "";
                        var ret;

                        if (e)
                        {
                            if (e.type == "timeout" || status == -408 || status == -504)
                            {
                                if (_ajax._httpretry >= 1)
                                {
                                    ret = nexacro.__retryCommunication(_ajax, pthis);
                                    if (ret !== false)
                                        return;
                                }

                                if (status == -408 || status == -504)
                                    pthis.on_error(-1, "comm_fail_loaddetail", -status, locationurl, extramsg);
                                else
                                    pthis.on_error(-1, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.client_timeout, locationurl, extramsg);

                                _ajax._destroy();
                                _ajax = null;
                                pthis = null;
                            }
                            else if (e.type == "error")
                            {
                                // readystatchange가 발생(네트워크 끊겼을때)
                                //ajax.onerror bind 하여 0x2efd 처리.
                                if (_ajax._httpretry >= 1)
                                {
                                    ret = nexacro.__retryCommunication(_ajax, pthis);
                                    if (ret !== false)
                                        return;
                                }

                                pthis.on_error(-1, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.failunknown, locationurl, extramsg);

                                _ajax.aborted = true;
                                ajax_handle.abort();
                                _ajax._destroy();
                                _ajax = null;
                                pthis = null;
                                //ajax_handle = null;
                                return;
                            }
                            else if (e.type == "load")
                            {
                                pthis.on_error(-1, "comm_fail_loaddetail", -status, locationurl, extramsg);
                                _ajax._destroy();
                                _ajax = null;
                                pthis = null;
                            }
                        }
                        else
                        {
                            pthis.on_error(-1, "comm_fail_loaddetail", -status, locationurl, extramsg);
                            _ajax._destroy();
                            _ajax = null;
                            pthis = null;
                        }
                    }

                }
                //ajax_handle = null;
            };
        };

        nexacro.__bindLoadTextHandler = function (_ajax, pthis)
        {
            return function (e)
            {
                if (!_ajax || !_ajax.handle) return;
                var ajax_handle = _ajax.handle;
                var is_abort = _ajax.aborted;
                var status = (is_abort ? -1 : nexacro.__checkAjaxStatus(_ajax));
                var cookie = "";

                if (status > 0)
                {
                    if (status >= 4)
                    {
                        if (pthis.context)
                        {
                            if (pthis.context._is_component)
                                cookie = pthis.context._getWindow()._doc.cookie;
                            else
                                cookie = document ? document.cookie : null;
                        }
                        var data = ajax_handle.responseText;
                        var last_modified = ajax_handle.getResponseHeader("Last-Modified");
                        pthis.on_load_text(data, cookie, last_modified);
                        _ajax._destroy();
                        _ajax = null;
                        pthis = null;
                    }
                }
                else
                {
                    if (_ajax._user_aborted)
                    {
                        pthis.on_error(0, "comm_cancel_byuser", nexacro._CommunicationStatusTable.cancel_byuser);
                        _ajax._destroy();
                        _ajax = null;
                        pthis = null;
                    }
                    else if (status == -304)     //Not Modified
                    {
                        if (pthis.context)
                        {
                            if (pthis.context._is_component)
                                cookie = pthis.context._getWindow()._doc.cookie;
                            else
                                cookie = document ? document.cookie : null;
                        }

                        pthis.bcache = false;
                        var m_cache = nexacro._CacheList[pthis.path];
                        pthis.on_load_text(m_cache.data, cookie, m_cache.last_modified);
                        _ajax._destroy();
                        _ajax = null;
                        pthis = null;
                    }
                    else
                    {
                        var locationurl = "", extramsg = "";
                        var ret;
                        if (e)
                        {
                            if (e.type == "timeout" || status == -408 || status == -504)
                            {
                                if (_ajax._httpretry >= 1)
                                {
                                    ret = nexacro.__retryCommunication(_ajax, pthis);
                                    if (ret !== false)
                                        return;
                                }

                                if (status == -408 || status == -504)
                                    pthis.on_error(-1, "comm_fail_loaddetail", -status, locationurl, extramsg);
                                else
                                    pthis.on_error(-1, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.client_timeout, locationurl, extramsg);
                                _ajax._destroy();
                                _ajax = null;
                                pthis = null;
                            }
                            else if (e.type == "error")
                            {
                                // readystatchange가 발생(네트워크 끊겼을때)
                                //ajax.onerror bind 하여 0x2efd 처리.
                                if (_ajax._httpretry >= 1)
                                {
                                    ret = nexacro.__retryCommunication(_ajax, pthis);
                                    if (ret !== false)
                                        return;
                                }

                                pthis.on_error(-1, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.failunknown, locationurl, extramsg);

                                _ajax.aborted = true;
                                ajax_handle.abort();
                                _ajax._destroy();
                                _ajax = null;
                                pthis = null;
                                //ajax_handle = null;
                                return;
                            }
                            else if (e.type == "load")
                            {
                                pthis.on_error(-1, "comm_fail_loaddetail", -status, locationurl, extramsg);
                                _ajax._destroy();
                                _ajax = null;
                                pthis = null;
                            }
                        }
                        else
                        {
                            pthis.on_error(-1, "comm_fail_loaddetail", -status, locationurl, extramsg);
                            _ajax._destroy();
                            _ajax = null;
                            pthis = null;
                        }
                    }


                }
                //ajax_handle = null;
            };
        };

        if (nexacro._Browser == "MobileSafari" || nexacro._Browser == "Safari")
        {
            nexacro.__bindLoadCSSHandler = function (_ajax, pthis)
            {
                if (!_ajax || !_ajax.handle) return;
                if (_ajax.aborted)
                {
                    if (_ajax._user_aborted)
                        pthis.on_error(0, "comm_cancel_byuser", nexacro._CommunicationStatusTable.cancel_byuser);
                }

                var stylesheets = document.styleSheets;
                var stylesheetcnt = stylesheets.length;
                var path = pthis.path.replace("./", "");  //stylesheets[i].href 가 fullpath
                if (_ajax._stylesheetcnt != stylesheetcnt)
                {
                    if (_ajax._async)
                    {
                        _ajax._async = false;
                        setTimeout(function () { nexacro.__bindLoadCSSHandler(_ajax, pthis); }, 10);
                    }
                    else
                    {
                        for (var i = 0; i < stylesheetcnt; i++)
                        {
                            if (stylesheets[i].href && stylesheets[i].href.indexOf(path) >= 0) //
                            {
                                if (nexacro.Device && nexacro.Device._use_wkwebview || nexacro._macOSWebView)
                                {
                                    pthis.on_load_text("", "", "");
                                }
                                else
                                {
                                    var cssrules = stylesheets[i].cssRules ? stylesheets[i].cssRules : stylesheets[i].rules;
                                    if (cssrules && cssrules.length > 0)
                                        pthis.on_load_text("", "", "");
                                    else
                                        pthis.on_error(-1, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.failunknown, pthis.path, "");
                                }
                                break;
                            }
                        }
                    }

                }
                else
                {
                    setTimeout(function () { nexacro.__bindLoadCSSHandler(_ajax, pthis); }, 10);
                }
                return;
            };
        }
        else
        {
            nexacro.__bindLoadCSSHandler = function (_ajax, pthis)
            {
                return function (e)
                {
                    if (!_ajax || !_ajax.handle) return;
                    if (_ajax.aborted)
                    {
                        if (_ajax._user_aborted)
                            pthis.on_error(0, "comm_cancel_byuser", nexacro._CommunicationStatusTable.cancel_byuser);
                    }

                    var stylesheets = document.styleSheets;
                    var stylesheetcnt = stylesheets.length;
                    var path = pthis.path.replace("./", "");  //stylesheets[i].href 가 fullpath
                    if (_ajax._stylesheetcnt != stylesheetcnt)
                    {
                        for (var i = 0; i < stylesheetcnt; i++)
                        {
                            if (stylesheets[i].href && stylesheets[i].href.indexOf(path) >= 0) //
                            {
                                var cssrules = stylesheets[i].cssRules ? stylesheets[i].cssRules : stylesheets[i].rules;
                                if (cssrules && cssrules.length > 0)
                                    pthis.on_load_text("", "", "");
                                else
                                    pthis.on_error(-1, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.failunknown, pthis.path, "");
                                break;
                            }
                        }
                    }

                    return;
                };
            };
        }

        nexacro.__bindLoadDataHandler = function (_ajax, pthis)
        {
            return function (e)
            {
                if (!_ajax || !_ajax.handle) return;
                var ajax_handle = _ajax.handle;
                var is_abort = _ajax.aborted;

                // trace(pthis.path + " readyState:" + _ajax.handle.readyState + " ajax_handle.status:" + _ajax.handle.status)
                var status = (is_abort ? -1 : nexacro.__checkAjaxStatus(_ajax));
                if (status > 0)
                {
                    var data, is_array_buffer;
                    if (status >= 4)
                    {
                        if (_ajax._reader)
                        {
                            pthis._b_recieved_all_data = true;
                            return;
                        }

                        var _doc = null;
                        var cookie = "";
                        var last_modified = ajax_handle.getResponseHeader("Last-Modified");

                        if (pthis.context)
                        {
                            if (pthis.context._is_component)
                                cookie = pthis.context._getWindow()._doc.cookie;
                            else
                                cookie = document ? document.cookie : null;
                        }
                        is_array_buffer = (ajax_handle.responseType == 'arraybuffer');

                        if (is_array_buffer)
                        {
                            if (pthis._last_loaded != undefined)
                            {
                                data = new Uint8Array(ajax_handle.response, pthis._last_loaded);
                            }
                            else
                            {
                                data = new Uint8Array(ajax_handle.response);
                            }

                            if (!data) data = new Uint8Array();
                        }
                        else
                        {
                            data = ajax_handle.responseText;
                            if (!data) data = "";
                        }

                        pthis._b_recieved_all_data = true;

                        if (is_array_buffer)
                        {
                            pthis.on_load_arraybuffer(data, cookie, last_modified);
                        }
                        else if (!data && pthis._check_responseXML)
                        {
                            _doc = ajax_handle.responseXML;
                            if (_doc)
                            {
                                pthis.on_load_xmldom(_doc, cookie, last_modified);
                            }
                            else
                            {
                                pthis.on_load_data("", cookie, last_modified);
                            }
                        }
                        else
                        {
                            pthis.on_load_data(data, cookie, last_modified);
                        }
                        _ajax._destroy();
                        _ajax = null;

                        pthis._destroy();
                        pthis = null;
                    }
                    // deprecated firstrow
                    else if (status == 3)   // progress data
                    {
                        if (pthis instanceof nexacro.TransactionItem)
                        {
                            var _reader = _ajax._reader;
                            if (_reader)
                            {
                                var msstream = ajax_handle.response;

                                switch (_reader._data_type)
                                {
                                    case "text":
                                        _reader.readAsText(msstream);
                                        break;

                                    case "arraybuffer":
                                        _reader.readAsArrayBuffer(msstream);
                                        break;
                                }
                                return;
                            }

                            if ((ajax_handle.responseType == 'arraybuffer'))
                                return;

                            if (nexacro._use_progress_data)
                            {
                                if (pthis._progress_data && !pthis._progress_data._needParseForProgressLoad())
                                    return;
                            }
                            else
                                return;

                            if (pthis._b_block_onprogress || pthis._b_recieved_all_data)
                                return;

                            if (pthis._is_unknowntype_data)
                                return;

                            if (nexacro._use_firefirstcount)
                            {
                                if (pthis._progress_data && !pthis._progress_data._needParseForFirstCount())
                                    return;
                            }

                            is_array_buffer = (ajax_handle.responseType == 'arraybuffer');
                            if (is_array_buffer)
                            {
                                if (pthis._last_loaded === undefined)
                                {
                                    data = new Uint8Array(ajax_handle.response);
                                    pthis._last_loaded = 0;
                                }
                                else
                                {
                                    data = new Uint8Array(ajax_handle.response, pthis._last_loaded);
                                }
                                if (!data) data = new Uint8Array();

                                pthis._last_loaded += data.length;
                            }
                            else
                            {
                                data = ajax_handle.responseText;
                                if (!data) data = "";
                            }
                            pthis._recieved_data = data;

                            pthis._b_block_onprogress = true;

                            pthis._async_progress_timer_id = setTimeout(
                                (function (obj)
                                {
                                    return function ()
                                    {
                                        obj._async_progress_data();
                                    };
                                })(pthis), nexacro._interval_onprogress_timer);   // interval 을 길게 주면 progress data처리 횟수가 줄어듬.

                        }
                    }
                }
                else
                {
                    if (_ajax._user_aborted)
                    {
                        pthis.on_error(0, "comm_cancel_byuser", nexacro._CommunicationStatusTable.cancel_byuser);
                        _ajax._destroy();
                        _ajax = null;

                        pthis._destroy();
                        pthis = null;
                    }
                    else
                    {
                        var locationurl = "", extramsg = "";
                        var ret;
                        if (e)
                        {
                            if (e.type == "timeout" || status == -408 || status == -504)
                            {
                                if (_ajax._httpretry >= 1)
                                {
                                    ret = nexacro.__retryCommunication(_ajax, pthis);
                                    if (ret !== false)
                                        return;
                                }

                                if (status == -408 || status == -504)
                                    pthis.on_error(-1, "comm_fail_loaddetail", -status, locationurl, extramsg);
                                else
                                    pthis.on_error(-1, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.client_timeout, locationurl, extramsg);
                                _ajax._destroy();
                                _ajax = null;

                                pthis._destroy();
                                pthis = null;
                            }
                            else if (e.type == "error")
                            {
                                // readystatchange가 발생(네트워크 끊겼을때)
                                //ajax.onerror bind 하여 0x2efd 처리.
                                if (_ajax._httpretry >= 1)
                                {
                                    ret = nexacro.__retryCommunication(_ajax, pthis);
                                    if (ret !== false)
                                        return;
                                }

                                pthis.on_error(-1, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.failunknown, locationurl, extramsg);

                                _ajax.aborted = true;
                                ajax_handle.abort();
                                _ajax._destroy();
                                _ajax = null;

                                pthis._destroy();
                                pthis = null;
                                //ajax_handle = null;
                                return;
                            }
                            else if (e.type == "load")
                            {
                                pthis.on_error(-1, "comm_fail_loaddetail", -status, locationurl, extramsg);
                                _ajax._destroy();
                                _ajax = null;

                                pthis._destroy();
                                pthis = null;
                            }
                        }
                        else
                        {
                            pthis.on_error(-1, "comm_fail_loaddetail", -status, locationurl, extramsg);
                            _ajax._destroy();
                            _ajax = null;

                            pthis._destroy();
                            pthis = null;
                        }
                    }

                }

                //ajax_handle = null;
            };
        };

        nexacro.__bindLoadDataObjectHandler = function (_ajax, pthis)
        {
            return function (e)
            {
                if (!_ajax || !_ajax.handle) return;
                var ajax_handle = _ajax.handle;
                var is_abort = _ajax.aborted;

                // trace(pthis.path + " readyState:" + _ajax.handle.readyState + " ajax_handle.status:" + _ajax.handle.status);
                var status = (is_abort ? -1 : nexacro.__checkAjaxStatus(_ajax));
                if (status > 0)
                {
                    if (status >= 4)
                    {
                        var cookie = "";
                        var last_modified = ajax_handle.getResponseHeader("Last-Modified");

                        if (pthis.context)
                        {
                            if (pthis.context._is_component)
                                cookie = pthis.context._getWindow()._doc.cookie;
                            else
                                cookie = document ? document.cookie : null;
                        }
                        //var data = ajax_handle.responseText;
                        //if (!data) data = "";

                        pthis._b_recieved_all_data = true;
                        pthis.on_load_dataobject(ajax_handle.responseText, cookie, last_modified, ajax_handle.getAllResponseHeaders(), ajax_handle.status);
                        _ajax._destroy();
                        _ajax = null;

                        pthis._destroy();
                        pthis = null;
                    }
                }
                else
                {
                    if (pthis._onerror_recursive_cnt == undefined)
                        pthis._onerror_recursive_cnt = 0;

                    if (_ajax._user_aborted)
                    {
                        pthis._onerror_recursive_cnt++;
                        pthis.on_error(0, "comm_cancel_byuser", nexacro._CommunicationStatusTable.cancel_byuser, "", "", ajax_handle.responseText, ajax_handle.getAllResponseHeaders());
                        pthis._onerror_recursive_cnt--;

                        if (pthis._onerror_recursive_cnt == 0)
                        {
                            _ajax._destroy();
                            _ajax = null;

                            pthis._destroy();
                            pthis = null;
                        }
                    }
                    else
                    {
                        var locationurl = "", extramsg = "";
                        var ret;
                        if (e)
                        {
                            var etype = e.type;
                            if (etype == "timeout" || status == -408 || status == -504)
                            {
                                if (_ajax._httpretry >= 1)
                                {
                                    ret = nexacro.__retryRESTCommunication(_ajax, pthis);
                                    if (ret !== false)
                                        return;
                                }

                                pthis._onerror_recursive_cnt++;
                                if (status == -408 || status == -504)
                                    pthis.on_error(-1, "comm_fail_loaddetail", -status, locationurl, extramsg, ajax_handle.responseText, ajax_handle.getAllResponseHeaders());
                                else
                                    pthis.on_error(-1, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.client_timeout, locationurl, extramsg, ajax_handle.responseText, ajax_handle.getAllResponseHeaders());
                                pthis._onerror_recursive_cnt--;

                                if (pthis._onerror_recursive_cnt == 0)
                                {
                                    _ajax._destroy();
                                    _ajax = null;

                                    pthis._destroy();
                                    pthis = null;
                                }
                            }
                            else if (etype == "error")
                            {
                                // readystatchange가 발생(네트워크 끊겼을때)
                                //ajax.onerror bind 하여 0x2efd 처리.
                                if (_ajax._httpretry >= 1)
                                {
                                    ret = nexacro.__retryRESTCommunication(_ajax, pthis);
                                    if (ret !== false)
                                        return;
                                }

                                pthis._onerror_recursive_cnt++;
                                pthis.on_error(-1, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.failunknown, locationurl, extramsg, ajax_handle.responseText, ajax_handle.getAllResponseHeaders());
                                pthis._onerror_recursive_cnt--;

                                _ajax.aborted = true;
                                ajax_handle.abort();

                                if (pthis._onerror_recursive_cnt == 0)
                                {
                                    _ajax._destroy();
                                    _ajax = null;

                                    pthis._destroy();
                                    pthis = null;
                                }
                                //ajax_handle = null;
                                return;
                            }
                            else if ((pthis._async === false && etype == "readystatechange") || etype == "load" || status == -404) //404 preload 에러시 폼이 안올라오는케이스
                            {
                                var proc = true;

                                if (proc)
                                {
                                    pthis._onerror_recursive_cnt++;
                                    pthis.on_error(-1, "comm_fail_loaddetail", -status, locationurl, extramsg, ajax_handle.responseText, ajax_handle.getAllResponseHeaders());
                                    pthis._onerror_recursive_cnt--;
                                }

                                if (pthis._onerror_recursive_cnt == 0)
                                {
                                    _ajax._destroy();
                                    _ajax = null;

                                    pthis._destroy();
                                    pthis = null;
                                }
                            }
                        }
                        else
                        {
                            pthis._onerror_recursive_cnt++;
                            pthis.on_error(-1, "comm_fail_loaddetail", -status, locationurl, extramsg, ajax_handle.responseText, ajax_handle.getAllResponseHeaders());
                            pthis._onerror_recursive_cnt--;

                            if (pthis._onerror_recursive_cnt == 0)
                            {
                                _ajax._destroy();
                                _ajax = null;

                                pthis._destroy();
                                pthis = null;
                            }
                        }
                    }
                }

                //ajax_handle = null;
            };
        };
        nexacro.__bindLoadJsonHandler = function (_ajax, pthis)
        {
            return function (e)
            {
                if (!_ajax || !_ajax.handle) return;
                var ajax_handle = _ajax.handle;
                var is_abort = _ajax.aborted;
                var status = (is_abort ? -1 : nexacro.__checkAjaxStatus(_ajax));
                if (status > 0)
                {
                    if (status >= 4)
                    {
                        var cookie = "";
                        if (pthis.context)
                        {
                            if (pthis.context._is_component)
                                cookie = pthis.context._getWindow()._doc.cookie;
                            else
                                cookie = document ? document.cookie : null;
                        }

                        var data = ajax_handle.responseText;
                        var last_modified = ajax_handle.getResponseHeader("Last-Modified");
                        pthis.on_load_json(data, cookie, last_modified);
                        _ajax._destroy();
                        _ajax = null;
                        pthis = null;
                    }
                }
                else
                {
                    if (status == -304)     //Not Modified
                    {
                        if (pthis.context)
                        {
                            if (pthis.context._is_component)
                                cookie = pthis.context._getWindow()._doc.cookie;
                            else
                                cookie = document ? document.cookie : null;
                        }

                        pthis.bcache = false;
                        var m_cache = nexacro._CacheList[pthis.path];
                        pthis.on_load_json(m_cache.data, cookie, m_cache.last_modified);
                        _ajax._destroy();
                        _ajax = null;
                        pthis = null;
                    }
                    else
                    {
                        var errcode = nexacro.__getHttpErrorCode(-status);
                        var locationurl = "", extramsg = "";

                        if (!ajax_handle.ontimeout || !e || e.type == "load")
                        {
                            pthis.on_error(errcode, "comm_fail_loaddetail", -status, locationurl, extramsg);
                        }
                        else
                        {
                            if (e.type == "timeout")
                            {
                                status = nexacro._CommunicationStatusTable.client_timeout;
                                errcode = nexacro.__getHttpErrorCode(status);
                                pthis.on_error(errcode, "comm_fail_loaddetail", status, locationurl, extramsg);
                            }
                        }
                        _ajax._destroy();
                        _ajax = null;
                        pthis = null;
                    }
                }
            };
        };
        nexacro.__bindLoadUpdateHandler = function (_ajax, pthis)
        {
            return function (e)
            {
                if (!_ajax || !_ajax.handle) return;
                var ajax_handle = _ajax.handle;
                var is_abort = _ajax.aborted;
                var status = (is_abort ? -1 : nexacro.__checkAjaxStatus(_ajax));
                if (status > 0)
                {
                    if (status >= 4)
                    {
                        var cookie = "";
                        if (pthis.context)
                        {
                            if (pthis.context._is_component)
                                cookie = pthis.context._getWindow()._doc.cookie;
                            else
                                cookie = document ? document.cookie : null;
                        }

                        var data = ajax_handle.responseText;
                        pthis.on_load_update(data, cookie);
                        _ajax._destroy();
                        _ajax = null;
                        pthis = null;
                    }
                }
                else
                {
                    var errcode = nexacro.__getHttpErrorCode(-status);
                    var locationurl = "", extramsg = "";

                    if (!ajax_handle.ontimeout || !e || e.type == "load")
                    {
                        pthis.on_error(errcode, "comm_fail_loaddetail", -status, locationurl, extramsg);
                    }
                    else
                    {
                        if (e.type == "timeout")
                        {
                            status = nexacro._CommunicationStatusTable.client_timeout;
                            errcode = nexacro.__getHttpErrorCode(status);
                            pthis.on_error(errcode, "comm_fail_loaddetail", status, locationurl, extramsg);
                        }
                    }
                    _ajax._destroy();
                    _ajax = null;
                    pthis = null;
                }
                //ajax_handle = null;
            };
        };


        nexacro.__retryCommunication = function (_ajax, loaditem)
        {
            if (!_ajax || !loaditem)
                return false;

            //var method = _ajax._method;
            var path = _ajax._path;
            var async = _ajax._async;
            var senddata = _ajax._senddata;
            //var bindfn = _ajax._bindfn;
            var referer = _ajax._referer;
            var service = _ajax._service;
            var cachelevel = _ajax._cachelevel;
            var ndatatype = _ajax._ndatatype;
            var compress = _ajax._compress;
            var ver = _ajax._ver;
            var failpass = _ajax._failpass;
            var httpretry = _ajax._httpretry;

            loaditem._httpretry = httpretry - 1;
            _ajax.handle.abort();
            _ajax._destroy();
            _ajax = null;

            nexacro.__startCommunication(loaditem, path, cachelevel, async, referer, senddata, ndatatype, compress, ver, failpass, service);

            return true;
        };

        nexacro.__getHttpErrorCode = function (statuscode)
        {
            var errorcode = this.__httpErrorTable[statuscode];
            if (!errorcode)
            {
                if (statuscode < 500)
                    errorcode = "0x80010040";
                else
                    errorcode = "0x80010041";
            }
            return errorcode;
        };

        nexacro.__httpErrorTable =
        {
            301: -0x1004A,
            302: -0x1004B,
            305: -0x1004D,
            307: -0x1004E,
            400: -0x1003B,
            401: -0x10042,
            402: -0x10043,
            403: -0x10044,
            404: -0x1003C,
            405: -0x1003D,
            406: -0x10045,
            407: -0x10046,
            408: -0x10047,
            500: -0x1003E,
            503: -0x1003F,
            499: -0x10040,
            599: -0x10041,
            0: 0
        };


        nexacro._on_load_loadItem = function (loadItem, path)
        {
            var cache = nexacro._CacheList[path];
            if (loadItem.type == "module")
            {
                loadItem.on_load_module(cache.data, null);
            }
            else if (loadItem.type == "text")
            {
                loadItem.on_load_text(cache.data, null);
            }
            else
            {
                loadItem.on_load_update(cache.data, null);
            }
        };

        nexacro.__fetch = function (_finfo)
        {
            if (!window.fetch || !window.AbortController) return false;

            var _loadItem = _finfo.loadItem;
            var _path = _finfo.path;
            var _senddata = _finfo.senddata;

            var _method = "GET";
            _method = _loadItem._http_method ? _loadItem._http_method : "POST";
            _loadItem._last_loaded = 0;

            var acontroller = _finfo.controller = new AbortController();
            var abort_signal = acontroller.signal;

            var _timeout = false;
            var timeout_id;
            const env = nexacro.getEnvironment();
            const httptimeout = env ? env.httptimeout : nexacro._httptimeout;

            if (httptimeout > 0)
            {
                timeout_id = setTimeout(function ()
                {
                    _timeout = true;
                    acontroller.abort();
                }, httptimeout * 1000);
            }

            var _credentials = "same-origin";
            if (env && env.networksecurelevel == "all")
                _credentials = "include";


            var options = {};
            if (_method == "GET")
            {
                options =
                {
                    method: _method,
                    signal: abort_signal,
                    headers:
                    {
                        //'Content-Type': 'text/plain'
                    },
                }
            }
            else
            {
                options =
                {
                    method: _method, // *GET, POST, PUT, DELETE, etc.
                    signal: abort_signal,
                    mode: 'cors',   // no-cors, cors, *same-origin
                    cache: 'no-cache',  // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: _credentials, // include, *same-origin, omit
                    headers:
                    {

                    },
                    //redirect: 'follow', // manual, *follow, error
                    //referrer: 'no-referrer',    // no-referrer, *client
                    body: _senddata
                }
            }


            var protocoladp = nexacro._getProtocol(_loadItem.protocol);
            if (protocoladp && protocoladp.version)
            {
                var protocolver = protocoladp.version();
                if (protocolver > "1.0")
                {
                    var httpheaders = protocoladp.getHTTPHeader();
                    var httpheaderlen = httpheaders.length;
                    for (var i = 0; i < httpheaderlen; i++)
                    {
                        options.headers[httpheaders[i].id] = httpheaders[i].value;
                    }
                }
            }
            else //if (true)
            {
                options.headers["X-Requested-With"] = "Fetch";
                options.headers["Accept"] = "application/xml, text/xml, */*";

                var ndatatype = _finfo.ndatatype;

                if (ndatatype == 2)
                    options.headers["Content-Type"] = "text/plain";         // ssv
                else if (ndatatype == 3)
                    options.headers["Content-Type"] = "application/json";   // json
                else if (ndatatype == 1)
                    options.headers["Content-Type"] = "application/octet-stream";   // bin
                else
                    options.headers["Content-Type"] = "text/xml";           // xml
            }

            var httpvariables = nexacro._getSharedVariableAll(5);
            if (httpvariables)
            {
                for (var prop in httpvariables)
                {
                    if (httpvariables.hasOwnProperty(prop))
                    {
                        options.headers[prop] = httpvariables[prop].value;
                    }
                }
            }

            var service = _finfo.service;
            if (service)
            {
                if (service.cachelevel == "none")
                {
                    options.headers["cache-control"] = "no-cache, no-store";
                    options.headers["Pragma"] = "no-cache";
                    options.headers["If-Modified-Since"] = "Sat, 01 Jan 2000 00:00:00 GMT";
                    options.headers["Expires"] = -1;
                }
                else
                {
                    if (_loadItem.last_modified)
                    {
                        options.headers["cache-control"] = "no-cache";
                        options.headers["If-Modified-Since"] = _loadItem.last_modified;
                    }
                }
            }

            if (!ReadableStream)
                return false;

            window.fetch(_path, options)
                .then(function (response)
                {
                    var _status = response.status;
                    if (_status === 200)
                    {
                        return response.body;
                    }

                    throw new Error(_status);

                })
                .then(function (body)
                {
                    var reader = body.getReader();
                    if (ReadableStream)
                    {
                        return new ReadableStream({
                            start: function start(controller)
                            {

                                function pump()
                                {
                                    return reader.read().then(function (_ref)
                                    {
                                        var done = _ref.done,
                                            value = _ref.value;

                                        if (done)
                                        {
                                            controller.close();
                                            return;
                                        }

                                        controller.enqueue(value);

                                        if (!nexacro._use_progress_data)
                                        {
                                            return pump();
                                        }

                                        if (_loadItem._progress_data)
                                        {

                                            if (!_loadItem._progress_data._needParseForProgressLoad())
                                            {
                                                return pump();
                                            }

                                            if (nexacro._use_firefirstcount && !_loadItem._progress_data._needParseForFirstCount())
                                            {
                                                return pump();
                                            }
                                        }

                                        if (_loadItem._is_unknowntype_data || _loadItem._b_recieved_all_data || _loadItem._b_block_onprogress)
                                        {
                                            /*
                                            if (this._remain_data)
                                            {
                                                trace("skip: " + this._remain_data.length);
                                                if (value && value.length > 0)
                                                {
                                                    var remain_len = this._remain_data.length;
                                                    var merged_data = new Uint8Array(remain_len + value.length);
                                                    merged_data.set(this._remain_data);
                                                    merged_data.set(value, remain_len);
                                                    this._remain_data = merged_data;
                                                    merged_data = null;
                                                }
                                            }
                                            else
                                            {
                                                this._remain_data = value;
                                            }
                                          */
                                            return pump();
                                        }


                                        _loadItem._b_block_onprogress = true;
                                        /*
                                        var pThis = this;
                                        var data = value;

                                        function _async_progress()
                                        {
                                            var pData = _loadItem._progress_data;
                                            if (_loadItem._progress_data && _loadItem._progress_data._remain_data && _loadItem._progress_data._remain_data.length > 0)
                                            {
                                                _loadItem._last_loaded += _loadItem._progress_data._remain_data.length;
                                            }
                                            if (data && _loadItem.on_progress_arraybuffer_chunk(data, false))
                                            {
                                                pData = _loadItem._progress_data;
                                                _loadItem._last_loaded += data.length;
                                                if (pData._remain_data)
                                                {
                                                    //_loadItem._last_loaded -= _loadItem._progress_data._remain_data.length;
                                                    if (pData._remain_data && pData._remain_data.length > 0)
                                                    {
                                                        //   trace("_loadItem._last_loaded",_loadItem._progress_data._remain_data.length, _loadItem._last_loaded);
                                                        _loadItem._last_loaded -= pData._remain_data.length;
                                                    }

                                                     var remain_len = pData._remain_data.length;
                                                     var merged_data = new Uint8Array(remain_len + data.length);
                                                     merged_data.set(pData._remain_data);
                                                     merged_data.set(data, remain_len);
                                                     pData._remain_data = merged_data;
                                                     merged_data = null;

                                                }
                                                data = null;
                                            }

                                         }
                                         if (_loadItem._async_progress_timer_id &&  _loadItem._last_loaded == 0)
                                         {
                                            clearTimeout(_loadItem._async_progress_timer_id);
                                         }
                                         _loadItem._async_progress_timer_id = setTimeout(_async_progress, nexacro._interval_onprogress_timer);

                                         if (!this._remain_data)
                                        {
                                            this._remain_data = value;
                                        }
                                        */
                                        //var data = new Uint8Array(value);
                                        var data = value;
                                        /*
                                        if (_loadItem._progress_data && _loadItem._progress_data._remain_data && _loadItem._progress_data._remain_data.length > 0)
                                        {
                                            _loadItem._last_loaded += _loadItem._progress_data._remain_data.length;
                                        }
                                          */
                                        if (_loadItem.on_progress_arraybuffer_chunk(data, false))
                                        {
                                            _loadItem._last_loaded += data.length;
                                            //if (_loadItem._progress_data._remain_data && _loadItem._progress_data._remain_data.length > 0)
                                            //{
                                            //    _loadItem._last_loaded -= _loadItem._progress_data._remain_data.length;
                                            //}
                                        }

                                        data = null;


                                        return pump();
                                    });
                                }

                                return pump();


                            }
                        })
                    }

                })
                .then(function (stream) { return new Response(stream); })
                .then(function (response) { return response.arrayBuffer(); })
                .then(function (data)
                {
                    _timeout = false;
                    clearTimeout(_loadItem._async_progress_timer_id);

                    //var _doc = null;
                    var cookie = "";

                    if (_loadItem.context)
                    {
                        if (_loadItem.context._is_component)
                            cookie = _loadItem.context._getWindow()._doc.cookie;
                        else
                            cookie = document ? document.cookie : null;
                    }

                    if (!data) data = "";

                    _loadItem._b_recieved_all_data = true;
                    _loadItem._b_block_onprogress = false;

                    if (data && (data.length == 0 || data.byteLength <= 0))
                    {
                        return;
                    }

                    if (_loadItem._last_loaded != undefined)
                    {
                        data = new Uint8Array(data, _loadItem._last_loaded);
                    }
                    else
                    {
                        data = new Uint8Array(data);
                    }

                    _loadItem.on_load_arraybuffer(data, cookie);
                    if (_finfo)
                    {
                        _finfo.senddata = null;
                        _finfo = null;
                    }
                    _loadItem._sendData = null;

                    if (options)
                    {
                        options.body = null;
                        options = null;
                    }
                    data = null;
                })

                .catch(function (error)
                {
                    var locationurl = "", extramsg = "";
                    if (error)
                    {
                        if (error.name == "AbortError")
                        {
                            if (_timeout)
                            {
                                _timeout = false;
                                clearTimeout(timeout_id);

                                _finfo.loadItem._httpretry -= 1;
                                if (_finfo.loadItem._httpretry >= 1)
                                    nexacro.__startCommunication(_finfo.loadItem, _finfo.path, _finfo.cachelevel, _finfo.async, _finfo.referer, _finfo.senddata, _finfo.ndatatype, _finfo.compress, _finfo.ver, _finfo.failpass, _finfo.service);
                                else
                                {
                                    _loadItem.on_error(-1, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.client_timeout, "", "");
                                }
                            }
                            else
                            {
                                _loadItem.on_error(0, "comm_cancel_byuser", nexacro._CommunicationStatusTable.cancel_byuser, "", "");
                            }
                        }
                        else
                            _loadItem.on_error(-1, "comm_fail_loaddetail", error.message, locationurl, extramsg);
                    }
                    else
                    {
                        _loadItem.on_error(-1, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.failunknown, locationurl, extramsg);
                    }
                    _loadItem._sendData = null;
                    if (_finfo)
                    {
                        _finfo.senddata = null;
                        _finfo = null;
                    }

                    if (options)
                    {
                        options.body = null;
                        options = null;
                    }

                    //trace(error + " :: " + error.message + " :: " + error.name);

                });


            return true;

        };

        nexacro.__startCommunication = function (loadItem, path, cachelevel, async, referer, senddata, ndatatype, compress, ver, failpass, service)
        {
            var use_fetch = false, use_fakexhr = false;
            if (nexacro._isHybrid && nexacro._isHybrid() || (nexacro._macOSWebView && !nexacro._allowFileAccessMacOSWebView))
            {
                if (loadItem.type == "data" && (async || (ndatatype == 1)))
                {
                    use_fetch = true;
                }

                if (nexacro._OS == "iOS" || nexacro._macOSWebView)
                {
                    // local에서는 Fetch API, XHR 모두 동작하지 않으므로 FakeXHR을 사용한다.
                    if (document.location.href.indexOf("file://") == 0)
                    {
                        use_fetch = false;
                        use_fakexhr = true;
                    }

                    if (nexacro._OS == "iOS" && loadItem._protocol == -1)
                    {
                        use_fetch = false;
                        use_fakexhr = true;
                    }
                }

                if (nexacro._OS == "Android")
                {
                    // local에서 cookie를 지원하기 위해서 FakeXHR을 사용한다.
                    if (loadItem.type == "data" && document.location.href.indexOf("file://") == 0)
                    {
                        use_fetch = false;
                        use_fakexhr = true;
                    }

                    if (loadItem._protocol == -1)
                    {
                        use_fetch = false;
                        use_fakexhr = true;
                    }
                }

                if (compress)
                {
                    use_fetch = false;
                    use_fakexhr = true;
                }

                if (cachelevel == "static" && globalThis.chrome && globalThis.chrome.webview)
                {
                    //win7이고, if (document.location.href.indexOf("file://") == 0) 일때도 차후 이곳;
                    use_fetch = false;
                    use_fakexhr = true;
                }

            }
            else
            {
                // Browser는 FakeXHR을 사용할 수 없다.
                use_fakexhr = false;

                // BIN 통신은 Fetch API에서만 가능하며 sync로 처리될 수 없다.
                if (loadItem.type == "data" && (async || (ndatatype == 1)))
                {
                    use_fetch = true;
                }
            }

            var httpretry, ret;
            const env = nexacro.getEnvironment();
            const envhttpretry = env ? env._p_httpretry : 0;
            if (use_fetch)
            {
                httpretry = envhttpretry;
                if (loadItem._httpretry === undefined)
                    loadItem._httpretry = httpretry;

                var _fetch_info = {};
                _fetch_info.name = "fetch";

                _fetch_info.loadItem = loadItem;
                _fetch_info.path = path;
                _fetch_info.cachelevel = cachelevel;
                _fetch_info.async = async;
                _fetch_info.referer = referer;
                _fetch_info.senddata = senddata;
                _fetch_info.ndatatype = ndatatype;
                _fetch_info.compress = compress;
                _fetch_info.ver = ver;
                _fetch_info.failpass = failpass;
                _fetch_info.service = service;

                ret = nexacro.__fetch(_fetch_info);
                if (ret) return _fetch_info;
            }

            var _ajax;
            if (loadItem.type == "css")
            {
                _ajax = {};
                _ajax.handle = document.createElement("link");
                _ajax.handle.type = "text/css";
                _ajax.handle.rel = "stylesheet";
            }
            else if (cachelevel == "default" && loadItem.type != "data")
            {
                if (async)
                {
                    _ajax = {};
                    _ajax._destroy = function ()
                    {
                        if (this._handle)
                        {
                            this._handle = null;
                        }
                        if (this.timerid) clearTimeout(this.timerid); this.timerid = undefined;
                    };
                    _ajax._handle = {
                        timerid: (setTimeout(function ()
                        {
                            nexacro._on_load_loadItem(loadItem, path);
                        })),
                        abort: function ()
                        {
                            if (this.timerid) clearTimeout(this.timerid); this.timerid = undefined;
                        }
                    };
                    return _ajax._handle;
                }
                else
                {
                    nexacro._on_load_loadItem(loadItem, path);
                    return null;
                }
            }
            else
            {
                if (use_fakexhr)
                    _ajax = nexacro.__createFakeHttpRequest(ndatatype, compress, async, loadItem.type);
                else
                    _ajax = nexacro.__createHttpRequest();
            }

            var ajax_handle = _ajax.handle;

            // parse protocol
            if (path.indexOf("://") > -1)
            {
                var ar = path.split("://");
                var protocol = ar[0];
                switch (protocol)
                {
                    case "http": _ajax._protocol = 0; break;
                    case "https": _ajax._protocol = 1; break;
                    case "file": _ajax._protocol = 2; break;
                    default: _ajax._protocol = -1; break;
                }
            }

            var bindfn = null;
            var method = "GET";
            var mime_xml = false;

            path = nexacro._encodeURI(path);

            if (loadItem.type == "module")
            {
                _ajax.handle.responseType = "arraybuffer";
                bindfn = nexacro.__bindLoadModuleHandler(_ajax, loadItem);
            }
            else if (loadItem.type == "data")
            {
                bindfn = nexacro.__bindLoadDataHandler(_ajax, loadItem);
                method = loadItem._http_method ? loadItem._http_method : "POST";
                mime_xml = true;
            }
            else if (loadItem.type == "text")
            {
                bindfn = nexacro.__bindLoadTextHandler(_ajax, loadItem);
            }
            else if (loadItem.type == "css")
            {
                ajax_handle.href = path;
                _ajax._href = path;
                _ajax._stylesheetcnt = document.styleSheets.length;
                _ajax._async = async;
                var headnode = document.getElementsByTagName('head')[0];
                headnode.appendChild(ajax_handle);
                bindfn = nexacro.__bindLoadCSSHandler(_ajax, loadItem);
                ajax_handle.onload = bindfn;
                ajax_handle.onerror = bindfn;

                return _ajax;
            }
            else if (loadItem.type == "json")
            {
                bindfn = nexacro.__bindLoadJsonHandler(_ajax, loadItem);
            }
            else  //for update
            {
                bindfn = nexacro.__bindLoadUpdateHandler(_ajax, loadItem);
            }

            if (async)
            {
                ajax_handle.onreadystatechange = bindfn;
            }

            if (ajax_handle.onerror !== undefined)
                ajax_handle.onerror = bindfn;

            httpretry = (loadItem._httpretry !== undefined) ? loadItem._httpretry : envhttpretry;
            if (httpretry >= 1)
            {
                _ajax._path = path;
                _ajax._cachelevel = cachelevel;
                _ajax._async = async;
                _ajax._referer = referer;
                _ajax._senddata = senddata;
                _ajax._ndatatype = ndatatype;
                _ajax._compress = compress;
                _ajax._ver = ver;
                _ajax._failpass = failpass;
                _ajax._service = service;

                _ajax._httpretry = httpretry;
                _ajax._method = method;
                _ajax._bindfn = bindfn;
            }

            try
            {
                ajax_handle.open(method, path, !!async);
            }
            catch (e)
            {
                var extrmsg = e.number + " " + e.message;
                loadItem.on_error(e.number, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.failunknown, "", extrmsg);

                _ajax = null;
                return null;
            }

            if (loadItem.type == "data" && !!async)// && nexacro._use_progress_data)
            {
                ajax_handle.responseType = 'arraybuffer';
            }

            if (env && env.networksecurelevel == "all")
            {
                ajax_handle.withCredentials = true;
            }

            var protocoladp = nexacro._getProtocol(loadItem.protocol);
            if (protocoladp && protocoladp.version)
            {
                var protocolver = protocoladp.version();
                if (protocolver > "1.0")
                {
                    var httpheaders = protocoladp.getHTTPHeader();
                    var httpheaderlen = httpheaders.length;
                    for (var i = 0; i < httpheaderlen; i++)
                    {
                        ajax_handle.setRequestHeader(httpheaders[i].id, httpheaders[i].value);
                    }
                }
            }
            else if (mime_xml)
            {
                ajax_handle.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                ajax_handle.setRequestHeader("Accept", "application/xml, text/xml, */*");

                if (ndatatype == 2)
                    ajax_handle.setRequestHeader("Content-Type", "text/plain");         // ssv
                else if (ndatatype == 3)
                    ajax_handle.setRequestHeader("Content-Type", "application/json");   // json
                else
                    ajax_handle.setRequestHeader("Content-Type", "text/xml");           // xml

                //   ajax_handle.setRequestHeader("cache-control", "no-cache");
            }

            // if (_ajax._protocol == 1)
            //document.cookie = document.cookie + "; secure";

            var httpvariables = nexacro._getSharedVariableAll(5);
            if (httpvariables)
            {
                for (var prop in httpvariables)
                {
                    if (httpvariables.hasOwnProperty(prop))
                    {
                        ajax_handle.setRequestHeader(prop, httpvariables[prop].value);
                    }
                }
            }

            if (service)
            {
                if (service.cachelevel == "none")
                {
                    ajax_handle.setRequestHeader("cache-control", "no-cache, no-store");
                    ajax_handle.setRequestHeader("Pragma", "no-cache");
                    ajax_handle.setRequestHeader("If-Modified-Since", "Sat, 01 Jan 2000 00:00:00 GMT");
                    ajax_handle.setRequestHeader("Expires", -1);
                }
                else
                {
                    if (loadItem.last_modified)
                    {
                        ajax_handle.setRequestHeader("cache-control", "no-cache");
                        ajax_handle.setRequestHeader("If-Modified-Since", loadItem.last_modified);
                    }
                }
            }

            try
            {
                var httptimeout = env ? env.httptimeout : nexacro._httptimeout;

                if (async)
                {
                    // httptimeout property use for only async
                    if (ajax_handle.timeout != undefined && httptimeout >= 0 && httptimeout <= 2147483) //no have property from made by activeObject, add check property by comnik 20150324
                    {
                        ajax_handle.timeout = httptimeout * 1000;

                        // set the timeout & onload callback for timeout checking
                        ajax_handle.ontimeout = bindfn;
                        ajax_handle.onload = bindfn;
                    }


                }


                ajax_handle.send(senddata ? senddata : null);

                if (!async)
                    bindfn(_ajax, loadItem);

            }
            catch (e)
            {
                if (_ajax._user_aborted)
                    loadItem.on_error(e.number, "comm_stop_transaction_byesc", nexacro._CommunicationStatusTable.stop_transaction_byesc);
                else
                    loadItem.on_error(e.number, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.failunknown, "", e.number);
                return null;
            }
            ajax_handle = null;
            return _ajax;
        };


        nexacro.__cancelCommunication = function (_ajax)
        {
            var ajax_handle = _ajax.handle;
            _ajax.aborted = true;
            if (ajax_handle)
            {
                ajax_handle.abort();
                //ajax_handle = null;
            }
            else
            {
                if (_ajax.name == "fetch")
                {
                    _ajax.controller.abort();
                }
            }
            return false;
        };

        if (nexacro._OS == "iOS")
        {
            nexacro.__openSystemCalendar = function (calendar, value)
            {
                if (nexacro._isOpenSystemCalendar())
                    return;

                var calendaredit = calendar.calendaredit;
                if (calendaredit)
                {
                    var input_element = calendaredit._input_element;
                    if (input_element && input_element.handle)
                    {
                        nexacro.__setInputDOMNodeFocus(input_element.handle);
                        nexacro.__setLastFocusedElement(input_element);
                        nexacro._showSystemCalendarOverlay(calendar);
                    }
                }
            };

            nexacro._isOpenSystemCalendar = function ()
            {
                return nexacro._calendar_overlay ? true : false;
            };
            if (nexacro._SystemType == "iphone")
            {
                nexacro._showSystemCalendarOverlay = function (calendar)
                {
                    var calendar_overlay_elem;
                    if (!calendar) return;
                    var win = calendar._getWindow();
                    if (win)
                    {
                        calendar_overlay_elem = this._calendar_overlay = new nexacro.ModalOverlayElement(calendar._control_element);
                        calendar_overlay_elem.setLinkedControl(calendar);
                        calendar_overlay_elem.setElementBackground(nexacro.ChildFrame._default_overlaycolor);
                        calendar_overlay_elem.name = "system_calendar_overlay";
                        calendar_overlay_elem.create(win);
                        nexacro._observeSysEvent(calendar_overlay_elem.handle, "touchstart", "ontouchstart", this._destroySystemCalendarOverlay);
                        nexacro._observeSysEvent(calendar_overlay_elem.handle, "lbuttondown", "onlbuttondown", this._destroySystemCalendarOverlay);
                    }
                };
            }
            else
            {
                nexacro._showSystemCalendarOverlay = nexacro._emptyFn;
            }

            nexacro._destroySystemCalendarOverlay = function ()
            {
                if (nexacro._calendar_overlay)
                {
                    nexacro._calendar_overlay.destroy();
                    nexacro._calendar_overlay = null;
                }
            };
        }
        else
        {
            nexacro.__openSystemCalendar = function (calendar, value)
            {
                var calendaredit = calendar.calendaredit;
                if (calendaredit)
                {
                    var input_element = calendaredit._input_element;
                    if (input_element && input_element.handle)
                    {
                        input_element.handle.click();
                    }
                }
            };
            nexacro._isOpenSystemCalendar = nexacro._emptyFn;
        }

        nexacro._datasetToBINString = function (dataset, id, type, savenan, saveinfinity, saveinvaliddate)
        {
            var list = [];
            var dsdata = dataset._saveBINUint8Array(id ? id : dataset.id, type, savenan, saveinfinity, saveinvaliddate);
            if (dsdata.length <= 0)
                return;

            //dataset mark 0xFE01
            list.push(0xFE, 0x01);

            //version 5000;
            list.push(0x13, 0x88);

            //dataset value
            dsdata.forEach(element => list.push(element));

            list.push(0, 0, 0, 0); //null record;

            const binString = Array.from(list, (x) => String.fromCodePoint(x)).join("");
            return btoa(binString);
        };

        nexacro._datasetFromBINString = function (dataset, binData)
        {
            const binString = atob(binData);
            var list = Uint8Array.from(binString, (m) => m.codePointAt(0));

            var parser = new nexacro._ProgressDataBIN({ outputDatasets: null, inputDatasets: null, context: {} });

            var mode = parser._setNextParseMode_arraybuffer(list, 0, 0);
            if (mode != 3)
                return dataset._p_rowcount;

            var buffer_obj = new nexacro._ProgressBufferManager(dataset);
            parser._parseRecord_arraybuffer_chunk(list,
                parser._parseColInfo_arraybuffer_chunk(list,
                    parser._parseDataset_arraybuffer_chunk(list, 0, true, buffer_obj)
                )
            );
            parser._on_fire_onload_arraybuffer_chunk(list, buffer_obj, 0);

            return dataset._p_rowcount;
        };

        nexacro._convertDatasetSSVToBIN = function (/*ssvdata*/)
        {
            // not use
        };
        nexacro._convertDatasetBINToSSV = function (/*bindata*/)
        {
            // not use
        };

        nexacro._convertStreamSSVToBIN = function (/*ssvdata*/)
        {
            // not use
        };
        nexacro._convertStreamBINToSSV = function (/*bindata*/)
        {
            // not use
        };

        nexacro._completedUpdateResource = nexacro._emptyFn;
        nexacro.__closeSystemCalendar = nexacro._emptyFn;
        nexacro._refreshCssAll = nexacro._emptyFn;

        //==============================================================================
        // nexacro._ProgressBufferManager
        //==============================================================================
        nexacro._ProgressBufferManager = function (ds)
        {
            this._isEnable = false;
            this._target_ds = ds;
            this._firefirstcount = ds.firefirstcount;
            this._is_loaded = false;

            if (nexacro._use_firefirstcount)
                this._is_loaded_firstcount = (ds.firefirstcount > 0) ? false : true;
            else
                this._is_loaded_firstcount = false;

            if (nexacro._use_progress_data)
                this._progressload = ds.progressload ? true : false;
            else
                this._progressload = false;

            this._is_first_load = true;
            this._is_appending = false;
            this._useclientlayout = ds.useclientlayout;
            this._viewrecords_length = 0;

            this._progress_status = 0;  //0:start, 1:loading, 2:end

            this._next_record_idx = 0;  // next record index for loading

            this._ds_start_idx = -1;
            this._ds_end_idx = -1;

            this._row_start_idx = -1;
            this._firstrow_end_idx = -1;
            this._row_end_idx = -1;

            this._colinfo_start_idx = -1;
            this._colinfo_end_idx = -1;

            this._pgConvertFn = null;
        };

        var _pProgressBufferManager = nexacro._createPrototype(nexacro.Object, nexacro._ProgressBufferManager);
        nexacro._ProgressBufferManager.prototype = _pProgressBufferManager;

        _pProgressBufferManager._isLoadedFirstCount = function ()
        {
            return this._is_loaded_firstcount;
        };

        _pProgressBufferManager = null;

        //==============================================================================
        // nexacro._ProgressData
        //==============================================================================
        nexacro._ProgressData = function (parent)
        {
            this._cur_idx = 0;					// index for parsing

            this._received_data_length = 0;
            this._parent = parent;				// parent object (TransactionItem)
            this._rs = undefined;				// record separator
            this._cs = undefined;				// column(unit) separator

            this._data_type = null;             // SSV,CSV,PPX
            this._parse_mode = 0;               // ["root","header", "parameters", "dataset", "constcolinfo", "collinfo", "record","JSON_id","JSON_string"]
            this._load_completed = false;

            this._parameters = [];
            this._datasets = {};                // buffer of datasets
            this._cur_dataset_id = "";          // id of dataset that it is being processed...

            this._error_info = [0, "SUCCESS"];  // received error information

            this._parsing_min_size = 1024 * 4;	// it's minimum size of parsing ;

            this._remain_data = null;

            this._init();
        };

        var _pProgressData = nexacro._createPrototype(nexacro.Object, nexacro._ProgressData);
        nexacro._ProgressData.prototype = _pProgressData;

        _pProgressData._init = function ()
        {
            var out_datasets = this._parent.outputDatasets;
            if (!out_datasets)
            {
                return;
            }

            for (var i = 0, len = out_datasets.length; i < len; i++)
            {
                var param = out_datasets[i];
                if (!this._datasets[param.rval])
                {
                    this._datasets[param.rval] = [];
                }

                var ds = this._parent.context._getDatasetObject(param.lval);
                if (ds)
                {
                    var buffer_manager = new nexacro._ProgressBufferManager(ds);
                    if (param.saveType == "P")
                    {
                        buffer_manager._is_appending = true;
                        buffer_manager._is_first_load = false;				// do not clear dataset

                        if (nexacro._use_firefirstcount)
                        {
                            buffer_manager._is_loaded_firstcount = true;	// ignore firstcount
                        }

                        if (ds.colinfos && ds.colinfos.length > 0)
                        {
                            buffer_manager._useclientlayout = true;		// use client layout
                        }
                    }

                    this._datasets[param.rval].push(buffer_manager);
                }
            }
        };

        _pProgressData._applyChangeInputDataset = function ()
        {
            var in_datasets = this._parent.inputDatasets;
            if (!in_datasets)
            {
                return;
            }

            for (var i = 0, len = in_datasets.length; i < len; i++)
            {
                var param = in_datasets[i];
                var ds = this._parent.context._getDatasetObject(param.rval);
                if (ds)
                {
                    ds.applyChange();
                }
            }
        };

        _pProgressData._on_progress = function (data, bFinal)
        {
            var received_len = data.length;

            if (!bFinal && (received_len < this._parsing_min_size))
            {
                // skip parsing
                return;
            }

            this._received_data_length = data.length;

            var env = nexacro.getEnvironment();
            var datasetloadtype = env.datasetloadtype;
            var error_cd = this._error_info[0];

            if (this._parse_mode > 2 && error_cd <= -1 && datasetloadtype == "onsuccess")
                return;

            this._parse(data, bFinal);
        };

        //_pProgressData._skip_parsing = false;
        _pProgressData._on_progress_arraybuffer_chunk = function (data, bFinal)
        {
            if (this._remain_data)
            {
                var remain_len = this._remain_data.length;
                var merged_data = new Uint8Array(remain_len + data.length);
                merged_data.set(this._remain_data);
                merged_data.set(data, remain_len);
                this._remain_data = null;

                data = merged_data;
            }

            var received_len = data.length;

            if (!bFinal && (received_len < this._parsing_min_size))
            {
                // skip parsing
                this._remain_data = data;
                return;
            }

            //this._skip_parsing = false;

            var env = nexacro.getEnvironment();
            var datasetloadtype = env.datasetloadtype;
            var error_cd = this._error_info[0];

            if (this._parse_mode > 2 && error_cd <= -1 && datasetloadtype == "onsuccess")
                return;

            this._parse_arraybuffer_chunk(data, bFinal);

            //console.log(this._cur_idx + " bytes progressed");

            if (!bFinal)
            {
                this._remain_data = data.subarray(this._cur_idx);
                this._cur_idx = 0;
            }
            else
            {
                this._remain_data = null;
            }
        };

        _pProgressData._needParseForFirstCount = function ()
        {
            if (!nexacro._use_firefirstcount)
            {
                return false;
            }

            for (var buff_ds in this._datasets)
            {
                if (this._datasets.hasOwnProperty(buff_ds))
                {
                    for (var i = 0, len = this._datasets[buff_ds].length; i < len; i++)
                    {
                        var manager = this._datasets[buff_ds][i];
                        if (!manager._isLoadedFirstCount())
                        {
                            return true;
                        }
                    }
                }
            }

            return false;
        };

        _pProgressData._needParseForProgressLoad = function ()
        {
            if (!nexacro._use_progress_data)
            {
                return false;
            }

            for (var buff_ds in this._datasets)
            {
                if (this._datasets.hasOwnProperty(buff_ds))
                {
                    for (var i = 0, len = this._datasets[buff_ds].length; i < len; i++)
                    {
                        var manager = this._datasets[buff_ds][i];
                        if (manager._progressload)
                        {
                            return true;
                        }
                    }
                }
            }

            return false;
        };

        _pProgressData._parseHeader = function (data)
        {
            var i, n;

            if (this._rs instanceof Array)
            {
                for (i = 0; i < this._rs.length; i++)
                {
                    n = data.indexOf(this._rs[i], this._cur_idx);
                    if (n >= 0)
                    {
                        this._cur_idx = n + this._rs[i].length;
                        this._rs = this._rs[i];
                        return true;
                    }
                }
            }
            else
            {
                n = data.indexOf(this._rs, this._cur_idx);
                if (n >= 0)
                {
                    this._cur_idx = n + this._rs.length;
                    return true;
                }
            }

            return false;
        };

        _pProgressData._parseParameters = function (data)
        {
            var i, n;
            var rs_len = 0;

            if (this._rs instanceof Array)
            {
                for (i = 0; i < this._rs.length; i++)
                {
                    n = data.indexOf(this._rs[i], this._cur_idx);
                    if (n >= 0)
                    {
                        rs_len = this._rs[i].length;
                        break;
                    }
                }
            }
            else
            {
                n = data.indexOf(this._rs, this._cur_idx);
                rs_len = this._rs.length;
            }

            if (n >= 0)
            {
                var line = data.substring(this._cur_idx, n);
                var param_arr = line.split(this._cs);

                this._cur_idx = n + rs_len;

                for (i = 0; i < param_arr.length; i++)
                {
                    var param_str = param_arr[i];
                    if (this._data_type == "CSV")
                    {
                        if (param_str.charAt(0) == "\"" || param_str.charAt(0) == "\'")
                        {
                            param_str = param_str.substring(1, param_str.length - 1);
                        }
                    }
                    var varInfo = param_str;
                    var val = undefined;
                    var sep_pos = param_str.indexOf("=");
                    if (sep_pos >= 0)
                    {
                        varInfo = param_str.substring(0, sep_pos);
                        val = param_str.substring(sep_pos + 1);
                        if (val == String.fromCharCode(3))
                            val = undefined;
                    }

                    if (varInfo)
                    {
                        var id = varInfo;
                        sep_pos = varInfo.indexOf(":");
                        if (sep_pos >= 0)
                        {
                            id = varInfo.substring(0, sep_pos);
                        }

                        if (id == "ErrorCode")
                        {
                            var code = parseInt(val) | 0;
                            if (isFinite(code) === false)
                            {
                                val = -1;
                            }
                            else
                            {
                                val = code;
                            }

                            this._error_info[0] = val;
                        }
                        else if (id == "ErrorMsg")
                        {
                            this._error_info[1] = val;
                        }
                        else
                        {
                            this._parent._setParamter(id, val);
                        }

                        this._parameters[this._parameters.length] = { id: id, value: val };
                    }
                }

                if (this._error_info[0] >= 0)
                {
                    this._applyChangeInputDataset();
                }

                return true;
            }

            return false;
        };

        _pProgressData._parseDataset = function (data)
        {
            var i, n;
            var rs_len = 0;

            if (this._rs instanceof Array)
            {
                for (i = 0; i < this._rs.length; i++)
                {
                    n = data.indexOf(this._rs[i], this._cur_idx);
                    if (n >= 0)
                    {
                        rs_len = this._rs[i].length;
                        break;
                    }
                }
            }
            else
            {
                n = data.indexOf(this._rs, this._cur_idx);
                rs_len = this._rs.length;
            }

            if (n >= 0)
            {
                var line = data.substring(this._cur_idx, n);

                var cur_bufferObj;
                var cur_bufferObj_arr = this._datasets[this._cur_dataset_id]
                if (cur_bufferObj_arr)
                {
                    for (i = 0; i < cur_bufferObj_arr.length; i++)
                    {
                        cur_bufferObj = cur_bufferObj_arr[i];

                        cur_bufferObj._row_end_idx = this._cur_idx - rs_len;
                    }
                }

                var sep_pos = line.indexOf(":");
                if (sep_pos > 0)
                {
                    var remoteId = line.substring(sep_pos + 1);
                    if (remoteId && remoteId.length)
                    {
                        var bufferObj;
                        var bufferObj_arr = this._datasets[remoteId];
                        if (bufferObj_arr)
                        {
                            this._cur_dataset_id = remoteId;

                            for (i = 0; i < bufferObj_arr.length; i++)
                            {
                                bufferObj = bufferObj_arr[i];

                                bufferObj._isEnable = true;
                                bufferObj._ds_start_idx = this._cur_idx;
                                bufferObj._ds_end_idx = this._cur_idx + n;
                            }
                        }
                        else
                        {
                            this._cur_dataset_id = "";
                            this._parse_mode = 9;
                        }
                    }
                }

                this._cur_idx = n + rs_len;

                return true;
            }

            return false;
        };

        _pProgressData._parseColInfo = function (data)
        {
            var i, n;
            var rs_len = 0;

            if (this._rs instanceof Array)
            {
                for (i = 0; i < this._rs.length; i++)
                {
                    n = data.indexOf(this._rs[i], this._cur_idx);
                    if (n >= 0)
                    {
                        rs_len = this._rs[i].length;
                        break;
                    }
                }
            }
            else
            {
                n = data.indexOf(this._rs, this._cur_idx);
                rs_len = this._rs.length;
            }

            if (n > 0)
            {
                var bufferObj;
                var bufferObj_arr = this._datasets[this._cur_dataset_id]
                if (bufferObj_arr)
                {
                    for (i = 0; i < bufferObj_arr.length; i++)
                    {
                        bufferObj = bufferObj_arr[i];
                        if (bufferObj._colinfo_start_idx < 0)
                        {
                            bufferObj._colinfo_start_idx = this._cur_idx;
                        }

                        bufferObj._colinfo_end_idx = n;
                    }
                }

                this._cur_idx = n + rs_len;

                return true;
            }
            else
            {
                this._parse_mode = 3;

                return false;
            }
        };

        _pProgressData._parseRecord = function (data)
        {
            var i, n;
            var rs_len = 0;

            if (this._rs instanceof Array)
            {
                for (i = 0; i < this._rs.length; i++)
                {
                    n = data.indexOf(this._rs[i], this._cur_idx);
                    if (n >= 0)
                    {
                        rs_len = this._rs[i].length;
                        break;
                    }
                }
            }
            else
            {
                n = data.indexOf(this._rs, this._cur_idx);
                rs_len = this._rs.length;
            }

            if (nexacro._use_firefirstcount)
            {
                if (n >= 0)
                {
                    this._cur_idx = n + rs_len;

                    var is_max = false;
                    var bufferObj;
                    var bufferObj_arr = this._datasets[this._cur_dataset_id]
                    if (bufferObj_arr)
                    {
                        for (i = 0; i < bufferObj_arr.length; i++)
                        {
                            bufferObj = bufferObj_arr[i];
                            if (bufferObj._row_start_idx < 0)
                            {
                                bufferObj._row_start_idx = this._cur_idx;
                            }

                            if (this._data_type == "SSV" || this._data_type == "PPX")
                            {
                                var rowtype = data.charAt(this._cur_idx);
                                if (rowtype != "d" || rowtype != "D")
                                {
                                    bufferObj._viewrecords_length++;
                                }
                            }
                            else
                            {
                                bufferObj._viewrecords_length++;
                            }

                            if (bufferObj._firefirstcount > 0 && bufferObj._firefirstcount == bufferObj._viewrecords_length)
                            {
                                bufferObj._firstrow_end_idx = n;
                                is_max = true;
                            }
                        }
                    }

                    if (!is_max) return true;
                }

                return false;
            }
            else
            {
                if (n >= 0)
                {
                    this._cur_idx = n + rs_len;

                    return true;
                }
            }

            return false;
        };

        _pProgressData._parse = function (data, bFinal)
        {
            var i;
            var bLoop = true;
            var pre_parse_mode;
            var bufferObj_arr, bufferObj;
            var env = nexacro.getEnvironment();
            var datasetloadtype = env.datasetloadtype;

            while (bLoop)
            {
                pre_parse_mode = this._parse_mode;
                bLoop = this._setNextParseMode(data);
                if (pre_parse_mode == 2 && this._parse_mode != 2)
                {
                    if (this._error_info[0] < 0 && datasetloadtype == "onsuccess")
                    {
                        bLoop = false;
                    }
                }

                if (!bLoop)
                    break;

                switch (this._parse_mode)
                {
                    case 0://root
                        break;
                    case 1://header
                        bLoop = this._parseHeader(data);
                        break;
                    case 2://parameters
                        bLoop = this._parseParameters(data);
                        break;
                    case 3://dataset
                        bLoop = this._parseDataset(data);
                        break;
                    case 4://constcolinfo
                    case 5://collinfo
                        bLoop = this._parseColInfo(data);
                        break;
                    case 6://record
                        bLoop = this._parseRecord(data);

                        if (!bLoop)
                        {
                            bufferObj_arr = this._datasets[this._cur_dataset_id];
                            for (i = 0; i < bufferObj_arr.length; i++)
                            {
                                bufferObj = bufferObj_arr[i];
                                if (nexacro._use_firefirstcount)
                                {
                                    if (bufferObj && bufferObj._viewrecords_length == bufferObj._firefirstcount && !bufferObj._isLoadedFirstCount())   //check firstrow and do firstrow processing...
                                    {
                                        this._on_fire_onload(data, bufferObj, 1);
                                        bufferObj._is_loaded_firstcount = true;
                                        bLoop = true;
                                    }
                                }
                                else
                                {
                                    if (bufferObj._progressload)
                                    {
                                        if (!bFinal)
                                        {
                                            this._on_fire_onload(data, bufferObj, 1);
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    case 9: //skip
                        break;
                    case 10:
                        bufferObj_arr = this._datasets[this._cur_dataset_id];
                        for (i = 0; i < bufferObj_arr.length; i++)
                        {
                            bufferObj = bufferObj_arr[i];
                            if (bufferObj._isEnable)
                            {
                                this._on_fire_onload(data, bufferObj, 0);
                                bufferObj._is_loaded = true;
                                this._parse_mode = 9;
                            }
                        }
                        break;
                    default:
                        break;
                }
            }

            if (bFinal)
            {
                for (var val in this._datasets)
                {
                    bufferObj_arr = this._datasets[val];
                    if (bufferObj_arr)
                    {
                        for (i = 0; i < bufferObj_arr.length; i++)
                        {
                            bufferObj = bufferObj_arr[i];
                            if (bufferObj._isEnable && !bufferObj._is_loaded)
                            {
                                this._on_fire_onload(data, bufferObj, 0);
                            }
                        }
                    }
                }
            }
        };

        _pProgressData._is_accept_dataset = function (dsid)
        {
            return (this._datasets[dsid] != null);
        };

        _pProgressData._is_progressload_dataset = function (dsid)
        {
            var is_progressload = false;

            var datasets = this._datasets[dsid];
            if (datasets)
            {
                for (var i = 0, len = datasets.length; i < len; i++)
                {
                    if (datasets[i]._progressload)
                    {
                        is_progressload = true;
                        break;
                    }
                }
            }

            return is_progressload;
        };

        _pProgressData._parseHeader_arraybuffer_chunk = function (data, offset)
        {
            var cinfo = nexacro._Array2DataUtil.indexOf(data, offset, this._rs_code_array);
            if (cinfo.index < 0) return -1;

            return (cinfo.index + cinfo.byteLength);
        };

        _pProgressData._parseParameters_arraybuffer_chunk = function (data, offset)
        {
            var cinfo = nexacro._Array2DataUtil.substringOf(data, offset, this._rs);
            if (!cinfo.matched) return -1;

            var line = cinfo.string;
            var param_arr = line.split(this._cs);

            //offset = cinfo.nextOffset;

            for (var i = 0; i < param_arr.length; i++)
            {
                var param_str = param_arr[i];
                if (this._data_type == "CSV")
                {
                    if (param_str.charAt(0) == "\"" || param_str.charAt(0) == "\'")
                    {
                        param_str = param_str.substring(1, param_str.length - 1);
                    }
                }
                var varInfo = param_str;
                var val = undefined;
                var sep_pos = param_str.indexOf("=");
                if (sep_pos >= 0)
                {
                    varInfo = param_str.substring(0, sep_pos);
                    val = param_str.substring(sep_pos + 1);
                    if (val == String.fromCharCode(3))
                        val = undefined;
                }

                if (varInfo)
                {
                    var id = varInfo;
                    sep_pos = varInfo.indexOf(":");
                    if (sep_pos >= 0)
                    {
                        id = varInfo.substring(0, sep_pos);
                    }

                    if (id == "ErrorCode")
                    {
                        var code = parseInt(val) | 0;
                        if (isFinite(code) === false)
                        {
                            val = -1;
                        }
                        else
                        {
                            val = code;
                        }

                        this._error_info[0] = val;
                    }
                    else if (id == "ErrorMsg")
                    {
                        this._error_info[1] = val;
                    }
                    else
                    {
                        this._parent._setParamter(id, val);
                    }

                    this._parameters[this._parameters.length] = { id: id, value: val };
                }
            }

            if (this._error_info[0] >= 0 && id == "ErrorCode")
            {
                this._applyChangeInputDataset();
            }

            return cinfo.nextOffset;
        };

        _pProgressData._parseDataset_arraybuffer_chunk = function (data, offset, bFinal)
        {
            var cinfo = nexacro._Array2DataUtil.substringOf(data, offset, this._rs);
            if (!cinfo.matched) return -1;

            var line = cinfo.string;
            var sep_pos, remote_dsid = "";

            this._cur_dataset_id = "";

            if ((sep_pos = line.indexOf(":")) > 0)
            {
                remote_dsid = line.substring(sep_pos + 1);
            }

            if (!remote_dsid || remote_dsid.length == 0)
            {
                this._parse_mode = 9; // skip : unknown dataset id
            }
            else if (!this._is_accept_dataset(remote_dsid))
            {
                this._parse_mode = 9; // skip : not found dataset
            }
            else
            {
                var buffer_obj = this._datasets[remote_dsid];
                if (buffer_obj)
                {
                    for (var i = 0; i < buffer_obj.length; i++)
                        buffer_obj[i]._isEnable = true;
                }

                this._cur_dataset_id = remote_dsid;
                //if (!this._is_progressload_dataset(remote_dsid) && !bFinal)
                //    this._parse_mode = 9; // skip : disallow progress loading
            }

            return cinfo.nextOffset;
        };

        _pProgressData._parseColInfo_arraybuffer_chunk = function (data, offset, bFinal)
        {
            var cur_dsid = this._cur_dataset_id;

            var cinfo = nexacro._Array2DataUtil.substringOf(data, offset, this._rs);
            if ((!bFinal && !cinfo.matched) || cur_dsid == '') return -1;

            if (nexacro._use_firefirstcount) // should load at parse record
                return cinfo.nextOffset;

            var line = cinfo.string;
            var target_ds, buffer_obj, datasets = this._datasets[cur_dsid];

            for (var i = 0, len = datasets.length; i < len; i++)
            {
                buffer_obj = datasets[i];
                //if (buffer_obj._progressload || bFinal)
                if (1)
                {
                    target_ds = buffer_obj._target_ds;

                    if (buffer_obj._is_first_load)
                    {
                        target_ds._p_rowposition = -1;

                        if (buffer_obj._useclientlayout)
                        {
                            target_ds._clearData();
                        }
                        else
                        {
                            target_ds._clearAll();
                        }
                        buffer_obj._is_first_load = false;
                    }

                    if (this._parse_mode == 4)
                        this._setConstColInfo_from_chunk(line, target_ds, buffer_obj._useclientlayout);
                    else if (this._parse_mode == 5)
                        buffer_obj._pgConvertFn = this._setColInfo_from_chunk(line, target_ds, buffer_obj._useclientlayout);
                }
                else
                {
                    // 일부는 progressload 이고, 나머지는 progressload가 아닌 경우,
                    // 데이터를 어디엔가 저장해야 하나?
                    if (buffer_obj._colinfo_start_idx < 0)
                        buffer_obj._colinfo_start_idx = data.byteOffset + offset;

                    buffer_obj._colinfo_end_idx = data.byteOffset + offset + cinfo.byteLength;
                }
            }

            return cinfo.nextOffset;
        };

        _pProgressData._parseRecord_arraybuffer_chunk = function (data, offset, bFinal)
        {
            var cur_dsid = this._cur_dataset_id;

            var cinfo = nexacro._Array2DataUtil.indexOf(data, offset, this._rs_code_array);
            if (cinfo.index < 0 || cur_dsid == '') return -1;

            if (nexacro._use_firefirstcount)
            {
                // todo
            }
            else
            {
                var target_ds, buffer_obj, datasets = this._datasets[cur_dsid];

                var s_pos = offset, e_pos, i;
                var ret = [];
                var len = datasets.length;
                for (i = 0; i < len; i++)
                {
                    buffer_obj = datasets[i];
                    //if (buffer_obj._progressload || bFinal)
                    {
                        target_ds = buffer_obj._target_ds;

                        switch (this._data_type)
                        {
                            case "CSV":
                                //e_pos = target_ds._loadFromSSVUint8Array(data, s_pos, null, -1, buffer_obj._useclientlayout, false, buffer_obj._pgConvertFn);
                                ret = target_ds._loadFromCSVUint8Array(data, s_pos, null, -1, buffer_obj._useclientlayout, false, buffer_obj._pgConvertFn, this._rs);
                                //ret = target_ds._loadFromCSVUint8Array(data, s_pos, colLines, -1, buffer_obj._useclientlayout, false, buffer_obj._pgConvertFn, this._rs);
                                e_pos = ret[0];
                                break;
                            case "SSV":
                                //e_pos = target_ds._loadFromSSVUint8Array(data, s_pos, null, -1, buffer_obj._useclientlayout, false, buffer_obj._pgConvertFn);
                                ret = target_ds._loadFromSSVUint8Array(data, s_pos, null, -1, buffer_obj._useclientlayout, false, buffer_obj._pgConvertFn);
                                e_pos = ret[0];
                                break;
                        }
                    }
                }

                for (i = 0; i < len; i++)
                {
                    buffer_obj = datasets[i];
                    if (!buffer_obj._progressload)
                    {
                        // 일부는 progressload 이고, 나머지는 progressload가 아닌 경우,
                        // 데이터를 어디엔가 저장해야 하나?
                        if (buffer_obj._row_start_idx < 0)
                            buffer_obj._row_start_idx = data.byteOffset + offset;

                        buffer_obj._row_end_idx = data.byteOffset + e_pos - cinfo.byteLength;//cinfo.index + cinfo.byteLength;
                    }
                }

                //return e_pos;
                return ret;
            }

            //return cinfo.index + cinfo.byteLength;
            return [cinfo.index + cinfo.byteLength, false];
        };

        _pProgressData._parseSkip_arraybuffer_chunk = function (data, offset)
        {
            var cinfo = nexacro._Array2DataUtil.indexOf(data, offset, this._rs_code_array);
            if (cinfo.index < 0) return -1;

            return (cinfo.index + cinfo.byteLength);
        };

        _pProgressData._parse_arraybuffer_chunk = function (data, bFinal)
        {
            var i;
            var bLoop = true, s_pos, e_pos;
            var pre_parse_mode, cur_parse_mode;
            var datasets, buffer_obj;
            var env = nexacro.getEnvironment();
            var datasetloadtype = env.datasetloadtype;
            var ret;
            var nullRecord = false;
            var _skip = false;

            if (this._skipbinpos && this._skipbinpos > 0)
            {
                //binary 통신시 bom문자가 붙은 경우 건너 뛰어야 함;
                this._cur_idx = this._skipbinpos;
                this._skipbinpos = 0;
            }

            s_pos = e_pos = this._cur_idx;
            while (bLoop)
            {
                pre_parse_mode = this._parse_mode;

                cur_parse_mode = this._setNextParseMode_arraybuffer(data, s_pos, pre_parse_mode);
                if (pre_parse_mode == 2 && cur_parse_mode != 2)
                {
                    if (this._error_info[0] < 0 && datasetloadtype == "onsuccess")
                        bLoop = false;
                }

                this._parse_mode = cur_parse_mode;

                if (!bLoop)
                    break;

                switch (cur_parse_mode)
                {
                    case 0://root
                        break;
                    case 1://header
                        e_pos = this._parseHeader_arraybuffer_chunk(data, s_pos);
                        break;
                    case 2://parameters
                        e_pos = this._parseParameters_arraybuffer_chunk(data, s_pos);
                        break;
                    case 3://dataset
                        e_pos = this._parseDataset_arraybuffer_chunk(data, s_pos, bFinal);
                        break;
                    case 4://constcolinfo
                    case 5://collinfo
                        e_pos = this._parseColInfo_arraybuffer_chunk(data, s_pos, bFinal);
                        break;
                    case 6://record
                        //e_pos = this._parseRecord_arraybuffer_chunk(data, s_pos);
                        ret = this._parseRecord_arraybuffer_chunk(data, s_pos, bFinal);
                        e_pos = ret[0];
                        nullRecord = ret[1];
                        break;

                    case 9: //skip
                        e_pos = this._parseSkip_arraybuffer_chunk(data, s_pos);
                        break;
                    default:
                        break;
                }

                bLoop = (e_pos > -1);
                if (e_pos > -1)
                    s_pos = e_pos;

                //if (!bLoop && this._cur_dataset_id)// && cur_parse_mode == 6)               
                if ((!bLoop || nullRecord) && this._cur_dataset_id)// && cur_parse_mode == 6)
                {
                    datasets = this._datasets[this._cur_dataset_id];
                    for (i = 0; i < datasets.length; i++)
                    {
                        buffer_obj = datasets[i];
                        if (nexacro._use_firefirstcount)
                        {
                            // todo
                            //if (buffer_obj && buffer_obj._viewrecords_length == buffer_obj._firefirstcount && !buffer_obj._isLoadedFirstCount())   //check firstrow and do firstrow processing...
                            //{
                            //    this._on_fire_onload_arraybuffer(data, buffer_obj, 1);
                            //    buffer_obj._is_loaded_firstcount = true;
                            //    bLoop = true;
                            //}
                        }
                        else if (buffer_obj._progressload || (buffer_obj._progressload && bFinal))
                        {
                            var _is_loading = 1;
                            if (bFinal)
                            {
                                _is_loading = 0;
                                _skip = true;
                            }
                            this._on_fire_onload_arraybuffer_chunk(data, buffer_obj, _is_loading);
                        }
                    }

                    nullRecord = false;
                }
            }

            this._cur_idx = s_pos;

            if (bFinal && !_skip) //Dataset 여러개 progressload일경우 확인필요함
            {
                for (var val in this._datasets)
                {
                    datasets = this._datasets[val];
                    if (datasets)
                    {
                        for (i = 0; i < datasets.length; i++)
                        {
                            buffer_obj = datasets[i];
                            if (buffer_obj._isEnable && !buffer_obj._is_loaded)
                            {
                                this._on_fire_onload_arraybuffer_chunk(data, buffer_obj, 0);
                            }
                        }
                    }
                }
            }
        };

        _pProgressData._on_fire_onload = function (data, bufferObj, nLoadType)
        {
            var ds = bufferObj._target_ds, buff;
            var errorcode = this._error_info[0];
            var errormsg = this._error_info[1];

            if (nLoadType == 1)
            {
                if (nexacro._use_firefirstcount)
                    buff = data.slice(bufferObj._colinfo_start_idx, bufferObj._firstrow_end_idx);
                else
                    buff = data.slice(bufferObj._colinfo_start_idx, this._cur_idx);
            }
            else
            {
                if (bufferObj._row_end_idx < 0)
                    bufferObj._row_end_idx = data.length;
                buff = data.slice(bufferObj._colinfo_start_idx, bufferObj._row_end_idx);
            }

            var rs = "";
            if (this._rs instanceof Array)
                rs = this._rs.join("|");
            else
                rs = this._rs;

            var lines = buff.split(new RegExp(rs));

            if (bufferObj._progress_status == 0)
                ds._p_rowposition = -1;

            var colLine, line_idx, colLines;
            switch (this._data_type)
            {
                case "CSV":
                    colLine = lines[0];
                    if (!bufferObj._pgConvertFn)
                    {
                        if (bufferObj._is_first_load)
                        {
                            if (bufferObj._useclientlayout)
                            {
                                ds._clearData();
                            }
                            else
                            {
                                ds._clearAll();
                            }
                        }

                        bufferObj._pgConvertFn = ds._setColInfoFromCSVLine(colLine, bufferObj._useclientlayout);
                    }

                    lines.splice(0, 1);
                    line_idx = ds._loadFromCSVArray(colLine, lines, bufferObj._next_record_idx, -1, bufferObj._useclientlayout, false, bufferObj._pgConvertFn);
                    break;
                case "SSV":
                    colLines = ds._getColLinesFromSSVLines(lines, 0);
                    if (!bufferObj._pgConvertFn)
                    {
                        if (bufferObj._is_first_load)
                        {
                            if (bufferObj._useclientlayout)
                            {
                                ds._clearData();
                            }
                            else
                            {
                                ds._clearAll();
                            }
                        }

                        bufferObj._pgConvertFn = ds._setColInfoFromSSVLines(colLines, bufferObj._useclientlayout);
                    }

                    lines.splice(0, colLines.length);
                    line_idx = ds._loadFromSSVArray(colLines, lines, bufferObj._next_record_idx, -1, bufferObj._useclientlayout, false, bufferObj._pgConvertFn);
                    break;
                /*  deprecated
                case "PPX":
                    colLines = ds._getColLinesFromPPXLines(lines, 0);
                    lines.splice(0, colLines.length);
                    line_idx = ds._loadFromPPXArray(colLines, lines, bufferObj._next_record_idx, -1, bufferObj._useclientlayout, bufferObj._is_first_load);
                    break;
                    */
                default:
                    break;
            }
            bufferObj._is_first_load = false;

            if (nLoadType === 0 && !bufferObj._isLoadedFirstCount() && nexacro._use_firefirstcount)     // it runs just once if firstcount is bigger than rowcount.
            {
                bufferObj._is_loaded_firstcount = true;
            }

            if (nLoadType === 0)
            {
                bufferObj._progressload = false;
                bufferObj._pgConvertFn = null;
            }

            if (ds.colinfos)
            {
                ds._reFilter();
                ds._resetSortGroup();
            }

            if (ds._eventstat)
            {
                var is_appending = bufferObj._is_appending;
                ds.on_fire_onload(errorcode, errormsg, is_appending ? 12 : nLoadType, (nLoadType == 1) ? true : ((bufferObj._progress_status != 0) ? true : false)); //nexacro.Dataset.REASON_LOAD(0) or nexacro.Dataset.REASON_APPEND(12)
                if (bufferObj._progress_status == 0)
                {
                    if (ds._viewRecords && ds._viewRecords.length > 0)
                    {
                        ds._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    }
                    else
                    {
                        ds._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    }
                    bufferObj._progress_status = 1;
                }

                if (nLoadType == 0)
                    bufferObj._progress_status = 2;
            }
            else if (ds._viewRecords && ds._viewRecords.length > 0)
            {
                ds._p_rowposition = 0;
            }

            bufferObj._next_record_idx = line_idx;
        };

        _pProgressData._on_fire_onload_arraybuffer_chunk = function (data, bufferObj, isloading)
        {
            var ds = bufferObj._target_ds, cur_parse_mode = this._parse_mode;

            var errorcode = this._error_info[0];
            var errormsg = this._error_info[1];

            if (bufferObj._row_start_idx > -1 && bufferObj._row_end_idx < 0)
                bufferObj._row_end_idx = data.length;

            if (!isloading && !bufferObj._isLoadedFirstCount() && nexacro._use_firefirstcount)     // it runs just once if firstcount is bigger than rowcount.
            {
                bufferObj._is_loaded_firstcount = true;
            }

            if (!isloading)
            {
                bufferObj._progressload = false;
                bufferObj._pgConvertFn = null;
            }

            if (cur_parse_mode == 6 && ds.colinfos)
            {
                ds._reFilter();
                ds._resetSortGroup();
            }

            if (ds._eventstat)
            {
                var is_appending = bufferObj._is_appending;
                var progressload = false;
                if (isloading == 1 || (isloading != 1 && bufferObj._progress_status != 0))
                {
                    progressload = true;
                }

                ds.on_fire_onload(errorcode, errormsg, is_appending ? 12 : isloading, progressload); //nexacro.Dataset.REASON_LOAD(0) or nexacro.Dataset.REASON_APPEND(12)
                if (bufferObj._progress_status == 0)
                {
                    if (ds._viewRecords && ds._viewRecords.length > 0)
                    {
                        ds._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    }
                    else
                    {
                        ds._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    }
                    bufferObj._progress_status = 1;
                }
            }
            else if (ds._viewRecords && ds._viewRecords.length > 0)
            {
                ds._p_rowposition = 0;
            }
        };

        _pProgressData._parseConstColInfo = nexacro._emptyFn;
        _pProgressData._setNextParseMode = nexacro._emptyFn;
        _pProgressData._setConstColInfo_from_chunk = nexacro._emptyFn;
        _pProgressData._setColInfo_from_chunk = nexacro._emptyFn;

        _pProgressData = null;

        //==============================================================================
        // nexacro._ProgressDataCSV
        //==============================================================================
        nexacro._ProgressDataCSV = function (parent, rs)
        {
            nexacro._ProgressData.call(this, parent);
            this._data_type = "CSV";

            if (rs)
                this._rs = rs;
            else
                this._rs = rs = ["\r\n", "\n"];

            this._cs = ",";

            var i, rs_len = 0, len = rs.length;
            if (rs && rs instanceof Array)
            {
                for (i = 0; i < len; i++)
                {
                    rs_len = rs[i].length;
                }
            }
            else
            {
                rs_len = rs ? rs.length : 0;
            }
            this._rs_len = rs_len;

            var rs_code_array = [];
            for (i = 0; i < len; i++)
            {
                rs_code_array[i] = rs[i].charCodeAt(0);
            }
            this._rs_code_array = rs_code_array;
        };

        var _pProgressDataCSV = nexacro._createPrototype(nexacro._ProgressData, nexacro._ProgressDataCSV);
        nexacro._ProgressDataCSV.prototype = _pProgressDataCSV;

        _pProgressDataCSV._setNextParseMode = function (data)
        {
            var sec_type_max_len = 10;
            var sec = data.substr(this._cur_idx, sec_type_max_len).toUpperCase();

            if (this._parse_mode === 0)
            {
                this._parse_mode = 1;   //header
            }
            else if (sec.indexOf("DATASET") === 0)
            {
                this._parse_mode = 3;
            }
            else
            {
                var buff, n, rs, i;
                var regexp;
                switch (this._parse_mode)
                {
                    case 0://root
                        break;
                    case 1://header
                        this._parse_mode = 2;
                        break;
                    case 2://parameters
                        //this._parse_mode = 2;
                        break;
                    case 3://dataset
                        this._parse_mode = 5;
                        break;
                    case 5://collinfo
                        this._parse_mode = 6;
                        break;
                    case 6://record
                        buff = data.slice(this._cur_idx, data.length);
                        n = -1;
                        for (i = 0; i < this._rs.length; i++)
                        {
                            rs = this._rs[i];
                            regexp = new RegExp(rs + "dataset", "gi");
                            n = buff.search(regexp);
                            if (n >= 0)
                                break;
                        }

                        var bufferObj_arr = this._datasets[this._cur_dataset_id];
                        if (bufferObj_arr)
                        {
                            if (n >= 0)
                            {
                                for (i = 0; i < bufferObj_arr.length; i++)
                                {
                                    bufferObj_arr[i]._row_end_idx = this._cur_idx + n;
                                }

                                this._cur_idx += n + rs.length;
                                this._parse_mode = 10;      // fire onload
                            }
                            else
                            {
                                if (nexacro._use_firefirstcount)
                                {
                                    for (i = 0; i < bufferObj_arr.length; i++)
                                    {
                                        if (bufferObj_arr[i]._isLoadedFirstCount())
                                        {
                                            this._cur_idx = data.length;
                                            return false;
                                        }
                                    }
                                }
                                else
                                {
                                    var rs_len = 0;
                                    for (i = 0; i < this._rs.length; i++)
                                    {
                                        n = data.lastIndexOf(this._rs[i]);
                                        if (n >= 0)
                                        {
                                            rs_len = this._rs[i].length;
                                            break;
                                        }
                                    }

                                    this._cur_idx = n + rs_len;
                                }
                            }
                        }
                        break;
                    case 9: //skip
                        buff = data.slice(this._cur_idx, data.length);
                        n = -1;
                        for (i = 0; i < this._rs.length; i++)
                        {
                            regexp = new RegExp(this._rs[i] + "dataset", "gi");
                            n = buff.search(regexp);
                            if (n >= 0)
                                break;
                        }

                        if (n >= 0)
                        {
                            this._cur_idx += n + rs.length;
                            this._parse_mode = 3;      // fire onload
                        }
                        else
                        {
                            this._cur_idx = data.length;
                            return false;
                        }
                        break;
                    default:
                        return false;
                }
            }
            return true;
        };

        _pProgressDataCSV._setNextParseMode_arraybuffer = function (data, offset, cur_parse_mode)
        {
            var pos = offset;

            var cinfo = nexacro._Array2DataUtil.substr(data, pos, 10);
            var str = cinfo.string.toUpperCase();

            var next_parse_mode = cur_parse_mode;

            if (str.length >= 8 && str.indexOf("DATASET:") === 0)
            {
                next_parse_mode = 3;
            }
            else
            {
                switch (cur_parse_mode)
                {
                    case 0://root
                        next_parse_mode = 1;
                        break;

                    case 1://header
                        if (str.substr(0, 4) != "CSV:")
                            next_parse_mode = 2;
                        break;

                    case 2://parameters
                        break;
                    case 3://dataset
                        //next_parse_mode = 6;
                        next_parse_mode = 5;
                        break;
                    case 5://collinfo
                        //next_parse_mode = 5;
                        next_parse_mode = 6;
                        break;

                    case 6://record
                        break;

                    case 7://JSON_id
                        break;

                    case 8://JSON_string
                        break;

                    case 9:
                        break;

                    default:
                        break;
                }
            }

            return next_parse_mode;
        };

        _pProgressDataCSV._setColInfo_from_chunk = function (colLine, target_ds, bOrgLayout)
        {
            if (colLine == '' || !target_ds) return;

            var _convertFn = null;
            if (bOrgLayout)
            {
                var colArr = colLine.split(",");
                var csvColCnt = colArr.length;
                _convertFn = target_ds.__makeDataMappingFunc(colArr, csvColCnt, "C");
            }
            else
            {
                target_ds.__csvSetColInfo(colLine);
                _convertFn = target_ds.__makeDataConvertFunc("C");
            }

            return _convertFn;
        };

        _pProgressDataCSV = null;

        //==============================================================================
        // nexacro._ProgressDataSSV
        //==============================================================================
        nexacro._ProgressDataSSV = function (parent)
        {
            nexacro._ProgressData.call(this, parent);
            this._data_type = "SSV";

            this._rs = nexacro._getSSVRecordSeparator();
            this._cs = nexacro._getSSVUnitSeparator();

            var i, rs_len, len = this._rs.length;
            if (this._rs instanceof Array)
            {
                for (i = 0; i < len; i++)
                {
                    rs_len = this._rs[i].length;
                }
            }
            else
            {
                rs_len = this._rs.length;
            }
            this._rs_len = rs_len;

            var rs_code_array = [];
            for (i = 0; i < len; i++)
            {
                rs_code_array[i] = this._rs[i].charCodeAt(i);
            }
            this._rs_code_array = rs_code_array;
        };

        var _pProgressDataSSV = nexacro._createPrototype(nexacro._ProgressData, nexacro._ProgressDataSSV);
        nexacro._ProgressDataSSV.prototype = _pProgressDataSSV;

        _pProgressDataSSV._setNextParseMode = function (data)
        {
            var sec_type_max_len = 10;
            var sec = data.substr(this._cur_idx, sec_type_max_len).toUpperCase();

            if (this._parse_mode === 0)
            {
                this._parse_mode = 1;   //header
            }
            else if (sec.indexOf("DATASET") === 0)
            {
                this._parse_mode = 3;
            }
            else if (sec.indexOf("JSONOBJECT") === 0)
            {
                this._parse_mode = 7;
            }
            else
            {
                var buff, regexp, n;
                switch (this._parse_mode)
                {
                    case 0://root
                        break;
                    case 1://header
                        this._parse_mode = 2;
                        break;
                    case 2://parameters
                        //this._parse_mode = 2;
                        break;
                    case 3://dataset
                        if (sec.indexOf("_CONST_") === 0)
                            this._parse_mode = 4;
                        else
                            this._parse_mode = 5;
                        break;
                    case 4://constcolinfo
                        this._parse_mode = 5;
                        break;
                    case 5://collinfo
                        this._parse_mode = 6;
                        break;
                    case 6://record
                        var bufferObj_arr = this._datasets[this._cur_dataset_id];
                        if (bufferObj_arr)
                        {
                            buff = data.slice(this._cur_idx, data.length);
                            regexp = new RegExp(this._rs + "dataset", "gi");
                            n = buff.search(regexp);

                            for (var i = 0; i < bufferObj_arr.length; i++)
                            {
                                var bufferObj = bufferObj_arr[i];
                                if (bufferObj._isLoadedFirstCount() || !nexacro._use_firefirstcount)
                                {
                                    if (n >= 0)
                                    {
                                        bufferObj._row_end_idx = this._cur_idx + n;
                                    }
                                }
                            }

                            if (n >= 0)
                            {
                                this._cur_idx += n + this._rs.length;
                                this._parse_mode = 10;      // fire onload
                            }
                            else
                            {
                                if (nexacro._use_firefirstcount)
                                {
                                    this._cur_idx = data.length;
                                    return false;
                                }
                                else
                                {
                                    this._cur_idx = data.lastIndexOf(this._rs);
                                    this._cur_idx += this._rs.length;
                                }
                            }
                        }
                        break;
                    case 7://JSON_id
                        this._parse_mode = 8;
                        break;
                    case 8://JSON_string
                        break;
                    case 9:
                        buff = data.slice(this._cur_idx, data.length);
                        regexp = new RegExp(this._rs + "dataset", "gi");
                        n = buff.search(regexp);
                        if (n >= 0)
                        {
                            this._cur_idx += n + this._rs.length;
                            this._parse_mode = 3;
                        }
                        else
                        {
                            this._cur_idx = data.length;
                            return false;
                        }
                        break;
                    default:
                        return false;
                }
            }
            return true;
        };

        _pProgressDataSSV._setNextParseMode_arraybuffer = function (data, offset, cur_parse_mode)
        {
            var pos = offset;

            var cinfo = nexacro._Array2DataUtil.substr(data, pos, 11);
            var str = cinfo.string.toUpperCase();

            var next_parse_mode = cur_parse_mode;

            if (str.length >= 8 && str.indexOf("DATASET:") === 0)
            {
                next_parse_mode = 3;
            }
            else if (str.length >= 11 && str.indexOf("JSONOBJECT:") === 0)
            {
                next_parse_mode = 7;
            }
            else
            {
                switch (cur_parse_mode)
                {
                    case 0://root
                        next_parse_mode = 1;
                        break;

                    case 1://header
                        if (str.substr(0, 4) != "SSV:")
                            next_parse_mode = 2;
                        break;

                    case 2://parameters
                        break;

                    case 3://dataset
                        if (str.length >= 7 && str.indexOf("_CONST_") === 0)
                            next_parse_mode = 4;
                        //else if (str.length >= 9 && str.indexOf("_ROWTYPE_") === 0)
                        //    next_parse_mode = 5;
                        else
                            next_parse_mode = 5;
                        break;

                    case 4://constcolinfo
                        if (str.length >= 7 && str.indexOf("_CONST_") === 0)
                            next_parse_mode = 4;
                        else if (str.length >= 9 && str.indexOf("_ROWTYPE_") === 0)
                            next_parse_mode = 5;
                        else
                            next_parse_mode = 6;
                        break;

                    case 5://collinfo
                        if (str.length >= 9 && str.indexOf("_ROWTYPE_") === 0)
                            next_parse_mode = 5;
                        else
                            next_parse_mode = 6;
                        break;

                    case 6://record
                        break;

                    case 7://JSON_id
                        break;

                    case 8://JSON_string
                        break;

                    case 9:
                        break;

                    default:
                        break;
                }
            }

            return next_parse_mode;

        };

        _pProgressDataSSV._setConstColInfo_from_chunk = function (colLine, target_ds, bOrgLayout)
        {
            if (colLine == '' || !target_ds) return;

            //if (bOrgLayout)
            //{
            if (colLine.substring(0, 7) == "_Const_")
            {
                target_ds.__ssvSetConstColInfo(colLine);
            }
            //}
            /*
            else
            {
                if (colLine.substring(0, 7) == "_Const_")
                {
                    target_ds.__ssvSetConstColInfo(colLine);
                }
            }
            */
        };

        _pProgressDataSSV._setColInfo_from_chunk = function (colLine, target_ds, bOrgLayout)
        {
            if (colLine == '' || !target_ds) return;

            var _convertFn = null;
            if (bOrgLayout)
            {
                if (colLine.substring(0, 9) == "_RowType_")
                {
                    var _cs_ = nexacro._getSSVUnitSeparator();
                    var colArr = colLine.substring(10, colLine.length).split(_cs_);
                    _convertFn = target_ds.__makeDataMappingFunc(colArr, colArr.length, "S");
                }
            }
            else
            {
                if (colLine.substring(0, 9) == "_RowType_")
                {
                    target_ds.__ssvSetColInfo(colLine);
                    _convertFn = target_ds.__makeDataConvertFunc("S");
                }
            }

            return _convertFn;
        };

        _pProgressDataSSV = null;

        //==============================================================================
        // nexacro._ProgressDataPPX ( Deprecated )
        //==============================================================================
        nexacro._ProgressDataPPX = function (parent)
        {
            nexacro._ProgressData.call(this, parent);
            this._data_type = "PPX";

            this._rs = String.fromCharCode(30);
            this._cs = String.fromCharCode(31);
        };

        var _pProgressDataPPX = nexacro._createPrototype(nexacro._ProgressData, nexacro._ProgressDataPPX);
        nexacro._ProgressDataPPX.prototype = _pProgressDataPPX;

        _pProgressDataPPX._parseParameters = function (data)
        {
            var line = "";
            var n = -1;

            n = data.indexOf(this._rs, this._cur_idx);

            if (n >= 0)
            {
                line = data.substring(this._cur_idx, n);
            }
            else
                return false;

            this._cur_idx = n + this._rs.length;

            var form = this._parent.context;
            var param_arr = line.split(this._cs);
            var id = param_arr[1];
            var val = param_arr[2];

            if (val == String.fromCharCode(3))
                val = undefined;

            if (id == "ErrorCode")
            {
                var code = parseInt(val) | 0;
                if (isFinite(code) === false)
                {
                    val = -1;
                }
                else
                {
                    val = code;
                }

                this._error_info[0] = val;
            }
            else if (id == "ErrorMsg")
            {
                this._error_info[1] = param_arr[2];
            }
            else
            {
                this._parent._setParamter(id, val);
            }

            this._parameters[this._parameters.length] = { id: id, value: val };

            if (this._error_info[0] >= 0)
                this._applyChangeInputDataset();

            return true;
        };

        _pProgressDataPPX._parseDataset = function (data)
        {
            var line = "";

            var n = data.indexOf(this._rs, this._cur_idx);
            if (n > 0)
            {
                line = data.substring(this._cur_idx, n);
            }
            else
                return false;

            if (this._cur_dataset_id)
            {
                var cur_buffer_obj = this._datasets[this._cur_dataset_id];
                cur_buffer_obj._row_end_idx = this._cur_idx - this._rs.length;
            }

            var remoteId = line.split(this._cs)[1];
            if (remoteId && remoteId.length)
            {
                var buffer_obj = this._datasets[remoteId];
                if (buffer_obj)
                {
                    buffer_obj._isEnable = true;
                    this._cur_dataset_id = remoteId;

                    buffer_obj._ds_start_idx = this._cur_idx;
                    buffer_obj._ds_end_idx = this._cur_idx + n;
                }
                else
                {
                    this._cur_dataset_id = "";
                    this._parse_mode = 9;
                }
            }
            //else skip

            this._cur_idx = n + this._rs.length;
            return true;
        };

        _pProgressDataPPX._setNextParseMode = function (data)
        {
            if (this._parse_mode === 0)
            {
                this._parse_mode = 1;   //header
            }
            else if (data.charAt(this._cur_idx) == "D")
            {
                this._parse_mode = 3;   //Dataset
            }
            else
            {
                var buff, buffer_obj, regexp, n;
                switch (this._parse_mode)
                {
                    case 0://root
                        break;
                    case 1://header
                        this._parse_mode = 2;
                        break;
                    case 2://parameters
                        //this._parse_mode = 2;
                        break;
                    case 3://dataset
                    case 4://constcolinfo
                    case 5://collinfo
                        if (data.charAt(this._cur_idx) == "V")
                            this._parse_mode = 4;
                        else if (data.charAt(this._cur_idx) == "C")
                            this._parse_mode = 5;
                        else
                            this._parse_mode = 6;
                        break;
                    case 6://record
                        buffer_obj = this._datasets[this._cur_dataset_id];
                        if (buffer_obj._isLoadedFirstCount() || !nexacro._use_firefirstcount)
                        {
                            buff = data.slice(this._cur_idx, data.length);
                            //var regexp = new RegExp("\\x" + this._rs.charCodeAt(0).toString(16) + "D", "gi");
                            regexp = new RegExp(this._rs + "D", "gi");
                            n = buff.search(regexp);
                            if (n >= 0)
                            {
                                buffer_obj._row_end_idx = this._cur_idx + n;
                                this._cur_idx += n + this._rs.length;
                                this._parse_mode = 10;      // fire onload
                            }
                            else
                            {
                                this._cur_idx = data.length;
                                return false;
                            }
                        }
                        break;
                    case 9:
                        buff = data.slice(this._cur_idx, data.length);
                        regexp = new RegExp(this._rs + "D", "gi");
                        n = buff.search(regexp);
                        if (n >= 0)
                        {
                            this._cur_idx += n + this._rs.length;
                            this._parse_mode = 3;
                        }
                        else
                        {
                            this._cur_idx = data.length;
                            return false;
                        }
                        break;
                    default:
                        return false;
                }
            }

            return true;
        };

        _pProgressDataPPX = null;

        //==============================================================================
        // nexacro._ProgressDataXML
        //==============================================================================
        nexacro._ProgressDataXML = function (parent)
        {
            nexacro._ProgressData.call(this, parent);
            this._data_type = "XML";

            this._rs = String.fromCharCode(30);
            this._cs = String.fromCharCode(31);

            this._parameters_start_idx = -1;
            this._parameters_end_idx = -1;

            this._parameters_tag = ["<Parameters>", "</Parameters>", "<Parameters/>"];
            this._dataset_tag = ["<Dataset", "</Dataset>", "<Dataset/>"];
            this._colinfo_tag = ["<ColumnInfo>", "</ColumnInfo>", "<ColumnInfo/>"];
            this._col_tag = ["<Col ", "</Col>", "<Col/>"];
            this._rows_tag = ["<Rows>", "</Rows>", "<Rows/>"];
            this._row_tag = ["<Row", "</Row>", "<Row/>"];
        };

        var _pProgressDataXML = nexacro._createPrototype(nexacro._ProgressData, nexacro._ProgressDataXML);
        nexacro._ProgressDataXML.prototype = _pProgressDataXML;

        _pProgressDataXML._getTokenArrayFromString = function (str)
        {
            if (!str) return;
            var arr = [];
            for (var i = 0; i < str.length; i++)
            {
                arr[i] = str[i].charCodeAt(0);
            }
            return arr;
        }

        _pProgressDataXML._setNextParseMode_arraybuffer = function (data, pos, cur_parse_mode)
        {
            var start_idx, end_idx;
            var next_parse_mode = cur_parse_mode;
            if (this._parse_mode == 0)
            {
                next_parse_mode = 1;   //parameters
            }
            else
            {
                switch (this._parse_mode)
                {
                    case 0://root
                        break;
                    case 1://parameters
                        start_idx = nexacro._Array2DataUtil.indexOf(data, this._cur_idx, this._getTokenArrayFromString(this._parameters_tag[0])).index;
                        if (start_idx > -1)
                        {
                            this._parameters_start_idx = start_idx;
                            this._cur_idx = start_idx;

                            end_idx = nexacro._Array2DataUtil.indexOf(data, this._cur_idx, this._getTokenArrayFromString(this._parameters_tag[1])).index;

                            if (end_idx > -1)
                            {
                                this._parameters_end_idx = end_idx + this._parameters_tag[1].length;
                                this._cur_idx = end_idx + this._parameters_tag[1].length;
                                next_parse_mode = 2;
                            }
                            else
                            {
                                start_idx = nexacro._Array2DataUtil.indexOf(data, this._cur_idx, this._getTokenArrayFromString(this._dataset_tag[0])).index;
                                if (start_idx > -1)
                                {
                                    this._parameters_end_idx = start_idx - 1;
                                    //this._cur_idx = end_idx + this._parameters_tag[1].length;
                                }
                                next_parse_mode = 2;
                            }
                        }
                        else
                        {
                            start_idx = nexacro._Array2DataUtil.indexOf(data, this._cur_idx, this._getTokenArrayFromString(this._parameters_tag[0])).index;

                            if (start_idx > -1)
                            {
                                this._parameters_start_idx = start_idx;
                                this._parameters_end_idx = start_idx + this._parameters_tag[2].length;
                                this._cur_idx += this._parameters_tag[2].length;
                            }

                            next_parse_mode = 3;
                        }
                        break;
                    case 2://dataset
                        start_idx = nexacro._Array2DataUtil.indexOf(data, this._cur_idx, this._getTokenArrayFromString(this._dataset_tag[0])).index;

                        if (start_idx > -1)
                        {
                            next_parse_mode = 3;
                        }
                        else
                            return 20;

                        break;
                    case 3://colinfo
                        start_idx = nexacro._Array2DataUtil.indexOf(data, this._cur_idx, this._getTokenArrayFromString(this._colinfo_tag[0])).index;

                        if (start_idx > -1)
                        {
                            next_parse_mode = 5;
                        }
                        else
                            return 20;

                        break;
                    case 4://constcolinfo
                    case 5://Rows tag
                        start_idx = nexacro._Array2DataUtil.indexOf(data, this._cur_idx, this._getTokenArrayFromString(this._rows_tag[0])).index;
                        if (start_idx > -1)
                        {
                            this._cur_idx = start_idx;// + this._rows_tag[0].length;
                            next_parse_mode = 6;
                        }
                        else
                            return 20;

                        break;
                    case 6://record
                        var bufferObj_arr = this._datasets[this._cur_dataset_id];
                        if (bufferObj_arr)
                        {
                            for (var i = 0; i < bufferObj_arr.length; i++)
                            {
                                var bufferObj = bufferObj_arr[i];
                                if (bufferObj._isLoadedFirstCount() || !nexacro._use_firefirstcount)
                                {
                                    start_idx = nexacro._Array2DataUtil.indexOf(data, this._cur_idx, this._getTokenArrayFromString(this._dataset_tag[0])).index;
                                    if (start_idx >= 0)
                                    {
                                        bufferObj._row_start_idx = start_idx;
                                        //this._cur_idx = start_idx;
                                        //next_parse_mode = 10;
                                    }
                                    else
                                    {
                                        start_idx = nexacro._Array2DataUtil.indexOf(data, this._cur_idx, this._getTokenArrayFromString(this._colinfo_tag[0])).index;
                                        if (start_idx > -1)
                                        {
                                            next_parse_mode = 4;
                                        }
                                        else
                                            next_parse_mode = 6;
                                    }
                                }
                            }
                        }
                        break;
                    case 9:
                        start_idx = nexacro._Array2DataUtil.indexOf(data, this._cur_idx, this._getTokenArrayFromString(this._dataset_tag[0])).index;
                        if (start_idx > -1)
                        {
                            this._cur_idx = start_idx;
                            next_parse_mode = 3;
                        }
                        else
                        {
                            this._cur_idx = data.length;
                            return 20;
                        }
                        break;
                    case 33:
                        next_parse_mode = 3;
                        break;
                    default:
                        return 20;
                }
            }

            return next_parse_mode;
        }

        _pProgressDataXML._setNextParseMode = function (data)
        {
            var start_idx, end_idx;

            if (this._parse_mode == 0)
            {
                this._parse_mode = 1;   //header
            }
            else
            {
                switch (this._parse_mode)
                {
                    case 0://root
                        break;
                    case 1://header
                        start_idx = data.indexOf(this._parameters_tag[0], this._cur_idx);

                        if (start_idx > -1)
                        {
                            this._parameters_start_idx = start_idx;
                            this._cur_idx = start_idx;

                            end_idx = data.indexOf(this._parameters_tag[1], this._cur_idx);

                            if (end_idx > -1)
                            {
                                this._parameters_end_idx = end_idx + this._parameters_tag[1].length;
                                this._cur_idx = end_idx + this._parameters_tag[1].length;
                                this._parse_mode = 2;
                            }
                            else
                                return false;
                        }
                        else
                        {
                            start_idx = data.indexOf(this._parameters_tag[2], this._cur_idx);

                            if (start_idx > -1)
                            {
                                this._parameters_start_idx = start_idx;
                                this._parameters_end_idx = start_idx + this._parameters_tag[2].length;
                                this._cur_idx += this._parameters_tag[2].length;
                            }

                            this._parse_mode = 3;
                        }
                        break;
                    case 2://parameters
                        start_idx = data.indexOf(this._dataset_tag[0], this._cur_idx);

                        if (start_idx > -1)
                        {
                            this._parse_mode = 3;
                        }
                        else
                            return false;

                        break;
                    case 3://dataset
                        start_idx = data.indexOf(this._colinfo_tag[0], this._cur_idx);

                        if (start_idx > -1)
                        {
                            this._parse_mode = 5;
                        }
                        else
                            return false;

                        break;
                    case 4://constcolinfo
                    case 5://collinfo
                        start_idx = data.indexOf(this._rows_tag[0], this._cur_idx);
                        if (start_idx > -1)
                        {
                            this._cur_idx = start_idx + this._rows_tag[0].length;
                            this._parse_mode = 6;
                        }
                        else
                            return false;

                        break;
                    case 6://record
                        var bufferObj_arr = this._datasets[this._cur_dataset_id];
                        if (bufferObj_arr)
                        {
                            for (var i = 0; i < bufferObj_arr.length; i++)
                            {
                                var bufferObj = bufferObj_arr[i];
                                if (bufferObj._isLoadedFirstCount() || !nexacro._use_firefirstcount)
                                {
                                    start_idx = data.indexOf(this._dataset_tag[0], this._cur_idx);
                                    if (start_idx >= 0)
                                    {
                                        bufferObj._row_end_idx = start_idx;
                                        this._cur_idx = start_idx;
                                        this._parse_mode = 10;
                                    }
                                    else
                                    {
                                        this._cur_idx = data.length;
                                    }
                                }
                            }
                        }
                        break;
                    case 9:
                        start_idx = data.indexOf(this._dataset_tag[0], this._cur_idx);
                        if (start_idx > -1)
                        {
                            this._cur_idx = start_idx;
                            this._parse_mode = 3;
                        }
                        else
                        {
                            this._cur_idx = data.length;
                            return false;
                        }
                        break;
                    case 33:
                        this._parse_mode = 3;
                        break;
                    default:
                        return false;
                }
            }

            return true;
        };

        _pProgressDataXML._parseHeader = function ()
        {
            return true;
        };

        _pProgressDataXML._parseParameters_arraybuffer_chunk = function (data, pos)
        {
            var parameter_str = nexacro._Array2DataUtil.substr(data, this._parameters_start_idx, this._parameters_end_idx - this._parameters_start_idx).string;
            var params_info = nexacro._getXMLTagData(parameter_str, 0, "<Parameters>", "</Parameters>");

            if (params_info)
            {
                var paramsData = params_info[0];
                var param_parse_pos = 0;

                var varInfo = nexacro._getXMLTagData2(paramsData, param_parse_pos, "<Parameter ", "</Parameter>");
                while (varInfo)
                {
                    param_parse_pos = varInfo[3];
                    var attrStr = varInfo[1];
                    var id = nexacro._getXMLAttributeID(attrStr);
                    if (id && id.length)
                    {
                        var val = varInfo[0];

                        if (id == "ErrorCode")
                        {
                            var code = parseInt(val) | 0;
                            if (isFinite(code) == false)
                            {
                                val = -1;
                            }
                            else
                                val = code;

                            this._error_info[0] = val;
                        }
                        else if (id == "ErrorMsg")
                        {
                            val = nexacro._decodeXml(val);
                            this._error_info[1] = val;
                        }
                        else
                        {
                            this._parent._setParamter(id, nexacro._decodeXml(val));
                        }

                        this._parameters[this._parameters.length] = { id: id, value: val };
                    }
                    // for Next
                    varInfo = nexacro._getXMLTagData2(paramsData, param_parse_pos, "<Parameter ", "</Parameter>");
                }
            }

            if (this._error_info[0] >= 0)
            {
                this._applyChangeInputDataset();
            }

            return this._parameters_end_idx;
        };

        _pProgressDataXML._parseDataset_arraybuffer_chunk = function (data, pos, bFinal)
        {
            var start_idx = nexacro._Array2DataUtil.indexOf(data, pos, this._getTokenArrayFromString(this._dataset_tag[0])).index;//nexacro._Array2DataUtil.find(data, pos, this._dataset_tag[0]).index;
            if (start_idx >= 0)
            {
                this._cur_idx = start_idx - 1;
                var end_idx = nexacro._Array2DataUtil.indexOf(data, start_idx, this._getTokenArrayFromString(">")).index;
                if (end_idx >= 0)
                {
                    var i;
                    var cur_bufferObj;
                    var cur_bufferObj_arr = this._datasets[this._cur_dataset_id];
                    if (cur_bufferObj_arr)
                    {
                        for (i = 0; i < cur_bufferObj_arr.length; i++)
                        {
                            cur_bufferObj = cur_bufferObj_arr[i];
                            cur_bufferObj._ds_end_idx = this._cur_idx;
                        }
                    }

                    var attstr = nexacro._Array2DataUtil.substr(data, start_idx, end_idx - start_idx + 1).string;
                    var remoteId = nexacro._getXMLAttributeData(attstr, "id");
                    if (remoteId && remoteId.length)
                    {
                        var bufferObj;
                        var bufferObj_arr = this._datasets[remoteId];
                        if (bufferObj_arr)
                        {
                            this._cur_dataset_id = remoteId;

                            for (i = 0; i < bufferObj_arr.length; i++)
                            {
                                bufferObj = bufferObj_arr[i];

                                bufferObj._isEnable = true;
                                bufferObj._ds_start_idx = start_idx;
                                bufferObj._ds_end_idx = end_idx + 1;
                            }
                        }
                        else
                        {
                            this._cur_dataset_id = "";
                            if (bFinal)
                                this._parse_mode = 9;
                            this._cur_idx = end_idx + 1;
                        }
                    }
                    return (end_idx + 1);
                }
                else
                {
                    this._parse_mode = 9;
                    return this._cur_idx;
                }
            }
            else
            {
                this._parse_mode = 9;
                return this._cur_idx;
            }
        };

        _pProgressDataXML._parseColInfo_arraybuffer_chunk = function (data, pos)
        {
            var start_idx = nexacro._Array2DataUtil.indexOf(data, pos, this._getTokenArrayFromString(this._colinfo_tag[0])).index;
            var next_ds_start_idx = nexacro._Array2DataUtil.indexOf(data, pos, this._getTokenArrayFromString(this._dataset_tag[0])).index;
            if (next_ds_start_idx > -1 && start_idx > next_ds_start_idx)
            {
                this._parse_mode = 33;
                return [pos, true, true];
            }
            if (start_idx >= 0)
            {
                var end_idx = nexacro._Array2DataUtil.indexOf(data, start_idx, this._getTokenArrayFromString(this._colinfo_tag[1])).index;
                if (end_idx > 0)
                {
                    var bufferObj;
                    var colinfo_len = this._colinfo_tag[1].length;
                    var bufferObj_arr = this._datasets[this._cur_dataset_id]
                    if (bufferObj_arr)
                    {
                        for (var i = 0; i < bufferObj_arr.length; i++)
                        {
                            bufferObj = bufferObj_arr[i];

                            //if (bufferObj._colinfo_start_idx < 0)
                            //{
                            bufferObj._colinfo_start_idx = start_idx;
                            //}

                            bufferObj._colinfo_end_idx = end_idx + colinfo_len; //pos + 1
                        }
                        this._cur_idx = end_idx + colinfo_len;
                    }
                    //this._cur_idx = end_idx + this._colinfo_tag[1].length;
                    return [end_idx + colinfo_len, true];
                }
                else
                {
                    this._parse_mode = 2;
                    return [start_idx, false];
                }
            }
            else
            {
                return [pos, true];
            }
        };

        _pProgressDataXML._parseRecord_arraybuffer_chunk = function (data, pos, bFinal)
        {
            var start_idx = nexacro._Array2DataUtil.indexOf(data, pos, this._getTokenArrayFromString(this._row_tag[0])).index;
            var nullRecord = true;
            var end_idx;
            var cur_dsid = this._cur_dataset_id;
            var buffer_obj, datasets = this._datasets[cur_dsid];
            var i, len = 0;
            if (datasets)
                len = datasets.length;

            var next_ds_start_idx = nexacro._Array2DataUtil.indexOf(data, pos, this._getTokenArrayFromString(this._dataset_tag[0])).index;
            if (next_ds_start_idx > -1 && start_idx > next_ds_start_idx)
            {
                this._parse_mode = 33;
                return [-1, true, true];
            }
            if (start_idx < 0)
            {
                start_idx = nexacro._Array2DataUtil.indexOf(data, pos, this._getTokenArrayFromString(this._row_tag[2])).index;

                if (start_idx > -1)
                {
                    end_idx = start_idx + this._row_tag[2].length;
                }
                else
                    return [-1, true, false];
            }
            else
            {
                if (nexacro._use_firefirstcount)
                {
                    end_idx = nexacro._Array2DataUtil.indexOf(data, start_idx, this._getTokenArrayFromString(this._row_tag[1])).index;
                }
                else
                {
                    if (next_ds_start_idx > -1)
                    {
                        //lastIndexOf
                        end_idx = nexacro._Array2DataUtil.lastIndexOf(data, next_ds_start_idx, this._getTokenArrayFromString(this._row_tag[1])).index;
                        if (end_idx > 0)
                        {
                            if (end_idx < start_idx)
                            {
                                end_idx = next_ds_start_idx - 1;
                                //nullRecord = true;
                            }
                            else
                                end_idx += this._row_tag[1].length;
                            //this._cur_idx = end_idx;
                            this._parse_mode = 33;

                            for (i = 0; i < len; i++)
                            {
                                buffer_obj = datasets[i];
                                //if (!buffer_obj._progressload)
                                //{
                                //buffer_obj._row_end_idx = end_idx;//cinfo.index + cinfo.byteLength;
                                buffer_obj._row_end_idx = end_idx;
                                //}
                            }
                        }
                        else //if (start_idx < 0)
                        {
                            //nullRecord = true;
                            end_idx = next_ds_start_idx - 1;
                            this._cur_idx = end_idx;
                            this._parse_mode = 33;

                            for (i = 0; i < len; i++)
                            {
                                buffer_obj = datasets[i];
                                //if (!buffer_obj._progressload)
                                //{
                                //buffer_obj._row_end_idx = end_idx;//cinfo.index + cinfo.byteLength;
                                buffer_obj._row_end_idx = end_idx;
                                //}
                            }
                        }
                        return [end_idx, false, end_idx == -1 ? false : true];
                    }
                    else
                    {
                        //lastIndexOf
                        end_idx = nexacro._Array2DataUtil.lastIndexOf(data, 0, this._getTokenArrayFromString(this._row_tag[1])).index;
                    }
                    if (end_idx <= start_idx)
                    {
                        end_idx = -1;
                    }
                }

                if (end_idx > -1)
                {
                    //end_idx += this._row_tag[1].length;
                    //return [end_idx, false, false];
                }
                else
                {
                    return [-1, nullRecord, false];
                }
            }

            this._cur_idx = end_idx;

            if (nexacro._use_firefirstcount)
            {
                var firstcount = 0;

                if (this._cur_dataset_id)
                {
                    buffer_obj = this._datasets[this._cur_dataset_id];
                    firstcount = buffer_obj._firefirstcount;

                    if (buffer_obj._row_start_idx < 0)
                        buffer_obj._row_start_idx = start_idx;

                    //var attr_end_idx = data.indexOf(">", start_idx);
                    //var attstr = data.slice(start_idx, attr_end_idx + 1);
                    var attr_end_idx = nexacro._Array2DataUtil.indexOf(data, start_idx, this._getTokenArrayFromString(">"));
                    var attstr = nexacro._Array2DataUtil.substr(data, start_idx, attr_end_idx + start_idx + 1);
                    var type = nexacro._getXMLAttributeType(attstr);
                    if (type)
                    {
                        var typeChar = type.charAt(0);
                        if (!(typeChar == "d" || typeChar == "D"))
                            buffer_obj._viewrecords_length++;
                    }
                    else
                        buffer_obj._viewrecords_length++;
                }


                if (buffer_obj && buffer_obj._viewrecords_length == firstcount && firstcount > 0)
                {
                    buffer_obj._firstrow_end_idx = end_idx;
                    return [end_idx, false, false];
                }
            }
            else
            {
                for (i = 0; i < len; i++)
                {
                    buffer_obj = datasets[i];
                    buffer_obj._row_end_idx = end_idx;//cinfo.index + cinfo.byteLength;
                }
                return [end_idx, false, false];
            }

            return [-1, true, false];
        };

        _pProgressDataXML._XMLparseRecord_arraybuffer_chunk = function (data, bufferObj, nLoadType, bFinal)
        {
            var ds = bufferObj._target_ds;
            var xml_str;
            var start_idx = 0, end_idx = bufferObj._row_end_idx;
            var next_idx = 0;
            if (bufferObj._is_first_load)
            {
                start_idx = bufferObj._colinfo_start_idx;
            }
            else
            {
                next_idx = bufferObj._row_end_idx > 0 ? 1 : 0;//bufferObj._progress_status;
            }
            if (nLoadType == 1)
            {
                if (nexacro._use_firefirstcount)
                    xml_str = nexacro._Array2DataUtil.substring(data, bufferObj._colinfo_start_idx, bufferObj._firstrow_end_idx).string;
                else if (end_idx > -1)
                    xml_str = nexacro._Array2DataUtil.substring(data, start_idx, end_idx).string;

            }
            else if (end_idx > -1 || bFinal)
            {
                if (bufferObj._row_end_idx < 0)// && bufferObj._row_start_idx > -1)
                    end_idx = data.length;
                xml_str = nexacro._Array2DataUtil.substring(data, start_idx, end_idx).string;
            }
            if (bufferObj._progress_status == 0)
                ds._p_rowposition = -1;
            var ret = ds._loadFromXMLStr(xml_str, next_idx, -1, bufferObj._useclientlayout, bufferObj._is_first_load);
            if (ret > -1)
            {
                bufferObj._is_first_load = false;
                //if (bFinal)
                //    return (start_idx + ret);
                return end_idx;
            }
            else
            {
                this._parse_mode = 3;
                return -1;
            }
        };

        _pProgressDataXML._on_fire_onload_arraybuffer_chunk = function (data, bufferObj, nLoadType)
        {
            var ds = bufferObj._target_ds;
            var errorcode = this._error_info[0];
            var errormsg = this._error_info[1];
            if (ds.colinfos)
            {
                ds._reFilter();
                ds._resetSortGroup();
            }

            if (ds._eventstat)
            {
                var is_appending = bufferObj._is_appending;
                //nexacro.Dataset.REASON_LOAD(0) or nexacro.Dataset.REASON_APPEND(12)
                ds.on_fire_onload(errorcode, errormsg, is_appending ? 12 : nLoadType, (nLoadType == 1) ? true : ((bufferObj._progress_status != 0) ? true : false));
                if (bufferObj._progress_status == 0)
                {
                    if (ds._viewRecords && ds._viewRecords.length > 0)
                    {
                        ds._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    }
                    else
                    {
                        ds._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    }
                    bufferObj._progress_status = 1;
                }

                if (nLoadType == 0)
                    bufferObj._progress_status = 2;
            }
            else if (ds._viewRecords && ds._viewRecords.length > 0)
            {
                ds._p_rowposition = 0;
            }
        };

        _pProgressDataXML._parse_arraybuffer_chunk = function (data, bFinal)
        {
            var i, b;
            var bLoop = true, s_pos, e_pos, b_pos;
            var pre_parse_mode, cur_parse_mode;
            var datasets, buffer_obj;
            var env = nexacro.getEnvironment();
            var datasetloadtype = env.datasetloadtype;
            var len = data.length;
            var ret;
            var nullRecord = true;
            //var _skip = false;
            s_pos = e_pos = b_pos = this._cur_idx;
            //trace("_parse_arraybuffer_chunk this._cur_idx = ", this._cur_idx, data.length, bFinal);
            while (bLoop)
            {
                pre_parse_mode = this._parse_mode;
                cur_parse_mode = this._setNextParseMode_arraybuffer(data, s_pos, pre_parse_mode);
                if (pre_parse_mode == 2 && cur_parse_mode != 2)
                {
                    if (this._error_info[0] < 0 && datasetloadtype == "onsuccess")
                        bLoop = false;
                }

                this._parse_mode = cur_parse_mode;

                if (!bLoop || this._cur_idx == len)
                    break;

                switch (cur_parse_mode)
                {
                    case 0://root
                        break;
                    case 1://header
                        //e_pos = this._parseHeader_arraybuffer_chunk(data, s_pos);
                        break;
                    case 2://parameters
                        e_pos = this._parseParameters_arraybuffer_chunk(data, s_pos);
                        break;
                    case 3://dataset
                        e_pos = this._parseDataset_arraybuffer_chunk(data, s_pos, bFinal);
                        nullRecord = true;
                        break;
                    case 4://constcolinfo
                    case 5://collinfo
                        ret = this._parseColInfo_arraybuffer_chunk(data, s_pos, bFinal);
                        e_pos = ret[0];
                        b = ret[1];
                        break;
                    case 6://record
                        ret = this._parseRecord_arraybuffer_chunk(data, s_pos, bFinal);
                        e_pos = ret[0];
                        nullRecord = ret[1];
                        b = ret[2];
                        //trace(this._cur_dataset_id, e_pos, this._cur_idx, nullRecord, b,data.length, bFinal);
                        break;

                    case 9: //skip
                        //e_pos = this._parseSkip_arraybuffer_chunk(data, s_pos);
                        break;
                    case 10:
                        datasets = this._datasets[this._cur_dataset_id];
                        for (i = 0; i < datasets.length; i++)
                        {
                            buffer_obj = datasets[i];
                            if (buffer_obj._isEnable && !buffer_obj._is_loaded)
                            {
                                this._on_fire_onload_arraybuffer_chunk(data, buffer_obj, 0);
                                buffer_obj._is_loaded = true;

                            }
                        }
                        this._parse_mode = 9;
                        break;
                    case 20: //break;
                        if (pre_parse_mode < 3)
                            this._parse_mode = pre_parse_mode;
                        b = false;
                        break;
                    default:
                        break;
                }

                if (b !== undefined)
                    bLoop = b;
                if (e_pos > -1)
                {
                    //b_pos = s_pos;        
                    s_pos = e_pos;
                }

                if ((!bLoop || !nullRecord) && this._cur_dataset_id)// && cur_parse_mode == 6)
                {
                    //trace("this._cur_dataset_id", this._cur_dataset_id)
                    datasets = this._datasets[this._cur_dataset_id];
                    for (i = 0; i < datasets.length; i++)
                    {
                        buffer_obj = datasets[i];
                        //if (s_pos)
                        //    buffer_obj._row_end_idx = s_pos;
                        var _is_loading = 1;
                        if (bFinal || b)
                        {
                            _is_loading = 0;
                            //_skip = true;
                        }
                        if (!nullRecord || bFinal)
                        {
                            ret = this._XMLparseRecord_arraybuffer_chunk(data, buffer_obj, _is_loading, bFinal);
                            if (ret < 0)
                                s_pos = b_pos;
                            else if (ret > 0)
                                b_pos = s_pos = ret;
                        }
                        else 
                        {
                            s_pos = b_pos;
                        }
                        if (nexacro._use_firefirstcount)
                        {
                            // todo
                            //if (buffer_obj && buffer_obj._viewrecords_length == buffer_obj._firefirstcount && !buffer_obj._isLoadedFirstCount())   //check firstrow and do firstrow processing...
                            //{
                            //    this._on_fire_onload_arraybuffer(data, buffer_obj, 1);
                            //    buffer_obj._is_loaded_firstcount = true;
                            //    bLoop = true;
                            //}
                        }
                        else if (buffer_obj._progressload || bFinal)
                        {
                            this._on_fire_onload_arraybuffer_chunk(data, buffer_obj, _is_loading);
                            buffer_obj._is_loaded = true;
                        }
                    }

                    nullRecord = true;
                    b = undefined;
                }
                if (!bLoop && nullRecord)
                    s_pos = b_pos;
            }

            this._cur_idx = s_pos;

            if (bFinal)
            {
                for (var val in this._datasets)
                {
                    datasets = this._datasets[val];
                    if (datasets)
                    {
                        for (i = 0; i < datasets.length; i++)
                        {
                            buffer_obj = datasets[i];
                            if (buffer_obj._isEnable && !buffer_obj._is_loaded)
                            {
                                this._on_fire_onload_arraybuffer_chunk(data, buffer_obj, 0);
                            }
                        }
                    }
                }
            }
        };


        _pProgressDataXML._parseParameters = function (data)
        {
            var parameter_str = data.slice(this._parameters_start_idx, this._parameters_end_idx);
            var params_info = nexacro._getXMLTagData(parameter_str, 0, "<Parameters>", "</Parameters>");

            if (params_info)
            {
                var paramsData = params_info[0];
                var param_parse_pos = 0;

                var varInfo = nexacro._getXMLTagData2(paramsData, param_parse_pos, "<Parameter ", "</Parameter>");
                while (varInfo)
                {
                    param_parse_pos = varInfo[3];
                    var attrStr = varInfo[1];
                    var id = nexacro._getXMLAttributeID(attrStr);
                    if (id && id.length)
                    {
                        var val = varInfo[0];

                        if (id == "ErrorCode")
                        {
                            var code = parseInt(val) | 0;
                            if (isFinite(code) == false)
                            {
                                val = -1;
                            }
                            else
                                val = code;

                            this._error_info[0] = val;
                        }
                        else if (id == "ErrorMsg")
                        {
                            val = nexacro._decodeXml(val);
                            this._error_info[1] = val;
                        }
                        else
                        {
                            this._parent._setParamter(id, nexacro._decodeXml(val));
                        }

                        this._parameters[this._parameters.length] = { id: id, value: val };
                    }
                    // for Next
                    varInfo = nexacro._getXMLTagData2(paramsData, param_parse_pos, "<Parameter ", "</Parameter>");
                }
            }

            if (this._error_info[0] >= 0)
            {
                this._applyChangeInputDataset();
            }

            return true;
        };

        _pProgressDataXML._parseDataset = function (data)
        {
            var start_idx = data.indexOf(this._dataset_tag[0], this._cur_idx);
            if (start_idx >= 0)
            {
                var end_idx = data.indexOf(">", start_idx);
                if (end_idx >= 0)
                {
                    var i;
                    var cur_bufferObj;
                    var cur_bufferObj_arr = this._datasets[this._cur_dataset_id]
                    if (cur_bufferObj_arr)
                    {
                        for (i = 0; i < cur_bufferObj_arr.length; i++)
                        {
                            cur_bufferObj = cur_bufferObj_arr[i];

                            cur_bufferObj._row_end_idx = this._cur_idx;
                        }
                    }

                    var attstr = data.slice(start_idx, end_idx + 1);
                    var remoteId = nexacro._getXMLAttributeData(attstr, "id");
                    if (remoteId && remoteId.length)
                    {
                        var bufferObj;
                        var bufferObj_arr = this._datasets[remoteId];
                        if (bufferObj_arr)
                        {
                            this._cur_dataset_id = remoteId;

                            for (i = 0; i < bufferObj_arr.length; i++)
                            {
                                bufferObj = bufferObj_arr[i];

                                bufferObj._isEnable = true;
                                bufferObj._ds_start_idx = start_idx;
                                bufferObj._ds_end_idx = end_idx + 1;
                            }
                        }
                        else
                        {
                            this._cur_dataset_id = "";
                            this._parse_mode = 9;
                        }
                    }

                    this._cur_idx = end_idx + 1;
                    return true;
                }
                else
                {
                    this._parse_mode = 9;
                    return false;
                }
            }
            else
            {
                this._parse_mode = 9;
                return false;
            }
        };

        _pProgressDataXML._parseColInfo = function (data)
        {
            var start_idx = data.indexOf(this._colinfo_tag[0], this._cur_idx);
            if (start_idx >= 0)
            {
                var end_idx = data.indexOf(this._colinfo_tag[1], start_idx);
                if (end_idx > 0)
                {
                    var bufferObj;
                    var bufferObj_arr = this._datasets[this._cur_dataset_id]
                    if (bufferObj_arr)
                    {
                        for (var i = 0; i < bufferObj_arr.length; i++)
                        {
                            bufferObj = bufferObj_arr[i];
                            //if (bufferObj._colinfo_start_idx < 0)
                            //{
                            bufferObj._colinfo_start_idx = start_idx;
                            //}

                            bufferObj._colinfo_end_idx = end_idx + 1;
                        }
                    }

                    this._cur_idx = end_idx + 1;
                    return true;
                }
                else
                {
                    this._parse_mode = 3;
                    return false
                }
            }
            else
            {
                return false;
            }
        };

        _pProgressDataXML._parseRecord = function (data)
        {
            var start_idx = data.indexOf(this._row_tag[0], this._cur_idx);
            var end_idx;

            var next_ds_start_idx = data.indexOf(this._dataset_tag[0], this._cur_idx);
            if (next_ds_start_idx > -1 && start_idx > next_ds_start_idx)
            {
                this._parse_mode = 33;
                return true;
            }

            if (start_idx < 0)
            {
                start_idx = data.indexOf(this._row_tag[2], this._cur_idx);

                if (start_idx > -1)
                {
                    end_idx = start_idx + this._row_tag[2].length;
                }
                else
                    return false;
            }
            else
            {
                if (nexacro._use_firefirstcount)
                {
                    end_idx = data.indexOf(this._row_tag[1], start_idx);
                }
                else
                {
                    if (next_ds_start_idx > -1)
                    {
                        end_idx = data.lastIndexOf(this._row_tag[1], next_ds_start_idx);
                        this._cur_idx = end_idx;
                        this._parse_mode = 33;
                        return true;
                    }
                    else
                    {
                        end_idx = data.lastIndexOf(this._row_tag[1]);
                    }

                    if (end_idx <= start_idx)
                    {
                        end_idx = -1;
                    }
                }

                if (end_idx > -1)
                {
                    end_idx += this._row_tag[1].length;
                }
                else
                {
                    return false;
                }
            }

            this._cur_idx = end_idx;

            if (nexacro._use_firefirstcount)
            {
                var buffer_obj, firstcount = 0;

                if (this._cur_dataset_id)
                {
                    buffer_obj = this._datasets[this._cur_dataset_id];
                    firstcount = buffer_obj._firefirstcount;

                    //if (buffer_obj._row_start_idx < 0)
                    buffer_obj._row_start_idx = start_idx;

                    var attr_end_idx = data.indexOf(">", start_idx);
                    var attstr = data.slice(start_idx, attr_end_idx + 1);

                    var type = nexacro._getXMLAttributeType(attstr);
                    if (type)
                    {
                        var typeChar = type.charAt(0);
                        if (!(typeChar == "d" || typeChar == "D"))
                            buffer_obj._viewrecords_length++;
                    }
                    else
                        buffer_obj._viewrecords_length++;
                }


                if (buffer_obj && buffer_obj._viewrecords_length == firstcount && firstcount > 0)
                {
                    buffer_obj._firstrow_end_idx = end_idx;
                    return false;
                }
            }
            else
            {
                return false;
            }

            return true;
        };

        _pProgressDataXML._on_fire_onload = function (data, bufferObj, nLoadType)
        {
            var ds = bufferObj._target_ds;
            var xml_str;
            var errorcode = this._error_info[0];
            var errormsg = this._error_info[1];

            if (nLoadType == 1)
            {
                if (nexacro._use_firefirstcount)
                    xml_str = data.slice(bufferObj._colinfo_start_idx, bufferObj._firstrow_end_idx);
                else
                    xml_str = data.slice(bufferObj._colinfo_start_idx, this._cur_idx);
            }
            else
            {
                if (bufferObj._row_end_idx < 0)
                    bufferObj._row_end_idx = data.length;
                xml_str = data.slice(bufferObj._colinfo_start_idx, bufferObj._row_end_idx);
            }
            if (bufferObj._progress_status == 0)
                ds._p_rowposition = -1;

            var xml_parse_pos = ds._loadFromXMLStr(xml_str, bufferObj._next_record_idx, -1, bufferObj._useclientlayout, bufferObj._is_first_load);
            bufferObj._is_first_load = false;

            if (ds.colinfos)
            {
                ds._reFilter();
                ds._resetSortGroup();
            }

            if (ds._eventstat)
            {
                var is_appending = bufferObj._is_appending;
                //nexacro.Dataset.REASON_LOAD(0) or nexacro.Dataset.REASON_APPEND(12)
                ds.on_fire_onload(errorcode, errormsg, is_appending ? 12 : nLoadType, (nLoadType == 1) ? true : ((bufferObj._progress_status != 0) ? true : false));
                if (bufferObj._progress_status == 0)
                {
                    if (ds._viewRecords && ds._viewRecords.length > 0)
                    {
                        ds._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    }
                    else
                    {
                        ds._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                    }
                    bufferObj._progress_status = 1;
                }

                if (nLoadType == 0)
                    bufferObj._progress_status = 2;
            }
            else if (ds._viewRecords && ds._viewRecords.length > 0)
            {
                ds._p_rowposition = 0;
            }

            bufferObj._next_record_idx = xml_parse_pos;
        };

        _pProgressDataXML = null;

        //==============================================================================
        // nexacro._ProgressDataBIN
        //==============================================================================
        nexacro._ProgressDataBIN = function (parent)
        {
            nexacro._ProgressData.call(this, parent);
            this._data_type = "BIN";
        };

        var _pProgressDataBIN = nexacro._createPrototype(nexacro._ProgressData, nexacro._ProgressDataBIN);
        nexacro._ProgressDataBIN.prototype = _pProgressDataBIN;

        _pProgressDataBIN._setNextParseMode_arraybuffer = function (data, offset, cur_parse_mode)
        {
            var pos = offset;
            var next_parse_mode = cur_parse_mode;
            switch (cur_parse_mode)
            {
                case 0://root
                    if ((data[pos] == 0xFE) && (data[pos + 1] == 0x10))
                        next_parse_mode = 2;
                    else if ((data[pos] == 0xFE) && (data[pos + 1] == 0x01))
                        next_parse_mode = 3;
                    else
                        next_parse_mode = 9;
                    break;
                case 1://header
                case 2://parameters
                    if ((data[pos] == 0xFE) && (data[pos + 1] == 0x01))
                        next_parse_mode = 3;
                    else
                        next_parse_mode = 9;
                    break;
                case 3://dataset
                    if ((data[pos] == 0xFE) && (data[pos + 1] == 0x10))
                        next_parse_mode = 5;
                    else if ((data[pos] == 0xFE) && (data[pos + 1] == 0x01))
                        next_parse_mode = 3;
                    else
                        next_parse_mode = 9;
                    break;
                case 4://const collinfo
                case 5://collinfo
                    if (data.length > pos)
                        next_parse_mode = 6;
                    break;
                case 6://record
                    if ((data.length > pos) && (data[pos] == 0xFE) && (data[pos + 1] == 0x01))
                        next_parse_mode = 3;
                    break;
                case 7://JSON_id
                case 8://JSON_string
                case 9:
                    if ((data.length > pos) && (data[pos] == 0xFE) && (data[pos + 1] == 0x01))
                        next_parse_mode = 3;
                    break;
                default:
                    break;
            }
            return next_parse_mode;
        };

        _pProgressDataBIN._parseHeader_arraybuffer_chunk = function (data, offset)
        {
            return offset;
            /*
            var cinfo = nexacro._Array2DataUtil.indexOf(data, offset, this._rs_code_array);
            if (cinfo.index < 0) return -1;

            return (cinfo.index + cinfo.byteLength);
            */
        };

        _pProgressDataBIN._parseParameters_arraybuffer_chunk = function (data, offset)
        {
            var nextOffset = offset;
            if (data[offset] != 0xFE || data[offset + 1] != 0x10)
                return -1;

            nextOffset += 2;
            var dataview = new DataView(data.buffer);
            while (nextOffset < data.length)
            {
                //version
                var p_ver = dataview.getUint16(nextOffset);
                nextOffset += 2;
                if (p_ver != 5000)
                    return nextOffset;

                var ret = nexacro._Array2DataUtil.getLenFromUint8Array(data, nextOffset, dataview);//nextOffset, len;
                nextOffset = ret[0];
                var p_size = ret[1];
                if ((nextOffset + p_size) >= data.length)
                    return nextOffset;

                var p_cnt = dataview.getUint16(nextOffset);
                nextOffset += 2;
                for (var i = 0; i < p_cnt; i++)
                {
                    ret = nexacro._getProgressDataBINVariable(data, nextOffset); //nextOffset, id, value, type, size
                    nextOffset = ret[0];
                    var id = ret[1];
                    var val = ret[2];

                    if (id == "ErrorCode")
                    {
                        this._error_info[0] = val;
                    }
                    else if (id == "ErrorMsg")
                    {
                        this._error_info[1] = val;
                    }
                    else
                    {
                        this._parent._setParamter(id, val);
                    }

                    this._parameters[this._parameters.length] = { id: id, value: val };
                }
                break;
            }

            if (this._error_info[0] >= 0)
            {
                this._applyChangeInputDataset();
            }

            return nextOffset;
        };

        _pProgressDataBIN._parseDataset_arraybuffer_chunk = function (data, offset, bFinal, bufferObj)
        {
            var nextOffset = offset;
            if (data[offset] != 0xFE || data[offset + 1] != 0x01)
                return -1;

            nextOffset += 2;
            while (nextOffset < data.length)
            {
                var dataview = new DataView(data.buffer);
                //version
                var ver = dataview.getUint16(nextOffset);
                nextOffset += 2;
                if (ver != 5000)
                    return nextOffset;

                var ret = nexacro._Array2DataUtil.getLenFromUint8Array(data, nextOffset, dataview);//nextOffset, len;
                nextOffset = ret[0];
                var size = ret[1]; //sizeof(idlen)+sizeof(id)+sizeof(constColumn) + sizeof(Column info list)의 합

                //dataset id
                var len = dataview.getUint16(nextOffset);
                nextOffset += 2;

                this._cur_dataset_id = "";
                if (len <= 0)
                {
                    this._parse_mode = 9; // skip : unknown dataset id
                    return nextOffset;
                }

                var remote_dsid = nexacro._Array2DataUtil.substr(data, nextOffset, len).string;
                nextOffset += len;
                this._cur_dataset_id = "";

                if (bufferObj)
                {
                    if (!this._datasets[remote_dsid])
                        this._datasets[remote_dsid] = [];
                    this._datasets[remote_dsid].push(bufferObj);
                }

                if (!this._is_accept_dataset(remote_dsid))
                {
                    this._parse_mode = 9; // skip : not found dataset
                }
                else
                {
                    var buffer_obj = this._datasets[remote_dsid];
                    if (buffer_obj)
                    {
                        for (var i = 0; i < buffer_obj.length; i++)
                            buffer_obj[i]._isEnable = true;
                    }

                    this._cur_dataset_id = remote_dsid;
                }

                return nextOffset;
            }
        };

        _pProgressDataBIN._parseColInfo_arraybuffer_chunk = function (data, offset, bFinal)
        {
            var nextOffset = offset;
            var cur_dsid = this._cur_dataset_id;
            if ((!bFinal && data.length <= offset) || cur_dsid == '')
                return -1;
            if (nexacro._use_firefirstcount) // should load at parse record
                return nextOffset;


            var target_ds, buffer_obj, datasets = this._datasets[cur_dsid];
            var ret;
            var dataview = new DataView(data.buffer);
            for (var i = 0, len = datasets.length; i < len; i++)
            {
                buffer_obj = datasets[i];
                target_ds = buffer_obj._target_ds;

                if (buffer_obj._is_first_load)
                {
                    target_ds._p_rowposition = -1;

                    if (buffer_obj._useclientlayout)
                    {
                        target_ds._clearData();
                    }
                    else
                    {
                        target_ds._clearAll();
                    }
                    buffer_obj._is_first_load = false;
                }
                //if (this._parse_mode == 4)
                if (data[offset] == 0xFE && data[offset + 1] == 0x10) //const column
                {
                    nextOffset += 2;
                    while (nextOffset < data.length)
                    {
                        //version
                        var const_ver = dataview.getUint16(nextOffset);
                        nextOffset += 2;
                        if (const_ver != 5000)
                            return -1;

                        ret = nexacro._Array2DataUtil.getLenFromUint8Array(data, nextOffset, dataview);//nextOffset, len;
                        nextOffset = ret[0];
                        var size = ret[1]; //sizeof(idlen)+sizeof(id)+sizeof(constColumn) + sizeof(Column info list)의 합

                        var const_cnt = dataview.getUint16(nextOffset);
                        nextOffset += 2;
                        for (var i = 0; i < const_cnt; i++)
                        {
                            ret = nexacro._getProgressDataBINVariable(data, nextOffset); //nextOffset, id, value, type, size
                            nextOffset = ret[0];
                            if (buffer_obj._useclientlayout)
                            {
                                var constVar = target_ds._constVars[ret[1]];
                                if (constVar != null && constVar.value != ret[2])
                                {
                                    if (constVar._value)
                                        constVar._value = undefined;

                                    constVar.value = ret[2];
                                }
                            }
                            else
                                target_ds._addConstColumn(ret[1], ret[2], ret[3], ret[4]);
                        }
                        break;
                    }
                }

                var v_cnt = dataview.getUint16(nextOffset);
                nextOffset += 2;
                var colArr = [];
                for (var n = 0; n < v_cnt; n++)
                {
                    ret = nexacro._getProgressDataBINColumn(data, nextOffset);
                    nextOffset = ret[0];

                    if (!buffer_obj._useclientlayout)
                    {
                        target_ds._addColumn(ret[1], ret[2], ret[3], ret[4], ret[5]);
                    }
                    else
                        colArr[n] = { id: ret[1], type: ret[2] }; // need only id 
                }

                if (buffer_obj._useclientlayout)
                {
                    buffer_obj._pgConvertFn = target_ds.__makeBINDataMappingFunc(colArr, colArr.length, "S");
                }
                else
                {
                    buffer_obj._pgConvertFn = target_ds.__makeBINDataConvertFunc("S");
                }
            }
            return nextOffset;
        };

        _pProgressDataBIN._parseRecord_arraybuffer_chunk = function (data, offset, bFinal)
        {
            var cur_dsid = this._cur_dataset_id;

            if (data.length <= offset || cur_dsid == '') return -1;
            if (this._break_parse)
            {
                this._break_parse = false;
                return -1;
            }
            if (nexacro._use_firefirstcount)
            {
                // todo
            }
            else
            {
                var target_ds, buffer_obj, datasets = this._datasets[cur_dsid];

                var s_pos = offset, e_pos, i;
                var ret = [];
                var len = datasets.length;
                for (i = 0; i < len; i++)
                {
                    buffer_obj = datasets[i];
                    target_ds = buffer_obj._target_ds;
                    ret = target_ds._loadFromBINUint8Array(data, s_pos, null, -1, buffer_obj._useclientlayout, false, buffer_obj._pgConvertFn);
                    e_pos = ret[0];
                    this._break_parse = ret[2]; //데이터가 덜 채워진 경우?
                }

                for (i = 0; i < len; i++)
                {
                    buffer_obj = datasets[i];
                    if (!buffer_obj._progressload)
                    {
                        // 일부는 progressload 이고, 나머지는 progressload가 아닌 경우,
                        // 데이터를 어디엔가 저장해야 하나?
                        if (buffer_obj._row_start_idx < 0)
                            buffer_obj._row_start_idx = data.byteOffset + offset;

                        buffer_obj._row_end_idx = data.byteOffset + e_pos - 1;
                    }
                }

                //return e_pos;
                return ret;
            }

            return [data.length, false];
        };

        _pProgressDataBIN._parseSkip_arraybuffer_chunk = function (data, offset)
        {
            var nextOffset = offset;
            while (nextOffset + 4 < data.length)
            {
                if (data[nextOffset] == 0x00 && data[nextOffset + 1] == 0x00 && data[nextOffset + 2] == 0xFE && data[nextOffset + 3] == 0x01)
                {
                    return (nextOffset + 2);
                }
                nextOffset++;
            }

            return -1;
        };

        _pProgressDataBIN = null;

        //==============================================================================
        // nexacro._ProgressDataBIN Utils
        //==============================================================================
        nexacro._getProgressDataBINVariable = function (data, offset)
        {
            var dataview = new DataView(data.buffer);
            var pos = offset;
            var len = dataview.getUint16(pos);
            pos += 2;
            var id = nexacro._Array2DataUtil.substr(data, pos, len).string;
            pos += len;
            var ntype = dataview.getUint16(pos);
            pos += 2;
            var type = "variant";
            var value, size;
            switch (ntype)
            {
                case 2: //bool, short
                    size = 2;
                    type = "int";
                    value = dataview.getInt16(pos);
                    pos += size;
                    break;
                case 3: //int, long
                    size = 4;
                    type = "int";
                    value = dataview.getInt32(pos);
                    pos += size;
                    break;
                case 4: //double
                    size = 8;
                    type = "float";
                    value = dataview.getFloat64(pos);
                    pos += size;
                    break;
                case 40: //bigdecimal
                    var ret = nexacro._Array2DataUtil.getLenFromUint8Array(data, pos, dataview);
                    pos = ret[0];
                    size = ret[1];
                    type = "bigdecimal";
                    value = nexacro._Array2DataUtil.substr(data, pos, size).string;
                    pos += size;
                    break;
                case 41: //date, double
                    var ret = nexacro._Array2DataUtil.getDatetimeFromUint8Array(data, pos, dataview);
                    pos = ret[0];
                    size = 8;
                    type = "datetime";
                    value = ret[1];
                    break;
                case 21: //string
                    var ret = nexacro._Array2DataUtil.getLenFromUint8Array(data, pos, dataview);
                    pos = ret[0];
                    size = ret[1];
                    type = "string";
                    value = nexacro._Array2DataUtil.substr(data, pos, size).string;
                    pos += size;
                    break;
                case 26: //bin
                    var ret = nexacro._Array2DataUtil.getLenFromUint8Array(data, pos, dataview);
                    pos = ret[0];
                    size = ret[1];
                    type = "blob";
                    value = nexacro._Array2DataUtil.substr(data, pos, size).string;
                    pos += size;
                    break;
                default:
                    break;
            }
            return [pos, id, value, type, size];

        };

        nexacro._getProgressDataBINColumn = function (data, offset)
        {
            var dataview = new DataView(data.buffer);
            var pos = offset;
            var len = dataview.getUint16(pos);
            pos += 2;
            var id = nexacro._Array2DataUtil.substr(data, pos, len).string;
            pos += len;
            var coltype = dataview.getUint16(pos);
            pos += 2;
            var type = nexacro.DataUtils.toTypeName(coltype);
            var size = dataview.getUint16(pos);
            pos += 2;
            var colprop = dataview.getUint16(pos);
            pos += 2;
            var sum;
            var prop = "none"; //default

            switch (colprop)
            {
                case 0x1000:
                    prop = "count";
                    break;
                case 0x2000:
                    prop = "sum";
                    break;
                case 0x3000:
                    prop = "max";
                    break;
                case 0x4000:
                    prop = "min";
                    break;
                case 0x5000:
                    prop = "avg";
                    break;
                case 0x6000:
                    prop = "text";
                    break;
                case 0x7000:
                    prop = "key";
                    break;
                default:
                    break;
            }

            if (colprop == 0x6000 || colprop == 0x7000)
            {
                var sumlen = dataview.getUint16(pos);
                pos += 2;
                sum = nexacro._Array2DataUtil.substr(data, pos, sumlen).string;
                pos += sumlen;

            }

            return [pos, id, type, size, prop, sum];
        };

        //==============================================================================
        // XML Parse & Serialize Utils
        //==============================================================================
        nexacro._parseXMLDocument = function (str)
        {
            return (new DOMParser()).parseFromString(str, "text/xml");
        };
        nexacro._documentToXml = function (xmldoc)
        {
            return (new XMLSerializer()).serializeToString(xmldoc);
        };

        // firefox
        //
        //  <parsererror xmlns="http://www.mozilla.org/newlayout/xml/parsererror.xml">
        //      (error description)
        //      <sourcetext>(a snippet of the source XML)</sourcetext>
        //  </parsererror>
        if (nexacro._Browser == "Gecko")
        {
            nexacro._getParserError = function (xmldoc)
            {
                var node = xmldoc.documentElement;
                if (node.nodeName == "parsererror")
                {
                    //trace(nexacro._documentToXml(xmldoc));
                    var msg = "", desc = "";

                    var childs = node.childNodes;
                    msg = nexacro._decodeXml(childs[0].nodeValue);
                    desc = childs[1].textContent;

                    return { "line": undefined, "column": undefined, "message": msg, "desc": desc };
                }
                return null;
            };
        }
        else
        {
            // chrome/safari/opera
            //
            //  <root> (or <html><body>)
            //      <parsererror style>
            //          <h3>title text</h3>
            //          <div style>(error description)</div>
            //          <h3>text</h3>
            //      <sourcetext>(a snippet of the source XML)</sourcetext>
            //  </parsererror>
            //  </root> (or </body></html>)
            nexacro._getParserError = function (xmldoc)
            {
                var errors = xmldoc.getElementsByTagName("parsererror");
                if (errors.length > 0)
                {
                    var msg = "";
                    var node = errors[0].firstChild;
                    while (node)
                    {
                        if (node.nodeName == "div")
                        {
                            msg = node.textContent;
                            break;
                        }
                        node = node.nextSibling;
                    }
                    return { "line": undefined, "column": undefined, "message": msg, "desc": "" };
                }
                return null;
            };
        }
        if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
        {
            // for use object cache : use closure
            (function ()
            {
                var re_newline = /\r\n|\n/;

                nexacro.__toInnerHTMLText = function (text)
                {
                    return text.split("&").join("&amp;").split("\"").join("&quot;").split("'").join("&#39;").replace("<", "&lt;").split(">").join("&gt;").split(re_newline).join("<br/>");
                };
            })();
        }
        else if (nexacro._Browser == "Gecko")
        {
            // for use object cache : use closure
            (function ()
            {
                var re_special = /[&"'\<\>]/g;
                var re_newline = /\r\n|\n/g;
                var _map = {
                    "&": "&amp;",
                    "'": "&#39;",
                    '"': "&quot;",
                    "<": "&lt;",
                    ">": "&gt;"
                };
                function _replaceEntity(chr)
                {
                    return _map[chr];
                }

                nexacro.__toInnerHTMLText = function (text)
                {
                    return text.replace(re_special, _replaceEntity).replace(re_newline, "<br/>");
                };
            })();
        }
        else
        {
            // for use object cache : use closure
            (function ()
            {
                var re_amp = /&/g;
                var re_apos = /'/g;
                var re_quot = /"/g;
                var re_lt = /</g;
                var re_gt = />/g;
                var re_newline = /\r\n|\n|\r/g;

                nexacro.__toInnerHTMLText = function (text)
                {
                    return text.replace(re_amp, "&amp;").replace(re_apos, "&#39;").replace(re_quot, "&quot;").replace(re_lt, "&lt;").replace(re_gt, "&gt;").replace(re_newline, "<br/>");
                };
            })();
        }

        nexacro._decorateString = function (str)
        {
            var strtemp = str;

            var expPrefixMap = [/<\/?ff\s+[v]\s*=(\'|\")/g, /<\/?fs\s+[v]\s*=(\'|\")/g, /<\/?fc\s+[v]\s*=(\'|\")/g, /<\/?b\s+[v].*?>/g, /<\/?i\s+[v].*?>/g, /<\/?u\s+[v].*?>/g, /<\/?s\s+[v].*?>/g, /<\/?l\s*[v]\s*=\'/g];
            var expSufixMap = [/<\/ff>/g, /<\/fs>/g, /<\/fc>/g, /<\/b>/g, /<\/i>/g, /<\/u>/g, /<\/s>/g, /<\/l>/g];
            var expPrefixInvalidMap = [/<ff\s+(?!v\s*=\s*[^>]|\s)[^>]*>/g, /<fs\s+(?!v\s*=\s*[^>]|\s)[^>]*>/g, /<fc\s+(?!v\s*=\s*[^>]|\s)[^>]*>/g, /<b\s+(?!v\s*=\s*[^>]|\s)[^>]*>/g, /<i\s+(?!v\s*=\s*[^>]|\s)[^>]*>/g, /<u\s+(?!v\s*=\s*[^>]|\s)[^>]*>/g, /<s\s+(?!v\s*=\s*[^>]|\s)[^>]*>/g, /<l\s+(?!v\s*=\s*[^>]|\s)[^>]*>/g];
            var expSufixInvalidMap = [/<\/ff>/, /<\/fs>/, /<\/fc>/, /<\/b>/, /<\/i>/, /<\/u>/, /<\/s>/, /<\/l>/];
            var reg_valid = /<(?![^A-Za-z]|fs|fc|ff|b|i|u|s|l|\/fs|\/fc|\/ff|\/b|\/i|\/u|\/s|\/l)[^>]*>?/g;
            var bunderline = false;
            var n = expPrefixMap.length;

            strtemp = strtemp.replace(reg_valid, "");

            for (var i = 0; i <= n - 1; i++)
            {
                var invalidexp = expPrefixInvalidMap[i];
                var invalidexec = invalidexp.exec(strtemp);

                while (invalidexec)
                {
                    strtemp = strtemp.replace(invalidexec[0], "").replace(expSufixInvalidMap[i], "");
                    invalidexec = invalidexp.exec(strtemp);
                }

                var preexp = expPrefixMap[i];
                var sufexp = expSufixMap[i];
                var preexec = preexp.exec(strtemp);

                while (preexec)
                {
                    var sufexec = sufexp.exec(strtemp);
                    if (!sufexec)
                        break;

                    var startidx = preexec.index;
                    var endidx = sufexp.lastIndex;

                    var frontstr = strtemp.substring(0, startidx);
                    var endstr = strtemp.substring(endidx, strtemp.length);
                    var changestr = strtemp.substring(startidx, endidx);

                    switch (i)
                    {
                        case 0:
                            changestr = changestr.replace(preexec[0], "<span style=\"font-family:").replace(/(\'|\")>/, "\">").replace(sufexec[0], "</span>");
                            break;
                        case 1:
                            changestr = changestr.replace(preexec[0], "<span style=\"font-size:").replace(/(\'|\")>/, "pt\">").replace(sufexec[0], "</span>");
                            break;
                        case 2:
                            changestr = changestr.replace(preexec[0], "<span style=\"color:").replace(/(\'|\")>/, "\">").replace(sufexec[0], "</span>");
                            startidx = changestr.indexOf(":");
                            endidx = changestr.indexOf("\">");
                            var colorstr = changestr.substring(startidx + 1, endidx);
                            changestr = changestr.replace(colorstr, nexacro._getWebColorFromXreColor(colorstr));
                            break;
                        case 3:
                            if (preexec[0].indexOf("false") < 0)
                                changestr = changestr.replace(preexec[0], "<b>");
                            else
                                changestr = changestr.replace(preexec[0], "").replace(sufexec[0], "");
                            break;
                        case 4:
                            if (preexec[0].indexOf("false") < 0)
                                changestr = changestr.replace(preexec[0], "<i>");       // 기울여진 부분 잘리는 문제로 0.2em 추가.
                            else
                                changestr = changestr.replace(preexec[0], "").replace(sufexec[0], "");
                            break;
                        case 5:
                            if (preexec[0].indexOf("false") < 0)
                            {
                                changestr = changestr.replace(preexec[0], "<u>");
                                bunderline = true;
                            }
                            else
                            {
                                changestr = changestr.replace(preexec[0], "<u style='text-decoration:none'>");
                                bunderline = false;
                            }
                            break;
                        case 6:
                            if (preexec[0].indexOf("false") < 0)
                                changestr = changestr.replace(preexec[0], "<s>");
                            else
                                changestr = changestr.replace(preexec[0], "<s style='text-decoration:none'>");
                            break;
                        case 7:
                            if (changestr.indexOf("tel:") < 0 && changestr.indexOf("mailto:") < 0)
                            {
                                if (!bunderline)
                                    changestr = changestr.replace(preexec[0], "<a style='text-decoration:none;' target=\"_blank\" href=\"");
                                else
                                    changestr = changestr.replace(preexec[0], "<a target=\"_blank\" href=\"");

                                changestr = changestr.replace("\'>", "\">").replace(sufexec[0], "</a>");
                            }

                            else
                            {
                                if (changestr.indexOf("tel:") >= 0 && nexacro._isDesktop())
                                    changestr = changestr.replace(preexec[0], "<span v=\"").replace("\'>", "\">").replace(sufexec[0], "</span>");
                                else
                                {
                                    if (!bunderline)
                                        changestr = changestr.replace(preexec[0], "<a style='text-decoration:none;' href=\"");
                                    else
                                        changestr = changestr.replace(preexec[0], "<a href=\"");

                                    changestr = changestr.replace("\'>", "\">").replace(sufexec[0], "</a>");
                                }

                            }

                            break;
                        default:
                            break;
                    }

                    strtemp = frontstr + changestr + endstr;

                    preexp.lastIndex = 0;
                    preexec = preexp.exec(strtemp);
                    if (preexec)
                    {
                        sufexp.lastIndex = preexp.lastIndex;
                    }
                }
            }

            if (strtemp.indexOf("\r") >= 0)
            {
                strtemp = nexacro._replaceAll(strtemp, "\r", "");
            }

            //// hyperlink 처리
            ////strtemp = strtemp.replace(/<\/?l\s+[v]\s*=/g, "<a target='_blank' href=").replace(/l\s*>/g, "a>");
            //if (strtemp.indexOf("\"") >= 0 || strtemp.indexOf("\'") >= 0)
            //{
            //    strtemp = nexacro._replaceAll(strtemp, "\"", "");
            //    strtemp = nexacro._replaceAll(strtemp, "\'", "");
            //}

            return strtemp;
        };

        nexacro._quoteStr = function (str)
        {
            if (/[\r\n\"\t]/.test(str))
            {
                return "\"" + str.replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(/\"/g, "\\\"") + "\"";
            }
            else if (/[,\']/.test(str))
            {
                return "\"" + str + "\"";
            }
            else
            {
                return str;
            }
        };
        nexacro._unQuoteStr = function (str)
        {
            if (str.charAt(0) != "\"" && str.charAt(0) != "\'")
            {
                return str;
            }
            else if (str.indexOf("\\") >= 0)
            {
                str = str.replace(/\\r/g, "\r").replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\/g, "");
                return str.substring(1, str.length - 1);
            }
            else
            {
                return str.substring(1, str.length - 1);
            }
        };

        //==============================================================================
        // Screen & Element Position APIs
        //==============================================================================
        nexacro._getDevicePixelRatio = function (elem)
        {
            var ratio = 1;

            if (!nexacro._isMobile())  // 사용자가 wheelzoom을 통해서 처리한 배율만 적용
            {
                var screen;
                if (window)
                {
                    if (nexacro._macOSWebView)
                    {
                        ratio = nexacro._getWindowHandleOuterWidth(window) / window.innerWidth;
                    }
                    else
                    {
                        ratio = window.outerWidth / window.innerWidth;
                    }

                    if (window.devicePixelRatio)
                    {
                        var recalc = ratio;
                        recalc = recalc.toFixed(2);
                        if (window.devicePixelRatio > recalc || nexacro._Browser == "Safari")
                        {
                            return ratio;
                        }
                        else
                        {
                            ratio = window.devicePixelRatio;
                        }
                    }
                    else
                    {
                        if (document.frames)
                        {
                            screen = document.frames.screen;
                            ratio = (screen.deviceXDPI / screen.systemXDPI);
                        }
                    }
                }
            }

            return ratio;
        };

        nexacro._getElementXYInWindow = function (node)
        {
            if (!node)
                return [0, 0];

            let point_x, point_y;

            if (nexacro._checkDocument.hasGetBoundingClientRect)
            {
                const _doc = (node.ownerDocument || node.document);
                const elem_pos = nexacro.__getHTMLNodePositionInFrame(_doc, node);
                const box = node.getBoundingClientRect();

                if (nexacro._Browser == "MobileSafari")
                {
                    if (elem_pos)
                        return [elem_pos.x, elem_pos.y];

                    point_x = Math.round(box.left);
                    point_y = Math.round(box.top);
                    return [point_x, point_y];

                }
                else
                {
                    if (nexacro._allow_default_pinchzoom)
                    {
                        if (elem_pos)
                            return [elem_pos.x, elem_pos.y];
                    }

                    point_x = Math.round(box.left);
                    point_y = Math.round(box.top);

                    return [point_x, point_y];
                }
            }
            else
            {
                // 2024 시점에 getBoundingClientRect 을 미지원하는 browser가 있다?

                point_x += node.offsetLeft;
                point_y += node.offsetTop;

                let pnode = node.offsetParent;
                while (pnode)
                {
                    point_x += (pnode.offsetLeft + (pnode.clientLeft | 0) - pnode.scrollLeft);
                    point_y += (pnode.offsetTop + (pnode.clientTop | 0) - pnode.scrollTop);
                    pnode = pnode.offsetParent;
                }

                // case : use in iframe
                const doc_elem = document.documentElement;
                point_x += doc_elem.scrollLeft;
                point_y += doc_elem.scrollTop;

                return [point_x, point_y];
            }
        }


        //----------------------------------------------
        nexacro._getElementPositionInFrame = function (elem)
        {
            var node = elem.handle;
            if (!node)
                return { x: 0, y: 0 };

            var _doc = (node.ownerDocument || node.document);
            return nexacro.__getHTMLNodePositionInFrame(_doc, node);
        };

        nexacro._getPopupElementPositionInFrame = function (elem, left, top)
        {
            var node = elem.handle;
            var p;
            if (!node)
                return { x: left, y: top };

            var _doc = (node.ownerDocument || node.document);
            p = nexacro.__getHTMLNodePositionInFrame(_doc, node);

            return { x: p.x + left, y: p.y + top };
        };

        if (nexacro._Browser == "Chrome" && nexacro._BrowserExtra == "SamsungBrowser" && nexacro._BrowserVersion > 42)
        {
            nexacro.__getHTMLNodePositionInFrame = function (_doc, node, id, round)
            {
                var p = {
                    x: 0,
                    y: 0
                };
                if (!_doc || !node)
                    return p;

                var box;
                if (document.documentElement.getBoundingClientRect)
                {
                    box = node.getBoundingClientRect();
                    p.x = box.left + (_doc.scrollLeft | 0);// || _doc.body.scrollLeft);
                    p.y = box.top + (_doc.scrollTop | 0); //|| _doc.body.scrollTop);

                    var pt = nexacro.__adjustBoundingClientRect(_doc);
                    p.x -= pt[0];
                    p.y -= pt[1];

                    p.x = round === false ? p.x : Math.round(p.x);
                    p.y = round === false ? p.y : Math.round(p.y);
                }
                else
                {
                    if (document.getBoxObjectFor)
                    {
                        box = _doc.getBoxObjectFor(node);
                        p.x = box.x;
                        p.y = box.y;
                        var style = _doc.defaultView.getComputedStyle(node, "");
                        p.x -= parseInt(style.borderLeftWidth) | 0;
                        p.y -= parseInt(style.borderTopWidth) | 0;
                        node = node.parentNode;
                        while (node.nodeType == 1)
                        {
                            p.x -= node.scrollLeft;
                            p.y -= node.scrollTop;
                            node = node.parentNode;
                        }
                    }
                    else
                    {
                        p.x = node.offsetLeft;
                        p.y = node.offsetTop;
                        var pnode = node.offsetParent;
                        while (pnode)
                        {
                            p.x += pnode.offsetLeft;
                            p.y += pnode.offsetTop;
                            pnode = pnode.offsetParent;
                        }
                        var body = id ? _doc.getElementById(id) : (_doc.body || _doc.getElementsByTagName("body")[0]);
                        node = node.parentNode || body;
                        while (node.nodeType == 1 && node != body)
                        {
                            p.x -= node.scrollLeft;
                            p.y -= node.scrollTop;
                            node = node.parentNode;
                        }
                    }
                }
                return p;
            };
        }
        else
        {
            nexacro.__getHTMLNodePositionInFrame = function (_doc, node, id, round)
            {
                var p = {
                    x: 0,
                    y: 0
                };
                if (!_doc || !node)
                    return p;

                var box;
                if (document.documentElement.getBoundingClientRect)
                {
                    box = node.getBoundingClientRect();


                    //p.x = (node._linked_element && node._linked_element._isRtl()) ? document.documentElement.clientWidth - box.right + (_doc.scrollLeft || _doc.body.scrollLeft) : box.left + (_doc.scrollLeft || _doc.body.scrollLeft);
                    //p.x = box.left + (_doc.scrollLeft || _doc.body.scrollLeft);
                    //p.y = box.top + (_doc.scrollTop || _doc.body.scrollTop);

                    /* 표준 api 로 처리 */
                    const scrollTop =
                        window.pageYOffset ||
                        document.documentElement.scrollTop ||
                        document.body.scrollTop ||
                        0;

                    const scrollLeft =
                        window.pageXOffset ||
                        document.documentElement.scrollLeft ||
                        document.body.scrollLeft ||
                        0;

                    p.x = (node._linked_element && node._linked_element._isRtl()) ? document.documentElement.clientWidth - box.right + scrollLeft : box.left + scrollLeft;
                    p.y = box.top + scrollTop;





                    if (nexacro._macOSWebView)
                    {
                        var top = _doc.getElementById("nexacontainer").style.top;
                        top = top.replace(/[^\d]/g, '');
                        p.y -= top;
                    }

                    var pt = nexacro.__adjustBoundingClientRect(_doc); // for MFE


                    p.x -= pt[0];
                    p.y -= pt[1];



                    p.x = round === false ? p.x : Math.round(p.x);
                    p.y = round === false ? p.y : Math.round(p.y);
                }
                else
                {
                    if (document.getBoxObjectFor)
                    {
                        box = _doc.getBoxObjectFor(node);
                        p.x = box.x;
                        p.y = box.y;
                        var style = _doc.defaultView.getComputedStyle(node, "");
                        p.x -= parseInt(style.borderLeftWidth) | 0;
                        p.y -= parseInt(style.borderTopWidth) | 0;
                        node = node.parentNode;
                        while (node.nodeType == 1)
                        {
                            p.x -= node.scrollLeft;
                            p.y -= node.scrollTop;
                            node = node.parentNode;
                        }
                    }
                    else
                    {
                        p.x = node.offsetLeft;
                        p.y = node.offsetTop;
                        var pnode = node.offsetParent;
                        while (pnode)
                        {
                            p.x += pnode.offsetLeft;
                            p.y += pnode.offsetTop;
                            pnode = pnode.offsetParent;
                        }
                        var body = id ? _doc.getElementById(id) : (_doc.body || _doc.getElementsByTagName("body")[0]);
                        node = node.parentNode || body;
                        while (node.nodeType == 1 && node != body)
                        {
                            p.x -= node.scrollLeft;
                            p.y -= node.scrollTop;
                            node = node.parentNode;
                        }
                    }
                }
                return p;
            };
        }

        nexacro._getContentRect = function (el) 
        {
            const rect = el.getBoundingClientRect();
            const style = getComputedStyle(el);

            const paddingTop = parseFloat(style.paddingTop);
            const paddingLeft = parseFloat(style.paddingLeft);
            const paddingRight = parseFloat(style.paddingRight);
            const paddingBottom = parseFloat(style.paddingBottom);


            const contentsWidth = el.clientWidth - paddingLeft - paddingRight;
            const contentsHeight = el.clientHeight - paddingTop - paddingBottom;

            return {
                x: rect.x + paddingLeft,
                y: rect.y + paddingTop,
                width: rect.width,
                height: rect.height,
                paddingLeft: paddingLeft,
                paddingTop: paddingTop,
                contentsWidth: contentsWidth,
                contentsHeight: contentsHeight
            };
        }
        nexacro.__adjustBoundingClientRect = function (_doc)
        {
            let pageXOffset = 0, pageYOffset = 0;
            let containerX = 0, containerY = 0;

            if (nexacro.isTouchInteraction && (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge"))
            {
                //return [_doc.defaultView.pageXOffset, _doc.defaultView.pageYOffset];
                pageXOffset = containerX + _doc.defaultView.pageXOffset;
                pageYOffset = containerY + _doc.defaultView.pageXOffset;
            }
            return [pageXOffset, pageYOffset];

        }

        nexacro._getElementScreenPosition = function (elem, round)
        {
            var handle = elem.handle;
            if (handle)
            {
                var _doc = handle.ownerDocument || handle.document;
                var p = nexacro.__getHTMLNodePositionInFrame(_doc, handle, undefined, round);


                var x, y;
                x = p.x * nexacro._getDevicePixelRatio(elem);
                y = p.y * nexacro._getDevicePixelRatio(elem);


                let screenx, screeny;
                if (elem.linkedcontrol)
                {
                    const win = elem.linkedcontrol._getWindow();
                    screenx = nexacro._getContainerHandlePosX(win);
                    screeny = nexacro._getContainerHandlePosY(win);
                }

                x += (screenx || 0);
                y += (screeny || 0);

                p.x = round === false ? x : Math.round(x);
                p.y = round === false ? y : Math.round(y);

                return p;
            }
            return { x: 0, y: 0 };
        };

        nexacro.__getHTMLElementPosition = function (node)
        {
            var top = 0;
            var left = 0;
            var skipTd = false;
            while (node.parentNode && node != window.document.body)
            {
                var nodetagname = node.tagName;
                if (skipTd && nodetagname == "TABLE")
                {
                    skipTd = false;
                }
                if ((skipTd && nodetagname == "TD") || nodetagname == "TR" || nodetagname == "TBODY")
                {
                    node = node.parentNode;
                    continue;
                }

                var node_style = node.style;
                if (node_style.position == "absolute")
                {
                    skipTd = true;
                }

                left -= (node.scrollLeft | 0);
                top -= (node.scrollTop | 0);
                var borderWidth = (node_style.borderLeftWidth | 0);
                // var borderHeight = (node_style.borderTopWidth | 0);
                if ((nexacro._Browser == "Gecko" || nexacro._Browser == "KHTML") && node.tagName != "TABLE")
                {
                    left += borderWidth * 2;
                    top += borderWidth * 2;
                }
                else if (nexacro._Browser == "WebKit")
                {
                    top += borderWidth;
                    left += borderWidth;
                } // border
                top += (node.offsetTop | 0);
                left += (node.offsetLeft | 0);
                node = node.parentNode;
            }
            return { top: top, left: left };
        };

        nexacro.__getHTMLPageSize = function ()
        {
            var xScroll, yScroll;
            if (window.innerHeight && window.scrollMaxY)
            {
                xScroll = document.body.scrollWidth;
                yScroll = window.innerHeight + window.scrollMaxY;
            }
            else
            {
                if (document.body.scrollHeight > document.body.offsetHeight)
                { // all
                    // but
                    // Explorer
                    // Mac
                    xScroll = document.body.scrollWidth;
                    yScroll = document.body.scrollHeight;
                }
                else
                {
                    if (document.documentElement && document.documentElement.scrollHeight > document.documentElement.offsetHeight)
                    {
                        // Explorer 6
                        // strict
                        // mode
                        xScroll = document.documentElement.scrollWidth;
                        yScroll = document.documentElement.scrollHeight;
                    }
                    else
                    {
                        // Explorer Mac...would also work in Mozilla and
                        // Safari
                        xScroll = document.body.offsetWidth;
                        yScroll = document.body.offsetHeight;
                    }
                }
            }
            var windowWidth, windowHeight;
            if (self.innerHeight)
            { // all except Explorer
                windowWidth = self.innerWidth;
                windowHeight = self.innerHeight;
            }
            else
            {
                if (document.documentElement && document.documentElement.clientHeight)
                {
                    // Explorer 6
                    // Strict Mode
                    windowWidth = document.documentElement.clientWidth;
                    windowHeight = document.documentElement.clientHeight;
                }
                else
                {
                    if (document.body)
                    {
                        // other Explorers
                        windowWidth = document.body.clientWidth;
                        windowHeight = document.body.clientHeight;
                    }
                }
            }
            // for small pages with total height less then height of the viewport
            var pageHeight, pageWidth;
            if (yScroll < windowHeight)
            {
                pageHeight = windowHeight;
            }
            else
            {
                pageHeight = yScroll;
            }
            // for small pages with total width less then width of the viewport
            if (xScroll < windowWidth)
            {
                pageWidth = windowWidth;
            }
            else
            {
                pageWidth = xScroll;
            }
            return [pageWidth, pageHeight, windowWidth, windowHeight];
        };

        nexacro.__findParentElement = function (node)
        {
            if (node)
            {
                while (node)
                {
                    var elem = node._linked_element;
                    if (elem) return elem;
                    node = node.parentNode;
                }
            }
            return;
        };

        nexacro.__findParentElementForKeyEvent = function (node, win)
        {
            // LastFocus가 있는 경우 LastFocus Elem을 리턴
            if (win && win._last_focused_elem)
            {
                // 포커스가 날라간 경우 예외처리
                var focused_elem = win._last_focused_elem;
                if (!focused_elem.visible || focused_elem.handle == null)
                    win._last_focused_elem = null;
                else
                    return win._last_focused_elem;
            }

            // 그렇지 않은경우 Node Element
            return nexacro.__findParentElement(node);
        };

        nexacro.__getWheelDelta = nexacro.__getWheelDeltaY;

        // for WheelEvent type
        var PIXEL_STEP = 10;
        var LINE_HEIGHT = 40;
        var PAGE_HEIGHT = 800;

        if (nexacro._Browser == "Gecko")
        {
            nexacro.__getWheelDeltaX = function (e)
            {
                var wheel_deltax;

                // for WheelEvent type
                if ('deltaX' in e)
                {
                    wheel_deltax = -e.deltaX;
                    if (e.deltaMode == 1) wheel_deltax *= LINE_HEIGHT;    // DOM_DELTA_LINE
                    else if (e.deltaMode == 2) wheel_deltax *= PAGE_HEIGHT;    // DOM_DELTA_PAGE
                }
                else if (e.axis === 2)
                {
                    wheel_deltax = 0;
                }
                else
                {
                    wheel_deltax = -40 * e.detail;
                }
                return wheel_deltax;
            };

            nexacro.__getWheelDeltaY = function (e)
            {
                var wheel_deltay;
                // for WheelEvent type
                if ('deltaY' in e)
                {
                    wheel_deltay = -e.deltaY;
                    if (e.deltaMode == 1) wheel_deltay *= LINE_HEIGHT;    // DOM_DELTA_LINE
                    else if (e.deltaMode == 2) wheel_deltay *= PAGE_HEIGHT;    // DOM_DELTA_PAGE
                }
                else if (e.axis === 2)
                {
                    wheel_deltay = -40 * e.detail;
                }
                else
                {
                    wheel_deltay = 0;
                }
                return wheel_deltay;
            };
        }
        else
        {
            nexacro.__getWheelDeltaX = function (e)
            {
                if ('wheelDeltaX' in e)
                {
                    return e.wheelDeltaX;
                }
                else if ('deltaX' in e)
                {
                    var wheelDeltaX = -e.deltaX;
                    if (e.deltaMode == 1) wheelDeltaX *= LINE_HEIGHT;    // DOM_DELTA_LINE
                    else if (e.deltaMode == 2) wheelDeltaX *= PAGE_HEIGHT;    // DOM_DELTA_PAGE
                    return wheelDeltaX;
                }
                return 0;
            };

            nexacro.__getWheelDeltaY = function (e)
            {
                if ('wheelDeltaY' in e)
                {
                    return e.wheelDeltaY;
                }
                else if ('wheelDelta' in e)
                {
                    return e.wheelDelta;
                }
                else if ('deltaX' in e)
                {
                    var wheelDeltaY = -e.deltaY;
                    if (e.deltaMode == 1) wheelDeltaY *= LINE_HEIGHT;    // DOM_DELTA_LINE
                    else if (e.deltaMode == 2) wheelDeltaY *= PAGE_HEIGHT;    // DOM_DELTA_PAGE
                    return wheelDeltaY;
                }
                return 0;
            };
        }


        nexacro._getSysEventElement = function (sysevt)
        {
            return (sysevt.target) ? nexacro.__findParentElement(sysevt.target) : null;
        };
        nexacro._getSysReleaseEventElement = function (sysevt)
        {
            return (sysevt.relatedTarget) ? nexacro.__findParentElement(sysevt.relatedTarget) : null;
        }
        nexacro._getSysEventKey = function (sysevt)
        {
            return sysevt.charCode || sysevt.keyCode;
        };


        nexacro._getSysEventKeyCode = function (sysevt)
        {
            if (nexacro._Browser == "Gecko")
                return ((sysevt.keyCode > 0 && sysevt.keyCode <= 46) ? sysevt.keyCode : sysevt.charCode === 0 ? sysevt.keyCode : sysevt.charCode);
            else
                return sysevt.keyCode || sysevt.which;
        };



        nexacro._getSysEventX = function (sysevt)
        {
            return sysevt.pageX + document.body.scrollLeft;
        };
        nexacro._getSysEventY = function (sysevt)
        {
            return sysevt.pageY + document.body.scrollTop;
        };

        // TODO: FF
        // (0: left, 1: right, 2: wheel button)
        nexacro._getSysEventBtnCode = function (sysevt/*, code*/)
        {
            return sysevt.which ? (sysevt.which - 1) : (sysevt.button);
        };

        nexacro._stopSysEvent = function (sysevt)
        {
            if (sysevt.cancelable) sysevt.preventDefault();
            if (sysevt.bubbles) sysevt.stopPropagation();
            sysevt.stopped = true;
            return false;
        };

        nexacro._stopPropagation = function (sysevt)
        {
            sysevt.stopPropagation();
            return false;
        };

        nexacro._observeSysEvent = function (node, name, onname, callback)
        {
            if (!nexacro._isMobile() || (name == "touchstart" || name == "touchmove" || name == "touchend"))
            {
                if ((nexacro._Browser == "Chrome" && nexacro._BrowserVersion >= 56) || (nexacro._Browser == "MobileSafari" && (nexacro._BrowserVersion >= 11 || /* desktopmode*/ nexacro._BrowserVersion == -1)) || nexacro._Browser == "Edge" || nexacro._Browser == "Gecko")
                    node.addEventListener(name, callback, { passive: false });
                else
                    node.addEventListener(name, callback, false);
            }
            else
            {

                node.addEventListener(name, callback, false);
            }
        };

        nexacro._stopSysObserving = function (node, name, onname, callback, cleancallback = true)
        {
            node.removeEventListener(name, callback, false);
            if (cleancallback)
                callback = null;
        };



        nexacro.__getCoordinates = function (touch, type) 
        {
            switch (type) 
            {
                case "screenX":
                    return nexacro._Browser === "MobileSafari" ? touch.screenX : (touch.pageX || touch.clientX);
                case "screenY":
                    return nexacro._Browser === "MobileSafari" ? touch.screenY : (touch.pageY || touch.clientY);
                case "windowX":
                    return (nexacro._BrowserExtra === "SamsungBrowser" && parseInt(nexacro._OSVersion) >= 6)
                        ? (touch.clientX || touch.pageX)
                        : (touch.pageX || touch.clientX);
                case "windowY":
                    return (nexacro._BrowserExtra === "SamsungBrowser" && parseInt(nexacro._OSVersion) >= 6)
                        ? (touch.clientY || touch.pageY)
                        : (touch.pageY || touch.clientY);
                default:
                    return null;
            }
        };

        nexacro.__getScreenX = function (touch) 
        {
            return nexacro.__getCoordinates(touch, "screenX");
        };

        nexacro.__getScreenY = function (touch) 
        {
            return nexacro.__getCoordinates(touch, "screenY");
        };

        nexacro.__getWindowX = function (touch) 
        {
            return nexacro.__getCoordinates(touch, "windowX");
        };

        nexacro.__getWindowY = function (touch) 
        {
            return nexacro.__getCoordinates(touch, "windowY");
        };

        nexacro._getCurrentBodyScrollTop = function () 
        {
            if (nexacro._Browser === "MobileSafari") 
            {
                if (nexacro._BrowserVersion > 11.1 && !nexacro._allow_default_pinchzoom) 
                {
                    return document.body.scrollTop;
                }
            }
            return 0;
        };


        nexacro._getSysEventBtnString = function (sysevt)
        {
            switch (nexacro._getSysEventBtnCode(sysevt))
            {
                case nexacro.HTMLSysEvent.prototype.MOUSE_LBUTTON:
                    return "lbutton";
                case nexacro.HTMLSysEvent.prototype.MOUSE_MBUTTON:
                    return "mbutton";
                case nexacro.HTMLSysEvent.prototype.MOUSE_RBUTTON:
                    return "rbutton";
                default:
                    return "none";
            }
        };

        // for element : The node should be 'element handle'.
        nexacro._observeEvent = nexacro._observeSysEvent;
        nexacro._stopObserving = nexacro._stopSysObserving;

        nexacro.__fireHTMLEvent = function (node, name/*, onname*/)
        {
            var doc = node.ownerDocument || node.document;

            var evt = nexacro.__createHTMLEvent(doc, name);
            if (evt)
            {
                nexacro.__despatchEvent(node, evt);
            }
        };

        nexacro.__createHTMLEvent = function (doc, name)
        {
            if (doc.createEvent)
            {
                var evt = doc.createEvent('HTMLEvents');
                evt.initEvent(name, true, true);
                return evt;
            }

            return;
        };

        nexacro.__despatchEvent = function (node, evt)
        {
            if (node && evt)
                node.dispatchEvent(evt);
        };

        //==============================================================================
        // for CSS object Control for Web Browser
        //==============================================================================
        // color table
        nexacro._xreNamedColorList =
        {
            "": "",
            "transparent": "transparent",
            "@gradation": "",
            "aliceblue": "#F0F8FF",
            "antiquewhite": "#FAEBD7",
            "aqua": "#00FFFF",
            "aquamarine": "#7FFFD4",
            "azure": "#F0FFFF",
            "beige": "#F5F5DC",
            "bisque": "#FFE4C4",
            "black": "#000000",
            "blanchedalmond": "#FFEBCD",
            "blue": "#0000FF",
            "blueviolet": "#8A2BE2",
            "brown": "#A52A2A",
            "burlywood": "#DEB887",
            "cadetblue": "#5F9EA0",
            "chartreuse": "#7FFF00",
            "chocolate": "#D2691E",
            "coral": "#FF7F50",
            "cornflowerblue": "#6495ED",
            "cornsilk": "#FFF8DC",
            "crimson": "#DC143C",
            "cyan": "#00FFFF",
            "darkblue": "#00008B",
            "darkcyan": "#008B8B",
            "darkgoldenrod": "#B8860B",
            "darkgray": "#A9A9A9",
            "darkgreen": "#006400",
            "darkgrey": "#A9A9A9",
            "darkkhaki": "#BDB76B",
            "darkmagenta": "#8B008B",
            "darkolivegreen": "#556B2F",
            "darkorange": "#FF8C00",
            "darkorchid": "#9932CC",
            "darkred": "#8B0000",
            "darksalmon": "#E9967A",
            "darkseagreen": "#8FBC8F",
            "darkslateblue": "#483D8B",
            "darkslategray": "#2F4F4F",
            "darkslategrey": "#2F4F4F",
            "darkturquoise": "#00CED1",
            "darkviolet": "#9400D3",
            "deeppink": "#FF1493",
            "deepskyblue": "#00BFFF",
            "dimgray": "#696969",
            "dimgrey": "#696969",
            "dodgerblue": "#1E90FF",
            "firebrick": "#B22222",
            "floralwhite": "#FFFAF0",
            "forestgreen": "#228B22",
            "fuchsia": "#FF00FF",
            "gainsboro": "#DCDCDC",
            "ghostwhite": "#F8F8FF",
            "gold": "#FFD700",
            "goldenrod": "#DAA520",
            "gray": "#808080",
            "green": "#008000",
            "greenyellow": "#ADFF2F",
            "grey": "#808080",
            "honeydew": "#F0FFF0",
            "hotpink": "#FF69B4",
            "indianred": "#CD5C5C",
            "indigo": "#4B0082",
            "ivory": "#FFFFF0",
            "khaki": "#F0E68C",
            "lavender": "#E6E6FA",
            "lavenderblush": "#FFF0F5",
            "lawngreen": "#7CFC00",
            "lemonchiffon": "#FFFACD",
            "lightblue": "#ADD8E6",
            "lightcoral": "#F08080",
            "lightcyan": "#E0FFFF",
            "lightgoldenrodyellow": "#FAFAD2",
            "lightgray": "#D3D3D3",
            "lightgreen": "#90EE90",
            "lightgrey": "#D3D3D3",
            "lightpink": "#FFB6C1",
            "lightsalmon": "#FFA07A",
            "lightseagreen": "#20B2AA",
            "lightskyblue": "#87CEFA",
            "lightslategray": "#778899",
            "lightslategrey": "#778899",
            "lightsteelblue": "#B0C4DE",
            "lightyellow": "#FFFFE0",
            "lime": "#00FF00",
            "limegreen": "#32CD32",
            "linen": "#FAF0E6",
            "magenta": "#FF00FF",
            "maroon": "#800000",
            "mediumaquamarine": "#66CDAA",
            "mediumblue": "#0000CD",
            "mediumorchid": "#BA55D3",
            "mediumpurple": "#9370DB",
            "mediumseagreen": "#3CB371",
            "mediumslateblue": "#7B68EE",
            "mediumspringgreen": "#00FA9A",
            "mediumturquoise": "#48D1CC",
            "mediumvioletred": "#C71585",
            "midnightblue": "#191970",
            "mintcream": "#F5FFFA",
            "mistyrose": "#FFE4E1",
            "moccasin": "#FFE4B5",
            "navajowhite": "#FFDEAD",
            "navy": "#000080",
            "oldlace": "#FDF5E6",
            "olive": "#808000",
            "olivedrab": "#6B8E23",
            "orange": "#FFA500",
            "orangered": "#FF4500",
            "orchid": "#DA70D6",
            "palegoldenrod": "#EEE8AA",
            "palegreen": "#98FB98",
            "paleturquoise": "#AFEEEE",
            "palevioletred": "#DB7093",
            "papayawhip": "#FFEFD5",
            "peachpuff": "#FFDAB9",
            "peru": "#CD853F",
            "pink": "#FFC0CB",
            "plum": "#DDA0DD",
            "powderblue": "#B0E0E6",
            "purple": "#800080",
            "red": "#FF0000",
            "rosybrown": "#BC8F8F",
            "royalblue": "#4169E1",
            "saddlebrown": "#8B4513",
            "salmon": "#FA8072",
            "sandybrown": "#F4A460",
            "seagreen": "#2E8B57",
            "seashell": "#FFF5EE",
            "sienna": "#A0522D",
            "silver": "#C0C0C0",
            "skyblue": "#87CEEB",
            "slateblue": "#6A5ACD",
            "slategray": "#708090",
            "slategrey": "#708090",
            "snow": "#FFFAFA",
            "springgreen": "#00FF7F",
            "steelblue": "#4682B4",
            "tan": "#D2B48C",
            "teal": "#008080",
            "thistle": "#D8BFD8",
            "tomato": "#FF6347",
            "turquoise": "#40E0D0",
            "violet": "#EE82EE",
            "wheat": "#F5DEB3",
            "white": "#FFFFFF",
            "whitesmoke": "#F5F5F5",
            "yellow": "#FFFF00",
            "yellowgreen": "#9ACD32"
        };

        nexacro._getSupportedWebColor = function (val)
        {
            val = val.trim();
            val = val.toLowerCase();

            return val;
        };

        if (nexacro._Browser_Gradient == 1)
        {
            nexacro._getSupportedWebGradient = function (val)
            {
                return val;
            };
        }
        else if (nexacro._Browser_Gradient == 2) // legacy Gradient
        {
            if (nexacro._Browser == "Gecko")
                nexacro._regacy_gradient_name = "-moz-linear-gradient";
            else if (nexacro._Browser == "WebKit" || nexacro._Browser == "Chrome" || nexacro._Browser == "MobileSafari" || nexacro._Browser == "Safari" || nexacro._Browser == "Edge")
                nexacro._regacy_gradient_name = "-webkit-linear-gradient";
            else if (nexacro._Browser == "Opera")
                nexacro._regacy_gradient_name = "-o-linear-gradient";

            nexacro._getSupportedWebGradient = function (val)
            {
                var props = val.substring(val.indexOf("(") + 1, val.lastIndexOf(")")).trim().split(/\s?,\s?/);
                var first = props[0].trim();
                if (first.substr(0, 2) == "to")
                {
                    var start = first.substring(3).trim().replace(/\s+/, " ");
                    switch (start)
                    {
                        case "left":
                            start = "right";
                            break;
                        case "right":
                            start = "left";
                            break;
                        case "top":
                            start = "bottom";
                            break;
                        case "bottom":
                            start = "top";
                            break;
                        case "left top":
                            start = "right bottom";
                            break;
                        case "right top":
                            start = "left bottom";
                            break;
                        case "left bottom":
                            start = "right top";
                            break;
                        case "right bottom":
                            start = "left top";
                            break;
                    }
                    props[0] = start;
                    return nexacro._regacy_gradient_name + "(" + props.join(",") + ")";
                }
                else
                {
                    return nexacro._regacy_gradient_name + "(top," + props.join(",") + ")";
                }
            };
        }
        else // ==> backgroundColor
        {
            nexacro._getSupportedWebGradient = function (val)
            {
                var props = val.substring(val.indexOf("(") + 1, val.lastIndexOf(")")).trim().split(/\s?,\s?/);
                var color = props[0];
                if (color.substr(0, 2) == "to")
                    color = props[1].trim();
                var pos = color.indexOf(" ");
                if (color.indexOf(" ") >= 0)
                    return color.substr(0, pos);
                return color;
            };
        }

        if (nexacro._Browser == "Chrome" || nexacro._BrowserType == "Opera" || nexacro._Browser == "Edge")
        {
            nexacro._getSupportedImageUrl = function (url, baseurl)
            {

                var format = nexacro._transImageBase64StringFormat(url, false, true);
                var ret;
                if (format)
                {
                    if (format.ext == "")
                    {
                        ret = format.data + "/*" + format.encode + format.contents;
                    }
                    else
                    {
                        ret = format.alldata;

                    }
                    return ret;
                }

                return nexacro._getSupportedImageLocation(nexacro._getURIValue(url), baseurl);
            };
        }
        else
        {
            nexacro._getSupportedImageUrl = function (url, baseurl)
            {
                var format = nexacro._transImageBase64StringFormat(url, false, true);
                var ret;
                if (format)
                {
                    ret = format.alldata;
                    return ret;
                }

                return nexacro._getSupportedImageLocation(nexacro._getURIValue(url), baseurl);
            };
        }

        nexacro._getSupportedImageLocation = function (str, baseurl)
        {
            var url = str;



            var typedefinition_url = nexacro._typedefinition_url;

            if (!baseurl)
                baseurl = nexacro._project_absolutepath;

            return nexacro._transurl(baseurl, typedefinition_url, url);
        };

        //==============================================================================
        nexacro._getWebColorFromXreColor = function (color)
        {
            var v = nexacro._xreNamedColorList[color];
            if (v)
            {
                return v;
            }

            var len = color.length;
            var alpha, str;

            if (color.substring(0, 1) == '#')
            {
                if (len == 7)
                { // "#00ff00"
                    return color;
                }
                if (len == 9)
                { // "#00ff00ff"
                    alpha = color.substring(7);
                    if (alpha == "00")
                    {
                        return "transparent";
                    }
                    else
                    {
                        str = "rgba(";
                        str += parseInt(color.substring(1, 3), 16) + ',';
                        str += parseInt(color.substring(3, 5), 16) + ',';
                        str += parseInt(color.substring(5, 7), 16) + ',';
                        str += (parseInt(alpha, 16) / 255);
                        str += ")";
                        return str;
                    }
                }
            }
            if (color.substring(0, 2) == "0x")
            {
                if (len == 8)
                { // "0x00ff00"
                    return "#" + color.substring(2);
                }
                if (len == 10)
                { // "0x00ff00ff"
                    alpha = color.substring(8);
                    if (alpha == "00")
                    {
                        return "transparent";
                    }
                    else
                    {
                        str = "rgba(";
                        str += parseInt(color.substring(2, 4), 16) + ',';
                        str += parseInt(color.substring(4, 6), 16) + ',';
                        str += parseInt(color.substring(6, 8), 16) + ',';
                        str += (parseInt(alpha, 16) / 255);
                        str += ")";
                        return str;
                    }
                }
            }
            return "";
        };

        nexacro._getXreColorAlpha = function (color)
        {
            if (!color)
                return 255;
            if (typeof color != "string")
            {
                color = color.toString();
            }
            var v = nexacro._xreNamedColorList[color];
            if (v)
            {
                return 255;
            }
            var len = color.length;
            if (len == 7)
            { // "#00ff00"
                return 255;
            }
            if (len == 9)
            { // "#00ff00ff"
                return parseInt(color.substr(7), 16);
            }
            if (len == 8)
            { // "0x00ff00"
                return 255;
            }
            if (len == 10)
            { // "0x00ff00ff"
                return parseInt(color.substr(8), 16);
            }
            return 255;
        };

        nexacro._getXreColorOpacity = function (color)
        {
            if (!color)
                return 100;
            if (typeof color != "string")
            {
                color = color.toString();
            }
            var v = nexacro._xreNamedColorList[color];
            if (v)
            {
                return 100;
            }
            var len = color.length;
            if (len == 7)
            { // "#00ff00"
                return 100;
            }
            if (len == 9)
            { // "#00ff00ff"
                return Math.round(parseInt(color.substring(7), 16) * 100 / 255);
            }
            if (len == 8)
            { // "0x00ff00"
                return 100;
            }
            if (len == 10)
            { // "0x00ff00ff"
                return Math.round(parseInt(color.substring(8), 16) * 100 / 255);
            }
            return 100;
        };

        //==============================================================================
        // for CSS Gradation for Web Browser
        //==============================================================================
        if (nexacro._Browser == "Gecko")
        {
            nexacro._makeGradationSysValue = function (cssobj)
            {
                if (cssobj.style == "linear" && (cssobj.start_color || cssobj.end_color))
                {
                    var start_color = nexacro._getWebColorFromXreColor(cssobj.start_color);
                    var end_color = nexacro._getWebColorFromXreColor(cssobj.end_color);
                    var start_x = cssobj._start_x, start_y = cssobj._start_y;
                    var end_x = cssobj._end_x, end_y = cssobj._end_y;

                    if (start_color && start_x != null && start_y != null)
                    {
                        cssobj.start = start_x + "%, " + start_y + "% " + cssobj.start_color;
                    }
                    if (end_color && end_x != null && end_y != null)
                    {
                        cssobj.end = end_x + "%, " + end_y + "% " + cssobj.end_color;
                    }

                    //default value set
                    if (start_color && !end_color)
                    {
                        end_color = "black";
                    }
                    else if (!start_color && end_color)
                    {
                        start_color = "white";
                    }

                    var val = "-moz-linear-gradient(";
                    if (start_x == end_x)
                    {
                        if (start_y > end_y)
                        {
                            val += "to top, ";
                        }
                        else if (start_y < end_y)
                        {
                            val += "to bottom, ";
                        }
                        else if (start_y == end_y)
                        {
                            val += "center, ";
                        }
                    }
                    else if (start_x > end_x)
                    {
                        if (start_y == end_y)
                        {
                            val += "to left, ";
                        }
                        else if (start_y > end_y)
                        {
                            val += "to top left, ";
                        }
                        else if (start_y < end_y)
                        {
                            val += "to bottom left, ";
                        }
                        else
                        {
                            val += "center, ";
                        }
                    }
                    else if (start_x < end_x)
                    {
                        if (start_y == end_y)
                        {
                            val += "to right, ";
                        }
                        else if (start_y > end_y)
                        {
                            val += "to top right, ";
                        }
                        else if (start_y < end_y)
                        {
                            val += "to bottom right, ";
                        }
                        else
                        {
                            val += "center, ";
                        }
                    }

                    val += start_color;
                    val += " 0%,";
                    // add paglist
                    if (cssobj.peglist.length)
                    {
                        var arr = cssobj._parsePegList(cssobj.peglist);
                        var len = arr.length;
                        var valarr;
                        for (var i = 0; i < len; i++)
                        {
                            valarr = arr[i];
                            val += nexacro._getWebColorFromXreColor(valarr[1]) + " " + valarr[0] + "%,";
                        }
                    }
                    // end paglist
                    val += end_color;
                    val += " 100%)";

                    cssobj._sysvalue = val;
                }
                else
                {
                    cssobj._sysvalue = "";
                }
            };
        }
        else if (nexacro._Browser == "WebKit" || nexacro._Browser == "Chrome" || nexacro._Browser == "MobileSafari" || nexacro._Browser == "Safari" || nexacro._Browser == "Edge")
        { // webkit, chrome
            nexacro._makeGradationSysValue = function (cssobj)
            {
                if (cssobj.style == "linear" && (cssobj.start_color || cssobj.end_color))
                {
                    var start_color = nexacro._getWebColorFromXreColor(cssobj.start_color);
                    var end_color = nexacro._getWebColorFromXreColor(cssobj.end_color);
                    var start_x = cssobj._start_x, start_y = cssobj._start_y;
                    var end_x = cssobj._end_x, end_y = cssobj._end_y;

                    if (start_color && start_x != null && start_y != null)
                    {
                        cssobj.start = start_x + "%, " + start_y + "% " + cssobj.start_color;
                    }
                    if (end_color && end_x != null && end_y != null)
                    {
                        cssobj.end = end_x + "%, " + end_y + "% " + cssobj.end_color;
                    }

                    //default value set
                    if (start_color && !end_color)
                    {
                        end_color = "black";
                    }
                    else if (!start_color && end_color)
                    {
                        start_color = "white";
                    }

                    var val = "-webkit-gradient(linear,";
                    val += start_x + "% " + start_y + "%,";
                    val += end_x + "% " + end_y + "%,";
                    val += "from(";
                    val += start_color;
                    val += "),";
                    // add paglist
                    if (cssobj.peglist.length)
                    {
                        var arr = cssobj._parsePegList(cssobj.peglist);
                        var len = arr.length;
                        var valarr;
                        for (var i = 0; i < len; i++)
                        {
                            valarr = arr[i];
                            val += "color-stop(" + valarr[0] + "%," + nexacro._getWebColorFromXreColor(valarr[1]) + "),";
                        }
                    }
                    // end paglist
                    val += "to(";
                    val += end_color;
                    val += "))";
                    cssobj._sysvalue = val;
                }
                else
                {
                    cssobj._sysvalue = "";
                }
            };
        }
        else if (nexacro._Browser == "Opera")
        { // opera
            nexacro._makeGradationSysValue = function (cssobj)
            {
                if (cssobj.style == "linear" && (cssobj.start_color || cssobj.end_color))
                {
                    var start_color = nexacro._getWebColorFromXreColor(cssobj.start_color);
                    var end_color = nexacro._getWebColorFromXreColor(cssobj.end_color);
                    var start_x = cssobj._start_x, start_y = cssobj._start_y;
                    var end_x = cssobj._end_x, end_y = cssobj._end_y;

                    if (start_color && start_x != null && start_y != null)
                    {
                        cssobj.start = start_x + "%, " + start_y + "% " + cssobj.start_color;
                    }
                    if (end_color && end_x != null && end_y != null)
                    {
                        cssobj.end = end_x + "%, " + end_y + "% " + cssobj.end_color;
                    }

                    //calculate degree
                    var dx = end_x - start_x;
                    var dy = end_y - start_y;
                    var ang = (((Math.atan2(dx, dy)) * 180) / Math.PI) - 90;
                    if (isNaN(ang)) ang = 45;

                    //default value set
                    if (start_color && !end_color) end_color = "black";
                    else if (!start_color && end_color) start_color = "white";

                    var val = "-o-linear-gradient(";
                    val += ang + "deg, ";

                    val += start_color;
                    val += " 0%,";
                    // add paglist
                    if (cssobj.peglist.length)
                    {
                        var arr = cssobj._parsePegList(cssobj.peglist);
                        var len = arr.length;
                        var valarr;
                        for (var i = 0; i < len; i++)
                        {
                            valarr = arr[i];
                            val += nexacro._getWebColorFromXreColor(valarr[1]) + " " + valarr[0] + "%,";
                        }
                    }
                    // end paglist
                    val += end_color;
                    val += " 100%)";
                    cssobj._sysvalue = val;
                }
                else
                {
                    cssobj._sysvalue = "";
                }
            };
        }
        else
        {
            nexacro._makeGradationSysValue = nexacro._emptyFn;
        }

        //==============================================================================
        nexacro._getSupportedWebCursor = function (cursor)
        {
            if (cursor == "auto")
            {
                return "default";
            }

            return cursor ? cursor : "default";
        };
        nexacro._initHTMLSysTimerManager = nexacro._emptyFn;
        nexacro._finalizeHTMLSysTimerManager = nexacro._emptyFn;



        nexacro._setSystemTimer = function (_win_handle, timerfn, interval)
        {

            const _win = nexacro._handletoWindow(_win_handle);
            if (_win)
            {
                if (arguments.length > 3)
                    return _win.setInterval(timerfn, interval, arguments[3]);
                else
                    return _win.setInterval(timerfn, interval);
            }
            return null;
        };
        nexacro._clearSystemTimer = function (_win_handle, timer_handle)
        {
            const _win = nexacro._handletoWindow(_win_handle);
            if (_win)
                _win.clearInterval(timer_handle);

        };

        // 경로에 마지막"/"을 포함한다.
        nexacro._getProjectBaseURL = function (/*url*/)
        {
            var location = window.location.href;
            if (location.length > 0)
            {
                var idx = location.indexOf("quickview.html?");
                if (idx > -1)
                    return location.substring(0, idx);
                if (nexacro.__APPLOADER_BASE_PATH__)
                {
                    const add = nexacro.__APPLOADER_BASE_PATH__.replace("./", "");
                    return location.substring(0, location.lastIndexOf("/") + 1) + add;
                }
                else
                    return location.substring(0, location.lastIndexOf("/") + 1);
            }
            return "";
        };

        nexacro._initInformation = function ()
        {
            var env = nexacro.getEnvironment();
            if (env)
            {
                nexacro._init_info = {
                    "xadl": env._request_mainurl,
                    "pass_key": true,
                    message: ""
                };

                var target_path = nexacro._getServiceLocation(env.licenseurl);
                nexacro._getXMLObject(target_path);
            }
        };

        nexacro._checkInformation = function (init_info)
        {
            if (nexacro.__checkClientLicense())
            {
                if (!nexacro._init_block_node)
                {
                    nexacro._createBlockNode(true);
                }

                if (init_info)
                {
                    nexacro._createBlockNode(false, init_info);
                }
            }

        };

        nexacro.__checkClientLicense = function ()
        {
            //Mainframe 일 때만 라이센스 체크 표시
            var _win = window;
            if (_win)
            {
                var main_window = _win._linked_window;
                if (main_window)
                {
                    var _frame = main_window.frame;
                    if (_frame)
                    {
                        return _frame._is_main ? true : false;
                    }
                }
            }
            return false;
        };

        nexacro.__taskblockNodeApp = function (app, is_create, info)
        {
            const mainframe = app.mainframe;
            if (mainframe && mainframe._control_element)
            {
                let frame_control = mainframe._control_element;
                const _win = mainframe._getWindow();
                if (is_create)
                {
                    if (mainframe._init_block_node)
                    {
                        return;
                    }


                    const elem = new nexacro.ControlElement(frame_control);

                    elem.name = "block_node";
                    elem.height = 0;
                    elem.width = _win.clientWidth;

                    elem.create(_win);

                    mainframe._init_block_node = elem;
                }
                else
                {
                    const active_frame = mainframe.getActiveFrame();
                    if (active_frame && active_frame._control_element)
                    {
                        const node = mainframe._init_block_node;
                        if (node && info.pass_key === false)
                        {
                            nexacro.__setDOMNode_Text(node.handle, info.message);
                            node.setElementBackground(nexacro.BackgroundObject("red"));
                            node.setElementSize(_win.clientWidth, 20);

                            frame_control = active_frame._control_element;
                            frame_control.setElementPosition(frame_control.left, node.height);
                        }
                    }
                }
            }
        };
        nexacro.__taskblockNodeForm = function (app, is_create, info)
        {
            var form = app;
            if (form && form._control_element)
            {
                let form_control = form._control_element;
                const _win = form._getWindow();
                if (is_create)
                {
                    if (form._init_block_node)
                    {
                        return;
                    }

                    const elem = new nexacro.ControlElement(form_control);

                    elem.name = "block_node";
                    elem.height = 0;
                    elem.width = _win.clientWidth;

                    elem.create(_win);

                    form._init_block_node = elem;
                }
                else
                {
                    if (form && form._control_element)
                    {
                        const node = form._init_block_node;
                        if (node && info.pass_key === false)
                        {
                            nexacro.__setDOMNode_Text(node.handle, info.message);
                            node.setElementBackground(nexacro.BackgroundObject("red"));
                            node.setElementSize(_win.clientWidth, 20);

                            form_control = form._control_element;
                            form_control.setElementPosition(form_control.left, node.height);
                        }
                    }
                }
            }
        };
        nexacro._createBlockNode = function (is_create, info)
        {
            var app = nexacro.getApplication();
            if (app)
            {
                var mainframe = app.mainframe;
                if (mainframe && mainframe._control_element)
                {
                    var frame_control, _win = mainframe._getWindow();
                    if (is_create)
                    {
                        if (nexacro._init_block_node)
                        {
                            return;
                        }

                        frame_control = mainframe._control_element;
                        var elem = new nexacro.ControlElement(frame_control);

                        elem.name = "block_node";
                        elem.height = 0;
                        elem.width = _win.clientWidth;

                        elem.create(_win);

                        nexacro._init_block_node = elem;
                    }
                    else
                    {
                        var active_frame = mainframe.getActiveFrame();
                        if (active_frame && active_frame._control_element)
                        {
                            var node = nexacro._init_block_node;
                            if (node && info.pass_key === false)
                            {
                                nexacro.__setDOMNode_Text(node.handle, info.message);
                                node.setElementBackground(nexacro.BackgroundObject("red"));
                                node.setElementSize(_win.clientWidth, 20);

                                frame_control = active_frame._control_element;
                                frame_control.setElementPosition(frame_control.left, node.height);
                            }
                        }
                    }
                }
            }
            else
            {
                // for mfe make all
                if (nexacro.ismodule)
                {
                    const apps = nexacro.__MFEAPI._getRootApps();
                    for (const app of apps)
                    {
                        if (app._is_application)
                        {
                            nexacro.__taskblockNodeApp(app, is_create, info);
                        }
                        else
                        {
                            nexacro.__taskblockNodeForm(app, is_create, info);
                        }

                    }

                }
            }
        };

        nexacro._checkLicense = nexacro._emptyFn;
        nexacro._updateEngine = nexacro._emptyFn;
        nexacro._addUpdateResoruce = nexacro._emptyFn;
        nexacro._updateResource = nexacro._emptyFn;

        nexacro._checkActiveElement = function (element)
        {
            var _doc = element._getRootWindowHandle();
            if (!_doc)
                return false;
            var win = nexacro._findDocumentWindow(_doc, element);
            if (!win)
                return false;

            if (!win._is_active_window)
                return false;

            return (_doc.activeElement == element.handle) ? true : false;
        };

        nexacro._loadImageBase64 = function (source, target, handler)
        {
            var data = source.toString();
            var handle = nexacro.ImageElement(target.getElement());

            var format = nexacro._transImageBase64StringFormat(data, true);
            if (format)
            {
                if (format.ext == "")
                    data = format.data + "/png" + format.encode + format.contents;
                else
                    data = format.alldata;
            }


            handle.setElementImageUrl(data);
            var errorcode, errormsg;
            handler.call(target, errorcode, errormsg, source, data);
            return handle;
        };

        nexacro._convertRealPath = function (/*path*/)
        {
            //return 0;
        };

        nexacro._execBrowser = function (url)
        {
            var _url = url.toLowerCase();

            var prefix = "mailto:";
            var reg = new RegExp(prefix);

            if (reg.test(_url))
            {
                var iframe = document.createElement("iframe");
                var body = document.body;
                iframe.src = prefix + url.substring(7, url.length);
                iframe.style.display = "none";

                var str_title = nexacro._getErrorMessge("msg_accessibility_emptyframe");
                nexacro.__setDOMNode_Title(iframe, str_title);

                body.appendChild(iframe);
                nexacro.__removeDOMNode(body, iframe);
                //iframe = null;
                return;
            }

            reg = new RegExp("tel:");
            if (reg.test(_url))
            {
                window.open(url);
                return;
            }

            url = nexacro._getImageLocation(nexacro._checkDomain(url));
            window.open(url);
            return;
        };

        nexacro._execDefaultBrowser = function (url, newwindow)
        {
            return nexacro._execBrowser(url);
        };

        nexacro._checkDomain = function (url)
        {
            // 특정 url이 match에서 정규식 복잡도로 인해 수행 시간 지연되는 현상
            //var expr = new RegExp("^(https?:\\/\\/)?((([a-z\d](([a-z\d-]*[a-z\d])|([ㄱ-힣]))*)\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$");
            var expr = new RegExp("^(https?:\\/\\/)");
            if (!expr.test(url))
            {
                return "http://" + url;
            }
            return url;
        };

        nexacro._execShell = function ()
        {
        };

        nexacro._execNexacro = function (/*command*/)
        {
        };

        if (nexacro._Browser == "Chrome" || nexacro._Browser == "Gecko" || nexacro._Browser == "Opera" || nexacro._Browser == "Edge")
        {
            nexacro._setClipboard = function (format, data)
            {
                if (nexacro._OS == "Android" && nexacro._isHybrid() && format == "CF_TEXT")
                {
                    var params = { param: data };
                    var json = {
                        id: "0000",
                        div: "Clipboard",
                        method: "setClipboard",
                        params: params
                    };

                    var jsonstr = JSON.stringify(json);
                    nexacro.Device.exec(jsonstr, true);
                }
                else
                {
                    if (window.isSecureContext && format == "CF_TEXT")
                    {
                        if (navigator.clipboard && navigator.clipboard.writeText)
                            navigator.clipboard.writeText(data);
                    }
                }
            };

            nexacro._getClipboard = function (format, callback, target)
            {
                if (nexacro._OS == "Android" && nexacro._isHybrid() && format == "CF_TEXT")
                {
                    var json = {
                        id: "0000",
                        div: "Clipboard",
                        method: "getClipboard"
                    };

                    var jsonstr = JSON.stringify(json);
                    return nexacro.Device.exec(jsonstr, true);
                }
                else
                {
                    if (window.isSecureContext && format == "CF_TEXT")
                    {
                        if (navigator.clipboard && navigator.clipboard.readText)
                        {
                            if (callback && (typeof callback == "function"))
                            {
                                navigator.clipboard.readText().then(function (data)
                                {
                                    if (target)
                                        callback.call(target, data);
                                    else
                                        callback(data);
                                });
                            }
                        }
                    }
                }
            };

            nexacro._clearClipboard = function ()
            {
                if (nexacro._OS == "Android" && nexacro._isHybrid())
                {
                    var json = {
                        id: "0000",
                        div: "Clipboard",
                        method: "clearClipboard"
                    };

                    var jsonstr = JSON.stringify(json);
                    nexacro.Device.exec(jsonstr, true);
                }
                else
                {
                    if (window.isSecureContext)
                    {
                        if (navigator.clipboard && navigator.clipboard.writeText)
                            navigator.clipboard.writeText("");
                    }
                }
            };
        }
        else if (nexacro._OS == "iOS")
        {
            nexacro._setClipboard = function (format, data)
            {
                if (nexacro._isHybrid() && format == "CF_TEXT")
                {
                    var json = {
                        div: "clipboard",
                        method: "setClipboard",
                        params: nexacro.base64Encode(data)
                    };

                    var jsonstr = JSON.stringify(json);
                    nexacro.Device.exec(jsonstr, true);
                }
            };

            nexacro._getClipboard = function (format, callback, target)
            {
                if (nexacro._isHybrid() && format == "CF_TEXT")
                {
                    var json = {
                        div: "clipboard",
                        method: "getClipboard"
                    };

                    var jsonstr = JSON.stringify(json);
                    return nexacro.Device.exec(jsonstr, true);
                }
            };

            nexacro._clearClipboard = function ()
            {
                if (nexacro._isHybrid())
                {
                    var json = {
                        div: "clipboard",
                        method: "clearClipboard"
                    };

                    var jsonstr = JSON.stringify(json);
                    nexacro.Device.exec(jsonstr, true);
                }
            };
        }
        else
        {
            nexacro._setClipboard = nexacro._emptyFn;
            nexacro._getClipboard = nexacro._emptyFn;
            nexacro._clearClipboard = nexacro._emptyFn;
        }

        nexacro._getScreenWidth = function (/*monitor_index*/)
        {
            if (!nexacro._isDesktop() && nexacro._OS == "Android" && nexacro._Browser == "Chrome")
            {
                // orientation값만 바뀌고 screen 바뀌지 않는 케이스가 발견됨.
                // 세로로 길쭉한 장비가 확실한 경우, 직접 값을 swap해서 넘기도록...
                var is_portrait_device = nexacro._searchDeviceExceptionValue("is_portrait_device");
                if (is_portrait_device === true)
                {
                    var orientation = nexacro._getMobileOrientation();
                    var is_swap_screen = nexacro._searchDeviceExceptionValue("swap_screen");
                    var is_delayed_swap_screen = nexacro._searchDeviceExceptionValue("delayed_swap_screen");
                    if (orientation == 2 || orientation == 3) // landscape
                    {
                        if (is_swap_screen === true && !is_delayed_swap_screen)
                        {
                            // swap되어서 w>h 이어야 하는 상황인데 그렇지 않음->오류상황
                            if (screen.width < screen.height)
                                return screen.height;
                        }
                    }
                }
            }

            return screen.width;
        };

        nexacro._getScreenHeight = function (/*monitor_index*/)
        {
            if (!nexacro._isDesktop() && nexacro._OS == "Android" && nexacro._Browser == "Chrome")
            {
                // orientation값만 바뀌고 screen 바뀌지 않는 케이스가 발견됨.
                // 세로로 길쭉한 장비가 확실한 경우, 직접 값을 swap해서 넘기도록...
                var is_portrait_device = nexacro._searchDeviceExceptionValue("is_portrait_device");
                if (is_portrait_device === true)
                {
                    var orientation = nexacro._getMobileOrientation();
                    var is_swap_screen = nexacro._searchDeviceExceptionValue("swap_screen");
                    var is_delayed_swap_screen = nexacro._searchDeviceExceptionValue("delayed_swap_screen");
                    if (orientation == 2 || orientation == 3) // landscape
                    {
                        if (is_swap_screen === true && !is_delayed_swap_screen)
                        {
                            // swap되어서 w>h 이어야 하는 상황인데 그렇지 않음->오류상황
                            if (screen.width < screen.height)
                                return screen.width;
                        }
                    }
                }
            }

            return screen.height;
        };

        nexacro._getScreenAvailWidth = function (/*monitor_index*/)
        {
            return screen.availWidth;
        };

        nexacro._getScreenAvailHeight = function (/*monitor_index*/)
        {
            return screen.availHeight;
        };

        nexacro._getScreenRect = function (/*monitor_index*/)
        {
            return new nexacro.Rect(0, 0, screen.width, screen.height);
        };

        nexacro._isPrimaryMonitor = function (/*monitor_index*/)
        {
            //
        };

        nexacro._getMonitorIndex = function (/*cursorX, cursorY*/)
        {
            //
        };

        //system.osversion
        nexacro._getOS = function ()
        {
            return nexacro._OS;
        };

        nexacro._getOSVersion = function ()
        {
            if (nexacro._OS.indexOf("Win") >= 0)
            {
                //getOSVer //OS 사용량이 많은순으로 검색 7->XP->8->etc..
                switch (nexacro._OSVersion)
                {
                    case "5.0":
                        return "Windows 2000";
                    case "5.01":
                        return "Windows 2000, Service Pack 1 (SP1)";
                    case "5.1":
                        return "Windows XP";
                    case "5.2":
                        return "Windows Server 2003 / Windows XP 64-bit";
                    case "6.0":
                        return "Windows Vista";
                    case "6.1":
                        return "Windows 7";
                    case "6.2":
                        return "Windows 8";
                    case "6.3":
                        return "Windows 8.1";
                    case "10.0":
                        return "Windows 10";
                    case "11.0":
                        return "Windows 11";
                }
            }

            if (!nexacro._OS) return;
            return (nexacro._OSVersion ? (nexacro._OS + " " + nexacro._OSVersion) : nexacro._OS);
        };

        nexacro._getTaskbarSize = function ()
        {
            return 0;
        };

        //system.computername
        nexacro._getComputerName = function ()
        {
            return "";
        };

        nexacro._getCPUArchitecture = function ()
        {
            return "UNKNOWN";
        };

        nexacro._getCPUCount = function ()
        {
            return 1;
        };

        nexacro._getCPUType = function ()
        {
            return "UNKNOWN PROCESSOR";
        };

        nexacro._getLocale = function ()
        {
            return nexacro._BrowserLang;
        };
        nexacro._getLanguage = function ()
        {
            var arr = nexacro._BrowserLang.split('-');    // ko-KR
            return arr ? arr[0] : 'en';
        };

        nexacro._getLoginUser = function ()
        {
            return "";
        };

        nexacro._getMobileOrientation = function ()
        {
            var orientation;
            if (!nexacro._isTouchInteraction)
            {
                orientation = 4;//"resize";
            }
            else
            {
                //mobile 처리 필요
                var o = window ? window.orientation : 0;
                if (o == 90)
                {
                    orientation = 3;//"LandscapeLeft";
                }
                else if (o == -90)
                {
                    orientation = 2;//"LandscapeRight";
                }
                else if (o == 180)
                {
                    orientation = 1;//"ReversePortrait";
                }
                else
                {
                    orientation = 0;
                }
            }

            return orientation;
        };

        nexacro._getMobilePhoneNumber = function ()
        {
            return "";
        };

        nexacro._getMobileProductType = function ()
        {
            return nexacro._DEVICE;
        };

        nexacro._getMobileUniqueID = function ()
        {
            return "";
        };

        nexacro._getMonitorCount = function ()
        {
            return 1;
        };

        nexacro._getNavigatorName = function ()
        {
            return nexacro._Browser;
        };

        nexacro._getNavigatorFullName = nexacro._emptyFn;

        //추후 삭제
        /*
        nexacro._getCurrentScreenID = function ()
        {
            if (application._curscreen)
                return application._curscreen.name;

            // TODO 일단 현재는 HTML버젼 Screen Simulation은 지원하지 않음
            return application._simulator_screenid;
        };
        */
        if (nexacro._isDesktop())
        {
            nexacro._getCursorX = function (e)
            {
                if (window.event)
                {
                    var len;
                    if (window.event.changedTouches)
                    {
                        len = window.event.changedTouches.length;
                        return window.event.changedTouches[len - 1].screenX;
                    }
                    else if (window.event.touches)
                    {
                        len = window.event.touches.length;
                        return window.event.touches[len - 1].screenX;
                    }
                    else
                    {
                        var win = nexacro._findWindow(window);
                        return window.event.screenX ? window.event.screenX : win._cur_screen_pos.x;
                    }
                }
                else //firefox 일경우
                    return e ? e.screenX : undefined;
            };

            nexacro._getCursorY = function (e)
            {
                if (window.event)
                {
                    var len;
                    if (window.event.changedTouches)
                    {
                        len = window.event.changedTouches.length;
                        return window.event.changedTouches[len - 1].screenY;
                    }
                    else if (window.event.touches)
                    {
                        len = window.event.touches.length;
                        return window.event.touches[len - 1].screenY;
                    }
                    else
                    {
                        var win = nexacro._findWindow(window);
                        return window.event.screenY ? window.event.screenY : win._cur_screen_pos.y;
                    }

                }
                else //firefox 일경우
                    return e ? e.screenY : undefined;
            };
        }
        else
        {
            nexacro._getCursorX = function (e)
            {
                var evt = window.event ? window.event : window._event;
                if (evt)
                {
                    var len;
                    if (evt.changedTouches)
                    {
                        len = evt.changedTouches.length;
                        return evt.changedTouches[len - 1].pageX;
                    }
                    else if (evt.touches)
                    {
                        len = evt.touches.length;
                        return evt.touches[len - 1].pageX;
                    }
                    else
                    {
                        var win = nexacro._findWindow(window);
                        var is_keyboardEvent = evt instanceof window.KeyboardEvent;
                        return is_keyboardEvent ? win._cur_screen_pos.x : evt.pageX;
                    }
                }
                else
                {
                    return e ? e.pageX : undefined;
                }
            };

            nexacro._getCursorY = function (e)
            {
                var evt = window.event ? window.event : window._event;
                if (evt)
                {
                    var len;
                    if (evt.changedTouches)
                    {
                        len = evt.changedTouches.length;
                        return evt.changedTouches[len - 1].pageY;
                    }
                    else if (evt.touches)
                    {
                        len = evt.touches.length;
                        return evt.touches[len - 1].pageY;
                    }
                    else
                    {
                        var win = nexacro._findWindow(window);
                        var is_keyboardEvent = evt instanceof window.KeyboardEvent;
                        return is_keyboardEvent ? win._cur_screen_pos.y : evt.pageY;
                    }
                }
                else
                {
                    return e ? e.pageY : undefined;
                }
            };
        }

        nexacro._checkDevicePermission = nexacro._emptyFn;
        nexacro._requestDevicePermission = nexacro._emptyFn;

        nexacro._getCompOffsetSize = function (comp)
        {
            var elem = comp._control_element;
            var offs = {};
            if (!comp || !comp._control_element)
            {
                offs.width = 0;
                offs.height = 0;
            }
            else
            {
                //var p = nexacro._getElementPositionInFrame(elem);
                var w = comp._getWindow();
                offs.width = w.getWidth() - (parseInt(elem.left) | 0);
                offs.height = w.getHeight() - ((parseInt(elem.top) | 0) + (parseInt(elem.height) | 0));
            }
            return offs;
        };

        nexacro.__setEnableAccessibility = nexacro._emptyFn;
        nexacro.__setAccessibilityType = nexacro._emptyFn;
        nexacro.__createLabelElementHandle = nexacro._emptyFn;

        nexacro._observeGlobalEvent = nexacro._emptyFn;
        nexacro._stopGlobalEvent = nexacro._emptyFn;
        nexacro._setBrowserErrorMsg = nexacro._emptyFn;
        nexacro._initApplication = nexacro._emptyFn;
        nexacro._refreshWindowRegion = nexacro._emptyFn;

        nexacro.__setDOMNode_Alt = function (node, text)
        {
            if (!text)
                text = "";

            if (!node.alt || node.alt != text)
                return node.alt = text;
        };

        nexacro._appliedTitleBarHeight = function (frame, h)
        {
            if (globalThis.chrome && globalThis.chrome.webview || nexacro._macOSWebView) return h;

            return (frame && frame._is_window) ? 0 : h;
        };

        nexacro._appliedStatusBarHeight = function (frame, h)
        {
            if (nexacro._isHybrid && nexacro._isHybrid())
                return h;

            return (frame && frame._is_window) ? 0 : h;
        };

        nexacro._isShowTitleBar = function (frame, show)
        {
            if (globalThis.chrome && globalThis.chrome.webview || nexacro._macOSWebView) return show;

            return (frame && frame._is_window) ? false : show;
        };

        nexacro._isShowStatusBar = function (frame, show)
        {
            if (nexacro._isHybrid && nexacro._isHybrid())
                return show;

            return (frame && frame._is_window) ? false : show;
        };

        nexacro._isPluginMode = function ()
        {
            return false;
        };

        nexacro._isMobile = function ()
        {
            var uA = navigator.userAgent.toLowerCase();
            // android mobile 이면 안드로이드 폰.
            if (uA.indexOf("mobile") >= 0 || uA.indexOf("android") >= 0)
                return true;
            return false;
        };

        nexacro._isHybrid = function ()
        {
            return (globalThis.chrome && globalThis.chrome.webview);
        };

        nexacro._getUserAgent = function ()
        {
            return navigator.userAgent;
        };

        nexacro._refreshCaret = function ()
        {
            //var refresh_node = document.createElement("div");
            //refresh_node.id = "iOS_refesh_node";
            //document.body.appendChild(refresh_node);
            //nexacro._OnceCallbackTimer.callonce("", function ()
            //{
            //    document.body.removeChild(refresh_node);
            //    refresh_node = null;
            //});
        };

        nexacro._deleteRefreshNode = function ()
        {
            var refresh_node = document.getElementById("iOS_refresh_node");
            if (refresh_node)
            {
                document.body.removeChild(refresh_node);
                //refresh_node = null;
            }
        };

        nexacro._applyZoomEdge = function (control_elem, v)
        {
            var edge = control_elem._bkimage_elem;

            if (edge)
            {
                var x = edge._edgex, y = edge._edgey;
                var edgewidth = 0, edgeheight = 0;

                x = Math.ceil(x * v / 100);
                y = Math.ceil(y * v / 100);
                if (edge.parent)
                {
                    edgewidth = edge.parent._node_width;
                    edgeheight = edge.parent._node_height;
                }
                nexacro.__setDOMStyle_EdgeBorder(edge.handle.style, edge._img_url, edge._edgex, edge._edgey, x, y);
                nexacro.__setDOMStyle_Size(edge.handle.style, edgewidth - x * 2, edgeheight - y * 2);
            }
        };

        // dataprotocol
        nexacro._isRuntimeProtocol = function ()
        {
            return false;
        };

        nexacro._isLocalStorageSupport = function ()
        {
            if (nexacro._isSupportLocalStorage === undefined)
            {
                try
                {
                    var localstorage = window.localStorage;
                    var k = 'testkey';
                    var v = "testvalue";

                    localstorage.setItem(k, v);
                    localstorage.removeItem(k);

                    return nexacro._isSupportLocalStorage = true;
                }
                catch (e)
                {
                    return nexacro._isSupportLocalStorage = false;
                }
            }
            else
            {
                return nexacro._isSupportLocalStorage;
            }
        };

        nexacro._removeImageViewUrl = function (url)
        {
            return url;
        };

        nexacro._getWheelZoom = function (targetFrame)
        {
            return nexacro._getDevicePixelRatio(targetFrame) * 100;
        };

        nexacro._setProtocolVar = nexacro._emptyFn;
        nexacro._releaseImageUrl = nexacro._emptyFn;
        nexacro._releaseImageViewUrl = nexacro._emptyFn;
        nexacro._resizeImageViewManager = nexacro._emptyFn;
        nexacro._recordHeapSnapshot = nexacro._emptyFn;
        nexacro._setRenderingType = nexacro._emptyFn;
        nexacro._gc = nexacro._emptyFn;
        nexacro._getEnableWheelZoom = nexacro._emptyFn;
        nexacro._setEnableWheelZoom = nexacro._emptyFn;
        nexacro._setWheelZoom = nexacro._emptyFn;
        nexacro._userNotify = nexacro._emptyFn;
        nexacro.__loadLibraryExtensionAPI = nexacro._emptyFn;
        nexacro.__getLastErrorMessageExtensionAPI = nexacro._emptyFn;
        nexacro.__setLocalEventExtensionAPI = nexacro._emptyFn;
        nexacro.__isDeactivate = nexacro._emptyFn;
        nexacro.__setDeactivate = nexacro._emptyFn;

        // SSV separator
        nexacro._setSSVUnitTokenSeparator = nexacro._emptyFn;
        nexacro._setSSVRecordTokenSeparator = nexacro._emptyFn;

        nexacro._createdContents = function (form)
        {
            var _window = form._getWindow();
            var control_elem = form._control_element;
            var step_count = control_elem._step_count;
            var step_index = control_elem._step_index, i, len, comps;
            var containers = [];
            var panels = [];
            var container, dest_handle;

            if (step_count)
            {
                var arr_step_str = [];

                for (i = 0; i < step_count; i++)
                {
                    arr_step_str[i] = "";
                }
                comps = form._p_components;
                len = comps.length;
                for (i = 0; i < len; i++)
                {
                    var comp = comps[i];
                    if (comp._is_panel)
                    {
                        panels.push(comp);
                    }
                    if (comp._is_group)
                        continue;
                    var position_step = comp.getElement().position_step;
                    if (position_step < 0)
                        arr_step_str[step_index] += comp.createCommand();
                    else if (step_count > position_step)
                        arr_step_str[position_step] += comp.createCommand();
                }

                for (i = 0; i < step_count; i++)
                {
                    container = control_elem.getContainerElement(i);
                    dest_handle = container.dest_handle;
                    dest_handle.innerHTML = arr_step_str[i];
                }

                for (i = 0; i < len; i++)
                {
                    if (comps[i]._is_panel)
                        continue;
                    comps[i].attachHandle(_window);
                }

                for (i = 0, len = panels.length; i < len; i++)
                {
                    panels[i].attachHandle(_window);
                    panels[i]._recalcitemPosition();
                }
            }
            else
            {
                container = control_elem.getContainerElement();
                dest_handle = container.dest_handle;

                comps = form._p_components;

                len = comps.length;
                //var panel_len;
                var str = "";
                for (i = 0; i < len; i++)
                {
                    if (comps[i]._is_panel)
                    {
                        panels.push(comps[i]);
                        // continue;
                    }
                    if (!comps[i]._is_group)// || !comps[i]._is_panel)
                        str += comps[i].createCommand();
                }

                dest_handle.innerHTML = str;

                for (i = 0; i < len; i++)
                {
                    var bContainer = false;
                    if (comps[i]._hasContainer())
                    {
                        bContainer = true;
                        containers.push(comps[i]);
                    }/*
                    if (comps[i]._is_panel)
                    {                       
                        panels.push(comps[i]);
                    }  
                    */
                    comps[i].attachHandle(_window, bContainer);
                }

                for (i = 0, len = containers.length; i < len; i++)
                {
                    containers[i].on_attach_contents_handle(_window);
                    containers[i]._is_created = true;
                }

                for (i = 0, len = panels.length; i < len; i++)
                {
                    panels[i]._recalcitemPosition();
                }
                panels = null;
                //comps = null;
                //containers = null;
            }
        };

        nexacro._setProjectURL = function (url)
        {
            var projecturl = nexacro._getProjectBaseURL(url);

            if (nexacro._iOSprojecturl)
            {
                projecturl = nexacro._iOSprojecturl;
            }
            else if (nexacro._AndroidProjecturl)
            {
                projecturl = nexacro._AndroidProjecturl;
            }
            else if (nexacro._macOSprojecturl)
            {
                projecturl = nexacro._macOSprojecturl;
            }

            if (nexacro._OS == "iOS" && nexacro._isHybrid && nexacro._isHybrid())            
            {
                if (projecturl.indexOf('file:///') === 0)
                {
                    projecturl = projecturl.replace('file:///', '');
                }
            }

            nexacro._project_absolutepath = projecturl;
            return projecturl;
        };

        // env 초기화
        //screen 결정 후 screen별 env 설정
        nexacro._initEnvironment = function (screeninfo)
        {
            if (screeninfo)
            {
                nexacro._initScreen(screeninfo);
            }
        };

        /*----------------------------------------------
        * NexacroK
       ------------------------------------------------- */
        nexacro._initEnvironment_new = function (callback, screeninfo)
        {
            const env = nexacro.getEnvironment();
            nexacro._loadADL = nexacro._loadADL_new;  // 임시로 함수 change.. 

            if (!screeninfo)
            {
                if (env)
                    screeninfo = env.on_getAllScreenInfo();
            }

            if (screeninfo)
            {
                nexacro._initScreen(screeninfo);
            }

            if (env)
            {
                env._externalcallback = callback;
                env._load_new();

            }
        };

        /*----------------------------------------------
        * End NexacroK
       ------------------------------------------------- */

        if (navigator && navigator.userAgentData)
        {
            nexacro._initAccurateAgent(nexacro._setHighEntropyAgentInfo);
        };

        nexacro._initScreen = function (screeninfo)
        {
            var selectscreen;
            if (screeninfo)
            {
                selectscreen = nexacro._getScreen(screeninfo);
                if (selectscreen)
                {
                    nexacro._applySelectedScreen(selectscreen);
                    nexacro._setCurrentScreen(selectscreen);
                    nexacro._screenInfoToInternal();
                    //nexacro._setLocalStorage("screeninfo", JSON.stringify(selectscreen), 2);  //추후 삭제
                }
                else
                {
                    alert("Cannot find the screen for the current environment.");
                }
            }
            else
            {
                //open : main 창에 설정된 screen값을 가져와서 처리
                //
                //추후 삭제

                var savedscreeninfo //= nexacro._getLocalStorage("screeninfo", 2);
                if (savedscreeninfo)
                {
                    selectscreen = JSON.parse(savedscreeninfo);
                    if (selectscreen)
                    {
                        console.log("not exist screen");
                        nexacro._applySelectedScreen(selectscreen);
                        nexacro._setCurrentScreen(selectscreen);
                        nexacro._screenInfoToInternal();
                        return;
                    }
                }
                else 
                {
                    //popup new verison environment의 정보를 
                    console.log("exist screen");
                    nexacro._screenInfoToInternal();
                }
            }
        };

        //environment 의 screen 정보를 nexacro 변수로 설정
        nexacro._screenInfoToInternal = function ()
        {
            const env = nexacro.getEnvironment();
            nexacro._allow_default_pinchzoom = env._allow_default_pinchzoom;

        };

        nexacro._getWindowEvent = function ()
        {
            if (window)
                return window.event;
            return undefined;
        };

        if (nexacro._Browser == "MobileSafari")// || nexacro._BrowserExtra == "SamsungBrowser")
        {
            nexacro._getCurrentZoomfactor = function ()
            {
                var _win_handle = nexacro._getMainWindowHandle();
                return _win_handle.document.body.clientWidth / _win_handle.innerWidth;
            };
        }
        else
        {
            nexacro._getCurrentZoomfactor = function ()
            {
                var zoomfactor = 1;
                var vp = nexacro._getViewportInfo();
                if (vp)
                {
                    zoomfactor = vp.scale;
                }
                else
                {
                    var _win_handle = nexacro._getMainWindowHandle();
                    zoomfactor = _win_handle.document.body.clientWidth / _win_handle.innerWidth;
                }
                return zoomfactor;
            };
        }

        nexacro._getViewportInfo = function ()
        {
            return window.visualViewport;
        };

        nexacro._getPositionFromTouch = function (touch)
        {
            return { x: touch.windowx, y: touch.windowy };
        };

        if (nexacro._Browser == "MobileSafari")
        {
            nexacro._getWindowSize = function (win)
            {
                return { width: win.handle.innerWidth, height: win.handle.innerHeight };
            };
            nexacro._getAddressBarHeight = function (win)
            {
                var add_addressbar_height = 0;
                var body_scroll = nexacro._getWindowDestinationHandle(win.handle ? win.handle : win).scrollTop;
                if (body_scroll > 0)
                    add_addressbar_height += body_scroll * 2;
                return add_addressbar_height;
            };
            nexacro._getWindowOffsetPosition = function (win)
            {
                return { left: win.handle.pageXOffset, top: win.handle.pageYOffset };
            };
        }
        else
        {
            nexacro._getWindowSize = function (win)
            {
                var vp = this._getViewportInfo();
                if (vp)
                {
                    return { width: vp.width, height: vp.height };
                }
                else
                {
                    return { width: win.handle.innerWidth, height: win.handle.innerHeight };
                }
            };
            nexacro._getAddressBarHeight = function ()
            {
                return 0;
            };
            nexacro._getWindowOffsetPosition = function (win)
            {
                var vp = this._getViewportInfo();
                if (vp)
                {
                    return { left: vp.offsetLeft, top: vp.offsetTop };
                }
                else
                {
                    return { left: win.handle.pageXOffset, top: win.handle.pageYOffset };
                }
            };
        }

        nexacro.__getOverflowScrollSize = function ()
        {
            var textareanode = document.createElement("textarea");
            var framedoc = nexacro._managerFrameDoc;
            var scrollwidth = 17;
            if (framedoc)
            {
                var framedocbody = framedoc.body;
                textareanode.style.width = "100px";
                textareanode.style.height = "100px";
                framedocbody.appendChild(textareanode);
                scrollwidth = textareanode.clientWidth;
                textareanode.style.overflow = "hidden";
                scrollwidth = textareanode.clientWidth - scrollwidth;
                framedocbody.removeChild(textareanode);
            }
            return scrollwidth;
        };

        if (nexacro._OS == "iOS")
        {
            nexacro._getLbuttonupDelayTime = function (elem)
            {
                var delaytime = 0;
                if (elem instanceof nexacro.InputElement && elem.inputtype != "date")
                {
                    if (nexacro._BrowserVersion < 12)
                    {
                        delaytime = 400;
                    }
                    else
                        delaytime = 0;
                }
                return delaytime;
            };
        }
        else if (nexacro._BrowserExtra == "SamsungBrowser")
        {
            nexacro._getLbuttonupDelayTime = function (elem)
            {
                var delaytime = 0;
                if (elem instanceof nexacro.InputElement)
                {
                    delaytime = 400;
                }
                return delaytime;
            };
        }
        else
        {
            nexacro._getLbuttonupDelayTime = function (elem)
            {
                var delaytime = 0;
                if (elem instanceof nexacro.InputElement)
                    delaytime = 300;
                return delaytime;
            };
        }

        if (nexacro._OS == "iOS")
        {
            nexacro._setKeydownInfo = function (evt)
            {
                this._keydown_info = evt;
            };

            nexacro._getKeydownInfo = function ()
            {
                var keydown_info = this._keydown_info;
                this._keydown_info = undefined;
                return keydown_info;
            };
        }
        else
        {
            nexacro._setKeydownInfo = nexacro._emptyFn;
            nexacro._getKeydownInfo = nexacro._emptyFn;
        }


        nexacro._isSameComponent = function (elem1, elem2)
        {
            var control_elem1 = elem1;
            while (control_elem1 && !control_elem1.linkedcontrol)
            {
                control_elem1 = control_elem1.parent;
            }
            var linkedcontrol1 = control_elem1.linkedcontrol;
            while (linkedcontrol1 && linkedcontrol1._is_subcontrol)
            {
                linkedcontrol1 = linkedcontrol1.parent;
            }
            var control_elem2 = elem2;
            while (control_elem2 && !control_elem2.linkedcontrol)
            {
                control_elem2 = control_elem2.parent;
            }
            var linkedcontrol2 = control_elem2.linkedcontrol;
            while (linkedcontrol2 && linkedcontrol2._is_subcontrol)
            {
                linkedcontrol2 = linkedcontrol2.parent;
            }
            if (linkedcontrol1 == linkedcontrol2)
                return true;

            return false;
        };

        if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
        {
            nexacro.__insertInputtypeDateCSSStyle = function ()
            {
                if (nexacro.ismodule) // 임시조치 : 이 설정은 전역 설정이기 떄문에 MFE를 감안하면  nexacommon css로 set 되어야 함
                    return;
                var styleTag = document.createElement("style");
                var head = document.getElementsByTagName("head")[0];
                head.appendChild(styleTag);
                var sheet = styleTag.sheet ? styleTag.sheet : styleTag.styleSheet;
                if (sheet.insertRule)
                {
                    sheet.insertRule("input[type = 'date']{ appearance: none; -webkit-appearance: none;}", 0);
                }
                else
                {
                    sheet.addRule("input[type = 'date']", "-webkit-appearance: none;", 0);
                }
            };
        }
        else
        {
            nexacro.__insertInputtypeDateCSSStyle = nexacro._emptyFn;
        }

        if (nexacro._Browser == "MobileSafari" && nexacro._BrowserVersion < 11)
        {
            nexacro._adjustBodyScrollPos = function (doc)
            {
                if (doc.body.scrollTo) //RP79853-3
                    doc.body.scrollTo(0, 0);
            };
        }
        else
        {
            nexacro._adjustBodyScrollPos = nexacro._emptyFn;
        }

        if (nexacro._isMobile())
        {
            if (nexacro._isHybrid)
            {
                nexacro._isSystemDateMode = function ()
                {
                    return false;
                };
            }
            else
            {
                nexacro._isSystemDateMode = function ()
                {
                    return true;
                };
            }
        }
        else
        {
            nexacro._isSystemDateMode = function ()
            {
                return false;
            };
        }

        nexacro._needAdjustScrollPosition = function (is_set_value)
        {
            if (!is_set_value)
                return false;
            return true;
        };

        if (nexacro._Browser == "Chrome" || nexacro._Browser == "Opera" || nexacro._Browser == "Edge")
        {
            nexacro._getTextAreaElementVscrollPos = function (input_elem)
            {
                return input_elem.getElementVScrollPos();
            };

            nexacro._getTextAreaElementHscrollPos = function (input_elem)
            {
                return input_elem.getElementHScrollPos();
            };
        }
        else
        {
            nexacro._getTextAreaElementVscrollPos = function (input_elem)
            {
                return input_elem.getElementScrollHeight();
            };

            nexacro._getTextAreaElementHscrollPos = function (input_elem)
            {
                return input_elem.getElementScrollWidth();
            };
        }

        nexacro._get_invisible_obj = function (obj)
        {
            var pThis = obj;
            var arr = [];

            while (pThis && !pThis._is_frame)
            {
                if (!pThis.visible)
                    arr.push(pThis);

                pThis = pThis.parent;
            }

            return arr;
        };

        nexacro._reset_invisible_obj = function (arr, bVisible)
        {
            var obj = null;
            if (arr.length > 0)
            {
                for (var i = 0; i < arr.length; i++)
                {
                    obj = arr[i];
                    if (obj)
                    {
                        obj._applyElementVisible(bVisible);
                    }
                }
            }
        };

        nexacro._findComponentForId = function (id)
        {
            var comp = null;
            var obj = document ? document.getElementById(id) : null;
            if (obj)
            {
                comp = obj._linked_element ? obj._linked_element.linkedcontrol : null;
            }
            return comp;
        };

        nexacro._getContentType = function (doc)
        {
            if (doc)
            {
                if (doc.contentType) // support ch, ff
                {
                    // trace(doc.contentType);
                    var types = doc.contentType.split("/");
                    var type = types[1] ? types[1].toUpperCase() : "";
                    if (type == "XML")
                        return "XML";
                    else if (doc.xml || doc.xmlVersion)     // xml document
                        return "XML";
                    else
                        return type;
                }
                else // support ie, ch, sf
                {
                    if (doc.xml || doc.xmlVersion)
                    {
                        return "XML";
                    }
                    else
                    {
                        return "HTML";
                    }
                }
            }

            return "";
        };

        nexacro.__preventDefault = function (evt)
        {
            if (evt)
                evt.preventDefault();
        };

        nexacro._postMessageTargetList = null;
        nexacro._setPostMessage = function (iframe_id, target)
        {
            if (!target)
                return;

            var manager = nexacro._IframeManager;
            if (manager)
            {
                var win = target._getWindow();
                var frame_win = manager.get_window(iframe_id);

                if (win && frame_win && frame_win.postMessage)
                {
                    var data = { id: iframe_id, userdata: "", target: target, func: target.on_after_load };
                    win._postmsg_data_que.push(data);

                    nexacro._postMessage(iframe_id + "--boundary--", frame_win, null, '*');
                }
            }
        };

        if (nexacro._OS == "Windows")
        {
            nexacro._isWindowTablet = function ()
            {
                if (navigator && navigator.maxTouchPoints > 0)
                {
                    return true;
                }
                return false;
            };
        }
        else
        {
            nexacro._isWindowTablet = function ()
            {
                return false;
            };
        }

        if (nexacro._OS == "Android")
        {
            nexacro._isWebView = function ()
            {
                var ua = navigator.userAgent;
                if (ua)
                {
                    var cv = ua.split("Chrome/")[1];
                    if (cv)
                    {
                        var ver = cv.trim().split(/[^\w\.]/)[0];
                        if (ver)
                        {
                            return parseFloat(ver) >= 42 ? /; wv/.test(ua) : /\d{2}\.0\.0/.test(ver) ? true : false;
                        }
                    }
                }
                return false;
            };
        }
        else
        {
            nexacro._isWebView = function ()
            {
                return undefined;
            };
        }

        nexacro._hasWebBrowser = function (form)
        {
            form = form.form ? form.form : form;
            var check_comp = form._getTabOrderFirst();
            var ret = false;
            while (check_comp)
            {
                if (nexacro._isWebTypeComponent(check_comp))
                {
                    return true;
                }
                else if (check_comp.form)
                {
                    ret = nexacro._hasWebBrowser(check_comp.form);//, check_comp._refform, defaultprint, valign, halign);
                    if (ret)
                        return true;
                    else
                    {
                        check_comp = form._getTabOrderNext(check_comp, true);
                    }
                }
                else
                {
                    check_comp = form._getTabOrderNext(check_comp, true);
                }
            }
            return false;
        };

        nexacro._getBrowserEventName = function (evt_name)
        {
            return evt_name;
        };

        if (nexacro._OS == "iOS" && !nexacro._isHybrid() && (nexacro._BrowserVersion > 12 || (navigator.platform == "MacIntel" && navigator.maxTouchPoints > 0)))
        {
            nexacro._setHTMLPositionStyle = function (style_value)
            {
                document.documentElement.style.position = style_value;
            };

            nexacro._getHTMLPositionStyle = function ()
            {
                return document.documentElement.style.position;
            };
        }
        else
        {
            nexacro._setHTMLPositionStyle = nexacro._emptyFn;
            nexacro._getHTMLPositionStyle = nexacro._emptyFn;
        }

        nexacro._isDesignMode = function ()
        {
            return false;
        };

        nexacro._random = function ()
        {
            return window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
        };

        nexacro._isSameDomain = function (host1, host2)
        {
            if (host1 != document.domain || host2 != document.domain)
                return false;
            return true;
        };

        nexacro._localeCompare = function (val1, val2, locale, localeoption)
        {
            var locale_list = nexacro._localecollator_list;
            if (!locale_list)
                locale_list = nexacro._localecollator_list = {};
            var _lc = locale ? locale : "system";
            var _lco = localeoption ? localeoption : "";
            var collator = locale_list[_lc + _lco];
            if (!collator)
                collator = locale_list[_lc + _lco] = new Intl.Collator(locale, localeoption ? JSON.parse(localeoption) : localeoption);
            return collator.compare(val1, val2);
        };

        nexacro._getResolvedOptions = function (locale, localeoption)
        {
            return new Intl.Collator(locale, localeoption).resolvedOptions();
        };

        nexacro._supportedLocalesOf = function (locale, localeoption)
        {
            return Intl.Collator.supportedLocalesOf(locale);
        };

        nexacro._getTextDecoder = function ()
        {
            var decoder = this._textDecoder;
            if (!decoder)
                decoder = this._textDecoder = new TextDecoder();
            return decoder;
        };

        nexacro._getTextEncoder = function ()
        {
            var encoder = this._textEncoder;
            if (!encoder)
                encoder = this._textEncoder = new TextEncoder();
            return encoder;
        };
    }

    if (globalThis.chrome && globalThis.chrome.webview)
    {
        nexacro._runCallback = function (sid, sfunc, params)    // sid: callbackId, sfunc: eventName(exapi="_onextcallback"), params: parameters
        {
            if (sfunc == "_on_syscommand")
            {
                var objApp = nexacro.getApplication();
                var objFrame = null;
                if (sid == "mainframe")
                    objFrame = objApp.mainframe;
                else
                    objFrame = objApp.getActiveFrame();

                if (objFrame && objFrame._on_syscommand)
                {
                    objFrame._on_syscommand(objFrame._control_element, params["command"], true, objFrame, null);
                }
            }
        };

        globalThis.chrome.webview.addEventListener('message', arg => 
        {
            if ('runfunc' in arg.data) 
            {
                var runfunc = arg.data.runfunc;
                if (runfunc == "runCallback");
                {
                    nexacro.Device.runCallback(arg.data.sid, arg.data.sfunc, arg.data.params);
                }
            }
        });
    }

}

if (_process)
{
    _process = null;

    //_pGarbageCollector = null;
    //_pCanvasGradient = null;
    _pTextInfoCacheManager = null;
    _pProgressData = null;
    _pProgressDataCSV = null;
    _pProgressDataSSV = null;
    _pProgressDataPPX = null;
    _pProgressDataXML = null;
    //_pHTMLSysTimerManager = null;
}