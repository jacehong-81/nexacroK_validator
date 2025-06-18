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

if (!nexacro.View)
{
    //==============================================================================
    // nexacro.View
    //==============================================================================
    nexacro.View = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._p_form = new nexacro._InnerForm("form", 0, 0, width, height, null, null, null, null, null, null, this);
        this._p_form._initLayoutManager();
    };

    var _pView = nexacro._createPrototype(nexacro.Div, nexacro.View);
    nexacro.View.prototype = _pView;
    _pView._type_name = "View";

    /* control */

    /* default properties */
    _pView._p_viewdataset = "";
    _pView._p_viewtype = "";
    _pView._p_sourceview = "";

    /* internal variable */
    _pView._viewdataset = null;

    /* status */
    _pView._ismodeltrigger = false;
    _pView._is_view = true;
    /* accessibility */

    _pView._event_list = {
        "onclick": 1, "ondblclick": 1, "onkillfocus": 1, "onsetfocus": 1,
        "onkeypress": 1, "onkeydown": 1, "onkeyup": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmousewheel": 1,
        "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
        "onmove": 1, "onsize": 1, "oncontextmenu": 1,
        "onvscroll": 1, "onhscroll": 1, "onmouseup": 1, "onmousedown": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1, "ondevicebuttonup": 1
    };

    //===============================================================
    // nexacro.Div : Create & Destroy & Update
    //===============================================================
    _pView.on_create_contents = function ()
    {
        this.on_apply_viewdataset(this._p_viewdataset);
        this.on_apply_sourceview();

        this._p_form.createComponent(true);
    };

    _pView.on_created_contents = function (win)
    {
        var form = this._p_form;

        form.on_created(win);

        this.on_apply_text();
        this._resetResizer(form._getVScrollBarSize(), form._getHScrollBarSize());
        this._recalcLayout();
    };

    _pView.on_destroy_contents = function ()
    {
        this._destroyTextElement();
        this._destroyFormControl();

        this._user_property_list = null;
        this._viewdataset = null;
    };

    _pView.on_attach_contents_handle = function (win)
    {
        var form = this._p_form;

        form.on_created(win);

        this.on_apply_text();
        this._resetResizer(form._getVScrollBarSize(), form._getHScrollBarSize());
        this._recalcLayout();
    };

    //===============================================================
    // nexacro.View : Override
    //===============================================================


    //===============================================================
    // nexacro.View : Properties
    //===============================================================
    _pView.set_viewtype = function (v)
    {
        if (this._is_created)
            return;

        this._p_viewtype = v;
    };

    //_pView.set_viewdataset = nexacro._emptyFn;  // readonly
    _pView.set_viewdataset = function (v)
    {
        if (this._is_created)
            return;

        this._p_viewdataset = v;
    };

    _pView.on_apply_viewdataset = function (v)
    {
        // TODO
        if (typeof v != "string")
        {
            this._viewdataset = v;
        }

        if (this._p_viewdataset != v)
        {
            if (!v)
            {
                this._viewdataset = null;
                this._p_viewdataset = "";
            }
            else
            {
                v = v.replace("@", "");
                var _v = this._findViewDataset(v);//
                this._viewdataset = _v ? _v : "";
                this._p_viewdataset = v;
            }
        }
        else if (this._p_viewdataset && !this._viewdataset)
        {
            this._setViewDatasetStr(this._p_viewdataset);//
        }
    };

    _pView.on_apply_text = function (v)
    {
        var form = this._p_form;
        if (form && ((form._child_list && form._child_list.length > 0)) || !this._is_alive)
            return;

        var control_elem = form.getElement();
        if (control_elem)
        {
            if (!v)
                v = this._displaytext;

            var cell_elem = this._cell_elem;
            if (!cell_elem && v)
            {
                var win = this._getWindow();
                cell_elem = this._cell_elem = new nexacro.TextBoxElement(control_elem);
                cell_elem.create(win);
            }

            if (cell_elem)
            {
                cell_elem.setElementSize(this._getClientWidth(), this._getClientHeight());
                cell_elem.setElementVerticalAlign(this._p_verticalAlign);
                cell_elem.setElementTextAlign(this._p_textAlign);
                cell_elem.setElementText(v);
            }
        }
    };

    _pView.set_sourceview = function (v)
    {
        if (this._is_created)
            return;

        this._p_sourceview = v;
    };

    _pView.on_apply_sourceview = function ()
    {
        if (this._p_sourceview && this.getSourceView())
        {
            var ds = this.getSourceView().getViewDataset();
            if (ds)
            {
                this._viewdataset = ds;
                this._p_form[this._p_viewdataset] = ds;
            }
        }
    };

    _pView.set_semantictag = function (v)
    {
        if (this._p_semantictag != v)
            this._p_semantictag = v;
    };

    _pView.set_url = nexacro._emptyFn;
    _pView.set_urlchangeeffect = nexacro._emptyFn;
    _pView.set_async = nexacro._emptyFn;

    _pView._properties = [{ name: "form", readonly: true }, { name: "viewdataset", readonly: true }, { name: "viewtype" }, { name: "sourceview" }, { name: "semantictag" }];
    nexacro._defineProperties(_pView, _pView._properties);
    //===============================================================
    // nexacro.View : Methods
    //===============================================================
    _pView.reload = nexacro._emptyFn;

    _pView.getViewDataset = function ()
    {
        if (this._viewdataset)
            return this._viewdataset;

        var sourceviewobj = this.getSourceView();
        if (this._p_sourceview && sourceviewobj)
            return sourceviewobj._findViewDataset(sourceviewobj._p_viewdataset);

        return this._findViewDataset(this._p_viewdataset);
    };

    _pView.getSourceView = function ()
    {
        if (this._p_sourceview)
        {
            return this._getSourceView(this._p_sourceview);
        }
        else
        {
            return;
        }
    }

    _pView._getSourceView = function (sourceview)
    {
        if (sourceview && this._p_parent)
        {
            return this._p_parent[sourceview];
        }
        else
        {
            return;
        }
    }

    //===============================================================
    // nexacro.View : Event Handlers
    //===============================================================
    _pView.on_notifytrigger = function (obj, info)
    {
        var parent = this._p_parent;
        if (!parent)
            return;

        if (info)
        {
            var manager = this._p_parent._trigger_manager;
            // 여기서 triggerview, triggertype을 info에 추가.
            var triggertype = info.eventid;
            for (var v in nexacro._trigger_type_table)
            {
                if (nexacro._trigger_type_table[v] == info.eventid)
                {
                    triggertype = v;
                    break;
                }
            }

            var triggerobj = obj;
            var triggerview = this;

            if (manager)
            {
                manager._notifyTrigger(triggertype, triggerobj, triggerview);
            }
        }
    };

    //===============================================================
    // nexacro.View : Logical part
    //===============================================================
    _pView._loadedForm = function ()
    {
        this._on_apply_formscroll();
    };

    _pView._setScript = function (script)
    {
        // TODO
    };

    _pView._setViewDatasetStr = function (str)
    {
        if (str)
        {
            str = str.replace("@", "");
            this._viewdataset = this._findViewDataset(str);
            this._p_viewdataset = str;
        }
        else
        {
            this._viewdataset = null;
            this._p_viewdataset = "";
        }
    };

    _pView._findViewDataset = function (id)
    {
        if (id && id.length > 0)
        {
            var ds = this[id];

            if (ds && (ds._type_name == "Dataset"))
            {
                return ds;
            }

            if (this._p_form)
            {
                ds = this._p_form.lookup(id);
                if (ds && (ds._type_name == "Dataset"))
                {
                    return ds;
                }
            }
        }

        return undefined;
    };

    _pView._setViewDataset = function (dsid)
    {
        this._p_viewdataset = dsid;
    };

    //===============================================================
    // nexacro.View : Util Function
    //===============================================================


    _pView = null;

    //nexacro._InnerForm ==> 소스 FormBase 로 이동

}
