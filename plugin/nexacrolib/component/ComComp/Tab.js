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

//==============================================================================
// nexacro.TabIndexChangeEventInfo
//==============================================================================    
nexacro.TabIndexChangeEventInfo = function (obj, id, postindex, preindex)
{
    this.id = this.eventid = id || "ontabindexchange";
    this.fromobject = this.fromreferenceobject = obj;

    this.postindex = postindex;
    this.preindex = preindex;
};
var _pTabIndexChangeEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ChangeEventInfo);
nexacro.TabIndexChangeEventInfo.prototype = _pTabIndexChangeEventInfo;
_pTabIndexChangeEventInfo._type_name = "TabIndexChangeEventInfo";

_pTabIndexChangeEventInfo = null;

//====================================================================
// nexacro.TabMouseEventInfo
//====================================================================
nexacro.TabMouseEventInfo = function (obj, id, index, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
{
    nexacro.MouseEventInfo.call(this, obj, id || "onextrabuttonclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);

    this.index = index;
};
var _pTabMouseEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.MouseEventInfo);
nexacro.TabMouseEventInfo.prototype = _pTabMouseEventInfo;
_pTabMouseEventInfo._type_name = "TabMouseEventInfo";

_pTabMouseEventInfo = null;

if (!nexacro.Tab)
{
    nexacro.Tab = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._tabbuttonitems = [];                  //nexacro.TabButtonItem
        this._p_tabpages = new nexacro.Collection();   //nexacro.Tabpage
    };
    var _pTab = nexacro._createPrototype(nexacro.Component, nexacro.Tab);
    nexacro.Tab.prototype = _pTab;

    _pTab._type_name = "Tab";
    _pTab._p_prevbutton = null;        // nexacro.Button
    _pTab._p_nextbutton = null;        // nexacro.Button

    /* default properties */
    _pTab._p_multiline = false;
    _pTab._p_tabindex = -1;
    _pTab._p_focusacceptable = false;
    _pTab._p_usecontrolkey = true;
    _pTab._p_rotatetext = false;
    _pTab._p_tabjustify = false;
    _pTab._p_selectchangetype = "down";
    _pTab._p_tabposition = "top";
    _pTab._p_extrabutton = null;
    _pTab._p_preload = false;
    _pTab._p_tabbuttongap = undefined;
    _pTab._p_tabbuttonstartgap = undefined;
    _pTab._p_usetabbutton = true;  // todo
    _pTab._bshow_tabpage_accordion = false;
    _pTab._p_tabstyle = "normal";
    _pTab._buse_tabbuttonicon = true;
    _pTab._p_showtabbuttonicon = false;
    _pTab._p_tabbuttoniconsize = null;

    /* accessibility */
    _pTab._p_accessibilityrole = "tab";

    _pTab._default_spinbutton_size = { width: 14, height: 14 };
    _pTab._extrabutton_size = null;    // {width,height}
    _pTab._tabbuttonicon_size = null;    // {width,height}

    _pTab._prevbutton_size = null;
    _pTab._nextbutton_size = null;

    _pTab._prevbutton_extrasize = null;
    _pTab._nextbutton_extrasize = null;

    _pTab._is_containerset = true;
    _pTab._is_changed_focus = false;
    _pTab._init_tabindex = 0;
    _pTab._next_button_idx = 0;
    _pTab._show_button_cnt = 0;

    _pTab._event_list =
    {
        "onclick": 1, "ondblclick": 1, "onkeypress": 1, "onkeydown": 1, "onkeyup": 1, "onkillfocus": 1, "onsetfocus": 1,
        "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1, "onlbuttondown": 1, "onlbuttonup": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmove": 1, "onsize": 1, "onrbuttondown": 1, "onrbuttonup": 1,
        "oncontextmenu": 1,
        //added event
        "onchanged": 1, "onspin": 1, "canchange": 1, "oneditclick": 1, "onextrabuttonclick": 1, "onmouseup": 1, "onmousedown": 1,
        // Touch,TouchGesture
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1
    };

    /* internal variable */

    // ====================================================================
    // nexacro.Tab : Create & Update
    // ====================================================================
    _pTab.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            this._createSpinButton(true);
            this._createTabpages(true);
        }
    };

    _pTab.on_created_contents = function (_window)
    {
        var tabpages = this._p_tabpages;
        var tabpages_length = tabpages.length;
        var tabbuttonitems = this._tabbuttonitems;
        var tabbuttonitems_length = tabbuttonitems.length;

        for (var i = 0; i < tabpages_length; i++)
        {
            tabpages[i].on_created(_window);
        }

        for (i = 0; i < tabbuttonitems_length; i++)
        {
            tabbuttonitems[i].on_created(_window);
        }

        if (this._p_nextbutton)
        {
            this._p_nextbutton.on_created(_window);
        }

        if (this._p_prevbutton)
        {
            this._p_prevbutton.on_created(_window);
        }
        this._is_created = true;

        this.on_apply_tabindex(this._init_tabindex);
        this._rearrangeContents();

        for (var i = 0; i < tabpages_length; i++)
        {
            tabpages[i]._createForm(_window);
            if (this._p_preload)
                tabpages[i]._on_apply_url();
        }
    };

    _pTab.on_destroy_contents = function ()
    {
        var tabpages = this._p_tabpages;
        var tabpages_length = tabpages.length;
        var tabbuttonitems = this._tabbuttonitems;
        var tabbuttonitems_length = tabbuttonitems.length;

        //this.tabpages;

        if (this._p_nextbutton)
        {
            this._p_nextbutton.destroy();
            this._p_nextbutton = null;
        }

        if (this._p_prevbutton)
        {
            this._p_prevbutton.destroy();
            this._p_prevbutton = null;
        }

        for (var i = tabbuttonitems_length - 1; i >= 0; i--)
        {
            tabbuttonitems[i].destroy();
            tabbuttonitems.splice(i, 1);
        }

        for (i = tabpages_length - 1; i >= 0; i--)
        {
            tabpages[i].destroyComponent();
        }

        this._p_tabpages.clear();

        this._p_tabpages = null;
        this._tabbuttonitems = null;

        this._prevbutton_size = null;
        this._nextbutton_size = null;
        this._show_button_cnt = 0;
    };

    _pTab.on_create_contents_command = function ()
    {
        var str = "";

        var tabpages = this._p_tabpages;
        var tabpages_length = tabpages.length;
        var tabbuttonitems = this._tabbuttonitems;
        var tabbuttonitems_length = tabbuttonitems.length;

        for (var i = 0; i < tabpages_length; i++)
        {
            str += tabpages[i].createCommand();
        }

        if (this._p_prevbutton)
        {
            str += this._p_prevbutton.createCommand();
        }

        for (i = 0; i < tabbuttonitems_length; i++)
        {
            str += tabbuttonitems[i].createCommand();
        }

        if (this._p_nextbutton)
        {
            str += this._p_nextbutton.createCommand();
        }

        return str;
    };

    _pTab.on_attach_contents_handle = function (win)
    {
        var tabpages = this._p_tabpages;
        var tabpages_length = tabpages.length;
        var tabbuttonitems = this._tabbuttonitems;
        var tabbuttonitems_length = tabbuttonitems.length;

        if (this._p_nextbutton)
        {
            this._p_nextbutton.attachHandle(win);
        }

        if (this._p_prevbutton)
        {
            this._p_prevbutton.attachHandle(win);
        }

        for (var i = 0; i < tabpages_length; i++)
        {
            tabpages[i].attachHandle(win);
        }

        for (i = 0; i < tabbuttonitems_length; i++)
        {
            tabbuttonitems[i].attachHandle(win);
        }

        this._is_created = true;

        this.on_apply_tabindex(this._init_tabindex);
        this._rearrangeContents();

        for (var i = 0; i < tabpages_length; i++)
        {
            tabpages[i]._attachForm(win);
            if (this._p_preload)
                tabpages[i]._on_apply_url();
        }

        this._init_tabindex = -1;
    };

    _pTab.on_change_containerRect = function (width, height)
    {
        this._rearrangeContents();
    };


    //===============================================================
    // nexacro.Tab : Override
    //===============================================================
    /* url load된 tabpage의 beforeclose 처리 */
    _pTab._on_beforeclose = function (root_closing_comp)
    {
        if (!this._is_alive)
            return;

        var tabpage, msg = "";
        var tabpages = this._p_tabpages;
        var len = tabpages.length;
        for (var i = 0; i < len; i++)
        {
            tabpage = tabpages[i];
            msg = tabpage._on_beforeclose(root_closing_comp);
        }

        return msg;
    };

    _pTab._on_bubble_beforeclose = function (root_closing_comp, event_bubbles, fire_comp, refer_comp)
    {
        var p_form = this._getParentForm();
        if (p_form && p_form._on_bubble_beforeclose)
        {
            return p_form._on_bubble_beforeclose(root_closing_comp, event_bubbles, fire_comp, refer_comp);
        }
        return "";
    };

    /* url load된 tabpage의 close 처리 */
    _pTab._on_close = function ()
    {
        if (!this._is_alive)
            return;

        var tabpage;
        var tabpages = this._p_tabpages;
        var len = tabpages.length;
        for (var i = 0; i < len; i++)
        {
            tabpage = tabpages[i];
            tabpage._on_close();
        }
    };

    _pTab._on_bubble_close = function (event_bubbles, fire_comp, refer_comp)
    {
        var p_form = this._getParentForm();
        if (p_form && p_form._on_bubble_close)
        {
            return p_form._on_bubble_close(event_bubbles, fire_comp, refer_comp);
        }
    };

    _pTab._on_activate = function ()
    {
        nexacro.Component.prototype._on_activate.call(this);

        var tabpage = this._p_tabpages[this._p_tabindex];
        if (tabpage && tabpage._p_form)
            tabpage._p_form._on_activate();

        return true;
    };

    _pTab._on_deactivate = function ()
    {
        nexacro.Component.prototype._on_deactivate.call(this);

        var tabpage = this._p_tabpages[this._p_tabindex];
        if (tabpage && tabpage._p_form)
            tabpage._p_form._on_deactivate();

        return true;
    };

    _pTab.getOwnerFrame = function ()
    {
        return this._getOwnerFrame();
    };

    _pTab.on_apply_prop_enable = function (v)
    {
        var tabpages = this._p_tabpages;
        var tabpages_length = tabpages.length;
        var tabpage;
        var prevbutton = this._p_prevbutton;
        var nextbutton = this._p_nextbutton;

        for (var i = 0; i < tabpages_length; i++)
        {
            tabpage = tabpages[i];
            tabpage._setEnable(v);
        }

        if (prevbutton)
            prevbutton._setEnable(v);
        if (nextbutton)
            nextbutton._setEnable(v);

    };

    _pTab.on_fire_sys_onaccessibilitygesture = function (direction, fire_comp, refer_comp)
    {
        var next_obj = null;
        var tabindex = this._getTabIndex();

        if (direction)
        {
            if (this._accessibility_tabindex == tabindex)
            {
                next_obj = this._child_list[tabindex];
            }
            else
            {
                this._accessibility_tabindex++;
                if (this._accessibility_tabindex < this._p_tabpages.length)
                {
                    next_obj = this._tabButtons[this._accessibility_tabindex];
                }
                else
                {
                    this._accessibility_tabindex = -1;
                    this._accessibility_is_next = true;
                    next_obj = this.parent._searchNextTabFocus(this, undefined, undefined, 3)[0];
                }
            }
        }
        else
        {
            if (this._accessibility_tabindex == tabindex)
            {
                this._accessibility_tabindex--;
                next_obj = this._tabButtons[this._accessibility_tabindex];
            }
            else
            {
                this._accessibility_tabindex--;
                if (this._accessibility_tabindex >= 0)
                {
                    if (this._accessibility_tabindex == tabindex)
                        next_obj = this._child_list[tabindex];
                    else
                        next_obj = this._tabButtons[this._accessibility_tabindex];
                }
            }
        }

        if (next_obj)
        {
            next_obj._setAccessibilityNotifyEvent(direction);
            return true;
        }
        return false;
    };

    _pTab._resetScrollPos = function (target_comp, left, top, right, bottom, focus_direction)
    {
        // target_comp의 left,top,right,bottom에 해당하는 영역을 최대한 볼 수 있도록 상위 모든 컴포넌트를 자동으로 스크롤한다.
        // target_comp가 기준 target_comp를 보이게 만들어야 함.
        // right,bottom은 이격값이 아닌 절대좌표임.
        //if (this._is_frame)
        //     return;

        var parent = this._p_parent;
        if (!this._is_popup_control && parent && parent != this)
        {
            var form_top = this._adjust_top;
            var form_left = this._adjust_left;
            top += form_top;
            left += form_left;
            bottom += form_top;
            right += form_left;
            parent._resetScrollPos(this, left, top, right, bottom, focus_direction);
        }
    };

    // ====================================================================
    // nexacro.Tab : Property
    // ====================================================================
    _pTab.set_multiline = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_multiline != v)
        {
            this._p_multiline = v;
            this.on_apply_multiline(v);
        }

    };

    _pTab.on_apply_multiline = function (v)
    {
        this._rearrangeContents();
    };

    _pTab.set_tabindex = function (v)
    {
        if (isNaN(v = +v) || v < -1)
        {
            return;
        }

        var post_idx = parseInt(v, 10) | 0;
        var pre_idx = this._p_tabindex;

        if (post_idx != pre_idx)
        {
            this._oldtabindex = pre_idx;

            if (!this._is_created)
            {
                this._init_tabindex = post_idx;
            }
            else
            {
                this.on_apply_tabindex(post_idx);
                this._rearrangeContents();
            }
        }
    };

    _pTab.on_apply_tabindex = function (v)
    {
        var is_apply_focus = false;

        var form = this._getForm();
        if (form._getTabOrderFirst() instanceof nexacro.Tab && this._p_parent._last_focused && this._p_parent._last_focused.name == this._p_name)
        {
            is_apply_focus = true;
        }

        var bcanchange = this._changeTabIndex(v, is_apply_focus);
        if (bcanchange)
        {
            this._last_focused = null;
            this._tabbutton_obj = this._tabbuttonitems[v];

            if (this.enableevent && this._is_created && this._oldtabindex > -1)
            {
                this.on_fire_onchanged(this, v, this._oldtabindex);
            }

            this._rearrangeContents(-1);
        }

    };

    _pTab.set_focusacceptable = function (v)
    {
        var _v = nexacro._toBoolean(v);
        if (this._p_focusacceptable != _v)
        {
            this._p_focusacceptable = _v;
        }
    };

    _pTab.set_usecontrolkey = function (v)
    {
        this._p_usecontrolkey = nexacro._toBoolean(v);
    };

    _pTab.set_rotatetext = function (v)
    {
        this._p_rotatetext = v;
        //TODO
    };

    _pTab.on_apply_rotatetext = function (v)
    {
        //TODO
    };

    _pTab.set_tabjustify = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_tabjustify != v)
        {
            this._p_tabjustify = v;
            this.on_apply_tabjustify(v);
        }

    };
    _pTab.on_apply_tabjustify = function (v)
    {
        this._rearrangeContents();
    };

    _pTab.set_selectchangetype = function (v)
    {
        switch (v)
        {
            case "down": case "up":
                this._p_selectchangetype = v;
                break;
            default:
                break;
        }
    };

    _pTab.set_tabposition = function (v)
    {
        var pre_value = nexacro._toString(this._p_tabposition);
        var post_value = nexacro._toString(v);
        switch (post_value)
        {
            case "left": case "top": case "right": case "bottom":
                if (pre_value != post_value)
                {
                    this._p_tabposition = post_value;
                    this.on_apply_tabposition(post_value);
                }
                break;
            default:
                return;
        }

    };
    _pTab.on_apply_tabposition = function (v)
    {
        this._rearrangeContents();
    };

    _pTab.set_showextrabutton = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_showextrabutton != v)
        {
            this._p_showextrabutton = v;
            this.on_apply_showextrabutton(v);
        }
    };
    _pTab.on_apply_showextrabutton = function (v)
    {
        this._rearrangeContents();
    };

    _pTab.set_showtabbuttonicon = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_showtabbuttonicon != v)
        {
            this._p_showtabbuttonicon = v;
            this.on_apply_showtabbuttonicon(v);
        }
    };
    _pTab.on_apply_showtabbuttonicon = function (v)
    {
        this._rearrangeContents();
    };

    _pTab.set_preload = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_preload != v)
        {
            this._p_preload = v;
            this.on_apply_preload(v);
        }
    };

    _pTab.on_apply_preload = function (v)
    {

    };

    _pTab._tabbuttongap = 0;
    _pTab.set_tabbuttongap = function (tabbuttongap)
    {
        if (this._p_tabbuttongap != tabbuttongap)
        {
            this._p_tabbuttongap = tabbuttongap;
            this._tabbuttongap = !tabbuttongap ? 0 : parseInt(tabbuttongap);

            if (this._tabbuttongap < 0)
                this._tabbuttongap = 0;

            this._rearrangeContents();
        }
    };

    _pTab._tabbuttonstartgap = 0;
    _pTab.set_tabbuttonstartgap = function (tabbuttonstartgap)
    {
        if (this._p_tabbuttonstartgap != tabbuttonstartgap)
        {
            this._p_tabbuttonstartgap = tabbuttonstartgap;
            this._tabbuttonstartgap = !tabbuttonstartgap ? 0 : parseInt(tabbuttonstartgap);

            if (this._tabbuttonstartgap < 0)
                this._tabbuttonstartgap = 0;

            this._rearrangeContents();
        }
    };

    _pTab.set_usetabbutton = function (v)
    {   /* todo
        if (this.usetabbutton != v)
        {
            if (v == null)
                v = true;

            this.usetabbutton = v;
            this._rearrangeContents();
        }
        */
    };

    _pTab.set_tabbuttonwidth = function (v)
    {
        if (this._p_tabbuttonwidth != v)
        {
            this._p_tabbuttonwidth = (v === undefined) ? v : (parseInt(v) | 0);
            this._rearrangeContents();
        }
    };

    _pTab.set_tabbuttonheight = function (v)
    {
        if (this._p_tabbuttonheight != v)
        {
            this._p_tabbuttonheight = (v === undefined) ? v : (parseInt(v) | 0);
            this._rearrangeContents();
        }
    };

    _pTab.set_selectedtabbuttonwidth = function (v)
    {
        if (this._p_selectedtabbuttonwidth != v)
        {
            this._p_selectedtabbuttonwidth = (v === undefined) ? v : (parseInt(v) | 0);
            this._rearrangeContents();
        }
    };

    _pTab.set_selectedtabbuttonheight = function (v)
    {
        if (this._p_selectedtabbuttonheight != v)
        {
            this._p_selectedtabbuttonheight = (v === undefined) ? v : (parseInt(v) | 0);
            this._rearrangeContents();
        }
    };

    _pTab.set_extrabuttonsize = function (v)
    {
        v = nexacro._toString(v).replace(/\s+/, " ").trim();

        if (this._p_extrabuttonsize == v)
            return;

        this._p_extrabuttonsize = v;

        this._extrabutton_size = null;
        this._rearrangeContents();
    };

    _pTab.set_tabbuttoniconsize = function (v)
    {
        v = nexacro._toString(v).replace(/\s+/, " ").trim();

        if (this._p_tabbuttoniconsize == v)
            return;

        this._p_tabbuttoniconsize = v;

        this._tabbuttonicon_size = null;
        this._rearrangeContents();
    };

    _pTab.set_tabstyle = function (v)
    {
        var pre_value = nexacro._toString(this._p_tabstyle);
        var post_value = nexacro._toString(v);

        if (post_value == "accordion") 
        {
            this._bshow_tabpage_accordion = true;
        }
        else
        {
            this._bshow_tabpage_accordion = false;
        }

        switch (post_value)
        {
            case "normal":
            case "accordion":
                if (pre_value != post_value) 
                {
                    this._p_tabstyle = post_value;
                    this.on_apply_tabstyle(post_value);
                }
                break;
            default:
                return;
        }
    };

    _pTab.on_apply_tabstyle = function (v)
    {
        this._rearrangeContents();
    };

    // ====================================================================
    // nexacro.Tab : Methods
    // ====================================================================
    _pTab.getParentContext = function ()
    {
        return this._p_parent;
    };

    _pTab.addChild = function (id, obj)
    {
        this._addChild(id, obj, false);
    };

    _pTab.insertTabpage = function (strId, nIndex, strUrl, strText, tabbuttonwidth, tabbuttonheight)
    {
        var idx = parseInt(nIndex) | 0;

        var tabpages = this._p_tabpages;
        var tabpages_len = tabpages.length;
        var tabbuttonitems = this._tabbuttonitems;

        var tabpage;
        var oldtabindex;

        for (var i = 0; i < tabpages_len; i++)
        {
            tabpage = this._p_tabpages[i];
            if (strId == tabpage.id)
            {
                return -1;
            }
        }

        tabpage = new nexacro.Tabpage(strId, this);
        tabpage._refobj = this;

        if (strText)
            tabpage.set_text(strText);
        else
            tabpage.set_text(strId);

        if (tabbuttonwidth)
            tabpage.set_tabbuttonwidth(tabbuttonwidth);

        if (tabbuttonheight)
            tabpage.set_tabbuttonheight(tabbuttonheight);

        tabpage._preload = this.preload;
        tabpage.createComponent(false);

        if (idx > tabpages_len)
            idx = -1;

        this.on_fire_canchange(this, this._p_tabindex, this._p_tabpages.length);

        if (this._is_canchange)
        {
            oldtabindex = this._p_tabindex;

            if (this[strId])
            {
                if (this[strId]._p_name == tabpage._p_name)
                {
                    tabpage.destroy();
                    return -1;
                }
            }

            var oldtabpage = oldtabindex > -1 ? tabpages[oldtabindex] : undefined;
            var oldtabtn = oldtabindex > -1 ? this._tabbuttonitems[oldtabindex] : undefined;

            if (oldtabpage && oldtabtn)
            {
                if (oldtabpage._p_enable)
                {
                    oldtabtn._changeStatus("enabled", true);
                }
                else
                    oldtabtn._changeStatus("disabled", true);

                this._changeUserStatusAll(oldtabtn, false);
                oldtabpage.set_visible(false);
            }
        }

        if (idx == -1)
        {
            this._p_tabindex = idx = this._p_tabpages.length;
            this._addChild(strId, tabpage);
        }
        else
        {
            for (i = tabpages_len; i > idx; i--)
            {
                tabbuttonitems[i] = tabbuttonitems[i - 1];
                tabbuttonitems[i]._tabindex += 1;
            }

            this._addChild(strId, tabpage, true, idx);

            if (this._is_canchange)
            {
                this._p_tabindex = idx;
            }
            else
            {
                if (this._p_tabindex >= idx)
                    this._p_tabindex = this._p_tabindex + 1;
            }
        }

        var newtabbtn;
        if (this._is_canchange)
        {
            newtabbtn = this._tabbutton_obj = tabbuttonitems[idx] = this._createTabbutton(idx, tabpage, false);
            if (strUrl && !this._p_preload)
                tabpage.set_url(strUrl);

            tabpage.set_visible(true);

            this._changeUserStatusAll(newtabbtn, true);
            this._last_focused = null;
        }
        else
        {
            newtabbtn = tabbuttonitems[idx] = this._createTabbutton(idx, tabpage, false);
            this._changeUserStatusAll(newtabbtn, false);
        }

        this._rearrangeContents();

        if (this._p_enableevent && this._is_canchange)
        {
            this.on_fire_onchanged(this, this._p_tabindex, this._oldtabindex);
        }
        return idx;
    };

    _pTab.destroy = function (callremovechild)
    {
        if (!this._is_alive)
            return;

        var tabpages = this._p_tabpages;
        if (tabpages && tabpages.length > 0)
        {
            var confirm_message = this._on_beforeclose();
            if (tabpages[0]._checkAndConfirmClose(confirm_message) == false)
            {
                return;
            }
            this._on_close();
        }

        return nexacro.Component.prototype.destroy.call(this, callremovechild);
    };

    _pTab.removeTabpage = function (nIndex)
    {
        var idx = parseInt(nIndex) | 0;
        var tabpages = this._p_tabpages;

        var tabpages_len = tabpages.length;
        if (tabpages_len == 0)
        {
            return -1;
        }

        var tabbuttonitems, tabbuttonitems_len = 0;
        if (tabpages_len > 0)
        {
            var tabpage = tabpages[idx];

            if (!tabpage)
            {
                return -1;
            }

            var confirm_message = tabpage._on_beforeclose();
            if (tabpage._checkAndConfirmClose(confirm_message) == false)
            {
                return -1;
            }

            if (tabpage == this._last_focused)
                this._last_focused = null;

            tabpage._on_close();

            this[tabpage.id] = null;
            delete this[tabpage.id];
            tabpages.delete_item(tabpage.id);

            tabpage.destroy();

            tabbuttonitems = this._tabbuttonitems;
            var tabbuttonitem = tabbuttonitems[idx];
            if (tabbuttonitem != undefined)
            {
                if (tabbuttonitem == this._tabbutton_obj)
                    this._tabbutton_obj = null;
                if (tabbuttonitem == this._last_focused)
                    this._last_focused = null;

                tabbuttonitem.destroy();
            }

            tabbuttonitems.splice(idx, 1);

            tabbuttonitems_len = tabbuttonitems.length;
            for (var i = 0; i < tabbuttonitems_len; i++)
            {
                tabbuttonitems[i]._tabindex = i;
            }
        }

        var is_changed_tabpage = false;
        if (this._p_tabindex == idx)
            is_changed_tabpage = true;
        if (idx != 0 && this._p_tabindex == idx && this._p_tabindex == tabbuttonitems_len)
        {
            this._p_tabindex = idx - 1;
        }
        else if (this._p_tabindex > idx || tabbuttonitems_len == 0)
        {
            this._p_tabindex -= 1;
        }

        var newtabpage = tabpages[this._p_tabindex];
        if (newtabpage)
        {
            newtabpage.set_visible(true);
            if (!this._p_preload)
                newtabpage._on_apply_url();

            if (tabbuttonitems)
            {
                this._changeUserStatusAll(tabbuttonitems[this._p_tabindex], true);
            }

            if (this._p_enableevent && is_changed_tabpage)
            {
                this.on_fire_onchanged(this, this._p_tabindex, this._oldtabindex);
            }

        }

        if (tabbuttonitems_len > 0)
        {
            var begin_index = this._getFirstTabbuttonIndex();
            if (this._env._p_enableaccessibility)
            {
                // 접근성 상태에서 tabpage 삭제되는경우 begin index 갱신
                begin_index -= (tabpages_len - tabbuttonitems_len);
            }
            this._rearrangeContents(begin_index);
        }

        return 0;
    };

    _pTab.moveTabpage = function (nFromIndex, nToIndex)
    {
        var tabpages = this._p_tabpages;
        var tabpages_len = tabpages.length;
        if (nToIndex < 0 || tabpages_len <= nToIndex || tabpages_len <= nFromIndex || nFromIndex < 0)
        {
            return -1;
        }

        if (nFromIndex == nToIndex)
        {
            return -1;
        }

        var tabindex = this._p_tabindex;
        var tabpage = tabpages[tabindex];

        var cur_tabpage_id = tabpage.id;

        // var totabpage = tabpages[nToIndex];
        var fromtabpage = tabpages[nFromIndex];

        var tabbuttonitems = this._tabbuttonitems;
        //var tobutton = tabbuttonitems[nToIndex];
        var frombutton = tabbuttonitems[nFromIndex];

        tabpages.delete_item(nFromIndex);
        tabpages.insert_item(nToIndex, fromtabpage.id, fromtabpage);
        var i;
        if (nFromIndex < nToIndex)
        {
            for (i = nFromIndex + 1; i < tabpages_len; i++)
            {
                tabbuttonitems[i - 1] = tabbuttonitems[i];
                tabbuttonitems[i - 1]._tabindex = i - 1;

                if (i == nToIndex)
                {
                    tabbuttonitems[i] = frombutton;
                    tabbuttonitems[i]._tabindex = i;
                    break;
                }
            }

        }
        else
        {
            for (i = nFromIndex; i > nToIndex; i--)
            {
                tabbuttonitems[i] = tabbuttonitems[i - 1];
                tabbuttonitems[i]._tabindex = i;
            }

            // toindex
            tabbuttonitems[nToIndex] = frombutton;
            tabbuttonitems[nToIndex]._tabindex = nToIndex;
        }

        for (i = 0; i < tabpages_len; i++)
        {
            if (cur_tabpage_id == tabpages[i].id)
            {
                this._p_tabindex = i;
            }
        }

        this._rearrangeContents();

        return 0;
    };

    _pTab.getTabpageCount = function ()
    {
        return this._p_tabpages.length;
    };

    _pTab.getIndex = function (nXPos, nYPos)
    {
        var tabindex = this._getTabIndex(parseInt(nXPos, 10), parseInt(nYPos, 10));
        return tabindex;
    };

    _pTab.setContents = function (str)
    {
        var ret = this._setContents(str);
        return ret;
    };

    //===============================================================
    // nexacro.Tab : Event
    //===============================================================

    _pTab.on_fire_user_onmousedown = function (button, altKey, ctrlKey, shiftKey, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, metaKey)
    {
        if (this.onmousedown && this.onmousedown._has_handlers)
        {
            var rootComp = this._getRootComponent(from_comp);

            if (from_comp instanceof nexacro.Tabpage)
            {
                rootComp = from_comp;
            }
            var evt = new nexacro.MouseEventInfo(rootComp, "onmousedown", button, altKey, ctrlKey, shiftKey, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, metaKey);
            return this.onmousedown._fireUserEvent(this, evt);
        }
        return false;
    };

    _pTab.on_fire_sys_onmousedown = function (button, altKey, ctrlKey, shiftKey, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, metaKey)
    {
        if (this.onmousedown && this.onmousedown._has_handlers)
        {
            var rootComp = this._getRootComponent(from_comp);

            if (from_comp instanceof nexacro.Tabpage)
            {
                rootComp = from_comp;
            }
            var evt = new nexacro.MouseEventInfo(rootComp, "onmousedown", button, altKey, ctrlKey, shiftKey, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, metaKey);
            return this.onmousedown._fireSysEvent(this, evt);
        }
        return false;
    };

    _pTab.on_fire_user_onmouseup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onmouseup && this.onmouseup._has_handlers)
        {
            var rootComp = this._getRootComponent(from_comp);

            if (from_comp instanceof nexacro.Tabpage)
            {
                rootComp = from_comp;
            }
            var evt = new nexacro.MouseEventInfo(rootComp, "onmouseup", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
            return this.onmouseup._fireUserEvent(this, evt);
        }
        return false;
    };

    _pTab.on_fire_sys_onmouseup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onmouseup && this.onmouseup._has_handlers)
        {
            var rootComp = this._getRootComponent(from_comp);

            if (from_comp instanceof nexacro.Tabpage)
            {
                rootComp = from_comp;
            }
            var evt = new nexacro.MouseEventInfo(rootComp, "onmouseup", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
            return this.onmouseup._fireSysEvent(this, evt);
        }
        return false;
    };

    _pTab._on_focus = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        nexacro.Component.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);

        if (!this._focusobj)
            this._setTabFocusObj(this);

        /*
        if (!this._focusobj)
        {
        
            if (this.focusacceptable)
            {
                if (!this._env._p_enableaccessibility  && !self_flag)
                    this._setTabFocusObj(this._tabbuttonitems[this.tabindex]);

                this._tabbuttonitems[this.tabindex]._setFocus();
            }
       
            if (!this.focusacceptable)
            {
                this._setTabFocusObj(this.tabpages[this.tabindex]);
            }
        }
    */
    };

    _pTab.on_killfocus_basic_action = function (new_focus, new_ref_focus)
    {
        nexacro.Component.prototype.on_killfocus_basic_action.call(this);

        if (new_focus === this)
            return;

        if (new_focus == null && new_ref_focus == null)
            return;

        this._focusobj = null;
    };

    _pTab.on_fire_user_onkeydown = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key)
    {
        var ret = false;
        if (!this.onkeydown || (this.onkeydown && !this.onkeydown.defaultprevented))
        {
            if (key_code == nexacro.Event.KEY_TAB || key_code == nexacro.Event.KEY_RIGHT || key_code == nexacro.Event.KEY_LEFT || key_code == nexacro.Event.KEY_BACKSPACE)
            {
                if (this._keydown_filter(null, key_code, alt_key, ctrl_key, shift_key, undefined, from_comp, from_refer_comp, meta_key))
                {
                    if (this._getWindow()._keydown_element)
                        this._getWindow()._keydown_element._event_stop = true;

                    return true;
                }
            }
            else if (this._env._p_enableaccessibility)
            {
                if (key_code == nexacro.Event.KEY_DOWN || key_code == nexacro.Event.KEY_UP)
                {
                    if (this._keydown_filter(null, key_code, alt_key, ctrl_key, shift_key, undefined, from_comp, from_refer_comp, meta_key))
                    {
                        return true;
                    }
                }
            }
        }
        ret = nexacro.Component.prototype.on_fire_user_onkeydown.call(this, key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key);
        return ret;
    };

    _pTab.on_fire_sys_onkeydown = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key)
    {

        if (this.onkeydown && this.onkeydown._has_handlers)
        {
            var evt = new nexacro.KeyEventInfo(this, "onkeydown", alt_key, ctrl_key, shift_key, key_code, from_comp, from_refer_comp, meta_key);
            return this.onkeydown._fireSysEvent(this, evt);
        }
        return false;
    };

    _pTab.on_fire_user_onkeyup = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key)
    {
        if (this.onkeyup && this.onkeyup._has_handlers)
        {
            var evt = new nexacro.KeyEventInfo(this, "onkeyup", alt_key, ctrl_key, shift_key, key_code, from_comp, from_refer_comp, meta_key);
            return this.onkeyup._fireUserEvent(this, evt);
        }
        return false;
    };

    _pTab.on_fire_sys_onkeyup = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key)
    {
        if (this.onkeyup && this.onkeyup._has_handlers)
        {
            var evt = new nexacro.KeyEventInfo(this, "onkeyup", alt_key, ctrl_key, shift_key, key_code, from_comp, from_refer_comp, meta_key);
            return this.onkeyup._fireSysEvent(this, evt);
        }
        return false;
    };

    _pTab.on_lbuttondown_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        var ret = nexacro.Component.prototype.on_lbuttondown_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);

        if (!this._p_visible || this._isEnable() == false)
            return ret;

        this._is_changed_focus = false;

        if (refer_comp && ((refer_comp instanceof nexacro._TabButtonItemControl) || refer_comp.parent instanceof nexacro._TabButtonItemControl))
        {
            var tabbutton_obj = this._tabbutton_obj;
            if (tabbutton_obj && tabbutton_obj._p_name == "extrabutton")
            {
                if (this._tabbuttonitems[tabbutton_obj._tabindex])
                    this._tabbuttonitems[tabbutton_obj._tabindex]._setFocus();
            }


            if (tabbutton_obj && this.selectchangetype == "down")
            {
                var idx = tabbutton_obj._tabindex;

                var oldindex = this._p_tabindex;
                var focusobj = this._focusobj;

                var bcanchange = this._changeTabIndex(idx, true, true);
                if (bcanchange)
                {
                    if (this._p_enableevent && oldindex != this.tabindex)
                    {
                        this.on_fire_onchanged(tabbutton_obj, idx, oldindex);
                    }

                    if (focusobj != this._focusobj)
                    {
                        this._is_changed_focus = true;
                    }
                }

                this._rearrangeContents(-1);
            }
        }

        return ret;
    };

    _pTab.on_fire_user_onlbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {

        if (from_refer_comp.name == "extrabutton")
        {
            var tabbutton = from_refer_comp._p_parent;
            var idx = tabbutton._tabindex;
            if (idx >= 0)
            {
                if (this === from_comp)
                {
                    this.on_fire_onextrabuttonclick(tabbutton, idx, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
                }
            }
        }

        if (this.onlbuttondown && this.onlbuttondown._has_handlers)
        {
            var evt = new nexacro.TabMouseEventInfo(this, "onlbuttondown", this.tabindex, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
            return this.onlbuttondown._fireUserEvent(this, evt);
        }
        return false;
        //return ret;
    };

    _pTab.on_lbuttonup_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        var ret = nexacro.Component.prototype.on_lbuttonup_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);

        if (!this._p_visible || this._isEnable() == false)
            return ret;

        if (refer_comp && ((refer_comp instanceof nexacro._TabButtonItemControl) || refer_comp._p_parent instanceof nexacro._TabButtonItemControl))
        {
            if (this._tabbutton_obj && this._p_selectchangetype == "up")
            {
                var tabbutton_obj = this._tabbutton_obj;
                var idx = tabbutton_obj._tabindex;

                var oldindex = this._p_tabindex;
                var bcanchange = this._changeTabIndex(idx, true, true);
                if (bcanchange)
                {
                    if (this._p_enableevent && oldindex != this._p_tabindex)
                    {
                        this.on_fire_onchanged(tabbutton_obj, idx, oldindex);
                    }
                }

                this._rearrangeContents(-1);
            }
        }


    };

    _pTab.on_touchend_basic_action = function (touch_manager, touchinfos, changedtouchinfos/*, refer_comp*/)
    {
        var ret = nexacro.Component.prototype.on_touchend_basic_action.call(this, touch_manager, touchinfos, changedtouchinfos);

        var control = this._getControlFromElement(touch_manager._start_elem);

        if (control)
        {
            var idx;

            if (control instanceof nexacro._TabExtraButtonControl)
            {
                var tabbuttonitem = control._p_parent;
                idx = tabbuttonitem._tabindex;

                var screenX, screenY, canvasX, canvasY, clientX, clientY;
                if (touchinfos && touchinfos.length > 0)
                {
                    screenX = touchinfos[0].screenx;
                    screenY = touchinfos[0].screeny;
                    canvasX = touchinfos[0].canvasx;
                    canvasY = touchinfos[0].canvasy;
                    clientX = touchinfos[0].clientx;
                    clientY = touchinfos[0].clienty;
                }

                if (idx >= 0)
                {
                    this.on_fire_onextrabuttonclick(tabbuttonitem, idx, "touch", null, null, null, screenX, screenY, canvasX, canvasY, clientX, clientY, this, control);
                }
                var curindex = this._p_tabindex; //onextrabuttonclick 이후의 index로 change 여부를 check한다.
                if (curindex == idx) 
                {
                    return ret;
                }
                else
                {
                    control = control._p_parent; //control의 parent가 remove등으로 삭제 되었다면 아래 change를 타지 않는다.
                }
            }

            if (control instanceof nexacro._TabButtonItemControl)
            {
                this._tabbutton_obj = control;

                var tabbutton_obj = this._tabbutton_obj;
                idx = tabbutton_obj._tabindex;

                var oldindex = this._p_tabindex;
                var bcanchange = this._changeTabIndex(idx, true, true);
                if (bcanchange)
                {
                    if (this._p_enableevent && oldindex != this._p_tabindex)
                    {
                        this.on_fire_onchanged(tabbutton_obj, idx, oldindex);
                    }
                }

                this._rearrangeContents(-1);
            }
        }

        return ret;
    };

    _pTab.on_fire_user_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        if (this.onlbuttonup && this.onlbuttonup._has_handlers)
        {
            var evt = new nexacro.TabMouseEventInfo(this, "onlbuttonup", this.tabindex, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
            return this.onlbuttonup._fireUserEvent(this, evt);
        }
        return false;
    };

    _pTab.on_fire_user_onrbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        if (this.onrbuttonup && this.onrbuttonup._has_handlers)
        {
            var evt = new nexacro.TabMouseEventInfo(this, "onrbuttonup", this.tabindex, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
            return this.onrbuttonup._fireUserEvent(this, evt);
        }
        return false;
    };

    _pTab.on_fire_user_onrbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onrbuttondown && this.onrbuttondown._has_handlers)
        {
            var evt = new nexacro.TabMouseEventInfo(this, "onrbuttondown", this.tabindex, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
            return this.onrbuttondown._fireUserEvent(this, evt);
        }
        return false;
    };

    _pTab.on_fire_onextrabuttonclick = function (obj, index, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.onextrabuttonclick && this.onextrabuttonclick._has_handlers)
        {
            var evt = new nexacro.TabMouseEventInfo(this, "onextrabuttonclick", index, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, this, meta_key);
            return this.onextrabuttonclick._fireEvent(this, evt);
        }
        return true;
    };

    _pTab.on_notify_prevbutton_onclick = function (obj, e)
    {
        this._adjustSpinPosition(-1);
    };

    _pTab.on_notify_nextbutton_onclick = function (obj, e)
    {
        this._adjustSpinPosition(1);
    };

    _pTab.on_fire_canchange = function (obj, postindex, preindex)
    {
        this._is_canchange = true;

        if (this.canchange && this.canchange._has_handlers)
        {
            var evt = new nexacro.TabIndexChangeEventInfo(obj, "canchange", postindex, preindex);

            this._is_canchange = this.canchange._fireCheckEvent(this, evt);
            return this._is_canchange;
        }

        return true;
    };

    _pTab.on_fire_onchanged = function (obj, postindex, preindex)
    {
        if (this.onchanged && this.onchanged._has_handlers)
        {
            var evt = new nexacro.TabIndexChangeEventInfo(this, "onchanged", postindex, preindex);
            return this.onchanged._fireEvent(this, evt);
        }

        return true;
    };
    _pTab.on_apply_prop_cssclass = function ()
    {
        var nextbutton = this._p_nextbutton;
        if (nextbutton)
            nextbutton.on_apply_cssclass();
        var prevbutton = this._p_prevbutton;
        if (prevbutton)
            prevbutton.on_apply_cssclass();
        var tabbuttonitems = this._tabbuttonitems;
        var tabpages_len = tabbuttonitems.length;

        var i;
        for (i = 0; i < tabpages_len; i++)
        {
            var tabbuttonitem = tabbuttonitems[i];
            if (tabbuttonitem)
                tabbuttonitem.on_apply_cssclass();
        }
        var tabpages = this._p_tabpages;
        var tabpages_length = tabpages.length;
        var tabpage;

        for (i = 0; i < tabpages_length; i++)
        {
            tabpage = tabpages[i];
            if (tabpage)
                tabpage.on_apply_cssclass();
        }
    };

    _pTab.on_apply_prop_stringresource = function ()
    {
        if (!nexacro._StringResource)
            return;

        nexacro.Component.prototype.on_apply_prop_stringresource.call(this);

        if (this._p_tabpages)
        {
            for (var i = 0; i < this._tabbuttonitems.length; i++)
            {
                var tabpage = this._p_tabpages[i];
                tabpage.on_apply_prop_stringresource();


                var tabbuttonitem = this._tabbuttonitems[i];
                tabbuttonitem.on_apply_prop_stringresource();
            }
        }
    };

    //===============================================================
    // nexacro.Tab : Logical Part
    //===============================================================
    _pTab._destroy = function (callremovechild)
    {
        return this.destroyComponent(callremovechild);
    };

    _pTab._createSpinButton = function (bCreateOnly)
    {
        if (!this._p_prevbutton)
        {
            this._p_prevbutton = new nexacro.Button("prevbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
            this._p_prevbutton._setControl();
            this._p_prevbutton.createComponent(bCreateOnly);
            this._p_prevbutton.set_accessibilityenable(false);
            this._p_prevbutton.set_visible(false);
            this._p_prevbutton._setEventHandler("onclick", this.on_notify_prevbutton_onclick, this);
        }

        this._createTabButtons(bCreateOnly);

        if (!this._p_nextbutton)
        {
            this._p_nextbutton = new nexacro.Button("nextbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
            this._p_nextbutton._setControl();
            this._p_nextbutton.createComponent(bCreateOnly);
            this._p_nextbutton.set_accessibilityenable(false);
            this._p_nextbutton.set_visible(false);
            this._p_nextbutton._setEventHandler("onclick", this.on_notify_nextbutton_onclick, this);
        }
    };

    _pTab._createTabpages = function (bCreateOnly)
    {
        var tabpages = this._p_tabpages;
        var tabpages_length = tabpages.length;
        var tabpage;
        var tabindex = this._p_tabindex;

        for (var i = 0; i < tabpages_length; i++)
        {
            tabpage = tabpages[i];

            tabpage._refobj = this;

            tabpage._preload = this._p_preload;

            if (tabindex != i)
                tabpage.set_visible(false);

            if (!tabpage._is_created)
                tabpage.createComponent(bCreateOnly);
        }
    };

    _pTab._createTabButtons = function (bCreateOnly)
    {
        var tabpages = this._p_tabpages;
        var tabpages_length = tabpages.length;
        if (tabpages_length <= 0)
            return;

        this._show_button_cnt = 0;

        for (var i = 0; i < tabpages_length; i++)
        {
            var tabbutton = this._createTabbutton(i, tabpages[i], bCreateOnly);
            this._tabbuttonitems.push(tabbutton);
        }
    };

    _pTab._createTabbutton = function (idx, tabpage, bCreateOnly)
    {
        if (!tabpage)
        {
            return null;
        }

        var button_idx = this._next_button_idx++;
        var tabpage_text = tabpage._p_text;
        var tabindex = idx;

        var btn = new nexacro._TabButtonItemControl("tabbutton_" + button_idx, 0, 0, 1, 1, null, null, null, null, null, null, this);

        btn.createComponent(bCreateOnly);
        btn.set_text(tabpage_text);
        btn._tabindex = tabindex;
        btn._tabpage = tabpage;
        tabpage._tabbuttonitem = btn;

        return btn;
    };


    _pTab._getTabIndex = function (nX, nY)
    {
        var tabindex = -1;
        var tabpages_len = this._p_tabpages.length;
        if (tabpages_len <= 0)
            return tabindex;

        if (nX < 0 || nY < 0)
            return tabindex;

        //var tab_width = this._getClientWidth();
        //var tab_height = this._getClientHeight();

        var l = 0, t = 0, r = 0, b = 0;
        var tabbuttonitems, tabbuttonitem;

        tabbuttonitems = this._tabbuttonitems;
        for (var i = 0; i < tabpages_len; i++)
        {
            tabbuttonitem = tabbuttonitems[i];
            if (tabbuttonitem.visible)
            {
                l = tabbuttonitem._position.left;
                t = tabbuttonitem._position.top;
                b = t + tabbuttonitem._position.height;
                r = l + tabbuttonitem._position.width;

                if (nX >= l && nX <= r && nY >= t && nY <= b)
                {
                    tabindex = i;
                    break;
                }
            }
        }

        return tabindex;
    };

    _pTab._isSpinButtonVisible = function ()
    {
        return this._p_nextbutton._p_visible || this._p_prevbutton._p_visible;
    };

    _pTab._getPrevButtonSize = function ()
    {
        if (!this._prevbutton_size)
        {
            var width = 0;
            var height = 0;

            var border = this._p_prevbutton._getCSSStyleValue("border");
            var padding = this._p_prevbutton._getCSSStyleValue("padding");

            if (border)
            {
                width = border.left._width + border.right._width;
                height = border.top._width + border.bottom._width;
            }

            if (padding)
            {
                width += padding.left + padding.right;
                height += padding.top + padding.bottom;
            }

            var icon = this.prevbutton._getCSSStyleValue("icon");
            if (icon instanceof Object)
                icon = icon.value;

            this._prevbutton_size = { width: 0, height: 0 };
            this._prevbutton_extrasize = { width: width, height: height };
            if (!icon)
            {
                var size = this._default_spinbutton_size;
                this._prevbutton_size.width += size.width;
                this._prevbutton_size.height += size.height;
            }
            else
            {
                var iconsize = nexacro._getImageSize(icon, this._onload_prevbutton_iconimage, this);
                if (iconsize)
                {
                    this._prevbutton_size.width = this._prevbutton_extrasize.width + iconsize.width;
                    this._prevbutton_size.height = this._prevbutton_extrasize.height + iconsize.height;
                }
                else
                    return null;
            }
        }

        return this._prevbutton_size;
    };

    _pTab._getNextButtonSize = function ()
    {
        if (!this._nextbutton_size)
        {
            var width = 0;
            var height = 0;

            var border = this._p_nextbutton._getCSSStyleValue("border");
            var padding = this._p_nextbutton._getCSSStyleValue("padding");

            if (border)
            {
                width = border.left._width + border.right._width;
                height = border.top._width + border.bottom._width;
            }

            if (padding)
            {
                width += padding.left + padding.right;
                height += padding.top + padding.bottom;
            }

            var icon = this._p_nextbutton._getCSSStyleValue("icon");
            if (icon instanceof Object)
                icon = icon.value;

            this._nextbutton_size = { width: 0, height: 0 };
            this._nextbutton_extrasize = { width: width, height: height };
            if (!icon)
            {
                var size = this._default_spinbutton_size;

                this._nextbutton_size.width += size.width;
                this._nextbutton_size.height += size.height;
            }
            else
            {

                var iconsize = nexacro._getImageSize(icon, this._onload_nextbutton_iconimage, this);
                if (iconsize)
                {
                    this._nextbutton_size.width = this._nextbutton_extrasize.width + iconsize.width;
                    this._nextbutton_size.height = this._nextbutton_extrasize.height + iconsize.height;
                }
                else
                    return null;
            }
        }

        return this._nextbutton_size;
    };

    _pTab._getTabpageBorder = function ()
    {
        var border;
        var len = this._p_tabpages.length;
        var tabpage;
        if (len > 0)
        {
            tabpage = this._p_tabpages[0];
            border = tabpage._getCSSStyleValue("border");
        }

        return border;
    };

    _pTab._addChild = function (id, obj, bInsert, nIndex)
    {
        //var ret = -1;

        if (id && id.length <= 0)
        {
            return -1;
        }
        if (!obj)
        {
            return -1;
        }

        if (this[id])
        {
            return -1;
        }
        if (!(obj instanceof nexacro.Tabpage))
        {
            return -1;
        }

        obj._refform = this;

        if (!obj.id)
        {
            obj.id = obj.name = id;
        }
        else
            obj.id = id;

        this[id] = obj;
        if (bInsert && nIndex >= 0)
            this._p_tabpages.insert_item(nIndex, id, obj);
        else
            this._p_tabpages.add_item(id, obj);

        if (this._p_preload || (this._init_tabindex >= 0 && this._p_tabpages[this._init_tabindex] == obj))
        {
            obj._on_apply_url();
        }

        if (!obj._url)
        {
            var _form = obj._p_form;
            if (_form)
                _form._is_loaded = true;
        }
    };

    _pTab._getFirstTabbuttonIndex = function ()
    {
        var tabbuttonitems = this._tabbuttonitems;
        var tabbuttonitems_len = tabbuttonitems.length;
        var tabbuttonitem;
        var v = -1;

        for (var i = 0; i < tabbuttonitems_len; i++)
        {
            tabbuttonitem = tabbuttonitems[i];
            if (tabbuttonitem._p_visible)
            {
                v = i;
                break;
            }
        }

        return v;
    };

    _pTab._adjustSpinPosition = function (v)
    {
        var tabbuttonitems_len = this._tabbuttonitems.length;
        var begin_idx = parseInt(v);
        var first_indext = this._getFirstTabbuttonIndex();
        if (first_indext >= 0)
            begin_idx += first_indext;

        if (begin_idx < 0)
            begin_idx = 0;

        if (begin_idx >= tabbuttonitems_len)
            begin_idx = tabbuttonitems_len - 1;

        this._rearrangeContents(begin_idx);
    };

    _pTab._changeTabIndex = function (index, is_apply_focus, is_mouse_action)
    {
        var nindex = +index;

        if (this._p_tabstyle == "normal")
        {
            if (!this._is_created || this._p_tabindex == index ||
                (nindex != nindex) || index < 0 || (this._p_tabpages && index >= this._p_tabpages.length))
            {
                return;
            }
        }

        var oldindex = this._p_tabindex;
        if (oldindex > -1 && this._p_enableevent)
        {
            var ret = this.on_fire_canchange(this, index, oldindex);
            if (ret == false)
            {
                this._changeUserStatusAll(this._tabbuttonitems[index], false);
                //this._tabbuttonitems[oldindex]._setFocus(false);

                return false;
            }
        }

        var oldtabpage = oldindex > -1 ? this._p_tabpages[oldindex] : undefined;
        var newtabpage = this._p_tabpages[index];

        var oldtabtn = oldindex > -1 ? this._tabbuttonitems[oldindex] : undefined;
        var newtabbtn = this._tabbuttonitems[index];

        if (this._p_tabstyle == "accordion")
        {
            if (oldindex == index)
            {
                if (!this._bshow_tabpage_accordion)
                {
                    this._bshow_tabpage_accordion = true;
                }
                else if (this._bshow_tabpage_accordion)
                {
                    this._bshow_tabpage_accordion = false;

                    index = -1;
                    newtabpage = undefined;
                }
            }
            else
            {
                if (index == -1)
                {
                    this._bshow_tabpage_accordion = false;
                }
                else if (index > -1)
                {
                    this._bshow_tabpage_accordion = true;
                }

            }
        }


        if (oldtabpage && oldtabtn)
        {
            if (oldtabpage.enable)
            {
                oldtabtn._changeStatus("enabled", true);
            }
            else
                oldtabtn._changeStatus("disabled", true);

            if (oldtabtn.visible)
            {
                this._changeUserStatusAll(oldtabtn, false);
                if (is_mouse_action)
                {
                    if (index > -1)
                    {
                        oldtabtn._changeStatus("mouseover", false);
                    }
                }
            }

            //          if (this.tabstyle != "accordion")   // multi tappage 사용시
            oldtabpage.set_visible(false);
        }

        this._oldtabindex = oldindex;
        this._p_tabindex = index;

        if (newtabpage)
        {
            if (!newtabpage._p_visible)
            {
                newtabpage.set_visible(true);
                //newtabpage._on_focus(true);
            }

            if (!this._p_preload)
                newtabpage._on_apply_url(false);

            if (!newtabbtn._p_visible)
                newtabbtn.set_visible(true);

            this._changeUserStatusAll(newtabbtn, true);

            if (is_apply_focus)
                newtabbtn._on_focus(true);
            if (newtabpage._p_enable)
            {
                newtabpage._changeStatus("enabled", true);
            }
            else
            {
                newtabpage._changeStatus("disabled", true);
            }
        }
        else
        {
            if (this._p_tabstyle == "accordion")
            {
                if (index == -1 || oldindex == index)
                {
                    oldtabtn._changeStatus("focused", false);
                    return true;
                }
            }

            if (oldtabpage && oldtabtn)
            {
                if (oldtabtn._p_enable)
                {
                    oldtabtn._changeStatus("focused", true);
                }
                else
                {
                    oldtabtn._changeStatus("disabled", true);
                }

                this._changeUserStatusAll(oldtabtn, true);
                oldtabpage.set_visible(true);
            }
        }

        return true;
    };

    // Accessibility_Comp.js에 접근성용 override 되어 있음
    _pTab._adjustTabButtonPosition = function (beginTabindex, tabbuttonitem, tab_size, tab_max_size, bovered)
    {
        var tabindex = this._p_tabindex;
        var tabposition = this._p_tabposition;
        var bmultiline = this._p_multiline;
        var tabbuttonitem_pos = tabbuttonitem._position;

        var pos, next_pos;
        if (tabposition == "top" || tabposition == "bottom")
        {
            pos = tabbuttonitem_pos.left;
            next_pos = pos + tabbuttonitem_pos.width;
        }
        else
        {
            pos = tabbuttonitem_pos.top;
            next_pos = pos + tabbuttonitem_pos.height;
        }

        this._show_button_cnt = 0;
        if (!bmultiline && next_pos > tab_max_size)
        {
            tabbuttonitem.set_visible(false);
        }
        else
        {
            tabbuttonitem.set_visible(this._p_usetabbutton);
            if (tabindex != tabbuttonitem._tabindex)
            {
                this._changeUserStatusAll(tabbuttonitem, false);
            }
        }

        if (tabbuttonitem._p_visible)
        {
            if (!bmultiline && tabbuttonitem._tabindex < beginTabindex)
            {
                tabbuttonitem.set_visible(false);
                next_pos = pos;
            }
        }

        return next_pos;
    };

    _pTab._rearrangeContents = function (beginTabindex)
    {
        if (!this._is_created)
            return;

        if (this._p_tabstyle == "accordion")
        {
            this._rearrangeContentsForAccrdion(beginTabindex);
            return;
        }

        // arrange tabbuttons
        var tabposition = this._p_tabposition;
        var bmultiline = this._p_multiline;
        var btabjustify = this._p_tabjustify;
        // var brotatetext = this.rotatetext & false;  //TODO brotatetext = false;

        var bshowextrabutton = this._p_showextrabutton;
        var extrabutton_size;
        var extrabutton_width = 0;
        var extrabutton_height = 0;

        var bshowtabbuttonicon = this._p_showtabbuttonicon;
        var tabbuttonicon_size;
        var tabbuttonicon_width = 0;
        var tabbuttonicon_height = 0;

        if (bshowextrabutton)
        {
            if (!this._extrabutton_size)
            {
                extrabutton_size = this._getExtraButtonSize();
                if (extrabutton_size)
                {
                    if (extrabutton_size.width != 0 || extrabutton_size.height != 0)
                        this._extrabutton_size = extrabutton_size;

                    extrabutton_width = extrabutton_size.width;
                    extrabutton_height = extrabutton_size.height;
                }
            }
            else
            {
                extrabutton_width = this._extrabutton_size.width;
                extrabutton_height = this._extrabutton_size.height;
            }
        }

        if (bshowtabbuttonicon)
        {
            if (!this._tabbuttonicon_size)
            {
                tabbuttonicon_size = this._getTabButtonIconSize();
                if (tabbuttonicon_size)
                {
                    if (tabbuttonicon_size.width != 0 || tabbuttonicon_size.height != 0)
                        this._tabbuttonicon_size = tabbuttonicon_size;

                    tabbuttonicon_width = tabbuttonicon_size.width;
                    tabbuttonicon_height = tabbuttonicon_size.height;
                }
            }
            else
            {
                tabbuttonicon_width = this._tabbuttonicon_size.width;
                tabbuttonicon_height = this._tabbuttonicon_size.height;
            }
        }

        var tabindex = this._p_tabindex;

        var bshowspin = false;
        var prevbutton;// = this.prevbutton;
        var nextbutton;// = this.nextbutton;
        var prevbutton_size;
        var nextbutton_size;
        var nextbutton_enable = false;
        var prevbutton_enable = false;

        var tabpage_position = { left: 0, top: 0, width: 0, height: 0 };

        //var tabbuttonitems_by_line = [];
        var cur_line_width = 0;
        var cur_line_height = 0;
        var cur_line_index = 0;
        //var index_in_line = 0;
        var line_count = 0;

        var tabbuttonitems = this._tabbuttonitems;
        var tabbuttonitems_len = tabbuttonitems.length;
        var tabbuttonitem;
        var tabbuttonitem_sizeinfo, tabbuttonitem_pos;

        var tab_width = this._getClientWidth();
        var tab_height = this._getClientHeight();
        // var tab_border = this._border || this._getCSSStyleValue("border");
        // var tab_border_l = 0, tab_border_t = 0, tab_border_r = 0, tab_border_b = 0;
        // if (tab_border)
        // {
        //    if (tab_border.left)
        //        tab_border_l = tab_border.left._width;
        //    if (tab_border.top)
        //        tab_border_t = tab_border.top._width;
        //    if (tab_border.right)
        //        tab_border_r = tab_border.right._width;
        //    if (tab_border.bottom)
        //        tab_border_b = tab_border.bottom._width;
        // }

        var tabpages = this._p_tabpages;
        var tabpages_len = tabpages.length;
        var tabpage;

        var tabpage_border = this._getTabpageBorder();
        var tabpage_border_l = 0, tabpage_border_t = 0, tabpage_border_r = 0, tabpage_border_b = 0;

        if (tabpage_border)
        {
            if (tabpage_border.left)
                tabpage_border_l = tabpage_border.left._width;
            if (tabpage_border.top)
                tabpage_border_t = tabpage_border.top._width;
            if (tabpage_border.right)
                tabpage_border_r = tabpage_border.right._width;
            if (tabpage_border.bottom)
                tabpage_border_b = tabpage_border.bottom._width;
        }

        var tab_max_width = tab_width;// - (tab_border_l + tab_border_r);
        var tab_max_height = tab_height;// - (tab_border_t + tab_border_b);

        if (tab_max_width <= 0 || tab_max_height <= 0)
            return;

        tabpage_position.width = tab_width;
        tabpage_position.height = tab_height;

        var tab_buttonwidth = this._p_tabbuttonwidth;
        var tab_buttonheight = this._p_tabbuttonheight;

        var tab_selectedbuttonwidth = this._p_selectedtabbuttonwidth;
        var tab_selectedbuttonheight = this._p_selectedtabbuttonheight;

        /* TODO rotatetext
        if (brotatetext && (tabposition == "left" || tabposition == "right"))
            tab_max_width = tab_height;
        */

        this._setTabButtonItemsSizeInfo();

        var tabbuttonitem_max_size = this._getTabbuttonItemsMaxSize();
        var tabbuttonitem_max_width = tabbuttonitem_max_size[0];
        var tabbuttonitem_max_height = tabbuttonitem_max_size[1];

        /*
        if (bshowextrabutton)
        {
            if (extrabutton_size)
                tabbuttonitem_max_width += extrabutton_size.width;
            else
                tabbuttonitem_max_width += tabbuttonitem_max_height;
        }
        */

        /*START: set tabbuttonitems position , bshowspin*/
        var begin_index = 0;
        var end_index = 0;

        var bovered = false;
        var blastitem = false;
        var bovered_cur_line = false;

        var i;
        for (i = 0; i < tabbuttonitems_len; i++)
        {
            tabbuttonitem = tabbuttonitems[i];
            tabpage = tabbuttonitem._tabpage;

            tabbuttonitem_sizeinfo = tabbuttonitem._sizeinfo;
            tabbuttonitem_pos = tabbuttonitem._position;

            var tabbuttonitem_width = tabbuttonitem_sizeinfo.width;
            var tabbuttonitem_height = tabbuttonitem_sizeinfo.height;

            var prop_tabbuttonitemwidth = tabpage._p_tabbuttonwidth;
            var prop_tabbuttonitemheight = tabpage._p_tabbuttonheight;

            var each_tabbuttonitemwidth = undefined;
            var each_tabbuttonitemheight = undefined;

            if (!bmultiline)
            {
                if (btabjustify)
                {
                    if (tabposition == "top" || tabposition == "bottom")
                    {
                        if (tab_buttonheight !== undefined)
                            each_tabbuttonitemheight = tab_buttonheight;

                        if (prop_tabbuttonitemheight !== undefined)
                            each_tabbuttonitemheight = prop_tabbuttonitemheight;

                        if (tabbuttonitem._tabindex == tabindex)
                        {
                            if (tab_selectedbuttonheight !== undefined)
                                each_tabbuttonitemheight = tab_selectedbuttonheight;
                        }
                    }
                    else
                    {
                        if (tab_buttonwidth !== undefined)
                            each_tabbuttonitemwidth = tab_buttonwidth;

                        if (prop_tabbuttonitemwidth !== undefined)
                            each_tabbuttonitemwidth = prop_tabbuttonitemwidth;

                        if (tabbuttonitem._tabindex == tabindex)
                        {
                            if (tab_selectedbuttonwidth !== undefined)
                                each_tabbuttonitemwidth = tab_selectedbuttonwidth;
                        }
                    }
                }
                else
                {
                    if (tab_buttonwidth !== undefined)
                        each_tabbuttonitemwidth = tab_buttonwidth;
                    if (tab_buttonheight !== undefined)
                        each_tabbuttonitemheight = tab_buttonheight;

                    if (prop_tabbuttonitemwidth !== undefined)
                        each_tabbuttonitemwidth = prop_tabbuttonitemwidth;
                    if (prop_tabbuttonitemheight !== undefined)
                        each_tabbuttonitemheight = prop_tabbuttonitemheight;

                    if (tabbuttonitem._tabindex == tabindex)
                    {
                        if (tab_selectedbuttonwidth !== undefined)
                            each_tabbuttonitemwidth = tab_selectedbuttonwidth;
                        if (tab_selectedbuttonheight !== undefined)
                            each_tabbuttonitemheight = tab_selectedbuttonheight;
                    }
                }
            }

            if (bshowextrabutton)
            {
                if (!each_tabbuttonitemwidth)
                {
                    if (extrabutton_width)
                        tabbuttonitem_width += extrabutton_width;
                    else
                        tabbuttonitem_width += tabbuttonitem_max_width;
                }
            }

            if (bshowtabbuttonicon)
            {
                if (!each_tabbuttonitemwidth)
                {
                    if (tabbuttonicon_width)
                        tabbuttonitem_width += tabbuttonicon_width;
                    else
                        tabbuttonitem_width += tabbuttonitem_max_width;
                }
            }

            if (each_tabbuttonitemwidth !== undefined)
            {
                if (each_tabbuttonitemwidth < 0)
                    tabbuttonitem_width = 0;
                else
                    tabbuttonitem_width = each_tabbuttonitemwidth;
            }
            if (each_tabbuttonitemheight !== undefined)
            {
                if (each_tabbuttonitemheight < 0)
                    tabbuttonitem_height = 0;
                else
                    tabbuttonitem_height = each_tabbuttonitemheight;
            }

            if (tabposition == "top" || tabposition == "bottom")
            {
                tabbuttonitem_pos.width = tabbuttonitem_width;
                if (each_tabbuttonitemheight === undefined)
                    tabbuttonitem_pos.height = tabbuttonitem_max_height;
                else
                    tabbuttonitem_pos.height = each_tabbuttonitemheight;
            }
            else
            {
                if (each_tabbuttonitemwidth === undefined)
                    tabbuttonitem_pos.width = tabbuttonitem_max_width;
                else
                    tabbuttonitem_pos.width = each_tabbuttonitemwidth;

                if (!btabjustify)
                {
                    if (tabbuttonitem_max_height > tabbuttonitem_height)
                        tabbuttonitem_height = tabbuttonitem_max_height;
                }
                tabbuttonitem_pos.height = tabbuttonitem_height;
            }

            tabbuttonitem._line_index = 0;

            cur_line_width += tabbuttonitem_width;
            cur_line_height += tabbuttonitem_height;

            blastitem = ((i + 1) == tabbuttonitems_len);

            if (tabposition == "top" || tabposition == "bottom")
                bovered_cur_line = cur_line_width > tab_max_width;
            else
                bovered_cur_line = cur_line_height > tab_max_height;

            /* TODO rotatetext
            if (brotatetext && (tabposition == "left" || tabposition == "right"))
                bovered_cur_line = cur_line_width > tab_max_width;
            */

            if (bovered_cur_line || blastitem)
            {
                if (!bmultiline && bovered_cur_line && !bshowspin)
                {
                    bshowspin = true;

                    prevbutton_size = this._getPrevButtonSize();
                    nextbutton_size = this._getNextButtonSize();

                    if (!prevbutton_size || !nextbutton_size)
                        return;

                    if (tabposition == "top" || tabposition == "bottom")
                    {
                        tab_max_width -= (prevbutton_size.width + nextbutton_size.width);
                        if (prevbutton_size.height > tabbuttonitem_max_height || nextbutton_size.height > tabbuttonitem_max_height)
                            tabbuttonitem_max_height = (prevbutton_size.height > nextbutton_size.height) ? prevbutton_size.height : nextbutton_size.height;
                    }
                    else
                    {
                        tab_max_height -= (prevbutton_size.height + nextbutton_size.height);
                        if (prevbutton_size.width > tabbuttonitem_max_width || nextbutton_size.height > tabbuttonitem_max_width)
                            tabbuttonitem_max_width = (prevbutton_size.width > nextbutton_size.width) ? prevbutton_size.width : nextbutton_size.width;
                    }


                    i = -1;
                    cur_line_index = 0;
                    cur_line_width = 0;
                    cur_line_height = 0;

                    continue;
                }

                if (bovered_cur_line)
                {
                    end_index = i;
                    cur_line_width -= tabbuttonitem_width;
                    cur_line_height -= tabbuttonitem_height;

                    bovered = true;
                }
                else     // blastitem == true                        
                {
                    end_index = i + 1;
                }

                if (bshowspin && btabjustify)
                {
                    btabjustify = false;

                    i = -1;
                    cur_line_index = 0;
                    cur_line_width = 0;
                    cur_line_height = 0;

                    continue;
                }

                if (btabjustify || (bmultiline && bovered))
                {
                    var extra_width = tab_max_width - cur_line_width;
                    var extra_height = tab_max_height - cur_line_height;

                    var remainning = 0;
                    if (tabposition == "top" || tabposition == "bottom")
                        remainning = extra_width;
                    else
                        remainning = extra_height;

                    var ratio = 1;

                    for (var j = begin_index; j < end_index; j++)
                    {
                        tabbuttonitem = tabbuttonitems[j];
                        if (bmultiline)
                        {
                            tabbuttonitem._line_index = cur_line_index;
                            // tabbuttonitem._index_in_line = j - begin_index;
                        }
                        else
                        {
                            tabbuttonitem._line_index = 0;
                            // tabbuttonitem._index_in_line = j;
                        }

                        tabbuttonitem_pos = tabbuttonitem._position;
                        if (tabposition == "top" || tabposition == "bottom")
                        {
                            ratio = tabbuttonitem_pos.width / cur_line_width;
                            if ((j + 1) == end_index)
                                tabbuttonitem_pos.width += remainning;
                            else
                                tabbuttonitem_pos.width += Math.ceil(extra_width * ratio);

                            remainning -= Math.ceil(extra_width * ratio);
                        }
                        else
                        {
                            ratio = tabbuttonitem_pos.height / cur_line_height;
                            if ((j + 1) == end_index)
                                tabbuttonitem_pos.height += remainning;
                            else
                                tabbuttonitem_pos.height += Math.ceil(extra_height * ratio);

                            remainning -= Math.ceil(extra_height * ratio);
                        }
                    }
                }

                if (end_index == tabbuttonitems_len || begin_index == end_index)
                    break;

                cur_line_width = 0;
                cur_line_height = 0;

                begin_index = i;
                cur_line_index++;
                i--;

                continue;
            }
        }

        line_count = cur_line_index + 1;
        /*END*/

        /*START: set beginTabindex*/

        /******
            beginTabindex     : which is the index of tab to show at first
            beginTabindex < 0 :  which is shown in front of the index of tab in current state
            beginTabindex == undefined or null: the current index of tab is placed the last
        ******/

        if (beginTabindex < 0)
            beginTabindex = this._getFirstTabbuttonIndex();

        if (beginTabindex == undefined || beginTabindex == null)
        {
            var temp_width = 0;
            var temp_height = 0;
            for (i = tabindex; i >= 0; i--)
            {
                tabbuttonitem = tabbuttonitems[i];
                tabbuttonitem_pos = tabbuttonitem._position;
                temp_width += tabbuttonitem_pos.width;
                temp_height += tabbuttonitem_pos.height;

                if (tabposition == "top" || tabposition == "bottom")
                {
                    if (temp_width <= tab_max_width && tabbuttonitems[i].left > -1)
                        beginTabindex = i;
                    else
                        break;
                }
                else
                {
                    if (temp_height <= tab_max_height && tabbuttonitems[i].top > -1)
                        beginTabindex = i;
                    else
                        break;
                }

            }
        }
        /*END*/

        /*START:  arrange tabbuttonitems*/
        var left = 0;
        var top = 0;
        var pre_tabbuttonitem;
        var pre_line_index = 0;
        var start_line_index = 0;

        if (tabindex > 0)
        {
            tabbuttonitem = tabbuttonitems[tabindex];
            start_line_index = tabbuttonitem._line_index;
        }

        for (i = 0; i < tabbuttonitems_len; i++)
        {
            tabbuttonitem = tabbuttonitems[i];
            tabbuttonitem_pos = tabbuttonitem._position;
            cur_line_index = tabbuttonitem._line_index;

            if (bmultiline)
            {
                cur_line_index = (cur_line_index - start_line_index);
                if (cur_line_index < 0)
                    cur_line_index += line_count;
            }
            else
                cur_line_index = 0;

            if (tabposition == "top" || tabposition == "bottom")
            {
                if (pre_line_index != cur_line_index)
                    left = 0;

                if (tabposition == "top")
                {

                    if (bmultiline)
                        top = tabbuttonitem_max_height * (line_count - cur_line_index - 1);
                    else
                        top = tabbuttonitem_max_height - tabbuttonitem_pos.height;

                    tabbuttonitem_pos.height += tabpage_border_t;

                    /*
                    if (cur_line_index == 0)
                    {
                        if (tabbuttonitem._tabindex == tabindex)
                            tabbuttonitem._setBorderNone("bottom");
                        else
                            tabbuttonitem._setBorderNone("");
                    }
                      */
                }
                else //bottom
                {
                    if (bmultiline)
                        top = tab_max_height - tabbuttonitem_max_height * (line_count - cur_line_index);
                    else
                        top = tab_max_height - tabbuttonitem_max_height;

                    top -= tabpage_border_b;

                    /*
                    if (cur_line_index == 0)
                    {
                        if (tabbuttonitem._tabindex == tabindex)
                            tabbuttonitem._setBorderNone("top");
                        else
                            tabbuttonitem._setBorderNone("");
                    }
                      */
                }

                if (!btabjustify && !bmultiline)
                {
                    if (i == 0)
                        left += this._tabbuttonstartgap;
                    else if (i > 0)
                        left += this._tabbuttongap;
                }

                tabbuttonitem_pos.left = left;
                tabbuttonitem_pos.top = top;

                left = this._adjustTabButtonPosition(beginTabindex, tabbuttonitem, tab_width, tab_max_width, bovered, bmultiline);

                if (this._env._p_enableaccessibility)
                {
                    prevbutton_enable = true;
                    if (nextbutton_enable || (!bmultiline && left > tab_max_width))
                    {
                        nextbutton_enable = true;
                    }
                }
                else
                {
                    pre_tabbuttonitem = tabbuttonitems[i - 1];
                    if (nextbutton_enable || (!bmultiline && left > tab_max_width))
                    {
                        nextbutton_enable = true;
                    }

                    if (tabbuttonitem._p_visible && pre_tabbuttonitem && !pre_tabbuttonitem._p_visible)
                    {
                        prevbutton_enable = true;
                    }
                }
                //TODO rotatetext
                // if (brotatetext && (tabposition == "left" || tabposition == "right"))
                //     need to convert position 
            }
            else        //left,right
            {
                if (pre_line_index != cur_line_index)
                    top = 0;

                if (tabposition == "left")
                {
                    if (bmultiline)
                        left = tabbuttonitem_max_width * (line_count - (cur_line_index + 1));
                    else
                        left = tabbuttonitem_max_width - tabbuttonitem_pos.width;

                    tabbuttonitem_pos.width += tabpage_border_l;

                    /*
                    if (cur_line_index == 0)
                    {
                        if (tabbuttonitem._tabindex == tabindex)
                            tabbuttonitem._setBorderNone("right");
                        else
                            tabbuttonitem._setBorderNone("");
                    }
                    */
                }
                else //right
                {
                    if (bmultiline)
                        left = tab_max_width - tabbuttonitem_max_width * (line_count - cur_line_index);
                    else
                        left = tab_max_width - tabbuttonitem_max_width;

                    left -= tabpage_border_r;

                    /*
                    if (cur_line_index == 0)
                    {
                        if (tabbuttonitem._tabindex == tabindex)
                            tabbuttonitem._setBorderNone("left");
                        else
                            tabbuttonitem._setBorderNone("");
                    }*/
                }

                if (!btabjustify && !bmultiline)
                {
                    if (i == 0)
                        top += this._tabbuttonstartgap;
                    else if (i > 0)
                        top += this._tabbuttongap;
                }

                tabbuttonitem_pos.left = left;
                tabbuttonitem_pos.top = top;

                top = this._adjustTabButtonPosition(beginTabindex, tabbuttonitem, tab_height, tab_max_height, bovered);

                if (this._env._p_enableaccessibility)
                {
                    nextbutton_enable = true;
                    prevbutton_enable = true;
                }
                else
                {
                    pre_tabbuttonitem = tabbuttonitems[i - 1];

                    if (nextbutton_enable || (!bmultiline && top > tab_max_height))
                    {
                        nextbutton_enable = true;
                    }

                    if (tabbuttonitem._p_visible && pre_tabbuttonitem && !pre_tabbuttonitem._p_visible)
                    {
                        prevbutton_enable = true;
                    }
                }
            }

            pre_line_index = cur_line_index;

            if (bmultiline)
            {
                tabbuttonitem.set_visible(this._p_usetabbutton);
                if (tabindex != tabbuttonitem._tabindex)
                {
                    this._changeUserStatusAll(tabbuttonitem, false);
                }
            }

            if (i == tabindex)
            {
                this._changeUserStatusAll(tabbuttonitem, true);
            }

            if (tabbuttonitem._p_visible)
            {
                /*
                                if (tabindex == tabbuttonitem._tabindex)
                                {
                                    tabbuttonitem._changeUserStatus("selected", true);
                                }
                                else
                                {
                                    tabbuttonitem._changeUserStatus("selected", false);
                                }
                */
                tabbuttonitem.move(tabbuttonitem_pos.left, tabbuttonitem_pos.top, tabbuttonitem_pos.width, tabbuttonitem_pos.height);
                tabbuttonitem._showTabButtonIcon(bshowtabbuttonicon, tabbuttonicon_width, (tabbuttonicon_height > tabbuttonitem_pos.height ? tabbuttonitem_pos.height : tabbuttonicon_height));
                tabbuttonitem._showExtraButton(bshowextrabutton, extrabutton_width, (extrabutton_height > tabbuttonitem_pos.height ? tabbuttonitem_pos.height : extrabutton_height));
                tabbuttonitem.set_cssclass(tabbuttonitem._tabpage.tabbuttoncssclass);
            }
        }
        /*END*/

        /*START:  set tabpage position*/

        var adjust_count = line_count;
        if (!bmultiline || line_count <= 1)
        {
            adjust_count = 1;
        }

        if (tabposition == "top" || tabposition == "bottom")
        {
            tabpage_position.height -= tabbuttonitem_max_height * adjust_count;
            if (tabposition == "top")
                tabpage_position.top += tabbuttonitem_max_height * adjust_count;
        }
        else
        {
            tabpage_position.width -= tabbuttonitem_max_width * adjust_count;
            if (tabposition == "left")
                tabpage_position.left += tabbuttonitem_max_width * adjust_count;
        }

        for (i = 0; i < tabpages_len; i++)
        {
            tabpage = tabpages[i];

            //if (tabpage.visible && i == tabindex)
            tabpage.move(tabpage_position.left, tabpage_position.top, tabpage_position.width, tabpage_position.height);
            if (tabpage._p_form && tabpage._p_form._is_loaded == true && (!tabpage._p_url || tabpage._p_url.length <= 0))
                tabpage._p_form.resetScroll();
        }
        /*END*/
        /*START:  set spinbutton position*/
        prevbutton = this._p_prevbutton;
        nextbutton = this._p_nextbutton;
        if (!bshowspin || !this._p_usetabbutton)
        {
            prevbutton.set_visible(false);
            nextbutton.set_visible(false);
        }
        else
        {
            var nextbutton_pos = { left: 0, top: 0, width: 0, height: 0 };
            var prevbutton_pos = { left: 0, top: 0, width: 0, height: 0 };

            nextbutton_pos.width = nextbutton_size.width;
            nextbutton_pos.height = nextbutton_size.height;

            prevbutton_pos.width = prevbutton_size.width;
            prevbutton_pos.height = prevbutton_size.height;

            if (tabposition == "top" || tabposition == "bottom")
            {
                prevbutton_pos.left = tab_max_width;
                nextbutton_pos.left = prevbutton_pos.left + prevbutton_pos.width;

                if (tabposition == "top")
                {
                    prevbutton_pos.top = tabpage_position.top - prevbutton_size.height;
                    nextbutton_pos.top = tabpage_position.top - nextbutton_size.height;
                }
                else
                {
                    prevbutton_pos.top = tabpage_position.height;
                    nextbutton_pos.top = tabpage_position.height;
                }
            }
            else
            {
                prevbutton_pos.top = tab_max_height;
                nextbutton_pos.top = prevbutton_pos.top + prevbutton_pos.height;

                if (tabposition == "left")
                {
                    prevbutton_pos.left = tabpage_position.left - prevbutton_size.width;
                    nextbutton_pos.left = tabpage_position.left - nextbutton_size.width;
                }
                else
                {
                    prevbutton_pos.left = tabpage_position.width;
                    nextbutton_pos.left = tabpage_position.width;
                }
            }

            prevbutton.move(prevbutton_pos.left, prevbutton_pos.top, prevbutton_pos.width, prevbutton_pos.height);
            nextbutton.move(nextbutton_pos.left, nextbutton_pos.top, nextbutton_pos.width, nextbutton_pos.height);
            if (!prevbutton._p_visible)
                prevbutton.set_visible(true);
            if (!nextbutton._p_visible)
                nextbutton.set_visible(true);

            prevbutton._setEnable(prevbutton_enable);
            nextbutton._setEnable(nextbutton_enable);

            if (!prevbutton_enable)
            {
                prevbutton._changeStatus("mouseover", false);
            }
            if (!nextbutton_enable)
            {
                nextbutton._changeStatus("mouseover", false);
            }
        }
        /*END*/
    };

    // 미사용 속성 (tabstyle)
    _pTab._rearrangeContentsForAccrdion = function (beginTabindex, getvalue)
    {
        // arrange tabbuttons
        var bshowextrabutton = this._p_showextrabutton;
        var extrabutton_size;
        var extrabutton_width = 0;
        var extrabutton_height = 0;

        var bshowtabbuttonicon = this._p_showtabbuttonicon;
        var tabbuttonicon_size;
        var tabbuttonicon_width = 0;
        var tabbuttonicon_height = 0;

        if (bshowextrabutton)
        {
            if (!this._extrabutton_size)
            {
                extrabutton_size = this._getExtraButtonSize();
                if (extrabutton_size)
                {
                    if (extrabutton_size.width != 0 || extrabutton_size.height != 0)
                        this._extrabutton_size = extrabutton_size;

                    extrabutton_width = extrabutton_size.width;
                    extrabutton_height = extrabutton_size.height;
                }
            }
            else
            {
                extrabutton_width = this._extrabutton_size.width;
                extrabutton_height = this._extrabutton_size.height;
            }
        }

        if (bshowtabbuttonicon)
        {
            if (!this._tabbuttonicon_size)
            {
                tabbuttonicon_size = this._getTabButtonIconSize();
                if (tabbuttonicon_size)
                {
                    if (tabbuttonicon_size.width != 0 || tabbuttonicon_size.height != 0)
                        this._tabbuttonicon_size = tabbuttonicon_size;

                    tabbuttonicon_width = tabbuttonicon_size.width;
                    tabbuttonicon_height = tabbuttonicon_size.height;
                }
            }
            else
            {
                tabbuttonicon_width = this._tabbuttonicon_size.width;
                tabbuttonicon_height = this._tabbuttonicon_size.height;
            }
        }

        var tabindex = this._p_tabindex;
        var tabpage_position = { left: 0, top: 0, width: 0, height: 0 };

        var cur_line_height = 0;
        var line_count = 0;

        var tabbuttonitems = this._tabbuttonitems;
        var tabbuttonitems_len = tabbuttonitems.length;
        var tabbuttonitem;
        var tabbuttonitem_sizeinfo, tabbuttonitem_pos;

        var tab_width = this._getClientWidth();
        var tab_height = this._getClientHeight();

        var tabpages = this._p_tabpages;
        var tabpages_len = tabpages.length;
        var tabpage;

        tabpage_position.width = tab_width;
        tabpage_position.height = tab_height;

        var tab_buttonheight = this._p_tabbuttonheight;
        var tab_selectedbuttonheight = this._p_selectedtabbuttonheight;

        this._setTabButtonItemsSizeInfo();

        /*START: set tabbuttonitems position*/
        var i;
        for (i = 0; i < tabbuttonitems_len; i++)
        {
            tabbuttonitem = tabbuttonitems[i];
            tabpage = tabbuttonitem._tabpage;

            tabbuttonitem_sizeinfo = tabbuttonitem._sizeinfo;
            tabbuttonitem_pos = tabbuttonitem._position;

            var tabbuttonitem_height = tabbuttonitem_sizeinfo.height;
            if (tab_buttonheight > 0)
            {
                tabbuttonitem_height = tab_buttonheight;
            }

            tabbuttonitem_pos.width = tab_width;

            if (tab_selectedbuttonheight > 0 && tabbuttonitem._tabindex == tabindex)
            {
                tabbuttonitem_pos.height = tab_selectedbuttonheight;
                cur_line_height += tab_selectedbuttonheight;
            }
            else
            {
                if ((tab_buttonheight == undefined && tab_selectedbuttonheight == undefined))
                {
                    if (tabbuttonitem_height < extrabutton_height)
                    {
                        tabbuttonitem_height = extrabutton_height;
                    }

                    if (tabbuttonitem_height < tabbuttonicon_height)
                    {
                        tabbuttonitem_height = tabbuttonicon_height;
                    }
                }

                tabbuttonitem_pos.height = tabbuttonitem_height;
                cur_line_height += tabbuttonitem_height;
            }

            tabbuttonitem._line_index = 0;
        }
        /*END*/

        /*START:  set tabpage position*/
        var firstTabindex = this._getFirstTabbuttonIndex();

        if (this._bshow_tabpage_accordion)
        {
            if (this._p_fittocontents == "both" || this._p_fittocontents == "height")
            {
                for (i = firstTabindex; i < tabpages_len; i++)
                {
                    if (i == tabindex)
                    {
                        if (tab_selectedbuttonheight > 0)
                            tabpage_position.top += tab_selectedbuttonheight;
                        else
                            tabpage_position.top += tabbuttonitem_height;

                        if (tabpage = tabpages[i])
                        {
                            var size = tabpage._on_getFitSize();
                            tabpage_position.height = size[1];

                            if (this._p_fittocontents == "both")
                                tabpage_position.width = size[0];

                            tabpage.move(tabpage_position.left, tabpage_position.top, tabpage_position.width, tabpage_position.height);

                            if (tabpage._p_form && tabpage._p_form._is_loaded == true && (!tabpage._p_url || tabpage._p_url.length <= 0))
                            {
                                tabpage._p_form.resetScroll();
                            }

                            if (this._p_fittocontents == "height")
                            {
                                var hscrollbar = tabpage._p_form ? tabpage._p_form._p_hscrollbar : null;
                                if (hscrollbar && hscrollbar._p_visible)
                                {
                                    tabpage_position.height += hscrollbar._adjust_height;
                                    tabpage.set_height(tabpage_position.height);
                                }
                            }
                        }
                    }
                    else
                    {
                        tabpage_position.top += tabbuttonitem_height;
                    }
                }
            }
            else // none, width
            {
                if (tab_selectedbuttonheight > 0)
                {
                    tabpage_position.height -= tabbuttonitem_height * (tabpages_len - 1);
                    tabpage_position.height -= tab_selectedbuttonheight;
                }
                else
                {
                    tabpage_position.height -= tabbuttonitem_height * tabpages_len;
                }

                for (i = firstTabindex; i < tabpages_len; i++)
                {
                    if (i == tabindex)
                    {
                        if (tab_selectedbuttonheight > 0)
                            tabpage_position.top += tab_selectedbuttonheight;
                        else
                            tabpage_position.top += tabbuttonitem_height;

                        if (tabpage = tabpages[i])
                        {
                            if (this._p_fittocontents == "width")
                            {
                                var size = tabpage._on_getFitSize();
                                tabpage_position.width = size[0];
                            }

                            tabpage.move(tabpage_position.left, tabpage_position.top, tabpage_position.width, tabpage_position.height);
                            if (tabpage._p_form && tabpage._p_form._is_loaded == true && (!tabpage._p_url || tabpage._p_url.length <= 0))
                            {
                                tabpage._p_form.resetScroll();
                            }

                            if (this._p_fittocontents == "width")
                            {
                                var vscrollbar = tabpage._p_form ? tabpage._p_form._p_vscrollbar : null;
                                if (vscrollbar && vscrollbar._p_visible)
                                {
                                    tabpage_position.width += vscrollbar._adjust_width;
                                    tabpage.set_width(tabpage_position.width);
                                }
                            }
                        }
                    }
                    else
                    {
                        tabpage_position.top += tabbuttonitem_height;
                    }
                }
            }
        }
        /*END*/

        /*START:  arrange tabbuttonitems*/
        var top = 0;
        var tabpage_height = 0;

        if (tabindex > 0)
        {
            tabbuttonitem = tabbuttonitems[tabindex];
            //start_line_index = tabbuttonitem._line_index;
        }

        for (i = 0; i < tabbuttonitems_len; i++)
        {
            tabbuttonitem = tabbuttonitems[i];
            tabbuttonitem_pos = tabbuttonitem._position;
            /*
            if (i == 0)
            {
                top += this._tabbuttonstartgap;
            }
            else if (i > 0)
            {
                top += this._tabbuttongap;
            }
            */
            if (i > 0 && this._bshow_tabpage_accordion)
            {
                if (tabpages[i - 1]._p_visible)
                    top += tabpages[i - 1]._adjust_height;
            }

            tabbuttonitem_pos.left = 0;
            tabbuttonitem_pos.top = top;

            tabbuttonitem.set_visible(this._p_usetabbutton);
            if (tabindex != tabbuttonitem._tabindex)
            {
                this._changeUserStatusAll(tabbuttonitem, false);
            }

            if (tabbuttonitem._p_visible)
            {
                top = tabbuttonitem_pos.top + tabbuttonitem_pos.height;
            }

            if (tabbuttonitem._p_visible)
            {
                tabbuttonitem.move(tabbuttonitem_pos.left, tabbuttonitem_pos.top, tabbuttonitem_pos.width, tabbuttonitem_pos.height);

                tabbuttonitem._showTabButtonIcon(bshowtabbuttonicon, tabbuttonicon_width, (tabbuttonicon_height > tabbuttonitem_pos.height ? tabbuttonitem_pos.height : tabbuttonicon_height));
                tabbuttonitem._showExtraButton(bshowextrabutton, extrabutton_width, (extrabutton_height > tabbuttonitem_pos.height ? tabbuttonitem_pos.height : extrabutton_height));
                tabbuttonitem.set_cssclass(tabbuttonitem._tabpage._p_tabbuttoncssclass);
            }

            if (this._bshow_tabpage_accordion)
            {
                if (i === tabindex)
                {
                    this._changeUserStatusAll(tabbuttonitem, true);
                }
            }
        }

        if (getvalue == undefined)
        {
            if (this._p_fittocontents == "both" || this._p_fittocontents == "width")
                this.set_width(tabpage_position.width);
            if (this._p_fittocontents == "both" || this._p_fittocontents == "height")
                this.set_height(cur_line_height + tabpage_position.height);
        }
        else
        {
            // _on_getFitSize
            getvalue[0] = this._adjust_width;
            getvalue[1] = this._adjust_height;

            if (this._p_fittocontents == "width" || this._p_fittocontents == "both")
            {
                getvalue[0] = tabpage_position.width;
            }
            if (this._p_fittocontents == "height" || this._p_fittocontents == "both")
            {
                getvalue[1] = cur_line_height + tabpage_position.height;
            }
        }
    }

    _pTab._on_getFitSize = function ()
    {
        if (this._bshow_tabpage_accordion)
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

            var retn = [0, 0];
            this._rearrangeContentsForAccrdion(null, retn);

            retn[0] += total_w;
            retn[1] += total_h;

            return retn;
        }
        else
        {
            return [this._adjust_width, this._adjust_height];
        }
    };


    _pTab._getExtraButtonSize = function ()
    {
        var extrabuttonsize, extrabuttonsize_w, extrabuttonsize_h;
        if (this._p_extrabuttonsize)
        {
            extrabuttonsize = this._p_extrabuttonsize.split(" ");

            extrabuttonsize_w = +extrabuttonsize[0];

            if (!isNaN(extrabuttonsize_w))
            {
                extrabuttonsize_h = +extrabuttonsize[1];
                if (isNaN(extrabuttonsize_h))
                    extrabuttonsize_h = extrabuttonsize_w;

                return { width: extrabuttonsize_w, height: extrabuttonsize_h };
            }
        }

        var tabbuttonitem = this._tabbuttonitems ? this._tabbuttonitems[0] : null;
        if (!tabbuttonitem)
            return null;

        return tabbuttonitem._getExtraButtonSize(this._p_showextrabutton);
    };

    _pTab._getTabButtonIconSize = function () 
    {
        var tabbuttoniconsize, tabbuttoniconsize_w, tabbuttoniconsize_h;
        if (this._p_tabbuttoniconsize)
        {
            tabbuttoniconsize = this._p_tabbuttoniconsize.split(" ");

            tabbuttoniconsize_w = +tabbuttoniconsize[0];

            if (!isNaN(tabbuttoniconsize_w))
            {
                tabbuttoniconsize_h = +tabbuttoniconsize[1];
                if (isNaN(tabbuttoniconsize_h))
                    tabbuttoniconsize_h = tabbuttoniconsize_w;

                return { width: tabbuttoniconsize_w, height: tabbuttoniconsize_h };
            }
        }

        var tabbuttonitem = this._tabbuttonitems ? this._tabbuttonitems[0] : null;
        if (!tabbuttonitem)
            return null;

        return tabbuttonitem._getTabButtonIconElementSize(this._p_showtabbuttonicon);
    };

    _pTab._getTabbuttonItemsMaxSize = function ()
    {
        var tabbuttonitems = this._tabbuttonitems;
        var tabbuttonitems_length = tabbuttonitems.length;
        var tabbuttonitem, size;
        var max_width = 0;
        var max_height = 0;
        var bshowextrabutton = this._p_showextrabutton;
        var bshowtabbuttonicon = this._p_showtabbuttonicon;
        var width = 0, height = 0;

        var tabindex = this._p_tabindex;
        var bmultiline = this._p_multiline;
        var btabjustify = this._p_tabjustify;
        var tabposition = this._p_tabposition;
        var tab_buttonwidth = this._p_tabbuttonwidth;
        var tab_buttonheight = bmultiline ? undefined : this._p_tabbuttonheight;
        var tab_selectedbuttonwidth = this._p_selectedtabbuttonwidth;
        var tab_selectedbuttonheight = this._p_selectedtabbuttonheight;
        var prop_tabbuttonitemwidth, prop_tabbuttonitemheight;
        var each_tabbuttonitemwidth, each_tabbuttonitemheight;
        var each_tabbuttonitem_maxwidth = 0;
        var each_tabbuttonitem_maxheight = 0;

        var tabpage;
        for (var i = 0; i < tabbuttonitems_length; i++)
        {
            tabbuttonitem = tabbuttonitems[i];
            tabpage = tabbuttonitem._tabpage;

            size = tabbuttonitem._sizeinfo;
            if (size)
            {
                width = size.width;
                height = size.height;
            }

            prop_tabbuttonitemwidth = tabpage._p_tabbuttonwidth;
            prop_tabbuttonitemheight = tabpage._p_tabbuttonheight;
            each_tabbuttonitemwidth = 0;
            each_tabbuttonitemheight = 0;

            if (!bmultiline)
            {
                if (btabjustify)
                {
                    if (tabposition == "top" || tabposition == "bottom")
                    {
                        if (tab_buttonheight)
                            each_tabbuttonitemheight = tab_buttonheight;

                        if (prop_tabbuttonitemheight)
                            each_tabbuttonitemheight = prop_tabbuttonitemheight;

                        if (tabbuttonitem._tabindex == tabindex)
                        {
                            if (tab_selectedbuttonheight)
                                each_tabbuttonitemheight = tab_selectedbuttonheight;
                        }
                    }
                    else
                    {
                        if (tab_buttonwidth)
                            each_tabbuttonitemwidth = tab_buttonwidth;

                        if (prop_tabbuttonitemwidth)
                            each_tabbuttonitemwidth = prop_tabbuttonitemwidth;

                        if (tabbuttonitem._tabindex == tabindex)
                        {
                            if (tab_selectedbuttonwidth)
                                each_tabbuttonitemwidth = tab_selectedbuttonwidth;
                        }
                    }
                }
                else
                {
                    if (tab_buttonwidth)
                        each_tabbuttonitemwidth = tab_buttonwidth;
                    if (tab_buttonheight)
                        each_tabbuttonitemheight = tab_buttonheight;

                    if (prop_tabbuttonitemwidth)
                        each_tabbuttonitemwidth = prop_tabbuttonitemwidth;
                    if (prop_tabbuttonitemheight)
                        each_tabbuttonitemheight = prop_tabbuttonitemheight;

                    if (tabbuttonitem._tabindex == tabindex)
                    {
                        if (tab_selectedbuttonwidth)
                            each_tabbuttonitemwidth = tab_selectedbuttonwidth;
                        if (tab_selectedbuttonheight)
                            each_tabbuttonitemheight = tab_selectedbuttonheight;
                    }
                }
            }

            if (each_tabbuttonitemheight > each_tabbuttonitem_maxheight)
            {
                each_tabbuttonitem_maxheight = each_tabbuttonitemheight;
            }
            if (each_tabbuttonitemwidth > each_tabbuttonitem_maxwidth)
            {
                each_tabbuttonitem_maxwidth = each_tabbuttonitemwidth;
            }

            if (tab_buttonwidth)
                width = tab_buttonwidth;
            if (tab_buttonheight)
                height = tab_buttonheight;

            if (height > max_height)
                max_height = height;
            if (width > max_width)
            {
                max_width = width;
            }
        }

        if (bshowextrabutton)
        {
            var extrabutton_size = this._extrabutton_size;
            if (extrabutton_size)
            {
                if (!each_tabbuttonitem_maxheight && extrabutton_size.height > max_height)
                    max_height = extrabutton_size.height;

                if (!tab_buttonwidth)
                    max_width += extrabutton_size.width;
            }
            else
            {
                if (!tab_buttonwidth)
                    max_width += max_height;
            }
        }

        if (bshowtabbuttonicon)
        {
            var tabbuttonicon_size = this._tabbuttonicon_size;
            if (tabbuttonicon_size)
            {
                if (!each_tabbuttonitem_maxheight && tabbuttonicon_size.height > max_height)
                    max_height = tabbuttonicon_size.height;

                if (!tab_buttonwidth)
                    max_width += tabbuttonicon_size.width;
            }
            else
            {
                if (!tab_buttonwidth)
                    max_width += max_height;
            }
        }

        if (each_tabbuttonitem_maxwidth > max_width)
        {
            max_width = each_tabbuttonitem_maxwidth;
        }

        if (each_tabbuttonitem_maxheight > max_height)
        {
            max_height = each_tabbuttonitem_maxheight;
        }

        return [max_width, max_height];
    };

    _pTab._setTabButtonItemsSizeInfo = function ()
    {
        var tabbuttonitems = this._tabbuttonitems;
        var tabbuttonitems_length = tabbuttonitems.length;
        var tabbuttonitem;

        var item_size;
        for (var i = 0; i < tabbuttonitems_length; i++)
        {
            tabbuttonitem = tabbuttonitems[i];

            item_size = tabbuttonitem._getItemSize();
            if (item_size)
            {
                tabbuttonitem._sizeinfo.width = item_size[0];
                tabbuttonitem._sizeinfo.height = item_size[1];
            }
        }
    };

    _pTab._on_get_extrabutton_iconsize = function (width, height)
    {
        this._extrabutton_size = null;
        this._rearrangeContents();
    };

    _pTab._on_get_tabbutton_iconsize = function (width, height)
    {
        this._tabbuttonicon_size = null;
        this._rearrangeContents();
    };

    _pTab._onload_prevbutton_iconimage = function (url, width, height)
    {
        if (this._prevbutton_size)
        {
            if (width == 0 || height == 0)
            {
                var size = this._default_spinbutton_size;
                width = size.width;
                height = size.height;
            }

            this._prevbutton_size.width = this._prevbutton_extrasize.width + width;
            this._prevbutton_size.height = this._prevbutton_extrasize.height + height;
        }
        this._rearrangeContents();
    };

    _pTab._onload_nextbutton_iconimage = function (url, width, height)
    {
        if (this._nextbutton_size)
        {
            if (width == 0 || height == 0)
            {
                var size = this._default_spinbutton_size;
                width = size.width;
                height = size.height;
            }

            this._nextbutton_size.width = this._nextbutton_extrasize.width + width;
            this._nextbutton_size.height = this._nextbutton_extrasize.height + height;
        }

        this._rearrangeContents();
    };

    _pTab._keydown_filter = function (elem, keycode, alt_key, ctrl_key, shift_key, event_bubbles, fire_comp, refer_comp, meta_key)
    {
        var tabpagecnt = this._p_tabpages.length;
        if (tabpagecnt <= 0)
            return false;

        var tabindex = this._p_tabindex;
        var oldtabindex = this._p_tabindex;

        var resettabindex = -1;
        var comp, newcomp = [], newcompobj;
        var tabpage, tabpage_form;
        var page_first_comp, page_last_comp;
        var focusobj;

        var _is_fire_keydown = this._isComponentKeydownAction();

        switch (keycode)
        {
            case 9: // nexacro.Event.KEY_TAB:
                if (ctrl_key == true && this._p_usecontrolkey)
                {
                    //html : X, Runtime : O
                    //{
                    if (shift_key != true) //순방향;
                    {
                        if (tabindex < tabpagecnt - 1)
                        {
                            resettabindex = tabindex + 1;
                        }
                        else // last tabindex
                        {
                            resettabindex = 0;
                        }
                    }
                    else
                    {
                        if (tabindex > 0)
                        {
                            resettabindex = tabindex - 1;
                        }
                        else // first tabindex
                        {
                            resettabindex = tabpagecnt - 1;
                        }
                    }

                    if (this._focusobj instanceof nexacro._TabButtonItemControl)
                    {
                        this._setTabFocusObj(this._tabbuttonitems[resettabindex]);
                    }
                    else if (this._focusobj instanceof nexacro.Tabpage)
                    {
                        this._setTabFocusObj(this.tabpages[resettabindex]);
                    }
                    break;
                    //}
                }
                else
                {
                    var newfocus_comp;

                    //focusacceptable=false이면 tabpage,tabpage내 component 순서로 이동;shift는 역순;
                    if (this._focusobj instanceof nexacro.Tab)
                    {
                        var env;
                        var text;
                        var control_elem;
                        var win;

                        if (shift_key == false)
                        {
                            if (this.focusacceptable)
                            {
                                this._setTabFocusObj(this._tabbuttonitems[tabindex]);
                                this._tabbuttonitems[tabindex]._setFocus(false, 0);
                            }
                            else
                            {
                                tabpage = this._p_tabpages[tabindex];
                                tabpage_form = tabpage._p_form;
                                page_first_comp = tabpage_form._getTabOrderFirst();
                                if (page_first_comp)
                                {
                                    if (tabpage_form._last_focused)
                                    {
                                        win = this._getWindow();
                                        win._removeFromCurrentFocusPath(tabpage_form._last_focused);
                                    }
                                    page_first_comp._setFocus(false, 0);
                                    this._setTabFocusObj(tabpage);
                                }
                                else
                                {
                                    newfocus_comp = this._p_parent._searchNextTabFocus(this, null, null, 0);
                                    if (newfocus_comp)
                                    {
                                        if (newfocus_comp[0] == null)
                                        {
                                            // MainForm 내에서 처음 또는 끝에 도달한 경우임.
                                            if (newfocus_comp[2] == 1)
                                            {
                                                // "마지막 컴포넌트 입니다."
                                                // TODO Accessibility API로 연결
                                                env = this._env;
                                                if (env)
                                                {
                                                    text = env._p_accessibilitylastovertext;
                                                    control_elem = this._control_element;
                                                    control_elem.notifyAccessibility(text, "notify", true);
                                                    //nexacro.__notifyAccessibility(this._control_element, text);
                                                }
                                            }
                                            else if (newfocus_comp[2] == -1)
                                            {
                                                // "첫번째 컴포넌트 입니다."
                                                // TODO Accessibility API로 연결
                                                env = this._env;
                                                if (env)
                                                {
                                                    text = env._p_accessibilityfirstovertext;
                                                    control_elem = this._control_element;
                                                    control_elem.notifyAccessibility(text, "notify", true);
                                                    //nexacro.__notifyAccessibility(this._control_element, text);
                                                }
                                            }
                                        }
                                        else
                                        {
                                            if (newfocus_comp[0] instanceof nexacro.Form && newfocus_comp[0]._last_focused)
                                            {
                                                win = this._getWindow();
                                                win._removeFromCurrentFocusPath(newfocus_comp[0]._last_focused);
                                            }

                                            // newfocus_comp가 최종 포커스 받을 대상이 된다.
                                            // newfocus_comp가 Container Type인 경우, 내부 컴포넌트가 모두 포커스를 받을 수 없는
                                            // 상황이다. 이 경우 더이상 내부로 진입시키면 안된다. -> block_inner_focus = true
                                            newfocus_comp[0]._setFocus(true, 1, true);
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            newfocus_comp = this._p_parent._searchPrevTabFocus(this);
                            if (newfocus_comp)
                            {
                                if (newfocus_comp[0] == null)
                                {
                                    // MainForm 내에서 처음 또는 끝에 도달한 경우임.
                                    if (newfocus_comp[2] == 1)
                                    {
                                        // "마지막 컴포넌트 입니다."
                                        // TODO Accessibility API로 연결
                                        env = this._env;
                                        if (env)
                                        {
                                            text = env._p_accessibilitylastovertext;
                                            control_elem = this._control_element;
                                            control_elem.notifyAccessibility(text, "notify", true);
                                            //nexacro.__notifyAccessibility(this._control_element, text);
                                        }
                                    }
                                    else if (newfocus_comp[2] == -1)
                                    {
                                        // "첫번째 컴포넌트 입니다."
                                        // TODO Accessibility API로 연결
                                        env = this._env;
                                        if (env)
                                        {
                                            text = env._p_accessibilityfirstovertext;
                                            control_elem = this._control_element;
                                            control_elem.notifyAccessibility(text, "notify", true);
                                            //nexacro.__notifyAccessibility(this._control_element, text);
                                        }
                                    }
                                }
                                else
                                {
                                    if (newfocus_comp[0] instanceof nexacro.Form && newfocus_comp[0]._last_focused)
                                    {
                                        win = this._getWindow();
                                        win._removeFromCurrentFocusPath(newfocus_comp[0]._last_focused);
                                    }

                                    // newfocus_comp가 최종 포커스 받을 대상이 된다.
                                    // newfocus_comp가 Container Type인 경우, 내부 컴포넌트가 모두 포커스를 받을 수 없는
                                    // 상황이다. 이 경우 더이상 내부로 진입시키면 안된다. -> block_inner_focus = true
                                    newfocus_comp[0]._setFocus(true, 1, true);
                                }
                            } // newfocus_comp
                        } // shift_key == true
                    }
                    else if (this._focusobj instanceof nexacro._TabButtonItemControl)
                    {
                        if (shift_key == false)
                        {
                            newfocus_comp = this._searchNextTabFocus(this._focusobj, false, false, 0);

                            if (newfocus_comp && newfocus_comp[0])
                            {
                                newfocus_comp[0]._setFocus(true, 0, true);
                            }
                            this._setTabFocusObj(newfocus_comp[0]);
                        } // shift_key == false
                        else
                        {
                            newfocus_comp = this._searchPrevTabFocus(this._focusobj, false, false, 0);

                            if (newfocus_comp && newfocus_comp[0])
                            {
                                newfocus_comp[0]._setFocus(true, 0, true);
                            }
                        }
                    }
                    else if (this._focusobj instanceof nexacro.Tabpage)
                    {
                        // tabpage에 tab이벤트 발생안하는 현상 예외처리
                        if (!this._p_focusacceptable && !_is_fire_keydown)
                            return false;

                        tabpage = this._focusobj;
                        tabpage_form = tabpage._p_form;
                        page_last_comp = tabpage_form._getLastFocused();
                        page_first_comp = tabpage_form._getTabOrderFirst(0);

                        if (shift_key == false)
                        {
                            if (page_last_comp)
                            {
                                comp = this._focusobj._p_form._searchNextTabFocus(page_last_comp, undefined, undefined, 0);
                                if (comp && comp[0])
                                {
                                    comp[0]._setFocus(true, 0, true);
                                }
                            }
                            else if (page_first_comp)
                            {
                                page_first_comp._setFocus(true, 0, true);
                            }
                            else
                            {
                                comp = this._p_parent._searchNextTabFocus(this, undefined, undefined, 0);
                                if (comp && comp[0])
                                {
                                    comp[0]._setFocus(true, 0, true);
                                }
                            }
                        }
                        else
                        {

                            if (!page_last_comp || page_last_comp == page_first_comp)
                            {
                                if (this._p_focusacceptable)
                                {
                                    newcomp.push(this._tabbuttonitems[tabindex]);
                                }
                                else
                                {
                                    newcomp = this._p_parent._searchPrevTabFocus(this, undefined, undefined, 0);
                                }

                                if (newcomp[0])
                                    newcomp[0]._setFocus(true, 1, true);
                            }
                            else
                            {
                                comp = this._focusobj.form._searchPrevTabFocus(page_last_comp, undefined, undefined, 0);
                                if (comp && comp[0])
                                {
                                    comp[0]._setFocus(true, 0, true);
                                }
                            }
                        } //shift_key == true
                    } //focusobj == TabPage 
                    return true;
                }
            //break;
            case 8: // CY_VK_BACK:
                if (ctrl_key == true && this._p_usecontrolkey)
                {
                    this.on_fire_onextrabuttonclick(this, tabindex, "", false, false, false, -1, -1, -1, -1, -1, -1, this, this);

                    return true;
                }
                break;
            case 38: //nexacro.Event.KEY_UP;
                {
                    if (this._env._p_enableaccessibility && _is_fire_keydown)
                    {
                        //if button -> go tab
                        focusobj = this._focusobj;
                        newcompobj = null;

                        if (focusobj instanceof nexacro.Tab)
                        {
                            newcompobj = this._p_parent._searchPrevTabFocus(focusobj, undefined, undefined, 7 + 8);
                        }
                        else if (focusobj instanceof nexacro._TabButtonItemControl)
                        {
                            if (this._isAccessibilityEnable())
                                newcomp = this;
                            else
                            {
                                newcompobj = this._p_parent._searchPrevTabFocus(this, undefined, undefined, 7 + 8);
                            }
                        }
                        else if (focusobj instanceof nexacro.Tabpage)
                        {
                            tabpage_form = focusobj._p_form;
                            page_last_comp = tabpage_form._getLastFocused();
                            // page_first_comp = tabpage_form._getTabOrderFirst(7 + 8);

                            /*
                            if (page_last_comp == page_first_comp)
                            {
                                if (this.focusacceptable)
                                    newcomp = this._tabbuttonitems[focusobj.parent.tabindex];
                                else
                                {
                                    if (!this._isAccessibilityEnable())
                                    {
                                        newcompobj = this.parent._searchPrevTabFocus(this, undefined, undefined, 7 + 8);
                                        if (newcompobj && newcompobj[0])
                                            newcomp = newcompobj[0];
                                    }
                                    else
                                        newcomp = this;
                                }
                            }
                            else 
                            */

                            if (!ctrl_key)
                            {
                                if (page_last_comp)
                                {

                                    comp = tabpage_form._searchPrevTabFocus(page_last_comp, undefined, undefined, 7 + 8);
                                    if (comp && comp[0])
                                    {
                                        newcomp = comp[0];
                                    }
                                }
                                else
                                {
                                    if (this._p_focusacceptable)
                                        newcomp = this._tabbuttonitems[focusobj._p_parent._p_tabindex];
                                    else
                                    {
                                        if (!this._isAccessibilityEnable())
                                        {
                                            newcompobj = this._p_parent._searchPrevTabFocus(this, undefined, undefined, 7 + 8);
                                            if (newcompobj && newcompobj[0])
                                                newcomp = newcompobj[0];
                                        }
                                        else
                                            newcomp = this;
                                    }

                                    //newcompobj = this.parent._searchPrevTabFocus(this, undefined, undefined, 7 + 8);
                                }
                            }


                        } //(focusobj instanceof nexacro.Tabpage)

                        if (newcompobj && newcompobj[0]) 
                        {
                            newcomp = newcompobj[0];
                            newcomp._setFocus(true, 3, true);
                        }
                        else 
                        {
                            if (newcomp && !(newcomp instanceof Array))
                            {
                                newcomp._setFocus(true, 3, true);
                                this._setTabFocusObj(newcomp);
                            }
                        }

                        return true;
                    }
                }
                break;
            case 40: //nexacro.Event.KEY_DOWN:
                {
                    //if button -> go tabpage
                    if (this._env._p_enableaccessibility && _is_fire_keydown)
                    {
                        focusobj = this._focusobj;
                        newcompobj = null;
                        if (focusobj instanceof nexacro.Tab)
                        {
                            if (this.focusacceptable)
                            {
                                newcomp = this._tabbuttonitems[this._p_tabindex];
                            }
                            else
                            {
                                newcomp = this._p_tabpages[this._p_tabindex];
                                tabpage_form = newcomp._p_form;
                                if (tabpage_form._last_focused)
                                {
                                    tabpage_form._last_focused = null;
                                }
                                if (!newcomp._isAccessibilityEnable())
                                {
                                    newcompobj = tabpage_form._searchNextTabFocus(focusobj._last_focused, false, false, 7 + 8);
                                }
                            }
                        }
                        else if (focusobj instanceof nexacro._TabButtonItemControl)
                        {
                            tabpage = this._p_tabpages[this._p_tabindex];
                            tabpage_form = tabpage._p_form;
                            if (tabpage_form._last_focused)
                            {
                                tabpage_form._last_focused = null;
                            }
                            if (!tabpage._isAccessibilityEnable()) 
                            {
                                newcompobj = tabpage_form._searchNextTabFocus(null, true, false, 7 + 8);

                                if (!newcompobj)
                                {
                                    comp = this._p_parent._searchNextTabFocus(this, undefined, undefined, 7 + 8);
                                    if (comp && comp[0])
                                    {
                                        comp[0]._setFocus(true, 2, true);
                                    }
                                }
                            }
                            else
                                newcomp = tabpage;
                        }
                        else if (focusobj instanceof nexacro.Tabpage)
                        {
                            tabpage = focusobj;
                            tabpage_form = tabpage._p_form;
                            page_first_comp = tabpage_form._getTabOrderFirst(7 + 8);
                            page_last_comp = tabpage_form._getLastFocused();

                            if (!ctrl_key && !alt_key && !shift_key)
                            {
                                if (page_last_comp)
                                {
                                    comp = tabpage_form._searchNextTabFocus(page_last_comp, undefined, undefined, 7 + 8);
                                    if (comp && comp[0])
                                    {
                                        comp[0]._setFocus(true, 2, true);
                                    }
                                }
                                else if (page_first_comp)
                                {
                                    newcomp = page_first_comp;
                                }
                                else
                                {
                                    newcompobj = this._p_parent._searchNextTabFocus(this, undefined, undefined, 7 + 8);
                                }
                            }
                        }

                        if (newcompobj && newcompobj[0])
                        {
                            newcomp = newcompobj[0];
                            newcomp._setFocus(true, 2, true);
                        }
                        else
                        {
                            if (newcomp && !(newcomp instanceof Array))
                            {
                                newcomp._setFocus(true, 2, true);
                                this._setTabFocusObj(newcomp);
                            }
                        }
                        return true;
                    }
                }
                break;
            case 39: // nexacro.Event.KEY_RIGHT:
                if (this._p_focusacceptable && ctrl_key == false && _is_fire_keydown)
                {
                    focusobj = this._focusobj;
                    if (focusobj instanceof nexacro._TabButtonItemControl)
                    {
                        if (tabindex < tabpagecnt - 1)
                        {
                            resettabindex = tabindex + 1;
                        }
                        else // last tabindex
                        {
                            resettabindex = 0;
                        }
                        this._setTabFocusObj(this._tabbuttonitems[resettabindex]);
                    }
                }
                break;
            case 37: // nexacro.Event.KEY_LEFT:
                if (this._p_focusacceptable && ctrl_key == false && _is_fire_keydown)
                {
                    focusobj = this._focusobj;
                    if (focusobj instanceof nexacro._TabButtonItemControl)
                    {
                        if (tabindex > 0)
                        {
                            resettabindex = tabindex - 1;
                        }
                        else // first tabindex
                        {
                            resettabindex = tabpagecnt - 1;
                        }
                        this._setTabFocusObj(this._tabbuttonitems[resettabindex]);
                    }
                }
                break;
            default:
                break;
        }

        if (resettabindex > -1)
        {
            if (this._changeTabIndex(resettabindex, true) == true)
            {
                if (this._p_enableevent)
                {
                    this.on_fire_onchanged(this, resettabindex, oldtabindex);
                }

                this._rearrangeContents();
            }
        }
    };
    _pTab._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        var focusobj = this._focusobj;
        if (focusobj && !(focusobj instanceof nexacro.Tab || focusobj instanceof nexacro._TabButtonItemControl || focusobj instanceof nexacro.Tabpage))
        {
            return focusobj._getDlgCode(keycode, altKey, ctrlKey, shiftKey);
        }
        else
        {
            return { want_tab: true, want_return: false, want_escape: false, want_chars: false, want_arrows: this._isEnable() };
        }
    };

    _pTab._setTabFocusObj = function (focusobj)
    {
        this._focusobj = focusobj;
    };

    _pTab._getTabFocusObj = function ()
    {
        return this._focusobj;
    };

    _pTab._getComponentsByTaborder = function (p, filter_type)
    {
        if (filter_type === undefined)
            filter_type = 4;

        if (p && p !== this)
            return nexacro.FormBase._getComponentsByTaborder.call(this, p, filter_type);

        if (!this._isEnable())
            return null;

        var tabpage = this._p_tabpages[this._p_tabindex];
        var tabbuttonitem = this._tabbuttonitems[this._p_tabindex];

        var comp;
        var comps = (this._p_focusacceptable && tabbuttonitem) ? [tabbuttonitem] : [];

        if ((filter_type & 4) || (tabpage && tabpage._p_form._child_list && tabpage._p_form._child_list.length > 0))
        {
            comps.push(tabpage);
        }

        var comp_len = comps.length;
        for (var i = 0, ar = []; i < comp_len; i++)
        {
            comp = comps[i];
            if (!comp || !comp._is_created || !comp._p_visible || ((comp._isEnable && !comp._isEnable() || !comp._p_enable) && !(filter_type & 2)) || comp._popup)
                continue;

            if (!(filter_type & 1) && !comp.on_get_prop_tabstop())
                continue;

            ar[ar.length] = comp;
        }

        return ar;
    };

    _pTab._searchNextTabFocus = function (current, bSearchFromFirst, opt_force_cycle, filter_type)
    {
        var ret = nexacro.FormBase.prototype._searchNextTabFocus.call(this, current, bSearchFromFirst, opt_force_cycle, filter_type);

        if (ret && bSearchFromFirst && ret[0] instanceof nexacro.Tabpage)
        {
            if (ret[0]._p_form._child_list == 0 && !(filter_type & 4))
                return [this];
        }
        return ret;
    };

    _pTab._searchPrevTabFocus = function (current, bSearchFromLast, opt_force_cycle, filter_type)
    {
        var ret = nexacro.FormBase.prototype._searchPrevTabFocus.call(this, current, bSearchFromLast, opt_force_cycle, filter_type);

        if (ret && bSearchFromLast)
        {
            var next = ret[0];
            if (next instanceof nexacro.Tabpage)
            {
                if (next._p_form._child_list == 0 && !(filter_type & 4))
                    return [this];
            }
        }

        return ret;
    };

    _pTab._getTabOrderNext = function (current, direction, filter_type)
    {
        var tabbuttonitem = this._tabbuttonitems[this._p_tabindex];
        var tabpage = this._p_tabpages[this._p_tabindex];

        if (nexacro._isNull(filter_type))
            filter_type = 4;

        if (direction > 0)
        {
            if (current === tabpage)
            {
                return null;
            }
            else if (current === tabbuttonitem)
            {
                if (filter_type & 4)
                    return tabpage;
                else
                    return tabpage._p_form._getTabOrderFirst(filter_type);
            }
        }
        else
        {
            if (current === tabpage && this._p_focusacceptable)
            {
                return tabbuttonitem;
            }
            else if (current === tabbuttonitem)
            {
                if (filter_type & 4)
                    return this;
            }
        }

        return null;
    };

    _pTab._getTabOrderFirst = function (filter_type)
    {
        return nexacro.FormBase.prototype._getTabOrderFirst.call(this, filter_type);
    };

    _pTab._getTabOrderLast = function (filter_type)
    {
        return nexacro.FormBase.prototype._getTabOrderLast.call(this, filter_type);
    };

    _pTab._getControlFromElement = function (elem)
    {

        var ret = null;
        var p = elem;
        while (p && p !== this)
        {
            if (p instanceof nexacro._TabButtonItemControl || p instanceof nexacro._TabExtraButtonControl)
                return p;

            p = p._p_parent;
        }

        return ret;

    };

    _pTab._on_orientationchange = function (orientation)
    {
        var tabpage = this._p_tabpages[this._p_tabindex];
        if (tabpage)
            tabpage._on_orientationchange(orientation);
    };

    _pTab._setContents = function (str)
    {
        var doc = nexacro._parseXMLDocument(str);

        var tabpages = doc.getElementsByTagName("Tabpages")[0];
        if (!tabpages)
        {
            return false;	// parse error
        }

        // remove all Tabpages;
        var i, i_len;
        var j, j_len;
        var name, val;
        var cur_tabindex = this._p_tabindex;

        for (i = 0, i_len = this._p_tabpages.length; i < i_len; i++)
        {
            this.removeTabpage(0);
        }

        var tabpage_nodes = tabpages.getElementsByTagName("Tabpage");
        var tabpage_node;
        var tabpage_obj;
        var init_tabpage_props = {};
        var set_tabpage_props = {};

        var layout_node;
        var contents_node;
        var contents_obj;
        var init_contents_props = {};
        var set_contents_props = {};

        var class_name, fn_constructor;

        for (i = 0; i < tabpage_nodes.length; i++)
        {
            tabpage_node = tabpage_nodes[i];
            init_tabpage_props = {};
            set_tabpage_props = {};

            // parse tabpage props
            for (j = 0, j_len = tabpage_node.attributes.length; j < j_len; j++)
            {
                name = tabpage_node.attributes[j].name;
                val = tabpage_node.attributes[j].value;
                if (/^(id|text|)$/.test(name))
                {
                    init_tabpage_props[name] = val;
                }
                else
                {
                    set_tabpage_props[name] = val;
                }
            }

            // create tabpage

            tabpage_obj = new nexacro.Tabpage(init_tabpage_props["id"], this);

            tabpage_obj._refobj = this;
            tabpage_obj._preload = this._p_preload;

            tabpage_obj.set_text(init_tabpage_props["text"] || init_tabpage_props["id"]);

            for (name in set_tabpage_props)
            {
                if (tabpage_obj["set_" + name])
                {
                    tabpage_obj["set_" + name](set_tabpage_props[name]);
                }
                else
                {
                    tabpage_obj[name] = set_tabpage_props[name];
                }
            }

            tabpage_obj.createComponent(false);

            // add tabpage
            this._addChild(init_tabpage_props["id"], tabpage_obj);

            // create contents ( no url link )
            if (!set_tabpage_props["url"])
            {
                layout_node = tabpage_node.getElementsByTagName("Layout")[0];
                if (!layout_node)
                {
                    continue;	// non parse error
                }

                contents_node = layout_node.firstChild;
                while (contents_node)
                {
                    if (contents_node.nodeType != 1)
                    {
                        contents_node = contents_node.nextSibling;
                        continue;	// non parse error
                    }

                    class_name = nexacro._getRegisterClass(contents_node.tagName);
                    if (!class_name)
                    {
                        return false;	// parse error
                    }

                    fn_constructor = nexacro._executeGlobalEvalStr(class_name);
                    if (!fn_constructor)
                    {
                        return false;	// parse error
                    }

                    if (fn_constructor.prototype && fn_constructor.prototype._is_component)
                    {
                        //gen json type 
                        init_contents_props = {};
                        set_contents_props = {};
                        for (j = 0; j < contents_node.attributes.length; j++)
                        {
                            name = contents_node.attributes[j].name;
                            val = contents_node.attributes[j].value;
                            if (/^(id|left|top|width|height|right|bottom|minwidth|maxwidth|minheight|maxheight|)$/.test(name))
                            {
                                init_contents_props[name] = val;
                            }
                            else
                            {
                                set_contents_props[name] = val;
                            }
                        }

                        contents_obj = new fn_constructor(init_contents_props["id"], init_contents_props["left"], init_contents_props["top"], init_contents_props["width"], init_contents_props["height"], init_contents_props["right"], init_contents_props["bottom"], init_contents_props["minwidth"], init_contents_props["maxwidth"], init_contents_props["minheight"], init_contents_props["maxheight"], tabpage_obj.form);

                        //set properties except constructor arguments
                        for (name in set_contents_props)
                        {
                            if (contents_obj["set_" + name])
                            {
                                contents_obj["set_" + name](set_contents_props[name]);
                            }
                            else
                            {
                                contents_obj[name] = set_contents_props[name];
                            }
                        }

                        // has subcontents
                        if (contents_node.firstChild)
                        {
                            var childnode = contents_node.firstChild;

                            var strXML = "";
                            while (childnode)
                            {
                                if (childnode.nodeType == 1)
                                {
                                    strXML += nexacro._documentToXml(childnode);
                                }
                                childnode = childnode.nextSibling;
                            }

                            if (!contents_obj._setContents(strXML))
                            {
                                return false;
                            }
                        }

                        tabpage_obj.form.addChild(contents_obj.id, contents_obj);
                        contents_obj.show();
                    }

                    contents_node = contents_node.nextSibling;
                }
            }
        }

        // last apply
        if (this._is_created)
        {
            this._createSpinButton(false);
            this.on_apply_tabindex(cur_tabindex);
            this._rearrangeContents();
        }

        return true;
    };

    _pTab._applyMultiContainerScrollPos = function ()
    {
        var tabpages = this._p_tabpages;
        var tabpages_length = tabpages.length;
        var i = 0;
        var tabpage;
        for (i = tabpages_length - 1; i >= 0; i--)
        {
            tabpage = tabpages[i];
            if (tabpage && tabpage._p_form)
            {
                tabpage._p_form._applyScrollPos();
            }
        }

    };

    _pTab._changeUserStatusAll = function (tabbuttonitem, bool)
    {
        if (tabbuttonitem)
        {
            tabbuttonitem._changeUserStatus("selected", bool);
            tabbuttonitem._setAccessibilityStatSelected(bool);

            if (tabbuttonitem._tabbuttonitemicon)
            {
                tabbuttonitem._tabbuttonitemicon._changeUserStatus("selected", bool);
                tabbuttonitem._tabbuttonitemicon._setAccessibilityStatSelected(bool);
            }

            if (tabbuttonitem._extrabutton)
            {
                tabbuttonitem._extrabutton._changeUserStatus("selected", bool);
                tabbuttonitem._extrabutton._setAccessibilityStatSelected(bool);
            }
        }
    };


    _pTab.fetchStateData = function (includeall)
    {
        if (!this._is_alive)
            return;

        return this._processStateData(1, includeall);
    };

    _pTab._processStateData = function (type, includeall)
    {
        let tabpage;
        let tabpages = this._p_tabpages;
        let len = tabpages.length;
        for (let i = 0; i < len; i++)
        {
            tabpage = tabpages[i];
            tabpage._processStateData(type, includeall);
        }
    };

    _pTab.restoreStateData = function (includeall)
    {
        if (!this._is_alive)
            return;

        return this._processStateData(0, includeall);
    };

    _pTab._properties = [{ name: "extrabuttonsize" }, { name: "focusacceptable" }, { name: "multiline" }, { name: "nextbutton", readonly: true }, { name: "preload" }, { name: "prevbutton", readonly: true }, { name: "roatatetext" }, { name: "selectchangetype" }, { name: "selectedtabbuttonheight" }, { name: "selectedtabbuttonwidth" }, { name: "showextrabutton" }, { name: "showtabbuttonicon" }, { name: "tabbuttongap" }, { name: "tabbuttonheight" }, { name: "tabbuttoniconsize" }, { name: "tabbuttonstartgap" }, { name: "tabbuttonwidth" }, { name: "tabindex" }, { name: "tabjustify" }, { name: "tabpages", readonly: true }, { name: "tabposition" }, { name: "tabstyle" }, { name: "usecontrolkey" }, { name: "usetabbutton" }];
    nexacro._defineProperties(_pTab, _pTab._properties);

    _pTab = null;
}

if (!nexacro.Tabpage)
{
    nexacro.Tabpage = function (id, parent)
    {
        nexacro.Div.call(this, id, 0, 0, 0, 0, null, null, null, null, null, null, parent);
    };

    var _pTabpage = nexacro._createPrototype(nexacro.Div, nexacro.Tabpage);
    nexacro.Tabpage.prototype = _pTabpage;

    _pTabpage._type_name = "TabpageControl";
    _pTabpage._is_subcontrol = true;
    _pTabpage._p_accessibilityrole = "tabpage";

    _pTabpage._p_tabbuttonwidth = undefined;
    _pTabpage._p_tabbuttonheight = undefined;
    _pTabpage._p_tabbuttoncssclass = "";

    _pTabpage._preload = false;
    _pTabpage._tabbuttonitem = null;

    _pTabpage.bringToFront = nexacro._emptyFn;
    _pTabpage.bringToPrev = nexacro._emptyFn;
    _pTabpage.moveToNext = nexacro._emptyFn;
    _pTabpage.moveToPrev = nexacro._emptyFn;
    _pTabpage.sendToBack = nexacro._emptyFn;
    _pTabpage.sendToNext = nexacro._emptyFn;
    // ====================================================================
    // nexacro.Tabpage : Create & Update
    // ====================================================================

    // ====================================================================
    // nexacro.Tabpage : Property
    // ====================================================================
    _pTabpage.on_attach_contents_handle = function (win) { };
    _pTabpage.on_created_contents = function (win)
    {
        if (this.parent && this.parent instanceof nexacro.Tab)
        {
            if (this.parent._is_created)
                this._createForm(win);
        }
    };

    _pTabpage._createForm = function (win)
    {
        var form = this._p_form;

        if (!this._p_url)
        {
            form.on_created(win);
        }
        else
        {
            if (!form._url)
            {
                if (this.parent && this.parent instanceof nexacro.Tab && this.parent.preload == false)
                {
                    //on_apply_url에서 처리                    
                }
                else
                {
                    form.loadForm(this._p_url, this._p_async, true, this._url);
                }
            }

            if (form._is_loaded)
            {
                if (!form._is_created_contents && !form._is_created)
                    form.createComponent();
                else
                    form.on_created(win);
            }
        }
        if (this._isAccessibilityCotainerComponent())
        {
            var first_comp = form.getFirstAccessibilityComponent();
            if (first_comp)
                first_comp._setAccessibilityDescriptionBy(this._unique_id);
        }

        this.on_apply_text();
        this._recalcLayout();
    };

    _pTabpage._attachForm = function (win)
    {
        var form = this._p_form;

        if (!this._p_url)
        {
            form.on_created(win);
        }
        else
        {
            if (this._p_url && form._is_loaded)
            {
                if (!form._is_created_contents && !form._is_created)
                    form.createComponent();
                else
                    form.on_created(win);
            }
        }
        if (this._isAccessibilityCotainerComponent())
        {
            var first_comp = form.getFirstAccessibilityComponent();
            if (first_comp)
                first_comp._setAccessibilityDescriptionBy(this._unique_id);
        }

        this.on_apply_text();
        this._recalcLayout();
    };

    _pTabpage.on_apply_text = function (text)
    {
        //nexacro.Div.prototype.on_apply_text.call(this, text);

        var tab = this._p_parent;
        if (tab)
        {
            var btn;
            if (tab._tabbuttonitems)
            {
                var btn_len = tab._tabbuttonitems.length;
                for (var i = 0; i < btn_len; i++)
                {
                    btn = tab._tabbuttonitems[i];
                    if (btn._tabpage === this)
                    {
                        btn.set_text(this._p_text);
                    }
                }

            }
            tab._rearrangeContents();

        }
    };

    _pTabpage._getForm = function ()
    {
        var form = this._refform;
        if (form instanceof nexacro.Tab)
            return form._refform;

        return this._refform;
    };

    _pTabpage.on_apply_prop_tooltip = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var stringrc_prop = this._getStringResourceProperty(this._p_tooltiptext);
            control_elem.setElementToolTip(stringrc_prop ? stringrc_prop : this._p_tooltiptext);
        }
        this.on_apply_prop_accessibilitydescription();
        this._updateAccessibilityLabel();
    };

    _pTabpage.set_tabbuttonwidth = function (v)
    {
        this._p_tabbuttonwidth = (v === null || v === undefined) ? undefined : parseInt(v) | 0;

        var tab = this._p_parent;
        if (tab)
            tab._rearrangeContents();
    };

    _pTabpage.set_tabbuttonheight = function (v)
    {
        this._p_tabbuttonheight = (v === null || v === undefined) ? undefined : parseInt(v) | 0;

        var tab = this._p_parent;
        if (tab)
            tab._rearrangeContents();
    };

    _pTabpage.set_tabbuttoncssclass = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_tabbuttoncssclass != v)
        {
            this._p_tabbuttoncssclass = v;
        }

        var tabbuttonitem = this._tabbuttonitem;
        if (tabbuttonitem)
            tabbuttonitem.set_cssclass(v);
    };

    _pTabpage._initControlElementNormalProps = function ()
    {
        this._applyElementVisible(this._p_visible);

        this.on_apply_prop_rtl();

        this._registerHotkey();
    };

    // ====================================================================
    // nexacro.Tabpage : Method
    // ====================================================================
    _pTabpage.set_url = function (v)
    {
        if (v && v.substring(0, 4).toLowerCase() == "url(")
            v = v.substring(4, v.length - 1);

        if (v != this._p_url)
        {
            this._p_url = v;
            if (this._p_parent._is_created == true)
            {
                this._p_url = v;
                this.on_apply_url();
            }
        }
    };

    _pTabpage._on_apply_url = function ()
    {
        if (!this._is_loadedform && !this._p_form._is_loading && this._p_url && this._p_url.length > 0)
        {
            this.on_apply_url(false);
        }
    };

    _pTabpage.set_semantictag = function (v)
    {
        if (this._p_semantictag != v)
            this._p_semantictag = v;
    };
    //===============================================================
    // nexacro.Tabpage : Override
    //===============================================================

    _pTabpage.getParentContext = function ()
    {
        return this._p_parent.getParentContext();
    };

    _pTabpage.on_getIDCSSSelector = function ()
    {
        return "tabpage";
    };

    _pTabpage.on_apply_prop_enable = function (v)
    {
        if (this._p_form)
        {
            this._p_form._setEnable(v);
        }

        var tabbuttonitem = this._tabbuttonitem;
        if (tabbuttonitem)
            tabbuttonitem._setEnable(v);

    };

    // ====================================================================
    // nexacro.Tabpage : Event
    // ====================================================================
    _pTabpage._on_focus = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        nexacro.Component.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);

        if (this._env._p_enableaccessibility && new_focus && this._contains(new_focus))
        {
            this._setTabFocusObj(new_focus);
        }
        else
        {
            this._setTabFocusObj(this);
        }
    };

    _pTabpage.on_killfocus_basic_action = function (new_focus, new_ref_focus)
    {
        nexacro.Component.prototype.on_killfocus_basic_action.call(this);

        if (new_focus === this)
            return;

        if (new_focus == null && new_ref_focus == null)
            return;
    };

    _pTabpage.on_fire_user_onkeydown = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key)
    {
        if (!this._p_enable || key_code == nexacro.Event.KEY_TAB)
            return;

        return nexacro.Div.prototype.on_fire_user_onkeydown.call(this, key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key);
    };

    _pTabpage.on_destroy_contents = function ()
    {
        nexacro.Div.prototype.on_destroy_contents.call(this);

        this._tabbuttonitem = null;
    };

    _pTabpage.on_fire_sys_onaccessibilitygesture = function (direction, fire_comp, refer_comp)
    {
        var next_obj = null;
        var tab_comp = this._p_parent;
        var index = tab_comp._getTabIndex();
        var button_len = tab_comp._tabButtons.length;

        var _window = this._getWindow();
        var last_notify = _window._accessibility_last_focused_comp;
        if (direction)
        {
            next_obj = this._searchNextTabFocus(last_notify, undefined, undefined, 3)[0];
            if (next_obj._p_parent != fire_comp)
            {
                index++;
                tab_comp._accessibility_tabindex = index;
                next_obj = (button_len > index) ? tab_comp._tabButtons[index] : next_obj;
            }
        }
        else
        {
            next_obj = this._searchPrevTabFocus(last_notify, undefined, undefined, true)[0];
            if (next_obj == fire_comp)
            {
                next_obj = tab_comp._tabButtons[index];
            }
        }

        if (next_obj)
        {
            next_obj._setAccessibilityNotifyEvent(direction);
            return true;
        }
        return false;
    };

    // ====================================================================
    // nexacro.Tabpage : Logical Part
    // ====================================================================
    _pTabpage._setAccessibilityNotifyEvent = function (direction)
    {
        var next_obj = null;
        var index = this._index;
        var tab_comp = this._p_parent;
        var tabindex = tab_comp._getTabIndex();

        if (direction)
        {
            if (index != tabindex)
            {
                next_obj = tab_comp._tabButtons[index];
            }
            else
            {
                next_obj = this._getTabOrderFirst(true, false);
            }
        }
        else
        {
            if (index != tabindex)
            {
                next_obj = tab_comp._tabButtons[index];
            }
            else
            {
                next_obj = this._getTabOrderLast(true, false);
            }
        }

        if (next_obj)
        {
            next_obj._setAccessibilityNotifyEvent(direction);
        }
    };

    _pTabpage._setTabFocusObj = function (focusobj)
    {
        this._p_parent._focusobj = focusobj;
    };

    _pTabpage._getTabFocusObj = function ()
    {
        return this._p_parent._getTabFocusObj();
    };

    _pTabpage._checkAndConfirmClose = function (confirm_message)
    {
        if (this._p_form)
        {
            return this._p_form._checkAndConfirmClose(confirm_message);
        }

        return true;
    };

    _pTabpage._properties = [{ name: "tabbuttonwidth" }, { name: "tabbuttonheight" }, { name: "tabbuttoncssclass" }, { name: "url" }, { name: "semantictag" }];
    nexacro._defineProperties(_pTabpage, _pTabpage._properties);

    _pTabpage = null;
}

