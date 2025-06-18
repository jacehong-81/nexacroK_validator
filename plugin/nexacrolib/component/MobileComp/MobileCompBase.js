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

if (!nexacro.FlexibleComponent)
{
    //==============================================================================
    // nexacro.FlexibleComponent
    //==============================================================================
    nexacro.FlexibleComponent = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        this._setFlexible();
    };

    var _pFlexibleComponent = nexacro._createPrototype(nexacro.Component, nexacro.FlexibleComponent);
    nexacro.FlexibleComponent.prototype = _pFlexibleComponent;

    _pFlexibleComponent._p_flexcrossaxisalign = "";
    _pFlexibleComponent._p_flexmainaxisalign = "";
    _pFlexibleComponent._p_flexwrap = "";

    _pFlexibleComponent._layouttype = "";
    _pFlexibleComponent._support_component_flex = true;
    _pFlexibleComponent._is_simple_control = true;

    _pFlexibleComponent._properties = [
        { name: "flexcrossaxisalign" },
        { name: "flexmainaxisalign" },
        { name: "flexwrap" },
    ];

    _pFlexibleComponent.on_create_control_element = function (parent_elem)
    {
        var control_elem = new nexacro.FlexibleControlElement(parent_elem);
        control_elem.setLinkedControl(this);
        this._control_element = control_elem;
        return control_elem;
    };

    _pFlexibleComponent.on_after_created = function ()
    {
        this.on_apply_flexcrossaxisalign();
        this.on_apply_flexmainaxisalign();
    };

    _pFlexibleComponent.set_flexwrap = function (v)
    {
        if (this._p_flexwrap !== v)
        {
            this._p_flexwrap = v;
            this.on_apply_flexwrap();
        }
    };

    _pFlexibleComponent.on_apply_flexwrap = function ()
    {
        var control_elem = this._control_element;
        if (control_elem && control_elem._is_flexible)
        {
            control_elem.setElementFlexWrap(this._p_flexwrap);
        }
    };

    _pFlexibleComponent.set_flexcrossaxisalign = function (v)
    {
        if (this._p_flexcrossaxisalign !== v)
        {
            this._p_flexcrossaxisalign = v;
            this.on_apply_flexcrossaxisalign();
        }
    };

    _pFlexibleComponent.on_apply_flexcrossaxisalign = function ()
    {
        var control_elem = this._control_element;
        if (control_elem && control_elem._is_flexible)
        {
            control_elem.setElementFlexCrossAxisAlign(this._p_flexcrossaxisalign);
        }
    };

    _pFlexibleComponent.set_flexmainaxisalign = function (v)
    {
        if (this._p_flexmainaxisalign !== v)
        {
            this._p_flexmainaxisalign = v;
            this.on_apply_flexmainaxisalign();
        }
    };

    _pFlexibleComponent.on_apply_flexmainaxisalign = function ()
    {
        var control_elem = this._control_element;
        if (control_elem && control_elem._is_flexible)
        {
            control_elem.setElementFlexCrossAxisAlign(this._p_flexmainaxisalign);
        }
    };

    _pFlexibleComponent._isSupportFlexDisplay = function ()
    {
        if (!this._support_component_flex)
            return false;

        var ret;
        var browser = nexacro._Browser;
        switch (browser)
        {
            case "IE":
            case "Runtime":
                ret = false;
                break;
            case "MobileSafari":
                if (nexacro._BrowserVersion > 14.4)
                    ret = true;
                else
                    ret = false;
                break;
            default:
                ret = true;
                break;
        }
        return ret;
    };

    _pFlexibleComponent._setFlexible = function ()
    {
        this._is_flexible = this._isSupportFlexDisplay();
    };

    _pFlexibleComponent._isFlexible = function ()
    {
        return this._is_flexible;
    };

    //==============================================================================
    // nexacro.TextControl (NRE: static, WRE: single <tag>)
    //==============================================================================
    nexacro.TextControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Static.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pTextControl = nexacro._createPrototype(nexacro.Static, nexacro.TextControl);
    nexacro.TextControl.prototype = _pTextControl;

    _pTextControl._type_name = "TextControl";
    _pTextControl._is_subcontrol = true;

    _pTextControl.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var cellElem;
            if (nexacro._Browser == "Runtime")
                cellElem = this._cell_elem = new nexacro.TextBoxElement(control_elem, "text");
            else
                cellElem = this._cell_elem = new nexacro.TextBoxVirtualFlexElement(control_elem, "text");

            cellElem.setElementPosition(this._getClientLeft(), this._getClientTop());
            cellElem.setElementSize(control_elem.client_width, control_elem.client_height);

            if (this.textAlign)
                cellElem.setElementTextAlign(this.textAlign);
            if (this.verticalAlign)
                cellElem.setElementVerticalAlign(this.verticalAlign);

            var wordwrap_info = this._getCSSStyleValue("wordWrap");
            if (wordwrap_info)
                cellElem.setElementCSSMapInfo(wordwrap_info);

            if (this.wordWrap)
                cellElem.setElementWordWrap(this.wordWrap);

            if (this._textdecoration)
                cellElem.setElementTextDecoration(this._textdecoration);

            if (this._displaytext)
            {
                if (this.usedecorate)
                    cellElem.setElementDecorateText(this._displaytext);
                else
                    cellElem.setElementText(this._displaytext);

                cellElem.setElementPointerEvents();
            }
        }
    };

    _pTextControl.on_changeUserStatus = function (changestatus, value, applyuserstatus, currentstatus, currentuserstatus)
    {
        if (value)
            return changestatus;
        else
            return applyuserstatus;
    };

    _pTextControl._on_getFitSize = function ()
    {
        var elem = this.getElement();
        if (elem)
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
                text = this.text;
            }

            if (!text)
                text = "gH한";

            var font = this._getCurrentStyleInheritValue("font");
            var refer_font = this._getReferenceAbsoluteFont(font);
            var wordspace = this._getCurrentStyleInheritValue("wordSpacing");
            var letterspace = this._getCurrentStyleInheritValue("letterSpacing");
            var wordwrap = "none";
            var width;

            var multiline = false;
            if (text.search("\n") > -1)
            {
                multiline = true;
            }

            if (this.fittocontents == "height")
            {
                wordwrap = this.wordWrap || this._getCSSStyleValue("wordWrap");
                if (wordwrap && wordwrap != "none")
                    multiline = true;

                width = this._adjust_width - total_w;
            }

            var b_decoration = this.usedecorate;

            var text_size = nexacro._getTextSize(text, font, multiline, width, wordwrap, wordspace, letterspace, b_decoration, undefined, undefined, refer_font);

            total_w += Math.ceil(this.textwidth != null ? this.textwidth : text_size[0]);
            total_h += Math.ceil(text_size[1]);

            if (nexacro._Browser == "Runtime") // NRE 오차 범위
                total_h += 2;

            return [total_w, total_h];
        }

        return [0, 0];
    };

    //==============================================================================
    // nexacro.IconControl
    //==============================================================================
    nexacro.IconControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.TextControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pIconControl = nexacro._createPrototype(nexacro.TextControl, nexacro.IconControl);
    nexacro.IconControl.prototype = _pIconControl;
    _pIconControl._type_name = "IconControl";

    _pIconControl._p_semantictag = "i";
    _pIconControl._p_accessibilityrole = "icon";
    _pIconControl._p_tabstop = true;

    _pIconControl._firstchild = false;
    _pIconControl._is_focus_accept = true;
    _pIconControl._cur_ldown_elem = null;
    _pIconControl._selectstatus = false;
    _pIconControl._use_pushed_status = true;
    _pIconControl._use_selected_status = true;
    _pIconControl._is_eventinfo_control = true;

    _pIconControl._isFocusAcceptable = function ()
    {
        return true;
    };

    _pIconControl._click = function (keycode)
    {
        if (keycode == nexacro.Event.KEY_ESC || keycode == nexacro.Event.KEY_RETURN)
        {
            if (this._isAccessibilityEnable())
                this._notifyAccessibility();
        }
        this.click();
    };

    _pIconControl.getSelectStatus = function ()
    {
        return this._selectstatus;
    };

    _pIconControl.setSelectStatus = function (select)
    {
        var ret = this._selectstatus;
        this._selectstatus = select;

        if (select)
        {
            this._changeUserStatus("selected", true);
        }
        else
        {
            this._changeUserStatus("selected", false);
        }

        return ret;
    };

    _pIconControl.toggleSelectStatus = function ()
    {
        var ret = this._selectstatus;

        this.setSelectStatus(!ret);

        return ret;
    };

    _pIconControl.click = function ()
    {
        this.on_fire_onclick("none", false, false, false, -1, -1, -1, -1, -1, -1, this, this);
    };

    _pIconControl._on_hotkey = function (/*keycode, altKey, ctrlKey, shiftKey*/)
    {
        this.click();
    };

    _pIconControl.on_keydown_basic_action = function (keycode/*, alt_key, ctrl_key, shift_key, refer_comp*/)
    {
        if (this._use_pushed_status)
        {
            if (keycode == 13 || keycode == 32)
            {
                this._changeUserStatus("pushed", true);
            }
        }
    };

    _pIconControl.on_keyup_basic_action = function (/*keycode, alt_key, ctrl_key, shift_key, refer_comp*/)
    {
        if (this._use_pushed_status)
        {
            this._changeUserStatus("pushed", false);
        }
    };

    _pIconControl.on_keydown_default_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        var _win = this._getWindow();
        if (_win)
        {
            this._cur_ldown_elem = _win._cur_ldown_elem || _win._keydown_element;
        }
    };

    _pIconControl.on_keyup_default_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        var _win = this._getWindow();
        if (_win)
        {
            var elem = _win._cur_ldown_elem || _win._keydown_element;
            if (!this._is_subcontrol) // subcontrol don't click action (spec) but fileupload is exception
            {
                if (elem == this._cur_ldown_elem)
                {
                    if (keycode == 13 || keycode == 32) // 13 'enter' , 32 'space'
                    {
                        this._click(keycode);
                    }
                }
            }
        }
        this._cur_ldown_elem = null;
    };

    //==============================================================================
    // nexacro.LabelControl
    //==============================================================================
    nexacro.LabelControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.TextControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pLabelControl = nexacro._createPrototype(nexacro.TextControl, nexacro.LabelControl);
    nexacro.LabelControl.prototype = _pLabelControl;

    _pLabelControl._type_name = "LabelControl";

    _pLabelControl._p_semantictag = "label";
    _pLabelControl._p_accessibilityrole = "label";

    _pLabelControl.on_create_normal_control_element = function (parent_elem)
    {
        var control_elem = new nexacro.LabelElement(parent_elem);
        control_elem.setLinkedControl(this);
        this._control_element = control_elem;
        return control_elem;
    };

    _pLabelControl.For = function (input_elem)
    {
        this._control_element.For(input_elem);
    };

    _pLabelControl._on_getFitSize = function ()
    {
        if (this.text == "")
            return [0, 0];

        return nexacro.TextControl.prototype._on_getFitSize.call(this);
    };


    //==============================================================================
    // nexacro.FieldBaseTextControl (NRE: static, WRE: single <tag>)
    //==============================================================================
    nexacro.FieldBaseTextControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.TextControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pFieldBaseTextControl = nexacro._createPrototype(nexacro.TextControl, nexacro.FieldBaseTextControl);
    nexacro.FieldBaseTextControl.prototype = _pFieldBaseTextControl;

    _pFieldBaseTextControl._type_name = "FieldBaseTextControl";
    _pFieldBaseTextControl._is_focus_accept = true;

    //==============================================================================
    // nexacro.FieldBaseIconControl
    //==============================================================================
    nexacro.FieldBaseIconControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.IconControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pFieldBaseIconControl = nexacro._createPrototype(nexacro.IconControl, nexacro.FieldBaseIconControl);
    nexacro.FieldBaseIconControl.prototype = _pFieldBaseIconControl;

    _pFieldBaseIconControl._type_name = "FieldBaseIconControl";

    _pFieldBaseIconControl.on_changeUserStatus = function (changestatus, value, applyuserstatus, currentstatus, currentuserstatus)
    {
        if (value)
        {
            return changestatus;
        }
        else
        {
            if (changestatus == "pushed" && (currentuserstatus == "valid" || currentuserstatus == "invalid"))
                return currentuserstatus;

            return applyuserstatus;
        }
    };


    //==============================================================================
    // nexacro.FieldBaseLabelControl
    //==============================================================================
    nexacro.FieldBaseLabelControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.LabelControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        this._userstatus_overlap = { floating: false, invalid: false, valid: false };
    };

    var _pFieldBaseLabelControl = nexacro._createPrototype(nexacro.LabelControl, nexacro.FieldBaseLabelControl);
    nexacro.FieldBaseLabelControl.prototype = _pFieldBaseLabelControl;

    _pFieldBaseLabelControl._type_name = "FieldBaseLabelControl";

    _pFieldBaseLabelControl._p_floating = false;

    _pFieldBaseLabelControl._excluded_flex = true;
    _pFieldBaseLabelControl._is_use_transition = true;
    _pFieldBaseLabelControl._transition = "all 0.15s ease-in-out";

    _pFieldBaseLabelControl._properties = [
        { name: "floating" },
    ];

    _pFieldBaseLabelControl.on_destroy_contents = function ()
    {
        this._userstatus_overlap = null;
    };

    _pFieldBaseLabelControl.onApplyProperties = function ()
    {
        if (this._control_element)
            this._control_element.setElementPointerEvents("none");

        this.on_apply_floating(true);
    };

    _pFieldBaseLabelControl.set_floating = function (v, no_transition)
    {
        if (this._p_floating != v)
        {
            this._p_floating = v;
            this.on_apply_floating(no_transition);
        }
    };

    _pFieldBaseLabelControl.on_apply_floating = function (no_transition)
    {
        this.transitionON(!no_transition);
        this._changeUserStatus("floating", this._p_floating);
    };

    _pFieldBaseLabelControl._shake = function (apply)
    {
        if (apply && this._p_floating)
            this.set_cssclass("shake");
        else
            this.set_cssclass("");
    };

    _pFieldBaseLabelControl.transitionON = function (on)
    {
        if (!this._is_use_transition)
            return;

        if (on)
            this._control_element._setElementTransition(this._transition);
        else
            this._control_element._setElementTransition("");
    };

    _pFieldBaseLabelControl._changeUserStatus = function (changestatus, value)
    {
        if (changestatus == "valid" && value == true)
            this._userstatus_overlap["invalid"] = false;
        else if (changestatus == "invalid" && value == true)
            this._userstatus_overlap["valid"] = false;

        this._userstatus_overlap[changestatus] = value;

        if (this._userstatus_overlap.floating && (this._userstatus_overlap.invalid || this._userstatus_overlap.valid))
        {
            if (this._userstatus_overlap.invalid)
                nexacro.FieldBaseTextControl.prototype._changeUserStatus.call(this, "floatinginvalid", true);
            else
                nexacro.FieldBaseTextControl.prototype._changeUserStatus.call(this, "floatingvalid", true);
        }
        else
        {
            if (this._userstatus_overlap.floating)
            {
                nexacro.FieldBaseTextControl.prototype._changeUserStatus.call(this, "floating", true);
            }
            else if (this._userstatus_overlap.invalid)
            {
                nexacro.FieldBaseTextControl.prototype._changeUserStatus.call(this, "invalid", true);
            }
            else if (this._userstatus_overlap.valid)
            {
                nexacro.FieldBaseTextControl.prototype._changeUserStatus.call(this, "valid", true);
            }
            else
            {
                nexacro.FieldBaseTextControl.prototype._changeUserStatus.call(this, "floatinginvalid", false);
                nexacro.FieldBaseTextControl.prototype._changeUserStatus.call(this, "floatingvalid", false);
                nexacro.FieldBaseTextControl.prototype._changeUserStatus.call(this, "floating", false);
                nexacro.FieldBaseTextControl.prototype._changeUserStatus.call(this, "invalid", false);
                nexacro.FieldBaseTextControl.prototype._changeUserStatus.call(this, "valid", false);
            }
        }

        // update
        var status = this._status;
        this._status = "";
        this._changeStatus(status, true);
    };

    //===============================================================
    // nexacro.FieldBaseBox (flexible)
    //===============================================================
    nexacro.FieldBaseBox = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.FlexibleComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        this._setControl();
    };

    var _pFieldBaseBox = nexacro._createPrototype(nexacro.FlexibleComponent, nexacro.FieldBaseBox);
    nexacro.FieldBaseBox.prototype = _pFieldBaseBox;

    _pFieldBaseBox._firstchild = true;
    _pFieldBaseBox._type_name = "FieldBaseBox";
    _pFieldBaseBox._layouttype = "horizontal";

    _pFieldBaseBox.set_usesoftkeyboard = function (v)
    {
        v = nexacro._toBoolean(v);
        if (v != this._p_usesoftkeyboard)
        {
            this._p_usesoftkeyboard = v;

            if (!this._initsoftkeyboard)
                this._initsoftkeyboard = true;
        }
    };

    _pFieldBaseBox._getWantLabelLeft = function ()
    {
        return -1;
    };

    _pFieldBaseBox._getWantLabelWidth = function ()
    {
        return this._getClientWidth();
    };

    //===============================================================
    // nexacro.FieldBaseBox : Event Handlers
    //===============================================================
    _pFieldBaseBox.on_keydown_default_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        var _field = this._p_parent;
        if (_field)
        {
            _field.on_keydown_default_action(keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key);  // default는 bubble이 되지 않으므로 parent에서 그대로 사용하기 위해..
        }
    };

    _pFieldBaseBox.on_keyup_default_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        var _field = this._p_parent;
        if (_field)
        {
            _field.on_keyup_default_action(keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key);  // default는 bubble이 되지 않으므로 parent에서 그대로 사용하기 위해..
        }
    };

    _pFieldBaseBox.on_changeUserStatus = function (changestatus, value, applyuserstatus/*, currentstatus, currentuserstatus*/)
    {
        if (value)
            return changestatus;
        else
            return applyuserstatus;
    };

    _pFieldBaseBox._on_beforekeyinput = function (elem, value, status, begin, end, inputType)
    {
        // bubble 없음. no cancelable, no prevent
        if (!this._is_alive) return false;

        return this._p_parent.on_beforekeyinput_basic_action(value, status, begin, end, inputType);
    };

    _pFieldBaseBox._beforeinput_process_with_HTMLEvent = function (value, status, begin, end, inputType)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            return this._p_parent.on_beforeinput_process_with_HTMLEvent.call(this, value, status, begin, end, inputType);
        }
    };

    _pFieldBaseBox._fix_composition = function (value, beginOffset, endOffset)
    {
        var textField = this.parent;
        if (textField)
            return textField._fix_composition(value, beginOffset, endOffset);
        return value;
    };

    _pFieldBaseBox._apply_setfocus = nexacro._emptyFn;
    _pFieldBaseBox._recalc_box = nexacro._emptyFn;

    //===============================================================
    // nexacro.FieldBaseScrollableBox (non flexible)
    //===============================================================
    nexacro.FieldBaseScrollableBox = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.FlexibleComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        this._setControl();
    };

    var _pFieldBaseScrollableBox = nexacro._createPrototype(nexacro.FieldBaseBox, nexacro.FieldBaseScrollableBox);
    nexacro.FieldBaseScrollableBox.prototype = _pFieldBaseScrollableBox;

    _pFieldBaseScrollableBox._type_name = "FieldBaseScrollableBox";
    _pFieldBaseScrollableBox._support_component_flex = false;
    _pFieldBaseScrollableBox._is_scrollable = true;
    _pFieldBaseScrollableBox._use_translate_scroll = false;
    _pFieldBaseScrollableBox._use_container_move = true;
    _pFieldBaseScrollableBox._is_simple_control = false;

    _pFieldBaseScrollableBox.on_create_control_element = function (parent_elem)
    {
        return nexacro.Component.prototype.on_create_control_element.call(this, parent_elem);
    };

    _pFieldBaseScrollableBox._onResetScrollBar = function ()
    {
        if (!this._is_scrollable)
            return;

        var control_elem = this._control_element;
        if (control_elem)
        {
            var hscrollbar_size = this._getHScrollBarSize();
            var vscrollbar_size = this._getVScrollBarSize();

            var bcreatevscroll = false;
            var bcreatehscroll = false;

            var hscrollbartype = this._getHScrollBarType();
            var vscrollbartype = this._getVScrollBarType();

            var scrolltype = this.scrolltype;
            if (scrolltype == "none")
            {
                //bcreatehscroll = false;
                //bcreatevscroll = false;
            }
            else
            {
                if (scrolltype != "vertical" && hscrollbartype != "none")
                    bcreatehscroll = true;

                if (scrolltype != "horizontal" && vscrollbartype != "none")
                    bcreatevscroll = true;

                if (this._is_form && this.getStepCount() > 0)
                    bcreatehscroll = false;
            }

            var attach_client_top = this._p_parent.getAttachClientTop();

            var client_left = control_elem.client_left;
            var client_top = control_elem.client_top;
            var client_width = control_elem.client_width;
            var client_height = control_elem.client_height;
            var zclient_width = control_elem._zclient_width;
            var zclient_height = control_elem._zclient_height;

            var paddingleft = 0, paddingtop = 0, paddingright = 0, paddingbottom = 0;
            var padding = control_elem.padding ? control_elem.padding : control_elem._padding_info;

            var vscroll_enable = false;
            var hscroll_enable = false;

            if (control_elem._apply_client_padding && padding)
            {
                paddingleft = padding.left;
                paddingtop = padding.top;
                paddingright = padding.right;
                paddingbottom = padding.bottom;
            }

            var hscroll_left = client_left - paddingleft;
            var hscroll_top = client_height + paddingtop + paddingbottom + attach_client_top;
            var hscroll_width = client_width + paddingleft + paddingright;

            var vscroll_left = client_width + paddingleft + paddingright;
            var vscroll_top = client_top - paddingtop - attach_client_top;
            var vscroll_height = client_height + paddingtop + paddingbottom + attach_client_top;

            if (bcreatehscroll)
            {
                this._createHScrollBar(hscrollbar_size);

                if (hscrollbar_size > 0)
                {
                    if (control_elem.hscroll_limit <= 0 && hscrollbartype != "fixed")
                        hscrollbar_size = 0;

                    if (hscrollbartype == "autoindicator")
                    {
                        hscroll_top -= hscrollbar_size;
                        this._p_hscrollbar.set_visible(false);
                    }
                    else
                        this._p_hscrollbar.set_visible(true);

                }
            }
            else
            {
                if (this._p_hscrollbar)
                {
                    this._p_hscrollbar.destroy();
                    this._p_hscrollbar = null;
                }
            }

            if (bcreatevscroll)
            {
                this._createVScrollBar(vscrollbar_size);

                if (vscrollbar_size > 0)
                {
                    if (control_elem.vscroll_limit <= 0 && vscrollbartype != "fixed")
                    {
                        vscrollbar_size = 0;
                    }

                    if (vscrollbartype == "autoindicator")
                    {
                        vscroll_left -= vscrollbar_size;
                        this._p_vscrollbar.set_visible(false);
                    }
                    else
                        this._p_vscrollbar.set_visible(true);

                    //hscroll_width -= vscrollbar_size;
                }
            }
            else
            {
                if (this._p_vscrollbar)
                {
                    this._p_vscrollbar.destroy();
                    this._p_vscrollbar = null;
                }
            }

            // ScrollBar Visible시 생성
            if (this._p_hscrollbar)
            {
                if (this._isEnable() && hscrollbar_size > 0 && (scrolltype != "none" && scrolltype != "vertical") && control_elem.hscroll_limit > 0)
                    hscroll_enable = true;

                this._p_hscrollbar._setScrollInfo(hscroll_left, hscroll_top, hscroll_width, hscrollbar_size, 0, control_elem.hscroll_limit, this._scroll_default_value, zclient_width, zclient_width, hscroll_enable, control_elem.scroll_left);

                if (!this._p_hscrollbar._is_created)
                    this._p_hscrollbar.on_created(this._getWindow());

            }

            if (this._p_vscrollbar)
            {
                if (this._isEnable() && vscrollbar_size > 0 && (scrolltype != "none" && scrolltype != "horizontal") && control_elem.vscroll_limit > 0)
                    vscroll_enable = true;

                this._p_vscrollbar._setScrollInfo(vscroll_left, vscroll_top, vscrollbar_size, vscroll_height, 0, control_elem.vscroll_limit, this._scroll_default_value, zclient_height, zclient_height, vscroll_enable, control_elem.scroll_top);
                if (!this._p_vscrollbar._is_created)
                    this._p_vscrollbar.on_created(this._getWindow());

            }

            this._p_parent._p_hscrollbar = this._p_hscrollbar;
            this._p_parent._p_vscrollbar = this._p_vscrollbar;
        }
    };

    //==============================================================================
    // nexacro.FieldBase 
    //==============================================================================
    nexacro.FieldBase = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.FlexibleComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._init_size = { f_label: [0, 0], label: [0, 0], helptext: [0, 0], chartext: [0, 0] };
        this._custom_err = {};
    };

    var _pFieldBase = nexacro._createPrototype(nexacro.FlexibleComponent, nexacro.FieldBase);
    nexacro.FieldBase.prototype = _pFieldBase;

    _pFieldBase._type_name = "FieldBase";

    /* default properties */
    _pFieldBase._p_labelposition = "overlap"; // [overlap, outside, inside]
    _pFieldBase._p_labelfloatingfixed = false;
    _pFieldBase._p_labeltext = "";
    _pFieldBase._p_labelgap = undefined;
    _pFieldBase._p_helpertext = "";
    _pFieldBase._p_invalidtext = "";
    _pFieldBase._p_usehelpertext = false;
    _pFieldBase._p_usecharcount = false;
    _pFieldBase._p_displaynulltext = "";
    _pFieldBase._p_headerheight = undefined;
    _pFieldBase._p_footerheight = undefined;
    _pFieldBase._p_contentheight = undefined;

    _pFieldBase._properties = [
        { name: "labelposition" },
        { name: "labelfloatingfixed" },
        { name: "labeltext" },
        { name: "labelgap" },
        { name: "helpertext" },
        { name: "invalidtext" },
        { name: "usehelpertext" },
        { name: "usecharcount" },
        { name: "displaynulltext" },
        { name: "value" },
        { name: "headerheight" },
        { name: "footerheight" },
        { name: "contentheight" },
        { name: "usesoftkeyboard" },
    ];

    /* internal variable */
    _pFieldBase._layouttype = "table";
    _pFieldBase._outside_leftgap = 0;
    _pFieldBase._overlap_leftgap = 9;
    _pFieldBase._normal_label_leftgap = 0;

    _pFieldBase._charcnt_text = "0 / 0";
    _pFieldBase._charcnt_width = 50;
    _pFieldBase._templatearea = "\"L L\" \"B B\" \"M C\"";
    _pFieldBase._boxcontrol_socket = { instance_name: "", id: "" };

    _pFieldBase._label = null;
    _pFieldBase._box = null;
    _pFieldBase._helptxt_control = null;
    _pFieldBase._charcnt_control = null;
    _pFieldBase._nulltext_control = null;

    _pFieldBase._is_invalid_status = false;
    _pFieldBase._is_valid_status = false;
    _pFieldBase._is_creation_over = false;

    _pFieldBase._is_use_esc_cancelvalue = false;

    // override function
    //==============================================================================
    // nexacro.FieldBase : Create & Destroy & Update
    //==============================================================================
    _pFieldBase.on_create_contents = function (ext_arg)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var instance_name = this._boxcontrol_socket.instance_name;
            if (!instance_name)
                return;

            var instance_id = this._boxcontrol_socket.id;
            var contbox_control = this._box = new nexacro[instance_name](instance_id, 0, 0, this._adjust_width, this._adjust_height, null, null, null, null, null, null, this, ext_arg);

            if (!this._isFlexible())
                contbox_control._excluded_flex = true;

            contbox_control.createComponent(true);

            this._updateHelperText(true);
            this._updateCharCount(true);

            var label = this._label = new nexacro.FieldBaseLabelControl("label", 0, 0, 0, 0, null, null, null, null, null, null, this);
            label.createComponent(true);

            if (this._isFlexible())
            {
                control_elem.setElementLayoutType(this._layouttype);
                control_elem.setElementTableTemplateArea(this._templatearea);

                var contbox_elem = contbox_control.getElement();
                contbox_control._update_layoutbasis();
                contbox_elem.setElementTableCellArea("B");
            }

            this._refreshLabel();
            this._initAreaSize();
            this._recalc_contents("create");
        }
    };

    _pFieldBase._updateHelperText = function (b_create)
    {
        if (this._control_element)
        {
            if (this._p_usehelpertext && !this._helptxt_control)
            {
                var helptxt_control = this._helptxt_control = new nexacro.FieldBaseTextControl("helpertext", 0, 0, 0, 0, null, null, null, null, null, null, this);

                if (!this._isFlexible())
                    helptxt_control._excluded_flex = true;

                helptxt_control.createComponent(b_create);

                if (this._isFlexible())
                {
                    var helptxt_elem = helptxt_control.getElement();
                    helptxt_control._update_layoutbasis();
                    helptxt_elem.setElementTableCellArea("M");
                }

                this._refreshErrorHelper();

                if (!b_create)
                    this._initHelperTextSize();
            }
            else if (this._p_usehelpertext)
            {
                this._refreshErrorHelper();
            }
            else 
            {
                if (!this._p_usehelpertext)
                    this._destroyHelperText();

                this._initHelperTextSize();
            }
        }
    };

    _pFieldBase._updateCharCount = function (b_create)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            if (this._p_usecharcount && !this._charcnt_control)
            {
                var charcnt_control = this._charcnt_control = new nexacro.FieldBaseTextControl("charcounttext", 0, 0, 0, 0, null, null, null, null, null, null, this);
                this._charcnt_control._type_name = "StaticControl";

                if (!this._isFlexible())
                    charcnt_control._excluded_flex = true;

                charcnt_control.createComponent(b_create);

                if (this._isFlexible())
                {
                    var charcnt_elem = charcnt_control.getElement();
                    charcnt_control._update_layoutbasis();
                    charcnt_elem.setElementTableCellArea("C");
                }

                this.on_apply_charcnt();

                if (!b_create)
                    this._initCharCountSize();
            }
            else if (this._p_usecharcount)
            {
                this._initCharCountSize();
            }
            else 
            {
                if (!this._p_usecharcount)
                    this._destroyCharCount();

                this._initCharCountSize();
            }
        }
    };

    _pFieldBase._updateNullTextControl = function (create_only)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            if (this._p_displaynulltext && !this._nulltext_control)
            {
                var nulltext_control = this._nulltext_control = new nexacro.FieldBaseTextControl("nulltext", 0, 0, 0, 0, null, null, null, null, null, null, this);
                this._nulltext_control._type_name = "StaticControl";

                nulltext_control._excluded_flex = true;
                nulltext_control.set_text(this._getStringResourceProperty(this._p_displaynulltext));
                nulltext_control.createComponent(create_only);
                nulltext_control.getElement().setElementPointerEvents("none");
            }
            else if (this._p_displaynulltext)
            {
                this._nulltext_control.set_text(this._getStringResourceProperty(this._p_displaynulltext));
            }
            else if (!this._p_displaynulltext)
            {
                this._destroyNullTextControl();
            }
        }
    };

    _pFieldBase._destroyHelperText = function ()
    {
        if (this._helptxt_control)
        {
            this._helptxt_control.destroy();
            this._helptxt_control = null;
        }
    };

    _pFieldBase._destroyCharCount = function ()
    {
        if (this._charcnt_control)
        {
            this._charcnt_control.destroy();
            this._charcnt_control = null;
        }
    };

    _pFieldBase._destroyNullTextControl = function ()
    {
        if (this._nulltext_control)
        {
            this._nulltext_control.destroy();
            this._nulltext_control = null;
        }
    };

    _pFieldBase._initAreaSize = function ()
    {
        this._initLabelTextSize();
        this._initHelperTextSize();
        this._initCharCountSize();

        this._on_init_areasize();
    };

    _pFieldBase.getAttachClientTop = function ()    // for scrollable
    {
        var attach_client_top;

        switch (this._p_labelposition)
        {
            case "inside":
                attach_client_top = this.getFloatingLabelHeight();
                break;
            case "overlap":
                attach_client_top = this.getFloatingLabelHeight() / 2;
                break;
            case "outside":
                attach_client_top = 0;
                break;
        }

        return attach_client_top;
    };

    _pFieldBase._onRecalcScrollSize = function ()
    {
        this._box._onRecalcScrollSize();
    };

    _pFieldBase._onResetScrollBar = function ()
    {
        this._box._onResetScrollBar();
    };

    _pFieldBase._on_init_areasize = function ()
    {
        if (this._box && this._box instanceof nexacro.FieldBaseScrollableBox)
        {
            var attach_client_top = this.getAttachClientTop();
            var elem = this._box.getElement();

            elem._setAttachClientTop(attach_client_top);

            this._onRecalcScrollSize();
            this._onResetScrollBar();
        }
    }

    _pFieldBase._initLabelTextSize = function ()
    {
        var label = this._label;
        var floating = label._p_floating;

        if (floating == true)
        {
            this._init_size.f_label = label._on_getFitSize();
            label.set_floating(false, true);
            this._init_size.label = label._on_getFitSize();
            label.set_floating(true, true);
        }
        else
        {
            this._init_size.label = label._on_getFitSize();
            label.set_floating(true, true);
            this._init_size.f_label = label._on_getFitSize();
            label.set_floating(false, true);
        }
    };

    _pFieldBase._initHelperTextSize = function ()
    {
        this._init_size.helptext = (this._helptxt_control != null) ? this._helptxt_control._on_getFitSize() : [0, 0];
    };

    _pFieldBase._initCharCountSize = function ()
    {
        this._init_size.chartext = (this._charcnt_control != null) ? this._charcnt_control._on_getFitSize() : [0, 0];
    };

    _pFieldBase.on_created_contents = function (win)
    {
        this._box.on_created(win);

        if (this._helptxt_control)
            this._helptxt_control.on_created(win);
        if (this._charcnt_control)
            this._charcnt_control.on_created(win);

        this._label.on_created(win);

        if (this._isFlexible())
            this._box._update_layoutbasis();

        this.on_apply_usesoftkeyboard();
    };

    _pFieldBase.on_after_created = function ()
    {
        this.on_apply_labelposition();
        this.on_apply_usehelpertext();
        this.on_apply_usecharcount();
        this.on_apply_displaynulltext();

        this._box._setEventHandler("onclick", this._on_onclick, this);
        this._refreshValidStatus(true, true, true);

        this.on_after_created_ext();
        this._is_creation_over = true;
    };

    _pFieldBase.on_after_created_ext = function () { }; // override

    _pFieldBase.on_create_contents_command = function ()
    {
        this.on_apply_usesoftkeyboard();

        var str = this._box.createCommand();

        if (this._helptxt_control)
            str += this._helptxt_control.createCommand();
        if (this._charcnt_control)
            str += this._charcnt_control.createCommand();

        str += this._label.createCommand();

        return str;
    };

    _pFieldBase.on_attach_contents_handle = function (win)
    {
        this._box.attachHandle(win);

        if (this._helptxt_control)
            this._helptxt_control.attachHandle(win);
        if (this._charcnt_control)
            this._charcnt_control.attachHandle(win);

        this._label.attachHandle(win);
        this._label._setAccessibilityStatHidden(true);
    };

    _pFieldBase.on_destroy_contents = function ()
    {
        if (this._box)
        {
            this._box.destroy();
            this._box = null;
        }

        this._destroyCharCount();
        this._destroyHelperText();
        this._destroyNullTextControl();

        if (this._label)
        {
            this._label.destroy();
            this._label = null;
        }
        this._init_size = null;
        this._custom_err = null;
        this._p_hscrollbar = null;
        this._p_vscrollbar = null;
    };

    _pFieldBase._recalc_contents = function (kind)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var contbox_control = this._box;
            var helptxt_control = this._helptxt_control
            var charcnt_control = this._charcnt_control;
            var charcnt_width = 0;
            var header_height = this.getFloatingLabelSpace();
            var footer_height = this._getHelperLineHeight();

            if (this._p_usecharcount)
            {
                charcnt_width = (this._charcnt_text != "" ? this._charcnt_width : 0);
                if (charcnt_control)
                {
                    var ww = charcnt_control._on_getFitSize()[0];
                    if (charcnt_width < ww)
                        charcnt_width = ww;
                }
            }

            if (this._p_headerheight)
                header_height = this._p_headerheight;

            if (this._p_footerheight)
                footer_height = this._p_footerheight;

            if (this._p_contentheight)
                this.set_height(this._p_contentheight + footer_height + header_height);

            if (this._isFlexible())
            {
                control_elem.setElementTableTemplate(header_height + "px 1fr " + footer_height + "px / 1fr " + charcnt_width + "px");
                if (contbox_control)
                    contbox_control.resize(this._getClientWidth(), this._adjust_height - footer_height - header_height);
                if (helptxt_control)
                    helptxt_control.resize(this._getClientWidth() - charcnt_width, footer_height);
                if (charcnt_control)
                    charcnt_control.resize(charcnt_width, footer_height);
            }
            else
            {
                if (contbox_control)
                    contbox_control.move(0, header_height, this._getClientWidth(), this._getClientHeight() - footer_height - header_height);
                if (helptxt_control)
                    helptxt_control.move(0, this._getClientHeight() - footer_height, this._getClientWidth() - charcnt_width, footer_height);
                if (charcnt_control)
                    charcnt_control.move(this._getClientWidth() - charcnt_width, this._getClientHeight() - footer_height, charcnt_width, footer_height)
            }

            this._recalcLabel(kind);
        }
    };

    _pFieldBase._recalcCharCount = function ()
    {
        var control_elem = this.getElement();

        if (control_elem && this._p_usecharcount)
        {
            var charcnt_control = this._charcnt_control;
            var charcnt_width = (this._charcnt_text != "" ? this._charcnt_width : 0);
            var helptxt_control = this._helptxt_control

            var header_height = this.getFloatingLabelSpace();
            var footer_height = this._getHelperLineHeight();

            if (this._p_headerheight != null)
                header_height = this._p_headerheight;

            if (this._p_footerheight != null)
                footer_height = this._p_footerheight;

            if (charcnt_control)
            {
                var ww = charcnt_control._on_getFitSize()[0];
                if (charcnt_width < ww)
                {
                    charcnt_width = ww;

                    if (this._isFlexible())
                    {
                        control_elem.setElementTableTemplate(header_height + "px 1fr " + footer_height + "px / 1fr " + charcnt_width + "px");
                        if (helptxt_control)
                            helptxt_control.resize(this._getClientWidth() - charcnt_width, footer_height);
                        if (charcnt_control)
                            charcnt_control.resize(charcnt_width, footer_height);
                    }
                    else
                    {
                        if (helptxt_control)
                            helptxt_control.move(0, this._getClientHeight() - footer_height, this._getClientWidth() - charcnt_width, footer_height);
                        if (charcnt_control)
                            charcnt_control.move(this._getClientWidth() - charcnt_width, this._getClientHeight() - footer_height, charcnt_width, footer_height)
                    }
                }
            }
        }
    };

    _pFieldBase._recalcLabel = function (kind)
    {
        var label = this._label;
        if (label)
        {
            var l = 0, t = 0, w = 0, h = 0;
            var contbox_control = this._box;
            var nulltxt_control = this._nulltext_control;

            var box_border = contbox_control._getCurrentStyleBorder();
            var box_border_l = box_border ? box_border.left._width : 0;
            var box_border_t = box_border ? box_border.top._width : 0;
            var box_border_b = box_border ? box_border.bottom._width : 0;
            var label_top_gap = (this._p_headerheight != null) ? this._p_headerheight : 0;

            if (this._p_labelposition != "inside")
            {
                if (this._p_headerheight != null)
                    label_top_gap = this._p_headerheight - this.getFloatingLabelSpace();
            }

            if (label._p_floating)
            {
                var label_size = this._init_size.f_label;
                w = label_size[0];
                h = label_size[1];

                var nullc_t, nullc_h;
                var box_client_h = contbox_control._adjust_height - box_border_t - box_border_b;

                if (this._p_labelposition == "outside")
                {
                    t = label_top_gap;
                    l = this._outside_leftgap;
                    nullc_t = label_top_gap + this.getFloatingLabelSpace() + box_border_t;
                    nullc_h = box_client_h;
                }
                else if (this._p_labelposition == "overlap")
                {
                    t = label_top_gap;
                    l = this._overlap_leftgap;
                    nullc_t = label_top_gap + this.getFloatingLabelSpace() + box_border_t;
                    nullc_h = box_client_h;
                }
                else if (this._p_labelposition == "inside")
                {
                    t = box_border_t + label_top_gap;
                    l = this._overlap_leftgap;
                    nullc_t = t + this.getFloatingLabelHeight();
                    nullc_h = box_client_h - this.getFloatingLabelHeight();
                }

                if (this._p_labelgap != undefined)
                    l = parseInt(this._p_labelgap);

                if (nulltxt_control)
                {
                    nulltxt_control.set_visible(this._p_value == null && !this._isFocused());
                    var ll = contbox_control._getWantLabelLeft();
                    var tt = nullc_t
                    var ww = contbox_control._getWantLabelWidth();
                    var hh = nullc_h;

                    if (ll == -1)
                        ll = this._normal_label_leftgap;

                    nulltxt_control.move(ll, tt, ww, hh);
                }
            }
            else
            {
                l = contbox_control._getWantLabelLeft();
                t = label_top_gap + this.getFloatingLabelSpace();
                w = contbox_control._getWantLabelWidth();

                if (w > this._init_size.label[0])
                    w = this._init_size.label[0];

                h = contbox_control._adjust_height;
            }

            if (kind != "floating" && kind != "value")
                label.transitionON(false);

            if (l == -1)
                l = this._normal_label_leftgap;

            label.move(l, t, w, h);
        }
    };

    _pFieldBase.on_apply_prop_enable = function (v)
    {
        var box = this._box;
        if (box)
            box._setEnable(v);
    };

    _pFieldBase._setLabelFloating = function (v, is_value_check, no_transition)
    {
        if (this._label)
        {
            while (!v)
            {
                if (this._p_labelfloatingfixed)
                {
                    v = true;
                    break;
                }

                if (is_value_check)
                    v = this._isContainsText();

                break;
            }
            this._label.set_floating(v, no_transition);
            this._refreshLabel("floating");
        }
    };

    _pFieldBase._isContainsText = function ()
    {
        return false;
    };

    _pFieldBase._setCharCount = function (cur, max)
    {
        this._charcnt_text = cur + " / " + max;
        this.on_apply_charcnt();
    };

    _pFieldBase.on_apply_charcnt = function ()
    {
        if (this._charcnt_control)
        {
            var change_length = this._charcnt_control.text.length != this._charcnt_text;

            this._charcnt_control.set_text(this._charcnt_text);

            if (change_length)
                this._recalcCharCount();
        }
    };

    _pFieldBase.set_headerheight = function (v)
    {
        v = parseInt(v);
        if (this._p_headerheight != v)
        {
            this._p_headerheight = v;
            this.on_apply_headerheight();
        }
    };

    _pFieldBase.on_apply_headerheight = function ()
    {
        this._recalc_contents();
    };

    _pFieldBase.set_footerheight = function (v)
    {
        v = parseInt(v);
        if (this._p_footerheight != v)
        {
            this._p_footerheight = v;
            this.on_apply_footerheight();
        }
    };

    _pFieldBase.on_apply_footerheight = function ()
    {
        this._recalc_contents();
    };

    _pFieldBase.set_contentheight = function (v)
    {
        v = parseInt(v);
        if (this._p_contentheight != v)
        {
            this._p_contentheight = v;
            this.on_apply_contentheight();
        }
    };

    _pFieldBase.on_apply_contentheight = function ()
    {
        this._recalc_contents();
    };

    _pFieldBase.set_invalidtext = function (v)
    {
        v = nexacro._toString(v);
        this._p_invalidtext = v;
    };

    _pFieldBase._invalidStatus = function (show, no_shake)
    {
        if (!this._is_creation_over)
            no_shake = true;

        if (this._is_invalid_status != show)
        {
            this._is_invalid_status = show;
            var label = this._label;

            this._refreshValidStatus(true, true, false);

            if (label)
                label._shake(false);

            this._refreshErrorHelper();
            this._recalc_contents();

            if (label)
            {
                if (!no_shake)
                    label._shake(show);
            }
        }
        else if (show && !no_shake)
        {
            this._label._shake(true);
        }
    };

    _pFieldBase._validStatus = function (show, no_shake)
    {
        if (this._is_valid_status != show)
        {
            this._is_valid_status = show;
            var label = this._label;

            this._refreshValidStatus(true, true, false);

            if (label)
                label._shake(false);

            this._refreshErrorHelper();
            this._recalc_contents();

            if (label && !no_shake)
                label._shake(show);
        }
        else if (show && !no_shake)
        {
            if (this._label)
                this._label._shake(true);
        }
    };

    //==============================================================================
    // nexacro.FieldBase : Event Handlers
    //==============================================================================
    _pFieldBase.on_invalid = function (apply_value)
    {
        var errkind = "value_invalid";

        if (apply_value)
            this.on_fire_oninvalid();

        this._custom_err[errkind] = nexacro._getErrorMessge(errkind);
        this._invalidStatus(true, !apply_value);
        this.on_invalid_basic_action();
    };

    _pFieldBase.on_invalid_basic_action = function () { };

    _pFieldBase.on_valid = function (apply_value)
    {
        this._validStatus(true, true);
        this.on_valid_basic_action();
    };

    _pFieldBase.on_fire_oninvalid = function ()
    {
        if (this.oninvalid && this.oninvalid._has_handlers)
        {
            var evt = new nexacro.EventInfo(this, "oninvalid");
            this.oninvalid._fireEvent(this, evt);
        }
    };

    _pFieldBase.on_valid_basic_action = function () { };
    _pFieldBase._changeValidStatusChild = function (status, show) { };

    _pFieldBase._detectStatus = function (status, show)
    {
        if (status == "disabled")
            return;

        var ctbox = this._box;
        var label = this._label;

        if (label)
            label._changeStatus(status, show);

        if (ctbox)
        {
            var prev = ctbox._status;
            ctbox._changeStatus(status, show);

            if (prev != ctbox._status)
            {
                this._refreshErrorHelper();
                this._recalc_contents();
            }
        }
    };

    _pFieldBase.on_focus_basic_action = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        nexacro.FlexibleComponent.prototype.on_focus_basic_action.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);
        this._setLabelFloating(true, true);
        this._detectStatus(this._status, true);

        if (this._nulltext_control)
            this._nulltext_control.set_visible(false);
    };

    _pFieldBase.on_killfocus_basic_action = function (new_focus, new_refer_focus)
    {
        nexacro.FlexibleComponent.prototype.on_killfocus_basic_action.call(this, new_focus, new_refer_focus);
        this._setLabelFloating(false, true);

        if (this._nulltext_control)
            this._nulltext_control.set_visible(this._p_value == null);
    };

    _pFieldBase.on_changeStatus = function (changestatus, value, applystatus, currentstatus, currentuserstatus)
    {
        this._detectStatus(changestatus, value);
        return applystatus;
    };


    _pFieldBase._refreshErrorHelper = function ()
    {
        var helpr = this._helptxt_control;
        if (helpr)
        {
            this._refreshValidStatus(false, false, true);

            if (this._is_invalid_status)
                helpr.set_text(this._getInvalidText("value_invalid"));
            //else if (this._is_valid_status)
            //    helpr.set_text("");
            else
                helpr.set_text(this._getStringResourceProperty(this._p_helpertext));
        }
    };

    _pFieldBase._refreshValidStatus = function (b_label, b_box, b_help)
    {
        var box = this._box;
        var label = this._label;
        var help = this._helptxt_control;

        if (this._is_invalid_status)
        {
            if (b_label && label)
            {
                label._changeUserStatus("invalid", true);
            }
            if (b_box && box)
            {
                box._changeUserStatus("invalid", true);
                this._changeValidStatusChild("invalid", true);
            }
            if (b_help && help)
            {
                help._changeUserStatus("invalid", true);
            }
        }
        else if (this._is_valid_status)
        {
            if (b_label && label)
            {
                label._changeUserStatus("valid", true);
            }
            if (b_box && box)
            {
                box._changeUserStatus("valid", true);
                this._changeValidStatusChild("valid", true);
            }
            if (b_help && help)
            {
                help._changeUserStatus("valid", true);
            }
        }
        else
        {
            if (b_label && label)
            {
                label._changeUserStatus("invalid", false);
                label._changeUserStatus("valid", false);
            }
            if (b_box && box)
            {
                box._changeUserStatus("invalid", false);
                box._changeUserStatus("valid", false);
                this._changeValidStatusChild("invalid", false);
                this._changeValidStatusChild("valid", false);
            }
            if (b_help && help)
            {
                help._changeUserStatus("invalid", false);
                help._changeUserStatus("valid", false);
            }
        }
    };

    _pFieldBase.getValidStatus = function ()
    {
        if (this._is_invalid_status)
            return "invalid";
        else if (this._is_valid_status)
            return "valid";

        return "";
    };

    _pFieldBase._getInvalidText = function (errkind)
    {
        if (this._p_invalidtext)
            return this._getStringResourceProperty(this._p_invalidtext);

        return this._custom_err[errkind] ? this._custom_err[errkind] : "";
    };

    _pFieldBase.on_change_containerRect = function (width, height)
    {
        this._recalc_contents("onsize");
    };

    _pFieldBase.LabelFor = function (input_elem)
    {
        if (this._label)
        {
            this._label.For(input_elem);
        }
    };

    _pFieldBase.getFloatingLabelHeight = function ()
    {
        var label_s = this._init_size.f_label;
        return label_s[1];
    };

    _pFieldBase.getFloatingLabelSpace = function ()
    {
        if (this._p_labelposition != "inside")
        {
            var label_s = this._init_size.f_label;

            if (label_s[1] > 0)
            {
                if (this._p_labelposition == "outside")
                    return label_s[1];
                else
                    return (label_s[1] / 2);
            }
        }
        return 0;
    };

    _pFieldBase._getHelperLineHeight = function ()
    {
        var help_s = this._init_size.helptext;
        var char_s = this._init_size.chartext;

        return Math.max(help_s[1], char_s[1]);
    };

    _pFieldBase.set_labelfloatingfixed = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_labelfloatingfixed != v)
        {
            this._p_labelfloatingfixed = v;
            this.on_apply_labelfloatingfixed();
        }
    };

    _pFieldBase.on_apply_labelfloatingfixed = function ()
    {
        if (this._p_labelfloatingfixed)
            this._setLabelFloating(true, true, true);
        else
            this._setLabelFloating(false, true, true);
    };

    _pFieldBase.set_labelposition = function (v)
    {
        if (this._p_labelposition != v)
        {
            switch (v)
            {
                case "overlap":
                case "outside":
                case "inside":
                    this._p_labelposition = v;
                    this.on_apply_labelposition();
                    break;
            }
        }
    };

    _pFieldBase.on_apply_labelposition = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            if (this._is_created_contents)
                this._initAreaSize();

            this._refreshAll();
        }
    };

    _pFieldBase.set_usehelpertext = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_usehelpertext != v)
        {
            this._p_usehelpertext = v;
            this.on_apply_usehelpertext();
        }
    };

    _pFieldBase.on_apply_usehelpertext = function ()
    {
        this._updateHelperText();
        this._recalc_contents();
    };

    _pFieldBase.set_helpertext = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_helpertext != v)
        {
            this._p_helpertext = v;
            this.on_apply_usehelpertext();
        }
    };

    _pFieldBase.set_usecharcount = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_usecharcount != v)
        {
            this._p_usecharcount = v;
            this.on_apply_usecharcount();
        }
    };

    _pFieldBase.on_apply_usecharcount = function ()
    {
        this._updateCharCount();
        this._recalc_contents();
    };

    _pFieldBase._refreshAll = function ()
    {
        this._label.on_apply_floating(true);
        this._recalc_contents();
    };

    _pFieldBase.set_labeltext = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_labeltext != v)
        {
            this._p_labeltext = v;
            this._refreshLabel();
        }
    };

    _pFieldBase.set_labelgap = function (v)
    {
        if (this._p_labelgap != v)
        {
            this._p_labelgap = v;
            this._recalcLabel();
        }
    };

    _pFieldBase.set_displaynulltext = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_displaynulltext != v)
        {
            this._p_displaynulltext = v;
            this.on_apply_displaynulltext();
        }
    };

    _pFieldBase.on_apply_displaynulltext = function ()
    {
        if (this._box)
        {
            this._updateNullTextControl();
            this._setLabelFloating(this._isContainsText());
            this._recalcLabel();
        }
    };

    _pFieldBase.set_autoskip = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_autoskip != v)
        {
            this._p_autoskip = v;
            this.on_apply_autoskip(v);
        }
    };

    _pFieldBase.on_apply_autoskip = function (autoskip)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            if (!this._onlydisplay)
                input_elem.setElementAutoSkip(autoskip);
        }
    };

    // mobile comp 공통으로 판단되어 공통화
    _pFieldBase.set_usesoftkeyboard = function (v)
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

    _pFieldBase.on_apply_usesoftkeyboard = function ()
    {
        var input_elem = this._getInputElement();
        if (input_elem && !this._onlydisplay)
        {
            var comp = input_elem.parent_elem.linkedcontrol;
            comp.set_usesoftkeyboard(comp._getUseSoftKeyboardValue(comp._initsoftkeyboard));
            input_elem.setElementUseSoftKeyboard(this._getUseSoftKeyboardValue(this._initsoftkeyboard));
        }
    };

    _pFieldBase._refreshLabel = function (kind)
    {
        var label = this._label;

        if (label)
        {
            var pre_text = label.text;
            var labeltext = this._getStringResourceProperty(this._p_labeltext);

            if (pre_text != labeltext)
            {
                label.set_text(labeltext);
                this._initLabelTextSize();
                this._on_init_areasize();
            }
            this._recalcLabel(kind);

            if (!pre_text)
                this._recalc_contents();
        }
    };

    _pFieldBase.set_value = function (v)
    {
        if (this._p_value != v)
        {
            this._p_value = v;
            this.on_apply_value();
        }
    };

    _pFieldBase.on_apply_value = function ()
    {
        this._setLabelFloating(this._p_value != null, undefined, true);
        this._refreshLabel();
    };

    _pFieldBase._isChar = function (keyCode)
    {
        switch (keyCode)
        {
            case 9:
            case 25:
            case 27:
            case 144:
            case 145:
                return false;
        }

        if ((keyCode >= 16 && keyCode <= 21) || (keyCode >= 33 && keyCode <= 40) || (keyCode >= 91 && keyCode <= 93) || (keyCode >= 112 && keyCode <= 123))
            return false;

        return true;
    };

    _pFieldBase._isFocused = function ()
    {
        var owner_frame = this._getOwnerFrame();
        var form = this._getForm();

        if (!owner_frame || !form._isMainForm())   // window가 닫힌 이후 들어오는 경우..
            return false;

        var ismodal = false;
        var modalframe = this._getWindow()._getLastModalFrame();

        if (modalframe && !modalframe._contains(this))
            ismodal = true;

        if (ismodal)
            return false;

        if (this._focused != undefined)
            return this._focused;

        var lastfocus = this._find_lastFocused();

        if (lastfocus instanceof nexacro.Div)
            lastfocus = lastfocus._getLastFocused();

        var retn = true;
        if (lastfocus != this)
            retn = false;

        this._focused = retn;
        return retn;
    };

    _pFieldBase._on_killfocus = function (new_focus, new_ref_focus)
    {
        this._focused = undefined;
        nexacro.FlexibleComponent.prototype._on_killfocus.call(this, new_focus, new_ref_focus);
    };

    _pFieldBase._on_focus = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        this._focused = undefined;
        nexacro.FlexibleComponent.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);
    };

    _pFieldBase._on_onclick = function (obj, e)
    {
        this.on_fire_onclick(e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.fromobject, e.fromreferenceobject, e.metakey);
    };

    _pFieldBase.on_apply_prop_stringresource = function ()
    {
        if (!nexacro._StringResource)
            return;

        nexacro.Component.prototype.on_apply_prop_stringresource.call(this);

        this.on_apply_displaynulltext(this._getStringResourceProperty(this._p_displaynulltext));
        this._refreshLabel();
        this.on_apply_usehelpertext();
        this._refreshErrorHelper();
    };
    var _pEditPtype = nexacro.Edit.prototype;

    _pFieldBase.on_deactivate_process = _pEditPtype.on_deactivate_process;
    _pFieldBase.on_keyinput_basic_before_process = _pEditPtype.on_keyinput_basic_before_process;
    _pFieldBase.on_killfocus_basic_process = _pEditPtype.on_killfocus_basic_process;
    _pFieldBase.on_keyinput_basic_process = _pEditPtype.on_keyinput_basic_process;
    _pFieldBase.on_beforekeyinput_basic_action = _pEditPtype.on_beforekeyinput_basic_action;
    _pFieldBase.on_keyinput_basic_action = _pEditPtype.on_keyinput_basic_action;

    //IME
    _pFieldBase._beforeinput_process_with_HTMLEvent = _pEditPtype._beforeinput_process_with_HTMLEvent;
    _pFieldBase.on_beforeinput_process_with_HTMLEvent = _pEditPtype.on_beforeinput_process_with_HTMLEvent;
    _pFieldBase._beforeinput_process_with_NexacroInputEvent = _pEditPtype._beforeinput_process_with_NexacroInputEvent;
    _pFieldBase.on_beforeinput_process_with_NexacroInputEvent = _pEditPtype.on_beforeinput_process_with_NexacroInputEvent;
    _pEditPtype = null;


    nexacro._defineProperties(_pFlexibleComponent, _pFlexibleComponent._properties);
    nexacro._defineProperties(_pFieldBaseLabelControl, _pFieldBaseLabelControl._properties);
    nexacro._defineProperties(_pFieldBase, _pFieldBase._properties);

    _pFlexibleComponent = null;
    _pTextControl = null;
    _pIconControl = null;
    _pLabelControl = null;
    _pFieldBaseTextControl = null;
    _pFieldBaseIconControl = null;
    _pFieldBaseLabelControl = null;
    _pFieldBase = null;
    _pFieldBaseBox = null;
};