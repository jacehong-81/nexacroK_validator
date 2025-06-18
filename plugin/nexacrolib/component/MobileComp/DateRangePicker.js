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

if (!nexacro.DateRangePicker)
{
    nexacro.RangeDateChangedEventInfo = function (obj, id, prestartdate, poststartdate, preenddate, postenddate)
    {
        this.id = this.eventid = id || "onrangedatechanged";
        this.prestartdate = prestartdate;
        this.poststartdate = poststartdate;
        this.preenddate = preenddate;
        this.postenddate = postenddate;
        this.fromobject = this.fromreferenceobject = obj;
    };

    var _pRangeDateChangedEventInfo = nexacro._createPrototype(nexacro.ChangedEventInfo, nexacro.RangeDateChangedEventInfo);
    nexacro.RangeDateChangedEventInfo.prototype = _pRangeDateChangedEventInfo;
    _pRangeDateChangedEventInfo._type_name = "RangeDateChangedEventInfo";

    _pRangeDateChangedEventInfo = null;

    //==============================================================================
    // nexacro.DateRangePicker
    //==============================================================================
    nexacro.DateRangePicker = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._select = {
            anchor: { row: -1, col: -1, year: -1, month: -1, day: -1 },
            start: null,
            end: null
        };

        this._startdate = { date: "", time: "" };
        this._enddate = { date: "", time: "" };
    };

    var _pDateRangePicker = nexacro._createPrototype(nexacro.Component, nexacro.DateRangePicker);
    nexacro.DateRangePicker.prototype = _pDateRangePicker;
    _pDateRangePicker._type_name = "DateRangePicker";

    _pDateRangePicker._event_list["onchanged"] = 1;
    _pDateRangePicker._event_list["ondayclick"] = 1;
    _pDateRangePicker._event_list["oncloseup"] = 1;
    _pDateRangePicker._event_list["oninnerdatachanged"] = 1;

    _pDateRangePicker._use_readonly_status = true;

    /* properties */
    _pDateRangePicker._p_type = "range";
    _pDateRangePicker._p_displaytype = "date";
    _pDateRangePicker._p_useheadline = true;
    _pDateRangePicker._p_displaymonthcount = 2;
    _pDateRangePicker._p_value = null;
    _pDateRangePicker._p_startdate = null;
    _pDateRangePicker._p_enddate = null;
    _pDateRangePicker._p_mindate = null;
    _pDateRangePicker._p_maxdate = null;
    _pDateRangePicker._p_closebuttontext = "CLOSE";
    _pDateRangePicker._p_okbuttontext = "OK";
    _pDateRangePicker._p_cancelbuttontext = "CANCEL";
    _pDateRangePicker._p_headlinedateformat = "";
    _pDateRangePicker._p_headlinetimeformat = "";
    _pDateRangePicker._p_defaultrangeposition = 1;
    _pDateRangePicker._p_rangeposition = "start";
    _pDateRangePicker._p_innerdataset = null;
    _pDateRangePicker._p_backgroundcolumn = "";
    _pDateRangePicker._p_bordercolumn = "";
    _pDateRangePicker._p_datecolumn = "";
    _pDateRangePicker._p_textcolorcolumn = "";
    _pDateRangePicker._p_hintingcolumn = "";
    _pDateRangePicker._p_readonlycolumn = "";
    _pDateRangePicker._p_tabbuttonheight = "";
    _pDateRangePicker._p_closebuttonsize = "";
    _pDateRangePicker._p_headlineenddatenulltext = "";
    _pDateRangePicker._p_readonly = false;
    _pDateRangePicker._p_datetabbuttontext = "";
    _pDateRangePicker._p_timetabbuttontext = "";
    _pDateRangePicker._p_headlineposition = "top";
    _pDateRangePicker._p_direction = "horizontal";
    _pDateRangePicker._p_headlinesize = null;
    _pDateRangePicker._p_datepickerheadheight = undefined;

    _pDateRangePicker._properties = [
        { name: "type" },
        { name: "displaytype" },
        { name: "useheadline" },
        { name: "datepickerheadheight" },
        { name: "displaymonthcount" },
        { name: "value" },
        { name: "startdate" },
        { name: "enddate" },
        { name: "mindate" },
        { name: "maxdate" },
        { name: "okbuttontext" },
        { name: "cancelbuttontext" },
        { name: "closebuttontext" },
        { name: "headlinedateformat" },
        { name: "headlinetimeformat" },
        { name: "defaultrangeposition" },
        { name: "rangeposition" },
        { name: "innerdataset" },
        { name: "backgroundcolumn" },
        { name: "bordercolumn" },
        { name: "datecolumn" },
        { name: "textcolorcolumn" },
        { name: "hintingcolumn" },
        { name: "readonlycolumn" },
        { name: "tabbuttonheight" },
        { name: "closebuttonsize" },
        { name: "headlinestartdatenulltext" },
        { name: "headlineenddatenulltext" },
        { name: "readonly" },
        { name: "datetabbuttontext" },
        { name: "timetabbuttontext" },
        { name: "headlineposition" },
        { name: "direction" },
        { name: "locale" },
        { name: "headlinesize" }
    ];

    _pDateRangePicker._use_notify_frame_resize = true;  // for scale bug (chrome, edge)

    /* internal control */
    _pDateRangePicker._datepicker_group = null;
    _pDateRangePicker._timepicker_group = null;
    _pDateRangePicker._okbutton = null;
    _pDateRangePicker._cancelbutton = null;
    _pDateRangePicker._datetabbutton = null;
    _pDateRangePicker._timetabbutton = null;
    _pDateRangePicker._headline = null;

    /* internal variable */
    _pDateRangePicker._innerdataset = null;
    _pDateRangePicker._useclosebutton = false;
    _pDateRangePicker._headline_autoposition = false;
    _pDateRangePicker._usertimeformat = "";
    _pDateRangePicker._date_value = null;
    _pDateRangePicker._time_value = null;
    _pDateRangePicker._locale = null;
    _pDateRangePicker._headlinewidth = 150;
    _pDateRangePicker._headlineheight = 80;

    _pDateRangePicker._is_locale_control = true;
    _pDateRangePicker._invalid_startdate = "";
    _pDateRangePicker._invalid_enddate = "";
    _pDateRangePicker._currenttab = "date";
    _pDateRangePicker._is_popup_child = false;

    _pDateRangePicker.on_create_contents = function ()
    {
        this._updateHeadLine(true);
        this._updateTabButtons(true);
        this._updatePicker(true);
        this.on_apply_displaymonthcount();
        this.on_apply_innerdataset();
        this.on_apply_backgroundcolumn();
        this.on_apply_bordercolumn();
        this.on_apply_datecolumn();
        this.on_apply_readonlycolumn();
        this.on_apply_hintingcolumn();
        this.on_apply_textcolorcolumn();
        this._updateButtons(true);
        this.on_apply_direction();
        this.on_apply_mindate();
        this.on_apply_maxdate();
    };

    _pDateRangePicker.on_created_contents = function (win)
    {
        if (this._headline)
            this._headline.on_created(win);
        if (this._closebutton)
            this._closebutton.on_created(win);
        if (this._okbutton)
            this._okbutton.on_created(win);
        if (this._cancelbutton)
            this._cancelbutton.on_created(win);
        if (this._datetabbutton)
            this._datetabbutton.on_created(win);
        if (this._timetabbutton)
            this._timetabbutton.on_created(win);

        if (this._datepicker_group)
        {
            this._datepicker_group.on_created(win);
            if (this._p_datepickerheadheight)
                this.on_apply_datepickerheadheight();
        }
        if (this._timepicker_group)
            this._timepicker_group.on_created(win);
    };

    _pDateRangePicker.on_after_created = function ()
    {
        this._skip_recalc = true;
        this._updatePicker();
        this._recalcLayout();
        this.on_apply_displaymonthcount();
        this.on_apply_startdate();
        this.on_apply_enddate();
        this.on_apply_type();
        this.on_apply_headlinedateformat();
        this.on_apply_headlinetimeformat();
        this._skip_recalc = false;

        this._recalcLayout();
        //this._getGroup()._setFocus(false);
    };

    _pDateRangePicker.on_create_contents_command = function ()
    {
        var str = "";

        if (this._headline)
            str += this._headline.createCommand();
        if (this._datetabbutton)
            str += this._datetabbutton.createCommand();
        if (this._timetabbutton)
            str += this._timetabbutton.createCommand();
        if (this._closebutton)
            str += this._closebutton.createCommand();
        if (this._okbutton)
            str += this._okbutton.createCommand();
        if (this._cancelbutton)
            str += this._cancelbutton.createCommand();

        if (this._datepicker_group)
            str += this._datepicker_group.createCommand();
        if (this._timepicker_group)
            str += this._timepicker_group.createCommand();

        return str;
    };

    _pDateRangePicker.on_attach_contents_handle = function (win)
    {
        if (this._headline)
        {
            this._headline.attachHandle(win);
            this._headline._setAccessibilityStatHidden(true);
        }

        if (this._datetabbutton)
        {
            this._datetabbutton.attachHandle(win);
            this._datetabbutton._setAccessibilityStatHidden(true);
        }

        if (this._timetabbutton)
        {
            this._timetabbutton.attachHandle(win);
            this._timetabbutton._setAccessibilityStatHidden(true);
        }

        if (this._closebutton)
        {
            this._closebutton.attachHandle(win);
            this._closebutton._setAccessibilityStatHidden(true);
        }

        if (this._okbutton)
        {
            this._okbutton.attachHandle(win);
            this._okbutton._setAccessibilityStatHidden(true);
        }

        if (this._cancelbutton)
        {
            this._cancelbutton.attachHandle(win);
            this._cancelbutton._setAccessibilityStatHidden(true);
        }

        if (this._datepicker_group)
        {
            this._datepicker_group.attachHandle(win);
            this._datepicker_group._setAccessibilityStatHidden(true);
            if (this._p_datepickerheadheight)
                this.on_apply_datepickerheadheight();
        }

        if (this._timepicker_group)
        {
            this._timepicker_group.attachHandle(win);
            this._timepicker_group._setAccessibilityStatHidden(true);
        }
    };

    _pDateRangePicker.on_destroy_contents = function ()
    {
        this._destroyPicker();
        this._destroyHeadLine();
        this._destroyTabButtons();
        this._destroyUsedButtons();
        this._select = null;
        this._startdate = null;
        this._enddate = null;

        if (this._innerdataset)
        {
            this._innerdataset._removeEventHandler("onvaluechanged", this._on_dataset_onvaluechanged, this);
            this._innerdataset = null;
        }
    };

    _pDateRangePicker._updateTabButtons = function (create_only)
    {
        if (this._p_displaytype == "datetime" && !this._datetabbutton)
        {
            var datetabbutton = this._datetabbutton = new nexacro.Button("datetabbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
            datetabbutton._setControl();
            datetabbutton.createComponent(create_only);

            var timetabbutton = this._timetabbutton = new nexacro.Button("timetabbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
            timetabbutton._setControl();
            timetabbutton.createComponent(create_only);

            datetabbutton._setEventHandler("onclick", this.on_notify_datetabbuttonclick, this);  // reverse
            timetabbutton._setEventHandler("onclick", this.on_notify_timetabbuttonclick, this);

            this.on_apply_datetabbuttontext();
            this.on_apply_timetabbuttontext();

            this._updateTabStatus();
        }
        else if (this._p_displaytype != "datetime")
        {
            this._destroyTabButtons();
        }
    };

    _pDateRangePicker._destroyTabButtons = function ()
    {
        if (this._datetabbutton)
        {
            this._datetabbutton.destroy();
            this._datetabbutton = null;
        }
        if (this._timetabbutton)
        {
            this._timetabbutton.destroy();
            this._timetabbutton = null;
        }
    };

    _pDateRangePicker._updateHeadLine = function (create_only)
    {
        if (this._p_useheadline && !this._headline)
        {
            var headline = this._headline = new nexacro.PickerHeadLineControl("headline", 0, 0, 0, 0, null, null, null, null, null, null, this);
            headline.set_userange(this._p_type == "range");
            headline.set_displaytype(this._p_displaytype);
            headline.createComponent(create_only);

            this.on_apply_value();
            this.on_apply_headlinestartdatenulltext();
            this.on_apply_headlineenddatenulltext();

            if (headline._p_startdatebutton)
                headline._p_startdatebutton._setEventHandler("onclick", this.on_notify_headline_onstartdateclick, this);

            if (headline._p_enddatebutton)
                headline._p_enddatebutton._setEventHandler("onclick", this.on_notify_headline_onenddateclick, this);

            if (headline._p_startsubdatebutton)
                headline._p_startsubdatebutton._setEventHandler("onclick", this.on_notify_headline_onstartsubdateclick, this);

            if (headline._p_endsubdatebutton)
                headline._p_endsubdatebutton._setEventHandler("onclick", this.on_notify_headline_onendsubdateclick, this);
        }
        else if (!this._p_useheadline)
        {
            this._destroyHeadLine();
        }
    };

    _pDateRangePicker._destroyHeadLine = function ()
    {
        if (this._headline)
        {
            this._headline.destroy();
            this._headline = null;
        }
    };

    _pDateRangePicker._updatePicker = function (create_only)
    {
        var displaytype = this._p_displaytype;
        var usedate = (displaytype.indexOf("date") >= 0);
        var usetime = (displaytype.indexOf("time") >= 0);

        if (usedate && !this._datepicker_group)
        {
            var datepicker = this._datepicker_group = new nexacro.DatePickerGroup("datepickergroup", 0, 0, 0, 0, null, null, null, null, null, null, this);
            datepicker._setControl();
            datepicker._setEventHandler("onchanged", this.on_notify_ondatechanged, this);
            datepicker._setEventHandler("onstartdateclick", this.on_notify_onstartdateclick, this);
            datepicker._setEventHandler("onenddateclick", this.on_notify_onenddateclick, this);
            datepicker.set_type(this._p_type);
            datepicker.set_direction(this._p_direction);

            if (this._p_displaytype == "datetime")
                datepicker.set_visible(true);
            this.on_apply_defaultrangeposition();
            this.on_apply_datepickerheadheight();
            datepicker.createComponent(create_only);
        }
        else if (!usedate && this._datepicker_group)
        {
            this._datepicker_group.destroy();
            this._datepicker_group = null;
        }

        if (usetime && !this._timepicker_group)
        {
            var timepicker = this._timepicker_group = new nexacro.TimePickerGroup("timepickergroup", 0, 0, 0, 0, null, null, null, null, null, null, this);
            timepicker._setControl();
            timepicker._setEventHandler("onchanged", this.on_notify_ontimechanged, this);
            timepicker._usertimeformat = this._usertimeformat;

            if (this._p_displaytype == "datetime")
                timepicker.set_visible(false);

            timepicker.set_direction(this._p_direction);
            timepicker.createComponent(create_only);
        }
        else if (!usetime && this._timepicker_group)
        {
            this._timepicker_group.destroy();
            this._timepicker_group = null;
        }
    };

    _pDateRangePicker._destroyPicker = function ()
    {
        if (this._datepicker_group)
        {
            this._datepicker_group.destroy();
            this._datepicker_group = null;
        }
        if (this._timepicker_group)
        {
            this._timepicker_group.destroy();
            this._timepicker_group = null;
        }
    };

    _pDateRangePicker._isUseCloseButton = function ()
    {
        if (this._useclosebutton && this._p_useheadline)
            return (this._p_displaytype != "date");

        return false;
    };

    _pDateRangePicker._isUseOKButton = function ()
    {
        if (!this._is_subcontrol) return false;
        return (this._p_displaytype != "date");
    };

    _pDateRangePicker._updateButtons = function (create_only)
    {
        if (this._isUseCloseButton() && !this._closebutton)
        {
            var closebutton = this._closebutton = new nexacro.Button("closebutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
            closebutton._setEventHandler("onclick", this.on_notify_close, this);
            closebutton._setControl();
            closebutton.set_text(this._p_closebuttontext);
            closebutton.createComponent(create_only);
        }
        else if (this._isUseOKButton() && !this._okbutton)
        {
            var okbutton = this._okbutton = new nexacro.Button("okbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
            okbutton._setEventHandler("onclick", this.on_notify_OK, this);
            okbutton._setControl();
            okbutton.set_text(this._p_okbuttontext);
            okbutton.createComponent(create_only);

            var cancelbutton = this._cancelbutton = new nexacro.Button("cancelbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
            cancelbutton._setEventHandler("onclick", this.on_notify_cancel, this);
            cancelbutton._setControl();
            cancelbutton.set_text(this._p_cancelbuttontext);
            cancelbutton.createComponent(create_only);
        }
        else if (!this._isUseCloseButton() && !this._isUseOKButton())
        {
            this._destroyUsedButtons();
        }

        this._recalcLayout();
    };

    _pDateRangePicker._destroyUsedButtons = function ()
    {
        if (this._closebutton)
        {
            this._closebutton.destroy();
            this._closebutton = null;
        }

        if (this._okbutton)
        {
            this._okbutton.destroy();
            this._okbutton = null;
        }

        if (this._cancelbutton)
        {
            this._cancelbutton.destroy();
            this._cancelbutton = null;
        }
    };

    _pDateRangePicker.on_apply_prop_enable = function (v)
    {
        v = (v != null) ? v : this._isEnable();

        if (this._datepicker_group)
        {
            this._datepicker_group._setEnable(v);
        }
        if (this._timepicker_group)
        {
            this._timepicker_group._setEnable(v);
        }
        if (this._closebutton)
        {
            this._closebutton._setEnable(v);
        }

        if (this._okbutton)
        {
            this._okbutton._setEnable(v);
        }

        if (this._cancelbutton)
        {
            this._cancelbutton._setEnable(v);
        }

        if (this._datetabbutton)
        {
            this._datetabbutton._setEnable(v);
        }
        if (this._timetabbutton)
        {
            this._timetabbutton._setEnable(v);
        }
        if (this._headline)
        {
            this._headline._setEnable(v);
        }
    };

    _pDateRangePicker.set_defaultrangeposition = function (v)
    {
        v = parseInt(v);
        if (this._p_defaultrangeposition != v)
        {
            this._p_defaultrangeposition = v;
            this.on_apply_defaultrangeposition();
        }
    };

    _pDateRangePicker.set_datepickerheadheight = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v))
            {
                return;
            }
        }

        if (this._p_datepickerheadheight != v)
        {
            this._p_datepickerheadheight = v;
            this.on_apply_datepickerheadheight(v);
        }
    };

    _pDateRangePicker.on_apply_datepickerheadheight = function ()
    {
        var _datepicker_group = this._datepicker_group;
        if (_datepicker_group)
            _datepicker_group._setDatepickerheadheight(this._p_datepickerheadheight);
        if (this._is_created)
        {
            this._recalcLayout();
            this.on_apply_rangeposition();
        }
    };

    _pDateRangePicker.on_apply_defaultrangeposition = function ()
    {
        if (this._datepicker_group)
            this._datepicker_group.set_defaultrangeposition(this._p_defaultrangeposition);
    };

    _pDateRangePicker.set_rangeposition = function (v)
    {
        if (this._p_rangeposition != v)
        {
            switch (v)
            {
                case "start":
                case "end":
                    this._p_rangeposition = v;
                    break;
                default:
                    return;
            }

            this.on_apply_rangeposition();
        }
    };

    _pDateRangePicker.on_apply_rangeposition = function ()
    {
        if (this._datepicker_group)
            this._datepicker_group.set_rangeposition(this._p_rangeposition, true);
    };

    _pDateRangePicker.set_locale = function (v)
    {
        if (this._p_locale != v)
        {
            this._p_locale = v;
            this.on_apply_locale(v);
        }
    };

    _pDateRangePicker.on_apply_locale = function (locale)
    {
        this._locale = "";
        this._locale = this._p_locale ? this._p_locale : this._getLocale();

        if (this._headline && this._locale)
            this._headline.set_locale(this._p_locale);

        if (this._datepicker_group)
        {
            var list = this._datepicker_group._picker_ctrl_list;

            for (var i = 0; i < list.length; i++)
                list[i]._setWeekformatText();
        }

        if (this._timepicker_group)
        {
            var list = this._timepicker_group._picker_ctrl_list;

            for (var i = 0; i < list.length; i++)
                list[i].set_locale(this._locale);
        }
    };

    _pDateRangePicker.on_apply_prop_stringresource = function ()
    {
        if (!nexacro._StringResource)
            return;

        nexacro.Component.prototype.on_apply_prop_stringresource.call(this);

        this.on_apply_headlinestartdatenulltext();
        this.on_apply_headlineenddatenulltext();
        this.on_apply_datetabbuttontext();
        this.on_apply_timetabbuttontext();
    };

    _pDateRangePicker.on_change_containerRect = function (width, height)
    {
        this._recalcLayout();
    };

    _pDateRangePicker._recalcLayout = function ()
    {
        if (this._skip_recalc)
            return;

        var headline = this._headline;
        var size, h;
        var width = this._getClientWidth();
        var height = this._getClientHeight();
        var pickertop = 0;
        var pickerleft = 0;
        var pickerheight = height;
        var orient = nexacro._getMobileOrientation();
        var default_height = 27;

        if (headline)
        {
            if (this._p_headlineposition == "left" ||
                (this._headline_autoposition && (orient == 2 || orient == 3))) // landscape
            {
                h = this._headlinewidth;
                headline.move(0, 0, h, this._getClientHeight());
                pickerleft = h;
            }
            else
            {
                h = this._headlineheight;
                headline.move(0, 0, this._getClientWidth(), h);
                pickertop = h;
                pickerheight -= h;
            }
        }

        if (this._datetabbutton)
        {
            h = (this._p_tabbuttonheight != "" && this._p_tabbuttonheight >= 0) ? this._p_tabbuttonheight : 27;
            this._datetabbutton.move(pickerleft, pickertop, (width - pickerleft) / 2, h);
            this._timetabbutton.move(pickerleft + this._datetabbutton._adjust_width, pickertop, this._datetabbutton._adjust_width, h);
            pickertop += h;
            pickerheight -= h;
        }

        var closebutton = this._closebutton;
        if (closebutton)
        {
            if (this._p_closebuttonsize)
                size = this._p_closebuttonsize.split(" ");
            else
                size = closebutton._on_getFitSize();

            var ww = +size[0];
            var hh = size[1] ? +size[1] : default_height;
            closebutton.move(width - ww, height - hh, ww, hh);
            pickerheight -= hh;
        }
        var ok_left = 0, ok_width = 0;
        var okbutton = this._okbutton;
        if (okbutton)
        {
            if (this._p_okbuttonsize)
                size = this._p_okbuttonsize.split(" ");
            else
                size = okbutton._on_getFitSize();

            ok_width = +size[0];
            var ok_height = size[1] ? +size[1] : default_height;
            ok_left = width - ok_width;
            okbutton.move(ok_left, height - ok_height, ok_width, ok_height);
            pickerheight -= ok_height;
        }


        var cancelbutton = this._cancelbutton;
        if (cancelbutton)
        {
            if (this._p_cancelbuttonsize)
                size = this._p_cancelbuttonsize.split(" ");
            else
                size = cancelbutton._on_getFitSize();

            var cancel_width = +size[0];
            var cancel_height = size[1] ? +size[1] : default_height;
            if (cancel_width + ok_width > width)
                cancel_width = width - ok_width;
            cancelbutton.move(ok_left - cancel_width, height - cancel_height, cancel_width, cancel_height);
            //pickerheight -= hh;
        }


        var datepicker = this._datepicker_group, timepicker = this._timepicker_group;
        var date_width, time_width;

        if (datepicker && timepicker)
        {
            date_width = width - pickerleft;
            time_width = width - pickerleft;
            datepicker.move(pickerleft, pickertop, date_width, pickerheight);
            timepicker.move(pickerleft, pickertop, time_width, pickerheight);
        }
        else if (datepicker)
        {
            date_width = width - pickerleft;
            datepicker.move(pickerleft, pickertop, date_width, pickerheight);
        }
        else if (timepicker)
        {
            time_width = width - pickerleft;
            timepicker.move(pickerleft, pickertop, time_width, pickerheight);
        }
    };

    _pDateRangePicker.on_notify_ondatechanged = function (obj, e)
    {
        if (obj.id == "datepickergroup")
        {
            this._startdate.date = e.poststartdate;
            this._enddate.date = e.postenddate;

            if (this._p_type == "range" && this._p_displaytype == "datetime")
            {
                if (this._startdate.date == this._enddate.date)
                {
                    if (this._startdate.time > this._enddate.time)
                    {
                        this._enddate.time = this._startdate.time;
                        this._timepicker_group.set_enddate(this._enddate.time, true);
                    }
                }
            }
        }
        else if (obj.id == "timepickergroup")
        {
            this._startdate.time = e.poststartdate;
            this._enddate.time = e.postenddate ? e.postenddate : e.poststartdate;
        }

        this._confirmValue();
    };

    _pDateRangePicker.on_notify_close = function (obj, e)
    {
        this.on_fire_oncloseup(obj, true, true);
    };

    _pDateRangePicker.on_notify_OK = _pDateRangePicker.on_notify_close;

    _pDateRangePicker.on_notify_cancel = function (obj, e)
    {
        this.on_fire_oncloseup(obj, false, true);
    };

    _pDateRangePicker.on_notify_headline_onstartdateclick = function (obj, e)
    {
        if (this._p_displaytype == "datetime")
            this._changeTab("date");

        if (this._datepicker_group)
        {
            this._datepicker_group._cancelSelectYearMonth();
            this._datepicker_group._animateScroll("startdate", undefined, true);
        }
    };

    _pDateRangePicker.on_notify_headline_onenddateclick = function (obj, e)
    {
        if (this._p_displaytype == "datetime")
            this._changeTab("date");

        if (this._datepicker_group)
        {
            this._datepicker_group._cancelSelectYearMonth();
            this._datepicker_group._animateScroll("enddate", undefined, true);
        }
    };

    _pDateRangePicker.on_notify_headline_onstartsubdateclick = function (obj, e)
    {
        if (this._p_displaytype == "datetime")
            this._changeTab("time");
    };

    _pDateRangePicker.on_notify_headline_onendsubdateclick = function (obj, e)
    {
        if (this._p_displaytype == "datetime")
            this._changeTab("time");
    };

    _pDateRangePicker.on_notify_datetabbuttonclick = function (obj, e)
    {
        this._changeTab("date");
    };

    _pDateRangePicker.on_notify_timetabbuttonclick = function (obj, e)
    {
        this._changeTab("time");
    };

    _pDateRangePicker._updateTabStatus = function ()
    {
        if (this._currenttab == "date")
        {
            if (this._datetabbutton)
            {
                this._datetabbutton._changeUserStatus("selected", true);
                this._timetabbutton._changeUserStatus("selected", false);
            }

            if (this._datepicker_group)
                this._datepicker_group.set_visible(true);
            if (this._timepicker_group)
                this._timepicker_group.set_visible(false);
        }
        else if (this._currenttab == "time")
        {
            if (this._datetabbutton)
            {
                this._datetabbutton._changeUserStatus("selected", false);
                this._timetabbutton._changeUserStatus("selected", true);
            }

            if (this._datepicker_group)
                this._datepicker_group.set_visible(false);
            if (this._timepicker_group)
                this._timepicker_group.set_visible(true);
        }
    };

    _pDateRangePicker._changeTab = function (kind)
    {
        this._currenttab = kind;
        this._updateTabStatus();
        this._getGroup()._setFocus(false);
    };

    _pDateRangePicker._getGroup = function ()
    {
        if (this._timepicker_group && this._timepicker_group._p_visible)
            return this._timepicker_group;
        else if (this._datepicker_group && this._datepicker_group._p_visible)
            return this._datepicker_group;
    };

    _pDateRangePicker.on_notify_onstartdateclick = function (obj, e)
    {
        this._invalid_startdate = "";
        this._invalid_enddate = "";

        if (e.kind != "after_onchanged")
        {
            if (e.actk != "arrow_key")
                this.on_fire_ondayclick(e.date, "start");
        }
        else
        {
            if (e.actk == "click")
            {
                if (this._p_type != "range" && this._p_displaytype == "date")
                    this.on_fire_oncloseup(this, true, true);
            }
        }
    };

    _pDateRangePicker.on_notify_onenddateclick = function (obj, e)
    {
        if (e.kind != "after_onchanged")
        {
            if (e.actk != "arrow_key")
                this.on_fire_ondayclick(e.date, "end");
        }
    };

    _pDateRangePicker.on_fire_oncloseup = function (obj, apply, self_call)
    {
        if (!this._is_popup_child)
            return;

        if (!self_call)
        {
            if (this.oncloseup && this.oncloseup._has_handlers)
            {
                var evt = new nexacro.EventInfo(this);
                evt.eventid = "oncloseup";
                evt._is_external_call = true;

                return this.oncloseup._fireEvent(this, evt);
            }
        }
        else
        {
            if (this.oncloseup && this.oncloseup._has_handlers)
            {
                var evt = new nexacro.EventInfo(this);
                evt.eventid = "oncloseup";
                evt._apply_value = apply;
                evt._startdate = this.startdate;// ? this.startdate : "00000000";
                evt._enddate = this.enddate;

                return this.oncloseup._fireEvent(this, evt);
            }
        }

        return false;
    };

    _pDateRangePicker._on_dataset_onvaluechanged = function (obj, e)
    {
        if (this._is_created)
        {
            this.on_fire_oninnerdatachanged(obj, e.oldvalue, e.newvalue, e.columnid, e.col, e.row);
        }
    };

    _pDateRangePicker.on_fire_oninnerdatachanged = function (obj, oldvalue, newvalue, columnid, col, row)
    {
        if (this.oninnerdatachanged && this.oninnerdatachanged._has_handlers)
        {
            var evt = new nexacro.InnerdataChangedEventInfo(obj, "oninnerdatachanged", oldvalue, newvalue, columnid, col, row);
            return this.oninnerdatachanged._fireEvent(this, evt);
        }

        return true;
    };

    _pDateRangePicker.on_fire_ondayclick = function (postdate, rangepos)
    {
        if (this.ondayclick && this.ondayclick._has_handlers)
        {
            var evt = new nexacro.DateRangePickerDayClickEventInfo(this, "ondayclick", postdate, rangepos);
            return this.ondayclick._fireEvent(this, evt);
        }
        return true;
    };

    _pDateRangePicker.on_fire_onchanged = function (prestartdate, poststartdate, preenddate, postenddate)
    {
        if (this.onchanged && this.onchanged._has_handlers)
        {
            var evt = new nexacro.RangeDateChangedEventInfo(this, "onchanged", prestartdate, poststartdate, preenddate, postenddate);
            return this.onchanged._fireEvent(this, evt);
        }
    };

    _pDateRangePicker._notify_frame_resize = function ()
    {
        if (this._datepicker_group)
            this._datepicker_group._scrollCurrent();
    };

    _pDateRangePicker.on_fire_user_onkeydown = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key)
    {
        if (!(from_comp instanceof nexacro._DatePickerBodyControl)
            && (from_refer_comp instanceof nexacro._DatePickerBodyControl || from_refer_comp instanceof nexacro._DatePickerDayItemControl))
        {
            return false;
        }
        else
        {
            return nexacro.Component.prototype.on_fire_user_onkeydown.call(this, key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key);
        }
    };

    _pDateRangePicker.set_type = function (v)
    {
        if (v)
            v = v.toLowerCase();

        if (this._p_type != v)
        {
            switch (v)
            {
                case "single":
                case "range":
                    this._p_type = v;
                    break;
                default:
                    return;
            }

            this.on_apply_type();
        }
    };

    _pDateRangePicker.on_apply_type = function ()
    {
        if (this._control_element)
        {
            this._updatePicker();
            this._recalcLayout();
        }

        if (this._headline)
            this._headline.set_userange(this._p_type == "range");

        if (this._datepicker_group)
            this._datepicker_group.set_type(this._p_type, true);
        if (this._timepicker_group)
            this._timepicker_group.set_type(this._p_type, true);

        if (this._p_type == "range")
            this.on_apply_startdate();
    };

    _pDateRangePicker.set_displaytype = function (v)
    {
        if (v)
            v = v.toLowerCase();

        if (this._p_displaytype != v)
        {
            switch (v)
            {
                case "date":
                case "datetime":
                case "time":
                    this._p_displaytype = v;
                    break;
                default:
                    return;
            }
            this.on_apply_displaytype();
        }
    };

    _pDateRangePicker.on_apply_displaytype = function ()
    {
        if (this._control_element)
        {
            this._updateTabButtons();
            this._updatePicker();
            this._recalcLayout();
            this.on_apply_displaymonthcount();
            if (this._p_startdate)
                this.on_apply_startdate();
            this.on_apply_type();
            this._updateButtons();

            if (this._p_displaytype == "date" || this._p_displaytype == "datetime")
                this._changeTab("date");
            else
                this._changeTab("time");
        }
        if (this._headline)
            this._headline.set_displaytype(this._p_displaytype);
    };

    _pDateRangePicker.set_closebuttontext = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_closebuttontext != v)
        {
            this._p_closebuttontext = v;
            this.on_apply_closebuttontext();
        }
    };

    _pDateRangePicker.on_apply_closebuttontext = function ()
    {
        if (this._closebutton)
            this._closebutton.set_text(this._p_closebuttontext);
    };

    _pDateRangePicker.set_okbuttontext = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_okbuttontext != v)
        {
            this._p_okbuttontext = v;
            this.on_apply_okbuttontext();
        }
    };

    _pDateRangePicker.on_apply_okbuttontext = function ()
    {
        if (this._okbutton)
            this._okbutton.set_text(this._p_okbuttontext);
        this._updateButtons();
    };

    _pDateRangePicker.set_cancelbuttontext = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_cancelbuttontext != v)
        {
            this._p_cancelbuttontext = v;
            this.on_apply_cancelbuttontext();
        }
    };

    _pDateRangePicker.on_apply_cancelbuttontext = function ()
    {
        if (this._cancelbutton)
            this._cancelbutton.set_text(this._p_cancelbuttontext);
        this._updateButtons();
    };


    _pDateRangePicker.set_useheadline = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_useheadline != v)
        {
            this._p_useheadline = v;
            this.on_apply_useheadline();
        }
    };

    _pDateRangePicker.on_apply_useheadline = function ()
    {
        if (!this._control_element)
            return;

        this._updateHeadLine();
        this._updateButtons(true);
        this._recalcLayout();
    };

    _pDateRangePicker.set_tabbuttonheight = function (v)
    {
        v = parseInt(v);
        if (this._p_tabbuttonheight != v)
        {
            this._p_tabbuttonheight = v;
            this.on_apply_tabbuttonheight();
        }
    };

    _pDateRangePicker.on_apply_tabbuttonheight = function ()
    {
        if (!this._control_element)
            return;

        this._recalcLayout();
    };

    _pDateRangePicker.set_headlinesize = function (v)
    {
        if (this._p_headlinesize != v)
        {
            this._p_headlinesize = v;
            this.on_apply_headlinesize();
        }
    };

    _pDateRangePicker.on_apply_headlinesize = function ()
    {
        if (this._p_headlinesize)
        {
            var size = this._p_headlinesize.toString().split(" ");
            this._headlinewidth = size[0] ? parseInt(size[0]) : 150;
            this._headlineheight = (size[1]) ? parseInt(size[1]) : 80;
        }

        if (!this._control_element)
            return;

        this._recalcLayout();
    };

    _pDateRangePicker.set_closebuttonsize = function (v)
    {
        if (this._p_closebuttonsize != v)
        {
            this._p_closebuttonsize = v;
            this.on_apply_closebuttonsize();
        }
    };

    _pDateRangePicker.on_apply_closebuttonsize = function ()
    {
        if (!this._control_element)
            return;

        this._recalcLayout();
    };

    _pDateRangePicker.set_headlinedateformat = function (v)
    {
        if (this._p_headlinedateformat != v)
        {
            this._p_headlinedateformat = v;
            this.on_apply_headlinedateformat();
        }
    };

    _pDateRangePicker.on_apply_headlinedateformat = function ()
    {
        if (this._headline)
            this._headline.set_dateformat(this._p_headlinedateformat);
    };

    _pDateRangePicker.set_headlinetimeformat = function (v)
    {
        if (this._p_headlinetimeformat != v)
        {
            this._p_headlinetimeformat = v;
            this.on_apply_headlinetimeformat();
        }
    };

    _pDateRangePicker.on_apply_headlinetimeformat = function ()
    {
        if (this._headline)
            this._headline.set_timeformat(this._p_headlinetimeformat);
    };

    _pDateRangePicker.set_direction = function (v)
    {
        if (v)
            v = v.toLowerCase();

        if (this._p_direction != v)
        {
            switch (v)
            {
                case "horizontal":
                case "vertical":
                    this._p_direction = v;
                    break;
                default:
                    return;
            }

            this.on_apply_direction();
        }
    };

    _pDateRangePicker.on_apply_direction = function ()
    {
        if (this._datepicker_group)
            this._datepicker_group.set_direction(this._p_direction, true);
        if (this._timepicker_group)
            this._timepicker_group.set_direction(this._p_direction, true);
    };

    _pDateRangePicker.set_displaymonthcount = function (v)
    {
        v = parseInt(v);

        if (!v || v > 3)
            return;

        if (this._p_displaymonthcount != v)
        {
            this._p_displaymonthcount = v;
            this.on_apply_displaymonthcount();
        }
    };

    _pDateRangePicker.on_apply_displaymonthcount = function ()
    {
        if (this._datepicker_group)
            this._datepicker_group.set_displaymonthcount(this._p_displaymonthcount, true);
    };

    _pDateRangePicker.set_innerdataset = function (v)
    {
        if (typeof v != "string")
        {
            this.setInnerDataset(v);
            return;
        }

        if (this._p_innerdataset != v || (this._p_innerdataset && !this._innerdataset))
        {
            this._setInnerDatasetStr(v);
            this.on_apply_innerdataset(this._innerdataset);
        }
    };

    _pDateRangePicker.on_apply_innerdataset = function (ds)
    {
        if (ds)
            ds._setEventHandler("onvaluechanged", this._on_dataset_onvaluechanged, this);

        if (this._datepicker_group)
            this._datepicker_group.set_innerdataset(this._p_innerdataset, true);
    };


    _pDateRangePicker._setInnerDatasetStr = function (str)
    {
        if (!str)
        {
            this._innerdataset = null;
            this._p_innerdataset = "";
        }
        else
        {
            str = str.replace("@", "");
            this._innerdataset = this._findDataset(str);
            this._p_innerdataset = str;
        }
    };

    _pDateRangePicker.getInnerDataset = function ()
    {
        return this._innerdataset;
    };

    _pDateRangePicker.setInnerDataset = function (obj)
    {
        if (!obj)
        {
            this._innerdataset = null;
            this._p_innerdataset = "";
            this.on_apply_innerdataset(this._innerdataset);
        }
        else if (obj instanceof nexacro.Dataset)
        {
            this._innerdataset = obj;
            this._p_innerdataset = obj.id;
            this.on_apply_innerdataset(this._innerdataset);
        }
    };

    _pDateRangePicker.set_backgroundcolumn = function (v)
    {
        if (this._p_backgroundcolumn != v)
        {
            this._p_backgroundcolumn = v;
            this.on_apply_backgroundcolumn();
        }
    };

    _pDateRangePicker.on_apply_backgroundcolumn = function ()
    {
        if (this._datepicker_group)
            this._datepicker_group.set_backgroundcolumn(this._p_backgroundcolumn, true);
    };

    _pDateRangePicker.set_bordercolumn = function (v)
    {
        if (this._p_bordercolumn != v)
        {
            this._p_bordercolumn = v;
            this.on_apply_bordercolumn();
        }
    };

    _pDateRangePicker.on_apply_bordercolumn = function ()
    {
        if (this._datepicker_group)
            this._datepicker_group.set_bordercolumn(this._p_bordercolumn, true);
    };

    _pDateRangePicker.set_datecolumn = function (v)
    {
        if (this._p_datecolumn != v)
        {
            this._p_datecolumn = v;
            this.on_apply_datecolumn(v);
        }
    };

    _pDateRangePicker.on_apply_datecolumn = function ()
    {
        if (this._datepicker_group)
            this._datepicker_group.set_datecolumn(this._p_datecolumn, true);
    };

    _pDateRangePicker.set_textcolorcolumn = function (v)
    {
        if (this._p_textcolorcolumn != v)
        {
            this._p_textcolorcolumn = v;
            this.on_apply_textcolorcolumn(v);
        }
    };

    _pDateRangePicker.on_apply_textcolorcolumn = function ()
    {
        if (this._datepicker_group)
            this._datepicker_group.set_textcolorcolumn(this._p_textcolorcolumn, true);
    };

    _pDateRangePicker.set_hintingcolumn = function (v)
    {
        if (this._p_hintingcolumn != v)
        {
            this._p_hintingcolumn = v;
            this.on_apply_hintingcolumn(v);
        }
    };

    _pDateRangePicker.on_apply_hintingcolumn = function ()
    {
        if (this._datepicker_group)
            this._datepicker_group.set_hintingcolumn(this._p_hintingcolumn, true);
    };

    _pDateRangePicker.set_readonlycolumn = function (v)
    {
        if (this._p_readonlycolumn != v)
        {
            this._p_readonlycolumn = v;
            this.on_apply_readonlycolumn(v);
        }
    };

    _pDateRangePicker.on_apply_readonlycolumn = function ()
    {
        if (this._datepicker_group)
            this._datepicker_group.set_readonlycolumn(this._p_readonlycolumn, true);
    };

    _pDateRangePicker._getDateValue = function (date)
    {
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        var value = year + month + day;

        return value;
    };

    _pDateRangePicker._getTimeValue = function (date)
    {
        var hours = String(date.getHours()).padStart(2, '0');
        var minutes = String(date.getMinutes()).padStart(2, '0');
        var seconds = String(date.getSeconds()).padStart(2, '0');
        var milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        var value = hours + minutes + seconds + milliseconds;

        return value;
    };

    _pDateRangePicker.set_value = nexacro._emptyFn;
    _pDateRangePicker.on_apply_value = function ()
    {
        if (this._datepicker_group)
            this._datepicker_group._cancelSelectYearMonth();

        if (this._headline)
        {
            var obj;

            if (this._p_startdate)
            {
                obj = this._convValueToDateObj(this._p_startdate);
                this._headline.set_dateobj(obj.date, obj.time);
            }
            else
            {
                this._headline.set_dateobj(undefined, undefined);
            }

            if (this._p_enddate)
            {
                obj = this._convValueToDateObj(this._p_enddate);
                this._headline.set_enddateobj(obj.date, obj.time);
            }
            else
            {
                this._headline.set_enddateobj(undefined, undefined);
            }
        }
    };

    _pDateRangePicker._convValueToDateObj = function (value)
    {
        var date_str, time_str;
        var date, time;

        if (this._p_displaytype == "time")
        {
            time_str = value;
            if (value.length == 17)
                time_str = value.substr(8, 9);

            time = nexacro.DataUtils.toTime(time_str);
        }
        else if (this._p_displaytype == "datetime")
        {
            date_str = value.substr(0, 8);
            time_str = value.substr(8, 9);

            date = nexacro.DataUtils.toDate(date_str);
            time = nexacro.DataUtils.toTime(time_str);
        }
        else
        {
            date_str = value;
            if (value.length == 17)
                date_str = value.substr(0, 8);

            date = nexacro.DataUtils.toDate(date_str);
        }

        return { date: date, time: time };
    };

    _pDateRangePicker._convDisplayTypeValue = function (datestr)
    {
        var date, retn = { date: "", time: "" };

        if (datestr)
        {
            if (this._p_displaytype == "datetime")
            {
                if (datestr.length == 8)
                    datestr = datestr.padRight(17, "0");

                date = nexacro.DataUtils.toDateTime(datestr).toString();
                retn.date = date.substr(0, 8);
                retn.time = date.substr(8, 9);
            }
            else if (this._p_displaytype == "date")
            {
                var sdate = datestr;

                if (sdate.length == 17)
                    sdate = sdate.substr(0, 8);

                date = nexacro.DataUtils.toDate(sdate).toString();
                retn.date = date;
            }
            else if (this._p_displaytype == "time")
            {
                var sdate = datestr;

                if (sdate.length == 17)
                    sdate = sdate.substr(8, 9);

                date = nexacro.DataUtils.toTime(sdate).toString();
                retn.time = date;
            }
        }
        else
        {
            var curr = new nexacro.Date();

            if (this._p_displaytype == "datetime")
            {
                date = nexacro.DataUtils.toDateTime(curr.toString()).toString();
                retn.date = date.substr(0, 8);
                retn.time = "000000000";
            }
            else if (this._p_displaytype == "date")
            {
                curr._timecheck = false;
                date = nexacro.DataUtils.toDate(curr.toString()).toString();
                retn.date = date;
            }
            else if (this._p_displaytype == "time")
            {
                retn.time = "";
            }
        }
        return retn;
    };

    _pDateRangePicker._want_arrows = false;
    _pDateRangePicker._getDlgCode = function (keycode, altKey, ctrlKey/*, shiftKey*/)
    {
        var _want_arrows = this._want_arrows;

        if (ctrlKey == true)
            _want_arrows = true;

        return { want_tab: false, want_return: false, want_escape: false, want_chars: false, want_arrows: _want_arrows };
    };

    _pDateRangePicker.set_startdate = function (v)
    {
        if (this._p_startdate != v)
        {
            this._p_startdate = v;
            this.on_apply_startdate();
        }
    };

    _pDateRangePicker.on_apply_startdate = function ()
    {
        this._startdate = this._convDisplayTypeValue(this._p_startdate);

        this._invalid_startdate = "";
        this._invalid_enddate = "";

        if (this._enddate && this._startdate.date > this._enddate.date)
        {
            if (this._p_type == "range")
            {
                if (this._p_startdate && this._p_enddate && this._enddate.date < this._startdate.date)
                {
                    this._invalid_startdate = this._startdate.date;
                    this._invalid_enddate = this._enddate.date;
                }
                else if (!this._p_startdate && this._p_enddate)
                {
                    this._invalid_enddate = this._enddate.date;
                }
            }

            this._enddate.date = this._startdate.date;
        }
        if (this._p_enddate)
            this.on_apply_enddate();

        if (this._datepicker_group)
        {
            this._datepicker_group._setInvalidDate(this._invalid_startdate, this._invalid_enddate);

            if (this._p_startdate)
                this._datepicker_group.set_startdate(this._startdate.date, true);
            else
                this._datepicker_group.set_startdate("", true);
        }
        if (this._timepicker_group && this._p_startdate)
        {
            this._timepicker_group.set_startdate(this._startdate.time, true);
        }
    };

    _pDateRangePicker.set_enddate = function (v)
    {
        if (this._p_enddate != v)
        {
            this._p_enddate = v;
            this.on_apply_enddate();
        }
    };

    _pDateRangePicker.on_apply_enddate = function ()
    {
        if (this._p_type != "range")
        {
            this._p_value = this._p_startdate;
            this.on_apply_value();
            return;
        }

        this._enddate = this._convDisplayTypeValue(this._p_enddate);

        this._invalid_startdate = "";
        this._invalid_enddate = "";

        if (this._p_startdate && this._p_enddate && this._enddate.date < this._startdate.date)
        {
            this._invalid_enddate = this._enddate.date;
            this._invalid_startdate = this._startdate.date;
            this._enddate.date = this._startdate.date;
        }
        else if (!this._p_startdate && this._p_enddate)
        {
            this._invalid_enddate = this._enddate.date;
        }
        else if (!this._p_enddate)
        {
            this._enddate.date = this._startdate.date;
        }

        if (this._enddate.date < this._startdate.date)
            this._p_value = this._p_startdate + " " + this._p_enddate;
        else
            this._p_value = this._p_startdate + "-" + this._p_enddate;

        this.on_apply_value();

        if (this._datepicker_group)
        {
            this._datepicker_group._setInvalidDate(this._invalid_startdate, this._invalid_enddate);

            if (this._p_enddate)
                this._datepicker_group.set_enddate(this._enddate.date, true);
            else
                this._datepicker_group.set_enddate("", true);
        }
        if (this._timepicker_group)
        {
            this._timepicker_group.set_enddate(this._enddate.time, true);
        }
    };

    _pDateRangePicker.on_init_bindSource = function (columnid, propid, ds)
    {
        if (propid == "startdate" || propid == "enddate")
        {
            this["set_" + propid](undefined);
        }
    };

    _pDateRangePicker._isInvalidValue = function (v)
    {
        if (nexacro._isNull(v) || v === "")
            return false;

        var dateobj;
        if (v instanceof Date || v instanceof nexacro.Date)
            dateobj = v;
        else
            dateobj = nexacro.DataUtils.toDate(v);

        if (dateobj)
        {
            if (dateobj._isInvalidDate ? dateobj._isInvalidDate() : isNaN(dateobj.valueOf()))
                return true;

            var year = dateobj.getFullYear();
            if (year < 0 || year > 9999)
                return true;
        }

        return false;
    };

    _pDateRangePicker._convertValueType = function (v, dateobj, bapplyrule)
    {
        var ret, datatyperule;
        if (bapplyrule)
        {
            datatyperule = this._env._p_datatyperule;
            if (datatyperule == "1.0")
                return v;
        }

        ret = (dateobj === undefined || dateobj === null) ? dateobj : nexacro._toString(dateobj);

        return ret;
    };

    _pDateRangePicker.on_change_bindSource = function (propid, ds, row, col)
    {
        if (propid == "startdate" || propid == "enddate")
        {
            var v = ds.getColumn(row, col);

            /* 필요시 재검토
            var dateobj = typeof(v) == "string" ? nexacro.DataUtils.toDate(v) : v;

            if (dateobj)
            {
                if (!this._isInvalidValue(dateobj))
                {
                    v = this._convertValueType(v, dateobj, true);
                    this["set_" + propid](v);
                }
                else
                {
                    this["set_" + propid](v);
                }
            }
            else
            */
            {
                if (typeof (v) == "object")
                    v = this._convertValueType(v, v, true);

                this["set_" + propid](v);  // undefined, null, empty string
            }

            if (!this._p_parent._is_created) // 최초만 이동
                this.on_apply_rangeposition();
        }
    };

    _pDateRangePicker.on_getBindableProperties = function ()
    {
        return ["startdate", "enddate"];
    };

    _pDateRangePicker.on_notify_ontimechanged = function (obj, e)
    {
        var b_first_changed_start = false, b_first_changed_end = false;
        var kind = "";

        if (e.prestartdate != e.poststartdate)
        {
            if (!this._p_startdate)
                b_first_changed_start = true;

            this._startdate.time = e.poststartdate;
            kind = "start";
        }
        if (e.preenddate != e.postenddate)
        {
            if (!this._p_enddate)
                b_first_changed_end = true;

            this._enddate.time = e.postenddate;
            kind += "end";
        }

        if (!kind)
            return;

        this._confirmValue(kind);

        if (this._p_displaytype == "datetime")
        {
            if (b_first_changed_start || b_first_changed_end)   // date선택 없이 time만 먼저 하는 경우
            {
                if (this._datepicker_group)
                {
                    this._datepicker_group._is_set_startvalue = true;
                    this._datepicker_group._updateRangeDate();
                }
            }
        }
    };

    _pDateRangePicker._on_rangedate_change = function (prestartdate, poststartdate, preenddate, postenddate)
    {
        var retn;
        if (prestartdate != poststartdate)
            retn = this._on_date_change(prestartdate, poststartdate, "startdate");
        if (preenddate != postenddate)
            retn = this._on_date_change(preenddate, postenddate, "enddate") || retn;

        if (retn)
        {
            this.on_fire_onchanged(prestartdate, poststartdate, preenddate, postenddate);
            this._updateAccessibilityLabel();
        }
        return retn;
    };

    _pDateRangePicker._on_date_change = function (prevalue, postvalue, propname)
    {
        if (this._beginValueChange())
            return false;

        var ret = true;

        if (!this.applyto_bindSource(propname, postvalue))
        {
            ret = false;
        }

        if (!ret)
        {
            this["_p_" + propname] = prevalue;
            this["on_apply_" + propname]();
        }
        else
        {
            if (this["_p_" + propname] != prevalue && this["_p_" + propname] != postvalue)
                ret = false;
        }

        if (ret)
        {
            var prestartdate, poststartdate, preenddate, postenddate;

            this["set_" + propname](postvalue);

            if (propname == "startdate")
                this._default_startdate = prevalue;
            else
                this._default_enddate = prevalue;
        }

        this._finalValueChange();

        return ret;
    };

    _pDateRangePicker._beginValueChange = function ()
    {
        return !(this.__value_change ? false : this.__value_change = true);
    };

    _pDateRangePicker._finalValueChange = function ()
    {
        return !(this.__value_change = false);
    };

    _pDateRangePicker.set_maxdate = function (v)
    {
        if (this._p_maxdate != v)
        {
            this._p_maxdate = v;
            this.on_apply_maxdate();
        }
    };

    _pDateRangePicker.on_apply_maxdate = function ()
    {
        if (this._datepicker_group)
            this._datepicker_group.set_maxdate(this._p_maxdate);
    };

    _pDateRangePicker.set_mindate = function (v)
    {
        if (this._p_mindate != v)
        {
            this._p_mindate = v;
            this.on_apply_mindate();
        }
    };

    _pDateRangePicker.on_apply_mindate = function ()
    {
        if (this._datepicker_group)
            this._datepicker_group.set_mindate(this._p_mindate);
    };

    _pDateRangePicker.set_headlinestartdatenulltext = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_headlinestartdatenulltext != v)
        {
            this._p_headlinestartdatenulltext = v;
            this.on_apply_headlinestartdatenulltext();
        }
    };

    _pDateRangePicker.on_apply_headlinestartdatenulltext = function ()
    {
        if (this._headline)
            this._headline.set_startdatenulltext(this._getStringResourceProperty(this._p_headlinestartdatenulltext));
    };

    _pDateRangePicker.set_headlineenddatenulltext = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_headlineenddatenulltext != v)
        {
            this._p_headlineenddatenulltext = v;
            this.on_apply_headlineenddatenulltext();
        }
    };

    _pDateRangePicker.on_apply_headlineenddatenulltext = function ()
    {
        if (this._headline)
            this._headline.set_enddatenulltext(this._getStringResourceProperty(this._p_headlineenddatenulltext));
    };

    _pDateRangePicker.set_datetabbuttontext = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_datetabbuttontext != v)
        {
            this._p_datetabbuttontext = v;
            this.on_apply_datetabbuttontext();
        }
    };

    _pDateRangePicker.on_apply_datetabbuttontext = function ()
    {
        if (this._datetabbutton)
            this._datetabbutton.set_text(this._getStringResourceProperty(this._p_datetabbuttontext));
    };

    _pDateRangePicker.set_timetabbuttontext = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_timetabbuttontext != v)
        {
            this._p_timetabbuttontext = v;
            this.on_apply_timetabbuttontext();
        }
    };

    _pDateRangePicker.on_apply_timetabbuttontext = function ()
    {
        if (this._timetabbutton)
            this._timetabbutton.set_text(this._getStringResourceProperty(this._p_timetabbuttontext));
    };

    _pDateRangePicker.set_headlineposition = function (v)
    {
        if (v)
            v = v.toLowerCase();

        if (this._p_headlineposition != v)
        {
            switch (v)
            {
                case "top":
                case "left":
                    this._p_headlineposition = v;
                    break;
                default:
                    return;
            }
            this.on_apply_headlineposition();
        }
    };

    _pDateRangePicker.on_apply_headlineposition = function ()
    {
        this._recalcLayout();
    };

    _pDateRangePicker.set_readonly = function (v)
    {
        if (this._p_readonly != v)
        {
            this._p_readonly = v;
            this.on_apply_readonly();
        }
    };

    _pDateRangePicker.on_apply_readonly = function ()
    {
        if (this._datepicker_group)
            this._datepicker_group.set_readonly(this._p_readonly, true);
    };

    _pDateRangePicker.on_killfocus_basic_action = function (new_focus, new_refer_focus)
    {
        nexacro.Component.prototype.on_killfocus_basic_action.call(this, new_focus, new_refer_focus);

        if (this._datepicker_group)
            this._datepicker_group._initSelectOrder();
    };

    _pDateRangePicker.on_keydown_basic_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        if (ctrl_key && alt_key && (keycode == nexacro.Event.KEY_LEFT || keycode == nexacro.Event.KEY_RIGHT))
        {
            if (this._p_displaytype == "datetime")
            {
                var tab;
                (this._currenttab == "date") ? tab = "time" : tab = "date";
                this._changeTab(tab);
            }
        }
        else if (keycode == nexacro.Event.KEY_ENTER)
        {
            if (refer_comp instanceof nexacro._DatePickerDayItemControl || this._currenttab == "time" || this._p_displaytype == "time")
            {
                if (this._p_type != "range")
                    this.on_fire_oncloseup(this, true, true);
            }
        }
        else if (keycode == nexacro.Event.KEY_ESC)
        {
            this.on_fire_oncloseup(this, false, true);
        }
    };

    _pDateRangePicker.on_fire_sys_onslide = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        var ret = true;
        var parent = this._p_parent;
        if (parent instanceof nexacro.DateField)
            return true;
        else
            ret = nexacro.Component.prototype.on_fire_sys_onslide.call(this, elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp);
        return ret;
    };

    _pDateRangePicker.on_fire_sys_onfling = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        var ret = true;
        var parent = this._p_parent;
        if (parent instanceof nexacro.DateField)
            return true;
        else
            ret = nexacro.Component.prototype.on_fire_sys_onfling.call(this, elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp);
        return ret;
    };

    _pDateRangePicker._confirmValue = function (only)
    {
        var pre_startdate = this._p_startdate;
        var pre_enddate = this._p_enddate;

        if (this._p_displaytype == "datetime")
        {
            if (only != "end")
                this._p_startdate = this._startdate.date + this._startdate.time;

            if (only != "start")
            {
                if (!this._enddate.date)
                {
                    this._enddate.date = this._startdate.date;
                    this._p_enddate = "";
                }
                else
                {
                    this._p_enddate = this._enddate.date + (this._enddate.time ? this._enddate.time : "000000000");
                }
            }
        }
        else if (this._p_displaytype == "date")
        {
            if (only != "end")
                this._p_startdate = this._startdate.date;

            if (only != "start")
            {
                this._p_enddate = this._enddate.date;

                if (!this._enddate.date)
                {
                    this._enddate.date = this._startdate.date;
                    this._p_enddate = "";
                }
                else
                {
                    this._p_enddate = this._enddate.date + this._enddate.time;
                }
            }
        }
        else if (this._p_displaytype == "time")
        {
            if (only != "end")
                this._p_startdate = this._startdate.time;

            if (only != "start")
                this._p_enddate = this._enddate.time;
        }

        if (this._p_type == "range")
        {
            if (this._p_displaytype == "datetime" || this._p_displaytype == "date")
            {
                if (this._enddate.date < this._startdate.date)
                    this._p_value = this._p_startdate + " " + this._p_enddate;
                else
                    this._p_value = this._p_startdate + "-" + this._p_enddate;
            }
            else // time
            {
                if (this._enddate.time < this._startdate.time)
                    this._p_value = this._p_startdate + " " + this._p_enddate;
                else
                    this._p_value = this._p_startdate + "-" + this._p_enddate;
            }
        }
        else
        {
            this._p_value = this._p_startdate;
        }

        this.on_apply_value();

        if (!this._on_rangedate_change(pre_startdate, this._p_startdate, pre_enddate, this._p_enddate))
        {
            this._p_startdate = pre_startdate;
            this._p_enddate = pre_enddate;
            this.on_apply_value();
        }
    };

    _pDateRangePicker._on_focus = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        nexacro.Component.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);
        this._getGroup()._setFocus(false);
    };
    /*
    _pDateRangePicker._getCurrentDateValue = function ()
    {
        if (this._startdate && this._startdate.date)
            return this._startdate.date;     
    };
    */
    //==============================================================================
    // nexacro.PickerHeadLineControl
    //==============================================================================
    nexacro.PickerHeadLineControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pPickerHeadLineControl = nexacro._createPrototype(nexacro.Component, nexacro.PickerHeadLineControl);
    nexacro.PickerHeadLineControl.prototype = _pPickerHeadLineControl;

    _pPickerHeadLineControl._type_name = "PickerHeadLineControl";
    _pPickerHeadLineControl._p_displaytype = "date";

    _pPickerHeadLineControl._is_locale_control = true;
    _pPickerHeadLineControl._is_subcontrol = true;

    _pPickerHeadLineControl._p_userange = false;
    _pPickerHeadLineControl._p_dateformat = "";
    _pPickerHeadLineControl._p_timeformat = "";
    _pPickerHeadLineControl._p_startdatebutton = null;
    _pPickerHeadLineControl._p_enddatebutton = null;
    _pPickerHeadLineControl._p_startsubdatebutton = null;
    _pPickerHeadLineControl._p_endsubdatebutton = null;
    _pPickerHeadLineControl._p_enddatenulltext = "";

    _pPickerHeadLineControl._p_dateobj = null;
    _pPickerHeadLineControl._p_timeobj = null;
    _pPickerHeadLineControl._p_enddateobj = null;
    _pPickerHeadLineControl._p_endtimeobj = null;

    _pPickerHeadLineControl._default_locale_date_style = "MEDIUMDATE";
    _pPickerHeadLineControl._default_locale_time_style = "MEDIUMTIME";

    _pPickerHeadLineControl._default_startdate = "Start Date";
    _pPickerHeadLineControl._default_starttime = "Start Time";
    _pPickerHeadLineControl._default_enddate = "End Date";
    _pPickerHeadLineControl._default_endtime = "End Time";

    _pPickerHeadLineControl._splitline = null;

    _pPickerHeadLineControl.on_create_contents = function ()
    {
        this.on_apply_locale();
        this._updateStartButton(true);
        this._updateEndButton(true);
    };

    _pPickerHeadLineControl.on_created_contents = function (win)
    {
        if (this._p_startdatebutton)
            this._p_startdatebutton.on_created(win);
        if (this._p_startsubdatebutton)
            this._p_startsubdatebutton.on_created(win);
        if (this._p_enddatebutton)
            this._p_enddatebutton.on_created(win);
        if (this._p_endsubdatebutton)
            this._p_endsubdatebutton.on_created(win);
        if (this._splitline)
            this._splitline.on_created(win);
    };

    _pPickerHeadLineControl.on_create_contents_command = function ()
    {
        var str = "";

        if (this._p_startdatebutton)
            str += this._p_startdatebutton.createCommand();
        if (this._p_startsubdatebutton)
            str += this._p_startsubdatebutton.createCommand();
        if (this._p_enddatebutton)
            str += this._p_enddatebutton.createCommand();
        if (this._p_endsubdatebutton)
            str += this._p_endsubdatebutton.createCommand();
        if (this._splitline)
            str += this._splitline.createCommand();

        return str;
    };

    _pPickerHeadLineControl.on_attach_contents_handle = function (win)
    {
        if (this._p_startdatebutton)
        {
            this._p_startdatebutton.attachHandle(win);
            this._p_startdatebutton._setAccessibilityStatHidden(true);
        }
        if (this._p_startsubdatebutton)
        {
            this._p_startsubdatebutton.attachHandle(win);
            this._p_startsubdatebutton._setAccessibilityStatHidden(true);
        }
        if (this._p_enddatebutton)
        {
            this._p_enddatebutton.attachHandle(win);
            this._p_enddatebutton._setAccessibilityStatHidden(true);
        }
        if (this._p_endsubdatebutton)
        {
            this._p_endsubdatebutton.attachHandle(win);
            this._p_endsubdatebutton._setAccessibilityStatHidden(true);
        }
        if (this._splitline)
        {
            this._splitline.attachHandle(win);
            this._splitline._setAccessibilityStatHidden(true);
        }
    };

    _pPickerHeadLineControl.on_destroy_contents = function ()
    {
        this._p_dateobj = null;
        this._p_timeobj = null;
        this._p_enddateobj = null;
        this._p_endtimeobj = null;

        if (this._p_startdatebutton)
        {
            this._p_startdatebutton.destroy();
            this._p_startdatebutton = null;
        }
        if (this._p_startsubdatebutton)
        {
            this._p_startsubdatebutton.destroy();
            this._p_startsubdatebutton = null;
        }
        if (this._p_enddatebutton)
        {
            this._p_enddatebutton.destroy();
            this._p_enddatebutton = null;
        }
        if (this._p_endsubdatebutton)
        {
            this._p_endsubdatebutton.destroy();
            this._p_endsubdatebutton = null;
        }
        if (this._splitline)
        {
            this._splitline.destroy();
            this._splitline = null;
        }
    };

    _pPickerHeadLineControl._updateStartButton = function (create_only)
    {
        if (!this._control_element)
            return;

        if (this._p_displaytype.indexOf("date") >= 0 || this._p_displaytype == "time")
        {
            if (!this._p_startdatebutton)
            {
                var startdatebutton = this._p_startdatebutton = new nexacro.Button("startdate", 0, 0, 0, 0, null, null, null, null, null, null, this);
                startdatebutton._setControl();
                startdatebutton.createComponent(create_only);

                if (this._testline)
                    startdatebutton.set_border("1px dotted red");
            }
        }
        else
        {
            if (this._p_startdatebutton)
            {
                this._p_startdatebutton.destroy();
                this._p_startdatebutton = null;
            }
        }

        if (this._p_displaytype == "datetime")
        {
            if (!this._p_startsubdatebutton)
            {
                var startsubdatebutton = this._p_startsubdatebutton = new nexacro.Button("startsubdate", 0, 0, 0, 0, null, null, null, null, null, null, this);
                startsubdatebutton._setControl();
                startsubdatebutton.createComponent(create_only);

                if (this._testline)
                    startsubdatebutton.set_border("1px dotted red");
            }
        }
        else
        {
            if (this._p_startsubdatebutton)
            {
                this._p_startsubdatebutton.destroy();
                this._p_startsubdatebutton = null;
            }
        }
    };


    _pPickerHeadLineControl._updateEndButton = function (create_only)
    {
        if (!this._control_element)
            return;

        if (this._p_userange)
        {
            if (!this._p_enddatebutton)
            {
                var enddatebutton = this._p_enddatebutton = new nexacro.Button("enddate", 0, 0, 0, 0, null, null, null, null, null, null, this);
                enddatebutton._setControl();
                enddatebutton.createComponent(create_only);

                if (this._testline)
                    enddatebutton.set_border("1px dotted red");
            }

            if (this._p_displaytype == "datetime")
            {
                if (!this._p_endsubdatebutton)
                {
                    var endsubdatebutton = this._p_endsubdatebutton = new nexacro.Button("endsubdate", 0, 0, 0, 0, null, null, null, null, null, null, this);
                    endsubdatebutton._setControl();
                    endsubdatebutton.createComponent(create_only);

                    if (this._testline)
                        endsubdatebutton.set_border("1px dotted red");
                }
            }
            else
            {
                if (this._p_endsubdatebutton)
                {
                    this._p_endsubdatebutton.destroy();
                    this._p_endsubdatebutton = null;
                }
            }

            if (!this._splitline)
            {
                var splitline = this._splitline = new nexacro.DatePickerSplitLine("splitline", 0, 0, 0, 0, null, null, null, null, null, null, this);
                splitline._is_nc_control = false;
                splitline.createComponent(create_only);
            }
        }
        else
        {
            this._destroyEndButton();

            if (this._splitline)
            {
                this._splitline.destroy();
                this._splitline = null;
            }
        }
    };

    _pPickerHeadLineControl._destroyEndButton = function ()
    {
        if (this._p_enddatebutton)
        {
            this._p_enddatebutton.destroy();
            this._p_enddatebutton = null;
        }
        if (this._p_endsubdatebutton)
        {
            this._p_endsubdatebutton.destroy();
            this._p_endsubdatebutton = null;
        }
    };

    _pPickerHeadLineControl.on_apply_prop_enable = function (v)
    {
        v = (v != null) ? v : this._isEnable();

        if (this._p_startdatebutton)
        {
            this._p_startdatebutton._setEnable(v);
        }
        if (this._p_startsubdatebutton)
        {
            this._p_startsubdatebutton._setEnable(v);
        }
        if (this._p_enddatebutton)
        {
            this._p_enddatebutton._setEnable(v);
        }
        if (this._p_endsubdatebutton)
        {
            this._p_endsubdatebutton._setEnable(v);
        }
    };

    _pPickerHeadLineControl.set_startdatenulltext = function (v)
    {
        if (this._p_startdatenulltext != v)
        {
            this._p_startdatenulltext = v;
            this.on_apply_startdatenulltext();
        }
    };

    _pPickerHeadLineControl.on_apply_startdatenulltext = function ()
    {
        this.on_apply_dateobj();
    };

    _pPickerHeadLineControl.set_enddatenulltext = function (v)
    {
        if (this._p_enddatenulltext != v)
        {
            this._p_enddatenulltext = v;
            this.on_apply_enddatenulltext();
        }
    };

    _pPickerHeadLineControl.on_apply_enddatenulltext = function ()
    {
        this.on_apply_dateobj();
    };

    _pPickerHeadLineControl.set_dateformat = function (v)
    {
        if (this._p_dateformat != v)
        {
            this._p_dateformat = v;
            this.on_apply_dateformat();
        }
    };

    _pPickerHeadLineControl.on_apply_dateformat = function ()
    {
        this.on_apply_dateobj();
    };

    _pPickerHeadLineControl.set_timeformat = function (v)
    {
        if (this._p_timeformat != v)
        {
            this._p_timeformat = v;
            this.on_apply_timeformat();
        }
    };

    _pPickerHeadLineControl.on_apply_timeformat = function ()
    {
        this.on_apply_dateobj();
    };

    _pPickerHeadLineControl.set_displaytype = function (v)
    {
        if (this._p_displaytype != v)
        {
            switch (v)
            {
                case "date":
                case "datetime":
                case "time":
                    this._p_displaytype = v;
                    break;
                default:
                    return;
            }

            this.on_apply_displaytype();
        }
    };

    _pPickerHeadLineControl.on_apply_displaytype = function ()
    {
        this._updateStartButton();
        this._updateEndButton();
        this.on_apply_dateobj();
    };

    _pPickerHeadLineControl.set_userange = function (v)
    {
        if (this._p_userange != v)
        {
            this._p_userange = v;
            this.on_apply_userange();
        }
    };

    _pPickerHeadLineControl.on_apply_userange = function ()
    {
        this._updateEndButton();
        this.on_apply_dateobj();
    };

    _pPickerHeadLineControl.set_locale = function (v)
    {
        if (this._p_locale != v)
        {
            this._p_locale = v;
            this.on_apply_locale();
        }
    };

    _pPickerHeadLineControl.on_apply_locale = function ()
    {
        this._locale = "";
        this._locale = this._p_locale ? this._p_locale : this._getLocale();
        this.on_apply_dateobj();
    };

    _pPickerHeadLineControl.set_dateobj = function (date, time)
    {
        this._p_dateobj = date;
        this._p_timeobj = time;
        this.on_apply_dateobj();
    };

    _pPickerHeadLineControl.set_enddateobj = function (date, time)
    {
        this._p_enddateobj = date;
        this._p_endtimeobj = time;
        this.on_apply_dateobj(true);
    };

    _pPickerHeadLineControl.on_apply_dateobj = function (is_end)
    {
        if (!this._control_element)
            return;

        if (!this._locale)
            this.on_apply_locale();

        var dateobj = is_end ? this._p_enddateobj : this._p_dateobj;
        var timeobj = is_end ? this._p_endtimeobj : this._p_timeobj;
        var dateformat, timeformat;
        var locale_dateformat, locale_timeformat;

        switch (this._p_dateformat)
        {
            case "SHORTDATE":
            case "MEDIUMDATE":
            case "LONGDATE":
            case "FULLDATE":
                locale_dateformat = this._p_dateformat;
                break;
            default:
                dateformat = this._p_dateformat;
                break;
        }

        switch (this._p_timeformat)
        {
            case "SHORTTIME":
            case "MEDIUMTIME":
                locale_timeformat = this._p_timeformat;
                break;
            default:
                timeformat = this._p_timeformat;
                break;
        }

        var op, datetext = "", timetext = "", format;

        if (this._p_displaytype.indexOf("date") >= 0)
        {
            if (dateobj)
            {
                if (dateobj != "Invalid Date")
                {
                    if (dateformat)
                    {
                        format = dateformat;
                        datetext = dateobj._getLocaleFormatString2(this._locale, format);
                    }
                    else
                    {
                        if (!locale_dateformat)
                            locale_dateformat = this._default_locale_date_style;

                        format = nexacro.Locale._makeDateMaskStringFromIntl(this._locale, locale_dateformat);
                        datetext = dateobj._getLocaleFormatString2(this._locale, format);
                    }
                }
                else
                {
                    datetext = "Invalid Date";
                }
            }
        }

        if (this._p_displaytype.indexOf("time") >= 0)
        {
            //if (!timeobj && this._p_displaytype == "time")
            //timeobj = nexacro.DataUtils.toTime("000000000");

            if (timeobj)
            {
                if (timeobj != "Invalid Date")
                {
                    if (timeformat)
                    {
                        format = timeformat;
                        timetext = timeobj._getLocaleFormatString2(this._locale, format);
                    }
                    else
                    {
                        if (!locale_timeformat)
                            locale_timeformat = this._default_locale_time_style;

                        format = nexacro.Locale._makeTimeMaskStringFromIntl(this._locale, locale_timeformat);
                        timetext = timeobj._getLocaleFormatString2(this._locale, format);
                    }
                }
                else
                {
                    timetext = "Invalid Time";
                }
            }
        }
        datetext = datetext.trim();
        timetext = timetext.trim();

        if (this._p_userange == false)
        {
            this._end_date_text = "";
            this._end_time_text = "";
        }

        if (is_end)
        {
            this._end_date_text = datetext ? datetext : (this._p_enddatenulltext ? this._p_enddatenulltext : this._default_enddate);
            this._end_time_text = timetext ? timetext : (this._p_enddatenulltext ? this._p_enddatenulltext : this._default_endtime);
        }
        else
        {
            this._start_date_text = datetext ? datetext : (this._p_startdatenulltext ? this._p_startdatenulltext : this._default_startdate);
            this._start_time_text = timetext ? timetext : (this._p_startdatenulltext ? this._p_startdatenulltext : this._default_starttime);
        }

        this._updateAll();

        if (!is_end && this._p_userange)
            this.on_apply_dateobj(true);
    };

    _pPickerHeadLineControl._testline = 0;
    _pPickerHeadLineControl._updateAll = function ()
    {
        if (!this._p_startdatebutton && !this._p_startsubdatebutton)
            return;

        var sdatetext = this._start_date_text;
        var edatetext = this._end_date_text;
        var stimetext = this._start_time_text;
        var etimetext = this._end_time_text;
        var s, t = 0, w = this._getClientWidth(), h = this._getClientHeight();
        var is_landscape = false;

        if (w < h) // landscape
            is_landscape = true;

        if (this._splitline)
        {
            if (is_landscape)
            {
                this._splitline._setDirection(true);
                var border = this._splitline._getCurrentStyleBorder();
                var border_w = border ? border.top._width : 0;

                this._splitline.move(0, h / 2 - border_w, w, border_w);
            }
            else
            {
                this._splitline._setDirection(false);
                var border = this._splitline._getCurrentStyleBorder();
                var border_w = border ? border.right._width : 0;

                this._splitline.move(w / 2 - border_w, 0, border_w, h);
            }
        }

        if (this._p_displaytype == "date" || this._p_displaytype == "time")
        {
            if (this._p_displaytype == "time")
            {
                sdatetext = stimetext;
                edatetext = etimetext;
            }

            this._p_startdatebutton.set_text(sdatetext);

            if (this._p_startsubdatebutton)
                this._p_startsubdatebutton.set_visible(false);
            if (this._p_endsubdatebutton)
                this._p_endsubdatebutton.set_visible(false);

            if (is_landscape)
                t = 0;

            if (this._p_enddatebutton)
            {
                if (is_landscape)
                    this._p_startdatebutton.move(0, t, w, h / 2);
                else
                    this._p_startdatebutton.move(0, t, w / 2, h);

                //                if ((this._p_enddateobj < this._p_dateobj) || (this._p_enddateobj && !this._p_dateobj))
                //                    this._p_enddatebutton.set_text("Invalid period");
                //                else
                this._p_enddatebutton.set_text(edatetext);

                if (is_landscape)
                    this._p_enddatebutton.move(0, h / 2, w, h / 2);
                else
                    this._p_enddatebutton.move(this._p_startdatebutton._adjust_width, t, w / 2, h);
            }
            else
            {
                //if (is_landscape)
                this._p_startdatebutton.move(0, t, w, h);
                //else
                //   this._p_startdatebutton.move(0, t, w, h);
            }
        }
        else if (this._p_displaytype == "datetime")
        {
            this._p_startdatebutton.set_text(sdatetext);
            this._p_startsubdatebutton.set_text(stimetext);

            if (stimetext == this._default_starttime || stimetext == this._p_startdatenulltext)
                this._p_startsubdatebutton.set_visible(false);
            else
                this._p_startsubdatebutton.set_visible(true);

            if (this._p_userange)
            {
                if (is_landscape)
                {
                    if (this._p_startsubdatebutton._p_visible)
                    {
                        this._p_startdatebutton.move(0, t, w, h / 4);
                        this._p_startsubdatebutton.move(0, t + this._p_startdatebutton._adjust_height, w, this._p_startdatebutton._adjust_height);
                    }
                    else
                    {
                        this._p_startdatebutton.move(0, t, w, h / 2);
                    }
                }
                else
                {
                    if (this._p_startsubdatebutton._p_visible)
                    {
                        this._p_startdatebutton.move(0, t, w / 2, h / 2);
                        this._p_startsubdatebutton.move(0, t + this._p_startdatebutton._adjust_height, w / 2, this._p_startdatebutton._adjust_height);
                    }
                    else
                    {
                        this._p_startdatebutton.move(0, t, w / 2, h);
                    }
                }

                this._p_enddatebutton.set_text(edatetext);
                this._p_endsubdatebutton.set_text(etimetext);

                if (etimetext == this._default_endtime || etimetext == this._p_enddatenulltext)
                    this._p_endsubdatebutton.set_visible(false);
                else
                    this._p_endsubdatebutton.set_visible(true);

                if (is_landscape)
                {
                    if (this._p_endsubdatebutton._p_visible)
                    {
                        this._p_enddatebutton.move(0, h / 2, w, h / 4);
                        this._p_endsubdatebutton.move(0, h / 2 + this._p_enddatebutton._adjust_height, w, this._p_enddatebutton._adjust_height);
                    }
                    else
                    {
                        this._p_enddatebutton.move(0, h / 2, w, h / 2);
                    }
                }
                else
                {
                    if (this._p_endsubdatebutton._p_visible)
                    {
                        this._p_enddatebutton.move(this._p_startdatebutton._adjust_width, t, w / 2, h / 2);
                        this._p_endsubdatebutton.move(this._p_startdatebutton._adjust_width, t + this._p_enddatebutton._adjust_height, w / 2, this._p_enddatebutton._adjust_height);
                    }
                    else
                    {
                        this._p_enddatebutton.move(this._p_startdatebutton._adjust_width, t, w / 2, h);
                    }
                }
            }
            else
            {
                if (this._p_startsubdatebutton.visible)
                {
                    this._p_startdatebutton.move(0, t, w, h / 2);
                    this._p_startsubdatebutton.move(0, t + this._p_startdatebutton._adjust_height, w, this._p_startdatebutton._adjust_height);
                }
                else
                {
                    this._p_startdatebutton.move(0, t, w, h);
                }
            }
        }
    };

    _pPickerHeadLineControl.on_change_containerRect = function (width, height)
    {
        this._updateAll();
    };


    //==============================================================================
    // nexacro.PickerGroup
    //==============================================================================
    nexacro.PickerGroup = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)

        this._picker_ctrl_list = [];
        this._split_line_list = [];
        this._range = { start: null, end: null };
    };

    var _pPickerGroup = nexacro._createPrototype(nexacro.Component, nexacro.PickerGroup);
    nexacro.PickerGroup.prototype = _pPickerGroup;

    _pPickerGroup._event_list["onchanged"] = 1;
    _pPickerGroup._event_list["oninnerdatachanged"] = 1;

    _pPickerGroup._use_readonly_status = true;

    _pPickerGroup._p_type = "range";
    _pPickerGroup._p_displaymonthcount = 1;
    _pPickerGroup._p_startdate = null;
    _pPickerGroup._p_enddate = null;
    _pPickerGroup._p_maxdate = null;
    _pPickerGroup._p_mindate = null;
    _pPickerGroup._p_direction = "horizontal";
    _pPickerGroup._p_innerdataset = null;
    _pPickerGroup._p_backgroundcolumn = "";
    _pPickerGroup._p_bordercolumn = "";
    _pPickerGroup._p_datecolumn = "";
    _pPickerGroup._p_textcolorcolumn = "";
    _pPickerGroup._p_hintingcolumn = "";
    _pPickerGroup._p_readonlycolumn = "";

    _pPickerGroup._invalid_startdate = "";
    _pPickerGroup._invalid_enddate = "";
    _pPickerGroup._curr_picker = null;
    _pPickerGroup._prev_picker = null;

    _pPickerGroup._innerdataset = null;
    _pPickerGroup._comptype = { proto: "", id: "" };

    _pPickerGroup._getPickerCount = function ()
    {
        return 1;
    };

    _pPickerGroup._getRangePicker = function ()
    {
        return this.parent;
    };

    _pPickerGroup._on_focus = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        nexacro.Component.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);

        if (this._curr_picker)
            this._curr_picker._setFocus(false);
    };

    _pPickerGroup._setCurrentPicker = function (refer_comp)
    {
        while (refer_comp)
        {
            if (refer_comp instanceof nexacro.DatePickerControl ||
                refer_comp instanceof nexacro.TimePickerControl)
            {
                if (this._curr_picker != refer_comp)
                {
                    this._prev_picker = this._curr_picker;
                    this._curr_picker = refer_comp;
                }
                break;
            }
            refer_comp = refer_comp._p_parent;
        }
    };

    _pPickerGroup._getCurrentPicker = function ()
    {
        return this._curr_picker;
    };

    _pPickerGroup._updatePickers = function (create_only)
    {
        var picker_cnt = this._getPickerCount();
        if (picker_cnt > 0)
        {
            var picker_list = this._picker_ctrl_list;
            if (!picker_list || picker_list.length < 1 || (picker_cnt != picker_list.length))
            {
                if (picker_list)
                {
                    this._destroyPickers();
                }

                picker_list = [];

                var control;
                var proto = this._comptype.proto;
                var id = this._comptype.id;

                for (var i = 0; i < picker_cnt; i++)
                {
                    control = new nexacro[proto](id + "_" + i, 0, 0, 0, 0, null, null, null, null, null, null, this);
                    this._setPickerCreateInfo(control);
                    control.createComponent(create_only);

                    picker_list.push(control);

                    if (i == 0)
                        this._curr_picker = control;
                }

                this._picker_ctrl_list = picker_list;
            }
        }

        if (!create_only)
        {
            this._setChildEventHandler();
        }
    };

    _pPickerGroup._getSplitCount = function ()
    {
        return 0;
    };

    _pPickerGroup._updateSplitLines = function ()
    {
        var split_line_cnt = this._getSplitCount();
        if (split_line_cnt > 0)
        {
            if (this._split_line_list)
            {
                this._destroySplits();
            }

            var split_line, split_line_list = [];
            for (var i = 0; i < split_line_cnt; i++)
            {
                split_line = new nexacro.DatePickerSplitLine("splitline_" + i, 0, 0, 0, 0, null, null, null, null, null, null, this);
                split_line.createComponent();

                split_line_list.push(split_line);
            }

            this._split_line_list = split_line_list;
            split_line_list = null;
        }
    };

    _pPickerGroup._setPickerCreateInfo = function () { };

    _pPickerGroup._destroyPickers = function ()
    {
        var list = this._picker_ctrl_list;

        for (var i = 0; i < list.length; i++)
        {
            list[i].destroy();
        }
        this._picker_ctrl_list = null;
    };

    _pPickerGroup._destroySplits = function ()
    {
        var list = this._split_line_list;
        var i;

        for (i = 0; i < list.length; i++)
        {
            list[i].destroy();
        }
        this._split_line_list = null;
    };

    _pPickerGroup.on_create_contents = function ()
    {
        this._updatePickers(true);
        this.on_apply_locale();
        this.on_apply_direction();
    };

    _pPickerGroup.on_created_contents = function (win)
    {
        var list = this._picker_ctrl_list;

        for (var i = 0; i < list.length; i++)
            list[i].on_created(win);
    };

    _pPickerGroup.on_create_contents_command = function ()
    {
        var str = "";
        var list = this._picker_ctrl_list;

        for (var i = 0; i < list.length; i++)
            str += list[i].createCommand();

        return str;
    };

    _pPickerGroup.on_attach_contents_handle = function (win)
    {
        var list = this._picker_ctrl_list;

        for (var i = 0; i < list.length; i++)
        {
            list[i].attachHandle(win);
            list[i]._setAccessibilityStatHidden(true);
        }
    };

    _pPickerGroup.on_destroy_contents = function ()
    {
        this._destroyPickers();
        this._destroySplits();
        this._curr_picker = null;
        this._prev_picker = null;
    };

    _pPickerGroup._setChildEventHandler = function () { };

    _pPickerGroup.set_type = function (v, _force)
    {
        if (v)
            v = v.toLowerCase();

        if (_force || this._p_type != v)
        {
            switch (v)
            {
                case "single":
                case "range":
                    this._p_type = v;
                    break;
                default:
                    return;
            }

            this.on_apply_type();
        }
    };

    _pPickerGroup.on_apply_type = function () { };

    _pPickerGroup.set_startdate = function (v, _force)
    {
        if (_force || this._p_startdate != v)
        {
            this._p_startdate = v;
            this.on_apply_startdate();
        }
    };

    _pPickerGroup.on_apply_startdate = function () { };

    _pPickerGroup.set_enddate = function (v, _force)
    {
        if (_force || this._p_enddate != v)
        {
            this._p_enddate = v;
            this.on_apply_enddate();
        }
    };

    _pPickerGroup.on_apply_enddate = function () { };

    _pPickerGroup.set_maxdate = function (v)
    {
        if (this._p_maxdate != v)
        {
            this._p_maxdate = v;
            this.on_apply_maxdate();
        }
    };

    _pPickerGroup.on_apply_maxdate = function () { };

    _pPickerGroup.set_mindate = function (v)
    {
        if (this._p_mindate != v)
        {
            this._p_mindate = v;
            this.on_apply_mindate();
        }
    };

    _pPickerGroup.on_apply_mindate = function () { };

    _pPickerGroup.set_readonly = function (v, _force)
    {
        if (_force || this._p_readonly != v)
        {
            this._p_readonly = v;
            this.on_apply_readonly();
        }
    };

    _pPickerGroup.on_apply_readonly = function ()
    {
        var list = this._picker_ctrl_list;

        for (var i = 0; i < list.length; i++)
        {
            list[i].set_readonly(this._p_readonly);
        }
    };

    _pPickerGroup.set_direction = function (v, _force)
    {
        if (_force || this._p_direction != v)
        {
            this._p_direction = v;
            this.on_apply_direction();
        }
    };

    _pPickerGroup.on_apply_direction = function ()
    {
        this._recalcLayout();
    };

    _pPickerGroup.on_keydown_basic_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        if (!alt_key && (keycode == nexacro.Event.KEY_LEFT || keycode == nexacro.Event.KEY_RIGHT ||
            keycode == nexacro.Event.KEY_UP || keycode == nexacro.Event.KEY_DOWN ||
            keycode == nexacro.Event.KEY_HOME || keycode == nexacro.Event.KEY_END ||
            keycode == nexacro.Event.KEY_PAGE_UP || keycode == nexacro.Event.KEY_PAGE_DOWN ||
            keycode == nexacro.Event.KEY_SPACE || keycode == nexacro.Event.KEY_ENTER))
        {
            if (this._goBackCurrentFocus())
                return;

            var picker = this._getCurrentPicker();

            if (picker)
                picker._keyAction({ keycode: keycode, ctrlkey: ctrl_key, altkey: alt_key });
        }
    };

    _pPickerGroup._goBackCurrentFocus = function () { };

    _pPickerGroup.on_fire_onchanged = function (prestartdate, poststartdate, preenddate, postenddate)
    {
        if (this.onchanged && this.onchanged._has_handlers)
        {
            var evt = new nexacro.RangeDateChangedEventInfo(this, "onchanged", prestartdate, poststartdate, preenddate, postenddate);
            return this.onchanged._fireEvent(this, evt);
        }
    };

    _pPickerGroup.getInnerDataset = function ()
    {
        return this._innerdataset;
    };

    _pPickerGroup._setInnerDatasetStr = function (str)
    {
        this._removeEventHandlerToInnerDataset();

        if (!str)
        {
            this._innerdataset = null;
            this._p_innerdataset = "";
        }
        else
        {
            str = str.replace("@", "");
            this._innerdataset = this._findDataset(str);
            this._p_innerdataset = str;
        }
    };

    _pPickerGroup.setInnerDataset = function (obj)
    {
        this._removeEventHandlerToInnerDataset();

        if (!obj)
        {
            this._innerdataset = null;
            this._p_innerdataset = "";
            this.on_apply_innerdataset(this._innerdataset);
        }
        else if (obj instanceof nexacro.Dataset)
        {
            this._innerdataset = obj;
            this._p_innerdataset = obj.id;
            this.on_apply_innerdataset(this._innerdataset);
        }
    };

    _pPickerGroup.set_innerdataset = function (v, _force)
    {
        if (typeof v != "string")
        {
            this.setInnerDataset(v);
            return;
        }

        if (_force || this._p_innerdataset != v || (this._p_innerdataset && !this._innerdataset))
        {
            this._setInnerDatasetStr(v);
            this.on_apply_innerdataset(this._innerdataset);
        }
    };

    _pPickerGroup.on_apply_innerdataset = function (ds)
    {
        if (ds)
        {
            ds._setEventHandler("onvaluechanged", this._on_dataset_onvaluechanged, this);
            ds._setEventHandler("onrowsetchanged", this._on_dataset_onrowsetchanged, this);
        }
    };

    _pPickerGroup.on_apply_prop_enable = function (v)
    {
        v = (v != null) ? v : this._isEnable();

        var list = this._picker_ctrl_list;

        for (var i = 0; i < list.length; i++)
        {
            list[i]._setEnable(v);
        }
    };

    _pPickerGroup.set_backgroundcolumn = function (v, _force)
    {
        if (_force || this._p_backgroundcolumn != v)
        {
            this._p_backgroundcolumn = v;
            this.on_apply_backgroundcolumn();
        }
    };

    _pPickerGroup.on_apply_backgroundcolumn = function () { };

    _pPickerGroup.set_bordercolumn = function (v, _force)
    {
        if (_force || this._p_bordercolumn != v)
        {
            this._p_bordercolumn = v;
            this.on_apply_bordercolumn();
        }
    };

    _pPickerGroup.on_apply_bordercolumn = function () { };

    _pPickerGroup.set_datecolumn = function (v, _force)
    {
        if (_force || this._p_datecolumn != v)
        {
            this._p_datecolumn = v;
            this.on_apply_datecolumn(v);
        }
    };

    _pPickerGroup.on_apply_datecolumn = function () { };

    _pPickerGroup.set_textcolorcolumn = function (v, _force)
    {
        if (_force || this._p_textcolorcolumn != v)
        {
            this._p_textcolorcolumn = v;
            this.on_apply_textcolorcolumn(v);
        }
    };

    _pPickerGroup.on_apply_textcolorcolumn = function () { };

    _pPickerGroup.set_hintingcolumn = function (v, _force)
    {
        if (_force || this._p_hintingcolumn != v)
        {
            this._p_hintingcolumn = v;
            this.on_apply_hintingcolumn(v);
        }
    };

    _pPickerGroup.on_apply_hintingcolumn = function () { };

    _pPickerGroup.set_readonlycolumn = function (v, _force)
    {
        if (_force || this._p_readonlycolumn != v)
        {
            this._p_readonlycolumn = v;
            this.on_apply_readonlycolumn(v);
        }
    };

    _pPickerGroup.on_apply_readonlycolumn = function () { };

    _pPickerGroup._removeEventHandlerToInnerDataset = function ()
    {
        if (this._innerdataset)
        {
            this._innerdataset._removeEventHandler("onvaluechanged", this._on_dataset_onvaluechanged, this);
            this._innerdataset._removeEventHandler("onrowsetchanged", this._on_dataset_onrowsetchanged, this);
            this._innerdataset = null;
        }
    };

    _pPickerGroup._on_dataset_onvaluechanged = function () { };
    _pPickerGroup._on_dataset_onrowsetchanged = function () { };

    _pPickerGroup.on_lbuttondown_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        nexacro.Component.prototype.on_lbuttondown_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
        this._common_down_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
    };

    _pPickerGroup.on_touch_lbuttondown_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, fire_comp, refer_comp, meta_key)
    {
        nexacro.Component.prototype.on_touch_lbuttondown_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
        this._common_down_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
    };

    _pPickerGroup.on_touchstart_basic_action = function (touch_manager, touchinfos, changedtouchinfos, refer_comp)
    {
        nexacro.Component.prototype.on_touchstart_basic_action.call(this, touch_manager, touchinfos, changedtouchinfos, refer_comp);

        var touchinfo = nexacro._getFirstTouchInfo(changedtouchinfos);
        this._common_down_action(touchinfo.target, "touch", false, false, false, touchinfo.canvasx, touchinfo.canvasy, touchinfo.screenx, touchinfo.screeny, refer_comp);
    };

    _pPickerGroup._common_down_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        this._setCurrentPicker(refer_comp);
    };

    _pPickerGroup.on_fire_oninnerdatachanged = function (obj, oldvalue, newvalue, columnid, col, row)
    {
        if (this.oninnerdatachanged && this.oninnerdatachanged._has_handlers)
        {
            var evt = new nexacro.InnerdataChangedEventInfo(obj, "oninnerdatachanged", oldvalue, newvalue, columnid, col, row);
            return this.oninnerdatachanged._fireEvent(this, evt);
        }

        return true;
    };

    _pPickerGroup.on_fire_user_onkeydown = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key) // datepicker
    {
        if (from_comp instanceof nexacro._DatePickerBodyControl
            && (from_refer_comp instanceof nexacro._DatePickerBodyControl || from_refer_comp instanceof nexacro._DatePickerDayItemControl))
            return this._p_parent.on_fire_user_onkeydown(key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key);
    };

    //==============================================================================
    // nexacro.DatePickerGroup
    //==============================================================================
    nexacro.DatePickerGroup = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.PickerGroup.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)

        this._picker_ctrl_list = [];
        this._split_line_list = [];

        function setPicker(picker, is_vert)
        {
            this.picker = picker;
            if (!is_vert)
                picker.set_left(this.beg);
            else
                picker.set_top(this.beg);
        }

        this._slot = {
            prev: { beg: 0, end: 0, picker: null, setPicker: setPicker },
            show: {
                beg: 0, end: 0, pickerarr: [], addPicker: function (picker, b_first, is_vert)
                {
                    var arr = this.pickerarr;

                    if (b_first)
                    {
                        arr.unshift(picker);
                        arr.pop();
                    }
                    else
                    {
                        arr.push(picker);
                        arr.shift();
                    }

                    if (!is_vert)
                    {
                        var w = 0;
                        var width = (this.end - this.beg) / arr.length;

                        for (var i = 0; i < arr.length; i++)
                        {
                            arr[i].set_left(this.beg + w);
                            w += width;
                        }
                    }
                    else
                    {
                        var h = 0;
                        var height = (this.end - this.beg) / arr.length;

                        for (var i = 0; i < arr.length; i++)
                        {
                            arr[i].set_top(this.beg + h);
                            h += height;
                        }
                    }
                }
            },
            next: { beg: 0, end: 0, picker: null, setPicker: setPicker },
        };

        var date, curr = new nexacro.Date();
        curr._timecheck = false;
        date = nexacro.DataUtils.toDate(curr.toString());

        this._range = { start: date, end: date };
        this._startdate = date.toString();
        this._enddate = date.toString();
    };

    var _pDatePickerGroup = nexacro._createPrototype(nexacro.PickerGroup, nexacro.DatePickerGroup);
    nexacro.DatePickerGroup.prototype = _pDatePickerGroup;

    _pDatePickerGroup._type_name = "DatePickerGroup";
    _pDatePickerGroup._is_scrollable = true;
    _pDatePickerGroup._use_translate_scroll = (nexacro._Browser == "Runtime");

    _pDatePickerGroup._event_list["onenddateclick"] = 1;
    _pDatePickerGroup._event_list["onstartdateclick"] = 1;

    _pDatePickerGroup._p_displaymonthcount = 1;
    _pDatePickerGroup._p_defaultrangeposition = 1;

    _pDatePickerGroup._p_scrollbartype = "none";
    _pDatePickerGroup._p_scrolltype = "both";
    _pDatePickerGroup._p_datepickerchangetype = "button";
    _pDatePickerGroup._p_rangeposition = "start";

    _pDatePickerGroup._attach_comp = null;
    _pDatePickerGroup._move_duration = 250;
    _pDatePickerGroup._is_start_select = true;
    _pDatePickerGroup._keep_enddate_firstclick = false;

    _pDatePickerGroup._comptype = {
        proto: "DatePickerControlEx", id: "datepicker"
    };

    _pDatePickerGroup.on_after_created = function ()
    {
        this._updateSplitLines();
        this._setChildEventHandler();
        this._moveButtonON();
        this._scrollCurrent();
    };

    _pDatePickerGroup._setChildEventHandler = function ()
    {
        var list = this._picker_ctrl_list;
        var picker;

        for (var i = 0; i < list.length; i++)
        {
            picker = list[i];
            picker.head.prevbutton._removeEventHandler("onclick", picker.head._on_button_onprevclick, picker.head);
            picker.head.nextbutton._removeEventHandler("onclick", picker.head._on_button_onnextclick, picker.head);
            picker.head.prevbutton._setEventHandler("onclick", this._on_button_onprevclick, this);
            picker.head.nextbutton._setEventHandler("onclick", this._on_button_onnextclick, this);

            picker._setEventHandler("ondayclick", this._on_datepicker_ondayclick, this);
        }
    };

    _pDatePickerGroup._switchingEventHandler = function (picker, b_org)
    {
        if (!b_org)
        {
            picker.head.prevbutton._removeEventHandler("onclick", picker.head._on_button_onprevclick, picker.head);
            picker.head.nextbutton._removeEventHandler("onclick", picker.head._on_button_onnextclick, picker.head);
            picker.head.prevbutton._setEventHandler("onclick", this._on_button_onprevclick, this);
            picker.head.nextbutton._setEventHandler("onclick", this._on_button_onnextclick, this);
        }
        else
        {
            picker.head.prevbutton._removeEventHandler("onclick", this._on_button_onprevclick, this);
            picker.head.nextbutton._removeEventHandler("onclick", this._on_button_onnextclick, this);
            picker.head.prevbutton._setEventHandler("onclick", picker.head._on_button_onprevclick, picker.head);
            picker.head.nextbutton._setEventHandler("onclick", picker.head._on_button_onnextclick, picker.head);
        }
    };

    _pDatePickerGroup._on_button_onprevclick = function (obj, e)
    {
        if (this._p_readonly)
            return;

        this._movePrev();
    };

    _pDatePickerGroup._on_button_onnextclick = function (obj, e)
    {
        if (this._p_readonly)
            return;

        this._moveNext();
    };

    _pDatePickerGroup.on_destroy_contents = function ()
    {
        nexacro.PickerGroup.prototype.on_destroy_contents.call(this);
        this._slot = null;
        this._range = null;
        this._drag_day_info = null;
        this._modal_picker = null;
    };

    _pDatePickerGroup._getSplitCount = function ()
    {
        return this._p_displaymonthcount - 1;
    };

    _pDatePickerGroup._setDatepickerheadheight = function (v)
    {
        this._headheight = v;
        var list = this._picker_ctrl_list;
        var picker;
        if (!this._is_created)
            return;
        for (var i = 0; i < list.length; i++)
        {
            picker = list[i];
            picker._recalcLayout();
        }
    };


    _pDatePickerGroup._on_dataset_onvaluechanged = function (obj, e)
    {
        this._refreshDayAllPicker();

        if (this._is_created)
        {
            this.on_fire_oninnerdatachanged(obj, e.oldvalue, e.newvalue, e.columnid, e.col, e.row);
        }
    };

    _pDatePickerGroup._refreshDayAllPicker = function ()
    {
        var list = this._picker_ctrl_list;

        for (var i = 0; i < list.length; i++)
        {
            var datepicker = list[i];

            if (datepicker)
                datepicker._refreshDay();
        }
    };

    _pDatePickerGroup._setInvalidDate = function (invalid_sdate, invalid_edate)
    {
        this._invalid_startdate = invalid_sdate ? invalid_sdate.substr(0, 8) : "";
        this._invalid_enddate = invalid_edate ? invalid_edate.substr(0, 8) : "";
    };

    _pDatePickerGroup._on_dataset_onrowsetchanged = function ()
    {
        this._refreshDayAllPicker();
    };

    _pDatePickerGroup.on_apply_backgroundcolumn = function ()
    {
        this._refreshDayAllPicker();
    };

    _pDatePickerGroup.on_apply_bordercolumn = function ()
    {
        this._refreshDayAllPicker();
    };

    _pDatePickerGroup.on_apply_datecolumn = function ()
    {
        this._refreshDayAllPicker();
    };

    _pDatePickerGroup.on_apply_textcolorcolumn = function ()
    {
        this._refreshDayAllPicker();
    };

    _pDatePickerGroup.on_apply_hintingcolumn = function ()
    {
        this._refreshDayAllPicker();
    };

    _pDatePickerGroup.on_apply_readonlycolumn = function ()
    {
        this._refreshDayAllPicker();
    };

    _pDatePickerGroup._recalcLayout = function ()
    {
        var list = this._picker_ctrl_list;
        var lines = this._split_line_list;
        var l = 0, t = 0, w = 0, h = 0;
        var s_date = this._range.start;
        var e_date = this._range.end;

        if (this._p_direction == "horizontal")
        {
            w = this._getClientWidth() / this._slot.show.pickerarr.length;
            h = this._getClientHeight();

            if (this._control_element)
                this._control_element.setElementScrollMaxSize(this._getClientWidth() + (w * 2), 0);    // 2: (prev, next)

            var picker_l = 0, i;
            for (i = 0; i < list.length; i++)
            {
                list[i].move(picker_l, t, w, h);
                picker_l += w;

                if (this._p_type == "range" && this._is_set_startvalue && s_date && e_date)
                    list[i]._updateSelection(s_date.toString(), e_date.toString());
            }

            var paddtop = 0, paddleft = 0;
            var padding = this._getCurrentStylePadding();
            if (padding)
            {
                paddleft = padding.left;
                paddtop = padding.top;
            }

            for (i = 0; i < lines.length; i++)
            {
                lines[i]._setDirection(false);
                lines[i].move(paddleft + (w * (i + 1)) - 0.5, paddtop, 1, this._getClientHeight());
            }
        }
        else
        {
            w = this._getClientWidth();
            h = this._getClientHeight() / this._slot.show.pickerarr.length;

            if (this._control_element)
                this._control_element.setElementScrollMaxSize(0, this._getClientHeight() + (h * 2));    // 2: (prev, next)

            var picker_t = 0, i;
            for (i = 0; i < list.length; i++)
            {
                list[i].move(l, picker_t, w, h);
                picker_t += h;

                if (this._p_type == "range" && this._is_set_startvalue && s_date && e_date)
                    list[i]._updateSelection(s_date.toString(), e_date.toString());
            }

            var paddtop = 0, paddleft = 0;
            var padding = this._getCurrentStylePadding();
            if (padding)
            {
                paddleft = padding.left;
                paddtop = padding.top;
            }

            for (i = 0; i < lines.length; i++)
            {
                lines[i]._setDirection(true);
                lines[i].move(paddleft, paddtop + (h * (i + 1)) - 0.5, this._getClientWidth(), 1);
            }
        }

        this._scrollCurrent();
        this._onResetScrollBar();
    };

    _pDatePickerGroup._setFocusedDay = function (year, month, day)
    {
        this._focused_year = year;
        this._focused_month = month;
        this._focused_day = day;
    };

    _pDatePickerGroup._animateScroll = function (kind, chk_alldate, no_ani, is_popup_act)
    {
        var duration = this._move_duration;
        var stime = (nexacro._Browser != "Runtime" && performance) ? performance.now() : (new Date());
        var pthis = this;
        var width = this._getClientWidth();
        var spos, epos;

        if (kind == "next" || kind == "enddate")
        {
            spos = this._slot.show.beg;

            if (this._p_direction == "horizontal")
                epos = this._slot.show.beg + this._slot.next.picker._adjust_width;
            else
                epos = this._slot.show.beg + this._slot.next.picker._adjust_height;

            if (kind == "enddate")
            {
                if (chk_alldate)
                {
                    if (this._isShowAllDate())
                        return;
                }
                else
                {
                    if (this._isShowEndDate())
                        return;
                }

                this._initRangePos("end", -1);
                this._updateRangeDate();
            }
        }
        else if (kind == "prev" || kind == "startdate")
        {
            spos = this._slot.prev.end;
            epos = 0;

            if (kind == "startdate")
            {
                if (chk_alldate)
                {
                    if (this._isShowAllDate())
                        return;
                }
                else
                {
                    if (this._isShowStartDate())
                        return;
                }

                this._initRangePos("start", +1);
                this._updateRangeDate();
            }
        }

        if (!no_ani && nexacro._Browser != "Runtime")
        {
            var aniframe;
            function easeOut(t)
            {
                return 1 - Math.pow(1 - t, 2);
            };
            function animate(currtime)
            {
                var elapsed_time = currtime - stime;
                var progress = Math.min(elapsed_time / duration, 1);
                var currpos = easeOut(progress) * (epos - spos) + spos;

                if (pthis._p_direction == "horizontal")
                    pthis._scrollTo(currpos, 0, null, null, "", "move");
                else
                    pthis._scrollTo(0, currpos, null, null, "", "move");

                if (progress < 1)
                    aniframe.start();
                else
                    pthis._animateScrollEnd(kind, is_popup_act);
            };


            aniframe = new nexacro.AnimationFrame(this, animate);
            aniframe.start();


        }
        else
        {
            if (this._p_direction == "horizontal")
                this._scrollTo((epos - spos) + spos, 0, null, null, "", "move");
            else
                this._scrollTo(0, (epos - spos) + spos, null, null, "", "move");

            this._animateScrollEnd(kind, is_popup_act);
        }
    };

    _pDatePickerGroup._animateScrollEnd = function (kind, is_popup_act)
    {
        var slot = this._slot;
        var is_vert = (this._p_direction == "vertical");

        if (kind == "next") // move →
        {
            var nextdate = nexacro.DataUtils.toDate(slot.next.picker._value);
            nextdate.setMonth(nextdate.getMonth() + 1);

            var nextpicker = slot.prev.picker;
            slot.prev.setPicker(slot.show.pickerarr[0], is_vert);
            slot.show.addPicker(slot.next.picker, false, is_vert);
            slot.next.setPicker(nextpicker, is_vert);

            nextpicker._setYearMonth(nextdate.getFullYear(), nextdate.getMonth() + 1);

            if (this._p_direction == "horizontal")
                this._picker_ctrl_list.sort(function (a, b) { return a.left - b.left; });
            else
                this._picker_ctrl_list.sort(function (a, b) { return a.top - b.top; });
        }
        else if (kind == "prev")// move ←
        {
            var prevdate = nexacro.DataUtils.toDate(slot.prev.picker._value);
            prevdate.setMonth(prevdate.getMonth() - 1);

            var prevpicker = slot.next.picker;
            slot.next.setPicker(slot.show.pickerarr[slot.show.pickerarr.length - 1], is_vert);
            slot.show.addPicker(slot.prev.picker, true, is_vert);
            slot.prev.setPicker(prevpicker, is_vert);

            prevpicker._setYearMonth(prevdate.getFullYear(), prevdate.getMonth() + 1);

            if (this._p_direction == "horizontal")
                this._picker_ctrl_list.sort(function (a, b) { return a.left - b.left; });
            else
                this._picker_ctrl_list.sort(function (a, b) { return a.top - b.top; });
        }

        else if (kind == "startdate")
            this._initRangePos("start");
        else if (kind == "enddate")
            this._initRangePos("end");
        else if (kind == "focused_right")
            this._initRangePos("end", null, "focused");
        else if (kind == "focused_left")
            this._initRangePos("start", +1, "focused");

        if (this._curr_picker)
            this._curr_picker._setFocus(false);

        this._moveButtonON();
        this._updateRangeDate();
        this._updateMinMaxDate();

        if (is_popup_act && nexacro._OS == "iOS" && (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge"))
            this._scrollCurrent(true);  // popup띄울 시 iOS paint bug
        else
            this._scrollCurrent();
    };

    _pDatePickerGroup._setVScrollDefaultAction = function (wheelDelta)
    {
        if (this.scrolltype == "none" || this.scrolltype == "horizontal")
            return false;

        if (wheelDelta > 0)
            this._movePrev();
        else
            this._moveNext();

        return true;
    };

    _pDatePickerGroup._setHScrollDefaultAction = function (wheelDelta)
    {
        if (this.scrolltype == "none" || this.scrolltype == "vertical")
            return false;

        if (wheelDelta > 0)
            this._movePrev();
        else
            this._moveNext();

        return true;
    };

    _pDatePickerGroup._isShowAllDate = function ()
    {
        var slot = this._slot;
        var pickers = slot.show.pickerarr;
        var startdate = this._startdate;
        var enddate = this._enddate;
        var s_month = startdate.substr(0, 6);
        var e_month = enddate ? enddate.substr(0, 6) : s_month;
        var retn = false;

        if (pickers.length)
        {
            var retns = false, retne = false;
            var show_s_month = pickers[0]._getYearMonthStr();
            var show_e_month = pickers[pickers.length - 1]._getYearMonthStr();

            if (show_s_month <= s_month && s_month <= show_e_month)
                retns = true;
            if (show_s_month <= e_month && e_month <= show_e_month)
                retne = true;

            retn = (retns && retne);
        }
        return retn;
    };

    _pDatePickerGroup._isShowStartDate = function ()
    {
        var slot = this._slot;
        var pickers = slot.show.pickerarr;
        var startdate = this._startdate;
        var s_month = startdate.substr(0, 6);
        var retn = false;

        if (pickers.length)
        {
            var show_s_month = pickers[0]._getYearMonthStr();
            var show_e_month = pickers[pickers.length - 1]._getYearMonthStr();

            if (show_s_month <= s_month && s_month <= show_e_month)
                retn = true;
        }
        return retn;
    };

    _pDatePickerGroup._isShowEndDate = function ()
    {
        var slot = this._slot;
        var pickers = slot.show.pickerarr;
        var startdate = this._startdate;
        var enddate = this._enddate;
        var s_month = startdate.substr(0, 6);
        var e_month = enddate ? enddate.substr(0, 6) : s_month;
        var retn = false;

        if (pickers.length)
        {
            var show_s_month = pickers[0]._getYearMonthStr();
            var show_e_month = pickers[pickers.length - 1]._getYearMonthStr();

            if (show_s_month <= e_month && e_month <= show_e_month)
                retn = true;
        }
        return retn;
    };

    _pDatePickerGroup._isShowMonth = function (year, month)
    {
        var slot = this._slot;
        var pickers = slot.show.pickerarr;
        var retn = false;
        var yearmonth = (year + "").padLeft(4, "0") + (month + "").padLeft(2, "0");

        if (pickers.length)
        {
            var show_s_month = pickers[0]._getYearMonthStr();
            var show_e_month = pickers[pickers.length - 1]._getYearMonthStr();

            if (show_s_month <= yearmonth && yearmonth <= show_e_month)
                retn = true;
        }
        return retn;
    };

    _pDatePickerGroup._scrollCurrent = function (ani)
    {
        if (!this._slot.prev.picker)
            return;

        if (this._p_direction == "horizontal")
        {
            this._hscroll_pos = 0;
            this._control_element._reset_scrollpos = true;

            if (ani)
                this._scrollTo(this._slot.prev.picker.width - 1, 0, null, null, "", "move");

            this._scrollTo(this._slot.prev.picker.width, 0, null, null, "", "move");
            this._control_element._reset_scrollpos = false;
        }
        else
        {
            this._vscroll_pos = 0;
            this._control_element._reset_scrollpos = true;

            if (ani)
                this._scrollTo(0, this._slot.prev.picker.height - 1, null, null, "", "move");

            this._scrollTo(0, this._slot.prev.picker.height, null, null, "", "move");
            this._control_element._reset_scrollpos = false;
        }
    };

    _pDatePickerGroup.on_slideend_basic_action = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, refer_comp)
    {
        if (this._drag_day_info == null)
        {
            if (this._p_direction == "horizontal")
            {
                if (xaccvalue < 0)
                    this._moveNext();
                else if (xaccvalue > 0)
                    this._movePrev();
            }
            else
            {
                if (yaccvalue < 0)
                    this._moveNext();
                else if (yaccvalue > 0)
                    this._movePrev();
            }
        }
    };

    _pDatePickerGroup._on_beforescroll = function (prehpos, prevpos, posthpos, postvpos, evttype, evtkind)
    {
        if (evtkind == "move")
            return true;

        return false;
    }

    _pDatePickerGroup._movePrev = function (no_ani)
    {
        if (this._is_modal_lock)
            return;

        var sp = this._getStartShowPicker();

        if (sp && !sp.head.prevbutton._p_visible)
            return;

        this._moveButtonOFF();
        this._animateScroll("prev", undefined, no_ani);
    };

    _pDatePickerGroup._moveNext = function (no_ani)
    {
        if (this._is_modal_lock)
            return;

        var ep = this._getEndShowPicker();

        if (ep && !ep.head.nextbutton._p_visible)
            return;

        this._moveButtonOFF();
        this._animateScroll("next", undefined, no_ani);
    };

    _pDatePickerGroup._goBackCurrentSelect = function ()
    {
        if (this._is_start_select)
            this._animateScroll("startdate");
        else
            this._animateScroll("enddate");
    };

    _pDatePickerGroup._goBackCurrentFocus = function ()
    {
        var focused_year = this._focused_year;
        var focused_month = this._focused_month;
        var focused_day = this._focused_day;

        if (focused_year == undefined)
            return;

        if (this._isShowMonth(focused_year, focused_month))
            return false;

        var target_date = new nexacro.Date(focused_year, parseInt(focused_month) - 1, focused_day);

        this._initRangePos("start", 0, target_date);
        this._slot.show.pickerarr[0]._setFocus(false);
        this._updateRangeDate();

        return true;
    };

    _pDatePickerGroup._moveButtonOFF = function ()
    {
        var pickers = this._picker_ctrl_list;
        for (var i = 0; i < pickers.length; i++)
        {
            pickers[i].head.prevbutton.set_visible(false);
            pickers[i].head.nextbutton.set_visible(false);
            pickers[i]._skipEvent = true;
        }
    };

    _pDatePickerGroup._moveButtonON = function ()
    {
        var show_pickers = this._slot.show.pickerarr;

        if (!show_pickers.length)
            return;

        var sp = this._getStartShowPicker();
        var ep = this._getEndShowPicker();

        if (sp == ep)
        {
            sp.head.prevbutton.set_visible(true);
            sp.head.nextbutton.set_visible(true);
            sp._skipEvent = false;
        }
        else
        {
            sp.head.prevbutton.set_visible(true);
            sp.head.nextbutton.set_visible(false);
            sp._skipEvent = false;

            for (var i = 1; i < show_pickers.length - 1; i++)
            {
                show_pickers[i].head.prevbutton.set_visible(false);
                show_pickers[i].head.nextbutton.set_visible(false);
                show_pickers[i]._skipEvent = false;
            }

            ep.head.prevbutton.set_visible(false);
            ep.head.nextbutton.set_visible(true);
            ep._skipEvent = false;
        }
    };

    _pDatePickerGroup._getStartShowPicker = function ()
    {
        return this._slot.show.pickerarr[0];
    };

    _pDatePickerGroup._getEndShowPicker = function ()
    {
        return this._slot.show.pickerarr[this._slot.show.pickerarr.length - 1];
    };

    _pDatePickerGroup.on_apply_startdate = function ()
    {
        var isMove = true;

        var win = this._getWindow();
        var comp = win._cur_ldown_elem;
        while (comp)
        {
            if (comp instanceof nexacro.DateRangePicker)
            {
                isMove = false;
                break;
            }
            comp = comp._p_parent;
        }
        this._setStartDate(this._p_startdate, isMove);
    };

    _pDatePickerGroup._setStartDate = function (v, move)
    {
        var date;
        if (v)
        {
            if (v.length == 17)
                v = v.substr(0, 8);

            date = nexacro.DataUtils.toDate(v);
            this._is_set_startvalue = true;
        }
        else
        {
            var curr = new nexacro.Date();
            curr._timecheck = false;
            date = nexacro.DataUtils.toDate(curr.toString());
            this._is_set_startvalue = undefined;
        }

        this._range.start = date;
        this._startdate = date.toString();

        if (move && this._p_rangeposition == "start")
            this._initRangePos(this._p_rangeposition);

        if (this._p_type == "range")
        {
            if (!this._p_enddate && !this._drag_day_info)
                this._enddate = "";
            if (this._enddate && this._enddate < this._startdate)
                this._enddate = "";
        }
        else
        {
            this._enddate = "";
        }

        this._setEndDate(this._enddate, false);
        this._updateRangeDate();
    };

    _pDatePickerGroup.on_apply_enddate = function ()
    {
        this._setEndDate(this._p_enddate);
    };

    _pDatePickerGroup._setEndDate = function (v, move)
    {
        var date;
        if (v)
        {
            if (v.length == 17)
                v = v.substr(0, 8);

            date = nexacro.DataUtils.toDate(v);
        }
        else
        {
            date = this._range.start;
        }

        this._range.end = date;
        this._enddate = date.toString();

        if (move && this._p_rangeposition == "end")
            this._initRangePos(this._p_rangeposition);

        if (this._startdate && this._enddate < this._startdate)
        {
            this._setStartDate(this._enddate, false);
            this._is_start_select = true;
        }
        this._updateRangeDate();
    };

    _pDatePickerGroup.set_rangeposition = function (v, _force)
    {
        if (_force || this._p_rangeposition != v)
        {
            switch (v)
            {
                case "start":
                case "end":
                    this._p_rangeposition = v;
                    break;
                default:
                    return;
            }

            this.on_apply_rangeposition();
        }
    };

    _pDatePickerGroup.on_apply_rangeposition = function ()
    {
        this._initRangePos(this._p_rangeposition);
        this._updateRangeDate();
    };

    _pDatePickerGroup.on_apply_type = function ()
    {
        if (this._p_type == "single")
            this._is_start_select = true;

        var list = this._picker_ctrl_list;

        for (var i = 0; i < list.length; i++)
            list[i].set_userange(this._p_type == "range");

        this._updateRangeDate();
        this._updateMinMaxDate();
    };

    _pDatePickerGroup.on_apply_direction = function ()
    {
        this.set_scrolltype(this._p_direction);
        this._initSlotInfo();
        this._recalcLayout();
    };

    _pDatePickerGroup._getEndDay = function (year, month)
    {
        var lastday = new Date(year, month, 0).getDate();
        if (lastday != "Invalid Date" && !isNaN(lastday))
        {
            return lastday;
        }
        return 0;
    };

    _pDatePickerGroup._initRangePos = function (posi, adjust_month, target_date)
    {
        var defaultrangeposition = this._p_defaultrangeposition;

        if (!adjust_month) adjust_month = 0;

        if (target_date)
        {
            defaultrangeposition = 1;
        }
        else
        {
            if (posi == "start")
                target_date = this._range.start;
            else
                target_date = this._range.end;

            var slot = this._slot;
            var showpickers = slot.show.pickerarr;

            defaultrangeposition = Math.min(defaultrangeposition, showpickers.length - 1);
            defaultrangeposition = Math.max(defaultrangeposition, 1);
        }

        this._initRangeDatePos(posi, adjust_month, target_date, defaultrangeposition);
    };

    _pDatePickerGroup._initRangeDatePos = function (posi, adjust_month, target_date, defaultrangeposition)
    {
        var slot = this._slot;
        var showpickers = slot.show.pickerarr;

        this._is_init_rangeposition = false;

        if (!showpickers.length)
            return;

        if (!adjust_month) adjust_month = 0;

        this._prev_picker = this._curr_picker;

        var date = target_date.clone();
        date.setDate(1);

        if (posi == "start")
        {
            date.setMonth(date.getMonth() - defaultrangeposition);
            slot.prev.picker._setYearMonth(date.getFullYear(), date.getMonth() + 1 + adjust_month);

            for (var i = 0; i < showpickers.length; i++)
            {
                date.setMonth(date.getMonth() + 1);
                showpickers[i]._setYearMonth(date.getFullYear(), date.getMonth() + 1 + adjust_month);

                if (defaultrangeposition == (i + 1))
                    this._curr_picker = showpickers[i];
            }

            date.setMonth(date.getMonth() + 1);
            slot.next.picker._setYearMonth(date.getFullYear(), date.getMonth() + 1 + adjust_month);

            this._is_init_rangeposition = true;
        }
        else
        {
            date.setMonth(date.getMonth() + defaultrangeposition);

            slot.next.picker._setYearMonth(date.getFullYear(), date.getMonth() + 1 + adjust_month);

            for (var i = showpickers.length - 1; i >= 0; i--)
            {
                date.setMonth(date.getMonth() - 1);
                showpickers[i]._setYearMonth(date.getFullYear(), date.getMonth() + 1 + adjust_month);

                if (defaultrangeposition == (showpickers.length - i))
                    this._curr_picker = showpickers[i];
            }

            date.setMonth(date.getMonth() - 1);
            slot.prev.picker._setYearMonth(date.getFullYear(), date.getMonth() + 1 + adjust_month);

            this._is_init_rangeposition = true;
        }
    };

    _pDatePickerGroup._updateRangeDate = function ()
    {
        var s_date = this._range.start;
        var e_date = this._range.end;
        var list = this._picker_ctrl_list;

        for (var i = 0; i < list.length; i++)
        {
            var pos = list[i]._year_month;
            var bset = false;

            //          if (!pos)
            //              nexacro._traceV8CallStack(true);

            if (s_date && pos.year == s_date.getFullYear() && pos.month == s_date.getMonth() + 1)
            {
                if (this._is_set_startvalue)
                {
                    list[i]._setValue(s_date.toString());
                    bset = true;
                }
            }
            else
            {
                if (this._is_set_startvalue)
                {
                    list[i]._setValue(null);
                    bset = true;
                }
            }

            if (e_date && pos.year == e_date.getFullYear() && pos.month == e_date.getMonth() + 1)
            {
                var evalue = (this._p_type == "range") ? e_date.toString() : null;

                if (this._is_set_startvalue)
                {
                    list[i]._setEndValue(evalue);
                    bset = true;
                }
            }
            else
            {
                if (this._is_set_startvalue)
                {
                    list[i]._setEndValue(null);
                    bset = true;
                }
            }

            if (bset == false)
            {
                list[i]._setValue(null);
                list[i]._setEndValue(null);
            }

            // selection & min, max
            if (this._p_type == "range" && this._is_set_startvalue)
                list[i]._updateSelection(s_date.toString(), e_date.toString());
            else
                list[i]._displayNoneSelection();

            list[i]._updateInvalidDisplay(this._invalid_startdate, this._invalid_enddate);
        }
    };

    _pDatePickerGroup._updateMinMaxDate = function ()
    {
        if (!this._is_init_rangeposition)
            return;

        var list = this._picker_ctrl_list;

        for (var i = 0; i < list.length; i++)
        {
            list[i]._updateMinMaxDay(this._p_mindate, this._p_maxdate);
        }
    };

    _pDatePickerGroup.set_displaymonthcount = function (v, _force)
    {
        v = parseInt(v);

        if (v > 3)  // max
            v = 3;

        if (_force || this._p_displaymonthcount != v)
        {
            this._p_displaymonthcount = v;
            this.on_apply_displaymonthcount();
        }
    };

    _pDatePickerGroup.on_apply_displaymonthcount = function ()
    {
        this._updatePickers();
        this._updateSplitLines();
        this._recalcLayout();
        this.on_apply_rangeposition();
        this._moveButtonON();
    };

    _pDatePickerGroup.set_defaultrangeposition = function (v)
    {
        v = parseInt(v);
        if (this._p_defaultrangeposition != v)
        {
            this._p_defaultrangeposition = v;
            this.on_apply_defaultrangeposition();
        }
    };

    _pDatePickerGroup.on_apply_defaultrangeposition = function ()
    {
        this.on_apply_rangeposition();
    };

    _pDatePickerGroup.on_apply_maxdate = function ()
    {
        this._updateRangeDate();
        this._updateMinMaxDate();
    };

    _pDatePickerGroup.on_apply_mindate = function ()
    {
        this._updateRangeDate();
        this._updateMinMaxDate();
    };

    _pDatePickerGroup._getPickerCount = function ()
    {
        return this._p_displaymonthcount + 2;   // 2 = hidden area (next + prev)
    };

    _pDatePickerGroup._getPrevShowPicker = function (picker)
    {
        var arr = this._slot.show.pickerarr;

        if (picker == this._slot.next.picker)
            return arr[arr.length - 1];

        for (var i = 0; i < arr.length; i++)
        {
            if (arr[i] == picker)
            {
                if (arr[i - 1])
                    return arr[i - 1];
                else
                    return this._slot.prev.picker;
            }
        }
    };

    _pDatePickerGroup._getNextShowPicker = function (picker)
    {
        var arr = this._slot.show.pickerarr;

        if (picker == this._slot.prev.picker)
            return arr[0];

        for (var i = 0; i < arr.length; i++)
        {
            if (arr[i] == picker)
            {
                if (arr[i + 1])
                    return arr[i + 1];
                else
                    return this._slot.next.picker;
            }
        }
    };

    _pDatePickerGroup._updatePickers = function (create_only)
    {
        nexacro.PickerGroup.prototype._updatePickers.call(this, create_only);

        var list = this._picker_ctrl_list;
        this._slot.prev.picker = list[0];
        this._slot.show.pickerarr = [].concat(list);
        this._slot.show.pickerarr.shift();
        this._slot.show.pickerarr.pop();
        this._slot.next.picker = list[list.length - 1];
    };

    _pDatePickerGroup._cancelSelectYearMonth = function ()
    {
        if (!this._is_modal_lock)
            return;

        if (this._curr_picker)
        {
            this._curr_picker._cancelSelectYearMonth();
            this._modalYearMonthPicker(this._curr_picker, false);
        }
    };

    _pDatePickerGroup._is_modal_lock = false;
    _pDatePickerGroup._modalYearMonthPicker = function (picker, show)
    {
        var slot = this._slot;
        var show_pickers = slot.show.pickerarr;

        for (var i = 0; i < show_pickers.length; i++)
        {
            var cur_picker = show_pickers[i];

            if (cur_picker == picker)
            {
                this._switchingEventHandler(cur_picker, show);

                if (show)
                {
                    cur_picker.head.prevbutton.set_visible(true);
                    cur_picker.head.nextbutton.set_visible(true);
                    cur_picker._displayNoneSelection();
                    this._modal_picker = cur_picker;
                }
                continue;
            }

            cur_picker._lock(show);
        };

        if (show == false)
        {
            this._modal_picker = null;
            this._moveButtonON(); // prev, next button visible update

            var y = parseInt(picker.head._date.str_year);
            var m = parseInt(picker.head._date.str_month);

            this._rearrangeYearMonth(picker, y, m);
        }
        this._is_modal_lock = show;
    };

    _pDatePickerGroup._rearrangeYearMonth = function (picker, y, m)
    {
        var list = this._picker_ctrl_list;
        var i, j, curr, prev, next;

        for (i = 0; i < list.length; i++)
        {
            if (next) // curr -->
            {
                next.setMonth(next.getMonth() + 1);
                list[i]._setYearMonth(next.getFullYear(), next.getMonth() + 1);
            }

            if (list[i] == picker)
            {
                picker._setYearMonth(y, m);
                curr = new nexacro.Date(y, m - 1, 1);

                next = curr.clone();
                prev = curr.clone();

                for (j = i - 1; j >= 0; j--) // <-- curr (reverse)
                {
                    prev.setMonth(prev.getMonth() - 1);
                    list[j]._setYearMonth(prev.getFullYear(), prev.getMonth() + 1);
                }
            }
        }
        this._updateRangeDate();
        this._updateMinMaxDate();
    };

    _pDatePickerGroup._getAttachComponent = function ()
    {
        return this._attach_comp;
    };

    _pDatePickerGroup._setZeroCaret = function ()
    {
        var edit = this._getAttachComponent();
        if (edit && nexacro._checkActiveElement(edit._input_element))
        {
            edit.setCaretPos(0);
        }
    };

    _pDatePickerGroup._common_down_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        this._drag_day_info = null;

        this._setCurrentPicker(refer_comp);

        if (refer_comp instanceof nexacro._DatePickerDayItemControl)
        {
            if (this._p_type == "range")
            {
                if (!refer_comp._isEnable() || this._invalid_startdate || this._invalid_enddate || this._startdate == this._enddate)
                    return;

                var date = refer_comp._year + refer_comp._month + refer_comp.text.padLeft(2, "0");

                if (date == this._startdate)
                    this._drag_day_info = { downcomp: refer_comp, movecomp: refer_comp, rangepos: "start" };
                if (date == this._enddate)
                    this._drag_day_info = { downcomp: refer_comp, movecomp: refer_comp, rangepos: "end" };
            }
        }
    };

    _pDatePickerGroup._common_move_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        if (this._p_type == "range" && refer_comp instanceof nexacro._DatePickerDayItemControl)
        {
            if (!refer_comp._isEnable())
                return;

            if (this._drag_day_info)
            {
                if (this._drag_day_info.movecomp == refer_comp)
                    return;

                this._drag_day_info.movecomp = refer_comp;
                this._doSelectDay(refer_comp, (this._drag_day_info.rangepos == "start"), "drag");

                if (refer_comp instanceof nexacro._DatePickerDayItemControl)
                {
                    var body = refer_comp.parent;
                    var picker = body.parent;
                    var body_date = body._date;
                    var year = body_date.int_year;
                    var month = body_date.int_month;
                    var day = refer_comp.text.padLeft(2, "0");

                    picker._focused_day = day;
                    this._setFocusedDay(year, month, day);
                }

                this._drag_day_info.movecomp._setFocus(false);
            }
        }
    };

    _pDatePickerGroup._common_up_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        nexacro._OnceCallbackTimer.callonce(this, function ()
        {
            this._drag_day_info = null;
        });
    };

    _pDatePickerGroup.on_mousemove_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        nexacro.Component.prototype.on_mousemove_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
        this._common_move_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
    };

    _pDatePickerGroup.on_touchmove_basic_action = function (touch_manager, touchinfos, changedtouchinfos, refer_comp)
    {
        nexacro.Component.prototype.on_touchmove_basic_action.call(this, touch_manager, touchinfos, changedtouchinfos, refer_comp);

        var touchinfo = nexacro._getFirstTouchInfo(changedtouchinfos);
        this._common_move_action(touchinfo.target, "touch", false, false, false, touchinfo.canvasx, touchinfo.canvasy, touchinfo.screenx, touchinfo.screeny, refer_comp);
    };

    _pDatePickerGroup.on_lbuttonup_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        nexacro.Component.prototype.on_lbuttonup_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
        this._common_up_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
    };

    _pDatePickerGroup.on_touchend_basic_action = function (touch_manager, touchinfos, changedtouchinfos, refer_comp)
    {
        nexacro.Component.prototype.on_touchend_basic_action.call(this, touch_manager, touchinfos, changedtouchinfos, refer_comp);

        var touchinfo = nexacro._getFirstTouchInfo(changedtouchinfos);
        this._common_up_action(touchinfo.target, "touch", false, false, false, touchinfo.canvasx, touchinfo.canvasy, touchinfo.screenx, touchinfo.screeny, refer_comp);
    };

    _pDatePickerGroup.on_killfocus_basic_action = function (new_focus, new_refer_focus)
    {
        nexacro.Component.prototype.on_killfocus_basic_action.call(this, new_focus, new_refer_focus);

        var root = this._getRootComponent(this);

        if (root == this)
            this._initSelectOrder();
    };

    _pDatePickerGroup._initSelectOrder = function ()
    {
        this._is_start_select = true;
    };

    _pDatePickerGroup._initSlotInfo = function ()
    {
        var width = this._getClientWidth();
        var height = this._getClientHeight();

        var size = width;
        if (this._p_direction == "vertical")
            size = height;

        this._slot.prev.beg = 0;
        this._slot.prev.end = size / this._slot.show.pickerarr.length;
        this._slot.show.beg = this._slot.prev.end;
        this._slot.show.end = this._slot.show.beg + size;
        this._slot.next.beg = this._slot.show.end;
        this._slot.next.end = this._slot.next.beg + (size / this._slot.show.pickerarr.length);
    };

    _pDatePickerGroup.on_change_containerRect = function (width, height)
    {
        this._initSlotInfo();
        this._recalcLayout();
    };

    _pDatePickerGroup._getCurrentDate = function ()
    {
        var year, month, day;
        var currDate = new Date();

        year = currDate.getFullYear();
        month = currDate.getMonth() + 1;
        day = currDate.getDate();

        return { year: year, month: month, day: day };
    };

    _pDatePickerGroup.getInnerDataset = function ()
    {
        return this._innerdataset;
    };

    _pDatePickerGroup._on_datepicker_ondayclick = function (obj, e)
    {
        if (this._p_readonly)
            return;

        var dayitem = e.fromobject;
        var cur_date = dayitem._year + dayitem._month + dayitem.text.padLeft(2, "0");

        if (this._p_type == "range")
        {
            if (this._is_start_select == true)
            {
                this._on_fire_onstartdateclick(cur_date);
            }
            else
            {
                if (this._startdate && cur_date < this._startdate)
                    this._on_fire_onstartdateclick(cur_date);
                else
                    this._on_fire_onenddateclick(cur_date);
            }
        }
        else
        {
            this._on_fire_onstartdateclick(cur_date, null, e.kind);
        }

        this._doSelectDay(dayitem, undefined, "dayclick");

        if (this._p_type == "range")
        {
            if (this._is_start_select == false) // _doSelectDay에서 반전됨
                this._on_fire_onstartdateclick(cur_date, "after_onchanged");
            else
                this._on_fire_onenddateclick(cur_date, "after_onchanged");
        }
        else
        {
            this._on_fire_onstartdateclick(cur_date, "after_onchanged", e.kind);
        }
    };

    _pDatePickerGroup._doSelectDay = function (dayitem, is_startselect, kind)
    {
        if (this._p_readonly)
            return;

        if (is_startselect != undefined)
            this._is_start_select = is_startselect;

        var cur_date = dayitem._year + dayitem._month + dayitem.text.padLeft(2, "0");
        var prestartdate, poststartdate, preenddate, postenddate;

        if (this._is_start_select)
        {
            postenddate = preenddate = this._range.end.toString();
            prestartdate = this._range.start.toString();
            poststartdate = cur_date;

            if (this._is_set_startvalue && prestartdate == poststartdate)
            {
                if (kind != "drag")
                {
                    if (this._p_type == "range")
                        this._is_start_select = false;
                    else
                        this._is_start_select = true;
                }
                return;
            }
            if (kind == "dayclick")
            {
                this._invalid_startdate = "";
                this._invalid_enddate = "";
                if (!this._keep_enddate_firstclick || (postenddate < poststartdate))
                {
                    postenddate = "";
                    this._setEndDate(cur_date, false);
                    this._p_enddate = "";
                }
            }
            else if (kind == "drag")
            {
                this._invalid_startdate = "";
                this._invalid_enddate = "";
                if (postenddate < poststartdate)
                {
                    postenddate = cur_date;
                }
            }

            this._setStartDate(cur_date, false);
        }
        else // end select
        {
            prestartdate = poststartdate = this._range.start.toString();
            preenddate = this._range.end.toString();
            postenddate = cur_date;

            if (poststartdate != postenddate && preenddate == postenddate)
            {
                if (kind != "drag")
                {
                    this._is_start_select = true;
                }
                return;
            }

            if (postenddate < poststartdate)
            {
                if (kind == "dayclick")
                {
                    poststartdate = cur_date;
                    postenddate = "";
                }
                else if (kind == "drag")
                {
                    poststartdate = cur_date;
                }
            }
            this._setEndDate(cur_date, false);
        }

        if (kind != "drag")
        {
            if (this._p_type == "range")
                this._is_start_select = !this._is_start_select;
            else
                this._is_start_select = true;
        }
        else
        {
            this._is_start_select = true;
        }
        this.on_fire_onchanged(prestartdate, poststartdate, preenddate, postenddate);
    };

    _pDatePickerGroup._lockOffAll = function ()
    {
        var list = this._picker_ctrl_list;

        for (var i = 0; i < list.length; i++)
            list[i]._lock(false);
    };

    _pDatePickerGroup._on_fire_onstartdateclick = function (date, kind, actk)
    {
        if (this.onenddateclick && this.onenddateclick._has_handlers)
        {
            var evt = new nexacro.EventInfo(this, "onstartdateclick");
            evt.date = date;
            evt.kind = kind;
            evt.actk = actk;

            return this.onstartdateclick._fireEvent(this, evt);
        }
        return false;
    };

    _pDatePickerGroup._on_fire_onenddateclick = function (date, kind)
    {
        if (this.onenddateclick && this.onenddateclick._has_handlers)
        {
            var evt = new nexacro.EventInfo(this, "onenddateclick");
            evt.date = date;
            evt.kind = kind;

            return this.onenddateclick._fireEvent(this, evt);
        }
        return false;
    };

    _pDatePickerGroup._getCanHscroll = function (hscrollbar, dragscrolltype, xdeltavalue)
    {
        return true;
    };

    _pDatePickerGroup._getCanVscroll = function (vscrollbar, dragscrolltype, ydeltavalue)
    {
        return true;
    };

    //==============================================================================
    // nexacro.TimePickerGroup
    //==============================================================================
    nexacro.TimePickerGroup = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.PickerGroup.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pTimePickerGroup = nexacro._createPrototype(nexacro.PickerGroup, nexacro.TimePickerGroup);
    nexacro.TimePickerGroup.prototype = _pTimePickerGroup;

    _pTimePickerGroup._type_name = "TimePickerGroup";
    _pTimePickerGroup._usertimeformat = "";

    _pTimePickerGroup._comptype = {
        proto: "TimePickerControl", id: "timepicker"
    };

    _pTimePickerGroup.on_after_created = function ()
    {
        this._updateSplitLines();
        this._setChildEventHandler();
    };

    _pTimePickerGroup.on_destroy_contents = function ()
    {
        nexacro.PickerGroup.prototype.on_destroy_contents.call(this);
    };

    _pTimePickerGroup._setPickerCreateInfo = function (timepicker)
    {
        timepicker._usertimeformat = this._usertimeformat;
    };

    _pTimePickerGroup._updatePickers = function (create_only)
    {
        nexacro.PickerGroup.prototype._updatePickers.call(this, create_only);

        if (create_only)
        {
            this._curr_timepicker = this._picker_ctrl_list[0];
        }
        if (this._p_startdate)
            this.on_apply_startdate();
        if (this._p_enddate)
            this.on_apply_enddate();
    };

    _pTimePickerGroup._getPickerCount = function ()
    {
        if (this._p_type == "range")
            return 2;

        return 1;
    };

    _pTimePickerGroup._getSplitCount = function ()
    {
        if (this._p_type == "range")
            return 1;

        return 0;
    };

    _pTimePickerGroup._setChildEventHandler = function ()
    {
        var list = this._picker_ctrl_list;

        list[0]._setEventHandler("onchanged", this._on_timepicker_starttime_changed, this);

        if (list[1])
            list[1]._setEventHandler("onchanged", this._on_timepicker_endtime_changed, this);
    };

    _pTimePickerGroup._isNeedValidate = function ()
    {
        if (this._p_type == "range")
        {
            var root = this._getRangePicker();
            if ((root._p_displaytype == "time") ||
                (root._p_displaytype == "datetime" && root._startdate.date == root._enddate.date))
                return true;
        }
        return false;
    };

    _pTimePickerGroup._on_timepicker_starttime_changed = function (obj, e)
    {
        if (this._p_startdate != e.postvalue)
        {
            var prevsdate = this._p_startdate;
            var prevedate = this._p_enddate;

            if (this._isNeedValidate())
            {
                if (e.postvalue > prevedate)
                {
                    this._p_enddate = e.postvalue;
                    this.on_apply_enddate();
                }
            }

            this._p_startdate = e.postvalue;

            this.on_apply_startdate();

            this.on_fire_onchanged(prevsdate, this._p_startdate, prevedate, this._p_enddate);
        }
    };

    _pTimePickerGroup._on_timepicker_endtime_changed = function (obj, e)
    {
        if (this._p_enddate != e.postvalue)
        {
            var prevsdate = this._p_startdate;
            var prevedate = this._p_enddate;

            if (this._isNeedValidate())
            {
                if (e.postvalue < prevsdate)
                {
                    this._p_startdate = e.postvalue;
                    this.on_apply_startdate();
                }
            }

            this._p_enddate = e.postvalue;

            this.on_apply_enddate();

            this.on_fire_onchanged(prevsdate, this._p_startdate, prevedate, this._p_enddate);
        }
    };

    _pTimePickerGroup.on_apply_startdate = function ()
    {
        this._setStartDate(this._p_startdate);
    };

    _pTimePickerGroup._setStartDate = function (v)
    {
        var date;
        if (v)
            date = nexacro.DataUtils.toTime(v);
        else
            date = nexacro.DataUtils.toTime("000000000");

        this._range.start = date;
        this._startdate = date.toString();

        if (this._picker_ctrl_list[0])
            this._picker_ctrl_list[0].set_value(this._startdate);
    };

    _pTimePickerGroup.on_apply_enddate = function ()
    {
        if (this._p_type == "range")
            this._setEndDate(this._p_enddate);
    };

    _pTimePickerGroup._setEndDate = function (v)
    {
        var date;
        if (v)
            date = nexacro.DataUtils.toTime(v);
        else
            date = this._range.start ? this._range.start : "000000000";

        this._range.end = date;
        this._enddate = date.toString();

        if (this._picker_ctrl_list[1])
            this._picker_ctrl_list[1].set_value(this._enddate);
    };

    _pTimePickerGroup.on_apply_type = function ()
    {
        this._updatePickers();
        this._updateSplitLines();
        this._recalcLayout();
    };

    _pTimePickerGroup.on_change_containerRect = function (width, height)
    {
        this._recalcLayout();
    };

    _pTimePickerGroup._recalcLayout = function ()
    {
        var width = this._getClientWidth(), height = this._getClientHeight();

        if (width <= 0)
            return;

        var list = this._picker_ctrl_list;
        var lines = this._split_line_list;
        var picker_l = 0, i;
        var w, h;

        var paddtop = 0, paddleft = 0;
        var padding = this._getCurrentStylePadding();
        if (padding)
        {
            paddleft = padding.left;
            paddtop = padding.top;
        }

        if (this._p_direction == "horizontal")
        {
            for (i = 0; i < list.length; i++)
            {
                list[i].move(picker_l, 0, width / list.length, height);
                picker_l += width / list.length;
            }

            for (i = 0; i < lines.length; i++)
            {
                w = width / list.length;
                lines[i]._setDirection(false);
                lines[i].move(paddleft + (w * (i + 1)) - 0.5, paddtop, 1, height);
            }
        }
        else
        {
            for (i = 0; i < list.length; i++)
            {
                list[i].move(10, picker_l, width - 20, height / list.length);
                picker_l += height / list.length;
            }

            for (i = 0; i < lines.length; i++)
            {
                h = height / list.length;
                lines[i]._setDirection(true);
                lines[i].move(paddleft, paddtop + (h * (i + 1)) - 0.5, width, 1);
            }
        }
    };

    _pTimePickerGroup.on_keydown_basic_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        if (ctrl_key && !alt_key && (keycode == nexacro.Event.KEY_LEFT || keycode == nexacro.Event.KEY_RIGHT))
        {
            var pickers = this._picker_ctrl_list;
            var currpicker = this._getCurrentPicker();

            for (var i = 0; i < pickers.length; i++)
            {
                if (currpicker != pickers[i])
                {
                    this._focused_pos = null;
                    pickers[i]._setFocus(false);
                    this._setCurrentPicker(pickers[i]);
                    return;
                }
            }
        }
        else
        {
            nexacro.PickerGroup.prototype.on_keydown_basic_action.call(this, keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key);
        }
    };


    //==============================================================================
    // nexacro.DatePickerControlEx (nexacro.DatePickerControl ex)
    //==============================================================================
    nexacro.DatePickerControlEx = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.DatePickerControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pDatePickerControlEx = nexacro._createPrototype(nexacro.DatePickerControl, nexacro.DatePickerControlEx);
    nexacro.DatePickerControlEx.prototype = _pDatePickerControlEx;

    _pDatePickerControlEx._p_overlaybackground = "#333333";
    _pDatePickerControlEx._p_overlayopacity = "0.5";
    _pDatePickerControlEx._p_value = null;
    _pDatePickerControlEx._p_userange = true;

    _pDatePickerControlEx._year_month = null;
    _pDatePickerControlEx._overlay = null;
    _pDatePickerControlEx._skipEvent = false;
    _pDatePickerControlEx._use_space_key = true;

    _pDatePickerControlEx.on_getIDCSSSelector = function ()
    {
        return "datepicker";
    };

    _pDatePickerControlEx.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var head = this.head = new nexacro._DatePickerHeadControl("head", 0, 0, 0, 0, null, null, null, null, null, null, this);
            var body = this.body = new nexacro._DatePickerBodyControl("body", 0, 0, 0, 0, null, null, null, null, null, null, this);

            // override
            head._on_static_before_onlbuttondown = function ()
            {
                return this._p_parent._on_head_onYearMonthDown();
            };

            head._on_static_mobile_before_onclick = function ()
            {
                return this._p_parent._on_head_onYearMonthDown();
            };

            body.on_create_contents = function ()
            {
                this._selections = [];

                for (var i = 0; i < 6; i++)
                {
                    var selection = new nexacro.RangeSelectionControl("selection_" + i, body);
                    selection.createComponent(true);
                    selection._control_element.setElementDisplay("none");

                    this._selections[i] = selection;
                }

                nexacro._DatePickerBodyControl.prototype.on_create_contents.call(this);
            };

            body.on_created_contents = function (win)
            {
                var control_elem = this.getElement();
                if (control_elem)
                {
                    for (var i = 0; i < this._selections.length; i++)
                        this._selections[i].on_created(win);
                }

                nexacro._DatePickerBodyControl.prototype.on_created_contents.call(this, win);
            };

            body.on_create_contents_command = function ()
            {
                var str = "";
                for (var i = 0; i < this._selections.length; i++)
                    str += this._selections[i].createCommand();

                str += nexacro._DatePickerBodyControl.prototype.on_create_contents_command.call(this);

                return str;
            };

            body.on_attach_contents_handle = function (win)
            {
                for (var i = 0; i < this._selections.length; i++)
                    this._selections[i].attachHandle(win);

                nexacro._DatePickerBodyControl.prototype.on_attach_contents_handle.call(this, win);
            };

            body.on_destroy_contents = function ()
            {
                nexacro._DatePickerBodyControl.prototype.on_destroy_contents.call(this);

                for (var i = 0; i < this._selections.length; i++)
                    this._selections[i].destroy();

                this._selections = null;
            };

            body._getSelections = function ()
            {
                return this._selections;
            };

            body._getInnerDatasetColumns = function ()
            {
                var datepicker = this._p_parent;
                if (datepicker)
                {
                    var background = datepicker._getBackgroundcolumn();
                    var border = datepicker._getBordercolumn();
                    var date = datepicker._getDatecolumn();
                    var textcolor = datepicker._getTextcolorcolumn();
                    var hinting = datepicker._getHintingcolumn();
                    var disable = datepicker._getreadonlycolumn();

                    return { backgroundcolumn: background, bordercolumn: border, datecolumn: date, textcolorcolumn: textcolor, hintingcolumn: hinting, readonlycolumn: disable };
                }

                return null;
            };

            body._setDatasetStyle = function (ds)
            {
                var day_item, date;
                var day_items = this._dayitems;
                var maxDay = this._maxDay;
                var cols = this._getInnerDatasetColumns();
                var background, border, color, hinting, disable;

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
                            hinting = ds.getColumn(i, cols.hintingcolumn);
                            disable = ds.getColumn(i, cols.readonlycolumn);

                            if (background)
                                day_item.set_background(background);
                            if (border)
                                day_item.set_border(border);
                            if (color)
                                day_item.set_color(color);
                            if (hinting)
                                day_item.set_tooltiptext(hinting);
                            if (disable != undefined)
                                day_item.set_enable(!nexacro._toBoolean(disable));

                            this._changedDays[this._changedDays.length] = day_item;
                        }
                    }
                }
            };

            body._initChangedDays = function ()
            {
                var len = this._changedDays.length;
                for (var i = (len - 1); i >= 0; i--)
                {
                    this._changedDays[i].set_background(null);
                    this._changedDays[i].set_color(null);
                    this._changedDays[i].set_border(null);
                    this._changedDays[i].set_tooltiptext(null);
                    this._changedDays[i].set_enable(true);

                    this._changedDays.pop();
                }
            };

            body._on_apply_day = function (flag)
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

            body._refreshDay = function ()
            {
                nexacro._DatePickerBodyControl.prototype._refreshDay.call(this);
                this.parent._refreshBodyEndDay();
            };

            body.on_fire_user_onkeydown = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key)
            {
                return this._p_parent.on_fire_user_onkeydown(key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key);
            };

            head.createComponent(true);
            body.createComponent(true);

            this.on_apply_datepickerchangetype(this._p_parent._p_datepickerchangetype);
        }
    };

    _pDatePickerControlEx.on_destroy_contents = function ()
    {
        nexacro.DatePickerControl.prototype.on_destroy_contents.call(this);

        if (this._overlay)
        {
            this._overlay.destroy();
            this._overlay = null;
        }
    };

    _pDatePickerControlEx._on_body_onmonthclick = function (obj, e)
    {
        if (this._skipEvent)
            return;

        nexacro.DatePickerControl.prototype._on_body_onmonthclick.call(this, obj, e);
        this._p_parent._modalYearMonthPicker(this, false);
    };

    _pDatePickerControlEx._on_body_ondayclick = function (obj, e)
    {
        if (this._skipEvent)
            return;

        this.on_fire_ondayclick(obj, e, "click");
        this._focusDate(obj, e);
    };

    _pDatePickerControlEx._on_head_onYearMonthDown = function ()
    {
        if (this._skipEvent)
            return false;

        this._p_parent._modalYearMonthPicker(this, true);
        return true;
    };

    _pDatePickerControlEx._on_head_onkeydown = function (obj, e)
    {
    };

    _pDatePickerControlEx._on_body_onkeydown = nexacro._emptyFn;

    _pDatePickerControlEx._keyAction = function (e, kind)
    {
        //      var enableaccessibility = this._env._p_enableaccessibility;
        var obj = this.body;

        if (this._overlay)
            return;

        if (this.head.monthstatic._p_visible)
        {
            if (!e.altkey && (e.keycode == nexacro.Event.KEY_LEFT || e.keycode == nexacro.Event.KEY_RIGHT ||
                e.keycode == nexacro.Event.KEY_UP || e.keycode == nexacro.Event.KEY_DOWN ||
                e.keycode == nexacro.Event.KEY_HOME || e.keycode == nexacro.Event.KEY_END ||
                e.keycode == nexacro.Event.KEY_PAGE_UP || e.keycode == nexacro.Event.KEY_PAGE_DOWN))
            {
                e.fromobject = this._focusDate(obj, e);

                if (!this._p_userange)
                    this.on_fire_ondayclick(obj, e, "arrow_key");
            }
            else if (e.keycode == nexacro.Event.KEY_SPACE || e.keycode == nexacro.Event.KEY_ENTER)
            {
                e.fromobject = this._focusDate(obj, e);
                this.on_fire_ondayclick(obj, e, "enter_key");
            }

            if (kind == "head")
                this._p_parent._modalYearMonthPicker(this, false);
        }
        else if (!this.head.monthstatic._p_visible && this.head.yearstatic.text.length < 6)
        {
            this._changeMonth(obj, e);

            if (e.keycode == nexacro.Event.KEY_ENTER)
                this._p_parent._modalYearMonthPicker(this, false);

            return true;
        }
        else
        {
            this._changeYear(obj, e);
            return true;
        }
    };

    _pDatePickerControlEx._focusDate = function (obj, e)
    {
        var body = this.body;
        var body_date = body._date;
        var year = body_date.int_year;
        var month = body_date.int_month;
        var day;
        var endday = this._getEndDay(year, month);
        var curpicker = this;
        var pickergroup = this.parent;
        var b_act = true;
        var clickday = "";

        if (e.fromreferenceobject instanceof nexacro._DatePickerDayItemControl) // lbuttondown
            clickday = e.fromreferenceobject.text.padLeft(2, "0");

        if (pickergroup._focused_day == undefined)
        {
            if (pickergroup._startdate)
            {
                year = pickergroup._startdate.substr(0, 4);
                month = pickergroup._startdate.substr(4, 2);
                day = pickergroup._startdate.substr(6, 2);
            }
            else
            {
                var curdt = pickergroup._getCurrentDate();
                year = nexacro._toString(curdt.year).padLeft(4, "0");
                month = nexacro._toString(curdt.month).padLeft(2, "0");
                day = nexacro._toString(curdt.day).padLeft(2, "0");
            }

            if (body_date.int_year != parseInt(year) || body_date.int_month != parseInt(month))
            {
                year = nexacro._toString(body_date.int_year).padLeft(4, "0");
                month = nexacro._toString(body_date.int_month).padLeft(2, "0");
                day = "01";
                b_act = false;
            }

            if (clickday)
                day = clickday;

            this._focused_day = day;
            pickergroup._setFocusedDay(year, month, day);
        }
        else
        {
            if (clickday)
                day = clickday;
            else
                day = pickergroup._focused_day;

            this._focused_day = day;
        }

        var enableaccessibility = this._env._p_enableaccessibility;

        if (b_act)
        {
            year = parseInt(year);
            month = parseInt(month);
            day = parseInt(this._focused_day);

            var is_full_changed = false;
            var is_change_year = false;
            var inc_month = false;
            var inc_day = false;
            var dec_month = false;
            var dec_day = false;

            var keycode = e.keycode;

            switch (keycode)
            {
                case nexacro.Event.KEY_LEFT:
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

                        curpicker = this._getPrevPicker(this);
                        curpicker._focused_day = day;
                        pickergroup._setCurrentPicker(curpicker);
                    }
                    break;
                case nexacro.Event.KEY_UP:
                    if (e.ctrlkey)
                    {
                        year -= 1;
                        is_full_changed = true;
                        is_change_year = true;
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

                            curpicker = this._getPrevPicker(this);
                            curpicker._focused_day = day;
                            pickergroup._setCurrentPicker(curpicker);
                        }
                    }
                    break;
                case nexacro.Event.KEY_RIGHT:
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

                        curpicker = this._getNextPicker(this);
                        curpicker._focused_day = day;
                        pickergroup._setCurrentPicker(curpicker);
                    }
                    break;
                case nexacro.Event.KEY_DOWN:
                    if (e.ctrlkey)
                    {
                        year += 1;
                        is_full_changed = true;
                        is_change_year = true;
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

                            curpicker = this._getNextPicker(this);
                            curpicker._focused_day = day;
                            pickergroup._setCurrentPicker(curpicker);
                        }
                    }
                    break;
                case nexacro.Event.KEY_HOME:
                    var stem = this._getWeekStartDayItem(day);
                    day = parseInt(stem.text);
                    break;
                case nexacro.Event.KEY_END:
                    var etem = this._getWeekLastDayItem(day);
                    day = parseInt(etem.text);
                    break;
                case nexacro.Event.KEY_PAGE_UP:
                    day = 1;
                    break;
                case nexacro.Event.KEY_PAGE_DOWN:
                    day = endday;
                    break;
            }

            year = nexacro._toString(year).padLeft(4, "0");
            month = nexacro._toString(month).padLeft(2, "0");
            day = nexacro._toString(day).padLeft(2, "0");

            this._focused_day = day;
            pickergroup._setFocusedDay(year, month, day);

            if (is_change_year)
                pickergroup._rearrangeYearMonth(curpicker, year, month);
        }

        var item = curpicker.body._getDayItem(day);
        item._setFocus(false);

        // accessibility
        if (enableaccessibility)
        {
            if (is_full_changed)
                item._setAccessibilityLabel(year + " " + month + " " + day);
        }

        return item;
    };

    _pDatePickerControlEx.on_lbuttondown_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        nexacro.DatePickerControl.prototype.on_lbuttondown_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
        this._common_down_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
    };

    _pDatePickerControlEx.on_touch_lbuttondown_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, fire_comp, refer_comp, meta_key)
    {
        nexacro.DatePickerControl.prototype.on_touch_lbuttondown_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
        this._common_down_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
    };

    _pDatePickerControlEx.on_touchstart_basic_action = function (touch_manager, touchinfos, changedtouchinfos, refer_comp)
    {
        nexacro.DatePickerControl.prototype.on_touchstart_basic_action.call(this, touch_manager, touchinfos, changedtouchinfos, refer_comp);

        var touchinfo = nexacro._getFirstTouchInfo(changedtouchinfos);
        this._common_down_action(touchinfo.target, "touch", false, false, false, touchinfo.canvasx, touchinfo.canvasy, touchinfo.screenx, touchinfo.screeny, refer_comp);
    };

    _pDatePickerControlEx._common_down_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        if (refer_comp instanceof nexacro._DatePickerDayItemControl)
        {
            var body = this.body;
            var body_date = body._date;
            var year = body_date.int_year;
            var month = body_date.int_month;
            var day = refer_comp.text.padLeft(2, "0");
            var pickergroup = this.parent;

            this._focused_day = day;
            pickergroup._setFocusedDay(year, month, day);
        }
    };

    _pDatePickerControlEx._getWeekStartDayItem = function (day)
    {
        if (day == -1)
        {
            return null;
        }

        var item = this.body._getDayItem(day);
        var idx = parseInt(item.id.replace(/^\D+/g, ''), 10);
        var adjust = idx % 7;

        day -= adjust;

        if (day < 1)
            day = 1;

        return this.body._getDayItem(day);
    };

    _pDatePickerControlEx._getWeekLastDayItem = function (day)
    {
        if (day == -1)
        {
            return null;
        }

        var item = this.body._getDayItem(day);
        var idx = parseInt(item.id.replace(/^\D+/g, ''), 10);
        var adjust = idx % 7;

        day -= adjust;
        day += 6;

        var body_date = this.body._date;
        var year = body_date.int_year;
        var month = body_date.int_month;
        var lastday = this._getEndDay(year, month);

        if (day > lastday)
            day = lastday;

        return this.body._getDayItem(day);
    };

    _pDatePickerControlEx._getPrevPicker = function ()
    {
        var year = this.body._date.int_year;
        var month = this.body._date.int_month;

        if (month > 1)
        {
            month--;
        }
        else
        {
            year--;
            month = 12;
        }

        if (this.parent._isShowMonth(year, month))
        {
            return this.parent._getPrevShowPicker(this);
        }
        else
        {
            this.parent._movePrev(true);
            return this.parent._getPrevShowPicker(this);
        }
    };

    _pDatePickerControlEx._getNextPicker = function ()
    {
        var year = this.body._date.int_year;
        var month = this.body._date.int_month;

        if (month < 12)
        {
            month++;
        }
        else
        {
            year++;
            month = 1;
        }

        if (this.parent._isShowMonth(year, month))
        {
            return this.parent._getNextShowPicker(this);
        }
        else
        {
            this.parent._moveNext(true);
            return this.parent._getNextShowPicker(this);
        }
    };

    _pDatePickerControlEx._cancelSelectYearMonth = function ()
    {
        var body = this.body;
        var head = this.head;

        body._years_visible(false);
        body._months_visible(false);

        body._days_visible(true);
        body.weekband.set_visible(true);

        for (var i = 0; i < body._maxWeek; i++)
        {
            body._weekitems[i].set_visible(true);
        }

        head.yearstatic.set_visible(true);
        head.monthstatic.set_visible(true);
    };


    _pDatePickerControlEx._getHeadheight = function ()
    {
        var group = this._p_parent;
        if (group)
        {
            return group._headheight;
        }

        return null;
    };

    _pDatePickerControlEx.set_overlaybackground = function (v)
    {
        this._p_overlaybackground = v;
    };

    _pDatePickerControlEx.set_overlayopacity = function (v)
    {
        this._p_overlayopacity = v;
    };

    _pDatePickerControlEx._getHintingcolumn = function ()
    {
        return this._p_parent._p_hintingcolumn;
    };

    _pDatePickerControlEx._getreadonlycolumn = function ()
    {
        return this._p_parent._p_readonlycolumn;
    };

    _pDatePickerControlEx._lock = function (show)
    {
        if (this._overlay)
        {
            this._overlay.destroy();
            this._overlay = null;
        }

        if (show)
        {
            var w = this._control_element.inner_width;
            var h = this._control_element.inner_height;
            var overlay = this._overlay = new nexacro.Component("overlay", 0, 0, w, h, null, null, null, null, null, null, this);
            this._overlay._type_name = "StaticControl";

            overlay._setControl();
            overlay._is_nc_control = true;
            overlay._is_simple_control = true;
            overlay.set_background(this._p_overlaybackground);
            overlay.set_opacity(this._p_overlayopacity);
            overlay.createComponent();
        }
    };

    _pDatePickerControlEx.on_change_containerRect = function (width, height)
    {
        nexacro.DatePickerControl.prototype.on_change_containerRect.call(this, width, height);
        if (this._overlay)
        {
            var w = this._control_element.inner_width;
            var h = this._control_element.inner_height;
            this._overlay.resize(w, h);
        }
    };

    _pDatePickerControlEx._setYearMonth = function (year, month)
    {
        this._year_month = { year: year, month: month };
        this._setValue(this._p_value);
    };

    _pDatePickerControlEx._getYearMonthStr = function ()
    {
        var datestr;
        datestr = this._year_month ? this._year_month.year.toString().padLeft(4, "0") : "0000";
        datestr += this._year_month ? this._year_month.month.toString().padLeft(2, "0") : "00";
        return datestr;
    };

    _pDatePickerControlEx._setValue = function (v)
    {
        this._p_value = v;
        this._value = v;

        if (!this._year_month)  // value를 설정하려면 먼저 year, month가 설정되어 있어야 함.
            return;

        var ymtext = this._getYearMonthStr();

        if (!this._value || this._value.substr(0, 6) != ymtext)
        {
            this._p_value = null;
            this._value = ymtext + "01";
        }

        this.on_apply_value(this._value);
    };

    _pDatePickerControlEx.on_apply_value = function (value)
    {
        var year = value.substr(0, 4);
        var month = value.substr(4, 2);
        var day = value.substr(6, 2);

        this._selected_year = year;
        this._selected_month = month;

        if (this._p_value)
            this._selected_day = day;
        else
            this._selected_day = "";

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

    _pDatePickerControlEx._setEndValue = function (v)
    {
        this._prev_endvalue = this._endvalue;
        this._endvalue = v;
        this.on_apply_endvalue();
    };

    _pDatePickerControlEx.on_apply_endvalue = function ()
    {
        var body = this.body;

        if (this._p_userange)
            body._refreshDay();
    };

    _pDatePickerControlEx._refreshBodyEndDay = function ()
    {
        var body = this.body;
        var day, endvalue;

        if (this._prev_endvalue)
        {
            endvalue = this._prev_endvalue;
            day = endvalue.substr(6, 2);

            if (endvalue != this._value)
            {
                var item = body._getDayItem(day);
                if (item)
                    item._changeUserStatus("selected", false);
            }
        }

        if (this._endvalue)
        {
            endvalue = this._endvalue;
            day = endvalue.substr(6, 2);

            var item = body._getDayItem(day);
            if (item)
                item._changeUserStatus("selected", this._p_userange);
        }
    };

    _pDatePickerControlEx._updateInvalidDisplay = function (invaild_startdate, invalid_enddate)
    {
        var dayitem;
        var c_month = this._getYearMonthStr();
        var s_day, e_day;
        var body = this.body;

        if (invaild_startdate)
        {
            var s_month = invaild_startdate.substr(0, 6);
            var s_day = invaild_startdate.substr(6, 2);

            if (s_month == c_month)
            {
                var item = body._getDayItem(s_day);
                item._changeUserStatus("selected", true);
            }
        }

        this._invalid_eday = "";

        if (invalid_enddate)
        {
            var e_month = invalid_enddate.substr(0, 6);
            var e_day = invalid_enddate.substr(6, 2);

            if (e_month == c_month)
            {
                var item = body._getDayItem(e_day);
                item._changeUserStatus("selected", true);
            }
        }
    };

    _pDatePickerControlEx.set_userange = function (v)
    {
        if (this._p_userange != v)
        {
            this._p_userange = v;
            this.on_apply_userange();
        }
    }

    _pDatePickerControlEx.on_apply_userange = function (v)
    {
        this.on_apply_endvalue();
    };

    _pDatePickerControlEx._updateMinMaxDay = function (mindate, maxdate)
    {
        if (!mindate)
            mindate = "00000000";
        if (!maxdate)
            maxdate = "99999999";

        var dayitems = this.body._dayitems;
        var c_month = this._getYearMonthStr();

        for (var i = 0; i < dayitems.length; i++)
        {
            var date = c_month + dayitems[i].text.padLeft(2, "0");

            if (mindate > date || maxdate < date)
                dayitems[i]._setEnable(false);
            else
                dayitems[i]._setEnable(this._real_enable && true);
        }
    };

    _pDatePickerControlEx._updateSelection = function (startdate, enddate)
    {
        var dayitems = this.body._dayitems;
        var day_w = dayitems[0]._adjust_width;
        var day_h = dayitems[0]._adjust_height;

        if (!day_w || !day_h)
            return;

        var s_month = startdate.substr(0, 6);
        var s_day = startdate.substr(6, 2);
        var e_month = enddate.substr(0, 6);
        var e_day = enddate.substr(6, 2);
        var c_month = this._getYearMonthStr();

        function findDayItem(days, day)
        {
            day = parseInt(day) + "";
            for (var i = 0; i < days.length; i++)
            {
                if (days[i].text == day)
                    return days[i];
            }
            return null;
        };

        var s_dayitem, e_dayitem;
        var selections = this.body._getSelections();

        if (s_month <= c_month && c_month <= e_month)
        {
            if (s_month == c_month)
                s_dayitem = findDayItem(dayitems, s_day);

            if (e_month == c_month)
                e_dayitem = findDayItem(dayitems, e_day);

            var l, t, w, h;

            // (7 x 6) matrix
            var matrix = new Array(6);
            for (var row = 0, idx = 0; row < 6; row++)
            {
                matrix[row] = new Array(7);
                for (var col = 0; col < 7; col++)
                {
                    matrix[row][col] = (dayitems[idx].text) ? dayitems[idx] : null;
                    idx++;
                }
            }

            for (var i = 0; i < 6; i++)
            {
                var top = -1, left = -1, width = 0, height = day_h;

                for (var j = 0; j < 7; j++)
                {
                    if (matrix[i][j])
                    {
                        if (s_dayitem && parseInt(s_dayitem.text) > parseInt(matrix[i][j].text))
                            continue;
                        if (e_dayitem && parseInt(e_dayitem.text) < parseInt(matrix[i][j].text))
                            break;

                        if (left < 0)
                            left = matrix[i][j]._adjust_left;
                        if (top < 0)
                            top = matrix[i][j]._adjust_top;

                        width += matrix[i][j]._adjust_width;
                    }
                }

                if (left < 0)
                {
                    selections[i]._control_element.setElementDisplay("none");
                }
                else
                {
                    selections[i].move(left + 1, top + 1, width - 2, height - 2);
                    selections[i]._control_element.setElementDisplay("");
                }

            }
        }
        else
        {
            this._displayNoneSelection();
        }
    };

    _pDatePickerControlEx._displayNoneSelection = function ()
    {
        var selections = this.body._getSelections();

        for (var i = 0; i < 6; i++)
        {
            selections[i]._control_element.setElementDisplay("none");
        }
    };

    _pDatePickerControlEx.on_fire_ondayclick = function (obj, e, kind)
    {
        if (this.ondayclick && this.ondayclick._has_handlers)
        {
            if (!e)
            {
                if (!this._focused_day)
                    return;

                var item = this.body._getDayItem(this._focused_day);
                e = new nexacro.CalendarDayClickEventInfo(item, "ondayclick", this._value);
            }

            e.kind = kind;

            return this.ondayclick._fireEvent(this, e);
        }
        return false;
    };

    _pDatePickerControlEx._on_focus = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        nexacro.Component.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);

        var pickergroup = this.parent;
        var body_date = this.body._date;

        if (pickergroup._focused_day)
        {
            if (body_date.int_year == parseInt(pickergroup._focused_year) && body_date.int_month == parseInt(pickergroup._focused_month))
            {
                var item = this.body._getDayItem(pickergroup._focused_day);
                if (item)
                    item._setFocus(false);
            }
            else
            {
                this.body._setFocus(false);
            }
        }
        else
        {
            this.body._setFocus(false);
        }
    };

    _pDatePickerControlEx.on_fire_user_onkeydown = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key) // datepicker
    {
        return this._p_parent.on_fire_user_onkeydown(key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key);
    };

    _pDatePickerControlEx._getCanHscroll = function (hscrollbar, dragscrolltype, xdeltavalue)
    {
        var can_hscroll = false;
        if (xdeltavalue != 0 && (dragscrolltype != "none" && dragscrolltype != "vert"))
        {
            var hlimit, hpos, proc = true;

            if (hscrollbar)
            {
                if (hscrollbar._p_enable)
                {
                    hlimit = hscrollbar.max;
                    hpos = hscrollbar.pos;
                }
                else
                {
                    proc = false;
                }
            }
            else
            {
                hlimit = this._control_element.hscroll_limit;
                hpos = this.getHScrollPos();
            }

            if (proc)
            {
                if (xdeltavalue < 0) // 왼쪽으로 Swipe -> 오른쪽으로 스크롤
                {
                    if (hpos < hlimit)
                        can_hscroll = true;
                }
                else // 오른쪽으로 Swipe -> 왼쪽으로 스크롤
                {
                    if (hpos > 0)
                        can_hscroll = true;
                }
            }
        }
        return can_hscroll;
    };

    _pDatePickerControlEx._getCanVscroll = function (vscrollbar, dragscrolltype, ydeltavalue)
    {
        var can_vscroll = false;
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

    //===============================================================
    // nexacro.RangeSelectionControl
    //===============================================================
    nexacro.RangeSelectionControl = function (id, parent)
    {
        nexacro.Component.call(this, ((id) ? id : "selection"), 0, 0, 0, 0, null, null, null, null, null, null, parent);
    };

    var _pRangeSelectionControl = nexacro._createPrototype(nexacro.Component, nexacro.RangeSelectionControl);
    nexacro.RangeSelectionControl.prototype = _pRangeSelectionControl;

    _pRangeSelectionControl._is_subcontrol = true;
    _pRangeSelectionControl._is_simple_control = true;
    _pRangeSelectionControl._type_name = "StaticControl";

    _pRangeSelectionControl.on_getIDCSSSelector = function ()
    {
        return "selection";
    };

    //==============================================================================
    // nexacro.DatePickerSplitLine
    //==============================================================================
    nexacro.DatePickerSplitLine = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pDatePickerSplitLine = nexacro._createPrototype(nexacro.Component, nexacro.DatePickerSplitLine);
    nexacro.DatePickerSplitLine.prototype = _pDatePickerSplitLine;

    _pDatePickerSplitLine._type_name = "StaticControl";

    _pDatePickerSplitLine._is_simple_control = true;
    _pDatePickerSplitLine._is_subcontrol = true;
    _pDatePickerSplitLine._is_nc_control = true;
    _pDatePickerSplitLine._is_horz = false;

    _pDatePickerSplitLine.on_getIDCSSSelector = function ()
    {
        return "splitline";
    };

    _pDatePickerSplitLine.on_create_contents = function ()
    {
        this._setDirection(this._is_horz);
    };

    _pDatePickerSplitLine._setDirection = function (is_horz)
    {
        this._is_horz = is_horz;
        if (this._is_horz)
            this._control_element.setElementBorderNone(true, false, true, true);
        else
            this._control_element.setElementBorderNone(true, true, false, true);
    };

    //==============================================================================
    // nexacro.DateRangePickerDayClickEventInfo
    //============================================================================== 
    nexacro.DateRangePickerDayClickEventInfo = function (obj, id, date, rangeposition)
    {
        this.id = this.eventid = id || "ondayclick";
        this.fromobject = this.fromreferenceobject = obj;

        this.date = date;
        this.rangeposition = rangeposition;
    };
    var _pDateRangePickerDayClickEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.DateRangePickerDayClickEventInfo);
    nexacro.DateRangePickerDayClickEventInfo.prototype = _pDateRangePickerDayClickEventInfo;
    _pDateRangePickerDayClickEventInfo._type_name = "DateRangePickerDayClickEventInfo";


    nexacro._defineProperties(_pDateRangePicker, _pDateRangePicker._properties);

    _pDateRangePickerDayClickEventInfo = null;
    _pDateRangePicker = null;
    _pPickerHeadLineControl = null;
    _pTimePickerGroup = null;
    _pDatePickerGroup = null;
    _pPickerGroup = null;
    _pDatePickerControlEx = null;
    _pDatePickerSplitLine = null;
    _pRangeSelectionControl = null;
};