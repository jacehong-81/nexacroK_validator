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

if (!nexacro.ProgressBar)
{
    //==================================================================================
    // nexacro.ProgressBar
    //==================================================================================
    nexacro.ProgressBar = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        this._progressbaritems = new Array();
    };

    var _pProgressBar = nexacro._createPrototype(nexacro.Component, nexacro.ProgressBar);
    nexacro.ProgressBar.prototype = _pProgressBar;
    _pProgressBar._type_name = "ProgressBar";

    /* control */
    _pProgressBar._p_progressstartcap = null;
    _pProgressBar._p_progressendcap = null;
    _pProgressBar._progressbartext = null;

    /* default properties */
    _pProgressBar._p_smooth = false;
    _pProgressBar._p_direction = "forward";
    _pProgressBar._p_pos = 0;
    _pProgressBar._p_step = 1;
    _pProgressBar._p_max = 100;
    _pProgressBar._p_min = 0;
    _pProgressBar._p_blocksize = undefined;
    _pProgressBar._p_blockgap = undefined;

    /* internal variable */
    _pProgressBar._endcap_width = 0;
    _pProgressBar._startcap_width = 0;
    _pProgressBar._item_width = 0;

    _pProgressBar._endcap_iconwidth = undefined;
    _pProgressBar._startcap_iconwidth = undefined;
    _pProgressBar._item_iconwidth = undefined;
    _pProgressBar._item_icon_url = "";
    _pProgressBar._item_edge_url = "";

    /* accessibility */
    _pProgressBar._p_accessibilityrole = "progressbar";

    /* apply style */
    _pProgressBar.on_apply_text = function (v)
    {
        var control_elem = this.getElement();

        if (control_elem)
        {
            if (!v)
            {
                v = this._getStringResourceProperty(this._p_text);
                var exprfn = this._expr_fn;
                if (exprfn)
                {
                    try
                    {
                        v = nexacro._toString(exprfn.call(null, this));
                    }
                    catch (e)
                    {
                        if (e && e.message)
                            trace(e.message);
                    }
                }
            }

            if (v)
            {
                var progressbartext = this._progressbartext;
                var client_width, client_height;
                if (!progressbartext)
                {
                    client_width = this._getClientWidth();
                    client_height = this._getClientHeight();
                    progressbartext = this._progressbartext = new nexacro.Static("progressbartext", 0, 0, client_width, client_height, null, null, null, null, null, null, this);
                    progressbartext._setControl();
                    progressbartext.set_text(v);
                    progressbartext.createComponent();
                    progressbartext._setEventHandler("onclick", this.on_notify_progressbar_onclick, this);
                }
                else
                {
                    client_width = this._getClientWidth();
                    client_height = this._getClientHeight();

                    progressbartext.set_text(v);
                    progressbartext.move(0, 0, client_width, client_height, null, null);

                    if (!progressbartext._is_created)
                        progressbartext.on_created();

                }

            }
            else
            {
                if (this._progressbartext)
                {
                    this._progressbartext.destroy();
                    this._progressbartext = null;
                }
            }
        }
    };

    _pProgressBar.on_apply_prop_enable = function (v)
    {
        if (this._p_progressstartcap)
            this._p_progressstartcap._setEnable(v);

        if (this._p_progressendcap)
            this._p_progressendcap._setEnable(v);

        var items = this._progressbaritems;
        var itemcnt = items.length;
        for (var i = 0; i < itemcnt; i++)
        {
            items[i]._setEnable(v);
        }
    };

    //===============================================================
    // nexacro.ProgressBar : Create & Destroy & Update
    //===============================================================
    _pProgressBar.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            this._createProgressBarItems(true);
        }
    };

    _pProgressBar.on_created_contents = function (_window)
    {
        if (this._p_progressstartcap)
            this._p_progressstartcap.on_created(_window);

        var itemlist = this._progressbaritems;
        var itemcnt = itemlist.length;
        for (var i = 0; i < itemcnt; i++)
            itemlist[i].on_created(_window);

        if (this._p_progressendcap)
            this._p_progressendcap.on_created(_window);

        if (this._progressbartext)
            this._progressbartext.on_created(_window);

        if (this._env._p_enableaccessibility && this._isAccessibilityEnable())
        {
            this._setAccessibilityInfoValueMin(this._p_min);
            this._setAccessibilityInfoValueMax(this._p_max);
            this._setAccessibilityInfoValueCur(this._p_pos);
        }
    };

    _pProgressBar.on_destroy_contents = function ()
    {
        if (this._p_progressstartcap)
        {
            this._p_progressstartcap.destroy();
            this._p_progressstartcap = null;
        }

        if (this._p_progressendcap)
        {
            this._p_progressendcap.destroy();
            this._p_progressendcap = null;
        }

        if (this._progressbartext)
        {
            this._progressbartext.destroy();
            this._progressbartext = null;
        }
        this._clearProgressBarItems(true);
    };

    _pProgressBar.on_create_contents_command = function ()
    {
        var str = "";
        if (this._p_progressstartcap)
            str += this._p_progressstartcap.createCommand();

        var itemlist = this._progressbaritems;
        var itemcnt = itemlist.length;
        for (var i = 0; i < itemcnt; i++)
            str += itemlist[i].createCommand();

        if (this._p_progressendcap)
            str += this._p_progressendcap.createCommand();

        if (this._progressbartext)
            str += this._progressbartext.createCommand();

        return str;
    };

    _pProgressBar.on_attach_contents_handle = function (win)
    {
        if (this._p_progressstartcap)
            this._p_progressstartcap.attachHandle(win);

        var itemlist = this._progressbaritems;
        for (var i = 0; i < itemlist.length; i++)
            itemlist[i].attachHandle(win);

        if (this._p_progressendcap)
            this._p_progressendcap.attachHandle(win);

        if (this._progressbartext)
            this._progressbartext.attachHandle(win);

        this._on_attach_accessibility_contents_handle(win);
    };

    _pProgressBar.on_change_containerRect = function (/*width, height*/)
    {
        this._update();
    };

    //===============================================================
    // nexacro.ProgressBar : Override
    //===============================================================    

    //===============================================================
    // nexacro.ProgressBar : Properties
    //===============================================================
    _pProgressBar.set_blockgap = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v))
            {
                return;
            }
        }

        if (this._p_blockgap != v)
        {
            this._p_blockgap = v;
            this._update();
        }
    };

    _pProgressBar.set_blocksize = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v))
            {
                return;
            }
        }

        if (v < 1)
            v = 1;

        if (this._p_blocksize != v)
        {
            this._p_blocksize = v;
            this._update();
        }
    };

    _pProgressBar.set_min = function (v)
    {
        if (isNaN(v = +v))
        {
            return;
        }

        v = (v < 0) ? 0 : v;
        if (this._p_min != v)
        {
            this._p_min = v;
            this.on_apply_min(v);
            this._update();
        }
    };

    _pProgressBar.on_apply_min = function (min)
    {
        if (min > this._p_max)
        {
            this._p_max = min;
        }
        if (min > this._p_pos)
        {
            this._p_pos = min;
        }

        if (this._env._p_enableaccessibility && this._isAccessibilityEnable())
        {
            this._setAccessibilityInfoValueMin(min);
        }
    };

    _pProgressBar.set_max = function (v)
    {
        if (isNaN(v = +v))
        {
            return;
        }

        v = (v < 0) ? 0 : v;
        if (this._p_max != v)
        {
            this._p_max = v;
            this.on_apply_max(v);

            this._update();
        }
    };

    _pProgressBar.on_apply_max = function (max)
    {
        if (max < this._p_min)
        {
            this._p_min = max;
        }
        if (max < this._p_pos)
        {
            this._p_pos = max;
        }

        if (this._env._p_enableaccessibility && this._isAccessibilityEnable())
        {
            this._setAccessibilityInfoValueMax(max);
        }
    };

    _pProgressBar.set_pos = function (v)
    {
        if (isNaN(v = +v))
        {
            return;
        }

        if (this._p_pos != v)
        {
            if (v > this._p_max)
            {
                v = this._p_max;
            }
            else if (v < this._p_min)
            {
                v = this._p_min;
            }

            this._p_pos = v;

            if (this._env._p_enableaccessibility && this._isAccessibilityEnable())
            {
                this._setAccessibilityInfoValueCur(v);
            }
        }
        this._update();
    };

    _pProgressBar.set_step = function (v)
    {
        if (isNaN(v = +v))
        {
            return;
        }

        if (this._p_step != v)
        {
            this._p_step = v;
            this._update();
        }
    };

    _pProgressBar.set_smooth = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_smooth != v)
        {
            this._p_smooth = v;
            this._update();
        }
    };

    _pProgressBar.set_direction = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_direction != v)
        {
            this._p_direction = v;
            this._update();
        }
    };

    _pProgressBar._properties = [{ name: "smooth" }, { name: "direction" }, { name: "pos" }, { name: "step" }, { name: "max" }, { name: "min" }, { name: "blocksize" }, { name: "blockgap" }, { name: "progressstartcap", readonly: true }, { name: "progressendcap", readonly: true }];
    nexacro._defineProperties(_pProgressBar, _pProgressBar._properties);

    //============================================================
    // nexacro.ProgressBar : Methods
    //============================================================
    _pProgressBar.stepIt = function ()
    {
        this.set_pos(this._p_pos + this._p_step);
    };

    //===============================================================
    // nexacro.ProgressBar : Event Handlers
    //===============================================================
    _pProgressBar._on_loadimage_start_icon = function (imgurl, width/*, height*/)
    {
        this._startcap_iconwidth = width;
        this._update();
    };

    _pProgressBar._on_loadimage_end_icon = function (imgurl, width/*, height*/)
    {
        this._endcap_iconwidth = width;
        this._update();
    };

    _pProgressBar._on_loadimage_item_icon = function (imgurl, width/*, height*/)
    {
        this._item_iconwidth = width;
        this._update();
    };

    _pProgressBar.on_notify_progressbar_onclick = function (obj, e)
    {
        this.on_fire_onclick(e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, this, this, e.metakey);
    };

    //============================================================
    // nexacro.ProgressBar : Logical Part
    //============================================================
    _pProgressBar._createProgressStartCap = function (iscreateonly)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var progressstartcap = this._p_progressstartcap;
            if (!progressstartcap)
            {
                progressstartcap = new nexacro._Icon("progressstartcap", 0, 0, 0, this._getClientHeight(), null, null, null, null, null, null, this);
                progressstartcap._setControl();
                progressstartcap.createComponent(iscreateonly);
                this._p_progressstartcap = progressstartcap;
            }

            var border = progressstartcap._getCurrentStyleBorder();
            var padding = progressstartcap._getCurrentStylePadding();

            this._startcap_width = border ? (border.left._width + border.right._width) : 0;
            this._startcap_width += padding ? (padding.left + padding.right) : 0;

            if (this._startcap_iconwidth === undefined)
            {
                var startcap_icon = progressstartcap._icon || progressstartcap._getCSSStyleValue("icon");

                if (startcap_icon instanceof Object)
                    startcap_icon = startcap_icon.value;

                var imagesize = nexacro._getImageSize(startcap_icon, this._on_loadimage_start_icon, this);
                if (imagesize)
                {
                    this._startcap_iconwidth = imagesize.width;
                }
            }
        }
    };

    _pProgressBar._createProgressEndCap = function (iscreateonly)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var progressendcap = this._p_progressendcap;
            if (!progressendcap)
            {
                progressendcap = new nexacro._Icon("progressendcap", 0, 0, 0, this._getClientHeight(), null, null, null, null, null, null, this);
                progressendcap._setControl();
                progressendcap.createComponent(iscreateonly);
                this._p_progressendcap = progressendcap;
            }

            var border = progressendcap._getCurrentStyleBorder();
            var padding = progressendcap._getCurrentStylePadding();

            this._endcap_width = border ? (border.left._width + border.right._width) : 0;
            this._endcap_width += padding ? (padding.left + padding.right) : 0;

            if (this._endcap_iconwidth === undefined)
            {
                var endcap_icon = progressendcap._icon || progressendcap._getCSSStyleValue("icon");

                if (endcap_icon instanceof Object)
                    endcap_icon = endcap_icon.value;

                var imagesize = nexacro._getImageSize(endcap_icon, this._on_loadimage_end_icon, this);
                if (imagesize)
                {
                    this._endcap_iconwidth = imagesize.width;
                }
            }
        }
    };

    _pProgressBar._createProgressBarItemTemp = function (/*iscreateonly*/)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var progressbaritem = new nexacro._ProgressBarItemControl("progressbaritem", 0, 0, 0, this._getClientHeight(), null, null, null, null, null, null, this);
            progressbaritem._initControlElementCssInfo();

            var border = progressbaritem._getCurrentStyleBorder();
            var padding = progressbaritem._getCurrentStylePadding();

            this._item_width = border ? (border.left._width + border.right._width) : 0;
            this._item_width += padding ? (padding.left + padding.right) : 0;

            if (this._item_iconwidth === undefined)
            {
                var item_icon = progressbaritem._icon || progressbaritem._getCSSStyleValue("icon");

                if (item_icon instanceof Object)
                    item_icon = item_icon.value;

                this._item_icon_url = item_icon;

                var imagesize = nexacro._getImageSize(item_icon, this._on_loadimage_item_icon, this);
                if (imagesize)
                {
                    this._item_iconwidth = imagesize.width;
                }
            }

            progressbaritem.destroy();
        }
    };

    _pProgressBar._createProgressBarItems = function (iscreateonly)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            if (this._p_pos <= 0)
            {
                if (this._p_progressendcap)
                {
                    this._p_progressstartcap.destroy();
                    this._p_progressstartcap = null;
                }
                if (this._p_progressendcap)
                {
                    this._p_progressendcap.destroy();
                    this._p_progressendcap = null;
                }
                this._clearProgressBarItems(true);

                this.on_apply_text();
                return;
            }
            else
            {
                this._createProgressStartCap(iscreateonly);
                this._createProgressEndCap(iscreateonly);
                this._createProgressBarItemTemp();
            }

            this._setSizeInfo();
            var barinfo = this._getBarInfo();

            //var barcount = barinfo[0];
            var barcurpos = barinfo[1];
            var barwidth = barinfo[2];

            var client_width = this._getClientWidth();
            var client_height = this._getClientHeight();
            var l, t = this._getClientTop(), w = 0;

            var blockgap = this._p_blockgap;
            if (blockgap == null)
                blockgap = 2;
            else if (blockgap < 0)
                blockgap = 0;
            var smooth = this._p_smooth;
            var direction = this._p_direction;

            //var win = this._getWindow();

            var baritem;
            var itemlist = this._progressbaritems;

            this._clearProgressBarItems(false, barinfo);


            if (direction == "backward")
            {
                if (this._endcap_width)
                    this._p_progressendcap.move(client_width - this._endcap_width, 0, this._endcap_width, client_height);
            }
            else
            {
                if (this._startcap_width)
                    this._p_progressstartcap.move(0, 0, this._startcap_width, client_height);
            }

            if (smooth)
            {
                if (direction == "backward")
                {
                    w = barwidth | 0;
                    l = client_width - this._endcap_width - barwidth;
                    if (this._startcap_width)
                        this._p_progressstartcap.move(l - this._startcap_width, t, this._startcap_width, client_height);
                }
                else
                {
                    l = this._startcap_width;   // left top position is 0 for forward direction
                    w = barwidth | 0;
                    if (this._endcap_width)
                        this._p_progressendcap.move(l + w, t, this._endcap_width, client_height);
                }

                baritem = itemlist[0];
                if (!baritem)
                {
                    baritem = new nexacro._ProgressBarItemControl("progressbaritem", l, t, w, client_height, null, null, null, null, null, null, this);
                    baritem.createComponent(iscreateonly);
                    baritem._setEventHandler("onclick", this.on_notify_progressbar_onclick, this);

                    itemlist[0] = baritem;
                }
                else
                    baritem.move(l, t, w, client_height);
            }
            else
            {  // block 처리일 때
                var i, blocksize = barwidth + blockgap;
                if (direction == "backward")
                {
                    l = client_width - this._endcap_width;
                    for (i = 0; i < barcurpos; i++)
                    {
                        baritem = itemlist[i];

                        l = client_width - this._endcap_width - (i * blocksize) - barwidth;
                        w = barwidth;

                        if (i == (barcurpos - 1) && (l - barwidth) <= 0)
                        {
                            w = client_width - this._startcap_width - this._endcap_width - (i * blocksize);
                            l = this._startcap_width;
                        }
                        if (!nexacro._isDesktop())
                        {
                            if (this._p_blockgap <= 0)
                            {
                                w = w + 1;
                            }
                        }
                        if (!baritem)
                        {
                            baritem = new nexacro._ProgressBarItemControl("progressbaritem_" + i, l, t, w, client_height, null, null, null, null, null, null, this);
                            baritem.createComponent(iscreateonly);
                            baritem._setEventHandler("onclick", this.on_notify_progressbar_onclick, this);
                            itemlist[i] = baritem;
                        }
                        else
                            baritem.move(l, t, w, client_height);
                    }

                    if (this._startcap_width)
                    {
                        this._p_progressstartcap.move(l - this._startcap_width, t, this._startcap_width, client_height);
                    }
                }
                else
                {

                    l = this._startcap_width;

                    var progressitem_totalwidth = client_width - this._startcap_width - this._endcap_width;
                    for (i = 0; i < barcurpos; i++)
                    {
                        baritem = itemlist[i];
                        w = barwidth;
                        l = (i * blocksize) + this._startcap_width;

                        if (i == (barcurpos - 1) && (l + barwidth) >= (progressitem_totalwidth))
                        {
                            w = client_width - this._endcap_width - l;
                        }
                        if (!nexacro._isDesktop())
                        {
                            if (this._p_blockgap <= 0)
                            {
                                w = w + 1;
                            }
                        }
                        if (!baritem)
                        {
                            baritem = new nexacro._ProgressBarItemControl("progressbaritem_" + i, l, t, w, client_height, null, null, null, null, null, null, this);
                            baritem.createComponent(iscreateonly);
                            baritem._setEventHandler("onclick", this.on_notify_progressbar_onclick, this);
                            itemlist[i] = baritem;
                        }
                        else
                            baritem.move(l, t, w, client_height);
                    }

                    if (this._endcap_width)
                    {
                        this._p_progressendcap.move(l + w, t, this._endcap_width, client_height);
                    }
                }
            }

            this.on_apply_text(this._p_text);

            if (itemlist.length > 0 && this._progressbartext)
            {
                var progressbartext_elem = this._progressbartext.getElement();
                control_elem.moveToPrevElement(progressbartext_elem, itemlist[itemlist.length - 1].getElement());
            }
        }
    };

    _pProgressBar._clearProgressBarItems = function (allclear, info)
    {
        var olditemcnt = this._progressbaritems.length;
        if (olditemcnt <= 0) return;
        var deletecnt = 0;

        if (!allclear)
        {
            var newitemcnt = info[1];
            if (olditemcnt > newitemcnt)
                deletecnt = olditemcnt - newitemcnt;
        }
        else
            deletecnt = olditemcnt;

        for (var i = 0; i < deletecnt; i++)
        {
            var item = this._progressbaritems.pop();
            if (item)
            {
                item.destroy();
            }
        }

    };

    _pProgressBar._update = function ()
    {
        this._createProgressBarItems(!this._is_created);
    };

    //===============================================================
    // nexacro.ProgressBar : Util Function
    //===============================================================
    _pProgressBar._setSizeInfo = function ()
    {
        if (this._startcap_iconwidth)
            this._startcap_width += this._startcap_iconwidth;

        if (this._endcap_iconwidth)
            this._endcap_width += this._endcap_iconwidth;

        if (this._item_iconwidth)
            this._item_width += this._item_iconwidth;
    };

    _pProgressBar._getBarInfo = function ()
    {
        var rtn = null;
        var barcount = 0;
        var barcurpos = 0;
        var barwidth = 0;

        var client_width = this._getClientWidth() - this._startcap_width - this._endcap_width;

        var pos = this._p_pos;
        var max = this._p_max;
        //var min = this._p_min;
        var per = pos / max;

        var smooth = this._p_smooth;
        var blocksize = this._p_blocksize;
        if (blocksize == null)
            blocksize = this._item_width ? this._item_width : 15;

        var blockgap = this._p_blockgap;
        if (blockgap == null)
            blockgap = 2;
        else if (blockgap < 0)
            blockgap = 0;

        if (smooth)
        {
            barcount = 1;
            barwidth = parseInt(client_width * per) | 0;
            barcurpos = 0;
        }
        else
        {
            barwidth = blocksize;
            barcount = Math.ceil(client_width / (barwidth + blockgap)) | 0;
            barcurpos = Math.floor(barcount * per);
        }

        rtn = [barcount, barcurpos, barwidth];
        try
        {
            return rtn;
        }
        finally
        {
            rtn = null;
        }
    };

    _pProgressBar = null;

    //===============================================================
    // nexacro._ProgressBarItemControl : Icon
    //===============================================================
    nexacro._ProgressBarItemControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro._Icon.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pProgressBarItemControl = nexacro._createPrototype(nexacro._Icon, nexacro._ProgressBarItemControl);
    nexacro._ProgressBarItemControl.prototype = _pProgressBarItemControl;
    _pProgressBarItemControl._type_name = "IconControl";
    _pProgressBarItemControl._is_subcontrol = true;
    _pProgressBarItemControl._is_focus_accept = false;

    _pProgressBarItemControl.on_getIDCSSSelector = function ()
    {
        return "progressbaritem";
    };

    _pProgressBarItemControl = null;
}

