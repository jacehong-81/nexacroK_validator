//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.tobesoft.com/legal/nexacro-public-license-readme-1.0.html	
//
//==============================================================================
if (!nexacro._PopupMenuItemControl)
{
	// =================================================================================
	// nexacro._PopupMenuItemControl
	// =================================================================================

	nexacro._PopupMenuItemControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro._MenuItemControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
	};

	var _pPopupMenuItemControl = nexacro._createPrototype(nexacro._MenuItemControl, nexacro._PopupMenuItemControl);
	nexacro._PopupMenuItemControl.prototype = _pPopupMenuItemControl;

	_pPopupMenuItemControl._type_name = "PopupMenuItemControl";
	_pPopupMenuItemControl._is_subcontrol = true;
	//_pPopupMenuItemControl._is_focus_accept = true;

	_pPopupMenuItemControl.expimgelem = null;
	_pPopupMenuItemControl.chkwidth = 0;
	_pPopupMenuItemControl.textwidth = 0;
	_pPopupMenuItemControl.hotkeywidth = 0;
	_pPopupMenuItemControl.expwidth = 0;
	_pPopupMenuItemControl.expheight = 0;
	_pPopupMenuItemControl.index = 0;
	_pPopupMenuItemControl.datarow = 0;
	_pPopupMenuItemControl.icon = "";
	_pPopupMenuItemControl.userdata = undefined;
	_pPopupMenuItemControl.buttonalign = "";
	_pPopupMenuItemControl.accessibilityrole = "menuitem";

	_pPopupMenuItemControl._id = "";
	_pPopupMenuItemControl._check = false;
	_pPopupMenuItemControl._icon = null;
	_pPopupMenuItemControl._hotkeytext = "";

	_pPopupMenuItemControl._canExpand = true;
	_pPopupMenuItemControl._hotkey_string = "";

	// ===============================================================================
	// nexacro.PopupMenuItem : Create & Destroy & Update
	// ===============================================================================
	_pPopupMenuItemControl.on_create_contents = function ()
	{
		var control_elem = this.getElement();
		if (control_elem)
		{
			//text
			var textcontrol = new nexacro.Static("popupmenuitemtext", 0, 0, 0, 0, null, null, null, null, null, null, this);
			textcontrol._setControl();
			textcontrol._is_eventinfo_control = false;
			textcontrol._getStringResourceProperty = nexacro._MenuItemControl.prototype._getStringResourceProperty;
			//해당 다국어 적용 작업은 popupmenu item 이 static을 사용하기 때문에 현재와 같이 작업.
			textcontrol._setEventHandler("onclick", this.on_notify_itemclick, this);
			textcontrol.createComponent();

			//hotkey
			var hotkeytextcontrol = new nexacro.Static("popupmenuitemhotkeytext", 0, 0, 0, 0, null, null, null, null, null, null, this);
			hotkeytextcontrol._setControl();
			hotkeytextcontrol._is_eventinfo_control = false;
			hotkeytextcontrol._getStringResourceProperty = nexacro._MenuItemControl.prototype._getStringResourceProperty;
			hotkeytextcontrol._setEventHandler("onclick", this.on_notify_itemclick, this);
			hotkeytextcontrol.set_text(this._hotkeytext ? this._hotkeytext : "");
			hotkeytextcontrol.createComponent();

			this._textcontrol = textcontrol;
			this._hotkeytextcontrol = hotkeytextcontrol;
		}
	};

	_pPopupMenuItemControl.on_created_contents = function (win)
	{
		this.on_apply_text();

		this._on_apply_hotkeytext();

		if (this._textcontrol)
		{
			this._textcontrol.on_created(win);
		}

		if (this._hotkeytextcontrol)
		{
			this._hotkeytextcontrol.on_created(win);
		}

		if (this._iconcontrol)
		{
			this._iconcontrol.on_created(win);
		}

		if (this._expiconcontrol)
		{
			this._expiconcontrol.on_created(win);
		}
	};

	_pPopupMenuItemControl.on_create_contents_command = function ()
	{
		var str = "";

		if (this._textcontrol)
		{
			str += this._textcontrol.createCommand();
		}

		if (this._hotkeytextcontrol)
		{
			str += this._hotkeytextcontrol.createCommand();
		}

		if (this._iconcontrol)
		{
			str += this._iconcontrol.createCommand();
		}

		if (this._expiconcontrol)
		{
			str += this._expiconcontrol.createCommand();
		}

		return str;
	};

	_pPopupMenuItemControl.on_attach_contents_handle = function (win)
	{
		if (this._textcontrol)
		{
			this._textcontrol.attachHandle(win);
		}

		if (this._hotkeytextcontrol)
		{
			this._hotkeytextcontrol.attachHandle(win);
		}

		if (this._iconcontrol)
		{
			this._iconcontrol.attachHandle(win);
		}

		if (this._expiconcontrol)
		{
			this._expiconcontrol.attachHandle(win);
		}
	};

	_pPopupMenuItemControl.on_destroy_contents = function ()
	{
		if (this._textcontrol)
		{
			this._textcontrol.destroy();
			this._textcontrol = null;
		}

		if (this._hotkeytextcontrol)
		{
			this._hotkeytextcontrol.destroy();
			this._hotkeytextcontrol = null;
		}

		if (this._iconcontrol)
		{
			this._iconcontrol.destroy();
			this._iconcontrol = null;
		}

		if (this._expiconcontrol)
		{
			this._expiconcontrol.destroy();
			this._expiconcontrol = null;
		}
	};

	_pPopupMenuItemControl.on_change_containerRect = function (/*width, height*/)
	{
		this._updateControlPosition();
	};

	// ===============================================================================
	// nexacro.PopupMenuItem : Override
	// ===============================================================================
	_pPopupMenuItemControl.on_getIDCSSSelector = function ()
	{
		return "popupmenuitem";
	};

	_pPopupMenuItemControl.on_apply_prop_enable = function (enable)
	{
		nexacro.Component.prototype.on_apply_prop_enable.call(this, enable);

		if (this._textcontrol)
		{
			this._textcontrol._setEnable(enable);
		}

		if (this._hotkeytextcontrol)
		{
			this._hotkeytextcontrol._setEnable(enable);
		}

		if (this._iconcontrol)
		{
			this._iconcontrol._setEnable(enable);
		}

		if (this._expiconcontrol)
		{
			this._expiconcontrol._setEnable(enable);
		}
	};

	// ===============================================================================
	// nexacro.PopupMenuItem : Properties
	// ===============================================================================
	_pPopupMenuItemControl.on_apply_text = function (text)
	{
		if (this._textcontrol)
		{
			this._textcontrol.set_text(text);
		}
	};

	_pPopupMenuItemControl._on_apply_hotkeytext = function ()
	{
		if (this._hotkeytextcontrol)
		{
			this._hotkeytextcontrol.set_text(this._hotkeytext);
		}
	};

	// ===============================================================================
	// nexacro.PopupMenuItem : Methods
	// ===============================================================================

	// ===============================================================================
	// nexacro.PopupMenuItem : Event Handlers
	// ===============================================================================
	_pPopupMenuItemControl.on_notify_itemclick = function (obj, e)
	{
		var popupmenu = this._p_parent;
		if (popupmenu)
		{
			popupmenu.on_notify_menuitem_onclick(this, e);
		}
	};

	_pPopupMenuItemControl._on_apply_mouseover = function (isovered)
	{
		if (this.selected) return;

		if (isovered)
		{
			this._changeStatus("mouseover", true);
		}
		else
		{
			this._changeStatus("mouseover", false);
		}
	};

	// ===============================================================================
	// nexacro.PopupMenuItem : Logical Part
	// ===============================================================================
	_pPopupMenuItemControl._isFocusAcceptable = function ()
	{
		return false;
	};

	_pPopupMenuItemControl._load_image = function (val)
	{
		var control_elem = this._control_element;
		if (control_elem)
		{
			if (val)
			{
				// load image
				var expiconcontrol = this._expiconcontrol;
				if (!expiconcontrol)
				{
					expiconcontrol = new nexacro._IconText("popupmenuitemexpandimage", 0, 0, 0, 0, null, null, null, null, null, null, this);
					expiconcontrol._setEventHandler("onclick", this.on_notify_itemclick, this);
					expiconcontrol._setControl();
					expiconcontrol.createComponent();

					this._expiconcontrol = expiconcontrol;
				}
				else
				{
					expiconcontrol.set_text("");
				}
				expiconcontrol.set_icon(val);
			}
		}
	};

	_pPopupMenuItemControl._updateControlPosition = function ()
	{
		if (!this._is_created_contents) return;

		var positionobj = this._getItemControlPosition();
		if (!positionobj) return;

		var client_height = this._getClientHeight();

		var icon_x = positionobj.icon_x;
		var icon_width = positionobj.iconimgwidth;
		var icon_height = positionobj.iconheight;

		var text_x = positionobj.text_x;
		var textwidth = positionobj.textwidth;
		var textheight = positionobj.textheight;

		var hotkey_x = positionobj.hotkey_x;
		var hotkeywidth = positionobj.hotkeywidth;
		var hotkeyheight = positionobj.hotkeyheight;

		var gap = positionobj.gap;

		var expimg_x = hotkeywidth ? hotkey_x + hotkeywidth + gap : hotkey_x;
		var expwidth = positionobj.expimgwidth ? positionobj.expimgwidth : 10;
		var expheight = positionobj.expimgheight ? positionobj.expimgheight : this.height;
		var exptop = expheight ? ((client_height - expheight) / 2) : 0;

		var iconcontrol = this._iconcontrol;
		if (iconcontrol)
		{
			iconcontrol.move(icon_x, 0, icon_width, icon_height);
		}

		var expiconcontrol = this._expiconcontrol;
		var hotkeytextcontrol = this._hotkeytextcontrol;
		if (this._canExpand && expiconcontrol)
		{
			expiconcontrol.move(expimg_x, exptop, expwidth, expheight);

			if (hotkeytextcontrol)
			{
				hotkeytextcontrol.set_visible(false);
			}
		}
		else if (hotkeytextcontrol)
		{
			if (hotkeytextcontrol.text == "")
			{
				hotkeytextcontrol.set_visible(false);
			}
			else
			{
				hotkeytextcontrol.set_visible(true);
				hotkeytextcontrol.move(hotkey_x, 0, hotkeywidth, hotkeyheight);
			}
		}

		var textcontrol = this._textcontrol;
		if (textcontrol)
		{
			textcontrol.move(text_x, 0, textwidth, textheight);
		}
	};

	// ===============================================================================
	// nexacro.PopupMenuItem : Util Function
	// ===============================================================================
	_pPopupMenuItemControl._getWindowPosition = function ()
	{
		return nexacro.Component.prototype._getWindowPosition.call(this);
	};

	_pPopupMenuItemControl._isChecked = function ()
	{
		var v = this._check;
		if (!!v || v.toString().toLowerCase() == "true")
			return true;

		return false;
	};
	_pPopupMenuItemControl._getItemControlPosition = function ()
	{
		return this._p_parent._itempos;
	};

	_pPopupMenuItemControl._getWidth = function ()
	{
		var chkwidth = this.chkwidth;
		var textwidth = this.textwidth;
		var hotkeywidth = this.hotkeywidth;
		var expwidth = this.expwidth;
		var gap = this.gap;
		if (textwidth > 0)
		{
			chkwidth += (textwidth + gap);
		}

		if (hotkeywidth > 0 && expwidth > 0)
		{
			chkwidth += Math.max(hotkeywidth, expwidth) + gap;
		}
		else
		{
			if (hotkeywidth > 0)
			{
				chkwidth += (hotkeywidth + gap);
			}

			chkwidth += expwidth;
		}
		return chkwidth;
	};

	_pPopupMenuItemControl._setId = function (v)
	{
		this._id = v;
	};

	_pPopupMenuItemControl._setCheck = function (v)
	{
		this._check = v;

		if (this._check)
		{
			var iconcontrol = this._iconcontrol;
			if (!iconcontrol)
			{
				iconcontrol = new nexacro._Icon("popupmenuitemcheckbox", 0, 0, 0, 0, null, null, null, null, null, null, this);
				iconcontrol._setEventHandler("onclick", this.on_notify_itemclick, this);
				iconcontrol._setControl();
				iconcontrol.createComponent();

				this._iconcontrol = iconcontrol;

				if (this._is_created_contents)
				{
					iconcontrol.on_created();
				}
			}
		}
	};

	_pPopupMenuItemControl._setIcon = function (v)
	{
		this._icon = v;

		var iconcontrol = this._iconcontrol;
		if (!iconcontrol)
		{
			iconcontrol = new nexacro._Icon("popupmenuitemicon", 0, 0, 0, 0, null, null, null, null, null, null, this);
			iconcontrol._setEventHandler("onclick", this.on_notify_itemclick, this);
			iconcontrol._setControl();
			iconcontrol.createComponent();

			this._iconcontrol = iconcontrol;
		}

		var icon = this._icon;
		if (icon)
		{
			iconcontrol.set_icon(icon);
		}
	};

	_pPopupMenuItemControl._setHotkeyText = function (v)
	{
		if (this._hotkeytext != v)
		{
			this._hotkeytext = v;

			this._on_apply_hotkeytext();
		}
	};

	_pPopupMenuItemControl._setExpandimage = function ()
	{
		if (this._canExpand)
		{
			var expiconcontrol = this._expiconcontrol;
			if (!expiconcontrol)
			{
				expiconcontrol = new nexacro._IconText("popupmenuitemexpandimage", 0, 0, 0, 0, null, null, null, null, null, null, this);
				expiconcontrol._setEventHandler("onclick", this.on_notify_itemclick, this);
				expiconcontrol._setControl();
				expiconcontrol.createComponent();

				this._expiconcontrol = expiconcontrol;
			}

			var icon = expiconcontrol._getCSSStyleValue("icon");
			if (!icon)
			{
				// 대체 텍스트
				expiconcontrol.set_text(">");
			}
		}
	};

	_pPopupMenuItemControl._setUserdata = function (v)
	{
		if (this.userdata != v)
		{
			this.userdata = v;
		}
	};

	_pPopupMenuItemControl = null;
}

