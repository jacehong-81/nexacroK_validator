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

if (!nexacro.TextField)
{
    //==============================================================================
    // nexacro.TextField (flexible)
    //==============================================================================
    nexacro.TextField = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay)
    {
        nexacro.FieldBase.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._onlydisplay = !!onlydisplay;

        if (onlydisplay)
        {
            this._p_readonly = true;
        }

        this._focus_keep = null;
    };

    var _pTextField = nexacro._createPrototype(nexacro.FieldBase, nexacro.TextField);
    nexacro.TextField.prototype = _pTextField;
    _pTextField._type_name = "TextField";

    var _pEditPtype = nexacro.Edit.prototype;

    _pTextField._boxcontrol_socket = {
        instance_name: "TextFieldBox",
        id: "box"
    };

    /* default properties */
    _pTextField._p_value = undefined;
    _pTextField._p_readonly = false;
    _pTextField._p_autoselect = false;
    _pTextField._p_autoskip = false;
    _pTextField._p_maxlength = 0;

    _pTextField._initsoftkeyboard = undefined;
    _pTextField._p_usesoftkeyboard = true;

    _pTextField._p_inputtype = "normal";
    _pTextField._p_text = "";
    _pTextField._p_usecontextmenu = true;
    _pTextField._p_pattern = "";
    _pTextField._p_prefixtext = "";
    _pTextField._p_postfixtext = "";
    _pTextField._p_useleadingbutton = false;
    _pTextField._p_usetrailingbutton = false;
    _pTextField._p_iconbuttonsize = undefined;
    _pTextField._p_leadingbuttonsize = undefined;
    _pTextField._p_trailingbuttonsize = undefined;

    _pTextField._properties = [
        { name: "value" },
        { name: "readonly" },
        { name: "autoselect" },
        { name: "autoskip" },
        { name: "maxlength" },
        { name: "usesoftkeyboard" },
        { name: "inputtype" },
        { name: "text", readonly: true },
        { name: "usecontextmenu" },
        { name: "pattern" },
        { name: "prefixtext" },
        { name: "postfixtext" },
        { name: "useleadingbutton" },
        { name: "usetrailingbutton" },
        { name: "iconbuttonsize" },
        { name: "leadingbuttonsize" },
        { name: "trailingbuttonsize" },
        { name: "cursor" },
    ];


    /* internal variable */
    _pTextField._undostack = null;
    _pTextField._is_undo = false;
    _pTextField._keypad_type = "text";
    _pTextField._imedisable = false;
    _pTextField._maxlen = 0;

    _pTextField._default_value = undefined;
    _pTextField._default_text = "";

    _pTextField._processing_updateToDataset = false;
    _pTextField._result_updateToDataset = true;
    _pTextField._processing_canchange = false;

    _pTextField._onlydisplay = false;
    _pTextField._apply_client_padding = false;
    _pTextField._has_inputElement = true;
    _pTextField._change_value = false;

    /* status */
    _pTextField._is_editable_control = true;
    _pTextField._use_readonly_status = true;

    _pTextField._check_valid_pattern = null;
    _pTextField._input_limit_pattern = null;
    _pTextField._is_locale_control = true;

    _pTextField._caret_pos = -1;

    _pTextField._input_element = null;

    /*
   if (nexacro._Browser == "IE" || nexacro._Browser == "Runtime")
       _pTextField._set_node_value = false;
   else
       _pTextField._set_node_value = true;
   */

    /* event list */
    _pTextField._event_list = {
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
        "onleadingbuttonclick": 1, "ontrailingbuttonclick": 1,
        "oninvalid": 1,
    };

    /* accessibility */
    _pTextField.accessibilityrole = "edit";

    //===============================================================
    // nexacro.TextField : Create & Destroy & Update
    //===============================================================
    _pTextField.on_create_contents = function ()
    {
        nexacro.FieldBase.prototype.on_create_contents.call(this);

        var input_elem = this._input_element = this._getInputElement();

        if (!this._onlydisplay)
        {
            input_elem.setElementAutoSelect(this._p_autoselect);
            input_elem.setElementReadonly(this._p_readonly);
            input_elem.setElementMaxLength(this._maxlen);
            input_elem.setElementInputType(this._p_inputtype);
            input_elem.setElementInputMode(this._keypad_type);
            input_elem.setElementAutoSkip(this._p_autoskip);
        }

        input_elem.setElementTextDecoration(this._textdecoration);
        input_elem.setElementTextAlign(this._p_textAlign);

        if (this._padding)
            input_elem.setElementPadding(this._padding);

        this._undostack = new nexacro._EditUndoStack(this);

        this.on_apply_iconbuttonsize();
        this.on_apply_leadingbuttonsize();
        this.on_apply_trailingbuttonsize();
    };

    _pTextField.on_created_contents = function (win)
    {
        this.on_apply_value(this._p_value);

        nexacro.FieldBase.prototype.on_created_contents.call(this, win);
    };

    _pTextField.on_destroy_contents = function ()
    {
        nexacro.FieldBase.prototype.on_destroy_contents.call(this);

        var undostack = this._undostack;
        if (undostack)
        {
            undostack.destroy();
            this._undostack = null;
        }
        this._focus_keep = null;

        var inputfilterobj = this._inputfilter_obj;
        if (inputfilterobj)
            this._inputfilter_obj = null;

        this._inputtype_obj = null;
        this._input_element = null;
    };

    _pTextField.on_create_contents_command = function ()
    {
        this.on_apply_value(this._p_value);
        this.on_apply_prop_enable(this._real_enable);

        return nexacro.FieldBase.prototype.on_create_contents_command.call(this);
    };

    _pTextField.on_after_created_ext = function ()
    {
        this.on_apply_inputtype();

        this._setEventHandlerToLeadingButton();
        this._setEventHandlerToTrailingButton();
        this._setEventHandlerToBox();
        this.LabelFor(this._getInputElement());

        if (this._p_labelposition == "inside")
        {
            this._box._recalc_box();
        }

        this.on_apply_readonly();
    };

    _pTextField._setEventHandlerToLeadingButton = function ()
    {
        var leadbutton = this._box._leadbutton;

        if (leadbutton)
            leadbutton._setEventHandler("onclick", this.on_fire_leading_onclick, this);
    };

    _pTextField._setEventHandlerToTrailingButton = function ()
    {
        var trailbutton = this._box._trailbutton;

        if (trailbutton)
            trailbutton._setEventHandler("onclick", this.on_fire_trailing_onclick, this);
    };

    _pTextField._setEventHandlerToBox = function ()
    {
        var box = this._box;

        if (box)
            box._setEventHandler("oninput", this.on_fire_oninput, this);
    };

    _pTextField._getInputElement = function ()
    {
        return this._box ? this._box._input_element : null;
    };

    // compbase logical focus func
    _pTextField._apply_setfocus = function (evt_name, self_flag)    
    {
        this._processing_updateToDataset = false;

        var input_elem = this._getInputElement();
        if (input_elem)
        {
            if (!this._onlydisplay)
            {
                input_elem.on_apply_imeSet();
                input_elem.on_apply_force_imeSet();

                if (evt_name)
                {
                    this._default_value = this._p_value;
                    this._default_text = this._p_text;
                }

                var pos = input_elem._last_selection_range;
                if (pos && !this._p_autoselect)
                {
                    this._caret_pos = { begin: pos[0], end: pos[1] };
                }

                // input에 직접 label을 설정하므로 필요없음
                //if (this._env._p_enableaccessibility && evt_name != "tabkey" && evt_name != "shifttabkey" && !this._isComponentKeydownAction())
                //    nexacro._notifyAccessibilityInputElement(this._getAccessibilityReadLabel());

                input_elem.setElementFocus(evt_name, self_flag);

                var text = input_elem.getElementText();
                if (text != this._p_text)
                {
                    this._default_text = this._p_text = text;
                }
            }
            else
            {
                if (evt_name)
                {
                    this._default_value = this._p_value;
                    this._default_text = this._p_text;
                }
            }
        }
    };

    _pTextField._changeValidStatusChild = function (status, show)
    {
        var box = this._box;
        if (box._leadbutton)
            box._leadbutton._changeUserStatus(status, show);
        if (box._trailbutton)
            box._trailbutton._changeUserStatus(status, show);
    };

    _pTextField.on_apply_prop_enable = function (v)
    {
        v = (v != null) ? v : this._isEnable();
        var input_elem = this._input_element;

        if (input_elem)
        {
            var color = this._getCSSStyleValue("color");

            if (!this._onlydisplay)
                input_elem.setElementEnable(v, color);
        }

        var box = this._box;
        if (box)
            box._setEnable(v);
    };

    _pTextField.on_apply_prop_stringresource = function ()
    {
        if (!nexacro._StringResource)
            return;

        nexacro.FieldBase.prototype.on_apply_prop_stringresource.call(this);

        this.on_apply_postfixtext(this._getStringResourceProperty(this._p_postfixtext));
        this.on_apply_prefixtext();
    };

    _pTextField.on_getBindableProperties = function ()
    {
        return "value";
    };

    _pTextField.on_init_bindSource = function (columnid, propid, ds)
    {
        if (propid == "value")
        {
            if (this._undostack)
            {
                this._undostack.clear();
            }

            this._setValue(undefined);
        }
    };

    _pTextField.applyto_bindSource = function (propid, Val)
    {
        if (!this._bind_event)
            return true;

        var evt =
        {
            propid: propid,
            val: Val
        };

        this._dsEventOccured = true;
        var ret = this._bind_event._fireEvent(this, evt);
        this._dsEventOccured = false;

        return ret;
    };

    _pTextField.on_change_bindSource = function (propid, ds, row, col)
    {
        if (propid == "value")
        {
            var input_elem = this._getInputElement();

            var v = ds.getColumn(row, col);
            v = this._convertValueType(v, true);

            if (this._undostack)
            {
                this._undostack.clear();
            }

            var _bSetselect = false;
            if (this._p_value != v)
            {
                _bSetselect = true;
            }

            if (!this._dsEventOccured)
            {
                this._invalidStatus(false);
                this._validStatus(false);
            }

            this._setValue(v);

            if (input_elem && _bSetselect && !this._onlydisplay)
            {
                input_elem.setElementSetSelect(this._p_value ? this._p_value.length : 0);

                this._caret_pos = input_elem.getElementCaretPos();
            }
        }
    };

    _pTextField.on_changeUserStatus = function (changestatus, value, applyuserstatus/*, currentstatus, currentuserstatus*/)
    {
        if (value)
        {
            return changestatus;
        }
        else
        {
            return applyuserstatus;
        }
    };

    _pTextField._getDlgCode = function (/*keycode, altKey, ctrlKey, shiftKey*/)
    {
        return { want_tab: false, want_return: false, want_escape: false, want_chars: false, want_arrows: false };
    };

    _pTextField._getDragData = function ()
    {
        return this.getSelectedText();
    };

    _pTextField._on_getFitSize = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var total_w = 0;
            var total_h = 0;

            var border = this._getCurrentStyleBorder();
            if (border)
            {
                total_w += border._getBorderWidth();
                total_h += border._getBorderHeight();
            }

            var text;
            if (this._displaytext && this._displaytext !== "")
            {
                // apply_text로 처리된 대상 기준으로 fittocontects가 이루어져야 함
                text = this._displaytext;
            }
            else
                text = this._p_text;
            if (text)
            {
                var font = this._getCurrentStyleInheritValue("font");
                var refer_font = this._getReferenceAbsoluteFont(font);
                var wordspace = this._getCurrentStyleInheritValue("wordSpacing");
                var letterspace = this._getCurrentStyleInheritValue("letterSpacing");

                var text_size = nexacro._getTextSize(this._p_text, font, false, undefined, "none", wordspace, letterspace, undefined, undefined, undefined, refer_font);

                total_w += Math.ceil(text_size[0]);
                total_h += Math.ceil(text_size[1]);
            }

            var size;

            if (this._box)
            {
                if (this._box._leadbutton)
                {
                    size = this._box._leadbutton._on_getFitSize();
                    total_w += size[0];
                    total_h = Math.max(size[1], total_h);
                }

                if (this._box._prefixctrl)
                {
                    size = this._box._prefixctrl._on_getFitSize();
                    total_w += size[0];
                    total_h = Math.max(size[1], total_h);
                }

                if (this._box._postfixctrl)
                {
                    size = this._box._postfixctrl._on_getFitSize();
                    total_w += size[0];
                    total_h = Math.max(size[1], total_h);
                }

                if (this._box._trailbutton)
                {
                    size = this._box._trailbutton._on_getFitSize();
                    total_w += size[0];
                    total_h = Math.max(size[1], total_h);
                }
            }

            var hline_w = 0, hline_h = 0;
            if (this._helptxt_control)
            {
                size = this._helptxt_control._on_getFitSize();
                hline_w += size[0];
                hline_h = Math.max(size[1], hline_h);
            }

            if (this._charcnt_control)
            {
                size = this._charcnt_control._on_getFitSize();
                hline_w += size[0];
                hline_h = Math.max(size[1], hline_h);
            }

            total_w = Math.max(hline_w, total_w);
            total_h += hline_h;

            return [total_w, total_h];
        }

        return [this._adjust_width, this._adjust_height];
    };

    //===============================================================
    // nexacro.TextField : Properties
    //===============================================================
    _pTextField.set_iconbuttonsize = function (v)
    {
        if (this._p_iconbuttonsize != v)
        {
            this._p_iconbuttonsize = v;
            this.on_apply_iconbuttonsize();
        }
    };

    _pTextField.on_apply_iconbuttonsize = function ()
    {
        if (this._box)
        {
            this._box.set_iconbuttonsize(this._p_iconbuttonsize);
            this._recalcLabel();
        }
    };

    _pTextField.set_leadingbuttonsize = function (v)
    {
        if (this._p_leadingbuttonsize != v)
        {
            this._p_leadingbuttonsize = v;
            this.on_apply_leadingbuttonsize();
        }
    };

    _pTextField.on_apply_leadingbuttonsize = function ()
    {
        if (this._box)
        {
            this._box.set_leadingbuttonsize(this._p_leadingbuttonsize);
            this._recalcLabel();
        }
    };

    _pTextField.set_trailingbuttonsize = function (v)
    {
        if (this._p_trailingbuttonsize != v)
        {
            this._p_trailingbuttonsize = v;
            this.on_apply_trailingbuttonsize();
        }
    };

    _pTextField.on_apply_trailingbuttonsize = function ()
    {
        if (this._box)
        {
            this._box.set_trailingbuttonsize(this._p_trailingbuttonsize);
            this._recalcLabel();
        }
    };

    _pTextField._checkApplyValidate = function (value, input_check)
    {
        if (!value)
        {
            if (input_check && this._p_inputtype == "number")
            {
                if (this._input_element)
                {
                    var validity = this._input_element._getValidity();
                    if (validity)   // html only
                        return validity.valid;
                    else
                        return false // Always return false if the value is falsy && input type number

                }
            }
            return -1;
        }

        var pattern = this._check_valid_pattern;

        if (this._p_pattern)
            pattern = new RegExp(this._p_pattern);

        if (!pattern)
            return -1;

        if (pattern.test(value))
        {
            if (this._p_inputtype == "number")
                return (isNaN(Number(value)) == false && isFinite(Number(value)) == true);

            return true;
        }
        return false;
    };

    _pTextField._checkInputValidate = function (value)
    {
        return this._checkApplyValidate(value, true);
    };

    _pTextField.set_inputtype = function (v)
    {
        if (v)
            v = v.toLowerCase();

        if (this._p_inputtype != v)
        {
            this._inputtype_obj = null;

            switch (v)
            {
                case "email":
                case "url":
                case "text":
                case "password":
                case "number":
                case "tel":
                    this._p_inputtype = v;
                    break;
                default:
                    return;
            }

            this.on_apply_inputtype();
        }
    };

    _pTextField.on_apply_inputtype = function ()
    {
        var inputtype = this._p_inputtype;

        switch (inputtype)
        {
            case "email":
                this._check_valid_pattern = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)/;
                this._input_limit_pattern = null;
                break;
            case "url":
                this._check_valid_pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                this._input_limit_pattern = null;
                break;
            case "text":
            case "password":
                this._check_valid_pattern = null;
                this._input_limit_pattern = null;
                break;
            case "number":
                this._check_valid_pattern = /^[+-]?(\d+(\.\d*)?|\.\d+)$|[eE]/;
                this._input_limit_pattern = /[^\d\-+.eE]/g;
                break;
            case "tel":
                this._check_valid_pattern = /^[0-9()\/N,;*#.\-+ ]*$/;
                this._input_limit_pattern = /[^0-9()\/N,;*#.\-+ ]/g;
                break;
            default:
                return;
        }

        this.on_apply_maxlength();

        var check = this._checkApplyValidate(this._p_value);

        if (check == false)
        {
            this._validStatus(false);
            this.on_invalid(true);
        }
        else if (check == true)
        {
            this._invalidStatus(false);
            this.on_valid(true);
        }
        else
        {
            this._invalidStatus(false);
            this._validStatus(false);
        }

        this._inputtype_obj = new nexacro._EditInputType();
        this._keypad_type = inputtype;

        var input_elem = this._getInputElement();
        if (input_elem && !this._onlydisplay)
        {
            input_elem.setElementInputType(inputtype);
            input_elem.setElementInputMode(this._keypad_type);
        }
    };

    _pTextField.set_pattern = function (v)
    {
        if (this._p_pattern != v)
        {
            this._p_pattern = v;
        }
    };

    if (nexacro._Browser == "Runtime")
    {
        _pTextField._needChangeInputValue = function (v)
        {
            if (v != null)
            {
                if (this._input_limit_pattern)
                    v = v.replace(this._input_limit_pattern, '');

                if (this._p_inputtype == "number")
                {
                    // 지수 표기 html과 동일하게 한글자만 입력가능
                    var newv = "";
                    var chke = false;
                    var char;

                    for (var i = 0; i < v.length; i++)
                    {
                        char = v.charAt(i);

                        if (chke && (char == 'e' || char == 'E'))
                            continue;
                        else if (!chke && (char == 'e' || char == 'E'))
                            chke = true;

                        newv += char;
                    }

                    v = newv;
                }
            }

            return v;
        };
    }
    else
    {
        _pTextField._needChangeInputValue = function (v)
        {
            if (v != null)
            {
                if (this._input_limit_pattern)
                    v = v.replace(this._input_limit_pattern, '');
            }
            return v;
        };
    }

    _pTextField.set_value = function (v, internal)
    {
        v = this._convertValueType(v);
        v = this._needChangeInputValue(v);

        var check = this._checkApplyValidate(v);

        if (check == false)
        {
            this.on_invalid(true);
            if (this._p_inputtype == "number")
                v = "";
        }
        else if (check == true)
        {
            this.on_valid(true);
        }
        else
        {
            this._invalidStatus(false);
            this._validStatus(false);
        }

        if (this._p_value !== v)
        {
            if (!this.applyto_bindSource("value", v))
            {
                return;
            }

            this._setValue(v, true);
        }
        else
        {
            var input_elem = this._getInputElement();
            if (input_elem && input_elem.value != v)
                this._setValue(v, true);
        }
    };

    _pTextField._setValue = function (v, no_chk_valid)
    {
        if (!no_chk_valid)
        {
            var check = this._checkApplyValidate(v);

            if (check == false)
            {
                this.on_invalid(true);
                if (this._p_inputtype == "number")
                    v = "";
            }
            else if (check == true)
            {
                this._invalidStatus(false);
                this.on_valid(true);
            }
            else
            {
                this._invalidStatus(false);
                this._validStatus(false);
            }
        }
        this._p_text = nexacro._toString(v);
        this._p_value = v;

        this.on_apply_value(v);
    };

    _pTextField.on_apply_value = function (value)
    {
        var input_elem = this._getInputElement();
        if (input_elem)
        {
            var pos = input_elem.getElementCaretPos();
            var text = this._p_text;
            value = (this._p_value ? this._p_text : this._p_value);

            var _form = this._getForm();
            var _cur_focus = _form ? _form.getFocus() : null;

            if (!this._onlydisplay)
            {
                if (this._undostack)
                {
                    if (pos && pos != -1)
                    {
                        this._undostack.push(value, pos.begin, pos.end);
                    }
                    else
                    {
                        this._undostack.push(value, 0, 0);
                    }
                }

                if (value == "")
                    input_elem.value = null;

                input_elem.setElementValue(value);

                if (value != null)
                    text = input_elem.getElementText();
            }
            else
            {
                input_elem.setElementText(value);
            }

            if (this._p_text != text)
            {
                this._p_text = text;
            }

            this._updateAccessibilityLabel();
            this._default_value = this._p_value;
            this._default_text = this._p_text;

            pos = input_elem.getElementCaretPos();
            if (pos && pos != -1) 
            {
                this._caret_pos = pos;
            }
            else
            {
                this._change_value = this._is_created ? true : false;
            }

            if (!this._isFocused())
                this._setLabelFloating(this._isContainsText(), undefined, true);

            this._refreshLabel("value");
            this._setCharCount(this._p_text.length, this._maxlen);
        }
    };

    _pTextField.set_useleadingbutton = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_useleadingbutton != v)
        {
            this._p_useleadingbutton = v;
            this.on_apply_useleadingbutton();
        }
    };

    _pTextField.on_apply_useleadingbutton = function ()
    {
        if (this._box)
        {
            this._box._updateLeadingButton();
            this._setEventHandlerToLeadingButton();
            this._box._recalc_box();
            this._recalcLabel();
        }
    };

    _pTextField.set_usetrailingbutton = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_usetrailingbutton != v)
        {
            this._p_usetrailingbutton = v;
            this.on_apply_usetrailingbutton();
        }
    };

    _pTextField.on_apply_usetrailingbutton = function ()
    {
        if (this._box)
        {
            this._box._updateTrailingButton();
            this._setEventHandlerToTrailingButton();
            this._box._recalc_box();
            this._recalcLabel();
        }
    };

    _pTextField.set_prefixtext = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_prefixtext != v)
        {
            this._p_prefixtext = v;
            this.on_apply_prefixtext();
        }
    };

    _pTextField.on_apply_prefixtext = function ()
    {
        if (this._box)
        {
            this._box._updatePrefixControl();
            this._setLabelFloating(this._isContainsText(), undefined, true);
            this._box._recalc_box();
            this._recalcLabel();
        }
    };

    _pTextField.set_postfixtext = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_postfixtext != v)
        {
            this._p_postfixtext = v;
            this.on_apply_postfixtext();
        }
    };

    _pTextField.on_apply_postfixtext = function ()
    {
        if (this._box)
        {
            this._box._updatepostfixControl();
            this._setLabelFloating(this._isContainsText(), undefined, true);
            this._box._recalc_box();
            this._recalcLabel();
        }
    };

    _pTextField.set_readonly = function (v)
    {
        if (this._onlydisplay)
            return;

        v = nexacro._toBoolean(v);
        if (this._p_readonly != v)
        {
            this._p_readonly = v;
            this.on_apply_readonly();
        }
    };

    _pTextField.on_apply_readonly = function ()
    {
        var readonly = this._p_readonly;
        if (this._box)
            this._box._changeStatus("readonly", readonly);

        var input_elem = this._getInputElement();
        if (input_elem)
        {
            if (!this._onlydisplay)
                input_elem.setElementReadonly(readonly);
        }
    };

    _pTextField.set_autoselect = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_autoselect != v)
        {
            this._p_autoselect = v;
            this.on_apply_autoselect(v);
        }
    };

    _pTextField.on_apply_autoselect = function (autoselect)
    {
        var input_elem = this._getInputElement();
        if (input_elem)
        {
            if (!this._onlydisplay)
                input_elem.setElementAutoSelect(autoselect);
        }
    };

    _pTextField.set_maxlength = function (v)
    {
        if (isNaN(v = +v) || v < 0)
        {
            return;
        }

        if (this._p_maxlength != v)
        {
            this._p_maxlength = v;
            this.on_apply_maxlength();
        }
    };

    _pTextField.on_apply_maxlength = function ()
    {
        if (this._p_inputtype == "number")
            this._maxlen = 0;
        else
            this._maxlen = this._p_maxlength;

        var input_elem = this._getInputElement();
        if (input_elem && !this._onlydisplay)
        {
            input_elem.setElementMaxLength(this._maxlen);
            this._setCharCount(this._p_text.length, this._maxlen);
        }
    };

    _pTextField.set_usecontextmenu = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_usecontextmenu != v)
        {
            this._p_usecontextmenu = v;
        }
    };

    _pTextField.set_cursor = function (v)
    {
        this._p_cursor = v;
        if (v)
        {
            if (this._cursor == null || this._cursor._p_value != v)
            {
                if (this._p_enable && v == "auto")
                {
                    v = "text";
                }
                var cursor = nexacro.CursorObject(v);
                this._cursor = cursor;
                this.on_apply_cursor(cursor);
            }
        }
        else
        {
            if (this._cursor)
            {
                this._cursor = null;
                this.on_apply_cursor(null);
            }
        }
    };

    _pTextField.on_apply_textAlign = nexacro._emptyFn;
    _pTextField.on_apply_padding = nexacro._emptyFn;
    _pTextField.on_apply_textDecoration = nexacro._emptyFn;

    /* 지원 안함.
    _pTextField.on_apply_textAlign = function (halign)
    {
        var input_elem = this._getInputElement();
        if (input_elem)
        {
            input_elem.setElementTextAlign(halign);
        }
    };

    _pTextField.on_apply_padding = function (padding)
    {
        var input_elem = this._getInputElement();
        if (input_elem)
        {
            input_elem.setElementPadding(padding);
        }
    };

    _pTextField.on_apply_textDecoration = function (textDecoration)
    {
        var input_elem = this._getInputElement();
        if (input_elem)
        {
            input_elem.setElementTextDecoration(textDecoration);
        }
    };
    */

    //===============================================================
    // nexacro.TextField : Methods
    //===============================================================
    _pTextField._on_getDisplayText = function ()
    {
        return this._getStringResourceProperty(this._p_prefixtext) + this._getStringResourceProperty(this._p_text) + this._getStringResourceProperty(this._p_postfixtext);
    };

    _pTextField.getLength = function ()
    {
        return (this._p_value ? this._p_value.length : 0);
    };

    _pTextField.getCaretPos = function ()
    {
        if (this._p_readonly)
        {
            return -1;
        }

        var input_elem = this._getInputElement();
        if (input_elem)
        {
            var pos = input_elem.getElementCaretPos();
            if (pos && pos != -1)
            {
                return pos.begin;
            }
        }

        return -1;
    };

    _pTextField.setCaretPos = function (v)
    {
        var input_elem = this._getInputElement();
        if (input_elem)
        {
            if (!this._onlydisplay)
            {
                if (arguments.length == 0)
                {
                    v = 0;
                }
                else
                {
                    v = nexacro._toInt(v);
                    if (v == -1)
                    {
                        if (v)
                        {
                            v = this._p_text.length;
                        }
                        else
                        {
                            v = 0;
                        }
                    }
                }

                input_elem.setElementSetSelect(v, v);
            }

            return true;
        }

        return false;
    };

    _pTextField.getSelect = function ()
    {
        var input_elem = this._getInputElement();
        if (input_elem && !this._onlydisplay)
        {
            return input_elem.getElementSelectionRange();
        }

        return [0, 0];
    };

    _pTextField.setSelect = function (start, end)
    {
        var input_elem = this._getInputElement();
        if (input_elem)
        {
            if (!this._onlydisplay)
            {
                var txt = this._p_text ? this._p_text : "";
                var txt_len = txt.length;

                if (nexacro._isNull(start) || start === "")
                {
                    start = 0;
                }
                if (nexacro._isNull(end) || end === "")
                {
                    end = -1;
                }

                if (!nexacro._isNumber(start))
                {
                    start = nexacro._toInt(start);
                }
                if (!nexacro._isNumber(end))
                {
                    end = nexacro._toInt(end);
                }

                if (start == -1)
                {
                    start = txt_len;
                }
                if (end == -1)
                {
                    end = txt_len;
                }

                if (start > end)
                {
                    var tmp = start;
                    start = end;
                    end = tmp;
                }

                input_elem.setElementSetSelect(start, end);
            }

            return true;
        }

        return false;
    };

    _pTextField.getSelectedText = function ()
    {
        var input_elem = this._getInputElement();
        if (input_elem)
        {
            if (!this._onlydisplay)
            {
                var sel = input_elem.getElementSelectionRange();
                var start = sel[0], end = sel[1];
                var text = this._p_text;

                if (text && (start != end))
                {
                    return text.substring(start, end);
                }
            }
        }

        return "";
    };

    _pTextField.setSelectedText = function (v)
    {
        //v = nexacro._toString(v).replace(/&quot;/g, "\"");
        v = nexacro._toString(v);

        var input_elem = this._getInputElement();
        if (input_elem)
        {
            if (!this._onlydisplay)
            {
                var sel = input_elem.getElementSelectionRange();
                var start = sel[0], end = sel[1];
                if (start == end)
                    return "";

                var new_v = "";
                if (this._inputtype_obj)
                {
                    var v_len = v.length;
                    for (var i = 0; i < v_len; i++)
                    {
                        var ch = v[i];
                        if (this._inputtype_obj.test(ch))
                        {
                            new_v += ch;
                        }
                    }

                    v = new_v;
                }

                var insertlen = v.length;
                var src = this._p_text.substring(start, end);
                var newtext = this._p_text;
                var newlen = newtext.length - (end - start) + insertlen;
                if (this._maxlen > 0 && newlen > this._maxlen)
                {
                    v = v.substring(0, this._maxlen - insertlen);
                }
                newtext = newtext.substring(0, start) + v + newtext.substring(end);

                if (this._p_text != newtext)
                {
                    this.set_value(newtext, true);
                    input_elem.setElementSetSelect(start, start + insertlen);
                }

                return src;
            }
        }

        return "";
    };

    _pTextField.updateToDataset = function ()
    {
        this._result_updateToDataset = this.applyto_bindSource("value", this._p_value);
        if (this._result_updateToDataset)
        {
            this._default_value = this._p_value;
            this._default_text = this._p_text;
        }
        this._processing_updateToDataset = true;

        return this._result_updateToDataset;
    };

    _pTextField._convertValueType = function (v, bapplyrule)
    {
        var ret;
        if (bapplyrule)
            ret = nexacro.Component.prototype._convertValueType.call(this, v);
        else
            ret = nexacro._isNull(v) ? v : nexacro._toString(v);

        return ret;
    };

    _pTextField._setReadonlyView = function (v)
    {
        var input_elem = this._getInputElement();
        if (input_elem)
        {
            if (!this._onlydisplay)
            {
                input_elem.setElementReadonly(v);
            }
        }
    };

    _pTextField._setDefaultCaret = nexacro._emptyFn;

    _pTextField._setFocusToNextComponent = function ()
    {
        var root_comp = this._getRootComponent(this);
        var next_comp = this._getForm().getNextComponent(root_comp, true);
        if (next_comp)
        {
            next_comp.setFocus();
            if (next_comp._is_editable_control)
                next_comp._setDefaultCaret();
        }
    };

    _pTextField._isContainsText = function ()
    {
        if (this._box && (this._box._prefixctrl && this._box._prefixctrl._p_visible || this._box._postfixctrl && this._box._postfixctrl._p_visible) || this._p_displaynulltext)
            return true;

        return (this.value != null);
    };

    //===============================================================
    // nexacro.TextField : Events
    //===============================================================
    _pTextField.on_fire_leading_onclick = function (obj, e)
    {
        return this.on_fire_onleadingbuttonclick(e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.fromobject, e.fromreferenceobject, e.metakey);
    };

    _pTextField.on_fire_trailing_onclick = function (obj, e)
    {
        return this.on_fire_ontrailingbuttonclick(e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.fromobject, e.fromreferenceobject, e.metakey);
    };

    _pTextField._on_value_change = function (pretext, prevalue, posttext, postvalue)
    {
        var input_elem = this._getInputElement();

        if (nexacro._Browser == "Runtime")
        {
            var input_value = input_elem.value;
            this._setValue(input_value, true);
        }

        if (!this.on_fire_canchange(this, pretext, prevalue, posttext, postvalue))
        {
            return false;
        }

        var pos = input_elem.getElementCaretPos();
        if (pos && pos != -1)
        {
            this._caret_pos = pos;
        }

        if (this._processing_updateToDataset && !this._result_updateToDataset && prevalue === postvalue)
        {
            this._processing_updateToDataset = false;
            this._result_updateToDataset = true;
            return false;

        }
        else if (!this.applyto_bindSource("value", postvalue))
        {
            return false;
        }

        this._default_value = postvalue;
        this._default_text = posttext;

        this.on_fire_onchanged(this, pretext, prevalue, posttext, postvalue);
        return true;
    };

    _pTextField.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.oneditclick && this.oneditclick._has_handlers)
        {
            var caretpos = this.getCaretPos();
            var clientXY = this._getClientXY(canvasX, canvasY);

            var evt = new nexacro.EditClickEventInfo(this, "oneditclick", caretpos, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientXY[0], clientXY[1], this, this, meta_key);
            return this.oneditclick._fireEvent(this, evt);
        }

        return true;
    };

    _pTextField.on_fire_onleadingbuttonclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._input_element)
            this._input_element.setElementFocus();

        if (this.onleadingbuttonclick && this.onleadingbuttonclick._has_handlers)
        {
            var evt = new nexacro.ClickEventInfo(this, "onleadingbuttonclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
            var ret = this.onleadingbuttonclick._fireEvent(this, evt);
            evt.destroy();
            return ret;
        }
        return false;
    };

    _pTextField.on_fire_ontrailingbuttonclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._input_element)
            this._input_element.setElementFocus();

        if (this.ontrailingbuttonclick && this.ontrailingbuttonclick._has_handlers)
        {
            var evt = new nexacro.ClickEventInfo(this, "ontrailingbuttonclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
            var ret = this.ontrailingbuttonclick._fireEvent(this, evt);
            evt.destroy();
            return ret;
        }
        return false;
    };

    _pTextField.on_fire_canchange = function (obj, pretext, prevalue, posttext, postvalue)
    {
        if (this.canchange && this.canchange._has_handlers)
        {
            var evt = new nexacro.ChangeEventInfo(obj, "canchange", pretext, prevalue, posttext, postvalue);

            this._processing_canchange = true;
            var ret = this.canchange._fireCheckEvent(this, evt);
            this._processing_canchange = false;

            return ret;
        }

        return true;
    };

    _pTextField.on_fire_onchanged = function (obj, pretext, prevalue, posttext, postvalue)
    {
        if (this.onchanged && this.onchanged._has_handlers)
        {
            var evt = new nexacro.ChangeEventInfo(obj, "onchanged", pretext, prevalue, posttext, postvalue);
            return this.onchanged._fireEvent(this, evt);
        }
    };

    _pTextField.on_fire_oninput = function ()
    {
        this._invalidStatus(false);
        this._validStatus(false);
        var input_element = this._getInputElement();
        var v = this._needChangeInputValue(input_element.value);
        // var go_next = false;

        if (this._p_autoskip && this._maxlen > 0 && v)
        {
            if (!input_element.isComposing() && v.length >= this._maxlen)
            {
                v = v.substr(0, this._maxlen);
                //    go_next = true;
            }
        }

        if (v != input_element.value)
            input_element.setElementValue(v);

        var check = this._checkInputValidate(v);

        if (check == false)
        {
            this.on_invalid(false);

            if (this._p_inputtype == "number")
                this._p_value = this._p_text = "";
        }
        else if (check == true)
            this.on_valid(false);
        if (!this._maxlen || this._p_text.length <= this._maxlen)
            this._setCharCount(this._p_text.length, this._maxlen);

        var retn = true;
        if (this.oninput && this.oninput._has_handlers)
        {
            var evt = new nexacro.InputEventInfo(this, "oninput");
            retn = this.oninput._fireEvent(this, evt);
        }

        //if (go_next)
        //    this._setFocusToNextComponent();

        return retn;
    };

    _pTextField.on_input_focus = function () { };
    _pTextField.on_input_invalid = function () { };

    _pTextField.on_input_compositionend = function ()
    {
        var input_element = this._getInputElement();
        var v = input_element.value;

        if (this._maxlen > 0 && v)
        {
            var is_go = v.length >= this._maxlen;
            if (this._p_autoskip && is_go)
            {
                nexacro._OnceCallbackTimer.callonce(this, function ()
                {
                    this._setFocusToNextComponent();
                });
            }
        }
    };

    _pTextField.on_fire_onsetfocus = function (oldobj, oldreferobj, from_comp, from_refer_comp, from_input)
    {
        if (!this._onlydisplay)
        {
            if (!from_input)
            {
                this._focus_keep = {};
                this._focus_keep.oldobj = oldobj;
                this._focus_keep.oldref = oldreferobj;
                this._focus_keep.newobj = from_comp;
                this._focus_keep.newref = from_refer_comp;
            }
            else
            {
                if (!this._p_autoselect)
                {
                    var input_elem = this._input_element;

                    if (this._caret_pos == -1)
                    {
                        if (this._change_value)
                        {
                            input_elem.setElementSetSelect(this._p_value ? this._p_value.length : 0);
                        }
                        else
                        {
                            if (nexacro._isDesktop() || input_elem._is_sys_focused)
                            {
                                input_elem.setElementSetSelect(0, 0);
                            }
                        }
                    }
                }

                if (!this._focus_keep)
                    return false;

                if (this.onsetfocus && this.onsetfocus._has_handlers)
                {
                    oldobj = this._focus_keep.oldobj;
                    oldreferobj = this._focus_keep.oldref;
                    from_comp = this._focus_keep.newobj;
                    from_refer_comp = this._focus_keep.newref;

                    this._focus_keep = null;

                    var evt = new nexacro.SetFocusEventInfo(this, "onsetfocus", oldobj, oldreferobj, from_comp, from_comp);
                    return this.onsetfocus._fireEvent(this, evt);
                }
            }
        }
        else
        {
            if (this.onsetfocus && this.onsetfocus._has_handlers)
            {
                var evt = new nexacro.SetFocusEventInfo(this, "onsetfocus", oldobj, oldreferobj, from_comp, from_comp);
                return this.onsetfocus._fireEvent(this, evt);
            }
        }
        return false;
    };

    _pTextField._on_deactivate = function ()
    {
        this._focus_keep = null;
        nexacro.Component.prototype._on_deactivate.call(this);
        this.on_deactivate_process.call(this);
    };

    _pTextField._on_input_compositionend = _pEditPtype._on_input_compositionend;
    _pTextField.on_click_basic_action = _pEditPtype.on_click_basic_action;

    _pTextField._cancelValue = function ()
    {
        this._setValue(this._default_value);
    };

    _pTextField.on_killfocus_basic_action = function (new_focus, new_refer_focus)
    {
        nexacro.FieldBase.prototype.on_killfocus_basic_action.call(this, new_focus, new_refer_focus);

        this._confirmValue();

        if (!this._onlydisplay)
        {
            var _win = this._getRootWindow();
            var idx = _win._indexOfCurrentFocusPaths(this);
            if (idx < 0)
            {
                this._getInputElement().setElementBlur();
            }
        }

        this._focus_keep = null;
        this._input_physical_focused = false;

        if (this._env._p_enableaccessibility && nexacro._Browser == "Runtime" && this._env._a11ytype == 5)
        {
            this._setAccessibilityStatKillFocus();
        }
    };

    _pTextField._confirmValue = function ()
    {
        if (this._onlydisplay)
            return;

        var input_elem = this._getInputElement();
        var pre_value = this._default_value;
        var pre_text = this._default_text;
        var cur_value = input_elem.value;

        var pre_p_value = this._p_value;

        if (pre_value != cur_value)
        {
            if (this._maxlen > 0)
            {
                if (cur_value && cur_value.length > this._maxlen)
                {
                    cur_value = cur_value.substr(0, this._maxlen);
                    if (cur_value != input_elem.value)
                        input_elem.setElementValue(cur_value);
                }
            }
        }

        var cur_text = cur_value ? cur_value : "";

        var check = this._checkApplyValidate(cur_value, true);

        if (check == false)
        {
            this.on_invalid(true);
            if (this._p_inputtype == "number")
                cur_value = cur_text = "";
        }
        else if (check == true)
        {
            this.on_valid(true);
        }

        if (pre_value != cur_value)
        {
            if (!this._on_value_change(pre_text, pre_value, cur_text, cur_value))
            {
                var pos = input_elem.getElementCaretPos();
                var cur_text_len = cur_text ? cur_text.length : 0;
                var pre_text_len = pre_text ? pre_text.length : 0;

                if (pos != -1)
                {
                    if (cur_text_len - pre_text_len >= 0)
                        pos.begin = pos.end = pos.begin - (cur_text_len - pre_text_len);

                    if (pos.begin < 0) pos.begin = pos.end = 0;

                    this._caret_pos = pos;
                }
                else
                {
                    this._caret_pos.begin = this._caret_pos.end = pre_value ? pre_value.length : 0;
                }

                this._p_value = pre_value;
                this._p_text = pre_text;

                cur_value = this._p_value;

                input_elem.setElementValue(pre_value);
                input_elem.setElementSetSelect(this._caret_pos.begin, this._caret_pos.end);
            }

            if (input_elem && input_elem._updateElementValue)
            {
                if (pre_p_value != this._p_value)
                    cur_value = this._p_value;

                input_elem._updateElementValue(cur_value);
                this._setValue(cur_value === null ? undefined : cur_value, true);
            }

            if (nexacro._OS == "iOS" || nexacro._Browser == "Gecko")
            {
                input_elem._clearNumberGabageValue();
            }
        }
        this._caret_pos = input_elem.getElementCaretPos();
    };


    _pTextField.on_apply_imeSet = function ()
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            var _locale = input_elem._imelocale.getLocale();
            var i, len;
            var _cache_textfield_set = nexacro._cache_textfield_set[_locale];
            if (_locale && _cache_textfield_set)
            {
                // 기존 ime에서 자체적으로 만든 함수, 변수 제거 해야함
                // clear함수 필요

                for (var prop in _cache_textfield_set)
                {
                    this[prop] = _cache_textfield_set[prop];
                }

                for (i = 0, len = nexacro._edit_user_override_func.length; i < len; i++)
                {
                    if (!_cache_textfield_set[nexacro._edit_user_override_func[i]])
                        this[nexacro._edit_user_override_func[i]] = nexacro.TextField.prototype[nexacro._edit_user_override_func[i]];
                }
            }
            else
            {
                // 기존ime 정보 clear함수 필요

                for (i = 0, len = nexacro._edit_user_override_func.length; i < len; i++)
                {
                    this[nexacro._edit_user_override_func[i]] = nexacro.TextField.prototype[nexacro._edit_user_override_func[i]];
                }

            }
        }
    };
    //--------- WRE ----------------------------------------------------------------------------------------------------------------
    if (nexacro._Browser != "Runtime")
    {
        _pTextField.on_keydown_default_process = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
        {
            if (nexacro._OS == "Mac OS" || nexacro._OS == "OSX" || nexacro._OS == "iOS")
                ctrl_key = meta_key;

            if (this._p_readonly || !this._isEnable())
            {
                return true;
            }
            if (keycode == nexacro.Event.KEY_ENTER)
            {
                this._confirmValue();
                return true;
            }
            if (keycode == nexacro.Event.KEY_ESC)
            {
                if (this._is_use_esc_cancelvalue)
                {
                    this._cancelValue();
                    return true;
                }
            }

            this._is_IOSimeinput = undefined;

            if (nexacro._OS == "iOS")
            {
                var sel = this.getSelect();

                if (sel[1] == sel[0])
                {
                    if (keycode == nexacro.KeyCode_ImeInput || keycode == 0)
                        this._is_IOSimeinput = true;
                }
            }

            return false;
        };
    }
    //--------- NRE ----------------------------------------------------------------------------------------------------------------
    else
    {
        _pTextField.on_keydown_default_process = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
        {
            if (this._p_readonly || !this._isEnable())
                return false;

            if (keycode == nexacro.Event.KEY_ESC)
            {
                if (this._is_use_esc_cancelvalue)
                {
                    this._cancelValue();
                    return true;
                }
            }
            return false;
        };
    }

    // undo, redo, 지원
    _pTextField._on_input_undo = _pEditPtype._on_input_undo;
    _pTextField._on_input_redo = _pEditPtype._on_input_redo;

    // Edit keydown basic action
    _pTextField.on_keydown_basic_before_process = _pEditPtype.on_keydown_basic_before_process;
    _pTextField.on_keydown_basic_specialkey_process = _pEditPtype.on_keydown_basic_specialkey_process;
    _pTextField.on_keydown_basic_process = _pEditPtype.on_keydown_basic_process;
    _pTextField.on_keydown_basic_action = _pEditPtype.on_keydown_basic_action;

    // Edit keydown default action
    _pTextField.on_keydown_default_before_process = _pEditPtype.on_keydown_default_before_process;
    _pTextField.on_keydown_default_specialkey_process = _pEditPtype.on_keydown_default_specialkey_process;
    _pTextField.on_keydown_default_action = _pEditPtype.on_keydown_default_action;

    // Edit filter
    _pTextField._isFilterChar = _pEditPtype._isFilterChar;

    //===============================================================
    // nexacro.TextFieldBox (flexible)
    //===============================================================
    nexacro.TextFieldBox = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.FieldBaseBox.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._onlydisplay = this._p_parent._onlydisplay;

        if (this._onlydisplay)
        {
            this._p_readonly = true;
        }
    };

    var _pTextFieldBox = nexacro._createPrototype(nexacro.FieldBaseBox, nexacro.TextFieldBox);
    nexacro.TextFieldBox.prototype = _pTextFieldBox;

    _pTextFieldBox._type_name = "TextFieldBox";

    _pTextFieldBox._p_flexcrossaxisalign = "center";
    _pTextFieldBox._p_flexmainaxisalign = "spacebetween";
    _pTextFieldBox._p_iconbuttonsize = undefined;
    _pTextFieldBox._p_leadingbuttonsize = undefined;
    _pTextFieldBox._p_trailingbuttonsize = undefined;

    _pTextFieldBox._apply_client_padding = false;
    _pTextFieldBox._use_readonly_status = true;
    _pTextFieldBox._use_beforeinput = false;
    _pTextFieldBox._input_element = null;   // default : InputElement ,display-mode : TextBoxElement
    _pTextFieldBox._leadbutton = null;
    _pTextFieldBox._trailbutton = null;
    _pTextFieldBox._prefixctrl = null;
    _pTextFieldBox._postfixctrl = null;

    _pTextFieldBox._leading_button_id = "leadingbutton";
    _pTextFieldBox._trailing_button_id = "trailingbutton";

    _pTextFieldBox.on_create_contents = function ()
    {
        if (this._onlydisplay)
            this._is_flexible = false;

        this._updateLeadingButton(true);
        this._updatePrefixControl(true);
        this._updatepostfixControl(true);
        this._updateTrailingButton(true);

        var input_elem;

        if (!this._onlydisplay)
        {
            input_elem = this._input_element = new nexacro.SimpleInputElement(this.getElement(), "simpleinput");
            input_elem._use_beforeinput = this._use_beforeinput;
            input_elem._use_accessibility_label = false;
        }
        else
        {
            input_elem = this._input_element = new nexacro.TextBoxElement(this.getElement(), "simpleinput");
            input_elem.typeselector = "nexacontentsboxflex";
            input_elem.setElementVerticalAlign("middle");
            input_elem.setElementValue = input_elem.setElementText;
            input_elem._use_style_padding = true;
            input_elem._getInputValue = function ()
            {
                return this._p_text;
            };

            var padding = this._getCurrentStylePadding();
            if (padding)
                input_elem.setElementPadding(padding);
        }

        this._recalc_box();
    };

    _pTextFieldBox._updateLeadingButton = function (create_only)
    {
        if (this._p_parent._p_useleadingbutton && !this._leadbutton)
        {
            var leadbutton = this._leadbutton = new nexacro.FieldBaseIconControl(this._leading_button_id, 0, 0, 0, 0, null, null, null, null, null, null, this);
            leadbutton._firstchild = true;   // node 순서를 맨 앞으로..

            if (!this._isFlexible())
                leadbutton._excluded_flex = true;

            leadbutton.createComponent(create_only);

            if (this._isFlexible())
                leadbutton.set_flexgrow(0);
        }
        else if (!this._p_parent._p_useleadingbutton)
        {
            this._destroyLeadingButton();
        }
    };

    _pTextFieldBox._updatePrefixControl = function (create_only)
    {
        if (this._p_parent._p_prefixtext)
        {
            if (!this._prefixctrl)
            {
                var prefixctrl = this._prefixctrl = new nexacro.FieldBaseTextControl("prefixtext", 0, 0, 0, 0, null, null, null, null, null, null, this);
                this._prefixctrl._type_name = "StaticControl";

                prefixctrl._firstchild = true;   // node 순서를 맨 앞으로..
                prefixctrl.set_text(this._getStringResourceProperty(this._p_parent._p_prefixtext));

                if (!this._isFlexible())
                    prefixctrl._excluded_flex = true;

                prefixctrl.createComponent(create_only);

                if (this._isFlexible())
                {
                    prefixctrl.set_flexgrow(0);

                    //var prefixelem = prefixctrl.getElement();
                    prefixctrl._update_layoutbasis();
                }

                if (!create_only)   // 버튼이 앞으로 와야 하므로 node 순서를 맞추기 위해 다시 생성
                {
                    this._destroyLeadingButton();
                    this._updateLeadingButton();
                }
            }
            else
            {
                this._prefixctrl.set_text(this._getStringResourceProperty(this._p_parent._p_prefixtext));
            }
        }
        else if (!this._p_parent._p_prefixtext)
        {
            this._destroyPrefixControl();
        }
    };

    _pTextFieldBox._updatepostfixControl = function (create_only)
    {
        if (this._p_parent._p_postfixtext)
        {
            if (!this._postfixctrl)
            {
                var postfixctrl = this._postfixctrl = new nexacro.FieldBaseTextControl("postfixtext", 0, 0, 0, 0, null, null, null, null, null, null, this);
                this._postfixctrl._type_name = "StaticControl";

                postfixctrl.set_text(this._getStringResourceProperty(this._p_parent._p_postfixtext));

                if (!this._isFlexible())
                    postfixctrl._excluded_flex = true;

                postfixctrl.createComponent(create_only);

                if (this._isFlexible())
                {
                    postfixctrl.set_flexgrow(0);

                    //var postfixelem = postfixctrl.getElement();
                    postfixctrl._update_layoutbasis();
                }

                if (!create_only)   // 버튼이 뒤로 와야 하므로 node 순서를 맞추기 위해 다시 생성
                {
                    this._destroyTrailingButton();
                    this._updateTrailingButton();
                }
            }
            else
            {
                this._postfixctrl.set_text(this._getStringResourceProperty(this._p_parent._p_postfixtext));
            }
        }
        else if (!this._p_parent._p_postfixtext)
        {
            this._destroypostfixControl();
        }
    };

    _pTextFieldBox._updateTrailingButton = function (create_only)
    {
        if (this._p_parent._p_usetrailingbutton && !this._trailbutton)
        {
            var trailbutton = this._trailbutton = new nexacro.FieldBaseIconControl(this._trailing_button_id, 0, 0, 0, 0, null, null, null, null, null, null, this);

            if (!this._isFlexible())
                trailbutton._excluded_flex = true;

            trailbutton.createComponent(create_only);

            if (this._isFlexible())
                trailbutton.set_flexgrow(0);
        }
        else if (!this._p_parent._p_usetrailingbutton)
        {
            this._destroyTrailingButton();
        }
    };

    _pTextFieldBox._destroyLeadingButton = function ()
    {
        if (this._leadbutton)
        {
            this._leadbutton.destroy();
            this._leadbutton = null;
        }
    };

    _pTextFieldBox._destroyPrefixControl = function ()
    {
        if (this._prefixctrl)
        {
            this._prefixctrl.destroy();
            this._prefixctrl = null;
        }
    };

    _pTextFieldBox._destroypostfixControl = function ()
    {
        if (this._postfixctrl)
        {
            this._postfixctrl.destroy();
            this._postfixctrl = null;
        }
    };

    _pTextFieldBox._destroyTrailingButton = function ()
    {
        if (this._trailbutton)
        {
            this._trailbutton.destroy();
            this._trailbutton = null;
        }
    };

    _pTextFieldBox.on_created_contents = function (win)
    {
        if (this._leadbutton)
            this._leadbutton.on_created(win);
        if (this._prefixctrl)
            this._prefixctrl.on_created(win);

        this._input_element.create(win);
        this._applyInputElementFluidPos();
        if (this._postfixctrl)
            this._postfixctrl.on_created(win);
        if (this._trailbutton)
            this._trailbutton.on_created(win);
    };

    _pTextFieldBox.on_create_contents_command = function ()
    {
        var str = "";

        if (this._leadbutton)
            str += this._leadbutton.createCommand();

        if (this._prefixctrl)
            str += this._prefixctrl.createCommand();

        str += this._input_element.createCommand();

        if (this._postfixctrl)
            str += this._postfixctrl.createCommand();

        if (this._trailbutton)
            str += this._trailbutton.createCommand();

        return str;
    };

    _pTextFieldBox.on_attach_contents_handle = function (win)
    {
        this._input_element.attachHandle(win);

        if (this._leadbutton)
        {
            this._leadbutton.attachHandle(win);
            this._leadbutton._setAccessibilityStatHidden(true);
        }

        if (this._prefixctrl)
        {
            this._prefixctrl.attachHandle(win);
            this._prefixctrl._setAccessibilityStatHidden(true);
        }

        if (this._postfixctrl)
        {
            this._postfixctrl.attachHandle(win);
            this._postfixctrl._setAccessibilityStatHidden(true);
        }

        if (this._trailbutton)
        {
            this._trailbutton.attachHandle(win);
            this._trailbutton._setAccessibilityStatHidden(true);
        }

        // input에 직접 label을 설정하므로 필요없음
        //nexacro._createNotifyAccessibilityInputElement();
    };

    _pTextFieldBox.on_destroy_contents = function ()
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            input_elem.destroy();
            this._input_element = null;
        }

        this._destroyLeadingButton();
        this._destroyPrefixControl();
        this._destroypostfixControl();
        this._destroyTrailingButton();
    };

    _pTextFieldBox.set_iconbuttonsize = function (v)
    {
        if (this._p_iconbuttonsize != v)
        {
            this._p_iconbuttonsize = v;
            this._recalc_box();
        }
    };

    _pTextFieldBox.set_leadingbuttonsize = function (v)
    {
        if (this._p_leadingbuttonsize != v)
        {
            this._p_leadingbuttonsize = v;
            this._recalc_box();
        }
    };

    _pTextFieldBox.set_trailingbuttonsize = function (v)
    {
        if (this._p_trailingbuttonsize != v)
        {
            this._p_trailingbuttonsize = v;
            this._recalc_box();
        }
    };

    _pTextFieldBox._recalc_box = function ()
    {
        if (this._control_element)
        {
            var boxinner_rect = { left: this._getClientLeft(), top: this._getClientTop(), width: this._getClientWidth(), height: this._getClientHeight() };
            var input_elem = this._input_element;
            var leadbutton = this._leadbutton;
            var trailbutton = this._trailbutton;
            var prefixctrl = this._prefixctrl;
            var postfixctrl = this._postfixctrl;


            var client_left = boxinner_rect.left;
            var client_top = boxinner_rect.top;
            var client_width = boxinner_rect.width;
            var client_height = boxinner_rect.height;

            var buttonsize = this._p_iconbuttonsize;
            var leadingbuttonsize = this._p_leadingbuttonsize;
            var trailingbuttonsize = this._p_trailingbuttonsize;
            var buttonsize_w, buttonsize_h;
            var leadingbuttonsize_w, leadingbuttonsize_h;
            var trailingbuttonsize_w, trailingbuttonsize_h;
            var prefix_w = 0, postfix_w = 0;
            var leadbt_w = 0, tralbt_w = 0;

            if (this._p_parent._p_labelposition == "inside")
            {
                var border = this._getCurrentStyleBorder();
                var border_t = border ? border.top._width : 0;
                var f_label_height = this._p_parent.getFloatingLabelHeight();

                client_top = f_label_height + border_t;
                client_height -= (client_top);
            }

            if (buttonsize == undefined)
            {
                buttonsize_w = client_height;
                buttonsize_h = client_height;
            }
            else
            {
                if (typeof (buttonsize) == "number")
                {
                    buttonsize_w = buttonsize_h = buttonsize;
                }
                else
                {
                    buttonsize = buttonsize.split(" ");
                    buttonsize_w = +buttonsize[0];
                    buttonsize_h = (buttonsize[1]) ? +buttonsize[1] : client_height;
                }
            }

            if (buttonsize_w > client_width) // width over, second
                buttonsize_w = client_width;
            if (buttonsize_h > client_height) // height over, second
                buttonsize_h = client_height;

            leadingbuttonsize_w = buttonsize_w;
            leadingbuttonsize_h = buttonsize_h;
            trailingbuttonsize_w = buttonsize_w;
            trailingbuttonsize_h = buttonsize_h;

            if (leadbutton || trailbutton)
            {
                var btn_top = client_top;

                if (leadbutton)
                {
                    if (leadingbuttonsize_h < client_height)
                        btn_top = (client_height - leadingbuttonsize_h) / 2;

                    if (leadingbuttonsize != undefined)
                    {
                        if (typeof (leadingbuttonsize) == "number")
                        {
                            leadingbuttonsize_w = leadingbuttonsize_h = leadingbuttonsize;
                        }
                        else
                        {
                            leadingbuttonsize = leadingbuttonsize.split(" ");
                            leadingbuttonsize_w = +leadingbuttonsize[0];
                            leadingbuttonsize_h = (leadingbuttonsize[1]) ? +leadingbuttonsize[1] : client_height;

                            if (leadingbuttonsize_w > client_width)
                                leadingbuttonsize_w = client_width
                            if (leadingbuttonsize_h > client_height)
                                leadingbuttonsize_h = client_height
                        }
                    }

                    leadbutton.move(client_left, btn_top, leadingbuttonsize_w, leadingbuttonsize_h, null, null);
                    leadbutton._initControlElementLayoutProps();
                    if (this._isFlexible())
                        leadbutton.getElement()._forceApplyPosTop(btn_top);
                    leadbt_w = leadingbuttonsize_w;
                }

                if (trailbutton)
                {
                    if (trailingbuttonsize_h < client_height)
                        btn_top = (client_height - trailingbuttonsize_h) / 2;

                    if (trailingbuttonsize != undefined)
                    {
                        if (typeof (trailingbuttonsize) == "number")
                        {
                            trailingbuttonsize_w = trailingbuttonsize_h = trailingbuttonsize;
                        }
                        else
                        {
                            trailingbuttonsize = trailingbuttonsize.split(" ");
                            trailingbuttonsize_w = +trailingbuttonsize[0];
                            trailingbuttonsize_h = (trailingbuttonsize[1]) ? +trailingbuttonsize[1] : client_height;

                            if (trailingbuttonsize_w > client_width)
                                trailingbuttonsize_w = client_width
                            if (trailingbuttonsize_h > client_height)
                                trailingbuttonsize_h = client_height
                        }
                    }

                    trailbutton.move((client_left + client_width - trailingbuttonsize_w), btn_top, trailingbuttonsize_w, trailingbuttonsize_h, null, null);
                    trailbutton._initControlElementLayoutProps();
                    if (this._isFlexible())
                        trailbutton.getElement()._forceApplyPosTop(btn_top);
                    tralbt_w = trailingbuttonsize_w;
                }
            }




            /*
            else if (this._p_parent._p_labelposition == "overlap")
            {
                var border = this._getCurrentStyleBorder();
                var border_t = border ? border.top._width : 0;

                client_top = f_label_height / 2  + border_t;
                client_height -= (client_top * 2);
            }
            */
            if (prefixctrl)
            {
                prefix_w = prefixctrl._on_getFitSize()[0];
                prefixctrl.move(client_left + leadbt_w, client_top, prefix_w, client_height);
                prefixctrl._initControlElementLayoutProps();

                if (this._isFlexible())
                    prefixctrl.getElement()._forceApplyPosTop(client_top);
            }

            if (postfixctrl)
            {
                postfix_w = postfixctrl._on_getFitSize()[0];
                postfixctrl.move((client_left + client_width - tralbt_w) - postfix_w, client_top, postfix_w, client_height);
                postfixctrl._initControlElementLayoutProps();

                if (this._isFlexible())
                    postfixctrl.getElement()._forceApplyPosTop(client_top);
            }

            if (input_elem)
            {
                var input_width = client_width - leadbt_w - tralbt_w - prefix_w - postfix_w;
                var l = leadbt_w + prefix_w;

                if (this._isFlexible() == false)
                    input_elem.setElementPosition(client_left + l, client_top);
                else
                    input_elem.setElementPosition(input_elem.left, client_top);

                input_elem.setElementSize(input_width, client_height);
            }
        }
    };

    _pTextFieldBox._getWantLabelLeft = function ()
    {
        var leadbutton = this._leadbutton;
        var prefixctrl = this._prefixctrl;
        var left = -1;

        if (leadbutton && leadbutton._p_visible)
        {
            left = this._getClientLeft() + leadbutton._adjust_width;
        }

        if (prefixctrl && prefixctrl._p_visible)
        {
            if (left == -1)
                left = this._getClientLeft();

            left += prefixctrl._adjust_width;
        }
        return left;
    };


    _pTextFieldBox._setTextFielBoxLabelposition = function (labelposition)
    {
        this._textFielBoxLabelposition = labelposition;
    };

    _pTextFieldBox._applyInputElementFluidPos = function ()
    {
        var input_elem = this._input_element;
        if (input_elem)
            input_elem.setElementLayoutFluidPos(this.visible);
    }

    _pTextFieldBox._getWantLabelWidth = function ()
    {
        var c_width = this._getClientWidth();
        var leadbutton = this._leadbutton;
        var trailbutton = this._trailbutton;
        var prefixctrl = this._prefixctrl;
        var postfixctrl = this._postfixctrl;

        if (leadbutton && leadbutton._p_visible)
            c_width -= leadbutton._adjust_width;
        if (trailbutton && trailbutton._p_visible)
            c_width -= trailbutton._adjust_width;
        if (prefixctrl && prefixctrl._p_visible)
            c_width -= prefixctrl._adjust_width;
        if (postfixctrl && postfixctrl._p_visible)
            c_width -= postfixctrl._adjust_width;

        return c_width;
    };

    _pTextFieldBox.on_apply_prop_enable = function (v)
    {
        v = (v != null) ? v : this._isEnable();

        if (this._leadbutton)
            this._leadbutton._setEnable(v);
        if (this._trailbutton)
            this._trailbutton._setEnable(v);
    };

    _pTextFieldBox.on_change_containerRect = function (width, height)
    {
        this._recalc_box();
    };

    _pTextFieldBox.on_input_focus = function ()
    {
        this._p_parent._input_physical_focused = true;
        this._p_parent.on_input_focus();
        this._p_parent.on_fire_onsetfocus(this._p_parent, this, this._p_parent, this, true);
    };

    _pTextFieldBox.on_input_compositionend = function ()
    {
        this._p_parent.on_input_compositionend();
    };

    _pTextFieldBox._on_input_compositionend = function (value, _pos)
    {
        return this._p_parent._on_input_compositionend(value, _pos);
    };

    _pTextFieldBox._setAccessibilityReadOnly = nexacro._emptyFn;

    _pTextFieldBox.on_keyup_default_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        return this._p_parent.on_keyup_default_action(keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key);  // default는 bubble이 되지 않으므로 parent에서 그대로 사용하기 위해..
    };

    _pTextFieldBox.on_keyinput_basic_action = function (input_text)
    {
        return this._p_parent.on_keyinput_basic_action(input_text);    // 입력중 ._p_value 에 반영을 위해 parent로 전달 필요
    };

    _pTextFieldBox.on_click_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key)
    {
        return this._p_parent.on_click_basic_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key);
    };

    _pTextFieldBox._on_contextmenu_default_action = function ()
    {
        return nexacro._checkShowContextMenu(this._p_parent);
    };

    _pTextFieldBox.on_apply_imeSet = function ()
    {
        var textField = this.parent;
        if (textField)
            textField.on_apply_imeSet();
    };

    nexacro._defineProperties(_pTextField, _pTextField._properties);

    _pTextFieldBox = null;
    _pTextField = null;
    _pEditPtype = null;
};