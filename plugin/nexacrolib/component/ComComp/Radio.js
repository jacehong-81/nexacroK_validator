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

if (!nexacro.Radio)
{
    //==============================================================================
    // nexacro.RadioClickEventInfo
    //==============================================================================
    nexacro.RadioClickEventInfo = function (obj, id, index, itemText, itemValue, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, meta_key)
    {
        nexacro.ClickEventInfo.call(this, obj, id || "onradioclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, meta_key);

        this.index = index;
        this.itemtext = itemText;
        this.itemvalue = itemValue;
    };

    var _pRadioClickEventInfo = nexacro._createPrototype(nexacro.ClickEventInfo, nexacro.RadioClickEventInfo);
    nexacro.RadioClickEventInfo.prototype = _pRadioClickEventInfo;
    _pRadioClickEventInfo._type_name = "RadioClickEventInfo";

    _pRadioClickEventInfo = null;

    //==============================================================================
    // nexacro.Radio
    //==============================================================================
    nexacro.Radio = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._items = [];
        this._iconsize = {};
    };

    var _pRadio = nexacro._createPrototype(nexacro.Component, nexacro.Radio);
    nexacro.Radio.prototype = _pRadio;
    _pRadio._type_name = "Radio";

    /* element */
    _pRadio._text_elem = null;

    /* default properties */
    _pRadio._p_codecolumn = "";
    _pRadio._p_columncount = 0;
    _pRadio._p_datacolumn = "";
    _pRadio._p_direction = "horizontal";
    _pRadio._p_index = -1;
    _pRadio._p_innerdataset = null;
    _pRadio._p_readonly = false;
    _pRadio._p_rowcount = 0;
    _pRadio._p_value = undefined;
    _pRadio._p_text = "";
    _pRadio._p_acceptvaluetype = "allowinvalid";   //allowinvalid | ignoreinvalid

    /* internal variable */
    _pRadio._default_value = undefined;
    _pRadio._default_text = "";
    _pRadio._default_index = -1;
    _pRadio._want_arrows = true;
    _pRadio._is_listtype = true;
    /* status */
    _pRadio._use_readonly_status = true;

    _pRadio._p_accessibilityrole = "radio";

    /* accessibility */
    _pRadio._is_first_focus = false;
    _pRadio._accessibility_index = -1;
    _pRadio.accessibility = null;
    _pRadio.itemaccessibility = null;
    _pRadio._p_itemaccessibilityenable = true;

    /* event list */
    _pRadio._event_list =
    {
        "onclick": 1, "ondblclick": 1,
        "onkeypress": 1, "onkeydown": 1, "onkeyup": 1,
        "onkillfocus": 1, "onsetfocus": 1,
        "ondrag": 1, "ondrop": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondragend": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmove": 1, "onsize": 1,
        "onitemclick": 1, "onitemchanged": 1, "canitemchange": 1, "oninnerdatachanged": 1, "onmousedown": 1, "onmouseup": 1,
        "oncontextmenu": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1
    };

    //===============================================================
    // nexacro.Radio : Create & Destroy & Update
    //===============================================================
    _pRadio.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            if (!this._p_innerdataset)
            {
                this._createRadioTextElement();
            }
            else
                this._redrawRadioItem();

            if (this._p_fittocontents != "none")
                this._on_apply_fittocontents();
        }
    };

    _pRadio.on_created_contents = function (win)
    {
        if (!this._innerdataset && this._p_innerdataset)
        {
            this._setInnerDatasetStr(this._p_innerdataset);
        }

        if (this._p_fittocontents != "none")
        {
            this._update_position();
            //this._on_apply_fittocontents();
        }

        var text_elem = this._text_elem;
        if (text_elem)
        {
            text_elem.create(win);
        }

        var items = this._items;
        var item_len = items.length;
        for (var i = 0; i < item_len; i++)
        {
            items[i].on_created(win);
        }

        //this._setEventHandler("onkeydown", this._on_radio_onkeydown, this);

        if (this._env._p_enableaccessibility)
        {
            this._on_created_accessibility_contents(win);
        }
    };

    _pRadio.on_destroy_contents = function ()
    {
        this._destroyRadioTextElement();
        this._destroyRadioItemControl();

        this._removeEventHandlerToInnerDataset();
    };

    _pRadio._removeEventHandlerToInnerDataset = function ()
    {
        if (this._innerdataset)
        {
            this._innerdataset._removeEventHandler("onvaluechanged", this._on_dataset_onvaluechanged, this);
            this._innerdataset._removeEventHandler("onrowsetchanged", this._on_dataset_onrowsetchanged, this);
            this._innerdataset = null;
        }
    };

    _pRadio.on_create_contents_command = function ()
    {
        if (!this._innerdataset && this._p_innerdataset)
        {
            this._setInnerDatasetStr(this._p_innerdataset);
        }

        var str = "";
        var text_elem = this._text_elem;
        if (text_elem)
        {
            str += text_elem.createCommand();
        }

        var items = this._items;
        var item_len = items.length;
        for (var i = 0; i < item_len; i++)
        {
            str += items[i].createCommand();
        }
        return str;
    };

    _pRadio.on_attach_contents_handle = function (win)
    {
        var text_elem = this._text_elem;
        if (text_elem)
        {
            text_elem.attachHandle(win);
        }

        var items = this._items;
        var item_len = items.length;
        for (var i = 0; i < item_len; i++)
        {
            items[i].attachHandle(win);
        }

        if (this._p_fittocontents != "none")
        {
            this._update_position();
            this._on_apply_fittocontents();
        }

        //this._setEventHandler("onkeydown", this._on_radio_onkeydown, this);

        if (this._env._p_enableaccessibility)
        {
            this._on_attach_accessibility_contents_handle(win);
        }
    };

    _pRadio.on_change_containerRect = function (width, height)
    {
        if (this._is_created_contents)
        {
            var textElem = this._text_elem;
            if (textElem)
            {
                textElem.setElementSize(width, height);
            }
            else
            {
                this._recalcLayout();
            }
        }
    };

    _pRadio.on_change_containerPos = function (/*left, top*/)
    {
        //
    };

    //===============================================================
    // nexacro.Radio : Override
    //===============================================================
    _pRadio.on_getBindableProperties = function ()
    {
        return "value";
    };

    _pRadio.on_apply_prop_cssclass = function ()
    {
        var radioitems = this._items;
        if (radioitems)
        {
            var item_len = radioitems.length;
            for (var i = 0; i < item_len; i++)
            {
                radioitems[i].on_apply_cssclass();
            }
        }
    };

    _pRadio.on_apply_prop_enable = function (enable)
    {
        var radioitems = this._items;
        if (radioitems)
        {
            var item_len = radioitems.length;
            for (var i = 0; i < item_len; i++)
            {
                radioitems[i]._setEnable(enable);
            }
        }
    };

    _pRadio.on_init_bindSource = function (columnid, propid, ds)
    {
        if (propid == "value")
        {
            this._p_value = undefined;
            this._p_text = "";
            this._p_index = -1;

            this._doDeselect(this._p_index);
        }
    };

    _pRadio.on_change_bindSource = function (propid, ds, row, col)
    {
        if (propid == "value")
        {
            var val = ds.getColumn(row, col);
            val = this._convertValueType(val, true);

            this._setValue(val);

            var inner_ds = this._innerdataset;
            if (!inner_ds) return true;

            var post_index = inner_ds.findRow(this._p_codecolumn, val);

            this._block_read_aria_stat = true;
            this._doDeselect(this._p_index);

            this._setIndex(post_index);
            this._doSelect(post_index);

            if (!this._select_act)
            {
                this._default_value = val;
                this._default_index = post_index;
            }
            this._block_read_aria_stat = false;
        }
    };

    _pRadio._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var _want_arrows = this._want_arrows;
        if (keycode == nexacro.Event.KEY_DOWN || keycode == nexacro.Event.KEY_UP)
        {
            _want_arrows = (!this._env_p_enableaccessibility || !this._env._p_accessibilitycontentsearchkey);
        }

        return { want_tab: false, want_return: false, want_escape: false, want_chars: false, want_arrows: _want_arrows };
    };

    _pRadio._on_focus = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        var retn = false;
        var focusdir = this._focus_direction;

        // on_focus를 직접 호출하는 경우
        if (evt_name == "tabkey") focusdir = 0;
        else if (evt_name == "shifttabkey") focusdir = 1;
        else if (evt_name == "downkey") focusdir = 2;
        else if (evt_name == "upkey") focusdir = 3;

        if (self_flag == false)
        {
            retn = nexacro.Component.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);

            var item = null;
            if (focusdir == 0 || focusdir == 1)   //tab, shifttab
            {
                // tab키도 방향키처럼 동작하는 스펙이 존재 하나 검토하여 실적용 여부 판단해야함 
                var index = this._env._p_enableaccessibility && this._p_index == -1 ? 0 : this._p_index;
                item = this._getItem(index);
                if (item)
                {
                    this._is_first_focus = true;
                    this._accessibility_index = this._p_index;
                    item._on_focus(true, evt_name);  // 가상커서만 이동
                }
            }
            else if (this._env._p_enableaccessibility && (focusdir == 2 || focusdir == 3)) // down,up key (accessibility)
            {
                // 가상커서가 개입하면 focusin 에서 index 처리
                if (this._isComponentKeydownAction())
                {
                    var accIdx = this._accessibility_index;
                    if (focusdir == 2)
                    {
                        if (!this._isAccessibilityEnable())
                        {
                            this._is_first_focus = true;
                            accIdx = 0;
                            item = this._getItem(accIdx);
                        }
                    }
                    else
                    {
                        if (!this._isComponentKeydownAction() && this._isItemAccessibilityEnable())
                        {
                            accIdx = this._items.length - 1;
                            item = this._getItem(accIdx);
                        }
                    }

                    if (item)
                    {
                        this._accessibility_index = accIdx;
                        item._on_focus(true, evt_name);
                    }
                }
            }
        }
        else
        {
            retn = nexacro.Component.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);
        }
        return retn;
    };

    _pRadio._on_getFitSize = function ()
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

            var ds = this._innerdataset;
            var items = this._items;
            var item_len = items.length;
            if (ds && item_len)
            {
                var dir = this._p_direction;
                var priority_matrix;

                var radio_columncount = this._p_columncount;
                var radio_rowcount = this._p_rowcount;
                var ds_rowcount = ds.getRowCount();
                var apply_colcnt = 0;
                var apply_rowcnt = 0;

                var i, j;
                var item_size;
                var item_index = 0;

                if (radio_columncount == -1 && radio_rowcount == -1)
                {
                    for (i = 0; i < item_len; i++)
                    {
                        item_size = items[i]._on_getFitSize();
                        if (dir == "horizontal")
                        {
                            total_h = Math.max(total_h, item_size[1]);
                            total_w += item_size[0];
                        }
                        else
                        {
                            total_h += item_size[1];
                            total_w = Math.max(total_w, item_size[0]);
                        }
                    }
                }
                else
                {
                    if (dir == "horizontal")
                    {
                        priority_matrix = "col";

                        if (radio_columncount > 0)
                        {
                            apply_colcnt = radio_columncount;
                        }
                        else if ((radio_columncount == -1 && (radio_rowcount == -1 || radio_rowcount == 0)) ||
                            (radio_columncount == 0 && (radio_rowcount == 0 || radio_rowcount == ds_rowcount)))
                        {
                            apply_colcnt = 1;
                        }
                        else if (radio_columncount == -1 && radio_rowcount > 1)
                        {
                            // radio_rowcount 2부터 round 의미가 있음
                            apply_colcnt = Math.round(ds_rowcount / radio_rowcount);
                        }
                        else if (radio_rowcount > 0)
                        {
                            apply_colcnt = Math.ceil(ds_rowcount / radio_rowcount);
                            if ((apply_colcnt * radio_rowcount) < ds_rowcount)
                            {
                                // item 표시 계산이 dataset row보다 적을때
                                apply_colcnt++;
                                //apply_rowcnt = (((apply_colcnt * radio_rowcount) - ds_rowcount) >= apply_colcnt) ? radio_rowcount - 1 : radio_rowcount;
                            }
                        }
                        else
                        {
                            apply_colcnt = ds_rowcount;
                        }

                        if (apply_colcnt > ds_rowcount)
                        {
                            apply_colcnt = ds_rowcount;
                        }

                        apply_rowcnt = parseInt(ds_rowcount / apply_colcnt) | 0;

                        if ((ds_rowcount > apply_colcnt) && (ds_rowcount % apply_colcnt) > 0)
                        {
                            apply_rowcnt++;
                        }
                    }
                    else
                    {
                        // vertical
                        if (radio_rowcount > 0)
                        {
                            apply_rowcnt = radio_rowcount;
                        }
                        else if (radio_columncount > 0)
                        {
                            apply_rowcnt = parseInt(ds_rowcount / radio_columncount);
                            if ((radio_columncount * apply_rowcnt) < ds_rowcount)
                            {
                                // item 표시 계산이 dataset row보다 적을때
                                apply_rowcnt++;
                                //apply_colcnt = (((radio_columncount * apply_rowcnt) - ds_rowcount) >= apply_rowcnt) ? radio_columncount - 1 : radio_columncount;
                            }
                        }
                        else
                        {
                            apply_rowcnt = 1;
                        }

                        if (apply_rowcnt > 0)
                        {
                            priority_matrix = "row";
                            apply_colcnt = parseInt(ds_rowcount / apply_rowcnt) | 0;
                        }
                        else
                        {
                            priority_matrix = "col";
                            apply_colcnt = radio_columncount;
                        }

                        if (apply_colcnt <= 0)
                        {
                            apply_colcnt = 1;
                        }
                        if (priority_matrix == "row" && (ds_rowcount > apply_rowcnt) && (ds_rowcount % apply_rowcnt) > 0)
                        {
                            apply_colcnt++;
                        }
                    }

                    var maxsize_col = [];
                    for (i = 0; i < apply_colcnt; i++)
                        maxsize_col[i] = 0;

                    if (priority_matrix == "col")
                    {
                        for (i = 0; i < apply_rowcnt; i++)
                        {
                            for (j = 0; j < apply_colcnt; j++)
                            {
                                if (ds_rowcount <= item_index)
                                {
                                    break;
                                }

                                item_size = items[item_index]._on_getFitSize();
                                if (maxsize_col[j] < item_size[0])
                                    maxsize_col[j] = item_size[0];

                                item_index++;
                            }
                        }
                    }
                    else
                    {
                        for (i = 0; i < apply_colcnt; i++)
                        {
                            for (j = 0; j < apply_rowcnt; j++)
                            {
                                if (ds_rowcount <= item_index)
                                {
                                    break;
                                }

                                item_size = items[item_index]._on_getFitSize();
                                if (maxsize_col[i] < item_size[0])
                                    maxsize_col[i] = item_size[0];

                                item_index++;
                            }
                        }
                    }

                    for (i = 0; i < apply_colcnt; i++)
                    {
                        total_w += maxsize_col[i];
                    }
                    if (item_size)
                        total_h += item_size[1] * apply_rowcnt;
                }
            }

            return [total_w, total_h];
        }

        return [this._adjust_width, this._adjust_height];
    };

    _pRadio.on_apply_prop_stringresource = function ()
    {
        if (!nexacro._StringResource)
            return;

        nexacro.Component.prototype.on_apply_prop_stringresource.call(this);

        this._redrawRadioItem();
    };

    //==============================================================================
    // nexacro.Radio : Properties
    //===============================================================
    _pRadio.set_text = nexacro._emptyFn;


    _pRadio._convertValueType = function (v, bapplyrule)
    {
        var ret;
        if (bapplyrule)
            ret = nexacro.Component.prototype._convertValueType.call(this, v);
        else
            ret = nexacro._isNull(v) ? v : nexacro._toString(v);

        return ret;

    };

    _pRadio.set_value = function (v)
    {
        //v = nexacro._isNull(v) ? v : nexacro._toString(v);
        v = this._convertValueType(v);

        if (this._p_value != v)
        {
            if (this._p_acceptvaluetype == "ignoreinvalid")
            {
                var ds = this._innerdataset;
                var code = this._p_codecolumn;
                var index = -1;
                if (ds && code)
                {
                    //var text = "";
                    index = ds.findRow(code, v);
                    if (index < 0)
                        return;
                }
            }

            this._select_act = true;
            if (!this.applyto_bindSource("value", v))
            {
                this._select_act = false;
                return;
            }
            this._select_act = false;

            this._p_value = v;
            this.on_apply_value(v);
        }
    };
    _pRadio.updateToDataset = function ()
    {
        return this.applyto_bindSource("value", this._p_value);
    };
    _pRadio.on_apply_value = function (value)
    {
        var ds = this._innerdataset;
        var code = this._p_codecolumn;
        if (ds && code)
        {
            //var text = "";
            var index = ds.findRow(code, value);

            this._setIndex(index);
            this._block_read_aria_stat = true;
            this._doDeselect(this._default_index);
            this._doSelect(index);
            this._block_read_aria_stat = false;

            if (index >= 0)
                this._default_value = value;

            this._default_index = this._p_index;
        }
    };

    _pRadio.set_index = function (v)
    {
        if (isNaN(v = +v) || v < -1)
        {
            return;
        }

        if (this._p_index != v)
        {
            this._p_index = v;
            this.on_apply_index(v);
        }
    };

    _pRadio.on_apply_index = function (index)
    {
        var ds = this._innerdataset;
        var code = this._p_codecolumn ? this._p_codecolumn : this._p_datacolumn;
        var val;
        if (ds && code)
        {
            if (!nexacro._isNull(index) && index >= 0 && index < ds.getRowCount())
            {
                val = ds.getColumn(index, code);
                val = this._convertValueType(val, true);
            }
            else
            {
                index = this._p_index = -1;
                //val = undefined;
            }
            //var text = "";

            if (this._p_value != val)
            {
                this._select_act = true;
                if (!this.applyto_bindSource("value", val))
                {
                    this._p_index = this._default_index;
                    this._select_act = false;
                    return;
                }
                this._select_act = false;

                this._setValue(val);
            }

            this._doDeselect(this._default_index);
            this._doSelect(index);

            this._default_value = val;
            //this._default_text = text;
            this._default_index = index;

            if (this._isAccessibilityEnable())
                this.on_apply_accessibility();
        }
    };

    _pRadio.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_readonly != v)
        {
            this._p_readonly = v;
            this.on_apply_readonly(v);
        }
    };

    _pRadio.on_apply_readonly = function (readonly)
    {
        var items = this._items;
        var item_len = items.length;
        var bReadonly = readonly ? true : false;

        this._changeStatus("readonly", bReadonly);

        for (var i = 0; i < item_len; i++)
        {
            items[i]._changeStatus("readonly", bReadonly);
        }
    };

    _pRadio.set_datacolumn = function (v)
    {
        if (this._p_datacolumn != v)
        {
            this._p_datacolumn = v;
            this.on_apply_datacolumn(v);
        }
    };

    _pRadio.on_apply_datacolumn = function (datacolumn)
    {
        var control_elem = this.getElement();
        var ds = this._innerdataset;
        if (control_elem && ds)
        {
            var val;
            var data = datacolumn == "" ? this._p_codecolumn : datacolumn;

            var i, n;
            var items = this._items;
            for (i = 0, n = items.length; i < n; i++)
            {
                val = ds.getColumn(i, data);
                if (val)
                {
                    items[i].set_text(val);
                    if (this._p_index == i)
                    {
                        this._setText(val);
                    }
                }
                else
                {
                    items[i].set_text("");
                    this._setText("");
                }
            }
            this._updateItemInfo();
        }
    };

    _pRadio.set_codecolumn = function (v)
    {
        if (this._p_codecolumn != v)
        {
            this._p_codecolumn = v;
            this.on_apply_codecolumn(v);
        }
    };

    _pRadio.on_apply_codecolumn = function (codecolumn)
    {
        var control_elem = this.getElement();
        var ds = this._innerdataset;
        if (control_elem && ds)
        {
            this.on_apply_index(this._p_index);

            if (!this._p_datacolumn)
                this.on_apply_datacolumn(this._p_datacolumn);

            this._updateItemInfo();
        }
    };

    _pRadio.set_innerdataset = function (v)
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

    _pRadio.on_apply_innerdataset = function (ds)
    {
        if (ds)
        {
            ds._setEventHandler("onvaluechanged", this._on_dataset_onvaluechanged, this);
            ds._setEventHandler("onrowsetchanged", this._on_dataset_onrowsetchanged, this);
        }

        var control_elem = this.getElement();
        if (control_elem)
        {
            this._destroyRadioItemControl();

            if (ds)
            {
                this._redrawRadioItem();
                if (this._p_index < 0)
                    this._default_value = this._p_value = undefined;
            }
            else
            {
                this._createRadioTextElement();
            }
        }
    };

    _pRadio.set_columncount = function (v)
    {
        if (isNaN(v = +v) || v < -1)
        {
            return;
        }

        if (this._p_columncount != v)
        {
            this._p_columncount = v;
            this.on_apply_columncount(v);
        }
    };

    _pRadio.on_apply_columncount = function (/*columncnt*/)
    {
        this._recalcLayout();
    };

    _pRadio.set_rowcount = function (v)
    {
        if (isNaN(v = +v) || v < -1)
        {
            return;
        }

        if (this._p_rowcount != v)
        {
            this._p_rowcount = v;
            this.on_apply_rowcount(v);
        }
    };

    _pRadio.on_apply_rowcount = function (/*rowcnt*/)
    {
        this._recalcLayout();
    };

    _pRadio.set_direction = function (v)
    {
        var direction_enum = ["horizontal", "vertical"];
        if (direction_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_direction != v)
        {
            this._p_direction = v;
            this.on_apply_direction(v);
        }
    };

    _pRadio.on_apply_direction = function (/*dir*/)
    {
        this._recalcLayout();
    };

    _pRadio.set_itemaccessibilityrole = function (val)
    {
        if (val)
        {
            this._p_itemaccessibilityrole = val;
            this.on_apply_itemaccessibilityrole(val);
        }
        else
        {
            this._p_itemaccessibilityrole = "";
            this.on_apply_itemaccessibilityrole(" ");
        }
    };

    _pRadio.on_apply_itemaccessibilityrole = function (val)
    {
        var items = this._items;
        if (items)
        {
            var rowcount = items.length;
            for (var i = 0; i < rowcount; i++)
            {
                items[i].set_accessibilityrole(val ? val : this._p_itemaccessibilityrole);
            }
        }
    };

    _pRadio.set_itemaccessibilitylabel = function (val)
    {
        if (val)
        {
            this._p_itemaccessibilitylabel = val;
            this.on_apply_itemaccessibilitylabel(val);
        }
        else
        {
            this._p_itemaccessibilitylabel = "";
            this.on_apply_itemaccessibilitylabel(" ");
        }
    };

    _pRadio.on_apply_itemaccessibilitylabel = function (val)
    {
        var items = this._items;
        if (items)
        {
            var rowcount = items.length;
            for (var i = 0; i < rowcount; i++)
            {
                items[i].set_accessibilitylabel(val ? val : this._p_itemaccessibilitylabel);
            }
        }
    };
    /*
    _pRadio.set_itemaccessibilityenable = function (val)
    {
        if (val)
        {
            this._p_itemaccessibilityenable = val;
            this.on_apply_itemaccessibilityenable(val);
        }
        else
        {
            this._p_itemaccessibilityenable = true;
            this.on_apply_itemaccessibilityenable(true);
        }
    };
   
    _pRadio.on_apply_itemaccessibilityenable = function (val)
    {
        var items = this._items;
        if (items)
        {
            var rowcount = items.length;
            for (var i = 0; i < rowcount; i++)
            {
                items[i].set_accessibilityenable(val ? val : this._p_itemaccessibilityenable);
            }
        }
    };
     */
    _pRadio.set_itemaccessibilitydescription = function (val)
    {
        if (val)
        {
            this._p_itemaccessibilitydescription = val;
            this.on_apply_itemaccessibilitydescription(val);
        }
        else
        {
            this._p_itemaccessibilitydescription = "";
            this.on_apply_itemaccessibilitydescription(" ");
        }
    };

    _pRadio.on_apply_itemaccessibilitydescription = function (val)
    {
        var items = this._items;
        if (items)
        {
            var rowcount = items.length;
            for (var i = 0; i < rowcount; i++)
            {
                items[i].set_accessibilitydescription(val ? val : this._p_itemaccessibilitydescription);
            }
        }
    };

    _pRadio.set_itemaccessibilityaction = function (val)
    {
        if (val)
        {
            this._p_itemaccessibilityaction = val;
            this.on_apply_itemaccessibilityaction(val);
        }
        else
        {
            this._p_itemaccessibilityaction = "";
            this.on_apply_itemaccessibilityaction(" ");
        }
    };

    _pRadio.on_apply_itemaccessibilityaction = function (val)
    {
        var items = this._items;
        if (items)
        {
            var rowcount = items.length;
            for (var i = 0; i < rowcount; i++)
            {
                items[i].set_accessibilityaction(val ? val : this._p_itemaccessibilityaction);
            }
        }
    };

    _pRadio.set_itemaccessibilitydesclevel = function (val)
    {
        if (val)
        {
            this._p_itemaccessibilitydesclevel = val;
            this.on_apply_itemaccessibilitydesclevel(val);
        }
        else
        {
            this._p_itemaccessibilitydesclevel = "";
            this.on_apply_itemaccessibilitydesclevel(" ");
        }
    };

    _pRadio.on_apply_itemaccessibilitydesclevel = function (val)
    {
        var items = this._items;
        if (items)
        {
            var rowcount = items.length;
            for (var i = 0; i < rowcount; i++)
            {
                items[i].set_accessibilitydesclevel(val ? val : this._p_itemaccessibilitydesclevel);
            }
        }
    };

    _pRadio.set_acceptvaluetype = function (v)
    {
        var type_enum = ["allowinvalid", "ignoreinvalid"];

        if (type_enum.indexOf(v) == -1)
        {
            return;
        }
        this._p_acceptvaluetype = v;
    };

    _pRadio._properties = [{ name: "text" }, { name: "value" }, { name: "index" }, { name: "readonly" }, { name: "datacolumn" }, { name: "codecolumn" }, { name: "innerdataset" }, { name: "columncount" }, { name: "rowcount" }, { name: "direction" }, { name: "itemaccessibilityrole" }, { name: "itemaccessibilitylabel" }, { name: "itemaccessibilityenable" }, { name: "itemaccessibilitydescription" }, { name: "itemaccessibilityaction" }, { name: "itemaccessibilitydesclevel" }, { name: "acceptvaluetype" }];
    nexacro._defineProperties(_pRadio, _pRadio._properties);

    //===============================================================
    // nexacro.Radio : Methods
    //===============================================================
    _pRadio.getCount = function ()
    {
        return this._items.length;
    };

    _pRadio.getInnerDataset = function ()
    {
        return this._innerdataset;
    };

    _pRadio.setInnerDataset = function (obj)
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
            this.on_apply_innerdataset(obj);
        }
    };

    //===============================================================
    // nexacro.Radio : Event Handlers
    //===============================================================

    _pRadio.on_fire_user_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)
    {
        var focus_comp = null;
        var items = this._items;
        var accIdx = this._accessibility_index;

        if (keycode == nexacro.Event.KEY_SPACE) // KEY_SPACE
        {
            if (!this._p_readonly)
            {
                if (accIdx > -1)
                {
                    focus_comp = items[accIdx];
                    focus_comp._changeUserStatus("focus", true);
                    this.set_index(accIdx);
                }
            }
        }
        else // accessibility keyaction
        {
            if (this._env._p_enableaccessibility && this._isComponentKeydownAction())
            {
                // tab키도 방향키처럼 동작하는 스펙이 존재 하나 검토하여 실적용 여부 판단해야함 
                if (keycode == nexacro.Event.KEY_UP || keycode == nexacro.Event.KEY_DOWN)
                {
                    var evt_name = "";

                    if (accIdx == -1) // accessibility focused on radio
                    {
                        if (keycode == nexacro.Event.KEY_DOWN && this._isItemAccessibilityEnable())
                        {
                            accIdx += 1;

                            if (items[accIdx])
                            {
                                evt_name = "downkey";
                                focus_comp = items[accIdx];
                            }

                            this._want_arrows = true;
                        }
                        else
                        {
                            this._want_arrows = false;
                        }
                    }
                    else if (this._want_arrows) // accessibility focused on radioitem
                    {
                        // 현재 아이템 mouseover status 해제
                        if (items[accIdx])
                        {
                            items[accIdx]._changeStatus("mouseover", false);
                        }

                        // accessibility index를 조정하여 focus 수행
                        if (keycode == nexacro.Event.KEY_DOWN)
                        {
                            accIdx += 1;

                            var last_index = items.length - 1;
                            if (accIdx > last_index) // accessibility focused on last radioitem
                            {
                                accIdx = -1;
                                this._want_arrows = false;
                            }
                            else
                            {
                                if (items[accIdx])
                                {
                                    evt_name = "downkey";
                                    focus_comp = items[accIdx];
                                }
                                else
                                {
                                    this._want_arrows = false;
                                }
                            }
                        }
                        else
                        {
                            accIdx += -1;

                            if (accIdx < 0) //accessibility focused on first raioitem
                            {
                                accIdx = -1;

                                var last_focused = this._last_focused;
                                if (last_focused)
                                    this._doDefocus(last_focused, true);
                                else
                                    this._doDefocus(this);

                                focus_comp = this;
                            }
                            else // accessibility focused on radioitem
                            {
                                if (items[accIdx])
                                {
                                    evt_name = "upkey";
                                    focus_comp = items[accIdx];
                                }
                                else
                                {
                                    this._want_arrows = false;
                                }
                            }
                        }
                    }

                    this._accessibility_index = accIdx;

                    if (focus_comp)
                    {
                        focus_comp._on_focus(true, evt_name);

                        // 이동한 focus가 radioitem이면 mousover status 설정
                        if (focus_comp instanceof nexacro._RadioItemControl)
                        {
                            focus_comp._changeStatus("mouseover", this._isItemAccessibilityEnable());
                        }
                    }
                }
            }
        }

        return nexacro.Component.prototype.on_fire_user_onkeydown.call(this, keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
    };

    _pRadio._on_radioitem_onclick = function (obj/*, e*/)
    {
        if (!this._p_enable || this._p_readonly == true)
        {
            return false;
        }
        // var items = this._items;
        // var item_len = items.length;

        var pre_index = this._default_index;
        var pre_value = this._default_value;
        var pre_text = this._default_text;



        this.on_fire_onitemclick(obj, obj._index, obj.text, obj._value);
        if (this._p_index != obj._index)
        {
            var post_index = obj._index;
            var post_value = obj._value;
            var post_text = obj.text;

            var ret = this.on_fire_canitemchange(obj, pre_index, pre_text, pre_value, post_index, post_text, post_value);
            if (ret)
            {

                this.set_index(post_index);

                if (this._p_index != pre_index || pre_index == -1)
                {
                    this.on_fire_onitemchanged(obj, pre_index, pre_text, pre_value, post_index, post_text, post_value);
                }

                if (this._env._p_enableaccessibility)
                {
                    this._accessibility_index = obj._index;
                    obj._on_focus(true);
                }
            }
        }
    };

    _pRadio._on_icon_onload = function (url, w, h)
    {
        if (this._item_icon_width != w || this._item_icon_height != h)
        {
            this._item_icon_width = w;
            this._item_icon_height = h;
            this._recalcLayout();
        }
    };

    _pRadio._on_dataset_onvaluechanged = function (obj, e)
    {
        if (this._is_created)
        {
            this._redrawRadioItem();

            this.on_fire_oninnerdatachanged(obj, e.oldvalue, e.newvalue, e.columnid, e.col, e.row);
        }
    };

    _pRadio._on_dataset_onrowsetchanged = function (/*obj, e*/)
    {
        this._redrawRadioItem();
    };


    _pRadio.on_fire_canitemchange = function (obj, preindex, pretext, prevalue, postindex, posttext, postvalue)
    {
        if (this.canitemchange && this.canitemchange._has_handlers)
        {
            var evt = new nexacro.ItemChangeEventInfo(this, "canitemchange", preindex, pretext, prevalue, postindex, posttext, postvalue);
            return this.canitemchange._fireCheckEvent(this, evt);
        }

        return true;
    };

    _pRadio.on_fire_onitemchanged = function (obj, preindex, pretext, prevalue, postindex, posttext, postvalue)
    {
        if (this.onitemchanged && this.onitemchanged._has_handlers)
        {
            var evt = new nexacro.ItemChangeEventInfo(this, "onitemchanged", preindex, pretext, prevalue, postindex, posttext, postvalue);
            return this.onitemchanged._fireEvent(this, evt);
        }
    };

    _pRadio.on_fire_onitemclick = function (obj, index, text, value)
    {
        if (this.onitemclick && this.onitemclick._has_handlers)
        {
            var evt = new nexacro.ItemClickEventInfo(this, "onitemclick", index, text, value);
            return this.onitemclick._fireEvent(this, evt);
        }
        return false;
    };

    _pRadio.on_fire_oninnerdatachanged = function (obj, oldvalue, newvalue, columnid, col, row)
    {
        if (this.oninnerdatachanged && this.oninnerdatachanged._has_handlers)
        {
            var evt = new nexacro.InnerdataChangedEventInfo(obj, "oninnerdatachanged", oldvalue, newvalue, columnid, col, row);
            return this.oninnerdatachanged._fireEvent(this, evt);
        }

        return true;
    };

    _pRadio.on_keydown_basic_action = function (/*keycode, alt_key, ctrl_key, shift_key, refer_comp*/)
    {
    };

    _pRadio.on_keydown_default_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp)
    {
        var E = nexacro.Event;
        var obj = this;
        
        // radioitem 이동
        if (this._isComponentKeydownAction() && (keycode >= E.KEY_LEFT && keycode <= E.KEY_DOWN))
        {
            var ds = this._innerdataset;
            if (!ds || this._p_readonly)
            {
                return false;
            }

            var row_cnt = ds.getRowCount();
            if (row_cnt < 1)
            {
                return false;
            }

            var pre_index = this._default_index;
            var pre_value = this._default_value;
            var pre_text = this._default_text;

            var op = (keycode == E.KEY_LEFT || keycode == E.KEY_UP) ? -1 : (keycode == E.KEY_RIGHT || keycode == E.KEY_DOWN) ? 1 : 0;

            var idx = this._p_index + op;
            if (idx >= row_cnt || (idx < -1 && keycode == E.KEY_RIGHT))
            {
                // last index circle or radio focused
                idx = 0;
            }
            else if (idx < 0 || (idx < -1 && keycode == E.KEY_LEFT))
            {
                // first index circle or radio focused
                idx = row_cnt - 1;
            }

            var radioitem = this._getItem(idx);
            var ret = this.on_fire_canitemchange(obj, pre_index, pre_text, pre_value, idx, radioitem.text, radioitem._value);
            if (ret)
            {
                this._accessibility_index = idx;
                if (row_cnt != idx && row_cnt >= idx && 0 <= idx)
                {
                    this.set_index(idx);
                    if (idx != pre_index)
                    {
                        this.on_fire_onitemchanged(obj, pre_index, pre_text, pre_value, idx, radioitem.text, radioitem._value);
                    }
                }

                if (enableaccessibility)
                {
                    radioitem._on_focus(true, op == -1 ? "keyleft" : (op == 1 ? "keyright" : undefined));
                    radioitem._changeUserStatus("selected", true);
                    radioitem._changeStatus("mouseover", this._isItemAccessibilityEnable());
                }
            }
        }
        return false;
    };

    //===============================================================
    // nexacro.Radio : Logical Part
    //===============================================================
    _pRadio._createRadioItemControl = function ()
    {
        var ds = this._innerdataset;
        if (ds)
        {
            var rows = ds.getRowCount();
            if (rows > 0)
            {
                var item, text, value;
                var create_only = this._is_created ? false : true;
                var codecolumn = this._p_codecolumn;
                var datacolumn = this._p_datacolumn == "" ? codecolumn : this._p_datacolumn;
                for (var i = 0; i < rows; i++)
                {
                    text = ds.getColumn(i, datacolumn);
                    value = ds.getColumn(i, codecolumn);
                    value = this._convertValueType(value, true);

                    item = new nexacro._RadioItemControl("radioitem" + i, 0, 0, 0, 0, null, null, null, null, null, null, this);
                    item.set_text(text);
                    item._setItemInfo(i, value);

                    item.createComponent(create_only);
                    item._setEventHandler("onclick", this._on_radioitem_onclick, this);

                    if (this._env._p_enableaccessibility)
                    {
                        item._setAccessibilityInfoIndex(i + 1);
                        item._setAccessibilityInfoCount(rows);
                        item._setEventHandler("onkeydown", this._on_radioitem_onkeydown, this);
                    }

                    this._items[i] = item;
                }
            }
        }
    };

    // 함수명이 헷갈려서 변경
	_pRadio._on_radioitem_onkeydown = function (obj, evt) //keycode, alt_key, ctrl_key, shift_key, refer_comp)
	{
		this.on_keydown_default_action(evt.keycode, evt.altKey, evt.ctrlKey, evt.shiftKey, obj);
	};

    _pRadio._updateItemInfo = function ()
    {
        var ds = this._innerdataset;
        if (!ds)
            return;

        var rows = ds.getRowCount();
        if (rows > 0)
        {
            var codecolumn = this._p_codecolumn;

            for (var i = 0; i < rows; i++)
            {
                var value = ds.getColumn(i, codecolumn);
                value = this._convertValueType(value, true);

                var item = this._items[i];
                item._setItemInfo(i, value);

                if (this._env._p_enableaccessibility)
                {
                    item._setAccessibilityInfoIndex(i + 1);
                    item._setAccessibilityInfoCount(rows);
                }

                this._items[i] = item;
            }

            this._recalcLayout();
        }
    };

    _pRadio._createRadioTextElement = function ()
    {
        var control_elem = this.getElement();
        var text_elem = this._text_elem;
        if (!text_elem && control_elem)
        {
            text_elem = this._text_elem = new nexacro.TextBoxElement(control_elem);
            text_elem.setElementSize(this._getClientWidth(), this._getClientHeight());

            if (this.textAlign)
                text_elem.setElementTextAlign(this.textAlign);
            if (this.verticalAlign)
                text_elem.setElementVerticalAlign(this.verticalAlign);

            text_elem.setElementText(this._p_name);

            if (this._is_created)
            {
                text_elem.create(this._getWindow());
            }
        }
    };

    _pRadio._destroyRadioItemControl = function ()
    {
        var i, n;
        var items = this._items;
        for (i = 0, n = items.length; i < n; i++)
        {
            items[i].destroy();
            items[i] = null;
        }

        this._items = [];
    };

    _pRadio._destroyRadioTextElement = function ()
    {
        var text_elem = this._text_elem;
        if (text_elem)
        {
            text_elem.destroy();
            this._text_elem = null;
        }
    };

    _pRadio._recalcLayout = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var ds = this._innerdataset;
            var items = this._items;
            var item_len = items.length;
            if (ds && item_len)
            {
                var priority_matrix;
                var fittocontents = this._p_fittocontents;
                var dir = this._p_direction;

                var radio_columncount = this._p_columncount;
                var radio_rowcount = this._p_rowcount;
                var ds_rowcount = ds.getRowCount();
                var apply_colcnt = 1;
                var apply_rowcnt = ds_rowcount;

                var client_width = this._getClientWidth();
                var client_height = this._getClientHeight();
                var item_left = 0;
                var item_top = 0;
                var item_width, item_height;

                var i, j;
                var item, item_size, item_index = 0;
                var max_columnsize = [];
                var max_rowsize = [];
                var max_col = 1;

                if (radio_columncount == -1 && radio_rowcount == -1)
                {
                    apply_rowcnt = 1;
                    apply_colcnt = 0;
                    var sum_width = 0;

                    for (i = 0; i < item_len; i++)
                    {
                        item_size = items[i]._on_getFitSize();
                        sum_width += item_size[0];

                        if (client_width < sum_width)
                        {
                            apply_rowcnt++;
                            sum_width = item_size[0];
                            apply_colcnt = 1;
                        }
                        else
                        {
                            apply_colcnt++;
                            max_col = max_col > apply_colcnt ? max_col : apply_colcnt;
                        }
                    }

                    apply_colcnt = max_col;
                    item_index = 0;
                    for (i = 0; i < apply_rowcnt; i++)
                    {
                        item_left = 0;
                        for (j = 0; j < apply_colcnt; j++)
                        {
                            if (ds_rowcount <= item_index)
                            {
                                break;
                            }
                            item = items[item_index];
                            item_size = item._on_getFitSize();
                            item_height = client_height / apply_rowcnt;

                            item.move(item_left, item_top, item_size[0], item_height);

                            item_left += item_size[0];

                            if (item_left > client_width)
                            {
                                break;
                            }

                            item_index++;
                        }

                        item_top += item_height;
                    }
                }
                else
                {
                    if (dir == "horizontal")
                    {
                        if (radio_columncount > 0)
                        {
                            apply_colcnt = radio_columncount;
                        }
                        else if ((radio_columncount < 0 && radio_rowcount < 0) ||
                            (radio_columncount < 0 && radio_rowcount == 0) ||
                            (radio_columncount == 0 && radio_rowcount == 0) ||
                            (radio_columncount == 0 && radio_rowcount == ds_rowcount))
                        {
                            apply_colcnt = 1;
                        }
                        else if (radio_columncount < 0 && (radio_columncount < radio_rowcount) && (radio_rowcount > 1))
                        {
                            apply_colcnt = Math.round(apply_rowcnt / radio_rowcount);
                        }
                        else if (radio_rowcount > 0)
                        {
                            apply_colcnt = Math.ceil(apply_rowcnt / radio_rowcount);
                            if ((apply_colcnt * radio_rowcount) < apply_rowcnt)
                            {
                                apply_colcnt++;
                                apply_rowcnt = (((apply_colcnt * radio_rowcount) - apply_rowcnt) >= apply_colcnt) ? radio_rowcount - 1 : radio_rowcount;
                            }
                        }
                        else
                        {
                            apply_colcnt = apply_rowcnt;
                        }

                        if (apply_colcnt > apply_rowcnt)
                        {
                            apply_colcnt = apply_rowcnt;
                        }

                        priority_matrix = "col";
                        apply_rowcnt = parseInt(ds_rowcount / apply_colcnt) | 0;

                        if ((ds_rowcount > apply_colcnt) && (ds_rowcount % apply_colcnt) > 0)
                        {
                            apply_rowcnt++;
                        }
                    }
                    else
                    {
                        if (radio_rowcount > 0)
                        {
                            apply_rowcnt = radio_rowcount;
                        }
                        else if (radio_columncount > 0)
                        {
                            apply_rowcnt = parseInt(ds_rowcount / radio_columncount);
                            if ((radio_columncount * apply_rowcnt) < ds_rowcount)
                            {
                                apply_rowcnt++;
                                //apply_colcnt = (((radio_columncount * apply_rowcnt) - ds_rowcount) >= apply_rowcnt) ? radio_columncount - 1 : radio_columncount;
                            }
                        }
                        else
                        {
                            apply_rowcnt = 1;
                        }

                        if (apply_rowcnt > 0)
                        {
                            priority_matrix = "row";
                            apply_colcnt = parseInt(ds_rowcount / apply_rowcnt) | 0;
                        }
                        else
                        {
                            apply_colcnt = radio_columncount;
                            priority_matrix = "col";
                        }

                        if (apply_colcnt <= 0)
                        {
                            apply_colcnt = 1;
                        }
                        if (priority_matrix == "row" && (ds_rowcount > apply_rowcnt) && (ds_rowcount % apply_rowcnt) > 0)
                        {
                            apply_colcnt++;
                        }
                    }

                    item_width = client_width / apply_colcnt;
                    item_height = client_height / apply_rowcnt;

                    if (priority_matrix == "col")
                    {
                        if (fittocontents == "none")
                        {
                            for (i = 0; i < apply_rowcnt; i++)
                            {
                                for (j = 0; j < apply_colcnt; j++)
                                {
                                    if (ds_rowcount <= item_index)
                                    {
                                        break;
                                    }

                                    item = items[item_index];
                                    item.move((item_width * j), (item_height * i), item_width, item_height);
                                    item_index++;
                                }
                                item_top += item_height;
                            }
                        }
                        else
                        {
                            for (i = 0; i < apply_rowcnt; i++)
                            {
                                for (j = 0; j < apply_colcnt; j++)
                                {
                                    if (ds_rowcount <= item_index)
                                    {
                                        break;
                                    }

                                    item = items[item_index];
                                    item_size = item._on_getFitSize();

                                    max_columnsize[j] = max_columnsize[j] ? Math.max(max_columnsize[j], item_size[0]) : item_size[0];
                                    max_rowsize[i] = max_rowsize[i] ? Math.max(max_rowsize[i], item_size[1]) : item_size[1];

                                    item_index++;
                                }
                            }

                            item_index = 0;

                            for (i = 0; i < apply_rowcnt; i++)
                            {
                                for (j = 0; j < apply_colcnt; j++)
                                {
                                    if (ds_rowcount <= item_index)
                                    {
                                        break;
                                    }

                                    item = items[item_index];

                                    if (fittocontents == "both")
                                    {
                                        item.move(item_left, item_top, max_columnsize[j], max_rowsize[i]);
                                        item_left += max_columnsize[j];
                                    }
                                    else if (fittocontents == "width")
                                    {
                                        item.move(item_left, (item_height * i), max_columnsize[j], item_height);
                                        item_left += max_columnsize[j];
                                    }
                                    else if (fittocontents == "height")
                                    {
                                        item.move((item_width * j), item_top, item_width, max_rowsize[i]);
                                    }

                                    item_index++;
                                }

                                item_left = 0;
                                if (fittocontents == "both" || fittocontents == "height")
                                    item_top += max_rowsize[i];
                                else
                                    item_top += item_height;
                            }
                        }
                    }
                    else
                    {
                        if (fittocontents == "none")
                        {
                            for (i = 0; i < apply_colcnt; i++)
                            {
                                for (j = 0; j < apply_rowcnt; j++)
                                {
                                    if (ds_rowcount <= item_index)
                                    {
                                        break;
                                    }

                                    item = items[item_index];
                                    item.move((item_width * i), (item_height * j), item_width, item_height);
                                    item_index++;
                                }
                                item_top += item_height;
                            }
                        }
                        else
                        {
                            for (i = 0; i < apply_colcnt; i++)
                            {
                                for (j = 0; j < apply_rowcnt; j++)
                                {
                                    if (ds_rowcount <= item_index)
                                    {
                                        break;
                                    }

                                    item = items[item_index];
                                    item_size = item._on_getFitSize();

                                    max_columnsize[i] = max_columnsize[i] ? Math.max(max_columnsize[i], item_size[0]) : item_size[0];
                                    max_rowsize[j] = max_rowsize[j] ? Math.max(max_rowsize[j], item_size[1]) : item_size[1];

                                    item_index++;
                                }
                            }

                            item_index = 0;

                            for (i = 0; i < apply_colcnt; i++)
                            {
                                for (j = 0; j < apply_rowcnt; j++)
                                {
                                    if (ds_rowcount <= item_index)
                                    {
                                        break;
                                    }

                                    item = items[item_index];

                                    if (fittocontents == "both")
                                    {
                                        item.move(item_left, item_top, max_columnsize[i], max_rowsize[j]);
                                        item_top += max_rowsize[i];
                                    }
                                    else if (fittocontents == "width")
                                    {
                                        item.move(item_left, (item_height * j), max_columnsize[i], item_height);
                                        item_top += max_rowsize[i];
                                    }
                                    else if (fittocontents == "height")
                                    {
                                        item.move((item_width * i), item_top, item_width, max_rowsize[j]);
                                    }

                                    item_index++;
                                }

                                item_top = 0;
                                if (fittocontents == "both" || fittocontents == "width")
                                    item_left += max_columnsize[i];
                                else
                                    item_left += item_width;
                            }
                        }
                    }
                }
            }
        }
    };

    _pRadio._redrawRadioItem = function ()
    {
        this._destroyRadioTextElement();
        this._destroyRadioItemControl();
        this._createRadioItemControl();

        if (this._p_value !== undefined)
        {
            this.on_apply_value(this._p_value);
        }
        else if (this._p_index > -1)
        {
            this.on_apply_index(this._p_index);
        }

        this.on_apply_readonly(this._p_readonly);

        this._recalcLayout();
    };

    _pRadio._doSelect = function (index)
    {
        var item = this._getItem(index);
        if (item)
        {
            item._block_read_aria_stat = this._block_read_aria_stat;
            item._changeUserStatus("selected", true);
            item._block_read_aria_stat = false;
            //item._setAccessibilityStatChecked(true);

            this._setText(item.text);
        }
        else
        {
            this._setText("");
        }
    };

    _pRadio._doDeselect = function (index)
    {
        var item = this._getItem(index);
        if (item)
        {
            item._block_read_aria_stat = this._block_read_aria_stat;
            item._changeUserStatus("selected", false);
            item._block_read_aria_stat = false;
            //item._setAccessibilityStatChecked(false);
        }
    };

    _pRadio._doDefocus = function (target, bParent)
    {
        var _window = this._getWindow();
        _window._removeFromCurrentFocusPath(target, true);
        if (bParent)
        {
            _window._removeFromCurrentFocusPath(this, false);
        }
    };

    _pRadio._setContents = function (str)
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
    // nexacro.Radio : Util Function
    //===============================================================
    _pRadio._setValue = function (v)
    {
        if (v === null)
            v = "";

        this._p_value = (v === undefined) ? v : v.toString();
    };

    _pRadio._setIndex = function (v)
    {
        if ((v > 0) && (v >= this._items.length))
        {
            v = -1;
        }

        this._p_index = v;
    };

    _pRadio._setText = function (v)
    {
        this._p_text = v;
        this._default_text = v;
    };

    _pRadio._setInnerDatasetStr = function (str)
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

    _pRadio._getItem = function (index)
    {
        var ret;
        var items = this._items;
        if (items.length > 0 && index >= 0)
        {
            ret = items[index];
        }

        return ret;
    };

    _pRadio = null;
}