if (!nexacro.PopupMenu)
{
	// ===============================================================================
	// nexacro.MenuCloseUpEventInfo
	// ===============================================================================
	nexacro.MenuCloseUpEventInfo = function (obj, id, isselect, refobj)
	{
		this.id = this.eventid = id || "oncloseup";
		this.fromobject = obj; // fromobject 분리 필요
		this.fromreferenceobject = refobj ? refobj : obj; // fromreferenceobject 처리 필요.
		this.isselect = isselect;
	};
	var _pMenuCloseUpEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.MenuCloseUpEventInfo);
	nexacro.MenuCloseUpEventInfo.prototype = _pMenuCloseUpEventInfo;
	_pMenuCloseUpEventInfo._type_name = "MenuCloseUpEventInfo";

	_pMenuCloseUpEventInfo = null;

	//==============================================================================
	// nexacro.MenuClickEventInfo
	//==============================================================================
	nexacro.MenuClickEventInfo = function (obj, id, itemid, itemuserdata, index, level, refobj) // 중복 선언
	{
		this.eventid = id || "onmenuclick";
		this.id = itemid;
		this.fromobject = obj;
		this.fromreferenceobject = refobj ? refobj : obj;
		this.index = index;
		this.level = level;

		this.userdata = itemuserdata;
	};

	var _pMenuClickEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.MenuClickEventInfo);
	nexacro.MenuClickEventInfo.prototype = _pMenuClickEventInfo;
	_pMenuClickEventInfo._type_name = "MenuClickEventInfo";

	_pMenuClickEventInfo = null;

	//==============================================================================
	//nexacro.PopupMenu
	//==============================================================================
	nexacro.PopupMenu = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro.PopupControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

		this._attached_comp = this;

		this._items = [];
		this._lineItems = [];
		this._hot_key_list = [];

		this._itempos = {};
		this._last_mouseleave_iteminfo = { bindindex: -1, index: -1, level: -1 };
		this._iconImage_info = {};
	};

	var _pPopupMenu = nexacro._createPrototype(nexacro.PopupControl, nexacro.PopupMenu);
	nexacro.PopupMenu.prototype = _pPopupMenu;
	_pPopupMenu._type_name = "PopupMenu";

	/* control */
	_pPopupMenu._popupmenu = null;
	_pPopupMenu._innerdataset = "";

	/* default properties */
	_pPopupMenu._p_autohotkey = false;
	_pPopupMenu._p_innerdataset = "";
	_pPopupMenu._p_captioncolumn = "";
	_pPopupMenu._p_checkboxcolumn = "";
	_pPopupMenu._p_enablecolumn = "";
	_pPopupMenu._p_hotkeycolumn = "";
	_pPopupMenu._p_iconcolumn = "";
	_pPopupMenu._p_idcolumn = "";
	_pPopupMenu._p_levelcolumn = "";
	_pPopupMenu._p_userdatacolumn = "";
	_pPopupMenu._p_itemheight = undefined;
	_pPopupMenu._p_navigationbuttonsize = undefined;
	_pPopupMenu._p_accessibilityrole = "menu";

	/* internal variable */
	_pPopupMenu._closeflag = true;
	_pPopupMenu._is_updatedimages = false;
	_pPopupMenu._is_navigation_visible = false;
	_pPopupMenu._is_fire_onpopup = undefined;

	_pPopupMenu.level = 0;			// 내부변수임
	_pPopupMenu.datarow = 0;		// 내부변수임
	_pPopupMenu.beforeindex = -1;	// 내부변수임

	_pPopupMenu._start_navigation_index = 0;
	_pPopupMenu._end_navigation_index = 0;
	_pPopupMenu._previtemindex = 0;
	_pPopupMenu._popupitemindex = -1;
	_pPopupMenu._popupitempreviousindex = -1;
	_pPopupMenu._selected_itemindex = -1;  // for MenuCloseEventInfo.isselect (which mouse click or enter key)

	_pPopupMenu._itemheight = 0;
	_pPopupMenu._items_total_height = 0;
	_pPopupMenu._icontextpadding = 5; // this padding is a gap between icon(checkimage) and text .
	//_pPopupMenu._hotkeytextgap = 20; // this gap is a gap between text and hotkeytext.

	_pPopupMenu._want_arrow = true;
	_pPopupMenu._want_tab = true;

	/* status */
	_pPopupMenu._is_subcontrol = false;
	_pPopupMenu._is_fluid_control = false;
	_pPopupMenu._is_trackpopup = false;

	/* event list */
	_pPopupMenu._event_list =
	{
		"onclick": 1, "ondblclick": 1, "onkeypress": 1, "onkeydown": 1, "onkeyup": 1, "onkillfocus": 1, "onsetfocus": 1,
		"ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1, "onlbuttondown": 1, "onlbuttonup": 1,
		"onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmove": 1, "onsize": 1, "onrbuttondown": 1, "onrbuttonup": 1, "onmenuclick": 1,
		"onpopup": 1, "onmousedown": 1, "onmouseup": 1,
		"ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
		"oncontextmenu": 1,
		// popupmenu's events
		"oncloseup": 1, "oninnerdatachanged": 1
	};

	//===============================================================
	// nexacro.PopupMenu : Create & Destroy & Update
	//===============================================================
	_pPopupMenu.on_create_contents = function ()
	{
		return;
	};

	_pPopupMenu.on_created_contents = function (win)
	{
		nexacro.PopupControl.prototype.on_created_contents.call(this, win);

		var control_elem = this.getElement();
		if (control_elem)
		{
			if (!this._innerdataset && this._p_innerdataset)
			{
				this._innerdataset = this._findDataset(this._p_innerdataset);
				this.on_apply_innerdataset();
			}

			this._createPopupMenu();

			var items = this._lineItems;
			if (items)
			{
				var len = items.length;
				for (var i = 0; i < len; i++)
				{
					items[i].on_created();
				}
			}
		}
	};

	_pPopupMenu.on_create_contents_command = function ()
	{
		return "";
	};

	_pPopupMenu.on_attach_contents_handle = function (win)
	{
		nexacro.PopupControl.prototype.on_created.call(this, win);
	}

	_pPopupMenu.on_destroy_contents = function ()
	{
		this._deletePopupMenu();

		if (this._popupmenu)
		{
			this._popupmenu.destroyComponent();
			this._popupmenu = null;
		}

		this._removeEventHandlerToInnerDataset();
	};

	_pPopupMenu.on_change_containerRect = function (/*width, height*/)
	{
		this._reCalcSize();
	};

	//===============================================================
	// nexacro.PopupMenu : Override
	//===============================================================
	_pPopupMenu.on_apply_prop_enable = function (enable)
	{
		nexacro.Component.prototype.on_apply_prop_enable.call(this, enable);

		if (!enable)
			enable = this._p_enable;

		var popupemenu = this._popupmenu;
		if (popupemenu)
			popupemenu._setEnable(enable);

		var items = this._items;
		for (var i = 0, len = items.length; i < len; i++)
		{
			items[i]._setEnable(enable);
		}
	};

	_pPopupMenu.on_apply_prop_cssclass = function ()
	{
		var popupemenu = this._popupmenu;
		if (popupemenu)
			popupemenu.on_apply_cssclass(this._p_cssclass);
	};

	_pPopupMenu._getCSSMapParent = function ()
	{
		var pThis = this._p_parent;
		while (pThis._is_subcontrol)
			pThis = pThis._p_parent;
		return pThis;
	};

	_pPopupMenu._getDlgCode = function (/*keycode, altKey, ctrlKey, shiftKey*/)
	{
		var want_arrow = this._want_arrow;
		var want_tab = this._want_tab;
		this._want_tab = true;
		return { want_tab: want_tab, want_return: true, want_escape: false, want_chars: false, want_arrows: want_arrow };
	};

	_pPopupMenu._isPopupContains = function ()
	{
		var rootcomp = this._getRootComponent(this);
		return rootcomp._is_popupcontains ? true : false;
	};

	//===============================================================
	// nexacro.PopupMenuItem : Property
	//===============================================================
	_pPopupMenu.set_autohotkey = function (v)
	{
		var val = nexacro._toBoolean(v);
		if (val != this._p_autohotkey)
		{
			this._p_autohotkey = val;
			this.on_apply_autohotkey(val);
		}
	};

	_pPopupMenu.on_apply_autohotkey = function (autohotkey)
	{
		var i;
		var hotkey_list = this._hot_key_list;
		if (hotkey_list)
		{
			if (autohotkey)
			{
				//regitster hotkey when PopupMenu is created
			}
			else
			{
				for (i = hotkey_list.length - 1; i > -1; i--)
				{
					this._unregisterItemHotkey(hotkey_list[i].key);
				}
			}
		}
	};

	_pPopupMenu.set_visible = function (v)
	{
		if (this._is_trackpopup)
		{
			nexacro.PopupControl.prototype.set_visible.apply(this, arguments);
		}
	};

	_pPopupMenu.set_itemheight = function (v)
	{
		if (v !== undefined)
		{
			if (isNaN(v = +v) || v < 0)
			{
				return;
			}
		}

		if (v != this._p_itemheight)
		{
			this._p_itemheight = v;
		}
	};

	_pPopupMenu.set_navigationbuttonsize = function (v)
	{
		if (v !== undefined)
		{
			if (isNaN(v = +v))
			{
				return;
			}
		}

		if (v != this._p_navigationbuttonsize)
		{
			this._p_navigationbuttonsize = v;
		}
	};

	_pPopupMenu.set_popuptype = function (v)
	{
		var popuptype_enum = ["center", "none", "normal", "system"];
		if (popuptype_enum.indexOf(v) == -1)
		{
			return;
		}
		var popuptype = this._p_popuptype;

		if (v != popuptype)
		{
			this._p_popuptype = v;
		}
	};

	_pPopupMenu.set_captioncolumn = function (v)
	{
		if (v != this._p_captioncolumn)
		{
			this._p_captioncolumn = v;
			this.on_apply_captioncolumn();
		}
	};

	_pPopupMenu.on_apply_captioncolumn = function ()
	{
		var popupmenu = this._popupmenu;
		if (popupmenu)
		{
			popupmenu.set_captioncolumn(this._p_captioncolumn);
		}

		var ds = this._innerdataset;
		if (ds)
		{
			this._createPopupMenu();

			var items = this._items;
			if (items)
			{
				var len = items.length;
				for (var i = 0; i < len; i++)
				{
					items[i].set_text(ds.getColumn(items[i].datarow, this._p_captioncolumn) || "");
				}
			}
		}
	};

	_pPopupMenu.set_checkboxcolumn = function (v)
	{
		if (v != this._p_checkboxcolumn)
		{
			this._p_checkboxcolumn = v;
			this.on_apply_checkboxcolumn();
		}
	};

	_pPopupMenu.on_apply_checkboxcolumn = function ()
	{
		var popupmenu = this._popupmenu;
		if (popupmenu)
		{
			popupmenu.set_checkboxcolumn(this._p_checkboxcolumn);
		}

		var ds = this._innerdataset;
		if (ds)
		{
			this._createPopupMenu();

			var items = this._items;
			if (items)
			{
				var len = items.length;
				for (var i = 0; i < len; i++)
				{
					items[i]._setCheck(nexacro._toBoolean(ds.getColumn(items[i].datarow, nexacro._toString(this._p_checkboxcolumn))));
				}
			}
			if (this._p_visible)
			{
				this._reCalcSize();
			}
		}
	};

	_pPopupMenu.set_enablecolumn = function (v)
	{
		if (v != this._p_enablecolumn)
		{
			this._p_enablecolumn = v;
			this.on_apply_enablecolumn();
		}
	};

	_pPopupMenu.on_apply_enablecolumn = function ()
	{
		var popupmenu = this._popupmenu;
		if (popupmenu)
		{
			popupmenu.set_enablecolumn(this._p_enablecolumn);
		}

		var ds = this._innerdataset;
		if (ds)
		{
			this._createPopupMenu();
		}
	};

	_pPopupMenu.set_hotkeycolumn = function (v)
	{
		if (v != this._p_hotkeycolumn)
		{
			this._p_hotkeycolumn = v;
			this.on_apply_hotkeycolumn();
		}
	};

	_pPopupMenu.on_apply_hotkeycolumn = function ()
	{
		var popupmenu = this._popupmenu;
		if (popupmenu)
		{
			popupmenu.set_hotkeycolumn(this._p_hotkeycolumn);
		}

		var ds = this._innerdataset;
		if (ds)
		{
			this._createPopupMenu();

			var items = this._items;
			if (items)
			{
				var len = items.length;
				for (var i = 0; i < len; i++)
				{
					items[i]._setHotkeyText(ds.getColumn(items[i].datarow, this._p_hotkeycolumn) || "");
				}
			}
		}
	};

	_pPopupMenu.set_iconcolumn = function (v)
	{
		if (v != this._p_iconcolumn)
		{
			this._p_iconcolumn = v;
			this.on_apply_iconcolumn();
		}
	};

	_pPopupMenu.on_apply_iconcolumn = function ()
	{
		var ds = this._innerdataset;
		var obj = null;
		if (ds)
		{
			var index = this._popupitemindex;
			this._createPopupMenu();

			var items = this._items;
			if (items)
			{
				var len = items.length;
				for (var i = 0; i < len; i++)
				{
					var item = items[i];
					if (!item._check)
						item._setIcon(ds.getColumn(items[i].datarow, this._p_iconcolumn) || "");
					if (index == i)
					{
						item._changeUserStatus("selected", true);
						obj = item;
					}

				}
			}
			if (this._p_visible)
			{
				this._reCalcSize();
			}
		}

		var popupmenu = this._popupmenu;
		if (popupmenu)
		{
			popupmenu.set_iconcolumn(this._p_iconcolumn);
			if (obj)
				popupmenu._reCalcPopupPosition(obj);
		}
	};

	_pPopupMenu.set_idcolumn = function (v)
	{
		if (v != this._p_idcolumn)
		{
			this._p_idcolumn = v;
			this.on_apply_idcolumn();
		}
	};

	_pPopupMenu.on_apply_idcolumn = function ()
	{
		var popupmenu = this._popupmenu;
		if (popupmenu)
		{
			popupmenu.set_idcolumn(this._p_idcolumn);
		}

		var ds = this._innerdataset;
		if (ds)
		{
			this._createPopupMenu();

			var items = this._items;
			if (items)
			{
				var len = items.length;
				for (var i = 0; i < len; i++)
				{
					items[i]._setId(ds.getColumn(items[i].datarow, this._p_idcolumn) || "");
				}
			}
		}
	};

	_pPopupMenu.set_levelcolumn = function (v)
	{
		if (v != this._p_levelcolumn)
		{
			this._p_levelcolumn = v;
			this.on_apply_levelcolumn();
		}
	};

	_pPopupMenu.on_apply_levelcolumn = function ()
	{
		var popupmenu = this._popupmenu;
		if (popupmenu)
		{
			popupmenu.set_levelcolumn(this._p_levelcolumn);
		}

		var ds = this._innerdataset;
		if (ds)
		{
			this._createPopupMenu();

			var items = this._items;
			if (items)
			{
				var len = items.length;
				for (var i = 0; i < len; i++)
				{
					items[i].level = ds.getColumn(items[i].datarow, this._p_levelcolumn) || -1;
				}
			}
		}
	};

	_pPopupMenu.set_userdatacolumn = function (v)
	{
		if (v != this._p_userdatacolumn)
		{
			this._p_userdatacolumn = v;
			this.on_apply_userdatacolumn();
		}
	};

	_pPopupMenu.on_apply_userdatacolumn = function ()
	{
		var popupmenu = this._popupmenu;
		if (popupmenu)
		{
			popupmenu.set_userdatacolumn(this._p_userdatacolumn);
		}

		var ds = this._innerdataset;
		if (ds)
		{
			if (this._items.length == 0) // userdata는 hidden영역이므로, 생성되어 있는 메뉴가 존재하면 굳이 새로 만들지 않는다.
				this._createPopupMenu();

			var items = this._items;
			if (items)
			{
				var len = items.length;
				for (var i = 0; i < len; i++)
				{
					items[i]._setUserdata(ds.getColumn(items[i].datarow, this._p_userdatacolumn) || null)
				}
			}
		}
	};

	_pPopupMenu.set_innerdataset = function (str)
	{
		if (typeof str != "string")
		{
			this.setInnerDataset(str);
			return;
		}
		if (str != this._p_innerdataset)
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
			this.on_apply_innerdataset();
		}
		else if (this._p_innerdataset && !this._innerdataset)
		{
			this._setInnerDatasetStr(this._p_innerdataset);
			this.on_apply_innerdataset();
		}
	};

	_pPopupMenu.on_apply_innerdataset = function ()
	{
		var ds = this._innerdataset;
		if (ds)
		{
			ds._setEventHandler("onrowposchanged", this._callbackFromDataset, this);
			ds._setEventHandler("oncolumnchanged", this._callbackFromDataset, this);
			ds._setEventHandler("onrowsetchanged", this._callbackFromDataset, this);
			ds._setEventHandler("onvaluechanged", this._callback_onvaluechanged, this);
		}

		if (this._popupmenu)
		{
			this._popupmenu.set_innerdataset(this._p_innerdataset);
		}

		this._createPopupMenu();

		this.beforeindex = -1;
	};

	_pPopupMenu.set_icontextpadding = function (v)
	{
		this._icontextpadding = +v;
	};

	_pPopupMenu._properties = [{ name: "autohotkey" }, { name: "captioncolumn" }, { name: "checkboxcolumn" },
	{ name: "enablecolumn" }, { name: "hotkeycolumn" }, { name: "iconcolumn" },
	{ name: "idcolumn" }, { name: "innerdataset" }, { name: "itemheight" },
	{ name: "levelcolumn" }, { name: "navigationbuttonsize" }, { name: "popuptype" },
	{ name: "userdatacolumn" }
	];
	nexacro._defineProperties(_pPopupMenu, _pPopupMenu._properties);

	//===============================================================
	// nexacro.PopupMenu : Event Handler
	//===============================================================
	_pPopupMenu._on_hotkey = function (keycode, altKey, ctrlKey, shiftKey)
	{
		var listitem, obj;
		var list = this._hot_key_list;
		var len = list.length;

		for (var i = 0, key, modifykey; i < len; i++)
		{
			listitem = list[i];
			obj = listitem.obj;
			key = listitem.key;
			if (key._keycode == keycode)
			{
				modifykey = key._modifierkey;
				if (altKey == ((modifykey & 0x02) == 0x02) && ctrlKey == ((modifykey & 0x01) == 0x01) && shiftKey == ((modifykey & 0x04) == 0x04))
				{
					this.on_fire_onitemclick(this, listitem.id, obj.userdata, obj.index, obj._p_parent.level, obj);
					break;
				}
			}
		}
	};

	_pPopupMenu._on_focus = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
	{
		if (evt_name == "focus")
			this._is_fire_onpopup = false;
		var retn = nexacro.Component.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);

		if (self_flag == false)
		{
			if (this._env._p_enableaccessibility)
			{
				if (!this._isAccessibilityEnable())
				{
					this._select_menuitem(0, -1);
				}
			}
		}

		return retn;
	};

	_pPopupMenu._do_defocus = function (target, bParent)
	{
		var _window = this._getWindow();

		_window._removeFromCurrentFocusPath(target, true);
		if (bParent)
		{
			_window._removeFromCurrentFocusPath(this, false);
		}
	};

	_pPopupMenu._item_focus = function (obj, bflag, evt_name)
	{
		var enableaccessibility = this._env._p_enableaccessibility;
		if (enableaccessibility)
		{
			evt_name = evt_name ? evt_name : "downkey";
		}

		if (obj)
		{
			if (enableaccessibility)
			{
				if (obj instanceof nexacro._PopupMenuItemControl)
				{
					obj._on_focus(false, evt_name);
				}
				else
				{
					obj._on_focus(true, evt_name);
				}
			}
		}
	};

	_pPopupMenu._item_killfocus = function (obj)
	{
		if (obj)
		{
			if (this._env._p_enableaccessibility)
			{
				var _window = this._getWindow();
				if (_window)
				{
					_window._removeFromCurrentFocusPath(obj, true);
				}
			}

			if (obj._on_apply_mouseover)
			{
				obj._on_apply_mouseover(false);
			}
		}
	};

	_pPopupMenu._fire_on_Popupmenu = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)
	{
		var popupmenu = this._popupmenu;
		if (popupmenu)
		{
			popupmenu.on_fire_sys_onkeydown(keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
		}
	};

	_pPopupMenu._callbackFromDataset = function (/*obj, e*/)
	{
		this._createPopupMenu();

		this._closeAllPopup();
	};

	_pPopupMenu._callback_onvaluechanged = function (obj, e)
	{
		if (this._is_created)
		{
			this.on_fire_oninnerdatachanged(obj, e.oldvalue, e.newvalue, e.columnid, e.col, e.row);
		}
	};

	_pPopupMenu.on_notify_menuitem_onclick = function (obj, e)
	{
		var popuptype = this._getPopupType();
		var previtemindex = this._previtemindex;
		this._previtemindex = obj.index;

		if (obj.enable == false || !popuptype || popuptype == "none")
		{
			return;
		}

		var rootcomp = this._getRootComponent(obj);
		var parentcomp = this._p_parent;

		if (previtemindex > -1)
		{
			var previtem = this._items[previtemindex];
			if (previtem)
			{
				previtem._changeUserStatus("selected", false);
			}
		}

		if (obj._canExpand)
		{
			if (previtemindex != obj.index)
			{
				var popupmenu = this._popupmenu;
				if (popupmenu)
				{
					popupmenu._closePopup();
				}
			}
			this._showPopup(obj);

			obj._changeUserStatus("selected", true);

			if (rootcomp instanceof nexacro.Menu)
			{
				rootcomp._popupitemindex = obj.index;
			}
			this._popupitemindex = obj.index;
		}
		else if (obj._canExpand === false)
		{
			if (parentcomp && parentcomp._p_enable)
			{
				if (parentcomp instanceof nexacro.Menu)
				{
					if (this._p_parent.onmenuclick && this._p_parent.onmenuclick._has_handlers)
					{
						this._p_parent.on_notify_menuitem_onclick(obj, e);
					}
					this._closeAllPopup();
				}
				else if (!(parentcomp instanceof nexacro.PopupMenu))
				{
					this._closeAllPopup();
					if (this.onmenuclick && this.onmenuclick._has_handlers)
					{
						this.on_fire_onitemclick(rootcomp, obj._id, obj.userdata, obj.index, obj._p_parent.level, obj);
					}
				}
				else
				{
					parentcomp.on_notify_menuitem_onclick(obj, e);
					this._closeAllPopup();
				}
			}
		}
	};

	_pPopupMenu.on_notify_onmouseenter = function (obj/*, e*/)
	{
		//var rootComp = this._getRootComponent(obj);
		var previousitem = this._p_parent._menuitemonmouseenter;
		if (previousitem)
		{
			var previousparent = previousitem._p_parent;
			if (previousparent && previousparent.level < this.level)
			{
				previousitem._changeUserStatus("selected", true);
			}
		}
	};

	_pPopupMenu.on_notify_menuitem_onmouseenter = function (obj/*, e*/)
	{
		var index = obj.index;
		var previousitem = this._p_parent._menuitemonmouseenter;
		var previtemindex = this._popupitemindex;
		this._popupitemindex = obj.index;

		var popupmenu = this._popupmenu;
		if (popupmenu && popupmenu._is_popup())
		{
			if (this.beforeindex != obj.index)
			{
				popupmenu.cancelPopup();
				this._showPopup(obj);
			}
		}
		else
		{
			var popuptype = this._getPopupType();
			if (popuptype && popuptype != "none")
			{
				this._showPopup(obj);
			}
		}

		if (previtemindex > -1 && index != previtemindex)
		{
			var previtem = this._items[previtemindex];
			if (previtem)
				previtem._changeUserStatus("selected", false);
		}
		//set userstatus selected
		if (previousitem)
		{
			var curparent = obj._p_parent;
			var preparent = previousitem._p_parent;
			if (this.beforeindex > -1 && this.beforeindex != index)
			{
				var before_item = this._items[this.beforeindex];
				if (before_item)
					before_item._changeUserStatus("selected", false);
			}

			if (curparent && curparent != preparent)
			{
				if (preparent && curparent.level > preparent.level && previousitem._userstatus != "selected")
					previousitem._changeUserStatus("selected", true);
			}
		}

		this.beforeindex = this._popupitemindex = obj.index;
		this._menuitemonmouseenter = obj;
		if (!this._env._p_enableaccessibility)
		{
			var item = this._items;

			item[obj.index]._on_apply_mouseover(true);

			if (this._popupitempreviousindex == -1 || this._popupitemindex == -1)
			{
				this._popupitempreviousindex = 0;
				this._popupitemindex = 0;
			}

			if (item.length <= this._popupitemindex)
			{
				this._popupitemindex = item.length - 1;
				this._popupitempreviousindex = this._popupitemindex;
			}

			if (item[this._previtemindex])
			{
				item[this._previtemindex]._on_apply_mouseover(false);
			}
			this._previtemindex = obj.index;
		}

	};

	_pPopupMenu.on_notify_menuitem_onmouseleave = function (obj/*, e*/)
	{
		var rootComp = this._getRootComponent(this);

		rootComp._last_mouseleave_iteminfo = {
			index: obj.index,
			bindindex: obj._bindindex,
			level: obj.parent.level
		}
	};

	_pPopupMenu.on_notify_menuitem_onlbuttondown = function (obj/*, e*/)
	{
		this._menuitemonmouseenter = obj;

		var popupmenu = this._popupmenu;
		if (popupmenu)
		{
			if (popupmenu._is_popup())
			{
				if (this.beforeindex != obj.index)
				{
					this.beforeindex = obj.index;
				}

				popupmenu.cancelPopup();
			}
		}

		if (obj._canExpand)
		{
			this._showPopup(obj);

			var rootComp = this._getRootComponent(obj);
			if (rootComp instanceof nexacro.Menu)
			{
				rootComp._popupitemindex = obj.index;
			}
		}
	};

	_pPopupMenu.on_notify_navigationprev_onclick = function ()
	{
		var popupmenu = this._popupmenu;
		if (popupmenu)
		{
			popupmenu._closePopup();
		}

		this._navigationPrev();
	};

	_pPopupMenu.on_notify_navigationnext_onclick = function ()
	{
		var popupmenu = this._popupmenu;
		if (popupmenu)
		{
			popupmenu._closePopup();
		}

		this._navigationNext();
	};

	_pPopupMenu.on_fire_user_onlbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
	{
		if (this.onlbuttondown && this.onlbuttondown._has_handlers)
		{
			var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
			var evt = new nexacro.MenuMouseEventInfo(this, "onlbuttondown", evtinfo_control.id, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, evtinfo_control, evtinfo_control.parent.level, evtinfo_control.index, evtinfo_control._bindindex, meta_key);

			return this.onlbuttondown._fireUserEvent(this, evt);
		}
		return false;
	};

	_pPopupMenu.on_fire_user_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
	{
		if (this.onlbuttonup && this.onlbuttonup._has_handlers)
		{
			var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
			var evt = new nexacro.MenuMouseEventInfo(button, "onlbuttonup", evtinfo_control.id, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, evtinfo_control, evtinfo_control.parent.level, evtinfo_control.index, evtinfo_control._bindindex, meta_key);

			return this.onlbuttonup._fireUserEvent(this, evt);
		}
		return false;
	};

	_pPopupMenu.on_fire_user_onrbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
	{
		if (this.onrbuttondown && this.onrbuttondown._has_handlers)
		{
			var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
			var evt = new nexacro.MenuMouseEventInfo(this, "onrbuttondown", evtinfo_control.id, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, evtinfo_control, evtinfo_control.level, evtinfo_control.index, evtinfo_control._bindindex, meta_key);
			return this.onrbuttondown._fireUserEvent(this, evt);
		}
		return false;
	};

	_pPopupMenu.on_fire_user_onrbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
	{
		if (this.onrbuttonup && this.onrbuttonup._has_handlers)
		{
			var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
			var evt = new nexacro.MenuMouseEventInfo(this, "onrbuttonup", evtinfo_control.id, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, evtinfo_control, evtinfo_control.level, evtinfo_control.index, evtinfo_control._bindindex, meta_key);
			return this.onrbuttonup._fireUserEvent(this, evt);
		}
		return false;
	};

	_pPopupMenu.on_fire_oncontextmenu = function (from_comp, from_refer_comp, button, canvasX, canvasY, clientX, clientY, alt_key, ctrl_key, shift_key, screenX, screenY, meta_key)
	{
		if (this.oncontextmenu && this.oncontextmenu._has_handlers)
		{
			var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
			var evt = new nexacro.MenuContextMenuEventInfo(this, "oncontextmenu", evtinfo_control.id, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, evtinfo_control, evtinfo_control.level, evtinfo_control.index, evtinfo_control._bindindex, meta_key);
			return this.oncontextmenu._fireEvent(this, evt);
		}
		return false;
	};

	_pPopupMenu.on_fire_user_onmousedown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
	{
		if (this.onmousedown && this.onmousedown._has_handlers)
		{
			var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
			var evt = new nexacro.MenuMouseEventInfo(this, "onmousedown", evtinfo_control.id, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, evtinfo_control, evtinfo_control.parent.level, evtinfo_control.index, evtinfo_control._bindindex, meta_key);

			return this.onmousedown._fireUserEvent(this, evt);
		}
		return false;
	};

	_pPopupMenu.on_fire_user_onmouseup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
	{
		if (this.onmouseup && this.onmouseup._has_handlers)
		{
			var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
			var evt = new nexacro.MenuMouseEventInfo(this, "onmouseup", from_refer_comp.id, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, evtinfo_control, evtinfo_control.parent.level, evtinfo_control.index, evtinfo_control._bindindex, meta_key);

			return this.onmouseup._fireUserEvent(this, evt);
		}
		return false;
	};

	_pPopupMenu.on_fire_user_onmouseenter = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
	{
		if (this.onmouseenter && this.onmouseenter._has_handlers)
		{
			var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
			var evt = new nexacro.MenuMouseEventInfo(this, "onmouseenter", evtinfo_control.id, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, evtinfo_control, evtinfo_control.parent.level, evtinfo_control.index, evtinfo_control._bindindex, meta_key);

			return this.onmouseenter._fireUserEvent(this, evt);
		}
	};

	_pPopupMenu.on_fire_user_onmouseleave = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
	{
		if (this.onmouseleave && this.onmouseleave._has_handlers)
		{
			var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
			var iteminfo = this._last_mouseleave_iteminfo;
			var evt = new nexacro.MenuMouseEventInfo(this, "onmouseleave", evtinfo_control.id, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, evtinfo_control, iteminfo.level, iteminfo.index, iteminfo.bindindex, meta_key);

			return this.onmouseleave._fireUserEvent(this, evt);
		}
		return false;
	};

	_pPopupMenu.on_fire_user_onmousemove = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
	{
		if (this.onmousemove && this.onmousemove._has_handlers)
		{
			var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
			var evt = new nexacro.MenuMouseEventInfo(this, "onmousemove", evtinfo_control.id, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, evtinfo_control, evtinfo_control.parent.level, evtinfo_control.index, evtinfo_control._bindindex, meta_key);

			return this.onmousemove._fireUserEvent(this, evt);
		}
		return false;
	};

	_pPopupMenu.on_fire_user_ondrag = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, refer_comp, self_refer_comp, meta_key)
	{
		if (this.ondrag && this.ondrag._has_handlers)
		{
			var dragData = this._getDragData();
			var evtinfo_control = this._getEventInfoComponent(self_refer_comp);
			var evt = new nexacro.MenuDragEventInfo(this, "ondrag", refer_comp.id, dragData, null, "text", null, this, self_refer_comp, from_comp, refer_comp,
				button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, evtinfo_control.parent.level, evtinfo_control.index, evtinfo_control._bindindex, meta_key);

			return [this.ondrag._fireUserEvent(this, evt), this, self_refer_comp, dragData, evt.userdata];
		}
		return [false];
	};

	_pPopupMenu.on_fire_user_ondrop = function (src_comp, src_refer_comp, dragdata, userdata, datatype, filelist,
		button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
	{
		if (this.ondrop && this.ondrop._has_handlers)
		{
			var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
			var evt = new nexacro.MenuDragEventInfo(this, "ondrop", evtinfo_control.id, dragdata, userdata, datatype, filelist, src_comp, src_refer_comp, from_comp, evtinfo_control,
				button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, evtinfo_control.parent.level, evtinfo_control.index, evtinfo_control._bindindex, meta_key);

			return this.ondrop._fireUserEvent(this, evt);
		}
		return false;
	};

	_pPopupMenu.on_fire_user_ondragenter = function (src_comp, src_refer_comp, dragdata, userdata, datatype, filelist,
		button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
	{
		if (this.ondragenter && this.ondragenter._has_handlers)
		{
			var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
			var evt = new nexacro.MenuDragEventInfo(this, "ondragenter", evtinfo_control.id, dragdata, userdata, datatype, filelist, src_comp, src_refer_comp, from_comp, evtinfo_control,
				button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, evtinfo_control.parent.level, evtinfo_control.index, evtinfo_control._bindindex, meta_key);

			return this.ondragenter._fireUserEvent(this, evt);
		}
		return false;
	};

	_pPopupMenu.on_fire_user_ondragleave = function (src_comp, src_refer_comp, dragdata, userdata, datatype, filelist,
		button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
	{
		if (this.ondragleave && this.ondragleave._has_handlers)
		{
			var iteminfo = this._last_mouseleave_iteminfo;
			var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
			var evt = new nexacro.MenuDragEventInfo(this, "ondragleave", evtinfo_control.id, dragdata, userdata, datatype, filelist, src_comp, src_refer_comp, from_comp, evtinfo_control,
				button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, iteminfo.level, iteminfo.index, iteminfo.bindindex, meta_key);

			return this.ondragleave._fireUserEvent(this, evt);
		}
		return false;
	};

	_pPopupMenu.on_fire_user_ondragmove = function (src_comp, src_refer_comp, dragdata, userdata, datatype, filelist,
		button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
	{
		if (this.ondragmove && this.ondragmove._has_handlers)
		{
			var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
			var evt = new nexacro.MenuDragEventInfo(this, "ondragmove", evtinfo_control.id, dragdata, userdata, datatype, filelist, src_comp, src_refer_comp, from_comp, evtinfo_control,
				button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, evtinfo_control.parent.level, evtinfo_control.index, evtinfo_control._bindindex, meta_key);

			return this.ondragmove._fireUserEvent(this, evt);
		}
		return false;
	};

	_pPopupMenu.on_fire_user_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)
	{
		var rootComp = this._getRootComponent(this);

		var pThis = this._popupmenu_find(this);
		var popupvisible = this._isPopupmenuVisible(this);

		var item = this._item_find(pThis);
		var item_len = item.length - 1;

		if (keycode == nexacro.Event.KEY_TAB)
		{
			if (!popupvisible)
			{
				if (!shift_key && this._popupitemindex == item_len || shift_key && this._popupitemindex < 0)
				{
					this._want_tab = false;
					this._closePopup();
				}
				else
				{
					pThis._item_killfocus(item[pThis._popupitemindex]);
					if (shift_key == false)
						this._popupitemindex++;
					else
						this._popupitemindex--;

					if (item[this._popupitemindex])
					{
						rootComp._menuitemonmouseenter = item[this._popupitemindex];
						this._item_focus(item[this._popupitemindex], true, "tabkey");
					}
					else
					{
						this._do_defocus(this._last_focused, true);
						this._on_focus(true);
					}
				}
				this._p_parent._getWindow()._keydown_element._event_stop = true;
			}
			else
			{
				if (!shift_key && pThis._popupitemindex == item_len || shift_key && pThis._popupitemindex == 0)
				{
					pThis._item_killfocus(item[pThis._popupitemindex]);
					pThis._closePopup();
					pThis = this._popupmenu_find(this);
					item = this._item_find(pThis);
					pThis._item_focus(item[pThis._previtemindex], true, "tabkey");
					pThis._popupitemindex = pThis._previtemindex;
				}
				else
				{
					pThis._item_killfocus(item[pThis._popupitemindex]);
					if (shift_key)
						pThis._popupitemindex--;
					else
						pThis._popupitemindex++;

					rootComp._menuitemonmouseenter = item[pThis._popupitemindex];
					pThis._item_focus(item[pThis._popupitemindex], true, "tabkey");
				}

				this._p_parent._getWindow()._keydown_element._event_stop = true;
			}
		}

		return nexacro.Component.prototype.on_fire_user_onkeydown.call(this, keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);

	};

	_pPopupMenu.on_fire_sys_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)
	{
		var pThis = this._popupmenu_find(this);
		var item = this._item_find(pThis);
		var popupvisible = this._isPopupmenuVisible(this);
		var popuptype = this._getPopupType();

		var rootComp = this._getRootComponent(this);
		var E = nexacro.Event;
		var is_accessibility = this._env._p_enableaccessibility;
		var popupmenu, popupexpand;
		var prev_popupitemindex, popupitemindex;
		var is_root_popupvisible = rootComp._isPopupVisible();

		switch (keycode)
		{
			case E.KEY_UP:
				if (is_accessibility) break;
				if (pThis._popupitemindex > -1)
				{
					if (!popupvisible)
					{
						prev_popupitemindex = this._popupitemindex;
						popupitemindex = this._getItemIndex(-1);
						this._select_menuitem(popupitemindex, prev_popupitemindex);
					}
					else
					{
						this._fire_on_Popupmenu(keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
					}
				}
				else
				{
					pThis._select_menuitem(this._getItemIndex(0));
				}
				break;
			case E.KEY_DOWN:
				if (is_accessibility) break;
				if (!popupvisible)
				{
					prev_popupitemindex = this._popupitemindex;
					popupitemindex = this._getItemIndex(1);
					this._select_menuitem(popupitemindex, prev_popupitemindex);
				}
				else
				{
					this._fire_on_Popupmenu(keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
				}
				break;
			case E.KEY_LEFT:
				if (popuptype == "none") break;// || this._popupitemindex == -1)

				if (is_accessibility)
				{
					if (!popupvisible)
					{
						prev_popupitemindex = this._popupitemindex;
						popupitemindex = this._getItemIndex(-1);
						this._select_menuitem(popupitemindex, prev_popupitemindex);
					}
					else
					{
						//this._fire_on_Popupmenu(keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp);
					}
				}
				else
				{
					if (pThis._popupitemindex > -1)
					{
						if (!popupvisible)
						{
							var parent = this._p_parent;
							if (parent instanceof nexacro.PopupMenu)
							{
								parent._select_menuitem(parent._popupitemindex);//, parent._getItemIndex(), true);//, 0, true);
								this._closePopup();
							}
							else
							{
								rootComp._select_menuitem(rootComp._getItemIndex(-1), rootComp._popupitemindex, is_root_popupvisible, "prev");//, 0, true);
							}
						}
						else
						{
							this._fire_on_Popupmenu(keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
						}
					}
					else if (popupvisible)
					{
						this._fire_on_Popupmenu(keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
					}
					else
					{
						item = this._items[this._popupitemindex];
						if (item) popupexpand = pThis._popupmenuitem_extend(item);
						if (popupexpand)
							this._fire_on_Popupmenu(keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
						else if (this == rootComp)// || this.parent == rootComp)                           
							rootComp._select_menuitem(rootComp._getItemIndex(-1), rootComp._popupitemindex, is_root_popupvisible, "prev");
						else
						{
							this._closePopup();
						}

					}
				}
				break;
			case E.KEY_RIGHT:
				if (popuptype == "none") break;  // || this._popupitemindex == -1)
				if (is_accessibility)
				{
					if (!popupvisible)
					{
						prev_popupitemindex = this._popupitemindex;
						popupitemindex = this._getItemIndex(1);
						this._select_menuitem(popupitemindex, prev_popupitemindex);
					}
					else
					{
						// this._fire_on_Popupmenu(keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp);
					}
				}
				else
				{
					var cur_idx = pThis._popupitemindex;
					if (cur_idx > -1)
					{
						item = item[cur_idx];
						if (!item) return;
						popupexpand = pThis._popupmenuitem_extend(item);

						if (popupexpand)
						{
							pThis._showPopup(item);
							popupmenu = this._popupmenu;
							if (popupmenu)
								pThis.on_fire_sys_onkeydown(keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
							else
								rootComp._select_menuitem(rootComp._getItemIndex(1), 0, is_root_popupvisible);
						}
						else
						{
							if (popupvisible)
							{
								popupmenu = this._popupmenu;
								if (popupmenu)
									popupmenu.on_fire_sys_onkeydown(keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
							}
							else if (rootComp instanceof nexacro.PopupMenu && this == rootComp)
							{
								rootComp._select_menuitem(rootComp._getItemIndex(1), rootComp._popupitemindex, is_root_popupvisible);
							}
							/*else if (rootComp instanceof nexacro.PopupMenu && !rootComp._is_subcontrol) //need to check
							{
								popupmenu = rootComp._popupmenu;
								if (popupmenu)
								{
									popupmenu._closeAllPopup();
									var rootitems = rootComp._items;
									var next_index = rootComp._getItemIndex(1);
									rootComp._select_menuitem(next_index, rootComp._popupitemindex, is_root_popupvisible);
									rootComp._showPopup(rootitems[next_index]);
									popupmenu._select_menuitem(this._getItemIndex(0));
								}
							}*/
							else if (!(rootComp instanceof nexacro.PopupMenu))
							{
								rootComp._select_menuitem(rootComp._getItemIndex(1), rootComp._popupitemindex, is_root_popupvisible, "next");//, 0, true);
							}

						}
					}
					else
					{
						item = this._items[this._popupitemindex];
						if (item)
						{
							popupexpand = pThis._popupmenuitem_extend(item);
							if (popupexpand)
							{
								pThis._select_menuitem(this._getItemIndex(0));
							}
							else
							{
								rootComp._select_menuitem(rootComp._getItemIndex(1), rootComp._popupitemindex, is_root_popupvisible, "next");
							}
						}
						else
						{
							pThis._select_menuitem(this._getItemIndex(0));
						}
					}
				}
				break;

			case E.KEY_ENTER:
				if (popuptype == "none") break;
				if (!popupvisible)
				{
					if (pThis._popupitemindex > -1)
					{
						popupexpand = pThis._popupmenuitem_extend(item[pThis._popupitemindex]);
						if (popupexpand)
						{
							pThis._showPopup(item[pThis._popupitemindex]);
							popupmenu = this._popupmenu;
							if (popupmenu)
							{
								popupmenu.on_fire_sys_onkeydown(keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
							}
						}
						else
						{
							item = pThis._items[pThis._popupitemindex];
							if (item)
							{
								if (!item._canExpand)
									pThis.on_notify_menuitem_onclick(item);
								else
									pThis.on_notify_menuitem_onlbuttondown(item);
							}

							rootComp._closePopup();
						}
					}
					else
					{
						pThis._select_menuitem(this._getItemIndex(0));
					}
				}
				else if (!is_accessibility)
				{
					this._fire_on_Popupmenu(keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
				}
				break;
			case E.KEY_ESC:
				if (popuptype == "none") break;
				popupmenu = this._popupmenu;
				if (popupmenu && this._isPopupmenuVisible(this))
				{
					popupmenu.on_fire_sys_onkeydown(keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
				}
				else
				{
					if (refer_comp == fire_comp || refer_comp.parent == fire_comp)
					{
						this._closePopup();
					}
					else
					{
						item = this._items[this._popupitemindex];
						if (item)
							item._on_focus(false);
					}
				}
				break;
			default:
				break;
		}

		return nexacro.Component.prototype.on_fire_sys_onkeydown.call(this, keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
	};

	_pPopupMenu.on_fire_onitemclick = function (obj, itemid, itemuserdata, index, level, refobj)
	{
		var rootComp = this._getRootComponent(obj);
		if (rootComp.onmenuclick && rootComp.onmenuclick._has_handlers)
		{
			var evt = new nexacro.MenuClickEventInfo(obj, "onmenuclick", itemid, itemuserdata, index, level, refobj);

			rootComp.onmenuclick._fireEvent(rootComp, evt);
		}
	};

	_pPopupMenu.on_fire_oninnerdatachanged = function (obj, oldvalue, newvalue, columnid, col, row)
	{
		if (this.oninnerdatachanged && this.oninnerdatachanged._has_handlers)
		{
			var evt = new nexacro.InnerdataChangedEventInfo(obj, "oninnerdatachanged", oldvalue, newvalue, columnid, col, row);

			return this.oninnerdatachanged._fireEvent(this, evt);
		}
		return true;
	};

	_pPopupMenu.on_fire_onpopup = function (obj)
	{
		this._is_fire_onpopup = true;
		if (this.onpopup && this.onpopup._has_handlers)
		{
			var evt = new nexacro.EventInfo(obj, "onpopup");

			return this.onpopup._fireEvent(this, evt);
		}
		return false;
	};

	_pPopupMenu.on_fire_oncloseup = function (obj)
	{
		if (!this._is_fire_onpopup)
			this.on_fire_onpopup(obj);
		if (this.oncloseup && this.oncloseup._has_handlers)
		{
			var isselect = (this._selected_itemindex >= 0);
			var evt = new nexacro.MenuCloseUpEventInfo(obj, "oncloseup", isselect);

			return this.oncloseup._fireEvent(this, evt);
		}
		return false;
	};

	//===============================================================
	// nexacro.PopupMenu : Method
	//===============================================================
	_pPopupMenu.cancelPopup = function ()
	{
		this._closePopup();
	};

	_pPopupMenu.closePopup = function ()
	{
		this._closePopup();
	};

	_pPopupMenu.isPopup = function ()
	{
		return this._is_popup();
	};

	_pPopupMenu.trackPopup = function (x, y, align, bcapture)
	{
		this._selected_itemindex = -1;
		this._track_capture = bcapture == undefined ? true : nexacro._toBoolean(bcapture);

		if (!this._is_updatedimages)
		{
			var ds = this._innerdataset;
			if (ds)
			{
				var items = this._items;
				var level = +ds.getColumn(this.datarow + 1, this._p_levelcolumn);
				for (var i = 0, len = items.length; i < len; i++)
				{
					if (level > this.level)
					{
						items[i]._setExpandimage();
					}
				}
			}
			this._is_updatedimages = true;
		}

		if (!this._is_subcontrol && this._p_autohotkey)
		{
			var hotkey_list = this._hot_key_list;
			for (var i = 0; i < hotkey_list.length; i++)
			{
				this._registerItemHotkey(hotkey_list[i].key);
			}
		}

		this._calcNavigationbutton(/*this*/y > 0 ? y : 0);
		this._reCalcSize();

		this._setInheritStyleValues(this);
		this.on_created(); // TO DO : need - Only items must be created
		this._adjustPopupPosition(+x, +y, align);

		this.setFocus();
		if (!this._is_fire_onpopup)
			this.on_fire_onpopup(this);
	};

	_pPopupMenu.trackPopupByComponent = function (obj, x, y, align, bcapture)
	{
		this._selected_itemindex = -1;
		this._track_capture = bcapture == undefined ? true : nexacro._toBoolean(bcapture);

		if (!this._is_subcontrol && this._p_autohotkey)
		{
			var hotkey_list = this._hot_key_list;
			for (var i = 0; i < hotkey_list.length; i++)
			{
				this._registerItemHotkey(hotkey_list[i].key);
			}
		}

		this._reCalcSize();
		this._calcNavigationbutton(/*this*/y > 0 ? y : 0);

		this.on_created(); // TO DO : need - Only items must be created

		var p = nexacro._getElementPositionInFrame(obj.getElement());
		var win_left = p.x;
		var win_top = p.y;

		var _window = this._getWindow();
		var m_c_width = _window.clientWidth;
		var m_c_height = _window.clientHeight;

		var width = this._adjust_width;
		var height = this._adjust_height;

		if (!align)
		{
			//Left
			if (win_left + x + width > m_c_width)
			{
				var l_temp = m_c_width - width;
				if (l_temp < 0)
				{
					x = -win_left;
				}
				else
				{
					x = l_temp - win_left;
				}
			}

			//Top
			if (win_top + y + height > m_c_height)
			{
				var t_temp = m_c_height - height;
				if (t_temp < 0)
				{
					y = -win_top;
				}
				else
				{
					y = t_temp - win_top;
				}
			}
		}

		var form = this._getForm();
		x = +x + win_left;
		y = +y + win_top;
		this._adjustPopupPosition(x, y, align, form._getWindowPosition());

		this.setFocus();
		if (!this._is_fire_onpopup)
			this.on_fire_onpopup(this);
	};

	_pPopupMenu.setInnerDataset = function (obj)
	{
		this._removeEventHandlerToInnerDataset();

		if (!obj)
		{
			this._innerdataset = null;
			this._p_innerdataset = "";
			this.on_apply_innerdataset();
		}
		else if (obj instanceof nexacro.Dataset)
		{
			this._innerdataset = obj;
			this._p_innerdataset = obj.id;
			this.on_apply_innerdataset();
		}
	};

	_pPopupMenu.getInnerDataset = function ()
	{
		return this._innerdataset;
	};

	//===============================================================
	// nexacro.PopupMenu : Logical Part
	//===============================================================
	// popupmenu
	_pPopupMenu._createPopupMenu = function ()
	{
		var control_elem = this.getElement();
		if (control_elem)
		{
			this._deletePopupMenu();

			var ds = this._innerdataset;
			if (ds && this._p_levelcolumn && this._p_captioncolumn && this._p_idcolumn)
			{
				var item_index = 0;
				var row_index = this.datarow
				var ds_len = ds.getRowCount();

				var top = 0;
				var height = this._p_itemheight ? this._p_itemheight : 0;
				var popupmenuitem = null;

				for (; row_index < ds_len; row_index++)
				{
					var rootComp = this._getRootComponent(this);

					var id = ds.getColumn(row_index, this._p_idcolumn);
					var level = ds.getColumn(row_index, this._p_levelcolumn);
					var caption = ds.getColumn(row_index, this._p_captioncolumn);

					var enable = ds.getColumn(row_index, this._p_enablecolumn);
					var hotkey = ds.getColumn(row_index, this._p_hotkeycolumn);
					var userdata = ds.getColumn(row_index, this._p_userdatacolumn);
					var icon = ds.getColumn(row_index, this._p_iconcolumn);
					var check = ds.getColumn(row_index, this._p_checkboxcolumn);

					if (level == this.level)
					{
						if (caption == "-")
						{
							//separator
							var lineItem = new nexacro.Static("separator", 0, top, 0, 1, null, null, null, null, null, null, this);
							lineItem._setControl();
							lineItem.set_background("black");
							lineItem.createComponent();
							lineItem._bLine = true;

							top += 1;

							this._lineItems.push(lineItem);

							continue;
						}

						popupmenuitem = new nexacro._PopupMenuItemControl("popupmenuitem" + row_index, 0, top, 0, height, null, null, null, null, null, null, this);
						popupmenuitem.createComponent();
						top += height;
						popupmenuitem._bindindex = row_index;
						popupmenuitem.index = item_index++;
						popupmenuitem.datarow = row_index;
						popupmenuitem.level = level;

						popupmenuitem.set_text(caption || "");

						popupmenuitem._setEnable((enable === false || enable === "false" || enable === 0 || enable === "0") ? false : true);
						popupmenuitem._setId(id || "")
						popupmenuitem._setHotkeyText(hotkey || "");
						popupmenuitem._setUserdata(userdata);

						// 순서 중요
						check = nexacro._toBoolean(check);
						if (check)
						{
							popupmenuitem._setCheck(check);
						}
						else if (icon)
						{
							popupmenuitem._setIcon(icon);
						}

						if (row_index == ds.getRowCount() - 1)
						{
							popupmenuitem._canExpand = false;
						}
						else
						{
							var next_itemlevel = +ds.getColumn(row_index + 1, this._p_levelcolumn);
							if (next_itemlevel <= this.level)
							{
								popupmenuitem._canExpand = false;
							}
							else
							{
								popupmenuitem._setExpandimage();
							}
						}

						popupmenuitem._setEventHandler("onclick", this.on_notify_menuitem_onclick, this);
						popupmenuitem._setEventHandler("onlbuttondown", this.on_notify_menuitem_onlbuttondown, this);

						if (!(nexacro._isTouchInteraction && nexacro._SupportTouch))
						{
							popupmenuitem._setEventHandler("onmouseenter", this.on_notify_menuitem_onmouseenter, this);
							this._setEventHandler("onmouseenter", this.on_notify_onmouseenter, this);

							if (rootComp.onmouseleave)
							{
								popupmenuitem._setEventHandler("onmouseleave", this.on_notify_menuitem_onmouseleave, this);
							}
						}
						if (this._env._p_enableaccessibility)
						{
							popupmenuitem.on_apply_accessibility();
						}

						this._items.push(popupmenuitem);
						this._lineItems.push(popupmenuitem);

						popupmenuitem._real_visible = false;
					}
					else if (level < this.level)
					{
						break;
					}

					if (!this._is_subcontrol)
					{
						if (hotkey)
						{
							this._setHotkey(id, hotkey, popupmenuitem);
						}
					}
				}

				this._is_updatedimages = true;
			}
		}
	};

	_pPopupMenu._deletePopupMenu = function ()
	{
		var i;
		if (!this._is_subcontrol)
		{
			for (i = 0; i < this._hot_key_list.length; i++)
			{
				this._unregisterItemHotkey(this._hot_key_list[i].key);
				this._hot_key_list[i].hotkey = null;
				this._hot_key_list[i].obj = null;
			}
		}

		for (i = 0; i < this._items.length; i++)
		{
			this._items[i].destroyComponent();
			this._items[i] = null;
		}

		for (i = 0; i < this._lineItems.length; i++)
		{
			this._lineItems[i].destroyComponent();
			this._lineItems[i] = null;
		}

		if (this.nextbutton)
		{
			this.nextbutton.destroyComponent();
			this.nextbutton = null;
		}

		if (this.prevbutton)
		{
			this.prevbutton.destroyComponent();
			this.prevbutton = null;
		}

		this._items = [];
		this._lineItems = [];
		this._hot_key_list = [];
		this._iconImage_info = {};

		this._start_navigation_index = 0;
		this._end_navigation_index = 0;
		this._is_navigation_visible = false;
	};

	_pPopupMenu._showPopup = function (obj)
	{
		var popuptype = this._getPopupType();
		if (popuptype == "none") return;

		if (this._innerdataset && this._p_levelcolumn && this._p_captioncolumn && this._p_idcolumn && obj._canExpand === true && this._p_visible)
		{
			var popupmenu = this._popupmenu;
			if (!popupmenu)
			{
				popupmenu = this._popupmenu = new nexacro.PopupMenu("menupopupmenu", 0, 0, 0, 0, null, null, null, null, null, null, this);
				popupmenu._setControl();
				popupmenu._is_focus_accept = false;

				var color = this._color ? this._color : this._getCurrentStyleInheritValue("color");
				if (color)
				{
					popupmenu.set_color(color.value);
				}

				var font = this._font ? this._font : this._getCurrentStyleInheritValue("font");
				if (font)
				{
					popupmenu.set_font(font.value);
				}

				popupmenu.level = this.level + 1;
				popupmenu.datarow = obj.datarow + 1;
				this._setPopupContains(true);

				popupmenu._track_capture = false;
				popupmenu._is_loading = true;
				popupmenu.setInnerDataset(this._innerdataset);
				popupmenu.set_captioncolumn(this._p_captioncolumn);
				popupmenu.set_checkboxcolumn(this._p_checkboxcolumn);
				popupmenu.set_hotkeycolumn(this._p_hotkeycolumn);
				popupmenu.set_idcolumn(this._p_idcolumn);
				popupmenu.set_levelcolumn(this._p_levelcolumn);
				popupmenu.set_userdatacolumn(this._p_userdatacolumn);
				popupmenu.set_enablecolumn(this._p_enablecolumn);
				popupmenu.set_iconcolumn(this._p_iconcolumn);
				popupmenu.set_popuptype(this._getPopupType());
				popupmenu.set_cssclass(this._p_cssclass);

				popupmenu.createComponent();
			}
			else
			{
				popupmenu.datarow = obj.datarow + 1;
			}

			var itemheight = this._p_itemheight;
			if (itemheight)
				popupmenu.set_itemheight(itemheight);

			popupmenu._trackPopup(obj, "horizontal");
		}
	};

	_pPopupMenu._trackPopup = function (obj, direction, x, y)
	{
		this._createPopupMenu();

		if (!this._is_subcontrol && this._p_autohotkey)
		{
			var hotkey_list = this._hot_key_list;
			for (var i = 0; i < hotkey_list.length; i++)
			{
				this._registerItemHotkey(hotkey_list[i].key);
			}
		}

		this._reCalcSize();
		this.on_created(); // TO DO : need - Only items must be created

		var _left, _top, _width, _height;
		var parent = this._p_parent;
		var rootframe = this._getRootFrame();
		var s = nexacro._getElementPositionInFrame(rootframe.getElement());

		var padding = this._getCSSStyleValue("padding", this._status);
		var padding_l = 0, padding_r = 0, padding_b = 0, padding_t = 0;
		if (padding)
		{
			padding_l = padding.left;
			padding_r = padding.right;
			padding_b = padding.bottom;
			padding_t = padding.top;
		}

		var p_width, p_height, p;
		var popup_width = this._width;
		var popup_height = this._height;
		var bodyWidth = s.x + rootframe._adjust_width;
		var bodyHeight = s.y + rootframe._adjust_height;
		var tmp;
		var px;

		_width = popup_width;
		_height = popup_height;

		if (direction == "horizontal") // popupmenu
		{
			var p_padding = parent._padding ? parent._padding : parent._getCSSStyleValue("padding", parent._status);
			var p_padding_r = p_padding ? p_padding.right : 0;

			p = nexacro._getElementPositionInFrame(parent.getElement());
			p_width = parent._getClientWidth() + p_padding_r;
			//p_height = parent._getClientHeight();
			_left = p_width;
			_top = 0;
			if (!y)
			{
				// height size adjust
				tmp = p.y + obj._adjust_top + popup_height;
				if (tmp > bodyHeight)
				{
					if (s.y < (p.y - popup_height)) 
					{
						_top = bodyHeight - tmp;
					}
					else
					{
						//navigation visible
						_height = this._getRootFrame()._adjust_height - p.y - obj._adjust_top;
						this._showNavigationButton(true);
					}
				}
				else if (this._is_navigation_visible)
				{
					this._showNavigationButton(false);
				}
			}
			else
			{
				_top = y;
			}

			if (!x)
			{
				// width size adjust
				px = p.x;
				var px_width = px + p_width;
				if (px_width + popup_width > bodyWidth)
				{
					if (px - popup_width > 0)
						_left = -popup_width;
				}
			}
			else
			{
				_left = x;
			}

		}
		else // "vertical" menu
		{
			p = nexacro._getElementPositionInFrame(obj.getElement());

			p_height = obj._adjust_height;
			_left = 0;
			_top = p_height;

			if (!y)
			{
				// height size adjust
				tmp = p.y + p_height + popup_height;
				if (tmp > bodyHeight)
				{
					if (s.y < (p.y - popup_height))
					{
						_top = -popup_height;
					}
					else
					{
						//navigation visible
						_height = bodyHeight - p.y - parent._adjust_height;
						this._showNavigationButton(true);
					}
				}
				else if (this._is_navigation_visible)
				{
					this._showNavigationButton(false);
				}
			}
			else
			{
				_top += y;
			}

			if (!x)
			{
				// width size adjust
				px = p.x;
				if (px + popup_width > bodyWidth)
				{
					_left = bodyWidth - px - popup_width;
				}
			}
			else
			{
				_left += x;
			}
		}
		var popuptype = this._getPopupType();
		if (popuptype == "center")
		{

			var width = rootframe._adjust_width;
			var height = rootframe._adjust_height;
			if (nexacro._Browser == "Runtime")
			{
				// screen 높이에 따라 계산 되어야 하므로 보정 
				width = Math.round(width / nexacro._getDevicePixelRatio(this.getElement()));
				height = Math.round(height / nexacro._getDevicePixelRatio(this.getElement()));
			}
			var left = (width / 2) - (_width / 2);
			var top = (height / 2) - (_height / 2);

			this._adjustPopupPosition(left, top);
		}
		else
		{
			this._is_trackpopup = true;


			this._popupBy(obj, _left, _top - 1, _width, _height);
		}
	};

	_pPopupMenu._adjustPopupPosition = function (x, y, align, win_position)
	{
		var alignPosition = this._getAlignPosition(x, y, align);

		var popup_left = alignPosition[0] < 0 ? 0 : alignPosition[0];
		var popup_top = alignPosition[1] < 0 ? 0 : alignPosition[1];
		var popup_width = this._width;
		var popup_height = this._height;

		var popup_winpos_right = popup_left + popup_width;
		var popup_winpos_bottom = popup_top + popup_height;

		var _window = this._getWindow();
		var win_width = _window.clientWidth;
		var win_height = _window.clientHeight;
		var width_gap = popup_winpos_right - win_width;

		if (popup_winpos_right > win_width && popup_left > width_gap)
		{
			popup_left = popup_left - width_gap;
		}

		if (popup_winpos_bottom > win_height)
		{
			popup_top = win_height - popup_height;
		}

		this._is_trackpopup = true;
		this._popup(popup_left, popup_top, popup_width, popup_height);
	};

	_pPopupMenu._reCalcPopupPosition = function (obj)
	{
		var _left, _top, _width, _height;
		var parent = this._p_parent;
		var rootframe = this._getRootFrame();
		var s = nexacro._getElementPositionInFrame(rootframe.getElement());

		var padding = this._getCSSStyleValue("padding", this._status);
		var padding_l = 0, padding_r = 0, padding_b = 0, padding_t = 0;
		if (padding)
		{
			padding_l = padding.left;
			padding_r = padding.right;
			padding_b = padding.bottom;
			padding_t = padding.top;
		}

		var p_width, p;
		var popup_width = this._width;
		var popup_height = this._height;
		var bodyWidth = s.x + rootframe._adjust_width;
		var bodyHeight = s.y + rootframe._adjust_height;
		var tmp;
		var px;

		_width = popup_width + padding_l + padding_r;
		_height = popup_height + padding_b + padding_t;

		p = nexacro._getElementPositionInFrame(parent.getElement());
		p_width = parent._getClientWidth();
		_left = p_width;
		_top = 0;
		tmp = p.y + obj._adjust_top + popup_height;
		if (tmp > bodyHeight)
		{
			if (s.y < (p.y - popup_height)) 
			{
				_top = bodyHeight - tmp;
			}
			else
			{
				//navigation visible
				_height = this._getRootFrame()._adjust_height - p.y - obj._adjust_top;
				this._showNavigationButton(true);
			}
		}
		else if (this._is_navigation_visible)
		{
			this._showNavigationButton(false);
		}

		px = p.x;
		var px_width = px + p_width;
		if (px_width + popup_width > bodyWidth)
		{
			if (px - popup_width > 0)
				_left = -popup_width;
		}

		var popuptype = this._getPopupType();
		if (popuptype == "center")
		{

			var width = rootframe._adjust_width;
			var height = rootframe._adjust_height;
			if (nexacro._Browser == "Runtime")
			{
				// screen 높이에 따라 계산 되어야 하므로 보정 
				width = Math.round(width / nexacro._getDevicePixelRatio(this.getElement()));
				height = Math.round(height / nexacro._getDevicePixelRatio(this.getElement()));
			}
			var left = (width / 2) - (_width / 2);
			var top = (height / 2) - (_height / 2);

			this._adjustPopupPosition(left, top);
		}
		else
		{
			this._popupBy(obj, _left, _top - 1, _width, _height);
		}
	};

	_pPopupMenu._closePopup = function ()
	{
		var popupmenu = this._popupmenu;
		if (popupmenu)
		{
			popupmenu._closePopup();
		}

		var _window = this._getWindow();
		if (_window && this._track_capture)
		{
			_window._releaseCaptureLock(this);
		}

		var hotkey_list = this._hot_key_list;
		for (var i = 0; i < hotkey_list.length; i++)
		{
			this._unregisterItemHotkey(hotkey_list[i].key);
		}

		var items = this._item_find(this);
		if (this._env._p_enableaccessibility)
		{
			this._item_killfocus(items[this._popupitemindex]);
		}

		for (i = 0; i < items.length; i++)
		{
			var item = items[i];
			item._on_apply_mouseover(false);
			item._on_apply_selected(false);
		}

		this._popupitemindex = -1;
		this.set_visible(false);
		this._is_trackpopup = false;
	};

	_pPopupMenu._closeAllPopup = function ()
	{
		this._closePopup();
	};

	_pPopupMenu._reCalcSize = function (/*w,h*/)
	{
		var ds = this._innerdataset;
		if (ds && this._p_captioncolumn)
		{
			var items = this._items;
			if (!items || items.length == 0) return;

			var len = items.length;
			var currentstatus = this._status;
			var font = items[0]._getCurrentStyleInheritValue("font", this._status);
			var refer_font = items[0]._getReferenceAbsoluteFont(font); // use to em / rem
			var text_size = nexacro._getTextSize(">", font, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, refer_font);
			var expandtext_width = parseInt(text_size[0]);
			var controls_info = this._getControlInfo();
			var textcontrol_width = controls_info[0];
			var hotkeycontrol_width = controls_info[1];
			var maxtextheight = controls_info[2];
			var maxhotkeyheight = controls_info[3];
			var has_expand = controls_info[4];
			var itemborder = controls_info[5];
			var itemborder_t = 0, itemborder_b = 0;
			var itempadding = controls_info[6];
			var itempadding_l = 0, itempadding_r = 0, itempadding_t = 0, itempadding_b = 0;
			var iconimgwidth = controls_info[7];
			var itemheight = controls_info[8];
			var expimgwidth = controls_info[9];
			var expimgheight = controls_info[10];
			var bchkimg = controls_info[11];
			var chkimgwidth = 0;
			var border = this._getCSSStyleValue("border", currentstatus);
			var padding = this._padding ? this._padding : this._getCSSStyleValue("padding", currentstatus);

			if (itempadding)
			{
				itempadding_l = itempadding.left;
				itempadding_r = itempadding.right;
				itempadding_t = itempadding.top;
				itempadding_b = itempadding.bottom;
			}

			if (itemborder)
			{
				if (itemborder.top)
				{
					itemborder_t = itemborder.top._width;
				}
				if (itemborder.bottom)
				{
					itemborder_b = itemborder.bottom._width;
				}
			}

			var border_left = 0, border_top = 0, border_right = 0, border_bottom = 0;
			if (border)
			{
				border_left = border.left._width;
				border_top = border.top._width;
				border_right = border.right._width;
				border_bottom = border.bottom._width;
			}

			var padding_left = 0, padding_top = 0, padding_right = 0, padding_bottom = 0;
			if (padding)
			{
				padding_left = padding.left;
				padding_right = padding.right;
				padding_top = padding.top;
				padding_bottom = padding.bottom;
			}


			var item_h = this._p_itemheight;
			var item_contents_height = 0;
			if (item_h == undefined)
			{
				item_h = itemheight + itemborder_t + itemborder_b + itempadding_t + itempadding_b;
				item_contents_height = itemheight;
			}
			else
			{
				item_contents_height = item_h - itemborder_t - itemborder_b - itempadding_t - itempadding_b;
			}

			this._itemheight = item_h;

			if (bchkimg)
			{
				chkimgwidth = item_h;
			}

			var gap = 0, icontextpadding = 0;
			if (!this._p_checkboxcolumn && !this._p_iconcolumn)
			{
				iconimgwidth = 0;
				chkimgwidth = 0;
				icontextpadding = 0;
			}

			var iconwidth = 0;
			if (iconimgwidth && chkimgwidth)
			{
				if (iconimgwidth > chkimgwidth)
					iconwidth = iconimgwidth;
				else
					iconwidth = chkimgwidth;
			}
			else if (iconimgwidth)
			{
				iconwidth = iconimgwidth;
			}
			else
			{
				iconwidth = chkimgwidth;
			}
			var item_width = itempadding_l + itempadding_r + icontextpadding + (iconwidth ? iconwidth : 0) + (textcontrol_width ? textcontrol_width + gap : 0) + (hotkeycontrol_width ? hotkeycontrol_width + gap : 0) + (has_expand ? expimgwidth ? expimgwidth + gap : gap + expandtext_width : 0);
			var popupmenu_width = item_width + padding_left + padding_right + border_left + border_right;
			var items_total_height = this._items_total_height = item_h * len;
			var popupmenu_height = items_total_height + border_top + border_bottom + padding_top + padding_bottom;

			var buttonsize = this.buttonsize | 0;
			var navigation_visible = this._isNavigationbuttonVisible();
			if (navigation_visible)
			{
				this._rearrangePopupMenuItems();
			}
			else
			{
				this._showNavigationButton(navigation_visible);
				this.resize(popupmenu_width, popupmenu_height + this._lineItems.length - this._items.length);
			}
			var _item_top = padding_top + buttonsize;

			//recalc position popupmenu
			var icon_x = 0;
			var icon_end_x = iconwidth;


			var text_x = icon_x > itempadding_l ? icon_end_x + icontextpadding : icon_end_x;
			var hotkey_x = text_x + textcontrol_width + gap;

			this._setItemControlPosition(icon_x, iconwidth, itemheight, text_x, textcontrol_width, maxtextheight, hotkey_x, hotkeycontrol_width, maxhotkeyheight, gap, chkimgwidth, expimgwidth ? expimgwidth : expandtext_width, expimgheight ? expimgheight : 0, item_contents_height);

			for (var i = 0; i < this._lineItems.length; i++)
			{
				var item = this._lineItems[i];
				if (item._bLine)
				{
					var next_item = this._lineItems[i + 1];
					if (next_item && next_item._p_height > 0)
					{
						item.move(0, next_item.top - 1, popupmenu_width, 1);
					}
					else
					{
						if (i > 0 && this._lineItems[i - 1].height > 0)
						{
							item.move(0, this._lineItems[i - 1].height + this._lineItems[i - 1].top - 1, popupmenu_width, 1);
						}
						else
						{
							item.move(0, 0, 0, 0);
						}
					}
				}
				else
				{
					if (navigation_visible == false)
						item.move(padding_left, _item_top, item_width, item_h);

					if (this._env._p_enableaccessibility)
					{
						item._updateAccessibilityLabel(item);
					}
					_item_top += item_h;
				}
			}
		}
	};

	// popupmenuitem
	_pPopupMenu._rearrangePopupMenuItems = function ()
	{
		var start_navigation_index = this._start_navigation_index;
		var itemheight = this._itemheight;
		//var items_total_height = this._items_total_height;
		var client_width = this._getClientWidth();
		var client_height = this._getClientHeight();
		var items = this._items;
		var navigation_height = this._p_navigationbuttonsize || this._navigationbuttonsize || 0;
		var top = navigation_height;
		//var width = "";
		var len = items.length;
		var end_navigation_index = this._end_navigation_index;
		var sum_itemheight = top + navigation_height;

		//shownavigationbutton
		this._showNavigationButton(this._isNavigationbuttonVisible());
		//rearrange items
		var i, end;
		for (i = 0, end = start_navigation_index; i < end; i++)
		{
			items[i].move(0, 0, 0, 0);
		}
		for (i = start_navigation_index; i <= len; i++)
		{
			var item = items[i];
			end_navigation_index = i;
			sum_itemheight += itemheight;
			if (i == start_navigation_index || sum_itemheight < client_height)
			{
				if (item)
					item.move(0, top, client_width, itemheight);
			}
			else
			{
				break;
			}
			top += itemheight;
		}
		if (end_navigation_index > 0 && end_navigation_index < len)
		{
			for (i = end_navigation_index; i < len; i++)
			{
				items[i].move(0, 0, 0, 0);
			}
		}
		for (var i = 0; i < this._lineItems.length; i++)
		{
			var item = this._lineItems[i];
			if (item._bLine)
			{
				var next_item = this._lineItems[i + 1];

				if (next_item && next_item.height > 0)
				{
					item.move(0, next_item.top - 1, client_width, 1);
				}
				else
				{
					if (i > 0 && this._lineItems[i - 1].height > 0)
					{
						item.move(0, this._lineItems[i - 1].height + this._lineItems[i - 1].top - 1, client_width, 1);
					}
					else
					{
						item.move(0, 0, 0, 0);
					}
				}
			}
		}
		this._end_navigation_index = end_navigation_index;
	};

	_pPopupMenu._select_menuitem = function (nextitemindex, previtemindex/*, popupvisible*/)
	{
		var items = this._items;
		var prev_item = items[previtemindex];
		this._popupitemindex = nextitemindex;
		var next_item = items[nextitemindex];

		if (previtemindex)
			this._previtemindex = previtemindex;

		if (prev_item && nextitemindex != previtemindex)
		{
			this._do_defocus(prev_item);
			prev_item._changeUserStatus("selected", false);
		}
		if (next_item)
		{
			this._item_focus(next_item, true);
			next_item._changeUserStatus("selected", true);
			this._menuitemonmouseenter = next_item;
		}
	};

	// navigationbutton
	_pPopupMenu._createNavigationButton = function ()
	{
		var nextbutton = new nexacro.Button("nextbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
		nextbutton._setControl("ButtonControl");
		nextbutton._is_focus_accept = false;
		nextbutton.createComponent();
		nextbutton.set_visible(true);
		nextbutton._setEventHandler("onclick", this.on_notify_navigationnext_onclick, this);
		nextbutton.on_created();
		this.nextbutton = nextbutton;

		var prevbutton = new nexacro.Button("prevbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
		prevbutton._setControl("ButtonControl");
		prevbutton._is_focus_accept = false;
		prevbutton.createComponent();
		prevbutton.set_visible(true);
		prevbutton._setEventHandler("onclick", this.on_notify_navigationprev_onclick, this);
		prevbutton.on_created();
		prevbutton._changeStatus("disabled", true);
		this.prevbutton = prevbutton;

		var previcon = prevbutton._getCSSStyleValue("icon", "enabled");
		var img_size;
		if (previcon)
		{
			img_size = nexacro._getImageSize(previcon.url, this._rearrangePopupMenuItems, this);
			if (img_size)
			{
				this._navigationbuttonsize = img_size.height;
				this._rearrangePopupMenuItems();
			}
		}

		var nexticon = nextbutton._getCSSStyleValue("icon", "enabled");
		if (nexticon)
		{
			img_size = nexacro._getImageSize(nexticon.url, this._rearrangePopupMenuItems, this);
			if (img_size)
			{
				this._navigationbuttonsize = img_size.height;
				this._rearrangePopupMenuItems();
			}
		}
	};

	_pPopupMenu._showNavigationButton = function (navigation_visible)
	{
		this._is_navigation_visible = navigation_visible;
		var prevbutton, nextbutton;
		if (navigation_visible)
		{
			if (!this.prevbutton || !this.nextbutton)
			{
				this._createNavigationButton();
			}
			prevbutton = this.prevbutton;
			nextbutton = this.nextbutton;
			var navigationbuttonsize = this._p_navigationbuttonsize;
			var navigationprevbutton_height = 0;
			var navigationnextbutton_height = 0;

			if (!navigationbuttonsize)
			{
				var navigationbutton_height = this._getNavigationbuttonHeight(nextbutton, prevbutton);
				navigationnextbutton_height = navigationbutton_height[0];
				navigationprevbutton_height = navigationbutton_height[1];
			}
			else
			{
				navigationnextbutton_height = navigationbuttonsize;
				navigationprevbutton_height = navigationbuttonsize;
			}
			this._navigationbuttonsize = navigationprevbutton_height;
			var client_width = this._getClientWidth();
			var client_height = this._getClientHeight();
			prevbutton.set_visible(true);
			prevbutton.move(0, 0, client_width, navigationprevbutton_height - 1);
			nextbutton.set_visible(true);
			nextbutton.move(0, client_height - navigationnextbutton_height, client_width, navigationnextbutton_height - 1);
		}
		else
		{
			prevbutton = this.prevbutton;
			if (prevbutton)
			{
				prevbutton.set_visible(false);
				prevbutton.move(0, 0, 0, 0);
			}

			nextbutton = this.nextbutton;
			if (nextbutton)
			{
				nextbutton.set_visible(false);
				nextbutton.move(0, 0, 0, 0);
			}
		}
	};

	_pPopupMenu._calcNavigationbutton = function (/*obj*/y)
	{
		var rootframe = this._getRootFrame();
		var s = nexacro._getElementPositionInFrame(rootframe.getElement());
		var bodyHeight = s.y + rootframe._adjust_height;
		if (this._items_total_height > bodyHeight)
		{
			//navigation visible
			this._is_navigation_visible = true;
			if (this._itemheight < bodyHeight - y)
				bodyHeight -= y;
			this.resize(this._width, bodyHeight);
		}
		else if (this._is_navigation_visible)
		{
			this._is_navigation_visible = false;
		}
	};

	_pPopupMenu._navigationPrev = function ()
	{
		var start_index = this._start_navigation_index;
		if (start_index > 0)
		{
			if (this._items.length == this._end_navigation_index)
				this.nextbutton._changeStatus("disabled", false);
			start_index--;
			if (start_index == 0)
				this.prevbutton._changeStatus("disabled", true);
		}
		this._start_navigation_index = start_index;
		this._rearrangePopupMenuItems();
	};

	_pPopupMenu._navigationNext = function ()
	{
		var threshold = this._items.length;
		if (this._end_navigation_index < threshold)
		{
			if (this._start_navigation_index == 0)
				this.prevbutton._changeStatus("disabled", false);
			this._start_navigation_index++;
		}
		this._rearrangePopupMenuItems();
		if (this._end_navigation_index == threshold)
		{
			this.nextbutton._changeStatus("disabled", true);
		}
	};

	// hotkey
	_pPopupMenu._setHotkey = function (id, v, popupmenuitem)
	{
		var hotkey = new nexacro._HotKey(v);
		if (hotkey._isEmpty())
		{
			hotkey = null;
		}

		var list = {
			id: id,
			key: hotkey,
			obj: popupmenuitem
		};

		this._hot_key_list.push(list);
	};

	_pPopupMenu._registerItemHotkey = function (hotkey)
	{
		if (!hotkey || hotkey._is_registered)
		{
			return;
		}

		var _form = this._getMainForm();
		if (_form)
		{
			nexacro._registerHotkeyComp(_form, this, hotkey);
		}

		this._setAccessibilityHotKey(hotkey);
	};

	_pPopupMenu._unregisterItemHotkey = function (hotkey)
	{
		if (!hotkey || !hotkey._is_registered)
		{
			return;
		}

		var _form = this._getMainForm();
		if (_form)
		{
			nexacro._unregisterHotkeyComp(_form, this, hotkey);
		}
	};

	// etc
	_pPopupMenu._loaded_expImage = function (imgurl, w, h)
	{
		if (this._expImage_width != w || this._expImage_height != h)
		{
			this._expImage_width = w;
			this._expImage_height = h;

			if (this._p_visible)
			{
				this._reCalcSize();
			}
		}
	};

	_pPopupMenu._loaded_chkImage = function (imgurl, w, h)
	{
		if (this._chkImage_width != w || this._chkImage_height != h)
		{
			this._chkImage_width = w;
			this._chkImage_height = h;

			if (this._p_visible)
			{
				this._reCalcSize();
			}
		}
	};

	_pPopupMenu._loaded_iconImage = function (imgurl, w, h)
	{
		if (!this._iconImage_info[imgurl])
		{
			this._iconImage_info[imgurl] = {
				width: 0,
				height: 0
			};
		}

		if (this._iconImage_info[imgurl].width != w || this._iconImage_info[imgurl].height != h)
		{
			this._iconImage_info[imgurl].width = w;
			this._iconImage_info[imgurl].height = h;

			if (this._p_visible)
			{
				this._reCalcSize();
			}
		}
	};

	_pPopupMenu._load_image = function (strImageUrl, strflag)
	{
		var control_elem = this._control_element;
		if (control_elem)
		{
			var val = strImageUrl;
			if (val)
			{
				val = nexacro._getURIValue(val);
				val = nexacro._getImageLocation(val, this._getRefFormBaseUrl());

				var size;
				if (strflag == "exp") //expimg
				{
					size = nexacro._getImageSize(val, this._loaded_expImage, this);
					if (size)
					{
						this._expImage_width = size.width;
						this._expImage_height = size.height;
					}
				}
				else if (strflag == "chk")//checkimg
				{
					size = nexacro._getImageSize(val, this._loaded_chkImage, this);
					if (size)
					{
						this._chkImage_width = size.width;
						this._chkImage_height = size.height;
					}
				}
				else if (strflag == "icon")//icon
				{
					size = nexacro._getImageSize(val, this._loaded_iconImage, this);
					if (size)
					{
						if (!this._iconImage_info[val])
						{
							this._iconImage_info[val] = {
								width: 0,
								height: 0
							};
						}

						this._iconImage_info[val].width = size.width;
						this._iconImage_info[val].height = size.height;
					}
				}
				return val;
			}
		}
	};

	//===============================================================
	// nexacro.PopupMenu : Util Function
	//===============================================================
	// popupmenu
	_pPopupMenu._getPopupControl = function ()
	{
		var rootcomp = this._getRootComponent(this);
		return rootcomp._popupmenu;
	};

	_pPopupMenu._getPopupType = function ()
	{
		var rootComp = this._getRootComponent(this);
		var popuptype = rootComp._p_popuptype;
		return popuptype ? popuptype : "normal";
	};

	_pPopupMenu._isPopupmenuVisible = function (obj)
	{
		if (!obj || obj._popupmenu == null || obj._popupmenu._p_visible == false)
		{
			return false;
		}
		return true;
	};

	// navigationbutton
	_pPopupMenu._isNavigationbuttonVisible = function ()
	{
		return this._is_navigation_visible;
	};

	_pPopupMenu._getNavigationbuttonHeight = function (nextbutton, prevbutton)
	{
		var prev_height = 0;
		var img_size, padding, border, next_height = 0;

		var nexticon = nextbutton._getCSSStyleValue("icon", "enabled");
		if (nexticon)
		{
			img_size = nexacro._getImageSize(nexticon.url, nexacro._emptyFn, this);
			if (img_size)
			{
				next_height = img_size.height;

				padding = nextbutton._getCSSStyleValue("padding", this._status);
				if (padding)
				{
					next_height += padding.top + padding.bottom;
				}

				border = nextbutton._getCSSStyleValue("border", this._status);
				if (border)
				{
					if (border._single)
					{
						next_height += border.top._width + border.top._width;
					}
					else
					{
						next_height += border.top._width + border.bottom._width;
					}
				}
			}
		}

		var previcon = prevbutton._getCSSStyleValue("icon", "enabled");
		if (previcon)
		{
			img_size = nexacro._getImageSize(previcon.url, nexacro._emptyFn, this);
			if (img_size)
			{
				prev_height = img_size.height;

				padding = prevbutton._getCSSStyleValue("padding", this._status);
				if (padding)
				{
					prev_height += padding.top + padding.bottom;
				}

				border = prevbutton._getCSSStyleValue("border", this._status);
				if (border)
				{
					if (border._single)
					{
						prev_height += border.top._width + border.top._width;
					}
					else
					{
						prev_height += border.top._width + border.bottom._width;
					}
				}
			}
		}

		return [next_height, prev_height];
	};

	// etc
	_pPopupMenu._getMaxTextSize = function (column)
	{
		var ds = this._innerdataset;
		var text_maxsize = [0, 0];
		if (ds)
		{
			var text_size;
			var items = this._items;
			if (items)
			{
				var len = items.length;
				if (len)
				{
					var font = items[0]._getCurrentStyleInheritValue("font", this._status);
					var refer_font = items[0]._getReferencsAbsoluteFont(font);
					for (var i = 0; i < len; i++)
					{
						var text = ds.getColumn(items[i].datarow, column);
						if (text === undefined) break;

						text_size = nexacro._getTextSize(text, font, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, refer_font);
						if (text_size[0] > text_maxsize[0]) //width
							text_maxsize[0] = text_size[0];
						if (text_size[1] > text_maxsize[1]) //height
							text_maxsize[1] = text_size[1];
					}
				}
			}
		}
		return text_maxsize;
	};

	_pPopupMenu._getMenuObj = function ()
	{
		var p = this._p_parent;
		while (!(p instanceof nexacro.Menu))
		{
			p = p.parent;
		}
		return p;
	};

	_pPopupMenu._getControlInfo = function ()
	{
		var items = this._items;
		var text_control_size = {};
		var hotkey_control_size = {};
		var max_text_width = 0;
		var max_hotkey_width = 0;
		var max_icon_width = 0;
		var max_icon_height = 0;
		var text_height = 0;
		var hotkey_height = 0;
		var text_font, hotkey_font, refer_font;
		var max_item_height = 0;
		var item_border;
		var item_padding;

		var has_expand = false;
		//var text_size;
		//var hotkey_size;
		var icon_border;
		var icon_padding;
		var text_border;
		var hotkey_border;

		var text_padding;
		var hotkey_padding;
		var icon_width = 0;
		var icon_height = 0;
		var expandimg_width = 0;
		var expandimg_height = 0;
		var bchkimg = false;

		for (var i = 0, len = items.length; i < len; i++)
		{
			var item = items[i];
			var text_control = item._textcontrol;
			var hotkey_control = item._hotkeytextcontrol;
			var expiconcontrol = item._expiconcontrol;
			var currentstatus = item._status;
			if (item._check)
				bchkimg = true;

			var icon_control = item._iconcontrol;
			if (icon_control)
			{
				var icon = icon_control._icon || icon_control._getCSSStyleValue("icon", currentstatus);
				if (icon)
				{
					var iconsize = nexacro._getImageSize(icon.value, this._loaded_iconImage, this);
					if (iconsize)
					{
						icon_width = iconsize.width;
						icon_height = iconsize.height;
					}
				}

				icon_border = icon_control._getCSSStyleValue("border", currentstatus);
				if (icon_border)
				{
					if (icon_border._single)
					{
						icon_width = icon_width + icon_border.top._width + icon_border.top._width;
						icon_height = icon_height + icon_border.top._height + icon_border.top._height;
					}
					else
					{
						icon_width = icon_width + icon_border.top._width + icon_border.bottom._width;
						icon_height = icon_height + icon_border.top._height + icon_border.bottom._height;
					}
				}

				icon_padding = icon_control._getCSSStyleValue("padding", currentstatus);
				if (icon_padding)
				{
					icon_width = icon_width + icon_padding.left + icon_padding.right;
					icon_height = icon_height + icon_padding.top + icon_padding.bottom;
				}

				if (icon_width > max_icon_width)
				{
					max_icon_width = icon_width;
				}

				if (icon_height > max_icon_height)
				{
					max_icon_height = icon_height;
				}
			}

			if (text_control)
			{
				var text = text_control.text;
				if (text)
				{
					if (!text_font)
					{
						text_font = text_control._getCurrentStyleInheritValue("font", currentstatus);
					}

					refer_font = text_control._getReferenceAbsoluteFont(text_font); // use to em / rem
					text_control_size = nexacro._getTextSize(text, text_font, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, refer_font);
					if (text_control_size[0] > max_text_width)
					{
						max_text_width = text_control_size[0];
					}
				}

				if (!text_border)
				{
					text_border = text_control._getCSSStyleValue("border", currentstatus);
				}

				if (!text_padding)
				{
					text_padding = text_control._getCSSStyleValue("padding", currentstatus);
				}
			}
			if (hotkey_control)
			{
				var hotkey = hotkey_control.text;
				if (hotkey)
				{
					if (!hotkey_font)
					{
						hotkey_font = hotkey_control._getCurrentStyleInheritValue("font", this._status);
					}

					refer_font = hotkey_control._getReferenceAbsoluteFont(hotkey_font); // use to em / rem
					hotkey_control_size = nexacro._getTextSize(hotkey, hotkey_font, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, refer_font);

					if (hotkey_control_size[0] > max_hotkey_width)
					{
						max_hotkey_width = hotkey_control_size[0];
					}
				}
				if (!hotkey_border)
				{
					hotkey_border = hotkey_control._getCSSStyleValue("border", currentstatus);
				}

				if (!hotkey_padding)
				{
					hotkey_padding = hotkey_control._getCSSStyleValue("padding", currentstatus);
				}
			}
			if (!has_expand && item._canExpand)
			{
				has_expand = true;
			}

			if (expiconcontrol)
			{
				var expicon = expiconcontrol._getCSSStyleValue("icon", currentstatus);
				if (expicon)
				{
					var expsize = nexacro._getImageSize(expicon.value, this._loaded_expImage, this);
					if (expsize)
					{
						expandimg_width = expsize.width;
						expandimg_height = expsize.height;
					}
				}
			}

			if (!item_padding)
			{
				item_padding = item._getCSSStyleValue("padding");
			}

			if (!item_border)
			{
				item_border = item._getCSSStyleValue("border");
			}
		}

		if (!max_item_height)
		{
			text_height = text_control_size[1];
			if (text_border)
			{
				if (text_border._single)
				{
					text_height = text_height + text_border.top._width + text_border.top._width;
					max_text_width = max_text_width + text_border.top._width + text_border.top._width;
				}
				else
				{
					text_height = text_height + text_border.top._width + text_border.bottom._width;
					max_text_width = max_text_width + text_border.top._width + text_border.bottom._width;
				}
			}

			if (text_padding)
			{
				text_height = text_height + text_padding.top + text_padding.bottom;
			}

			if (text_control_size && hotkey_control_size.length > 1)
			{
				hotkey_height = hotkey_control_size[1];
				if (hotkey_border)
				{
					if (hotkey_border._single)
					{
						hotkey_height = hotkey_height + hotkey_border.top._width + hotkey_border.top._width;
						max_hotkey_width = max_hotkey_width + hotkey_border.top._width + hotkey_border.top._width;
					}
					else
					{
						hotkey_height = hotkey_height + hotkey_border.top._width + hotkey_border.bottom._width;
						max_hotkey_width = max_hotkey_width + hotkey_border.top._width + hotkey_border.bottom._width;
					}
				}
				if (hotkey_padding)
				{
					hotkey_height = hotkey_height + hotkey_padding.top + hotkey_padding.bottom;
				}
				max_item_height = text_height > hotkey_height ? text_height : hotkey_height;
			}
			else
			{
				max_item_height = text_height;
			}

			max_item_height = Math.max(max_item_height, max_icon_height);
		}

		//calcultate with padding left and padding right
		if (text_padding)
		{
			max_text_width = max_text_width + text_padding.left + text_padding.right;
		}
		if (hotkey_padding)
		{
			max_hotkey_width = max_hotkey_width + hotkey_padding.left + hotkey_padding.right;
		}

		return [Math.ceil(max_text_width), Math.ceil(max_hotkey_width), text_height, hotkey_height, has_expand, item_border, item_padding, max_icon_width ? max_icon_width : 0, max_item_height, expandimg_width, expandimg_height, bchkimg];
	};

	_pPopupMenu._getAlignPosition = function (x, y, align)
	{
		if (align)
		{
			var width = this._width;
			var height = this._height;
			var popup_align = align.split(/\s+/);
			var align_len = popup_align.length;
			var horizon = parseInt(x, 10) | 0;
			var vertical = parseInt(y, 10) | 0;
			switch (align_len)
			{
				case 0:
					break;
				case 1:
					if (popup_align[0] == "left")
					{
						x = horizon - width;
					}
					else if (popup_align[0] == "center")
					{
						x = horizon - (width / 2);
					}
					else if (popup_align[0] == "top")
					{
						y = vertical - height;
					}
					else if (popup_align[0] == "middle")
					{
						y = vertical - (height / 2);
					}
					break;
				case 2:
					if (popup_align[0] == "left" || popup_align[0] == "center" || popup_align[0] == "right")
					{
						if (popup_align[0] == "left")
						{
							x = horizon - width;
						}
						else if (popup_align[0] == "center")
						{
							x = horizon - (width / 2);
						}
					}
					else if (popup_align[0] == "top" || popup_align[0] == "middle" || popup_align[0] == "bottom")
					{
						if (popup_align[0] == "top")
						{
							y = vertical - height;
						}
						else if (popup_align[0] == "middle")
						{
							y = vertical - (height / 2);
						}
					}

					if (popup_align[1] == "left" || popup_align[1] == "center" || popup_align[1] == "right")
					{
						if (popup_align[1] == "left")
						{
							x = horizon - width;
						}
						else if (popup_align[1] == "center")
						{
							x = horizon - (width / 2);
						}
					}
					else if (popup_align[1] == "top" || popup_align[1] == "middle" || popup_align[1] == "bottom")
					{
						if (popup_align[1] == "top")
						{
							y = vertical - height;
						}
						else if (popup_align[1] == "middle")
						{
							y = vertical - (height / 2);
						}
					}
					break;
				default:
					break;
			}
		}
		return [x, y];
	};

	_pPopupMenu._getItemIndex = function (dir)
	{
		//0 just index
		//1 increaed index
		//2 decreased index
		if (dir === undefined) dir = 0;
		var inc = dir < 0 ? dir : 1;
		var popupitemindex = dir === 0 ? 0 : this._popupitemindex + inc;

		var items = this._items;
		var popupitem_len = items ? items.length : 0;

		for (var i = 0; i < popupitem_len; i++)
		{
			var item = items[popupitemindex];
			if (this._env._p_enableaccessibility)
			{
				if (item)
					return popupitemindex;
			}
			else
			{
				if (item && item._real_enable)
					return popupitemindex;
			}
			popupitemindex += inc;
			if (popupitemindex > popupitem_len) popupitemindex = 0;
			else if (popupitemindex < 0) popupitemindex = popupitem_len - 1;
		}
		return this._popupitemindex;
	};

	_pPopupMenu._getEventInfoComponent = function (refer_comp)
	{
		while (!refer_comp._is_eventinfo_control)
		{
			refer_comp = refer_comp._p_parent;
		}
		return refer_comp;
	};

	_pPopupMenu._setContents = function (str)
	{
		var ds = this._convertObjectContents(str);
        if(ds)
        {
            this.set_innerdataset(ds); 
            return true;
        }
        return false;
	};

	_pPopupMenu._setItemControlPosition = function (icon_x, iconimgwidth, iconheight, text_x, textwidth, textheight, hotkey_x, hotkeywidth, hotkeyheight, gap, chkimgwidth, expimgwidth, expimgheight, itemheight)
	{
		var height = itemheight ? itemheight : iconheight;

		this._itempos = {
			icon_x: icon_x,
			iconimgwidth: iconimgwidth,
			iconheight: height,
			text_x: text_x,
			textheight: height,
			textwidth: textwidth,
			hotkey_x: hotkey_x,
			hotkeywidth: hotkeywidth,
			hotkeyheight: height,
			expimgwidth: expimgwidth,
			expimgheight: expimgheight,
			chkimgwidth: chkimgwidth,
			gap: gap
		};
	};

	_pPopupMenu._setInnerDatasetStr = function (str)
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

	_pPopupMenu._removeEventHandlerToInnerDataset = function ()
	{
		if (this._innerdataset)
		{
			this._innerdataset._removeEventHandler("onrowposchanged", this._callbackFromDataset, this);
			this._innerdataset._removeEventHandler("oncolumnchanged", this._callbackFromDataset, this);
			this._innerdataset._removeEventHandler("onrowsetchanged", this._callbackFromDataset, this);
			this._innerdataset._removeEventHandler("onvaluechanged", this._callback_onvaluechanged, this);
			this._innerdataset = null;
		}
	};

	_pPopupMenu._item_find = function (obj)
	{
		if (obj._popupmenu == null || obj._popupmenu._p_visible == false)
		{
			return obj._items;
		}
		return obj._popupmenu._items;
	};

	_pPopupMenu._popupmenu_find = function (obj)
	{
		var pThis = obj;
		while (pThis)
		{
			if (pThis._popupmenu === null || pThis._popupmenu._p_visible == false)
			{
				break;
			}
			pThis = pThis._popupmenu;
		}
		return pThis;
	};

	_pPopupMenu._popupmenuitem_extend = function (obj)
	{
		return obj._canExpand;
	};

	_pPopupMenu = null;
}