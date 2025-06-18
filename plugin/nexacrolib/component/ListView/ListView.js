//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2014 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacro-public-license-readme-1.0.html	
//
//==============================================================================

if (!nexacro._ListViewCellControl)
{
    nexacro.ListViewCellInfo = function (id, parent, view, type, idx)
    {
        nexacro.CellInfo.call(this, id, parent, view, type, idx);
    };

    var _pListViewCellInfo = nexacro._createPrototype(nexacro.CellInfo, nexacro.ListViewCellInfo);
    nexacro.ListViewCellInfo.prototype = _pListViewCellInfo;
    _pListViewCellInfo._type_name = "ListViewCellInfo";

    _pListViewCellInfo._use_displaytype_controls = [
        "buttoncontrol",
        "checkboxcontrol",
        "imagecontrol",
        "combocontrol",
        "multicombocontrol",
        "calendarcontrol",
        "editcontrol",
        "maskeditcontrol",
        "textareacontrol",
        "progressbarcontrol"
    ];

    _pListViewCellInfo._addPropertyMap("_pListViewCellInfo", [
        ["left", "left", false, null, false],
        ["top", "top", false, null, false],
        ["width", "width", false, null, false],
        ["height", "height", false, null, false],
        ["right", "right", false, null, false],
        ["bottom", "bottom", false, null, false],
        ["minwidth", "minwidth", false, null, false],
        ["minheight", "minheight", false, null, false],
        ["maxwidth", "maxwidth", false, null, false],
        ["maxheight", "maxheight", false, null, false]
    ], true, _pListViewCellInfo);

    _pListViewCellInfo._syncPosition = function (cellcontrol)
    {
        this.set_left(cellcontrol.left);
        this.set_width(cellcontrol.width);
        this.set_right(cellcontrol.right);
        this.set_top(cellcontrol.top);
        this.set_height(cellcontrol.height);
        this.set_bottom(cellcontrol.bottom);
    };

    _pListViewCellInfo.destroy = function ()
    {
        nexacro.CellInfo.prototype.destroy.call(this);
    };

    nexacro._defineProperties(_pListViewCellInfo, _pListViewCellInfo._properties);

    _pListViewCellInfo = null;

    //==============================================================================
    // nexacro._ListViewCellControl
    //==============================================================================
    nexacro._ListViewCellControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, cellinfo)
    {
        // TODO : Component/Control Create 최소 Argument와 추가 Argument용 Interface 정형화
        nexacro._CellControl.call(this, id, left, top, width, height, right, bottom, parent, cellinfo, undefined, undefined, undefined);
    };
    var _pListViewCellControl = nexacro._createPrototype(nexacro._CellControl, nexacro._ListViewCellControl);
    nexacro._ListViewCellControl.prototype = _pListViewCellControl;

    _pListViewCellControl._type_name = "ListViewCellControl";
    _pListViewCellControl._is_subcontrol = true;
    _pListViewCellControl._is_use_auto_selected_status = false;
    _pListViewCellControl._is_apply_hide_editor = true;

    //===============================================================
    // nexacro._ListViewCellControl : Create/Destroy
    //===============================================================
    _pListViewCellControl.on_created_contents = function (win)
    {
        nexacro._CellControl.prototype.on_created_contents.call(this, win);

        this._updateAll();
        this._refinfo._syncPosition(this);
    };

    _pListViewCellControl.on_attach_contents_handle = function (win)
    {
        nexacro._CellControl.prototype.on_attach_contents_handle.call(this, win);

        this._updateAll();
        this._refinfo._syncPosition(this);
    };

    _pListViewCellControl._setAddedCreateInfo = function (comp, ctxt, seq)
    {
        // init cell
        this._refinfo = ctxt._cellinfo;
        this._varbind = ctxt._valuebind;
        this._view = comp._view;
        this._band = comp._band;
        this._rowidx = comp._rowidx;
        this._bandidx = comp._band == "body" ? 0 : 1;
        this._cellidx = seq;
        /*
        this._expand_width = 0;
        this._subComp = null;
        this._text_elem = null;
        this._curDisplayType = "";
        this._curEditDisplay = "";
        this._expandCtrl = null;
        this._isSubCell = false;
        this._disp_show = true;
        this._fakecell = false;
        this._hideInner = false;
        this._is_real_upelem = null;
        this._clickcall = false;
        this._is_clickproc = false;
        this._mouse_evt_change_pseudo = false;
        this._refresh_display = false;
        this._is_simple_control = true;
        this._use_selected_status = true;
        */
    };

    //===============================================================
    // nexacro._ListViewCellControl : Override
    //===============================================================
    _pListViewCellControl._onGetDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        return { want_tab: true, want_return: true, want_escape: true, want_chars: true, want_arrows: true };
    };

    _pListViewCellControl._onGetBindableProperties = function ()
    {
        return "text";
    };

    _pListViewCellControl._isReadOnly = function ()
    {
        return this._p_readonly == true || this._real_readonly == true;
    };

    _pListViewCellControl._isEnable = function ()
    {
        return this._p_parent ? this._p_parent._real_enable && this._p_enable : this._p_enable;
    };

    _pListViewCellControl._isEditable = function ()
    {
        var listview = this._view;
        return listview._p_readonly != true && listview._real_readonly != true;
    };

    _pListViewCellControl._isEditableComponent = function ()
    {
        return this._hasEditor() && this._isShowEditor();
    };

    _pListViewCellControl._isConditionEditor = function ()
    {
        var listview = this._view;
        var currselect = listview.getSelect();
        var datarow = listview._getDataRow(this._rowidx);

        return (currselect.row == datarow && currselect.band == this._bandidx && currselect.cell == this._cellidx);
    };

    _pListViewCellControl._getRemoveLine = function ()
    {
        return [false, false, false, false];
    };

    //===============================================================
    // nexacro._ListViewCellControl : Event
    //===============================================================
    _pListViewCellControl.on_focus_basic_action = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        // def basic action
        nexacro._CellControl.prototype.on_focus_basic_action.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);

        // own basic action
        this._actionEditCell(this._getActionCell(refer_new_focus), "setfocus");

        if (this._env._p_enableaccessibility)
        {
            this._setAccessibilityStatFocus(evt_name);
        }

        this._view._is_first_focus_band = false;
        this._view._is_listview_focus = false;
        this._view._is_expandbar_focus = false;
    };

    _pListViewCellControl.on_killfocus_basic_action = function (new_focus, new_refer_focus)
    {
        nexacro.Component.prototype.on_killfocus_basic_action.call(this);

        // def basic action
        nexacro._CellControl.prototype.on_killfocus_basic_action.call(this, new_focus, new_refer_focus);

        // own basic action
        this._actionEditCell(this._getActionCell(this), "killfocus");
    };

    _pListViewCellControl.on_fire_ondropdown = function (obj)
    {
        return this._view.on_fire_ondropdown(obj);
    };

    _pListViewCellControl.on_fire_oncloseup = function (obj, pretext, posttext, prevalue, postvalue)
    {
        return this._view.on_fire_oncloseup(obj, pretext, posttext, prevalue, postvalue);
    };

    _pListViewCellControl.on_fire_onenterdown = function (obj)
    {
        return this._view.on_fire_onenterdown(obj);
    };

    _pListViewCellControl._on_last_lbuttonup = function ()
    {
        this.parent._on_last_lbuttonup();
    };

    _pListViewCellControl._on_last_keyup = function ()
    {
        this.parent._on_last_keyup();
    };

    _pListViewCellControl._on_killfocus = function (new_focus, new_refer_focus)
    {
        if (!this._is_alive) return;

        if (this._env._p_enableaccessibility)
        {
            var firstcell = this._view._findEditableCell(this.parent, 0, 1);
            if (firstcell && firstcell._rowidx == this._rowidx && firstcell._bandidx == this._bandidx)
            {
                this.on_apply_accessibility();
            }
        }

        this.on_killfocus_basic_action(new_focus, new_refer_focus);
    };

    //===============================================================
    // nexacro._ListViewCellControl : Logical Part
    //===============================================================
    _pListViewCellControl._actionEditCell = function (cell, trigger)
    {
        if (!cell)
            return;

        var autoenter = this._getAutoEnter();
        var acceptsenter;

        switch (trigger)
        {
            case "setfocus":
                if (autoenter == "select" && cell.selected)
                {
                    if (cell._hasEditor() && cell._isEditable())
                        cell._showEditor();
                    else
                        cell._setSubControlFocus(true);
                }
                break;
            case "killfocus":

                cell._setSubControlFocus(false);

                if (cell._isShowEditor())
                {
                    cell._applyEditor(true);
                    cell._hideEditor();
                }
                break;
            case "lbuttondown":
                var show = cell.selected;

                cell.setFocus(false, true);

                if (autoenter != "select")
                {
                    if (show)
                        if (cell._hasEditor() && cell._isEditable())
                        {
                            cell._showEditor();
                        }
                        else
                        {
                            cell._setSubControlFocus(true);
                        }
                }
                break;
            case "lbuttonup":
                break;
            case "tabkey":
                if (cell._hasEditor() && cell._isEditable())
                {
                    cell._showEditor();
                }
                else
                    cell._setSubControlFocus(true);
                break;
            case "enterkey":
                if (cell._isEnterDownable())
                {


                    if (cell._editor)
                    {
                        acceptsenter = nexacro._toBoolean(cell._editor._cellinfo._getAttrValue(cell._editor._cellinfo._p_textareaacceptsenter));


                        if (cell._getCellEditType() == "textarea")
                        {
                            if (acceptsenter)
                            {
                                cell.on_fire_onenterdown(cell._editor);
                            }
                            else
                            {
                                cell._applyEditor(true);
                                cell.on_fire_onenterdown(cell._editor);
                                cell._hideEditor();
                            }
                        }
                        else
                        {
                            cell._applyEditor(true);
                            cell.on_fire_onenterdown(cell._editor);

                            if (this._is_apply_hide_editor)
                            {
                                cell._hideEditor();
                            }
                            else
                            {
                                this._is_apply_hide_editor = true;
                            }
                        }
                    }
                    else
                    {
                        cell._applyEditor(true);
                        cell.on_fire_onenterdown(cell); // cellcheckboxControl인 경우      
                    }
                    cell._setSubControlFocus(true);
                }
                else if (cell._hasEditor() && cell._isEditable())
                {
                    if (!this._getWindow()._modal_frame_stack.length)   // modal 창이 존재할 경우 pass
                    {
                        nexacro._OnceCallbackTimer.callonce(this, function ()
                        {
                            cell._showEditor();
                        }, 50);
                    }
                }
                else
                    cell._setSubControlFocus(true);
                break;
            case "ctrlenterkey":
                if (cell._isEnterDownable())
                {


                    if (cell._editor)
                    {
                        acceptsenter = nexacro._toBoolean(cell._editor._cellinfo._getAttrValue(cell._editor._cellinfo._p_textareaacceptsenter));

                        if (cell._getCellEditType() == "textarea")
                        {
                            if (!acceptsenter)
                            {
                                cell.on_fire_onenterdown(cell._editor);
                            }
                            else
                            {
                                cell._applyEditor(true);
                                cell.on_fire_onenterdown(cell._editor);
                                cell._hideEditor();
                            }
                        }
                        else
                        {
                            cell._applyEditor(true);
                            cell.on_fire_onenterdown(cell._editor);
                            cell._hideEditor();
                        }
                    }
                    else
                    {
                        cell._applyEditor(true);
                        cell.on_fire_onenterdown(cell); // cellcheckboxControl인 경우
                    }
                }
                else if (cell._hasEditor() && cell._isEditable())
                {
                    if (!this._getWindow()._modal_frame_stack.length)   // modal 창이 존재할 경우 pass
                    {
                        nexacro._OnceCallbackTimer.callonce(this, function ()
                        {
                            cell._showEditor();
                        }, 50);
                    }
                }
                else
                    cell._setSubControlFocus(true);
                break;
            case "charkey":
                if (cell._hasEditor() && cell._isEditable())
                {
                    if (!cell._isShowEditor())
                    {
                        cell._showEditor();
                        cell._editor.set_value("");
                    }
                }
                else
                    cell._setSubControlFocus(true);
                break;
        }
    };

    _pListViewCellControl._applyEditor = function (async)
    {
        if (this._editor && this._writable && this._view && this._varbind)
        {
            var value = this._editor._getValueData();
            var rowidx = this._getDataRow();

            this._view._setBindData(rowidx, this._varbind, value);
            this._view._getBindData(rowidx);

            this._updateAll();
        }
    };

    //===============================================================
    // nexacro._ListViewCellControl : Util Function
    //===============================================================
    _pListViewCellControl._getChildren = function ()
    {
        // Canvas ScrollCover Draw시에 사용.
        return [this._subComp];
    };

    _pListViewCellControl._getActionCell = function (from_cell)
    {
        var cellobj = from_cell;
        while (cellobj && cellobj._type_name != this._type_name)
        {
            if (cellobj == this)
            {
                break;
            }

            if (cellobj._cellobj && cellobj._cellobj._is_alive && cellobj._cellobj._type_name == this._type_name)
            {
                cellobj = cellobj._cellobj;
                break;
            }

            cellobj = cellobj.parent;
        }

        if (cellobj && cellobj._type_name == this._type_name)
        {
            if (cellobj.parentcell)
            {
                cellobj = cellobj.parentcell;
            }
        }

        return cellobj;
    };

    _pListViewCellControl._getCellEditType = function ()
    {
        return this._refinfo._getEdittype(this._getDataRow());
    };

    _pListViewCellControl._getCellDisplayType = function ()
    {
        return this._refinfo._getDisplaytype(this._getDataRow());
    };

    _pListViewCellControl._getStringResourceProperty = function (v)
    {
        if (nexacro._StringResource)
        {
            if (v && v.indexOf("TEXT(") > -1)
                v = nexacro._getTextTemplateValue(v);
        }
        return v;
    };

    _pListViewCellControl._getCellText = function ()
    {
        return this._refinfo._getDisplayText(this._getDataRow());
    };

    _pListViewCellControl._getCellValue = function ()
    {
        return this._refinfo._getValue(this._getDataRow());
    };

    _pListViewCellControl._checkProcessedKey = function (keycode, alt_key, ctrl_key, shift_key, check_comp, refer_comp, meta_key)
    {
        // 들어온 keyaction을 처리할지 무시할지 판단.
        // cell이 editable 상태일때는 별도의 keyaction 처리를위해 true 반환.
        return check_comp && refer_comp && refer_comp._isEditableComponent() && refer_comp._isEnable() && check_comp._isEnable();
    };
    _pListViewCellControl._getPositionInRootComponent = null;/*function ()
	{ 
		var rect = this._setPositionInListView();
		var bandrect = { "x": 0, "y": 0, "width": 0, "height": 0, "orgl": rect.orgl, "orgt": rect.orgt };

		return [rect, bandrect];
	};
	_pListViewCellControl._setPositionInListView = function (editComp, noScrollPos, noPadding, noscroll_posinfo)
	{
		var band = this.parent;
		var view = this._view;
		

		var ctxt = view._getCtxtBaseInfo();
		var bands = ctxt ? ctxt._bands : null;
		var bandinfo;
		if (bands || bands[this._band])
		{
			bandinfo = bands[this._band];
		}
		var rect = { left: 0, top: 0, width: 0, height: 0 };

		rect.top = band._getClientTop();
		rect.height = view._getClientHeight();
		rect.left = band._getClientLeft();
		rect.width = view._getClientWidth();

		var areal = rect.left;
		var arear = rect.left + rect.width;

		var bandt = band.getOffsetTop();
		var bandb = band.getOffsetBottom();

		var border = band._getCurrentStyleBorder();
		var band_scroll_top = view._getScrollTop();
		var area_scroll_left = view._getScrollLeft();

		if (area_scroll_left <= 0)
			arear -= border ? border.left._width : 0;
		if (band_scroll_top <= 0)
			bandt += border ? border.top._width : 0;


		var crect = this._getAvailableRect();

		var l = this._adjust_left + areal;
		var t = this._adjust_top + bandt;

		if (area_scroll_left >= 0)
		{
			l -= area_scroll_left;
		}
		if (band_scroll_top >= 0)
		{
			t -= band_scroll_top;
		}




		var orgt = t;
		var orgl = l;

		var r = l + crect.width;
		var b = t + crect.height;

		if (t < bandt) t = bandt;
		if (b > bandb) b = bandb;
		if (l < areal) l = areal;
		if (r > arear) r = arear;

		var w = r - l;
		var h = b - t;

		if (w < 0) w = 0;
		if (h < 0) h = 0;

		return { left: l, top: t, right: r, bottom: b, width: w, height: h, orgt: orgt, orgl: orgl };

	};*/
    _pListViewCellControl = null;
}

if (!nexacro._ListViewBandExpandbarControl)
{
    nexacro._ListViewBandExpandbarControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        if (nexacro._has_listview_expand_status)
        {
            this._use_selected_status = false;
            this._use_pushed_status = false;
        }
        else
        {
            this._use_selected_status = true;
            this._use_pushed_status = true;
        }
    }

    var _ListViewBandExpandbarControl = nexacro._createPrototype(nexacro.Button, nexacro._ListViewBandExpandbarControl);
    nexacro._ListViewBandExpandbarControl.prototype = _ListViewBandExpandbarControl;
    _ListViewBandExpandbarControl._type_name = "ListViewBandExpandbarControl";

    _ListViewBandExpandbarControl._is_subcontrol = true;

    _ListViewBandExpandbarControl.on_getIDCSSSelector = function ()
    {
        return "expandbar";
    };

    _ListViewBandExpandbarControl.on_changeUserStatus = function (changestatus, value, applyuserstatus, currentstatus, currentuserstatus)
    {
        if (nexacro._has_listview_expand_status)
        {
            return changestatus;
        }
        else
        {
            return nexacro.Component.prototype.on_changeUserStatus.call(this, changestatus, value, applyuserstatus, currentstatus, currentuserstatus);
        }
    };

    _ListViewBandExpandbarControl = null;
}

if (!nexacro._ListViewBandControl)
{
    //==============================================================================
    // nexacro._ListViewBandControl
    //==============================================================================

    /* template comment
    // [interface:status]               : template code inteface comment
    // [interface.subinterface:status]  : sub interface comment
    // [interface/]                     : close comment
    */

    // [object.inherit:create]
    nexacro._ListViewBandControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        if (id && id.match("detail"))
            this._setControl("ListViewDetailBandControl");

        nexacro.ComplexComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    // [object.prototype:create]
    var _pListViewBandControl = nexacro._createPrototype(nexacro.ComplexComponent, nexacro._ListViewBandControl);
    nexacro._ListViewBandControl.prototype = _pListViewBandControl;

    // [component.typename:create]
    _pListViewBandControl._type_name = "ListViewBandControl";
    _pListViewBandControl._is_subcontrol = true;
    _pListViewBandControl._not_use_scrollLeft = true;

    _pListViewBandControl._use_readonly_status = true;  // Readonly 지원시 설정

    _pListViewBandControl._layoutflag = 0x0003;         // TODO : Init 에서 처리로 수정

    /* accessibility */
    _pListViewBandControl._p_accessibilityrole = "listviewband";

    //===============================================================
    // nexacro._ListViewBandControl : Init
    //===============================================================
    _pListViewBandControl._setInnerFlags = function ()
    {
        // item inner flags ( head, tail, mark, null, client )
        this._setUseItems(false, false, false, false, false);

        // part inner flags ( part, add, acc )
        this._setUseParts(false, 1, 1);

        // select inner flags
        this._setUseSelect(true);

        // scroll inner flags ( scroll, cover, track, stick, action timer )
        this._setUseScroll(false, false);
        this._setUseScrollCover(false);
        this._setUseScrollTrack(false);
        this._setUseScrollStick(false);
        this._setUseScrollTimer(300, 300, 600, 300, 0);   // no scroll no timer

        // expand inner flags
        this._setUseExpand(true, true);
        if (nexacro._has_listview_expand_status)
        {
            this._setUseExpandStatus(true);
        }
        else
        {
            this._setUseExpandStatus(false);
        }

        // bind inner flags ( databind, levelbind, xmlbind, jsonbind, fullbind, dataexpr, fullexpr )
        this._setUseBind(false, false, false, false, false);
        this._setUseExpr(false, false);
    };

    //===============================================================
    // nexacro._ListViewBandControl : Override
    //===============================================================
    _pListViewBandControl.onCreateCtxtControl = function (item, ctxt, seq)
    {
        if (item && ctxt)
        {
            if (item._setAddedCreateInfo)
                item._setAddedCreateInfo(this, ctxt, seq);

            item._setEventHandler("onclick", this.on_notify_child_onclick, this);
            item._setEventHandler("ondblclick", this.on_notify_child_ondblclick, this);
            item._setEventHandler("onsetfocus", this.on_notify_child_onfocus, this);
            item._setEventHandler("oninput", this.on_notify_child_oninput, this);
        }

        return item;
    };

    _pListViewBandControl.onUpdateItem = function (index, info)
    {
        // update info
        if (this._rowidx != index)
            this._rowidx = index;

        // update all cell
        var children = this._children;
        if (children)
        {
            for (var i = 0, l = children.length, child; i < l; i++)
            {
                child = children[i];
                if (child)
                {
                    if (child._updateAll)
                        child._updateAll();
                }
            }
        }
    };

    //===============================================================
    // nexacro._ListViewBandControl : Status
    //===============================================================
    _pListViewBandControl._onResetUserStatus = function ()
    {
        if (this._is_expandable && this._use_expand_status)
        {
            this._onResetUserExpand();
        }
    };

    _pListViewBandControl._onResetUserExpand = function ()
    {
        var expandbar = this.expandbar;
        if (expandbar)
        {
            var listview = this._view;
            if (listview && listview.getBandExpandStatus(this._itemindex))
            {
                expandbar._changeUserStatus("expand", true);

                if (this._env._p_enableaccessibility && nexacro._isArray(listview._getItem(this._itemindex)))
                {
                    expandbar._setAccessibilityStatExpanded(true);
                }
            }
            else
            {
                expandbar._changeUserStatus("collapse", true);

                if (this._env._p_enableaccessibility && nexacro._isArray(listview._getItem(this._itemindex)))
                {
                    expandbar._setAccessibilityStatExpanded(false);
                }
            }
        }
    };

    //===============================================================
    // nexacro._ListViewBandControl : Property
    //===============================================================

    // [object.property:init]
    _pListViewBandControl.onInitProperties = function ()
    {
        // init interface prop

        // init component prop
        this.expanddirtype = "horz";

        this.expandbartype = false;
        this.expandbarsize = undefined;
    };
    // [object.property:apply]
    _pListViewBandControl.onApplyProperties = function ()
    {
        // apply interface prop

        // apply component prop
        this.on_apply_expandbartype();
        this.on_apply_expandbarsize();
    };
    // [object.property:clear]
    _pListViewBandControl.onClearProperties = function ()
    {
        // clear interface property

        // clear component property
        /*
        this.on_clear_expandtype();
        this.on_clear_expandbartype();
        this.on_clear_expandbarsize();
        */
        /*
        this.on_clear_scrolltype();
        this.on_clear_scrollbartype();
        this.on_clear_scrollbarsize();
        */
    };

    _pListViewBandControl.set_expandbartype = function (v)
    {
        var _v = nexacro._toBoolean(v);

        if (_v != this.expandbartype)
        {
            // set property value
            this.expandbartype = _v;

            // apply property value
            this.on_apply_expandbartype();
        }
    };
    _pListViewBandControl.on_apply_expandbartype = function ()
    {
        if (!this._is_created)
            return;

        // [component.layout.child:recreate]
        this._recreateChild();
    };

    _pListViewBandControl.set_expandbarsize = function (v)
    {
        if (v != this.expandbarsize)
        {
            this.expandbarsize = v;

            this.on_apply_expandbarsize();
        }
    };
    _pListViewBandControl.on_apply_expandbarsize = function ()
    {
        if (!this._is_created)
            return;

        // [component.layout.child:recreate]
        this._recreateChild();
    };

    //===============================================================
    // nexacro._ListViewBandControl : Event
    //===============================================================
    _pListViewBandControl.on_notify_child_onclick = function (obj, e)
    {
        this.on_fire_onclick(e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, this, e.fromobject, e.metakey, e.clickitem);
    };

    _pListViewBandControl.on_notify_child_ondblclick = function (obj, e)
    {
        this.on_fire_ondblclick(e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, this, e.fromobject, e.metakey, e.clickitem);
    };

    _pListViewBandControl.on_notify_child_onfocus = function (obj, e)
    {
        this.on_fire_onsetfocus(e.oldcomponent, e.oldreferencecomponent, this, e.fromobject);
    };

    _pListViewBandControl.on_notify_child_oninput = function (obj, e)
    {
        this.on_fire_oninput(e);
    };

    _pListViewBandControl.on_fire_oninput = function (evt)
    {
        if (this.oninput && this.oninput._has_handlers)
        {
            return this.oninput._fireEvent(this, evt);
        }
        return false;
    };

    _pListViewBandControl.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, clickitem)
    {
        if (this.onclick && this.onclick._has_handlers)
        {
            var canvas = this._getRecalcCanvasXY(from_refer_comp._control_element, canvasX, canvasY);
            canvasX = canvas[0];
            canvasY = canvas[1];

            var clientXY = this._getClientXY(canvasX, canvasY);
            clientX = clientXY[0];
            clientY = clientXY[1];

            var evt = new nexacro.ClickEventInfo(this, "onclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
            evt.clickitem = clickitem;

            return this.onclick._fireEvent(this, evt);
        }
        return false;
    };

    _pListViewBandControl.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, clickitem)
    {
        if (this.ondblclick && this.ondblclick._has_handlers)
        {
            var canvas = this._getRecalcCanvasXY(from_refer_comp._control_element, canvasX, canvasY);
            canvasX = canvas[0];
            canvasY = canvas[1];

            var clientXY = this._getClientXY(canvasX, canvasY);
            clientX = clientXY[0];
            clientY = clientXY[1];

            var evt = new nexacro.ClickEventInfo(this, "ondblclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
            evt.clickitem = clickitem;

            return this.ondblclick._fireEvent(this, evt);
        }
        return false;
    };

    _pListViewBandControl._on_last_lbuttonup = function ()
    {
        this.parent._on_last_lbuttonup();
    };

    _pListViewBandControl._on_last_keyup = function ()
    {
        this.parent._on_last_keyup();
    };

    //===============================================================
    // nexacro._ListViewBandControl : Interface Logic Override
    //===============================================================
    _pListViewBandControl.on_apply_prop_enable = function (v)
    {
        var child = this._children;
        if (!child)
            return;

        var count = child.length;
        if (count)
        {
            for (var i = 0; i < count; i++)
            {
                child[i]._setEnable(v);
            }
        }
    };

    _pListViewBandControl._onGetDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        return { want_tab: true, want_return: true, want_escape: true, want_chars: true, want_arrows: true };
    };

    _pListViewBandControl._onGetExpandCtrlSet = function ()
    {
        return "custom";
    }

    _pListViewBandControl._createExpandBarCustom = function (ctrlname, left, top, width, height)
    {
        if (this.expandbar && this.expandbar._type_name != "ListViewBandExpandbarControl")
        {
            this._destroyExpandBar();
        }

        if (this.expandbar == null)
        {
            return new nexacro._ListViewBandExpandbarControl(ctrlname, left, top, width, height, null, null, null, null, null, null, this);
        }
        else
        {
            return this.expandbar;
        }
    };

    _pListViewBandControl.on_getIDCSSSelector = function ()
    {
        return this._band;
    };

    _pListViewBandControl._getItemTypeName = function ()
    {
        if (this._band == "body")
        {
            return "ListViewBandControl";
        }
        else if (this._band == "detail")
        {
            return "ListViewDetailBandControl";
        }
    };

    //===============================================================
    // nexacro._ListViewBandControl : Inner Logic
    //===============================================================
    _pListViewBandControl._setAddedCreateInfo = function (comp, ctxt, seq)
    {
        // init band
        this._refinfo = ctxt._bandinfo;
        this._view = comp;
        this._band = ctxt.id;
        this._rowidx = seq;
    };

    _pListViewBandControl._setChildEventHandler = function (eventid, handlerfunc, handlertarget)
    {
        // init band
        var children = this._children;

        if (children)
        {
            for (var i = 0, l = children.length; i < l; i++)
            {
                var child = children[i];

                if (child)
                    child._setEventHandler(eventid, handlerfunc, handlertarget);
            }
        }
    };

    _pListViewBandControl._onCheckSelectable = function ()
    {
        var view = this._view;
        if (view)
        {
            return view._onCheckSelectable();
        }
    };

    _pListViewBandControl = null;
}

