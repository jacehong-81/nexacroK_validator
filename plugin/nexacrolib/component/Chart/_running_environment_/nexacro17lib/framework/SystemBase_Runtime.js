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
	            msgs.push(arguments[i]);
	        }
	        var msg = msgs.join(' ');

	        nexacro._writeTraceLog(4, msg, false, nexacro._loglevel);

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
            } catch (e)
	        {

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
	    nexacro._use_translate_scroll = 1;

	    //==============================================================================
        nexacro.KeyCode_ImeInput = 229;

	    //==============================================================================
	    // error Function
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
                str += "\nat : " + __debuginfo;
            }
            nexacro._trace(str);
        };
    
        //==============================================================================
        nexacro._nCountAlertConfirm = 0;

        nexacro._alert = function (curFrame, str, caption, type)
        {
            var handle;
            if (curFrame._window)
            {
                curFrame._window._cancelEvent();
                handle = curFrame._window.handle;
            }
            else
                handle = nexacro._getMainWindowHandle();

            str = nexacro._toString(str);
            nexacro._nCountAlertConfirm++;
		    nexacro.__alert(handle, str, caption, type);
            nexacro._nCountAlertConfirm--;
	    };
        alert = function (text)
        {
            var application = nexacro.getApplication();
            if (application)
                var frm = application.alert(text, application.key, 0);
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
        
        nexacro._removeCookie = function(name)
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
    

		nexacro._print = function (pThis, refform, defaultprint, valign, halign, fitonepage, strOrientation)
		{
			var ret = false;
			var elem = pThis.getElement();
			if (elem && elem.handle)
			{
				var form_elem = refform.getElement();
				if (pThis._is_scrollable && elem._client_elem && elem._client_elem.handle)
				{
					ret = nexacro.__print(elem._client_elem.handle, form_elem.handle, defaultprint, valign, halign, fitonepage, strOrientation);
				}
				else
				{
					ret = nexacro.__print(elem.handle, form_elem.handle, defaultprint, valign, halign, fitonepage, strOrientation);
				}
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

        nexacro._saveToImageFile = function (pThis, fileName, fileType, compressOption, bIsOverflowClip)
        {
	        var elem = pThis.getElement();
	        if (elem && elem.handle)
            {
                if ((pThis._type_name == "Form") && elem._client_elem && elem._client_elem.handle && bIsOverflowClip)
                {
                    return nexacro.__saveToImageFile(elem._client_elem.handle, fileName, fileType, (compressOption == undefined) ? "" : compressOption, bIsOverflowClip);
		        }
		        else
		        {
                    return nexacro.__saveToImageFile(elem.handle, fileName, fileType, (compressOption == undefined) ? "" : compressOption, false);
		        }
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

        //==============================================================================
        nexacro._prepareManagerFrame = nexacro._emptyFn; 
        nexacro._destroyManagerFrame = nexacro._emptyFn; 
        nexacro._destroyPopupFrameInfo = function(win)
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
        nexacro._getTextSize = function (text, font, multiline, content_width, wordwrap, wordspacing, letterspacing, b_decoration)
        {
            if (text && text.length > 0 && font && font._sysvalue)
            {
    	        if (typeof (wordwrap) == "string")
    	            wordwrap = wordwrap.toLowerCase();

    	        if (wordwrap == true || wordwrap == "true")
    	            wordwrap = "char";
    	        else if (wordwrap == false || wordwrap == "false")
    	            wordwrap = "none";

    	        if (multiline)
    	        {
    	            if (content_width != null)
    	            {
    	                return nexacro.__getTextSize(text, font, wordwrap, content_width, wordspacing, letterspacing, b_decoration);
    	            }
    	            else
    	            {
    	                var lines = text.split(/\r\n|\n|\r/);
    	                var lcnt = lines.length;
    	                var text_width = 0;
    	                var text_height = 0;

    	                for (var i = 0; i < lcnt; i++)
    	                {
    	                    if (lines[i].length <= 0) lines[i] = "\r\n";
    	                    var line_size = nexacro.__getTextSize(lines[i], font, "none", content_width, wordspacing, letterspacing, b_decoration);
    	                    if (line_size[0] > text_width)
    	                        text_width = line_size[0];
    	                        text_height += line_size[1];//html에서는 높이*lcnt로 구하므로 약간의 차이 발생;

    	                }
    	                return [text_width, text_height];
    	            }
    	        }
    	        else
    	        {
    	            return nexacro.__getTextSize(text.replace(/\r\n|\n|\r/, ''), font, "none", content_width, wordspacing, letterspacing, b_decoration);
    	        }

    	    }
    	    return [0, 0];            
        };
	
        nexacro.getTextSize = function (text, font, width, wordwrap, wordspacing, letterspacing)
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

            var retn = nexacro._getTextSize(text, font, line, width, wordwrap, wordspacing, letterspacing);
            var obj = { nx: retn[0], ny: retn[1] };

            return obj;
        };

        nexacro._getLineCountWithWordwrap = nexacro._emptyFn; 

        nexacro._bind_imgloadhandler_onload_recall = nexacro._emptyFn; 
        nexacro._imgloadhandler_onload = nexacro._emptyFn; 
        nexacro._imgloadhandler_onerror = nexacro._emptyFn; 

        nexacro._getImageSize = function (src, callbackFn, pThis, base_url, org_src, basync)
	    {
	        if (!src) return null;
            if (src.substring(0, 4).toLowerCase() == "url(")
 			    src = src.substring(5, src.length - 2);
 			
            var imgurl;
            if (src.substring(0, 10).toLowerCase() == "data:image")
            {
                var comma_idx = src.indexOf(",");
                if (comma_idx > -1)
                {
                    var tmp = src.slice(comma_idx + 1, src.legnth);
                    src = "data:image;base64," + tmp;
                }
                imgurl = src;
            }
            else
            {
                imgurl = nexacro._getImageLocation(src, base_url);
            }

            if (imgurl)
            {
                if (org_src)
                {
                    org_src = org_src.toString();
                    org_src = nexacro._getURIValue(org_src);
                }
                var service = nexacro._getServiceObject(org_src ? org_src : src);
                var servicecachelevel = "none";
                var serviceversion = service.version;
                if (service.cachelevel == "static" || service.cachelevel == "session")
                {
                    var retval = nexacro._ImgInfoCacheList[imgurl];
                    if (retval) return retval;
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
                            servicecachelevel = service.cachelevel;
                    }
                    if (basync == false)
                    {
                        loadItem.handle = nexacro.__getImageSize(imgurl, nexacro.__bindLoadImageHandler(loadItem), servicecachelevel, serviceversion, basync);
                        var retval = nexacro._ImgInfoCacheList[imgurl];
                        if (retval) return retval;
                    }
                    else
                    loadItem.handle = nexacro.__getImageSize(imgurl, nexacro.__bindLoadImageHandler(loadItem), servicecachelevel, serviceversion);
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

            var imgurl = nexacro._getImageLocation(src, base_url);

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
                    var serviceversion = service.version;
                    if (service)
                    {
                        if (service.cachelevel == "session")
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
            if (url && url.substring(0, 17) == "data:image;base64")
            {
                return url;
            }
            return nexacro._getImageLocation(nexacro._getURIValue(url), baseurl);
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
            if (item_comp)
            {
                item_comp._file_changed(item_value, newvalue);
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
			var httpvariables = nexacro._getLocalStorageAll(5);
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
			var checkStr = "" + item_files;
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
    
        nexacro._download = function (url, handle, initname, targetpath, filefilter, filefilterindex, action)
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
        	var httpvariables = nexacro._getLocalStorageAll(5);
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
        	handle = nexacro.__downloadFileDownloadHandle(url, handle, initname, targetpath, httpheaderstr, undefined, undefined, undefined, filefilter, filefilterindex, action);
        	if (handle == null)
        	{
        		_application._endCommProgress();
        		return null;
        	}
		};

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
					var vfiles;
					if (files && files.length)
					{
						for (var i = 0, vfiles = []; i < files.length; i++)
						{
                            var vfile = new nexacro.VirtualFile("vfile" + (new Date().valueOf().toString()) + i, "");
							vfile.handle = null;

							vfile.filename = files[i].filename;
							vfile.fullpath = files[i].fullpath;
							vfile.path = files[i].path;

							vfiles.push(vfile);
						}
					}

					target.on_close(reason, path, vfiles);
				}
			};

			if (nexacro._OS == "Android")
			{
				target._id = nexacro.Device.makeID();
				nexacro.Device._userCreatedObj[target._id] = target;

				var params = '{"defaultextension":"' + target.defaultextension + '","filter":"' + target.filter + '","filterindex":"' + target.filterindex + '"}';

				var jsonstr = '{"id":' + target._id + ', "div":"FileDialog", "method":"constructor", "params":' + params + '}';
				nexacro.Device.exec(jsonstr);
			}

			return nexacro.__createFileDialogObject(target, callback_onclose(target));
		};
		nexacro._destroyFileDialogHandle = function (target)
		{
			if (nexacro._OS == "Android")
			{
				delete nexacro.Device._userCreatedObj[target._id];
				var jsonstr = '{"id":' + target._id + ', "div":"FileDialog", "method":"destroy", "params":""}';
				nexacro.Device.exec(jsonstr);
			}
		};
		nexacro._openFileDialogHandle = function (target, strTitle, constOpenMode, strInitialPath, strFileName, strDialogtype)
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
				return nexacro.__openFileDialogHandle(target._handle, winhandle, strTitle, constOpenMode, strInitialPath, strFileName);
			}
			else // android
			{
				if (strDialogtype === undefined || strDialogtype == "default")
				{
					var params = '{"strTitle":"' + strTitle
						+ '","constOpenMode":"' + constOpenMode + '","strInitialPath":"' + strInitialPath
						+ '","strFileName":"' + strFileName + '","defaultextension":"' + target.defaultextension
						+ '","filter":"' + target.filter + '","filterindex":"' + target.filterindex
						+ '","EnvironmentPath":"' + target.EnvironmentPath + '"}';
					var jsonstr = '{"id":' + target._id + ', "div":"FileDialog", "method":"open", "params":' + params + '}';
					nexacro.Device.exec(jsonstr);
				}
				else if (strDialogtype == "system")
				{
                    /*
                        TODO: Android 하이브리드에서 디바이스전용 파일선택UI떠야함.
                                우선은 기존 nexacro UI로 동작하도록 해둠. 작업후 주석삭제
                    */
				}
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
				return ""
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

					var strFullPath = filelist[i].split("\\").join("/");

					vfile._setFullPath(strFullPath);
					vfile._setPath(vfile._getPath(strFullPath));
					vfile._setFileName(vfile._getFileName(strFullPath));

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
				return function (status, data, url, errcode, httpcode, errmsg)
				{
					if (status < 0)
					{
						evttarget.on_error(9901, "", httpcode, url, index);
					}
					else if (status == 4)
					{
						var loaded = httpcode;
						var total = errmsg;
						evttarget.on_progress(loaded, total, index);
					}
					else
					{
						try
						{
							if (data)
							{
								data = data.trimLeft();
								var fstr = data.slice(0, 5).toUpperCase();
								if (fstr.indexOf("SSV") == 0)
								{
									data = nexacro._Deserializer["SSV"](data);
								}
								else if (fstr.indexOf("<?XML") == 0)
								{
									var response = nexacro._getXMLDocument(evttarget._unique_name, data, url);
									data = nexacro._Deserializer["XML"](response);
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
				var curFrame = evttarget.parent._getOwnerFrame();
				if (curFrame._window)
					winhandle = curFrame._window.handle;
				else
					winhandle = nexacro._getMainWindowHandle();
			}

			var HTTPVAR_SEPERATOR = "\r\n";
			var POSTDATA_SEPERATOR = "&";

			var httpheaderstr = "";
			var httpvariables = nexacro._getLocalStorageAll(5);
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
			
			if (!evttarget._handle)
			{
				evttarget._handle = nexacro.__createFileUploadHandle(evttarget._unique_name, callback_onload(), evttarget, winhandle);
			}

			nexacro.__submitFileUploadHandle("", url, evttarget._handle, null, "", httpheaderstr, transferitems, postdatastr);
		};

		nexacro._downloadTransfer = function (postdatalist, url, saveurl, evttarget)
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
				var curFrame = evttarget.parent._getOwnerFrame();
				if (curFrame._window)
					winhandle = curFrame._window.handle;
				else
					winhandle = nexacro._getMainWindowHandle();
			}

			var HTTPVAR_SEPERATOR = "\r\n";
			var POSTDATA_SEPERATOR = "&";

			var httpheaderstr = "";
			var httpvariables = nexacro._getLocalStorageAll(5);
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
			
			var postdatalistkeys = Object ? Object.keys(postdatalist) : "";
			for (var i = 0, len = postdatalistkeys.length, postdatastr = ""; i < len; i++)
			{
				postdatastr += postdatalistkeys[i];
				postdatastr += "=";
				postdatastr += postdatalist[postdatalistkeys[i]]
				postdatastr += (i < len - 1) ? POSTDATA_SEPERATOR : "";
			}

			if (postdatalist)
			{
				httpheaderstr += "Content-Type:application/x-www-form-urlencoded";
				httpheaderstr += HTTPVAR_SEPERATOR;
			}

			if (!evttarget._handle)
				evttarget._handle = nexacro.__createFileDownloadHandle(callback_onload(), evttarget, winhandle);

			nexacro.__downloadFileDownloadHandle(url, evttarget._handle, evttarget.downloadfilename, saveurl, httpheaderstr, postdatastr);
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
        nexacro.__checkAjaxStatus = nexacro._emptyFn;
        nexacro.__getHttpErrorCode = nexacro._emptyFn; 

        nexacro.__bindLoadModuleHandler = function (pthis)
	    {
            return function (status, data, fireerrorcode, returncode, locationurl, extramsg)
            {
            	var callbackList = pthis.callbackList.slice(0);

			    if (status < 0)
			    {
			    	var item = null;

			    	if (callbackList.length > 0)
			    	{
			    		while (item = callbackList.pop())
			    		{
			    			var target = item.target;
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
			    		var item = null;

			    		if (callbackList.length > 0)
			    		{
			    			while (item = callbackList.pop())
			    			{
			    				var target = item.target;
			    				if (target && target.context && target._use_transition_effect)
			    				{
			    					target.context.parent.cancelTransitionEffect();
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
        nexacro.__bindLoadTextHandler = function (pthis)
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
				    pthis.on_load_text(data);
				    nexacro.__refreshDirtyWindow(pthis.context ? (pthis.context._is_component ? pthis.context._getWindowHandle() : null) : null);
				    pthis = null;
			    }
		    };
	    };
        nexacro.__checkloadData = nexacro._emptyFn; 
        nexacro.__bindLoadDataHandler = function (pthis)
	    {
            return function (status, data, cookie, fireerrorcode, returncode, locationurl, extramsg)
		    {
			    if (status < 0)
			    {  
			        if (status == -9)// cancel
			        {
			            pthis.on_error(0, "comm_cancel_byuser", nexacro._CommunicationStatusTable.cancel_byuser);
			        }
			        else
			        {
			            pthis.on_error(status, fireerrorcode, returncode, locationurl, extramsg);
			        }
			        nexacro.__refreshDirtyWindow(pthis.context ? (pthis.context._is_component ? pthis.context._getWindowHandle() : null) : null);
				    pthis = null;
			    }
			    else if (status == 0)
			    {
			        pthis.on_load_data(data, cookie);
			        nexacro.__refreshDirtyWindow(pthis.context ? (pthis.context._is_component ? pthis.context._getWindowHandle() : null) : null);
			        //pthis = null;
			    }
			    else if (status > 0)        // 4 : on_progress
                {
                    pthis.on_progress_data(data, false);

                    if (pthis instanceof nexacro.TransactionItem)
                    {
                        if (data && !pthis._progress_data) //data가 있는데 처리되지 않은 경우 = 타입정보를 확인할수 없는 경우
                        {
                            if (pthis._protocol < 0) { //사용자 지정 프로토콜 정보가 있으면 
                                data = pthis.on_decrypt(data);
                                if (data) {
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

			        nexacro._ImgInfoCacheList[pthis.path] = { width: width, height: height };
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
			            delete target_wins;
			        }
			        else
			        {
			            nexacro.__refreshDirtyWindow(pthis.context ? (pthis.context._is_component ? pthis.context._getWindowHandle() : null) : null);
			        }
				    pthis = null;
			    }
		    };
	    };

	    nexacro.__bindLoadUpdateHandler = function (pthis)
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

	        var bindfn = null;
	        if (loadItem.type == "module")
		    {
		        bindfn = nexacro.__bindLoadModuleHandler(loadItem);    
		    }
		    else if (loadItem.type == "data")
		    {
			    bindfn = nexacro.__bindLoadDataHandler(loadItem);
		    }
		    else if (loadItem.type == "image")
		    {
			    bindfn = nexacro.__bindLoadImageHandler(loadItem);
		    }
		    else if (loadItem.type == "text")// text
		    {
			    bindfn = nexacro.__bindLoadTextHandler(loadItem);
		    }
		    else if (loadItem.type == "css")// css
		    {
		        bindfn = nexacro.__bindLoadTextHandler(loadItem);

		        ndatatype = nexacro._getCSSTypeCode(senddata);
		    }
		    else //for update 
            {
		        bindfn = nexacro.__bindLoadUpdateHandler(loadItem);
            }

	        var url;
	        if (handlewrap._protocol == 0 || handlewrap._protocol == 1)
	            url = encodeURI(path);
	        else
	            url = decodeURI(path);

	        var refer_url = decodeURI(referer);

	        var servicecachelevel = "none";
	        if (service)
	        {
	            if (service.cachelevel == "session")
	            servicecachelevel = "dynamic";
	            else
	                servicecachelevel = service.cachelevel;
	        }

	        if (!ver)
	            ver = service.version;

	        var httpheaderstr = "";
	        var protocoladp = nexacro._getProtocol(loadItem.protocol);

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

	        var httpvariables = nexacro._getLocalStorageAll(5);
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

	        handlewrap.handle = nexacro.__startLoad(url, bindfn, loadItem.type, servicecachelevel, async, refer_url, senddata, ndatatype, compress, ver, failpass, httpheaderstr);
	        return handlewrap;
	    };
	
	    nexacro.__cancelCommunication = function (handle)
	    {
	        var _handle = handle.handle;
	        return nexacro.__cancelLoad(_handle);
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
	    };

	    var _pProgressBufferManager = nexacro._createPrototype(nexacro.Object, nexacro._ProgressBufferManager);
	    nexacro._ProgressBufferManager.prototype = _pProgressBufferManager;

	    _pProgressBufferManager._isLoadedFirstCount = function ()
	    {
	        return this._is_loaded_firstcount;
	    };

	    delete _pProgressBufferManager;

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
	        this._rs;                       //record separator
	        this._cs;                       //column(unit) separator

	        this._data_type = null;               // SSV,CSV,PPX
	        this._parse_mode = 0;               //["root","header", "parameters", "dataset", "constcolinfo", "collinfo", "record","JSON_id","JSON_string"]
	        this._load_completed = false;       //      
	        this._parsed_errorcd = false;
	        this._applychanged_inds = false;

	        this._parameters = [];
	        this._datasets = {};                // buffer of datasets
	        this._datasets_in_seq = [];
	        this._cur_dataset_id = "";          // id of dataset that it is being processed...

	        this._error_info = [0, "SUCCESS"];  // received error information

	        this._parsing_min_size = 1024 * 4;      // it's minimum size of parsing ;

	        this._init();
	    };

	    var _pProgressData = nexacro._createPrototype(nexacro.Object, nexacro._ProgressData);
	    nexacro._ProgressData.prototype = _pProgressData;

	    _pProgressData._init = function ()
	    {
	        var out_datasets = this._parent.outputDatasets;
	        var form = this._parent.context;

	        if (out_datasets && out_datasets.length)
	        {
	            var outDataCnt = out_datasets.length;

	            for (var i = 0; i < outDataCnt; i++)
	            {
	                var param = out_datasets[i];
	                if (!this._datasets[param.rval])
	                {
	                    var ds = form._getDatasetObject(param.lval);
	                    var type = param.saveType;

	                    if (ds)
	                    {
	                        this._datasets[param.rval] = new nexacro._ProgressBufferManager(ds);
	                        if (type && type == "P")     //AppendMode 
	                        {
	                            this._datasets[param.rval]._is_appending = true;
	                            if (nexacro._use_firefirstcount)
	                                this._datasets[param.rval]._is_loaded_firstcount = true; // ignore firstcount
	                            this._datasets[param.rval]._is_first_load = false;      // do not clear dataset
	                            if (ds.colinfos && ds.colinfos.length > 0)
	                                this._datasets[param.rval]._useclientlayout = true;     // use client layout
	                        }

	                    }
	                }
	            }
	        }
	    };

	    _pProgressData._applyChangeInputDataset = function ()
	    {
	        // inputDatasets
	        var in_datasets = this._parent.inputDatasets;
	        var form = this._parent.context;

	        if (in_datasets && in_datasets.length)
	        {
	            var in_ds_cnt = in_datasets.length;
	            for (var i = 0; i < in_ds_cnt; i++)
	            {
	                var param = in_datasets[i];
	                var ds = form._getDatasetObject(param.rval);
	                if (ds)
	                {
	                    ds.applyChange();
	                }
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
	            //data = null;
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
            var datasetloadtype = env.datasetloadtype;

            var error_cd = this._error_info[0];
            if (error_cd <= -1 && datasetloadtype == "onsuccess")
                return;

             this._parse(bFinal);
	    };

	    _pProgressData._needParseForFirstCount = function ()
	    {
	        if (!nexacro._use_firefirstcount)
	            return false;

	        for (var buff_ds in this._datasets)
	        {
	        	if (this._datasets.hasOwnProperty(buff_ds))
	        	{
	        	    if (!this._datasets[buff_ds]._isLoadedFirstCount())
	        			return true;
	        	}
	        }
	        return false;
	    };

	    _pProgressData._needParseForProgressLoad = function ()
	    {
	        if (!nexacro._use_progress_data)
	            return false;

	        for (var buff_ds in this._datasets)
	        {
	            if (this._datasets.hasOwnProperty(buff_ds))
	            {
	                if (this._datasets[buff_ds]._progressload)
	                    return true;
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
	        }
	        else
	            return false;

	        return true;
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
	    _pProgressData._parseParameters = function ()
	    {
	        var line = "", i;

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
	                line = this._data_buffer[this._cur_idx[0]].substring(this._cur_idx[1], n);

	        }
	        else
	            return false;

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
	                    if (typeof (form[id]) != "object")
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
	    };

	    _pProgressData._parseDataset = function ()
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

	        var cur_buffer_obj;
	        if (this._cur_dataset_id)
	        {
	            cur_buffer_obj = this._datasets[this._cur_dataset_id];
	            cur_buffer_obj._row_end_idx = this._cur_idx;
	        }

	        var sep_pos = line.indexOf(":");
	        if (sep_pos > 0)
	        {
	            var remoteId = line.substring(sep_pos + 1);

	            if (this._cur_dataset_id)
	            {
	                cur_buffer_obj = this._datasets[this._cur_dataset_id];
	                cur_buffer_obj._row_end_idx = this._cur_idx;
	            }

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
	        }
	        //else skip

	        this._cur_idx = this._getNextIdx([next_buffer_idx, n + rs_len]);

	        return true;
	    };

	    _pProgressData._parseColInfo = function ()
	    {
	        var nrp = this._getNextRecordPos(this._cur_idx);

            var n = nrp[0];
	        var next_buffer_idx = nrp[1];
	        var rs_len = nrp[2];

	        if (n >= 0)
	        {
	            if (this._cur_dataset_id)
	            {
	                var buffer_obj = this._datasets[this._cur_dataset_id];               
	                if (!buffer_obj._colinfo_start_idx)
                    {                        
                        buffer_obj._colinfo_start_idx = new Array(this._cur_idx[0], this._cur_idx[1]);
	                }

                    buffer_obj._colinfo_end_idx = new Array(next_buffer_idx, n);
	            }
	        }
	        else
            {
	            this._parse_mode = 3;
	            return false;
	        }

	        this._cur_idx = this._getNextIdx([next_buffer_idx, n + rs_len]);

            return true;
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
	    _pProgressData._parseRecord = function ()
	    {
	        var nrp = this._getNextRecordPos(this._cur_idx);

	        var n = nrp[0];
	        var next_buffer_idx = nrp[1];
	        var rs_len = nrp[2];
	        var buffer_obj, firstcount = 0;

	        if (this._cur_dataset_id)
	        {
	            buffer_obj = this._datasets[this._cur_dataset_id];

	            if (!buffer_obj._row_start_idx)
	            {
	                buffer_obj._row_start_idx = new Array(this._cur_idx[0], this._cur_idx[1]);
	            }
	        }
	        else
	            return false;

	        if (n < 0)
	        {
	            return false;
	        }	        

            if (this._data_type == "SSV" || this._data_type == "PPX")
            {
                var rowtype = this._data_buffer[this._cur_idx[0]].charAt(this._cur_idx[1]);
                if (rowtype != "d" || rowtype != "D")
                    buffer_obj._viewrecords_length++;
            }
            else
                buffer_obj._viewrecords_length++;

	        this._cur_idx = this._getNextIdx([next_buffer_idx, (n + rs_len)]);

	        if (nexacro._use_firefirstcount)
	        {
	            firstcount = buffer_obj._firefirstcount;

	            if (buffer_obj && buffer_obj._viewrecords_length == firstcount && firstcount > 0)
	            {
	                buffer_obj._firstrow_end_idx = new Array(next_buffer_idx, n);
	                return false;
	            }
	        }
	      
	        return true;
	    };


	    _pProgressData._parse = function (bFinal)
	    {
	        var bLoop = true;
            var param_parsed = false;
            var buffer_obj, val;
            var env = nexacro.getEnvironment();
            var datasetloadtype = env.datasetloadtype;
            	        
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
	                        buffer_obj = this._datasets[this._cur_dataset_id];

	                        if (nexacro._use_firefirstcount)
	                        {
	                            if (buffer_obj && buffer_obj._viewrecords_length == buffer_obj._firefirstcount && !buffer_obj._is_loaded_firstcount)   //check firstrow and do firstrow processing...
	                            {
	                                    this._on_fire_onload(buffer_obj, 1);
	                                buffer_obj._is_loaded_firstcount = true;
	                                bLoop = true;
	                            }
	                        }
	                        else
	                        {
	                            if (!bFinal && buffer_obj._progressload)
	                            {
	                                this._on_fire_onload(buffer_obj, 1);
	                            }	                        	                                

	                        }
	                    }
	                    break;
	                case 9: //skip
	                    break;
	                case 10:                    //on_fire_on_load(0,"",0)
	                    buffer_obj = this._datasets[this._cur_dataset_id];
	                    if (!buffer_obj._isEnable)
	                        continue;

	                    this._on_fire_onload(buffer_obj, 0);
	                    buffer_obj._is_loaded = true;
	                    this._parse_mode = 9;

	                    break;
	                default:
	                    break;
	            }
	        }

	        if (bFinal)
            {
	            // outputDatasets
	            //for (var val in this._datasets)
	            for (var i = 0; i < this._datasets_in_seq.length; i++)
	            {
	                val = this._datasets_in_seq[i];
	                buffer_obj = this._datasets[val];
	                if (!buffer_obj._isEnable || buffer_obj._is_loaded)
	                {
	                    if (!this._parent.bcache)
	                    this._datasets[val] = null;
	                    continue;
	                }

	                this._on_fire_onload(buffer_obj, 0);
	                if (!this._parent.bcache)
	                this._datasets[val] = null;
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
	       
	        //this._cur_idx = this._getNextIdx(end_idx);
            data = this._getBufferDataByIdx(start_idx, end_idx, bClear);

	        return data;
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
	    		    //var len = this._data_buffer[idx[0]].length;
	    		    if (this._data_buffer[idx[0]].length == idx[1])
	    		    {
	    		        idx[1] -= this._rs.length;
	    		    }	    		        

	    		    var buff = this._data_buffer[idx[0]].slice(idx[1], this._data_buffer[idx[0]].length);
	    		    if (this._data_buffer[idx[0] + 1])
	    		        buff += this._data_buffer[idx[0] + 1].slice(0, 7);
	    			    
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

	    _pProgressData._on_fire_onload = function (bufferObj, nLoadType)
	    {	      
	        var ds = bufferObj._target_ds;
	        var data = "";
	        var line_idx;
	        var rs = this._rs;

	        ds._bWorkingstatus = true;
	        if (!bufferObj._colLines)
	        {	    
	            var colInfoData = this._getBufferDataByIdx(bufferObj._colinfo_start_idx, bufferObj._colinfo_end_idx);
	            bufferObj._colLines = colInfoData.split(rs);
	        }

	        //var cnt = 0;
	        var bLoop = true;
	        while (bLoop)
	        {
	            if (nLoadType == 1)
	            {	                
	                if (nexacro._use_firefirstcount)
	                {
	                    data = this._getBufferDataByIdx(bufferObj._row_start_idx, bufferObj._firstrow_end_idx);

	                    var nrp = this._getNextRecordPos(bufferObj._firstrow_end_idx);

	                    //bufferObj._next_load_idx = [];

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
	                    data = this._getBufferData(bufferObj, nLoadType, false);	                    
	                }

	               
	                bLoop = false;	                
	            }
	            else
	            {
	                data = this._getBufferData(bufferObj, nLoadType, false);
	            }

	            if (data.length == 0) bLoop = false;

                var lines = data.split(new RegExp(rs));

                if (bufferObj._progress_status == 0)
	                ds.rowposition = -1;
	            switch (this._data_type)
	            {
	                case "CSV":
	                    line_idx = ds._loadFromCSVArray(bufferObj._colLines[0], lines, 0, -1, bufferObj._useclientlayout, bufferObj._is_first_load);
	                    break;
	                case "SSV":	                   
	                    line_idx = ds._loadFromSSVArray(bufferObj._colLines, lines, 0, -1, bufferObj._useclientlayout, bufferObj._is_first_load);
	                    break;
	                case "PPX":
	                    line_idx = ds._loadFromPPXArray(bufferObj._colLines, lines, 0, -1, bufferObj._useclientlayout, bufferObj._is_first_load);
	                    break;
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
	        }

	        if (ds.colinfos)
	        {
	        ds._reFilter();
	        ds._resetSortGroup();
	        }

	        if (ds._eventstat)
	        {
                var is_appending = bufferObj._is_appending;

                ds.on_fire_onload(0, "", is_appending ? 12 : nLoadType, (nLoadType == 1) ? true : ((bufferObj._progress_status != 0) ? true : false))//nexacro.Dataset.REASON_LOAD or nexacro.Dataset.REASON_APPEND
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
	        else if (ds._viewRecords.length > 0)
	        {
	            ds.rowposition = 0;
	        }
	        ds._bWorkingstatus = false;
	    };

	    _pProgressData._parseConstColInfo = nexacro._emptyFn;
	    _pProgressData._setNextParseMode = nexacro._emptyFn;

	    delete _pProgressData;

	    nexacro._ProgressDataCSV = function (parent)
	    {
	        nexacro._ProgressData.call(this, parent);
	        this._data_type = "CSV";

	        this._rs = ["\r\n", "\n"];
	        this._cs = ",";
	    };

	    var _pProgressDataCSV = nexacro._createPrototype(nexacro._ProgressData, nexacro._ProgressDataCSV);
	    nexacro._ProgressDataCSV.prototype = _pProgressDataCSV;

	    _pProgressDataCSV._setNextParseMode = function ()
	    {
	        var sec_type_max_len = 10;
	        var sec = "";
	        if (this._data_buffer[this._cur_idx[0]])
	            sec = this._data_buffer[this._cur_idx[0]].substr(this._cur_idx[1], sec_type_max_len);

//  	        if (sec.length < sec_type_max_len)
//  	        {
//  	            if (!this._data_buffer[this._cur_idx[0] + 1])
//  	                return false;
//  
//  	            sec += this._data_buffer[this._cur_idx[0] + 1].substr(0, sec_type_max_len - sec.length);
//  	            if (sec.length < sec_type_max_len)
//  	                return false;
//  	        }

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
	                    var buffer_obj = this._datasets[this._cur_dataset_id];

	                    if (!buffer_obj._use_firefirstcount || buffer_obj._isLoadedFirstCount())
	                    {
	                        var ndp = this._getNextDatasetPos(this._cur_idx);
	                        var n = ndp[0];
	                        var next_buffer_idx = ndp[1];
	                        var rs_len = ndp[2];
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
	                case 9: //skip
	                    var ndp = this._getNextDatasetPos(this._cur_idx);
	                    var n = ndp[0];
	                    var next_buffer_idx = ndp[1];
	                    var rs_len = ndp[2];	                   
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

	    delete _pProgressDataCSV;

	    nexacro._ProgressDataSSV = function (parent)
	    {
	        nexacro._ProgressData.call(this, parent);
	        this._data_type = "SSV";

	        this._rs = String.fromCharCode(30);
	        this._cs = String.fromCharCode(31);
	    };

	    var _pProgressDataSSV = nexacro._createPrototype(nexacro._ProgressData, nexacro._ProgressDataSSV);
	    nexacro._ProgressDataSSV.prototype = _pProgressDataSSV;

	    _pProgressDataSSV._setNextParseMode = function ()
	    {
	        var sec_type_max_len = 10;
	        var sec = "";
	        if (this._data_buffer[this._cur_idx[0]])
	            sec = this._data_buffer[this._cur_idx[0]].substr(this._cur_idx[1], sec_type_max_len);
//  	        if (sec.length < sec_type_max_len)
//  	        {
//  	            if (!this._data_buffer[this._cur_idx[0] + 1])
//  	                return false;
//  
//  	            sec += this._data_buffer[this._cur_idx[0] + 1].substr(0, sec_type_max_len - sec.length);
//  	            if (sec.length < sec_type_max_len)
//  	                return false;
//  	        }
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
	                    var buffer_obj = this._datasets[this._cur_dataset_id];
	                    if (!buffer_obj._use_firefirstcount || buffer_obj._isLoadedFirstCount())
	                    {
	                        var ndp = this._getNextDatasetPos(this._cur_idx);
	                        var n = ndp[0];
	                        var next_buffer_idx = ndp[1];
	                        var rs_len = ndp[2];
	                        if (n >= 0)
	                        {

	                            buffer_obj._row_end_idx = [next_buffer_idx, n];
	                            this._cur_idx = this._getNextIdx([next_buffer_idx, n + rs_len]);
	                            this._parse_mode = 10;      // fire onload                                
	                        }
	                        else
	                        {
	                            this._cur_idx = this._getNextIdx([next_buffer_idx, this._data_buffer[next_buffer_idx].length]);
	                          //  return false;
	                        }
	                    }
	                    break;
	                case 7://JSON_id
	                    this._parse_mode = 8;
	                    break;
	                case 8://JSON_string
	                    break;
	                case 9:
	                    var ndp = this._getNextDatasetPos(this._cur_idx);
	                    var n = ndp[0];
	                    var next_buffer_idx = ndp[1];
	                    var rs_len = ndp[2];
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

	    delete _pProgressDataSSV;

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
	                        var ndp = this._getNextDatasetPos(this._cur_idx);
	                        var n = ndp[0];
	                        var next_buffer_idx = ndp[1];
	                        var rs_len = ndp[2];

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
	                    var ndp = this._getNextDatasetPos(this._cur_idx);
	                    var n = ndp[0];
	                    var next_buffer_idx = ndp[1];
	                    var rs_len = ndp[2];

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
	            if (typeof (form[id]) != "object")
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

	    delete _pProgressDataPPX;
	    
	    //==============================================================================
        // XML Parse
        //==============================================================================

        nexacro._getXmlDom = nexacro._emptyFn; 
        nexacro._getXmlParser = nexacro._emptyFn; 

        nexacro._parseXMLDocument = function (str)
        {
            var handle = nexacro.__parseXMLDocument(str);
            var xmldoc = new nexacro.XmlDocument();
            if (xmldoc)
            {
                xmldoc.handle = handle;
            }
            return xmldoc; // TODO : set to DomDocument Object
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
	
        nexacro._getElementPositionInFrame = function (elem)
        {
            if (elem && elem.handle)
            {
                var pt = nexacro.__getElementPositionInFrame(elem.handle);
                if (elem._isRtl(this))
                {
                    var comp = elem.linkedcontrol;
                    var win = comp._getWindow();

                    pt[0] = win.getClientWidth() - pt[0] - comp.getPixelWidth();
                }
                return { x: pt[0], y: pt[1] };
            }
            return { x: 0, y: 0 };
        };

        nexacro._getPopupElementPositionInFrame = function (elem, left, top, width, height)
        {
            if (elem && elem.handle)
            {
                var pt = nexacro.__getPopupElementPositionInFrame(elem.handle);
                if (elem._isRtl(this))
                {
                    var comp = elem.linkedcontrol;
                    var win = comp._getWindow();

                    pt[0] = win.getClientWidth() - pt[0] - comp.getPixelWidth();
                }
                return { x: pt[0] + left, y: top > 0 ? pt[2] : pt[1] + top };
            }
            return { x: left, y: top };
        };

        nexacro.__getHTMLNodePositionInFrame = nexacro._emptyFn; 

        nexacro._getElementScreenPosition = function (elem)
        {
            if (elem && elem.handle)
            {
                var pt = nexacro.__getElementScreenPosition(elem.handle);
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


        nexacro._fireBeforeDblclick = nexacro._emptyFn;
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

        nexacro.__createNodeObjectByType = function (doc, type)
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
                    {
                        var node = new nexacro.XmlNode(doc);
                        node._node_type = type;
                        return node;
                    }
                    break;
                case 8: // Comment
                    return new nexacro.XmlComment(doc);
                case 9: // Document
                    return new nexacro.XmlDocument();
                case 10: // Document Type
                    return new nexacro.XmlDocumentType(doc);
                case 11: // Document Fragment
                case 12: // Notation
                    {
                        var node = new nexacro.XmlNode(doc);
                        node._node_type = type;
                        return node;
                    }
                    break;
            }
            return null;
        };

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
        }
        else
        {
            nexacro.__openSystemCalendar = nexacro._emptyFn;
            nexacro.__closeSystemCalendar = nexacro._emptyFn;
        }

        //==============================================================================
        // NodeList

        nexacro.XmlNodeList = function ()
        {
        };
        // Do not inherit 'Array', the behavior of all unrelated arrays is very slow. (v8 5.x or later, )
        // var _pXmlNodeList = nexacro._createPrototype(Array, nexacro.XmlNodeList);
        var _pXmlNodeList = Object.create(Array.prototype, { constructor: { value: nexacro.XmlNodeList } });
        nexacro.XmlNodeList.prototype = _pXmlNodeList;

        // overide nexacro.Object
        _pXmlNodeList._type_name = "XmlNodeList";
    
        _pXmlNodeList._setFromHandleArray = function (node_hanldes, node_type, doc, parent_node, is_sibling)
        {
            if (node_hanldes)
            {
                var prev_node = null;
                for (var i = 0, n = node_hanldes.length; i < n; i++)
                {
                    var node_handle = node_hanldes[i];
                    if (node_type < 1) 
                    {
                        node_type = nexacro.__xmlGetNodeType(node_handle);
                    }
                    var node = nexacro.__createNodeObjectByType(doc, node_type);
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
                        this.push(node);
                    
                        if (is_sibling)
                            prev_node = node;
                    }
                }
            }
        };
        _pXmlNodeList.item = function (index)
        {
            if (index > -1 && this.length > index)
                return this[index];
            return null;
        };
    
        _pXmlNodeList._appendItem = function (new_item)
        {
            if (!new_item)
                return 0;
        
            var last_node = null;
            if (this.length)
                last_node = this[this.length - 1];
            
            this.push(new_item);
        
            if (last_node)
            {
                last_node._next_sibling = new_item;
                new_item._previous_sibling = last_node;
            }
        
            return this.length;
        };
        _pXmlNodeList._insertBefore = function (new_item, ref_item)
        {
            if (!new_item || !ref_item)
                return 0;
        
            var insertAt = this.indexOf(ref_item);
            if (insertAt == 0)
            {
                this.unshift(new_item);
            }
            else if (insertAt > 0)
            {
                this.splice(insertAt, 1, new_item);
            }
            else
            {
                this.push(new_item);
            }
        
            var prev_node = ref_item._previous_sibling;
            if (prev_node)
            {
                prev_node._next_sibling = new_item;
                new_item._previous_sibling = prev_node;
            }
            ref_item._previous_sibling = new_item;
            new_item._next_sibling = ref_item;
        
            return this.length;
        };
        _pXmlNodeList._insertAfter = function (new_item, ref_item)
        {
            if (!new_item || !ref_item)
                return 0;
        
            var length = this.length;
            var insertAt = this.indexOf(ref_item);
            if (insertAt >= 0 && insertAt < (length - 1))
            {
                this.splice(insertAt + 1, 1, new_item);
            }
            else
            {
                this.push(new_item);
            }
        
            var next_node = ref_item._next_sibling;
            if (next_node)
            {
                next_node._previous_sibling = new_item;
                new_item._next_sibling = next_node;
            }
            ref_item._next_sibling = new_item;
            new_item._previous_sibling = ref_item;
        
            return this.length;
        };
        _pXmlNodeList._removeItem = function (item)
        {
            if (!item)
                return;
            
            var idx = this.indexOf(item);
            if (idx > -1)
            {
                this.splice(idx, 1);
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
        };
        _pXmlNodeList._replaceItem = function (new_item, old_item)
        {
            if (!new_item || !old_item)
                return;
            
            var idx = this.indexOf(old_item);
            if (idx > -1)
            {
                this.splice(idx, 1);
                this.splice(idx, 1, new_item);
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
        };
    
        delete _pXmlNodeList;
    
    
        //////////////////////////////////////////////////////////////////////////
        nexacro.XmlNamedNodeMap = function ()
        {
        };
        var _pXmlNamedNodeMap = nexacro._createPrototype(nexacro.Object, nexacro.XmlNamedNodeMap);
        nexacro.XmlNamedNodeMap.prototype = _pXmlNamedNodeMap;

        // overide nexacro.Object
        _pXmlNamedNodeMap._type_name = "XmlNamedNodeMap";
    
        _pXmlNamedNodeMap._node_map = { names: [], nodes: [] };
    
    
        _pXmlNamedNodeMap.get_length = function ()
	    {
	        if (!this._node_map)
	            return 0;
	        
	        return this._node_map.names.length;
	    };
        Object.defineProperty(_pXmlNamedNodeMap, "length", { get: _pXmlNamedNodeMap.get_length, configurable: false });
    
        _pXmlNamedNodeMap._setFromHandleMap = function (handle_namedmap, node_type, doc, parent_node) // [[name1, handle1], [], ...., [nameN, handleN]]
        {
            if (handle_namedmap)
            {
            	var i, n;
                if (this._node_map)
                {
                    var cnt = this._node_map.names.length;
                    for (i = 0; i < cnt; i++)
                    {
                        delete this[i];
                    }
                }

                var node_map = this._node_map = { names: [], nodes: [] };
                for (i = 0, n = handle_namedmap.length; i < n; i++)
                {
                    var node_name = handle_namedmap[i][0];
                    var node_handle = handle_namedmap[i][1];
                    if (node_type < 1) 
                    {
                        node_type = nexacro.__xmlGetNodeType(node_handle);
                    }
                    var node = nexacro.__createNodeObjectByType(doc, node_type);
                    if (node)
                    {
                        node.handle = node_handle;
                        if (parent_node)
                        {
                            node._parent_node = parent_node;
                        }
                    
                        node_map.names.push(node_name);
                        node_map.nodes.push(node);
                        this[i] = node;
                    }
                }
            }
        };
        _pXmlNamedNodeMap._clear = function ()
        {
            if (this._node_map)
            {
                var cnt = this._node_map.names.length;
                for (var i = 0; i < cnt; i++)
                {
                    delete this[i];
                }
                this._node_map.names = null;
                this._node_map.nodes = null;
            }
        };
        _pXmlNamedNodeMap.getNamedItem = function (nodename)
        {
            var node_map = this._node_map;
            if (node_map)
            {
                var idx = nexacro._indexOf(node_map.names, nodename);
                if (idx > -1)
                    return node_map.nodes[idx];
            }
            return null;
        };
        _pXmlNamedNodeMap.item = function (index)
        {
            var node_map = this._node_map;
            if (index > -1 && node_map && node_map.nodes.length > index)
                return node_map.nodes[index];
            return null;
        };
        _pXmlNamedNodeMap.removeNamedItem = function (nodename)
        {
             var node_map = this._node_map;
            if (node_map)
            {
                var idx = nexacro._indexOf(node_map.names, nodename);
                var cnt = node_map.names.length;
                if (idx > -1 && idx < cnt)
                {
                    var remove_node = node_map.nodes[idx];
                    node_map.names.splice(idx, 1);
                    node_map.nodes.splice(idx, 1);
                    cnt--;

                    for (var i = idx; i < cnt; i++)
                    {
                        this[i] = this[i + 1];
                    }
                    delete this[i];
                
                    return remove_node;
                }
            }
            return null;
        };
        _pXmlNamedNodeMap._setNamedItem = function (nodename, node)
        {
            var node_map = this._node_map;
            if (node_map)
            {
                var idx = nexacro._indexOf(node_map.names, nodename);
                if (idx > -1)
                {
                    var rep_node = node_map.nodes.splice(idx, 1);
                    node_map.nodes.splice(idx, 1, node);
                    this[idx] = node;
                    return rep_node;
                }
                else
                {
                    var len = node_map.names.push(nodename);
                    node_map.nodes.push(node);
                    this[len - 1] = node;
                }
            }
            return null;
        };
    
        delete _pXmlNamedNodeMap;
    
        //==============================================================================
        // Node
        nexacro.XmlNode = function (doc)
        {
           this._owner_document = doc;
        };
    
        var _pXmlNode = nexacro._createPrototype(nexacro.Object, nexacro.XmlNode);
	    nexacro.XmlNode.prototype = _pXmlNode;

	    _pXmlNode._type_name = "XmlNode";
	
	    _pXmlNode.handle = null;
	
	    _pXmlNode._owner_document = null;
	    _pXmlNode._parent_node = null;
	    _pXmlNode._first_child = null;
	    _pXmlNode._last_child = null;
	    _pXmlNode._previous_sibling = null;
	    _pXmlNode._next_sibling = null;
	    _pXmlNode._child_nodes = null;
	    _pXmlNode._node_name = "";
	    _pXmlNode._node_type = "";
	    _pXmlNode._node_value = undefined;
	    _pXmlNode._namespace_uri = "";
	    _pXmlNode._prefix = "";
	    _pXmlNode._text_content = "";
	
	
        _pXmlNode._destroy = function ()
	    {
	        trace("==> _pXmlNode._destroy");

	        var handle = this.handle;
	        if (handle)
	        {
	            this.handle = null;
	        }
	    
	        this._child_nodes = null;
	        this._owner_document = null;
	        this._parent_node = null;
	        this._first_child = null;
	        this._last_child = null;
	        this._previous_sibling = null;
	        this._next_sibling = null;
	    };
        _pXmlNode._unlink = function ()
	    {
	        this._parent_node = null;
	        this._previous_sibling = null;
	        this._next_sibling = null;
	    };
	    //==============================================================================
	    // property getter/setter
	
	    // getOwnerElement
        _pXmlNode.get_ownerDocument = function ()
	    {
	        if (!this.handle)
	            return null;
	        
	        var owner_document = this._owner_document;
	        if (owner_document)
	            return owner_document;
	    };
        Object.defineProperty(_pXmlNode, "ownerDocument", { get: _pXmlNode.get_ownerDocument, configurable: false });
	
	    // childNodes : NodeList
        _pXmlNode.get_childeNodes = function ()
	    {
	        if (!this.handle)
	            return null;

	        var childs = this._child_nodes;
	        if (!childs)
	        {
                childs = this._child_nodes = new nexacro.XmlNodeList();
                var child_handles = nexacro.__xmlGetChildNodes(this.handle);
                if (child_handles)
                {
                    childs._setFromHandleArray(child_handles, 0, this._owner_document, this, true);
                    if (childs.length)
                    {
                        this._first_child = childs[0];
                        this._last_child = childs[childs.length - 1];
                    }
                    child_handles = null;
                }
            }
            return childs;
	    };
        Object.defineProperty(_pXmlNode, "childNodes", { get: _pXmlNode.get_childeNodes, configurable: false });
	
	    // firstChild
        _pXmlNode.get_firstChild = function ()
	    {
	        if (!this.handle)
	            return null;
	        
	        var first_child = this._first_child;
	        if (!first_child)
	        {
	            var child_nodes = this._child_nodes;
	            if (child_nodes && child_nodes.length)
	            {
	                return child_nodes.item(0);
	            }
	        
                var child_handle = nexacro.__xmlGetFirstNode(this.handle);
                if (child_handle)
                {
                    var node_type = nexacro.__xmlGetNodeType(child_handle);
                    first_child = this._first_child = nexacro.__createNodeObjectByType(this._owner_document, node_type);
                    first_child.handle = child_handle;
                    first_child._parent_node = this;
                }
            }
            return first_child;
	    };
        Object.defineProperty(_pXmlNode, "firstChild", { get: _pXmlNode.get_firstChild, configurable: false });

        // lastChild
        _pXmlNode.get_lastChild = function ()
	    {
	        if (!this.handle)
	            return null;
	        
	        var last_child = this._last_child;
	        if (!last_child)
	        {
	            var child_nodes = this._child_nodes;
	            if (child_nodes && child_nodes.length)
	            {
                    return child_nodes.item(child_nodes.length - 1);
	            }
	        
                var child_handle = nexacro.__xmlGetLastChildNode(this.handle);
                if (child_handle)
                {
                    var node_type = nexacro.__xmlGetNodeType(child_handle);
                    last_child = this._last_child = nexacro.__createNodeObjectByType(this._owner_document, node_type);
                    last_child.handle = child_handle;
                    last_child._parent_node = this;
                }
            }
            return last_child;
	    };
        Object.defineProperty(_pXmlNode, "lastChild", { get: _pXmlNode.get_lastChild, configurable: false });

        // nextSibling
        _pXmlNode.get_nextSibling = function ()
	    {
	        if (!this.handle)
	            return null;
	        
	        var next_node = this._next_sibling;
	        if (!next_node)
	        {
                var next_handle = nexacro.__xmlGetNextSiblingNode(this.handle);
                if (next_handle)
                {
                    var node_type = nexacro.__xmlGetNodeType(next_handle);
                    next_node = this._next_sibling = nexacro.__createNodeObjectByType(this._owner_document, node_type);
                    next_node.handle = next_handle;
                    next_node._previous_sibling = this;
                }
            }
            return next_node;
	    };
        Object.defineProperty(_pXmlNode, "nextSibling", { get: _pXmlNode.get_nextSibling, configurable: false });
	
	    // previousSibling
        _pXmlNode.get_previousSibling = function ()
	    {
	        if (!this.handle)
	            return null;
	        
	        var prev_node = this._previous_sibling;
	        if (!prev_node)
	        {
                var prev_handle = nexacro.__xmlGetPrevSiblingNode(this.handle);
                if (prev_handle)
                {
                    var node_type = nexacro.__xmlGetNodeType(prev_handle);
                    prev_node = this._previous_sibling = nexacro.__createNodeObjectByType(this._owner_document, node_type);
                    prev_node.handle = prev_handle;
                    prev_node._next_sibling = this;
                }
            }
            return prev_node;
	    };
        Object.defineProperty(_pXmlNode, "previousSibling", { get: _pXmlNode.get_previousSibling, configurable: false });
	
	    // parentNode
        _pXmlNode.get_parentNode = function ()
	    {
	        if (!this.handle)
	            return null;
	        
	        var parnet_node = this._parent_node;
	        if (!parnet_node)
	        {
                var parent_handle = nexacro.__xmlGetParentNode(this.handle);
                if (parent_handle)
                {
                    var node_type = nexacro.__xmlGetNodeType(parent_handle);
                    parnet_node = this._parent_node = nexacro.__createNodeObjectByType(this._owner_document, node_type);
                    parnet_node.handle = parent_handle;
                }
            }
            return parnet_node;
	    };
        Object.defineProperty(_pXmlNode, "parentNode", { get: _pXmlNode.get_parentNode, configurable: false });
	
	    // namespaceURI
        _pXmlNode.get_namespaceURI = function ()
	    {
	        if (!this.handle)
	            return "";
	    
	        var namespace_uri = this._namespace_uri;
	        if (!namespace_uri) 
	        {
                namespace_uri = this._namespace_uri = nexacro.__xmlGetNamespaceURI(this.handle);
            }
            return namespace_uri;
	    };
        _pXmlNode.set_namespaceURI = function (new_nsuri)
	    {
	        if (!this.handle)
	            return;
	    
	        if (nexacro.__xmlSetNamespaceURI(this.handle, new_nsuri))
	        {
	            this._namespace_uri = new_nsuri;
	        }
	    };
        Object.defineProperty(_pXmlNode, "namespaceURI", { get: _pXmlNode.get_namespaceURI, set: _pXmlNode.set_namespaceURI, configurable: false });
	
	    // prefix
        _pXmlNode.get_prefix = function ()
	    {
	        if (!this.handle)
	            return "";
	    
	        var prefix = this._prefix;
	        if (!prefix) 
	        {
                prefix = this._prefix = nexacro.__xmlGetPrefix(this.handle);
            }
            return prefix;
	    };
        _pXmlNode.set_prefix = function (new_nsprefix)
	    {
	        if (!this.handle)
	            return;
	    
	        if (nexacro.__xmlSetPrefix(this.handle, new_nsprefix))
	        {
	            this._prefix = new_nsprefix;
	        }
	    };
        Object.defineProperty(_pXmlNode, "prefix", { get: _pXmlNode.get_prefix, set: _pXmlNode.set_prefix, configurable: false });
	
	    // nodeName
        _pXmlNode.get_nodeName = function ()
	    {
	        if (!this.handle)
	            return "";
	    
	        var node_name = this._node_name;
	        if (!node_name)
	        {
                node_name = this._node_name = nexacro.__xmlGetNodeName(this.handle);
            }
            return node_name;
	    };
        Object.defineProperty(_pXmlNode, "nodeName", { get: _pXmlNode.get_nodeName, configurable: false });
	
	    // nodeType
        _pXmlNode.get_nodeType = function ()
	    {
            return this._node_type;
	    };
        Object.defineProperty(_pXmlNode, "nodeType", { get: _pXmlNode.get_nodeType, configurable: false });
	
	    // nodeValue
        _pXmlNode.get_nodeValue = function ()
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
        _pXmlNode.set_nodeValue = function (new_value)
	    {
	        if (!this.handle)
	            return;
	    
	        if (nexacro.__xmlSetNodeValue(this.handle, new_value))
	        {
	           this._node_value = new_value; 
	        }
	    };
        Object.defineProperty(_pXmlNode, "nodeValue", { get: _pXmlNode.get_nodeValue, set: _pXmlNode.set_nodeValue, configurable: false });
	
	    //==============================================================================
	    // methods
	
	    // appendChild
        _pXmlNode.appendChild = function (node)
	    {
	        if (!this.handle || !node || !node.handle || !(node instanceof nexacro.XmlNode))
	            return null;
	    
	        var append_handle = nexacro.__xmlAppendChild(this.handle, node.handle);
	        if (append_handle)
	        {
	            var child_nodes = this._child_nodes;
	            if (child_nodes)
	            {
                    child_nodes._appendItem(node);
                }
                node._parent_node = this;
                this._last_child = node;
            
                if (node._owner_document != this._owner_document)
	            {
	                node._owner_document = this._owner_document;
	            }
                return node;
	        }
	        return null;
	    };
	
	    // cloneNode
        _pXmlNode.cloneNode = function (include_all)
	    {
	        if (!this.handle)
	            return null;
	    
	        var clone_handle = nexacro.__xmlCloneNode(this.handle, include_all);
	        if (clone_handle)
	        {
	            var node_type = this.get_nodeType();
                var clone_node = nexacro.__createNodeObjectByType(this._owner_document, node_type);
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
        _pXmlNode.hasAttributes = function ()
	    {
	        if (!this.handle)
	            return false;
	    
	        return nexacro.__xmlHasAttributes(this.handle);
	    };
	
	    // hasChildNodes
        _pXmlNode.hasChildNodes = function ()
	    {
	        if (!this.handle)
	            return false;
	        
	        if (this._child_nodes && this._child_nodes.length > 0)
	            return true;
	    
	        return nexacro.__xmlHasChildNodes(this.handle);
	    };
	
	    // insertBefore
        _pXmlNode.insertBefore = function (newchild, refchild)
	    {
	        if (!this.handle)
	            return null;
	        
	        if (!newchild || !newchild.handle || !(newchild instanceof nexacro.XmlNode))
	            return null;
	        
	        if (!refchild || !refchild.handle || !(refchild instanceof nexacro.XmlNode))
	            return null;
	    
	        var insert_handle = nexacro.__xmlInsertBefore(this.handle, newchild.handle, refchild.handle);
	        if (insert_handle)
	        {
	            var child_nodes = this._child_nodes;
	            if (child_nodes)
	            {
	                child_nodes._insertBefore(newchild, refchild);
                }
                newchild._parent_node = this;
                           
                var first_child = this._first_child;
                if (newchild == first_child)
                {
                   this._first_child = newchild;
                }
            
                if (newchild._owner_document != this._owner_document)
	            {
	                newchild._owner_document = this._owner_document;
	            }
	        
                return newchild;
	        }
	        return null;
	    };
	
	    // lookupNamespaceURI
        _pXmlNode.lookupNamespaceURI = function (prefix)
	    {
	        if (!this.handle)
	            return "";
	    
	        return nexacro.__xmlLookupNamespaceURI(this.handle, prefix);
	    };
	    // lookupPrefix
        _pXmlNode.lookupPrefix = function (uri)
	    {
	        if (!this.handle)
	            return "";
	    
	        return nexacro.__xmlLookupPrefix(this.handle, uri);
	    };
	
	    // removeChild
        _pXmlNode.removeChild = function (node)
	    {
	        if (!this.handle || !node || !node.handle || !(node instanceof nexacro.XmlNode))
	            return null;
	        
	        var rem_handle = nexacro.__xmlRemoveChild(this.handle, node.handle);
	        if (rem_handle)
	        {
	            var child_nodes = this._child_nodes;
	            if (child_nodes)
	            {
	                child_nodes._removeItem(node);
                }
               
	        	/* check TODO
                var first_child = this._first_child;
                var last_child = this._last_child;

	        	
				if (node == first_child)
                {
                   this._first_child = next_node;
                }            
                if (node == last_child)
                {
                   this._last_child = prev_node;
                } 
				*/
                node._unlink();
                return node;
	        }
	        return null;
	    };
	    // replaceChild
        _pXmlNode.replaceChild = function (new_node, old_node)
	    {
	        if (!this.handle)
	            return null;	        
	        if (!new_node || !new_node.handle || !(new_node instanceof nexacro.XmlNode))
	            return null;
	        if (!old_node || !old_node.handle || !(old_node instanceof nexacro.XmlNode))
	            return null;
	        
	        var rep_handle = nexacro.__xmlReplaceChild(this.handle, new_node.handle, old_node.handle);
	        if (rep_handle)
	        {
	            var child_nodes = this._child_nodes;
	            if (child_nodes)
	            {
	                child_nodes._replaceItem(new_node, old_node);
                }
                new_node._parent_node = this;
                           
                var first_child = this._first_child;
                var last_child = this._last_child;
                if (old_node == first_child)
                {
                   this._first_child = new_node;
                }            
                if (old_node == last_child)
                {
                   this._last_child = new_node;
                }
            
                if (new_node._owner_document != this._owner_document)
	            {
	                new_node._owner_document = this._owner_document;
	            }
            
                old_node._unlink();
                return old_node;
	        }
	        return null;
	    };
	
	    delete _pXmlNode;
	
	
	    //==============================================================================
        // Element
        nexacro.XmlElement = function (doc)
        {
           this._owner_document = doc;
        };
    
        var _pXmlElement = nexacro._createPrototype(nexacro.XmlNode, nexacro.XmlElement);
	    nexacro.XmlElement.prototype = _pXmlElement;

	    _pXmlElement._type_name = "XmlElement";
	
	    _pXmlElement._attributes = null; // NamedNodeMap
	    _pXmlElement._base_uri = "";
	    _pXmlElement._node_type = 1;
	
	    //////////////////////////////////////////////////////////////////////////
	    // property getter/setter
	
	    // attributes
        _pXmlElement.get_attributes = function ()
	    {
	        if (!this.handle)
	            return null;

	        var attributes = this._attributes;
	        if (!attributes)
	        {
                attributes = this._attributes = new nexacro.XmlNamedNodeMap();
                var attr_handle_map = nexacro.__xmlGetAttributes(this.handle);
                if (attr_handle_map)
                {
                    attributes._setFromHandleMap(attr_handle_map, 2, this._owner_document, this);
                    attr_handle_map = null;
                }
            }
            return attributes;
	    };
        Object.defineProperty(_pXmlElement, "attributes", { get: _pXmlElement.get_attributes, configurable: false });

        // baseURI
        _pXmlElement.get_baseURI = function ()
	    {
	        if (!this.handle)
	            return null;

	        var base_uri = this._base_uri;
	        if (!base_uri)
	        {
                base_uri = this._base_uri = nexacro.__xmlGetBaseURI(this.handle);
            }
            return base_uri;
	    };
        Object.defineProperty(_pXmlElement, "baseURI", { get: _pXmlElement.get_baseURI, configurable: false });
	
        // tagName	
        Object.defineProperty(_pXmlElement, "tagName", { get: _pXmlElement.get_nodeName, configurable: false });
	
	
	    //////////////////////////////////////////////////////////////////////////
	    // methods
	
        _pXmlElement._unlink = function ()
	    {
	        this._parent_node = null;
	        this._previous_sibling = null;
	        if (this._attributes)
	            this._attributes._clear();
	        this._attributes = null;
	    };
	
	    // getAttribute
        _pXmlElement.getAttribute = function (name)
	    {
	        if (!this.handle || !name)
	            return null;
	    
	        return nexacro.__xmlGetAttribute(this.handle, name);
	    };	
	    // getAttributeNS
        _pXmlElement.getAttributeNS = function (ns, name)
	    {
	        if (!this.handle || !name)
	            return null;
	    
	        return nexacro.__xmlGetAttribute(this.handle, name, ns);
	    };	
	    // getAttributeNode
        _pXmlElement.getAttributeNode = function (name)
	    {
	        if (!this.handle || !name)
	            return null;
	    
	        var attributes = this._attributes;
	        if (!attributes)
	        {
	            attributes = this.get_attributes();
	        }
            return attributes.getNamedItem(name);
	    };
	    // getElementsByTagName
        _pXmlElement.getElementsByTagName = function (name)
	    {
	        if (!this.handle || !name)
	            return null;
	    
	        var elem_nodes = new nexacro.XmlNodeList();
	        var elem_handles = nexacro.__xmlGetElementsByTagName(this.handle, name);
	        if (elem_handles)
	        {
	            elem_nodes._setFromHandleArray(elem_handles, 1, this._owner_document);
	            elem_handles = null;
	        }
	        return elem_nodes;
	    };
	    // getElementsByTagNameNS
        _pXmlElement.getElementsByTagNameNS = function (ns, name)
	    {
	        if (!this.handle || !name)
	            return null;
	    
	        var elem_nodes = new nexacro.XmlNodeList();
	        var elem_handles = nexacro.__xmlGetElementsByTagName(this.handle, name, ns);
	        if (elem_handles)
	        {
	            elem_nodes._setFromHandleArray(elem_handles, 1, this._owner_document);
	            elem_handles = null;
	        }
	        return elem_nodes;
	    };
	
	    // hasAttribute
        _pXmlElement.hasAttribute = function (name)
	    {
	        if (!this.handle || !name)
	            return null;
	    
	        return nexacro.__xmlHasAttribute(this.handle, name);
	    };	
	    // hasAttributeNS
        _pXmlElement.hasAttributeNS = function (ns, name)
	    {
	        if (!this.handle || !name)
	            return null;
	    
	        return nexacro.__xmlHasAttribute(this.handle, name, ns);
	    };
	
	    // removeAttribute
        _pXmlElement.removeAttribute = function (name)
	    {
	        if (!this.handle || !name)
	            return null;
	    
	        var rem_handle = nexacro.__xmlRemoveAttribute(this.handle, name);
	        if (rem_handle)
	        {
	            var attributes = this._attributes;
	            if (attributes)
	            {
	                var rem_node = attributes.removeNamedItem(name);
	                if (rem_node)
	                {
	                    rem_node._unlink();
	                }
	                return rem_node;
	            }
	        }
	        return null;
	    };	
	    // removeAttributeNS
        _pXmlElement.removeAttributeNS = function (ns, name)
	    {
	        if (!this.handle || !name)
	            return null;
	    
	        var rem_handle = nexacro.__xmlRemoveAttribute(this.handle, name, ns);
	        if (rem_handle)
	        {
	            var attributes = this._attributes;
	            if (attributes)
	            {
	                var rem_node = attributes.removeNamedItem(name);
	                if (rem_node)
	                {
	                    rem_node._unlink();
	                }
	                return rem_node;
	            }
	        }
	        return null;
	    };
	    // removeAttributeNode
        _pXmlElement.removeAttributeNode = function (node)
	    {
	        if (!this.handle || !node || !node.handle || !(node instanceof nexacro.XmlAttribute))
	            return null;
	    
	        var node_name = node.get_nodeName();
	        var rem_handle = nexacro.__xmlRemoveAttributeNode(this.handle, node.handle);
	        if (rem_handle)
	        {
	            var attributes = this._attributes;
	            if (attributes)
	            {
	                attributes.removeNamedItem(node_name);
	                node._unlink();
	                return node;
	            }
	        }
	        return null;
	    };
	
	    // setAttribute
        _pXmlElement.setAttribute = function (name, value)
	    {
	        if (!this.handle || !name)
	            return;
	    
	        var attributes = this._attributes;
	        if (attributes)
	        {
	            var attr_node = attributes.getNamedItem(name);
	            if (attr_node)
	            {
	                attr_node.set_value(value);
	                return;
	            }
	        
	            var attr_handle = nexacro.__xmlSetAttribute(this.handle, name, value);
	            if (attr_handle)
	            {
	                attr_node = nexacro.__createNodeObjectByType(this._owner_document, 1);
	                attr_node.handle = attr_handle;
	                attr_node._parent_node = this;
	                attributes._setNamedItem(name, attr_node);
	            }
	        }
	        else
	        {
	            nexacro.__xmlSetAttribute(this.handle, name, value);
	        }
	    };	
	    // setAttributeNS
        _pXmlElement.setAttributeNS = function (ns, name, value)
	    {
	        if (!this.handle || !name)
	            return;
	    
	        var attributes = this._attributes;
	        if (attributes)
	        {
	            var attr_node = attributes.getNamedItem(name);
	            if (attr_node)
	            {
	                attr_node.set_value(value);
	                return;
	            }
	        
	            var attr_handle = nexacro.__xmlSetAttribute(this.handle, name, value, ns);
	            if (attr_handle)
	            {
	                attr_node = nexacro.__createNodeObjectByType(this._owner_document, 1);
	                attr_node.handle = attr_handle;
	                attr_node._parent_node = this;
	                attributes._setNamedItem(name, attr_node);
	            }
	        }
	        else
	        {
	            nexacro.__xmlSetAttribute(this.handle, name, value, ns);
	        }
	    };	
	    // setAttributeNode
        _pXmlElement.setAttributeNode = function (node)
	    {
	        if (!this.handle || !node || !node.handle || !(node instanceof nexacro.XmlAttribute))
	            return;
	    
	        var attr_name = node.get_name();
	        if (!attr_name)
	            return;
	    
	        var attr_handle = nexacro.__xmlSetAttributeNode(this.handle, node.handle);
	        if (attr_handle)
	        {
	            node._parent_node = this;
	            var attributes = this._attributes;
	            if (attributes)
	            {
	                var rep_node = attributes._setNamedItem(name, node);
	                if (rep_node)
	                {
	                    rep_node._unlink();
	                    return rep_node;
	                }
	            }
	        }
	    };
	
	    delete _pXmlElement;
	
	
	    //==============================================================================
        // Attribute
        nexacro.XmlAttribute = function (doc)
        {
           this._owner_document = doc;
        };
    
        var _pXmlAttribute = nexacro._createPrototype(nexacro.XmlNode, nexacro.XmlAttribute);
	    nexacro.XmlAttribute.prototype = _pXmlAttribute;

	    _pXmlAttribute._type_name = "XmlAttribute";
	
	    _pXmlAttribute._name = "";
	    _pXmlAttribute._node_type = 2;
	
	    //////////////////////////////////////////////////////////////////////////
	    // property getter/setter
	
        Object.defineProperty(_pXmlAttribute, "name", { get: _pXmlAttribute.get_nodeName, configurable: false });
        Object.defineProperty(_pXmlAttribute, "value", { get: _pXmlAttribute.get_nodeValue, set: _pXmlAttribute.set_nodeValue, configurable: false });
	
	    delete _pXmlAttribute;
	
	
	    //==============================================================================
        // Text Node
        nexacro.XmlText = function (doc)
        {
           this._owner_document = doc;
        };
    
        var _pXmlText = nexacro._createPrototype(nexacro.XmlNode, nexacro.XmlText);
	    nexacro.XmlText.prototype = _pXmlText;

	    _pXmlText._type_name = "XmlText";
	
	    _pXmlText._node_type = 3;
	    _pXmlText._node_name = "#text";
	
	    //////////////////////////////////////////////////////////////////////////
	    // property getter/setter
	
	    // data
        Object.defineProperty(_pXmlText, "data", { get: _pXmlText.get_nodeValue, configurable: false });
	
	    // length
        _pXmlText.get_length = function ()
	    {
	        if (!this.handle)
	            return null;

            return nexacro.__xmlGetContentsLength(this.handle);
	    };
        Object.defineProperty(_pXmlText, "length", { get: _pXmlText.get_length, configurable: false });
	
	    //////////////////////////////////////////////////////////////////////////
	    // methods
	
	    // appendData
        _pXmlText.appendData = function (string)
	    {
	        if (!this.handle)
	            return;
	    
	        nexacro.__xmlAppendContentsData(this.handle, string);
	        this._node_value = undefined;
	    };
	    // deleteData
        _pXmlText.deleteData = function (start, length)
	    {
	        if (!this.handle)
	            return;
	    
	        nexacro.__xmlDeleteContentsData(this.handle, start, length);
	        this._node_value = undefined;
	    };
	    // insertData
        _pXmlText.insertData = function (start, string)
	    {
	        if (!this.handle)
	            return;
	    
	        nexacro.__xmlInsertContentsData(this.handle, start, string);
	        this._node_value = undefined;
	    };
	    // replaceData
        _pXmlText.replaceData = function (start, length, string)
	    {
	        if (!this.handle)
	            return;
	    
	        nexacro.__xmlReplaceContentsData(this.handle, start, length, string);
	        this._node_value = undefined;
	    };
	    // splitText
        _pXmlText.splitText = function (offset)
	    {
	        if (!this.handle)
	            return;
	    
	        var new_handle = nexacro.__xmlSplitContentsText(this.handle, offset);
	        if (new_handle)
	        {
	            var text_node = nexacro.__createNodeObjectByType(this._owner_document, 3);
	            text_node.handle = new_handle;
	        
	            var parent_node = this._parent_node;
	            if (parent_node && parent_node._child_nodes)
	            {
	                parent_node._child_nodes._insertAfter(text_node, this);
	            }
	            text_node._parent_node = this._parent_node;
	        }
	        this._node_value = undefined;
	    };
	
	    delete _pXmlText;
	
	
	    //==============================================================================
        // CDATA-Section Node
        nexacro.XmlCDATASection = function (doc)
        {
           this._owner_document = doc;
        };
    
        var _pXmlCDATASection = nexacro._createPrototype(nexacro.XmlText, nexacro.XmlCDATASection);
	    nexacro.XmlCDATASection.prototype = _pXmlCDATASection;

	    _pXmlCDATASection._type_name = "XmlCDATASection";
	
	    _pXmlCDATASection._node_type = 4;
	    _pXmlCDATASection._node_name = "#cdata-section";
	
	    delete _pXmlCDATASection;
	
	    //==============================================================================
        // Comment Node
        nexacro.XmlComment = function (doc)
        {
           this._owner_document = doc;
        };
    
        var _pXmlComment = nexacro._createPrototype(nexacro.XmlText, nexacro.XmlComment);
	    nexacro.XmlComment.prototype = _pXmlComment;

	    _pXmlComment._type_name = "XmlComment";
	
	    _pXmlComment._node_type = 8;
	    _pXmlComment._node_name = "#comment";
	
	    _pXmlComment.splitText = null;
	
	    delete _pXmlComment;
	
	
        //==============================================================================
        // document
        nexacro.XmlDocument = function ()
        {
        
        };
    
        var _pXmlDocument = nexacro._createPrototype(nexacro.XmlNode, nexacro.XmlDocument);
	    nexacro.XmlDocument.prototype = _pXmlDocument;

	    _pXmlDocument._type_name = "XmlDocument";
	
	    _pXmlDocument._node_type = 9;
	    _pXmlDocument._node_name = "#document";
    
    
        //////////////////////////////////////////////////////////////////////////
	    // property getter/setter
	
	    _pXmlDocument._doc_type = null;
	    _pXmlDocument._document_element = null;
	    _pXmlDocument._document_uri = "";
	
	    // docType
        _pXmlDocument.get_docType = function ()
	    {
	        if (!this.handle)
	            return null;

            var doc_type = this._doc_type;
            if (doc_type)
            {
                return doc_type;
            }
        
            var type_handle = nexacro.__xmlGetDocType(this.handle);
            if (type_handle)
	        {
	            doc_type = this._doc_type = nexacro.__createNodeObjectByType(this, 10);
	            doc_type.handle = type_handle;
	        }
            return doc_type;
	    };
        Object.defineProperty(_pXmlDocument, "docType", { get: _pXmlDocument.get_docType, configurable: false });
	
	    // documentElement
        _pXmlDocument.get_documentElement = function ()
	    {
	        if (!this.handle)
	            return null;

            var document_element = this._document_element;
            if (document_element)
            {
                return document_element;
            }
        
            var node_handle = nexacro.__xmlGetDocumentElement(this.handle);
            if (node_handle)
	        {
	            document_element = this._document_element = nexacro.__createNodeObjectByType(this, 1);
	            document_element.handle = node_handle;
	        }
            return document_element;
	    };
        Object.defineProperty(_pXmlDocument, "documentElement", { get: _pXmlDocument.get_documentElement, configurable: false });
	
	    // documentURI
        _pXmlDocument.get_documentURI = function ()
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
        Object.defineProperty(_pXmlDocument, "documentURI", { get: _pXmlDocument.get_documentURI, configurable: false });
	
	    //////////////////////////////////////////////////////////////////////////
	    // methods
	
        _pXmlDocument.createAttribute = function (name)
	    {
	        if (!this.handle || !name)
	            return null;
	        
	        var new_handle = nexacro.__xmlCreateAttribute(this.handle, name);
	        if (new_handle)
	        {
	            var new_node = nexacro.__createNodeObjectByType(this, 2);
	            new_node.handle = new_handle;
	            return new_node;
	        }	        
	        return null;
	    };
        _pXmlDocument.createCDATASection = function (data)
	    {
	        if (!this.handle)
	            return null;
	        
	        var new_handle = nexacro.__xmlCreateCDATASection(this.handle, data);
	        if (new_handle)
	        {
	            var new_node = nexacro.__createNodeObjectByType(this, 4);
	            new_node.handle = new_handle;
	            return new_node;
	        }	        
	        return null;
	    };
        _pXmlDocument.createComment = function (data)
	    {
	        if (!this.handle)
	            return null;
	        
	        var new_handle = nexacro.__xmlCreateComment(this.handle, data);
	        if (new_handle)
	        {
	            var new_node = nexacro.__createNodeObjectByType(this, 8);
	            new_node.handle = new_handle;
	            return new_node;
	        }	        
	        return null;
	    };
        _pXmlDocument.createDocumentFragment = function (/*data*/)
	    {
	        return null;
	    };
        _pXmlDocument.createElement = function (name)
	    {
	        if (!this.handle || !name)
	            return null;
	        
	        var new_handle = nexacro.__xmlCreateElement(this.handle, name);
	        if (new_handle)
	        {
	            var new_node = nexacro.__createNodeObjectByType(this, 1);
	            new_node.handle = new_handle;
	            return new_node;
	        }	        
	        return null;
	    };
        _pXmlDocument.createTextNode = function (text)
	    {
	        if (!this.handle)
	            return null;
	        
	        var new_handle = nexacro.__xmlCreateTextNode(this.handle, text);
	        if (new_handle)
	        {
	            var new_node = nexacro.__createNodeObjectByType(this, 3);
	            new_node.handle = new_handle;
	            return new_node;
	        }	        
	        return null;
	    };
	    // getElementsByTagName
        _pXmlDocument.getElementsByTagName = function (name)
	    {
	        if (!this.handle || !name)
	            return null;
	    
	        var elem_nodes = new nexacro.XmlNodeList();
	        var elem_handles = nexacro.__xmlGetElementsByTagName(this.handle, name);
	        if (elem_handles)
	        {
	            elem_nodes._setFromHandleArray(elem_handles, 1, this);
	            delete elem_handles;
	        }
	        return elem_nodes;
	    };
	    // getElementsByTagNameNS
        _pXmlDocument.getElementsByTagNameNS = function (ns, name)
	    {
	        if (!this.handle || !name)
	            return null;
	    
	        var elem_nodes = new nexacro.XmlNodeList();
	        var elem_handles = nexacro.__xmlGetElementsByTagName(this.handle, name, ns);
	        if (elem_handles)
	        {
	            elem_nodes._setFromHandleArray(elem_handles, 1, this);
	            elem_handles = null;
	        }
	        return elem_nodes;
	    };	
    
        delete _pXmlDocument;
    
    
        //==============================================================================
        // document type
        nexacro.XmlDocumentType = function ()
        {
        
        };
    
        var _pXmlDocumentType = nexacro._createPrototype(nexacro.XmlNode, nexacro.XmlDocumentType);
	    nexacro.XmlDocumentType.prototype = _pXmlDocumentType;

	    _pXmlDocumentType._type_name = "XmlDocumentType";
	
	    _pXmlDocumentType._node_type = 10;
    
        delete _pXmlDocumentType;

        nexacro.__checkHighContrast = function ()
        {
            return false;
        };

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
                "native_license_invaliddomain",
                "native_license_fail_parse",
                "native_license_invalidservice",
                "msg_access_invalid_file",
                "msg_access_invalid_domain",
                "msg_access_invalid_cert",
                "msg_permit_folder",
                "msg_permit_domain",
                "msg_permit_cert",
"range_argument"
            ];

            var cnt = errorcode.length;
            //var error = [];
            for (var i = 0; i < cnt; i++)
            {
            	var errormsg = nexacro._getErrorMessge(errorcode[i]);
                nexacro.__setBrowserErrorMsg(errorcode[i], errormsg);
            }
        };

        //nexacro._adjustPopupPosition = function (comp, x, y, align)    
        //{
        //    var alignPosition = comp._getAlignPosition(x, y, align);
        
        //    var _left = alignPosition[0];
        //    var _top = alignPosition[1];
        
        //    comp._popup(_left, _top, comp._width, comp._height);
        //};

        nexacro._initApplication = function ()
        {
            // called in function _application._on_init 
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
            var comps = form.components;
            var len = comps.length;
            for (var i = 0; i < len; i++)
            {            	
                comps[i].on_created(_window);
            }
        };

        nexacro._setProjectURL = function (url)
        {
			var projecturl = nexacro._getProjectBaseURL(url);
        	nexacro._project_url = projecturl;
        	nexacro._project_absolutepath = projecturl;
			return projecturl;
        };

        nexacro._releaseImageUrl = function (url)
        {            
            return nexacro.__releaseImageUrl(url);
        };

    	// env 초기화 
    	//screen 결정 후 screen별 env 설정 
        nexacro._initEnvironment = function (screen)
        {
			//runtime 엔진에서 screen을 select 한 후에 호출 
        	nexacro._applySelectedScreen(screen);
        	nexacro._setCurrentScreen(screen);
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

        nexacro.__preventDefault = nexacro._emptyFn;
    }
}