if (!nexacro._RadioItemControl)
{
    //==============================================================================
    // nexacro._RadioItemControl : nexacro._IconText
    //==============================================================================
    nexacro._RadioItemControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro._IconText.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pRadioItemControl = nexacro._createPrototype(nexacro._IconText, nexacro._RadioItemControl);
    nexacro._RadioItemControl.prototype = _pRadioItemControl;
    _pRadioItemControl._type_name = "RadioItemControl";

    /* internal variable */
    _pRadioItemControl._index = -1;
    _pRadioItemControl._value = undefined;

    /* status */
    _pRadioItemControl._is_subcontrol = true;
    _pRadioItemControl._use_selected_status = true;
    _pRadioItemControl._use_readonly_status = true;

    _pRadioItemControl._p_accessibilityrole = "radioitem";

    //===============================================================
    // nexacro._RadioItemControl : Override
    //==============================================================
    _pRadioItemControl.on_getIDCSSSelector = function ()
    {
        return "radioitem";
    };

    _pRadioItemControl._getStringResourceProperty = function (v)
    {
        return v;
    };

    //===============================================================
    // nexacro.Radio : Util Function
    //===============================================================
    _pRadioItemControl._setItemInfo = function (index, value)
    {
        this._index = index;
        this._value = value;
    };

    _pRadioItemControl._on_icon_onload = function (url, w, h)
    {
        if (this._icon_url != url || this._icon_width != w || this._icon_height != h)
        {
            this._icon_width = w;
            this._icon_height = h;
            this._icon_url = url;

            var radio = this.parent;
            if (radio && radio._on_icon_onload)
                radio._on_icon_onload(url, w, h);
        }
    };

    _pRadioItemControl._on_getFitSize = function ()
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

            var border_padding_w = total_w;
            var border_padding_h = total_h;

            var text;
            if (this._displaytext && this._displaytext !== "")
            {
                // apply_text로 처리된 대상 기준으로 fittocontects가 이루어져야 함
                text = this._displaytext;
            }
            else
                text = this.text;
            if (text)
            {
                var font = this._getCurrentStyleInheritValue("font");
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

                var text_size = nexacro._getTextSize(text, font, multiline, width, wordwrap, wordspace, letterspace);

                total_w += Math.ceil(this.textwidth != null ? this.textwidth : text_size[0]);
                total_h += Math.ceil(text_size[1]);
            }

            var icon = this._icon || this._getCSSStyleValue("icon");
            if (icon)
            {
                var textpadding = this._textpadding || this._getCSSStyleValue("textPadding");
                var icon_pos = this.iconPosition || this._getCSSStyleValue("iconPosition");

                var icon_size;
                if (this._icon_url == icon._sysurl && this._icon_width != 0 && this._icon_height != 0)
                {
                    icon_size = { width: this._icon_width, height: this._icon_height };
                }
                else
                {
                    icon_size = nexacro._getImageSize(icon.url, this._on_icon_onload, this, undefined, this.image) || { width: this._icon_width, height: this._icon_height };
                }

                if (icon_pos == "top" || icon_pos == "bottom")
                {
                    total_h += icon_size.height;
                    total_w = Math.max(total_w, icon_size.width + border_padding_w);
                }
                else
                {
                    total_w += icon_size.width;
                    total_h = Math.max(total_h, icon_size.height + border_padding_h);
                }

                if (textpadding)
                {
                    total_w += textpadding.left + textpadding.right;
                    total_h += textpadding.top + textpadding.bottom;
                }
            }

            return [total_w, total_h];
        }

        return [this._adjust_width, this._adjust_height];
    };
    _pRadioItemControl = null;
}