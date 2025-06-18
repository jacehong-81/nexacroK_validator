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

if (!nexacro.DateField)
{
    //==============================================================================
    // nexacro.DateField (flexible)
    //==============================================================================
    nexacro.DateField = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay)
    {
        nexacro.TextField.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay);

        this._masktypeobj = new nexacro._EditMaskTypeDate();
        this._range = null;
        this._ranges_order = null;
        this._select_ranges = [];
        this._point_range = null;
    };

    var _pDateField = nexacro._createPrototype(nexacro.TextField, nexacro.DateField);
    nexacro.DateField.prototype = _pDateField;
    _pDateField._type_name = "DateField";

    _pDateField._boxcontrol_socket = {
        instance_name: "DateFieldBox",
        id: "box"
    };

    /* fixed prop */
    _pDateField._p_usecharcount = false;

    /* default properties */
    _pDateField._p_value = undefined;
    _pDateField._p_format = "";
    _pDateField._p_inputtype = "date";
    _pDateField._p_usedropbutton = true;
    _pDateField._p_datetimepicker = null;
    _pDateField._p_popuptype = "default";
    _pDateField._p_popupsize = undefined;
    _pDateField._p_displayformat = "";
    _pDateField._p_innerdataset = "";
    _pDateField._p_backgroundcolumn = "";
    _pDateField._p_bordercolumn = "";
    _pDateField._p_datecolumn = "";
    _pDateField._p_textcolorcolumn = "";
    _pDateField._p_hintingcolumn = "";
    _pDateField._p_readonlycolumn = "";
    _pDateField._p_headlinedateformat = "";
    _pDateField._p_headlinetimeformat = "";
    _pDateField._p_headlineposition = "top";
    _pDateField._p_headlinesize = undefined;
    _pDateField._p_useheadline = undefined;
    _pDateField._p_maskchar = "";
    _pDateField._p_invalidvalueaction = "empty";
    _pDateField._p_locale = undefined;
    _pDateField._p_closebuttontext = "CLOSE";
    _pDateField._p_okbuttontext = "OK";
    _pDateField._p_cancelbuttontext = "CANCEL";
    //_pDateField._p_closebuttonsize = "";

    _pDateField._properties = [
        { name: "value" },
        { name: "text", readonly: true },
        { name: "format" },
        { name: "inputtype" },
        { name: "usedropbutton" },
        { name: "datetimepicker" },
        { name: "popuptype" },
        { name: "popupsize" },
        { name: "displayformat" },
        { name: "innerdataset" },
        { name: "backgroundcolumn" },
        { name: "bordercolumn" },
        { name: "datecolumn" },
        { name: "textcolorcolumn" },
        { name: "hintingcolumn" },
        { name: "readonlycolumn" },
        { name: "headlinedateformat" },
        { name: "headlinetimeformat" },
        { name: "headlineposition" },
        { name: "headlinesize" },
        { name: "useheadline" },
        { name: "maskchar" },
        { name: "invalidvalueaction" },
        { name: "locale" },
        { name: "visible" },
        { name: "closebuttontext" },
        { name: "okbuttontext" },
        { name: "cancelbuttontext" },
        //{ name: "closebuttonsize" },
    ];

    /* internal variable */
    _pDateField._default_locale_date_style = "MEDIUMDATE";
    _pDateField._default_locale_time_style = "MEDIUMTIME";
    _pDateField._popuptype = (nexacro._isTouchInteraction) ? "mobile" : "normal";
    _pDateField._input_type = "";
    _pDateField._invalid_value = null;
    _pDateField._popupcontrol = null;
    _pDateField._masktypeobj = null;
    _pDateField._mask_char = "";
    _pDateField._append_typing_cnt = 0;
    _pDateField._is_repeat = true;
    _pDateField._is_locale_control = true;
    _pDateField._innerdataset = null;
    _pDateField._invalid_date_text = "Invalid Date";
    _pDateField._time_init_value = "000000000";
    _pDateField._displayformat = "";

    nexacro.DateField.EndDayNormal = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    nexacro.DateField.EndDayLeap = new Array(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

    /* event list */
    _pDateField._event_list = {
        "oneditclick": 1,
        "onkeydown": 1, "onkeyup": 1,
        "onkillfocus": 1, "onsetfocus": 1,
        "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1, "onmousedown": 1, "onmouseup": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1,
        "onmove": 1, "onsize": 1,
        "canchange": 1, "onchanged": 1, "oninput": 1,
        "oncontextmenu": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1, "ondevicebuttonup": 1,
        "oninvalid": 1,
        "ondropdown": 1, "ondayclick": 1, "oncloseup": 1,
        "oninnerdatachanged": 1
    };

    /* accessibility */
    _pDateField.accessibilityrole = "DateField";

    //===============================================================
    // nexacro.DateField : Create & Destroy & Update
    //===============================================================
    _pDateField.on_create_contents = function ()
    {
        var bMobile = ((nexacro._isMobile && nexacro._isMobile()) || (nexacro._isHybrid && nexacro._isHybrid()) || (!nexacro._isDesktop() && nexacro._OS == "Android" && nexacro._Browser == "Runtime")) || nexacro._isTouchInteraction;

        if (bMobile)
            this._onlydisplay = true;

        nexacro.TextField.prototype.on_create_contents.call(this);

        var maskobj = this._masktypeobj;
        if (maskobj)
        {
            var mode = "number";
            var useeditbuffer = true;

            if (bMobile)
            {
                this._is_repeat = false;

                if ((!this._popuptype || this._popuptype == "system") && this._type == "normal")
                {
                    mode = "date";
                    useeditbuffer = false;
                    this._type = "system";
                }
            }

            maskobj.setInputMode(mode);
            maskobj.setUseEditBuffer(useeditbuffer);
        }

        var input_elem = this._input_element = this._getInputElement();

        if (!this._onlydisplay)
        {
            input_elem.setElementInputType("date");
        }
        else
            input_elem._firstchild = true;

        this.on_apply_usedropbutton();
        this.on_apply_iconbuttonsize();
    };

    _pDateField.on_created_contents = function (win)
    {
        nexacro.TextField.prototype.on_created_contents.call(this, win);
    };

    _pDateField.on_after_created_ext = function ()
    {
        nexacro.TextField.prototype.on_after_created_ext.call(this);
        this.on_apply_locale(this._getLocale());

        if (this._p_expr)
            this._on_apply_expr(this._p_expr);
        else
            this.on_apply_value(this._p_value);

        switch (this._type)
        {
            case "system":
                if (this._env._p_enableaccessibility && this._env._a11ytype == 4)
                {
                    var control_elem = this.getElement();
                    if (control_elem)
                        control_elem.setElementAccessibilityStatHidden(false);
                }

                if (this._p_accessibilitydesclevel != "none" && this._p_accessibilitydesclevel != "child")
                    this._setAccessibilityActiveDescendant(this._input_element);

                break;
            case "normal":
            default:

                break;
        }

        this._default_value = this._p_value;
        this._default_text = this._p_text;
        this.on_apply_displaynulltext(this._p_displaynulltext);
        if (this._p_readonly)
            this.on_apply_readonly();
    };

    _pDateField.on_destroy_contents = function ()
    {
        nexacro.TextField.prototype.on_destroy_contents.call(this);

        this._removeEventHandlerToInnerDataset();
        this._masktypeobj = null;
        this._range = null;
        this._ranges_order = null;
        this._select_ranges = null;
        this._append_typing_range = null;
        this._point_range = null;
    };

    _pDateField._correctInvalidValue = function (value)
    {
        var length;
        switch (this._input_type)
        {
            case "date":
                length = 8;
                break;
            case "time":
                length = 9;
                break;
            case "datetime":
                length = 17;
                break;
        }
        value = value.replace(/[^0-9]/g, "");

        while (value.length < length)
        {
            value += "0";
        }

        value = this._masktypeobj.changeNormalizeValue(value);
        return value;
    };

    _pDateField.on_input_focus = function ()
    {
        var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);
        if (bMobile)
        {
            this._setDatePickerValue(this._p_value);
            this._showPopup();
            this._setInitCaret();
        }

        if (this._p_autoselect)
            this._selectAll();
    };

    _pDateField._apply_setfocus = function (evt_name)
    {
        this._processing_updateToDataset = false;

        var input_elem = this._input_element;
        if (input_elem)		
        {
            var value = this._p_value;
            var text = "";

            var maskobj = this._getMaskObj();
            if (maskobj)
            {
                if (!this._onlydisplay)
                    maskobj.setEditStatus(true);

                if (this._p_value == "") // invalid
                {
                    value = this._p_value;
                    text = this._p_text;
                    // this._invalid_value 는 이전 this._p_value = "" 설정 시점에 설정 되어야 함.
                }
                else if (this._p_value && isNaN(parseInt(this._p_value)))   // value와 format이 섞인 경우
                {
                    this._invalid_value = this._p_value;
                    value = this._p_value = "";
                    text = this._p_text;
                }
                else
                {
                    text = this._makeBufferTextFromValue(value);
                }

                if (evt_name)
                {
                    this._default_value = value;
                    this._default_text = text;
                }

                if (!this._onlydisplay)
                {
                    var pos = input_elem._last_selection_range;
                    if (pos && !this._p_autoselect)
                    {
                        this._caret_pos = { begin: pos[0], end: pos[1] };
                    }

                    if (text != "")
                    {
                        input_elem.setElementValue(text);
                    }
                    else
                    {
                        var empty = this._getEmptyText();
                        input_elem.setElementValue(empty);
                    }
                }
                else
                {
                    if (text != "")
                    {
                        input_elem.setElementText(text);
                    }
                    else
                    {
                        var empty = this._getEmptyText();
                        input_elem.setElementText(empty);
                    }
                }
            }

            if (!this._onlydisplay)
            {
                // input에 직접 label을 설정하므로 필요없음
                //if (this._env._p_enableaccessibility && evt_name != "tabkey" && evt_name != "shifttabkey" && !this._isComponentKeydownAction())
                //    nexacro._notifyAccessibilityInputElement(this._getAccessibilityReadLabel());

                input_elem.setElementFocus(evt_name);

                text = input_elem.getElementText();
                if (text != this._p_text)
                {
                    this._default_text = this._p_text = text;
                }

                if (!this._p_autoselect)
                {
                    var range = this._findRangeFromPos(0);

                    if (range)
                    {
                        if (this._append_typing_range != range)
                            this._clearTypingRange();

                        input_elem.setElementSetSelect(range.beg, range.end);
                    }
                }
            }
        }
    };

    _pDateField._setEventHandlerToTrailingButton = function ()
    {
        var dropbutton = this._box._trailbutton;

        if (dropbutton)
        {
            var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);
            if (bMobile)
            {
                if (this._type == "system")
                    dropbutton._setEventHandler("onclick", this._on_edit_oneditclick, this);
                else
                {
                    dropbutton._setEventHandler("onclick", this._on_drop_mobile_onclick, this);
                    //dropbutton._setEventHandler("onkeydown", this._on_edit_onkeydown, this);
                }
            }
            else
            {
                dropbutton._setEventHandler("onclick", this._on_drop_onclick, this);
                dropbutton._setEventHandler("onlbuttondown", this._on_drop_onlbuttondown, this);
            }
        }
    };

    //===============================================================
    // nexacro.DateField : Properties
    //===============================================================
    _pDateField.set_inputtype = function (v)
    {
        if (v)
            v = v.toLowerCase();

        if (this._p_inputtype != v)
        {
            this._inputtype_obj = null;

            switch (v)
            {
                case "date":
                case "datetime":
                case "time":
                    this._p_inputtype = v;
                    break;
                default:
                    return;
            }

            this.on_apply_inputtype();
            this.on_apply_value();
        }
    };

    _pDateField._makeAMPM = function ()
    {
        this._ampm = nexacro.Locale._getAmPm(this._locale);
    };

    _pDateField.on_apply_inputtype = function ()
    {
        var inputtype = this._p_inputtype;
        var editformat = "";

        this._input_type = inputtype;

        if (this._p_format)
        {
            if (this._p_inputtype.indexOf("date") >= 0)
            {
                if (this._p_format.indexOf("SHORTDATE") >= 0)
                    editformat = nexacro.Locale._makeDateMaskStringFromIntl(this._locale, "SHORTDATE");
                else if (this._p_format.indexOf("MEDIUMDATE") >= 0)
                    editformat = nexacro.Locale._makeDateMaskStringFromIntl(this._locale, "MEDIUMDATE");
                else if (this._p_format.indexOf("LONGDATE") >= 0)
                    editformat = nexacro.Locale._makeDateMaskStringFromIntl(this._locale, "LONGDATE");
                else if (this._p_format.indexOf("FULLDATE") >= 0)
                    editformat = nexacro.Locale._makeDateMaskStringFromIntl(this._locale, "FULLDATE");
                else
                    editformat = this._p_format;
            }

            if (this._p_inputtype.indexOf("time") >= 0)
            {
                if (editformat)
                    editformat += " ";

                if (this._p_format.indexOf("SHORTTIME") >= 0)
                    editformat += nexacro.Locale._makeTimeMaskStringFromIntl(this._locale, "SHORTTIME");
                else if (this._p_format.indexOf("MEDIUMTIME") >= 0)
                    editformat += nexacro.Locale._makeTimeMaskStringFromIntl(this._locale, "MEDIUMTIME");
                else
                    editformat = this._p_format;
            }

            this._format = editformat;
        }
        else
        {
            if (this._p_inputtype.indexOf("date") >= 0)
            {
                editformat = nexacro.Locale._makeDateMaskStringFromIntl(this._locale, this._default_locale_date_style);
            }

            if (this._p_inputtype.indexOf("time") >= 0)
            {
                if (editformat)
                    editformat += " ";

                editformat += nexacro.Locale._makeTimeMaskStringFromIntl(this._locale, this._default_locale_time_style);
            }

            this._format = editformat;
        }


        this._input_type = "";
        if (editformat.indexOf("y") >= 0 || editformat.indexOf("M") >= 0 || editformat.indexOf("d") >= 0)
            this._input_type += "date";
        if (editformat.indexOf("H") >= 0 || editformat.indexOf("h") >= 0 || editformat.indexOf("m") >= 0 || editformat.indexOf("m") >= 0 || editformat.indexOf("s") >= 0)
            this._input_type += "time";

        if (!this._p_displayformat)
        {
            this._displayformat = editformat;
            this._masktypeobj.setDateMask(editformat);
        }

        this._masktypeobj.setEditMask(editformat);
        this._makeAMPM();
        this._analyzeFormatRange();

        if (this._p_value == "")   // empty는 invalid, invalid 상태에서 format을 바꿀 경우
            this._p_text = this._getEmptyText();

        this._inputtype_obj = new nexacro._EditInputType();

        var input_elem = this._getInputElement();
        if (input_elem && !this._onlydisplay)
        {
            input_elem.setElementInputType("text");
        }
    };

    _pDateField.set_maskchar = function (v)
    {
        if (this._p_maskchar != v)
        {
            this._p_maskchar = v;
            this._mask_char = v;
        }
    }

    _pDateField.set_invalidvalueaction = function (v)
    {
        if (this._p_invalidvalueaction != v)
        {
            switch (v)
            {
                case "rollback":
                case "empty":
                case "minimum":
                    break;
                default:
                    return;
            }
            this._p_invalidvalueaction = v;
        }
    }

    _pDateField.set_useheadline = function (v)
    {
        if (this._p_useheadline != v)
        {
            this._p_useheadline = v;
        }
    };

    _pDateField.set_headlinedateformat = function (v)
    {
        if (this._p_headlinedateformat != v)
        {
            this._p_headlinedateformat = v;
        }
    };

    _pDateField.set_headlinetimeformat = function (v)
    {
        if (this._p_headlinetimeformat != v)
        {
            this._p_headlinetimeformat = v;
        }
    };

    _pDateField.set_headlineposition = function (v)
    {
        if (this._p_headlineposition != v)
        {
            this._p_headlineposition = v;
        }
    };

    _pDateField.set_headlinesize = function (v)
    {
        if (this._p_headlinesize != v)
        {
            this._p_headlinesize = v;
        }
    };
    _pDateField.set_closebuttontext = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_closebuttontext != v)
        {
            this._p_closebuttontext = v;
        }
    };


    _pDateField.set_okbuttontext = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_okbuttontext != v)
        {
            this._p_okbuttontext = v;
            this.on_apply_okbuttontext();
        }
    };

    _pDateField.on_apply_okbuttontext = function (v)
    {
        var datepicker = this._p_datetimepicker;
        if (datepicker)
        {
            datepicker.set_okbuttontext(this._p_okbuttontext);
        }
    };

    _pDateField.set_cancelbuttontext = function (v)
    {
        if (this._p_cancelbuttontext != v)
        {
            this._p_cancelbuttontext = v;
            this.on_apply_cancelbuttontext();
        }
    };

    _pDateField.on_apply_cancelbuttontext = function (v)
    {
        var datepicker = this._p_datetimepicker;
        if (datepicker)
        {
            datepicker.set_cancelbuttontext(this._p_cancelbuttontext);
        }
    };

    _pDateField.set_value = function (v)
    {
        if (typeof (v) == "string")
        {
            v = v.toLowerCase();

            if (v == "today")
                v = this._getCurrentDateVal();
        }

        var check;
        var dateobj = this._convertToDateObject(v);

        if (v === "")
            check = false;
        else
            check = this._checkApplyValidate(dateobj);

        this._invalidStatus(false);
        this._validStatus(false);

        if (check == false)
        {
            this.on_invalid(true);
            this._p_text = this._makeBufferTextFromValue(v);
        }
        else if (check == true)
        {
            v = this._convertValueType(v, dateobj);
            this.on_valid(true);
        }

        if (this._p_value !== v)
        {
            if (!this.applyto_bindSource("value", v))
            {
                return;
            }

            this._setValue(v, true, check);
        }
        else
        {
            var input_elem = this._getInputElement();
            if (input_elem && input_elem._getInputValue() != v)
                this._setValue(v, true, check);
        }
    };

    _pDateField._setValue = function (v, no_chk_valid, check)
    {
        if (!no_chk_valid)
        {
            if (check == undefined)
            {
                this._invalidStatus(false);
                this._validStatus(false);

                check = this._checkApplyValidate(v);

                if (check == false)
                    this.on_invalid(true);
                else if (check == true)
                    this.on_valid(true);
            }

            if (check == true)
            {
                var dateobj = this._convertToDateObject(v);
                v = this._convertValueType(v, dateobj);
            }
        }

        this._p_value = v;
        this._clearTypingRange();
        this.on_apply_value(v, check);
    };

    _pDateField.on_apply_value = function (value, check)
    {
        if (value == undefined)
            value = this._p_value;

        value = nexacro._isNull(value) ? value : nexacro._toString(value).trim();

        var proc;

        if (this._input_element)
        {
            proc = this._input_element._processing_oninput;
            this._input_element._processing_oninput = true;
        }

        if (nexacro._isNull(check))
            check = this._checkApplyValidate(value);

        if (check == true)
            this._p_text = this._makeBufferTextFromValue(value);
        else if (check == -1)
            this._p_text = "";

        var b_focused = this._isFocused();
        var input_elem = this._getInputElement();
        if (input_elem)
        {
            var text = this._p_text;
            if (!this._onlydisplay)
            {
                var pos = input_elem.getElementCaretPos();
                if (text != "")
                {
                    if (b_focused)
                    {
                        input_elem.setElementValue(text);
                    }
                    else
                    {
                        if (value != null)
                            input_elem.setElementValue(this.getDisplayText());
                        else
                            input_elem.setElementValue("");
                    }
                }
                else
                {
                    if (b_focused)
                        input_elem.setElementValue(this._getEmptyText());
                    else
                        input_elem.setElementValue("");
                }

                var range = this._findRangeFromPos(pos.begin);
                input_elem.setElementSetSelect(range ? range.beg : 0, range ? range.end : 0);
            }
            else
            {
                if (value)
                {
                    if (b_focused)
                        input_elem.setElementText(text);
                    else
                        input_elem.setElementText(this.getDisplayText());
                }
                else
                    input_elem.setElementText("");
            }

            this._updateAccessibilityLabel();
            this._default_value = this._p_value;
            this._default_text = this._p_text;

            if (!b_focused)
                this._setLabelFloating(this._isContainsText(), undefined, true);

            this._refreshLabel("value");
            this._input_element._processing_oninput = proc;
        }
    };

    _pDateField._on_apply_text = function (text)    // expr only
    {
        var exprfn = this._expr_fn;
        if (exprfn)
        {
            try
            {
                text = nexacro._toString(exprfn.call(null, this));
            }
            catch (e)
            {
                if (e && e.message)
                    trace(e.message);
            }
        }
        if (this._p_expr.substring(0, 4) == "Date")
        {
            text = new nexacro.Date(text).toString();
        }

        var dateobj = this._convertToDateObject(text);
        var binvalid = false;
        if (dateobj)
        {
            binvalid = this._isInvalidValue(dateobj);

            if (!binvalid)
                text = this._convertValueType(text, dateobj);
        }

        if (this._env._p_enableaccessibility)
            this.on_apply_prop_accessibilitylabel();

        this.on_apply_text(text);
    };

    _pDateField.on_apply_text = function (v)
    {
        var expr = this._p_expr;
        if (expr)
        {
            if (expr.substring(0, 4) == "Date")
            {
                v = new nexacro.Date(v).toString();
            }

            if (this._p_value != v)
            {
                var dateobj = this._convertToDateObject(v);
                var binvalid = false;
                if (dateobj)
                {
                    binvalid = this._isInvalidValue(dateobj);

                    if (!binvalid)
                        v = this._convertValueType(v, dateobj);
                }
                this.set_value(v);
            }
            else
                this.on_apply_value(v);
        }
    };

    _pDateField.set_usedropbutton = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_usedropbutton != v)
        {
            this._p_usedropbutton = v;
            this.on_apply_usedropbutton();
        }
    };

    _pDateField.on_apply_usedropbutton = function ()
    {
        this.set_usetrailingbutton(this._p_usedropbutton);
    };

    _pDateField.on_apply_autoskip = nexacro._emptyFn;

    _pDateField._isInvalidValue = function (v)
    {
        if (nexacro._isNull(v))
            return false;
        if (v == "")
            return true;

        var dateobj;
        if (v instanceof Date || v instanceof nexacro.Date)
        {
            dateobj = v;
        }
        else
        {
            dateobj = this._convertToDateObject(v);
        }

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

    _pDateField._checkApplyValidate = function (value)
    {
        if (value == null)
            return -1;

        return !this._isInvalidValue(value);
    };

    _pDateField.on_init_bindSource = function (columnid, propid, ds)
    {
        if (propid == "value")
        {
            this._setValue(undefined);
        }
    };

    _pDateField.on_change_bindSource = function (propid, ds, row, col)
    {
        if (propid == "value")
        {
            var v = ds.getColumn(row, col);
            var maskobj = this._masktypeobj;
            var dateobj = this._convertToDateObject(v);

            if (dateobj)
            {
                this._invalidStatus(false);
                this._validStatus(false);

                let check = this._checkApplyValidate(v);

                if (check == false)
                    this.on_invalid(true);
                else if (check == true)
                    this.on_valid(true);

                if (!this._isInvalidValue(dateobj))
                {
                    v = this._convertValueType(v, dateobj, true);
                    v = dateobj.toString();

                    if (v != this._p_value)
                    {
                        var packeddate = maskobj.changeNormalizeValue(v);

                        if (maskobj)
                            maskobj.setDate(packeddate);

                        this._p_value = v;
                        this.on_apply_value(packeddate);
                    }
                }
                else
                {
                    this._p_value = v;
                    this._p_text = this._makeBufferTextFromValue(v);
                    this.on_apply_value(v);
                }
            }
            else
            {
                if (v != this._p_value)
                    this._setValue(v);  // undefined, null, empty string
            }
            this._on_apply_text();
        }
    };

    _pDateField._beginValueChange = function ()
    {
        return !(this.__value_change ? false : this.__value_change = true);
    };

    _pDateField._finalValueChange = function ()
    {
        return !(this.__value_change = false);
    };

    _pDateField._convertToDateObject = function (v)
    {
        if (nexacro._isNull(v) || v === "")
            return null;

        var dateobj;
        var maskobj = this._masktypeobj;
        var editformattype;

        if (!this._input_type)
            this.on_apply_inputtype();

        switch (this._input_type)
        {
            case "date":
                editformattype = 0;
                break;
            case "time":
                editformattype = 1;
                break;
            case "datetime":
                editformattype = 2;
                break;
        }

        if (v instanceof Date || v instanceof nexacro.Date)
        {
            dateobj = v;
        }
        else
        {
            v = nexacro._toString(v);

            if (/[^0-9]/.test(v))
            {
                dateobj = new Date(v);
            }
            else
            {
                if (editformattype == 1 && v.length == 17)
                    v = v.substr(8, 9);

                dateobj = maskobj.convertToDateObject(v, editformattype);
            }
        }

        if (dateobj)
        {
            if (isNaN(dateobj.valueOf()))
                return dateobj;

            switch (editformattype)
            {
                case 0:
                    dateobj = new nexacro.Date(dateobj.getFullYear(), dateobj.getMonth(), dateobj.getDate());
                    break;
                case 1:
                    dateobj = new nexacro.Date(dateobj.getFullYear(), dateobj.getMonth(), dateobj.getDate(), dateobj.getHours(), dateobj.getMinutes(), dateobj.getSeconds(), dateobj.getMilliseconds());
                    dateobj._timeonly = true;
                    break;
                case 2:
                    dateobj = new nexacro.Date(dateobj.getFullYear(), dateobj.getMonth(), dateobj.getDate(), dateobj.getHours(), dateobj.getMinutes(), dateobj.getSeconds(), dateobj.getMilliseconds());
                    break;
                default:
                    break;
            }
        }

        return dateobj;
    };

    _pDateField._getDlgCode = function (keycode, altKey, ctrlKey/*, shiftKey*/)
    {
        var _want_arrows = this._want_arrows;
        this._is_first_focus = false;

        if (ctrlKey == true)
            _want_arrows = true;

        return { want_tab: false, want_return: false, want_escape: false, want_chars: false, want_arrows: _want_arrows };
    };

    _pDateField._getCurrentDateStr = function ()
    {
        var maskobj = this._masktypeobj;
        if (maskobj)
            return maskobj.applyMask(this._getCurrentDateVal());

        return "";
    };

    _pDateField._getCurrentDateVal = function ()
    {
        var maskobj = this._masktypeobj;
        if (maskobj)
        {
            var currDate = maskobj.getCurrentDate();
            var year = nexacro._toString(currDate.year).padLeft(4, "0");
            var month = nexacro._toString(currDate.month).padLeft(2, "0");
            var day = nexacro._toString(currDate.day).padLeft(2, "0");
            var type = maskobj.getEditFormatType();
            var val = "";
            switch (type)
            {
                case 0:
                    val = year + month + day;
                    break;
                case 1:
                    val = "000000000";
                    break;
                case 2:
                    val = year + month + day + "000000000";
            }
            return val;
        }
        return null;
    };

    _pDateField._setLocale = function (v)
    {
        if (this._p_locale)
            return;

        if (this._locale != v)
        {
            this.on_apply_locale(v);
            this.on_apply_value(this._p_value);
        }
    };

    _pDateField._setInitCaret = function ()
    {
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        /* DateField에서는 input이 아닌 popup에 포커스 처리 [DateRangePicker 키액션 기능 추가 후 DateField와 연동]
        if (this._onlydisplay)
            return;

        var input_elem = this._input_element;
        if (input_elem && this._type != "system")
        {
            input_elem.setElementFocus();
            this.setSelect(0, 0);
        }
        */
        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        if (this._isPopupVisible())
        {
            if (!this._onlydisplay)
            {
                this._input_element.setElementBlur();
            }
            this._popupcontrol._attached_comp._setFocus(false);
        }
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    };

    _pDateField._getDateMaskObj = function ()
    {
        return this._masktypeobj;
    };

    _pDateField._getCurrentDate = function ()
    {
        var maskobj = this._masktypeobj;
        if (maskobj)
        {
            return maskobj.getCurrentDate();
        }

        return;
    };

    _pDateField._getFormatType = function ()
    {
        var maskobj = this._masktypeobj;
        if (maskobj)
        {
            return maskobj.getEditFormatType();
        }

        return;
    };

    _pDateField._getEndDay = function (y, m)
    {
        var maskobj = this._masktypeobj;
        if (maskobj)
        {
            return maskobj.getEndDay(y, m);
        }

        return;
    };

    _pDateField._isPopupVisible = function ()
    {
        var ret = false;
        if (this._popupcontrol)
            ret = this._popupcontrol._p_visible;

        return ret;
    };

    _pDateField.set_popuptype = function (v)
    {
        var popuptype_enum = ["center", "none", "normal", "default", "mobile"];
        if (v && popuptype_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_popuptype != v)
        {
            this._p_popuptype = v;
            this.on_apply_popuptype(v);
        }
    };

    _pDateField.on_apply_popuptype = function ()
    {
        this._popuptype = this._p_popuptype;

        if (this._p_popuptype == "default")
            this._popuptype = (nexacro._isTouchInteraction) ? "mobile" : "normal";

        var type = this._type;
        var maskobj = this._masktypeobj;
        if (maskobj)
        {
            var mode = "number";
            var useeditbuffer = true;

            if ((!this._popuptype || this._popuptype == "system") && (type == "normal" || type == "system"))
            {
                var bMobile = ((nexacro._isMobile && nexacro._isMobile()) || (nexacro._isHybrid && nexacro._isHybrid()) || (!nexacro._isDesktop() && nexacro._OS == "Android" && nexacro._Browser == "Runtime")) || nexacro._isTouchInteraction;
                if (bMobile && this._is_created)
                {
                    mode = "date";
                    useeditbuffer = false;
                }
            }

            maskobj.setInputMode(mode);
            maskobj.setUseEditBuffer(useeditbuffer);
        }
    };

    _pDateField.set_popupsize = function (v)
    {
        if (this._p_popupsize != v)
        {
            this._p_popupsize = v;
        }
    };

    _pDateField.on_apply_popupsize = nexacro._emptyFn;

    _pDateField.set_displayformat = function (v)
    {
        if (this._p_displayformat != v)
        {
            this._p_displayformat = v;
            this.on_apply_displayformat();
            this.on_apply_value();
        }
    };

    _pDateField.on_apply_displayformat = function ()
    {
        var maskobj = this._masktypeobj;
        var displayformat = "";

        if (this._p_displayformat)
        {
            if (this._p_inputtype.indexOf("date") >= 0)
            {
                if (this._p_displayformat.indexOf("SHORTDATE") >= 0)
                    displayformat = nexacro.Locale._makeDateMaskStringFromIntl(this._locale, "SHORTDATE");
                else if (this._p_displayformat.indexOf("MEDIUMDATE") >= 0)
                    displayformat = nexacro.Locale._makeDateMaskStringFromIntl(this._locale, "MEDIUMDATE");
                else if (this._p_displayformat.indexOf("LONGDATE") >= 0)
                    displayformat = nexacro.Locale._makeDateMaskStringFromIntl(this._locale, "LONGDATE");
                else if (this._p_displayformat.indexOf("FULLDATE") >= 0)
                    displayformat = nexacro.Locale._makeDateMaskStringFromIntl(this._locale, "FULLDATE");
                else
                    displayformat = this._p_displayformat;
            }

            if (this._p_inputtype.indexOf("time") >= 0)
            {
                if (displayformat)
                    displayformat += " ";

                if (this._p_displayformat.indexOf("SHORTTIME") >= 0)
                    displayformat += nexacro.Locale._makeTimeMaskStringFromIntl(this._locale, "SHORTTIME");
                else if (this._p_displayformat.indexOf("MEDIUMTIME") >= 0)
                    displayformat += nexacro.Locale._makeTimeMaskStringFromIntl(this._locale, "MEDIUMTIME");
                else
                    displayformat = this._p_displayformat;
            }
        }

        this._displayformat = displayformat;

        if (maskobj)
        {
            if (displayformat)
                maskobj.setDateMask(displayformat);
            else
                this.on_apply_inputtype();
        }
    };

    _pDateField.set_format = function (v)
    {
        if (this._p_format != v)
        {
            this._p_format = v;
            this.on_apply_format();
            this.on_apply_value();
        }
    };

    _pDateField.on_apply_format = function ()
    {
        this.on_apply_inputtype();
    };

    _pDateField.set_innerdataset = function (v)
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

    _pDateField.on_apply_innerdataset = function (ds)
    {
        if (ds)
            ds._setEventHandler("onvaluechanged", this._on_dataset_onvaluechanged, this);

        if (this._p_datetimepicker)
            this._p_datetimepicker.set_innerdataset(this._p_innerdataset, true);
    };

    _pDateField._setInnerDatasetStr = function (str)
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

    _pDateField.getInnerDataset = function ()
    {
        return this._innerdataset;
    };

    _pDateField.setInnerDataset = function (obj)
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

    _pDateField._removeEventHandlerToInnerDataset = function ()
    {
        if (this._innerdataset)
        {
            this._innerdataset._removeEventHandler("onvaluechanged", this._on_dataset_onvaluechanged, this);
            this._innerdataset = null;
        }
    };

    _pDateField.set_backgroundcolumn = function (v)
    {
        if (this._p_backgroundcolumn != v)
        {
            this._p_backgroundcolumn = v;
            this.on_apply_backgroundcolumn();
        }
    };

    _pDateField.on_apply_backgroundcolumn = function ()
    {
        if (this._p_datetimepicker)
            this._p_datetimepicker.set_backgroundcolumn(this._p_backgroundcolumn, true);
    };

    _pDateField.set_bordercolumn = function (v)
    {
        if (this._p_bordercolumn != v)
        {
            this._p_bordercolumn = v;
            this.on_apply_bordercolumn();
        }
    };

    _pDateField.on_apply_bordercolumn = function ()
    {
        if (this._p_datetimepicker)
            this._p_datetimepicker.set_bordercolumn(this._p_bordercolumn, true);
    };

    _pDateField.set_datecolumn = function (v)
    {
        if (this._p_datecolumn != v)
        {
            this._p_datecolumn = v;
            this.on_apply_datecolumn(v);
        }
    };

    _pDateField.on_apply_datecolumn = function ()
    {
        if (this._p_datetimepicker)
            this._p_datetimepicker.set_datecolumn(this._p_datecolumn, true);
    };

    _pDateField.set_textcolorcolumn = function (v)
    {
        if (this._p_textcolorcolumn != v)
        {
            this._p_textcolorcolumn = v;
            this.on_apply_textcolorcolumn(v);
        }
    };

    _pDateField.on_apply_textcolorcolumn = function ()
    {
        if (this._p_datetimepicker)
            this._p_datetimepicker.set_textcolorcolumn(this._p_textcolorcolumn, true);
    };

    _pDateField.set_hintingcolumn = function (v)
    {
        if (this._p_hintingcolumn != v)
        {
            this._p_hintingcolumn = v;
            this.on_apply_hintingcolumn(v);
        }
    };

    _pDateField.on_apply_hintingcolumn = function ()
    {
        if (this._p_datetimepicker)
            this._p_datetimepicker.set_hintingcolumn(this._p_hintingcolumn, true);
    };

    _pDateField.set_readonlycolumn = function (v)
    {
        if (this._p_readonlycolumn != v)
        {
            this._p_readonlycolumn = v;
            this.on_apply_readonlycolumn(v);
        }
    };

    _pDateField.on_apply_readonlycolumn = function ()
    {
        if (this._p_datetimepicker)
            this._p_datetimepicker.set_readonlycolumn(this._p_readonlycolumn, true);
    };

    _pDateField._makeCalendarText = function (value)
    {
        if (!value)
        {
            return "";
        }

        var val_str = value.toString();
        var oldformat = this._currentformat;
        this._currentformat = "dateformat";

        var date = this._makeMaskValue(val_str);
        var mask = this._makeMask("dateformat", this._makeDateObj(value));
        var txt_idx = 0;
        var return_txt = "";
        var matchStr = "yMdHhmsl";

        //this._on_apply_mask(mask, true);

        this._currentformat = oldformat;

        for (var i = 0, n = mask.length; i < n; i++)
        {
            var mask_ch = mask.charAt(i);

            if (matchStr.indexOf(mask_ch) >= 0)
            {
                return_txt += date.charAt(txt_idx);
                txt_idx++;
            }
            else
            {
                if (mask_ch === "~" || mask_ch === "^")
                {
                    return_txt += date.charAt(txt_idx);
                    txt_idx++;
                }
                else
                {
                    return_txt += mask_ch;
                }
            }
        }
        return return_txt;
    };

    _pDateField._isValidDate = function (val, editmask_type, edit_type_buf)
    {
        var y, M, d;
        var h, m, s, ss;

        switch (editmask_type)
        {
            case 0:
                y = val.substr(0, 4);
                M = val.substr(4, 2);
                d = val.substr(6, 2);
                break;
            case 1:
                var n = 0;
                if (edit_type_buf && edit_type_buf[0] < 40)
                {
                    h = val.substr(n, 2);
                    n = 2;
                }
                m = val.substr(n, 2);
                s = val.substr(n + 2, 2);
                ss = val.substr(n + 2, 3);
                break;
            case 2:
                y = val.substr(0, 4);
                M = val.substr(4, 2);
                d = val.substr(6, 2);
                h = val.substr(8, 2);
                m = val.substr(10, 2);
                s = val.substr(12, 2);
                ss = val.substr(14, 3);
                break;
        }

        if ((y && isNaN(y = +y)) || (M && isNaN(M = +M)) || (d && isNaN(d = +d)) ||
            (h && isNaN(h = +h)) || (m && isNaN(m = +m)) || (s && isNaN(s = +s)) || (ss && isNaN(ss = +ss)))
        {
            return false;
        }

        var maskobj = this._masktypeobj;

        var maxDay = maskobj.getEndDay(y, M);

        if ((editmask_type != 1 && !maxDay) ||
            (M && (+M > 12)) || (d && (+d > maxDay)) ||
            (h && (+h >= 24)) || (m && (+m >= 60)) || (s && (+s >= 60)) || (ss && (+ss >= 1000)))
        {
            return false;
        }

        return true;
    };

    //===============================================================
    // nexacro.DateField : Methods
    //===============================================================
    _pDateField._on_getDisplayText = function ()
    {
        return this._makeBufferTextFromValue(this._p_value, true);
    };

    _pDateField._isContainsText = function ()
    {
        return (this._p_value != null) || this._p_displaynulltext;
    };

    _pDateField.dropdown = function ()
    {
        if (!this._p_enable || this._p_readonly || !this._p_visible || this._type == "system")
            return false;

        if (this._isPopupVisible())
            return false;

        this._setFocus(false);
        this._showPopup();
        this._setInitCaret();
    };

    _pDateField.isDropdown = function ()
    {
        return this._isPopupVisible();
    };

    _pDateField._analyzeFormatRange = function ()
    {
        var format = this._format;
        var idx = -1;

        this._range = {
            year: null,
            month: null,
            day: null,
            week: null,
            ampm: null,
            hour: null,
            min: null,
            sec: null,
            msec: null
        };

        this._ranges_order = [];
        this._select_ranges = [];
        this._point_range = null;

        // 기본 format은 허용 안함. displayformat만 허용
        // ------------------------------------------
        if (format.indexOf("yyyy") < 0)
            format = format.replace("yy", "yyyy");

        format = format.replace("MMMM", "MM");
        format = format.replace("MMM", "MM");
        // ------------------------------------------

        //      format = format.replace("A", "aa");
        //      format = format.replace("uuu", "SSS");
        format = format.replace("sss", "SSS");
        format = format.replace("dddd", "DDDD");
        format = format.replace("ddd", "DDD");
        format = format.trim();

        this._format = format;
        this._masktypeobj.setEditMask(format);

        var range = this._range;

        if (this._input_type != "time")
        {
            if ((idx = format.indexOf("yyyy")) >= 0)
            {
                range.year = { beg: idx, end: idx + 4, format: "yyyy", min: 0, max: 9999, text: "", area: "date" };
                range.year.empty = range.year.format.toUpperCase();
                this._ranges_order.push(range.year);
            }

            if ((idx = format.indexOf("MM")) >= 0)
            {
                range.month = { beg: idx, end: idx + 2, format: "MM", min: 1, max: 12, text: "", area: "date" };
                range.month.empty = range.month.format.toUpperCase();
                this._ranges_order.push(range.month);
            }
            else if ((idx = format.indexOf("M")) >= 0)
            {
                range.month = { beg: idx, end: idx + 1, format: "M", min: 1, max: 12, text: "", area: "date" };
                range.month.empty = range.month.format.toUpperCase();
                this._ranges_order.push(range.month);
            }

            if ((idx = format.indexOf("DDDD")) >= 0)
            {
                range.week = { beg: idx, end: idx + 4, format: "DDDD", min: 0, max: 6, text: "", area: "date", readonly: true };
                range.week.empty = range.week.format.toUpperCase();
                this._ranges_order.push(range.week);
            }
            else if ((idx = format.indexOf("DDD")) >= 0)
            {
                range.week = { beg: idx, end: idx + 3, format: "DDD", min: 0, max: 6, text: "", area: "date", readonly: true };
                range.week.empty = range.week.format.toUpperCase();
                this._ranges_order.push(range.week);
            }

            if ((idx = format.indexOf("dd")) >= 0)
            {
                range.day = { beg: idx, end: idx + 2, format: "dd", min: 1, max: 31, text: "", area: "date" };
                range.day.empty = range.day.format.toUpperCase();
                this._ranges_order.push(range.day);
            }
            else if ((idx = format.indexOf("d")) >= 0)
            {
                range.day = { beg: idx, end: idx + 1, format: "d", min: 1, max: 31, text: "", area: "date" };
                range.day.empty = range.day.format.toUpperCase();
                this._ranges_order.push(range.day);
            }
        }

        if (this._input_type != "date")
        {
            if ((idx = format.indexOf("aa")) >= 0)
            {
                range.ampm = { beg: idx, end: idx + 2, format: "aa", min: 0, max: 1, text: "", area: "time" };
                range.ampm.empty = range.ampm.format.toLowerCase();
                this._ranges_order.push(range.ampm);
            }

            if ((idx = format.indexOf("hh")) >= 0)
            {
                range.hour = { beg: idx, end: idx + 2, format: "hh", min: 1, max: 12, text: "", area: "time" };
                range.hour.empty = range.hour.format.toLowerCase();
                this._ranges_order.push(range.hour);
            }
            else if ((idx = format.indexOf("h")) >= 0)
            {
                range.hour = { beg: idx, end: idx + 1, format: "h", min: 1, max: 12, text: "", area: "time" };
                range.hour.empty = range.hour.format.toLowerCase();
                this._ranges_order.push(range.hour);
            }
            else if ((idx = format.indexOf("HH")) >= 0)
            {
                range.hour = { beg: idx, end: idx + 2, format: "HH", min: 0, max: 23, text: "", area: "time" };
                range.hour.empty = range.hour.format.toLowerCase();
                this._ranges_order.push(range.hour);
            }
            else if ((idx = format.indexOf("H")) >= 0)
            {
                range.hour = { beg: idx, end: idx + 1, format: "H", min: 0, max: 23, text: "", area: "time" };
                range.hour.empty = range.hour.format.toLowerCase();
                this._ranges_order.push(range.hour);
            }

            if ((idx = format.indexOf("mm")) >= 0)
            {
                range.min = { beg: idx, end: idx + 2, format: "mm", min: 0, max: 59, text: "", area: "time" };
                range.min.empty = range.min.format.toLowerCase();
                this._ranges_order.push(range.min);
            }
            else if ((idx = format.indexOf("m")) >= 0)
            {
                range.min = { beg: idx, end: idx + 1, format: "m", min: 0, max: 59, text: "", area: "time" };
                range.min.empty = range.min.format.toLowerCase();
                this._ranges_order.push(range.min);
            }

            if ((idx = format.indexOf("ss")) >= 0)
            {
                range.sec = { beg: idx, end: idx + 2, format: "ss", min: 0, max: 59, text: "", area: "time" };
                range.sec.empty = range.sec.format.toLowerCase();
                this._ranges_order.push(range.sec);
            }
            else if ((idx = format.indexOf("s")) >= 0)
            {
                range.sec = { beg: idx, end: idx + 1, format: "s", min: 0, max: 59, text: "", area: "time" };
                range.sec.empty = range.sec.format.toLowerCase();
                this._ranges_order.push(range.sec);
            }

            if ((idx = format.indexOf("SSS")) >= 0)
            {
                range.msec = { beg: idx, end: idx + 3, format: "SSS", min: 0, max: 999, text: "", area: "time" };
                range.msec.empty = range.msec.format.toLowerCase();
                this._ranges_order.push(range.msec);
            }
        }
        this._ranges_order.sort(function (a, b) { return a.beg - b.beg; });
    };

    _pDateField._setRangetext = function (text, range)
    {
        if (range._p_text == text)
            return false;

        range._p_text = text;
        return true;
    };

    _pDateField._clearRangeBuffers = function ()
    {
        var ranges = this._ranges_order;
        var format, editformat = this._format;
        var idx;

        for (var i = 0; i < ranges.length; i++)
        {
            ranges[i]._p_text = "";
            format = ranges[i].format;

            if ((idx = editformat.indexOf(format)) >= 0)
            {
                ranges[i].beg = idx;
                ranges[i].end = idx + format.length;
            }
        }
    };

    _pDateField._arrangeRangeBeginPos = function (range, adjust)
    {
        if (adjust == 0)
            return;

        var ranges = this._ranges_order;
        var start = false;

        for (var i = 0; i < ranges.length; i++)
        {
            if (start)
            {
                ranges[i].beg += adjust;
                ranges[i].end += adjust;
            }

            if (ranges[i].format == range.format)
            {
                start = true;
                ranges[i].end += adjust;
            }
        }
    };

    _pDateField._replaceRangeInputText = function (input_elem, text, range)
    {
        var beg = range.beg, end = range.end;
        var adjust = text.length - (end - beg);

        this._arrangeRangeBeginPos(range, adjust);

        if (!this._onlydisplay)
            input_elem.replaceElementText(text, beg, end, true);
    };

    _pDateField._replaceRangeBufferText = function (text, range)
    {
        if (!this._input_element)
            return;

        text = text + "";
        if (this._setRangetext(text, range))
        {
            var adjust = text.length - (range.end - range.beg);
            this._replaceRangeInputText(this._input_element, text, range);
        }
    };

    _pDateField._getLastDay = function (year, month)
    {
        var lastday = new Date(year, month, 0).getDate();
        if (lastday != this._invalid_date_text && !isNaN(lastday))
        {
            return lastday;
        }
        return 0;
    };

    _pDateField._getDayOfWeekText = function (year, month, day)
    {
        var dt = new nexacro.Date(year, month - 1, day);
        var week;
        if (this._range.week.format == "DDDD")
            week = dt.toLocaleWeekDayString(this._locale, "long");
        else if (this._range.week.format == "DDD")
            week = dt.toLocaleWeekDayString(this._locale, "short");

        return week;
    };

    _pDateField._replaceRangeDate = function (text, range)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            //----- year, month 입력시 lastday 보정 -----
            if (this._range.year && this._range.month && this._range.day)
            {
                if ((range == this._range.year && this._range.month._p_text != "" && this._range.day._p_text != "") ||
                    (range == this._range.month && this._range.year._p_text != "" && this._range.day._p_text != ""))
                {
                    var year, month, day;
                    if (range == this._range.year)
                    {
                        year = text;
                        month = this._range.month._p_text;
                        day = this._range.day._p_text;
                    }
                    else
                    {
                        year = this._range.year._p_text;
                        month = text;
                        day = this._range.day._p_text;
                    }

                    var lastday = this._getLastDay(year, month);
                    if (lastday > 0 && lastday < parseInt(day))
                    {
                        lastday = this._padNumberWithZero(lastday, 2);
                        this._setRangetext(lastday, this._range.day);

                        var proc = this._skip_oninput;
                        this._skip_oninput = true;
                        this._replaceRangeInputText(input_elem, lastday, this._range.day);

                        if (this._range.week)
                        {
                            var week = this._getDayOfWeekText(year, month, lastday);
                            this._replaceRangeInputText(input_elem, week, this._range.week);
                        }
                        this._skip_oninput = proc;
                    }
                }
            }

            this._setRangetext(text, range);
            this._replaceRangeInputText(input_elem, text, range);   // 여기서 oninput 발생시 위에서 보정한 value로 fire
            this.setSelect(range.beg, range.end, true);
        }
    };

    _pDateField._cancelValue = function ()
    {
        this._setValue(this._default_value);
    };

    _pDateField._confirmValue = function ()
    {
        if (this._onlydisplay)
            return;

        var input_elem = this._getInputElement();
        var pre_value = this._default_value;
        var pre_text = this._default_text;
        var input_value = input_elem._getInputValue();
        var cur_value, cur_text;

        if (this._p_value != null) // 입력을 한번도 안한 경우
        {
            if (input_value == this._getEmptyText() || input_value == "")
                cur_value = "";
            else
                cur_value = this._makeValueFromBuffer();

            cur_text = this._makeBufferTextFromValue(cur_value);

            if (!(/^[0-9]+$/.test(cur_value)))
            {
                if (this._p_invalidvalueaction == "rollback")
                {
                    this._p_value = pre_value;
                    this._p_text = pre_text;
                    this._invalidStatus(false);
                    this.on_valid(true);
                }
                else if (this._p_invalidvalueaction == "minimum")
                {
                    this._p_value = this._makeValueFromBuffer(true);
                    this._p_text = this._makeBufferTextFromValue(this._p_value);
                }
                else // "empty"
                {
                    this._invalid_value = cur_value;
                    this._p_value = "";
                    this._p_text = cur_text;
                }
            }
        }

        if (!this._on_value_change(pre_text, pre_value, this._p_text, this._p_value))
        {
            this._p_value = pre_value;
            this._p_text = pre_text;
        }
    };

    _pDateField._validateValueLength = function (value, inputtype)
    {
        switch (inputtype)
        {
            case "date": // 8
                if (value.length > 8)
                    value = value.substring(0, 8);
                break;
            case "datetime": // 17
                if (value.length == 8)
                    value += "000000000";
                else if (value.length == 9)
                    value += "00000000";
                break;
            case "time": // 9
                if (value.length == 17)
                    value = value.substring(8, 17);
                else if (value.length == 8)
                    value += "0";
                break;
        }
        return value;
    };

    _pDateField._makeValueFromBuffer = function (b_invalid_correct, no_adjust)
    {
        var range = this._range;
        var value = "", preval = this._p_value;

        if (this._input_type.indexOf("date") >= 0)
        {
            var n_year;
            if (range.year && range.year._p_text != "" && !isNaN((n_year = parseInt(range.year._p_text))))
                value += (n_year > 0) ? range.year._p_text : (no_adjust ? range.year._p_text : "0000");
            else if (b_invalid_correct || !range.year)
                value += preval ? preval.substring(0, 4) : "0000";
            else
                value += "yyyy";

            var n_month;
            if (range.month && range.month._p_text != "" && !isNaN((n_month = parseInt(range.month._p_text))))
                value += (n_month > 0) ? this._padNumberWithZero(range.month._p_text, 2) : (no_adjust ? range.month._p_text : "01");
            else if (b_invalid_correct || !range.month)
                value += preval ? preval.substring(4, 6) : "01";
            else
                value += "MM";

            var n_day;
            if (range.day && range.day._p_text != "" && !isNaN((n_day = parseInt(range.day._p_text))))
                value += (n_day > 0) ? this._padNumberWithZero(range.day._p_text, 2) : (no_adjust ? range.day._p_text : "01");
            else if (b_invalid_correct || !range.day)
            {
                var preday = preval ? preval.substring(6, 8) : "01";
                if (preval) // day에 이전 값 설정시 보정 필요
                {
                    var lastday = this._getLastDay(value.substring(0, 4), value.substring(4, 6));

                    if (lastday == 0)
                        lastday = 31;

                    if (preday > lastday)
                        preday = this._padNumberWithZero(lastday, 2);
                }
                value += preday;
            }
            else
                value += "dd";
        }

        if (this._input_type.indexOf("time") >= 0)
        {
            var preval = (preval && preval.length == 17) ? preval.substring(8, 17) : preval;

            if (this._format.indexOf("h") >= 0)
            {
                if (range.hour)
                {
                    var ampm, hour;
                    if (range.ampm)
                    {
                        if (range.ampm._p_text != "")
                            ampm = range.ampm._p_text;
                        else if (b_invalid_correct)
                            ampm = this._ampm[0];
                    }

                    var n_hour;
                    if (range.hour._p_text != "" && !isNaN(n_hour = parseInt(range.hour._p_text)))
                        hour = (n_hour > 0) ? this._padNumberWithZero(range.hour._p_text, 2) : (no_adjust && (this._format.indexOf("hh") >= 0) ? range.hour._p_text : "01");   // h는 1~12 이므로 value가 00될 수는 있지만, 입력 text는 0이 될 수 없음.
                    else if (b_invalid_correct)
                        hour = "00";
                    else
                        hour = "hh";

                    if (!no_adjust)
                    {
                        if (this._ampm[0] == ampm)  // AM
                        {
                            if (hour == "12")   // AM 12 -> 00 / AM 01~11 -> 01~11
                                hour = "00";
                        }
                        else if (this._ampm[1] == ampm) // PM
                        {
                            if (hour < "12")    // PM 12 -> 12 / PM 00~11 -> 12~23
                                hour = parseInt(hour) + 12 + "";
                        }
                    }
                    value += hour;
                }
                else if (b_invalid_correct || !range.hour)
                {
                    value += preval ? preval.substring(0, 2) : "00";
                }
                else
                {
                    value += "hh";
                }
            }
            else
            {
                if (range.hour && range.hour._p_text != "" && !isNaN(parseInt(range.hour._p_text)))
                    value += this._padNumberWithZero(range.hour._p_text, 2);
                else if (b_invalid_correct || !range.hour)
                    value += preval ? preval.substring(0, 2) : "00";
                else
                    value += "HH";
            }

            if (range.min && range.min._p_text != "" && !isNaN(parseInt(range.min._p_text)))
                value += this._padNumberWithZero(range.min._p_text, 2);
            else if (b_invalid_correct || !range.min)
                value += preval ? preval.substring(2, 4) : "00";
            else
                value += "mm";

            if (range.sec && range.sec._p_text != "" && !isNaN(parseInt(range.sec._p_text)))
                value += this._padNumberWithZero(range.sec._p_text, 2);
            else if (b_invalid_correct || !range.sec)
                value += preval ? preval.substring(4, 6) : "00";
            else
                value += "ss";

            if (range.msec && range.msec._p_text != "" && !isNaN(parseInt(range.msec._p_text)))
                value += this._padNumberWithZero(range.msec._p_text, 3);
            else if (b_invalid_correct || !range.msec)
                value += preval ? preval.substring(6, 9) : "000";
            else
                value += "SSS";
        }

        return value;
    };

    _pDateField._procEmptyValue = function (val, range)
    {
        var n_val = parseInt(val);
        if (isNaN(n_val))
            val = this._mask_char ? val.replace(/./g, this._mask_char) : (range ? range.empty : val);

        return val;
    };

    _pDateField._makeBufferTextFromValue = function (value, is_display, inputtype, no_adjust)
    {
        var update_buff = (!is_display);

        if (value == undefined)
        {
            if (update_buff)
                this._clearRangeBuffers();

            return "";
        }
        else if (value == "" || (is_display && this.getValidStatus() == "invalid"))
        {
            if (is_display)
                return this._invalid_date_text;

            if (update_buff)
                this._clearRangeBuffers();

            return this._getEmptyText();
        }

        inputtype = inputtype ? inputtype : this._input_type;

        var format = is_display ? this._displayformat : this._format;
        var year, mon, day, week, hour, min, sec, msec, nnn;
        var dt;

        if (!format)
            return value;

        format = format.replace("dddd", "DDDD");
        format = format.replace("ddd", "DDD");

        var text = format;
        var is_later = false;

        value = this._validateValueLength(value, inputtype);

        if (inputtype.indexOf("date") >= 0)
        {
            year = value.substring(0, 4);
            mon = value.substring(4, 6);
            day = value.substring(6, 8);

            var lastday = this._getLastDay(year, mon);
            var n_day = parseInt(day);

            if (lastday == 0)
                lastday = 31;

            if (n_day > lastday)
                day = this._padNumberWithZero(lastday, 2);

            if (inputtype == "datetime")
            {
                hour = value.substring(8, 10);
                hour = (hour == "24") ? "00" : hour;
                min = value.substring(10, 12);
                sec = value.substring(12, 14);
                msec = value.substring(14, 17);

                dt = new nexacro.Date(year, ((mon != "MM") ? mon - 1 : mon), day, hour, min, sec, msec);
            }
            else
            {
                dt = new nexacro.Date(year, ((mon != "MM") ? mon - 1 : mon), day);
            }

            if (format.indexOf("yyyy") >= 0)
            {
                year = this._procEmptyValue(year, this._range.year);
                text = text.replace("yyyy", year);

                if (update_buff)
                    this._replaceRangeBufferText(year, this._range.year);
            }
            else if (format.indexOf("yy") >= 0)
            {
                year = this._procEmptyValue(year, this._range.year);
                year = year.substring(2, 4);
                text = text.replace("yy", year);
            }

            if (format.indexOf("dd") >= 0)
            {
                day = this._procEmptyValue(day, this._range.day);
                text = text.replace("dd", day);

                if (update_buff)
                    this._replaceRangeBufferText(day, this._range.day);
            }
            else if (format.indexOf("d") >= 0)
            {
                day = this._procEmptyValue(day, this._range.day);
                nnn = parseInt(day);

                if (isNaN(nnn))
                    nnn = day;

                text = text.replace("d", nnn);

                if (update_buff)
                    this._replaceRangeBufferText(nnn, this._range.day);
            }

            if (format.indexOf("MMMM") >= 0 || format.indexOf("MMM") >= 0)    // later
            {
                is_later = true;
            }
            else if (format.indexOf("MM") >= 0)
            {
                mon = this._procEmptyValue(mon, this._range.month);
                text = text.replace("MM", mon);

                if (update_buff)
                    this._replaceRangeBufferText(mon, this._range.month);
            }
            else if (format.indexOf("M") >= 0)
            {
                mon = this._procEmptyValue(mon, this._range.month);
                nnn = parseInt(mon);

                if (isNaN(nnn))
                    nnn = mon;

                text = text.replace("M", nnn);

                if (update_buff)
                    this._replaceRangeBufferText(nnn, this._range.month);
            }

            if (format.indexOf("DDDD") >= 0 || format.indexOf("DDD") >= 0)    // later
            {
                is_later = true;
            }
        }

        if (inputtype.indexOf("time") >= 0)
        {
            if (inputtype == "time")
            {
                hour = value.substring(0, 2);
                hour = (hour == "24") ? "00" : hour;
                min = value.substring(2, 4);
                sec = value.substring(4, 6);
                msec = value.substring(6, 9);
            }

            if (format.indexOf("HH") >= 0)
            {
                hour = this._procEmptyValue(hour, this._range.hour);
                text = text.replace("HH", hour);

                if (update_buff)
                    this._replaceRangeBufferText(hour, this._range.hour);
            }
            else if (format.indexOf("H") >= 0)
            {
                hour = this._procEmptyValue(hour, this._range.hour);
                nnn = parseInt(hour);

                if (isNaN(nnn))
                    nnn = hour;

                text = text.replace("H", nnn);

                if (update_buff)
                    this._replaceRangeBufferText(nnn, this._range.hour);
            }
            else if (format.indexOf("h") >= 0)    // h, hh
            {
                hour = this._procEmptyValue(hour, this._range.hour);
                var n_hour = parseInt(hour);
                var h;

                if (isNaN(n_hour))
                {
                    h = hour;
                    if (format.indexOf("hh") >= 0)
                        text = text.replace("hh", h);
                    else
                        text = text.replace("h", h);
                }
                else
                {
                    if (n_hour == 0)
                        n_hour = 12;
                    else if (n_hour > 12)    // 13 ~ 23
                        n_hour -= 12;

                    if (format.indexOf("hh") >= 0)
                    {
                        if (no_adjust)
                            h = hour;
                        else
                            h = this._padNumberWithZero(n_hour, 2);

                        text = text.replace("hh", h);
                    }
                    else
                    {
                        h = n_hour;
                        text = text.replace("h", h);
                    }
                }

                if (update_buff)
                    this._replaceRangeBufferText(h, this._range.hour);
            }

            if (format.indexOf("aa") >= 0)
            {
                var locale_info = nexacro.Locale.getLocaleInfo(this._locale);
                var n_hour = parseInt(hour);
                var ampm;

                if (isNaN(n_hour))
                {
                    if (this._range.ampm._p_text)
                        ampm = this._range.ampm._p_text;
                    else
                        ampm = this._mask_char ? this._mask_char : "aa";

                    text = text.replace("aa", ampm);
                    update_buff = false;
                }
                else
                {
                    if (!no_adjust)
                    {
                        if (n_hour >= 0 && n_hour < 12)
                        {
                            ampm = locale_info.ampm[0];
                            if (!ampm)
                                ampm = "AM";

                            text = text.replace("aa", ampm);
                        }
                        else
                        {
                            ampm = locale_info.ampm[1];
                            if (!ampm)
                                ampm = "PM";

                            text = text.replace("aa", ampm);
                        }
                    }
                    else
                    {
                        text = text.replace("aa", this._range.ampm._p_text);
                        update_buff = false;
                    }
                }
                if (update_buff)
                    this._replaceRangeBufferText(ampm, this._range.ampm);
            }

            if (format.indexOf("mm") >= 0)
            {
                min = this._procEmptyValue(min, this._range.min);
                text = text.replace("mm", min);

                if (update_buff)
                    this._replaceRangeBufferText(min, this._range.min);
            }
            else if (format.indexOf("m") >= 0)
            {
                min = this._procEmptyValue(min, this._range.min);
                nnn = parseInt(min);

                if (isNaN(nnn))
                    nnn = min;

                text = text.replace("m", nnn);

                if (update_buff)
                    this._replaceRangeBufferText(nnn, this._range.min);
            }

            if (format.indexOf("ss") >= 0)
            {
                sec = this._procEmptyValue(sec, this._range.sec);
                text = text.replace("ss", sec);

                if (update_buff)
                    this._replaceRangeBufferText(sec, this._range.sec);
            }
            else if (format.indexOf("s") >= 0)
            {
                sec = this._procEmptyValue(sec, this._range.sec);
                nnn = parseInt(sec);

                if (isNaN(nnn))
                    nnn = sec;

                text = text.replace("s", nnn);

                if (update_buff)
                    this._replaceRangeBufferText(nnn, this._range.sec);
            }

            if (format.indexOf("sss") >= 0)
            {
                msec = this._procEmptyValue(msec, this._range.msec);
                text = text.replace("sss", msec);

                if (update_buff)
                    this._replaceRangeBufferText(msec, this._range.msec);
            }
        }

        if (is_later && inputtype.indexOf("date") >= 0)
        {
            if (format.indexOf("MMMM") >= 0)    // display only
            {
                if (!isNaN(parseInt(mon)))
                    text = text.replace("MMMM", dt.toLocaleMonthString(this._locale, "long"));
                else
                    text = this._mask_char ? "MMMM".replace(/./g, this._mask_char) : "MMMM";
            }
            else if (format.indexOf("MMM") >= 0)    // display only
            {
                if (!isNaN(parseInt(mon)))
                    text = text.replace("MMM", dt.toLocaleMonthString(this._locale, "short"));
                else
                    text = this._mask_char ? "MMM".replace(/./g, this._mask_char) : "MMM";
            }

            if (format.indexOf("DDDD") >= 0)
            {
                if (!isNaN(parseInt(year)) && !isNaN(parseInt(mon)) && !isNaN(parseInt(day)))
                    week = dt.toLocaleWeekDayString(this._locale, "long");
                else
                    week = this._mask_char ? "DDDD".replace(/./g, this._mask_char) : this._range.week.empty;

                text = text.replace("DDDD", week);

                if (update_buff)
                    this._replaceRangeBufferText(week, this._range.week);
            }
            else if (format.indexOf("DDD") >= 0)
            {
                if (!isNaN(parseInt(year)) && !isNaN(parseInt(mon)) && !isNaN(parseInt(day)))
                    week = dt.toLocaleWeekDayString(this._locale, "short");
                else
                    week = this._mask_char ? "DDD".replace(/./g, this._mask_char) : this._range.week.empty;

                text = text.replace("DDD", week);

                if (update_buff)
                    this._replaceRangeBufferText(week, this._range.week);
            }
        }

        return text;
    };

    _pDateField._padNumberWithZero = function (number, length)
    {
        var padded_number = String(number);
        padded_number = padded_number.padLeft(length, "0");

        return padded_number;
    };

    _pDateField._findRangeFromPos = function (pos)
    {
        for (var prop in this._range)
        {
            if (this._range[prop] != null)
            {
                if (this._range[prop].beg <= pos && pos <= this._range[prop].end)
                    return this._range[prop];
            }
        }
    };

    _pDateField._findNextRange = function (endpos, area)
    {
        var end = endpos + 1;
        var next;
        var input_value = this._input_element._getInputValue();

        while (end <= input_value.length)
        {
            if (next = this._findRangeFromPos(end))
            {
                if (area)
                {
                    if (next.area == area)
                        return next;
                }
                else
                {
                    return next;
                }
            }
            end++;
        }
        return null;
    };

    _pDateField._findPrevRange = function (begpos, area)
    {
        var beg = begpos - 1;
        var prev;

        while (beg >= 0)
        {
            if (prev = this._findRangeFromPos(beg))
            {
                if (area)
                {
                    if (prev.area == area)
                        return prev;
                }
                else
                {
                    return prev;
                }
            }
            beg--;
        }
        return null;
    };

    _pDateField.set_locale = function (v)
    {
        if (this._p_locale != v)
        {
            this._p_locale = v;
            this.on_apply_locale(v);
            this.on_apply_value(this._p_value);
        }
    };

    _pDateField.on_apply_locale = function (locale)
    {
        this._locale = locale;

        var maskobj = this._masktypeobj;
        if (maskobj)
            maskobj.setLocale(locale);

        this._makeAMPM();
        this.on_apply_displayformat();
        this.on_apply_format();
    };

    _pDateField.set_visible = function (v)
    {
        nexacro.Component.prototype.set_visible.call(this, v);

        if (!this._p_visible && this._isPopupVisible())
        {
            this._closePopup(false, true);
        }
    };

    _pDateField.getYear = function ()
    {
        var ret = 1970;
        if (this._p_value)
        {
            var dateobj = this._convertToDateObject(this._p_value);
            return dateobj.getFullYear();
        }
        return ret;
    };

    _pDateField.getMonth = function ()
    {
        var ret = 1;
        if (this._p_value)
        {
            var dateobj = this._convertToDateObject(this._p_value);
            return dateobj.getMonth() + 1;
        }
        return ret;
    };

    _pDateField.getDay = function ()
    {
        var ret = 1;
        if (this._p_value)
        {
            var dateobj = this._convertToDateObject(this._p_value);
            return dateobj.getDate();
        }
        return ret;
    };

    _pDateField.getDayOfWeek = function ()
    {
        var ret = 4;
        if (this._p_value)
        {
            var dateobj = this._convertToDateObject(this._p_value);
            return dateobj.getDay();
        }
        return ret;
    };

    _pDateField.setSelectedText = nexacro._emptyFn;
    _pDateField.setCaretPos = nexacro._emptyFn;

    _pDateField._getPopupSizeArr = function ()
    {
        var datepicker = this._p_datetimepicker;
        var size = this._p_popupsize;

        var size = this._p_popupsize;

        if (!size)
            size = "220 250";

        size = size.split(/\s+/);

        var width = +size[0];
        var height = size[1] ? +size[1] : width;

        if (!this._p_popupsize)
        {
            if (datepicker.closebutton)
                height += datepicker.closebutton._adjust_height;
            if (datepicker._datetabbutton)
                height += datepicker._datetabbutton._adjust_height;
            if (datepicker._headline)
            {
                if (this._p_headlineposition == "left")
                    width += datepicker._headline._adjust_width;
                else
                    height += datepicker._headline._adjust_height;
            }

            if (this._popuptype == "mobile")  // popupsuze 고정이 아닌 경우만
            {
                var orient = nexacro._getMobileOrientation();

                if (orient == 2 || orient == 3) // landscape
                {
                    width += 70;
                    if (datepicker._headline)
                        width += datepicker._headline._adjust_width;
                }
                else
                {
                    width += 70;
                    height += 30;
                    if (datepicker._headline)
                        height += datepicker._headline._adjust_height;
                }
            }
        }

        return { width: width, height: height };
    };

    _pDateField._getElementPosition = function ()
    {
        return nexacro._getElementPositionInFrame(this.getElement());
    };

    _pDateField._updatePopupControlPosition = function ()
    {
        var popupcontrol = this._popupcontrol;
        if (popupcontrol)
        {
            var control_elem = this.getElement();
            var popup_control_elem = popupcontrol.getElement();

            var pos = this._getElementPosition(control_elem);

            // TODO Element의 bottom 좌표를 바로 얻는 API로 바꾸는게 바람직 (현재 없음)
            var left = pos.x;
            var top = pos.y + (this._adjust_height);

            top -= this._getHelperLineHeight();

            popup_control_elem.setElementPosition(left, top);
        }
    };

    _pDateField._createDatePicker = function ()
    {
        var datepicker = this._p_datetimepicker;

        if (datepicker)
            datepicker.destroy();

        datepicker = this._p_datetimepicker = new nexacro.DateRangePicker("datetimepicker", 0, 0, 0, 0, null, null, null, null, null, null, this);
        datepicker._excluded_flex = true;
        datepicker._setControl();
        //   datepicker._useclosebutton = true;
        datepicker._is_popup_child = true;
        datepicker.set_displaymonthcount(1);
        datepicker.set_type("single");
        datepicker._setPopupContains(true);
        //datepicker._is_focus_accept = false;
        datepicker._headline_autoposition = true;
        datepicker.set_displaytype(this._input_type);
        datepicker._usertimeformat = this._format;
        datepicker.createComponent(true);
    };

    _pDateField._createPopupControl = function ()
    {
        var popupcontrol = this._popupcontrol;
        if (!popupcontrol)
        {
            popupcontrol = this._popupcontrol = new nexacro._DateFieldPopupControl("datefieldpopup", 0, 0, 0, 0, null, null, null, null, null, null, this);
            popupcontrol._excluded_flex = true;
            popupcontrol.createComponent(true);
        }
    };

    _pDateField._createPopupDatePickerControl = function ()
    {
        this._createPopupControl();
        this._createDatePicker();

        var datepicker = this._p_datetimepicker;
        var popupcontrol = this._popupcontrol;

        popupcontrol._attach(datepicker);

        if (!popupcontrol._is_created)
        {
            popupcontrol.on_created();
        }
        if (!datepicker._is_created)
        {
            this._setEventHandlerToDatePicker();
            this._applyDatePickerProps();
            datepicker.on_created();
        }

        if (this._p_useheadline == null || this._p_useheadline == "")
            datepicker.set_useheadline(this._popuptype == "mobile");
        else
            datepicker.set_useheadline(this._p_useheadline);

        datepicker.set_locale(this._p_locale);
    };

    _pDateField._applyDatePickerProps = function ()
    {
        var datepicker = this._p_datetimepicker;
        if (datepicker)
        {
            datepicker._setEnable(this._p_enable);
            datepicker.set_readonly(this._p_readonly);
            datepicker.set_startdate(this._p_value);
            datepicker.set_innerdataset(this._p_innerdataset);
            datepicker.set_backgroundcolumn(this._p_backgroundcolumn);
            datepicker.set_bordercolumn(this._p_bordercolumn);
            datepicker.set_datecolumn(this._p_datecolumn);
            datepicker.set_textcolorcolumn(this._p_textcolorcolumn);
            datepicker.set_hintingcolumn(this._p_hintingcolumn);
            datepicker.set_readonlycolumn(this._p_readonlycolumn);
            datepicker.set_locale(this._p_locale);
            datepicker.set_headlinedateformat(this._p_headlinedateformat);
            datepicker.set_headlinetimeformat(this._p_headlinetimeformat);
            datepicker.set_headlineposition(this._p_headlineposition);
            datepicker.set_headlinesize(this._p_headlinesize);
            if (this._input_type != "date")
            {
                datepicker.set_okbuttontext(this._p_okbuttontext);
                datepicker.set_cancelbuttontext(this._p_cancelbuttontext);
            }
            datepicker.on_apply_value();
            /*
            else
            {
                datepicker.set_closebuttontext(this._p_closebuttontext);
            }*/
            //datepicker.set_closebuttonsize(this._p_closebuttonsize);
        }
    };

    _pDateField._setEventHandlerToDatePicker = function ()
    {
        var datepicker = this._p_datetimepicker;
        if (datepicker)
        {
            datepicker._setEventHandler("ondayclick", this._on_datepicker_ondayclick, this);
            datepicker._setEventHandler("oncloseup", this._on_datepicker_oncloseup, this);
            //datepicker._setEventHandler("onchanged", this._on_datepicker_onchanged, this); [DateRangePicker 키액션 기능 추가 후 DateField와 연동]
        }
    };

    _pDateField._on_datepicker_ondayclick = function (obj, e)
    {
        if (this._input_type == "time")
            return;

        this.on_fire_ondayclick(e.date);
    };
    /* [DateRangePicker 키액션 기능 추가 후 DateField와 연동]
    _pDateField._on_datepicker_onchanged = function (obj, e)
    {
        var pre_value = this._default_value;
        var pre_text = this._default_text;
        var cur_value, cur_text;

        cur_value = e.poststartdate;
        cur_text = this._makeBufferTextFromValue(cur_value);

        this._on_value_change(pretext, prevalue, posttext, postvalue);
    };
    */
    _pDateField._releaseCaptureLock = function ()
    {
        var _window = this._getWindow();
        if (_window && this._track_capture)
        {
            _window._releaseCaptureLock(this);
        }
    };

    _pDateField._on_datepicker_oncloseup = function (obj, e)
    {
        if (e._is_external_call)
        {
            this._releaseCaptureLock();

            if (this._recursive_closeup)
                return;
        }
        else
        {
            this._recursive_closeup = true;

            if (this._isPopupVisible())
                this._closePopup(this._p_autoskip);

            this._recursive_closeup = undefined;
        }

        this._changeStatus("mouseover", false);
        this._box._trailbutton._changeStatus("mouseover", false);

        var pretext = this._p_text;
        var prevalue = this._p_value;

        if (e._apply_value)
        {
            var curvalue = e._startdate;
            var curtext = this._makeBufferTextFromValue(curvalue);
            this._on_value_change(pretext, prevalue, curtext, curvalue);
        }

        this.on_fire_oncloseup(this, pretext, prevalue, this._p_text, this._p_value);

        if (!this._onlydisplay)
        {
            this._input_element.setElementFocus();
        }
    };

    _pDateField.on_fire_ondayclick = function (postdate)
    {
        if (this.ondayclick && this.ondayclick._has_handlers)
        {
            var evt = new nexacro.DateFieldDayClickEventInfo(this, "ondayclick", postdate);
            return this.ondayclick._fireEvent(this, evt);
        }
        return true;
    };

    _pDateField._showPopup = function ()
    {
        /* 접근성 작업 후 Accessibility_Comp.js에 이관 */
        //const enableaccessibility = this._env._p_enableaccessibility;
        //if (enableaccessibility)
        //{
        //    this._want_arrows = true;
        //}

        var _window = this._getWindow();
        var control_elem = this.getElement();
        if (control_elem)
        {
            var ret = this.on_fire_ondropdown(this);
            if (this.ondropdown && this.ondropdown.defaultprevented == true)
                return;

            if (this._popuptype == "none" || this._type == "system")
                return;

            if (ret)
            {
                this._createPopupDatePickerControl();
                var popupcontrol = this._popupcontrol;
                var popupsize = this._getPopupSizeArr();

                var pos = this._getElementPosition();
                var cal_winpos_left = pos.x;
                var cal_winpos_top = pos.y;

                var parentpos = popupcontrol._getPopupParentPos();

                var cal_height = parentpos.height;

                var popup_left = 0;
                var popup_top = cal_height;
                var popup_width = popupsize.width;
                var popup_height = popupsize.height;

                var popup_winpos_right = cal_winpos_left + popup_width;
                var popup_winpos_bottom = cal_winpos_top + cal_height + popup_height;

                var win_width = _window.clientWidth;
                var win_height = _window.clientHeight;
                var width_gap = popup_winpos_right - win_width;

                ///* popup에 초점을 읽게하기 위함 */
                //if (this._input_element && enableaccessibility)
                //{
                //    var descendant_elem = this._input_element;
                //    control_elem.setElementAccessibilityActiveDescendant(popupcontrol, descendant_elem);
                //}

                if (popup_winpos_right > win_width && cal_winpos_left > width_gap)
                {
                    popup_left = popup_left - width_gap;
                }

                if (cal_winpos_left < 0)
                {
                    popup_left = -cal_winpos_left;
                }

                if (cal_winpos_top > popup_height && popup_winpos_bottom > win_height)
                {
                    popup_top = -popup_height;
                }

                if (popup_winpos_bottom > win_height)
                {
                    var t_temp = win_height - popup_height;
                    if (t_temp < 0)
                        popup_top = -cal_winpos_top;
                    else if (popup_height > cal_winpos_top)
                        popup_top = t_temp - cal_winpos_top;
                }

                // 팝업도 동일 비율로 확대/축소

                if (this._popuptype == "center" || this._popuptype == "mobile")
                {
                    var frame = _window.root;
                    var frame_pos = nexacro._getElementPositionInFrame(frame.getElement());
                    var width = frame.width;
                    var height = frame.height;
                    if (nexacro._Browser == "Runtime")
                    {
                        // screen 높이에 따라 계산 되어야 하므로 보정 
                        width = Math.round(width / nexacro._getDevicePixelRatio(this.getElement()));
                        height = Math.round(height / nexacro._getDevicePixelRatio(this.getElement()));
                    }

                    var l = ((width / 2) - (popup_width / 2));
                    var t = ((height / 2) - (popup_height / 2));

                    t = t < 0 ? 0 : t;

                    popupcontrol._popup((l + frame_pos.x), (t + frame_pos.y), popup_width, popup_height);
                }
                else
                {
                    if (popup_top > 0)
                        popup_top -= this._getHelperLineHeight();

                    popupcontrol._popupBy(this, popup_left + parentpos.xgap, popup_top + parentpos.ygap, popup_width, popup_height);
                }

                if (_window && this._track_capture)
                {
                    _window._setCaptureLock(this, true, false);
                }
            }
        }
    };

    _pDateField._applyZoomPopup = function ()
    {
        if (this._isPopupVisible())
        {
            this._showPopup();
        }
    };

    _pDateField._closePopup = function (autoskip, no_apply)
    {
        if (this._type == "system")
        {
            nexacro._closeSystemCalendar();
            return;
        }
        else
        {
            var popupcontrol = this._popupcontrol;
            if (popupcontrol)
            {
                popupcontrol._closePopup();

                if (autoskip)
                    this._setFocusToNextComponent();
            }
        }

        /* 접근성 작업 후 Accessibility_Comp.js에 이관 */
        //const env = this._env;
        //if (env._p_enableaccessibility)
        //{
        //    this._want_arrows = false;
        //    if (env._a11ytype != 2)
        //    {
        //        // 팝업 닫힐때 가상커서 초점을 잃음
        //        this._input_element.setElementFocus();
        //    }
        //}
    };

    _pDateField._convertValueType = function (v, dateobj, bapplyrule)
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


    //===============================================================
    // nexacro.DateField : Events
    //===============================================================
    _pDateField.on_keydown_default_specialkey_process = function (keycode)
    {
        var ret = true;

        // Enter는 default process에서 처리
        if (keycode != nexacro.Event.KEY_RETURN)
        {
            ret = nexacro.TextField.prototype.on_keydown_default_specialkey_process.call(this, keycode);
        }
        return ret;
    };

    _pDateField._on_value_change = function (pretext, prevalue, posttext, postvalue)
    {
        if (this._beginValueChange())
        {
            return false;
        }

        var ret = true;

        if (!this.on_fire_canchange(this, pretext, prevalue, posttext, postvalue))
        {
            ret = false;
        }
        else if (!this.applyto_bindSource("value", postvalue))
        {
            ret = false;
        }

        if (!ret)
        {
            this._p_value = prevalue;
            this.on_apply_value(prevalue);
            /* [DateRangePicker 키액션 기능 추가 후 DateField와 연동]
            if (bclose)
            {
                if (this._input_type == "date")
                {
                    if (this._isPopupVisible())
                        this._closePopup();
                }
            }
            */
        }
        else
        {
            if (this._p_value != prevalue)            
            {
                if (this._p_value != postvalue)
                {
                    /* [DateRangePicker 키액션 기능 추가 후 DateField와 연동]
                    if (this._input_type == "date")
                    {
                        if (this._isPopupVisible())
                            this._closePopup();
                    }
                    */
                    this._invalidStatus(false);
                    this._validStatus(false);

                    var check = this._checkApplyValidate(postvalue);

                    if (check == false)
                        this.on_invalid(true);
                    else if (check == true)
                        this.on_valid(true);

                    ret = false;
                }
            }
        }

        if (ret)
        {
            this._setValue(postvalue);
            this._default_value = postvalue;
            this._default_text = posttext;

            this.on_fire_onchanged(this, pretext, prevalue, posttext, postvalue);
            /* [DateRangePicker 키액션 기능 추가 후 DateField와 연동]
            if (this._input_type == "date")
            {
                if (this._isPopupVisible())
                    this._closePopup(this._p_autoskip);
            }
            */
            this._updateAccessibilityLabel();
        }

        this._finalValueChange();

        return true;
    };

    _pDateField.on_fire_onchanged = function (obj, pretext, prevalue, posttext, postvalue)
    {
        if (this.onchanged && this.onchanged._has_handlers)
        {
            var evt = new nexacro.ChangeEventInfo(obj, "onchanged", pretext, prevalue, posttext, postvalue);
            return this.onchanged._fireEvent(this, evt);
        }
    };

    _pDateField.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        var retn = true;
        if (this.oneditclick && this.oneditclick._has_handlers)
        {
            var caretpos = this.getCaretPos();
            var clientXY = this._getClientXY(canvasX, canvasY);

            var evt = new nexacro.EditClickEventInfo(this, "oneditclick", caretpos, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientXY[0], clientXY[1], this, this, meta_key);
            retn = this.oneditclick._fireEvent(this, evt);
        }

        this._on_edit_oneditclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

        return retn;
    };

    _pDateField._on_edit_oneditclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        var is_popup = (this._type == "system" && !this._p_readonly);
        var is_control = this.getElement() ? true : false;

        if (!is_popup || !is_control)
        {
            var bMobile = ((nexacro._isMobile && nexacro._isMobile()) || (nexacro._isHybrid && nexacro._isHybrid()) || (!nexacro._isDesktop() && nexacro._OS == "Android" && nexacro._Browser == "Runtime")) || nexacro._isTouchInteraction;

            if (bMobile)
            {
                this._showPopup();
                this._setDatePickerValue(this._getConfirmValue());
                this._setInitCaret();
            }
            return;
        }

        var ret = this.on_fire_ondropdown(this);
        if (ret)
        {
            var use_timer = false;
            var delay = -1;

            if (this instanceof nexacro.MaskEdit) //obj 가 this를 말하는건가?
            {
                this._box._trailbutton._control_element.setElementFocus();

                if (nexacro._OS == "iOS" && nexacro._Browser == "MobileSafari")
                {
                    const enableaccessibilty = this._env._p_enableaccessibility;
                    if (nexacro._SystemType == "ipad")
                    {
                        if (parseFloat(nexacro._OSVersion) >= 13)
                        {
                            // ipad는 딜레이가 더필요함.
                            if (!enableaccessibilty)
                                use_timer = true;
                            delay = 350;
                        }
                    }
                    else if (nexacro._SystemType == "iphone")
                    {
                        if (parseFloat(nexacro._OSVersion) >= 14)
                        {
                            if (!enableaccessibilty)
                                use_timer = true;
                            delay = 5;
                        }
                    }
                }
            }

            if (use_timer)
            {
                var pThis = this;
                setTimeout(function ()
                {
                    nexacro._openSystemCalendar(pThis, pThis._p_value, "_on_notify_mobile_valuechanged");
                }, delay);
            }
            else
            {
                nexacro._openSystemCalendar(this, this._p_value, "_on_notify_mobile_valuechanged");
            }
        }
    };

    _pDateField._on_dataset_onvaluechanged = function (obj, e)
    {
        if (this._is_created)
        {
            this.on_fire_oninnerdatachanged(obj, e.oldvalue, e.newvalue, e.columnid, e.col, e.row);
        }
    };

    _pDateField.on_fire_oninnerdatachanged = function (obj, oldvalue, newvalue, columnid, col, row)
    {
        if (this.oninnerdatachanged && this.oninnerdatachanged._has_handlers)
        {
            var evt = new nexacro.InnerdataChangedEventInfo(obj, "oninnerdatachanged", oldvalue, newvalue, columnid, col, row);
            return this.oninnerdatachanged._fireEvent(this, evt);
        }

        return true;
    };

    _pDateField._on_notify_mobile_valuechanged = function (v)
    {
        if (this._type == "system")
        {
            this._setCalendarEditValue(v);

            this.on_fire_oninput();

            var cur_value, cur_text;
            var maskobj = this._masktypeobj;
            if (maskobj)
            {
                if (maskobj._use_edit_buf)
                {
                    cur_value = maskobj.changeNormalizeValueFromBuffer();
                }
                else
                {
                    cur_value = maskobj.changeNormalizeValue(this._input_element.value);
                }

                if (this._p_value != cur_value)
                {
                    cur_text = this._makeBufferTextFromValue(cur_value);
                    this._on_value_change(this._p_text, this._p_value, cur_text, cur_value);
                }
            }
        }
    };

    _pDateField.on_keyinput_basic_action = function (input_text)
    {
        if (this._skip_oninput)
            return false;

        this._oninput_cnt++;
        if (this._p_readonly || !this._isEnable() || this._oninput_cnt != 1)
        {
            return false;
        }

        var cur_value, cur_text;

        if (this._input_element._getInputValue() == this._getEmptyText())  // delete, backspace로 모두 지워 졌을 때
            cur_value = "";
        else
            cur_value = this._makeValueFromBuffer(undefined, this._no_adjust_val);

        cur_text = this._makeBufferTextFromValue(cur_value, undefined, undefined, this._no_adjust_val);

        if (this._type == "system")
        {
            if (this._p_value != cur_value)
            {
                this._on_value_change(this._p_text, this._p_value, cur_text, cur_value);
            }
        }

        if (this._input_element._is_sys_focused)
        {
            var year = cur_value.substr(0, 4);
            var month = cur_value.substr(4, 2);
            var day = cur_value.substr(6, 2);

            // hh : 두자리 포맷인경우 최초 0값을 입력할 경우, 예외처리가 필요, am/pm 과 같이 연동되기 때문에 후보정 필요.
            if (this._no_adjust_val && this._range.hour && this._range.hour.format == "hh" && this._range.ampm)
            {
                var date_val = "";
                var time_val;
                if (this._input_type == "time")
                {
                    time_val = cur_value;
                }
                else if (this._input_type == "datetime")
                {
                    date_val = cur_value.substr(0, 8);
                    time_val = cur_value.substr(8, 9);
                }

                var ampm = this._range.ampm._p_text;

                if (time_val)
                {
                    var hour = time_val.substr(0, 2);
                    if (this._ampm[0] == ampm)  // AM
                    {
                        if (hour == "12")   // AM 12 -> 00 / AM 01~11 -> 01~11
                            hour = "00";
                    }
                    else if (this._ampm[1] == ampm) // PM
                    {
                        if (hour < "12")    // PM 12 -> 12 / PM 00~11 -> 12~23
                            hour = parseInt(hour) + 12 + "";
                    }

                    time_val = hour + time_val.slice(2);
                    cur_value = date_val + time_val;
                }
            }

            if (!(/^[0-9]+$/.test(cur_value)) || (this._input_type != "time" && (month == "00" || day == "00")))
            {
                this._invalid_value = cur_value;
                this._p_value = "";
            }
            else
            {
                this._invalid_value = "";
                this._p_value = cur_value;
            }

            this._p_text = cur_text;
        }
        /*
        else
        {
            this.set_value(cur_value);
        }
        */
        /* picker 제어 안함. [DateRangePicker 키액션 기능 추가 후 DateField와 연동]
        if (this._isPopupVisible())
            this._setDatePickerValue(this._p_value);
        */

        this._updateAccessibilityLabel();
    };

    _pDateField.on_fire_oninput = function ()
    {
        if (!this._skip_oninput && this._oninput_cnt == 1)
        {
            this._invalidStatus(false);
            this._validStatus(false);

            var check = this._checkInputValidate(this._p_value);
            var apply_value = false;

            if (check == false)
                this.on_invalid(apply_value);
            else if (check == true)
                this.on_valid(apply_value);

            if (this.oninput && this.oninput._has_handlers)
            {
                var evt = new nexacro.InputEventInfo(this, "oninput");
                return this.oninput._fireEvent(this, evt);
            }
        }
        return true;
    };

    _pDateField._getRangeMaxVal = function (range)
    {
        var all = this._range;

        if (range.format == "dd" || range.format == "d")
        {
            var year = all.year ? all.year._p_text : "0000";
            var month = all.month ? all.month._p_text : "01";

            if (year != "" && month != "")
            {
                var lastday = this._getLastDay(year, month);
                if (lastday > 0)
                    return lastday;
            }
        }
        return range.max;
    };

    _pDateField._getRangeMinVal = function (range)
    {
        return range.min
    };

    _pDateField._clearTypingRange = function ()
    {
        this._append_typing_range = null;
        this._append_typing_cnt = 0;
    };

    _pDateField._is_imecode = false;
    _pDateField.on_keydown_basic_process = function (keycode, altkey, ctrlkey, shiftkey, refercomp, metakey)
    {
        if (nexacro._OS == "Mac OS" || nexacro._OS == "OSX" || nexacro._OS == "iOS")
            ctrlkey = metakey;

        var input_elem = this._input_element;
        if (!input_elem || this._onlydisplay)
            return false;

        this._oninput_cnt = 0;
        this._skip_oninput = undefined;
        this._is_imecode = false;

        if (keycode == nexacro.KeyCode_ImeInput || keycode == 25) // 25 한자키
        {
            this._is_imecode = true;
            var input_handle = input_elem.handle;

            if (nexacro._Browser == "Chrome" || (nexacro._Browser == "Edge" && nexacro._BrowserType == "WebKit"))
            {
                input_handle.blur();
                input_handle.focus();
            }
            input_elem.stopSysEvent();
        }
        /* ctrl + (z, y)
        else if (!altkey && !shiftkey && ctrlkey && keycode == 90) // 'z'
        {
            
        }
        else if (!altkey && !shiftkey && ctrlkey && keycode == 89) // 'y'
        {
            
        }
        */
    };

    _pDateField.on_keydown_default_process = function (keycode, altkey, ctrlkey, shiftkey, refercomp, metakey)
    {
        if (nexacro._OS == "Mac OS" || nexacro._OS == "OSX" || nexacro._OS == "iOS")
            ctrlkey = metakey;

        if (this._p_readonly || !this._isEnable())
            return true;

        var input_elem = this._input_element;

        /* 팝업 활성화된 후에는 이 함수를 타지 않아야 함. [DateRangePicker 키액션 기능 추가 후 DateField와 연동]
        if (this._isPopupVisible())
        {
            if (keycode == nexacro.Event.KEY_DOWN || keycode == nexacro.Event.KEY_UP || keycode == nexacro.Event.KEY_LEFT || keycode == nexacro.Event.KEY_RIGHT || 
                keycode == nexacro.Event.KEY_HOME || keycode == nexacro.Event.KEY_END || keycode == nexacro.Event.KEY_PAGE_DOWN || keycode == nexacro.Event.KEY_PAGE_UP)
            {
                if (this._input_type == "date")
                {
                    this._p_datetimepicker._datepicker_group.on_keydown_basic_action(keycode, altkey, ctrlkey, shiftkey, refercomp, metakey);
                }
                else if (this._input_type == "datetime")
                {
                    if (ctrlkey && altkey)
                        this._p_datetimepicker.on_keydown_basic_action(keycode, altkey, ctrlkey, shiftkey, refercomp, metakey);
                    else
                    {
                        if (this._p_datetimepicker._currenttab == "date")
                            this._p_datetimepicker._datepicker_group.on_keydown_basic_action(keycode, altkey, ctrlkey, shiftkey, refercomp, metakey);
                        else
                            this._p_datetimepicker._timepicker_group.on_keydown_basic_action(keycode, altkey, ctrlkey, shiftkey, refercomp, metakey);
                    }
                }
                else // time
                {
                    this._p_datetimepicker._timepicker_group.on_keydown_basic_action(keycode, altkey, ctrlkey, shiftkey, refercomp, metakey);
                }

                input_elem.stopSysEvent();
                return false;
            }
        }
        */

        if (!input_elem || this._onlydisplay)
            return false;

        var input_value = input_elem._getInputValue();
        var pos = input_elem.getElementCaretPos();

        //-----------------------------------------
        function isEmpty(text, range)
        {
            if (isNaN(parseInt(text)))
                return true;

            return false;
        };
        //-----------------------------------------

        var NUM_KEY_CODE_ZERO = 48;
        var NUM_KEYPAD_CODE_ZERO = 96;

        var is_number_key = (keycode >= NUM_KEY_CODE_ZERO && keycode <= (NUM_KEY_CODE_ZERO + 9));
        var is_number_keypad = (keycode >= NUM_KEYPAD_CODE_ZERO && keycode <= (NUM_KEYPAD_CODE_ZERO + 9));
        var is_up_key = (keycode == nexacro.Event.KEY_UP);
        var is_down_key = (!altkey && keycode == nexacro.Event.KEY_DOWN);

        if (is_number_key || is_number_keypad || is_up_key || is_down_key)
        {
            var num, ampm;
            var range = this._findRangeFromPos(pos.begin);
            if (shiftkey || !range)
            {
                input_elem.stopSysEvent();
                return false;
            }

            var s_text = input_value.substring(range.beg, range.end)
            var input_no;

            this._point_range = null;   // shift selection 중 입력이 들어오면 풀림

            if (range._p_readonly)
            {
                input_elem.stopSysEvent();
                return false;
            }
            else if (range.format == "aa")   // AM/PM
            {
                if (is_number_key || is_number_keypad)
                {
                    if (is_number_key)
                        input_no = num = keycode - NUM_KEY_CODE_ZERO;
                    else if (is_number_keypad)
                        input_no = num = keycode - NUM_KEYPAD_CODE_ZERO;

                    if (input_no > 1)
                    {
                        input_elem.stopSysEvent();
                        return false;
                    }

                    ampm = this._ampm[input_no];
                }
                else
                {
                    if (s_text == this._ampm[0])
                        ampm = this._ampm[1];
                    else
                        ampm = this._ampm[0];
                }

                this._clearTypingRange();
                this._replaceRangeDate(ampm, range);

                if (is_number_key || is_number_keypad)
                {
                    var next = this._findNextRange(range.end);
                    if (next)
                    {
                        this.setSelect(next.beg, next.end, true);
                        this._clearTypingRange();
                    }
                }
            }
            else
            {
                var max = this._getRangeMaxVal(range, this._range);
                var min = this._getRangeMinVal(range, this._range);

                if (is_number_key)
                {
                    input_no = num = keycode - NUM_KEY_CODE_ZERO;
                }
                else if (is_number_keypad)
                {
                    input_no = num = keycode - NUM_KEYPAD_CODE_ZERO;
                }
                else if (is_up_key)
                {
                    if (isEmpty(s_text, range))
                    {
                        if (range.format == "yyyy")
                            num = (new Date()).getYear();
                        else
                            num = min;
                    }
                    else if (parseInt(s_text) >= max)
                    {
                        num = min;
                    }
                    else
                    {
                        num = parseInt(s_text) + 1;
                    }

                    this._clearTypingRange();
                }
                else if (is_down_key)
                {
                    if (isEmpty(s_text, range))
                    {
                        if (range.format == "yyyy")
                            num = (new Date()).getYear();
                        else
                            num = max;
                    }
                    else if (parseInt(s_text) <= min)
                    {
                        num = max;
                    }
                    else
                    {
                        num = parseInt(s_text) - 1;
                    }

                    this._clearTypingRange();
                }

                ///////////////////////////////////////////////////////////////
                if (this._append_typing_range != range)
                    this._clearTypingRange();

                if (isEmpty(s_text, range))   // first typing
                {
                    num = this._padNumberWithZero(num, range.format.length);
                }
                else
                {
                    if (this._append_typing_range) // typing same range
                    {
                        var pre_n = parseInt(s_text);
                        num = pre_n.toString() + num.toString();
                        num = this._padNumberWithZero(num, range.format.length);
                    }
                    else // changed range
                    {
                        num = this._padNumberWithZero(num, range.format.length);
                    }
                }

                if (is_up_key || is_down_key)
                {
                    this._clearTypingRange();
                }
                else // number key
                {
                    this._append_typing_range = range;
                    this._append_typing_cnt++;
                }

                var max_key_cnt = range.format.length;
                if (max_key_cnt == 1)   // 1자리 포맷인 경우10단위가 허용되는 값만 2번 입력 가능. 이 외는 next로 이동
                {
                    var plus = false;
                    var n_num = parseInt(num);

                    if (n_num < 10)
                    {
                        switch (range.format)
                        {
                            case "M":
                                plus = (input_no == 1);
                                break;
                            case "d":
                                if (parseInt(this._range.month._p_text) == 2)
                                    plus = (input_no >= 1 && input_no <= 2);
                                else
                                    plus = (input_no >= 1 && input_no <= 3);
                                break;
                            case "H":
                                plus = (input_no >= 1 && input_no <= 2);
                                break;
                            case "h":
                                plus = (input_no == 1);
                                break;
                            case "m":
                            case "s":
                                plus = (input_no >= 1 && input_no <= 5);
                                break;
                        }
                    }
                    else if (n_num >= 10)
                    {
                        plus = true;
                    }

                    if (plus)
                        max_key_cnt++;
                }

                if (parseInt(num) == 0 && range.format == "yyyy" || range.format == "MM" || range.format == "dd" || range.format == "hh")   // 0 값을 허용하지 않는 포맷
                {
                    // 2자리 이상 포맷에서 모든 자리가 0이면 range에서 처음 0을 입력한 상태이며, 아직 완성된 값이 아니므로 oninput 실행X
                    this._no_adjust_val = true;
                }

                var is_next_move = (this._append_typing_cnt == max_key_cnt);   // format length 만큼 입력이 끝난 경우

                if (max > 0 && (this._append_typing_cnt > 0 || this._append_typing_cnt < max_key_cnt))
                {
                    var s_max = max + "";
                    s_max = s_max.substring(0, 1);

                    if (input_no > parseInt(s_max)) // 입력중 max값 넘기는 여부 체크 (month : 첫 입력 글자가 2 일 경우, 십단위가 2가 될 수 없으므로 next로 이동)
                        is_next_move = true;
                }

                if (is_up_key == false && is_down_key == false && is_next_move)
                {
                    if (parseInt(num) < min)    // 00, 0000
                    {
                        this._no_adjust_val = undefined;
                        num = this._padNumberWithZero(min, range.format.length);
                    }

                    if (parseInt(num) <= max)
                        this._replaceRangeDate(num, range);

                    var next = this._findNextRange(range.end);
                    if (next)
                    {
                        this.setSelect(next.beg, next.end, true);
                        this._clearTypingRange();
                    }
                    else
                    {
                        this.setSelect(range.beg, range.end, true);
                        this._append_typing_range = range;
                        this._append_typing_cnt = 0;

                        if (this._p_autoskip)
                            this._on_input_autoskip();
                        else
                            this._clearTypingRange();
                    }
                }
                else
                {
                    if (parseInt(num) <= max)
                        this._replaceRangeDate(num, range);
                }

                this._no_adjust_val = undefined;
            }
            input_elem.stopSysEvent();
        }
        else if (keycode == nexacro.Event.KEY_BACKSPACE || keycode == nexacro.Event.KEY_DEL)
        {
            var select_ranges = this._select_ranges;
            var first, range, empty;

            for (var i = select_ranges.length - 1; i >= 0; i--)
            {
                range = select_ranges[i];

                if (range._p_readonly)
                    continue;

                if (this._mask_char)
                    empty = range.format.replace(/./g, this._mask_char);
                else
                    empty = range.empty;

                if (!first)
                    first = range;

                this._setRangetext("", range);

                if (i == 0)
                    this._skip_oninput = false; // oninput fire
                else if (i > 0)
                    this._skip_oninput = true;  // oninput fire skip

                this._replaceRangeInputText(input_elem, empty, range);
            }

            if (keycode == nexacro.Event.KEY_DEL)
            {
                this.setSelect(select_ranges[0].beg, select_ranges[select_ranges.length - 1].end, true);
            }
            else if (keycode == nexacro.Event.KEY_BACKSPACE)
            {
                var prev = this._findPrevRange(first.beg);
                if (prev)
                {
                    this.setSelect(prev.beg, prev.end, true);
                }
            }
            this._clearTypingRange();
            input_elem.stopSysEvent();
        }
        else if (!altkey && !ctrlkey && this._isChar(keycode))
        {
            this._skip_oninput = true;   // for NRE
            input_elem.stopSysEvent();
        }

        if (keycode == nexacro.Event.KEY_ESC)
        {
            /* [DateRangePicker 키액션 기능 추가 후 DateField와 연동]
            if (this._isPopupVisible())
                this._closePopup(false, true);
            */
            if (this._is_use_esc_cancelvalue)
                this._cancelValue();
        }
        else if (keycode == nexacro.Event.KEY_ENTER)
        {
            /* [DateRangePicker 키액션 기능 추가 후 DateField와 연동]
            if (this._isPopupVisible())
                this._closePopup();
            else
            */
            this._confirmValue();

            return true;
        }
        else if (altkey && keycode == nexacro.Event.KEY_DOWN)
        {
            if (!this._isPopupVisible())
            {
                this._setDatePickerValue(this._p_value);
                this._showPopup();
                this._setInitCaret();
            }
        }

        if (keycode == 65 && ctrlkey)   // ctrl + A
        {
            this._selectAll();
        }

        if (keycode == nexacro.Event.KEY_UP || keycode == nexacro.Event.KEY_DOWN)
        {
            if (nexacro._Browser != "Runtime")
                this._input_element.stopSysEvent();
        }

        //----- selection jump (left <-> right) -----
        if (keycode == nexacro.Event.KEY_LEFT || keycode == nexacro.Event.KEY_RIGHT || keycode == nexacro.Event.KEY_HOME || keycode == nexacro.Event.KEY_END)
        {
            if (shiftkey)
            {
                var select_start = this._select_ranges[0];
                var select_last = this._select_ranges[this._select_ranges.length - 1];
                var beg, end;
                var is_add, point = this._point_range;
                var is_selectall = this._select_ranges.length == this._ranges_order.length;

                if (keycode == nexacro.Event.KEY_LEFT)
                {
                    if (!point)
                    {
                        point = this._point_range = select_last;
                        is_add = true;
                    }
                    else if (this._select_ranges.length)
                    {
                        if (point == select_last)
                            is_add = true;
                        else if (point == select_start)
                            is_add = false;
                        else if (is_selectall)
                        {
                            if (point.area != select_last.area)
                                is_add = false;
                        }
                    }

                    if (is_add == true)
                    {
                        var prev = this._findPrevRange(select_start.beg);
                        if (prev)
                        {
                            beg = prev.beg;
                            end = this._point_range.end;
                            this.setSelect(beg, end);
                        }
                    }
                    else if (is_add == false)
                    {
                        var prev = this._findPrevRange(select_last.beg, point.area);
                        if (prev)
                        {
                            beg = this._point_range.beg;
                            end = prev.end;
                            this.setSelect(beg, end);
                        }
                    }
                }
                else if (keycode == nexacro.Event.KEY_RIGHT)
                {
                    if (!point)
                    {
                        point = this._point_range = select_start;
                        is_add = true;
                    }
                    else if (this._select_ranges.length)
                    {
                        if (point == select_start)
                            is_add = true;
                        else if (point == select_last)
                            is_add = false;
                        else if (is_selectall)
                        {
                            if (point.area != select_start.area)
                                is_add = false;
                        }
                    }

                    if (is_add == true)
                    {
                        var next = this._findNextRange(select_last.end);
                        if (next)
                        {
                            beg = this._point_range.beg;
                            end = next.end;
                            this.setSelect(beg, end);
                        }
                    }
                    else if (is_add == false)
                    {
                        var next = this._findNextRange(select_start.end, point.area);

                        if (next)
                        {
                            beg = next.beg;
                            end = this._point_range.end;
                            this.setSelect(beg, end);
                        }
                    }
                }
                else if (keycode == nexacro.Event.KEY_HOME)
                {
                    if (!point)
                        point = this._point_range = select_last;

                    var prev = this._ranges_order[0];

                    beg = prev.beg;
                    end = point.end;
                    this.setSelect(beg, end);
                }
                else if (keycode == nexacro.Event.KEY_END)
                {
                    if (!point)
                        point = this._point_range = select_start;

                    var next = this._ranges_order[this._ranges_order.length - 1];

                    beg = point.beg;
                    end = next.end;
                    this.setSelect(beg, end);
                }
            }
            else
            {
                if (keycode == nexacro.Event.KEY_LEFT || keycode == nexacro.Event.KEY_END)
                {
                    var last = this._input_element._getInputValue().length;
                    var begin = (keycode == nexacro.Event.KEY_END) ? last : pos.begin;
                    var prev = this._findPrevRange(begin);
                    if (prev)
                    {
                        this._completeRangeDate();
                        this.setSelect(prev.beg, prev.end, true);
                        this._clearTypingRange();
                    }
                    else if (!shiftkey && this._select_ranges.length >= 2)  // ranges select 해제
                    {
                        this.setSelect(this._select_ranges[0].beg, this._select_ranges[0].end, true);
                    }
                }
                else // right, home
                {
                    var end = (keycode == nexacro.Event.KEY_HOME) ? 0 : pos.end;
                    var next = this._findNextRange(end);
                    if (next)
                    {
                        this._completeRangeDate();
                        this.setSelect(next.beg, next.end, true);
                        this._clearTypingRange();
                    }
                    else if (!shiftkey && this._select_ranges.length >= 2)  // ranges select 해제
                    {
                        this.setSelect(this._select_ranges[this._select_ranges.length - 1].beg, this._select_ranges[this._select_ranges.length - 1].end, true);
                    }
                }
            }

            this._input_element.stopSysEvent();
        }

        return false;
    };

    _pDateField.on_keyup_default_action = function (keycode, altkey, ctrlkey, shiftkey, refercomp, metakey)
    {
        this._skip_oninput = false;

        if (keycode == nexacro.Event.KEY_SHIFT)
        {
            this._point_range = null;
        }
    };

    _pDateField.__debugBuffer = function (textcomp)
    {
        nexacro._OnceCallbackTimer.callonce(this, function ()
        {
            var range, str = "";
            if (range = this._ranges_order)
            {
                for (var i = 0; i < range.length; i++)
                {
                    if (range[i])
                    {
                        if (i > 0)
                            str += "\n";

                        str += range[i].format + " : pos [" + range[i].beg + ", " + range[i].end + "], len (" + (range[i].end - range[i].beg) + ")";
                    }
                }
                textcomp.set_value(str + "\n");
            }
        });
    };

    _pDateField.__debugPasteBuffer = function ()
    {
        return this._debug_paste_buff;
    };

    _pDateField.__debugSelectBuffer = function (textcomp)
    {
        nexacro._OnceCallbackTimer.callonce(this, function ()
        {
            var range, str = "";
            if (range = this._select_ranges)
            {
                for (var i = 0; i < range.length; i++)
                {
                    if (range[i])
                    {
                        if (i > 0)
                            str += "\n";

                        str += range[i].format + " : pos [" + range[i].beg + ", " + range[i].end + "], len (" + (range[i].end - range[i].beg) + ")";
                    }
                }
                str += "\n";
                textcomp.set_value(str);
            }
        }, 100);
    };

    _pDateField._completeRangeDate = function ()
    {
        var range = this._append_typing_range;
        if (range && this._append_typing_cnt > 0 && this._append_typing_cnt < range.format.length)
        {
            var input_value = this._input_element._getInputValue();
            var s_text = input_value.substring(range.beg, range.end)

            if (parseInt(s_text) < range.min)    // 00, 0000
            {
                s_text = this._padNumberWithZero(range.min, range.format.length);
                this._replaceRangeDate(s_text, range);
            }
        };
    };

    _pDateField._getCurrentSelectRange = function ()
    {
        var input_element = this._input_element;
        if (input_element)
        {
            var pos = input_element.getElementCaretPos();
            var range = this._findRangeFromPos(pos.begin);

            return range;
        }
        return null;
    };

    _pDateField._on_input_autoskip = function ()
    {
        if (this._p_autoskip && this._p_value && this._getCurrentSelectRange() == this._ranges_order[this._ranges_order.length - 1])
        {
            this._setFocusToNextComponent();
        }
    };

    _pDateField._beforeinput_process_with_HTMLEvent = function (value, status, begin, end, inputType)
    {
        var input_elem = this._input_element;
        var maskobj = this._getMaskObj();
        var ret = [];
        if (maskobj && !this._onlydisplay)
        {
            var input_value = input_elem._getInputValue();
            var front_text, rear_text, update_value, result, input_pos;

            switch (inputType)
            {
                case "deleteContentBackward":
                case "deleteContentForward":
                case "deleteByCut":
                case "insertCompositionText":
                    ret.push(input_elem._BeforeinputState.CANCEL);
                    break;
                case "insertText":
                    /*
                    value = value ? value : "";
                    input_pos = maskobj.findNearEditablePos(begin, 1);

                    var _date = maskobj.isFilterCharEx(value, input_pos, end);
                    if (input_pos < 0 || (_date.ret && !_date.date))
                    {
                        ret.push(input_elem._BeforeinputState.CANCEL);
                    }
                    else
                    {
                        if (_date.ret)
                        {

                            ret.push(input_elem._BeforeinputState.REPLACE);
                            input_elem._beforeinput_result_data = maskobj.applyMaskEx(_date.date);
                            input_elem._beforeinput_result_pos = { begin: _date.pos, end: _date.pos };
                        }
                        else
                        {
                            if (begin == end)
                            {
                                update_value = input_value.substring(0, begin) + value + input_value.substring(end);
                                end = end + value.length;
                            }
                            else
                            {
                                var append_value = value + "".padLeft(end - value.length, " ");
                                update_value = input_value.substring(0, begin) + append_value + input_value.substring(begin);
                                end = append_value.length;
                            }

                            result = maskobj.arrangeMask(update_value, begin, end);
                            if (result == null)
                            {
                                ret.push(input_elem._BeforeinputState.CANCEL);
                            }
                            else
                            {
                                input_pos = maskobj.findNearEditablePos(begin + value.length, 1);

                                input_elem._beforeinput_result_data = result._p_text;
                                input_elem._beforeinput_result_pos = { begin: input_pos, end: input_pos };

                                ret.push(input_elem._BeforeinputState.REPLACE);
                            }
                        }
                    }*/
                    break;
                case "insertFromPaste":
                    if (this._on_paste(value))
                    {
                        input_elem._beforeinput_result_data = input_elem.value;
                        input_elem._beforeinput_result_pos = { begin: begin, end: end };
                        ret.push(input_elem._BeforeinputState.REPLACE);
                    }
                    else
                    {
                        this.on_invalid(true);
                        ret.push(input_elem._BeforeinputState.CANCEL);
                    }
                    break;
                case "historyUndo":
                case "historyRedo":
                    ret.push(input_elem._BeforeinputState.PREVENT_DEFAULT);
                    break;
                default:
                    ret.push(input_elem._BeforeinputState.PASS);
                    break;
            }
        }

        return ret;
    };

    _pDateField._beforeinput_process_with_NexacroInputEvent = function (value, status, begin, end)
    {
        var input_elem = this._input_element;
        if (input_elem && !this._onlydisplay)
        {
            var input_pos = 0;
            var bPaste = input_elem._paste_caret_pos ? true : false;
            var input_text = value ? value : "";
            var insert_text = "";
            var inputtype = input_elem.inputtype;

            var maskobj = this._getMaskObj();
            if (maskobj)
            {
                if (inputtype == "date")
                {
                    if (maskobj.getCurrentText() != input_text)
                    {
                        value = maskobj.removeMask(input_text.split(''));
                        maskobj.applyMask(value);
                    }
                }
                else
                {
                    if (bPaste)
                    {
                        value = value.substring(begin, end);

                        if (!this._on_paste(value))
                        {
                            this.on_invalid(true);
                            this._cancelValue();
                            this._skip_oninput = true;
                        }
                        input_elem.stopSysEvent();
                    }
                    else
                    {
                        if (this._is_imecode)   // IME 입력 방지(key 입력만..) : 영문은 keydown에서 처리, IME는 여기서 처리
                        {
                            this._skip_oninput = true;
                            input_elem.setElementValue(this._p_text);

                            if (this._select_ranges && this._select_ranges.length)
                                input_elem.setElementSetSelect(this._select_ranges[0].beg, this._select_ranges[this._select_ranges.length - 1].end);

                            input_elem.stopSysEvent();
                        }
                    }
                }
            }
        }
    };

    _pDateField._setDatePickerValue = function (value)
    {
        var datepicker = this._p_datetimepicker;
        if (datepicker)
            datepicker.set_startdate(value);
    };

    _pDateField._on_dblclick = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key)
    {
        if (this._onlydisplay)
            return;

        nexacro.Component.prototype._on_dblclick.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key);
        this._selectAreaWidthCurPos();
    };

    _pDateField._selectAll = function ()
    {
        var end = this._input_element.value.length;
        this.setSelect(0, end, true);
    };

    _pDateField._selectAreaWidthCurPos = function ()
    {
        var pos = this._input_element.getElementCaretPos();
        var range = this._findRangeFromPos(pos.begin);

        if (!range)
            return;

        if (range.area == "date")
            this._selectDate();
        else if (range.area == "time")
            this._selectTime();
    };

    _pDateField._selectDate = function ()
    {
        this._setAreaSelect("date");
    };

    _pDateField._selectTime = function ()
    {
        this._setAreaSelect("time");
    };

    _pDateField.setSelect = function (start, end, _no_adjust)
    {
        nexacro.TextField.prototype.setSelect.call(this, start, end);
        var selects = this._initSelectRanges();

        if (!_no_adjust)
        {
            if (selects.length > 0)
                nexacro.TextField.prototype.setSelect.call(this, selects[0].beg, selects[selects.length - 1].end);
        }

        if (this._isPopupVisible())
            this._p_datetimepicker._changeTab(selects[0].area);
    };

    _pDateField._setAreaSelect = function (area, no_input_select)
    {
        var ranges_order = this._ranges_order;
        var select_ranges = this._select_ranges;

        select_ranges = [];

        for (var i = 0; i < ranges_order.length; i++)
        {
            if (ranges_order[i].area == area)
                select_ranges.push(ranges_order[i]);
        }

        this._select_ranges = select_ranges;

        if (!no_input_select)
            nexacro.TextField.prototype.setSelect.call(this, select_ranges[0].beg, select_ranges[select_ranges.length - 1].end);
    };

    _pDateField._initSelectRanges = function ()
    {
        var input_elem = this._input_element;
        var pos = input_elem.getElementCaretPos();
        var range1, range2, orders;

        if (pos.begin == 0 && pos.end == input_elem.value.length)   // select all
        {
            this._select_ranges = [].concat(this._ranges_order);
            return this._select_ranges;
        }

        range1 = this._findRangeFromPos(pos.begin);
        range2 = this._findRangeFromPos(pos.end);

        this._select_ranges = [];

        if (!range1)
            range1 = this._findNextRange(pos.begin);
        if (!range2)
            range2 = this._findPrevRange(pos.end);

        if (!range1 && range2)
            range1 = range2;
        else if (!range2 && range1)
            range2 = range1;
        else if (!range2 && !range1)
            return this._select_ranges;

        if (range1 == range2)
        {
            this._select_ranges.push(range1);
        }
        else if (range1.area == range2.area)
        {
            orders = this._ranges_order;

            for (var i = 0; i < orders.length; i++)
            {
                if (orders[i] == range1)
                    this._select_ranges.push(orders[i]);
                else if (this._select_ranges.length > 0)
                    this._select_ranges.push(orders[i]);

                if (orders[i] == range2)
                    break;
            }
        }
        else
        {
            this._select_ranges = this._select_ranges.concat(this._ranges_order);
        }

        return this._select_ranges;
    };

    _pDateField._on_paste = function (value)
    {
        if (!value)
            return false;

        this._oninput_cnt = 0;

        var min, max, i;
        var select_ranges = this._select_ranges;

        if (select_ranges.length > 0)   // multi selection
        {
            var area_date, area_time;
            var select_area = "";
            var select_format = "";
            var buff_size = 0;

            for (i = 0; i < select_ranges.length; i++)
            {
                if (select_ranges[i].format.includes("y"))
                {
                    area_date = true;
                    select_format += "yyyy";
                }
                else if (select_ranges[i].format.includes("M"))
                {
                    area_date = true;
                    select_format += "MM";
                }
                else if (select_ranges[i].format.includes("d"))
                {
                    area_date = true;
                    select_format += "dd";
                }
                else if (select_ranges[i].format.includes("H") || select_ranges[i].format.includes("h"))
                {
                    area_time = true;
                    select_format += "HH";
                }
                else if (select_ranges[i].format.includes("m"))
                {
                    area_time = true;
                    select_format += "mm";
                }
                else if (select_ranges[i].format.includes("s"))
                {
                    area_time = true;
                    select_format += "ss";
                }
                else if (select_ranges[i].format.includes("S"))
                {
                    area_time = true;
                    select_format += "SSS";
                }
            }

            var idx;
            var buffer = {
                year: "", month: "", day: "", hour: "", min: "", sec: "", msec: ""
            };

            value = value.replace(/\D/g, "");   // 문자열 제거

            var char, numb;
            for (var k = 0, l = 0; k < select_format.length; k++)
            {
                char = value.charAt(l);
                numb = parseInt(char);

                if (char == "")
                    break;

                switch (select_format.charAt(k))
                {
                    case 'y':
                        buffer.year += char;
                        break;
                    case 'M':
                        if (buffer.month == "")
                        {
                            if ((numb > 1)) // 십단위 2 이상 x
                                k++;

                            buffer.month += char;
                        }
                        else
                        {
                            if ((buffer.month == "1" && numb > 2)) // 13 x
                                continue;
                            else
                                buffer.month += char;
                        }
                        break;
                    case 'd':
                        if (buffer.day == "")
                        {
                            if ((numb > 3)) // 십단위 4이상 x
                                k++;

                            buffer.day += char;
                        }
                        else
                        {
                            if (buffer.day == "3" && numb > 1) // 32 x
                                continue;
                            else
                                buffer.day += char;
                        }
                        break;
                    case 'h':
                    case 'H':
                        if (buffer.hour == "" && numb > 5) // 십단위 6이상 x
                            k++;

                        buffer.hour += char;
                        break;
                    case 'm':
                        if (buffer.min == "" && numb > 5) // 십단위 6이상 x
                            k++;

                        buffer.min += char;
                        break;
                    case 's':
                        if (buffer.sec == "" && numb > 5) // 십단위 6이상 x
                            k++;

                        buffer.sec += char;
                        break;
                    case 'S':
                        buffer.msec += char;
                        break;
                }
                l++;
            }

            this._debug_paste_buff = "try-paste[" + value + "], selected-area[" + select_format + "], year[" + buffer.year + "], month[" + buffer.month + "], day[" + buffer.day + "], hour[" + buffer.hour + "], min[" + buffer.min + "], sec[" + buffer.sec + "], msec[" + buffer.msec + "]";

            // buffer를 생성하여 M/d/yyyy -> yyyy/M/d 순서로 value를 다시 조정하여 validation
            var n_year = -1, n_month = -1;
            if (buffer.year)
            {
                var n = parseInt(buffer.year);
                n_year = n;

                if (n < 1 || n > 9999)
                    return false;
                buffer.year = this._padNumberWithZero(buffer.year, 4);
            }
            if (buffer.month)
            {
                var n = parseInt(buffer.month);
                n_month = n;

                if (n < 1 || n > 12)
                    return false;

                buffer.month = this._padNumberWithZero(buffer.month, 2);
            }
            if (buffer.day)
            {
                var n = parseInt(buffer.day);
                var d_max = [null, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                if (n_month == 2)
                {
                    if (n_year > 0)
                    {
                        d_max = this._getLastDay(buffer.year, buffer.month);

                        if (d_max == 0)
                            d_max = 31;
                    }
                    else
                        d_max = d_max[n_month];
                }
                else
                {
                    d_max = d_max[n_month];
                }

                if (n < 1 || n > d_max)
                    return false;

                buffer.day = this._padNumberWithZero(buffer.day, 2);
            }
            if (buffer.hour)
            {
                var n = parseInt(buffer.hour);
                if (n > 23)
                    return false;

                buffer.hour = this._padNumberWithZero(buffer.hour, 2);
            }
            if (buffer.min)
            {
                var n = parseInt(buffer.min);
                if (n > 59)
                    return false;

                buffer.min = this._padNumberWithZero(buffer.min, 2);
            }
            if (buffer.sec)
            {
                var n = parseInt(buffer.sec);
                if (n > 59)
                    return false;

                buffer.sec = this._padNumberWithZero(buffer.sec, 2);
            }
            if (buffer.msec)
            {
                var n = parseInt(buffer.msec);
                if (n > 999)
                    return false;

                buffer.msec = this._padNumberWithZero(buffer.msec, 3);
            }

            if (area_date)
                select_area += "date";
            if (area_time)
                select_area += "time";

            var date, applytype;
            var s_year = buffer.year ? buffer.year : "yyyy";
            var s_month = buffer.month ? buffer.month : "MM";
            var s_day = buffer.day ? buffer.day : "dd";
            var s_hour = buffer.hour ? buffer.hour : "HH";
            var s_min = buffer.min ? buffer.min : "mm";
            var s_sec = buffer.sec ? buffer.sec : "ss";
            var s_msec = buffer.msec ? buffer.msec : "SSS";
            var fullvalue = "";

            if (select_area.indexOf("date") >= 0)
            {
                var prev_value;
                if (this._p_value == undefined)
                    prev_value = this._makeValueFromBuffer(false, true);
                else
                    prev_value = this._p_value !== "" ? this._p_value : this._invalid_value;

                var adjust_value;

                value = s_year + s_month + s_day;

                //if (this._p_value !== "") // invalid 인경우 value는 empty
                //{
                adjust_value = (prev_value.length == 17) ? prev_value.substring(0, 8) : prev_value;
                var data = "";

                if (select_format.includes("y"))
                {
                    data = value.substring(0, 4);
                    if (!isNaN(parseInt(data)))
                        adjust_value = data + adjust_value.slice(4);
                }

                if (select_format.includes("M"))
                {
                    data = value.substring(4, 6);
                    if (!isNaN(parseInt(data)))
                        adjust_value = adjust_value.slice(0, 4) + data + adjust_value.slice(6);
                }

                if (select_format.includes("d"))
                {
                    data = value.substring(6, 8);
                    if (!isNaN(parseInt(data)))
                        adjust_value = adjust_value.slice(0, 6) + data + adjust_value.slice(8);
                }
                /*}
                else
                {
                    // invalid 상태일 때 value가 불명확하여 개별 체크
                    adjust_value = (prev_value.length == 17) ? prev_value.substring(0, 8) : prev_value;
                    var data = "";

                    if (select_format.includes("y"))
                    {
                        data = value.substring(0, 4);
                        if (!isNaN(parseInt(data)))
                            adjust_value = data + adjust_value.slice(4);
                    }

                    if (select_format.includes("M"))
                    {
                        data = value.substring(4, 6);
                        if (!isNaN(parseInt(data)))
                            adjust_value = adjust_value.slice(0, 4) + data + adjust_value.slice(6);
                    }

                    if (select_format.includes("d"))
                    {
                        data = value.substring(6, 8);
                        if (!isNaN(parseInt(data)))
                            adjust_value = adjust_value.slice(0, 6) + data + adjust_value.slice(8);
                    }
                }
                */

                value = adjust_value;

                if (select_area.indexOf("time") < 0 && this._input_type == "datetime")
                {
                    if (this._p_value)
                    {
                        value = value + this._p_value.substring(8, this._p_value.length);
                    }
                    else
                    {
                        if (this._p_value == null)
                            applytype = select_area;
                        else if (this._p_value == "")
                            value = value + this._invalid_value.substring(8, this._invalid_value.length);
                    }
                }

                fullvalue = value;
            }

            if (select_area.indexOf("time") >= 0)
            {
                value = s_hour + s_min + s_sec + s_msec;

                var prev_value;
                if (this._p_value == undefined)
                    prev_value = this._makeValueFromBuffer(false, true);
                else
                    prev_value = this._p_value !== "" ? this._p_value : this._invalid_value;

                var adjust_value;
                var is_hour = select_format.includes("H") || select_format.includes("h");

                //if (this._p_value !== "") // invalid 인경우 value는 empty
                //{
                adjust_value = (prev_value.length == 17) ? prev_value.substring(8, 17) : prev_value;

                var data = "";

                if (is_hour)
                {
                    data = value.substring(0, 2);
                    if (!isNaN(parseInt(data)))
                        adjust_value = data + adjust_value.slice(2);
                }

                if (select_format.includes("m"))
                {
                    data = value.substring(2, 4);
                    if (!isNaN(parseInt(data)))
                        adjust_value = adjust_value.slice(0, 2) + data + adjust_value.slice(4);
                }

                if (select_format.includes("s"))
                {
                    data = value.substring(4, 6);
                    if (!isNaN(parseInt(data)))
                        adjust_value = adjust_value.slice(0, 4) + data + adjust_value.slice(6);
                }

                if (select_format.includes("S"))
                {
                    data = value.substring(6, 9);
                    if (!isNaN(parseInt(data)))
                        adjust_value = adjust_value.slice(0, 6) + data + adjust_value.slice(9);
                }
                /*}
                else
                {
                    // invalid 상태일 때 value가 불명확하여 개별 체크
                    adjust_value = (prev_value.length == 17) ? prev_value.substring(8, 17) : prev_value;
                    var data = "";

                    if (is_hour)
                    {
                        data = value.substring(0, 2);
                        if (!isNaN(parseInt(data)))
                            adjust_value = data + adjust_value.slice(2);
                    }

                    if (select_format.includes("m"))
                    {
                        data = value.substring(2, 4);
                        if (!isNaN(parseInt(data)))
                            adjust_value = adjust_value.slice(0, 2) + data + adjust_value.slice(4);
                    }

                    if (select_format.includes("s"))
                    {
                        data = value.substring(4, 6);
                        if (!isNaN(parseInt(data)))
                            adjust_value = adjust_value.slice(0, 4) + data + adjust_value.slice(6);
                    }

                    if (select_format.includes("S"))
                    {
                        data = value.substring(6, 9);
                        if (!isNaN(parseInt(data)))
                            adjust_value = adjust_value.slice(0, 6) + data + adjust_value.slice(9);
                    }
                }
                */

                value = adjust_value;

                if (select_area.indexOf("date") < 0 && this._input_type == "datetime")
                {
                    if (this._p_value)
                    {
                        value = this._p_value.substring(0, 8) + value;
                    }
                    else
                    {
                        if (this._p_value == null)
                            applytype = select_area;
                        else if (this._p_value == "")
                            value = this._invalid_value.substring(0, 8) + value;
                    }
                }

                fullvalue += value;
            }

            var proc = this._input_element._processing_oninput;
            this._input_element._processing_oninput = true;
            var newtext = this._makeBufferTextFromValue(fullvalue, false, applytype);
            this._input_element._processing_oninput = proc;
            var pos = this._input_element.getElementCaretPos();

            this._input_element.setElementValue(newtext, pos.begin, pos.end, true);

            nexacro._OnceCallbackTimer.callonce(this, function ()
            {
                this.setSelect(pos.end, pos.end);
            });
        }

        return true;
    };

    _pDateField._startSelectionTimer = function (applytime, beg, end)
    {
        var pthis = this;

        this._stopSelectionTimer();
        this._selectiontask = new nexacro._CallbackTimer(this, function (id) { return pthis._callbackSelectionTimer(beg, end); }, applytime);
        this._selectiontask.start();
    };

    _pDateField._stopSelectionTimer = function ()
    {
        if (this._selectiontask)
        {
            this._selectiontask.destroy();
            this._selectiontask = null;
        }
    };

    _pDateField._callbackSelectionTimer = function (beg, end)
    {
        var pos = this._input_element.getElementCaretPos();

        if (pos.begin == pos.end)
        {
            var range = this._findRangeFromPos(pos.begin);
            if (range)
            {
                if (this._append_typing_range != range)
                {
                    this._completeRangeDate();
                    this._clearTypingRange();
                }

                this.setSelect(range.beg, range.end, true);
            }
        }
        this._stopSelectionTimer();
    };

    _pDateField._getConfirmValue = function (/*obj, e*/)
    {
        var value = this._p_value;
        if (this._p_value == null) 
        {
            if (this._input_type == "time")
                value = this._time_init_value;
            else if (this._input_type == "datetime")
            {
                value = this._getCurrentDateVal();
            }
        }
        return value;
    };

    /*
    _pDateField._prev_canvasx = null;
    _pDateField.on_mousemove_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        nexacro.TextField.prototype.on_mousemove_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
        
        nexacro._OnceCallbackTimer.callonce(this, function ()
        {
            var pos = this._input_element.getElementCaretPos();
            var range;

            if (pos < 0 || this._dragX < 0)
                return;

            if (this._dragX > canvasX)  // left
            {
                this.setSelect(pos.begin, this._select_ranges[this._select_ranges.length - 1].end);
            }
            else if (this._dragX < canvasX) // right
            {
                this.setSelect(this._select_ranges[0].beg, pos.end);
            }
            this._prev_canvasx = canvasX;
        });
    };
    */

    _pDateField.on_drag = function (canvasX)
    {
        this._stopSelectionTimer();
    }

    _pDateField._dragX = -1;
    _pDateField.on_lbuttondown_default_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        nexacro.TextField.prototype.on_lbuttondown_default_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);

        if (this._p_readonly || !this._isEnable())
            return;

        if (this._onlydisplay)
            return;

        if (this._isPopupVisible())
            this._closePopup(false, true);

        this._dragX = canvasX;
        this._input_element._is_focused = true;

        var pos = this._input_element.getElementCaretPos(); // down시 커서 반영 안된 시점
        var beg = pos.begin;
        var end = pos.end;

        if (end > beg)
            nexacro.TextField.prototype.setCaretPos.call(this, parseInt(beg + (end - beg) / 2));

        this._input_element.stopSysEvent();
        this._startSelectionTimer(400, beg, end);   // drag selection시 자연스러움을 위해 충돌 나지 않도록 down selection은 약간의 텀을 줌
    };

    _pDateField.on_lbuttonup_default_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        nexacro.TextField.prototype.on_lbuttonup_default_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);

        if (this._p_readonly || !this._isEnable())
            return;

        if (this._onlydisplay)
            return;

        this._dragX = -1;
        this._stopSelectionTimer();

        nexacro._OnceCallbackTimer.callonce(this, function ()
        {
            var pos = this._input_element.getElementCaretPos();
            var beg = pos.begin, end = pos.end;

            this.setSelect(beg, end);

            if (!this._select_ranges.length)
            {
                var prev = this._findPrevRange(beg);
                if (prev)
                {
                    this.setSelect(prev.beg, prev.end, true);
                }
                else
                {
                    var next = this._findNextRange(end);
                    if (next)
                        this.setSelect(next.beg, next.end, true);
                    else
                        this._input_element.setElementBlur();   // 갈 곳이 없으면 blur
                }
            }
        });
    };

    _pDateField._on_drop_onlbuttondown = function (obj, e)
    {
        if (e.button != "lbutton") return;
        if (this._p_readonly || !this._p_enable)
        {
            return false;
        }

        if (this._isPopupVisible())
        {
            this._closePopup(false, true);

            if (!this._p_autoselect)
            {
                this._setInitCaret();
            }
        }
        else
        {
            this._showPopup();
            this._setDatePickerValue(this._getConfirmValue());
            if (!this._p_autoselect)
            {
                this._setInitCaret();
            }
        }

        return false;
    };

    _pDateField._on_drop_mobile_onclick = function (/*obj, e*/)
    {
        if (this._p_readonly || !this._p_enable)
        {
            return false;
        }

        if (this._isPopupVisible())
        {
            this._closePopup(false, true);
        }
        else
        {
            this._showPopup();
            this._setDatePickerValue(this._getConfirmValue());
        }

        return false;
    };

    _pDateField._on_drop_onclick = function (obj, e)
    {
        if (e.button != "touch") return;
        if (this._p_readonly || !this._p_enable)
        {
            return false;
        }

        if (this._isPopupVisible())
        {
            this._closePopup(false, true);

            if (!this._p_autoselect)
            {
                this._setInitCaret();
            }
        }
        else
        {
            this._showPopup();
            this._setDatePickerValue(this._getConfirmValue());
            if (!this._p_autoselect)
            {
                this._setInitCaret();
            }
        }

        return false;
    };

    _pDateField._getMaskObj = function ()
    {
        return this._masktypeobj;
    };

    _pDateField._getEmptyText = function ()
    {
        var empty = this._format;
        var ranges_order = this._ranges_order;

        for (var i = 0; i < ranges_order.length; i++)
        {
            empty = empty.replace(ranges_order[i].format, (this._mask_char ? (ranges_order[i].format.replace(/./g, this._mask_char)) : ranges_order[i].empty));
        }

        return empty;
    };

    _pDateField.on_focus_basic_action = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        nexacro.TextField.prototype.on_focus_basic_action.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
        this._change_caret_from_method = false;
    };

    _pDateField.on_killfocus_basic_action = function (new_focus, new_refer_focus)
    {
        this._completeRangeDate();
        this._clearTypingRange();

        nexacro.TextField.prototype.on_killfocus_basic_action.call(this, new_focus, new_refer_focus);

        if (this._p_value == null)
        {
            this._input_element.setElementValue("");
        }
        else
        {
            var text = this.getDisplayText();
            this._input_element.setElementValue(text);
        }

        if (this._isPopupVisible())
        {
            this._closePopup(false, true);
        }
    };

    _pDateField.on_fire_sys_onmousewheel = function (wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        nexacro.Component.prototype.on_fire_user_onmousewheel.call(this, wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

        return (this._popupcontrol && this._popupcontrol._is_popup()) ? true : false;
    };

    _pDateField.on_fire_sys_onslide = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        var ret = nexacro.Component.prototype.on_fire_sys_onslide.call(this, elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp);

        //this._updatePopupControlPosition();

        return ret;
    };

    _pDateField.on_fire_sys_onfling = function (elem, fling_handler, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp)
    {
        var ret = nexacro.Component.prototype.on_fire_sys_onfling.call(this, elem, fling_handler, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp);

        //this._updatePopupControlPosition();

        return ret;
    };

    _pDateField.on_fire_oncloseup = function (obj, pretext, prevalue, posttext, postvalue)
    {
        if (this.oncloseup && this.oncloseup._has_handlers)
        {
            var evt = new nexacro.DateFieldCloseUpEventInfo(this, "oncloseup", pretext, posttext, prevalue, postvalue);
            return this.oncloseup._fireEvent(this, evt);
        }

        return false;
    };

    _pDateField.on_fire_ondropdown = function (obj)
    {
        if (this.ondropdown && this.ondropdown._has_handlers)
        {
            var evt = new nexacro.Event(this, "ondropdown");
            evt.cancelable = true;
            evt.fromreferenceobject = this;
            return this.ondropdown._fireCheckEvent(this, evt);
        }

        return true;
    };

    //===============================================================
    // nexacro.DateFieldBox (flexible)
    //===============================================================
    nexacro.DateFieldBox = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.TextFieldBox.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pDateFieldBox = nexacro._createPrototype(nexacro.TextFieldBox, nexacro.DateFieldBox);
    nexacro.DateFieldBox.prototype = _pDateFieldBox;

    _pDateFieldBox._type_name = "DateFieldBox";
    _pDateFieldBox._use_beforeinput = true;

    _pDateFieldBox._trailing_button_id = "dropbutton";

    _pDateFieldBox.on_lbuttondown_default_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        return this._p_parent.on_lbuttondown_default_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
    };

    _pDateFieldBox.on_lbuttonup_default_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        return this._p_parent.on_lbuttonup_default_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
    };

    _pDateFieldBox.on_beforekeyinput_basic_action = function (value, status, begin, end, inputType) // IME를 막기위해 필요
    {
        return this._p_parent.on_beforekeyinput_basic_action(value, status, begin, end, inputType);
    };

    _pDateFieldBox._on_dblclick = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key)
    {
        return this._p_parent._on_dblclick(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key);
    };

    _pDateFieldBox._on_drag = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key)
    {
        this._p_parent.on_drag(canvasX);
        return nexacro.TextFieldBox.prototype._on_drag.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key);
    };

    _pDateFieldBox.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return this._p_parent.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
    };
    //===============================================================
    // nexacro.DateField : Override
    //===============================================================

    //===============================================================
    // nexacro.DateFieldPopupControl : Popup
    //===============================================================
    nexacro._DateFieldPopupControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.PopupControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pDateFieldPopupControl = nexacro._createPrototype(nexacro.PopupControl, nexacro._DateFieldPopupControl);
    nexacro._DateFieldPopupControl.prototype = _pDateFieldPopupControl;
    _pDateFieldPopupControl._type_name = "popupDateTimePicker";

    /* internal variable */

    //===============================================================
    // nexacro._DateFieldPopupControl : Util Function
    //===============================================================
    _pDateFieldPopupControl._getPopupParentPos = function ()
    {
        var DateField = this._p_parent;
        var DateField_size = [DateField._adjust_width, DateField._adjust_height];
        var DateField_elem_pos = nexacro._getElementPositionInFrame(DateField.getElement());

        var xgap = 0, ygab = 0;
        /* rootframe의 top 값이 음수이면 보정 */
        if (nexacro._Browser == "MobileSafari")
        {
            var rootframe = this._getRootFrame();
            if (rootframe)
            {
                var rootframe_pos = nexacro._getElementPositionInFrame(rootframe.getElement());
                ygab = rootframe_pos.y < 0 ? rootframe_pos.y * (-1) : 0;
            }
        }

        return { "x": DateField_elem_pos.x, "y": DateField_elem_pos.y, "width": DateField_size[0], "height": DateField_size[1], "xgap": xgap, "ygap": ygab };
    };

    //==============================================================================
    // nexacro.DateFieldDayClickEventInfo
    //============================================================================== 
    nexacro.DateFieldDayClickEventInfo = function (obj, id, date)
    {
        this.id = this.eventid = id || "ondayclick";
        this.fromobject = this.fromreferenceobject = obj;

        this.date = date;
    };
    var _pDateFieldDayClickEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.DateFieldDayClickEventInfo);
    nexacro.DateFieldDayClickEventInfo.prototype = _pDateFieldDayClickEventInfo;
    _pDateFieldDayClickEventInfo._type_name = "DateFieldDayClickEventInfo";


    //==============================================================================
    // nexacro.DateFieldCloseUpEventInfo
    //============================================================================== 
    nexacro.DateFieldCloseUpEventInfo = function (obj, id, pretext, posttext, prevalue, postvalue/*, isselect*/)
    {
        this.id = this.eventid = id || "oncloseup";
        this.fromobject = this.fromreferenceobject = obj;

        this.pretext = pretext;
        this.posttext = posttext;
        this.prevalue = prevalue;
        this.postvalue = postvalue;
    };
    var _pDateFieldCloseUpEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.DateFieldCloseUpEventInfo);
    nexacro.DateFieldCloseUpEventInfo.prototype = _pDateFieldCloseUpEventInfo;
    _pDateFieldCloseUpEventInfo._type_name = "DateFieldCloseUpEventInfo";


    nexacro._defineProperties(_pDateField, _pDateField._properties);

    _pDateFieldCloseUpEventInfo = null;
    _pDateFieldDayClickEventInfo = null;
    _pDateFieldPopupControl = null;
    _pDateFieldBox = null;
    _pDateField = null;
};