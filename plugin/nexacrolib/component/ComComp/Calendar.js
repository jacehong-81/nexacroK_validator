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

if (!nexacro.Calendar)
{
	//==============================================================================
	// nexacro.CalendarCloseUpEventInfo
	//============================================================================== 
	nexacro.CalendarCloseUpEventInfo = function (obj, id, pretext, posttext, prevalue, postvalue/*, isselect*/)
	{
		this.id = this.eventid = id || "oncloseup";
		this.fromobject = this.fromreferenceobject = obj;

		this.pretext = pretext;
		this.posttext = posttext;
		this.prevalue = prevalue;
		this.postvalue = postvalue;
	};
	var _pCalendarCloseUpEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.CalendarCloseUpEventInfo);
	nexacro.CalendarCloseUpEventInfo.prototype = _pCalendarCloseUpEventInfo;
	_pCalendarCloseUpEventInfo._type_name = "CalendarCloseUpEventInfo";

	//delete _pCalendarCloseUpEventInfo;
	_pCalendarCloseUpEventInfo = null;

	//==============================================================================
	// nexacro.CalendarDayClickEventInfo
	//============================================================================== 
	nexacro.CalendarDayClickEventInfo = function (obj, id, date)
	{
		this.id = this.eventid = id || "ondayclick";
		this.fromobject = this.fromreferenceobject = obj;

		this.date = date;
	};
	var _pCalendarDayClickEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.CalendarDayClickEventInfo);
	nexacro.CalendarDayClickEventInfo.prototype = _pCalendarDayClickEventInfo;
	_pCalendarDayClickEventInfo._type_name = "CalendarDayClickEventInfo";

	//delete _pCalendarDayClickEventInfo;
	_pCalendarDayClickEventInfo = null;

	//==============================================================================
	// nexacro.CalendarSpinEventInfo
	//==============================================================================
	nexacro.CalendarSpinEventInfo = function (obj, id, beforeText, afterText, beforeValue, afterValue, isUp, fromobject, fromreferenceobject)
	{
		nexacro.Event.call(this, obj, id || "oncalendarspin");
		this.id = this.eventid = id || "oncalendarspin";

		this.fromobject = fromobject || obj;
		this.fromreferenceobject = fromreferenceobject || obj;

		this.pretext = beforeText;
		this.posttext = afterText;
		this.prevalue = beforeValue;
		this.postvalue = afterValue;
		this.up = isUp;
	};
	var _pCalendarSpinEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.CalendarSpinEventInfo);
	nexacro.CalendarSpinEventInfo.prototype = _pCalendarSpinEventInfo;
	_pCalendarSpinEventInfo._type_name = "CalendarSpinEventInfo";

	//delete _pCalendarSpinEventInfo;
	_pCalendarSpinEventInfo = null;

	//==============================================================================
	// nexacro.Calendar 
	//==============================================================================
	nexacro.Calendar = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay)
	{
		nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

		this._masktypeobj = new nexacro._EditMaskTypeDate();
		this._onlydisplay = onlydisplay;
	};

	var _pCalendar = nexacro._createPrototype(nexacro.Component, nexacro.Calendar);
	nexacro.Calendar.prototype = _pCalendar;
	_pCalendar._type_name = "Calendar";

	/* control */
	_pCalendar._p_calendaredit = null;
	_pCalendar._p_dropbutton = null;
	_pCalendar._p_datepicker = null;
	_pCalendar._p_calendarspinupbutton = null;
	_pCalendar._p_calendarspindownbutton = null;
	_pCalendar._popupcontrol = null;

	/* default properties */
	_pCalendar._p_value = undefined;
	_pCalendar._p_displaynulltext = "";
	_pCalendar._p_displayinvalidtext = "invalid value";
	_pCalendar._p_readonly = false;
	_pCalendar._p_autoselect = false;
	_pCalendar._p_autoskip = false;
	_pCalendar._p_type = "normal";
	_pCalendar._p_datepickerchangetype = "spin"
	_pCalendar._p_popuptype = undefined;
	_pCalendar._p_text = "";
	_pCalendar._p_usecontextmenu = true;

	_pCalendar._initsoftkeyboard = undefined;
	_pCalendar._p_usesoftkeyboard = true;

	_pCalendar._p_locale = "";

	_pCalendar._p_innerdataset = null;
	_pCalendar._p_backgroundcolumn = "";
	_pCalendar._p_bordercolumn = "";
	_pCalendar._p_datecolumn = "";
	_pCalendar._p_textcolorcolumn = "";

	_pCalendar._p_buttonsize = undefined;
	_pCalendar._p_headheight = undefined;
	_pCalendar._p_daysize = undefined;
	_pCalendar._p_popupsize = undefined;

	_pCalendar._p_dateformat = "yyyy-MM-dd ddd";
	_pCalendar._p_editformat = "yyyy-MM-dd";
	_pCalendar._p_headformat = "yyyy.MM";
	_pCalendar._p_weekformat = undefined;
	//_pCalendar.monthformat = undefined;
	//_pCalendar.yearformat = undefined;

	_pCalendar._p_usetrailingday = false;
	_pCalendar._p_showmonthspin = false;
	_pCalendar._p_showyearspin = false;

	/* internal variable */
	_pCalendar._masktypeobj = null;
	_pCalendar._innerdataset = null;

	_pCalendar._locale = "";
	_pCalendar._type = "normal";
	_pCalendar._systemformat = "yyyy-MM-dd";
	_pCalendar._default_value = undefined;
	_pCalendar._default_text = "";
	_pCalendar._default_type = "";
	_pCalendar._want_arrows = false;
	_pCalendar._has_inputElement = true;
	_pCalendar._change_caret_from_method = false;

	_pCalendar._onlydisplay = false;
	_pCalendar._is_repeat = true;

	/* check process */
	_pCalendar.__value_change = false;
	_pCalendar.__focus_from_spinbutton = false;

	/* status */
	_pCalendar._is_locale_control = true;
	_pCalendar._is_editable_control = true;
	_pCalendar._use_readonly_status = true;

	/* event list */
	_pCalendar._event_list = {
		"oneditclick": 1, "ondayclick": 1,
		"onkeydown": 1, "onkeyup": 1,
		"onkillfocus": 1, "onsetfocus": 1,
		"ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
		"onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1, "onmousedown": 1, "onmouseup": 1,
		"onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1,
		"onmove": 1, "onsize": 1,
		"canchange": 1, "onchanged": 1, "oninput": 1,
		"oncontextmenu": 1,
		"ondropdown": 1, "oncloseup": 1, "onspin": 1,
		"oninnerdatachanged": 1,
		"ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1, "ondevicebuttonup": 1
	};

	/* accessibility */
	_pCalendar._p_accessibilityrole = "calendar";
	_pCalendar._is_compound = true;

	nexacro.Calendar.EndDayNormal = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	nexacro.Calendar.EndDayLeap = new Array(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

	//===============================================================
	// nexacro.Calendar : Create & Destroy & Update
	//===============================================================
	_pCalendar.on_create_contents = function ()
	{
		var control = this.getElement();
		if (control)
		{
			var maskobj = this._masktypeobj;
			if (maskobj)
			{
				var mode = "number";
				var useeditbuffer = true;
				var bMobile = ((nexacro._isMobile && nexacro._isMobile()) || (nexacro._isHybrid && nexacro._isHybrid()) || (!nexacro._isDesktop() && nexacro._OS == "Android" && nexacro._Browser == "Runtime"));
				if (bMobile)
				{
					this._is_repeat = false;

					if ((!this._p_popuptype || this._p_popuptype == "system") && this._type == "normal")
					{
						mode = "date";
						useeditbuffer = false;
						this._type = "system";
					}
				}

				maskobj.setInputMode(mode);
				maskobj.setUseEditBuffer(useeditbuffer);
			}

			switch (this._type)
			{
				case "normal":
				case "system":
					this._createCalendaredit();
					this._createDropbutton();
					break;
				case "spin":
					this._createCalendaredit();
					this._createSpinbutton();
					break;
				case "monthonly":
					this._createDatePicker();
					break;
			}
		}
	};

	_pCalendar.on_created_contents = function (win)
	{
		this.on_apply_innerdataset(this._innerdataset);
		this.on_apply_locale(this._getLocale());
		this.on_apply_editformat(this._p_editformat);
		this.on_apply_dateformat(this._p_dateformat);
		this.on_apply_weekformat(this._p_weekformat);

		if (this._p_expr)
		{
			this._on_apply_expr(this._p_expr);
		}
		else
		{
			this.on_apply_value(this._p_value);
		}

		this._recalcLayout();

		const a11ytype = this._env._a11ytype;
		switch (this._type)
		{
			case "spin":
				this._setEventHandlerToCalendarEdit();
				this._setEventHandlerToSpinButton();

				this._p_calendaredit._on_apply_inputtype();
				this._p_calendaredit.on_created(win);
				this._p_calendarspinupbutton.on_created(win);
				this._p_calendarspindownbutton.on_created(win);
				if (a11ytype == 5)
				{
					this._p_calendaredit._setAccessibilityStatHidden(true);
					this._p_calendarspinupbutton._setAccessibilityStatHidden(true);
					this._p_calendarspindownbutton._setAccessibilityStatHidden(true);
				}
				break;
			case "monthonly":
				this._setEventHandlerToDatePicker();

				this._p_datepicker.on_created(win);
				///if (!(this._p_accessibilitydesclevel == "none") && !(this._p_accessibilitydesclevel == "child"))
				//    this._setAccessibilityActiveDescendant(this._p_datepicker.body.getElement());
				break;
			case "system":
				if (this._env._p_enableaccessibility && a11ytype == 4)
				{
					var control_elem = this.getElement();
					if (control_elem)
					{
						control_elem.setElementAccessibilityStatHidden(false);
					}
				}

				this._setEventHandlerToCalendarEdit();
				this._setEventHandlerToDropButton();
				this._p_calendaredit._on_apply_inputtype();
				this._p_calendaredit.on_created(win);
				var dropbutton = this._p_dropbutton;
				if (dropbutton)
					dropbutton.on_created(win);
				if (a11ytype == 5)
					this._p_calendaredit._setAccessibilityStatHidden(true);
				if (this._p_accessibilitydesclevel != "none" && this._p_accessibilitydesclevel != "child")
					this._setAccessibilityActiveDescendant(this._p_calendaredit._input_element);
				break;
			case "normal":
			default:
				this._setEventHandlerToCalendarEdit();
				this._setEventHandlerToDropButton();
				this._p_calendaredit._on_apply_inputtype();
				this._p_calendaredit.on_created(win);
				if (a11ytype == 5)
					this._p_calendaredit._setAccessibilityStatHidden(true);
				this._p_dropbutton.on_created(win);
				//if (!(this._p_accessibilitydesclevel == "none") && !(this._p_accessibilitydesclevel == "child"))
				//    this._setAccessibilityActiveDescendant(this._p_calendaredit._input_element);
				break;
		}

		if (this._p_calendaredit)
		{
			this._p_calendaredit.on_apply_usesoftkeyboard();
		}

		this._default_value = this._p_value;
		this._default_text = this._p_text;

		this.on_apply_displaynulltext(this._p_displaynulltext);
		this.on_apply_displayinvalidtext(this._p_displayinvalidtext);
		this.on_apply_readonly();
	};

	_pCalendar.on_destroy_contents = function ()
	{
		this._destroyControl();

		this._removeEventHandlerToInnerDataset();
	};

	_pCalendar._removeEventHandlerToInnerDataset = function ()
	{
		if (this._innerdataset)
		{
			this._innerdataset._removeEventHandler("onvaluechanged", this._on_dataset_onvaluechanged, this);
			this._innerdataset._removeEventHandler("onrowsetchanged", this._on_dataset_onrowsetchanged, this);
			this._innerdataset = null;
		}
	};

	_pCalendar.on_create_contents_command = function ()
	{
		this.on_apply_innerdataset(this._innerdataset);
		this.on_apply_locale(this._getLocale());
		this.on_apply_editformat(this._p_editformat);
		this.on_apply_dateformat(this._p_dateformat);
		this.on_apply_weekformat(this._p_weekformat);
		this.on_apply_usesoftkeyboard();

		if (this._p_expr)
		{
			this._on_apply_expr(this._p_expr);
		}
		else
		{
			this.on_apply_value(this._p_value);
		}

		this._recalcLayout();

		switch (this._type)
		{
			case "system":
			case "normal":
				this._setEventHandlerToCalendarEdit();
				this._setEventHandlerToDropButton();
				break;
			case "spin":
				this._setEventHandlerToCalendarEdit();
				this._setEventHandlerToSpinButton();
				break;
			case "monthonly":
				this._setEventHandlerToDatePicker();
				break;
		}

		var str = "";
		if (this._p_calendaredit)
		{
			this._p_calendaredit._on_apply_inputtype();
			this._p_calendaredit.on_apply_usesoftkeyboard();

			str += this._p_calendaredit.createCommand();
		}
		if (this._p_dropbutton)
		{
			str += this._p_dropbutton.createCommand();
		}
		if (this._p_calendarspindownbutton)
		{
			str += this._p_calendarspindownbutton.createCommand();
		}
		if (this._p_calendarspinupbutton)
		{
			str += this._p_calendarspinupbutton.createCommand();
		}
		if (this._p_datepicker)
		{
			str += this._p_datepicker.createCommand();
		}

		return str;
	};

	_pCalendar.on_attach_contents_handle = function (win)
	{
		if (this._p_calendaredit)
		{
			this._p_calendaredit.attachHandle(win);
		}
		if (this._p_dropbutton)
		{
			this._p_dropbutton.attachHandle(win);
		}
		if (this._p_calendarspindownbutton)
		{
			this._p_calendarspindownbutton.attachHandle(win);
		}
		if (this._p_calendarspinupbutton)
		{
			this._p_calendarspinupbutton.attachHandle(win);
		}
		if (this._p_datepicker)
		{
			this._p_datepicker.attachHandle(win);
		}

		if (this._env._p_enableaccessibility)
		{
			this._on_attach_accessibility_contents_handle(win);
		}

		this._default_value = this._p_value;
		this._default_text = this._p_text;

		this.on_apply_displaynulltext(this._p_displaynulltext);
		this.on_apply_displayinvalidtext(this._p_displayinvalidtext);
		this.on_apply_readonly();
	};

	_pCalendar.on_change_containerRect = function (/*width, height*/)
	{
		this._recalcLayout();
	};

	_pCalendar.on_change_containerPos = function (/*left, top*/)
	{

	};

	//===============================================================
	// nexacro.Calendar : Override
	//===============================================================
	_pCalendar._getInputElement = function ()
	{
		return this._p_calendaredit ? this._p_calendaredit._getInputElement() : null;
	};

	_pCalendar._apply_setfocus = function (evt_name)
	{
		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			calendaredit._on_focus(true, nexacro._getBrowserEventName(evt_name));
		}
	};

	_pCalendar.on_apply_prop_enable = function (v)
	{
		v = (v != null) ? v : this._isEnable();

		if (this._p_calendaredit)
		{
			this._p_calendaredit._setEnable(v);
		}
		if (this._p_dropbutton && !this._isReadOnly())
		{
			this._p_dropbutton._setEnable(v);
		}
		if (this._p_calendarspinupbutton && !this._isReadOnly())
		{
			this._p_calendarspinupbutton._setEnable(v);
		}
		if (this._p_calendarspindownbutton && !this._isReadOnly())
		{
			this._p_calendarspindownbutton._setEnable(v);
		}
		if (this._p_datepicker)
		{
			this._p_datepicker._setEnable(v);
		}
	};

	_pCalendar.on_apply_prop_cssclass = function ()
	{
		if (this._p_calendaredit)
		{
			this._p_calendaredit.on_apply_cssclass();
		}
		if (this._p_dropbutton)
		{
			this._p_dropbutton.on_apply_cssclass();
		}
		if (this._p_calendarspinupbutton)
		{
			this._p_calendarspinupbutton.on_apply_cssclass();
		}
		if (this._p_calendarspindownbutton)
		{
			this._p_calendarspindownbutton.on_apply_cssclass();
		}
		if (this._p_datepicker)
		{
			this._p_datepicker.on_apply_cssclass();
		}
	};

	_pCalendar.on_init_bindSource = function (columnid, propid, ds)
	{
		if (propid == "value")
		{
			this._setValue(undefined);
		}
	};

	_pCalendar.on_change_bindSource = function (propid, ds, row, col)
	{
		if (propid == "value")
		{
			var v = ds.getColumn(row, col);

			var maskobj = this._masktypeobj;
			var dateobj = this._convertToDateObject(v);

			if (dateobj)
			{
				if (!this._isInvalidValue(dateobj))
				{
					v = this._convertValueType(v, dateobj, true);
					if (v != this._p_value)
					{
						var packeddate = maskobj.changeNormalizeValue(dateobj.toString());

						if (maskobj)
						{
							maskobj.setDate(packeddate);
						}
						this._p_value = v;
						this.on_apply_value(packeddate);
					}
				}
				else
				{
					this._p_value = v;
					this.on_apply_value(v);
				}
			}
			else
			{
				if (v != this._p_value)
					this._setValue(v);  // undefined, null, empty string
			}
			this._on_apply_text();
		}
	};

	_pCalendar.on_getBindableProperties = function ()
	{
		return "value";
	};

	_pCalendar._getDragData = function ()
	{
		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			return calendaredit.getSelectedText();
		}
	};

	_pCalendar._getDlgCode = function (keycode, altKey, ctrlKey/*, shiftKey*/)
	{
		var _want_arrows = this._want_arrows;
		this._is_first_focus = false;
		//if (this._env._p_enableaccessibility &&  keycode == 27)
		//    _want_arrows = true;
		if (ctrlKey == true)
			_want_arrows = true;
		return { want_tab: false, want_return: false, want_escape: false, want_chars: false, want_arrows: _want_arrows };
	};

	_pCalendar._getAccessibilityReadLabel = function (/*bwholeread*/)
	{
		if (this._accessibilityvalue)
			return this._accessibilityvalue;

		if (this._p_text)
			return this._p_text;

		return this._getCurrentDateStr();
	};

	/*
	_pCalendar._setAccessibilityStatFocus = function (evt_name)
	{
		//var calendaredit = this._p_calendaredit;
		//if (calendaredit && calendaredit._input_element)
		//{
		//    var role = this._getAccessibilityRole(this.on_find_CurrentStyle_accessibility(this._pseudo));
		//    if (this._getDescLevel() == "none")
		//    {
		//        role = "none";
		//    }
		//    calendaredit._input_element.setElementAccessibilityRole(role);
		//}
		//return nexacro.Component.prototype._setAccessibilityStatFocus.call(this, evt_name);
	};
	*/
	//===============================================================
	// nexacro.Calendar : Properties
	//===============================================================
	_pCalendar.set_text = nexacro._emptyFn;

	_pCalendar.on_apply_text = function (v)
	{
		var expr = this._p_expr;
		if (expr)
		{
			if (expr.substring(0, 4) == "Date")
			{
				v = new nexacro.Date(v).toString();
			}

			if (this._p_value != v)
			{
				var dateobj = this._convertToDateObject(v);
				var binvalid = false;
				if (dateobj)
				{
					binvalid = this._isInvalidValue(dateobj);

					if (!binvalid)
						v = this._convertValueType(v, dateobj);
				}
				this.set_value(v);
			}
			else
				this.on_apply_value(v);
		}
	};

	_pCalendar.set_value = function (v) 
	{
		var dateobj = this._convertToDateObject(v);
		var binvalid = false;
		if (dateobj)
		{
			binvalid = this._isInvalidValue(dateobj);

			if (!binvalid)
				v = this._convertValueType(v, dateobj);
		}

		if (this._p_value !== v)
		{
			if (this.applyto_bindSource("value", v))
			{
				this._p_value = v;
				this.on_apply_value(v, binvalid);
			}
		}
	};

	/*
	_pCalendar.set_value["1.0"] = function (v)
	{
		if (v && ((typeof v) == "object") && !(v instanceof nexacro.Date)) {
			return;
		}

		v = v ? nexacro._toString(v) : v;

		var maskobj = this._masktypeobj;
		if (maskobj)
			v = maskobj.changeNormalizeValue(v);

		if (this._p_value !== v) {
			if (this.applyto_bindSource("value", v)) {
				this._setValue(v);
			}
		}
	};

	_pCalendar.set_value["2.0"] = function (v)
	{
		var maskobj = this._masktypeobj;

		var dateobj = this._convertToDateObject(v);
		if (dateobj) {
			if (!this._isInvalidValue(dateobj)) {
				if (dateobj instanceof Date)        //it isn't packed date format;
				{
					var type = maskobj.getEditFormatType();
					switch (type) {
						case 0: //Date
							v = nexacro.DataUtils._formatDate(dateobj);
							break;
						case 1: //Time
							v = nexacro.DataUtils._formatTime(dateobj);
							break;
						case 2: //DateTime
							v = nexacro.DataUtils._formatDateTime(dateobj);
					}
				}
				else {
					v = v ? nexacro._toString(v) : v;

					if (maskobj)
						v = maskobj.changeNormalizeValue(v);
				}
			}
		}

		if (this._p_value !== v) {
			if (this.applyto_bindSource("value", v)) {
				this._p_value = v;
				this.on_apply_value(v);
			}
		}
	};
		*/
	_pCalendar.on_apply_value = function (value, binvalid)
	{
		value = nexacro._isNull(value) ? value : nexacro._toString(value).trim();

		var maskobj = this._masktypeobj;
		if (maskobj)
		{
			if (nexacro._isNull(binvalid))
				binvalid = this._isInvalidValue(value);

			if (binvalid)
				this._p_text = maskobj.applyMask("");
			else
				this._p_text = maskobj.applyMask(value);


			this._setCalendarEditValue(value);

			this._setDatePickerValue(maskobj.getDatePickerValue());
		}
	};

	_pCalendar._on_apply_text = function (text)
	{
		var exprfn = this._expr_fn;
		if (exprfn)
		{
			try
			{
				text = nexacro._toString(exprfn.call(null, this));
			}
			catch (e)
			{
				nexacro._settracemsg(e);
			}
		}
		if (this._p_expr.substring(0, 4) == "Date")
		{
			text = new nexacro.Date(text).toString();
		}

		var dateobj = this._convertToDateObject(text);
		var binvalid = false;
		if (dateobj)
		{
			binvalid = this._isInvalidValue(dateobj);

			if (!binvalid)
				text = this._convertValueType(text, dateobj);
		}
		this._displaytext = text;

		if (this._env._p_enableaccessibility)
			this.on_apply_prop_accessibilitylabel();

		this.on_apply_text(text);
	};

	_pCalendar.set_displaynulltext = function (v)
	{
		v = nexacro._toString(v).replace(/&quot;/g, "\"");
		if (this._p_displaynulltext != v)
		{
			this._p_displaynulltext = v;
			this.on_apply_displaynulltext(v);
		}
	};

	_pCalendar.on_apply_displaynulltext = function (displaynulltext)
	{
		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			calendaredit.set_displaynulltext(displaynulltext);
		}
	};

	_pCalendar.set_displayinvalidtext = function (v)
	{
		v = nexacro._toString(v).replace(/&quot;/g, "\"");
		if (this._p_displayinvalidtext != v)
		{
			this._p_displayinvalidtext = v;
			this.on_apply_displayinvalidtext(v);
		}
	};

	_pCalendar.on_apply_displayinvalidtext = function (v)
	{
		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			calendaredit.set_displayinvalidtext(v);
		}
	};

	_pCalendar.set_readonly = function (v)
	{
		v = nexacro._toBoolean(v);
		if (this._p_readonly != v)
		{
			this._p_readonly = v;
			this.on_apply_readonly();
		}
	};

	_pCalendar._isReadOnly = function ()
	{
		return this._p_readonly;
	};

	_pCalendar.on_apply_readonly = function ()
	{
		var readonly = this._isReadOnly();

		this._changeStatus("readonly", readonly);

		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			if (!this._onlydisplay)
			{
				calendaredit.set_readonly(readonly);
			}
			else
			{
				calendaredit._changeStatus("readonly", readonly);
			}
		}

		var dropbutton = this._p_dropbutton;
		if (dropbutton)
		{
			dropbutton._setEnable(this._isEnable() && !readonly);
		}

		var spinupbutton = this._p_calendarspinupbutton;
		if (spinupbutton)
		{
			spinupbutton._setEnable(this._isEnable() && !readonly);
		}

		var spindownbutton = this._p_calendarspindownbutton;
		if (spindownbutton)
		{
			spindownbutton._setEnable(this._isEnable() && !readonly);
		}

		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker.set_readonly(readonly);
		}
	};

	_pCalendar.set_autoselect = function (v)
	{
		v = nexacro._toBoolean(v);
		if (this._p_autoselect != v)
		{
			this._p_autoselect = v;
			this.on_apply_autoselect(v);
		}
	};

	_pCalendar.on_apply_autoselect = function (autoselect)
	{
		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			calendaredit.set_autoselect(autoselect);
		}
	};

	_pCalendar.set_autoskip = function (v)
	{
		v = nexacro._toBoolean(v);
		if (this._p_autoskip != v)
		{
			this._p_autoskip = v;
			this.on_apply_autoskip(v);
		}
	};

	_pCalendar.on_apply_autoskip = function (autoskip)
	{
		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			calendaredit.set_autoskip(autoskip);
		}
	};

	_pCalendar.set_type = function (v)
	{
		var type_enum = ["normal", "spin", "monthonly"];
		if (type_enum.indexOf(v) == -1)
		{
			return;
		}

		if (this._p_type != v)
		{
			this._default_type = this._p_type;
			this._p_type = v;
			this.on_apply_type(v);
		}
	};

	_pCalendar.on_apply_type = function (type)
	{
		var is_change = true;
		var client_width = this._getClientWidth();
		var normal_height = Math.round(client_width / 5);
		if (this._default_type != "monthonly" || type == "monthonly")
		{
			is_change = false;
		}

		if (type != "spin" && type != "monthonly" && this._masktypeobj.getInputMode() == "date")
		{
			type = "system";
		}

		this._type = type;

		var control_elem = this.getElement();
		if (control_elem)
		{
			this._destroyControl();

			switch (this._type)
			{
				case "system":
				case "normal":
					this._createNormaltypeControl();
					this._p_calendaredit._on_apply_inputtype();

					if (is_change)
						this.resize(client_width, normal_height);
					else
						this._recalcLayout();
					break;
				case "spin":
					this._createSpintypeControl();
					this._p_calendaredit._on_apply_inputtype();

					if (is_change)
						this.resize(client_width, normal_height);
					else
						this._recalcLayout();
					break;
				case "monthonly":
					this._createMonthlytypeControl();

					var popupsize = this._getPopupSizeArr();
					if (this._adjust_width == popupsize.width && this._adjust_height == popupsize.height)
						this._recalcLayout();
					else
						this.resize(popupsize.width, popupsize.height);
					break;
			}
		}
	};

	_pCalendar.set_popuptype = function (v)
	{
		var popuptype_enum = ["center", "none", "normal", "system"];
		if (v && popuptype_enum.indexOf(v) == -1)
		{
			return;
		}

		if (this._p_popuptype != v)
		{
			this._p_popuptype = v;
			this.on_apply_popuptype(v);
		}
	};

	_pCalendar.on_apply_popuptype = function (popuptype)
	{
		var type = this._type;
		var maskobj = this._masktypeobj;
		if (maskobj)
		{
			var mode = "number";
			var useeditbuffer = true;

			if ((!this._p_popuptype || this._p_popuptype == "system") && (type == "normal" || type == "system"))
			{
				var bMobile = ((nexacro._isMobile && nexacro._isMobile()) || (nexacro._isHybrid && nexacro._isHybrid()) || (!nexacro._isDesktop() && nexacro._OS == "Android" && nexacro._Browser == "Runtime"));
				if (bMobile && this._is_created)
				{
					mode = "date";
					useeditbuffer = false;
				}
			}

			maskobj.setInputMode(mode);
			maskobj.setUseEditBuffer(useeditbuffer);

			this.on_apply_type(this._p_type);
		}
	};

	_pCalendar.set_locale = function (v)
	{
		if (this._p_locale != v)
		{
			this._p_locale = v;
			this._locale = v;
			this.on_apply_locale(v);

			this.on_apply_weekformat(this._p_weekformat);
			this.on_apply_value(this._p_value);
		}
	};

	_pCalendar.on_apply_locale = function (locale)
	{
		var maskobj = this._masktypeobj;
		if (maskobj)
		{
			maskobj.setLocale(locale);

			if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
				this._systemformat = nexacro.Locale._makeDateMaskString(locale, "SHORTDATE");
		}
	};

	_pCalendar.set_usecontextmenu = function (v)
	{
		v = nexacro._toBoolean(v);
		if (this._p_usecontextmenu != v)
		{
			this._p_usecontextmenu = v;
			this.on_apply_usecontextmenu(v);
		}
	};

	_pCalendar.on_apply_usecontextmenu = function (usecontextmenu)
	{
		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			calendaredit.set_usecontextmenu(usecontextmenu);
		}
	};

	_pCalendar.set_usesoftkeyboard = function (v)
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

	_pCalendar.on_apply_usesoftkeyboard = function ()
	{
		if (this._p_calendaredit)
		{
			this._p_calendaredit.set_usesoftkeyboard(this._getUseSoftKeyboardValue(this._initsoftkeyboard));
		}
	};

	_pCalendar.set_innerdataset = function (v)
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

	_pCalendar.on_apply_innerdataset = function (ds)
	{
		if (ds)
		{
			ds._setEventHandler("onvaluechanged", this._on_dataset_onvaluechanged, this);
			ds._setEventHandler("onrowsetchanged", this._on_dataset_onrowsetchanged, this);
		}

		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._refreshDay();
		}
	};

	_pCalendar.set_backgroundcolumn = function (v)
	{
		if (this._p_backgroundcolumn != v)
		{
			this._p_backgroundcolumn = v;
			this.on_apply_backgroundcolumn(v);
		}
	};

	_pCalendar.on_apply_backgroundcolumn = function (/*backgroundcolumn*/)
	{
		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._refreshDay();
		}
	};

	_pCalendar.set_bordercolumn = function (v)
	{
		if (this._p_bordercolumn != v)
		{
			this._p_bordercolumn = v;
			this.on_apply_bordercolumn(v);
		}
	};

	_pCalendar.on_apply_bordercolumn = function (/*bordercolumn*/)
	{
		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._refreshDay();
		}
	};

	_pCalendar.set_datecolumn = function (v)
	{
		if (this._p_datecolumn != v)
		{
			this._p_datecolumn = v;
			this.on_apply_datecolumn(v);
		}
	};

	_pCalendar.on_apply_datecolumn = function (/*datecolumn*/)
	{
		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._refreshDay();
		}
	};

	_pCalendar.set_textcolorcolumn = function (v)
	{
		if (this._p_textcolorcolumn != v)
		{
			this._p_textcolorcolumn = v;
			this.on_apply_textcolorcolumn(v);
		}
	};

	_pCalendar.on_apply_textcolorcolumn = function (/*textcolorcolumn*/)
	{
		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._refreshDay();
		}
	};

	_pCalendar.set_buttonsize = function (v)
	{
		if (this._p_buttonsize != v)
		{
			this._p_buttonsize = v;
			this.on_apply_buttonsize(v);
		}
	};

	_pCalendar.on_apply_buttonsize = function (/*buttonsize*/)
	{
		this._recalcLayout();
	};

	_pCalendar.set_headheight = function (v)
	{
		if (v !== undefined)
		{
			if (isNaN(v = +v))
			{
				return;
			}
		}

		if (this._p_headheight != v)
		{
			this._p_headheight = v;
			this.on_apply_headheight(v);
		}
	};

	_pCalendar.on_apply_headheight = function (/*headheight*/)
	{
		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._recalcLayout();
		}
	};

	_pCalendar.set_daysize = function (v)
	{
		if (this._p_daysize != v)
		{
			this._p_daysize = v;
			this.on_apply_daysize(v);
		}
	};

	_pCalendar.on_apply_daysize = function (/*daysize*/)
	{
		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._refreshDay();
			datepicker.body._recalcLayout();
		}
	};

	_pCalendar.set_popupsize = function (v)
	{
		if (this._p_popupsize != v)
		{
			this._p_popupsize = v;
		}
	};

	_pCalendar.on_apply_popupsize = nexacro._emptyFn;

	_pCalendar.set_dateformat = function (v)
	{
		if (this._p_dateformat != v)
		{
			this._p_dateformat = v;
			this.on_apply_dateformat(v);
			this.on_apply_value(this._p_value);
		}
	};

	_pCalendar.on_apply_dateformat = function (dateformat)
	{
		var maskobj = this._masktypeobj;
		if (maskobj)
		{
			if (this._type == "system")
				dateformat = this._systemformat;

			maskobj.setDateMask(dateformat);
		}
	};

	_pCalendar.set_editformat = function (v)
	{
		if (this._p_editformat != v)
		{
			this._p_editformat = v;
			this.on_apply_editformat(v);
			this._setValue(this._p_value);
		}
	};

	_pCalendar.on_apply_editformat = function (editformat)
	{
		var maskobj = this._masktypeobj;
		if (maskobj)
		{
			if (this._type == "system")
				editformat = this._systemformat;

			maskobj.setEditMask(editformat);
		}
	};

	_pCalendar.set_headformat = function (v)
	{
		if (this._p_headformat != v)
		{
			this._p_headformat = v;
			this.on_apply_headformat(v);
		}
	};

	_pCalendar.on_apply_headformat = function (/*headformat*/)
	{
		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._setHeadformatText();
		}
	};

	_pCalendar.set_weekformat = function (v)
	{
		if (this._p_weekformat != v)
		{
			this._p_weekformat = v;
			this.on_apply_weekformat(v);
		}
	};

	_pCalendar.on_apply_weekformat = function (/*weekformat*/)
	{
		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._setWeekformatText();
		}
	};

	_pCalendar.set_usetrailingday = function (v)
	{
		v = nexacro._toBoolean(v);
		if (this._p_usetrailingday != v)
		{
			this._p_usetrailingday = v;
			this.on_apply_usetrailingday(v);
		}
	};

	_pCalendar.on_apply_usetrailingday = function (/*usetrailingday*/)
	{
		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._refreshDay();
		}
	};

	_pCalendar.set_showmonthspin = function (v)
	{
		v = nexacro._toBoolean(v);
		if (this._p_showmonthspin != v)
		{
			this._p_showmonthspin = v;
			this.on_apply_showmonthspin(v);
		}
	};

	_pCalendar.on_apply_showmonthspin = function (/*showmonthspin*/)
	{
		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._refreshSpindate();
		}
	};

	_pCalendar.set_showyearspin = function (v)
	{
		v = nexacro._toBoolean(v);
		if (this._p_showyearspin != v)
		{
			this._p_showyearspin = v;
			this.on_apply_showyearspin(v);
		}
	};

	_pCalendar.on_apply_showyearspin = function (/*showyearspin*/)
	{
		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._refreshSpindate();
		}
	};

	_pCalendar.on_apply_accessibility = function ()
	{
		nexacro.Component.prototype.on_apply_accessibility.call(this);
		if (this._p_calendaredit)
		{
			this._p_calendaredit.on_apply_accessibility();
		}
	};

	_pCalendar.set_visible = function (v)
	{
		nexacro.Component.prototype.set_visible.call(this, v);

		if (!this._p_visible && this._isPopupVisible())
		{
			this._closePopup();
		}
	};

	_pCalendar.set_datepickerchangetype = function (v)
	{
		var type_enum = ["auto", "spin", "button"];
		if (type_enum.indexOf(v) == -1)
		{
			return;
		}

		if (this._p_datepickerchangetype != v)
		{
			this._p_datepickerchangetype = v;
			this.on_apply_datepickerchangetype(v);
		}
	};

	_pCalendar.on_apply_datepickerchangetype = function (v)
	{

	};

	_pCalendar.on_apply_prop_stringresource = function ()
	{
		if (!nexacro._StringResource)
			return;

		nexacro.Component.prototype.on_apply_prop_stringresource.call(this);

		this.on_apply_displaynulltext(this._getStringResourceProperty(this._p_displaynulltext));
		this.on_apply_displayinvalidtext(this._getStringResourceProperty(this._p_displayinvalidtext));
	};

	_pCalendar._properties = [{ name: "text" }, { name: "value" }, { name: "displaynulltext" }, { name: "displayinvalidtext" }, { name: "readonly" }, { name: "autoselect" },
	{ name: "autoskip" }, { name: "type" }, { name: "datepickerchangetype" }, { name: "popuptype" }, { name: "locale" }, { name: "usecontextmenu" }, { name: "usesoftkeyboard" },
	{ name: "innerdataset" }, { name: "backgroundcolumn" }, { name: "bordercolumn" }, { name: "datecolumn" }, { name: "textcolorcolumn" }, { name: "buttonsize" }, { name: "headheight" },
	{ name: "daysize" }, { name: "popupsize" }, { name: "dateformat" }, { name: "editformat" }, { name: "headformat" }, { name: "weekformat" }, { name: "monthformat" }, { name: "yearformat" },
	{ name: "usetrailingday" }, { name: "showmonthspin" }, { name: "showyearspin" }, { name: "visible" }, { name: "calendaredit", readonly: true }, { name: "calendarspindownbutton", readonly: true }, { name: "calendarspinupbutton", readonly: true }, { name: "datepicker", readonly: true }, { name: "dropbutton", readonly: true }];

	nexacro._defineProperties(_pCalendar, _pCalendar._properties);

	//===============================================================
	// nexacro.Calendar : Methods
	//===============================================================
	_pCalendar.dropdown = function ()
	{
		if (!this._p_enable || this._p_readonly || !this._p_visible || this._type == "system")
		{
			return false;
		}

		if (this._isPopupVisible())
		{
			return false;
		}

		this._setFocus(false);

		this._showPopup();
		this._setZeroCaret();
	};

	_pCalendar.isDropdown = function ()
	{
		return this._isPopupVisible();
	};

	_pCalendar.getCaretPos = function ()
	{
		if (this._p_readonly)
		{
			return -1;
		}

		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			return calendaredit.getCaretPos();
		}

		return -1;
	};

	_pCalendar.setCaretPos = function (v)
	{
		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			this._change_caret_from_method = true;

			return calendaredit.setCaretPos(v);
		}
	};

	_pCalendar.getSelect = function ()
	{
		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			return calendaredit.getSelect();
		}

		return [0, 0];
	};

	_pCalendar.setSelect = function (begin, end)
	{
		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			this._change_caret_from_method = true;

			return calendaredit.setSelect(begin, end);
		}
		return false;
	};

	_pCalendar.getSelectedText = function ()
	{
		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			return calendaredit.getSelectedText();
		}

		return "";
	};

	_pCalendar.getInnerDataset = function ()
	{
		return this._innerdataset;
	};

	_pCalendar.setInnerDataset = function (obj)
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
			this.on_apply_innerdataset(this._innerdataset);
		}
	};

	_pCalendar.getYear = function ()
	{
		var ret = 1970;
		if (this._p_value)
		{
			var maskobj = this._masktypeobj;
			if (maskobj)
			{
				return maskobj._dateObj.getFullYear();
			}
		}
		return ret;
	};

	_pCalendar.getMonth = function ()
	{
		var ret = 1;
		if (this._p_value)
		{
			var maskobj = this._masktypeobj;
			if (maskobj)
			{
				return maskobj._dateObj.getMonth() + 1;
			}
		}
		return ret;
	};

	_pCalendar.getDay = function ()
	{
		var ret = 1;
		if (this._p_value)
		{
			var maskobj = this._masktypeobj;
			if (maskobj)
			{
				return maskobj._dateObj.getDate();
			}
		}
		return ret;
	};

	_pCalendar.getDayOfWeek = function ()
	{
		var ret = 4;
		if (this._p_value)
		{
			var maskobj = this._masktypeobj;
			if (maskobj)
			{
				return maskobj._dateObj.getDay();
			}
		}
		return ret;
	};

	_pCalendar.updateToDataset = function ()
	{
		return this.applyto_bindSource("value", this._p_value);
	};

	//===============================================================
	// nexacro.Calendar : Event Handlers
	//===============================================================
	_pCalendar._on_value_change = function (prevalue, postvalue)
	{
		if (this._beginValueChange())
		{
			return false;
		}

		var ret = true;
		var bclose = false;
		var pretext = this._getEventInfoText(prevalue);
		var posttext = this._getEventInfoText(postvalue);

		if (!this.on_fire_canchange(this, pretext, prevalue, posttext, postvalue))
		{
			ret = false;
		}
		else if (!this.applyto_bindSource("value", postvalue))
		{
			bclose = true;
			ret = false;
		}

		if (!ret)
		{
			this._p_value = prevalue;
			var maskobj = this._masktypeobj;
			var packeddate = maskobj.changeNormalizeValue(prevalue);
			this.on_apply_value(packeddate);
			if (bclose)
			{
				if (this._isPopupVisible())
				{
					this._closePopup();
				}
			}
		}
		else
		{
			if (this._p_value != prevalue)            
			{
				if (this._p_value != postvalue)
				{
					if (this._isPopupVisible())
					{
						this._closePopup();
					}
					ret = false;
				}
			}
		}

		if (ret)
		{
			this._setValue(postvalue);

			this._default_value = prevalue;
			this._default_text = pretext;

			// focus 이동으로 발생한 valuechange 아닐 때(엔터키) caret을 0으로 초기화
			// Edit와 MaskEdit 동작과 동일 처리 및 스펙 확인
			if (this._is_killfocusing == false)
			{
				this._setZeroCaret();
			}

			this.on_fire_onchanged(this, pretext, prevalue, posttext, postvalue);

			if (this._isPopupVisible())
			{
				this._closePopup();
			}
		}

		this._finalValueChange();

		return ret;
	};

	_pCalendar._on_dataset_onvaluechanged = function (obj, e)
	{
		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._refreshDay();
		}

		if (this._is_created)
		{
			this.on_fire_oninnerdatachanged(obj, e.oldvalue, e.newvalue, e.columnid, e.col, e.row);
		}
	};

	_pCalendar._on_dataset_onrowsetchanged = function (/*obj, e*/)
	{
		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._refreshDay();
		}
	};

	_pCalendar._on_edit_oneditclick = function (obj, e)
	{
		this.on_fire_oneditclick(obj, e.caretpos, e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.fromobject, e.fromreferenceobject, e.metakey);

		var is_popup = (this._type == "system" && !this._p_readonly);
		var is_control = this.getElement() ? true : false;

		if (!is_popup || !is_control)
		{
			return;
		}

		this._p_calendaredit._prevent_clickevent = false;

		var ret = this.on_fire_ondropdown(this);
		if (ret)
		{
			var use_timer = false;
			var delay = -1;

			if (obj instanceof nexacro.MaskEdit)
			{
				if (nexacro._OS == "iOS" && nexacro._Browser == "MobileSafari")
				{
					// iOS 16이상에서 date type input에서 focus를 다른 node로 옮기면 MobileSafari 앱 죽는 버그 회피					
					var ios_ver = parseFloat(nexacro._OSVersion);
					if (ios_ver < 15)
					{
						// 기존 코드도 특정 버전에서 팝업 처리를 위한 것으로 버전 분기
						// popup 나타나지 않는 건(91003, 89778)으로 추가된 코드이기 때문에 조건 안으로 원복
						this.dropbutton._control_element.setElementFocus();
						const enableaccessibilty = this._env._p_enableaccessibility;
						if (nexacro._SystemType == "ipad")
						{
							if (ios_ver >= 13)
							{
								// ipad는 딜레이가 더필요함.
								if (!enableaccessibilty)
									use_timer = true;
								delay = 350;
							}
						}
						else if (nexacro._SystemType == "iphone")
						{
							if (ios_ver >= 14)
							{
								if (!enableaccessibilty)
									use_timer = true;
								delay = 5;
							}
						}
					}
				}
			}

			if (use_timer)
			{
				var pThis = this;
				setTimeout(function ()
				{
					nexacro._openSystemCalendar(pThis, pThis._p_value, "_on_notify_mobile_valuechanged");
				}, delay);
			}
			else
			{
				nexacro._openSystemCalendar(this, this._p_value, "_on_notify_mobile_valuechanged");
			}
		}

		this._p_calendaredit._prevent_clickevent = true;
	};

	_pCalendar._on_edit_onlbuttondown = function (/*obj, e*/)
	{
		if (this._p_readonly)
		{
			return false;
		}

		if (this._isPopupVisible())
		{
			this._closePopup();
		}
	};

	_pCalendar._on_edit_onlbuttonup = function (/*obj, e*/)
	{
		//
	};

	_pCalendar._on_edit_onkeydown = function (obj, e)
	{
		var keycode = e.keycode;
		var calendaredit = this._p_calendaredit;
		var datepicker = this._p_datepicker;

		switch (this._p_type)
		{
			case "normal":
				if (keycode == nexacro.Event.KEY_ESC)
				{
					if (this._isPopupVisible())
					{
						this._closePopup();
					}
					this._setZeroCaret();
				}
				else if (keycode == nexacro.Event.KEY_ENTER)
				{
					if (this._isPopupVisible())
					{
						if (this._p_datepickerchangetype != "button" || datepicker.head.monthstatic._p_visible)
						{
							datepicker._changeDate(obj, e);
							datepicker.on_fire_ondayclick(datepicker._value);
						}
						else
						{
							datepicker._on_body_onkeydown(obj, e);
						}
					}
					else
					{
						if (this._p_value != calendaredit._p_value)
						{
							this._on_value_change(this._p_value, calendaredit._p_value);
						}
						else if (this._p_text != calendaredit._p_text)
						{
							this._setValue(this._p_value);
						}
					}
				}
				else if (e.altkey && keycode == nexacro.Event.KEY_DOWN)
				{
					if (!this._isPopupVisible())
					{
						this._showPopup();
						this._setZeroCaret();

						if (calendaredit && this.datepicker)
						{
							var value = calendaredit._p_value ? calendaredit._p_value : this._p_datepicker._value;
							this._setDatePickerValue(value);
						}
					}
				}
				else
				{
					if (this._isPopupVisible())
					{
						if (keycode >= nexacro.Event.KEY_LEFT && keycode <= nexacro.Event.KEY_DOWN)
						{
							datepicker._on_body_onkeydown(obj, e);
						}
					}
				}
				break;
			case "spin":
				if (keycode == nexacro.Event.KEY_ENTER)
				{
					if (this._p_value != calendaredit._p_value)
					{
						this._on_value_change(this._p_value, calendaredit._p_value);
					}
					else if (this._p_text != calendaredit._p_text)
					{
						this._setValue(this._p_value);
					}
					this._setZeroCaret();
				}
				else if (keycode == nexacro.Event.KEY_UP)
				{
					if (!this._env._p_enableaccessibility || e.ctrlkey)
					{
						this._on_spin_onspinup(obj, e);
					}
				}
				else if (keycode == nexacro.Event.KEY_DOWN)
				{
					if (!this._env._p_enableaccessibility || e.ctrlkey)
					{
						this._on_spin_onspindown(obj, e);
					}
				}

				break;
			case "monthonly":
				if (keycode >= nexacro.Event.KEY_LEFT && keycode <= nexacro.Event.KEY_DOWN)
				{
					datepicker.on_keydown_default_action(keycode, e.altkey, e.ctrlkey, e.shiftkey, e.fromreferenceobject, e.metakey);
					datepicker._refreshSpindate();
					datepicker.on_fire_ondayclick(datepicker);
				}
				break;
			default:
				break;
		}

		if (keycode >= nexacro.Event.KEY_LEFT && keycode <= nexacro.Event.KEY_DOWN)
		{
			if (this._isPopupVisible())
			{
				calendaredit._input_element.stopSysEvent();
			}
			else
			{
				if (keycode == nexacro.Event.KEY_UP || keycode == nexacro.Event.KEY_DOWN)
				{
					if (nexacro._Browser != "Runtime")
						calendaredit._input_element.stopSysEvent();
				}
			}
		}
		return false;
	};

	_pCalendar._on_edit_oninput = function (/*obj, e*/)
	{
		var cur_value;
		var maskobj = this._masktypeobj;
		if (maskobj._use_edit_buf)
		{
			cur_value = maskobj.changeNormalizeValueFromBuffer();
		}
		else
		{
			cur_value = maskobj.changeNormalizeValue(this._p_calendaredit._p_value);
		}

		if (this._isPopupVisible())
		{
			this._setDatePickerValue(cur_value);
		}

		this.on_fire_oninput();

		if (this._type == "system")
		{
			if (this._p_value != cur_value)
			{
				this._on_value_change(this._p_value, cur_value);
			}
		}
	};

	_pCalendar._on_notify_mobile_valuechanged = function (v)
	{
		if (this._type == "system")
		{
			this._setCalendarEditValue(v);

			this.on_fire_oninput();

			var cur_value;
			var maskobj = this._masktypeobj;
			if (maskobj)
			{
				if (maskobj._use_edit_buf)
				{
					cur_value = maskobj.changeNormalizeValueFromBuffer();
				}
				else
				{
					cur_value = maskobj.changeNormalizeValue(this._p_calendaredit._p_value);
				}

				if (this._p_value != cur_value)
				{
					this._on_value_change(this._p_value, cur_value);
				}
			}
		}
	};

	_pCalendar._on_drop_onlbuttondown = function (obj, e)
	{
		if (e.button != "lbutton") return;
		if (this._p_readonly || !this._p_enable)
		{
			return false;
		}

		if (this._isPopupVisible())
		{
			this._closePopup();

			if (!this._p_autoselect)
			{
				this._setZeroCaret();
			}
		}
		else
		{
			var datepicker = this._p_datepicker;
			var calendaredit = this._p_calendaredit;

			if (datepicker && calendaredit)
			{
				var value = calendaredit._p_value;
				if (value)
				{
					var binvalid = calendaredit._isInvalidValue(value);
					if (binvalid)
					{
						value = datepicker._value;
					}
				}
				else
				{
					value = datepicker._value;
				}

				this._setDatePickerValue(value);
			}

			this._showPopup();

			if (!this._p_autoselect)
			{
				this._setZeroCaret();
			}
		}

		return false;
	};

	_pCalendar._on_drop_mobile_onclick = function (/*obj, e*/)
	{
		if (this._p_readonly || !this._p_enable)
		{
			return false;
		}

		if (this._isPopupVisible())
		{
			this._closePopup();
		}
		else
		{
			var datepicker = this._p_datepicker;
			var calendaredit = this._p_calendaredit;

			if (datepicker && calendaredit)
			{
				var value = calendaredit._p_value ? calendaredit._p_value : datepicker._value;
				this._setDatePickerValue(value);
			}

			this._showPopup();
		}

		return false;
	};

	_pCalendar._on_drop_onclick = function (obj, e)
	{
		if (e.button != "touch") return;
		if (this._p_readonly || !this._p_enable)
		{
			return false;
		}

		if (this._isPopupVisible())
		{
			this._closePopup();

			if (!this._p_autoselect)
			{
				this._setZeroCaret();
			}
		}
		else
		{
			var datepicker = this._p_datepicker;
			var calendaredit = this._p_calendaredit;

			if (datepicker && calendaredit)
			{
				var value = calendaredit._p_value;
				if (value)
				{
					var binvalid = calendaredit._isInvalidValue(value);
					if (binvalid)
					{
						value = datepicker._value;
					}
				}
				else
				{
					value = datepicker._value;
				}

				this._setDatePickerValue(value);
			}

			this._showPopup();

			if (!this._p_autoselect)
			{
				this._setZeroCaret();
			}
		}

		return false;
	};    // control

	_pCalendar._on_spin_onspinup = function (/*obj, e*/)
	{
		if (this._p_readonly)
		{
			return false;
		}

		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			var cur_text = "";
			var cur_value;

			var pre_text;
			var pre_value = calendaredit._p_value;

			var post_text = "";
			//var post_value;

			var pos = this.getCaretPos();
			var old_pos = pos;
			var end_pos = this._p_calendaredit._p_text.length;

			if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
			{
				if (this._rtl)
				{
					if (pos == 0)
					{
						pos = end_pos;
					}
					else if (pos == end_pos)
					{
						pos = 0;
					}
				}
			}

			var maskobj = this._masktypeobj;
			if (maskobj)
			{
				if (!maskobj.date)
				{
					var cur_date;
					if (calendaredit._p_value)
					{
						var packeddate = maskobj.changeNormalizeValue(calendaredit._p_value);
						cur_date = packeddate;
					}
					else
					{
						var currDate = this._getCurrentDate();
						var year = nexacro._toString(currDate.year).padLeft(4, "0");
						var month = nexacro._toString(currDate.month).padLeft(2, "0");
						var day = nexacro._toString(currDate.day).padLeft(2, "0");
						cur_date = year + month + day;
					}
					var type = maskobj.getEditFormatType();
					switch (type)
					{
						case 0:
							cur_value = cur_date;
							break;
						case 1:
							cur_value = "000000000";
							break;
						case 2:
							cur_value = cur_date + "000000000";
					}

					cur_text = maskobj.applyMask(cur_value);
					cur_text = maskobj.applyMaskSpin(pos, 1);
					this._setSpinValue(cur_value, cur_text, old_pos);
				}
				else
				{
					cur_text = maskobj.applyMaskSpin(pos, 1);
					cur_value = maskobj.changeNormalizeValueFromBuffer();

					pre_text = this._getEventInfoText(pre_value);
					post_text = this._getEventInfoText(cur_value);

					if (!this.on_fire_onspin(this, pre_text, pre_value, post_text, cur_value, "1"))
					{
						cur_text = pre_value ? pre_text : maskobj.applyMask(this._p_value);
						cur_value = pre_value ? pre_value : maskobj.removeMask(cur_text);
					}

					maskobj.applyMask(cur_value);
					this._setSpinValue(cur_value, cur_text, old_pos);
				}
			}
		}
	};

	_pCalendar._on_spin_onspindown = function (/*obj, e*/)
	{
		if (this._p_readonly)
		{
			return false;
		}

		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			var cur_text = "";
			var cur_value;

			var pre_text;
			var pre_value = calendaredit._p_value;

			var post_text = "";
			//var post_value;

			var pos = this.getCaretPos();
			var old_pos = pos;
			var end_pos = this._p_calendaredit._p_text.length;

			if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
			{
				if (this._rtl)
				{
					if (pos == 0)
					{
						pos = end_pos;
					}
					else if (pos == end_pos)
					{
						pos = 0;
					}
				}
			}

			var maskobj = this._masktypeobj;
			if (maskobj)
			{
				if (!maskobj.date)
				{
					var cur_date;
					if (calendaredit._p_value)
					{
						var packeddate = maskobj.changeNormalizeValue(calendaredit._p_value);
						cur_date = packeddate;
					}
					else
					{
						var currDate = this._getCurrentDate();
						var year = nexacro._toString(currDate.year).padLeft(4, "0");
						var month = nexacro._toString(currDate.month).padLeft(2, "0");
						var day = nexacro._toString(currDate.day).padLeft(2, "0");
						cur_date = year + month + day;
					}
					var type = maskobj.getEditFormatType();
					switch (type)
					{
						case 0:
							cur_value = cur_date;
							break;
						case 1:
							cur_value = "000000000";
							break;
						case 2:
							cur_value = cur_date + "000000000";
					}

					cur_text = maskobj.applyMask(cur_value);
					cur_text = maskobj.applyMaskSpin(pos, -1);
					this._setSpinValue(cur_value, cur_text, old_pos);
				}
				else
				{
					cur_text = maskobj.applyMaskSpin(pos, -1);
					cur_value = maskobj.changeNormalizeValueFromBuffer();

					pre_text = this._getEventInfoText(pre_value);
					post_text = this._getEventInfoText(cur_value);

					if (!this.on_fire_onspin(this, pre_text, pre_value, post_text, cur_value, "0"))
					{
						cur_text = pre_value ? pre_text : maskobj.applyMask(this._p_value);
						cur_value = pre_value ? pre_value : maskobj.removeMask(cur_text);
					}

					maskobj.applyMask(cur_value);
					this._setSpinValue(cur_value, cur_text, old_pos);
				}
			}
		}
	};

	_pCalendar._on_spin_mobile_onspinup = function (/*obj, e*/)
	{
		if (this._p_readonly)
		{
			return false;
		}

		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			var cur_text = "";
			var cur_value;

			var pre_text;
			var pre_value = calendaredit._p_value;

			var post_text = "";
			//var post_value;

			var pos = this.getCaretPos();

			var maskobj = this._masktypeobj;
			if (maskobj)
			{
				if (!maskobj.date)
				{
					var currDate = this._getCurrentDate();
					var year = nexacro._toString(currDate.year).padLeft(4, "0");
					var month = nexacro._toString(currDate.month).padLeft(2, "0");
					var day = nexacro._toString(currDate.day).padLeft(2, "0");
					var type = maskobj.getEditFormatType();
					switch (type)
					{
						case 0:
							cur_value = year + month + day;
							break;
						case 1:
							cur_value = "000000000";
							break;
						case 2:
							cur_value = year + month + day + "000000000";
					}

					cur_text = maskobj.applyMask(cur_value);
					this._setSpinValue(cur_value, cur_text, pos);
				}
				else
				{
					cur_text = maskobj.applyMaskSpin(pos, 1);
					cur_value = maskobj.changeNormalizeValueFromBuffer();

					pre_text = this._getEventInfoText(pre_value);
					post_text = this._getEventInfoText(cur_value);

					if (!this.on_fire_onspin(this, pre_text, pre_value, post_text, cur_value, "1"))
					{
						cur_text = pre_value ? pre_text : maskobj.applyMask(this._p_value);
						cur_value = pre_value ? pre_value : maskobj.removeMask(cur_text);
					}

					maskobj.applyMask(cur_value);
					this._setSpinValue(cur_value, cur_text, pos);
				}
			}
		}
	};

	_pCalendar._on_spin_mobile_onspindown = function (/*obj, e*/)
	{
		if (this._p_readonly)
		{
			return false;
		}

		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			var cur_text = "";
			var cur_value;

			var pre_text;
			var pre_value = calendaredit._p_value;

			var post_text = "";
			//var post_value;

			var pos = this.getCaretPos();

			var maskobj = this._masktypeobj;
			if (maskobj)
			{
				if (!maskobj.date)
				{
					var currDate = this._getCurrentDate();
					var year = nexacro._toString(currDate.year).padLeft(4, "0");
					var month = nexacro._toString(currDate.month).padLeft(2, "0");
					var day = nexacro._toString(currDate.day).padLeft(2, "0");
					var type = maskobj.getEditFormatType();
					switch (type)
					{
						case 0:
							cur_value = year + month + day;
							break;
						case 1:
							cur_value = "000000000";
							break;
						case 2:
							cur_value = year + month + day + "000000000";
					}

					cur_text = maskobj.applyMask(cur_value);
					this._setSpinValue(cur_value, cur_text, pos);
				}
				else
				{
					cur_text = maskobj.applyMaskSpin(pos, -1);
					cur_value = maskobj.changeNormalizeValueFromBuffer();

					pre_text = this._getEventInfoText(pre_value);
					post_text = this._getEventInfoText(cur_value);

					if (!this.on_fire_onspin(this, pre_text, pre_value, post_text, cur_value, "0"))
					{
						cur_text = pre_value ? pre_text : maskobj.applyMask(this._p_value);
						cur_value = pre_value ? pre_value : maskobj.removeMask(cur_text);
					}

					maskobj.applyMask(cur_value);
					this._setSpinValue(cur_value, cur_text, pos);
				}
			}
		}
	};

	_pCalendar._on_datepicker_ondayclick = function (obj, e)
	{
		if (this._p_readonly)
			return;

		var maskobj = this._masktypeobj;

		var from_comp = e.fromobject;
		var cur_date = from_comp._year + from_comp._month + from_comp._p_text.padLeft(2, "0");

		var h = maskobj._date[3] ? maskobj._date[3] : "";
		var m = maskobj._date[4] ? maskobj._date[4] : "";
		var s = maskobj._date[5] ? maskobj._date[5] : "";
		var ss = maskobj._date[6] ? maskobj._date[6] : "";

		var editmast_type = maskobj.getEditFormatType();

		var pre_value = this._p_value;
		var cur_value;
		if (editmast_type == 1)
		{
			if (!nexacro._isNull(h)) h = h.padLeft(2, "0");
			if (!nexacro._isNull(m)) m = m.padLeft(2, "0");
			if (!nexacro._isNull(s)) s = s.padLeft(2, "0");
			if (!nexacro._isNull(ss)) ss = ss.padLeft(3, "0");

			cur_value = maskobj.changeNormalizeValue(h + m + s + ss);
		}
		else
		{
			cur_value = maskobj.changeNormalizeValue(cur_date + h + m + s + ss);
		}

		this.on_fire_ondayclick(cur_date);

		if (pre_value != cur_value)
		{
			this._on_value_change(pre_value, cur_value);

			if (this._p_type == "monthonly" && from_comp)
			{
				from_comp._changeStatus("focused", false);
			}
		}
		else
		{
			this._setCalendarEditValue(this._p_value);

			if (this._isPopupVisible())
			{
				this._closePopup();
			}
		}

		if (this._p_autoskip)
		{
			this._setFocusToNextComponent();
		}
	};

	_pCalendar._on_datepicker_oncloseup = function (/*obj, e*/)
	{
		var _window = this._getWindow();
		if (_window && this._track_capture)
		{
			_window._releaseCaptureLock(this);
		}

		this._changeStatus("mouseover", false);
		this._p_calendaredit._changeStatus("mouseover", false);
		this._p_dropbutton._changeStatus("mouseover", false);

		this.on_fire_oncloseup(this, this._default_text, this._default_value, this._p_text, this._p_value);
	};

	_pCalendar.on_focus_basic_action = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
	{
		this._changeStatus("focused", true);

		if (this._p_type == "monthonly")
		{
			this._p_datepicker.body._apply_setfocus(evt_name);
		}

		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);
			if (bMobile && refer_new_focus instanceof nexacro.Calendar)
			{
				if ((this._p_type != "spin" && this._p_popuptype != "none" && (evt_name == "lbuttondown" || evt_name == "tap")) || this._type == "system")
				{
					var control_elem = this.getElement();
					if (control_elem)
					{
						control_elem.setElementFocus(true);
					}
				}
				else
				{
					calendaredit._on_focus(true, nexacro._getBrowserEventName(evt_name));
				}
			}
			else
			{
				calendaredit._on_focus(true, nexacro._getBrowserEventName(evt_name));
			}
		}

		this._change_caret_from_method = false;
	};

	_pCalendar.on_killfocus_basic_action = function (/*new_focus, new_refer_focus*/)
	{
		nexacro.Component.prototype.on_killfocus_basic_action.call(this);

		var calendaredit = this._p_calendaredit;
		var datepicker = this._p_datepicker;

		if (this._p_type != "monthonly")
		{
			if (this._p_value != calendaredit._p_value)
			{
				this._on_value_change(this._p_value, calendaredit._p_value);
			}
			else if (this._p_text != calendaredit._p_text)
			{
				this._setValue(this._p_value);
			}

			this.__focus_from_spinbutton = false;

			// monthonly type에서는 동작하지 않는 함수라 옮김
			if (this._isPopupVisible())
			{
				this._closePopup();
			}

			// MaskEdit 말고 Calendar 시점에서 blur 처리 (focused status 변경)
			if (calendaredit && !calendaredit._onlydisplay)
			{
				var _win = this._getRootWindow();
				if (_win)
				{
					var idx = _win._indexOfCurrentFocusPaths(this);
					if (idx < 0)
					{
						var input_elem = calendaredit._input_element;
						if (input_elem)
						{
							input_elem._setElementLastSelectionRange();
							input_elem.setElementBlur();
						}
					}
				}
			}
		}
		else
		{
			if (datepicker)
			{
				datepicker._refreshSpindate();
			}

			this.on_apply_value(this._p_value);
		}
	};

	_pCalendar.on_fire_sys_onmousewheel = function (wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
	{
		nexacro.Component.prototype.on_fire_user_onmousewheel.call(this, wheelDeltaX, wheelDeltaY, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

		return (this._popupcontrol && this._popupcontrol._is_popup()) ? true : false;
	};

	_pCalendar.on_fire_sys_onslide = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
	{
		var ret = nexacro.Component.prototype.on_fire_sys_onslide.call(this, elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp);

		this._updatePopupControlPosition();

		return ret;
	};

	_pCalendar.on_fire_sys_onfling = function (elem, fling_handler, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp)
	{
		var ret = nexacro.Component.prototype.on_fire_sys_onfling.call(this, elem, fling_handler, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp);

		this._updatePopupControlPosition();

		return ret;
	};

	_pCalendar.on_fire_oneditclick = function (obj, caretpos, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
	{
		if (this._p_visible && this._isEnable() && this._p_enableevent)
		{
			if (this.oneditclick && this.oneditclick._has_handlers)
			{
				var evt = new nexacro.EditClickEventInfo(this, "oneditclick", caretpos, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key);
				return this.oneditclick._fireEvent(this, evt);
			}
		}

		return true;
	};

	_pCalendar.on_fire_ondayclick = function (postdate)
	{
		if (this.ondayclick && this.ondayclick._has_handlers)
		{
			var evt = new nexacro.CalendarDayClickEventInfo(this, "ondayclick", postdate);
			return this.ondayclick._fireEvent(this, evt);
		}

		return true;
	};

	_pCalendar.on_fire_canchange = function (obj, pretext, prevalue, posttext, postvalue)
	{
		if (this.canchange && this.canchange._has_handlers)
		{
			var evt = new nexacro.ChangeEventInfo(this, "canchange", pretext, prevalue, posttext, postvalue);
			return this.canchange._fireCheckEvent(this, evt);
		}

		return true;
	};

	_pCalendar.on_fire_onchanged = function (obj, pretext, prevalue, posttext, postvalue)
	{
		if (this.onchanged && this.onchanged._has_handlers)
		{
			var evt = new nexacro.ChangedEventInfo(this, "onchanged", pretext, prevalue, posttext, postvalue);
			return this.onchanged._fireEvent(this, evt);
		}
	};

	_pCalendar.on_fire_oncloseup = function (obj, pretext, prevalue, posttext, postvalue)
	{
		if (this.oncloseup && this.oncloseup._has_handlers)
		{
			var evt = new nexacro.CalendarCloseUpEventInfo(this, "oncloseup", pretext, posttext, prevalue, postvalue);
			return this.oncloseup._fireEvent(this, evt);
		}

		return false;
	};

	_pCalendar.on_fire_ondropdown = function (obj)
	{
		if (this.ondropdown && this.ondropdown._has_handlers)
		{
			var evt = new nexacro.Event(this, "ondropdown");
			evt.fromreferenceobject = this._p_dropbutton;
			return this.ondropdown._fireCheckEvent(this, evt);
		}

		return true;
	};

	_pCalendar.on_fire_oninput = function ()
	{
		if (this.oninput && this.oninput._has_handlers)
		{
			var evt = new nexacro.InputEventInfo(this, "oninput");
			return this.oninput._fireEvent(this, evt);
		}

		return true;
	};

	_pCalendar.on_fire_onspin = function (obj, pretext, prevalue, posttext, postvalue, isUp)
	{
		if (this.onspin && this.onspin._has_handlers)
		{
			var evt = new nexacro.CalendarSpinEventInfo(this, "onspin", pretext, posttext, prevalue, postvalue, isUp);
			return this.onspin._fireCheckEvent(this, evt);
		}

		return true;
	};

	_pCalendar.on_fire_oninnerdatachanged = function (obj, oldvalue, newvalue, columnid, col, row)
	{
		if (this.oninnerdatachanged && this.oninnerdatachanged._has_handlers)
		{
			var evt = new nexacro.InnerdataChangedEventInfo(obj, "oninnerdatachanged", oldvalue, newvalue, columnid, col, row);
			return this.oninnerdatachanged._fireEvent(this, evt);
		}

		return true;
	};

	//===============================================================
	// nexacro.Calendar : Logical Part
	//===============================================================
	_pCalendar._createCalendaredit = function ()
	{
		var calendaredit = this._p_calendaredit;
		if (!calendaredit)
		{
			calendaredit = this._p_calendaredit = new nexacro._CalendarEditControl("calendaredit", 0, 0, 0, 0, null, null, null, null, null, null, this, this._onlydisplay);
			calendaredit.set_displaynulltext(this._p_displaynulltext);
			calendaredit.set_readonly(this._p_readonly);
			calendaredit.set_autoselect(this._p_autoselect);
			calendaredit.set_autoskip(this._p_autoskip);
			calendaredit.set_usecontextmenu(this._p_usecontextmenu);

			calendaredit.createComponent(true);
		}
	};

	_pCalendar._createDropbutton = function ()
	{
		var dropbutton = this._p_dropbutton;
		if (!dropbutton)
		{
			dropbutton = this._p_dropbutton = new nexacro._CalendarDropButtonControl("dropbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
			dropbutton.createComponent(true);
		}
	};

	_pCalendar._createSpinbutton = function ()
	{
		var spinupbutton = this._p_calendarspinupbutton;
		if (!spinupbutton)
		{
			spinupbutton = this._p_calendarspinupbutton = new nexacro._CalendarSpinButtonControl("calendarspinupbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
			spinupbutton.createComponent(true);
		}
		var spindownbutton = this._p_calendarspindownbutton;
		if (!spindownbutton)
		{
			spindownbutton = this._p_calendarspindownbutton = new nexacro._CalendarSpinButtonControl("calendarspindownbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
			spindownbutton.createComponent(true);
		}
	};

	_pCalendar._createDatePicker = function ()
	{
		var datepicker = this._p_datepicker;
		if (!datepicker)
		{
			datepicker = this._p_datepicker = new nexacro.DatePickerControl("datepicker", 0, 0, 0, 0, null, null, null, null, null, null, this);
			if (this._p_type == "monthonly")
			{
				datepicker._is_focus_accept = true;
			}
			else
			{
				datepicker._setPopupContains(true);
				datepicker._is_focus_accept = false;
			}

			datepicker.createComponent(true);
		}
	};

	_pCalendar._createPopupControl = function ()
	{
		var popupcontrol = this._popupcontrol;
		if (!popupcontrol)
		{
			popupcontrol = this._popupcontrol = new nexacro._CalendarPopupControl("calendarpopup", 0, 0, 0, 0, null, null, null, null, null, null, this);
			popupcontrol.createComponent(true);
		}
	};

	_pCalendar._createNormaltypeControl = function ()
	{
		var control_elem = this.getElement();
		if (control_elem)
		{
			this._createCalendaredit();
			this._createDropbutton();
			this._createPopupControl();
			this._createDatePicker();
			this._setEventHandlerToCalendarEdit();
			this._setEventHandlerToDropButton();
			this._setEventHandlerToDatePicker();
			this._applyAllProps();

			if (this._is_created)
			{
				var calendaredit = this._p_calendaredit;
				var dropbutton = this._p_dropbutton;

				if (calendaredit)
				{
					calendaredit._on_apply_inputtype();
					calendaredit.on_created();
				}

				if (dropbutton)
				{
					dropbutton.on_created();
				}
			}
		}
	};

	_pCalendar._createSpintypeControl = function ()
	{
		var control_elem = this.getElement();
		if (control_elem)
		{
			this._createCalendaredit();
			this._createSpinbutton();
			this._setEventHandlerToCalendarEdit();
			this._setEventHandlerToSpinButton();
			this._applyAllProps();

			if (this._is_created)
			{
				var calendaredit = this._p_calendaredit;
				var spinupbutton = this._p_calendarspinupbutton;
				var spindownbutton = this._p_calendarspindownbutton;

				if (calendaredit)
				{
					calendaredit.on_created();
				}
				if (spinupbutton)
				{
					spinupbutton.on_created();
				}
				if (spindownbutton)
				{
					spindownbutton.on_created();
				}
			}
		}
	};

	_pCalendar._createMonthlytypeControl = function ()
	{
		var control_elem = this.getElement();
		if (control_elem)
		{
			this._createDatePicker();
			this._setEventHandlerToDatePicker();
			this._applyDatePickerProps();

			if (this._is_created)
			{
				var datepicker = this._p_datepicker;
				if (datepicker)
				{
					datepicker.on_created();
				}
			}
		}
	};

	_pCalendar._createSystemtypeControl = function ()
	{
		var control_elem = this.getElement();
		if (control_elem)
		{
			this._createCalendaredit();
			this._setEventHandlerToCalendarEdit();
			this._applyAllProps();

			if (this._is_created)
			{
				var calendaredit = this._p_calendaredit;

				if (calendaredit)
				{
					calendaredit._on_apply_inputtype();

					calendaredit.on_created();
				}
			}
		}
	};

	_pCalendar._createPopupDatePickerControl = function ()
	{
		this._createPopupControl();
		this._createDatePicker();

		var datepicker = this._p_datepicker;
		var popupcontrol = this._popupcontrol;
		if (!popupcontrol._is_created)
		{
			popupcontrol._attach(datepicker);
			popupcontrol.on_created();
		}
		if (!datepicker._is_created)
		{
			this._setEventHandlerToDatePicker();
			this._applyDatePickerProps();
			datepicker.on_created();
		}
	};

	_pCalendar._destroyControl = function ()
	{
		if (this._p_calendaredit)
		{
			this._p_calendaredit.destroy();
			this._p_calendaredit = null;
		}
		if (this._p_dropbutton)
		{
			this._p_dropbutton.destroy();
			this._p_dropbutton = null;
		}
		if (this._p_calendarspinupbutton)
		{
			this._p_calendarspinupbutton.destroy();
			this._p_calendarspinupbutton = null;
		}
		if (this._p_calendarspindownbutton)
		{
			this._p_calendarspindownbutton.destroy();
			this._p_calendarspindownbutton = null;
		}
		if (this._p_datepicker)
		{
			this._p_datepicker.destroy();
			this._p_datepicker = null;
		}
		if (this._popupcontrol)
		{
			this._popupcontrol.destroy();
			this._popupcontrol = null;
		}
	};

	_pCalendar._recalcLayout = function ()
	{
		if (this._is_created_contents)
		{
			var calendaredit = this._p_calendaredit;
			var dropbutton = this._p_dropbutton;
			var spinupbutton = this._p_calendarspinupbutton;
			var spindownbutton = this._p_calendarspindownbutton;
			var datepicker = this._p_datepicker;

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
				buttonsize = buttonsize.split(" ");
				buttonsize_w = +buttonsize[0];
				buttonsize_h = (buttonsize[1]) ? +buttonsize[1] : client_height;
			}

			if (buttonsize_w > client_width) // width over, second
				buttonsize_w = client_width;
			if (buttonsize_h > client_height) // height over, second
				buttonsize_h = client_height;

			switch (this._type)
			{
				case "system":
				case "normal":
					var button_l = client_width - buttonsize_w;
					var button_t = 0;

					if (buttonsize_h < client_height)
						button_t = (client_height - buttonsize_h) / 2;

					dropbutton.move(button_l, button_t, buttonsize_w, buttonsize_h, null, null);
					calendaredit.move(0, 0, button_l, client_height, null, null);

					calendaredit.set_visible(true);
					dropbutton.set_visible(true);
					break;
				case "spin":
					var upbutton_l = client_width - buttonsize_w;
					var upbutton_t = 0;
					var upbutton_h = Math.floor(buttonsize_h / 2);

					if (buttonsize_h < client_height)
						upbutton_t = (client_height - buttonsize_h) / 2;

					var downbutton_l = upbutton_l;
					var downbutton_t = buttonsize_h - upbutton_h + upbutton_t;
					var downbutton_h = Math.floor(buttonsize_h / 2);

					spinupbutton.move(upbutton_l, upbutton_t, buttonsize_w, upbutton_h, null, null);
					spindownbutton.move(downbutton_l, downbutton_t, buttonsize_w, downbutton_h, null, null);
					calendaredit.move(0, 0, upbutton_l, client_height, null, null);

					calendaredit.set_visible(true);
					spinupbutton.set_visible(true);
					spindownbutton.set_visible(true);
					break;
				case "monthonly":
					this._applyDatePickerProps();
					datepicker.move(0, 0, client_width, client_height, null, null);
					datepicker.set_visible(true);
					break;

			}
		}
	};

	_pCalendar._updatePopupControlPosition = function ()
	{
		var popupcontrol = this._popupcontrol;
		if (popupcontrol)
		{
			var control_elem = this.getElement();
			var popup_control_elem = popupcontrol.getElement();

			var pos = this._getElementPosition(control_elem);

			// TODO Element의 bottom 좌표를 바로 얻는 API로 바꾸는게 바람직 (현재 없음)
			var left = pos.x;
			var top = pos.y + (this._adjust_height);

			popup_control_elem.setElementPosition(left, top);
		}
	};

	_pCalendar._accessibility_showPopup = nexacro._emptyFn;
	_pCalendar._showPopup = function ()
	{
		if (this._p_type != "normal")
		{
			return;
		}

		var _window = this._getWindow();
		var control_elem = this.getElement();
		if (control_elem)
		{
			var ret = this.on_fire_ondropdown(this);

			if (this._p_popuptype == "none" || this._type == "system")
			{
				return;
			}

			if (ret)
			{
				this._createPopupDatePickerControl();
				var popupcontrol = this._popupcontrol;
				var popupsize = this._getPopupSizeArr();

				var pos = this._getElementPosition();
				var cal_winpos_left = pos.x;
				var cal_winpos_top = pos.y;

				var parentpos = popupcontrol._getPopupParentPos();

				var cal_height = parentpos.height;

				var popup_left = 0;
				var popup_top = cal_height;
				var popup_width = popupsize.width;
				var popup_height = popupsize.height;

				var popup_winpos_right = cal_winpos_left + popup_width;
				var popup_winpos_bottom = cal_winpos_top + cal_height + popup_height;

				/* 물리적 window 기준으로 w/h를 잡는다.*/

				var win_width = nexacro._getWindowHandleClientWidth(_window.handle);//_window.clientWidth;
				var win_height = nexacro._getWindowHandleClientHeight(_window.handle);//_window.clientHeight;
				var width_gap = popup_winpos_right - win_width;

				/* popup에 초점을 읽게하기 위함 */
				if (this._env._p_enableaccessibility)
				{
					this._accessibility_showPopup();
				}

				if (popup_winpos_right > win_width && cal_winpos_left > width_gap)
				{
					popup_left = popup_left - width_gap;
				}

				if (cal_winpos_left < 0)
				{
					popup_left = -cal_winpos_left;
				}

				if (cal_winpos_top > popup_height && popup_winpos_bottom > win_height)
				{
					popup_top = -popup_height;
				}

				if (popup_winpos_bottom > win_height)
				{
					var t_temp = win_height - popup_height;
					if (t_temp < 0)
						popup_top = -cal_winpos_top;
					else if (popup_height > cal_winpos_top)
						popup_top = t_temp - cal_winpos_top;
				}

				// 팝업도 동일 비율로 확대/축소

				if (this._p_popuptype == "center")
				{
					// root 기준 중앙
					var frame = _window.root;
					var frame_pos = { x: 0, y: 0 };
					var width = 0;
					var height = 0;


					frame_pos = nexacro._getElementPositionInFrame(frame.getElement());
					width = frame._p_width;
					height = frame._p_height;

					if (nexacro._Browser == "Runtime")
					{
						// screen 높이에 따라 계산 되어야 하므로 보정 
						width = Math.round(width / nexacro._getDevicePixelRatio(this.getElement()));
						height = Math.round(height / nexacro._getDevicePixelRatio(this.getElement()));
					}


					var l = ((width / 2) - (popup_width / 2));
					var t = ((height / 2) - (popup_height / 2));

					t = t < 0 ? 0 : t;

					popupcontrol._popup((l + frame_pos.x), (t + frame_pos.y), popup_width, popup_height);
				}
				else
				{
					popupcontrol._popupBy(this, popup_left + parentpos.xgap, popup_top + parentpos.ygap, popup_width, popup_height);
				}

				if (_window && this._track_capture)
				{
					_window._setCaptureLock(this, true, false);
				}
			}
		}
	};

	_pCalendar._applyZoomPopup = function ()
	{
		if (this._isPopupVisible())
		{
			this._showPopup();
		}
	};

	_pCalendar._accessibility_closePopup = nexacro._emptyFn;
	_pCalendar._closePopup = function ()
	{
		if (this._type == "system")
		{
			nexacro._closeSystemCalendar();
			return;
		}
		else
		{
			var popupcontrol = this._popupcontrol;
			if (popupcontrol)
			{
				popupcontrol._closePopup();
			}
		}

		if (this._env._p_enableaccessibility)
		{
			this._accessibility_closePopup();
		}
	};

	_pCalendar._setContents = function (str)
	{
		var ds = this._convertObjectContents(str);
        if(ds)
        {
            this.set_innerdataset(ds); 
            return true;
        }
        return false;
	};

	_pCalendar._on_repeat = function (fromComp)
	{
		var type = this._type;
		var fromObject = fromComp;

		if (type == "spin")
		{
			var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);

			if (bMobile)
			{
				if (fromObject.id == "calendarspinupbutton")
					this._on_spin_mobile_onspinup();
				else if (fromObject.id == "calendarspindownbutton")
					this._on_spin_mobile_onspindown();
			}
			else
			{
				if (fromObject.id == "calendarspinupbutton")
					this._on_spin_onspinup();
				else if (fromObject.id == "calendarspindownbutton")
					this._on_spin_onspindown();
			}
		}
		else
		{
			var parentObject = fromComp._p_parent;

			if (fromObject.id == "spinupbutton")
				parentObject._on_spin_up();
			else if (fromObject.id == "spindownbutton")
				parentObject._on_spin_down();
			else if (fromObject.id == "nextbutton")
				this._p_datepicker._on_button_onnextlbuttondown();
			else if (fromObject.id == "prevbutton")
				this._p_datepicker._on_button_onprevlbuttondown();
		}
	};

	_pCalendar._on_beforerepeat = function (refer_comp)
	{
		if (this._type == "spin")
		{
			if (refer_comp == this._p_calendarspindownbutton || refer_comp == this._p_calendarspinupbutton)
				return [true, true];    // [bRepeat, bBubble]
		}
		else
		{
			var datepicker = this._p_datepicker;
			if (datepicker)
				return datepicker._on_beforerepeat(refer_comp);
		}

		return [false, true];   // [bRepeat, bBubble]
	};

	//===============================================================
	// nexacro.Calendar : Util Function
	//===============================================================
	_pCalendar._convertValueType = function (v, dateobj, bapplyrule)
	{
		var ret, datatyperule;
		if (bapplyrule)
		{
			datatyperule = this._env._p_datatyperule;
			if (datatyperule == "1.0")
				return v;
		}

		ret = (dateobj === undefined || dateobj === null) ? dateobj : nexacro._toString(dateobj);

		return ret;
	};

	_pCalendar._setValue = function (v)
	{
		var maskobj = this._masktypeobj;
		if (maskobj)
		{
			v = maskobj.changeNormalizeValue(v);
			this._p_value = v;
			this.on_apply_value(v);
		}
	};

	_pCalendar._setSpinValue = function (value, text, pos)
	{
		this._default_value = value;
		this._p_text = this._default_text = text;

		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			calendaredit._setSpinValue(text, pos);
		}
	};

	_pCalendar._setCalendarEditValue = function (value)
	{
		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			calendaredit._setValue(value);
			if (this._env._p_enableaccessibility)
			{
				this._accessibilityvalue = calendaredit._p_text;
				this._updateAccessibilityLabel();
				calendaredit._updateAccessibilityLabel();
			}
		}
	};

	_pCalendar._setDatePickerValue = function (value)
	{
		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._setValue(value);
		}
	};

	_pCalendar._setLocale = function (v)
	{
		if (this._p_locale)
			return;

		if (this._locale != v)
		{
			this._locale = v;
			this.on_apply_locale(v);
			this.on_apply_weekformat(this._p_weekformat);
			this.on_apply_value(this._p_value);
		}
	};

	_pCalendar._setInnerDatasetStr = function (str)
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

	_pCalendar._setDefaultCaret = nexacro._emptyFn;

	_pCalendar._setZeroCaret = function ()
	{
		var edit = this._p_calendaredit;
		if (edit && this._type != "system" && nexacro._checkActiveElement(edit._input_element))
		{
			edit.setCaretPos(0);
		}
	};

	_pCalendar._setFocusToNextComponent = function ()
	{
		var root_comp = this._getRootComponent(this);
		var next_comp = this._getForm().getNextComponent(root_comp, true);
		if (next_comp)
		{
			next_comp.setFocus();
			if (!next_comp._p_autoselect && next_comp._is_editable_control)
				next_comp._setDefaultCaret();
		}
	};

	_pCalendar._setEventHandlerToCalendarEdit = function ()
	{
		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch && (this._type == "system" || this.type != "spin"));
			if (bMobile)
			{
				this._setEventHandler("onkeydown", this._on_edit_onkeydown, this);
			}
			else
			{
				calendaredit._setEventHandler("onkeydown", this._on_edit_onkeydown, this);
			}
			calendaredit._setEventHandler("onlbuttondown", this._on_edit_onlbuttondown, this);
			calendaredit._setEventHandler("onlbuttonup", this._on_edit_onlbuttonup, this);
			calendaredit._setEventHandler("oneditclick", this._on_edit_oneditclick, this);
			calendaredit._setEventHandler("oninput", this._on_edit_oninput, this);
		}
	};

	_pCalendar._setEventHandlerToDropButton = function ()
	{
		var dropbutton = this._p_dropbutton;
		if (dropbutton)
		{
			var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);
			if (bMobile)
			{
				if (this._type == "system")
					dropbutton._setEventHandler("onclick", this._on_edit_oneditclick, this);
				else
				{
					dropbutton._setEventHandler("onclick", this._on_drop_mobile_onclick, this);
					dropbutton._setEventHandler("onkeydown", this._on_edit_onkeydown, this);
				}
			}
			else
			{
				dropbutton._setEventHandler("onclick", this._on_drop_onclick, this);
				dropbutton._setEventHandler("onlbuttondown", this._on_drop_onlbuttondown, this);
			}
		}
	};

	_pCalendar._setEventHandlerToSpinButton = function ()
	{
		var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);

		var spinupbutton = this._p_calendarspinupbutton;
		if (spinupbutton)
		{
			if (bMobile)
				spinupbutton._setEventHandler("onclick", this._on_spin_mobile_onspinup, this);
			else
				spinupbutton._setEventHandler("onclick", this._on_spin_onspinup, this);
		}


		var spindownbutton = this._p_calendarspindownbutton;
		if (spindownbutton)
		{
			if (bMobile)
				spindownbutton._setEventHandler("onclick", this._on_spin_mobile_onspindown, this);
			else
				spindownbutton._setEventHandler("onclick", this._on_spin_onspindown, this);
		}

	};

	_pCalendar._setEventHandlerToDatePicker = function ()
	{
		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._setEventHandler("ondayclick", this._on_datepicker_ondayclick, this);
			datepicker._setEventHandler("oncloseup", this._on_datepicker_oncloseup, this);
		}
	};

	_pCalendar._getDateMaskObj = function ()
	{
		return this._masktypeobj;
	};

	_pCalendar._getFormatType = function ()
	{
		var maskobj = this._masktypeobj;
		if (maskobj)
		{
			return maskobj.getEditFormatType();
		}

		return;
	};

	_pCalendar._getCurrentDate = function ()
	{
		var maskobj = this._masktypeobj;
		if (maskobj)
		{
			return maskobj.getCurrentDate();
		}

		return;
	};

	_pCalendar._getCurrentDateStr = function ()
	{
		var maskobj = this._masktypeobj;
		if (maskobj)
		{
			var currDate = maskobj.getCurrentDate();
			if (currDate)
			{
				var year = nexacro._toString(currDate.year).padLeft(4, "0");
				var month = nexacro._toString(currDate.month).padLeft(2, "0");
				var day = nexacro._toString(currDate.day).padLeft(2, "0");
				var type = maskobj.getEditFormatType();
				var val = "";
				switch (type)
				{
					case 0:
						val = year + month + day;
						break;
					case 1:
						val = "000000000";
						break;
					case 2:
						val = year + month + day + "000000000";
				}
				return maskobj.applyMask(val);

			}
		}

		return "";
	};

	_pCalendar._getEndDay = function (y, m)
	{
		var maskobj = this._masktypeobj;
		if (maskobj)
		{
			return maskobj.getEndDay(y, m);
		}

		return;
	};

	_pCalendar._getPopupSizeArr = function ()
	{
		var size = this._p_popupsize;
		if (!size)
			size = "200 220";

		size = size.split(/\s+/);

		var width = +size[0];
		var height = size[1] ? +size[1] : width;

		return { width: width, height: height };
	};

	_pCalendar._getElementPosition = function ()
	{
		return nexacro._getElementPositionInFrame(this.getElement());
	};

	_pCalendar._getEventInfoText = function (v)
	{
		var ret = "";
		var maskobj = this._masktypeobj;
		if (maskobj)
		{
			var cur_status = maskobj.getEditStatus();

			maskobj.setEditStatus(false);
			var binvalid = this._isInvalidValue(v);
			if (binvalid)
				ret = maskobj.applyMask("");
			else
			{
				var pakeddate = maskobj.changeNormalizeValue(v);
				ret = maskobj.applyMask(pakeddate);
			}

			maskobj.setEditStatus(cur_status);
		}

		return ret;
	};

	_pCalendar._isPopupVisible = function ()
	{
		var ret = false;
		if (this._p_type != "monthonly")
		{
			if (this._popupcontrol)
			{
				ret = this._popupcontrol._p_visible;
			}
		}
		return ret;
	};

	_pCalendar._applyAllProps = function ()
	{
		this.on_apply_innerdataset(this._innerdataset);
		this.on_apply_locale(this._getLocale());
		this.on_apply_weekformat(this._p_weekformat);
		this.on_apply_readonly();

		this.on_apply_editformat(this._p_editformat);
		this.on_apply_dateformat(this._p_dateformat);
		this.on_apply_value(this._p_value);
	};

	_pCalendar._applyDatePickerProps = function ()
	{
		var maskobj = this._masktypeobj;

		var datepicker = this._p_datepicker;
		if (datepicker)
		{
			datepicker._setEnable(this._p_enable);
			datepicker.set_readonly(this._p_readonly);

			datepicker._setValue(maskobj.getDatePickerValue());
		}
	};

	_pCalendar._makeCalendarText = function (value)
	{
		if (!value)
		{
			return "";
		}

		var val_str = value.toString();
		var oldformat = this._currentformat;
		this._currentformat = "dateformat";

		var date = this._makeMaskValue(val_str);
		var mask = this._makeMask("dateformat", this._makeDateObj(value));
		var txt_idx = 0;
		var return_txt = "";
		var matchStr = "yMdHhmsl";

		//this._on_apply_mask(mask, true);

		this._currentformat = oldformat;

		for (var i = 0, n = mask.length; i < n; i++)
		{
			var mask_ch = mask.charAt(i);

			if (matchStr.indexOf(mask_ch) >= 0)
			{
				return_txt += date.charAt(txt_idx);
				txt_idx++;
			}
			else
			{
				if (mask_ch === "~" || mask_ch === "^")
				{
					return_txt += date.charAt(txt_idx);
					txt_idx++;
				}
				else
				{
					return_txt += mask_ch;
				}
			}
		}
		return return_txt;
	};

	_pCalendar._isValidDate = function (val, editmask_type, edit_type_buf)
	{
		var y, M, d;
		var h, m, s, ss;

		switch (editmask_type)
		{
			case 0:
				y = val.substr(0, 4);
				M = val.substr(4, 2);
				d = val.substr(6, 2);
				break;
			case 1:
				var n = 0;
				if (edit_type_buf && edit_type_buf[0] < 40)
				{
					h = val.substr(n, 2);
					n = 2;
				}
				m = val.substr(n, 2);
				s = val.substr(n + 2, 2);
				ss = val.substr(n + 2, 3);
				break;
			case 2:
				y = val.substr(0, 4);
				M = val.substr(4, 2);
				d = val.substr(6, 2);
				h = val.substr(8, 2);
				m = val.substr(10, 2);
				s = val.substr(12, 2);
				ss = val.substr(14, 3);
				break;
		}

		if ((y && isNaN(y = +y)) || (M && isNaN(M = +M)) || (d && isNaN(d = +d)) ||
			(h && isNaN(h = +h)) || (m && isNaN(m = +m)) || (s && isNaN(s = +s)) || (ss && isNaN(ss = +ss)))
		{
			return false;
		}

		var maskobj = this._masktypeobj;

		var maxDay = maskobj.getEndDay(y, M);

		if ((editmask_type != 1 && !maxDay) ||
			(M && (+M > 12)) || (d && (+d > maxDay)) ||
			(h && (+h >= 24)) || (m && (+m >= 60)) || (s && (+s >= 60)) || (ss && (+ss >= 1000)))
		{
			return false;
		}

		return true;
	};

	_pCalendar._isInvalidValue = function (v)
	{
		if (nexacro._isNull(v) || v === "")
			return false;

		var dateobj;
		if (v instanceof Date || v instanceof nexacro.Date)
		{
			dateobj = v;
		}
		else
		{
			dateobj = this._convertToDateObject(v);
		}

		if (dateobj)
		{
			if (dateobj._isInvalidDate ? dateobj._isInvalidDate() : isNaN(dateobj.valueOf()))
				return true;

			var year = dateobj.getFullYear();
			if (year < 0 || year > 9999)
				return true;
		}

		return false;
	};

	_pCalendar._beginValueChange = function ()
	{
		return !(this.__value_change ? false : this.__value_change = true);
	};

	_pCalendar._finalValueChange = function ()
	{
		return !(this.__value_change = false);
	};


	// packed date format -> nexacro.Date
	_pCalendar._convertToDateObject = function (v)
	{
		if (nexacro._isNull(v) || v === "")
			return null;

		var dateobj;
		var maskobj = this._masktypeobj;
		var editformattype = maskobj.getEditFormatType();
		if (editformattype < 0)
		{
			if (this._p_editformat)
				this.on_apply_editformat(this._p_editformat);

			editformattype = maskobj.getEditFormatType();
		}

		if (v instanceof Date || v instanceof nexacro.Date)
		{
			dateobj = v;
		}
		else
		{
			v = nexacro._toString(v);

			if (/[^0-9]/.test(v))
				dateobj = new Date(v);
			else
				dateobj = maskobj.convertToDateObject(v, editformattype);
		}

		if (dateobj)
		{
			if (isNaN(dateobj.valueOf()))
				return dateobj;

			switch (editformattype)
			{
				case 0:
					dateobj = new nexacro.Date(dateobj.getFullYear(), dateobj.getMonth(), dateobj.getDate());
					break;
				case 1:
					dateobj = new nexacro.Date(dateobj.getFullYear(), dateobj.getMonth(), dateobj.getDate(), dateobj.getHours(), dateobj.getMinutes(), dateobj.getSeconds(), dateobj.getMilliseconds());
					dateobj._timeonly = true;
					break;
				case 2:
					dateobj = new nexacro.Date(dateobj.getFullYear(), dateobj.getMonth(), dateobj.getDate(), dateobj.getHours(), dateobj.getMinutes(), dateobj.getSeconds(), dateobj.getMilliseconds());
					break;
				default:
					break;
			}
		}

		return dateobj;
	};

	_pCalendar._on_getDisplayText = function ()
	{
		var calendaredit = this._p_calendaredit;
		if (calendaredit)
		{
			return calendaredit._on_getDisplayText();
		}
	};
	_pCalendar = null;
	//delete _pCalendar;

	//===============================================================
	// nexacro.CalendarDropButtonControl : Button
	//===============================================================
	nexacro._CalendarDropButtonControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
	};

	var _pCalendarDropButtonControl = nexacro._createPrototype(nexacro.Button, nexacro._CalendarDropButtonControl);
	nexacro._CalendarDropButtonControl.prototype = _pCalendarDropButtonControl;
	_pCalendarDropButtonControl._type_name = "ButtonControl";
	_pCalendarDropButtonControl._is_subcontrol = true;
	_pCalendarDropButtonControl._is_focus_accept = false;

	//===============================================================
	// nexacro._CalendarDropButtonControl : Events
	//===============================================================
	_pCalendarDropButtonControl.on_focus_basic_action = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
	{
		var calendar = this._p_parent;
		if (calendar)
		{
			var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch); // && nexacro._isHybrid());
			if (bMobile)
			{
				nexacro.Component.prototype.on_focus_basic_action.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);
			}
			else
			{
				calendar._apply_setfocus(evt_name);
			}
		}
	};

	_pCalendarDropButtonControl._on_click = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key)
	{
		if (!this._is_alive) return;

		if (this._p_visible && this._p_parent._isEnable() && this._p_enableevent)
		{
			var clientXY = this._getClientXY(canvasX, canvasY);
			this.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientXY[0], clientXY[1], this, this, meta_key);
			this.on_click_basic_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key);
		}
	};

	_pCalendarDropButtonControl = null;
	//delete _pCalendarDropButtonControl;

	//===============================================================
	// nexacro.CalendarSpinButtonControl : Button
	//===============================================================
	nexacro._CalendarSpinButtonControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
	};

	var _pCalendarSpinButtonControl = nexacro._createPrototype(nexacro.Button, nexacro._CalendarSpinButtonControl);
	nexacro._CalendarSpinButtonControl.prototype = _pCalendarSpinButtonControl;
	_pCalendarSpinButtonControl._type_name = "ButtonControl";
	_pCalendarSpinButtonControl._is_subcontrol = true;
	_pCalendarSpinButtonControl._is_focus_accept = false;

	//===============================================================
	// nexacro._CalendarSpinButtonControl : Events
	//===============================================================
	_pCalendarSpinButtonControl.on_focus_basic_action = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
	{
		var calendar = this._p_parent;
		if (calendar)
		{
			/*
			var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);
			if (bMobile)
			{
				nexacro.Component.prototype.on_focus_basic_action.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);
			}
			else
			{*/
			calendar.__focus_from_spinbutton = true;
			calendar._apply_setfocus(evt_name);
			//}
		}
	};
	_pCalendarSpinButtonControl = null;
	//delete _pCalendarSpinButtonControl;

	//===============================================================
	// nexacro._CalendarEditControl : Edit
	//===============================================================
	nexacro._CalendarEditControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay)
	{
		nexacro.MaskEdit.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay);
	};

	var _pCalendarEditControl = nexacro._createPrototype(nexacro.MaskEdit, nexacro._CalendarEditControl);
	nexacro._CalendarEditControl.prototype = _pCalendarEditControl;
	_pCalendarEditControl._type_name = "MaskEditControl";
	_pCalendarEditControl._is_subcontrol = true;

	_pCalendarEditControl._prevent_clickevent = true;

	//===============================================================
	// nexacro._CalendarEditControl : Create & Update
	//===============================================================
	_pCalendarEditControl.on_created_contents = function (win)
	{
		var input_elem = this._input_element;
		if (input_elem)
		{
			this.on_apply_value(this._p_value);

			input_elem.create(win);

			if (nexacro._isNull(this._p_value))
			{
				this._changeUserStatus("nulltext", true);
			}
			else
			{
				this._changeUserStatus("nulltext", false);
				if (this._isInvalidValue(this._p_value))
				{
					this._changeUserStatus("invalidtext", true);
				}
				else
				{
					this._changeUserStatus("invalidtext", false);
				}

			}
		}

		if (this._env._p_enableaccessibility)
		{
			this._on_created_accessibility_contents(win);
		}

		this.on_apply_displaynulltext(this._p_displaynulltext);
		this.on_apply_displayinvalidtext(this._p_displayinvalidtext);
	};

	_pCalendarEditControl.on_create_contents_command = function ()
	{
		var input_elem = this._input_element;

		if (input_elem)
		{
			this.on_apply_value(this._p_value);

			return input_elem.createCommand();
		}

		return "";
	};

	//===============================================================
	// nexacro.Calendar : Override
	//===============================================================
	_pCalendarEditControl._apply_setfocus = function (evt_name)
	{
		this._processing_updateToDataset = false;

		var input_elem = this._input_element;
		if (input_elem)		
		{
			var value = this._p_value;
			var text = "";
			var emptytext = "";

			var calendar = this._p_parent;

			var maskobj = this._getMaskObj();
			if (maskobj)
			{
				if (!this._onlydisplay)
					maskobj.setEditStatus(true);

				emptytext = this._getEmptyText();
				if (this._isInvalidValue(value))
					text = maskobj.applyMask("");
				else
					text = maskobj.applyMask(value);

				if (evt_name)
				{
					this._default_value = value;
					this._default_text = text;
				}

				if (!this._onlydisplay)
				{
					var pos = input_elem._last_selection_range;
					if (pos && !this._p_autoselect)
					{
						this._caret_pos = { begin: pos[0], end: pos[1] };
					}

					this._changeUserStatus("nulltext", false);
					this._changeUserStatus("invalidtext", false);

					if (nexacro._isNull(value))
					{
						input_elem.setElementDefaultValue(emptytext);
						input_elem.setElementValue(null);
					}
					else
					{
						input_elem.setElementValue(text);
					}
				}
			}

			if (!this._onlydisplay)
			{
				// input에 직접 label을 설정하므로 필요없음 grid는 점검 필요
				//if (this._env._p_enableaccessibility && evt_name != "tabkey" && evt_name != "shifttabkey" && !this._isComponentKeydownAction())
				//	nexacro._notifyAccessibilityInputElement(this._getAccessibilityReadLabel());

				input_elem.setElementFocus(evt_name);

				text = input_elem.getElementText();
				if (text != this._p_text)
				{
					this._default_text = this._p_text = text;
				}

				if (!calendar.__focus_from_spinbutton && !this._p_autoselect)
				{
					if (this._caret_pos == -1)
						input_elem.setElementSetSelect(0, 0);
					else
						input_elem.setElementSetSelect(this._caret_pos.begin, this._caret_pos.end);
				}
				if (this._p_autoselect)
				{
					input_elem.setElementSetSelect(0, text.length);
				}
			}
		}
	};

	//===============================================================
	// nexacro._CalendarEditControl : Properties
	//===============================================================

	//===============================================================
	// nexacro._CalendarEditControl : Methods
	//===============================================================

	//===============================================================
	// nexacro._CalendarEditControl : Events
	//===============================================================
	_pCalendarEditControl.on_killfocus_basic_action = function (new_focus, new_refer_focus)
	{
		nexacro.Component.prototype.on_killfocus_basic_action.call(this);

		// Component의 내부 Control 끼리의 포커스 변경은 아무동작 안해야함.
		// Grid : cell간의 이동은 blur가 수행되어야함.
		// Grid : cellCalendar 내부control 간의 focus 이동은 무시되어야함.
		var root_comp = this._getRootComponent(this);
		if (root_comp == new_focus)
		{
			if (this._p_parent && (!this._p_parent._is_subcontrol || this._p_parent == new_refer_focus._p_parent))
				return;
		}

		// Calendar killfocus 시점에서 calendaredit의 value와 비교하여 실제 Element에 반영
		// MaskEdit killfocus 시점에서 value와 text만 업데이트
		var input_elem = this._input_element;
		if (input_elem)
		{
			var maskobj = this._getMaskObj();
			var pre_value = this._default_value;
			var pre_text = this._default_text;

			var cur_value = this._p_value;
			var cur_text = this._p_text;

			if (maskobj)
			{
				maskobj.setEditStatus(false); // editmode 해제하여 dateformat 기준으로 처리
				cur_text = maskobj.applyMask(cur_value);
			}

			if (pre_value != cur_value || cur_text != pre_text)
			{
				if (!this._processing_canchange)
				{
					if (!this._on_value_change(pre_text, pre_value, cur_text, cur_value))
					{
						this._p_value = pre_value;
					}
				}
			}

			this._caret_pos = input_elem.getElementCaretPos();

			// for killfocus
			if (this._env._p_enableaccessibility && nexacro._Browser == "Runtime" && this._env._a11ytype == 5)
			{
				this._setAccessibilityStatKillFocus();
			}
		}
	};


	_pCalendarEditControl.on_keydown_default_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
	{
		if (this._p_readonly || !this._isEnable())
			return;

		var input_elem = this._input_element;
		if (input_elem)
		{
			var maskobj = this._getMaskObj();

			var input_value = input_elem.value;
			var pos = input_elem.getElementCaretPos();
			var idx, ch;

			if (keycode == nexacro.KeyCode_ImeInput)
			{
				var input_handle = input_elem.handle;

				if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
				{
					input_handle.blur();
					input_handle.focus();

					// blur focus 강제 처리(조합취소)하면 caret이 마지막에 위치하는 현상 수정 100454 24반영
					//if (this.parent.autoselect)
					input_elem.setElementSetSelect(pos.begin, pos.end);
				}
				input_elem.stopSysEvent();
			}
			else if (keycode == nexacro.Event.KEY_BACKSPACE)
			{
				if (maskobj && input_value)
				{
					if (pos.end > 0)
					{
						idx = pos.end - 1;
						while ((ch = input_value.charAt(idx)))
						{
							if (maskobj.isDeletableChar(ch, idx) || idx == 0)
								break;
							idx--;
						}

						maskobj._is_filled = false;

						if (idx != (pos.end - 1))
						{
							input_elem.setElementSetSelect(idx + 1, idx + 1);
						}
					}
				}
			}
			else if (keycode == nexacro.Event.KEY_DEL)
			{
				if (maskobj && input_value)
				{
					var len = input_value.length;
					if (pos.begin < len)
					{
						idx = pos.begin;

						while ((ch = input_value.charAt(idx)))
						{
							if (maskobj.isDeletableChar(ch, idx) || idx == len)
								break;
							idx++;
						}

						maskobj._is_filled = false;

						if (idx != pos.begin)
						{
							input_elem.setElementSetSelect(idx, idx);
						}
					}
				}
			}
		}
	};

	_pCalendarEditControl.on_keypress_basic_action = function (keycode, charcode, alt_key, ctrl_key, shift_key, meta_key)
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
				return true;
			}
			else
			{
				// case :etc.. case by case
				if (keycode == nexacro.Event.KEY_ENTER || keycode == nexacro.Event.KEY_ESC)
				{
					return true;
				}
			}

			charcode = charcode || keycode;
			if (!ctrl_key && !alt_key && charcode)
			{
				var input_char = String.fromCharCode(charcode);
				if (input_char.length > 0)
				{
					var maskobj = this._getMaskObj();
					var pos = input_elem.getElementCaretPos();
					var input_pos = maskobj.findNearEditablePos(pos.begin, 1);
					if (input_pos < 0 || maskobj.isFilterChar(input_char, input_pos, pos.end, true))
					{
						input_elem.stopSysEvent();
						this._on_input_autoskip();
						return;
					}

					maskobj.keyPressed(input_char, input_pos);
				}
			}
		}
	};

	_pCalendarEditControl.on_keyinput_basic_action = function ()
	{
		if (this._p_readonly || !this._isEnable())
		{
			return false;
		}

		var input_elem = this._input_element;
		if (input_elem)
		{
			var input_value = input_elem.value;
			var input_text = input_value ? input_value : "";

			var maskobj = this._getMaskObj();
			if (maskobj)
			{
				if (maskobj._editmasked_empty_text == input_text)
				{
					input_value = "";
				}
				else
				{
					if (maskobj._use_edit_buf)
					{
						input_value = maskobj.changeNormalizeValueFromBuffer();
					}
					else
					{
						input_value = maskobj.removeMask(input_text.split(''))
						input_value = maskobj.changeNormalizeValue(input_value);
					}
				}
			}

			if (!input_value && !this._default_value)
			{
				this._p_value = this._default_value;
			}
			else
			{
				this._p_value = input_value;
			}

			this._p_text = input_text;

			if (this._undostack)
			{
				var pos = input_elem.getElementCaretPos();
				if (pos && pos != -1)
				{
					this._undostack.push(input_text, pos.begin, pos.end);
				}
				else
				{
					this._undostack.push(input_text, 0, 0);
				}
			}
		}
	};

	_pCalendarEditControl._beforeinput_process_with_HTMLEvent = function (value, status, begin, end, inputType)
	{
		var input_elem = this._input_element;
		var maskobj = this._getMaskObj();
		var ret = [];
		if (maskobj)
		{
			var input_value = input_elem._getInputValue();
			var front_text, rear_text, update_value, result, input_pos;

			switch (inputType)
			{
				case "deleteContentBackward":
					if (begin == end)
					{
						// select none
						front_text = input_value.substring(0, begin - 1);
						rear_text = input_value.substring(end);

						update_value = front_text + rear_text;
						result = maskobj.arrangeMask(update_value, begin - 1, begin - 1);

						input_elem._beforeinput_result_data = result.text;
						input_elem._beforeinput_result_pos = { begin: result.pos, end: result.pos };
					}
					else
					{
						front_text = input_value.substring(0, begin);
						rear_text = input_value.substring(end);

						update_value = front_text + rear_text;
						if ((end - begin == input_value.length))
						{
							// select all
							input_elem._beforeinput_result_data = maskobj.applyMask(update_value);
							input_elem._beforeinput_result_pos = { begin: begin, end: begin };
						}
						else
						{
							// select
							result = maskobj.arrangeMask(update_value, begin, begin);

							input_elem._beforeinput_result_data = result.text;
							input_elem._beforeinput_result_pos = { begin: result.pos, end: result.pos };
						}
					}

					ret.push(input_elem._BeforeinputState.REPLACE);
					break;
				case "deleteContentForward":
					if (begin == end)
					{
						// select none
						front_text = input_value.substring(0, begin);
						rear_text = input_value.substring(end + 1);

						update_value = front_text + rear_text;
						result = maskobj.arrangeMask(update_value, begin, begin);

						input_elem._beforeinput_result_data = result.text;
						input_elem._beforeinput_result_pos = { begin: result.pos, end: result.pos };
					}
					else
					{
						front_text = input_value.substring(0, begin);
						rear_text = input_value.substring(end);

						update_value = front_text + rear_text;
						if ((end - begin == input_value.length))
						{
							// select all
							input_elem._beforeinput_result_data = maskobj.applyMask(update_value);
							input_elem._beforeinput_result_pos = { begin: begin, end: begin };
						}
						else
						{
							// select
							result = maskobj.arrangeMask(update_value, begin, begin);

							input_elem._beforeinput_result_data = result.text;
							input_elem._beforeinput_result_pos = { begin: result.pos, end: result.pos };
						}
					}

					ret.push(input_elem._BeforeinputState.REPLACE);
					break;
				case "deleteByCut":
					if (begin == end)
					{
						// 원래 에러나는 코드며, 해당 케이스를 재현할수있는 조건이 불명확함. 케이스 발견시 작업 필요.
						//input_elem._beforeinput_result_data = result.text;
						//input_elem._beforeinput_result_pos = { begin: result.pos, end: result.pos };
					}
					else
					{
						front_text = input_value.substring(0, begin);
						rear_text = input_value.substring(end);

						update_value = front_text + rear_text;
						if ((end - begin == input_value.length))
						{
							// select all
							input_elem._beforeinput_result_data = maskobj.applyMask(update_value);
							input_elem._beforeinput_result_pos = { begin: begin, end: begin };
						}
						else
						{
							// select
							result = maskobj.arrangeMask(update_value, begin, begin);

							input_elem._beforeinput_result_data = result.text;
							input_elem._beforeinput_result_pos = { begin: result.pos, end: result.pos };
						}
					}

					ret.push(input_elem._BeforeinputState.REPLACE);
					break;
				case "insertText":
				case "insertCompositionText":
					value = value ? value : "";
					input_pos = maskobj.findNearEditablePos(begin, 1);

					var _date = maskobj.isFilterCharEx(value, input_pos, end);
					if (input_pos < 0 || (_date.ret && !_date.date))
					{
						ret.push(input_elem._BeforeinputState.CANCEL);
					}
					else
					{
						if (_date.ret)
						{
							ret.push(input_elem._BeforeinputState.REPLACE);
							input_elem._beforeinput_result_data = maskobj.applyMaskEx(_date.date);
							input_elem._beforeinput_result_pos = { begin: _date.pos, end: _date.pos };
							if (input_elem._beforeinput_result_data.length == maskobj._edit_char_buf.length && _date.pos == maskobj._edit_char_buf.length)
							{
								maskobj._is_filled = true;
							}
							else
							{
								maskobj._is_filled = false;
							}
						}
						else
						{
							var end_sel = end;
							if (begin == end)
							{
								update_value = input_value.substring(0, begin) + value + input_value.substring(end);
								end = end + value.length;
							}
							else
							{
								var append_value = value + "".padLeft(end - value.length, " ");
								update_value = input_value.substring(0, begin) + append_value + input_value.substring(begin);
								end = append_value.length;
							}

							result = maskobj.arrangeMask(update_value, begin, end, end_sel);
							if (result == null)
							{
								ret.push(input_elem._BeforeinputState.CANCEL);
							}
							else
							{
								input_pos = maskobj.findNearEditablePos(input_pos + value.length, 1);

								input_elem._beforeinput_result_data = result.text;
								input_elem._beforeinput_result_pos = { begin: input_pos, end: input_pos };

								ret.push(input_elem._BeforeinputState.REPLACE);

								// 조합 입력시에만 해당하는 동작으로 기존에는 keypress 또는 입력 input 이벤트에서 동작함 99036
								if (this._p_autoskip && input_pos == -1 && result.pos == result.text.length)
								{
									if (inputType == "insertCompositionText")
									{
										maskobj._is_filled = true;
									}
									else
									{
										ret.push(input_elem._BeforeinputState.REPLACE);
									}
								}
								else
								{
									if (inputType == "insertCompositionText")
									{
										maskobj._is_filled = false;
									}
									ret.push(input_elem._BeforeinputState.REPLACE);
								}
							}
						}
					}
					break;
				case "insertFromPaste":
					input_pos = maskobj.findNearEditablePos(begin, 1);
					if (input_pos < 0 || maskobj.isFilterChar(value, input_pos))
					{
						ret.push(input_elem._BeforeinputState.CANCEL);
					}
					else
					{
						var end_sel = end;
						if (begin == end)
						{
							update_value = input_value.substring(0, begin) + value + input_value.substring(end);
							end = end + value.length;
						}
						else
						{
							var append_value = value + "".padLeft(end - value.length, " ");
							update_value = input_value.substring(0, begin) + append_value + input_value.substring(begin);
							end = append_value.length;
						}

						result = maskobj.arrangeMask(update_value, begin, end, end_sel);
						if (result == null)
						{
							ret.push(input_elem._BeforeinputState.CANCEL);
						}
						else
						{
							input_pos = maskobj.findNearEditablePos(result.pos, 1);

							input_elem._beforeinput_result_data = result.text;
							input_elem._beforeinput_result_pos = { begin: input_pos, end: input_pos };

							ret.push(input_elem._BeforeinputState.REPLACE);
						}
					}
					break;
				default:
					ret.push(input_elem._BeforeinputState.PASS);
					break;
			}
		}

		return ret;
	};

	_pCalendarEditControl._beforeinput_process_with_NexacroInputEvent = function (value, status, begin, end)
	{
		var input_elem = this._input_element;
		if (input_elem)
		{
			var input_pos = 0;
			var bPaste = input_elem._paste_caret_pos ? true : false;
			var input_text = value ? value : "";
			var insert_text = "";
			var inputtype = input_elem.inputtype;

			var maskobj = this._getMaskObj();
			if (maskobj)
			{
				if (inputtype == "date")
				{
					if (maskobj.getCurrentText() != input_text)
					{
						value = maskobj.removeMask(input_text.split(''));
						maskobj.applyMask(value);
					}
				}
				else
				{
					var result = maskobj.arrangeMask(input_text, begin, end);
					if (result == null)
					{
						input_elem.replaceElementText("", begin, end);
						input_elem.stopSysEvent();
					}
					else
					{
						if (bPaste)
						{
							input_pos = maskobj.findNearEditablePos(begin, 1);
							insert_text = input_text.substring(begin, end);

							if (input_pos < 0 || maskobj.isFilterChar(insert_text, input_pos))
							{
								input_elem.updateElementText(this._p_text, input_pos);
							}
							else
							{
								input_pos = maskobj.findNearEditablePos(result.pos, 1);
								if (nexacro._Browser == "Runtime" && this._p_autoselect && (this._p_text == result.text))
								{
									// Calendar Edit가 autoselect 일 때, 붙여넣기한 값이 이전 값이랑 같을 때 전체 선택이 되지 않도록 -99를 넘겨 autoselect되지 않게함.
									input_elem.updateElementText(result.text, input_pos, -99);
								}
								else
								{
									input_elem.updateElementText(result.text, input_pos);
								}
							}
						}
						else
						{
							input_pos = maskobj.findNearEditablePos(begin, 1);
							var ch = (value ? value.substr(begin, 1) : "");
							var _date = maskobj.isFilterCharEx(ch, input_pos, end);

							if (_date.ret)
							{
								var _text = maskobj.applyMaskEx(_date.date);
								var _pos = _date.pos;

								if (!/[0-9]/.test(ch))
								{
									_text = result.text;
									_pos = result.pos;
								}

								if (nexacro._Browser == "Runtime")
								{
									input_elem.updateElementText(_text, _pos, begin);
								}
								else
								{
									input_elem.updateElementText(_text, _pos);
								}

								if (this._p_autoskip && _pos == _text.length && maskobj._is_editing)
								{
									maskobj._is_filled = true;
								}
							}
							else
							{
								if (begin < end)
								{
									insert_text = input_text.substring(begin, end);
									var new_text = maskobj.removeMask(result.text.split(''));

									var calendar = this._p_parent;
									if (calendar)
									{
										if (!calendar._isValidDate(new_text, maskobj.getEditFormatType(), maskobj._edit_type_buf))
										{
											input_elem.replaceElementText("", begin, begin + insert_text.length);
											input_elem.stopSysEvent();
											return;
										}
									}
								}

								input_pos = maskobj.findNearEditablePos(result.pos, 1);

								if (result.text != input_text || result.pos != input_pos)
								{
									input_elem.updateElementText(result.text, input_pos);
								}
							}
						}
					}
				}
			}
		}
	};

	_pCalendarEditControl._isInvalidValue = function (v)
	{
		return this._p_parent._isInvalidValue(v);
	};

	//===============================================================
	// nexacro._CalendarEditControl : Logical Part
	//===============================================================

	//===============================================================
	// nexacro._CalendarEditControl : Util Function
	//===============================================================
	_pCalendarEditControl._setSpinValue = function (v, pos)
	{
		var input_elem = this._input_element;
		if (input_elem)
		{
			input_elem.setCompositionComplete();
			if (!this._onlydisplay)
				input_elem.updateElementText(v, pos);
			if (this._env._p_enableaccessibility)
			{
				this._setAccessibilityLabel(v);
			}
		}
	};

	_pCalendarEditControl._getMaskObj = function ()
	{
		var calendar = this._p_parent;
		if (calendar)
		{
			return calendar._masktypeobj;
		}
		return null;
	};

	_pCalendarEditControl._getEmptyText = function ()
	{
		var maskobj = this._getMaskObj();
		if (maskobj)
		{
			return maskobj.getEmptyText();
		}

		return "";
	};

	//===============================================================
	// nexacro.CalendarPopupControl : Popup
	//===============================================================
	nexacro._CalendarPopupControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro.PopupControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
	};

	var _pCalendarPopupControl = nexacro._createPrototype(nexacro.PopupControl, nexacro._CalendarPopupControl);
	nexacro._CalendarPopupControl.prototype = _pCalendarPopupControl;
	_pCalendarPopupControl._type_name = "popupCalendar";

	/* internal variable */

	//===============================================================
	// nexacro._CalendarPopupControl : Util Function
	//===============================================================
	_pCalendarPopupControl._getPopupParentPos = function ()
	{
		var calendar = this._p_parent;
		var calendar_size = [calendar._adjust_width, calendar._adjust_height];
		var calendar_elem_pos = nexacro._getElementPositionInFrame(calendar.getElement());

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

		return { "x": calendar_elem_pos.x, "y": calendar_elem_pos.y, "width": calendar_size[0], "height": calendar_size[1], "xgap": xgap, "ygap": ygab };
	};

	_pCalendarPopupControl = null;
	//delete _pCalendarPopupControl;
}