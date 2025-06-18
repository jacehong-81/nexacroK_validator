//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2023 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//==============================================================================

if (!nexacro.PopupDateRangePicker)
{
    //==============================================================================
    // nexacro.PopupDateRangePicker
    //==============================================================================
    nexacro.PopupDateRangePicker = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.DateRangePicker.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        this._attached_comp = this;
    };

    var _pPopupDateRangePicker = nexacro._createPrototype(nexacro.DateRangePicker, nexacro.PopupDateRangePicker);
    nexacro.PopupDateRangePicker.prototype = _pPopupDateRangePicker;
    _pPopupDateRangePicker._type_name = "PopupDateRangePicker";

    /* default properties */
    _pPopupDateRangePicker._p_visible = false;  // component'base is true but popup'base is false
    _pPopupDateRangePicker._p_useclosebutton = true;

    _pPopupDateRangePicker._event_list["onpopup"] = 1;

    _pPopupDateRangePicker._properties = [
        { name: "useclosebutton" },
        { name: "visible" },
    ];

    /* internal variable */
    _pPopupDateRangePicker._callbackfunction = null;
    _pPopupDateRangePicker._callbackcontext = null;
    _pPopupDateRangePicker._headline_autoposition = false;
    _pPopupDateRangePicker._eventclear_flag = false;
    _pPopupDateRangePicker._default_zindex = nexacro._zindex_popup;

    /* status */
    _pPopupDateRangePicker._is_window = true;
    _pPopupDateRangePicker._is_popup_control = true;
    _pPopupDateRangePicker._is_selfclose = true;
    _pPopupDateRangePicker._is_trackpopup = false;
    _pPopupDateRangePicker._track_capture = true;
    _pPopupDateRangePicker._is_fired_onsize = false;

    /* accessibility */
    _pPopupDateRangePicker.accessibilityrole = "none";

    //===============================================================
    // nexacro.PopupDateRangePicker : Create & Destroy & Update
    //===============================================================  
    _pPopupDateRangePicker.on_create_control_element = function (parent_elem)
    {
        //if (!parent_elem) return null;
        var control_elem;
        if (this._is_scrollable)
            control_elem = this.on_create_popupscrollable_control_element(parent_elem);
        else
            control_elem = this.on_create_popup_control_element(parent_elem); // popup

        /*if (control_elem && this._default_zindex > 0)
        {
            control_elem.setElementZIndex(this._default_zindex);
        }*/
        return control_elem;
    };

    _pPopupDateRangePicker.on_created = function (window)
    {
        // 기본작업
        nexacro.DateRangePicker.prototype.on_created.call(this, window);

        // 팝업에 대한 작업
        /*var control_elem = this._control_element;
        if (control_elem)
        {
            control_elem.setElementPosition(-5000, 0);
        }*/
    };

    _pPopupDateRangePicker.destroyComponent = function ()
    {
        nexacro.PopupControl.prototype.destroyComponent.call(this);
        nexacro.DateRangePicker.prototype.destroyComponent.call(this);

        this._callbackfunction = null;
        this._callbackcontext = null;

        return true;
    };

    _pPopupDateRangePicker._isUseCloseButton = function ()
    {
        return (this.displaytype != "date") || this._p_useclosebutton;
    };

    _pPopupDateRangePicker.on_created_contents = function (win)
    {
        // 기본작업
        nexacro.DateRangePicker.prototype.on_created_contents.call(this, win);

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

    _pPopupDateRangePicker.on_create_contents_command = function ()
    {
        return "";
    };

    _pPopupDateRangePicker.on_attach_contents_handle = function (win)
    {
        // 기본작업
        nexacro.DateRangePicker.prototype.on_created.call(this, win);

        // 팝업에 대한 작업
        /*var control_elem = this._control_element;
        if (control_elem)
        {
            control_elem.setElementPosition(-5000, 0);
        }*/
    };

    _pPopupDateRangePicker._applyElementVisible = function (v)
    {
        nexacro.Component.prototype._applyElementVisible.call(this, v);
    };

    //===============================================================
    // nexacro.PopupDateRangePicker : Override
    //===============================================================
    _pPopupDateRangePicker.on_update_position = function (resize_flag, move_flag, update)
    {
        if (this._p_visible || !nexacro._allow_default_pinchzoom)
        {
            nexacro.DateRangePicker.prototype.on_update_position.call(this, resize_flag, move_flag, update);
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

    _pPopupDateRangePicker._clearEventListener = function (evt_id)
    {
        var application = this._getRootObject();
        if (this._eventclear_flag && application && application.getActiveForm())
        {
            var formEventList = application.getActiveForm()._event_list;
            if (!formEventList[evt_id])
            {
                return;
            }
        }
        nexacro._EventSinkObject.prototype._clearEventListener.apply(this, arguments);
    };


    _pPopupDateRangePicker.on_fire_user_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)
    {
        return nexacro.Form.prototype.on_fire_user_onkeydown.call(this, keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
    };

    //===============================================================
    // nexacro.PopupDateRangePicker : Properties
    //===============================================================
    _pPopupDateRangePicker.set_visible = function (v)
    {
        if (this._is_trackpopup)
        {
            nexacro.PopupControl.prototype.set_visible.apply(this, arguments);

            if (!v)
                this._closePopup(true);
        }
    };

    _pPopupDateRangePicker.set_useclosebutton = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_useclosebutton != v)
        {
            this._p_useclosebutton = v;
            this.on_apply_useclosebutton();
        }
    };

    _pPopupDateRangePicker.on_apply_useclosebutton = function ()
    {
        if (!this._control_element)
            return;

        this._updateButtons();
        this._recalcLayout();
    };

    _pPopupDateRangePicker.set_rangeposition = undefined;

    _pPopupDateRangePicker.on_apply_prop_stringresource = function ()
    {
        if (!nexacro._StringResource)
            return;

        nexacro.DateRangePicker.prototype.on_apply_prop_stringresource.call(this);
    };

    //===============================================================
    // nexacro.PopupDateRangePicker : Methods
    //===============================================================
    _pPopupDateRangePicker.trackPopup = function (rangeposition, left, top, width, height, callbackfn, bcapture)
    {
        return this._trackPopup(rangeposition, "", left, top, width, height, callbackfn, bcapture);
    };

    _pPopupDateRangePicker.trackPopupCenter = function (rangeposition, width, height, callbackfn, bcapture)
    {
        return this._trackPopup(rangeposition, "center", -1, -1, width, height, callbackfn, bcapture);
    };

    _pPopupDateRangePicker._trackPopup = function (rangeposition, align, left, top, width, height, callbackfn, bcapture)
    {
        if (this._is_trackpopup) return;

        this._track_capture = bcapture === false ? false : true;

        var layoutmanager = nexacro._getLayoutManager();
        var is_fluid = layoutmanager ? layoutmanager.isFluidLayoutType(this._p_parent) : false;

        // position cast

        if (is_fluid)
        {
            width = (width == null) ? this._convToPixel(this._p_width, this._p_parent._adjust_width) : +width;
            height = (height == null) ? this._convToPixel(this._p_height, this._p_parent._adjust_height) : +height;
        }
        else
        {
            width = (width == null) ? this._adjust_width : +width;
            height = (height == null) ? this._adjust_height : +height;
        }

        if (this.minwidth)
            width = Math.max(parseInt(this.minwidth), width);
        if (this.maxwidth)
            width = Math.min(parseInt(this.maxwidth), width);
        if (this.minheight)
            height = Math.max(parseInt(this.minheight), height);
        if (this.maxheight)
            height = Math.min(parseInt(this.maxheight), height);

        if (align == "center")
        {
            var win = this._getWindow();
            var c_width = win.root._adjust_width;
            var c_height = win.root._adjust_height;

            if (nexacro._Browser == "Runtime")
            {
                // screen 높이에 따라 계산 되어야 하므로 보정 
                c_width = Math.round(c_width / nexacro._getDevicePixelRatio(this.getElement()));
                c_height = Math.round(c_height / nexacro._getDevicePixelRatio(this.getElement()));
            }

            left = (c_width - width) / 2;
            top = (c_height - height) / 2;
            top = top < 0 ? 0 : top;
        }
        else
        {
            left = +left;
            top = +top;

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
        }

        this._is_trackpopup = true;
        if (this._is_loading)
        {
            this._wait_pop_position = { obj: null, left: left, top: top, width: width, height: height };
        }
        else
        {
            var is_form_fluid = layoutmanager ? layoutmanager.isFluidLayoutType(this.form) : false;
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

        ///////////////////////////////////////////////////////////////////////////////////////

        if (!rangeposition)
            rangeposition = "start";

        if (this._datepicker_group)
        {
            this._changeTab("date");
            this._datepicker_group._is_start_select = (rangeposition == "start");

            if (rangeposition == "start")
                this._datepicker_group._animateScrollEnd("startdate", true);
            else
                this._datepicker_group._animateScroll("enddate", true, undefined, true);
        }

        return true;
    };

    _pPopupDateRangePicker.trackPopupByComponent = function (rangeposition, obj, left, top, width, height, callbackfn, bcapture)
    {
        if (this._is_trackpopup) return;

        this._track_capture = bcapture === false ? false : true;

        if (width == null && height == null)
        {
            width = this._adjust_width;
            height = this._adjust_height;
        }

        width = parseInt(width);
        height = parseInt(height);

        if (this.minwidth)
            width = Math.max(parseInt(this.minwidth), width);
        if (this.maxwidth)
            width = Math.min(parseInt(this.maxwidth), width);
        if (this.minheight)
            height = Math.max(parseInt(this.minheight), height);
        if (this.maxheight)
            height = Math.min(parseInt(this.maxheight), height);

        left = +left;
        top = +top;

        var p = nexacro._getElementPositionInFrame(obj.getElement());
        var win_left = p.x;
        var win_top = p.y;

        var _window = this._getWindow();
        var m_c_width = _window.clientWidth;
        var m_c_height = _window.clientHeight;

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

        if (this._is_fired_onsize == false && this.form)
        {
            this.form.on_fire_onsize(this._adjust_width, this._adjust_height);
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

        ///////////////////////////////////////////////////////////////////////////////////////

        if (!rangeposition)
            rangeposition = "start";

        if (this._datepicker_group)
        {
            this._changeTab("date");
            this._datepicker_group._is_start_select = (rangeposition == "start");

            if (rangeposition == "start")
                this._datepicker_group._animateScrollEnd("startdate", true);
            else
                this._datepicker_group._animateScroll("enddate", true, undefined, true);
        }

        return true;
    };

    _pPopupDateRangePicker.closePopup = function ()
    {
        if (this._p_visible)
        {
            this._closePopup();
            return true;
        }
        return false;
    };

    _pPopupDateRangePicker.isPopup = nexacro.PopupControl.prototype._is_popup;

    //===============================================================
    // nexacro.PopupDateRangePicker : Event Handlers
    //===============================================================
    _pPopupDateRangePicker._on_init = function ()
    {
        this._eventclear_flag = true;
        nexacro.FormBase.prototype._on_init.apply(this, arguments);
        this._eventclear_flag = false;
    };

    _pPopupDateRangePicker._on_load = function () // for async trackpopup
    {
        var ret = nexacro.Form.prototype._on_load.apply(this, arguments);

        var popup_info = this._wait_pop_position;
        if (popup_info)
        {
            if (popup_info.obj)
            {
                this._popupBy(popup_info.obj, popup_info.left, popup_info.top, popup_info._p_width, popup_info._p_height);

            }
            else
            {
                this._popup(popup_info.left, popup_info.top, popup_info._p_width, popup_info._p_height);
            }

            delete this._wait_pop_position;
        }

        return ret;
    };

    _pPopupDateRangePicker.on_notify_onstartdateclick = function (obj, e)
    {
        nexacro.DateRangePicker.prototype.on_notify_onstartdateclick.call(this, obj, e);

        if (e.kind == "after_onchanged")
        {
            if (this._p_type == "single")
            {
                if (!this._isUseCloseButton())
                    this.closePopup();
            }
        }
    };

    _pPopupDateRangePicker.on_notify_onenddateclick = function (obj, e)
    {
        nexacro.DateRangePicker.prototype.on_notify_onenddateclick.call(this, obj, e);

        if (e.kind == "after_onchanged")
        {
            if (this._p_type == "range")
            {
                if (!this._isUseCloseButton())
                    this.closePopup();
            }
        }
    };

    _pPopupDateRangePicker.on_notify_close = function (obj, e)
    {
        this.closePopup();
    };

    _pPopupDateRangePicker._on_bubble_mousewheel = function (elem, wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, event_bubbles, fire_comp, refer_comp, bScroll, meta_key)
    {
        // PopupDateRangePicker가 띄워져 있을때는 부모(Form) 휠이 동작 되면 안됨
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
                                if (this._p_vscrollbar && this._p_vscrollbar._p_enable)
                                {
                                    vscrollbar = this._p_vscrollbar;
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
                                    if (this._p_hscrollbar && this._p_hscrollbar._p_enable)
                                    {
                                        hscrollbar = this._p_hscrollbar;
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
                                if (this._isWheelScrollable(wheelDeltaY) && this._p_vscrollbar && this._p_vscrollbar._p_enable)
                                {
                                    vscrollbar = this._p_vscrollbar;
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
                                    if (this._isWheelScrollable(wheelDeltaX) && this._p_hscrollbar && this._p_hscrollbar._p_enable)
                                    {
                                        hscrollbar = this._p_hscrollbar;
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

    _pPopupDateRangePicker.on_fire_onpopup = function (obj)
    {
        if (this.onpopup && this.onpopup._has_handlers)
        {
            var evt = new nexacro.EventInfo(obj, "onpopup");
            return this.onpopup._fireEvent(this, evt);
        }
        return false;
    };

    _pPopupDateRangePicker.on_fire_onmove = function (left, top)
    {
        if (this.onmove && this.onmove._has_handlers)
        {
            var evt = new nexacro.MoveEventInfo(this, "onmove", left, top);
            return this.onmove._fireEvent(this, evt);
        }
        return false;
    };

    _pPopupDateRangePicker.on_fire_oncloseup = function (obj)
    {
        if (this._callbackfunction)
        {
            this._callbackfunction.call(this._callbackcontext, this.id);
        }
        if (this.oncloseup && this.oncloseup._has_handlers)
        {
            var evt = new nexacro.EventInfo(obj);
            evt.eventid = "oncloseup";
            return this.oncloseup._fireEvent(this, evt);
        }
        return false;
    };

    _pPopupDateRangePicker.on_fire_sys_onslidestart = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        return true;
    };

    _pPopupDateRangePicker.on_fire_sys_onslide = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        return true;
    };

    _pPopupDateRangePicker.on_fire_sys_onslideend = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        return true;
    };

    _pPopupDateRangePicker.on_fire_sys_onflingstart = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        return true;
    };

    _pPopupDateRangePicker.on_fire_sys_onfling = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        return true;
    };

    _pPopupDateRangePicker.on_fire_sys_onflingend = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        return true;
    };

    //===============================================================
    // nexacro.PopupDateRangePicker : Logical part
    //===============================================================
    _pPopupDateRangePicker._detach = function (comp)
    {
        this._attached_comp = null;
    };

    _pPopupDateRangePicker._popup = nexacro.PopupControl.prototype._popup;

    _pPopupDateRangePicker._popupBy = nexacro.PopupControl.prototype._popupBy;

    _pPopupDateRangePicker._closePopup = function (only_logic)
    {
        if (this._datepicker_group && this._datepicker_group._modal_picker)
        {
            this._datepicker_group._modal_picker._closeUp();
            this._datepicker_group._modalYearMonthPicker(this._datepicker_group._modal_picker, false);
        }

        if (!only_logic)
            nexacro.PopupControl.prototype._closePopup.apply(this, arguments);

        this._is_trackpopup = false;
        if (this._track_width)
            this._track_width = undefined;
        if (this._track_height)
            this._track_height = undefined;
    };

    //===============================================================
    // nexacro.PopupDateRangePicker : Util Function
    //===============================================================
    _pPopupDateRangePicker._getWindow = nexacro.PopupControl.prototype._getWindow;

    _pPopupDateRangePicker._getWindowHandle = nexacro.PopupControl.prototype._getWindowHandle;

    _pPopupDateRangePicker._findOwnerElementHandle = nexacro.PopupControl.prototype._findOwnerElementHandle;

    _pPopupDateRangePicker._isPopupVisible = function ()
    {
        return this._p_visible;
    };


    nexacro._defineProperties(_pPopupDateRangePicker, _pPopupDateRangePicker._properties);

    _pPopupDateRangePicker = null;
};