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

if (!nexacro.Frame)
{
    "use strict";
    var _process = true;
    //==============================================================================
    // nexacro.Frame 
    //==============================================================================
    nexacro.Frame = function (id, left, top, width, height, right, bottom, parent, is_main)
    {
        nexacro.FormBase.call(this, id, left, top, width, height, right, bottom, null, null, null, null, parent);

        this._frames = new nexacro.Collection();

        if (parent)
            this._is_top_frame = (parent._is_application);

        this._is_main = is_main;
    };

    var _pFrame = nexacro._createPrototype(nexacro.FormBase, nexacro.Frame);
    nexacro.Frame.prototype = _pFrame;

    // overide nexacro.Object
    _pFrame._type_name = "Frame";

    _pFrame._p_titlebar = null;
    _pFrame._p_statusbar = null;
    _pFrame._p_openalign = "";

    _pFrame._p_openstatus = "normal";
    _pFrame._p_showcascadestatustext = false;
    _pFrame._p_showcascadetitletext = true;
    _pFrame._p_showstatusbar = false;
    _pFrame._p_showtitlebar = true;
    _pFrame._p_showtitleicon = true;
    _pFrame._p_statustext = "";
    _pFrame._p_titletext = "";
    _pFrame._p_topmost = false;
    _pFrame._p_statusbarheight = undefined;
    _pFrame._p_titlebarheight = undefined;
    _pFrame._p_titlebartype = "normal"; //normal or system

    _pFrame._p_titlebarbuttonsize = undefined;
    _pFrame._p_titlebarbuttongap = undefined;
    _pFrame._p_progressbardirection = undefined;
    _pFrame._p_progressbargap = undefined;
    _pFrame._p_progressbarsmooth = undefined;
    _pFrame._p_progressbarsize = undefined;

    /* event list */
    _pFrame._event_list =
    {
        "onactivate": 1, "ondeactivate": 1, "onbeforeclose": 1, "onclose": 1,
        "onkeydown": 1, "onkeyup": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmousewheel": 1,
        "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
        "onmove": 1, "onsize": 1,
        "ondevicebuttondown": 1, "ondevicebuttonpush": 1, "ondevicebuttonup": 1,
        "onsyscommand": 1,
        "onorientationchange": 1
    };

    /* internal variable */
    _pFrame._state_openstatus = 0; //normal(0), restore(1), minimize(2), maximize(3)
    _pFrame._is_click_openstatus = false; //only runtime;
    _pFrame._is_verticalmin = false;
    _pFrame._restore_position = null;
    _pFrame._starttrack_position = null;
    _pFrame._resizemode = null;
    _pFrame._defaulttitleheight = 20;
    _pFrame._defaultstatusheight = 20;
    _pFrame._titlebarheight = undefined;
    _pFrame._statusbarheight = undefined;
    _pFrame._is_frameset = false;
    _pFrame._is_frame = true;
    _pFrame._is_form = false;
    _pFrame._window = null;
    _pFrame._activate = false; // activate status : true / false  
    _pFrame._window_type = -1;
    _pFrame.accessibilityrole = "frame";
    _pFrame._is_scrollable = false;
    _pFrame._tabbar = null;

    //==============================================================================
    // nexacro.Frame Style Part
    //==============================================================================
    //not supported

    _pFrame.on_apply_font = function (font)
    {
        nexacro.Component.prototype.on_apply_font.call(this, font);

        // Frame은 font 변경되면 하위 Frame의 rem, em position 갱신 (form은 사용자가 resetscroll 호출)
        if (this._p_frames)
        {
            // frameset
            var frames = this._p_frames;
            var len = frames.length;
            for (var i = 0; i < len; i++)
            {
                if (frames[i])
                {
                    if (this._getWindow() != frames[i]._getWindow())
                        continue;

                    frames[i]._update_position();
                }
            }
        }
        else
        {
            // system font synchronize with mainframe or popupframe
            if (nexacro._Browser != "Runtime" && (this._isMainFrame() || this._is_popup_frame))
            {
                var control_elem = this.getElement();
                if (control_elem && control_elem.handle)
                {
                    var _handle = control_elem.handle;
                    control_elem._refreshControl(_handle, _handle.style);
                }
            }
        }

        // self
        this._update_position();
    };

    _pFrame.set_padding = function (/*val*/)
    {
    };

    _pFrame.set_titlebarheight = function (titlebarheight)
    {
        if (this._p_titlebarheight != titlebarheight)
        {
            this._p_titlebarheight = titlebarheight;
            this._titlebarheight = this._getAppliedTitleHeight(parseInt(titlebarheight));
            if (this._isShowTitleBar())
                this.on_apply_titlebarheight(this._titlebarheight);
        }
    };

    _pFrame.on_apply_titlebarheight = function (titlebarheight)
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            control_elem.setTitleBarControl(this._p_titlebar, titlebarheight);
        }

    };

    _pFrame.set_statusbarheight = function (statusbarheight)
    {
        if (nexacro._isHybrid && nexacro._isHybrid() && statusbarheight == "")  // StatusBarHeight를 지정하지 않은 경우 Default값으로 설정.
        {
            this._p_statusbarheight = this._defaultstatusheight;
            this._statusbarheight = this._defaultstatusheight;
            this.on_apply_statusbarheight(this._statusbarheight);
        }
        else
        {
            if (this._p_statusbarheight != statusbarheight)
            {
                this._p_statusbarheight = statusbarheight;
                this._statusbarheight = this._getAppliedStatusHeight(parseInt(statusbarheight));
                this.on_apply_statusbarheight(this._statusbarheight);
            }
        }
    };

    _pFrame.on_apply_statusbarheight = function (statusbarheight)
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            control_elem.setStatusBarControl(this._p_statusbar, statusbarheight);
        }
    };


    _pFrame.set_titlebartype = function (titlebartype)
    {
        if (this._p_titlebartype != titlebartype)
        {
            this._p_titlebartype = titlebartype;
            this.on_apply_titlebartype(titlebartype);
        }
    };

    _pFrame.on_apply_titlebartype = function (/*titlebartype*/)
    {

    };

    _pFrame.set_titlebarbuttonsize = function (titlebarbuttonsize)
    {
        if (this._p_titlebarbuttonsize != titlebarbuttonsize)
        {
            this._p_titlebarbuttonsize = titlebarbuttonsize;
            this.on_apply_titlebarbuttonsize(titlebarbuttonsize);
        }
    };

    _pFrame.on_apply_titlebarbuttonsize = function (titlebarbuttonsize)
    {

        var titlebar = this._p_titlebar;
        if (titlebar)
            titlebar.set_buttonsize(titlebarbuttonsize);
    };


    _pFrame.set_titlebarbuttongap = function (titlebarbuttongap)
    {
        titlebarbuttongap = parseInt(titlebarbuttongap);
        if (this._p_titlebarbuttongap != titlebarbuttongap)
        {
            this._p_titlebarbuttongap = titlebarbuttongap;
            this.on_apply_titlebarbuttongap(titlebarbuttongap);
        }
    };

    _pFrame.on_apply_titlebarbuttongap = function (titlebarbuttongap)
    {
        var titlebar = this._p_titlebar;
        if (titlebar)
            titlebar.set_buttongap(titlebarbuttongap);

    };

    _pFrame.set_progressbardirection = function (progressbardirection)
    {

        if (this._p_progressbardirection != progressbardirection)
        {
            this._p_progressbardirection = progressbardirection;
            this.on_apply_progressbardirection(progressbardirection);
        }
    };

    _pFrame.on_apply_progressbardirection = function (progressbardirection)
    {
        var statusbar = this._p_statusbar;
        if (statusbar)
            statusbar.set_progressbardirection(progressbardirection);
    };

    _pFrame.set_progressbargap = function (progressbargap)
    {
        progressbargap = parseInt(progressbargap);
        if (this._p_progressbargap != progressbargap)
        {
            this._p_progressbargap = progressbargap;
            this.on_apply_progressbargap(progressbargap);
        }
    };
    _pFrame.on_apply_progressbargap = function (progressbargap)
    {
        var statusbar = this._p_statusbar;
        if (statusbar)
            statusbar.set_progressbargap(progressbargap);
    };

    _pFrame.set_progressbarsmooth = function (progressbarsmooth)
    {
        progressbarsmooth = nexacro._toBoolean(progressbarsmooth);
        if (this._p_progressbarsmooth != progressbarsmooth)
        {
            this._p_progressbarsmooth = progressbarsmooth;
            this.on_apply_progressbarsmooth(progressbarsmooth);
        }
    };

    _pFrame.on_apply_progressbarsmooth = function (progressbarsmooth)
    {
        var statusbar = this._p_statusbar;
        if (statusbar)
            statusbar.set_progressbarsmooth(progressbarsmooth);
    };

    _pFrame.set_progressbarsize = function (progressbarsize)
    {
        progressbarsize = parseInt(progressbarsize);
        if (this._p_progressbarsize != progressbarsize)
        {
            this._p_progressbarsize = progressbarsize;
            this.on_apply_progressbarsize(progressbarsize);
        }
    };

    _pFrame.on_apply_progressbarsize = function (progressbarsize)
    {
        var statusbar = this._p_statusbar;
        if (statusbar)
            statusbar.set_progressbarsize(progressbarsize);
    };
    //===============================================================
    // nexacro.Frame : Create & Destroy & Update
    //===============================================================

    _pFrame._on_window_loaded = nexacro._emptyFn;

    //-----------------------------------------------------------------------------
    // XP14 API
    //-----------------------------------------------------------------------------
    _pFrame.on_created_contents = function (win)
    {
        var titlebar = this._p_titlebar;
        if (this._isShowTitleBar() && titlebar)
        {
            this._applyTitleBarProperties();
            titlebar.on_created(win);
        }

        var statusbar = this._p_statusbar;
        if (statusbar)
        {
            this._applyStatusBarProperties();
            statusbar.on_created(win);
        }
    };
    _pFrame._initComponent = function ()
    {
        this._initUniqueID();

        if (this._is_window)
        {
            nexacro._checkWindowActive(this._window);
        }
    };
    _pFrame._applyProperties = function ()
    {
        this.on_apply_prop_stringresource();
    };

    _pFrame._isShowTitleBar = function ()
    {
        return this._p_showtitlebar;
    };

    _pFrame._isShowStatusBar = function ()
    {
        return this._p_showstatusbar;
    };

    _pFrame.on_create_contents = function ()
    {
        this._p_titlebar = this._createTitleBar();
        if (this._isShowTitleBar())
            this._setNotifyTitleBar();
        // TODO check TitlebarHeight를 셋팅하는 코드가 여러번 호출됨. (setTitlebarHeight) Sequence 확인 필요..좀 정리해야할듯함
        // control_element가 생성되지 않으면 _applied_title_height는 항상 -1임.	

        if (this._isShowStatusBar())
            this._p_statusbar = this._createStatusBar();


        const app = this._getRootObject();

        // Application과 Form 에 각각 _isLoaded 존재
        if (!app?._isLoaded())
        {
            // 초기 구동시 FocusEvent의 OldComp 정보를 맞추기 위해...
            // 일단 9.2에 맞췄지만 oldcomp = undefined가 맞는것 같다.
            // TODO 스펙 재검토 후 삭제

            this._on_focus(true);
        }
    };

    _pFrame.on_created = function (_window)
    {
        var is_created = this._is_created;

        var titlebar = this._p_titlebar;
        if (this._isShowTitleBar() && titlebar)
            this._applyTitleBarProperties();

        var statusbar = this._p_statusbar;
        if (statusbar)
            this._applyStatusBarProperties();

        if (nexacro._isEmbedded)
        {
            if (this._p_form)
            {
                if (this._p_form._control_element)
                {
                    // embedded local form load는 frame created 이전에 처리
                    this._p_form._on_load(this, this._url);
                }
            }

            nexacro.FormBase.prototype.on_created.call(this, _window);
        }
        else
        {
            nexacro.FormBase.prototype.on_created.call(this, _window);

            if (this._p_form)
            {
                if (this._p_form._control_element)
                {
                    // frame.init으로 form이 미리 로드된 상황
                    // 이후 show/showModeless 등에 의해 frame.on_created 처리중
                    this._p_form._on_load(this, this._url);
                }
            }
        }

        if (!is_created && this._state_openstatus != 0)
        {
            var cur_enableevent = this._p_enableevent;
            var cur_openstatus = this._p_openstatus;

            this._p_enableevent = false;
            this._p_openstatus = "normal";
            this._state_openstatus = 0;
            this._on_syscommand(this._control_element, cur_openstatus);

            this._p_enableevent = cur_enableevent;
        }

        // TODO check on_create에서 이동됨. ControlElem.handle까지 생성된 후 호출되어야함.
        // create & set cursor of border elem
        var control_elem = this._control_element;
        if (control_elem)
            control_elem._setResizable(this._canDragResize());

        if (this._is_window)
        {
            this._applyTitleText();
            this._applyStatusText();
        }
    };

    _pFrame.on_destroy_contents = function (callremovechild)
    {
        if (this._p_statusbar)
        {
            this._p_statusbar.destroyComponent(callremovechild);
            this._p_statusbar = null;
        }
        if (this._p_titlebar)
        {
            this._p_titlebar.destroyComponent(callremovechild);
            this._p_titlebar = null;
        }
    };

    _pFrame._createTitleBar = function ()
    {
        var titlebar = this._p_titlebar;
        if (!titlebar)
            titlebar = new nexacro.TitleBarControl("titlebar", 0, 0, this._adjust_width, 0, null, null, null, null, null, null, this);

        if (this._isTopFrame())
            titlebar._hittest_type = "caption";
        else
        {
            if (this && this._is_frame && this._is_window && this._dragmovetype != 0)
                titlebar._hittest_type = "caption";
        }
        titlebar.createComponent(true);
        return titlebar;
    };

    _pFrame._setNotifyTitleBar = function ()
    {
        var titlebar = this._p_titlebar;
        if (titlebar)
        {
            titlebar._setNotifyHandler(this, this._on_minbutton_click, this._on_maxbutton_click, this._on_normalbutton_click, this._on_closebutton_click, this._on_titlebar_dblclick);
        }
    };

    _pFrame._createStatusBar = function ()
    {
        var statusbar;
        if (this._isTopFrame())
            statusbar = new nexacro._MainStatusBarControl("statusbar", 0, 0, this._adjust_width, 0, null, null, null, null, null, null, this);
        else
        {
            statusbar = new nexacro.StatusBarControl("statusbar", 0, 0, this._adjust_width, 0, null, null, null, null, null, null, this);
        }

        statusbar.createComponent(true);

        return statusbar;
    };

    _pFrame._applyStatusBarProperties = function ()
    {
        var statusbar = this._p_statusbar;
        if (statusbar)
        {
            var value = this._p_progressbardirection;
            if (value)
                statusbar.set_progressbardirection(value);

            value = this._p_progressbargap;
            if (value != undefined)
                statusbar.set_progressbargap(value);

            value = this._p_progressbarsmooth;
            if (value)
                statusbar.set_progressbarsmooth(value);

            value = this._p_progressbarsize;
            if (value != undefined)
                statusbar.set_progressbarsize(value);

            value = this._getStatusText(this._p_showcascadestatustext);
            if (value)
                statusbar.set_text(value);

            value = this._statusbarheight !== undefined ? this._statusbarheight : (this._statusbarheight = this._getAppliedStatusHeight(this._defaultstatusheight));

            if (value)
                this.on_apply_statusbarheight(value);

            statusbar.set_resizable(this._canDragResize());
        }
    };

    _pFrame._applyTitleBarProperties = function ()
    {
        var titlebar = this._p_titlebar;
        if (titlebar)
        {

            var value = this._p_titlebarbuttonsize;
            if (value !== undefined)
                titlebar.set_buttonsize(value);

            titlebar.set_showtitleicon(this._p_showtitleicon);

            value = this._p_titlebarbuttongap;
            if (value !== undefined)
                titlebar.set_buttongap(value);

            value = this._getTitleText(this._p_showcascadetitletext);
            if (value)
                titlebar.set_text(value);

            value = this._titlebarheight !== undefined ? this._titlebarheight : (this._titlebarheight = this._getAppliedTitleHeight(this._defaulttitleheight));

            if (value)
                this.on_apply_titlebarheight(value);

            this._resetTitleAbsoluteStyle();
        }
    };
    //===============================================================
    // nexacro.Frame : Override
    //===============================================================

    _pFrame.on_changeStatus = function (changestatus, value, applystatus, currentstatus, currentuserstatus)
    {
        if (changestatus == "mouseover")
            return currentstatus;

        if (changestatus == "deactivate")// && value == true))
        {
            this._changeStateActivate(value ? false : true);
            return value ? "deactivate" : "activate";
        }
        else
        {
            if (changestatus == "disabled" && value == true)
                return "disabled";
            if (changestatus == "focused")
            {
                if (value != false)
                {
                    var win = this._getWindow();
                    if (win._is_active_window == false)
                    {
                        this._changeStateFocus(true);
                        return "deactivate";
                    }
                    else
                        this._changeStateActivate(true);
                }
            }
            else
            {
                this._changeStateActivate(true);
            }//  if (changestatus == "focused" || value != false))		    
            return "enable";
        }


        /*if (changestatus == "deactivate" && value == false)
            return "enable";
        return applystatus;*/
    };

    _pFrame.on_apply_status = function (status, userstatus)
    {
        if (status == "deactivate")
            this._changeStateActivate(false);
        else if (status == "enabled" || status == "focused" || userstatus == "pushed")
        {
            this._changeStateActivate(true);
        }
    };

    _pFrame.setFocus = function (bResetScroll)
    {
        var win = this._window;
        if (this._is_window && win && win.handle)
        {
            win._setFocus();
        }
        else
        {
            if (this._active_frame)
                this._active_frame.setFocus();
            else if (this._p_form)
                this._p_form._setFocus();
        }
    };

    _pFrame._update_position = function (bsize, bmove)
    {
        // windowed frame인 경우 adjust_left,top값은 0,0으로 보정하고 있기때문에
        // _left, _top을 비교기준으로 처리함.

        var old_left = this._left;
        var old_top = this._top;
        var old_width = this._adjust_width;
        var old_height = this._adjust_height;
        var update = false;

        if (this._is_window && this._window)
        {
            this._adjustPosition(this._p_left, this._p_top, this._p_right, this._p_bottom, this._p_width, this._p_height, 0, 0);
        }
        else
        {
            if (this._p_parent)
                this._adjustPosition(this._p_left, this._p_top, this._p_right, this._p_bottom, this._p_width, this._p_height, this._p_parent._getClientWidth(), this._p_parent._getClientHeight());
            else
                this._adjustPosition(this._p_left, this._p_top, this._p_right, this._p_bottom, this._p_width, this._p_height, 0, 0);
        }
        if (this._adjust_width != old_width || this._adjust_height != old_height)
        {
            bsize = true;

            if (old_width == 0 || old_height == 0)
                update = true;
        }
        if (this._left != old_left || this._top != old_top)
        {
            bmove = true;
        }
        //var isrtl = this._isRtl(this.parent);
        //this.on_update_position(bsize, bmove, bmove ? false : isrtl);
        this.on_update_position(bsize, bmove);

        if (update)
        {
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);
        }
    };

    _pFrame._adjustPosition = function (left, top, right, bottom, width, height, parentWidth, parentHeight)
    {
        var val = null;

        var bRtl = this._isRtl();
        if (this._is_window && this._window)
        {
            // Windowed Frame 최초 생성시에는 window가 아직 없음.			
            width = parentWidth = width ? width : nexacro._getContainerHandleClientWidth(this._window.handle);
            height = parentHeight = height ? height : nexacro._getContainerHandleClientHeight(this._window.handle);
        }
        else
        {
            var parent = this._p_parent;
            if (parent)
            {
                parentWidth = parent._getClientWidth();
                parentHeight = parent._getClientHeight();
            }
        }

        var _left = left;
        var _right = right;

        for (var i = 0; i < 6; i++)
        {
            switch (i)
            {
                case 0:
                    val = _left;
                    if (_left != null)
                    {
                        if (i % 2 == 0) val = this._convToPixel(_left, parentWidth);
                        else val = this._convToPixel(_left, parentHeight);
                    }
                    if (nexacro._isNumber(val) || val === null)
                    {
                        this._p_left = left;
                        this._left = val;
                        this._adjust_left = val;
                    }
                    break;
                case 1:
                    val = top;
                    if (top != null)
                    {
                        if (i % 2 == 0) val = this._convToPixel(top, parentWidth);
                        else val = this._convToPixel(top, parentHeight);
                    }

                    if (nexacro._isNumber(val) || val === null)
                    {
                        this._p_top = top;
                        this._top = val;
                        this._adjust_top = val;
                    }
                    break;
                case 2:
                    val = _right;
                    if (_right != null)
                    {
                        if (i % 2 == 0) val = this._convToPixel(_right, parentWidth);
                        else val = this._convToPixel(_right, parentHeight);
                    }

                    if (nexacro._isNumber(val) || val === null)
                    {
                        this._p_right = right;
                        this._right = val;
                    }

                    break;
                case 3:
                    val = bottom;
                    if (bottom != null)
                    {
                        if (i % 2 == 0) val = this._convToPixel(bottom, parentWidth);
                        else val = this._convToPixel(bottom, parentHeight);
                    }

                    if (nexacro._isNumber(val) || val === null)
                    {
                        this._p_bottom = bottom;
                        this._bottom = val;
                    }

                    break;
                case 4:
                    val = width;
                    if (width != null)
                    {
                        if (i % 2 == 0) val = this._convToPixel(width, parentWidth);
                        else val = this._convToPixel(width, parentHeight);
                    }

                    if (nexacro._isNumber(val) || val === null)
                    {
                        this._p_width = width;
                        this._width = val;
                    }

                    break;
                case 5:
                    val = height;
                    if (height != null)
                    {
                        if (i % 2 == 0) val = this._convToPixel(height, parentWidth);
                        else val = this._convToPixel(height, parentHeight);
                    }
                    if (nexacro._isNumber(val) || val === null)
                    {
                        this._p_height = height;
                        this._height = val;
                    }

                    break;
            }
        }

        this._adjust_width = this._width != null ? this._width : parentWidth - this._left - this._right;
        this._adjust_height = this._height != null ? this._height : parentHeight - this._top - this._bottom;

        if (this._is_window && !this.__containerhandle)
            this._adjust_top = this._adjust_left = 0;
        else
        {
            if (this._left != null || this._right != null)
                this._adjust_left_ltr = this._adjust_left = this._left != null ? this._left : parentWidth - this._right - this._adjust_width;
            else
                this._adjust_left_ltr = this._adjust_left = 0;
            if (this._top != null || this._bottom != null)
                this._adjust_top = this._top != null ? this._top : parentHeight - this._bottom - this._adjust_height;
            else
                this._adjust_top = 0;

            if (bRtl)
            {
                this._adjust_left_ltr = this._right != null ? this._right : parentWidth - this._left - this._adjust_width;
            }
        }
    };

    _pFrame._waitCursor = function (wait_flag, context)
    {
        var owner_frame = this.getOwnerFrame();
        if (owner_frame)
        {
            owner_frame._waitCursor(wait_flag, context);
        }
    };

    _pFrame.on_update_position = function (resize_flag, move_flag, update)
    {
        var ret = nexacro.FormBase.prototype.on_update_position.call(this, resize_flag, move_flag, update);

        if (this._is_window && nexacro._Browser == "Runtime" || nexacro._macOSWebView)
        {
            var _window = this._window;
            if (_window)
            {
                this._initControlElementCssInfo();

                if (resize_flag && !nexacro._macOSWebView)
                {
                    _window.setSize(this._adjust_width, this._adjust_height);
                }
                if (move_flag)
                {
                    // adjustPosition에서 adjust_left,top은 0으로 보정하고 있다.
                    // (0이 아니면 내부적으로 밀리게됨)
                    _window.moveTo(this._left, this._top);
                }
            }
        }

        return ret;
    };

    //===============================================================
    // nexacro.Frame : Properties
    //===============================================================
    _pFrame.set_left = function (propVal)
    {
        if (!this._canMove())
            return;
        return nexacro.FormBase.prototype.set_left.call(this, propVal);
    };

    _pFrame.set_top = function (propVal)
    {
        if (!this._canMove())
            return;
        return nexacro.FormBase.prototype.set_top.call(this, propVal);
    };

    _pFrame.set_right = function (propVal)
    {
        // right -> move? resize?
        if (!this._canMove())
            return;
        return nexacro.FormBase.prototype.set_right.call(this, propVal);
    };

    _pFrame.set_bottom = function (propVal)
    {
        // bottom -> move? resize?
        if (!this._canMove())
            return;
        return nexacro.FormBase.prototype.set_bottom.call(this, propVal);
    };

    _pFrame.set_width = function (propVal)
    {
        if (!this._canResize())
            return;
        return nexacro.FormBase.prototype.set_width.call(this, propVal);
    };

    _pFrame.set_height = function (propVal)
    {
        if (!this._canResize())
            return;
        return nexacro.FormBase.prototype.set_height.call(this, propVal);
    };

    _pFrame.set_openstatus = function (v)
    {
        if (this._p_openstatus != v)
        {
            switch (v)
            {
                case "minimize":
                case "maximize":
                    break;
                case "normal":
                default:
                    if (this._state_openstatus == 2 || this._state_openstatus == 3)
                        v = "restore";
                    break;
            }
            this._on_syscommand(this._control_element, v);
        }
    };

    _pFrame.set_showcascadestatustext = function (v)
    {
        var showcascadestatustext = nexacro._toBoolean(v);
        if (this._p_showcascadestatustext != showcascadestatustext)
        {
            this._p_showcascadestatustext = showcascadestatustext;
            this._applyStatusText();
        }
    };

    _pFrame.set_showcascadetitletext = function (v)
    {
        var showcascadetitletext = nexacro._toBoolean(v);
        if (this._p_showcascadetitletext != showcascadetitletext)
        {
            this._p_showcascadetitletext = showcascadetitletext;
            this._applyTitleText();
        }
    };

    _pFrame.set_showstatusbar = function (v)
    {
        var showstatusbar = nexacro._toBoolean(v);
        if (this._p_showstatusbar != showstatusbar)
        {
            this._p_showstatusbar = showstatusbar;
            this.on_apply_showstatusbar(showstatusbar);
        }
    };

    _pFrame.on_apply_showstatusbar = function (bshow)
    {
        var statusbar = this._p_statusbar;
        if (bshow)
        {
            if (!statusbar)
            {
                if (this._isShowStatusBar())
                {
                    statusbar = this._p_statusbar = this._createStatusBar();
                    this._applyStatusBarProperties();
                    statusbar.on_created();
                }
            }
            else
            {
                statusbar.set_visible(true);
                this.on_apply_statusbarheight(this._statusbarheight);
            }
        }
        else
        {
            if (statusbar)
            {
                statusbar.set_visible(false);
                this.on_apply_statusbarheight(0);
            }
        }
    };

    _pFrame.set_showtitlebar = function (v)
    {
        var showtitlebar = nexacro._toBoolean(v);
        if (this._p_showtitlebar != showtitlebar)
        {
            this._p_showtitlebar = showtitlebar;
            //this._showTitleBar(showtitlebar);
            this.on_apply_showtitlebar(showtitlebar);
        }
    };

    _pFrame.on_apply_showtitlebar = function (bshow)
    {
        var titlebar = this._p_titlebar;

        if (bshow)
        {
            // Current or Default			
            if (this._isShowTitleBar())
            {
                if (!titlebar || !titlebar._is_created)
                {
                    titlebar = this._p_titlebar = this._createTitleBar();
                }

                if (!titlebar._is_created)
                {
                    this._setNotifyTitleBar();
                    this._applyTitleBarProperties();
                    titlebar.on_created();
                }
            }

            titlebar.set_visible(true);
            this.on_apply_titlebarheight(this._titlebarheight);
        }
        else
        {
            if (titlebar)
            {
                titlebar.set_visible(false);
                //titlebar.destroyComponent();
                //this.titlebar = null;
                this.on_apply_titlebarheight(0);
            }
        }

        this._applyDragMoveType();
    };

    _pFrame.set_showtitleicon = function (v)
    {
        var showtitleicon = nexacro._toBoolean(v);
        if (this._p_showtitleicon != showtitleicon)
        {
            this._p_showtitleicon = showtitleicon;
            this.on_apply_showtitleicon(showtitleicon);
        }
    };

    _pFrame.on_apply_showtitleicon = function (showtitleicon)
    {
        var titlebar = this._p_titlebar;
        if (titlebar)
            titlebar.set_showtitleicon(showtitleicon);

        this._notifyTabBarFrameState("updateitem");
    };


    _pFrame.set_statustext = function (v)
    {
        if (this._p_statustext != v)
        {
            this._p_statustext = v;
            this._applyStatusText();
        }
    };

    _pFrame.set_titletext = function (v)
    {
        if (this._p_titletext != v)
        {
            this._p_titletext = v;
            this._applyTitleText();
            this._notifyTabBarFrameState("updateitem");
        }
    };

    _pFrame.set_topmost = function (v)
    {
        var topmost = nexacro._toBoolean(v);
        if (this._p_topmost != topmost)
        {
            this._p_topmost = topmost;

            if (!this._is_window)
                return;

            var _window = this._getWindow();
            if (_window)
            {
                nexacro._setWindowTopmost(_window.handle, topmost);
            }
        }
    };

    _pFrame._applyElementVisible = function (v) // HTML visibility vs display
    {
        this._control_element.setElementDisplay(v ? "" : "none");
    };

    _pFrame.set_visible = function (v)
    {
        nexacro.FormBase.prototype.set_visible.call(this, v);

        v = nexacro._toBoolean(v);

        if (this._is_window && nexacro._Browser == "Runtime")
        {
            var _window = this._getWindow();
            if (_window)
            {
                nexacro._setPopupWindowHandleVisible(_window.handle, v);
            }
        }

        if (this._p_visible != v)
        {
            // case 'hide maximized frame'
            var parent = this._p_parent;
            if (parent && parent._is_frameset && this._state_openstatus == 3 && !v)
            {
                // maximize next
                var nextframe = parent._getNextOrderFrame(this);
                if (nextframe)
                {
                    nextframe._changeOpenStatus(3);
                }
            }
        }
        // Desktop은 autofit 대상 제외 (항상)
        //if (v && this.form && !nexacro._isDesktop())
        //{
        //	this.form._fitLayoutToParent();
        //}

        this._notifyTabBarFrameState(v ? "showitem" : "hideitem");
    };

    _pFrame._properties = [{ name: "left" }, { name: "top" }, { name: "colcount", readonly: true },
    { name: "right" }, { name: "bottom" }, { name: "width" },
    { name: "height" }, { name: "openstatus" }, { name: "showcascadestatustext" },
    { name: "showcascadetitletext" }, { name: "showstatusbar" }, { name: "showtitlebar" },
    { name: "showtitleicon" }, { name: "statustext" }, { name: "titletext" },
    { name: "topmost" }, { name: "visible" }, { name: "statusbar", readonly: true }, { name: "titlebar", readonly: true }, { name: "frames", readonly: true },
    { name: "all", readonly: true }];
    nexacro._defineProperties(_pFrame, _pFrame._properties);


    //===============================================================
    // nexacro.Frame : Methods
    //===============================================================
    _pFrame.alert = function (strText, strCaption, strType)
    {
        nexacro._alert(this, strText, strCaption, strType);
    };

    _pFrame.confirm = function (strText, strCaption, strType)
    {
        return nexacro._confirm(this, strText, strCaption, strType);
    };

    _pFrame.getHandle = function ()
    {
        //To Do
        return -1;
    };

    //only runtime api
    _pFrame.getNativeHandle = function ()
    {
        if (nexacro._Browser == "Runtime")
        {
            var _win = this._getWindow();
            if (_win)
                return nexacro._getWindowHwndHandle(_win.handle);
        }

        return undefined;
    };

    _pFrame.getOwnerFrame = function ()
    {
        // TODO check 이렇게 체크를 했는데도 runtime버젼에서 getOwnerFrame이 application이 나오는 경우가 있는데 왜?
        if (this._p_parent && this._p_parent._is_frame) // prevent 'application'
            return this._p_parent;

        return null;
    };

    _pFrame.addChild = function (id, obj)
    {
        //var ret = -1;

        if (id && id.length <= 0)
        {
            return -1;
        }

        if (!obj)
        {
            throw nexacro.MakeReferenceError(this, "reference_not_define", id);
        }

        if (this[id])
        {
            throw nexacro.MakeNativeError(this, "native_exist_id", id);
        }

        if (!obj._is_frame)
        {
            throw nexacro.MakeTypeError(this, "type_invalid", id);
        }

        obj._p_parent = this;

        if (!obj.id)
        {
            obj.id = obj._p_name = id;
        }
        else
            obj.id = id;

        this[id] = obj;
        this._p_all.add_item(id, obj);
        var idx = this._frames.add_item(id, obj);


        if (this._is_frameset)
        {
            this._p_frames.add_item(id, obj);
            this._zordermap.add_item(id, obj);

            if (this._max_frame && this._max_frame != obj && obj._state_openstatus == 3)
            {
                this._max_frame._changeOpenStatus(0);
            }

            if (this._state_openstatus == 2 || this._is_autorecalc_frame == true)
            {
                var control_elem = this._control_element;
                if (control_elem)
                    this.on_change_containerRect(this._getClientWidth(), this._getClientHeight());
            }
        }

        return idx;
    };

    _pFrame.insertChild = function (idx, id, obj)
    {
        if (id && id.length <= 0)
        {
            return -1;
        }
        if (!obj)
        {
            throw nexacro.MakeReferenceError(this, "reference_not_define", id);
        }

        if (this[id])
        {
            throw nexacro.MakeNativeError(this, "native_exist_id", id);
        }

        if (!obj._is_frame)
        {
            throw nexacro.MakeTypeError(this, "type_invalid", id);
        }

        obj._p_parent = this;
        if (!obj.id)
        {
            obj.id = obj._p_name = id;
        }
        else
            obj.id = id;

        this[id] = obj;
        this._p_all.add_item(id, obj);
        idx = this._frames.insert_item(idx, id, obj);

        // TODO insert to Z-orderMap
        // TODO check activeframe 체크rmfj

        if (this._is_frameset)
        {
            this._p_frames.insert_item(idx, id, obj);

            if (this._is_autorecalc_frame == true)
            {
                var control_elem = this._control_element;
                if (control_elem)
                    this.on_change_containerRect(this._getClientWidth(), this._getClientHeight());
            }
        }

        return idx;
    };

    _pFrame.removeChild = function (id)
    {
        if (id && id.length <= 0)
        {
            return null;
        }
        if (!this[id])
        {
            return null;
        }

        var obj = this[id];
        if (obj)
        {
            var _is_focused = false;
            var _window = this._getWindow();

            if (_window)
                _is_focused = (_window._indexOfCurrentFocusPaths(obj) > -1);

            // TODO find next order frame
            var nextframe = null;
            if (this._is_frameset && this._active_frame == obj)
            {
                nextframe = this._getNextOrderFrame(obj);
            }

            if (obj._is_frame)
            {
                // deactivate
                if (obj._activate == true)
                {
                    obj._changeStateActivate(false);

                }

                if (this._is_alive) 
                {
                    if (_window.id == obj._getWindow().id)
                    {
                        _window._removeFromCurrentFocusPath(obj, true);
                        if (_is_focused)
                            _window._last_focused_elem = this._control_element;
                    }
                }

                //open을 띄운 nexacro 에 등록된 popupframe을 삭제함 
                if (_window.id != obj._getWindow().id)
                {
                    if (nexacro._Browser == "Runtime" && (nexacro._SystemType.toLowerCase() == "win32" || nexacro._SystemType.toLowerCase() == "win64"))
                    {
                        if (obj._window_type == 5) //modal window
                        {
                            nexacro._unregisterPopupFrame(id, _window, undefined, true);
                        }
                        else
                        {
                            nexacro._unregisterPopupFrame(id, _window);
                        }
                    }
                    else
                    {
                        nexacro._unregisterPopupFrame(id, _window);
                    }

                    //nexacro._getLocalStorageforService();
                }

            }

            this._frames.remove_item(id);
            delete this[id];
            this._p_all.remove_item(id);
            if (this._is_frameset)
            {
                this._p_frames.remove_item(id);
                this._zordermap.remove_item(id);
            }

            if (this._is_alive && obj._control_element)
            {
                obj._control_element._removeFromContainer();
            }

            if (this._is_frameset)
            {
                var maximized = false;
                if (this._max_frame == obj)
                {
                    this._max_frame = null;
                    maximized = true;
                }

                if (this._active_frame == obj)
                {
                    this._active_frame = null;
                }

                if (maximized && nextframe)
                {
                    // maximize next order frame
                    nextframe._changeOpenStatus(3);
                }


            }

            if (this._is_frameset && (this._state_openstatus == 2 || this._is_autorecalc_frame == true))
            {
                var control_elem = this._control_element;
                if (control_elem)
                    this.on_change_containerRect(this._getClientWidth(), this._getClientHeight());
            }

            // Activate next frame if avail
            if (nextframe)
                nextframe.setFocus();

            if (this._window_type < 0) 	// modal인경우 titleredraw 없다.		
                this._applyTitleText();

        }
        return obj;
    };


    // openstatus=normal 일때만 동작
    _pFrame.move = function (left, top, width, height, right, bottom)
    {
        if (!this._canMove())
            return;

        this._move(left, top, width, height, right, bottom);

        // frames에 childframe 순서 변경 적용
        var owner_frame = this.getOwnerFrame();
        if (owner_frame && owner_frame._is_frameset)
        {
            owner_frame._on_child_movetrack(this);
        }
    };

    // openstatus와 무관하게 동작
    _pFrame._move = function (left, top, width, height, right, bottom)
    {
        var old_left = this._left;
        var old_top = this._top;
        var old_width = this._adjust_width;
        var old_height = this._adjust_height;
        var bsize = false, bmove = false;
        //var update = false;
        if (this._is_window && this._window)
        {
            this._adjustPosition(left, top, right, bottom, width, height, null, null);  // .open으로 들어온경우 parent가 없음			
        }
        else
        {
            if (this._p_parent)
                this._adjustPosition(left, top, right, bottom, width, height, this._p_parent._getClientWidth(), this._p_parent._getClientHeight());
            else
                this._adjustPosition(left, top, right, bottom, width, height, null, null);  // .open으로 들어온경우 parent가 없음
        }
        if (this._adjust_width != old_width || this._adjust_height != old_height)
        {
            bsize = true;
            //if (old_width == 0 || old_height == 0)
            //update = true;
        }
        if (this._left != old_left || this._top != old_top)
        {
            bmove = true;
        }

        this.on_update_position(bsize, bmove, bmove ? false : this._isRtl(this._p_parent));

    };

    _pFrame.resize = function (w, h)
    {
        if (!this._canResize())
            return;
        return nexacro.FormBase.prototype.resize.call(this, w, h);
    };


    //===============================================================
    // nexacro.Frame : Event Handlers
    //===============================================================
    _pFrame._on_titlebar_dblclick = function (obj, e)
    {
        if (this.resizable == false)
            return;

        switch (this._state_openstatus)
        {
            case 0:
                this._on_maxbutton_click();
                break;
            case 2:
            case 3:
                this._on_normalbutton_click();
                break;
        }
    };

    _pFrame._on_titlebar_starttrack = function ()
    {
        if (!this._canDragMove())
        {
            this._starttrack_position = null;
            return false;
        }

        if ((nexacro._macOSWebView && (this._is_main || this._window_type == 2)))
        {
            var _win = this._getWindow();
            this._starttrack_position = {
                left: nexacro._getWindowHandlePosX(_win.handle),
                top: nexacro._getWindowHandlePosY(_win.handle),
                width: this._adjust_width,
                height: this._adjust_height
            };
        }
        else
        {
            this._starttrack_position = {
                left: this._adjust_left_ltr,
                top: this._adjust_top,
                width: this._adjust_width,
                height: this._adjust_height
            };
        }

        var owner_frame = this.getOwnerFrame();
        if (owner_frame && owner_frame._is_frameset)
            owner_frame._on_child_starttrack(this);
    };

    _pFrame._on_titlebar_endtrack = function (x, y, dragdata)
    {
        if (this._starttrack_position == null)
            return;

        var owner_frame = this.getOwnerFrame();
        if (owner_frame && owner_frame._is_frameset)
            owner_frame._on_child_endtrack(this, x, y, dragdata);

        delete this._starttrack_position;
    };

    _pFrame._on_titlebar_movetrack = function (x, y, dragdata, windowX, windowY)
    {
        var _pos = this._starttrack_position;
        if (_pos == null)
            return;
        if (this._window_type != 0 && nexacro._Browser == "Runtime") // modal:1, modeless:2, modalasync:3, modalsync:4
        {
            // [23/02/03] - 오지현 - [RP 95662][브라우저 화면 축소후 Modal화면을 띄웠을경우 화면을 이동시키지 못하는 현상
            // nexacro._getDevicePixelRatio 값이 소수점이므로 곱셈으로 변경
            windowX = windowX * nexacro._getDevicePixelRatio(this._p_titlebar.getElement());
            windowY = windowY * nexacro._getDevicePixelRatio(this._p_titlebar.getElement());
        }

        if (!this._is_window && (windowX != undefined && windowY != undefined))
        {
            var rootinstance;
            var _win = this._getWindow();
            const ratio = nexacro._getDevicePixelRatio();
            if (_win)
            {
                rootinstance = _win.root;
            }
            if (!nexacro.ismodule)
            {
                rootinstance = rootinstance ? rootinstance : this._getApplication()?._p_mainframe;
                if (rootinstance)
                {
                    let mainframe_left = nexacro._toInt(rootinstance._p_left);
                    let mainframe_top = nexacro._toInt(rootinstance._p_top);
                    let mainframe_width = nexacro._toInt(rootinstance._adjust_width);
                    let mainframe_height = nexacro._toInt(rootinstance._adjust_height);

                    let winX = (windowX ? windowX : 0) + mainframe_left;
                    let winY = (windowY ? windowY : 0) + mainframe_top;
                    let r = mainframe_left + mainframe_width;
                    let b = mainframe_top + mainframe_height;

                    if (!(mainframe_left <= winX && r >= winX && mainframe_top <= winY && b >= winY))
                    {
                        return;
                    }
                }
            }
            else
            {

                let window_left = nexacro._toInt(nexacro._getWindowHandlePosX(_win.handle));
                let window_top = nexacro._toInt(nexacro._getWindowHandlePosY(_win.handle));
                let window_width = nexacro._toInt(nexacro._getWindowHandleClientWidth(_win.handle));
                let window_height = nexacro._toInt(nexacro._getWindowHandleClientHeight(_win.handle));

                let winX = (windowX ? windowX : 0) + window_left;
                let winY = (windowY ? windowY : 0) + window_top;
                let r = window_left + window_width;
                let b = window_top + window_height;

                if (!(window_left <= winX && r >= winX && window_top <= winY && b >= winY))
                {
                    return;
                }
            }
        }
        if (this._window_type != 0 && nexacro._Browser == "Runtime")
        {
            x = x * nexacro._getDevicePixelRatio(this._p_titlebar.getElement());
            y = y * nexacro._getDevicePixelRatio(this._p_titlebar.getElement());
        }

        // x,y -> 누적값(최초drag 위치로부터의 offset)
        if (!this._is_window || nexacro._macOSWebView)
        {
            this._move(_pos.left + x, _pos.top + y, _pos.width, _pos.height);
        }
        else if (this._is_window && (this._window_type == 5 || this._window_type == 2))
        {
            // showModalWindow or open
            var winPos = this._getWindow();
            this._move(winPos.left + x, winPos.top + y, _pos.width, _pos.height);
        }

        var owner_frame = this.getOwnerFrame();
        if (owner_frame && owner_frame._is_frameset)
            owner_frame._on_child_movetrack(this, x, y, dragdata);
    };

    _pFrame._on_border_starttrack = function (resize_cursor)
    {
        if (!this._canDragResize())
        {
            this._starttrack_position = null;
            return false;
        }

        this._starttrack_position = {
            left: this._adjust_left,
            top: this._adjust_top,
            width: this._adjust_width,
            height: this._adjust_height
        };

        if (nexacro._Browser == "Runtime" && this._window_type > 0 && this.getElement().zoom != 100)
        {
            this._starttrack_position.width = this._control_element.width;
            this._starttrack_position.height = this._control_element.height;
        }

        this._resizemode = resize_cursor;
        if (this._p_form)
            this._p_form._on_focus(true, "lbuttondown");
    };

    _pFrame._on_border_endtrack = function (x, y, dragdata)
    {
        if (this._starttrack_position == null)
            return;

        this._resizemode = null;

        delete this._starttrack_position;
    };

    _pFrame._on_border_movetrack = function (x, y, dragdata)
    {
        if (this._starttrack_position == null)
            return;


        // x,y -> 누적값(최초drag 위치로부터의 offset)
        var left, top, width, height;
        left = this._starttrack_position.left;
        top = this._starttrack_position.top;
        width = this._starttrack_position.width;
        height = this._starttrack_position.height;

        if (nexacro._Browser == "Runtime" && this._window_type > 0 && this.getElement().zoom != 100)
        {
            left /= nexacro._getDevicePixelRatio(this.getElement());
            top /= nexacro._getDevicePixelRatio(this.getElement());
        }

        // minmax
        var minmaxinfo = this._getMinMaxInfo();
        if (this._resizemode.value == "n-resize" || this._resizemode.value == "nw-resize" || this._resizemode.value == "ne-resize")
        {
            top += y;
            height -= y;
            if (height < minmaxinfo.cy)
            {
                top -= (minmaxinfo.cy - height);
                height = minmaxinfo.cy;
            }
        }
        if (this._resizemode.value == "s-resize" || this._resizemode.value == "sw-resize" || this._resizemode.value == "se-resize")
        {
            height += y;
            if (height < minmaxinfo.cy)
                height += (minmaxinfo.cy - height);
        }
        if (this._resizemode.value == "w-resize" || this._resizemode.value == "nw-resize" || this._resizemode.value == "sw-resize")
        {
            left += x;
            width -= x;
            if (width < minmaxinfo.cx)
            {
                left -= (minmaxinfo.cx - width);
                width = minmaxinfo.cx;
            }
        }
        if (this._resizemode.value == "e-resize" || this._resizemode.value == "ne-resize" || this._resizemode.value == "se-resize")
        {
            width += x;
            if (width < minmaxinfo.cx)
                width += (minmaxinfo.cx - width);
        }

        if (nexacro._Browser == "Runtime" && this._window_type > 0 && this.getElement().zoom != 100)
        {
            left *= nexacro._getDevicePixelRatio(this.getElement());
            top *= nexacro._getDevicePixelRatio(this.getElement());
            width *= nexacro._getDevicePixelRatio(this.getElement());
            height *= nexacro._getDevicePixelRatio(this.getElement());
        }

        this._move(left, top, width, height);
    };

    _pFrame.on_fire_sys_onlbuttondown = function (button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, event_bubbles, fire_comp, refer_comp, meta_key)
    {
        //this._changeStatus("deactivate", false);
        this._changeStateActivate(true);
    };


    //normal(0), restore(1), minimize(2), maximize(3)
    _pFrame._on_minbutton_click = function (obj, e)
    {
        this._is_click_openstatus = true;
        this._on_syscommand(this._control_element, "minimize", undefined, this, obj);
        this._is_click_openstatus = false;
    };

    _pFrame._on_maxbutton_click = function (obj, e)
    {
        this._is_click_openstatus = true;
        this._on_syscommand(this._control_element, "maximize", undefined, this, obj);
        this._is_click_openstatus = false;
    };

    _pFrame._on_normalbutton_click = function (obj, e)
    {
        this._is_click_openstatus = true;
        this._on_syscommand(this._control_element, "restore", undefined, this, obj);
        this._is_click_openstatus = false;
    };

    _pFrame._on_closebutton_click = function (obj, e)
    {
        var confirm_message = this._on_beforeclose();
        if (this._checkAndConfirmClose(confirm_message) == false)
            return;

        this._on_close();

        var owner_frame = this.getOwnerFrame();
        var callremovechild = true;
        if (owner_frame)
        {
            owner_frame.removeChild(this.id);
            callremovechild = false;
            if (owner_frame._control_element)
                owner_frame.on_change_containerRect(owner_frame._getClientWidth(), owner_frame._getClientHeight());
        }
        else if (this._window && this._window._parentwindowforopen && this._window_type == 2) //modeless
        {
            if (nexacro._Browser == "Runtime" && (nexacro._SystemType.toLowerCase() == "win32" || nexacro._SystemType.toLowerCase() == "win64"))
                nexacro._unregisterPopupFrame(this.id, this._window._parentwindowforopen, undefined, true);
        }


        // TODO close windowed
        if (this._is_window && this._window && this._window._is_alive)
        {
            this._window.destroy();

            if (nexacro._macOSWebView)
            {
                var params = "";
                var json = {
                    id: "0000",
                    div: "NexacroWindow",
                    method: "_closeWindow",
                    params: params
                }
                var jsonstr = JSON.stringify(json);
                if (nexacro._macOSWebView)
                    nexacro.Device.exec(jsonstr);
            }
            else if (globalThis.chrome && globalThis.chrome.webview)
            {
                var params = {};
                var method = "_closeWindow";
                var div = "NexacroWindow";
                nexacro._messageToNative(this._window.handle ? this._window.handle._hybridHandle : "0000", div, method, params, false);
            }
        }
        else
            this._destroy(callremovechild);

        if (this._control_element)
            this._control_element.destroy();
        this._control_element = null;
    };

    _pFrame._on_beforeclose = function (root_closing_comp)
    {
        if (!root_closing_comp)
        {
            root_closing_comp = this;
        }

        var msg = "";
        if (this._p_form)
        {
            // childframe's child
            var form_msg = this._p_form._on_beforeclose(root_closing_comp);
            msg = this._p_form._appendBeforeCloseMsg(msg, form_msg);
        }
        else
        {
            var child_msg, self_msg;
            if (this._p_frames)
            {
                // frameset's child
                var frames = this._p_frames;
                var len = frames.length;
                for (var i = 0; i < len; i++)
                {
                    // 같이 닫히는 popup창 메시지도 중첩
                    child_msg = frames[i]._on_beforeclose(root_closing_comp);
                    msg = this._appendBeforeCloseMsg(msg, child_msg);
                }
            }
            else if (this._p_frame)
            {
                // mainframe
                child_msg = this._p_frame._on_beforeclose(root_closing_comp);
                msg = this._appendBeforeCloseMsg(msg, child_msg);
            }
            else
            {
                // self
                self_msg = this._on_bubble_beforeclose(root_closing_comp);
                msg = this._appendBeforeCloseMsg(msg, self_msg);
            }
        }

        return msg;
    };

    _pFrame._on_close = function ()
    {
        if (this._p_form)
        {
            // childframe's child
            this._p_form._on_close();
        }
        else
        {
            if (this._p_frames)
            {
                // frameset's child
                var frames = this._p_frames;
                var len = frames.length;
                for (var i = 0; i < len; i++)
                {
                    if (frames[i])
                    {
                        if (this._getWindow() != frames[i]._getWindow())
                            continue;

                        frames[i]._on_close();
                    }
                }
            }
            else if (this._p_frame)
            {
                // mainframe's child
                this._p_frame._on_close();
            }
            else
            {
                // self
                this._on_bubble_close();
            }
        }

        return true;
    };

    // set_left, set_top, move 등을 통해 move가 가능한지 여부
    _pFrame._canMove = function ()
    {
        if (this._state_openstatus != 0)
            return false;
        return true;
    };

    _pFrame._canDragMove = function ()
    {
        ///if (nexacro._isTouchInteraction) // TODO check 허용하게 되면 maximize등에서 오류가 나는듯.(이벤트가 다르게 나옴)
        //	return false;

        if (!this._canMove())
            return false;

        // TODO check is_visible.. is_enable..

        // TODO check dragmovetype Property (none)
        if (this._dragmovetype == 0)
            return false;

        // TODO check autofitframe (mainframe's child)
        if (!this._is_window)
        {
            if (this._window_type == 1 || this._window_type == 4) // modal
                return true;

            var owner_frame = this.getOwnerFrame();
            if (owner_frame)
            {
                if (owner_frame._on_child_starttrack == undefined)
                    return false;
            }
        }

        return true;
    };

    // set_width, set_height, move, resize등을 통해 resize가 가능한지 여부
    _pFrame._canResize = function ()
    {
        if (this._state_openstatus != 0)
            return false;
        return true;
    };

    _pFrame._canDragResize = function ()
    {
        if (nexacro._isTouchInteraction) // TODO check 허용하게 되면 maximize등에서 오류가 나는듯.(이벤트가 다르게 나옴)
            return false;

        if (!this._canResize())
            return false;

        if (nexacro._Browser != "Runtime" && this._is_window) // TODO check! Resize Window
            return false;

        if (this.resizable == false)
            return false;

        // TODO check is_visible.. is_enable..

        // TODO check autofitframe (mainframe's child)
        var owner_frame = this.getOwnerFrame();
        if (owner_frame && !this._is_window && (this._window_type != 1 && this._window_type != 4))
        {
            if (owner_frame._is_autorecalc_frame)
                return false;
        }

        return true;
    };

    _pFrame._procSysCommand = function (systemcommand)
    {
        // _pFrame/_pMainFrame._on_syscommand 에서 통합분리함
        var statevalue = -1;
        switch (systemcommand)
        {
            // normal은 여기로 들어올수 없다.
            //case "normal": statevalue = 0; break;
            case "restore": statevalue = 1; break;
            case "minimize": statevalue = 2; break;
            case "maximize": statevalue = 3; break;
        }

        if (this._is_window && this._window)
        {
            if (statevalue != (-1))
                this._window._procSysCommand(statevalue);
        }

        if (statevalue == 1)
        {
            // restore 처리하는 과정을 없앰.
            // 내부 Frame의 경우 restore = normal과 같아 의미가 없다.

            // 하지만 Win32의 restore는 이전 상태 복원이므로 동작이 달라야함.
            // max에서 restore시 = normal (동일로직)
            // min에서 restore시 = normal 또는 max
            // -> 따라서 min에서 restore시만 따로 처리

            if (this._is_window && this._window && this._state_openstatus == 2)
            {
                // minimize->prestate 이므로 값을 swap 할 수 있도록 해줌.
                systemcommand = ["normal", "restore", "minimize", "maximize"][this._prestate_openstatus];
                statevalue = this._prestate_openstatus;
            }
            else
            {
                systemcommand = "normal";
                statevalue = 0;
            }
        }

        if (statevalue != (-1))
        {
            this._p_openstatus = systemcommand;
            this._changeOpenStatus(statevalue);
        }
    };

    _pFrame._on_syscommand = function (elem, systemcommand, event_bubbles, fire_comp, refer_comp)
    {
        // TODO 이벤트 버블링 다시 확인

        // 도중에 false를 리턴하면 syscommand가 적용되지 않아야 함.
        if (event_bubbles === undefined) //this is fire_comp or subcontrol
        {
            if (!refer_comp)
                refer_comp = this;
        }

        // fire self
        if (this._p_visible && this._isEnable() && this._p_enableevent)
        {
            event_bubbles = this.on_fire_syscommand(this, systemcommand);
            if (event_bubbles === false)
                return false;
        }

        // fire parent(bubble)
        if ((event_bubbles !== false) && this._p_parent && !this._p_parent._is_application && !this._p_parent._is_form)
        {
            var ret = this._p_parent._on_syscommand(elem, systemcommand, false, fire_comp ? fire_comp : this, refer_comp);
            if (ret == false)
                return false;
        }

        if (fire_comp && fire_comp != this)
            return true;

        // 최상위까지 false를 리턴하지 않았다.
        this._procSysCommand(systemcommand);
    };

    _pFrame._on_activate = function ()
    {
        // TODO check 메뉴얼상 onactivate,ondeactivate 모두 child->parent 순으로 발생한다고 되어있으나
        //            9.2런타임은 onactivate : parent->child / ondeactivate : child->parent 순으로 발생한다.
        //            일단 9.2에 맞춤. minimizechildposition(메뉴얼 오류로 보임)

        // TODO check fromobject/fromreferenceobject가 모두 자기자신이다 (9.2)


        nexacro.FormBase.prototype._on_activate.call(this);

        if (this._p_form)
            this._p_form._on_activate();
        if (this._p_titlebar)
            this._p_titlebar._changeStatus("deactivate", false);

        this._notifyTabBarFrameState("activate");

        return true;
    };

    _pFrame._on_deactivate = function ()
    {
        // TODO check fromobject/fromreferenceobject가 모두 자기자신이다 (9.2)


        if (this._p_form)
            this._p_form._on_deactivate();

        nexacro.FormBase.prototype._on_deactivate.call(this);
        if (this._p_titlebar)
            this._p_titlebar._changeStatus("deactivate", true);

        return true;
    };

    _pFrame._on_orientationchange = function (orientation)
    {
        // self
        this.on_fire_onorientationchange(orientation);

        // childframe's child
        var form = this._p_form;
        if (form)
        {
            form._on_orientationchange(orientation);
        }

        // frameset's child
        var frames = this._p_frames;
        if (frames)
        {
            var len = frames.length;
            for (var i = 0; i < len; i++)
            {
                if (frames[i])
                {
                    if (this._getWindow() != frames[i]._getWindow())
                        continue;

                    frames[i]._on_orientationchange(orientation);
                }
            }
        }

        // mainframe's child
        var frame = this._p_frame;
        if (frame)
        {
            frame._on_orientationchange(orientation);
        }

        return true;
    };

    _pFrame._getRootLayerFrame = function ()
    {
        var frame = this;
        while (frame)
        {
            if (frame._is_window)
                return frame;
            if (frame._window_type == 1 || frame._window_type == 4)
                return frame;
            if (frame.getOwnerFrame())
                frame = frame.getOwnerFrame();
            else
                break; // ??
        }
        return frame;
    };

    // Layer 내 최상단 frame인지 판단한다.
    _pFrame._isRootLayerFrame = function ()
    {
        // windowed 이거나 modal이면 true
        if (this._is_window)
            return true;
        if (this._window_type == 1 || this._window_type == 4)
            return true;

        return false;
    };

    _pFrame.on_fire_syscommand = function (obj, systemcommand)
    {
        var evt, ret;

        if (this.onsyscommand && this.onsyscommand._has_handlers)
        {
            evt = new nexacro.SysCommandEventInfo(obj, "onsyscommand", systemcommand);
            ret = this.onsyscommand._fireCheckEvent(this, evt);
            if (!ret)
                return false;
        }
        if (this._p_form && this._p_form.onsyscommand && this._p_form.onsyscommand._has_handlers)
        {
            evt = new nexacro.SysCommandEventInfo(obj, "onsyscommand", systemcommand);
            ret = this._p_form.onsyscommand._fireCheckEvent(this._p_form, evt);
            if (!ret)
                return false;
        }

        return true;
    };

    //===============================================================
    // nexacro.Frame : Logical Part
    //===============================================================    
    _pFrame._applyDragMoveType = nexacro._emptyFn;
    _pFrame.lookup = nexacro._emptyFn;
    _pFrame.lookupSetter = nexacro._emptyFn;
    _pFrame.lookupFunc = nexacro._emptyFn;

    _pFrame._setVerticalMin = function (v)
    {
        if (this._is_verticalmin == v)
            return;

        this._is_verticalmin = v;
        var control_elem = this._control_element;
        var titlebar = this._p_titlebar;
        if (control_elem)
        {
            control_elem._is_verticalmin = v;
            if (titlebar)
            {
                // title,status,form 중 top으로 올려야함.
                control_elem.bringToFrontElement(titlebar.getElement());
                //	            nexacro.ContainerElement.prototype.bringToFrontElement.call(this._control_element, this.titlebar._control_element);
            }
        }

        if (titlebar)
            titlebar._setVerticalMin(v);
    };

    _pFrame._resetTitleAbsoluteStyle = function ()
    {
        // titlebar button 제어
        var titlebar = this._p_titlebar;
        if (!titlebar)
            return;

        // MainFrame's child --> min,max disable
        // not nested + not resizable --> min,max hidden
        // nested + not resizable --> max disable
        // ownerframe fullframemaximize --> min hidden
        var _style = 0;
        var owner_frame = this.getOwnerFrame();
        var is_modal = (this._window_type == 1 || this._window_type == 4);
        if (!this._p_resizable)
        {
            if (this._isNested())
                _style |= 0x0020;
            else
                _style |= 0x0001 | 0x0002;
        }
        else
            _style |= 0x0100 | 0x0200;

        if (owner_frame && !this._isRootLayerFrame())
        {
            if (owner_frame._isTopFrame())
                _style |= 0x0010 | 0x0020 | 0x0040;

            if (owner_frame.fullframemaximize == false)
                _style |= 0x0001;
        }

        // Modal + resizable --> min hidden
        // Modal + not resizable --> min,max hidden
        if (is_modal)
        {
            _style |= 0x0001;
            if (!this.resizable)
                _style |= 0x0002;
        }

        titlebar._setAbsoluteStyle(_style, 0xffff);
    };

    _pFrame._getMinMaxInfo = function ()
    {
        // cx = 110(임의값) + border
        // cy = titlebar + statusbar + border
        var cx = 110, cy = 0;
        var border = this._getCSSStyleValue("border", this._status, this._userstatus);

        if (border)
        {
            cx += border._getBorderWidth();
            cy += border._getBorderHeight();
        }

        if (this._isShowTitleBar())
            cy += this._titlebarheight;
        if (this._isShowStatusBar())
            cy += this._statusbarheight;

        return { cx: cx, cy: cy };
    };

    //===============================================================
    _pFrame._isTopFrame = function ()
    {
        return (this._is_top_frame);
    };

    _pFrame._getWindow = function ()
    {
        if (this._is_window)
        {
            return this._window;
        }

        var parent = this._p_parent;
        if (parent)
        {
            return parent._getWindow();
        }
        return undefined;


    };

    _pFrame._isEnable = function ()
    {
        // TODO check ModalAsync시 키 입력을 막기위해 넣었으나, tab처리는 브라우저단에서 처리되는듯하다.
        return nexacro.FormBase.prototype._isEnable.call(this);
    };

    _pFrame._isNested = function ()
    {
        return !this._is_window;
    };

    _pFrame._getTitleText = function (brecursive)
    {
        return this._getStringResourceProperty(this._p_titletext);
    };

    _pFrame._applyTitleText = function ()
    {
        if (this._control_element)
        {
            var cascade = this._p_showcascadetitletext;
            var titletext = this._getTitleText(cascade);
            titletext = this._getStringResourceProperty(titletext);
            var titlebar = this._p_titlebar;
            if (titlebar)
            {
                titlebar.set_text(titletext);
            }

            if (this._isNested())
            {
                var parent = this._p_parent;
                if (parent && parent._is_frame)
                {
                    parent._applyTitleText();
                }
            }

            if (this._is_window)
            {
                this._window._setTitleText(titletext); // main
            }
        }
    };

    _pFrame._applyStatusText = function ()
    {
        if (this._control_element)
        {
            var cascade = this._p_showcascadestatustext;
            var statustext = this._getStatusText(cascade);
            statustext = this._getStringResourceProperty(statustext);
            var statusbar = this._p_statusbar;
            if (statusbar)
            {
                statusbar.set_text(statustext);
            }
            if (this._isNested())
            {
                var parent = this._p_parent;
                if (parent && parent._is_frame)
                {
                    parent._applyStatusText();
                }
            }
            //browser statusbar text 표시
            if (this._is_window)
            {
                this._window._setStatusText(statustext);
            }
        }
    };

    _pFrame._changeOpenStatus = function (cur)
    {
        var pre = this._prestate_openstatus = this._state_openstatus;
        this._state_openstatus = cur;

        // TODO check 임시
        if (cur == 1)
        {
            return; //trace("_changeOpenStatus(1) called");
        }

        // normal(0), restore(1), minimize(2), maximize(3)
        if (pre != cur)
        {
            var owner_frame = this.getOwnerFrame();
            var control_elem = this._control_element;
            // min -> ...
            if (pre == 2)
            {
                this._setVerticalMin(false);
            }

            // max -> normal/min/restore
            if (pre == 3 && !this._is_window)
            {
                if (owner_frame && owner_frame._is_frame == true && owner_frame._is_frameset == true)
                    owner_frame._max_frame = null;
            }

            // normal -> min/max
            if (pre == 0 && (cur == 2 || cur == 3))
            {
                if (!this._is_window)
                {
                    // save position value for restore
                    if (this._restore_position)
                    {
                        this._restore_position = null;
                    }

                    // TODO check object typecheck 방법?
                    if ((owner_frame && owner_frame._is_frameset && !owner_frame._is_autorecalc_frame) ||
                        (this._window_type == 1 || this._window_type == 4))
                    {
                        this._restore_position = {
                            left: this._p_left, top: this._p_top,
                            width: this._p_width, height: this._p_height,
                            right: this._p_right, bottom: this._p_bottom
                        };
                    }
                }

                if (control_elem)
                    control_elem._setResizable(false);
            }

            // min/max -> normal
            if ((pre == 2 || pre == 3) && cur == 0)
            {
                if (!this._is_window)
                {
                    var restore = this._restore_position;
                    if (restore)
                    {
                        if (pre == 2 || this._window_type == 1 || this._window_type == 4 || (owner_frame && owner_frame.restorechildpositiontype != "keepmaximizeposition"))
                            this._move(restore.left, restore.top, restore.width, restore.height, restore.right, restore.bottom);

                        this._restore_position = null;
                    }
                }

                if (control_elem)
                    control_elem._setResizable(this._canDragResize());
            }

            // normal/min -> max
            if (cur == 3 && !this._is_window)
            {
                if (owner_frame && owner_frame._is_frame == true && owner_frame._is_frameset == true)
                {
                    // 기존 max frame은 restore(normal)
                    if (owner_frame._max_frame && owner_frame._max_frame != this)
                        this._restoreMaxFrame(owner_frame._max_frame);

                    owner_frame._max_frame = this;
                }
                else if (this._window_type == 1 || this._window_type == 4)
                {
                    var win = this._getWindow();
                    this._move(0, 0, win.clientWidth, win.clientHeight);
                }
            }

            var titlebar = this._p_titlebar;
            if (titlebar && titlebar._is_created)
                titlebar._changeOpenStatus(cur);

            this._notifyTabBarFrameState(cur < 3 ? "restore" : "maximize"); // cur == 3 is maximize

            if (this._prestate_openstatus != this._state_openstatus)
            {
                // recalc layout
                if (owner_frame)
                {
                    var ownerframe_elem = owner_frame.getElement();
                    if (ownerframe_elem)
                        owner_frame.on_change_containerRect(owner_frame._getClientWidth(), owner_frame._getClientHeight());
                }
            }

            // normal/min -> max
            if (cur == 3 && !this._is_window)
            {
                // recalc layout 이후
                // bring to top & activate
                if (owner_frame && owner_frame._is_frameset == true)
                    this.setFocus();
            }

            this._p_openstatus = ["normal", "restore", "minimize", "maximize"][cur];
        }
    };

    _pFrame._changeStateActivate = function (cur)
    {
        if (this._activate == false && cur == true) // DEACTIVATE -> ACTIVATE
        {
            this._activate = cur;
            if (this._control_element)
            {
                var owner_frame = this.getOwnerFrame();
                if (owner_frame)
                {
                    var _win = this._getWindow();
                    var owner_win = owner_frame._getWindow();
                    if (_win == owner_win && this._window_type != 1)
                    {
                        owner_frame._changeStateActivate(cur, this);
                    }
                }


                this._applyTitleText();
                this._applyStatusText();
            }

            // FireEvent : Frame,Form
            //	this._changeStatus("deactivate", false);
            this._on_activate();
        }
        else if (this._activate == true && cur == false) // ACTIVATE -> DEACTIVATE
        {
            this._activate = cur;
            // FireEvent : Frame,Form
            this._on_deactivate();
        }
    };

    _pFrame._changeStateFocus = function (cur)
    {
        if (this._activate == false && cur == true) // DEACTIVATE -> ACTIVATE
        {
            if (this._control_element)
            {
                var owner_frame = this.getOwnerFrame();
                if (owner_frame)
                {
                    var _win = this._getWindow();
                    var owner_win = owner_frame._getWindow();
                    if (_win == owner_win && this._window_type != 1)
                    {
                        owner_frame._changeStateFocus(cur, this);
                    }
                }

                this._applyTitleText();
                this._applyStatusText();
            }

            // FireEvent : Frame,Form
            //	this._changeStatus("deactivate", false);			
        }
    };

    _pFrame._getAppliedTitleHeight = function (h)
    {
        if (h < 0)
            return 0;
        return nexacro._appliedTitleBarHeight(this, h);
    };

    _pFrame._getAppliedStatusHeight = function (h)
    {
        if (h < 0)
            return 0;
        return nexacro._appliedStatusBarHeight(this, h);
    };

    _pFrame._restoreMaxFrame = function (maxframe)
    {
        if (!maxframe)
            return;

        if (maxframe._control_element)
        {
            // tabbar 사용중일때 maximize 상태전환시 titlebarheight 제어 과정이 보이는 현상을 막기 위해 visible 제어
            const ownerFrame = this.getOwnerFrame();
            if (ownerFrame && ownerFrame._tabbar && ownerFrame._isShowTabBar())
            {
                maxframe._control_element.setElementVisible(false);

                nexacro._OnceCallbackTimer.callonce(this, function ()
                {
                    maxframe._control_element.setElementVisible(maxframe.visible);
                }, 100);
            }
        }
        maxframe._changeOpenStatus(0); // restore
    };

    _pFrame._notifyTabBarFrameState = function (state)
    {
        const titlebar = this._p_titlebar;
        const ownerFrame = this.getOwnerFrame();
        if (ownerFrame && ownerFrame._tabbar)
        {
            switch (state)
            {
                case "activate":
                    ownerFrame._tabbar.selectItem(this);
                    break;
                case "pinned":
                    if (titlebar)
                        titlebar._setAbsoluteStyle(0x0080, 0x8000); // disable titlebar's closebutton

                    ownerFrame._tabbar.pinItem(this);
                    break;
                case "unpinned":
                    if (titlebar)
                        titlebar._setAbsoluteStyle(0x8000, 0x0080); // enable titlebar's closebutton

                    ownerFrame._tabbar.unpinItem(this);
                    break;
                case "enable":
                    ownerFrame._tabbar.enableItem(this);
                    break;
                case "disable":
                    ownerFrame._tabbar.disableItem(this);
                    break;
                case "updateitem":
                    ownerFrame._tabbar.updateItem(this);
                    break;
                case "showitem":
                    ownerFrame._tabbar.showItem(this);
                    break;
                case "hideitem":
                    ownerFrame._tabbar.hideItem(this);
                    break;
                case "maximize":
                    if (ownerFrame._isShowTabBar())
                    {
                        this.on_apply_titlebarheight(0); // tabbar 가 보일때는 frame maximize 시 titlebar height를 0으로 설정
                        this._setBorderNoneForTabBar(true);
                    }
                    ownerFrame._tabbar.setMaximizeState(true);
                    break;
                case "restore":
                    if (ownerFrame._isShowTabBar())
                    {
                        this.on_apply_titlebarheight(this._titlebarheight); // titlebar height 복원
                        this._setBorderNoneForTabBar(false);
                    }
                    ownerFrame._tabbar.setMaximizeState(false);
                    break;
            }
        }
    };

    _pFrame._setBorderNoneForTabBar = function (isNone)
    {
        const control_elem = this._control_element;
        if (control_elem)
        {
            if (isNone)
            {
                const attachpositions = ["left", "top", "right", "bottom"];
                const borderFlags = attachpositions.map(pos => pos === this._p_parent.tabbarposition);
                control_elem.setElementBorderNone(...borderFlags);
            }
            else
            {
                control_elem.setElementBorderNone(false, false, false, false);
            }
        }
    };

    _pFrame._getWaitComponentElement = nexacro._emptyFn;
    _pFrame._accessibilityModalLock = nexacro._emptyFn;
    _pFrame._accessibilityModalUnLock = nexacro._emptyFn;

    //==============================================================================
    // nexacro.MainFrame
    //==============================================================================
    nexacro.MainFrame = function (id, left, top, width, height, right, bottom, parent)
    {
        nexacro.Frame.call(this, id, left, top, width, height, right, bottom, parent, true);
        this._openalign = null;
        this._window = new nexacro._Window(id, null, true);


    };

    var _pMainFrame = nexacro._createPrototype(nexacro.Frame, nexacro.MainFrame);
    nexacro.MainFrame.prototype = _pMainFrame;

    // overide nexacro.Object
    _pMainFrame._type_name = "MainFrame";

    _pMainFrame._p_frame = null;
    _pMainFrame._p_resizable = true;
    _pMainFrame._p_layered = false; //tranparent window 	
    _pMainFrame._p_accessibilityrole = "frame";

    /* internal variable */
    _pMainFrame._ref_comm = 0;
    _pMainFrame._defaulttitleheight = 30;
    _pMainFrame._defaultstatusheight = 30;
    _pMainFrame._is_window = true;
    _pMainFrame._is_autorecalc_frame = true;
    /* MFE ContainerHandle <div>*/
    _pMainFrame.__containerhandle = null;
    /* MFE Root Node */
    _pMainFrame._is_mfe_root = false;


    _pMainFrame.getActiveFrame = function ()
    {
        return this._p_frame;
    };

    //==============================================================================
    // nexacro.MainFrame Style Part
    //==============================================================================

    //===============================================================
    // nexacro.MainFrame : Create & Destroy & Update
    //===============================================================
    _pMainFrame.on_createBodyFrame = nexacro._emptyFn;

    _pMainFrame._initComponent = function ()
    {
        this._initUniqueID();
        this.createWindow();

        const env = this._env;
        if (env && env._p_locale)
        {
            this._on_apply_locale(env._p_locale);
        }

        if (this._is_window)
        {
            nexacro._checkWindowActive(this._window);
        }
    };
    _pMainFrame.createWindow = function ()
    {
        this.__containerhandle = this.parent ? nexacro.__MFEAPI._getContainer(this.parent ? this.parent : this) : null;

        if (this.__containerhandle != null)
            this._is_mfe_root = true;

        let _win = this._window;
        if (_win == null)
            _win = this._window = new nexacro._Window(this.name, null, true);

        _win.attachRoot(this, false, () =>
        {
            return _win.create(null, this._p_name, this._width, this._height, this._left, this._top, this._p_resizable);
        });

        // window는 그대로 생성하고 element에만 zoom을 적용한다.
        _win._setSystemMenuResizable(this._p_resizable);
        this._setSize(nexacro._getMainWindowWidth(_win), nexacro._getMainWindowHeight(_win));
    };

    _pMainFrame.createBodyFrame = function ()
    {
        this.on_createBodyFrame();
    };

    _pMainFrame.on_create_contents = function ()
    {
        nexacro.Frame.prototype.on_create_contents.call(this);

        if (this.__containerhandle)
        {
            const rect = nexacro._getContentRect(this.__containerhandle)
            this.move(rect.paddingLeft, rect.paddingTop, rect.contentsWidth, rect.contentsHeight);

        }
        if (this._p_frame)
        {
            this._p_frame._setPos(0, 0);
            this._p_frame._setSize(this._getClientWidth(), this._getClientHeight());

            this._p_frame.createComponent();

            this._p_frame._changeOpenStatus(3);
        }
    };

    _pMainFrame.on_created_contents = function (win)
    {
        nexacro.Frame.prototype.on_created_contents.call(this, win);

        if (this._p_frame)
        {
            this._p_frame.on_created(win);
        }

        var control_element = this._control_element;
        if (control_element)
        {
            control_element.setElementRtl(this._env._rtl);
        }

        // openalign
        var width = this._adjust_width;
        var height = this._adjust_height;
        var after_align_pos = this._getOpenAlignPos(this._getWindow(), this._adjust_left, this._adjust_top, width, height);
        if (after_align_pos)
        {
            this._move(after_align_pos.left, after_align_pos.top, width, height);

        }

        if (win)
            nexacro._refreshWindow(win.handle, true); // for runtime

        // for runtime
        if (control_element)
        {
            nexacro._refreshWindowRegion(win.handle, control_element.handle);
        }
    };

    _pMainFrame.destroyComponent = function ()
    {
        if (this._waitcomp)
        {
            this._waitcomp.destroy();
            this._waitcomp = null;
        }

        this._openalign = null;

        if (nexacro._com_waiting)
            nexacro._com_waiting = false;

        if (this._window && this._window._is_alive)
        {
            this._window.destroy();
            this._window = null;
        }
        else if (this._is_alive)
        {
            nexacro.Frame.prototype.destroyComponent.call(this);
        }

        return true;
    };

    _pMainFrame.on_destroy_contents = function ()
    {
        nexacro.Frame.prototype.on_destroy_contents.call(this);
        if (this._p_frame)
        {
            this._p_frame.destroyComponent();
            this._p_frame = null;
        }
    };

    _pMainFrame._on_deactivate = function ()
    {
        var window = this._getWindow();

        if (window)
        {
            window._keydown_element = null;
            window._keydown_element_list.clear();
        }

        return nexacro.Frame.prototype._on_deactivate.call(this);
    };

    _pMainFrame.on_change_containerPos = function (left, top)
    {
        var frame = this._p_frame;
        if (frame)
        {
            frame._setPos(0, 0);
        }
    };

    _pMainFrame.on_change_containerRect = function (width, height)
    {
        var frame = this._p_frame;
        if (frame)
        {
            frame._setSize(width, height);
        }
    };

    _pMainFrame.on_update_position = function (resize_flag, move_flag, update)
    {
        var ret = nexacro.FormBase.prototype.on_update_position.call(this, resize_flag, move_flag, update);

        if (this._is_window && (nexacro._Browser == "Runtime" ||
            (nexacro._allow_default_pinchzoom && !nexacro._isDesktop()) ||
            (nexacro._macOSWebView)))
        {
            var _window = this._window;
            if (_window)
            {
                if (resize_flag)
                {
                    // 모바일 Runtime인 경우 setSize는 무시 (view에 fit해야함)
                    if (nexacro._isDesktop() && update != undefined)
                        _window.setSize(this._adjust_width, this._adjust_height);
                }

                if (move_flag)
                {
                    // adjustPosition에서 adjust_left,top은 0으로 보정하고 있다.
                    // (0이 아니면 내부적으로 밀리게됨)
                    _window.moveTo(this._left, this._top);
                }
            }
        }

        return ret;
    };

    //===============================================================
    // nexacro.MainFrame : Override
    //===============================================================
    _pMainFrame._isShowTitleBar = function ()
    {
        return nexacro._isShowTitleBar(this, this._p_showtitlebar);
    };

    _pMainFrame._isShowStatusBar = function ()
    {
        return nexacro._isShowStatusBar(this, this._p_showstatusbar);
    };

    _pMainFrame._waitCursor = function (wait_flag, context)
    {
        if (this._window)
        {
            var waitcomp = this._waitcomp;
            if (wait_flag == true)
            {
                if (this._ref_comm == 0)
                {
                    nexacro._com_waiting = true;

                    if (waitcomp == null)
                    {
                        waitcomp = this._waitcomp = new nexacro._WaitControl("waitwindow", 0, 0, 0, 0, null, null, null, null, null, null, this);
                        waitcomp.createComponent();

                        waitcomp.on_created();
                    }

                    var waitcursor_imgurl = nexacro._getLoadingImageUrl();
                    waitcomp.setImage(waitcursor_imgurl);

                    this._window._updateWrapper(true);
                    this._window._cancelEvent();
                    this._window._blockImeInput(true);

                    waitcomp._setAccessibilityStatLive(true);
                    waitcomp._setAccessibilityStatHidden(false);
                    waitcomp.show();
                }
                waitcomp._addContext(context);
                this._ref_comm++;
            }
            else
            {
                this._window._updateWrapper(false);
                if (this._ref_comm > 0)
                    this._ref_comm--;

                if (waitcomp)
                {
                    waitcomp._removeContext(context);
                    if (this._ref_comm <= 0)
                    {
                        this._ref_comm = 0;
                        nexacro._com_waiting = false;
                        this._window._blockImeInput(false);
                        waitcomp.hide();
                        waitcomp._setAccessibilityStatHidden(true);
                    }
                }
            }
        }
    };

    //===============================================================
    // nexacro.MainFrame : Properties
    //===============================================================
    //Property 
    _pMainFrame.set_visible = function (v)
    {
        if (v === undefined || v === null) return;
        v = nexacro._toBoolean(v);

        if (this._p_visible != v)
        {
            nexacro.Component.prototype.set_visible.call(this, v);

            var _win = this._getRootWindow();
            if (_win && _win.handle)
            {
                nexacro._setPopupWindowHandleVisible(_win.handle, v);
            }
        }
    };

    _pMainFrame.set_openalign = function (v)
    {
        this._p_openalign = v;
        if (this._openalign == null || (this._openalign && this._openalign.value != v))
        {
            this._openalign = nexacro.AlignObject(v);
            this.on_apply_prop_openalign(this._openalign);
        }
    };

    _pMainFrame.set_resizable = function (v)
    {
        var resizable = nexacro._toBoolean(v);
        if (this._p_resizable != resizable)
        {
            this._p_resizable = resizable;
            this._resetTitleAbsoluteStyle();

            var control_elem = this._control_element;
            if (control_elem)
                control_elem._setResizable(this._canDragResize());

            var win = this._window;
            if (win)
                win._setSystemMenuResizable(resizable);
        }
    };

    _pMainFrame.set_layered = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_layered != v)
        {
            this._p_layered = v;
        }
    };


    _pMainFrame.on_apply_prop_openalign = function ()
    {
        var openalign = this._openalign;
        if (!openalign && this._is_created)
        {
            var left = this._adjust_left;
            var top = this._adjust_top;
            var width = this._adjust_width;
            var height = this._adjust_height;

            var after_align_pos = this._getOpenAlignPos(this._getWindow(), left, top, width, height);
            if (after_align_pos)
            {
                this._move(after_align_pos.left, after_align_pos.top, width, height);
            }
        }
    };

    _pMainFrame.on_apply_borderRadius = function (borderRadius)
    {
        nexacro.Component.prototype.on_apply_borderRadius.call(this, borderRadius);

        // for runtime
        var control_element = this._control_element;
        var window = this._window;
        if (control_element && window)
        {
            nexacro._refreshWindowRegion(window.handle, control_element.handle);
        }
    };

    _pMainFrame._getParentEnable = function (v)
    {
        return true;
    };

    _pMainFrame.on_apply_prop_enable = function (v)
    {
        var frame = this._p_frame;
        if (frame)
            frame._setEnable(v);
    };

    _pMainFrame.on_apply_prop_stringresource = function ()
    {
        if (!nexacro._StringResource)
            return;

        if (this._p_frame)
            this._p_frame.on_apply_prop_stringresource();
    };

    _pMainFrame.set_frame = function (v)
    {
        this._p_frame = v;
    };

    _pMainFrame._properties = [{ name: "visible" }, { name: "openalign" }, { name: "resizable" },
    { name: "layered" }, { name: "frame" }
    ];
    nexacro._defineProperties(_pMainFrame, _pMainFrame._properties);

    //===============================================================
    // nexacro.MainFrame : Methods
    //===============================================================

    //===============================================================
    // nexacro.MainFrame : Event Handlers
    //===============================================================

    _pMainFrame._on_beforeclose = function (root_closing_comp)
    {
        if (!root_closing_comp)
            root_closing_comp = this;
        var msg = nexacro.Frame.prototype._on_beforeclose.call(this, root_closing_comp);

        // append beforeexit msg
        var application = this._getApplication();
        if (application)
        {
            var application_msg = application.on_fire_onbeforeexit();
            msg = this._appendBeforeCloseMsg(msg, application_msg);
        }

        return msg;
    };

    _pMainFrame._on_syscommand = function (elem, systemcommand, event_bubbles, fire_comp, refer_comp)
    {
        if (nexacro._Browser == "Runtime" && (nexacro._SystemType.toLowerCase() == "win32" || nexacro._SystemType.toLowerCase() == "win64"))
        {
            if (this._inProcSysCommand === true)
                return;

            if (this._iscallfromresize !== true)
                this.on_fire_syscommand(this, systemcommand);
            if (fire_comp && fire_comp != this)
                return true;

            this._inProcSysCommand = true;
            this._procSysCommand(systemcommand);
            this._inProcSysCommand = false;
        }
        else
        {
            this.on_fire_syscommand(this, systemcommand);
            if (fire_comp && fire_comp != this)
                return true;

            this._procSysCommand(systemcommand);
        }
    };

    _pMainFrame._on_closebutton_click = function (obj, e)
    {
        // exit()와 중복된내용이므로 직접호출 
        var application = this._getApplication();
        if (application)
            application.exit();
    };

    //===============================================================
    // nexacro.MainFrame : Logical Part
    //===============================================================
    _pMainFrame._getOpenAlignPos = function (parent_win, left, top, width, height)
    {
        // Runtime only
        var openalign = this._openalign;
        if (openalign)
            return nexacro._getWindowRectforOpenAlign(openalign.halign, openalign.valign, parent_win.left, parent_win.top, left, top, width, height);

        return null;
    };

    _pMainFrame._changeStateActivate = function (cur)
    {
        if (cur == false)
        {
            var frame = this._p_frame;
            if (frame)
                frame._changeStateActivate(false);
        }
        //else  // DEACTIVATE -> ACTIVATE
        //{
        //	this._activate = cur;
        //	if (this._control_element)
        //	{
        //		this._applyTitleText();
        //		this._applyStatusText();
        //	}

        //	this._changeStatus("deactivate", false);
        //	this._on_activate();
        //}

        // CHANGE_FROM_TO
        nexacro.Frame.prototype._changeStateActivate.call(this, cur);
    };

    //_pMainFrame.on_changeStatus = function (changestatus, value, applystatus, currentstatus, currentuserstatus)
    //{
    //	if (changestatus == "mouseover")
    //		return currentstatus;

    //	if ((changestatus == "deactivate" && value == true))
    //	{
    //		this._changeStateActivate(false);
    //		return "deactivate";
    //	}
    //	else
    //	{
    //		if (changestatus == "disabled" && value == true)
    //			return "disabled";
    //		this._changeStateActivate(false);
    //		return "enable";
    //	}


    //	/*if (changestatus == "deactivate" && value == false)
    //		return "enable";
    //	return applystatus;*/
    //};

    _pMainFrame._getTitleText = function (brecursive)
    {
        var titletext;
        titletext = this._getStringResourceProperty(this._p_titletext);
        if (brecursive)
        {
            var frame = this.frame;
            if (frame)
            {
                var subtitletext = frame._getTitleText(true);
                subtitletext = this._getStringResourceProperty(subtitletext);
                if (subtitletext.length > 0)
                {
                    if (titletext.length > 0)
                        titletext += " - ";
                    titletext += subtitletext;
                }
            }
        }
        return titletext;
    };

    _pMainFrame._getStatusText = function (brecursive)
    {
        var statustext;
        statustext = this._p_statustext;
        if (brecursive)
        {
            var frame = this._p_frame;
            if (frame)
            {
                var substatustext = frame._getStatusText(true);
                if (substatustext.length > 0)
                {
                    if (statustext.length > 0)
                        statustext += " - ";
                    statustext += substatustext;
                }
            }
        }
        return statustext;
    };

    _pMainFrame._getWaitComponentElement = function ()
    {
        var waitComp = this._waitcomp;
        if (waitComp)
        {
            return waitComp.getElement();
        }
        return null;
    };

    _pMainFrame._on_apply_locale = function (v)
    {
        var frame = this._p_frame;
        if (frame)
        {
            frame._on_apply_locale(v);
        }
    };

    //==============================================================================
    // nexacro.ChildFrame
    //==============================================================================
    nexacro.ChildFrame = function (id, left, top, width, height, right, bottom, url, parent)
    {
        nexacro.Frame.call(this, id, left, top, width, height, right, bottom, parent);

        this._p_titlebar = new nexacro.TitleBarControl("titlebar", 0, 0, this._adjust_width, 0, null, null, null, null, null, null, this);
        this._openalign = null;
        if (url)
        {
            this.set_formurl(url);
        }
    };

    var _pChildFrame = nexacro._createPrototype(nexacro.Frame, nexacro.ChildFrame);
    nexacro.ChildFrame.prototype = _pChildFrame;

    _pChildFrame._type_name = "ChildFrame";
    _pChildFrame._p_opener = null;
    _pChildFrame._p_form = null;
    _pChildFrame._p_autosize = true;
    _pChildFrame._p_resizable = false;
    _pChildFrame._p_layered = false;
    _pChildFrame._p_showontaskbar = null; // null,true,false (null:auto)
    _pChildFrame._p_dragmovetype = "normal";
    _pChildFrame._p_overlaycolor = null;
    _pChildFrame._p_pinned = false;
    _pChildFrame._p_allowtabbaritempinbutton = true;

    /* internal variable */
    _pChildFrame._ref_comm = 0;
    _pChildFrame._waitcomp = null;
    _pChildFrame._window_type = 0; // modal:1 modeless:2 modalasync:3 modalsync:4
    _pChildFrame._dragmovetype = 1; // 0:none 1:normal 2:all

    _pChildFrame._is_popup_frame = false; // popup 상태 표시
    _pChildFrame._is_loadform_failed = false;
    _pChildFrame._init_openstatus = null;
    _pChildFrame._is_autosized = false;

    // override nexacro.Object
    _pChildFrame._close_callback = null;
    _pChildFrame._close_argument = undefined;

    _pChildFrame.widget = false;

    nexacro.ChildFrame._default_overlaycolor = nexacro.BackgroundObject("rgba(0,0,0,0.5)");

    _pChildFrame.on_apply_prop_openalign = function ()
    {
        //if (!this._openalign)
        //{
        //	//To Do
        //}
    };

    _pChildFrame.on_apply_prop_enable = function (v)
    {
        if (this._p_form)
            this._p_form._setEnable(v);

        this._notifyTabBarFrameState(v ? "enable" : "disable");
    };

    _pChildFrame.on_apply_prop_stringresource = function ()
    {
        if (!nexacro._StringResource)
            return;

        if (this._p_form)
            this._p_form.on_apply_prop_stringresource();

        this.on_apply_prop_tooltip();

        this._applyStatusText();
        this._applyTitleText();

        this.on_apply_prop_tooltip();

        if (this._env._p_enableaccessibility)
        {
            this.on_apply_prop_accessibilitylabel();
            this.on_apply_prop_accessibilitydescription();
            this.on_apply_prop_accessibilityaction();
        }
    };

    _pChildFrame.set_overlaycolor = function (val)
    {
        this._p_overlaycolor = val;
        if (val)
        {
            if (this._overlaycolor == null || this._overlaycolor.value != val)
            {
                var background = nexacro.BackgroundObject(val);
                this._overlaycolor = background;
                this.on_apply_overlaycolor(background);
            }
        }
        else
        {
            if (this._overlaycolor)
            {
                this._overlaycolor = null;
                this.on_apply_overlaycolor(null);
            }
        }
    };

    _pChildFrame.on_apply_overlaycolor = function (overlaycolor)
    {
        var modal_overlay_elem = this._modal_overlay_elem;
        if (modal_overlay_elem)
            modal_overlay_elem.setElementBackground(overlaycolor);
    };

    //===============================================================
    // nexacro.ChildFrame : Create & Destroy & Update
    //===============================================================

    _pChildFrame.on_create_contents = function ()
    {
        nexacro.Frame.prototype.on_create_contents.call(this);

        // process by loadManager
        if (this._p_form)
        {
            this._p_form._setPos(0, 0);
            this._p_form._setSize(this._getClientWidth(), this._getClientHeight());
            this._p_form.createComponent();
        }
    };

    _pChildFrame.destroyComponent = function (callremovechild)
    {
        if (this._window_type == 1 || this._window_type == 4) // modal, modalsync
        {
            this._setModalUnlock();
            this._runCallback();

            if (this._window_type == 4) // modalsync
            {
                var _win = this._getWindow();
                var _virtual_handle = this._virtual_handle;

                nexacro._unblockScript(_win._handle, _virtual_handle);
                this._virtual_handle = null;
            }
        }
        else if (this._window_type == 5) // modalWindow
        {
            this._setModalUnlock();
        }
        if (this._waitcomp)
        {
            this._waitcomp.destroy();
            this._waitcomp = null;
        }

        this._openalign = null;

        if (nexacro._com_waiting)
            nexacro._com_waiting = false;

        if (this._window && this._window._is_alive)
        {
            this._window.destroy();
            this._window = null;
            return true;
        }
        else
        {
            return nexacro.Frame.prototype.destroyComponent.call(this, callremovechild);
        }
    };

    _pChildFrame.on_destroy_contents = function (callremovechild)
    {
        // ModalAsync Callback은 Window handle close이후 timer에 의해 호출된다.
        if (this._overlaycolor)
            this._overlaycolor = null;
        if (this._waitcomp)
        {
            this._waitcomp.destroy();
            this._waitcomp = null;
        }

        nexacro.Frame.prototype.on_destroy_contents.call(this, callremovechild);

        if (this._variables)
        {
            var len = this._variables.length;
            for (var i = 0; i < len; i++)
            {
                delete this[this._variables[i]];
            }
        }

        if (this._p_form)
        {
            this._p_form.destroyComponent(callremovechild);
            this._p_form = null;
        }
    };

    // parent가 없는 frame을 open 으로 생성했을때 
    _pChildFrame._unregisterPopupFrame = function (win, closedpopupframeid)
    {
        if (this._window_type == 2)  //Modeless 일때만
            nexacro._unregisterPopupFrame(closedpopupframeid, win, true);
    };

    _pChildFrame._runCallback = function ()
    {
        var callback = this._close_callback;
        if (callback)
        {
            if (typeof (callback) == "string")
            {
                if (this.opener)
                {
                    var _call_callback_fn = this.opener[callback];
                    if (_call_callback_fn)
                    {
                        _call_callback_fn.call(this.opener, this._p_name, this._close_argument);
                    }
                }
            }
            else if (typeof (callback) == "function")
            {
                callback.call(this.opener, this._p_name, this._close_argument);
            }
        }
    };


    _pChildFrame.on_created_contents = function (win)
    {
        var left, top, calculated_size, width, height, after_align_pos, recalculated_pos;
        if (this._is_window && this._window)
        {
            var window = this._window;
            win = window;
            // showModal시 autosize를 처리함. form 로딩과 window handle 생성이 모두 완료되어야 처리가 가능하므로
            // 이 이전에 처리되거나 이 때 처리되어야 함.
            // > showModal (form:O, form.elem:X)
            // > loadedForm (form:O, form.elem:O, window:O, window.handle:X)
            // > on_created_contents (form:O, form.elem:O, window:O, window.handle:O)
            var delayedwindowpos = this._delayed_window_pos;

            if (delayedwindowpos && window.handle)
            {
                if (nexacro._OS == "Windows")
                {
                    if (this._window_type == 5 && this._p_form && this._p_form._is_loaded == true && window._prepared_flag == false)
                    {
                        left = delayedwindowpos.left;
                        top = delayedwindowpos.top;
                        calculated_size = this._getAutosizedFrameSize(true);
                        width = calculated_size.width;
                        height = calculated_size.height;

                        // openalign
                        after_align_pos = this._getOpenAlignPos(this._getWindow(), left, top, width, height);
                        if (after_align_pos)
                        {
                            left = after_align_pos.left;
                            top = after_align_pos.top;
                        }

                        recalculated_pos = this._recalcModalPosition(left, top, width, height);
                        window.moveTo(delayedwindowpos._p_left, delayedwindowpos._p_top);

                        this._move(delayedwindowpos._p_left, delayedwindowpos._p_top, recalculated_pos._p_width, recalculated_pos._p_height);
                    }
                    else
                    {
                        window.setSize(delayedwindowpos.left, delayedwindowpos.top);
                    }
                }
                else
                {
                    window.moveTo(delayedwindowpos._p_left, delayedwindowpos._p_top);
                    window.setSize(delayedwindowpos._p_width, delayedwindowpos._p_height);

                    if (this._window_type == 5 && this._p_form && this._p_form._is_loaded == true && window._prepared_flag == false)
                    {
                        this._move(delayedwindowpos._p_left, delayedwindowpos._p_top, delayedwindowpos._p_width, delayedwindowpos._p_height);
                    }
                }

                delete this._delayed_window_pos;
            }

            if (window.handle)
            {
                window._setSystemMenuResizable(this._p_resizable);
            }
        }
        else if ((this._window_type == 1 || this._window_type == 4) && this._p_form && this._p_autosize)
        {
            left = this._adjust_left;
            top = this._adjust_top;
            calculated_size = this._getAutosizedFrameSize(true);
            width = calculated_size.width;
            height = calculated_size.height;

            // openalign
            after_align_pos = this._getOpenAlignPos(this._getWindow(), left, top, width, height);
            if (after_align_pos)
            {
                left = after_align_pos.left;
                top = after_align_pos.top;
            }

            recalculated_pos = this._recalcModalPosition(left, top, width, height);
            this._move(recalculated_pos.left, recalculated_pos.top, recalculated_pos.width, recalculated_pos.height);
        }

        nexacro.Frame.prototype.on_created_contents.call(this, win);

        if (!this._formurl)
            this._changeStateActivate(true);

        // check load status no loading --> process by loadManager
        this._createForm();

    };

    _pChildFrame.on_change_containerPos = function (left, top)
    {
        if (this._p_form)
        {
            this._p_form._setPos(0, 0);
        }
    };
    _pChildFrame.on_change_containerRect = function (width, height)
    {
        if (this._p_form)
        {
            this._p_form._setSize(width, height);

            // Desktop은 autofit 대상 제외 (항상)
            //if (!nexacro._isDesktop())
            //{
            //	this.form._fitLayoutToParent();
            //}
        }

        //RTL Layout 처리 하면서 titlebar position 빵꾸난거 보정.
        if (this._p_titlebar)
        {
            this._p_titlebar._update_position(false, true);
        }
    };

    _pChildFrame._isShowTitleBar = function ()
    {
        return nexacro._isShowTitleBar(this, this._p_showtitlebar);
    };

    _pChildFrame._isShowStatusBar = function ()
    {
        return nexacro._isShowStatusBar(this, this._p_showstatusbar);
    };

    //===============================================================
    // nexacro.ChildFrame : Override
    //===============================================================
    _pChildFrame._createControlElement = function (parent_elem)
    {
        if (this._window_type == 1 || this._window_type == 4)
        {
            // modal or modalsync
            parent_elem = this._modal_overlay_elem;
        }

        var control_elem = this.getElement();
        if (!control_elem)
        {
            control_elem = this.on_create_control_element(parent_elem);
            control_elem._is_nc_element = this._is_nc_control;
        }

        return control_elem;
    };

    _pChildFrame._waitCursor = function (wait_flag, context)
    {
        if (this._isNested())
            return nexacro.Frame.prototype._waitCursor.call(this, wait_flag, context);

        if (this._window)
        {
            var waitcomp = this._waitcomp;
            if (wait_flag == true)
            {
                if (waitcomp == null)
                {
                    waitcomp = this._waitcomp = new nexacro._WaitControl("waitwindow", 0, 0, 0, 0, null, null, null, null, null, null, this);
                    waitcomp.createComponent();
                    waitcomp.on_created(this._window);
                }

                this._window._updateWrapper(true);
                if (this._ref_comm == 0)
                {
                    nexacro._com_waiting = true;

                    var waitcursor_imgurl = nexacro._getLoadingImageUrl();
                    waitcomp.setImage(waitcursor_imgurl);
                    this._window._cancelEvent();
                    this._window._blockImeInput(true);
                    waitcomp.show();
                }
                waitcomp._addContext(context);
                this._ref_comm++;
            }
            else
            {
                this._window._updateWrapper(false);
                if (this._ref_comm > 0)
                    this._ref_comm--;

                if (waitcomp)
                {
                    waitcomp._removeContext(context);
                    if (this._ref_comm <= 0)
                    {
                        this._ref_comm = 0;
                        nexacro._com_waiting = false;
                        this._window._blockImeInput(false);
                        waitcomp.hide();
                    }
                }
            }
        }
    };
    //===============================================================
    // nexacro.ChildFrame : Properties
    //===============================================================
    _pChildFrame.set_autosize = function (v)
    {
        if (this._p_autosize != v)
            this._p_autosize = nexacro._toBoolean(v);
    };

    _pChildFrame.set_dragmovetype = function (v)
    {
        if (this._p_dragmovetype != v)
        {
            // 0:none, 1:normal, 2:all			
            switch (v)
            {
                case "all": // titlebar, form, div
                    this._p_dragmovetype = v;
                    this._dragmovetype = 2;
                    break;
                case "normal": // titlebar or form
                    this._p_dragmovetype = v;
                    this._dragmovetype = 1;
                    break;
                case "none":
                    this._p_dragmovetype = v;
                    this._dragmovetype = 0;
                    break;
            }

            this._applyDragMoveType();
        }
    };

    _pChildFrame.set_openalign = function (v)
    {
        this._p_openalign = v;
        if (this._openalign == null || (this._openalign && this._openalign.value != v))
        {
            this._openalign = nexacro.AlignObject(v);
        }
    };

    _pChildFrame.set_formurl = function (url)
    {
        var realurl = nexacro._getFDLLocation(url);
        if (this._formurl != realurl)
        {
            if (this._p_form && this._p_form._control_element)
            {
                var confirm_message = this._on_beforeclose();
                if (this._checkAndConfirmClose(confirm_message) == false)
                    return;
                this._on_close();
            }

            this._p_formurl = url;
            this._formurl = realurl;
            this._is_loadform_failed = false;
            if (this._is_created)
                this._createForm();
        }
    };

    _pChildFrame.set_resizable = function (v)
    {
        var resizable = nexacro._toBoolean(v);
        if (this._p_resizable != resizable)
        {
            this._p_resizable = resizable;
            this._resetTitleAbsoluteStyle();

            if (this._control_element)
                this._control_element._setResizable(this._canDragResize());

            if (this._window)
                this._window._setSystemMenuResizable(resizable);
        }
    };

    _pChildFrame.set_layered = function (v)
    {
        var layered = nexacro._toBoolean(v);
        if (this._p_layered != layered)
        {
            this._p_layered = layered;
            nexacro._on_apply_layered(this, this._p_layered);
        }
    };

    // application open 지원 property
    _pChildFrame.set_showontaskbar = function (v)
    {
        var showontaskbar = nexacro._toBoolean(v);
        if (this._p_showontaskbar != showontaskbar)
        {
            this._p_showontaskbar = showontaskbar;
        }
    };

    _pChildFrame.set_widget = function (v)
    {
        var widget = nexacro._toBoolean(v);
        if (this._p_widget != widget)
        {
            this._p_widget = widget;
        }
    };

    _pChildFrame.set_pinned = function (v)
    {
        var pinned = nexacro._toBoolean(v);
        if (this._p_pinned != pinned)
        {
            this._p_pinned = pinned;
            this.on_apply_pinned(pinned);
        }
    };

    _pChildFrame.on_apply_pinned = function (v)
    {
        this._notifyTabBarFrameState(v ? "pinned" : "unpinned");
    }

    _pChildFrame.set_allowtabbaritempinbutton = function (v)
    {
        var allowtabbaritempinbutton = nexacro._toBoolean(v);
        if (this._p_allowtabbaritempinbutton != allowtabbaritempinbutton)
        {
            this._p_allowtabbaritempinbutton = allowtabbaritempinbutton;
            this.on_apply_allowtabbaritempinbutton();
        }
    };

    _pChildFrame.on_apply_allowtabbaritempinbutton = function ()
    {
        this._notifyTabBarFrameState("updateitem");
    };

    _pChildFrame._properties = [
        { name: "overlaycolor" },
        { name: "autosize" },
        { name: "dragmovetype" },
        { name: "openalign" },
        { name: "formurl" },
        { name: "resizable" },
        { name: "layered" },
        { name: "showontaskbar" },
        { name: "form", readonly: true },
        { name: "pinned" },
        { name: "allowtabbaritempinbutton" }
    ];
    nexacro._defineProperties(_pChildFrame, _pChildFrame._properties);

    //===============================================================
    // nexacro.ChildFrame : Methods
    //===============================================================
    _pChildFrame.init = function (id, left, top, width, height, right, bottom, strurl)
    {
        if (id)
            this.id = this._p_name = id;


        var old_left = this._adjust_left;
        var old_top = this._adjust_top;
        var old_width = this._adjust_width;
        var old_height = this._adjust_height;
        var bsize = false, bmove = false;

        if (arguments.length >= 5)
        {
            if (this._is_window && this._window)
            {
                this._adjustPosition(left, top, right, bottom, width, height);
            }
            else
            {
                this._adjustPosition(left, top, right, bottom, width, height, this._p_parent ? this._p_parent._getClientWidth() : 0, this._p_parent ? this._p_parent._getClientHeight() : 0);
            }

            if (this._adjust_width != old_width || this._adjust_height != old_height)
            {
                bsize = true;
            }
            if (this._adjust_left != old_left || this._adjust_top != old_top)
            {
                bmove = true;
            }
            this.on_update_position(bsize, bmove);
        }

        if (strurl)
        {
            this.set_formurl(strurl);
        }
    };

    _pChildFrame._addVariable = function (id, val)
    {
        this[id] = val;
        if (!this._variables) this._variables = [];
        this._variables.push(id);
    };
    // syntax
    // 1: ChildFrame.showModal(parent, arg, opener, lock)
    // 2: ChildFrame.showModal(id, parent, arg, opener, lock)
    // smilekkr;sync,async 명칭 통일로 인해 showModalAsync 형태로 바뀜;
    //_pChildFrame.showModal = function (str_id, _parent_frame, arr_arg, opener, _lockmode) 

    // --- NEW showModal 2014.01.09 ---
    // 1: ChildFrame.showModal(parent, arg, opener, callback, is_async)
    // 2: ChildFrame.showModal(id, parent, arg, opener, callback, is_async)
    // locktype 삭제 (전체 lock은 불가)
    // async모드 구분 삭제

    // is_async 임시 추가 (내부적으로 사용되지는 않음)
    _pChildFrame.showModal = function (str_id, _parent_frame, arr_arg, opener, callback, is_async)
    {
        // show modal 작업중
        if (nexacro._current_popups.length > 0)
        {
            nexacro._checkClosePopupComponent(null);
        }

        // mainWindow, wrapper control
        //var _win = this._getWindow();
        //if (_win)
        //    _win._updateWrapper(undefined, "hide");
        //this._is_popup_frame = true; 

        // TODO Widget, Tray에서 메소드 실행시 에러 발생. (사용불가)

        var ret, parent_frame, id;
        if (!(str_id instanceof nexacro.Frame || (str_id instanceof nexacro.Form)) && str_id != null)
        { // syntax 2
            this.id = id = arguments[0];
            parent_frame = arguments[1];
            this._arg = arguments[2];
            this.opener = arguments[3];
            this._close_callback = arguments[4];
        }
        else
        { // syntax 1
            id = this.id;
            parent_frame = arguments[0];
            this._arg = arguments[1];
            this.opener = arguments[2];
            this._close_callback = arguments[3];
        }



        var _win = parent_frame ? parent_frame._getWindow() : this._getWindow();
        if (_win)
        {
            // [RP 101436] - ShowModal 시 WebView의 Bitmap Image를 가져오는 경우 image 버퍼를 한번 지우는 작업 추가.
            _win._updateWrapper(undefined, "reset");
            _win._updateWrapper(undefined, "hide");
        }

        var child_frame = null;

        if (parent_frame == null)
        {
            const app = this._getRootObject();

            if (app && app._is_application)
                parent_frame = app._p_mainframe;
            else if (app)
                parent_frame = app;

        }
        if (parent_frame)
        {
            ret = parent_frame.addChild(id, this);
        }

        if (ret == -1)
        {
            if (_win)
                _win._updateWrapper(undefined, "show");

            return false;
        }
        else
            child_frame = this;

        if (child_frame && child_frame._arg)
        {
            for (var param in child_frame._arg)
            {
                child_frame._addVariable(param, child_frame._arg[param]);
            }
        }

        //use window runtime only
        var parent_window = parent_frame ? parent_frame._getWindow() : null;

        if (nexacro._registerPopupFrame(id, this, parent_window) < 0)
        {
            if (_win)
                _win._updateWrapper(undefined, "show");

            throw nexacro.MakeNativeError(this, "native_exist_id", id);
            //return false;
        }

        child_frame._is_window = false;
        child_frame._window_type = 1; // modal

        var wheelZoomScale = 1.0;
        var _window = this._getWindow(); // current window
        if (_window && (_window._wheelZoom != undefined) && (_window._wheelZoom != 100))
        {
            wheelZoomScale = _window._wheelZoom / 100.0;
        }

        var left = child_frame._adjust_left;
        var top = child_frame._adjust_top;
        var width = child_frame._adjust_width;
        var height = child_frame._adjust_height;

        if (this._p_left == null)
        {
            if ((this._p_width || this._p_right) && !(isNaN(this._p_width) || isNaN(this._p_right)))
            {
                if (_window) this._p_left = _window.clientWidth / wheelZoomScale - this._p_width - this._p_right;
            }
        }
        if (this._p_top == null)
        {
            if ((this._p_height || this._p_bottom) && !(isNaN(this._p_height) || isNaN(this._p_bottom)))
            {
                if (_window) this.top = _window.clientHeight / wheelZoomScale - this.height - this.bottom;
            }
        }
        if (this._p_width == null)
        {
            if ((this._p_left || this._p_right) && !(isNaN(this._p_left) || isNaN(this._p_right)))
            {
                if (_window) this._p_width = _window.clientWidth / wheelZoomScale - this._p_left - this._p_right;
            }
        }
        if (this._p_height == null)
        {
            if ((this._p_top || this._p_bottom) && !(isNaN(this._p_top) || isNaN(this._p_bottom)))
            {
                if (_window) this._p_height = _window.clientHeight / wheelZoomScale - this._p_top - this._p_bottom;
            }
        }
        // showModal의 경우 autosize, openalign은 한번만 처리해도 된다.
        // _loadedForm에서 처리.

        if (this._p_autosize)
        {
            // calc autosize
            var calculated_size = this._getAutosizedFrameSize(true);
            this._p_width = width = calculated_size.width;
            this._p_height = height = calculated_size.height;
        }

        // form 로딩 여부와 상관없이 openalign 처리
        var after_align_pos = child_frame._getOpenAlignPos(this._getWindow(), left, top, width, height);
        if (after_align_pos)
        {
            this._p_left = after_align_pos.left;
            this._p_top = after_align_pos.top;
        }

        if (!this.opener || (this.opener && !this.opener._is_form && !this.opener._is_application))
        {
            this.opener = parent_frame ? parent_frame._p_form : null;
        }

        if (this._p_form)
            this._p_form._p_opener = this.opener;

        var mainframe = this._getMainFrame();
        if (mainframe)
            mainframe._changeStateActivate(false, this);

        var recalculated_pos = this._recalcModalPosition((this._p_left == null) ? null : this._p_left * wheelZoomScale, (this._p_top == null) ? null : this._p_top * wheelZoomScale, this._p_width, this._p_height);
        this._p_left = recalculated_pos.left;
        this._p_top = recalculated_pos.top;
        this._p_width = recalculated_pos.width;
        this._p_height = recalculated_pos.height;

        this._setModalLock();
        this._cancelTouchEvent();
        this.createComponent(true);
        this.on_created();

        // mainWindow, wrapper control
        if (_win)
            _win._updateWrapper(undefined, "show");

        if (wheelZoomScale != 1.0)
        {
            if (this._p_form._is_loaded)
            {
                var frameElem = this.getElement();
                if (frameElem)
                {
                    frameElem.setElementZoom(_window._wheelZoom);
                    frameElem.setElementSize(frameElem._unscaledwidth, frameElem._unscaledheight, false, true);
                }
            }
            else
            {
                this._isNotProcessedWheelZoom = true;
                this.set_visible(false);
            }
        }

        return true;
    };

    _pChildFrame._showModalSync = function (str_id, _parent_frame, arr_arg, opener)
    {
        //this._is_popup_frame = true; 

        // TODO Widget, Tray에서 메소드 실행시 에러 발생. (사용불가)

        var ret, parent_frame, id;
        if (!(str_id instanceof nexacro.Frame) && str_id != null)
        { // syntax 2
            this.id = id = arguments[0];
            parent_frame = arguments[1];
            this._arg = arguments[2];
            this.opener = arguments[3];
        }
        else
        { // syntax 1
            id = this.id;
            parent_frame = arguments[0];
            this._arg = arguments[1];
            this.opener = arguments[2];
        }

        var _win = this._getWindow();
        if (_win)
            _win._updateWrapper(undefined, "hide");

        var child_frame = null;

        if (parent_frame == null)
        {
            const app = this._getRootObject();

            if (app && app._is_application)
                parent_frame = app._p_mainframe;
            else if (app)
                parent_frame = app;
        }
        if (parent_frame)
            ret = parent_frame.addChild(id, this);

        if (ret == -1)
        {
            if (_win)
                _win._updateWrapper(undefined, "show");
            return false;
        }
        else
            child_frame = this;

        if (child_frame && child_frame._arg)
        {
            for (var param in child_frame._arg)
            {
                child_frame._addVariable(param, child_frame._arg[param]);
            }
        }

        //use window runtime only
        var parent_window = parent_frame ? parent_frame._getWindow() : null;

        if (nexacro._registerPopupFrame(id, this, parent_window) < 0)
        {
            if (_win)
                _win._updateWrapper(undefined, "show");
            throw nexacro.MakeNativeError(this, "native_exist_id", id);
            //return false;
        }

        child_frame._is_window = false;
        child_frame._window_type = 4; // modalsync

        var left = child_frame._adjust_left;
        var top = child_frame._adjust_top;
        var width = child_frame._adjust_width;
        var height = child_frame._adjust_height;

        // showModal의 경우 autosize, openalign은 한번만 처리해도 된다.
        // _loadedForm에서 처리.

        if (this.autosize)
        {
            // calc autosize
            var calculated_size = this._getAutosizedFrameSize(true);
            this._p_width = width = calculated_size.width;
            this._p_height = height = calculated_size.height;
        }

        // form 로딩 여부와 상관없이 openalign 처리
        var after_align_pos = child_frame._getOpenAlignPos(this._getWindow(), left, top, width, height);
        if (after_align_pos)
        {
            this._p_left = after_align_pos.left;
            this._p_top = after_align_pos.top;
        }

        if (!this.opener || (this.opener && !this.opener._is_form && !this.opener._is_application))
        {

            this.opener = parent_frame ? parent_frame._p_form : null;

        }

        if (this._p_form)
            this._p_form._p_opener = this.opener;

        var _window = this._getWindow();
        var wheelZoomScale = 1.0;
        if (_window && (_window._wheelZoom != undefined) && (_window._wheelZoom != 100))
        {
            wheelZoomScale = _window._wheelZoom / 100.0;
        }
        var recalculated_pos = this._recalcModalPosition((this._p_left == null) ? null : this._p_left * wheelZoomScale, (this._p_top == null) ? null : this._p_top * wheelZoomScale, this._p_width, this._p_height);
        this._p_left = recalculated_pos.left;
        this._p_top = recalculated_pos.top;
        this._p_width = recalculated_pos.width;
        this._p_height = recalculated_pos.height;

        this._setModalLock();
        this._cancelTouchEvent();
        this.createComponent(true);
        this.on_created();
        if (wheelZoomScale != 1.0)
        {
            var frameElem = this.getElement();
            frameElem.setElementZoom(_window._wheelZoom);
            frameElem.setElementSize(frameElem._unscaledwidth, frameElem._unscaledheight, false, true);
        }

        var win = this._getWindow();
        if (win && win.handle)
        {
            var _virtual_handle = nexacro._createVirtualWindowHandle(win.handle);
            this._virtual_handle = _virtual_handle;
            nexacro._blockScript(win.handle, _virtual_handle);
        }

        if (_win)
            _win._updateWrapper(undefined, "show");

        return true;
    };


    //////////////////////////////////////////////////////////////////////////////////////
    // 1: ChildFrame._showModalWindow(parent, arg, opener, lock)
    // 2: ChildFrame._showModalWindow(id, parent, arg, opener, lock)
    //_pChildFrame._showModalWindow = function (str_id, _parent_frame, arr_arg, opener, _lockmode) 
    _pChildFrame._showModalWindow = function (str_id, _parent_frame, arr_arg, opener, _lockmode)
    {
        this._is_popup_frame = true;
        var ret, parent_frame, id;
        var shift_argument = 0;

        if (!(str_id instanceof nexacro.Frame) && str_id != null)
        { // syntax 2
            this.id = id = arguments[0];
        }
        else
        { // syntax 1
            shift_argument = -1;
            id = this.id;
        }

        parent_frame = arguments[1 + shift_argument];
        this._arg = arguments[2 + shift_argument];
        if (arguments[3 + shift_argument])
            this.opener = arguments[3 + shift_argument];

        nexacro._cleanupPopupFrame(id, parent_frame);

        if (parent_frame && parent_frame[id])
        {
            throw nexacro.MakeNativeError(this, "native_exist_id", id);
        }

        //popupframe에 있는지 먼저 체크 
        if (nexacro._isPopupFrame(id, parent_frame))
        {
            throw nexacro.MakeNativeError(this, "native_exist_id", id);
        }

        if (parent_frame)
        {
            if (!parent_frame._is_frame && !parent_frame._is_main)
            {
                throw nexacro.MakeTypeError(this, "type_mismatch", parent_frame);
            }
        }

        var parent_window = parent_frame ? parent_frame._getWindow() : null;

        if (nexacro._registerPopupFrame(id, this, parent_window) < 0)
            throw nexacro.MakeNativeError(this, "native_exist_id", id);

        this._is_window = true;
        this._window_type = 5; // modal window

        var left = this._adjust_left;
        var top = this._adjust_top;
        var width = this._adjust_width;
        var height = this._adjust_height;

        if (parent_window)
        {
            if (this._p_autosize == false && (this._openalign == null || this._openalign && this._openalign.value == ""))
            {
                //[RP 89707]
            }
            else
            {
                left = parent_window.getLeft();
                top = parent_window.getTop();
            }
        }

        // TODO this.winlevel,this.layered,this.openstatus
        var is_form_loaded = false;
        if (this._p_autosize && this._p_form && this._p_form._control_element)
        {
            width = this._p_form._init_width;
            height = this._p_form._init_height;
            is_form_loaded = true;
        }

        if (!is_form_loaded)
        {
            var after_align_pos = this._getOpenAlignPos(parent_window, left, top, width, height);
            if (after_align_pos)
            {
                left = after_align_pos.left;
                top = after_align_pos.top;
            }
        }

        if (!this.opener || (this.opener && !this.opener._is_form && !this.opener._is_application))
        {
            // TODO focus된 object를 기본 opener로 갖고가는 코드
            this.opener = parent_frame ? parent_frame._p_form : null;
        }

        if (this._p_form)
            this._p_form._p_opener = this.opener;

        if (this._p_autosize && !is_form_loaded)
        {
            this._delayed_create_window = true;
            this._delayed_create_parent = parent_window;
        }

        var openstyles = ""; //"layered=false showtitlebar=true showstatusbar=false resizable=true"
        if (this._p_resizable)
            openstyles += "resizable=true";
        if (this._p_layered)
            openstyles += "layered=true";

        var ext_openstyles = "toolbar=no,menubar=no,location=no,status=no,topmost=false,noactivate=false";

        return nexacro._createModalWindowHandle(parent_window, id, this._p_formurl, left, top, width, height, this._p_resizable, this._p_layered, parent_frame, this.opener, this._arg, openstyles, ext_openstyles);

    };
    ////////////////////////////////////////////////////////////////////////////////
    // * showModeless will be deprecated!!


    //for open 
    _pChildFrame._on_init = function ()
    {
        if (this._is_popup_frame && this._window_type == 2) //modeless
        {
            var formurl;
            var openstyle;
            var parent_frame;
            var left, top, width, height;
            var arr_args;
            var name = this._p_name;

            var popupframeoption = this._popupframeoption;
            if (popupframeoption)
            {
                delete this._popupframeoption;

                formurl = popupframeoption._formurl;
                openstyle = popupframeoption._openstyles;
                parent_frame = popupframeoption._parentframe;
                left = popupframeoption._left;
                top = popupframeoption._top;
                width = popupframeoption._width;
                height = popupframeoption._height;
                arr_args = popupframeoption._args;
                this.opener = popupframeoption._opener;
            }
            // check spec - addchild 
            if (parent_frame)
            {
                parent_frame.addChild(name, this);
            }

            if (arr_args)
            {
                for (var param in arr_args)
                {
                    // Framework 내부 변수를 덮는 경우에 대한 방안?
                    // 사용자오류?				
                    this._addVariable(param, arr_args[param]);
                }
            }

            if (openstyle)
            {
                var openlist = openstyle.split(" ");
                for (var i = 0, len = openlist.length; i < len; i++)
                {
                    var prop = openlist[i].split("=");
                    if (prop[0]) //argument가 스페이스가 들어간 형태의 스트링일경우
                    {
                        if (prop[1] && prop[1].indexOf("'") > -1)
                        {
                            prop[1] = prop[1].replace("'", "");
                            for (var j = i; j < len; j++)
                            {
                                var addstr = openlist[++i];
                                if (addstr)
                                {
                                    prop[1] += " " + addstr;
                                    if (addstr.indexOf("'") > -1)
                                    {
                                        prop[1] = prop[1].replace("'", "");
                                        //var reg = /(?<=')(.*)(?=')/g;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (prop[0] == "openstatus")
                    {
                        this._init_openstatus = prop[1];
                        continue;
                    }

                    if (this["set_" + prop[0]])
                        this["set_" + prop[0]](prop[1]);
                }
            }

            const env = this._env;
            var locale = env && env._p_locale ? env._p_locale : nexacro._getLocale();
            if (locale)
            {
                this._setLocale(locale);
            }

            this.init(this._p_name, left, top, width, height, null, null, formurl);

            if (nexacro.__setViewportScale)
                nexacro.__setViewportScale();
        }
    };

    _pChildFrame._on_load = function ()
    {
        nexacro._initLayoutManager(true, true, true);

        this.createComponent();
        this._on_focus(true);
        this.on_created();
        this._changeStateActivate(true);
    };


    _pChildFrame._loadApplicationCSS = function ()
    {
        //web browser 에서만 실행됨 
        // make cssurl list 
        let cssurls = [];
        const app = nexacro.getApplication();
        if (app && app._cssurls)
        {
            cssurls = [...app._cssurls];
        }

        const env = this._env;
        if (env && env._cssurls)
        {
            env._cssurls.forEach(item =>
            {
                const idx = cssurls.indexOf(item);
                if (idx != -1)
                    cssurls.splice(idx, 1);
                cssurls.push(item);
            })
        }

        var url, len = cssurls.length;
        for (var i = 0; i < len; i++)
        {
            url = cssurls[i];
            if (url)
            {
                var loadurl = url.replace("::", "_");
                var cssurl, base_url;

                cssurl = nexacro._getServiceLocation("theme://" + loadurl, nexacro._project_absolutepath, null, false);
                if (env._localcache_path)
                {
                    base_url = cssurl.substring(nexacro._project_absolutepath.length, cssurl.length);
                    cssurl = env._localcache_path + base_url;
                }

                var cssmapurl = cssurl;
                var pos = cssurl.lastIndexOf('/');
                cssurl = cssurl.substring(0, pos + 1) + nexacro._getCSSFileName(cssurl.substring(pos + 1, cssurl.length - 5));
                var service = nexacro._getServiceObject(url);

                pos = cssmapurl.lastIndexOf('.');
                cssmapurl = nexacro._getMapFileName(cssmapurl.substring(0, pos));

                var checkversion = env.checkversion;
                if (checkversion)
                {
                    var version = service.version;
                    if (!nexacro._isNull(version) && version !== "")
                    {
                        cssurl += nexacro._getVersionQueryString(cssurl, null, version);
                        cssmapurl += nexacro._getVersionQueryString(cssmapurl, null, version);
                    }
                }

                this._load_manager.loadCssModule(cssurl, null, null, service, true, 1); //css                
                this._load_manager.loadCssModule(cssmapurl, null, null, service);
            }
        }
    };

    _pChildFrame._loadEnvironment = function (/*name, target_win*/)
    {
        const env = this._env;
        //load theme
        nexacro._loadTheme(this, env._curthemeid);

        //load initvalue
        //this._loadInitValueFile(env._initvaluefileid);        
        nexacro._loadGlobalModule(this, env._initvaluefileid);
    };

    _pChildFrame._showModeless = function (name, target_win)
    {
        //  nexacro._registerPopupFrame(name, this);  popupframes 정보는 childframe을 띄운 nexacro에 추가된다. 여기서 추가하면 안됨 

        this._is_popup_frame = true;
        this._is_window = true;
        this._window = target_win;
        this._window.root = this;
        this._window_type = 2;
        this._is_autosized = false;

        //childframe이 css load 
        this._load_manager.status = 2;
        this._load_manager._is_mainloaded = true;

        this._loadEnvironment();
        this._loadApplicationCSS();

    };

    _pChildFrame.hideModal = function ()
    {
        // TODO
    };

    _pChildFrame.hideModeless = function ()
    {
        // TODO
    };

    _pChildFrame.getForm = function ()
    {
        return this._p_form ? this._p_form : null;
    };

    //===============================================================
    // nexacro.ChildFrame : Event Handlers
    //===============================================================
    _pChildFrame.on_fire_sys_onkeydown = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key)
    {
        if (this._window_type == 1)
            return true;
        var ret = nexacro.Frame.prototype.on_fire_sys_onkeydown.call(this, key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_sys_onkeyup = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key)
    {
        if (this._window_type == 1)
            return true;
        var ret = nexacro.Frame.prototype.on_fire_sys_onkeyup.call(this, key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_sys_onlbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._window_type == 1)
            return true;
        var ret = nexacro.Frame.prototype.on_fire_sys_onlbuttondown.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_loadform_failed && this._isShowTitleBar() == false)
        {
            var owner_frame = this.getOwnerFrame();
            if (owner_frame)
            {
                owner_frame.removeChild(this.id);
                var ownerframe_elem = owner_frame.getElement();
                if (ownerframe_elem)
                    owner_frame.on_change_containerRect(owner_frame._getClientWidth(), owner_frame._getClientHeight());
            }

            if (this._is_window && this._window && this._window._is_alive)
                this._window.destroy();
            else
                this._destroy();

            if (this._control_element)
                this._control_element.destroy();
            this._control_element = null;
        }

        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_sys_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._window_type == 1)
            return true;
        var ret = nexacro.Frame.prototype.on_fire_sys_onlbuttonup.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_sys_onrbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._window_type == 1)
            return true;
        var ret = nexacro.Frame.prototype.on_fire_sys_onrbuttondown.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_sys_onrbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._window_type == 1)
            return true;
        var ret = nexacro.Frame.prototype.on_fire_sys_onrbuttonup.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_sys_onmousedown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._window_type == 1)
            return true;
        var ret = nexacro.Frame.prototype.on_fire_sys_onmousedown.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_sys_onmouseup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._window_type == 1)
            return true;
        var ret = nexacro.Frame.prototype.on_fire_sys_onmouseup.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_sys_onmouseenter = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        var ret = nexacro.Frame.prototype.on_fire_sys_onmouseenter.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_sys_onmouseleave = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        var ret = nexacro.Frame.prototype.on_fire_sys_onmouseleave.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_sys_onmousemove = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._window_type == 1)
            return true;
        var ret = nexacro.Frame.prototype.on_fire_sys_onmousemove.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_sys_onmousewheel = function (wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        var ret = nexacro.Frame.prototype.on_fire_sys_onmousewheel.call(this, wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };


    _pChildFrame.on_fire_user_onkeydown = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key)
    {
        var ret = nexacro.Frame.prototype.on_fire_user_onkeydown.call(this, key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_user_onkeyup = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key)
    {
        var ret = nexacro.Frame.prototype.on_fire_user_onkeyup.call(this, key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_user_onlbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        var ret = nexacro.Frame.prototype.on_fire_user_onlbuttondown.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_user_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        var ret = nexacro.Frame.prototype.on_fire_user_onlbuttonup.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_user_onrbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        var ret = nexacro.Frame.prototype.on_fire_user_onrbuttondown.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_user_onrbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        var ret = nexacro.Frame.prototype.on_fire_user_onrbuttonup.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_user_onmouseup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        var ret = nexacro.Frame.prototype.on_fire_user_onmouseup.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_user_onmousedown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        var ret = nexacro.Frame.prototype.on_fire_user_onmousedown.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_user_onmouseenter = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        var ret = nexacro.Frame.prototype.on_fire_user_onmouseenter.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_user_onmouseleave = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        var ret = nexacro.Frame.prototype.on_fire_user_onmouseleave.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_user_onmousemove = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._window_type == 1)
            return true;
        var ret = nexacro.Frame.prototype.on_fire_user_onmousemove.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    _pChildFrame.on_fire_user_onmousewheel = function (wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        var ret = nexacro.Frame.prototype.on_fire_user_onmousewheel.call(this, wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        if (this._is_window)
            return true;
        return ret;
    };

    // drag
    // dragenter
    // dragleave
    // dragmove

    //===============================================================
    // nexacro.ChildFrame : Logical Part
    //===============================================================
    _pChildFrame._createForm = function ()
    {
        var formurl = this._p_formurl;
        if (!formurl)
            formurl = "";

        //RP 92561 [nexacro17] style.xcss 저장할때 로딩시간이 비정상적으로 깁니다. -툴팀요청
        var application = this._getRootObject();
        if (application)
        {
            if (application?.key === "designform")
            {
                // nexacro studio에서 application loading중 childframe생성 시 nexacro.Form 생성단계를 생략.
                // (nexacro.DesignForm을 생성해서 사용.)
                return null;
            }
        }

        var form = this._p_form;
        if (form)
        {
            if (form._url != this._formurl)
            {
                form.destroyComponent();
                form = new nexacro.Form("form", 0, 0, this._getClientWidth(), this._getClientHeight(), null, null, null, null, null, null, this);
                form._p_opener = this.opener;
                this._p_form = form;
                form.loadForm(formurl);
                if (this._control_element)
                {
                    form.createComponent();
                }
            }
        }
        else
        {
            form = new nexacro.Form("form", 0, 0, this._getClientWidth(), this._getClientHeight(), null, null, null, null, null, null, this);
            form._p_opener = this.opener;
            this._p_form = form;
            if (this._formurl)
            {
                form.loadForm(formurl);
            }

            if (this._control_element)
            {
                form.createComponent();
            }
        }
        return form;
    };

    _pChildFrame._closeForm = function (arg)
    {
        var ownerframe;
        if (this._is_window)
        {
            if (arg !== undefined)
            {
                this._close_argument = arg;
                this._window.returnValue = arg;
            }

            var allobj = this._p_all;
            var allcnt = allobj.length - 1;
            for (var i = allcnt; i >= 0; i--)
            {
                var childid = allobj.get_id(i);
                var child = allobj[i];

                if (child && child._is_window && child._window && child._is_alive)
                {
                    this.removeChild(childid);

                    child._window.destroy();
                    child._window = null;
                }
            }

            ownerframe = this.getOwnerFrame();
            if (ownerframe)
            {
                ownerframe.removeChild(this.id);
            }
            else if (this._window && this._window._parentwindowforopen && this._window_type == 2) //modeless
            {
                if (nexacro._Browser == "Runtime" && (nexacro._SystemType.toLowerCase() == "win32" || nexacro._SystemType.toLowerCase() == "win64"))
                    nexacro._unregisterPopupFrame(this.id, this._window._parentwindowforopen, undefined, true);
            }

            if (this._p_form && this._p_form._is_alive)
            {
                this._p_form._destroy();
                this._p_form = null;
            }

            if (this._window && this._window._is_alive)
            {
                this._window.destroy();
                this._window = null;
            }
        }
        else
        {
            if (arg !== undefined)
            {
                this._close_argument = arg;
            }

            var callremovechild = true;
            ownerframe = this.getOwnerFrame();
            if (ownerframe)
            {
                ownerframe.removeChild(this.id);
                callremovechild = false;
            }

            if (this._p_form && this._p_form._is_alive)
            {
                this._p_form._destroy();
                this._p_form = null;
            }

            this._destroy(callremovechild);
        }
    };

    _pChildFrame._destroyForm = function ()
    {
        if (this._p_form)
        {
            this._p_form._destroy();
            this._p_form = null;
        }
    };

    // Form의 on_init직후 (ControlElement 없음) for autosize
    _pChildFrame._loadedForm = function ()
    {
        this._setLastFocus(this._p_form);

        if (this._is_loadform_failed)
            return;

        // titlebar가 없는 경우 form drag허용
        this._applyDragMoveType();

        if (this._p_autosize)
        {
            var after_align_pos, parent_window = this._delayed_create_parent;
            var left = this._left;
            var top = this._top;
            var width;
            var height;
            var calculated_size, _adjust_width, _adjust_height;

            if (this._is_window && this._window_type == 2) // 이제 Modeless 밖에 해당사항이 없음.
            {
                if (this._delayed_create_window)
                {
                    // calc autosize
                    calculated_size = this._getAutosizedFrameSize(nexacro._Browser == "Runtime" || nexacro._macOSWebView);
                    width = calculated_size.width;
                    height = calculated_size.height;

                    // openalign
                    after_align_pos = this._getOpenAlignPos(parent_window, left, top, width, height);
                    if (after_align_pos)
                    {
                        left = after_align_pos.left;
                        top = after_align_pos.top;
                    }

                    this._move(this._adjust_left, this._adjust_top, width, height);

                    var _window = this._window = new nexacro._Window(this._p_name, parent_window, false);
                    _window.attachRoot(this, false, () =>
                    {
                        return _window.create(parent_window, this.id, width, height, left, top, this._p_resizable, this._p_layered, this._p_showontaskbar);
                    });


                    delete this._delayed_create_parent;
                    delete this._delayed_create_window;
                }
                else
                {
                    if (this._window)
                    {
                        // calc autosize
                        calculated_size = this._getAutosizedFrameSize(nexacro._Browser == "Runtime" || nexacro._macOSWebView);
                        width = calculated_size.width;
                        height = calculated_size.height;

                        after_align_pos = this._getOpenAlignPos(this._window._p_parent, left, top, width, height);
                        if (after_align_pos)
                        {
                            left = after_align_pos.left;
                            top = after_align_pos.top;
                        }

                        this._move(left, top, width, height);

                        if (this._init_openstatus)
                        {
                            this.set_openstatus(this._init_openstatus);
                            if (this._init_openstatus != "normal")
                            {
                                this._init_openstatus = null;
                                return;
                            }
                            this._init_openstatus = null;
                        }

                        _adjust_width = width + this._window._gap_client_width;
                        _adjust_height = height + this._window._gap_client_height;
                        this._window.setSize(_adjust_width, _adjust_height);
                    }
                }
            }
            else if (this._window_type == 5) // modal windowed
            {
                if (this._delayed_create_window)
                {
                    /*      [2019.03.07 sung_hj] autosize 처리 안되고 불필요해 보여서 삭제함. 
                       if (this.form && this._window.handle)
                       {
                           //modeless 와 동일 사이즈로 동작위해..
                       }
                       else
                    */
                    {
                        // calc autosize                        
                        calculated_size = this._getAutosizedFrameSize(nexacro._Browser == "Runtime");
                        width = calculated_size.width;
                        height = calculated_size.height;
                    }

                    // openalign
                    after_align_pos = this._getOpenAlignPos(parent_window, left, top, width, height);
                    if (after_align_pos)
                    {
                        left = after_align_pos.left;
                        top = after_align_pos.top;
                    }

                    if (this._window.handle)
                    {
                        //normal(0), restore(1), minimize(2), maximize(3)
                        this._window.moveTo(left, top);
                        if (this._state_openstatus == 0)
                        {
                            this._move(left, top, width, height);
                        }
                        else
                        {
                            // window는 restore시 win32에 의해 restore되므로 미리 옮겨놓는다.
                            this._restore_position = { // <-필요 없을지도??
                                left: left, top: top,
                                width: width, height: height,
                                right: this._p_right, bottom: this._p_bottom
                            };
                        }
                    }
                    else
                    {
                        // modal callback이 아직 호출되지 않은 경우, on_created에서 window 크기 조절.
                        this._delayed_window_pos = {
                            left: left, top: top, width: width, height: height
                        };
                    }

                    delete this._delayed_create_parent;
                    delete this._delayed_create_window;
                }
                else
                {
                    if (this._window)
                    {
                        calculated_size = this._getAutosizedFrameSize(nexacro._Browser == "Runtime");
                        width = calculated_size.width;
                        height = calculated_size.height;

                        after_align_pos = this._getOpenAlignPos(this._window._p_parent, left, top, width, height);
                        if (after_align_pos)
                        {
                            left = after_align_pos.left;
                            top = after_align_pos.top;
                        }
                        this._move(left, top, width, height);

                        _adjust_width = width + this._window._gap_client_width;
                        _adjust_height = height + this._window._gap_client_height;
                        this._window.setSize(_adjust_width, _adjust_height);
                    }
                }

            }
            else if (this._window_type == 1 || this._window_type == 4) // modal, modalsync
            {
                // calc autosize; modal은 항상 nc포함
                calculated_size = this._getAutosizedFrameSize(true);
                width = calculated_size.width;
                height = calculated_size.height;

                // openalign
                after_align_pos = this._getOpenAlignPos(this._getWindow(), left, top, width, height);
                if (after_align_pos)
                {
                    left = after_align_pos.left;
                    top = after_align_pos.top;
                }

                var recalculated_pos = this._recalcModalPosition(left, top, width, height);
                this._move(recalculated_pos.left, recalculated_pos.top, recalculated_pos.width, recalculated_pos.height);
            }
        }
        this._is_autosized = true;
    };

    _pChildFrame._on_window_loaded = function ()
    {

        this._checkValidWindowSize();
        if (!this._is_created)
        {
            this.createComponent();
            this._on_focus(true);
            this.on_created();
        }

        if (this._lockmode)
        {
            delete this._lockmode;
            this._lockmode = null;
        }
    };

    _pChildFrame._onHttpSystemError = function (obj, bfireevent, errorobj, errortype, url, returncode, requesturi, locationuri, extramsg)
    {
        this._is_loadform_failed = true;
    };

    // Form의 ControlElement 생성 이후.
    _pChildFrame._createdForm = function ()
    {
        var _window;
        if (this._window_type == 1)
        {
            if (this._isNotProcessedWheelZoom == true)
            {
                _window = this._getWindow();
                var wheelZoomScale = 1.0;
                if (_window && (_window._wheelZoom != undefined) && (_window._wheelZoom != 100))
                {
                    wheelZoomScale = _window._wheelZoom / 100.0;
                }
                var after_align_pos = this._getOpenAlignPos(_window, this._p_left, this._p_top, this._p_width, this._p_height);
                if (after_align_pos)
                {
                    this._p_left = after_align_pos.left;
                    this._p_top = after_align_pos.top;
                }
                var recalculated_pos = this._recalcModalPosition(this._p_left, this._p_top, this._p_width, this._p_height);
                this._p_left = recalculated_pos.left;
                this._p_top = recalculated_pos.top;
                this._p_width = recalculated_pos.width;
                this._p_height = recalculated_pos.height;
                if (wheelZoomScale != 1.0)
                {
                    var frameElem = this.getElement();
                    if (frameElem)
                    {
                        frameElem.setElementZoom(_window._wheelZoom);
                        frameElem.setElementSize(recalculated_pos.width, recalculated_pos.height, false, true);
                        frameElem._updateBorderElementsPosition();
                        this.set_visible(true);
                    }
                }
            }
        }

        if (this._state_openstatus != 2) // not minimize
        {
            var owner_frame = this.getOwnerFrame();
            var _win = this._getWindow();
            var is_active_layer;
            if (owner_frame)
            {
                var proc_focus = false;

                // 새로 add되는 frame은 Z-order Map에만 Top에 넣고,
                // 실제로 Activate처리 되면서 FrameSet의 ActiveFrame으로 설정된다.
                if (owner_frame._is_frameset && owner_frame._getTopOrderFrame() == this)
                    proc_focus = true;
                else if (!owner_frame._is_frameset && owner_frame._is_frame) // owner가 childframe
                    proc_focus = true;

                if (proc_focus)
                {
                    if (this._getWindow() == owner_frame._getWindow())
                    {
                        this._changeStateActivate(true);
                    }
                    else if (this._window_type == 5)
                    {
                        if (_win && _win._prepared_flag == true)
                        {
                            this._changeStateActivate(true);
                        }
                    }

                    // TODO API로?
                    const env = this._env;
                    if (env._p_enableaccessibility &&
                        (env._a11ywholereadtype == 1 || env._a11ywholereadtype == 3))
                    {
                        // Form까지만 focus
                        this._setFocus();
                        this._p_form._playAccessibilityWholeReadLabel("wholeread");
                    }
                    else
                    {
                        // Form의 First TabOrder Component까지 focus
                        is_active_layer = _win._isActiveLayerComponent(this._p_form);
                        if (is_active_layer)
                            this._p_form._on_focus(true);
                    }
                }
            }
            else
            {
                this._changeStateActivate(true);
                const env = this._env;
                if (env._p_enableaccessibility &&
                    (env._a11ywholereadtype == 1 || env._a11ywholereadtype == 3))
                {
                    // Form까지만 focus
                    this._setFocus();
                    this._p_form._playAccessibilityWholeReadLabel("wholeread");
                }
                else
                {
                    // Form의 First TabOrder Component까지 focus
                    is_active_layer = _win._isActiveLayerComponent(this._p_form);
                    if (is_active_layer)
                        this._p_form._on_focus(true);
                }
            }
        }

        if (this._is_window && this._p_autosize != true)
        {
            this._checkValidWindowSize();
        }

        if (this._p_form && this._p_form._delayedfocuscomp)
        {
            if (this._window_type == 5)
            {
                _window = this._getWindow();
                if (_window && _window._prepared_flag == true)
                {
                    this._p_form._delayedfocuscomp = null;
                    delete this._p_form._delayedfocuscomp;
                }
            }
            else
            {
                this._p_form._delayedfocuscomp = null;
                delete this._p_form._delayedfocuscomp;
            }
        }
    };

    _pChildFrame._applyDragMoveType = function ()
    {
        var form = this._p_form;
        if (form)
        {
            var allow_dragform = false;
            if (this._dragmovetype == 2 || (this._dragmovetype == 1 && !this._isShowTitleBar()))
                allow_dragform = true;

            // Drag이동이 불가능한 경우 제외 (step slide와 겹침 - 스펙 조정 필요)
            //if (this._canDragMove()) //불가능하더라도 그 정보를 세팅해줘야 하므로 막음;
            {
                form._setDragMove(allow_dragform, this._is_window);
            }
        }

        if (this._p_titlebar)
            this._p_titlebar._setDragMove(this._dragmovetype != 0, this._is_window);
    };

    _pChildFrame._cancelTouchEvent = function ()
    {
        // 현재 동작중인 touch event가 있으면 cancel.
        // modal이 뜨는 동시에 후속이벤트가 나오기때문에, 정상적인 동작에 방해가 됨.
        var win = this._getWindow();
        var touch_manager = win ? win._gesture_manager : null;
        if (touch_manager)
        {
            var session = touch_manager._touch_session;
            if (session && session._cur_input)
                session._cur_input.preventAction();
        }
    };

    _pChildFrame._getTitleText = function (brecursive)
    {
        var titletext;
        titletext = this._getStringResourceProperty(this._p_titletext);
        if (brecursive)
        {
            if (this._p_form && this._p_form._p_titletext.length > 0)
            {
                if (titletext.length > 0)
                    titletext += " - ";
                titletext += this._getStringResourceProperty(this._p_form._p_titletext);
            }
        }
        return titletext;
    };

    _pChildFrame._getStatusText = function (brecursive)
    {
        var statustext;
        statustext = this._p_statustext;
        if (brecursive)
        {
            if (this._p_form && this._p_form._p_statustext.length > 0)
            {
                if (statustext.length > 0)
                    statustext += " - ";
                statustext += this._p_form._p_statustext;
            }
        }
        return statustext;
    };

    _pChildFrame._getOpenAlignPos = function (parent_win, left, top, width, height)
    {
        if (this._openalign)
        {
            if (parent_win == null)
            {
                // TODO check 모니터 관련 API 미지원 (html5)
                return;
            }

            var _window = this._getWindow();
            var wheelZoomScale = 1.0;
            if (_window && (_window._wheelZoom != undefined) && (_window._wheelZoom != 100))
            {
                wheelZoomScale = _window._wheelZoom / 100.0;
            }
            var is_modal = (this._window_type == 1 || this._window_type == 4);
            var p_l = is_modal ? 0 : (parent_win.left | 0);
            var p_t = is_modal ? 0 : (parent_win.top | 0);
            var p_w = parent_win.clientWidth;
            var p_h = parent_win.clientHeight;
            switch (this._openalign.halign)
            {
                case "left":
                    left = p_l;
                    break;
                case "center":
                    left = p_l + Math.round((p_w - width * wheelZoomScale) / 2);
                    break;
                case "right":
                    left = p_l + p_w - width * wheelZoomScale;
                    break;
            }
            switch (this._openalign.valign)
            {
                case "top":
                    top = p_t;
                    break;
                case "middle":
                    top = p_t + Math.round((p_h - height * wheelZoomScale) / 2);
                    break;
                case "bottom":
                    top = p_t + p_h - height * wheelZoomScale;
                    break;
            }
            return { left: left, top: top };
        }
        return null;
    };

    // Popup Window 생성 직후 모니터 크기를 벗어나는 등의 이유로 Window크기가 자동으로 변경되는 경우
    // Resize 이벤트 발생여부, 발생시점 및 횟수 등 차이가 발생하여 Frame에서 Sync함. (Firefox)
    if (nexacro._Browser == "Gecko")
    {
        _pChildFrame._checkValidWindowSize = function ()
        {
            var _window = this._window;
            if (!_window)
                return;

            // TODO IE8에서 window생성직후에 clientWidth,Height값이 0이다.. offsetWidth,Height는 정상
            var width = this._adjust_width;
            var height = this._adjust_height;
            if ((_window.clientWidth != width || _window.clientHeight != height) && (_window.clientWidth != 0 && _window.clientHeight != 0))
            {
                if (this.autosize != true && this._control_element)
                {
                    var control_elem = this._control_element;
                    control_elem.setElementSize(width, height);
                    control_elem.setElementSize(this._adjust_width, this._adjust_height);
                    //  control_elem._updateClientSize();
                }

                this._move(
                    this._adjust_left,
                    this._adjust_top,
                    _window.clientWidth,
                    _window.clientHeight);

                if (this._p_autosize != true)
                {
                    this.on_change_containerRect(this._adjust_width, this._adjust_height);
                }

                return false;
            }

            return true;
        };
    }
    else
    {
        _pChildFrame._checkValidWindowSize = nexacro._emptyFn;
    }

    // showModal을 호출하면 자기자신이 modallock을 수행한다. 내가 들어갈 window을 lock한다.
    // showModalWidnow인 경우 popup의 overlayColor를 인자로 받아 설정한다.
    _pChildFrame._setModalLock = function (modalWindowOverlayColor)
    {
        // backup window focus
        var win;
        if (this._window_type == 5)
        {
            win = this._p_parent ? this._p_parent._getWindow() : null;
        }
        else
        {
            win = this._getWindow();
        }
        if (!win)
        {
            throw new Error("nexacro k dev: not find root window obj.");

        }

        if (!win)
            return;

        var cur_focus_path = win.getCurrentFocusPaths() ? win.getCurrentFocusPaths().slice(0) : null;  // clone array

        // kill focus
        win._removeFromCurrentFocusPath(null, false);

        // clear mouseover status
        if (cur_focus_path)
        {
            var cur_focus_path_len = cur_focus_path.length;
            var comp;
            for (var i = cur_focus_path_len; i > 0; i--)
            {
                comp = cur_focus_path[i - 1];
                comp._changeStatus("mouseover", false);             //RP 69535
            }
        }

        // create overlay
        var overlaycolor = nexacro.ChildFrame._default_overlaycolor;
        if (modalWindowOverlayColor)
        {
            overlaycolor = modalWindowOverlayColor;
        }
        else if (this._overlaycolor)
        {
            overlaycolor = this._overlaycolor;
        }
        // calc zindex
        var zindex = nexacro._zindex_firstmodal;
        var modal_stack = win._modal_frame_stack;
        if (modal_stack.length > 0)
        {
            // Overlay의 zindex는 1e6+2 부터 1씩 증가
            var modal_info = modal_stack[modal_stack.length - 1];
            zindex = modal_info[1] + 1;
        }

        var parent;
        if (this._window_type == 5)
        {
            parent = this._p_parent ? ((this._p_parent._window_type == 5) ? this._p_parent : this._p_parent._p_parent) : null;
        }
        else
        {
            parent = this._p_parent;
        }
        if (!parent)
        {
            const app = this._getRootObject();

            if (app)
            {
                parent = app?._p_mainframe ? app?._p_mainframe : app;
            }
        }


        var modal_overlay_elem;
        if (parent)
        {
            if (this._window_type == 5)
            {
                modal_overlay_elem = this._modal_overlay_elem = new nexacro.ModalOverlayElement(parent._control_element);
                modal_overlay_elem.setLinkedControl(parent); //?
                modal_overlay_elem.setElementZIndex(zindex);
                modal_overlay_elem.name = "modal_overlay";
                if (overlaycolor)
                    modal_overlay_elem.setElementBackground(overlaycolor);
                modal_overlay_elem.create(win);

                parent._accessibilityModalLock(modal_stack);
                win._modal_frame_stack.push([this, zindex, cur_focus_path]);
            }
            else
            {
                modal_overlay_elem = this._modal_overlay_elem = new nexacro.ModalOverlayElement(parent._control_element);
                modal_overlay_elem.setLinkedControl(this); //?
                modal_overlay_elem.setElementZIndex(zindex);
                modal_overlay_elem.name = "modal_overlay";
                if (overlaycolor)
                    modal_overlay_elem.setElementBackground(overlaycolor);
                modal_overlay_elem.create(win);

                this._accessibilityModalLock(modal_stack);
                win._modal_frame_stack.push([this, zindex, cur_focus_path]);
            }

            modal_overlay_elem._showPopOver();
        }
    };

    _pChildFrame._setModalUnlock = function ()
    {
        var win;
        if (this._window_type == 5)
        {
            win = this._p_parent ? this._p_parent._getWindow() : null;
        }
        else
        {
            win = this._getWindow();
        }
        if (!win)
        {
            throw new Error("nexacro k dev: not find root window obj.");

        }
        if (!win)
            return;

        // destroy overlay
        var modal_stack = win._modal_frame_stack;
        var modal_stack_len = modal_stack.length;
        var modal_info;
        for (var i = 0; i < modal_stack_len; i++)
        {
            modal_info = modal_stack[i];
            if (modal_info[0] == this)
            {
                // pop
                for (var j = i; j < modal_stack_len - 1; j++)
                {
                    modal_stack[j] = modal_stack[j + 1];
                }
                modal_stack.length = modal_stack_len - 1;
                break;
            }
        }

        nexacro._unregisterPopupFrame(this.id, win);

        this._accessibilityModalUnLock(modal_stack);

        // restore window focus
        if (modal_info)
        {
            var old_focus_path = modal_info[2];
            if (old_focus_path && old_focus_path.length > 0)
            {
                // TODO check modal로 막혀있는 도중 객체가 파괴됐을 경우?? 어쩌나??
                var old_focus_path_len = old_focus_path.length;
                for (i = 0; i < old_focus_path_len; i++)
                {
                    var comp = old_focus_path[i];
                    if (comp instanceof nexacro.ChildFrame)
                    {
                        comp._changeStateActivate(true);
                        //comp._on_activate();
                        continue;
                    }
                    else if (comp._is_form)
                    {
                        comp._on_focus(true);
                        break;
                    }

                    if (i == (old_focus_path_len - 1))
                    {
                        comp._on_focus(true);
                    }
                }
            }
        }


        if (this._modal_overlay_elem)
        {
            this._modal_overlay_elem._hidePopOver();

            this._modal_overlay_elem.destroy();
            this._modal_overlay_elem = null;
        }

    };

    _pChildFrame._setModalOverlaySize = function (width, height)
    {
        // 무조건 유효


        const w = nexacro._getWindowOverlayWidth(width);
        const h = nexacro._getWindowOverlayHeight(height);
        this._modal_overlay_elem.setElementSize(w, h);

        // maximize 상태이면 frame도 같이 변경
        if (this._state_openstatus == 3)
            this._setSize(width, height);
    };

    _pChildFrame._recalcModalPosition = function (left, top, width, height)
    {
        // left, top 0 이상
        // right, bottom은 최소 titlebar까지는 보이도록 좌표보정
        var _window = this._getWindow();
        var wheelZoomScale = 1.0;
        if (_window && (_window._wheelZoom != undefined) && (_window._wheelZoom != 100))
        {
            wheelZoomScale = _window._wheelZoom / 100.0;
        }
        left = parseInt(left);
        top = parseInt(top);
        width = parseInt(width);
        height = parseInt(height);

        var win = this._getWindow();
        if (!win)
            return { left: left, top: top, width: width, height: height };

        var titleheight = parseInt(this._titlebarheight | 0);
        if (titleheight <= 0)
            titleheight = this._defaulttitleheight;

        if (left + width * wheelZoomScale > win.clientWidth)
            left = win.clientWidth - width * wheelZoomScale;
        if (top + titleheight * wheelZoomScale > win.clientHeight)
            top = win.clientHeight - titleheight * wheelZoomScale;
        if (left < 0)
            left = 0;
        if (top < 0)
            top = 0;

        return { left: left, top: top, width: width, height: height };
    };

    // Autosize 처리된 Frame Size를 리턴한다.
    _pChildFrame._getAutosizedFrameSize = function (include_frame_nc)
    {
        var width = this._adjust_width;
        var height = this._adjust_height;

        var form = this._p_form;
        if (form && form._is_loading == false)
        {
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                var layout = manager.getValidLayout(form);
                if (layout && layout._p_width > -1 && layout._p_height > -1)
                {
                    width = layout._p_width;
                    height = layout._p_height;
                }
                else
                {
                    width = form._init_width;
                    height = form._init_height;
                }
            }
        }

        // Include Frame NC: Runtime에서의 Modeless는 NC 포함. 또는 showModal 인 경우.
        if (include_frame_nc)
        {
            var titleheight = 0, statusheight = 0;
            if (this._isShowTitleBar())
                titleheight = parseInt(this._titlebarheight) | 0;
            if (this._isShowStatusBar())
                statusheight = parseInt(this._statusbarheight) | 0;

            height += titleheight + statusheight;
        }

        return { "width": width, "height": height };
    };

    _pChildFrame._on_apply_locale = function (v)
    {
        var form = this._p_form;
        if (form)
        {
            form._setLocale(v);
        }
    };

    //===============================================================
    // nexacro.FrameSetBase
    //===============================================================
    nexacro.FrameSetBase = function (id, left, top, width, height, right, bottom, parent)
    {
        nexacro.Frame.call(this, id, left, top, width, height, right, bottom, parent);

        this._p_frames = new nexacro.Collection();
        this._zordermap = new nexacro.Collection(); // TODO check element zorder API exist?	
        this._separatesize = [];
        this._separaterealsize = [];
        this._splittermap = new Map();
        this._splitteroffset = 1; // this._p_splittersize / 2;
    };

    var _pFrameSetBase = nexacro._createPrototype(nexacro.Frame, nexacro.FrameSetBase);
    nexacro.FrameSetBase.prototype = _pFrameSetBase;

    // overide nexacro.Object
    _pFrameSetBase._type_name = "FrameSetBase";

    _pFrameSetBase._p_separatesize = "";
    _pFrameSetBase._p_splittertype = "none";
    _pFrameSetBase._p_splittermargin = 1;
    _pFrameSetBase._p_splittersize = 2;
    _pFrameSetBase._p_keepseparatesizewhenswap = false;
    _pFrameSetBase._p_ctrltaborder = "active"; // active,index
    _pFrameSetBase._p_ctrltabtype = "order"; // order,swap
    _pFrameSetBase._p_showstatusbar = false;
    _pFrameSetBase._p_showtitlebar = false;
    _pFrameSetBase._p_pinned = false;
    _pFrameSetBase._p_allowtabbaritempinbutton = true;

    /* internal variable */
    _pFrameSetBase._max_frame = null;
    _pFrameSetBase._track_frame = null;
    _pFrameSetBase._active_frame = null;
    _pFrameSetBase._is_frameset = true;
    _pFrameSetBase._is_autorecalc_frame = true; // H/V/Tile
    //===============================================================
    // nexacro.FrameSetBase Style Part
    //===============================================================
    //===============================================================
    // nexacro.FrameSetBase : Create & Destroy & Update
    //===============================================================
    _pFrameSetBase.on_create_contents = function ()
    {
        nexacro.Frame.prototype.on_create_contents.call(this);

        var cnt = this._p_frames.length;
        for (var i = 0; i < cnt; i++)
        {
            var frame = this._p_frames[i];
            if (frame.set_resizable) // TODO check childframe만 해야 함. 나머지는 resizable이 없음.
                frame.set_resizable(true); //for window
            frame.createComponent();
            this._zordermap.add_item(frame._p_name, frame);
        }
    };

    _pFrameSetBase.on_change_containerRect = function (width, height)
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            //block;
        }
    };

    _pFrameSetBase.on_created_contents = function (win)
    {
        nexacro.Frame.prototype.on_created_contents.call(this, win);

        // subframe auto positioning
        var lastx = 0, lasty = 0;
        var defaultwidth = 0, defaultheight = 0;
        var control_elem = this._control_element;
        if (control_elem)
        {
            defaultwidth = control_elem.client_width / 5 * 3;
            defaultheight = control_elem.client_height / 5 * 3;

            lasty = control_elem.client_top;
        }

        var cascadegap = this._titlebarheight;
        var cnt = this._p_frames.length;
        var frames = this._p_frames;
        for (var i = 0; i < cnt; i++)
        {
            var frame_item = frames[i];
            if (frame_item.position)
            {
                if (frame_item._adjust_width == 0 && frame_item._adjust_height == 0)
                {
                    frame_item._move(lastx, lasty, defaultwidth, defaultheight);

                    lastx += cascadegap;
                    lasty += cascadegap;
                }
            }
            frame_item.on_created();
        }
        this._resetSplitter();
    };

    _pFrameSetBase.on_destroy_contents = function ()
    {
        nexacro.Frame.prototype.on_destroy_contents.call(this);

        var cnt = this._p_frames.length;
        for (var i = cnt - 1; i >= 0; i--)
        {
            var frame_item = this._p_frames[i];
            if (frame_item)
            {
                frame_item.destroyComponent();
                //frame_item = null;
            }
        }
        this._p_frames = null;

        this._destroySplitter();
    };

    //===============================================================
    // nexacro.FrameSetBase : Properties
    //===============================================================
    /*
    _pFrameSetBase.set_ctrltaborder = function ()
    {
        //block;
    };
 
    _pFrameSetBase.set_ctrltabtype = function ()
    {
        //block;
    };
 
    _pFrameSetBase.set_tabkeycirculation = nexacro._emptyFn;
    */

    _pFrameSetBase.set_separatesize = function (v)
    {
        v = nexacro._toString(v);

        if (this._p_separatesize != v)
        {
            this._p_separatesize = v;
            this._separatesize = v.split(",");

            var control_elem = this._control_element;
            if (control_elem)
                this.on_change_containerRect(this._getClientWidth(), this._getClientHeight());
        }
    };

    _pFrameSetBase.set_splittertype = function (v)
    {
        var splittertype = this._p_splittertype;
        if (splittertype == v)
            return;

        // "none","live","deferred"
        switch (v)
        {
            case "none":
            case "live":
            case "deferred":
                this._p_splittertype = v;
                break;
        }
        this._resetSplitter();
    };

    _pFrameSetBase.set_splittermargin = function (v)
    {
        const splittermargin = parseInt(v);
        if (!splittermargin)
            return;

        if (this._p_splittermargin != splittermargin)
        {
            this._p_splittermargin = splittermargin;

            this._resetSplitter();
        }
    };

    _pFrameSetBase.set_splittersize = function (v)
    {
        const splittersize = parseInt(v);
        if (!splittersize)
            return;

        if (this._p_splittersize != splittersize)
        {
            this._p_splittersize = splittersize;
            this._splitteroffset = Math.trunc(this._p_splittersize / 2);

            this._resetSplitter();
        }
    };

    _pFrameSetBase.set_keepseparatesizewhenswap = function (v)
    {
        var keepseparatesizewhenswap = nexacro._toBoolean(v);
        if (this._p_keepseparatesizewhenswap != keepseparatesizewhenswap)
        {
            this._p_keepseparatesizewhenswap = keepseparatesizewhenswap;
        }
    };

    _pFrameSetBase.set_minimizedchildposition = function (v)
    {
        var pre = this._p_minimizedchildposition;
        if (pre == v)
            return;

        // "left","top","right","bottom"
        switch (v)
        {
            case "left":
                this._minimizedchildposition = 0;
                this._p_minimizedchildposition = v;
                break;
            case "top":
                this._minimizedchildposition = 1;
                this._p_minimizedchildposition = v;
                break;
            case "right":
                this._minimizedchildposition = 2;
                this._p_minimizedchildposition = v;
                break;
            case "bottom":
                this._minimizedchildposition = 3;
                this._p_minimizedchildposition = v;
                break;
        }

        var control_elem = this._control_element;
        if (this._p_minimizedchildposition == v && control_elem)
            this.on_change_containerRect(this._getClientWidth(), this._getClientHeight());

    };

    _pFrameSetBase.set_pinned = function (v)
    {
        var pinned = nexacro._toBoolean(v);
        if (this._p_pinned != pinned)
        {
            this._p_pinned = pinned;
            this.on_apply_pinned(pinned);
        }
    };

    _pFrameSetBase.on_apply_pinned = function (v)
    {
        this._notifyTabBarFrameState(v ? "pinned" : "unpinned");
    };

    _pFrameSetBase.set_allowtabbaritempinbutton = function (v)
    {
        var allowtabbaritempinbutton = nexacro._toBoolean(v);
        if (this._p_allowtabbaritempinbutton != allowtabbaritempinbutton)
        {
            this._p_allowtabbaritempinbutton = allowtabbaritempinbutton;
            this.on_apply_allowtabbaritempinbutton();
        }
    };

    _pFrameSetBase.on_apply_allowtabbaritempinbutton = function ()
    {
        this._notifyTabBarFrameState("updateitem");
    };

    _pFrameSetBase._properties = [
        { name: "ctrltaborder", readonly: true },
        { name: "ctrltabtype", readonly: true },
        { name: "tabkeycirculation", readonly: true },
        { name: "separatesize" },
        { name: "splittertype" },
        { name: "splittermargin" },
        { name: "splittersize" },
        { name: "keepseparatesizewhenswap" },
        { name: "minimizedchildposition" },
        { name: "pinned" },
        { name: "allowtabbaritempinbutton" }
    ];
    nexacro._defineProperties(_pFrameSetBase, _pFrameSetBase._properties);


    //===============================================================
    // nexacro.FrameSetBase : Event Handlers
    //===============================================================

    _pFrameSetBase._on_child_movetrack = function (child, x, y, dragdata)
    {
        // frame swap을 위한 hittest rule은 좀더 보완이 필요. 아주 작은 frame과 아주 큰 frame swap시 문제

        // hittest
        var checkx = (this._type_name == "VFrameSet") ? false : true;
        var checky = (this._type_name == "HFrameSet") ? false : true;
        var curx = child._adjust_left + (child._adjust_width / 2);
        var cury = child._adjust_top + (child._adjust_height / 2);
        var hitidx = -1;

        var frames = this._p_frames;
        var len = frames.length;
        for (var i = 0; i < len; i++)
        {
            var frame = frames[i];
            if (frame == child)
                continue;

            if (frame._state_openstatus == 2)
                continue;

            if (checkx)
            {
                var loopleft = frame._adjust_left;
                var loopright = loopleft + frame._adjust_width;
                if (loopleft > curx)
                    continue;

                if (loopright < curx)
                    continue;
            }

            if (checky)
            {
                var looptop = frame._adjust_top;
                var loopbottom = looptop + frame._adjust_height;
                if (looptop > cury)
                    continue;

                if (loopbottom < cury)
                    continue;
            }

            hitidx = i;
            break;
        }

        // index swap 처리
        if (hitidx != (-1))
        {
            var curidx = frames.indexOf(child.name);
            var hitchild = frames[hitidx];

            frames.remove_item(hitchild.name);
            frames.insert_item(curidx, hitchild.name, hitchild);

            frames.remove_item(child.name);
            frames.insert_item(hitidx, child.name, child);

            /*
            // TODO 차후변경 (9.2에 반영된 후)
            // 현재: 0 1 2 3 --(0,3스왑)--> 3 1 2 0
            // 차후: 0 1 2 3 -------------> 1 2 3 0
            // (중간 index가 뒤엉키지 않도록 설계 방안이 나와있다)
            this.frames.remove_item(child.name);
            this.frames.insert_item(hitidx, child.name, child);
            */

            if (this._control_element)
                this.on_change_containerRect(this._getClientWidth(), this._getClientHeight());
        }
    };

    _pFrameSetBase._on_child_starttrack = function (child, x, y, dragdata)
    {
        if (child)
            this._track_frame = child;

        this._resetSplitterZIndex();
    };

    _pFrameSetBase._on_child_endtrack = function (child, x, y, dragdata)
    {
        this._track_frame = null;

        if (this._control_element)
            this.on_change_containerRect(this._getClientWidth(), this._getClientHeight());
    };

    _pFrameSetBase._on_splitter_movetrack = function (splitter, x, y)
    {
        this._moveSplitter(splitter, x, y, this._p_splittertype === "deferred");
    };

    _pFrameSetBase._on_splitter_starttrack = function (splitter)
    {
        const splitterinfo = this._splittermap.get(splitter);
        if (!splitterinfo)
            return false;

        const frame1 = this._p_frames[splitterinfo.frameidx];
        const frame2 = this._p_frames[splitterinfo.frameidx + 1];

        if (frame1 && frame2)
        {
            this._splitter_trackinfo = {
                x: splitterinfo.obj.left,
                y: splitterinfo.obj.top,
                frame1: {
                    obj: frame1,
                    width: frame1.width,
                    height: frame1.height
                },
                frame2: {
                    obj: frame2,
                    left: frame2.left,
                    top: frame2.top,
                    width: frame2.width,
                    height: frame2.height,
                }
            };
        }
        else
            return false;

        this._moveSplitter(splitter, 0, 0, this._p_splittertype === "deferred");

        return true;
    };

    _pFrameSetBase._on_splitter_endtrack = function (splitter, x, y)
    {
        this._moveSplitter(splitter, x, y);
        this._updateSeparateSize(splitter, x, y);

        this._splitter_trackinfo = null;
    };

    _pFrameSetBase._changeStateActivate = function (cur, activated_child)
    {
        // CHANGE_ALL_TO : child의 activate에 영향을 받는 부분
        if (cur == true)
        {
            if (activated_child)
            {
                var cur_active = this.getActiveFrame();
                if (cur_active && cur_active != activated_child)
                {
                    cur_active._changeStateActivate(false, null);
                }

                this._active_frame = activated_child;
                if (activated_child._control_element)
                {
                    if (this._zordermap.indexOf(activated_child) < 0)
                    {
                        // error
                        //alert("zorder missed: " + activated_child.id);
                        this._zordermap.insert_item(0, activated_child, activated_child.id);
                    }

                    // 현재 zorderMap상 top에 있다해도 다시한번 수행. 최초 addChild시 Sync를 맞출수 없음.
                    // && owner_frame._zordermap[owner_frame._zordermap.length - 1] != this          
                    if (this._zordermap.length > 1)
                    {
                        if (this._control_element)
                            this._control_element.bringToFrontElement(activated_child._control_element);

                        this._zordermap.remove_item(activated_child.id);
                        this._zordermap.add_item(activated_child.id, activated_child);

                        this._resetSplitterZIndex();
                    }

                    if (this._max_frame && this._max_frame != activated_child)
                    {
                        activated_child._changeOpenStatus(3);
                    }
                }
            }
        }
        else if (cur == false)
        {
            // 내 하위 frame을 모두 deactivate 처리
            var frames = this._p_frames;
            var frames_len = frames.length;
            for (var i = 0; i < frames_len; i++)
            {
                var child = frames[i];
                if (child._isNested())
                    child._changeStateActivate(false);
            }
        }

        // CHANGE_FROM_TO
        nexacro.Frame.prototype._changeStateActivate.call(this, cur);
    };

    _pFrameSetBase._changeStateFocus = function (cur, activated_child)
    {
        // CHANGE_ALL_TO : child의 activate에 영향을 받는 부분
        if (cur == true)
        {
            if (activated_child)
            {
                var cur_active = this.getActiveFrame();
                if (cur_active && cur_active != activated_child)
                {
                    cur_active._changeStateActivate(false, null);
                }

                this._active_frame = activated_child;
                if (activated_child._control_element)
                {
                    if (this._zordermap.indexOf(activated_child) < 0)
                    {
                        // error
                        //alert("zorder missed: " + activated_child.id);
                        this._zordermap.insert_item(0, activated_child, activated_child.id);
                    }

                    // 현재 zorderMap상 top에 있다해도 다시한번 수행. 최초 addChild시 Sync를 맞출수 없음.
                    // && owner_frame._zordermap[owner_frame._zordermap.length - 1] != this          
                    if (this._zordermap.length > 1)
                    {
                        if (this._control_element)
                            this._control_element.bringToFrontElement(activated_child._control_element);

                        this._zordermap.remove_item(activated_child.id);
                        this._zordermap.add_item(activated_child.id, activated_child);

                        this._resetSplitterZIndex();
                    }

                    if (this._max_frame && this._max_frame != activated_child)
                    {
                        activated_child._changeOpenStatus(3);
                    }
                }
            }
        }
        else if (cur == false)
        {
            // 내 하위 frame을 모두 deactivate 처리
            var frames = this._p_frames;
            var frames_len = frames.length;
            for (var i = 0; i < frames_len; i++)
            {
                var child = frames[i];
                if (child._isNested())
                    child._changeStateActivate(false);
            }
        }

        // CHANGE_FROM_TO
        nexacro.Frame.prototype._changeStateFocus.call(this, cur);
    };
    _pFrameSetBase.on_apply_prop_enable = function (v)
    {
        var frames = this._p_frames;
        var len = frames.length;
        for (var i = 0; i < len; i++)
        {
            var frame = frames[i];
            frame._setEnable(v);
        }

        this._notifyTabBarFrameState(v ? "enable" : "disable");
    };

    _pFrameSetBase.on_apply_prop_stringresource = function ()
    {
        if (!nexacro._StringResource)
            return;

        var frames = this._p_frames;
        var frames_len = frames.length;
        for (var i = 0; i < frames_len; i++)
        {
            var frame = frames[i];
            frame.on_apply_prop_stringresource();
        }

        this.on_apply_prop_tooltip();

        this._applyStatusText();
        this._applyTitleText();

        if (this._env._p_enableaccessibility)
        {
            this.on_apply_prop_accessibilitylabel();
            this.on_apply_prop_accessibilitydescription();
            this.on_apply_prop_accessibilityaction();
        }
    };

    _pFrameSetBase._cancelEvent = function (target_comp)
    {
        if (target_comp)
            target_comp._cancelEvent();
    };

    //===============================================================
    // nexacro.FrameSetBase : Methods
    //===============================================================
    _pFrameSetBase.getActiveFrame = function ()
    {
        if (this._active_frame)
            return this._active_frame;

        return this._getTopOrderFrame();
    };

    _pFrameSetBase.getHandle = function ()
    {
    };

    _pFrameSetBase.getCurrentSeparateSize = function ()
    {
        return this._separatesize.map(item => `${item}`).join(',');
    };

    //===============================================================
    // nexacro.FrameSetBase : Logical Part
    //===============================================================

    _pFrameSetBase._getTopOrderFrame = function ()
    {
        var len = this._zordermap.length;
        if (len > 0)
        {
            var obj = this._zordermap.get_item(len - 1);
            return obj;
        }

        return null;
    };

    _pFrameSetBase._getNextOrderFrame = function (target)
    {
        var len = this._zordermap.length;
        if (len > 0)
        {
            var idx = this._zordermap.indexOf(target.id);
            if (idx - 1 > len - 1 && idx - 1 < 0)
                return null;

            var obj = this._zordermap.get_item(idx - 1);
            return obj;
        }
        return null;
    };

    _pFrameSetBase._visibleFrameCount = function ()
    {
        return this._p_frames.length;
    };

    _pFrameSetBase._getMinimizeFrameCount = function ()
    {
        var cnt = 0;
        var frames = this._p_frames;
        var len = frames.length;
        for (var i = 0; i < len; i++)
        {
            if (this._p_frames[i]._state_openstatus == 2)
                cnt++;
        }
        return cnt;
    };

    _pFrameSetBase._recalcSeparateFrameSize = function (totalsize, inframecnt, inseparatecnt)
    {
        var separateframesize = [];

        //var separatesizecnt = ((inseparatecnt) ? inseparatecnt : this._separatesize.length);
        var framecnt = ((inframecnt) ? inframecnt : this._visibleFrameCount());

        var dividecnt = 0, fixedcnt = 0;
        var totalfixedsize = 0, dividesize = 0;

        var separatesize = this._separatesize;
        var i;
        for (i = 0; i < framecnt; i++)
        {
            var str = separatesize[i];
            var pos = -1;
            var size = -1;
            if (str)
            {
                str.trim();
                pos = str.indexOf("*");
                size = ((pos < 0) && (str.length > 0)) ? parseFloat(str) : -1;
            }
            if (size == -1)
            {
                var ntimes = -1;
                if (str)
                    ntimes = parseFloat(str.substring(0, pos));

                if (ntimes > 0)
                {
                    dividecnt += ntimes;
                    separateframesize[i] = { size: ntimes * size, fixed: false };
                }
                else
                {
                    dividecnt++;
                    separateframesize[i] = { size: size, fixed: false };
                }
            }
            else
            {
                fixedcnt++;
                totalfixedsize += size;
                if (totalfixedsize <= totalsize)
                    separateframesize[i] = { size: size, fixed: true };
                else if (fixedcnt == 1)
                    separateframesize[i] = { size: totalsize, fixed: true };
                else
                {
                    separateframesize[i] = { size: 0, fixed: true };
                    totalfixedsize -= size;
                }
            }
        }

        dividesize = dividecnt > 0 ? (totalsize - totalfixedsize) / dividecnt : 0;

        // TODO check frameset내 frame중 right가 frameset의 client를 벗어나는 frame은 0크기를 갖는다. -> 안보임. 9.2도 동일
        for (i = 0; i < framecnt; i++)
        {
            if (separateframesize[i].size < 0)
            {
                separateframesize[i].size = Math.round(Math.abs(separateframesize[i].size) * dividesize);
            }
            else if (separateframesize[i] == undefined)
                separateframesize[i] = { size: 0, fixed: true };
        }

        return separateframesize;
    };

    _pFrameSetBase._getTitleText = function (brecursive)
    {
        var titletext;
        titletext = this._getStringResourceProperty(this._p_titletext);
        if (brecursive)
        {
            var activeframe = this.getActiveFrame();
            if (activeframe)
            {
                var subtitletext = activeframe._getTitleText(true);
                subtitletext = this._getStringResourceProperty(subtitletext);
                if (subtitletext && subtitletext.length > 0)
                {
                    if (titletext.length > 0)
                        titletext += " - ";
                    titletext += subtitletext;
                }
            }
        }
        return titletext;
    };

    _pFrameSetBase._getStatusText = function (brecursive)
    {
        var statustext;
        statustext = this._p_statustext;
        if (brecursive)
        {
            var activeframe = this.getActiveFrame();
            if (activeframe)
            {
                var substatustext = activeframe._getStatusText(true);
                if (substatustext.length > 0)
                {
                    if (statustext.length > 0)
                        statustext += " - ";
                    statustext += substatustext;
                }
            }
        }
        return statustext;
    };

    _pFrameSetBase._getFocusChildFrame = function (frame)
    {
        var _tabkeycirculation = this._tabkeycirculation;
        var _last_focused = this._last_focused;
        if (this._is_frameset &&
            this instanceof nexacro.FrameSet)
        {
            if (_tabkeycirculation == 2 || _tabkeycirculation == 3)
            {
                if (((_tabkeycirculation == 2 || _tabkeycirculation == 3) && this._arrange == 0) ||
                    (_tabkeycirculation == 2 && this._arrange != 0))
                {
                    if (_last_focused)
                    {
                        if (_last_focused._isFocusAcceptable())
                        {
                            return _last_focused;
                        }
                        else
                        {
                            if (frame._isFocusAcceptable())
                                return frame;
                        }
                    }
                    else
                    {
                        if (frame._isFocusAcceptable())
                            return frame;
                    }
                }
                else if (_tabkeycirculation == 3)
                {
                    if (frame._isFocusAcceptable())
                        return frame;
                }
            }
            else
            {
                if (_tabkeycirculation == 0 ||
                    (_tabkeycirculation == 1 && frame._state_openstatus != 2))
                {
                    if (frame._isFocusAcceptable())
                        return frame;
                }
            }
        }
        else if (frame._isFocusAcceptable())
        {
            return frame;
        }

        return null;
    };

    _pFrameSetBase._getNextChildFrame = function (frames)
    {
        var n = frames ? frames.length : 0;
        for (var i = 0; i < n; i++)
        {
            var frame_ = frames[i];
            if (frame_._is_frameset)
            {
                if (frame_._getNextChildFrame)
                {
                    var ret = frame_._getNextChildFrame(frame_._p_frames);
                    if (ret) return ret;
                }
            }
            else
            {
                if (frame_._p_parent._is_frameset)
                {
                    var f = frame_._p_parent._getFocusChildFrame(frame_);
                    if (f)
                    {
                        return f;
                    }
                    else
                    {
                        continue;
                    }
                }
            }
        }

        return null;
    };

    _pFrameSetBase._getNextFrame = function (id, cycle)
    {
        //var childframe_idx = -1;
        //var frameset_idx = -1;
        var frames = this._p_frames;
        var n = frames ? frames.length : 0;
        var frame = null;
        for (var i = 0; i < n; i++)
        {
            if (frames[i]._is_frameset)
            {
                if (id != frames[i].id)
                {
                    if (frames[i]._isFocusAcceptable())
                    {
                        frame = frames[i]._getNextChildFrame(frames[i]._p_frames);
                        break;
                    }
                }
            }
            else if (frames[i] instanceof nexacro.ChildFrame)
            {
                if (frames[i]._isFocusAcceptable() && frames[i]._p_formurl)
                {
                    frame = this._getFocusChildFrame(frames[i]);
                    break;
                }
                else
                    continue;
            }
        }

        if (this._p_parent._is_frameset)
            return this._p_parent._getNextFrame(this._p_parent.id, cycle);
        else
        {
            // mainframe에 달린 focus가능한 frame으로 이동
            if (cycle)
            {
                // this.parnet = mainframe
                if (frame) return frame;
            }
            else
                return null;
        }

        return null;
    };

    _pFrameSetBase._getPrevChildFrame = function (frames)
    {
        var _frames = frames ? frames : null;
        if (_frames)
        {
            var n = _frames.length;
            for (var i = n - 1; i >= 0; i--)
            {
                var frame_ = _frames[i];
                if (frame_._getPrevChildFrame)
                {
                    var ret = frame_._getPrevChildFrame(frame_._p_frames);
                    if (ret) return ret;
                }
                else
                {
                    if (frame_._p_parent._is_frameset)
                    {
                        var f = frame_._p_parent._getFocusChildFrame(frame_);
                        if (f)
                        {
                            return f;
                        }
                        else
                        {
                            continue;
                        }
                    }
                }
            }
        }
        return null;
    };

    _pFrameSetBase._getPrevFrame_ = function (id, cycle)
    {
        var childframe_idx = -1;
        var frameset_idx = -1;
        var frames = this._p_frames;
        var n = frames ? frames.length : 0;
        var frame = null;
        for (var i = n - 1; i >= 0; i--)
        {
            if (frames[i]._is_frameset)
            {
                if (id == frames[i].id)
                    frameset_idx = i;
                else
                {
                    if (frames[i]._isFocusAcceptable())
                    {
                        frame = frames[i]._getPrevChildFrame(frames[i]._p_frames);
                        break;
                    }
                }
            }
            else if (frames[i] instanceof nexacro.ChildFrame)
            {
                if (frames[i]._p_formurl && childframe_idx == -1 && frames[i]._isFocusAcceptable())
                {
                    childframe_idx = i;
                    frame = this._getFocusChildFrame(frames[i]);
                    break;
                }
                else
                    continue;
            }
        }

        if (childframe_idx != -1 && childframe_idx < frameset_idx)
        {
            //if (cycle)
            {
                if (frame) return frame;
            }
            //else
            //    return null;
        }
        else
        {
            if (this._p_parent._is_frameset)
                return this._p_parent._getPrevFrame_(this._p_parent.id, cycle);
            else
            {
                // mainframe에 달린 focus가능한 frame으로 이동
                if (cycle)
                {
                    // this.parnet = mainframe
                    if (frame) return frame;
                }
                else
                    return null;
            }
        }

        return null;
    };

    _pFrameSetBase._on_apply_locale = function (v)
    {
        var frames = this._p_frames;
        if (frames)
        {
            var frame;
            for (var i = 0; i < frames.length; i++)
            {
                frame = frames[i];
                if (frame)
                {
                    frame._on_apply_locale(v);
                }
            }
        }
    };

    _pFrameSetBase._findSplitterIndices = function (sepraraterealsize)
    {
        const indices = [];
        const rangesToIndices = function (range)
        {
            const start = range.start;
            const end = range.end;

            if (start !== end)
            {
                const ranges = [...Array(end - start)].map((_, i) => start + i);

                indices.push(...ranges);
            }
        }

        let currentRange = null;

        sepraraterealsize.forEach((item, index) =>
        {
            if (!item.fixed) // splitter 는 frame 사이에 존재하므로 resize 가 가능한 frame 의 연속된 구간을 찾는다.
            {
                if (currentRange === null)
                    currentRange = { start: index, end: index };
                else
                    currentRange.end = index;
            }
            else 
            {
                if (currentRange !== null) 
                {
                    rangesToIndices(currentRange);
                    currentRange = null;
                }
            }
        });

        if (currentRange !== null)
            rangesToIndices(currentRange);

        return indices;
    };

    _pFrameSetBase._resetSplitterZIndex = function ()
    {
        let zindex = -1;

        const elem = this.getElement();
        if (elem)
        {
            let max_zindex = elem._max_child_zindex * 10; // childframe 의 zindex 가 10 단위로 설정되고 11~18 은 resizeborder 가 사용중임

            if (this._track_frame)
                zindex = max_zindex - 1; // track 중인 childframe 아래로 위치 시킴
            else
                zindex = max_zindex + 9; // track 이 종료되면 모든 childframe 의 위에 위치시킴
        }

        const splittermap = this._splittermap;
        if (splittermap)
        {
            splittermap.forEach((splitterinfo, key) =>
            {
                splitterinfo.obj.set_zindex(zindex);
            });
        }
    };

    _pFrameSetBase._getSplitterPosition = function (index)
    {
        const sepraraterealsize = this._separaterealsize;

        let pos = 0;
        for (let i = 0; i <= index; i++) 
        {
            pos += sepraraterealsize[i].size;
        }
        return pos;
    };

    _pFrameSetBase._recalcSeparateSize = function (separaterealsize, framesetsize)
    {
        // separaterealsize 로부터 this._separatesize 를 갱신, 속성으로 설정된 비율값 사용 패턴은 유지
        const separatesize = this._separatesize;

        let totalfixedsize = 0;
        let divideindex = [];

        separaterealsize.forEach((item, index) =>
        {
            if (item.fixed === true)
                totalfixedsize += item.size;
            else
                divideindex.push(index);
        });

        let dividesize = framesetsize - totalfixedsize;
        if (dividesize <= 0)
            return;

        const toDecimalStr = (value) =>
        {
            let decimalValue = value * 10; // 소수점 첫째짜리 정수화

            return decimalValue.toPrecision(5); // 유효자리수 다섯자리까지 사용
        };

        divideindex.forEach((index) => 
        {
            separatesize[index] = toDecimalStr(separaterealsize[index].size / dividesize) + '*';
        });
    };

    _pFrameSetBase._adjustSplitterPos = function (splitter, x, y)
    {
        // sibling splitter 의 hittest 영역이 겹치지 않도록 하는 최소 제한값
        const limit = this._p_splittersize + (this._p_splittermargin * 2);

        return {
            adjustedX: this._adjustSplitterPosX(splitter, x, limit),
            adjustedY: this._adjustSplitterPosY(splitter, y, limit)
        };
    };

    _pFrameSetBase._adjustSplitterPosX = function (splitter, x, limit)
    {
        return x;
    };

    _pFrameSetBase._adjustSplitterPosY = function (splitter, y, limit)
    {
        return y;
    };

    _pFrameSetBase._moveSplitter = function (splitter, x, y, ghost)
    {
        const trackinfo = this._splitter_trackinfo;
        if (trackinfo)
        {
            const { adjustedX, adjustedY } = this._adjustSplitterPos(splitter, x, y);

            if (ghost)
                splitter.set_movetype("ghost");
            else
            {
                splitter.set_movetype("self");

                trackinfo.frame1.obj.resize(trackinfo.frame1.width + adjustedX,
                    trackinfo.frame1.height + adjustedY);

                trackinfo.frame2.obj._move(trackinfo.frame2.left + adjustedX,   // move 를 사용하면 frame swap 동작과 충돌이 발생 하므로 _move 사용
                    trackinfo.frame2.top + adjustedY,
                    trackinfo.frame2.width - adjustedX,
                    trackinfo.frame2.height - adjustedY);
            }
            splitter.move(trackinfo.x + adjustedX, trackinfo.y + adjustedY);
        }
    };

    _pFrameSetBase._createSplitter = function (index)
    {
        return undefined;
    };

    _pFrameSetBase._updateSeparateSize = function (splitter, x, y)
    {
    };

    _pFrameSetBase._repositionSplitter = function (splitter, index)
    {
    };

    _pFrameSetBase._destroySplitter = function ()
    {
        const splittermap = this._splittermap;
        if (splittermap)
        {
            splittermap.forEach((splitterinfo, key) =>
            {
                splitterinfo.obj.destroy();
                splitterinfo.obj = null;
            });
            splittermap.clear();
        }
    };

    _pFrameSetBase._resetSplitter = function ()
    {
        this._destroySplitter();

        if (this._p_splittertype === "none")
            return;

        if (this._max_frame)
            return;

        const sepraraterealsize = this._separaterealsize;
        if (sepraraterealsize)
        {
            let idx = 0;
            const splitterIndices = this._findSplitterIndices(sepraraterealsize);
            const frames = this._p_frames;
            splitterIndices.forEach(frameidx =>
            {
                if (frames[frameidx]._state_openstatus == 2 ||
                    frames[frameidx + 1]._state_openstatus == 2)
                    return;

                const splitter = this._createSplitter(idx);
                if (splitter)
                {
                    this._splittermap.set(splitter, { obj: splitter, idx: idx++, frameidx: frameidx });
                    this._repositionSplitter(splitter, frameidx);
                }
            });
            this._resetSplitterZIndex();
        }
    };

    //===============================================================
    // nexacro.FrameSet
    //===============================================================
    nexacro.FrameSet = function (id, left, top, width, height, right, bottom, parent)
    {
        nexacro.FrameSetBase.call(this, id, left, top, width, height, right, bottom, parent);

        this._separatesize = [];
        this._tabbar = new nexacro.TabBarControl("tabbar", 0, 0, 0, 0, null, null, null, null, null, null, this);
    };

    var _pFrameSet = nexacro._createPrototype(nexacro.FrameSetBase, nexacro.FrameSet);
    nexacro.FrameSet.prototype = _pFrameSet;

    // overide nexacro.Object
    _pFrameSet._type_name = "FrameSet";

    _pFrameSet._p_separatesize = "";
    _pFrameSet._p_keepseparatesizewhenswap = false;
    _pFrameSet._p_ctrltaborder = 0;
    _pFrameSet._p_ctrltabtype = 0;
    _pFrameSet._p_minimizedchildposition = "bottom";
    _pFrameSet._p_tabkeycirculation = "all";    // all, (all,no_minimize), active_only, auto
    _pFrameSet._p_restorechildpositiontype = "normal";
    _pFrameSet._p_showtabbar = false;
    _pFrameSet._p_tabbarsize = undefined;
    _pFrameSet._p_tabbarposition = "top";
    _pFrameSet._p_tabbarextrabuttoncount = 0;
    _pFrameSet._p_tabbarextrabuttontooltiptext = undefined;
    _pFrameSet._p_tabbaritemheight = undefined;
    _pFrameSet._p_tabbaritemminheight = undefined;
    _pFrameSet._p_tabbaritemmaxheight = undefined;
    _pFrameSet._p_tabbaritemwidth = undefined;
    _pFrameSet._p_tabbaritemminwidth = undefined;
    _pFrameSet._p_tabbaritemmaxwidth = undefined;
    _pFrameSet._p_tabbaritemgap = 0;
    _pFrameSet._p_tabbaritemjustify = false;
    _pFrameSet._p_tabbaritemusepinbutton = false;
    _pFrameSet._p_tabbaritempinbuttonposition = "start";
    _pFrameSet._p_tabbaritempinbuttonsize = undefined;
    _pFrameSet._p_tabbaritemclosebuttonsize = undefined;
    _pFrameSet._p_tabbarbuttonshow = "all";
    _pFrameSet._p_tabbarbuttongap = 4;
    _pFrameSet._p_tabbarbuttonsize = undefined;
    _pFrameSet._p_tabbarbuttonseparatorsize = 1;

    /* event list */
    _pFrameSet._event_list =
    {
        "ontabbarextrabuttonclick": 1
    }

    //------------ internal variable ------------//
    _pFrameSet._tabkeycirculation = 0;
    _pFrameSet._minimizedchildposition = 3;
    _pFrameSet._is_autorecalc_frame = false;
    _pFrameSet._arrange = 0;  // 0:cascade, 1:tilevertical, 2:tilehorizontal, 3:vertical, 4:horizontal

    //===============================================================
    // nexacro.FrameSet : Create & Destroy & Update
    //===============================================================
    _pFrameSet.on_create_contents = function ()
    {
        nexacro.FrameSetBase.prototype.on_create_contents.call(this);

        if (this._isShowTabBar())
        {
            this._tabbar.createComponent(true);
            this._repositionTabBar();
        }
    };

    _pFrameSet.on_created_contents = function (win)
    {
        nexacro.FrameSetBase.prototype.on_created_contents.call(this, win);

        if (this._isShowTabBar())
        {
            this._applyTabBarProperties();
            this._tabbar.on_created(win);
        }
    };

    _pFrameSet.on_destroy_contents = function (callremovechild)
    {
        nexacro.FrameSetBase.prototype.on_destroy_contents.call(this);

        if (this._tabbar)
        {
            this._tabbar.destroyComponent(callremovechild)
            this._tabbar = null;
        }
    };

    //===============================================================
    // nexacro.FrameSet : EventHandler
    //===============================================================
    _pFrameSet.on_fire_onsize = function (width, height)
    {
        this._repositionTabBar(); // NC Control 이므로 여기서 처리

        return nexacro.Component.prototype.on_fire_onsize.call(this, width, height);
    };

    _pFrameSet.on_fire_ontabbarextrabuttonclick = function (obj, e)
    {
        if (this.ontabbarextrabuttonclick && this.ontabbarextrabuttonclick._has_handlers)
        {
            var evt = new nexacro.ClickEventInfo(this, "ontabbarextrabuttonclick", e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.fromobject, e.fromreferenceobject, e.metakey);
            var ret = this.ontabbarextrabuttonclick._fireEvent(this, evt);
            evt.destroy();
            return ret;
        }
        return false;
    };

    //===============================================================
    // nexacro.FrameSet : override
    //===============================================================
    _pFrameSet.on_change_containerRect = function (width, height)
    {
        this._repositionFrames(width, height);
    };

    _pFrameSet.addChild = function (id, obj)
    {
        const addedIdx = nexacro.Frame.prototype.addChild.call(this, id, obj);
        if (addedIdx < 0)
            return;

        this._tabbar.addItem(obj);
        this._repositionTabBar();
        return addedIdx;
    }

    _pFrameSet.insertChild = function (idx, id, obj)
    {
        const insertedIdx = nexacro.Frame.prototype.insertChild.call(this, idx, id, obj);
        if (insertedIdx < 0)
            return;

        this._tabbar.insertItem(insertedIdx, obj);
        this._repositionTabBar();
        return insertedIdx;
    }

    _pFrameSet.removeChild = function (id)
    {
        const removedFrame = nexacro.Frame.prototype.removeChild.call(this, id);
        if (!removedFrame)
            return;

        this._tabbar.removeItem(removedFrame);
        this._repositionTabBar();
        return removedFrame;
    }

    //===============================================================
    // nexacro.FrameSet : Properties
    //===============================================================

    _pFrameSet.set_tabkeycirculation = function (v)
    {
        this._p_tabkeycirculation = v;
        switch (v)
        {
            case "all,no_minimize":
                this._tabkeycirculation = 1;
                break;
            case "active_only":
                this._tabkeycirculation = 2;
                break;
            case "auto":
                this._tabkeycirculation = 3;
                break;
            default:    // all
                this._tabkeycirculation = 0;
                this._p_tabkeycirculation = "all";
                break;
        }
    };

    _pFrameSet.set_minimizewidth = function (minimizewidth)
    {
        minimizewidth = parseInt(minimizewidth);
        this._p_minimizewidth = minimizewidth;
        this.on_apply_minimizewidth(minimizewidth);
    };

    _pFrameSet.on_apply_minimizewidth = function ()
    {
        if (this._is_created)
            this.on_change_containerRect(this._getClientWidth(), this._getClientHeight());
    };

    _pFrameSet.set_minimizeheight = function (minimizeheight)
    {
        minimizeheight = parseInt(minimizeheight);
        this._p_minimizeheight = minimizeheight;
        this.on_apply_minimizeheight(minimizeheight);
    };

    _pFrameSet.on_apply_minimizeheight = function ()
    {
        if (this._is_created)
            this.on_change_containerRect(this._getClientWidth(), this._getClientHeight());
    };


    /* "normal" : 제일 상위의 frame이 normal->maximize로 변경시 _restore_position 값을 저장함, min/max -> normal 로 변경될때 그 값으로 restore
            "keepmaximizeposition" : 제일 상위의 frame 이  normal->maximize로 변경시 _restore_position 값을 
        */
    _pFrameSet.set_restorechildpositiontype = function (val)
    {
        var restorechildpositiontype = val;

        if (this._p_restorechildpositiontype != restorechildpositiontype)
        {
            switch (restorechildpositiontype)
            {
                case "normal":
                case "keepmaximizeposition":
                    this._p_restorechildpositiontype = restorechildpositiontype;
                    break;
                default:
                    break;
            }
        }
    };

    _pFrameSet.set_showtabbar = function (val)
    {
        const v = nexacro._toBoolean(val);
        if (this._p_showtabbar != v)
        {
            this._p_showtabbar = v;
            this.on_apply_showtabbar();
        }
    };

    _pFrameSet.on_apply_showtabbar = function ()
    {
        const tabbar = this._tabbar;
        if (tabbar)
        {
            if (!tabbar._is_created)
                tabbar.createComponent();

            tabbar.set_visible(this._p_showtabbar);
            this._repositionTabBar();
        }
    };

    _pFrameSet.set_tabbarposition = function (val)
    {
        if (this._p_tabbarposition != val)
        {
            this._p_tabbarposition = val;
            this.on_apply_tabbarposition();
        }
    };

    _pFrameSet.on_apply_tabbarposition = function ()
    {
        const tabbar = this._tabbar;
        if (tabbar)
        {
            tabbar.set_attachposition(this._p_tabbarposition);

            this._repositionTabBar();

            if (tabbar._is_created)
            {
                if (!this._isShowTabBar())
                    return;

                const activeFrame = this.getActiveFrame();
                if (activeFrame)
                    activeFrame._setBorderNoneForTabBar(true);
            }
        }
    };

    _pFrameSet.set_tabbarsize = function (val)
    {
        if (this._p_tabbarsize != val)
        {
            this._p_tabbarsize = val;
            this.on_apply_tabbarsize();
        }
    };

    _pFrameSet.on_apply_tabbarsize = function ()
    {
        this._repositionTabBar();
    };

    _pFrameSet.set_tabbarextrabuttoncount = function (val)
    {
        if (this._p_tabbarextrabuttoncount != val)
        {
            this._p_tabbarextrabuttoncount = val;
            this.on_apply_tabbarextrabuttoncount();
        }
    };

    _pFrameSet.on_apply_tabbarextrabuttoncount = function ()
    {
        if (this._tabbar)
            this._tabbar.set_extrabuttoncount(this._p_tabbarextrabuttoncount);
    };

    _pFrameSet.set_tabbarextrabuttontooltiptext = function (val)
    {
        if (this._p_tabbarextrabuttontooltiptext != val)
        {
            this._p_tabbarextrabuttontooltiptext = val;
            this.on_apply_tabbarextrabuttontooltiptext();
        }
    };

    _pFrameSet.on_apply_tabbarextrabuttontooltiptext = function ()
    {
        if (this._tabbar)
            this._tabbar.set_extrabuttontooltiptext(this._p_tabbarextrabuttontooltiptext);
    };

    _pFrameSet.set_tabbaritemheight = function (val)
    {
        if (this._p_tabbaritemheight != val)
        {
            this._p_tabbaritemheight = val;
            this.on_apply_tabbaritemheight();
        }
    };

    _pFrameSet.on_apply_tabbaritemheight = function ()
    {
        if (this._tabbar)
            this._tabbar.set_itemheight(this._p_tabbaritemheight);

        this._repositionTabBar();
    };

    _pFrameSet.set_tabbaritemminheight = function (val)
    {
        if (this._p_tabbaritemminheight != val)
        {
            this._p_tabbaritemminheight = val;
            this.on_apply_tabbaritemminheight();
        }
    };

    _pFrameSet.on_apply_tabbaritemminheight = function ()
    {
        if (this._tabbar)
            this._tabbar.set_itemminheight(this._p_tabbaritemminheight);

        this._repositionTabBar();
    };

    _pFrameSet.set_tabbaritemmaxheight = function (val)
    {
        if (this._p_tabbaritemmaxheight != val)
        {
            this._p_tabbaritemmaxheight = val;
            this.on_apply_tabbaritemmaxheight();
        }
    };

    _pFrameSet.on_apply_tabbaritemmaxheight = function ()
    {
        if (this._tabbar)
            this._tabbar.set_itemmaxheight(this._p_tabbaritemmaxheight);

        this._repositionTabBar();
    };

    _pFrameSet.set_tabbaritemwidth = function (val)
    {
        if (this._p_tabbaritemwidth != val)
        {
            this._p_tabbaritemwidth = val;
            this.on_apply_tabbaritemwidth();
        }
    };

    _pFrameSet.on_apply_tabbaritemwidth = function ()
    {
        if (this._tabbar)
            this._tabbar.set_itemwidth(this._p_tabbaritemwidth);

        this._repositionTabBar();
    };

    _pFrameSet.set_tabbaritemminwidth = function (val)
    {
        if (this._p_tabbaritemminwidth != val)
        {
            this._p_tabbaritemminwidth = val;
            this.on_apply_tabbaritemminwidth();
        }
    };

    _pFrameSet.on_apply_tabbaritemminwidth = function ()
    {
        if (this._tabbar)
            this._tabbar.set_itemminwidth(this._p_tabbaritemminwidth);

        this._repositionTabBar();
    };

    _pFrameSet.set_tabbaritemmaxwidth = function (val)
    {
        if (this._p_tabbaritemmaxwidth != val)
        {
            this._p_tabbaritemmaxwidth = val;
            this.on_apply_tabbaritemmaxwidth();
        }
    };

    _pFrameSet.on_apply_tabbaritemmaxwidth = function ()
    {
        if (this._tabbar)
            this._tabbar.set_itemmaxwidth(this._p_tabbaritemmaxwidth);

        this._repositionTabBar();
    };

    _pFrameSet.set_tabbaritemgap = function (val)
    {
        if (this._p_tabbaritemgap != val)
        {
            this._p_tabbaritemgap = val;
            this.on_apply_tabbaritemgap();
        }
    };

    _pFrameSet.on_apply_tabbaritemgap = function ()
    {
        if (this._tabbar)
            this._tabbar.set_itemgap(this._p_tabbaritemgap);
    };

    _pFrameSet.set_tabbaritemjustify = function (val)
    {
        const v = nexacro._toBoolean(val);
        if (this._p_tabbaritemjustify != v)
        {
            this._p_tabbaritemjustify = v;
            this.on_apply_tabbaritemjustify();
        }
    };

    _pFrameSet.on_apply_tabbaritemjustify = function ()
    {
        if (this._tabbar)
            this._tabbar.set_itemjustify(this._p_tabbaritemjustify);
    };

    _pFrameSet.set_tabbaritemusepinbutton = function (val)
    {
        const v = nexacro._toBoolean(val);
        if (this._p_tabbaritemusepinbutton != v)
        {
            this._p_tabbaritemusepinbutton = v;
            this.on_apply_tabbaritemusepinbutton();
        }
    };

    _pFrameSet.on_apply_tabbaritemusepinbutton = function ()
    {
        if (this._tabbar)
            this._tabbar.set_itemusepinbutton(this._p_tabbaritemusepinbutton);

        this._repositionTabBar();
    };

    _pFrameSet.set_tabbaritempinbuttonposition = function (val)
    {
        if (this._p_tabbaritempinbuttonposition != val)
        {
            this._p_tabbaritempinbuttonposition = val;
            this.on_apply_tabbaritempinbuttonposition();
        }
    };

    _pFrameSet.on_apply_tabbaritempinbuttonposition = function ()
    {
        if (this._tabbar)
            this._tabbar.set_itempinbuttonposition(this._p_tabbaritempinbuttonposition);
    };

    _pFrameSet.set_tabbaritempinbuttonsize = function (val)
    {
        if (this._p_tabbaritempinbuttonsize != val)
        {
            this._p_tabbaritempinbuttonsize = val;
            this.on_apply_tabbaritempinbuttonsize();
        }
    };

    _pFrameSet.on_apply_tabbaritempinbuttonsize = function ()
    {
        if (this._tabbar)
            this._tabbar.set_itempinbuttonsize(this._p_tabbaritempinbuttonsize);

        this._repositionTabBar();
    };

    _pFrameSet.set_tabbaritemclosebuttonsize = function (val)
    {
        if (this._p_tabbaritemclosebuttonsize != val)
        {
            this._p_tabbaritemclosebuttonsize = val;
            this.on_apply_tabbaritemclosebuttonsize();
        }
    };

    _pFrameSet.on_apply_tabbaritemclosebuttonsize = function ()
    {
        if (this._tabbar)
            this._tabbar.set_itemclosebuttonsize(this._p_tabbaritemclosebuttonsize);

        this._repositionTabBar();
    };

    _pFrameSet.set_tabbarbuttonshow = function (val)
    {
        if (this._p_tabbarbuttonshow != val)
        {
            this._p_tabbarbuttonshow = val;
            this.on_apply_tabbarbuttonshow();
        }
    };

    _pFrameSet.on_apply_tabbarbuttonshow = function ()
    {
        if (this._tabbar)
            this._tabbar.set_buttonshow(this._p_tabbarbuttonshow);

        this._repositionTabBar();
    };

    _pFrameSet.set_tabbarbuttongap = function (val)
    {
        if (this._p_tabbarbuttongap != val)
        {
            this._p_tabbarbuttongap = val;
            this.on_apply_tabbarbuttongap();
        }
    };

    _pFrameSet.on_apply_tabbarbuttongap = function ()
    {
        if (this._tabbar)
            this._tabbar.set_buttongap(this._p_tabbarbuttongap);
    };

    _pFrameSet.set_tabbarbuttonsize = function (val)
    {
        if (this._p_tabbarbuttonsize != val)
        {
            this._p_tabbarbuttonsize = val;
            this.on_apply_tabbarbuttonsize();
        }
    };

    _pFrameSet.on_apply_tabbarbuttonsize = function ()
    {
        if (this._tabbar)
            this._tabbar.set_buttonsize(this._p_tabbarbuttonsize);

        this._repositionTabBar();
    };

    _pFrameSet.set_tabbarbuttonseparatorsize = function (val)
    {
        if (this._p_tabbarbuttonseparatorsize != val)
        {
            this._p_tabbarbuttonseparatorsize = val;
            this.on_apply_tabbarbuttonseparatorsize();
        }
    };

    _pFrameSet.on_apply_tabbarbuttonseparatorsize = function ()
    {
        if (this._tabbar)
            this._tabbar.set_buttonseparatorsize(this._p_tabbarbuttonseparatorsize);
    };

    _pFrameSet._properties = [
        { name: "tabkeycirculation" },
        { name: "minimizewidth" },
        { name: "minimizeheight" },
        { name: "restorechildpositiontype" },
        { name: "showtabbar" },
        { name: "tabbarsize" },
        { name: "tabbarposition" },
        { name: "tabbarextrabuttoncount" },
        { name: "tabbarextrabuttontooltiptext" },
        { name: "tabbaritemheight" },
        { name: "tabbaritemminheight" },
        { name: "tabbaritemmaxheight" },
        { name: "tabbaritemwidth" },
        { name: "tabbaritemminwidth" },
        { name: "tabbaritemmaxwidth" },
        { name: "tabbaritemgap" },
        { name: "tabbaritemjustify" },
        { name: "tabbaritemusepinbutton" },
        { name: "tabbaritempinbuttonposition" },
        { name: "tabbaritempinbuttonsize" },
        { name: "tabbaritemclosebuttonsize" },
        { name: "tabbarbuttonshow" },
        { name: "tabbarbuttongap" },
        { name: "tabbarbuttonsize" },
        { name: "tabbarbuttonseparatorsize" }
    ];
    nexacro._defineProperties(_pFrameSet, _pFrameSet._properties);

    //===============================================================
    // nexacro.FrameSet : logic Part
    //===============================================================
    _pFrameSet._isShowTabBar = function ()
    {
        return this._p_showtabbar;
    };

    _pFrameSet._applyTabBarProperties = function ()
    {
        const tabbar = this._tabbar;
        if (tabbar)
        {
            tabbar.set_attachposition(this._p_tabbarposition);
            tabbar.set_itemheight(this._p_tabbaritemheight);
            tabbar.set_itemminheight(this._p_tabbaritemminheight);
            tabbar.set_itemwidth(this._p_tabbaritemwidth);
            tabbar.set_itemminwidth(this._p_tabbaritemminwidth);
            tabbar.set_itemgap(this._p_tabbaritemgap);
            tabbar.set_itemjustify(this._p_tabbaritemjustify);
            tabbar.set_itemusepinbutton(this._p_tabbaritemusepinbutton);
            tabbar.set_itempinbuttonposition(this._p_tabbaritempinbuttonposition);
            tabbar.set_itempinbuttonsize(this._p_tabbaritempinbuttonsize);
            tabbar.set_itemclosebuttonsize(this._p_tabbaritemclosebuttonsize);
            tabbar.set_buttonshow(this._p_tabbarbuttonshow);
            tabbar.set_buttongap(this._p_tabbarbuttongap);
            tabbar.set_buttonsize(this._p_tabbarbuttonsize);
        }
    }

    _pFrameSet._setTabBarArea = function (left, top, right, bottom)
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return;

        control_elem._setAttachClientTop(top);
        control_elem._setAttachClientBottom(bottom);
        control_elem._setAttachClientLeft(left);
        control_elem._setAttachClientRight(right);
    };

    _pFrameSet._adjustTabBarPosition = function (width, height)
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return;

        const tabbar = this._tabbar;
        if (!tabbar)
            return;

        let tabbarleft = 0;
        let tabbartop = 0;
        let tabbarwidth = width;
        let tabbarheight = height;

        const tabbarsize = this._p_tabbarsize;
        if (tabbarsize && tabbarsize > 0)
        {
            if (this._p_tabbarposition == "top" || this._p_tabbarposition == "bottom") // Horizontal
            {
                tabbarheight = tabbarsize;
            }
            else // Vertical
            {
                tabbarwidth = tabbarsize;
            }
        }
        else
        {
            if (this._p_tabbarposition == "top" || this._p_tabbarposition == "bottom") // Horizontal
            {
                tabbarheight = tabbar._on_getFitSize()[1];
            }
            else // Vertical
            {
                tabbarwidth = tabbar._on_getFitSize()[0];
            }
        }

        const tabbarpos = this._p_tabbarposition;
        if (tabbarpos == "top")
        {
            this._setTabBarArea(0, tabbarheight, 0, 0);
        }
        else if (tabbarpos == "bottom")
        {
            tabbartop = height - tabbarheight;

            this._setTabBarArea(0, 0, 0, tabbarheight);
        }
        else if (tabbarpos == "left")
        {
            this._setTabBarArea(tabbarwidth, 0, 0, 0);
        }
        else if (tabbarpos == "right")
        {
            tabbarleft = width - tabbarwidth;

            this._setTabBarArea(0, 0, tabbarwidth, 0);
        }

        // TabBar 가 보이지 않는 경우에는 TabBar 영역을 0으로 설정한다. 단, TabBar 의 크기는 정상적으로 계산
        if (!this._isShowTabBar())
            this._setTabBarArea(0, 0, 0, 0);

        return [tabbarleft, tabbartop, tabbarwidth, tabbarheight];
    };

    _pFrameSet._repositionTabBar = function ()
    {
        const tabbar = this._tabbar;
        if (!tabbar)
            return;

        let width = this._adjust_width;
        let height = this._adjust_height;

        const border = this._getCurrentStyleBorder();
        if (border)
        {
            // border 안쪽의 NC 이므로 border size 만큼 줄여준다.
            width -= border._getBorderWidth();
            height -= border._getBorderHeight();
        }

        const tabbarpos = this._adjustTabBarPosition(width, height);
        if (tabbarpos)
        {
            tabbar.move(...tabbarpos);
        }

        tabbar.updateSelectedItemIndicator();
    };

    _pFrameSet._repositionFrames = function (width, height)
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return;

        var client_width = this._getClientWidth();
        var client_height = this._getClientHeight();
        var frameleft = this._getClientLeft();
        var frametop = this._getClientTop();
        var framewidth = client_width;
        var frameheight = client_height;
        var frameright = frameleft + client_width;
        var framebottom = frametop + client_height;

        // max
        if (this._max_frame)
        {
            this._max_frame._move(frameleft, frametop, framewidth, frameheight);
        }

        // normal,min
        var i;
        var frames = this._p_frames;
        var len = frames.length;
        for (i = 0; i < len; i++)
        {
            var child = frames[i];
            if (child == this._max_frame)
                continue;

            if (child._state_openstatus == 2) // minimize
            {
                child._setVerticalMin(false);

                // TODO minimize된 위치로 이동
                var minwidth = this._p_minimizewidth ? this._p_minimizewidth : 125;
                //var minwidth = 25 * 5; // TODO get from styleprop

                var minheight = this._p_minimizeheight; // TODO get from styleprop
                if (!minheight)
                {
                    minheight = child._titlebarheight;
                }

                switch (this._minimizedchildposition)
                {
                    case 0: //l
                        framebottom = frametop + minheight;
                        child._move(frameleft, frametop, minwidth, minheight);
                        frametop = framebottom;
                        break;
                    case 1: //t
                        frameright = frameleft + minwidth;
                        child._move(frameleft, frametop, minwidth, minheight);
                        frameleft = frameright;
                        break;
                    case 2: //r
                        framebottom = frametop + minheight;
                        child._move(frameright - minwidth, frametop, minwidth, minheight);
                        frametop = framebottom;
                        break;
                    case 3: //b
                        frameright = frameleft + minwidth;
                        child._move(frameleft, framebottom - minheight, minwidth, minheight);
                        frameleft = frameright;
                        break;
                }
            }
        }
    }

    //===============================================================
    // nexacro.FrameSet : Methods
    //===============================================================

    _pFrameSet.arrange = function (v)
    {
        var max_frame = this._max_frame;
        if (max_frame)
        {
            // restore
            max_frame._on_syscommand(max_frame.getElement(), "restore", true, max_frame, null);
        }

        var arrangecnt = 0;
        var frames = this._p_frames;
        var len = frames.length;
        var i, j, child, fixed, colcnt, rowcnt, left, col, rc, width, height, row;
        for (i = 0; i < len; i++)
        {
            child = this._zordermap[i];
            if (child._p_visible == false || child._state_openstatus == 2)
                continue;
            arrangecnt++;
        }

        var frameleft = 0;
        var frametop = 0;
        var framewidth = this._getClientWidth();
        var frameheight = this._getClientHeight();
        if (v == "cascade")
        {
            this._arrange = 0;
            var cascadecnt = 0;
            for (var temp = 100; ; cascadecnt++)
            {
                if (this._getClientHeight() < temp)
                    break;
                temp += (60 + (cascadecnt * 10));
            }

            var cascadegapx = parseInt(this._titlebarheight) | this._defaulttitleheight;
            var cascadegapy = cascadegapx;
            framewidth = this._getClientWidth() - (cascadegapx * cascadecnt);
            frameheight = this._getClientHeight() - (cascadegapy * cascadecnt);
            for (i = 0, j = 0; i < this._p_frames.length; i++)
            {
                child = this._zordermap[i];
                if (child._p_visible == false || child._state_openstatus == 2)
                    continue;

                frameleft = cascadegapx * (j % (cascadecnt + 1));
                frametop = cascadegapy * (j % (cascadecnt + 1));

                child._move(frameleft, frametop, framewidth, frameheight);

                j++;
            }
        }
        if (v == "tilevertical") // 수직배열
        {
            this._arrange = 1;
            fixed = true;
            rowcnt = parseInt(Math.sqrt(arrangecnt)) | 0;
            colcnt = parseInt(arrangecnt / rowcnt) | 0;

            if ((arrangecnt % rowcnt) != 0)
            {
                rowcnt += 1;
                fixed = false;
            }

            left = arrangecnt;
            for (col = 0, i = 0; col < colcnt; col++)
            {
                for (row = 0; row < rowcnt;)
                {
                    child = this._zordermap[i];
                    if (child._p_visible == false || child._state_openstatus == 2)
                        continue;

                    rc = { left: frameleft, top: frametop, right: frameleft + framewidth, bottom: frametop + frameheight };
                    rc.right = rc.left + ((rc.right - rc.left) / colcnt);
                    rc.bottom = rc.top + ((rc.bottom - rc.top) / rowcnt);

                    width = rc.right - rc.left;
                    height = rc.bottom - rc.top;
                    rc.left += (colcnt - col - 1) * width;
                    rc.top += (rowcnt - row - 1) * height;
                    rc.right += (colcnt - col - 1) * width;
                    rc.bottom += (rowcnt - row - 1) * height;

                    child._move(rc.left, rc.top, rc.right - rc.left, rc.bottom - rc.top);
                    row++;
                    i++;
                    left--;
                }

                if (!fixed && rowcnt > 2 && (left % (rowcnt - 1)) == 0)
                {
                    rowcnt--;
                    fixed = true;
                }
            }
        }
        if (v == "tilehorizontal") // 수평배열
        {
            this._arrange = 2;
            fixed = true;
            colcnt = parseInt(Math.sqrt(arrangecnt)) | 0;
            rowcnt = parseInt(arrangecnt / colcnt) | 0;

            if ((arrangecnt % colcnt) != 0)
            {
                rowcnt += 1;
                fixed = false;
            }

            left = arrangecnt;
            for (col = 0, i = 0; col < colcnt; col++)
            {
                for (row = 0; row < rowcnt;)
                {
                    child = this._zordermap[i];
                    if (child._p_visible == false || child._state_openstatus == 2)
                        continue;

                    rc = { left: frameleft, top: frametop, right: frameleft + framewidth, bottom: frametop + frameheight };
                    rc.right = rc.left + ((rc.right - rc.left) / colcnt);
                    rc.bottom = rc.top + ((rc.bottom - rc.top) / rowcnt);

                    width = rc.right - rc.left;
                    height = rc.bottom - rc.top;
                    rc.left += (colcnt - col - 1) * width;
                    rc.top += (rowcnt - row - 1) * height;
                    rc.right += (colcnt - col - 1) * width;
                    rc.bottom += (rowcnt - row - 1) * height;

                    child._move(rc.left, rc.top, rc.right - rc.left, rc.bottom - rc.top);
                    row++;
                    i++;
                    left--;
                }

                if (!fixed && rowcnt > 2 && (left % (rowcnt - 1)) == 0)
                {
                    rowcnt--;
                    fixed = true;
                }
            }
        }
        if (v == "vertical") // | | | ..
        {
            this._arrange = 3;
            for (i = 0, j = 0; i < this._p_frames.length; i++)
            {
                child = this._zordermap[i];
                if (child._p_visible == false || child._state_openstatus == 2)
                    continue;

                child._move(
                    frameleft + (j * (framewidth / arrangecnt)),
                    frametop,
                    (framewidth / arrangecnt),
                    frameheight);
                j++;
            }
        }
        if (v == "horizontal") // 三
        {
            this._arrange = 4;
            var top = frametop;
            for (i = 0; i < this._p_frames.length; i++)
            {
                child = this._zordermap[i];
                if (child._p_visible == false || child._state_openstatus == 2)
                    continue;

                rc = { left: frameleft, top: frametop, right: frameleft + framewidth, bottom: frametop + frameheight };
                rc.top = top;
                rc.bottom = rc.top + (frameheight / arrangecnt);

                // 최소 height보다는 작아지지 않도록 한다.
                var miny = 0;

                if (rc.bottom - rc.top < miny)
                    rc.bottom = rc.top + miny;

                top = rc.bottom + 1;
                child._move(frameleft, rc.top, framewidth, rc.bottom - rc.top);
            }
        }
    };

    _pFrameSet.setTabBarExtraButtonVisible = function (from, to, visible)
    {
        from = +from || 1;
        to = +to || 1;

        if (from < 1)
            from = 1;
        if (to < 1)
            to = 1;

        if (from > to)
            from = to;

        const tabbar = this._tabbar;
        if (tabbar)
            tabbar.setExtraButtonVisible(from, to, visible);

        this._repositionTabBar();
    };

    _pFrameSet.getTabBarExtraButtonVisible = function (idx)
    {
        idx = +idx || 1;
        if (idx < 1)
            idx = 1;

        const tabbar = this._tabbar;
        if (tabbar)
            return tabbar.getExtraButtonVisible(idx);

        return false;
    };

    //===============================================================
    // nexacro.VFrameSet
    //===============================================================
    nexacro.VFrameSet = function (id, left, top, width, height, right, bottom, parent)
    {
        nexacro.FrameSetBase.call(this, id, left, top, width, height, right, bottom, parent);
    };
    var _pVFrameSet = nexacro._createPrototype(nexacro.FrameSetBase, nexacro.VFrameSet);
    nexacro.VFrameSet.prototype = _pVFrameSet;

    _pVFrameSet._type_name = "VFrameSet";

    //===============================================================
    // nexacro.VFrameSet : Create & Destroy & Update
    //===============================================================
    _pVFrameSet.on_change_containerRect = function (width, height)
    {
        nexacro.Frame.prototype.on_change_containerRect.call(this, width, height);

        var control_elem = this._control_element;
        if (control_elem)
        {
            this._separaterealsize = this._recalcSeparateFrameSize(height);
            var framesize = this._separaterealsize.map(obj => obj.size);
            var cnt = this._p_frames.length;
            var frameleft = 0;
            var frametop = 0;
            var framebottom = 0;
            var frameright = frameleft + width;
            var maxframeheight = 0;
            var clientheight = maxframeheight = this._getClientHeight();
            var child, i, minheight, titleheight;
            if (this._max_frame)
            {
                var maxidx = -1;
                //minheight = 0;
                for (i = 0; i < cnt; i++)
                {
                    child = this._p_frames[i];
                    if (child == this._max_frame)
                    {
                        maxidx = i;
                        continue;
                    }
                    if (child instanceof nexacro.FrameSetBase)
                    {
                        var h = child._p_frames ? child._p_frames[0]._titlebarheight : 0;
                        titleheight = h;
                    }
                    else
                    {
                        titleheight = child._titlebarheight;
                    }

                    minheight = parseInt(titleheight) | 0;

                    //var borderval = child.on_find_CurrentStyle_border();
                    //minheight += borderval._getBorderTopWidth();
                    //minheight += borderval._getBorderBottomWidth();

                    maxframeheight -= minheight;
                    framesize[i] = minheight;
                }

                framesize[maxidx] = maxframeheight;
            }

            var preframe_minimized = false;
            var gap = 0;
            for (i = 0; i < cnt; i++)
            {
                child = this._p_frames[i];

                if (preframe_minimized)
                {
                    frametop = framebottom;
                    preframe_minimized = false;
                }

                if (child._state_openstatus == 2) //minimized
                {
                    child._setVerticalMin(false);

                    //minheight = 0;
                    titleheight = child._titlebarheight;
                    minheight = parseInt(titleheight) | 0;

                    //var borderval = child.on_find_CurrentStyle_border();
                    //minheight += borderval._getBorderTopWidth();
                    //minheight += borderval._getBorderBottomWidth();

                    gap += framesize[i] - minheight;
                    framesize[i] = minheight;
                    preframe_minimized = true;
                }

                if (child._state_openstatus != 2)
                {
                    framesize[i] += gap;
                    gap = 0;
                }

                if (child._state_openstatus != 2 && i == cnt - 1) // 비율 연산과정의 소수점 오차 보정 ( 마지막 프레임이 최소화 상태가 아닌 경우 하단을 클라이언트 높이로 맞춤 )
                    framebottom = clientheight;
                else
                    framebottom = framesize[i] + frametop;

                if (child != this._track_frame)
                {
                    child._move(frameleft, frametop, frameright - frameleft, framebottom - frametop);
                }
                frametop = framebottom;
            }
            this._resetSplitter();
        }
    };

    //===============================================================
    // nexacro.VFrameSet : Methods
    //===============================================================
    _pVFrameSet.arrange = nexacro._emptyFn;

    //===============================================================
    // nexacro.VFrameSet : Properties
    //===============================================================
    _pVFrameSet.set_minimizedchildposition = nexacro._emptyFn;

    //_pVFrameSet._properties = [{ name: "frames", readonly: true }];
    //nexacro._defineProperties(_pVFrameSet, _pVFrameSet._properties);

    //===============================================================
    // nexacro.VFrameSet : Logical Part
    //===============================================================
    _pVFrameSet._createSplitter = function (index)
    {
        const splitter = new nexacro.SplitterControl(`splitter${index}`, 0, 0, 0, 0, null, null, null, null, null, null, this);
        if (splitter)
        {
            splitter.set_direction("horizontal");
            splitter.set_gripmargin(this._p_splittermargin);
            splitter.createComponent();
        }
        return splitter;
    };

    _pVFrameSet._repositionSplitter = function (splitter, index)
    {
        let left = 0, top = 0, width = 0, height = 0;

        top = (this._getSplitterPosition(index) - this._splitteroffset);
        width = this._getClientWidth();
        height = this._p_splittersize;

        splitter.move(left, top, width, height);
    };

    _pVFrameSet._updateSeparateSize = function (splitter, x, y)
    {
        const separaterealsize = this._separaterealsize;
        if (!separaterealsize)
            return;

        const splitterinfo = this._splittermap.get(splitter);
        if (!splitterinfo)
            return false;

        const { adjustedX, adjustedY } = this._adjustSplitterPos(splitter, x, y);

        separaterealsize[splitterinfo.frameidx].size += adjustedY;
        separaterealsize[splitterinfo.frameidx + 1].size -= adjustedY;

        this._recalcSeparateSize(separaterealsize, this._getClientHeight());
    };

    _pVFrameSet._adjustSplitterPosY = function (splitter, y, limit)
    {
        const splitterinfo = this._splittermap.get(splitter);
        if (!splitterinfo)
            return y;

        let min1 = 0;
        let min2 = 0;
        let max1 = Infinity;
        let max2 = Infinity;

        const frame1 = this._p_frames[splitterinfo.frameidx];
        const frame2 = this._p_frames[splitterinfo.frameidx + 1];
        if (frame1 && frame2)
        {
            min1 = frame1.minheight ?? 0;
            min2 = frame2.minheight ?? 0;
            max1 = frame1.maxheight ?? Infinity;
            max2 = frame2.maxheight ?? Infinity;

            // splitter 중첩시 hittest 영역이 겹치지 않도록 최소 범위는 limit 값으로 제한
            min1 < limit && (min1 = limit);
            min2 < limit && (min2 = limit);

            const trackinfo = this._splitter_trackinfo;
            if (trackinfo)
            {
                const frame1size = trackinfo.frame1.height;
                const frame2size = trackinfo.frame2.height;

                // Phase 1. 트랙 시점 프레임 크기가 이미 최소, 최대 크기를 벗어나있다면 트랙 시점의 크기를 사용
                if (frame1size < min1)
                    min1 = frame1size;
                if (frame1size > max1)
                    max1 = frame1size;

                if (frame2size < min2)
                    min2 = frame2size;
                if (frame2size > max2)
                    max2 = frame2size;

                // Phase 2. 변경될 사이즈가 최소, 최대 크기를 만족하는 범위까지만 변경되도록 보정
                if (frame1size + y < min1)
                    y = min1 - frame1size;
                if (frame1size + y > max1)
                    y = max1 - frame1size;

                if (frame2size - y < min2)
                    y = frame2size - min2;
                if (frame2size - y > max2)
                    y = frame2size - max2;
            }
        }
        return y;
    };

    //===============================================================
    // nexacro.HFrameSet
    //===============================================================
    nexacro.HFrameSet = function (id, left, top, width, height, right, bottom, parent)
    {
        nexacro.FrameSetBase.call(this, id, left, top, width, height, right, bottom, parent);
    };
    var _pHFrameSet = nexacro._createPrototype(nexacro.FrameSetBase, nexacro.HFrameSet);
    nexacro.HFrameSet.prototype = _pHFrameSet;

    _pHFrameSet._type_name = "HFrameSet";

    //===============================================================
    // nexacro.HFrameSet : Create & Destroy & Update
    //===============================================================
    _pHFrameSet.on_change_containerRect = function (width, height)
    {
        nexacro.Frame.prototype.on_change_containerRect.call(this, width, height);

        var control_elem = this._control_element;
        if (control_elem)
        {

            this._separaterealsize = this._recalcSeparateFrameSize(width);
            var framesize = this._separaterealsize.map(obj => obj.size);
            var cnt = this._p_frames.length;
            var frameleft = 0;
            var frametop = 0;
            var frameright = 0;
            var framebottom = frametop + height;
            var maxframewidth = 0;
            var clientWidth = maxframewidth = this._getClientWidth();
            var child, i, minwidth, titleheight;
            if (this._max_frame)
            {
                var maxidx = -1;
                //minwidth = 0;
                for (i = 0; i < cnt; i++)
                {
                    child = this._p_frames[i];
                    if (child == this._max_frame)
                    {
                        maxidx = i;
                        continue;
                    }
                    titleheight = child._titlebarheight;
                    minwidth = parseInt(titleheight) | 0;

                    //var borderval = child.on_find_CurrentStyle_border();
                    //minwidth += borderval._getBorderLeftWidth();
                    //minwidth += borderval._getBorderRightWidth();

                    maxframewidth -= minwidth;
                    framesize[i] = minwidth;
                }

                framesize[maxidx] = maxframewidth;
            }

            var preframe_minimized = false;
            var gap = 0;
            for (i = 0; i < cnt; i++)
            {
                child = this._p_frames[i];

                if (preframe_minimized)
                {
                    frameleft = frameright;
                    preframe_minimized = false;
                }

                if (child._state_openstatus == 2) //minimized
                {
                    child._setVerticalMin(true);

                    //minwidth = 0;
                    titleheight = child._titlebarheight;
                    minwidth = parseInt(titleheight) | 0;

                    //var borderval = child.on_find_CurrentStyle_border();
                    //minwidth += borderval._getBorderLeftWidth();
                    //minwidth += borderval._getBorderRightWidth();

                    gap += framesize[i] - minwidth;
                    framesize[i] = minwidth;
                    preframe_minimized = true;
                }

                if (child._state_openstatus != 2)
                {
                    if (this._max_frame && child != this._max_frame)
                        child._setVerticalMin(true);
                    else
                        child._setVerticalMin(false);

                    framesize[i] += gap;
                    gap = 0;
                }

                if (child._state_openstatus != 2 && i == cnt - 1) // 비율 연산과정의 소수점 오차 보정 ( 마지막 프레임이 최소화 상태가 아닌 경우 우측을 클라이언트 너비로 맞춤 )
                    frameright = clientWidth;
                else
                    frameright = framesize[i] + frameleft;

                if (child != this._track_frame)
                {
                    child._move(frameleft, frametop, frameright - frameleft, framebottom - frametop);
                }
                frameleft = frameright;
            }
            this._resetSplitter();
        }
    };

    //===============================================================
    // nexacro.HFrameSet : Logical Part
    //===============================================================
    _pHFrameSet._createSplitter = function (index)
    {
        const splitter = new nexacro.SplitterControl(`splitter${index}`, 0, 0, 0, 0, null, null, null, null, null, null, this);
        if (splitter)
        {
            splitter.set_direction("vertical");
            splitter.set_gripmargin(this._p_splittermargin);
            splitter.createComponent();
        }
        return splitter;
    };

    _pHFrameSet._repositionSplitter = function (splitter, index)
    {
        let left = 0, top = 0, width = 0, height = 0;

        left = (this._getSplitterPosition(index) - this._splitteroffset);
        width = this._p_splittersize;
        height = this._getClientHeight();

        splitter.move(left, top, width, height);
    };

    _pHFrameSet._updateSeparateSize = function (splitter, x, y)
    {
        const separaterealsize = this._separaterealsize;
        if (!separaterealsize)
            return;

        const splitterinfo = this._splittermap.get(splitter);
        if (!splitterinfo)
            return false;

        const { adjustedX, adjustedY } = this._adjustSplitterPos(splitter, x, y);

        separaterealsize[splitterinfo.frameidx].size += adjustedX;
        separaterealsize[splitterinfo.frameidx + 1].size -= adjustedX;

        this._recalcSeparateSize(separaterealsize, this._getClientWidth());
    };

    _pHFrameSet._adjustSplitterPosX = function (splitter, x, limit)
    {
        const splitterinfo = this._splittermap.get(splitter);
        if (!splitterinfo)
            return x;

        let min1 = 0;
        let min2 = 0;
        let max1 = Infinity;
        let max2 = Infinity;

        const frame1 = this._p_frames[splitterinfo.frameidx];
        const frame2 = this._p_frames[splitterinfo.frameidx + 1];
        if (frame1 && frame2)
        {
            min1 = frame1.minwidth ?? 0;
            min2 = frame2.minwidth ?? 0;
            max1 = frame1.maxwidth ?? Infinity;
            max2 = frame2.maxwidth ?? Infinity;

            // splitter 중첩시 hittest 영역이 겹치지 않도록 최소 범위는 limit 값으로 제한
            min1 < limit && (min1 = limit);
            min2 < limit && (min2 = limit);

            const trackinfo = this._splitter_trackinfo;
            if (trackinfo)
            {
                const frame1size = trackinfo.frame1.width;
                const frame2size = trackinfo.frame2.width;

                // Phase 1. 트랙 시점 프레임 크기가 이미 최소, 최대 크기를 벗어나있다면 트랙 시점의 크기를 사용
                if (frame1size < min1)
                    min1 = frame1size;
                if (frame1size > max1)
                    max1 = frame1size;

                if (frame2size < min2)
                    min2 = frame2size;
                if (frame2size > max2)
                    max2 = frame2size;

                // Phase 2. 변경될 사이즈가 최소, 최대 크기를 만족하는 범위까지만 변경되도록 보정
                if (frame1size + x < min1)
                    x = min1 - frame1size;
                if (frame1size + x > max1)
                    x = max1 - frame1size;

                if (frame2size - x < min2)
                    x = frame2size - min2;
                if (frame2size - x > max2)
                    x = frame2size - max2;
            }
        }
        return x;
    };

    //===============================================================
    // nexacro.HFrameSet : Methods
    //===============================================================
    _pHFrameSet.arrange = nexacro._emptyFn;

    //===============================================================
    // nexacro.HFrameSet : Properties
    //===============================================================
    _pHFrameSet.set_minimizedchildposition = nexacro._emptyFn;


    _pHFrameSet._properties = [{ name: "frames", readonly: true }];
    nexacro._defineProperties(_pHFrameSet, _pHFrameSet._properties);

    //===============================================================
    // nexacro.TileFrameSet
    //===============================================================
    nexacro.TileFrameSet = function (id, left, top, width, height, right, bottom, parent)
    {
        nexacro.FrameSetBase.call(this, id, left, top, width, height, right, bottom, parent);
    };
    var _pTileFrameSet = nexacro._createPrototype(nexacro.FrameSetBase, nexacro.TileFrameSet);
    nexacro.TileFrameSet.prototype = _pTileFrameSet;

    _pTileFrameSet._type_name = "TileFrameSet";
    _pTileFrameSet._p_separatetype = "horizontal"; // SEPARATETYPE_HORIZONTAL-0, SEPARATETYPE_VERTICAL-1
    _pTileFrameSet._p_separatecount = 1;
    _pTileFrameSet._p_fullframemaximize = true;
    _pTileFrameSet._p_minimizedchildposition = "bottom";

    /* internal variable */
    _pTileFrameSet._separatetype = 0;
    _pTileFrameSet._minimizedchildposition = 3;
    //===============================================================
    // nexacro.TileFrameSet : Create & Destroy & Update
    //===============================================================
    _pTileFrameSet.on_change_containerRect = function (width, height)
    {
        nexacro.Frame.prototype.on_change_containerRect.call(this, width, height);

        var control_elem = this._control_element;
        if (control_elem)
        {
            var framecnt = this._p_frames.length;

            // client영역
            var fullframewidth = this._getClientWidth();
            var fullframeheight = this._getClientHeight();

            // fullframemaximize=false인 경우 나머지 모든 frame이 minimize처리되어 다시 recalc해야 한다.
            var i;
            if (this._p_fullframemaximize == false)
            {
                if (this._max_frame)
                {
                    for (i = 0; i < this._p_frames.length; i++)
                    {
                        if (this._max_frame != this._p_frames[i] && this._p_frames[i]._state_openstatus != 2)
                        {
                            // TODO check 바로 바꾸면 될런지. syscommand 처리를 해야 하는지 검토필요
                            this._p_frames[i]._p_openstatus = "minimize";
                            this._p_frames[i]._changeOpenStatus(2);
                        }
                    }
                }
                else
                {
                    for (i = 0; i < this._p_frames.length; i++)
                    {
                        if (this._p_frames[i]._state_openstatus == 2)
                        {
                            // TODO check 바로 바꾸면 될런지. syscommand 처리를 해야 하는지 검토필요
                            this._p_frames[i]._p_openstatus = "normal";
                            this._p_frames[i]._changeOpenStatus(0);
                        }
                    }
                }
            }

            var minimizeframecnt = this._getMinimizeFrameCount();
            var normalframecnt = (framecnt - minimizeframecnt) > 0 ? framecnt - minimizeframecnt : 1;
            var separatecnt = this._p_separatecount > 0 ? this._p_separatecount : 1;
            var framerowcnt = parseInt(normalframecnt / separatecnt) + (parseInt(normalframecnt % separatecnt) > 0 ? 1 : 0);

            //minimize top, bottom
            var horzminarea = false;
            if (this._minimizedchildposition == 1 || this._minimizedchildposition == 3)
                horzminarea = true;

            var minareawidth = 0, minareaheight = 0; // 최소화된 frame들이 놓이는 전체 영역크기
            if (horzminarea)
            {
                minareawidth = width;
                if (minimizeframecnt > 0)
                {
                    minareaheight = this._getMaxMinimizedHeight();
                }
            }
            else
            {
                minareaheight = height;
                if (minimizeframecnt > 0)
                {
                    minareawidth = this._getMaxMinimizedWidth();
                }
            }

            var displayframewidth = 0, displayframeheight = 0; // tile 1개 크기
            if (this._separatetype == 1) //horz(0),vert(1)
            {
                displayframewidth = (width - (horzminarea ? 0 : minareawidth)) / framerowcnt;
                displayframeheight = height - (horzminarea ? minareaheight : 0);
            }
            else
            {
                displayframewidth = width - (horzminarea ? 0 : minareawidth);
                displayframeheight = (height - (horzminarea ? minareaheight : 0)) / framerowcnt;
            }

            //var newcnt = framecnt - separatecnt > 0 ? separatecnt : framecnt;
            var realcolcnt = normalframecnt - separatecnt > 0 ? separatecnt : normalframecnt;

            var realtotalsize = 0;
            if (this._separatetype == 1) //horz(0),vert(1)
            {
                realtotalsize = height;
                if (horzminarea)
                    realtotalsize -= minareaheight;
            }
            else
            {
                realtotalsize = width;
                if (!horzminarea)
                    realtotalsize -= minareawidth;
            }

            var framesize = this._recalcSeparateFrameSize(realtotalsize, realcolcnt, realcolcnt);
            var frameleft = 0;
            var frametop = 0;
            var frameright = frameleft + width;
            var framebottom = frametop + height;
            if (minimizeframecnt > 0)
            {
                switch (this._minimizedchildposition)
                {
                    case 0: frameleft += minareawidth; break; // left
                    case 1: frametop += minareaheight; break; // top
                    case 2: frameright -= minareawidth; break; // right
                    case 3: framebottom -= minareaheight; break; // bottom
                }
            }

            if (this._separatetype == 1)
                frameright = frameleft + displayframewidth;
            else
                framebottom = frametop + displayframeheight;

            // maximized
            //-------------------------------------------------------
            if (this._max_frame)
            {
                if (this.fullframemaximize)
                {
                    this._max_frame._move(0, 0, fullframewidth, fullframeheight);
                }
                else
                {
                    // 나머지 frame minimize처리는 함수 첫부분에...
                    this._max_frame._move(frameleft, frametop, frameright - frameleft, framebottom - frametop);
                }

                if (this._control_element && this._max_frame._control_element)
                    this._control_element.bringToFrontElement(this._max_frame._control_element);
            }
            else if (this.fullframemaximize == false)
            {
                for (i = 0; i < this._p_frames.length; i++)
                {
                    if (this._p_frames[i]._state_openstatus == 2)
                    {
                        // TODO check 바로 바꾸면 될런지. syscommand 처리를 해야 하는지 검토필요
                        this._p_frames[i]._changeOpenStatus(1);
                    }
                }
            }

            // normal
            //-------------------------------------------------------
            var j = 0, k = 0;
            var child;
            for (i = 0; i < framerowcnt; i++)
            {
                for (j = 0; j < realcolcnt && k < framecnt; k++)
                {
                    child = this._p_frames[k];
                    if (child == this._max_frame)
                        continue;

                    if (child._state_openstatus == 2) //minimize
                        continue;

                    if (this._separatetype == 1) //horz(0),vert(1)
                        framebottom = framesize[j].size + frametop;
                    else
                        frameright = framesize[j].size + frameleft;

                    if (child != this._track_frame)
                    {
                        child._move(frameleft, frametop, frameright - frameleft, framebottom - frametop);
                    }

                    if (this._separatetype == 1) //horz(0),vert(1)
                        frametop = framebottom;
                    else
                        frameleft = frameright;

                    j++;
                }

                if (this._separatetype == 1) //horz(0),vert(1)
                {
                    frametop = 0;
                    frameleft = frameright;
                    frameright = frameleft + displayframewidth;

                    if (this._minimizedchildposition == 1) //top
                        frametop += minareaheight;
                }
                else
                {
                    frameleft = 0;
                    frametop = framebottom;
                    framebottom = frametop + displayframeheight;

                    if (this._minimizedchildposition == 0) //left
                        frameleft += minareawidth;
                }
            }

            // minimized
            //-------------------------------------------------------
            if (minimizeframecnt <= 0)
                return;

            var minframeleft = 0;
            var minframetop = 0;
            var minframeright = minframeleft + this._getClientWidth();
            var minframebottom = minframetop + this._getClientHeight();
            switch (this._minimizedchildposition)
            {
                case 0:
                    minframeright = minframeleft + minareawidth;
                    break;
                case 1:
                    minframebottom = minframetop + minareaheight;
                    break;
                case 2:
                    minframeleft = minframeright - minareawidth;
                    break;
                case 3:
                    minframetop = minframebottom - minareaheight;
                    break;
            }

            // 최소화된 Frame을 각각의 크기로 배열했을때 여유공간이 있으면 그대로 두고
            // 공간이 모자르면 전체적으로 최소화된 크기를 줄인다.

            var defaultminwidth = this._p_minimizewidth ? this._p_minimizewidth : 150; //150; // TODO <--get from styleprop
            var minwidth = width - (minimizeframecnt * defaultminwidth);
            minwidth = minwidth > 0 ? defaultminwidth : (width / minimizeframecnt);
            minwidth = minwidth < 100 ? 100 : minwidth;

            for (i = 0; i < framecnt; i++)
            {
                child = this._p_frames[i];
                if (child._state_openstatus == 2)
                {
                    child._setVerticalMin(false);

                    // TODO
                    var minheight = this._p_minimizeheight;
                    if (!minheight)
                    {
                        var titleheight = child._titlebarheight;
                        minheight = parseInt(titleheight) | 0;

                        var border = child._getCurrentStyleBorder();
                        if (border)
                        {
                            minheight += border._getBorderHeight();
                        }
                    }

                    switch (this._minimizedchildposition)
                    {
                        case 0: case 2: //l r
                            minframebottom = minframetop + minheight;
                            child._move(minframeleft, minframetop, minframeright - minframeleft, minheight);
                            minframetop = minframebottom;
                            break;
                        case 1: case 3: //t b
                            minframeright = minframeleft + minwidth;
                            child._move(minframeleft, minframetop, minwidth, minframebottom - minframetop);
                            minframeleft = minframeright;
                            break;
                    }
                }
            }
        }
    };

    //===============================================================
    // nexacro.TileFrameSet : Properties
    //===============================================================
    _pTileFrameSet.set_separatetype = function (v)
    {
        //"horizontal", "vertical";
        if (this._p_separatetype != v)
        {
            this._p_separatetype = v;
            this._separatetype = (v == "vertical" ? 1 : 0);

            if (this._control_element)
                this.on_change_containerRect(this._getClientWidth(), this._getClientHeight());
        }
    };

    _pTileFrameSet.set_separatecount = function (v)
    {
        var separatecount = nexacro._parseInt(v);
        if (this._p_separatecount != separatecount)
        {
            if (separatecount < 0)
                this._p_separatecount = 1;
            else
                this._p_separatecount = separatecount;

            if (this._control_element)
                this.on_change_containerRect(this._getClientWidth(), this._getClientHeight());
        }
    };

    _pTileFrameSet.set_fullframemaximize = function (v)
    {
        var fullframemaximize = nexacro._toBoolean(v);
        if (this._p_fullframemaximize != fullframemaximize)
        {
            this._p_fullframemaximize = fullframemaximize;

            // 모든 child의 minbutton이 보이거나 사라져야 한다.
            for (var i = 0; i < this._p_frames.length; i++)
            {
                var child = this._p_frames[i];
                if (child._p_titlebar)
                {
                    if (fullframemaximize == false)
                    {
                        child._p_titlebar._setAbsoluteStyle(0x0001, 0);
                    }
                    else
                    {
                        child._p_titlebar._setAbsoluteStyle(0x0100, 0x0001);
                        child._p_titlebar._setAbsoluteStyle(0, 0x0100); // 토글 되는 순간에만 minbutton이 나타나도록. 이 이후에는 강제하지 않음
                    }
                }
            }

            if (this._control_element)
                this.on_change_containerRect(this._getClientWidth(), this._getClientHeight());
        }
    };

    _pTileFrameSet.set_minimizewidth = function (minimizewidth)
    {
        minimizewidth = parseInt(minimizewidth);
        this._p_minimizewidth = minimizewidth;
        this.on_apply_minimizewidth(minimizewidth);
    };

    _pTileFrameSet.on_apply_minimizewidth = function ()
    {
        if (this._is_created)
            this.on_change_containerRect(this._getClientWidth(), this._getClientHeight());
    };

    _pTileFrameSet.set_minimizeheight = function (minimizeheight)
    {
        minimizeheight = parseInt(minimizeheight);
        this._p_minimizeheight = minimizeheight;
        this.on_apply_minimizeheight(minimizeheight);
    };

    _pTileFrameSet.on_apply_minimizeheight = function ()
    {
        if (this._is_created)
            this.on_change_containerRect(this._getClientWidth(), this._getClientHeight());
    };

    _pTileFrameSet._properties = [{ name: "separatetype" }, { name: "separatecount" }, { name: "fullframemaximize" }, { name: "minimizewidth" }, { name: "minimizeheight" }, { name: "minimizedchildposition" }];
    nexacro._defineProperties(_pTileFrameSet, _pTileFrameSet._properties);

    //===============================================================
    // nexacro.TileFrameSet : Methods
    //===============================================================
    _pTileFrameSet.arrange = nexacro._emptyFn;

    //===============================================================
    // nexacro.TileFrameSet : Event Handlers
    //===============================================================

    //===============================================================
    // nexacro.TileFrameSet : Logical Part
    //===============================================================

    _pTileFrameSet._getMaxMinimizedWidth = function ()
    {
        // 최소화된 모든 자식 frame의 width,height중 최대값을 구한다.
        //var max = -1;
        //for (var i = 0; i < this.frames.length; i++)
        //{
        //	var child = this.frames[i];
        //	if (child._state_openstatus != 2)
        //		continue;

        //	// TODO _is_visible

        //	// TODO 상위로 올라가면서 minimizedwidth 값을 검사

        //}
        return this._p_minimizewidth ? this._p_minimizewidth : 150;
        //return max;
    };

    _pTileFrameSet._getMaxMinimizedHeight = function ()
    {
        // 최소화된 모든 자식 frame의 width,height중 최대값을 구한다.
        var max = -1;
        for (var i = 0; i < this._p_frames.length; i++)
        {
            var child = this._p_frames[i];
            if (child._state_openstatus != 2)
                continue;

            // TODO _is_visible
            var minheight = this._p_minimizeheight;
            // TODO 상위로 올라가면서 minimizedwidth 값을 검사
            if (!minheight)
            {
                var titleheight = child._titlebarheight;
                minheight = parseInt(titleheight) | 0;

                var border = child._getCurrentStyleBorder();
                if (border)
                {
                    minheight += border._getBorderHeight();
                }

                if (minheight > max)
                    max = minheight;
            }
        }

        return max > 0 ? max : (this._p_minimizeheight ? this._p_minimizeheight : 25);
    };




    if (!nexacro._MainStatusBarControl)
    {
        // ==============================================================================
        // nexacro.MainStatusBar
        // ==============================================================================
        nexacro._MainStatusBarControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
        {
            nexacro.StatusBarControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        };

        var __pMainStatusBarControl = nexacro._createPrototype(nexacro.StatusBarControl, nexacro._MainStatusBarControl);
        nexacro._MainStatusBarControl.prototype = __pMainStatusBarControl;

        __pMainStatusBarControl._type_name = "StatusBarControl";
        __pMainStatusBarControl._is_subcontrol = true;

        /* internal variable */
        __pMainStatusBarControl._comm_progress_ref = 0;
        __pMainStatusBarControl._comm_progress_timer = null;


        //===============================================================
        // nexacro.MainStatusBar : Logical Part
        //===============================================================

        if (nexacro._Browser == "Runtime")
        {
            __pMainStatusBarControl._beginCommProgress = function ()
            {
                var cur_ref = ++this._comm_progress_ref;
                if (cur_ref == 1)
                {
                    var progressbar = this._p_progressbar;
                    if (progressbar)
                    {
                        progressbar.set_max(1000);
                        progressbar.set_pos(0);
                    }

                    var progress_timer = new nexacro._CallbackTimer(this, function ()
                    {
                        var progressbar = this._p_progressbar;
                        if (!progressbar)
                            return;

                        // Contents Length를 모르는 경우도 존재하므로 임의로 증가시킴.
                        // 알 수 있는 경우와 분기해야 하나??
                        var cur_pos = progressbar.pos;
                        cur_pos += Math.max(1, (1000 - cur_pos) / (100 * this._comm_progress_ref));
                        if (cur_pos > 990)
                            cur_pos = 990;

                        progressbar.set_pos(cur_pos);

                        // 필요하다면 bind된 callback func 호출
                    }, 500);
                    progress_timer.start();
                    this._comm_progress_timer = progress_timer;
                }
            };

            __pMainStatusBarControl._stepCommProgress = function (current, overall)
            {
                // 수동으로 제어하려는 경우.
                var progressbar = this._p_progressbar;
                if (progressbar)
                {
                    progressbar.set_max(overall);
                    progressbar.set_pos(current);
                }
            };

            __pMainStatusBarControl._endCommProgress = function ()
            {
                var cur_ref = --this._comm_progress_ref;
                if (cur_ref == 0)
                {
                    var progressbar = this._p_progressbar;
                    if (progressbar)
                        progressbar.set_pos(0);

                    if (this._comm_progress_timer)
                        this._comm_progress_timer.stop();
                }
            };
        }
        else
        {
            __pMainStatusBarControl._beginCommProgress = nexacro._emptyFn;
            __pMainStatusBarControl._stepCommProgress = nexacro._emptyFn;
            __pMainStatusBarControl._endCommProgress = nexacro._emptyFn;
        }

    }
}
if (_process)
{
    _process = null;
    _pFrame = null;
    _pMainFrame = null;
    _pChildFrame = null;
    _pFrameSetBase = null;
    _pFrameSet = null;
    _pVFrameSet = null;
    _pHFrameSet = null;
    _pTileFrameSet = null;
    __pMainStatusBarControl = null;

}

