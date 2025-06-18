//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2024 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacro17-public-license-readme-1.1.html	
//
//==============================================================================

if (!nexacro.Paginator)
{
    nexacro.PageChangeEventInfo = function (obj, id, prepage, postpage)
    {
        this.id = this.eventid = id || "onpagechanged";
        this.prepage = prepage;
        this.postpage = postpage;
        this.fromobject = this.fromreferenceobject = obj;
    };

    var _pPageChangeEventInfo = nexacro._createPrototype(nexacro.ChangedEventInfo, nexacro.PageChangeEventInfo);
    nexacro.PageChangeEventInfo.prototype = _pPageChangeEventInfo;
    _pPageChangeEventInfo._type_name = "PageChangeEventInfo";

    _pPageChangeEventInfo = null;


    //==============================================================================
    // nexacro.Paginator
    //==============================================================================
    nexacro.Paginator = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._page_slots = [];
        this._setFlingScrollBezier(0, 0, 0.5, 0.8);
        this._setFlingScrollMaxDistance(150);
    };

    var _pPaginator = nexacro._createPrototype(nexacro.Component, nexacro.Paginator);
    nexacro.Paginator.prototype = _pPaginator;
    _pPaginator._type_name = "Paginator";

    _pPaginator._is_scrollable = true;
    _pPaginator._use_translate_scroll = true;
    _pPaginator._use_translate_scroll_force = true;
    _pPaginator._is_repeat = true;

    /* event list */
    _pPaginator._event_list =
    {
        "onpagesizechanged": 1, "onpagechanged": 1, "onclick": 1,
        "ondrag": 1, "ondragenter": 1, "ondragmove": 1, "ondragleave": 1, "ondrop": 1,
        "onkeydown": 1, "onkeyup": 1, "onkillfocus": 1, "onsetfocus": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1,
        "onmousedown": 1, "onmouseup": 1,
        "onmouseenter": 1, "onmousemove": 1, "onmouseleave": 1,
        "onmove": 1, "onsize": 1, "oncontextmenu": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1
    };

    /* properties */
    _pPaginator._p_pagecount = 1;
    _pPaginator._p_pagesize = 0;
    _pPaginator._p_datacount = 0;
    _pPaginator._p_page = 1;
    _pPaginator._p_showprevnextbutton = true;   // 필요시 메타인포에서 unused 변경
    _pPaginator._p_showfirstlastbutton = true;  // 필요시 메타인포에서 unused 변경
    _pPaginator._p_navibuttongap = 0;
    _pPaginator._p_pagebuttongap = 0;
    _pPaginator._p_outsidegap = 0;
    _pPaginator._p_pagesiblingmaxcount = 2;
    _pPaginator._p_prevbuttontext = "";
    _pPaginator._p_nextbuttontext = "";
    _pPaginator._p_firstbuttontext = "";
    _pPaginator._p_lastbuttontext = "";

    // hidden
    _pPaginator._p_scrolltype = "horizontal";
    _pPaginator._p_dragscrolltype = "both";
    _pPaginator._p_scrollbartype = "none";

    /* accessibility */
    _pPaginator._p_accessibilityrole = "Paginator";

    _pPaginator._properties = [
        { name: "pagecount", readonly: true },
        { name: "pagesize" },
        { name: "datacount" },
        { name: "page" },
        { name: "showprevnextbutton" },
        { name: "showfirstlastbutton" },
        { name: "innerdataset" },
        { name: "navibuttongap" },
        { name: "pagebuttongap" },
        { name: "outsidegap" },
        { name: "pagesiblingmaxcount" },
        { name: "prevbuttontext" },
        { name: "nextbuttontext" },
        { name: "firstbuttontext" },
        { name: "lastbuttontext" },
    ];

    _pPaginator._firstButton = null;
    _pPaginator._lastButton = null;
    _pPaginator._prevButton = null;
    _pPaginator._nextButton = null;
    _pPaginator._page_slots = null;
    _pPaginator._rowcount = -1;
    _pPaginator._currPageBtn = null;
    _pPaginator._focused_page = 1;
    _pPaginator._use_scrolllimit_fling_stop = true;
    _pPaginator._adjust_scrollpos_time = 300;
    _pPaginator._use_vibrate = true;  // 스크롤시 진동여부
    _pPaginator._curr_left_item = null;
    _pPaginator._scroll_max = 0;
    _pPaginator._pageitemcount = 5;

    if (_pPaginator._use_vibrate)
    {
        _pPaginator._vibrate = function ()
        {
            var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);
            if (bMobile)
            {
                navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

                if (navigator.vibrate)
                    navigator.vibrate(30);
            }
        }
    }
    else
    {
        _pPaginator._vibrate = nexacro._emptyFn;
    }

    //===============================================================
    // nexacro.Paginator : Create & Destroy & Update
    //===============================================================
    _pPaginator.on_create_contents = function ()
    {
        var control = this.getElement();
        if (control)
        {
            if (this._p_showprevnextbutton)
            {
                this._prevButton = new nexacro.Button("prevbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
                this._nextButton = new nexacro.Button("nextbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
                this._prevButton._setEventHandler("onclick", this.on_notify_prev_onclick, this);
                this._nextButton._setEventHandler("onclick", this.on_notify_next_onclick, this);
                this._prevButton.set_text(this._p_prevbuttontext);
                this._nextButton.set_text(this._p_nextbuttontext);
                this._prevButton._setControl();
                this._nextButton._setControl();
                this._prevButton._is_nc_control = true;
                this._nextButton._is_nc_control = true;
                this._prevButton.createComponent(true);
                this._nextButton.createComponent(true);
            }

            if (this._p_showfirstlastbutton)
            {
                this._firstButton = new nexacro.Button("firstbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
                this._lastButton = new nexacro.Button("lastbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
                this._firstButton._setEventHandler("onclick", this.on_notify_first_onclick, this);
                this._lastButton._setEventHandler("onclick", this.on_notify_last_onclick, this);
                this._firstButton.set_text(this._p_firstbuttontext);
                this._lastButton.set_text(this._p_lastbuttontext);
                this._firstButton._setControl();
                this._lastButton._setControl();
                this._firstButton._is_nc_control = true;
                this._lastButton._is_nc_control = true;
                this._firstButton.createComponent(true);
                this._lastButton.createComponent(true);
            }

            this._updateButtons(true);
        }
    };

    _pPaginator._updateButtons = function (create_only)
    {
        if (!this._control_element)
            return;

        for (var i = 0; i < this._page_slots.length; i++)
            this._page_slots[i].button.destroy();

        this._is_update = undefined;

        this._page_slots = [];

        for (i = 0; i < this._p_pagecount; i++)
        {
            var page_btn = new nexacro.Button("pagebutton_" + i, 0, 0, 0, 0, null, null, null, null, null, null, this);

            page_btn.on_getIDCSSSelector = function ()
            {
                return "pagebutton";
            };
            page_btn._on_focus = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
            {
                if (this.parent._is_scrolling)
                    return;

                this.parent._focused_page = parseInt(this.text);
                nexacro.Component.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);
            };

            page_btn._setEventHandler("onclick", this.on_notify_page_onclick, this);
            page_btn._setEventHandler("onfocus", this.on_notify_page_onfocus, this);
            page_btn._setControl();
            page_btn.set_text(i + 1);
            page_btn.createComponent(create_only);

            this._page_slots[i] = {
                "button": page_btn,
                "spacing": 0,
                "left": 0,
                "top": 0,
                "width": 0,
                "height": 0,
                "page": i + 1,
                "visible": true,
                "moveAuto": function (left, client_height)
                {
                    var fit_s = this.button._on_getFitSize();
                    var bw;

                    this.left = left;
                    this.top = (client_height - fit_s[1]) / 2;

                    if (fit_s[1] < fit_s[0])
                        bw = fit_s[0];
                    else
                        bw = fit_s[1];

                    this.width = bw + (this.spacing * 2);
                    this.height = fit_s[1];

                    this.button.move(this.left + this.spacing, this.top, bw, fit_s[1]);

                    return this.width;
                },
                "getFitSize": function ()
                {
                    var s = this.button._on_getFitSize();
                    return [s[0] + this.spacing * 2, s[1] + this.spacing * 2];
                }
            }
        }

        this._is_update = true;
        this._recalcLayout();
        this._doSelect(this._p_page);
    };

    _pPaginator.on_created_contents = function (win)
    {
        if (this._firstButton)
            this._firstButton.on_created(win);
        if (this._prevButton)
            this._prevButton.on_created(win);

        for (var i = 0; i < this._page_slots.length; i++)
        {
            this._page_slots[i].button.on_created(win);
        }

        if (this._nextButton)
            this._nextButton.on_created(win);
        if (this._lastButton)
            this._lastButton.on_created(win);

        this.on_apply_pagesiblingmaxcount();
    };

    _pPaginator.on_create_contents_command = function ()
    {
        var str = "";
        for (var i = 0; i < this._page_slots.length; i++)
        {
            str += this._page_slots[i].button.createCommand();
        }
        return str;
    };

    _pPaginator.on_attach_contents_handle = function (win)
    {
        if (this._firstButton)
            this._firstButton.on_created(win);
        if (this._prevButton)
            this._prevButton.on_created(win);

        for (var i = 0; i < this._page_slots.length; i++)
        {
            this._page_slots[i].button.attachHandle(win);
        }

        if (this._nextButton)
            this._nextButton.on_created(win);
        if (this._lastButton)
            this._lastButton.on_created(win);

        this.on_apply_pagesiblingmaxcount();
    };

    _pPaginator.destroyComponent = function ()
    {
        if (this._prevButton)
        {
            this._prevButton.destroy();
            this._prevButton = null;
        }
        if (this._nextButton)
        {
            this._nextButton.destroy();
            this._nextButton = null;
        }
        if (this._firstButton)
        {
            this._firstButton.destroy();
            this._firstButton = null;
        }
        if (this._lastButton)
        {
            this._lastButton.destroy();
            this._lastButton = null;
        }

        for (var i = 0; i < this._page_slots.length; i++)
        {
            this._page_slots[i].button.destroy();
        }
        this._page_slots = null;
        this._curr_left_item = null;

        return nexacro.Component.prototype.destroyComponent.call(this);
    };

    //===============================================================
    // nexacro.Paginator : Override
    //===============================================================
    _pPaginator.on_change_containerRect = function (width, height)
    {
    };

    _pPaginator.on_fire_onsize = function (width, height)
    {
        this._recalcLayout(false, true);
        return nexacro.Component.prototype.on_fire_onsize.call(this, width, height);
    };

    //===============================================================
    // nexacro.Paginator : Properties
    //===============================================================
    _pPaginator.set_datacount = function (v)
    {
        v = nexacro._toInt(v);
        if (this._p_datacount != v)
        {
            this._p_datacount = v;
            this.on_apply_datacount();
        }
    };

    _pPaginator.on_apply_datacount = function ()
    {
        this._rowcount = this._p_datacount;

        if (this._p_pagesize > 0 && this._rowcount > 0)
            this._p_pagecount = Math.ceil(this._rowcount / this._p_pagesize);
        else
            this._p_pagecount = 1;

        this.set_page(1);
        this._updateButtons();
    };

    _pPaginator.set_pagesize = function (v)
    {
        v = nexacro._toInt(v);
        if (this._p_pagesize != v)
        {
            var prev_pagesize = this._p_pagesize;
            this._p_pagesize = v;
            this.on_apply_pagesize();
        }
    };

    _pPaginator.on_apply_pagesize = function ()
    {
        if (this._p_pagesize > 0 && this._rowcount > 0)
            this._p_pagecount = Math.ceil(this._rowcount / this._p_pagesize);
        else
            this._p_pagecount = 1;

        this._updateButtons();
    };

    _pPaginator.set_page = function (v)
    {
        this._doSelect(v);
    };

    _pPaginator.set_showprevnextbutton = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_showprevnextbutton != v)
        {
            this._p_showprevnextbutton = v;
            this.on_apply_showfirstlastbutton();
        }
    };

    _pPaginator.on_apply_showprevnextbutton = function ()
    {
        this._updateButtons();
    };

    _pPaginator.set_showfirstlastbutton = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_showfirstlastbutton != v)
        {
            this._p_showfirstlastbutton = v;
            this.on_apply_showfirstlastbutton();
        }
    };

    _pPaginator.on_apply_showfirstlastbutton = function ()
    {
        this._updateButtons();
    };

    _pPaginator.set_prevbuttontext = function (v)
    {
        if (this._p_prevbuttontext != v)
        {
            this._p_prevbuttontext = v;
            this.on_apply_prevbuttontext();
        }
    };

    _pPaginator.on_apply_prevbuttontext = function ()
    {
        if (this._prevButton)
            this._prevButton.set_text(this._p_prevbuttontext);

        this._updateButtons();
    };

    _pPaginator.set_nextbuttontext = function (v)
    {
        if (this._p_nextbuttontext != v)
        {
            this._p_nextbuttontext = v;
            this.on_apply_nextbuttontext();
        }
    };

    _pPaginator.on_apply_nextbuttontext = function ()
    {
        if (this._nextButton)
            this._nextButton.set_text(this._p_nextbuttontext);

        this._updateButtons();
    };

    _pPaginator.set_firstbuttontext = function (v)
    {
        if (this._p_firstbuttontext != v)
        {
            this._p_firstbuttontext = v;
            this.on_apply_firstbuttontext();
        }
    };

    _pPaginator.on_apply_firstbuttontext = function ()
    {
        if (this._firstButton)
            this._firstButton.set_text(this._p_firstbuttontext);

        this._updateButtons();
    };

    _pPaginator.set_lastbuttontext = function (v)
    {
        if (this._p_lastbuttontext != v)
        {
            this._p_lastbuttontext = v;
            this.on_apply_lastbuttontext();
        }
    };

    _pPaginator.on_apply_lastbuttontext = function ()
    {
        if (this._lastButton)
            this._lastButton.set_text(this._p_lastbuttontext);

        this._updateButtons();
    };

    _pPaginator.set_navibuttongap = function (v)
    {
        v = nexacro._toInt(v);
        if (this._p_navibuttongap != v)
        {
            this._p_navibuttongap = v;
            this.on_apply_navibuttongap();
        }
    };

    _pPaginator.on_apply_navibuttongap = function (v)
    {
        this._recalcLayout();
    };

    _pPaginator.set_pagebuttongap = function (v)
    {
        v = nexacro._toInt(v);
        if (this._p_pagebuttongap != v)
        {
            this._p_pagebuttongap = v;
            this.on_apply_pagebuttongap();
        }
    };

    _pPaginator.on_apply_pagebuttongap = function (v)
    {
        this._recalcLayout();
    };

    _pPaginator.set_pagesiblingmaxcount = function (v)
    {
        v = nexacro._toInt(v);

        if (v < 0)
            return;

        if (this._p_pagesiblingmaxcount != v)
        {
            this._p_pagesiblingmaxcount = v;
            this.on_apply_pagesiblingmaxcount();
        }
    };

    _pPaginator.on_apply_pagesiblingmaxcount = function (v)
    {
        if (this._p_pagesiblingmaxcount >= 0)
            this._pageitemcount = this._p_pagesiblingmaxcount * 2 + 1;

        this._recalcLayout();
    };

    _pPaginator.set_outsidegap = function (v)
    {
        v = nexacro._toInt(v);
        if (this._p_outsidegap != v)
        {
            this._p_outsidegap = v;
            this.on_apply_outsidegap();
        }
    };

    _pPaginator.on_apply_outsidegap = function (v)
    {
        this._recalcLayout();
    };

    //===============================================================
    // nexacro.Paginator : Methods
    //===============================================================
    _pPaginator._doSelect = function (postpage, no_focus_act)
    {
        postpage = nexacro._toInt(postpage);
        if (postpage < 1 || postpage > this._page_slots.length)
            return;

        if (this._p_page != postpage)
        {
            var prevpage = this._p_page;

            this._getPageSlot(prevpage).button._changeUserStatus("selected", false);
            this._getPageSlot(postpage).button._changeUserStatus("selected", true);

            this._doFocus(postpage, no_focus_act);

            this._p_page = postpage;
            this.on_fire_onpagechanged(prevpage, postpage);
        }
        else
        {
            this._getPageSlot(postpage).button._changeUserStatus("selected", true);
            this._doFocus(postpage, no_focus_act);
        }
    };

    _pPaginator._doFocus = function (postpage, no_focus_act)
    {
        if (postpage == undefined)
            postpage = this._focused_page;

        postpage = nexacro._toInt(postpage);
        if (postpage < 1 || postpage > this._page_slots.length)
            return;

        var pagebutton = this._getPageSlot(postpage).button;

        this._movePage(postpage);

        if (!no_focus_act && pagebutton && this._isFocused())
            pagebutton.setFocus(true);
    };

    _pPaginator._isFocused = function ()
    {
        var owner_frame = this._getOwnerFrame();
        var form = this._getForm();

        if (!owner_frame || !form._isMainForm())   // window가 닫힌 이후 들어오는 경우..
            return false;

        var is_activate = owner_frame._activate || form._activate;
        var ismodal = false;
        var modalframe = this._getWindow()._getLastModalFrame();

        if (modalframe && !modalframe._contains(this))
            ismodal = true;

        if (is_activate == false || ismodal)
            return false;

        if (this._focused != undefined)
            return this._focused;

        var lastfocus = this._find_lastFocused();

        if (lastfocus instanceof nexacro.Div)
            lastfocus = lastfocus._getLastFocused();

        var retn = true;
        if (lastfocus != this)
            retn = false;

        this._focused = retn;
        return retn;
    };

    _pPaginator._recalcLayout = function (moving_calc, resize_calc, recursive)
    {
        if (!this._is_update || this._is_recalc_skip)
            return;

        var width = this._getClientWidth();
        var height = this._getClientHeight();
        var nw;
        var sl = 0;
        var control_elem = this.getElement();
        var tot_w = 0;

        if (!moving_calc && !resize_calc)
        {
            for (var i = 0; i < this._page_slots.length; i++)
            {
                this._page_slots[i].spacing = this._p_pagebuttongap;
                tot_w += this._page_slots[i].moveAuto(tot_w, height);
            }

            this._scroll_max = tot_w;
            control_elem.setElementScrollMaxSize(tot_w, 0);
            control_elem.setElementHScrollPos(0);
        }

        var client_w = this._calcClientWidth();
        var l = (this._adjust_width - client_w) / 2;

        this._no_recalc = true;
        control_elem._apply_client_padding = false;
        control_elem._setAttachClientLeft(l);
        control_elem._setAttachClientRight(l);
        this._no_recalc = undefined;

        var r = l + client_w;

        var left = this._p_outsidegap;
        var right = this._adjust_width - this._p_outsidegap;

        if (!moving_calc)
        {
            if (this._p_showfirstlastbutton)
            {
                nw = this._firstButton._on_getFitSize()[0];
                this._firstButton.move(left, 0, nw, height);

                left += (nw + this._p_navibuttongap);

                nw = this._lastButton._on_getFitSize()[0];
                right -= nw;

                this._lastButton.move(right, 0, nw, height);

                right -= this._p_navibuttongap;
            }

            if (this._p_showprevnextbutton)
            {
                nw = this._prevButton._on_getFitSize()[0];
                this._prevButton.move(left, 0, nw, height);

                nw = this._nextButton._on_getFitSize()[0];
                right -= nw;

                this._nextButton.move(right, 0, nw, height);
            }
        }

        if (recursive)
            return;

        if (this._isContentsClipping())
        {
            while (1)
            {
                if (this._pageitemcount > 1)
                {
                    this._pageitemcount -= 2;
                    var test_w = this._calcClientWidth();
                    var is_clipping = this._isContentsClipping((this._adjust_width - test_w) / 2);

                    if (is_clipping)
                        continue;
                }
                break;
            }

            var lastmove = { "last": false };
            var curr_slot = this._getScreenLeftSlot(lastmove);

            this._recalcLayout(true, resize_calc, true);
            this._is_recalc_skip = true;

            if (lastmove.last)
                this._scrollTo(this._scroll_max, null, null, null, "", "move");
            else if (!moving_calc)
                this._scrollTo(curr_slot ? curr_slot.left : 0, null, null, null, "", "move");

            this._is_recalc_skip = false;
        }
        else
        {
            while (1)
            {
                if (this._p_pagesiblingmaxcount < 0 || this._pageitemcount < (this._p_pagesiblingmaxcount * 2 + 1))
                {
                    this._pageitemcount += 2;

                    var test_w = this._calcClientWidth();
                    var is_clipping = this._isContentsClipping((this._adjust_width - test_w) / 2);

                    if (!is_clipping)
                        continue;

                    this._pageitemcount -= 2;
                }
                break;
            }
            var lastmove = { "last": false };
            var curr_slot = this._getScreenLeftSlot(lastmove);

            this._recalcLayout(true, resize_calc, true);
            this._is_recalc_skip = true;

            if (lastmove.last)
                this._scrollTo(this._scroll_max, null, null, null, "", "move");
            else if (!moving_calc)
                this._scrollTo(curr_slot.left, null, null, null, "", "move");

            this._is_recalc_skip = false;
        }

        if (this._isNcClipping())
        {
            if (this._firstButton)
                this._firstButton.set_visible(false);
            if (this._prevButton)
                this._prevButton.set_visible(false);
            if (this._nextButton)
                this._nextButton.set_visible(false);
            if (this._lastButton)
                this._lastButton.set_visible(false);
        }
        else
        {
            if (this._firstButton)
                this._firstButton.set_visible(true);
            if (this._prevButton)
                this._prevButton.set_visible(true);
            if (this._nextButton)
                this._nextButton.set_visible(true);
            if (this._lastButton)
                this._lastButton.set_visible(true);
        }

        var hpos = this.getHScrollPos();
        if (hpos == 0)
        {
            if (this._firstButton)
                this._firstButton.set_enable(false);
            if (this._prevButton)
                this._prevButton.set_enable(false);
        }
        else
        {
            if (this._firstButton)
                this._firstButton.set_enable(true);
            if (this._prevButton)
                this._prevButton.set_enable(true);
        }

        if (hpos == this._scroll_max)
        {
            if (this._nextButton)
                this._firstButton.set_enable(false);
            if (this._lastButton)
                this._prevButton.set_enable(false);
        }
        else
        {
            if (this._nextButton)
                this._firstButton.set_enable(true);
            if (this._lastButton)
                this._prevButton.set_enable(true);
        }
    };

    _pPaginator._calcClientWidth = function ()
    {
        if (!this._pageitemcount)
            return;

        var slot = this._getScreenLeftSlot();

        if (!slot)
            return;

        var w = 0;
        var item_cnt = this._pageitemcount;
        var val = 0;
        var start_idx = slot.page - 1;

        item_cnt = this._maxpage = Math.min(this._p_pagecount, item_cnt);

        for (var i = start_idx; i < this._page_slots.length; i++)
        {
            slot = this._page_slots[i];
            w += slot.width;

            item_cnt--;

            if (item_cnt == 0)
                break;
        }

        if (item_cnt > 0)
        {
            for (i = start_idx - 1; i >= 0; i--)
            {
                slot = this._page_slots[i];
                w += slot.width;

                item_cnt--;

                if (item_cnt == 0)
                    break;
            }
        }

        return w;
    };

    _pPaginator._sidebuff = 1;
    _pPaginator._isContentsClipping = function (client_left)
    {
        var right = 0;
        if (this._prevButton)
            right = this._prevButton._adjust_left + this._prevButton._adjust_width + this._sidebuff;
        else if (this._firstButton)
            right = this._firstButton._adjust_left + this._firstButton._adjust_width + this._sidebuff;

        if (client_left == undefined)
            client_left = this._getClientLeft();

        if (client_left < right)
            return true;

        return false;
    };

    _pPaginator._isNcClipping = function ()
    {
        if (this._pageitemcount > 1)
            return false;

        var left = this._adjust_width;
        if (this._nextButton)
            left = this._nextButton._adjust_left;
        else if (this._lastButton)
            left = this._lastButton._adjust_left;

        var client_rigtht = this._getClientLeft() + this._getClientWidth();
        if (client_rigtht > left)
            return true;

        return false;
    };

    _pPaginator._isShowPage = function (page)
    {
        var pagebutton = this._getPageSlot(page);
        var hpos = this._getScrollLeft();

        if (hpos <= pagebutton.left && (pagebutton.left + pagebutton.width) <= (hpos + this._getClientWidth()))
            return true;

        return false;
    };

    _pPaginator._animateAdjustScroll = function (kind, no_ani, no_fire)
    {
        if (!this._page_slots.length)
            return;

        var spos = this.getHScrollPos();
        var leftitem = this._getScreenLeftSlot();
        var gap = 0;

        if (!leftitem)
            return;

        if (this._dir > 0)
            gap = leftitem.left + leftitem.width - spos;
        else if (this._dir < 0)
            gap = leftitem.left - spos;

        this._is_scrolling = true;

        if (gap == 0)
        {
            this._animateAdjustScrollEnd(kind);
            return;
        }

        if (!no_ani)
        {
            var duration = this._adjust_scrollpos_time;
            var stime = (nexacro._Browser != "Runtime" && performance) ? performance.now() : (new Date());
            var pthis = this;
            var aniframe;

            function easeOut(t)
            {
                return 1 - Math.pow(1 - t, 2);
            };

            function animate(currtime)
            {
                var elapsed_time = currtime - stime;
                var progress = Math.min(elapsed_time / duration, 1);
                var currpos = easeOut(progress) * gap + spos;

                pthis._scrollTo(currpos, null, null, null, "", "move");

                if (progress < 1)
                    aniframe.start();
                else
                    pthis._animateAdjustScrollEnd(kind, no_fire);
            };



            if (this._aniframe_adjust)
                this._aniframe_adjust.destroy();

            aniframe = this._aniframe_adjust = new nexacro.AnimationFrame(this, animate);
            aniframe.start();


        }
    };

    _pPaginator._animateAdjustScrollEnd = function (kind, no_fire)
    {
        this._is_scrolling = false;
        this._dir = 0;
        this._vibrate();
    };

    _pPaginator._movePage = function (page)
    {
        var page_btn = this._getPageSlot(page);
        var target_pos;

        if (!page_btn)
            return;

        var dir = page - this._p_page;
        var max = this._pageitemcount;
        var start_btn;

        if (max % 2)
        {
            start_btn = this._getPageSlot(page - Math.floor(max / 2));
        }
        else
        {
            if (dir > 0)
                start_btn = this._getPageSlot(page - (max / 2));
            else if (dir < 0)
                start_btn = this._getPageSlot(page - (max / 2) + 1);
        }

        if (start_btn)
            target_pos = start_btn.left;
        else
            target_pos = 0;

        this._scrollTo(target_pos, null, null, null, "", "move");
    };

    _pPaginator._getPageSlot = function (page)
    {
        return this._page_slots[page - 1];
    };


    //===============================================================
    // nexacro.Paginator : Events
    //===============================================================
    _pPaginator.on_fire_sys_onkeydown = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key)
    {
        if (key_code == nexacro.Event.KEY_LEFT)
            this._doFocus(this._focused_page - 1);
        else if (key_code == nexacro.Event.KEY_RIGHT)
            this._doFocus(this._focused_page + 1);
        else if (key_code == nexacro.Event.KEY_SPACE || key_code == nexacro.Event.KEY_ENTER)
        {
            this._getPageSlot(this._focused_page).button.click();
        }
    };

    _pPaginator.on_fire_onpagechanged = function (prev_page, post_page)
    {
        if (this.onpagechanged && this.onpagechanged._has_handlers)
        {
            var evt = new nexacro.PageChangeEventInfo(this, "onpagechanged", prev_page, post_page);
            return this.onpagechanged._fireEvent(this, evt);
        }
    };

    _pPaginator._setDSEventHandlers = function (ds)
    {
        if (ds)
        {
            ds._setEventHandler("onload", this.on_dsnotify_onload, this);
            ds._setEventHandler("onrowsetchanged", this.on_dsnotify_onrowsetchanged, this);
        }
    };

    _pPaginator._removeDSEventHandlers = function (ds)
    {
        if (ds)
        {
            ds._removeEventHandler("onload", this.on_dsnotify_onload, this);
            ds._removeEventHandler("onrowsetchanged", this.on_dsnotify_onrowsetchanged, this);
        }
    };

    _pPaginator.on_dsnotify_onload = function (obj, e)
    {
        this._rowcount = obj._p_rowcount;

        if (this._p_pagesize > 0 && this._rowcount > 0)
            this._p_pagecount = Math.ceil(this._rowcount / this._p_pagesize);
        else
            this._p_pagecount = 1;

        this._updateButtons();
    };

    _pPaginator.on_dsnotify_onrowsetchanged = function (obj, e)
    {
        this._rowcount = obj._p_rowcount;

        if (this._p_pagesize > 0 && this._rowcount > 0)
            this._p_pagecount = Math.ceil(this._rowcount / this._p_pagesize);
        else
            this._p_pagecount = 1;

        this._updateButtons();
    };

    _pPaginator.on_notify_first_onclick = function (obj, e)
    {
        this._movePage(1);
        this._doSelect(1);
    };

    _pPaginator.on_notify_last_onclick = function (obj, e)
    {
        this._movePage(this._p_pagecount);
        this._doSelect(this._p_pagecount);
    };

    _pPaginator.on_notify_prev_onclick = function (obj, e)
    {
        var slot = this._getScreenLeftSlot();
        slot = this._getPageSlot(slot.page - this._pageitemcount);

        if (slot)
            this._scrollTo(slot.left, 0, true, false, undefined, "move");
        else
            this._scrollTo(0, 0, true, false, undefined, "move");

        this._doSelect(this._p_page - this._pageitemcount);
    };

    _pPaginator.on_notify_next_onclick = function (obj, e)
    {
        var slot = this._getScreenLeftSlot();
        slot = this._getPageSlot(slot.page + this._pageitemcount);

        if (slot)
            this._scrollTo(slot.left, 0, true, false, undefined, "move");
        else
            this._scrollTo(this._scroll_max, 0, true, false, undefined, "move");

        this._doSelect(this._p_page + this._pageitemcount);
    };

    _pPaginator._on_repeat = function (fromComp, x, y)
    {
        if (fromComp == this._prevButton)
            this.on_notify_prev_onclick();
        else if (fromComp == this._nextButton)
            this.on_notify_next_onclick();
    };

    _pPaginator.on_notify_page_onclick = function (obj, e)
    {
        if (this._is_scrolling)
            return;

        this._doSelect(obj.text, true);
    };

    _pPaginator.on_notify_page_onfocus = function (obj, e)
    {
        if (this._is_scrolling)
            return;

        this._doFocus(obj.text, true);
    };

    _pPaginator._on_focus = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        nexacro.Component.prototype._on_focus.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);
        this._focused = undefined;
    };

    _pPaginator._on_killfocus = function (new_focus, new_ref_focus)
    {
        this._focused = undefined;
        nexacro.Component.prototype._on_killfocus.call(this, new_focus, new_ref_focus);
    };

    _pPaginator.on_fire_sys_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._need_adjust)
        {
            this._animateAdjustScroll();
            this._need_adjust = undefined;
        }
        this._cur_ldown_elem = null;
    };

    _pPaginator.on_fire_sys_onrbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this._need_adjust)
        {
            this._animateAdjustScroll();
            this._need_adjust = undefined;
        }
        this._cur_ldown_elem = null;
    };

    _pPaginator.on_touchend_basic_action = function (touch_manager, touchinfos, changedtouchinfos, refer_comp)
    {
        nexacro.Component.prototype.on_touchend_basic_action.call(this, touch_manager, touchinfos, changedtouchinfos, refer_comp);

        if (touch_manager._is_next_fire_fling == false)
        {
            var delta = this._tmp_hscroll - this.getHScrollPos();

            this._dir = 0;


            if (delta < 0)
                this._dir = 1;
            else if (delta > 0)
                this._dir = -1;

            this._animateAdjustScroll();
        }
        else if (this._aniframe_adjust)
        {
            this._aniframe_adjust.stop();
            this._is_scrolling = false;
        }
        this._cur_ldown_elem = null;
    };

    _pPaginator._tmp_hscroll = 0;
    _pPaginator._dir = 0;
    _pPaginator.on_slidestart_default_action = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, refer_comp)
    {
        if (this._aniframe_adjust)
        {
            this._aniframe_adjust.stop();
            this._is_scrolling = false;
        }

        this._tmp_hscroll = this.getHScrollPos();
    };

    _pPaginator.on_slideend_default_action = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, refer_comp)
    {
        if (touch_manager._is_next_fire_fling == false)
        {
            var delta = this._tmp_hscroll - this.getHScrollPos();

            this._dir = 0;

            if (delta < 0)
                this._dir = 1;
            else if (delta > 0)
                this._dir = -1;

            this._animateAdjustScroll();
        }
        else if (this._aniframe_adjust)
        {
            this._aniframe_adjust.stop();
            this._is_scrolling = false;
        }
        this._cur_ldown_elem = null;
    };

    _pPaginator.on_flingend_default_action = function (elem, fling_handler, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, refer_comp)
    {
        var parent = this._cur_ldown_elem;
        var is_down = false;

        while (parent)
        {
            if (parent instanceof nexacro._pPaginator)
            {
                if (parent == this)
                    is_down = true;

                break;
            }
            parent = parent._p_parent;
        }

        var delta = this._tmp_hscroll - this.getHScrollPos();

        this._dir = 0;

        if (delta < 0)
            this._dir = 1;
        else if (delta > 0)
            this._dir = -1;

        if (!is_down)
            this._animateAdjustScroll();
        else
            this._need_adjust = true;
    };

    _pPaginator._getScreenLeftSlot = function (last)
    {
        var hpos = this.getHScrollPos();
        var slots = this._page_slots;

        if (!slots.length)
            return null;

        if (last)
        {
            var limit = this._control_element.hscroll_limit;

            if (limit >= hpos && hpos > limit - slots[slots.length - 1].width)
                last.last = true;
        }

        if (this._curr_left_item)
            return this._curr_left_item;

        for (var i = 0; i < slots.length; i++)
        {
            var r = slots[i].left + slots[i].width;

            if (slots[i].left <= hpos && hpos < r)
                return slots[i];
        }
        return null;
    };

    _pPaginator._updateScreenLeftSlot = function ()
    {
        var hpos = this.getHScrollPos();
        var slots = this._page_slots;

        for (var i = 0; i < slots.length; i++)
        {
            var r = slots[i].left + slots[i].width;

            if (slots[i].left <= hpos && hpos < r)
            {
                this._curr_left_item = slots[i];
                break;
            }
        }
    };

    _pPaginator.on_fire_sys_onfling = function (elem, touch_manager, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp)
    {
        // for new TouchGestureManager
        var hscrollbar = this._p_hscrollbar;
        var vscrollbar = this._p_vscrollbar;
        var dragscrolltype = this._p_dragscrolltype;
        var scroll_comp = touch_manager._scroll_comp;
        var scroll_mode = touch_manager._scroll_mode;

        var is_scrollable = this._getScrollable();

        if (scroll_comp)
        {
            if (scroll_comp != this)
                return false;
        }
        else
        {
            var can_hscroll = false;
            var can_vscroll = false;

            // Check Horz
            if (xdeltavalue != 0 && is_scrollable && (dragscrolltype != "none" && dragscrolltype != "vert"))
            {
                var hlimit, hpos, proc = true;

                if (hscrollbar)
                {
                    if (hscrollbar._p_enable)
                    {
                        hlimit = hscrollbar._p_max;
                        hpos = hscrollbar._p_pos;
                    }
                    else
                    {
                        proc = false;
                    }
                }
                else
                {
                    hlimit = this._control_element.hscroll_limit;
                    hpos = this.getHScrollPos();
                }

                if (proc)
                {
                    if (xdeltavalue < 0) // 왼쪽으로 Swipe -> 오른쪽으로 스크롤
                    {
                        if (hpos < hlimit)
                            can_hscroll = true;
                    }
                    else // 오른쪽으로 Swipe -> 왼쪽으로 스크롤
                    {
                        if (hpos > 0)
                            can_hscroll = true;
                    }
                }
            }

            // Check Vert
            if (ydeltavalue != 0 && is_scrollable && (dragscrolltype != "none" && dragscrolltype != "horz"))
            {
                var vlimit, vpos, proc = true;

                if (vscrollbar)
                {
                    if (vscrollbar._p_enable)
                    {
                        vlimit = vscrollbar._p_max;
                        vpos = vscrollbar._p_pos;
                    }
                    else
                    {
                        proc = false;
                    }
                }
                else
                {
                    vlimit = this._control_element.vscroll_limit;
                    vpos = this.getVScrollPos();
                }

                if (proc)
                {
                    if (ydeltavalue < 0) // 위로 Swipe -> 아래로 스크롤
                    {
                        if (vpos < vlimit)
                            can_vscroll = true;
                    }
                    else // 아래로 Swipe -> 위로 스크롤
                    {
                        if (vpos > 0)
                            can_vscroll = true;
                    }
                }
            }

            // ScrollMode 확정 (0:none, 1:vert, 2:horz, 3:both)
            scroll_mode = 0;
            if (this._p_dragscrolltype == "all" && (can_hscroll || can_vscroll))
                scroll_mode = 3;
            else if (can_hscroll && can_vscroll)
            {
                if (Math.abs(ydeltavalue) < Math.abs(xdeltavalue))
                    scroll_mode = 2;
                else
                    scroll_mode = 1;
            }
            else if (can_hscroll)
                scroll_mode = 2;
            else if (can_vscroll)
                scroll_mode = 1;

            if (this._p_selectscrollmode != undefined)
            {
                var select_mode;

                if (this._p_selectscrollmode == "default")
                    select_mode = (nexacro._isTouchInteraction || nexacro._SupportTouch) ? "scroll" : "select";
                else
                    select_mode = this._p_selectscrollmode;

                if (select_mode == "select")
                    scroll_mode = 0;
            }

            if (scroll_mode > 0)
            {
                touch_manager._scroll_end = false;
                touch_manager._scroll_comp = this;
                touch_manager._scroll_mode = scroll_mode;
            }
            else
            {
                return false;
            }
        }

        if (scroll_mode > 0)
        {
            if (scroll_mode == 1 && scroll_mode != 3)
                xdeltavalue = 0;
            else if (scroll_mode == 2 && scroll_mode != 3)
                ydeltavalue = 0;

            var old_vpos = this._vscroll_pos;
            var old_hpos = this._hscroll_pos;

            if (xdeltavalue != 0 || ydeltavalue != 0)
            {
                this._scrollBy(-xdeltavalue, -ydeltavalue, true, false, undefined, "fling");
            }

            var new_vpos = this._vscroll_pos;
            var new_hpos = this._hscroll_pos;

            if (this._is_bubble_fling_v === undefined && this._is_bubble_fling_h === undefined)
            {
                return !(old_vpos == new_vpos && old_hpos == new_hpos);
                /*
                if (old_vpos == new_vpos && old_hpos == new_hpos)
                    return false;
                else
                    return true;
                    */
            }

            if (xdeltavalue != 0 && ydeltavalue != 0)
            {
                if (this._is_bubble_fling_v && this._is_bubble_fling_h)
                    return false;
            }
            else if (xdeltavalue != 0)
            {
                if (this._is_bubble_fling_h)
                    return false;
            }
            else if (ydeltavalue != 0)
            {
                if (this._is_bubble_fling_v)
                    return false;
            }
            return true;
        }

        return false;
    };

    _pPaginator.on_fire_sys_onslide = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp, scroll_start)
    {
        if (nexacro._cur_track_info)
        {
            if (nexacro._cur_track_info.target._no_slide_scroll == true)
                return true;
        }

        var scroll_comp = touch_manager._scroll_comp;
        var scroll_mode = touch_manager._scroll_mode;

        if (scroll_comp)
        {
            if (scroll_comp != this)
                return false;
        }
        else
        {
            var hscrollbar = this._p_hscrollbar;
            var vscrollbar = this._p_vscrollbar;
            var dragscrolltype = this.dragscrolltype;
            var selectscrollmode = this.selectscrollmode;

            var can_hscroll = false;
            var can_vscroll = false;

            // Check Horz Move
            if (xdeltavalue != 0 && (dragscrolltype != "none" && dragscrolltype != "vert"))
            {
                var hlimit, hpos, proc = true;

                if (hscrollbar)
                {
                    if (hscrollbar._p_enable)
                    {
                        hlimit = hscrollbar.max;
                        hpos = hscrollbar.pos;
                    }
                    else
                    {
                        proc = false;
                    }
                }
                else
                {
                    hlimit = this._control_element.hscroll_limit;
                    hpos = this.getHScrollPos();
                }

                if (proc)
                {
                    if (xdeltavalue < 0) // 왼쪽으로 Swipe -> 오른쪽으로 스크롤
                    {
                        if (hpos < hlimit)
                            can_hscroll = true;
                    }
                    else // 오른쪽으로 Swipe -> 왼쪽으로 스크롤
                    {
                        if (hpos > 0)
                            can_hscroll = true;
                    }
                }
            }

            // Check Vert Move
            if (ydeltavalue != 0 && (dragscrolltype != "none" && dragscrolltype != "horz"))
            {
                var vlimit, vpos, proc = true;

                if (vscrollbar)
                {
                    if (vscrollbar._p_enable)
                    {
                        vlimit = vscrollbar.max;
                        vpos = vscrollbar.pos;
                    }
                    else
                    {
                        proc = false;
                    }
                }
                else
                {
                    vlimit = this._control_element.vscroll_limit;
                    vpos = this.getVScrollPos();
                }

                if (proc)
                {
                    if (ydeltavalue < 0) // 위로 Swipe -> 아래로 스크롤
                    {
                        if (vpos < vlimit)
                            can_vscroll = true;
                    }
                    else // 아래로 Swipe -> 위로 스크롤
                    {
                        if (vpos > 0)
                            can_vscroll = true;
                    }
                }
            }

            // Check Control
            if (this._p_stepselector)
            {
                can_hscroll = true;
            }

            // up/down action : vscroll을 하려는 목적인데 hscroll이 잡히는경우 방지
            if (Math.abs(xaccvalue) < Math.abs(yaccvalue) && (Math.abs(xdeltavalue) <= 5))
            {
                can_hscroll = false;
            }
            // left/right action : hscroll을 하려는 목적인데 vscroll이 잡히는경우 방지
            else if (Math.abs(xaccvalue) > Math.abs(yaccvalue) && (Math.abs(ydeltavalue) <= 5))
            {
                can_vscroll = false;
            }

            if (this._scrolltype == "none")
            {
                can_hscroll = can_vscroll = false;
            }

            // fix scrollmode
            // scroll_mode		0:none, 1:vert, 2:horz, 3:both

            if (dragscrolltype == "all" && (can_hscroll || can_vscroll))
            {
                scroll_mode = 3;
            }
            else if (can_hscroll && can_vscroll)
            {
                if (Math.abs(ydeltavalue) < Math.abs(xdeltavalue))
                    scroll_mode = 2;
                else
                    scroll_mode = 1;
            }
            else if (can_hscroll)
                scroll_mode = 2;
            else if (can_vscroll)
                scroll_mode = 1;
            else
                scroll_mode = -1;

            if (selectscrollmode == "default" && (!(nexacro._isTouchInteraction || nexacro._SupportTouch)))
            {
                scroll_mode = 0;
            }
            else if (selectscrollmode == "select")
            {
                scroll_mode = 0;
            }

            if (scroll_mode > 0)
            {
                touch_manager._scroll_end = false;
                touch_manager._scroll_comp = this;
                touch_manager._scroll_mode = scroll_mode;
            }
            else
            {
                return false;
            }
        }

        // check Scale
        if (this._getZoom)
        {
            var zoom_factor = this._getZoom();
            if (zoom_factor != 100)
            {
                xdeltavalue /= (zoom_factor / 100.0);
                ydeltavalue /= (zoom_factor / 100.0);
            }
        }

        // Calc Scroll Position
        var hscroll_pos = this._hscroll_pos;
        var vscroll_pos = this._vscroll_pos;

        if ((scroll_mode == 3 || scroll_mode == 2) && xdeltavalue != 0)
        {
            hscroll_pos -= xdeltavalue;
        }

        if ((scroll_mode == 3 || scroll_mode == 1) && ydeltavalue != 0)
        {
            vscroll_pos -= ydeltavalue;
        }

        var old_vpos = this._vscroll_pos;
        var old_hpos = this._hscroll_pos;

        this._scrollTo(hscroll_pos, vscroll_pos, true, false, undefined, "slide");

        var new_vpos = this._vscroll_pos;
        var new_hpos = this._hscroll_pos;

        if (scroll_start)
        {
            this._is_bubble_fling_v = false;
            this._is_bubble_fling_h = false;

            if (xdeltavalue != 0 && ydeltavalue != 0)
            {
                if (old_vpos == new_vpos && old_hpos == new_hpos)
                {
                    this._is_bubble_fling_v = true;
                    this._is_bubble_fling_h = true;
                }
                else if (old_hpos == new_hpos)
                {
                    this._is_bubble_fling_h = true;
                }
                else if (old_vpos == new_vpos)
                    this._is_bubble_fling_v = true;
            }
            else if (xdeltavalue != 0)
            {
                if (old_hpos == new_hpos)
                    this._is_bubble_fling_h = true;
            }
            else if (ydeltavalue != 0)
            {
                if (old_vpos == new_vpos)
                    this._is_bubble_fling_v = true;
            }
        }
        return true;
    };

    _pPaginator._setHscrollPos = function (v)
    {
        this._hscroll_pos = nexacro._toInt(v);
        var prev_left_item = this._curr_left_item;
        this._updateScreenLeftSlot();

        if (prev_left_item != this._curr_left_item)
            this._vibrate();
    };

    _pPaginator._scrollTo = function (hpos, vpos, bapplyscrollbar, bautohidetimer, evttype, evtkind)
    {
        //  if (evtkind == "slide" || evtkind == "fling")
        //    return;

        var retn = nexacro.Component.prototype._scrollTo.call(this, hpos, vpos, bapplyscrollbar, bautohidetimer, evttype, evtkind);
        this._recalcLayout(true);

        return retn;
    };

    nexacro._defineProperties(_pPaginator, _pPaginator._properties);

    _pPaginator = null;
}
