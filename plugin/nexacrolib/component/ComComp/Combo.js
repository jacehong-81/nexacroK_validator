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
if (!nexacro.Combo)
{
    //==============================================================================
    // nexacro.ComboCloseUpEventInfo
    //==============================================================================
    nexacro.ComboCloseUpEventInfo = function (obj, id, beforeIndex, beforeText, beforeValue, afterIndex, afterText, afterValue, is_select)
    {
        this.id = this.eventid = id || "oncloseup";
        this.fromobject = this.fromreferenceobject = obj;

        this.preindex = beforeIndex;
        this.postindex = afterIndex;
        this.pretext = beforeText;
        this.posttext = afterText;
        this.prevalue = beforeValue;
        this.postvalue = afterValue;

        this.isselect = is_select;
    };

    var _pComboCloseUpEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ComboCloseUpEventInfo);
    nexacro.ComboCloseUpEventInfo.prototype = _pComboCloseUpEventInfo;
    _pComboCloseUpEventInfo._type_name = "ComboCloseUpEventInfo";

    _pComboCloseUpEventInfo = null;
    //delete _pComboCloseUpEventInfo;

    //==============================================================================
    // nexacro.Combo
    //==============================================================================
    nexacro.Combo = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        this._onlydisplay = onlydisplay;
    };

    var _pCombo = nexacro._createPrototype(nexacro.Component, nexacro.Combo);
    nexacro.Combo.prototype = _pCombo;
    _pCombo._type_name = "Combo";

    /* control */
    _pCombo._p_comboedit = null;
    _pCombo._p_dropbutton = null;
    _pCombo._p_combolist = null;
    _pCombo._popupcontrol = null;

    /* default properties */
    _pCombo._p_value = undefined;
    _pCombo._p_index = -1;
    _pCombo._p_text = "";

    _pCombo._p_codecolumn = "";
    _pCombo._p_datacolumn = "";
    _pCombo._p_innerdataset = "";

    _pCombo._p_autoselect = false;
    _pCombo._p_autoskip = false;

    _pCombo._initsoftkeyboard = undefined;
    _pCombo._p_usesoftkeyboard = true;

    _pCombo._p_displaynulltext = "";
    _pCombo._p_imemode = "none";
    _pCombo._p_readonly = false;
    _pCombo._p_usecontextmenu = true;

    _pCombo._p_displayrowcount = undefined;
    _pCombo._p_buttonsize = undefined;
    _pCombo._p_itemheight = undefined;
    _pCombo._p_type = "dropdown";
    _pCombo._p_popuptype = "normal";
    _pCombo._p_popupsize = undefined;
    _pCombo._p_acceptvaluetype = "allowinvalid";   //allowinvalid | ignoreinvalid

    _pCombo._p_selectbyarrowkey = false;

    /* internal variable */
    _pCombo._is_close_popup_by_select = false;
    _pCombo._isFiredOnInput = false;
    _pCombo._innerdataset = "";
    _pCombo._filtereddataset = "";
    _pCombo._default_value = undefined;
    _pCombo._default_text = "";
    _pCombo._default_index = -1;
    _pCombo._has_inputElement = true;
    _pCombo._processing_keyfilter = false;
    _pCombo._want_arrows = true;

    /* status */
    _pCombo._use_readonly_status = true;
    _pCombo._is_editable_control = true;

    /* event list */
    _pCombo._event_list = {
        "oneditclick": 1, "onitemclick": 1,
        "onkeydown": 1, "onkeyup": 1,
        "onkillfocus": 1, "onsetfocus": 1,
        "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1, "onmousedown": 1, "onmouseup": 1,
        "onmouseenter": 1, "onmousemove": 1, "onmouseleave": 1,
        "onmove": 1, "onsize": 1,
        "canitemchange": 1, "onitemchanged": 1, "oninput": 1,
        "onmousewheel": 1, "oncontextmenu": 1,
        "ondropdown": 1, "oncloseup": 1,
        "oninnerdatachanged": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1, "ondevicebuttonup": 1
    };

    /* accessibility */
    _pCombo._p_accessibilityrole = "combobox";

    //===============================================================
    // nexacro.Combo : Create & Update
    //===============================================================
    _pCombo.on_create_contents = function ()
    {
        var control = this.getElement();
        if (control)
        {
            this._p_comboedit = new nexacro._ComboEditControl("comboedit", 0, 0, 0, 0, null, null, null, null, null, null, this, this._onlydisplay);
            this._p_dropbutton = new nexacro._ComboButtonControl("dropbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);

            this._p_comboedit.createComponent();
            this._p_dropbutton.createComponent();
        }
    };

    _pCombo.on_created_contents = function (win)
    {
        if (this._p_innerdataset && !this._innerdataset)
        {
            this._setInnerDatasetStr(this._p_innerdataset);
            this.on_apply_innerdataset(this._innerdataset);
        }
        this.on_apply_autoskip(this._p_autoskip);
        this.on_apply_displaynulltext(this._p_displaynulltext);
        this.on_apply_imemode(this._p_imemode);
        this.on_apply_autoselect(this._p_autoselect);
        this.on_apply_usecontextmenu(this._p_usecontextmenu);

        if (!this._onlydisplay)
        {
            var init_comobovalue = (this._p_value == undefined && this._p_index == -1);
            if (init_comobovalue)
            {
                // 툴에서 Combo 디자인할때 기본값이어도 text가 항상 남아있어서 오동작 문제가 있음.
                this.on_apply_value(this._p_value);
            }
            else
            {
                if (this._p_index > -1)
                {
                    this.on_apply_index(this._p_index);
                }
                else if (this._p_value !== undefined)
                {
                    this.on_apply_value(this._p_value);
                }
                else if (this._p_text !== "")
                {
                    this.on_apply_text(this._p_text);
                }
            }
        }

        this.redraw();
        this._recalcLayout();
        this._setDefaultProps(this._p_index, this._p_value, this._p_text);

        this._setEventHandlerToComboEdit();
        this._setEventHandlerToDropButton();

        this._p_comboedit.on_created(win);
        this._p_dropbutton.on_created(win);

        if (this._isDropdownType())
        {
            this._p_comboedit._setReadonlyView(true);
        }

        if (this._env._p_enableaccessibility)
        {
            this._on_created_accessibility_contents(win);
        }

        if (this._p_comboedit)
        {
            this._p_comboedit.on_apply_usesoftkeyboard();
        }
        this.on_apply_type(this._p_type);
    };

    _pCombo.on_destroy_contents = function ()
    {
        if (this._p_comboedit)
        {
            this._p_comboedit.destroy();
            this._p_comboedit = null;
        }

        if (this._p_dropbutton)
        {
            this._p_dropbutton.destroy();
            this._p_dropbutton = null;
        }

        if (this._p_combolist)
        {
            this._p_combolist.destroy();
            this._p_combolist = null;
        }

        if (this._popupcontrol)
        {
            this._popupcontrol.destroy();
            this._popupcontrol = null;
        }

        var _window = this._getWindow();
        if (_window)
        {
            _window._releaseCaptureLock(this);
        }

        this._removeEventHandlerToInnerDataset();
    };

    _pCombo._removeEventHandlerToInnerDataset = function ()
    {
        if (this._innerdataset)
        {
            this._innerdataset._removeEventHandler("onvaluechanged", this._on_dataset_onvaluechanged, this);
            this._innerdataset._removeEventHandler("onrowsetchanged", this._on_dataset_onrowsetchanged, this);
            this._innerdataset = null;
        }

        if (this._filtereddataset)
        {
            this._filtereddataset.destroy();
            this._filtereddataset = null;
        }
    };

    _pCombo.on_create_contents_command = function ()
    {
        this.on_apply_autoskip(this._p_autoskip);
        this.on_apply_displaynulltext(this._getStringResourceProperty(this._p_displaynulltext));
        this.on_apply_imemode(this._p_imemode);
        this.on_apply_autoselect(this._p_autoselect);
        this.on_apply_usecontextmenu(this._p_usecontextmenu);
        this.on_apply_usesoftkeyboard();

        var init_comobovalue = (this._p_value == undefined && this._p_index == -1);
        if (init_comobovalue)
        {
            // 툴에서 Combo 디자인할때 기본값이어도 text가 항상 남아있어서 오동작 문제가 있음.
            this.on_apply_value(this._p_value);
        }
        else
        {
            if (this._p_index > -1)
            {
                this.on_apply_index(this._p_index);
            }
            else if (this._p_value !== undefined)
            {
                this.on_apply_value(this._p_value);
            }
            else if (this._p_text !== "")
            {
                this.on_apply_text(this._p_text);
            }
        }

        this.redraw();
        this._recalcLayout();

        this._setEventHandlerToComboEdit();
        this._setEventHandlerToDropButton();

        var str = "";

        if (this._p_comboedit)
        {
            this._p_comboedit.on_apply_usesoftkeyboard();
            str += this._p_comboedit.createCommand();
        }

        if (this._p_dropbutton)
        {
            str += this._p_dropbutton.createCommand();
        }

        return str;
    };

    _pCombo.on_attach_contents_handle = function (win)
    {
        if (this._p_comboedit)
        {
            this._p_comboedit.attachHandle(win);

            if (this._isDropdownType())
            {
                this._p_comboedit._setReadonlyView(true);
            }
        }

        if (this._p_dropbutton)
        {
            this._p_dropbutton.attachHandle(win);
        }

        if (this._env._p_enableaccessibility)
        {
            this._on_attach_accessibility_contents_handle(win);
        }

        this._setDefaultProps(this._p_index, this._p_value, this._p_text);
        this.on_apply_type(this._p_type);
    };

    _pCombo.on_change_containerRect = function (width, height)
    {
        this._recalcLayout();
    };

    _pCombo.on_change_containerPos = function (left, top)
    {
        this._recalcLayout();
    };

    //===============================================================
    // nexacro.Combo : Override
    //===============================================================
    _pCombo._getInputElement = function ()
    {
        return this._p_comboedit ? this._p_comboedit._getInputElement() : null;
    };

    _pCombo._apply_setfocus = function (evt_name)
    {
        var comboedit = this._p_comboedit;
        if (comboedit)
        {
            comboedit._changeStatus("focused", true);

            if (nexacro._isTouchInteraction && nexacro._SupportTouch)
            {
                if (this._isDropdownType())
                {
                    var control_elem = this.getElement();
                    if (control_elem)
                    {
                        control_elem.setElementFocus(true);
                    }
                    else
                    {
                        comboedit._on_focus(true, evt_name);
                    }
                }
                else
                {
                    comboedit._on_focus(true, evt_name);
                }
            }
            else
            {
                comboedit._on_focus(true, evt_name);
            }
        }
    };

    _pCombo.on_apply_prop_enable = function (v)
    {
        v = (v != null) ? v : this._isEnable();

        if (this._p_comboedit)
        {
            this._p_comboedit._setEnable(v);
        }
        if (this._p_dropbutton && !this._isReadOnly())
        {
            this._p_dropbutton._setEnable(v);
        }
        if (this._p_combolist)
        {
            this._p_combolist._setEnable(v);
        }
    };

    _pCombo.on_apply_prop_cssclass = function ()
    {
        if (this._p_comboedit)
        {
            this._p_comboedit.on_apply_cssclass();
        }
        if (this._p_dropbutton)
        {
            this._p_dropbutton.on_apply_cssclass();
        }
        if (this._p_combolist)
        {
            this._p_combolist.on_apply_cssclass();
        }
    };

    _pCombo.on_apply_prop_stringresource = function ()
    {
        if (!nexacro._StringResource)
            return;

        nexacro.Component.prototype.on_apply_prop_stringresource.call(this);

        this.on_apply_displaynulltext(this._getStringResourceProperty(this._p_displaynulltext));
    };

    _pCombo.on_init_bindSource = function (columnid, propid, ds)
    {
        if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
        {
            this._createFilteredDataset();
        }

        this._setValue(undefined);
        this._setIndex(-1);
        this._setText("");

        this.redraw();
    };

    _pCombo.on_change_bindSource = function (propid, ds, row, col)
    {
        if (propid == "value")
        {
            if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
            {
                this._createFilteredDataset();
            }

            var idx = -1;
            var txt = "";
            var val = ds.getColumn(row, col);

            val = this._convertValueType(val, true);

            if (this._p_value == val)
            {
                return;
            }

            this._setValue(val);

            ds = this._selectDataset();
            if (ds)
            {
                idx = this._getIndexFromValue(ds, val);
                if (idx > -1)
                {
                    txt = this._getItemText(idx);
                }

                this._setIndex(idx);
                this._setText(txt);

                this._updateAccessibilityLabel();
            }

            this.redraw();
            this._setDefaultProps(this._p_index, this._p_value, this._p_text);
        }
    };

    _pCombo.on_getBindableProperties = function ()
    {
        return "value";
    };

    _pCombo._getDragData = function ()
    {
        var comboedit = this._p_comboedit;
        if (comboedit)
        {
            return comboedit.getSelectedText();
        }
    };

    _pCombo._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var _want_arrows = this._want_arrows;
        if ((keycode == nexacro.Event.KEY_UP || keycode == nexacro.Event.KEY_DOWN))
        {
            if (this._isPopupVisible() || (keycode == nexacro.Event.KEY_DOWN && altKey))
            {
                _want_arrows = true;
            }
            else
            {
                _want_arrows = (!this._env._p_enableaccessibility || !this._env._p_accessibilitycontentsearchkey || ctrlKey);
            }
        }

        return { want_tab: false, want_return: false, want_escape: false, want_chars: false, want_arrows: _want_arrows };
    };

    //===============================================================
    // nexacro.Combo : Properties
    //===============================================================
    _pCombo.set_text = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_text != v)
        {
            this._p_text = v;
            this.on_apply_text(v);
        }
    };

    _pCombo.on_apply_text = function (text)
    {
        //var control_elem = this.getElement();
        //if (control_elem)
        {
            var value = this._p_value;

            var ds = this._selectDataset();
            if (!ds || (!this._p_datacolumn && !this._p_codecolumn))
            {
                if (value)
                {
                    this._setEditValue(text);
                }
                else
                {
                    if (this._p_displaynulltext || text == "")
                    {
                        this._setEditValue(undefined);
                    }
                    else
                    {
                        this._setEditValue(text);
                    }
                }
            }
            else
            {
                var idx = this._getIndexFromText(ds, text);

                this._setIndex(idx);
                if (idx > -1)
                {
                    this._setValue(this._getItemValue(idx));
                }
                else
                {
                    this._setValue(undefined);
                    this._setText("");
                }
                this.redraw();
            }

            this._setDefaultProps(this._p_index, this._p_value, this._p_text);
        }
    };

    _pCombo.set_value = function (v)
    {
        if (!this._is_created && (v === undefined || v === null))// || v === ""))   // tool에서 입력된 빈값은 ""으로 들어와 구분이 불가하여 체크.
            return;

        v = this._convertValueType(v);

        if (this._p_value !== v)
        {
            if (this._p_acceptvaluetype == "ignoreinvalid")
            {
                var idx = -1;
                var ds = this._selectDataset();
                if (ds)
                {
                    idx = this._getIndexFromValue(ds, v);
                    if (idx < 0)
                        return;
                }
            }

            if (this.applyto_bindSource("value", v))
            {
                this._p_value = v;
                this.on_apply_value(v);
                this.redraw();
            }
        }
    };

    _pCombo.on_apply_value = function (value)
    {
        //var control_elem = this.getElement();
        //if (control_elem)
        {
            var idx = -1;
            var txt = "";
            var ds = this._selectDataset();
            if (ds)
            {
                idx = this._getIndexFromValue(ds, value);
                if (idx > -1)
                {
                    txt = this._getItemText(idx);
                }

                this._setIndex(idx);
                this._setText(txt);

                if (this._env._p_enableaccessibility)
                {
                    this._updateAccessibilityLabel();
                }
            }

            this._setDefaultProps(this._p_index, this._p_value, this._p_text);
        }
    };

    _pCombo.set_index = function (v)
    {
        if (isNaN(v = +v) || v < -1)
        {
            return;
        }

        if (this._p_index != v)
        {
            this._p_index = v;
            this.on_apply_index(v);
            this.redraw();
        }
    };

    _pCombo.on_apply_index = function (idx)
    {
        //var control_elem = this.getElement();
        //if (control_elem)
        //{
        var val;
        var txt = "";

        var ds = this._innerdataset;
        if (ds)
        {
            if (idx !== null && idx >= 0 && idx < ds.getRowCount())
            {
                val = this._getItemValue(idx);
                txt = this._getItemText(idx);
            }
            else
            {
                idx = -1;
            }

            if (this.applyto_bindSource("value", val))
            {
                this._setValue(val);
                this._setText(txt);
                if (this._p_index != idx)
                {
                    this._setIndex(-1);
                }
            }
            else
            {
                var result = "restore";

                // check bind value
                var form = this._getForm();
                var item = form._bind_manager._findBindItem(this, "value");
                if (item)
                {
                    var bind_ds = item._dataset;
                    if (bind_ds.rowcount > 0)
                    {
                        if (val == this._p_value)
                        {
                            if (txt == this._p_text)
                            {
                                result = "change";
                            }
                        }
                    }
                }

                // apply bind result
                if (result == "restore")
                {
                    this._setIndex(this._default_index);
                    this._setValue(this._default_value);
                    this._setText(this._default_text);
                }
                else if (result == "change")
                {
                    this._setIndex(idx);
                    this._setValue(val);
                    this._setText(txt);
                }
            }
        }
        else
        {
            this._setIndex(-1);
            this._setValue(undefined);
            this._setText("");
        }

        this._setDefaultProps(this._p_index, this._p_value, this._p_text);
        //}
    };

    _pCombo.set_displaynulltext = function (v)
    {
        v = nexacro._toString(v).replace(/&quot;/g, "\"");
        if (this._p_displaynulltext != v)
        {
            this._p_displaynulltext = v;
            this.on_apply_displaynulltext(v);
        }
    };

    _pCombo.on_apply_displaynulltext = function (displaynulltext)
    {
        var comboedit = this._p_comboedit;
        if (comboedit)
        {
            comboedit.set_displaynulltext(displaynulltext);
        }
    };

    _pCombo.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_readonly != v)
        {
            this._p_readonly = v;
            this.on_apply_readonly();
        }
    };

    _pCombo._isReadOnly = function ()
    {
        return this._p_readonly;
    };

    _pCombo.on_apply_readonly = function ()
    {
        var readonly = this._isReadOnly();
        this._changeStatus("readonly", readonly);

        var comboedit = this._p_comboedit;
        if (comboedit)
        {
            if (!this._onlydisplay)
            {
                comboedit.set_readonly(readonly);
            }
            else
            {
                comboedit._changeStatus("readonly", readonly);
            }
            if (this._isDropdownType())
            {
                comboedit._setReadonlyView(true);
                if (this._env._p_enableaccessibility)
                    comboedit._setAccessibilityFlagReadOnly(readonly);
            }
            else
            {
                if (readonly == true)
                    comboedit._setReadonlyView(true);
                else
                    comboedit._setReadonlyView(false);
            }
        }

        var dropbutton = this._p_dropbutton;
        if (dropbutton)
        {
            dropbutton._setEnable(this._isEnable() && !readonly);
        }

        var combolist = this._p_combolist;
        if (combolist)
        {
            combolist.set_readonly(readonly);
        }
    };

    _pCombo.set_autoselect = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_autoselect != v)
        {
            this._p_autoselect = v;
            this.on_apply_autoselect(v);
        }
    };

    _pCombo.on_apply_autoselect = function (autoselect)
    {
        var comboedit = this._p_comboedit;
        if (comboedit)
        {
            if (!this._isDropdownType())
            {
                comboedit.set_autoselect(autoselect);
            }
            else
            {
                comboedit.set_autoselect(false);
            }
        }
    };

    _pCombo.set_autoskip = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_autoskip != v)
        {
            this._p_autoskip = v;
            this.on_apply_autoskip(v);
        }
    };

    _pCombo.on_apply_autoskip = function (autoskip)
    {
        var comboedit = this._p_comboedit;
        if (comboedit)
        {
            comboedit.set_autoskip(autoskip);
        }
    };

    _pCombo.set_usesoftkeyboard = function (v)
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

    _pCombo.on_apply_usesoftkeyboard = function ()
    {
        if (this._p_comboedit)
        {
            this._p_comboedit.set_usesoftkeyboard(this._getUseSoftKeyboardValue(this._initsoftkeyboard));
        }
    };

    _pCombo.set_imemode = function (v)
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

    _pCombo.on_apply_imemode = function (imemode)
    {
        var comboedit = this._p_comboedit;
        if (comboedit)
        {
            comboedit.set_imemode(imemode);
        }
    };

    _pCombo.set_type = function (v)
    {
        var type_enum = ["dropdown", "search", "filter", "filterlike", "caseisearch", "caseifilter", "caseifilterlike"];
        if (type_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_type != v)
        {
            this._p_type = v;
            this.on_apply_type(v);
        }
    };

    _pCombo.on_apply_type = function (type)
    {
        if (this._filtereddataset)
        {
            this._filtereddataset.filter("");
        }

        this.on_apply_readonly();
        this.on_apply_autoselect(this._p_autoselect);
    };

    _pCombo.set_popuptype = function (v)
    {
        var popuptype_enum = ["normal", "center", "system", "none"];
        if (popuptype_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_popuptype != v)
        {
            this._p_popuptype = v;
            this.on_apply_popuptype(v);
        }
    };

    _pCombo.on_apply_popuptype = function (popuptype)
    {
        var popupcontrol = this._popupcontrol;
        if (popupcontrol)
        {
            popupcontrol._setType(popuptype);
        }
    };

    _pCombo.set_popupsize = function (v)
    {
        if (this._p_popupsize != v)
        {
            this._p_popupsize = v;
        }
    };

    _pCombo.set_usecontextmenu = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_usecontextmenu != v)
        {
            this._p_usecontextmenu = v;
            this.on_apply_usecontextmenu(v);
        }
    };

    _pCombo.set_acceptvaluetype = function (v)
    {
        var type_enum = ["allowinvalid", "ignoreinvalid"];

        if (type_enum.indexOf(v) == -1)
        {
            return;
        }
        this._p_acceptvaluetype = v;
    };

    _pCombo.on_apply_usecontextmenu = function (usecontextmenu)
    {
        var comboedit = this._p_comboedit;
        if (comboedit)
        {
            comboedit.set_usecontextmenu(usecontextmenu);
        }
    };

    _pCombo.set_innerdataset = function (v)
    {
        if (typeof v != "string")
        {
            this.setInnerDataset(v);
            return;
        }

        if (this._p_innerdataset != v)
        {
            this._removeEventHandlerToInnerDataset();

            if (!v)
            {
                this._innerdataset = null;
                this._p_innerdataset = "";
            }
            else
            {
                v = v.replace("@", "");
                var _v = this._findDataset(v);
                this._innerdataset = _v ? _v : "";
                this._p_innerdataset = v;
            }
            this.on_apply_innerdataset(this._innerdataset);
        }
        else if (this._p_innerdataset && !this._innerdataset)
        {
            this._setInnerDatasetStr(this._p_innerdataset);
            this.on_apply_innerdataset(this._innerdataset);
        }
    };

    _pCombo.on_apply_innerdataset = function (ds)
    {
        if (this._p_combolist)
        {
            this._p_combolist.setInnerDataset(ds);
        }

        if (ds)
        {
            ds._setEventHandler("onvaluechanged", this._on_dataset_onvaluechanged, this);
            ds._setEventHandler("onrowsetchanged", this._on_dataset_onrowsetchanged, this);

            if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
            {
                this._createFilteredDataset();
            }

            if (this._p_index > -1)
            {
                this._recheckIndex();
            }
            else if (this._p_value !== undefined)
            {
                this._recheckValue();
            }
            else if (this._p_text !== "")
            {
                this._recheckText();
            }

            this.redraw();
        }
    };

    _pCombo.set_codecolumn = function (v)
    {
        if (this._p_codecolumn != v)
        {
            this._p_codecolumn = v;
            this.on_apply_codecolumn(v);
        }
    };

    _pCombo.on_apply_codecolumn = function (codecolumn)
    {
        if (this._p_combolist)
        {
            this._p_combolist.set_codecolumn(codecolumn);
        }

        if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
        {
            this._createFilteredDataset();
        }

        if (this._is_created)
        {
            if (this._p_index > -1)
            {
                this._recheckIndex();
            }
            else if (this._p_value !== undefined)
            {
                this._recheckValue();
            }
            else if (this._p_text !== "")
            {
                this._recheckText();
            }
            this._setDefaultProps(this._p_index, this._p_value, this._p_text);
            this.redraw();
        }
    };

    _pCombo.set_datacolumn = function (v)
    {
        if (this._p_datacolumn != v)
        {
            this._p_datacolumn = v;
            this.on_apply_datacolumn(v);
        }
    };

    _pCombo.on_apply_datacolumn = function (datacolumn)
    {
        var combolist = this._p_combolist;
        if (combolist)
        {
            combolist.set_datacolumn(this._p_datacolumn);
        }

        if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
        {
            this._createFilteredDataset();
        }

        if (this._is_created)
        {
            if (this._p_index > -1)
            {
                this._recheckIndex();
            }
            else if (this._p_value !== undefined)
            {
                this._recheckValue();
            }
            else if (this._p_text !== "")
            {
                this._recheckText();
            }
            this._setDefaultProps(this._p_index, this._p_value, this._p_text);
            this.redraw();
        }
    };

    _pCombo.set_buttonsize = function (v)
    {
        if (this._p_buttonsize != v)
        {
            this._p_buttonsize = v;
            this.on_apply_buttonsize(v);
        }
    };

    _pCombo.on_apply_buttonsize = function (buttonsize)
    {
        this._recalcLayout();
    };

    _pCombo.set_displayrowcount = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v) || v < 0)
            {
                return;
            }
        }

        if (this._p_displayrowcount != v)
        {
            this._p_displayrowcount = v;
        }
    };

    _pCombo.set_itemheight = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v))
            {
                return;
            }
        }

        if (this._p_itemheight != v)
        {
            this._p_itemheight = v;
            this.on_apply_itemheight(v);
        }
    };

    _pCombo.on_apply_itemheight = function (itemheight)
    {
        var combolist = this._p_combolist;
        if (combolist)
        {
            combolist.set_itemheight(itemheight);
        }
    };

    _pCombo.set_visible = function (v)
    {
        nexacro.Component.prototype.set_visible.call(this, v);

        if (!this._p_visible && this._isPopupVisible())
        {
            this._closePopup();
        }
    };

    _pCombo.set_scrollbarbarminsize = function (scrollbarbarminsize)
    {
        if (scrollbarbarminsize !== undefined)
        {
            scrollbarbarminsize = parseInt(scrollbarbarminsize);
            if (isNaN(scrollbarbarminsize))
                return;
        }
        if (this._p_scrollbarbarminsize != scrollbarbarminsize)
        {
            this._p_scrollbarbarminsize = scrollbarbarminsize;

            var combolist = this._p_combolist;
            if (combolist)
            {
                combolist.set_scrollbarbarminsize(scrollbarbarminsize);
            }
        }
    };

    _pCombo.set_scrollbardecbuttonsize = function (scrollbardecbuttonsize)
    {
        if (scrollbardecbuttonsize !== undefined)
        {
            scrollbardecbuttonsize = parseInt(scrollbardecbuttonsize);
            if (isNaN(scrollbardecbuttonsize))
                return;
        }

        if (this._p_scrollbardecbuttonsize != scrollbardecbuttonsize)
        {
            this._p_scrollbardecbuttonsize = scrollbardecbuttonsize;

            var combolist = this._p_combolist;
            if (combolist)
            {
                combolist.set_scrollbardecbuttonsize(scrollbardecbuttonsize);
            }
        }
    };

    _pCombo.set_scrollbarbaroutsize = function (scrollbarbaroutsize)
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

            var combolist = this._p_combolist;
            if (combolist)
            {
                combolist.set_scrollbarbaroutsize(scrollbarbaroutsize);
            }
        }
    };

    _pCombo.set_scrollbarincbuttonsize = function (scrollbarincbuttonsize)
    {
        if (scrollbarincbuttonsize !== undefined)
        {
            scrollbarincbuttonsize = parseInt(scrollbarincbuttonsize);
            if (isNaN(scrollbarincbuttonsize))
                return;
        }

        if (this._p_scrollbarincbuttonsize != scrollbarincbuttonsize)
        {
            this._p_scrollbarincbuttonsize = scrollbarincbuttonsize;

            var combolist = this._p_combolist;
            if (combolist)
            {
                combolist.set_scrollbarincbuttonsize(scrollbarincbuttonsize);
            }
        }
    };

    _pCombo.set_scrollbarsize = function (scrollbarsize)
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

            var combolist = this._p_combolist;
            if (combolist)
            {
                combolist.set_scrollbarsize(scrollbarsize);
            }
        }
    };

    _pCombo.set_scrollbartrackbarsize = function (scrollbartrackbarsize)
    {
        if (scrollbartrackbarsize !== undefined)
        {
            scrollbartrackbarsize = parseInt(scrollbartrackbarsize);
            if (isNaN(scrollbartrackbarsize))
                return;
        }

        if (this._p_scrollbartrackbarsize != scrollbartrackbarsize)
        {
            this._p_scrollbartrackbarsize = scrollbartrackbarsize;

            var combolist = this._p_combolist;
            if (combolist)
            {
                combolist.set_scrollbartrackbarsize(scrollbartrackbarsize);
            }
        }
    };

    _pCombo.set_selectbyarrowkey = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_selectbyarrowkey != v)
        {
            this._p_selectbyarrowkey = v;
        }
    };

    _pCombo._properties = [{ name: "value" }, { name: "index" }, { name: "text" }, { name: "codecolumn" }, { name: "datacolumn" }, { name: "innerdataset" }, { name: "autoselect" }, { name: "autoskip" }, { name: "usesoftkeyboard" }, { name: "displaynulltext" }, { name: "imemode" }, { name: "readonly" }, { name: "usecontextmenu" }, { name: "displayrowcount" }, { name: "buttonsize" }, { name: "itemheight" }, { name: "type" }, { name: "popuptype" }, { name: "popupsize" }, { name: "acceptvaluetype" }, { name: "scrollbarbarminsize" }, { name: "scrollbardecbuttonsize" }, { name: "scrollbarsize" }, { name: "scrollbarbaroutsize " }, { name: "scrollbarincbuttonsize" }, { name: "scrollbartrackbarsize" }, { name: "selectbyarrowkey" }, { name: "combolist", readonly: true }, { name: "comboedit", readonly: true }, { name: "dropbutton", readonly: true }];
    nexacro._defineProperties(_pCombo, _pCombo._properties);

    //===============================================================
    // nexacro.Combo : Methods
    //===============================================================
    _pCombo.dropdown = function ()
    {
        var ds;

        if (!this._p_enable || this._p_readonly || !this._p_visible)
        {
            return false;
        }

        var comboedit = this._p_comboedit;
        var input_elem = comboedit ? comboedit._input_element : null;
        if (input_elem && input_elem._is_accept_touch && !input_elem._is_accept_touch())            
        {
            return false;
        }

        if (!this.isDropdown())
        {
            ds = this._selectDataset(true);

            if ((this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike") && ds.rowcount == 0)
            {
                ds = this._innerdataset;
            }
        }
        else
        {
            return false;
        }

        var lastfocus = this._find_lastFocused();
        if (lastfocus instanceof nexacro.Div)
            lastfocus = lastfocus._getLastFocused();

        if (lastfocus != this)
            this.setFocus(false);

        this._showPopup(ds, this._p_index, 1);
    };

    _pCombo.isDropdown = function ()
    {
        return this._isPopupVisible();
    };

    _pCombo.getCaretPos = function ()
    {
        if (this._p_readonly)
        {
            return -1;
        }

        var comboedit = this._p_comboedit;
        if (comboedit)
        {
            return comboedit.getCaretPos();
        }

        return -1;
    };

    _pCombo.getSelect = function ()
    {
        if (this.getElement() && this._p_comboedit)
        {
            return this._p_comboedit.getSelect();
        }

        return [this.getCaretPos(), this.getCaretPos()];
    };

    _pCombo.setSelect = function (start, end)
    {
        var comboedit = this._p_comboedit;
        if (comboedit)
        {
            return this._p_comboedit.setSelect(start, end);
        }

        return false;
    };

    _pCombo.getSelectedText = function ()
    {
        if (this.getElement() && this._p_comboedit)
        {
            return this._p_comboedit.getSelectedText();
        }

        return "";
    };

    _pCombo.setSelectedText = function (v)
    {
        if (this.getElement() && this._p_comboedit && !this._isDropdownType())
        {
            return this._p_comboedit.setSelectedText(v);
        }
    };

    _pCombo.getInnerDataset = function ()
    {
        return this._innerdataset;
    };

    _pCombo.setInnerDataset = function (obj)
    {
        this._removeEventHandlerToInnerDataset();

        if (!obj)
        {
            this._innerdataset = null;
            this._p_innerdataset = "";
            this.on_apply_innerdataset(null);
        }
        else if (obj instanceof nexacro.Dataset || (typeof obj == "object" && obj._type_name == "Dataset"))
        {
            this._innerdataset = obj;
            this._p_innerdataset = obj.id;
            this.on_apply_innerdataset(obj);
            if (this._is_created)
            {
                this._recheckIndex();
                this.redraw();
            }
        }
    };

    _pCombo.getCount = function ()
    {
        if (this.getElement())
        {
            if (this._p_combolist)
            {
                return this._p_combolist.getCount();
            }
            else if (this._innerdataset)
            {
                return this._innerdataset.getRowCount();
            }
        }

        return 0;
    };

    _pCombo.redraw = function ()
    {
        if (this._p_text || !nexacro._isNull(this._p_value))
        {
            if (this._onlydisplay)
            {
                if (this._p_index < 0 && this._p_text == "")
                    this._setEditValue(undefined);
                else
                    this._setEditValue(this._p_text);
            }
            else
            {
                if (this._p_displaynulltext && this._p_text == "")
                {
                    this._setEditValue(undefined);
                }
                else
                {
                    this._setEditValue(this._p_text);
                }
            }
        }
        else
        {
            this._setEditValue(undefined);
        }
        this._setDefaultCaret();
    };

    _pCombo.updateToDataset = function ()
    {
        return this.applyto_bindSource("value", this._p_value);
    };

    //===============================================================
    // nexacro.Combo : Events
    //===============================================================
    _pCombo._on_activate = function ()
    {
        nexacro.Component.prototype._on_activate.call(this);

        var comboedit = this._p_comboedit;
        if (comboedit)
        {
            nexacro.Edit.prototype._on_activate.call(comboedit);
        }
    };

    _pCombo._on_dropdown = function ()
    {
        if (this._p_readonly)
        {
            return;
        }

        var comboedit = this._p_comboedit;
        var input_elem = comboedit ? comboedit._input_element : null;
        if (input_elem && input_elem._is_accept_touch && !input_elem._is_accept_touch())            
        {
            return false;
        }

        var ds = this._selectDataset(true);
        var idx = this._p_index;

        if (this._isPopupVisible())
        {
            this._closePopup();
            this._setEditValue(this._getItemText(this._p_index));
        }
        else
        {
            var comboedit = this._p_comboedit;
            if (comboedit)
            {
                comboedit.setSelect(0, 0);
            }

            if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
            {
                this._clearFilteredDataset();
            }

            this._showPopup(ds, idx, 1);
        }
    };

    _pCombo._on_value_change = function (preindex, pretext, prevalue, postindex, posttext, postvalue)
    {
        if (!this.on_fire_canitemchange(this, preindex, pretext, prevalue, postindex, posttext, postvalue))
        {
            return false;
        }

        var ds = this._selectDataset();
        var before_index = ds ? this._getIndexFromValue(ds, postvalue) : this._p_index;

        var bind_applied = this.applyto_bindSource("value", postvalue);
        if (bind_applied)
        {
            var after_index = ds ? this._getIndexFromValue(ds, postvalue) : this._p_index;
            if (before_index == after_index)
            {
                this._p_value = postvalue;
                this._p_text = posttext;
                this._p_index = postindex;
            }
        }
        else
        {
            if (prevalue == postvalue)
            {
                // Dataset Event의 반환인지, 중복체크로 인한 결과값인지 알수 없음. TODO
                if (preindex != postindex)
                {
                    // 기존 요구사항(RP_84541)으로 처리되었지만, Dataset cancolumnchange 반환값에 대한 대응을 하지 못함.
                    this._p_value = postvalue;
                    this._p_text = posttext;
                    this._p_index = postindex;
                }
            }
            else
            {
                // Dataset Event의 반환값.
                return false;
            }
        }

        if (this._env._p_enableaccessibility)
        {
            this._updateAccessibilityLabel();
        }

        this.on_fire_onitemchanged(this, preindex, pretext, prevalue, postindex, posttext, postvalue);

        return true;
    };

    _pCombo._on_dataset_onvaluechanged = function (obj, e)
    {
        if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
        {
            this._createFilteredDataset();
        }

        this._recheckValue();
        this.redraw();

        if (this._is_created)
        {
            this.on_fire_oninnerdatachanged(obj, e.oldvalue, e.newvalue, e.columnid, e.col, e.row);
        }
    };

    _pCombo._on_dataset_onrowsetchanged = function (obj, e)
    {
        if (e.reason == nexacro.NormalDataset.REASON_FILTER)
        {
            if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
            {
                this._createFilteredDataset();
            }

            this._recheckValue();
            this.redraw();

            return;
        }
        else if (e.reason == nexacro.NormalDataset.REASON_ASSIGN)
        {
            this.set_index(-1);
            this._recheckIndex();
            this.redraw();
        }
        else if (e.reason == nexacro.NormalDataset.REASON_COPY ||
            e.reason == nexacro.NormalDataset.REASON_ENABLEEVENT)
        {
            if (this._p_index > -1)
            {
                this._recheckIndex();
            }
            else if (this._p_value !== undefined)
            {
                this._recheckValue();
            }
            else if (this._p_text !== "")
            {
                this._recheckText();
            }

            this.redraw();
            this._setDefaultProps(this._p_index, this._p_value, this._p_text);
        }
        else if (e.reason == nexacro.NormalDataset.REASON_DELETE)
        {
            if (this._p_index < e.row)
                return;

            if (this._p_index == e.row)
                this.set_index(-1);
            else if (this._p_index > e.row)
                this.set_index(this._p_index - 1);

            this._recheckIndex();
            this.redraw();
        }
    };

    _pCombo.on_keydown_default_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        var combolist = this._p_combolist;

        if (this._p_readonly)
        {
            return false;
        }

        var ds = this._selectDataset();
        var datacol = this._p_datacolumn;
        var codecol = this._p_codecolumn;

        if (!ds || (!datacol && !codecol))
        {
            return;
        }

        var pre_value = this._default_value;
        var pre_text = this._default_text;
        var pre_index = this._default_index;

        var cur_value = this._p_value;
        var cur_text = this._p_text;
        var cur_index = this._p_index;

        var nextidx;
        var rawidx;
        var curobj = null;
        var text = "";
        var rowcnt = ds.getRowCount();
        
        if (this._isPopupVisible())
        {
            curobj = combolist._get_rowobj_status("mouseover", "status") || combolist._get_rowobj_status("selected", "userstatus");
            if (curobj)
            {
                cur_index = curobj.index;
            }
        }

        if (keycode == nexacro.Event.KEY_ESC)
        {
            if (this._isPopupVisible())
            {
                text = this._getItemText(this._p_index);

                this._closePopup();
                this._setEditValue(text);
            }
        }
        else if ((keycode == nexacro.Event.KEY_UP || keycode == nexacro.Event.KEY_LEFT) && this._isComponentKeydownAction())
        {
            nextidx = cur_index - 1;
            if (this._isPopupVisible())
            {
                if (!alt_key)
                {
                    if (nextidx < 0)
                    {
                        nextidx = 0;
                    }

                    text = ds.getColumn(nextidx, datacol || codecol);

                    this._setEditValue(text);
                    combolist._refreshScroll(nextidx, 1);

                    if (this._p_selectbyarrowkey)
                    {
                        if (combolist._changeIndex(nextidx))
                        {
                            combolist.on_apply_index(nextidx);

                            if (this._p_index != nextidx)
                            {
                                cur_value = this._getItemValue(nextidx);
                                cur_text = this._getItemText(nextidx);
                                cur_index = nextidx;

                                if (!this._on_value_change(pre_index, pre_text, pre_value, cur_index, cur_text, cur_value))
                                {
                                    cur_value = pre_value;
                                    cur_text = pre_text;
                                    cur_index = pre_index;
                                }

                                this._setDefaultProps(cur_index, cur_value, cur_text);
                                this.redraw();
                            }
                        }
                        else
                        {
                            this._setDefaultProps(pre_index, pre_value, pre_text);
                            this.redraw();
                        }
                    }
                    else
                    {
                        combolist._change_status_item_from_key(cur_index, nextidx);
                    }
                }
            }
            else
			{
				if (nextidx < 0)
				{
					nextidx = 0;
				}

				if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
				{
					rawidx = this._getRawIndex(ds, nextidx);
					rawidx = (rawidx == -1) ? nextidx : rawidx;
					this._clearFilteredDataset();

					nextidx = rawidx;
				}

				if (this._p_index != nextidx)
				{
					cur_value = this._getItemValue(nextidx);
					cur_text = this._getItemText(nextidx);
					cur_index = nextidx;

					if (!this._on_value_change(pre_index, pre_text, pre_value, cur_index, cur_text, cur_value))
					{
						cur_value = pre_value;
						cur_text = pre_text;
						cur_index = pre_index;
					}

					this._setDefaultProps(cur_index, cur_value, cur_text);
					this.redraw();
				}
			}
        }
        else if ((keycode == nexacro.Event.KEY_DOWN || keycode == nexacro.Event.KEY_RIGHT) && this._isComponentKeydownAction())
        {
            nextidx = cur_index + 1;

            if (this._isPopupVisible())
            {
                if (!alt_key)
                {
                    if (nextidx < rowcnt)
                    {
                        text = ds.getColumn(nextidx, datacol || codecol);
                        text = text == undefined ? "" : text;

                        this._setEditValue(text);
                        combolist._refreshScroll(nextidx, 0);

                        if (this._p_selectbyarrowkey)
                        {
                            if (combolist._changeIndex(nextidx))
                            {
                                combolist.on_apply_index(nextidx);

                                if (this._p_index != nextidx)
                                {
                                    cur_value = this._getItemValue(nextidx);
                                    cur_text = this._getItemText(nextidx);
                                    cur_index = nextidx;

                                    if (!this._on_value_change(pre_index, pre_text, pre_value, cur_index, cur_text, cur_value))
                                    {
                                        cur_value = pre_value;
                                        cur_text = pre_text;
                                        cur_index = pre_index;
                                    }

                                    this._setDefaultProps(cur_index, cur_value, cur_text);
                                    this.redraw();
                                }
                            }
                            else
                            {
                                this._setDefaultProps(pre_index, pre_value, pre_text);
                                this.redraw();
                            }
                        }
                        else
                        {
                            combolist._change_status_item_from_key(cur_index, nextidx);
                        }
                    }
                }
            }
            else
            {
                var comboedit = this._p_comboedit;
                var input_elem = comboedit ? comboedit._input_element : null;
                if (alt_key && (!input_elem || (input_elem && (!input_elem._is_accept_touch || (input_elem._is_accept_touch && input_elem._is_accept_touch())))))
                {
                    this._showPopup(ds, cur_index, 1);
                }
                else if (!alt_key)
				{
					if (nextidx >= rowcnt)
					{
						nextidx = rowcnt - 1;
					}

					if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
					{
						rawidx = this._getRawIndex(ds, nextidx);
						rawidx = (rawidx == -1) ? nextidx : rawidx;
						this._clearFilteredDataset();

						nextidx = rawidx;
					}

					if (this._p_index != nextidx)
					{
						cur_value = this._getItemValue(nextidx);
						cur_text = this._getItemText(nextidx);
						cur_index = nextidx;

						if (!this._on_value_change(pre_index, pre_text, pre_value, cur_index, cur_text, cur_value))
						{
							cur_value = pre_value;
							cur_text = pre_text;
							cur_index = pre_index;
						}

						this._setDefaultProps(cur_index, cur_value, cur_text);
						this.redraw();
					}
				}
            }
        }
        else if (keycode == nexacro.Event.KEY_ENTER)
        {
            if (cur_index >= 0)
            {
                if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
                {
                    rawidx = this._getRawIndex(ds, cur_index);
                    rawidx = (rawidx == -1) ? cur_index : rawidx;
                    ds.set_filterstr("");
                }
                else
                {
                    rawidx = cur_index;
                }
            }
            else
            {
                rawidx = cur_index;
            }

            if (this._p_index != rawidx)
            {
                cur_value = this._getItemValue(rawidx);
                cur_text = this._getItemText(rawidx);
                cur_index = rawidx;

                if (!this._on_value_change(pre_index, pre_text, pre_value, cur_index, cur_text, cur_value))
                {
                    this._setEditValue(this._p_text);
                    cur_value = pre_value;
                    cur_text = pre_text;
                    cur_index = pre_index;
                }
            }

            this.redraw();

            if (this._isPopupVisible())
            {
                this._is_close_popup_by_select = true;
                this._closePopup();
                this._is_close_popup_by_select = false;

                if (this._p_autoskip)
                {
                    this._setFocusToNextComponent();
                }
            }
            else
            {
                if (this._isDropdownType() && this._env._p_enableaccessibility)
                {
                    // dropdown type일때 키액션 추가 (접근성 전용)
                    this._showPopup(ds, this._p_index);
                }
            }

            this._setDefaultProps(cur_index, cur_value, cur_text);
        }
        else if (keycode == nexacro.Event.KEY_PAGE_UP)
        {
            if (this._isPopupVisible())
            {
                var curidx = cur_index;
                if (curidx < 0)
                    curidx = 0;

                nextidx = cur_index - combolist._page_rowcount;

                if (nextidx <= 0)
                {
                    nextidx = 0;
                }

                text = ds.getColumn(nextidx, datacol || codecol);
                text = text == undefined ? "" : text;

                this._setEditValue(text);
                combolist._refreshScroll(null, null, keycode);
                combolist._change_status_item_from_key(cur_index, nextidx);
            }
        }
        else if (keycode == nexacro.Event.KEY_PAGE_DOWN)
        {
            if (this._isPopupVisible())
            {
                let curidx = cur_index;
                if (curidx < 0)
                    curidx = 0;

                nextidx = curidx + combolist._page_rowcount;

                if (nextidx >= rowcnt)
                {
                    nextidx = rowcnt - 1;
                }

                text = ds.getColumn(nextidx, datacol || codecol);
                text = text == undefined ? "" : text;

                this._setEditValue(text);
                combolist._refreshScroll(null, null, keycode);
                combolist._change_status_item_from_key(curidx, nextidx);
            }
        }
        else if (keycode == nexacro.Event.KEY_HOME)
        {
            if (this._isPopupVisible() && this._isDropdownType())
            {
                let curidx = cur_index;
                if (curidx < 0)
                    curidx = 0;

                nextidx = 0;
                text = ds.getColumn(nextidx, datacol || codecol);
                text = text == undefined ? "" : text;

                this._setEditValue(text);
                combolist._refreshScroll(null, null, keycode);
                combolist._change_status_item_from_key(curidx, nextidx);
            }
        }
        else if (keycode == nexacro.Event.KEY_END)
        {
            if (this._isPopupVisible() && this._isDropdownType())
            {
                let curidx = cur_index;
                if (curidx < 0)
                    curidx = 0;

                nextidx = rowcnt - 1;
                text = ds.getColumn(nextidx, datacol || codecol);
                text = text == undefined ? "" : text;

                this._setEditValue(text);
                combolist._refreshScroll(null, null, keycode);
                combolist._change_status_item_from_key(curidx, nextidx);
            }
        }
    };

    _pCombo._on_edit_onlbuttondown = function (obj, e)
    {
        if (this._p_readonly || (nexacro._isTouchInteraction && nexacro._SupportTouch))
        {
            return;
        }

        var comboedit = this._p_comboedit;
        var input_elem = comboedit ? comboedit._input_element : null;
        if (input_elem && input_elem._is_accept_touch && !input_elem._is_accept_touch())            
        {
            return false;
        }

        var ds = this._selectDataset(true);
        var idx = this._p_index;

        if (this._isPopupVisible())
        {
            this._closePopup();
            this._setEditValue(this._getItemText(this._p_index));
        }
        else
        {
            if (this._isDropdownType())
            {
                this._showPopup(ds, idx, 1);
            }
        }
    };

    _pCombo._on_edit_onkeydown = function (obj, e)
    {
        this.on_keydown_default_action(e.keycode, e.altkey, e.ctrlkey, e.shiftkey, e.fromobject, e.metakey);
    };

    _pCombo._on_edit_oninput = function (obj, e)
    {
        if (this._p_readonly || !this._isEnable())
        {
            return false;
        }

        this._isFiredOnInput = true;
        this.on_fire_oninput();

        var comboedit = this._p_comboedit;
        var input_elem = comboedit ? comboedit._input_element : null;
        if (input_elem && (input_elem._is_accept_touch && !input_elem._is_accept_touch()))
        {
            if (this._isPopupVisible())
            {
                this._closePopup();
            }
            this._isFiredOnInput = false;
            return false;
        }

        var ds = this._selectDataset();
        if (ds && comboedit._processing_keyfilter)
        {
            var col = this._p_datacolumn || this._p_codecolumn;
            var edit_val = comboedit._p_text;

            var type = this._p_type;
            if (type != "dropdown")
            {
                if (!this._p_combolist)
                {
                    this._createPopupListBoxControl(ds);
                }
            }

            switch (type)
            {
                case "search":
                case "caseisearch":
                    var index;
                    if (this._p_type == "caseisearch")
                    {
                        edit_val = new nexacro.ExprParser()._transferWhitespace(edit_val);
                        index = ds.findRowExpr(col + ".match(/^" + edit_val + "/i)");
                    }
                    else
                        index = ds.findRowAs(col, edit_val);

                    if (index >= 0)
                    {
                        this._showPopup(ds, index);
                    }
                    else
                    {
                        if (this._isPopupVisible())
                        {
                            this._closePopup();
                        }
                    }
                    break;
                case "filter":
                case "filterlike":
                case "caseifilter":
                case "caseifilterlike":
                    var regExp;
                    var parse_val = "";
                    var trans_val = "";
                    var edit_val_len = edit_val.length;

                    // 특수문자 입력시 \\을 붙여준다.
                    for (var i = 0; i < edit_val_len; i++)
                    {
                        regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
                        var c = edit_val.charAt(i);

                        if (regExp.test(c))
                            parse_val += "\\";
                        parse_val += c;
                    }

                    trans_val = new nexacro.ExprParser()._transferWhitespace(parse_val);

                    if (this._p_type == "filter")
                        ds.set_filterstr(col + ".match(/^(" + trans_val + ")/)");
                    else if (this._p_type == "filterlike")
                        ds.set_filterstr(col + ".indexOf('" + parse_val + "') > -1");
                    else if (this._p_type == "caseifilter")
                        ds.set_filterstr(col + ".match(/^(" + trans_val + ")/i)");
                    else    //caseifilterlike
                        ds.set_filterstr(col + ".match(/(" + trans_val + ")/i)");

                    if (edit_val && ds.getRowCount() > 0)
                    {
                        this._showPopup(ds, 0);

                        var win = this._getWindow();
                        if (win)
                        {
                            if (nexacro._Browser == "Runtime" && (nexacro._SystemType.toLowerCase() == "win32" || nexacro._SystemType.toLowerCase() == "win64"))
                                nexacro._flushCommand(win);
                        }
                    }
                    else
                    {
                        if (this._isPopupVisible())
                        {
                            this._closePopup();
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        this._isFiredOnInput = false;
    };

    _pCombo._on_edit_oneditclick = function (obj, e)
    {
        this.on_fire_oneditclick(obj, e.caretpos, e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, obj, obj, e.metakey);
    };

    _pCombo._on_edit_mobile_oneditclick = function (obj, e)
    {
        if (!this._p_readonly)
        {
            var comboedit = this._p_comboedit;
            var input_elem = comboedit ? comboedit._input_element : null;
            if (input_elem && input_elem._is_accept_touch && !input_elem._is_accept_touch())            
            {

            }
            else
            {
                var ds = this._selectDataset(true);
                var idx = this._p_index;

                if (this._isPopupVisible())
                {
                    this._closePopup();
                    this._setEditValue(this._getItemText(this._p_index));
                }
                else
                {
                    if (this._isDropdownType())
                    {
                        this._showPopup(ds, idx, 1);
                    }
                }
            }
        }
        this.on_fire_oneditclick(obj, e.caretpos, e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, obj, obj, e.metakey);
    };

    _pCombo._on_drop_onlbuttondown = function (obj, e)
    {
        if (e.button == "lbutton")
            this._on_dropdown();
    };

    _pCombo._on_drop_mobile_onclick = function (obj, e)
    {
        this._on_dropdown();
    };

    _pCombo._on_drop_onclick = function (obj, e)
    {
        if (e.button == "touch")
            this._on_dropdown();
    }; // control

    _pCombo._on_list_onitemclick = function (obj, e)
    {
        if (!this._p_combolist || !this._p_comboedit)
        {
            return false;
        }

        var pre_value = this._p_value;
        var pre_text = this._p_text;
        var pre_index = this._p_index;

        var cur_index = e.index;
        var cur_text = e.itemtext;
        var cur_value = e.itemvalue;

        this.on_fire_onitemclick(obj, cur_index, cur_text, cur_value, e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.metakey);

        if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
        {
            var ds = this._selectDataset();
            cur_index = this._getRawIndex(ds, e.index);
            if (cur_index != this._p_index)
            {
                cur_text = this._getItemText(cur_index);
                cur_value = this._getItemValue(cur_index);
            }
        }

        this._is_close_popup_by_select = true;
        if (cur_index != this._p_index)
        {
            if (!this._on_value_change(pre_index, pre_text, pre_value, cur_index, cur_text, cur_value))
            {
                this._p_value = cur_value = pre_value;
                this._p_text = cur_text = pre_text;
                this._p_index = cur_index = pre_index;
            }

            this.redraw();

            if (this._isPopupVisible())
            {
                this._closePopup();

                if (this._p_autoskip)
                {
                    this._setFocusToNextComponent();
                }
            }

            this._setDefaultProps(cur_index, cur_value, cur_text);
        }
        else
        {
            this.redraw();

            if (this._isPopupVisible())
            {
                this._closePopup();
            }
        }
        this._is_close_popup_by_select = false;
    };

    _pCombo._on_list_oncloseup = function (obj, e)
    {
        var _window = this._getWindow();
        if (_window && this._track_capture)
        {
            _window._releaseCaptureLock(this);
        }

        if (!this._isFiredOnInput)
        {
            if (this._p_displaynulltext != "" && nexacro._isNull(this._p_value))
            {
                this._setEditValue(undefined);
            }
            else
            {
                this._setEditValue(this._p_text);
            }
        }

        this._changeStatus("mouseover", false);
        this._p_comboedit._changeStatus("mouseover", false);
        this._p_dropbutton._changeStatus("mouseover", false);

        this.on_fire_oncloseup(this, this._default_index, this._default_text, this._default_value, this._p_index, this._p_text, this._p_value, this._is_close_popup_by_select);
    };

    _pCombo.on_focus_basic_action = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        this._changeStatus("focused", true);

        if (this._env._p_enableaccessibility)
        {
            this._setAccessibilityStatFocus(evt_name);
        }

        this._apply_setfocus(evt_name);
    };

    _pCombo.on_killfocus_basic_action = function (new_focus, new_refer_focus)
    {
        nexacro.Component.prototype.on_killfocus_basic_action.call(this);

        var comboedit = this._p_comboedit;
        if (comboedit)
        {
            comboedit._changeStatus("focused", false);
            if (this._env._p_enableaccessibility)
            {
                if (nexacro._Browser == "Runtime")
                {
                    comboedit._is_subfocused = false;
                }
            }

            if (this._p_text != this._p_comboedit.text)
            {
                comboedit.setCaretPos(0);
            }
        }

        this.redraw();

        if (this._isPopupVisible())
        {
            this._closePopup();
        }
    };

    _pCombo.on_fire_sys_onmousewheel = function (wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, comp, refer_comp, meta_key)
    {
        if (this._p_readonly)
        {
            return false;
        }

        var ds = this._selectDataset();
        if (!ds)
        {
            return false;
        }

        var last_focus = this._find_lastFocused();
        if ((!this._is_subcontrol && this != last_focus) || (this._is_subcontrol && this._getRootComponent(this) != last_focus))
            return false;

        var popupcontrol = this._popupcontrol;
        if (!popupcontrol || !popupcontrol._is_popup())
        {
            var curidx = this._p_index;
            var nextidx = 0;

            if (wheelDeltaY > 0)
            {
                if (curidx > 0)
                {
                    nextidx = curidx - 1;
                }
            }
            else
            {
                nextidx = curidx + 1;
            }

            if (this._p_index != nextidx && nextidx < ds.getRowCount())
            {
                var pre_index = this._p_index;
                var pre_text = this._p_text;
                var pre_value = this._p_value;

                var cur_index = nextidx;
                var cur_text = this._getItemText(nextidx);
                var cur_value = this._getItemValue(nextidx);

                var ret = this.on_fire_canitemchange(this, pre_index, pre_text, pre_value, cur_index, cur_text, cur_value);
                if (ret)
                {
                    this.set_index(nextidx);

                    this.on_fire_onitemchanged(this, pre_index, pre_text, pre_value, cur_index, cur_text, cur_value);

                    this._setDefaultProps(this._p_index, this._p_value, this._p_text);
                }
            }
        }

        return true;
    };

    _pCombo.on_fire_sys_onaccessibilitygesture = function (direction, fire_comp, refer_comp)
    {
        var ret = false;
        if (this._isPopupVisible())
        {
            var combolist = this._p_combolist;
            var item = null;
            var item_len = combolist._getContentsCount();
            if (item_len)
            {
                if (direction)
                {
                    combolist._overeditemindex++;
                }
                else
                {
                    combolist._overeditemindex--;
                }

                // 첫번째 아이템에서 역방향으로 슬라이드하면 이전 컴포넌트로 이동.
                // 마지막 아이템에서 순방향으로 슬라이드하면 다음 컴포넌트로 이동.
                if (combolist._overeditemindex < 0 || combolist._overeditemindex > item_len - 1)
                {
                    if (this._isPopupVisible())
                    {
                        this._closePopup();
                    }
                    combolist._overeditemindex = -1;
                }
                else
                {
                    item = combolist._getItem(combolist._overeditemindex);
                }
            }

            if (item)
            {
                ret = true;
                item._setAccessibilityNotifyEvent();
            }
        }
        return ret;
    };

    _pCombo.on_fire_sys_onslide = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        nexacro.Component.prototype.on_fire_sys_onslide.call(this, elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp);

        return (this._popupcontrol && this._popupcontrol._is_popup()) ? true : false;
    };

    _pCombo.on_fire_sys_onfling = function (elem, fling_handler, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp)
    {
        nexacro.Component.prototype.on_fire_sys_onfling.call(this, elem, fling_handler, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp);

        return (this._popupcontrol && this._popupcontrol._is_popup()) ? true : false;
    };

    _pCombo.on_fire_oneditclick = function (obj, caretpos, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.oneditclick && this.oneditclick._has_handlers)
        {
            var evt = new nexacro.EditClickEventInfo(obj, "oneditclick", caretpos, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key);
            return this.oneditclick._fireEvent(this, evt);
        }

        return true;
    };

    _pCombo.on_fire_onitemclick = function (obj, index, itemtext, itemvalue, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, meta_key)
    {
        if (this.onitemclick && this.onitemclick._has_handlers)
        {
            var evt = new nexacro.ItemClickEventInfo(obj, "onitemclick", index, itemtext, itemvalue, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, meta_key);
            this.onitemclick._fireEvent(this, evt);
        }

        return false;
    };

    _pCombo.on_fire_canitemchange = function (obj, preindex, pretext, prevalue, postindex, posttext, postvalue)
    {
        if (this.canitemchange && this.canitemchange._has_handlers)
        {
            var evt = new nexacro.ItemChangeEventInfo(this, "canitemchange", preindex, pretext, prevalue, postindex, posttext, postvalue);
            var ret = this.canitemchange._fireCheckEvent(this, evt);
            return nexacro._toBoolean(ret);
        }

        return true;
    };

    _pCombo.on_fire_onitemchanged = function (obj, preindex, pretext, prevalue, postindex, posttext, postvalue)
    {
        if (this.onitemchanged && this.onitemchanged._has_handlers)
        {
            var evt = new nexacro.ItemChangeEventInfo(this, "onitemchanged", preindex, pretext, prevalue, postindex, posttext, postvalue);
            this.onitemchanged._fireEvent(this, evt);
        }
    };

    _pCombo.on_fire_oncloseup = function (obj, preindex, pretext, prevalue, postindex, posttext, postvalue, is_select)
    {
        var ret;
        if (this.oncloseup && this.oncloseup._has_handlers)
        {
            var evt = new nexacro.ComboCloseUpEventInfo(this, "oncloseup", preindex, pretext, prevalue, postindex, posttext, postvalue, is_select);
            ret = this.oncloseup._fireEvent(this, evt);
            ret = nexacro._toBoolean(ret);
        }

        return ret;
    };

    _pCombo.on_fire_ondropdown = function (obj)
    {
        if (this.ondropdown && this.ondropdown._has_handlers)
        {
            var evt = new nexacro.EventInfo(this, "ondropdown");
            return this.ondropdown._fireCheckEvent(this, evt);
        }

        return true;
    };

    _pCombo.on_fire_oninput = function ()
    {
        if (this.oninput && this.oninput._has_handlers)
        {
            var evt = new nexacro.InputEventInfo(this, "oninput");
            return this.oninput._fireEvent(this, evt);
        }

        return true;
    };

    _pCombo.on_fire_oninnerdatachanged = function (obj, oldvalue, newvalue, columnid, col, row)
    {
        if (this.oninnerdatachanged && this.oninnerdatachanged._has_handlers)
        {
            var evt = new nexacro.InnerdataChangedEventInfo(obj, "oninnerdatachanged", oldvalue, newvalue, columnid, col, row);
            return this.oninnerdatachanged._fireEvent(this, evt);
        }

        return true;
    };

    // TODO------------------------------
    _pCombo.on_fire_sys_onrbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        if (this.isDropdown())
        {
            var sel_info_list = this._p_combolist._selectinfo_list;

            if (this._scroll_proc)
            {
                if (sel_info_list.length)
                {
                    var last = sel_info_list.length - 1;
                    var info = sel_info_list[last];

                    if (info.index != this._p_index)
                    {
                        info.obj._stat_change("notselect", "normal");
                        sel_info_list.splice(last, 1);
                    }
                }
                return;
            }

            while (sel_info_list.length)
            {
                var down_item = sel_info_list[0].obj;
                if (down_item)
                {
                    if (!down_item.selected)
                    {
                        down_item._stat_change("notselect", "normal");
                    }

                }
                sel_info_list.shift();
            }
        }
        return;
    };


    //===============================================================
    // nexacro.Combo : Logical part
    //===============================================================
    _pCombo._createListBoxControl = function (ds)
    {
        if (!this._isUsableDataset(ds))
        {
            return;
        }

        var datacol = this._p_datacolumn;
        var codecol = this._p_codecolumn;
        var combolist = this._p_combolist;

        if (!combolist)
        {
            combolist = this._p_combolist = new nexacro._ComboListControl("combolist", 0, 0, 0, 0, null, null, null, null, null, null, this);

            combolist.set_scrolltype("vertical");
            var vscrollbartype = this._getVScrollBarType() || "auto";

            combolist.set_scrollbartype("none " + vscrollbartype);
            combolist.set_codecolumn(codecol);
            combolist.set_datacolumn(datacol);
            combolist.setInnerDataset(ds);
            combolist.set_index(this._p_index);
            combolist.set_itemheight(this._p_itemheight);
            combolist.set_cssclass(this._p_cssclass);
            combolist.set_scrollbarbarminsize(this._p_scrollbarbarminsize);
            combolist.set_scrollbardecbuttonsize(this._p_scrollbardecbuttonsize);
            combolist.set_scrollbarbaroutsize(this._p_scrollbarbaroutsize);
            combolist.set_scrollbarincbuttonsize(this._p_scrollbarincbuttonsize);
            combolist.set_scrollbarsize(this._p_scrollbarsize);
            combolist.set_scrollbartrackbarsize(this._p_scrollbartrackbarsize);

            combolist._setPopupContains(true);
            combolist.createComponent(true);
        }
        else
        {
            if (combolist._is_created)
            {
                if (combolist._innerdataset != ds)
                {
                    combolist.setInnerDataset(ds);
                }
            }
        }
    };

    _pCombo._createdListBoxControl = function (ds)
    {
        var combolist = this._p_combolist;
        if (combolist && !combolist._is_created)
        {
            combolist._setEventHandler("oncloseup", this._on_list_oncloseup, this);
            combolist._setEventHandler("onitemclick", this._on_list_onitemclick, this);

            combolist.on_created();
        }
    };

    _pCombo._createPopupControl = function ()
    {
        var popupcontrol = this._popupcontrol;
        if (!popupcontrol)
        {
            popupcontrol = this._popupcontrol = new nexacro._ComboPopupControl("combopopup", 0, 0, 0, 0, null, null, null, null, null, null, this);
            popupcontrol._setType(this._p_popuptype);

            popupcontrol.createComponent(true);
        }
    };

    _pCombo._createdPopupControl = function (attach_comp)
    {
        var popupcontrol = this._popupcontrol;
        if (popupcontrol && !popupcontrol._is_created)
        {
            popupcontrol._attach(attach_comp);
            popupcontrol.on_created();
        }
    };

    _pCombo._createPopupListBoxControl = function (ds)
    {
        if (!this._isUsableDataset(ds))
        {
            return;
        }

        this._createPopupControl();
        this._createListBoxControl(ds);

        this._createdPopupControl(this._p_combolist);
        this._createdListBoxControl();
    };

    _pCombo._createFilteredDataset = function ()
    {
        var ids = this._innerdataset;
        var fds = this._filtereddataset;
        var codecol = this._p_codecolumn;
        var datacol = this._p_datacolumn;
        var combolist = this._p_combolist;

        if (ids && (!(codecol in ids.colinfos) || !(datacol in ids.colinfos)))
        {
            return;
        }

        if (!this._isUsableDataset(ids))
        {
            return;
        }

        if (!fds)
        {
            fds = this._filtereddataset = new nexacro.DatasetBase("filter_" + this.id);
        }

        fds.set_enableevent(false);

        fds.clear();
        fds.addColumn(codecol, "string");
        fds.addColumn(datacol, "string");

        for (var i = 0, cnt = ids.getRowCount(); i < cnt; i++)
        {
            fds.insertRow(i);
            fds.setColumn(i, codecol, ids.getColumn(i, codecol));
            fds.setColumn(i, datacol, ids.getColumn(i, datacol));
        }

        fds.set_enableevent(true);

        if (combolist)
        {
            combolist._redrawListBoxContents(false);
            combolist._onRecalcScrollSize();
        }
    };

    _pCombo._recalcLayout = function ()
    {
        if (this._is_created_contents)
        {
            var comboedit = this._p_comboedit;
            var dropbutton = this._p_dropbutton;

            var client_left = this._getClientLeft();
            var client_top = this._getClientTop();
            var client_width = this._getClientWidth();
            var client_height = this._getClientHeight();

            var buttonsize = this._p_buttonsize;
            var buttonsize_w, buttonsize_h;

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

            if (dropbutton)
            {
                var btn_left = client_width - buttonsize_w;
                var btn_top = client_top;

                if (buttonsize_h < client_height)
                    btn_top = (client_height - buttonsize_h) / 2;

                dropbutton.move(btn_left, btn_top, buttonsize_w, buttonsize_h, null, null);
            }

            if (comboedit)
            {
                var edit_width = client_width - buttonsize_w;

                comboedit.move(client_left, client_top, edit_width, client_height, null, null);
            }
        }
    };

    _pCombo._recheckIndex = function ()
    {
        var idx = this._p_index;
        var txt = "";
        var val;

        var ds = this._innerdataset;
        if (ds)
        {
            var rowcount = ds.getRowCount();
            if (idx > -1 && rowcount > 0 && idx < rowcount)
            {
                val = this._getItemValue(idx);
                txt = this._getItemText(idx);
            }
            else
            {
                idx = -1;
            }
        }
        else
        {
            idx = -1;
        }

        this._setValue(val);
        this._setText(txt);
        this._setIndex(idx);
    };

    _pCombo._recheckValue = function ()
    {
        var idx = -1;
        var txt = "";
        var val = this._p_value;
        var column = this._p_codecolumn || this._p_datacolumn;

        var ds = this._innerdataset;
        if (ds)
        {
            var rowcount = ds.getRowCount();
            if (rowcount > 0 && ds._isValidColumn(column))
            {
                for (var i = 0; i < rowcount; i++)
                {
                    if (val == this._getItemValue(i))
                    {
                        idx = i;
                        txt = this._getItemText(i);
                        break;
                    }
                }
            }
        }
        else
        {
            val = undefined;
        }

        this._setValue(val);
        this._setText(txt);
        this._setIndex(idx);
    };

    _pCombo._recheckText = function ()
    {
        var idx = -1;
        var txt = this._p_text;
        var val;

        var ds = this._innerdataset;
        if (ds)
        {
            var rowcount = ds.getRowCount();
            if (rowcount > 0)
            {
                for (var i = 0; i < rowcount; i++)
                {
                    if (txt == this._getItemText(i))
                    {
                        idx = i;
                        val = this._getItemValue(i);
                        break;
                    }
                }
            }
            else
            {
                txt = "";
            }
        }
        else
        {
            txt = "";
        }

        this._setValue(val);
        this._setText(txt);
        this._setIndex(idx);
    };

    _pCombo._selectDataset = function (bInit)
    {
        if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
        {
            if (!this._filtereddataset)
            {
                this._createFilteredDataset();
            }
            else
            {
                if (bInit)
                {
                    this._clearFilteredDataset();
                }
            }

            return this._filtereddataset;
        }
        else
        {
            return this._innerdataset;
        }
    };

    _pCombo._showPopup = function (ds, index, use_timer)
    {
        this._on_showPopup(ds, index);
    };

    _pCombo._accessibility_showPopup = nexacro._emptyFn;
    _pCombo._on_showPopup = function (ds, index)
    {
        if (!this._p_visible)
            return;

        if (this._isPopupVisible())
        {
            this._closePopup();
        }

        var win = this._getWindow();
        var rowcnt = this._innerdataset.rowcount;

        if (this.on_fire_ondropdown(this))
        {
            // TODO : ondropdown에서 index변경경우 필요.
            if ((this.ondropdown && this.dropdown.preventable && this.ondropdown.defaultprevented) || !this._isUsableDataset(ds) || this._getPopupType() == "none")
            {
                return;
            }

            index = (rowcnt == this._innerdataset.rowcount) ? index : this._p_index;

            this._createPopupListBoxControl(ds);

            var combolist = this._p_combolist;
            var comboedit = this._p_comboedit;

            var popupcontrol = this._popupcontrol;
            if (popupcontrol)
            {
                popupcontrol._popupAuto();
            }

            combolist._redrawListBoxContents(false);
            combolist._onRecalcScrollSize();

            if (combolist)
            {
                combolist.set_index(index);
                combolist._refreshScroll(index, 1);

                if (win)
                {
                    win._setCaptureLock(this, true, false);
                }

                if (this._env._p_enableaccessibility)
                {
                    this._accessibility_showPopup(ds, index);
                }
            }
        }
    };

    _pCombo._applyZoomPopup = function ()
    {
        if (this._popupcontrol && this._popupcontrol._is_popup())
        {
            if (this._p_enable === false || this._p_readonly === true || this._p_visible === false) return;

            var ds = this._selectDataset();
            if (ds)
            {
                if (ds.getRowCount() <= 0)
                {
                    ds = this._innerdataset;
                }

                this._showPopup(ds, this._p_index);
            }
        }
    };

    _pCombo._accessibility_closePopup = nexacro._emptyFn;
    _pCombo._closePopup = function ()
    {
        var _window = this._getWindow();
        if (_window)
        {
            _window._releaseCaptureLock(this);
        }

        var popupcontrol = this._popupcontrol;
        if (popupcontrol)
        {
            popupcontrol._closePopup();
            nexacro._refreshWindow(_window.handle);
        }

        if (this._env._p_enableaccessibility)
        {
            this._accessibility_closePopup();
        }
    };

    _pCombo._setContents = function (str)
    {
        var ds = this._convertObjectContents(str);
        if(ds)
        {
            this.set_innerdataset(ds); 
            return true;
        }
        return false;
    };

    //===============================================================
    // nexacro.Combo : Util Function
    //===============================================================
    _pCombo._convertValueType = function (v, bapplyrule)
    {
        var ret;
        if (bapplyrule)
            ret = nexacro.Component.prototype._convertValueType.call(this, v);
        else
            ret = nexacro._isNull(v) ? v : nexacro._toString(v);

        return ret;
    };

    _pCombo._setValue = function (v)
    {
        this._p_value = v;
    };

    _pCombo._setEditValue = function (v)
    {
        var comboedit = this._p_comboedit;
        if (comboedit)
        {
            var value = comboedit._p_value;
            if (value != v)
            {
                comboedit._setValue(v);
                if (this._env._p_enableaccessibility)
                {
                    comboedit._updateAccessibilityLabel();
                    if (v)
                    {
                        // 팝업시 선택되는 item을 출력
                        let combolist = this._p_combolist;
                        if (combolist && this._isPopupVisible())
                        {
                            var ds = this._selectDataset();
                            if (ds)
                            {
                                var idx = this._getIndexFromText(ds, v);
                                var item = combolist._getItem(idx);
                                if (item)
                                {
                                    let input_elem = comboedit._input_element;
                                    if (input_elem)
                                    {
                                        this._setAccessibilityActiveDescendant(item, input_elem);
                                    }

                                    if (this._isDropdownType())
                                    {
                                        this._setAccessibilityActiveDescendant(item);
                                    }
                                }
                            }
                        }
                        if (nexacro._Browser == "Runtime" && comboedit._status == "focused")
                        {
                            comboedit._setAccessibilityLabel(v);
                            comboedit._notifyAccessibility(v, "notify");
                        }
                    }
                }
            }
        }
    };

    _pCombo._setIndex = function (v)
    {
        this._p_index = v;
    };

    _pCombo._setText = function (v)
    {
        this._p_text = v;
    };

    _pCombo._setDefaultProps = function (index, value, text)
    {
        this._default_value = value;
        this._default_text = text;
        this._default_index = index;
    }

    _pCombo._setEventHandlerToComboEdit = function ()
    {
        var comboedit = this._p_comboedit;
        if (comboedit)
        {
            var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);
            if (bMobile)
            {
                comboedit._setEventHandler("oneditclick", this._on_edit_mobile_oneditclick, this);
                this._setEventHandler("onkeydown", this._on_edit_onkeydown, this);
            }
            else
            {
                comboedit._setEventHandler("onlbuttondown", this._on_edit_onlbuttondown, this);
                comboedit._setEventHandler("oneditclick", this._on_edit_oneditclick, this);
                comboedit._setEventHandler("onkeydown", this._on_edit_onkeydown, this);
            }


            comboedit._setEventHandler("oninput", this._on_edit_oninput, this);
            //comboedit._setEventHandler("onlbuttonup", this.on_notify_edit_onlbuttonup, this);
            //comboedit._setEventHandler("ontouchstart", this.on_notify_edit_ontouchstart, this);
        }
    };

    _pCombo._setEventHandlerToDropButton = function ()
    {
        var dropbutton = this._p_dropbutton;
        if (dropbutton)
        {
            if (nexacro._isTouchInteraction && nexacro._SupportTouch)
            {
                dropbutton._setEventHandler("onclick", this._on_drop_mobile_onclick, this);
            }
            else
            {
                dropbutton._setEventHandler("onclick", this._on_drop_onclick, this);
                dropbutton._setEventHandler("onlbuttondown", this._on_drop_onlbuttondown, this);
            }
        }
    };

    _pCombo._setEventHandlerToListBox = function ()
    {
        var combolist = this._p_combolist;
        if (combolist)
        {
            combolist._setEventHandler("onitemclick", this._on_list_onitemclick, this);
            combolist._setEventHandler("canitemchange", this.on_notify_list_canitemchange, this);
            combolist._setEventHandler("onitemchanged", this.on_notify_list_onitemchanged, this);
        }
    };

    _pCombo._setInnerDatasetStr = function (str)
    {
        this._removeEventHandlerToInnerDataset();

        if (str)
        {
            str = str.replace("@", "");
            var _v = this._findDataset(str);
            this._innerdataset = _v ? _v : "";
            this._p_innerdataset = str;
        }
        else
        {
            this._innerdataset = null;
            this._p_innerdataset = "";
        }
    };

    _pCombo._setDefaultCaret = function ()
    {
        var edit = this._p_comboedit;
        if (edit)
        {
            edit.setCaretPos(0);
        }
    };

    _pCombo._setFocusToNextComponent = function ()
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

    _pCombo._getColumn = function (ds, index, column)
    {
        return ds.getColumn(index, column);
    };

    _pCombo._getRowCount = function (ds)
    {
        return ds.getRowCount();
    };

    _pCombo._getItemValue = function (index)
    {
        var ds = this._innerdataset;
        var column = this._p_codecolumn || this._p_datacolumn;

        if (ds && column)
        {
            var rtn = this._getColumn(ds, index, column);
            if (rtn == undefined && (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike") && this._filtereddataset)
            {
                rtn = this._filtereddataset.getColumn(index, column);
            }

            return this._convertValueType(rtn, true);
        }

        return null;
    };

    _pCombo._getItemText = function (index)
    {
        var ds = this._innerdataset;
        var column = this._p_datacolumn || this._p_codecolumn;

        if (ds && column)
        {
            var rtn = this._getColumn(ds, index, column);
            if (rtn == undefined && (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike") && this._filtereddataset)
            {
                rtn = this._filtereddataset.getColumn(index, column);
            }

            return nexacro._toString(rtn);
        }

        return null;
    };

    _pCombo._getIndexFromValue = function (ds, value)
    {
        if (value instanceof nexacro.Decimal)
        {
            value = value.toString();
        }

        var column = this._p_codecolumn || this._p_datacolumn;
        if (!ds._isValidColumn(column)) return -1;

        var row_count = this._getRowCount(ds);
        for (var i = 0; i < row_count; i++)
        {
            var v = this._getItemValue(i);
            if (v instanceof nexacro.Decimal)
            {
                v = v.toString();
            }

            if (value == v)
            {
                var newval = value;
                var preval = v;

                if (newval === 0)
                    newval = newval + "";
                if (preval === 0)
                    preval = preval + "";

                if (newval == preval)
                {
                    return i;
                }
            }
        }

        return -1;
    };

    _pCombo._getIndexFromText = function (ds, text)
    {
        var row_count = this._getRowCount(ds);
        for (var i = 0; i < row_count; i++)
        {
            if (this._getItemText(i) == text)
            {
                return i;
            }
        }

        return -1;
    };

    _pCombo._getRawToListindex = function (idx)
    {
        if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
        {
            var fds = this._getFilteredDataset();
            var fdsArr = fds._viewRecords;
            var row_count = fdsArr.length;

            for (var i = 0; i < row_count; i++)
            {
                if (fdsArr[i]._rawidx == idx)
                {
                    return i;
                }
            }
        }
        return idx;
    };

    _pCombo._getRawIndex = function (fds, idx)
    {
        var ids = this._innerdataset;

        if (idx == -1 || (fds._viewRecords.length <= idx))
        {
            return -1;
        }

        var rawidx = fds._viewRecords[idx]._rawidx;
        var idsArr = ids._rawRecords;
        var row_count = idsArr.length;

        for (var i = 0; i < row_count; i++)
        {
            if (idsArr[i]._rawidx == rawidx)
            {
                return rawidx;
            }
        }

        return -1;
    };

    _pCombo._getPopupType = function ()
    {
        return this._p_popuptype ? this._p_popuptype : "normal";
    };

    _pCombo._isUsableDataset = function (ds)
    {
        if (!ds)
        {
            return false;
        }
        else
        {
            if (ds.getRowCount <= 0)
            {
                return false;
            }
            if (!this._p_datacolumn && !this._p_codecolumn)
            {
                return false;
            }
        }

        return true;
    };

    _pCombo._isPopupVisible = function ()
    {
        var popupcontrol = this._popupcontrol;
        if (popupcontrol)
        {
            return popupcontrol._is_popup();
        }

        return false;
    };

    _pCombo._clearFilteredDataset = function ()
    {
        if (this._filtereddataset)
        {
            this._filtereddataset.set_filterstr("");
        }
    };

    _pCombo._setAccessibilityInfoByHover = function (control)
    {
        if (this._isPopupVisible())
        {
            var combolist = this._p_combolist;
            return combolist._setAccessibilityInfoByHover(control);
        }
        else
        {
            return this._setAccessibilityNotifyEvent();
        }
    };

    _pCombo._clearAccessibilityInfoByHover = function ()
    {
        var combolist = this._p_combolist;
        if (combolist)
        {
            combolist._clearAccessibilityInfoByHover();
        }
    };

    _pCombo._getPopupSizeArr = function ()
    {
        var size = this._p_popupsize;
        if (!size)
            return;
        size = size.split(/\s+/);
        var width = +size[0];
        var height = size[1] ? +size[1] : undefined;
        return { width: width, height: height };
    };

    _pCombo._cancelEvent = function ()
    {
        this._processing_keyfilter = false;
    };

    _pCombo._isDropdownType = function ()
    {
        return (this._p_type === "dropdown");
    };

    _pCombo = null;
    //delete _pCombo;

    //==============================================================================
    // nexacro._ComboEditControl
    //==============================================================================
    nexacro._ComboEditControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay)
    {
        nexacro.Edit.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay);
    };

    var _pComboEditControl = nexacro._createPrototype(nexacro.Edit, nexacro._ComboEditControl);
    nexacro._ComboEditControl.prototype = _pComboEditControl;
    _pComboEditControl._type_name = "EditControl";

    /* default properties */
    /* internal variable */
    _pComboEditControl._is_subcontrol = true;
    _pComboEditControl._is_subfocused = false;

    /* status */
    /* event list */
    /* accessibility */
    _pComboEditControl._p_accessibilityrole = "combobox";

    //===============================================================
    // nexacro._ComboEditControl : Create & Update
    //===============================================================

    //===============================================================
    // nexacro._ComboEditControl : Override
    //===============================================================

    _pComboEditControl._getFromComponent = function (comp)
    {
        var parent = comp._p_parent;
        if (parent && parent._isPopupVisible())
        {
            return parent;
        }
        else
        {
            return nexacro.Component.prototype._getFromComponent.call(this, comp);
        }
    };

    _pComboEditControl.on_keydown_basic_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        if (this._p_readonly || !this._isEnable())
        {
            return;
        }

        var input_elem = this._input_element;
        if (input_elem)
        {
            this._processing_keyfilter = true;

            if (this._env._p_enableaccessibility)
            {
                if (nexacro._Browser == "Runtime")
                {
                    this._is_subfocused = true;
                }
            }

            if (nexacro._OS == "Mac OS" || nexacro._OS == "OSX")
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

                if (this._undostack && !this._p_parent._isDropdownType())
                {
                    this._undostack.undo();
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

            if (this._undostack)
            {
                var pos = input_elem.getElementCaretPos();
                if (pos && pos != -1)
                {
                    this._undostack.update(pos.begin, pos.end);
                }
            }
        }
    };

    if (nexacro._Browser == "Runtime")
    {
        _pComboEditControl.on_keyup_basic_action = function (/*keycode, alt_key, ctrl_key, shift_key, refer_comp*/)
        {
            this._processing_keyfilter = false;
        };
    }
    else
    {
        _pComboEditControl.on_keyup_basic_action = function (/*keycode, alt_key, ctrl_key, shift_key, refer_comp*/)
        {
            this._processing_keyfilter = true;
        };
    }

    //===============================================================
    // nexacro._ComboEditControl : Properties
    //===============================================================
    _pComboEditControl.set_value = function (v)
    {
        nexacro.Edit.prototype.set_value.call(this, v);

        this._setAccessibilityValue(this._p_text, false);
    };

    //===============================================================
    // nexacro._ComboEditControl : Events
    //===============================================================
    _pComboEditControl.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this._p_parent, from_refer_comp, meta_key);
    };
    _pComboEditControl = null;
    //delete _pComboEditControl;

    //==============================================================================
    // nexacro._ComboButtonControl
    //==============================================================================
    nexacro._ComboButtonControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pComboButtonControl = nexacro._createPrototype(nexacro.Button, nexacro._ComboButtonControl);
    nexacro._ComboButtonControl.prototype = _pComboButtonControl;
    _pComboButtonControl._type_name = "ButtonControl";

    /* internal variable */
    _pComboButtonControl._is_subcontrol = true;
    _pComboButtonControl._is_focus_accept = false;

    //===============================================================
    // nexacro._ComboButtonControl : Override
    //===============================================================

    //===============================================================
    // nexacro._ComboEditControl : Events
    //===============================================================
    _pComboButtonControl.on_focus_basic_action = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        // not used
        var combo = this._p_parent;
        if (combo)
        {
            var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);
            if (bMobile)
            {
                nexacro.Component.prototype.on_focus_basic_action.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);
            }
            else
            {
                combo._apply_setfocus(evt_name);
            }
        }

        if (this._env._p_enableaccessibility)
        {
            this._setAccessibilityStatFocus(evt_name);
        }
    };

    _pComboButtonControl._on_click = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key)
    {
        if (!this._is_alive) return;

        if (this._p_visible && this._p_parent._isEnable() && this._p_enableevent)
        {
            var clientXY = this._getClientXY(canvasX, canvasY);
            this.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientXY[0], clientXY[1], this, this, meta_key);
            this.on_click_basic_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key);
        }
    };

    _pComboButtonControl = null;
    //delete _pComboButtonControl;

    //==============================================================================
    // nexacro._ComboListControl
    //==============================================================================
    nexacro._ComboListControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.ListBox.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._overedItem = null;
    };

    var _pComboListControl = nexacro._createPrototype(nexacro.ListBox, nexacro._ComboListControl);
    nexacro._ComboListControl.prototype = _pComboListControl;
    _pComboListControl._type_name = "ListBoxControl";
    _pComboListControl._is_subcontrol = true;

    /* default properties */

    /* internal variable */
    _pComboListControl._overeditemindex = -1;

    /* status */

    /* event list */
    _pComboListControl._event_list = {
        "onitemclick": 1, "onitemdblclick": 1,
        "onkeydown": 1, "onkeyup": 1,
        "onkillfocus": 1, "onsetfocus": 1,
        "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1, "onmousedown": 1, "onmouseup": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1,
        "onmove": 1, "onsize": 1,
        "canitemchange": 1, "onitemchanged": 1,
        "oncloseup": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
        "onvscroll": 1, "onhscroll": 1, "ondevicebuttonup": 1
    };

    //===============================================================
    // nexacro._ComboListControl : Create & Update
    //===============================================================

    //===============================================================
    // nexacro._ComboListControl : Override
    //===============================================================

    //===============================================================
    // nexacro._ComboListControl : Properties
    //===============================================================

    //===============================================================
    // nexacro._ComboListControl : Methods
    //===============================================================

    //===============================================================
    // nexacro._ComboListControl : Events
    //===============================================================
    _pComboListControl.on_notify_item_onlbuttondown = function (obj, e)
    {
        this._do_select(obj.index, false);
    };

    _pComboListControl.on_notify_item_onlbuttonup = function (obj, e)
    {
        var up_item = this._upitem;
        if (up_item)
        {
            var rowobj;

            if (nexacro._isTouchInteraction && nexacro._SupportTouch)
            {
                var win = this._getWindow();
                var touch_manager = win ? win._gesture_manager : null;
                if (touch_manager && touch_manager._is_ondrag)
                {
                    rowobj = this._get_rowobj_status("selected", "userstatus");
                    if (rowobj)
                        this._do_deselect(rowobj.index);

                    return;
                }
            }

            if ((up_item.index >= 0) && this._contains(up_item))
            {
                obj = up_item;
            }
            else
            {
                rowobj = this._get_rowobj_status("selected", "userstatus");
                if (rowobj)
                {
                    this._do_deselect(rowobj.index);
                }
                return;
            }

            this.on_fire_onitemclick(obj, obj.index, obj.text, obj.value, e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.metakey);
        }
    };

    _pComboListControl.on_notify_item_ontouchstart = function (obj, e)
    {
        this._do_select(obj.index, false);
    };

    _pComboListControl.on_notify_item_ontouchend = function (obj, e)
    {
        var info = (e.changedtouchinputinfos && e.changedtouchinputinfos[0]) ? e.changedtouchinputinfos[0] : null;
        if (info)
        {
            e.button = "lbutton";
            e.altkey = false;
            e.ctrlkey = false;
            e.shiftkey = false;
            e.metakey = false;
            e.screenx = info.screenx;
            e.screeny = info.screeny;
            e.canvasx = info.canvasx;
            e.canvasy = info.canvasy;
            e.clientx = info.clientx;
            e.clienty = info.clienty;
        }

        this.on_notify_item_onlbuttonup(obj, e);
    };

    _pComboListControl.on_notify_listbox_onkeydown = function (obj, e)
    {

    };

    _pComboListControl.on_notify_item_onmouseenter = function (obj, e)
    {

    };

    _pComboListControl.on_notify_item_onmouseleave = function (obj, e)
    {

    };

    _pComboListControl.on_notify_item_onmousemove = function (obj, e)
    {
        if (this._overeditemindex > -1)
        {
            var rowobj = this._getItem(this._overeditemindex);
            if (rowobj)
            {
                rowobj._changeStatus("mouseover", false);
            }
        }
    };

    _pComboListControl.on_focus_basic_action = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        var combo = this._p_parent;
        if (combo)
        {
            if (this._env._p_enableaccessibility)
            {
                combo._setAccessibilityStatFocus(evt_name);
            }

            combo._apply_setfocus(evt_name);
        }
    };

    _pComboListControl.on_fire_user_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)
    {
        return nexacro.Component.prototype.on_fire_user_onkeydown.call(this, keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
    };

    _pComboListControl.on_fire_user_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        return nexacro.Component.prototype.on_fire_user_onlbuttonup.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
    };

    _pComboListControl.on_fire_sys_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        nexacro.Component.prototype.on_fire_sys_onlbuttonup.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key);
    };

    _pComboListControl.on_fire_sys_ontouchstart = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {
        nexacro.Component.prototype.on_fire_sys_ontouchstart.call(this, touchinfos, changedtouchinfos, from_comp, from_refer_comp);
    };

    _pComboListControl.on_fire_sys_ontouchend = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {
        nexacro.Component.prototype.on_fire_sys_ontouchend.call(this, touchinfos, changedtouchinfos, from_comp, from_refer_comp);
    };

    _pComboListControl.on_fire_sys_ontouchcancel = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {

    };

    _pComboListControl.on_fire_oncloseup = function (obj)
    {
        var rowobj = this._get_rowobj_status("mouseover", "status");
        if (rowobj)
        {
            rowobj._changeStatus("mouseover", false);
        }

        if (this.oncloseup && this.oncloseup._has_handlers)
        {
            return this.oncloseup._fireEvent(this);
        }

        return false;
    };

    //===============================================================
    // nexacro._ComboListControl : Logical part
    //===============================================================
    _pComboListControl._redrawListBoxContentsAfter = nexacro._emptyFn;

    _pComboListControl._createListItem = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        return new nexacro._ComboListItemControl(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    _pComboListControl._createListItemControl = function (index)
    {
        var ds = this._innerdataset;

        if (!ds)
            return null;

        var dataCol = this._p_datacolumn ? this._p_datacolumn : this._datacolumn;
        var codeCol = this._p_codecolumn ? this._p_codecolumn : this._codecolumn;
        var txt = ds.getColumn(index, dataCol);
        txt = nexacro._toString(txt);
        var val = ds.getColumn(index, codeCol);
        val = this._convertValueType(val, true);

        var itemheight = this._getItemHeight();
        var client_w = this._getClientWidth();

        var item = this._createListItem("item_" + index, 0, index * itemheight, Math.max(this._contents_maxwidth, client_w), itemheight, null, null, null, null, null, null, this);
        item.set_value(val);
        item.set_text(txt);
        item.set_index(index);
        item.set_selected(false);
        item.set_readonly(this._p_readonly);

        if (this._env._p_enableaccessibility)
        {
            this._setItemAccessibility(item);
        }

        item._setEventHandler("onlbuttondown", this.on_notify_item_onlbuttondown, this);
        item._setEventHandler("onlbuttonup", this.on_notify_item_onlbuttonup, this);
        item._setEventHandler("ontouchstart", this.on_notify_item_ontouchstart, this);
        item._setEventHandler("ontouchend", this.on_notify_item_ontouchend, this);
        item._setEventHandler("onmouseenter", this.on_notify_item_onmouseenter, this);
        item._setEventHandler("onmouseleave", this.on_notify_item_onmouseleave, this);
        item._setEventHandler("onmousemove", this.on_notify_item_onmousemove, this);

        item.createComponent(this._is_created ? false : true);

        if (this._p_index == index)
        {
            item.set_selected(true);
        }

        return item;
    };

    _pComboListControl._change_status_item_from_key = function (curidx, nextidx)
    {
        var currowobj = this._getItem(curidx);
        var rowobj = this._getItem(nextidx);

        if (currowobj)
        {
            currowobj._changeStatus("mouseover", false);
        }
        if (rowobj)
        {
            rowobj._changeStatus("mouseover", true);
            this._overeditemindex = rowobj.index;
        }
    };

    _pComboListControl._setAccessibilityNotifyEvent = function (direction)
    {
        if (this._is_accessibility_changeIdx)
        {
            this._is_accessibility_changeIdx = false;
            return this._p_parent._setAccessibilityNotifyEvent(direction);
        }
        else
        {
            return nexacro.ListBox.prototype._setAccessibilityNotifyEvent.call(this, direction);
        }
    };

    //===============================================================
    // nexacro._ComboListControl : Util Function
    //===============================================================
    _pComboListControl._changeIndex = function (v)
    {
        if (this._p_index != v)
        {
            var dataset = this._innerdataset;
            var postindex = parseInt(v, 10) | 0;

            if (dataset && (this._p_codecolumn || this._p_datacolumn))
            {
                var datavalue = dataset.getColumn(postindex, this._p_datacolumn || this._p_codecolumn);
                var codevalue = dataset.getColumn(postindex, this._p_codecolumn || this._p_datacolumn);

                var posttext = datavalue == undefined ? "" : nexacro._toString(datavalue);
                var postvalue = codevalue;

                this._accessibility_index = this._p_index = postindex;
                this._p_text = posttext;
                this._p_value = postvalue;

                this._selectinfo.obj = null;
                this._selectinfo.index = postindex;
                this._selectinfo.text = posttext;
                this._selectinfo.value = postvalue;

                return true;
            }
        }

        return false;
    };

    _pComboListControl._get_rowobj_status = function (status, flag)
    {
        var buffer_pages = this._buffer_pages;
        if (buffer_pages)
        {
            var rowobjs, rowobj;
            for (var i = 0, n = buffer_pages.length; i < n; i++)
            {
                rowobjs = buffer_pages[i];
                if (rowobjs)
                {
                    for (var j = 0, jlen = rowobjs.length; j < jlen; j++)
                    {
                        rowobj = rowobjs[j];
                        if (rowobj &&
                            ((flag == "status" && rowobj._status == status) || (flag == "userstatus" && rowobj._userstatus == status)))
                        {
                            return rowobj;
                        }
                    }
                }
            }
        }

        return null;
    };

    _pComboListControl._get_all_rowobj_status = function (status, flag)
    {
        var ret = [];
        var buffer_pages = this._buffer_pages;
        if (buffer_pages)
        {
            var rowobjs, rowobj;
            for (var i = 0, n = buffer_pages.length; i < n; i++)
            {
                rowobjs = buffer_pages[i];
                if (rowobjs)
                {
                    for (var j = 0, jlen = rowobjs.length; j < jlen; j++)
                    {
                        rowobj = rowobjs[j];
                        if (rowobj &&
                            ((flag == "status" && rowobj._status == status) || (flag == "userstatus" && rowobj._userstatus == status)))
                        {
                            ret.push(rowobj);
                        }
                    }
                }
            }
        }

        return ret;
    };

    _pComboListControl = null;
    //delete _pComboListControl;

    //==============================================================================
    // nexacro._ComboListItemControl
    //==============================================================================
    nexacro._ComboListItemControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro._ListBoxItemControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pComboListItemControl = nexacro._createPrototype(nexacro._ListBoxItemControl, nexacro._ComboListItemControl);
    nexacro._ComboListItemControl.prototype = _pComboListItemControl;

    /* default properties */
    /* internal variable */
    /* status */
    /* event list */
    /* accessibility */
    //===============================================================
    // nexacro._ComboListItemControl : Create & Update
    //===============================================================

    //===============================================================
    // nexacro._ComboListItemControl : Override
    //===============================================================

    //===============================================================
    // nexacro._ComboListItemControl : Properties
    //===============================================================

    //===============================================================
    // nexacro._ComboListItemControl : Methods
    //===============================================================

    //===============================================================
    // nexacro._ComboListItemControl : Events
    //===============================================================
    _pComboListItemControl.on_fire_sys_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        var list = this._p_parent;
        if (list)
        {
            var window = this._getWindow();
            var comp = window.findComponent(from_elem);

            list._upitem = comp;
        }
        return nexacro.Component.prototype.on_fire_sys_onlbuttonup.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key);
    };

    _pComboListItemControl.on_fire_sys_ontouchend = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {
        var list = this._p_parent;
        if (list)
        {
            var comp;
            var window = this._getWindow();
            var touchinfo = touchinfos ? touchinfos[0] : null;
            if (touchinfo)
            {
                var elem = touchinfo.target;
                comp = window.findComponent(elem);
            }
            else
            {
                comp = window.findComponent(from_comp);
            }

            list._upitem = comp;
        }
        return nexacro.Component.prototype.on_fire_sys_ontouchend.call(this, touchinfos, changedtouchinfos, from_comp, from_refer_comp);
    };
    _pComboListItemControl.on_tap_basic_action = function (elem, canvasX, canvasY, screenX, screenY, refer_comp)
    {
        return;

    };
    //===============================================================
    // nexacro._ComboListItemControl : Logical part
    //===============================================================

    //===============================================================
    // nexacro._ComboListItemControl : Util Function
    //===============================================================

    _pComboListItemControl = null;
    //delete _pComboListItemControl;

    //==============================================================================
    // nexacro._ComboPopupControl
    //==============================================================================
    nexacro._ComboPopupControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.PopupControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pComboPopupControl = nexacro._createPrototype(nexacro.PopupControl, nexacro._ComboPopupControl);
    nexacro._ComboPopupControl.prototype = _pComboPopupControl;
    _pComboPopupControl._type_name = "popupCombo";

    /* accessibility */

    /* internal variable */

    //===============================================================
    // nexacro._ComboPopupControl : Override
    //===============================================================

    //===============================================================
    // nexacro._ComboPopupControl : Properties
    //===============================================================

    //===============================================================
    // nexacro._ComboPopupControl : Logical part
    //===============================================================
    _pComboPopupControl._popupAuto = function ()
    {
        var pos = {};
        var win = this._getWindow();

        // [24/06/05] [RP 99828][그리드콤보(Combo)펼쳤을때...] 처리
        // Cy_GlobalAPI.cpp > __getElementPositionInFrame 에서 ptOffset.y 좌표값을 제대로 가져오지 못해 Flush 필요함.
        // Cy_GlobalAPI.cpp > __getElementPositionInFrame 내부에서 FlushCommand를 처리하기에는 호출 빈도가 높으므로 Combo popup에 한해 Flush진행.
        nexacro._flushCommand(win);
        if (this._type == "center")
        {
            pos = this._getPopupPositionCenter();

            var root_frame = this._getRootFrame();
            if (root_frame)
            {

                this._popupBy(root_frame, pos.left, pos.top, pos.width, pos.height, true);
            }
        }
        else
        {
            pos = this._getPopupPosition();

            this._popupBy(this._p_parent, pos.left, pos.top, pos.width, pos.height);
        }
    };

    //===============================================================
    // nexacro._ComboPopupControl : Util Function
    //===============================================================
    _pComboPopupControl._setType = function (type)
    {
        this._type = type;
    };

    _pComboPopupControl._getElementPosition = function ()
    {
        // for Preview
        var combo = this._p_parent;
        if (combo)
        {
            return nexacro._getElementPositionInFrame(combo.getElement());
        }

        return {};
    };
    _pComboPopupControl._getPopupParentPos = function ()
    {
        var combo = this._p_parent;
        var combo_size = [combo._adjust_width, combo._adjust_height];
        var combo_elem_pos = nexacro._getElementPositionInFrame(combo.getElement());

        var xgap = 0, ygab = 0;
        /* rootframe의 top 값이 음수이면 보정 */
        if (nexacro._Browser == "MobileSafari")
        {
            var rootframe = this._getRootFrame();
            if (rootframe)
            {
                var rootframe_pos = nexacro._getElementPositionInFrame(rootframe.getElement());
                xgap = rootframe_pos.x < 0 ? rootframe_pos.x * (-1) : 0;
                ygab = rootframe_pos.y < 0 ? rootframe_pos.y * (-1) : 0;
            }
        }

        return { "x": combo_elem_pos.x, "y": combo_elem_pos.y, "width": combo_size[0], "height": combo_size[1], "xgap": xgap, "ygap": ygab };
    }

    _pComboPopupControl._getPopupPosition = function ()
    {
        var popup_left = 0;
        var popup_top = 0;
        var popup_width = 0;
        var popup_height = 0;
        var xgap = 0;
        var ygap = 0;

        var combo = this._p_parent;
        var combolist = this._attached_comp;
        var rootframe = this._getRootFrame();
        if (combo && combolist && rootframe)
        {
            var win = this._getWindow();

            var minimum_row = 3;

            var combopos = this._getPopupParentPos();
            var combo_elem_pos = { "x": combopos.x, "y": combopos.y };
            var combo_size = [combopos.width, combopos.height];
            xgap = combopos.xgap;
            ygap = combopos.ygap;

            var combo_vscrollsize = combo._getVScrollBarSize();
            var combo_displayrowcount = combo._p_displayrowcount;
            var combo_roucount = combo._selectDataset() ? combo._selectDataset().getRowCount() : 0;
            var combo_popupsize = combo._getPopupSizeArr();

            var combolist_size = combolist._on_getFitSize();
            var combolist_itemheight = combolist._getItemHeight();

            var combolist_bordersize = combolist._getCurrentStyleBorder();
            combolist_bordersize = combolist_bordersize ? combolist_bordersize._getBorderHeight() : 0;

            var combolist_paddingsize = combolist._getCurrentStylePadding();
            combolist_paddingsize = combolist_paddingsize ? combolist_paddingsize.top + combolist_paddingsize.bottom : 0;

            var combolist_stylesize = combolist_bordersize + combolist_paddingsize;
            var combolist_minimum_height;
            var combolist_height;

            //var screen_height = nexacro._getScreenAvailHeight();

            var rootframe_elem_pos = nexacro._getElementPositionInFrame(rootframe.getElement());
            //var rootframe_screen_pos = nexacro._getElementScreenPosition(rootframe.getElement());


            var win_left = nexacro._allow_default_pinchzoom ? nexacro._getWindowOffsetPosition(win).left : rootframe_elem_pos.x;

            var view_height = nexacro._getWindowHandleClientHeight(win.handle);
            /*
            if (nexacro._Browser != "Runtime")
            {
                // screen 높이에 따라 계산 되어야 하므로 보정 
                window_width = Math.round(window_width * nexacro._getDevicePixelRatio(rootframe.getElement()));
                window_height = Math.round(window_height * nexacro._getDevicePixelRatio(rootframe.getElement()));
            }
            */
            if (nexacro._Browser == "Runtime")
                view_height = Math.round(view_height / nexacro._getDevicePixelRatio(rootframe.getElement()));

            var upper_space_height = combo_elem_pos.y;
            var below_space_height = view_height - (combo_elem_pos.y + combo_size[1]);

            popup_top = combo_size[1];

            if (combo_popupsize)
            {
                popup_width = combo_popupsize.width;
                popup_height = combo_popupsize.height ? combo_popupsize.height : popup_height;
            }
            else
            {
                popup_width = Math.max(combo_size[0], combolist_size[0]);
            }

            if (combo_displayrowcount == null)
            {
                combolist_minimum_height = (combo_roucount < minimum_row ? combo_roucount : minimum_row) * combolist_itemheight + combolist_stylesize;
                combolist_height = popup_height ? popup_height : (combo_roucount * combolist_itemheight) + combolist_stylesize;

                if (below_space_height > combolist_minimum_height) // enough below space
                {
                    if (below_space_height > combolist_height)
                    {
                        popup_height = combolist_height;
                    }
                    else
                    {
                        popup_height = below_space_height;

                        if (!combo_popupsize)
                        {
                            if (popup_width == combolist_size[0])
                            {
                                popup_width += combo_vscrollsize;
                            }
                        }
                    }
                }
                else // not enough below space
                {
                    if (upper_space_height > combolist_minimum_height)// enough upper space
                    {
                        if (upper_space_height > combolist_height)
                        {
                            popup_top = -combolist_height;
                            popup_height = combolist_height;
                        }
                        else
                        {
                            popup_top = -upper_space_height;
                            popup_height = upper_space_height;
                        }
                    }
                    else
                    {
                        if (below_space_height > upper_space_height)
                        {
                            popup_height = below_space_height;
                        }
                        else
                        {
                            popup_top = -upper_space_height;
                            popup_height = upper_space_height;
                        }
                    }
                }
            }
            else
            {
                if (combo_roucount > combo_displayrowcount)
                {
                    combo_roucount = combo_displayrowcount;

                    if (!combo_popupsize && popup_width <= combolist_size[0] + combo_vscrollsize)
                    {
                        popup_width = combolist_size[0] + combo_vscrollsize;
                    }
                }

                combolist_minimum_height = combo_roucount * combolist_itemheight + combolist_stylesize;

                if (below_space_height > combolist_minimum_height) // enough below space
                {
                    if (popup_height == 0)
                        popup_height = combolist_minimum_height;
                }
                else // not enough below space
                {
                    if (upper_space_height > combolist_minimum_height)// enough upper space
                    {
                        popup_top = -combolist_minimum_height;
                        popup_height = combolist_minimum_height;
                    }
                    else // not enough below space and upper space
                    {
                        if (below_space_height > upper_space_height)
                        {
                            popup_height = below_space_height;
                        }
                        else
                        {
                            popup_top = -upper_space_height;
                            popup_height = upper_space_height;
                        }
                    }
                }
            }


            var client_width = win ? nexacro._getWindowHandleClientWidth(win.handle) : 0;

            if (combo_elem_pos.x < win_left)
            {
                if (nexacro._Browser == "MobileSafari")
                    popup_left = 0;
                else
                    popup_left += win_left - combo_elem_pos.x;
            }
            else if (combo_elem_pos.x + popup_width > win_left + client_width)
            {
                popup_left -= (combo_elem_pos.x + popup_width) - (win_left + client_width);

                if (popup_left < (win_left - combo_elem_pos.x))
                {
                    popup_left = win_left - combo_elem_pos.x;
                }
            }
        }

        return { left: popup_left + xgap, top: popup_top + ygap, width: popup_width, height: popup_height };
    };

    _pComboPopupControl._getPopupPositionCenter = function ()
    {
        var popup_left = 0;
        var popup_top = 0;
        var popup_width = 0;
        var popup_height = 0;

        var window_width = 0;
        var window_height = 0;

        var combo = this._p_parent;
        var combolist = this._attached_comp;
        if (combo && combolist)
        {
            var add_addressbar_height = 0;
            var win = this._getWindow();
            if (win)
            {
                const iswindow = nexacro._ishandleWindow(win.handle);
                if (!nexacro.ismodule && nexacro._OS == "iOS" && nexacro._Browser == "MobileSafari" && iswindow)
                {
                    window_width = win.handle.innerWidth;
                    window_height = win.handle.innerHeight;
                    // ios browser에서 주소창이 갑작스럽게 생겨날경우 document.body에 scroll값이 생길때가 있다.
                    // 전체 화면 height 값에서 이걸 분간할 방법이 없기 때문에, 최종 top값에 보정시켜준다.
                    var body_scroll = nexacro._getWindowDestinationHandle(win.handle).scrollTop;
                    if (body_scroll > 0)
                        add_addressbar_height += body_scroll * 2;
                }
                else
                {
                    // root 기준 중앙
                    var frame = win.root;
                    window_width = frame._p_width;
                    window_height = frame._p_height;


                }
            }
            if (nexacro._Browser == "Runtime")
            {
                // screen 높이에 따라 계산 되어야 하므로 보정 
                window_width = Math.round(window_width / nexacro._getDevicePixelRatio(combo.getElement()));
                window_height = Math.round(window_height / nexacro._getDevicePixelRatio(combo.getElement()));
            }
            var combo_vscrollsize = combo._getVScrollBarSize();
            var combo_displayrowcount = combo._p_displayrowcount;
            var combo_roucount = combo._selectDataset() ? combo._selectDataset().getRowCount() : 0;
            var combo_popupsize = combo._getPopupSizeArr();

            var combolist_size = combolist._on_getFitSize();
            var combolist_itemheight = combolist._getItemHeight();

            var combolist_bordersize = combolist._getCurrentStyleBorder();
            combolist_bordersize = combolist_bordersize ? combolist_bordersize._getBorderHeight() : 0;

            var combolist_paddingsize = combolist._getCurrentStylePadding();
            combolist_paddingsize = combolist_paddingsize ? combolist_paddingsize.top + combolist_paddingsize.bottom : 0;

            var combolist_stylesize = combolist_bordersize + combolist_paddingsize;

            popup_width = combo_popupsize ? combo_popupsize.width : combolist_size[0];
            if (combo_popupsize && combo_popupsize.height)
            {
                popup_height = combo_popupsize.height;
            }
            else
                popup_height = (combo_roucount * combolist_itemheight) + combolist_stylesize;

            if (combo_displayrowcount == null)
            {
                if (popup_height > window_height)
                {
                    popup_height = window_height;
                    popup_width += combo_vscrollsize;
                }
            }
            else
            {
                if (combo_roucount > combo_displayrowcount)
                {
                    popup_height = (combo_displayrowcount * combolist_itemheight) + combolist_stylesize;

                    if (popup_height > window_height)
                    {
                        popup_height = window_height;
                    }

                    popup_width += combo_vscrollsize;
                }
                else
                {
                    if (popup_height > window_height)
                    {
                        popup_height = window_height;
                        popup_width += combo_vscrollsize;
                    }
                }
            }

            popup_left = ((window_width / 2) - (popup_width / 2));
            popup_top = ((window_height / 2) - (popup_height / 2));
            popup_top = popup_top < 0 ? 0 : popup_top;
            popup_top += add_addressbar_height;
        }

        return { left: popup_left, top: popup_top, width: popup_width, height: popup_height };
    };

    _pComboPopupControl._setZoom = function (scale)
    {
        var elem = this.getElement();
        if (elem.setElementZoom)
        {
            elem.setElementZoom(scale * 100);
        }
        else if (nexacro.ScrollableControlElement.prototype.setElementZoom)
        {
            nexacro.ScrollableControlElement.prototype.setElementZoom.call(elem, scale * 100);
        }
    };

    _pComboPopupControl = null;
    //delete _pComboPopupControl;
}