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
if (!nexacro.MultiCombo)
{
    //==============================================================================
    // nexacro.MultiCombo
    //==============================================================================
    nexacro.MultiCombo = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        this._onlydisplay = onlydisplay;

        this._select_multi = { "items": [], "map": {}, "keys": [], "length": 0, "lastselected": null, "tagselect": -1 };
    };

    var _pMultiCombo = nexacro._createPrototype(nexacro.Component, nexacro.MultiCombo);
    nexacro.MultiCombo.prototype = _pMultiCombo;
    _pMultiCombo._type_name = "MultiCombo";

    /* control */
    _pMultiCombo._p_dropbutton = null;
    _pMultiCombo._p_multicombolist = null;
    _pMultiCombo._p_multicombotagbox = null;
    _pMultiCombo._p_multicombotext = null;
    _pMultiCombo._popupcontrol = null;

    /* default properties */
    _pMultiCombo._p_value = undefined;
    _pMultiCombo._p_index = "-1";
    _pMultiCombo._p_text = "";

    _pMultiCombo._p_codecolumn = "";
    _pMultiCombo._p_datacolumn = "";
    _pMultiCombo._p_readonlycolumn = "";
    _pMultiCombo._p_innerdataset = "";

    _pMultiCombo._p_autoselect = false;
    _pMultiCombo._p_autoskip = false;

    _pMultiCombo._initsoftkeyboard = undefined;
    _pMultiCombo._p_usesoftkeyboard = true;

    _pMultiCombo._p_displaynulltext = "";
    _pMultiCombo._p_imemode = "none";
    _pMultiCombo._p_readonly = false;
    _pMultiCombo._p_usecontextmenu = true;

    _pMultiCombo._p_displayrowcount = undefined;
    _pMultiCombo._p_buttonsize = undefined;
    _pMultiCombo._p_itemheight = undefined;
    _pMultiCombo._p_type = "dropdown";
    _pMultiCombo._p_popuptype = "normal";
    _pMultiCombo._p_popupsize = undefined;
    _pMultiCombo._p_acceptvaluetype = "allowinvalid";   //allowinvalid | ignoreinvalid

    _pMultiCombo._p_tagboxitemhorizontalgap = undefined;
    _pMultiCombo._p_tagboxitemverticalgap = undefined;
    _pMultiCombo._p_tagboxscrollbartype = "default";
    _pMultiCombo._p_tagboxscrollbarsize = null;
    _pMultiCombo._p_tagboxscrollindicatorsize = null;
    _pMultiCombo._p_tagbuttonsize = undefined;

    _pMultiCombo._p_showselectallcheckbox = false;
    _pMultiCombo._p_selectallcheckboxheight = undefined;
    _pMultiCombo._p_edittype = "text";
    _pMultiCombo._p_textseparator = ",";
    _pMultiCombo._p_counttextformat = "";

    /* internal variable */
    _pMultiCombo._is_close_popup_by_select = false;
    _pMultiCombo._isFiredOnInput = false;
    _pMultiCombo._innerdataset = "";
    _pMultiCombo._filtereddataset = "";
    _pMultiCombo._default_value = undefined;
    _pMultiCombo._default_text = "";
    _pMultiCombo._default_index = -1;
    _pMultiCombo._has_inputElement = true;
    _pMultiCombo._processing_keyfilter = false;
    _pMultiCombo._tagmode = false;

    /* status */
    _pMultiCombo._use_readonly_status = true;
    _pMultiCombo._is_editable_control = true;

    /* event list */
    _pMultiCombo._event_list = {
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
    _pMultiCombo._p_accessibilityrole = "multicombobox";

    //===============================================================
    // nexacro.MultiCombo : Create & Update
    //===============================================================
    _pMultiCombo.on_create_contents = function ()
    {
        var control = this.getElement();
        if (control)
        {
            if (this._p_edittype == "singletag" || this._p_edittype == "multitag")
            {
                this._tagmode = true;
                this._createMultiComboTagBoxControl();
            }
            else
            {
                this._tagmode = false;
                this._createMultiComboTextControl();
            }

            this._p_dropbutton = new nexacro._MultiComboButtonControl("dropbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
            this._p_dropbutton.createComponent();
        }
    };

    _pMultiCombo.on_created_contents = function (win)
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
            var init_comobovalue = (this._p_value == undefined && this._p_index == "-1");
            if (init_comobovalue)
            {
                this.on_apply_value(this._p_value);
            }
            else
            {
                if (this._p_index != "-1")
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
        //this._setDefaultProps(this._p_index, this._p_value, this._p_text);

        this._setEventHandlerToDropButton();
        this._setEventHandlerToMultiComboTagBox();
        this._setEventHandlerToMultiComboText();

        if (this._p_dropbutton)
        {
            this._p_dropbutton.on_created(win);
        }

        if (this._p_multicombotagbox)
        {
            this._p_multicombotagbox.on_created(win);
        }

        if (this._p_multicombotext)
        {
            this._p_multicombotext.on_created(win);
            this._p_multicombotext._setReadonlyView(true);
        }

        if (this._env._p_enableaccessibility)
        {
            this._want_arrows = false;
            this._setAccessibilityStatAutoComplete("list");

            if (!nexacro._isDesktop())
            {
                this._p_multicombotext._setAccessibilityStatHidden(true);
                this._p_dropbutton._setAccessibilityStatHidden(true);
            }
        }

        this.on_apply_type(this._p_type);
    };

    _pMultiCombo.on_destroy_contents = function ()
    {
        if (this._p_dropbutton)
        {
            this._p_dropbutton.destroy();
            this._p_dropbutton = null;
        }

        if (this._p_multicombotagbox)
        {
            this._p_multicombotagbox.destroy();
            this._p_multicombotagbox = null;
        }

        if (this._p_multicombotext)
        {
            this._p_multicombotext.destroy();
            this._p_multicombotext = null;
        }

        if (this._p_multicombolist)
        {
            this._p_multicombolist.destroy();
            this._p_multicombolist = null;
        }

        if (this._popupcontrol)
        {
            this._popupcontrol.destroy();
            this._popupcontrol = null;
        }

        this._removeEventHandlerToInnerDataset();

        this._select_multi = null;
    };

    _pMultiCombo._removeEventHandlerToInnerDataset = function ()
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

    _pMultiCombo.on_create_contents_command = function ()
    {
        this.on_apply_autoskip(this._p_autoskip);
        this.on_apply_displaynulltext(this._getStringResourceProperty(this._p_displaynulltext));
        this.on_apply_imemode(this._p_imemode);
        this.on_apply_autoselect(this._p_autoselect);
        this.on_apply_usecontextmenu(this._p_usecontextmenu);

        var init_comobovalue = (this._p_value == undefined && this._p_index == "-1");
        if (init_comobovalue)
        {
            this.on_apply_value(this._p_value);
        }
        else
        {
            if (this._p_index != "-1")
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

        this._setEventHandlerToDropButton();
        this._setEventHandlerToMultiComboTagBox();
        this._setEventHandlerToMultiComboText();

        var str = "";

        if (this._p_multicombotagbox)
        {
            str += this._p_multicombotagbox.createCommand();
        }

        if (this._p_multicombotext)
        {
            str += this._p_multicombotext.createCommand();
        }

        if (this._p_dropbutton)
        {
            str += this._p_dropbutton.createCommand();
        }

        return str;
    };

    _pMultiCombo.on_attach_contents_handle = function (win)
    {
        if (this._p_dropbutton)
        {
            this._p_dropbutton.attachHandle(win);
            this._p_dropbutton._setAccessibilityStatHidden(true);
        }

        if (this._p_multicombotagbox)
        {
            this._p_multicombotagbox.attachHandle(win);
            this._p_multicombotagbox._setAccessibilityStatHidden(true);
        }

        if (this._p_multicombotext)
        {
            this._p_multicombotext.attachHandle(win);
            this._p_multicombotext._setReadonlyView(true);
            this._p_multicombotext._setAccessibilityStatHidden(true);
        }

        if (this._env._p_enableaccessibility)
        {
            this._want_arrows = false;
            this._setAccessibilityStatAutoComplete("list");
        }

        //this._setDefaultProps(this._p_index, this._p_value, this._p_text);
        this.on_apply_type(this._p_type);
    };

    _pMultiCombo.on_change_containerRect = function (width, height)
    {
        this._recalcLayout();
    };

    _pMultiCombo.on_change_containerPos = function (left, top)
    {
        this._recalcLayout();
    };

    //===============================================================
    // nexacro.MultiCombo : Override
    //===============================================================
    _pMultiCombo._getInputElement = function ()
    {
        var edit = this._tagmode ? this._p_multicombotagbox.tagboxedit : this._p_multicombotext;
        return edit ? edit._getInputElement() : null;
    };

    _pMultiCombo._apply_setfocus = function (evt_name)
    {
        if (this._tagmode)
        {
            var tagboxedit = this._p_multicombotagbox.tagboxedit;
            if (tagboxedit)
            {
                tagboxedit._changeStatus("focused", true);
                tagboxedit._on_focus(true, evt_name);
            }
        }
        else
        {
            var multicombotext = this._p_multicombotext;
            if (multicombotext)
            {
                multicombotext._changeStatus("focused", true);
                multicombotext._on_focus(true, evt_name);
            }
        }
    };

    _pMultiCombo.on_apply_prop_enable = function (v)
    {
        v = (v != null) ? v : this._isEnable();

        if (this._p_multicombotagbox)
        {
            this._p_multicombotagbox._setEnable(v);
        }
        if (this._p_multicombotext)
        {
            this._p_multicombotext._setEnable(v);
        }
        if (this._p_dropbutton && !this._isReadOnly())
        {
            this._p_dropbutton._setEnable(v);
        }
        if (this._p_multicombolist)
        {
            this._p_multicombolist._setEnable(v);
        }
    };

    _pMultiCombo.on_apply_prop_cssclass = function ()
    {
        if (this._p_multicombotagbox)
        {
            this._p_multicombotagbox.on_apply_cssclass();
        }
        if (this._p_multicombotext)
        {
            this._p_multicombotext.on_apply_cssclass();
        }
        if (this._p_dropbutton)
        {
            this._p_dropbutton.on_apply_cssclass();
        }
        if (this._p_multicombolist)
        {
            this._p_multicombolist.on_apply_cssclass();
        }
    };

    _pMultiCombo.on_apply_prop_stringresource = function ()
    {
        if (!nexacro._StringResource)
            return;

        nexacro.Component.prototype.on_apply_prop_stringresource.call(this);

        this.on_apply_displaynulltext(this._getStringResourceProperty(this._p_displaynulltext));
    };

    _pMultiCombo.on_init_bindSource = function (columnid, propid, ds)
    {
        if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
        {
            this._createFilteredDataset();
        }

        this._setValue(undefined);
        this._setIndex("-1");
        this._setText("");

        this.redraw();
    };

    _pMultiCombo.on_change_bindSource = function (propid, ds, row, col)
    {
        if (propid == "value")
        {
            if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
            {
                this._createFilteredDataset();
            }

            var val = ds.getColumn(row, col);
            val = this._convertValueType(val, true);

            ds = this._selectDataset();

            var env = this._env;
            var valueseparator = env.multivalueseparator ? env.multivalueseparator : ",";
            var textseparator = this._p_textseparator;

            var values = val ? val.split(valueseparator) : val;
            var index, text, value, i;

            if (ds)
            {
                var info = this._select_multi;
                var len = info.length;
                var range = [];

                for (i = 0; i < len; i++)
                {
                    range[range.length] = info.items[i];
                }

                for (i = 0; i < range.length; i++)
                {
                    this._select_remove(range[i]);
                }

                if (values == undefined)
                {
                    value = values;
                    if (this._p_value != value)
                    {
                        index = "-1";
                        text = "";

                        this._setIndex(index);
                        this._setText(text);
                        this._setValue(value);

                        this._select_add(index);

                        this.redraw();
                        //this._setDefaultProps(this._p_index, this._p_value, this._p_text)
                    }
                }
                else
                {
                    var rows = [];
                    for (i = 0; i < values.length; i++)
                    {
                        value = values[i];
                        index = this._getIndexFromValue(ds, value);
                        if (index > -1)
                        {
                            text = this._getItemText(index);
                            rows.push(index);

                            if (i == 0)
                            {
                                this._p_index = index.toString();
                                this._p_text = text;
                                this._p_value = value;
                            }
                            else
                            {
                                this._p_index += "," + index;
                                this._p_text += textseparator + text;
                                this._p_value += valueseparator + value;
                            }

                            this._select_add(index);
                        }
                    }

                    this.redraw();
                    //this._setDefaultProps(this._p_index, this._p_value, this._p_text)
                }
            }
        }
    };

    _pMultiCombo.on_getBindableProperties = function ()
    {
        return "value";
    };

    _pMultiCombo._getDragData = function ()
    {
        var multicombotext = this._p_multicombotext;
        if (multicombotext)
        {
            return multicombotext.getSelectedText();
        }
    };

    _pMultiCombo._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        if ((keycode == nexacro.Event.KEY_UP || keycode == nexacro.Event.KEY_DOWN) && (ctrlKey || altKey))
        {
            return { want_tab: false, want_return: false, want_escape: false, want_chars: false, want_arrows: true };
        }

        return { want_tab: false, want_return: false, want_escape: false, want_chars: false, want_arrows: this._want_arrows };
    };

    _pMultiCombo._getAccessibilityReadLabel = function (bwholeread)
    {
        var _readlabel = nexacro.Component.prototype._getAccessibilityReadLabel.call(this);
        if (bwholeread && this._p_multicombotext._input_element && this._status != "focus")
        {
            if (!this._p_multicombotext._input_element._wantAccessibilityAdditionalLabel || !this._p_multicombotext._input_element._wantAccessibilityAdditionalLabel())
            {
                _readlabel = this._p_text + " " + _readlabel;
            }
        }

        return _readlabel;
    };

    _pMultiCombo.on_update_position = function (resize_flag, move_flag, update)
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            if (move_flag)
            {
                control_elem.setElementPosition(this._adjust_left, this._adjust_top);
                this.on_fire_onmove(this._adjust_left, this._adjust_top);
            }
            if (resize_flag || update)
            {
                control_elem.setElementSize(this._adjust_width, this._adjust_height, update);
                if (resize_flag)
                    this.on_fire_onsize(this._adjust_width, this._adjust_height);
            }
            if (this._p_multicombotagbox)
                this._p_multicombotagbox._onRecalcScrollSize();
        }
    };

    //===============================================================
    // nexacro.MultiCombo : Properties
    //===============================================================
    _pMultiCombo.set_text = function (v)
    {
        if (!nexacro._isString(v))
            return;

        var textseparator = this._p_textseparator;
        var texts = v.split(textseparator);

        var ds = this._innerdataset;
        var datacolumn = this._p_datacolumn == "" ? this._p_codecolumn : this._p_datacolumn;
        if (ds)
            texts = texts.filter(function (val, i) { return ds.findRow(datacolumn, val) > -1 && texts.indexOf(val) == i; });

        if (!ds || (!this._p_datacolumn && !this._p_codecolumn))
        {
            this._p_text = v;
            this.on_apply_text(v);
        }
        else
        {
            if (texts.length == 0)
            {
                this._p_text = "";
            }
            else
            {
                this._p_text = texts.join(textseparator);
            }
            this.on_apply_text(texts);
        }
    };

    _pMultiCombo.on_apply_text = function (texts)
    {
        var indexes = "";
        var values = "";

        var ds = this._selectDataset();
        if (!ds || (!this._p_datacolumn && !this._p_codecolumn))
        {
            if (this._p_value)
            {
                this._setTextValue(texts);
            }
            else
            {
                if (this._p_displaynulltext || texts == "")
                {
                    this._setTextValue(undefined);
                }
                else
                {
                    this._setTextValue(texts);
                }
            }
        }
        else
        {
            var index, value, i;
            var info = this._select_multi;
            var len = info.length;
            var range = [];

            var env = this._env;
            var valueseparator = env.multivalueseparator ? env.multivalueseparator : ",";
            var textseparator = this._p_textseparator;

            for (i = 0; i < len; i++)
            {
                range[range.length] = info.items[i];
            }

            for (i = 0; i < range.length; i++)
            {
                this._select_remove(range[i]);
            }

            if (texts == "")
            {
                this._p_index = "-1";
                this._p_value = undefined;
            }
            else
            {
                if (!nexacro._isArray(texts))
                    texts = texts.split(textseparator);

                for (i = 0; i < texts.length; i++)
                {
                    index = this._getIndexFromText(ds, texts[i]).toString();
                    value = this._getItemValue(index);

                    this._select_add(index);

                    if (i == 0)
                    {
                        indexes = index;
                        values = value;
                    }
                    else
                    {
                        indexes += "," + index;
                        values += valueseparator + value;
                    }
                }
                this._setIndex(indexes);
                this._setValue(values);
            }

            if (!this.applyto_bindSource("value", this._p_value))
            {
                return;
            }

            this.redraw();
        }

        //this._setDefaultProps(this._p_index, this._p_value, this._p_text);
    };

    _pMultiCombo.set_value = function (v)
    {
        if (!nexacro._isString(v) && v != undefined)
            return;

        var values = v;

        if (values == undefined)
        {
            this._p_value = undefined;
        }
        else
        {
            var env = this._env;
            var valueseparator = env.multivalueseparator ? env.multivalueseparator : ",";
            values = values.split(valueseparator);

            if (this._p_acceptvaluetype == "ignoreinvalid")
            {
                var ds = this._innerdataset;
                var codecolumn = this._p_codecolumn || this._p_datacolumn;
                if (ds)
                {
                    values = values.filter(function (val, i) { return ds.findRow(codecolumn, val) > -1 && values.indexOf(val) === i; });
                    if (values.length == 0)
                        return;
                }
            }

            this._p_value = values.join(valueseparator);
        }

        this.on_apply_value(values);
        this.redraw();
    };

    _pMultiCombo.on_apply_value = function (values)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var indexes = "";
            var texts = "";

            var ds = this._selectDataset();
            if (ds)
            {
                var index, text, i;
                var info = this._select_multi;
                var len = info.length;
                var range = [];

                var env = this._env;
                var valueseparator = env.multivalueseparator ? env.multivalueseparator : ",";
                var textseparator = this._p_textseparator;

                for (i = 0; i < len; i++)
                {
                    range[range.length] = info.items[i];
                }

                for (i = 0; i < range.length; i++)
                {
                    this._select_remove(range[i]);
                }

                if (values == undefined)
                {
                    index = this._getIndexFromValue(ds, values).toString();
                    if (index > -1)
                    {
                        text = this._getItemText(index);
                    }
                    this._select_add(index);

                    this._setIndex(index);
                    this._setText(text);
                }
                else
                {
                    if (!nexacro._isArray(values))
                        values = values.split(valueseparator);

                    for (i = 0; i < values.length; i++)
                    {
                        index = this._getIndexFromValue(ds, values[i]).toString();
                        if (index > -1)
                        {
                            text = this._getItemText(index);

                            this._select_add(index);

                            if (i == 0)
                            {
                                indexes = index;
                                texts = text;
                            }
                            else
                            {
                                indexes += "," + index;
                                texts += textseparator + text;
                            }
                        }
                    }
                    this._setIndex(indexes);
                    this._setText(texts);
                }

                if (!this.applyto_bindSource("value", this._p_value))
                {
                    return;
                }
            }

            //this._setDefaultProps(this._p_index, this._p_value, this._p_text);
        }
    };

    _pMultiCombo.set_index = function (v)
    {
        if (!nexacro._isString(v) || v.length == 0)
            return;

        var indexes = v.replace(/\s+/g, "");

        if (indexes == "-1")
        {
            this._p_index = "-1";
        }
        else
        {
            indexes = indexes.split(",").map(function (val) { return +val });

            var ds = this._innerdataset;
            if (ds)
                indexes = indexes.filter(function (val, i) { return val > -1 && val < ds.getRowCount() && !isNaN(val) && indexes.indexOf(val) == i; });

            if (indexes.length == 0)
                return;

            this._p_index = indexes.join(",");
        }

        this.on_apply_index(indexes);
        this.redraw();
    };

    _pMultiCombo.on_apply_index = function (indexes)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var values = "";
            var texts = "";

            var ds = this._innerdataset;
            if (ds)
            {
                var text, value, i;
                var info = this._select_multi;
                var len = info.length;
                var range = [];

                var env = this._env;
                var valueseparator = env.multivalueseparator ? env.multivalueseparator : ",";
                var textseparator = this._p_textseparator;

                for (i = 0; i < len; i++)
                {
                    range[range.length] = info.items[i];
                }

                for (i = 0; i < range.length; i++)
                {
                    this._select_remove(range[i]);
                }

                if (indexes == "-1")
                {
                    this._p_text = "";
                    this._p_value = undefined;
                }
                else
                {
                    if (!nexacro._isArray(indexes))
                        indexes = indexes.split(",");

                    for (i = 0; i < indexes.length; i++)
                    {
                        this._select_add(indexes[i]);

                        text = this._getItemText(indexes[i]);
                        value = this._getItemValue(indexes[i]);

                        if (i == 0)
                        {
                            texts = text;
                            values = value;
                        }
                        else
                        {
                            texts += textseparator + text;
                            values += valueseparator + value;
                        }
                    }
                    this._setText(texts);
                    this._setValue(values);
                }

                if (!this.applyto_bindSource("value", this._p_value))
                {
                    return;
                }
            }
            else
            {
                this._p_index = "-1";
                this._p_text = "";
                this._p_value = undefined;
            }

            //this._setDefaultProps(this._p_index, this._p_value, this._p_text);
        }
    };

    _pMultiCombo.set_displaynulltext = function (v)
    {
        v = nexacro._toString(v).replace(/&quot;/g, "\"");
        if (this._p_displaynulltext != v)
        {
            this._p_displaynulltext = v;
            this.on_apply_displaynulltext(v);
        }
    };

    _pMultiCombo.on_apply_displaynulltext = function (displaynulltext)
    {
        if (this._tagmode)
        {
            var tagboxedit = this._p_multicombotagbox.tagboxedit;
            if (tagboxedit)
            {
                tagboxedit.set_displaynulltext(displaynulltext);
            }
        }
        else
        {
            var multicombotext = this._p_multicombotext;
            if (multicombotext)
            {
                multicombotext.set_displaynulltext(displaynulltext);
            }
        }
    };

    _pMultiCombo.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_readonly != v)
        {
            this._p_readonly = v;
            this.on_apply_readonly();
        }
    };

    _pMultiCombo._isReadOnly = function ()
    {
        return this._p_readonly;
    };

    _pMultiCombo.on_apply_readonly = function ()
    {
        var readonly = this._isReadOnly();
        this._changeStatus("readonly", readonly);

        var multicombotext = this._p_multicombotext;
        if (multicombotext)
        {
            if (!this._onlydisplay)
            {
                multicombotext.set_readonly(readonly);
            }
            else
            {
                multicombotext._changeStatus("readonly", readonly);
            }

            multicombotext._setReadonlyView(true);
            if (this._env._p_enableaccessibility)
                multicombotext._setAccessibilityFlagReadOnly(readonly);
        }

        var multicombotagbox = this._p_multicombotagbox;
        if (multicombotagbox)
        {
            multicombotagbox.set_readonly(readonly);
        }

        var dropbutton = this._p_dropbutton;
        if (dropbutton)
        {
            dropbutton._setEnable(this._isEnable() && !readonly);
        }

        var multicombolist = this._p_multicombolist;
        if (multicombolist)
        {
            multicombolist.set_readonly(readonly);
        }
    };

    _pMultiCombo.set_autoselect = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_autoselect != v)
        {
            this._p_autoselect = v;
            this.on_apply_autoselect(v);
        }
    };

    _pMultiCombo.on_apply_autoselect = function (autoselect)
    {
        if (this._tagmode)
        {
            var tagboxedit = this._p_multicombotagbox.tagboxedit;
            if (tagboxedit)
            {
                tagboxedit.set_autoselect(autoselect);
            }
        }
    };

    _pMultiCombo.set_autoskip = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_autoskip != v)
        {
            this._p_autoskip = v;
            this.on_apply_autoskip(v);
        }
    };

    _pMultiCombo.on_apply_autoskip = function (autoskip)
    {
        var multicombotext = this._p_multicombotext;
        if (multicombotext)
        {
            multicombotext.set_autoskip(autoskip);
        }
    };

    _pMultiCombo.set_usesoftkeyboard = function (v)
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

    _pMultiCombo.on_apply_usesoftkeyboard = function ()
    {
        if (this._tagmode)
        {
            var tagboxedit = this._p_multicombotagbox.tagboxedit;
            if (tagboxedit)
            {
                tagboxedit.set_usesoftkeyboard(this._getUseSoftKeyboardValue(this._initsoftkeyboard));
            }
        }
        else
        {
            var multicombolist = this._p_multicombolist;
            if (multicombolist)
            {
                var multicomboedit = multicombolist.multicomboedit;
                if (multicomboedit)
                {
                    multicomboedit.set_usesoftkeyboard(this._getUseSoftKeyboardValue(this._initsoftkeyboard));
                }
            }
        }
    };

    _pMultiCombo.set_imemode = function (v)
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

    _pMultiCombo.on_apply_imemode = function (imemode)
    {
        if (this._tagmode)
        {
            var tagboxedit = this._p_multicombotagbox.tagboxedit;
            if (tagboxedit)
            {
                tagboxedit.set_imemode(imemode);
            }
        }
        else
        {
            var multicombolist = this._p_multicombolist;
            if (multicombolist)
            {
                var multicomboedit = multicombolist.multicomboedit;
                if (multicomboedit)
                {
                    multicomboedit.set_imemode(imemode);
                }
            }
        }
    };

    _pMultiCombo.set_type = function (v)
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

    _pMultiCombo.on_apply_type = function (type)
    {
        if (this._filtereddataset)
        {
            this._filtereddataset.filter("");
        }

        var control_elem = this.getElement();
        if (control_elem)
        {
            if (this._tagmode)
            {
                var multicombotagbox = this._p_multicombotagbox;
                if (multicombotagbox)
                {
                    multicombotagbox._recalcLayout();
                }
            }
        }

        this.on_apply_readonly();
        this.on_apply_autoselect(this._p_autoselect);
    };

    _pMultiCombo.set_popuptype = function (v)
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

    _pMultiCombo.on_apply_popuptype = function (popuptype)
    {
        var popupcontrol = this._popupcontrol;
        if (popupcontrol)
        {
            popupcontrol._setType(popuptype);
        }
    };

    _pMultiCombo.set_popupsize = function (v)
    {
        if (this._p_popupsize != v)
        {
            this._p_popupsize = v;
        }
    };

    _pMultiCombo.set_usecontextmenu = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_usecontextmenu != v)
        {
            this._p_usecontextmenu = v;
            this.on_apply_usecontextmenu(v);
        }
    };

    _pMultiCombo.set_acceptvaluetype = function (v)
    {
        var type_enum = ["allowinvalid", "ignoreinvalid"];

        if (type_enum.indexOf(v) == -1)
        {
            return;
        }
        this._p_acceptvaluetype = v;
    };

    _pMultiCombo.on_apply_usecontextmenu = function (usecontextmenu)
    {
        if (this._tagmode)
        {
            var tagboxedit = this._p_multicombotagbox.tagboxedit;
            if (tagboxedit)
            {
                tagboxedit.set_usecontextmenu(usecontextmenu);
            }
        }
        else
        {
            var multicombotext = this._p_multicombotext;
            if (multicombotext)
            {
                multicombotext.set_usecontextmenu(usecontextmenu);
            }
        }
    };

    _pMultiCombo.set_innerdataset = function (v)
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

    _pMultiCombo.on_apply_innerdataset = function (ds)
    {
        if (this._p_multicombolist)
        {
            var checkboxset = this._p_multicombolist.checkboxset;
            if (checkboxset)
            {
                checkboxset.setInnerDataset(ds);
            }
        }

        if (ds)
        {
            ds._setEventHandler("onvaluechanged", this._on_dataset_onvaluechanged, this);
            ds._setEventHandler("onrowsetchanged", this._on_dataset_onrowsetchanged, this);

            if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
            {
                this._createFilteredDataset();
            }

            if (this._p_index !== "-1")
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

    _pMultiCombo.set_codecolumn = function (v)
    {
        if (this._p_codecolumn != v)
        {
            this._p_codecolumn = v;
            this.on_apply_codecolumn(v);
        }
    };

    _pMultiCombo.on_apply_codecolumn = function (codecolumn)
    {
        if (this._p_multicombolist)
        {
            var checkboxset = this._p_multicombolist.checkboxset;
            if (checkboxset)
            {
                checkboxset.set_codecolumn(codecolumn);
            }
        }

        if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
        {
            this._createFilteredDataset();
        }

        if (this._is_created)
        {
            if (this._p_index !== "-1")
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
            //this._setDefaultProps(this._p_index, this._p_value, this._p_text);
            this.redraw();
        }
    };

    _pMultiCombo.set_datacolumn = function (v)
    {
        if (this._p_datacolumn != v)
        {
            this._p_datacolumn = v;
            this.on_apply_datacolumn(v);
        }
    };

    _pMultiCombo.on_apply_datacolumn = function (datacolumn)
    {
        if (this._p_multicombolist)
        {
            var checkboxset = this._p_multicombolist.checkboxset;
            if (checkboxset)
            {
                checkboxset.set_datacolumn(this._p_datacolumn);
            }
        }

        if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
        {
            this._createFilteredDataset();
        }

        if (this._is_created)
        {
            if (this._p_index !== "-1")
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
            //this._setDefaultProps(this._p_index, this._p_value, this._p_text);
            this.redraw();
        }
    };

    _pMultiCombo.set_readonlycolumn = function (v)
    {
        if (this._p_readonlycolumn != v)
        {
            this._p_readonlycolumn = v ? v : "";
            this.on_apply_readonlycolumn(this._p_readonlycolumn);
        }
    };

    _pMultiCombo.on_apply_readonlycolumn = function (readonlycolumn)
    {
        if (this._p_multicombolist)
        {
            var checkboxset = this._p_multicombolist.checkboxset;
            if (checkboxset)
            {
                checkboxset.set_readonlycolumn(readonlycolumn);
            }
        }

        if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
        {
            this._createFilteredDataset();
        }
    };

    _pMultiCombo.set_buttonsize = function (v)
    {
        if (this._p_buttonsize != v)
        {
            this._p_buttonsize = v;
            this.on_apply_buttonsize(v);
        }
    };

    _pMultiCombo.on_apply_buttonsize = function (buttonsize)
    {
        this._recalcLayout();
    };

    _pMultiCombo.set_displayrowcount = function (v)
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

    _pMultiCombo.set_itemheight = function (v)
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

    _pMultiCombo.on_apply_itemheight = function (itemheight)
    {
        if (this._p_multicombolist)
        {
            var checkboxset = this._p_multicombolist.checkboxset;
            if (checkboxset)
            {
                checkboxset.set_itemheight(itemheight);
            }
        }
    };

    _pMultiCombo.set_visible = function (v)
    {
        nexacro.Component.prototype.set_visible.call(this, v);

        if (!this._p_visible && this._isPopupVisible())
        {
            this._closePopup();
        }
    };
    /*
    _pMultiCombo.on_apply_accessibility = function (accessibility)
    {
        nexacro.Component.prototype.on_apply_accessibility.call(this, accessibility);
        if (this._p_multicomboedit)
        {
            this._p_multicomboedit.on_apply_accessibility(accessibility);
        }
    };
    */
    _pMultiCombo.set_scrollbarbarminsize = function (scrollbarbarminsize)
    {
        if (scrollbarbarminsize !== undefined)
        {
            scrollbarbarminsize = parseInt(scrollbarbarminsize);
            if (isNaN(scrollbarbarminsize))
                return;
        }

        this.on_apply_scrollbarbarminsize(scrollbarbarminsize);
    };

    _pMultiCombo.on_apply_scrollbarbarminsize = function (scrollbarbarminsize)
    {
        if (this._p_scrollbarbarminsize != scrollbarbarminsize)
        {
            this._p_scrollbarbarminsize = scrollbarbarminsize;

            if (this._p_multicombolist)
            {
                var checkboxset = this._p_multicombolist.checkboxset;
                if (checkboxset)
                {
                    checkboxset.set_scrollbarbarminsize(scrollbarbarminsize);
                }
            }
        }
    };

    _pMultiCombo.set_scrollbardecbuttonsize = function (scrollbardecbuttonsize)
    {
        if (scrollbardecbuttonsize !== undefined)
        {
            scrollbardecbuttonsize = parseInt(scrollbardecbuttonsize);
            if (isNaN(scrollbardecbuttonsize))
                return;
        }

        this.on_apply_scrollbardecbuttonsize(scrollbardecbuttonsize);
    };

    _pMultiCombo.on_apply_scrollbardecbuttonsize = function (scrollbardecbuttonsize)
    {
        if (this._p_scrollbardecbuttonsize != scrollbardecbuttonsize)
        {
            this._p_scrollbardecbuttonsize = scrollbardecbuttonsize;

            if (this._p_multicombolist)
            {
                var checkboxset = this._p_multicombolist.checkboxset;
                if (checkboxset)
                {
                    checkboxset.set_scrollbardecbuttonsize(scrollbardecbuttonsize);
                }
            }
        }
    };

    _pMultiCombo.set_scrollbarbaroutsize = function (scrollbarbaroutsize)
    {
        if (scrollbarbaroutsize !== undefined)
        {
            scrollbarbaroutsize = parseInt(scrollbarbaroutsize);
            if (isNaN(scrollbarbaroutsize))
                return;
        }

        this.on_apply_scrollbarbaroutsize(scrollbarbaroutsize);
    };

    _pMultiCombo.on_apply_scrollbarbaroutsize = function (scrollbarbaroutsize)
    {
        if (this._p_scrollbarbaroutsize != scrollbarbaroutsize)
        {
            this._p_scrollbarbaroutsize = scrollbarbaroutsize;

            if (this._p_multicombolist)
            {
                var checkboxset = this._p_multicombolist.checkboxset;
                if (checkboxset)
                {
                    checkboxset.set_scrollbarbaroutsize(scrollbarbaroutsize);
                }
            }
        }
    };

    _pMultiCombo.set_scrollbarincbuttonsize = function (scrollbarincbuttonsize)
    {
        if (scrollbarincbuttonsize !== undefined)
        {
            scrollbarincbuttonsize = parseInt(scrollbarincbuttonsize);
            if (isNaN(scrollbarincbuttonsize))
                return;
        }

        this.on_apply_scrollbarincbuttonsize(scrollbarincbuttonsize);
    };

    _pMultiCombo.on_apply_scrollbarincbuttonsize = function (scrollbarincbuttonsize)
    {
        if (this._p_scrollbarincbuttonsize != scrollbarincbuttonsize)
        {
            this._p_scrollbarincbuttonsize = scrollbarincbuttonsize;

            if (this._p_multicombolist)
            {
                var checkboxset = this._p_multicombolist.checkboxset;
                if (checkboxset)
                {
                    checkboxset.set_scrollbarincbuttonsize(scrollbarincbuttonsize);
                }
            }
        }
    };

    _pMultiCombo.set_scrollbarsize = function (scrollbarsize)
    {
        if (scrollbarsize !== undefined)
        {
            scrollbarsize = parseInt(scrollbarsize);
            if (isNaN(scrollbarsize))
                return;
        }

        this.on_apply_scrollbarsize(scrollbarsize);
    };

    _pMultiCombo.on_apply_scrollbarsize = function (scrollbarsize)
    {
        if (this._p_scrollbarsize != scrollbarsize)
        {
            this._p_scrollbarsize = scrollbarsize;

            if (this._p_multicombolist)
            {
                var checkboxset = this._p_multicombolist.checkboxset;
                if (checkboxset)
                {
                    checkboxset.set_scrollbarsize(scrollbarsize);
                }
            }
        }
    };

    _pMultiCombo.set_scrollbartrackbarsize = function (scrollbartrackbarsize)
    {
        if (scrollbartrackbarsize !== undefined)
        {
            scrollbartrackbarsize = parseInt(scrollbartrackbarsize);
            if (isNaN(scrollbartrackbarsize))
                return;
        }

        this.on_apply_scrollbartrackbarsize(scrollbartrackbarsize);
    };

    _pMultiCombo.on_apply_scrollbartrackbarsize = function (scrollbartrackbarsize)
    {
        if (this._p_scrollbartrackbarsize != scrollbartrackbarsize)
        {
            this._p_scrollbartrackbarsize = scrollbartrackbarsize;

            if (this._p_multicombolist)
            {
                var checkboxset = this._p_multicombolist.checkboxset;
                if (checkboxset)
                {
                    checkboxset.set_scrollbartrackbarsize(scrollbartrackbarsize);
                }
            }
        }
    };

    _pMultiCombo.set_showselectallcheckbox = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_showselectallcheckbox != v)
        {
            this._p_showselectallcheckbox = v;
            if (this._p_multicombolist)
            {
                this.on_apply_showselectallcheckbox();
            }
        }
    };

    _pMultiCombo.on_apply_showselectallcheckbox = function ()
    {
        var ds;

        if (!this.isDropdown())
        {
            ds = this._selectDataset(true);

            if ((this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike") && ds.rowcount == 0)
            {
                ds = this._innerdataset;
            }

            this._popupcontrol.destroy();
            this._popupcontrol = null;

            this._p_multicombolist.destroy();
            this._p_multicombolist = null;

            this._createPopupListBoxControl(ds);
        }
    };

    _pMultiCombo.set_selectallcheckboxheight = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v))
            {
                return;
            }
        }

        if (this._p_selectallcheckboxheight != v)
        {
            this._p_selectallcheckboxheight = v;
        }
    };

    _pMultiCombo.set_edittype = function (v)
    {
        var edittype_enum = ["text", "singletag", "multitag", "count"];
        if (edittype_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_edittype != v)
        {
            this._p_edittype = v;
            this.on_apply_edittype(v);
        }
    };

    _pMultiCombo.on_apply_edittype = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            if (this._p_edittype == "singletag" || this._p_edittype == "multitag")
            {
                this._tagmode = true;
                this._createMultiComboTagBoxControl();
                this._setEventHandlerToMultiComboTagBox();
            }
            else
            {
                this._tagmode = false;
                this._createMultiComboTextControl();
                this._setEventHandlerToMultiComboText();
            }

            this._recalcLayout();
            this.redraw();
        }
    };

    _pMultiCombo.set_textseparator = function (v)
    {
        if (this._p_textseparator != v)
        {
            if (v == "" || v == undefined)
                this._p_textseparator = ",";
            else
                this._p_textseparator = nexacro._toString(v);

            this.on_apply_textseparator();
        }
    };

    _pMultiCombo.on_apply_textseparator = function ()
    {
        var selectedItems = this._select_multi.items;
        var selectedCount = selectedItems.length;

        if (selectedCount > 0)
        {
            var text = "";
            for (var i = 0; i < selectedCount; i++)
            {
                if (i == 0)
                {
                    text += this._getItemText(selectedItems[i]);
                }
                else
                {
                    text += this._p_textseparator + this._getItemText(selectedItems[i]);
                }
            }
            this._setText(text);
        }

        if (this._p_edittype == "text")
            this._setMultiComboTextValue();
    };

    _pMultiCombo.set_counttextformat = function (v)
    {
        if (v && !/\[\#\]|\[\*\]/.test(v))
            return;

        v = nexacro._toString(v);
        if (this._p_counttextformat != v)
        {
            this._p_counttextformat = v;
            this.on_apply_counttextformat(v);
        }
    };

    _pMultiCombo.on_apply_counttextformat = function (format)
    {
        if (this._p_multicombotext && this._p_edittype == "count")
            this._setMultiComboCountValue();
    };

    _pMultiCombo.set_tagboxitemhorizontalgap = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v) || v < 0)
            {
                return;
            }
        }

        if (this._p_tagboxitemhorizontalgap != v)
        {
            this._p_tagboxitemhorizontalgap = v;
            this.on_apply_tagboxitemhorizontalgap();
        }
    };

    _pMultiCombo.on_apply_tagboxitemhorizontalgap = function (v)
    {
        if (this._tagmode)
        {
            var multicombotagbox = this._p_multicombotagbox;
            if (multicombotagbox)
            {
                multicombotagbox._recalcLayout();
            }
        }
    };

    _pMultiCombo.set_tagboxitemverticalgap = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v) || v < 0)
            {
                return;
            }
        }

        if (this._p_tagboxitemverticalgap != v)
        {
            this._p_tagboxitemverticalgap = v;
            this.on_apply_tagboxitemverticalgap();
        }
    };

    _pMultiCombo.on_apply_tagboxitemverticalgap = function (v)
    {
        if (this._tagmode)
        {
            var multicombotagbox = this._p_multicombotagbox;
            if (multicombotagbox)
            {
                multicombotagbox._recalcLayout();
            }
        }
    };

    _pMultiCombo.set_tagboxscrollbartype = function (v)
    {
        var tagboxscrollbartype_enum = ["default", "auto", "autoindicator", "fixed", "indicator", "none"];
        if (tagboxscrollbartype_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_tagboxscrollbartype != v)
        {
            this._p_tagboxscrollbartype = v;
            this.on_apply_tagboxscrollbartype(v);
        }
    };

    _pMultiCombo.on_apply_tagboxscrollbartype = function (v)
    {
        var multicombotagbox = this._p_multicombotagbox;
        if (multicombotagbox)
        {
            multicombotagbox.set_scrollbartype(v);
        }
    };

    _pMultiCombo.set_tagboxscrollbarsize = function (v)
    {
        if (v !== undefined)
        {
            v = parseInt(v);
            if (isNaN(v))
                return;
        }

        this.on_apply_tagboxscrollbarsize(v);
    };

    _pMultiCombo.on_apply_tagboxscrollbarsize = function (v)
    {
        if (this._p_tagboxscrollbarsize != v)
        {
            this._p_tagboxscrollbarsize = v;

            var multicombotagbox = this._p_multicombotagbox;
            if (multicombotagbox)
            {
                multicombotagbox.set_scrollbarsize(v);
            }
        }
    };

    _pMultiCombo.set_tagboxscrollindicatorsize = function (v)
    {
        if (v !== undefined)
        {
            v = parseInt(v);
            if (isNaN(v))
                return;
        }

        this.on_apply_tagboxscrollindicatorsize(v);
    };

    _pMultiCombo.on_apply_tagboxscrollindicatorsize = function (v)
    {
        if (this._p_tagboxscrollindicatorsize != v)
        {
            this._p_tagboxscrollindicatorsize = v;

            var multicombotagbox = this._p_multicombotagbox;
            if (multicombotagbox)
            {
                multicombotagbox.set_scrollindicatorsize(v);
            }
        }
    };

    _pMultiCombo.set_tagbuttonsize = function (v)
    {
        if (this._p_tagbuttonsize != v)
        {
            this._p_tagbuttonsize = v;
            this.on_apply_tagbuttonsize(v);
        }
    };

    _pMultiCombo.on_apply_tagbuttonsize = function ()
    {
        if (this._tagmode)
        {
            var multicombotagbox = this._p_multicombotagbox;
            if (multicombotagbox)
            {
                multicombotagbox._recalcLayout();
            }
        }
    };

    _pMultiCombo.on_apply_font = function (font)
    {
        if (!this._isEnableRedraw()) return;
        var control_elem = this._control_element;
        if (control_elem)
        {
            control_elem.setElementFont(font);
            this.redraw();
        };
    };

    _pMultiCombo._properties = [
        { name: "value" },
        { name: "index" },
        { name: "text" },
        { name: "codecolumn" },
        { name: "datacolumn" },
        { name: "readonlycolumn" },
        { name: "innerdataset" },
        { name: "autoselect" },
        { name: "autoskip" },
        { name: "usesoftkeyboard" },
        { name: "displaynulltext" },
        { name: "imemode" },
        { name: "readonly" },
        { name: "usecontextmenu" },
        { name: "displayrowcount" },
        { name: "buttonsize" },
        { name: "itemheight" },
        { name: "type" },
        { name: "popuptype" },
        { name: "popupsize" },
        { name: "acceptvaluetype" },
        { name: "tagboxitemhorizontalgap" },
        { name: "tagboxitemverticalgap" },
        { name: "tagboxscrollbartype" },
        { name: "tagboxscrollbarsize" },
        { name: "tagboxscrollindicatorsize" },
        { name: "tagbuttonsize" },
        { name: "showselectallcheckbox" },
        { name: "selectallcheckboxheight" },
        { name: "edittype" },
        { name: "textseparator" },
        { name: "counttextformat" },
        { name: "scrollbarbarminsize" },
        { name: "scrollbardecbuttonsize" },
        { name: "scrollbarsize" },
        { name: "scrollbarbaroutsize" },
        { name: "scrollbarincbuttonsize" },
        { name: "scrollbartrackbarsize" },
        { name: "dropbutton", readonly: true },
        { name: "multicombolist", readonly: true },
        { name: "multicombotagbox", readonly: true },
        { name: "multicombotext", readonly: true }
    ];
    nexacro._defineProperties(_pMultiCombo, _pMultiCombo._properties);

    //===============================================================
    // nexacro.MultiCombo : Methods
    //===============================================================
    _pMultiCombo.dropdown = function ()
    {
        var ds;

        if (!this._p_enable || this._p_readonly || !this._p_visible)
        {
            return false;
        }

        if (this._tagmode)
        {
            var tagboxedit = this._p_multicombotagbox.tagboxedit;
            if (tagboxedit)
            {
                var input_elem = tagboxedit ? tagboxedit._input_element : null;
                if (input_elem && input_elem._is_accept_touch && !input_elem._is_accept_touch())
                {
                    return false;
                }
            }
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

    _pMultiCombo.isDropdown = function ()
    {
        return this._isPopupVisible();
    };

    _pMultiCombo.getCaretPos = function ()
    {
        if (this._p_readonly)
        {
            return -1;
        }

        if (this._tagmode)
        {
            var tagboxedit = this._p_multicombotagbox.tagboxedit;
            if (tagboxedit)
            {
                return tagboxedit.getCaretPos();
            }
        }
        else
        {
            var multicombotext = this._p_multicombotext;
            if (multicombotext)
            {
                return multicombotext.getCaretPos();
            }
        }

        return -1;
    };

    _pMultiCombo.getSelect = function (v)
    {
        if (v < 0 || v >= this.getCount() || isNaN(v))
        {
            return -1;
        }

        var selectedItems = this._select_multi.items;
        var selectedCount = selectedItems.length;

        for (var i = 0; i < selectedCount; i++)
        {
            if (selectedItems[i] == v)
            {
                return true;
            }
        }
        return false;
    };

    _pMultiCombo.setSelect = function (index, bSelect)
    {
        bSelect = nexacro._toBoolean(bSelect);
        index = parseInt(index) | 0;

        if (index >= 0)
        {
            var isReadonly = this._getItemReadonly(index);
            if (isReadonly) return;

            if (bSelect == true)
            {
                this._select_add(index);
                this._insertIndex(index, true);
            }
            else
            {
                this._select_remove(index);
                this._removeindex(index, true);
            }
        }
        else
        {
            this._clear_all(true);
        }

        this.redraw();
    };

    _pMultiCombo.getSelectedText = function ()
    {
        if (this.getElement() && this._p_multicombotext)
        {
            return this._p_multicombotext.getSelectedText();
        }

        return "";
    };

    _pMultiCombo.setSelectedText = function (v)
    {
        if (this._tagmode && this._p_type != "dropdown")
        {
            var tagboxedit = this._p_multicombotagbox.tagboxedit;
            if (tagboxedit)
            {
                return tagboxedit.setSelectedText(v);
            }
        }
    };

    _pMultiCombo.getInnerDataset = function ()
    {
        return this._innerdataset;
    };

    _pMultiCombo.setInnerDataset = function (obj)
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

    _pMultiCombo.getCount = function ()
    {
        if (this.getElement())
        {
            if (this._p_multicombolist)
            {
                var checkboxset = this._p_multicombolist.checkboxset;
                if (checkboxset)
                {
                    return checkboxset.getCount();
                }
            }
            else if (this._innerdataset)
            {
                return this._innerdataset.getRowCount();
            }
        }

        return 0;
    };

    _pMultiCombo.redraw = function ()
    {
        if (this._p_text || !nexacro._isNull(this._p_value))        
        {
            this._setEditValue("");
        }
        else
        {
            this._setEditValue(undefined);
        }

        if (this._p_edittype == "text")
        {
            this._setMultiComboTextValue();
        }
        else if (this._p_edittype == "count")
        {
            this._setMultiComboCountValue();
        }
        else if (this._p_edittype == "singletag" || this._p_edittype == "multitag")
        {
            this._setMultiComboTagBoxValue();

            if (this._p_multicombotagbox)
            {
                this._p_multicombotagbox._setScrollMaxPos();
                if (this._select_multi.tagselect != -1)
                    this._p_multicombotagbox._multicombotags[this._select_multi.tagselect]._changeUserStatus("selected", true);
            }
        }
    };

    _pMultiCombo.updateToDataset = function ()
    {
        return this.applyto_bindSource("value", this._p_value);
    };

    _pMultiCombo.getSelectedCount = function ()
    {
        return this._select_multi.length;
    };

    _pMultiCombo.getSelectedItems = function ()
    {
        if (this._select_multi && this._select_multi.length > 0)
        {
            var obj = this._select_multi.items;
            var objsorted = [];
            for (var i = 0, len = obj.length; i < len; i++)
            {
                objsorted[i] = obj[i];
            }
            objsorted.sort(function (a, b) { return a - b; });
            return objsorted;
        }
    };

    _pMultiCombo.selectAll = function ()
    {
        var rowcount = this._innerdataset.rowcount;
        if (rowcount < this._select_multi.length)
        {
            return;
        }

        this._select_all(true);
        this.redraw();
    };

    _pMultiCombo.clearSelect = function ()
    {
        if (this._select_multi && this._select_multi.length > 0)
        {
            this._clear_all(true);
            this.redraw();
        }
    };

    _pMultiCombo.setSelectRange = function (start, end, bSelect)
    {
        bSelect = nexacro._toBoolean(bSelect);
        start = parseInt(start) | 0;
        end = parseInt(end) | 0;

        var i, isReadonly;
        var rows = [];

        if (start > end)
        {
            if (bSelect == true)
            {
                for (i = start; i >= end; i--)
                {
                    isReadonly = this._getItemReadonly(i);
                    if (!isReadonly)
                    {
                        this._select_add(i);
                        rows.push(i);
                    }

                }
                this._insertIndex(rows, true);
            }
            else
            {
                for (i = start; i >= end; i--)
                {
                    isReadonly = this._getItemReadonly(i);
                    if (!isReadonly)
                    {
                        this._select_remove(i);
                        rows.push(i);
                    }
                }
                this._removeindex(rows, true);
            }
        }
        else
        {
            if (bSelect == true)
            {
                for (i = start; i <= end; i++)
                {
                    isReadonly = this._getItemReadonly(i);
                    if (!isReadonly)
                    {
                        this._select_add(i);
                        rows.push(i);
                    }
                }
                this._insertIndex(rows, true);
            }
            else
            {
                for (i = start; i <= end; i++)
                {
                    isReadonly = this._getItemReadonly(i);
                    if (!isReadonly)
                    {
                        this._select_remove(i);
                        rows.push(i);
                    }
                }
                this._removeindex(rows, true);
            }
        }

        this.redraw();
    };

    _pMultiCombo.setSelectItems = function (items, bSelect)
    {
        bSelect = nexacro._toBoolean(bSelect);

        var i, isReadonly;
        var rows = [];

        if (bSelect == true)
        {
            for (i = 0; i < items.length; i++)
            {
                isReadonly = this._getItemReadonly(items[i]);
                if (isReadonly) continue;

                this._select_add(items[i]);
                rows.push(items[i]);
            }
            this._insertIndex(rows, true);
        }
        else
        {
            for (i = 0; i < items.length; i++)
            {
                isReadonly = this._getItemReadonly(items[i]);
                if (isReadonly) continue;

                this._select_remove(items[i]);
                rows.push(items[i]);
            }
            this._removeindex(rows, true);
        }

        this.redraw();
    };

    //===============================================================
    // nexacro.MultiCombo : Events
    //===============================================================
    _pMultiCombo._on_activate = function ()
    {
        nexacro.Component.prototype._on_activate.call(this);

        if (this._tagmode)
        {
            var tagboxedit = this._p_multicombotagbox.tagboxedit;
            if (tagboxedit)
            {
                nexacro.Edit.prototype._on_activate.call(tagboxedit);
            }
        }
        else
        {
            var multicombotext = this._p_multicombotext;
            if (multicombotext)
            {
                nexacro.Edit.prototype._on_activate.call(multicombotext);
            }
        }
    };

    _pMultiCombo._on_dropdown = function ()
    {
        if (this._p_readonly)
        {
            return;
        }

        if (this._tagmode)
        {
            var tagboxedit = this._p_multicombotagbox.tagboxedit;
            if (tagboxedit)
            {
                var input_elem = tagboxedit ? tagboxedit._input_element : null;
                if (input_elem && input_elem._is_accept_touch && !input_elem._is_accept_touch())
                {
                    return false;
                }
            }
        }

        var ds = this._selectDataset(true);
        var idx = this._p_index;

        if (this._isPopupVisible())
        {
            this._closePopup();
        }
        else
        {
            if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
            {
                this._clearFilteredDataset();
            }

            this._showPopup(ds, idx, 1);
        }
    };

    _pMultiCombo._on_dataset_onvaluechanged = function (obj, e)
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

    _pMultiCombo._on_dataset_onrowsetchanged = function (obj, e)
    {
        if (e.reason == nexacro.NormalDataset.REASON_FILTER)
        {
            if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
            {
                this._createFilteredDataset();
            }

            this._recheckValue();
        }
        else if (e.reason == nexacro.NormalDataset.REASON_ASSIGN ||
            e.reason == nexacro.NormalDataset.REASON_CLEARDATA)
        {
            this.set_index("-1");
            this._recheckIndex();
        }
        else if (e.reason == nexacro.NormalDataset.REASON_COPY ||
            e.reason == nexacro.NormalDataset.REASON_ENABLEEVENT)
        {
            if (this._p_index != "-1")
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
        }
        this.redraw();
    };

    _pMultiCombo._on_multicombotext_onlbuttondown = function (obj, e)
    {
        if (this._p_readonly || (nexacro._isTouchInteraction && nexacro._SupportTouch))
        {
            return;
        }

        var multicombotext = this._p_multicombotext;
        var input_elem = multicombotext ? multicombotext._input_element : null;
        if (input_elem && input_elem._is_accept_touch && !input_elem._is_accept_touch())
        {
            return false;
        }

        var ds = this._selectDataset(true);
        var idx = this._p_index;

        if (this._isPopupVisible())
        {
            this._closePopup();
        }
        else
        {
            this._showPopup(ds, idx, 1);
        }
    };

    _pMultiCombo._on_edit_onlbuttondown = function (obj, e)
    {
        if (this._p_readonly || (nexacro._isTouchInteraction && nexacro._SupportTouch))
        {
            return;
        }

        if (this._tagmode)
        {
            var tagboxedit = this._p_multicombotagbox.tagboxedit;
            if (tagboxedit)
            {
                var input_elem = tagboxedit ? tagboxedit._input_element : null;
                if (input_elem && input_elem._is_accept_touch && !input_elem._is_accept_touch())
                {
                    return false;
                }
            }
        }

        var ds = this._selectDataset(true);
        var idx = this._p_index;

        if (this._isPopupVisible())
        {
            this._closePopup();
        }
        else
        {
            this._showPopup(ds, idx, 1);
        }
    };

    _pMultiCombo._on_multicombotext_onkeydown = function (obj, e)
    {
        var checkboxset = this._p_multicombolist && this._p_multicombolist.checkboxset;

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

        var keycode = e.keycode;

        var cur_index;
        var nextidx;
        var rawidx;
        var curobj = null;
        var text = "";
        var rowcnt = ds.getRowCount();
        var filter_last;
        var sel = this._select_multi;
        var i;

        if (this._isPopupVisible())
        {
            // filter 일 때 재정렬된 값 으로 인자 넘기게 수정
            if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
            {
                for (i = 0; i < this._filtereddataset._viewRecords.length; i++)
                {
                    if (sel.lastselected == this._filtereddataset._viewRecords[i]._rawidx)
                    {
                        filter_last = i;
                    }
                }
                curobj = checkboxset._get_rowobj_status("mouseover", "status") || checkboxset._get_rowobj_status("selected", "userstatus", filter_last);
                if (curobj)
                {
                    cur_index = curobj.index;
                }
            }
            else
            {
                curobj = checkboxset._get_rowobj_status("mouseover", "status") || checkboxset._get_rowobj_status("selected", "userstatus", sel.lastselected);
                if (curobj)
                {
                    cur_index = curobj.index;
                }
            }
        }

        if (keycode == nexacro.Event.KEY_ESC)
        {
            if (this._isPopupVisible())
            {
                //text = this._getItemText(this._p_index);

                this._closePopup();
                //this._setEditValue(text);
            }
        }
        else if (keycode == nexacro.Event.KEY_UP)
        {
            if (this._isPopupVisible())
            {
                if (!e.altkey)
                {
                    if (cur_index != undefined)
                    {
                        for (i = cur_index - 1; i >= 0; i--)
                        {
                            rawidx = this._getRawIndex(ds, i);
                            if (!this._getItemReadonly(rawidx))
                            {
                                nextidx = i;
                                break;
                            }
                        }

                        if (nextidx == undefined)
                        {
                            nextidx = cur_index;
                        }

                        checkboxset._refreshScroll(nextidx, 1);
                        checkboxset._select_withkeyupevent(e.shiftkey, cur_index, nextidx);
                    }
                }
            }
        }
        else if (keycode == nexacro.Event.KEY_DOWN)
        {
            if (this._isPopupVisible())
            {
                if (!e.altkey)
                {
                    if (cur_index == undefined)
                    {
                        for (i = 0; i < rowcnt; i++)
                        {
                            rawidx = this._getRawIndex(ds, i);
                            if (!this._getItemReadonly(rawidx))
                            {
                                cur_index = i;
                                nextidx = i;
                                break;
                            }
                        }
                    }
                    else
                    {
                        for (i = cur_index + 1; i < rowcnt; i++)
                        {
                            rawidx = this._getRawIndex(ds, i);
                            if (!this._getItemReadonly(rawidx))
                            {
                                nextidx = i;
                                break;
                            }
                        }

                        if (nextidx == undefined)
                        {
                            nextidx = cur_index;
                        }
                    }
                }

                if (cur_index != undefined && nextidx != undefined)
                {
                    checkboxset._refreshScroll(nextidx, 0);
                    checkboxset._select_withkeydownevent(e.shiftkey, cur_index, nextidx);
                }
            }
            else
            {
                var multicombotext = this._p_multicombotext;
                var input_elem = multicombotext ? multicombotext._input_element : null;
                if (e.altkey && (!input_elem || (input_elem && (!input_elem._is_accept_touch || (input_elem._is_accept_touch && input_elem._is_accept_touch())))))
                {
                    this._showPopup(ds, cur_index, 1);
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
                    cur_index = rawidx;
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
            this.redraw();
            if (this._isPopupVisible())
            {
                if (cur_index > -1)
                {
                    checkboxset._select_add(cur_index);
                    this._insertIndex(cur_index);
                    this._p_multicombotext.set_value();
                    this.redraw();
                }
                this._is_close_popup_by_select = true;
                this._closePopup();
                this._is_close_popup_by_select = false;

                if (this._p_autoskip)
                {
                    this._setFocusToNextComponent();
                }
            }

            //this._setDefaultProps(cur_index, cur_value, cur_text);
        }
        else if (keycode == nexacro.Event.KEY_PAGE_UP)
        {
            if (this._isPopupVisible())
            {
                var curidx = cur_index;
                if (curidx < 0)
                    curidx = 0;

                nextidx = cur_index - checkboxset._page_rowcount;

                if (nextidx <= 0)
                {
                    nextidx = 0;
                }

                text = ds.getColumn(nextidx, datacol || codecol);
                text = text == undefined ? "" : text;

                //this._setEditValue(text);
                checkboxset._refreshScroll(null, null, keycode);
                checkboxset._change_status_item_from_key(cur_index, nextidx);
            }
        }
        else if (keycode == nexacro.Event.KEY_PAGE_DOWN)
        {
            if (this._isPopupVisible())
            {
                var curidx = cur_index;
                if (curidx < 0)
                    curidx = 0;

                nextidx = curidx + checkboxset._page_rowcount;

                if (nextidx >= rowcnt)
                {
                    nextidx = rowcnt - 1;
                }

                text = ds.getColumn(nextidx, datacol || codecol);
                text = text == undefined ? "" : text;

                //this._setEditValue(text);
                checkboxset._refreshScroll(null, null, keycode);
                checkboxset._change_status_item_from_key(curidx, nextidx);
            }
        }
        else if (keycode == nexacro.Event.KEY_HOME)
        {
            if (this._isPopupVisible() && this._p_type == "dropdown")
            {
                var curidx = cur_index;
                if (curidx < 0)
                    curidx = 0;

                nextidx = 0;
                text = ds.getColumn(nextidx, datacol || codecol);
                text = text == undefined ? "" : text;

                //this._setEditValue(text);
                checkboxset._refreshScroll(null, null, keycode);
                checkboxset._change_status_item_from_key(curidx, nextidx);
            }
        }
        else if (keycode == nexacro.Event.KEY_END)
        {
            if (this._isPopupVisible() && this._p_type == "dropdown")
            {
                var curidx = cur_index;
                if (curidx < 0)
                    curidx = 0;

                nextidx = rowcnt - 1;
                text = ds.getColumn(nextidx, datacol || codecol);
                text = text == undefined ? "" : text;

                //this._setEditValue(text);
                checkboxset._refreshScroll(null, null, keycode);
                checkboxset._change_status_item_from_key(curidx, nextidx);
            }
        }
        // space+ctrl 선택
        else if ((keycode == nexacro.Event.KEY_SPACE) && e.ctrlkey)
        {
            if (this._isPopupVisible() && curobj)
            {
                if (this._p_type == "dropdown")
                {
                    checkboxset._select_withmouseevent(cur_index);
                }
                else if (this._p_type == "search" || this._p_type == "caseisearch")
                {
                    checkboxset._select_withmouseevent(curobj.index, curobj);
                }
                else 
                {
                    checkboxset._select_withmouseevent(this._filtereddataset._viewRecords[curobj.index]._rawidx, curobj);
                }

                this.redraw();
            }
        }
        // alt + A 전체선택
        else if ((keycode == 65) && e.altkey)
        {
            if (this._select_multi.length != this._innerdataset.rowcount)
            {
                this._select_all();
            }
            else
            {
                this._clear_all();
            }
            this.redraw();
        }
    };

    _pMultiCombo._on_edit_onkeydown = function (obj, e)
    {
        var checkboxset = this._p_multicombolist && this._p_multicombolist.checkboxset;

        if (this._p_readonly)
        {
            return false;
        }

        var ds = this._selectDataset();
        var datacol = this._p_datacolumn;
        var codecol = this._p_codecolumn;
        var col = this._p_datacolumn || this._p_codecolumn;

        if (!ds || (!datacol && !codecol))
        {
            return;
        }

        var keycode = e.keycode;

        var cur_index;
        var nextidx;
        var rawidx;
        var curobj = null;
        var text = "";
        var rowcnt = ds.getRowCount();
        var enableaccessibility = this._env._p_enableaccessibility;
        var filter_last;
        var sel = this._select_multi;
        var i;

        if (this._isPopupVisible())
        {
            // filter 일 때 재정렬된 값 으로 인자 넘기게 수정
            if (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike")
            {
                for (i = 0; i < this._filtereddataset._viewRecords.length; i++)
                {
                    if (sel.lastselected == this._filtereddataset._viewRecords[i]._rawidx)
                    {
                        filter_last = i;
                    }
                }
                curobj = checkboxset._get_rowobj_status("mouseover", "status") || checkboxset._get_rowobj_status("selected", "userstatus", filter_last);
                if (curobj)
                {
                    cur_index = curobj.index;
                }
            }
            else
            {
                curobj = checkboxset._get_rowobj_status("mouseover", "status") || checkboxset._get_rowobj_status("selected", "userstatus", sel.lastselected);
                if (curobj)
                {
                    cur_index = curobj.index;
                }
            }
        }

        if (keycode == nexacro.Event.KEY_ESC)
        {
            if (this._isPopupVisible())
            {
                //text = this._getItemText(this._p_index);

                this._closePopup();
                //this._setEditValue(text);
            }
        }
        else if (keycode == nexacro.Event.KEY_UP)
        {
            if (this._isPopupVisible())
            {
                if (!e.altkey)
                {
                    if (cur_index != undefined)
                    {
                        for (i = cur_index - 1; i >= 0; i--)
                        {
                            rawidx = this._getRawIndex(ds, i);
                            if (!this._getItemReadonly(rawidx))
                            {
                                nextidx = i;
                                break;
                            }
                        }

                        if (nextidx == undefined)
                        {
                            nextidx = cur_index;
                        }

                        checkboxset._refreshScroll(nextidx, 1);
                        checkboxset._select_withkeyupevent(e.shiftkey, cur_index, nextidx);
                    }
                }
            }
        }
        else if (keycode == nexacro.Event.KEY_DOWN)
        {
            if (this._isPopupVisible())
            {
                if (!e.altkey)
                {
                    if (cur_index == undefined)
                    {
                        for (i = 0; i < rowcnt; i++)
                        {
                            rawidx = this._getRawIndex(ds, i);
                            if (!this._getItemReadonly(rawidx))
                            {
                                cur_index = i;
                                nextidx = i;
                                break;
                            }
                        }
                    }
                    else
                    {
                        for (i = cur_index + 1; i < rowcnt; i++)
                        {
                            rawidx = this._getRawIndex(ds, i);
                            if (!this._getItemReadonly(rawidx))
                            {
                                nextidx = i;
                                break;
                            }
                        }

                        if (nextidx == undefined)
                        {
                            nextidx = cur_index;
                        }
                    }
                }

                if (cur_index != undefined && nextidx != undefined)
                {
                    checkboxset._refreshScroll(nextidx, 0);
                    checkboxset._select_withkeydownevent(e.shiftkey, cur_index, nextidx);
                }
            }
            else
            {
                if (this._tagmode)
                {
                    var tagboxedit = this._p_multicombotagbox.tagboxedit;
                    if (tagboxedit)
                    {
                        var input_elem = tagboxedit ? tagboxedit._input_element : null;
                        if (e.altkey && (!input_elem || (input_elem && (!input_elem._is_accept_touch || (input_elem._is_accept_touch && input_elem._is_accept_touch())))))
                        {
                            this._showPopup(ds, cur_index, 1);
                        }
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
                    cur_index = rawidx;
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
            this.redraw();
            if (this._isPopupVisible())
            {
                if (cur_index > -1)
                {
                    checkboxset._select_add(cur_index);
                    this._insertIndex(cur_index);
                    this.redraw();
                }
                this._is_close_popup_by_select = true;
                this._closePopup();
                this._is_close_popup_by_select = false;

                if (this._p_autoskip)
                {
                    this._setFocusToNextComponent();
                }
            }

            //this._setDefaultProps(cur_index, cur_value, cur_text);
        }
        else if (keycode == nexacro.Event.KEY_PAGE_UP)
        {
            if (this._isPopupVisible())
            {
                var curidx = cur_index;
                if (curidx < 0)
                    curidx = 0;

                nextidx = cur_index - checkboxset._page_rowcount;

                if (nextidx <= 0)
                {
                    nextidx = 0;
                }

                text = ds.getColumn(nextidx, datacol || codecol);
                text = text == undefined ? "" : text;

                //this._setEditValue(text);
                checkboxset._refreshScroll(null, null, keycode);
                checkboxset._change_status_item_from_key(cur_index, nextidx);
            }
        }
        else if (keycode == nexacro.Event.KEY_PAGE_DOWN)
        {
            if (this._isPopupVisible())
            {
                var curidx = cur_index;
                if (curidx < 0)
                    curidx = 0;

                nextidx = curidx + checkboxset._page_rowcount;

                if (nextidx >= rowcnt)
                {
                    nextidx = rowcnt - 1;
                }

                text = ds.getColumn(nextidx, datacol || codecol);
                text = text == undefined ? "" : text;

                //this._setEditValue(text);
                checkboxset._refreshScroll(null, null, keycode);
                checkboxset._change_status_item_from_key(curidx, nextidx);
            }
        }
        else if (keycode == nexacro.Event.KEY_HOME)
        {
            if (this._isPopupVisible() && this._p_type == "dropdown")
            {
                var curidx = cur_index;
                if (curidx < 0)
                    curidx = 0;

                nextidx = 0;
                text = ds.getColumn(nextidx, datacol || codecol);
                text = text == undefined ? "" : text;

                //this._setEditValue(text);
                checkboxset._refreshScroll(null, null, keycode);
                checkboxset._change_status_item_from_key(curidx, nextidx);
            }
        }
        else if (keycode == nexacro.Event.KEY_END)
        {
            if (this._isPopupVisible() && this._p_type == "dropdown")
            {
                var curidx = cur_index;
                if (curidx < 0)
                    curidx = 0;

                nextidx = rowcnt - 1;
                text = ds.getColumn(nextidx, datacol || codecol);
                text = text == undefined ? "" : text;

                //this._setEditValue(text);
                checkboxset._refreshScroll(null, null, keycode);
                checkboxset._change_status_item_from_key(curidx, nextidx);
            }
        }
        // space+ctrl 선택
        else if ((keycode == nexacro.Event.KEY_SPACE) && e.ctrlkey)
        {
            if (this._isPopupVisible() && curobj)
            {
                if (this._p_type == "dropdown")
                {
                    checkboxset._select_withmouseevent(cur_index);
                }
                else if (this._p_type == "search" || this._p_type == "caseisearch")
                {
                    checkboxset._select_withmouseevent(curobj.index, curobj);
                }
                else 
                {

                    var ds = this._selectDataset();
                    cur_index = this._getRawIndex(ds, curobj.index);

                    checkboxset._select_withmouseevent(cur_index, curobj);
                }

                this.redraw();
            }
        }
        // alt + A 전체선택
        else if ((keycode == 65) && e.altkey)
        {
            if (this._select_multi.length != this._innerdataset.rowcount)
            {
                this._select_all();
            }
            else
            {
                this._clear_all();
            }
            this.redraw();
        }
    };

    _pMultiCombo._on_multicombotext_onkeyup = function (obj, e)
    {
        var checkboxset = this._p_multicombolist && this._p_multicombolist.checkboxset;

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

        var keycode = e.keycode;

        if (keycode == nexacro.Event.KEY_UP || keycode == nexacro.Event.KEY_DOWN)
        {
            if (this._isPopupVisible())
            {
                var curobj = checkboxset._get_rowobj_status("mouseover", "status") || checkboxset._get_rowobj_status("selected", "userstatus");
                if (curobj)
                {
                    var curidx = curobj.index;
                    if (!e.shiftkey && !e.altkey)
                    {
                        checkboxset._shift_select_base_index = curidx;
                    }
                }
            }
        }
        else if (keycode == nexacro.Event.KEY_SHIFT)
        {
            if (this._isPopupVisible())
            {
                checkboxset._is_shift_first_pressed = true;
            }
        }
    };

    _pMultiCombo._on_edit_onkeyup = function (obj, e)
    {
        var checkboxset = this._p_multicombolist && this._p_multicombolist.checkboxset;

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

        var keycode = e.keycode;

        if (keycode == nexacro.Event.KEY_UP || keycode == nexacro.Event.KEY_DOWN)
        {
            if (this._isPopupVisible())
            {
                var curobj = checkboxset._get_rowobj_status("mouseover", "status") || checkboxset._get_rowobj_status("selected", "userstatus");
                if (curobj)
                {
                    var curidx = curobj.index;
                    if (!e.shiftkey && !e.altkey)
                    {
                        checkboxset._shift_select_base_index = curidx;
                    }
                }
            }
        }
        else if (keycode == nexacro.Event.KEY_SHIFT)
        {
            if (this._isPopupVisible())
            {
                checkboxset._is_shift_first_pressed = true;
            }
        }
    };

    _pMultiCombo._on_edit_oninput = function (obj, e)
    {
        if (this._p_readonly || !this._isEnable())
        {
            return false;
        }

        this._isFiredOnInput = true;
        this.on_fire_oninput();

        var multicomboedit;
        if (this._tagmode)
            multicomboedit = this._p_multicombotagbox.tagboxedit;
        else
            multicomboedit = this._p_multicombolist.multicomboedit;

        var input_elem = multicomboedit ? multicomboedit._input_element : null;
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
        if (this._p_multicombotagbox)
            multicomboedit._processing_keyfilter = true
        if (ds)
        {
            var col = this._p_datacolumn || this._p_codecolumn;
            var edit_val = multicomboedit._p_text;
            var str = edit_val;

            var last_separator_index = edit_val.lastIndexOf(this._p_textseparator);
            edit_val = edit_val.substr(last_separator_index + 1);

            var type = this._p_type;
            if (type != "dropdown")
            {
                if (!this._p_multicombolist)
                {
                    this._createPopupListBoxControl(ds);
                }
            }

            var checkboxset = this._p_multicombolist && this._p_multicombolist.checkboxset;
            switch (type)
            {
                case "search":
                case "caseisearch":
                    var index;

                    if (this._p_type == "caseisearch")
                    {
                        index = ds.findRowExpr(col + ".match(/^" + edit_val + "/i)");
                        if (edit_val == "")
                        {
                            index = -1;
                        }
                    }
                    else
                    {
                        index = ds.findRowAs(col, edit_val);
                    }

                    if (index >= 0)
                    {
                        if (this._p_edittype == "singletag" || this._p_edittype == "multitag")
                            this._showPopup(ds, index);
                        else
                        {
                            var rowcount = this._innerdataset.rowcount;
                            for (var i = 0; i < rowcount; i++)
                            {
                                var row_item = checkboxset._getItem(i);
                                if (row_item)
                                {
                                    row_item._changeStatus("mouseover", false);
                                }
                            }
                        }
                        var rowobj = checkboxset._getItem(index);
                        if (rowobj && !rowobj.readonly)
                        {
                            rowobj._changeStatus("mouseover", true);
                            checkboxset._set_last_selectfocused(index);
                        }
                    }
                    else
                    {
                        if (this._isPopupVisible())
                        {
                            if (this._p_edittype == "singletag" || this._p_edittype == "multitag")
                            {
                                this._closePopup();
                            }
                            else
                            {
                                var rowcount = this._innerdataset.rowcount;
                                for (var i = 0; i < rowcount; i++)
                                {
                                    var rowobj = checkboxset._getItem(i);
                                    if (rowobj)
                                    {
                                        rowobj._changeStatus("mouseover", false);
                                    }
                                }
                            }
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
                    var index;
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
                    {
                        ds.set_filterstr(col + ".match(/^(" + trans_val + ")/)");
                        index = ds.findRowAs(col, parse_val);
                    }
                    else if (this._p_type == "filterlike")
                    {
                        ds.set_filterstr(col + ".indexOf('" + parse_val + "') > -1");
                        index = ds.findRowExpr(col + ".indexOf('" + parse_val + "') > -1");
                    }
                    else if (this._p_type == "caseifilter")
                    {
                        ds.set_filterstr(col + ".match(/^(" + trans_val + ")/i)");
                        index = ds.findRowExpr(col + ".match(/^(" + trans_val + ")/i)");
                    }
                    else  //caseifilterlike
                    {
                        ds.set_filterstr(col + ".match(/(" + trans_val + ")/i)");
                        index = ds.findRowExpr(col + ".match(/(" + trans_val + ")/i)");
                    }

                    if (edit_val && ds.getRowCount() > 0)
                    {
                        this._showPopup(ds, 0);

                        var win = this._getWindow();
                        if (win)
                        {
                            if (nexacro._Browser == "Runtime" && (nexacro._SystemType.toLowerCase() == "win32" || nexacro._SystemType.toLowerCase() == "win64"))
                                nexacro._flushCommand(win);
                        }
                        var rowobj = checkboxset._getItem(index);
                        if (rowobj && !rowobj.readonly)
                        {
                            rowobj._changeStatus("mouseover", true);
                            checkboxset._set_last_selectfocused(index);
                        }
                    }
                    else
                    {
                        if (this._isPopupVisible())
                        {
                            this._closePopup();
                            this._showPopup(ds, index, 1);
                        }
                    }
                    break;
                default:
                    break;
            }
        }
        this._isFiredOnInput = false;
    };

    _pMultiCombo._on_edit_oneditclick = function (obj, e)
    {
        this.on_fire_oneditclick(obj, e.caretpos, e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, obj, obj, e.metakey);
    };

    _pMultiCombo._on_multicombotext_oneditclick = function (obj, e)
    {
        this.on_fire_oneditclick(obj, e.caretpos, e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, obj, obj, e.metakey);
    };

    _pMultiCombo._on_edit_mobile_oneditclick = function (obj, e)
    {
        if (!this._p_readonly)
        {
            var multicomboedit = (this._p_multicombotagbox && this._p_multicombotagbox.tagboxedit) || (this._p_multicombolist && this._p_multicombolist.multicomboedit);
            var input_elem = multicomboedit ? multicomboedit._input_element : null;
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
                    //this._setEditValue(this._getItemText(this._p_index));
                }
                else
                {
                    if (this._p_type == "dropdown")
                    {
                        this._showPopup(ds, idx, 1);
                    }
                }
            }
        }
        this.on_fire_oneditclick(obj, e.caretpos, e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, obj, obj, e.metakey);
    };

    _pMultiCombo._on_multicombotext_mobile_oneditclick = function (obj, e)
    {
        if (this._p_readonly)
            return;

        var multicombotext = this._p_multicombotext;
        var input_elem = multicombotext ? multicombotext._input_element : null;
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
                //this._setEditValue(this._getItemText(this._p_index));
            }
            else
            {
                if (this._p_type == "dropdown")
                {
                    this._showPopup(ds, idx, 1);
                }
            }
        }

        this.on_fire_oneditclick(obj, e.caretpos, e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, obj, obj, e.metakey);
    };

    _pMultiCombo._on_drop_onlbuttondown = function (obj, e)
    {
        if (e.button == "lbutton")
            this._on_dropdown();
    };

    _pMultiCombo._on_drop_mobile_onclick = function (obj, e)
    {
        this._on_dropdown();
    };

    _pMultiCombo._on_drop_onclick = function (obj, e)
    {
        if (e.button == "touch")
            this._on_dropdown();
    };

    _pMultiCombo._on_tagbox_onkeydown = function (obj, e)
    {
        var keycode = e.keycode;
        var multicombotagbox = this._p_multicombotagbox;
        var multicombotags = multicombotagbox._multicombotags;
        var selected_tag = this._select_multi.tagselect;
        var selectItems = this._select_multi.items;
        var idx, last_idx;
        if (selectItems.length == 0)
            return;
        if (selected_tag != -1)
        {
            idx = selectItems.indexOf(selected_tag);
            last_idx = selected_tag;
        }
        else
        {
            idx = selectItems.indexOf(selectItems[selectItems.length - 1]);
            last_idx = selectItems[selectItems.length - 1];
        }


        if (keycode == 37 || keycode == 39 || keycode == 46)
        {
            var caret_pos = this.getCaretPos();
            if (caret_pos != 0)
                return;

            switch (keycode)
            {
                case 37: // left arrow
                    if (idx == 0 || last_idx < 0)
                    {
                        if (selected_tag == -1)
                        {
                            multicombotags[last_idx]._changeUserStatus("selected", true);
                            this._select_multi.tagselect = selected_tag = selectItems[selectItems.length - 1];
                        }
                        break;
                    }
                    if (selected_tag == -1)
                    {
                        multicombotags[last_idx]._changeUserStatus("selected", true);
                        this._select_multi.tagselect = selected_tag = selectItems[selectItems.length - 1];
                    }
                    else
                    {
                        idx -= 1;
                        multicombotags[selected_tag]._changeUserStatus("selected", false);
                        multicombotags[selectItems[idx]]._changeUserStatus("selected", true);
                        this._select_multi.tagselect = selected_tag = selectItems[idx];
                    }

                    var last_tag = multicombotags[selected_tag];
                    multicombotagbox._scrollTo(last_tag.left, last_tag.top);
                    break;

                case 39: // right arrow
                    if (selected_tag == -1)
                        break;
                    if (selected_tag == selectItems[selectItems.length - 1])
                    {
                        if (this._p_type == "dropdown")
                            break;
                        multicombotags[selected_tag]._changeUserStatus("selected", false);
                        this._select_multi.tagselect = selected_tag = -1;
                        multicombotagbox.tagboxedit._apply_setfocus();
                        var last_tag = multicombotagbox._multicombotags[selectItems[selectItems.length - 1]];
                    }
                    else
                    {
                        idx += 1;
                        multicombotags[selected_tag]._changeUserStatus("selected", false)
                        multicombotags[selectItems[idx]]._changeUserStatus("selected", true)
                        this._select_multi.tagselect = selected_tag = selectItems[idx];
                        var last_tag = multicombotags[selected_tag];
                    }

                    multicombotagbox._scrollTo(last_tag.left, last_tag.top);
                    break;

                case 46:
                    var del_tag = selected_tag;
                    if (selected_tag == -1)
                        break;
                    if (selected_tag == selectItems[selectItems.length - 1])
                    {
                        idx -= 1;
                        multicombotags[selected_tag]._changeUserStatus("selected", false);
                        if (selectItems.length != 1)
                        {
                            multicombotags[selectItems[idx]]._changeUserStatus("selected", true);

                            this._select_multi.tagselect = selected_tag = selectItems[idx];
                        }
                    }
                    else
                    {
                        idx += 1;
                        multicombotags[selected_tag]._changeUserStatus("selected", false)
                        multicombotags[selectItems[idx]]._changeUserStatus("selected", true)

                        this._select_multi.tagselect = selected_tag = selectItems[idx];
                        var last_tag = multicombotags[selected_tag];
                    }

                    if (!this._p_enable || this._p_readonly || !this._p_visible)
                    {
                        return false;
                    }

                    if (this._getItemReadonly(del_tag))
                    {
                        return false;
                    }

                    if (this._isPopupVisible())
                        this._p_multicombolist.checkboxset._select_withmouseevent(del_tag, obj);
                    else
                    {
                        this._select_remove(del_tag);
                        this._removeindex(del_tag);
                    }

                    this._p_multicombotagbox._destroyMulticomboTag(del_tag);

                    this._recalcLayout();
                    this.redraw();
                    if (this._select_multi.tagselect == -1)
                    {
                        multicombotagbox.tagboxedit._apply_setfocus();
                    }
            }
        }
    };

    _pMultiCombo._on_tagbox_onlbuttondown = function (obj, e)
    {
        var ref = e.fromreferenceobject instanceof nexacro.ScrollBarControl;
        var parent_ref = e.fromreferenceobject.parent instanceof nexacro.ScrollBarControl;
        var tagbutton = e.fromreferenceobject instanceof nexacro._MultiComboTagButtonControl;
        var tagtext = e.fromreferenceobject instanceof nexacro.Static;
        var tagitem = e.fromreferenceobject instanceof nexacro._TagBoxControl;
        var tagboxedit = this._p_multicombotagbox.tagboxedit;


        if (ref || parent_ref || tagbutton || tagtext || tagitem)
        {
            return;
        }
        else if (tagboxedit.width)
        {
            tagboxedit._apply_setfocus();
            return;
        }

        tagboxedit._apply_setfocus();

        if (e.button == "lbutton")
            this._on_dropdown();

    };

    _pMultiCombo._on_tagbox_mobile_onclick = function (obj, e)
    {
        var ref = e.fromreferenceobject instanceof nexacro.ScrollBarControl;
        var parent_ref = e.fromreferenceobject.parent instanceof nexacro.ScrollBarControl;
        var tagbutton = e.fromreferenceobject instanceof nexacro._MultiComboTagButtonControl;
        var tagtext = e.fromreferenceobject instanceof nexacro.Static;
        var tagitem = e.fromreferenceobject instanceof nexacro._TagBoxControl;
        var tagboxedit = this._p_multicombotagbox.tagboxedit;


        if (ref || parent_ref || tagbutton || tagtext || tagitem)
        {
            return;
        }
        else if (tagboxedit.width)
        {
            tagboxedit._apply_setfocus();
            return;
        }

        tagboxedit._apply_setfocus();

        if (e.button == "lbutton")
            this._on_dropdown();

    };

    _pMultiCombo._on_list_onitemclick = function (obj, e)
    {
        if (!this._p_multicombolist)
        {
            return false;
        }

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
        var checkboxset = this._p_multicombolist && this._p_multicombolist.checkboxset;
        checkboxset._select_withmouseevent(cur_index, obj);

        this._is_close_popup_by_select = true;

        this.redraw();
        if (ds && ds._p_filterstr != "")
        {
            ds.set_filterstr("");
            var popupcontrol = this._popupcontrol;
            if (popupcontrol)
            {
                popupcontrol._popupAuto();
            }

            checkboxset._redrawListBoxContents(true);
            checkboxset._onRecalcScrollSize();
        }

        if (this._tagmode)
        {
            this._p_multicombotagbox.tagboxedit._apply_setfocus();
        }
        else
        {
            if (this._p_type != "dropdown" && this._isPopupVisible())
            {
                this._p_multicombolist.multicomboedit._apply_setfocus();
            }
            else
            {
                this._p_multicombotext._apply_setfocus();
            }
        }

        if (this._isPopupVisible())
        {
            //this._closePopup();

            if (this._p_autoskip)
            {
                this._setFocusToNextComponent();
            }
        }

        this._is_close_popup_by_select = false;
    };

    _pMultiCombo._on_list_oncloseup = function (obj, e)
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
                this._setEditValue("");
            }

            this._clearFilteredDataset();

            var multicombotext = this._p_multicombotext;
            if (multicombotext)
            {
                multicombotext._apply_setfocus("focus");
            }
        }

        this._changeStatus("mouseover", false);

        if (this._p_dropbutton)
            this._p_dropbutton._changeStatus("mouseover", false);

        if (this._p_multicombotext)
            this._p_multicombotext._changeStatus("mouseover", false);

        if (this._p_multicombotagbox)
            this._p_multicombotagbox._changeStatus("mouseover", false);

        this.on_fire_oncloseup(this, this._default_index, this._default_text, this._default_value, this._p_index, this._p_text, this._p_value, this._is_close_popup_by_select);

    };

    _pMultiCombo.on_focus_basic_action = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        this._changeStatus("focused", true);

        if (this._env._p_enableaccessibility)
        {
            this._setAccessibilityStatFocus(evt_name);
        }

        this._apply_setfocus(evt_name);
    };

    _pMultiCombo.on_killfocus_basic_action = function (new_focus, new_refer_focus)
    {
        nexacro.Component.prototype.on_killfocus_basic_action.call(this);

        var multicombotext = this._p_multicombotext;
        if (multicombotext)
        {
            multicombotext._changeStatus("focused", false);
            if (this._env._p_enableaccessibility)
            {
                if (nexacro._Browser == "Runtime")
                {
                    multicombotext._is_subfocused = false;
                }
            }

            if (this._p_text != this._p_multicombotext._p_text)
            {
                multicombotext.setCaretPos(0);
            }
        }

        if (this._select_multi.tagselect != -1)
        {
            this._p_multicombotagbox._multicombotags[this._select_multi.tagselect]._changeUserStatus("selected", false);
            this._select_multi.tagselect = -1;
        }

        this.redraw();

        if (this._isPopupVisible())
        {
            this._closePopup();
        }
    };

    _pMultiCombo.on_fire_sys_onaccessibilitygesture = function (direction, fire_comp, refer_comp)
    {
        var ret = false;
        if (this._isPopupVisible())
        {
            var checkboxset = this._p_multicombolist && this._p_multicombolist.checkboxset;
            var item = null;
            var item_len = checkboxset._getContentsCount();
            if (item_len)
            {
                if (direction)
                {
                    checkboxset._overeditemindex++;
                }
                else
                {
                    checkboxset._overeditemindex--;
                }

                // 첫번째 아이템에서 역방향으로 슬라이드하면 이전 컴포넌트로 이동.
                // 마지막 아이템에서 순방향으로 슬라이드하면 다음 컴포넌트로 이동.
                if (checkboxset._overeditemindex < 0 || checkboxset._overeditemindex > item_len - 1)
                {
                    if (this._isPopupVisible())
                    {
                        this._closePopup();
                    }
                    checkboxset._overeditemindex = -1;
                }
                else
                {
                    item = checkboxset._getItem(checkboxset._overeditemindex);
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

    _pMultiCombo.on_fire_sys_onslide = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        nexacro.Component.prototype.on_fire_sys_onslide.call(this, elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp);

        return (this._popupcontrol && this._popupcontrol._is_popup()) ? true : false;
    };

    _pMultiCombo.on_fire_sys_onfling = function (elem, fling_handler, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp)
    {
        nexacro.Component.prototype.on_fire_sys_onfling.call(this, elem, fling_handler, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp);

        return (this._popupcontrol && this._popupcontrol._is_popup()) ? true : false;
    };

    _pMultiCombo.on_fire_oneditclick = function (obj, caretpos, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.oneditclick && this.oneditclick._has_handlers)
        {
            var evt = new nexacro.EditClickEventInfo(obj, "oneditclick", caretpos, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key);
            return this.oneditclick._fireEvent(this, evt);
        }

        return true;
    };

    _pMultiCombo.on_fire_onitemclick = function (obj, index, itemtext, itemvalue, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, meta_key)
    {
        if (this.onitemclick && this.onitemclick._has_handlers)
        {
            var evt = new nexacro.ItemClickEventInfo(obj, "onitemclick", index, itemtext, itemvalue, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, meta_key);
            this.onitemclick._fireEvent(this, evt);
        }

        return false;
    };

    _pMultiCombo.on_fire_canitemchange = function (obj, preindex, pretext, prevalue, postindex, posttext, postvalue)
    {
        if (this.canitemchange && this.canitemchange._has_handlers)
        {
            var evt = new nexacro.ItemChangeEventInfo(this, "canitemchange", preindex, pretext, prevalue, postindex, posttext, postvalue);
            var ret = this.canitemchange._fireCheckEvent(this, evt);
            return nexacro._toBoolean(ret);
        }

        return true;
    };

    _pMultiCombo.on_fire_onitemchanged = function (obj, preindex, pretext, prevalue, postindex, posttext, postvalue)
    {
        if (this.onitemchanged && this.onitemchanged._has_handlers)
        {
            var evt = new nexacro.ItemChangeEventInfo(this, "onitemchanged", preindex, pretext, prevalue, postindex, posttext, postvalue);
            this.onitemchanged._fireEvent(this, evt);
        }
    };

    _pMultiCombo.on_fire_oncloseup = function (obj, preindex, pretext, prevalue, postindex, posttext, postvalue, is_select)
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

    _pMultiCombo.on_fire_ondropdown = function (obj)
    {
        if (this.ondropdown && this.ondropdown._has_handlers)
        {
            var evt = new nexacro.EventInfo(this, "ondropdown");
            return this.ondropdown._fireCheckEvent(this, evt);
        }

        return true;
    };

    _pMultiCombo.on_fire_oninput = function ()
    {
        if (this.oninput && this.oninput._has_handlers)
        {
            var evt = new nexacro.InputEventInfo(this, "oninput");
            return this.oninput._fireEvent(this, evt);
        }

        return true;
    };

    _pMultiCombo.on_fire_oninnerdatachanged = function (obj, oldvalue, newvalue, columnid, col, row)
    {
        if (this.oninnerdatachanged && this.oninnerdatachanged._has_handlers)
        {
            var evt = new nexacro.InnerdataChangedEventInfo(obj, "oninnerdatachanged", oldvalue, newvalue, columnid, col, row);
            return this.oninnerdatachanged._fireEvent(this, evt);
        }

        return true;
    };

    _pMultiCombo.on_fire_sys_onrbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        if (this.isDropdown())
        {
            var checkboxset = this._p_multicombolist && this._p_multicombolist.checkboxset;
            if (checkboxset)
            {
                var sel_info_list = checkboxset._selectinfo_list;

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
        }
        return;
    };


    _pMultiCombo._on_tagbutton_onclick = function (index, obj)
    {
        if (!this._p_enable || this._p_readonly || !this._p_visible)
        {
            return false;
        }

        if (this._getItemReadonly(index))
        {
            return false;
        }

        if (this._isPopupVisible())
        {
            var checkboxset = this._p_multicombolist && this._p_multicombolist.checkboxset;
            if (checkboxset)
            {
                checkboxset._select_withmouseevent(index, obj);
            }
        }
        else
        {
            this._select_remove(index);
            this._removeindex(index);
        }

        this._p_multicombotagbox._destroyMulticomboTag(index);

        this._recalcLayout();
        this.redraw();
    };

    //===============================================================
    // nexacro.MultiCombo : Logical part
    //===============================================================
    _pMultiCombo._createMultiComboTagBoxControl = function ()
    {
        if (this._p_multicombotext)
        {
            this._p_multicombotext.destroy();
            this._p_multicombotext = null;
        }

        var multicombotagbox = this._p_multicombotagbox;
        if (!multicombotagbox)
        {
            multicombotagbox = this._p_multicombotagbox = new nexacro._MultiComboTagBoxControl("multicombotagbox", 0, 0, 0, 0, null, null, null, null, null, null, this);
            multicombotagbox.createComponent();

            multicombotagbox.set_scrollbartype(this._p_tagboxscrollbartype);
            multicombotagbox.set_scrollbarsize(this._p_tagboxscrollbarsize);
            multicombotagbox.set_scrollindicatorsize(this._p_tagboxscrollindicatorsize);
        }

        if (this._p_edittype == "singletag")
        {
            multicombotagbox.set_scrolltype("horizontal");
        }
        else
        {
            multicombotagbox.set_scrolltype("vertical");
        }
    };

    _pMultiCombo._createMultiComboTextControl = function ()
    {
        if (this._p_multicombotagbox)
        {
            this._p_multicombotagbox.destroy();
            this._p_multicombotagbox = null;
        }

        var multicombotext = this._p_multicombotext;
        if (!multicombotext)
        {
            multicombotext = this._p_multicombotext = new nexacro.Edit("multicombotext", 0, 0, 0, 0, null, null, null, null, null, null, this, this._onlydisplay);
            multicombotext._setControl();
            multicombotext.createComponent(true);

            if (this._is_created)
            {
                multicombotext.on_created();
            }

            multicombotext._setReadonlyView(true);
            multicombotext.set_displaynulltext(this._p_displaynulltext);
            multicombotext.set_readonly(this._p_readonly);
            multicombotext.set_usecontextmenu(this._p_usecontextmenu);
        }
    };

    _pMultiCombo._createListBoxControl = function (ds)
    {
        var multicombolist = this._p_multicombolist;
        if (!multicombolist)
        {
            multicombolist = this._p_multicombolist = new nexacro._MultiComboListControl("multicombolist", 0, 0, 0, 0, null, null, null, null, null, null, this);

            multicombolist._setPopupContains(true);
            multicombolist.createComponent(true);

            if (!this._tagmode && this._p_type != "dropdown")
            {
                multicombolist._createPopupEditControl();
            }

            if (this._p_showselectallcheckbox)
            {
                multicombolist._createSelectAllCheckBoxControl();
            }
        }

        multicombolist._createCheckBoxSetControl(ds);
    };

    _pMultiCombo._createdListBoxControl = function ()
    {
        var multicombolist = this._p_multicombolist;
        if (multicombolist && !multicombolist._is_created)
        {
            multicombolist.on_created();

            if (multicombolist.multicomboedit)
            {
                multicombolist._createdPopupEditControl();
            }

            if (multicombolist.selectallcheckbox)
            {
                multicombolist._createdSelectAllCheckBoxControl();
            }

            if (multicombolist.checkboxset)
            {
                multicombolist._createdCheckBoxSetControl();
            }
        }
    };

    _pMultiCombo._createPopupControl = function ()
    {
        var popupcontrol = this._popupcontrol;
        if (!popupcontrol)
        {
            popupcontrol = this._popupcontrol = new nexacro._MultiComboPopupControl("multicombopopup", 0, 0, 0, 0, null, null, null, null, null, null, this);
            popupcontrol._setType(this._p_popuptype);

            popupcontrol.createComponent(true);
        }
    };

    _pMultiCombo._createdPopupControl = function (attach_comp)
    {
        var popupcontrol = this._popupcontrol;
        if (popupcontrol && !popupcontrol._is_created)
        {
            popupcontrol._attach(attach_comp);
            popupcontrol.on_created();
        }
    };

    _pMultiCombo._createPopupListBoxControl = function (ds)
    {
        if (!this._isUsableDataset(ds))
        {
            return;
        }

        this._createPopupControl();
        this._createListBoxControl(ds);

        this._createdPopupControl(this._p_multicombolist);
        this._createdListBoxControl();
    };

    _pMultiCombo._createFilteredDataset = function ()
    {
        var ids = this._innerdataset;
        var fds = this._filtereddataset;
        var codecol = this._p_codecolumn;
        var datacol = this._p_datacolumn;
        var readonlycol = this._p_readonlycolumn;
        var checkboxset = this._p_multicombolist && this._p_multicombolist.checkboxset;

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
        fds.addColumn(readonlycol, "string");

        for (var i = 0, cnt = ids.getRowCount(); i < cnt; i++)
        {
            fds.insertRow(i);
            fds.setColumn(i, codecol, ids.getColumn(i, codecol));
            fds.setColumn(i, datacol, ids.getColumn(i, datacol));
            fds.setColumn(i, readonlycol, ids.getColumn(i, readonlycol));
        }

        fds.set_enableevent(true);

        if (checkboxset)
        {
            checkboxset._redrawListBoxContents(false);
            checkboxset._onRecalcScrollSize();
        }
    };

    _pMultiCombo._recalcLayout = function ()
    {
        if (this._is_created_contents)
        {
            var dropbutton = this._p_dropbutton;
            var multicombotext = this._p_multicombotext;
            var multicombotagbox = this._p_multicombotagbox;

            var client_left = this._getClientLeft();
            var client_top = this._getClientTop();
            var client_width = this._getClientWidth();
            var client_height = this._getClientHeight();

            var dropbutton_size = this._p_buttonsize;
            var dropbutton_width, dropbutton_height;

            if (dropbutton_size == undefined)
            {
                dropbutton_width = client_height;
                dropbutton_height = client_height;
            }
            else
            {
                if (typeof (dropbutton_size) == "number")
                {
                    dropbutton_width = dropbutton_height = dropbutton_size;
                }
                else
                {
                    dropbutton_size = dropbutton_size.split(" ");
                    dropbutton_width = +dropbutton_size[0];
                    dropbutton_height = (dropbutton_size[1]) ? +dropbutton_size[1] : client_height;
                }
            }

            if (dropbutton_width > client_width)
            {
                dropbutton_width = client_width;
            }
            if (dropbutton_height > client_height)
            {
                dropbutton_height = client_height;
            }

            if (multicombotext)
            {
                var text_width, text_height;

                text_width = client_width - dropbutton_width;
                text_height = client_height;

                multicombotext.move(client_left, client_top, text_width, text_height, null, null);
            }

            if (multicombotagbox)
            {
                var tagbox_width, tagbox_height;

                tagbox_width = client_width - dropbutton_width;
                tagbox_height = client_height;

                multicombotagbox.move(client_left, client_top, tagbox_width, tagbox_height, null, null);
                multicombotagbox._recalcLayout();
            }

            if (dropbutton)
            {
                var btn_left = client_width - dropbutton_width;
                var btn_top = client_top;

                if (dropbutton_height < client_height)
                    btn_top = (client_height - dropbutton_height) / 2;

                dropbutton.move(btn_left, btn_top, dropbutton_width, dropbutton_height, null, null);
            }
        }
    };

    _pMultiCombo._recheckIndex = function ()
    {
        var idx = this._p_index;
        var indexes = "";
        var texts = "";
        var values = "";

        var ds = this._innerdataset;
        if (ds && idx != "-1")
        {
            var env = this._env;
            var valueseparator = env.multivalueseparator ? env.multivalueseparator : ",";
            var textseparator = this._p_textseparator;
            idx = idx.split(",");

            var index, text, value;
            for (var i = 0; i < idx.length; i++)
            {
                index = idx[i];
                value = this._getItemValue(index);
                if (value)
                {
                    text = this._getItemText(index);

                    if (indexes == "")
                    {
                        indexes = index.toString();
                        texts = text;
                        values = value;
                    }
                    else
                    {
                        indexes += "," + index;
                        texts += textseparator + text;
                        values += valueseparator + value;
                    }
                }
                else
                {
                    this._select_remove(index);
                }
            }
        }
        else
        {
            indexes = "-1";
        }

        this._setIndex(indexes);
        this._setText(texts);
        this._setValue(values);
    };

    _pMultiCombo._recheckValue = function ()
    {
        var val = this._p_value;
        var indexes = "";
        var texts = "";
        var values = "";

        var ds = this._innerdataset;
        if (ds && val)
        {
            var env = this._env;
            var valueseparator = env.multivalueseparator ? env.multivalueseparator : ",";
            var textseparator = this._p_textseparator;
            val = val.split(valueseparator);

            var index, text, value;
            for (var i = 0; i < val.length; i++)
            {
                value = val[i];
                index = this._getIndexFromValue(ds, value);
                if (index > -1)
                {
                    text = this._getItemText(index);

                    if (indexes == "")
                    {
                        indexes = index.toString();
                        texts = text;
                        values = value;
                    }
                    else
                    {
                        indexes += "," + index;
                        texts += textseparator + text;
                        values += valueseparator + value;
                    }
                }
            }
        }
        else
        {
            values = undefined;
        }

        this._setIndex(indexes);
        this._setText(texts);
        this._setValue(values);
    };

    _pMultiCombo._recheckText = function ()
    {
        var txt = this._p_text;
        var indexes = [];
        var texts = [];
        var values = [];

        var ds = this._innerdataset;
        if (ds)
        {
            var env = this._env;
            var valueseparator = env.multivalueseparator ? env.multivalueseparator : ",";
            var textseparator = this._p_textseparator;
            txt = txt.split(textseparator);

            var index, text, value;
            for (var i = 0; i < txt.length; i++)
            {
                text = txt[i];
                index = this._getIndexFromText(ds, text);
                if (index)
                {
                    value = this._getItemValue(index);

                    if (indexes == "")
                    {
                        indexes = index.toString();
                        texts = text;
                        values = value;
                    }
                    else
                    {
                        indexes += "," + index;
                        texts += textseparator + text;
                        values += valueseparator + value;
                    }
                }
            }
        }
        else
        {
            texts = "";
        }

        this._setIndex(indexes);
        this._setText(texts);
        this._setValue(values);
    };

    _pMultiCombo._selectDataset = function (bInit)
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

    _pMultiCombo._showPopup = function (ds, index, use_timer)
    {
        this._on_showPopup(ds, index);
    };

    _pMultiCombo._on_showPopup = function (ds, index)
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

            var popupcontrol = this._popupcontrol;
            if (popupcontrol)
            {
                popupcontrol._popupAuto();
            }

            var multicombolist = this._p_multicombolist;
            var multicombotext = this._p_multicombotext;
            if (multicombolist)
            {
                var checkboxset = multicombolist.checkboxset;
                if (checkboxset)
                {
                    checkboxset._redrawListBoxContents(false);
                    checkboxset._onRecalcScrollSize();

                    var rowcount = checkboxset._getInnerdatasetInfo("_rowcount");

                    checkboxset._on_last_selectfocuschanged(rowcount - 1); // scroll pos 위치를 조절하고 아이템을 끝까지 생성해주는 역할
                    //checkboxset._on_last_selectfocuschanged(0);
                    // TODO.. index 수정 후 재작업 필요함

                    if (!index || index == "-1")
                    {
                        checkboxset._refreshScroll(0, 1);
                    }
                    else
                    {
                        checkboxset._refreshScroll(this._select_multi.items[this._select_multi.items.length - 1], 1);
                    }
                    if (win)
                    {
                        win._setCaptureLock(this, true, false);
                    }

                    if (this._env._p_enableaccessibility)
                    {
                        this._setAccessibilityStatExpanded(true);

                        if (this._env._a11ytype == 4)
                        {
                            checkboxset.setFocus(false);
                        }
                        else if (this._env._a11ytype == 5)
                        {
                            this._want_arrows = true;
                            checkboxset._setAccessibilityNotifyEvent();
                        }

                        if (nexacro._Browser == "Runtime")
                        {
                            if (multicombotext)
                            {
                                multicombotext._setAccessibilityLabel(this._p_text);
                                multicombotext._setAccessibilityDescription("");
                                multicombotext._setAccessibilityAction("");
                                multicombotext.setFocus(true);
                            }
                        }
                    }

                    if (!this._isFiredOnInput)
                    {
                        if (this._tagmode)
                        {
                            var tagboxedit = this.multicombotagbox.tagboxedit;
                            if (tagboxedit)
                                tagboxedit._apply_setfocus("focus");
                        }
                        else
                        {
                            var multicomboedit = multicombolist.multicomboedit;
                            if (multicomboedit)
                                multicomboedit._apply_setfocus("focus");
                        }
                    }
                }
            }
        }
    };

    _pMultiCombo._applyZoomPopup = function ()
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

    _pMultiCombo._closePopup = function ()
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
            this._want_arrows = false;
            this._setAccessibilityStatExpanded(false);

            var checkboxset = this._p_multicombolist && this._p_multicombolist.checkboxset;
            if (checkboxset)
            {
                checkboxset._overeditemindex = -1;
            }

            if (nexacro._Browser == "Runtime")
            {
                var multicombotext = this._p_multicombotext;
                if (multicombotext)
                {
                    multicombotext.on_apply_accessibility();
                }
            }
        }
    };

    _pMultiCombo._setContents = function (str)
    {
        var ds = this._convertObjectContents(str);
        if(ds)
        {
            this.set_innerdataset(ds); 
            return true;
        }
        return false;
    };

    _pMultiCombo._select_indexOfkey = function (k)
    {
        k += "";
        return nexacro._indexOf(this._select_multi.keys, k);
    };

    _pMultiCombo._select_replace = function (k, selectIdx)
    {
        var idx = this._select_indexOfkey(k);
        var info = this._select_multi;
        info.items[idx] = selectIdx;
        info.map[k] = selectIdx;
    };

    _pMultiCombo._select_add = function (selectIdx)
    {
        if (selectIdx < 0 || selectIdx > this._innerdataset.getRowCount() - 1)
        {
            return;
        }

        selectIdx = +selectIdx;
        var k = selectIdx + "";
        var info = this._select_multi;
        var idx = this._select_indexOfkey(selectIdx);

        if (idx < 0)
        {
            info.map[k] = selectIdx;
            info.length++;
            info.items.push(selectIdx);
            info.keys.push(k);
            info.lastselected = selectIdx;
            info.tagselect = -1;
        }
    };

    _pMultiCombo._select_remove = function (selectIdx)
    {
        var idx = this._select_indexOfkey(selectIdx);
        var info = this._select_multi;
        if (idx < info.length && idx >= 0)
        {
            info.length--;
            info.items.splice(idx, 1);
            var k = info.keys[idx];
            if (typeof k != 'undefined')
            {
                info.map[k] = undefined;
            }
            info.keys.splice(idx, 1);
            info.lastselected = info.items[info.items.length - 1];
            if (info.tagselect == selectIdx)
            {
                info.tagselect = -1;
            }
            return selectIdx;
        }

        return false;
    };

    _pMultiCombo._clear_all = function (change_by_script, isNotFireEvent)
    {
        var checkboxset = this._p_multicombolist && this._p_multicombolist.checkboxset;
        var selecteditems = this._select_multi.items;
        var selectedcount = this._select_multi.length;
        var rows = [];

        for (var i = selectedcount - 1; i >= 0; i--)
        {
            var idx = selecteditems[i];
            if (!this._getItemReadonly(idx))
            {
                if (checkboxset)
                {
                    var item = checkboxset._getItem(idx);
                    if (item)
                    {
                        item.set_selected(false);
                    }
                }
                this._select_remove(idx);
                rows.push(idx);
            }
        }

        this._removeindex(rows, change_by_script, isNotFireEvent);
    };

    _pMultiCombo._select_all = function (change_by_script)
    {
        var checkboxset = this._p_multicombolist && this._p_multicombolist.checkboxset;
        var rowcount = this._innerdataset.rowcount;
        var rows = [];

        for (var i = 0; i < rowcount; i++)
        {
            if (!this._getItemReadonly(i))
            {
                if (checkboxset)
                {
                    var item = checkboxset._getItem(i);
                    if (item)
                    {
                        item.set_selected(true);
                    }
                }
                this._select_add(i);
                rows.push(i);
            }
        }

        this._insertIndex(rows, change_by_script);
    };

    _pMultiCombo._changeIndex = function (v, change_by_script, isNotFireEvent)
    {
        if (!isNotFireEvent)
        {
            var idx, val, txt, preidx, pretext, prevalue, postidx, posttext, postvalue, i;
            var env = this._env;
            var valueseparator = env.multivalueseparator ? env.multivalueseparator : ",";
            var textseparator = this._p_textseparator;

            preidx = this._p_index;
            pretext = this._p_text;
            prevalue = this._p_value;
            postidx = posttext = postvalue = "";

            if (typeof v === "number")
                v = [v];

            for (i = 0; i < v.length; i++)
            {
                idx = v[i].toString();
                txt = this._getItemText(idx);
                val = this._getItemValue(idx);

                if (i == 0)
                {
                    postidx = idx;
                    posttext = txt;
                    postvalue = val;
                }
                else
                {
                    postidx += "," + idx;
                    posttext += textseparator + txt;
                    postvalue += valueseparator + val;
                }
            }

            if (change_by_script != true)
            {
                if (this.on_fire_canitemchange(this, preidx, pretext, prevalue, postidx, posttext, postvalue) != false)
                {
                    this._setIndex(postidx);
                    this._setText(posttext);
                    this._setValue(postvalue);

                    this.applyto_bindSource("value", this._p_value);
                    this.on_fire_onitemchanged(this, preidx, pretext, prevalue, postidx, posttext, postvalue);
                }
            }
            else
            {
                this._setIndex(postidx);
                this._setText(posttext);
                this._setValue(postvalue);

                this.applyto_bindSource("value", this._p_value);
            }
        }
    };

    _pMultiCombo._insertIndex = function (v, change_by_script, isNotFireEvent)
    {
        if (!isNotFireEvent)
        {
            var idx, val, txt, preidx, pretext, prevalue, postidx, posttext, postvalue, i, rows;
            var env = this._env;
            var valueseparator = env.multivalueseparator ? env.multivalueseparator : ",";
            var textseparator = this._p_textseparator;

            preidx = postidx = this._p_index;
            pretext = posttext = this._p_text;
            prevalue = postvalue = this._p_value;

            if (typeof v === "number")
                v = [v];

            if (preidx == "-1")
            {
                rows = v;
            }
            else
            {
                var preidx_arr = preidx.split(",");
                rows = v.filter(function (val, i) { return preidx_arr.indexOf(val + "") == -1 && v.indexOf(val) == i; });
            }

            if (rows.length == 0)
                return false;

            for (i = 0; i < rows.length; i++)
            {
                idx = rows[i].toString();
                txt = this._getItemText(idx);
                val = this._getItemValue(idx);

                if (postidx == "-1")
                {
                    postidx = idx;
                    posttext = txt;
                    postvalue = val;
                }
                else
                {
                    postidx += "," + idx;
                    posttext += textseparator + txt;
                    postvalue += valueseparator + val;
                }
            }

            if (change_by_script != true)
            {
                if (this.on_fire_canitemchange(this, preidx, pretext, prevalue, postidx, posttext, postvalue) != false)
                {
                    this._setIndex(postidx);
                    this._setText(posttext);
                    this._setValue(postvalue);

                    this.applyto_bindSource("value", this._p_value);
                    this.on_fire_onitemchanged(this, preidx, pretext, prevalue, postidx, posttext, postvalue);
                }
            }
            else
            {
                this._setIndex(postidx);
                this._setText(posttext);
                this._setValue(postvalue);

                this.applyto_bindSource("value", this._p_value);
            }
        }
    };

    _pMultiCombo._removeindex = function (v, change_by_script, isNotFireEvent)
    {
        if (!isNotFireEvent)
        {
            var idx, val, txt, preidx, pretext, prevalue, postidx, posttext, postvalue, i, rows;
            var env = this._env;
            var valueseparator = env.multivalueseparator ? env.multivalueseparator : ",";
            var textseparator = this._p_textseparator;

            preidx = this._p_index;
            pretext = this._p_text;
            prevalue = this._p_value;
            postidx = this._p_index == "-1" ? this._p_index : this._p_index.split(",");
            posttext = this._p_text == "" ? this._p_text : this._p_text.split(textseparator);
            postvalue = this._p_value == undefined ? this._p_value : this._p_value.split(valueseparator);

            if (typeof v === "number")
                v = [v];

            if (preidx == "-1")
                return false;
            else
                rows = v.filter(function (val, i) { return preidx.indexOf(val) != -1 && v.indexOf(val) == i; });

            if (rows.length == 0)
                return false;

            for (i = 0; i < rows.length; i++)
            {
                idx = rows[i].toString();
                txt = this._getItemText(idx);
                val = this._getItemValue(idx);

                postidx.splice(postidx.indexOf(idx), 1);
                if (posttext)
                    posttext.splice(posttext.indexOf(txt), 1);
                if (postvalue)
                    postvalue.splice(postvalue.indexOf(val), 1);
            }

            if (postidx.length == 0)
            {
                postidx = "-1";
                posttext = "";
                postvalue = undefined;
            }
            else
            {
                postidx = postidx.join(",");
                posttext = posttext.join(textseparator);
                postvalue = postvalue.join(valueseparator);
            }

            if (change_by_script != true)
            {
                if (this.on_fire_canitemchange(this, preidx, pretext, prevalue, postidx, posttext, postvalue) != false)
                {
                    this._setIndex(postidx);
                    this._setText(posttext);
                    this._setValue(postvalue);

                    this.applyto_bindSource("value", this._p_value);
                    this.on_fire_onitemchanged(this, preidx, pretext, prevalue, postidx, posttext, postvalue);
                }
            }
            else
            {
                this._setIndex(postidx);
                this._setText(posttext);
                this._setValue(postvalue);

                this.applyto_bindSource("value", this._p_value);
            }
        }
    };

    //===============================================================
    // nexacro.MultiCombo : Util Function
    //===============================================================
    _pMultiCombo._convertValueType = function (v, bapplyrule)
    {
        var ret;
        if (bapplyrule)
            ret = nexacro.Component.prototype._convertValueType.call(this, v);
        else
            ret = nexacro._isNull(v) ? v : nexacro._toString(v);

        return ret;
    };

    _pMultiCombo._setValue = function (v)
    {
        if (v == undefined || v.length == 0)
            this._p_value = undefined;
        else
            this._p_value = v;
    };

    _pMultiCombo._setEditValue = function (v, b)
    {
        if (this._tagmode)
        {
            var tagboxedit = this._p_multicombotagbox.tagboxedit;
            if (tagboxedit)
            {
                var value = tagboxedit._p_value;
                if (value != v)
                {
                    tagboxedit._setValue(v);
                    if (this._env._p_enableaccessibility)
                    {
                        tagboxedit._updateAccessibilityLabel();
                        if (v)
                        {
                            if (nexacro._Browser == "Runtime" && tagboxedit._status == "focused")
                            {
                                tagboxedit._setAccessibilityLabel(v);
                                tagboxedit._notifyAccessibility(v, "notify");
                            }
                        }
                    }
                }
            }
        }
        else
        {
            var multicombolist = this._p_multicombolist;
            if (multicombolist)
            {
                var multicomboedit = multicombolist.multicomboedit;
                if (multicomboedit)
                {
                    var value = multicomboedit._p_value;
                    if (value != v)
                    {
                        multicomboedit._setValue(v);
                    }
                }
            }
        }
    };

    _pMultiCombo._setTextValue = function (v)
    {
        var multicombotext = this._p_multicombotext;
        if (multicombotext)
        {
            var value = multicombotext._p_value;
            if (value != v)
            {
                multicombotext._setValue(v);
            }
        }
    };

    _pMultiCombo._setIndex = function (v)
    {
        if (v == "-1" || v.length == 0)
            this._p_index = "-1";
        else
            this._p_index = v;
    };

    _pMultiCombo._setText = function (v)
    {
        if (!v || v.length == 0)
            this._p_text = "";
        else
            this._p_text = v;
    };

    _pMultiCombo._setDefaultProps = function (index, value, text)
    {
        this._default_value = value;
        this._default_text = text;
        this._default_index = index;
    };

    _pMultiCombo._setEventHandlerToMultiComboText = function ()
    {
        var multicombotext = this._p_multicombotext;
        if (multicombotext)
        {
            var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);
            if (bMobile)
            {
                multicombotext._setEventHandler("oneditclick", this._on_multicombotext_mobile_oneditclick, this);
                this._setEventHandler("onkeydown", this._on_multicombotext_onkeydown, this);
                this._setEventHandler("onkeyup", this._on_multicombotext_onkeyup, this);
            }
            else
            {
                multicombotext._setEventHandler("onlbuttondown", this._on_multicombotext_onlbuttondown, this);
                multicombotext._setEventHandler("oneditclick", this._on_multicombotext_oneditclick, this);
                multicombotext._setEventHandler("onkeydown", this._on_multicombotext_onkeydown, this);
                multicombotext._setEventHandler("onkeyup", this._on_multicombotext_onkeyup, this);
            }
        }
    };

    _pMultiCombo._setEventHandlerToDropButton = function ()
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

    _pMultiCombo._setEventHandlerToMultiComboTagBox = function ()
    {
        var multicombotagbox = this._p_multicombotagbox;
        if (multicombotagbox)
        {
            if (nexacro._isTouchInteraction && nexacro._SupportTouch)
            {
                multicombotagbox._setEventHandler("onclick", this._on_tagbox_mobile_onclick, this);
            }
            else
            {
                multicombotagbox._setEventHandler("onlbuttondown", this._on_tagbox_onlbuttondown, this);
                multicombotagbox._setEventHandler("onkeydown", this._on_tagbox_onkeydown, this);
            }

            var tagboxedit = multicombotagbox.tagboxedit;
            if (tagboxedit)
            {
                var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);
                if (bMobile)
                {
                    tagboxedit._setEventHandler("oneditclick", this._on_edit_mobile_oneditclick, this);
                    this._setEventHandler("onkeydown", this._on_edit_onkeydown, this);
                    this._setEventHandler("onkeyup", this._on_edit_onkeyup, this);
                }
                else
                {
                    tagboxedit._setEventHandler("onlbuttondown", this._on_edit_onlbuttondown, this);
                    tagboxedit._setEventHandler("oneditclick", this._on_edit_oneditclick, this);
                    tagboxedit._setEventHandler("onkeydown", this._on_edit_onkeydown, this);
                    tagboxedit._setEventHandler("onkeyup", this._on_edit_onkeyup, this);
                }
                tagboxedit._setEventHandler("oninput", this._on_edit_oninput, this);
            }
        }
    };

    _pMultiCombo._setEventHandlerToListBox = function ()
    {
        var checkboxset = this._p_multicombolist && this._p_multicombolist.checkboxset;
        if (checkboxset)
        {
            checkboxset._setEventHandler("onitemclick", this._on_list_onitemclick, this);
            checkboxset._setEventHandler("canitemchange", this.on_notify_list_canitemchange, this);
            checkboxset._setEventHandler("onitemchanged", this.on_notify_list_onitemchanged, this);
        }
    };

    _pMultiCombo._setInnerDatasetStr = function (str)
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

    _pMultiCombo._setDefaultCaret = function ()
    {
        if (this._tagmode)
        {
            var tagboxedit = this._p_multicombotagbox.tagboxedit;
            if (tagboxedit)
            {
                tagboxedit.setCaretPos();
            }
        }
    };

    _pMultiCombo._setFocusToNextComponent = function ()
    {
        // getRootComponent 수정 필요함
        var root_comp = this._getRootComponent(this);
        var next_comp = this._getForm().getNextComponent(root_comp, true);
        if (next_comp)
        {
            next_comp.setFocus();
            if (next_comp._is_editable_control)
                next_comp._setDefaultCaret();
        }
    };

    _pMultiCombo._getColumn = function (ds, index, column)
    {
        return ds.getColumn(index, column);
    };

    _pMultiCombo._getRowCount = function (ds)
    {
        return ds.getRowCount();
    };

    _pMultiCombo._getItemValue = function (index)
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

    _pMultiCombo._getItemText = function (index)
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

    _pMultiCombo._getItemReadonly = function (index)
    {
        var ds = this._innerdataset;
        var column = this._p_readonlycolumn;

        if (ds)
        {
            if (column)
            {
                var rtn = this._getColumn(ds, index, column);
                if (rtn == undefined && (this._p_type == "filter" || this._p_type == "filterlike" || this._p_type == "caseifilter" || this._p_type == "caseifilterlike") && this._filtereddataset)
                {
                    rtn = this._filtereddataset.getColumn(index, column);
                }

                return nexacro._toBoolean(rtn);
            }
            else
            {
                if (index < 0 || index >= this._getRowCount(ds))
                    return true;
            }
        }

        return null;
    };

    _pMultiCombo._getIndexFromValue = function (ds, value)
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

    _pMultiCombo._getIndexFromText = function (ds, text)
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

    _pMultiCombo._getRawToListindex = function (idx)
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

    _pMultiCombo._getRawIndex = function (fds, idx)
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

    _pMultiCombo._getPopupType = function ()
    {
        return this._p_popuptype ? this._p_popuptype : "normal";
    };

    _pMultiCombo._isUsableDataset = function (ds)
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

    _pMultiCombo._isPopupVisible = function ()
    {
        var popupcontrol = this._popupcontrol;
        if (popupcontrol)
        {
            return popupcontrol._is_popup();
        }

        return false;
    };

    _pMultiCombo._clearFilteredDataset = function ()
    {
        if (this._filtereddataset)
        {
            this._filtereddataset.set_filterstr("");
        }
    };

    _pMultiCombo._setAccessibilityInfoByHover = function (control)
    {
        if (this._isPopupVisible())
        {
            var checkboxset = this._p_multicombolist && this._p_multicombolist.checkboxset;
            return checkboxset._setAccessibilityInfoByHover(control);
        }
        else
        {
            return this._setAccessibilityNotifyEvent();
        }
    };

    _pMultiCombo._clearAccessibilityInfoByHover = function ()
    {
        var checkboxset = this._p_multicombolist && this._p_multicombolist.checkboxset;
        if (checkboxset)
        {
            checkboxset._clearAccessibilityInfoByHover();
        }
    };

    _pMultiCombo._getPopupSizeArr = function ()
    {
        var size = this._p_popupsize;
        if (!size)
            return;
        size = size.split(/\s+/);
        var width = +size[0];
        var height = size[1] ? +size[1] : undefined;
        return { width: width, height: height };
    };

    _pMultiCombo._cancelEvent = function ()
    {
        this._processing_keyfilter = false;
    };

    _pMultiCombo._setMultiComboTextValue = function ()
    {
        if (this._p_multicombotagbox)
        {
            this._p_multicombotagbox.destroy();
            this._p_multicombotagbox = null;
        }

        var multicombotext = this._p_multicombotext;
        if (multicombotext)
        {
            var selectedItems = this._select_multi;

            if (selectedItems.length > 0)
            {
                var str = "";

                for (var i = 0; i < selectedItems.length; i++)
                {
                    if (this._p_type == "dropdown")
                    {
                        if (i == selectedItems.length - 1)
                            str += this._getItemText(selectedItems.items[i]);
                        else
                            str += this._getItemText(selectedItems.items[i]) + this._p_textseparator;
                    }
                    else
                    {
                        if (i == selectedItems.length)
                            str += this._getItemText(selectedItems.items[i]);
                        else
                            str += this._getItemText(selectedItems.items[i]) + this._p_textseparator;
                    }
                }

                this._setTextValue(str);
            }
            else
            {
                this._setTextValue(undefined);
            }
        }
    };

    _pMultiCombo._setMultiComboCountValue = function ()
    {
        if (this._p_multicombotagbox)
        {
            this._p_multicombotagbox.destroy();
            this._p_multicombotagbox = null;
        }

        var multicombotext = this._p_multicombotext;
        if (multicombotext)
        {
            var totalCount = this._innerdataset ? this._innerdataset.rowcount : 0;
            var selectedCount = this.getSelectedCount();

            if (this._p_counttextformat)
            {
                var format = this._p_counttextformat;
                format = format.replace(/\[\*\]/g, totalCount);
                format = format.replace(/\[\#\]/g, selectedCount);
                multicombotext.set_value(format);
            }
            else
            {
                multicombotext.set_value(selectedCount + " item(s) selected");
            }
        }
    };

    _pMultiCombo._setMultiComboTagBoxValue = function ()
    {
        var multicombotagbox = this._p_multicombotagbox;
        if (multicombotagbox)
        {
            multicombotagbox._setMultiComboTagValue();
        }
    };

    _pMultiCombo = null;
    //delete _pMultiCombo;

    //==============================================================================
    // nexacro._MultiComboEditControl
    //==============================================================================
    nexacro._MultiComboEditControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay)
    {
        nexacro.Edit.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay);
    };

    var _pMultiComboEditControl = nexacro._createPrototype(nexacro.Edit, nexacro._MultiComboEditControl);
    nexacro._MultiComboEditControl.prototype = _pMultiComboEditControl;
    _pMultiComboEditControl._type_name = "EditControl";

    /* default properties */
    /* internal variable */
    _pMultiComboEditControl._is_subcontrol = true;
    _pMultiComboEditControl._is_subfocused = false;

    /* status */
    /* event list */
    /* accessibility */
    _pMultiComboEditControl._p_accessibilityrole = "multicombobox";

    //===============================================================
    // nexacro._MultiComboEditControl : Create & Update
    //===============================================================

    //===============================================================
    // nexacro._MultiComboEditControl : Override
    //===============================================================

    _pMultiComboEditControl._getFromComponent = function (comp)
    {
        var parent = comp.parent;
        if (parent && parent._isPopupVisible())
        {
            return parent;
        }
        else
        {
            return nexacro.Component.prototype._getFromComponent.call(this, comp);
        }
    };

    _pMultiComboEditControl._apply_setfocus = function (evt_name, self_flag)
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

                //if(this._p_parent._p_type != "dropdown")
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

            // type 확인용, type에 따라 부모가 바뀜, 수정필요함
            if (!this._p_parent._p_edittype)
            {
                this._p_parent._setScrollMaxPos();
                if (this._p_parent._p_parent._select_multi.tagselect != -1)
                {
                    this._p_parent._p_parent._p_multicombotagbox._multicombotags[this._p_parent._p_parent._select_multi.tagselect]._changeUserStatus("selected", false);
                    this._p_parent._p_parent._select_multi.tagselect = -1;
                }
            }
        }
    };

    _pMultiComboEditControl.on_keydown_basic_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
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

                if (this._undostack && this._p_parent._p_type != "dropdown")
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
        _pMultiComboEditControl.on_keyup_basic_action = function (/*keycode, alt_key, ctrl_key, shift_key, refer_comp*/)
        {
            this._processing_keyfilter = false;
        };
    }
    else
    {
        _pMultiComboEditControl.on_keyup_basic_action = function (/*keycode, alt_key, ctrl_key, shift_key, refer_comp*/)
        {
            this._processing_keyfilter = true;
        };
    }

    //===============================================================
    // nexacro._MultiComboEditControl : Properties
    //===============================================================
    _pMultiComboEditControl.set_value = function (v)
    {
        nexacro.Edit.prototype.set_value.call(this, v);

        this._setAccessibilityValue(this._p_text, false);
    };

    //===============================================================
    // nexacro._MultiComboEditControl : Events
    //===============================================================
    _pMultiComboEditControl.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this._p_parent, from_refer_comp, meta_key);
    };

    _pMultiComboEditControl = null;

    //==============================================================================
    // nexacro._MultiComboButtonControl
    //==============================================================================
    nexacro._MultiComboButtonControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pMultiComboButtonControl = nexacro._createPrototype(nexacro.Button, nexacro._MultiComboButtonControl);
    nexacro._MultiComboButtonControl.prototype = _pMultiComboButtonControl;
    _pMultiComboButtonControl._type_name = "ButtonControl";

    /* internal variable */
    _pMultiComboButtonControl._is_subcontrol = true;
    _pMultiComboButtonControl._is_focus_accept = false;

    //===============================================================
    // nexacro._MultiComboButtonControl : Override
    //===============================================================

    //===============================================================
    // nexacro._MultiComboButtonControl : Events
    //===============================================================
    _pMultiComboButtonControl.on_focus_basic_action = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        // not used
        var multicombo = this._p_parent;
        if (multicombo)
        {
            var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);
            if (bMobile)
            {
                nexacro.Component.prototype.on_focus_basic_action.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);
            }
            else
            {
                multicombo._apply_setfocus(evt_name);
            }
        }

        if (this._env._p_enableaccessibility)
        {
            this._setAccessibilityStatFocus(evt_name);
        }
    };

    _pMultiComboButtonControl._on_click = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key)
    {
        if (!this._is_alive) return;

        if (this._p_visible && this._p_parent._isEnable() && this._p_enableevent)
        {
            var clientXY = this._getClientXY(canvasX, canvasY);
            this.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientXY[0], clientXY[1], this, this, meta_key);
            this.on_click_basic_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key);
        }
    };

    _pMultiComboButtonControl = null;

    //==============================================================================
    // nexacro._MultiComboCheckBoxSetControl
    //==============================================================================
    nexacro._MultiComboCheckBoxSetControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.CheckBoxSet.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._overedItem = null;
        this._select_multi = this._p_parent._p_parent._select_multi;
    };

    var _pMultiComboCheckBoxSetControl = nexacro._createPrototype(nexacro.CheckBoxSet, nexacro._MultiComboCheckBoxSetControl);
    nexacro._MultiComboCheckBoxSetControl.prototype = _pMultiComboCheckBoxSetControl;
    _pMultiComboCheckBoxSetControl._type_name = "CheckBoxSetControl";
    _pMultiComboCheckBoxSetControl._is_subcontrol = true;

    /* default properties */

    /* internal variable */
    _pMultiComboCheckBoxSetControl._overeditemindex = -1;

    /* status */
    _pMultiComboCheckBoxSetControl._is_scrollable = true;

    /* event list */
    _pMultiComboCheckBoxSetControl._event_list = {
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
    // nexacro._MultiComboCheckBoxSetControl : Create & Update
    //===============================================================
    _pMultiComboCheckBoxSetControl.on_create_contents = function ()
    {
        this._temp_item = new nexacro._CheckBoxSetItemControl("_temp_item", 0, 0, 0, 0, null, null, null, null, null, null, this);
        this._temp_item.createComponent();
    };

    _pMultiComboCheckBoxSetControl.on_created_contents = function (win)
    {
        if (this._p_innerdataset)
        {
            if (!this._innerdataset)
            {
                this._setInnerDatasetStr(this._p_innerdataset);
            }

            this.on_apply_innerdataset(this._innerdataset);
        }

        this._redrawListBoxContents(true);

        var items = this._getContentsItem();
        var item_len = items.length;
        for (var i = 0; i < item_len; i++)
        {
            items[i].on_created(win);
        }

        this._selectinfo.obj = null;
        this._selectinfo.index = this._p_index;
        this._selectinfo.text = this._p_text;
        this._selectinfo.value = this._p_value;

        //this._setEventHandler("onkeydown", this._on_onkeydown, this);

        if (this._env._p_enableaccessibility)
        {
            this._want_arrow = true;
            this.on_apply_prop_accessibilitylabel();
        }

        this._is_created = true;
        this._onRecalcScrollSize();
    };

    _pMultiComboCheckBoxSetControl.on_destroy_contents = function ()
    {
        var item = this._temp_item;
        if (item)
        {
            item.destroy();
        }
        this._temp_item = null;

        this._destroyListBoxContents();
        this._buffer_pages = null;

        this._removeEventHandlerToInnerDataset();
        //this._removeEventHandler("onkeydown", this._on_onkeydown, this);

        this._selectinfo = null;
        this._select_multi = null;
        this._selectinfo_list.length = 0;
        this._scroll_vpos_queue = null;
    };

    _pMultiComboCheckBoxSetControl.on_create_contents_command = function ()
    {
        if (this._p_innerdataset)
        {
            if (!this._innerdataset)
            {
                this._setInnerDatasetStr(this._p_innerdataset);
            }

            this._parseInnerDataset();
        }

        this._redrawListBoxContents(true);

        var str = "";
        var items = this._getContentsItem();
        var item_len = items.length;
        for (var i = 0; i < item_len; i++)
        {
            str += items[i].createCommand();
        }

        return str;
    };

    _pMultiComboCheckBoxSetControl.on_attach_contents_handle = function (win)
    {
        var items = this._getContentsItem();
        var item_len = items.length;
        for (var i = 0; i < item_len; i++)
        {
            items[i].attachHandle(win);
        }

        this._selectinfo.obj = null;
        this._selectinfo.index = this._p_index;
        this._selectinfo.text = this._p_text;
        this._selectinfo.value = this._p_value;

        //this._setEventHandler("onkeydown", this._on_onkeydown, this);

        if (this._env._p_enableaccessibility)
            this.on_apply_prop_accessibilitylabel();

        this._is_created = true;
        this._onRecalcScrollSize();
    };

    _pMultiComboCheckBoxSetControl.on_change_containerRect = function (/*width, height*/)
    {
        if (this._is_created_contents)
        {
            var itemheight = this._getItemHeight();
            var client_h = this._getClientHeight();
            var page_rowcount = itemheight ? client_h / itemheight : 0;

            if (this._page_rowcount != page_rowcount)
            {
                this._redrawListBoxContents(false);
            }
            else
            {
                this._recalcLayout();
            }

            if (!this._calc_scroll)
            {
                this._onRecalcScrollSize();
            }
            else
            {
                this._cnt_resetscroll++;
                this._onResetScrollBar();
            }
        }
    };

    //===============================================================
    // nexacro._MultiComboCheckBoxSetControl : Override
    //===============================================================
    _pMultiComboCheckBoxSetControl._on_getFitSize = function ()
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

            var rowcount = this._getInnerdatasetInfo("_rowcount");
            var data_maxwidth = this._getInnerdatasetInfo("_max_width");
            var data_maxheight = this._getInnerdatasetInfo("_max_height");

            total_w += data_maxwidth;
            total_h += data_maxheight * rowcount;

            return [total_w, total_h];
        }

        return [this._adjust_width, this._adjust_height];
    };

    _pMultiComboCheckBoxSetControl._onRecalcScrollSize = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var client_w = this._getClientWidth();
            var client_h = this._getClientHeight();

            var scrollWidth = Math.max(this._contents_maxwidth, client_w);
            var scrollHeight = Math.max(this._contents_maxheight, client_h);

            this._calc_scroll = true;

            control_elem.setElementScrollMaxSize(scrollWidth, scrollHeight);

            if (!this._cnt_resetscroll)
                this._onResetScrollBar();

            this._calc_scroll = false;
            this._cnt_resetscroll = 0;
        }
    };

    //===============================================================
    // nexacro._MultiComboCheckBoxSetControl : Properties
    //===============================================================
    _pMultiComboCheckBoxSetControl.on_apply_index = function (index)
    {
        var text = "";
        var value;// = undefined;

        var data = this._getInnerdatasetInfo("_rows", index);
        if (data)
        {
            value = data.value;
            text = data.text;
        }

        if (this._p_value != value)
        {
            this._setValue(value);
            this._setText(text);
        }
    };

    _pMultiComboCheckBoxSetControl.on_apply_value = function (value)
    {
        var ds = this._innerdataset;
        var codecolumn = this._p_codecolumn;
        var datacolumn = this._p_datacolumn == "" ? codecolumn : this._p_datacolumn;
        if (ds && codecolumn)
        {
            var index = ds.findRow(codecolumn, value);
            var text = "";
            if (index > -1)
                text = ds.getColumn(index, datacolumn);

            this._setIndex(index);
            this._setText(text);
        }
    };

    _pMultiComboCheckBoxSetControl.on_apply_codecolumn = function (codecolumn)
    {
        if (this._is_created)
        {
            this._parseInnerDataset();
            this._redrawListBoxContents(!this._keep_scrolling);
            this._onRecalcScrollSize();
        }
    };

    _pMultiComboCheckBoxSetControl.on_apply_datacolumn = function (datacolumn)
    {
        if (this._is_created)
        {
            this._parseInnerDataset();
            this._redrawListBoxContents(!this._keep_scrolling);
            this._onRecalcScrollSize();
        }
    };

    //===============================================================
    // nexacro._MultiComboCheckBoxSetControl : Methods
    //===============================================================

    //===============================================================
    // nexacro._MultiComboCheckBoxSetControl : Events
    //===============================================================
    _pMultiComboCheckBoxSetControl.on_notify_item_onlbuttondown = function (obj, e)
    {
        // todd 이벤트 안겹치게 안에 내용 제거
    };

    _pMultiComboCheckBoxSetControl.on_notify_item_onlbuttonup = function (obj, e)
    {
        var up_item = this._upitem;

        if (up_item)
        {
            if (nexacro._isTouchInteraction && nexacro._SupportTouch)
            {
                var win = this._getWindow();
                var touch_manager = win ? win._gesture_manager : null;
                if (touch_manager && touch_manager._is_ondrag)
                    return;
            }

            if ((up_item.index >= 0) && this._contains(up_item))
            {
                obj = up_item;
            }
            else
            {
                return;
            }
            this._shiftKey = e.shiftkey;
            if (!this._shiftKey)
            {
                this._shift_select_base_index = obj.index;
            }
            //this._select_withmouseevent(this._innerdataset._viewRecords[obj.index]._rawidx, obj);
            this.on_fire_onitemclick(obj, obj.index, obj.text, obj.value, e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.metakey);
        }
    };

    _pMultiComboCheckBoxSetControl.on_notify_item_ontouchstart = function (obj, e)
    {
        //this._do_select(obj.index, false);
    };

    _pMultiComboCheckBoxSetControl.on_notify_item_ontouchend = function (obj, e)
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

    _pMultiComboCheckBoxSetControl.on_notify_listbox_onkeydown = function (obj, e)
    {

    };

    _pMultiComboCheckBoxSetControl.on_notify_item_onmouseenter = function (obj, e)
    {

    };

    _pMultiComboCheckBoxSetControl.on_notify_item_onmouseleave = function (obj, e)
    {

    };

    _pMultiComboCheckBoxSetControl.on_notify_item_onmousemove = function (obj, e)
    {
        if (this._overeditemindex > -1)
        {
            var rowobj = this._getItem(this._overeditemindex);
            if (rowobj)
            {
                rowobj._changeStatus("mouseover", false);
            }
            this._overeditemindex = -1;
        }
    };

    _pMultiComboCheckBoxSetControl.on_focus_basic_action = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        var multicombo = this._p_parent;
        if (multicombo)
        {
            if (this._env._p_enableaccessibility)
            {
                multicombo._setAccessibilityStatFocus(evt_name);
            }

            multicombo._apply_setfocus(evt_name);
        }
    };

    _pMultiComboCheckBoxSetControl.on_fire_user_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)
    {
        return nexacro.Component.prototype.on_fire_user_onkeydown.call(this, keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
    };

    _pMultiComboCheckBoxSetControl.on_fire_user_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        return nexacro.Component.prototype.on_fire_user_onlbuttonup.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
    };

    _pMultiComboCheckBoxSetControl.on_fire_sys_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        nexacro.Component.prototype.on_fire_sys_onlbuttonup.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key);
    };

    _pMultiComboCheckBoxSetControl.on_fire_sys_ontouchstart = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {
        nexacro.Component.prototype.on_fire_sys_ontouchstart.call(this, touchinfos, changedtouchinfos, from_comp, from_refer_comp);
    };

    _pMultiComboCheckBoxSetControl.on_fire_sys_ontouchend = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {
        nexacro.Component.prototype.on_fire_sys_ontouchend.call(this, touchinfos, changedtouchinfos, from_comp, from_refer_comp);
    };

    _pMultiComboCheckBoxSetControl.on_fire_sys_ontouchcancel = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {

    };

    _pMultiComboCheckBoxSetControl.on_fire_oncloseup = function (obj)
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
    // nexacro._MultiComboCheckBoxSetControl : Logical part
    //===============================================================
    _pMultiComboCheckBoxSetControl._set_last_selectfocused = function (idx, isNotFireEvent)
    {
        var rowBeforeLast = this._select_multi.lastselected;
        this._select_multi.lastselected = idx;

        if (idx !== rowBeforeLast)
        {
            this._on_last_selectfocuschanged(idx, isNotFireEvent);
        }
    };

    _pMultiComboCheckBoxSetControl._select_add = function (selectIdx, isNotFireEvent)
    {
        var popupcontainer = this._p_parent;
        var multicombo = popupcontainer.parent;


        var k = selectIdx + "";
        var info = this._select_multi;
        var old = info.map[k];

        if (typeof old != 'undefined')
        {
            return this._select_replace(k, selectIdx);
        }
        info.map[k] = selectIdx;
        info.length++;
        info.items.push(selectIdx);
        info.keys.push(k);
        info.lastselected = selectIdx;

        info.tagselect = -1;
        this._changeIndex(selectIdx, undefined, isNotFireEvent);
        //this._changeIndex(selectIdx);

        if (popupcontainer._is_control_component)
        {
            multicombo._p_index = popupcontainer._p_index;
            multicombo._p_text = popupcontainer._p_text;
            multicombo._p_value = popupcontainer._p_value;
        }
        if (popupcontainer._is_abstract)
        {
            multicombo = popupcontainer._p_index;
            multicombo = popupcontainer._p_text;
            multicombo = popupcontainer._p_value;
        }
    };

    _pMultiComboCheckBoxSetControl._select_remove = function (selectIdx)
    {
        var popupcontainer = this._p_parent;
        var multicombo = popupcontainer.parent;
        var idx = this._select_indexOfkey(selectIdx);
        var info = this._select_multi;

        if (idx < info.length && idx >= 0)
        {
            info.length--;
            info.items.splice(idx, 1);
            var k = info.keys[idx];
            if (typeof k != 'undefined')
            {
                info.map[k] = undefined;
            }
            info.keys.splice(idx, 1);
            info.lastselected = info.items[info.items.length - 1];

            if (!this.multiselect && info.length == 0)
            {
                this._p_index = "-1";
                this._p_text = "";

                if (!this._do_not_change_value)
                    this._p_value = undefined;
            }

            if (info.tagselect == selectIdx)
            {
                info.tagselect = -1;
            }
            return selectIdx;
        }

        return false;
    };

    _pMultiComboCheckBoxSetControl._select_withmouseevent = function (idx, obj)
    {
        var obj_idx, item, i;
        var popupcontainer = this._p_parent;
        var multicombo = popupcontainer.parent;
        var rows = [];

        var filtered_ds = multicombo._filtereddataset._viewRecords;

        if (this._shiftKey)
        {
            // type filter일 때  shift + click 영역 선택
            if (this._innerdataset._rawRecords != this._innerdataset._viewRecords)
            {
                for (i = 0; i < filtered_ds.length; i++)
                {
                    if (idx == filtered_ds[i]._rawidx)
                    {
                        obj_idx = i;
                        break;
                    }
                }
                item = this._getItem(obj_idx);

                var startIdx = this._shift_select_base_index < filtered_ds.length ? this._shift_select_base_index : 0;
                var endIdx = obj_idx;

                if (!nexacro._isNumber(startIdx))
                {
                    startIdx = 0;
                }
                if (!nexacro._isNumber(endIdx))
                {
                    endIdx = this._getInnerdatasetInfo("_rowcount");
                }

                if (startIdx > endIdx)
                {
                    for (i = startIdx; endIdx <= i; i--)
                    {
                        var _item = this._getItem(i);
                        if (_item.readonly == false)
                        {
                            if (!item.selected)
                            {
                                _item.set_selected(true);
                            }
                            else
                            {
                                _item.set_selected(false);
                            }
                            rows.push(filtered_ds[i]._rawidx);
                        }
                    }
                }
                else
                {
                    for (i = startIdx; i <= endIdx; i++)
                    {
                        var _item = this._getItem(i);
                        if (_item.readonly == false)
                        {
                            if (!item.selected)
                            {
                                _item.set_selected(true);
                            }
                            else
                            {
                                _item.set_selected(false);
                            }
                            rows.push(filtered_ds[i]._rawidx);
                        }
                    }
                }

                if (item.selected)
                {
                    this._do_select(rows, true, true);
                    multicombo._insertIndex(rows);
                }
                else
                {
                    this._do_deselect(rows, true);
                    multicombo._removeindex(rows);
                }

                this._shift_select_base_index = endIdx;
            }
            else
            {
                var items = this._getContentsItem();
                var startIdx = this._shift_select_base_index ? this._shift_select_base_index : 0;
                var endIdx = idx;

                item = this._getItem(idx);

                if (startIdx > endIdx)
                {
                    for (i = startIdx; endIdx <= i; i--)
                    {
                        if (items[i].readonly == false)
                            rows.push(i);
                    }
                }
                else
                {
                    for (i = startIdx; i <= endIdx; i++)
                    {
                        if (items[i].readonly == false)
                            rows.push(i);
                    }
                }

                if (!item.selected)
                {
                    this._do_select(rows, true, true);
                    multicombo._insertIndex(rows);
                }
                else
                {
                    this._do_deselect(rows, true);
                    multicombo._removeindex(rows);
                }

                this._shift_select_base_index = endIdx;
            }
        }
        else
        {
            //type search or caseisearch일때
            if (multicombo._p_type == "search" || multicombo._p_type == "caseisearch")
            {
            }

            // type filter일때
            if (this._innerdataset._rawRecords != this._innerdataset._viewRecords && (multicombo._p_type == "filter" || multicombo._p_type == "filterlike" || multicombo._p_type == "caseifilter" || multicombo._p_type == "caseifilterlike"))
            {
                for (i = 0; i < filtered_ds.length; i++)
                {
                    if (idx == filtered_ds[i]._rawidx)
                    {
                        obj_idx = i;
                    }
                }
                item = this._getItem(obj_idx);
            }
            else
            {
                item = this._getItem(idx);
            }

            if (!item) return;

            if (!item.selected)
            {
                item.set_selected(true);

                this._is_clicked = true;
                this._select_add(idx);
                this._is_clicked = false;
                multicombo._insertIndex(idx);
            }
            else
            {
                item.set_selected(false);

                this._is_clicked = true;
                this._select_remove(idx);
                this._is_clicked = false;
                multicombo._removeindex(idx);
            }

            for (i = 0; i < this._innerdataset.rowcount; i++)
            {
                var all_item = this._getItem(i);
                if (all_item)
                {
                    all_item._changeStatus("mouseover", false);
                }
            }
        }
        this._set_last_selectfocused(idx);
    };

    _pMultiComboCheckBoxSetControl._select_withkeyupevent = function (shiftkey, curidx, nextidx)
    {
        var popupcontainer = this._p_parent;
        var multicombo = popupcontainer.parent;

        this._is_clicked = true;

        if (shiftkey)
        {
            var rows = [];

            if (this._is_shift_first_pressed && curidx > -1)
            {
                this._shift_select_base_index = curidx;
                this._is_shift_first_pressed = false;
            }

            if (multicombo._p_type == "dropdown" || multicombo._p_type == "search" || multicombo._p_type == "caseisearch")
            {
                if (curidx > this._shift_select_base_index)
                {
                    this._do_deselect(curidx, true);
                    multicombo._removeindex(curidx);
                }
                else if (curidx < this._shift_select_base_index)
                {
                    this._do_select(nextidx, true, true);
                    multicombo._insertIndex(nextidx);
                }
                else
                {
                    rows = curidx == nextidx ? [curidx] : [curidx, nextidx];
                    if (multicombo._p_index.toString() != rows.toString())
                    {
                        multicombo._clear_all(true, true);

                        this._do_select(rows, true, true);
                        multicombo._changeIndex(rows);
                    }
                }
                multicombo.redraw();
            }
            else
            {
                var cur_item = this._getItem(curidx);
                var next_item = this._getItem(nextidx);
                var filtered_curidx = multicombo._filtereddataset._viewRecords[curidx]._rawidx;
                var filtered_nextidx = multicombo._filtereddataset._viewRecords[nextidx]._rawidx;

                if (curidx > this._shift_select_base_index)
                {
                    cur_item.set_selected(false);
                    this._select_remove(filtered_curidx);
                    multicombo._removeindex(filtered_curidx);
                }
                else if (curidx < this._shift_select_base_index)
                {
                    next_item.set_selected(true);
                    this._select_add(filtered_nextidx);
                    multicombo._insertIndex(filtered_nextidx);
                }
                else
                {
                    rows = filtered_curidx == filtered_nextidx ? [filtered_curidx] : [filtered_curidx, filtered_nextidx];
                    if (multicombo._p_index.toString() != rows.toString())
                    {
                        multicombo._clear_all(true, true);

                        cur_item.set_selected(true);
                        next_item.set_selected(true);
                        this._select_add(filtered_curidx);
                        this._select_add(filtered_nextidx);
                        multicombo._changeIndex(rows);
                    }
                }
                multicombo.redraw();
            }
        }

        this._change_status_item_from_key(curidx, nextidx);

        this._is_clicked = false;
    };

    _pMultiComboCheckBoxSetControl._select_withkeydownevent = function (shiftkey, curidx, nextidx)
    {
        var popupcontainer = this._p_parent;
        var multicombo = popupcontainer.parent;

        this._is_clicked = true;

        if (shiftkey)
        {
            var rows = [];

            if (this._is_shift_first_pressed && curidx > -1)
            {
                this._shift_select_base_index = curidx;
                this._is_shift_first_pressed = false;
            }

            if (multicombo._p_type == "dropdown" || multicombo._p_type == "search" || multicombo._p_type == "caseisearch")
            {
                if (curidx < this._shift_select_base_index)
                {
                    this._do_deselect(curidx, true);
                    multicombo._removeindex(curidx);
                }
                else if (curidx > this._shift_select_base_index)
                {
                    this._do_select(nextidx, true, true);
                    multicombo._insertIndex(nextidx);
                }
                else
                {
                    rows = curidx == nextidx ? [curidx] : [curidx, nextidx];
                    if (multicombo._p_index.toString() != rows.toString())
                    {
                        multicombo._clear_all(true, true);

                        this._do_select(rows, true, true);
                        multicombo._changeIndex(rows);
                    }
                }
                multicombo.redraw();
            }
            else if (curidx != -1)
            {
                var cur_item = this._getItem(curidx);
                var next_item = this._getItem(nextidx);
                var filtered_curidx = multicombo._filtereddataset._viewRecords[curidx]._rawidx;
                var filtered_nextidx = multicombo._filtereddataset._viewRecords[nextidx]._rawidx;

                if (curidx < this._shift_select_base_index)
                {
                    cur_item.set_selected(false);
                    this._select_remove(filtered_curidx);
                    multicombo._removeindex(filtered_curidx);
                }
                else if (curidx > this._shift_select_base_index)
                {
                    next_item.set_selected(true);
                    this._select_add(filtered_nextidx);
                    multicombo._insertIndex(filtered_nextidx);
                }
                else
                {
                    rows = filtered_curidx == filtered_nextidx ? [filtered_curidx] : [filtered_curidx, filtered_nextidx];
                    if (multicombo._p_index.toString() != rows.toString())
                    {
                        multicombo._clear_all(true, true);

                        cur_item.set_selected(true);
                        next_item.set_selected(true);
                        this._select_add(filtered_curidx);
                        this._select_add(filtered_nextidx);
                        multicombo._changeIndex(rows);
                    }
                }
                multicombo.redraw();
            }
        }

        this._change_status_item_from_key(curidx, nextidx);

        this._is_clicked = false;
    };

    _pMultiComboCheckBoxSetControl._redrawListBoxContentsAfter = nexacro._emptyFn;

    _pMultiComboCheckBoxSetControl._createListItemControl = function (index)
    {
        var ds = this._innerdataset;

        if (!ds)
            return null;

        var dataCol = this._p_datacolumn ? this._p_datacolumn : this._datacolumn;
        var codeCol = this._p_codecolumn ? this._p_codecolumn : this._codecolumn;
        var readonlyCol = this._p_readonlycolumn;

        var txt = ds.getColumn(index, dataCol);
        txt = nexacro._toString(txt);
        var val = ds.getColumn(index, codeCol);
        val = this._convertValueType(val, true);
        var rdnly = ds.getColumn(index, readonlyCol);

        var itemheight = this._getItemHeight();
        var client_w = this._getClientWidth();

        var item = this._createListItem("item_" + index, 0, index * itemheight, Math.max(this._contents_maxwidth, client_w), itemheight, null, null, null, null, null, null, this);
        item.set_value(val);
        item.set_text(txt);
        item.set_index(index);
        item.set_selected(false);
        item.set_readonly(rdnly);
        this._select_multi = this._p_parent._p_parent._select_multi;
        // 선택 유지, Type = filter일 때 선택 반영
        var filtered_idx = ds._viewRecords[index]._rawidx;
        if (ds._viewRecords != ds._rawRecords)
        {
            for (var i = 0; i < this._select_multi.length; i++)
            {
                if (this._select_multi.items[i] == ds._rawRecords[filtered_idx]._rawidx)
                {
                    item.set_selected(true);
                }
            }
        }
        else
        {
            for (var i = 0; i < this._select_multi.length; i++)
            {
                if (index == this._select_multi.items[i])
                {
                    item.set_selected(true);
                }
            }
        }

        if (this._env._p_enableaccessibility)
        {
            this._setItemAccessibility(item);
        }

        // todo 안쓰는 이벤트 지워야 할지
        item._setEventHandler("onlbuttondown", this.on_notify_item_onlbuttondown, this);
        item._setEventHandler("onlbuttonup", this.on_notify_item_onlbuttonup, this);
        item._setEventHandler("ontouchstart", this.on_notify_item_ontouchstart, this);
        item._setEventHandler("ontouchend", this.on_notify_item_ontouchend, this);
        item._setEventHandler("onmouseenter", this.on_notify_item_onmouseenter, this);
        item._setEventHandler("onmouseleave", this.on_notify_item_onmouseleave, this);
        item._setEventHandler("onmousemove", this.on_notify_item_onmousemove, this);

        item.createComponent(this._is_created ? false : true);

        return item;
    };

    _pMultiComboCheckBoxSetControl._change_status_item_from_key = function (curidx, nextidx)
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

    _pMultiComboCheckBoxSetControl._selectAll = function (idx)
    {
        var sel = this._select_multi;
        var len = sel ? sel.length : 0;
        var item = this._getItem(idx);

        if (item)
        {
            item.set_selected(true);
            item._changeStatus("mouseover", false);
        }
        this._is_clicked = true;
        this._select_add(idx);
        this._is_clicked = false;
    };

    _pMultiComboCheckBoxSetControl._clearAll = function (idx)
    {
        var sel = this._select_multi;
        var len = sel ? sel.length : 0;
        var item = this._getItem(idx);

        if (item)
        {
            item.set_selected(false);
            item._changeStatus("mouseover", false);
        }
        var changeidx = this._p_index;
        var currentidx;
        if (this._select_multi && this._select_multi.length > 0)
        {
            if (this._p_index == idx)
            {
                var obj = this._select_multi.items;

                currentidx = obj.indexOf(this._p_index);
                if (currentidx > 0)
                {
                    changeidx = obj[currentidx - 1];
                }
            }
        }
        for (var i = 0; i < len; i++)
        {
            if (idx === sel.items[i])
            {
                this._is_clicked = true;
                this._select_remove(idx);
                this._is_clicked = false;
            }
        }
        if (this._select_multi && this._select_multi.length == 0)
        {
            this._changeIndex(-1);
        }
        else if (this._select_multi && this._select_multi.length > 0)
        {

            this._changeIndex(changeidx);
        }
    };

    _pMultiComboCheckBoxSetControl._createListItem = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        return new nexacro._MultiComboListItemControl(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    _pMultiComboCheckBoxSetControl._on_select_change = function (idx, isSelected, jobgbn, params, isNotFireEvent)
    {
        var multicombo = this._p_parent;
        if ((multicombo._p_type == "search" || multicombo._p_type == "caseisearch") && multicombo._isFiredOnInput)
        {

            var rowobj = this._getItem(idx);
            if (rowobj)
            {
                if (isSelected)
                    rowobj.set_selected(true);
                else
                    rowobj.set_selected(false);

                if (this._env._p_enableaccessibility)
                {
                    rowobj._setAccessibilityInfoIndex(idx + 1);
                    rowobj._setAccessibilityInfoCount(this._getInnerdatasetInfo("_rowcount"));
                }
            }

        }
        else
        {
            if (this._select_commit(jobgbn, idx, params, isNotFireEvent) !== false)
            {
                var rowobj = this._getItem(idx);
                if (rowobj)
                {
                    if (isSelected)
                        rowobj.set_selected(true);
                    else
                        rowobj.set_selected(false);

                    if (this._env._p_enableaccessibility)
                    {
                        rowobj._setAccessibilityInfoIndex(idx + 1);
                        rowobj._setAccessibilityInfoCount(this._getInnerdatasetInfo("_rowcount"));
                    }
                }
            }
        }
    };

    //===============================================================
    // nexacro._MultiComboCheckBoxSetControl : Util Function
    //===============================================================
    _pMultiComboCheckBoxSetControl._changeIndex = function (v)
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

    _pMultiComboCheckBoxSetControl._getItem = function (index)
    {
        var pages = this._buffer_pages;
        var page, item;
        var i, j;

        for (i in pages)
        {
            page = pages[i];
            for (j in page)
            {
                item = page[j];
                if (item && (item.index == index))
                    return item;
            }
        }

        return null;
    };

    _pMultiComboCheckBoxSetControl._getContentsItem = function ()
    {
        var ret = [];
        var pages = this._buffer_pages;
        for (var i in pages)
        {
            if (pages[i] && pages.hasOwnProperty(i))
            {
                ret = ret.concat(pages[i]);
            }
        }

        return ret;
    };

    _pMultiComboCheckBoxSetControl._get_rowobj_status = function (status, flag, lastselected)
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

                        if ((lastselected) && lastselected == rowobj.index)
                        {
                            return rowobj;
                        }

                        if (rowobj && ((flag == "status" && rowobj._status == status) || (flag == "userstatus" && rowobj._userstatus == status)))
                        {
                            if (!lastselected)
                                return rowobj;
                        }
                    }
                }
            }
        }

        return null;
    };

    _pMultiComboCheckBoxSetControl._get_all_rowobj_status = function (status, flag)
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

    _pMultiComboCheckBoxSetControl = null;

    //==============================================================================
    // nexacro._MultiComboListItemControl
    //==============================================================================
    nexacro._MultiComboListItemControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro._CheckBoxSetItemControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pMultiComboListItemControl = nexacro._createPrototype(nexacro._CheckBoxSetItemControl, nexacro._MultiComboListItemControl);
    nexacro._MultiComboListItemControl.prototype = _pMultiComboListItemControl;

    /* default properties */

    /* internal variable */

    /* status */

    /* event list */

    /* accessibility */

    //===============================================================
    // nexacro._MultiComboListItemControl : Create & Update
    //===============================================================

    //===============================================================
    // nexacro._MultiComboListItemControl : Override
    //===============================================================
    _pMultiComboListItemControl._redrawListBoxContents = function (bScrollChange)
    {
        this._redrawListBoxContentsBefore();

        var rowcount = this._getInnerdatasetInfo("_rowcount");
        if (rowcount)
        {
            var itemheight = this._p_parent._getItemHeight();
            var client_h = this._p_parent._getClientHeight();
            var page_rowcount = itemheight ? client_h / itemheight : 0;

            if (this._env._p_enableaccessibility && (nexacro._isMobile && nexacro._isMobile()))
            {
                page_rowcount = rowcount;
            }
            // calc page
            this._page_rowcount = Math.ceil(page_rowcount);
            this._page_rowcount_min = Math.floor(page_rowcount);

            // calc range
            var start_index = 0;
            var end_index = 0;
            if (bScrollChange)
            {
                end_index = rowcount - 1;

                if (end_index >= this._page_rowcount)
                    end_index = this._page_rowcount > 0 ? this._page_rowcount - 1 : 0;
            }
            else
            {
                //scroll 위치 유지
                start_index = this._get_first_visible_row();
                end_index = this._get_last_visible_row(true);
            }

            this._recalcContentsMaxSize();
            this._createListBoxContents(start_index, end_index);

            if (this._p_value !== undefined)
            {
                this.on_apply_value(this._p_value);
            }
            else if (this._p_index != -1)
            {
                this.on_apply_index(this._p_index);
            }
        }

        this._redrawListBoxContentsAfter();
    };

    _pMultiComboListItemControl._on_getFitSize = function ()
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

            var font = this._getCurrentStyleInheritValue("font");
            var refer_font = this._getReferenceAbsoluteFont(font); // use to em / rem
            var wordspace = this._getCurrentStyleInheritValue("wordSpacing");
            var letterspace = this._getCurrentStyleInheritValue("letterSpacing");
            // var wordwrap = this.wordWrap || this._getCSSStyleValue("wordWrap");

            var text_size = nexacro._getTextSize(text ? text : "<가", font, false, undefined, "none", wordspace, letterspace, undefined, undefined, undefined, refer_font);

            total_w += Math.ceil(this._p_textwidth != null ? this._p_textwidth : text_size[0]);
            total_h += Math.ceil(text_size[1]);

            return [total_w, total_h];
        }

        return [this._adjust_width, this._adjust_height];
    };

    _pMultiComboListItemControl._getStringResourceProperty = function (v)
    {
        return v;
    }
    //===============================================================
    // nexacro._MultiComboListItemControl : Properties
    //===============================================================

    //===============================================================
    // nexacro._MultiComboListItemControl : Methods
    //===============================================================

    //===============================================================
    // nexacro._MultiComboListItemControl : Events
    //===============================================================
    _pMultiComboListItemControl.on_fire_sys_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        var list = this._p_parent;
        if (list)
        {
            var window = this._getWindow();
            var comp = window.findComponent(from_elem);

            if (comp.readonly)
                return;

            list._upitem = comp;
        }
        return nexacro.Component.prototype.on_fire_sys_onlbuttonup.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key);
    };

    _pMultiComboListItemControl.on_fire_sys_ontouchend = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
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

            if (comp.readonly)
                return;

            list._upitem = comp;
        }
        return nexacro.Component.prototype.on_fire_sys_ontouchend.call(this, touchinfos, changedtouchinfos, from_comp, from_refer_comp);
    };

    _pMultiComboListItemControl.on_tap_basic_action = function (elem, canvasX, canvasY, screenX, screenY, refer_comp)
    {
        return;
    };

    //===============================================================
    // nexacro._MultiComboListItemControl : Logical part
    //===============================================================

    //===============================================================
    // nexacro._MultiComboListItemControl : Util Function
    //===============================================================

    _pMultiComboListItemControl = null;

    //==============================================================================
    // nexacro._MultiComboPopupControl
    //==============================================================================
    nexacro._MultiComboPopupControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.PopupControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pMultiComboPopupControl = nexacro._createPrototype(nexacro.PopupControl, nexacro._MultiComboPopupControl);
    nexacro._MultiComboPopupControl.prototype = _pMultiComboPopupControl;
    _pMultiComboPopupControl._type_name = "popupMultiCombo";

    /* internal variable */

    //===============================================================
    // nexacro._MultiComboPopupControl : Override
    //===============================================================

    //===============================================================
    // nexacro._MultiComboPopupControl : Properties
    //===============================================================

    //===============================================================
    // nexacro._MultiComboPopupControl : Logical part
    //===============================================================
    _pMultiComboPopupControl._popupAuto = function ()
    {
        var pos = {};
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
    // nexacro._MultiComboPopupControl : Util Function
    //===============================================================
    _pMultiComboPopupControl._setType = function (type)
    {
        this._type = type;
    };

    _pMultiComboPopupControl._getElementPosition = function ()
    {
        // for Preview
        var multicombo = this._p_parent;
        if (multicombo)
        {
            return nexacro._getElementPositionInFrame(multicombo.getElement());
        }

        return {};
    };

    _pMultiComboPopupControl._getPopupParentPos = function ()
    {
        var multicombo = this._p_parent;
        var multicombo_size = [multicombo._adjust_width, multicombo._adjust_height];
        var multicombo_elem_pos = nexacro._getElementPositionInFrame(multicombo.getElement());

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

        return { "x": multicombo_elem_pos.x, "y": multicombo_elem_pos.y, "width": multicombo_size[0], "height": multicombo_size[1], "xgap": xgap, "ygap": ygab };
    };

    _pMultiComboPopupControl._getPopupPosition = function ()
    {
        var popup_left = 0;
        var popup_top = 0;
        var popup_width = 0;
        var popup_height = 0;
        var xgap = 0;
        var ygap = 0;

        var multicombo = this._p_parent;
        var multicombolist = this._attached_comp;
        var rootframe = this._getRootFrame();

        if (multicombo && multicombolist && rootframe)
        {
            var checkboxset = multicombolist.checkboxset;
            var multicomboedit = multicombolist.multicomboedit;
            var selectallcheckbox = multicombolist.selectallcheckbox;

            if (checkboxset)
            {
                var win = this._getWindow();

                var minimum_row = 3;

                var multicombopos = this._getPopupParentPos();
                var multicombo_elem_pos = { "x": multicombopos.x, "y": multicombopos.y };
                var multicombo_size = [multicombopos.width, multicombopos.height];
                xgap = multicombopos.xgap;
                ygap = multicombopos.ygap;

                var multicombo_vscrollsize = multicombo._getVScrollBarSize();
                var multicombo_displayrowcount = multicombo._p_displayrowcount;
                var multicombo_rowcount = multicombo._selectDataset() ? multicombo._selectDataset().getRowCount() : 0;

                var multicombo_popupsize = multicombo._getPopupSizeArr();

                // multicombolist
                var multicombolist_bordersize = multicombolist._getCurrentStyleBorder();
                multicombolist_bordersize = multicombolist_bordersize ? multicombolist_bordersize._getBorderHeight() : 0;

                var multicombolist_paddingsize = multicombolist._getCurrentStylePadding();
                multicombolist_paddingsize = multicombolist_paddingsize ? multicombolist_paddingsize.top + multicombolist_paddingsize.bottom : 0;

                var multicombolist_stylesize = multicombolist_bordersize + multicombolist_paddingsize;
                var multicombolist_minimum_height;
                var multicombolist_height;

                // checkboxset
                var checkboxset_size = checkboxset._on_getFitSize();
                var checkboxset_itemheight = checkboxset._getItemHeight();

                var checkboxset_bordersize = checkboxset._getCurrentStyleBorder();
                checkboxset_bordersize = checkboxset_bordersize ? checkboxset_bordersize._getBorderHeight() : 0;

                var checkboxset_paddingsize = checkboxset._getCurrentStylePadding();
                checkboxset_paddingsize = checkboxset_paddingsize ? checkboxset_paddingsize.top + checkboxset_paddingsize.bottom : 0;

                var checkboxset_stylesize = checkboxset_bordersize + checkboxset_paddingsize;

                // multicomboedit
                var edit_height = 0;
                if (multicomboedit)
                {
                    if (multicombo._p_type != "dropdown" && (multicombo._p_edittype == "text" || multicombo._p_edittype == "count"))
                    {
                        var text_height = checkboxset._getTextHeight();

                        var edit_paddingsize = multicomboedit._getCurrentStylePadding();
                        edit_paddingsize = edit_paddingsize ? edit_paddingsize.top + edit_paddingsize.bottom : 0;

                        var edit_bordersize = multicomboedit._getCurrentStyleBorder();
                        edit_bordersize = edit_bordersize ? edit_bordersize._getBorderHeight() : 0;

                        edit_height = text_height + edit_paddingsize + edit_bordersize;
                    }
                }

                // selectallcheckbox
                var selectall_size = [0, 0];
                var selectall_height = 0;
                if (selectallcheckbox)
                {
                    selectall_size = selectallcheckbox._on_getFitSize();

                    var selectall_bordersize = selectallcheckbox._getCurrentStyleBorder();
                    selectall_bordersize = selectall_bordersize ? selectall_bordersize._getBorderHeight() : 0;

                    var selectall_paddingsize = selectallcheckbox._getCurrentStylePadding();
                    selectall_paddingsize = selectall_paddingsize ? selectall_paddingsize.top + selectall_paddingsize.bottom : 0;

                    if (this._p_parent._p_selectallcheckboxheight != undefined)
                        selectall_height = this._p_parent._p_selectallcheckboxheight;
                    else
                        selectall_height = selectall_size[1];
                }

                var rootframe_elem_pos = nexacro._getElementPositionInFrame(rootframe.getElement());

                var win_left = nexacro._allow_default_pinchzoom ? nexacro._getWindowOffsetPosition(win).left : rootframe_elem_pos.x;
                var view_height = nexacro._getWindowHandleClientHeight(win.handle);

                if (nexacro._Browser == "Runtime")
                    view_height = Math.round(view_height / nexacro._getDevicePixelRatio(rootframe.getElement()));

                var upper_space_height = multicombo_elem_pos.y;
                var below_space_height = view_height - (multicombo_elem_pos.y + multicombo_size[1]);

                popup_top = multicombo_size[1];

                if (multicombo_popupsize)
                {
                    popup_width = multicombo_popupsize.width;
                    popup_height = multicombo_popupsize.height ? multicombo_popupsize.height : popup_height;
                }
                else
                {
                    popup_width = Math.max(multicombo_size[0], checkboxset_size[0], selectall_size[0]);
                }

                if (multicombo_displayrowcount == null)
                {
                    multicombolist_minimum_height = edit_height + selectall_height + (multicombo_rowcount < minimum_row ? multicombo_rowcount : minimum_row) * checkboxset_itemheight + checkboxset_stylesize + multicombolist_stylesize;
                    multicombolist_height = popup_height ? popup_height : edit_height + selectall_height + (multicombo_rowcount * checkboxset_itemheight) + checkboxset_stylesize + multicombolist_stylesize;

                    if (below_space_height > multicombolist_minimum_height) // enough below space
                    {
                        if (below_space_height > multicombolist_height)
                        {
                            popup_height = multicombolist_height;
                        }
                        else
                        {
                            popup_height = below_space_height;

                            if (!multicombo_popupsize)
                            {
                                if (popup_width == checkboxset_size[0])
                                {
                                    popup_width += multicombo_vscrollsize;
                                }
                            }
                        }
                    }
                    else // not enough below space
                    {
                        if (upper_space_height > multicombolist_minimum_height)// enough upper space
                        {
                            if (upper_space_height > multicombolist_height)
                            {
                                popup_top = -multicombolist_height;
                                popup_height = multicombolist_height;
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
                    if (multicombo_rowcount > multicombo_displayrowcount)
                    {
                        multicombo_rowcount = multicombo_displayrowcount;

                        if (!multicombo_popupsize && popup_width <= checkboxset_size[0] + multicombo_vscrollsize)
                        {
                            popup_width = checkboxset_size[0] + multicombo_vscrollsize;
                        }
                    }

                    multicombolist_minimum_height = edit_height + selectall_height + (multicombo_rowcount * checkboxset_itemheight + checkboxset_stylesize) + multicombolist_stylesize;

                    if (below_space_height > multicombolist_minimum_height) // enough below space
                    {
                        if (popup_height == 0)
                            popup_height = multicombolist_minimum_height;
                    }
                    else // not enough below space
                    {
                        if (upper_space_height > multicombolist_minimum_height)// enough upper space
                        {
                            popup_top = -multicombolist_minimum_height;
                            popup_height = multicombolist_minimum_height;
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

                if (multicombo_elem_pos.x < win_left)
                {
                    popup_left += win_left - multicombo_elem_pos.x;
                }
                else if (multicombo_elem_pos.x + popup_width > win_left + client_width)
                {
                    popup_left -= (multicombo_elem_pos.x + popup_width) - (win_left + client_width);

                    if (popup_left < (win_left - multicombo_elem_pos.x))
                    {
                        popup_left = win_left - multicombo_elem_pos.x;
                    }
                }
            }
        }

        return { left: popup_left + xgap, top: popup_top + ygap, width: popup_width, height: popup_height };
    };

    _pMultiComboPopupControl._getPopupPositionCenter = function ()
    {
        var popup_left = 0;
        var popup_top = 0;
        var popup_width = 0;
        var popup_height = 0;

        var window_width = 0;
        var window_height = 0;

        var multicombo = this._p_parent;
        var multicombolist = this._attached_comp;

        if (multicombo && multicombolist)
        {
            var checkboxset = multicombolist.checkboxset;
            var multicomboedit = multicombolist.multicomboedit;
            var selectallcheckbox = multicombolist.selectallcheckbox;

            if (checkboxset)
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
                    window_width = Math.round(window_width / nexacro._getDevicePixelRatio(multicombo.getElement()));
                    window_height = Math.round(window_height / nexacro._getDevicePixelRatio(multicombo.getElement()));
                }
                var multicombo_vscrollsize = multicombo._getVScrollBarSize();
                var multicombo_displayrowcount = multicombo._p_displayrowcount;
                var multicombo_rowcount = multicombo._selectDataset() ? multicombo._selectDataset().getRowCount() : 0;
                var multicombo_popupsize = multicombo._getPopupSizeArr();

                // multicombolist
                var multicombolist_bordersize = multicombolist._getCurrentStyleBorder();
                multicombolist_bordersize = multicombolist_bordersize ? multicombolist_bordersize._getBorderHeight() : 0;

                var multicombolist_paddingsize = multicombolist._getCurrentStylePadding();
                multicombolist_paddingsize = multicombolist_paddingsize ? multicombolist_paddingsize.top + multicombolist_paddingsize.bottom : 0;

                var multicombolist_stylesize = multicombolist_bordersize + multicombolist_paddingsize;

                // checkboxset
                var checkboxset_size = checkboxset._on_getFitSize();
                var checkboxset_itemheight = checkboxset._getItemHeight();

                var checkboxset_bordersize = checkboxset._getCurrentStyleBorder();
                checkboxset_bordersize = checkboxset_bordersize ? checkboxset_bordersize._getBorderHeight() : 0;

                var checkboxset_paddingsize = checkboxset._getCurrentStylePadding();
                checkboxset_paddingsize = checkboxset_paddingsize ? checkboxset_paddingsize.top + checkboxset_paddingsize.bottom : 0;

                var checkboxset_stylesize = checkboxset_bordersize + checkboxset_paddingsize;

                // multicomboedit
                var edit_height = 0;
                if (multicomboedit)
                {
                    if (multicombo._p_type != "dropdown" && (multicombo._p_edittype == "text" || multicombo._p_edittype == "count"))
                    {
                        var text_height = checkboxset._getTextHeight();

                        var edit_paddingsize = multicomboedit._getCurrentStylePadding();
                        edit_paddingsize = edit_paddingsize ? edit_paddingsize.top + edit_paddingsize.bottom : 0;

                        var edit_bordersize = multicomboedit._getCurrentStyleBorder();
                        edit_bordersize = edit_bordersize ? edit_bordersize._getBorderHeight() : 0;

                        edit_height = text_height + edit_paddingsize + edit_bordersize;
                    }
                }

                // selectallcheckbox
                var selectall_size = [0, 0];
                var selectall_height = 0;
                if (selectallcheckbox)
                {
                    selectall_size = selectallcheckbox._on_getFitSize();

                    var selectall_bordersize = selectallcheckbox._getCurrentStyleBorder();
                    selectall_bordersize = selectall_bordersize ? selectall_bordersize._getBorderHeight() : 0;

                    var selectall_paddingsize = selectallcheckbox._getCurrentStylePadding();
                    selectall_paddingsize = selectall_paddingsize ? selectall_paddingsize.top + selectall_paddingsize.bottom : 0;

                    if (this._p_parent._p_selectallcheckboxheight != undefined)
                        selectall_height = this._p_parent._p_selectallcheckboxheight;
                    else
                        selectall_height = selectall_size[1];
                }

                popup_width = multicombo_popupsize ? multicombo_popupsize.width : Math.max(checkboxset_size[0], selectall_size[0]);

                if (multicombo_popupsize && multicombo_popupsize.height)
                {
                    popup_height = multicombo_popupsize.height;
                }
                else
                    popup_height = edit_height + selectall_height + (multicombo_rowcount * checkboxset_itemheight) + checkboxset_stylesize + multicombolist_stylesize;

                if (multicombo_displayrowcount == null)
                {
                    if (popup_height > window_height)
                    {
                        popup_height = window_height;
                        popup_width += multicombo_vscrollsize;
                    }
                }
                else
                {
                    if (multicombo_rowcount > multicombo_displayrowcount)
                    {
                        popup_height = edit_height + selectall_height + (multicombo_displayrowcount * checkboxset_itemheight) + checkboxset_stylesize + multicombolist_stylesize;

                        if (popup_height > window_height)
                        {
                            popup_height = window_height;
                        }

                        popup_width += multicombo_vscrollsize;
                    }
                    else
                    {
                        if (popup_height > window_height)
                        {
                            popup_height = window_height;
                            popup_width += multicombo_vscrollsize;
                        }
                    }
                }

                popup_left = ((window_width / 2) - (popup_width / 2));
                popup_top = ((window_height / 2) - (popup_height / 2));
                popup_top = popup_top < 0 ? 0 : popup_top;
                popup_top += add_addressbar_height;
            }
        }

        return { left: popup_left, top: popup_top, width: popup_width, height: popup_height };
    };

    _pMultiComboPopupControl._setZoom = function (scale)
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

    _pMultiComboPopupControl = null;

    //==============================================================================
    // nexacro._MultiComboTagBoxControl
    //==============================================================================
    nexacro._MultiComboTagBoxControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pMultiComboTagBoxControl = nexacro._createPrototype(nexacro.Component, nexacro._MultiComboTagBoxControl);
    nexacro._MultiComboTagBoxControl.prototype = _pMultiComboTagBoxControl;
    _pMultiComboTagBoxControl._type_name = "MultiComboTagBoxControl";

    /* control */
    _pMultiComboTagBoxControl.tagboxedit = null;
    _pMultiComboTagBoxControl._multicombotags = null;

    /* default properties */
    _pMultiComboTagBoxControl._contents_maxwidth = 0;
    _pMultiComboTagBoxControl._contents_maxheight = 0;

    /* internal variable */
    _pMultiComboTagBoxControl._is_subcontrol = true;
    _pMultiComboTagBoxControl._is_scrollable = true;
    _pMultiComboTagBoxControl._touch_scrolling = true;
    _pMultiComboTagBoxControl._keep_scrolling = true;

    /* status */

    /* event list */

    //===============================================================
    // nexacro._MultiComboTagBoxControl : Create & Update
    //===============================================================
    _pMultiComboTagBoxControl.on_create_contents = function ()
    {
        var control = this.getElement();
        if (control)
        {
            var selectedItems = this._p_parent._select_multi;

            if (!selectedItems)
                return;

            for (var i = 0; i < selectedItems.length; i++)
            {
                this._createMultiComboTagControl(selectedItems.items[i]);
            }

            if (!this.tagboxedit)
            {
                this.tagboxedit = new nexacro._MultiComboEditControl("tagboxedit", 0, 0, 0, 0, null, null, null, null, null, null, this, this._onlydisplay);
                this.tagboxedit.createComponent();
            }
        }
    };

    _pMultiComboTagBoxControl.on_created_contents = function (win)
    {
        var multicombo = this._p_parent;

        if (this._multicombotags)
        {
            var selectedItems = multicombo._select_multi;
            for (var i = 0; i < selectedItems.length; i++)
            {
                this._multicombotags[selectedItems.items[i]].on_created(win);
            }
            this._onRecalcScrollSize();
        }

        var tagboxedit = this.tagboxedit;
        if (tagboxedit)
        {
            tagboxedit.on_created(win);

            tagboxedit.set_displaynulltext(multicombo._p_displaynulltext);
            tagboxedit.set_readonly(multicombo._p_readonly);
            tagboxedit.set_usecontextmenu(multicombo._p_usecontextmenu);
        }
    };

    _pMultiComboTagBoxControl.on_destroy_contents = function ()
    {
        if (this._multicombotags)
        {
            for (var tag in this._multicombotags)
            {
                this._multicombotags[tag].destroy();
            }
            this._multicombotags = null;
        }

        if (this.tagboxedit)
        {
            this.tagboxedit.destroy();
            this.tagboxedit = null;
        }

        this._removeEventHandlerToInnerDataset();
    };

    _pMultiComboTagBoxControl._removeEventHandlerToInnerDataset = function ()
    {
    };

    _pMultiComboTagBoxControl.on_create_contents_command = function ()
    {
        var str = "";

        if (this._multicombotags)
        {
            var selectedItems = this._p_parent._select_multi;
            for (var i = 0; i < selectedItems.length; i++)
            {
                str += this._multicombotags[selectedItems.items[i]].createCommand();
            }
        }

        if (this.tagboxedit)
        {
            str += this.tagboxedit.createCommand();
        }

        return str;
    };

    _pMultiComboTagBoxControl.on_attach_contents_handle = function (win)
    {
        if (this._multicombotags)
        {
            var selectedItems = this._p_parent._select_multi;

            for (var i = 0; i < selectedItems.length; i++)
            {
                this._multicombotags[selectedItems.items[i]].attachHandle(win);
                this._multicombotags[selectedItems.items[i]]._setAccessibilityStatHidden(true);
            }
        }

        if (this.tagboxedit)
        {
            this.tagboxedit.attachHandle(win);
        }
    };

    //===============================================================
    // nexacro._MultiComboTagBoxControl : Override
    //===============================================================
    _pMultiComboTagBoxControl.on_apply_prop_enable = function (v)
    {
        if (this.tagboxedit)
        {
            this.tagboxedit._setEnable(v);
        }
        if (this._multicombotags)
        {
            var multicombotags = this._multicombotags;
            if (multicombotags)
            {
                for (var tag in multicombotags)
                {
                    multicombotags[tag]._setEnable(v);
                }
            }
        }
    };

    _pMultiComboTagBoxControl._onRecalcScrollSize = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var client_w = this._getClientWidth();
            var client_h = this._getClientHeight();

            var scrollWidth = Math.max(this._contents_maxwidth, client_w);
            var scrollHeight = Math.max(this._contents_maxheight, client_h);

            this._calc_scroll = true;

            control_elem.setElementScrollMaxSize(scrollWidth, scrollHeight);

            if (!this._cnt_resetscroll)
                this._onResetScrollBar();

            this._calc_scroll = false;
            this._cnt_resetscroll = 0;
        }
    };

    _pMultiComboTagBoxControl.on_change_containerRect = function (/*width, height*/)
    {
        if (this._is_created_contents)
        {
            this._recalcLayout();

            if (!this._calc_scroll)
            {
                this._cnt_resetscroll++;
                this._onResetScrollBar();
            }
        }
    };

    //===============================================================
    // nexacro._MultiComboTagBoxControl : Properties
    //===============================================================
    _pMultiComboTagBoxControl.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_readonly != v)
        {
            this._p_readonly = v;
            this.on_apply_readonly(v);
        }
    };

    _pMultiComboTagBoxControl.on_apply_readonly = function (readonly)
    {
        this._changeStatus("readonly", readonly);

        var tagboxedit = this.tagboxedit;
        if (tagboxedit)
        {
            tagboxedit.set_readonly(readonly);
        }

        var multicombotags = this._multicombotags;
        if (multicombotags)
        {
            for (var tag in multicombotags)
            {
                multicombotags[tag].set_readonly(readonly);
            }
        }
    };

    //===============================================================
    // nexacro._MultiComboTagBoxControl : Methods
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagBoxControl : Events
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagBoxControl : Logical part
    //===============================================================
    _pMultiComboTagBoxControl._createMultiComboTagControl = function (index)
    {
        var multicombo = this._p_parent;

        if (!this._multicombotags)
            this._multicombotags = {};

        this._multicombotags[index] = this._createMultiComboTag("tagboxitem" + index, 0, 0, 0, 0, null, null, null, null, null, null, this);
        this._multicombotags[index].set_index(index);
        this._multicombotags[index].set_value(multicombo._getItemValue(index));
        this._multicombotags[index].set_text(multicombo._getItemText(index));

        this._multicombotags[index].createComponent(this._is_created ? false : true);
    };

    _pMultiComboTagBoxControl._createMultiComboTag = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        return new nexacro._TagBoxControl(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    _pMultiComboTagBoxControl.on_getIDCSSSelector = function ()
    {
        return "multicombotagbox";
    };

    _pMultiComboTagBoxControl._recalcLayout = function ()
    {
        if (this._is_created_contents)
        {
            var client_width = this._getClientWidth();
            var client_height = this._getClientHeight();

            var multicombo = this._p_parent;
            var multicombotags = this._multicombotags;
            var tagboxedit = this.tagboxedit;

            var edit_width = 0, edit_height = 0, edit_left = 0, edit_top = 0;
            if (tagboxedit)
            {
                if (multicombo._p_type != "dropdown")
                {
                    var edit_paddingsize = tagboxedit._getCurrentStylePadding();
                    var edit_bordersize = tagboxedit._getCurrentStyleBorder();
                }
            }

            if (multicombotags)
            {
                var selectedItems = multicombo._select_multi;

                var gap_h = multicombo._p_tagboxitemhorizontalgap != undefined ? multicombo._p_tagboxitemhorizontalgap : 5;
                var gap_v = multicombo._p_tagboxitemverticalgap != undefined ? multicombo._p_tagboxitemverticalgap : 5;

                var tagitem = multicombotags[selectedItems.items[0]];
                var tag_paddingsize = tagitem._getCurrentStylePadding();
                var tag_padding_w = tag_paddingsize ? tag_paddingsize.left + tag_paddingsize.right : 0;
                var tag_padding_h = tag_paddingsize ? tag_paddingsize.top + tag_paddingsize.bottom : 0;
                var tag_bordersize = tagitem._getCurrentStyleBorder();
                var tag_border_w = tag_bordersize ? tag_bordersize._getBorderWidth() : 0;
                var tag_border_h = tag_bordersize ? tag_bordersize._getBorderHeight() : 0;

                // tag text 사이즈
                if (!tagitem.tagtext.text)
                {
                    tagitem.tagtext.set_text(" ");
                }
                var tagtext_size = tagitem.tagtext._on_getFitSize();
                var tagtext_width;
                var tagtext_height = tagtext_size[1];
                var tagtext_left = 0;
                var tagtext_top = 0;

                // tag button 사이즈
                var tagbutton_size = multicombo._p_tagbuttonsize;
                var tagbutton_width, tagbutton_height, tagbutton_left, tagbutton_top;
                if (tagbutton_size == undefined)
                {
                    tagbutton_width = multicombo._displaymode ? 0 : tagtext_height;
                    tagbutton_height = tagtext_height;
                }
                else
                {
                    if (typeof (dropbutton_size) == "number")
                    {
                        tagbutton_width = multicombo._displaymode ? 0 : tagbutton_size;
                        tagbutton_height = tagbutton_size;
                    }
                    else
                    {
                        tagbutton_size = tagbutton_size.split(" ");
                        tagbutton_width = multicombo._displaymode ? 0 : +tagbutton_size[0];
                        tagbutton_height = (tagbutton_size[1]) ? +tagbutton_size[1] : +tagbutton_size[0];
                    }
                }

                if (tagbutton_height > tagtext_height)
                {
                    tagtext_height = tagbutton_height;
                    tagtext_top = (tagbutton_height - tagtext_height) / 2;
                    tagbutton_top = 0;
                }
                else if (tagbutton_height < tagtext_height)
                {
                    tagtext_top = 0;
                    tagbutton_top = (tagtext_height - tagbutton_height) / 2;
                }
                else
                {
                    tagtext_top = 0;
                    tagbutton_top = 0;
                }

                // tag 사이즈
                var tag_width;
                var tag_height = Math.max(tagtext_height, tagbutton_height) + tag_padding_h + tag_border_h;
                var tag_left = 0;
                var tag_top = 0;

                // tags 사이즈
                var tags_width = 0;
                var tags_height = tag_height + gap_v;

                // eidt 사이즈
                if (tagboxedit)
                {
                    if (multicombo._p_type != "dropdown")
                    {
                        var edit_padding_w = edit_paddingsize ? edit_paddingsize.left + edit_paddingsize.right : 0;
                        var edit_bordersize = tagboxedit._getCurrentStyleBorder();
                        var edit_border_w = edit_bordersize ? edit_bordersize._getBorderWidth() : 0;

                        edit_width = client_width / 3 + edit_padding_w + edit_border_w; // client_width / 3 -> 임시로 설정한 듯
                        edit_height = tag_height;
                    }
                }

                for (var i = 0; i < selectedItems.length; i++)
                {
                    var tag = multicombotags[selectedItems.items[i]];
                    if (!tag.tagtext.text)
                    {
                        tag.tagtext.set_text(" ")
                    }
                    tagtext_size = tag.tagtext._on_getFitSize();
                    tagtext_width = tagtext_size[0];

                    tagbutton_left = tagtext_left + tagtext_width;

                    tag_width = tagtext_width + tagbutton_width + tag_padding_w + tag_border_w;
                    if (tag_width > client_width && multicombo._p_edittype == "multitag")
                    {
                        tag_width = client_width;
                        tagtext_width = tag_width - tagbutton_width - tag_padding_w;
                        tagbutton_left = tagtext_left + tagtext_width;
                    }

                    tags_width += (tag_width + gap_h);

                    if (multicombo._p_edittype == "multitag")
                    {
                        if (tags_width - gap_h > client_width) // 너비 초과
                        {
                            tag_left = 0;
                            tag_top = tags_height;
                            tags_width = tag_width + gap_h;
                            tags_height += (tag_height + gap_v);
                        }
                    }

                    tag.tagtext.move(tagtext_left, tagtext_top, tagtext_width, tagtext_height, null, null);
                    if (!multicombo._displaymode) tag.tagbutton.move(tagbutton_left, tagbutton_top, tagbutton_width, tagbutton_height, null, null);
                    tag.move(tag_left, tag_top, tag_width, tag_height, null, null);

                    tag_left = tags_width;
                }

                if (tagboxedit)
                {
                    if (multicombo._p_type != "dropdown")
                    {
                        if (multicombo._p_edittype == "singletag")
                        {
                            edit_left = tags_width;
                            edit_top = 0

                            tags_width += (edit_width + gap_h);
                        }
                        else if (multicombo._p_edittype == "multitag")
                        {
                            edit_left = tags_width;
                            edit_top = tags_height - tag_height - gap_v;

                            tags_width += (edit_width + gap_h);

                            if (tags_width - gap_h > client_width) // 너비 초과
                            {
                                edit_left = 0;
                                edit_top = tags_height;

                                tags_width = edit_width + gap_h;
                                tags_height += (edit_height + gap_v);
                            }
                        }
                        tagboxedit.move(edit_left, edit_top, edit_width, edit_height, null, null);
                    }
                }
                tags_width -= gap_h;
                tags_height -= gap_v;

                if (multicombo._p_edittype == "singletag")
                {
                    this._contents_maxwidth = tags_width;
                    this._contents_maxheight = client_height;
                }
                else
                {
                    this._contents_maxwidth = client_width;
                    this._contents_maxheight = tags_height;
                }
            }
            else
            {
                if (tagboxedit)
                {
                    if (multicombo._p_type != "dropdown")
                    {
                        var font = tagboxedit._getCurrentStyleInheritValue("font");
                        var refer_font = tagboxedit._getReferenceAbsoluteFont(font); // use to em / rem
                        var wordspace = tagboxedit._getCurrentStyleInheritValue("wordSpacing");
                        var letterspace = tagboxedit._getCurrentStyleInheritValue("letterSpacing");
                        var textsize = nexacro._getTextSize("A", font, false, undefined, "none", wordspace, letterspace, undefined, undefined, undefined, refer_font);
                        var edit_padding_h = edit_paddingsize ? edit_paddingsize.top + edit_paddingsize.bottom : 0;
                        var edit_border_h = edit_bordersize ? edit_bordersize._getBorderHeight() : 0;

                        edit_width = client_width;
                        edit_height = textsize[1] + edit_padding_h + edit_border_h;

                        tagboxedit.move(edit_left, edit_top, edit_width, edit_height, null, null);
                    }
                }

                this._contents_maxheight = client_height;
                this._contents_maxwidth = client_width;
            }
            this._onRecalcScrollSize();
        }
    };

    //===============================================================
    // nexacro._MultiComboTagBoxControl : Util Function
    //===============================================================
    _pMultiComboTagBoxControl._setScrollMaxPos = function ()
    {
        if (this._is_created)
        {
            var multicombo = this._p_parent;
            if (multicombo._p_edittype == "singletag" && this.hscrollbar)
            {
                var hscrollmax = this.hscrollbar.max;

                this.hscrollbar.set_pos(hscrollmax);
            }
            else if (multicombo._p_edittype == "multitag" && this.vscrollbar)
            {
                var vscrollmax = this.vscrollbar.max;
                this.vscrollbar.set_pos(vscrollmax);
            }
        }
    }

    _pMultiComboTagBoxControl._setMultiComboTagValue = function ()
    {
        var selectedItems = this._p_parent._select_multi;

        if (this._multicombotags)
        {
            this._destroyMulticomboTags();
        }

        for (var i = 0; i < selectedItems.length; i++)
        {
            this._createMultiComboTagControl(selectedItems.items[i]);
        }

        this._recalcLayout();
    };

    // 태그 전부 destroy
    _pMultiComboTagBoxControl._destroyMulticomboTags = function ()
    {
        if (this._multicombotags)
        {
            for (var tag in this._multicombotags)
            {
                this._multicombotags[tag].destroy();
            }
        }
        this._multicombotags = null;
    };

    // 태그 하나만 destroy
    _pMultiComboTagBoxControl._destroyMulticomboTag = function (index)
    {
        if (this._multicombotags && this._multicombotags[index])
        {
            this._multicombotags[index].destroy();
            delete this._multicombotags[index];
            var select_tag = this._p_parent._select_multi.tagselect;
            if (index == select_tag)
            {
                this._p_parent._select_multi.tagselect = -1;
            }
            if (Object.keys(this._multicombotags).length <= 0)
                this._multicombotags = null;
        }
    };

    _pMultiComboTagBoxControl = null;

    //==============================================================================
    // nexacro._TagBoxControl
    //==============================================================================
    nexacro._TagBoxControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pTagBoxControl = nexacro._createPrototype(nexacro.Component, nexacro._TagBoxControl);
    nexacro._TagBoxControl.prototype = _pTagBoxControl;
    _pTagBoxControl._type_name = "TagBoxControl";

    /* control */
    _pTagBoxControl.tagtext = null;
    _pTagBoxControl.tagbutton = null;

    /* default properties */
    _pTagBoxControl._p_index = "";
    _pTagBoxControl._p_value = undefined;

    /* internal variable */
    _pTagBoxControl._is_subcontrol = true;

    _pTagBoxControl._use_selected_status = true;

    /* status */

    /* event list */
    _pTagBoxControl._event_list = {
        "onclick": 1, "ondblclick": 1,
        "onflingstart": 1, "onfling": 1, "onflingend": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onlongpress": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmove": 1,
        "onmousedown": 1, "onmouseup": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
        "oncontextmenu": 1,
        "onrbuttondown": 1, "onrbuttonup": 1
    };

    _pTagBoxControl.on_getIDCSSSelector = function ()
    {
        return "tagboxitem";
    };

    //===============================================================
    // nexacro._TagBoxControl : Create & Update
    //===============================================================
    _pTagBoxControl.on_create_contents = function ()
    {
        var control = this.getElement();
        if (control)
        {
            var tagtext = this.tagtext = new nexacro.Static("tagtext", 0, 0, 0, 0, null, null, null, null, null, null, this);
            this.tagtext._setControl();
            this.tagtext.createComponent();
            tagtext.set_text(this._p_text);

            if (this._p_parent._displaymode)
                return;

            var tagbutton = this.tagbutton = new nexacro._MultiComboTagButtonControl("tagbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
            this.tagbutton.createComponent();
            tagbutton._setEventHandlerToTagButton();
        }
    };

    _pTagBoxControl.on_created_contents = function (win)
    {
        this.tagtext.on_created(win);

        if (this._p_parent._displaymode)
            return;

        this.tagbutton.on_created(win);
    };

    _pTagBoxControl.on_destroy_contents = function ()
    {
        if (this.tagtext)
        {
            this.tagtext.destroy();
            this.tagtext = null;
        }

        if (this.tagbutton)
        {
            this.tagbutton.destroy();
            this.tagbutton = null;
        }
    };

    _pTagBoxControl.on_create_contents_command = function ()
    {
        var str = "";

        if (this.tagtext)
        {
            str += this.tagtext.createCommand();
        }

        if (this.tagbutton)
        {
            str += this.tagbutton.createCommand();
        }

        return str;
    };

    _pTagBoxControl.on_attach_contents_handle = function (win)
    {
        if (this.tagtext)
        {
            this.tagtext.attachHandle(win);
            this.tagtext._setAccessibilityStatHidden(true);
        }

        if (this.tagbutton)
        {
            this.tagbutton.attachHandle(win);
            this.tagbutton._setAccessibilityStatHidden(true);
        }
    };

    //===============================================================
    // nexacro._TagBoxControl : Override
    //===============================================================
    _pTagBoxControl.on_apply_prop_enable = function (v)
    {
        if (this.tagtext)
        {
            this.tagtext._setEnable(v);
        }
        if (this.tagbutton)
        {
            this.tagbutton._setEnable(v);
        }
    };

    //===============================================================
    // nexacro._TagBoxControl : Properties
    //===============================================================
    _pTagBoxControl.set_index = function (v)
    {
        if (v !== this._p_index)
        {
            this._p_index = parseInt(v, 10);
        }
    };

    _pTagBoxControl.set_value = function (v)
    {
        if (v !== this._p_value)
        {
            this._p_value = v;
        }
    };

    _pTagBoxControl.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_readonly != v)
        {
            this._p_readonly = v;
            this.on_apply_readonly(v);
        }
    };

    _pTagBoxControl.on_apply_readonly = function (readonly)
    {
        this._changeStatus("readonly", readonly);

        var tagtext = this.tagtext;
        if (tagtext)
        {
            tagtext._setEnable(this._isEnable() && !readonly);
        }

        var tagbutton = this.tagbutton;
        if (tagbutton)
        {
            tagbutton._setEnable(this._isEnable() && !readonly);
        }
    };

    //===============================================================
    // nexacro._TagBoxControl : Methods
    //===============================================================

    //===============================================================
    // nexacro._TagBoxControl : Events
    //===============================================================

    //===============================================================
    // nexacro._TagBoxControl : Logical part
    //===============================================================

    //===============================================================
    // nexacro._TagBoxControl : Util Function
    //===============================================================

    _pTagBoxControl = null;

    //==============================================================================
    // nexacro._MultiComboTagButtonControl
    //==============================================================================
    nexacro._MultiComboTagButtonControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pMultiComboTagButtonControl = nexacro._createPrototype(nexacro.Button, nexacro._MultiComboTagButtonControl);
    nexacro._MultiComboTagButtonControl.prototype = _pMultiComboTagButtonControl;

    /* default properties */

    /* internal variable */
    _pMultiComboTagButtonControl._is_subcontrol = true;

    /* status */

    /* event list */

    /* accessibility */

    //===============================================================
    // nexacro._MultiComboTagButtonControl : Create & Update
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagButtonControl : Override
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagButtonControl : Properties
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagButtonControl : Methods
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagButtonControl : Events
    //===============================================================
    _pMultiComboTagButtonControl._on_tagbutton_onclick = function (obj, evt)
    {
        var multicombotag = this._p_parent;
        var multicombotagbox = multicombotag.parent;
        var root_comp = multicombotagbox.parent;

        var tagobj = obj.parent;

        root_comp._on_tagbutton_onclick(this._p_parent._p_index, tagobj);
    };

    //===============================================================
    // nexacro._MultiComboTagButtonControl : Logical part
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagButtonControl : Util Function
    //===============================================================
    _pMultiComboTagButtonControl._setEventHandlerToTagButton = function ()
    {
        this._setEventHandler("onclick", this._on_tagbutton_onclick, this);
    };

    _pMultiComboTagButtonControl = null;

    //==============================================================================
    // nexacro._SelectAllCheckBoxControl
    //==============================================================================
    nexacro._SelectAllCheckBoxControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.CheckBox.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pSelectAllCheckBoxControl = nexacro._createPrototype(nexacro.CheckBox, nexacro._SelectAllCheckBoxControl);
    nexacro._SelectAllCheckBoxControl.prototype = _pSelectAllCheckBoxControl;
    _pSelectAllCheckBoxControl._type_name = "CheckBoxControl";

    /* default properties */
    _pSelectAllCheckBoxControl._p_selected = false;

    /* status */
    _pSelectAllCheckBoxControl._is_subcontrol = true;

    /* event list */
    _pSelectAllCheckBoxControl._event_list =
    {
        "onclick": 1, "ondblclick": 1,
        "onflingstart": 1, "onfling": 1, "onflingend": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onlongpress": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmove": 1,
        "onmousedown": 1, "onmouseup": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
        "oncontextmenu": 1,
        "onrbuttondown": 1, "onrbuttonup": 1
    };
    //===============================================================
    // nexacro._SelectAllCheckBoxControl : Create & Update
    //===============================================================

    //===============================================================
    // nexacro._SelectAllCheckBoxControl : Override
    //===============================================================
    _pSelectAllCheckBoxControl._on_click = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key)
    {
        // todo 이벤트 호출 방식
        var popupcontrol = this._p_parent;
        var root_comp = popupcontrol._p_parent;
        var rowcount = root_comp._innerdataset.rowcount;
        if (root_comp._select_multi.length > rowcount / 2)
        {
            this.set_selected(false);
            root_comp._clear_all();
        }
        else
        {
            this.set_selected(true);
            root_comp._select_all();
        }
        root_comp.redraw();
    };

    _pSelectAllCheckBoxControl._apply_setfocus = function (evt_name)
    {
        if (!this._p_parent._is_subcontrol && this._p_parent._status == "focused")
        {
            nexacro.Component.prototype._apply_setfocus.call(this, evt_name);
        }
    };

    //===============================================================
    // nexacro._SelectAllCheckBoxControl : Properties
    //===============================================================
    _pSelectAllCheckBoxControl.set_selected = function (v)
    {
        if (v != this._p_selected)
        {
            this._p_selected = v;
            this.on_apply_selected();
        }
    };

    _pSelectAllCheckBoxControl.on_apply_selected = function ()
    {
        var bfocused = this._p_parent._statusmap ? this._p_parent._statusmap['focused'] : false;
        if (this._p_selected)
        {
            this._changeUserStatus("selected", true);
            if (bfocused)
                this._changeStatus("focused", true);
        }
        else
        {
            if (this._status == "focused")
            {
                this._changeStatus("focused", false);
            }

            this._changeUserStatus("selected", false);
        }
    };

    //===============================================================
    // nexacro._SelectAllCheckBoxControl : Methods
    //===============================================================

    //===============================================================
    // nexacro._SelectAllCheckBoxControl : Events
    //===============================================================

    //===============================================================
    // nexacro._SelectAllCheckBoxControl : Logical part
    //===============================================================

    //===============================================================
    // nexacro._SelectAllCheckBoxControl : Util Function
    //===============================================================

    _pSelectAllCheckBoxControl = null;

    //==============================================================================
    // nexacro._MultiComboListControl
    //==============================================================================
    nexacro._MultiComboListControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pMultiComboListControl = nexacro._createPrototype(nexacro.Component, nexacro._MultiComboListControl);
    nexacro._MultiComboListControl.prototype = _pMultiComboListControl;
    _pMultiComboListControl._type_name = "MultiComboListControl";

    /* default properties */
    _pMultiComboListControl._p_index = "";
    _pMultiComboListControl._p_value = undefined;

    /* internal variable */
    _pMultiComboListControl._is_subcontrol = true;

    /* status */

    /* event list */
    _pMultiComboListControl._event_list = {
        "onclick": 1, "ondblclick": 1,
        "onitemclick": 1, "onitemdblclick": 1,
        "onflingstart": 1, "onfling": 1, "onflingend": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onlongpress": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmove": 1,
        "onmousedown": 1, "onmouseup": 1, "oncloseup": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
        "oncontextmenu": 1,
        "onrbuttondown": 1, "onrbuttonup": 1
    };

    //===============================================================
    // nexacro._MultiComboListControl : Create & Update
    //===============================================================

    _pMultiComboListControl.on_fire_oncloseup = function (obj, preindex, pretext, prevalue, postindex, posttext, postvalue, is_select)
    {
        var checkboxset = this.checkboxset;
        if (checkboxset)
        {
            var rowobj = checkboxset._get_rowobj_status("mouseover", "status");
            if (rowobj)
            {
                rowobj._changeStatus("mouseover", false);
            }
        }

        if (this.oncloseup && this.oncloseup._has_handlers)
        {
            return this.oncloseup._fireEvent(this);
        }

        return false;
    };

    _pMultiComboListControl.on_destroy_contents = function ()
    {
        if (this.multicomboedit)
        {
            this.multicomboedit.destroy();
            this.multicomboedit = null;
        }

        if (this.selectallcheckbox)
        {
            this.selectallcheckbox.destroy();
            this.selectallcheckbox = null;
        }

        if (this.checkboxset)
        {
            this.checkboxset.destroy();
            this.checkboxset = null;
        }
    };

    _pMultiComboListControl.on_create_contents_command = function ()
    {
        var str = "";

        if (this.multicomboedit)
        {
            str += this.multicomboedit.createCommand();
        }

        if (this.selectallcheckbox)
        {
            str += this.selectallcheckbox.createCommand();
        }

        if (this.checkboxset)
        {
            str += this.checkboxset.createCommand();
        }

        return str;
    };

    _pMultiComboListControl.on_getIDCSSSelector = function ()
    {
        return "multicombolist";
    };

    _pMultiComboListControl.on_change_containerRect = function (width, height)
    {
        this._recalcLayout();
    };

    //===============================================================
    // nexacro._MultiComboListControl : Override
    //===============================================================
    _pMultiComboListControl.on_apply_prop_enable = function (v)
    {
        if (this.multicomboedit)
        {
            this.multicomboedit._setEnable(v);
        }
        if (this.selectallcheckbox)
        {
            this.selectallcheckbox._setEnable(v);
        }
        if (this.checkboxset)
        {
            this.checkboxset._setEnable(v);
        }
    };

    _pMultiComboListControl._setScrollMaxPos = function ()
    {
        return;
    }

    _pMultiComboListControl._createPopupEditControl = function ()
    {
        var multicombo = this._p_parent;
        var multicomboedit = this.multicomboedit;
        if (!multicomboedit)
        {
            multicomboedit = this.multicomboedit = new nexacro._MultiComboEditControl("multicomboedit", 0, 0, 0, 0, null, null, null, null, null, null, this);

            multicomboedit.set_usecontextmenu(multicombo._p_usecontextmenu);

            multicomboedit._setPopupContains(true);
            multicomboedit.createComponent(true);
        }
    };

    _pMultiComboListControl._createCheckBoxSetControl = function (ds)
    {
        var multicombo = this._p_parent;
        var datacol = multicombo._p_datacolumn;
        var codecol = multicombo._p_codecolumn;
        var readonlycol = multicombo._p_readonlycolumn;
        var checkboxset = this.checkboxset;
        if (!checkboxset)
        {
            checkboxset = this.checkboxset = new nexacro._MultiComboCheckBoxSetControl("checkboxset", 0, 0, 0, 0, null, null, null, null, null, null, this);

            checkboxset.set_scrolltype("vertical");
            var vscrollbartype = this._getVScrollBarType() || "auto";

            checkboxset.set_scrollbartype("none " + vscrollbartype);
            checkboxset.setInnerDataset(ds);
            checkboxset.set_codecolumn(codecol);
            checkboxset.set_datacolumn(datacol);
            checkboxset.set_readonlycolumn(readonlycol);
            checkboxset.set_index(multicombo._p_index);
            checkboxset.set_itemheight(multicombo._p_itemheight);
            checkboxset.set_cssclass(multicombo._p_cssclass);
            checkboxset.set_scrollbarbarminsize(multicombo._p_scrollbarbarminsize);
            checkboxset.set_scrollbardecbuttonsize(multicombo._p_scrollbardecbuttonsize);
            checkboxset.set_scrollbarbaroutsize(multicombo._p_scrollbarbaroutsize);
            checkboxset.set_scrollbarincbuttonsize(multicombo._p_scrollbarincbuttonsize);
            checkboxset.set_scrollbarsize(multicombo._p_scrollbarsize);
            checkboxset.set_scrollbartrackbarsize(multicombo._p_scrollbartrackbarsize);

            checkboxset._setPopupContains(true);
            checkboxset.createComponent(true);
        }
        else
        {
            if (checkboxset._is_created)
            {
                if (checkboxset._innerdataset != ds)
                {
                    checkboxset.setInnerDataset(ds);
                }
            }
        }
    };

    _pMultiComboListControl._createSelectAllCheckBoxControl = function (ds)
    {
        var selectallcheckbox = this.selectallcheckbox;
        if (!selectallcheckbox)
        {
            selectallcheckbox = this.selectallcheckbox = new nexacro._SelectAllCheckBoxControl("selectallcheckbox", 0, 0, 0, 0, null, null, null, null, null, null, this);

            selectallcheckbox.set_text(nexacro._toString("SELECT ALL"));
            selectallcheckbox._setPopupContains(true);
            selectallcheckbox.createComponent(true);
        }
    };

    _pMultiComboListControl._createdPopupEditControl = function ()
    {
        var multicomboedit = this.multicomboedit;
        if (multicomboedit && !multicomboedit._is_created)
        {
            multicomboedit.on_created();
            this._setEventHandlerToMultiComboEdit();
        }
    };

    _pMultiComboListControl._createdCheckBoxSetControl = function (ds)
    {
        var checkboxset = this.checkboxset;
        if (checkboxset && !checkboxset._is_created)
        {
            this._setEventHandler("oncloseup", this._p_parent._on_list_oncloseup, this._p_parent);
            checkboxset._setEventHandler("onitemclick", this._p_parent._on_list_onitemclick, this._p_parent);

            checkboxset.on_created();
        }
    };

    _pMultiComboListControl._createdSelectAllCheckBoxControl = function (ds)
    {
        var selectallcheckbox = this.selectallcheckbox;
        if (selectallcheckbox && !selectallcheckbox._is_created)
        {
            selectallcheckbox.on_created();
        }
    };

    _pMultiComboListControl._setEventHandlerToMultiComboEdit = function ()
    {
        var multicomboedit = this.multicomboedit;
        if (multicomboedit)
        {
            var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);
            if (bMobile)
            {
                multicomboedit._setEventHandler("oneditclick", this._p_parent._on_edit_mobile_oneditclick, this._p_parent);
                this._setEventHandler("onkeydown", this._p_parent._on_edit_onkeydown, this._p_parent);
                this._setEventHandler("onkeyup", this._p_parent._on_edit_onkeyup, this._p_parent);
            }
            else
            {
                multicomboedit._setEventHandler("oneditclick", this._p_parent._on_edit_oneditclick, this._p_parent);
                multicomboedit._setEventHandler("onkeydown", this._p_parent._on_edit_onkeydown, this._p_parent);
                multicomboedit._setEventHandler("onkeyup", this._p_parent._on_edit_onkeyup, this._p_parent);
            }


            multicomboedit._setEventHandler("oninput", this._p_parent._on_edit_oninput, this._p_parent);
            //multicomboedit._setEventHandler("onlbuttonup", this.on_notify_edit_onlbuttonup, this);
            //multicomboedit._setEventHandler("ontouchstart", this.on_notify_edit_ontouchstart, this);
        }
    };

    //===============================================================
    // nexacro._MultiComboListControl : Properties
    //===============================================================
    _pMultiComboListControl.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_readonly != v)
        {
            this._p_readonly = v;
            this.on_apply_readonly(v);
        }
    };

    _pMultiComboListControl.on_apply_readonly = function (readonly)
    {
        this._changeStatus("readonly", readonly);

        var multicomboedit = this.multicomboedit;
        if (multicomboedit)
        {
            multicomboedit.set_readonly(readonly);
        }

        var selectallcheckbox = this.selectallcheckbox;
        if (selectallcheckbox)
        {
            selectallcheckbox.set_readonly(readonly);
        }

        var checkboxset = this.checkboxset;
        if (checkboxset)
        {
            checkboxset.set_readonly(readonly);
        }
    };

    //===============================================================
    // nexacro._MultiComboListControl : Methods
    //===============================================================

    //===============================================================
    // nexacro._MultiComboListControl : Events
    //===============================================================
    _pMultiComboListControl.on_focus_basic_action = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        var multicombo = this._p_parent;
        if (multicombo)
        {
            if (this._env._p_enableaccessibility)
            {
                multicombo._setAccessibilityStatFocus(evt_name);
            }

            multicombo._apply_setfocus(evt_name);
        }
    };

    //===============================================================
    // nexacro._MultiComboListControl : Logical part
    //===============================================================
    _pMultiComboListControl._recalcLayout = function ()
    {
        if (this._is_created_contents)
        {
            var checkboxset = this.checkboxset;
            var multicomboedit = this.multicomboedit;
            var selectallcheckbox = this.selectallcheckbox;

            var client_width = this._getClientWidth();
            var client_height = this._getClientHeight();

            var edit_height = 0
            var selectall_height = 0;

            if (multicomboedit)
            {
                if (this._p_parent._p_type != "dropdown" && (this._p_parent._p_edittype == "text" || this._p_parent._p_edittype == "count"))
                {
                    var text_height = checkboxset._getTextHeight();

                    var edit_paddingsize = multicomboedit._getCurrentStylePadding();
                    edit_paddingsize = edit_paddingsize ? edit_paddingsize.top + edit_paddingsize.bottom : 0;

                    var edit_bordersize = multicomboedit._getCurrentStyleBorder();
                    edit_bordersize = edit_bordersize ? edit_bordersize._getBorderHeight() : 0;

                    edit_height = text_height + edit_paddingsize + edit_bordersize;

                    multicomboedit.move(0, 0, client_width, edit_height);
                }
            }

            if (selectallcheckbox)
            {
                if (this._p_parent._p_selectallcheckboxheight != undefined)
                    selectall_height = this._p_parent._p_selectallcheckboxheight;
                else
                    selectall_height = selectallcheckbox._on_getFitSize()[1];

                selectallcheckbox.move(0, edit_height, client_width, selectall_height);
            }

            if (checkboxset)
            {
                checkboxset.move(0, edit_height + selectall_height, client_width, client_height - edit_height - selectall_height);
            }
        }
    }

    //===============================================================
    // nexacro._MultiComboListControl : Util Function
    //===============================================================

    _pMultiComboListControl = null;
}