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
if (!nexacro.DatePickerControl)
{
    //==============================================================================
    // nexacro.DatePickerControl
    //==============================================================================
    nexacro.DatePickerControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pDatePickerControl = nexacro._createPrototype(nexacro.Component, nexacro.DatePickerControl);
    nexacro.DatePickerControl.prototype = _pDatePickerControl;
    _pDatePickerControl._type_name = "DatePickerControl";
    _pDatePickerControl._p_accessibilityrole = "datepicker";
    _pDatePickerControl._is_subcontrol = true;

    /* control */
    _pDatePickerControl.head = null;
    _pDatePickerControl.body = null;

    /* default properties */
    _pDatePickerControl._changetype = "spin";

    /* internal variable */
    _pDatePickerControl._selected_year = "";
    _pDatePickerControl._selected_month = "";
    _pDatePickerControl._selected_day = "";

    /* status */
    _pDatePickerControl._use_readonly_status = true;
    _pDatePickerControl._is_locale_control = true;

    /* event list */
    _pDatePickerControl._event_list = {
        "onclick": 1, "ondayclick": 1, "onspin": 1, "oncloseup": 1, "onmonthclick": 1, "onyearclick": 1,
    };

    /* accessibility */
    _pDatePickerControl._p_accessibilityrole = "datepicker";
    _pDatePickerControl._has_accessibility_value = false; //datepicker open시 두번 읽는 문제

    //===============================================================
    // nexacro.DatePickerControl : Create & Destroy & Update
    //===============================================================
    _pDatePickerControl.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var head = this.head = new nexacro._DatePickerHeadControl("head", 0, 0, 0, 0, null, null, null, null, null, null, this);
            var body = this.body = new nexacro._DatePickerBodyControl("body", 0, 0, 0, 0, null, null, null, null, null, null, this);

            head.createComponent(true);
            body.createComponent(true);

            this.on_apply_datepickerchangetype(this._p_parent.datepickerchangetype);
        }
    };

    _pDatePickerControl.on_created_contents = function (win)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var head = this.head;
            var body = this.body;

            head._setEventHandler("onclick", this._on_head_onheadclick, this);
            head._setEventHandler("onspin", this._on_head_onheadspin, this);
            head._setEventHandler("onkeydown", this._on_head_onkeydown, this);

            body._setEventHandler("ondayclick", this._on_body_ondayclick, this);
            if (this._changetype == "button")
            {
                body._setEventHandler("onmonthclick", this._on_body_onmonthclick, this);
                body._setEventHandler("onyearclick", this._on_body_onyearclick, this);
            }
            body._setEventHandler("onkeydown", this._on_body_onkeydown, this);

            head.on_created(win);
            body.on_created(win);

            this._recalcLayout();
        }
    };

    _pDatePickerControl.on_create_contents_command = function ()
    {
        var head = this.head;
        var body = this.body;

        var str = "";
        if (head)
        {
            str += head.createCommand();
        }
        if (body)
        {
            str += body.createCommand();
        }

        return str;
    };

    _pDatePickerControl.on_attach_contents_handle = function (win)
    {
        var head = this.head;
        var body = this.body;

        head._setEventHandler("onclick", this._on_head_onheadclick, this);
        head._setEventHandler("onspin", this._on_head_onheadspin, this);
        head._setEventHandler("onkeydown", this._on_head_onkeydown, this);

        body._setEventHandler("ondayclick", this._on_body_ondayclick, this);
        if (this._changetype == "button")
        {
            body._setEventHandler("onmonthclick", this._on_body_onmonthclick, this);
            body._setEventHandler("onyearclick", this._on_body_onyearclick, this);
        }
        body._setEventHandler("onkeydown", this._on_body_onkeydown, this);

        body.attachHandle(win);
        head.attachHandle(win);

        this._recalcLayout();
    };

    _pDatePickerControl.on_destroy_contents = function ()
    {
        if (this.head)
        {
            this.head.destroy();
            this.head = null;
        }
        if (this.body)
        {
            this.body.destroy();
            this.body = null;
        }
    };

    _pDatePickerControl.on_change_containerRect = function (width, height)
    {
        this._recalcLayout();
    };

    //===============================================================
    // nexacro.DatePickerControl : Override
    //===============================================================
    _pDatePickerControl.on_apply_prop_enable = function (v)
    {
        var head = this.head;
        var body = this.body;

        if (head)
            head._setEnable(v);

        if (body)
            body._setEnable(v);
    };

    //===============================================================
    // nexacro.DatePickerControl : Properties
    //===============================================================
    _pDatePickerControl.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_readonly != v)
        {
            this._p_readonly = v;
            this.on_apply_readonly(v);
        }
    };

    _pDatePickerControl.on_apply_readonly = function (readonly)
    {
        this._changeStatus("readonly", readonly);

        var head = this.head;
        if (head)
        {
            head.set_readonly(readonly);
        }

        var body = this.body;
        if (body)
        {
            body.set_readonly(readonly);
        }
    };

    _pDatePickerControl.on_apply_datepickerchangetype = function (v)
    {
        if (v == "auto")
        {
            if (nexacro._isDesktop())
            {
                this._changetype = "spin";
            }
            else
            {
                this._changetype = "button"
            }
        }
        else
        {
            this._changetype = v;
        }
    };

    _pDatePickerControl._properties = [{ name: "readonly" }];
    nexacro._defineProperties(_pDatePickerControl, _pDatePickerControl._properties);

    //===============================================================
    // nexacro.DatePickerControl : Events
    //===============================================================

    _pDatePickerControl._on_head_onkeydown = function (obj, e)
    {
        var keycode = e.keycode;
        var enableaccessibility = this._env._p_enableaccessibility;

        // onspin 동작 시 return
        if ((e.fromreferenceobject.id == "spinedit") && keycode != 13)
            return;

        if (this._changetype == "button")
        {
            if (this.head.monthstatic._p_visible)
            {
                this._changeDate(obj, e);
            }
            else if (!this.head.monthstatic._p_visible && this.head.yearstatic.text.length < 6)
            {
                this._changeMonth(obj, e);
            }
            else
            {
                this._changeYear(obj, e);
            }
        }
        else
        {
            this._changeDate(obj, e);
        }

        if (!enableaccessibility)
        {
            if (!(obj instanceof nexacro._CalendarEditControl) && (keycode == 13 || keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40))
            {
                if (this._changetype != "button" || this.head.monthstatic._p_visible)
                {
                    this.on_fire_ondayclick(obj);
                }
            }
        }
    };

    _pDatePickerControl._on_head_onheadclick = function (obj, e)
    {
        var calendar = this._p_parent;
        if (calendar && calendar._onlydisplay == true)
        {
            calendar.on_fire_onclick(e.button, e.alt_key, e.ctrl_key, e.shift_key, e.screenX, e.screenY, e.canvasX, e.canvasY, e.clientX, e.clientY, calendar, obj, e.meta_key);
            return false;
        }

        if (!this._p_enable || this._p_readonly)
        {
            return false;
        }
        if (this._changetype == "button")
        {
            return false;
        }
        var head = this.head;
        var body = this.body;

        body._setDate(head._date.str_year, head._date.str_month, body._date.str_day);
    };

    _pDatePickerControl._on_head_onheadspin = function (obj, e)
    {
        var calendar = this._p_parent;
        if (calendar && calendar._onlydisplay == true)
        {
            return false;
        }

        if (!this._p_enable || this._p_readonly == true)
        {
            return false;
        }

        var head = this.head;
        var body = this.body;

        body._setDate(head._date.str_year, head._date.str_month, body._date.str_day);
    };

    _pDatePickerControl._on_body_ondayclick = function (obj, e)
    {
        this.on_fire_ondayclick(obj, e);
    };

    _pDatePickerControl._on_body_onmonthclick = function (obj, e)
    {
        this._on_datepicker_onmonthclick(obj, e);
    };

    _pDatePickerControl._on_body_onyearclick = function (obj, e)
    {
        this._on_datepicker_onyearclick(obj, e);
    };

    //todo 키액션 작업 필요
    _pDatePickerControl._on_body_onkeydown = function (obj, e)
    {
        var keycode = e.keycode;
        var enableaccessibility = this._env._p_enableaccessibility;

        if (this._changetype == "button")
        {
            if (this.head.monthstatic._p_visible)
            {
                this._changeDate(obj, e);
            }
            else if (!this.head.monthstatic._p_visible && this.head.yearstatic.text.length < 6)
            {
                this._changeMonth(obj, e);
            }
            else
            {
                this._changeYear(obj, e);
            }
        }
        else
        {
            this._changeDate(obj, e);
        }

        if (!enableaccessibility)
        {
            if (!(obj instanceof nexacro._CalendarEditControl || obj instanceof nexacro.Calendar) && (keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40))
            {
                if (this._changetype != "button" || this.head.monthstatic._p_visible)
                {
                    this.on_fire_ondayclick(obj);
                }
            }

        }

    };

    _pDatePickerControl.on_lbuttondown_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        var control_name = refer_comp.name;
        if (control_name == "head" || control_name == "prevbutton" || control_name == "nextbutton" ||
            control_name == "body" || control_name == "weekband" || control_name.indexOf("weekitem") > -1 || control_name.indexOf("dayitem") > -1)
        {
            this._refreshSpindate();
        }
    };

    _pDatePickerControl.on_touchend_basic_action = function (touch_manager, touchinfos, changedtouchinfos, refer_comp)
    {
        var control_name = refer_comp.name;
        if (control_name == "head" || control_name == "prevbutton" || control_name == "nextbutton" ||
            control_name == "body" || control_name == "weekband" || control_name.indexOf("weekitem") > -1 || control_name.indexOf("dayitem") > -1)
        {
            this._refreshSpindate();
        }
    };

    _pDatePickerControl._closeUp = function ()
    {
        var body = this.body;
        var monthstatic = this.head.monthstatic;

        if (!monthstatic._p_visible)
        {
            this.body._setDate(this._selected_day, this._selected_month, this._selected_year);
            this.head._setDate(this._selected_day, this._selected_month, this._selected_year);
        }

        body._months_visible(false);
        body._years_visible(false);

        body.weekband.set_visible(true);
        for (var i = 0; i < body._maxWeek; i++)
        {
            body._weekitems[i].set_visible(true);
        }

        monthstatic.set_visible(true);
    };

    _pDatePickerControl.on_fire_oncloseup = function (obj)
    {
        if (this.oncloseup && this.oncloseup._has_handlers)
        {
            this._closeUp();
            return this.oncloseup._fireEvent(this);
        }
        return false;
    };

    _pDatePickerControl.on_fire_ondayclick = function (obj, e)
    {
        if (this.ondayclick && this.ondayclick._has_handlers)
        {
            if (!e)
            {
                var item = this.body._getDayItem(this._selected_day);
                e = new nexacro.CalendarDayClickEventInfo(item, "ondayclick", this._value);
            }
            return this.ondayclick._fireEvent(this, e);
        }
        return false;
    };

    _pDatePickerControl._on_datepicker_onmonthclick = function (obj, e)
    {
        var calendar = this._p_parent;
        if (calendar._p_readonly)
            return;

        var from_comp = e.fromobject;
        var cur_date = parseInt(from_comp._year + from_comp._month + from_comp.text.padLeft(2, "0"));

        var head = this.head;
        var body = this.body;
        var yearstatic = head.yearstatic;
        var monthstatic = head.monthstatic;
        if (cur_date < 10)
        {
            cur_date = "0" + cur_date
        }
        else
        {
            cur_date = "" + cur_date;
        }

        body.weekband.set_visible(true);
        for (var i = 0; i < body._maxWeek; i++)
        {
            body._weekitems[i].set_visible(true);
        }

        monthstatic.set_visible(true);
        monthstatic.set_text(cur_date);
        head._date.str_month = cur_date;
        head._date.int_month = parseInt(cur_date);

        yearstatic.set_text(head._date.str_year + ".");
        head._recalcYearStatic(true)
        head._setFocus(false);
    };

    _pDatePickerControl._on_datepicker_onyearclick = function (obj, e)
    {
        var calendar = this._p_parent;

        if (calendar._p_readonly)
            return;

        var from_comp = e.fromobject;
        var cur_date = from_comp._year + from_comp._month + from_comp.text.padLeft(2, "0");

        var head = this.head;
        //var body = this.body;

        head._date.str_year = cur_date;
        head._date.int_year = cur_date;
        head.yearstatic.set_text(cur_date);
        head._recalcYearStatic();
        head._setFocus(false);
    };
    _pDatePickerControl.on_killfocus_basic_action = function ()
    {
        var calendar = this._p_parent;
        if (calendar._p_type == "monthonly")
        {
            var head = this.head;
            var body = this.body;

            head.monthstatic.set_visible(true);
            body._months_visible(false);
            body._years_visible(false);

            body.weekband.set_visible(true);
            for (var i = 0; i < body._maxWeek; i++)
            {
                body._weekitems[i].set_visible(true);
            }
        }
    }

    _pDatePickerControl._on_button_onnextlbuttondown = function ()
    {
        var calendar = this._p_parent;
        if (calendar && calendar._onlydisplay == true)
        {
            return false;
        }

        var head = this.head;
        if (!head._p_enable || head._p_readonly)
        {
            return false;
        }

        var year = head._date.int_year;
        var month = head._date.int_month;
        if ((month += 1) > 12)
        {
            month = 1;
            if ((year += 1) > 9999)
            {
                year = 0;
            }
        }

        head._setDate(year, month);
        head._refreshSpindate();

        this._on_head_onheadclick();
    };

    _pDatePickerControl._on_button_onprevlbuttondown = function ()
    {
        var calendar = this._p_parent;
        if (calendar && calendar._onlydisplay == true)
        {
            return false;
        }

        var head = this.head;
        if (!head._p_enable || head._p_readonly)
        {
            return false;
        }

        var year = head._date.int_year;
        var month = head._date.int_month;
        if ((month -= 1) <= 0)
        {
            month = 12;
            if ((year -= 1) < 0)
            {
                year = 9999;
            }
        }

        head._setDate(year, month);
        head._refreshSpindate();

        this._on_head_onheadclick();
    };

    //===============================================================
    // nexacro.DatePickerControl : Util Function
    //===============================================================
    _pDatePickerControl._setValue = function (v)
    {
        this._value = v;
        this.on_apply_value(v);
    };

    _pDatePickerControl.on_apply_value = function (value)
    {
        var year = value.substr(0, 4);
        var month = value.substr(4, 2);
        var day = value.substr(6, 2);

        this._selected_year = year;
        this._selected_month = month;
        this._selected_day = day;

        var head = this.head;
        if (head)
        {
            head._setDate(year, month);
            head._recalcLayout();
        }

        var body = this.body;
        if (body)
        {
            body._setDate(year, month, day);
        }
    };

    _pDatePickerControl._setHeadformatText = function ()
    {
        var head = this.head;
        if (head)
        {
            head._setDate(head._date.str_year, head._date.str_month);
            head._recalcLayout();
        }
    };

    _pDatePickerControl._setWeekformatText = function ()
    {
        var body = this.body;
        if (body)
        {
            body._setWeekformatText();
        }
    };

    _pDatePickerControl._getInnerDataset = function ()
    {
        var calendar = this._p_parent;
        if (calendar)
        {
            return calendar.getInnerDataset();
        }

        return null;
    };

    _pDatePickerControl._getBackgroundcolumn = function ()
    {
        var calendar = this._p_parent;
        if (calendar)
        {
            return calendar._p_backgroundcolumn;
        }

        return null;
    };

    _pDatePickerControl._getBordercolumn = function ()
    {
        var calendar = this._p_parent;
        if (calendar)
        {
            return calendar._p_bordercolumn;
        }

        return null;
    };

    _pDatePickerControl._getDatecolumn = function ()
    {
        var calendar = this._p_parent;
        if (calendar)
        {
            return calendar._p_datecolumn;
        }

        return null;
    };

    _pDatePickerControl._getTextcolorcolumn = function ()
    {
        var calendar = this._p_parent;
        if (calendar)
        {
            return calendar._p_textcolorcolumn;
        }

        return null;
    };

    _pDatePickerControl._getHeadheight = function ()
    {
        var calendar = this._p_parent;
        if (calendar)
        {
            return calendar._p_headheight;
        }

        return null;
    };

    _pDatePickerControl._getDaysize = function ()
    {
        var calendar = this._p_parent;
        if (calendar)
        {
            return calendar._p_daysize;
        }

        return "";
    };

    _pDatePickerControl._getHeadformat = function ()
    {
        var calendar = this._p_parent;
        if (calendar)
        {
            return calendar._p_headformat;
        }

        return null;
    };

    _pDatePickerControl._getWeekformat = function ()
    {
        var calendar = this._p_parent;
        if (calendar)
        {
            return calendar._p_weekformat;
        }

        return null;
    };

    _pDatePickerControl._getUsetrailingday = function ()
    {
        var calendar = this._p_parent;
        if (calendar)
        {
            return calendar._p_usetrailingday;
        }

        return false;
    };

    _pDatePickerControl._getShowmonthspin = function ()
    {
        var calendar = this._p_parent;
        if (calendar)
        {
            return calendar._p_showmonthspin;
        }

        return false;
    };

    _pDatePickerControl._getShowyearspin = function ()
    {
        var calendar = this._p_parent;
        if (calendar)
        {
            return calendar._p_showyearspin;
        }

        return false;
    };

    _pDatePickerControl._getCurrentDate = function ()
    {
        var calendar = this._p_parent;
        if (calendar)
        {
            return calendar._getCurrentDate();
        }

        return "";
    };

    _pDatePickerControl._getEndDay = function (year, month)
    {
        var calendar = this._p_parent;
        if (calendar)
        {
            return calendar._getEndDay(year, month);
        }

        return "";
    };

    //===============================================================
    // nexacro.DatePickerControl : Logical Part
    //===============================================================

    _pDatePickerControl._changeDate = function (obj, e)
    {
        var body = this.body;
        var body_date = body._date;
        var year = body_date.int_year;
        var month = body_date.int_month;
        var day = body_date.int_day;
        var endday = this._getEndDay(year, month);

        var is_full_changed = false;
        var inc_month = false;
        var inc_day = false;
        var dec_month = false;
        var dec_day = false;
        var enableaccessibility = this._env._p_enableaccessibility;
        var keycode = e.keycode;

        if (keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40 || keycode == 13 || (this._use_space_key && keycode == 32))
        {
            switch (keycode)
            {
                case 13:
                case 32:
                    var date = new nexacro.Date(year, month - 1, day);
                    year = date.getFullYear();
                    month = date.getMonth() + 1;
                    day = date.getDate();
                    break;
                case 37: // left arrow
                    if (e.ctrlkey)
                        dec_month = true;
                    else
                        dec_day = true;

                    if (dec_day)
                    {
                        day -= 1;
                        if (day <= 0)
                            dec_month = true;
                    }

                    if (dec_month)
                    {
                        month -= 1;
                        if (month <= 0)
                        {
                            if (year <= 0)
                                year = 9999;
                            else
                                year -= 1;

                            month = 12;
                        }

                        if (!e.ctrlkey)
                            day += this._getEndDay(year, month);
                        is_full_changed = true;
                    }
                    break;
                case 38: // up arrow
                    if (e.ctrlkey)
                    {
                        year -= 1;
                        is_full_changed = true;
                    }
                    else if (!enableaccessibility)
                    {
                        day -= 7;
                        if (day <= 0)
                        {
                            if (month <= 1)
                            {
                                month = 12;

                                if (year <= 0)
                                    year = 9999;
                                else
                                    year -= 1;
                            }
                            else
                            {
                                month -= 1;
                            }

                            day += this._getEndDay(year, month);
                        }
                    }
                    break;
                case 39: // right arrow
                    if (e.ctrlkey)
                        inc_month = true;
                    else
                        inc_day = true;

                    if (inc_day)
                    {
                        day += 1;
                        if (day > endday)
                            inc_month = true;
                    }

                    if (inc_month)
                    {
                        month += 1;
                        if (month > 12)
                        {
                            if (year >= 9999)
                                year = 0;
                            else
                                year += 1;

                            month = 1;
                        }

                        if (inc_day)
                        {
                            day -= endday;
                        }
                        is_full_changed = true;
                    }
                    break;
                case 40: // down arrow
                    if (e.ctrlkey)
                    {
                        year += 1;
                        is_full_changed = true;
                    }
                    else if (!enableaccessibility)
                    {
                        day += 7;
                        if (day > endday)
                        {
                            if (month >= 12)
                            {
                                month = 1;

                                if (year >= 9999)
                                    year = 0;
                                else
                                    year += 1;
                            }
                            else
                            {
                                month += 1;
                            }

                            day -= endday;
                        }
                    }
                    break;
            }

            year = nexacro._toString(year).padLeft(4, "0");
            month = nexacro._toString(month).padLeft(2, "0");
            day = nexacro._toString(day).padLeft(2, "0");
            this._setValue(year + month + day);

            // accessibility
            if (enableaccessibility)
            {
                if (is_full_changed)
                {
                    var item = this.body._getDayItem(this._selected_day);
                    item._setAccessibilityLabel(year + " " + month + " " + day);
                }

                // 음성출력 방지
                if (this._env._a11ytype != 2)
                {
                    var calendar = this._p_parent;
                    if (calendar)
                    {
                        var calendaredit = calendar._p_calendaredit;
                        if (calendaredit)
                            calendaredit._setAccessibilityLabel(is_full_changed ? year + " " + month + " " + day : day);
                    }
                }
            }
        }

        if (enableaccessibility)
        {
            if (keycode == 13) //esc, enter
            {

                this.on_fire_ondayclick(obj);
                //this._p_parent._closePopup();
            }
            else if (keycode == 27)
            {
                this._p_parent._closePopup();
            }
        }
    };
    _pDatePickerControl._changeMonth = function (obj, e)
    {
        var body = this.body;
        var body_date = body._date;
        var year = body_date.int_year;
        var month = body_date.int_month;
        var day = body_date.int_day;
        var keycode = e.keycode;
        if (keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40 || keycode == 13)
        {
            switch (keycode)
            {
                case 13:
                    var head = this.head;
                    var yearstatic = head.yearstatic;
                    var monthstatic = head.monthstatic;

                    body._months_visible(false);
                    body._days_visible(true);

                    if (month < 10)
                    {
                        month = "0" + month
                    }
                    else
                    {
                        month = "" + month;
                    }

                    body.weekband.set_visible(true);
                    for (var i = 0; i < body._maxWeek; i++)
                    {
                        body._weekitems[i].set_visible(true);
                    }

                    monthstatic.set_visible(true);
                    monthstatic.set_text(month);
                    head._date.str_month = month;

                    yearstatic.set_text(head._date.str_year + ".");
                    head._recalcYearStatic(true)

                    body._setDate(head._date.str_year, head._date.str_month, body._date.str_day);
                    break;
                case 37: // left arrow

                    month -= 1;

                    if (month <= 0)
                    {
                        if (year <= 0)
                            year = 9999;
                        else
                            year -= 1;

                        month = 12;
                    }
                    break;
                case 38: // up arrow
                    month -= 4;

                    if (month <= 0)
                    {
                        if (year <= 0)
                            year = 9999;
                        else
                            year -= 1;

                        month = 12;
                    }
                    break;
                case 39: // right arrow
                    month += 1;

                    if (month >= 13)
                    {
                        if (year <= 0)
                            year = 9999;
                        else
                            year += 1;

                        month = 1;
                    }
                    break;
                case 40: // down arrow
                    month += 4;

                    if (month >= 13)
                    {
                        if (year <= 0)
                            year = 9999;
                        else
                            year += 1;

                        month = 1;
                    }
                    break;
            }

            for (var i = 0; i < this.body._maxMonth; i++)
            {
                if (parseInt(this.body._monthitems[i].text) == month)
                    this.body._monthitems[i]._changeUserStatus("selected", true);
                else
                    this.body._monthitems[i]._changeUserStatus("selected", false);
            }

            if (body_date.int_year != year)
            {
                this.head.yearstatic.set_text(year);
                body_date.int_year = year;
                this.head._date.str_year = String(year);
            }
            else if (year != parseInt(this.head._date.str_year))
            {
                this.head._date.str_year = String(year);
            }

            body_date.int_month = month;
        }
    };

    _pDatePickerControl._changeYear = function (obj, e)
    {
        var body = this.body;
        var body_date = body._date;
        var year = body_date.int_year;
        var month = body_date.int_month;
        var day = body_date.int_day;
        var keycode = e.keycode;
        var year_range = this.head.yearstatic.text.split(" - ");
        var min_year = parseInt(year_range[0]);
        var max_year = parseInt(year_range[1]);


        if (keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40 || keycode == 13)
        {
            switch (keycode)
            {
                case 13:
                    body._years_visible(false);
                    body._months_visible(true);
                    this.head.yearstatic.set_text(year);
                    this.head._recalcYearStatic();
                    break;
                case 37: // left arrow
                    year -= 1;

                    break;
                case 38: // up arrow
                    year -= 4;

                    break;
                case 39: // right arrow
                    year += 1;

                    break;
                case 40: // down arrow
                    year += 4;

                    break;
            }

            if (year < min_year + 1 && keycode != 13)
            {
                min_year = min_year - 10;
                max_year = max_year - 10;
                var yearstr = min_year + " - " + max_year;

                this.head.yearstatic.set_text(yearstr);
                body._years_visible(true, min_year);
                this.head._recalcYearStatic();

                if (keycode == 38 && year != max_year - 1)
                {
                    year += 2;
                    if (year == max_year)
                        year -= 1;
                }
            }
            else if (year > max_year - 1)
            {
                min_year = min_year + 10;
                max_year = max_year + 10;
                var yearstr = min_year + " - " + max_year;

                this.head.yearstatic.set_text(yearstr);
                body._years_visible(true, min_year);
                this.head._recalcYearStatic();

                if (keycode == 40 && year != min_year + 1)
                {
                    year -= 2;
                    if (year == min_year)
                        year += 1;
                }
            }

            for (var i = 0; i < this.body._maxYear; i++)
            {
                if (parseInt(this.body._yearitems[i].text) == year)
                {
                    this.body._yearitems[i]._changeUserStatus("selected", true);
                }
                else
                {
                    if (parseInt(this.body._yearitems[i].text) != min_year && parseInt(this.body._yearitems[i].text) != min_year + 11)
                        this.body._yearitems[i]._changeUserStatus("selected", false);
                }
            }

            body_date.int_year = year;
        }
    };

    _pDatePickerControl._recalcLayout = function ()
    {
        if (this._is_created_contents)
        {
            var headheight = this._getHeadheight();

            var client_width = this._getClientWidth();
            var client_height = this._getClientHeight();

            if (!headheight) headheight = client_height / 8;

            var body_l = 0;
            var body_t = 0 + headheight;
            var body_w = client_width;
            var body_h = client_height - headheight;

            var head_l = 0;
            var head_t = 0;
            var head_w = client_width;
            var head_h = headheight;

            this.body.move(body_l, body_t, body_w, body_h, null, null);
            this.head.move(head_l, head_t, head_w, head_h, null, null);
        }
    };

    _pDatePickerControl._refreshSpindate = function ()
    {
        var head = this.head;
        if (this._is_created)
        {
            if (head)
            {
                head._refreshSpindate();
            }
        }
    };

    _pDatePickerControl._refreshDay = function ()
    {
        var body = this.body;
        if (this._is_created)
        {
            if (body)
            {
                body._refreshDay();
            }
        }
    };

    _pDatePickerControl._on_beforerepeat = function (refer_comp)
    {
        var head = this.head;
        if (head)
            return head._on_beforerepeat(refer_comp);
    };
    _pDatePickerControl = null;
    //delete _pDatePickerControl;

    //===============================================================
    // nexacro._DatePickerHeadControl
    //===============================================================
    nexacro._DatePickerHeadControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._date = {
            str_year: "", str_month: "",
            int_year: 0, int_month: 0
        };
    };

    var _pDatePickerHeadControl = nexacro._createPrototype(nexacro.Component, nexacro._DatePickerHeadControl);
    nexacro._DatePickerHeadControl.prototype = _pDatePickerHeadControl;
    _pDatePickerHeadControl._type_name = "DatePickerHeadControl";
    _pDatePickerHeadControl._is_subcontrol = true;

    /* control */
    _pDatePickerHeadControl.prevbutton = null;
    _pDatePickerHeadControl.nextbutton = null;
    _pDatePickerHeadControl.yearstatic = null;
    _pDatePickerHeadControl.monthstatic = null;
    _pDatePickerHeadControl.yearspin = null;
    _pDatePickerHeadControl.monthspin = null;

    /* internal variable */

    /* status */
    _pDatePickerHeadControl._use_readonly_status = true;

    /* event list */
    _pDatePickerHeadControl._event_list = {
        "onclick": 1, "onspin": 1, "onkeydown": 1
    };

    //===============================================================
    // nexacro._DatePickerHeadControl : Create & Destroy & Update
    //===============================================================
    _pDatePickerHeadControl.on_create_contents = function ()
    {
        var prevbutton = this.prevbutton = new nexacro.Button("prevbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
        var nextbutton = this.nextbutton = new nexacro.Button("nextbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
        var yearstatic = this.yearstatic = new nexacro.Static("yearstatic", 0, 0, 0, 0, null, null, null, null, null, null, this);
        var monthstatic = this.monthstatic = new nexacro.Static("monthstatic", 0, 0, 0, 0, null, null, null, null, null, null, this);
        var yearspin = this.yearspin = new nexacro._YearSpinControl("yearspin", 0, 0, 0, 0, null, null, null, null, null, null, this);
        var monthspin = this.monthspin = new nexacro._MonthSpinControl("monthspin", 0, 0, 0, 0, null, null, null, null, null, null, this);

        prevbutton._setControl();
        nextbutton._setControl();
        yearstatic._setControl();
        monthstatic._setControl();
        yearspin._setControl();
        monthspin._setControl();

        prevbutton.createComponent(true);
        nextbutton.createComponent(true);
        yearstatic.createComponent(true);
        monthstatic.createComponent(true);
        yearspin.createComponent(true);
        monthspin.createComponent(true);

        yearspin.set_visible(false);
        yearspin.set_min("0");
        yearspin.set_max("9999");
        yearspin.set_circulation(true);
        yearspin.set_displaycomma(false);

        monthspin.set_visible(false);
        monthspin.set_min("1");
        monthspin.set_max("12");
        monthspin.set_circulation(true);
        monthspin.set_displaycomma(false);
    };

    _pDatePickerHeadControl.on_created_contents = function (win)
    {
        this.on_apply_prop_enable(this._p_enable);

        var prevbutton = this.prevbutton;
        var nextbutton = this.nextbutton;
        var yearstatic = this.yearstatic;
        var monthstatic = this.monthstatic;
        var yearspin = this.yearspin;
        var monthspin = this.monthspin;

        if (nexacro._isTouchInteraction && nexacro._SupportTouch)
        {
            yearstatic._setEventHandler("onclick", this._on_static_mobile_onclick, this);
            monthstatic._setEventHandler("onclick", this._on_static_mobile_onclick, this);
        }
        yearstatic._setEventHandler("onlbuttondown", this._on_static_onlbuttondown, this);
        monthstatic._setEventHandler("onlbuttondown", this._on_static_onlbuttondown, this);
        prevbutton._setEventHandler("onclick", this._on_button_onprevclick, this);
        nextbutton._setEventHandler("onclick", this._on_button_onnextclick, this);
        yearspin._setEventHandler("onspin", this._on_spin_onspin, this);
        monthspin._setEventHandler("onspin", this._on_spin_onspin, this);
        yearspin._setEventHandler("onkeydown", this._on_spin_onkeydown, this);
        monthspin._setEventHandler("onkeydown", this._on_spin_onkeydown, this);

        prevbutton.on_created(win);
        nextbutton.on_created(win);
        yearstatic.on_created(win);
        monthstatic.on_created(win);
        yearspin.on_created(win);
        monthspin.on_created(win);

        yearspin.set_value(this._date.str_year);
        monthspin.set_value(this._date.str_month);

        if (this._p_parent._is_popupcontains)
        {
            yearspin._setEnableView(false);
            monthspin._setEnableView(false);
        }
        this._refreshSpindate();
    };

    _pDatePickerHeadControl.on_create_contents_command = function ()
    {
        this._refreshSpindate();

        var str = "";
        if (this.prevbutton)
        {
            str += this.prevbutton.createCommand();
        }
        if (this.nextbutton)
        {
            str += this.nextbutton.createCommand();
        }
        if (this.yearstatic)
        {
            str += this.yearstatic.createCommand();
        }
        if (this.monthstatic)
        {
            str += this.monthstatic.createCommand();
        }
        if (this.yearspin)
        {
            str += this.yearspin.createCommand();
        }
        if (this.monthspin)
        {
            str += this.monthspin.createCommand();
        }

        return str;
    };

    _pDatePickerHeadControl.on_attach_contents_handle = function (win)
    {
        var prevbutton = this.prevbutton;
        var nextbutton = this.nextbutton;
        var yearstatic = this.yearstatic;
        var monthstatic = this.monthstatic;
        var yearspin = this.yearspin;
        var monthspin = this.monthspin;

        if (nexacro._isTouchInteraction && nexacro._SupportTouch)
        {
            yearstatic._setEventHandler("onclick", this._on_static_mobile_onclick, this);
            monthstatic._setEventHandler("onclick", this._on_static_mobile_onclick, this);
        }

        yearstatic._setEventHandler("onlbuttondown", this._on_static_onlbuttondown, this);
        monthstatic._setEventHandler("onlbuttondown", this._on_static_onlbuttondown, this);
        prevbutton._setEventHandler("onclick", this._on_button_onprevclick, this);
        nextbutton._setEventHandler("onclick", this._on_button_onnextclick, this);
        yearspin._setEventHandler("onspin", this._on_spin_onspin, this);
        monthspin._setEventHandler("onspin", this._on_spin_onspin, this);
        yearspin._setEventHandler("onkeydown", this._on_spin_onkeydown, this);
        monthspin._setEventHandler("onkeydown", this._on_spin_onkeydown, this);

        prevbutton.attachHandle(win);
        nextbutton.attachHandle(win);
        yearstatic.attachHandle(win);
        monthstatic.attachHandle(win);
        yearspin.attachHandle(win);
        monthspin.attachHandle(win);

        yearspin.set_value(this._date.str_year);
        monthspin.set_value(this._date.str_month);

        if (this._p_parent._is_popupcontains)
        {
            yearspin._setEnableView(false);
            monthspin._setEnableView(false);
        }
    };

    _pDatePickerHeadControl.on_destroy_contents = function ()
    {
        this._date = null;

        if (this.prevbutton)
        {
            this.prevbutton.destroy();
            this.prevbutton = null;
        }
        if (this.nextbutton)
        {
            this.nextbutton.destroy();
            this.nextbutton = null;
        }
        if (this.yearstatic)
        {
            this.yearstatic.destroy();
            this.yearstatic = null;
        }
        if (this.monthstatic)
        {
            this.monthstatic.destroy();
            this.monthstatic = null;
        }
        if (this.yearspin)
        {
            this.yearspin.destroy();
            this.yearspin = null;
        }
        if (this.monthspin)
        {
            this.monthspin.destroy();
            this.monthspin = null;
        }
    };

    _pDatePickerHeadControl.on_change_containerRect = function (widht, height)
    {
        this._recalcLayout();
    };

    //===============================================================
    // nexacro._DatePickerHeadControl : Override
    //===============================================================
    _pDatePickerHeadControl.on_apply_prop_enable = function (v)
    {
        if (this.prevbutton)
        {
            this.prevbutton._setEnable(v);
        }
        if (this.nextbutton)
        {
            this.nextbutton._setEnable(v);
        }
        if (this.yearstatic)
        {
            this.yearstatic._setEnable(v);
        }
        if (this.monthstatic)
        {
            this.monthstatic._setEnable(v);
        }
        if (this.yearspin)
        {
            this.yearspin._setEnable(v);
        }
        if (this.monthspin)
        {
            this.monthspin._setEnable(v);
        }
    };

    //===============================================================
    // nexacro._DatePickerHeadControl : Properties
    //===============================================================
    _pDatePickerHeadControl.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_readonly != v)
        {
            this._p_readonly = v;
            this.on_apply_readonly(v);
        }
    };

    _pDatePickerHeadControl.on_apply_readonly = function (readonly)
    {
        this._changeStatus("readonly", readonly);

        var control_elem = this.getElement();
        if (control_elem)
        {
            var yearspin = this.yearspin;
            if (yearspin)
            {
                yearspin.set_readonly(readonly);
            }
            var monthspin = this.monthspin;
            if (monthspin)
            {
                monthspin.set_readonly(readonly);
            }
        }
    };

    //===============================================================
    // nexacro._DatePickerHeadControl : Events
    //===============================================================
    _pDatePickerHeadControl._on_static_mobile_before_onclick = function ()
    {
        return true;
    };

    _pDatePickerHeadControl._on_static_mobile_onclick = function (obj, e)
    {
        if (!this._on_static_mobile_before_onclick())
            return false;

        var calendar = this._p_parent._p_parent;
        if (calendar && calendar._onlydisplay == true)
        {
            calendar.on_fire_onclick(e.button, e.alt_key, e.ctrl_key, e.shift_key, e.screenX, e.screenY, e.canvasX, e.canvasY, e.clientX, e.clientY, calendar, obj, e.meta_key);
            return false;
        }
        var yearstatic = this.yearstatic;
        var monthstatic = this.monthstatic;
        var yearspin = this.yearspin;
        var monthspin = this.monthspin;

        var body = this._p_parent.body;
        var cur_year = parseInt(this._date.str_year);
        var min_year = parseInt(cur_year / 10) * 10 - 1;
        var max_year = min_year + 11;
        var yearstr = min_year + " - " + max_year;

        var comp_name = obj.name;
        if (comp_name == "yearstatic")
        {
            if (this._p_parent._changetype == "button")
            {
                monthstatic.set_visible(false);
                yearstatic.set_text(yearstr);

                this._recalcYearStatic();

                body._months_visible(false);
                body._days_visible(false);
                body._years_visible(true, min_year);
            }
            else
            {
                yearstatic.set_visible(false);
                yearspin.set_visible(true);
            }
        }
        else if (comp_name == "monthstatic")
        {
            if (this._p_parent._changetype == "button")
            {
                yearstatic.set_text(cur_year);
                this._recalcYearStatic();
                monthstatic.set_visible(false);

                body._years_visible(false);
                body._days_visible(false);
                body._months_visible(true);
            }
            else
            {
                monthstatic.set_visible(false);
                monthspin.set_visible(true);
            }
        }
    };

    _pDatePickerHeadControl._on_static_before_onlbuttondown = function ()
    {
        return true;
    };

    _pDatePickerHeadControl._on_static_onlbuttondown = function (obj, e)
    {
        if (this._p_readonly)
            return;

        if (!this._on_static_before_onlbuttondown())
            return false;

        var calendar = this._p_parent._p_parent;
        if (calendar && calendar._onlydisplay == true)
            return false;

        var yearstatic = this.yearstatic;
        var monthstatic = this.monthstatic;
        var yearspin = this.yearspin;
        var monthspin = this.monthspin;

        var body = this._p_parent.body;
        var cur_year = parseInt(this._date.str_year);

        var min_year = parseInt(cur_year / 10) * 10 - 1;
        var max_year = min_year + 11;
        var yearstr = min_year + " - " + max_year;

        var comp_name = obj.name;
        if (comp_name == "yearstatic")
        {
            if (this._p_parent._changetype == "button")
            {
                //body.weekband.set_visible(false);
                for (var i = 0; i < body._maxWeek; i++)
                {
                    body._weekitems[i].set_visible(false);
                }
                monthstatic.set_visible(false);
                yearstatic.set_text(yearstr);

                this._recalcYearStatic();

                body._months_visible(false);
                body._days_visible(false);
                body._years_visible(true, min_year);
            }
            else
            {
                yearstatic.set_visible(false);
                yearspin.set_visible(true);
            }
        }
        else if (comp_name == "monthstatic")
        {
            if (this._p_parent._changetype == "button")
            {
                //body.weekband.set_visible(false);
                for (var i = 0; i < body._maxWeek; i++)
                {
                    body._weekitems[i].set_visible(false);
                }
                yearstatic.set_text(cur_year);
                this._recalcYearStatic();
                monthstatic.set_visible(false);

                body._years_visible(false);
                body._days_visible(false);
                body._months_visible(true);
            }
            else
            {
                monthstatic.set_visible(false);
                monthspin.set_visible(true);
            }
        }
    };

    _pDatePickerHeadControl._on_button_onprevclick = function (obj, e)
    {
        var calendar = this._p_parent._p_parent;
        if (calendar && calendar._onlydisplay == true)
        {
            calendar.on_fire_onclick(e.button, e.alt_key, e.ctrl_key, e.shift_key, e.screenX, e.screenY, e.canvasX, e.canvasY, e.clientX, e.clientY, calendar, obj, e.meta_key);
        }

        if (!this._p_enable || this._p_readonly)
        {
            return false;
        }

        var body = this._p_parent.body;
        var cur_year = parseInt(this._date.str_year) - 11;
        var min_year = parseInt(this.yearstatic.text.split(" - ")[0]) - 10;
        var max_year = min_year + 11;
        var yearstr = min_year + " - " + max_year;

        if (!this.monthstatic._p_visible && this._p_parent._changetype == "button")
        {
            if (this.yearstatic.text.length > 6)
            {

                this.yearstatic.set_text(yearstr);
                body._years_visible(true, min_year);
                this._recalcYearStatic();

                this._date.str_year = String(cur_year);

            }
            else
            {
                this._date.str_year = String(parseInt(this._date.str_year) - 1);
                this.yearstatic.set_text(this._date.str_year);
            }
            return;
        }

        var year = parseInt(this._date.str_year);
        var month = parseInt(this._date.str_month);
        if ((month -= 1) <= 0)
        {
            month = 12;
            if ((year -= 1) < 0)
            {
                year = 9999;
            }
        }

        if (this._p_parent._changetype == "button")
        {
            var head = this;
            var body = this._p_parent.body;
            this._date.str_month = String(month);
            this._date.str_year = String(year);

            body._setDate(head._date.str_year, head._date.str_month, body._date.str_day);
        }

        this._setDate(year, month);
        this._refreshSpindate();

        this.on_fire_onclick(e.button, e.alt_key, e.ctrl_key, e.shift_key, e.screenX, e.screenY, e.canvasX, e.canvasY, e.clientX, e.clientY, this, obj, e.meta_key);
    };

    _pDatePickerHeadControl._on_button_onnextclick = function (obj, e)
    {
        var calendar = this._p_parent._p_parent;
        if (calendar && calendar._onlydisplay == true)
        {
            calendar.on_fire_onclick(e.button, e.alt_key, e.ctrl_key, e.shift_key, e.screenX, e.screenY, e.canvasX, e.canvasY, e.clientX, e.clientY, calendar, obj, e.meta_key);
            return false;
        }

        if (!this._p_enable || this._p_readonly)
        {
            return false;
        }
        var body = this._p_parent.body;
        var cur_year = parseInt(this._date.str_year) + 11;

        var min_year = parseInt(this.yearstatic.text.split(" - ")[0]) + 10;
        var max_year = min_year + 11;
        var yearstr = min_year + " - " + max_year;

        if (!this.monthstatic._p_visible && this._p_parent._changetype == "button")
        {
            if (this.yearstatic.text.length > 6)
            {

                this.yearstatic.set_text(yearstr);
                body._years_visible(true, min_year);
                this._recalcYearStatic();

                this._date.str_year = String(cur_year);

            }
            else
            {
                this._date.str_year = String(parseInt(this._date.str_year) + 1);
                this.yearstatic.set_text(this._date.str_year);
            }
            return;
        }
        var year = parseInt(this._date.str_year);
        var month = parseInt(this._date.str_month);
        if ((month += 1) > 12)
        {
            month = 1;
            if ((year += 1) > 9999)
            {
                year = 0;
            }
        }
        if (this._p_parent._changetype == "button")
        {
            var head = this;
            var body = this._p_parent.body;
            this._date.str_month = String(month);
            this._date.str_year = String(year);

            body._setDate(head._date.str_year, head._date.str_month, body._date.str_day);
        }

        this._setDate(year, month);
        this._refreshSpindate();

        this.on_fire_onclick(e.button, e.alt_key, e.ctrl_key, e.shift_key, e.screenX, e.screenY, e.canvasX, e.canvasY, e.clientX, e.clientY, this, obj, e.meta_key);
    };

    _pDatePickerHeadControl._on_spin_onspin = function (obj, e)
    {
        var v = nexacro._toString(e.postvalue);

        var year = this._date.str_year;
        var month = this._date.str_month;

        var control_name = obj.name;
        if (control_name == "yearspin")
        {
            year = v;
        }
        else if (control_name == "monthspin")
        {
            month = v;
        }

        this._setDate(year, month);
        this.on_fire_onspin(obj, e);
    };

    _pDatePickerHeadControl._on_spin_onkeydown = function (obj, e)
    {
        if (e.keycode == nexacro.Event.KEY_ENTER)
        {
            var year = this._date.str_year;
            var month = this._date.str_month;

            var control_name = obj.name;
            if (control_name == "yearspin")
            {
                year = obj.text;
            }
            else if (control_name == "monthspin")
            {
                month = obj.text;
            }

            this._setDate(year, month);
            this.on_fire_onspin(obj, e);
        }
    };

    _pDatePickerHeadControl.on_fire_onspin = function (obj, preText, preValue, postText, postValue, isUp)
    {
        if (this.onspin && this.onspin._has_handlers)
        {
            var evt = new nexacro.SpinEventInfo(obj, "onspin", preText, preValue, postText, postValue, isUp);
            return this.onspin._fireEvent(this, evt);
        }
        return true;
    };

    //===============================================================
    // nexacro._DatePickerHeadControl : Logical Part
    //===============================================================
    _pDatePickerHeadControl._refreshSpindate = function ()
    {
        if (this._p_parent._changetype == "button")
            return;
        var yearstatic = this.yearstatic;
        var monthstatic = this.monthstatic;
        var yearspin = this.yearspin;
        var monthspin = this.monthspin;
        if (yearstatic || monthstatic)
        {
            var bShowyear = this._getShowyearspin();
            var bShowmonth = this._getShowmonthspin();
            if (bShowyear)
            {
                if (bShowmonth)
                {
                    yearstatic.set_visible(false);
                    monthstatic.set_visible(false);
                    yearspin.set_visible(true);
                    monthspin.set_visible(true);
                }
                else
                {
                    yearstatic.set_visible(false);
                    monthstatic.set_visible(true);
                    yearspin.set_visible(true);
                    monthspin.set_visible(false);
                }
            }
            else
            {
                if (bShowmonth)
                {
                    yearstatic.set_visible(true);
                    monthstatic.set_visible(false);
                    yearspin.set_visible(false);
                    monthspin.set_visible(true);
                }
                else
                {
                    yearstatic.set_visible(true);
                    monthstatic.set_visible(true);
                    yearspin.set_visible(false);
                    monthspin.set_visible(false);
                }
            }
        }
    };

    _pDatePickerHeadControl._recalcLayout = function ()
    {
        if (this._is_created_contents)
        {
            var headformat = this._getHeadformat();

            var client_w = this._getClientWidth();
            var client_h = this._getClientHeight();

            var year_size = 0, year_l = 0, year_w = 0;
            var month_size = 0, month_l = 0, month_w = 0;

            // Move Button
            var prevbutton = this.prevbutton;
            if (prevbutton)
            {
                prevbutton.move(0, 0, client_h, client_h, null, null);
            }

            var nextbutton = this.nextbutton;
            if (nextbutton)
            {
                nextbutton.move(client_w - client_h, 0, client_h, client_h, null, null);
            }

            // Calc Static
            var yearstatic = this.yearstatic;
            if (yearstatic)
            {
                year_size = yearstatic._on_getFitSize();
                year_w = year_size[0];
            }

            var monthstatic = this.monthstatic;
            if (monthstatic)
            {
                month_size = monthstatic._on_getFitSize();
                month_w = month_size[0];
            }

            var offset_x = ((client_w / 2) - ((year_w + month_w) / 2));

            if (headformat == "MM.yyyy")
            {
                month_l = offset_x;
                year_l = offset_x + month_w;
            }
            else
            {
                year_l = offset_x;
                month_l = offset_x + year_w;
            }

            // Move Static
            if (yearstatic)
            {
                yearstatic.move(year_l, 0, year_w, client_h, null, null);
            }

            if (monthstatic)
            {
                monthstatic.move(month_l, 0, month_w, client_h, null, null);
            }

            // Calc Spin
            var yearspin = this.yearspin;
            if (yearspin)
            {
                year_size = this._getSpinControlSize("year");
                year_w = year_size + client_h;
            }

            var monthspin = this.monthspin;
            if (monthspin)
            {
                month_size = this._getSpinControlSize("month");
                month_w = month_size + client_h;
            }

            offset_x = ((client_w / 2) - ((year_w + month_w) / 2));

            if (headformat == "MM.yyyy")
            {
                month_l = offset_x;
                year_l = offset_x + month_w;
            }
            else
            {
                year_l = offset_x;
                month_l = offset_x + year_w;
            }

            // Move Spin
            if (yearspin)
            {
                yearspin.move(year_l, 0, year_w, client_h, null, null);
            }

            if (monthspin)
            {
                monthspin.move(month_l, 0, month_w, client_h, null, null);
            }
        }
    };

    _pDatePickerHeadControl._recalcYearStatic = function (month)
    {
        var headformat = this._getHeadformat();

        var client_w = this._getClientWidth();
        var client_h = this._getClientHeight();

        var year_size = 0, year_l = 0, year_w = 0;
        var month_size = 0, month_l = 0, month_w = 0;

        // Calc Static
        var yearstatic = this.yearstatic;
        if (yearstatic)
        {
            year_size = yearstatic._on_getFitSize();
            year_w = year_size[0];
        }

        var monthstatic = this.monthstatic;
        if (monthstatic)
        {
            month_size = monthstatic._on_getFitSize();
            month_w = month_size[0];
        }
        if (month)
        {
            var offset_x = ((client_w / 2) - ((year_w + month_w) / 2));
        }
        else
        {
            var offset_x = ((client_w / 2) - ((year_w) / 2));
        }

        if (headformat == "MM.yyyy")
        {
            month_l = offset_x;
            year_l = offset_x + month_w;
        }
        else
        {
            year_l = offset_x;
            month_l = offset_x + year_w;
        }

        // Move Static
        if (yearstatic)
        {
            yearstatic.move(year_l, 0, year_w, client_h, null, null);
        }
    }

    _pDatePickerHeadControl._on_beforerepeat = function (refer_comp)
    {
        if (refer_comp == this.prevbutton || refer_comp == this.nextbutton || refer_comp instanceof nexacro._SpinButtonControl)
            return [true, true];    // [bRepeat, bBubble]

        return [false, true];   // [bRepeat, bBubble]
    };

    //===============================================================
    // nexacro._DatePickerHeadControl : Util Function
    //===============================================================
    _pDatePickerHeadControl._setDate = function (year, month)
    {
        var date = this._date;
        if (date)
        {
            date.str_year = nexacro._toString(year).padLeft(4, "0");
            date.str_month = nexacro._toString(month).padLeft(2, "0");
            date.int_year = +year;
            date.int_month = +month;
        }

        var yearstatic = this.yearstatic;
        var yearspin = this.yearspin;
        var monthstatic = this.monthstatic;
        var monthspin = this.monthspin;

        if (this._getHeadformat() == "MM.yyyy")
        {
            yearstatic.set_text(date.str_year);
            monthstatic.set_text(date.str_month + ".");
        }
        else
        {
            yearstatic.set_text(date.str_year + ".");
            monthstatic.set_text(date.str_month);
        }

        yearspin.set_value(date.str_year);
        monthspin.set_value(date.str_month);
    };

    _pDatePickerHeadControl._getHeadheight = function ()
    {
        var datepicker = this._p_parent;
        if (datepicker)
        {
            return datepicker._getHeadheight();
        }

        return null;
    };

    _pDatePickerHeadControl._getHeadformat = function ()
    {
        var datepicker = this._p_parent;
        if (datepicker)
        {
            return datepicker._getHeadformat();
        }

        return null;
    };

    _pDatePickerHeadControl._getShowyearspin = function ()
    {
        var calendar = this._p_parent;
        if (calendar)
        {
            return calendar._getShowyearspin();
        }

        return null;
    };

    _pDatePickerHeadControl._getShowmonthspin = function ()
    {
        var datepicker = this._p_parent;
        if (datepicker)
        {
            return datepicker._getShowmonthspin();
        }

        return null;
    };

    _pDatePickerHeadControl._getSpinControlSize = function (type)
    {
        //spinbutton이 포함 안된 사이즈. height는 고려 안함(포지션지정 오토사이즈 계산용)
        var control;
        switch (type)
        {
            case "year":
                control = this.yearspin;
                break;
            case "month":
                control = this.monthspin;
                break;
        }

        var total_w = 0;
        if (control)
        {
            var border = control._getCurrentStyleBorder();
            if (border)
            {
                total_w += border._getBorderWidth();
            }

            var padding = control._getCurrentStylePadding();
            if (padding)
            {
                total_w += padding.left + padding.right;
            }

            var spinedit = control._p_spinedit;
            if (spinedit)
            {
                var tmp = spinedit.text;
                if (tmp.length == 1 && type == "month")
                {
                    spinedit._p_text += ".0";
                }
                else if (tmp.length < 4 && type == "year")
                {
                    /* value와 관계없이 yearspin은 yyyy 포맷으로 출력되기 때문에 4자리수 크기로 고정 */
                    spinedit._p_text = "0000.";
                }
                else
                {
                    spinedit._p_text += ".";
                }
                total_w += spinedit._on_getFitSize()[0];
                spinedit._p_text = tmp;
            }
        }

        return total_w;
    };

    //==============================================================================
    // nexacro._DatePickerBodyControl 
    //==============================================================================
    nexacro._DatePickerBodyControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._weekitems = [];
        this._dayitems = [];
        this._monthitems = [];
        this._yearitems = [];
        this._changedDays = [];

        this._date = {
            str_year: "", str_month: "", str_day: "",
            int_year: 0, int_month: 0, int_day: 0
        };
    };

    var _pDatePickerBodyControl = nexacro._createPrototype(nexacro.Component, nexacro._DatePickerBodyControl);
    nexacro._DatePickerBodyControl.prototype = _pDatePickerBodyControl;
    _pDatePickerBodyControl._type_name = "DatePickerBodyControl";

    /* control */
    _pDatePickerBodyControl.weekband = null;

    /* internal variable */
    _pDatePickerBodyControl._preday = "";
    _pDatePickerBodyControl._maxWeek = 7;
    _pDatePickerBodyControl._maxDay = 42;
    _pDatePickerBodyControl._maxMonth = 12;
    _pDatePickerBodyControl._maxYear = 12;

    /* status */
    _pDatePickerBodyControl._is_subcontrol = true;
    _pDatePickerBodyControl._use_readonly_status = true;
    _pDatePickerBodyControl._is_locale_control = true;

    /* event list */
    _pDatePickerBodyControl._event_list = {
        "onclick": 1, "ondayclick": 1, "onkeydown": 1, "onmonthclick": 1, "onyearclick": 1,
    };

    //===============================================================
    // nexacro._DatePickerBodyControl : Create & Destroy & Update
    //===============================================================
    _pDatePickerBodyControl.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var weekband = this.weekband = new nexacro.Static("weekband", 0, 0, 0, 0, null, null, null, null, null, null, this);
            weekband._setControl();
            weekband.createComponent(true);

            var weekformat = this._getWeekformat();
            var monthformat = this._getMonthformat();
            var yearformat = this._getYearformat();
            var weeks = this._weekitems;
            var days = this._dayitems;
            var months = this._monthitems;
            var years = this._yearitems;

            var maxWeek = this._maxWeek;
            var maxDay = this._maxDay;
            var maxMonth = this._maxMonth;
            var maxYear = this._maxYear;

            var weekstatic, daystatic, monthstat, yearstat;

            this._p_parent.on_apply_datepickerchangetype(this._p_parent._p_parent._p_datepickerchangetype);

            // day
            for (var i = 0; i < maxWeek; i++)
            {
                weekstatic = weeks[i] = new nexacro._DatePickerWeekItemControl("weekitem" + i, 0, 0, 0, 0, null, null, null, null, null, null, this);
                weekstatic.set_text(weekformat[i]);
                weekstatic._setDaysOfWeek(i % 7);

                weekstatic.createComponent(true);
            }

            for (i = 0; i < maxDay; i++)
            {
                daystatic = days[i] = new nexacro._DatePickerDayItemControl("dayitem" + i, 0, 0, 0, 0, null, null, null, null, null, null, this);
                daystatic._setDaysOfWeek(i % 7);

                daystatic.createComponent(true);
            }

            if (this._p_parent._changetype == "button")
            {
                // month
                for (i = 0; i < maxMonth; i++)
                {
                    monthstat = months[i] = new nexacro._DatePickerMonthItemControl("monthitem" + i, 0, 0, 0, 0, null, null, null, null, null, null, this);
                    monthstat.set_text(i + 1);
                    monthstat.set_textAlign("center");
                    monthstat.set_visible(false);
                    monthstat.createComponent(true);
                }
                // year
                for (i = 0; i < maxYear; i++)
                {
                    yearstat = years[i] = new nexacro._DatePickerYearItemControl("yearitem" + i, 0, 0, 0, 0, null, null, null, null, null, null, this);
                    yearstat.set_text(yearformat[i]);
                    yearstat.set_textAlign("center");
                    yearstat.set_visible(false);
                    yearstat.createComponent(true);
                }
            }
        }
    };

    _pDatePickerBodyControl.on_created_contents = function (win)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var weeks = this._weekitems;
            var days = this._dayitems;
            var months = this._monthitems;
            var years = this._yearitems;
            var maxWeek = this._maxWeek;
            var maxDay = this._maxDay;
            var maxMonth = this._maxMonth;
            var maxYear = this._maxYear;

            this.weekband.on_created(win);

            for (var i = 0; i < maxWeek; i++)
            {
                weeks[i].on_created(win);
            }
            for (i = 0; i < maxDay; i++)
            {
                days[i]._setEventHandler("onclick", this._on_dayitem_ondayclick, this);
                days[i].on_created(win);
            }

            if (this._p_parent._changetype == "button")
            {
                // month
                for (i = 0; i < maxMonth; i++)
                {
                    months[i]._setEventHandler("onclick", this._on_monthitem_onmonthclick, this);
                    months[i].on_created(win);
                }
                // year
                for (i = 0; i < maxYear; i++)
                {
                    years[i]._setEventHandler("onclick", this._on_yearitem_onyearclick, this);
                    years[i].on_created(win);
                }
            }
        }
    };

    _pDatePickerBodyControl.on_create_contents_command = function ()
    {
        var weekband = this.weekband;
        var weeks = this._weekitems;
        var days = this._dayitems;
        var months = this._monthitems;
        var years = this._yearitems;
        var maxWeek = this._maxWeek;
        var maxDay = this._maxDay;
        var maxMonth = this._maxMonth;
        var maxYear = this._maxYear;

        var str = "";
        str += weekband.createCommand();
        for (var i = 0; i < maxWeek; i++)
        {
            str += weeks[i].createCommand();
        }

        for (i = 0; i < maxDay; i++)
        {
            str += days[i].createCommand();
        }

        if (this._p_parent._changetype == "button")
        {
            for (i = 0; i < maxMonth; i++)
            {
                str += months[i].createCommand();
            }

            for (i = 0; i < maxYear; i++)
            {
                str += years[i].createCommand();
            }
        }

        return str;
    };

    _pDatePickerBodyControl.on_attach_contents_handle = function (win)
    {
        var weekband = this.weekband;
        var weeks = this._weekitems;
        var days = this._dayitems;
        var months = this._monthitems;
        var years = this._yearitems;
        var maxWeek = this._maxWeek;
        var maxDay = this._maxDay;
        var maxMonth = this._maxMonth;
        var maxYear = this._maxYear;

        weekband.attachHandle(win);

        for (var i = 0; i < maxWeek; i++)
        {
            weeks[i].attachHandle(win);
        }
        for (i = 0; i < maxDay; i++)
        {
            days[i]._setEventHandler("onclick", this._on_dayitem_ondayclick, this);
            days[i].attachHandle(win);
        }

        if (this._p_parent._changetype == "button")
        {
            for (i = 0; i < maxMonth; i++)
            {
                months[i]._setEventHandler("onclick", this._on_monthitem_onmonthclick, this);
                months[i].attachHandle(win);
            }

            for (i = 0; i < maxYear; i++)
            {
                years[i]._setEventHandler("onclick", this._on_yearitem_onyearclick, this);
                years[i].attachHandle(win);
            }
        }
    };

    _pDatePickerBodyControl.on_destroy_contents = function ()
    {
        if (this.weekband)
        {
            this.weekband.destroy();
            this.weekband = null;
        }

        var weeks = this._weekitems;
        var days = this._dayitems;
        var months = this._monthitems;
        var years = this._yearitems;
        var maxWeek = this._maxWeek;
        var maxDay = this._maxDay;
        var maxMonth = this._maxMonth;
        var maxYear = this._maxYear;

        for (var i = 0; i < maxWeek; i++)
        {
            weeks[i].destroy();
        }

        for (i = 0; i < maxDay; i++)
        {
            days[i].destroy();
        }

        if (this._p_parent._changetype == "button")
        {
            for (var i = 0; i < maxMonth; i++)
            {
                months[i].destroy();
            }

            for (i = 0; i < maxYear; i++)
            {
                years[i].destroy();
            }
            this._monthitems = null;
            this._yearitems = null;
        }

        this._weekitems = null;
        this._dayitems = null;
        this._changedDays = null;
        this._date = null;
    };

    _pDatePickerBodyControl.on_change_containerRect = function (width, height)
    {
        this._recalcLayout();
    };

    //===============================================================
    // nexacro._DatePickerBodyControl : Override
    //===============================================================
    _pDatePickerBodyControl.on_apply_prop_enable = function (enable)
    {
        var i;
        var weeks = this._weekitems;
        var days = this._dayitems;
        var months = this._monthitems;
        var years = this._yearitems;
        var maxWeek = this._maxWeek;
        var maxDay = this._maxDay;
        var maxMonth = this._maxMonth;
        var maxYear = this._maxYear;

        if (this.weekband)
        {
            this.weekband._setEnable(enable);
        }

        for (i = 0; i < maxWeek; i++)
        {
            weeks[i]._setEnable(enable);
        }

        for (i = 0; i < maxDay; i++)
        {
            days[i]._setEnable(enable);
        }
        if (this._p_parent._changetype == "button")
        {
            for (i = 0; i < maxMonth; i++)
            {
                months[i]._setEnable(enable);
            }

            for (i = 0; i < maxYear; i++)
            {
                years[i]._setEnable(enable);
            }
        }
    };

    //===============================================================
    // nexacro._DatePickerBodyControl : Properties
    //===============================================================
    _pDatePickerBodyControl.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_readonly != v)
        {
            this._p_readonly = v;
            this.on_apply_readonly(v);
        }
    };

    _pDatePickerBodyControl.on_apply_readonly = function (readonly)
    {
        this._changeStatus("readonly", readonly);

        var weeks = this._weekitems;
        var days = this._dayitems;
        var months = this._monthitems;
        var years = this._yearitems;
        var maxWeek = this._maxWeek;
        var maxDay = this._maxDay;
        var maxMonth = this._maxMonth;
        var maxYear = this._maxYear;

        for (var i = 0; i < maxWeek; i++)
        {
            weeks[i].set_readonly(readonly);
        }

        for (i = 0; i < maxDay; i++)
        {
            days[i].set_readonly(readonly);
        }
        if (this._p_parent._changetype == "button")
        {
            for (var i = 0; i < maxMonth; i++)
            {
                months[i].set_readonly(readonly);
            }

            for (i = 0; i < maxYear; i++)
            {
                years[i].set_readonly(readonly);
            }
        }
    };

    //===============================================================
    // nexacro._DatePickerBodyControl : Events
    //===============================================================
    _pDatePickerBodyControl._on_dayitem_ondayclick = function (obj, e)
    {
        var calendar = this._p_parent._p_parent;
        if (calendar && calendar._onlydisplay == true)
        {
            calendar.on_fire_onclick(e.button, e.alt_key, e.ctrl_key, e.shift_key, e.screenX, e.screenY, e.canvasX, e.canvasY, e.clientX, e.clientY, calendar, obj, e.meta_key);
            return false;
        }

        this.on_fire_ondayclick(obj, e);
    };

    _pDatePickerBodyControl.on_fire_ondayclick = function (obj, e)
    {
        if (this.ondayclick && this.ondayclick._has_handlers)
        {
            return this.ondayclick._fireEvent(this, e);
        }
        return false;
    };

    _pDatePickerBodyControl._on_monthitem_onmonthclick = function (obj, e)
    {
        var head = this._p_parent.head;

        this._months_visible(false);
        this._days_visible(true);

        this.on_fire_onmonthclick(obj, e);
        this._setDate(head._date.str_year, head._date.str_month, this._date.str_day);
    };

    _pDatePickerBodyControl.on_fire_onmonthclick = function (obj, e)
    {
        if (this.onmonthclick && this.onmonthclick._has_handlers)
        {
            return this.onmonthclick._fireEvent(this, e);
        }
        return false;
    };

    _pDatePickerBodyControl._on_yearitem_onyearclick = function (obj, e)
    {
        /*
        // trailingyear 스펙에 대한 검토 없이 개선된 내용으로 롤백 RP 100743
        var year_range = this._p_parent.head.yearstatic.text.split(" - ");

        var min_year = parseInt(year_range[0]);
        var max_year = parseInt(year_range[1]);

        if (parseInt(obj.text) == min_year)
        {
            min_year -= 10;
            max_year = min_year + 11;

            this._years_visible(true, min_year);

            var yearstr = min_year + " - " + max_year;
            this._p_parent.head.yearstatic.set_text(yearstr);
        }
        else if (parseInt(obj.text) == max_year)
        {
            min_year += 10;
            max_year = min_year + 11;

            this._years_visible(true, min_year);

            var yearstr = min_year + " - " + max_year;
            this._p_parent.head.yearstatic.set_text(yearstr);
        }
        else
        {
        */

        this._years_visible(false);
        this._months_visible(true);
        this.on_fire_onyearclick(obj, e);

        // trailingyear 스펙에 대한 검토 없이 개선된 내용으로 롤백 RP 100743
        //}


    };

    _pDatePickerBodyControl.on_fire_onyearclick = function (obj, e)
    {
        if (this.onyearclick && this.onyearclick._has_handlers)
        {
            return this.onyearclick._fireEvent(this, e);
        }
        return false;
    };

    //===============================================================
    // nexacro._DatePickerBodyControl : Logical Part
    //===============================================================

    _pDatePickerBodyControl._days_visible = function (v)
    {
        var days = this._dayitems;
        var maxDay = this._maxDay;
        for (var i = 0; i < maxDay; i++)
        {
            if (days[i])
                days[i].set_visible(v);
        }
        this.weekband.set_visible(v);
    };

    _pDatePickerBodyControl._months_visible = function (v)
    {
        var months = this._monthitems;
        var maxMonth = this._maxMonth;
        for (var i = 0; i < maxMonth; i++)
        {
            if (months[i])
            {
                months[i].set_visible(v);
                if (i + 1 == parseInt(this._p_parent.head._date.int_month))
                {
                    months[i]._changeUserStatus("selected", true);
                }
                else
                {
                    months[i]._changeUserStatus("selected", false);
                }
            }
        }
    };

    _pDatePickerBodyControl._years_visible = function (v, min_year)
    {
        var years = this._yearitems;
        var maxYear = this._maxYear;
        if (min_year)
        {
            for (var i = 0; i < maxYear; i++)
            {
                if (years[i])
                {
                    years[i].set_text(min_year + i);
                    years[i].set_visible(v);
                    if (min_year + i == parseInt(this._p_parent.head._date.int_year))
                    {
                        years[i]._changeUserStatus("selected", true);
                    }
                    else
                    {
                        years[i]._changeUserStatus("selected", false);
                    }
                    /*
                    // trailingyear 스펙에 대한 검토 없이 개선된 내용으로 롤백 RP 100743
                    if (parseInt(years[i].text) == min_year || parseInt(years[i].text) == min_year + 11)
                    {
                        years[i]._changeUserStatus("trailingyear", true);
                    }
                    */
                }
            }
        }
        else
        {
            for (var i = 0; i < maxYear; i++)
            {
                if (years[i])
                {
                    years[i].set_visible(v);
                }
            }
        }
    };

    _pDatePickerBodyControl._recalcLayout = function ()
    {
        if (this._is_created_contents)
        {
            var weeks = this._weekitems;
            var days = this._dayitems;
            var maxWeek = this._maxWeek;
            var maxDay = this._maxDay;

            var client_w = this._getClientWidth();
            var client_h = this._getClientHeight();
            var client_l = this._getClientLeft();
            var client_t = this._getClientTop();

            var daysize = this._getDaysize();

            var item_w = daysize.width;
            var item_h = daysize.height;

            var drawWidth_daysize = item_w * 7;
            var drawHeight_daysize = item_h * 7;

            var blankWidth = 0;
            var blankHeight = 0;
            if (drawWidth_daysize < client_w)
            {
                blankWidth = (client_w - drawWidth_daysize) / 14;
            }
            if (drawHeight_daysize < client_h)
            {
                blankHeight = (client_h - drawHeight_daysize) / 8;
            }

            var week_l = client_l + blankWidth;
            var week_t = client_t + (blankHeight / 2);

            this.weekband.move(client_l, week_t, client_w, item_h, null, null);
            var i;
            for (i = 0; i < maxWeek; i++)
            {
                weeks[i].move(week_l, week_t, item_w, item_h, null, null);
                week_l = week_l + item_w + (blankWidth * 2);
            }

            var day_l = client_l + blankWidth;
            var day_t = week_t + item_h + blankHeight;
            for (i = 0; i < maxDay; i++)
            {
                days[i].move(day_l, day_t, item_w, item_h, null, null);
                day_l = day_l + item_w + (blankWidth * 2);
                if (((i + 1) % 7) == 0)
                {
                    day_l = client_l + blankWidth;
                    day_t = day_t + item_h + blankHeight;
                }
            }
            if (this._p_parent._changetype == "button")
            {
                var months = this._monthitems;
                var years = this._yearitems

                var maxMonth = this._maxMonth;
                var maxYear = this._maxYear;

                var monthsize = this._getMonthsize();
                var yearsize = this._getYearsize();

                var month_w = monthsize.width;
                var month_h = monthsize.height;

                var year_w = yearsize.width;
                var year_h = yearsize.height;

                var month_l = client_l + blankWidth;
                var month_t = week_t + item_h + blankHeight;
                for (i = 0; i < maxMonth; i++)
                {
                    months[i].move(month_l, month_t, month_w, month_h, null, null);
                    month_l = month_l + month_w + (blankWidth * 2);
                    if (((i + 1) % 4) == 0)
                    {
                        month_l = client_l + blankWidth;
                        month_t = month_t + month_h + blankHeight;
                    }
                }

                var year_l = client_l + blankWidth;
                var year_t = week_t + item_h + blankHeight;
                for (i = 0; i < maxYear; i++)
                {
                    years[i].move(year_l, year_t, year_w, year_h, null, null);
                    year_l = year_l + year_w + (blankWidth * 2);
                    if (((i + 1) % 4) == 0)
                    {
                        year_l = client_l + blankWidth;
                        year_t = year_t + year_h + blankHeight;
                    }
                }
            }
        }
    };

    _pDatePickerBodyControl._refreshDay = function ()
    {
        var day, control_elem = this.getElement();
        if (control_elem)
        {
            var dayInfo = {};
            var trailingdayinfo = {};

            var date = this._date;
            var year = date.int_year;
            var month = date.int_month;
            day = date.int_day;

            var tempDate = new Date(year, month - 1, 1);

            if (year < 100) tempDate.setFullYear(year);

            var N = nexacro.Calendar.EndDayNormal;
            var L = nexacro.Calendar.EndDayLeap;

            var firstDay = tempDate.getDay();
            var endDay = this._getLeapYear(year) ? L[month - 1] : N[month - 1];

            var usetrailingday = this._getUsetrailingday();
            if (usetrailingday)
            {
                // args check
                trailingdayinfo = this._getUseTrailingDayInfo(year, month, tempDate, endDay);
            }

            var days = this._dayitems;
            var maxDay = this._maxDay;
            var dayCount = 1;
            var daysofweek = -1;

            for (var i = 0; i < maxDay; i++)
            {
                if (firstDay <= i && endDay >= dayCount)
                {
                    dayInfo = this._getDayInfo(dayCount, false, true, year, month);

                    this._setDayItemInfo(days[i], dayInfo.text, dayInfo.visible, dayInfo.year, dayInfo.month, dayInfo.trailingday);

                    daysofweek = i % 7;
                    if (daysofweek >= 0 && daysofweek <= 6)
                    {
                        days[i]._changeDayUserStatus(daysofweek, true);
                    }
                    else
                    {
                        if (this._isToday(dayInfo.day))
                            days[i]._changeUserStatus("today", true);
                        else
                            days[i]._changeUserStatus("day", true);
                    }

                    dayCount++;
                }
                else
                {
                    if (usetrailingday)
                    {
                        if (trailingdayinfo.idx >= 0)
                        {
                            dayInfo = this._getDayInfo(trailingdayinfo.pre_endDay - trailingdayinfo.idx, true, true, trailingdayinfo.prev_year, trailingdayinfo.prev_month);
                            trailingdayinfo.idx--;
                        }
                        else
                        {
                            dayInfo = this._getDayInfo(trailingdayinfo.next_beginDay, true, true, trailingdayinfo.next_year, trailingdayinfo.next_month);
                            trailingdayinfo.next_beginDay++;
                            trailingdayinfo.endWeek++;
                        }

                        this._setDayItemInfo(days[i], dayInfo.text, dayInfo.visible, dayInfo.year, dayInfo.month, dayInfo.trailingday);

                        days[i]._changeUserStatus("trailingday", true);
                    }
                    else
                    {
                        dayInfo = this._getDayInfo("", false, false, "", "");
                        this._setDayItemInfo(days[i], dayInfo.text, dayInfo.visible, dayInfo.year, dayInfo.month, dayInfo.trailingday);
                    }
                }
            }
        }

        this._initChangedDays();

        var dataset = this._getInnerDataset();
        if (dataset)
            this._setDatasetStyle(dataset);

        if (this._isSelectedDay(day))
            this._on_apply_day(true);
        else
            this._on_apply_day(false);

        this._setCalendarAccessibility();
    };

    _pDatePickerBodyControl._on_apply_day = function (flag)
    {
        //var days = this._dayitems;

        //var maxDay = this._maxDay;
        var preDay = this._preday;
        var currDay = this._date.str_day;
        var predayObj = this._getDayItem(preDay);
        var dayObj = this._getDayItem(currDay);

        this._preday = currDay;

        if (predayObj)
        {
            predayObj._changeUserStatus("selected", false);
            if (predayObj._daysofweek >= 0 && predayObj._daysofweek <= 6)
            {
                predayObj._changeDayUserStatus(predayObj._daysofweek, true);
            }
            else
            {
                predayObj._changeUserStatus("day", true);
            }
        }

        if (dayObj)
        {
            if (flag)
            {
                dayObj._changeUserStatus("selected", true);
            }
            else
            {
                dayObj._changeUserStatus("selected", false);
                if (dayObj._daysofweek >= 0 && dayObj._daysofweek <= 6)
                {
                    dayObj._changeDayUserStatus(dayObj._daysofweek, true);
                }
                else
                {
                    dayObj._changeUserStatus("day", true);
                }
            }
        }

        var currtDate = new Date();
        var today = currtDate.getDate();

        if (this._isToday(today))
        {
            today = nexacro._toString(today).padLeft(2, "0");
            var todayObj = this._getDayItem(today);

            if (flag)
            {
                if (todayObj != dayObj)
                {
                    todayObj._changeUserStatus("today", true);
                }
            }
            else
            {
                todayObj._changeUserStatus("today", true);
            }
        }
    };

    _pDatePickerBodyControl._initChangedDays = function ()
    {
        var len = this._changedDays.length;
        for (var i = (len - 1); i >= 0; i--)
        {
            this._changedDays[i].set_background(null);
            this._changedDays[i].set_color(null);
            this._changedDays[i].set_border(null);

            this._changedDays.pop();
        }
    };

    //===============================================================
    // nexacro._DatePickerBodyControl : Util Function
    //===============================================================
    _pDatePickerBodyControl._setDate = function (year, month, day)
    {
        var date = this._date;
        if (date.str_year != (year = year.padLeft(4, "0")))
        {
            date.str_year = year;
            date.int_year = +year;
        }
        if (date.str_month != (month = month.padLeft(2, "0")))
        {
            date.str_month = month;
            date.int_month = +month;
        }
        if (date.str_day != (day = day.padLeft(2, "0")))
        {
            this._preday = date.str_day;
            date.str_day = day;
            date.int_day = +day;
        }

        this._refreshDay();
    };

    _pDatePickerBodyControl._setDayItemInfo = function (day, text, visible, year, month, trailingday)
    {
        day.set_text(text);
        day.set_wordWrap("none");
        day.set_visible(visible);

        day._year = year;
        day._month = month;
        day._trailingday = trailingday;
    };

    _pDatePickerBodyControl._setWeekformatText = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var weekformat = this._getWeekformat();
            var weeks = this._weekitems;
            var weeks_len = weeks.length;

            for (var i = 0; i < weeks_len; i++)
            {
                weeks[i].set_text(weekformat[i]);
            }
        }
    };

    _pDatePickerBodyControl._setDatasetStyle = function (ds)
    {
        var day_item, date;
        var day_items = this._dayitems;
        var maxDay = this._maxDay;
        var cols = this._getInnerDatasetColumns();
        var background, border, color;

        var rowCount = ds.getRowCount();
        for (var i = 0; i < rowCount; i++)
        {
            date = ds.getColumn(i, cols.datecolumn);

            for (var j = 0; j < maxDay; j++)
            {
                day_item = day_items[j];
                var currDate = day_item._year + day_item._month + day_item.text.padLeft(2, "0");
                if (currDate == date)
                {
                    background = ds.getColumn(i, cols.backgroundcolumn);
                    border = ds.getColumn(i, cols.bordercolumn);
                    color = ds.getColumn(i, cols.textcolorcolumn);

                    if (background)
                    {
                        day_item.set_background(background);
                    }
                    if (border)
                    {
                        day_item.set_border(border);
                    }
                    if (color)
                    {
                        day_item.set_color(color);
                    }
                    this._changedDays[this._changedDays.length] = day_item;
                }
            }
        }
    };

    _pDatePickerBodyControl._getLeapYear = function (year)
    {
        if ((year % 4) == 0 && (year % 100) != 0 || (year % 400) == 0)
        {
            return true;
        }

        return false;
    };

    _pDatePickerBodyControl._getCurrentDate = function ()
    {
        var datepicker = this._p_parent;
        if (datepicker)
        {
            return datepicker._getCurrentDate();
        }

        return;
    };

    _pDatePickerBodyControl._getWeekformat = function ()
    {
        var datepicker = this._p_parent;
        if (datepicker)
        {
            var format = datepicker._getWeekformat();
            if (format)
            {
                if (format === " ")
                {
                    return [" ", " ", " ", " ", " ", " ", " "];
                }
                else
                {
                    return format.split(/\s+/);
                }
            }
            else
            {
                var locale = this._getLocale();
                var locale_info = nexacro.Locale.getLocaleInfo(locale);
                return locale_info.weekday_names_short;
            }
        }

        return null;
    };

    _pDatePickerBodyControl._getMonthformat = function ()
    {
        var locale = this._getLocale();
        var locale_info = nexacro.Locale.getLocaleInfo(locale);
        return locale_info.month_names_long;
    };

    _pDatePickerBodyControl._getYearformat = function ()
    {
        var today = new Date();
        var year = today.getFullYear();
        var cur_year = [];
        for (var i = 0; i < 10; i++)
        {
            cur_year.push(year + i);
            cur_year.unshift(year - 1 - i);
        }
        return cur_year;
    };

    _pDatePickerBodyControl._getDaysize = function ()
    {
        var width = 0;
        var height = 0;

        var datepicker = this._p_parent;
        if (datepicker)
        {
            var size = datepicker._getDaysize();
            if (!size)
                size = (this._getClientWidth() / 7) + " " + (this._getClientHeight() / 7);

            size = size.split(/\s+/);

            width = +size[0];
            height = size[1] ? +size[1] : width;
        }

        return { width: width, height: height };
    };

    _pDatePickerBodyControl._getMonthsize = function ()
    {
        var width = 0;
        var height = 0;

        var datepicker = this._p_parent;
        if (datepicker)
        {
            var size = (this._getClientWidth() / 4) + " " + (this._getClientHeight() / 4);

            size = size.split(/\s+/);

            width = +size[0];
            height = size[1] ? +size[1] : width;
        }

        return { width: width, height: height };
    };

    _pDatePickerBodyControl._getYearsize = function ()
    {
        var width = 0;
        var height = 0;

        var datepicker = this._p_parent;
        if (datepicker)
        {
            var size = (this._getClientWidth() / 4) + " " + (this._getClientHeight() / 4);

            size = size.split(/\s+/);

            width = +size[0];
            height = size[1] ? +size[1] : width;
        }

        return { width: width, height: height };
    };

    _pDatePickerBodyControl._getDayInfo = function (text, trailingday, visible, year, month)
    {
        year = nexacro._toString(year);
        year = year ? year.padLeft(4, "0") : "";

        month = nexacro._toString(month);
        month = month ? month.padLeft(2, "0") : "";

        var day = nexacro._toString(text);
        day = day ? day.padLeft(2, "0") : "";

        return {
            text: text, trailingday: trailingday, visible: visible,
            year: year, month: month, day: day
        };
    };

    _pDatePickerBodyControl._getDayItem = function (day)
    {
        if (day == -1)
        {
            return null;
        }

        var days = this._dayitems;
        var maxDay = this._maxDay;
        for (var i = 0; i < maxDay; i++)
        {
            if (!days[i]._trailingday && day == days[i].text.padLeft(2, "0"))
            {
                return days[i];
            }
        }

        return null;
    };

    _pDatePickerBodyControl._getMonthItem = function (month)
    {
        if (month == -1)
        {
            return null;
        }

        var months = this._monthitems;
        var maxMonth = this._maxMonth;
        for (var i = 0; i < maxMonth; i++)
        {
            if (!months[i]._trailingday && month == months[i].text.padLeft(2, "0"))
            {
                return months[i];
            }
        }

        return null;
    };

    _pDatePickerBodyControl._getYearItem = function (year)
    {
        if (year == -1)
        {
            return null;
        }

        var years = this._yearitems;
        var maxYear = this._maxYear;
        for (var i = 0; i < maxYear; i++)
        {
            if (!years[i]._trailingday && year == years[i].text.padLeft(2, "0"))
            {
                return years[i];
            }
        }

        return null;
    };

    _pDatePickerBodyControl._getUsetrailingday = function ()
    {
        var datepicker = this._p_parent;
        if (datepicker)
        {
            return datepicker._getUsetrailingday();
        }

        return null;
    };

    _pDatePickerBodyControl._getUseTrailingDayInfo = function (year, month, dateObj, endDay)
    {
        var prev_year = year;
        var next_year = year;
        var prev_month = month;
        var next_month = month;

        if (month == 1)
        {
            prev_year -= 1;
            prev_month = 12;

            next_month += 1;
        }
        else
        {
            prev_month -= 1;
            if (month == 12)
            {
                next_year += 1;
                next_month = 1;
            }
            else
            {
                next_month += 1;
            }
        }

        var idx = dateObj.getDay() - 1;

        dateObj.setDate(endDay);
        var endWeek = dateObj.getDay();

        var N = nexacro.Calendar.EndDayNormal;
        var L = nexacro.Calendar.EndDayLeap;

        var is_pre_leapyear = this._getLeapYear(prev_year);
        var pre_endDay = is_pre_leapyear ? L[prev_month - 1] : N[prev_month - 1];
        var next_beginDay = 1;

        return {
            prev_year: prev_year, next_year: next_year,
            prev_month: prev_month, next_month: next_month,
            endWeek: endWeek, idx: idx, pre_endDay: pre_endDay, next_beginDay: next_beginDay
        };
    };

    _pDatePickerBodyControl._getInnerDataset = function ()
    {
        var datepicker = this._p_parent;
        if (datepicker)
        {
            return datepicker._getInnerDataset();
        }
        return null;
    };

    _pDatePickerBodyControl._getInnerDatasetColumns = function ()
    {
        var datepicker = this._p_parent;
        if (datepicker)
        {
            var background = datepicker._getBackgroundcolumn();
            var border = datepicker._getBordercolumn();
            var date = datepicker._getDatecolumn();
            var textcolor = datepicker._getTextcolorcolumn();

            return { backgroundcolumn: background, bordercolumn: border, datecolumn: date, textcolorcolumn: textcolor };
        }

        return null;
    };

    _pDatePickerBodyControl._isToday = function (v)
    {
        var year = this._date.int_year;
        var month = this._date.int_month;
        var day = parseInt(v, 10);
        var currDate = this._getCurrentDate();

        if (year == currDate.year && month == currDate.month && day == currDate.day)
        {
            return true;
        }

        return false;
    };

    _pDatePickerBodyControl._isSelectedDay = function (v)
    {
        v = parseInt(v, 10);
        var year = this._date.int_year;
        var month = this._date.int_month;
        if (year == this._p_parent._selected_year && month == this._p_parent._selected_month && v == this._p_parent._selected_day)
        {
            return true;
        }
        return false;
    };

    _pDatePickerBodyControl._setCalendarAccessibility = function ()
    {
        if (this._env._p_enableaccessibility)
        {
            var calendar = this._p_parent._p_parent;
            var date = this._date;
            var cal_value = date.str_year + date.str_month + date.str_day;
            var accessibility_value = calendar._masktypeobj.applyMask(cal_value);
            this._p_parent._setAccessibilityLabel(accessibility_value);
            this._setAccessibilityLabel(accessibility_value);
            nexacro._notifyAccessibilityValue(this._control_element, accessibility_value, "daychange");
        }
    };

    _pDatePickerBodyControl = null;
    //delete _pDatePickerBodyControl;

    //===============================================================
    // nexacro._DatePickerDayItemControl : Button
    //===============================================================
    nexacro._DatePickerDayItemControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._flag_dataset = -1;
        this._dataset_background = "";
        this._refObj = parent._p_parent;
    };

    var _pDatePickerDayItemControl = nexacro._createPrototype(nexacro.Button, nexacro._DatePickerDayItemControl);
    nexacro._DatePickerDayItemControl.prototype = _pDatePickerDayItemControl;
    _pDatePickerDayItemControl._type_name = "DatePickerDayItemControl";
    _pDatePickerDayItemControl._is_subcontrol = true;
    _pDatePickerDayItemControl._p_accessibilityrole = "gridcell";

    _pDatePickerDayItemControl._trailingday = false;
    _pDatePickerDayItemControl._use_pushed_status = false;

    _pDatePickerDayItemControl._year = "";
    _pDatePickerDayItemControl._month = "";

    _pDatePickerDayItemControl._daysofweek = -1;

    _pDatePickerDayItemControl._use_readonly_status = true;

    //===============================================================
    // nexacro._DatePickerDayItemControl : Properties
    //===============================================================
    _pDatePickerDayItemControl.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (v != this._p_readonly)
        {
            this._p_readonly = v;
            this.on_apply_readonly();
        }
    };

    _pDatePickerDayItemControl.on_apply_readonly = function ()
    {
        var v = this._p_readonly;

        this._changeStatus("readonly", v);
    };

    //===============================================================
    // nexacro._DatePickerDayItemControl : Logical Part
    //===============================================================
    _pDatePickerDayItemControl._setDaysOfWeek = function (daysofweek)
    {
        if (this._daysofweek != daysofweek)
        {
            this._daysofweek = daysofweek;
            this._on_apply_daysofweek(daysofweek);
        }
    };

    _pDatePickerDayItemControl._changeDayUserStatus = function (week, value)
    {
        var userstatus = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

        if (userstatus[week])
            this._changeUserStatus(userstatus[week], value);
    };

    _pDatePickerDayItemControl._on_apply_daysofweek = function (v)
    {
        var text = v;
        if (text && text.length > 0)
        {
            if (this.trailingday)
                this._changeUserStatus("trailingday", true);
            else if (this._p_parent._isSelectedDay(text))
                this._changeUserStatus("selected", true);
            else if (this._p_parent._isToday(text))
                this._changeUserStatus("today", true);
            else if (this._daysofweek >= 0 && this._daysofweek <= 6)
                this._changeDayUserStatus(this._daysofweek, true);
        }
    };

    _pDatePickerDayItemControl.on_changeStatus = function (changestatus, value, applystatus, currentstatus, currentuserstatus)
    {
        var calendar = this._p_parent._p_parent._p_parent;
        if (calendar && calendar._onlydisplay == true)
        {
            if (applystatus != "disabled")
            {
                return "enabled";
            }
        }
        else
        {
            return applystatus;
        }

    };

    _pDatePickerDayItemControl.on_changeUserStatus = function (changestatus, value, applyuserstatus, currentstatus, currentuserstatus)
    {
        if (value)
            return changestatus;
        else
            return applyuserstatus;
    };

    _pDatePickerDayItemControl.on_getIDCSSSelector = function ()
    {
        return "dayitem";
    };

    _pDatePickerDayItemControl.on_keydown_basic_action = function ()
    {
        if (this._env._p_enableaccessibility) //need to test
            nexacro.Button.prototype.on_apply_accessibility.call(this);
    };

    _pDatePickerDayItemControl = null;
    //delete _pDatePickerDayItemControl;

    //===============================================================
    // nexacro._DatePickerWeekItemControl : Static
    //===============================================================
    nexacro._DatePickerWeekItemControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Static.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        this._refObj = parent._p_parent;
    };

    var _pDatePickerWeekItemControl = nexacro._createPrototype(nexacro.Static, nexacro._DatePickerWeekItemControl);
    nexacro._DatePickerWeekItemControl.prototype = _pDatePickerWeekItemControl;
    _pDatePickerWeekItemControl._type_name = "DatePickerWeekItemControl";
    _pDatePickerWeekItemControl._is_subcontrol = true;
    _pDatePickerWeekItemControl._daysofweek = -1;

    _pDatePickerWeekItemControl._use_readonly_status = true;

    //===============================================================
    // nexacro._DatePickerWeekItemControl : Properties
    //===============================================================
    _pDatePickerWeekItemControl.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (v != this._p_readonly)
        {
            this._p_readonly = v;
            this.on_apply_readonly();
        }
    };

    _pDatePickerWeekItemControl.on_apply_readonly = function ()
    {
        var v = this._p_readonly;

        this._changeStatus("readonly", v);
    };

    //===============================================================
    // nexacro._DatePickerWeekItemControl : Logical Part
    //===============================================================
    _pDatePickerWeekItemControl._setDaysOfWeek = function (daysofweek)
    {
        if (this._daysofweek != daysofweek)
        {
            this._daysofweek = daysofweek;
            this._on_apply_daysofweek(daysofweek);
        }
    };

    _pDatePickerWeekItemControl._changeDayUserStatus = function (week, value)
    {
        var userstatus = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

        if (userstatus[week])
            this._changeUserStatus(userstatus[week], value);
    };

    _pDatePickerWeekItemControl._on_apply_daysofweek = function (v)
    {
        this._changeDayUserStatus(v, true);
    };

    _pDatePickerWeekItemControl.on_changeUserStatus = function (changestatus, value, applyuserstatus, currentstatus, currentuserstatus)
    {
        return changestatus;
    };

    _pDatePickerWeekItemControl.on_getIDCSSSelector = function ()
    {
        return "weekitem";
    };

    _pDatePickerWeekItemControl = null;
    //delete _pDatePickerWeekItemControl;
    //===============================================================
    // nexacro._DatePickerMonthItemControl : Button
    //===============================================================
    nexacro._DatePickerMonthItemControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._flag_dataset = -1;
        this._dataset_background = "";
        this._refObj = parent._p_parent;
    };

    var _pDatePickerMonthItemControl = nexacro._createPrototype(nexacro.Button, nexacro._DatePickerMonthItemControl);
    nexacro._DatePickerMonthItemControl.prototype = _pDatePickerMonthItemControl;
    _pDatePickerMonthItemControl._type_name = "ButtonControl";
    _pDatePickerMonthItemControl._is_subcontrol = true;
    _pDatePickerMonthItemControl._p_accessibilityrole = "gridcell";

    _pDatePickerMonthItemControl._trailingday = false;

    _pDatePickerMonthItemControl._year = "";
    _pDatePickerMonthItemControl._month = "";

    _pDatePickerMonthItemControl._use_readonly_status = true;

    //===============================================================
    // nexacro._DatePickerMonthItemControl : Properties
    //===============================================================
    _pDatePickerMonthItemControl.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (v != this._p_readonly)
        {
            this._p_readonly = v;
            this.on_apply_readonly();
        }
    };

    _pDatePickerMonthItemControl.on_apply_readonly = function ()
    {
        var v = this._p_readonly;

        this._changeStatus("readonly", v);
    };

    //===============================================================
    // nexacro._DatePickerMonthItemControl : Logical Part
    //===============================================================

    _pDatePickerMonthItemControl.on_changeStatus = function (changestatus, value, applystatus, currentstatus, currentuserstatus)
    {
        var calendar = this._p_parent._p_parent._p_parent;
        if (calendar && calendar._onlydisplay == true)
        {
            if (applystatus != "disabled")
            {
                return "enabled";
            }
        }
        else
        {
            return applystatus;
        }

    };

    _pDatePickerMonthItemControl.on_changeUserStatus = function (changestatus, value, applyuserstatus, currentstatus, currentuserstatus)
    {
        if (value)
            return changestatus;
        else
            return applyuserstatus;
    };

    _pDatePickerMonthItemControl.on_getIDCSSSelector = function ()
    {
        return "monthitem";
    };

    _pDatePickerMonthItemControl.on_keydown_basic_action = function ()
    {
        if (this._env._p_enableaccessibility) //need to test
            nexacro.Button.prototype.on_apply_accessibility.call(this);
    };

    _pDatePickerMonthItemControl = null;
    //delete _pDatePickerMonthItemControl;


    //===============================================================
    // nexacro._DatePickerYearItemControl : Button
    //===============================================================
    nexacro._DatePickerYearItemControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._flag_dataset = -1;
        this._dataset_background = "";
        this._refObj = parent._p_parent;
    };

    var _pDatePickerYearItemControl = nexacro._createPrototype(nexacro.Button, nexacro._DatePickerYearItemControl);
    nexacro._DatePickerYearItemControl.prototype = _pDatePickerYearItemControl;
    _pDatePickerYearItemControl._type_name = "DatePickerYearItemControl";
    _pDatePickerYearItemControl._is_subcontrol = true;
    _pDatePickerYearItemControl._p_accessibilityrole = "gridcell";

    // trailingyear 스펙에 대한 검토 없이 개선된 내용으로 롤백 RP 100743
    //_pDatePickerYearItemControl._trailingyear = false;

    _pDatePickerYearItemControl._year = "";
    _pDatePickerYearItemControl._month = "";

    _pDatePickerYearItemControl._use_readonly_status = true;

    //===============================================================
    // nexacro._DatePickerYearItemControl : Properties
    //===============================================================
    _pDatePickerYearItemControl.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (v != this._p_readonly)
        {
            this._p_readonly = v;
            this.on_apply_readonly();
        }
    };

    _pDatePickerYearItemControl.on_apply_readonly = function ()
    {
        var v = this._p_readonly;

        this._changeStatus("readonly", v);
    };

    //===============================================================
    // nexacro._DatePickerYearItemControl : Logical Part
    //===============================================================

    _pDatePickerYearItemControl.on_changeStatus = function (changestatus, value, applystatus, currentstatus, currentuserstatus)
    {
        var calendar = this._p_parent._p_parent._p_parent;
        if (calendar && calendar._onlydisplay == true)
        {
            if (applystatus != "disabled")
            {
                return "enabled";
            }
        }
        else
        {
            return applystatus;
        }

    };

    _pDatePickerYearItemControl.on_changeUserStatus = function (changestatus, value, applyuserstatus, currentstatus, currentuserstatus)
    {
        if (value)
            return changestatus;
        else
            return applyuserstatus;
    };

    _pDatePickerYearItemControl.on_getIDCSSSelector = function ()
    {
        return "yearitem";
    };

    _pDatePickerYearItemControl.on_keydown_basic_action = function ()
    {
        if (this._env._p_enableaccessibility) //need to test
            nexacro.Button.prototype.on_apply_accessibility.call(this);
    };

    _pDatePickerYearItemControl = null;
    //delete _pDatePickerYearItemControl;

    nexacro._YearSpinControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Spin.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pYearSpinControl = nexacro._createPrototype(nexacro.Spin, nexacro._YearSpinControl);
    nexacro._YearSpinControl.prototype = _pYearSpinControl;
    _pYearSpinControl._type_name = "Spin";
    _pYearSpinControl._default_mask = "9999";
    _pYearSpinControl._is_subcontrol = true;

    _pYearSpinControl.on_create_contents = function ()
    {
        var control = this.getElement();
        if (control)
        {
            var spinedit = this._p_spinedit = new nexacro._SpinEditControl("spinedit", 0, 0, 0, 0, null, null, null, null, null, null, this);
            var spinupbutton = this._p_spinupbutton = new nexacro._SpinButtonControl("spinupbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
            var spindownbutton = this._p_spindownbutton = new nexacro._SpinButtonControl("spindownbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
            spinedit.set_limitbymask("both");

            spinedit.createComponent(true);
            spinupbutton.createComponent(true);
            spindownbutton.createComponent(true);
        }
    };

    _pYearSpinControl = null;


    nexacro._MonthSpinControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Spin.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pMonthSpinControl = nexacro._createPrototype(nexacro.Spin, nexacro._MonthSpinControl);
    nexacro._MonthSpinControl.prototype = _pMonthSpinControl;
    _pMonthSpinControl._type_name = "Spin";
    _pMonthSpinControl._is_subcontrol = true;
    _pMonthSpinControl._default_mask = "99";

    _pMonthSpinControl.on_create_contents = function ()
    {
        var control = this.getElement();
        if (control)
        {
            var spinedit = this._p_spinedit = new nexacro._SpinEditControl("spinedit", 0, 0, 0, 0, null, null, null, null, null, null, this);
            var spinupbutton = this._p_spinupbutton = new nexacro._SpinButtonControl("spinupbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
            var spindownbutton = this._p_spindownbutton = new nexacro._SpinButtonControl("spindownbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
            spinedit.set_limitbymask("both");

            spinedit.createComponent(true);
            spinupbutton.createComponent(true);
            spindownbutton.createComponent(true);
        }
    };

    _pMonthSpinControl = null;

}
