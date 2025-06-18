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
if (nexacro.PopupDateRangePicker)
{
    //nexacro.PopupDateRangePicker.prototype = nexacro.DateRangePicker.prototype;
    //var _pPopupDateRangePicker = nexacro.PopupDateRangePicker.prototype;

    //_pPopupDateRangePicker._type_name = "PopupDateRangePicker";

    //==============================================================================
    // nexacro.PopupDateRangePicker
    //==============================================================================

    nexacro.PopupDateRangePicker = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.DateRangePicker.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        this._attached_comp = this;
    };

    var _pPopupDateRangePicker = nexacro._createPrototype(nexacro.DateRangePicker, nexacro.PopupDateRangePicker);
    nexacro.PopupDateRangePicker.prototype = _pPopupDateRangePicker;
    _pPopupDateRangePicker._type_name = "PopupDateRangePicker";
    _pPopupDateRangePicker._p_useclosebutton = true;
    _pPopupDateRangePicker.useclosebutton = true;

    // ====================================================================
    // nexacro.PopupDiv : Create & Update & Destory
    // ==================================================================== 
    _pPopupDateRangePicker.on_created_contents = function ()
    {
        nexacro.DateRangePicker.prototype.on_created_contents.call(this);
        this._p_visible = false; // PopupComponent의 visible은 default가 false
    };

    _pPopupDateRangePicker.on_update_position = function (resize_flag, move_flag, update)
    {
        nexacro.DateRangePicker.prototype.on_update_position.call(this, resize_flag, move_flag, update);
    }
    //===============================================================
    // nexacro.PopupDateRangePicker : Create & Destroy & Update
    //===============================================================
    _pPopupDateRangePicker.on_apply_useclosebutton = function ()
    {
        if (!this._control_element)
            return;

        this._updateButtons();
        this._recalcLayout();
    };

    //===============================================================
    // nexacro.PopupDateRangePicker : Override
    //===============================================================
    _pPopupDateRangePicker._isUseCloseButton = function ()
    {
        return (this.displaytype != "date") || this._p_useclosebutton;
    };

    //===============================================================
    // nexacro.PopupDateRangePicker : Properties
    //===============================================================
    
    _pPopupDateRangePicker.set_useclosebutton = function (v)
    {
        v = nexacro._toBoolean(v);

        if (this._p_useclosebutton != v)
        {
            this.useclosebutton = this._p_useclosebutton = v;
            this.on_apply_useclosebutton();
        }
    };
    
    //===============================================================
    // nexacro.PopupDateRangePicker : Methods
    //===============================================================


    //===============================================================
    // nexacro.PopupDateRangePicker : Events
    //===============================================================


    //===============================================================
    // nexacro.PopupDateRangePicker : Logical Part
    //===============================================================
    _pPopupDateRangePicker.createCssDesignContents = function ()
    {
    };

    delete _pPopupDateRangePicker;
}