if (!nexacro.ListView)
{
    //==============================================================================
    // nexacro.ListViewBandStatusEventInfo
    //==============================================================================
    nexacro.ListViewBandStatusEventInfo = function (obj, id, from_comp, from_refer_comp, row, bandstatus)
    {
        this.id = this.eventid = id || "onbandstatuschanged";
        this.fromobject = obj;
        this.fromreferenceobject = from_refer_comp;

        this.row = row;
        this.bandstatus = bandstatus;
    };

    var _pListViewBandStatusEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ListViewBandStatusEventInfo);
    nexacro.ListViewBandStatusEventInfo.prototype = _pListViewBandStatusEventInfo;
    _pListViewBandStatusEventInfo._type_name = "ListViewBandStatusEventInfo";

    //==============================================================================
    // nexacro.ListViewClickEventInfo
    //==============================================================================
    nexacro.ListViewClickEventInfo = function (obj, id, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, bandid, cellid, row, clickitem, meta_key)
    {
        nexacro.ClickEventInfo.call(this, obj, id, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

        this.fromobject = obj;
        this.fromreferenceobject = from_refer_comp;

        this.bandid = bandid;
        this.cellid = cellid;
        this.clickitem = clickitem;
        this.row = row;
    };

    var _pListViewClickEventInfo = nexacro._createPrototype(nexacro.ClickEventInfo, nexacro.ListViewClickEventInfo);
    nexacro.ListViewClickEventInfo.prototype = _pListViewClickEventInfo;
    _pListViewClickEventInfo._type_name = "ListViewClickEventInfo";

    //==============================================================================
    // nexacro.ListViewDragEventInfo
    //==============================================================================
    nexacro.ListViewDragEventInfo = function (obj, id, dragdata, userdata, datatype, filelist, src_comp, src_refer_comp, from_comp, from_refer_comp, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, bandid, cellid, row, meta_key)
    {
        nexacro.DragEventInfo.call(this, obj, id, dragdata, userdata, datatype, filelist, src_comp, src_refer_comp, null, null, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, meta_key);

        this.fromobject = obj;
        this.fromreferenceobject = from_refer_comp;

        this.bandid = bandid;
        this.cellid = cellid;
        this.row = row;
    };

    var _pListViewDragEventInfo = nexacro._createPrototype(nexacro.DragEventInfo, nexacro.ListViewDragEventInfo);
    nexacro.ListViewDragEventInfo.prototype = _pListViewDragEventInfo;
    _pListViewDragEventInfo._type_name = "ListViewDragEventInfo";

    //==============================================================================
    // nexacro.ListViewMouseEventInfo
    //==============================================================================
    nexacro.ListViewMouseEventInfo = function (obj, id, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, bandid, cellid, row, meta_key)
    {
        nexacro.MouseEventInfo.call(this, obj, id, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

        this.fromobject = obj;
        this.fromreferenceobject = from_refer_comp;

        this.bandid = bandid;
        this.cellid = cellid;
        this.row = row;
    };

    var _pListViewMouseEventInfo = nexacro._createPrototype(nexacro.MouseEventInfo, nexacro.ListViewMouseEventInfo);
    nexacro.ListViewMouseEventInfo.prototype = _pListViewMouseEventInfo;
    _pListViewMouseEventInfo._type_name = "ListViewMouseEventInfo";

    //==============================================================================
    // nexacro.ListViewContextMenuEventInfo
    //==============================================================================
    nexacro.ListViewContextMenuEventInfo = function (obj, id, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, bandid, cellid, row, meta_key)
    {
        nexacro.ContextMenuEventInfo.call(this, obj, id, from_comp, from_refer_comp, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, meta_key);

        this.fromobject = obj;
        this.fromreferenceobject = from_refer_comp;

        this.bandid = bandid;
        this.cellid = cellid;
        this.row = row;
    };

    var _pListViewContextMenuEventInfo = nexacro._createPrototype(nexacro.MouseEventInfo, nexacro.ListViewContextMenuEventInfo);
    nexacro.ListViewContextMenuEventInfo.prototype = _pListViewContextMenuEventInfo;
    _pListViewContextMenuEventInfo._type_name = "ListViewContextMenuEventInfo";


    //==============================================================================
    // nexacro.ListViewSelectEventInfo
    //==============================================================================
    nexacro.ListViewSelectEventInfo = function (obj, id, oldrow, oldbandid, oldcellid, row, bandid, cellid, selectstartrow, selectendrow)
    {
        this.id = this.eventid = id || "onselectchanged";
        this.fromobject = obj;
        this.fromreferenceobject = obj;

        this.oldrow = oldrow;
        this.oldbandid = oldbandid;
        this.oldcellid = oldcellid;

        this.row = row;
        this.bandid = bandid;
        this.cellid = cellid;

        this.selectstartrow = selectstartrow;
        this.selectendrow = selectendrow;
    };

    var _pListViewSelectEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ListViewSelectEventInfo);
    nexacro.ListViewSelectEventInfo.prototype = _pListViewSelectEventInfo;
    _pListViewSelectEventInfo._type_name = "ListViewSelectEventInfo";

    //==============================================================================
    // nexacro.ListViewEditEventInfo
    //==============================================================================
    nexacro.ListViewEditEventInfo = function (obj, id, row, bandid, cellid, value, from_refer_comp)
    {
        this.id = this.eventid = id || "onlistviewedit";
        this.fromobject = obj;
        this.fromreferenceobject = from_refer_comp;

        this.row = row;
        this.bandid = bandid;
        this.cellid = cellid;
        this.value = value; // edit value
    };

    var _pListViewEditEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ListViewEditEventInfo);
    nexacro.ListViewEditEventInfo.prototype = _pListViewEditEventInfo;
    _pListViewEditEventInfo._type_name = "ListViewEditEventInfo";

    nexacro.ListViewKeyEventInfo = function (obj, id, row, bandid, cellid, alt_key, ctrl_key, shift_key, key_code, from_refer_comp)
    {
        this.id = this.eventid = id || "onlistviewkeyevent";
        this.fromobject = obj;
        this.fromreferenceobject = from_refer_comp;
        this.row = row;
        this.bandid = bandid;
        this.cellid = cellid;

        this.altkey = alt_key;
        this.ctrlkey = ctrl_key;
        this.shiftkey = shift_key;
        this.keycode = key_code;
    };
    var _pListViewKeyEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ListViewKeyEventInfo);
    nexacro.ListViewKeyEventInfo.prototype = _pListViewKeyEventInfo;
    _pListViewKeyEventInfo._type_name = "ListViewKeyEventInfo";

    //==============================================================================
    // nexacro.ListViewInputEventInfo
    //==============================================================================
    nexacro.ListViewInputEventInfo = function (obj, bandid, cellid, row, id)
    {
        this.id = this.eventid = id || "oninput";
        this.fromobject = this.fromreferenceobject = obj;
        this.row = row;
        this.bandid = bandid;
        this.cellid = cellid;
    };
    var _pListViewInputEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ListViewInputEventInfo);
    nexacro.ListViewInputEventInfo.prototype = _pListViewInputEventInfo;
    _pListViewInputEventInfo._type_name = "ListViewInputEventInfo";

    _pListViewBandStatusEventInfo = null;
    _pListViewClickEventInfo = null;
    _pListViewDragEventInfo = null;
    _pListViewMouseEventInfo = null;
    _pListViewSelectEventInfo = null;
    _pListViewEditEventInfo = null;
    _pListViewKeyEventInfo = null;
    _pListViewInputEventInfo = null;

    //==============================================================================
    // nexacro.ListView
    //==============================================================================

    /* template comment
    // [interface:status]               : template code inteface comment
    // [interface.subinterface:status]  : sub interface comment
    // [interface/]                     : close comment
    */

    // [object.inherit:create]
    nexacro.ListView = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.ComplexComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._is_use_bind_expr_prop = { body: null, head: null, tail: null };
        this._is_use_bind_expr_style = { body: null, head: null, tail: null };
    };

    // [object.prototype:create]
    var _pListView = nexacro._createPrototype(nexacro.ComplexComponent, nexacro.ListView);
    nexacro.ListView.prototype = _pListView;

    _pListView._properties = [
        { name: "formats" },
        { name: "formatid" },
        { name: "binddataset" },
        { name: "showcover" },
        { name: "showtrack" },
        { name: "tracktype" },
        { name: "trackalign" },
        { name: "multiselect" },
        { name: "rangeselect" },
        { name: "enableredraw" },
        { name: "autoenter" },
        { name: "autoupdatetype" },
        { name: "bandexpandtype" },
        { name: "bandinitstatus" },
        { name: "bandindentsize" },
        { name: "cellclickbound" },
        { name: "nodatatext" },
        { name: "nodataimage" },
        { name: "selectchangetype" },
        { name: "selectscrollmode" },
        { name: "selecttype" },
        { name: "useselcolor" },
        { name: "usesoftkeyboard" },
        { name: "cellcheckboxsize" },
        { name: "cellcalendarbuttonsize" },
        { name: "cellcombobuttonsize" },
        { name: "cellmulticombobuttonsize" },
        { name: "locale" },
        { name: "cellcalendarpopuptype" },
        { name: "cellcombopopuptype" },
        { name: "cellmulticombopopuptype" },
        { name: "cellcalendarpopupsize" },
        { name: "cellcombopopupsize" },
        { name: "cellmulticombopopupsize" },
        { name: "showhead" },
        { name: "rowfirst" },
        { name: "arrange" },
        { name: "selector" },
        { name: "readonly" },
        { name: "createrowstype" }
    ];

    // [component.typename:create]
    _pListView._type_name = "ListView";

    // [component.composite.layout.items:useset]
    _pListView._is_child = false;
    _pListView._is_items = true;

    // [component.composite.nclayout:useset]
    _pListView._is_nc_layout = false;
    _pListView._is_nc_head = false;
    _pListView._is_nc_foot = false;
    _pListView._is_nc_lead = false;
    _pListView._is_nc_tail = false;

    _pListView._is_after_recreate = false;
    _pListView._after_recreate = false;

    _pListView._use_readonly_status = true;
    _pListView._is_locale_control = true;
    _pListView._selectscrollmode = (nexacro._isTouchInteraction) ? "scroll" : "select";

    /* properties */
    _pListView._p_createrowstype = "auto";

    /* accessibility */
    _pListView._p_accessibilityrole = "listview";
    _pListView._is_listview_focus = false;
    _pListView._is_expandbar_focus = false;
    _pListView._is_first_focus = false;
    _pListView._is_first_focus_band = false;

    //===============================================================
    // nexacro.ListView : Init
    //===============================================================
    _pListView._setInnerFlags = function ()
    {
        // item inner flags ( head, tail, mark, null, client )
        this._setUseItems(true, false, true, true, false);

        // part inner flags ( part, add, acc )
        this._setUseParts(true, 1, 1);

        // select inner flags
        this._setUseSelect(true);

        // scroll inner flags ( scroll, cover, track, stick, action timer )
        this._setUseScroll(true, true);
        this._setUseScrollCover(false);
        this._setUseScrollTrack(false);
        this._setUseScrollStick(true);
        this._setUseScrollTimer(300, 300, 600, 300, 0);

        // expand inner flags
        this._setUseExpand(false, false);
        this._setUseExpandStatus(false);

        // bind inner flags ( databind, levelbind, xmlbind, jsonbind, fullbind, dataexpr, fullexpr )
        this._setUseBind(true, false, false, false, true);
        this._setUseExpr(true, true);
    };

    _pListView._default_scrolleventthrottle = "aniframe";                   // scroll event aniframe 사용시 추가
    _pListView._default_scrolltracktype = ["trackmoved"];               // scroll track 사용시 추가
    _pListView._default_scrolltrackalign = ["tail tracktop"];            // scroll track 사용시 추가

    //===============================================================
    // nexacro.ListView : Create/Destroy
    //===============================================================
    _pListView.onCreatedContents = function (_window)
    {
        // created contents before
        this._update_position();

        // created contents
        this._createdFormats();
        this._createdItems(_window);

        this._setEventHandler("onlbuttondown", this._on_listview_onlbuttondown, this);
        this._setEventHandler("onlbuttonup", this._on_listview_onlbuttonup, this);

        this._analyzeKeyMatrix();
    };

    _pListView.onAttachContentsHandle = function (win)
    {
        // attach contents before

        // attach contents
        this.onAttachHandleItems(win);

        // attach contents after
        this._resetNCChild();

        this._setEventHandler("onlbuttondown", this._on_listview_onlbuttondown, this);
        this._setEventHandler("onlbuttonup", this._on_listview_onlbuttonup, this);

        this._analyzeKeyMatrix();
    };

    _pListView._recreateContents = function ()
    {
        // clear
        this._clearContents();

        // init
        this._initPanelLayout();
        this._initContents();

        // recreate contents ( band items )
        this._createdItems(this._getWindow());

        // recalc
        this._recalcLayout(true);

        var lastfocus = this._find_lastFocused();
        if (lastfocus == this)
        {
            this._control_element.setElementFocus();
        }
    };

    _pListView._recreateItems = function (rowposition)
    {
        if (this._is_created)
        {
            this._recreateContents();

            this._resetScrollInfo(rowposition);
            this._resetSelectInfo(rowposition);
        }
    };

    _pListView._resetScrollInfo = function (rowposition)
    {
        var currrow;
        var slot_top = 0;

        if (this.rowcount > 0)
        {
            if ((rowposition !== null || rowposition !== undefined) && rowposition > -1)
            {
                currrow = rowposition;
            }
            else
            {
                currrow = this.getSelect().row;
            }

            var panel_slot = this._getPanelSlot(currrow);
            if (panel_slot)
            {
                slot_top = panel_slot._getSlotCalcTop();
            }
        }

        this._updateItemVScrollInfo(slot_top, "trackinit", true);
    };

    _pListView._resetSelectInfo = function (rowposition)
    {
        var currsel = this.getSelect();

        this._onClearCurrentSelect();

        if (this.rowcount > 0)
        {
            if ((rowposition !== null || rowposition !== undefined) && rowposition > -1)
            {
                this._onSetCurrentSelect(this._onGetSelectArgument(rowposition, currsel.band, currsel.cell));
            }
            else
            {
                this._onSetCurrentSelect(this._onGetSelectArgument(currsel.row, currsel.band, currsel.cell));
            }
        }
    };

    _pListView._onSetContents = function (strContents)
    {
        this.set_formats(strContents);

        if (this._is_created_contents && !this._is_created)
        {
            this._clearContents();

            this._initPanelLayout();
            this._initContents();
        }
    };

    _pListView._onChangeContainerRect = function (width, height)
    {
        if (this._is_created)
        {
            if (this._getItemChildById(0, "nullband", "nullctrl"))
            {
                var nullband = this._getItem(0);
                if (nullband && nullband._control_element)
                    nullband._control_element.setElementSize(width, height);
            }
        }

        nexacro.ComplexComponent.prototype._onChangeContainerRect.call(this, width, height);

        if (this._is_created)
            this._analyzeKeyMatrix();
    };

    //===============================================================
    // nexacro.ListView : NCChild
    //===============================================================

    // [component.layout.ncchild:create]
    _pListView.onCreateNCHeadControl = function (child)
    {
        // user item create logic
        /*
        this.createNCHeadControl(new nexacro._ListViewHead("nchead", 0, 0, 0, 0, null, null, null, null, null, null, this));
        */
    };

    //===============================================================
    // nexacro.ListView : Child
    //===============================================================

    // [component.layout.child:create]
    _pListView.onCreateChild = function ()
    {
        // child create
        /*
        if (this.childcontrol = this.createChildControl(new nexacro._ListViewHead("head", 0, 0, 0, 0, null, null, null, null, null, null, this)))
        {
            // attach event
            this.childcontrol._setEventHandler("onclick", this.on_notify_child_onclick, this);
        }
        */
    };

    //===============================================================
    // nexacro.ListView : Overflow
    //===============================================================
    _pListView._initOverflow = function ()
    {
        if (this._is_scrollable)
        {
            //this._use_native_scroll = false;
            this._use_translate_scroll = true;
            // TODO : IE 그리드에서 성능이슈로 translate를 사용하지 않게 변함.
            //        리스트뷰는 현 방식을 유지하며, 이슈발생시 대응작업 필요함.
            this._use_translate_scroll_force = true;
            this._use_translate_move = true;
            this._use_container_move = true;
            this._use_container_multi = true;
        }
    };

    //===============================================================
    // nexacro.ListView : Items
    //===============================================================
    _pListView.onCreateItemBegin = function (ctxtdata, binddata, nc)
    {
        if (!this._p_showhead && !this._is_subcontrol)
            return;

        // user before item create logic
        if (this._is_format_layout && ctxtdata)
        {
            // create head control && attach context
            this.headcontrol = this.createItemCtxtControl(ctxtdata, -1, nc);

            return this.headcontrol;
        }
    };

    _pListView.onCreateItem = function (ctxtdata, binddata, index, nc)
    {
        // default item create logic by ctxt
        if (this._is_format_layout && ctxtdata)
        {
            // create band control && attach context
            var item = this.createItemCtxtControl(ctxtdata, index, nc);

            return item;
        }
    };

    _pListView.onCreateItemFinal = function (ctxtdata, binddata, nc)
    {
        // user after item create logic
    };

    _pListView.onDestroyItems = function ()
    {
        // unlink items
        this.headcontrol = null;
    };

    _pListView._moveItem = function (prevslot, nextslot)
    {
        //==================================================================================
        // Item move ( Not Slot move )

        // TODO : ListView 전용 interface. ComplexComponent에 요구사항이 있을시 도입 검토.
        //==================================================================================
        var items = this._getItems();
        var count = items.length;

        if (items && count)
        {
            var headcount = this._head_count && this._use_headitem ? this._head_count : 0;
            var bodycount = this._body_count ? this._body_count : 1;

            var previdx = prevslot * bodycount + headcount;
            var nextidx = nextslot * bodycount + headcount;

            var bandseq;

            if (this._use_partitem)
            {
                if (this._body_count > 1)
                {
                    for (var i = 0, l = bodycount; i < l; i++, previdx++, nextidx++)
                    {
                        items[nextidx] = items[previdx];
                        bandseq = this._formats._getBandSeq(items[nextidx].id);

                        this._onSetItemIndex(items[nextidx], nextslot);
                        this._updateItem(items[nextidx], nextslot, undefined, bandseq);

                        items[previdx] = null;
                    }
                }
                else
                {
                    items[nextidx] = items[previdx];
                    bandseq = this._formats._getBandSeq(items[nextidx].id);

                    this._onSetItemIndex(items[nextidx], nextslot);
                    this._updateItem(items[nextidx], nextslot, undefined, bandseq);

                    items[previdx] = null;
                }

                return true;
            }
            else
            {
                // 분할생성이 아니면 move 할일이 없음.
            }
        }

        return false;
    };

    _pListView._onSetItemIndentSize = function (item, indentsize)
    {
        var itemid = this._onGetItemId(item);
        if (itemid == "body")
        {
            item._itemindentsize = [0, 0, 0, 0, 0, 0];
        }
        else
        {
            switch (this._subgroup)
            {
                case nexacro._PanelConst.GROUPING_SUBSTYLE_NONE:
                case nexacro._PanelConst.GROUPING_SUBSTYLE_BAND_EXPAND:
                case nexacro._PanelConst.GROUPING_SUBSTYLE_BAND_COLLAPSE:
                case nexacro._PanelConst.GROUPING_SUBSTYLE_BAND_ACCORDION:
                    item._itemindentsize = [indentsize, 0, -indentsize, 0, 0, 0];
                    break;
                case nexacro._PanelConst.GROUPING_SUBSTYLE_BAND_POPUP:
                    item._itemindentsize = [indentsize, 0, 0, 0, 0, 0];
                    break;
            }
        }
    };

    _pListView._onGetIndentSize = function ()
    {
        return this._p_bandindentsize ? this._p_bandindentsize : 0;
    };

    _pListView._actionSelectItem = function (itemidx, subidx, cellidx, trigger)
    {
        // Case : action trigger & selectchangetype 
        if (!nexacro._isNumber(itemidx) || itemidx < -2 || itemidx > this.rowcount)
            return;

        switch (trigger)
        {
            case "bandfocus":
            case "cellfocus":
                if (this._p_selectchangetype == "down")
                {
                    this.setSelect(itemidx, subidx, cellidx);
                }
                break;
            case "bandclick":
            case "cellclick":
                if (this._p_selectchangetype == "up")
                {
                    this.setSelect(itemidx, subidx, cellidx);
                }
                break;
            case "tabfocus":
                this.setSelect(itemidx, subidx, cellidx);

                this._focusItem(itemidx);
                this._focusItemChild(itemidx, subidx, cellidx);
                break;
        }
    };

    _pListView._getPanelSlotCount = function (rowidx)
    {
        rowidx = (rowidx != undefined) ? rowidx : this.getSelect().row;

        if (rowidx >= 0 && this._panel && this._panel._panel_slots.length > 0)
        {
            if (nexacro._isArray(this._panel._panel_slots[rowidx]._slot_target))
                return this._panel._panel_slots[rowidx]._slot_target.length;
            else
                return 1;
        }
        return 0;
    };

    _pListView._isExistSubSlot = function (rowidx)
    {
        rowidx = (rowidx != undefined) ? rowidx : this.getSelect().row;

        if (rowidx >= 0)
        {
            if (this._panel && this._panel._panel_slots.length > 0)
            {
                if (nexacro._isArray(this._panel._panel_slots[rowidx]._slot_target))
                {
                    var multi = this._panel._panel_slots[rowidx]._slot_multi;
                    if (multi == 0 || multi == 1)
                        return true;
                }
            }
        }
        return false;
    };

    _pListView._moveToCellRight = function (add)
    {
        var cell = this._getCurrentCell();
        if (cell)
        {
            var nextcell = cell._refinfo._key_direction.right;

            if (nextcell >= 0)
            {
                cell = this._getCurrentCell(null, null, nextcell);
                cell._setFocus(false);
            }
            else
            {
                var currselect = this.getSelect();
                var currow = currselect.row;
                var curband = currselect.band;

                if (currow >= 0)
                {
                    var rowidx, bandidx = curband;

                    rowidx = this._findNextSelectIndex(nexacro.Event.KEY_RIGHT);

                    if (currow == rowidx)
                        return;

                    if (curband > 0)
                    {
                        // detail expand check?
                    }

                    var band = this._getCurrentBand(rowidx, bandidx);
                    if (band)
                    {
                        nextcell = this._getKeyActionOtherbandCell(cell, band, "r");
                        cell = this._getCurrentCell(rowidx, bandidx, nextcell);
                        cell._setFocus(false);

                        if (add)
                            this.addSelect(rowidx);
                    }
                }
            }
        }
    };

    _pListView._moveToCellLeft = function (add)
    {
        var cell = this._getCurrentCell();
        if (cell)
        {
            var nextcell = cell._refinfo._key_direction.left;

            if (nextcell >= 0)
            {
                cell = this._getCurrentCell(null, null, nextcell);
                cell._setFocus(false);
            }
            else
            {
                var currselect = this.getSelect();
                var currow = currselect.row;
                var curband = currselect.band;

                if (currow >= 0)
                {
                    var rowidx, bandidx = curband;

                    rowidx = this._findNextSelectIndex(nexacro.Event.KEY_LEFT);

                    if (currow == rowidx)
                        return;

                    if (curband > 0)
                    {
                        // detail expand check?
                    }

                    var band = this._getCurrentBand(rowidx, bandidx);
                    if (band)
                    {
                        nextcell = this._getKeyActionOtherbandCell(cell, band, "l");
                        cell = this._getCurrentCell(rowidx, bandidx, nextcell);
                        cell._setFocus(false);

                        if (add)
                            this.addSelect(rowidx);
                    }
                }
            }
        }
    };

    _pListView._moveToCellUp = function (add)
    {
        var cell = this._getCurrentCell();
        if (cell)
        {
            var nextcell = cell._refinfo._key_direction.up;

            if (nextcell >= 0)
            {
                cell = this._getCurrentCell(null, null, nextcell);
                cell._setFocus(false);
            }
            else
            {
                var currselect = this.getSelect();
                var currow = currselect.row;
                var curband = currselect.band;

                if (currow >= 0)
                {
                    var rowidx, bandidx;

                    if (curband > 0)
                    {
                        rowidx = currow;
                        bandidx = curband - 1;
                    }
                    else
                    {
                        rowidx = this._findNextSelectIndex(nexacro.Event.KEY_UP);

                        if (currow == rowidx)
                            return;

                        // detail expand check
                        if (this._isExistSubSlot(rowidx))
                            bandidx = this._getPanelSlotCount() - 1;
                    }

                    var band = this._getCurrentBand(rowidx, bandidx);
                    if (band)
                    {
                        nextcell = this._getKeyActionOtherbandCell(cell, band, "t");
                        cell = this._getCurrentCell(rowidx, bandidx, nextcell);
                        cell._setFocus(false);

                        if (add)
                            this.addSelect(rowidx);
                    }
                }
            }
        }
    };

    _pListView._moveToCellDown = function (add)
    {
        var cell = this._getCurrentCell();
        if (cell)
        {
            var nextcell = cell._refinfo._key_direction.down;

            if (nextcell >= 0)
            {
                cell = this._getCurrentCell(null, null, nextcell);
                cell._setFocus(false);
            }
            else
            {
                var currselect = this.getSelect();
                var currow = currselect.row;
                var curband = currselect.band;

                if (currow >= 0)
                {
                    var rowidx, bandidx;

                    // detail expand check
                    if (curband < this._getPanelSlotCount() - 1 && this._isExistSubSlot(currow))    // detail
                    {
                        rowidx = currow;
                        bandidx = curband + 1;
                    }
                    else
                    {
                        rowidx = this._findNextSelectIndex(nexacro.Event.KEY_DOWN);

                        if (currow == rowidx)
                            return;

                        bandidx = 0;
                    }

                    var band = this._getCurrentBand(rowidx, bandidx);
                    if (band)
                    {
                        nextcell = this._getKeyActionOtherbandCell(cell, band, "b");
                        cell = this._getCurrentCell(rowidx, bandidx, nextcell);
                        cell._setFocus(false);

                        if (add)
                            this.addSelect(rowidx);
                    }
                }
            }
        }
    };

    _pListView._moveToCellPagedown = function ()
    {
        var rowidx = this._findNextSelectIndex(nexacro.Event.KEY_PAGE_DOWN);
        var cell = this._getCurrentCell(rowidx);

        if (cell)
        {
            cell._setFocus(false);
        }
    };

    _pListView._moveToCellPageup = function ()
    {
        var rowidx = this._findNextSelectIndex(nexacro.Event.KEY_PAGE_UP);
        var cell = this._getCurrentCell(rowidx);

        if (cell)
        {
            cell._setFocus(false);
        }
    };

    _pListView._moveToCellTab = function (prev)
    {
        var band = this._getCurrentBand();
        var cell = null;

        if (band)
        {
            var currselect = this.getSelect();
            var currow = currselect.row;
            var curband = currselect.band;
            var curcell = currselect.cell;
            var i;

            if (!prev)  // next
            {
                cell = this._findEditableCell(band, curcell + 1, 1);

                if (!cell)
                {
                    var rowcnt = this._getBindCount();
                    for (i = currow; i < rowcnt; i++)
                    {
                        if (curband < this._getPanelSlotCount() - 1 && this._isExistSubSlot(currow))    // detail expand check
                        {
                            curband++;
                        }
                        else
                        {
                            currow++;
                            curband = 0;
                        }

                        if (band = this._getCurrentBand(currow, curband))
                        {
                            curcell = 0;
                            cell = this._findEditableCell(band, curcell, 1);
                        }

                        if (cell) break;
                    }

                    this._is_first_focus_band = true;
                }
            }
            else // prev
            {
                cell = this._findEditableCell(band, curcell - 1, -1);

                if (!cell)
                {
                    for (i = currow; i >= 0; i--)
                    {
                        if (curband > 0)
                        {
                            curband--;
                        }
                        else
                        {
                            currow--;

                            // detail expand check
                            if (this._isExistSubSlot(currow))
                                curband = this._getPanelSlotCount() - 1;
                            else
                                curband = 0;
                        }

                        if (band = this._getCurrentBand(currow, curband))
                        {
                            var cells = this._getBandCells(band);
                            curcell = cells ? cells.length - 1 : 0;
                            cell = this._findEditableCell(band, curcell, -1);
                        }

                        if (cell) break;
                    }

                    this._is_first_focus_band = true;
                }
            }

            if (cell && this._acceptstab)
            {
                cell._setFocus(false);
            }
        }
    };

    _pListView._moveToCellNext = function ()
    {
        var band = this._getCurrentBand();
        if (band)
        {
            var cells = this._getBandCells(band);

            var currselect = this.getSelect();
            var rowidx = currselect.row;
            var bandidx = currselect.band;
            var cellidx = currselect.cell;

            var nextcell = null;
            var expandbar = null;

            if (rowidx >= 0)
            {
                if (this._is_listview_focus)
                {
                    nextcell = this._getCurrentCell(0, 0, 0);
                    this._is_first_focus_band = true;
                }
                else
                {
                    nextcell = this._is_expandbar_focus ? null : cells[cellidx + 1];

                    if (!nextcell)
                    {
                        if (this._env._p_enableaccessibility && band.expandbartype == true && band._band == "body" && !this._is_expandbar_focus)
                        {
                            expandbar = band.expandbar;
                        }
                        else
                        {
                            if (bandidx < this._getPanelSlotCount() - 1 && this._isExistSubSlot(rowidx)) // detail expand check
                            {
                                bandidx++;
                                this._is_first_focus_band = true;
                            }
                            else
                            {
                                rowidx++;
                                bandidx = 0;
                                this._is_first_focus_band = true;
                            }

                            if (band = this._getCurrentBand(rowidx, bandidx))
                            {
                                cells = this._getBandCells(band);
                                nextcell = cells && cells[0];
                            }
                        }
                    }
                    else
                    {
                        if (this._is_listview_focus)
                            this._is_first_focus_band = true;
                    }
                }
            }

            if (nextcell)
            {
                nextcell._setFocus(false);
                this._is_expandbar_focus = false;
            }
            else if (expandbar)
            {
                var win = this._getWindow();
                win._removeFromCurrentFocusPath(band, true);
                expandbar._setFocus(false);
                this._is_expandbar_focus = true;
            }
        }
    };

    _pListView._moveToCellPrev = function ()
    {
        var band = this._getCurrentBand();
        if (band)
        {
            var cells = this._getBandCells(band);

            var currselect = this.getSelect();
            var rowidx = currselect.row;
            var bandidx = currselect.band;
            var cellidx = currselect.cell;

            var prevcell = null;
            var expandbar = null;

            if (rowidx >= 0)
            {
                prevcell = this._is_expandbar_focus ? cells[cells.length - 1] : cells[cellidx - 1];

                if (!prevcell)
                {
                    if (bandidx > 0)
                    {
                        bandidx--;
                        this._is_first_focus_band = true;
                    }
                    else
                    {
                        rowidx--;

                        if (this._isExistSubSlot(rowidx)) // detail expand check
                        {
                            bandidx = this._getPanelSlotCount() - 1;
                        }
                        else
                        {
                            bandidx = 0;
                        }

                        this._is_first_focus_band = true;
                    }

                    if (band = this._getCurrentBand(rowidx, bandidx))
                    {
                        if (this._env._p_enableaccessibility && band.expandbartype == true && band._band == "body")
                        {
                            expandbar = band.expandbar;
                        }
                        else
                        {
                            cells = this._getBandCells(band);
                            cellidx = cells ? cells.length - 1 : 0;
                            prevcell = cells && cells[cellidx];
                        }
                    }
                }

            }

            if (prevcell)
            {
                prevcell._setFocus(false);
                this._is_expandbar_focus = false;
            }
            else if (expandbar)
            {
                expandbar._setFocus(false);
                this._is_expandbar_focus = true;
            }
        }
    };

    _pListView._moveToBandlNext = function ()
    {
        var currselect = this.getSelect();
        var rowidx = currselect.row;
        var bandidx = currselect.band;

        if (bandidx < this._getPanelSlotCount() - 1 && this._isExistSubSlot(rowidx)) // detail expand check
        {
            bandidx++;
        }
        else
        {
            rowidx++;
            bandidx = 0;
        }

        var band = this._getCurrentBand(rowidx, bandidx);
        if (band)
        {
            band._setFocus();
        }
    };

    _pListView._moveToBandlPrev = function ()
    {
        var currselect = this.getSelect();
        var rowidx = currselect.row;
        var bandidx = currselect.band;

        if (bandidx > 0)
        {
            bandidx--;
        }
        else
        {
            rowidx--;

            if (this._isExistSubSlot(rowidx)) // detail expand check
            {
                bandidx = this._getPanelSlotCount() - 1;
            }
            else
            {
                bandidx = 0;
            }
        }

        var band = this._getCurrentBand(rowidx, bandidx);
        if (band)
        {
            band._setFocus();
        }
    };

    _pListView._selectItemKeyInfo = function (keycode, alt_key, ctrl_key, shift_key)
    {
        switch (keycode)
        {
            case nexacro.Event.KEY_DOWN:
            case nexacro.Event.KEY_UP:
            case nexacro.Event.KEY_PAGE_UP:
            case nexacro.Event.KEY_PAGE_DOWN:
                if (!this._env._p_enableaccessibility || (this._env._p_enableaccessibility && this._isComponentKeydownAction()))
                {
                    var select = this._findNextSelectIndex(keycode, alt_key, ctrl_key, shift_key);

                    if (select == null || select < 0)
                        return false;

                    if (this._env._p_enableaccessibility)
                    {
                        var win = this._getWindow();
                        var band = this._getCurrentBand();
                        if (keycode == nexacro.Event.KEY_DOWN)
                        {
                            if (this._is_listview_focus)
                            {
                                select = 0;
                            }

                            if (select == band._rowidx)
                            {
                                if (!this._is_listview_focus)
                                {
                                    if (this._accept_arrow)
                                    {
                                        win._removeFromCurrentFocusPath(this, true);
                                        this._setFocus(false);
                                        this._is_listview_focus = true;
                                    }
                                    return false;
                                }
                            }
                        }
                        else if (keycode == nexacro.Event.KEY_UP)
                        {
                            if (this._is_listview_focus)
                            {
                                if (this._accept_arrow)
                                {
                                    var rowcnt = this._getBindCount();
                                    select = rowcnt - 1;
                                }
                                else
                                {
                                    return false;
                                }
                            }

                            if (select == band._rowidx)
                            {
                                if (!this._is_listview_focus)
                                {
                                    win._removeFromCurrentFocusPath(this, true);
                                    this._setFocus(false);
                                    this._is_listview_focus = true;
                                    return false;
                                }
                            }
                        }
                    }

                    if (shift_key)
                        this.addSelect(select);

                    //this.setSelect(select);    아래 _focusItem 에서 한번 더 호출됨
                    this._focusItem(select);
                }
                break;
            case nexacro.Event.KEY_LEFT:
                this._moveToCellPrev();
                break;
            case nexacro.Event.KEY_RIGHT:
                this._moveToCellNext();
                break;
            case nexacro.Event.KEY_TAB:
                this._moveToCellTab(shift_key);

                var win = this._getWindow();
                if (win && win._keydown_element)
                {
                    win._keydown_element._event_stop = true;
                }

                break;
        }

        return true;
    };

    _pListView._editorCellKeyInfo = function (keycode, alt_key, ctrl_key, shift_key)
    {
        var cell = this._getCurrentCell();
        if (!cell)
            return;

        if (keycode == nexacro.Event.KEY_ENTER)
        {
            if (ctrl_key)
            {
                cell._actionEditCell(cell, "ctrlenterkey");
                return;
            }
            cell._actionEditCell(cell, "enterkey");
        }
        else
        {
            if (this._p_autoenter == "key")
            {
                // runtime only
                if (nexacro._Browser == "Runtime")
                {
                    if (this._isChar(keycode) || keycode == 25) // 오른쪽 alt, ctrl, 한/영키 처리 필요? keycode 229
                    {
                        cell._actionEditCell(cell, "charkey");
                    }
                }
            }
        }
    };

    _pListView._clickCellKeyInfo = function (keycode, alt_key, ctrl_key, shift_key)
    {
        var cell = this._getCurrentCell();
        if (!cell)
            return;

        if (cell._getCellEditType() == "checkbox")
        {
            cell._subComp && cell._subComp._toggleCheck();
        }
    };

    _pListView._expandItemKeyInfo = function (keycode, alt_key, ctrl_key, shift_key)
    {
        var cell = this._getCurrentCell();

        if (!cell)
            return;

        if (cell._isShowEditor())
        {
            var band = this._getCurrentBand();
            if (band)
                band._expandItemKeyInfo(keycode, alt_key, ctrl_key, shift_key);
        }
    };

    _pListView._customItemKeyInfo = function (keycode, alt_key, ctrl_key, shift_key)
    {
        switch (this._checkCustomActionKeyInfo(keycode, alt_key, ctrl_key, shift_key))
        {
            case "select":
                this._selectItemKeyInfo(keycode, alt_key, ctrl_key, shift_key);
                break;
            case "editor":
                this._editorCellKeyInfo(keycode, alt_key, ctrl_key, shift_key);
                break;
            case "click":
                this._clickCellKeyInfo(keycode, alt_key, ctrl_key, shift_key);
                break;
            case "expand":
                this._expandItemKeyInfo(keycode, alt_key, ctrl_key, shift_key);
                break;
        }
    };

    _pListView._checkCustomActionKeyInfo = function (keycode, alt_key, ctrl_key, shift_key)
    {
        var ret = "";

        switch (keycode)
        {
            case nexacro.Event.KEY_DOWN:
            case nexacro.Event.KEY_UP:
            case nexacro.Event.KEY_LEFT:
            case nexacro.Event.KEY_RIGHT:
            case nexacro.Event.KEY_PAGE_UP:
            case nexacro.Event.KEY_PAGE_DOWN:
                var win = this._getWindow();
                if (win)
                {
                    var keydown_elem = win._keydown_element;
                    if (keydown_elem && this._isEditorKeyAction(keydown_elem, keycode, alt_key, ctrl_key, shift_key) == false)
                        ret = "select";
                }
                break;
            case nexacro.Event.KEY_SPACE:
                ret = "click"
                break;
            case 69:  // KEY_E
                if (alt_key && ctrl_key && !shift_key)
                    ret = "expand";
                break;
            case nexacro.Event.KEY_ENTER:
            default:
                ret = "editor";
                break;
        }

        return ret;
    };

    _pListView._isChar = function (keyCode)
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

    _pListView._isEditorKeyAction = function (elem, keyCode, altKey, ctrlKey, shiftKey)
    {
        if (this._is_editor_keyaction == false)
        {
            this._is_editor_keyaction = true;
            return true;
        }

        var cell = this._getCurrentCell();
        if (!cell || !cell._isShowEditor())
        {
            return false;
        }

        if (elem.isInputElement())
        {
            var pos = elem.getElementCaretPos();
            var line;
            var max_line;

            if (elem.readonly == true)
                return false;

            if (keyCode == nexacro.Event.KEY_LEFT)
            {
                if (ctrlKey || shiftKey || altKey)
                {
                    return true;
                }

                if ((pos && pos != -1) && pos.begin != 0)
                {
                    return true;
                }
            }
            else if (keyCode == nexacro.Event.KEY_RIGHT)
            {
                if (ctrlKey || shiftKey || altKey)
                {
                    return true;
                }

                var elem_val = elem.getElementValue();
                var v = elem_val ? elem_val.length : 0;

                if ((pos && pos != -1) && pos.begin != v)
                {
                    return true;
                }
            }
            else if (keyCode == nexacro.Event.KEY_UP)
            {
                if (ctrlKey || shiftKey || altKey)
                {
                    return true;
                }

                if (elem.usemultiline)
                {
                    line = elem.getElementCaretLine();
                    if (line != 1)
                    {
                        return true;
                    }
                }
            }
            else if (keyCode == nexacro.Event.KEY_DOWN)
            {
                if (ctrlKey || shiftKey || altKey)
                {
                    return true;
                }

                if (elem.usemultiline)
                {
                    max_line = parseInt(elem.parent.linkedcontrol._getLineCount());
                    line = elem.getElementCaretLine();
                    if (line != max_line)
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    /*
    _pListView._refreshBody = function ()
    {
        if (!this._p_enableredraw)
            return;

        var curcell = (cellidx != null) ? cellidx : this.currentcell;
        var band = this._getCurrentBand(rowidx, bandidx);
        var cell = null;

        if (band) {
            var cells = this._getBandCells(band);

            if (cells)
                cell = cells[curcell];
        }
        return cell;
    };

        _pListView._refreshHead = function ()
    {
        if (!this._p_enableredraw)
            return;


    };
    
    _pListView._refreshBodyCell = function (rowidx, bandidx, cellidx)
    {
        if (!this._p_enableredraw)
            return;

        var cell = this._getCurrentCell(rowidx, bandidx, cellidx);

        if (cell)
            cell._updateAll();
    };
    */

    //===============================================================
    // nexacro.ListView : Layout/Popup
    //===============================================================
    // Popup Create
    _pListView._onCreatePopupChild = function (slot)
    {
        if (slot && this._formats)
        {
            var bandseq = this._formats._getBandSeq("detail");
            var popband = slot._getSlotTargetBand(bandseq);
            var bindidx = slot._getSlotIndex();

            if (popband)
            {
                // get ctxt/bind data
                var ctxtband = popband._getCtxtBaseInfo();
                var binddata = this._getBindData(bindidx);

                var child = null;

                if (child = this._createPopupChildControl(this.createCtxtControl(ctxtband, bindidx)))
                {
                    // set context itemindex
                    this._setItemIndex(child, popband._itemindex);
                    // set context iteminfo
                    this._setCtxtItemInfo(child, ctxtband, bindidx, popband._itemsubidx);
                    // set bind iteminfo
                    this._setBindItemInfo(child, binddata, bindidx, bandseq);
                    // set sublayout
                    this._setItemSubLayoutInfo(child, binddata, bindidx);

                    this._setItemIndentSize(child, this._onGetIndentSize());

                    return child;
                }
            }
        }
    };

    // Popup Overide
    _pListView._getPopupControl = function ()
    {
        return this._getCurrentPopup();
    };

    _pListView._onGetPopupChildSize = function (popup)
    {
        var popupband = popup._getAttachedComponent();
        if (popupband && popupband._getContextSize)
        {
            return popupband._getContextSize(this._getClientWidth(), this._getClientHeight());
        }
        else
        {
            return [this.getPixelWidth(), this.getPixelHeight()];
        }
    };

    _pListView._onGetPopupChildPosition = function (popup)
    {
        var win = this._getWindow();
        var origin = popup._getOrigin(true);
        var popupband = popup._getAttachedComponent();
        if (origin && popupband)
        {
            // get extrainfo
            var indent = this._onGetItemIndentSize(popupband);

            // calc position
            var win_h = nexacro._getMainWindowHeight(win);

            var origin_pos = nexacro._getElementPositionInFrame(origin.getElement());
            var origin_height = origin.getPixelHeight();

            var popup_height = popupband._getContextHeight(this._getClientHeight());

            var posl = 0 + indent[0];
            var post = origin.getPixelHeight();

            if (origin_pos.y + origin_height + popup_height > win_h)
            {
                if (origin_pos.y - popup_height >= 0)
                {
                    post = -popup_height;
                }
            }

            return [posl, post];
        }
        else
        {
            return [0, 0];
        }
    };

    // Popup Event
    _pListView.on_notify_popup_onpopup = function (popupindex, startindex, startlevel)
    {
        var popup = this._popuplist[popupindex];
        if (popup)
        {
            var origin = popup._getOrigin(false);
            var comp = popup._getAttachedComponent();

            // apply status
            var stat = "";
            var status = origin._statusmap;
            for (stat in status)
            {
                comp._changeStatus(stat, status[stat]);
            }

            // apply userstatus
            var userstatus = origin._userstatusmap;
            for (stat in userstatus)
            {
                comp._changeUserStatus(stat, userstatus[stat]);
            }

            this._setCurrentPopup(popup, popupindex, startindex, startlevel);
        }
    };

    _pListView.on_notify_popup_onclose = function (popupindex, startindex, startlevel)
    {
        var panel = this._getPanel();
        if (panel)
        {
            var slot = panel._getPanelSlot(startindex);
            if (slot)
            {
                var bandstatus = slot._getSlotStatusBand();

                panel._setPanelSlotStatusBandNoAction(startindex, nexacro._PanelSlotConst.STATUS_COLLPASE);

                if (bandstatus != (bandstatus = slot._getSlotStatusBand()))
                {
                    this._on_fire_onbandstatuschanged(startindex, bandstatus, this, this);
                }
            }
        }
    };

    //===============================================================
    // nexacro.ListView : Formats
    //===============================================================

    // [상위 Component 처리]
    // Formats는 Complex Component에서 제공

    // [개별 Component 처리]
    // override 대상과 property/method 노출처리

    // [component.composite.layout.formats:useset]
    _pListView._is_format_layout = true;
    // [component.composite.layout.formats:initprop]
    _pListView.formats = "";                            // format string
    _pListView.formatid = "";                           // format id

    // [component.layout.formats.config:init]
    _pListView._onInitFormatsLayout = function ()
    {
        var formats = this._formats;

        if (formats)
        {
            formats._initFormats(
                nexacro._FormatsConst.FORMATMODE_XML,
                nexacro._FormatsConst.FORMATTYPE_POSITION,
                nexacro._FormatsConst.FORMATBIND_BIND,
                ["head"],
                ["body", "detail"],
                [""],
                ["track"],
                ["null"],
                ["track", "null"],
                { "Band": "nexacro._ListViewBandControl", "Cell": "nexacro._ListViewCellControl" }
            );
        }
    };

    // [component.layout.formats.context.base:set] 
    _pListView._onSetCtxtBaseInfo = function ()
    {
        // make bandinfo/cellinfo
        var ctxt = this._getCtxtBaseInfo();
        var bands = ctxt ? ctxt._bands : null;

        if (bands)
        {
            for (var band in bands)
            {
                this._makeBandCellInfo(bands[band]);
            }
        }
    };
    // [component.layout.formats.context.base:clear] 
    _pListView._onClearCtxtBaseInfo = function ()
    {
        // make bandinfo/cellinfo
        var ctxt = this._getCtxtBaseInfo();
        var bands = ctxt ? ctxt._bands : null;

        if (bands)
        {
            for (var band in bands)
            {
                this._clearBandCellInfo(bands[band]);
            }
        }
    };
    _pListView._resetBandCellInfo = function (band, clearonly)
    {
        if (band)
        {
            {
                this._clearBandInfo(band);
                this._clearCellInfo(band);
            }
            if (!clearonly)
            {
                this._makeBandInfo(band);
                this._makeCellInfo(band);
            }
        }
    };
    _pListView._makeBandCellInfo = function (bands)
    {
        this._resetBandCellInfo(bands, false);
    };
    _pListView._clearBandCellInfo = function (bands)
    {
        this._resetBandCellInfo(bands, true);
    };
    _pListView._makeBandInfo = function (band)
    {
        // TODO : 통합후 삭제확인
        /*
        band._bandinfo = new nexacro.GridBandInfo(band.id, band.id, null, this);

        this._onMakeBandInfo(band);
        */
    };
    _pListView._makeCellInfo = function (band)
    {
        for (var i = 0, l = band._items.length; i < l; i++)
        {
            band._items[i]._cellinfo = new nexacro.ListViewCellInfo(band.id + i, band._bandinfo, this, band.id, i);

            this._onMakeCellInfo(band._items[i]);
        }
    };
    _pListView._changeCellInfo = function (bandid, cellid, propid, propval)
    {
        var ctxt = this._getCtxtBaseInfo();
        if (ctxt)
        {
            var cell = ctxt._getBandChildFromId(bandid, cellid);
            if (cell)
            {
                return this._onChangeCellInfo(cell, propid, propval);
            }
        }

        return false;
    };
    _pListView._getCellinfo = function (bandid, cellid, propid)
    {
        var ctxt = this._getCtxtBaseInfo();
        if (ctxt)
        {
            var cell = ctxt._getBandChildFromId(bandid, cellid);
            if (cell)
            {
                if (!propid)
                    return cell._cellinfo;
                else
                    return cell._cellinfo[propid];
            }
        }
    };
    _pListView._clearBandInfo = function (band)
    {
        if (band._bandinfo)
        {
            delete band._bandinfo;
            band._bandinfo = null;
        }
    };
    _pListView._clearCellInfo = function (band)
    {
        for (var i = 0, l = band._items.length; i < l; i++)
        {
            if (band._items[i]._cellinfo)
            {
                delete band._items[i]._cellinfo;
                band._items[i]._cellinfo = null;
            }
        }
    };

    _pListView._onMakeBandInfo = function (band)
    {

    };
    _pListView._onMakeCellInfo = function (cell)
    {
        var cellinfo = cell ? cell._cellinfo : null;
        var cellsett = cell ? cell._setts : null;
        if (cellinfo && cellsett)
        {
            for (var propid in cellsett)
            {
                var func = cellinfo["set_" + propid];
                if (func)
                {
                    func.call(cellinfo, cell[propid]);
                }
                else if (cellinfo.hasOwnProperty(propid) == false)    // userdata
                {
                    var attrval = cell["_p_" + propid];

                    switch (propid)
                    {
                        //--- reserved ---
                        case "col":
                        case "row":
                        case "colspan":
                        case "rowspan":
                            break;
                        //----------------
                        default:
                            cellinfo["_p_" + propid] = new nexacro.BindableValue(undefined);
                            cellinfo["_p_" + propid]._propname = propid;
                            cellinfo._addPropertyMap(cellinfo, [[propid, null, true, undefined, false]], true);

                            if (attrval !== null && attrval !== undefined)
                                cellinfo["set_" + propid](attrval);

                            break;
                    }
                }
            }
        }
    };
    _pListView._onChangeCellInfo = function (cell, propid, propval)
    {
        var cellinfo = cell ? cell._cellinfo : null;
        if (cellinfo)
        {
            var func = cellinfo["set_" + propid];
            if (func)
            {
                func.call(cellinfo, propval);

                if (propid == "left" || propid == "top" || propid == "width" || propid == "height" || propid == "right" || propid == "bottom")
                {
                    cellinfo._syncPosition(cell);
                }

                return true;
            }
            else if (cellinfo.hasOwnProperty(propid) == false)    // userdata
            {
                var attrval = cell["_p_" + propid];

                switch (propid)
                {
                    //--- reserved ---
                    case "col":
                    case "row":
                    case "colspan":
                    case "rowspan":
                        break;
                    //----------------
                    default:
                        cellinfo["_p_" + propid] = new nexacro.BindableValue(undefined);
                        cellinfo["_p_" + propid]._propname = propid;
                        cellinfo._addPropertyMap(cellinfo, [[propid, null, true, undefined, false]], true);

                        if (attrval !== null && attrval !== undefined)
                            cellinfo["set_" + propid](attrval);

                        break;
                }
                return true;
            }
        }
        return false;
    };

    // [component.layout.formats.context.control:create]
    _pListView.onCreateCtxtControl = function (item, ctxt, seq)
    {
        // context control created logic
        if (item && ctxt)
        {
            // set added creation info
            //  if (item._setAddedCreateInfo)
            item._setAddedCreateInfo(this, ctxt, seq);

            // set event handler
            //  if (item._setEventHandler)
            {
                item._setEventHandler("onclick", this.on_notify_band_onclick, this);
                item._setEventHandler("ondblclick", this.on_notify_band_ondblclick, this);
                item._setEventHandler("onsetfocus", this.on_notify_band_onsetfocus, this);
                item._setEventHandler("onexpand", this.on_notify_band_onexpand, this);
                item._setEventHandler("onexpandclick", this.on_notify_band_onexpandclick, this);
                item._setEventHandler("oninput", this.on_notify_band_oninput, this);
            }
        }

        return item;
    };

    _pListView._onGetContextDataNull = function (index)
    {
        if (this._formats)
        {
            var bandchild;

            var ctxt = this._onGetContextDataBand(this._formats._null_bands, index);
            if (ctxt && ctxt[0])
            {
                bandchild = ctxt[0]._items;
            }
            else
            {
                // create temp format
                var tmp = new nexacro._Formats();
                tmp._initFormats(
                    nexacro._FormatsConst.FORMATMODE_XML,
                    nexacro._FormatsConst.FORMATTYPE_POSITION,
                    nexacro._FormatsConst.FORMATBIND_BIND,
                    ["head"],
                    ["body", "detail"],
                    [""],
                    [""],
                    ["null"],
                    ["null"],
                    { "Band": "nexacro._ListViewBandControl", "Cell": "nexacro._ListViewCellControl" }
                );

                tmp._loadFormatFromDOM("default", "");
                tmp._makeAutoBands();

                // get null band
                var item = tmp._getItem("default");

                ctxt = [item._getBand("null", false)];
                bandchild = item._getBandChilds("null");
            }

            if (bandchild && bandchild[0])
            {
                bandchild[0].text = this._getStringResourceProperty(this._p_nodatatext);
                bandchild[0].background = "transparent " + this._p_nodataimage + " center center no-repeat";
            }

            return this._null_ctxts = ctxt;
        }
    };

    // analyze
    _pListView._analyzeKeyMatrix = function ()
    {
        var ctxt = this._getCtxtBaseInfo();
        var bands = ctxt ? ctxt._bands : null;

        if (!bands || !bands["body"])
            return;

        var slot_cnt = this._getPanelSlotCount(0);

        for (var i = 0; i < slot_cnt; i++)
        {
            this._analyzeKeyMatrixCellSameBand(this._items[i]);
        }
    };

    _pListView._getKeyActionOtherbandCell = function (cell, ohterband, direction)
    {
        var cells = this._getBandCells(ohterband);
        if (!cells)
            return -1;

        var cell1_x, cell1_y, cell2, cell2_x, cell2_y;

        var i, n;
        var dir;
        var diridx = (direction == "l" || direction == "r") ? 0 : 1;
        var min = Infinity;
        var same = null;
        var key_direction = -1;

        cell1_x = cell._adjust_left + (cell._adjust_width / 2);
        cell1_y = cell._adjust_top + (cell._adjust_height / 2);

        for (i = 0, n = cells.length; i < n; i++)
        {
            cell2 = cells[i];
            cell2_x = cell2._adjust_left + (cell2._adjust_width / 2);
            cell2_y = cell2._adjust_top + (cell2._adjust_height / 2);

            switch (direction)
            {
                case "l":
                    cell2_x -= ohterband._adjust_width;
                    break;
                case "t":
                    cell2_y -= ohterband._adjust_height;
                    break;
                case "r":
                    cell2_x += cell.parent._adjust_width;
                    break;
                case "b":
                    cell2_y += cell.parent._adjust_height;
                    break;
            }

            var result = this._calcCellAngleDistance(cell1_x, cell1_y, cell2_x, cell2_y);

            result.idx = i;
            result.x = cell2_x;
            result.y = cell2_y;

            dir = result.direction[diridx];

            if (dir == direction)
            {
                if (min > result.distance)
                {
                    same = [];
                    same.push(result);
                    min = result.distance;
                }
                else if (min == result.distance)
                {
                    if (same)
                    {
                        same.push(result);
                    }
                }
            }
        }

        if (same)
        {
            var neer = Infinity;

            if (diridx == 0)
            {
                for (i = 0, n = same.length; i < n; i++)
                {
                    var h = Math.abs(same[i].y - cell1_y);

                    if (neer > h)
                    {
                        neer = h;
                        key_direction = same[i].idx;
                    }
                }
            }
            else
            {
                for (i = 0, n = same.length; i < n; i++)
                {
                    var w = Math.abs(same[i].x - cell1_x);

                    if (neer > w)
                    {
                        neer = w;
                        key_direction = same[i].idx;
                    }
                }
            }
        }

        return key_direction;
    };

    _pListView._analyzeKeyMatrixCellSameBand = function (bandctrl)
    {
        if (!bandctrl)
            return;

        var cells = this._getBandCells(bandctrl);
        if (!cells)
            return;

        var i, j, k, n, nn;
        var w, h;
        var cell1, cell1_x, cell1_y, cell2, cell2_x, cell2_y;
        for (i = 0, n = cells.length; i < n; i++)
        {
            var key_direction = { left: -1, up: -1, right: -1, down: -1 };
            var min = { l: Infinity, t: Infinity, r: Infinity, b: Infinity };
            var same = { l: null, t: null, r: null, b: null };

            cell1 = cells[i];
            cell1_x = cell1._adjust_left + (cell1._adjust_width / 2);
            cell1_y = cell1._adjust_top + (cell1._adjust_height / 2);

            for (j = 0; j < n; j++)
            {
                if (i == j)
                    continue;

                cell2 = cells[j];
                cell2_x = cell2._adjust_left + (cell2._adjust_width / 2);
                cell2_y = cell2._adjust_top + (cell2._adjust_height / 2);

                // 1. cell1 기준 cell2의 방향, 거리 수집
                var result = this._calcCellAngleDistance(cell1_x, cell1_y, cell2_x, cell2_y);

                result.idx = j;
                result.x = cell2_x;
                result.y = cell2_y;

                // 2. 수집결과에서 같은 거리를 가진 cell들의 존재 유무 체크
                for (k = 0; k < 2; k++) // [0] - x, [1] - y
                {
                    var dir = result.direction[k];
                    if (dir != undefined)
                    {
                        if (min[dir] > result.distance)
                        {
                            same[dir] = [];
                            same[dir].push(result);
                            min[dir] = result.distance;
                        }
                        else if (min[dir] == result.distance)
                        {
                            same[dir].push(result);
                        }
                    }
                }
            }

            var neer;

            // 3. 같은 거리를 가진 cell들이 존재할 경우, 해당 방향에서 가장 가까운 각도의 cell 수집
            if (same["l"])
            {
                neer = Infinity;
                for (j = 0, nn = same["l"].length; j < nn; j++)
                {
                    h = Math.abs(same["l"][j].y - cell1_y);

                    if (neer > h)
                    {
                        neer = h;
                        key_direction.left = same["l"][j].idx;
                    }
                }
            }

            if (same["t"])
            {
                neer = Infinity;
                for (j = 0, nn = same["t"].length; j < nn; j++)
                {
                    w = Math.abs(same["t"][j].x - cell1_x);

                    if (neer > w)
                    {
                        neer = w;
                        key_direction.up = same["t"][j].idx;
                    }
                }
            }

            if (same["r"])
            {
                neer = Infinity;
                for (j = 0, nn = same["r"].length; j < nn; j++)
                {
                    h = Math.abs(same["r"][j].y - cell1_y);

                    if (neer > h)
                    {
                        neer = h;
                        key_direction.right = same["r"][j].idx;
                    }
                }
            }

            if (same["b"])
            {
                neer = Infinity;
                for (j = 0, nn = same["b"].length; j < nn; j++)
                {
                    w = Math.abs(same["b"][j].x - cell1_x);

                    if (neer > w)
                    {
                        neer = w;
                        key_direction.down = same["b"][j].idx;
                    }
                }
            }

            cell1._refinfo._key_direction = key_direction;
        }
    };

    _pListView._calcCellAngleDistance = function (cell1_x, cell1_y, cell2_x, cell2_y)
    {
        var w = cell2_x - cell1_x;
        var h = cell2_y - cell1_y;
        var distance = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
        var angle = 180 * Math.atan2(w, -h) / Math.PI;
        var dir = new Array(2);

        if (angle < -45 && angle > -135)
        {
            dir[0] = "l";
        }
        else if (angle > -45 && angle < 45)
        {
            dir[1] = "t";
        }
        else if (angle > 45 && angle < 135)
        {
            dir[0] = "r";
        }
        else if (angle == -45)
        {
            dir[0] = "l";
            dir[1] = "t";
        }
        else if (angle == 45)
        {
            dir[0] = "r";
            dir[1] = "t";
        }
        else if (angle == 135)
        {
            dir[0] = "r";
            dir[1] = "b";
        }
        else if (angle == -135)
        {
            dir[0] = "l";
            dir[1] = "b";
        }
        else
        {
            dir[1] = "b";
        }

        return { direction: dir, distance: distance };
    };

    // [component.formats:set]   
    _pListView.set_formats = function (str)
    {
        if (this._p_formats != str)
        {
            // set property value
            this._p_formats = str;

            // [component.formats:apply]           
            this.on_apply_formats();
        }
    };

    // [component.formats:apply]   
    _pListView.on_apply_formats = function ()
    {
        if (this._is_created)
        {

            this._setFormats(this.formats);

            this._updateFormats();
            this._analyzeKeyMatrix();
            this._recreateItems();
        }
    };

    // [component.formats:clear] 
    _pListView.on_clear_formats = function ()
    {
        this._clearFormats();
    };

    // [component.formats.formatid:set]   
    _pListView.set_formatid = function (v)
    {
        if (v && v != this._p_formatid)
        {
            // set property value
            this._p_formatid = v;

            // [component.formats.formatid:apply]
            this.on_apply_formatid();
        }
    };
    // [component.formats.formatid:apply]   
    _pListView.on_apply_formatid = function ()
    {
        if (!this._is_created)
            return;

        this._changeFormatId(this.formatid);

        this._recreateItems();
    };

    // [component.formats.formatid:clear]   
    _pListView.on_clear_formatid = function ()
    {
        if (!this._is_created)
            return;

        // [component.formats.formatid:clear] 
        this._clearFormatId();
    };


    //===============================================================
    // nexacro.ListView : InnerBind/FullBind
    //===============================================================

    // [상위 Component 처리]
    // value bind는 Simple Component 기본으로 제공
    // inner bind/full bind도 Complex Component에서 제공

    // [개별 Component 처리]
    // override 대상과 bind별 property/method 노출처리
    // bind 처리는 상위 interface를 사용

    // TODO: Interface Socketing으로 통합시킬것
    // [component.bind.fullbind:initprop]   
    _pListView._p_binddataset = null;
    _pListView.rowcount = 0;

    // bind properties
    _pListView.set_binddataset = function (dataset)
    {
        if (this._p_binddataset != dataset)
        {
            // set property value
            this._p_binddataset = dataset;

            // [component.bind.dataset:apply]           
            this.on_apply_binddataset();
        }
    };

    _pListView.on_apply_binddataset = function ()
    {
        // [component.bind.dataset:set]
        this._setBindDataSource();
        // [component.bind.rowcount:set]
        this.rowcount = this._getBindCount();

        if (!this._is_created)
            return;

        // [component.bind.innerbind:recreate]   
        this._recreateItems();
    };

    _pListView.on_clear_binddataset = function ()
    {
        // [component.bind.dataset:unset]
        this._clearBindDataSource();
        // [component.bind.rowcount:unset]
        this.rowcount = 0;
    };

    // bind event
    _pListView._callback_onload = function (obj, e)
    {
        this.rowcount = this._getBindCount();

        // TODO : REASON Action
        if (this._is_created)
        {
            this._resetBindInfo();
            this._recreateItems();
        }
    };

    _pListView._callback_onrowsetchanged = function (obj, e)
    {
        this.rowcount = this._getBindCount();

        // TODO : REASON Action
        if (this._is_created)
        {
            //this._resetBindInfo();
            this._recreateItems(obj.rowposition);
        }
    };

    _pListView._callback_onrowposchanged = function (obj, e)
    {
        if (!this._is_created)
            return;

        if (this._beginChangeRowPosition())
            return;

        var currsel = this.getSelect();
        var sel = this._onGetSelectArgument(obj.rowposition, currsel.band, currsel.cell);
        this._onSetCurrentSelect(sel);

        if (this._finalChangeRowPosition()) return;
    };

    //===============================================================
    // nexacro.ListView : Layout/Panel
    //===============================================================

    // [component.composite.layout.panel:useset]
    _pListView._is_panel_layout = true;

    // [component.layout.panel:init]
    _pListView._onInitPanelLayout = function ()
    {
        var panel = this._getPanel();

        if (panel)
        {
            var _partslot = this._use_partitem ? nexacro._PanelConst.SLOT_OVERFLOWTYPE_PARTSLOT
                : nexacro._PanelConst.SLOT_OVERFLOWTYPE_FULLSLOT;

            var _rowfirst = this._rowfirst ? this._rowfirst : nexacro._PanelConst.SLOT_ARRANGETYPE_COLFIRST;
            var _arrange = this._arrange ? this._arrange : nexacro._PanelConst.SLOT_ARRANGETYPE_HORZGAPD;
            var _overflow = this._overflow ? this._overflow : nexacro._PanelConst.SLOT_OVERFLOWTYPE_SCROLL;
            var _selector = this._selector ? this._selector : nexacro._PanelConst.SLOT_SELECTORTYPE_NONE;

            // TODO: RuleBased Socketing 처리
            panel._setLayoutType(nexacro._PanelConst.LAYOUTSTYLE_POSITION);
            panel._setSizeInfoRefPanel(null, nexacro._PanelConst.SIZEINFO_REFSTYLE_NOLINK);
            panel._setGroupingSubPanel(null, this._subgroup, nexacro._PanelConst.GROUPING_SUBPLACE_NONE);
            panel._setSlotVisibleType(nexacro._PanelConst.SLOT_VISIBLETYPE_HIDESLOT);
            panel._setSlotArrangeType(_rowfirst | _arrange);
            panel._setSlotOverFlowType(_overflow | _partslot);
            panel._setSlotSelectorType(_selector);
            panel._setSlotAutoSizeType(nexacro._PanelConst.SLOT_AUTOSIZETYPE_DEFAULT);
            //  panel._setSlotAutoFillType(nexacro._PanelConst.SLOT_AUTOFILLTYPE_DEFAULT);
            panel._setSlotSizeMoveType(nexacro._PanelConst.SLOT_SIZEMOVETYPE_NONE);
            panel._setSlotBandFixType(true, false, false);

            panel._setPanelLimitHeight(this._getPanelLimitHeight());
        }
    };
    // [component.layout.panel:subinit]
    _pListView._onInitSubPanelNCChildLayout = function (ncchild, panel)
    {
        // set ncchild panel link
    };
    // [component.layout.panel:subinit]
    _pListView._onInitSubPanelChildLayout = function (child, panel)
    {
        // set parent/child panel link
    };
    // [component.layout.panel:subinit]
    _pListView._onInitSubPanelItemsLayout = function (item, panel, binddata, index)
    {
    };
    // [component.layout.panel.popup:subinit]
    _pListView._onInitPopupSubPanelNCChildLayout = function (parent, startindex, startlevel)
    {
    };
    // [component.layout.panel.popup:subinit]
    _pListView._onInitPopupSubPanelChildLayout = function (parent, startindex, startlevel)
    {
    };
    // [component.layout.panel.popup:subinit]
    _pListView._onInitPopupSubPanelItemsLayout = function (parent, startindex, startlevel)
    {
    };

    _pListView._calcItemScrollViewStart = function (pos, row, col, rowfirst)
    {
        // TODO : Head/Final 포함
        var expandtype = this._p_bandexpandtype;
        if (expandtype == "expand" || expandtype == "accordion")
        {
            if (this._use_scrollmanager && this._scrollmanager)
            {
                var start = this._getItemScrollViewStart();
                if (start < 0)
                    start = 0;

                var calc_row = rowfirst ? (start / row) : (start / col);
                var scroll_direction = "forward";	// forward, backward

                if (rowfirst)
                {
                    var iw = this._getItemWidth(0);

                    if (iw <= 0)
                        return 0;
                    else
                        return Math.floor(pos / iw) * (row ? row : 1);
                }
                else
                {
                    var bind_count = this._getBindCount();

                    var i = 0;
                    var len = start + col > bind_count ? bind_count : start + col;
                    var item_top = 0;
                    var item_bottom = 0;
                    var item_maxheight_row = 0;

                    for (i = start; i < len; i++)
                    {
                        var item = this._getItem(i);
                        if (item)
                        {
                            item_maxheight_row = Math.max(item_maxheight_row, this._getItemHeight(i, -9));

                            if (i === start)
                            {
                                if (nexacro._isArray(item))
                                {
                                    item_top = item[0].top;
                                }
                                else
                                {
                                    item_top = item.top;
                                }
                            }
                        }
                    }

                    if (item_maxheight_row <= 0)
                    {
                        return start;
                    }

                    if (pos == item_top)
                    {
                        return start;
                    }

                    item_bottom = item_top + item_maxheight_row;

                    if (pos < item_bottom)
                    {
                        scroll_direction = "backward";
                    }

                    if (scroll_direction == "forward")
                    {
                        while (pos >= item_bottom)
                        {
                            start += col;
                            item_maxheight_row = 0;

                            // 다음 row에서 최대 높이를 찾음
                            for (i = start; i < start + col; i++)
                            {
                                item_maxheight_row = Math.max(item_maxheight_row, this._getItemHeight(i, -9));
                            }

                            if (item_maxheight_row > 0)
                            {
                                item_bottom += item_maxheight_row;
                                calc_row++;
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                    else
                    {
                        while (pos < item_top)
                        {
                            start -= col;
                            item_maxheight_row = 0;

                            // 이전row에서 최대높이를 찾음
                            for (i = start; i < start + col; i++)
                            {
                                item_maxheight_row = Math.max(item_maxheight_row, this._getItemHeight(i, -9));
                            }

                            if (item_maxheight_row > 0)
                            {
                                item_top -= item_maxheight_row;
                                calc_row--;
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                }
                return calc_row * (col ? col : 1);
            }
        }
        else
        {
            return nexacro.ComplexComponent.prototype._calcItemScrollViewStart.call(this, pos, row, col, rowfirst);
        }
    };

    _pListView._calcItemScrollViewCount = function (pos, row, col, rowfirst)
    {
        // up
        // TODO : Head/Final 포함
        // TODO : autosize pos 기준 count
        var expandtype = this._p_bandexpandtype;
        if (expandtype == "expand" || expandtype == "accordion")
        {
            if (this._use_scrollmanager && this._scrollmanager)
            {
                var bindcount = this._getBindCount();

                if (rowfirst)
                {
                    var cw = this._getClientWidth();
                    var iw = this._getItemArrWidth(0, -9, cw);

                    if (cw <= 0 || iw <= 0)
                        return 0;
                    else
                        return Math.ceil(cw / iw) * (row ? row : 1);
                }
                else
                {
                    var rc = 0;

                    var ch = this._getClientHeight();
                    var ih = 0;

                    var ii = pos > 0 ? pos : 0;
                    var itemsize = this._getItemArrHeight(ii, -9, ch);

                    if (ch <= 0 || itemsize <= 0)
                    {
                        return 0;
                    }
                    else
                    {
                        while (ch >= itemsize)
                        {
                            for (var i = 0; i < col; i++)
                            {
                                ii++;
                                if (ii >= bindcount)
                                {
                                    ih = Math.max(ih, this._getItemArrHeight(0, -9, ch));
                                }
                                else
                                {
                                    ih = Math.max(ih, this._getItemArrHeight(ii, -9, ch));
                                }
                            }

                            if (ih > 0)
                            {
                                itemsize += ih;
                                rc++;
                            }
                            else
                            {
                                break;
                            }
                        }

                        rc++;

                        return rc * (col ? col : 1);

                    }
                }
            }
        }
        else
        {
            return nexacro.ComplexComponent.prototype._calcItemScrollViewCount.call(this, pos, row, col, rowfirst);
        }
    };

    _pListView._calcItemScrollInfo = function (pos, rowfirst)
    {
        //==================================================================================
        // ListView 기준 over item calc
        //==================================================================================

        if (this._use_scrollmanager)
        {
            var cn = this._getItemViewCountRow(rowfirst);
            var co = this._getItemViewCountCol(rowfirst);

            if (!cn || !co)
                return undefined;

            var fullc = this._getBindCount();
            var start = this._getItemScrollViewStart(); if (start < 0) start = 0;
            var viewc = this._getItemScrollViewCount();
            var prevc = this._getItemScrollPrevCount();
            var nextc = this._getItemScrollNextCount();

            var overc;

            if (pos >= 0 && viewc >= 0)
            {
                var newps = this._calcItemScrollViewStart(pos, cn, co, rowfirst);
                var expandtype = this._p_bandexpandtype;
                if (expandtype == "expand" || expandtype == "accordion")
                {
                    viewc = this._calcItemScrollViewCount(newps, cn, co, rowfirst);
                }
                var diffc = newps - start;

                start = newps;

                prevc += diffc;
                nextc -= diffc;

                overc = nextc < viewc || prevc < viewc ? viewc : 0;     // over 기준 정하는 부분
                if (overc)
                {
                    if (prevc < viewc)
                    {
                        prevc = viewc;
                        nextc = viewc;

                        var diffp = start - prevc;
                        if (diffp < 0)
                        {
                            prevc += diffp;
                            nextc -= diffp;
                        }

                        if (prevc < 0)
                        {
                            prevc = 0;
                        }
                    }

                    if (nextc < viewc)
                    {
                        prevc = viewc;
                        nextc = viewc;

                        var diffn = fullc - (start + viewc + nextc);
                        if (diffn < 0)
                        {
                            nextc += diffn;
                            prevc -= diffn;
                        }

                        if (nextc < 0)
                        {
                            nextc = 0;
                        }
                    }
                }
            }
            else
            {
                var index = 0;
                var count = 0;

                if (viewc < 0)
                {
                    if (cn <= 0) cn = 1;
                    if (co <= 0) co = 1;

                    viewc = this._calcItemScrollViewCount(-1, cn, co, rowfirst);
                    nextc = viewc * (this._add_partitem + 1);
                    prevc = 0;
                }
                else
                {
                    viewc = cn * co;
                    prevc = nextc = viewc * this._add_partitem;
                }

                index = start - prevc;
                count = viewc + prevc + nextc;

                if (index < 0)
                {
                    count += index;
                    prevc += index; if (prevc < 0) prevc = 0;
                    index = 0;
                }

                overc = (index + count) - fullc;

                if (overc > 0)
                {
                    nextc -= overc;
                    if (nextc < 0)
                    {
                        nextc = 0;
                    }
                }

                overc = undefined;
            }

            this._setItemScrollViewStart(start);
            this._setItemScrollViewCount(viewc);
            this._setItemScrollPrevCount(prevc);
            this._setItemScrollNextCount(nextc);

            this._resetItemScrollFullSize(rowfirst);

            return overc;
        }

        return 0;
    };

    _pListView._movePanelItemSlot = function (ctrls, start, count, prevc, nextc)
    {
        //==================================================================================
        // start + prev + next + count 에 해당하는 slot에 item control move
        // return true  : this._showPanelItemSlot 수행 안함.
        // reutrn false : this._showPanelItemSlot 수행함.

        // TODO : ListView 전용 interface. ComplexComponent에 요구사항이 있을시 도입 검토.
        //==================================================================================

        var panel = this._panel;
        if (panel && this._use_partitem && ctrls)
        {
            // 실제 생성된 item 갯수
            var itemscount = ctrls.filter(function (ctrl, index, array) { if (ctrl) return true; }, this).length;

            // control 기준 체크. 실제로 생성된 item이 없으면 move할게 없음
            if (!itemscount)
                return false;

            var moved = true;
            var enough = true;

            var slotindex = 0;
            var baseindex = 0;

            var bindcount = this._getBindCount();
            var slotcount = 0;

            var slot, slot_empty;
            var slot_movable_idx;
            var slot_movable_idxArr = new Array();

            slotindex = (!start || start < 0) ? baseindex : Math.max(baseindex + start - prevc, 0);
            slotcount = (!count || count < 0) ? bindcount : Math.min(slotindex + count + prevc + nextc, bindcount);

            for (var i = 0; i < bindcount; i++)
            {
                slot = panel._getPanelSlot(i);
                slot_empty = slot ? !slot._isNonEmptyTarget(slot._getSlotTarget()) : false;
                if (!slot_empty)
                {
                    if (i < slotindex || i >= slotcount) slot_movable_idxArr.push(i);
                }
            }

            for (; slotindex < slotcount; slotindex++)
            {
                slot = panel._getPanelSlot(slotindex);
                slot_empty = !slot._isNonEmptyTarget(slot._getSlotTarget());
                if (slot_empty)
                {
                    slot_movable_idx = slot_movable_idxArr.shift();
                    if (!nexacro._isNull(slot_movable_idx))
                    {
                        panel._getPanelSlot(slot_movable_idx)._clearSlotTarget();
                        slot._placeSlotTarget(this._getItem(slot_movable_idx));

                        moved = this._moveItem(slot_movable_idx, slotindex);
                    }
                    else
                    {
                        enough = false;
                    }
                }
            }

            return moved & enough;
        }

        return false;
    };

    _pListView._trackPanelItemSlot = function (action)
    {
        //==================================================================================
        //  cover + action case에 따라 Apper, Ready 결정
        //  cover + action case에 따라 Sync,  Async 결정
        //==================================================================================

        var usecover = this.showcover;
        var manager = this._scrollmanager;

        if (!manager) return;

        switch (action)
        {
            case "pagemove":
                if (usecover)
                {
                    this._callbackApper();
                    manager._callbackReady(this, this._callbackReady, true);
                }
                break;
            case "trackstart":
                if (usecover)
                {
                    manager._actionTrackCover(action);
                    manager._actionTrackBands(action);
                }
                break;
            case "trackmove":
                if (usecover)
                {
                    manager._actionTrackCover(action);
                    manager._actionTrackBands(action);
                }
                else
                {
                    this._callbackApper();
                }
                break;
            case "trackend":
                if (usecover)
                {
                    manager._actionTrack(action, this, this._callbackApper, this._callbackPause, this._callbackClose);
                }
                break;
            default:
                manager._actionTrack(action, this, this._callbackApper, this._callbackPause, this._callbackClose);
                break;
        }
    };

    _pListView._apperPanelItemSlot = function (action, over)
    {
        //==================================================================================
        //  Apperance Item ( 보여주기 용도 )
        //  action : Item Focus, Item Select

        //  TODO : trigger 에 따라 apper가 다르게 수행되야 하는 경우
        //  Trigger Expample : reset, itemshow
        //==================================================================================
        if (isNaN(+over) === true)
        {
            over = null;
        }

        this._callbackApper(over);
    };

    _pListView._readyPanelItemSlot = function (action)
    {
        //==================================================================================
        //  cover + action case에 따라 ScrollManager Ready, Component Ready 수행여부 결정

        //  ScrollManager Ready : Trackcover, TrackBands ( action )
        //                        Component Ready        ( callback )
        //  Component Ready     : Component Ready        ( callback )
        //==================================================================================

        var usecover = this.showcover;
        var manager = this._scrollmanager;

        if (!manager) return;

        if (action == "trackwheel")
        {
            manager._callbackReady(this, this._callbackReady, true);
        }
        else
        {
            if (usecover)
            {
                manager._actionReady(action, this, this._callbackReady);
            }
            else
            {
                manager._callbackReady(this, this._callbackReady, true);
            }
        }
    };

    _pListView._callbackPause = function ()
    {
        if (this._use_partitem)
        {
            if (this._use_scrollmanager && this._scrollmanager)
            {
                this._scrollmanager._actionTrackCover("trackpause");
            }
        }
    };

    _pListView._callbackClose = function ()
    {
        if (this._use_partitem)
        {
            if (this._use_scrollmanager && this._scrollmanager)
            {
                this._scrollmanager._actionTrackBands("trackend");
            }
        }
    };

    _pListView._callbackApper = function (over)
    {
        //==============================
        // 현재 Scroll 위치에서 보여야할 Item 생성 ( Apperance )
        // item 이 생성만 하면 scroll frame이 점차 저하되므로, 일정 갯수에서 lotation 처리
        // item start : viewstart - prevcount
        // item count : viewcount + prevcount + nextcount

        // TODO : trackwheel event가 scroll eventinfo를 생성하지 않기때문에 앞에서 over를 계산하고 넘어와야함.
        //        trackwheel event를 다른 scroll eventflow와 맞춰야 over 계산이 간결해짐.
        //        scroll event 에서는 scroll eventinfo에 변경된 position이 있고, Component._vscroll_pos 에는 아직 적용이 안된상태
        //==============================
        if (this._use_partitem)
        {
            // Calc New Range
            if (over === undefined)
            {
                over = this._isRowFirst() ?
                    this._calcItemScrollInfo(this._scrollmanager && this._scrollmanager.hscrollinfo ? this._scrollmanager.hscrollinfo.pos : this._hscroll_pos, true) :
                    this._calcItemScrollInfo(this._scrollmanager && this._scrollmanager.vscrollinfo ? this._scrollmanager.vscrollinfo.pos : this._vscroll_pos, false);
            }

            if (over !== 0)
            {
                var items = this._getItems();

                // Get Slot Range
                var viewstart = this._getItemScrollViewStart();
                var viewcount = this._getItemScrollViewCount();
                var prevcount = this._getItemScrollPrevCount();
                var nextcount = this._getItemScrollNextCount();

                // Move or Show Panel Slot PartItem
                if (!this._movePanelItemSlot(items, viewstart, viewcount, prevcount, nextcount))
                {
                    this._showPanelItemSlot(items, viewstart, viewcount, prevcount, nextcount, over, true);
                }

                this._resetStatus();
            }
        }
    };

    _pListView._callbackReady = function ()
    {
        //=========================================
        //  Component item이 정확하게 만들어진 상태

        //  TODO : Body의 make, hide 의 로직 변경 ( item 재사용하게 )
        //=========================================
        if (this._use_partitem)
        {
            var items = this._getItems();
            var rowfirst = this._isRowFirst();

            var viewstart = this._getItemScrollViewStart();
            var viewcount = this._getItemScrollViewCount();
            var prevcount = this._getItemScrollPrevCount();
            var nextcount = this._getItemScrollNextCount();

            // Make Head Ready Slot
            if (this._use_headitem)
                this._makePanelItemSlot(items, viewstart, viewcount, prevcount, nextcount, -1, rowfirst);

            // Make Tail Ready Slot
            if (this._use_tailitem)
                this._makePanelItemSlot(items, viewstart, viewcount, prevcount, nextcount, -2, rowfirst);

            // Make Body Ready Slot
            this._makePanelItemSlot(items, viewstart, viewcount, prevcount, nextcount, 0, rowfirst);

            // Make Scroll Manager Track
            this._resetLayoutTrack();
            this._resetScrollStatus();

            this._resetStatus();

            this._analyzeKeyMatrix();
        }
    };

    //===============================================================
    // nexacro.ListView : Layout/Split
    //===============================================================

    // [Complex Component 처리]
    // Resize Element를 Split의 구현요소로 이용해 Layout 크기변경을 처리한다.
    // Split 동작은 각 Control에 크기변경을 주고 Panel에 의해 Layout 재처리된다.

    //===============================================================
    // nexacro.ListView : Layout/Sizing
    //===============================================================

    // [Complex Component 처리]
    // Panel/Arrangemenet/Autosize/MinMax의 기능을 이용해 Layout 크기를 처리한다.
    // Arrangemenet/Autosize/MinMax의 결과가 크기변경을 주고 Panel에 의해 Layout 최종처리된다.

    //===============================================================
    // nexacro.ListView : Layout/Move
    //===============================================================

    // [Complex Component 처리]
    // DragDrop의 구현요소로 이용해 Layout 이동변경을 처리한다.
    // DragDrop 동작은 각 Control에 위치변경을 주고 Panel에 의해 Layout 재처리된다.


    //===============================================================
    // nexacro.ListView : Scroll
    //===============================================================
    _pListView._on_beforescroll = function (prehpos, prevpos, posthpos, postvpos, evttype, evtkind)
    {
        //hpos = (hpos = (parseInt(hpos) | 0)) < 0 ? 0 : hpos;
        postvpos = (postvpos = (parseInt(postvpos) | 0)) < 0 ? 0 : postvpos;

        var bChangeVpos = prevpos != postvpos;
        //var bChangeHpos = prehpos != posthpos;

        if (bChangeVpos)
        {
            if (evtkind)
            {
                if (evtkind.indexOf("mousewheel") > -1)
                {
                    this._updateItemVScrollInfo(postvpos, "trackwheel", true);
                    this._changeItemVScrollInfo(postvpos, "trackwheel", false);
                }
            }
            else
            {
                this._updateItemVScrollInfo(postvpos, "none", true);
                this._changeItemVScrollInfo(postvpos, "none", false);
            }
        }

        return true;
    };

    _pListView._on_basic_onvscroll = function (obj, info)
    {
        //
    };

    _pListView._on_default_onvscroll = function (obj, info)
    {
        //==================================================================================
        // cover 사용시 container 움직이면 안됨
        //==================================================================================
        var usecover = this.showcover;

        switch (info.type)
        {
            case "track":
            case "trackstart":
            case "trackend":
            case "trackfirst":
            case "trackfirstover":
            case "tracklast":
            case "tracklastover":

                if (!usecover)
                {
                    this._control_element.setElementVScrollPos(info.pos);
                }
                break;
            default:
                {
                    this._control_element.setElementVScrollPos(info.pos);
                }
                break;
        }
    };

    _pListView._on_update_onvscroll = function (obj, info)
    {
        var usecover = this.showcover;

        switch (info.type)
        {
            case "pagedown":
            case "pageup":
            case "linedown":
            case "lineup":
            case "first":
            case "firstover":
            case "last":
            case "lastover":
                if (usecover)
                {
                    this._updateItemVScrollInfo(info.pos, "pagemove", true);
                }
                else
                {
                    this._updateItemVScrollInfo(info.pos, "trackmove", false);
                }
                break;
            default:
                {
                    this._updateItemVScrollInfo(info.pos, "trackmove", false);
                }
                break;
        }
    };

    _pListView._on_change_onvscroll = function (obj, info)
    {
        this._changeItemVScrollInfo(info.pos, "trackchange", false);
    };

    _pListView._on_finish_onvscroll = function (obj, info)
    {
        /*
            스크롤동작을 거칠게 할때 _on_default_onvscroll, _on_update_onvscroll을 건너뛰고 finish로 바로 들어올수 있다.

            setElementVScrollPos을 마지막까지 수행해줘야될 필요가 있음.
        */

        switch (info.type)
        {
            case "track":
            case "trackstart":
            case "trackend":
            case "trackfirst":
            case "trackfirstover":
            case "tracklast":
            case "tracklastover":
                {
                    this._control_element.setElementVScrollPos(info.pos);
                    this._updateItemVScrollInfo(info.pos, "trackend", true);
                }
                break;
            default:
                {
                    this._updateItemVScrollInfo(info.pos, "trackend", true);
                }
                break;
        }
    };

    _pListView.set_showcover = function (v)
    {
        v = nexacro._toBoolean(v);

        if (this._p_showcover != v)
        {
            this._p_showcover = v;
            this.on_apply_showcover();
        }
    };

    _pListView.on_apply_showcover = function ()
    {
        if (!this._is_created)
            return;

        this._resetScroll(true);
        if (this._scrollmanager)
            this._scrollmanager._recalcLayout();
    };

    _pListView._onGetScrollCoverType = function ()
    {
        if (this.showcover)
        {
            return "blur";
        }
        else
        {
            return "none";
        }
    };

    _pListView._setVScrollDefaultAction = function (wheelDelta)
    {
        return nexacro.SimpleComponent.prototype._setVScrollDefaultAction.call(this, wheelDelta);
    };

    // TODO : 지원 결정후 정리
    _pListView.set_showtrack = function (v)
    {
        var _v = nexacro._toBoolean(v);

        if (this._p_showtrack != _v)
        {
            // set property value
            this._p_showtrack = _v;
            // set inner flag
            this._setUseScrollCover(this._p_showcover);
            this._setUseScrollTrack(this._p_showtrack);

            // [component.scroll:apply]           
            this.on_apply_showtrack();
        }
    };
    _pListView.on_apply_showtrack = function ()
    {
        if (!this._is_created)
            return;

        // [component.layout.items:recreaet]
        if (this._use_scrollmanager && this._scrollmanager)
            this._scrollmanager._recalcLayout();
    };
    _pListView.set_tracktype = function (v)
    {
        if (this._p_showtrack != v)
        {
            // set property value
            this._p_tracktype = v;
            // set inner flag
            this._default_scrolltracktype = [this._p_tracktype];

            // [component.scroll:apply]           
            this.on_apply_tracktype();
        }
    };
    _pListView.on_apply_tracktype = function ()
    {
        if (!this._is_created)
            return;

        // [component.layout.items:recreaet]
        if (this._use_scrollmanager && this._scrollmanager)
            this._scrollmanager._recalcLayout();
    };
    _pListView.set_trackalign = function (v)
    {
        if (this._p_showtrack != v)
        {
            // set property value
            this._p_trackalign = v;
            // set inner flag
            this._default_scrolltrackalign = [this.trackalign];

            // [component.scroll:apply]           
            this.on_apply_trackalign();
        }
    };
    _pListView.on_apply_trackalign = function ()
    {
        if (!this._is_created)
            return;

        // [component.layout.items:recreaet]
        if (this._use_scrollmanager && this._scrollmanager)
            this._scrollmanager._recalcLayout();
    };

    //===============================================================
    // nexacro.ListView : Expand
    //===============================================================

    //===============================================================
    // nexacro.ListView : Select (Single/Multi)
    //===============================================================
    _pListView._use_selector = false;               // Selector 지원시 설정
    _pListView._use_multiselector = false;          // MultiSelector 지원시 추가, 복수 Selector 처리
    _pListView._use_partsselector = false;          // PartsSelector 지원시 추가, 분할 Selector 처리

    _pListView.multiselect = false;                 // MultiSelect 지원시 추가, Ctrl Action 처리
    _pListView.rangeselect = false;                 // RangeSelect 지원시 추가, Drag Action 처리

    // Select Init
    _pListView._onInitSelect = function (selecttype, positcount, rangecount, multicount, unselvalue)
    {
        if (this._selectinfo)
        {
            if (!selecttype) selecttype = nexacro._SelectConst._p_selecttype_ITEM;
            if (!positcount) positcount = 1;
            if (!rangecount) rangecount = this.rangeselect ? 2 : 1;
            if (!multicount) multicount = this.multiselect ? -1 : 1;

            this._selectinfo._initSelect(selecttype, positcount, rangecount, multicount, unselvalue);
        }
    };

    // Select Property
    _pListView.set_multiselect = function (v)
    {
        var _v = nexacro._toBoolean(v);

        if (_v != this._p_multiselect)
        {
            this._p_multiselect = _v;

            this.on_apply_multiselect();
        }
    };

    _pListView.on_apply_multiselect = function ()
    {
        if (!this._is_created)
            return;

        this._onInitSelect();
    };

    _pListView.set_rangeselect = function (v)
    {
        var _v = nexacro._toBoolean(v);

        if (_v != this._p_rangeselect)
        {
            this._p_rangeselect = _v;

            this.on_apply_rangeselect();
        }
    };

    _pListView.on_apply_rangeselect = function ()
    {
        if (!this._is_created)
            return;

        this._onInitSelect();
    };

    // Select Method ( inner )
    _pListView.getSelect = function ()
    {
        return this._onGetCurrentSelect() || { row: this._DEFAULT_ROWINDEX, band: this._DEFAULT_SUBINDEX, cell: this._DEFAULT_CELLINDEX };
    };

    _pListView.getSelectIndex = function ()
    {
        var sel = this._onGetCurrentSelect();
        if (sel)
            return sel.row;
        else
            return this._DEFAULT_ROWINDEX;
    };

    _pListView.setSelect = function (rowidx, bandidx, cellidx)
    {
        /*
            selecttype : datarow 처리

            selectindex 유지 : arguments가 null, undefined
            selectindex 미적용 : arguments에 해당 하는 item이 없을때.
                                 dataset event 결과가 false 일때.
            selectindex 변경시 : 
            
            TODO :: selecttype : band multi, band range, 개별 band 처리
        */

        var sel = this._onGetSelectArgument(rowidx, bandidx, cellidx);

        if (this._on_rowposition_change(rowidx))
            this._onSetCurrentSelect(sel);


    };

    // Select Logical Event
    _pListView._beginChangeRowPosition = function () { return !(this.__changeRowposition ? false : this.__changeRowposition = true); };
    _pListView._finalChangeRowPosition = function () { return !(this.__changeRowposition = false); };

    _pListView._on_rowposition_change = function (itemidx, subidx, cellidx)
    {
        if (this._beginChangeRowPosition()) return;

        var ret = false;
        var binddata = this._getBindDataSet();
        if (binddata)
        {
            ret = itemidx == binddata._setRowPosition(itemidx, 51);
        }

        if (this._finalChangeRowPosition()) return ret;
    };

    // Select Basic Event
    _pListView._on_basic_onselect = function (oldvalue, newvalue)
    {
        if (this._is_created)
        {
            if (oldvalue)
            {
                this._setItemSelect(oldvalue.row, false);
                this._setItemChildSelect(oldvalue.row, oldvalue.band, oldvalue.cell, false);
            }

            if (newvalue)
            {
                this._setItemSelect(newvalue.row, true);
                this._setItemChildSelect(newvalue.row, newvalue.band, newvalue.cell, true);
            }
        }
    };

    _pListView._on_basic_onselectedchange = function (oldvalue, newvalue)
    {
        // expr 갱신을 위한 bind loop
        var item;

        var bind_data;
        var bind_count = this._getBindCount();

        for (var i = 0; i < bind_count; i++)
        {
            item = this._getItem(i);
            if (item)
            {
                bind_data = this._getBindData(i);
                this._setBindItemInfo(item, bind_data, i);
            }
        }
    };

    // Select Default Event

    // Select Fire Event
    _pListView._on_fire_onselectedchange = function (oldvalue, newvalue)
    {
        if (this.onselectchanged && this.onselectchanged._has_handlers)
        {
            var tmpband, tmpcell;
            var oldrow, oldbandid, oldcellid;
            var row, bandid, cellid;
            var selectstartrow, selectendrow;

            if (oldvalue)
            {
                tmpband = this._getCurrentBand(oldvalue.row, oldvalue.band);
                tmpcell = this._getCurrentCell(oldvalue.row, oldvalue.band, oldvalue.cell);

                oldrow = oldvalue.row;
                oldbandid = tmpband ? tmpband._band : "";
                oldcellid = tmpcell ? tmpcell.id : "";
            }

            if (newvalue)
            {
                tmpband = this._getCurrentBand(newvalue.row, newvalue.band);
                tmpcell = this._getCurrentCell(newvalue.row, newvalue.band, newvalue.cell);

                row = newvalue.row;
                bandid = tmpband ? tmpband._band : "";
                cellid = tmpcell ? tmpcell.id : "";

                selectstartrow = newvalue.row;
                selectendrow = newvalue.row;
            }

            var evt = new nexacro.ListViewSelectEventInfo(this, "onselectchanged", oldrow, oldbandid, oldcellid, row, bandid, cellid, selectstartrow, selectendrow);

            return this.onselectchanged._fireUserEvent(this, evt);
        }
        return false;
    };

    _pListView._on_fire_onselectorresize = function (obj, e)
    {
        if (this.onselectorresize && this.onselectorresize._has_handlers)
        {
            this.onselectorresize._fireEvent(this, e);
        }
        return true;
    };

    // Select Inner Logic
    _pListView._onChangeSelect = function (obj, type, oldvalue, newvalue)
    {
        this._on_basic_onselect(oldvalue, newvalue);
        this._on_fire_onselect(oldvalue, newvalue);
        this._on_default_onselect(oldvalue, newvalue);

        this._on_basic_onselectedchange(oldvalue, newvalue);
        this._on_fire_onselectedchange(oldvalue, newvalue);
        //this._on_default_onselectedchange(oldvalue, newvalue);
    };

    _pListView._onCheckSelectChange = function (oldselect, newselect)
    {
        if (typeof newselect == "object" && (typeof oldselect != typeof newselect))
            return true;

        for (var attr in newselect)
        {
            if (oldselect[attr] != newselect[attr])
                return true;
        }
        return false;
    };

    _pListView._onCheckSelectable = function ()
    {
        return this._p_useselcolor;
    };

    _pListView._onGetSelectArgument = function (rowidx, bandidx, cellidx)
    {
        /*
            Single (row) Select : {row : rowidx, band : bandidx, cell : cellidx}
            Single (band) Select : 
            Milti Select : 
            Area Select : 
        */

        var currselect = this.getSelect();

        rowidx = nexacro._isNull(rowidx) ? currselect.row : rowidx;
        bandidx = nexacro._isNull(bandidx) ? currselect.band : bandidx;
        cellidx = nexacro._isNull(cellidx) ? currselect.cell : cellidx;

        return { row: rowidx, band: bandidx, cell: cellidx };
    };

    _pListView._showItem = function (rowidx, status)
    {
        this._show_item = false;
        this._show_rowidx = -1;
        this._show_status = "";

        nexacro.ComplexComponent.prototype._showItem.call(this, rowidx, status);
    };

    _pListView._setItemSelect = function (rowidx, status, show)
    {
        if (rowidx == null)
        {
            return;
        }

        var rowcount = this._getBindCount();
        if (rowidx >= rowcount)
        {
            return;
        }

        if (rowidx.length)
        {
            //TODO : part, multi, range
        }

        if (rowidx == this._DEFAULT_ROWINDEX)
        {
            // all?
        }
        else
        {
            var item = this._getItem(rowidx);
            if (!item)
            {
                var panel = this._getPanel();
                if (panel)
                {
                    var slot = panel._getPanelSlot(rowidx);
                    var slot_pos_top = slot ? slot._getSlotCachedPos()[1] : 0;
                    var scroll_top = slot_pos_top - this._adjust_height;

                    this.scrollTo(0, scroll_top);
                }
            }
            //single
            this._setItemArraySelect(this._getItem(rowidx), status);
            if (show != false)
            {
                if (this._evt_name != "lbuttondown")
                    this._showItem(rowidx, status);
                else
                {
                    this._show_item = true;
                    this._show_rowidx = rowidx;
                    this._show_status = status;
                }
            }

        }
    };

    _pListView._setItemChildSelect = function (rowidx, bandidx, cellidx, status)
    {
        var cell = this._getItemChildByIndex(rowidx, bandidx, cellidx);
        if (cell)
        {
            cell.selected = status;
        }

        var popupcell = this._getItemChildInPopup(rowidx, bandidx, cellidx);
        if (popupcell)
        {
            popupcell.selected = status;
        }
    };

    //===============================================================
    // nexacro.ListView : Interface Logic for Grid Band/Cell
    //===============================================================
    _pListView._getDataRow = function (rowidx)
    {
        if (rowidx >= this.rowcount)
            return this._DEFAULT_ROWINDEX;

        return rowidx;
    };

    _pListView._isFakeCell = function (rowidx)
    {
        if (this.rowcount <= rowidx || rowidx < -2)
            return true;

        return false;
    };

    _pListView._getAvailableRect = function (comp)
    {
        var rect = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
        rect.left = comp._getClientLeft();
        rect.top = comp._getClientTop();
        rect.right = comp._getClientLeft() + comp._getClientWidth();
        rect.bottom = comp._getClientTop() + comp._getClientHeight();
        rect.width = comp._getClientWidth();
        rect.height = comp._getClientHeight();
        return rect;
    };

    _pListView._clearBindTypeFlag = function ()
    {
        this._is_use_bind_expr_prop.body = null;
        this._is_use_bind_expr_prop.head = null;
        this._is_use_bind_expr_prop.tail = null;
    };

    //===============================================================
    // nexacro.ListView : Interface Logic Override
    //===============================================================
    _pListView.on_apply_prop_createrowstype = function ()
    {
        var type = this._p_createrowstype;
        this._use_partitem = (type === "all") ? false : true;
    };

    _pListView.on_apply_prop_enable = function (v)
    {
        // cell 에서 enable 참조하기 위한 값.
        this._enable = v;

        // band 에 enable 상태 전파
        var items = this._getItems();
        if (!items)
        {
            return;
        }

        var count = items.length;
        if (count)
        {
            for (var i = 0; i < count; i++)
            {
                if (items[i])
                {
                    items[i]._setEnable(v);
                }
            }
        }

        // scroll 에 enable 상태 전파
        if (this._is_scrollable)
        {
            if (this._p_vscrollbar)
            {
                this._p_vscrollbar._setEnable(v);
            }
            if (this._p_hscrollbar)
            {
                this._p_hscrollbar._setEnable(v);
            }
        }
    };

    _pListView._enable = true;
    _pListView._isEnable = function ()
    {
        this._enable = nexacro.ComplexComponent.prototype._isEnable.call(this);
        return this._enable;
    };

    // [component.dlgcode:init]                     // dlgcode 설정값 변경이 필요하면 override, default는 모두 false
    _pListView._onGetDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        this._is_first_focus_band = false;

        return { want_tab: this._acceptstab, want_return: true, want_escape: true, want_chars: true, want_arrows: this._accept_arrow };
    };

    // [component.dragdrop:getdragdata]             // drag 허용시 drag data
    _pListView._onGetDragData = function ()
    {
        return this.getSelectedText();
    };

    // [component.tabstop:get]                      // Accessibility 용 별도 처리시 override
    _pListView._onGetTabstop = function ()
    {
        // [component.accessibility.tabstop:get]
        if (this._env._p_enableaccessibility)
        {
            var accessibility = this.accessibility;
            if (accessibility && accessibility._p_enable && accessibility.role == "link")
                return true;
        }
        return false;
    };

    // [component.focus:get]                        // Accessibility 용 별도 처리시 override
    _pListView._onGetFocusAcceptable = function ()
    {
        // [component.accessibility.focus:get]
        return this._env._p_enableaccessibility;
    };

    // [component.hotkey:action]                    // hotkey 기본 Action 변경시 override
    _pListView._onHotkey = function (keycode, altKey, ctrlKey, shiftKey)
    {
        // [component.hotkey:action]
        this.click();
    };

    _pListView.on_apply_prop_stringresource = function ()
    {
        if (!nexacro._StringResource)
            return;

        this._recreateContents();

        nexacro.Component.prototype.on_apply_prop_stringresource.call(this);

        this.on_apply_nodatatext(this._getStringResourceProperty(this._p_nodatatext));
    };

    _pListView._focusItem = function (index)
    {
        var item = this._getItem(index);

        if (item && item.length) item = item[0];
        if (item && item.setFocus) item.setFocus(true, true);

        this._showItem(index, true);

        this._is_listview_focus = false;
        this._is_expandbar_focus = false;
    };

    _pListView._setFocus = function (bResetScroll, calledby, block_inner_focus)
    {
        if (this._env._p_enableaccessibility)
        {
            this._accept_arrow = true;
        }
        this._acceptstab = true

        return nexacro.Component.prototype._setFocus.call(this, bResetScroll, calledby, block_inner_focus);
    };

    //===============================================================
    // nexacro.ListView : RTL/Locale (추후제공)
    //===============================================================

    // [상위 Component 처리]
    // Simple Component의 RTL/Locale은 ClientElement 대상으로만 처리
    // Basic Component에서만 처리되며 User Component에서는 별도 처리가 없다.

    // 상세 추후 추가


    // [하위 Component 처리]
    // Basic Component에서만 RTL Interface 일부 Override 처리

    // 상세 추후 추가


    //===============================================================
    // nexacro.ListView : Status
    //===============================================================
    _pListView._onResetSysStatus = function ()
    {
        this._onResetSysEnable();

        if (this._use_readonly_status)
        {
            this._onResetSysReadOnly();
        }
    };

    _pListView._onResetUserStatus = function ()
    {
        // ListView 는 select status를 사용하지 않지만, 하위 item, child가 reset이 필요함.
        if (this._use_select && this._use_selected_status)
        {
            this._onResetUserSelected();
        }
    };

    _pListView._onResetUserSelected = function ()
    {
        var i, j;
        var item;
        var items = this._getItems();
        var items_len = items.length;

        // 최초 상태일때 판단.
        var currselect = this.getSelect();
        if (currselect.row == this._DEFAULT_ROWINDEX)
        {
            // TODO : _on_rowposition_change 관련해서 중복되지 않도록 변경. 
            var rowidx = this._getBindCurrentPos();
            if (rowidx > -1)
            {
                var band, cell;
                var bandidx = -1;
                var cellidx = -1;

                item = this._getItem(rowidx);
                if (nexacro._isArray(item))
                {
                    for (i = 0; i < item.length; i++)
                    {
                        band = this._getCurrentBand(rowidx, i);
                        if (band)
                        {
                            cell = this._findEditableCell(band, 0, 1);
                            if (cell)
                            {
                                bandidx = band._itemsubidx;
                                cellidx = cell._cellidx;
                                break;
                            }
                        }
                    }

                    if (bandidx == -1)
                        bandidx = 0;
                }
                else
                {
                    band = this._getCurrentBand(rowidx, 0);
                    if (band)
                    {
                        bandidx = band._itemsubidx;

                        cell = this._findEditableCell(band, 0, 1);
                        if (cell)
                        {
                            cellidx = cell._cellidx;
                        }
                    }
                }

                if (this._env._p_enableaccessibility)
                    this._is_listview_focus = true;
                this._onSetCurrentSelect({ row: rowidx, band: bandidx, cell: cellidx });
            }

            return;
        }

        // 현재 select 상태에 맞게 status 갱신
        // TODO : multiselect
        for (i = 0; i < items_len; i++)
        {
            item = items[i];
            if (item)
            {
                if (item._rowidx == currselect.row)
                {
                    item._changeUserStatus("selected", this._onCheckSelectable() ? true : false);
                }
                else
                {
                    item._changeUserStatus("selected", false);
                }

                var children = item._getChildren();
                var children_len = children.length;
                for (j = 0; j < children_len; j++)
                {
                    var child = children[j];
                    if (child)
                    {
                        if (item._rowidx == currselect.row && item._itemsubidx == currselect.band && child._cellidx == currselect.cell)
                        {
                            child.selected = true;
                        }
                        else
                        {
                            child.selected = false;
                        }
                    }
                }
            }
        }
    };

    //===============================================================
    // nexacro.ListView : Override
    //===============================================================
    _pListView.on_update_position = function (resize_flag, move_flag, update)
    {
        nexacro.Component.prototype.on_update_position.call(this, resize_flag, move_flag, update);

        if (this._is_created)
        {
            if (resize_flag || move_flag || update)
            {
                // TODO - hscrollPos 처리
                var vscrollpos = this._getViewStartScrollPos();

                this._updateItemVScrollInfo(vscrollpos, "trackinit", true);
                this._changeItemVScrollInfo(vscrollpos, "trackinit", true);

                var cell = this._getCurrentCell();
                if (cell && cell._editor && cell._editor._isPopupVisible())
                {
                    cell._editor.on_update_position(resize_flag, move_flag, update);
                }
            }
        }
    };

    //===============================================================
    // nexacro.ListView : Property
    //===============================================================
    _pListView.onInitProperties = function ()
    {
        // Const
        this._DEFAULT_ROWINDEX = -9;
        this._DEFAULT_SUBINDEX = -1;
        this._DEFAULT_CELLINDEX = -1;

        // init interface prop
        this._acceptstab = true;
        this._accept_arrow = true;
        /*
        this._p_binddataset = null;
        this.formats = "";
        this.formatid = "";
        */

        // init component panel prop
        this._p_bandexpandtype = "expand";
        this._p_bandinitstatus = "expand";
        this._p_bandindentsize = undefined;
        // TODO : 2차
        this._p_showhead = false;
        this._p_rowfirst = false;
        this._p_arrange = "default";
        this._p_selector = "none";

        // init component prop
        this._p_autoenter = "none";
        this._p_autoupdatetype = "none";
        this._p_cellclickbound = "control";
        this._p_nodatatext = "";
        this._p_nodataimage = "";
        this._p_selectchangetype = "down";
        this._p_selectscrollmode = "default";
        this._p_selecttype = "datarow";
        this._p_useselcolor = true;

        this._initsoftkeyboard = undefined;
        this._p_usesoftkeyboard = true;

        this._p_cellcheckboxsize = undefined;
        this._p_cellcalendarbuttonsize = undefined;
        this._p_cellcombobuttonsize = undefined;
        this._p_cellmulticombobuttonsize = undefined;
        this._p_locale = "";

        // init scroll prop
        this.showcover = false;

        // init component internal variable
        this._is_popup_changed = false;

        // init component layout interface properties
        this._subgroup = nexacro._PanelConst.GROUPING_SUBSTYLE_BAND_EXPAND;
    };

    _pListView.onApplyProperties = function ()
    {
        // apply interface prop
        this.on_apply_binddataset();
        this.on_apply_formats();
        this.on_apply_formatid();
        this.on_apply_nodatatext();

        // apply component panel prop
        this.on_apply_bandexpandtype();
        this.on_apply_bandinitstatus();
        this.on_apply_bandindentsize();

        // apply scroll prop
        //this.on_apply_showcover();

        //TODO
        //this.on_apply_showhead();
        //this.on_apply_rowfirst();
        //this.on_apply_arrange();
        //this.on_apply_selector();

        // apply component select prop
        /*
        this.on_apply_multiselect();
        this.on_apply_rangeselect();
        */
    };

    _pListView.onClearProperties = function ()
    {
        // destory 과정. property 변경으로 인해 추가로 생성된 object / array 등을 추가로 제거해줘야함.
        // clear interface property
        this.on_clear_binddataset();
        this.on_clear_formats();
        this.on_clear_formatid();

        // clear component property
        /*
        this.on_clear_showhead();
        this.on_clear_bandexpandtype();
        this.on_clear_rowfirst();
        this.on_clear_arrange();
        this.on_clear_selector();
        */
        // clear component select property
        /*
        this.on_clear_multiselect();
        this.on_clear_rangeselect();
        */
        // clear component status property
        /*
        this.on_clear_readonly();
        */
    };

    _pListView.set_enableredraw = function (v)
    {
        if (v != null && this._p_enableredraw != v)
        {
            v = nexacro._toBoolean(v);
            this._p_enableredraw = v;

            if (v)
            {
                // todo format정보 갱신
                this.on_apply_enableredraw();
            }
        }
        return v;
    };

    _pListView.on_apply_enableredraw = function ()
    {
        nexacro.ComplexComponent.prototype.on_apply_enableredraw.call(this);

        // todo enableredraw 히스토리 관리?
        if (!this._is_created)
            return;

        var down_act = this._isDownActionKeyMouse();
        if (down_act && !this._is_after_recreate)
        {
            this._after_recreate = true;
            return;
        }

        // [component.layout.items:recreate]
        this._recreateItems();
    };

    _pListView.set_autoenter = function (v)
    {
        if (this._p_autoenter != v)
        {
            switch (v)
            {
                case "select":
                case "key":
                case "none":
                    this._p_autoenter = v;
                    break;
            }
        }
    };

    _pListView.set_autoupdatetype = function (v)
    {
        if (this._p_autoupdatetype != v)
        {
            switch (v)
            {
                case "none":
                case "comboselect":
                case "dateselect":
                case "itemselect":
                    this._p_autoupdatetype = v;
                    break;
            }
        }
    };

    _pListView.set_bandexpandtype = function (v)
    {
        if (this._p_bandexpandtype != v)
        {
            switch (v)
            {
                case "expand":
                case "accordion":
                case "popup":
                case "none":
                    this._p_bandexpandtype = v;
                    this._setSubgroup(v, this._p_bandinitstatus);
                    break;
            }

            this.on_apply_bandexpandtype();
        }
    };

    _pListView.on_apply_bandexpandtype = function ()
    {
        if (this._is_created)
        {
            this._recreateItems();
        }
    };

    _pListView.set_bandinitstatus = function (v)
    {
        if (this._p_bandinitstatus != v)
        {
            switch (v)
            {
                case "expand":
                case "collapse":
                    this._p_bandinitstatus = v;
                    this._setSubgroup(this._p_bandexpandtype, v);
                    break;
            }

            this.on_apply_bandinitstatus();
        }
    };

    _pListView.on_apply_bandinitstatus = function ()
    {
        if (this._is_created)
        {
            this._recreateItems();
        }
    };

    _pListView.set_bandindentsize = function (v)
    {
        if (v !== undefined && isNaN(v = +v))
            return;

        if (this._p_bandindentsize != v)
        {
            this._p_bandindentsize = v;

            this.on_apply_bandindentsize();
        }
    };

    _pListView.on_apply_bandindentsize = function ()
    {
        if (this._is_created)
        {
            this._recreateItems();
        }
    };

    _pListView.set_cellclickbound = function (v)
    {
        if (this._p_cellclickbound != v)
        {
            switch (v)
            {
                case "control":
                case "cell":
                    this._p_cellclickbound = v;
                    break;
            }
        }
    };

    _pListView.set_nodatatext = function (v)
    {
        if (this._p_nodatatext != v)
        {
            this._p_nodatatext = v;

            this.on_apply_nodatatext();
        }
    };

    _pListView.on_apply_nodatatext = function ()
    {
        if (!this._is_created)
            return;

        if (!this._formats || !this._formats._getCurrentItem())
        {
            var nullctrl = this._getItemChildById(0, "nullband", "nullctrl");
            var nullctxt = this._getCtxtData(-4);
            if (nullctrl && nullctxt)
            {
                var child;

                if (nexacro._isArray(nullctxt))
                {
                    for (var i = 0; i <= nullctxt.length; i++)
                    //for (var i in nullctxt)
                    {
                        if (nullctxt[i])
                        {
                            child = nullctxt[i]._items[0];
                            if (child)
                            {
                                child["text"] = this._getStringResourceProperty(this._p_nodatatext);

                                if (child._setts["text"]) 
                                {
                                    child._setts["text"].call(nullctrl, this._getStringResourceProperty(this._p_nodatatext));
                                }
                            }
                        }
                    }
                }
                else
                {
                    child = nullctxt._items[0];
                    if (child)
                    {
                        child["text"] = this._getStringResourceProperty(this._p_nodatatext);

                        if (child._setts["text"])
                        {
                            child._setts["text"].call(nullctrl, this._getStringResourceProperty(this._p_nodatatext));
                        }
                    }
                }
            }

        }
        else
        {
            this.setCellProperty("null", "nullctrl", "text", this._getStringResourceProperty(this._p_nodatatext));
        }
    };

    _pListView.set_nodataimage = function (v)
    {
        if (this._p_nodataimage != v)
        {
            this._p_nodataimage = v;

            this.on_apply_nodataimage();
        }
    };

    _pListView.on_apply_nodataimage = function ()
    {
        if (!this._is_created)
            return;

        if (!this._formats || !this._formats._getCurrentItem())
        {
            var nullctrl = this._getItemChildById(0, "nullband", "nullctrl");
            var nullctxt = this._getCtxtData(-4);
            if (nullctrl && nullctxt)
            {
                var child;

                if (nexacro._isArray(nullctxt))
                {
                    for (var i in nullctxt)
                    {
                        if (!nullctxt.hasOwnProperty(i)) continue;
                        child = nullctxt[i]._items[0];
                        if (child)
                        {
                            child["background"] = "transparent " + this._p_nodataimage + " center center no-repeat";

                            if (child._setts["background"])
                                child._setts["background"].call(nullctrl, child["background"]);
                        }
                    }
                }
                else
                {
                    child = nullctxt._items[0];
                    if (child)
                    {
                        child["background"] = "transparent " + this._p_nodataimage + " center center no-repeat";

                        if (child._setts["background"])
                            child._setts["background"].call(nullctrl, child["background"]);
                    }
                }
            }

        }
        else
        {
            this.setCellProperty("null", "nullctrl", "background", "transparent " + this._p_nodataimage + " center center no-repeat");
        }
    };

    _pListView.set_selectchangetype = function (v)
    {
        if (this._p_selectchangetype != v)
        {
            switch (v)
            {
                case "down":
                case "up":
                    this._p_selectchangetype = v;
                    break;
            }
        }
    };

    _pListView.set_selectscrollmode = function (v)
    {
        switch (v)
        {
            case "select":
            case "scroll":
                this._selectscrollmode = this._p_selectscrollmode = v;
                break;
            case "default":
                this._p_selectscrollmode = v;
                this._selectscrollmode = (nexacro._isTouchInteraction) ? "scroll" : "select";
                break;
        }
    };

    _pListView.set_selecttype = function (v)
    {
        /*
            case "band":
            case "area":
            case "multirow":
            case "multicell":
            case "multiarea":
            case "treecell":
            case "multitreecell":
        */

        var type_enum = ["datarow"];
        if (type_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_selecttype != v)
        {
            this._p_selecttype = v;
        }
    };

    _pListView.set_useselcolor = function (v)
    {
        v = nexacro._toBoolean(v);

        if (this._p_useselcolor != v)
        {
            this._p_useselcolor = v;

            this.on_apply_useselcolor();
        }
    };

    _pListView.on_apply_useselcolor = function ()
    {
        if (!this._is_created)
            return;

        this._onResetUserSelected();
    };

    _pListView.set_usesoftkeyboard = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_usesoftkeyboard != v)
        {
            this._p_usesoftkeyboard = v;

            if (!this._initsoftkeyboard)
                this._initsoftkeyboard = true;
        }
    };

    _pListView.set_cellcheckboxsize = function (v)
    {
        if (v != this._p_cellcheckboxsize)
        {
            this._p_cellcheckboxsize = v;
            this.on_apply_cellcheckboxsize();
        }
    };

    _pListView.on_apply_cellcheckboxsize = function ()
    {
        if (!this._is_created)
            return;

        this._recreateItems();
    };

    _pListView.set_cellcalendarbuttonsize = function (v)
    {
        if (v != this._p_cellcalendarbuttonsize)
        {
            this._p_cellcalendarbuttonsize = v;
            this.on_apply_cellcalendarbuttonsize();
        }
    };

    _pListView.on_apply_cellcalendarbuttonsize = function ()
    {
        if (!this._is_created)
            return;

        this._recreateItems();
    };

    _pListView.set_cellcombobuttonsize = function (v)
    {
        if (v != this._p_cellcombobuttonsize)
        {
            this._p_cellcombobuttonsize = v;
            this.on_apply_cellcombobuttonsize();
        }
    };

    _pListView.on_apply_cellcombobuttonsize = function ()
    {
        if (!this._is_created)
            return;

        this._recreateItems();
    };

    _pListView.set_cellmulticombobuttonsize = function (v)
    {
        if (v != this._p_cellmulticombobuttonsize)
        {
            this._p_cellmulticombobuttonsize = v;
            this.on_apply_cellmulticombobuttonsize();
        }
    };

    _pListView.on_apply_cellmulticombobuttonsize = function ()
    {
        if (!this._is_created)
            return;

        this._recreateItems();
    };

    _pListView.set_locale = function (v)
    {
        if (v != this._p_locale)
        {
            this._p_locale = v;
            this._locale = v;
            this.on_apply_locale(v);
        }
    };

    _pListView.on_apply_locale = function (v)
    {
        if (!this._is_created)
            return;

        this._recreateItems();
    };

    _pListView.set_cellcalendarpopuptype = function (v)
    {
        if (v != this._p_cellcalendarpopuptype)
        {
            this._p_cellcalendarpopuptype = v;
            this.on_apply_cellcalendarpopuptype();
        }
    };

    _pListView.on_apply_cellcalendarpopuptype = function ()
    {
        this._recreateItems();
    };

    _pListView.set_cellcombopopuptype = function (v)
    {
        if (v != this._p_cellcombopopuptype)
        {
            this._p_cellcombopopuptype = v;
            this.on_apply_cellcombopopuptype();
        }
    };

    _pListView.on_apply_cellcombopopuptype = function ()
    {
        this._recreateItems();
    };

    _pListView.set_cellmulticombopopuptype = function (v)
    {
        if (v != this._p_cellmulticombopopuptype)
        {
            this._p_cellmulticombopopuptype = v;
            this.on_apply_cellmulticombopopuptype();
        }
    };

    _pListView.on_apply_cellmulticombopopuptype = function ()
    {
        this._recreateItems();
    };

    _pListView.set_cellcalendarpopupsize = function (v)
    {
        if (v != this._p_cellcalendarpopupsize)
        {
            this._p_cellcalendarpopupsize = v;
            this.on_apply_cellcalendarpopupsize();
        }
    };

    _pListView.on_apply_cellcalendarpopupsize = function ()
    {
        this._recreateItems();
    };

    _pListView.set_cellcombopopupsize = function (v)
    {
        if (v != this._p_cellcombopopupsize)
        {
            this._p_cellcombopopupsize = v;
            this.on_apply_cellcombopopupsize();
        }
    };

    _pListView.on_apply_cellcombopopupsize = function ()
    {
        this._recreateItems();
    };

    _pListView.set_cellmulticombopopupsize = function (v)
    {
        if (v != this._p_cellmulticombopopupsize)
        {
            this._p_cellmulticombopopupsize = v;
            this.on_apply_cellmulticombopopupsize();
        }
    };

    _pListView.on_apply_cellmulticombopopupsize = function ()
    {
        this._recreateItems();
    };

    // TODO : 이하 2차구현 대상
    _pListView.set_showhead = function (v)
    {
        v = nexacro._toBoolean(v);

        if (this._p_showhead != v)
        {
            // set property value
            this._p_showhead = v;

            // apply property value
            this.on_apply_showhead();
        }
    };

    _pListView.on_apply_showhead = function ()
    {
        if (!this._is_created)
            return;

        // [component.layout.items:recreate]
        this._recreateItems();
    };

    _pListView.set_rowfirst = function (v)
    {
        v = nexacro._toBoolean(v);

        if (this._p_rowfirst != v)
        {
            // set property value
            this._p_rowfirst = v;

            if (v)
                this._rowfirst = nexacro._PanelConst.SLOT_ARRANGETYPE_ROWFIRST;
            else
                this._rowfirst = nexacro._PanelConst.SLOT_ARRANGETYPE_COLFIRST;

            // apply property value
            this.on_apply_rowfirst();
        }
    };

    _pListView.on_apply_rowfirst = function ()
    {
        if (!this._is_created)
            return;

        // [component.layout.items:recreate]
        this._recreateItems();
    };

    _pListView.set_arrange = function (v)
    {
        if (v && v != this._p_arrange)
        {
            // set property value
            this._p_arrange = v;

            var arr = this._p_arrange ? this._p_arrange.split(",") : [];

            for (var i = 0, l = arr.length; i < l; i++)
            {
                switch (arr[i])
                {
                    case "horzlead": this._arrange |= nexacro._PanelConst.SLOT_ARRANGETYPE_HORZLEAD; break;
                    case "horztail": this._arrange |= nexacro._PanelConst.SLOT_ARRANGETYPE_HORZTAIL; break;
                    case "horzmiddle": this._arrange |= nexacro._PanelConst.SLOT_ARRANGETYPE_HORZAMID; break;
                    case "horzinvert": this._arrange |= nexacro._PanelConst.SLOT_ARRANGETYPE_HORZINVT; break;
                    case "horzaround": this._arrange |= nexacro._PanelConst.SLOT_ARRANGETYPE_HORZARND; break;
                    case "horzgapped": this._arrange |= nexacro._PanelConst.SLOT_ARRANGETYPE_HORZGAPD; break;
                    case "vertlead": this._arrange |= nexacro._PanelConst.SLOT_ARRANGETYPE_VERTLEAD; break;
                    case "verttail": this._arrange |= nexacro._PanelConst.SLOT_ARRANGETYPE_VERTTAIL; break;
                    case "vertmiddle": this._arrange |= nexacro._PanelConst.SLOT_ARRANGETYPE_VERTAMID; break;
                    case "vertinvert": this._arrange |= nexacro._PanelConst.SLOT_ARRANGETYPE_VERTINVT; break;
                    case "vertaround": this._arrange |= nexacro._PanelConst.SLOT_ARRANGETYPE_VERTARND; break;
                    case "vertgapped": this._arrange |= nexacro._PanelConst.SLOT_ARRANGETYPE_VERTGAPD; break;
                }
            }

            // apply property value
            this.on_apply_arrange();
        }
    };

    _pListView.on_apply_arrange = function ()
    {
        if (!this._is_created)
            return;

        // [component.layout.items:recreate]
        this._recreateItems();
    };

    _pListView.set_selector = function (v)
    {
        if (v && v != this._p_selector)
        {
            // set property value
            this._p_selector = v;

            var arr = this._p_selector ? this._p_selector.split(",") : [];

            for (var i = 0, l = arr.length; i < l; i++)
            {
                switch (arr[i])
                {
                    case "line": this._selector |= nexacro._PanelSelectConst.TYPE_LINE; break;
                    case "area": this._selector |= nexacro._PanelSelectConst.TYPE_AREA; break;
                    case "resizer": this._selector |= nexacro._PanelSelectConst.ACT_RESIZER; break;
                    case "pointer": this._selector |= nexacro._PanelSelectConst.ACT_POINTER; break;
                    case "carrier": this._selector |= nexacro._PanelSelectConst.ACT_CARRIER; break;
                    case "horz": this._selector |= nexacro._PanelSelectConst.DIR_HORZ; break;
                    case "vert": this._selector |= nexacro._PanelSelectConst.DIR_VERT; break;
                    case "inner": this._selector |= nexacro._PanelSelectConst.ALIGN_INNER; break;
                    case "outer": this._selector |= nexacro._PanelSelectConst.ALIGN_OUTER; break;
                    case "middle": this._selector |= nexacro._PanelSelectConst.ALIGN_MIDDL; break;
                    case "parts": this._use_selector = true; this._use_partsselector = true; break;
                    case "multi": this._use_selector = true; this._use_multiselector = true; break;
                    case "none": this._use_selector = false; break;
                }
            }

            // apply property value
            this.on_apply_selector();
        }
    };

    _pListView.on_apply_selector = function ()
    {
        if (!this._is_created)
            return;

        // [component.layout.panel._p_selector:init]               
        var panel = this._getPanel();

        if (panel)
            panel._setSlotSelectorType(this._selector);

        // [component.layout._p_selector:recreate]
        this._recreateSelector();
    };

    //===============================================================
    // nexacro.ListView : Methods
    //===============================================================
    _pListView.set_createrowstype = function (type)
    {
        type = type ? type.toString() : "";
        if (type !== this._p_createrowstype)
        {
            switch (type)
            {
                case "auto":
                case "all":
                    this._p_createrowstype = type;
                    break;
                default:
                    this._p_createrowstype = "auto";
                    break;
            }

            this.on_apply_prop_createrowstype();
        }
    };

    // Dataset Method
    _pListView.getBindDataset = function ()
    {
        return this._getBindDataSet();
    };

    _pListView.setBindDataset = function (objDataset)
    {
        return this.set_binddataset(objDataset);
    };

    // Format Method
    _pListView.createFormat = function ()
    {
        return this.set_formats(this.makeFormatString());
    };

    _pListView.getCurFormatString = function (bOriginal)
    {
        if (this._formats)
        {
            if (bOriginal)
            {
                return this._formats._getFormatsStringFromXml(this.formats, this.formatid);
            }
            else
            {
                return this._formats._getFormatsStringFromContext(this.formatid);
            }
        }
        return "";
    };

    _pListView.getFormatString = function ()
    {
        return this.formats;
    };

    _pListView.setFormat = function (id)
    {
        this.set_formatid(id);

        return this._formats ? !this._formats._isInvalid() : false;
    };

    _pListView.makeFormatString = function ()
    {
        var _makeFormatStringByCol = function (type, name, colinfo, bindable, l, t, w, h, r, b)
        {
            var fmt = "<" + type + " id=\"" + name + "\"";

            if (l != null) fmt += " left=\"" + l + "\"";
            if (r != null) fmt += " right=\"" + r + "\"";
            if (t != null) fmt += " top=\"" + t + "\"";
            if (b != null) fmt += " bottom=\"" + b + "\"";
            if (w != null) fmt += " width=\"" + w + "\"";
            if (h != null) fmt += " height=\"" + h + "\"";

            if (bindable)
            {
                fmt += " text=\"bind:" + colinfo.id + "\"";
            }
            else
            {
                fmt += " text=\"" + colinfo.id + "\"";
            }
            fmt += "/>";

            return fmt;
        };

        var ret = "";

        var formats = this._formats;
        var data = this._databind;
        if (formats && data)
        {
            ret += "<Formats>";
            ret += "<Format id=\"" + formats._default_id + "\">";

            var bandformat = "";
            var cellformat = "";

            var colinfos = data._getBindDataSetColInfos();
            if (colinfos)
            {
                var bandtype = "Band";
                var celltype = "Cell";

                var l = 0;
                var t = 5;

                var contents_h = 24;

                var label_gap = 10;
                var editor_gap = 5;
                var line_gap = 5;

                var label_w = 120;
                var editor_w = label_w * 1.5;
                var contents_w = label_gap + label_w + editor_gap + editor_w;

                var target_w = this._adjust_width;
                //var target_h = this._adjust_height;

                var colinfo, cellname, labelname;
                var cellcnt = 0;
                for (var i = 0; i < colinfos.length; i++)
                {
                    colinfo = colinfos[i];
                    labelname = cellcnt < 10 ? celltype + "0" + cellcnt : celltype + cellcnt;
                    cellcnt++;
                    cellname = cellcnt < 10 ? celltype + "0" + cellcnt : celltype + cellcnt;
                    cellcnt++;

                    // LabelCell Contents ( nobind )
                    if (i > 0)
                    {
                        // first contents set은 무조건 보장. 그뒤의 contents set은 붙여그릴지 밑으로 갈지 결정.
                        if (l + contents_w >= target_w)
                        {
                            l = label_gap;
                            t += contents_h + line_gap;
                        }
                        else
                        {
                            l += label_gap;
                        }
                    }
                    else
                    {
                        l += label_gap;
                    }

                    cellformat += _makeFormatStringByCol(celltype, labelname, colinfo, false, l, t, label_w, contents_h, null, null);

                    // EditorCell Contents
                    l += label_w + editor_gap;

                    cellformat += _makeFormatStringByCol(celltype, cellname, colinfo, true, l, t, editor_w, contents_h, null, null);

                    l += editor_w;
                }

                bandformat = "<" + bandtype + " id=\"body\" width=\"100%\" height=\"" + (t + contents_h + line_gap) + "\">";

                ret += bandformat;
                ret += cellformat;
                ret += "</" + bandtype + ">";
            }

            ret += "</Format>";
            ret += "</Formats>";
        }

        return ret;
    };

    _pListView.getFormatIdList = function ()
    {
        if (!this._formats || !this._formats._format_items)
            return [];

        var list = [];
        for (var formatid in this._formats._format_items)
        {
            list.push(formatid);
        }
        return list;
    };

    // Head Method
    _pListView.getHeadValue = nexacro._emptyFn;

    // Band Method
    _pListView.getBandProperty = function (bandid, propid)
    {
        return this._formats ? this._formats._getBandProperty(bandid, propid) : undefined;
    };

    _pListView.setBandProperty = function (bandid, propid, propval)
    {
        if (!this._formats || !this._formats._setBandProperty(bandid, propid, propval))
            return false;

        this._resetBindInfo();
        this._recreateItems();

        return true;
    };

    // Cell Method
    _pListView.getCellCount = function (bandid)
    {
        return this._formats ? this._formats._getBandChildCount(bandid) : 0;
    };

    _pListView.getCellProperty = function (bandid, cellid, propid)
    {
        if (!this._formats)
            return;

        //      return this._formats ? this._formats._getBandChildProperty(bandid, cellid, propid) : undefined;       ??
        return this._getCellinfo(bandid, cellid, propid);
    };

    _pListView.setCellProperty = function (bandid, cellid, propid, propval)
    {
        if (propid == "id") // 동적설정 허용안함.
            return false;

        if (!this._formats || !this._formats._setBandChildProperty(bandid, cellid, propid, propval))
            return false;

        this._resetBindInfo();

        if (!this._changeCellInfo(bandid, cellid, propid, propval))
            return false;

        this._recreateItems();

        return true;
    };

    _pListView.getCellRect = function (rowindex, bandid, cellid)
    {
        rowindex = parseInt(rowindex);

        var rect = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };

        var child = this._getItemChildById(rowindex, bandid, cellid);
        if (child)
        {
            var subindex = child._bandidx;
            var base = this._onGetItemRect(rowindex, subindex, null, true);

            rect.left = child.getOffsetLeft() + base.left;
            rect.top = child.getOffsetTop() + base.top;
            rect.right = child.getOffsetRight() + base.left;
            rect.bottom = child.getOffsetBottom() + base.top;
            rect.width = rect.right - rect.left;
            rect.height = rect.bottom - rect.top;
        }

        return rect;
    };

    _pListView.getCellText = function (rowindex, bandid, cellid)
    {
        var cell = this._getItemChildById(rowindex, bandid, cellid);
        if (cell)
        {
            if (cell._getCellText)
                return cell._getCellText();
            else
                return cell._p_text;
        }
    };

    _pListView.getCellValue = function (rowindex, bandid, cellid)
    {
        var cell = this._getItemChildById(rowindex, bandid, cellid);
        if (cell)
        {
            if (cell._getCellValue)
                return cell._getCellValue();
            else
                return cell._p_value;
        }
    };

    _pListView.redrawExprCell = function (band)
    {
        var item, i;

        if (!band)
        {
            var bind_count = this._getBindCount();
            for (i = 0; i < bind_count; i++)
            {
                item = this._getItem(i);
                if (item)
                {
                    this._updateItem(item, i, undefined);
                }
            }
        }
        else
        {
            var bandseq;
            switch (band)
            {
                case "body":
                    bandseq = 0;
                    break;
                case "detail":
                    bandseq = 1;
                    break;
            }

            if (bandseq != undefined)
            {
                var items = this._getItems();
                for (i = 0; i < items.length; i++)
                {
                    item = items[i];
                    if (bandseq == this._formats._getBandSeq(item.id))
                    {
                        this._updateItem(item, item._rowidx, undefined, bandseq);
                    }
                }
            }
        }
    };

    // Cell Editor Method
    _pListView.getCurEditType = function ()
    {
        var currselect = this.getSelect();
        var cell = this._getItemChildByIndex(currselect.row, currselect.band, currselect.cell);
        if (cell)
        {
            if (cell._getCellEditType)
                return cell._getCellEditType();
        }
    };

    _pListView.showEditor = function (show)
    {
        // check first
        if (this._p_readonly)
            return false;

        var currselect = this.getSelect();
        var cell = this._getItemChildByIndex(currselect.row, currselect.band, currselect.cell);

        // check second
        if (cell)
        {
            if (cell._hasEditor())
            {
                if (show === undefined)
                    show = true;
                else
                    show = nexacro._toBoolean(show);

                // check third
                if (cell._isShowEditor() == show)
                    return false;

                if (show)
                {
                    if (cell._showEditor)
                        cell._showEditor();
                }
                else
                {
                    if (cell._hideEditor)
                        cell._hideEditor();
                }

                return true;
            }
            else
            {
                var edittype = cell._refinfo._getEdittype(currselect.row);
                if (edittype == "checkbox")
                {


                    return true;
                }
            }
        }

        return false;
    };

    // Cell Focus Method
    _pListView.moveToNextCell = function ()
    {
        var beforeselect = this.getSelect();

        this._selectItemKeyInfo(nexacro.Event.KEY_TAB, false, false, false);

        var afterselect = this.getSelect();

        if (beforeselect.row != afterselect.row || beforeselect.band != afterselect.band || beforeselect.cell != afterselect.cell)
        {
            return true;
        }

        return false;
    };

    _pListView.moveToPrevCell = function ()
    {
        var beforeselect = this.getSelect();

        this._selectItemKeyInfo(nexacro.Event.KEY_TAB, false, false, true);

        var afterselect = this.getSelect();

        if (beforeselect.row != afterselect.row || beforeselect.band != afterselect.band || beforeselect.cell != afterselect.cell)
        {
            return true;
        }

        return false;
    };

    _pListView.setCellPos = function (bandid, cellid)
    {
        var currselect = this.getSelect();
        var cell = this._getItemChildById(currselect.row, bandid, cellid);
        if (cell && cell._isEnable() && cell.setFocus())
        {
            return true;
        }

        return false;
    };

    // Expand Method
    _pListView.hideDetailBand = function (rowindex)
    {
        var panel = this._getPanel();
        var slot = panel ? panel._getPanelSlot(rowindex) : null;
        if (slot)
        {
            var bandstatus = slot._getSlotStatusBand();

            this._setPanelBandCollapse(rowindex);

            if (bandstatus != (bandstatus = slot._getSlotStatusBand()))
            {
                this._on_fire_onbandstatuschanged(rowindex, bandstatus, this, this);
            }

            var items = this._getItem(rowindex);
            if (items)
            {
                if (nexacro._isArray(items))
                {
                    for (var i = 0; i < items.length; i++)
                    {
                        items[i]._resetStatus();
                    }
                }
                else
                {
                    items._resetStatus();
                }
            }
        }
    };

    _pListView.showDetailBand = function (rowindex)
    {
        var panel = this._getPanel();
        var slot = panel ? panel._getPanelSlot(rowindex) : null;
        if (slot)
        {
            var bandstatus = slot._getSlotStatusBand();

            if (this._p_bandexpandtype == "popup")
            {
                this._setPanelBandPopup(rowindex);
            }
            if (this._p_bandexpandtype == "expand" || this._p_bandexpandtype == "accordion")
            {
                this._setPanelBandExpand(rowindex);
            }

            if (bandstatus != (bandstatus = slot._getSlotStatusBand()))
            {
                this._on_fire_onbandstatuschanged(rowindex, bandstatus, this, this);
            }

            var items = this._getItem(rowindex);
            if (items)
            {
                if (nexacro._isArray(items))
                {
                    for (var i = 0; i < items.length; i++)
                    {
                        items[i]._resetStatus();
                    }
                }
                else
                {
                    items._resetStatus();
                }
            }
        }
    };

    _pListView.getBandExpandStatus = function (rowindex)
    {
        var panel = this._getPanel();
        var slot = panel ? panel._getPanelSlot(rowindex) : null;
        if (slot)
        {
            var stats = slot._getSlotStatusBand();
            if (stats == nexacro._PanelSlotConst.STATUS_NONE || stats == nexacro._PanelSlotConst.STATUS_EXPAND || stats == nexacro._PanelSlotConst.STATUS_POPUP)
            {
                return true;
            }
        }

        return false;
    };

    // dropdown Method
    _pListView.dropdownCalendar = function ()
    {
        var cell = this._getCurrentCell();

        if (cell == null)
            return false;

        var editor = cell._editor;

        if (editor && editor._p_visible == true && editor._type_name == "CalendarControl")
        {
            editor.dropdown();
            return true;
        }
        return false;
    };

    _pListView.dropdownCombo = function ()
    {
        var cell = this._getCurrentCell();

        if (cell == null)
            return false;

        var editor = cell._editor;

        if (editor && editor._p_visible == true && editor._type_name == "ComboControl")
        {
            editor.dropdown();
            return true;
        }
        return false;
    };

    _pListView.dropdown = function ()
    {
        var cell = this._getCurrentCell();

        if (cell == null)
            return false;

        var editor = cell._editor;

        if (editor && editor._p_visible == true && editor.dropdown)
        {
            editor.dropdown();
            return true;
        }
        return false;
    };

    _pListView.isDropdownCalendar = function ()
    {
        var cell = this._getCurrentCell();

        if (cell == null)
            return false;

        var editor = cell._editor;

        if (editor && editor._p_visible == true && editor._type_name == "CalendarControl")
        {
            return editor.isDropdown();
        }
        return false;
    };

    _pListView.isDropdownCombo = function ()
    {
        var cell = this._getCurrentCell();

        if (cell == null)
            return false;

        var editor = cell._editor;

        if (editor && editor._p_visible == true && editor._type_name == "ComboControl")
        {
            return editor.isDropdown();
        }
        return false;
    };

    _pListView.isDropdown = function ()
    {
        var cell = this._getCurrentCell();

        if (cell == null)
            return false;

        var editor = cell._editor;

        if (editor && editor._p_visible == true && editor.isDropdown)
        {
            return editor.isDropdown();
        }
        return false;
    };

    // Edit Method
    _pListView.setEditSelect = function (nBegin, nEnd)
    {
        var cell = this._getCurrentCell();

        if (cell == null)
            return false;

        var editor = cell._editor;

        if (!editor)
            return false;

        if (nBegin == -1)
        {
            editor.setSelect(0, 0);
            return true;
        }
        else
        {
            if (editor.setSelect)
                return editor.setSelect(nBegin, nEnd);
        }
        return false;
    };

    _pListView.getEditCaret = function ()
    {
        var cell = this._getCurrentCell();

        if (cell == null)
            return -1;

        if (cell._editor)
        {
            var editComp = cell._editor;
            if (editComp && editComp.getCaretPos)
            {
                return editComp.getCaretPos();
            }
        }
        return -1;
    };

    _pListView.getEditSelect = function ()
    {
        var cell = this._getCurrentCell();

        if (cell == null)
            return;

        var editComp = cell._editor;

        if (editComp && editComp.getSelect)
        {
            return editComp.getSelect();
        }
        return;
    };

    _pListView.getEditSelectedText = function ()
    {
        var cell = this._getCurrentCell();

        if (cell == null)
            return "";

        var editComp = cell._editor;

        if (editComp && editComp.getSelectedText)
        {
            return editComp.getSelectedText();
        }
        return "";
    };

    _pListView.getEditText = function ()
    {
        var cell = this._getCurrentCell();

        if (cell == null)
            return;

        if (cell._editor)
        {
            var editComp = cell._editor;
            if (editComp)
            {
                return editComp._p_text;
            }
        }
        return;
    };

    _pListView.getEditingText = function ()
    {
        var cell = this._getCurrentCell();

        if (cell == null)
            return;

        if (cell._editor)
        {
            var editComp = cell._editor;
            if (editComp)
            {
                return editComp._getEditingText();
            }
        }
    };

    _pListView.getEditValue = function ()
    {
        var cell = this._getCurrentCell();

        if (cell == null)
            return;

        if (cell._editor)
        {
            var editComp = cell._editor;
            if (editComp)
            {
                return editComp._p_value;
            }
        }
    };

    _pListView.getEditingValue = function ()
    {
        var cell = this._getCurrentCell();

        if (cell == null)
            return;

        if (cell._editor)
        {
            var editComp = cell._editor;
            if (editComp)
            {
                return editComp._getEditingValue();
            }
        }
    };

    _pListView.setEditValue = function (value)
    {
        var cell = this._getCurrentCell();

        if (cell == null)
            return;

        if (cell._editor)
        {
            var editComp = cell._editor;
            if (editComp)
            {
                return editComp.set_value(value);
            }
        }
    };

    _pListView.setEditingValue = function (value)
    {
        var cell = this._getCurrentCell();

        if (cell == null)
            return;

        if (cell._editor)
        {
            var editComp = cell._editor;
            if (editComp)
            {
                return editComp._setEditingValue(value);
            }
        }
    };

    // DatasetRow Method
    _pListView.getDatasetRow = function (nRowIndex)
    {
        if (nRowIndex >= 0)
        {
            if (this.rowcount > nRowIndex)
                return nRowIndex;
        }
        return -1;
    };

    _pListView.getSelectedRows = function ()
    {
        var selects = this.getSelect();

        // TODO : MultiSelect
        // TODO : dataset row -> listview row
        var selrow = selects.row;
        var retn = [];

        if (selrow > -1)
        {
            retn.push(selrow);
        }

        return retn;
    };
    /*
    _pListView.getSelectedDatasetRows = function ()
    {
        var selects = this.getSelect();

        // TODO : MultiSelect
        var selrow = selects.row;
        var retn = [];

        retn.push(selrow);
        
        return retn;
    };
    */
    // Cell Method
    _pListView.getBindCellId = function (enumBand, strColID)
    {
        var format = this._formats;
        var formatitems = format ? format._getItem() : null;
        if (!formatitems || !strColID)
            return "";

        enumBand = enumBand.toLowerCase();
        var bindCells = formatitems._getBinds();
        if (bindCells)
        {
            var i, cellinfo;
            var bindCells_len = bindCells.length;

            for (i = 0; i < bindCells_len; i++)
            {
                cellinfo = bindCells[i];

                if (cellinfo.baseid == enumBand && cellinfo.bindid == strColID)
                {
                    return cellinfo.target[0]; // cellid (String)
                }
            }
            // TODO : "head" & "tail"
        }

        return "";
    };

    // Select Method
    _pListView.clearSelect = function ()
    {
        var sel = this._onGetSelectArgument(this._DEFAULT_ROWINDEX, this._DEFAULT_SUBINDEX, this._DEFAULT_CELLINDEX);

        this._onSetCurrentSelect(sel);
    };

    _pListView.selectRow = function (row, bSelect)
    {
        // TODO : MultiSelect
        // setSelect / clearSelect 는 row, band, cell 중 어떤값이 변경될지 알수 없음.
        row = parseInt(row);
        if (isNaN(row) || row < 0 || row > this.rowcount)
            return false;

        var currselect = this.getSelect();
        bSelect = (bSelect === undefined) ? true : bSelect;

        if (bSelect)
        {
            if (currselect.row == row)
                return false;

            this.setSelect(row, currselect.band, currselect.cell);

            currselect = this.getSelect();
            if (currselect.row == row)
                return true;
        }
        else
        {
            if (currselect.row != row)
                return false;

            this.clearSelect();

            currselect = this.getSelect();
            if (currselect.row != row)
                return true;
        }

        return false;
    };

    //===============================================================
    // nexacro.ListView : Events
    //===============================================================
    // Event init
    _pListView._initEvents = function ()
    {
        nexacro.ComplexComponent.prototype._initEvents.call(this);

        this._event_list["onheadclick"] = 1;
        this._event_list["onbandclick"] = 1;
        this._event_list["onnodataareaclick"] = 1;
        this._event_list["onheaddblclick"] = 1;
        this._event_list["onbanddblclick"] = 1;
        this._event_list["onnodataareadblclick"] = 1;
        this._event_list["oncellclick"] = 1;
        this._event_list["oncelldblclick"] = 1;
        this._event_list["oncellexpandclick"] = 1;
        this._event_list["onbandexpandclick"] = 1;
        this._event_list["oncellexpand"] = 1;
        this._event_list["onbandexpand"] = 1;
        this._event_list["onselectchanged"] = 1;
        this._event_list["onbandstatuschanged"] = 1;
        this._event_list["onselectorresize"] = 1;
        this._event_list["ondropdown"] = 1;
        this._event_list["oncloseup"] = 1;
        this._event_list["onenterdown"] = 1;
        this._event_list["oncellimeaction"] = 1;
    };

    // Item notify
    _pListView.on_notify_band_onclick = function (obj, e)
    {
        // TODO: Action / Action Control Syntax 정리 --> Scoket Interface 정리시 정리
        // TODO: 아래 Argument들을 얻는 부분은 EventInfo Property에서 처리되도록 일괄 정리

        var item = this._getActionItem(e);
        var itemindex = this._getItemIndex(item);
        var itemsubindex = this._getItemSubIndex(item);
        var itembandid = this._getItemId(item);
        var itemcell = this._getActionItemCell(e);
        var itemcellid = item ? item._getChildId(itemcell) : "";
        var itemcellindex = item ? item._findChildIndex(itemcell) : this._DEFAULT_CELLINDEX;

        var showEditclick = false;
        if (!(itemcell instanceof nexacro._ListViewCellControl))
        {
            obj = itemcell;
            while (obj && !(obj instanceof nexacro._ListViewBandControl))
            {
                if (obj.parent instanceof nexacro._ListViewCellControl)
                {
                    if (obj._displaymode == false && !obj._clickevt_able)
                    {
                        showEditclick = true;
                    }

                    itemcell = obj.parent;
                    itemcellid = item ? item._getChildId(itemcell) : "";
                    itemcellindex = item ? item._findChildIndex(itemcell) : this._DEFAULT_CELLINDEX;
                    break;
                }

                obj = obj.parent;
            }
        }

        this._actionSelectItem(itemindex, itemsubindex, itemcellindex, "bandclick");

        if (!showEditclick)
        {
            this.on_fire_onclick(e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.fromobject, e.fromreferenceobject, e.metakey, itemindex, itembandid, itemcellid, itemcell, e.clickitem || "");
        }
    };

    _pListView.on_notify_band_ondblclick = function (obj, e)
    {
        var item = this._getActionItem(e);
        var itemindex = this._getItemIndex(item);
        //var itemsubindex = this._getItemSubIndex(item);
        var itembandid = this._getItemId(item);
        var itemcell = this._getActionItemCell(e);
        var itemcellid = item ? item._getChildId(itemcell) : "";
        //var itemcellindex = item ? item._findChildIndex(itemcell) : this._DEFAULT_CELLINDEX;

        var showEditclick = false;
        if (!(itemcell instanceof nexacro._ListViewCellControl))
        {
            obj = itemcell;
            while (obj && !(obj instanceof nexacro._ListViewBandControl))
            {
                if (obj.parent instanceof nexacro._ListViewCellControl)
                {
                    if (obj._displaymode == false && !obj._clickevt_able)
                    {
                        showEditclick = true;
                    }

                    itemcell = obj.parent;
                    itemcellid = item ? item._getChildId(itemcell) : "";
                    break;
                }

                obj = obj.parent;
            }
        }

        if (showEditclick == false)
        {
            this.on_fire_ondblclick(e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.fromobject, e.fromobject, e.metakey, itemindex, itembandid, itemcellid, itemcell, e.clickitem || "");
        }
    };

    _pListView.on_notify_band_onsetfocus = function (obj, e)
    {
        var item = this._getActionItem(e);
        var itemindex = this._getItemIndex(item);
        var itemsubindex = this._getItemSubIndex(item);
        var itemcell = this._getActionItemCell(e);
        //var itemcellid = item ? item._getChildId(itemcell) : "";
        var itemcellindex = item ? item._findChildIndex(itemcell) : this._DEFAULT_CELLINDEX;

        this._actionSelectItem(itemindex, itemsubindex, itemcellindex, itemcellindex >= 0 ? "cellfocus" : "bandfocus");
    };

    _pListView.on_notify_band_oninput = function (obj, e)
    {
        this.on_fire_oninput(e);
    };

    _pListView.on_fire_oninput = function (e)
    {
        if (this.oninput && this.oninput._has_handlers)
        {
            var obj = this._makeEventInfo(e.from_refer_comp);
            var evt = new nexacro.ListViewInputEventInfo(this, obj.bandid, obj.cellid, obj.rowidx, "oninput");
            return this.oninput._fireEvent(this, evt);
        }
        return false;
    };

    _pListView.on_notify_band_onexpand = function (obj, e)
    {
        this._on_basic_onexpand(obj, e);
        this._on_fire_onexpand(obj, e);
        this._on_default_onexpand(obj, e);
    };

    _pListView.on_notify_band_onexpandclick = function (obj, e)
    {
        var item = this._getActionItem(e);
        var itemindex = this._getItemIndex(item);
        var itembandid = this._getItemId(item);
        var itemcell = this._getActionItemCell(e);
        var itemcellid = item ? item._getChildId(itemcell) : "";

        this.on_fire_onclick(e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.fromobject, e.fromobject, e.metakey, itemindex, itembandid, itemcellid, itemcell, "");
    };

    _pListView._on_listview_onlbuttondown = function (obj, e)
    {
        // 공통에 preventDefault 버그로 인해 강제 flag 처리
        // 공통 수정후 구문삭제
        if (this.onlbuttonup)
        {
            this.onlbuttonup.defaultprevented = false;
        }

        var popup = this._getPopupControl();

        if (popup && popup._isPopup() && e.bandid != "detail")
        {
            if (!popup._attached_comp)
                return false;

            var itemindex = popup._attached_comp._itemindex;
            this._setPanelBandToggle(itemindex);

            this._is_popup_changed = true;
        }
    };

    _pListView._on_listview_onlbuttonup = function (obj, e)
    {
        var popup = this._getPopupControl();

        if (popup && this._is_popup_changed)
        {
            e.preventDefault();
            this._is_popup_changed = false;
        }

        if (this._show_item)
        {
            this._showItem(this._show_rowidx, this._show_status);
        }
    };

    // Basic event
    _pListView._on_basic_onclick = function (button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key)
    {
        // user basic action
    };

    _pListView._on_basic_onexpand = function (obj, e)
    {
    };

    _pListView.on_focus_basic_action = function (self_flag, evt_name)
    {
        if (this._env._p_enableaccessibility)
        {
            this._setAccessibilityStatFocus(evt_name);
        }

        // ListView 자체에 focus가 들어왔을경우 적절한 band나 cell에 focus를 지정해야함.
        this._apply_setfocus(evt_name, self_flag);

        if (self_flag)
        {
            var rowcnt = this._getBindCount();
            if (rowcnt > 0)
                this._accept_arrow = true;
            else
                this._accept_arrow = false;

            switch (evt_name)
            {
                case "tabkey":
                    var firstcell = this._getFirstEditableCell();
                    if (firstcell.row >= 0)
                    {
                        this._is_first_focus = true;
                        this._is_first_focus_band = true;
                        this._actionSelectItem(firstcell.row, firstcell.band, firstcell.cell, "tabfocus");
                        this._is_first_focus = false;
                    }
                    this._acceptstab = this._remainEditableCell(1);
                    break;
                case "shifttabkey":
                    var lastcell = this._getLastEditableCell();
                    if (lastcell.row >= 0)
                    {
                        this._is_first_focus_band = true;
                        this._actionSelectItem(lastcell.row, lastcell.band, lastcell.cell, "tabfocus");
                    }
                    this._acceptstab = this._remainEditableCell(-1);
                    break;
                case "downkey":
                    this._is_listview_focus = true;
                    break;
                case "upkey":
                    var rowidx = rowcnt - 1;
                    if (rowidx >= 0)
                    {
                        this._focusItem(rowidx);
                    }
                    break;
            }
        }
    };

    _pListView.on_lbuttondown_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        // def basic action
        nexacro.ComplexComponent.prototype.on_lbuttondown_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);

        //own basic action
        var cell = nexacro._ListViewCellControl.prototype._getActionCell(refer_comp);
        if (cell)
        {
            cell._autoenter_selected = cell.selected;
        }
    };

    _pListView.on_lbuttonup_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        // def basic action
        nexacro.ComplexComponent.prototype.on_lbuttonup_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);

        // own basic action
        var cell = nexacro._ListViewCellControl.prototype._getActionCell(refer_comp);
        if (cell)
        {
            cell._actionEditCell(cell, "lbuttonup");
        }
    };

    _pListView.on_touchstart_basic_action = function (touch_manager, touchinfos, changedtouchinfos, refer_comp)
    {
        // def basic action
        nexacro.ComplexComponent.prototype.on_touchstart_basic_action.call(this, touch_manager, touchinfos, changedtouchinfos, refer_comp);

        //own basic action
        var cell = nexacro._ListViewCellControl.prototype._getActionCell(refer_comp);
        if (cell)
        {
            cell._autoenter_selected = cell.selected;
        }
    };

    // Default event
    _pListView._on_default_onclick = function (button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key)
    {
        // user default action
    };

    _pListView._on_default_onexpand = function (obj, e)
    {
        var item = this._getActionItem(e);
        var itemindex = this._getItemIndex(item);

        var panel = this._getPanel();
        var slot = panel ? panel._getPanelSlot(itemindex) : null;
        if (slot)
        {
            var bandstatus = slot._getSlotStatusBand();

            this._setPanelBandToggle(itemindex);

            if (bandstatus != (bandstatus = slot._getSlotStatusBand()))
            {
                this._on_fire_onbandstatuschanged(itemindex, bandstatus, this, e.fromreferenceobject);
            }

            item._resetStatus();

            if (item.id == "detail")
                this._focusItem(itemindex);
        }
    };

    // Fire event
    _pListView.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, itemindex, itembandid, itemcellid, itemcell, clickitem)
    {
        var evt;

        var canvas = this._getRecalcCanvasXY(from_refer_comp._control_element, canvasX, canvasY);
        canvasX = canvas[0];
        canvasY = canvas[1];

        var clientXY = this._getClientXY(canvasX, canvasY);
        clientX = clientXY[0];
        clientY = clientXY[1];

        // clickitem 
        if (clickitem == "expandbutton")
        {
            if (this.oncellexpandclick && this.oncellexpandclick._has_handlers)
            {
                evt = new nexacro.ListViewClickEventInfo(this, "oncellexpandclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, itembandid || "none", itemcellid || "", itemindex, clickitem, meta_key);
                return this.oncellexpandclick._fireEvent(this, evt);
            }
        }

        // instance
        if (itemcell instanceof nexacro._ListViewCellControl)
        {
            if (!this._p_readonly)
            {
                if (this._p_cellclickbound == "control")
                {
                    if (from_refer_comp instanceof nexacro._CellCheckboxControl)
                    {
                        from_refer_comp._toggleCheck();
                    }

                }
                else if (this._p_cellclickbound == "cell")
                {
                    itemcell._needToggle();
                }
            }

            if (this.oncellclick && this.oncellclick._has_handlers)
            {
                evt = new nexacro.ListViewClickEventInfo(this, "oncellclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, itembandid || "none", itemcellid || "", itemindex, clickitem, meta_key);
                return this.oncellclick._fireEvent(this, evt);
            }
            return true;
        }

        if (itemcell instanceof nexacro.Button && itemcellid == "expandbar")
        {
            //TODO : expandbar를 button이 아니라 expandbutton으로 만들기
            if (this.onbandexpandclick && this.onbandexpandclick._has_handlers)
            {
                evt = new nexacro.ListViewClickEventInfo(this, "onbandexpandclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, itembandid || "none", itemcellid, itemindex, clickitem, meta_key);
                return this.onbandexpandclick._fireEvent(this, evt);
            }
            return true;
        }

        // itemindex
        if (itemindex >= 0)
        {
            if (this.onbandclick && this.onbandclick._has_handlers)
            {
                evt = new nexacro.ListViewClickEventInfo(this, "onbandclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, itembandid || "none", "", itemindex, clickitem, meta_key);
                return this.onbandclick._fireEvent(this, evt);
            }
        }
        else if (itemindex == -1)
        {
            if (this.onheadclick && this.onheadclick._has_handlers)
            {
                evt = new nexacro.ListViewClickEventInfo(this, "onheadclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, itembandid || "none", "", -1, clickitem, meta_key);
                return this.onheadclick._fireEvent(this, evt);
            }
        }
        else if (itemindex == null || itemindex == -4)
        {
            var cw = this._getClientWidth();
            var ch = this._getClientHeight();

            // border click
            if (clientX < 0 || clientY < 0 || clientX > cw || clientY > ch)
            {
                if (this.onclick && this.onclick._has_handlers)
                {
                    evt = new nexacro.ListViewClickEventInfo(this, "onclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, "none", "", this._DEFAULT_ROWINDEX, clickitem, meta_key);
                    return this.onclick._fireEvent(this, evt);
                }
            }
            else
            {
                if (this.onnodataareaclick && this.onnodataareaclick._has_handlers)
                {
                    evt = new nexacro.ListViewClickEventInfo(this, "onnodataareaclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, "none", "", this._DEFAULT_ROWINDEX, clickitem, meta_key);
                    return this.onnodataareaclick._fireEvent(this, evt);
                }
            }
        }

        return true;
    };

    _pListView.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key, itemindex, itembandid, itemcellid, itemcell, clickitem)
    {
        var evt;

        var canvas = this._getRecalcCanvasXY(from_refer_comp._control_element, canvasX, canvasY);
        canvasX = canvas[0];
        canvasY = canvas[1];

        var clientXY = this._getClientXY(canvasX, canvasY);
        clientX = clientXY[0];
        clientY = clientXY[1];

        if (itemcell instanceof nexacro._ListViewCellControl)
        {
            if (this.oncelldblclick && this.oncelldblclick._has_handlers)
            {
                evt = new nexacro.ListViewClickEventInfo(this, "oncelldblclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, itembandid || "none", itemcellid || "", itemindex, clickitem, meta_key);
                return this.oncelldblclick._fireEvent(this, evt);
            }
        }
        if (itemindex >= 0)
        {
            if (this.onbanddblclick && this.onbanddblclick._has_handlers)
            {
                evt = new nexacro.ListViewClickEventInfo(this, "onbanddblclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, itembandid || "none", "", itemindex, clickitem, meta_key);
                return this.onbanddblclick._fireEvent(this, evt);
            }
        }
        if (itemindex == -1)
        {
            if (this.onheaddblclick && this.onheaddblclick._has_handlers)
            {
                evt = new nexacro.ListViewClickEventInfo(this, "onheaddblclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, "none", "", this._DEFAULT_ROWINDEX, clickitem, meta_key);
                return this.onheaddblclick._fireEvent(this, evt);
            }
        }
        if (itemindex == null)
        {
            if (this.onnodataareadblclick && this.onnodataareadblclick._has_handlers)
            {
                evt = new nexacro.ListViewClickEventInfo(this, "onnodataareadblclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, itembandid || "none", itemcellid || "", -1, clickitem, meta_key);
                return this.onnodataareadblclick._fireEvent(this, evt);
            }
        }

        return true;
    };

    _pListView.on_fire_user_onkeydown = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key)
    {
        var ret = nexacro.SimpleComponent.prototype.on_fire_user_onkeydown.call(this, key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key);

        if (key_code == nexacro.Event.KEY_TAB)
        {
            // Tab키를 처리할 주체를 결정할 구간은 basic_action, user_keydown
            // Tab에 대한 실제 이동을 뒤에서 하고, 여기서는 tab처리 유무만 판단.
            if (!shift_key)
            {
                this._acceptstab = this._remainEditableCell(1);
            }
            else
            {
                this._acceptstab = this._remainEditableCell(-1);
            }
        }
        else if (key_code == nexacro.Event.KEY_ENTER)
        {
            var cell = this._findObj(from_refer_comp);
            if (cell.cellobj)
            {
                var editor = cell.cellobj._editor
                if (editor && editor._isPopupVisible())
                    cell.cellobj._is_apply_hide_editor = false;
            }
        }

        if (this._env._p_enableaccessibility)
        {
            var sel = this.getSelect();
            var rowcnt = this._getBindCount();

            if (key_code == nexacro.Event.KEY_DOWN)
            {
                if (sel.row < rowcnt - 1 || this._is_listview_focus)
                {
                    this._accept_arrow = true;
                }
                else
                {
                    this._accept_arrow = false;
                    this._is_listview_focus = false;
                }
            }
            else if (key_code == nexacro.Event.KEY_UP)
            {
                if (sel.row >= 0 && !this._is_listview_focus)
                {
                    this._accept_arrow = true;
                }
                else
                {
                    this._accept_arrow = false;
                }
            }
        }

        return ret;
    };

    _pListView.on_tap_basic_action_before = function (elem, canvaxX, canvaxY, screenX, screenY, refer_comp)
    {
        var cell = nexacro._ListViewCellControl.prototype._getActionCell(refer_comp);
        if (cell)
        {
            var autoenter = cell._getAutoEnter();
            if (autoenter != "select")
            {
                if (cell._autoenter_selected == true)
                {
                    cell._actionEditCell(cell, "lbuttondown");
                }
            }
            else
            {
                cell._actionEditCell(cell, "lbuttondown");
            }
        }
    };

    _pListView.on_fire_sys_onlbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        var cell = nexacro._ListViewCellControl.prototype._getActionCell(from_refer_comp);
        if (cell)
        {
            var autoenter = cell._getAutoEnter();

            if (autoenter != "select") // autoenter가 "select"가 아닌 경우
            {
                if (cell._autoenter_selected == true)
                {
                    cell._actionEditCell(cell, "lbuttondown");
                }
                else
                {
                    if (cell.selected == false && this._env._p_enableaccessibility)
                    {
                        cell._actionEditCell(cell, "lbuttondown");
                    }
                }
            }
            else
            {
                cell._actionEditCell(cell, "lbuttondown");
            }
        }

        if (this.onlbuttondown && this.onlbuttondown._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onlbuttondown", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);

            return this.onlbuttondown._fireSysEvent(this, evt);
        }

        return false;
    };

    _pListView.on_fire_user_onlbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onlbuttondown && this.onlbuttondown._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onlbuttondown", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);

            return this.onlbuttondown._fireUserEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_sys_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        if (this.onlbuttonup && this.onlbuttonup._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onlbuttonup", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);

            return this.onlbuttonup._fireSysEvent(this, evt);

        }
        return false;
    };

    _pListView.on_fire_user_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        if (this.onlbuttonup && this.onlbuttonup._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onlbuttonup", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);

            return this.onlbuttonup._fireUserEvent(this, evt);
        }

        return false;
    };

    _pListView.on_fire_sys_onrbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onrbuttondown && this.onrbuttondown._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onrbuttondown", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);

            return this.onrbuttondown._fireSysEvent(this, evt);
        }

        return false;
    };

    _pListView.on_fire_user_onrbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onrbuttondown && this.onrbuttondown._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onrbuttondown", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);

            return this.onrbuttondown._fireUserEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_sys_onrbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {

        if (this.onrbuttonup && this.onrbuttonup._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onrbuttonup", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);

            return this.onrbuttonup._fireSysEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_user_onrbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        if (this.onrbuttonup && this.onrbuttonup._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onrbuttonup", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);

            return this.onrbuttonup._fireUserEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_oncontextmenu = function (from_comp, from_refer_comp, button, canvasX, canvasY, clientX, clientY, alt_key, ctrl_key, shift_key, screenX, screenY, meta_key)
    {
        if (this.oncontextmenu && this.oncontextmenu._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewContextMenuEventInfo(this, "oncontextmenu", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);
            return this.oncontextmenu._fireEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_sys_onmouseenter = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onmouseenter && this.onmouseenter._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onmouseenter", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);
            return this.onmouseenter._fireSysEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_user_onmouseenter = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onmouseenter && this.onmouseenter._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onmouseenter", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);
            return this.onmouseenter._fireUserEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_sys_onmouseleave = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onmouseleave && this.onmouseleave._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onmouseleave", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);
            return this.onmouseleave._fireSysEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_user_onmouseleave = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onmouseleave && this.onmouseleave._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onmouseleave", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);
            return this.onmouseleave._fireUserEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_sys_onmousedown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onmousedown && this.onmousedown._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onmousedown", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);

            return this.onmousedown._fireSysEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_user_onmousedown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onmousedown && this.onmousedown._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onmousedown", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);

            return this.onmousedown._fireUserEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_sys_onmouseup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onmouseup && this.onmouseup._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onmouseup", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);

            return this.onmouseup._fireSysEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_user_onmouseup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onmouseup && this.onmouseup._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onmouseup", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);

            return this.onmouseup._fireUserEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_sys_onmousemove = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onmousemove && this.onmousemove._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onmousemove", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);

            return this.onmousemove._fireSysEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_user_onmousemove = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onmousemove && this.onmousemove._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewMouseEventInfo(this, "onmousemove", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, obj.bandid, obj.cellid, obj.rowidx, meta_key);

            return this.onmousemove._fireUserEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_sys_ondrag = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, refer_comp, self_refer_comp, meta_key)
    {
        if (this.ondrag && this.ondrag._has_handlers)
        {
            var dragData = this._getDragData();
            var obj = this._makeEventInfo(self_refer_comp);
            var evt = new nexacro.ListViewDragEventInfo(this, "ondrag", dragData, null, "text", null, this, self_refer_comp, from_comp, refer_comp, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, obj.bandid, obj.cellid, obj.rowidx, meta_key);
            return [this.ondrag._fireSysEvent(this, evt), this, self_refer_comp, dragData, evt.userdata];
        }
        return [false];
    };
    _pListView._noFireDragFlag = false;
    _pListView.on_fire_user_ondrag = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, refer_comp, self_refer_comp, meta_key)
    {
        this._noFireDragFlag = false;


        var evt = null;
        var userdata = null;
        var dragData = this._getDragData();
        var ret = [false];
        var obj = null;
        if (this.ondrag && this.ondrag._has_handlers)
        {
            obj = this._makeEventInfo(self_refer_comp);
            evt = new nexacro.ListViewDragEventInfo(this, "ondrag", dragData, null, "text", null, this, self_refer_comp, from_comp, refer_comp, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, obj.bandid, obj.cellid, obj.rowidx, meta_key);
        }
        if (this._selectscrollmode !== "scroll")
        {
            if (evt)
            {
                if (this.ondrag._fireUserEvent(this, evt) == true)
                    return [true, this, self_refer_comp, dragData, evt.userdata];
                else if (this.ondrag.defaultprevented == true)
                    return [false, this, self_refer_comp, dragData, evt.userdata];
            }
        }
        else
        {
            this._noFireDragFlag = true;
        }
        if (this._noFireDragFlag == true)
        {
            var dragInfo = nexacro._cur_drag_info;
            if (dragInfo)
                dragInfo.isSelfAction = true;
        }
        ret = [this._noFireDragFlag, this, self_refer_comp, dragData, userdata];
        return ret;
    };

    _pListView.on_fire_sys_ondragenter = function (src_comp, src_refer_comp, dragdata, userdata, datatype, filelist,
        button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.ondragenter && this.ondragenter._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewDragEventInfo(this, "ondragenter", dragdata, userdata, datatype, filelist, src_comp, src_refer_comp, from_comp, from_refer_comp, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, obj.bandid, obj.cellid, obj.rowidx, meta_key);
            return this.ondragenter._fireSysEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_user_ondragenter = function (src_comp, src_refer_comp, dragdata, userdata, datatype, filelist,
        button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._noFireDragFlag == true || (src_comp && src_comp._selectscrollmode && (src_comp._selectscrollmode == "scroll")))
            return true;

        if (this.ondragenter && this.ondragenter._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewDragEventInfo(this, "ondragenter", dragdata, userdata, datatype, filelist, src_comp, src_refer_comp, from_comp, from_refer_comp, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, obj.bandid, obj.cellid, obj.rowidx, meta_key);
            return this.ondragenter._fireUserEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_sys_ondragleave = function (src_comp, src_refer_comp, dragdata, userdata, datatype, filelist,
        button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.ondragleave && this.ondragleave._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewDragEventInfo(this, "ondragleave", dragdata, userdata, datatype, filelist, src_comp, src_refer_comp, from_comp, from_refer_comp, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, obj.bandid, obj.cellid, obj.rowidx, meta_key);
            return this.ondragleave._fireSysEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_user_ondragleave = function (src_comp, src_refer_comp, dragdata, userdata, datatype, filelist,
        button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._noFireDragFlag == true || (src_comp && src_comp._selectscrollmode && (src_comp._selectscrollmode == "scroll")))
            return true;
        if (this.ondragleave && this.ondragleave._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewDragEventInfo(this, "ondragleave", dragdata, userdata, datatype, filelist, src_comp, src_refer_comp, from_comp, from_refer_comp, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, obj.bandid, obj.cellid, obj.rowidx, meta_key);
            return this.ondragleave._fireUserEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_sys_ondrop = function (src_comp, src_refer_comp, dragdata, userdata, datatype, filelist,
        button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.ondrop && this.ondrop._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewDragEventInfo(this, "ondrop", dragdata, userdata, datatype, filelist, src_comp, src_refer_comp, from_comp, from_refer_comp, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, obj.bandid, obj.cellid, obj.rowidx, meta_key);
            return this.ondrop._fireSysEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_user_ondrop = function (src_comp, src_refer_comp, dragdata, userdata, datatype, filelist,
        button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._noFireDragFlag == true || (src_comp && src_comp._selectscrollmode && (src_comp._selectscrollmode == "scroll")))
        {
            if (src_comp && src_comp._noFireDragFlag)
            {
                src_comp._noFireDragFlag = false;
            }
            this._noFireDragFlag = false;
            return true;
        }

        if (this.ondrop && this.ondrop._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);
            var evt = new nexacro.ListViewDragEventInfo(this, "ondrop", dragdata, userdata, datatype, filelist, src_comp, src_refer_comp, from_comp, from_refer_comp, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, obj.bandid, obj.cellid, obj.rowidx, meta_key);
            return this.ondrop._fireUserEvent(this, evt);
        }
        return false;
    };

    _pListView.on_fire_sys_ondragmove = function (src_comp, src_refer_comp, dragdata, userdata, datatype, filelist,
        button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, xdeltavalue, ydeltavalue, meta_key)
    {
        return nexacro.Component.prototype.on_fire_sys_ondragmove.call(this, src_comp, src_refer_comp, dragdata, userdata, datatype, filelist,
            button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, xdeltavalue, ydeltavalue, meta_key);
    };

    _pListView.on_fire_user_ondragmove = function (src_comp, src_refer_comp, dragdata, userdata, datatype, filelist,
        button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (!src_comp || !src_comp._selectscrollmode || src_comp._selectscrollmode && (src_comp._selectscrollmode !== "scroll"))
        {
            if (this.ondragmove && this.ondragmove._has_handlers)
            {
                var obj = this._makeEventInfo(from_refer_comp);
                var evt = new nexacro.ListViewDragEventInfo(this, "ondragmove", dragdata, userdata, datatype, filelist, src_comp, src_refer_comp, from_comp, from_refer_comp, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, obj.bandid, obj.cellid, obj.rowidx, meta_key);
                return this.ondragmove._fireUserEvent(this, evt);
            }
        }
        else
        {
            return true;
        }
        return false;
    };

    _pListView._on_fire_onexpand = function (obj, e)
    {
        if (e.fromreferenceobject._type_name == "_ListViewCellControl")
        {
            if (this.oncellexpand && this.oncellexpand._has_handlers)
            {
                e.fromobject = this;
                this.oncellexpand._fireEvent(this, e);
            }
        }
        if (e.fromreferenceobject._type_name == "_ListViewBandControl")
        {
            if (this.onbandexpand && this.onbandexpand._has_handlers)
            {
                e.fromobject = this;
                this.onbandexpand._fireEvent(this, e);
            }
        }
        if (this.onexpand && this.onexpand._has_handlers)
        {
            e.fromobject = this;
            this.onexpand._fireEvent(this, e);
        }
        return true;
    };

    _pListView._on_fire_onbandstatuschanged = function (itemindex, bandstatus, from_comp, from_refer_comp)
    {
        if (this.onbandstatuschanged && this.onbandstatuschanged._has_handlers)
        {
            switch (bandstatus)
            {
                case -1:  // COLLAPSE
                    bandstatus = "collapse";
                    break;
                case 1: // EXPAND
                case 2: // POPUP
                    bandstatus = "expand";
                    break;
                default:  // ETC
                    bandstatus = "";
                    break;
            }

            var evt = new nexacro.ListViewBandStatusEventInfo(this, "onbandstatuschanged", from_comp, from_refer_comp, itemindex, bandstatus);
            this.onbandstatuschanged._fireEvent(this, evt);
        }
    };

    _pListView.on_fire_ondropdown = function (from_refer_comp)
    {
        if (this.ondropdown && this.ondropdown._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);

            var value;
            if (from_refer_comp._getCellValue)
            {
                value = from_refer_comp._getCellValue();
            }
            else
            {
                value = from_refer_comp._p_value;
            }

            var evt = new nexacro.ListViewEditEventInfo(this, "ondropdown", obj.rowidx, obj.bandid, obj.cellid, value, from_refer_comp);

            return this.ondropdown._fireCheckEvent(this, evt);
        }
        return true;
    };

    _pListView.on_fire_oncloseup = function (from_refer_comp, pretext, posttext, prevalue, postvalue)
    {
        if (this.oncloseup && this.oncloseup._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp, postvalue);

            var value;
            if (from_refer_comp._getCellValue)
            {
                value = from_refer_comp._getCellValue();
            }
            else
            {
                value = from_refer_comp._p_value;
            }

            var evt = new nexacro.ListViewEditEventInfo(this, "oncloseup", obj.rowidx, obj.bandid, obj.cellid, value, from_refer_comp);

            return this.oncloseup._fireEvent(this, evt);
        }
        return true;
    };

    _pListView.on_fire_onenterdown = function (from_refer_comp)
    {
        if (this._p_readonly)
        {
            return true;
        }

        if (this.onenterdown && this.onenterdown._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);

            var value;
            if (from_refer_comp._getCellValue)
            {
                value = from_refer_comp._getCellValue();
            }
            else
            {
                value = from_refer_comp._p_value;
            }

            var evt = new nexacro.ListViewEditEventInfo(this, "onenterdown", obj.rowidx, obj.bandid, obj.cellid, value, from_refer_comp);

            return this.onenterdown._fireEvent(this, evt);
        }
        return true;
    };

    _pListView.on_fire_onimeaction = function (from_refer_comp, key_code, alt_key, ctrl_key, shift_key, from_comp, meta_key)
    {
        if (!this._p_enable) return true;

        if (this.oncellimeaction && this.oncellimeaction._has_handlers)
        {
            var obj = this._makeEventInfo(from_refer_comp);

            var evt = new nexacro.ListViewKeyEventInfo(this, "oncellimeaction", obj.rowidx, obj.bandid, obj.cellid, alt_key, ctrl_key, shift_key, key_code, from_refer_comp, meta_key);
            return this.oncellimeaction._fireEvent(this, evt);
        }
        return false;
    };

    _pListView._on_last_lbuttonup = function ()
    {
        if (this._after_recreate)
        {
            this._is_after_recreate = true;
            this._recreateItems();
            this._after_recreate = false;
            this._is_after_recreate = false;
        }
    }

    _pListView._on_last_keyup = function ()
    {
        if (this._after_recreate)
        {
            this._is_after_recreate = true;
            this._recreateItems();
            this._after_recreate = false;
            this._is_after_recreate = false;
        }
    }

    _pListView._on_killfocus = function (new_focus, new_refer_focus)
    {
        if (!this._is_alive) return;

        if (this._env._p_enableaccessibility)
        {
            var firstcell = this._getFirstEditableCell();
            if (firstcell.row >= 0)
            {
                var firstcellobj = this._getCurrentCell(firstcell.row, firstcell.band, firstcell.cell);
                firstcellobj.on_apply_accessibility();
            }
        }

        this.on_killfocus_basic_action(new_focus, new_refer_focus);
    };

    //===============================================================
    // nexacro.ListView : Inner Logic
    //===============================================================
    _pListView._setSubgroup = function (expandtype, expandstatus)
    {
        switch (expandtype)
        {
            case "expand":
                if (expandstatus == "expand")
                {
                    this._subgroup = nexacro._PanelConst.GROUPING_SUBSTYLE_BAND_EXPAND;
                }
                else if (expandstatus == "collapse")
                {
                    this._subgroup = nexacro._PanelConst.GROUPING_SUBSTYLE_BAND_COLLAPSE;
                }
                break;
            case "accordion":
                this._subgroup = nexacro._PanelConst.GROUPING_SUBSTYLE_BAND_ACCORDION;
                break;
            case "popup":
                this._subgroup = nexacro._PanelConst.GROUPING_SUBSTYLE_BAND_POPUP;
                break;
            case "none":
                this._subgroup = nexacro._PanelConst.GROUPING_SUBSTYLE_NONE;
                break;
        }
    };

    _pListView._makeEventInfo = function (from_refer_comp)
    {
        var obj = { cellid: "", cellidx: this._DEFAULT_CELLINDEX, rowidx: this._DEFAULT_ROWINDEX, bandid: "", bandidx: this._DEFAULT_SUBINDEX };
        var ctrls = this._findObj(from_refer_comp);

        if (ctrls.bandobj)
        {
            if (ctrls.cellobj)
            {
                obj.cellid = ctrls.cellobj.id;
                obj.cellidx = ctrls.cellobj._cellidx;
            }
            obj.rowidx = ctrls.bandobj._itemindex;
            obj.bandid = ctrls.bandobj.id;
            obj.bandidx = ctrls.bandobj._itemsubidx;
        }
        return obj;
    };

    _pListView._findObj = function (from_refer_comp)
    {
        var obj = { cellobj: null, bandobj: null };

        var fromComp = from_refer_comp;

        // bandobj
        while (fromComp && !(fromComp instanceof nexacro._ListViewBandControl))
        {
            if (fromComp instanceof nexacro.ListView)
            {
                if (fromComp == this)
                {
                    break;
                }
            }
            fromComp = fromComp.parent;
        }
        if (fromComp != this)
            obj.bandobj = fromComp;
        fromComp = from_refer_comp;

        // cellobj
        while (fromComp && !(fromComp instanceof nexacro._ListViewCellControl))
        {
            if (fromComp == this)
            {
                break;
            }
            else
            {
                fromComp = fromComp.parent;
            }
        }
        if (fromComp != this)
            obj.cellobj = fromComp;

        return obj;
    };

    _pListView._findEditableCell = function (item, from_cellidx, dir)
    {
        var i, n;
        var cell = null;

        if (nexacro._isArray(item))
        {
            for (i = 0, n = item.length; i < n; i++)
            {
                if (i > 0)
                {
                    from_cellidx = (dir == 1) ? 0 : item._getLastChild() ? item._getLastChild()._cellidx : 0;

                    if (item[i] && !this._isExistSubSlot(item[i]._rowidx)) // detail band collapse
                        continue;
                }

                if (item[i] && (cell = this._findEditableCell(item[i], from_cellidx, dir)))
                    break;
            }
        }
        else
        {
            var cells = this._getBandCells(item);
            if (cells)
            {
                switch (dir)
                {
                    case -1:
                        for (i = from_cellidx; i >= 0; i--)
                        {
                            if (cells[i]._hasEditor() || cells[i]._refinfo._getEdittype(cells[i]._getDataRow()) == "checkbox")
                            {
                                cell = cells[i];
                                break;
                            }
                        }
                        break;
                    case 1:
                        for (i = from_cellidx, n = cells.length; i < n; i++)
                        {
                            if (cells[i]._hasEditor() || cells[i]._refinfo._getEdittype(cells[i]._getDataRow()) == "checkbox")
                            {
                                cell = cells[i];
                                break;
                            }
                        }
                        break;
                }
            }
        }

        return cell;
    };

    _pListView._remainEditableCell = function (dir)
    {
        // 현재 select 시점 기준으로 front / back 방향으로 움직일 Cell이 있는지 여부 판단
        var sel = this.getSelect();
        var rowcnt = this._getBindCount();

        var item;
        var items = this._getItem(sel.row);
        if (items)
        {
            var item, cell, i;

            var rowidx = sel.row;
            var bandidx = sel.band;
            var cellidx = sel.cell < 0 ? 0 : sel.cell;

            switch (dir)
            {
                // 역방향
                case -1:
                    item = nexacro._isArray(items) ? items[bandidx >= 0 ? sel.band : 0] : items;
                    cell = this._findEditableCell(item, cellidx - 1, dir);

                    if (!cell)
                    {
                        for (i = rowidx; i >= 0; i--)
                        {
                            if (bandidx > 0)
                            {
                                bandidx--;
                            }
                            else
                            {
                                rowidx--;

                                // detail expand check
                                if (this._isExistSubSlot(rowidx))
                                    bandidx = this._getPanelSlotCount() - 1;
                                else
                                    bandidx = 0;
                            }

                            if (item = this._getCurrentBand(rowidx, bandidx))
                            {
                                var cells = this._getBandCells(item);
                                cellidx = cells ? cells.length - 1 : 0;
                                cell = this._findEditableCell(item, cellidx, -1);
                            }

                            if (cell) break;
                        }
                    }
                    break;
                // 순방향
                case 1:
                    item = nexacro._isArray(items) ? items[bandidx >= 0 ? sel.band : 0] : items;
                    cell = this._findEditableCell(item, cellidx + 1, dir);

                    if (!cell)
                    {
                        for (i = rowidx; i < rowcnt; i++)
                        {
                            if (bandidx < this._getPanelSlotCount() - 1 && this._isExistSubSlot(rowidx))    // detail expand check
                            {
                                bandidx++;
                            }
                            else
                            {
                                rowidx++;
                                bandidx = 0;
                            }

                            if (item = this._getCurrentBand(rowidx, bandidx))
                            {
                                cellidx = 0;
                                cell = this._findEditableCell(item, cellidx, 1);
                            }

                            if (cell) break;
                        }
                    }
                    break;
            }

            if (cell)
                return true;
        }

        return false;
    };

    /*
        ListView 에서 사용할만한 getter List

        _getItems : Component에 생성된 Item List (Array)
        _getItem  : 특정 row에 대응하는 BandControl (Array or Object)
        _getBandCells : 특정 BandControl에 속해있는 CellControl List

        _getCurrentBand : 현재 선택된 row의 band Object
        _getCurrentCell : 현재 선택된 row / band의 Cell Object

        _getFirstEditableCell : Component에서 최초로 접근 가능한 EditableCell index info
        _getLastEditableCell : Component에서 마지막으로 접근 가능한 EditableCell index info

        _getActionItem
        _getActionItemCell
    */

    _pListView._getBandCells = function (band)
    {
        var cells = band._children;

        if (cells && cells.length)
        {
            if (cells[0] instanceof nexacro._ListViewCellControl)
                return cells;
        }

        return null;
    };

    _pListView._getCurrentBand = function (rowidx, bandidx)
    {
        var ctxt = this._getCtxtBaseInfo();
        var bands = ctxt ? ctxt._bands : null;

        if (!bands)
            return null;

        var currselect = this.getSelect();
        var currow = (rowidx != null) ? rowidx : currselect.row;
        var curband = (bandidx != null) ? bandidx : currselect.band;
        var band = null;
        var type = "body";
        var slotcnt = this._getPanelSlotCount();

        switch (currow)
        {
            case -1:
                type = "head";

                break;
            case -2:
                type = "tail";
                break;
        }

        var bodyband = bands[type];

        if (!bodyband && type == "body")
        {
            var checkdetail = "detail";
            if (bands[checkdetail])
            {
                type = checkdetail;
                bodyband = bands[type];

            }
        }
        if (!bodyband) return null;

        if (type == "body" || type == "detail")
        {
            if (this._items.length > currow)
            {
                band = this._items[currow * slotcnt + curband];
            }
        }
        return band;
    };

    _pListView._getCurrentCell = function (rowidx, bandidx, cellidx)
    {
        var currselect = this.getSelect();
        var curcell = (cellidx != null) ? cellidx : currselect.cell;
        var band = this._getCurrentBand(rowidx, bandidx);
        var cell = null;

        if (band)
        {
            var cells = this._getBandCells(band);

            if (cells)
            {
                if (typeof (curcell) == "string")
                {
                    for (var i = 0, n = cells.length; i < n; i++)
                    {
                        if (cells[i].id == curcell)
                        {
                            cell = cells[i];
                            break;
                        }
                    }
                }
                else
                {
                    cell = cells[curcell];
                }
            }
        }
        return cell;
    };

    _pListView._getFirstEditableCell = function ()
    {
        var info = { row: this._DEFAULT_ROWINDEX, band: this._DEFAULT_SUBINDEX, cell: this._DEFAULT_CELLINDEX };

        var rowcnt = this._getBindCount();
        if (rowcnt > 0)
        {
            // find row, cell : first -> last
            for (var i = 0; i < rowcnt; i++)
            {
                var item = this._getItem(0);
                if (item)
                {
                    var cell = this._findEditableCell(item, 0, 1);
                    if (cell)
                    {
                        info.row = cell._rowidx;
                        info.band = cell._bandidx;
                        info.cell = cell._cellidx;
                        break;
                    }
                }
            }
        }

        return info;
    };

    _pListView._getLastEditableCell = function ()
    {
        var info = { row: this._DEFAULT_ROWINDEX, band: this._DEFAULT_SUBINDEX, cell: this._DEFAULT_CELLINDEX };

        var rowcnt = this._getBindCount();
        if (rowcnt > 0)
        {
            // find row, cell : last -> first
            for (var i = rowcnt - 1; i >= 0; i--)
            {
                var items = this._getItem(i);
                if (items)
                {
                    var cell, lastcell;
                    if (nexacro._isArray(items))
                    {
                        for (var j = items.length - 1; j >= 0; j--)
                        {
                            var item = items[j];
                            if (j > 0)
                            {
                                if (!this._isExistSubSlot(item._rowidx)) // detail band collapse
                                    continue;
                            }
                            if (item && (lastcell = item._getLastChild()))
                            {
                                if (lastcell && (cell = this._findEditableCell(item, lastcell._cellidx, -1)))
                                    break;
                            }
                        }
                    }
                    else
                    {
                        if (lastcell = items._getLastChild())
                        {
                            cell = this._findEditableCell(items, lastcell._cellidx, -1);
                        }
                    }

                    if (cell)
                    {
                        info.row = cell._rowidx;
                        info.band = cell._bandidx;
                        info.cell = cell._cellidx;
                        break;
                    }
                }
            }
        }

        return info;
    };

    _pListView._getActionItem = function (e)
    {
        return e ? e.fromobject : null;
    };

    _pListView._getActionItemCell = function (e)
    {
        return e ? e.fromreferenceobject : null;
    };

    _pListView._getSelectScrollMode = function ()
    {
        var mode = this._p_selectscrollmode;
        if (mode == "default")
        {
            if (nexacro._isTouchInteraction)
            {
                mode = "scroll";
            }
            else
            {
                mode = "select";
            }
        }

        return mode;
    };

    _pListView._getViewStartScrollPos = function ()
    {
        var start = this._getItemScrollViewStart(); if (start < 0) start = 0;

        // viewstart 기준 panel
        var panel_slot = this._getPanelSlot(start);
        var slot_top;
        if (panel_slot)
        {
            // panel 기준 scrollPos
            slot_top = panel_slot._getSlotCalcTop();
        }
        return slot_top;
    };

    _pListView._isDownActionKeyMouse = function ()
    {
        var window = this._getWindow();

        if (window && (window._cur_ldown_elem || window._keydown_element))
        {
            var elem = window._cur_ldown_elem || window._keydown_element,
                comp = window.findComponent(elem, 0, 0)[0],
                isListView = false;

            while (comp)
            {
                if (comp instanceof nexacro.ScrollBarControl)
                    break;

                if (comp instanceof nexacro.ListView && comp == this && comp.id == this.id)
                {
                    isListView = true;
                    break;
                }
                comp = comp.parent;
            }
            return isListView;
        }
        return false;
    };

    nexacro._defineProperties(_pListView, _pListView._properties);

    _pListView = null;
}