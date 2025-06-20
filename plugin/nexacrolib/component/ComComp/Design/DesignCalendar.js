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

if (nexacro.Calendar)
{
    var _pCalendar = nexacro.Calendar.prototype;

    //==============================================================================
    // nexacro.CalendarCloseUpEventInfo
    //============================================================================== 


    //==============================================================================
    // nexacro.CalendarDayClickEventInfo
    //============================================================================== 


    //==============================================================================
    // nexacro.CalendarSpinEventInfo
    //==============================================================================


    //==============================================================================
    // nexacro.Calendar 
    //==============================================================================


    //===============================================================
    // nexacro.Calendar : Create & Destroy & Update
    //===============================================================


    //===============================================================
    // nexacro.Calendar : Override
    //===============================================================


    //===============================================================
    // nexacro.Calendar : Properties
    //===============================================================
    _pCalendar.on_apply_type = function (type)
    {
        this._type = type;

        this._destroyControl();

        switch (type)
        {
            case "normal":
                this._createNormaltypeControl();
                break;
            case "spin":
                this._createSpintypeControl();
                break;
            case "monthonly":
                this._createMonthlytypeControl();
                break;
        }

        this._recalcLayout();
    };

    //===============================================================
    // nexacro.Calendar : Methods
    //===============================================================
    _pCalendar.dropdown = function ()
    {
        if (!this._p_enable || this._p_readonly || !this._p_visible)
        {
            return false;
        }

        if (!(nexacro.__isDesignMode && nexacro.__isDesignMode()) && !this._isPreviewMode())
        {
            this._setFocus(false);
        }

        this._showPopup();
    };

    //===============================================================
    // nexacro.Calendar : Events
    //===============================================================


    //===============================================================
    // nexacro.Calendar : Logical Part
    //===============================================================
    _pCalendar.createCssDesignContents = function ()
    {
        this.set_value("19820315");
    };

	//obj = datepicker.day 
	//status = disable
	//userstatus = selecte
    _pCalendar.showCssDesignContents = function (objpath, status, statusvalue, userstatus, userstatusvalue)
    {
        nexacro.Component.prototype.showCssDesignContents.call(this, objpath, status, statusvalue, userstatus, userstatusvalue);
        if (this._p_type != "monthonly")
        {
            this._showPopup();
        }
    };

    _pCalendar.updatePreviewPosition = function ()
    {
        // component align : center middle
        var form = this._p_parent;
        var form_width = form.getOffsetWidth();
        var form_height = form.getOffsetHeight();
        var offset_left;
        var offset_top;
        var calendar_width = this.getOffsetWidth();
        var calendar_height = this.getOffsetHeight();
        var popupsize;

        if (this._p_type == "normal")
        {
            popupsize = this._getPopupSizeArr();
            offset_left = (form_width / 2) - (popupsize.width / 2);
            offset_top = (form_height / 2) - ((calendar_height + popupsize.height) / 2);
        }
        else if (this._p_type == "monthonly")
        {
            popupsize = this._getPopupSizeArr();
            calendar_width = popupsize.width;
            calendar_height = popupsize.height;
            offset_left = (form_width / 2) - (calendar_width / 2);
            offset_top = (form_height / 2) - (calendar_height / 2);
        }
        else
        {
            offset_left = (form_width / 2) - (calendar_width / 2);
            offset_top = (form_height / 2) - (calendar_height / 2);
        }

        this.move(offset_left, offset_top, calendar_width, calendar_height);
    };

    _pCalendar._getElementPosition = function ()
    {
        if (this._isPreviewMode())
        {
            return { x: this._adjust_left, y: this._adjust_top };
        }
        else
        {
            return nexacro._getElementPositionInFrame(this.getElement());
        }
    };

    delete _pCalendar;
}