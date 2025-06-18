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
if (!nexacro.Edit)
{
    //==============================================================================
    // nexacro.Edit 
    //==============================================================================
    nexacro.Edit = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._onlydisplay = onlydisplay;

        if (onlydisplay)
        {
            this._apply_client_padding = true;
            this._p_readonly = true;
        }
    };

    var _pEdit = nexacro._createPrototype(nexacro.Component, nexacro.Edit);
    nexacro.Edit.prototype = _pEdit;
    _pEdit._type_name = "Edit";

    /* default properties */
    _pEdit._p_value = undefined;
    _pEdit._p_displaynulltext = "";
    _pEdit._p_readonly = false;
    _pEdit._p_password = false;
    _pEdit._p_autoselect = false;
    _pEdit._p_autoskip = false;
    _pEdit._p_maxlength = 0;

    _pEdit._initsoftkeyboard = undefined;
    _pEdit._p_usesoftkeyboard = true;

    _pEdit._p_inputmode = "normal";
    _pEdit._p_inputfilter = "none";
    _pEdit._p_inputtype = "normal";
    _pEdit._p_imeaction = "none";
    _pEdit._p_imemode = "none";
    _pEdit.useime = "global"; // 미노출
    _pEdit._p_text = "";
    _pEdit._p_usecontextmenu = true;

    /* internal variable */
    _pEdit._input_element = null;   // default : InputElement ,Grid display-mode : TextBoxElement

    _pEdit._inputfilter_obj = null;
    _pEdit._inputtype_obj = null;
    _pEdit._undostack = null;
    _pEdit._is_undo = false;

    //_pEdit._default_pos = { begin: 0, end: 0 };
    _pEdit._default_value = undefined;
    _pEdit._default_text = "";
    _pEdit._keypad_type = "text";
    _pEdit._imedisable = false;

    _pEdit._processing_updateToDataset = false;
    _pEdit._result_updateToDataset = true;
    _pEdit._processing_canchange = false;

    _pEdit._onlydisplay = false;
    _pEdit._apply_client_padding = false;
    _pEdit._has_inputElement = true;
    _pEdit._change_value = false;
    _pEdit._processing_autoskip = false;

    /* status */
    _pEdit._is_simple_control = true;
    _pEdit._is_editable_control = true;
    _pEdit._use_readonly_status = true;
    _pEdit._ignore_deleteContentBackward = false;
    _pEdit._caret_pos = -1;

    /* event list */
    _pEdit._event_list = {
        "oneditclick": 1,
        "onkeydown": 1, "onkeyup": 1,
        "onkillfocus": 1, "onsetfocus": 1,
        "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1, "onmousedown": 1, "onmouseup": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1,
        "onmove": 1, "onsize": 1,
        "canchange": 1, "onchanged": 1, "oninput": 1, "onimeaction": 1,
        "oncontextmenu": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1, "ondevicebuttonup": 1
    };

    /* accessibility */
    _pEdit._p_accessibilityrole = "edit";

    //===============================================================
    // nexacro.Edit : Create & Destroy & Update
    //===============================================================
    _pEdit.on_create_contents = function ()
    {
        var control = this.getElement();
        if (control)
        {
            var input_elem;
            if (!this._onlydisplay)
            {
                input_elem = this._input_element = new nexacro.InputElement(control, "input");
                input_elem.setElementAutoSkip(this._p_autoskip);
                input_elem.setElementAutoSelect(this._p_autoselect);
                input_elem.setElementUseIme(this.useime);
                input_elem.setElementImeMode(this._p_imemode);
                input_elem.setElementImeAction(this._p_imeaction);
                input_elem.setElementReadonly(this._p_readonly);
                input_elem.setElementDisplayNullText(this._getStringResourceProperty(this._p_displaynulltext));
                input_elem.setElementMaxLength(this._p_maxlength);
            }
            else
            {
                input_elem = this._input_element = new nexacro.TextBoxElement(control, "input");
                input_elem.setElementVerticalAlign("middle");
            }

            input_elem.setElementPosition(this._getClientLeft(), this._getClientTop());
            input_elem.setElementSize(this._getClientWidth(), this._getClientHeight());
            input_elem.setElementTextDecoration(this._textdecoration);
            input_elem.setElementTextAlign(this._p_textAlign);
            input_elem.setElementPadding(this._padding);

            this._undostack = new nexacro._EditUndoStack(this);
        }
    };

    _pEdit.on_created_contents = function (win)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            this.on_apply_value(this._p_value);

            input_elem.create(win);

            this.on_apply_inputtype();
            this.on_apply_usesoftkeyboard();

            if (nexacro._isNull(this._p_value))
            {
                this._changeUserStatus("nulltext", true);
            }
        }

        if (this._env._p_enableaccessibility)
        {
            this._on_created_accessibility_contents(win);
        }
    };

    _pEdit.on_destroy_contents = function ()
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            input_elem.destroy();
            this._input_element = null;
        }

        var undostack = this._undostack;
        if (undostack)
        {
            undostack.destroy();
            this._undostack = null;
        }

        var inputfilterobj = this._inputfilter_obj;
        if (inputfilterobj)
        {
            this._inputfilter_obj = null;
        }

        var inputtypeobj = this._inputtype_obj;
        if (inputtypeobj)
        {
            this._inputtype_obj = null;
        }
    };

    _pEdit.on_create_contents_command = function ()
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            this.on_apply_value(this._p_value);
            this.on_apply_prop_enable(this._real_enable);
            this.on_apply_inputtype();
            this.on_apply_usesoftkeyboard();

            return input_elem.createCommand();
        }

        return "";
    };

    _pEdit.on_attach_contents_handle = function (win)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            input_elem.attachHandle(win);

            if (nexacro._isNull(this._p_value))
            {
                this._changeUserStatus("nulltext", true);
            }
        }

        if (this._env._p_enableaccessibility)
        {
            this._on_attach_accessibility_contents_handle(win);
        }
    };

    _pEdit.on_change_containerRect = function (width, height)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            input_elem.setElementSize(width, height);
        }
    };

    _pEdit.on_change_containerPos = function (left, top)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            input_elem.setElementPosition(left, top);
        }
    };

    //===============================================================
    // nexacro.Edit : Override
    //===============================================================
    _pEdit._getInputElement = function ()
    {
        return this._input_element;
    };

    _pEdit._apply_setfocus = function (evt_name, self_flag)
    {
        this._processing_updateToDataset = false;

        var input_elem = this._input_element;
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

                this._changeUserStatus("nulltext", false);

                // input에 직접 label을 설정하므로 필요없음
                //if (this._env._p_enableaccessibility && evt_name != "tabkey" && evt_name != "shifttabkey" && !this._isComponentKeydownAction())
                //	nexacro._notifyAccessibilityInputElement(this._getAccessibilityReadLabel());

                input_elem.setElementFocus(evt_name, self_flag);

                var text = input_elem.getElementText();
                if (text != this._p_text)
                {
                    this._default_text = this._p_text = text;
                }

                if (!this._p_autoselect)
                {
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
                                if (nexacro._Browser != "Runtime" && (evt_name == "focus" || evt_name == "lbuttondown"))
                                    input_elem._use_timer = true;

                                input_elem.setElementSetSelect(0, 0);

                                if (nexacro._Browser != "Runtime" && (evt_name == "focus" || evt_name == "lbuttondown"))
                                    input_elem._use_timer = false;
                            }
                        }
                    }
                }
            }
            else
            {
                if (evt_name)
                {
                    this._default_value = this._p_value;
                    this._default_text = this._p_text;
                }

                this._changeUserStatus("nulltext", false);
            }
        }
    };

    _pEdit.on_getBindableProperties = function ()
    {
        return "value";
    };

    _pEdit.on_apply_prop_enable = function (v)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            var color = this._getCSSStyleValue("color");

            if (!this._onlydisplay)
                input_elem.setElementEnable(v, color);
        }
    };

    _pEdit.on_apply_prop_stringresource = function ()
    {
        if (!nexacro._StringResource)
            return;

        nexacro.Component.prototype.on_apply_prop_stringresource.call(this);

        this.on_apply_displaynulltext(this._getStringResourceProperty(this._p_displaynulltext));
    };

    _pEdit.on_init_bindSource = function (columnid, propid, ds)
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

    _pEdit.on_change_bindSource = function (propid, ds, row, col)
    {
        if (propid == "value")
        {
            var input_elem = this._input_element;

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

            this._setValue(v);

            if (input_elem && _bSetselect && !this._onlydisplay)
            {
                input_elem.setElementSetSelect(this._p_value ? this._p_value.length : 0);

                this._caret_pos = input_elem.getElementCaretPos();
            }
        }
    };

    _pEdit.on_changeUserStatus = function (changestatus, value, applyuserstatus/*, currentstatus, currentuserstatus*/)
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

    _pEdit._getDlgCode = function (/*keycode, altKey, ctrlKey, shiftKey*/)
    {
        return { want_tab: false, want_return: false, want_escape: false, want_chars: false, want_arrows: false };
    };

    _pEdit._getDragData = function ()
    {
        return this.getSelectedText();
    };

    _pEdit._on_getFitSize = function ()
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

            var padding = this._getCurrentStylePadding();
            if (padding)
            {
                total_w += padding.left + padding.right;
                total_h += padding.top + padding.bottom;
            }

            var text;
            if (this._displaytext && this._displaytext !== "")
            {
                // apply_text로 처리된 대상 기준으로 fittocontects가 이루어져야 함
                text = this._displaytext;
            }
            else
            {
                text = this._p_text;
            }

            if (text)
            {
                var font = this._getCurrentStyleInheritValue("font");
                var refer_font = this._getReferenceAbsoluteFont(font); // use to em / rem
                var wordspace = this._getCurrentStyleInheritValue("wordSpacing");
                var letterspace = this._getCurrentStyleInheritValue("letterSpacing");

                var text_size = nexacro._getTextSize(this._p_text, font, false, undefined, "none", wordspace, letterspace, undefined, undefined, undefined, refer_font);

                total_w += Math.ceil(text_size[0]);
                total_h += Math.ceil(text_size[1]);
            }

            return [total_w, total_h];
        }

        return [this._adjust_width, this._adjust_height];
    };

    //===============================================================
    // nexacro.Edit : Properties
    //===============================================================
    _pEdit.set_text = nexacro._emptyFn;

    _pEdit.set_value = function (v)
    {
        //v = (v === undefined || v === null) ? v : nexacro._toString(v);
        v = this._convertValueType(v);

        if (this._p_value !== v)
        {
            if (!this.applyto_bindSource("value", v))
            {
                return;
            }

            this._setValue(v);
        }
    };

    _pEdit.on_apply_value = function (value)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            var pos = input_elem.getElementCaretPos();
            var text = this._p_text;
            value = (this._p_value ? this._p_text : this._p_value);

            var _form = this._getForm();
            var _cur_focus = _form ? _form.getFocus() : null;
            if (this._is_created && nexacro._isNull(this._p_value) && _cur_focus !== this._getRootComponent(this))
            {
                this._changeUserStatus("nulltext", true);
            }
            else
            {
                this._changeUserStatus("nulltext", false);
            }

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

                input_elem.setElementValue(value);

                if (value != null)
                    text = input_elem.getElementText();
            }
            else
            {
                if (this._p_displaynulltext && nexacro._isNull(this._p_value))
                {
                    var nulltext = this._getStringResourceProperty(this._p_displaynulltext);
                    input_elem.setElementText(nulltext);
                }
                else
                {
                    input_elem.setElementText(value);
                }
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
        }
    };

    _pEdit.set_displaynulltext = function (v)
    {
        //v = nexacro._toString(v).replace(/&quot;/g, "\"");
        v = nexacro._toString(v);
        if (this._p_displaynulltext != v)
        {
            this._p_displaynulltext = v;
            this.on_apply_displaynulltext(v);
        }
    };

    _pEdit.on_apply_displaynulltext = function (displaynulltext)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            var stringrc_prop = this._getStringResourceProperty(displaynulltext);
            if (this._onlydisplay)
                this.on_apply_value(this._p_value);
            else
                input_elem.setElementDisplayNullText(stringrc_prop ? stringrc_prop : displaynulltext);
        }
    };

    _pEdit.set_readonly = function (v)
    {
        if (this._onlydisplay)
            return;

        v = nexacro._toBoolean(v);
        if (this._p_readonly != v)
        {
            this._p_readonly = v;
            this.on_apply_readonly(v);
        }
    };

    _pEdit.on_apply_readonly = function (readonly)
    {
        this._changeStatus("readonly", readonly);

        var input_elem = this._input_element;
        if (input_elem)
        {
            if (!this._onlydisplay)
                input_elem.setElementReadonly(readonly);
        }
    };

    _pEdit.set_autoselect = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_autoselect != v)
        {
            this._p_autoselect = v;
            this.on_apply_autoselect(v);
        }
    };

    _pEdit.on_apply_autoselect = function (autoselect)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            if (!this._onlydisplay)
                input_elem.setElementAutoSelect(autoselect);
        }
    };

    _pEdit.set_autoskip = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_autoskip != v)
        {
            this._p_autoskip = v;
            this.on_apply_autoskip(v);
        }
    };

    _pEdit.on_apply_autoskip = function (autoskip)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            if (!this._onlydisplay)
                input_elem.setElementAutoSkip(autoskip);
        }
    };

    _pEdit.set_inputmode = function (v)
    {
        var inputmode_enum = ["normal", "upper", "lower"];
        if (inputmode_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_inputmode != v)
        {
            this._p_inputmode = v;
        }
    };

    _pEdit.set_inputfilter = function (v)
    {
        if (v)
        {
            var inputfilter_arr = v.split(',');
            var inputfilter_enum = ["none", "alpha", "digit", "comma", "dot", "sign", "space", "symbol"];
            for (var i = 0, len = inputfilter_arr.length; i < len; i++)
            {
                if (inputfilter_enum.indexOf(inputfilter_arr[i]) == -1)
                    return;
            }
        }
        else
        {
            return;
        }

        if (this._p_inputfilter != v)
        {
            this._p_inputfilter = v;
            this._inputfilter_obj = null;

            this.on_apply_inputfilter(v);
        }
    };

    _pEdit.on_apply_inputfilter = function (inputfilter)
    {
        this._inputfilter_obj = new nexacro._EditInputFilter(inputfilter);
    };

    _pEdit.set_inputtype = function (v)
    {
        if (v)
        {
            var inputtype_arr = v.split(',');
            var inputtype_enum = ["normal", "alpha", "english", "digit", "number", "comma", "dot", "sign", "space", "symbol", "half", "full", "numberandenglish"];
            for (var i = 0, len = inputtype_arr.length; i < len; i++)
            {
                if (inputtype_enum.indexOf(inputtype_arr[i]) == -1)
                    return;
            }
        }
        else
        {
            return;
        }

        if (this._p_inputtype != v)
        {
            this._p_inputtype = v;
            this._inputtype_obj = null;

            this.on_apply_inputtype();
        }
    };

    _pEdit.on_apply_inputtype = function ()
    {
        var input_type = this._p_inputtype;
        this._inputtype_obj = new nexacro._EditInputType(input_type);

        if (nexacro._isTouchInteraction && nexacro._SupportTouch)
            this._imedisable = false;
        else
            this._imedisable = this._inputtype_obj.imedisable;

        this._keypad_type = this._inputtype_obj.keypadtype;

        var input_elem = this._input_element;
        if (input_elem && !this._onlydisplay)
        {
            if ((input_type.indexOf("normal") >= 0) || (input_type.indexOf("full") >= 0))
            {
                input_elem._inputtype = "text";
            }
            else
            {
                input_elem._inputtype = "";
            }

            // FF의 문제로 this._imedisable 설정하지 않았으나, 동적 생성에서는 설정하고 있고 현재 버전에서 증상이 발생하지 않아 원복 처리 
            input_elem.setElementInputType(this._p_password ? "password" : this._keypad_type, this._imedisable);
        }
    };

    _pEdit.set_imeaction = function (v)
    {
        if (v)
        {
            var imeaction_arr = v.split(',');
            var imeaction_enum = ["none", "done", "go", "search", "send", "next", "previous"];
            for (var i = 0, len = imeaction_arr.length; i < len; i++)
            {
                if (imeaction_enum.indexOf(imeaction_arr[i]) == -1)
                    return;
            }
        }
        else
        {
            return;
        }

        if (this._p_imeaction != v)
        {
            this._p_imeaction = v;
            this.on_apply_imeaction(v);
        }
    };

    _pEdit.on_apply_imeaction = function (imeaction)
    {
        var input_elem = this._input_element;
        if (input_elem && !this._onlydisplay)
        {
            input_elem.setElementImeAction(imeaction);
        }
    };

    _pEdit.set_maxlength = function (v)
    {
        if (isNaN(v = +v) || v < 0)
        {
            return;
        }

        if (this._p_maxlength != v)
        {
            this._p_maxlength = v;
            this.on_apply_maxlength(v);
        }
    };

    _pEdit.on_apply_maxlength = function (maxlength)
    {
        var input_elem = this._input_element;
        if (input_elem && !this._onlydisplay)
        {
            input_elem.setElementMaxLength(maxlength);
        }
    };

    _pEdit.set_password = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_password != v)
        {
            this._p_password = v;
            this.on_apply_password(v);
        }
    };

    _pEdit.on_apply_password = function (password)
    {
        var input_elem = this._input_element;
        if (input_elem && !this._onlydisplay)
        {
            input_elem.setElementInputType(password ? "password" : this._keypad_type, this._imedisable);
        }
    };

    _pEdit.set_useime = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this.useime != v)
        {
            this.useime = v;
            this.on_apply_useime(v);
        }
    };

    _pEdit.on_apply_useime = function (useime)
    {
        var input_elem = this._input_element;
        if (input_elem && !this._onlydisplay)
        {
            input_elem.setElementUseIme(useime);
        }
    };

    _pEdit.set_usesoftkeyboard = function (v)
    {
        v = nexacro._toBoolean(v);
        if (v != this._p_usesoftkeyboard)
        {
            this._p_usesoftkeyboard = v;

            if (!this._initsoftkeyboard)
                this._initsoftkeyboard = true;

            this.on_apply_usesoftkeyboard();
        }
    };

    _pEdit.on_apply_usesoftkeyboard = function ()
    {
        var input_elem = this._input_element;
        if (input_elem && !this._onlydisplay)
        {
            input_elem.setElementUseSoftKeyboard(this._getUseSoftKeyboardValue(this._initsoftkeyboard));
        }
    };

    _pEdit.set_imemode = function (v)
    {
        var imemode_enum = ["none", "alpha", "alpha,full", "hangul", "hangul,full", "katakana", "katakana,full", "hiragana", "direct"];
        if (imemode_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_imemode != v)
        {
            this._p_imemode = v;
            this.on_apply_imemode(v);
        }
    };

    _pEdit.on_apply_imemode = function (imemode)
    {
        var input_elem = this._input_element;
        if (input_elem && !this._onlydisplay)
        {
            input_elem.setElementImeMode(imemode);
        }
    };

    _pEdit.set_usecontextmenu = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_usecontextmenu != v)
        {
            this._p_usecontextmenu = v;
        }
    };

    _pEdit.set_cursor = function (v)
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

    _pEdit.on_apply_textAlign = function (halign)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            input_elem.setElementTextAlign(halign);
        }
    };

    _pEdit.on_apply_padding = function (padding)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            input_elem.setElementPadding(padding);
        }
    };

    _pEdit.on_apply_textDecoration = function (textDecoration)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            input_elem.setElementTextDecoration(textDecoration);
        }
    };

    _pEdit._properties = [{ name: "value" }, { name: "displaynulltext" }, { name: "readonly" }, { name: "password" }, { name: "autoselect" },
    { name: "autoskip" }, { name: "maxlength" }, { name: "usesoftkeyboard" }, { name: "inputmode" }, { name: "inputtype" }, { name: "inputfilter" }, { name: "imeaction" },
    { name: "imemode" }, { name: "cursor" }, { name: "text", readonly: true }, { name: "usecontextmenu" }];

    nexacro._defineProperties(_pEdit, _pEdit._properties);

    //===============================================================
    // nexacro.Edit : Methods
    //===============================================================
    _pEdit.getLength = function ()
    {
        return (this._p_value ? this._p_value.length : 0);
    };

    _pEdit.getCaretPos = function ()
    {
        if (this._p_readonly || !this._isEnable())
        {
            return -1;
        }

        var input_elem = this._input_element;
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

    _pEdit.setCaretPos = function (v)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            if (this._p_readonly || !this._isEnable())
            {
                return false;
            }

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

    _pEdit.getSelect = function ()
    {
        var input_elem = this._input_element;
        if (input_elem && !this._onlydisplay)
        {
            return input_elem.getElementSelectionRange();
        }

        return [0, 0];
    };

    _pEdit.setSelect = function (start, end)
    {
        var input_elem = this._input_element;
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

    _pEdit.getSelectedText = function ()
    {
        var input_elem = this._input_element;
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

    _pEdit.setSelectedText = function (v)
    {
        //v = nexacro._toString(v).replace(/&quot;/g, "\"");
        v = nexacro._toString(v);

        var input_elem = this._input_element;
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
                if (this._p_maxlength > 0 && newlen > this._p_maxlength)
                {
                    v = v.substring(0, this._p_maxlength - insertlen);
                }
                newtext = newtext.substring(0, start) + v + newtext.substring(end);

                if (this._p_text != newtext)
                {
                    this.set_value(newtext);
                    input_elem.setElementSetSelect(start, start + insertlen);
                }

                return src;
            }
        }

        return "";
    };

    _pEdit.updateToDataset = function ()
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

    //===============================================================
    // nexacro.Edit : Events
    //===============================================================
    _pEdit.on_deactivate_process = function ()
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            if (!this._onlydisplay)
            {
                input_elem.setCompositionComplete();

                // deactivate 시 caret 위치 기억
                var range = input_elem.getElementSelectionRange();
                input_elem._setElementLastSelectionRange(range);
            }
        }
    };

    _pEdit._on_deactivate = function ()
    {
        nexacro.Component.prototype._on_deactivate.call(this);
        this.on_deactivate_process.call(this); // Edit Component 별 처리하려는 것으로 판단되어 유지
    };

    _pEdit._on_value_change = function (pretext, prevalue, posttext, postvalue)
    {
        if (!this.on_fire_canchange(this, pretext, prevalue, posttext, postvalue))
        {
            return false;
        }
        this._default_value = postvalue;
        this._default_text = posttext;

        var input_elem = this._input_element;
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
            this._default_value = prevalue;
            this._default_text = pretext;
            return false;
        }

        this.on_fire_onchanged(this, pretext, prevalue, posttext, postvalue);
        return true;
    };

    _pEdit._on_input_undo = function (item)
    {
        if (this._p_readonly || !this._isEnable())
        {
            return;
        }

        var input_elem = this._input_element;
        if (input_elem)
        {
            if (item)
            {
                this._is_undo = true;
                var caret = item.end;
                if (item.value && item.value.length > caret)
                    caret = item.value.length;

                // autoskip 으로 초기화 안되는 경우 초기화
                if (input_elem._use_event_beforeinput)
                {
                    input_elem._beforeinput_result = [];
                    input_elem._beforeinput_result_insert_data = null;
                    input_elem._beforeinput_result_data = null;
                    input_elem._beforeinput_result_pos = null;
                }
                input_elem.updateElementText(item.value, caret);
                input_elem.setElementSetSelect(item.start, item.end);
                return true;
            }
        }
    };

    _pEdit._on_input_redo = function (item)
    {
        if (this._p_readonly || !this._isEnable())
        {
            return;
        }

        var input_elem = this._input_element;
        if (input_elem)
        {
            if (item)
            {
                // autoskip 으로 초기화 안되는 경우 초기화
                if (input_elem._use_event_beforeinput)
                {
                    input_elem._beforeinput_result = [];
                    input_elem._beforeinput_result_insert_data = null;
                    input_elem._beforeinput_result_data = null;
                    input_elem._beforeinput_result_pos = null;
                }
                input_elem.updateElementText(item.value, item.end);
                input_elem.setElementSetSelect(item.start, item.end);
                return true;
            }
        }
    };

    _pEdit.on_keydown_basic_before_process = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        return true;
    };

    _pEdit.on_keydown_basic_specialkey_process = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        var input_elem = this._input_element;

        if (nexacro._OS == "Mac OS" || nexacro._OS == "OSX" || nexacro._OS == "iOS")
            ctrl_key = meta_key;

        if (keycode == nexacro.KeyCode_ImeInput && this._imedisable) // 229
        {
            input_elem.stopSysEvent();
            return;
        }
        else if (!alt_key && !shift_key && ctrl_key && keycode == 90) // 'z'
        {
            if (input_elem.isComposing())
            {
                input_elem.setCompositionComplete();
            }

            if (this._undostack)
            {
                this._undostack.undo();

                input_elem._applyMaxlength();

                input_elem.stopSysEvent();
                return;
            }
        }
        else if (!alt_key && !shift_key && ctrl_key && keycode == 89) // 'y'
        {
            if (this._undostack)
            {
                this._undostack.redo();
                input_elem.stopSysEvent();
                return;
            }
        }

        return true;
    };

    _pEdit.on_keydown_basic_process = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        var input_elem = this._input_element;
        if (this._undostack && !input_elem.isComposing())
        {
            var pos = input_elem.getElementCaretPos();
            if (pos && pos != -1)
            {
                this._undostack.update(pos.begin, pos.end);
            }
        }

        return true;
    };

    _pEdit.on_keydown_basic_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        if (this._p_readonly || !this._isEnable())
        {
            return;
        }

        var input_elem = this._input_element;
        if (input_elem)
        {
            if (!this.on_keydown_basic_before_process.call(this, keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)) return;
            if (!this.on_keydown_basic_specialkey_process.call(this, keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)) return;

            this.on_keydown_basic_process.call(this, keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key);
        }
    };

    _pEdit.on_keydown_default_before_process = function (keycode)
    {
        return true;
    };

    _pEdit.on_keydown_default_specialkey_process = function (keycode)
    {
        var input_elem = this._input_element;
        var pos = input_elem.getElementCaretPos();

        // 일본어의 경우, keydown에서 keycode 알 수 없음
        if (keycode == nexacro.Event.KEY_RETURN) // 13
        {
            if (input_elem.isComposing())
            {
                input_elem.setCompositionComplete();
            }

            var pre_value = this._default_value;
            var pre_text = this._default_text;

            var cur_value = input_elem.value;
            var cur_text = cur_value ? cur_value : "";

            if (pre_value != cur_value)
            {
                if (!this._on_value_change(pre_text, pre_value, cur_text, cur_value))
                {
                    var cur_text_len = cur_text ? cur_text.length : 0;
                    var pre_text_len = pre_text ? pre_text.length : 0;
                    if (pos != -1)
                    {
                        if (cur_text_len - pre_text_len >= 0)
                            pos.begin = pos.end = pos.begin - (cur_text_len - pre_text_len);

                        if (pos.begin < 0)
                            pos.begin = pos.end = 0;
                    }

                    if (pos && pos != -1)
                        this._caret_pos = pos;

                    this._p_value = pre_value;
                    this._p_text = pre_text;

                    input_elem.setElementValue(pre_text);
                    input_elem.setElementSetSelect(this._caret_pos.begin, this._caret_pos.end);
                }
            }
        }
        return true;
    };

    _pEdit.on_keydown_default_process = function (keycode)
    {
        return true;
    };

    _pEdit.on_keydown_default_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        if (this._p_readonly || !this._isEnable())
        {
            return;
        }

        var input_elem = this._input_element;
        if (input_elem)
        {
            if (!this.on_keydown_default_before_process.call(this, keycode)) return;
            if (!this.on_keydown_default_specialkey_process.call(this, keycode)) return;

            this.on_keydown_default_process.call(this, keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key);

        }
    };

    _pEdit.on_keypress_basic_before_process = function (keycode, charcode, alt_key, ctrl_key/*, shift_key*/)
    {
        return true;
    };

    _pEdit.on_keypress_basic_specialkey_process = function (keycode, charcode, alt_key, ctrl_key/*, shift_key*/)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            if (keycode == nexacro.Event.KEY_TAB)
            {
                if (!this._getDlgCode().want_tab)
                {
                    input_elem.stopSysEvent();
                    return;
                }
            }

            if (keycode !== 0 && charcode === 0)
            {
                return 2;
            }
            else
            {
                // case :etc.. case by case
                if (keycode == nexacro.Event.KEY_ENTER || keycode == nexacro.Event.KEY_ESC)
                {
                    if (keycode == nexacro.Event.KEY_ENTER)
                    {
                        var view = nexacro.Component.prototype._getRootComponent.call(this, this._p_parent);
                        if (view)
                        {
                            view._p_parent._trigger_manager._notifyTrigger("Enter Key Press", this, view);
                        }
                    }
                    return 2;
                }
            }
        }
        return true;
    };

    _pEdit.on_keypress_basic_process = function (keycode, charcode, alt_key, ctrl_key/*, shift_key*/)
    {
        if (nexacro._OS == "iOS")
            return true;

        charcode = charcode || keycode;

        var input_elem = this._input_element;
        if (!ctrl_key && !alt_key && charcode)
        {
            var inputChar = String.fromCharCode(charcode);
            if (inputChar.length > 0 && this._isFilterChar(inputChar))
            {
                input_elem.stopSysEvent();
                return false;
            }
        }

        return true;
    };

    _pEdit.on_keypress_basic_action = function (keycode, charcode, alt_key, ctrl_key/*, shift_key*/)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            if (!this.on_keypress_basic_before_process.call(this, keycode, charcode, alt_key, ctrl_key)) return;
            var ret = this.on_keypress_basic_specialkey_process.call(this, keycode, charcode, alt_key, ctrl_key);
            if (!ret) return;
            else if (ret == 2) return true;

            if (!this.on_keypress_basic_process.call(this, keycode, charcode, alt_key, ctrl_key)) return false;
        }
    };

    _pEdit.on_beforekeyinput_basic_action = function (value, status, begin, end, inputType)
    {
        if (this._p_readonly || !this._isEnable())
        {
            return 0;
        }

        var input_elem = this._input_element;
        if (input_elem)
        {
            if (input_elem._use_event_beforeinput)
            {
                return this._beforeinput_process_with_HTMLEvent(value, status, begin, end, inputType);
            }
            else
            {
                return this._beforeinput_process_with_NexacroInputEvent(value, status, begin, end);
            }
        }
    };

    _pEdit.on_keyinput_basic_before_process = function (input_text)
    {
        return true;
    };

    _pEdit.on_keyinput_basic_process = function (input_text)
    {
        var input_elem = this._input_element;

        var input_value = input_elem.value === null ? undefined : input_elem.value;
        input_text = input_text === undefined ? input_elem._getInputValue() : input_text;

        if (input_elem && input_elem._is_sys_focused)
        {
            this._p_value = input_value;
            this._p_text = input_text;
        }
        else
        {
            this.set_value(input_value);
        }


        if (this._undostack && !input_elem.isComposing())
        {
            var pos = input_elem.getElementCaretPos();
            if (pos && pos != -1)
            {
                this._undostack.push(input_value, pos.begin, pos.end);
            }
            else
            {
                this._undostack.push(input_value, 0, 0);
            }
        }

        return true;
    };

    _pEdit.on_keyinput_basic_action = function (input_text)
    {
        if (this._p_readonly || !this._isEnable())
        {
            return false;
        }

        var input_elem = this._input_element;
        if (input_elem)
        {
            if (!this.on_keyinput_basic_before_process.call(this, input_text)) return false;
            if (!this.on_keyinput_basic_process.call(this, input_text)) return false;
        }

        this._updateAccessibilityLabel();

        return true;
    };

    _pEdit.on_killfocus_basic_process = function ()
    {
        var input_elem = this._input_element;
        var cur_text;
        if (!this._onlydisplay)
        {
            var pre_value = this._default_value;
            var pre_text = this._default_text;

            var cur_value = input_elem.value;
            cur_text = cur_value ? cur_value : "";

            var pos = input_elem.getElementCaretPos();
            if (pre_value != cur_value)
            {
                if (!this._processing_canchange)
                {
                    if (!this._on_value_change(pre_text, pre_value, cur_text, cur_value))
                    {
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

                        input_elem.setElementValue(pre_value);
                        input_elem.setElementSetSelect(this._caret_pos.begin, this._caret_pos.end);
                    }
                }
            }
            else
            {
                this._caret_pos = input_elem.getElementCaretPos();
            }

            if (nexacro._isNull(this._p_value))
            {
                this._changeUserStatus("nulltext", true);
            }

            // for killfocus
            if (this._env._p_enableaccessibility && nexacro._Browser == "Runtime" && this._env._a11ytype == 5)
            {
                this._setAccessibilityStatKillFocus();
            }

            var _win = this._getRootWindow();
            var idx = _win._indexOfCurrentFocusPaths(this);
            if (idx < 0)
            {
                input_elem.setElementBlur();
            }
        }
        else
        {
            if (nexacro._isNull(this._p_value))
            {
                this._changeUserStatus("nulltext", true);
            }
        }

        return true;
    };

    _pEdit.on_killfocus_basic_action = function (/*new_focus, new_refer_focus*/)
    {
        nexacro.Component.prototype.on_killfocus_basic_action.call(this);

        var input_elem = this._input_element;
        if (input_elem)
        {
            if (!this._onlydisplay)
            {
                var _sel = input_elem.getElementSelectionRange();
                if (_sel[0] == _sel[1])
                    input_elem._setElementLastSelectionRange();
            }

            if (!this.on_killfocus_basic_process.call(this)) return;
        }
    };

    _pEdit.on_fire_onkillfocus = function (obj, fromObj)
    {
        nexacro.Component.prototype.on_fire_onkillfocus.call(this, obj, fromObj);

        var input_elem = this._input_element;
        if (input_elem && input_elem._updateElementValue)
        {
            input_elem._updateElementValue(input_elem.value);
            this._setValue(input_elem.value === null ? undefined : input_elem.value);
        }
    };

    _pEdit.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
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

    _pEdit.on_fire_canchange = function (obj, pretext, prevalue, posttext, postvalue)
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

    _pEdit.on_fire_onchanged = function (obj, pretext, prevalue, posttext, postvalue)
    {
        if (this.onchanged && this.onchanged._has_handlers)
        {
            var evt = new nexacro.ChangeEventInfo(obj, "onchanged", pretext, prevalue, posttext, postvalue);
            return this.onchanged._fireEvent(this, evt);
        }
    };

    _pEdit.on_fire_oninput = function ()
    {
        if (this.oninput && this.oninput._has_handlers)
        {
            var evt = new nexacro.InputEventInfo(this, "oninput");
            return this.oninput._fireEvent(this, evt);
        }

        return true;
    };

    //===============================================================
    // nexacro.Edit : Logical Part
    //===============================================================
    _pEdit._convertValueType = function (v, bapplyrule)
    {
        var ret;
        if (bapplyrule)
            ret = nexacro.Component.prototype._convertValueType.call(this, v);
        else
            ret = nexacro._isNull(v) ? v : nexacro._toString(v);

        return ret;
    };

    _pEdit._setValue = function (v)
    {
        this._p_text = nexacro._toString(v);
        this._p_value = v;

        this.on_apply_value(v);
    };

    _pEdit._setReadonlyView = function (v)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            if (!this._onlydisplay)
            {
                input_elem.setElementReadonly(v);
            }
        }
    };

    _pEdit._setDefaultCaret = nexacro._emptyFn;

    _pEdit._setFocusToNextComponent = function ()
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

    _pEdit._isFilterChar = function (ch)
    {
        if (ch != "")
        {
            if (this._inputfilter_obj && this._inputfilter_obj.test(ch))
                return true;

            if (this._inputtype_obj && !this._inputtype_obj.test(ch))
                return true;
        }

        return false;
    };

    _pEdit.on_beforeinput_process_with_HTMLEvent = function (value, status, begin, end, inputType)
    {
        var input_elem = this._input_element;

        var update_value = value ? value.replace(/\r\n/g, "") : value;
        var input_value = input_elem._getInputValue();
        var update_value_len = update_value ? update_value.length : 0;
        var ret = [input_elem._BeforeinputState.PASS];

        if (inputType == "deleteContentForward" || inputType == "deleteByCut")
        {
            return ret;
        }
        else if (inputType == "deleteContentBackward")
        {
            if (this._ignore_deleteContentBackward)
            {
                this._ignore_deleteContentBackward = false;

                var pos = input_elem._last_selection_range;
                if (pos)
                {
                    input_elem.setElementSetSelect(pos[0], pos[1]);
                }
            }
            return ret;
        }

        if (this._inputtype_obj)
        {
            update_value = this._inputtype_obj.apply(update_value);
            if (value != update_value)
            {
                if (update_value && inputType == "insertFromPaste")
                {
                    update_value_len = update_value.length;
                    input_elem._beforeinput_result_data = update_value;
                    input_elem._beforeinput_result_pos = { begin: begin + update_value_len, end: begin + update_value_len };
                    ret.push(input_elem._BeforeinputState.REPLACE);
                }
                else
                {
                    if (inputType == "insertText" || inputType == "insertCompositionText")
                    {
                        this._ignore_deleteContentBackward = true;
                    }
                    else if (inputType == "insertLineBreak")
                    {
                        this._ignore_deleteContentBackward = false;
                    }
                    ret.push(input_elem._BeforeinputState.CANCEL);
                }
            }
            else
            {
                this._ignore_deleteContentBackward = false;
            }
        }

        if (this._inputfilter_obj)
        {
            update_value = this._inputfilter_obj.apply(update_value);
            if (value != update_value)
            {
                if (update_value && inputType == "insertFromPaste")
                {
                    update_value_len = update_value.length;
                    input_elem._beforeinput_result_data = update_value;
                    input_elem._beforeinput_result_pos = { begin: begin + update_value_len, end: begin + update_value_len };
                    ret.push(input_elem._BeforeinputState.REPLACE);
                }
                else
                {
                    if (inputType == "insertText" || inputType == "insertCompositionText")
                    {
                        this._ignore_deleteContentBackward = true;
                    }
                    else if (inputType == "insertLineBreak")
                    {
                        this._ignore_deleteContentBackward = false;
                    }
                    ret.push(input_elem._BeforeinputState.CANCEL);
                }
            }
            else
            {
                this._ignore_deleteContentBackward = false;
            }
        }

        if (inputType == "insertFromPaste")
        {
            if (update_value)
            {
                var maxlength = this._p_maxlength;
                update_value = update_value.replace(/\r\n/g, "");
                if (maxlength && begin + (input_value.length - end) + update_value_len > maxlength)
                {
                    update_value = update_value.substring(0, maxlength - (begin + input_value.length - end));
                }

                input_elem._beforeinput_result_insert_data = update_value;

                update_value_len = update_value.length;
                update_value = input_value.substring(0, begin) + update_value + input_value.substring(end);
                input_elem._beforeinput_result_data = update_value;
                input_elem._beforeinput_result_pos = { begin: begin + update_value_len, end: begin + update_value_len };
                ret.push(input_elem._BeforeinputState.REPLACE);
            }
        }

        if (status == 0 || status == 3)// && value != update_value)
        {
            if (update_value)
            {
                switch (this._p_inputmode)
                {
                    case "upper":
                        ret.push(input_elem._BeforeinputState.CONVERT_UPPER);
                        break;
                    case "lower":
                        ret.push(input_elem._BeforeinputState.CONVERT_LOWER);
                        break;
                }
            }
        }

        if (this._p_maxlength > 0 && (status == 0 || status == 3))
        {
            input_value = input_value ? input_value : input_elem._getInputValue();
            //if (inputType == "compositionend")
            //	input_value = input_value.substring(0, begin) + input_value.substring(end, input_value.length);
            //trace(input_value, update_value);
            var check = input_elem._checkMaxLength(input_value + (update_value ? update_value : ""), end);
            if (check && check.ismax)
            {
                ret.push(input_elem._BeforeinputState.MAXLENGTH);
            }
        }

        if (this._p_maxlength > 0 && (status == 1 || status == 2))
        {
            //var input_value = input_elem._getInputValue();
            input_value = input_value ? input_value : input_elem._getInputValue();
            if (begin != end)
                input_value = input_value.substring(0, begin);

            update_value = input_value + update_value;
            if (update_value.length > this._p_maxlength)
            {
                ret.push(input_elem._BeforeinputState.CANCEL);
                ret.push(input_elem._BeforeinputState.MAXLENGTH);
            }
        }
        // 93560 autoskip 기능으로 focus 이동 된 Edit에 input 발생시 input 처리 취소 (Chrome, Edge)       
        if (this._processing_autoskip)
        {
            var _win = this._getWindow();
            if (_win._keydown_element != input_elem)
            {
                this._processing_autoskip = false;
                if (this._default_value)
                {
                    // focus text가 있는 경우 유지 (새로운 IME에서 값을삭제하는버그가있음)
                    var focus_pos = this._caret_pos;
                    input_elem._beforeinput_result_data = this._default_value;
                    input_elem._beforeinput_result_pos = { begin: focus_pos.begin, end: focus_pos.end };
                    ret.push(input_elem._BeforeinputState.REPLACE);
                }
                else
                {
                    ret.push(input_elem._BeforeinputState.CANCEL);
                }
            }
        }

        return ret;
    };

    _pEdit._beforeinput_process_with_HTMLEvent = function (value, status, begin, end, inputType)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            return this.on_beforeinput_process_with_HTMLEvent.call(this, value, status, begin, end, inputType);
        }
    };

    _pEdit.on_beforeinput_process_with_NexacroInputEvent = function (value, status, begin, end)
    {
        var input_elem = this._input_element;
        var bPaste = input_elem._paste_caret_pos ? true : false;
        var pre_value = input_elem.value;
        var input_text = value.substring(begin, end);
        if (input_text)
        {
            var update_value = input_text;
            if (nexacro._is_hangul(update_value) || (status == nexacro._CompositionState.NONE || status == nexacro._CompositionState.END))
            {
                if (this._inputtype_obj)
                {
                    update_value = this._inputtype_obj.apply(update_value);
                }
                if (this._inputfilter_obj)
                {
                    update_value = this._inputfilter_obj.apply(update_value);
                }
                if (this._p_inputmode == "upper")
                {
                    update_value = update_value.toUpperCase();
                }
                else if (this._p_inputmode == "lower")
                {
                    update_value = update_value.toLowerCase();
                }
            }

            if (update_value != input_text)
            {
                if (!update_value)
                {
                    var pre_value_length = pre_value ? pre_value.length : 0;
                    var pos = begin + (input_text.length - (value.length - pre_value_length));
                    input_elem.updateElementText(pre_value, pos);
                }
                else
                {
                    input_elem.replaceElementText(update_value, begin, end);
                }
            }
        }
    };

    _pEdit._beforeinput_process_with_NexacroInputEvent = function (value, status, begin, end)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            this.on_beforeinput_process_with_NexacroInputEvent.call(this, value, status, begin, end);
        }
    };

    _pEdit._on_input_compositionend = function (value, _pos)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            if (this._undostack)
            {
                var pos = _pos ? _pos : input_elem.getElementCaretPos();
                if (pos && pos != -1)
                {
                    this._undostack.push(value, pos.begin, pos.end);
                }
                else
                {
                    this._undostack.push(value, 0, 0);
                }
            }
        }
    };

    _pEdit.on_apply_imeSet = function ()
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            var _locale = input_elem._imelocale.getLocale();
            var i, len;
            if (_locale && nexacro._cache_edit_set[_locale])
            {
                // 기존 ime에서 자체적으로 만든 함수, 변수 제거 해야함
                // clear함수 필요

                for (var prop in nexacro._cache_edit_set[_locale])
                {
                    this[prop] = nexacro._cache_edit_set[_locale][prop];
                }

                for (i = 0, len = nexacro._edit_user_override_func.length; i < len; i++)
                {
                    if (!nexacro._cache_edit_set[_locale][nexacro._edit_user_override_func[i]])
                        this[nexacro._edit_user_override_func[i]] = nexacro.Edit.prototype[nexacro._edit_user_override_func[i]];
                }
            }
            else
            {
                // 기존ime 정보 clear함수 필요

                for (i = 0, len = nexacro._edit_user_override_func.length; i < len; i++)
                {
                    this[nexacro._edit_user_override_func[i]] = nexacro.Edit.prototype[nexacro._edit_user_override_func[i]];
                }

            }
        }
    };

    _pEdit = null;
}

