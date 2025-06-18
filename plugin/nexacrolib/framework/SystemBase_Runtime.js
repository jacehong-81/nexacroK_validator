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
if (nexacro._Browser == "Runtime")
{
    if (!this.nexacro_init)
    {
        this.nexacro_init = {};
    }
    if (!nexacro._Init_systembase_runtime)
    {
        nexacro._Init_systembase_runtime = true;

        //==============================================================================
        // trace Function
        //==============================================================================
        // API function inited by C++ Context
        nexacro._trace = function ()
        {
            var msgs = [];
            var cnt = arguments.length;
            for (var i = 0; i < cnt; i++)
            {
                if (arguments[i] === undefined)
                    msgs.push("undefined");
                else if (arguments[i] === null)
                    msgs.push("null");
                else
                    msgs.push(arguments[i]);
            }
            var msg = msgs.join(' ');

            const environment = nexacro.getEnvironment();
            if (environment)
            {
                nexacro._writeTraceLog(4, msg, false, environment._loglevel, environment._p_traceduration, environment._p_tracemode);
            }
            else
                nexacro._writeTraceLog(4, msg, false);

            if (nexacro.System.navigatorname != "nexacro" && nexacro._Browser == "Runtime")
            {
                // Plugin Mode
                var application = nexacro.getApplication();
                if (application)
                    application.on_fire_onaddlog(application, msg);
            }
        };
        trace = nexacro._trace;

        nexacro._nexacroconsole = function () { };

        // 2015.04.23 neoarc; V8 엔진 CallStack 보기
        nexacro._traceV8CallStack = function (b_designmode)
        {
            try
            {
                var e = new Error();
                var stack = e.stack;
                var str = "", i;

                // i=0은 현재 이 function
                for (i = 1; i < stack.length; i++)
                {
                    var frame = stack[i];
                    var func = frame.getFunction();
                    var argstr = "";
                    for (var j = 0; j < func.arguments.length; j++)
                    {
                        var tempstr = func.arguments[j] + ", ";
                        if (tempstr.length > 30)
                            argstr += "[LONG STR], ";
                        else
                            argstr += tempstr;
                    }

                    var _this = frame.getThis();
                    var _funcname = frame.getFunctionName();
                    str += "\n   " + _this + "." + _funcname + "(arg: " + argstr + ")";
                }

                var mode = 0;
                //var mode = 1;

                var callstackstr = "";
                switch (mode)
                {
                    case 0:
                        callstackstr += ("\n===[callstack(" + (stack.length - 1) + ")]==============================\n" + str + "\n\n============================================");
                        break;
                    case 1:
                        {
                            callstackstr += ("\n===[callstack(" + (stack.length - 1) + ")]===============================\n");
                            var strlist = str.split("\n");
                            for (i = 0; i < strlist.length; i++)
                            {
                                callstackstr += (strlist[i] + "\n");
                            }
                            callstackstr += ("============================================");
                        }
                        break;
                }

                if (!b_designmode)
                    trace(callstackstr);
                else
                {
                    if (nexacro.__onNexacroStudioError)
                        nexacro.__onNexacroStudioError(callstackstr);
                }
            }
            catch (e)
            {
                nexacro._settracemsg(e);
            }
        };

        nexacro._peekWindowHandleMessageQueuePassing = function (_win, b_mouse, b_keyboard)
        {
            var _handle = _win ? _win.handle : null;
            if (!_handle) return;

            var args = [_handle];

            if (b_mouse || b_keyboard)
            {
                if (b_mouse) args.push("mouse");
                if (b_keyboard) args.push("keyboard");
            }
            else
                args.push("all");

            nexacro.__peekWindowHandleMessageQueuePassing.apply(nexacro, args);
        };

        nexacro._blockWindowHandleMessage = function (_win, b_blockchar, b_blockime)
        {
            var _handle = _win ? _win.handle : null;
            if (!_handle) return;

            var args = [_handle];
            args.push(b_blockchar);
            args.push(b_blockime);
            nexacro.__blockWindowHandleMessage.apply(nexacro, args);
        };

        //==============================================================================
        // Browser Type detection
        //==============================================================================
        nexacro._Browser_ColorAlpha = true;
        nexacro._Browser_RoundBorder = 1; // 0:none, 1:HTML5/Runtime, 2:Legacy
        nexacro._Browser_RoundShadow = true;
        nexacro._Browser_BorderImage = 1; // 0:none, 1:HTML5/Runtime, 2:Legacy
        nexacro._Browser_Gradient = 1; // 0:none, 1:HTML5/Runtime, 2:Legacy

        //==============================================================================
        // system function : runtime only
        nexacro._getOSVersion = function ()
        {
            return nexacro.__getOSVersion();
        };

        nexacro._getPackageVersion = function ()
        {
            return nexacro.__getPackageVersion();
        };

        nexacro._getSystemType = function ()
        {
            return nexacro.__getSystemType();
        };

        //system.os
        nexacro._getOS = function ()
        {
            return nexacro.__getOSType();
        };

        nexacro._getSystemLanguage = function ()
        {
            return nexacro.__getSystemLanguage();
        };

        nexacro._isPhone = function ()
        {
            return nexacro.__isPhone();
        };

        nexacro._setOrientation = function (orientation)
        {
            return nexacro.__setOrientation(orientation);
        };

        nexacro._OS = nexacro._getOS();
        nexacro._OSVersion = nexacro._getOSVersion();
        nexacro._DEVICE = "";
        nexacro._SystemType = nexacro._getSystemType();
        nexacro._BrowserLang = nexacro._getSystemLanguage();
        nexacro._SystemLang = nexacro._getSystemLanguage();
        nexacro._use_translate_scroll = 1;   //초기값으로 사용 

        //==============================================================================
        nexacro.KeyCode_ImeInput = 229;

        //==============================================================================
        // error Function

        // KISA 보안취약점(6-2) 지적사항
        /*
        nexacro._error = function (e, at)
        {
            var str = e.toString();
            if (at && at.length) 
            {
                str += "\nat : " + at;
            }
            if (e.fileName) 
            {
                str += "\nat : " + e.fileName + ": " + e.lineNumber;
            }
            if (self.__debuginfo) 
            {
                str += "\nat : " + self.__debuginfo;
            }
            nexacro._trace(str);
        };
        */

        //==============================================================================
        nexacro._nCountAlertConfirm = 0;

        nexacro._alert = function (curFrame, str, caption, type)
        {
            var handle;
            if (curFrame._window)
                handle = curFrame._window.handle;
            else
                handle = nexacro._getMainWindowHandle();

            str = nexacro._toString(str);
            nexacro._nCountAlertConfirm++;
            nexacro.__alert(handle, str, caption, type);
            nexacro._nCountAlertConfirm--;

            nexacro._cur_drag_info = null;
            nexacro._cur_repeat_info = null;
            nexacro._cur_track_info = null;
            nexacro._cur_extra_track_info = null;

            if (curFrame._window)
                curFrame._window._cancelEvent();
        };
        alert = function (text)
        {
            var application = nexacro.getApplication();
            if (application)
                application.alert(text, application.key, 0);
        };

        nexacro._confirm = function (curFrame, str, caption, type)
        {
            var handle;
            if (curFrame._window)
            {
                curFrame._window._cancelEvent();
                handle = curFrame._window.handle;
            }
            else
                handle = nexacro._getMainWindowHandle();

            nexacro._nCountAlertConfirm++;
            var ret = nexacro.__confirm(handle, str, caption, type);
            nexacro._nCountAlertConfirm--;
            return ret;
        };
        confirm = function (text)
        {
            var application = nexacro.getApplication();
            return application.confirm(text, application.key, 0);
        };


        //==============================================================================
        nexacro._setCookie = function (name, value, days, bsecure)
        {
            return nexacro.__setCookie(name, value, days, bsecure);
        };
        nexacro._getCookie = function (name)
        {
            return nexacro.__getCookie(name);
        };

        nexacro._removeCookie = function (name)
        {
            return nexacro.__removeCookie(name);
        };

        nexacro._setSharedVariablesToCookie = function (url, cookies)
        {
            return nexacro.__setSharedVariablesToCookie(url, cookies);
        };
        // sandbox
        nexacro._setFileSecureLevel = function (filesecurelevel)
        {
            return nexacro.__setFileSecureLevel(filesecurelevel);
        };
        nexacro._setNetworkSecureLevel = function (lvl)
        {
            return nexacro.__setNetworkSecureLevel(lvl);
        };
        nexacro._isTrustPath = function (window, path)
        {
            return nexacro.__isTrustPath(window.handle, path);
        };

        nexacro._setEnableInspector = function (enable)
        {
            return nexacro.__setEnableInspector(enable);
        };

        nexacro._setEnableScreenCapture = function (enable)
        {
            return nexacro.__setEnableScreenCapture(enable);
        };

        nexacro._setEnableCookie = function (enable)
        {
            return nexacro.__setEnableCookie(enable);
        };

        nexacro._setEnableCache = function (enable)
        {
            return nexacro.__setEnableCache(enable);
        };

        nexacro._setEnableClipboard = function (enable)
        {
            return nexacro.__setEnableClipboard(enable);
        };

        // css
        nexacro._setRootNodeClassName = nexacro._emptyFn;

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
                    if (frame.getEvalOrigin)
                    {
                        var url = frame.getEvalOrigin();
                        msg += "\r\nat line " + frame.getLineNumber() + ", in function: " + frame.getMethodName() + " in " + decodeURI(url);
                    }
                    else
                    {
                        msg += "\r\nat line " + frame.getLineNumber() + ", in function: " + frame.getMethodName();
                    }
                }
            }
            return msg;
        };
        nexacro._getEvalExceptionMessage = function (e, src_url)
        {
            var msg = e.toString() + '\r\nin eval script(' + decodeURI(src_url) + ')';
            return msg;
        };


        //--------------------------------------------------------------  
        // Util
        //--------------------------------------------------------------  
        nexacro._encodeXml = function (str)
        {
            if (!nexacro._isNull(str))  //passing an empty-string
                return nexacro.__encodeXml(str);
        };
        nexacro._decodeXml = function (str)
        {
            if (!nexacro._isNull(str))
            {
                if (str.indexOf("&") >= 0)
                    return nexacro.__decodeXml(str);
                return str;
            }
        };

        nexacro._getDisplayText = function (text/*, _type*/)
        {
            return text;
        };

        nexacro._getScreenPrintString = function (comp)
        {
            var image = nexacro._saveToImageBase64StringM2(comp, true);

            var html = '<HTML lang=\"' + nexacro._BrowserLang.substr(0, 2) + '\">\n<HEAD>\n';
            html += '<BODY style="margin: 0px; border: none; overflow: hidden; left: 0px; top: 0px; direction: inherit;\">\n';
            html += '<img alt="" src="' + image + '" />\n';
            html += '</BODY>\n</HTML>\n\n';

            return html;
        };

        nexacro._print = function (pThis, refform, defaultprint, valign, halign, fitonepage, strOrientation)
        {
            var ret = false;

            if (pThis._is_container)
            {
                if (pThis._is_popup_control)
                {
                    // PopupDiv
                    if (pThis.visible && pThis.form)
                    {
                        pThis = pThis.form;
                    }
                }
                else
                {
                    if (pThis.form)
                    {
                        pThis = pThis.form;
                    }
                }
            }

            var elem = pThis.getElement();
            if (elem && elem.handle)
            {
                if (pThis._is_scrollable && elem._client_elem && elem._client_elem.handle)
                {
                    ret = nexacro.__print(elem._client_elem.handle, refform.getElement().handle, defaultprint, valign, halign, fitonepage, strOrientation);
                }
                else
                {
                    ret = nexacro.__print(elem.handle, refform.getElement().handle, defaultprint, valign, halign, fitonepage, strOrientation);
                }
            }
            return ret;
        };

        nexacro._exportPDF = function (pThis, strFileName/*, nPageWidth, nPageHeight, nDPI, options, strWatermarkText, strWatermarkImage, watermarkOptions*/)
        {
            var ret = false;

            if (pThis._is_container)
            {
                if (pThis._is_popup_control)
                {
                    // PopupDiv
                    if (pThis.visible && pThis.form)
                    {
                        pThis = pThis.form;
                    }
                }
                else
                {
                    if (pThis.form)
                    {
                        pThis = pThis.form;
                    }
                }
            }

            var elem = pThis.getElement();
            if (elem && elem.handle)
            {
                if (pThis._is_scrollable && elem._client_elem && elem._client_elem.handle)
                {
                    ret = nexacro.__exportPDF(elem._client_elem.handle, strFileName/*, nPageWidth, nPageHeight, nDPI, options, strWatermarkText, watermarkImageUrl, watermarkOptions*/);
                }
                else
                {
                    ret = nexacro.__exportPDF(elem.handle, strFileName/*, nPageWidth, nPageHeight, nDPI, options, strWatermarkText, watermarkImageUrl, watermarkOptions*/);
                }

                /*
                var watermarkImageUrl;
                if (strWatermarkImage)
                {
                    watermarkImageUrl = nexacro._getImageLocation(nexacro._getURIValue(strWatermarkImage));
                }

                if (pThis._is_scrollable && elem._client_elem && elem._client_elem.handle)
                {
                    ret = nexacro.__exportPDF(elem._client_elem.handle, strFileName, nPageWidth, nPageHeight, nDPI, options, strWatermarkText, watermarkImageUrl, watermarkOptions);
                }
                else
                {
                    ret = nexacro.__exportPDF(elem.handle, strFileName, nPageWidth, nPageHeight, nDPI, options, strWatermarkText, watermarkImageUrl, watermarkOptions);
                }
                */
            }
            return ret;
        };

        nexacro._printInnerContents = function (comp)
        {
            var doc = comp.getProperty("document");
            if (doc)
            {
                comp.callMethod("print");
                return true;
            }
        };

        nexacro._beforePrintCheckPlugin = nexacro._print;
        nexacro._hasWebBrowser = nexacro._emptyFn;

        nexacro._saveToImageFile = function (pThis, fileName, fileType, compressOption, bIsOverflowClip, base64Encode)
        {
            var elem = pThis.getElement();
            var setbase64encode = false;
            if (elem && elem.handle && fileName)
            {
                if (base64Encode) setbase64encode = true;
                if ((pThis._type_name == "Form") && elem._client_elem && elem._client_elem.handle && bIsOverflowClip)
                {
                    return nexacro.__saveToImageFile(elem._client_elem.handle, fileName, fileType, (compressOption == undefined) ? "" : compressOption, bIsOverflowClip, setbase64encode);
                }
                else
                {
                    return nexacro.__saveToImageFile(elem.handle, fileName, fileType, (compressOption == undefined) ? "" : compressOption, false, setbase64encode);
                }
            }
            return false;
        };

        nexacro._saveCanvasToImageFile = function (elem, fileName, fileType, compressOption, base64Encode)
        {

            var setbase64encode = false;
            if (elem && elem.handle)
            {
                if (base64Encode) setbase64encode = true;
                return nexacro.__saveCanvasToImageFile(elem.handle, fileName, fileType, (compressOption == undefined) ? "" : compressOption, setbase64encode);
            }
            return false;
        };

        nexacro._saveToImageBase64String2 = function (pThis, bIsOverflowClip)
        {
            var elem = pThis.getElement();
            if (elem && elem.handle)
            {
                if ((pThis._type_name == "Form") && elem._client_elem && elem._client_elem.handle && bIsOverflowClip)
                {
                    return nexacro.__saveToImageBase64String2(elem._client_elem.handle, bIsOverflowClip);
                }
                else
                {
                    return nexacro.__saveToImageBase64String2(elem.handle, false);
                }
            }
            return false;
        };
        nexacro._saveToImageBase64StringM2 = function (pThis, bIsOverflowClip, imgType, compressOption)
        {
            var elem = pThis.getElement();

            if (elem && elem.handle)
            {

                if ((pThis._type_name == "Form") && elem._client_elem && elem._client_elem.handle && bIsOverflowClip)
                {
                    return nexacro.__saveToImageBase64StringM2(elem._client_elem.handle, bIsOverflowClip, (imgType == undefined) ? "JPG" : imgType, (compressOption == undefined) ? "" : compressOption);
                }
                else
                {
                    return nexacro.__saveToImageBase64StringM2(elem.handle, false, (imgType == undefined) ? "JPG" : imgType, (compressOption == undefined) ? "" : compressOption);
                }
            }
            return false;
        };
        //==============================================================================
        nexacro._prepareManagerFrame = nexacro._emptyFn;
        nexacro._destroyManagerFrame = nexacro._emptyFn;
        nexacro._destroyManagerShadow = nexacro._emptyFn;
        nexacro._destroyPopupFrameInfo = function (win)
        {
            if (win)
            {
                if (win._popupframes)
                {
                    win._popupframes.clear();
                    win._popupframes = null;
                }
                win._parentwindowforopen = null;
            }
        };

        //------------------------------------------------------------------------------
        // test text size check
        nexacro._getTextSize = function (text, font, multiline, content_width, wordwrap, wordspacing, letterspacing, b_decoration, textalign, verticalalign, refer_font, b_rtl)
        {
            if (text && text.length > 0 && font && font._sysvalue)
            {
                if (typeof (wordwrap) == "string")
                    wordwrap = wordwrap.toLowerCase();

                if (wordwrap == true || wordwrap == "true")
                    wordwrap = "char";
                else if (wordwrap == false || wordwrap == "false")
                    wordwrap = "none";

                // convert to absolute unit FontObject
                font = nexacro._convertToAbsUnitFontObj(font, refer_font);

                if (multiline)
                {
                    if (content_width != null)
                    {
                        return nexacro.__getTextSize(text.replace(/\r/g, ""), font, wordwrap, content_width, wordspacing, letterspacing, b_decoration, b_rtl);
                    }
                    else
                    {
                        var lines = text.split(/\r\n|\n|\r/);
                        var lcnt = lines.length;
                        var text_width = 0;
                        var text_height = 0;

                        for (var i = 0; i < lcnt; i++)
                        {
                            // NRE에서 빈문자열 처리가 됨에 따라 \r\n은 추가 개행으로 계산되는 오류로 인해 하기 코드 삭제
                            // if (lines[i].length <= 0) lines[i] = "\r\n";

                            var line_size = nexacro.__getTextSize(lines[i], font, "none", content_width, wordspacing, letterspacing, b_decoration, b_rtl);
                            if (line_size[0] > text_width)
                                text_width = line_size[0];

                            text_height += line_size[1];//html에서는 높이*lcnt로 구하므로 약간의 차이 발생;

                        }
                        return [text_width, text_height];
                    }
                }
                else
                {
                    return nexacro.__getTextSize(text.replace(/\r\n|\n|\r/, ''), font, "none", content_width, wordspacing, letterspacing, b_decoration, b_rtl);
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

            if (wordwrap == true || wordwrap == "true")
                wordwrap = "char";
            else if (wordwrap == false || wordwrap == "false")
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
                    refobj = nexacro.getApplication().mainframe;
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

        nexacro._bind_imgloadhandler_onload_recall = nexacro._emptyFn;
        nexacro._imgloadhandler_onload = nexacro._emptyFn;
        nexacro._imgloadhandler_onerror = nexacro._emptyFn;

        // nexacro._getImageSize = function (src, callbackFn, pThis, base_url, org_src, basync)
        nexacro._getImageSize = function (src, callbackFn, pThis, base_url, org_src, basync, imagewidth, imageheight)
        {
            if (!src) return null;
            src = nexacro._getURIValue(src);

            var imgurl;
            var format = nexacro._transImageBase64StringFormat(src, false, true)
            if (format)
            {
                imgurl = format.alldata;
            }
            else
            {
                imgurl = nexacro._getImageLocation(src, base_url);
            }

            if (imgurl)
            {
                var retval;
                if (org_src)
                {
                    org_src = org_src.toString();
                    org_src = nexacro._getURIValue(org_src);
                }

                // TODO: nexacro._getServiceObject() 가 URI 프로토콜("theme://")을 처리하지 못함.
                var service;
                if ((org_src ? org_src : src).indexOf("theme://") >= 0)
                {
                    service = nexacro._getServiceObject("theme::");
                }
                else
                {
                    service = nexacro._getServiceObject(org_src ? org_src : src);
                }

                var servicecachelevel = "none";
                var serviceversion = service._p_version;
                if (service._p_cachelevel == "static" || service._p_cachelevel == "session" || service._p_prefixid == "theme" || service._p_prefixid == "imagerc")
                {
                    retval = nexacro._ImgInfoCacheList[imgurl];
                    if (retval) 
                    {
                        if (retval.height == 0 && imgurl.indexOf(".svg") > 0)
                        {
                            //Do nothing
                        }
                        else
                            return retval;
                    }
                }

                var loadItem = nexacro._CommunicationManager[imgurl];
                if (loadItem)
                {
                    loadItem.appendCallback(pThis, callbackFn);
                }
                else
                {
                    loadItem = new nexacro._CommunicationItem(imgurl, "image", false);
                    nexacro._CommunicationManager[imgurl] = loadItem;
                    loadItem.appendCallback(pThis, callbackFn);
                    if (service)
                    {
                        if (service.cachelevel == "session")
                            servicecachelevel = "dynamic";
                        else
                            servicecachelevel = service._p_cachelevel;
                    }
                    if (basync == false)
                    {
                        loadItem.handle = nexacro.__getImageSize(imgurl, nexacro.__bindLoadImageHandler(loadItem), servicecachelevel, serviceversion, basync);
                        retval = nexacro._ImgInfoCacheList[imgurl];
                        if (retval) return retval;
                    }
                    else
                    {
                        loadItem.handle = nexacro.__getImageSize(imgurl, nexacro.__bindLoadImageHandler(loadItem), servicecachelevel, serviceversion);
                    }
                }
                return null;
            }
        };

        nexacro._getImageViewSize = function (src, callbackFn, pThis, base_url, org_src, basync, viewWidth, viewHeight, stretch)
        {
            if (!src) return null;
            src = nexacro._getURIValue(src);

            var imgurl, imgviewurl;
            var format = nexacro._transImageBase64StringFormat(src, false, true)
            if (format)
            {
                imgurl = format.alldata;
            }
            else
            {
                imgurl = nexacro._getImageLocation(src, base_url);

                if (viewWidth != null && viewHeight != null && imgurl && stretch != "none")
                {
                    imgviewurl = imgurl + "?size=" + viewWidth + "x" + viewHeight + ":" + stretch;
                }
            }

            if (imgurl)
            {
                var retval;
                if (org_src)
                {
                    org_src = org_src.toString();
                    org_src = nexacro._getURIValue(org_src);
                }

                // TODO: nexacro._getServiceObject() 가 URI 프로토콜("theme://")을 처리하지 못함.
                var service;
                if ((org_src ? org_src : src).indexOf("theme://") >= 0)
                {
                    service = nexacro._getServiceObject("theme::");
                }
                else
                {
                    service = nexacro._getServiceObject(org_src ? org_src : src);
                }

                var servicecachelevel = "none";
                var serviceversion = service._p_version;
                if (service._p_cachelevel == "static" || service._p_cachelevel == "session" || service._p_prefixid == "theme")
                {
                    retval = nexacro._ImgInfoCacheList[imgviewurl ? imgviewurl : imgurl];
                    if (retval) return retval;
                }

                if (!stretch)
                {
                    return;
                }

                var halign = pThis._imagealign ? pThis._imagealign.halign : "center";
                var valign = pThis._imagealign ? pThis._imagealign.valign : "middle";

                var loadItem = nexacro._CommunicationManager[imgviewurl ? imgviewurl : imgurl];
                if (loadItem)
                {
                    loadItem.appendCallback(pThis, callbackFn);
                }
                else
                {
                    loadItem = new nexacro._CommunicationItem(imgviewurl ? imgviewurl : imgurl, "image", false);
                    nexacro._CommunicationManager[imgviewurl ? imgviewurl : imgurl] = loadItem;
                    loadItem.appendCallback(pThis, callbackFn);
                    if (service)
                    {
                        if (service._p_cachelevel == "session")
                            servicecachelevel = "dynamic";
                        else
                            servicecachelevel = service._p_cachelevel;
                    }
                    if (basync == false)
                    {
                        loadItem.handle = nexacro.__getImageViewSize(imgurl, nexacro.__bindLoadImageHandler(loadItem), servicecachelevel, serviceversion, basync, viewWidth, viewHeight, stretch);
                        retval = nexacro._ImgInfoCacheList[imgviewurl ? imgviewurl : imgurl];
                        if (retval) return retval;
                    }
                    else
                    {
                        loadItem.handle = nexacro.__getImageViewSize(imgurl, nexacro.__bindLoadImageHandler(loadItem), servicecachelevel, serviceversion, basync, viewWidth, viewHeight, stretch);
                    }
                }
                return null;
            }
        };

        nexacro._getImageObject = function (src, callbackFn, pThis, base_url, bASync)
        {
            if (src.substring(0, 4).toLowerCase() == "url(")
            {
                src = src.substring(5, src.length - 2);
            }

            if (!src)
                return null;

            var imgurl = src;
            var format = nexacro._transImageBase64StringFormat(src, false, true);
            if (!format)
            {
                imgurl = nexacro._getImageLocation(src, base_url);
            }


            if (imgurl)
            {
                var retval = nexacro._ImgInfoCacheList[imgurl];
                if (retval)
                {
                    if (bASync != false || retval.width == 0)
                    {
                        callbackFn.call(pThis, imgurl, retval.width, retval.height);
                        return retval;
                    }
                }

                var loadItem = nexacro._CommunicationManager[imgurl];
                if (loadItem)
                {
                    loadItem.appendCallback(pThis, callbackFn);
                }
                else
                {
                    loadItem = new nexacro._CommunicationItem(imgurl, "image", false);
                    nexacro._CommunicationManager[imgurl] = loadItem;
                    loadItem.appendCallback(pThis, callbackFn);
                    var application = nexacro.getApplication();
                    var service = nexacro._getServiceObject(application.xadl);
                    var servicecachelevel = "none";
                    var serviceversion = service._p_version;
                    if (service)
                    {
                        if (service._p_cachelevel == "session")
                            servicecachelevel = "dynamic";
                        else
                            servicecachelevel = service.cachelevel;
                    }
                    if (bASync == false)
                        loadItem.handle = nexacro.__getImageSize(imgurl, nexacro.__bindLoadImageHandler(loadItem), servicecachelevel, serviceversion, bASync);
                    else
                        loadItem.handle = nexacro.__getImageSize(imgurl, nexacro.__bindLoadImageHandler(loadItem), servicecachelevel, serviceversion);
                }

                return loadItem.handle;
            }

            return null;
        };

        nexacro._getSupportedImageUrl = function (url, baseurl)
        {
            var format = nexacro._transImageBase64StringFormat(url, false, true);
            if (format)
            {
                return url;
            }

            return nexacro._getImageLocation(nexacro._getURIValue(url), baseurl);
        };

        nexacro._removeImageViewUrl = function (url)
        {
            var viewindex = url.indexOf("?size=");
            if (viewindex > 0)
            {
                return url.substring(0, viewindex);
            }
            return url;
        };

        //==============================================================================
        // FileUpload / Download Utils
        //==============================================================================
        nexacro._getXMLDocument = function (id, data, url)
        {
            var xmldoc = nexacro._parseXMLDocument(data);
            if (xmldoc.URL == undefined)
                xmldoc.URL = url;
            return xmldoc;
        };
        nexacro._getDataFromDOM = nexacro._emptyFn;

        nexacro._findclick = function (comp_name, item_comp_name, item_comp, handle, filefilter, filefilterindex)
        {
            var retobj = nexacro.__findclickFileUploadHandle(comp_name, item_comp_name, handle, item_comp._multiselect, item_comp, filefilter, filefilterindex);
            if (retobj)
            {
                var item_value = retobj.itemvalue;
                var filelist = retobj.filelist;
                var newvalue = retobj.newvalue;
                if (item_value != null && item_comp)
                {
                    item_comp._file_changed(item_value, filelist, newvalue);
                }
            }
        };

        // for only android, 
        nexacro._file_changed = function (item_value, item_comp, newvalue)
        {
            var fullpathArray = [];
            var filenameArray = [];
            var filelistArray = [];
            var newvalueArray = [];

            fullpathArray = item_value.split(",");
            filenameArray = newvalue.split(",");

            for (var i = 0; i < filenameArray.length; i++)
            {
                var file = {};
                file.name = filenameArray[i];
                file.fullpath = fullpathArray[i];
                filelistArray[i] = file;
                newvalueArray[i] = filenameArray[i];
            }

            if (item_comp)
            {
                item_comp._file_changed(item_value, filelistArray, newvalueArray);
            }
        };

        nexacro._getFileSize = function (obj, objfullpath)
        {
            if (objfullpath)
            {
                return nexacro._getFileSizeVirtualFileHandle(obj, objfullpath);
            }
            return false;
        };

        nexacro._setMultipleFile = function (comp_name, item_comp_name, multi_select, item_comp)
        {
            if (item_comp)
            {
                item_comp._multiselect = multi_select;
            }
        };

        nexacro._get_hidden_frame = function (form_id, handle)
        {
            return handle;
        };

        nexacro._create_hidden_frame = function (name, callback_fn, pThis, type)
        {
            // API변경하기 이전동작의 호환성 유지를 위해 매개변수 맞춤처리 추가.
            if (typeof callback_fn != "function")
            {
                callback_fn = pThis;
                pThis = type;
                type = "fileupload";
            }

            if (pThis.parent)
            {
                var curFrame = pThis.parent._getOwnerFrame();
                if (curFrame._window)
                    pThis._winhandle = curFrame._window.handle;
                else
                    pThis._winhandle = nexacro._getMainWindowHandle();
            }

            var handle = null;
            if (type == "fileupload" || type == "import")
            {
                handle = nexacro.__createFileUploadHandle(name, callback_fn, pThis, pThis._winhandle);
            }
            else if (type == "filedownload" || type == "export")
            {
                handle = nexacro.__createFileDownloadHandle(callback_fn, pThis, pThis._winhandle);
            }
            else
            {
                // 기본은 uploadhandle로 동작
                handle = nexacro.__createFileUploadHandle(name, callback_fn, pThis, pThis._winhandle);
            }

            if (handle)
            {
                pThis._hidden_frame_handle = handle;
            }
        };

        nexacro._destroy_hidden_frame = function (form_id, pThis, type)
        {
            var handle = pThis._hidden_frame_handle;
            if (handle)
            {
                if (type == "fileupload" || type == "import")
                {
                    nexacro.__destroyFileUploadHandle(handle);
                }
                else if (type == "filedownload" || type == "export")
                {
                    nexacro.__destroyFileDownloadHandle(handle);
                }
                else
                {
                    // 기본은 uploadhandle로 동작
                    nexacro.__destroyFileUploadHandle(handle);
                }

                pThis._hidden_frame_handle = null;
            }
        };

        nexacro._append_hidden_item = function (form_id, input_id, callback_fn, pThis, handle, multiselect)
        {
            pThis._file_changed = callback_fn;
            nexacro.__appendFileUploadItem(form_id, input_id, callback_fn, pThis, handle);
            if (pThis)
            {
                pThis._multiselect = multiselect;
            }
        };

        nexacro._remove_hidden_item = function (form_id, input_id, handle, idx_del)
        {
            nexacro.__removeFileUploadItem(form_id, input_id, handle, idx_del);
        };

        nexacro._submit = function (form_id, action, handle, exp_info_data, item_value, item_files)
        {
            var httpheaderstr = "";
            var httpvariables = nexacro._getSharedVariableAll(5);
            if (httpvariables)
            {
                for (var prop in httpvariables)
                {
                    if (httpvariables.hasOwnProperty(prop))
                    {
                        httpheaderstr += prop;
                        httpheaderstr += ":";
                        httpheaderstr += httpvariables[prop].value;
                        httpheaderstr += "\r\n";
                    }
                }
            }

            _application._beginCommProgress();
            if (item_files)
            {
                handle = nexacro.__submitFileUploadHandle(form_id, action, handle, exp_info_data, item_value, httpheaderstr, item_files);
            }
            else
            {
                handle = nexacro.__submitFileUploadHandle(form_id, action, handle, exp_info_data, item_value, httpheaderstr);
            }

            if (handle == null)
                _application._endCommProgress();
        };

        nexacro._download = function (url, is_popup_frame, handle, initname, targetpath, filefilter, filefilterindex, action)
        {
            // [47550, 38349, 47606] [신규] HTTP Header 를 수정할 수 있는 기능요청
            //var httpheaderstr = "";
            //var header_vars = _application._header_variables;
            //var header_vars_len = header_vars.length;
            //if (header_vars_len > 0)
            //{
            //    var header_id, header_value;
            //    for (var i = 0; i < header_vars_len; i++)
            //    {
            //        header_id = header_vars[i];
            //        header_value = _application[header_id];
            //        if (header_id && header_value)
            //        {
            //            httpheaderstr += header_id;
            //            httpheaderstr += ":";
            //            httpheaderstr += header_value;
            //            httpheaderstr += "\r\n";
            //        }
            //    }
            //}
            var httpheaderstr = "";
            var httpvariables = nexacro._getSharedVariableAll(5);
            if (httpvariables)
            {
                for (var prop in httpvariables)
                {
                    if (httpvariables.hasOwnProperty(prop))
                    {
                        httpheaderstr += prop;
                        httpheaderstr += ":";
                        httpheaderstr += httpvariables[prop].value;
                        httpheaderstr += "\r\n";
                    }
                }
            }

            // cookie 설정
            nexacro._addCookieFromCookieVariables();

            _application._beginCommProgress();
            handle = nexacro.__downloadFileDownloadHandle(url, handle, initname, targetpath, httpheaderstr, undefined, undefined, undefined, filefilter, filefilterindex, action);
            if (handle == null)
            {
                _application._endCommProgress();
                return null;
            }
        };

        nexacro._downloadExport = nexacro._download;

        /* timeout시 uploadiframe의 onload이벤트 발생안되는 브라우져를 XMLHttpRequest로 처리 */
        nexacro._request_submit = nexacro._emptyFn;
        nexacro._change_inputnode_name = nexacro._emptyFn;
        nexacro._append_hidden_textitem = nexacro._emptyFn;
        nexacro._setImportCommand = nexacro._emptyFn;

        //==============================================================================
        // FileDialog Utils
        //==============================================================================
        nexacro._createFileDialogHandle = function (target)
        {
            // forward FileDialog.onclose
            var callback_onclose = function (target)
            {
                return function (reason, path, files)
                {
                    var vfiles = [];
                    if (files && files.length)
                    {
                        for (var i = 0; i < files.length; i++)
                        {
                            var vfile = new nexacro.VirtualFile("vfile" + (new Date().valueOf().toString()) + i, "");
                            vfile.handle = null;

                            vfile._p_filename = files[i].filename;
                            vfile._p_fullpath = files[i].fullpath;
                            vfile._p_path = files[i].path;

                            vfiles.push(vfile);
                        }
                    }

                    target.on_close(reason, path, vfiles);
                };
            };

            if (nexacro._OS == "Android")
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
            }

            return nexacro.__createFileDialogObject(target, callback_onclose(target));
        };
        nexacro._destroyFileDialogHandle = function (target)
        {
            if (nexacro._OS == "Android")
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
        // runtime only
        nexacro._openFileDialogHandle = function (target, strTitle, constOpenMode, strInitialPath, strFileName, strDialogtype, nDlgWidth, nDlgHeight)
        {
            var winhandle;
            if (target.parent)
            {
                var curFrame = target.parent._getOwnerFrame();
                if (curFrame._window)
                    winhandle = curFrame._window.handle;
                else
                    winhandle = nexacro._getMainWindowHandle();
            }

            if (nexacro._isDesktop())
            {
                // runtime only
                return nexacro.__openFileDialogHandle(target._handle, winhandle, strTitle, constOpenMode, strInitialPath, strFileName, nDlgWidth, nDlgHeight);
            }
            else // android
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
                var json = {
                    id: target._id,
                    div: "FileDialog",
                    method: "open",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);
            }
        };
        nexacro._setFileDialogHandleAccept = nexacro._emptyFn;
        nexacro._setFileDialogHandleDefaultExtension = function (target, v)
        {
            return nexacro.__setFileDialogHandleDefaultExtension(target._handle, v);
        };
        nexacro._setFileDialogHandleFilter = function (target, v)
        {
            return nexacro.__setFileDialogHandleFilter(target._handle, v);
        };
        nexacro._setFileDialogHandleFilterIndex = function (target, v)
        {
            return nexacro.__setFileDialogHandleFilterIndex(target._handle, v);
        };

        //==============================================================================
        // VirtualFile Utils
        //==============================================================================
        nexacro._createVirtualFileHandle = function (target)
        {
            return nexacro.__createVirtualFileObject(target, target.on_success, target.on_error);
        };
        nexacro._destroyVirtualFileHandle = nexacro._emptyFn;
        nexacro._openVirtualFileHandle = function (target, strFileName, nOptions)
        {
            return nexacro.__openVirtualFileHandle(target._handle, strFileName, nOptions);
        };
        nexacro._closeVirtualFileHandle = function (target)
        {
            return nexacro.__closeVirtualFileHandle(target._handle);
        };
        nexacro._readVirtualFileHandle = function (target, nLength, strCharset)
        {
            return nexacro.__readVirtualFileHandle(target._handle, nLength, strCharset);
        };
        nexacro._readlineVirtualFileHandle = function (target, strDelimeter, strCharset)
        {
            return nexacro.__readlineVirtualFileHandle(target._handle, strDelimeter, strCharset);
        };
        nexacro._seekVirtualFileHandle = function (target, nOffset, nOption)
        {
            return nexacro.__seekVirtualFileHandle(target._handle, nOffset, nOption);
        };
        nexacro._writeVirtualFileHandle = function (target, varData, strCharset)
        {
            return nexacro.__writeVirtualFileHandle(target._handle, varData, strCharset);
        };
        nexacro._removeVirtualFileHandle = function (target, strDeletePath)
        {
            return nexacro.__removeVirtualFileHandle(target._handle, strDeletePath);
        };
        nexacro._copyVirtualFileHandle = function (target, path, destpath)
        {
            return nexacro.__copyVirtualFileHandle(target._handle, path, destpath);
        };
        nexacro._renameVirtualFileHandle = function (target, path, destpath)
        {
            return nexacro.__renameVirtualFileHandle(target._handle, path, destpath);
        };

        nexacro._setVirtualFileHandleAsync = function (target, bAsync)
        {
            return nexacro.__setVirtualFileHandleAsync(target._handle, bAsync);
        };

        nexacro._getFileListVirtualFileHandle = function (target, strPath, strSearchExpr, nConstOptions)
        {
            return nexacro.__getFileListVirtualFileHandle(target._handle, strPath, strSearchExpr, nConstOptions);
        };
        nexacro._getFileSizeVirtualFileHandle = function (target, strfullpath)
        {
            return nexacro.__getFileSizeVirtualFileHandle(target._handle, strfullpath);
        };

        nexacro._isExistVirtualFileHandle = function (target, isExistPath)
        {
            return nexacro.__isExistVirtualFileHandle(target._handle, isExistPath);
        };

        nexacro._createDirectoryVirtualFileHandle = function (target, strPath, bAllCreate)
        {
            return nexacro.__createDirectoryVirtualFileHandle(target._handle, strPath, bAllCreate);
        };
        nexacro._deleteDirectoryVirtualFileHandle = function (target, strPath, bAllChild)
        {
            return nexacro.__deleteDirectoryVirtualFileHandle(target._handle, strPath, bAllChild);
        };
        nexacro._renameDirectoryVirtualFileHandle = function (target, strPath, strNewName)
        {
            return nexacro.__renameDirectoryVirtualFileHandle(target._handle, strPath, strNewName);
        };

        nexacro._getFileAttributeList = function (strFilelist)
        {
            var obj = nexacro._executeGlobalEvalStr('(' + strFilelist + ')');
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
        nexacro._convertVirtualFileList = function (filelist, strPrefix)
        {
            if (filelist)
            {
                var ret = [];
                filelist = filelist.split("|");
                for (var i = 0, len = filelist.length, vfile; i < len; i++)
                {
                    vfile = new nexacro.VirtualFile("vfile" + (new Date().valueOf().toString()) + i);

                    vfile._setFullPath(filelist[i]);
                    vfile._setPath(filelist[i]);
                    vfile._setFileName(vfile._getFileName(filelist[i]));

                    ret.push(vfile);
                }

                return ret;
            }

            return null;
        };

        //==============================================================================
        // Transfer Utils
        //==============================================================================
        nexacro._uploadTransfer = function (filelist, postdatalist, url, index, evttarget)
        {
            var callback_onload = function ()
            {
                return function (status, data, url, errcode, httpcode, requesturi, errmsg)
                {
                    if (status < 0)
                    {
                        evttarget.on_error(9901, errmsg, httpcode, url, index);
                    }
                    else if (status == 4)
                    {
                        var loaded = httpcode;
                        var total = requesturi;
                        evttarget.on_progress(loaded, total, index);
                    }
                    else
                    {
                        try
                        {
                            if (data)
                            {
                                data = data.trimLeft();
                                var data_type = data.slice(0, 5).toUpperCase();

                                if (data_type.indexOf("<?XML") == 0) data_type = "XML";
                                if (data_type.indexOf("SSV") == 0) data_type = "SSV";
                                if (data_type.indexOf("{") == 0) data_type = "JSON";

                                if (data_type == "XML")
                                {
                                    data = nexacro._getXMLDocument(evttarget._unique_name, data, url);
                                }

                                if (nexacro._Deserializer[data_type])
                                {
                                    data = nexacro._Deserializer[data_type](data);
                                }

                                evttarget.on_load(data, url, index);
                            }
                        }
                        catch (e)
                        {
                            evttarget.on_error(9901, "", httpcode, url, index);
                        }
                    }
                };
            };

            var winhandle;
            if (evttarget.parent)
            {
                var curFrame = evttarget.parent._getOwnerFrame ? evttarget.parent._getOwnerFrame() : null;
                if (curFrame && curFrame._window)
                    winhandle = curFrame._window.handle;
                else
                    winhandle = nexacro._getMainWindowHandle();
            }

            var HTTPVAR_SEPERATOR = "\r\n";
            var POSTDATA_SEPERATOR = "&";

            var httpheaderstr = "";
            var httpvariables = nexacro._getSharedVariableAll(5);
            if (httpvariables)
            {
                for (var prop in httpvariables)
                {
                    if (httpvariables.hasOwnProperty(prop))
                    {
                        httpheaderstr += prop;
                        httpheaderstr += ":";
                        httpheaderstr += httpvariables[prop].value;
                        httpheaderstr += HTTPVAR_SEPERATOR;
                    }
                }
            }

            var postdatastr = "";
            for (var i = 0, len = postdatalist.length; i < len; i++)
            {
                postdatastr += postdatalist._idArray[i];
                postdatastr += "=";
                postdatastr += postdatalist[i];
                postdatastr += (i < len - 1) ? POSTDATA_SEPERATOR : "";
            }

            var transferitem = [];
            var transferitems = [];
            for (i = 0, len = filelist.length; i < len; i++)
            {
                transferitem[0] = filelist._idArray[i];
                transferitem[1] = filelist[i].fullpath;

                transferitems.push(transferitem);

                transferitem = [];
            }

            // cookie 설정
            nexacro._addCookieFromCookieVariables();

            if (!evttarget._handle)
            {
                evttarget._handle = nexacro.__createFileUploadHandle(evttarget._unique_name, callback_onload(), evttarget, winhandle);
            }

            nexacro.__submitFileUploadHandle("", url, evttarget._handle, null, "", httpheaderstr, transferitems, postdatastr);
        };

        nexacro._downloadTransfer = function (postdatalist, url, saveurl, evttarget, method)
        {
            var callback_onload = function ()
            {
                return function (status, data, url, errcode, httpcode, errmsg, extramsg)
                {
                    if (status < 0)
                    {
                        evttarget.on_error(url, errcode, httpcode, errmsg);
                    }
                    else
                    {
                        evttarget.on_load(status, data, url, errcode, httpcode, errmsg, extramsg);
                    }
                };
            };


            var winhandle;
            if (evttarget.parent)
            {
                var curFrame = evttarget.parent._getOwnerFrame ? evttarget.parent._getOwnerFrame() : null;
                if (curFrame && curFrame._window)
                    winhandle = curFrame._window.handle;
                else
                    winhandle = nexacro._getMainWindowHandle();
            }

            var HTTPVAR_SEPERATOR = "\r\n";
            var POSTDATA_SEPERATOR = "&";

            var httpheaderstr = "";
            var httpvariables = nexacro._getSharedVariableAll(5);
            if (httpvariables)
            {
                for (var prop in httpvariables)
                {
                    if (httpvariables.hasOwnProperty(prop))
                    {
                        httpheaderstr += prop;
                        httpheaderstr += ":";
                        httpheaderstr += httpvariables[prop].value;
                        httpheaderstr += HTTPVAR_SEPERATOR;
                    }
                }
            }

            //var postdatalistkeys = Object ? Object.keys(postdatalist) : "";
            var postdatalistkeys = Object.keys(postdatalist);
            for (var i = 0, len = postdatalistkeys.length, postdatastr = ""; i < len; i++)
            {
                postdatastr += postdatalistkeys[i];
                postdatastr += "=";
                postdatastr += postdatalist[postdatalistkeys[i]];
                postdatastr += (i < len - 1) ? POSTDATA_SEPERATOR : "";
            }

            if (postdatalist)
            {
                httpheaderstr += "Content-Type:application/x-www-form-urlencoded";
                httpheaderstr += HTTPVAR_SEPERATOR;
            }

            // cookie 설정
            nexacro._addCookieFromCookieVariables();

            if (!evttarget._handle)
                evttarget._handle = nexacro.__createFileDownloadHandle(callback_onload(), evttarget, winhandle);

            var handle = nexacro.__downloadFileDownloadHandle(url, evttarget._handle, evttarget.downloadfilename, saveurl, httpheaderstr, postdatastr);
            if (handle == null)
            {
                nexacro._OnceCallbackTimer.callonce(evttarget._refform, function ()
                {
                    evttarget.on_error(url, 9901, 1101, "I / O Error");
                });
            }
        };

        nexacro._isEqualTransferFile = function (orgVFile, targetVFile)
        {
            // Runtime VirtualFile은 내부에서 사용시 fullpath가 정해진 상태.
            // 해당 값으로 판단 불가능한 케이스 발생시 바이너리로 판단해야함.

            if (!orgVFile || !targetVFile)
                return false;

            if (orgVFile.fullpath == targetVFile.fullpath)
                return true;

            return false;
        };

        //==============================================================================
        // showModal Utils
        //==============================================================================
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

        //==============================================================================
        // Script Load Utils
        //==============================================================================

        nexacro.__createHttpRequest = nexacro._emptyFn;
        nexacro.__createFakeHttpRequest = nexacro._emptyFn;
        nexacro.__checkAjaxSuccess = nexacro._emptyFn;
        nexacro.__getHttpErrorCode = nexacro._emptyFn;

        nexacro.__checkAjaxStatus = function (ajax)
        {
            var ajax_handle = ajax.handle;
            var ajaxstatus = ajax_handle.readyState;
            if (ajaxstatus == 4)
            {
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


        nexacro.__bindLoadModuleHandler = function (handlewrap, pthis)
        {
            return function (status, data, fireerrorcode, returncode, locationurl, extramsg)
            {
                var callbackList = pthis.callbackList.slice(0);
                var item = null;
                var target;

                if (status < 0)
                {
                    if (returncode == 10408 || status == -408 || status == -504)
                    {
                        if (handlewrap._httpretry >= 1)
                        {
                            var ret = nexacro.__retryCommunication(handlewrap, pthis);
                            if (ret !== false)
                                return;
                        }
                    }

                    if (callbackList.length > 0)
                    {
                        while (item = callbackList.pop())
                        {
                            target = item.target;
                            if (target && target.context && target._use_transition_effect)
                            {
                                target.context.parent.cancelTransitionEffect();
                            }
                        }
                    }
                    pthis.on_error(status, fireerrorcode, returncode, locationurl, extramsg);
                    pthis = null;
                }
                else if (status == 0)
                {
                    try
                    {
                        pthis.on_load_module(data);
                    }
                    catch (e)
                    {
                        var bprinterror = false;
                        if (callbackList.length > 0)
                        {
                            while (item = callbackList.pop())
                            {
                                target = item.target;
                                if (target && target.context)
                                {
                                    if (target._use_transition_effect)
                                        target.context.parent.cancelTransitionEffect();

                                    if (target.context._is_form == true && target.context._is_loaded == false)
                                        bprinterror = true;
                                }
                            }
                        }

                        if (bprinterror == true)
                        {
                            if (e.obj)
                            {
                                nexacro._onSystemError(e.obj, e.name, e.message);
                            }
                            else
                            {
                                var msg = nexacro._getExceptionMessage(e);
                                var environment = nexacro.getEnvironment();
                                if (environment)
                                {
                                    nexacro._onSystemError(environment, e.name, msg);
                                }
                            }
                        }
                    }
                    nexacro.__refreshDirtyWindow(pthis.context ? (pthis.context._is_component ? pthis.context._getWindowHandle() : null) : null);
                    pthis = null;
                }
                callbackList = null;
            };
        };
        nexacro.__bindLoadTextHandler = function (handlewrap, pthis)
        {
            return function (status, data, fireerrorcode, returncode, locationurl, extramsg)
            {
                if (status < 0)
                {
                    if (returncode == 10408 || status == -408 || status == -504)
                    {
                        if (handlewrap._httpretry >= 1)
                        {
                            var ret = nexacro.__retryCommunication(handlewrap, pthis);
                            if (ret !== false)
                                return;
                        }
                    }
                    pthis.on_error(status, fireerrorcode, returncode, locationurl, extramsg);
                    pthis = null;
                }
                else if (status == 0)
                {
                    pthis.on_load_text(data);
                    nexacro.__refreshDirtyWindow(pthis.context ? (pthis.context._is_component ? pthis.context._getWindowHandle() : null) : null);
                    pthis = null;
                }
            };
        };
        nexacro.__checkloadData = nexacro._emptyFn;
        nexacro.__bindLoadDataHandler = function (handlewrap, pthis)
        {
            let str2ab = nexacro._emptyFn;
            if (typeof TextEncoder != "undefined")
            {
                str2ab = function str2ab(str)
                {
                    return new TextEncoder("utf-8").encode(str);
                }
            }
            else
            {
                str2ab = function str2ab(str)
                {
                    var i = 0, len = str.length;

                    var buf = [];
                    //var length = str.length;
                    while (i < len)
                    {
                        var code_point = str.codePointAt(i);
                        var c = 0, bits = 0;
                        if (code_point <= 0x0000007F)
                        {
                            //c = 0;
                            bits = 0x00;
                        }
                        else if (code_point <= 0x000007FF)
                        {
                            c = 6;
                            bits = 0xC0;
                        }
                        else if (code_point <= 0x0000FFFF)
                        {
                            c = 12;
                            bits = 0xE0;
                        }
                        else if (code_point <= 0x001FFFFF)
                        {
                            c = 18;
                            bits = 0xF0;
                        }

                        buf.push(bits | (code_point >> c));
                        c -= 6;

                        while (c >= 0)
                        {
                            buf.push(0x80 | ((code_point >> c) & 0x3F));
                            c -= 6;
                        }
                        i += code_point >= 0x10000 ? 2 : 1;
                    }

                    return buf;
                }
            }

            pthis._last_loaded = 0;

            var fn_onload, fn_onprogress, fn_getreceiveddata;
            if (handlewrap._responsetype == "arraybuffer")
            {
                fn_onload = pthis.on_load_arraybuffer;
                fn_onprogress = pthis.on_progress_arraybuffer_chunk;
                fn_getreceiveddata = function (data)
                {
                    if (!data || data.length == 0)
                        return new Uint8Array();

                    if (typeof data == "string")
                        return new Uint8Array(str2ab(data));

                    return new Uint8Array(data);
                }
            }
            else
            {
                fn_onload = pthis.on_load_data;
                fn_onprogress = pthis.on_progress_data;
                fn_getreceiveddata = function (data)
                {
                    if (!data) data = "";
                    return data;
                }
            }

            return function (status, data, cookie, fireerrorcode, returncode, locationurl, extramsg)
            {
                var _recieved_data;
                if (status < 0)
                {
                    if (status == -9)// cancel
                    {
                        pthis.on_error(0, "comm_cancel_byuser", nexacro._CommunicationStatusTable.cancel_byuser);
                    }
                    else
                    {
                        if (returncode == 10408 || status == -408 || status == -504)
                        {
                            if (handlewrap._httpretry >= 1)
                            {
                                var ret = nexacro.__retryCommunication(handlewrap, pthis);
                                if (ret !== false)
                                    return;
                            }
                        }
                        pthis.on_error(status, fireerrorcode, returncode, locationurl, extramsg);
                    }
                    nexacro.__refreshDirtyWindow(pthis.context ? (pthis.context._is_component ? pthis.context._getWindowHandle() : null) : null);
                    pthis = null;
                }
                else if (status == 0)
                {
                    _recieved_data = fn_getreceiveddata(data);
                    fn_onload.call(pthis, _recieved_data, cookie);

                    nexacro.__refreshDirtyWindow(pthis.context ? (pthis.context._is_component ? pthis.context._getWindowHandle() : null) : null);
                    //pthis = null;
                }
                else if (status > 0)        // 4 : on_progress
                {
                    if (!nexacro._use_progress_data)
                        return;

                    _recieved_data = fn_getreceiveddata(data);

                    //pthis.on_progress_data(data, false);
                    if (fn_onprogress.call(pthis, _recieved_data, false))
                    {
                        pthis._last_loaded += _recieved_data.length;
                    }

                    _recieved_data = null;

                    if (pthis instanceof nexacro.TransactionItem)
                    {
                        if (data && !pthis._progress_data) //data가 있는데 처리되지 않은 경우 = 타입정보를 확인할수 없는 경우
                        {
                            if (pthis._protocol < 0)
                            { //사용자 지정 프로토콜 정보가 있으면 
                                data = pthis.on_decrypt(data);
                                if (data)
                                {
                                    pthis.on_progress_data(data, false);
                                }
                            }
                        }
                    }

                    nexacro.__refreshDirtyWindow(pthis.context ? (pthis.context._is_component ? pthis.context._getWindowHandle() : null) : null);
                }
                data = null;
            };
        };

        nexacro.__bindLoadDataObjectHandler = function (_ajax, pthis)
        {
            return function ()
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
                            {
                                // 21/06/10 - 오지현 - [RP 92312] [DataObject.request로 통신 처리시 수신한 Cookie가 반영안되는 현상]
                                // "pthis.context._getWindow()._doc.cookie"에서 쿠키값이 "undefined"가 됨.
                                // jsp 파일에서 response.addCookie를 통해 전달된 쿠키 값은 Response Header에서 Set-Cookie 항목에 해당됨.
                                // 따라서 ajax 핸들러를 통해 "Set-Cookie" 항목에 해당하는 값을 가져옴.
                                cookie = ajax_handle.getResponseHeader("Set-Cookie");
                            }
                            /*
                            else
                                cookie = document ? document.cookie : null;*/
                        }
                        var data = ajax_handle.responseText;
                        if (!data) data = "";

                        pthis._b_recieved_all_data = true;
                        pthis.on_load_dataobject(data, cookie, last_modified, ajax_handle.getAllResponseHeaders(), ajax_handle.status);
                        nexacro.__refreshDirtyWindow(pthis.context ? (pthis.context._is_component ? pthis.context._getWindowHandle() : null) : null);
                        _ajax._destroy();
                        _ajax = null;

                        pthis._destroy();
                        pthis = null;
                    }
                }
                else 
                {
                    if (_ajax._user_aborted)
                    {
                        pthis.on_error(0, "comm_cancel_byuser", nexacro._CommunicationStatusTable.cancel_byuser, "", "", ajax_handle.responseText, ajax_handle.getAllResponseHeaders());
                    }
                    else
                    {
                        var locationurl = "", extramsg = "";
                        var ret;

                        if (status == -10408 || status == -408 || status == -504)
                        {
                            if (_ajax._httpretry >= 1)
                            {
                                ret = nexacro.__retryRESTCommunication(_ajax, pthis);
                                if (ret !== false)
                                    return;
                            }

                            if (status == -408 || status == -504)
                                pthis.on_error(-1, "comm_fail_loaddetail", -status, locationurl, extramsg, ajax_handle.responseText, ajax_handle.getAllResponseHeaders());
                            else
                                pthis.on_error(-1, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.client_timeout, locationurl, extramsg, ajax_handle.responseText, ajax_handle.getAllResponseHeaders());

                        }
                        else
                        {
                            pthis.on_error(-1, "comm_fail_loaddetail", -status, "", "", ajax_handle.responseText, ajax_handle.getAllResponseHeaders());
                        }
                    }
                    _ajax._destroy();
                    _ajax = null;

                    pthis._destroy();
                    pthis = null;
                }

                //ajax_handle = null;
            };
        };

        nexacro.__bindLoadImageHandler = function (pthis)
        {
            return function (status, width, height, fireerrorcode, returncode, locationurl, extramsg)
            {
                if (status < 0)
                {
                    delete nexacro._ImgInfoCacheList[pthis.path];
                    pthis.on_error_image(0, 0, null, status, fireerrorcode, returncode, locationurl, extramsg);
                    pthis = null;
                }
                else if (status == 0)
                {
                    var target_wins = [];
                    var callbackList = pthis.callbackList;
                    var n = callbackList ? callbackList.length : 0, i;
                    for (i = 0; i < n; i++)
                    {
                        var item = callbackList[i];
                        var target = item.target;
                        var target_handle = (target._getWindowHandle ? target._getWindowHandle() : null);
                        if (target._is_alive != false && target_handle)
                        {
                            if (nexacro._indexOf(target_wins, target_handle) < 0)
                                target_wins.push(target_handle);
                        }
                    }

                    if (pthis.path.indexOf("?size=") < 0)
                    {
                        nexacro._ImgInfoCacheList[pthis.path] = { width: width, height: height };
                    }

                    pthis.on_load_image(width, height);

                    n = target_wins.length;
                    if (n > 0)
                    {
                        for (i = 0; i < n; i++)
                        {
                            var target_win = target_wins[i];
                            if (target_win)
                            {
                                nexacro.__refreshDirtyWindow(target_win);
                            }
                        }
                        target_wins = null;
                    }
                    else
                    {
                        nexacro.__refreshDirtyWindow(pthis.context ? (pthis.context._is_component ? pthis.context._getWindowHandle() : null) : null);
                    }
                    pthis = null;
                }
            };
        };
        nexacro.__bindLoadJsonHandler = function (handlewrap, pthis)
        {
            return function (status, data, fireerrorcode, returncode, locationurl, extramsg)
            {
                if (status < 0)
                {
                    pthis.on_error(status, fireerrorcode, returncode, locationurl, extramsg);
                    pthis = null;
                }
                else if (status == 0)
                {
                    pthis.on_load_json(data);
                    nexacro.__refreshDirtyWindow(pthis.context ? (pthis.context._is_component ? pthis.context._getWindowHandle() : null) : null);
                    pthis = null;
                }
            };
        };

        nexacro.__bindLoadUpdateHandler = function (handlewrap, pthis)
        {
            return function (status, data, fireerrorcode, returncode, locationurl, extramsg)
            {
                if (status < 0)
                {
                    pthis.on_error(status, fireerrorcode, returncode, locationurl, extramsg);
                    pthis = null;
                }
                else if (status == 0)
                {
                    pthis.on_load_update(data);
                    nexacro.__refreshDirtyWindow(pthis.context ? (pthis.context._is_component ? pthis.context._getWindowHandle() : null) : null);
                    pthis = null;
                }
            };
        };


        nexacro.__startCommunication = function (loadItem, path, cachelevel, async, referer, senddata, ndatatype, compress, ver, failpass, service)
        {
            var handlewrap = {};

            // parse protocol
            if (path.indexOf("://") > -1)
            {
                var ar = path.split("://");
                var protocol = ar[0];
                switch (protocol)
                {
                    case "http": handlewrap._protocol = 0; break;
                    case "https": handlewrap._protocol = 1; break;
                    case "file": handlewrap._protocol = 2; break;
                    default: handlewrap._protocol = -1; break;
                }
            }
            //handlewrap
            const env = nexacro.getEnvironment();
            const envhttpretry = env ? env._p_httpretry : 0;
            var httpretry = (loadItem._httpretry !== undefined) ? loadItem._httpretry : envhttpretry;
            if (httpretry >= 1)
            {
                handlewrap._path = path;
                handlewrap._cachelevel = cachelevel;
                handlewrap._async = async;
                handlewrap._referer = referer;
                handlewrap._senddata = senddata;
                handlewrap._ndatatype = ndatatype;
                handlewrap._compress = compress;
                handlewrap._ver = ver;
                handlewrap._failpass = failpass;
                handlewrap._ver = ver;
                handlewrap._httpretry = httpretry;
                handlewrap._service = service;
            }

            var bindfn = null, protocoladp;
            if (loadItem.type == "module")
            {
                bindfn = nexacro.__bindLoadModuleHandler(handlewrap, loadItem);
            }
            else if (loadItem.type == "data")
            {
                var availableArrayBuffer = true;
                if (ndatatype == 3)
                {
                    availableArrayBuffer = false;
                }
                if (availableArrayBuffer)
                {
                    if (loadItem._protocol < 0)
                    {
                        protocoladp = nexacro._getProtocol(loadItem.protocol);
                        if (protocoladp) availableArrayBuffer = false;
                    }
                }
                if (availableArrayBuffer)
                    handlewrap._responsetype = "arraybuffer";

                bindfn = nexacro.__bindLoadDataHandler(handlewrap, loadItem);
            }
            else if (loadItem.type == "image")
            {
                bindfn = nexacro.__bindLoadImageHandler(loadItem);
            }
            else if (loadItem.type == "text")// text
            {
                bindfn = nexacro.__bindLoadTextHandler(handlewrap, loadItem);
            }
            else if (loadItem.type == "css")// css
            {
                bindfn = nexacro.__bindLoadTextHandler(handlewrap, loadItem);

                ndatatype = nexacro._getCSSTypeCode(senddata);
            }
            else if (loadItem.type == "json")
            {
                bindfn = nexacro.__bindLoadJsonHandler(handlewrap, loadItem);
            }
            else //for update 
            {
                bindfn = nexacro.__bindLoadUpdateHandler(handlewrap, loadItem);
            }

            var url;
            if (handlewrap._protocol == 0 || handlewrap._protocol == 1)
                url = nexacro._encodeURI(path);
            else
                url = nexacro._decodeURI(path);

            var refer_url = referer ? nexacro._decodeURI(referer) : referer;

            var servicecachelevel = "none";
            if (cachelevel == "default")
            {
                cachelevel = service._p_cachelevel;
            }
            if (service)
            {
                if (service._p_cachelevel == "session")
                    servicecachelevel = cachelevel;
                else
                    servicecachelevel = service._p_cachelevel;
            }

            if (!ver)
                ver = service.version;

            var httpheaderstr = "";
            protocoladp = nexacro._getProtocol(loadItem.protocol);

            if (protocoladp && protocoladp.version)
            {
                var protocolver = protocoladp.version();
                if (protocolver > "1.0")
                {
                    var httpheaders = protocoladp.getHTTPHeader();

                    for (var i = 0; i < httpheaders.length; i++)
                    {
                        httpheaderstr += httpheaders[i].id;
                        httpheaderstr += ":";
                        httpheaderstr += httpheaders[i].value;
                        httpheaderstr += "\r\n";
                    }
                }
            }


            var httpvariables = nexacro._getSharedVariableAll(5);
            if (httpvariables)
            {
                for (var prop in httpvariables)
                {
                    if (httpvariables.hasOwnProperty(prop))
                    {
                        httpheaderstr += prop;
                        httpheaderstr += ":";
                        httpheaderstr += httpvariables[prop].value;
                        httpheaderstr += "\r\n";
                    }
                }
            }

            //handlewrap.handle = nexacro.__startLoad(url, bindfn, loadItem.type, servicecachelevel, async, refer_url, senddata, ndatatype, compress, ver, failpass, httpheaderstr);
            handlewrap.handle = nexacro.__startLoad(url, bindfn, loadItem.type, servicecachelevel, async, refer_url, senddata, ndatatype, compress, ver, failpass, httpheaderstr, handlewrap._responsetype);
            //timeout async retry
            return handlewrap;
        };

        nexacro.__cancelCommunication = function (handle)
        {
            var _handle = handle.handle;
            return nexacro.__cancelLoad(_handle);
        };

        nexacro.__retryCommunication = function (handlewrap, loaditem)
        {
            if (!handlewrap || !loaditem)
                return false;

            var path = handlewrap._path;
            var async = handlewrap._async;
            var senddata = handlewrap._senddata;
            var referer = handlewrap._referer;
            var service = handlewrap._service;
            var cachelevel = handlewrap._cachelevel;
            var ndatatype = handlewrap._ndatatype;
            var compress = handlewrap._compress;
            var ver = handlewrap._ver;
            var failpass = handlewrap._failpass;
            var httpretry = handlewrap._httpretry;

            loaditem._httpretry = httpretry - 1;
            //handlewrap.handle.abort(); //Check                       
            handlewrap = null;
            nexacro.__startCommunication(loaditem, path, cachelevel, async, referer, senddata, ndatatype, compress, ver, failpass, service);
            return true;
        };

        nexacro._datasetToBINString = function (dataset, id, type, savenan, saveinfinity, saveinvaliddate)
        {
            var ssvdata = dataset.saveSSV(id, type);
            if (ssvdata)
            {
                return nexacro._convertDatasetSSVToBIN(ssvdata);
            }
            return ssvdata;
        };

        nexacro._datasetFromBINString = function (dataset, binData)
        {
            if (!binData)
                return dataset._p_rowcount;

            var ssvdata = nexacro._convertDatasetBINToSSV(binData);
            if (!ssvdata)
                return dataset._p_rowcount;

            return dataset.loadSSV(ssvdata);
        };


        nexacro._convertDatasetSSVToBIN = function (ssvdata)
        {
            return nexacro.__convertDatasetSSVToBIN(ssvdata);
        };

        nexacro._convertDatasetBINToSSV = function (bindata)
        {
            return nexacro.__convertDatasetBINToSSV(bindata);
        };

        nexacro._convertStreamSSVToBIN = function (ssvdata)
        {
            return nexacro.__convertStreamSSVToBIN(ssvdata);
        };

        nexacro._convertStreamBINToSSV = function (bindata)
        {
            return nexacro.__convertStreamBINToSSV(bindata);
        };

        nexacro._completedUpdateResource = function (target, url, type, targetpath, ref, failpass, index, count)
        {
            nexacro.__completedUpdateResource(target, url, type, targetpath, ref, failpass, index, count);
        };

        // for css preview runtime
        nexacro._clearCssData = function ()
        {
            nexacro.__clearCssData();
        };

        nexacro._reloadCssData = function (cssdata)
        {
            var cssfile = "emptyurl";
            var csstype = nexacro._getCSSTypeCode();

            // reload css
            nexacro.__reloadCssData(cssfile, cssdata, csstype);

            // refresh main window
            nexacro.__refreshCssAll(nexacro._getMainWindowHandle());
        };

        nexacro._refreshCssAll = function ()
        {
            nexacro.__refreshCssAll(nexacro._getMainWindowHandle());
        };

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

            //this._is_loaded_firstcount = false;
            this._is_first_load = true;
            this._is_appending = false;
            this._useclientlayout = ds.useclientlayout;
            this._viewrecords_length = 0;

            this._progress_status = 0;  //0:start, 1:loading, 2:end

            this._colLines = null;
            this._next_line_idx = 0;  // next record-line index to read
            this._next_load_idx = null;

            this._ds_start_idx = null;
            this._ds_end_idx = null;

            this._row_start_idx = null;
            this._firstrow_end_idx = null;
            this._row_end_idx = null;

            this._colinfo_start_idx = null;
            this._colinfo_end_idx = null;

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
            this._data_buffer = [];  // raw data buffer for runtime
            this._data_buffer._data_length = 0;

            this._cur_idx = [0, 0];       // [0] : array idx, [1] : next index in string

            this._received_data_length = 0;
            this._parent = parent;          // parent object (TransactionItem)
            this._rs = undefined;                       //record separator
            this._cs = undefined;                       //column(unit) separator

            this._data_type = null;               // SSV,CSV,PPX
            this._parse_mode = 0;               //["root","header", "parameters", "dataset", "constcolinfo", "collinfo", "record","JSON_id","JSON_string"]
            this._load_completed = false;       //      
            this._parsed_errorcd = false;
            this._applychanged_inds = false;

            this._parameters = [];
            this._datasets = {};                // buffer of datasets
            this._datasets_in_seq = [];
            this._cur_dataset_id = "";          // id of dataset that it is being processed...

            this._error_info = [undefined, "SUCCESS"];  // received error information

            this._parsing_min_size = 1024 * 4;      // it's minimum size of parsing ;

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

            if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
            {
                for (var ds_buff in this._datasets)
                {
                    if (!this._datasets.hasOwnProperty(ds_buff))
                    {
                        this._datasets[ds_buff] = null;
                    }
                }
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

            return true;
        };

        _pProgressData._on_progress = function (data, bFinal)
        {
            if (data)
            {
                var len = this._data_buffer.length;
                this._data_buffer[len] = data;
                this._data_buffer._data_length += data.length;
            }

            var received_len = this._data_buffer._data_length - this._received_data_length;
            if (!bFinal && (received_len < this._parsing_min_size))
            {
                // skip parsing
                return;
            }

            this._received_data_length = this._data_buffer._data_length;

            if (!bFinal && nexacro._use_firefirstcount && !this._needParseForFirstCount())
                return;

            var env = nexacro.getEnvironment();
            var datasetloadtype = env._p_datasetloadtype;

            var error_cd = this._error_info[0];
            if (error_cd <= -1 && datasetloadtype == "onsuccess")
                return;

            this._parse(bFinal);
        };

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

        _pProgressData._parseHeader = function ()
        {
            var nrp = this._getNextRecordPos(this._cur_idx);

            var n = nrp[0];
            var next_buffer_idx = nrp[1];
            var rs_len = nrp[2];

            if (n >= 0)
            {
                this._cur_idx = this._getNextIdx([next_buffer_idx, n + rs_len]);
                return true;
            }

            return false;
        };

        _pProgressData._parseParameters = function ()
        {
            var i;
            var line = "";
            var nrp = this._getNextRecordPos(this._cur_idx);

            var n = nrp[0];
            var next_buffer_idx = nrp[1];
            var rs_len = nrp[2];
            if (n >= 0)
            {
                if (this._cur_idx[0] != next_buffer_idx)
                {
                    var buff = this._data_buffer[this._cur_idx[0]];
                    line = buff.substring(this._cur_idx[1], buff.length);

                    for (i = this._cur_idx[0] + 1; i <= next_buffer_idx; i++)
                    {

                        buff = this._data_buffer[i];
                        if (i == next_buffer_idx)
                            line += buff.substring(i, n);
                        else
                            line += buff.substring(i, buff.length);
                    }
                }
                else
                {
                    line = this._data_buffer[this._cur_idx[0]].substring(this._cur_idx[1], n);
                }

                this._cur_idx = this._getNextIdx([next_buffer_idx, n + rs_len]);

                var param_arr = line.split(this._cs);
                var param_cnt = param_arr.length;
                var form = this._parent.context;

                for (i = 0; i < param_cnt; i++)
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
                            if (isFinite(code) == false)
                            {
                                code = -1;
                            }

                            val = code;

                            this._error_info[0] = val;

                            this._parsed_errorcd = true;
                        }
                        else if (id == "ErrorMsg")
                        {
                            this._error_info[1] = val;
                        }
                        else if (id in form)  //1.form(application) variable 
                        {
                            if (nexacro._isNull(form[id]) || !nexacro._isObject(form[id]))
                            {
                                form[id] = val;
                            }
                        }
                        else //application globalvariable
                        {
                            var app = nexacro.getApplication();
                            if (app && app._existVariable(id))
                            {
                                app[id] = val;
                            }
                            else
                            {
                                var hasvariable = nexacro._hasEnvironmentVariable(id);
                                if (hasvariable)
                                    nexacro.setEnvironmentVariable(id, val);
                            }
                        }

                        this._parameters[this._parameters.length] = { id: id, value: val };
                    }
                }
                return true;
            }

            return false;
        };

        _pProgressData._parseDataset = function ()
        {
            var nrp = this._getNextRecordPos(this._cur_idx);

            var n = nrp[0];
            var next_buffer_idx = nrp[1];
            var rs_len = nrp[2];

            if (n >= 0)
            {
                var line = this._getBufferDataByIdx(this._cur_idx, [next_buffer_idx, n]);

                var cur_bufferObj;
                var cur_bufferObj_arr = this._datasets[this._cur_dataset_id];
                if (cur_bufferObj_arr)
                {
                    for (var i = 0; i < cur_bufferObj_arr.length; i++)
                    {
                        cur_bufferObj = cur_bufferObj_arr[i];

                        cur_bufferObj._row_end_idx = this._cur_idx;
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
                        if (bufferObj_arr && bufferObj_arr.length)
                        {
                            this._cur_dataset_id = remoteId;
                            this._datasets_in_seq[this._datasets_in_seq.length] = remoteId;

                            for (var j = 0; j < bufferObj_arr.length; j++)
                            {
                                bufferObj = bufferObj_arr[j];

                                bufferObj._isEnable = true;
                                bufferObj._ds_start_idx = new Array(this._cur_idx[0], this._cur_idx[1]);
                                bufferObj._ds_end_idx = new Array(this._cur_idx[0], this._cur_idx[1] + n);
                            }
                        }
                        else
                        {
                            this._cur_dataset_id = "";
                            this._parse_mode = 9;
                        }
                    }
                }

                this._cur_idx = this._getNextIdx([next_buffer_idx, n + rs_len]);

                return true;
            }

            return false;
        };

        _pProgressData._parseColInfo = function ()
        {
            var nrp = this._getNextRecordPos(this._cur_idx);

            var n = nrp[0];
            var next_buffer_idx = nrp[1];
            var rs_len = nrp[2];

            if (n >= 0)
            {
                var bufferObj;
                var bufferObj_arr = this._datasets[this._cur_dataset_id];
                if (bufferObj_arr)
                {
                    for (var i = 0; i < bufferObj_arr.length; i++)
                    {
                        bufferObj = bufferObj_arr[i];
                        if (!bufferObj._colinfo_start_idx)
                        {
                            bufferObj._colinfo_start_idx = new Array(this._cur_idx[0], this._cur_idx[1]);
                        }

                        bufferObj._colinfo_end_idx = new Array(next_buffer_idx, n);
                    }
                }

                this._cur_idx = this._getNextIdx([next_buffer_idx, n + rs_len]);
                return true;
            }

            this._parse_mode = 3;

            return false;
        };

        _pProgressData._parseRecord = function ()
        {
            var nrp = this._getNextRecordPos(this._cur_idx);

            var n = nrp[0];
            var next_buffer_idx = nrp[1];
            var rs_len = nrp[2];

            var i;
            var bufferObj;
            var bufferObj_arr = this._datasets[this._cur_dataset_id];
            if (n >= 0)
            {
                if (bufferObj_arr)
                {
                    for (i = 0; i < bufferObj_arr.length; i++)
                    {
                        bufferObj = bufferObj_arr[i];
                        if (!bufferObj._row_start_idx)
                        {
                            bufferObj._row_start_idx = new Array(this._cur_idx[0], this._cur_idx[1]);
                        }

                        if (this._data_type == "SSV" || this._data_type == "PPX")
                        {
                            var rowtype = this._data_buffer[this._cur_idx[0]].charAt(this._cur_idx[1]);
                            if (rowtype != "d" || rowtype != "D")
                            {
                                bufferObj._viewrecords_length++;
                            }
                        }
                        else
                        {
                            bufferObj._viewrecords_length++;
                        }

                        if (nexacro._use_firefirstcount)
                        {
                            if (bufferObj._firefirstcount > 0 && bufferObj._firefirstcount == bufferObj._viewrecords_length)
                            {
                                bufferObj._firstrow_end_idx = new Array(next_buffer_idx, n);

                                this._cur_idx = this._getNextIdx([next_buffer_idx, (n + rs_len)]);
                                return false;
                            }
                        }
                    }

                    this._cur_idx = this._getNextIdx([next_buffer_idx, (n + rs_len)]);

                    return true;
                }
            }
            else
            {
                if (bufferObj_arr)
                {
                    for (i = 0; i < bufferObj_arr.length; i++)
                    {
                        bufferObj = bufferObj_arr[i];
                        if (!bufferObj._row_start_idx)
                        {
                            bufferObj._row_start_idx = new Array(this._cur_idx[0], this._cur_idx[1]);
                        }
                    }
                }
            }

            return false;
        };

        _pProgressData._parse = function (bFinal)
        {
            var bLoop = true;
            var bufferObj_arr, bufferObj, val, i, j;
            var env = nexacro.getEnvironment();
            var datasetloadtype = env._p_datasetloadtype;

            while (bLoop)
            {
                bLoop = this._setNextParseMode();
                if (!bLoop)
                    break;

                switch (this._parse_mode)
                {
                    case 0://root
                        break;
                    case 1://header
                        bLoop = this._parseHeader();
                        break;
                    case 2://parameters
                        bLoop = this._parseParameters();
                        if (bLoop)
                        {
                            if (!this._applychanged_inds && this._parsed_errorcd && this._error_info[0] >= 0)
                            {
                                this._applychanged_inds = this._applyChangeInputDataset();
                            }
                        }
                        break;
                    case 3://dataset
                        if (this._parsed_errorcd)
                        {
                            if (this._error_info[0] < 0 && datasetloadtype == "onsuccess")
                            {
                                bLoop = false;
                                break;
                            }
                        }
                        bLoop = this._parseDataset();
                        break;
                    case 4://constcolinfo
                    case 5://collinfo
                        bLoop = this._parseColInfo();
                        break;
                    case 6://record
                        bLoop = this._parseRecord();

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
                                        this._on_fire_onload(bufferObj, 1);
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
                                            this._on_fire_onload(bufferObj, 1);
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
                                this._on_fire_onload(bufferObj, 0);
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
                for (i = 0; i < this._datasets_in_seq.length; i++)
                {
                    val = this._datasets_in_seq[i];
                    bufferObj_arr = this._datasets[val];
                    if (bufferObj_arr)
                    {
                        for (j = 0; j < bufferObj_arr.length; j++)
                        {
                            bufferObj = bufferObj_arr[j];
                            if (bufferObj._isEnable && !bufferObj._is_loaded)
                            {
                                this._on_fire_onload(bufferObj, 0);
                            }
                        }
                    }
                }


                //clear buffer
                while (this._data_buffer && this._data_buffer.length)
                {
                    this._data_buffer[this._data_buffer.length - 1] = null;
                    this._data_buffer.pop();
                }

                this._data_buffer = null;
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
                    else if (id in this._parent.context)  //1.form(application) variable
                    {
                        if (nexacro._isNull(this._parent.context[id]) || !nexacro._isObject(this._parent.context[id]))
                        {
                            this._parent.context[id] = val;
                        }
                    }
                    else //application globalvariable
                    {
                        var app = nexacro.getApplication();
                        if (app && app._existVariable(id))
                        {
                            app[id] = val;
                        }
                        else
                        {
                            var hasvariable = nexacro._hasEnvironmentVariable(id);
                            if (hasvariable)
                            {
                                nexacro.setEnvironmentVariable(id, val);
                            }
                        }
                    }

                    this._parameters[this._parameters.length] = { id: id, value: val };
                }
            }

            if (this._error_info[0] >= 0)
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
                    {
                        buffer_obj._pgConvertFn = target_ds._cachedConvertFn = this._setColInfo_from_chunk(line, target_ds, buffer_obj._useclientlayout);
                        target_ds._colInfoLines = line;
                    }
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

                var s_pos = offset, e_pos, i, len = datasets.length;
                var ret = [];
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
            var datasetloadtype = env._p_datasetloadtype;
            var ret;
            var nullRecord = false;

            if (nexacro._isArray(this._cur_idx))
            {
                s_pos = e_pos = this._cur_idx[0];
            }
            else
            {
                s_pos = e_pos = this._cur_idx;
            }

            while (bLoop)
            {
                pre_parse_mode = this._parse_mode;

                cur_parse_mode = this._setNextParseMode_arraybuffer(data, s_pos, pre_parse_mode);
                if (pre_parse_mode == 2 && cur_parse_mode != 2)
                {
                    if (this._error_info[0] === undefined)
                    {
                        this._error_info[0] = 0;
                        this._applyChangeInputDataset();
                    }

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
                else if (this._error_info[0] === undefined)
                {
                    this._error_info[0] = 0;
                    this._applyChangeInputDataset();
                }

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

                        else if (buffer_obj._progressload)
                        {
                            if (nullRecord)
                            {
                                this._on_fire_onload_arraybuffer_chunk(data, buffer_obj, 0);
                                buffer_obj._is_loaded = true;
                            }
                            else
                            {
                                this._on_fire_onload_arraybuffer_chunk(data, buffer_obj, 1);
                            }
                        }
                    }

                    nullRecord = false;
                }
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

        _pProgressData._on_fire_onload = function (bufferObj, nLoadType)
        {
            var ds = bufferObj._target_ds;
            var data = "";
            var rs = this._rs;
            var errorcode = this._error_info[0];
            var errormsg = this._error_info[1];

            ds._bWorkingstatus = true;
            if (!bufferObj._colLines)
            {
                var colInfoData = this._getBufferDataByIdx(bufferObj._colinfo_start_idx, bufferObj._colinfo_end_idx);
                bufferObj._colLines = colInfoData.split(rs);

                ds._dataType = this._data_type;
                ds._colInfoLines = bufferObj._colLines[0];
            }

            var bLoop = true;
            while (bLoop)
            {
                if (nLoadType == 1)
                {
                    if (nexacro._use_firefirstcount)
                    {
                        data = this._getBufferDataByIdx(bufferObj._row_start_idx, bufferObj._firstrow_end_idx);

                        var nrp = this._getNextRecordPos(bufferObj._firstrow_end_idx);
                        if (nrp[0] >= 0)
                        {
                            var tIdx = [nrp[1], nrp[0] + nrp[2]];
                            bufferObj._next_load_idx = this._getNextIdx([tIdx[0], tIdx[1]]);
                        }
                        else
                            bufferObj._next_load_idx = [-1, -1];
                    }
                    else
                    {
                        //data = this._getBufferData(bufferObj, nLoadType, false);
                        data = this._getBufferData(bufferObj, nLoadType, true);
                    }

                    bLoop = false;
                }
                else
                {
                    data = this._getBufferData(bufferObj, nLoadType, false);
                    bLoop = (data.length == 0) ? false : true;
                }

                var lines = data.split(new RegExp(rs));

                if (bufferObj._progress_status == 0)
                {
                    ds._p_rowposition = -1;
                }

                switch (this._data_type)
                {
                    case "CSV":
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

                            bufferObj._pgConvertFn = ds._setColInfoFromCSVLine(bufferObj._colLines[0], bufferObj._useclientlayout);
                        }

                        ds._loadFromCSVArray(bufferObj._colLines[0], lines, 0, -1, bufferObj._useclientlayout, false, bufferObj._pgConvertFn);
                        break;
                    case "SSV":
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

                            bufferObj._pgConvertFn = ds._setColInfoFromSSVLines(bufferObj._colLines, bufferObj._useclientlayout);
                        }

                        ds._loadFromSSVArray(bufferObj._colLines, lines, 0, -1, bufferObj._useclientlayout, false, bufferObj._pgConvertFn);
                        break;

                    /*  deprecated
                    case "PPX": 
                        ds._loadFromPPXArray(bufferObj._colLines, lines, 0, -1, bufferObj._useclientlayout, bufferObj._is_first_load);
                        break;                        
                    */
                    default:
                        break;
                }

                bufferObj._is_first_load = false;

                if (nLoadType == 0 && !bufferObj._isLoadedFirstCount())     // it runs just once if firstcount is bigger than rowcount.
                {
                    bufferObj._is_loaded_firstcount = true;
                }
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

                ds.on_fire_onload(errorcode, errormsg, is_appending ? 12 : nLoadType, (nLoadType == 1) ? true : ((bufferObj._progress_status != 0) ? true : false));//nexacro.Dataset.REASON_LOAD or nexacro.Dataset.REASON_APPEND
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
                {
                    bufferObj._progress_status = 2;
                }
            }
            else if (ds._viewRecords.length > 0)
            {
                ds._p_rowposition = 0;
            }
            ds._bWorkingstatus = false;
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

            ds._dataType = this._data_type;
        };

        _pProgressData._getNextIdx = function (idx)
        {
            var bufferIdx = idx[0];
            var dataIdx = idx[1];
            var bufferlength = this._data_buffer.length;
            var nextIdx = bufferIdx;

            if (!this._data_buffer[nextIdx])
            {
                while (nextIdx < bufferlength)
                {
                    if (this._data_buffer[nextIdx])
                        break;

                    nextIdx++;
                }

                bufferIdx = nextIdx;
            }

            if (this._data_buffer[bufferIdx] && this._data_buffer[bufferIdx].length <= (dataIdx + 1))
            {
                if (this._data_buffer[bufferIdx + 1])
                {
                    bufferIdx += 1;
                    dataIdx = 0;
                }
            }

            return [bufferIdx, dataIdx];
        };

        _pProgressData._getNextRecordPos = function (baseIdx)
        {
            //var buff_len = this._data_buffer.length;
            var rs_len = 0;
            var idx0 = baseIdx[0];
            var idx1 = baseIdx[1];
            var n = -1;

            if (this._data_buffer[idx0])
            {
                if (this._rs instanceof Array)
                {
                    var rss = this._rs;
                    var i;
                    for (i = 0; i < rss.length; i++)
                    {
                        idx0 = baseIdx[0];
                        var rs = rss[i];

                        while (true)
                        {
                            if (!this._data_buffer[idx0])
                                break;

                            n = this._data_buffer[idx0].indexOf(rs, idx1);
                            if (n >= 0 || !this._data_buffer[idx0 + 1]) break;

                            idx0++;
                            idx1 = 0;
                        }

                        if (n >= 0)
                        {
                            rs_len = this._rs[i].length;
                            this._rs = this._rs[i];
                            break;
                        }
                    }
                }
                else
                {
                    while (true)
                    {
                        if (!this._data_buffer[idx0])
                            break;

                        n = this._data_buffer[idx0].indexOf(this._rs, idx1);
                        if (n >= 0 || !this._data_buffer[idx0 + 1]) break;

                        idx0++;
                        idx1 = 0;
                    }
                    rs_len = this._rs.length;
                }
            }

            return [n, idx0, rs_len];
        };

        _pProgressData._getBufferDataByIdx = function (startIdx, endIdx, bBufferClear)
        {
            var data = "";

            if (!startIdx || !endIdx)
                return data;

            if (startIdx[0] < endIdx[0])
            {
                var idx = startIdx[0];
                if (this._data_buffer[idx])
                {
                    data = this._data_buffer[idx].slice(startIdx[1]);

                    if (bBufferClear)
                        this._data_buffer[idx] = null;
                }

                idx++;
                while (true)
                {
                    if (idx < endIdx[0])
                    {
                        if (this._data_buffer[idx])
                        {
                            data += this._data_buffer[idx].slice(0, this._data_buffer[idx].length);
                            if (bBufferClear)
                                this._data_buffer[idx] = null;
                        }
                        idx++;
                    }
                    else
                    {
                        if (this._data_buffer[idx])
                            data += this._data_buffer[idx].slice(0, endIdx[1]);
                        break;
                    }
                }
            }
            else
            {
                if (this._data_buffer[startIdx[0]])
                    data = this._data_buffer[startIdx[0]].slice(startIdx[1], endIdx[1]);
            }

            return data;

        };

        _pProgressData._getBufferData = function (bufferObj, nLoadType, bClear)
        {
            var data = "";
            var start_idx = [];
            var end_idx = [];

            if (!bufferObj._next_load_idx)
            {
                bufferObj._next_load_idx = bufferObj._row_start_idx;
            }

            var next_load_idx = bufferObj._next_load_idx;
            if (!next_load_idx || next_load_idx.length == 0 || next_load_idx[0] < 0 || next_load_idx[1] < 0)
                return data;

            start_idx[0] = next_load_idx[0];
            start_idx[1] = next_load_idx[1];

            end_idx[0] = start_idx[0] + 1;
            end_idx[1] = 0;

            if (bufferObj._row_end_idx && (bufferObj._row_end_idx[0] <= end_idx[0]))
            {
                end_idx = bufferObj._row_end_idx;
                bufferObj._next_load_idx = [-1, -1];
            }
            else
            {
                var nrp = this._getNextRecordPos(end_idx);
                if (nrp[0] < 0)
                {
                    end_idx[0] = start_idx[0];
                    end_idx[1] = this._data_buffer[start_idx[0]].length;
                }
                else
                {
                    end_idx[0] = nrp[1];
                    end_idx[1] = nrp[0];
                }

                bufferObj._next_load_idx = this._getNextIdx([end_idx[0], end_idx[1] + nrp[2]]);
            }

            return this._getBufferDataByIdx(start_idx, end_idx, bClear);
        };

        _pProgressData._getNextDatasetPos = function (baseIdx)
        {
            var idx = baseIdx;
            var regexp = new RegExp(this._rs + "dataset", "gi");
            var n = -1;
            if (this._data_buffer[idx[0]])
            {
                if (this._data_buffer[idx[0] - 1] && idx[1] == 0)
                {
                    idx[1] = this._data_buffer[idx[0] - 1].length - this._rs.length;
                    idx[0] = idx[0] - 1;
                }

                while (true)
                {
                    if (this._data_buffer[idx[0]].length == idx[1])
                    {
                        idx[1] -= this._rs.length;
                    }

                    var buff = this._data_buffer[idx[0]].slice(idx[1], this._data_buffer[idx[0]].length);
                    if (this._data_buffer[idx[0] + 1])
                    {
                        buff += this._data_buffer[idx[0] + 1].slice(0, 7);
                    }

                    n = buff.search(regexp);

                    if (n >= 0)
                    {
                        if (baseIdx[0] == idx[0])
                            n += baseIdx[1];

                        break;
                    }
                    if (!this._data_buffer[idx[0] + 1])
                    {
                        break;
                    }

                    idx[0]++;
                    idx[1] = 0;
                }
            }

            return [n, idx[0], this._rs.length];
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

        _pProgressDataCSV._setNextParseMode = function ()
        {
            var sec_type_max_len = 10;
            var sec = "";
            if (this._data_buffer[this._cur_idx[0]])
                sec = this._data_buffer[this._cur_idx[0]].substr(this._cur_idx[1], sec_type_max_len);

            if (!sec)
            {
                if (!this._data_buffer[this._cur_idx[0] + 1])
                    return false;

                sec += this._data_buffer[this._cur_idx[0] + 1].substr(0, sec_type_max_len);
            }

            sec = sec.toUpperCase();

            if (this._parse_mode == 0)
            {
                this._parse_mode = 1;   //header
            }
            else if (sec.indexOf("DATASET") == 0)
            {
                this._parse_mode = 3;
            }
            else
            {
                var ndp, n, next_buffer_idx, rs_len, dataIdx;
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
                        ndp = this._getNextDatasetPos(this._cur_idx);
                        n = ndp[0];
                        next_buffer_idx = ndp[1];
                        rs_len = ndp[2];

                        var bufferObj_arr = this._datasets[this._cur_dataset_id];
                        if (bufferObj_arr)
                        {
                            for (var i = 0; i < bufferObj_arr.length; i++)
                            {
                                var bufferObj = bufferObj_arr[i];
                                if (!bufferObj._use_firefirstcount || bufferObj._isLoadedFirstCount())
                                {
                                    if (n >= 0)
                                    {
                                        dataIdx = n + rs_len;
                                        bufferObj._row_end_idx = [next_buffer_idx, n];
                                        this._parse_mode = 10;
                                    }
                                    else
                                    {
                                        dataIdx = this._data_buffer[next_buffer_idx].length
                                    }
                                }
                            }
                            this._cur_idx = this._getNextIdx([next_buffer_idx, dataIdx]);
                        }
                        break;
                    case 9: //skip
                        ndp = this._getNextDatasetPos(this._cur_idx);
                        n = ndp[0];
                        next_buffer_idx = ndp[1];
                        rs_len = ndp[2];
                        if (n >= 0)
                        {
                            this._cur_idx = this._getNextIdx([next_buffer_idx, n + rs_len]);
                            this._parse_mode = 3;
                        }
                        else
                        {
                            this._cur_idx = this._getNextIdx([next_buffer_idx, this._data_buffer[next_buffer_idx].length]);
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

        _pProgressDataSSV._setNextParseMode = function ()
        {
            var sec_type_max_len = 10;
            var sec = "";
            if (this._data_buffer[this._cur_idx[0]])
                sec = this._data_buffer[this._cur_idx[0]].substr(this._cur_idx[1], sec_type_max_len);

            if (!sec)
            {
                if (!this._data_buffer[this._cur_idx[0] + 1])
                    return false;

                sec += this._data_buffer[this._cur_idx[0] + 1].substr(0, sec_type_max_len);
            }

            sec = sec.toUpperCase();

            if (this._parse_mode == 0)
            {
                this._parse_mode = 1;   //header
            }
            else if (sec.indexOf("DATASET") == 0)
            {
                this._parse_mode = 3;
            }
            else if (sec.indexOf("JSONOBJECT") == 0)
            {
                this._parse_mode = 7;
            }
            else
            {
                var ndp, n, next_buffer_idx, rs_len, dataIdx;
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
                        if (sec.indexOf("_CONST_") == 0)
                            this._parse_mode = 4;
                        else
                            this._parse_mode = 5;
                        break;
                    case 4://constcolinfo
                        this._parse_mode = 5;
                        if (sec.indexOf("_ROWTYPE_") != 0)
                            this._parse_mode = 6;
                        break;
                    case 5://collinfo
                        this._parse_mode = 6;
                        if (sec.indexOf("_CONST_") == 0)
                            this._parse_mode = 4;
                        break;
                    case 6://record
                        ndp = this._getNextDatasetPos(this._cur_idx);
                        n = ndp[0];
                        next_buffer_idx = ndp[1];
                        rs_len = ndp[2];

                        var bufferObj_arr = this._datasets[this._cur_dataset_id];
                        if (bufferObj_arr)
                        {
                            for (var i = 0; i < bufferObj_arr.length; i++)
                            {
                                var bufferObj = bufferObj_arr[i];
                                if (!bufferObj._use_firefirstcount || bufferObj._isLoadedFirstCount())
                                {
                                    if (n >= 0)
                                    {
                                        dataIdx = n + rs_len;
                                        bufferObj._row_end_idx = [next_buffer_idx, n];
                                        this._parse_mode = 10;
                                    }
                                    else
                                    {
                                        dataIdx = this._data_buffer[next_buffer_idx].length
                                    }
                                }
                            }
                            this._cur_idx = this._getNextIdx([next_buffer_idx, dataIdx]);
                        }
                        break;
                    case 7://JSON_id
                        this._parse_mode = 8;
                        break;
                    case 8://JSON_string
                        break;
                    case 9:
                        ndp = this._getNextDatasetPos(this._cur_idx);
                        n = ndp[0];
                        next_buffer_idx = ndp[1];
                        rs_len = ndp[2];
                        if (n >= 0)
                        {
                            this._cur_idx = this._getNextIdx([next_buffer_idx, n + rs_len]);
                            this._parse_mode = 3;
                        }
                        else
                        {
                            this._cur_idx = this._getNextIdx([next_buffer_idx, this._data_buffer[next_buffer_idx].length]);
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

            /*sonarQube 정적분석에 걸려 주석처리후 아래의 소스코드 적용*/
            if (colLine.substring(0, 7) == "_Const_")
            {
                target_ds.__ssvSetConstColInfo(colLine);
            }

            /*
            if (bOrgLayout)
            {
                if (colLine.substring(0, 7) == "_Const_")
                {
                    target_ds.__ssvSetConstColInfo(colLine);
                }
            }
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
        // nexacro._ProgressDataPPX
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

        _pProgressDataPPX._setNextParseMode = function ()
        {
            var sec_type_max_len = 10;
            var sec = "";
            if (this._data_buffer[this._cur_idx[0]])
                sec = this._data_buffer[this._cur_idx[0]].substr(this._cur_idx[1], sec_type_max_len);

            //              if (sec.length < sec_type_max_len)
            // 	        {
            // 	            if (!this._data_buffer[this._cur_idx[0] + 1])
            // 	                return false;
            // 
            // 	            sec += this._data_buffer[this._cur_idx[0] + 1].substr(0, sec_type_max_len - sec.length);
            // 	            if (sec.length < sec_type_max_len)
            // 	                return false;
            // 	        }
            sec = sec.toUpperCase();

            if (this._parse_mode == 0)
            {
                this._parse_mode = 1;   //header
            }
            else if (sec.charAt(0) == "D")
            {
                this._parse_mode = 3;   //Dataset
            }
            else
            {
                var ndp, n, next_buffer_idx, rs_len;
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
                        if (sec.charAt(this._cur_idx) == "V")
                            this._parse_mode = 4;
                        else if (sec.charAt(this._cur_idx) == "C")
                            this._parse_mode = 5;
                        else
                            this._parse_mode = 6;
                        break;
                    case 6://record
                        var buffer_obj = this._datasets[this._cur_dataset_id];
                        if (!buffer_obj._use_firefirstcount || buffer_obj._isLoadedFirstCount())
                        {
                            ndp = this._getNextDatasetPos(this._cur_idx);
                            n = ndp[0];
                            next_buffer_idx = ndp[1];
                            rs_len = ndp[2];

                            if (n >= 0)
                            {
                                buffer_obj._row_end_idx = [next_buffer_idx, n];
                                this._cur_idx = this._getNextIdx([next_buffer_idx, n + rs_len]);
                                this._parse_mode = 10;      // fire onload
                            }
                            else
                            {
                                this._cur_idx = this._getNextIdx([next_buffer_idx, this._data_buffer[next_buffer_idx].length]);
                                //return false;
                            }
                        }
                        break;
                    case 9:
                        ndp = this._getNextDatasetPos(this._cur_idx);
                        n = ndp[0];
                        next_buffer_idx = ndp[1];
                        rs_len = ndp[2];

                        if (n >= 0)
                        {
                            this._cur_idx = this._getNextIdx([next_buffer_idx, n + rs_len]);
                            this._parse_mode = 3;
                        }
                        else
                        {
                            this._cur_idx = this._getNextIdx([next_buffer_idx, this._data_buffer[next_buffer_idx].length]);
                            return false;
                        }
                        break;
                    default:
                        return false;

                }
            }

            return true;
        };

        _pProgressDataPPX._getNextDatasetPos = function (baseIdx)
        {
            var idx = baseIdx;
            var regexp = new RegExp(this._rs + "D", "gi");
            var n = -1;

            if (this._data_buffer[idx[0]])
            {
                if (this._data_buffer[idx[0] - 1] && idx[1] == 0)
                {
                    idx[1] = this._data_buffer[idx[0] - 1].length - this._rs.length;
                    idx[0] = idx[0] - 1;
                }

                while (true)
                {
                    // var len = this._data_buffer[idx[0]].length;
                    if (this._data_buffer[idx[0]].length == idx[1])
                        idx[1] -= this._rs.length;

                    var buff = this._data_buffer[idx[0]].slice(idx[1], this._data_buffer[idx[0]].length);
                    if (this._data_buffer[idx[0] + 1])
                        buff += this._data_buffer[idx[0] + 1].slice(0, 3);

                    n = buff.search(regexp);

                    if (n >= 0)
                    {
                        if (baseIdx[0] == idx[0])
                            n += baseIdx[1];
                        break;
                    }
                    if (!this._data_buffer[idx[0] + 1])
                    {
                        break;
                    }

                    idx[0]++;
                    idx[1] = 0;
                }
            }

            return [n, idx[0], this._rs.length];
        };

        _pProgressDataPPX._parseParameters = function ()
        {
            var line = "";
            var nrp = this._getNextRecordPos(this._cur_idx);

            var n = nrp[0];
            var next_buffer_idx = nrp[1];
            var rs_len = nrp[2];

            if (n >= 0)
            {
                if (this._cur_idx[0] != next_buffer_idx)
                {
                    var buff = this._data_buffer[this._cur_idx[0]];
                    line = buff.substring(this._cur_idx[1], buff.length);

                    for (var i = this._cur_idx[0] + 1; i <= next_buffer_idx; i++)
                    {

                        buff = this._data_buffer[i];
                        if (i == next_buffer_idx)
                            line += buff.substring(i, n);
                        else
                            line += buff.substring(i, buff.length);
                    }
                }
                else
                    line = this._data_buffer[this._cur_idx[0]].substring(this._cur_idx[1], n);

            }
            else
                return false;

            this._cur_idx = this._getNextIdx([next_buffer_idx, n + rs_len]);

            var form = this._parent.context;
            var param_arr = line.split(this._cs);
            var id = param_arr[1];
            var val = param_arr[2];
            if (val == String.fromCharCode(3))
                val = undefined;

            if (id == "ErrorCode")
            {
                var code = parseInt(val) | 0;
                if (isFinite(code) == false)
                {
                    code = -1;
                }

                val = code;
                this._error_info[0] = val;

                this._parsed_errorcd = true;

            }
            else if (id == "ErrorMsg")
            {
                this._error_info[1] = param_arr[2];
            }
            else if (id in form)    //1.form(application) variable 
            {
                if (nexacro._isNull(form[id]) || !nexacro._isObject(form[id]))
                {
                    form[id] = val;
                }
            }
            else //application globalvariable
            {
                var app = nexacro.getApplication();
                if (app && app._existVariable(id))
                {
                    app[id] = val;
                }
                else
                {
                    var hasvariable = nexacro._hasEnvironmentVariable(id);
                    if (hasvariable)
                        nexacro.setEnvironmentVariable(id, val);
                }
            }

            this._parameters[this._parameters.length] = { id: id, value: val };

            return true;
        };

        _pProgressDataPPX._parseDataset = function ()
        {
            var line = "";
            var nrp = this._getNextRecordPos(this._cur_idx);

            var n = nrp[0];
            var next_buffer_idx = nrp[1];
            var rs_len = nrp[2];

            if (n >= 0)
            {
                line = this._getBufferDataByIdx(this._cur_idx, [next_buffer_idx, n]);
            }
            else
                return false;

            if (this._cur_dataset_id)
            {
                var cur_buffer_obj = this._datasets[this._cur_dataset_id];
                cur_buffer_obj._row_end_idx = this._cur_idx;
            }

            var remoteId = line.split(this._cs)[1];
            if (remoteId && remoteId.length)
            {
                var buffer_obj = this._datasets[remoteId];
                if (buffer_obj)
                {
                    buffer_obj._isEnable = true;
                    this._cur_dataset_id = remoteId;

                    this._datasets_in_seq[this._datasets_in_seq.length] = remoteId;
                    buffer_obj._ds_start_idx = new Array(this._cur_idx[0], this._cur_idx[1]);
                    buffer_obj._ds_end_idx = new Array(this._cur_idx[0], this._cur_idx[1] + n);
                }
                else
                {
                    this._cur_dataset_id = "";
                    this._parse_mode = 9;
                }
            }
            //else skip

            this._cur_idx = this._getNextIdx([next_buffer_idx, n + rs_len]);

            return true;
        };

        _pProgressDataPPX = null;

        //==============================================================================
        // Serialize Utils
        //==============================================================================
        nexacro._decorateString = function (str)
        {
            var strtemp = str;

            if ((strtemp.indexOf('&lt;') >= 0 && strtemp.indexOf('&gt;') >= 0) || (strtemp.indexOf("<") >= 0 && strtemp.indexOf(">") >= 0)) 
            {
                strtemp = strtemp.replace(/\&lt;/g, "<").replace(/\&gt;/g, ">");
                //font face 처리
                strtemp = strtemp.replace(/<\/?ff\s+[v]\s*=/g, "<font face =").replace(/ff\s*>/g, "font>");
                //font size 처리
                strtemp = strtemp.replace(/<\/?fs\s+[v]\s*=/gi, "<font size =").replace(/fs\s*>/g, "font>");
                //font color 처리
                strtemp = strtemp.replace(/<\/?fc\s+[v]\s*=/g, "<font color =").replace(/fc\s*>/g, "font>");
                // bold 처리
                strtemp = strtemp.replace(/<\/?b\s+[v].*?>/g, "<b>");
                //italic 처리
                strtemp = strtemp.replace(/<\/?i\s+[v].*?>/g, "<i>");
                // underline 처리
                strtemp = strtemp.replace(/<\/?u\s+[v].*?>/g, "<u>");
                // 취소 처리
                strtemp = strtemp.replace(/<\/?s\s+[v].*?>/g, "<s>");
                // link 처리
                strtemp = strtemp.replace(/<\/?l\s+[v].*?>/g, "<s>");

                if (strtemp.indexOf("\"") || strtemp.indexOf("\'")) 
                {
                    strtemp = nexacro._replaceAll(strtemp, "\"", "");
                    strtemp = nexacro._replaceAll(strtemp, "\'", "");
                }
            }
            return strtemp;
        };

        nexacro._quoteStr = function (str)
        {
            if (/[\r\n\"\t]/.test(str))
            {
                return nexacro.__quoteStr(str);
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
            else if (str.indexOf("\\") > -1)
            {
                return nexacro.__unquoteStr(str);
            }
            else
            {
                return str.substring(1, str.length - 1);
            }
        };

        //==============================================================================
        // Screen & Element Position APIs
        //==============================================================================
        nexacro._getElementXYInWindow = function (handle) // runtime node -> elementhandle
        {
            if (handle)
            {
                return nexacro.__getElementXYInWindow(handle);
            }
            return [0, 0];
        };

        nexacro._getDevicePixelRatio = function (elem)
        {
            var wheelZoom = 1;
            var _window;
            var app;
            var form;
            if (elem && elem.handle)
            {
                var comp = elem.linkedcontrol || elem._p_parent.linkedcontrol;
                if (comp)
                {
                    _window = comp._getWindow();

                    wheelZoom = (_window && (_window._wheelZoom != undefined)) ? _window._wheelZoom / 100 : 1.0;
                }
                else
                {
                    app = nexacro.getApplication();
                    if (app)
                    {
                        form = app.getActiveForm();
                        if (!form)
                        {
                            _window = app._p_mainframe._window;

                            wheelZoom = (_window && (_window._wheelZoom != undefined)) ? _window._wheelZoom / 100 : 1.0;

                        }
                        else
                        {
                            _window = form._getWindow();

                            wheelZoom = (_window && (_window._wheelZoom != undefined)) ? _window._wheelZoom / 100 : 1.0;

                        }

                    }
                }
            }

            return wheelZoom;
        };

        nexacro._getElementPositionInFrame = function (elem, bUpdate)
        {
            if (elem && elem.handle)
            {
                var pt = nexacro.__getElementPositionInFrame(elem.handle, bUpdate);
                if (elem._isRtl(this))
                {
                    var comp = elem.linkedcontrol || elem._p_parent.linkedcontrol;
                    var win = comp._getWindow();

                    pt[0] = win.getClientWidth() - pt[0] - comp.getPixelWidth();
                }
                return { x: pt[0], y: pt[1] };
            }
            return { x: 0, y: 0 };
        };

        nexacro._getPopupElementPositionInFrame = function (elem, left, top, width, height, bUpdate)
        {
            if (elem && elem.handle)
            {
                var pt = nexacro.__getPopupElementPositionInFrame(elem.handle, bUpdate);
                if (elem._isRtl(this))
                {
                    var comp = elem.linkedcontrol || elem._p_parent.linkedcontrol;
                    var win = comp._getWindow();

                    pt[0] = win.getClientWidth() - pt[0] - comp.getPixelWidth();
                }
                return { x: pt[0] + left, y: pt[1] + top };
            }
            return { x: left, y: top };
        };

        nexacro.__getHTMLNodePositionInFrame = nexacro._emptyFn;

        nexacro._getElementScreenPosition = function (elem)
        {
            if (elem && elem.handle)
            {
                var pt = nexacro.__getElementScreenPosition(elem.handle);
                var comp = elem.linkedcontrol || elem._p_parent.linkedcontrol;
                if (!(comp instanceof nexacro.MainFrame))
                {
                    pt[0] = Math.round(pt[0] * nexacro._getDevicePixelRatio(elem));
                    pt[1] = Math.round(pt[1] * nexacro._getDevicePixelRatio(elem));
                }



                return { x: pt[0], y: pt[1] };
            }
            return { x: 0, y: 0 };
        };

        nexacro.__getHTMLElementPosition = nexacro._emptyFn;
        nexacro.__getHTMLPageSize = nexacro._emptyFn;

        //==============================================================================
        // System Event Handling API
        //==============================================================================

        nexacro.__findParentElement = nexacro._emptyFn;
        nexacro.__findParentElementForKeyEvent = nexacro._emptyFn;
        nexacro.__getWheelDelta = nexacro._emptyFn;
        nexacro._getSysEventElement = nexacro._emptyFn;
        nexacro._getSysEventKey = nexacro._emptyFn;
        nexacro._getSysEventKeyCode = nexacro._emptyFn;
        nexacro._getSysEventX = nexacro._emptyFn;
        nexacro._getSysEventY = nexacro._emptyFn;
        nexacro._getSysEventBtnCode = nexacro._emptyFn;
        nexacro._getSysEventBtnString = nexacro._emptyFn;
        nexacro._stopSysEvent = nexacro._emptyFn;

        //==============================================================================
        // event
        nexacro._observeSysEvent = function (handle, name, onname, callback)
        {
            return nexacro.__observeSysEvent(handle, name, onname, callback);
        };
        nexacro._stopSysObserving = function (handle, name, onname, callback)
        {
            return nexacro.__stopSysObserving(handle, name, onname, callback);
        };
        nexacro._observeInputEvent = function (handle, name, onname, callback)
        {
            return nexacro.__observeInputEvent(handle, name, onname, callback);
        };
        nexacro._stopInputObserving = function (handle, name, onname, callback)
        {
            return nexacro.__stopInputObserving(handle, name, onname, callback);
        };
        nexacro._observeWrapperEvent = function (handle, name, onname, callback, frmidx, compid)
        {
            return nexacro.__observeWrapperEvent(handle, name, onname, callback, frmidx, compid);
        };
        nexacro._stopWrapperObserving = function (handle, name, onname, callback)
        {
            return nexacro.__stopWrapperObserving(handle, name, onname, callback);
        };

        nexacro._observeGlobalEvent = function (handle, name, onname, callback)
        {
            return nexacro.__observeGlobalEvent(handle, name, onname, callback);
        };
        nexacro._stopGlobalEvent = function (handle, name, onname, callback)
        {
            return nexacro.__stopGlobalEvent(handle, name, onname, callback);
        };


        nexacro._observeEvent = nexacro._observeSysEvent;
        nexacro._stopObserving = nexacro._stopSysObserving;

        nexacro.__refreshDirtyWindow = function (_win_handle)
        {
            var win_handle = _win_handle;
            if (!win_handle)
            {
                win_handle = nexacro._getMainWindowHandle();
            }
            nexacro.__refreshDirtyRect(win_handle);
        };

        nexacro._refreshWindowRegion = function (_win_handle, _elem_handle)
        {
            nexacro.__refreshWindowRegion(_win_handle, _elem_handle);
        };

        //Object.defineProperty(nexacro, "__refreshDirtyWindow", {"writable": false, "enumerable": false});    


        //==============================================================================
        // for CSS object Control for Web Browser
        //==============================================================================
        // color table
        nexacro._xreNamedColorList =
        {
            "": "",
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

        nexacro._getWebColorFromXreColor = function (color)
        {
            color = color.toLowerCase();
            var v = nexacro._xreNamedColorList[color];
            if (v) 
            {
                color = v;
            }

            var len = color.length;
            if (len > 0)
            {
                if (color.charAt(0) == '#')
                {
                    if (len == 7) 
                    { // "#00ff00"
                        color += "FF";
                    }
                    return parseInt(color.substring(1), 16);
                }
                else
                {
                    return parseInt(color, 16);
                }
            }
            return 0;
        };

        nexacro._getXreColorAlpha = function (/*color*/)
        {
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

            color = color.toLowerCase();
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
        nexacro._getOpacityFilterFromXreColor = nexacro._emptyFn;

        //==============================================================================
        // for CSS Gradation for Web Browser
        //==============================================================================

        nexacro._makeGradationSysValue = function (cssobj)
        {
            if (cssobj.style == "linear" && (cssobj.start_color || cssobj.end_color))
            {
                cssobj._start_syscolor = nexacro._getWebColorFromXreColor(cssobj.start_color);
                cssobj._end_syscolor = nexacro._getWebColorFromXreColor(cssobj.end_color);

                if (cssobj.peglist.length) 
                {
                    var peglist = [];
                    var arr = cssobj._parsePegList(cssobj.peglist);
                    var len = arr.length;
                    var valarr;
                    for (var i = 0; i < len; i++) 
                    {
                        valarr = arr[i];
                        peglist.push(valarr[0]);
                        peglist.push(nexacro._getWebColorFromXreColor(valarr[1]));
                    }
                    cssobj._sysvalue = peglist;
                }
            }
            else 
            {
                cssobj._sysvalue = [];
            }
        };



        //==============================================================================
        // Timer
        nexacro._setSystemTimer = function (_win_handle, timerfn, interval)
        {
            return nexacro.__setSystemTimer(_win_handle, timerfn, interval);
        };
        nexacro._clearSystemTimer = function (_win_handle, timer_handle)
        {
            return nexacro.__clearSystemTimer(_win_handle, timer_handle);
        };

        nexacro._getProjectBaseURL = function (url)
        {
            var location = url;
            return location.substring(0, location.lastIndexOf("/") + 1);
        };

        //==============================================================================
        // check license
        nexacro._checkLicense = function (licenseurl, xadl)
        {
            return nexacro.__checkLicense(licenseurl, xadl);
        };

        nexacro._initInformation = nexacro._emptyFn;
        nexacro._checkInformation = nexacro._emptyFn;

        //==============================================================================
        // update
        nexacro._updateEngine = function (key, url, version)
        {
            return nexacro.__updateEngine(key, url, version);
        };

        nexacro._addUpdateResoruce = function (type, updateurl, file, targetpath, ref, version, desc, failpass)
        {
            return nexacro.__addUpdateResource(type, updateurl, file, targetpath, ref, version, desc, failpass);
        };

        nexacro._updateResource = function ()
        {
            return nexacro.__updateResource();
        };

        //==============================================================================
        // active & focus
        nexacro._checkActiveElement = function (element)
        {
            var handle = element.handle;
            if (!handle) return false;
            return nexacro.__checkActiveElement(handle);
        };


        nexacro._loadImageBase64 = function (/*source, target, handler*/)
        {

        };

        //==============================================================================
        // createNodeByType


        nexacro._convertRealPath = function (path)
        {
            return nexacro.__convertRealPath(path);
        };

        nexacro._execBrowser = function (url)
        {
            return nexacro.__execBrowser(url);
        };

        nexacro._execDefaultBrowser = function (url, newwindow)
        {
            var new_win = nexacro._toBoolean(newwindow);
            return nexacro.__execDefaultBrowser(url, new_win);
        };

        nexacro._execShell = function (exeUrl)
        {
            return nexacro.__execShell(exeUrl);
        };

        nexacro._execNexacro = function (command)
        {
            return nexacro.__execNexacro(command);
        };

        nexacro._setClipboard = function (format, data)
        {
            return nexacro.__setClipboard(format, data);
        };

        nexacro._getClipboard = function (format)
        {
            return nexacro.__getClipboard(format);
        };

        nexacro._clearClipboard = function ()
        {
            return nexacro.__clearClipboard();
        };

        nexacro._getScreenWidth = function (monitor_index)
        {
            return nexacro.__getScreenWidth(monitor_index);
        };

        nexacro._getScreenHeight = function (monitor_index)
        {
            return nexacro.__getScreenHeight(monitor_index);
        };

        nexacro._getScreenAvailWidth = function (monitor_index)
        {
            return nexacro.__getScreenAvailWidth(monitor_index);
        };

        nexacro._getScreenAvailHeight = function (monitor_index)
        {
            return nexacro.__getScreenAvailHeight(monitor_index);
        };

        nexacro._getScreenRect = function (monitor_index)
        {
            var rect = nexacro.__getScreenRect(monitor_index);
            return new nexacro.Rect(rect[0], rect[1], rect[2], rect[3]);
        };

        nexacro._isPrimaryMonitor = function (monitor_index)
        {
            if (monitor_index)
            {
                return nexacro.__isPrimaryMonitor(monitor_index);
            }
            return null;
        };

        nexacro._getMonitorIndex = function (cursorX, cursorY)
        {
            return nexacro.__getMonitorIndex(cursorX, cursorY);
        };

        nexacro._getTaskbarSize = function ()
        {
            return nexacro.__getTaskbarSize();
        };

        nexacro._getComputerName = function ()
        {
            return nexacro.__getComputerName();
        };

        nexacro._getCPUArchitecture = function ()
        {
            return nexacro.__getCPUArchitecture();
        };

        nexacro._getCPUCount = function ()
        {
            return nexacro.__getCPUCount();
        };

        nexacro._getCPUType = function ()
        {
            return nexacro.__getCPUType();
        };

        nexacro._getLocale = function ()
        {
            return nexacro._BrowserLang;
        };
        nexacro._getLanguage = function ()
        {
            var arr = nexacro._BrowserLang.split('_');    // ko_KR
            return arr ? arr[0] : 'en';
        };

        nexacro._getLoginUser = function ()
        {
            return nexacro.__getLoginUser();
        };

        nexacro._getMobileOrientation = function ()
        {
            return nexacro.__getMobileOrientation();
        };

        nexacro._getMobilePhoneNumber = function ()
        {
            return nexacro.__getMobilePhoneNumber();
        };

        nexacro._getMobileProductType = function ()
        {
            return nexacro.__getMobileProductType();
        };

        nexacro._getMobileUniqueID = function ()
        {
            return nexacro.__getMobileUniqueID();
        };

        nexacro._getMonitorCount = function ()
        {
            return nexacro.__getMonitorCount();
        };

        nexacro._getNavigatorName = function ()
        {
            return nexacro.__getNavigatorName();
        };

        nexacro._getNavigatorFullName = function ()
        {
            return nexacro.__getNavigatorFullName();
        };

        //추후삭제
        /*
        nexacro._getCurrentScreenID = function ()
        {
            if (_application._curscreen)
                return _application._curscreen.name;

            return nexacro.__getCurrentScreenID();
        };
        */

        nexacro._getCursorX = function ()
        {
            return nexacro.__getCursorX();
        };

        nexacro._getCursorY = function ()
        {
            return nexacro.__getCursorY();
        };

        nexacro._checkDevicePermission = function (permission_types, description)
        {
            return nexacro.__checkDevicePermission(permission_types);
        };

        nexacro._requestDevicePermission = function (permission_types, description)
        {
            return nexacro.__requestDevicePermission(permission_types, description);
        };

        nexacro._getCompOffsetSize = function (comp)
        {
            // TODO check
            // 런타임버젼 콤보가 나오지 않는 문제로 HTML5버젼 코드를 가져옴. 동작이 맞는지 확인필요
            var elem = comp._control_element;
            var offs = {};
            if (!comp || !comp._control_element)
            {
                offs.width = 0;
                offs.height = 0;
            }
            else
            {
                var w = comp._getWindow();
                offs.width = w.getWidth() - parseInt(elem.left) | 0;
                offs.height = w.getHeight() - ((parseInt(elem.top) | 0) + (parseInt(elem.height) | 0));
            }
            return offs;
        };

        nexacro._notifyAccessibilityValue = nexacro._emptyFn;

        if (!nexacro._isDesktop() && nexacro._OS == "Android" && nexacro._Browser == "Runtime")
        {
            nexacro.__openSystemCalendar = function (calendar, value, callbackFn)
            {
                nexacro.__showAndroidCalendar(calendar, value, callbackFn);
            };

            nexacro.__closeSystemCalendar = function ()
            {
                nexacro.__dismissAndroidCalendar();
            };

            nexacro._deactivate = false;
            nexacro.__isDeactivate = function ()
            {
                return nexacro._deactivate;
            };

            nexacro.__setDeactivate = function (deactivate)
            {
                nexacro._deactivate = deactivate == -1 ? true : false;
            };
        }
        else
        {
            nexacro.__openSystemCalendar = nexacro._emptyFn;
            nexacro.__closeSystemCalendar = nexacro._emptyFn;
            nexacro.__isDeactivate = nexacro._emptyFn;
            nexacro.__setDeactivate = nexacro._emptyFn;
        }

        //==============================================================================
        // Initialize DOM
        (function ()
        {
            if (nexacro.XmlNode)
                return;

            //==============================================================================
            // DOM
            //==============================================================================
            // XML Parse
            //==============================================================================
            nexacro._getXmlDom = nexacro._emptyFn;
            nexacro._getXmlParser = nexacro._emptyFn;

            nexacro._parseXMLDocument = function (str, keepIgnoreWhitespace)
            {
                var handle = nexacro.__parseXMLDocument(str, keepIgnoreWhitespace);
                var xmldoc = new nexacro.XmlDocument();
                xmldoc.handle = handle;

                return xmldoc;
            };
            nexacro._documentToXml = function (xmldoc)
            {
                if (xmldoc)
                {
                    return nexacro.__documentToXml(xmldoc.handle);
                }
                return "";
            };

            nexacro._getParserError = function (/* nothing */) // global error.
            {
                var line, column, msg = "", desc = "";
                var error = nexacro.__getLastXmlError();
                if (error)
                {
                    line = error.line;
                    column = error.column;
                    msg = error.message;
                    return { "line": line, "column": column, "message": msg, "desc": desc };
                }
                return null;
            };

            const createNodeObjectByType = function (doc, type)
            {
                switch (type)
                {
                    case 1: // Element
                        return new nexacro.XmlElement(doc);
                    case 2: // Attribute
                        return new nexacro.XmlAttribute(doc);
                    case 3: // Text
                        return new nexacro.XmlText(doc);
                    case 4: // CDATA
                        return new nexacro.XmlCDATASection(doc);
                    case 5: // Entity Reference
                    case 6: // Entity
                    case 7: // Processing Instruction
                    case 11: // Document Fragment
                    case 12: // Notation
                        {
                            var node = new nexacro.XmlNode(doc);
                            node._node_type = type;
                            return node;
                        }
                    case 8: // Comment
                        return new nexacro.XmlComment(doc);
                    case 9: // Document
                        return new nexacro.XmlDocument();
                    case 10: // Document Type
                        return new nexacro.XmlDocumentType(doc);
                }
                return null;
            };


            //==============================================================================
            // DOMException
            class DOMException extends Error
            {
                static get INDEX_SIZE_ERR() { return 1; }
                static get DOMSTRING_SIZE_ERR() { return 2; }
                static get HIERARCHY_REQUEST_ERR() { return 3; }
                static get WRONG_DOCUMENT_ERR() { return 4; }
                static get INVALID_CHARACTER_ERR() { return 5; }
                static get NO_DATA_ALLOWED_ERR() { return 6; }
                static get NO_MODIFICATION_ALLOWED_ERR() { return 7; }
                static get NOT_FOUND_ERR() { return 8; }
                static get NOT_SUPPORTED_ERR() { return 9; }
                static get INUSE_ATTRIBUTE_ERR() { return 10; }
                static get INVALID_STATE_ERR() { return 11; }
                static get SYNTAX_ERR() { return 12; }
                static get INVALID_MODIFICATION_ERR() { return 13; }
                static get NAMESPACE_ERR() { return 14; }
                static get INVALID_ACCESS_ERR() { return 15; }
                static get VALIDATION_ERR() { return 16; }
                static get TYPE_MISMATCH_ERR() { return 17; }
                static get SECURITY_ERR() { return 18; }
                static get NETWORK_ERR() { return 19; }
                static get ABORT_ERR() { return 20; }
                static get URL_MISMATCH_ERR() { return 21; }
                static get QUOTA_EXCEEDED_ERR() { return 22; }
                static get TIMEOUT_ERR() { return 23; }
                static get INVALID_NODE_TYPE_ERR() { return 24; }
                static get DATA_CLONE_ERR() { return 25; }

                constructor(message, name)
                {
                    super(message);
                    this.name = name ? name : "Error";

                    switch (name)
                    {
                        case "IndexSizeError": this.code = 1; break;
                        case "HierarchyRequestError": this.code = 3; break;
                        case "WrongDocumentError": this.code = 4; break;
                        case "InvalidCharacterError": this.code = 5; break;
                        case "NoModificationAllowedError": this.code = 7; break;
                        case "NotSupportedError": this.code = 9; break;
                        case "InUseAttributeError": this.code = 10; break;
                        case "InvalidStateError": this.code = 11; break;
                        case "SyntaxError": this.code = 12; break;
                        case "InvalidModificationError": this.code = 13; break;
                        case "NamespaceError": this.code = 14; break;
                        case "InvalidAccessError": this.code = 15; break;
                        case "TypeMismatchError ": this.code = 17; break;
                        case "SecurityError": this.code = 18; break;
                        case "NetworkError": this.code = 19; break;
                        case "AbortError": this.code = 20; break;
                        case "URLMismatchError": this.code = 21; break;
                        case "QuotaExceededError": this.code = 22; break;
                        case "TimeoutError": this.code = 23; break;
                        case "InvalidNodeTypeError": this.code = 24; break;
                        case "DataCloneError": this.code = 25; break;
                    }
                }
            };

            const getFailMessage = function (fnName, objName)
            {
                return `Failed to execute '${fnName}' on '${objName}'`;
            };

            const assertRequired = function (fnName, requredCnt, inCnt, objName = 'Node')
            {
                if (inCnt < requredCnt)
                {
                    throw new TypeError(`${getFailMessage(fnName, objName)}: ${requredCnt} argument required, but only ${inCnt} present.`);
                }
            };
            const assertType = function (fnName, idx, inParam, expectType, objName = 'Node')
            {
                if (!inParam || !(inParam instanceof expectType))
                {
                    throw new TypeError(`${getFailMessage(fnName, objName)}: parameter ${idx} is not of type '${expectType.prototype._type_name}'.`);
                }
            };
            const assertTypeOrNull = function (fnName, idx, inParam, expectType, objName = 'Node')
            {
                if (inParam && !(inParam instanceof expectType))
                {
                    throw new TypeError(`${getFailMessage(fnName, objName)}: parameter ${idx} is not of type '${expectType.prototype._type_name}'.`);
                }
            };

            const raiseNotFoundChildNodeException = function (fnName, objName = 'Node')
            {
                throw new DOMException(`${getFailMessage(fnName, objName)}: The node is not a child of this node.`, "NotFoundError");
            };
            const raiseUnsupportMethodException = function (fnName, objName = 'Node')
            {
                throw new DOMException(`${getFailMessage(fnName, objName)}: This node type does not support this method.`, "HierarchyRequestError");
            };
            const raiseDisallowInsertException = function (fnName, childNode, parentNode, objName = 'Node')
            {
                throw new DOMException(`${getFailMessage(fnName, objName)}: Nodes of type '${childNode._type_name}' may not be inserted inside nodes of type '${parentNode._type_name}'.`, "HierarchyRequestError");
            };
            const raiseInsertDoctypeBeforeRootException = function (fnName, objName = 'Node')
            {
                throw new DOMException(`${getFailMessage(fnName, objName)}: Can't insert a doctype before the root element.`, "HierarchyRequestError");
            };
            const raiseDisallowMultiDocElementException = function (fnName, objName = 'Node')
            {
                throw new DOMException(`${getFailMessage(fnName, objName)}: Only one element on document allowed.`, "HierarchyRequestError");
            };
            const raiseInsertContainParentException = function (fnName, objName = 'Node')
            {
                throw new DOMException(`${getFailMessage(fnName, objName)}: The new child element contains the parent.`, "HierarchyRequestError");
            };
            const raiseInUseAttributeException = function (fnName, objName = 'Element')
            {
                throw new DOMException(`${getFailMessage(fnName, objName)}: The node provided is an attribute node that is already an attribute of another Element.`, "InUseAttributeError");
            };
            const raiseGreaterThanSizeException = function (fnName, objName = 'Node')
            {
                throw new DOMException(`${getFailMessage(fnName, objName)}: The offset is greater than the node's length.`, "IndexSizeError");
            };
            var xmlNodeMapHelper = {};
            var xmlNodeListHelper = {
                setFromHandleArray: function (node_list, node_hanldes, node_type, doc, parent_node, is_sibling)
                {
                    if (node_list && node_hanldes)
                    {
                        var prev_node = null, cur_node_type = node_type;
                        for (var i = 0, n = node_hanldes.length; i < n; i++)
                        {
                            var node_handle = node_hanldes[i];
                            if (node_type < 1) 
                            {
                                cur_node_type = nexacro.__xmlGetNodeType(node_handle);
                            }
                            var node = createNodeObjectByType(doc, cur_node_type);
                            if (node)
                            {
                                node.handle = node_handle;
                                if (parent_node)
                                {
                                    node._parent_node = parent_node;
                                }
                                if (prev_node)
                                {
                                    prev_node._next_sibling = node;
                                    node._previous_sibling = prev_node;
                                }
                                node_list.push(node);

                                if (is_sibling)
                                    prev_node = node;
                            }
                        }
                    }
                },
                findIndex: function (node_list, item)
                {
                    if (!node_list || !item)
                        return -1;

                    const idx = node_list.findIndex(node => node.isSameNode(item));
                    return idx === undefined ? -1 : idx;
                },
                appendItem: function (node_list, new_item)
                {
                    if (!node_list || !new_item)
                        return 0;

                    var last_node = null;
                    if (node_list.length > 0)
                        last_node = node_list[node_list.length - 1];

                    const cnt = node_list.push(new_item);
                    if (cnt > 1 && last_node)
                    {
                        last_node._next_sibling = new_item;
                        new_item._previous_sibling = last_node;
                    }

                    return node_list.length;
                },
                insertBefore: function (node_list, new_item, ref_item)
                {
                    if (!node_list || !new_item)
                        return 0;

                    if (!ref_item)
                        return xmlNodeListHelper.appendItem(node_list, new_item);

                    var insertAt = xmlNodeListHelper.findIndex(node_list, ref_item);
                    if (insertAt == 0)
                    {
                        node_list.unshift(new_item);
                    }
                    else if (insertAt > 0)
                    {
                        node_list.splice(insertAt, 0, new_item);
                    }
                    else
                    {
                        node_list.push(new_item);
                    }

                    var prev_node = ref_item._previous_sibling;
                    if (prev_node)
                    {
                        prev_node._next_sibling = new_item;
                        new_item._previous_sibling = prev_node;
                    }
                    ref_item._previous_sibling = new_item;
                    new_item._next_sibling = ref_item;

                    return node_list.length;
                },
                insertAfter: function (node_list, new_item, ref_item)
                {
                    if (!node_list || !new_item || !ref_item)
                        return 0;

                    var length = node_list.length;
                    var insertAt = xmlNodeListHelper.findIndex(node_list, ref_item);
                    if (insertAt >= 0 && insertAt < (length - 1))
                    {
                        node_list.splice(insertAt + 1, 0, new_item);
                    }
                    else
                    {
                        node_list.push(new_item);
                    }

                    var next_node = ref_item._next_sibling;
                    if (next_node)
                    {
                        next_node._previous_sibling = new_item;
                        new_item._next_sibling = next_node;
                    }
                    ref_item._next_sibling = new_item;
                    new_item._previous_sibling = ref_item;

                    return node_list.length;
                },
                removeItem: function (node_list, item)
                {
                    if (!node_list || !item)
                        return;

                    var idx = xmlNodeListHelper.findIndex(node_list, item);
                    if (idx > -1)
                    {
                        node_list.splice(idx, 1);
                    }

                    var prev_node = item._previous_sibling;
                    var next_node = item._next_sibling;
                    if (prev_node)
                    {
                        prev_node._next_sibling = next_node;
                    }
                    if (next_node)
                    {
                        next_node._previous_sibling = prev_node;
                    }
                    item._previous_sibling = null;
                    item._next_sibling = null;
                },
                replaceItem: function (node_list, new_item, old_item)
                {
                    if (!node_list || !new_item || !old_item)
                        return;

                    var idx = xmlNodeListHelper.findIndex(node_list, old_item);
                    if (idx > -1)
                    {
                        node_list.splice(idx, 1, new_item);
                    }

                    var prev_node = old_item._previous_sibling;
                    var next_node = old_item._next_sibling;
                    if (prev_node)
                    {
                        prev_node._next_sibling = new_item;
                    }
                    if (next_node)
                    {
                        next_node._previous_sibling = new_item;
                    }
                    new_item._previous_sibling = prev_node;
                    new_item._next_sibling = next_node;
                    old_item._previous_sibling = null;
                    old_item._next_sibling = null;
                },
                setNamespaceChildNodes: function (node)
                {
                    if (node._node_type != 1)
                        return;

                    var node_href = node.namespaceURI;
                    if (node_href)
                    {
                        var node_prefix = node.prefix;

                        xmlNodeListHelper.setNamespaceAtNode(node, node_href, node_prefix);

                        var attributes = node.attributes, attr_node, attr_name, attr_href, attr_prefix;
                        if (attributes)
                        {
                            let cnt = node.attributes.length;
                            for (var i = 0; i < cnt; i++)
                            {
                                attr_node = node.attributes[i];

                                attr_href = attr_node.namespaceURI;
                                if (attr_href)
                                {
                                    attr_prefix = attr_node.prefix;
                                    xmlNodeMapHelper.setNamespaceAtNode(attributes, attr_node, attr_href, attr_prefix);
                                }
                            }
                        }
                    }

                    const childs = node.childNodes;

                    childs.forEach((child) =>
                    {
                        xmlNodeListHelper.setNamespaceChildNodes(child);
                    });
                },
                setNamespaceAtNode: function (node, href, prefix)
                {
                    if (!node || !href) return;

                    var notfound_namespace = false, node_prefix = prefix, new_prefix_localname = '';
                    if (!node_prefix)
                    {
                        if (!(node_prefix = node.lookupPrefix(href)))
                        {
                            var new_prefix_seq = 1;
                            while (1)
                            {
                                if (!node.lookupNamespaceURI("ns" + new_prefix_seq))
                                {
                                    new_prefix_localname = "ns" + new_prefix_seq;
                                    break;
                                }

                                if (new_prefix_seq >= Number.MAX_SAFE_INTEGER)
                                    break;

                                new_prefix_seq++;
                            }

                            if (new_prefix_localname)
                            {
                                notfound_namespace = true;
                            }
                        }
                    }
                    else
                    {
                        if (!node.lookupNamespaceURI(node_prefix))
                        {
                            var node_prefix_by_href = node.lookupPrefix(href);
                            if (!node_prefix_by_href)
                            {
                                notfound_namespace = true;
                                new_prefix_localname = node_prefix;
                            }
                            else
                            {
                                node_prefix = node_prefix_by_href;
                            }
                        }
                    }

                    if (notfound_namespace && new_prefix_localname)
                    {
                        // create new ns
                        // setAttributeNS: xmlns:prefix=uri
                        const qualified_name = "xmlns:" + new_prefix_localname;
                        node.setAttributeNS("http://www.w3.org/2000/xmlns/", qualified_name, href);

                        if (node.lookupNamespaceURI(new_prefix_localname))
                            node_prefix = new_prefix_localname;
                    }

                    if (node_prefix && !nexacro.__xmlGetPrefix(node.handle))
                    {
                        nexacro.__xmlSetNamespace(node.handle, node_prefix, href);
                        node._prefix = prefix;
                    }
                }
            };

            //==============================================================================
            // NodeList
            nexacro.XmlNodeList = (function ()
            {
                var NodeList = function () { };

                // Do not inherit 'Array', the behavior of all unrelated arrays is very slow. (v8 5.x or later, )
                // var _pXmlNodeList = nexacro._createPrototype(Array, nexacro.XmlNodeList);
                var _pXmlNodeList = Object.create(Array.prototype, { constructor: { value: NodeList } });
                NodeList.prototype = _pXmlNodeList;

                // overide nexacro.Object
                _pXmlNodeList._type_name = "NodeList";

                _pXmlNodeList.item = function item(index)
                {
                    if (index > -1 && this.length > index)
                        return this[index];
                    return null;
                };

                return NodeList;
            })();


            //////////////////////////////////////////////////////////////////////////
            xmlNodeMapHelper = {
                setFromHandleMap: function (xmlNamedNodeMap, handle_map, node_type, doc, parent_node) // [[name1, handle1], [], ...., [nameN, handleN]]
                {
                    if (xmlNamedNodeMap && handle_map)
                    {
                        var i, n;
                        if (xmlNamedNodeMap._node_map)
                        {
                            var cnt = xmlNamedNodeMap._node_map.names.length;
                            for (i = 0; i < cnt; i++)
                            {
                                delete xmlNamedNodeMap[i];
                            }
                        }

                        var node_map = xmlNamedNodeMap._node_map = { names: [], nodes: [], namespaces: [] };
                        var hasNamespaceInfo = (handle_map.length > 0 && handle_map[0].length > 2);

                        for (i = 0, n = handle_map.length; i < n; i++)
                        {
                            var node_name = handle_map[i][0];
                            var node_handle = handle_map[i][1];

                            var node_href, node_prefix;
                            if (hasNamespaceInfo)
                            {
                                node_href = handle_map[i][2];
                                node_prefix = handle_map[i][3];
                            }
                            else
                            {
                                node_href = nexacro.__xmlGetNamespaceURI(node_handle);
                                node_prefix = nexacro.__xmlGetPrefix(node_handle);
                            }

                            if (node_type < 1) 
                            {
                                node_type = nexacro.__xmlGetNodeType(node_handle);
                            }
                            var node = createNodeObjectByType(doc, node_type);
                            if (node)
                            {
                                node.handle = node_handle;
                                if (parent_node)
                                {
                                    node._parent_node = parent_node;
                                }

                                node._prefix = node_prefix;
                                node._namespace_uri = node_href;

                                node_map.names.push(node_name);
                                node_map.nodes.push(node);
                                node_map.namespaces.push({ href: node_href || '', prefix: node_prefix || '' });
                                xmlNamedNodeMap[i] = node;
                            }
                        }
                    }
                },
                clear: function (xmlNamedNodeMap)
                {
                    if (xmlNamedNodeMap && xmlNamedNodeMap._node_map)
                    {
                        var cnt = xmlNamedNodeMap._node_map.names.length;
                        for (var i = 0; i < cnt; i++)
                        {
                            delete xmlNamedNodeMap[i];
                        }
                        xmlNamedNodeMap._node_map.names = null;
                        xmlNamedNodeMap._node_map.nodes = null;
                        xmlNamedNodeMap._node_map.namespaces = null;
                    }
                },
                splitName: function (name) 
                {
                    var ns_prefix = '', local_name;
                    const names = name.split(':');
                    if (names.length > 1)
                    {
                        ns_prefix = names[0];
                        local_name = names[1];
                    }
                    else
                    {
                        local_name = names[0];
                    }
                    return [ns_prefix, local_name];
                },
                findNamedItem: function (xmlNamedNodeMap, name)
                {
                    var found = -1;
                    var node_map = xmlNamedNodeMap._node_map;
                    if (node_map)
                    {
                        var ns_prefix, local_name;
                        const names = xmlNodeMapHelper.splitName(name);
                        if (names.length > 1)
                        {
                            ns_prefix = names[0];
                            local_name = names[1];
                        }
                        else
                        {
                            local_name = names[0];
                        }

                        var len = node_map.names.length;
                        for (var i = 0; i < len; i++)
                        {
                            if (node_map.names[i] == local_name && node_map.namespaces[i].prefix == ns_prefix)
                            {
                                found = i;
                                break;
                            }
                        }
                    }

                    return found;
                },
                findNamedItemPrefix: function (xmlNamedNodeMap, prefix, localName)
                {
                    var found = -1;
                    var node_map = xmlNamedNodeMap._node_map;
                    if (node_map)
                    {
                        var len = node_map.names.length;
                        for (var i = 0; i < len; i++)
                        {
                            if (node_map.names[i] == localName && node_map.namespaces[i].prefix == prefix)
                            {
                                found = i;
                                break;
                            }
                        }
                    }

                    return found;
                },
                findNamedItemNS: function (xmlNamedNodeMap, ns, name)
                {
                    var found = -1;
                    var node_map = xmlNamedNodeMap._node_map;
                    if (node_map)
                    {
                        var len = node_map.names.length;
                        for (var i = 0; i < len; i++)
                        {
                            if (node_map.names[i] == name && node_map.namespaces[i].href == ns)
                            {
                                found = i;
                                break;
                            }
                        }
                    }

                    return found;
                },
                removeNamedItem: function (xmlNamedNodeMap, nodename)
                {
                    var node_map = xmlNamedNodeMap._node_map;
                    if (node_map)
                    {
                        var idx = nexacro._indexOf(node_map.names, nodename);
                        var cnt = node_map.nodes.length;
                        if (idx > -1 && idx < cnt)
                        {
                            var remove_node = node_map.nodes[idx];
                            var parent_node = xmlNamedNodeMap._parent_node;
                            if (parent_node)
                            {
                                node_map.names.splice(idx, 1);
                                node_map.nodes.splice(idx, 1);
                                node_map.namespaces.splice(idx, 1);
                                cnt--;

                                for (var i = idx; i < cnt; i++)
                                {
                                    xmlNamedNodeMap[i] = xmlNamedNodeMap[i + 1];
                                }
                                delete xmlNamedNodeMap[i];

                                remove_node._parent_node = null;
                            }
                        }
                    }
                },
                removeItem: function (xmlNamedNodeMap, index)
                {
                    var node_map = xmlNamedNodeMap._node_map;
                    if (node_map)
                    {
                        var cnt = node_map.nodes.length;
                        if (index > -1 && index < cnt)
                        {
                            var remove_node = node_map.nodes[index];
                            node_map.names.splice(index, 1);
                            node_map.nodes.splice(index, 1);
                            node_map.namespaces.splice(index, 1);
                            cnt--;

                            for (var i = index; i < cnt; i++)
                            {
                                xmlNamedNodeMap[i] = xmlNamedNodeMap[i + 1];
                            }
                            delete xmlNamedNodeMap[i];

                            return remove_node;
                        }
                    }
                },
                setNamedItem: function (xmlNamedNodeMap, node)
                {
                    var node_map = xmlNamedNodeMap._node_map;
                    if (node && node_map)
                    {
                        node._parent_node = xmlNamedNodeMap._parent_node;

                        var node_name = node.localName || node.nodeName;
                        var node_href = node.namespaceURI;
                        var node_prefix = node.prefix;

                        var found = -1;
                        var len = node_map.names.length;
                        for (var i = 0; i < len; i++)
                        {
                            if (node_map.names[i] == node_name && node_map.namespaces[i].prefix == node_prefix)
                            {
                                found = i;
                                break;
                            }
                        }

                        if (found > -1)
                        {
                            xmlNamedNodeMap[found] = node;

                            var rep_node = node_map.nodes.splice(found, 1, node)[0];
                            if (rep_node) rep_node._parent_node = null;
                            return rep_node;
                        }

                        var len = node_map.names.push(node_name);
                        node_map.namespaces.push({ href: node_href || '', prefix: node_prefix || '' });
                        node_map.nodes.push(node);

                        xmlNamedNodeMap[len - 1] = node;
                    }
                    return null;
                },
                setNamedItemNS: function (xmlNamedNodeMap, node)
                {
                    var node_map = xmlNamedNodeMap._node_map;
                    if (node && node_map)
                    {
                        node._parent_node = xmlNamedNodeMap._parent_node;

                        var node_name = node.localName || node.nodeName;
                        var node_href = node.namespaceURI;
                        var node_prefix = node.prefix;

                        var found = -1;
                        var len = node_map.names.length;
                        for (var i = 0; i < len; i++)
                        {
                            if (node_map.names[i] == node_name && node_map.namespaces[i].href == node_href)
                            {
                                found = i;
                                break;
                            }
                        }
                        if (found > -1)
                        {
                            xmlNamedNodeMap[found] = node;

                            var rep_node = node_map.nodes.splice(found, 1, node)[0];
                            if (rep_node) rep_node._parent_node = null;
                            return rep_node;
                        }

                        var len = node_map.names.push(node_name);
                        node_map.namespaces.push({ href: node_href || '', prefix: node_prefix || '' });
                        node_map.nodes.push(node);

                        xmlNamedNodeMap[len - 1] = node;
                    }
                    return null;
                },
                setNamespaceAtNode: function (xmlNamedNodeMap, node, href, prefix)
                {
                    var parent_node = xmlNamedNodeMap._parent_node;
                    if (!parent_node || !href) return;

                    var notfound_namespace = false, node_prefix = prefix, new_prefix_localname = '';
                    if (!node_prefix)
                    {
                        if (!(node_prefix = parent_node.lookupPrefix(href)))
                        {
                            var new_prefix_seq = 1;
                            while (1)
                            {
                                if (!parent_node.lookupNamespaceURI("ns" + new_prefix_seq))
                                {
                                    new_prefix_localname = "ns" + new_prefix_seq;
                                    break;
                                }

                                if (new_prefix_seq >= Number.MAX_SAFE_INTEGER)
                                    break;

                                new_prefix_seq++;
                            }

                            if (new_prefix_localname)
                            {
                                notfound_namespace = true;
                            }
                        }
                    }
                    else
                    {
                        if (!parent_node.lookupNamespaceURI(node_prefix))
                        {
                            var node_prefix_by_href = parent_node.lookupPrefix(href);
                            if (!node_prefix_by_href)
                            {
                                notfound_namespace = true;
                                new_prefix_localname = node_prefix;
                            }
                            else
                            {
                                node_prefix = node_prefix_by_href;
                            }
                        }
                    }

                    if (notfound_namespace && new_prefix_localname)
                    {
                        // create new ns
                        // setAttributeNS: xmlns:prefix=uri
                        const qualified_name = "xmlns:" + new_prefix_localname;
                        parent_node.setAttributeNS("http://www.w3.org/2000/xmlns/", qualified_name, href);

                        if (parent_node.lookupNamespaceURI(new_prefix_localname))
                            node_prefix = new_prefix_localname;
                    }

                    if (node_prefix && !nexacro.__xmlGetPrefix(node.handle))
                    {
                        // createAttributeNS로 생성 case. prefix native xml node handle에 xmlNsPtr이 없는 상태
                        // attr node에 set xmlNsPtr
                        nexacro.__xmlSetNamespace(node.handle, node_prefix, href);
                        node._prefix = prefix;
                    }
                }
            };
            nexacro.XmlNamedNodeMap = (function ()
            {
                var NamedNodeMap = function (parent, type)
                {
                    this._parent_node = parent;
                    this._node_type = type;
                };

                var _pXmlNamedNodeMap = nexacro._createPrototype(nexacro.Object, NamedNodeMap);
                NamedNodeMap.prototype = _pXmlNamedNodeMap;

                // overide nexacro.Object
                _pXmlNamedNodeMap._type_name = "NamedNodeMap";
                _pXmlNamedNodeMap._parent_node = null;
                _pXmlNamedNodeMap._node_type = 0;

                _pXmlNamedNodeMap._node_map = { names: [], nodes: [], ns: [] };

                const get_length = function ()
                {
                    if (!this._node_map)
                        return 0;

                    return this._node_map.names.length;
                };
                Object.defineProperty(_pXmlNamedNodeMap, "length", { get: get_length, configurable: false });

                _pXmlNamedNodeMap.getNamedItem = function getNamedItem(name)
                {
                    assertRequired(getNamedItem.name, getNamedItem.length, arguments.length, "NamedNodeMap");

                    var node_map = this._node_map;
                    if (node_map)
                    {
                        const found = xmlNodeMapHelper.findNamedItem(this, name);
                        if (found > -1) return node_map.nodes[found];
                    }
                    return null;
                };
                _pXmlNamedNodeMap.getNamedItemNS = function getNamedItemNS(ns, localName)
                {
                    assertRequired(getNamedItemNS.name, getNamedItemNS.length, arguments.length, "NamedNodeMap");

                    var node_map = this._node_map;
                    if (node_map)
                    {
                        const found = xmlNodeMapHelper.findNamedItemNS(this, ns, localName);
                        if (found > -1) return node_map.nodes[found];
                    }
                    return null;
                };
                _pXmlNamedNodeMap.item = function item(index)
                {
                    assertRequired(item.name, item.length, arguments.length, "NamedNodeMap");

                    var node_map = this._node_map;
                    if (index > -1 && node_map && node_map.nodes.length > index)
                        return node_map.nodes[index];
                    return null;
                };
                _pXmlNamedNodeMap.removeNamedItem = function removeNamedItem(name)
                {
                    assertRequired(removeNamedItem.name, removeNamedItem.length, arguments.length, "NamedNodeMap");

                    var node_map = this._node_map;
                    if (node_map)
                    {
                        const found = xmlNodeMapHelper.findNamedItem(this, name);
                        if (found < 0)
                        {
                            raiseNotFoundChildNodeException(removeNamedItem.name, "NamedNodeMap");
                        }

                        var remove_node = node_map.nodes[found];
                        var parent_node = this._parent_node;
                        if (parent_node)
                        {
                            var remove_handle = nexacro.__xmlRemoveAttributeNode(parent_node.handle, remove_node.handle);
                            if (remove_handle)
                            {
                                xmlNodeMapHelper.removeItem(this, found);
                                remove_node._parent_node = null;
                                return remove_node;
                            }
                        }
                    }
                    return null;
                };
                _pXmlNamedNodeMap.removeNamedItemNS = function removeNamedItemNS(ns, localName)
                {
                    assertRequired(removeNamedItemNS.name, removeNamedItemNS.length, arguments.length, "NamedNodeMap");

                    var node_map = this._node_map;
                    if (node_map)
                    {
                        const found = xmlNodeMapHelper.findNamedItemNS(this, ns, localName);
                        if (found < 0)
                        {
                            raiseNotFoundChildNodeException(removeNamedItemNS.name, "NamedNodeMap");
                        }

                        var remove_node = node_map.nodes[found];
                        var parent_node = this._parent_node;
                        if (parent_node)
                        {
                            var remove_handle = nexacro.__xmlRemoveAttributeNode(parent_node.handle, remove_node.handle);
                            if (remove_handle)
                            {
                                xmlNodeMapHelper.removeItem(this, found);
                                remove_node._parent_node = null;
                                return remove_node;
                            }
                        }
                    }
                    return null;
                };
                _pXmlNamedNodeMap.setNamedItem = function setNamedItem(node)
                {
                    assertRequired(setNamedItem.name, setNamedItem.length, arguments.length, "NamedNodeMap");
                    assertType(setNamedItem.name, 1, node, nexacro.XmlAttribute, 'NamedNodeMap');

                    if (node && node.parentNode)
                        raiseInUseAttributeException('setNamedItem', 'NamedNodeMap');

                    var node_map = this._node_map;
                    if (node_map)
                    {
                        var node_name = node.localName || node.nodeName;
                        var node_href = node.namespaceURI;
                        var node_prefix = node.prefix;

                        var found = -1;
                        if (node_prefix)
                        {
                            found = xmlNodeMapHelper.findNamedItemPrefix(this, node_prefix, node_name);
                        }
                        else if (node_href)
                        {
                            found = xmlNodeMapHelper.findNamedItemNS(this, node_href, node_name);
                        }
                        else
                        {
                            found = xmlNodeMapHelper.findNamedItem(this, node_name);
                        }

                        // __xmlRemoveAttributeNode 하지 않고, __xmlSetAttributeNode을 하면,
                        // 기존의 Attribute Node가 파괴되어 스크립트에서 사용 중 죽기 때문에 remove --> set 처리
                        var remove_node = null, parent_node = this._parent_node;
                        if (found > -1)
                        {
                            remove_node = node_map.nodes[found];

                            var remove_handle = nexacro.__xmlRemoveAttributeNode(parent_node.handle, remove_node.handle);
                            if (remove_handle)
                            {
                                xmlNodeMapHelper.removeItem(this, found);
                                remove_node._parent_node = null;
                            }
                        }

                        var attr_handle = nexacro.__xmlSetAttributeNode(parent_node.handle, node.handle);
                        if (attr_handle)
                        {
                            node.handle = attr_handle;
                            node._parent_node = parent_node;

                            if (node_href)
                            {
                                var doc_elem = parent_node._owner_document.documentElement;
                                if (doc_elem.contains(parent_node))
                                {
                                    xmlNodeMapHelper.setNamespaceAtNode(this, node, node_href, node_prefix);
                                }
                            }

                            node_href = node.namespaceURI;
                            node_prefix = node.prefix;

                            var len = node_map.names.push(node_name);
                            node_map.namespaces.push({ href: node_href || '', prefix: node_prefix || '' });
                            node_map.nodes.push(node);

                            this[len - 1] = node;
                        }

                        return remove_node;
                    }
                    return null;
                };
                _pXmlNamedNodeMap.setNamedItemNS = function setNamedItemNS(node)
                {
                    assertRequired(setNamedItemNS.name, setNamedItemNS.length, arguments.length, "NamedNodeMap");
                    assertType(setNamedItemNS.name, 1, node, nexacro.XmlAttribute, 'NamedNodeMap');

                    if (node && node.parentNode)
                        raiseInUseAttributeException('setNamedItemNS', 'NamedNodeMap');

                    var node_map = this._node_map;
                    if (node_map)
                    {
                        var node_name = node.localName || node.nodeName;
                        var node_href = node.namespaceURI;
                        var node_prefix = node.prefix;

                        const found = xmlNodeMapHelper.findNamedItemNS(this, node_href, node_name);

                        // __xmlRemoveAttributeNode 하지 않고, __xmlSetAttributeNode을 하면,
                        // 기존의 Attribute Node가 파괴되어 스크립트에서 사용 중 죽기 때문에 remove --> set 처리
                        var remove_node = null, parent_node = this._parent_node;
                        if (found > -1)
                        {
                            remove_node = node_map.nodes[found];

                            var remove_handle = nexacro.__xmlRemoveAttributeNode(parent_node.handle, remove_node.handle);
                            if (remove_handle)
                            {
                                xmlNodeMapHelper.removeItem(this, found);
                                remove_node._parent_node = null;
                            }
                        }
                        var attr_handle = nexacro.__xmlSetAttributeNode(parent_node.handle, node.handle);
                        if (attr_handle)
                        {
                            node.handle = attr_handle;
                            node._parent_node = parent_node;

                            if (node_href)
                            {
                                var doc_elem = parent_node._owner_document.documentElement;
                                if (doc_elem.contains(parent_node))
                                {
                                    xmlNodeMapHelper.setNamespaceAtNode(this, node, node_href, node_prefix);
                                }
                            }

                            node_href = node.namespaceURI;
                            node_prefix = node.prefix;

                            var len = node_map.names.push(node_name);
                            node_map.namespaces.push({ href: node_href || '', prefix: node_prefix || '' });
                            node_map.nodes.push(node);

                            this[len - 1] = node;
                        }

                        return remove_node;
                    }
                    return null;
                }

                return NamedNodeMap;
            })();

            const xmlNodeHelper = {
                setOwnerDocument: function (node, doc) 
                {
                    if (node && this._owner_document != doc)
                    {
                        node._owner_document = doc;

                        var childs = node.childNodes;
                        childs.forEach((child) =>
                        {
                            xmlNodeHelper.setOwnerDocument(child, doc);
                        });
                    }
                },
                unlink: function (node)
                {
                    if (!node) return;

                    var parentNode = node._parent_node;
                    if (node._node_type == 2)
                    {
                        if (parentNode && parentNode._attributes)
                        {
                            var attrs = parentNode._attributes;
                            var removedNode = xmlNodeMapHelper.removeNamedItem(attrs, node.name);
                            if (removedNode) node._parent_node = null;
                        }
                    }
                    else
                    {
                        var prevNode = node._previous_sibling;
                        var nextNode = node._next_sibling;
                        if (parentNode)
                        {
                            var childs = parentNode._child_nodes;
                            xmlNodeListHelper.removeItem(childs, node);
                        }
                        else
                        {
                            if (prevNode)
                                prevNode._next_sibling = nextNode;
                            if (nextNode)
                                nextNode._previous_sibling = prevNode;

                            node._previous_sibling = null;
                            node._next_sibling = null;
                        }
                        node._parent_node = null;
                    }
                }
            };
            //==============================================================================
            // Node
            nexacro.XmlNode = (function ()
            {
                var Node = function (doc)
                {
                    this._owner_document = doc;
                };

                var _pXmlNode = nexacro._createPrototype(nexacro.Object, Node);
                Node.prototype = _pXmlNode;

                _pXmlNode._type_name = "Node";

                _pXmlNode.handle = null;

                _pXmlNode._owner_document = null;
                _pXmlNode._parent_node = null;
                _pXmlNode._previous_sibling = null;
                _pXmlNode._next_sibling = null;
                _pXmlNode._child_nodes = null;
                _pXmlNode._node_name = "";
                _pXmlNode._node_type = "";
                _pXmlNode._node_value = undefined;
                _pXmlNode._namespace_uri = null;
                _pXmlNode._prefix = null;
                _pXmlNode._text_content = "";

                _pXmlNode._destroy = function ()
                {
                    var handle = this.handle;
                    if (handle)
                    {
                        this.handle = null;
                    }

                    this._child_nodes = null;
                    this._owner_document = null;
                    this._parent_node = null;
                    this._previous_sibling = null;
                    this._next_sibling = null;
                };

                //==============================================================================
                // property getter/setter

                // getOwnerElement
                const get_ownerDocument = function ()
                {
                    if (!this.handle)
                        return null;

                    var owner_document = this._owner_document;
                    if (owner_document)
                        return owner_document;
                };
                Object.defineProperty(_pXmlNode, "ownerDocument", { get: get_ownerDocument, configurable: false });

                // childNodes : NodeList
                const get_childNodes = function ()
                {
                    if (!this.handle)
                        return null;

                    var childs = this._child_nodes;
                    if (!childs)
                    {
                        if (this._node_type == 10) return null;

                        childs = this._child_nodes = new nexacro.XmlNodeList();
                        var child_handles = nexacro.__xmlGetChildNodes(this.handle);
                        if (child_handles)
                        {
                            var owner_doc = (this._node_type == 9 ? this : this._owner_document);
                            xmlNodeListHelper.setFromHandleArray(childs, child_handles, 0, owner_doc, this, true);
                            child_handles = null;
                        }
                    }
                    return childs;
                };
                Object.defineProperty(_pXmlNode, "childNodes", { get: get_childNodes, configurable: false });

                // firstChild
                const get_firstChild = function ()
                {
                    if (!this.handle)
                        return null;

                    if (this._node_type == 10) return null;

                    var first_child = null;
                    var child_nodes = this.childNodes;
                    if (child_nodes && child_nodes.length)
                    {
                        first_child = child_nodes.item(0);
                    }
                    return first_child;
                };
                Object.defineProperty(_pXmlNode, "firstChild", { get: get_firstChild, configurable: false });

                // lastChild
                const get_lastChild = function ()
                {
                    if (!this.handle)
                        return null;

                    if (this._node_type == 10) return null;

                    var last_child = null;
                    var child_nodes = this.childNodes;
                    if (child_nodes && child_nodes.length)
                    {
                        last_child = child_nodes.item(child_nodes.length - 1);
                    }
                    return last_child;
                };
                Object.defineProperty(_pXmlNode, "lastChild", { get: get_lastChild, configurable: false });

                // nextSibling
                const get_nextSibling = function ()
                {
                    if (!this.handle)
                        return null;

                    return this._next_sibling;
                };
                Object.defineProperty(_pXmlNode, "nextSibling", { get: get_nextSibling, configurable: false });

                // previousSibling
                const get_previousSibling = function ()
                {
                    if (!this.handle)
                        return null;

                    return this._previous_sibling;
                };
                Object.defineProperty(_pXmlNode, "previousSibling", { get: get_previousSibling, configurable: false });

                // parentNode
                const get_parentNode = function ()
                {
                    if (!this.handle)
                        return null;

                    return this._parent_node;
                };
                Object.defineProperty(_pXmlNode, "parentNode", { get: get_parentNode, configurable: false });

                // namespaceURI
                const get_namespaceURI = function ()
                {
                    if (!this.handle)
                        return null;

                    var namespace_uri = this._namespace_uri;
                    if (namespace_uri === null) 
                    {
                        namespace_uri = this._namespace_uri = nexacro.__xmlGetNamespaceURI(this.handle);
                    }
                    return namespace_uri;
                };
                Object.defineProperty(_pXmlNode, "namespaceURI", { get: get_namespaceURI, configurable: false });

                // prefix
                const get_prefix = function ()
                {
                    if (!this.handle)
                        return null;

                    var prefix = this._prefix;
                    if (prefix === null)
                    {
                        prefix = this._prefix = nexacro.__xmlGetPrefix(this.handle);
                    }
                    return prefix;
                };
                Object.defineProperty(_pXmlNode, "prefix", { get: get_prefix, configurable: false });

                // nodeName
                const get_nodeName = function ()
                {
                    if (!this.handle)
                        return "";

                    var node_name = this._node_name;
                    if (!node_name)
                    {
                        node_name = nexacro.__xmlGetNodeName(this.handle);
                    }

                    return node_name;
                };
                Object.defineProperty(_pXmlNode, "nodeName", { get: get_nodeName, configurable: false });

                // nodeType
                const get_nodeType = function ()
                {
                    return this._node_type;
                };
                Object.defineProperty(_pXmlNode, "nodeType", { get: get_nodeType, configurable: false });

                // nodeValue
                const get_nodeValue = function ()
                {
                    if (!this.handle)
                        return undefined;

                    var node_value = this._node_value;
                    if (node_value == undefined)
                    {
                        node_value = this._node_value = nexacro.__xmlGetNodeValue(this.handle);
                    }
                    return node_value;
                };
                const set_nodeValue = function (new_value)
                {
                    if (!this.handle)
                        return;

                    nexacro.__xmlSetNodeValue(this.handle, new_value);
                    this._node_value = undefined;
                };
                Object.defineProperty(_pXmlNode, "nodeValue", { get: get_nodeValue, set: set_nodeValue, configurable: false });

                const get_source = function () 
                {
                    if (!this.handle)
                        return "";

                    return nexacro.__documentToXml(this.handle);
                };
                Object.defineProperty(_pXmlNode, "source", { get: get_source, configurable: false });

                // textContent
                const get_textContent = function ()
                {
                    if (!this.handle)
                        return undefined;

                    return nexacro.__xmlGetTextContent(this.handle);
                };
                const set_textContent = function (new_value)
                {
                    if (!this.handle)
                        return;

                    nexacro.__xmlSetTextContent(this.handle, new_value);
                };
                Object.defineProperty(_pXmlNode, "textContent", { get: get_textContent, set: set_textContent, configurable: false });


                //==============================================================================
                // methods

                // appendChild
                _pXmlNode.appendChild = function appendChild(node)
                {
                    assertRequired(appendChild.name, appendChild.length, arguments.length);
                    assertType(appendChild.name, 1, node, nexacro.XmlNode);

                    if (!this.handle || !node.handle)
                        return null;

                    if (this._node_type !== 9 && this._node_type !== 11 && this._node_type !== 1)
                        raiseUnsupportMethodException('appendChild');

                    if (node._node_type !== 10 && node._node_type !== 11 && node._node_type !== 1 &&
                        node._node_type !== 3 && node._node_type !== 4 && node._node_type !== 7 && node._node_type !== 8)
                        raiseDisallowInsertException('appendChild', node, this);

                    if ((this._node_type === 9 && node._node_type === 3) ||
                        (this._node_type !== 9 && node._node_type === 10))
                        raiseDisallowInsertException('appendChild', node, this);

                    if (this._node_type === 9 && node._node_type === 10 && this.documentElement)
                        raiseInsertDoctypeBeforeRootException('appendChild');

                    if (this._node_type === 9 && node._node_type === 1 && this.documentElement)
                        raiseDisallowMultiDocElementException('appendChild');

                    if (this._node_type === 9 && node._node_type === 11)
                    {
                        var child = node.firstChild;
                        while (child) 
                        {
                            if (child._node_type == 1 || child._node_type == 3 || child._node_type == 3)
                                raiseDisallowInsertException('appendChild', node, this);

                            child = child.nextSibling;
                        }
                    }

                    if (node.contains(this))
                        raiseInsertContainParentException('appendChild');

                    var child_nodes = this.childNodes;

                    var append_handle = nexacro.__xmlAppendChild(this.handle, node.handle);
                    if (append_handle)
                    {
                        node.handle = append_handle;

                        if (node._parent_node)
                            xmlNodeHelper.unlink(node);

                        if (child_nodes)
                        {
                            xmlNodeListHelper.appendItem(child_nodes, node);
                        }
                        node._parent_node = this;

                        if (node._owner_document != this._owner_document)
                        {
                            xmlNodeHelper.setOwnerDocument(node, this._owner_document);
                        }

                        if (node._node_type === 1)
                        {
                            var doc_elem = node._owner_document.documentElement;
                            if (doc_elem && doc_elem.contains(node))
                            {
                                xmlNodeListHelper.setNamespaceChildNodes(node);
                            }
                        }

                        return node;
                    }
                    return null;
                };

                // cloneNode
                _pXmlNode.cloneNode = function cloneNode(include_all)
                {
                    if (!this.handle)
                        return null;

                    var clone_handle = nexacro.__xmlCloneNode(this.handle, include_all);
                    if (clone_handle)
                    {
                        var node_type = this.nodeType;
                        var owner_doc = (this._node_type == 9 ? this : this._owner_document);
                        var clone_node = createNodeObjectByType(owner_doc, node_type);
                        if (clone_node)
                        {
                            clone_node.handle = clone_handle;
                            clone_node._node_type = node_type;
                        }

                        return clone_node;
                    }
                    return null;
                };

                // hasAttributes
                _pXmlNode.hasAttributes = function hasAttributes()
                {
                    if (!this.handle)
                        return false;

                    return nexacro.__xmlHasAttributes(this.handle);
                };

                // hasChildNodes
                _pXmlNode.hasChildNodes = function hasChildNodes()
                {
                    if (!this.handle)
                        return false;

                    if (this._child_nodes && this._child_nodes.length > 0)
                        return true;

                    if (this._node_type == 10)
                        return false;

                    return nexacro.__xmlHasChildNodes(this.handle);
                };

                // insertBefore
                _pXmlNode.insertBefore = function insertBefore(newchild, refchild)
                {
                    assertRequired(insertBefore.name, insertBefore.length, arguments.length);

                    assertType(insertBefore.name, 1, newchild, nexacro.XmlNode);
                    assertTypeOrNull(insertBefore.name, 2, refchild, nexacro.XmlNode);

                    if (!this.handle || !newchild.handle || (refchild && !refchild.handle))
                        return null;

                    if (this._node_type !== 9 && this._node_type !== 11 && this._node_type !== 1)
                        raiseUnsupportMethodException('insertBefore');

                    if (newchild._node_type !== 10 && newchild._node_type !== 11 && newchild._node_type !== 1 &&
                        newchild._node_type !== 3 && newchild._node_type !== 4 && newchild._node_type !== 7 && newchild._node_type !== 8)
                        raiseDisallowInsertException('insertBefore', newchild, this);

                    if ((this._node_type === 9 && newchild._node_type === 3) ||
                        (this._node_type !== 9 && newchild._node_type === 10))
                        raiseDisallowInsertException('insertBefore', newchild, this);

                    if (this._node_type === 9 && newchild._node_type === 1 && this.documentElement)
                        raiseDisallowMultiDocElementException('insertBefore');

                    if (this._node_type === 9 && newchild._node_type === 11)
                    {
                        var child = newchild.firstChild;
                        while (child) 
                        {
                            if (child._node_type == 1 || child._node_type == 3 || child._node_type == 3)
                                raiseDisallowInsertException('insertBefore', newchild, this);

                            child = child.nextSibling;
                        }
                    }

                    if (newchild.contains(this))
                        raiseInsertContainParentException('insertBefore');

                    var child_nodes = this.childNodes;

                    var ref_handle = refchild ? refchild.handle : null;
                    var insert_handle = nexacro.__xmlInsertBefore(this.handle, newchild.handle, ref_handle);
                    if (insert_handle)
                    {
                        newchild.handle = insert_handle;

                        if (newchild._parent_node)
                            xmlNodeHelper.unlink(newchild);

                        if (child_nodes)
                        {
                            xmlNodeListHelper.insertBefore(child_nodes, newchild, refchild);
                        }
                        newchild._parent_node = this;

                        if (newchild._owner_document != this._owner_document)
                        {
                            xmlNodeHelper.setOwnerDocument(newchild, this._owner_document);
                        }

                        if (newchild._node_type === 1)
                        {
                            var doc_elem = newchild._owner_document.documentElement;
                            if (doc_elem && doc_elem.contains(newchild))
                            {
                                xmlNodeListHelper.setNamespaceChildNodes(newchild);
                            }
                        }

                        return newchild;
                    }
                    return null;
                };

                // lookupNamespaceURI
                _pXmlNode.lookupNamespaceURI = function lookupNamespaceURI(prefix)
                {
                    assertRequired(lookupNamespaceURI.name, lookupNamespaceURI.length, arguments.length);

                    if (!this.handle)
                        return "";

                    return nexacro.__xmlLookupNamespaceURI(this.handle, prefix);
                };
                // lookupPrefix
                _pXmlNode.lookupPrefix = function lookupPrefix(uri)
                {
                    assertRequired(lookupPrefix.name, lookupPrefix.length, arguments.length);

                    if (!this.handle)
                        return "";

                    return nexacro.__xmlLookupPrefix(this.handle, uri);
                };

                // removeChild
                _pXmlNode.removeChild = function removeChild(node)
                {
                    assertRequired(removeChild.name, removeChild.length, arguments.length);

                    assertType(removeChild.name, 1, node, nexacro.XmlNode);

                    if (!this.handle || !node.handle)
                        return null;

                    var child_nodes = this.childNodes;
                    const idx = xmlNodeListHelper.findIndex(child_nodes, node);
                    if (idx < 0)
                    {
                        raiseNotFoundChildNodeException('removeChild');
                    }

                    var rem_handle = nexacro.__xmlRemoveChild(this.handle, node.handle);
                    if (rem_handle)
                    {
                        xmlNodeListHelper.removeItem(child_nodes, node);
                        node._parent_node = null;

                        return node;
                    }

                    return null;
                };
                // replaceChild
                _pXmlNode.replaceChild = function replaceChild(new_node, old_node)
                {
                    assertRequired(replaceChild.name, replaceChild.length, arguments.length);

                    assertType(replaceChild.name, 1, new_node, nexacro.XmlNode);
                    assertType(replaceChild.name, 2, old_node, nexacro.XmlNode);

                    if (!this.handle || !new_node.handle || !old_node.handle)
                        return null;

                    var child_nodes = this.childNodes;
                    const idx = xmlNodeListHelper.findIndex(child_nodes, old_node);
                    if (idx < 0)
                    {
                        raiseNotFoundChildNodeException('replaceChild');
                    }

                    if (this._node_type !== 9 && this._node_type !== 11 && this._node_type !== 1)
                        raiseUnsupportMethodException('replaceChild');

                    if (new_node._node_type !== 9 && new_node._node_type !== 11 && new_node._node_type !== 1 &&
                        new_node._node_type !== 3 && new_node._node_type !== 4 && new_node._node_type !== 7 && new_node._node_type !== 8)
                        raiseDisallowInsertException('replaceChild', new_node, this);

                    if ((this._node_type === 9 && new_node._node_type === 3) ||
                        (this._node_type !== 9 && new_node._node_type === 10))
                        raiseDisallowInsertException('replaceChild', new_node, this);

                    if (this._node_type === 9)
                    {
                        if (new_node._node_type === 11)
                        {
                            var child = new_node.firstChild;
                            while (child) 
                            {
                                if (child._node_type == 1 || child._node_type == 3 || child._node_type == 3)
                                    raiseDisallowInsertException('replaceChild', new_node, this);

                                child = child.nextSibling;
                            }
                        }
                        if (new_node._node_type != old_node._node_type)
                        {
                            if (new_node._node_type === 10)
                            {
                                var node = old_node._previous_sibling;
                                while (node)
                                {
                                    if (node._node_type == 1)
                                    {
                                        raiseInsertDoctypeBeforeRootException('replaceChild');
                                        break;
                                    }
                                    node = node._previous_sibling;
                                }

                            }
                            else if (new_node._node_type === 1)
                            {
                                var node = old_node._next_sibling;
                                while (node)
                                {
                                    if (node._node_type == 10)
                                    {
                                        raiseInsertDoctypeBeforeRootException('replaceChild');
                                        break;
                                    }
                                    node = node._next_sibling;
                                }
                            }
                        }
                    }

                    if (this._node_type === 9 && new_node._node_type === 1 && (this.documentElement && this.documentElement != old_node))
                        raiseDisallowMultiDocElementException('replaceChild');

                    if (new_node.contains(this))
                        raiseInsertContainParentException('replaceChild');

                    child_nodes = this.childNodes;

                    var rep_handle = nexacro.__xmlReplaceChild(this.handle, new_node.handle, old_node.handle);
                    if (rep_handle)
                    {
                        if (new_node._parent_node)
                            xmlNodeHelper.unlink(new_node);

                        if (child_nodes)
                        {
                            xmlNodeListHelper.replaceItem(child_nodes, new_node, old_node);
                        }
                        new_node._parent_node = this;
                        old_node._parent_node = null;

                        if (new_node._owner_document != this._owner_document)
                        {
                            xmlNodeHelper.setOwnerDocument(new_node, this._owner_document);
                        }

                        if (new_node._node_type === 1)
                        {
                            var doc_elem = new_node._owner_document.documentElement;
                            if (doc_elem && doc_elem.contains(new_node))
                            {
                                xmlNodeListHelper.setNamespaceChildNodes(new_node);
                            }
                        }

                        return old_node;
                    }
                    return null;
                };

                // isEqualNode
                _pXmlNode.isEqualNode = function isEqualNode(other)
                {
                    assertRequired(isEqualNode.name, isEqualNode.length, arguments.length);

                    assertTypeOrNull(isEqualNode.name, 1, other, nexacro.XmlNode);

                    if (!other || !other.handle)
                        return false;

                    if (this._node_type !== other._node_type)
                        return false;

                    return true;
                };

                // isSameNode
                _pXmlNode.isSameNode = function isSameNode(other)
                {
                    assertRequired(isSameNode.name, isSameNode.length, arguments.length);

                    assertTypeOrNull(isSameNode.name, 1, other, nexacro.XmlNode);

                    if (!other || !other.handle)
                        return false;

                    if (this._node_type !== other._node_type)
                        return false;

                    return nexacro.__xmlIsSameNode(this.handle, other.handle);
                };

                // contains
                _pXmlNode.contains = function contains(other)
                {
                    assertRequired(contains.name, contains.length, arguments.length);

                    assertTypeOrNull(contains.name, 1, other, nexacro.XmlNode);

                    if (!other || !other.handle)
                        return false;

                    if (nexacro.__xmlIsSameNode(other.handle, this.handle))
                        return true;

                    if (this.hasChildNodes())
                    {
                        var parentNode = other.parentNode;
                        while (parentNode)
                        {
                            if (nexacro.__xmlIsSameNode(parentNode.handle, this.handle))
                                return true;

                            parentNode = parentNode.parentNode;
                            if (!parentNode)
                                break;
                        }
                    }

                    return false;
                };

                return Node;
            })();

            //==============================================================================
            // Element
            nexacro.XmlElement = (function ()
            {
                var Element = function (doc)
                {
                    nexacro.XmlNode.call(this, doc);
                };

                var _pXmlElement = nexacro._createPrototype(nexacro.XmlNode, Element);
                Element.prototype = _pXmlElement;

                _pXmlElement._type_name = "Element";

                _pXmlElement._attributes = null; // NamedNodeMap
                _pXmlElement._base_uri = "";
                _pXmlElement._local_name = "";
                _pXmlElement._node_type = 1;

                //////////////////////////////////////////////////////////////////////////
                // property getter/setter

                // attributes
                const get_attributes = function ()
                {
                    if (!this.handle)
                        return null;

                    var attributes = this._attributes;
                    if (!attributes)
                    {
                        attributes = this._attributes = new nexacro.XmlNamedNodeMap(this, 2);
                        var attr_handle_map = nexacro.__xmlGetAttributes(this.handle);
                        if (attr_handle_map)
                        {
                            xmlNodeMapHelper.setFromHandleMap(attributes, attr_handle_map, 2, this._owner_document, this);
                        }
                    }
                    return attributes;
                };
                Object.defineProperty(_pXmlElement, "attributes", { get: get_attributes, configurable: false });

                // baseURI
                const get_baseURI = function ()
                {
                    if (!this.handle)
                        return;

                    return nexacro.__xmlGetBaseURI(this.handle);
                };
                Object.defineProperty(_pXmlElement, "baseURI", { get: get_baseURI, configurable: false });

                // localName
                const get_localName = function ()
                {
                    if (!this.handle)
                        return "";

                    var node_name = this._local_name;
                    if (!node_name)
                    {
                        node_name = this._local_name = nexacro.__xmlGetNodeName(this.handle);
                        return node_name;
                    }
                    return node_name;
                };
                Object.defineProperty(_pXmlElement, "localName", { get: get_localName, configurable: false });

                // nodeName
                const get_nodeName = function ()
                {
                    if (!this.handle)
                        return "";

                    var node_name = nexacro.__xmlGetNodeName(this.handle);

                    var prefix = this.prefix;
                    if (prefix)
                        node_name = prefix + ':' + node_name;

                    return node_name;
                };
                Object.defineProperty(_pXmlElement, "nodeName", { get: get_nodeName, configurable: false });

                // tagName
                Object.defineProperty(_pXmlElement, "tagName", { get: get_nodeName, configurable: false });


                //////////////////////////////////////////////////////////////////////////
                // methods

                // getAttribute
                _pXmlElement.getAttribute = function getAttribute(name)
                {
                    assertRequired(getAttribute.name, getAttribute.length, arguments.length, 'Element');

                    if (!this.handle || !name)
                        return null;

                    return nexacro.__xmlGetAttribute(this.handle, name);
                };
                // getAttributeNS
                _pXmlElement.getAttributeNS = function getAttributeNS(ns, name)
                {
                    assertRequired(getAttributeNS.name, getAttributeNS.length, arguments.length, 'Element');

                    if (!this.handle || !name)
                        return null;

                    return nexacro.__xmlGetAttribute(this.handle, name, ns);
                };
                // getAttributeNode
                _pXmlElement.getAttributeNode = function getAttributeNode(name)
                {
                    assertRequired(getAttributeNode.name, getAttributeNode.length, arguments.length, 'Element');

                    if (!this.handle || !name)
                        return null;

                    return this.attributes.getNamedItem(name);
                };
                // getAttributeNodeNS
                _pXmlElement.getAttributeNodeNS = function getAttributeNodeNS(ns, name)
                {
                    assertRequired(getAttributeNodeNS.name, getAttributeNodeNS.length, arguments.length, 'Element');

                    if (!this.handle || !ns || !name)
                        return null;

                    return this.attributes.getNamedItemNS(ns, name);
                };

                // getElementsByTagName
                _pXmlElement.getElementsByTagName = function getElementsByTagName(name)
                {
                    assertRequired(getElementsByTagName.name, getElementsByTagName.length, arguments.length, 'Element');

                    var elem_nodes = new nexacro.XmlNodeList();

                    if (!this.handle || !name)
                        return null;

                    // tree link문제 - 동일한 native node에 대해 여러 개의 DOM 객체가 생김.
                    // => native call을 사용하지 않고 직접 search
                    var node = this.firstChild;
                    while (node)
                    {
                        if (node._node_type == 1)
                        {
                            if (name == "*" || node.tagName == name)
                                elem_nodes.push(node);

                            if (node.hasChildNodes())
                            {
                                const desc_elems = node.getElementsByTagName(name);
                                elem_nodes.push(...desc_elems);
                            }
                        }

                        node = node.nextSibling;
                    }

                    return elem_nodes;
                };
                // getElementsByTagNameNS
                _pXmlElement.getElementsByTagNameNS = function getElementsByTagNameNS(ns, name)
                {
                    assertRequired(getElementsByTagNameNS.name, getElementsByTagNameNS.length, arguments.length, 'Element');

                    var elem_nodes = new nexacro.XmlNodeList();

                    if (!this.handle || !name)
                        return elem_nodes;

                    // tree link문제 - 동일한 native node에 대해 여러 개의 DOM 객체가 생김.
                    // => native call을 사용하지 않고 직접 search
                    var node = this.firstChild;
                    while (node)
                    {
                        if (node._node_type == 1)
                        {
                            if ((ns == "*" || node.namespaceURI == ns) &&
                                (name == "*" || node.localName == name))
                                elem_nodes.push(node);

                            if (node.hasChildNodes())
                            {
                                const desc_elems = node.getElementsByTagNameNS(ns, name);
                                elem_nodes.push(...desc_elems);
                            }
                        }

                        node = node.nextSibling;
                    }

                    return elem_nodes;
                };

                // hasAttribute
                _pXmlElement.hasAttribute = function hasAttribute(name)
                {
                    assertRequired(hasAttribute.name, hasAttribute.length, arguments.length, 'Element');

                    if (!this.handle || !name)
                        return false;

                    return nexacro.__xmlHasAttribute(this.handle, name);
                };
                // hasAttributeNS
                _pXmlElement.hasAttributeNS = function hasAttributeNS(ns, name)
                {
                    assertRequired(hasAttributeNS.name, hasAttributeNS.length, arguments.length, 'Element');

                    if (!this.handle || !name)
                        return false;

                    return nexacro.__xmlHasAttribute(this.handle, name, ns);
                };

                // removeAttribute
                _pXmlElement.removeAttribute = function removeAttribute(name)
                {
                    assertRequired(removeAttribute.name, removeAttribute.length, arguments.length, 'Element');

                    if (!this.handle || !name)
                        return;

                    if (this.hasAttribute(name))
                    {
                        this.attributes.removeNamedItem(name);
                    }
                };
                // removeAttributeNS
                _pXmlElement.removeAttributeNS = function removeAttributeNS(ns, name)
                {
                    assertRequired(removeAttributeNS.name, removeAttributeNS.length, arguments.length, 'Element');

                    if (!this.handle || !name)
                        return;

                    if (this.hasAttributeNS(ns, name))
                    {
                        this.attributes.removeNamedItemNS(ns, name);
                    }
                };
                // removeAttributeNode
                _pXmlElement.removeAttributeNode = function removeAttributeNode(node)
                {
                    assertRequired(removeAttributeNode.name, removeAttributeNode.length, arguments.length, 'Element');
                    assertType(removeAttributeNode.name, 1, node, nexacro.XmlAttribute, 'Element');

                    if (!this.handle || !node.handle)
                        return;

                    var hasAttr = false, name, ns;
                    if (node.namespaceURI)
                    {
                        ns = node.namespaceURI, name = node.localName;
                        hasAttr = this.hasAttributeNS(ns, name);
                    }
                    else
                    {
                        name = node.name;
                        hasAttr = this.hasAttribute(name);
                    }

                    if (!hasAttr)
                    {
                        raiseNotFoundChildNodeException('removeAttributeNode', 'Element');
                    }

                    var attributes = this.attributes;
                    if (attributes)
                    {
                        if (ns)
                        {
                            return attributes.removeNamedItemNS(ns, name);
                        }
                        else
                        {
                            return attributes.removeNamedItem(name);
                        }
                    }
                };

                // setAttribute
                _pXmlElement.setAttribute = function setAttribute(name, value)
                {
                    assertRequired(setAttribute.name, setAttribute.length, arguments.length, 'Element');

                    if (!this.handle || !name)
                        return;

                    var attributes = this.attributes;
                    if (attributes)
                    {
                        var attr_node = attributes.getNamedItem(name);
                        if (attr_node)
                        {
                            attr_node.value = value;
                            return;
                        }

                        /* CHECK: __xmlSet...(localName? name?)
                        var ns_prefix = '', local_name;
                        const names = name.split(':');
                        if (names.length > 1)
                        {
                            ns_prefix = names[0];
                            local_name = names[1];
                        }
                        else
                        {
                            local_name = names[0];
                        }*/

                        var attr_handle = nexacro.__xmlSetAttribute(this.handle, name, value);
                        if (attr_handle)
                        {
                            attr_node = createNodeObjectByType(this._owner_document, 2);
                            if (attr_node)
                            {
                                attr_node.handle = attr_handle;
                                attr_node._parent_node = this;

                                xmlNodeMapHelper.setNamedItem(attributes, attr_node);
                            }
                        }
                    }
                };
                // setAttributeNS
                _pXmlElement.setAttributeNS = function setAttributeNS(ns, name, value)
                {
                    assertRequired(setAttributeNS.name, setAttributeNS.length, arguments.length, 'Element');

                    if (!this.handle || !name)
                        return;

                    // 'name' is not localName. name=prefix:localName
                    var attributes = this.attributes;
                    if (attributes)
                    {
                        var attr_node = attributes.getNamedItem(name);
                        if (attr_node)
                        {
                            attr_node.value = value;
                            return;
                        }

                        var attr_handle = nexacro.__xmlSetAttribute(this.handle, name, value, ns);
                        if (attr_handle)
                        {
                            attr_node = createNodeObjectByType(this._owner_document, 2);
                            if (attr_node)
                            {
                                attr_node.handle = attr_handle;
                                attr_node._parent_node = this;

                                xmlNodeMapHelper.setNamedItemNS(attributes, attr_node);
                            }
                        }
                    }
                };
                // setAttributeNode
                _pXmlElement.setAttributeNode = function setAttributeNode(node)
                {
                    assertRequired(setAttributeNode.name, setAttributeNode.length, arguments.length, 'Element');
                    assertType(setAttributeNode.name, 1, node, nexacro.XmlAttribute, 'Element');

                    if (!this.handle || !node.handle)
                        return;

                    var attr_name = node.name;
                    if (!attr_name)
                        return;

                    if (node._parent_node != null)
                        raiseInUseAttributeException('setAttributeNode');

                    var attributes = this.attributes;
                    if (attributes)
                    {
                        var rep_node = attributes.setNamedItem(node);
                        if (rep_node)
                        {
                            rep_node._parent_node = null;
                            return rep_node;
                        }
                    }
                };
                // setAttributeNodeNS
                _pXmlElement.setAttributeNodeNS = function setAttributeNodeNS(node)
                {
                    assertRequired(setAttributeNodeNS.name, setAttributeNodeNS.length, arguments.length, 'Element');
                    assertType(setAttributeNodeNS.name, 1, node, nexacro.XmlAttribute, 'Element');

                    if (!this.handle || !node.handle)
                        return;

                    var attr_name = node.name;
                    if (!attr_name)
                        return;

                    if (node._parent_node != null)
                        raiseInUseAttributeException('setAttributeNodeNS');

                    var attributes = this.attributes;
                    if (attributes)
                    {
                        var rep_node = attributes.setNamedItemNS(node);
                        if (rep_node)
                        {
                            rep_node._parent_node = null;
                            return rep_node;
                        }
                    }
                };

                // isEqualNode
                _pXmlElement.isEqualNode = function isEqualNode(other)
                {
                    assertRequired(isEqualNode.name, isEqualNode.length, arguments.length, 'Element');
                    assertTypeOrNull(isEqualNode.name, 1, other, nexacro.XmlElement, 'Element');

                    if (!other || !other.handle)
                        return false;

                    if (this._node_type !== other._node_type)
                        return false;

                    var isEqual = (this.namespaceURI == other.namespaceURI);

                    if (isEqual) isEqual = this.prefix == other.prefix;
                    if (isEqual) isEqual = this.tagName == other.tagName;

                    if (isEqual) isEqual = this.attributes.length == other.attributes.length;
                    if (isEqual) 
                    {
                        let cnt = this.attributes.length;
                        for (var i = 0; i < cnt; i++)
                        {
                            isEqual = this.attributes[i].isEqualNode(other.attributes[i]);
                            if (!isEqual) break;
                        }
                    }

                    if (isEqual) isEqual = this.childNodes.length == other.childNodes.length;
                    if (isEqual) 
                    {
                        let cnt = this.childNodes.length;
                        for (var i = 0; i < cnt; i++)
                        {
                            isEqual = this.childNodes[i].isEqualNode(other.childNodes[i]);
                            if (!isEqual) break;
                        }
                    }


                    return isEqual;
                };

                return Element;
            })();


            //==============================================================================
            // Attribute
            nexacro.XmlAttribute = (function ()
            {
                var Attr = function (doc)
                {
                    nexacro.XmlNode.call(this, doc);
                };

                var _pXmlAttribute = nexacro._createPrototype(nexacro.XmlNode, Attr);
                Attr.prototype = _pXmlAttribute;

                _pXmlAttribute._type_name = "Attr";

                _pXmlAttribute._local_name = "";
                _pXmlAttribute._node_type = 2;

                //////////////////////////////////////////////////////////////////////////
                // property getter/setter

                // localName
                const get_localName = function ()
                {
                    if (!this.handle)
                        return "";

                    var node_name = this._local_name;
                    if (!node_name)
                    {
                        node_name = this._local_name = nexacro.__xmlGetNodeName(this.handle);
                        return node_name;
                    }
                    return node_name;
                };
                Object.defineProperty(_pXmlAttribute, "localName", { get: get_localName, configurable: false });

                // nodeName
                const get_nodeName = function ()
                {
                    if (!this.handle)
                        return "";

                    var node_name = nexacro.__xmlGetNodeName(this.handle);

                    var prefix = this.prefix;
                    if (prefix)
                        node_name = prefix + ':' + node_name;

                    return node_name;
                };
                Object.defineProperty(_pXmlAttribute, "nodeName", { get: get_nodeName, configurable: false });

                Object.defineProperty(_pXmlAttribute, "name", { get: get_nodeName, configurable: false });
                Object.defineProperty(_pXmlAttribute, "value", { get: function () { return this.nodeValue; }, set: function (val) { return this.nodeValue = val; }, configurable: false });

                // isEqualNode
                _pXmlAttribute.isEqualNode = function isEqualNode(other = required('isEqualNode', 1, 'Attr'))
                {
                    assertTypeOrNull('isEqualNode', 1, other, nexacro.XmlAttribute);

                    if (!other || !other.handle)
                        return false;

                    if (this._node_type !== other._node_type)
                        return false;

                    var isEqual = this.namespaceURI == other.namespaceURI;

                    if (isEqual) isEqual = this.name == other.name;
                    if (isEqual) isEqual = this.value == other.value;

                    return isEqual;
                };

                return Attr;
            })();

            //==============================================================================
            // CharacterData Node
            nexacro.XmlCharacterData = (function ()
            {
                var CharacterData = function (doc)
                {
                    nexacro.XmlNode.call(this, doc);
                };

                var _pXmlCharacterData = nexacro._createPrototype(nexacro.XmlNode, CharacterData);
                CharacterData.prototype = _pXmlCharacterData;

                _pXmlCharacterData._type_name = "CharacterData";

                //////////////////////////////////////////////////////////////////////////
                // property getter/setter

                // data
                Object.defineProperty(_pXmlCharacterData, "data", { get: function () { return this.nodeValue; }, configurable: false });

                // length
                const get_length = function ()
                {
                    if (!this.handle)
                        return null;

                    return nexacro.__xmlGetContentsLength(this.handle);
                };
                Object.defineProperty(_pXmlCharacterData, "length", { get: get_length, configurable: false });

                //////////////////////////////////////////////////////////////////////////
                // methods

                // appendData
                _pXmlCharacterData.appendData = function appendData(string)
                {
                    assertRequired(appendData.name, appendData.length, arguments.length, 'CharacterData');

                    if (!this.handle)
                        return;

                    nexacro.__xmlAppendContentsData(this.handle, string);
                    this._node_value = undefined;
                };
                // deleteData
                _pXmlCharacterData.deleteData = function deleteData(start = 0, length = -1)
                {
                    if (!this.handle)
                        return;

                    if (length < 0)
                    {
                        length = this.length;
                    }

                    if (start < 0 || start > this.length)
                    {
                        raiseGreaterThanSizeException('insertData', 'CharacterData');
                    }

                    nexacro.__xmlDeleteContentsData(this.handle, start, length);
                    this._node_value = undefined;
                };
                // insertData
                _pXmlCharacterData.insertData = function insertData(start, string)
                {
                    assertRequired(insertData.name, insertData.length, arguments.length, 'CharacterData');

                    if (!this.handle)
                        return;

                    if (start < 0 || start > this.length)
                    {
                        raiseGreaterThanSizeException('insertData', 'CharacterData');
                    }

                    nexacro.__xmlInsertContentsData(this.handle, start, string);
                    this._node_value = undefined;
                };
                // replaceData
                _pXmlCharacterData.replaceData = function replaceData(start, length, string)
                {
                    assertRequired(replaceData.name, replaceData.length, arguments.length, 'CharacterData');

                    if (!this.handle)
                        return;

                    if (start < 0 || start > this.length)
                    {
                        raiseGreaterThanSizeException('replaceData', 'CharacterData');
                    }

                    nexacro.__xmlReplaceContentsData(this.handle, start, length, string);
                    this._node_value = undefined;
                };
                // splitText
                _pXmlCharacterData.splitText = function splitText(offset)
                {
                    assertRequired(splitText.name, splitText.length, arguments.length, 'CharacterData');

                    if (!this.handle)
                        return;

                    if (offset < 0 || offset > this.length)
                    {
                        raiseGreaterThanSizeException('splitText', 'CharacterData');
                    }

                    var new_handle = nexacro.__xmlSplitContentsText(this.handle, offset);
                    if (new_handle)
                    {
                        var text_node = createNodeObjectByType(this._owner_document, 3);
                        if (text_node)
                        {
                            text_node.handle = new_handle;

                            var parent_node = this._parent_node;
                            if (parent_node && parent_node._child_nodes)
                            {
                                xmlNodeListHelper.insertAfter(parent_node._child_nodes, text_node, this);
                            }
                            text_node._parent_node = parent_node;
                        }

                        this._node_value = undefined;
                        return text_node;
                    }
                };

                // isEqualNode
                _pXmlCharacterData.isEqualNode = function isEqualNode(other = required('isEqualNode', 1, 'CharacterData'))
                {
                    assertRequired(isEqualNode.name, isEqualNode.length, arguments.length, 'CharacterData');
                    assertTypeOrNull(isEqualNode.name, 1, other, nexacro.XmlText);

                    if (!other || !other.handle)
                        return false;

                    if (this._node_type !== other._node_type)
                        return false;

                    return this.data == other.data;
                };

                return CharacterData;
            })();


            //==============================================================================
            // Text Node
            nexacro.XmlText = (function ()
            {
                var Text = function (doc)
                {
                    nexacro.XmlCharacterData.call(this, doc);
                };

                var _pXmlText = nexacro._createPrototype(nexacro.XmlCharacterData, Text);
                Text.prototype = _pXmlText;

                _pXmlText._type_name = "Text";

                _pXmlText._node_type = 3;
                _pXmlText._node_name = "#text";

                return Text;
            })();


            //==============================================================================
            // CDATA-Section Node
            nexacro.XmlCDATASection = (function ()
            {
                var CDATA = function (doc)
                {
                    nexacro.XmlCharacterData.call(this, doc);
                };

                var _pXmlCDATASection = nexacro._createPrototype(nexacro.XmlCharacterData, CDATA);
                CDATA.prototype = _pXmlCDATASection;

                _pXmlCDATASection._type_name = "CDATA";

                _pXmlCDATASection._node_type = 4;
                _pXmlCDATASection._node_name = "#cdata-section";

                return CDATA;
            })();

            //==============================================================================
            // Comment Node
            nexacro.XmlComment = (function ()
            {
                var Comment = function (doc)
                {
                    nexacro.XmlCharacterData.call(this, doc);
                };

                var _pXmlComment = nexacro._createPrototype(nexacro.XmlCharacterData, Comment);
                Comment.prototype = _pXmlComment;

                _pXmlComment._type_name = "Comment";

                _pXmlComment._node_type = 8;
                _pXmlComment._node_name = "#comment";

                _pXmlComment.splitText = null;

                return Comment;
            })();


            //==============================================================================
            // document
            nexacro.XmlDocument = (function ()
            {
                var XmlDocument = function ()
                {
                };

                var _pXmlDocument = nexacro._createPrototype(nexacro.XmlNode, XmlDocument);
                XmlDocument.prototype = _pXmlDocument;

                _pXmlDocument._type_name = "XmlDocument";

                _pXmlDocument._node_type = 9;
                _pXmlDocument._node_name = "#document";

                //////////////////////////////////////////////////////////////////////////
                // property getter/setter
                _pXmlDocument._document_uri = "";

                // docType
                const get_docType = function ()
                {
                    if (!this.handle)
                        return null;

                    var doc_type = null;
                    var child_nodes = this.childNodes;
                    if (child_nodes && child_nodes.length)
                    {
                        var child = child_nodes[0];
                        while (child)
                        {
                            if (child._node_type == 10)
                            {
                                doc_type = child;
                                break;
                            }
                            child = child.nextSibling;
                        }
                    }

                    return doc_type;
                };
                Object.defineProperty(_pXmlDocument, "doctype", { get: get_docType, configurable: false });

                // documentElement
                const get_documentElement = function ()
                {
                    if (!this.handle)
                        return null;

                    var doc_element = null;

                    var child_nodes = this.childNodes;
                    if (child_nodes && child_nodes.length)
                    {
                        var child = child_nodes[0];
                        while (child)
                        {
                            if (child._node_type == 1)
                            {
                                doc_element = child;
                                break;
                            }
                            child = child.nextSibling;
                        }
                    }
                    return doc_element;
                };
                Object.defineProperty(_pXmlDocument, "documentElement", { get: get_documentElement, configurable: false });

                // documentURI
                const get_documentURI = function ()
                {
                    if (!this.handle)
                        return null;

                    var doc_uri = this._document_uri;
                    if (!doc_uri)
                    {
                        doc_uri = this._document_uri = nexacro.__xmlGetDocumentURI(this.handle);
                    }
                    return doc_uri;
                };
                Object.defineProperty(_pXmlDocument, "documentURI", { get: get_documentURI, configurable: false });

                //////////////////////////////////////////////////////////////////////////
                // methods

                _pXmlDocument.createAttribute = function createAttribute(name)
                {
                    assertRequired(createAttribute.name, createAttribute.length, arguments.length, 'Document');

                    if (!this.handle || !name)
                        return null;

                    var new_handle = nexacro.__xmlCreateAttribute(this.handle, name);
                    if (new_handle)
                    {
                        var new_node = createNodeObjectByType(this, 2);
                        if (new_node) new_node.handle = new_handle;
                        return new_node;
                    }
                    return null;
                };
                _pXmlDocument.createAttributeNS = function createAttributeNS(ns, name)
                {
                    assertRequired(createAttributeNS.name, createAttributeNS.length, arguments.length, 'Document');

                    if (!this.handle || !ns || !name)
                        return null;

                    // name is qualified name
                    var new_handle = nexacro.__xmlCreateAttribute(this.handle, name, ns);
                    if (new_handle)
                    {
                        var new_node = createNodeObjectByType(this, 2);
                        if (new_node)
                        {
                            new_node.handle = new_handle;
                            if (ns)
                            {
                                if (new_node.namespaceURI === null)
                                {
                                    new_node._namespace_uri = ns;
                                }

                                const colon = name.indexOf(':');
                                if (colon)
                                {
                                    new_node._prefix = name.substr(0, colon);
                                }
                                else
                                {
                                    new_node._prefix = "";
                                }
                            }
                        }

                        return new_node;
                    }
                    return null;
                };
                _pXmlDocument.createCDATASection = function createCDATASection(data)
                {
                    assertRequired(createCDATASection.name, createCDATASection.length, arguments.length, 'Document');

                    if (!this.handle)
                        return null;

                    var new_handle = nexacro.__xmlCreateCDATASection(this.handle, data);
                    if (new_handle)
                    {
                        var new_node = createNodeObjectByType(this, 4);
                        if (new_node) new_node.handle = new_handle;
                        return new_node;
                    }
                    return null;
                };
                _pXmlDocument.createComment = function createComment(data)
                {
                    assertRequired(createComment.name, createComment.length, arguments.length, 'Document');

                    if (!this.handle)
                        return null;

                    var new_handle = nexacro.__xmlCreateComment(this.handle, data);
                    if (new_handle)
                    {
                        var new_node = createNodeObjectByType(this, 8);
                        new_node.handle = new_handle;
                        return new_node;
                    }
                    return null;
                };
                _pXmlDocument.createDocumentFragment = function createDocumentFragmentfunction()
                {
                    if (!this.handle)
                        return null;

                    var new_handle = nexacro.__xmlCreateDocFragment(this.handle);
                    if (new_handle)
                    {
                        var new_node = createNodeObjectByType(this, 11);
                        if (new_node) new_node.handle = new_handle;
                        return new_node;
                    }
                    return null;
                };
                _pXmlDocument.createElement = function createElement(name)
                {
                    assertRequired(createElement.name, createElement.length, arguments.length, 'Document');

                    if (!this.handle || !name)
                        return null;

                    var new_handle = nexacro.__xmlCreateElement(this.handle, name);
                    if (new_handle)
                    {
                        var new_node = createNodeObjectByType(this, 1);
                        if (new_node) new_node.handle = new_handle;
                        return new_node;
                    }
                    return null;
                };
                _pXmlDocument.createElementNS = function createElementNS(ns, name)
                {
                    assertRequired(createElementNS.name, createElementNS.length, arguments.length, 'Document');

                    if (!this.handle || !ns || !name)
                        return null;

                    var new_handle = nexacro.__xmlCreateElement(this.handle, name, ns);
                    if (new_handle)
                    {
                        var new_node = createNodeObjectByType(this, 1);
                        if (new_node)
                        {
                            new_node.handle = new_handle;
                            if (ns)
                            {
                                if (new_node.namespaceURI === null)
                                {
                                    new_node._namespace_uri = ns;
                                }

                                const colon = name.indexOf(':');
                                if (colon)
                                {
                                    new_node._prefix = name.substr(0, colon);
                                }
                                else
                                {
                                    new_node._prefix = "";
                                }
                            }
                        }
                        return new_node;
                    }
                    return null;
                };
                _pXmlDocument.createTextNode = function createTextNode(text)
                {
                    assertRequired(createTextNode.name, createTextNode.length, arguments.length, 'Document');

                    if (!this.handle)
                        return null;

                    var new_handle = nexacro.__xmlCreateTextNode(this.handle, text);
                    if (new_handle)
                    {
                        var new_node = createNodeObjectByType(this, 3);
                        if (new_node) new_node.handle = new_handle;
                        return new_node;
                    }
                    return null;
                };
                // getElementsByTagName
                _pXmlDocument.getElementsByTagName = function getElementsByTagName(name)
                {
                    assertRequired(getElementsByTagName.name, getElementsByTagName.length, arguments.length, 'Document');

                    var elem_nodes = new nexacro.XmlNodeList();

                    if (!this.handle || !name)
                        return elem_nodes;

                    // tree link문제 - 동일한 native node에 대해 여러 개의 DOM 객체가 생김.
                    // => native call을 사용하지 않고 직접 search
                    var node = this.documentElement;
                    while (node)
                    {
                        if (node._node_type == 1)
                        {
                            if (name == "*" || node.tagName == name)
                                elem_nodes.push(node);

                            if (node.hasChildNodes())
                            {
                                const desc_elems = node.getElementsByTagName(name);
                                elem_nodes.push(...desc_elems);
                            }
                        }

                        node = node.nextSibling;
                    }
                    return elem_nodes;
                };
                // getElementsByTagNameNS
                _pXmlDocument.getElementsByTagNameNS = function getElementsByTagNameNS(ns, name)
                {
                    assertRequired(getElementsByTagNameNS.name, getElementsByTagNameNS.length, arguments.length, 'Document');

                    var elem_nodes = new nexacro.XmlNodeList();

                    if (!this.handle || !name)
                        return elem_nodes;

                    // tree link문제 - 동일한 native node에 대해 여러 개의 DOM 객체가 생김.
                    // => native call을 사용하지 않고 직접 search
                    var node = this.documentElement;
                    while (node)
                    {
                        if (node._node_type == 1)
                        {
                            if ((ns == "*" || node.namespaceURI == ns) &&
                                (name == "*" || node.localName == name))
                                elem_nodes.push(node);

                            if (node.hasChildNodes())
                            {
                                const desc_elems = node.getElementsByTagNameNS(ns, name);
                                elem_nodes.push(...desc_elems);
                            }
                        }

                        node = node.nextSibling;
                    }
                    return elem_nodes;
                };

                return XmlDocument;
            })();


            //==============================================================================
            // document type
            nexacro.XmlDocumentType = (function ()
            {
                var DocumentType = function (doc)
                {
                    nexacro.XmlNode.call(this, doc);
                };

                var _pXmlDocumentType = nexacro._createPrototype(nexacro.XmlNode, DocumentType);
                DocumentType.prototype = _pXmlDocumentType;

                _pXmlDocumentType._type_name = "DocumentType";

                _pXmlDocumentType._node_type = 10;

                // nodeName
                const get_nodeName = function ()
                {
                    if (!this.handle)
                        return "";

                    return nexacro.__xmlGetNodeName(this.handle);
                };
                Object.defineProperty(_pXmlDocumentType, "nodeName", { get: get_nodeName, configurable: false });

                Object.defineProperty(_pXmlDocumentType, "name", { get: get_nodeName, configurable: false });

                // publicId
                const get_publicId = function ()
                {
                    if (!this.handle)
                        return undefined;

                    return nexacro.__xmlGetPublicId(this.handle);
                };
                Object.defineProperty(_pXmlDocumentType, "publicId", { get: get_publicId, configurable: false });

                // systemId
                const get_systemId = function ()
                {
                    if (!this.handle)
                        return undefined;

                    return nexacro.__xmlGetSystemId(this.handle);
                };
                Object.defineProperty(_pXmlDocumentType, "systemId", { get: get_systemId, configurable: false });

                // isEqualNode
                _pXmlDocumentType.isEqualNode = function isEqualNode(other = required('isEqualNode', 1, 'DocumentType'))
                {
                    assertRequired(isEqualNode.name, isEqualNode.length, arguments.length, 'DocumentType');
                    assertTypeOrNull(isEqualNode.name, 1, other, nexacro.XmlDocumentType, 'DocumentType');

                    if (!other || !other.handle)
                        return false;

                    var isEqual = this.name == other.name;
                    if (isEqual) isEqual = this.publicId == other.publicId;
                    if (isEqual) isEqual = this.systemId == other.systemId;

                    return isEqual;
                };

                return DocumentType;
            })();
        })();

        nexacro._setBrowserErrorMsg = function ()
        {
            var errorcode = [
                "comm_http_400",
                "comm_http_404",
                "comm_http_405",
                "comm_http_500",
                "comm_http_503",
                "comm_http_499",
                "comm_http_599",
                "comm_http_401",
                "comm_http_402",
                "comm_http_403",
                "comm_http_406",
                "comm_http_407",
                "comm_http_408",
                "comm_http_301",
                "comm_http_302",
                "comm_http_305",
                "comm_http_307",
                "native_notexist_licensefile",
                "native_expire_license",
                "native_invalid_licensefile",
                "native_invalid_licensedate",
                "native_invalid_licenseactivation",
                "native_license_invaliddomain",
                "native_license_fail_parse",
                "native_license_invalidservice",
                "native_check_loadmodule",
                "msg_access_invalid_file",
                "msg_access_invalid_domain",
                "msg_access_invalid_cert",
                "msg_permit_folder",
                "msg_permit_domain",
                "msg_permit_cert",
                "range_argument",
                "msg_access_invalid_object",
                "msg_permit_object"
            ];

            var cnt = errorcode.length;
            //var error = [];
            for (var i = 0; i < cnt; i++)
            {
                var errormsg = nexacro._getErrorMessge(errorcode[i]);
                nexacro.__setBrowserErrorMsg(errorcode[i], errormsg);
            }
        };

        nexacro._initApplication = function ()
        {
            nexacro.__initApplication();
        };

        nexacro._appliedTitleBarHeight = function (frame, h)
        {
            if (nexacro.isPluginMode == true)
            {
                if (frame instanceof nexacro.MainFrame)
                    return 0;
            }

            return h;
        };

        nexacro._appliedStatusBarHeight = function (frame, h)
        {
            if (nexacro.isPluginMode == true)
            {
                if (frame instanceof nexacro.MainFrame)
                    return 0;
            }

            return h;
        };

        nexacro._isShowTitleBar = function (frame, show)
        {
            if (nexacro.isPluginMode == true)
            {
                if (frame instanceof nexacro.MainFrame)
                    return false;
            }
            return show;
        };

        nexacro._isShowStatusBar = function (frame, show)
        {
            if (nexacro.isPluginMode == true)
            {
                if (frame instanceof nexacro.MainFrame)
                    return false;
            }
            return show;
        };


        nexacro._isPluginMode = function ()
        {
            return nexacro.__isPluginMode();
        };

        nexacro._getUserAgent = function ()
        {
            return "";
        };

        nexacro._refreshCaret = function ()
        {

        };

        nexacro._deleteRefreshNode = function ()
        {

        };

        nexacro._applyZoomEdge = function () { };

        // dataprotocol
        nexacro._isRuntimeProtocol = function (name)
        {
            return nexacro.__isRuntimeProtocol(name);
        };

        nexacro._setProtocolVar = function (name, key, val)
        {
            nexacro.__setProtocolVar(name, key, val);
        };

        nexacro._getSupportedWebColor = function (val)
        {
            return nexacro._getWebColorFromXreColor(val);
        };

        nexacro._getSupportedWebCursor = function (cursor)
        {
            if (cursor != "auto")
            {
                return cursor;
            }
            return "default";
        };

        nexacro._getSupportedWebGradient = function (val)
        {
            return val;
        };

        nexacro._createdContents = function (form)
        {
            var _window = form._getWindow();
            var comps = form._p_components;
            var len = comps.length;
            var control_elem = form._control_element;
            var step_count = control_elem._step_count;
            var panels = [];
            if (step_count)
            {
                for (var i = 0; i < len; i++)
                {
                    var comp = comps[i];
                    if (comp._is_panel)
                        panels.push(comp);
                    else
                    {
                        var position_step = comp.getElement().position_step;

                        if (position_step < 0 || position_step < step_count)
                        {
                            comps[i].on_created(_window);
                        }
                    }
                }
                for (i = 0, len = panels.length; i < len; i++)
                {
                    panels[i].on_created(_window);
                }
            }
            else
            {
                for (var i = 0; i < len; i++)
                {
                    if (comps[i]._is_panel)
                        panels.push(comps[i]);
                    else
                        comps[i].on_created(_window);
                }
                for (i = 0, len = panels.length; i < len; i++)
                {
                    panels[i].on_created(_window);
                }
                panels = null;
            }
        };

        nexacro._setProjectURL = function (url)
        {
            var projecturl = nexacro._getProjectBaseURL(url);
            nexacro._project_absolutepath = projecturl;
            return projecturl;
        };

        nexacro._releaseImageUrl = function (url)
        {
            return nexacro.__releaseImageUrl(url);
        };

        nexacro._releaseImageViewUrl = function (url, w, h, strectch)
        {
            return nexacro.__releaseImageViewUrl(url, w, h, strectch);
        };

        nexacro._resizeImageViewManager = function (comp)
        {
            var resize_func = function (pThis)
            {
                return function ()
                {
                    if (pThis._resizemanager)
                    {
                        var curtime = new Date().getTime();
                        var lasttime = pThis._resizemanager._last_time;
                        var stop_interval = 30; //pThis._resizemanager._interval;

                        if ((curtime - lasttime) > stop_interval)
                        {
                            pThis._resizemanager.stop();
                            pThis._resizemanager = null;

                            if (pThis._image != null)
                            {
                                pThis._image._load_image();
                            }
                        }
                        else
                        {
                            pThis._resizemanager.start();
                        }
                    }
                };
            };

            if (comp.stretch != "none")
            {
                if (!comp._resizemanager)
                {
                    comp._resizemanager = new nexacro._ResizeManager(new nexacro.AnimationFrame(comp, resize_func(comp)));
                    comp._resizemanager.start();
                }
                comp._resizemanager.setLastTime(new Date().getTime());
            }
        };

        // env 초기화 
        //screen 결정 후 screen별 env 설정 
        nexacro._initEnvironment = function (screeninfo)
        {
            nexacro._initScreen(screeninfo);
        };

        nexacro._initScreen = function (screeninfo)
        {
            //runtime 엔진에서 screen을 select 한 후에 호출 
            nexacro._applySelectedScreen(screeninfo);
            nexacro._setCurrentScreen(screeninfo);
        };

        nexacro._getCurrentZoomfactor = function ()
        {
            return 1;
        };

        nexacro._getPositionFromTouch = function (touch)
        {
            return { x: touch.windowx, y: touch.windowy };
        };

        nexacro._getAddressBarHeight = function ()
        {
            return 0;
        };
        nexacro._getWindowSize = function (win)
        {
            return { width: nexacro._getWindowHandleClientWidth(win.handle), height: nexacro._getWindowHandleClientWidth(win.handle) };
        };
        nexacro._getWindowOffsetPosition = function (win)
        {
            return { left: 0, top: 0 };
        };

        nexacro._recordHeapSnapshot = function (v)
        {
            var bWrite = (v != undefined) ? nexacro._toBoolean(v) : true;
            nexacro.__recordHeapSnapshot(bWrite);//false이면 파일쓰기 안되고, true일 경우에만 파일쓰기가 됨;
        };

        nexacro._setRenderingType = function (v)
        {
            nexacro.__setRenderingType(nexacro._getMainWindowHandle(), v);
        };

        nexacro._gc = function ()
        {
            nexacro.__GC();
        };

        nexacro._getEnableWheelZoom = function (targetFrame)
        {
            var win = targetFrame._getWindow();
            if (win)
            {
                return win._getEnableWheelZoom();
            }
            return undefined;
        };

        nexacro._setEnableWheelZoom = function (targetFrame, newEnableWheelZoom)
        {
            var win = targetFrame._getWindow();
            if (win)
            {
                win._setEnableWheelZoom(newEnableWheelZoom);
            }
        };

        nexacro._getWheelZoom = function (targetFrame)
        {
            var win = targetFrame._getWindow();
            if (win)
            {
                return win._getWheelZoom();
            }
            return undefined;
        };

        nexacro._setWheelZoom = function (targetFrame, newWheelZoom)
        {
            var win = targetFrame._getWindow();
            if (win)
            {
                win._setWheelZoom(newWheelZoom);
            }
        };

        nexacro._isHybrid = nexacro._emptyFn;
        nexacro._isSameComponent = nexacro._emptyFn;
        nexacro._isWebView = nexacro._emptyFn;
        nexacro._get_invisible_obj = nexacro._emptyFn;
        nexacro._reset_invisible_obj = nexacro._emptyFn;
        nexacro._getTextDecoder = nexacro._emptyFn;
        nexacro.__setDOMStyle_TouchAction = nexacro._emptyFn;

        nexacro.__getHTMLStyle_TouchAction = function () 
        {
            return "";
        };

        nexacro._getWindowEvent = function ()
        {
            return undefined;
        };

        nexacro._getLbuttonupDelayTime = function ()
        {
            return 0;
        };

        if (nexacro._OS == "Android")
        { //Android
            nexacro._isSystemDateMode = function ()
            {
                return true;
            };
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

        nexacro._getCurrentBodyScrollTop = function ()
        {
            return 0;
        };

        nexacro._getTextAreaElementVscrollPos = function (input_elem)
        {
            return input_elem.getElementScrollHeight();
        };

        nexacro._getTextAreaElementHscrollPos = function (input_elem)
        {
            return input_elem.getElementScrollWidth();
        };

        nexacro._getBrowserEventName = function (evt_name)
        {
            return evt_name;
        };

        nexacro._userNotify = function (notifyid, message)
        {
            nexacro.__userNotify(notifyid, message);
        };

        nexacro._setSSVUnitTokenSeparator = function (v)
        {
            nexacro.__setSSVUnitTokenSeparator(v); // 0x1f
        };

        nexacro._setSSVRecordTokenSeparator = function (v)
        {
            nexacro.__setSSVRecordTokenSeparator(v); // 0x1e
        };

        nexacro._isDesignMode = function ()
        {
            if (nexacro.__isDesignMode && nexacro.__isDesignMode())
                return true;
            return false;
        };

        nexacro.__preventDefault = nexacro._emptyFn;
        nexacro.__setDOMStyle_overscrollBehavior = nexacro._emptyFn;
        nexacro._setHTMLPositionStyle = nexacro._emptyFn;
        nexacro._setKeydownInfo = nexacro._emptyFn;
        nexacro._getKeydownInfo = nexacro._emptyFn;

        nexacro._random = function ()
        {
            if (nexacro.__getRandomValue && nexacro.__getRandomValue())
                return nexacro.__getRandomValue();
            else
                return Math.random();
        };

        nexacro._localeCompare = function (val1, val2, locale, localeoption)
        {
            var locale_list = nexacro._localecollator_list;
            if (!locale_list)
                locale_list = nexacro._localecollator_list = {};
            var _lc = locale ? locale : locale = nexacro._BrowserLang.replace("_", "-"); //V8 system language error
            var _lco = localeoption ? localeoption : "";
            var collator = locale_list[_lc + _lco];
            if (!collator)
                collator = locale_list[_lc + _lco] = new Intl.Collator(locale, localeoption ? JSON.parse(localeoption) : localeoption);
            return collator.compare(val1, val2);
        };

        nexacro._supportedLocalesOf = function (locale, localeoption)
        {
            return Intl.Collator.supportedLocalesOf(locale);
        };

        nexacro._getResolvedOptions = function (locale, localeoption)
        {
            return new Intl.Collator(locale, localeoption).resolvedOptions();
        };

        nexacro._isSameDomain = nexacro._emptyFn;


        if (!nexacro.XMLHttpRequest)
        {
            //==============================================================================
            // nexacro.XMLHttpRequest
            //==============================================================================
            nexacro.XMLHttpRequest = function (id, parent)
            {
                this.id = this._p_name = id;
                if (parent)
                {
                    this._p_parent = parent;
                }

                this._headers = [];
            };

            var _pXMLHttpRequest = nexacro._createPrototype(nexacro.Object, nexacro.XMLHttpRequest);
            nexacro.XMLHttpRequest.prototype = _pXMLHttpRequest;
            _pXMLHttpRequest._type_name = "XMLHttpRequest";
            /* Description
             * 
             * - readyState
             * 
             * UNSENT = 0; // initial state
             * OPENED = 1; // open called
             * HEADERS_RECEIVED = 2; // response headers received
             * LOADING = 3; // response is loading (a data packed is received)
             * DONE = 4; // request complete
             * 
             * - status
             * 
             * Returns the status - number of a request
             * 200: "OK"
             * 403: "Forbidden"
             * 404: "Not Found"
             * 500 : "Internal Server Error"
             */

            _pXMLHttpRequest.status = 0;
            _pXMLHttpRequest.readyState = 0; //_UNSENT
            _pXMLHttpRequest.response = "";
            _pXMLHttpRequest.responseText = "";
            //_pXMLHttpRequest.responseXML = ""; //미지원
            _pXMLHttpRequest.onreadystatechange = null;
            _pXMLHttpRequest.responseURL = ""; //readonly
            //_pXMLHttpRequest.withCredentials = false;

            /* internal variable */
            _pXMLHttpRequest._handle = null;

            nexacro.XMLHttpRequest.UNSENT = 0;
            nexacro.XMLHttpRequest.OPENED = 1;
            nexacro.XMLHttpRequest.HEADERS_RECEIVED = 2;
            nexacro.XMLHttpRequest.LOADING = 3;
            nexacro.XMLHttpRequest.DONE = 4;

            _pXMLHttpRequest._UNSENT = 0;
            _pXMLHttpRequest._OPENED = 1;
            _pXMLHttpRequest._HEADERS_RECEIVED = 2;
            _pXMLHttpRequest._LOADING = 3;
            _pXMLHttpRequest._DONE = 4;

            _pXMLHttpRequest._url = "";
            _pXMLHttpRequest._method = "";
            _pXMLHttpRequest._async = "";
            _pXMLHttpRequest._user = "";
            _pXMLHttpRequest._pwd = "";
            _pXMLHttpRequest._protocol = "";
            _pXMLHttpRequest._responseType = "";
            _pXMLHttpRequest._is_aborted = false;
            //_pXMLHttpRequest._is_sent = false;
            //_pXMLHttpRequest._is_erred = false;
            /* event list */

            _pXMLHttpRequest._defaultHeaders =
            {
                "User-Agent": "node-XMLHttpRequest",
                "Accept": "*/*",
            }; //readonly

            _pXMLHttpRequest._forbiddenRequestHeaders =
                [
                    "accept-charset",
                    "accept-encoding",
                    "access-control-request-headers",
                    "access-control-request-method",
                    "connection",
                    "content-length",
                    "content-transfer-encoding",
                    "cookie",
                    "cookie2",
                    "date",
                    "expect",
                    "host",
                    "keep-alive",
                    "origin",
                    "referer",
                    "te",
                    "trailer",
                    "transfer-encoding",
                    "upgrade",
                    "via"
                ]; //readonly


            _pXMLHttpRequest._forbiddenRequestMethods =
                [
                    "TRACE",
                    "TRACK",
                    "CONNECT"
                ];//readonly

            //===============================================================
            // nexacro.XMLHttpRequest : Create & Destroy & Update
            //===============================================================

            _pXMLHttpRequest.destroy = function () 
            {
                if (this._handle)
                    this._handle = null;
                this._headers.length = 0;
            };

            //===============================================================
            // nexacro.XMLHttpRequest : Override
            //===============================================================

            //===============================================================
            // nexacro.XMLHttpRequest : Properties
            //===============================================================
            _pXMLHttpRequest.set_responseType = function (v)
            {
                if (this._responseType != v)
                {
                    this._responseType = v;
                    this.on_apply_responseType();
                }
            };

            _pXMLHttpRequest.get_responseType = function (v)
            {
                return this._responseType;
            };


            _pXMLHttpRequest.on_apply_responseType = function ()
            {
                //Todo
            };

            Object.defineProperty(_pXMLHttpRequest, "responseType", { get: _pXMLHttpRequest.get_responseType, set: _pXMLHttpRequest.set_responseType, configurable: false });

            _pXMLHttpRequest._onreadystatechange = function (errorcode, httpcode, errormessage, cookie, data, url)
            {
                this._init();

                if (data && (this.responseType == "" || this.responseType == "text"))
                    this.response = this.responseText = data;

                if (httpcode)
                    this.status = httpcode;

                if (httpcode === undefined || httpcode < 0)
                    this.status = 0;

                if (url)
                    this.responseURL = url;

                //if (httpcode == 200 || (this._method == "POST" && httpcode == 201))
                //    this.readyState = this._DONE;
                if (this.readyState != this._LOADING && arguments.length > 0)
                    this.readyState = this._DONE;

                if (this.onreadystatechange)
                    this.onreadystatechange.call(this);
            };
            //===============================================================
            // nexacro.XMLHttpRequest : Methods
            //===============================================================
            _pXMLHttpRequest.abort = function ()
            {
                var handle = this._handle;
                if (handle)
                {
                    var ret = nexacro.__abortHttpRequestHandle(handle);
                    if (ret == true)
                    {
                        this.readyState = 0;
                        this.status = 0;
                    }
                }
            };

            _pXMLHttpRequest.getAllResponseHeaders = function ()
            {
                var handle = this._handle;
                var respallheader;
                if (handle)
                {
                    respallheader = nexacro.__getAllResponseHeaderHttpRequestHandle(handle);
                }
                return respallheader;
            };

            _pXMLHttpRequest.getResponseHeader = function (name)
            {
                var handle = this._handle;
                var respheader;
                if (handle)
                {
                    respheader = nexacro.__getAllResponseHeaderHttpRequestHandle(handle);
                }

                if (respheader == null)
                {
                    return null;
                }

                var respheaders = [], respitems;
                var resplists = respheader.split(/\r\n|\n/);
                var len = resplists.length;
                for (var i = 0; i < len; i++)
                {
                    respitems = resplists[i];
                    if (respitems)
                    {
                        respitems = respitems.split(':');
                        if (respitems.length)
                        {
                            var value = (respitems.length > 1) ? respitems[1].trim() : null;
                            respheaders[respitems[0]] = value;
                        }
                    }
                }
                return respheaders[name];
            };

            _pXMLHttpRequest.open = function (method, url, async, user, password)
            {
                this.abort();
                //this._is_erred = false;

                if (!this._isAllowedHttpMethod(method)) 
                {
                    throw new Error("SecurityError: Request method not allowed");
                }

                if (url)
                {
                    try
                    {
                        var _url = this._url = nexacro._getServiceLocation(url, nexacro._project_absolutepath);
                        var urlarr = _url.split("://");
                        if (urlarr.length > 1)
                            this._protocol = urlarr[0];
                    }
                    catch (e)
                    {
                        throw new Error("SyntaxError : Failed to parse the url");
                    }
                }

                this._method = method;
                this._async = (typeof async !== "boolean" ? true : async);
                this._user = user || null;
                this._pwd = password || null;
                this._setReadyState(this._OPENED, true);
                this._is_sent = false;

                this._headers = [];

                this._handle = nexacro.__createHttpRequestHandle(this);
            };

            _pXMLHttpRequest.send = function (body)
            {
                var method = this._method;
                var async = this._async;
                var url = this._url;
                var user = this._user;
                var pwd = this._pwd;
                var headers = this._headers;

                //protocol
                //var ssl = false
                //var local = false;
                var protocol = this._protocol;
                //var host;
                //Todo
                if (this.readyState !== this._OPENED) 
                {
                    throw new Error("InvalidStateError: Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
                }

                if (this._is_sent) 
                {
                    throw new Error("InvalidStateError: Send has already been called");
                }
                /* Remove this conditional structure or edit its code blocks so that they're not all the same.
                switch (protocol)
                {
                    case "https":
                    case "http":
                        break;
                    case "file":
                    //    local = true;
                        break;
                    case undefined:
                    case null:
                    case "":
                        //host = "localhost";
                        break;
                    default:
                        //throw new Error("SyntaxError : Protocol is not supported.");
                        break;
                }
                */
                /*
                if (local)
                {
                    if (method !== "GET")
                    {
                        throw new Error("SyntaxError : only GET method is supported");
                    }
                }
                */

                if (body && (method == "GET" || method == "HEAD"))
                    body = null;

                var httpheaderstr = "";
                for (var i = 0; i < headers.length; i++)
                {
                    httpheaderstr += headers[i].name;
                    httpheaderstr += ":";
                    httpheaderstr += headers[i].value;
                    httpheaderstr += "\r\n";
                }

                var handle = this._handle;
                if (handle)
                {
                    try
                    {
                        nexacro.__requestHttpRequestHandle(handle, method, url, async, user, pwd, httpheaderstr, body, this._onreadystatechange, this._setReadyState);
                    }
                    catch (e)
                    {
                        throw new Error("NetworkError : " + e);
                    }
                    finally
                    {
                        this._is_sent = true;
                        if (!async)
                            this._setReadyState(this._DONE, false);
                        //this.readyState = this._DONE;
                    }
                    //Async onreadystatechange                
                    //    this._setReadyState(this._DONE); //Done
                }
            };

            _pXMLHttpRequest.setRequestHeader = function (name, value)
            {
                if (this.readyState !== this._OPENED) 
                {
                    throw new Error("InvalidStateError: Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.");
                }

                if (!this._isAllowedHttpHeader(name)) 
                {
                    throw new Error("SyntaxError : Refused to set unsafe header");
                }

                if (this._is_sent) 
                {
                    throw new Error("InvalidStateError : Send has already been called");
                }

                try
                {
                    var headers = this._headers, item;
                    for (var i = 0, len = headers.length; i < len; i++)
                    {
                        item = headers[i];
                        if (item.name == name)
                        {
                            if (item.value)
                                item.value += ', ' + value;
                            else
                                item.value = value;
                            return;
                        }
                    }
                    headers.push({ name: name, value: value });
                }
                catch (e)
                {
                    throw new Error("SyntaxError: Invalid header or value");
                }

            };
            //===============================================================
            // nexacro.XMLHttpRequest : Event handlers
            //===============================================================

            //===============================================================
            // nexacro.XMLHttpRequest : Logical Part
            //===============================================================

            _pXMLHttpRequest._setReadyState = function (state, is_onreadystatechange)
            {
                if (this._LOADING != state || this.readyState != state)
                {
                    this.readyState = state;
                    if (is_onreadystatechange && this.onreadystatechange)
                        this._onreadystatechange();
                }
            };

            _pXMLHttpRequest._isAllowedHttpHeader = function (header) 
            {
                return (header && this._forbiddenRequestHeaders.indexOf(header.toLowerCase()) === -1);
            };

            _pXMLHttpRequest._isAllowedHttpMethod = function (method) 
            {
                return (method && this._forbiddenRequestMethods.indexOf(method) === -1);
            };

            _pXMLHttpRequest._init = function ()
            {
                this.response = "";
                this.responseText = "";
                this.responseURL = "";
                this.status = 0;
            };

            //===============================================================
            // nexacro.XMLHttpRequest : Util Function
            //===============================================================
            _pXMLHttpRequest = null;
        } //if (!nexacro.XMLHttpRequest)

        //==============================================================================
        // nexacro.WebSocket
        //==============================================================================
        if (!nexacro.WebSocket)
        {
            nexacro.WebSocket = function ()
            {
                var protocol;
                var url = this.url = arguments[0];

                if (arguments.length >= 2) this.protocol = protocol = arguments[1];
                else this.protocol = protocol = "";

                this.readyState = 0;

                // Create Handle(Win32), ID(Android)
                this._id = nexacro.Device.makeID(); // ID (for Android)
                nexacro.Device._userCreatedObj[this._id] = this;

                this.onclose = null;
                this.onmessage = null;
                this.onopen = null;

                this.onsuccess = null;
                this.onerror = null;

                this._created_event_list = [];

                this._handle = null;

                // Check URL Compatibility
                //try { new URL(url);} catch (e) { error; }

                // Check URL : Scheme ws, wss only
                var schema = url.split(':');
                var urlScheme = schema[0];
                if (urlScheme == "ws" || urlScheme == "wss") { } // Normal Cases, ws/wss only in url
                else
                {
                    throw new Error("Failed to construct 'WebSocket': The URL's scheme must be either 'ws' or 'wss'. '" + urlScheme + "' is not allowed.");
                }

                // Check URL : no Fragment
                var fragments = url.split('#');
                if (fragments.length == 1) { } // Normal Cases, no fragment in url
                else
                {
                    // There is one and more fragments
                    var fragment = fragments[1];
                    throw new Error("Failed to construct 'WebSocket': The URL contains a fragment identifier ('" + fragment + "'). Fragment identifiers are not allowed in WebSocket URLs.");
                }

                if (nexacro._OS == "Windows")
                {
                    this._handle = nexacro.__createWebSocketHandle(this, url, this._onsuccess, this._onerror); // Handle (for Win32)
                }
                else if (nexacro._OS == "Android" || nexacro._OS == "OSX" || nexacro._OS == "Mac OS")
                {
                    var paramsObject = {};
                    paramsObject.url = url;

                    if (Object.prototype.toString.call(protocol) == "[object Array]")
                    {
                        paramsObject.protocol = protocol;
                    }
                    else if (Object.prototype.toString.call(protocol) == "[object String]")
                    {
                        paramsObject.protocol = [protocol];
                    }

                    var jsonstr = this.makeJSONString('"constructor"', JSON.stringify(paramsObject));

                    nexacro.Device.exec(jsonstr);
                }
            };

            var _pWebSocket = nexacro._createPrototype(nexacro.Object, nexacro.WebSocket);
            nexacro.WebSocket.prototype = _pWebSocket;
            _pWebSocket._type_name = "WebSocketClient";

            // ReadyState Contants
            _pWebSocket.CONNECTING = 0;
            _pWebSocket.OPEN = 1;
            _pWebSocket.CLOSING = 2;
            _pWebSocket.CLOSED = 3;

            // Attributes
            _pWebSocket.binaryType = "";
            _pWebSocket.bufferedAmount = 0;
            _pWebSocket.extensions = "";
            _pWebSocket.protocol = "";

            _pWebSocket.readyState = 0;

            // Object.defineProperty(_pWebSocket, "url", { get: _pVoiceRecognition.get_intentanalyzersvcurl, set: _pVoiceRecognition.set_intentanalyzersvcurl, configurable: false });


            //===============================================================
            // nexacro.WebSocket : Create & Destroy & Update
            //===============================================================

            _pWebSocket._destroy = function ()
            {
                // nexacro.__desroyWebSocketHandle(this._handle) // for Win32
                var params = {};
                var json = {
                    id: this._id,
                    div: "WebSocketClient",
                    method: "destroy",
                    params: params
                };

                var jsonstr = JSON.stringify(json);
                nexacro.Device.exec(jsonstr);

                this._created_event_list = null;
            };

            //===============================================================
            // nexacro.WebSocket : Methods
            //===============================================================

            _pWebSocket.close = function ()
            {
                this.readyState = this.CLOSING;

                var code = 1000;
                var reason = ""
                if (arguments.length > 0)
                {
                    code = arguments[0];
                }
                if (arguments.length > 1)
                {
                    reason = arguments[1];
                }

                var params = '""';

                if (code == 1000 || (code >= 3000 && code <= 4999)) { }
                else
                {
                    throw new Error("Failed to execute 'close' on 'WebSocket': The code must be either 1000, or between 3000 and 4999. " + code + " is neither.");
                }

                if (reason != null && this.lengthByUTF8(reason) > 123)
                {
                    throw (new Error("Failed to execute 'close' on 'WebSocket': The message must not be greater than 123 bytes."));
                }

                if (nexacro._OS == "Windows")
                {
                    nexacro.__desroyWebSocketHandle(this._handle, code, reason); // Handle (for Win32)
                    this.wshandle = null;
                }
                else if (nexacro._OS == "Android" || nexacro._OS == "OSX" || nexacro._OS == "Mac OS")
                {
                    var paramsObject = {};
                    paramsObject.code = code;
                    paramsObject.reason = reason;
                    var jsonstr = this.makeJSONString('"close"', JSON.stringify(paramsObject));
                    nexacro.Device.exec(jsonstr);
                }
            };

            _pWebSocket.lengthByUTF8 = function (str)
            {
                var m = encodeURIComponent(str).match(/%[89ABab]/g);
                return str.length + (m ? m.length : 0);
            };

            _pWebSocket.send = function (message)
            {
                if (this.readyState == this.CLOSING || this.readyState == this.CLOSED)
                {
                    throw new Error("WebSocket is already in CLOSING or CLOSED state.");
                }

                if (nexacro._OS == "Windows")
                {
                    var tranMsg;
                    var sendType = "binary";
                    if (typeof message == "object")
                    {
                        // KISA 보안취약점(6-2) 지적사항
                        //trace(message.length);
                        tranMsg = message.toString();
                    }
                    else
                    {
                        sendType = "string";
                        tranMsg = message;
                    }

                    nexacro.__sendWebSocketHandle(this._handle, sendType, this.bufferedAmount, this.extensions, this.protocol, tranMsg); // Handle (for Win32)
                }
                else if (nexacro._OS == "Android" || nexacro._OS == "OSX" || nexacro._OS == "Mac OS")
                {
                    var paramsObject = {};
                    paramsObject.binaryType = this.binaryType;
                    paramsObject.bufferedAmount = this.bufferedAmount;
                    paramsObject.extensions = this.extensions;
                    paramsObject.protocol = this.protocol;
                    paramsObject.message = message;
                    var jsonstr = this.makeJSONString('"send"', JSON.stringify(paramsObject));
                    nexacro.Device.exec(jsonstr);
                }
            };

            _pWebSocket.makeJSONString = function (method, params)
            {
                var jsonstr = '{"id":' + this._id;
                jsonstr += ', "windows_platform":"WIN32"';
                jsonstr += ', "div":"WebSocketClient"';
                jsonstr += ', "method":' + method;
                jsonstr += ', "params":' + params + '}';
                return jsonstr;
            };

            _pWebSocket.addEventListener = function (evt_id, func)
            {
                var eventObj = {};
                eventObj.eventid = evt_id;
                eventObj.func = func;
                this._created_event_list.push(eventObj);
            }

            _pWebSocket.removeEventListener = function (evt_id, func)
            {
                for (var i = 0; i < this._created_event_list.length; i++)
                {
                    var eventObj = this._created_event_list[i];
                    if (evt_id == eventObj.eventid && func == eventObj.func)
                    {
                        this._created_event_list.splice(i, 1);
                        break;
                    }
                }
            }

            _pWebSocket._onsuccess = function (objData)
            {
                var e;
                if (nexacro._OS == "Windows")// || nexacro._OS == "Android")
                {
                    //var objDataParsed = JSON.parse(objData);

                    this.wshandle = objData.wshandle;
                    e = new nexacro.WebSocketEventInfo(objData.eventid,
                        objData.wshandle,
                        objData.data ? objData.data : "",
                        objData.code ? objData.code : 0,
                        objData.reason ? objData.reason : "");
                }
                else if (nexacro._OS == "Android" || nexacro._OS == "OSX" || nexacro._OS == "Mac OS")
                {
                    e = new nexacro.WebSocketEventInfo(objData.eventid,
                        null, // for Windows only
                        objData.data ? objData.data : "",
                        objData.code ? objData.code : 0,
                        objData.reason ? objData.reason : "");
                }

                // Call Override Method
                if (objData.eventid == "onmessage")
                {
                    if (this.onmessage)
                    {
                        var messageEvent = { type: "message", data: e.data }; // set more message event values
                        this.onmessage.call(this, messageEvent);
                    }
                }
                else if (objData.eventid == "onopen")
                {
                    this.readyState = this.OPEN;
                    if (this.onopen)
                    {
                        var messageEvent = { type: "open" }; // set more message event values
                        this.onopen.call(this, messageEvent);
                    }
                }
                else if (objData.eventid == "onclose")
                {
                    this.readyState = this.CLOSED;
                    if (this.onclose)
                    {
                        var messageEvent = { type: "close", code: e.code, reason: e.reason }; // set more message event values
                        this.onclose.call(this, messageEvent);
                    }
                }

                // Call Event Listener Handle;
                for (var i = 0; i < this._created_event_list.length; i++)
                {
                    var eventObj = this._created_event_list[i];
                    if (objData.eventid == "on" + eventObj.eventid)
                    {
                        var messageEvent = { data: e.data, code: e.code, reason: e.reason };
                        eventObj.func(messageEvent);
                    }
                }
            };

            _pWebSocket._onerror = function (objData)
            {
                var e;

                if (nexacro._OS == "Windows") //|| nexacro._OS == "Android")
                {
                    //var objDataParsed = JSON.parse(objData);
                    e = new nexacro.WebSocketErrorEventInfo(objData.eventid, objData.message);
                }
                else
                {
                    e = new nexacro.WebSocketErrorEventInfo(objData.eventid, objData.code, objData.reason);
                }

                if (this.onerror)
                {
                    if (e.code == -1) // Exception cases
                    {
                        this.readyState = this.CLOSED;
                        throw (new Error(e.reason));
                    }
                    else
                    {
                        var messageEvent = { type: "error", reason: e.reason }; // set more message event values
                        this.onerror.call(this, messageEvent);
                    }
                }

                // Call Event Listener Handle;
                for (var i = 0; i < this._created_event_list.length; i++)
                {
                    var eventObj = this._created_event_list[i];
                    if (objData.eventid == "on" + eventObj.eventid)
                    {
                        var messageEvent = { data: e.data, code: e.code, reason: e.reason };
                        eventObj.func(messageEvent);
                    }
                }
            };

            _pWebSocket._fire_onerror = function (objWebSocket, WebSocketErrorEventInfo)
            {
                if (this.onerror && this.onerror._has_handlers)
                {
                    return this.onerror._fireEvent(this, WebSocketErrorEventInfo);
                }
                return true;
            };

            _pWebSocket = null;

            //==============================================================================
            // nexacro.WebSocketEventInfo
            //==============================================================================
            nexacro.WebSocketEventInfo = function (strEventId, wshandle, data, code, reason)
            {
                this.eventid = strEventId;
                this.wshandle = wshandle;

                this.data = data;
                this.code = code;
                this.reason = reason;

            };

            var _pWebSocketEventInfo = nexacro.WebSocketEventInfo.prototype = nexacro._createPrototype(nexacro.EventInfo, nexacro.WebSocketEventInfo);
            _pWebSocketEventInfo._type_name = "WebSocketEventInfo";

            _pWebSocketEventInfo = null;

            //==============================================================================
            // nexacro.WebSocketErrorEventInfo
            //==============================================================================

            nexacro.WebSocketErrorEventInfo = function (strEventId, code, reason)
            {
                this.eventid = strEventId;
                this.code = code;
                this.reason = reason;
            };

            var _pWebSocketErrorEventInfo = nexacro.WebSocketErrorEventInfo.prototype = nexacro._createPrototype(nexacro.EventInfo, nexacro.WebSocketErrorEventInfo);
            _pWebSocketErrorEventInfo._type_name = "WebSocketErrorEventInfo";

            _pWebSocketErrorEventInfo = null;

        }
    }
}