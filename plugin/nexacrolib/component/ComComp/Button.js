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

if (!nexacro.Button)
{
    //==============================================================================
    // nexacro.Button
    //==============================================================================
    nexacro.Button = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro._IconText.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };


    var _pButton = nexacro._createPrototype(nexacro._IconText, nexacro.Button);
    nexacro.Button.prototype = _pButton;
    _pButton._type_name = "Button";

    /* default properties */
    _pButton._p_tabstop = true;
    _pButton._p_defaultbutton = false;
    _pButton._p_escapebutton = false;

    /* internal variable */
    _pButton._is_focus_accept = true;
    _pButton._cur_ldown_elem = null;
    _pButton._selectstatus = false;

    /* status */
    _pButton._use_pushed_status = true;
    _pButton._use_selected_status = true;

    /* accessibility */
    _pButton._p_accessibilityrole = "button";
    _pButton._is_eventinfo_control = true;

    //===============================================================
    // nexacro.Button : Create & Destroy & Update
    //===============================================================
    _pButton.destroyComponent = function ()
    {
        if (!this._is_alive)
        {
            return;
        }

        var mainform = this._getMainForm();
        if (mainform)
        {
            if (mainform._defaultbutton == this)
            {
                mainform._defaultbutton = null;
            }
            else if (mainform._escapebutton == this)
            {
                mainform._escapebutton = null;
            }
        }

        return nexacro.Component.prototype.destroyComponent.call(this);
    };

    //===============================================================
    // nexacro.Button : Override
    //===============================================================
    _pButton.on_getBindableProperties = function ()
    {
        return "value";
    };

    _pButton._getDlgCode = function (/*keycode, altKey, ctrlKey, shiftKey*/)
    {
        return { want_tab: false, want_return: true, want_escape: false, want_chars: false, want_arrows: false };
    };

    _pButton._isFocusAcceptable = function ()
    {
        return this._is_focus_accept;
    };

    //===============================================================
    // nexacro.Button : Properties
    //===============================================================
    _pButton.set_defaultbutton = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_defaultbutton != v)
        {
            this._p_defaultbutton = v;
        }

        var mainform = this._getMainForm();
        if (mainform)
        {
            var is_ignore = !(this._p_parent == mainform || this._is_created);
            if (v)
            {
                if (!is_ignore)
                {
                    mainform._defaultbutton = this;
                    this._setAccessibilityFlagDefaultButton(true);
                }
            }
            else
            {
                if (mainform._defaultbutton == this)
                {
                    mainform._defaultbutton = null;
                    this._setAccessibilityFlagDefaultButton(false);
                }
            }
        }
    };

    _pButton.set_escapebutton = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_escapebutton != v)
        {
            this._p_escapebutton = v;
        }

        var mainform = this._getMainForm();
        if (mainform)
        {
            var is_ignore = !(this._p_parent == mainform || this._is_created);
            if (v)
            {
                if (!is_ignore)
                {
                    mainform._escapebutton = this;
                }
            }
            else
            {
                if (mainform._escapebutton == this)
                {
                    mainform._escapebutton = null;
                }
            }
        }
    };

    _pButton._properties = [{ name: "defaultbutton" }, { name: "escapebutton" }];
    nexacro._defineProperties(_pButton, _pButton._properties);

    //===============================================================
    // nexacro.Button : Methods
    //===============================================================
    _pButton._click = function (keycode)
    {

        if (keycode == nexacro.Event.KEY_ESC || keycode == nexacro.Event.KEY_RETURN)
        {
            if (this._isAccessibilityEnable())
                this._notifyAccessibility();
        }

        this.click();
    };

    _pButton.click = function ()
    {
        this.on_fire_onclick("none", false, false, false, -1, -1, -1, -1, -1, -1, this, this);
    };

    _pButton.getSelectStatus = function ()
    {
        return this._selectstatus;
    };

    _pButton.setSelectStatus = function (select)
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

    _pButton.toggleSelectStatus = function ()
    {
        var ret = this._selectstatus;

        this.setSelectStatus(!ret);

        return ret;
    };

    //===============================================================
    // nexacro.Button : Events
    //===============================================================
    _pButton._on_hotkey = function (/*keycode, altKey, ctrlKey, shiftKey*/)
    {
        this.click();
    };

    _pButton.on_keydown_basic_action = function (keycode/*, alt_key, ctrl_key, shift_key, refer_comp*/)
    {
        if (this._use_pushed_status)
        {
            if (keycode == 13 || keycode == 32)
            {
                this._changeUserStatus("pushed", true);
            }
        }
    };

    _pButton.on_keyup_basic_action = function (/*keycode, alt_key, ctrl_key, shift_key, refer_comp*/)
    {
        if (this._use_pushed_status)
        {
            this._changeUserStatus("pushed", false);
        }
    };

    _pButton.on_keydown_default_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        var _win = this._getWindow();
        if (_win)
        {
            this._cur_ldown_elem = _win._cur_ldown_elem || _win._keydown_element;
        }
    };

    _pButton.on_keyup_default_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
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

    //delete _pButton;
}

if (!nexacro.StepImageButtonControl)
{
    //==============================================================================
    // nexacro._StepImageButtonControl 
    //==============================================================================
    nexacro.StepImageButtonControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pStepImageButtonCtrl = nexacro._createPrototype(nexacro.Button, nexacro.StepImageButtonControl);
    nexacro.StepImageButtonControl.prototype = _pStepImageButtonCtrl;
    _pStepImageButtonCtrl._type_name = "ButtonControl";

    _pStepImageButtonCtrl._is_subcontrol = true;

    _pStepImageButtonCtrl._on_getAccessibilityAdditionalLabel = function ()
    {
        var label = "";
        var parent = this._p_parent ? this._p_parent : null;
        if (parent)
        {
            label = this.id + " " + parent.stepcount;
        }

        return label;
    };

    _pStepImageButtonCtrl._on_getAccessibilityAdditionalRole = function ()
    {
        return " Step";
    };

    _pStepImageButtonCtrl.on_getIDCSSSelector = function ()
    {
        return "stepitem";
    };

    _pStepImageButtonCtrl.on_changeUserStatus = function (changestatus, value, applyuserstatus, currentstatus, currentuserstatus)
    {
        if (value)
        {
            if (applyuserstatus == "pushed" && currentuserstatus == "selected")
            {
                return currentuserstatus;
            }
        }
        return applyuserstatus;
    };

    //delete _pStepImageButtonCtrl;
}

if (!nexacro._TitleBarButtonControl)
{
    //==============================================================================
    // nexacro._TitleBarButtonControl 
    //==============================================================================
    nexacro._TitleBarButtonControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pTitleBarButtonControl = nexacro._createPrototype(nexacro.Button, nexacro._TitleBarButtonControl);
    nexacro._TitleBarButtonControl.prototype = _pTitleBarButtonControl;
    _pTitleBarButtonControl._type_name = "TitleBarButtonControl";

    _pTitleBarButtonControl._is_subcontrol = true;

    //delete _pTitleBarButtonControl;
}
