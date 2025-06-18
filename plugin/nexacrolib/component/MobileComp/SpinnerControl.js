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

if (!nexacro.SpinnerControl)
{
    //==============================================================================
    // nexacro.SpinnerControl 
    //==============================================================================
    nexacro.SpinnerControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._list = [];
        this._disprowcnt = (this._prev_next_disprowcnt * 2) + 1 + 2;   // (prevcnt + nextcnt) + current + (hideprev, hidenext)
        this._overlay_blind = [];

        this._setFlingScrollBezier(0, 0, 0.5, 0.8);
        this._setFlingScrollMaxDistance(150);
    };

    var _pSpinnerControl = nexacro._createPrototype(nexacro.Component, nexacro.SpinnerControl);
    nexacro.SpinnerControl.prototype = _pSpinnerControl;

    _pSpinnerControl._type_name = "SpinnerControl";
    _pSpinnerControl._is_scrollable = true;
    _pSpinnerControl._is_subcontrol = true;
    _pSpinnerControl._is_spinnable = true;
    _pSpinnerControl._use_translate_scroll = true;//(nexacro._Browser == "Runtime");
    _pSpinnerControl._use_readonly_status = true;
    _pSpinnerControl._use_scrolllimit_fling_stop = false;
    _pSpinnerControl._prev_next_disprowcnt = 2; // min: 1

    _pSpinnerControl._event_list["onitemchanged"] = 1;
    _pSpinnerControl._event_list["ononecyclechanged"] = 1;

    /* default properties */
    _pSpinnerControl._p_scrollbartype = "none";
    _pSpinnerControl._p_scrolltype = "vertical";
    _pSpinnerControl._p_value = undefined;
    _pSpinnerControl._p_currentrow = 0;
    _pSpinnerControl._p_dragscrolltype = "both";

    _pSpinnerControl._properties = [
        { name: "value" },
        { name: "currentrow", readonly: true },
    ];

    /* internal variable */
    _pSpinnerControl._values = null;
    _pSpinnerControl._curritem = null;
    _pSpinnerControl._itemheight = 0;
    _pSpinnerControl._current_spin_rowidx = 0;
    _pSpinnerControl._is_infinity_scroll = true;
    _pSpinnerControl._infinity_container_max = 5000;    // total space: (spinneritem height * _infinity_container_max)

    _pSpinnerControl._use_scrolllimit_fling_stop = true;
    _pSpinnerControl._adjust_scrollpos_time = 300;
    _pSpinnerControl._adjust_scrollinit_time = 300;

    _pSpinnerControl._use_vibrate = true;  // 스크롤시 진동여부
    _pSpinnerControl._use_keyaction = true;

    if (_pSpinnerControl._use_vibrate)
    {
        _pSpinnerControl._vibrate = function ()
        {
            var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);
            if (bMobile)
            {
                navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

                if (navigator.vibrate)
                    navigator.vibrate(30);
            }
        }
    }
    else
    {
        _pSpinnerControl._vibrate = nexacro._emptyFn;
    }

    // override function
    _pSpinnerControl.on_create_contents = function ()
    {
        if (!this._is_infinity_scroll)
            this._infinity_container_max = 1;

        for (var i = 0; i < this._disprowcnt; i++)
        {
            this._list[i] = new nexacro.FieldBaseTextControl("SpinnerControlitem_" + i, 0, 0, 0, 0, null, null, null, null, null, null, this);
            this._list[i]._isFocusAcceptable = function ()
            {
                return true;
            }
            this._list[i].on_getIDCSSSelector = function ()
            {
                return "spinneritem";
            };
            this._list[i]._on_focus = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
            {
                if (evt_name != "lbuttondown" || this._userstatus == "selected")
                    nexacro.Component.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);
            };

            this._list[i]._setEventHandler("onclick", this._on_item_click, this);
            this._list[i].createComponent(true);
        }
    };

    _pSpinnerControl.on_created_contents = function (win)
    {
        for (var i = 0; i < this._list.length; i++)
            this._list[i].on_created(win);
    };

    _pSpinnerControl.on_create_contents_command = function ()
    {
        var str = "";

        for (var i = 0; i < this._list.length; i++)
            str += this._list[i].createCommand();

        return str;
    };

    _pSpinnerControl.on_attach_contents_handle = function (win)
    {
        for (var i = 0; i < this._list.length; i++)
            this._list[i].attachHandle(win);
    };

    _pSpinnerControl.on_after_created = function ()
    {
        var w, t = 0, h = this._height / (this._disprowcnt - 2) // 2 : prev, next;
        this._itemheight = this._limitDecimal(h);
        w = this._getClientWidth();
        h = (this._getClientHeight() - this._itemheight) / 2;
        for (var i = 0; i < 2; i++)
        {
            var overlay = this._overlay_blind[i] = new nexacro.Component("overlay" + ((i == 0) ? "top" : "bottom"), 0, t, w, h, null, null, null, null, null, null, this);
            this._overlay_blind[i]._type_name = "StaticControl";

            overlay._is_subcontrol = true;
            overlay._is_nc_control = true;
            overlay._is_simple_control = true;
            overlay.createComponent();
            overlay._control_element.setElementPointerEvents("none");

            //this._overlay_blind[i].move(0, t, w, h);
            t = h + this._itemheight;
        }

        this.on_apply_value();
    };

    _pSpinnerControl.on_destroy_contents = function ()
    {
        for (var i = 0; i < this._list.length; i++)
            this._list[i].destroy();

        for (i = 0; i < this._overlay_blind.length; i++)
            this._overlay_blind[i].destroy();

        this._overlay_blind = null;
        this._list = null;
        this._curritem = null;

        if (this._aniframe_adjust)
        {
            this._aniframe_adjust.destroy();
            this._aniframe_adjust = null;
        }

        if (this._scrolltask)
        {
            this._scrolltask.destroy();
            this._scrolltask = null;
        }
    };

    _pSpinnerControl._getMaxItemWidth = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            if (!this._list.length)
                return 0;

            var total_w = 0;

            var border = this._getCurrentStyleBorder();
            if (border)
                total_w += border._getBorderWidth();

            var padding = this._getCurrentStylePadding();
            if (padding)
                total_w += padding.left + padding.right;

            var font = this._list[0]._getCurrentStyleInheritValue("font");
            var refer_font = this._list[0]._getReferenceAbsoluteFont(font);
            var wordspace = this._list[0]._getCurrentStyleInheritValue("wordSpacing");
            var letterspace = this._list[0]._getCurrentStyleInheritValue("letterSpacing");
            var textwidth = 0;

            for (var i = 0; i < this._values.length; i++)
            {
                var text_size = nexacro._getTextSize(this._values[i], font, undefined, undefined, undefined, wordspace, letterspace, undefined, undefined, undefined, refer_font);
                textwidth = Math.max(textwidth, Math.ceil(text_size[0]));
            }
            total_w += textwidth;

            return total_w;
        }
        return 0;
    };

    _pSpinnerControl._correctScrollPos = function (pos)
    {
        return pos;
    };

    _pSpinnerControl._limitDecimal = function (number)
    {
        return nexacro._limitDecimal(number, 3);
    }

    _pSpinnerControl.on_change_containerRect = function (width, height)
    {
        var w, t, h = height / (this._disprowcnt - 2) // 2 : prev, next;

        this._itemheight = this._limitDecimal(h);

        if (this._control_element)
        {
            var n = this._disprowcnt;

            if (!this._is_infinity_scroll)
                n = this._disprowcnt - 2 + this._values.length - 1;

            this._control_element.setElementScrollMaxSize(width, h * this._infinity_container_max * n);    // 최대한
        }
        w = this._getClientWidth();
        h = (this._getClientHeight() - this._itemheight) / 2;
        t = 0;

        for (let i = 0; i < this._overlay_blind.length; i++)
        {
            this._overlay_blind[i].move(0, t, w, h);
            t = h + this._itemheight;
        }

        this._scrollCurrent();
        this._onResetScrollBar();
    };

    _pSpinnerControl._on_focus = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        nexacro.Component.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);

        if (evt_name != "lbuttondown")
        {
            if (this._curritem)
                this._curritem._setFocus(false);
        }
    };

    _pSpinnerControl._getDataRow = function (rowidx)
    {
        if (this._values.length > rowidx)
            return rowidx;

        return -9;
    };

    _pSpinnerControl._isLastDataRow = function (datarow)
    {
        return (datarow == this._values.length - 1);
    };

    _pSpinnerControl._isFirstDataRow = function (datarow)
    {
        return (datarow == 0);
    };

    _pSpinnerControl._setValues = function (values)
    {
        this._values = values;
        this._curritem = null;

        var center_idx = Math.floor(this._list.length / 2);
        var list = this._list;
        var datarow, value;
        var rowcnt = this._getScreenRowCount();

        for (var i = 0; i < list.length; i++)
        {
            list[i]._rowidx = i - center_idx;

            if (list[i]._rowidx < 0)
                list[i]._rowidx = rowcnt + list[i]._rowidx;

            datarow = this._getDataRow(list[i]._rowidx);
            value = this._getData(datarow);

            //if (list[i]._rowidx == 0)
            //    this._p_value = value;

            list[i].set_text(value);
        }

        if (this._disprowcnt > values.length)
            this._is_infinity_scroll = false;

        if (this._is_created)
        {
            this._current_spin_rowidx = 0;
            this._p_currentrow = this._getDataRow(0);
            this._scrollCurrent();
        }
    };

    _pSpinnerControl.set_value = function (v)
    {
        this._p_value = v;
        this.on_apply_value();
    };

    _pSpinnerControl.on_apply_value = function ()
    {
        this._current_spin_rowidx = this._p_currentrow = this._getCurrentDataRow();
        this._scrollCurrent();

        if (this._curritem)
            this._curritem._setFocus(false);
    };

    _pSpinnerControl.on_apply_prop_enable = function (v)
    {
        v = (v != null) ? v : this._isEnable();

        for (var i = 0; i < this._list.length; i++)
            this._list[i]._setEnable(v);
    };

    _pSpinnerControl._getCurrentDataRow = function ()
    {
        var values = this._values;
        if (values)
        {
            for (var i = 0; i < values.length; i++)
            {
                if (values[i] == this._p_value)
                    return i;
            }
        }

        return 0;
    };

    _pSpinnerControl._animateAdjustScroll = function (kind, no_ani, no_fire)
    {
        var spos, gab = 0;

        spos = this._limitDecimal(this.getVScrollPos());

        if (!this._list.length)
            return;

        var topitem;

        if (!this._scrollnextstop)
            topitem = this._getScreenTopItem();
        else
            topitem = this._getCurrentItem(undefined, -this._prev_next_disprowcnt);

        if (!topitem)
        {
            if (this._dir < 0)
                gab = -spos;
        }
        else
        {
            gab = topitem._adjust_top - spos;
        }

        if (kind == "next")
        {
            if (this._is_scrolling)
                return;

            if (!this._is_infinity_scroll)
            {
                if (this._isLastDataRow(this._p_currentrow))
                    return;
            }

            gab += this._itemheight;
        }
        else if (kind == "prev")
        {
            if (this._is_scrolling)
                return;

            if (!this._is_infinity_scroll)
            {
                if (this._isFirstDataRow(this._p_currentrow))
                    return;
            }

            gab -= this._itemheight;
        }
        else
        {
            this._is_scrolling = true;
        }

        this._is_scrolling = true;

        if (gab == 0)
        {
            this._animateAdjustScrollEnd(kind);
            return;
        }

        if (nexacro._Browser != "Runtime" && !no_ani)
        {
            var duration = this._adjust_scrollpos_time;
            var stime = (nexacro._Browser != "Runtime" && performance) ? performance.now() : (new Date());
            var pthis = this;
            var aniframe;
            function easeOut(t)
            {
                return 1 - Math.pow(1 - t, 2);
            };

            function animate(currtime)
            {
                var elapsed_time = currtime - stime;
                var progress = Math.min(elapsed_time / duration, 1);
                var currpos = easeOut(progress) * gab + spos;

                pthis._scrollTo(null, currpos, null, null, "", "move");

                if (progress < 1)
                    aniframe.start();
                else
                    pthis._animateAdjustScrollEnd(kind, no_fire);
            };

            if (this._aniframe_adjust)
                this._aniframe_adjust.destroy();

            aniframe = this._aniframe_adjust = new nexacro.AnimationFrame(this, animate);
            aniframe.start();



        }
        else
        {
            this._scrollTo(null, gab + spos, null, null, "", "move");
            this._animateAdjustScrollEnd(kind, no_fire);
        }
    };

    _pSpinnerControl._animateAdjustScrollEnd = function (kind, no_fire)
    {
        this._confirmValue(no_fire);
        this._vibrate();

        if (this._curritem)
            this._curritem._setFocus(false);

        this._startScrollCurrentTimer();
        this._is_scrolling = false;
        this._dir = 0;
    };

    _pSpinnerControl._fire_same_itemchanged = false;
    _pSpinnerControl._confirmValue = function (no_fire, prev_next_pos)
    {
        var item = this._getCurrentItem(undefined, prev_next_pos);
        if (item)
        {
            var preindex = this._p_currentrow;
            var prevalue = this._p_value;
            var postindex = this._getDataRow(item._rowidx);
            var postvalue = this._getData(postindex);

            if (this._fire_same_itemchanged || prevalue != postvalue)
            {
                this._current_spin_rowidx = item._rowidx;
                this._p_currentrow = this._getDataRow(item._rowidx);
                this._p_value = postvalue;

                if (!no_fire)
                    this.on_fire_onitemchanged(preindex, prevalue + "", prevalue, postindex, postvalue + "", postvalue);
            }
        }
    };

    _pSpinnerControl._getCurrentItem = function (postvpos, prev_next_pos)
    {
        var idx = this._getCurrentListItemIndex(postvpos) + (prev_next_pos != undefined ? prev_next_pos : 0);
        return this._list[idx];
    };

    _pSpinnerControl._getCurrentListItemIndex = function (postvpos, dir)
    {
        var centerpos = this._getClientHeight() / 2;
        var vpos = (postvpos != undefined) ? postvpos : this.getVScrollPos();

        if (dir != undefined)
        {
            var dirpos = centerpos;

            if (dir > 0)
                dirpos -= (this._itemheight / 2 - 1);
            else if (dir < 0)
                dirpos += (this._itemheight / 2 - 1);

            for (var i = 0; i < this._list.length; i++)
            {
                var top = this._list[i]._adjust_top - this._limitDecimal(vpos);
                var bot = top + this._itemheight;

                if (top <= centerpos && centerpos < bot)
                {
                    if (top <= dirpos && dirpos < bot)
                        return [i, i];
                    else
                        return [i, -1];
                }
            }
        }
        else
        {
            for (var i = 0; i < this._list.length; i++)
            {
                var top = this._list[i]._adjust_top - this._limitDecimal(vpos);
                var bot = top + this._itemheight;

                if (top <= centerpos && centerpos < bot)
                    return i;
            }
        }
        return -1;
    };

    _pSpinnerControl._getCurrentItemWithDir = function (postvpos, dir)
    {
        var idx = this._getCurrentListItemIndex(postvpos, dir);
        if (idx < 0)
            return null;

        return [this._list[idx[0]], this._list[idx[1]]];
    };

    _pSpinnerControl._getScreenTopItem = function ()
    {
        var beg = (this._getClientHeight() - this._itemheight) / 2;

        for (var i = 0; i < this._list.length; i++)
        {
            var top = this._list[i]._adjust_top - this._limitDecimal(this.getVScrollPos());

            if (-1 <= top && top <= beg)
            {
                if (this._dir > 0)
                    return this._list[i];
                else if (this._dir < 0)
                    return this._list[i - 1];
                else
                {
                    if (top <= beg / 2)
                        return this._list[i];
                    else
                        return this._list[i - 1];
                }
            }
        }
    };

    _pSpinnerControl._scrollCurrent = function ()
    {
        if (!this._control_element)
            return;

        if (this._is_infinity_scroll)
        {
            var vpos = (this._control_element.container_maxheight - (this._itemheight * this._list.length)) / 2;

            if (vpos < this._itemheight)
                vpos = this._itemheight;

            var t = vpos;
            var center_idx = Math.floor(this._list.length / 2);
            var list = this._list;
            var rowcnt = this._getScreenRowCount();
            var datarow;

            for (var i = 0; i < this._list.length; i++)
            {
                list[i].move(0, t - this._itemheight, this._getClientWidth(), this._itemheight);
                t += this._itemheight;

                list[i]._rowidx = this._current_spin_rowidx - center_idx + i;

                if (list[i]._rowidx < 0)
                    list[i]._rowidx = rowcnt + list[i]._rowidx;
                else if (list[i]._rowidx >= rowcnt)
                    list[i]._rowidx = list[i]._rowidx - rowcnt;

                datarow = this._getDataRow(list[i]._rowidx);
                list[i].set_text(this._getData(datarow));
                list[i]._changeUserStatus("selected", false);
            }

            this._vscroll_pos = 0;
            this._control_element._reset_scrollpos = true;
            this._scrollTo(null, vpos, null, null, "", "init");
            this._control_element._reset_scrollpos = false;

            var item = this._getCurrentItem(vpos);
            if (item)
            {
                item._changeUserStatus("selected", true);
                this._currrowidx = item._rowidx;
                this._curritem = item;
            }
        }
        else
        {
            var t = 0;
            var center_idx = Math.floor(this._list.length / 2);
            var list = this._list;
            var rowcnt = this._getScreenRowCount();
            var datarow;

            for (var i = 0; i < this._list.length; i++)
            {
                list[i].move(0, t - this._itemheight, this._getClientWidth(), this._itemheight);
                t += this._itemheight;

                list[i]._rowidx = -center_idx + i;

                datarow = this._getDataRow(list[i]._rowidx);
                list[i].set_text(this._getData(datarow));
                list[i]._changeUserStatus("selected", false);
            }

            this._control_element._reset_scrollpos = true;
            this._scrollTo(null, this._itemheight * this._p_currentrow, null, null, "", "init");
            this._control_element._reset_scrollpos = false;

            var item = this._getCurrentItem(this._itemheight * this._p_currentrow);
            if (item)
            {
                item._changeUserStatus("selected", true);
                this._currrowidx = item._rowidx;
                this._curritem = item;
            }
        }
    };

    _pSpinnerControl._getData = function (rowidx)
    {
        return this._values[rowidx];
    };

    _pSpinnerControl._getScreenRowCount = function ()
    {
        if ((this._list.length - this._values.length) > 0)
            return this._list.length;

        return this._values.length;
    };

    _pSpinnerControl._startScrollCurrentTimer = function (applytime)
    {
        if (!this._is_infinity_scroll)
            return;

        applytime == undefined ? this._adjust_scrollinit_time : applytime;

        var pthis = this;

        this._stopScrollCurrentTimer();

        if (!this._scrolltask)
            this._scrolltask = new nexacro._CallbackTimer(this, function (id) { return pthis._callbackScrollCurrentTimer(); }, applytime);

        this._scrolltask.start();
    };

    _pSpinnerControl._stopScrollCurrentTimer = function ()
    {
        if (this._scrolltask)
        {
            this._scrolltask.destroy();
            this._scrolltask = null;
        }
    };

    _pSpinnerControl._callbackScrollCurrentTimer = function ()
    {
        this._scrollCurrent();

        if (this._curritem)
            this._curritem._setFocus(false);

        this._stopScrollCurrentTimer();
    };

    _pSpinnerControl._tmp_vscroll = 0;
    _pSpinnerControl._dir = 0;
    _pSpinnerControl.on_slidestart_default_action = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, refer_comp)
    {
        if (this._aniframe_adjust)
        {
            this._aniframe_adjust.stop();
            this._is_scrolling = false;
        }

        this._tmp_vscroll = this._limitDecimal(this.getVScrollPos());
        this._stopScrollCurrentTimer();
    };

    _pSpinnerControl.on_slideend_default_action = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, refer_comp)
    {
        this._scrollnextstop = false;
        if (touch_manager._is_next_fire_fling == false)
        {
            var delta = this._tmp_vscroll - this._limitDecimal(this.getVScrollPos());

            this._dir = 0;

            if (Math.abs(delta) > this._itemheight)
                this._scrollnextstop = true;

            if (delta < 0)
                this._dir = 1;
            else if (delta > 0)
                this._dir = -1;

            this._animateAdjustScroll();
        }
        else if (this._aniframe_adjust)
        {
            this._aniframe_adjust.stop();
            this._is_scrolling = false;
        }
        this._cur_ldown_elem = null;
    };

    _pSpinnerControl.on_flingend_default_action = function (elem, fling_handler, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, refer_comp)
    {
        var parent = this._cur_ldown_elem;
        var is_down = false;

        while (parent)
        {
            if (parent instanceof nexacro.SpinnerControl)
            {
                if (parent == this)
                    is_down = true;

                break;
            }
            parent = parent._p_parent;
        }

        var delta = this._tmp_vscroll - this._limitDecimal(this.getVScrollPos());

        this._dir = 0;

        if (delta < 0)
            this._dir = 1;
        else if (delta > 0)
            this._dir = -1;

        if (!is_down)
            this._animateAdjustScroll();
        else
            this._need_adjust = true;
    };

    _pSpinnerControl.on_touch_lbuttondown_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, fire_comp, refer_comp, meta_key)
    {
        nexacro.Component.prototype.on_touch_lbuttondown_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
        var win = this._getWindow();
        this._cur_ldown_elem = win._cur_ldown_elem;
    };

    _pSpinnerControl.on_touchstart_default_action = function (touch_manager, touchinfos, changedtouchinfos, refer_comp)
    {
        var win = this._getWindow();
        this._cur_ldown_elem = win._cur_ldown_elem;
    };

    _pSpinnerControl.on_fire_sys_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._need_adjust)
        {
            this._animateAdjustScroll();
            this._need_adjust = undefined;
        }
        this._cur_ldown_elem = null;
    };

    _pSpinnerControl.on_fire_sys_onrbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._need_adjust)
        {
            this._animateAdjustScroll();
            this._need_adjust = undefined;
        }
        this._cur_ldown_elem = null;
    };

    _pSpinnerControl.on_touchend_default_action = function (touch_manager, touchinfos, changedtouchinfos, refer_comp)
    {
        if (this._need_adjust)
        {
            this._animateAdjustScroll();
            this._need_adjust = undefined;
        }
    };

    _pSpinnerControl._keyAction = function (keycode)
    {
        if (this._p_scrolltype == "none" || this._p_scrolltype == "horizontal")
            return false;

        var pos;
        var currpos = this._limitDecimal(this.getVScrollPos());
        var control_elem = this._control_element;
        var limit = control_elem.vscroll_limit;

        switch (keycode)
        {
            case nexacro.Event.KEY_UP:
                if (0 < currpos)
                    pos = currpos - this._itemheight;
                else
                    return;
                break;
            case nexacro.Event.KEY_DOWN:
                if (limit > currpos)
                    pos = currpos + this._itemheight;
                else
                    return;
                break;
            case nexacro.Event.KEY_HOME:
                var firstvalue = this._values[0];
                this.set_value(firstvalue);
                return true;
            case nexacro.Event.KEY_END:
                var lastvalue = this._values[this._values.length - 1];
                this.set_value(lastvalue);
                return true;
            default:
                return false;
        }

        this._scrollTo(null, pos, null, null, "", "");
        this._confirmValue();
        this._startScrollCurrentTimer();

        if (this._curritem)
            this._curritem._setFocus(false);

        return true;
    };

    _pSpinnerControl.on_keydown_basic_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        if (this._use_keyaction)
            return this._keyAction(keycode);
    };

    _pSpinnerControl._setVScrollDefaultAction = function (wheelDelta)
    {
        if (this._p_scrolltype == "none" || this._p_scrolltype == "horizontal")
            return false;

        var pos;
        var currpos = this._limitDecimal(this.getVScrollPos());
        var control_elem = this._control_element;
        var limit = this._limitDecimal(control_elem.vscroll_limit);

        if (wheelDelta < 0)
        {
            if (limit > currpos)
                pos = currpos + this._itemheight;
            else
                return false;
        }
        else
        {
            if (0 < currpos)
                pos = currpos - this._itemheight;
            else
                return false;
        }

        this._scrollTo(null, pos, null, null, "", "mousewheel_v");
        this._confirmValue();
        this._startScrollCurrentTimer();

        if (this._curritem)
            this._curritem._setFocus(false);

        return true;
    };

    _pSpinnerControl._on_beforescroll = function (prehpos, prevpos, posthpos, postvpos, evttype, evtkind)
    {
        if (evtkind == "init")
            return true;

        var hmove = Math.abs(prehpos - posthpos);
        var vmove = Math.abs(prevpos - postvpos);

        var retn;
        if (hmove < vmove)
            retn = this.on_vscroll(prevpos, postvpos, evttype, evtkind);

        return true;
    };

    _pSpinnerControl._currrowidx = -1;
    _pSpinnerControl._dircurrrowidx = false;
    _pSpinnerControl._curritem = null;
    _pSpinnerControl.on_vscroll = function (prevpos, postvpos, evttype, evtkind)
    {
        var list = this._list;
        var dir = 0;
        var distance = postvpos - prevpos;

        if (distance > 0)
            dir = 1;
        else if (distance < 0)
            dir = -1;

        var rowcnt = this._getScreenRowCount();
        var datarow;
        var top;
        var control_elem = this._control_element;
        var win = this._getWindow();

        if (dir > 0)
        {
            while (1)
            {
                var hide_top = list[0];
                var hide_bottom = list[list.length - 1];

                if ((hide_top._adjust_top - postvpos + hide_top._adjust_height) < 0)
                {
                    top = hide_bottom._adjust_top + this._itemheight;

                    if (this._control_element.container_maxheight < top)
                        break;

                    hide_top.move(0, top);

                    var item = list.shift();
                    item._rowidx = hide_bottom._rowidx + 1;

                    if (item._rowidx >= rowcnt)
                        item._rowidx = item._rowidx - rowcnt;

                    datarow = this._getDataRow(item._rowidx);
                    item.set_text(this._getData(datarow));
                    list.push(item);
                }
                else
                    break;
            }

            var item = this._getCurrentItemWithDir(postvpos, dir);

            if (this._currrowidx >= 0 && this._currrowidx > item[0]._rowidx)
                this.on_fire_ononecyclechanged(1, evtkind);

            // #1 center line이  item안으로 들어올 때
            if (this._currrowidx != item[0]._rowidx)
            {
                if (this._curritem)
                    this._curritem._changeUserStatus("selected", false);

                this._currrowidx = item[0]._rowidx;
                this._curritem = item[0];

                item[0]._changeUserStatus("selected", true);
                this._vibrate();
            }

            /* #2 center area에 item이 들어올 때
            this._currrowidx = item[0]._rowidx;

            if (item[1])
            {
                if (this._dircurrrowidx != item[1]._rowidx)
                {
                    this._dircurrrowidx = item[1]._rowidx;
                    this._vibrate();
                }
            }
            */
        }
        else if (dir < 0)
        {
            while (1)
            {
                var hide_top = list[0];
                var hide_bottom = list[list.length - 1];

                if ((hide_bottom._adjust_top - postvpos) > this._getClientHeight())
                {
                    top = hide_top._adjust_top - this._itemheight;

                    if (0 > top)
                        break;

                    hide_bottom.move(0, top);

                    var item = list.pop();
                    item._rowidx = hide_top._rowidx - 1;

                    if (item._rowidx < 0)
                        item._rowidx = rowcnt + item._rowidx;

                    datarow = this._getDataRow(item._rowidx);
                    item.set_text(this._getData(datarow));
                    list.unshift(item);
                }
                else
                    break;
            }

            var item = this._getCurrentItemWithDir(postvpos, dir);

            if (this._currrowidx >= 0 && this._currrowidx < item[0]._rowidx)
                this.on_fire_ononecyclechanged(-1, evtkind);

            // #1 center line이  item안으로 들어올 때
            if (this._currrowidx != item[0]._rowidx)
            {
                if (this._curritem)
                    this._curritem._changeUserStatus("selected", false);

                this._currrowidx = item[0]._rowidx;
                this._curritem = item[0];

                item[0]._changeUserStatus("selected", true);
                this._vibrate();
            }

            /* #2 center area에 item이 들어올 때
            this._currrowidx = item[0]._rowidx;

            if (item[1])
            {
                if (this._dircurrrowidx != item[1]._rowidx)
                {
                    this._dircurrrowidx = item[1]._rowidx;
                    this._vibrate();
                }
            }
            */
        }

        //this._confirmValue();    // 연속적으로 증감이 되지 않는다.

        return true;
    };

    _pSpinnerControl._moveScroll = function (kind, no_ani, no_fire)
    {
        this._animateAdjustScroll(kind, no_ani, no_fire);
    };

    _pSpinnerControl._on_item_click = function (obj, e)
    {
        var beg = (this._getClientHeight() - this._itemheight) / 2 - 1; // -1 : 소숫점의 오차 범위
        var end = (this._getClientHeight() + this._itemheight) / 2 + 1; // +1 : 소숫점의 오차 범위

        var top = obj._adjust_top - this._limitDecimal(this.getVScrollPos());
        var bottom = (top + this._itemheight);

        if (beg <= top && bottom <= end)  // center
            this._confirmValue();
        else if (top < beg)
            this._moveScroll("prev");
        else if (bottom > end)
            this._moveScroll("next");
    };

    _pSpinnerControl.on_fire_onitemchanged = function (preindex, pretext, prevalue, postindex, posttext, postvalue)
    {
        if (this.onitemchanged && this.onitemchanged._has_handlers)
        {
            var evt = new nexacro.ItemChangeEventInfo(this, "onitemchanged", preindex, pretext, prevalue, postindex, posttext, postvalue);
            var ret = this.onitemchanged._fireEvent(this, evt);
            return nexacro._toBoolean(ret);
        }
        return false;
    };

    _pSpinnerControl.on_fire_ononecyclechanged = function (direction, evtkind)
    {
        if (this.ononecyclechanged && this.ononecyclechanged._has_handlers)
        {
            var evt = { direction: direction, evtkind: evtkind };
            var ret = this.ononecyclechanged._fireEvent(this, evt);
            return nexacro._toBoolean(ret);
        }
        return false;
    };

    _pSpinnerControl._getCanHscroll = function (hscrollbar, dragscrolltype, xdeltavalue)
    {
        return false;
    };

    _pSpinnerControl._getCanVscroll = function (vscrollbar, dragscrolltype, ydeltavalue)
    {
        var can_vscroll = false;
        // Check Vert Move
        // Check Vert Move
        if (ydeltavalue != 0 && (dragscrolltype != "none" && dragscrolltype != "horz"))
        {
            var vlimit, vpos, proc = true;

            if (vscrollbar)
            {
                if (vscrollbar._p_enable)
                {
                    vlimit = vscrollbar.max;
                    vpos = vscrollbar.pos;
                }
                else
                {
                    proc = false;
                }
            }
            else
            {
                vlimit = this._control_element.vscroll_limit;
                vpos = this.getVScrollPos();
            }

            if (proc)
            {
                if (ydeltavalue < 0) // 위로 Swipe -> 아래로 스크롤
                {
                    if (vpos < vlimit)
                        can_vscroll = true;
                }
                else // 아래로 Swipe -> 위로 스크롤
                {
                    if (vpos > 0)
                        can_vscroll = true;
                }
            }
        }
        return can_vscroll;
    };

    nexacro._defineProperties(_pSpinnerControl, _pSpinnerControl._properties);

    _pSpinnerControl = null;
};