if (!nexacro._TabButtonItemControl)
{
    nexacro._TabButtonItemControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._sizeinfo = { width: 0, height: 0 };                                        // width,height
        this._position = { left: 0, top: 0, width: 0, height: 0 };  // left,top,width,height
    };
    var _pTabButtonItemControl = nexacro._createPrototype(nexacro.Component, nexacro._TabButtonItemControl);
    nexacro._TabButtonItemControl.prototype = _pTabButtonItemControl;

    _pTabButtonItemControl._type_name = "TabButtonItemControl";
    _pTabButtonItemControl._is_subcontrol = true;
    _pTabButtonItemControl._use_selected_status = true;
    _pTabButtonItemControl._extrabutton = null;            //nexacro._Icon
    _pTabButtonItemControl._tabindex = -1;                     // tab index
    _pTabButtonItemControl._tabpage = null;
    _pTabButtonItemControl._extrabutton_iconsize = null;
    _pTabButtonItemControl._line_index = 0;
    _pTabButtonItemControl._tabbuttonitemicon = null;
    _pTabButtonItemControl._tabbuttonitemicon_size = null;
    _pTabButtonItemControl._p_accessibilityrole = "tabitem";
    //_pTabButtonItemControl._multiline_index = 0;
    // ====================================================================
    // nexacro.TabButtonItem : Create & Update
    // ====================================================================

    _pTabButtonItemControl.on_created_contents = function (win)
    {
        if (this._tabbuttonitemtext)
            this._tabbuttonitemtext.on_created(win);
        if (this._tabbuttonitemicon)
            this._tabbuttonitemicon.on_created(win);
        if (this._extrabutton)
            this._extrabutton.on_created(win);
    };

    _pTabButtonItemControl.on_create_contents_command = function (win)
    {
        var str = "";

        if (this._tabbuttonitemtext)
            str += this._tabbuttonitemtext.createCommand();
        if (this._tabbuttonitemicon)
            str += this._tabbuttonitemicon.createCommand();
        if (this._extrabutton)
            str += this._extrabutton.createCommand();

        return str;
    };

    _pTabButtonItemControl.on_attach_contents_handle = function (win)
    {
        if (this._tabbuttonitemtext)
            this._tabbuttonitemtext.attachHandle(win);
        if (this._tabbuttonitemicon)
            this._tabbuttonitemicon.attachHandle(win);
        if (this._extrabutton)
            this._extrabutton.attachHandle(win);
    };

    _pTabButtonItemControl.on_destroy_contents = function ()
    {
        if (this._tabbuttonitemtext)
        {
            this._tabbuttonitemtext.destroy();
            this._tabbuttonitemtext = null;
        }
        if (this._tabbuttonitemicon)
        {
            this._tabbuttonitemicon.destroy();
            this._tabbuttonitemicon = null;
        }
        if (this._extrabutton)
        {
            this._extrabutton.destroy();
            this._extrabutton = null;
        }

        this._tabpage = null;
        this._extrabutton_iconsize = null;
    };

    _pTabButtonItemControl.on_apply_text = function (v)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var tabbuttonitemtext = this._tabbuttonitemtext;
            var extrabutton_width = 0;
            var tabbuttonitemicon_width = 0;

            if (this._extrabutton)
            {
                extrabutton_width = this._extrabutton._adjust_width;
            }

            if (this._tabbuttonitemicon)
            {
                tabbuttonitemicon_width = this._tabbuttonitemicon._adjust_width;
            }

            var client_width = this._getClientWidth() - extrabutton_width - tabbuttonitemicon_width;
            var client_height = this._getClientHeight();
            if (!v)
                v = this._displaytext;

            if (!tabbuttonitemtext)
            {

                tabbuttonitemtext = this._tabbuttonitemtext = new nexacro.Static("tabbuttonitemtext", 0, 0, client_width, client_height, null, null, null, null, null, null, this);
                tabbuttonitemtext._p_accessibilityenable = false;
                tabbuttonitemtext._setControl();
                tabbuttonitemtext.set_text(v);
                tabbuttonitemtext.createComponent();
            }
            else
            {
                tabbuttonitemtext.set_text(v);
                tabbuttonitemtext.move(tabbuttonitemicon_width, 0, client_width, client_height, null, null);

                if (!tabbuttonitemtext._is_created)
                    tabbuttonitemtext.on_created();

            }
        }

    };

    // ====================================================================
    // nexacro.TabButtonItem : Event
    // ====================================================================
    _pTabButtonItemControl.on_changeStatus = function (changestatus, value, applystatus, currentstatus, currentuserstatus)
    {
        return applystatus;
    };
    _pTabButtonItemControl.on_changeUserStatus = function (changestatus, value, applystatus, currentstatus, currentuserstatus)
    {
        return applystatus;
    };
    _pTabButtonItemControl.on_apply_status = function (status, userstatus)
    {
        //if (this._is_created && this.visible)
        //    this.parent._rearrangeContents();
    };
    _pTabButtonItemControl.on_change_containerRect = function (width, height)
    {
        var tabbuttonitemtext = this._tabbuttonitemtext;
        if (tabbuttonitemtext)
        {
            var extrabutton_width = 0;
            var tabbuttonitemicon_width = 0;
            if (this._extrabutton)
            {
                extrabutton_width = this._extrabutton._getClientWidth();
            }

            if (this._tabbuttonitemicon)
            {
                tabbuttonitemicon_width = this._tabbuttonitemicon._adjust_width;
            }

            var client_width = this._getClientWidth() - extrabutton_width - tabbuttonitemicon_width;
            var client_height = this._getClientHeight();

            tabbuttonitemtext.move(tabbuttonitemicon_width, 0, client_width, client_height, null, null);
        }
    };

    _pTabButtonItemControl.on_apply_prop_enable = function (v)
    {
        var extrabutton = this._extrabutton;
        if (extrabutton)
            extrabutton._setEnable(v);
        var tabbuttonitemtext = this._tabbuttonitemtext;
        if (tabbuttonitemtext)
            tabbuttonitemtext._setEnable(v);
        var tabbuttonitemicon = this._tabbuttonitemicon;
        if (tabbuttonitemicon)
            tabbuttonitemicon._setEnable(v);
    };

    // ====================================================================
    // nexacro.TabButtonItem : Event Overriding
    // ====================================================================

    _pTabButtonItemControl.on_lbuttondown_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key)
    {
        this._p_parent._tabbutton_obj = this;
        var ret = nexacro.Component.prototype.on_lbuttondown_basic_action.call(this, elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);

        return ret;
    };

    _pTabButtonItemControl._on_focus = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        if (this._p_parent._p_tabindex != this._tabindex)
            return;

        var win = this._getWindow();

        var last_modalframe = win._getLastModalFrame();
        if (last_modalframe && !last_modalframe._contains(this))
        {
            var form = this._getParentForm();
            if (form)
            {
                form._setLastFocus(this);
            }
        }
        else
        {
            if (!this._p_parent._is_changed_focus)
            {
                nexacro.Component.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);
                this._setTabFocusObj(this);
            }
        }

        this._p_parent._is_changed_focus = false;
    };

    _pTabButtonItemControl._setTabFocusObj = function (focusobj)
    {
        if (!this._is_alive) return;

        this._p_parent._setTabFocusObj(focusobj);
    };

    _pTabButtonItemControl._getTabFocusObj = function ()
    {
        if (!this._is_alive) return;

        return this._p_parent._getTabFocusObj();
    };

    _pTabButtonItemControl.on_getIDCSSSelector = function ()
    {
        return "tabbuttonitem";
    };

    // ====================================================================
    // nexacro.TabButtonItem : Logical Part
    // ====================================================================
    _pTabButtonItemControl._onload_extra_iconimage = function (imgurl, width, height)
    {
        if (!this._extrabutton_iconsize)
        {
            this._extrabutton_iconsize = { imageurl: imgurl, width: width, height: height };
        }
        else
        {
            var extrabutton_iconsize = this._extrabutton_iconsize;
            if (extrabutton_iconsize.imageurl != imgurl || extrabutton_iconsize.width != width || extrabutton_iconsize.height != height)
            {
                this._extrabutton_iconsize = { imageurl: imgurl, width: width, height: height };
            }
            else 
            {
                return;
            }
        }
        this._p_parent._on_get_extrabutton_iconsize(width, height);
    };

    _pTabButtonItemControl._onload_tabbutton_iconimage = function (imgurl, width, height)
    {
        if (!this._tabbuttonitemicon_size)
        {
            this._tabbuttonitemicon_size = { imageurl: imgurl, width: width, height: height };
        }
        else
        {
            var tabbutton_iconsize = this._tabbuttonitemicon_size;
            if (tabbutton_iconsize.imageurl != imgurl || tabbutton_iconsize.width != width || tabbutton_iconsize.height != height)
            {
                this._tabbuttonitemicon_size = { imageurl: imgurl, width: width, height: height };
            }
            else
            {
                return;
            }
        }
        this._p_parent._on_get_tabbutton_iconsize(width, height);
    };

    _pTabButtonItemControl._showExtraButton = function (v, button_width, button_height)
    {
        v = nexacro._toBoolean(v);

        if (v)
        {
            var client_width = this._getClientWidth();
            var client_height = this._getClientHeight();

            var width = button_width || client_height;
            var height = button_height || client_height;

            var extrabutton_l = client_width - width;
            var extrabutton_t = (client_height - height) / 2;
            var extrabutton_w = width;
            var extrabutton_h = height;

            //var rotatetext = this._rotatetext;
            /*
            if (rotatetext)
            {
                extrabutton_l = 0;
                extrabutton_t = width;
            }
            */

            //            this._extrabutton_size.width = height;  
            //            this._extrabutton_size.height = height;

            if (!this._extrabutton)
            {
                this._extrabutton = new nexacro._TabExtraButtonControl("extrabutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
                this._extrabutton.createComponent();
                //extrabutton._setEventHandler("onclick", this.on_notify_extrabutton, this);
            }
            else
            {
                if (!this._extrabutton.is_created)
                    this._extrabutton.on_created(this._getWindow());
            }

            this._extrabutton.move(extrabutton_l, extrabutton_t, extrabutton_w, extrabutton_h);
        }
        else
        {
            if (this._extrabutton)
            {
                this._extrabutton.destroy();
                this._extrabutton = null;
            }
        }

        this.on_apply_text();
    };

    _pTabButtonItemControl._showTabButtonIcon = function (v, button_width, button_height)
    {
        v = nexacro._toBoolean(v);

        if (v)
        {
            var client_width = this._getClientWidth();
            var client_height = this._getClientHeight();

            var width = button_width || client_width;
            var height = button_height || client_height;

            var tabbuttonicon_l = 0;
            var tabbuttonicon_t = (client_height - height) / 2;
            var tabbuttonicon_w = width;
            var tabbuttonicon_h = height;

            if (!this._tabbuttonitemicon)
            {
                this._tabbuttonitemicon = new nexacro._TabButtonIconControl("tabbuttonitemicon", 0, 0, 0, 0, null, null, null, null, null, null, this);
                this._tabbuttonitemicon.createComponent();
            }
            else
            {
                if (!this._tabbuttonitemicon.is_created)
                    this._tabbuttonitemicon.on_created(this._getWindow());
            }

            this._tabbuttonitemicon.move(tabbuttonicon_l, tabbuttonicon_t, tabbuttonicon_w, tabbuttonicon_h);
        }
        else
        {
            if (this._tabbuttonitemicon)
            {
                this._tabbuttonitemicon.destroy();
                this._tabbuttonitemicon = null;
            }
        }
    };

    _pTabButtonItemControl._getItemSize = function ()
    {
        var width = 0;
        var height = 0;

        var padding = this._getCSSStyleValue("padding");
        var border = this._getCSSStyleValue("border");

        var padding_l = 0, padding_r = 0, padding_t = 0, padding_b = 0;

        if (padding)
        {
            padding_l = padding.left || 0;
            padding_r = padding.right || 0;
            padding_t = padding.top || 0;
            padding_b = padding.bottom || 0;
        }

        var border_w = 0;
        var border_h = 0;
        if (border)
        {
            border_w = border._getBorderWidth() || 0;
            border_h = border._getBorderHeight() || 0;
        }

        width = padding_l + padding_r + border_w;
        height = padding_t + padding_b + border_h;

        var textsize = this._getItemTextSize();
        if (textsize)
        {
            width += textsize[0];
            height += textsize[1];
        }

        return [width, height];
    };
    _pTabButtonItemControl._getItemTextSize = function ()
    {
        var ret = [0, 0];
        if (!this._tabbuttonitemtext)
            return ret;

        var tabbuttonitemtext = this._tabbuttonitemtext;
        // set extrabutton size
        var padding = tabbuttonitemtext._getCSSStyleValue("padding");
        var border = tabbuttonitemtext._getCSSStyleValue("border");
        var padding_l = 0, padding_r = 0, padding_t = 0, padding_b = 0;

        if (padding)
        {
            padding_l = padding.left || 0;
            padding_r = padding.right || 0;
            padding_t = padding.top || 0;
            padding_b = padding.bottom || 0;
        }

        var border_w = 0;
        var border_h = 0;
        if (border)
        {
            border_w = border._getBorderWidth() || 0;
            border_h = border._getBorderHeight() || 0;
        }

        ret[0] += padding_l + padding_r + border_w;
        ret[1] += padding_t + padding_b + border_h;

        var strText = this._displaytext;

        var font = tabbuttonitemtext._getCurrentStyleInheritValue("font");
        var refer_font = this._getReferenceAbsoluteFont(font); // use to em / rem
        // var wordwrap = tabbuttonitemtext._getCurrentStyleInheritValue("wordWrap");
        var wordspace = tabbuttonitemtext._getCurrentStyleInheritValue("wordSpacing");
        var letterspace = tabbuttonitemtext._getCurrentStyleInheritValue("letterSpacing");

        if (font)
        {
            var idx, multi = false;
            if (strText)
            {
                idx = strText.search("\n");
            }
            multi = (idx == -1) ? false : true;

            var size = nexacro._getTextSize(strText, font, multi, null, "none", wordspace, letterspace, undefined, undefined, undefined, refer_font);

            ret[0] += (Math.ceil(size[0]) | 0);
            ret[1] += (Math.ceil(size[1]) | 0);
        }

        return ret;
    };

    _pTabButtonItemControl._getExtraButtonSize = function (bshowextrabutton)
    {
        if (!this._extrabutton)
        {
            this._extrabutton = new nexacro._TabExtraButtonControl("extrabutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
            this._extrabutton.createComponent();
        }

        var ret = { width: 0, height: 0 };
        var padding = this._extrabutton._getCSSStyleValue("padding");
        var border = this._extrabutton._getCSSStyleValue("border");
        var padding_l = 0, padding_r = 0, padding_t = 0, padding_b = 0;

        if (padding)
        {
            padding_l = padding.left || 0;
            padding_r = padding.right || 0;
            padding_t = padding.top || 0;
            padding_b = padding.bottom || 0;
        }

        var border_w = 0;
        var border_h = 0;
        if (border)
        {
            border_w = border._getBorderWidth() || 0;
            border_h = border._getBorderHeight() || 0;
        }

        ret.width += padding_l + padding_r + border_w;
        ret.height += padding_t + padding_b + border_h;

        var extrabutton_iconsize = this._getExtraButtonIconSize();
        if (extrabutton_iconsize)
        {
            ret.width += extrabutton_iconsize.width;
            ret.height += extrabutton_iconsize.height;
        }

        if (!bshowextrabutton)
        {
            this._extrabutton.destroy();
            this._extrabutton = null;
        }

        return ret;
    };


    _pTabButtonItemControl._getExtraButtonIconSize = function ()
    {
        // var ret = { width: 0, height: 0 };

        var icon = this._extrabutton._getCSSStyleValue("icon");
        if (icon instanceof Object)
            icon = icon.value;

        if (icon)
        {

            var extrabutton_iconsize = this._extrabutton_iconsize;
            if (extrabutton_iconsize)
            {
                var iconurl = icon;
                if (iconurl.substring(0, 4).toLowerCase() == "url(")
                    iconurl = iconurl.substring(5, iconurl.length - 2);
                iconurl = nexacro._getImageLocation(iconurl, this._getRefFormBaseUrl());
                if (extrabutton_iconsize.imageurl == iconurl)
                {
                    return { width: extrabutton_iconsize.width, height: extrabutton_iconsize.height };
                }
            }

            var imagesize = nexacro._getImageSize(icon, this._onload_extra_iconimage, this);
            if (imagesize)
            {
                return { width: imagesize.width, height: imagesize.height };
                // ret.width += imagesize.width;
                // ret.height += imagesize.height;
            }
        }

        return null;
    };

    _pTabButtonItemControl._getTabButtonIconElementSize = function (bshowtabbuttonicon)
    {
        if (!this._tabbuttonitemicon)
        {
            this._tabbuttonitemicon = new nexacro._TabButtonIconControl("tabbuttonitemicon", 0, 0, 0, 0, null, null, null, null, null, null, this);
            this._tabbuttonitemicon.createComponent();
        }

        var ret = { width: 0, height: 0 };
        var padding = this._tabbuttonitemicon._getCSSStyleValue("padding");
        var border = this._tabbuttonitemicon._getCSSStyleValue("border");
        var padding_l = 0, padding_r = 0, padding_t = 0, padding_b = 0;

        if (padding)
        {
            padding_l = padding.left || 0;
            padding_r = padding.right || 0;
            padding_t = padding.top || 0;
            padding_b = padding.bottom || 0;
        }

        var border_w = 0;
        var border_h = 0;
        if (border)
        {
            border_w = border._getBorderWidth() || 0;
            border_h = border._getBorderHeight() || 0;
        }

        ret.width += padding_l + padding_r + border_w;
        ret.height += padding_t + padding_b + border_h;

        var tabbutton_iconsize = this._getTabButtonIconSize();
        if (tabbutton_iconsize)
        {
            ret.width += tabbutton_iconsize.width;
            ret.height += tabbutton_iconsize.height;
        }

        if (!bshowtabbuttonicon)
        {
            this._tabbuttonitemicon.destroy();
            this._tabbuttonitemicon = null;
        }

        return ret;
    };

    _pTabButtonItemControl._getTabButtonIconSize = function ()
    {
        var icon = this._tabbuttonitemicon._getCSSStyleValue("icon");

        if (icon instanceof Object)
            icon = icon.value;

        if (icon)
        {

            var tabbuttonitemicon_size = this._tabbuttonitemicon_size;
            if (tabbuttonitemicon_size)
            {
                var iconurl = icon;
                if (iconurl.substring(0, 4).toLowerCase() == "url(")
                    iconurl = iconurl.substring(5, iconurl.length - 2);
                iconurl = nexacro._getImageLocation(iconurl, this._getRefFormBaseUrl());
                if (tabbuttonitemicon_size.imageurl == iconurl)
                {
                    return { width: tabbuttonitemicon_size.width, height: tabbuttonitemicon_size.height };
                }
            }

            var imagesize = nexacro._getImageSize(icon, this._onload_tabbutton_iconimage, this);
            if (imagesize)
            {
                return { width: imagesize.width, height: imagesize.height };
            }
        }

        return null;
    }

    _pTabButtonItemControl = null;
}

if (!nexacro._TabExtraButtonControl)
{
    nexacro._TabExtraButtonControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };
    var _pTabExtraButtonControl = nexacro._createPrototype(nexacro.Button, nexacro._TabExtraButtonControl);
    nexacro._TabExtraButtonControl.prototype = _pTabExtraButtonControl;

    _pTabExtraButtonControl._type_name = "TabExtraButtonControl";
    _pTabExtraButtonControl._is_subcontrol = true;

    // ====================================================================
    // nexacro.TabButtonItem : Create & Update
    // ====================================================================

    // ====================================================================
    // nexacro.TabButtonItem : Property
    // ====================================================================

    // ====================================================================
    // nexacro.TabButtonItem : Event Overriding
    // ====================================================================
    _pTabExtraButtonControl.on_getIDCSSSelector = function ()
    {
        return "extrabutton";
    };

    _pTabExtraButtonControl = null;
}

if (!nexacro._TabButtonIconControl)
{
    nexacro._TabButtonIconControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };
    var _pTabButtonIconControl = nexacro._createPrototype(nexacro.Button, nexacro._TabButtonIconControl);
    nexacro._TabButtonIconControl.prototype = _pTabButtonIconControl;

    _pTabButtonIconControl._type_name = "TabButtonIconControl";
    _pTabButtonIconControl._is_subcontrol = true;

    // ====================================================================
    // nexacro.TabButtonItem : Create & Update
    // ====================================================================

    // ====================================================================
    // nexacro.TabButtonItem : Property
    // ====================================================================

    // ====================================================================
    // nexacro.TabButtonItem : Event Overriding
    // ====================================================================
    _pTabButtonIconControl.on_getIDCSSSelector = function ()
    {
        return "tabbuttonitemicon";
    };

    _pTabButtonIconControl = null;
}
