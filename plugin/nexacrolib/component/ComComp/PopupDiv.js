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

if (!nexacro.PopupDiv)
{
    //==============================================================================
    // nexacro.PopupDiv
    //==============================================================================
    nexacro.PopupDiv = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Div.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        this._attached_comp = this;
    };

    var _pPopupDiv = nexacro._createPrototype(nexacro.Div, nexacro.PopupDiv);
    nexacro.PopupDiv.prototype = _pPopupDiv;
    _pPopupDiv._type_name = "PopupDiv";

    /* control */

    /* default properties */
    _pPopupDiv._p_returnvalue = "";
    _pPopupDiv._p_visible = false;  // component'base is true but popup'base is false

    /* internal variable */
    _pPopupDiv._callbackfunction = null;
    _pPopupDiv._callbackcontext = null;

    _pPopupDiv._eventclear_flag = false;
    _pPopupDiv._default_zindex = nexacro._zindex_popup;

    /* status */
    _pPopupDiv._is_window = true;
    _pPopupDiv._is_popup_control = true;
    _pPopupDiv._is_selfclose = true;
    _pPopupDiv._is_trackpopup = false;
    _pPopupDiv._track_capture = true;
    _pPopupDiv._is_fired_onsize = false;

    /* accessibility */
    _pPopupDiv._p_accessibilityrole = "none";

    _pPopupDiv._event_list = {
        "onclick": 1, "ondblclick": 1, "onkeypress": 1, "onkeydown": 1, "onkeyup": 1, "onkillfocus": 1, "onsetfocus": 1,
        "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1, "onlbuttondown": 1, "onlbuttonup": 1,
        "onload": 1, "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmove": 1, "onsize": 1, "onrbuttondown": 1, "onrbuttonup": 1,
        "oncloseup": 1, "onpopup": 1, "onlayoutchanged": 1, "canlayoutchange": 1,
        "onmousewheel": 1, "onmousedown": 1, "onmouseup": 1,
        "onvscroll": 1, "onhscroll": 1,
        "oncontextmenu": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1, "ondevicebuttonup": 1
    };

    //===============================================================
    // nexacro.PopupDiv : Create & Destroy & Update
    //===============================================================  
    _pPopupDiv.on_create_control_element = function (parent_elem)
    {
        //if (!parent_elem) return null;

        var control_elem;
        if (this._is_scrollable)
        {
            control_elem = this.on_create_popupscrollable_control_element(parent_elem);
        }
        else
        {
            control_elem = this.on_create_popup_control_element(parent_elem); // popup
        }

        /*if (control_elem && this._default_zindex > 0)
        {
            control_elem.setElementZIndex(this._default_zindex);
        }*/

        return control_elem;
    };

    _pPopupDiv.on_created = function (window)
    {
        // 기본작업
        nexacro.Div.prototype.on_created.call(this, window);

        // 팝업에 대한 작업
        /*var control_elem = this._control_element;
        if (control_elem)
        {
            control_elem.setElementPosition(-5000, 0);
        }*/
    };

    _pPopupDiv.destroyComponent = function ()
    {
        nexacro.PopupControl.prototype.destroyComponent.call(this);
        nexacro.Div.prototype.destroyComponent.call(this);

        this._callbackfunction = null;
        this._callbackcontext = null;

        return true;
    };

    _pPopupDiv.on_created_contents = function (win)
    {
        // 기본작업
        nexacro.Div.prototype.on_created_contents.call(this, win);

        // 팝업이 화면에 보이지 않아도 body의 스크롤 영역을 차지하게 되기때문에 작게 만들어 구석으로 배치
        var control_elem = this._control_element;
        if (!this._p_visible && control_elem)
        {
            //control_elem.setElementPosition(-5000, 0);
            //control_elem.setElementPosition(0, 0);
            //control_elem.setElementSize(1, 1);
            control_elem.setElementFont(this._getCurrentStyleInheritValue("font"));
            control_elem.setElementColor(this._getCurrentStyleInheritValue("color"));
            control_elem.setElementWordSpacing(this._getCurrentStyleInheritValue("wordSpacing"));
            control_elem.setElementLetterSpacing(this._getCurrentStyleInheritValue("letterSpacing"));
        }
    };

    _pPopupDiv.on_create_contents_command = function ()
    {
        return "";
    };

    _pPopupDiv.on_attach_contents_handle = function (win)
    {
        // 기본작업
        nexacro.Div.prototype.on_created.call(this, win);

        // 팝업에 대한 작업
        /*var control_elem = this._control_element;
        if (control_elem)
        {
            control_elem.setElementPosition(-5000, 0);
        }*/
    };

    _pPopupDiv._applyElementVisible = function (v)
    {
        nexacro.Component.prototype._applyElementVisible.call(this, v);
    };

    //===============================================================
    // nexacro.PopupDiv : Override
    //===============================================================
    _pPopupDiv.on_update_position = function (resize_flag, move_flag, update)
    {
        if (this._p_visible || !nexacro._allow_default_pinchzoom)
        {
            var control_elem = this._control_element;
            if (control_elem)
            {
                if (move_flag)
                {
                    var left = this._adjust_left;
                    var top = this._adjust_top;

                    if (this._is_popup_control)
                    {
                        var _window = this._getWindow();
                        if (_window && (_window._wheelZoom != undefined))
                        {
                            control_elem.setElementZoom(_window._wheelZoom);
                            if (_window._wheelZoom != 100)
                            {
                                left = left * nexacro._getDevicePixelRatio(control_elem);
                                top = top * nexacro._getDevicePixelRatio(control_elem);
                            }
                        }
                    }

                    control_elem.setElementPosition(left, top);
                    this.on_fire_onmove(this._adjust_left, this._adjust_top);
                }
                if (resize_flag || update)
                {
                    control_elem.setElementSize(this._adjust_width, this._adjust_height, update);
                    if (resize_flag)
                        this.on_fire_onsize(this._adjust_width, this._adjust_height);
                }
            }
        }
        else
        {
            // 팝업이 화면에 보이지 않아도 body의 스크롤 영역을 차지하게 되기때문에 작게 만들어 구석으로 배치
            var control_elem = this._control_element;
            if (control_elem)
            {
                //control_elem.setElementPosition(-5000, 0);
                //  control_elem.setElementSize(1, 1);

                if (move_flag)
                {
                    this.on_fire_onmove(this._adjust_left, this._adjust_top);
                }
                if (resize_flag)
                {
                    this.on_fire_onsize(this._adjust_width, this._adjust_height);
                }
            }
        }
    };

    _pPopupDiv._clearEventListener = function (evt_id)
    {

        const root = this._getRootObject();

        let form = root.getActiveForm();
        if (this._eventclear_flag && form)
        {
            var formEventList = form._event_list;
            if (!formEventList[evt_id])
            {
                return;
            }
        }
        nexacro._EventSinkObject.prototype._clearEventListener.apply(this, arguments);
    };


    _pPopupDiv.on_fire_user_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)
    {

        return nexacro.Form.prototype.on_fire_user_onkeydown.call(this, keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
    };

    _pPopupDiv._on_getFluidHorizontalContainerSize = function (contents_max_rect)
    {
        var ret = [0, 0];
        var c_w = 0;
        var c_h = 0;

        var border = this._getCurrentStyleBorder();

        var fittype = this.fittocontents;
        switch (fittype)
        {
            case "height":
            case "both":
                c_w = this._adjust_width;
                c_h = border ? contents_max_rect[1] + border._getBorderHeight() : contents_max_rect[1];

                ret = [c_w, c_h];
                break;
            case "width":
            case "none":
            default:
                ret = [this._track_width !== undefined ? this._track_width : this._adjust_width, this._track_height !== undefined ? this._track_height : this._adjust_height];
                break;
        }
        return ret;
    };

    _pPopupDiv._on_getFluidVerticalContainerSize = function (contents_max_rect)
    {
        var ret = [0, 0];
        var c_w = 0;
        var c_h = 0;

        var border = this._getCurrentStyleBorder();

        var fittype = this.fittocontents;
        switch (fittype)
        {
            case "width":
            case "both":
                c_w = border ? contents_max_rect[0] + border._getBorderWidth() : contents_max_rect[0];
                c_h = this._adjust_height;

                ret = [c_w, c_h];
                break;
            case "height":
            case "none":
            default:
                ret = [this._track_width !== undefined ? this._track_width : this._adjust_width, this._track_height !== undefined ? this._track_height : this._adjust_height];
                break;
        }

        return ret;
    };

    //===============================================================
    // nexacro.PopupDiv : Properties
    //===============================================================
    _pPopupDiv.set_visible = function (v)
    {
        if (this._is_trackpopup)
        {
            nexacro.PopupControl.prototype.set_visible.apply(this, arguments);
        }
    };

    _pPopupDiv._properties = [
        { name: "visible" }, { name: "returnvalue", readonly: true }
    ];

    nexacro._defineProperties(_pPopupDiv, _pPopupDiv._properties);

    //===============================================================
    // nexacro.PopupDiv : Methods
    //===============================================================
    _pPopupDiv.trackPopup = function (left, top, width, height, callbackfn, bcapture)
    {
        if (this._is_trackpopup) return;

        this._p_returnvalue = "";
        this._track_capture = bcapture === false ? false : true;

        var layoutmanager = nexacro._getLayoutManager();
        var is_fluid = layoutmanager ? layoutmanager.isFluidLayoutType(this._p_parent) : false;

        // position cast
        left = +left;
        top = +top;
        if (is_fluid)
        {
            width = (width == null) ? this._convToPixel(this.width, this._p_parent._adjust_width) : +width;
            height = (height == null) ? this._convToPixel(this.height, this._p_parent._adjust_height) : +height;
        }
        else
        {
            width = (width == null) ? this._adjust_width : +width;
            height = (height == null) ? this._adjust_height : +height;
        }


        var win = this._getWindow();
        var frame_w = 0;
        var frame_h = 0;
        if (win)
        {
            frame_w = win.root._adjust_width;
            frame_h = win.root._adjust_height;
        }

        // oversize
        var popup_r = left + width;
        if (popup_r > frame_w)
        {
            if (width <= frame_w)
            {
                left = frame_w - width;
            }
            else
            {
                left = 0;
                width = frame_w;
            }
        }

        var popup_b = top + height;
        if (popup_b > frame_h)
        {
            if (height <= frame_h)
            {
                top = frame_h - height;
            }
            else
            {
                top = 0;
                height = frame_h;
            }
        }

        if (this._is_fired_onsize == false && this._p_form)
        {
            this._p_form.on_fire_onsize(this._adjust_width, this._adjust_height);
            this._is_fired_onsize = true;
        }

        this._is_trackpopup = true;
        if (this._is_loading)
        {
            this._wait_pop_position = { obj: null, left: left, top: top, width: width, height: height };
        }
        else
        {
            var is_form_fluid = layoutmanager ? layoutmanager.isFluidLayoutType(this._p_form) : false;
            if (is_form_fluid)
            {
                this._track_width = width;
                this._track_height = height;
            }
            this._popup(left, top, width, height);
        }

        if (callbackfn && typeof callbackfn == "string")
        {
            var parent = this._p_parent;
            var callbackfunc = parent[callbackfn];
            while (!callbackfunc && !(parent._is_form && parent._is_loaded))
            {
                parent = parent._p_parent;
                callbackfunc = parent[callbackfn];
            }

            if (callbackfunc)
            {
                this._callbackfunction = callbackfunc;
                this._callbackcontext = parent;
            }
        }
        else
        {
            this._callbackfunction = null;
            this._callbackcontext = null;
        }

        this.setFocus();
        this.on_fire_onpopup(this);

        return (this.async ? true : this._p_returnvalue);
    };

    _pPopupDiv.trackPopupByComponent = function (obj, left, top, width, height, callbackfn, bcapture)
    {
        if (this._is_trackpopup) return;

        this._p_returnvalue = "";
        this._track_capture = bcapture === false ? false : true;

        if (width == null && height == null)
        {
            width = this._adjust_width;
            height = this._adjust_height;
        }

        left = +left;
        top = +top;

        var p = nexacro._getElementPositionInFrame(obj.getElement());
        var win_left = p.x;
        var win_top = p.y;

        var _window = this._getWindow();
        var m_c_width = _window.clientWidth;
        var m_c_height = _window.clientHeight;

        if (_window && (_window._wheelZoom != undefined))
        {
            if (_window._wheelZoom != 100)
            {
                m_c_width = m_c_width / nexacro._getDevicePixelRatio(obj.getElement());
                m_c_height = m_c_height / nexacro._getDevicePixelRatio(obj.getElement());
            }
        }

        //Left
        if (win_left + left + width > m_c_width)
        {
            var l_temp = m_c_width - width;
            if (l_temp < 0)
            {
                left = -win_left;
                if (width > m_c_width)
                    width = m_c_width;
            }
            else
            {
                left = l_temp - win_left;
            }
        }

        //Top
        if (win_top + top + height > m_c_height)
        {
            var t_temp = m_c_height - height;
            if (t_temp < 0)
            {
                top = -win_top;
                height = m_c_height;
            }
            else
            {
                top = t_temp - win_top;
            }
        }

        if (callbackfn && typeof callbackfn == "string")
        {
            var parent = this._p_parent;
            var callbackfunc = parent[callbackfn];
            while (!callbackfunc && !(parent._is_form && parent._is_loaded))
            {
                parent = parent._p_parent;
                callbackfunc = parent[callbackfn];
            }

            if (callbackfunc)
            {
                this._callbackfunction = callbackfunc;
                this._callbackcontext = parent;
            }

        }
        else
        {
            this._callbackfunction = null;
            this._callbackcontext = null;
        }

        if (this._is_fired_onsize == false && this._p_form)
        {
            this._p_form.on_fire_onsize(this._adjust_width, this._adjust_height);
            this._is_fired_onsize = true;
        }
        this._is_trackpopup = true;
        if (this._is_loading)
        {
            this._wait_pop_position = { obj: obj, left: left, top: top, width: width, height: height };
        }
        else
        {
            this._popupBy(obj, left, top, width, height, true);
        }
        this.setFocus();

        this.on_fire_onpopup(this);

        return (this.async ? true : this._p_returnvalue);
    };

    _pPopupDiv.closePopup = function (retvalue)
    {
        this._p_returnvalue = retvalue;
        if (this._p_visible)
        {
            this._closePopup(true);
            return true;
        }
        return false;
    };

    _pPopupDiv.isPopup = nexacro.PopupControl.prototype._is_popup;

    //===============================================================
    // nexacro.PopupDiv : Event Handlers
    //===============================================================
    _pPopupDiv._on_init = function ()
    {
        this._eventclear_flag = true;
        nexacro.FormBase.prototype._on_init.apply(this, arguments);
        this._eventclear_flag = false;
    };

    _pPopupDiv._on_load = function () // for async trackpopup
    {
        var ret = nexacro.Form.prototype._on_load.apply(this, arguments);

        var popup_info = this._wait_pop_position;
        if (popup_info)
        {
            if (popup_info.obj)
            {
                this._popupBy(popup_info.obj, popup_info.left, popup_info.top, popup_info.width, popup_info.height);

            }
            else
            {
                this._popup(popup_info.left, popup_info.top, popup_info.width, popup_info.height);
            }

            delete this._wait_pop_position;
        }

        return ret;
    };

    _pPopupDiv._on_bubble_mousewheel = function (elem, wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, event_bubbles, fire_comp, refer_comp, bScroll, meta_key)
    {
        // popupdiv가 띄워져 있을때는 부모(Form) 휠이 동작 되면 안됨
        if (!this._is_alive) return;

        var clientXY, pThis, ret, vscrollbar, old_vpos, new_vpos, hscrollbar, old_hpos, new_hpos;

        if (event_bubbles === undefined) //this is fire_comp or subcontrol
        {
            if (!refer_comp)
            {
                refer_comp = this;
            }

            if (this._p_visible && this._isEnable())
            {
                clientXY = this._getClientXY(canvasX, canvasY);
                event_bubbles = this.on_fire_user_onmousewheel(wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientXY[0], clientXY[0], this, refer_comp, meta_key);

                pThis = this._getFromComponent(this);

                if (event_bubbles !== true)
                {
                    if (!pThis.onmousewheel || (pThis.onmousewheel && !pThis.onmousewheel.defaultprevented))
                    {
                        ret = this.on_fire_sys_onmousewheel(wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientXY[0], clientXY[0], this, refer_comp, meta_key);

                        if (ret)
                        {
                            return;
                        }
                        if (!ctrl_key)
                        {
                            if (wheelDeltaY)
                            {
                                if (this.vscrollbar && this.vscrollbar._p_enable)
                                {
                                    vscrollbar = this.vscrollbar;
                                    old_vpos = vscrollbar._pos;
                                    this._setVScrollDefaultAction(vscrollbar, wheelDeltaY);
                                    new_vpos = vscrollbar._pos;
                                    if (old_vpos != new_vpos) return;
                                }
                            }

                            if (wheelDeltaX)
                            {
                                if (nexacro._OSVersion == "Mac OS")
                                {
                                    if (this.hscrollbar && this.hscrollbar._p_enable)
                                    {
                                        hscrollbar = this.hscrollbar;
                                        old_hpos = hscrollbar._pos;
                                        this._setHScrollDefaultAction(hscrollbar, wheelDeltaX);
                                        new_hpos = hscrollbar._pos;
                                        if (old_hpos != new_hpos) return;
                                    }
                                }
                            }
                        }
                        return;
                    }

                    // 아래코드는 현재 동작x (아래코드는 부모(Form)쪽 wheel이 동작됨)
                    if (event_bubbles === false) event_bubbles = undefined;

                    if (!pThis.onmousewheel || (pThis.onmousewheel && !pThis.onmousewheel.stoppropagation))
                    {
                        if (this._p_parent && !this._p_parent._is_application)
                        {
                            // 버블링 여부는 컴포넌트에서 결정한다.
                            var canvas = this._getRecalcCanvasXY(elem, canvasX, canvasY);

                            canvasX = canvas[0];
                            canvasY = canvas[1];

                            if (this._is_subcontrol)
                            {
                                return this._p_parent._on_bubble_mousewheel(elem, wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, event_bubbles, null, refer_comp, bScroll, meta_key);
                            }
                            else
                            {
                                return this._p_parent._on_bubble_mousewheel(elem, wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, false, this, refer_comp, bScroll, meta_key);
                            }
                        }
                    }
                }
            }
        }
        else
        {
            if (this._p_visible && this._isEnable())
            {
                clientXY = this._getClientXY(canvasX, canvasY);

                event_bubbles = this.on_fire_user_onmousewheel(wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientXY[0], clientXY[0], fire_comp, refer_comp, meta_key);

                pThis = this._getFromComponent(this);

                if (event_bubbles !== true)
                {
                    if (!pThis.onmousewheel || (pThis.onmousewheel && !pThis.onmousewheel.defaultprevented))
                    {
                        ret = this.on_fire_sys_onmousewheel(wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientXY[0], clientXY[0], fire_comp, refer_comp, meta_key);

                        if (ret)
                        {
                            return;
                        }

                        if (!ctrl_key)
                        {
                            if (wheelDeltaY)
                            {
                                if (this._isWheelScrollable(wheelDeltaY) && this.vscrollbar && this.vscrollbar._p_enable)
                                {
                                    vscrollbar = this.vscrollbar;
                                    old_vpos = vscrollbar._pos;
                                    this._setVScrollbarDefaultAction(vscrollbar, wheelDeltaY);
                                    new_vpos = vscrollbar._pos;
                                    if (old_vpos != new_vpos) return;
                                }
                            }

                            if (wheelDeltaX)
                            {
                                if (nexacro._OSVersion == "Mac OS")
                                {
                                    if (this._isWheelScrollable(wheelDeltaX) && this.hscrollbar && this.hscrollbar._p_enable)
                                    {
                                        hscrollbar = this.hscrollbar;
                                        old_hpos = hscrollbar._pos;
                                        this._setHScrollDefaultAction(hscrollbar, wheelDeltaX);
                                        new_hpos = hscrollbar._pos;
                                        if (old_hpos != new_hpos) return;
                                    }
                                }
                            }
                        }
                        return;
                    }
                    // 아래코드는 현재 동작x (아래 코드는 부모(Form)쪽 wheel이 동작됨)
                    if (!pThis.onmousewheel || (pThis.onmousewheel && !pThis.onmousewheel.stoppropagation))
                    {
                        if (this._p_parent && !this._p_parent._is_application)
                        {
                            // 버블링 여부는 컴포넌트에서 결정한다.
                            canvasX += this._adjust_left - this._scroll_left || 0;
                            canvasY += this._adjust_top - this._scroll_top || 0;
                            return this._p_parent._on_bubble_mousewheel(elem, wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, false, fire_comp, refer_comp, bScroll, meta_key);
                        }
                    }
                }
            }
        }
    };

    _pPopupDiv.on_fire_onpopup = function (obj)
    {
        if (this.onpopup && this.onpopup._has_handlers)
        {
            var evt = new nexacro.EventInfo(obj, "onpopup");
            return this.onpopup._fireEvent(this, evt);
        }
        return false;
    };

    _pPopupDiv.on_fire_onmove = function (left, top)
    {
        if (this.onmove && this.onmove._has_handlers)
        {
            var evt = new nexacro.MoveEventInfo(this, "onmove", left, top);
            return this.onmove._fireEvent(this, evt);
        }
        return false;
    };

    _pPopupDiv.on_fire_oncloseup = function (obj)
    {
        if (this._callbackfunction)
        {
            this._callbackfunction.call(this._callbackcontext, this.id, this._p_returnvalue);
        }
        if (this.oncloseup && this.oncloseup._has_handlers)
        {
            var evt = new nexacro.EventInfo(obj);
            evt.eventid = "oncloseup";
            return this.oncloseup._fireEvent(this, evt);
        }
        return false;
    };

    _pPopupDiv.on_fire_sys_onslidestart = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        return true;
    };

    _pPopupDiv.on_fire_sys_onslide = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        return true;
    };

    _pPopupDiv.on_fire_sys_onslideend = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        return true;
    };

    _pPopupDiv.on_fire_sys_onflingstart = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        return true;
    };

    _pPopupDiv.on_fire_sys_onfling = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        return true;
    };

    _pPopupDiv.on_fire_sys_onflingend = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        return true;
    };

    //===============================================================
    // nexacro.PopupDiv : Logical part
    //===============================================================
    _pPopupDiv._detach = function (comp)
    {
        this._attached_comp = null;
    };

    _pPopupDiv._popup = nexacro.PopupControl.prototype._popup;

    _pPopupDiv._popupBy = nexacro.PopupControl.prototype._popupBy;

    _pPopupDiv._closePopup = function ()
    {
        nexacro.PopupControl.prototype._closePopup.apply(this, arguments);
        this._is_trackpopup = false;
        if (this._track_width)
            this._track_width = undefined;
        if (this._track_height)
            this._track_height = undefined;
    };

    //===============================================================
    // nexacro.PopupDiv : Util Function
    //===============================================================
    _pPopupDiv._getWindow = nexacro.PopupControl.prototype._getWindow;

    _pPopupDiv._getWindowHandle = nexacro.PopupControl.prototype._getWindowHandle;

    _pPopupDiv._findOwnerElementHandle = nexacro.PopupControl.prototype._findOwnerElementHandle;

    _pPopupDiv._isPopupVisible = function ()
    {
        return this._p_visible;
    };

    _pPopupDiv = null;
}