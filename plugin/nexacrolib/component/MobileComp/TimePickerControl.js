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

if (!nexacro.TimePickerControl)
{
    //==============================================================================
    // nexacro.TimePickerControl
    //==============================================================================
    nexacro.TimePickerControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._value = {
            ampm: 0, hour: 0, min: 0, sec: 0, msec: 0,
            getText: function ()
            {
                var value;
                var hour = this.hour;
                if (this.ampm >= 0)
                {
                    if (this.ampm == 0) // am
                    {
                        if (hour == 12)
                            hour = 0;
                    }
                    else
                    {
                        if (this.hour < 12)
                            hour += 12;
                    }
                }
                hour = hour.toString().padLeft(2, "0");
                value = hour + this.min.toString().padLeft(2, "0") + this.sec.toString().padLeft(2, "0") + this.msec.toString().padLeft(3, "0")

                return value;
            }
        };
    };

    var _pTimePickerControl = nexacro._createPrototype(nexacro.Component, nexacro.TimePickerControl);
    nexacro.TimePickerControl.prototype = _pTimePickerControl;

    _pTimePickerControl._type_name = "TimePickerControl";
    _pTimePickerControl._is_subcontrol = true;
    _pTimePickerControl._use_readonly_status = true;

    _pTimePickerControl._event_list["onchanged"] = 1;

    _pTimePickerControl._p_useampm = true;
    _pTimePickerControl._p_usesecond = true;
    _pTimePickerControl._p_value = undefined;

    _pTimePickerControl._properties = [
        { name: "value" },
        { name: "useampm" },
        { name: "usesecond" },
        { name: "locale" },
    ];


    _pTimePickerControl._hour_control = null;
    _pTimePickerControl._min_control = null;
    _pTimePickerControl._sec_control = null;
    _pTimePickerControl._delimiter1 = null;
    _pTimePickerControl._delimiter2 = null;
    _pTimePickerControl._delimiter_width = 10;
    _pTimePickerControl._is_locale_control = true;
    _pTimePickerControl._is_ampm_front = true;
    _pTimePickerControl._usertimeformat = "";
    _pTimePickerControl._default_locale_time_style = "MEDIUMTIME";
    _pTimePickerControl._focus_order_list = null;

    _pTimePickerControl._updateAmPm = function (create_only)
    {
        if (this._p_useampm && !this._leadbutton)
        {
            this._ampm_control = new nexacro.SpinnerControl("ampmspinner", 0, 0, 0, 0, null, null, null, null, null, null, this);
            this._ampm_control._use_keyaction = false;
            this._ampm_control._setEventHandler("onitemchanged", this._on_ampm_changed, this);
            this._ampm_control._setValues(nexacro.Locale._getAmPm(this._locale));
            this._ampm_control.createComponent(create_only);
        }
        else if (!this._p_useampm)
        {
            if (this._ampm_control)
            {
                this._ampm_control.destroy();
                this._ampm_control = null;
            }
        }
    };

    _pTimePickerControl._updateSecond = function (create_only)
    {
        if (this._p_usesecond && !this._leadbutton)
        {
            this._delimiter2 = new nexacro.FieldBaseTextControl("delimiter_2", 0, 0, 0, 0, null, null, null, null, null, null, this);
            this._sec_control = new nexacro.SpinnerControl("secspinner", 0, 0, 0, 0, null, null, null, null, null, null, this);
            this._sec_control._use_keyaction = false;
            this._delimiter2.on_getIDCSSSelector = function ()
            {
                return "delimiter";
            };

            this._sec_control._setEventHandler("onitemchanged", this._on_sec_changed, this);

            this._delimiter2.set_text(":");
            this._delimiter2.createComponent(create_only);
            this._sec_control.createComponent(create_only);
            this._sec_control._setValues(this._makeTimeValue(0, 59));
        }
        else if (!this._p_usesecond)
        {
            if (this._sec_control)
            {
                this._sec_control.destroy();
                this._sec_control = null;
            }
        }
    };

    _pTimePickerControl._makeTimeValue = function (min, max)
    {
        var val = [];

        for (var i = min, j = 0; i <= max; i++)
        {
            val[j++] = i.toString().padLeft(2, "0");
        }
        return val;
    };

    _pTimePickerControl.on_create_contents = function ()
    {
        this._makeTimePickerCreateInfo();
        this._updateAmPm(true);

        this._hour_control = new nexacro.SpinnerControl("hourspinner", 0, 0, 0, 0, null, null, null, null, null, null, this);
        this._delimiter1 = new nexacro.FieldBaseTextControl("delimiter_1", 0, 0, 0, 0, null, null, null, null, null, null, this);
        this._min_control = new nexacro.SpinnerControl("minspinner", 0, 0, 0, 0, null, null, null, null, null, null, this);

        this._hour_control._use_keyaction = false;
        this._min_control._use_keyaction = false;

        this._delimiter1.on_getIDCSSSelector = function ()
        {
            return "delimiter";
        };

        this._hour_control._setEventHandler("onitemchanged", this._on_hour_changed, this);
        this._hour_control._setEventHandler("ononecyclechanged", this._on_hour_onecycle_changed, this);
        this._min_control._setEventHandler("onitemchanged", this._on_min_changed, this);

        this._delimiter1.set_text(":");
        this._hour_control.createComponent(true);
        this._delimiter1.createComponent(true);
        this._min_control.createComponent(true);

        if (this._p_useampm)
            this._hour_control._setValues([12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
        else
            this._hour_control._setValues(this._makeTimeValue(0, 23));

        this._hour_control._fire_same_itemchanged = this._p_useampm;

        this._min_control._setValues(this._makeTimeValue(0, 59));

        this._updateSecond(true);
        if (this._p_value)
            this.on_apply_value();

        this._focus_order_list = [];

        if (this._ampm_control && this._is_ampm_front)
            this._focus_order_list.push(this._ampm_control);
        if (this._hour_control)
            this._focus_order_list.push(this._hour_control);
        if (this._min_control)
            this._focus_order_list.push(this._min_control);
        if (this._sec_control)
            this._focus_order_list.push(this._sec_control);
        if (this._ampm_control && !this._is_ampm_front)
            this._focus_order_list.push(this._ampm_control);
    };

    _pTimePickerControl.on_created_contents = function (win)
    {
        if (this._ampm_control && this._is_ampm_front)
            this._ampm_control.on_created(win);
        if (this._hour_control)
            this._hour_control.on_created(win);
        if (this._delimiter1)
            this._delimiter1.on_created(win);
        if (this._min_control)
            this._min_control.on_created(win);
        if (this._delimiter2)
            this._delimiter2.on_created(win);
        if (this._sec_control)
            this._sec_control.on_created(win);
        if (this._ampm_control && !this._is_ampm_front)
            this._ampm_control.on_created(win);
    };

    _pTimePickerControl.on_create_contents_command = function ()
    {
        var str = "";

        if (this._ampm_control && this._is_ampm_front)
            str += this._ampm_control.createCommand();
        if (this._hour_control)
            str += this._hour_control.createCommand();
        if (this._delimiter1)
            str += this._delimiter1.createCommand();
        if (this._min_control)
            str += this._min_control.createCommand();
        if (this._delimiter2)
            str += this._delimiter2.createCommand();
        if (this._sec_control)
            str += this._sec_control.createCommand();
        if (this._ampm_control && !this._is_ampm_front)
            str += this._ampm_control.createCommand();

        return str;
    };

    _pTimePickerControl.on_attach_contents_handle = function (win)
    {
        if (this._ampm_control && this._is_ampm_front)
            this._ampm_control.attachHandle(win);
        if (this._hour_control)
            this._hour_control.attachHandle(win);
        if (this._delimiter1)
            this._delimiter1.attachHandle(win);
        if (this._min_control)
            this._min_control.attachHandle(win);
        if (this._delimiter2)
            this._delimiter2.attachHandle(win);
        if (this._sec_control)
            this._sec_control.attachHandle(win);
        if (this._ampm_control && !this._is_ampm_front)
            this._ampm_control.attachHandle(win);
    };

    _pTimePickerControl.on_destroy_contents = function ()
    {
        this._destroyControls();
        this._list = null;
        this._curr_item = null;
        this._focus_order_list = null;
    };

    _pTimePickerControl._recreate = function ()
    {
        if (!this._is_created)
            return;

        this._destroyControls();
        this.on_create_contents();
        this.on_created_contents(this._getWindow());
        this._recalcLayout();
    };

    _pTimePickerControl._destroyControls = function ()
    {
        if (this._hour_control)
        {
            this._hour_control.destroy();
            this._hour_control = null;
        }
        if (this._delimiter1)
        {
            this._delimiter1.destroy();
            this._delimiter1 = null;
        }
        if (this._min_control)
        {
            this._min_control.destroy();
            this._min_control = null;
        }
        if (this._delimiter2)
        {
            this._delimiter2.destroy();
            this._delimiter2 = null;
        }
        if (this._sec_control)
        {
            this._sec_control.destroy();
            this._sec_control = null;
        }
        if (this._ampm_control)
        {
            this._ampm_control.destroy();
            this._ampm_control = null;
        }
    };

    _pTimePickerControl._makeTimePickerCreateInfo = function (format)
    {
        var use_second = false, use_ampm = false, ampm_front;

        if (!format && this._usertimeformat)
            format = this._usertimeformat;

        if (!format)
            format = nexacro.Locale._makeTimeMaskStringFromIntl(this._locale, this._default_locale_time_style);

        if (format.indexOf("ss") >= 0)
            use_second = true;

        var idx1, idx2;
        if ((idx1 = format.indexOf("aa")) >= 0)
        {
            use_ampm = true;

            if ((idx2 = format.indexOf("h")) >= 0)
                ampm_front = (idx1 < idx2);
            else if ((idx2 = format.indexOf("H")) >= 0)
                ampm_front = (idx1 < idx2);
        }

        this._p_usesecond = use_second;
        this._p_useampm = use_ampm;

        if (ampm_front != undefined)
            this._is_ampm_front = ampm_front;
    };

    _pTimePickerControl._recalcLayout = function ()
    {
        this.on_change_containerRect(this._getClientWidth(), this._getClientHeight());
    };

    _pTimePickerControl._keyAction = function (e)
    {
        //      var enableaccessibility = this._env._p_enableaccessibility;

        if (e.ctrlkey == false && (e.keycode == nexacro.Event.KEY_LEFT || e.keycode == nexacro.Event.KEY_RIGHT))
        {
            this._moveFocus(e);
        }
        if (e.ctrlkey == false && (e.keycode == nexacro.Event.KEY_UP || e.keycode == nexacro.Event.KEY_DOWN))
        {
            var pickergroup = this.parent;
            this._getCurrSpinner(pickergroup._focused_pos)._keyAction(e.keycode);
        }
    };

    _pTimePickerControl._getCurrSpinner = function (spinner_id)
    {
        var spinner;
        var focus_list = this._focus_order_list;

        for (var i = 0; i < focus_list.length; i++)
        {
            if (focus_list[i].id == spinner_id)
            {
                return focus_list[i];
            }
        }
        return null;
    };

    _pTimePickerControl._moveFocus = function (e)
    {
        var pickergroup = this.parent;
        var focus_list = this._focus_order_list;
        var curridx;
        var lastidx = focus_list.length - 1;

        for (var i = 0; i < focus_list.length; i++)
        {
            if (focus_list[i].id == pickergroup._focused_pos)
            {
                curridx = i;
                break;
            }
        }

        if (e.keycode == nexacro.Event.KEY_LEFT)
        {
            if (curridx > 0)
                curridx--;
            else
                curridx = lastidx;
        }
        else if (e.keycode == nexacro.Event.KEY_RIGHT)
        {
            if (curridx < lastidx)
                curridx++;
            else
                curridx = 0;
        }

        var spinner = focus_list[curridx];
        spinner._setFocus(false);

        pickergroup._focused_pos = spinner.id;
    };

    _pTimePickerControl._on_focus = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        nexacro.Component.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);

        if (evt_name == "lbuttondown")
            return;

        var pickergroup = this.parent;

        if (!pickergroup._focused_pos)
            pickergroup._focused_pos = (this._ampm_control && this._is_ampm_front) ? "ampmspinner" : "hourspinner";

        if (pickergroup._focused_pos == "ampmspinner")
            this._ampm_control._setFocus(false);
        else if (pickergroup._focused_pos == "hourspinner")
            this._hour_control._setFocus(false);
        else if (pickergroup._focused_pos == "minspinner")
            this._min_control._setFocus(false);
        else if (pickergroup._focused_pos == "secspinner")
            this._sec_control._setFocus(false);
    };

    _pTimePickerControl.on_lbuttondown_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        nexacro.Component.prototype.on_lbuttondown_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
        this._common_down_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
    };

    _pTimePickerControl.on_touch_lbuttondown_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, fire_comp, refer_comp, meta_key)
    {
        nexacro.Component.prototype.on_touch_lbuttondown_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
        this._common_down_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
    };

    _pTimePickerControl.on_touchstart_basic_action = function (touch_manager, touchinfos, changedtouchinfos, refer_comp)
    {
        nexacro.Component.prototype.on_touchstart_basic_action.call(this, touch_manager, touchinfos, changedtouchinfos, refer_comp);

        var touchinfo = nexacro._getFirstTouchInfo(changedtouchinfos);
        this._common_down_action(touchinfo.target, "touch", false, false, false, touchinfo.canvasx, touchinfo.canvasy, touchinfo.screenx, touchinfo.screeny, refer_comp);
    };

    _pTimePickerControl._common_down_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        this._setCurrentSpinner(refer_comp);
    };

    _pTimePickerControl._setCurrentSpinner = function (refer_comp)
    {
        while (refer_comp)
        {
            if (refer_comp instanceof nexacro.SpinnerControl)
            {
                var pickergroup = this.parent;
                pickergroup._focused_pos = refer_comp.id;
                break;
            }
            refer_comp = refer_comp._p_parent;
        }
    };

    _pTimePickerControl.on_change_containerRect = function (width, height)
    {
        if (!this._control_element || !this._hour_control)
            return;

        var dispcnt = 2;    // hour, min
        var delimitercnt = 1;

        if (this._p_useampm)
            dispcnt++;
        if (this._p_usesecond)
        {
            dispcnt++;
            delimitercnt++;
        }

        var w = (width - (this._delimiter_width * delimitercnt)) / dispcnt;
        var l = 0;
        var ampm_w = 0

        if (this._ampm_control)
        {
            var wmax = this._ampm_control._getMaxItemWidth();
            ampm_w = Math.max(wmax, w);

            w = (width - ampm_w - (this._delimiter_width * delimitercnt)) / (dispcnt - 1);

            if (w < 0)
                w = 0;

            if (this._is_ampm_front)
            {
                this._ampm_control.move(l, 0, ampm_w, height);
                l += ampm_w;
            }
        }

        this._hour_control.move(l, 0, w, height);
        l += w;

        var delimiter_height = this._getItemHeight();
        var delimiter_top = this._getCenterItemPos(delimiter_height);
        this._delimiter1.move(l, delimiter_top, this._delimiter_width, delimiter_height);
        l += this._delimiter_width;

        this._min_control.move(l, 0, w, height);
        l += w;

        if (this._sec_control)
        {
            this._delimiter2.move(l, delimiter_top, this._delimiter_width, delimiter_height);
            l += this._delimiter_width;

            this._sec_control.move(l, 0, w, height);
            l += w;
        }

        if (this._ampm_control && !this._is_ampm_front)
            this._ampm_control.move(l, 0, ampm_w, height);
    };

    _pTimePickerControl.on_getIDCSSSelector = function ()
    {
        return "timepicker";
    };

    _pTimePickerControl.on_apply_prop_enable = function (v)
    {
        v = (v != null) ? v : this._isEnable();

        if (this._hour_control)
        {
            this._hour_control._setEnable(v);
        }
        if (this._delimiter1)
        {
            this._delimiter1._setEnable(v);
        }
        if (this._min_control)
        {
            this._min_control._setEnable(v);
        }
        if (this._delimiter2)
        {
            this._delimiter2._setEnable(v);
        }
        if (this._sec_control)
        {
            this._sec_control._setEnable(v);
        }
        if (this._ampm_control)
        {
            this._ampm_control._setEnable(v);
        }
    };

    _pTimePickerControl.set_locale = function (v)
    {
        if (this._p_locale != v)
        {
            this._p_locale = v;
            this.on_apply_locale(v);
        }
    };

    _pTimePickerControl.on_apply_locale = function ()
    {
        this._locale = "";
        this._locale = this._p_locale ? this._p_locale : this._getLocale();
        this._recreate();
    };

    _pTimePickerControl.set_value = function (v)
    {
        this._p_value = v
        this.on_apply_value();
    };

    _pTimePickerControl.on_apply_value = function ()
    {
        if (!this._p_value)
        {
            return;
            /*
            if (this._p_useampm)
            {
                this._value.ampm = 0;
                this._value.hour = 12;
            }
            else
            {
                this._value.ampm = -1;
                this._value.hour = 0;
            }

            this._value.min = 0;
            this._value.sec = 0;
            this._value.msec = 0;
            */
        }
        else
        {
            var hour = parseInt(this._p_value.substr(0, 2));
            var min = parseInt(this._p_value.substr(2, 2));
            var sec = parseInt(this._p_value.substr(4, 2));
            var msec = parseInt(this._p_value.substr(6, 3));

            if (this._p_useampm)
            {
                this._value.ampm = (hour >= 12 && hour < 24) ? 1 : 0;

                if (hour > 12)
                    hour -= 12;
                else if (hour == 0)
                    hour += 12;
            }
            else
            {
                this._value.ampm = -1;
            }

            this._value.hour = hour;
            this._value.min = min;
            this._value.sec = sec;
            this._value.msec = msec;
        }

        if (this._ampm_control)
        {
            var ampm = nexacro.Locale._getAmPm(this._locale);
            this._ampm_control.set_value(ampm[this._value.ampm]);
        }

        if (this._hour_control)
            this._hour_control.set_value(this._value.hour);

        if (this._min_control)
            this._min_control.set_value(this._value.min);

        if (this._sec_control)
            this._sec_control.set_value(this._value.sec);
    };

    _pTimePickerControl.set_useampm = function (v)
    {
        v = nexacro._toBoolean(v);
        this._p_useampm = v;
        this.on_apply_useampm();
    };

    _pTimePickerControl.on_apply_useampm = function ()
    {
        this.on_apply_value();
        this._updateAmPm();

        if (this._hour_control)
        {
            if (this._p_useampm)
                this._hour_control._setValues([12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
            else
                this._hour_control._setValues(this._makeTimeValue(0, 23));

            this._hour_control._fire_same_itemchanged = this._p_useampm;
        }
    };

    _pTimePickerControl.set_usesecond = function (v)
    {
        v = nexacro._toBoolean(v);
        this._p_usesecond = v;
        this.on_apply_usesecond();
    };

    _pTimePickerControl.on_apply_usesecond = function ()
    {
        this._updateSecond();
    };

    _pTimePickerControl._on_hour_changed = function (obj, e)
    {
        var prevalue = this._p_value;
        this._value.hour = obj._p_value;

        var postvalue = this._value.getText();

        if (prevalue != postvalue)
            this.on_fire_onchanged(prevalue, postvalue);
    };

    _pTimePickerControl._on_min_changed = function (obj, e)
    {
        var prevalue = this._p_value;
        this._value.min = obj._p_value;

        var postvalue = this._value.getText();

        if (prevalue != postvalue)
            this.on_fire_onchanged(prevalue, postvalue);
    };

    _pTimePickerControl._on_sec_changed = function (obj, e)
    {
        var prevalue = this._p_value;
        this._value.sec = obj._p_value;

        var postvalue = this._value.getText();

        if (prevalue != postvalue)
            this.on_fire_onchanged(prevalue, postvalue);
    };

    _pTimePickerControl._on_ampm_changed = function (obj, e)
    {
        var prevalue = this._p_value;
        this._value.ampm = obj.currentrow;

        var postvalue = this._value.getText();

        if (prevalue != postvalue)
            this.on_fire_onchanged(prevalue, postvalue);
    };

    _pTimePickerControl._on_hour_onecycle_changed = function (obj, e)
    {
        if (this._p_useampm)
        {
            if (this._value.ampm != 0)
            {
                this._value.ampm = 0;
                this._ampm_control._moveScroll("prev", true, true);
            }
            else
            {
                this._value.ampm = 1;
                this._ampm_control._moveScroll("next", true, true);
            }
        }
    };

    _pTimePickerControl._getItemHeight = function ()
    {
        return this._hour_control._itemheight ? this._hour_control._itemheight : 0;
    };

    _pTimePickerControl._getCenterItemPos = function (itemheight)
    {
        return itemheight * 2;
    };

    _pTimePickerControl.on_fire_onchanged = function (prevalue, postvalue)
    {
        //trace(postvalue)
        if (this.onchanged && this.onchanged._has_handlers)
        {
            var evt = new nexacro.ChangedEventInfo(this, "onchanged", prevalue, prevalue, postvalue, postvalue);
            return this.onchanged._fireEvent(this, evt);
        }
    };

    nexacro._defineProperties(_pTimePickerControl, _pTimePickerControl._properties);

    _pTimePickerControl = null;

};