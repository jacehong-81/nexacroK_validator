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

if (!nexacro.TitleBarControl)
{

    // ==============================================================================
    // nexacro.TitleBar
    // ==============================================================================
    nexacro.TitleBarControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Form.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._p_titleicon = new nexacro._TitleBarIconTextControl("titleicon", 0, 0, 0, 0, null, null, null, null, null, null, this);
        this._p_minbutton = new nexacro._TitleBarButtonControl("minbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
        this._p_maxbutton = new nexacro._TitleBarButtonControl("maxbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
        this._p_normalbutton = new nexacro._TitleBarButtonControl("normalbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
        this._p_closebutton = new nexacro._TitleBarButtonControl("closebutton", 0, 0, 0, 0, null, null, null, null, null, null, this);

        if (nexacro._macOSWebView)
            this._is_track = true;
        else if (parent && parent._is_frame && parent._is_window)
            this._is_track = false;
        else
            this._is_track = true;
    };

    var _pTitleBarControl = nexacro._createPrototype(nexacro.Form, nexacro.TitleBarControl);
    nexacro.TitleBarControl.prototype = _pTitleBarControl;

    _pTitleBarControl._type_name = "TitleBarControl";

    /* property value*/
    _pTitleBarControl._p_minbutton = null;
    _pTitleBarControl._p_normalbutton = null;
    _pTitleBarControl._p_maxbutton = null;
    _pTitleBarControl._p_closebutton = null;
    _pTitleBarControl._p_titleicon = null;
    _pTitleBarControl._p_buttonsize = undefined;
    _pTitleBarControl._p_buttongap = undefined;
    _pTitleBarControl._p_showtitleicon = true;

    /* internal variable */
    _pTitleBarControl._is_scrollable = false;
    _pTitleBarControl._is_nc_control = true;
    _pTitleBarControl._is_focus_accept = false;
    _pTitleBarControl._is_subcontrol = true;


    _pTitleBarControl._buttonsize = undefined;
    _pTitleBarControl._buttongap = 1;
    _pTitleBarControl._is_verticalmin = false;
    _pTitleBarControl._absolute_style = 0;
    _pTitleBarControl._state_openstatus = 0; //normal(0), restore(1), minimize(2), maximize(3)7

    //Accessibility
    _pTitleBarControl._skip_mobile_tabfocus = true;

    _pTitleBarControl._setNotifyHandler = function (obj, fnclickminbutton, fnclickmaxbutton, fnclicknormalbutton, fnclickclosebutton, fndblclick)
    {
        this._notify_target = obj;
        this._notify_clickminbutton = fnclickminbutton;
        this._notify_clickmaxbutton = fnclickmaxbutton;
        this._notify_clicknormalbutton = fnclicknormalbutton;
        this._notify_clickclosebutton = fnclickclosebutton;
        this._notify_dblclick = fndblclick;
    };

    _pTitleBarControl._unBindEvent = function ()
    {
        this._p_minbutton._removeEventHandler("onclick", this._notify_clickminbutton, this._notify_target);
        this._p_maxbutton._removeEventHandler("onclick", this._notify_clickmaxbutton, this._notify_target);
        this._p_normalbutton._removeEventHandler("onclick", this._notify_clicknormalbutton, this._notify_target);
        this._p_closebutton._removeEventHandler("onclick", this._notify_clickclosebutton, this._notify_target);
        this._p_titleicon._removeEventHandler("ondblclick", this._notify_dblclick, this._notify_target);

        this._removeEventHandler("ondblclick", this._notify_dblclick, this._notify_target);
    };


    _pTitleBarControl._bindEvent = function ()
    {
        this._p_minbutton._setEventHandler("onclick", this._notify_clickminbutton, this._notify_target);
        this._p_maxbutton._setEventHandler("onclick", this._notify_clickmaxbutton, this._notify_target);
        this._p_normalbutton._setEventHandler("onclick", this._notify_clicknormalbutton, this._notify_target);
        this._p_closebutton._setEventHandler("onclick", this._notify_clickclosebutton, this._notify_target);
        this._p_titleicon._setEventHandler("ondblclick", this._notify_dblclick, this._notify_target);

        this._setEventHandler("ondblclick", this._notify_dblclick, this._notify_target);
    };

    _pTitleBarControl._on_notify_minbutton = function (obj, fn)
    {
        this._notify_minbutton = fn;
    };

    _pTitleBarControl._on_notify_maxbutton = function (obj, fn)
    {
        this._notify_maxbutton = fn;
    };

    _pTitleBarControl._on_notify_normalbutton = function (obj, fn)
    {
        this._notify_normalbutton = fn;
    };

    _pTitleBarControl._on_notify_closebutton = function (obj, fn)
    {
        this._notify_closebutton = fn;
    };

    //===============================================================
    // nexacro.TitleBar : Create & Destroy & Update
    //===============================================================
    _pTitleBarControl.onCreateComponent = function (parent_elem)
    {
        if (!this._control_element)
        {
            nexacro.Component.prototype.onCreateComponent.call(this, parent_elem);
        }
    };

    _pTitleBarControl.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var titleicon = this._p_titleicon;
            var minbutton = this._p_minbutton;
            var maxbutton = this._p_maxbutton;
            var normalbutton = this._p_normalbutton;
            var closebutton = this._p_closebutton;

            normalbutton.set_visible(false);

            var frame = this._p_parent;
            titleicon._is_fiticonsize = frame ? frame._isMainFrame() : false;
            titleicon.set_hittesttype(this._hittest_type);

            titleicon.createComponent();
            minbutton.createComponent();
            maxbutton.createComponent();
            normalbutton.createComponent();
            closebutton.createComponent();

            if (this._displaytext)
                titleicon.on_apply_text(this._displaytext);

        }
    };

    _pTitleBarControl.on_created_contents = function (win)
    {
        this._bindEvent();
        this.on_apply_showtitleicon(this._p_showtitleicon);
        this._recalcLayout(this._getClientWidth(), this._getClientHeight());

        this._p_titleicon.on_created(win);
        this._p_minbutton.on_created(win);
        this._p_maxbutton.on_created(win);
        this._p_normalbutton.on_created(win);
        this._p_closebutton.on_created(win);

        this._setAccessibilityStatHidden(true);
        var frame = this._p_parent;
        if (frame && frame._is_window)
        {
            var _window = frame._getWindow();
            if (_window)
            {
                var icon = this._p_titleicon._getCurrentIcon();
                nexacro._setWindowHandleIconObject(_window.handle, icon);
            }
            //smilekkr's wv2;차후 win7 고려해서 소스 위치 최종 조정해야함;
            var frame_elem = frame.getElement();
            if (frame_elem)
                frame_elem.setTitleBarDrag(this._control_element, "drag");
        }
    };

    _pTitleBarControl.on_destroy_contents = function (callremovechild)
    {
        this._unBindEvent();
        this._notify_target = null;
        this._notify_clickmaxbutton = null;
        this._notify_clickmaxbutton = null;
        this._notify_clicknormalbutton = null;
        this._notify_clickclosebutton = null;
        this._notify_dblclick = null;

        var titleicon = this._p_titleicon;
        var minbutton = this._p_minbutton;
        var maxbutton = this._p_maxbutton;
        var normalbutton = this._p_normalbutton;
        var closebutton = this._p_closebutton;

        if (titleicon)
        {
            titleicon.destroy(callremovechild);
            this._p_titleicon = null;
        }
        if (minbutton)
        {
            minbutton.destroy(callremovechild);
            this._p_minbutton = null;
        }
        if (maxbutton)
        {
            maxbutton.destroy(callremovechild);
            this._p_maxbutton = null;
        }
        if (normalbutton)
        {
            normalbutton.destroy(callremovechild);
            this._p_normalbutton = null;
        }
        if (closebutton)
        {
            closebutton.destroy(callremovechild);
            this._p_closebutton = null;
        }
        if (this._movetrack_animationframe)
        {
            this._movetrack_animationframe.stop();
            this._movetrack_animationframe.destroy();
        }

    };

    _pTitleBarControl.on_change_containerRect = function (width, height)
    {
        if (this._is_created_contents)
        {
            nexacro.Form.prototype.on_change_containerRect.call(this, width, height);
            this._recalcLayout(width, height);
        }
    };

    _pTitleBarControl.on_changeStatus = function (/*changestatus, value, applystatus, currentstatus, currentuserstatus*/)
    {
        var parent = this._p_parent;
        if (parent && parent._activate == false)
            return "deactivate";
        else
            return "enabled";
    };

    _pTitleBarControl.on_apply_status = function (status)
    {
        var v = (status == "deactivate");

        if (this._p_titleicon)
            this._p_titleicon._changeStatus("deactivate", v);
        if (this._p_minbutton)
            this._p_minbutton._changeStatus("deactivate", v);
        if (this._p_maxbutton)
            this._p_maxbutton._changeStatus("deactivate", v);
        if (this._p_normalbutton)
            this._p_normalbutton._changeStatus("deactivate", v);
        if (this._p_closebutton)
            this._p_closebutton._changeStatus("deactivate", v);
    };

    //===============================================================
    // TitleBar : Properties
    //===============================================================
    _pTitleBarControl.set_showtitleicon = function (showtitleicon)
    {
        showtitleicon = nexacro._toBoolean(showtitleicon);
        if (this._p_showtitleicon != showtitleicon)
        {
            this._p_showtitleicon = showtitleicon;

            if (this._is_created)
                this.on_apply_showtitleicon(this._p_showtitleicon);
        }
    };

    _pTitleBarControl.on_apply_showtitleicon = function (showtitleicon)
    {
        var titleicon = this._p_titleicon;
        if (titleicon)
        {
            titleicon.set_icon(showtitleicon ? null : "none");
        }
    };

    _pTitleBarControl.on_apply_text = function (text)
    {
        if (this._p_titleicon)
            this._p_titleicon.set_text(text);
    };

    _pTitleBarControl.set_buttongap = function (buttongap)
    {
        if (this._p_buttongap != buttongap)
        {
            this._p_buttongap = buttongap;
            this._buttongap = parseInt(buttongap);
            if (this._buttongap < 0)
                this._buttongap = 0;
            if (this._is_created)
                this._recalcLayout();
        }
    };

    _pTitleBarControl.set_buttonsize = function (v)
    {
        if (this._p_buttonsize != v)
        {
            this._p_buttonsize = v;

            v = nexacro._toString(v);
            this._buttonsize = v.trim().split(" ");

            if (this._is_created)
                this._recalcLayout();
        }
    };


    //===============================================================
    // TitleBar Method Part
    //===============================================================

    //===============================================================
    // TitleBar : Event Handlers
    //===============================================================
    //_pTitleBarControl._on_minbutton_click = function(obj, e)
    //{
    //	var ownerframe = this.getOwnerFrame();
    //	if (ownerframe)
    //		ownerframe._on_minbutton_click(obj, e);
    //};
    //_pTitleBarControl._on_maxbutton_click = function(obj, e)
    //{
    //	var ownerframe = this.getOwnerFrame();
    //	if (ownerframe)
    //		ownerframe._on_maxbutton_click(obj, e);
    //};
    //_pTitleBarControl._on_normalbutton_click = function(obj, e)
    //{
    //	var ownerframe = this.getOwnerFrame();
    //	if (ownerframe)
    //		ownerframe._on_normalbutton_click(obj, e);
    //};
    //_pTitleBarControl._on_closebutton_click = function(obj, e)
    //{
    //	var ownerframe = this.getOwnerFrame();
    //	if (ownerframe)
    //		ownerframe._on_closebutton_click(obj, e);
    //};

    _pTitleBarControl._on_starttrack = function ()
    {
        if (!this._is_alive)
            return false;
        var ownerframe = this.getOwnerFrame();
        if (ownerframe)
            return ownerframe._on_titlebar_starttrack();
        return false;
    };

    _pTitleBarControl._on_endtrack = function (x, y, dragdata)
    {
        if (!this._is_alive) return;
        var ownerframe = this.getOwnerFrame();

        if (ownerframe)
            ownerframe._on_titlebar_endtrack(x, y, dragdata);
    };

    _pTitleBarControl._on_movetrack = function (x, y, dragdata, windowX, windowY)
    {
        if (!this._is_alive) return;
        var ownerframe = this.getOwnerFrame();

        if (ownerframe)
        {
            if (nexacro._SupportAnimationFrame)
            {
                var callbackfunc = function () { ownerframe._on_titlebar_movetrack(x, y, dragdata, windowX, windowY); };
                if (!this._movetrack_animationframe)
                {
                    var pThis = this;
                    this._movetrack_animationframe = new nexacro.AnimationFrame(pThis, callbackfunc);
                }
                else
                    this._movetrack_animationframe._setCallback(callbackfunc);
                this._movetrack_animationframe.start();
            }
            else
                ownerframe._on_titlebar_movetrack(x, y, dragdata, windowX, windowY);
        }
    };
    //===============================================================
    // TitleBar : Logical Part
    //===============================================================

    //TODO system icon 
    /* _pTitleBarControl._on_loadicon = function (url, w, h)
     {
         if ((w < 1) || (h < 1)) return;
 
         this._iconwidth = w;
         this._iconheight = h;
         
         // windowed frame이면 icon 설정
         var frame = this.parent;
         if (frame && frame._is_window)
         {
             var _window = frame._getWindow();
             if (_window)
             {
                 nexacro._setWindowHandleIcon(_window.handle, url);
             }
         }
     };
     */
    _pTitleBarControl._recalcLayout = function (width, height)
    {
        if (!this._p_closebutton) return;

        if (!width || !height)
        {
            width = this._getClientWidth();
            height = this._getClientHeight();
        }
        var top = this._getClientTop();
        var left = this._getClientLeft();
        var buttonsize = this._buttonsize;
        var buttonwidth = height;
        var buttonheight = height;
        if (this._is_verticalmin)
        {
            buttonwidth = width;
            buttonheight = width;
        }

        if (buttonsize && buttonsize.length > 0)
        {
            buttonwidth = nexacro._toInt(buttonsize[0]);
            buttonheight = nexacro._toInt(buttonsize[buttonsize.length - 1]);
        }

        buttonwidth = width < buttonwidth ? width : buttonwidth;
        buttonheight = height < buttonheight ? height : buttonheight;

        //[titlebar padding left][titleicon][minbtn][1px][maxbtn][1px][closebtn][titlebar padding right]
        // [10px][icon][6px][titletext][?px][minbtn][1px][maxbtn][1px][closebtn][2px] - old (nexacro14)

        var buttontop, display_as_minimize = ((this._state_openstatus == 2) || this._is_verticalmin);


        if (!this._is_verticalmin)
        {
            //var buttongap = this._buttongap;
            var leftgap = buttonwidth + this._buttongap;

            buttontop = top + (height - buttonheight) / 2;
            var curleft = width;
            curleft -= buttonwidth;
            this._p_closebutton.move(curleft, buttontop, buttonwidth, buttonheight);

            curleft -= leftgap;
            this._p_maxbutton.move(curleft, buttontop, buttonwidth, buttonheight);
            if (!display_as_minimize) // not minimize
                this._p_normalbutton.move(curleft, buttontop, buttonwidth, buttonheight);

            curleft -= leftgap;
            this._p_minbutton.move(curleft, buttontop, buttonwidth, buttonheight);
            if (display_as_minimize) // minimize
                this._p_normalbutton.move(curleft, buttontop, buttonwidth, buttonheight);

            this._p_titleicon.move(this._getClientLeft(), top, curleft, height);
        }
        else
        {
            // TODO TextElement 현재 회전 시킬 방법이 없음.
            // -webkit-transform: rotate(-90deg); 
            // -moz-transform: rotate(-90deg);
            // filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);
            // Opera has -o-transform support in 10.50

            // verticalmin            
            var topgap = this._buttongap;
            var buttonleft = left + (width - buttonwidth) / 2;

            buttontop = height - buttonheight;
            this._p_closebutton.move(buttonleft, buttontop, buttonwidth, buttonheight);

            buttontop -= topgap + buttonheight;
            this._p_maxbutton.move(buttonleft, buttontop, buttonwidth, buttonheight);
            if (!display_as_minimize) // not minimize
                this._p_normalbutton.move(buttonleft, buttontop, buttonwidth, buttonheight);

            buttontop -= topgap + buttonheight;
            this._p_minbutton.move(buttonleft, buttontop, buttonwidth, buttonheight);
            if (display_as_minimize) // minimize
                this._p_normalbutton.move(buttonleft, buttontop, buttonwidth, buttonheight);

            var curbottom = buttontop;
            this._p_titleicon.move(left, this._getClientTop(), width, curbottom);
        }
    };

    _pTitleBarControl._changeOpenStatus = function (cur)
    {
        var pre = this._prestate_openstatus = this._state_openstatus;
        this._state_openstatus = cur;
        if (this._is_verticalmin)
            cur = 2;

        if (pre != cur)
        {
            // titlebar 버튼 상태 변경
            //normal(0), restore(1), minimize(2), maximize(3)
            var absolute_style = this._absolute_style;
            switch (cur)
            {
                case 0:
                    if ((absolute_style & 0x0001) == 0)
                        this._p_minbutton.set_visible(true);
                    if ((absolute_style & 0x0002) == 0)
                        this._p_maxbutton.set_visible(true);
                    if ((absolute_style & 0x0008) == 0)
                        this._p_closebutton.set_visible(true);
                    this._p_normalbutton.set_visible(false);
                    break;
                case 1:
                    break;
                case 2:
                    this._p_minbutton.set_visible(false);
                    if ((absolute_style & 0x0002) == 0)
                        this._p_maxbutton.set_visible(true);
                    if ((absolute_style & 0x0008) == 0)
                        this._p_closebutton.set_visible(true);
                    if ((absolute_style & 0x0004) == 0)
                        this._p_normalbutton.set_visible(true);
                    break;
                case 3:
                    if ((absolute_style & 0x0001) == 0)
                        this._p_minbutton.set_visible(true);
                    this._p_maxbutton.set_visible(false);
                    if ((absolute_style & 0x0008) == 0)
                        this._p_closebutton.set_visible(true);
                    if ((absolute_style & 0x0004) == 0)
                        this._p_normalbutton.set_visible(true);
                    break;
            }

            this._recalcLayout(this._getClientWidth(), this._getClientHeight());
        }
    };

    _pTitleBarControl._setVerticalMin = function (v)
    {
        if (this._is_verticalmin == v)
            return;

        // min -> not min
        // 실제 상태는 min이 아니지만 max frame에 의해 min처럼 보이고 있었을 경우
        // 다시 가로 모드로 돌아갈때 normal로 되돌리기 위해 현재상태를 min으로 돌림.
        var pre = -1;
        if (v == false)
            pre = 2;

        this._is_verticalmin = v;

        // to ReArrange buttons
        var real_openstatus = this._state_openstatus;
        if (pre != (-1))
            this._state_openstatus = pre;

        this._changeOpenStatus(real_openstatus);
    };

    _pTitleBarControl._setDragMove = function (v, is_windowframe)
    {
        // track은 제어 하지 않아도 frame에서 걸러냄.
        if (v && is_windowframe)
            this._hittest_type = "caption";
        else
            this._hittest_type = "none";

        this.on_apply_hittesttype();

        var titleicon = this._p_titleicon;
        if (titleicon)
            titleicon.set_hittesttype(this._hittest_type);
    };

    _pTitleBarControl._setAbsoluteStyle = function (_add, _remove, _apply)
    {
        this._absolute_style &= ~(_remove);
        this._absolute_style |= _add;

        if (_apply == undefined || _apply == true)
            this._applyAbsoluteStyle();
    };

    _pTitleBarControl._applyAbsoluteStyle = function ()
    {
        // min hidden 0x0001 <-> 0x0100
        // max hidden 0x0002 <-> 0x0200
        // nor hidden 0x0004 <-> 0x0400
        // clo hidden 0x0008 <-> 0x0800
        // min disable 0x0010 <-> 0x1000
        // max disable 0x0020 <-> 0x2000
        // nor disable 0x0040 <-> 0x4000
        // clo disable 0x0080 <-> 0x8000
        var minbutton = this._p_minbutton;
        var maxbutton = this._p_maxbutton;
        var normalbutton = this._p_normalbutton;
        var closebutton = this._p_closebutton;
        var absolute_style = this._absolute_style;
        if (minbutton)
        {
            if ((absolute_style & 0x0001) > 0)
                minbutton.set_visible(false);
            else if ((absolute_style & 0x0100) > 0)
                minbutton.set_visible(true);
            if ((absolute_style & 0x0010) > 0)
                minbutton.set_enable(false);
            else if ((absolute_style & 0x1000) > 0)
                minbutton.set_enable(true);
        }

        if (maxbutton)
        {
            if ((absolute_style & 0x0002) > 0)
                maxbutton.set_visible(false);
            else if ((absolute_style & 0x0200) > 0)
                maxbutton.set_visible(true);
            if ((absolute_style & 0x0020) > 0)
                maxbutton.set_enable(false);
            else if ((absolute_style & 0x2000) > 0)
                maxbutton.set_enable(true);
        }

        if (normalbutton)
        {
            if ((absolute_style & 0x0004) > 0)
                normalbutton.set_visible(false);
            else if ((absolute_style & 0x0400) > 0)
                normalbutton.set_visible(true);
            if ((absolute_style & 0x0040) > 0)
                normalbutton.set_enable(false);
            else if ((absolute_style & 0x4000) > 0)
                normalbutton.set_enable(true);
        }

        if (closebutton)
        {
            if ((absolute_style & 0x0008) > 0)
                closebutton.set_visible(false);
            else if ((absolute_style & 0x08) > 0)
                closebutton.set_visible(true);
            if ((absolute_style & 0x0080) > 0)
                closebutton.set_enable(false);
            else if ((absolute_style & 0x8000) > 0)
                closebutton.set_enable(true);
        }
    };

    _pTitleBarControl._properties = [{ name: "buttongap" }, { name: "closebutton" }, { name: "maxbutton" },
    { name: "minbutton" }, { name: "normalbutton" }, { name: "titleicon" }
    ];
    nexacro._defineProperties(_pTitleBarControl, _pTitleBarControl._properties);

    _pTitleBarControl = null;

}


