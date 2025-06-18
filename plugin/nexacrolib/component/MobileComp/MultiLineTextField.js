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

if (!nexacro.MultiLineTextField)
{
    //==============================================================================
    // nexacro.MultiLineTextField 
    //==============================================================================
    nexacro.MultiLineTextField = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay)
    {
        nexacro.FieldBase.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._onlydisplay = onlydisplay;

        if (onlydisplay)
        {
            this._p_readonly = true;
        }

        this._focus_keep = null;
    };

    var _pMultiLineTextField = nexacro._createPrototype(nexacro.FieldBase, nexacro.MultiLineTextField);
    nexacro.MultiLineTextField.prototype = _pMultiLineTextField;

    var _pTextAreaPtype = nexacro.TextArea.prototype;

    _pMultiLineTextField._type_name = "MultiLineTextField";

    _pMultiLineTextField._boxcontrol_socket = {
        instance_name: "MultiLineTextFieldBox",
        id: "box"
    };

    nexacro.MultiLineTextField._TAB_CHAR = nexacro.TextArea._TAB_CHAR; // '\t'

    /* default properties */
    _pMultiLineTextField._p_acceptstab = false;
    _pMultiLineTextField._p_text = "";
    _pMultiLineTextField._p_value = undefined;
    _pMultiLineTextField._p_autoselect = false;
    _pMultiLineTextField._p_autoskip = false;
    _pMultiLineTextField._p_readonly = false;
    _pMultiLineTextField._p_dragscrolltype = "both";
    _pMultiLineTextField._p_maxlength = 0;

    _pMultiLineTextField._initsoftkeyboard = undefined;
    _pMultiLineTextField._p_usesoftkeyboard = true;

    _pMultiLineTextField._p_scrollbarsize = undefined;

    _pMultiLineTextField._p_usecontextmenu = true;

    _pMultiLineTextField._properties = [
        { name: "acceptstab" },
        { name: "text", readonly: true },
        { name: "value" },
        { name: "scrollbarsize" },
        { name: "scrollbarbarminsize" },
        { name: "scrollbarbaroutsize" },
        { name: "scrollbardecbuttonsize" },
        { name: "scrollbarincbuttonsize" },
        { name: "scrollbartrackbarsize" },
        { name: "scrollindicatorsize" },
        { name: "dragscrolltype" },
        { name: "autoselect" },
        { name: "autoskip" },
        { name: "readonly" },
        { name: "scrollbartype" },
        { name: "cursor" },
        { name: "maxlength" },
        { name: "usesoftkeyboard" },
        { name: "usecontextmenu" }
    ];

    /* internal variable */
    _pMultiLineTextField._use_container_move = false;
    _pMultiLineTextField._not_use_scrollTop = true; // container scroll
    _pMultiLineTextField._input_element = null;   // default : InputElement ,Grid display-mode : TextBoxElement
    _pMultiLineTextField._undostack = null;
    _pMultiLineTextField._is_undo = false;

    _pMultiLineTextField._default_value = undefined;
    _pMultiLineTextField._default_text = "";
    _pMultiLineTextField._keypad_type = "text";
    _pMultiLineTextField._imedisable = false;

    _pMultiLineTextField._processing_updateToDataset = false;
    _pMultiLineTextField._result_updateToDataset = true;
    _pMultiLineTextField._processing_canchange = false;

    _pMultiLineTextField._onlydisplay = false;
    _pMultiLineTextField._apply_client_padding = false;
    _pMultiLineTextField._has_inputElement = true;
    _pMultiLineTextField._change_value = false;
    _pMultiLineTextField._update_scroll_lock = false;

    /* status */
    _pMultiLineTextField._is_simple_control = true;
    _pMultiLineTextField._is_editable_control = true;
    _pMultiLineTextField._use_readonly_status = true;


    _pMultiLineTextField._caret_pos = -1;

    /*
    if (nexacro._Browser == "IE" || nexacro._Browser == "Runtime")
        _pMultiLineTextField._set_node_value = false;
    else
        _pMultiLineTextField._set_node_value = true;


    /* event list */
    _pMultiLineTextField._event_list = {
        "oneditclick": 1,
        "onkeydown": 1, "onkeyup": 1,
        "onkillfocus": 1, "onsetfocus": 1,
        "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1, "onmousedown": 1, "onmouseup": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1,
        "onmove": 1, "onsize": 1,
        "canchange": 1, "onchanged": 1, "oninput": 1,
        "onmousewheel": 1, "oncontextmenu": 1,
        "onvscroll": 1, "onhscroll": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1, "ondevicebuttonup": 1
    };

    /* accessibility */
    _pMultiLineTextField.accessibilityrole = "edit";

    //===============================================================
    // nexacro.MultiLineTextField : Create & Destroy & Update
    //===============================================================
    _pMultiLineTextField.on_create_contents = function ()
    {
        nexacro.FieldBase.prototype.on_create_contents.call(this);

        var input_elem = this._input_element = this._getInputElement();

        if (!this._onlydisplay)
        {
            input_elem.setElementAutoSelect(this._p_autoselect);
            input_elem.setElementReadonly(this._p_readonly);
            input_elem.setElementMaxLength(this._p_maxlength);
            input_elem.setElementInputMode(this._keypad_type);
            input_elem.setElementAutoSkip(this._p_autoskip);
        }

        input_elem.setElementTextDecoration(this._textdecoration);
        input_elem.setElementTextAlign(this._p_textAlign);

        if (this._padding)
            input_elem.setElementPadding(this._padding);

        var wordwrap_info = this._getCSSStyleValue("wordWrap");
        if (wordwrap_info)
            input_elem.setElementCSSMapInfo(wordwrap_info);

        if (this._p_wordWrap)
            input_elem.setElementWordWrap(this._p_wordWrap);

        this._undostack = new nexacro._EditUndoStack(this);

        this.on_apply_scrollbartype();
        this.on_apply_scrolltype();
        this.on_apply_scrollbarsize();
        this.on_apply_scrollbarbarminsize();
        this.on_apply_scrollbarbaroutsize();
        this.on_apply_scrollbardecbuttonsize();
        this.on_apply_scrollbarincbuttonsize();
        this.on_apply_scrollbartrackbarsize();
        this.on_apply_scrollindicatorsize();
    };

    _pMultiLineTextField.on_created_contents = function (win)
    {
        var input_elem = this._getInputElement();
        if (input_elem)
        {
            var wordwrap_info = this._p_wordWrap || this._getCSSStyleValue("wordWrap");
            if (this._hscrollbartype && this._hscrollbartype.indexOf("auto") > -1 && (wordwrap_info != "none" && wordwrap_info !== undefined))
                this._hscrollbartype = "none";

            this.on_apply_padding(this._padding);
            this.on_apply_value(this._p_value);

            if (this._env._p_enableaccessibility)
            {
                if (this._p_readonly)
                    this._setAccessibilityFlagReadOnly(this._p_readonly);
                this._setAccessibilityFlagMultiLine(true);
            }

            this.on_apply_scrollbartype();
            this._onRecalcScrollSize();
            this._onResetScrollBar();
        }
        nexacro.FieldBase.prototype.on_created_contents.call(this, win);
    };

    _pMultiLineTextField.on_destroy_contents = function ()
    {
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

        var inputtypeobj = this._inputtype_obj;
        if (inputtypeobj)
            this._inputtype_obj = null;

        this._input_element = null;
    };

    _pMultiLineTextField.on_create_contents_command = function ()
    {
        var wordwrap_info = this._p_wordWrap || this._getCSSStyleValue("wordWrap");
        if (this._hscrollbartype && this._hscrollbartype.indexOf("auto") > -1 && (wordwrap_info != "none" && wordwrap_info !== undefined))
            this._hscrollbartype = "none";

        this.on_apply_padding(this._padding);
        this.on_apply_value(this._p_value);

        return nexacro.FieldBase.prototype.on_create_contents_command.call(this);
    };

    _pMultiLineTextField.on_after_created_ext = function ()
    {
        this._setEventHandlerToBox();
        this.LabelFor(this._getInputElement());

        if (this._env._p_enableaccessibility)
        {
            if (this._p_readonly)
                this._setAccessibilityFlagReadOnly(this._p_readonly);
            this._setAccessibilityFlagMultiLine(true);
        }

        this.on_apply_scrollbartype();
        this._onRecalcScrollSize();
        this._onResetScrollBar();

        this.on_apply_readonly();
    };

    _pMultiLineTextField._setEventHandlerToBox = function ()
    {
        var box = this._box;

        if (box)
            box._setEventHandler("oninput", this.on_fire_oninput, this);
    };

    _pMultiLineTextField._getInputElement = function ()
    {
        return this._box ? this._box._input_element : null;
    };

    _pMultiLineTextField._setDefaultCaret = nexacro._emptyFn;

    //===============================================================
    // nexacro.MultiLineTextField : Override
    //===============================================================
    _pMultiLineTextField._apply_setfocus = function (evt_name, self_flag)    // compbase logical func
    {
        this._processing_updateToDataset = false;

        var input_elem = this._getInputElement();
        if (input_elem)
        {
            if (!this._onlydisplay)
            {
                input_elem.on_apply_imeSet();
                input_elem.on_apply_force_imeSet();

                this._want_tab = true;
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

                //              if (this._env._p_enableaccessibility && evt_name != "tabkey" && evt_name != "shifttabkey" && !this._isComponentKeydownAction())
                //                  nexacro._notifyAccessibilityInputElement(this._getAccessibilityReadLabel());

                var win = this._getWindow();
                if (win)
                {
                    var ldown_comp = win._cur_ldown_elem ? win._cur_ldown_elem.linkedcontrol : null;
                    if (!(ldown_comp && ldown_comp instanceof nexacro.ScrollBarControl))
                    {
                        input_elem.setElementFocus(evt_name, self_flag);
                    }
                }

                var text = input_elem.getElementText();
                if (text != this._p_text)
                {
                    this._default_text = this._p_text = text;
                }

                if (nexacro._needAdjustScrollPosition(this._is_set_value))
                {
                    this._adjust_scrollPosition(input_elem, evt_name);
                }
            }
            else
            {
                this._want_tab = true;

                if (evt_name)
                {
                    this._default_value = this._p_value;
                    this._default_text = this._p_text;
                }

                if (nexacro._needAdjustScrollPosition(this._is_set_value))
                    this._adjust_scrollPosition(input_elem, evt_name);
            }
        }
    };

    _pMultiLineTextField.on_change_bindSource = function (propid, ds, row, col)
    {
        if (propid == "value")
        {
            var input_elem = this._getInputElement();

            var v = ds.getColumn(row, col);
            v = this._convertValueType(v, true);

            if (v == this._p_value)
            {
                return;
            }

            if (this._undostack)
            {
                this._undostack.clear();
            }

            var _bSetselect = false;
            if (this._p_value != v)
            {
                _bSetselect = true;
            }

            this._setValue(v, true);

            if (input_elem && _bSetselect && !this._onlydisplay)
            {
                input_elem.setElementSetSelect(this._p_value ? this._p_value.length : 0);

                this._caret_pos = input_elem.getElementCaretPos();
            }
        }
    };

    _pMultiLineTextField.on_apply_prop_enable = function (v)
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

    _pMultiLineTextField.on_apply_status = _pTextAreaPtype.on_apply_status;
    _pMultiLineTextField._getDlgCode = _pTextAreaPtype._getDlgCode;
    _pMultiLineTextField.on_getBindableProperties = _pTextAreaPtype.on_getBindableProperties;
    _pMultiLineTextField.on_init_bindSource = _pTextAreaPtype.on_init_bindSource;
    _pMultiLineTextField.on_changeUserStatus = _pTextAreaPtype.on_changeUserStatus;
    _pMultiLineTextField._getDlgCode = _pTextAreaPtype._getDlgCode;
    _pMultiLineTextField._getDragData = _pTextAreaPtype._getDragData;

    //===============================================================
    // nexacro.TextArea : Properties
    //===============================================================
    _pMultiLineTextField.set_text = nexacro._emptyFn;
    _pMultiLineTextField.set_value = _pTextAreaPtype.set_value;

    _pMultiLineTextField.on_apply_value = function (value)
    {
        var input_elem = this._getInputElement();
        if (input_elem)
        {
            var pos = input_elem.getElementCaretPos();
            var text = this._p_text;
            value = value ? this._p_text : value;

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

            if (this._is_created)
            {
                this._onRecalcScrollSize();
                this._onResetScrollBar();
            }

            pos = input_elem.getElementCaretPos();
            if (pos && pos != -1)
            {
                this._caret_pos = pos;
            }
            else
            {
                this._change_value = this._is_created ? true : false;
            }

            this._is_set_value = true;

            if (!this._isFocused())
                this._setLabelFloating(this._isContainsText(), undefined, true);

            this._refreshLabel("value");
            this._setCharCount(this._p_text.length, this._p_maxlength);
        }
    };

    _pMultiLineTextField._isContainsText = function ()
    {
        if (this._p_displaynulltext)
            return true;

        return (this.value != null);
    };

    _pMultiLineTextField.on_apply_readonly = function ()
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

    _pMultiLineTextField.on_apply_scrollbartype = function ()
    {
        if (this._box)
            this._box.set_scrollbartype(this._p_scrollbartype);
    };

    _pMultiLineTextField.on_apply_scrolltype = function ()
    {
        if (this._box)
            this._box.set_scrolltype(this._p_scrolltype);
    };
    _pMultiLineTextField.set_scrollbarsize = function (scrollbarsize)
    {
        if (scrollbarsize !== undefined)
        {
            scrollbarsize = parseInt(scrollbarsize);
            if (isNaN(scrollbarsize))
                return;
        }

        if (this._p_scrollbarsize != scrollbarsize)
        {
            this._p_scrollbarsize = scrollbarsize;
            this.on_apply_scrollbarsize();
        }
    };

    _pMultiLineTextField.on_apply_scrollbarsize = function ()
    {
        if (this._box)
            this._box.set_scrollbarsize(this._p_scrollbarsize);
    };

    _pMultiLineTextField.set_scrollbarbarminsize = function (scrollbarbarminsize)
    {
        if (scrollbarbarminsize !== undefined)
        {
            scrollbarbarminsize = parseInt(scrollbarbarminsize);
            if (isNaN(scrollbarbarminsize))
                return;
        }

        this._p_scrollbarbarminsize = scrollbarbarminsize;
        this.on_apply_scrollbarbarminsize();
    };

    _pMultiLineTextField.on_apply_scrollbarbarminsize = function ()
    {
        if (this._box)
            this._box.set_scrollbarbarminsize(this._p_scrollbarbarminsize);
    };

    _pMultiLineTextField.set_scrollbarbaroutsize = function (scrollbarbaroutsize)
    {
        if (scrollbarbaroutsize !== undefined)
        {
            scrollbarbaroutsize = parseInt(scrollbarbaroutsize);
            if (isNaN(scrollbarbaroutsize))
                return;
        }

        this._p_scrollbarbaroutsize = scrollbarbaroutsize;
        this.on_apply_scrollbarbaroutsize();
    };

    _pMultiLineTextField.on_apply_scrollbarbaroutsize = function ()
    {
        if (this._box)
            this._box.set_scrollbarbaroutsize(this._p_scrollbarbaroutsize);
    };

    _pMultiLineTextField.set_scrollbardecbuttonsize = function (scrollbardecbuttonsize)
    {
        if (scrollbardecbuttonsize !== undefined)
        {
            scrollbardecbuttonsize = parseInt(scrollbardecbuttonsize);
            if (isNaN(scrollbardecbuttonsize))
                return;
        }

        this._p_scrollbardecbuttonsize = scrollbardecbuttonsize;
        this.on_apply_scrollbardecbuttonsize();
    };

    _pMultiLineTextField.on_apply_scrollbardecbuttonsize = function ()
    {
        if (this._box)
            this._box.set_scrollbardecbuttonsize(this._p_scrollbardecbuttonsize);
    };

    _pMultiLineTextField.set_scrollbarincbuttonsize = function (scrollbarincbuttonsize)
    {
        if (scrollbarincbuttonsize !== undefined)
        {
            //var scrollbarbaroutsize = parseInt(scrollbarincbuttonsize);
            if (isNaN(scrollbarincbuttonsize))
                return;
        }

        this._p_scrollbarincbuttonsize = scrollbarincbuttonsize;
        this.on_apply_scrollbarincbuttonsize();
    };

    _pMultiLineTextField.on_apply_scrollbarincbuttonsize = function ()
    {
        if (this._box)
            this._box.set_scrollbarincbuttonsize(this._p_scrollbarincbuttonsize);
    };

    _pMultiLineTextField.set_scrollbarbaroutsize = function (scrollbarbaroutsize)
    {
        if (scrollbarbaroutsize !== undefined)
        {
            scrollbarbaroutsize = parseInt(scrollbarbaroutsize);
            if (isNaN(scrollbarbaroutsize))
                return;
        }

        if (this._p_scrollbarbaroutsize != scrollbarbaroutsize)
        {
            this._p_scrollbarbaroutsize = scrollbarbaroutsize;
            this.on_apply_scrollbarbaroutsize();
        }
    };

    _pMultiLineTextField.on_apply_scrollbarbaroutsize = function ()
    {
        if (this._box)
            this._box.set_scrollbarbaroutsize(this._p_scrollbarbaroutsize);
    };

    _pMultiLineTextField.set_scrollbartrackbarsize = function (scrollbartrackbarsize)
    {
        if (scrollbartrackbarsize !== undefined)
        {
            scrollbartrackbarsize = parseInt(scrollbartrackbarsize);
            if (isNaN(scrollbartrackbarsize))
                return;
        }

        this._p_scrollbartrackbarsize = scrollbartrackbarsize;
        this.on_apply_scrollbartrackbarsize();
    };

    _pMultiLineTextField.on_apply_scrollbartrackbarsize = function ()
    {
        if (this._box)
            this._box.set_scrollbartrackbarsize(this._p_scrollbartrackbarsize);
    };

    _pMultiLineTextField.set_scrollindicatorsize = function (scrollindicatorsize)
    {
        if (scrollindicatorsize !== undefined)
        {
            scrollindicatorsize = parseInt(scrollindicatorsize);
            if (isNaN(scrollindicatorsize))
                return;
        }

        this._p_scrollindicatorsize = scrollindicatorsize;
        this.on_apply_scrollindicatorsize();
    };

    _pMultiLineTextField.on_apply_scrollindicatorsize = function ()
    {
        if (this._box)
            this._box.set_scrollindicatorsize(this._p_scrollindicatorsize);
    };

    _pMultiLineTextField.set_dragscrolltype = function (v)
    {
        var dragscrolltype_enum = ["none", "vert", "horz", "both", "all"];
        if (dragscrolltype_enum.indexOf(v) == -1)
        {
            return;
        }

        this._p_dragscrolltype = v;

        if (this._box)
            this._box.set_dragscrolltype(v);
    };

    _pMultiLineTextField.set_maxlength = function (v)
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

    _pMultiLineTextField.on_apply_maxlength = function (maxlength)
    {
        var input_elem = this._getInputElement();
        if (input_elem && !this._onlydisplay)
        {
            input_elem.setElementMaxLength(maxlength);

            var text = input_elem.value;
            this._setCharCount(!text ? 0 : text.length, this._p_maxlength);
        }
    };

    _pMultiLineTextField.set_readonly = _pTextAreaPtype.set_readonly;
    _pMultiLineTextField.set_autoselect = _pTextAreaPtype.set_autoselect;
    _pMultiLineTextField.on_apply_autoselect = _pTextAreaPtype.on_apply_autoselect;
    //_pMultiLineTextField.set_autoskip               = _pTextAreaPtype.set_autoskip;
    //_pMultiLineTextField.on_apply_autoskip          = nexacro._emptyFn;
    _pMultiLineTextField.set_usecontextmenu = _pTextAreaPtype.set_usecontextmenu;
    _pMultiLineTextField.on_apply_wordWrap = _pTextAreaPtype.on_apply_wordWrap;
    _pMultiLineTextField.set_scrollbartype = _pTextAreaPtype.set_scrollbartype;
    _pMultiLineTextField.set_acceptstab = _pTextAreaPtype.set_acceptstab;
    _pMultiLineTextField.set_cursor = _pTextAreaPtype.set_cursor;

    /* 지원 안함.
    _pMultiLineTextField.on_apply_textAlign         = _pTextAreaPtype.on_apply_textAlign;
    _pMultiLineTextField.on_apply_padding           = _pTextAreaPtype.on_apply_padding;
    _pMultiLineTextField.on_apply_textDecoration = _pTextAreaPtype.on_apply_textDecoration;
    */
    _pMultiLineTextField.on_apply_textAlign = nexacro._emptyFn;
    _pMultiLineTextField.on_apply_padding = nexacro._emptyFn;
    _pMultiLineTextField.on_apply_textDecoration = nexacro._emptyFn;

    //===============================================================
    // nexacro.TextArea : Methods
    //===============================================================

    _pMultiLineTextField.getLength = _pTextAreaPtype.getLength;
    _pMultiLineTextField.getCaretPos = _pTextAreaPtype.getCaretPos;
    _pMultiLineTextField.setCaretPos = _pTextAreaPtype.setCaretPos;
    _pMultiLineTextField.getSelect = _pTextAreaPtype.getSelect;
    _pMultiLineTextField.setSelect = _pTextAreaPtype.setSelect;
    _pMultiLineTextField.getSelectedText = _pTextAreaPtype.getSelectedText;
    _pMultiLineTextField.setSelectedText = _pTextAreaPtype.setSelectedText;
    _pMultiLineTextField.insertText = _pTextAreaPtype.insertText;
    _pMultiLineTextField.deleteText = _pTextAreaPtype.deleteText;
    _pMultiLineTextField.replace = _pTextAreaPtype.replace;
    _pMultiLineTextField.updateToDataset = _pTextAreaPtype.updateToDataset;
    _pMultiLineTextField.find = _pTextAreaPtype.find;

    _pMultiLineTextField._on_getDisplayText = function ()
    {
        return this._p_text;
    };

    //===============================================================
    // nexacro.TextArea : Event Handlers
    //===============================================================
    _pMultiLineTextField.on_input_focus = function () { };

    _pMultiLineTextField.on_input_compositionend = function ()
    {
        var input_element = this._getInputElement();
        var v = input_element.value;

        if (this._p_maxlength > 0 && v)
        {
            var is_go = v.length >= this._p_maxlength;
            if (this._p_autoskip && is_go)
            {
                nexacro._OnceCallbackTimer.callonce(this, function ()
                {
                    this._setFocusToNextComponent();
                });
            }
        }
    };

    _pMultiLineTextField.on_fire_onsetfocus = function (oldobj, oldreferobj, from_comp, from_refer_comp, from_input)
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
                if (!this._focus_keep)
                    return false;

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

    _pMultiLineTextField._cancelValue = function ()
    {
        this._setValue(this._default_value);
    };

    _pMultiLineTextField._on_deactivate = function ()
    {
        this._focus_keep = null;
        nexacro.Component.prototype._on_deactivate.call(this);
        this.on_deactivate_process.call(this);
    };

    _pMultiLineTextField.on_deactivate_process = _pTextAreaPtype.on_deactivate_process;

    //--------- WRE ----------------------------------------------------------------------------------------------------------------
    if (nexacro._Browser != "Runtime")
    {
        _pMultiLineTextField._confirmValue = function ()
        {
            if (this._onlydisplay)
                return;

            var input_elem = this._getInputElement();
            var pre_value = this._default_value;
            var pre_text = this._default_text;
            var cur_value = input_elem.value;

            if (pre_value != cur_value)
            {
                if (this._p_maxlength > 0)
                {
                    if (cur_value && cur_value.length > this._p_maxlength)
                    {
                        cur_value = cur_value.substr(0, this._p_maxlength);
                        if (cur_value != input_elem.value)
                            input_elem.setElementValue(cur_value);
                    }
                }
            }

            var cur_text = cur_value ? cur_value : "";

            if (pre_value != cur_value)
            {
                if (!this._on_value_change(pre_text, pre_value, cur_text, cur_value))
                {
                    this._p_value = pre_value;
                    this._p_text = pre_text;

                    input_elem.setElementValue(pre_value);
                    input_elem.setElementSetSelect(this._caret_pos.begin, this._caret_pos.end);
                }

                if (input_elem && input_elem._updateElementValue)
                {
                    input_elem._updateElementValue(input_elem.value);
                    this._setValue(input_elem.value === null ? undefined : input_elem.value, true);
                }
            }
            this._caret_pos = input_elem.getElementCaretPos();
        };

        _pMultiLineTextField.on_fire_onkillfocus = function (obj, fromObj)
        {
            this._confirmValue();

            if (!this._onlydisplay)
            {
                var input_elem = this._getInputElement();
                if (nexacro._isNull(this._p_value))
                {
                    this._changeUserStatus("nulltext", true);
                }
                this._adjust_scrollPosition(input_elem);
                var _win = this._getRootWindow();
                var idx = _win._indexOfCurrentFocusPaths(this);
                if (idx < 0)
                {
                    input_elem.setElementBlur();
                }
            }

            nexacro.Component.prototype.on_fire_onkillfocus.call(this, obj, fromObj);
            this._focus_keep = null;
            this._input_physical_focused = false;
        };

        _pMultiLineTextField.on_keydown_default_process = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
        {
            if (nexacro._OS == "Mac OS" || nexacro._OS == "OSX" || nexacro._OS == "iOS")
                ctrl_key = meta_key;

            if (this._p_readonly || !this._isEnable())
                return;

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
        };

        _pMultiLineTextField.on_killfocus_basic_action = function (new_focus, new_refer_focus)
        {
            nexacro.FieldBase.prototype.on_killfocus_basic_action.call(this);

            var input_elem = this._input_element;
            if (input_elem)
            {
                if (!this._onlydisplay)
                {
                    var _sel = input_elem.getElementSelectionRange();
                    if (_sel[0] == _sel[1])
                    {
                        input_elem._setElementLastSelectionRange();
                    }
                }
            }
        };
    }
    //--------- NRE ----------------------------------------------------------------------------------------------------------------
    else
    {
        _pMultiLineTextField.on_keyup_basic_before_process = _pTextAreaPtype.on_keyup_basic_before_process;
        _pMultiLineTextField.on_keyup_basic_specialkey_process = _pTextAreaPtype.on_keyup_basic_specialkey_process;
        _pMultiLineTextField.on_keyup_default_process = _pTextAreaPtype.on_keyup_default_process;
        _pMultiLineTextField.on_keyup_default_action = _pTextAreaPtype.on_keyup_default_action;
        _pMultiLineTextField.on_keypress_basic_before_process = _pTextAreaPtype.on_keypress_basic_before_process;
        _pMultiLineTextField.on_keypress_basic_specialkey_process = _pTextAreaPtype.on_keypress_basic_specialkey_process;

        _pMultiLineTextField.on_fire_onkillfocus = function (obj, fromObj)
        {
            nexacro.Component.prototype.on_fire_onkillfocus.call(this, obj, fromObj);

            var input_elem = this._input_element;
            if (input_elem && input_elem._updateElementValue && !this._onlydisplay)
            {
                input_elem._updateElementValue(input_elem.value);
                this._setValue(input_elem.value === null ? undefined : input_elem.value);
            }
            this._focus_keep = null;
            this._input_physical_focused = false;
        };

        _pMultiLineTextField.on_keydown_default_process = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
        {
            if (this._p_readonly || !this._isEnable())
                return;

            if (keycode == nexacro.Event.KEY_ESC)
            {
                if (this._is_use_esc_cancelvalue)
                {
                    this._cancelValue();
                    return true;
                }
            }
        };

        _pMultiLineTextField.on_killfocus_basic_action = function (new_focus, new_refer_focus)
        {
            nexacro.FieldBase.prototype.on_killfocus_basic_action.call(this);
            nexacro.TextArea.prototype.on_killfocus_basic_action.call(this);
        };
    }

    // TextArea undo redo
    _pMultiLineTextField._on_input_undo = _pTextAreaPtype._on_input_undo;
    _pMultiLineTextField._on_input_redo = _pTextAreaPtype._on_input_redo;

    // TextArea keydown basic action
    _pMultiLineTextField.on_keydown_basic_before_process = _pTextAreaPtype.on_keydown_basic_before_process;
    _pMultiLineTextField.on_keydown_basic_specialkey_process = _pTextAreaPtype.on_keydown_basic_specialkey_process;
    _pMultiLineTextField.on_keydown_basic_process = _pTextAreaPtype.on_keydown_basic_process;
    _pMultiLineTextField.on_keydown_basic_action = _pTextAreaPtype.on_keydown_basic_action;

    // TextArea keydown default action
    _pMultiLineTextField.on_keydown_default_specialkey_process = _pTextAreaPtype.on_keydown_default_specialkey_process;
    _pMultiLineTextField.on_keydown_default_before_process = _pTextAreaPtype.on_keydown_default_before_process;
    _pMultiLineTextField.on_keydown_default_action = _pTextAreaPtype.on_keydown_default_action;

    // TextArea keyinput basic action
    _pMultiLineTextField.on_keyinput_basic_before_process = _pTextAreaPtype.on_keyinput_basic_before_process;
    _pMultiLineTextField.on_keyinput_basic_process = _pTextAreaPtype.on_keyinput_basic_process;
    _pMultiLineTextField.on_keyinput_basic_action = _pTextAreaPtype.on_keyinput_basic_action;

    // TextArea beforekeyinput basic action
    _pMultiLineTextField._beforeinput_process_with_NexacroInputEvent = _pTextAreaPtype._beforeinput_process_with_NexacroInputEvent;
    _pMultiLineTextField.on_beforeinput_process_with_NexacroInputEvent = _pTextAreaPtype.on_beforeinput_process_with_NexacroInputEvent;
    _pMultiLineTextField.on_beforekeyinput_basic_action = _pTextAreaPtype.on_beforekeyinput_basic_action;

    // TextArea input filter
    _pMultiLineTextField._isFilterChar = _pTextAreaPtype._isFilterChar;

    _pMultiLineTextField._on_value_change = _pTextAreaPtype._on_value_change;
    _pMultiLineTextField.on_click_basic_action = _pTextAreaPtype.on_click_basic_action;
    _pMultiLineTextField.on_fire_onclick = _pTextAreaPtype.on_fire_onclick;
    _pMultiLineTextField.on_fire_canchange = _pTextAreaPtype.on_fire_canchange;
    _pMultiLineTextField.on_fire_onchanged = _pTextAreaPtype.on_fire_onchanged;
    _pMultiLineTextField._convertValueType = _pTextAreaPtype._convertValueType;
    _pMultiLineTextField._setValue = _pTextAreaPtype._setValue;
    _pMultiLineTextField._on_input_compositionend = _pTextAreaPtype._on_input_compositionend;
    _pMultiLineTextField.on_killfocus_basic_process = _pTextAreaPtype.on_killfocus_basic_process;

    _pMultiLineTextField._adjust_scrollPosition = function (input_elem, evt_name)
    {
        return this._box._adjust_scrollPosition(input_elem, evt_name);
    };

    _pMultiLineTextField._setFocusToNextComponent = function ()
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

    _pMultiLineTextField.on_fire_oninput = function ()
    {
        var input_element = this._getInputElement();
        var v = input_element.value;
        //var go_next = false;

        if (this._p_autoskip && this._p_maxlength > 0 && v)
        {
            if (!input_element.isComposing() && v.length >= this._p_maxlength)
            {
                v = v.substr(0, this._p_maxlength);
                //go_next = true;
            }
        }

        if (v != input_element.value)
            input_element.setElementValue(v);

        var text = input_element.value;

        this._setCharCount(!text ? 0 : text.length, this._p_maxlength);

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

    _pMultiLineTextField.on_apply_imeSet = function ()
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            var i, len;
            var _locale = input_elem._imelocale.getLocale();
            if (_locale && nexacro._cache_multilinetextfield_set[_locale])
            {
                // 기존 ime에서 자체적으로 만든 함수, 변수 제거 해야함
                // clear함수 필요

                for (var prop in nexacro._cache_multilinetextfield_set[_locale])
                {
                    this[prop] = nexacro._cache_multilinetextfield_set[_locale][prop];
                }

                for (i = 0, len = nexacro._edit_user_override_func.length; i < len; i++)
                {
                    if (!nexacro._cache_multilinetextfield_set[_locale][nexacro._edit_user_override_func[i]])
                        this[nexacro._edit_user_override_func[i]] = nexacro.MultiLineTextField.prototype[nexacro._edit_user_override_func[i]];
                }
            }
            else
            {
                // 기존ime 정보 clear함수 필요

                for (i = 0, len = nexacro._edit_user_override_func.length; i < len; i++)
                {
                    this[nexacro._edit_user_override_func[i]] = nexacro.MultiLineTextField.prototype[nexacro._edit_user_override_func[i]];
                }

            }
        }
    };

    //===============================================================
    // nexacro.MultiLineTextFieldBox
    //===============================================================
    nexacro.MultiLineTextFieldBox = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.FieldBaseScrollableBox.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._onlydisplay = this._p_parent._onlydisplay;

        if (this._onlydisplay)
        {
            this._p_readonly = true;
        }
    };

    var _pMultiLineTextFieldBox = nexacro._createPrototype(nexacro.FieldBaseScrollableBox, nexacro.MultiLineTextFieldBox);
    nexacro.MultiLineTextFieldBox.prototype = _pMultiLineTextFieldBox;

    _pMultiLineTextFieldBox._type_name = "MultiLineTextFieldBox";

    _pMultiLineTextFieldBox._use_container_move = false;
    _pMultiLineTextFieldBox._apply_client_padding = false;
    _pMultiLineTextFieldBox._use_readonly_status = true;
    _pMultiLineTextFieldBox._input_element = null;   // default : InputElement ,display-mode : TextBoxElement

    _pMultiLineTextFieldBox._p_dragscrolltype = "both";

    _pMultiLineTextFieldBox.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var input_elem;
            if (!this._onlydisplay)
            {
                input_elem = new nexacro.SimpleTextAreaElement(control_elem, "simpletextarea");
                input_elem._use_accessibility_label = false;
            }
            else
            {
                input_elem = new nexacro.TextBoxElement(control_elem, "simpletextarea");
                input_elem.setElementVerticalAlign("top");
                input_elem.setElementFlexGrow(1);
                input_elem.setElementValue = input_elem.setElementText;
                input_elem._use_style_padding = true;
                input_elem._getInputValue = function ()
                {
                    return this._p_text;
                };
                input_elem.setElementHScrollPos = function () { };
                input_elem.setElementVScrollPos = function () { };

                var padding = this._getCurrentStylePadding();
                if (padding)
                    input_elem.setElementPadding(padding);
            }

            this._input_element = input_elem;
            this._recalc_box();
        }
    };

    _pMultiLineTextFieldBox.on_created_contents = function (win)
    {
        this._input_element.create(win);
    };

    _pMultiLineTextFieldBox.on_create_contents_command = function ()
    {
        return this._input_element.createCommand();
    };

    _pMultiLineTextFieldBox.on_attach_contents_handle = function (win)
    {
        this._input_element.attachHandle(win);
        if (this._env._p_enableaccessibility)
        {
            if (this._p_readonly)
                this._setAccessibilityFlagReadOnly(this._p_readonly);
            this._setAccessibilityFlagMultiLine(true);
        }

        this.on_apply_scrollbartype();
        this._onRecalcScrollSize();
        this._onResetScrollBar();
    };

    _pMultiLineTextFieldBox.on_destroy_contents = function ()
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            input_elem.destroy();
            this._input_element = null;
        }

        //AnimationFrame
        var vscroll_animationframe = this._vscroll_animationframe;
        if (vscroll_animationframe)
        {
            vscroll_animationframe.destroy();
        }

        var hscroll_animationframe = this._hscroll_animationframe;
        if (hscroll_animationframe)
        {
            hscroll_animationframe.destroy();
        }
    };

    _pMultiLineTextFieldBox.on_change_containerRect = function (width, height)
    {
        this._recalc_box();
    };

    _pMultiLineTextFieldBox._recalc_box = function ()
    {
        if (this._control_element)
        {
            // textfield와는 달리 box에 container가 존재함.
            // container 크기는 _pFieldBaseScrollableBox._onResetScrollBar 에서 조절.
            // 스크롤바 영역 판단을 위해 labelposition 속성 값에 따라, box의 Client Height는  _pScrollableControlElement._on_updateClientRect() 에서 조절 됨.
            var boxinner_rect = { left: 0, top: 0, width: this._getClientWidth(), height: this._getClientHeight() };
            var input_elem = this._input_element;

            var client_left = boxinner_rect.left;
            var client_top = boxinner_rect.top;
            var client_width = boxinner_rect.width;
            var client_height = boxinner_rect.height;

            if (input_elem)
            {
                input_elem.setElementPosition(client_left, client_top);
                input_elem.setElementSize(client_width, client_height);

                if (this._update_scroll_lock == true)
                    return false;

                this._update_scroll_lock = true;

                this._onRecalcScrollSize();
                this._onResetScrollBar();

                this._update_scroll_lock = false;
            }
        }
    };

    _pMultiLineTextFieldBox.on_input_focus = function ()
    {
        this._p_parent._input_physical_focused = true;
        this._p_parent.on_input_focus();
        this._p_parent.on_fire_onsetfocus(this._p_parent, this, this._p_parent, this, true);
    };

    _pMultiLineTextFieldBox.on_input_compositionend = function ()
    {
        this._p_parent.on_input_compositionend();
    };

    _pMultiLineTextFieldBox.on_keyinput_basic_action = function (input_text)
    {
        return this._p_parent.on_keyinput_basic_action(input_text);    // 입력중 ._p_value 에 반영을 위해 parent로 전달 필요
    };

    _pMultiLineTextFieldBox._on_input_compositionend = function (value, _pos)
    {
        return this._p_parent._on_input_compositionend(value, _pos);
    };

    _pMultiLineTextFieldBox.on_click_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key)
    {
        return this._p_parent.on_click_basic_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key);
    };

    _pMultiLineTextFieldBox.on_apply_imeSet = _pTextAreaPtype.on_apply_imeSet;
    _pMultiLineTextFieldBox._onRecalcScrollSize = _pTextAreaPtype._onRecalcScrollSize;
    _pMultiLineTextFieldBox._adjust_scrollPosition = _pTextAreaPtype._adjust_scrollPosition;
    _pMultiLineTextFieldBox.on_notify_vscroll_onscroll = _pTextAreaPtype.on_notify_vscroll_onscroll;
    _pMultiLineTextFieldBox._setHscrollPos = _pTextAreaPtype._setHscrollPos;
    _pMultiLineTextFieldBox._setVscrollPos = _pTextAreaPtype._setVscrollPos;
    _pMultiLineTextFieldBox._setVScrollDefaultAction = _pTextAreaPtype._setVScrollDefaultAction;
    _pMultiLineTextFieldBox._getLineCount = _pTextAreaPtype._getLineCount;
    _pMultiLineTextFieldBox._getCaretLine = _pTextAreaPtype._getCaretLine;
    _pMultiLineTextFieldBox._isWheelScrollable = _pTextAreaPtype._isWheelScrollable;
    _pMultiLineTextFieldBox._setDefaultCaret = _pTextAreaPtype._setDefaultCaret;
    _pMultiLineTextFieldBox.set_dragscrolltype = _pTextAreaPtype.set_dragscrolltype;

    _pMultiLineTextFieldBox.on_fire_onhscroll = function (eventid, pos, strType, evtkind)
    {
        return this._p_parent.on_fire_onhscroll(eventid, pos, strType, evtkind);
    };

    _pMultiLineTextFieldBox.on_fire_onvscroll = function (eventid, pos, strType, evtkind)
    {
        return this._p_parent.on_fire_onvscroll(eventid, pos, strType, evtkind);
    };

    _pMultiLineTextFieldBox.on_fire_onmousewheel = function (eventid, pos, strType, evtkind)
    {
        return this._p_parent.on_fire_onvscroll(eventid, pos, strType, evtkind);
    };

    _pMultiLineTextFieldBox.on_fire_onmousewheel = function (wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return this._p_parent.on_fire_onmousewheel(wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
    };

    _pMultiLineTextFieldBox.on_fire_sys_onmousewheel = function (wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return this._p_parent.on_fire_sys_onmousewheel(wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
    };

    _pMultiLineTextFieldBox.on_fire_user_onmousewheel = function (wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return this._p_parent.on_fire_user_onmousewheel(wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
    };

    _pMultiLineTextFieldBox._on_contextmenu_default_action = function ()
    {
        return nexacro._checkShowContextMenu(this._p_parent);
    };

    _pMultiLineTextFieldBox.on_apply_imeSet = function ()
    {
        var multilinetextField = this.parent;
        if (multilinetextField)
            multilinetextField.on_apply_imeSet();
    };


    nexacro._defineProperties(_pMultiLineTextField, _pMultiLineTextField._properties);

    _pTextAreaPtype = null;
    _pMultiLineTextField = null;
    _pMultiLineTextFieldBox = null;
};