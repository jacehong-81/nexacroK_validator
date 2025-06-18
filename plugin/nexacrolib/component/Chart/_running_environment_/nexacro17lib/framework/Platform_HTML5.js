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

//==============================================================================
// nexacro Platform Objects
//==============================================================================
if (nexacro._Browser != "Runtime" && !nexacro._init_platform_HTML5)
{
	"use strict";

	var _process = true;
	nexacro._init_platform_HTML5 = true;

    nexacro._isTouchInteraction = (nexacro._Browser == "MobileSafari" || nexacro._OS == "Android" || nexacro._OS == "iOS" || nexacro._OS == "Windows Phone"); //nexacro._OS == "wp7"
    nexacro._SupportOrientation = ((typeof window.orientation != 'undefined') && ('onorientationchange' in window));
    nexacro._SupportTouch = ("ontouchstart" in window || ((window.navigator.msPointerEnabled || window.navigator.pointerEnabled) && (window.navigator.maxTouchPoints > 0) ? true : false));
	nexacro._SupportTouchEvent = (nexacro._SupportTouch || typeof TouchEvent !== 'undefined' || (nexacro._Browser == "IE" && typeof PointerEvent !== 'undefined')); // for event test
	nexacro._SupportAnimationFrame = (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame) ? true : false;
	nexacro._resize_popup_inbound = true;
    nexacro._is_first_touch = true;
	
	nexacro._getPopupFrames = function (winobj)
	{   
        var context = window;

        if (winobj)
            context = winobj.handle;    
        
 	    if (context._popupframes)
	        return context._popupframes;
	    else
	        return context._popupframes = new nexacro.Collection();
 
	};

	nexacro._isPopupFrame = function (id)
	{
	    //if (nexacro._window._popupframes.get_item(id) != null)
	    //    return true;
	    //return false;	    
	    var popupframes = window._popupframes;
	    if (popupframes && popupframes.get_item(id) != null)
	        return true;
	    return false;
	};

	nexacro._registerPopupFrame = function (id, frame, winobj)
	{
        var context = window;
        if (winobj)
            context = winobj.handle;

	    if (!context._popupframes)
	        context._popupframes = new nexacro.Collection();

	    if (context._popupframes.get_item(id) != null)
	        return -1;

	    return context._popupframes.add_item(id, frame);
	   
	};

	nexacro._unregisterPopupFrame = function (id, winobj, isparentnull)
	{   
        var context;
        if (winobj && winobj.parent && isparentnull)
        {   
            //popupframe의 parent 가 null 인 경우 처리 
            context = winobj.parent.handle;
            context.nexacro._unregisterPopupFrame(id);
            context.nexacro._getLocalStorageforService();
        }
        else
	    {     
            context = window;       
            if (winobj)
                context = winobj.handle;
            if (context._popupframes)
	        {
                context._popupframes.delete_item(id);
                if (context._popupframes.length == 0)
                    context._popupframes = null;  
            }   
        }
        
	    // TODO check 필요한 코드인지?
	    //this._activeform = null; 사용하는 곳이 없음
	};

    //==============================================================================
    if (nexacro._Browser == "IE")
    {
        nexacro._createSysEvent_ForwardFuncs = function (_cur_win)
        {
            //------------------------------------------------------------------------------
            // define SysEvent Handlers
            _cur_win._syshandler_onmessage_forward = function (evt)
            {
                evt = _cur_win.event || evt;
                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                return nexacro._syshandler_onmessage(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };

            _cur_win._is_capture = false;
            // capture 처리 
            _cur_win._syshandler_onmousedown_forward = function (evt)
            { 
                evt = _cur_win.event || evt;
                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                var elem = nexacro.__findParentElement(evt.srcElement);
                if (nexacro._BrowserType != "Edge" && evt.button == nexacro_HTMLSysEvent.MOUSE_LBUTTON && !_cur_win._is_capture && !elem.isInputElement())
                {
                    var body = _cur_win.document.body;
                    // ODH : srcElement가 아니라 body에 capture를 걸어서 사용하려면 IE11은 반드시 false를 셋팅해야 함.
                    body.setCapture(false);
                    _cur_win._is_capture = true;
                }

                return nexacro._syshandler_onmousedown(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
               
            };

            _cur_win._syshandler_onmouseup_forward = function (evt)
            {
                evt = _cur_win.event || evt;
                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                if(_cur_win._is_capture)
                {
                    var body = _cur_win.document.body;
                    _cur_win._is_capture = false;
                    body.releaseCapture();
                }
                return nexacro._syshandler_onmouseup(_cur_win.nexacro_HTMLSysEvent,  evt.srcElement, evt);
            };
            _cur_win._syshandler_lock_onmouseup_forward = nexacro._emptyFn;

            _cur_win._syshandler_onmousemove_forward = function (evt)
            {
                evt = _cur_win.event || evt;
                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                return nexacro._syshandler_onmousemove(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
            };
            _cur_win._syshandler_lock_onmousemove_forward = nexacro._emptyFn;

            _cur_win._syshandler_onlosecapture_forward = function (evt)
            {
                evt = _cur_win.event || evt;
            	if (_cur_win._is_capture)
            	{
            		_cur_win._is_capture = false;

            		var body = _cur_win.document.body;
            		var win = nexacro._findWindow(_cur_win.nexacro_HTMLSysEvent._cur_win);
            		var elem = nexacro.__findParentElement(evt.srcElement);

            		body.releaseCapture();

            		_cur_win.__clearGC();

            		var ret = win._on_sys_lbuttonup(win._cur_ldown_elem, evt.button, evt.alt, evt.ctrl, evt.shift, evt.wx, evt.wy, evt.sx, evt.sy);

            		if (!elem.isInputElement())
            			nexacro._stopSysEvent(evt);

            		return ret;
            	}
            	return true;
            };

            // IE는 IE10 이상 버젼부터 Touch를 지원함.
            _cur_win._touch_list = new nexacro.Collection();
            _cur_win._syshandler_ontouchstart_forward = function (evt)
            {
                if (evt.pointerType == evt.MSPOINTER_TYPE_MOUSE || evt.pointerType == "mouse")
                    return;

                evt.changedTouches = [];

                var touch = {};
                touch.clientX = evt.clientX;
                touch.clientY = evt.clientY;
                touch.screenX = evt.screenX;
                touch.screenY = evt.screenY;
                touch.timeStamp = evt.timeStamp;
                touch.identifier = evt.pointerId;

                this._touch_list.add(evt.pointerId.toString(), touch);
                evt.touches = Array.prototype.slice.call(this._touch_list, 0);
                evt.changedTouches.push(touch);

                return nexacro._syshandler_ontouchstart(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
            };
            _cur_win._syshandler_ontouchend_forward = function (evt)
            {
                if (evt.pointerType == evt.MSPOINTER_TYPE_MOUSE || evt.pointerType == "mouse")
                    return;

                evt.changedTouches = [];

                var touch = {};
                touch.clientX = evt.clientX;
                touch.clientY = evt.clientY;
                touch.screenX = evt.screenX;
                touch.screenY = evt.screxxY;
                touch.timeStamp = evt.timeStamp;
                touch.identifier = evt.pointerId;

                this._touch_list.remove(evt.pointerId.toString());
                evt.touches = Array.prototype.slice.call(this._touch_list, 0);
                evt.changedTouches.push(touch);

                return nexacro._syshandler_ontouchend(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
            };
            _cur_win._syshandler_ontouchmove_forward = function (evt)
            {
                if (evt.pointerType == evt.MSPOINTER_TYPE_MOUSE || evt.pointerType == "mouse")
                    return;

                evt.changedTouches = [];

                var touch = {};
                touch.clientX = evt.clientX;
                touch.clientY = evt.clientY;
                touch.screenX = evt.screenX;
                touch.screenY = evt.screenY;
                touch.timeStamp = evt.timeStamp;
                touch.identifier = evt.pointerId;

                this._touch_list.add(evt.pointerId.toString(), touch);
                evt.touches = Array.prototype.slice.call(this._touch_list, 0);
                evt.changedTouches.push(touch);

                return nexacro._syshandler_ontouchmove(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
            };
            _cur_win._syshandler_ontouchcancel_forward = function (evt)
            {
                if (evt.pointerType == evt.MSPOINTER_TYPE_MOUSE || evt.pointerType == "mouse")
                    return;

                evt.changedTouches = [];

                var touch = {};
                touch.clientX = evt.clientX;
                touch.clientY = evt.clientY;
                touch.screenX = evt.screenX;
                touch.screenY = evt.screenY;
                touch.timeStamp = evt.timeStamp;
                touch.identifier = evt.pointerId;

                this._touch_list.remove(evt.pointerId.toString());

                evt.touches = Array.prototype.slice.call(this._touch_list, 0);
                evt.changedTouches.push(touch);

                return nexacro._syshandler_ontouchcancel(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
            };

           

            _cur_win._syshandler_ondblclick_forward = function (evt)
            {
                evt = _cur_win.event || evt;
                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                return nexacro._syshandler_ondblclick(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
            };

            _cur_win._syshandler_onmouseover_forward = function (evt)
            {
                evt = _cur_win.event || evt;
                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                return nexacro._syshandler_onmouseover(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt.fromElement, evt);
            };
            _cur_win._syshandler_onmouseout_forward = function (evt)
            {
                evt = _cur_win.event || evt;
                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                return nexacro._syshandler_onmouseout(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt.toElement, evt);
            };

            _cur_win._syshandler_onkeydown_forward = function (evt)
            {
                evt = _cur_win.event || evt;
            
                if (_cur_win._linked_window && _cur_win._linked_window.frame._is_popup_frame && nexacro._getSysEventKeyCode(evt) == 116)
                {
                    evt.keyCode = 0;
                    evt.cancelBubble = true;
                    evt.returnValue = false;
                }

                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                return nexacro._syshandler_onkeydown(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
            };

          
            _cur_win._syshandler_onkeypress_forward = function (evt)
            {
                evt = _cur_win.event || evt;

                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                return nexacro._syshandler_onkeypress(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
            };

            _cur_win._syshandler_onkeyup_forward = function (evt)
            {
                evt = _cur_win.event || evt;

                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                return nexacro._syshandler_onkeyup(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
            };

            _cur_win._syshandler_onmousewheel_forward = function (evt)
            {
                evt = _cur_win.event || evt;
                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                return nexacro._syshandler_onmousewheel(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
            };

            _cur_win._syshandler_oncontextmenu_forward = function (evt)
            {
                evt = _cur_win.event || evt;
                return nexacro._syshandler_oncontextmenu(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
			};

			_cur_win._syshandler_ondragstart_forward = function (evt)
			{
				evt = _cur_win.event || evt;
				return nexacro._syshandler_ondragstart(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
			};

			_cur_win._syshandler_ondragenter_forward = function (evt)
			{
				evt = _cur_win.event || evt;
				return nexacro._syshandler_ondragenter(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt.fromElement, evt);
			};

			_cur_win._syshandler_ondragleave_forward = function (evt)
			{
				evt = _cur_win.event || evt;
				return nexacro._syshandler_ondragleave(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt.toElement, evt);
			};

			_cur_win._syshandler_ondragover_forward = function (evt)
			{
				evt = _cur_win.event || evt;
				return nexacro._syshandler_ondragover(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
			};

			_cur_win._syshandler_ondrop_forward = function (evt)
			{
				evt = _cur_win.event || evt;
				return nexacro._syshandler_ondrop(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
			};

            _cur_win._syshandler_onselectstart_forward = function (evt)
            {
                evt = _cur_win.event || evt;
                return nexacro._syshandler_onselectstart(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
            };

            _cur_win._syshandler_onactivate_forward = function (evt) //window activate using focus
            {
                evt = _cur_win.event || evt;
                return nexacro._syshandler_onactivate(_cur_win.nexacro_HTMLSysEvent, evt);
            };

            if (nexacro._BrowserVersion <= 8) // under ie8
            {
            	_cur_win._syshandler_ondeactivate_forward = function (evt) //window deactivate using focusout at ie
            	{
            		// ie8 이하 open창을 닫을때 발생하는 deactivate 이벤트 처리도중
            		// close처리가 되면서 내부 object들이 망가져 있는 문제가 발생함.
            		// (IE와 js엔진간 쓰레드 lock 문제로 판단됨)
            		try
            		{
            		    evt = _cur_win.event || evt;
            			if (evt.toElement || evt.relatedTarget) // evt.relatedTarget for ie11
            				return true;
            			return nexacro._syshandler_ondeactivate(_cur_win.nexacro_HTMLSysEvent, evt);
            		}
            		catch (e) { }
            	};
            }
            else
            {
                _cur_win._syshandler_ondeactivate_forward = function (evt) //window deactivate using focusout at ie
                {
                	
                    evt = _cur_win.event || evt;
                    if (evt.toElement || evt.relatedTarget) // evt.relatedTarget for ie11
                    	return true;
                    return nexacro._syshandler_ondeactivate(_cur_win.nexacro_HTMLSysEvent, evt);
                };
            }

            _cur_win._syshandler_onbeforeclose_forward = function (evt)
            {
                evt = _cur_win.event || evt;
                return nexacro._syshandler_onbeforeclose(_cur_win.nexacro_HTMLSysEvent, evt);
            };
            _cur_win._syshandler_onclose_forward = function (evt)
            {
                evt = _cur_win.event || evt;
                return nexacro._syshandler_onclose(_cur_win.nexacro_HTMLSysEvent, evt);
            };

            // nexacro._getElementXYInWindow에서 사용할 zoom level 계산
            nexacro._calculateZoomLevel = function ()
            {
                var _doc = _cur_win.document;
                var doc_elem = _doc.documentElement;
                var body = _doc.body;

                var docBox = body.getBoundingClientRect();
                var physicalW = docBox.right - docBox.left;
                var logicalW = body.offsetWidth;

                // the zoom level is always an integer percent value
                nexacro._zoomfactor = Math.round((physicalW / logicalW) * 100) / 100;
            };

            nexacro._calculateZoomLevel();
            _cur_win._syshandler_onresize_forward = function (evt) //window resize
            {
                evt = _cur_win.event || evt;
                nexacro._calculateZoomLevel();
                return nexacro._syshandler_onresize(_cur_win.nexacro_HTMLSysEvent, evt);
            };
            _cur_win._syshandler_onorientationchange_forward = function (evt) //window resize
            {
                evt = _cur_win.event || evt;
                nexacro._calculateZoomLevel();
                return nexacro._syshandler_onorientationchange(_cur_win.nexacro_HTMLSysEvent, evt);
            };
            _cur_win._syshandler_onmove_forward = function (evt) //window move
            {
                // beforeClose시 타이머를 죽이고 있으나, 이미 수행중인 경우 문제가 됨 (IE, FF)
                _cur_win.nexacro_HTMLSysEvent._stopDetectWindowMove();
                try
                {
                    // detecting browser window move
                    var oldX = _cur_win._old_screenx;
                    var oldY = _cur_win._old_screeny;

                    if (oldX != _cur_win.screenLeft || oldY != _cur_win.screenTop)
                    {
                        _cur_win._old_screenx = _cur_win.screenLeft;
                        _cur_win._old_screeny = _cur_win.screenTop;
                
                        evt = _cur_win.event || evt;

                        var ret = nexacro._syshandler_onmove(_cur_win.nexacro_HTMLSysEvent, evt);
                        _cur_win.nexacro_HTMLSysEvent._move_detect_timer = setTimeout(_cur_win.nexacro_HTMLSysEvent._syshandler_onmove_forward, 500);

                        return ret;
                    }
                } catch (e) { }
                _cur_win.nexacro_HTMLSysEvent._move_detect_timer = setTimeout(_cur_win.nexacro_HTMLSysEvent._syshandler_onmove_forward, 500);
            };
            _cur_win._syshandler_onload_forward = function (evt)
            {
                evt = _cur_win.event || evt;
                return nexacro._syshandler_onload(_cur_win.nexacro_HTMLSysEvent, evt);
            };
        };
    }
    else if (nexacro._Browser != "IE")
    {
        nexacro._createSysEvent_ForwardFuncs = function (_cur_win)
        {
            _cur_win._syshandler_onmessage_forward = function (evt)
            {
                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                return nexacro._syshandler_onmessage(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };

            _cur_win._syshandler_onmousedown_forward = function (evt)
            {
                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }

                if (nexacro._Browser == "Gecko")
                    window.event = evt;

                if (nexacro._isTouchInteraction)
                {
                    // TODO Android에서 Input Caret이동을 원할 경우 mouse이벤트도
                    // preventDefault 하지 않아야 한다. 아래 주석처리하고 return만 해야 함.
                	// -> mousedown, mouseup, mousemove
                	var elem = nexacro.__findParentElement(evt.target);
                    if (nexacro._OS == "Android")
                    {
                        var win = nexacro._findWindow(_cur_win);                        

                        // 대상이 Input이면 Caret 이동 등 처리를 위해 Pass.
                        // 대상이 Input이 아니면 preventDefault (node가 포커스를 가져가선 안됨)
                        if (elem)
                        {
                        	if (elem.isInputElement() && elem.enable)
                        	{

                        	}
                        	else
                        	{
                        		var last_focused_elem = win._last_focused_elem;
                        		if (!last_focused_elem || !(last_focused_elem.isInputElement() && last_focused_elem.enable))
                        		{
                        			evt.preventDefault();
                        		}
                        	}
                        }
                        if (nexacro._Browser != "Chrome" || nexacro._BrowserVersion < 58 || nexacro._is_touch_flag)
                        {
                            nexacro._is_touch_flag = false;
                            return false;
                        }
                    }
                    else
                    {
                    	if (elem && !elem.isInputElement())
                        {
                            evt.stopPropagation();
                            evt.preventDefault();
                    	}
                    	return false;
                    }
                }
                return nexacro._syshandler_onmousedown(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };
            _cur_win._syshandler_onmouseup_forward = function (evt)
            {
                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }

                if (nexacro._Browser == "Gecko")
                    window.event = evt;

                if (nexacro._isTouchInteraction)
                {                    
                    if (nexacro._OS != "Android")
                    {
                        evt.stopPropagation();
                        evt.preventDefault();
                    }
                    return false;
                }

                return nexacro._syshandler_onmouseup(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };
            _cur_win._syshandler_lock_onmouseup_forward = function (evt)
            {
                if (nexacro._Browser == "Gecko")
                    window.event = evt;

                return nexacro._syshandler_lock_onmouseup(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };
            _cur_win._syshandler_onmousemove_forward = function (evt)
            {
                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }

                if (nexacro._Browser == "Gecko")
                    window.event = evt;

                if (nexacro._isTouchInteraction)
                {   
                    if (nexacro._OS != "Android")
                    {
                        evt.stopPropagation();
                      //  evt.preventDefault();
                    }
                    return false;
                }
                return nexacro._syshandler_onmousemove(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };
            _cur_win._syshandler_lock_onmousemove_forward = function (evt)
            {
                if (nexacro._Browser == "Gecko")
                    window.event = evt;

                return nexacro._syshandler_lock_onmousemove(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };

            _cur_win._syshandler_onlosecapture_forward = nexacro._emptyFn;

        	// Modern Browser는 Touch를 지원함.
            _cur_win._syshandler_ontouchstart_forward = function (evt)
            {                
                nexacro._is_touch_flag = true;
                //evt.preventDefault();
                var elem = nexacro.__findParentElement(evt.target);
                if (elem.isInputElement() && elem.enable)
                {
                    elem._is_input_touchstart = true;
                    elem._on_sys_touchstart(evt);
                }
                
                return nexacro._syshandler_ontouchstart(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };
            _cur_win._syshandler_ontouchend_forward = function (evt)
            {
                var elem = nexacro.__findParentElement(evt.target);
                if (elem.isInputElement() && elem.enable)
                {
                    elem._on_sys_touchend(evt);
                }
                return nexacro._syshandler_ontouchend(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };
            _cur_win._syshandler_ontouchmove_forward = function (evt)
            {
                var elem = nexacro.__findParentElement(evt.target);
                if (elem.isInputElement() && elem.enable)
                {
                    elem._on_sys_touchmove(evt);
                }              
                return nexacro._syshandler_ontouchmove(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };
            _cur_win._syshandler_ontouchcancel_forward = function (evt)
            {
                var elem = nexacro.__findParentElement(evt.target);
                if (elem.isInputElement() && elem.enable)
                {
                    return;
                    //nexacro._stopSysEvent(evt);
                    //return;
                }
                return nexacro._syshandler_ontouchcancel(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };

            _cur_win._syshandler_ongesturestart_forward = function (evt)
            {
                if (!nexacro._allow_default_pinchzoom)
                    evt.preventDefault();
            };

            _cur_win._syshandler_ondblclick_forward = function (evt)
            {
                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                if (nexacro._isTouchInteraction)
                {   
                    if (nexacro._OS != "Android")
                    {
                        evt.stopPropagation();
                        evt.preventDefault();
                    }
                    return false;
                }
                return nexacro._syshandler_ondblclick(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };

            _cur_win._syshandler_onmouseover_forward = function (evt)
            {
                return nexacro._syshandler_onmouseover(_cur_win.nexacro_HTMLSysEvent, evt.target, evt.relatedTarget, evt);
            };
            _cur_win._syshandler_onmouseout_forward = function (evt)
            {
                return nexacro._syshandler_onmouseout(_cur_win.nexacro_HTMLSysEvent, evt.target, evt.relatedTarget, evt);
            };

            _cur_win._syshandler_onkeydown_forward = function (evt)
            {
                if (!nexacro.__getWindowHandleEnable(_cur_win) || (_cur_win._linked_window.frame._is_popup_frame && nexacro._getSysEventKeyCode(evt) == 116))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                return nexacro._syshandler_onkeydown(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };

            _cur_win._syshandler_onkeypress_forward = function (evt)
            {
                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                return nexacro._syshandler_onkeypress(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };
            _cur_win._syshandler_onkeyup_forward = function (evt)
            {
                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                return nexacro._syshandler_onkeyup(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };

            _cur_win._syshandler_onmousewheel_forward = function (evt)
            {
                if (!nexacro.__getWindowHandleEnable(_cur_win))
                {
                    nexacro._stopSysEvent(evt);
                    return;
                }
                return nexacro._syshandler_onmousewheel(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };

            _cur_win._syshandler_oncontextmenu_forward = function (evt)
            {
                return nexacro._syshandler_oncontextmenu(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };

			_cur_win._syshandler_ondragstart_forward = function (evt)
			{
				if (nexacro._Browser == "Gecko")
					_cur_win.event = evt;

				evt = _cur_win.event || evt;
				return nexacro._syshandler_ondragstart(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
			};

			_cur_win._syshandler_ondragenter_forward = function (evt)
			{
				if (nexacro._Browser == "Gecko")
					_cur_win.event = evt;

				evt = _cur_win.event || evt;
				return nexacro._syshandler_ondragenter(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt.relatedTarget ? evt.relatedTarget : null, evt);
			};

			_cur_win._syshandler_ondragleave_forward = function (evt)
			{
				if (nexacro._Browser == "Gecko")
					_cur_win.event = evt;

				evt = _cur_win.event || evt;
				return nexacro._syshandler_ondragleave(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt.relatedTarget ? evt.relatedTarget : null, evt);
			};

			_cur_win._syshandler_ondragover_forward = function (evt)
			{
				if (nexacro._Browser == "Gecko")
					_cur_win.event = evt;

				evt = _cur_win.event || evt;
				return nexacro._syshandler_ondragover(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
			};

			_cur_win._syshandler_ondrop_forward = function (evt)
			{
				if (nexacro._Browser == "Gecko")
					_cur_win.event = evt;

				evt = _cur_win.event || evt;
				return nexacro._syshandler_ondrop(_cur_win.nexacro_HTMLSysEvent, evt.srcElement, evt);
			};

            _cur_win._syshandler_onselectstart_forward = function (evt)
            {
                return nexacro._syshandler_onselectstart(_cur_win.nexacro_HTMLSysEvent, evt.target, evt);
            };

            _cur_win._syshandler_onactivate_forward = function (evt) //window activate using focus
            {
                return nexacro._syshandler_onactivate(_cur_win.nexacro_HTMLSysEvent, evt);
            };
            _cur_win._syshandler_ondeactivate_forward = function (evt) //window deactivate using blur except ie
            {
                return nexacro._syshandler_ondeactivate(_cur_win.nexacro_HTMLSysEvent, evt);
            };
            _cur_win._syshandler_onbeforeclose_forward = function (evt)
            {
                return nexacro._syshandler_onbeforeclose(_cur_win.nexacro_HTMLSysEvent, evt);
            };
            _cur_win._syshandler_onclose_forward = function (evt)
            {
                return nexacro._syshandler_onclose(_cur_win.nexacro_HTMLSysEvent, evt);
            };
            
            nexacro._calculateZoomLevel = nexacro._emptyFn;
            
            _cur_win._syshandler_onresize_forward = function (evt) //window resize
            {
                return nexacro._syshandler_onresize(_cur_win.nexacro_HTMLSysEvent, evt);
            };
            _cur_win._syshandler_onorientationchange_forward = function (evt)
            {
                // 안드로이드 장비의 경우 화면을 돌렸을때 screen.w/h 값이 서로 바뀌기때문에
                // 그에맞게 viewport를 다시 세팅해줘야 함. (기기마다 다르다 -> 예외테이블로 관리)

                // 또한 화면 회전이 되어도 기존 contents width가 유지되는 경우도 있음
                // (가로,세로 해상도 swap이 되어야 하는데 되지 않음)

                // 기본브라우저 뿐만이 아니고 Chrome에서도 발생함.

                // viewport를 다시 세팅해줘도 반영되지 않는 기기/브라우저도 있음. (-> 이경우 처리 불가)
                
                var reset_viewport = nexacro._searchDeviceExceptionValue("orientationchange_reset_viewport");
                if (nexacro._OS == "Android" && reset_viewport)// && nexacro._Browser != "Chrome")
                {
                    // screen width,height 값의 swap 여부가 기기/브라우저마다 모두 다르다.
                    // 또한 swap 되지만 늦게 swap되는 경우도 있다.
                    var _tester = nexacro._device_exception_tester;
                    if (_tester.screen_checked && _tester.screen_swap_checked === false)
                    {
                        if (_tester.is_init_screen_portrait != nexacro._isPortrait())
                        {
                            if (_tester.init_screen_width == nexacro._getScreenWidth())
                                _tester.swap_screen = false;
                            else
                                _tester.swap_screen = true;
                            _tester.screen_swap_checked = true;
                        }
                    }

                    // OS 버젼 체크해야 할수도.
                    var delayed_swap_screen = _tester.delayed_swap_screen;
                    if (delayed_swap_screen === undefined)
                        delayed_swap_screen = nexacro._searchDeviceExceptionValue("delayed_swap_screen");
                    if (delayed_swap_screen === true)
                    {
                        // 한번이라도 테스트가 수행됐거나, 예외 테이블에 명시된 경우...
                        // 지연되어 swap되는 경우, 바귈때까지 기다림.
                        _tester.swap_screen_timer = setInterval(function ()
                        {
                            var p_w = _tester.portrait_screen_width;
                            var l_w = _tester.landscape_screen_width;
                            var is_changed = false;
                            if (!nexacro._isPortrait() && ((p_w && p_w != nexacro._getScreenWidth()) || (l_w && l_w == nexacro._getScreenWidth())))
                                is_changed = true;
                            else if (nexacro._isPortrait() && ((l_w && l_w != nexacro._getScreenWidth()) || (p_w && p_w == nexacro._getScreenWidth())))
                                is_changed = true;
                            if (is_changed)
                            {
                                clearInterval(_tester.swap_screen_timer);
                                _tester.swap_screen_timer = null;

                                nexacro.__setViewportScale();
                            }
                        }, 100);
                    }
                    else
                    {
                        
                        var reset_viewport_delay = nexacro._searchDeviceExceptionValue("reset_viewport_delay");                        
                        if (reset_viewport_delay <= 0)
                        {
                            // 정보가 없는 경우 일단 수행
                            nexacro.__setViewportScale();
                        }
                        else
                        {
                            setTimeout(function ()
                            {
                                nexacro.__setViewportScale();
                            }, parseInt(reset_viewport_delay));
                        }
                        

                        // 지연되어 swap 되는지 정보가 없는 경우 테스트 수행
                        if (_tester.swap_screen === false && _tester.delayed_swap_screen_checked === false)
                        {
                            // screen 값이 swap 되지 않는 것으로 보였을때... 늦게 바뀌는지 체크
                            _tester.delayed_swap_screen_check_cnt = 0;
                            if (_tester.swap_screen_timer)
                                clearInterval(_tester.swap_screen_timer);
                            _tester.swap_screen_timer = setInterval(function ()
                            {
                                // 혹시나 screen의 값이 swap 되었는지 체크
                                var p_w = _tester.portrait_screen_width;
                                var l_w = _tester.landscape_screen_width;
                                var is_changed = false;
                                if (!nexacro._isPortrait() && ((p_w && p_w != nexacro._getScreenWidth()) || (l_w && l_w == nexacro._getScreenWidth())))
                                    is_changed = true;
                                else if (nexacro._isPortrait() && ((l_w && l_w != nexacro._getScreenWidth()) || (p_w && p_w == nexacro._getScreenWidth())))
                                    is_changed = true;
                                if (is_changed || _tester.delayed_swap_screen_check_cnt == 10)
                                {
                                    clearInterval(_tester.swap_screen_timer);
                                    _tester.swap_screen_timer = null;
                                    _tester.delayed_swap_screen = is_changed;
                                    _tester.delayed_swap_screen_checked = true;
                                    
                                    // screen 값이 늦게 swap되는 이상한 환경이다!
                                    if (is_changed)
                                        nexacro.__setViewportScale(); 
                                    return;
                                }

                                _tester.delayed_swap_screen_check_cnt++;
                            }, 100);
                        }
                    }

                    // 좀 늦게 반영해야 제대로 동작하는 기기도 있다....
                }                
                evt = _cur_win.event || evt;
                return nexacro._syshandler_onorientationchange(_cur_win.nexacro_HTMLSysEvent, evt);
            };

            _cur_win._syshandler_onmove_forward = function (evt) //window move
            {
                // beforeClose시 타이머를 죽이고 있으나, 이미 수행중인 경우 문제가 됨 (IE, FF)
                _cur_win.nexacro_HTMLSysEvent._stopDetectWindowMove();
                try
                {
                    // detecting browser window move
                    var oldX = _cur_win._old_screenx;
                    var oldY = _cur_win._old_screeny;
            
                    if (oldX != _cur_win.screenX || oldY != _cur_win.screenY)
                    {
                        _cur_win._old_screenx = _cur_win.screenX;
                        _cur_win._old_screeny = _cur_win.screenY;

                        evt = _cur_win.event || evt;

                        var ret = nexacro._syshandler_onmove(_cur_win.nexacro_HTMLSysEvent, evt);
                        _cur_win.nexacro_HTMLSysEvent._move_detect_timer = setTimeout(_cur_win.nexacro_HTMLSysEvent._syshandler_onmove_forward, 500);
                        return ret;
                    }
                } catch (e) { }
                _cur_win.nexacro_HTMLSysEvent._move_detect_timer = setTimeout(_cur_win.nexacro_HTMLSysEvent._syshandler_onmove_forward, 500);
            };
            _cur_win._syshandler_onload_forward = function (evt)
            {
                return nexacro._syshandler_onload(_cur_win.nexacro_HTMLSysEvent, evt);
            };
        };
    }
		
	//==============================================================================
    nexacro.HTMLSysEvent = function (_win_win, _win_doc, _cur_win, _cur_doc)
	{
		this._win_win = _win_win;
		this._win_doc = _win_doc;
		this._cur_win = _cur_win;
		this._cur_doc = _cur_doc;
		
		this._cur_over_elem = null;
				
		this._syshandler_onmessage_forward = _cur_win._syshandler_onmessage_forward;
		this._syshandler_onmousedown_forward = _cur_win._syshandler_onmousedown_forward;
		this._syshandler_onmouseup_forward = _cur_win._syshandler_onmouseup_forward;
		this._syshandler_lock_onmouseup_forward = _cur_win._syshandler_lock_onmouseup_forward;
		this._syshandler_onmousemove_forward = _cur_win._syshandler_onmousemove_forward;
		this._syshandler_lock_onmousemove_forward = _cur_win._syshandler_lock_onmousemove_forward;
		this._syshandler_onlosecapture_forward = _cur_win._syshandler_onlosecapture_forward;
		this._syshandler_ontouchstart_forward = _cur_win._syshandler_ontouchstart_forward;
		this._syshandler_ontouchend_forward = _cur_win._syshandler_ontouchend_forward;
		this._syshandler_ontouchmove_forward = _cur_win._syshandler_ontouchmove_forward;
		this._syshandler_ontouchcancel_forward = _cur_win._syshandler_ontouchcancel_forward;
		this._syshandler_ondblclick_forward = _cur_win._syshandler_ondblclick_forward;
		this._syshandler_onmouseover_forward = _cur_win._syshandler_onmouseover_forward;
		this._syshandler_onmouseout_forward = _cur_win._syshandler_onmouseout_forward;
        this._syshandler_onkeydown_forward = _cur_win._syshandler_onkeydown_forward;
		this._syshandler_onkeypress_forward = _cur_win._syshandler_onkeypress_forward;
		this._syshandler_onkeyup_forward = _cur_win._syshandler_onkeyup_forward;
		this._syshandler_onmousewheel_forward = _cur_win._syshandler_onmousewheel_forward;
		this._syshandler_oncontextmenu_forward = _cur_win._syshandler_oncontextmenu_forward;
		this._syshandler_ondragstart_forward = _cur_win._syshandler_ondragstart_forward;
		this._syshandler_ondragenter_forward = _cur_win._syshandler_ondragenter_forward;
		this._syshandler_ondragover_forward = _cur_win._syshandler_ondragover_forward;
		this._syshandler_ondragleave_forward = _cur_win._syshandler_ondragleave_forward;
		this._syshandler_ondrop_forward = _cur_win._syshandler_ondrop_forward;
		this._syshandler_onselectstart_forward = _cur_win._syshandler_onselectstart_forward;
		this._syshandler_onactivate_forward = _cur_win._syshandler_onactivate_forward;
		this._syshandler_ondeactivate_forward = _cur_win._syshandler_ondeactivate_forward;
		this._syshandler_onbeforeclose_forward = _cur_win._syshandler_onbeforeclose_forward;
		this._syshandler_onclose_forward = _cur_win._syshandler_onclose_forward;
		this._syshandler_onresize_forward = _cur_win._syshandler_onresize_forward;
		this._syshandler_onorientationchange_forward = _cur_win._syshandler_onorientationchange_forward;
		this._syshandler_onmove_forward = _cur_win._syshandler_onmove_forward;
        this._syshandler_onload_forward = _cur_win._syshandler_onload_forward;
        this._syshandler_ongesturestart_forward = _cur_win._syshandler_ongesturestart_forward;

		_cur_win._syshandler_onmessage_forward = null;
		_cur_win._syshandler_onmousedown_forward = null;
		_cur_win._syshandler_onmouseup_forward = null;
		_cur_win._syshandler_lock_onmouseup_forward = null;
		_cur_win._syshandler_onmousemove_forward = null;
		_cur_win._syshandler_lock_onmousemove_forward = null;
		_cur_win._syshandler_onlosecapture_forward = null;
		_cur_win._syshandler_ontouchstart_forward = null;
		_cur_win._syshandler_ontouchend_forward = null;
		_cur_win._syshandler_ontouchmove_forward = null;
		_cur_win._syshandler_ontouchcancel_forward = null;
		_cur_win._syshandler_ondblclick_forward = null;
		_cur_win._syshandler_onmouseover_forward = null;
		_cur_win._syshandler_onmouseout_forward = null;
		_cur_win._syshandler_onkeydown_forward = null;
		_cur_win._syshandler_onkeypress_forward = null;
		_cur_win._syshandler_onkeyup_forward = null;
		_cur_win._syshandler_onmousewheel_forward = null;
		_cur_win._syshandler_oncontextmenu_forward = null;
		_cur_win._syshandler_ondragstart_forward = null;
		_cur_win._syshandler_ondragenter_forward = null;
		_cur_win._syshandler_ondragover_forward = null;
		_cur_win._syshandler_ondragleave_forward = null;
		_cur_win._syshandler_ondrop_forward = null;
		_cur_win._syshandler_onselectstart_forward = null;
		_cur_win._syshandler_onactivate_forward = null;
		_cur_win._syshandler_ondeactivate_forward = null;
		_cur_win._syshandler_onbeforeclose_forward = null;
		_cur_win._syshandler_onclose_forward = null;
		_cur_win._syshandler_onresize_forward = null;
        _cur_win._syshandler_onorientationchange_forward = null;
        _cur_win._syshandler_onmove_forward = null;
        _cur_win._syshandler_onload_forward = null;
	};
	var _pHTMLSysEvent = nexacro.HTMLSysEvent.prototype;

	_pHTMLSysEvent.KEY_BACKSPACE = 8;
	_pHTMLSysEvent.KEY_TAB = 9;
	_pHTMLSysEvent.KEY_RETURN = 13;
	_pHTMLSysEvent.KEY_ESC = 27;
	_pHTMLSysEvent.KEY_SPACE = 32;
	_pHTMLSysEvent.KEY_LEFT = 37;
	_pHTMLSysEvent.KEY_UP = 38;
	_pHTMLSysEvent.KEY_RIGHT = 39;
	_pHTMLSysEvent.KEY_DOWN = 40;
	_pHTMLSysEvent.KEY_DELETE = 46;
	_pHTMLSysEvent.KEY_HOME = 36;
	_pHTMLSysEvent.KEY_END = 35;
	_pHTMLSysEvent.KEY_PAGEUP = 33;
	_pHTMLSysEvent.KEY_PAGEDOWN = 34;
	_pHTMLSysEvent.KEY_INSERT = 45;

    if (nexacro._Browser == "IE" && nexacro._BrowserVersion < 11)
    {
	    _pHTMLSysEvent.MOUSE_LBUTTON = 1;
	    _pHTMLSysEvent.MOUSE_MBUTTON = 4;
	    _pHTMLSysEvent.MOUSE_RBUTTON = 2;
    }
    else
    {
        _pHTMLSysEvent.MOUSE_LBUTTON = 0;
        _pHTMLSysEvent.MOUSE_MBUTTON = 1;
        _pHTMLSysEvent.MOUSE_RBUTTON = 2;
    }
	
    if (nexacro._Browser == "IE")
    {
        _pHTMLSysEvent._initDocEventHandler = function ()
        {
            var _cur_win = this._cur_win;
            var _cur_doc = this._cur_doc;
            var body = _cur_doc.body;
            nexacro._observeSysEvent(_cur_win, "message", "onmessage", this._syshandler_onmessage_forward);
            nexacro._observeSysEvent(body, "mousedown", "onmousedown", this._syshandler_onmousedown_forward);
            nexacro._observeSysEvent(body, "mouseup", "onmouseup", this._syshandler_onmouseup_forward);
            nexacro._observeSysEvent(body, "mousemove", "onmousemove", this._syshandler_onmousemove_forward);
            nexacro._observeSysEvent(body, "losecapture", "onlosecapture", this._syshandler_onlosecapture_forward);
            if (nexacro._SupportTouchEvent)
            {
                if (nexacro._BrowserType == "Edge")
                {
                    nexacro._observeSysEvent(_cur_win, "pointerdown", "onpointerdown", this._syshandler_ontouchstart_forward);
                    nexacro._observeSysEvent(_cur_win, "pointerup", "onpointerup", this._syshandler_ontouchend_forward);
                    nexacro._observeSysEvent(_cur_win, "pointermove", "onpointermove", this._syshandler_ontouchmove_forward);
                    nexacro._observeSysEvent(_cur_win, "pointercancel", "onpointercancel", this._syshandler_ontouchcancel_forward);
                }
                else
                {
                    nexacro._observeSysEvent(_cur_win, "MSPointerDown", "ontouchstart", this._syshandler_ontouchstart_forward);
                    nexacro._observeSysEvent(_cur_win, "MSPointerUp", "ontouchend", this._syshandler_ontouchend_forward);
                    nexacro._observeSysEvent(_cur_win, "MSPointerMove", "ontouchmove", this._syshandler_ontouchmove_forward);
                    nexacro._observeSysEvent(_cur_win, "MSPointerCancel", "ontouchcancel", this._syshandler_ontouchcancel_forward);
                }
            }
            nexacro._observeSysEvent(body, "dblclick", "ondblclick", this._syshandler_ondblclick_forward);
            nexacro._observeSysEvent(body, "mouseover", "onmouseover", this._syshandler_onmouseover_forward);
            nexacro._observeSysEvent(body, "mouseout", "onmouseout", this._syshandler_onmouseout_forward);
            nexacro._observeSysEvent(body, "keydown", "onkeydown", this._syshandler_onkeydown_forward);
            nexacro._observeSysEvent(body, "keypress", "onkeypress", this._syshandler_onkeypress_forward);
            nexacro._observeSysEvent(body, "keyup", "onkeyup", this._syshandler_onkeyup_forward);
            nexacro._observeSysEvent(body, "mousewheel", "onmousewheel", this._syshandler_onmousewheel_forward);
			nexacro._observeSysEvent(body, "contextmenu", "oncontextmenu", this._syshandler_oncontextmenu_forward);
			nexacro._observeSysEvent(body, "select", "onselect", this._syshandler_onselectstart_forward);
            nexacro._observeSysEvent(body, "selectstart", "onselectstart", this._syshandler_onselectstart_forward);
			nexacro._observeSysEvent(body, "dragstart", "ondragstart", this._syshandler_ondragstart_forward);
			nexacro._observeSysEvent(body, "dragenter", "ondragenter", this._syshandler_ondragenter_forward);
			nexacro._observeSysEvent(body, "dragover", "ondragover", this._syshandler_ondragover_forward);
			nexacro._observeSysEvent(body, "dragleave", "ondragleave", this._syshandler_ondragleave_forward);
			nexacro._observeSysEvent(body, "drop", "ondrop", this._syshandler_ondrop_forward);

            nexacro._observeSysEvent(_cur_win, "focus", "onfocus", this._syshandler_onactivate_forward);
            nexacro._observeSysEvent(_cur_doc, "focusout", "onfocusout", this._syshandler_ondeactivate_forward);
            nexacro._observeSysEvent(_cur_win, "beforeunload", "onbeforeunload", this._syshandler_onbeforeclose_forward);
            nexacro._observeSysEvent(_cur_win, "unload", "onunload", this._syshandler_onclose_forward);
            nexacro._observeSysEvent(_cur_win, "resize", "onresize", this._syshandler_onresize_forward);
            nexacro._observeSysEvent(_cur_win, "orientationchange", "onorientationchange", this._syshandler_onorientationchange_forward);

            // onmousewheel & DOMMouseScroll is deprecated. instead use 'onwheel'
            nexacro._observeSysEvent(body, "wheel", "onwheel", this._syshandler_onmousewheel_forward);

            nexacro._observeSysEvent(body, "load", "onload", this._syshandler_onload_forward);

            this._startDetectWindowMove();
        };
        _pHTMLSysEvent._stopDocEventHandler = function ()
        {
            var _cur_win = this._cur_win;
            var _cur_doc = this._cur_doc;
            var body = _cur_doc.body;

            this._stopDetectWindowMove();

            nexacro._stopSysObserving(_cur_win, "message", "onmessage", this._syshandler_onmessage_forward);
            nexacro._stopSysObserving(body, "mousedown", "onmousedown", this._syshandler_onmousedown_forward);
            nexacro._stopSysObserving(body, "mouseup", "onmouseup", this._syshandler_onmouseup_forward);
            nexacro._stopSysObserving(body, "mousemove", "onmousemove", this._syshandler_onmousemove_forward);
            nexacro._stopSysObserving(body, "losecapture", "onlosecapture", this._syshandler_onlosecapture_forward);
            if (nexacro._SupportTouchEvent)
            {
                if (nexacro._BrowserType == "Edge")
                {
                    nexacro._stopSysObserving(_cur_win, "pointerdown", "onpointerdown", this._syshandler_ontouchstart_forward);
                    nexacro._stopSysObserving(_cur_win, "pointerup", "onpointerup", this._syshandler_ontouchend_forward);
                    nexacro._stopSysObserving(_cur_win, "pointermove", "onpointermove", this._syshandler_ontouchmove_forward);
                    nexacro._stopSysObserving(_cur_win, "pointercancel", "onpointercancel", this._syshandler_ontouchcancel_forward);
                }
                else
                {
                    nexacro._stopSysObserving(_cur_win, "MSPointerDown", "ontouchstart", this._syshandler_ontouchstart_forward);
                    nexacro._stopSysObserving(_cur_win, "MSPointerUp", "ontouchend", this._syshandler_ontouchend_forward);
                    nexacro._stopSysObserving(_cur_win, "MSPointerMove", "ontouchmove", this._syshandler_ontouchmove_forward);
                    nexacro._stopSysObserving(_cur_win, "MSPointerCancel", "ontouchcancel", this._syshandler_ontouchcancel_forward);
                }
            }
            nexacro._stopSysObserving(body, "dblclick", "ondblclick", this._syshandler_ondblclick_forward);
            nexacro._stopSysObserving(body, "mouseover", "onmouseover", this._syshandler_onmouseover_forward);
            nexacro._stopSysObserving(body, "mouseout", "onmouseout", this._syshandler_onmouseout_forward);
            nexacro._stopSysObserving(body, "keydown", "onkeydown", this._syshandler_onkeydown_forward);
            nexacro._stopSysObserving(body, "keypress", "onkeypress", this._syshandler_onkeypress_forward);
            nexacro._stopSysObserving(body, "keyup", "onkeyup", this._syshandler_onkeyup_forward);
            nexacro._stopSysObserving(body, "mousewheel", "onmousewheel", this._syshandler_onmousewheel_forward);
            nexacro._stopSysObserving(body, "contextmenu", "oncontextmenu", this._syshandler_oncontextmenu_forward);
            nexacro._stopSysObserving(body, "select", "onselect", this._syshandler_onselectstart_forward);
            nexacro._stopSysObserving(body, "selectstart", "onselectstart", this._syshandler_onselectstart_forward);
			nexacro._stopSysObserving(body, "dragstart", "ondragstart", this._syshandler_ondragstart_forward);
			nexacro._stopSysObserving(body, "dragenter", "ondragenter", this._syshandler_ondragenter_forward);
			nexacro._stopSysObserving(body, "dragover", "ondragover", this._syshandler_ondragover_forward);
			nexacro._stopSysObserving(body, "dragleave", "ondragleave", this._syshandler_ondragleave_forward);
			nexacro._stopSysObserving(body, "drop", "ondrop", this._syshandler_ondrop_forward);

            nexacro._stopSysObserving(_cur_win, "focus", "onfocus", this._syshandler_onactivate_forward);
            nexacro._stopSysObserving(_cur_doc, "focusout", "onfocusout", this._syshandler_ondeactivate_forward);
            nexacro._stopSysObserving(_cur_win, "beforeunload", "onbeforeunload", this._syshandler_onbeforeclose_forward);
            nexacro._stopSysObserving(_cur_win, "unload", "onunload", this._syshandler_onclose_forward);
            nexacro._stopSysObserving(_cur_win, "resize", "onresize", this._syshandler_onresize_forward);
            nexacro._stopSysObserving(_cur_win, "orientationchange", "onorientationchange", this._syshandler_onorientationchange_forward);

            // onmousewheel & DOMMouseScroll is deprecated. instead use 'onwheel'
            nexacro._stopSysObserving(body, "wheel", "onwheel", this._syshandler_onmousewheel_forward);

            nexacro._stopSysObserving(body, "load", "onload", this._syshandler_onload_forward);
        };
	
	    _pHTMLSysEvent.lockMouseMove = function (/*node*/)
	    {
	    };
	    _pHTMLSysEvent.unloackMouseMove = function (/*node*/)
	    {
	    };
    }
    else if (nexacro._Browser != "IE")
    {
        _pHTMLSysEvent._initDocEventHandler = function ()
        {
            var _cur_win = this._cur_win;
            var body = this._cur_doc.body;
            
            nexacro._observeSysEvent(body, "mousedown", "onmousedown", this._syshandler_onmousedown_forward);
            nexacro._observeSysEvent(body, "mouseup", "onmouseup", this._syshandler_onmouseup_forward);
            nexacro._observeSysEvent(body, "mousemove", "onmousemove", this._syshandler_onmousemove_forward);
            nexacro._observeSysEvent(body, "mouseover", "onmouseover", this._syshandler_onmouseover_forward);
            nexacro._observeSysEvent(body, "mouseout", "onmouseout", this._syshandler_onmouseout_forward);
            nexacro._observeSysEvent(body, "mousewheel", "onmousewheel", this._syshandler_onmousewheel_forward);
            if (nexacro._SupportTouchEvent)
            {
                nexacro._observeSysEvent(body, "touchstart", "ontouchstart", this._syshandler_ontouchstart_forward);
                nexacro._observeSysEvent(body, "touchend", "ontouchend", this._syshandler_ontouchend_forward);
                nexacro._observeSysEvent(body, "touchmove", "ontouchmove", this._syshandler_ontouchmove_forward);
                nexacro._observeSysEvent(body, "touchcancel", "ontouchcancel", this._syshandler_ontouchcancel_forward);
                if (nexacro._Browser == "MobileSafari")
                   nexacro._observeSysEvent(body, "gesturestart", "ongesturestart", this._syshandler_ongesturestart_forward);
            }
            nexacro._observeSysEvent(body, "dblclick", "ondblclick", this._syshandler_ondblclick_forward);
            nexacro._observeSysEvent(body, "keydown", "onkeydown", this._syshandler_onkeydown_forward);
            nexacro._observeSysEvent(body, "keypress", "onkeypress", this._syshandler_onkeypress_forward);
            nexacro._observeSysEvent(body, "keyup", "onkeyup", this._syshandler_onkeyup_forward);
            nexacro._observeSysEvent(body, "DOMMouseScroll", "onDOMMouseScroll", this._syshandler_onmousewheel_forward);
            nexacro._observeSysEvent(body, "contextmenu", "oncontextmenu", this._syshandler_oncontextmenu_forward);
            nexacro._observeSysEvent(body, "select", "onselect", this._syshandler_onselectstart_forward);
            nexacro._observeSysEvent(body, "selectstart", "onselectstart", this._syshandler_onselectstart_forward);
            nexacro._observeSysEvent(body, "load", "onload", this._syshandler_onload_forward);
			nexacro._observeSysEvent(body, "dragstart", "ondragstart", this._syshandler_ondragstart_forward);
			nexacro._observeSysEvent(body, "dragenter", "ondragenter", this._syshandler_ondragenter_forward);
			nexacro._observeSysEvent(body, "dragover", "ondragover", this._syshandler_ondragover_forward);
			nexacro._observeSysEvent(body, "dragleave", "ondragleave", this._syshandler_ondragleave_forward);
			nexacro._observeSysEvent(body, "drop", "ondrop", this._syshandler_ondrop_forward);

            nexacro._observeSysEvent(_cur_win, "focus", "onfocus", this._syshandler_onactivate_forward);
            nexacro._observeSysEvent(_cur_win, "blur", "onblur", this._syshandler_ondeactivate_forward);
            nexacro._observeSysEvent(_cur_win, "unload", "onunload", this._syshandler_onclose_forward);
            nexacro._observeSysEvent(_cur_win, "beforeunload", "onbeforeunload", this._syshandler_onbeforeclose_forward);
            nexacro._observeSysEvent(_cur_win, "message", "onmessage", this._syshandler_onmessage_forward);
            nexacro._observeSysEvent(_cur_win, "resize", "onresize", this._syshandler_onresize_forward);
            
            if (nexacro._SupportOrientation)
                nexacro._observeSysEvent(_cur_win, "orientationchange", "onorientationchange", this._syshandler_onorientationchange_forward);

            if (nexacro._Browser == "Gecko" && nexacro._BrowserVersion >= 57)
            {
                // onmousewheel & DOMMouseScroll is deprecated. instead use 'onwheel'
                nexacro._observeSysEvent(body, "wheel", "onwheel", this._syshandler_onmousewheel_forward);
            }

            this._startDetectWindowMove();
        };
        _pHTMLSysEvent._stopDocEventHandler = function ()
        {
            var _cur_win = this._cur_win;
            var body = this._cur_doc.body;

            this._stopDetectWindowMove();

            nexacro._stopSysObserving(body, "mousedown", "onmousedown", this._syshandler_onmousedown_forward);
            nexacro._stopSysObserving(body, "mouseup", "onmouseup", this._syshandler_onmouseup_forward);
            nexacro._stopSysObserving(body, "mousemove", "onmousemove", this._syshandler_onmousemove_forward);
            nexacro._stopSysObserving(body, "mouseover", "onmouseover", this._syshandler_onmouseover_forward);
            nexacro._stopSysObserving(body, "mouseout", "onmouseout", this._syshandler_onmouseout_forward);
            nexacro._stopSysObserving(body, "mousewheel", "onmousewheel", this._syshandler_onmousewheel_forward);
            if (nexacro._SupportTouchEvent)
            {
                nexacro._stopSysObserving(body, "touchstart", "ontouchstart", this._syshandler_ontouchstart_forward);
                nexacro._stopSysObserving(body, "touchend", "ontouchend", this._syshandler_ontouchend_forward);
                nexacro._stopSysObserving(body, "touchmove", "ontouchmove", this._syshandler_ontouchmove_forward);
                nexacro._stopSysObserving(body, "touchcancel", "ontouchcancel", this._syshandler_ontouchcancel_forward);
                if (nexacro._Browser == "MobileSafari")
                    nexacro._stopSysObserving(body, "gesturestart", "ongesturestart", this._syshandler_ongesturestart_forward);
            }
            nexacro._stopSysObserving(body, "dblclick", "ondblclick", this._syshandler_ondblclick_forward);
            nexacro._stopSysObserving(body, "keydown", "onkeydown", this._syshandler_onkeydown_forward);
            nexacro._stopSysObserving(body, "keypress", "onkeypress", this._syshandler_onkeypress_forward);
            nexacro._stopSysObserving(body, "keyup", "onkeyup", this._syshandler_onkeyup_forward);
            nexacro._stopSysObserving(body, "DOMMouseScroll", "onDOMMouseScroll", this._syshandler_onmousewheel_forward);
            nexacro._stopSysObserving(body, "contextmenu", "oncontextmenu", this._syshandler_oncontextmenu_forward);
            nexacro._stopSysObserving(body, "dragstart", "ondragstart", this._syshandler_dragstart_forward);
            nexacro._stopSysObserving(body, "select", "onselect", this._syshandler_onselectstart_forward);
            nexacro._stopSysObserving(body, "selectstart", "onselectstart", this._syshandler_onselectstart_forward);
            nexacro._stopSysObserving(body, "load", "onload", this._syshandler_onload_forward);
			nexacro._stopSysObserving(body, "dragstart", "ondragstart", this._syshandler_ondragstart_forward);
			nexacro._stopSysObserving(body, "dragenter", "ondragenter", this._syshandler_ondragenter_forward);
			nexacro._stopSysObserving(body, "dragover", "ondragover", this._syshandler_ondragover_forward);
			nexacro._stopSysObserving(body, "dragleave", "ondragleave", this._syshandler_ondragleave_forward);
			nexacro._stopSysObserving(body, "drop", "ondrop", this._syshandler_ondrop_forward);

            nexacro._stopSysObserving(_cur_win, "focus", "onfocus", this._syshandler_onactivate_forward);
            nexacro._stopSysObserving(_cur_win, "blur", "onblur", this._syshandler_ondeactivate_forward);
            nexacro._stopSysObserving(_cur_win, "unload", "onunload", this._syshandler_onclose_forward);
            nexacro._stopSysObserving(_cur_win, "beforeunload", "onbeforeunload", this._syshandler_onbeforeclose_forward);
            nexacro._stopSysObserving(_cur_win, "message", "onmessage", this._syshandler_onmessage_forward);
            nexacro._stopSysObserving(_cur_win, "resize", "onresize", this._syshandler_onresize_forward);

            if (nexacro._SupportOrientation)
                nexacro._stopSysObserving(_cur_win, "orientationchange", "onorientationchange", this._syshandler_onorientationchange_forward);

            if (nexacro._Browser == "Gecko" && nexacro._BrowserVersion >= 57)
            {
                // onmousewheel & DOMMouseScroll is deprecated. instead use 'onwheel'
                nexacro._stopSysObserving(body, "wheel", "onwheel", this._syshandler_onmousewheel_forward);
            }
        };
	
	    _pHTMLSysEvent.lockMouseMove = function (/*node*/)
	    {
		    var _cur_body = this._cur_doc.body;
		    nexacro._stopSysObserving(_cur_body, "mousemove", "onmousemove", this._syshandler_onmousemove_forward);
		    nexacro._stopSysObserving(_cur_body, "mouseup", "onmouseup", this._syshandler_onmouseup_forward);
		    nexacro._observeSysEvent(this._win_win, "mousemove", "onmousemove", this._syshandler_lock_onmousemove_forward, true);
		    nexacro._observeSysEvent(this._win_win, "mouseup", "onmouseup", this._syshandler_lock_onmouseup_forward, true);
	    };
	    _pHTMLSysEvent.unlockMouseMove = function (/*node*/)
	    {
		    var _cur_body = this._cur_doc.body;
		    nexacro._stopSysObserving(this._win_win, "mousemove", "onmousemove", this._syshandler_lock_onmousemove_forward, true);
		    nexacro._stopSysObserving(this._win_win, "mouseup", "onmouseup", this._syshandler_lock_onmouseup_forward, true);
		    nexacro._observeSysEvent(_cur_body, "mousemove", "onmousemove", this._syshandler_onmousemove_forward);
		    nexacro._observeSysEvent(_cur_body, "mouseup", "onmouseup", this._syshandler_onmouseup_forward);
	    };
    }

    _pHTMLSysEvent._move_detect_timer = -1;
    _pHTMLSysEvent._startDetectWindowMove = function ()
    {
        // detecting browser window move
        var _cur_win = this._cur_win;
        _cur_win._old_screenx = _cur_win.screenX ? _cur_win.screenX : _cur_win.screenLeft;
        _cur_win._old_screeny = _cur_win.screenY ? _cur_win.screenY : _cur_win.screenTop;

        var timeout = setTimeout(this._syshandler_onmove_forward, 500);
        this._move_detect_timer = timeout;
    };
    _pHTMLSysEvent._stopDetectWindowMove = function ()
    {
        if (this._move_detect_timer)
        {
            clearTimeout(this._move_detect_timer);
            this._move_detect_timer = null;
        }
    };

	_pHTMLSysEvent.clearAll = function ()
	{
	    this._stopDetectWindowMove();

		this._win_win = null;
		this._win_doc = null;
		this._cur_win = null;
		this._cur_doc = null;

		this._cur_over_elem = null;
		
		this._syshandler_onmessage_forward = null;
		this._syshandler_onmousedown_forward = null;
		this._syshandler_onmouseup_forward = null;
		this._syshandler_lock_onmouseup_forward = null;
		this._syshandler_onmousemove_forward = null;
		this._syshandler_lock_onmousemove_forward = null;
		this._syshandler_ontouchstart_forward = null;
		this._syshandler_ontouchend_forward = null;
		this._syshandler_ontouchmove_forward = null;
		this._syshandler_ontouchcancel_forward = null;
		this._syshandler_ondblclick_forward = null;
		this._syshandler_onmouseover_forward = null;
		this._syshandler_onmouseout_forward = null;
		this._syshandler_onkeydown_forward = null;
		this._syshandler_onkeypress_forward = null;
		this._syshandler_onkeyup_forward = null;
		this._syshandler_onmousewheel_forward = null;
		this._syshandler_oncontextmenu_forward = null;
		this._syshandler_ondragstart_forward = null;
		this._syshandler_ondragenter_forward = null;
		this._syshandler_ondragover_forward = null;
		this._syshandler_ondragleave_forward = null;
		this._syshandler_ondrop_forward = null;
		this._syshandler_onselectstart_forward = null;
		this._syshandler_onactivate_forward = null;
		this._syshandler_ondeactivate_forward = null;
		this._syshandler_onbeforeclose_forward = null;
		this._syshandler_onclose_forward = null;
		this._syshandler_onresize_forward = null;
		this._syshandler_onorientationchange_forward = null;
		this._syshandler_onmove_forward = null;
		this._syshandler_onload_forward = null;
	};

	
	//==============================================================================
  	nexacro.__getRealWindowHandle = function (_cur_win)
	{
	    var _cur_nexacro = _cur_win.nexacro;
		var p = _cur_win;
        try
        {
		    while (true)
		    {
		        // nexacro root으로 제한.
		        if (p.parent && p != p.parent && p.parent.nexacro && p.parent.nexacro == _cur_nexacro)
		            p = p.parent;
		        else
		            break;
		    }
	    }
	    catch (e)
	    {
	        // nexacro on iframe - cross origin problem
	    }

		return p;
	};

	if (nexacro._Browser == "IE" && nexacro._BrowserVersion == 6)
	{
	    nexacro._initHTMLSysEvent = function (_cur_win, _cur_doc)
        {
            document.execCommand('BackgroundImageCache', false, true);

		    var _win_win = nexacro.__getRealWindowHandle(_cur_win);
		    var _win_doc = _win_win ? _win_win.document : document;

            nexacro._createWindowGC_Funcs(_cur_win);
            _cur_win.__createGC();

		    // init forward functions
		    nexacro._createSysEvent_ForwardFuncs(_cur_win);
		    var _sysEvent = _cur_win.nexacro_HTMLSysEvent = new nexacro.HTMLSysEvent(_win_win, _win_doc, _cur_win, _cur_doc);
		    // init handlers
		    _sysEvent._initDocEventHandler();
	    };
	}
	else
	{
	    nexacro._initHTMLSysEvent = function (_cur_win, _cur_doc)
	    {
	        var _win_win = nexacro.__getRealWindowHandle(_cur_win);
	        var _win_doc = _win_win ? _win_win.document : document;

	        nexacro._createWindowGC_Funcs(_cur_win);
	        _cur_win.__createGC();

	        // by ODH : IE10에서 Popup Window에 setInterval 시 closure로 생성한 callback function 진입 시 스크립트 오류 발생하기 때문에 
	        //          별도의 TimerManager를 둔다.
	        nexacro._initHTMLSysTimerManager(_cur_win);

	        // init forward functions
	        nexacro._createSysEvent_ForwardFuncs(_cur_win);
	        var _sysEvent = _cur_win.nexacro_HTMLSysEvent = new nexacro.HTMLSysEvent(_win_win, _win_doc, _cur_win, _cur_doc);
	        // init handlers
	        _sysEvent._initDocEventHandler();
	    };
	}

	nexacro._finalizeHTMLSysEvent = function (_cur_win)
	{
	    _cur_win.__createGC = null;
	    _cur_win.__clearGC = null;
	    _cur_win.__destroyGC = null;

	    _cur_win.nexacro_HTMLSysEvent = null;
	};

	nexacro._preparePopupFrame = function (_cur_win, _cur_doc, urlparams, fontface_info)
	{
	    function onloadpopupframe()
	    {
	        nexacro._createPopupFrame(_cur_win, urlparams);
	    }

	    nexacro._initHTMLSysEvent(_cur_win, _cur_doc);

	    // 제너레이션 작업 완료후 삭제
	    if (urlparams)
	        nexacro._prepareManagerFrame(onloadpopupframe, fontface_info);
	    else
	        nexacro._prepareManagerFrame();
	};

	nexacro._createPopupFrame = function (_cur_win, urlparams)
	{
	    nexacro._is_loaded_application = true;
	    var name = urlparams.framename;
        nexacro._uniquestoragevalue = urlparams.loadtime; //nexacro.open 수행시 environment가 늦게 로딩되어 nexacro._uniquestoragevalue 값을 localstorage에서 얻어올수 없어 param으로 처리
       
	    nexacro._initEnvironment();
	    var parent_handle = _cur_win.opener || parent;
	    var parent_win = nexacro._findWindow(_cur_win.opener || parent);  
	    var _win = new nexacro._Window(name, parent_win);
	    _win.setLinkedWindow(_cur_win);

	    var env = nexacro.getEnvironment();

	    env.loadVariables = nexacro._emptyFn;

	    env._load();  // 이때 xadl 값은 설정되어 있어야 한다. 

	    nexacro._getLocalStorageforService();
	    

	    if (parent_win)
	    {
	        parent_win.addChild(_win);
	    }
        
        var storagekey = "popupframeoption" + name;
	    var popupframe = nexacro._getLocalStorage(storagekey, 2);

	    nexacro._popupframeoption = {};
	    nexacro._popupframeoption[name] = JSON.parse(popupframe);

	    if (parent_win)
	    {
	        var popupframeoption = nexacro._popupframeoption[name];

	        if (parent_handle._nexacro_popupframeoption)
	        {
	            var _popup_opt = parent_handle._nexacro_popupframeoption[storagekey];
	            if (_popup_opt)
	            {
	                popupframeoption._args = _popup_opt._popuparrarg;
	                popupframeoption._parentframe = _popup_opt._popupparentframe;
	                popupframeoption._opener = _popup_opt._popupframeopener;

	                _popup_opt._popupparentframe = null;
	                _popup_opt._popuparrarg = null;
	                _popup_opt._popupframeopener = null;

	                parent_handle._nexacro_popupframeoption[storagekey] = null;
	                delete parent_handle._nexacro_popupframeoption[storagekey];
	            }
	            
	        }
	        
	    }

	    nexacro._removeLocalStorage(storagekey, 2);

	    var cssurls = nexacro._getLocalStorage("cssurls", 2);
	    if (cssurls)
	    {
	        nexacro._cssurls = cssurls.split(",");   //application css 
	    }

	    var childframe = new nexacro.ChildFrame(name);
	    parent_handle._popupframes.set_item(name, childframe);
	    childframe._showModeless(name, _win);
	};

    //==============================================================================
    if (nexacro._Browser == "IE")
    {
        nexacro._syshandler_onmessage = function (_sysEvent, node, evt)
        {
            var id = _sysEvent._custom_node_id;
            var win = nexacro._findWindow(_sysEvent._win_win, id);

            win._on_sys_message(evt.data);
        };

	    nexacro._syshandler_onmousedown = function (_sysEvent, node, evt)
	    {
	        var win = nexacro._findWindow(_sysEvent._win_win);
		    var elem = nexacro.__findParentElement(node);
		    if (win && elem)
		    {
		    	_sysEvent._cur_win.__clearGC();
		    	var ret;
			    // e.clientX, e.clientY는 win ClientArea left,top 0을 기준으로 측정된 값임
		        if (evt.button == nexacro_HTMLSysEvent.MOUSE_LBUTTON)
		        {
		        	var last_focused = win._last_focused_elem;

			        //주소창에서 화면을 선택했을떄 activate 가 나오지 않는다.
		            if (win._is_active_window === false)
		                win._on_sys_activate();

		            if (_sysEvent._cur_win.document.hasFocus)
			        {
		                if (false === _sysEvent._cur_win.document.hasFocus())
		                    _sysEvent._cur_win.focus();
                    }
                   
			        ret = win._on_sys_lbuttondown(elem, "lbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);

				    //IE에서 form에 lbuttondown시 조합이 완료됨.
		    	    //Window7만.
				    //Windows XP에서도 동일현상 발생.
			        if (nexacro._SystemLang != "ja")// && nexacro._OSVersion >= 6.0)
			        {
                        if (win._last_focused_elem && win._last_focused_elem != elem && win._last_focused_elem.isInputElement() && win._last_focused_elem.parent)
					    {					    
			        		win._last_focused_elem._on_sys_mousedown("lbutton", evt.keyCode, evt.altKey, evt.ctrlKey, evt.shiftKey);
					    }
				    }
                
			        // 브라우저에 의해 클릭된 Element가 Focus를 가져가기때문에 Default동작을 막아야 함.
                    // TODO check 임시방편 현재 preventDefault 처리하면 Input만 문제가 됨
                    if (nexacro._BrowserType == "Edge")
                    {
                        if (nexacro._isSameComponent(elem, last_focused) &&
                            !(elem.isInputElement() && elem.enable) &&
                            !(last_focused instanceof nexacro._WebBrowserPluginElement))
                            nexacro._stopSysEvent(evt);
                    }
                    else
                    {
                        if (!(elem.isInputElement() && elem.enable) && !(last_focused instanceof nexacro._WebBrowserPluginElement))
                            nexacro._stopSysEvent(evt);
                    }
                    if (ret === false)
                    {
                        nexacro._stopSysEvent(evt);
                    }				   
				    return ret;
			    }
		        else if (evt.button == nexacro_HTMLSysEvent.MOUSE_RBUTTON || evt.button === 0) // 0 을 rbutton 으로 인식함
		        {
				    ret = win._on_sys_rbuttondown(elem, "rbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);

				    //IE에서 form에 rbuttondown시 조합이 완료됨.
				    //IE6도 마찬가지임.
				    if (win._last_focused_elem != elem && win._last_focused_elem.isInputElement() && win._last_focused_elem.parent)
				    {
				    	win._last_focused_elem._on_sys_mousedown("rbutton", evt.keyCode, evt.altKey, evt.ctrlKey, evt.shiftKey);
				    }

			        if (!(elem.isInputElement() && elem.enable))
			            nexacro._stopSysEvent(evt);

                    if (ret === false)
                    {
                        nexacro._stopSysEvent(evt);
                    }		
			        return ret;
			    }
			    else // middlebutton은 4로 인식함
		        {
		        	ret = win._on_sys_mousedown(elem, "mbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);

		        	//IE에서 form에 mbuttondown시 조합이 완료됨.
				    //Window7만.
			        if (nexacro._SystemLang != "ja" && nexacro._OSVersion >= 6.0)
				    {
			            if (win._last_focused_elem != elem && win._last_focused_elem.isInputElement() && win._last_focused_elem.parent)
					    {
			            	win._last_focused_elem._on_sys_mousedown("mbutton", evt.keyCode, evt.altKey, evt.ctrlKey, evt.shiftKey);
					    }
				    }


			        if (!(elem.isInputElement() && elem.enable))
			            nexacro._stopSysEvent(evt);

			       
			        return ret;
                }
		    }
		    return false;
	    };
	    nexacro._syshandler_onmouseup = function (_sysEvent, node, evt)
	    {
	        var win = nexacro._findWindow(_sysEvent._cur_win);
		    var elem = nexacro.__findParentElement(node);
		    if (win)
		    {
		        // e.clientX, e.clientY는 win ClientArea left,top 0을 기준으로 측정된 값임
                // clear gc 루틴 삭제
		        if (evt.button == nexacro_HTMLSysEvent.MOUSE_LBUTTON)
			    {
                    //var doc = _sysEvent._cur_doc;
                    //var _win = _sysEvent._cur_win;
                 
                    return win._on_sys_lbuttonup(elem, "lbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);			       
			    }
		        else if (evt.button == nexacro_HTMLSysEvent.MOUSE_RBUTTON)
		        {
		           return win._on_sys_rbuttonup(elem, "rbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);			        			        
			    }
			    else
		        {
		            return win._on_sys_mouseup(elem, "mbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);			        
                }
		    }
		    return false;
	    };

	    nexacro._syshandler_lock_onmouseup = nexacro._emptyFn;
	    nexacro._syshandler_onmousemove = function (_sysEvent, node, evt)
	    {
	        var win = nexacro._findWindow(_sysEvent._cur_win);
	        var elem = nexacro.__findParentElement(node);
	        if (!win)
	        {
	            return false;
	        }

//             var entered = application._entered;
// 		    if (!entered || entered != elem)
// 		    {
// 			    return false;
// 		    }
		
		    var w_x = nexacro._getWindowHandlePosX(win.handle);
		    var w_y = nexacro._getWindowHandlePosY(win.handle);
		    var w_width = nexacro._getMainWindowWidth(win);
		    var w_height = nexacro._getMainWindowHeight(win);

		    //  브라우저는 move이벤트가 좌표 변경이 없어도 node 위에 마우스 커서가 존재하면 계속 발생됨.
		    if ( win._cur_screen_pos.x == evt.screenX && win._cur_screen_pos.y == evt.screenY )
		    {
			    return false;
		    }
		    else if (evt.screenX < w_x || evt.screenX > (w_x + w_width) || evt.screenY < w_y || evt.screenY > (w_y + w_height))
		    {
		    	if (nexacro._cur_track_info && nexacro._cur_track_info.target instanceof nexacro.TitleBarControl)
		            return false;
		    }
		    else 
		    {
			    win._cur_screen_pos.x = evt.screenX;
			    win._cur_screen_pos.y = evt.screenY;
		    }

		    var button = (win._cur_ldown_elem ? "lbutton" : (win._cur_rdown_elem ? "rbutton" : (win._cur_mdown_elem ? "mbutton" : "none"))); //button info
		    _sysEvent._cur_win.__clearGC();
		    if (elem)
		    {  
			    // e.clientX, e.clientY는 win ClientArea left,top 0을 기준으로 측정된 값임
		        win._on_sys_mousemove(elem, button, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);		      
			    return true;
		    }
		    else if ( win._cur_ldown_elem )
		    {
			    win._on_sys_mousemove(null, "lbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);
		    }
		    return false;
	    };
	    nexacro._syshandler_lock_onmousemove = nexacro._emptyFn;

	    nexacro._syshandler_onmousewheel = function (_sysEvent, node, evt)
	    {
	        var win = nexacro._findWindow(_sysEvent._win_win);
	        var elem = nexacro.__findParentElement(node);
	        if (win && elem)
	        {
	            _sysEvent._cur_win.__clearGC();
	            // e.clientX, e.clientY는 win ClientArea left,top 0을 기준으로 측정된 값임
                
	            if (this._BrowserType == "Edge")
	            {
	                if (win._cur_wheel_pos.x == evt.screenX && win._cur_wheel_pos.y == evt.screenY)
	                {
	                    win._cur_wheel_pos.x = null;
	                    win._cur_wheel_pos.y = null;
	                    return false;
	                }
	                else
	                {
	                    win._cur_wheel_pos.x = evt.screenX;
	                    win._cur_wheel_pos.y = evt.screenY;
	                }
	            }

	            // TODO check event의 button이 lbutton(0)으로 세팅되어 들어오는 것이 확인됨. IE8,FF,Chrome
	            var ret = win._on_sys_mousewheel(elem, nexacro.__getWheelDeltaX(evt), nexacro.__getWheelDeltaY(evt), nexacro._getSysEventBtnString({ button: 4, which: 2 }), evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY); // pss - which : 2 add for ie11
	            if (ret === false)
	            {
	                nexacro._stopSysEvent(evt);
	            }
	            return ret;
	        }
	        return false;
	    };
    }
    else if (nexacro._Browser != "IE")
    {
        nexacro._syshandler_onmessage = function (_sysEvent, node, evt)
        {
            var id = _sysEvent._custom_node_id;
            var win = nexacro._findWindow(_sysEvent._win_win, id);

            win._on_sys_message(evt.data);
        };

	    nexacro._syshandler_onmousedown = function (_sysEvent, node, evt)
	    {
	        var win = nexacro._findWindow(_sysEvent._win_win);
	   
		    var elem = nexacro.__findParentElement(node);
		    if (win && elem)
		    {
		        if (win._is_active_window == false)
		            win._on_sys_activate();

		        var ret;
		        // e.clientX, e.clientY는 win ClientArea left,top 0을 기준으로 측정된 값임	
		        if (evt.button == nexacro_HTMLSysEvent.MOUSE_LBUTTON)
		        {
		        	var last_focused = win._last_focused_elem;
		        	ret = win._on_sys_lbuttondown(elem, "lbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);
				    // lock MouseMove
				    _sysEvent.lockMouseMove(node);
				
                    // 브라우저에 의해 클릭된 Element가 Focus를 가져가기때문에 Default동작을 막아야 함.
			        // TODO check 임시방편 현재 preventDefault 처리하면 Input만 문제가 됨

		        	// Google Chrome에서 Disable된 input클릭시 focus가 옮겨가는 문제 수정 2013.08.28 neoarc
				    
				    if (!(elem.isInputElement() && elem.enable) && !(last_focused instanceof nexacro._WebBrowserPluginElement))
				    	nexacro._stopSysEvent(evt);

                    if (ret === false)
                    {
                        nexacro._stopSysEvent(evt);
                    }		

			        return ret;
			    }
		        else if (evt.button == nexacro_HTMLSysEvent.MOUSE_RBUTTON)
			    {
			        ret = win._on_sys_rbuttondown(elem, "rbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);
			        if (!(elem.isInputElement() && elem.enable))
			            nexacro._stopSysEvent(evt);

                    if (ret === false)
                    {
                        nexacro._stopSysEvent(evt);
                    }		

			        return ret;
			    }
			    else
			    {
                    ret = win._on_sys_mousedown(elem, "mbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);
                    if (!(elem.isInputElement() && elem.enable))
			            nexacro._stopSysEvent(evt);

                    return ret;
                }
		    }
		    return false;
	    };
	    nexacro._syshandler_onmouseup = function (_sysEvent, node, evt)
	    {
	        var win = nexacro._findWindow(_sysEvent._win_win);
		    var elem = nexacro.__findParentElement(node);
		    if (win && elem)
		    {
		        // e.clientX, e.clientY는 win ClientArea left,top 0을 기준으로 측정된 값임
		        if (evt.button == nexacro_HTMLSysEvent.MOUSE_RBUTTON)
			    {
			        return win._on_sys_rbuttonup(elem, "rbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);
			    }
			    else
			    {
			        return win._on_sys_mouseup(elem, "mbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);
                }
		    }
		    return false;
	    };
	    nexacro._syshandler_lock_onmouseup = function (_sysEvent, node, evt)
	    {
	        var win = nexacro._findWindow(_sysEvent._win_win);
		    var elem = nexacro.__findParentElement(node);
		    // unlock MouseMove
		    _sysEvent.unlockMouseMove(node);
		    var ret = false;
		    if (win)
		    {
		        if (evt.button == nexacro_HTMLSysEvent.MOUSE_LBUTTON)
			    {
			        ret = win._on_sys_lbuttonup(elem, "lbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);
			    }
		    }
		    return ret;
	    };
	    nexacro._syshandler_onmousemove = function (_sysEvent, node, evt)
        {
	        var win = nexacro._findWindow(_sysEvent._win_win);
	        var elem = nexacro.__findParentElement(node);
	        if (!win)
	        {
	            return false;
	        }

//             var entered = application._entered;
// 		    if (!entered || entered != elem)
// 		    {
// 			    return false;
// 		    }

		    //  브라우저는 move이벤트가 좌표 변경이 없어도 node 위에 마우스 커서가 존재하면 계속 발생됨.

		    if (win._cur_screen_pos.x == evt.screenX && win._cur_screen_pos.y == evt.screenY)
		    {
			    return false;
		    }
		    else 
		    {
			    win._cur_screen_pos.x = evt.screenX;
			    win._cur_screen_pos.y = evt.screenY;
		    }
		    var button = (win._cur_rdown_elem ? "rbutton" : (win._cur_mdown_elem ? "mbutton" : "none"));

		    if (elem)
		    {
			    // e.clientX, e.clientY는 win ClientArea left,top 0을 기준으로 측정된 값임		   
		        win._on_sys_mousemove(elem, button, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);
			    return true;
		    }
		    return false;
	    };
	    nexacro._syshandler_lock_onmousemove = function (_sysEvent, node, evt)
        {
	        var win = nexacro._findWindow(_sysEvent._win_win);
		    var elem = nexacro.__findParentElement(node);
		    if (!win)
		    {
			    return false;
		    }

		    //  브라우저는 move이벤트가 좌표 변경이 없어도 node 위에 마우스 커서가 존재하면 계속 발생됨.

		    var w_x = nexacro._getWindowHandlePosX(win.handle);
		    var w_y = nexacro._getWindowHandlePosY(win.handle);
		    var w_width = nexacro._getMainWindowWidth(win);
		    var w_height = nexacro._getMainWindowHeight(win);

		    if ( win._cur_screen_pos.x == evt.screenX && win._cur_screen_pos.y == evt.screenY )
		    {
			    return false;
		    }
		    else if (evt.screenX < w_x || evt.screenX > (w_x + w_width) || evt.screenY < w_y || evt.screenY > (w_y + w_height))
		    {
		    	if (nexacro._cur_track_info && nexacro._cur_track_info.target instanceof nexacro.TitleBarControl)
		        return false;
		    }
		   
			win._cur_screen_pos.x = evt.screenX;
			win._cur_screen_pos.y = evt.screenY;
		    
		    if (elem)
		    {
		 	    // e.clientX, e.clientY는 win ClientArea left,top 0을 기준으로 측정된 값임
		        win._on_sys_mousemove(elem, "lbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);
			    return true;
		    }
		    else
		    {
		        win._on_sys_mousemove(null, "lbutton", evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);
		    }
		    return false;
	    };

	    nexacro._syshandler_onmousewheel = function (_sysEvent, node, evt)
	    {
	        var win = nexacro._findWindow(_sysEvent._win_win);
	        var elem = nexacro.__findParentElement(node);
	        if (win && elem)
	        {
	            // e.clientX, e.clientY는 win ClientArea left,top 0을 기준으로 측정된 값임
	            var ret = win._on_sys_mousewheel(elem, nexacro.__getWheelDeltaX(evt), nexacro.__getWheelDeltaY(evt), nexacro._getSysEventBtnString({ button: 1, which: 2 }), evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);
                if (ret === false)
	            {
					nexacro._stopSysEvent(evt);
				}
				return;
	        }
	        return false;
	    };
    }

	nexacro._syshandler_ontouchstart = function (_sysEvent, node, evt)
    {
		if (evt.stopped === true) 
		{
			return;
		}

		// init or orientationchange 시점에 이벤트 중지

		var win = nexacro._findWindow(_sysEvent._win_win);
		var elem = nexacro.__findParentElement(node);
		if (!win || win._isFrozen)
        {
		    return;
		}

		var touch, touchid, screenX, screenY, curTime, i;
		if (elem)
        {
            //evt.preventDefault();

		    var last_focused_elem = win._last_focused_elem;
            var _doc = elem._getRootWindowHandle();
            var active_dom = _doc.activeElement;
		    if (nexacro._Browser == "MobileSafari" &&
                last_focused_elem &&
                last_focused_elem != elem)
        //        (last_focused_elem.isInputElement() || last_focused_elem instanceof nexacro.TextAreaElement))
		    {
		        if (!(elem.isInputElement() || elem instanceof nexacro.TextAreaElement) && 
                    (active_dom && (active_dom.tagName == "INPUT" || active_dom.tagName == "TEXTAREA")))
                { 		 
                    if (!nexacro._isSameComponent(last_focused_elem, elem))
                    {
                        var start = 0, end = 0;
                        if (last_focused_elem.isInputElement())
                        {
                            var pos = last_focused_elem.getElementCaretPos();
                            if (pos !== -1)
                            {
                                start = pos.begin;
                                end = pos.end;
                            }
                        }    
                        var input_handle = last_focused_elem.handle;
                        nexacro.__setDOMNode_SetSelect(_doc, input_handle, start, end);
                        //input_handle.blur();
                    }
		        }
		    }
            
		    curTime = (evt.timeStamp || (new Date()).getTime());

		    var touches = evt.touches, changedTouches = evt.changedTouches;
		    var touch_len = touches.length, change_len = changedTouches.length;
		    var type = evt.type || "touchstart";
		    //var is_first = (touch_len == change_len);

		    var touch_node, touch_elem, touch_info, windowX, windowY, changed;
                var changed_ids = { }, touch_infos = [], changed_touch_infos =[];

		    for (i = 0; i < change_len; i++)
		    {
		        touch = changedTouches[i];
                        changed_ids[touch.identifier]= true;
		    }

		    for (i = 0; i < touch_len; i++)
		    {
		        touch = touches[i];
		        touch_node = touch.target;
		        if (touch_node && touch_node != node)
		        {
		            touch_elem = nexacro.__findParentElement(touch_node);
		        }
		        else
		        {
		            touch_elem = elem;
		        }

		        touchid = touch.identifier;
		        changed = changed_ids[touchid];
                windowX = nexacro.__getWindowX(touch);
                windowY = nexacro.__getWindowY(touch);
		        screenX = nexacro.__getScreenX(touch);
                screenY = nexacro.__getScreenY(touch);

		        touch_info = new nexacro.Touch(touchid, type, curTime, touch_elem, changed, windowX, windowY, screenX, screenY);
		        touch_infos.push(touch_info);
		        if (changed)
		        {
		            changed_touch_infos.push(touch_info);
		        }
		    }

		    win._on_gesture_sys_touchstart(elem, touch_infos, changed_touch_infos, curTime);

		}

	 

		return false;
	};
	nexacro._syshandler_ontouchend = function (_sysEvent, node, evt)
    {
	    // init or orientationchange 시점에 이벤트 중지
	    if (this._is_first_touch)
	    {
	        this._is_first_touch = false;
	        //this.__setViewportScale();  //rp 74380	       
	    }
	      
	    var win = nexacro._findWindow(_sysEvent._win_win);
	    var elem = nexacro.__findParentElement(node);
	    if (!win || win._isFrozen)
	    {
	        return;
	    }

	    var ret = false;
	    var touch, touchid, screenX, screenY, curTime, i;
	    if (elem)
        {
            curTime = (evt.timeStamp || (new Date()).getTime());

	        if (nexacro._OS == "iOS" && parseFloat(nexacro._OSVersion) >= 9)
	        {
	            // prevent double tap zooming
	            if (nexacro._last_touchend_time && (curTime - nexacro._last_touchend_time) < 400)
	            {
	                evt.preventDefault();
                    if (evt.srcElement instanceof HTMLInputElement)
                    {
                        // preventDefault로 keypad 가 올라오지 않는 문제가 있어서 input에 포커스를 줌
                        if (!evt.srcElement.readOnly)
                            evt.srcElement.focus();
                        //setTimeout((function (n) { return function () { n.focus(); } })(evt.srcElement), 500);
                    }
                }
	            nexacro._last_touchend_time = curTime;
	        }
	        var touches = evt.touches, changedTouches = evt.changedTouches;
	        var touch_len = touches.length, change_len = changedTouches.length;

	        var touch_elem, touch_info;
	        var windowX, windowY;
	        var type = evt.type || "touchend";

	        var touch_infos = [], changed_touch_infos = [];

	        for (i = 0; i < change_len; i++)
	        {
	            touch = changedTouches[i];          

	            touchid = touch.identifier;
                windowX = nexacro.__getWindowX(touch);
                windowY = nexacro.__getWindowY(touch);
                screenX = nexacro.__getScreenX(touch);
                screenY = nexacro.__getScreenY(touch);

                touch_elem = nexacro.__getElementFromPoint(win.handle, windowX, windowY);
                if (touch_elem)
                    elem = touch_elem;
	            touch_info = new nexacro.Touch(touchid, type, curTime, touch_elem, true, windowX, windowY, screenX, screenY);
	            changed_touch_infos.push(touch_info);
	        }

	        for (i = 0; i < touch_len; i++)
	        {
	            touch = touches[i];

	            touchid = touch.identifier;
                windowX = nexacro.__getWindowX(touch);
                windowY = nexacro.__getWindowY(touch);
                screenX = nexacro.__getScreenX(touch);
                screenY = nexacro.__getScreenY(touch);

                touch_elem = nexacro.__getElementFromPoint(win.handle, windowX, windowY);
                if (touch_elem)
                    elem = touch_elem;

	            touch_info = new nexacro.Touch(touchid, type, curTime, touch_elem, false, windowX, windowY, screenX, screenY);
	            touch_infos.push(touch_info);
	        }

	        ret = win._on_gesture_sys_touchend(elem, touch_infos, changed_touch_infos, curTime);
	        if (ret)
	        {
	            nexacro._stopSysEvent(evt);
	            return true;
	        }
	        else
	            return;
	    }

	    // 장비에따라 여러 손가락이 동시에 들어오는 경우도 있음. 
		var touchlen = evt.changedTouches ? evt.changedTouches.length : 1;
		for (i = 0; i < touchlen; i++)
		{
            touch = evt.changedTouches ? evt.changedTouches[i] : evt;
            var clientX = nexacro.__getWindowX(touch);
            var clientY = nexacro.__getWindowY(touch);
            screenX = nexacro.__getScreenX(touch);
            screenY = nexacro.__getScreenY(touch);
		    curTime = (evt.timeStamp || new Date().getTime());
		    var orgTime = (evt.originalTimeStamp) ? evt.originalTimeStamp : curTime;
		    touchid = touch.identifier;
            //var pointX = clientX;
            //var pointY = clientY;
            elem = nexacro.__getElementFromPoint(win.handle, clientX, clientY);
            // Touch는 touchstart된 node에 touchmove, touchend를 fire하기때문에
		    // 실제 손 밑에 있는 node는 HitTest를 통해 알아내야 한다.
		    /*if (window.pageXOffset > 0)
		    {
		        pointX -= window.pageXOffset;
            }
            if (window.pageYOffset > 0)
		    {
		        pointY -= window.pageYOffset;
            }

            var hover_elem = nexacro.__getElementFromPoint(win.handle, pointX, pointY);
		    if (hover_elem)
		        elem = hover_elem;
*/
		    ret |= win._on_sys_touchend(elem, touchid, clientX, clientY, screenX, screenY, curTime, orgTime, (i == touchlen - 1));
		}

		if (ret)
		{
		    nexacro._stopSysEvent(evt);		      
		    return true;
		}

        // 터치를 preventDefault 할 경우 모바일 자체 Zoom이 되지 않는다고함. 참고
	};
	nexacro._syshandler_ontouchmove = function (_sysEvent, node, evt)
    {
	    // init or orientationchange 시점에 이벤트 중지
	    var ret = false;
	    var win = nexacro._findWindow(_sysEvent._win_win);
	    var elem = nexacro.__findParentElement(node);
		if ( !win && win._isFrozen )
		{
			return;
		}


		var touch, touchid, screenX, screenY, curTime, i;
		if ( elem)
        {
            //if (!this._allow_default_pinchzoom && nexacro._OS != "Android") 
		   //     evt.preventDefault();

            curTime = (evt.timeStamp || Date.now());
            /*
            if (nexacro._Browser == "MobileSafari")
            {
                //iOS에서 키패드가 올라왔을 때 window사이즈가 줄어들지 않아 
                //resize가 발생하지 않고, 보여지는 화면이 밀리는 현상 발생
                var _doc = elem._getRootWindowHandle();
                var last_focused_elem = win._last_focused_elem;
                if (last_focused_elem)
                {
                    var input_handle = last_focused_elem.handle;
                    if (input_handle && input_handle.blur)
                        input_handle.blur();
                }
            }
            */

		    // Touch는 touchstart된 node에 touchmove, touchend를 fire하기때문에
		    // 실제 손 밑에 있는 node는 HitTest를 통해 알아내야 한다.
		    var pointX, pointY;
		    //var pageXOffset = (window.pageXOffset > 0 ? window.pageXOffset : 0);
		   // var pageYOffset = (window.pageYOffset > 0 ? window.pageYOffset : 0);

		    var touches = evt.touches, changedTouches = evt.changedTouches;
		    var touch_len = touches.length, change_len = changedTouches.length;

		    var touch_elem, touch_info;
		    var changed, windowX, windowY;
		    var type = evt.type || "touchmove";

		    var changed_ids = {}, touch_infos = [], changed_touch_infos = [];

		    for (i = 0; i < change_len; i++)
		    {
		        touch = changedTouches[i];
		        changed_ids[touch.identifier] = true;
		    }

		    for (i = 0; i < touch_len; i++)
		    {
		        touch = touches[i];		        
		        /*
                touch_node = touch.target;
		        if (touch_node && touch_node != node)
		        {
		            touch_elem = nexacro.__findParentElement(touch_node);
		        }
		        else
		        {
		            touch_elem = elem;
		        }
                */

		        touchid = touch.identifier;
		        changed = changed_ids[touchid];
                windowX = nexacro.__getWindowX(touch);
                windowY = nexacro.__getWindowY(touch);
                screenX = nexacro.__getScreenX(touch);
                screenY = nexacro.__getScreenY(touch);
                touch_elem = nexacro.__getElementFromPoint(win.handle, windowX, windowY);
                if (touch_elem)
                    elem = touch_elem;

                touch_info = new nexacro.Touch(touchid, type, curTime, touch_elem, changed, windowX, windowY, screenX, screenY);
		        touch_infos.push(touch_info);
		        if (changed)
		        {
		            changed_touch_infos.push(touch_info);
		        }
		    }

		    ret = win._on_gesture_sys_touchmove(elem, touch_infos, changed_touch_infos, curTime);
		    //return;
		}
	

		if (ret)
        {
		    nexacro._stopSysEvent(evt);
            return true;
		}
		return false;	
	};
	nexacro._syshandler_ontouchcancel = function (_sysEvent, node, evt)
	{
	    var win = nexacro._findWindow(_sysEvent._win_win);
	    var elem = nexacro.__findParentElement(node);
	    if (!win || win._isFrozen)
	    {
	        return;
	    }

	    var touch, touchid, screenX, screenY, curTime, i;
	    if (elem)
	    {
	        evt.preventDefault();
	        curTime = (evt.timeStamp || new Date().getTime());

	        var touches = evt.touches, changedTouches = evt.changedTouches;
	        var touch_len = touches.length, change_len = changedTouches.length;

	        var touch_node, touch_elem, touch_info;
	        var windowX, windowY;
	        var type = evt.type || "touchcancel";
	        var touch_infos = [], changed_touch_infos = [];

	        for (i = 0; i < change_len; i++)
	        {
	            touch = changedTouches[i];
	            touch_node = touch.target;
	            if (touch_node && touch_node != node)
	            {
	                touch_elem = nexacro.__findParentElement(touch_node);
	            }
	            else
	            {
	                touch_elem = elem;
	            }

	            touchid = touch.identifier;
                windowX = nexacro.__getWindowX(touch);
                windowY = nexacro.__getWindowY(touch);
                screenX = nexacro.__getScreenX(touch);
                screenY = nexacro.__getScreenY(touch);

	            touch_info = new nexacro.Touch(touchid, type, curTime, touch_elem, true, windowX, windowY, screenX, screenY);
	            changed_touch_infos.push(touch_info);
	        }

	        for (i = 0; i < touch_len; i++)
	        {
	            touch = touches[i];
	            touch_node = touch.target;
	            if (touch_node && touch_node != node)
	            {
	                touch_elem = nexacro.__findParentElement(touch_node);
	            }
	            else
	            {
	                touch_elem = elem;
	            }

                touchid = touch.identifier;
                windowX = nexacro.__getWindowX(touch);
                windowY = nexacro.__getWindowY(touch);
                screenX = nexacro.__getScreenX(touch);
                screenY = nexacro.__getScreenY(touch);

	            touch_info = new nexacro.Touch(touchid, type, curTime, touch_elem, false, windowX, windowY, screenX, screenY);
	            touch_infos.push(touch_info);
	        }

	        win._on_gesture_sys_touchcancel(elem, touch_infos, changed_touch_infos, curTime);
	        return;
	    }

	    // 장비에따라 여러 손가락이 동시에 들어오는 경우도 있음. 
	    var touchlen = evt.changedTouches ? evt.changedTouches.length : 1;
	    var ret = false;
	    for (i = 0; i < touchlen; i++)
	    {
	        touch = evt.changedTouches ? evt.changedTouches[i] : evt;
	        var clientX = touch.pageX || touch.clientX;
            var clientY = touch.pageY || touch.clientY;
            screenX = nexacro.__getScreenX(touch);
            screenY = nexacro.__getScreenY(touch);
	        curTime = (evt.timeStamp || new Date().getTime());
	        var orgTime = (evt.originalTimeStamp) ? evt.originalTimeStamp : curTime;
	        touchid = touch.identifier;
            var pointX = clientX;
            var pointY = clientY;

	        // Touch는 touchstart된 node에 touchmove, touchend를 fire하기때문에
	        // 실제 손 밑에 있는 node는 HitTest를 통해 알아내야 한다.
		    if (window.pageXOffset > 0)
		    {
		        pointX -= window.pageXOffset;
            }
            if (window.pageYOffset > 0)
		    {
		        pointY -= window.pageYOffset;
            }

            var hover_elem = nexacro.__getElementFromPoint(win.handle, pointX, pointY);
	        if (hover_elem)
	            elem = hover_elem;

	        ret |= win._on_sys_touchcancel(elem, touchid, clientX, clientY, screenX, screenY, curTime, orgTime, (i == touchlen - 1));
	    }
	};


	nexacro._syshandler_ondblclick = function(_sysEvent, node, evt)
	{
	    var win = nexacro._findWindow(_sysEvent._win_win);
		var elem = nexacro.__findParentElement(node);
		if (win && elem)
		{
		    _sysEvent._cur_win.__clearGC();
		    var ret = win._on_sys_dblclick(elem, nexacro._getSysEventBtnString({ button: 1, which: 1 }), evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);
		       
		    return ret;
		}
		return false;
	};

	nexacro._syshandler_onmouseover = function (_sysEvent, node, fromnode, evt) //mouseenter
	{
	  /*  if (!application)
	        return false;
			*/
	    var win = nexacro._findWindow(_sysEvent._win_win);
	    var elem = nexacro.__findParentElement(node);
	    var from_elem = nexacro.__findParentElement(fromnode);
	    var end_elem;

	    if (win && elem && elem != from_elem )
	    {
	        var button = (win._cur_ldown_elem ? "lbutton" : (win._cur_rdown_elem ? "rbutton" : (win._cur_mdown_elem ? "mbutton" : "none"))); //button info
	        var ret;

	        // check mouseenter
	        if (from_elem)
	            end_elem = win._findCommonParentElement(elem, from_elem);
            else
	            end_elem = win._findRootElement();

	        // check popup
	        if (!end_elem)
	            end_elem = win._findPopupElement(elem);
	        if (!end_elem)
	            end_elem = win._findRootElement();

	        if (end_elem)
	        {
	            var fire_elem = [];

	            // get mouseenter
	            for (; elem && elem != end_elem; elem = elem.parent_elem)
	            {
	                if (elem.linkedcontrol)
	                {
	                    fire_elem.push(elem);
	                }
	            }
	            // fire mouseenter
	            for (var i = fire_elem.length-1; i >= 0; i--)
	            {	            
	                ret = win._on_sys_mouseenter(fire_elem[i], from_elem, button, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);
	            }
            }
	        return ret;
	    }
	    return false;
	};

	nexacro._syshandler_onmouseout = function (_sysEvent, node, tonode, evt) //mouseleave
	{
	    var win = nexacro._findWindow(_sysEvent._win_win);
	    var elem = nexacro.__findParentElement(node);
	    var to_elem = nexacro.__findParentElement(tonode);
	    var end_elem;

	    if (win && elem && elem != to_elem)
	    {
	        var button = (win._cur_ldown_elem ? "lbutton" : (win._cur_rdown_elem ? "rbutton" : (win._cur_mdown_elem ? "mbutton" : "none"))); //button info
	        var ret;

	        // check mouseleave
	        if (to_elem)
	            end_elem = win._findCommonParentElement(elem, to_elem);
	        else
	            end_elem = win._findRootElement();

	        // check popup
	        if (!end_elem)
	            end_elem = win._findPopupElement(elem);
	        if (!end_elem)
	            end_elem = win._findRootElement();

	    	// fire mouseleave

	        if (end_elem) 
	        {
	            for (; elem && elem != end_elem; elem = elem.parent_elem)//when popup is closed
	            {
	            	if (elem.linkedcontrol)
	            	{
	            		ret = win._on_sys_mouseleave(elem, to_elem, button, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY);
	            	}
	            }
	        }
			return ret;
		}
		return false;
	};

	if (nexacro._Browser != "IE" || (nexacro._Browser == "IE" && nexacro._OSVersion >= 6.0))// NT6.0 : Vista
	{
	    nexacro._syshandler_onkeydown = function (_sysEvent, node, evt)
	    {
	        var win = nexacro._findWindow(_sysEvent._win_win);
	        var elem = nexacro.__findParentElementForKeyEvent(node, win);
	        var keycode = nexacro._getSysEventKeyCode(evt);
	        
	        if (win && elem)
	        {
	            _sysEvent._cur_win.__clearGC();	            
	            win._on_sys_keydown(elem, keycode, evt.altKey, evt.ctrlKey, evt.shiftKey);
	            if (elem._event_stop)
	            {
	                // form에서 tab키가 처리되면 preventDefault
	                nexacro._stopSysEvent(evt);
	                elem._event_stop = false;
	                return true;
	            }
	            else if (nexacro._Browser == "IE" && keycode == nexacro.Event.KEY_BACKSPACE)
	            {
	                //if (!(node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement) ||
                    //     ((node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement) && node.readOnly))
	                if (!(elem instanceof nexacro.InputElement || elem instanceof nexacro.TextAreaElement) ||
                         ((elem instanceof nexacro.InputElement || elem instanceof nexacro.TextAreaElement) && elem.readonly))
	                {
	                    nexacro._stopSysEvent(evt);         // IE 뒤로가기 기능 방지.   
	                }
	            }

	            return true; // keypress, input, propertychange 이벤트 발생을 위해
	        }
	        return false;
	    };
	}
	else
	{
	    nexacro._syshandler_onkeydown = function (_sysEvent, node, evt)
	    {
	        var win = nexacro._findWindow(_sysEvent._win_win);
	        var elem = nexacro.__findParentElementForKeyEvent(node, win);
	        if (win && elem)
	        {
	            _sysEvent._cur_win.__clearGC();
	            var keycode = nexacro._getSysEventKeyCode(evt);
	            win._on_sys_keydown(elem, keycode, evt.altKey, evt.ctrlKey, evt.shiftKey);
	            if (elem._event_stop)
	            {
	                // form에서 tab키가 처리되면 preventDefault
	            	nexacro._stopSysEvent(evt);
	                elem._event_stop = false;
	            	return true;
	            }

	            return true; // keypress, input, propertychange 이벤트 발생을 위해
	        }
	        return false;
	    };
	}
	nexacro._syshandler_onkeypress = function (_sysEvent, node, evt)
	{
	    var win = nexacro._findWindow(_sysEvent._win_win);
		var elem = nexacro.__findParentElementForKeyEvent(node, win);
		if (win && elem)
		{
		    _sysEvent._cur_win.__clearGC();
		    var ret = win._on_sys_keypress(elem, evt.keyCode, evt.charCode, evt.altKey, evt.ctrlKey, evt.shiftKey);
		    if (elem._event_stop)
		    {
		        // form에서 tab키가 처리되면 preventDefault
		        nexacro._stopSysEvent(evt);
		        elem._event_stop = false;
		        return true;
		    }

		    return ret;
		}
		return false;
	};
	nexacro._syshandler_onkeyup = function (_sysEvent, node, evt)
	{
	    var win = nexacro._findWindow(_sysEvent._win_win);
		var elem = nexacro.__findParentElementForKeyEvent(node, win);
		if (win && elem)
		{		    
		    return win._on_sys_keyup(elem, nexacro._getSysEventKeyCode(evt), evt.altKey, evt.ctrlKey, evt.shiftKey);		        
		}
		return false;
	};
	
	//==============================================================================
	nexacro._syshandler_onactivate = function (_sysEvent/*, evt*/)
	{
	    var win = nexacro._findWindow(_sysEvent._win_win);
	    if (win && win._on_sys_activate)
	    {
	        _sysEvent._cur_win.__clearGC();
		    var ret = win._on_sys_activate();
		        
		    return ret;
		}
		return false;
	};

	nexacro._syshandler_ondeactivate = function (_sysEvent/*, evt*/)
	{
	    var win = nexacro._findWindow(_sysEvent._win_win);

	    if (win)
	    {
	        var doc = win._dest_doc;
	        if (doc)
	        {
	            var active_node = win._dest_doc.activeElement;

	            if (active_node)
	            {
	                var active_elem = active_node._linked_element;
	                if (active_elem && active_elem instanceof nexacro._WebBrowserPluginElement)
	                {
	                	if (win._is_alive)
                        {
                            var comp = active_elem.component ? active_elem.component : active_elem.owner_elem ? active_elem.owner_elem.linkedcontrol : null;
                            nexacro._checkClosePopupComponent(comp, true);
	                		nexacro.__setLastFocusedElement(active_elem);
	                	}
	                    return false;
	                }
	            }
	        }

	        if (win._on_sys_deactivate)
	        {
	            _sysEvent._cur_win.__clearGC();
	            var ret = win._on_sys_deactivate();
	              
	            return ret;
	        }
	    }
	    return false;
	};

    nexacro._syshandler_onbeforeclose = function (_sysEvent, evt)
    {
        var win = nexacro._findWindow(_sysEvent._cur_win);
        var confirm_message;
        if (win && win._on_sys_beforeclose)
        {
            confirm_message = win._on_sys_beforeclose();
        }

        if (confirm_message !== undefined && confirm_message !== "" && confirm_message !== null)
        {
            if (evt)
                evt.returnValue = confirm_message;
            return confirm_message;
        }
    };

	nexacro._syshandler_onclose = function (_sysEvent/*, evt*/)
	{
	    _sysEvent._stopDetectWindowMove();

	    var win = nexacro._findWindow(_sysEvent._cur_win);
		if (win)
		{
		    var _cur_win = _sysEvent._cur_win;
		    _sysEvent._stopDocEventHandler();
		    _sysEvent.clearAll();

		    var ret = false;
		    if (win._on_sys_close)
		    {
		        if (win._is_main && _application)
		            _application.on_fire_onexit();

		        ret = win._on_sys_close();
		    }
		    _cur_win.__destroyGC();

		    nexacro._finalizeHTMLSysTimerManager(_cur_win);
	        nexacro._finalizeHTMLSysEvent(_cur_win);
	        nexacro._finalizeGlobalObjects(_cur_win);

	        
			return ret;
		}
		return false;
	};

	nexacro._syshandler_onresize = function (_sysEvent/*, evt*/) //window resize
	{
	    var win = nexacro._findWindow(_sysEvent._win_win);
	    if (win)
	    {
	        var w = nexacro._getWindowHandleClientWidth(win.handle);
	        var h = nexacro._getWindowHandleClientHeight(win.handle);

	        if (w != win.clientWidth || h != win.clientHeight)
	        {
	            // Android인 경우 키보드가 나오면서 Resize가 되면, Frame등 layout이 변하면서
	            // 사용자가 입력하기위해 터치한 곳과 다른 화면을 보게된다.

	            // 스크롤 보정등으로 해결이 안될듯 하여 키보드가 나올것 같은 상황에서의 resize를 무시한다.
	            // (세로로 화면 축소가 되는 상황만)

	            var _is_webbrowser = win._doc ? win._doc.activeElement._linked_element instanceof nexacro._WebBrowserPluginElement : null;
	            
	            if ((nexacro._OS == "Android" || nexacro._Browser == "MobileSafari") && (win._is_active_window || _is_webbrowser))
	            {
	                var is_input_focused = false;
                    var layoutmanger = nexacro._getLayoutManager();
                    var last_focused_elem = win._last_focused_elem;
                    if (last_focused_elem &&
                        (last_focused_elem.isInputElement() || last_focused_elem instanceof nexacro.TextAreaElement || _is_webbrowser))
	                    is_input_focused = true;

	                if (layoutmanger)
	                {
                        layoutmanger._cancelChangeLayout = undefined;
                        var addressbar_height = 100; //Temporary
                        var is_keypad_open = (is_input_focused && (w == win.clientWidth && h < win.clientHeight - addressbar_height));
                        if (is_keypad_open)
                        {
                            layoutmanger._cancelChangeLayout = true;                        
                            //Keypad open
                            if (nexacro._OS == "Android")
                            {
                                var do_scrollintoview = true;
                                if (nexacro._BrowserExtra == "SamsungBrowser")
                                {
                                    //titlebar와 statusbar가 사라질때
                                    if (win._previous_client_height && (win._previous_client_height <= h || win._previous_client_height - h < addressbar_height))
                                    {
                                        do_scrollintoview = false;
                                    }
                                }
                                if (last_focused_elem instanceof nexacro.TextAreaElement)
                                {
                                    if (win.clientHeight < last_focused_elem.height)
                                        do_scrollintoview = false;
                                }

                                if (do_scrollintoview)
                                {
                                    var scrollIntoView = false; 
                                    var handle = last_focused_elem.handle;
                                    if (handle)
                                    {
                                        nexacro._requestAnimationFrame(win, function () { nexacro.__setDOMNode_ScrollintoView(handle, false)});
                                    }
                                }
                            }
                            win._previous_client_height = h;
      	                    return false;
                        }
	                }
	            }	            

	            _sysEvent._cur_win.__clearGC();
	            var ret = win._on_sys_resize(w, h);
                
	            if (nexacro._OS == "iOS" && parseFloat(nexacro._OSVersion) >= 8)
	            {
	                // iOS8 에서 화면 회전 직후 resize하면, body가 이상하게 스크롤되는 버그가 있음
	                // 화면이 핀치줌으로 확대되지 않은 상태일 경우 보정처리
	                if (window.innerWidth == nexacro._getWindowHandleClientWidth(win.handle) &&
                        window.innerHeight == nexacro._getWindowHandleClientHeight(win.handle))
	                {
	                    // 확대되지 않았다.
	                    document.body.scrollLeft = 0;
	                }
                } 
                win._previous_client_height = h;
	            return ret;
            }
            win._previous_client_height = h;
        }

	    return false;
    };
	
	nexacro._syshandler_onmove = function (_sysEvent/*, evt*/) //window move
    {
	    var win = nexacro._findWindow(_sysEvent._win_win);
	    if (win)
	    {
	        var x = nexacro._getWindowHandlePosX(win.handle);
	        var y = nexacro._getWindowHandlePosY(win.handle);

	        if (x != win.left || y != win.top)
	        {	               
	            return win._on_sys_move(x, y);
	        }
	    }
	    return false;
	};

	nexacro._syshandler_onload = function (_sysEvent/*, evt*/)
	{
	    var win = nexacro._findWindow(_sysEvent._cur_win);
	    if (win)
	    {
	        var _cur_win = _sysEvent._cur_win;

	        var ret = false;
	        if (win._on_sys_load)
	            ret = win._on_sys_load(_cur_win);
	        _cur_win.__destroyGC();
	        return ret;
	    }
	    return false;
	};
	
	nexacro._syshandler_oncontextmenu = function (_sysEvent, node, evt)     
	{
		var ret = true;
	    var win = nexacro._findWindow(_sysEvent._win_win);
		var elem = nexacro.__findParentElement(node);
		if (win && elem)
		{		        
			ret = win._on_sys_contextmenu(elem);
			if (!ret || (win.frame._is_popup_frame && node.tagName != "INPUT" && node.tagName != "IMG"))
			{
				ret = nexacro._stopSysEvent(evt);
			}
			else
			{
				ret = true;
			}
		}
		return ret;
	};

	nexacro._syshandler_ondragstart = function (_sysEvent, node, evt)
	{
		return nexacro._stopSysEvent(evt);
	};

	nexacro._syshandler_ondragenter = function (_sysEvent, node, fromnode, evt)
	{
		var ret = true;
		var win = nexacro._findWindow(_sysEvent._win_win);
		var elem = nexacro.__findParentElement(node);
		var from_elem = nexacro.__findParentElement(fromnode);
		if (win && elem)
		{
			var end_elem = from_elem ? win._findCommonParentElement(elem, from_elem) : win._findRootElement();
			if (!end_elem && !(end_elem = win._findPopupElement(elem)))
				end_elem = win._findRootElement();

			for (var fire_elem = []; elem && elem != end_elem; elem = elem.parent_elem)
			{
				if (elem.linkedcontrol)
				{
					fire_elem.push(elem);
				}
			}

			var filelist = evt.dataTransfer ? evt.dataTransfer.files : null;
			for (var i = fire_elem.length - 1; i >= 0; i--)
			{
				ret = win._on_sys_dragenter(fire_elem[i], from_elem, evt.button, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, filelist);
			}
		}
		return ret;
	};

	nexacro._syshandler_ondragleave = function (_sysEvent, node, tonode, evt)
	{
		var ret = true;
		var win = nexacro._findWindow(_sysEvent._win_win);
		var elem = nexacro.__findParentElement(node);
		var to_elem = nexacro.__findParentElement(tonode);
		if (win && elem)
		{
			var end_elem = to_elem ? win._findCommonParentElement(elem, to_elem) : win._findRootElement();
			if (!end_elem && !(end_elem = win._findPopupElement(elem)))
				end_elem = win._findRootElement();

			var filelist = evt.dataTransfer ? evt.dataTransfer.files : null;
			for (; elem && elem != end_elem; elem = elem.parent_elem)
			{
				if (elem.linkedcontrol)
				{
					ret = win._on_sys_dragleave(elem, to_elem, evt.button, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, filelist);
				}
			}
		}

		return ret;
	};

	nexacro._syshandler_ondragover = function (_sysEvent, node, evt)
	{
		evt.stopPropagation();
		evt.preventDefault();

		var win = nexacro._findWindow(_sysEvent._win_win);
		var elem = nexacro.__findParentElement(node);
		if (win && elem)
		{
			var filelist = evt.dataTransfer ? evt.dataTransfer.files : null;
			return win._on_sys_dragover(elem, evt.button, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, filelist);
		}
		return true;
	};

	nexacro._syshandler_ondrop = function (_sysEvent, node, evt)
	{
		evt.stopPropagation();
		evt.preventDefault();

		var win = nexacro._findWindow(_sysEvent._win_win);
		var elem = nexacro.__findParentElement(node);
		if (win && elem)
		{
			var filelist = evt.dataTransfer ? evt.dataTransfer.files : null;
			return win._on_sys_drop(elem, evt.button, evt.altKey, evt.ctrlKey, evt.shiftKey, evt.clientX, evt.clientY, evt.screenX, evt.screenY, evt.offsetX, evt.offsetY, filelist);
		}
		return true;
	};

    nexacro._syshandler_onorientationchange = function (_sysEvent/*, evt*/)
    {
        var win = nexacro._findWindow(_sysEvent._win_win);
        if (win)
        {
            win._on_sys_orientationchange(nexacro._getMobileOrientation());
        }
    };

	nexacro._syshandler_onselectstart = function (_sysEvent, node, evt)
	{
		if (node && 
			((node.tagName == "INPUT" && (node.type == "text" || node.type == "password")) ||
			    node.tagName == "TEXTAREA")) 
		{
			return true;
		}
		return nexacro._stopSysEvent(evt);
	};

	//==============================================================================
	// Window Handle API's	
	if (nexacro._Browser == "IE" && nexacro._BrowserVersion <= 8)
	{
	    nexacro._doc_init_html = "<html lang=\"" + nexacro._BrowserLang.substr(0, 2) + "\" xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'>\n"
							    + "<head>\n"
                                + "<meta http-equiv='X-UA-Compatible' content='IE=Edge' />\n"
							    + "<style>\n"
							    + "v\\:shape{behavior:url(#default#VML);}\n"
							    + "v\\:fill{behavior:url(#default#VML);}\n"
							    + "v\\:path{behavior:url(#default#VML);}\n"
							    + "v\\:line{behavior:url(#default#VML);}\n"
							    + "v\\:textpath{behavior:url(#default#VML);}\n"
							    + "o\\:opacity2{behavior:url(#default#VML);}\n"
							    + "</style>\n"
							    + "</head>\n"
							    + "<body style='margin:0;border:none;background:transparent;'>\n"
							    + "<script type='text/javascript'>\n"
                                + "var nexacro;"
                                + "if (window.dialogArguments) nexacro = window.dialogArguments.nexacro;\n"
							    + "if (!nexacro) nexacro = parent.nexacro; if (!nexacro) nexacro = window.nexacro; if (!nexacro && window.opener) nexacro = window.opener.nexacro;"
							    + "nexacro_HTMLSysEvent={};\n"
							    + "nexacro._initHTMLSysEvent(window, document);"
                                + "nexacro._preparePopupManagerFrame(window);"
                                + 'function _inputDOM_nodeClick(_input){ _input.click();}'
							    + "</script>\n"
							    + "</body>\n"
							    + "</html>";
	}
	else if (nexacro._Browser == "IE" && nexacro._BrowserVersion >= 9)
	{
	    nexacro._doc_init_html = "<html lang=\"" + nexacro._BrowserLang.substr(0, 2) + "\">\n"
							    + "<head>\n"
							    + "</head>\n"
							    + "<body style='margin:0;border:none;'>\n"
							    + "<script type='text/javascript'>\n"
							    + "nexacro = parent.nexacro; if (!nexacro) nexacro = window.nexacro; if (!nexacro) nexacro = window.opener.nexacro;"
							    + "nexacro_HTMLSysEvent={};\n"
							    + "nexacro._initHTMLSysEvent(window, document);"
                                + "nexacro._preparePopupManagerFrame(window);"
                                + 'function _inputDOM_nodeClick(_input){ _input.click();}'
							    + "</script>\n"
							    + "</body>\n"
							    + "</html>";
	}
    else if(nexacro._isTouchInteraction)
	{
        nexacro._doc_init_html = "<html lang=\"" + nexacro._BrowserLang.substr(0, 2) + "\">\n"
							    + "<head>\n"
							    + "<style>\n"
							    + "div {\n"
							    + "-moz-user-select:none;\n"
							    + "-webkit-user-select:none;\n"
							    + "-webkit-touch-callout:none;\n"
							    + "-webkit-appearance:none;\n"
							    + "-webkit-tap-highlight-color:rgba(0,0,0,0);\n"
                                + "outline: none;\n"
							    + "}\n"
							    + "</style>\n"
							    + "</head>\n"
							    + "<body style='margin:0;border:none;'>\n"
							    + "<script type='text/javascript'>\n"                             
							    + "nexacro = parent.nexacro;"                            
							    + "window.nexacro_HTMLSysEvent={};\n"
							    + "nexacro._initHTMLSysEvent(window, document);"
							    + "</script>\n"
							    + "</body>\n"
							    + "</html>";
	}
	else
	{
        nexacro._doc_init_html = "<html lang=\"" + nexacro._BrowserLang.substr(0, 2) + "\">\n"
							    + "<head>\n"
							    + "<style>\n"
							    + "div {\n"
                                + "outline: none;\n"
							    + "}\n"
							    + "</style>\n"
							    + "</head>\n"
							    + "<body style='margin:0;border:none;'>\n"
							    + "<script type='text/javascript'>\n"                             
                                + "nexacro = parent.nexacro; if (!nexacro) nexacro = window.nexacro; if (!nexacro) nexacro = window.opener.nexacro;"
							    + "window.nexacro_HTMLSysEvent={};\n"
							    + "nexacro._initHTMLSysEvent(window, document);"
                                + "nexacro._preparePopupManagerFrame(window);"
							    + "</script>\n"
							    + "</body>\n"
							    + "</html>";
    }

   
	
	nexacro._createWindowHandle = function(parent_win, target_win, name, left, top, width, height, resizable, layered, taskbar, is_main)
	{
	    
	        var _win_handle = null;
	        if (is_main == true)
	        {
	            _win_handle = nexacro._getMainWindowHandle();
	            nexacro._mainwindow_handle = _win_handle;
	        }
	        else
	        {
	            var parent_handle = null;
	            if (parent_win) parent_handle = parent_win.dest_handle;
	            _win_handle = nexacro.__createWindowHandle(parent_handle, target_win, name, left, top, width, height, resizable, layered, taskbar);

	            // IE6에서 POPUP창이 차단되어 있으면 handle이 null나옴 (Popup 창 관련 사용자 에러발생해줘야 함.)
	            if (!_win_handle) return;
	        }

        if (nexacro._allow_default_pinchzoom)
            nexacro._applyDesktopScreenWidth();
        else if (nexacro._Browser == "MobileSafari" && nexacro._BrowserVersion > 11.1)
            nexacro.__setDOMStyle_Fixed(document.documentElement.style);
	        // Calculate zoom ratio for window


	        nexacro.__setViewportScale();
            nexacro.__insertInputtypeDateCSSStyle(); 
	       // _win_handle.document.body.style.overflow = "visible";

	        // 2013.07.12 Runin : RP_32904
	        // 실행환경마다 알맞은 스타일값을 가지도록 하기 위함.
	        //var head = _win_handle.document.head;
	        //if (head && head.children)
	        //{
	        //    var child = head.children;
	        //    for (var i = 0; i < child.length; i++)
	        //    {
	        //        if (child[i].nodeName == "STYLE")
	        //        {
	        //            child[i].innerHTML = nexacro._doc_head_style;
	        //            break;
	        //        }
	        //    }
	        //}
	        // [RP_33521] by ODH :  IE 8이하의 경우, main window에서 Open Window의 DOM을 create 하면 속도가 많이 느림.
	        //                      때문에 Open Window의 Event를 fire하여 Open Window가 DOM Create 하도록 함.
        _win_handle._linked_window = target_win;
        //nexacro._window = target_win;
        target_win.attachHandle(_win_handle);
        if (!is_main)
        {
            // [RP_33521] by ODH : IE10에서는 open window에 setTimeout 하면 event handler 함수에 안들어온다.
            //_win_handle.setTimeout(function () { _win_handle.nexacro.__fireHTMLEvent(_win_handle.document.body, 'load', 'onload'); }, 10);
            setTimeout(function () { nexacro.__fireHTMLEvent(_win_handle.document.body, 'load', 'onload'); }, 10);
        }
	    
	    
	};
    
	nexacro._setLinkedWindow = function (handle, target_win)
	{
	    handle._linked_window = target_win;
	};

	nexacro._createOpenWindowHandle = function (parent_win, name, formurl, left, top, width, height, resizable, layered, taskbar, is_main, parentframe, frameopener, arr_arg, ext_openstyles)
	{
	    //var _win_handle = null;
	    var parent_handle = null;
	    if (parent_win) parent_handle = parent_win.dest_handle;
	    return nexacro.__createOpenWindowHandle(parent_handle, name, formurl, left, top, width, height, resizable, layered, taskbar, parent_win, parentframe, frameopener, arr_arg, ext_openstyles);
	};


    // { prefixA : { url: value, cachelevel:cachelevel},
    //   prefixB : { url: value, cachelevel:cachelevel}
    // }
	
	nexacro._setLocalStorageforService = function (prefixid, url, cachelevel)
	{	    
	    var servicedata = nexacro._getLocalStorage("service", 2);
	    if (servicedata)
	    {
	        servicedata = JSON.parse(servicedata);
	    }
	    else
	        servicedata = {};

	    if (!servicedata.prefixid)
	        servicedata[prefixid] = {};

	    servicedata[prefixid].url = url;
	    servicedata[prefixid].cachelevel = cachelevel;
	    
	    var servicestr = JSON.stringify(servicedata);
	    nexacro._setLocalStorage("service", servicestr, 2);
	};

	nexacro._getLocalStorageforService = function ()
	{
	    var env = nexacro.getEnvironment();
	    var servicelist = nexacro._getLocalStorage("service", 2);
	    if (servicelist)
	    {
	        var servicedata = JSON.parse(servicelist);
	        for (var prefix in servicedata)
	        {
	            var serviceitem = servicedata[prefix];
	            if (serviceitem)
	            {
	                var envservice = env.services[prefix];
	                if (envservice)
	                {
	                    if (serviceitem.url != envservice.url)   //일부러 setter 를 태우지 않음
	                        envservice.url = serviceitem.url;
	                    if (serviceitem.cachelevel)
	                        envservice.set_cachelevel(serviceitem.cachelevel);
	                }
	            }
	        }
	    }
	};

	nexacro._setLocalStorageforOpen = function (id, parentwin, parentframe, frameopener, arrarg)
	{
		//cssurl
		if (nexacro._cssurls)
			nexacro._setLocalStorage("cssurls", nexacro._cssurls, 2);
  
		if (nexacro._popupframeoption[id])
		{
			var value = JSON.stringify(nexacro._popupframeoption[id]);
            var key = "popupframeoption" + id;
			nexacro._setLocalStorage(key, value, 2);
			
			//if (parentwin)
			//{
			//	parentwin._popupparentframe = parentframe;
			//	parentwin._popupframeopener = frameopener;
			//	parentwin._popuparrarg = arrarg;
			//}
			//else
			{
			    if (!window._nexacro_popupframeoption)
			        window._nexacro_popupframeoption = {};
                
			    var _popup_opt = window._nexacro_popupframeoption[key] = {};

			    _popup_opt._popupparentframe = parentframe;
			    _popup_opt._popupframeopener = frameopener;
			    _popup_opt._popuparrarg = arrarg;
			}
		}
		//this._popupframeoption[id] = {
		//	"_openstyles": openstyles,
		//	"_formurl": formurl,
		//	"_parentwindow": parent_window,
		//	"_opener": frameopener,
		//	"_args": arr_arg,
		//	"_parentframe": parentframe,
		//	"_left": left,
		//	"_top": top,
		//	"_width": width,
		//	"_height": height
		//};
	};

	nexacro.__createOpenWindowHandle = function (_handleParent, name, formurl, left, top, width, height, resizable, /*[nouse]*/layered, /*[nouse]*/taskbar, parentwin, parentframe, frameopener, arr_arg, ext_openstyles)
	{
	    if (left == null)
	        left = Math.floor((screen.availWidth - width) / 2);

	    if (top == null)
	        top = Math.floor((screen.availHeight - height) / 2);

	    var dochandle = _handleParent ? _handleParent.ownerDocument : null;
	    var _parent_win = dochandle ? (dochandle.defaultView || dochandle.parentWindow) : window;
	    var _win_handle;


	    var opt = "left=" + left + ",top=" + top + ",width=" + width + ",height=" + height + ","
                + "directories=no,scrollbars=no,"
                + "resizable=" + (resizable ? "yes" : "no");

	    opt += "," + ext_openstyles;

		//var popupurl = "./popup.html";
	    var popupurl = "./popup.html";

	    if (formurl)
	    {
	        popupurl += "?formname=" + encodeURIComponent(formurl);
	        popupurl += "&framename=" + name;
            popupurl += "&loadtime=" + nexacro._uniquestoragevalue; // open 창에서도 localstorage uniquekey 유지하기 위해 
	    }

	    nexacro._setLocalStorageforOpen(name, parentwin, parentframe, frameopener, arr_arg);

	    var url = nexacro._transfullurl(nexacro._project_absolutepath, popupurl);	    
	    _win_handle = _parent_win.open(url, name, opt);

	    if (!_win_handle)
	        return null;

	    return _win_handle;
	};


	nexacro.__createWindowHandle = function (_handleParent, target_win, name, left, top, width, height, resizable, /*[nouse]*/layered, /*[nouse]*/taskbar)
	{
		if (left == null)
			left = Math.floor((screen.availWidth - width) / 2);
		
		if (top == null)
			top = Math.floor((screen.availHeight - height) / 2);

		var dochandle = _handleParent ? _handleParent.ownerDocument : null;
		var _parent_win = dochandle ? (dochandle.defaultView || dochandle.parentWindow) : window;
		var _win_handle, opt;
		if (false && _parent_win.showModelessDialog)
		{
		    // TODO showModeless
		    // window_handle에 접근하려하면 Access Denied가 발생함.
            // -> 동일 domain으로 오픈해야 한다.
		    opt = "dialogHeight:" + height + "px" + "; dialogLeft:" + left + "px" + "; dialogTop:" + top + "px" + "; dialogWidth:" + width + "px"
                    + "; center:no" + (resizable ? "; resizable:yes" : "")
                    + "; status:no";
		    _win_handle = _parent_win.showModelessDialog(document.URL + "empty.html", { nexacro: _parent_win.nexacro, parent: _parent_win }, opt);
		}
		else
		{
		    opt = "left=" + left + ",top=" + top + ",width=" + width + ",height=" + height + ","
                    + "toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=no,"
                    + "resizable=" + (resizable ? "yes" : "no");
		    _win_handle = _parent_win.open("", name, opt);
		}

	    // IE6에서 POPUP창이 차단되어 있으면 handle이 null나옴 (Popup 창 관련 사용자 에러발생해줘야 함.)
		if (!_win_handle)
		    return null;

	    // Initialized nexacro Object
		_win_handle.nexacro = _parent_win.nexacro;
		_win_handle.system = _parent_win.system;
		_win_handle._application = _parent_win._application;

		_win_handle._linked_window = target_win;

	    // clear all document -- set as about:blank && remain domain as nexacro._open_window_url
		_win_handle.document.open();

        // _win_handle에 설정한 GlobalVariable(nexacro,system, ..)이 IE8에서는 제대로 설정되지 않음. 2013.05.31 neoarc
	    // document같은 다른 곳에 담아 넘겨야 할 듯.

		_win_handle.document.write(nexacro._doc_init_html);
	    _win_handle.document.close();

		return _win_handle;
	};
	// if opened window loaded ==> excute DocInit_Html5.js ==> call target_window.on_init_sysevent_handlers()
   
	nexacro._createModalWindowHandle = function (/*parent_win, target_win, name, left, top, width, height, resizable, layered, lockmode*/)
    {

    };

	nexacro._createModalAsyncWindowHandle = function (parent_win, target_win, name, left, top, width, height, resizable, layered, lockmode)
	{
	    var parent_handle = null;
	    if (parent_win)
	    	parent_handle = parent_win.dest_handle;
	    var _win_handle = nexacro.__createModalAsyncWindowHandle(parent_handle, target_win, name, left, top, width, height, resizable, layered, lockmode);

	    // IE6에서 POPUP창이 차단되어 있으면 handle이 null나옴 (Popup 창 관련 사용자 에러발생해줘야 함.)
	    if (!_win_handle) return;

	    _win_handle.document.body.style.overflow = "visible";
	    _win_handle._linked_window = target_win;

	    // [RP_33521] by ODH :  IE 8이하의 경우, main window에서 Open Window의 DOM을 create 하면 속도가 많이 느림.
	    //                      때문에 Open Window의 Event를 fire하여 Open Window가 DOM Create 하도록 함.
	  //  nexacro._window = target_win;

	    target_win.attachHandle(_win_handle);
	    setTimeout(function () { nexacro.__fireHTMLEvent(_win_handle.document.body, 'load', 'onload'); }, 10);
	};

	nexacro.__createModalAsyncWindowHandle = function (_handleParent, target_win, name, left, top, width, height, resizable, layered, lockmode)
    {
        if (left == null)
            left = Math.floor((screen.availWidth - width) / 2);
        if (top == null)
            top = Math.floor((screen.availHeight - height) / 2);

        var opt = "left=" + left + ",top=" + top + ",width=" + width + ",height=" + height + ","
			    + "toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=no,"
			    + "resizable=" + (resizable ? "yes" : "no");

        var dochandle = _handleParent ? _handleParent.ownerDocument : null;
        var _parent_win = dochandle ? (dochandle.defaultView || dochandle.parentWindow) : window;
        var _win_handle = _parent_win.open("", name, opt);

	    // IE6에서 POPUP창이 차단되어 있으면 handle이 null나옴 (Popup 창 관련 사용자 에러발생해줘야 함.)
        if (!_win_handle) return null;

        // Initialized nexacro Object
      
        if (_parent_win)
        {
            _win_handle.nexacro = _parent_win.nexacro;
            _win_handle.system = _parent_win.system;
            _win_handle._application = _parent_win._application;
        }
        
        _win_handle._linked_window = target_win;

        // clear all document -- set as about:blank && remain domain as nexacro._open_window_url
        _win_handle.document.open();
        _win_handle.document.write(nexacro._doc_init_html);
	    _win_handle.document.close();
        
        return _win_handle;

	};

	nexacro._createModalAsyncCallbackHandler = function (_win_handle, frame)
	{
	    if (frame._window_type != 3)
	        return;

	    // modal async window를 감시하고 완전히 닫힌 후에 callback을 실행한다.
	    var main_handle = nexacro._getMainWindowHandle();

	    // clearinterval 해줘야 하기때문에 frame object를 key로 사용
        var timer_handle = main_handle.setInterval(function ()
	    {
	        if (_win_handle && _win_handle.closed)
	        {
	            frame._runCallback();

                // Safari,Opera는 clearInterval시 수행중이던 함수도 중단되는것 같다.
	            nexacro._removeModalAsyncCallbackHandler(frame);
            }
        }, 100);

		  if (!nexacro._closedmodalasync_list)
				nexacro._closedmodalasync_list =[];

            nexacro._closedmodalasync_list.push([frame, timer_handle]);
        
	};

	nexacro._removeModalAsyncCallbackHandler = function (frame)
	{
		if(!nexacro._closedmodalasync_list)
				return;

	    var list = nexacro._closedmodalasync_list;
	    var list_length = list.length;
	    for (var i = 0; i < list_length; i++)
	    {
	        var list_item = list[i];
	        if (list_item[0] == frame)
	        {
	            var main_handle = nexacro._getMainWindowHandle();
	            main_handle.clearInterval(list_item[1]);

	            for (var j = i; j < list_length - 1; j++)
	            {
	                list[j] = list[j + 1];
	            }
	            list.pop();
	            break;
	        }
	    }
	};

	nexacro._isWindowHandlePrepared = function(_win_handle)
	{
		return (_win_handle.document.body !== null);
	};
	
	nexacro._closeWindowHandle = function(_win_handle)
	{       
	    if (_win_handle)
	    {
	        //nexacro._destroyManagerFrame() 이동 - popup과 따로 존재하므로 window별 매번 삭제
            if (nexacro._getMainWindowHandle() != _win_handle)
            {
                _win_handle.open('', '_self');
                _win_handle.close();
	        }
        }
	};

	nexacro._refreshWindow = nexacro._emptyFn;

	//------------------------------------------------------------------------------
	// window handle api
	nexacro._getMainWindowHandle = function()
	{
	    if (nexacro._mainwindow_handle)
	        return nexacro._mainwindow_handle;
	    else
	    {
	        if (window._popup === true)
	            return window.opener || window.parent;
	        return window;
	    }
	};

	nexacro._getWindowHandle = function(_win_handle)
	{
	    var link_window = _win_handle._linked_window;
	    if (link_window && link_window._is_main)
	    {
	        return _win_handle;
        }
        return window;
	};

	nexacro._getWindowDocumentHandle = function(_win_handle)
	{
		return _win_handle.document;
	};

	nexacro._getWindowDestinationHandle = function(_win_handle)
	{
		return _win_handle.document.body;
	};
	
    if (nexacro._Browser == "Gecko") 
    {
	    nexacro._getWindowHandlePosX = function(_win_handle)
	    {
		    return _win_handle.mozInnerScreenX;
	    };
	    nexacro._getWindowHandlePosY = function(_win_handle)
	    {
		    return _win_handle.mozInnerScreenY;
	    };
    }
    else if(nexacro._Browser == "IE")
    {
	    nexacro._getWindowHandlePosX = function(_win_handle)
	    {
		    return _win_handle.screenLeft;
	    };
	    nexacro._getWindowHandlePosY = function(_win_handle)
	    {
		    return _win_handle.screenTop;
	    };
    }
    else 
    {
        nexacro._getWindowHandlePosX = function(/*_win_handle*/)
	    {
            return nexacro._gap_client_width;
	    };
        nexacro._getWindowHandlePosY = function(/*_win_handle*/)
        {
            return nexacro._gap_client_height;
        };
    }

    if (nexacro._Browser == "IE" && nexacro._BrowserVersion <= 8)
    {
	    nexacro._getWindowHandleOuterWidth = function(_win_handle)
	    {
		    return _win_handle.document.documentElement.offsetWidth;
	    };
	    nexacro._getWindowHandleOuterHeight = function(_win_handle)
	    {
		    return _win_handle.document.documentElement.offsetHeight;
	    };
    }
    else if (nexacro._OS == "iOS" && parseFloat(nexacro._OSVersion) >= 8)
    {
        // iOS8 이상에서 window.outerWidth,Height 값이 0 으로 나옴. (iOS7은 정상)
        nexacro._getWindowHandleOuterWidth = function (_win_handle)
        {
            return _win_handle.document.documentElement.offsetWidth;
        };
        nexacro._getWindowHandleOuterHeight = function (_win_handle)
        {
            return _win_handle.document.documentElement.offsetHeight;
        };
    }
    else
    {
	    nexacro._getWindowHandleOuterWidth = function(_win_handle)
	    {
		    return _win_handle.outerWidth;
	    };
	    nexacro._getWindowHandleOuterHeight = function(_win_handle)
	    {
		    return _win_handle.outerHeight;
	    };
    }


    if (nexacro._Browser == "IE" && nexacro._BrowserVersion == 8)
    {
        // TODO check
        // IE8은 offsetWidth는 약간의 오차가 있어 clientWidth가 정확하지만
        // window 생성 직후에는 clientWidth값이 0으로 설정되어있어 문제가 생긴다. how?
	    nexacro._getWindowHandleClientWidth = function(_win_handle)
	    {	    
            return _win_handle.document.documentElement.clientWidth;
	    };
	    nexacro._getWindowHandleClientHeight = function(_win_handle)
	    {
            return _win_handle.document.documentElement.clientHeight;
	    };
    }
    else if (nexacro._Browser == "IE" && nexacro._BrowserVersion < 8)
    {
        nexacro._getWindowHandleClientWidth = function (_win_handle)
        {
            return _win_handle.document.documentElement.offsetWidth;
        };
        nexacro._getWindowHandleClientHeight = function (_win_handle)
        {
            return _win_handle.document.documentElement.offsetHeight;
        };
    }
    else if (nexacro._Browser == "IE")
    {
        nexacro._getWindowHandleClientWidth = function (_win_handle)
        {
            return _win_handle.innerWidth;
        };
        nexacro._getWindowHandleClientHeight = function (_win_handle)
        {
            return _win_handle.innerHeight;
        };
    }
    else if (nexacro._OS == "iOS" && nexacro._Browser == "MobileSafari")
    {
        if (nexacro._BrowserVersion > 11.2)
        {
            nexacro._getWindowHandleClientHeight = function (_win_handle)
            {
                return _win_handle.document.body.clientHeight;
            }; 

            nexacro._getWindowHandleClientWidth = function (_win_handle)
            {
                return _win_handle.document.body.clientWidth;
            }; 
        }
        else
        {
            nexacro._getWindowHandleClientHeight = function (_win_handle)
            {
                var _tester = nexacro._device_exception_tester;
                var clientheight = _win_handle.document.body.clientHeight;
                var innerheight = _win_handle.innerHeight;
                var is_landscape = innerheight < _win_handle.innerWidth ? true : false;
                if (is_landscape)
                {
                    return innerheight;
                }
                else if (!nexacro._isHybrid() && (nexacro._allow_default_pinchzoom || (_tester && _tester.use_windowsize_as_bodysize)))
                {
                    return clientheight;// < innerHeight ? clientHeight : innerHeight;
                }
                else
                {
                     return innerheight;
                }
            };

            nexacro._getWindowHandleClientWidth = function (_win_handle)
            {
                var _tester = nexacro._device_exception_tester;
                var clientwidth = _win_handle.document.body.clientWidth;
                var innerwidth = _win_handle.innerWidth;
                var is_landscape = innerwidth > _win_handle.innerHeight ? true : false;
                if (is_landscape)
                    return clientwidth;
                else if (!nexacro._isHybrid() && (nexacro._allow_default_pinchzoom || (_tester && _tester.use_windowsize_as_bodysize)))
                {
                    return clientwidth;
                }
                else
                    return innerwidth;

            };
        }        
    }
    else if (nexacro._BrowserExtra == "SamsungBrowser")
    {
        nexacro._getWindowHandleClientWidth = function (_win_handle)
        {
            var _tester = nexacro._searchDeviceExceptionTable();
            var clientwidth = _win_handle.document.body.clientWidth;
            var innerwidth = _win_handle.innerWidth;
            if (nexacro._allow_default_pinchzoom)
            {
                var clientWidth = _win_handle.document.body.clientWidth;
               // var innerWidth = _win_handle.innerWidth;
                return clientWidth;// < innerWidth ? clientWidth : innerWidth;
            }
            else if ((_tester && _tester.use_windowsize_as_bodysize))
            {
                return clientwidth;
            }
            else
                return innerwidth;

        };
        nexacro._getWindowHandleClientHeight = function (_win_handle)
        {
            var _tester = nexacro._searchDeviceExceptionTable();
            var clientheight = _win_handle.document.body.clientHeight;
            var innerheight = _win_handle.innerHeight;
            if (nexacro._allow_default_pinchzoom)
            {
                var clientHeight = _win_handle.document.body.clientHeight;
                //var innerHeight = _win_handle.innerHeight;
                return clientHeight;// < innerHeight ? clientHeight : innerHeight;
            }
            else if ((_tester && _tester.use_windowsize_as_bodysize))
            {
                return clientheight;
            }
            else
                return innerheight;

        };
    }

    else
    {
        nexacro._getWindowHandleClientWidth = function (_win_handle)
        {
            var _tester = nexacro._device_exception_tester;
            if (nexacro._allow_default_pinchzoom)
            {
                var clientWidth = _win_handle.document.body.clientWidth;
                var innerWidth = _win_handle.innerWidth;
                return clientWidth > innerWidth ? clientWidth : innerWidth;
            }    
            else if (_tester && _tester.use_windowsize_as_bodysize)
            {
                return _win_handle.document.body.clientWidth;
            }                  
            else
                return _win_handle.innerWidth;
        };
        nexacro._getWindowHandleClientHeight = function(_win_handle)
        {
            var _tester = nexacro._device_exception_tester;
            if (nexacro._allow_default_pinchzoom)
            {
                var clientHeight = _win_handle.document.body.clientHeight;
                var innerHeight = _win_handle.innerHeight;
                return clientHeight > innerHeight ? clientHeight : innerHeight;
            }
            else if (_tester && _tester.use_windowsize_as_bodysize)
            {
                // _win_handle.innerXXX -> 현재 화면에 표시할수 있는 pixel
                return _win_handle.document.body.clientHeight;
            }
            else
                return _win_handle.innerHeight;
        };
    }

	nexacro._setWindowHandleArea = function(_win_handle, x, y, w, h)
	{
		_win_handle.moveTo(x, y);
		_win_handle.resizeTo(w, h);
	};
	nexacro._setWindowHandlePos = function(_win_handle, x, y)
	{
		_win_handle.moveTo(x, y);
	};
	nexacro._setWindowHandleSize = function(_win_handle, w, h)
	{
		_win_handle.resizeTo(w, h);
	};

	nexacro._setWindowHandleZIndex = function (_win_handle, zindex)
	{
	    if (_win_handle.style)
	        _win_handle.style.zIndex = zindex;
	};
	
	nexacro._findWindow = function(_win_handle)
	{
		return _win_handle._linked_window;
	};
	nexacro._findDocumentWindow = function(_doc)
	{
		var _win_handle = (_doc.defaultView || _doc.parentWindow);
		return _win_handle._linked_window;
	};
	
	nexacro._flashWindow = function (/*_win_handle, type, count, interval*/)
	{
	};

	nexacro._setMouseHovertime = function (/*mousehovertime*/)
	{
	};

    nexacro._setWindowHandleText = function(_win_handle, titletext)
	{
        var doc = _win_handle.document;
        
        if (doc)
        {    
            return doc.title = titletext;
        }
    };

    nexacro._setWindowHandleStatusText = function (_win_handle, statustext)
    {
        if (window)
        {
            return window.status = statustext;
        }
    };

	//nexacro._setWindowHandleIcon =nexacro._emptyFn;
	nexacro._setWindowHandleIconObject = nexacro._emptyFn;

    if (!nexacro._isTouchInteraction)
    {
        nexacro._getMainWindowWidth = function (_win)
        {
            return _win.clientWidth;
        };
        nexacro._getMainWindowHeight = function (_win)
        {
            return _win.clientHeight;
        };
    }
    else
    {
        nexacro._getMainWindowWidth = function (_win)
        {
            var client_width = nexacro._getWindowHandleClientWidth(_win.handle);
            if (client_width !== 0)
                return client_width;

            var doc = _win._doc;
            if (doc)
            {
                var doc_elem = doc.documentElement;
                var width = 0;
                if (nexacro._OS == "iOS")
                {
                    if (doc_elem.clientWidth)
		            {
				        width = doc_elem.clientWidth;
                    }
                    else if (_win.innerWidth)
		            {
				        width = doc.body.clientWidth;	
                    }
                    else if (doc.body.clientWidth > 0)
		            {
				        width = _win.innerWidth;
		            }
                }
                else
                {
                    var w1 = _win.innerWidth ? _win.innerWidth : 0;
                    var w2;
                    var w3 = doc.body.clientWidth ? doc.body.clientWidth : 0;
			
                    if (doc_elem && doc_elem.clientWidth)
                    {
				        w2 = doc_elem.clientWidth ? doc_elem.clientWidth : 0;
			        }
			
                    if (w1 < w2)
                    {
                        if (w2 < w3)
                        {
					        width = doc.body.clientWidth;
				        }
                        else
                        {
					        width = doc_elem.clientWidth;
				        }
                    }
                    else
                    {
                        if (w1 < w3)
                        {
					        width = doc.body.clientWidth;
                        }
                        else
                        {
					        width = _win.innerWidth;
				        }
			        }
                }
            
                // 2014.05.16 neoarc; Viewport 조작 코드를 제거함. MLM에 의해 자동제어되므로 조작금지

                    return width;
            }
            return _win.clientWidth;
        };

        nexacro._getMainWindowHeight = function (_win)
        {
            var client_height = nexacro._getWindowHandleClientHeight(_win.handle);
            if (client_height !== 0)
                return client_height;

            var doc = _win._doc;
            if (doc)
            {
                var doc_elem = doc.documentElement;
                var height = 0;
                if (nexacro._OS == "iOS")
                {
                    if (doc_elem.clientHeight)
		            {
				        height = doc_elem.clientHeight;
                    }
                    else if (_win.innerHeight)
		            {
				        height = doc.body.clientHeight;	
                    }
                    else if (doc.body.clientHeight > 0)
		            {
				        height = _win.innerHeight;
		            }
                }
                else
                {
                    var w1 = _win.innerWidth ? _win.innerWidth : 0;
                    var w2;
                    var w3 = doc.body.clientWidth ? doc.body.clientWidth : 0;
			
                    if (doc_elem && doc_elem.clientWidth)
                    {
				        w2 = doc_elem.clientWidth ? doc_elem.clientWidth : 0;
			        }
			
                    if (w1 < w2)
                    {
                        if (w2 < w3)
                        {
					        height = doc.body.clientHeight;
				        }
                        else
                        {
					        height = doc_elem.clientHeight;
				        }
                    }
                    else
                    {
                        if (w1 < w3)
                        {
					        height = doc.body.clientHeight;
                        }
                        else
                        {
					        height = _win.innerHeight;
				        }
			        }
                }
                return height;
            }
            return _win.clientHeight;
        };
    }

   
    nexacro._hasCookieVariables = function ()
    {
        return (nexacro._getCookieVariables(4) || nexacro._getCookieVariables(6)) ? true: false;
    };
    
    
    
    
	// type = 1: user, 2: engine, 3: envvar 4: envcookie 5:envhttp 6:envsecurecookie
    nexacro._getLocalStorageKey = function (type, global)
    {   
        // application을 기반으로 한 environment의 localstorage key값은 개별로 관리됨 , 여러개의 창이 뜰경우 개별로 관리됨
        // nexacro.getPrivateProfile을 통해서 호출된 값은 key + projectpath 가 같으면 공동 제어  
        
        if (!nexacro._uniquestoragevalue)    
        {
            nexacro._uniquestoragevalue = new Date().getTime();    
        }

    	var localstoragekey = "";
    	var projectpath = nexacro._project_absolutepath ? nexacro._project_absolutepath : nexacro._getProjectBaseURL();
    	if (global)
    	{
    		localstoragekey = window.location.href;
    	}
    	else
    	{
			//application 으로 뜨는 경우 
    		var env = nexacro.getEnvironment();    		
            if (type < 3)
    		    localstoragekey = env.key + projectpath;
            else
                localstoragekey = nexacro._uniquestoragevalue + env.key + projectpath;
    	}

    	switch (type)
    	{
    		case 1: return localstoragekey + "user";
    		case 2: return nexacro._uniquestoragevalue + projectpath + "engine";
    		case 3: return localstoragekey + "envvar";
    		case 4: return localstoragekey + "envcookie";
    	    case 5: return localstoragekey + "envhttp";
    	    case 6: return localstoragekey + "envsecurecookie";
    	}
    };


    if (nexacro._Browser == "IE" && nexacro._BrowserVersion == 6)
    {
        nexacro._setLocalStorage = nexacro._emptyFn;
        nexacro._getLocalStorage = nexacro._emptyFn;
        nexacro._removeLocalStorage = nexacro._emptyFn;
        nexacro._hasLocalStorage = nexacro._emptyFn;
        nexacro._clearLocalStorage = nexacro._emptyFn;
    }
    else if (nexacro._Browser == "IE" && nexacro._BrowserVersion == 7)
    {
        //localstoragekey 는 key + projectpath 로 함 
        // adl 이 달라도 projectpath가 같다면 localstroagekey는 공유한다.

        // type = 1: user, 2: engine, 3: envvar 4: envcookie  5:envhttp 6: evnsecurecookie
        nexacro._setLocalStorage = function (key, varValue, type, global)
        {
            var localstoragekey = nexacro._getLocalStorageKey(type, global);

            var iframenode = nexacro._managerFrameNode;
            if (iframenode)
            {
                var value;
                var vartype = (typeof varValue);
                if (vartype == "object")
                {
                    if (varValue instanceof nexacro.Date)
                        vartype = "nexacrodate";
                    else if (varValue instanceof Date)
                        vartype = "date";
                    else if (varValue instanceof nexacro.Decimal)
                        vartype = "decimal";
                }
                value = vartype + ":" + varValue;

                iframenode.setAttribute(key, value);
                iframenode.save(localstoragekey);
                return true;
            }
            return false;
        };

        nexacro._getLocalStorageAll = function (type)
        {
            var localstoragekey = nexacro._getLocalStorageKey(type, false);

            var iframenode = nexacro._managerFrameNode;
            if (iframenode)
            {
                iframenode.load(localstoragekey);               
            }
        };


        nexacro._getLocalStorage = function (key, type, global)
        {
            var localstoragekey = nexacro._getLocalStorageKey(type, global);

            var iframenode = nexacro._managerFrameNode;
            if (iframenode)
            {
                iframenode.load(localstoragekey);
                var attribute = iframenode.getAttribute(key);
                if (attribute)
                {
                    var index = attribute.indexOf(":");
                    var vartype = attribute.substring(0, index);
                    var value = attribute.substring(index + 1);

                    if (vartype && value)
                    {
                        if (vartype == "number")
                        {
                            return Number(value);
                        }
                        else if (vartype == "boolean")
                        {
                            return (value == "true") ? true : false;
                        }
                        else if (vartype == "nexacrodate")
                        {
                            var year = value.substring(0, 4);
                            var month = value.substring(4, 6);
                            var date = value.substring(6, 8);
                            var hour = value.substring(8, 10);
                            var minute = value.substring(10, 12);
                            var second = value.substring(12, 14);
                            var millisecond = value.substring(14, 16);
                            return new nexacro.Date(year, month, date, hour, minute, second, millisecond);
                        }
                        else if (vartype == "date")
                        {
                            return new Date(value);
                        }
                        else if (vartype == "decimal")
                        {
                            return new nexacro.Decimal(value);
                        }
                        else if (vartype == "undefined")
                        {
                            return value ? "undefined" : undefined;
                        }
                        return value;
                    }
                }
            }
        };

        nexacro._hasLocalStorage = function (key, type, global)
        {
            var localstoragekey = nexacro._getLocalStorageKey(type, global);

            var iframenode = nexacro._managerFrameNode;
            if (iframenode)
            {
                iframenode.load(localstoragekey);
                var attribute = iframenode.getAttribute(key);
                if (attribute)
                {
                    return true;
                }
            }
            return false;
        };

        nexacro._removeLocalStorage = function (key, type, global)
        {
            var localstoragekey = nexacro._getLocalStorageKey(type, global);

            var iframenode = nexacro._managerFrameNode;
            if (iframenode)
            {
                iframenode.load(localstoragekey);
                var attribute = iframenode.getAttribute(key);
                if (attribute)
                {
                    iframenode.removeAttribute(key);
                }

                iframenode.save(localstoragekey);
                return true;
            }
            return false;
        };

        nexacro._clearLocalStorage = function ()
        {        	
        };
    }
    else  //localStorage
    {

        nexacro._getLocalStorageObject = function ()        {            if (nexacro._isLocalStorageSupport())                return window.localStorage;            else            {                if (!nexacro._enginevar)                {                    nexacro._enginevar = new nexacro.Collection();                    nexacro._enginevar.removeItem = function (key) { return this.remove_item(key); };                }                                    return nexacro._enginevar;            }        };
        // type = 1: user, 2: engine, 3: envvar 4: envcookie  5:envhttp 6: evnsecurecookie
        nexacro._setLocalStorage = function (key, varValue, type, global)
        {
            var localstorage = nexacro._getLocalStorageObject();
            if (localstorage)
            {
                var localstoragekey = nexacro._getLocalStorageKey(type, global);

                if (localstoragekey)
                {
                    var localstoragedata = localstorage.getItem(localstoragekey);
                    var jsondata = {};
                    if (localstoragedata)
                    {
                        jsondata = JSON.parse(localstoragedata);
                    }

                    var vartype, findkey = jsondata[key];
                    if (findkey)
                    {
                        vartype = (typeof varValue);
                        if (vartype == "object")
                        {
                            if (varValue instanceof nexacro.Date)
                                vartype = "nexacrodate";
                            else if (varValue instanceof Date)
                                vartype = "date";
                        }
                        if (findkey.type == vartype && findkey.value == varValue)
                            return true;

                        findkey.type = vartype;
                        findkey.value = varValue + "";
                    }
                    else
                    {
                        vartype = (typeof varValue);
                        if (vartype == "object")
                        {
                            if (varValue instanceof nexacro.Date)
                                vartype = "nexacrodate";
                            else if (varValue instanceof Date)
                                vartype = "date";
                            else if (varValue instanceof nexacro.Decimal)
                                vartype = "decimal";
                        }

                        jsondata[key] = { "type": vartype, "value": varValue + "" };
                    }
                    
                    if (nexacro._OS == "iOS" && nexacro._isHybrid && nexacro._isHybrid())
                    {
                        nexacro._setPreferencesValue(localstoragekey, JSON.stringify(jsondata));
                    }
                    
                    localstorage.setItem(localstoragekey, JSON.stringify(jsondata));
                    
                    return true;
                }
            }
            return false;
        };

        nexacro._getLocalStorageAll = function (type)
        {
            var localstorage = nexacro._getLocalStorageObject();
            if (localstorage)
            {
                var localstoragekey = nexacro._getLocalStorageKey(type, false);

                if (localstoragekey)
                {
                    var localstoragedata = localstorage.getItem(localstoragekey);                    
                    if (localstoragedata)
                    {
                        return JSON.parse(localstoragedata);
                    }
                }
            }
        };

        nexacro._getLocalStorage = function (key, type, global)
        {
            var localstorage = nexacro._getLocalStorageObject();
            if (localstorage)
            {
                var localstoragekey = nexacro._getLocalStorageKey(type, global);

                if (localstoragekey)
                {
                    var localstoragedata = localstorage.getItem(localstoragekey);
                    var jsondata = {};
                    if (localstoragedata)
                    {
                        if (nexacro._OS == "iOS" && nexacro._isHybrid && nexacro._isHybrid())
                        {
                            nexacro._setPreferencesValue(localstoragekey, localstoragedata);
                        }
                        jsondata = JSON.parse(localstoragedata);
                    }

                    var findkey = jsondata[key];
                    if (findkey)
                    {
                        var vartype = findkey.type;
                        var value = findkey.value;
                        if (value && vartype)
                        {
                            if (vartype == "number")
                            {
                                return Number(value);
                            }
                            else if (vartype == "boolean")
                            {
                                return (value == "true") ? true : false;
                            }
                            else if (vartype == "nexacrodate")
                            {
                                var year = value.substring(0, 4);
                                var month = value.substring(4, 6);
                                var date = value.substring(6, 8);
                                var hour = value.substring(8, 10);
                                var minute = value.substring(10, 12);
                                var second = value.substring(12, 14);
                                var millisecond = value.substring(14, 16);
                                return new nexacro.Date(year, month, date, hour, minute, second, millisecond);
                            }
                            else if (vartype == "date")
                            {
                                return new Date(value);
                            }
                            else if (vartype == "decimal")
                            {
                                return new nexacro.Decimal(value);
                            }
                            else if (vartype == "undefined")
                            {
                                return value ? "undefined" : undefined;
                            }
                            return value;
                        }
                    }
                }
            }
        };

        nexacro._hasLocalStorage = function (key, type, global)
        {
            var localstorage = nexacro._getLocalStorageObject();
            if (localstorage)
            {
                var localstoragekey = nexacro._getLocalStorageKey(type, global);

                if (localstoragekey)
                {
                    var localstoragedata = localstorage.getItem(localstoragekey);
                    var jsondata = {};
                    if (localstoragedata)
                    {
                        jsondata = JSON.parse(localstoragedata);
                    }

                    var findkey = jsondata[key];
                    if (findkey)
                    {
                        return true;
                    }
                }
            }
            return false;
        };

        nexacro._removeLocalStorage = function (key, type, global)
        {
            var localstorage = nexacro._getLocalStorageObject();
            if (localstorage)
            {
                var localstoragekey = nexacro._getLocalStorageKey(type, global);

                if (localstoragekey)
                {
                    var localstoragedata = localstorage.getItem(localstoragekey);

                    var jsondata = {};
                    if (localstoragedata)
                    {
                        jsondata = JSON.parse(localstoragedata);
                    }

                    var findkey = jsondata[key];
                    if (findkey)
                    {
                        delete jsondata[key];
                    }
                    localstorage.setItem(localstoragekey, JSON.stringify(jsondata));
                }
            }
        };

        nexacro._deleteLocalStorage = function(type, global)
        {
        	var localstorage = nexacro._getLocalStorageObject();
        	var localstoragekey = nexacro._getLocalStorageKey(type, global);
        	if (localstoragekey)
        	{
        		var localstoragedata = localstorage.getItem(localstoragekey);
        		if (localstoragedata)
        			localstorage.removeItem(localstoragekey);
        	}

        };
        nexacro._clearLocalStorage = function ()
        {	
        	//nexacro._deleteLocalStorage(1);
        	nexacro._deleteLocalStorage(2);
        	nexacro._deleteLocalStorage(3);
        	nexacro._deleteLocalStorage(4);
        	nexacro._deleteLocalStorage(5);
        };

        nexacro._copyLocalStorage = function (parentwin)
        {
            var storage = nexacro._getLocalStorageObject();
            var winkey = window.location.href;

            while (parentwin.parent != null)
            {
                parentwin = parentwin.parent;
            }

            var storagedata = storage.getItem(parentwin._handle.location.href);

            if (storagedata)
            {
                storage.setItem(winkey, storagedata);
            }
        };
    }

    if (!window.postMessage || (nexacro._Browser == "IE" && nexacro._BrowserVersion <= 8))
    {
        nexacro._postMessage = function (id, win, target_comp)
        {
            nexacro._OnceCallbackTimer.callonce(target_comp, function ()
            {
                win._on_sys_message(id);
            }, 10);
        };
    }
    else
    {
		nexacro._postMessage = function (id, win/*, target_comp*/)
		{
			if (win && win.postMessage)
			{
				win.postMessage(id, "*");
			}
			else
			{
				window.postMessage(id, "*");
			}
		};
    }
    
	nexacro._getGlobalValueData = function (key, url)
	{
	    if (nexacro._globalvalue)
	    {
	    	return nexacro._globalvalue;
	    }

	    if (window.name && key && url)
	    {
	        var globalvars = "";
	        var items = window.name.split(',');
	        if (items.length)
	        {
	            var fields = items[0].split(':');
	            if (fields[0] == key && unescape(fields[1]) == url)
	            {
	                globalvars = items.splice(1, items.length - 1).join(',');
	            }
	        }
	        nexacro._globalvalue = globalvars;
	        return globalvars;
	    }
	};
    
	nexacro._getSystemFont = function ()
	{
		return new nexacro._FontObject("12pt Verdana");
	};

	//////////////////////////////////////////////////////////////////////////
	// Popup Window
	nexacro._createPopupWindowHandle = function (parent_win, target_win, name, left, top, width, height) 
	{
		var _doc = parent_win._dest_doc;
		var dest_handle = parent_win.dest_handle;
	     
        var parent_width = parent_win.clientWidth;
        var parent_height = parent_win.clientHeight;
	    
	    var handle = null;
        if (left == null)
        {
            left = Math.floor((parent_width - width) / 2);
		}
	    if (top == null)
	    {
		    top = Math.floor((parent_height - height) / 2);
	    }

	    handle = _doc.createElement("div");
	    handle.id = 'popupwindow_' + name;

	    var layer_info;
        var frame;
	    if (target_win.comp && target_win.comp instanceof nexacro._WaitControl)
	    {
	        // WaitComponent는 무조건 body에 append
	        layer_info = {};
	        layer_info.popup_zindex = nexacro._zindex_waitcursor;
	    }
	    else if (target_win.comp)
	    {
	        // Component가 속한 Layer에 생성해야 함.
	        layer_info = target_win._getComponentLayerInfo(target_win.comp);
	    }

	    if (layer_info)
	    {
	        if (layer_info.is_modal)
	        {
	            // modal; overlay에 append
	            frame = layer_info.frame;
	            var overlay_elem = frame._modal_overlay_elem;
	            dest_handle = overlay_elem.handle;
	            dest_handle.appendChild(handle);
	        }
	        else
	        {
	            // main; first modal overlay 앞에 insert
	            if (layer_info.ref_first_modal_frame)
	            {
	                frame = layer_info.ref_first_modal_frame;
	                var _ref_handle = frame._modal_overlay_elem.handle;
	                dest_handle = nexacro._getPopupWindowDestinationHandle(handle);
	                dest_handle.insertBefore(handle, _ref_handle);
	            }
	            else
	            {
	            	dest_handle = nexacro._getPopupWindowDestinationHandle(handle);
	            	dest_handle.appendChild(handle);
	            }
	        }
	    }
	    else
	    {
	        // main
	    	dest_handle = nexacro._getPopupWindowDestinationHandle(handle);
	    	dest_handle.appendChild(handle);
	    }
        
	    handle.dest_handle = dest_handle;
	    handle._linked_window = target_win;
	    
	    var handle_style = handle.style;
	    handle_style.position = "absolute";
		handle_style.overflow = "hidden";
		handle_style.margin = "0px";
		handle_style.border = "0px";
		
		handle_style.left = (left | 0) + "px";
		handle_style.top = (top | 0) + "px";
		handle_style.width = (width | 0) + "px";
		handle_style.height = (height | 0) + "px";

		handle_style.zIndex = layer_info ? layer_info.popup_zindex : nexacro._zindex_popup;
		
	//	nexacro._window = target_win;
		target_win.attachHandle(handle);
	};
    nexacro._closePopupWindowHandle = function (handle)
	{
	    if (handle)
	    {
	        var dest_handle = handle.dest_handle;
            if (dest_handle)
			{
				nexacro.__removeDOMNode(dest_handle, handle);
			}
			handle._linked_window = null;
	    }
	};
	
    nexacro._getPopupWindowDocumentHandle = function (handle)
	{
    	var _doc = (handle.ownerDocument || handle.document);
		return _doc;
	};

    nexacro._getPopupWindowDestinationHandle = function (handle)
	{
    	var _doc = (handle.ownerDocument || handle.document);
		return _doc.body;
	};
	
    if (nexacro._Browser == "IE") 
    {
    	nexacro.__getRootWindowHandleOfPopupWindow = function (handle)
	    {
    		var _doc = (handle.ownerDocument || handle.document);
		    return _doc.parentWindow;
	    };
    }
    else if (nexacro._Browser == "Gecko") 
    {
    	nexacro.__getRootWindowHandleOfPopupWindow = function (handle)
	    {
    		var _doc = (handle.ownerDocument || handle.document);
		    return _doc.defaultView;
	    };
    }
    else
    {
    	nexacro.__getRootWindowHandleOfPopupWindow = function (handle)
	    {
    		var _doc = (handle.ownerDocument || handle.document);
		    return _doc.defaultView;
	    };
    }
	
    nexacro._getPopupWindowHandlePosX = function (handle)
	{
    	var _win_handle = nexacro.__getRootWindowHandleOfPopupWindow(handle);
    	return nexacro._getWindowHandlePosX(_win_handle) + handle.offsetLeft;
	};
    nexacro._getPopupWindowHandlePosY = function (handle)
	{
    	var _win_handle = nexacro.__getRootWindowHandleOfPopupWindow(handle);
    	return nexacro._getWindowHandlePosY(_win_handle) + handle.offsetTop;
	};
	
    nexacro._getPopupWindowHandleOuterWidth = function (handle)
	{
    	return handle.offsetWidth;
	};
    nexacro._getPopupWindowHandleOuterHeight = function (handle)
	{
    	return handle.offsetHeight;
	};
	
    nexacro._getPopupWindowHandleClientWidth = function (handle)
	{
    	return handle.clientWidth;
	};
    nexacro._getPopupWindowHandleClientHeight = function (handle)
	{
        return handle.clientHeight;
	};
	
	nexacro._setPopupWindowHandleArea = function(handle, x, y, w, h)
	{
	    if (handle)
	    {
	        var _win_handle = nexacro.__getRootWindowHandleOfPopupWindow(handle);
	        x -= nexacro._getWindowHandlePosX(_win_handle);
            y -= nexacro._getWindowHandlePosY(_win_handle);
            
	        var handle_style = handle.style;
		    handle_style.left = (x | 0) + "px";
		    handle_style.top = (y | 0) + "px";
		    handle_style.width = (w | 0) + "px";
		    handle_style.height = (h | 0) + "px";
	    }
	};
	nexacro._setPopupWindowHandlePos = function(handle, x, y)
	{
	    if (handle)
	    {
	        var _win_handle = nexacro.__getRootWindowHandleOfPopupWindow(handle);
	        x -= nexacro._getWindowHandlePosX(_win_handle);
            y -= nexacro._getWindowHandlePosY(_win_handle);
            
		    var handle_style = handle.style;
		    handle_style.left = (x | 0) + "px";
		    handle_style.top = (y | 0) + "px";
		}
	};
	
	nexacro._setPopupWindowHandleSize = function(handle, w, h)
	{
	    if (handle)
	    {
		    var handle_style = handle.style;
		    handle_style.width = (w | 0) + "px";
		    handle_style.height = (h | 0) + "px";
		}
	};

	nexacro._blockScript = function ()
	{

	};

	nexacro._unblockScript = function ()
	{

	};
	
	nexacro._setPopupWindowHandleVisible = function (handle, visible_flag)
	{
	    if (handle)
	    {
	        var handle_style = handle.style;
	        if (handle_style)
	        {
	            handle_style.visibility = (visible_flag === true) ? "" : "hidden";
	        }
		}
	};
	
	nexacro._showQuickviewMenu = function (/*comp, sx, sy*/) { };
	nexacro._setSystemMenuResizable = function (/*handle, resizable*/) { };
	nexacro._procSysCommand = function (/*handle, command*/) { };
	nexacro._setWindowHandleLock = function (handle, is_lock, _except_handle, is_modal_async)
	{
	    nexacro.__setWindowHandleLock(handle, is_lock, _except_handle, is_modal_async);
	};

	nexacro.__setWindowHandleLock = function (handle, is_lock, _except_handle/*, is_modal_async*/)
	{
	    // HTML5는 ModalAsync로만 사용된다.
	    var __handle = handle;
	    if (__handle == null)
	    {
	        __handle = window; // TODO check
	    }

	    var _window = __handle._linked_window;
	    while (_window)
	    {
	        if (_window.parent)
	            _window = _window.parent;
	        else
	            break;
	    }

	    if (_window == null)
	    {
            // assert
	        return;
	    }

	    var _except_window = _except_handle ? _except_handle._linked_window : null;
	    nexacro.__setWindowHandleEnableByRef(_window, !is_lock, _except_window, true, true);
	};

	nexacro.__setWindowHandleEnableByRef = function(_window, is_enable, _except_window, is_recursive /*,is_modal_async*/)
	{
	    // HTML5는 ModalAsync로만 사용된다.
	    if (_window != _except_window)
	    {
	        if (is_enable)
	        {
	            _window._disable_ref--;
	            if (_window._disable_ref === 0)
	                _window._coverUnlock(_except_window);
	        }
	        else
	        {
	            if (_window._disable_ref === 0)
	                _window._coverLock(_except_window);
	            _window._disable_ref++;
	        }
	    }

	    if (is_recursive)
	    {
	        for (var i = 0; i < _window._child_list.length; i++)
	        {
	            var child = _window._child_list[i];
                if (child.frame)
	                nexacro.__setWindowHandleEnableByRef(child, is_enable, _except_window, true, true);
	        }
	    }
	};

	nexacro._requestAnimationFrame = function (_window, callback)
	{
	    if (!_window)
	        return;
	    var win_handle = _window.handle;
	    if (!win_handle)
	        return;
	    var requestAnimationFrame = win_handle.requestAnimationFrame || win_handle.mozRequestAnimationFrame || win_handle.webkitRequestAnimationFrame || win_handle.msRequestAnimationFrame;
	    if (!requestAnimationFrame)
	        return;
	    var requestid = requestAnimationFrame.call(win_handle, callback);
	    return requestid;
	};

	nexacro._cancelAnimationFrame = function (_window, requestid)
	{
	    if (!_window)
	        return;
	    var win_handle = _window.handle;
	    if (!win_handle)
	        return;
	    var cancelAnimationFrame = win_handle.cancelAnimationFrame || win_handle.mozCancelAnimationFrame || win_handle.webkitCancelAnimationFrame;
	    if (cancelAnimationFrame)
	        cancelAnimationFrame.call(win_handle, requestid);
	};

	nexacro._checkExceptionDevice = function (_tester)
	{
	    var orientation_str = nexacro._isPortrait() ? "portrait" : "landscape";
	    _tester.init_screen_width = nexacro._getScreenWidth();
	    _tester.is_init_screen_portrait = nexacro._isPortrait();
	    _tester[orientation_str + "_screen_width"] = nexacro._getScreenWidth();
	    _tester.screen_checked = true;
	};

    // 지정된 값으로 설정하지 않고 nexacro proprerty를 기준으로 자동으로 설정하도록 새로 만듬
	nexacro.__setViewportScale = function ()
    {

        var _doc = document;
	    //var _doc = _win_handle ? _win_handle.document : document;
	    // 모바일 환경 기기별 예외처리를 위해서 직접 테스트를 수행함
	    // 1. 최초 viewport 설정시
	    // 2. 최초 orientationchange 시
	    var _tester = nexacro._device_exception_tester;
	    if (_tester.screen_checked === false)
	    {
	        nexacro._checkExceptionDevice(_tester);
	    }
        
	    //var use_autozoom = (nexacro._zoom_factor === 0 ? false : true);
        var ratio = nexacro._zoom_factor / 100;
	    var is_scalable = nexacro._allow_default_pinchzoom ? true : false;
	  
	    if (nexacro._isDesktop())
	    {
	        // desktop 환경은 autozoom 불가, pinch zoom 불가
	        //use_autozoom = false;
	        //ratio = 1.0;
	        is_scalable = false;
	    }

	    // search meta viewport
	    var elems = _doc.getElementsByName("viewport");
	    var viewport;
	    if (elems && elems[0])
	        viewport = elems[0];

	    var contents = [];
	    if (!viewport)
	    {
	        var head = _doc.getElementsByTagName("head")[0];
	        viewport = _doc.createElement("meta");
	        viewport.name = "viewport";
	        head.appendChild(viewport);

            viewport.content = "initial-scale=1.0, user-scalable=" + is_scalable;
	        contents = viewport.content.split(",");
	    }
	    else
	    {
	        contents = viewport.content.split(",");
        }

		// utility function		
	    function __remove_attribute(attr_name)
	    {
	        for (var i = 0; i < contents.length; i++)
	        {
	            var name = nexacro.trim(contents[i].split("=")[0]);
	            if (name == attr_name)
	            {
	                contents.splice(i, 1);
	                break;
	            }
	        }
	    }		

	    function __set_attribute(attr_name, attr_value)
	    {
	        var content;
	        var is_found = false;
	        if (attr_value)
	            content = attr_name + "=" + attr_value;

	        for (var i = 0; i < contents.length; i++)
	        {
	            var name = nexacro.trim(contents[i].split("=")[0]);
	            if (name == attr_name)
	            {
	                is_found = true;
	                if (content)
	                    contents[i] = content;
	                else
	                    contents.splice(i, 1);
	                break;
	            }
	        }
	        if (!is_found && content)
	            contents.push(content);
	    }
        /*
	    // Zoom이 필요 없는 경우, user-scalable등의 값도 기본값으로 세팅한다.
	    // Android 기본 브라우저 문제 때문에 index.html의 초기값에서는 일부 값들이 빠진 상태임.
	    if (ratio == 1.0)
	    {
	        if (use_autozoom === false)
	        {
	            if (is_scalable)
	            {
	                // TODO check min,max만 지정시 dpi 무시하고 최대 해상도로 표시되는지 확인이 필요
	                contents = [
                        "user-scalable=0",
                        "initial-scale=" + ratio / window.devicePixelRatio + "",
                         "target-density=device-dpi"
	                ]; //최선으로 코딩함. 다양한 케이스에대해 수정이 필요할수도있음.

	                if (minimum_scale != undefined)
	                {
	                    // minimum-scale만 지정시 초기에 이상하게 확대되어 축소가 불가능해지는 장비가 있음
	                    __set_attribute("initial-scale", minimum_scale);
	                    __set_attribute("minimum-scale", minimum_scale);
	                }
	                if (maximum_scale != undefined)
	                    __set_attribute("maximum-scale", maximum_scale);
	            }
	            else
	            {
	                // MLM Screen을 쓰지 않아 기본 크기에 해당함.
	                // scale을 지정하면 확대되거나 축소되기때문에 user-scalable만 지정하고 나머지는 제거
	                contents = [
                        "user-scalable=0",
                        "target-densitydpi=device-dpi"
	                ];

	                // iOS 버그 user-scalable=0, target-densitydpi=device-dpi 만 명시했을때
	                // orientationchange가 일어나면 화면이 이상해짐
	                if (nexacro._OS == "iOS")
	                {
	                    __set_attribute("initial-scale", "1");
	                }
	            }
	        }
	        else
	        {
	            // autozoom 사용
	            contents = [
                    "initial-scale=1.0",
                    "user-scalable=" + (is_scalable ? 1 : "no"),
                    "width=device-width",
                    "minimum-scale=" + minimum_scale,
                    "maximum-scale=" + maximum_scale,
                    "target-densitydpi=device-dpi"
	            ];
	        }

	
	        viewport.setAttribute('content', contents.toString());
	        return;
	    }
        */
        __set_attribute("user-scalable", is_scalable ? 1 : "0");  
        __set_attribute("initial-scale", ratio);

        if (nexacro._Browser == "Chrome")
            __set_attribute("minimum-scale", ratio);

        if (!nexacro._allow_default_pinchzoom && nexacro._getDeviceName() == "iPhone")
        {
            //화면이 작게 로딩되는 현상
            __set_attribute("minimum-scale", ratio);
            __set_attribute("maximum-scale", ratio);
        }

	    // 정확한 contents width 값을 모르면 iOS에서 Contents가 조그맣게 나오고
	    // 나머지 부분은 검은 공백으로 남는 현상이 있음. (iOS6)
	    var screen_width = nexacro._getScreenWidth();
	    //var screen_width = nexacro._getScreenAvailWidth();
	    if (nexacro._OS == "Android")
	    {
	        var cur_orientation = nexacro._getMobileOrientation();
	        if (cur_orientation == 2 || cur_orientation == 3)
	        {
	            // landscape 상태인데, screen w/h 값이 swap되지 않는 장비인 경우
	            // screen height를 기준으로 viewport를 설정
	            var is_swap_screen = nexacro._searchDeviceExceptionValue("swap_screen");
	            var force_swap = nexacro._searchDeviceExceptionValue("force_swap");
	            if (is_swap_screen == false || force_swap)
	            {
	                screen_width = nexacro._getScreenHeight();
	            }
	        }

	        // 일부 안드로이드 기기에서 dpi값이 없을 경우 비정상적인 크기로 확대되는 문제가 발견됨
            __set_attribute("target-densitydpi", "device-dpi");
            if (nexacro._isWebView())
            {
                if (ratio > 1)
                {
                    ratio = 1;
                    __set_attribute("initial-scale", ratio);
                    __set_attribute("minimum-scale", ratio);
                }
            }
            else
            {
                __set_attribute("width", "");
            }
           
	    }
	    else
        {
            __set_attribute("width", "");
        }
	    // 최초 Window생성과 동시에 Viewport를 세팅하는 경우에 해당함.
	    if (nexacro._getDeviceName() == "iPhone")
	    {	       
	        if (window._linked_window == undefined)
	        {	            
	            if ((nexacro._Browser == "MobileSafari" && nexacro._BrowserVersion > 10 && nexacro._BrowserVersion < 12) || 
                    (nexacro._Browser == "Chrome" && nexacro._BrowserVersion >= 73))
                {
                    var win_handle = window;
                    var win = win_handle._linked_window;
                    var old_window_width = nexacro._getWindowHandleClientWidth(win_handle);                    
                    if (win_handle.innerWidth == win_handle.document.body.clientWidth)
                    {
                        var _timeout = 0;
                        _tester._viewport_resize_observer = setInterval(function ()
                        {                            
                            var cur_window_width = nexacro._getWindowHandleClientWidth(win_handle);
                            if (old_window_width != cur_window_width || _timeout > 100)
                            {
                                clearInterval(_tester._viewport_resize_observer);
                                _tester._viewport_resize_observer = null;

                                if (!win)
                                    win = win_handle._linked_window;
                                if (win)
                                {
                                    var width = nexacro._getWindowHandleClientWidth(win_handle);
                                    var height = nexacro._getWindowHandleClientHeight(win_handle);
                                     
                                    win.setSize(width,height);
                                    win.frame._setSize(width, height, 0);
                                }
                            }
                            _timeout++;
                        }, 10);
                    }                    
                }
	            var use_windowsize_as_bodysize = nexacro._searchDeviceExceptionValue("use_windowsize_as_bodysize");
	            if (use_windowsize_as_bodysize)
	                _tester.use_windowsize_as_bodysize = true;

	        }
	    }
        
	    if (nexacro._BrowserExtra == "SamsungBrowser")// && nexacro._OSVersion >= "6.0.1") // 삼성브라우저 버그 오리엔테이션 스케일이 유지되지 않는 문제 2017.06.26
	    {
	        // [RP : 73963] 겔럭시 S7 가로모드에서 세로모드 전환시 이상 증상 수정된것을 
            // [RP : 75073]에서 문제가 발생하여 주석처리
	        //__set_attribute("initial-scale", ratio- 0.01);
	        //viewport.setAttribute('content', contents.toString());
	        //__set_attribute("initial-scale", ratio);
            
	        var tbl = nexacro._searchDeviceExceptionTable();

	        if (tbl && tbl.firsttouch_onlyonce_proc && !nexacro._is_first_touch )
	        {
	            document.addEventListener("touchstart", function (evt)
	            {
	                var curTime = (evt.timeStamp || new Date().getTime());
	                
	                if (!nexacro._last_doc_touchstart_time || (nexacro._last_doc_touchstart_time && (curTime - nexacro._last_doc_touchstart_time) < 400))
	                {
	                    // prevent double tap zooming
	                    evt.preventDefault();
	                    if (evt.srcElement instanceof HTMLInputElement)
	                    {
	                        //evt.srcElement.focus();
                            // preventDefault로 keypad 가 올라오지 않는 문제가 있어서 input에 포커스를 줌
                            setTimeout((function (n) { return function () { n.focus(); }; })(evt.srcElement), 500);
	                    }	                    
	                }
	                    
	                nexacro._last_doc_touchstart_time = curTime;
	            });

	            //document.addEventListener("touchstart", function (evt) { evt.preventDefault(); });
	            if (window && window._linked_window)
	            {
	                var _win = window._linked_window;

	                window._linked_window.frame._setSize(nexacro._getMainWindowWidth(_win), nexacro._getMainWindowHeight(_win));
	            }

	            tbl.firsttouch_onlyonce_proc = false;
	        }
            /*
	        if (nexacro._allow_default_pinchzoom)
	        {
	            __set_attribute("minimum-scale", "1");
	            __set_attribute("maximum-scale", "3");
	        }
            */
        }        
	    else if(nexacro._isHybrid())
	    {
               
	        // iOS6 Safari 환경에서 초기에 있던 min,max의 값이 min,max attribute를 제거해도 영향을 주는 것 같다.
	        // 따라서 initial-scale과 같은 값으로 설정함.
	        if (!nexacro._allow_default_pinchzoom)
	        {
	            __set_attribute("minimum-scale", ratio);
	            __set_attribute("maximum-scale", ratio);
	        }
	    }

      

	    viewport.setAttribute('content', contents.toString());
        window.scrollTo(0, 0);

        /// [RP : 73026][iOS HTML5] 세로로보다가 가로모드로 돌리면 상하단 브라우저 영역에 의해 화면이 가려지는 증상	   
        if (nexacro._OS == "iOS")// && nexacro._SystemType == "iphone")
        {
            setTimeout(function ()
            {
                var _frame = window._linked_window.frame;
                if (_frame)
                    _frame._setSize(nexacro._getWindowHandleClientWidth(window), nexacro._getWindowHandleClientHeight(window));
            }, 500);
        }
	};

	nexacro._applyDesktopScreenWidth = function ()
	{
	    nexacro._zoom_factor = (nexacro._getDeviceWidth() * 100) / Math.abs(parseInt(nexacro._desktopscreenwidth));
	};

	nexacro._device_regular_expression =
     [[

                /\((ipad|playbook);[\w\s\);-]+(rim|apple)/i                         // iPad/PlayBook
     ], ['model', 'vendor', ['type', 'tablet']], [

                /applecoremedia\/[\w\.]+ \((ipad)/                                  // iPad
     ], ['model', ['vendor', 'Apple'], ['type', 'tablet']], [

                /(apple\s{0,1}tv)/i                                                 // Apple TV
     ], [['model', 'Apple TV'], ['vendor', 'Apple']], [

                /(archos)\s(gamepad2?)/i,                                           // Archos
                /(hp).+(touchpad)/i,                                                // HP TouchPad
                /(kindle)\/([\w\.]+)/i,                                             // Kindle
                /\s(nook)[\w\s]+build\/(\w+)/i,                                     // Nook
                /(dell)\s(strea[kpr\s\d]*[\dko])/i                                  // Dell Streak
     ], ['vendor', 'model', ['type', 'tablet']], [

                /(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i                               // Kindle Fire HD
     ], ['model', ['vendor', 'Amazon'], ['type', 'tablet']], [
                /(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i                  // Fire Phone
     ], [['model', "", { 'Fire Phone': ['SD', 'KF'] }], ['vendor', 'Amazon'], ['type', 'mobile']], [

                /\((ip[honed|\s\w*]+);.+(apple)/i                                   // iPod/iPhone
     ], ['model', 'vendor', ['type', 'mobile']], [
                /\((ip[honed|\s\w*]+);/i                                            // iPod/iPhone
     ], ['model', ['vendor', 'Apple'], ['type', 'mobile']], [

                /(blackberry)[\s-]?(\w+)/i,                                         // BlackBerry
                /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,
                                                                                    // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Huawei/Meizu/Motorola/Polytron
                /(hp)\s([\w\s]+\w)/i,                                               // HP iPAQ
                /(asus)-?(\w+)/i                                                    // Asus
     ], ['vendor', 'model', ['type', 'mobile']], [
                /\(bb10;\s(\w+)/i                                                   // BlackBerry 10
     ], ['model', ['vendor', 'BlackBerry'], ['type', 'mobile']], [
                                                                                    // Asus 'tablet's
                /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7)/i
     ], ['model', ['vendor', 'Asus'], ['type', 'tablet']], [

                /(sony)\s('tablet'\s[ps])\sbuild\//i,                                  // Sony
                /(sony)?(?:sgp.+)\sbuild\//i
     ], [['vendor', 'Sony'], ['model', 'Xperia tablet'], ['type', 'tablet']],
                [
                /(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i
                ], [['vendor', 'Sony'], ['model', 'Xperia Phone'], ['type', 'mobile']], [

                /\s(ouya)\s/i,                                                      // Ouya
                /(nintendo)\s([wids3u]+)/i                                          // Nintendo
                ], ['vendor', 'model', ['type', 'console']], [

                /android.+;\s(shield)\sbuild/i                                      // Nvidia
                ], ['model', ['vendor', 'Nvidia'], ['type', 'console']], [

                /(playstation\s[34portablevi]+)/i                                   // Playstation
                ], ['model', ['vendor', 'Sony'], ['type', 'console']], [

                /(sprint\s(\w+))/i                                                  // Sprint Phones
                ], [['vendor', "", { 'HTC': 'APA', 'Sprint': 'Sprint' }], ['model', "", { 'Evo Shift 4G': '7373KT' }], ['type', 'mobile']], [

                /(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i                         // Lenovo 'tablet's
                ], ['vendor', 'model', ['type', 'tablet']], [

                /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,                               // HTC
                /(zte)-(\w+)*/i,                                                    // ZTE
                /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i
                                                                                    // Alcatel/GeeksPhone/Huawei/Lenovo/Nexian/Panasonic/Sony
                ], ['vendor', ['model', /_/g, ' '], ['type', 'mobile']], [

                /(nexus\s9)/i                                                       // HTC Nexus 9
                ], ['model', ['vendor', 'HTC'], ['type', 'tablet']], [

                /[\s\(;](xbox(?:\sone)?)[\s\);]/i                                   // Microsoft Xbox
                ], ['model', ['vendor', 'Microsoft'], ['type', 'console']], [
                /(kin\.[onetw]{3})/i                                                // Microsoft Kin
                ], [['model', /\./g, ' '], ['vendor', 'Microsoft'], ['type', 'mobile']], [

                                                                                    // Motorola
                /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,
                /mot[\s-]?(\w+)*/i,
                /(XT\d{3,4}) build\//i,
                /(nexus\s[6])/i
                ], ['model', ['vendor', 'Motorola'], ['type', 'mobile']], [
                /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
                ], ['model', ['vendor', 'Motorola'], ['type', 'tablet']], [

                /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9|nexus 10))/i,
                /((SM-T\w+))/i
                ], [['vendor', 'Samsung'], 'model', ['type', 'tablet']], [                  // Samsung
                /((s[cgp]h-\w+|SHW-\w+|SHV-\w+|gt-\w+|galaxy\snexus|sm-\w+))/i,
                /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,
                /sec-((sgh\w+))/i
                ], [['vendor', 'Samsung'], 'model', ['type', 'mobile']], [
                /(samsung);'smarttv'/i
                ], ['vendor', 'model', ['type', 'smarttv']], [

                /\(dtv[\);].+(aquos)/i                                              // Sharp
                ], ['model', ['vendor', 'Sharp'], ['type', 'smarttv']], [
                /sie-(\w+)*/i                                                       // Siemens
                ], ['model', ['vendor', 'Siemens'], ['type', 'mobile']], [

                /(maemo|nokia).*(n900|lumia\s\d+)/i,                                // Nokia
                /(nokia)[\s_-]?([\w-]+)*/i
                ], [['vendor', 'Nokia'], 'model', ['type', 'mobile']], [

                /android\s3\.[\s\w;-]{10}(a\d{3})/i                                 // Acer
                ], ['model', ['vendor', 'Acer'], ['type', 'tablet']], [

                /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i                     // LG 'tablet'
                ], [['vendor', 'LG'], 'model', ['type', 'tablet']], [
                /(lg) netcast\.tv/i                                                 // LG 'smarttv'
                ], ['vendor', 'model', ['type', 'smarttv']], [
                /(nexus\s[45])/i,                                                   // LG
                /lg[e;\s\/-]+(\w+)*/i,
                /(IM-\w+)/i
                ], ['model', ['vendor', 'LG'], ['type', 'mobile']], [

                /android.+(ideatab[a-z0-9\-\s]+)/i                                  // Lenovo
                ], ['model', ['vendor', 'Lenovo'], ['type', 'tablet']], [

                /linux;.+((jolla));/i                                               // Jolla
                ], ['vendor', 'model', ['type', 'mobile']], [

                /((pebble))app\/[\d\.]+\s/i                                         // Pebble
                ], ['vendor', 'model', ['type', 'wearable']], [

                /android.+;\s(glass)\s\d/i                                          // Google Glass
                ], ['model', ['vendor', 'Google'], ['type', 'wearable']], [

                /android.+(\w+)\s+build\/hm\1/i,                                        // Xiaomi Hongmi 'numeric' 'model's
                /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,                   // Xiaomi Hongmi
                /android.+(mi[\s\-_]*(?:one|one[\s_]plus)?[\s_]*(?:\d\w)?)\s+build/i    // Xiaomi Mi
                ], [['model', /_/g, ' '], ['vendor', 'Xiaomi'], ['type', 'mobile']], [

                /\s('tablet')[;\/]/i,                                                 // Unidentifiable 'tablet'
                /\s('mobile')[;\/]/i                                                  // Unidentifiable 'mobile'
                ], [['type', ""], 'vendor', 'model']

                /*//////////////////////////
                // TODO: move to string map
                ////////////////////////////
                /(C6603)/i                                                          // Sony Xperia Z C6603
                ], [['model', 'Xperia Z C6603'], ['vendor', 'Sony'], ['type', 'mobile']], [
                /(C6903)/i                                                          // Sony Xperia Z 1
                ], [['model', 'Xperia Z 1'], ['vendor', 'Sony'], ['type', 'mobile']], [
                /(SM-G900[F|H])/i                                                   // Samsung Galaxy S5
                ], [['model', 'Galaxy S5'], ['vendor', 'Samsung'], ['type', 'mobile']], [
                /(SM-G7102)/i                                                       // Samsung Galaxy Grand 2
                ], [['model', 'Galaxy Grand 2'], ['vendor', 'Samsung'], ['type', 'mobile']], [
                /(SM-G530H)/i                                                       // Samsung Galaxy Grand Prime
                ], [['model', 'Galaxy Grand Prime'], ['vendor', 'Samsung'], ['type', 'mobile']], [
                /(SM-G313HZ)/i                                                      // Samsung Galaxy V
                ], [['model', 'Galaxy V'], ['vendor', 'Samsung'], ['type', 'mobile']], [
                /(SM-T805)/i                                                        // Samsung Galaxy Tab S 10.5
                ], [['model', 'Galaxy Tab S 10.5'], ['vendor', 'Samsung'], ['type', 'tablet']], [
                /(SM-G800F)/i                                                       // Samsung Galaxy S5 Mini
                ], [['model', 'Galaxy S5 Mini'], ['vendor', 'Samsung'], ['type', 'mobile']], [
                /(SM-T311)/i                                                        // Samsung Galaxy Tab 3 8.0
                ], [['model', 'Galaxy Tab 3 8.0'], ['vendor', 'Samsung'], ['type', 'tablet']], [
                /(R1001)/i                                                          // Oppo R1001
                ], ['model', ['vendor', 'OPPO'], ['type', 'mobile']], [
                /(X9006)/i                                                          // Oppo Find 7a
                ], [['model', 'Find 7a'], ['vendor', 'Oppo'], ['type', 'mobile']], [
                /(R2001)/i                                                          // Oppo YOYO R2001
                ], [['model', 'Yoyo R2001'], ['vendor', 'Oppo'], ['type', 'mobile']], [
                /(R815)/i                                                           // Oppo Clover R815
                ], [['model', 'Clover R815'], ['vendor', 'Oppo'], ['type', 'mobile']], [
                 /(U707)/i                                                          // Oppo Find Way S
                ], [['model', 'Find Way S'], ['vendor', 'Oppo'], ['type', 'mobile']], [
                /(T3C)/i                                                            // Advan Vandroid T3C
                ], ['model', ['vendor', 'Advan'], ['type', 'tablet']], [
                /(ADVAN T1J\+)/i                                                    // Advan Vandroid T1J+
                ], [['model', 'Vandroid T1J+'], ['vendor', 'Advan'], ['type', 'tablet']], [
                /(ADVAN S4A)/i                                                      // Advan Vandroid S4A
                ], [['model', 'Vandroid S4A'], ['vendor', 'Advan'], ['type', 'mobile']], [
                /(V972M)/i                                                          // ZTE V972M
                ], ['model', ['vendor', 'ZTE'], ['type', 'mobile']], [
                /(i-'mobile')\s(IQ\s[\d\.]+)/i                                        // i-'mobile' IQ
                ], ['vendor', 'model', ['type', 'mobile']], [
                /(IQ6.3)/i                                                          // i-'mobile' IQ IQ 6.3
                ], [['model', 'IQ 6.3'], ['vendor', 'i-'mobile''], ['type', 'mobile']], [
                /(i-'mobile')\s(i-style\s[\d\.]+)/i                                   // i-'mobile' i-STYLE
                ], ['vendor', 'model', ['type', 'mobile']], [
                /(i-STYLE2.1)/i                                                     // i-'mobile' i-STYLE 2.1
                ], [['model', 'i-STYLE 2.1'], ['vendor', 'i-'mobile''], ['type', 'mobile']], [
                /(mobiistar touch LAI 512)/i                                        // mobiistar touch LAI 512
                ], [['model', 'Touch LAI 512'], ['vendor', 'mobiistar'], ['type', 'mobile']], [
                /////////////
                // END TODO
                ///////////*/

     ];

    //////////////////////////////////////////////////////////////////////////
    // log
	nexacro._deleteTraceLogFile = nexacro._emptyFn;
	nexacro._writeTraceLog = function (msglevel, message, bsystemlog/*, loglevel*/)
	{
	    var data;
	    data = (bsystemlog === true) ? "S" : "U";

	        if (msglevel === 0)
	        data += "F";
	        else if (msglevel == 1)
	        data += "E";
	        else if (msglevel == 2)
	        data += "W";
	        else if (msglevel == 3)
	        data += "I";
	    else
	        data += "D";

	    var curdate = new nexacro.Date();
	    var millisec = curdate.getMilliseconds();

	    data = data + " " + curdate.getHours() + ":" + curdate.getMinutes() + ":" + curdate.getSeconds() + ":" + curdate.toZeroDigitString(millisec, 3) + " ";
	    data += message;

        // IE8에서 console을 만나면 에러발생 (window.console = OK)
	    if (window.console)
	        window.console.log(data);
	};


	nexacro._applicationExit = function(is_close_window)
	{
	    window.system = null;
	    window._application = null;

	    if (is_close_window === true)
	    {
	        // 사용자가 exit 호출시 창을 닫음
	        window.open('', '_self');
	        window.close();
	    }

	    //iOS를 위한 exit()
	    if (nexacro.Device)
	    {
	        nexacro.Device.exit();
	    }

	};

    //////////////////////////////////////////////////////////////////////////
    // http
	nexacro._setUseHttpKeepAlive = nexacro._emptyFn;
	nexacro._setHttpTimeout = nexacro._emptyFn;	
	nexacro._setHttpRetry = nexacro._emptyFn;
	

    // HTML5에만 필요해서 이쪽에만 만듬.
    nexacro.__getWindowHandleEnable = function (win_handle)
    {
        if (!win_handle)
            return false;

        var _window = win_handle._linked_window;
        if (!_window)
            return false;

        if (_window._disable_ref > 0)
	        return false;

	    return true;
    };

    nexacro._setWindowHandleFocus = function (win_handle)
    {
        return;  //browser active 동작이 정상적으로 처리되지 않아 막음, runtime 고유 기능
        /*
        if (!win_handle)
            return;

        if (win_handle.setActive)
            win_handle.setActive();
        else if (win_handle.focus)
            win_handle.focus();
        */
    };
    nexacro._setWindowHandleActivate = nexacro._emptyFn;
    nexacro._setWindowHandleForeground = nexacro._emptyFn;
    if (nexacro._Browser == "Chrome")
    {
        if (nexacro._BrowserExtra == "SamsungBrowser")
        {
            nexacro.__getElementFromPoint = function (_win_handle, x, y)
            {
                var doc = _win_handle.document;
                if (!nexacro._isDesktop() && nexacro._BrowserVersion < 43) //Android Samsung Default Browser Zoom problem
                {
                     x -= _win_handle.scrollX;
                     y -= _win_handle.scrollY;
                }
                var elem_handle = doc.elementFromPoint(x, y);
                if (elem_handle)
                    return nexacro.__findParentElement(elem_handle);
                return null;
            };
        }
        else
        {
            nexacro.__getElementFromPoint = function (_win_handle, x, y)
            {
                var doc = _win_handle.document;
                if (!nexacro._isDesktop())
                {
                    x -= _win_handle.scrollX;
                    y -= _win_handle.scrollY;
                }
                var elem_handle = doc.elementFromPoint(x, y);
                if (elem_handle)
                    return nexacro.__findParentElement(elem_handle);
                return null;
            };
        }
       
    }
    else
    {
        nexacro.__getElementFromPoint = function (_win_handle, x, y)
        {
            var doc = _win_handle.document;
            if (!nexacro._isDesktop())            {
                x -= _win_handle.scrollX;
                y -= _win_handle.scrollY;
            }
            var elem_handle = doc.elementFromPoint(x, y);
            if (elem_handle)
                return nexacro.__findParentElement(elem_handle);
            return null;
        };
    }

    

    nexacro._addExtensionModule = nexacro._emptyFn;
    nexacro._loadExtensionModules = nexacro._emptyFn;     
    nexacro._deleteCacheDB = nexacro._emptyFn; //only runtime;

    ////////////////////////////////////////////////////////////////////////////////////////

    // 모바일 장비별 이상동작에 대한 예외 테이블

    // 기본값과 동일한 기기 리스트 (테이블에서 제외됨)
    // SHV-E250S / 갤럭시 노트2 / 4.1.2
    // SHV-E250S / 갤럭시 노트2 / 4.1.2 / Chrome
    // LG-F100S / 옵티머스 뷰 / 4.0.4
    // LG-F180S / 옵티머스 G / 4.1.2
    // LG-F320S / 옵티머스 G2 / 4.2.2 / Chrome
    // SHW-M440S / 갤럭시 S3 / 4.3 / Chrome
    // IM-A840S / 베가 S5 / 4.1.2
    // SonyEricssonLT15i / 아크 엑스페리아 / 4.0.4 / stock
    // Nexus 7 / 넥서스7 / 4.3 / Chrome

    nexacro._device_exception_tester = {
        init_screen_width: undefined,
        is_init_screen_portrait: undefined,
        // check flag
        screen_checked: false,
        screen_swap_checked: false,
        delayed_swap_screen_checked: false,
        // info
        swap_screen: undefined,
        delayed_swap_screen: undefined,
        swap_screen_timer: null,
        use_windowsize_as_bodysize: false
    };
    nexacro._device_exception_table = [
        {
            // 기본값
            orientationchange_reset_viewport: (nexacro._OS == "Android") ? true : false, // orientationchange시 viewport를 리셋하면 안되는 경우 false로 지정
            swap_screen: (nexacro._OS == "Android") ? true : false, // orientationchange시 screen.width,height값이 서로 swap되면 true로 지정
            delayed_reset_viewport: false,
            delayed_swap_screen: false, // <-발생 빈도가 제법 높다.
            is_portrait_device: // android phone이면 기본적으로 세로로 길쭉한 장비라고 가정함. 그외는 undefined
                (nexacro._OS == "Android") ? 
                    (((nexacro._Browser == "Runtime" && nexacro.__isPhone && nexacro.__isPhone()) || (nexacro._Browser != "Runtime" && nexacro._isMobile())) ?
                        (true) : (undefined)
                    )
                    : (undefined),
            reset_viewport_delay: 0,
            use_windowsize_as_bodysize: false,
            force_swap: false // 강제로 swap하기 위함
        },   
        {
            // Samsung Galaxy S7 Edge
            model: "SM-G935S",
            browser: "Chrome",
            use_windowsize_as_bodysize: true
        },    
        {
             // 갤럭시탭S / 5.0.2
             model: "SM-T800",
             browser: "stock",
             is_portrait_device: true,
             force_swap: true
        },
        {
                // 갤럭시탭S / 5.0.2
                model: "SM-T800",
                browser: "Chrome",
                is_portrait_device: true,
                force_swap: true
        },
        {           
            model: "SM-T820",
            browser: "samsungstock",
            is_portrait_device: true,
            use_windowsize_as_bodysize: false,
            force_swap: true
        },
        {
            // 삼성 기본브라우저 오리엔테이션 스케일 문제
            model: "ALL",
            browser: "samsungstock",
            os_version: "6.0.1",
            reset_viewport_delay: 300,
            check_overversion: true,
            is_portrait_device: true,
            use_windowsize_as_bodysize: true,
            firsttouch_onlyonce_proc: true
        },
        {
            // 갤럭시탭 10.1 / 4.0.4
            model: "SHW-M380S",
            browser: "stock",
            is_portrait_device: false
            //swap_orientation: true, // ?
        },
        {
            // 갤럭시탭 10.1 / 4.0.4
            model: "SHW-M380S",
            browser: "Chrome",
            is_portrait_device: false
            //swap_orientation: true,
        },
        {
            // LG 옵티머스 G2 기본브라우저
            model: "LG-F320S",
            browser: "stock",
	        swap_screen: false
        },
        {
            // LG 옵티머스 G2 Chrome
            model: "LG-F320S",
            browser: "Chrome",
            delayed_swap_screen: true
        },
        {
            // LG 옵티머스 G2 (Uplus) 기본브라우저가 Chrome
            model : "LG-F320L",
            browser : "Chrome",
            delayed_swap_screen: true
        },
        {
            // LG 옵티머스 G2 (KT) 
            model : "LG-F320K",
            browser : "Chrome",
            delayed_swap_screen: true
        },
        {
            // 갤럭시 S3
            model: "SHW-M440S",
            browser: "stock",
            os_version: "4.3", // 4.1.2에서는 screen width/height가 swap됨
            swap_screen: false
        },
        {
            // 갤럭시 노트2
            model: "SHV-E250S",
            browser: "stock",
            os_version: "4.4.2",
            swap_screen: false,
            use_windowsize_as_bodysize: true
        },
        {
            // 갤럭시 노트2
            model: "SHV-E250K",
            browser: "stock",
            os_version: "4.4.2",
            swap_screen: false
        },
        {
            // 갤럭시 노트2
            model: "SHV-E250L",
            browser: "stock",
            os_version: "4.4.2",
            swap_screen: false
        },
        {
            // 갤럭시 노트3
            model: "SM-N900S",
            browser: "samsungstock",
            use_windowsize_as_bodysize: true,
            swap_screen: false
        },
        {
            // 옵티머스 G3
            model: "LG-F400K",
            browser: "Chrome", // 기본 브라우저도 Chrome으로 잡히고 있다.
            delayed_swap_screen: true
        },
        {
            // 갤럭시 S4 LTE 기본브라우저
            model: "SAMSUNG SHV-E300S", // 기본 브라우저는 앞에 SAMSUNG 이 붙어있음
            browser: "Chrome", // 기본 브라우저가 Chrome으로 잡힘.
            reset_viewport_delay: 0 // 기본 브라우저는 delay처리하면 오류 발생
        },
        {
            // 갤럭시 S4 LTE 기본브라우저
            model: "SAMSUNG SHV-E300K", // 기본 브라우저는 앞에 SAMSUNG 이 붙어있음
            browser: "Chrome", // 기본 브라우저가 Chrome으로 잡힘.
            reset_viewport_delay: 0 // 기본 브라우저는 delay처리하면 오류 발생
        },
        {
            // 갤럭시 S4 LTE 기본브라우저
            model: "SAMSUNG SHV-E300L", // 기본 브라우저는 앞에 SAMSUNG 이 붙어있음
            browser: "Chrome", // 기본 브라우저가 Chrome으로 잡힘.
            reset_viewport_delay: 0 // 기본 브라우저는 delay처리하면 오류 발생
        },
        {
            // 갤럭시 S4 LTE
            model: "SHV-E300S", // 기본 브라우저는 앞에 SAMSUNG 이 붙어있음
            browser: "Chrome",
            reset_viewport_delay: 300,
            is_portrait_device: true
        },
        {
            // 갤럭시 S4 LTE (KT)
            model: "SHV-E300K",
            browser: "Chrome",
            reset_viewport_delay: 300,
            is_portrait_device: true
        },
        {
            // 갤럭시 S4 LTE (LG)
            model: "SHV-E300L",
            browser: "Chrome",
            reset_viewport_delay: 300,
            is_portrait_device: true
        },
        {
            // 갤럭시 S4 LTE-A 기본브라우저
            model: "SAMSUNG SHV-E330S", // 기본 브라우저는 앞에 SAMSUNG 이 붙어있음
            browser: "Chrome", // 기본 브라우저가 Chrome으로 잡힘.
            reset_viewport_delay: 0 // 기본 브라우저는 delay처리하면 오류 발생
        },
        {
            // 갤럭시 S4 LTE-A
            model: "SHV-E330S", // 기본 브라우저는 앞에 SAMSUNG 이 붙어있음
            browser: "Chrome",
            reset_viewport_delay: 300,
            is_portrait_device: true
        },
        {
            // 옵티머스G pro
            model: "LG-F240L",
            browser: "Chrome", // 기본 브라우저가 Chrome으로 잡힘.
            delayed_swap_screen: true
        },
        {
            // LG 베가아이언2
            model: "IM-A910K",
            browser: "Chrome", // 기본 브라우저가 Chrome으로 잡힘.
            delayed_swap_screen: true
        },       
        { }
    ];

    nexacro._searchDeviceExceptionTable = function ()
    {
        // Android에만 해당
        // Chrome이 아닌경우 기본브라우저로 판단

        if (nexacro._OS != "Android")
            return null;

        var browser;
        if (nexacro._Browser == "Chrome")
        {
            if (nexacro._BrowserExtra == "SamsungBrowser")
                browser = "samsungstock";
            else
                browser = nexacro._Browser;
        }
        else
        {
            browser = "stock";
        }

        var table = nexacro._device_exception_table;
        var len = table.length;
        for (var i = 0; i < len; i++)
        {
            if (table[i].model === undefined)
                continue;

            if (browser != table[i].browser)
                continue;

            if (table[i].os_version)
            {
                if (table[i].check_overversion)
                {
                    if (table[i].os_version > nexacro._OSVersion)
                        continue;
                }
                else
                {
                    if (table[i].os_version != nexacro._OSVersion)
                        continue;
                }
            }
            if (table[i].model == "ALL")
                return table[i];
            var userAgent = nexacro._getUserAgent();
            if (userAgent.indexOf(table[i].model) >= 0)
                return table[i];


        }

        return null;
    };

    nexacro._searchDeviceExceptionValue = function (exception_type)
    {
        var exception = nexacro._searchDeviceExceptionTable();
        if (exception && exception[exception_type] !== undefined)
        {
            return exception[exception_type];
        }

        // 모델명이 예외 테이블에 없거나, 모델은 있는데 해당 속성에 대한 정의가 없는 경우 기본값으로 리턴
        exception = nexacro._device_exception_table[0];
        return exception[exception_type];
    };

    ////////////////////////////////////////////////////////////////////////////////////////

    // Runtime Tray 관련
    nexacro._createTrayHandle = nexacro._emptyFn;
    nexacro._removeTrayHandle = nexacro._emptyFn;
    nexacro._setTrayIconHandle = nexacro._emptyFn;
    nexacro._setTrayTooltipHandle = nexacro._emptyFn;
    nexacro._showTrayBalloonTipHandle = nexacro._emptyFn;
    nexacro._createTrayPopupMenuHandle = nexacro._emptyFn;
    nexacro._destroyTrayPopupMenuHandle = nexacro._emptyFn;
    nexacro._setTrayPopupMenuItemHandle = nexacro._emptyFn;
    nexacro._displayTrayPopupMenuHandle = nexacro._emptyFn;
    nexacro._syshandler_ontray_forward = nexacro._emptyFn;


	/*
		if (nexacro._Browser == "IE")	       
        else if (nexacro._Browser == "Chrome")
        else if (nexacro._Browser == "Gecko")
        else if (nexacro._Browser == "Opera")
        else if (nexacro._Browser == "MobileSafari")
        else if (nexacro._Browser == "Safari")
        else if (nexacro._Browser == "WebKit")
	*/

	nexacro._getCSSFileName = function (cssfile)
	{
		var browser = nexacro._Browser;
		
		if (browser == "Gecko")
		{
			cssfile += "_firefox";
		}
		else if (browser == "Chrome")
		{
			cssfile += "_chrome";
		}
		else
		{			
			if (nexacro._BrowserType == "WebKit")
			{
				cssfile += "_safari";
			}
			else
			{
				cssfile += "_" + browser.toLowerCase();  //opera, ie
				if (browser == "IE" )
				{
					if (nexacro._BrowserVersion <= 8)
						cssfile += "8";
					else if (nexacro._BrowserType == "Edge")
						cssfile += "11";
					else
						cssfile += nexacro._BrowserVersion;
					/*
					if (nexacro._BrowserVersion == 9)
						cssfile += nexacro._BrowserVersion;
					if (nexacro._BrowserVersion == 9)
						cssfile += nexacro._BrowserVersion;
					else if (nexacro._BrowserVersion <= 8)
						cssfile += "8";*/


				}
			}
		}
	    return cssfile + ".css";
	};

	nexacro._getSelectedScreen = function () { };
	nexacro._getWindowRectforOpenAlign = function (/*halign, valign, parentleft, parenttop, left, top, width, height*/)
	{
		return null;
	};

	nexacro._setApplicationIcon = function (v)
	{
		var favicon = nexacro.UrlObject(v);		
		if (favicon)
		{
			var handle = document.createElement("link");			
			handle.rel = "shortcut icon";
			handle.href = favicon._sysurl;
			var headnode = document.getElementsByTagName('head')[0];
			headnode.appendChild(handle);
		}		
	};
  
	nexacro._isRunBaseWindow = nexacro._emptyFn;
	nexacro._setRunBaseWindow = nexacro._emptyFn;
	nexacro._on_apply_layered = nexacro._emptyFn;
	nexacro._flushCommand = nexacro._emptyFn;
    nexacro._updateWrapper = nexacro._emptyFn;
    nexacro._setWindowTopmost = nexacro._emptyFn;
    
} // end of (!nexacro._init_platform_HTML5)


if (_process)
{
	delete _process;

	delete _pHTMLSysEvent;
}
