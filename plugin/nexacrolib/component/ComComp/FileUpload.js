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

if (!nexacro.FileUpload)
{
    //==============================================================================
    // nexacro.FileUploadItemEventInfo
    //==============================================================================
    nexacro.FileUploadItemEventInfo = function (obj, id, idx)
    {
        this.id = this.eventid = id || "onfileuploaditem";
        this.fromobject = this.fromreferenceobject = obj;

        this.index = idx;
    };

    var _pEventFileUploadItemEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.FileUploadItemEventInfo);
    nexacro.FileUploadItemEventInfo.prototype = _pEventFileUploadItemEventInfo;
    _pEventFileUploadItemEventInfo._type_name = "FileUploadItemEventInfo";

    _pEventFileUploadItemEventInfo = null;
    //delete _pEventFileUploadItemEventInfo;

    //==============================================================================
    // nexacro.FileUploadMouseEventInfo
    //==============================================================================
    nexacro.FileUploadMouseEventInfo = function (obj, id, strButton, altKey, ctrlKey, shiftKey, index, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, metaKey)
    {
        this.id = this.eventid = id || "onmouse";

        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;
        this.altkey = altKey || false;
        this.ctrlkey = ctrlKey || false;
        this.shiftkey = shiftKey || false;
        this.metakey = metaKey || false;
        this.button = strButton || "";
        this.index = index;
        this.screenx = screenX || -1;
        this.screeny = screenY || -1;
        this.canvasx = canvasX || -1;
        this.canvasy = canvasY || -1;
        this.clientx = clientX || -1;
        this.clienty = clientY || -1;
    };

    var _pFileUploadMouseEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.FileUploadMouseEventInfo);
    nexacro.FileUploadMouseEventInfo.prototype = _pFileUploadMouseEventInfo;
    _pFileUploadMouseEventInfo._type_name = "FileUploadMouseEventInfo";


    _pFileUploadMouseEventInfo._xposConvertToRtl = function (obj, from_refer_comp)
    {
        if (obj && obj._isRtl && obj._isRtl())
        {
            this._orgcanvasx = this.canvasx;
            this._orgclientx = this.clientx;
            this.canvasx = nexacro._getRTLCanvasXForMouseEvent(obj, from_refer_comp, this.canvasx);
            this.clientx = obj._getClientXY(this.canvasx, this.canvasy)[0];

            return true;
        }
        return false;
    };

    _pFileUploadMouseEventInfo._xposConvertToLtr = function (obj)
    {
        if (obj && obj._isRtl && obj._isRtl())
        {
            this.canvasx = this._orgcanvasx;
            this.clientx = this._orgclientx;

            delete this._orgcanvas;
            delete this._orgclientx;
        }
    };

    _pFileUploadMouseEventInfo = null;
    //delete _pFileUploadMouseEventInfo;

    //==============================================================================
    // nexacro.FileUploadContextMenuEventInfo
    //==============================================================================
    nexacro.FileUploadContextMenuEventInfo = function (obj, id, strButton, altKey, ctrlKey, shiftKey, index, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, metaKey)
    {
        nexacro.ContextMenuEventInfo.call(this, obj, id, from_comp, from_refer_comp, strButton, altKey, ctrlKey, shiftKey, screenX, screenY, canvasX, canvasY, clientX, clientY, metaKey);

        this.index = index;
    };

    var _pFileUploadContextMenuEventInfo = nexacro._createPrototype(nexacro.MouseEventInfo, nexacro.FileUploadContextMenuEventInfo);
    nexacro.FileUploadContextMenuEventInfo.prototype = _pFileUploadContextMenuEventInfo;
    _pFileUploadContextMenuEventInfo._type_name = "FileUploadContextMenuEventInfo";

    _pFileUploadContextMenuEventInfo = null;
    //delete _pFileUploadContextMenuEventInfo;

    //==============================================================================
    // nexacro.FileUploadEventInfo
    //==============================================================================
    nexacro.FileUploadEventInfo = function (obj, id, dsArray, code, msg, url)
    {
        this.id = this.eventid = id || "onsuccess";
        this.fromobject = this.fromreferenceobject = obj;

        this.datasets = dsArray;
        this.errorcode = code;
        this.errormsg = msg;
        this.url = url;
    };

    var _pFileUploadEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.FileUploadEventInfo);
    nexacro.FileUploadEventInfo.prototype = _pFileUploadEventInfo;
    _pFileUploadEventInfo._type_name = "FileUploadEventInfo";

    _pFileUploadEventInfo = null;
    //delete _pFileUploadEventInfo;

    //==============================================================================
    // nexacro.FileUploadItemChangeEventInfo
    //==============================================================================
    nexacro.FileUploadItemChangeEventInfo = function (obj, id, index, oldvalue, newvalue)
    {
        this.id = this.eventid = id || "onitemchanged";
        this.fromobject = this.fromreferenceobject = obj;

        this.index = obj._p_index;
        this.oldvalue = oldvalue;
        this.newvalue = newvalue;
    };

    var _pFileUploadItemChangeEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.FileUploadItemChangeEventInfo);
    nexacro.FileUploadItemChangeEventInfo.prototype = _pFileUploadItemChangeEventInfo;
    _pFileUploadItemChangeEventInfo._type_name = "FileUploadItemChangeEventInfo";

    _pFileUploadItemChangeEventInfo = null;
    //delete _pFileUploadItemChangeEventInfo;

    //==============================================================================
    // nexacro.FileUploadErrorEventInfo
    //==============================================================================
    nexacro.FileUploadErrorEventInfo = function (obj, id, errortype, errormsg, errorobj, statuscode, requesturi, locationuri, index)
    {
        nexacro.ErrorEventInfo.call(this, obj, id, errortype, errormsg, errorobj, statuscode, requesturi, locationuri);
        this.index = index;
    };

    var _pFileUploadErrorEventInfo = nexacro._createPrototype(nexacro.ErrorEventInfo, nexacro.FileUploadErrorEventInfo);
    nexacro.FileUploadErrorEventInfo.prototype = _pFileUploadErrorEventInfo;
    _pFileUploadErrorEventInfo._type_name = "FileUploadErrorEventInfo";

    _pFileUploadErrorEventInfo = null;
    //delete _pFileUploadErrorEventInfo;

    //==============================================================================
    // nexacro.FileUpload
    //==============================================================================
    nexacro.FileUpload = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this.filelist = [];
        //[REQ_32312] new spac
        this.filepathedits = new nexacro.Collection();
        this.filefindbuttons = new nexacro.Collection();

        this._items = [];
        this.context = this._refform;
    };

    var _pFileUpload = nexacro._createPrototype(nexacro.Component, nexacro.FileUpload);
    nexacro.FileUpload.prototype = _pFileUpload;
    _pFileUpload._type_name = "FileUpload";

    /* element */

    /* default properties */
    _pFileUpload._p_buttonsize = undefined;
    _pFileUpload._p_buttontext = "find";
    _pFileUpload._p_index = -1;
    _pFileUpload._p_itemcount = 1;
    _pFileUpload._p_itemheight = undefined;
    _pFileUpload._p_multiselect = false;
    _pFileUpload._p_text = "";
    _pFileUpload._p_uploadurl = "";
    _pFileUpload._p_value = undefined;

    _pFileUpload._p_filefilter = "";
    _pFileUpload._p_filefilterindex = 0;

    /* internal variable */
    _pFileUpload._hidden_frame_handle = null;
    _pFileUpload._last_id = -1;
    _pFileUpload._bresetscroll = 0;
    _pFileUpload._onPopupWin = false;
    _pFileUpload._is_listtype = true;
    _pFileUpload._calc_scroll = false;
    _pFileUpload._cnt_resetscroll = 0;
    _pFileUpload._iscors = false;

    /* status */
    _pFileUpload._is_scrollable = true;

    /* accessibility */
    _pFileUpload._p_accessibilityaction = "";
    _pFileUpload._p_accessibilityrole = "fileupload";
    _pFileUpload._p_accessibilitydesclevel = "all";
    _pFileUpload._p_accessibilitydescription = "";
    _pFileUpload._p_accessibilityenable = true;
    _pFileUpload._p_accessibilitylabel = "";

    _pFileUpload.buttonaccessibilityaction = "";
    _pFileUpload.buttonaccessibilityrole = "";
    _pFileUpload.buttonaccessibilitydesclevel = "all";
    _pFileUpload.buttonaccessibilitydescription = "";
    _pFileUpload.buttonaccessibilityenable = true;
    _pFileUpload.buttonaccessibilitylabel = "";

    _pFileUpload.editaccessibilityaction = "";
    _pFileUpload.editaccessibilityrole = "";
    _pFileUpload.editaccessibilitydesclevel = "all";
    _pFileUpload.editaccessibilitydescription = "";
    _pFileUpload.editaccessibilityenable = true;
    _pFileUpload.editaccessibilitylabel = "";

    _pFileUpload._want_tab = true; // tab key
    _pFileUpload._want_arrow = false; // arrow key for accessibility
    _pFileUpload._first_focus = false; // first focus flag for accessibility
    _pFileUpload._editFlag = null;
    _pFileUpload._buttonFlag = false;

    /* event list */
    _pFileUpload._event_list =
    {
        "ondblclick": 1,
        "onkeypress": 1, "onkeydown": 1, "onkeyup": 1,
        "onkillfocus": 1, "onsetfocus": 1,
        "ondrag": 1, "ondrop": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1, "onmousedown": 1, "onmouseup": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmousewheel": 1, "onmove": 1, "onsize": 1,
        "onsuccess": 1, "onerror": 1,
        "oncontextmenu": 1,
        "onappenditem": 1, "ondeleteitem": 1, "onitemclick": 1, "onfindclick": 1, "onitemchanged": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1
    };

    //===============================================================
    // nexacro.FileUpload : Create & Destroy & Update
    //===============================================================
    _pFileUpload.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var item;
            var items = this._items;
            var itemcount = this._p_itemcount;
            for (var i = 0; i < itemcount; i++)
            {
                item = this._createFileItem(i, 0, 0, 0, 0, true);
                this.filepathedits.add_item(item.id, item.fileitemedit);
                this.filefindbuttons.add_item(item.id, item.fileitembutton);
                items[i] = item;
            }
        }
    };

    _pFileUpload.on_created_contents = function ()
    {
        nexacro._create_hidden_frame(this._unique_id, this._on_manager_onload, this, "fileupload");

        if (!this.context)
            this.context = this._refform;

        this.on_apply_index(this._p_index);
        this.on_apply_prop_enable(this._isEnable());

        this._recalcLayout();

        var item;
        var items = this._items;
        var itemcount = this._p_itemcount;
        const enableaccessibility = this._env._p_enableaccessibility;
        for (var i = 0; i < itemcount; i++)
        {
            item = items[i];

            item.on_created();

            item._setEventHandler("onfindclick", this._on_item_onfindclick, this);
            item._setEventHandler("onitemclick", this._on_item_onitemclick, this);

            if (enableaccessibility)
            {
                item._setAccessibilityInfoIndex(i + 1);
                item._setAccessibilityInfoCount(itemcount);
            }
        }

        this._buttonFlag = true;

        if (enableaccessibility)
        {
            this.on_apply_editaccessibility();
            this.on_apply_buttonaccessibility();
        }

        this._onRecalcScrollSize();
    };

    _pFileUpload.on_destroy_contents = function ()
    {
        var items = this._items;
        var item_len = items.length;
        for (var i = 0; i < item_len; i++)
        {
            items[i].destroy();
        }
        this.filelist = null;
        this._items = null;

        this.filepathedits.clear();
        this.filepathedits = null;
        this.filefindbuttons.clear();
        this.filefindbuttons = null;
        nexacro._destroy_hidden_frame(this._unique_id, this, "fileupload");
    };

    _pFileUpload.on_create_contents_command = function ()
    {
        this.on_apply_index(this._p_index);
        this.on_apply_prop_enable(this._isEnable());

        this._recalcLayout();

        var str = "";
        var items = this._items;
        var itemcount = this._p_itemcount;
        for (var i = 0; i < itemcount; i++)
        {
            str += items[i].createCommand();
        }

        return str;
    };

    _pFileUpload.on_attach_contents_handle = function (win)
    {
        nexacro._create_hidden_frame(this._unique_id, this._on_manager_onload, this, "fileupload");

        var item;
        var items = this._items;
        var itemcount = this._p_itemcount;
        const enableaccessibility = this._env._p_enableaccessibility;
        for (var i = 0; i < itemcount; i++)
        {
            item = items[i];
            item.attachHandle(win);
            item._setEventHandler("onfindclick", this._on_item_onfindclick, this);
            item._setEventHandler("onitemclick", this._on_item_onitemclick, this);

            if (enableaccessibility)
            {
                item._setAccessibilityInfoIndex(i + 1);
                item._setAccessibilityInfoCount(itemcount);
            }

            if (this._p_index == i)
            {
                if (this._editFlag)
                    item.fileitemedit.setFocus(false);

                if (this._buttonFlag)
                    item.fileitembutton.setFocus(false);

                this._p_value = item._p_value;
            }
        }

        this._buttonFlag = true;
        if (enableaccessibility)
        {
            this.on_apply_editaccessibility(this.editaccessibility);
            this.on_apply_buttonaccessibility(this.buttonaccessibility);
        }
        if (this._p_multiselect)
            this.on_apply_multiselect(this._p_multiselect);

        this._onRecalcScrollSize();
    };

    _pFileUpload.on_change_containerRect = function (width, height)
    {
        if (this._is_created_contents)
        {
            this._recalcLayout();

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

    _pFileUpload.on_change_containerPos = function (left, top)
    {
        //
    };

    //===============================================================
    // nexacro.FileUpload : Override
    //===============================================================
    _pFileUpload._apply_setfocus = function (evt_name)
    {
        var enableaccessibility = this._env._p_enableaccessibility;
        var selffocus = ((evt_name == "lbutton") ? false : enableaccessibility);
        var items = this._items;
        if (items.length < -1 || enableaccessibility)
        {
            var control_elem = this._control_element;
            if (control_elem)
            {
                control_elem.setElementFocus(selffocus);
            }
        }
        else
        {
            var item = items[this._p_index];
            if (item)
            {
                item.fileitembutton._control_element.setElementFocus(selffocus);
            }
        }
    };

    _pFileUpload.on_apply_prop_enable = function (enable)
    {
        nexacro.Component.prototype.on_apply_prop_enable.call(this, enable);

        var items = this._items;
        var item_len = items.length;

        for (var i = 0; i < item_len; i++)
        {
            items[i]._setEnable(enable);
            items[i].fileitemedit._setEnable(enable);
            items[i].fileitembutton._setEnable(enable);
        }
    };

    _pFileUpload.on_apply_prop_stringresource = function ()
    {
        if (!nexacro._StringResource)
            return;

        nexacro.Component.prototype.on_apply_prop_stringresource.call(this);

        this.on_apply_buttontext(this._getStringResourceProperty(this._p_buttontext));
    };

    _pFileUpload._onRecalcScrollSize = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var scrollWidth = this._getClientWidth();
            var scrollHeight = this._p_itemcount * this._getItemHeight();

            if (scrollHeight > this._getClientHeight())
            {
                var vscroll = this.vscrollbar;
                if (vscroll)
                {
                    if (!vscroll.visible)
                        scrollWidth -= vscroll._getClientWidth();
                }
                else
                {
                    scrollWidth -= this._getVScrollBarSize();
                }
            }

            this._calc_scroll = true;

            control_elem.setElementScrollMaxSize(scrollWidth, scrollHeight);

            if (!this._cnt_resetscroll)
                this._onResetScrollBar();

            this._calc_scroll = false;
            this._cnt_resetscroll = 0;
        }
    };

    _pFileUpload._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var want_tab = this._want_tab;
        this._want_tab = true;
        this._want_arrow = this._want_arrow && this._isEnable();

        return { want_tab: want_tab, want_return: true, want_escape: false, want_chars: false, want_arrows: this._want_arrow };
    };

    //===============================================================
    // nexacro.FileUpload : Properties
    //===============================================================
    _pFileUpload.set_text = nexacro._emptyFn;

    _pFileUpload.set_value = nexacro._emptyFn;

    _pFileUpload.set_buttonsize = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v))
            {
                return;
            }
        }

        if (this._p_buttonsize != v)
        {
            this._p_buttonsize = v;
            this.on_apply_buttonsize(v);
        }
    };

    _pFileUpload.on_apply_buttonsize = function (buttonsize)
    {
        var items = this._items;
        var item_len = items.length;
        for (var i = 0; i < item_len; i++)
        {
            if (items[i])
            {
                items[i]._recalcLayout();
            }
        }
    };

    _pFileUpload.set_buttontext = function (v)
    {
        if (this._p_buttontext != v)
        {
            this._p_buttontext = v;
            this.on_apply_buttontext(v);
        }
    };

    _pFileUpload.on_apply_buttontext = function (buttontext)
    {
        var itembutton;
        var items = this._items;
        var item_len = items.length;
        for (var i = 0; i < item_len; i++)
        {
            itembutton = items[i].fileitembutton;
            if (itembutton)
            {
                itembutton.set_text(buttontext);
            }
        }
    };

    _pFileUpload.set_index = function (v)
    {
        if (isNaN(v = +v) || v < -1)
        {
            return;
        }

        if (this._p_index != v)
        {
            this._p_index = v;
            this.on_apply_index(v);
            this._setAccessibilityStatSelected(v);
        }
    };

    _pFileUpload.on_apply_index = function (index)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var item = this._items[index];
            if (item)
            {
                if (this._editFlag)
                    item.fileitemedit.setFocus(false);

                if (this._buttonFlag)
                    item.fileitembutton.setFocus(false);

                this._p_value = item._p_value;
            }
        }
    };

    _pFileUpload.set_itemcount = function (v)
    {
        if (isNaN(v = +v) || v < 0)
        {
            return;
        }

        if (this._p_itemcount != v)
        {
            var pre_itemcount = this._p_itemcount;
            this._p_itemcount = v;
            this.on_apply_itemcount(v, pre_itemcount);
        }
    };

    _pFileUpload.on_apply_itemcount = function (itemcount, pre_itemcount)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var item;
            var items = this._items;
            var item_len = items.length;

            if (item_len)
            {
                while (pre_itemcount > itemcount)
                {
                    pre_itemcount--;
                    items.pop().destroy();
                }
            }

            for (var i = item_len; i < itemcount; i++)
            {
                item = this._items[i] = this._createFileItem(i);
                this.filepathedits.add_item(item.id, item.fileitemedit);
                this.filefindbuttons.add_item(item.id, item.fileitembutton);
            }

            this._recalcLayout();
            this._onRecalcScrollSize();
        }
    };

    _pFileUpload.set_itemheight = function (v)
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

    _pFileUpload.on_apply_itemheight = function (itemheight)
    {
        this._recalcLayout();
        this._onRecalcScrollSize();
    };

    _pFileUpload.set_multiselect = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_multiselect != v)
        {
            this._p_multiselect = v;
            this.on_apply_multiselect(v);
        }
    };

    _pFileUpload.on_apply_multiselect = function (multiselect)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var item;
            var items = this._items;
            var item_len = items.length;
            var comp_name = this._unique_id;

            for (var i = 0; i < item_len; i++)
            {
                item = items[i];
                nexacro._setMultipleFile(comp_name, item.name, multiselect, item);
            }
        }
    };

    _pFileUpload.set_uploadurl = function (v)
    {
        if (this._p_uploadurl != v)
        {
            this._p_uploadurl = v;
        }
    };

    _pFileUpload.on_apply_accessibility = function ()
    {
        nexacro.Component.prototype.on_apply_accessibility.call(this);
        this.on_apply_editaccessibility();
        this.on_apply_buttonaccessibility();
    };

    //TODO
    _pFileUpload.on_apply_editaccessibility = function ()
    {
        var iLen = this._items.length;
        var item = null;
        var role = this.editaccessibilityrole;
        var label = this.editaccessibilitylabel;
        var desclevel = this.editaccessibilitydesclevel;
        var description = this.editaccessibilitydescription;
        var enable = this.editaccessibilityenable;
        var action = this.editaccessibilityaction;

        for (var i = 0; i < iLen; i++)
        {
            item = this._getItem(i);
            var fileitemedit = item.fileitemedit;
            if (fileitemedit)
            {
                if (role)
                    fileitemedit.set_accessibilitydescrole(role);
                if (label)
                    fileitemedit.set_accessibilitydesclabel(label);
                if (desclevel)
                    fileitemedit.set_accessibilitydesclevel(desclevel);
                if (action)
                    fileitemedit.set_accessibilityaction(action);
                if (description)
                    fileitemedit.set_accessibilitydesclevel(description);
                fileitemedit.set_accessibilityenable(enable);
            }
        }
    };

    _pFileUpload.on_apply_buttonaccessibility = function (buttonaccessibility)
    {
        var iLen = this._items.length;
        var item = null;
        var role = this.editaccessibilityrole;
        var label = this.editaccessibilitylabel;
        var desclevel = this.editaccessibilitydesclevel;
        var description = this.editaccessibilitydescription;
        var enable = this.editaccessibilityenable;
        var action = this.editaccessibilityaction;

        for (var i = 0; i < iLen; i++)
        {
            item = this._getItem(i);
            var fileitembutton = item.fileitembutton;
            if (fileitembutton)
            {
                if (role)
                    fileitembutton.set_accessibilitydescrole(role);
                if (label)
                    fileitembutton.set_accessibilitydesclabel(label);
                if (desclevel)
                    fileitembutton.set_accessibilitydesclevel(desclevel);
                if (action)
                    fileitembutton.set_accessibilityaction(action);
                if (description)
                    fileitembutton.set_accessibilitydesclevel(description);
                fileitembutton.set_accessibilityenable(enable);
            }
        }
    };

    _pFileUpload.set_filefilter = function (v)
    {
        this._p_filefilter = v;
    };

    _pFileUpload.set_filefilterindex = function (v)
    {
        this._p_filefilterindex = v;
    };

    _pFileUpload._properties = [
        { name: "text", readonly: true }, { name: "value", readonly: true }, { name: "buttonsize" }, { name: "buttontext" }, { name: "index" },
        { name: "itemcount" }, { name: "itemheight" }, { name: "multiselect" }, { name: "uploadurl" },
        { name: "filefilter" }, { name: "filefilterindex" }
    ];

    nexacro._defineProperties(_pFileUpload, _pFileUpload._properties);

    //===============================================================
    // nexacro.FileUpload : Methods
    //===============================================================
    _pFileUpload.appendItem = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var index = this._p_itemcount;
            var item = this._items[index] = this._createFileItem(index);
            this.filepathedits.add_item(item.id, item.fileitemedit);
            this.filefindbuttons.add_item(item.id, item.fileitembutton);

            this._p_itemcount++;
            if (this._env._p_enableaccessibility)
            {
                item._setAccessibilityInfoIndex(index);
                item._setAccessibilityInfoCount(index + 1);
            }

            this._recalcLayout();
            this._onRecalcScrollSize();

            this.on_fire_onappenditem(this, index);
        }
    };

    _pFileUpload.deleteItem = function (idx)
    {
        if (idx < 0)
            return;
        var cur_index = this._p_index;
        var control_elem = this.getElement();
        if (control_elem)
        {
            idx = parseInt(idx, 10);
            var items = this._items;

            if (this._p_itemcount <= idx)
            {
                return;
            }

            var iCount = this._p_itemcount;
            var iCnt = iCount - 1;
            const enableaccessibility = this._env._p_enableaccessibility;
            for (var i = idx + 1; i < iCount; i++)
            {
                if (cur_index == i)
                {
                    this._p_index--;
                }
                items[i]._p_index--;

                if (enableaccessibility)
                {
                    items[i]._setAccessibilityInfoIndex(i);
                    items[i]._setAccessibilityInfoCount(iCnt);
                }
            }

            items[idx].destroy();
            items.splice(idx, 1);
            if (cur_index == idx)
            {
                this._p_index = -1;
                this._p_value = undefined;
                this._setText("");
            }

            this._p_itemcount--;

            this._recalcLayout();
            this._onRecalcScrollSize();
            this.on_fire_ondeleteitem(this, idx);

            this._updateFileList();
        }
    };

    _pFileUpload.changeItem = function (idx, newvalue)
    {
        //runtime 이외에는 검증이 되지 않았으므로 검증이 될때까지는 런타임만 지원함;
        if (nexacro._Browser == "Runtime" && nexacro._OS != "Android")
        {
            var control_elem = this.getElement();
            if (control_elem)
            {
                idx = parseInt(idx, 10);

                if (this._p_itemcount <= idx)
                    return;

                var item = this._items[idx];

                var value;
                var fLen = newvalue.length;
                var trustNewvalue = new Array();
                if (fLen > 0)
                {
                    value = "";
                    for (var j = 0; j < fLen; j++)
                    {
                        var filename = newvalue[j];

                        // replace separator : / --> \\
                        filename = filename.split("/").join("\\");
                        var nIdx = filename.lastIndexOf("\\");
                        var path = "";
                        if (nIdx > 0)
                        {
                            path = filename.substring(0, nIdx + 1);
                        }
                        var _window = this._getWindow();
                        if (nexacro._isTrustPath(_window, path))
                        {
                            value += (trustNewvalue.length > 0 ? ", " : "") + newvalue[j];
                            trustNewvalue.push(newvalue[j]);
                        }
                    }
                }

                if (value != item._p_value)
                {
                    item.oldvalue = item._p_value;
                    item._p_value = value;
                    item._changeFiles(trustNewvalue);
                    if (item.fileitemedit)
                    {
                        item.fileitemedit.set_value(value);
                    }

                    if (((this._p_index == -1) ? 0 : this._p_index) == idx)
                    {
                        item._p_parent._setText(value);
                        item._p_parent._setValue(value);
                    }
                    item._p_parent.on_fire_onitemchanged(item, idx, item.oldvalue, item._p_value, newvalue);
                }
                trustNewvalue.length = 0;
            }
        }
    };

    _pFileUpload.getItemCount = function (bHasValue)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            bHasValue = nexacro._toBoolean(bHasValue);

            var cnt = 0;
            var idx = 0;
            var items = this._items;
            var item_len = items.length;

            while (idx < item_len)
            {
                if (bHasValue == true)
                {
                    if (items[idx]._p_value)
                    {
                        cnt++;
                    }
                }
                else
                {
                    return item_len;
                }
                ++idx;
            }
            return cnt;
        }
    };

    _pFileUpload.getItemIndex = function (obj)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            if (typeof obj == "object")
            {
                var idx = 0;
                var items = this._items;
                while (idx < items.length)
                {
                    if (obj == items[idx].fileitembutton)
                    {
                        return idx;
                    }
                    if (obj == items[idx].fileitemedit)
                    {
                        return idx;
                    }
                    ++idx;
                }
                return -1;
            }
        }
    };

    _pFileUpload.hasValue = function (idx)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var i = 0, cnt = 0;
            var items = this._items;
            if (idx == -1)
            {
                while (i < items.length)
                {
                    if (items[i]._p_value)
                    {
                        ++cnt;
                    }
                    ++i;
                }
                if (cnt == items.length)
                {
                    return true;
                }
                return false;
            }

            if (idx < items.length && items[idx]._p_value)
            {
                return true;
            }
            return false;
        }
    };

    _pFileUpload.upload = function (v)
    {
        var ret = false;
        var uploadurl;

        if (v == undefined)
        {
            if (this._p_uploadurl)
            {
                uploadurl = nexacro._getServiceLocation(this._p_uploadurl, null, null, false, true);
            }
        }
        else
        {
            uploadurl = nexacro._getServiceLocation(v, null, null, false, true);
        }

        if (nexacro._Browser != "Runtime")
        {
            var url = nexacro._getParsedUri(uploadurl);
            if (url.host != undefined && url.protocol != undefined)
            {
                if (!nexacro._isSameOrigin(uploadurl, nexacro._project_absolutepath))
                    this._iscors = true;
            }
        }

        if (uploadurl)
        {
            var items = this._items;
            var len = items ? items.length : 0;
            var i;

            if (nexacro._Browser == "Runtime" && nexacro._OS != "Android")
            {
                var bUseFileInfoArray = false;
                var _total_fileIndex = 0;
                var fileinfo = [];
                var idx = 0;
                for (i = 0; i < len; i++)
                {
                    if (items[i]._files)
                    {
                        //reset file id
                        var sub_file_index = items[i]._files.length;
                        while (sub_file_index > 0)
                        {
                            sub_file_index--;
                            items[i]._files[sub_file_index].id = "upfile" + _total_fileIndex;
                            _total_fileIndex++;

                            if (items[i]._files[sub_file_index] instanceof nexacro.VirtualFile)
                                bUseFileInfoArray = true;
                        }

                        fileinfo[idx] = items[i]._files;
                        idx++;
                    }
                }
                for (i = 0; i < len; i++)
                {
                    if (items[i] && items[i]._p_value)
                    {
                        if (bUseFileInfoArray == true)
                        {
                            // changeItem() 으로 fileitem 이 설정된 경우
                            nexacro._submit(this._unique_id, uploadurl, this._hidden_frame_handle, null, items[i]._p_value, fileinfo);
                        }
                        else
                        {
                            // nexacro._findclick() 으로 fileitem 이 설정된 경우
                            nexacro._submit(this._unique_id, uploadurl, this._hidden_frame_handle, null, items[i]._p_value);
                        }
                        return true;
                    }
                }
            }
            else if (nexacro._Browser == "Runtime" && nexacro._OS == "Android")
            {
                if (len > 1)
                {
                    var fileinfo = [];
                    var idx = 0;
                    for (i = 0; i < len; i++)
                    {
                        if (items[i]._files)
                        {
                            fileinfo[idx] = items[i]._files;
                            idx++;
                        }
                    }
                    nexacro._submit(this._unique_id, uploadurl, this._hidden_frame_handle, null, items[0]._p_value, fileinfo);
                    ret = true;
                }
                else
                {
                    nexacro._submit(this._unique_id, uploadurl, this._hidden_frame_handle, null, items[0]._p_value);
                    ret = true;
                }
            }
            else if (nexacro._OS == "iOS" && nexacro._isHybrid && nexacro._isHybrid() || nexacro._macOSWebView)
            {
                var evttarget = this;
                var _on_manager_onload = function ()
                {
                    return function (status, data, url, errcode, httpcode, loaded, total)
                    {
                        var result;
                        var errorcode = -1;
                        var errormsg = "fail to get";

                        try
                        {
                            if (status == 4)
                            {
                                // skip onprogress event
                            }
                            else
                            {
                                if (data)
                                {
                                    data = data.trimLeft();
                                    var data_type = data.slice(0, 5).toUpperCase();

                                    if (data_type.indexOf("<?XML") == 0) data_type = "XML";
                                    if (data_type.indexOf("SSV") == 0) data_type = "SSV";
                                    if (data_type.indexOf("{") == 0) data_type = "JSON";

                                    if (data_type == "XML")
                                    {
                                        data = nexacro._parseXMLDocument(data);
                                    }

                                    if (nexacro._Deserializer[data_type])
                                    {
                                        result = nexacro._Deserializer[data_type](data);
                                    }

                                    var error_info = result ? result[0] : null;
                                    if (error_info)
                                    {
                                        errorcode = error_info["ErrorCode"];
                                        errormsg = error_info["ErrorMsg"];
                                    }
                                    else
                                    {
                                        errormsg = data;
                                    }

                                    if (errorcode < 0)
                                    {
                                        evttarget.on_fire_onerror(evttarget, "ObjectError", errormsg, evttarget, 9901, null, null, -1);
                                    }
                                    else
                                    {
                                        evttarget.on_fire_onsuccess(result[1], errorcode, errormsg, url, result);
                                    }
                                }
                            }
                        }
                        catch (e)
                        {
                            if (e && e.message)
                            {
                                errormsg = e.message;
                            }

                            evttarget.on_fire_onerror(evttarget, "ObjectError", errormsg, evttarget, 9901, null, null, -1);
                        }
                    };
                };

                var fileinfo = [];
                var fileinfo_offset = 0;
                for (i = 0; i < len; i++)
                {
                    if (items[i]._p_value && items[i]._files)
                    {
                        for (var file_item in items[i]._files)
                        {
                            fileinfo[fileinfo_offset++] = items[i]._files[file_item];
                        }
                    }
                }

                if (fileinfo.length > 0)
                {
                    nexacro._uploadTransferXHR(fileinfo, "", uploadurl, _on_manager_onload());
                    ret = true;
                }
            }
            else
            {
                for (i = 0; i < len; i++)
                {
                    if (items[i]._p_value)
                    {
                        ret = true;
                        if (nexacro._Browser == "MobileSafari" || nexacro._Browser == "Gecko")
                        {
                            nexacro._request_submit(this._unique_id, uploadurl, this);
                        }
                        else
                        {
                            nexacro._submit(this._unique_id, uploadurl, this._hidden_frame_handle, null, items[i]._p_value);
                        }
                        break;
                    }
                }
            }
        }
        return ret;
    };

    //===============================================================
    // nexacro.FileUpload : Event Handler
    //===============================================================
    if (nexacro._Browser == "Runtime")
    {
        _pFileUpload._on_manager_onload = function (status, data, url, errcode, httpcode, errmsg, cookies)
        {
            var result;
            var errorcode = -1;
            var errormsg = "fail to get";

            if (status < 0)  
            {
                // error
                nexacro._onHttpSystemError(this, true, this, errcode, url, httpcode, url, null);
                var commerrorobj = nexacro.MakeCommunicationError(this, errcode, url, httpcode, url, null, cookies);
                this.on_fire_onerror(this, "ObjectError", commerrorobj.message, this, httpcode, null, null, -1);
            }
            else
            {
                // success
                try
                {
                    if (data)
                    {
                        data = data.trimLeft();
                        var data_type = data.slice(0, 5).toUpperCase();

                        if (data_type.indexOf("<?XML") == 0) data_type = "XML";
                        if (data_type.indexOf("SSV") == 0) data_type = "SSV";
                        if (data_type.indexOf("{") == 0) data_type = "JSON";

                        if (data_type == "XML")
                        {
                            data = nexacro._getXMLDocument(this._unique_id, data, url);
                        }

                        if (nexacro._Deserializer[data_type])
                        {
                            result = nexacro._Deserializer[data_type](data);
                        }

                        var error_info = result ? result[0] : null;
                        if (error_info)
                        {
                            errorcode = error_info["ErrorCode"];
                            errormsg = error_info["ErrorMsg"];
                        }

                        if (errorcode < 0)
                        {
                            this.on_fire_onerror(this, "ObjectError", errormsg, this, 9901, null, null, -1);
                        }
                        else
                        {
                            this.on_fire_onsuccess(result[1], errorcode, errormsg, url, result);
                        }
                    }
                    else if (status != 4)
                    {
                        this.on_fire_onerror(this, "ObjectError", errormsg, this, 9901, null, null, -1);
                    }
                }
                catch (e)
                {
                    if (e && e.message)
                        errormsg = e.message;

                    this.on_fire_onerror(this, "ObjectError", errormsg, this, 9901, null, null, -1);
                }
            }
        };
    }
    else
    {
        _pFileUpload._bindUploadDataHandler = function (e)
        {
            var pthis = this._comp;
            if (this.readyState == 4)
            {
                var result;
                var errorcode = -1;
                var errormsg = "fail to get";

                if (this.status == 200)
                {
                    var data = this.responseText.trim();
                    var data_type = data.slice(0, 5).toUpperCase();

                    if (data_type.indexOf("<?XML") == 0) data_type = "XML";
                    if (data_type.indexOf("SSV") == 0) data_type = "SSV";
                    if (data_type.indexOf("{") == 0) data_type = "JSON";

                    if (data_type == "XML")
                    {
                        data = this.responseXML;
                    }

                    if (nexacro._Deserializer[data_type])
                    {
                        result = nexacro._Deserializer[data_type](data);
                    }

                    var error_info = result ? result[0] : null;
                    if (error_info)
                    {
                        errorcode = error_info["ErrorCode"];
                        errormsg = error_info["ErrorMsg"];
                    }

                    if (errorcode < 0)
                    {
                        pthis.on_fire_onerror(pthis, "ObjectError", errormsg, pthis, 9901, null, null, -1);
                    }
                    else
                    {
                        pthis.on_fire_onsuccess(result[1], errorcode, errormsg, this.responseURL, result);
                    }
                }
                else
                {
                    pthis.on_fire_onerror(pthis, "ObjectError", errormsg, pthis, 9901, null, null, -1);
                }
            }
        };

        _pFileUpload._on_manager_onload = function (node, data, url, errcode, httpcode, errmsg)
        {
            var result, xmldoc, data_type;
            var errorcode = -1;
            var errormsg = "fail to get";

            try
            {
                if (this._iscors)
                {
                    nexacro._setPostMessage(this._unique_id, this);
                    this._iscors = false;
                }
                else
                {
                    xmldoc = nexacro._getXMLDocument(this._unique_id, data, url);
                    if (xmldoc)
                    {
                        url = xmldoc.URL ? xmldoc.URL : url;
                        if (url == "about:blank")
                            return;

                        this.context = this._p_parent;

                        var doc_type = nexacro._getContentType(xmldoc);
                        if (doc_type == "XML")
                        {
                            data = xmldoc;
                            data_type = "XML";
                        }
                        else
                        {
                            data = nexacro._getDataFromDOM(xmldoc, this).trimLeft();
                            data_type = data.substring(0, 5).toUpperCase();

                            if (data_type.indexOf("<?XML") == 0) data_type = "XML";
                            if (data_type.indexOf("SSV") == 0) data_type = "SSV";
                            if (data_type.indexOf("{") == 0) data_type = "JSON";
                        }

                        if (nexacro._Deserializer[data_type])
                        {
                            result = nexacro._Deserializer[data_type](data);
                        }

                        var error_info = result ? result[0] : null;
                        if (error_info)
                        {
                            errorcode = error_info["ErrorCode"];
                            errormsg = error_info["ErrorMsg"];
                        }
                        else
                        {
                            errormsg = data;
                        }

                        if (errorcode < 0)
                        {
                            this.on_fire_onerror(this, "ObjectError", errormsg, this, 9901, null, null, -1);
                        }
                        else
                        {
                            this.on_fire_onsuccess(result[1], errorcode, errormsg, url, result);
                        }
                    }
                }
            }
            catch (e)
            {
                if (e && e.message)
                {
                    errormsg = e.message;
                }

                this.on_fire_onerror(this, "ObjectError", errormsg, this, 9901, null, null, -1);
            }
        };
    }

    _pFileUpload.on_after_load = function (messageObj)
    {
        var str = messageObj.message;
        var result, url, data_type;
        var errorcode = -1;
        var errormsg = "failed to get";
        var data = "";
        try
        {
            data_type = str.slice(0, 5).toUpperCase();

            if (data_type.indexOf("SSV") == 0)
            {
                data = str;
                data_type = "SSV";
            }
            else if (data_type.indexOf("{") == 0)
            {
                data = str;
                data_type = "JSON";
            }
            else
            {
                var decode_str = nexacro.trimLeft(decodeURIComponent(str.replace(/\+/g, " ")));
                var xmldoc = nexacro._parseXMLDocument(decode_str);

                url = xmldoc.URL ? xmldoc.URL : xmldoc.url;
                if (url == "about:blank")
                    return;

                this.context = this._p_parent;

                if (nexacro._getContentType(xmldoc) == "XML")
                {
                    data = xmldoc;
                    data_type = "XML";
                }
                else
                {
                    data = nexacro._getDataFromDOM(xmldoc, this).trimLeft();
                    data_type = data.substring(0, 5).toUpperCase();

                    if (data_type.indexOf("SSV") == 0)
                    {
                        data_type = "SSV";
                    }
                    else if (data_type.indexOf("{") == 0)
                    {
                        data_type = "JSON";
                    }
                }
            }

            if (nexacro._Deserializer[data_type])
            {
                result = nexacro._Deserializer[data_type](data);
            }

            var error_info = result ? result[0] : null;
            if (error_info)
            {
                errorcode = (error_info["ErrorCode"] != null) ? error_info["ErrorCode"] : -1;
                errormsg = (error_info["ErrorMsg"] != null) ? error_info["ErrorMsg"] : "";
            }
            else
            {
                errormsg = data;
            }

            if (errorcode < 0)
            {
                this.on_fire_onerror(this, "ObjectError", "failed to get", this, 9901, null, null, -1);
            }
            else
            {
                this.on_fire_onsuccess(result[1], errorcode, errormsg, url, result);
            }

            delete this.context;
        }
        catch (e) // crossdomain or syntax error
        {
            this.on_fire_onerror(this, "ObjectError", errormsg, this, 9901, null, null, -1);
        }
    };

    _pFileUpload._setParamter = nexacro._emptyFn;

    _pFileUpload._on_item_onfindclick = function (obj, e)
    {
        this.set_index(obj._p_index);

        var bHandled = false;
        var index = nexacro._indexOf(this._items, obj);

        if (this._isEnable() && this.enableevent)
        {
            bHandled = this.on_fire_onfindclick(obj, index);

            if (bHandled)
            {
                try
                {
                    nexacro._findclick(this._unique_id, obj.name, obj, this._hidden_frame_handle, this._p_filefilter, this._p_filefilterindex);
                }
                catch (e)
                {
                    var errorobj = nexacro.MakeError("ObjectError", this, "comp_incorrect_file");
                    this.on_fire_onerror(this, errorobj.name, errorobj.message, obj, null, null, null, index);
                }

            }
        }
        return bHandled;
    };

    _pFileUpload._on_item_onitemclick = function (obj, e)
    {
        this.set_index(obj._p_index);

        if (this.visible && this._isEnable() && this.enableevent)
        {
            this.on_fire_onitemclick(obj, obj._p_index);
        }
    };

    //==============================================================================
    // nexacro.FileUpload : Event Handler
    //==============================================================================
    _pFileUpload.on_fire_onerror = function (obj, errortype, errormsg, errorobj, statuscode, requesturi, locationuri, index)
    {
        if (this.onerror && this.onerror._has_handlers)
        {
            var evt = new nexacro.FileUploadErrorEventInfo(obj, "onerror", errortype, errormsg, errorobj, statuscode, requesturi, locationuri, index);
            return this.onerror._fireEvent(this, evt);
        }
        return true;
    };

    _pFileUpload.on_fire_user_onlbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onlbuttondown && this.onlbuttondown._has_handlers)
        {
            var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
            var evt = new nexacro.FileUploadMouseEventInfo(this, "onlbuttondown", button, alt_key, ctrl_key, shift_key, evtinfo_control._p_index, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
            return this.onlbuttondown._fireEvent(this, evt);
        }
        return false;
    };

    _pFileUpload.on_fire_user_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        if (this.onlbuttonup && this.onlbuttonup._has_handlers)
        {
            var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
            var evt = new nexacro.FileUploadMouseEventInfo(this, "onlbuttonup", button, alt_key, ctrl_key, shift_key, evtinfo_control._p_index, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
            return this.onlbuttonup._fireUserEvent(this, evt);
        }
        return false;
    };

    _pFileUpload.on_fire_user_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)
    {
        var items = this._items;
        var idx = this._p_index;
        var E = nexacro.Event;

        var _win = this._getWindow();
        var _win_keydown_elem = (_win && _win._keydown_element) ? _win._keydown_element : null;

        if (keycode == E.KEY_TAB) // KEY_TAB
        {
            if ((shift_key && idx == 0) || (!shift_key && idx == items.length - 1)) // out a range
            {
                this._want_tab = false;
                this.set_index(-1);
            }
            else  // Within a range
            {
                if (shift_key)
                {
                    idx--;
                }
                else
                {
                    idx++;
                }
                this.set_index(idx);
            }

            if (_win_keydown_elem)
            {
                _win_keydown_elem._event_stop = true;
            }
        } // use tabkey
        else
        {
            var itemheight = this._getItemHeight();
            var client_h = this._getClientHeight();
            var page_itemcount = itemheight ? client_h / itemheight : 0;
            var itemcount = Math.ceil(page_itemcount);
            var newpos = this._vscroll_pos;
            var scrollmax = this.vscrollbar.max;

            if (keycode == nexacro.Event.KEY_PAGE_UP)
            {
                newpos = newpos - (itemheight * itemcount);

                if (newpos < 0)
                    newpos = 0;

                this.vscrollbar.set_pos(newpos);
            }
            else if (keycode == nexacro.Event.KEY_PAGE_DOWN)
            {
                newpos = newpos + (itemheight * itemcount);

                if (newpos > scrollmax)
                    newpos = scrollmax;

                this.vscrollbar.set_pos(newpos);
            }

            if (this._env._p_enableaccessibility)
            {
                var focus_up = keycode == E.KEY_UP;
                var focus_down = keycode == E.KEY_DOWN;

                // focus move only accessibility enable true
                var accessibilityenable = this._p_accessibilityenable;
                var buttonaccessibilityenable = this.buttonaccessibilityenable;
                var editaccessibilityenable = this.editaccessibilityenable;

                if (focus_up || focus_down)
                {
                    var _window = this._getWindow();
                    if ((focus_up && idx < 0) || (focus_down && this._buttonFlag && idx == items.length - 1))
                    {
                        this._want_arrow = false;
                    }
                    else  // Within a range
                    {
                        if (editaccessibilityenable || buttonaccessibilityenable)
                        {
                            while (true)
                            {
                                if (focus_up)
                                {
                                    //if (this._editFlag == false && this._buttonFlag == true)
                                    if (!this._editFlag && editaccessibilityenable)
                                    {
                                        this._p_index = -1;
                                        this._editFlag = true;
                                        this._buttonFlag = false;
                                    }
                                    else
                                    {
                                        idx--;
                                        if (buttonaccessibilityenable)
                                        {
                                            if (idx < 0) // move to Filupload
                                            {
                                                if (accessibilityenable)
                                                {
                                                    this._editFlag = false;
                                                    this._buttonFlag = false;
                                                    _window._removeFromCurrentFocusPath(this, false);
                                                    this._setFocus(false);
                                                }
                                                else
                                                {
                                                    this._want_arrow = false;
                                                    break;
                                                }

                                            }
                                            else // move to buttonItem
                                            {
                                                this._p_index = -1;
                                                this._editFlag = false;
                                                this._buttonFlag = true;
                                            }
                                        }
                                        else
                                        {
                                            if (idx > 0)
                                            {
                                                this._buttonFlag = false;
                                                continue;
                                            }
                                            else
                                            {
                                                this._want_arrow = false;
                                                if (accessibilityenable)
                                                {
                                                    this._editFlag = false;
                                                    this._buttonFlag = false;
                                                    _window._removeFromCurrentFocusPath(this, false);
                                                    this._setFocus(false);
                                                }
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    if (!this._editFlag && editaccessibilityenable)
                                    {
                                        idx++;
                                        this._editFlag = true;
                                        this._buttonFlag = false;
                                    }
                                    else
                                    {
                                        if (buttonaccessibilityenable)
                                        {
                                            this._p_index = -1;
                                            this._editFlag = false;
                                            this._buttonFlag = true;
                                        }
                                        else
                                        {
                                            if (idx < items.length - 1)
                                            {
                                                this._editFlag = false;
                                                continue;
                                            }
                                            else
                                            {
                                                this._want_arrow = false;
                                                break;
                                            }
                                        }
                                    }
                                }
                                this.set_index(idx);
                                this._want_arrow = true;
                                if (_win_keydown_elem)
                                {
                                    _win_keydown_elem._event_stop = true;
                                }
                                break;
                            }
                        }
                    }
                }
                else
                {
                    this._want_arrow = false;
                }
            } // enableaccessibility
        } // no use tabkey        
        return nexacro.Component.prototype.on_fire_user_onkeydown.call(this, keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
    };
    _pFileUpload._on_focus = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        nexacro.Component.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);

        var idx, focus_dir;

        var items = this._items;
        var itemLen = items.length;
        const enableaccessibility = this._env._p_enableaccessibility;
        if (itemLen)
        {
            this._want_tab = true;
            focus_dir = evt_name == "shifttabkey";
            if (evt_name == "shifttabkey" || evt_name == "tabkey")
            {
                this._editFlag = false;
                this._buttonFlag = true;
                if (focus_dir)
                {
                    idx = this._p_index < 0 ? itemLen - 1 : this._p_index;
                }
                else
                {
                    idx = this._p_index < 0 ? 0 : this._p_index;
                    this._first_focus = true;
                }
                this._p_index = -1;

                this.set_index(idx);
            }
            else
            {
                focus_dir = evt_name == "upkey";
                if (enableaccessibility && this._isAccessibilityEnable())
                {
                    this._editFlag = false;
                    this._buttonFlag = false;
                    this._want_arrow = true;

                    var accessibility = nexacro._toBoolean(this._p_accessibilityenable);
                    var editaccessibility = nexacro._toBoolean(this.editaccessibilityenable);
                    var buttonaccessibility = nexacro._toBoolean(this.buttonaccessibilityenable);

                    if (focus_dir)  //upkey
                    {
                        this._p_index = -1;
                        idx = itemLen - 1;

                        if (buttonaccessibility)
                        {
                            this._buttonFlag = true;
                        }
                        else if (editaccessibility)
                        {
                            this._editFlag = true;
                        }
                    }
                    else      //downkey
                    {
                        idx = -1;
                        if (accessibility == false)
                        {
                            idx = 0;
                            this._p_index = -1;

                            if (editaccessibility)
                            {
                                this._editFlag = true;
                            }
                            else if (buttonaccessibility)
                            {
                                this._buttonFlag = true;
                            }
                            this._first_focus = (this._editFlag || this._buttonFlag) ? true : false;
                        }
                    }

                    this.set_index(idx);
                } // enableaccessibility    
            }

            if (enableaccessibility)
            {
                this._first_focus = false;
            }
        }
    };

    _pFileUpload._find_item_status = function (item)
    {
        this._editFlag = (item.fileitemedit._status == "focused");
        this._buttonFlag = (item.fileitembutton._status == "focused");
    };

    _pFileUpload.on_fire_ondeleteitem = function (obj, index)
    {
        if (this.ondeleteitem && this.ondeleteitem._has_handlers)
        {
            var evt = new nexacro.FileUploadItemEventInfo(obj, "ondeleteitem", index);
            this.ondeleteitem._fireEvent(this, evt);
        }
    };

    _pFileUpload.on_fire_onfindclick = function (obj, index)
    {
        if (this.onfindclick && this.onfindclick._has_handlers)
        {
            var evt = new nexacro.FileUploadItemEventInfo(this, "onfindclick", index);
            return this.onfindclick._fireCheckEvent(this, evt);
        }

        return true;
    };

    _pFileUpload.on_fire_onitemchanged = function (obj, index, oldvalue, newvalue)
    {
        if (this.onitemchanged && this.onitemchanged._has_handlers)
        {
            var evt = new nexacro.FileUploadItemChangeEventInfo(obj, "onitemchanged", index, oldvalue, newvalue);
            this.onitemchanged._fireEvent(this, evt);
        }
    };

    _pFileUpload.on_fire_onitemclick = function (obj, index)
    {
        if (this.onitemclick && this.onitemclick._has_handlers)
        {
            var evt = new nexacro.FileUploadItemEventInfo(this, "onitemclick", index);
            this.onitemclick._fireEvent(this, evt);
        }
    };

    _pFileUpload.on_fire_onappenditem = function (obj, index)
    {
        if (this.onappenditem && this.onappenditem._has_handlers)
        {
            var evt = new nexacro.FileUploadItemEventInfo(obj, "onappenditem", index);
            this.onappenditem._fireEvent(this, evt);
        }
    };

    _pFileUpload.on_fire_onsuccess = function (ds, code, msg, url, variables)
    {
        var application = this._getApplication();
        if (application)
            application._endCommProgress();

        if (this.onsuccess && this.onsuccess._has_handlers)
        {
            var evt;
            if (variables && variables.length > 0)
            {
                evt = new nexacro.FileUploadEventInfo(this, "onsuccess", ds, code, msg, url);
                return this.onsuccess._fireEvent(this, evt);
            }
            else
            {
                evt = new nexacro.FileUploadEventInfo(this, "onsuccess", ds, undefined, undefined, url);
                return this.onsuccess._fireEvent(this, evt);
            }
        }
    };

    _pFileUpload.on_fire_oncontextmenu = function (from_comp, from_refer_comp, button, canvasX, canvasY, clientX, clientY, alt_key, ctrl_key, shift_key, screenX, screenY, meta_key)
    {
        if (this.oncontextmenu && this.oncontextmenu._has_handlers)	
        {
            var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
            var evt = new nexacro.FileUploadContextMenuEventInfo(this, "oncontextmenu", button, alt_key, ctrl_key, shift_key, evtinfo_control._p_index, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
            return this.oncontextmenu._fireEvent(this, evt);
        }
        return false;
    };

    _pFileUpload.on_fire_user_onrbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)	
    {
        if (this.onrbuttondown && this.onrbuttondown._has_handlers)	
        {
            var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
            var evt = new nexacro.FileUploadMouseEventInfo(this, "onrbuttondown", button, alt_key, ctrl_key, shift_key, evtinfo_control._p_index, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
            return this.onrbuttondown._fireEvent(this, evt);
        }
        return false;
    };

    _pFileUpload.on_fire_user_onrbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)	
    {
        if (this.onrbuttonup && this.onrbuttonup._has_handlers)	
        {
            var evtinfo_control = this._getEventInfoComponent(from_refer_comp);
            var evt = new nexacro.FileUploadMouseEventInfo(this, "onrbuttonup", button, alt_key, ctrl_key, shift_key, evtinfo_control._p_index, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
            return this.onrbuttonup._fireUserEvent(this, evt);
        }
        return false;
    };

    //===============================================================
    // nexacro.FileUpload : Logical Part
    //===============================================================
    _pFileUpload._createFileItem = function (index)
    {
        var create_only = this._is_created ? false : true;
        var unique = this._p_itemcount < 1 ? this._last_id = 0 : ++this._last_id;

        var item = new nexacro._FileUploadItemControl("upfile" + unique, 0, 0, 0, 0, null, null, null, null, null, null, this);
        item._setControl();
        item._setItemInfo(index, this._p_buttontext);
        item.createComponent(create_only);

        item._setEventHandler("onfindclick", this._on_item_onfindclick, this);
        item._setEventHandler("onitemclick", this._on_item_onitemclick, this);

        return item;
    };

    _pFileUpload._recalcLayout = function ()
    {
        var items = this._items;
        var item_len = items.length;
        if (!item_len)
            return;

        var item_left = this._getClientLeft();
        var item_top;
        var item_width = this._getClientWidth();
        var item_height = this._getItemHeight();

        for (var i = 0; i < item_len; i++)
        {
            item_top = item_height * i;

            items[i].move(item_left, item_top, item_width, item_height, null, null);
        }
    };

    _pFileUpload._updateFileList = function ()
    {
        this.filelist = [];
        for (var i = 0, item_len = this._items.length, files; i < item_len; i++)
        {
            files = this._items[i]._files;
            if (files)
            {
                for (var j = 0, files_len = files.length, vfile; j < files_len; j++)
                {
                    vfile = new nexacro.VirtualFile("upfile" + i + "-" + j, "", files[j]);

                    vfile._setFullPath(files[j].fullpath || "");
                    vfile._setPath(files[j].path || "");
                    vfile._setFileName(files[j].name || "");

                    this.filelist.push(vfile);
                }
            }
        }
    };

    //===============================================================
    // nexacro.FileUpload : Util Function
    //===============================================================
    _pFileUpload._setText = function (v)
    {
        if (this._p_text != v)
        {
            this._p_text = v;
        }
    };

    _pFileUpload._setValue = function (v)
    {
        if (this._p_value != v)
        {
            this._p_value = v;
        }
    };

    _pFileUpload._setControlFlag = function (item)
    {
        this._editFlag = (item.fileitemedit._status == "focused");
        this._buttonFlag = (item.fileitembutton._status == "focused");
    };

    _pFileUpload._getItem = function (index)
    {
        if (index >= 0 && this._items.length > 0)
        {
            return this._items[index];
        }

        return null;
    };

    _pFileUpload._getItemHeight = function ()
    {
        var item = this._items[0];
        if (!item)
            return 0;

        var itemheight = this._p_itemheight;
        if (itemheight)
            return itemheight;

        return item._on_getFitSize()[1];
    };

    _pFileUpload._getEventInfoComponent = function (refer_comp)
    {
        while (!refer_comp._is_eventinfo_control)
        {
            refer_comp = refer_comp._p_parent;
        }
        return refer_comp;
    };

    _pFileUpload._isPopupFrame = function ()
    {
        return this._onPopupWin;
    };

    _pFileUpload = null;

    //delete _pFileUpload;

    //==============================================================================
    // nexacro._FileItemControl
    //==============================================================================
    nexacro._FileUploadItemControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        if (nexacro._OS == "iOS" && nexacro._isHybrid && nexacro._isHybrid() || nexacro._macOSWebView)
        {
            this._id = nexacro.Device.makeID();
            nexacro.Device._userCreatedObj[this._id] = this;

            var params = '""';
            var json = {
                id: this._id,
                div: "FileUpload",
                method: "constructor",
                params: params
            };

            var jsonstr = JSON.stringify(json);
            nexacro.Device.exec(jsonstr);
        }
    };

    var _pFileUploadItemControl = nexacro._createPrototype(nexacro.Component, nexacro._FileUploadItemControl);
    nexacro._FileUploadItemControl.prototype = _pFileUploadItemControl;
    _pFileUploadItemControl._type_name = "FileUploadItemControl";
    _pFileUploadItemControl._is_subcontrol = true;

    /* control */
    _pFileUploadItemControl.fileitemedit = null;
    _pFileUploadItemControl.fileitembutton = null;

    /* default properties */
    _pFileUploadItemControl._p_buttontext = "find";
    _pFileUploadItemControl._p_index = 0;
    _pFileUploadItemControl._p_value = undefined;

    /* internal variable */
    _pFileUploadItemControl._oldvalue = "";
    _pFileUploadItemControl._newvalue = "";
    _pFileUploadItemControl._p_index = 0;
    _pFileUploadItemControl._p_accessibilityrole = "none";

    /* event list */
    _pFileUploadItemControl._event_list =
    {
        "onfindclick": 1, "onitemclick": 1
    };

    //===============================================================
    // nexacro._FileUploadItemControl : Create & Destroy & Update
    //===============================================================
    _pFileUploadItemControl.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var itemedit = this.fileitemedit = new nexacro._FileUploadItemEditControl("fileuploaditemedit", 0, 0, 0, 0, null, null, null, null, null, null, this);
            var itembutton = this.fileitembutton = new nexacro._FileUploadItemButtonControl("fileuploaditembutton", 0, 0, 0, 0, null, null, null, null, null, null, this);

            itemedit.set_readonly("true");
            itemedit.createComponent(true);

            itembutton.set_text(this._p_buttontext);
            itembutton.createComponent(true);
        }
    };

    _pFileUploadItemControl.on_created_contents = function ()
    {
        var parent = this._p_parent;
        if (parent)
        {
            nexacro._append_hidden_item(parent._unique_id, this.name, this._on_itemedit_onchange, this, parent._hidden_frame_handle, parent._p_multiselect);
        }

        var itemedit = this.fileitemedit;
        var itembutton = this.fileitembutton;

        itemedit.on_created();
        itemedit._setEventHandler("oneditclick", this._on_itemedit_oneditclick, this);
        itemedit._setEventHandler("onlbuttondown", this._on_itemedit_oneditlbuttondown, this);

        itembutton.on_created();
        itembutton._setEventHandler("onclick", this._on_itembutton_onfindclick, this);
        itembutton._setEventHandler("onlbuttondown", this._on_itembutton_onfindlbuttondown, this);

        //this._setAccessibilityActiveDescendant(itembutton);
    };

    _pFileUploadItemControl.on_destroy_contents = function ()
    {
        if (this.fileitemedit)
        {
            this._p_parent.filepathedits.delete_item(this.id);

            this.fileitemedit.destroy();
            this.fileitemedit = null;
        }
        if (this.fileitembutton)
        {
            this._p_parent.filefindbuttons.delete_item(this.id);

            this.fileitembutton.destroy();
            this.fileitembutton = null;
        }

        if (this._files)
        {
            this._files = null;
        }

        var parent = this._p_parent;
        nexacro._remove_hidden_item(parent._unique_id, this.name, parent._hidden_frame_handle);
        if (this._input_node)
            this._input_node = null;

        if (nexacro._OS == "iOS" && nexacro._isHybrid && nexacro._isHybrid() || nexacro._macOSWebView)
        {
            delete nexacro.Device._userCreatedObj[this._id];

            var params = '""';
            var json = {
                id: this._id,
                div: "FileUpload",
                method: "destroy",
                params: params
            };

            var jsonstr = JSON.stringify(json);
            nexacro.Device.exec(jsonstr);
        }
    };

    _pFileUploadItemControl.on_create_contents_command = function ()
    {
        var str = "";
        var itemedit = this.fileitemedit;
        if (itemedit)
            str += itemedit.createCommand();

        var itembutton = this.fileitembutton;
        if (itembutton)
            str += itembutton.createCommand();

        return str;
    };

    _pFileUploadItemControl.on_attach_contents_handle = function (win)
    {
        var itemedit = this.fileitemedit;
        var itembutton = this.fileitembutton;

        itemedit.attachHandle(win);
        itemedit._setEventHandler("oneditclick", this._on_itemedit_oneditclick, this);
        itemedit._setEventHandler("onlbuttondown", this._on_itemedit_oneditlbuttondown, this);

        itembutton.attachHandle(win);
        itembutton._setEventHandler("onclick", this._on_itembutton_onfindclick, this);
        itembutton._setEventHandler("onlbuttondown", this._on_itembutton_onfindlbuttondown, this);

        var parent = this._p_parent;
        nexacro._append_hidden_item(parent._unique_id, this.name, this._on_itemedit_onchange, this, parent._hidden_frame_handle, parent._multiselect);

        ///this._setAccessibilityActiveDescendant(itembutton);
    };

    _pFileUploadItemControl.on_change_containerRect = function (width, height)
    {
        if (this._is_created_contents)
        {
            this._recalcLayout();
        }
    };

    //===============================================================
    // nexacro._FileUploadItemControl : Override
    //===============================================================
    _pFileUploadItemControl.on_getIDCSSSelector = function ()
    {
        return "fileuploaditem";
    };

    _pFileUploadItemControl._on_getFitSize = function ()
    {
        var elem = this.getElement();
        if (elem)
        {
            var total_w = 0;
            var total_h = 0;

            var itemedit_size = [0, 0];
            var itembutton_size = [0, 0];

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

            var itemedit = this.fileitemedit;
            if (itemedit)
            {
                itemedit_size = itemedit._on_getFitSize();
            }

            var itembutton = this.fileitembutton;
            if (itembutton)
            {
                itembutton_size = itembutton._on_getFitSize();
            }

            var itemheight = this._getPropItemHeight();
            if (itemheight == null)
            {
                itemheight = Math.max(itemedit_size[1], itembutton_size[1]);
            }

            var buttonsize = this._getPropButtonSize();
            if (buttonsize == null)
            {
                buttonsize = itembutton_size[0];
            }

            total_w += buttonsize + itemedit_size[1];
            total_h += itemheight;

            return [total_w, total_h];
        }

        return [this._adjust_width, this._adjust_height];
    };

    //===============================================================
    // nexacro._FileUploadItemControl : Event Handlers
    //===============================================================
    _pFileUploadItemControl._on_itemedit_oneditclick = function (obj, e)
    {
        if (this.onitemclick && this.onitemclick._has_handlers)
        {
            this.onitemclick._fireEvent(this, e);
        }
        return false;
    };

    _pFileUploadItemControl._on_itemedit_oneditlbuttondown = function (obj, e)
    {
        this._accessibility_find_focus_flag(true, false);
        this._p_parent.set_index(this._p_index);
    };

    _pFileUploadItemControl._on_itemedit_onchange = function (value, files, value_arr)
    {
        if (nexacro._OS == "iOS" && nexacro._isHybrid && nexacro._isHybrid() || nexacro._macOSWebView)
        {
            var objData = value;
            value = "";
            value_arr = [];

            for (var i = 0; i < objData.virtualfiles.length; i++)
            {
                value += objData.virtualfiles[i].filename;
                value += ", ";
                value_arr[i] = objData.virtualfiles[i].filename;
            }

            if (!!value)
            {
                value = value.substr(0, value.length - 2);
            }

            files = objData.virtualfiles;
        }

        if (this._p_value != value)
        {
            this._p_value = value;
            this._oldvalue = this._newvalue;
            this._newvalue = value_arr;

            var fileitemedit = this.fileitemedit;
            if (fileitemedit)
            {
                fileitemedit.set_value(value);
            }

            var fileupload = this._p_parent;
            if (fileupload)
            {
                fileupload.set_index(this._p_index);
                fileupload._setText(value);
                fileupload._setValue(value);
            }

            if (files)
            {
                this._files = files;
                if (fileupload)
                    fileupload._updateFileList();
            }

            fileupload.on_fire_onitemchanged(this, this._p_index, this._oldvalue, this._newvalue);
        }
    };

    _pFileUploadItemControl._on_itembutton_onfindclick = function (obj, e)
    {
        if (this.onfindclick && this.onfindclick._has_handlers)
        {
            return this.onfindclick._fireCheckEvent(this, e);
        }
        return false;
    };

    _pFileUploadItemControl._on_itembutton_onfindlbuttondown = function (obj, e)
    {
        this._accessibility_find_focus_flag(false, true);
        this._p_parent.set_index(this._p_index);
    };

    //===============================================================
    // nexacro._FileUploadItemControl : Logical Part
    //===============================================================
    _pFileUploadItemControl._recalcLayout = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var itemedit = this.fileitemedit;
            var itembutton = this.fileitembutton;

            var client_w = this._getClientWidth();
            var client_h = this._getClientHeight();

            var itembutton_size = [0, 0];
            if (itembutton)
            {
                itembutton_size = itembutton._on_getFitSize();
            }

            var itemheight = this._getPropItemHeight();
            if (itemheight == null)
            {
                var itemedit_size = [0, 0];

                if (itemedit)
                {
                    itemedit_size = itemedit._on_getFitSize();
                }

                itemheight = Math.max(itemedit_size[1], itembutton_size[1]);
            }
            else
            {
                if (itemheight > client_h)
                    itemheight = client_h;
            }

            var buttonsize = this._getPropButtonSize();
            if (buttonsize == null)
            {
                buttonsize = itembutton_size[0];
            }

            if (client_w < buttonsize)
            {
                buttonsize = client_w;
            }

            var edit_l = this._getClientLeft();
            var edit_t = this._getClientTop();
            var edit_w = client_w - buttonsize;
            var edit_h = itemheight;

            var button_l = edit_l + edit_w;
            var button_t = edit_t;
            var button_w = buttonsize;
            var button_h = itemheight;

            if (itemedit)
            {
                itemedit.move(edit_l, edit_t, edit_w, edit_h, null, null);
            }

            if (itembutton)
            {
                itembutton.move(button_l, button_t, button_w, button_h, null, null);
            }
        }
    };

    //===============================================================
    // nexacro._FileUploadItemControl : Util Function
    //===============================================================
    _pFileUploadItemControl._setItemInfo = function (index, buttontext)
    {
        this._p_index = index;
        this._p_buttontext = buttontext;
    };

    _pFileUploadItemControl._getPropButtonSize = function ()
    {
        var fileupload = this._p_parent;
        if (fileupload)
        {
            return fileupload._p_buttonsize;
        }

        return;
    };

    _pFileUploadItemControl._getPropItemHeight = function ()
    {
        var fileupload = this._p_parent;
        if (fileupload)
        {
            return fileupload._p_itemheight;
        }

        return;
    };

    _pFileUploadItemControl._accessibility_find_focus_flag = function (editflag, buttonflag)
    {
        if (this._env._p_enableaccessibility)
        {
            this._p_parent._editFlag = editflag;
            this._p_parent._buttonFlag = buttonflag;
        }
    };

    _pFileUploadItemControl._isPopupFrame = function ()
    {
        return this._p_parent._onPopupWin;
    };

    _pFileUploadItemControl._changeFiles = function (files)
    {
        this._files = [];
        if (files)
        {
            var file_list = [];
            this._files.length = files.length;
            var v_file;
            for (var loopI = 0; loopI < this._files.length; loopI++)
            {
                v_file = new nexacro.VirtualFile("upfile" + this._p_index + "-" + loopI);
                var filename = files[loopI];
                var nIdx = filename.lastIndexOf("\\");
                if (nIdx > 0)
                {
                    v_file.fullpath = filename;
                    v_file.path = filename.substring(0, nIdx + 1);
                    v_file.filename = filename.substring(nIdx + 1);
                }
                else
                {
                    v_file.filename = filename;
                }
                file_list[loopI] = v_file;
            }
            this._files = file_list;
        }
        else
        {
            this._files = [];
        }
    };

    //delete _pFileUploadItemControl;

    //==============================================================================
    // nexacro._FileUploadItemEditControl
    //==============================================================================
    nexacro._FileUploadItemEditControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Edit.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pFileUploadItemEditControl = nexacro._createPrototype(nexacro.Edit, nexacro._FileUploadItemEditControl);
    nexacro._FileUploadItemEditControl.prototype = _pFileUploadItemEditControl;
    _pFileUploadItemEditControl._type_name = "EditControl";

    /* status */
    _pFileUploadItemEditControl._is_subcontrol = true;
    _pFileUploadItemEditControl._is_eventinfo_control = false;

    //===============================================================
    // nexacro._FileUploadItemEditControl : Override
    //===============================================================
    _pFileUploadItemEditControl._getAccessibilityLabel = function (accessibility)
    {
        var label = "";
        if (this._p_parent._p_parent._first_focus)
        {
            var comp = this._p_parent._p_parent;
            var control_elem = comp.getElement();
            if (control_elem)
            {
                label = control_elem._makeAccessibilityLabelbyReadtype();
            }
        }
        label += " " + nexacro.Component.prototype._getAccessibilityLabel.call(this, accessibility);
        return label;
    };

    _pFileUploadItemEditControl.on_focus_basic_action = function (self_flag, evt_name)
    {
        if (this._isAccessibilityEnable())
            this.on_apply_accessibility();

        return nexacro.Component.prototype.on_focus_basic_action.call(this, self_flag, evt_name);
    };

    _pFileUploadItemEditControl = null;
    //delete _pFileUploadItemEditControl;

    //==============================================================================
    // nexacro._FileUploadItemButtonControl
    //==============================================================================
    nexacro._FileUploadItemButtonControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pFileUploadItemButtonControl = nexacro._createPrototype(nexacro.Button, nexacro._FileUploadItemButtonControl);
    nexacro._FileUploadItemButtonControl.prototype = _pFileUploadItemButtonControl;
    _pFileUploadItemButtonControl._type_name = "ButtonControl";

    /* status */
    _pFileUploadItemButtonControl._is_subcontrol = true;
    _pFileUploadItemButtonControl._is_eventinfo_control = false;

    //===============================================================
    // nexacro._FileUploadItemButtonControl : Override
    //===============================================================
    _pFileUploadItemButtonControl._getAccessibilityLabel = function (accessibility)
    {
        var label = "";
        if (this._p_parent._p_parent._first_focus)
        {
            var comp = this._p_parent._p_parent;
            var control_elem = comp.getElement();
            if (control_elem)
            {
                label = control_elem._makeAccessibilityLabelbyReadtype();
            }
        }
        label += " " + nexacro.Component.prototype._getAccessibilityLabel.call(this, accessibility);
        return label;
    };

    _pFileUploadItemButtonControl.on_keyup_default_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        var _win = this._getWindow();
        if (_win)
        {
            var elem = _win._cur_ldown_elem || _win._keydown_element;
            if (elem == this._cur_ldown_elem)
            {
                if (keycode == 13 || keycode == 32) // 13 'enter' , 32 'space'
                {
                    this._click(keycode);
                }
            }
        }

        this._cur_ldown_elem = null;
    };

    _pFileUploadItemButtonControl = null;
    //delete _pFileUploadItemButtonControl;
}