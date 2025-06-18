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

if (!nexacro.CheckBox)
{
    //==============================================================================
    // nexacro.CheckBoxChangedEventInfo
    //==============================================================================
    nexacro.CheckBoxChangedEventInfo = function (obj, id, prevalue, postvalue)
    {
        this.id = this.eventid = id || "onchanged";
        this.prevalue = prevalue;
        this.postvalue = postvalue;
        this.fromobject = this.fromreferenceobject = obj;
    };

    var _pCheckBoxChangedEventInfo = nexacro._createPrototype(nexacro.ChangedEventInfo, nexacro.CheckBoxChangedEventInfo);
    nexacro.CheckBoxChangedEventInfo.prototype = _pCheckBoxChangedEventInfo;
    _pCheckBoxChangedEventInfo._type_name = "CheckBoxChangedEventInfo";

    //delete _pCheckBoxChangedEventInfo;
    _pCheckBoxChangedEventInfo = null;
    //==============================================================================
    // nexacro.CheckBox
    //==============================================================================
    nexacro.CheckBox = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro._IconText.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pCheckBox = nexacro._createPrototype(nexacro._IconText, nexacro.CheckBox);
    nexacro.CheckBox.prototype = _pCheckBox;
    _pCheckBox._type_name = "CheckBox";

    /* default properties */
    _pCheckBox._p_value = false;
    _pCheckBox._p_readonly = false;
    _pCheckBox._p_falsevalue = null;
    _pCheckBox._p_truevalue = null;
    _pCheckBox._p_tabstop = true;

    /* status */
    _pCheckBox._is_focus_accept = true;
    _pCheckBox._use_selected_status = true;
    _pCheckBox._use_readonly_status = true;

    _pCheckBox.accessibilityrole = "checkbox";

    /* event list */
    _pCheckBox._event_list =
    {
        "canchange": 1, "onchanged": 1, "onclick": 1,
        "ondrag": 1, "ondragenter": 1, "ondragmove": 1, "ondragleave": 1, "ondrop": 1,
        "onkeydown": 1, "onkeyup": 1, "onkillfocus": 1, "onsetfocus": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1,
        "onmousedown": 1, "onmouseup": 1,
        "onmouseenter": 1, "onmousemove": 1, "onmouseleave": 1,
        "onmove": 1, "onsize": 1, "oncontextmenu": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1
    };

    //===============================================================
    // nexacro.CheckBox : Create & Destroy & Update 
    //===============================================================
    _pCheckBox.on_created_contents = function (win)
    {
        nexacro._IconText.prototype.on_created_contents.call(this, win);

        this._setAccessibilityStatChecked(this.isChecked());
    };

    _pCheckBox.on_attach_contents_handle = function (win)
    {
        nexacro._IconText.prototype.on_attach_contents_handle.call(this, win);

        this._setAccessibilityStatChecked(this.isChecked());
    };

    _pCheckBox.on_destroy_contents = function ()
    {
        nexacro._IconText.prototype.on_destroy_contents.call(this);

        this._p_falsevalue = null;
        this._p_truevalue = null;
    };

    //===============================================================
    // nexacro.CheckBox : Override
    //===============================================================
    _pCheckBox.on_init_bindSource = function (columnid, propid, ds)
    {
        if (propid == "value")
        {
            this._setValue(this._changeValue(undefined));
            this.on_apply_value();
        }
    };

    _pCheckBox.on_change_bindSource = function (propid, ds, row, col)
    {
        if (propid == "value")
        {
            this._setValue(this._changeValue(ds.getColumn(row, col)));
            this.on_apply_value();
        }
    };

    _pCheckBox.on_getBindableProperties = function ()
    {
        return "value";
    };

    _pCheckBox._on_hotkey = function (key_code, alt_key, ctrl_key, shift_key)
    {
        this.on_fire_onclick("", alt_key, ctrl_key, shift_key, -1, -1, -1, -1, -1, -1, this, this, false);
    };

    _pCheckBox._isFocusAcceptable = function ()
    {
        return this._is_focus_accept;
    };

    //===============================================================
    // nexacro.CheckBox : Properties
    //===============================================================
    _pCheckBox.set_value = function (v)
    {
        v = this._changeValue(v);
        if (this._p_value != v)
        {
            if (this.applyto_bindSource("value", v))
            {
                this._setValue(v);
                this.on_apply_value();
            }
        }
    };

    _pCheckBox.on_apply_value = function ()
    {
        if (this.isChecked())
        {
            this._changeUserStatus("selected", true);
        }
        else
        {
            this._changeUserStatus("selected", false);
        }
    };

    _pCheckBox.set_truevalue = function (v)
    {
        if (v != undefined)
            v = v.toString();

        if (this._p_truevalue !== v)
        {
            if (this.isChecked())
            {
                if (this.applyto_bindSource("value", v))
                {
                    this._setValue(v);
                }
            }
            this._p_truevalue = v;
        }
    };

    _pCheckBox.set_falsevalue = function (v)
    {
        if (v != undefined)
            v = v.toString();

        if (this._p_falsevalue !== v)
        {
            if (!this.isChecked())
            {
                if (this.applyto_bindSource("value", v))
                {
                    this._setValue(v);
                }
            }
            this._p_falsevalue = v;
        }
    };

    _pCheckBox.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (v != this._p_readonly)
        {
            this._p_readonly = v;
            this.on_apply_readonly(v);
        }
    };

    _pCheckBox.on_apply_readonly = function (readonly)
    {
        this._changeStatus("readonly", readonly);
    };

    _pCheckBox._properties = [{ name: "value" }, { name: "readonly" }, { name: "falsevalue" }, { name: "truevalue" }];
    nexacro._defineProperties(_pCheckBox, _pCheckBox._properties);

    //===============================================================
    // nexacro.CheckBox : Methods
    //===============================================================
    _pCheckBox.isChecked = function ()
    {
        return this._isChecked(this._p_value);
    };

    //===============================================================
    // nexacro.CheckBox : Event Handler
    //===============================================================
    _pCheckBox.on_keyup_basic_action = function (key_code, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        if (key_code == nexacro.Event.KEY_SPACE)
        {
            // ����Ŀ���� ���콺 �̺�Ʈ �߻��ϹǷ� �н�
            if (this._isComponentKeydownAction())
            {
                this.on_fire_onclick("", alt_key, ctrl_key, shift_key, -1, -1, -1, -1, -1, -1, refer_comp, refer_comp, meta_key);
            }
        }
    };

    _pCheckBox.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (!this._p_enable || this._p_readonly)
        {
            return false;
        }

        var pre_val = this._p_value;
        var post_val;
        if (this._isChecked(pre_val))
        {
            if (nexacro._isNull(this._p_falsevalue))
            {
                post_val = false;
            }
            else
            {
                post_val = this._p_falsevalue;
            }
        }
        else
        {
            if (nexacro._isNull(this._p_truevalue))
            {
                post_val = true;
            }
            else
            {
                post_val = this._p_truevalue;
            }
        }

        var ret = this.on_fire_canchange(this, pre_val, post_val);
        if (ret)
        {
            if (this.applyto_bindSource("value", post_val))
            {
                this._setValue(post_val);
            }

            if (pre_val !== post_val)
            {
                this.on_fire_onchanged(this, pre_val, post_val);
            }
            if (this._is_alive)
                this.on_apply_value();
        }

        if (this._is_alive)
            return nexacro.Component.prototype.on_fire_onclick.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
    };

    _pCheckBox.on_fire_canchange = function (obj, prevalue, postvalue)
    {
        if (this.canchange && this.canchange._has_handlers)
        {
            var evt = new nexacro.CheckBoxChangedEventInfo(this, "canchange", prevalue, postvalue);
            return this.canchange._fireCheckEvent(this, evt);
        }

        return true;
    };

    _pCheckBox.on_fire_onchanged = function (obj, prevalue, postvalue)
    {
        if (this.onchanged && this.onchanged._has_handlers)
        {
            var evt = new nexacro.CheckBoxChangedEventInfo(this, "onchanged", prevalue, postvalue);
            return this.onchanged._fireEvent(this, evt);
        }
    };

    _pCheckBox._on_click = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key)
    {
        if (!this._is_alive) return;

        if (this._p_visible && this._isEnable())
        {
            var clientXY = this._getClientXY(canvasX, canvasY);
            this.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientXY[0], clientXY[1], this, this, meta_key);
            this.on_click_basic_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key);
        }
    };

    //===============================================================
    // nexacro.CheckBox : Util Function
    //===============================================================
    _pCheckBox._setValue = function (v)
    {
        this._p_value = v;
        this._setAccessibilityStatChecked(this.isChecked());
    };

    _pCheckBox._isChecked = function (value)
    {
        if (this._p_truevalue != null)
        {
            if (this._p_falsevalue != null) // both
            {
                if (value === this._p_falsevalue || value === undefined)
                {
                    return false;
                }

                if (value === this._p_truevalue || nexacro._toBoolean(value))
                {
                    return true;
                }

                if (this._p_value === this._p_truevalue) // keep value;
                {
                    return true;
                }

                return false;
            }
            else // truevalue only
            {
                if (value === this._p_truevalue || nexacro._toBoolean(value))
                {
                    return true;
                }

                return false;
            }
        }
        else // not use truevalue
        {
            if (this._p_falsevalue != null) // falsevalue only
            {
                if (value === this._p_falsevalue)
                {
                    return false;
                }

                return true;
            }
            else // no both
            {
                return nexacro._toBoolean(value);
            }
        }
    };

    _pCheckBox._changeValue = function (v)
    {
        var use_truevalue = !nexacro._isNull(this._p_truevalue);
        var use_falsevalue = !nexacro._isNull(this._p_falsevalue);

        if (nexacro._isNull(v))
        {
            if (use_falsevalue)
            {
                return this._p_falsevalue;
            }
            else
            {
                return false;
            }
        }

        v = v.toString();
        if (use_truevalue)
        {
            if (v === this._p_truevalue)
            {
                // priority one
                return v;
            }

            if (use_falsevalue)
            {
                // truevalue, falsevalue both
                if (v === this._p_falsevalue)
                {
                    return v;
                }
                else
                {
                    return this._p_value;
                }
            }
            else
            {
                // truevalue only
                if (parseInt(v) === 0)
                {
                    return 0;
                }
                else if (!nexacro._toBoolean(v))
                {
                    return false;
                }
                else
                {
                    return this._p_value;
                }
            }
        }
        else
        {
            if (use_falsevalue)
            {
                // falsevalue only
                if (v === this._p_falsevalue)
                {
                    return v;
                }
                else if (parseInt(v) === 1)
                {
                    return 1;
                }
                else if (nexacro._toBoolean(v))
                {
                    return true;
                }
                else
                {
                    return this._p_value;
                }
            }
            else
            {
                // not use truevalue, falsevalue
                if (parseInt(v) === 0)
                {
                    return 0;
                }
                else if (parseInt(v) === 1)
                {
                    return 1;
                }
                else
                {
                    return nexacro._toBoolean(v);
                }
            }
        }
    };

    _pCheckBox._applyStatus = function ()
    {
        var pre_val = this._p_value;
        var post_val;
        if (this._isChecked(pre_val))
        {
            if (nexacro._isNull(this._p_falsevalue))
            {
                post_val = false;
            }
            else
            {
                post_val = this._p_falsevalue;
            }
        }
        else
        {
            if (nexacro._isNull(this._p_truevalue))
            {
                post_val = true;
            }
            else
            {
                post_val = this._p_truevalue;
            }
        }

        var ret = this.on_fire_canchange(this, pre_val, post_val);
        if (ret)
        {
            if (this.applyto_bindSource("value", post_val))
            {
                this._setValue(post_val);
            }

            if (pre_val !== post_val)
            {
                this.on_fire_onchanged(this, pre_val, post_val);
            }
            if (this._is_alive)
                this.on_apply_value();
        }
    }
    _pCheckBox = null;
    //delete _pCheckBox;
}
