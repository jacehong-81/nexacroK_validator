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

if (!nexacro.Div)
{
    //==============================================================================
    // nexacro.Div
    //==============================================================================
    nexacro.Div = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._p_form = new nexacro._InnerForm("form", 0, 0, width, height, null, null, null, null, null, null, this);
        this._p_form._initLayoutManager();
    };

    var _pDiv = nexacro._createPrototype(nexacro.Component, nexacro.Div);
    nexacro.Div.prototype = _pDiv;
    _pDiv._type_name = "Div";

    /* control */
    _pDiv._cell_elem = null;

    /* default properties */
    _pDiv._p_async = true;
    _pDiv._p_url = "";
    _pDiv._p_urlchangeeffect = "";
    _pDiv._p_text = "";
    _pDiv._p_textAlign = "center";
    _pDiv._p_verticalAlign = "middle";

    _pDiv._p_formscrollbarbarminsize = undefined;
    _pDiv._p_formscrollbarbaroutsize = undefined;
    _pDiv._p_formscrollbardecbuttonsize = undefined;
    _pDiv._p_formscrollbarincbuttonsize = undefined;
    _pDiv._p_formscrollbarsize = undefined;
    _pDiv._p_formscrollbartrackbarsize = undefined;
    _pDiv._p_formscrollbartype = undefined;
    _pDiv._p_formscrollindicatorsize = undefined;
    _pDiv._p_formscrolltype = undefined;

    /* internal variable */
    _pDiv._urlchangeeffect = null;
    _pDiv._is_loadedform = false;
    _pDiv._old_url = "";

    // for fittocontents
    _pDiv._fit_height = -1;
    _pDiv._fit_width = -1;

    /* status */
    _pDiv._apply_client_padding = false;
    _pDiv._is_simple_control = true;
    _pDiv._is_container = true;

    /* accessibility */
    _pDiv._p_accessibilityrole = "none";

    _pDiv._event_list = {
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
    _pDiv.on_create_contents = function ()
    {
        //this._calcFittocontentsSize();
        if (!this._p_url)
        {
            this._p_form.createComponent(true);
        }
        if (this._p_fittocontents != "none")
            this._on_apply_fittocontents();
    };

    _pDiv._applyElementVisible = function (v)
    {
        this._control_element.setElementDisplay(v ? "" : "none");
        this._applyScrollPos();

        if (!this._is_nc_control)
        {
            if (this._isFluidContainer() && !this._isFluidContainerCalculation() && !this._isSelfCalculationPosition())
                this._control_element.setElementLayoutFluidPos(v);
        }
    };

    _pDiv.on_created_contents = function (win)
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
        this._resetResizer(form._getVScrollBarSize(), form._getHScrollBarSize());
        this._recalcLayout();
    };

    _pDiv.on_destroy_contents = function ()
    {
        this._destroyTextElement();
        this._destroyFormControl();

        this._user_property_list = null;
    };

    _pDiv.on_create_contents_command = function ()
    {
        var str = "";

        return str;
    };

    _pDiv.on_attach_contents_handle = function (win)
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
        //this._calcFittocontentsSize(); //Check
        this.on_apply_text();
        this._resetResizer(form._getVScrollBarSize(), form._getHScrollBarSize());
        this._recalcLayout();
    };

    _pDiv.on_change_containerRect = function (width, height)
    {
        if (this._cell_elem)
        {
            this._cell_elem.setElementSize(width, height);
        }

        this._repositionResizer();
        this._recalcLayout();
    };

    _pDiv.on_change_containerPos = function (/*left, top*/)
    {
        //
    };

    //===============================================================
    // nexacro.Div : Override
    //===============================================================
    _pDiv.on_apply_prop_enable = function (v)
    {
        if (this._p_form)
        {
            this._p_form._setEnable(v);
        }

        if (this._p_resizer)
            this._p_resizer._setEnable(v);
    };

    _pDiv.on_apply_prop_resizertype = function ()
    {
        const form = this._p_form;
        const control_elem = this.getElement();
        if (control_elem && form)
        {
            this._resetResizer(form._getVScrollBarSize(), form._getHScrollBarSize());
            form._onResetScrollBar();
        }
    }

    _pDiv.on_apply_prop_resizerdirection = function ()
    {
        const form = this._p_form;
        const control_elem = this.getElement();
        if (control_elem && form)
        {
            this._resetResizer(form._getVScrollBarSize(), form._getHScrollBarSize());
            form._onResetScrollBar();
        }
    };

    _pDiv._cancelEvent = function (target_comp)
    {
        if (target_comp)
            target_comp._cancelEvent();
    };

    //===============================================================
    // nexacro.Div : Properties
    //===============================================================
    _pDiv._on_accessibility_apply_text = nexacro._emptyFn;
    _pDiv.on_apply_text = function (text)
    {
        var form = this._p_form;
        if (form && !form.getElement() || ((form._child_list && form._child_list.length > 0) || this._p_url) || !this._is_alive)
            return;

        var control_elem = this.getElement();
        if (control_elem)
        {
            if (!text)
                text = this._displaytext;

            var cell_elem = this._cell_elem;
            if (!cell_elem && text)
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
                cell_elem.setElementText(text);
            }

            this._on_accessibility_apply_text();
        }
    };

    _pDiv.set_url = function (v)
    {
        if (this._p_url != v)
        {
            this._old_url = this._p_url;
            this._p_url = v;
            this.on_apply_url();
        }
    };

    _pDiv.on_apply_url = function (reload)
    {
        var form = this._p_form;
        if (!form)
            return;

        var url = this._p_url;
        var confirm_message, pos;

        if (url && url.length > 0)
        {
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                manager.destroyLayoutContainerInfo(form);
            }

            if (this._is_loadedform && form._is_loaded && !reload)
            {
                confirm_message = this._on_beforeclose();
                if (this._checkAndConfirmClose(confirm_message) == false)
                {
                    this._p_url = this._old_url;
                    return;
                }

                var async = form._async;
                this._on_close();
                form.set_tooltiptext("");

                this._destroyFormControl();
                pos = this._getFormPosition();
                form = this._p_form = new nexacro._InnerForm("form", pos.left, pos.top, pos.width, pos.height, null, null, null, null, null, null, this);
                form._async = async;
                form.createComponent();

                this._is_loadedform = false;
            }

            // When set_url() before addChild() should handle null error in variable '_url'.
            // And loadForam() is process on_created_contents().Associated div1-1
            var _parent = this.parent;
            if (_parent != null)
            {
                while (!_parent._url)
                {
                    _parent = _parent.parent;
                }

                form.loadForm(url, this._p_async, true, _parent._url);
            }

            this._destroyTextElement();
        }
        else
        {
            if (form._is_loaded)
            {
                confirm_message = this._on_beforeclose();
                if (this._checkAndConfirmClose(confirm_message) == false)
                {
                    return;
                }

                this._on_close();
                form.set_tooltiptext("");

                this._is_loadedform = false;
            }

            this._destroyFormControl();

            pos = this._getFormPosition();
            form = this._p_form = new nexacro._InnerForm("form", pos.left, pos.top, pos.width, pos.height, null, null, null, null, null, null, this);
            form.createComponent();

            this._destroyTextElement();

            this.on_apply_text();
        }
    };

    _pDiv.set_urlchangeeffect = function (v)
    {
        this._p_urlchangeeffect = v;
        if (v)
        {
            if (this._urlchangeeffect == null || this._urlchangeeffect.value != v)
            {
                var urlchangeeffect = nexacro.TransitionEffectObject(v);
                this._urlchangeeffect = urlchangeeffect;
            }
        }
        else
        {
            if (this._urlchangeeffect)
            {
                this._urlchangeeffect = null;
            }
        }
    };

    _pDiv.set_async = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_async != v)
        {
            this._p_async = v;
            if (this._p_form)
                this._p_form._async = v;
        }
    };

    _pDiv._on_apply_formscroll = function ()
    {
        var form = this._p_form;
        if (form)
        {
            if (this._p_formscrollbarbarminsize !== undefined)
                form.on_apply_scrollbarbarminsize();
            if (this._p_formscrollbarbaroutsize !== undefined)
                form.on_apply_scrollbarbaroutsize();
            if (this._p_formscrollbardecbuttonsize !== undefined)
                form.on_apply_scrollbardecbuttonsize();
            if (this._p_formscrollbarincbuttonsize !== undefined)
                form.on_apply_scrollbarincbuttonsize();

            if (this._p_formscrollbarsize !== undefined || this._p_formscrollindicatorsize !== undefined)
                form.on_apply_scrollbarsize();

            if (this._p_formscrollbartrackbarsize !== undefined)
                form.on_apply_scrollbartrackbarsize();

            if (this._p_formscrollbartype !== undefined)
                this.on_apply_formscrollbartype();
            //if (this._p_formscrollindicatorsize !== undefined)
            //    form.on_apply_scrollindicatorsize();
            if (this._p_formscrolltype !== undefined)
                form.on_apply_scrolltype();
        }
    }

    _pDiv.on_apply_fittocontents = function ()
    {
        // 컨테이너 인포에 컨테이너사이징변경 여부를 명시
        // 해당 디비전 기준으로 상위 컨테이너 재계산
        // 처음 만들때는 속성만 바꾸고 이후 계산에서 처리
        // 어떤 div 컨테이너든간에 fit이 설정되면 fit이 아닌 컨테이너를 만나기 전까지 재계산을 해야함
        // 해당 기능은 모든 레이아웃 컨테이너 타입을 manager에서 일괄 처리
        if (this._p_form)
        {
            this._p_form._setFittocontents(this._p_fittocontents);
        }
        this._on_apply_fittocontents();
        var manager = nexacro._getLayoutManager();
        if (manager)
        {
            this._calced_container = false;

            manager.setContainerFitType(this._p_form, this.fittocontents)
            if (this._is_created)
            {
                manager.calcLayout(this._p_form);
            }
        }
    };

    _pDiv.set_padding = nexacro._emptyFn;

    _pDiv.set_formscrollbarbarminsize = function (formscrollbarbarminsize)
    {
        if (formscrollbarbarminsize !== undefined)
        {
            formscrollbarbarminsize = parseInt(formscrollbarbarminsize);
            if (isNaN(formscrollbarbarminsize) || formscrollbarbarminsize < 0)
                return;
        }

        if (this._p_formscrollbarbarminsize != formscrollbarbarminsize)
        {
            this._p_formscrollbarbarminsize = formscrollbarbarminsize;
            if (this._p_form)
                this._p_form.on_apply_scrollbarbarminsize(formscrollbarbarminsize);
            //nexacro.Component.prototype.set_scrollbarbarminsize.call(this._p_form, formscrollbarbarminsize);
        }
    };

    _pDiv.set_formscrollbarbaroutsize = function (formscrollbarbaroutsize)
    {
        if (formscrollbarbaroutsize !== undefined)
        {
            formscrollbarbaroutsize = parseInt(formscrollbarbaroutsize);
            if (isNaN(formscrollbarbaroutsize) || formscrollbarbaroutsize < 0)
                return;
        }

        if (this._p_formscrollbarbaroutsize != formscrollbarbaroutsize)
        {
            this._p_formscrollbarbaroutsize = formscrollbarbaroutsize;
            if (this._p_form)
                this._p_form.on_apply_scrollbarbaroutsize(formscrollbarbaroutsize);
            //nexacro.Component.prototype.set_scrollbarbaroutsize.call(this._p_form, formscrollbarbaroutsize);
        }
    };

    _pDiv.set_formscrollbardecbuttonsize = function (formscrollbardecbuttonsize)
    {
        if (formscrollbardecbuttonsize !== undefined)
        {
            formscrollbardecbuttonsize = parseInt(formscrollbardecbuttonsize);
            if (isNaN(formscrollbardecbuttonsize))
                return;
        }

        if (this._p_formscrollbardecbuttonsize != formscrollbardecbuttonsize)
        {
            this._p_formscrollbardecbuttonsize = formscrollbardecbuttonsize;
            if (this._p_form)
                this._p_form.on_apply_scrollbardecbuttonsize(formscrollbardecbuttonsize);
            //nexacro.Component.prototype.set_scrollbardecbuttonsize.call(this.form, formscrollbardecbuttonsize);
        }
    };

    _pDiv.set_formscrollbarincbuttonsize = function (formscrollbarincbuttonsize)
    {
        if (formscrollbarincbuttonsize !== undefined)
        {
            formscrollbarincbuttonsize = parseInt(formscrollbarincbuttonsize);
            if (isNaN(formscrollbarincbuttonsize))
                return;
        }

        if (this._p_formscrollbarincbuttonsize != formscrollbarincbuttonsize)
        {
            this._p_formscrollbarincbuttonsize = formscrollbarincbuttonsize;
            if (this._p_form)
                this._p_form.on_apply_scrollbarincbuttonsize(formscrollbarincbuttonsize);
            //nexacro.Component.prototype.set_scrollbarincbuttonsize.call(this.form, formscrollbarincbuttonsize);
        }
    };

    _pDiv.set_formscrollbarsize = function (formscrollbarsize)
    {
        if (formscrollbarsize !== undefined)
        {
            formscrollbarsize = parseInt(formscrollbarsize);
            if (isNaN(formscrollbarsize))
                return;
        }

        if (this._p_formscrollbarsize != formscrollbarsize)
        {
            this._p_formscrollbarsize = formscrollbarsize;
            if (this._p_form)
                this._p_form.on_apply_scrollbarsize(formscrollbarsize);
            //nexacro.Component.prototype.set_scrollbarsize.call(this.form, formscrollbarsize);
        }
    };

    _pDiv.set_formscrollbartrackbarsize = function (formscrollbartrackbarsize)
    {
        if (formscrollbartrackbarsize !== undefined)
        {
            formscrollbartrackbarsize = parseInt(formscrollbartrackbarsize);
            if (isNaN(formscrollbartrackbarsize) || formscrollbartrackbarsize < -1)
                return;
        }

        if (this._p_formscrollbartrackbarsize != formscrollbartrackbarsize)
        {
            this._p_formscrollbartrackbarsize = formscrollbartrackbarsize;
            if (this._p_form)
                this._p_form.on_apply_scrollbartrackbarsize(formscrollbartrackbarsize);
            //nexacro.Component.prototype.set_scrollbartrackbarsize.call(this.form, formscrollbartrackbarsize);
        }
    };

    _pDiv.set_formscrollbartype = function (v)
    {
        if (this._p_formscrollbartype != v)
        {
            this._p_formscrollbartype = v;
            this.on_apply_formscrollbartype();
        }
        //this.formscrollbartype = nexacro._toString(formscrollbartype).trim();    
        //nexacro.Component.prototype.set_scrollbartype.call(this.form, formscrollbartype);
    };

    _pDiv.on_apply_formscrollbartype = function ()
    {
        var v = nexacro._toString(this._p_formscrollbartype).trim();

        var new_vscrollbartype;
        var new_hscrollbartype;
        var arr = v.toLowerCase().split(" ");
        for (var i = 0; i < arr.length; i++)
        {
            switch (arr[i])
            {
                case "none": case "auto": case "fixed": case "autoindicator": case "indicator": case "default":
                    if (i == 0)
                        new_hscrollbartype = arr[i];
                    else if (i == 1)
                        new_vscrollbartype = arr[i];
                    break;
                default:
                    break;
            }
        }

        if (!new_hscrollbartype && !new_vscrollbartype)
        {
            this._hscrollbartype = undefined;
            this._vscrollbartype = undefined;
        }
        else
        {
            if (!new_hscrollbartype || new_hscrollbartype == "default")
                this._hscrollbartype = new_hscrollbartype = undefined;
            else
                this._hscrollbartype = new_hscrollbartype;

            if (!new_vscrollbartype)
                this._vscrollbartype = new_hscrollbartype;
            else if (new_vscrollbartype == "default")
                this._vscrollbartype = undefined;
            else
                this._vscrollbartype = new_vscrollbartype;
        }

        if (this._p_form)
            this._p_form.on_apply_scrollbartype();
    };

    _pDiv.set_formscrollindicatorsize = function (formscrollindicatorsize)
    {
        if (formscrollindicatorsize !== undefined)
        {
            formscrollindicatorsize = parseInt(formscrollindicatorsize);
            if (isNaN(formscrollindicatorsize))
                return;
        }

        if (this._p_formscrollindicatorsize != formscrollindicatorsize)
        {
            this._p_formscrollindicatorsize = formscrollindicatorsize;
            if (this._p_form)
                this._p_form.on_apply_scrollbarsize();
            //nexacro.Component.prototype.set_scrollindicatorsize.call(this.form, formscrollindicatorsize);
        }
    };

    _pDiv.set_formscrolltype = function (formscrolltype)
    {
        if (this._p_formscrolltype != formscrolltype)
        {
            this._p_formscrolltype = formscrolltype;
            if (this._p_form)
                this._p_form.on_apply_scrolltype(formscrolltype);
        }    //this.formscrolltype = nexacro.Component.prototype.set_scrolltype.call(this.form, formscrolltype);
    };

    _pDiv.set_semantictag = function (v)
    {
        if (this._p_semantictag != v)
            this._p_semantictag = v;
    }

    _pDiv._properties = [{ name: "async" }, { name: "semantictag" }, { name: "url" }, { name: "urlchangeeffect" }, { name: "text" }, { name: "textAlign" },
    { name: "verticalAlign" }, { name: "formscrollbarbarminsize" }, { name: "formscrollbarbaroutsize" }, { name: "formscrollbardecbuttonsize" }, { name: "formscrollbarincbuttonsize" },
    { name: "formscrollindicatorsize" }, { name: "formscrolltype" }, { name: "form", readonly: true }, { name: "formscrollbarsize" }, { name: "formscrollbartrackbarsize" }, { name: "formscrollbartype" }];

    nexacro._defineProperties(_pDiv, _pDiv._properties);


    //===============================================================
    // nexacro.Div : Methods
    //===============================================================
    _pDiv.destroy = function (callremovechild)
    {
        if (!this._is_alive)
            return;

        if (this._p_form && this._is_loadedform)
        {
            var confirm_message = this._on_beforeclose();
            if (this._checkAndConfirmClose(confirm_message) == false)
            {
                return;
            }

            this._on_close();
        }

        return nexacro.Component.prototype.destroy.call(this, callremovechild);
    };

    _pDiv.reload = function ()
    {
        this.on_apply_url(true);
    };

    _pDiv.getFocus = function ()
    {
        return this.parent ? this.parent.getFocus() : null;
    };

    _pDiv.getParentContext = function ()
    {
        return this.parent;
    };

    _pDiv.getSetter = function (name, fnname)
    {
        if (!this._user_property_list)
            this._user_property_list = [];
        this._user_property_list[name] = 1;
        if (!fnname)
            fnname = "set_" + name;
        var fn = this[fnname];
        if (fn)
        {
            return new nexacro.SetterBinder(this, name, fn);
        }
        return new nexacro.PropBinder(this, name);
    };

    _pDiv.addEventHandler = function (evt_id, func, target)
    {
        var retn = nexacro.Component.prototype.addEventHandler.call(this, evt_id, func, target);

        var form = this._p_form;

        switch (evt_id)
        {
            case "oncontextmenu":
                this._context_func = func;
                form._addEventHandler(evt_id, this._on_innerform_contextmenu, target);
                break;
        }
        return retn;
    };

    _pDiv.getOwnerFrame = function ()
    {
        return this._getOwnerFrame();
    };

    _pDiv.addChild = function (id, obj)
    {
        var form = this._p_form;
        var ret = form.addChild(id, obj);

        return ret;
    };

    _pDiv.insertChild = function (idx, id, obj)
    {
        var form = this._p_form;
        var ret = form.insertChild(idx, id, obj);

        return ret;
    };

    _pDiv.removeChild = function (id)
    {
        var obj = null;
        if (!this._is_alive && id === "form")
        {
            obj = this._p_form;
            if (obj)
            {
                var is_focused = false;
                var _window = this._getWindow();
                if (_window)
                {
                    is_focused = (_window._indexOfCurrentFocusPaths(obj) > -1);
                }

                if (obj._control_element)
                {
                    if (obj._control_element)
                    {
                        obj._control_element._removeFromContainer();
                    }

                    if (is_focused)
                    {
                        if (obj instanceof nexacro.Form)
                        {
                            // deactivate 처리
                            obj._on_deactivate();
                        }

                        // Focus된 컴포넌트가 사라지는 Case처리 
                        _window._removeFromCurrentFocusPath(obj, true);
                    }
                }
            }

            delete this[id];
        }
        else
        {
            var form = this._p_form;
            obj = form.removeChild(id);
        }

        return obj;
    };

    _pDiv.addLayout = function (name, obj)
    {
        var form = this._p_form;
        if (form)
            form.addLayout(name, obj);
    };

    _pDiv.setContents = function (str)
    {
        var ret = this._setContents(str);
        return ret;
    };

    _pDiv.scrollTo = function (x, y)
    {
        if (this._p_form)
            this._p_form.scrollTo(x, y);
    };

    //===============================================================
    // nexacro.Div : Event Handlers
    //===============================================================
    _pDiv._on_activate = function ()
    {
        nexacro.Component.prototype._on_activate.call(this);

        if (this._p_form)
            this._p_form._on_activate();

        return true;
    };

    _pDiv._on_deactivate = function ()
    {
        nexacro.Component.prototype._on_deactivate.call(this);

        if (this._p_form)
            this._p_form._on_deactivate();

        return true;
    };

    _pDiv._on_orientationchange = function (orientation)
    {
        if (this._p_form)
        {
            this._p_form._on_orientationchange(orientation);
        }
    };

    _pDiv._on_innerform_contextmenu = function (obj, e)
    {
        var target = this; // form;

        if (obj instanceof nexacro._InnerForm)
            obj.parent._context_func.call(target, obj.parent, e);
    };

    /* url load된 form의 beforeclose 처리 */
    _pDiv._on_beforeclose = function (root_closing_comp)
    {
        var form = this._p_form;
        if (!form || !this._is_loadedform)
            return;

        return form._on_beforeclose(root_closing_comp);
    };

    _pDiv._on_bubble_beforeclose = function (root_closing_comp, event_bubbles, fire_comp, refer_comp)
    {
        var p_form = this._getParentForm();
        if (p_form && p_form._on_bubble_beforeclose)
        {
            return p_form._on_bubble_beforeclose(root_closing_comp, event_bubbles, fire_comp, refer_comp);
        }
        return "";
    };

    /* url load된 form의 close 처리 */
    _pDiv._on_close = function ()
    {
        var form = this._p_form;
        if (!form || !this._is_loadedform)
            return true;

        form._on_close();
        this._is_loadedform = false;
    };

    _pDiv._on_bubble_close = function (event_bubbles, fire_comp, refer_comp)
    {
        var p_form = this._getParentForm();
        if (p_form && p_form._on_bubble_close)
        {
            return p_form._on_bubble_close(event_bubbles, fire_comp, refer_comp);
        }
    };

    //===============================================================
    // nexacro.Div : Logical part
    //===============================================================
    _pDiv._destroy = function (callremovechild)
    {
        // Framework 내부에서 destroy할 때는 _destroy 사용
        if (!this._is_alive)
            return;

        return this.destroyComponent(callremovechild);
    };

    _pDiv._checkAndConfirmClose = function (confirm_message)
    {
        if (this._p_form && this._is_loadedform)
        {
            return this._p_form._checkAndConfirmClose(confirm_message);
        }

        return true;
    };
    _pDiv._loadedForm = function ()
    {
        if (this._getLastFocused())
            this._last_focused = this._p_form;
        this._on_apply_formscroll();
        this._is_loadedform = true;
    };

    _pDiv._destroyTextElement = function ()
    {
        if (this._cell_elem)
        {
            this._cell_elem.destroy();
            this._cell_elem = null;
        }
    };

    _pDiv._destroyFormControl = function ()
    {
        if (this._p_form)
        {
            this._p_form._destroy();
            this._p_form = null;
        }
    };

    _pDiv._loadInclude = function (mainurl, url, notuseasync, service_url)
    {
        var asyncmode = this._p_async;
        var parent_context = this.getParentContext();   //Form            
        var is_async;

        if (asyncmode)
        {
            while (parent_context && parent_context._is_form)
            {
                is_async = parent_context._getAsync();
                if (!parent_context._is_fired_onload && is_async === false)
                {
                    asyncmode = false;
                    break;
                }
                parent_context = parent_context.getParentContext();
            }
        }

        if (!this._is_created)
        {
            // Div가 포함된 form을 로드할때 로드할 include는 async로 로드하고
            // 한꺼번에 callback 처리

            // 동적으로 만들어진 Div인 경우, 내부 include를 일부러 async로 처리하면 안되고
            // Div 본체와 동일하게 처리해야함.
            // if (!this.parent || !this.parent._is_created)
            //    asyncmode = true;
        }

        this._loadIncludeJS.call(this, mainurl, url, asyncmode, service_url);
    };

    _pDiv._loadIncludeJS = function (mainurl, url, asyncmode, service_url)
    {
        var service;
        if (service_url && service_url.length > 0)
            service = nexacro._getServiceObject(service_url);
        else
            service = nexacro._getServiceObject(url);

        this._load_manager.loadIncludeModule(url, null, asyncmode, service);
    };


    _pDiv._on_getFitSize = function ()
    {
        var total_width = 0;
        var total_height = 0;
        var form = this._p_form;
        //if (!this._is_created || !form)
        //    return [this._adjust_width, this._adjust_height];
        var ret = form._on_getFitSize();
        if (ret && ret[0] > 0 && ret[1] > 0)
        {
            var style_size = this._on_getFitSize_style();
            total_width = ret[0] + style_size[0];// + scroll_size[0];
            total_height = ret[1] + style_size[1];// + scroll_size[1];
        }

        return [total_width, total_height];
    };

    _pDiv._on_getAbsoluteContainerSize = function (contents_max_rect)
    {
        var ret = [0, 0];
        var c_w = 0;
        var c_h = 0;

        var border = this._getCurrentStyleBorder();

        //this._parseArrangeInfo(this._p_left, this._p_top, this._p_right, this._p_bottom, this._p_width, this._p_height);
        //this._calcArrangePosition();
        //this._adjustPosition();

        var fittype = this._p_fittocontents;
        switch (fittype)
        {
            case "width":
                c_w = border ? contents_max_rect[0] + border._getBorderWidth() : contents_max_rect[0];
                c_h = this._adjust_height;

                ret = [c_w, c_h];
                break;
            case "height":
                c_w = this._adjust_width;
                c_h = border ? contents_max_rect[1] + border._getBorderHeight() : contents_max_rect[1];

                ret = [c_w, c_h];
                break;
            case "both":
                c_w = border ? contents_max_rect[0] + border._getBorderWidth() : contents_max_rect[0];
                c_h = border ? contents_max_rect[1] + border._getBorderHeight() : contents_max_rect[1];

                ret = [c_w, c_h];
                break;
            case "none":
            default:
                ret = [this._adjust_width, this._adjust_height];
                break;
        }

        return ret;
    };
    _pDiv._on_getFluidHorizontalContainerSize = function (contents_max_rect)
    {
        var c_w = 0;
        var c_h = 0;

        var minwidth = this._minwidth;
        var maxwidth = this._maxwidth;
        var minheight = this._minheight;
        var maxheight = this._maxheight;

        var border = this._getCurrentStyleBorder();

        switch (this._p_fittocontents)
        {
            case "width":
                c_w = border ? contents_max_rect[0] + border._getBorderWidth() : contents_max_rect[0];
                c_h = this._adjust_height;
                if (this._getClientHeight() < contents_max_rect[1]) c_w += this._p_form._on_getFitSize_scroll()[0];
                break;
            case "height":
                c_w = this._adjust_width;
                c_h = border ? contents_max_rect[1] + border._getBorderHeight() : contents_max_rect[1];
                if (this._getClientWidth() < contents_max_rect[0]) c_h += this._p_form._on_getFitSize_scroll()[1];
                //if (c_w < contents_max_rect[0]) c_h += this._p_form._getHScrollBarSize();
                break;
            case "both":
                c_w = border ? contents_max_rect[0] + border._getBorderWidth() : contents_max_rect[0];
                c_h = border ? contents_max_rect[1] + border._getBorderHeight() : contents_max_rect[1];
                break;
            case "none":
            default:
                c_w = this._adjust_width;
                c_h = this._adjust_height;
                break;
        }

        if (minwidth != null && (c_w < minwidth))
            c_w = (minwidth < 0) ? 0 : minwidth;
        else if (maxwidth != null && (c_w > maxwidth))
            c_w = (maxwidth < 0) ? 0 : maxwidth;

        if (minheight != null && (c_h < minheight))
            c_h = (minheight < 0) ? 0 : minheight;
        else if (maxheight != null && (c_h > maxheight))
            c_h = (maxheight < 0) ? 0 : maxheight;

        return [c_w, c_h];
    };
    _pDiv._on_getFluidVerticalContainerSize = _pDiv._on_getFluidHorizontalContainerSize;

    _pDiv._on_getFluidTableContainerSize = function (contents_max_rect, contents_scroll_rect)
    {
        var c_w = 0;
        var c_h = 0;

        var minwidth = this._minwidth;
        var maxwidth = this._maxwidth;
        var minheight = this._minheight;
        var maxheight = this._maxheight;

        var border = this._getCurrentStyleBorder();

        switch (this._p_fittocontents)
        {
            case "width":
                c_w = border ? contents_max_rect[0] + border._getBorderWidth() : contents_max_rect[0];
                c_h = this._adjust_height;
                if (contents_scroll_rect && c_h < contents_scroll_rect[1]) c_w += this._p_form._getVScrollBarSize();
                break;
            case "height":
                c_w = this._adjust_width;
                c_h = border ? contents_max_rect[1] + border._getBorderHeight() : contents_max_rect[1];
                if (contents_scroll_rect && c_w < contents_scroll_rect[0]) c_h += this._p_form._getHScrollBarSize();
                break;
            case "both":
                c_w = border ? contents_max_rect[0] + border._getBorderWidth() : contents_max_rect[0];
                c_h = border ? contents_max_rect[1] + border._getBorderHeight() : contents_max_rect[1];
                if (contents_scroll_rect && c_w < contents_scroll_rect[0]) c_h += this._p_form._getHScrollBarSize();
                if (contents_scroll_rect && c_h < contents_scroll_rect[1]) c_w += this._p_form._getVScrollBarSize();
                break;
            case "none":
            default:
                c_w = this._adjust_width;
                c_h = this._adjust_height;
                break;
        }

        if (minwidth != null && (c_w < minwidth))
            c_w = (minwidth < 0) ? 0 : minwidth;
        else if (maxwidth != null && (c_w > maxwidth))
            c_w = (maxwidth < 0) ? 0 : maxwidth;

        if (minheight != null && (c_h < minheight))
            c_h = (minheight < 0) ? 0 : minheight;
        else if (maxheight != null && (c_h > maxheight))
            c_h = (maxheight < 0) ? 0 : maxheight;

        return [c_w, c_h];
    };

    _pDiv._closeForm = function ()
    {
        this._destroyFormControl();
    };

    _pDiv._recalcLayout = function ()
    {
        var form = this._p_form;
        if (form)
        {
            this._calced_container = false;
            var pos = this._getFormPosition();

            form._setPos(pos.left, pos.top);
            form._setSize(pos.width, pos.height);
        }
    };

    _pDiv._setContents = function (str)
    {
        // TODO parse xml
        var doc = nexacro._parseXMLDocument(str);
        var layouts = doc.getElementsByTagName("Layouts")[0];

        if (!layouts)
            layouts = doc;

        var layout = layouts.getElementsByTagName("Layout")[0];

        if (!layout)
            return false;

        var ret = true;

        //TODO : generate contents
        var node = layout.firstChild;

        while (node)
        {
            if (node.nodeType == 1)
            {
                var className = nexacro._getRegisterClass(node.tagName);
                if (!className)
                    return false;
                var fnConstructor = nexacro._executeGlobalEvalStr(className);
                if (!fnConstructor)
                    return false;

                if (fnConstructor.prototype && fnConstructor.prototype._is_component)
                {
                    //gen json type
                    var attr = {};
                    var attr_props = {};
                    for (var i = 0; i < node.attributes.length; i++)
                    {
                        var name = node.attributes[i].name;
                        if (/^(id|left|top|width|height|right|bottom|minwidth|maxwidth|minheight|maxheight|)$/.test(name))
                            attr[name] = node.attributes[i].value;
                        else
                            attr_props[name] = node.attributes[i].value;
                    }

                    var obj = new fnConstructor(attr["id"], attr["left"], attr["top"], attr["width"], attr["height"], attr["right"], attr["bottom"], attr["minwidth"], attr["maxwidth"], attr["minheight"], attr["maxheight"], this._p_form);

                    //set properties except constructor arguments
                    for (var v in attr_props)
                    {
                        if (obj["set_" + v])
                            obj["set_" + v](attr_props[v]);
                        else
                            obj[v] = attr_props[v];
                    }

                    // has subcontents
                    if (node.firstChild)
                    {
                        var childnode = node.firstChild;

                        var strXML = "";
                        while (childnode)
                        {
                            if (node.nodeType == 1)
                                strXML += nexacro._documentToXml(childnode);

                            childnode = childnode.nextSibling;
                        }
                        ret = obj._setContents(strXML);
                    }

                    if (!ret)
                        return ret;

                    this._p_form.addChild(obj.id, obj);

                    obj.show();
                }
            }
            node = node.nextSibling;
        }

        return ret;
    };

    _pDiv._onApplyTabletemplate = function (prev_layout_name)
    {
        var form = this._form;
        if (form)
        {
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                var layout = manager.getCurrentLayout(form);
                var tabletemplate = layout.tabletemplate;
                var fluidLayoutmanager = manager._fluidlayoutmanager;
                if (fluidLayoutmanager)
                {
                    fluidLayoutmanager._prev_tabletemplate = manager.getLayout(form, prev_layout_name ? prev_layout_name : "default")._tabletemplate;
                }
                var control_element = form.getElement();
                if (control_element)
                    control_element.setElementTableTemplate(tabletemplate);
                form._is_changed_tabletemplate = true;
                manager.calcFluidLayoutContents(form);
                form._is_changed_tabletemplate = false;
            }
        }
    };

    //===============================================================
    // nexacro.Div : Util Function
    //===============================================================
    _pDiv._getFormPosition = function ()
    {
        var left = 0;
        var top = 0;
        var width = 0;
        var height = 0;

        width = this._getClientWidth();
        height = this._getClientHeight();

        this._initControlElementCssInfo();

        return { left: left, top: top, width: width, height: height };
    };

    _pDiv._getComponentsByTaborder = function (/*p, b_include_all*/)
    {
        if (!this._p_form._isEnable() || !this._p_form._child_list || this._p_form._child_list.length == 0)
            return null;

        return [this._p_form];
    };

    _pDiv._searchNextTabFocus = function (current, bSearchFromFirst, opt_force_cycle, filter_type)
    {
        var ret = nexacro.FormBase.prototype._searchNextTabFocus.call(this, current, bSearchFromFirst, opt_force_cycle, filter_type);

        if (bSearchFromFirst && ret && ret[0] === this._p_form)
        {
            return [this];
        }

        return ret;
    };

    _pDiv._searchPrevTabFocus = function (current, bSearchFromLast, opt_force_cycle, filter_type)
    {
        var ret = nexacro.FormBase.prototype._searchPrevTabFocus.call(this, current, bSearchFromLast, opt_force_cycle, filter_type);

        if (bSearchFromLast && ret && ret[0] === this._p_form)
        {
            return [this];
        }

        return ret;

    };

    _pDiv._getTabOrderNext = function (current, direction, filter_type)
    {
        return nexacro.FormBase.prototype._getTabOrderNext.call(this, current, direction, filter_type);
    };

    _pDiv._getTabOrderFirst = function (filter_type)
    {
        return nexacro.FormBase.prototype._getTabOrderFirst.call(this, filter_type);
    };

    _pDiv._getTabOrderLast = function (filter_type)
    {
        return nexacro.FormBase.prototype._getTabOrderLast.call(this, filter_type);
    };

    _pDiv._getSizeInfo = function ()
    {
        var _size;
        var width = this._p_width;
        var height = this._p_height;
        var minwidth = this._minwidth;
        var minheight = this._minheight;
        var adjust_fit_height, adjust_fit_width;
        var parent_comp = this._getParentComponent();
        var parent_fittocontents = parent_comp ? parent_comp._p_fittocontents : "none";

        switch (this._p_fittocontents)
        {
            case "width":
                _size = this._on_getFitSize();
                width = _size[0];// : this._adjust_width;
                if (width > minwidth)
                    minwidth = width;
                adjust_fit_height = this._getAdjustFitPositionHeight(height, parent_fittocontents);
                if (adjust_fit_height != height)
                    this._fit_height = minheight = height = adjust_fit_height;
                break;
            case "height":
                _size = this._on_getFitSize();
                height = _size[1];// : this._adjust_height;
                if (height > minheight)
                    minheight = height;
                adjust_fit_width = this._getAdjustFitPositionWidth(width, parent_fittocontents);
                if (adjust_fit_width != width)
                    this._fit_width = minwidth = width = adjust_fit_width;
                break;
            case "both":
                _size = this._on_getFitSize();
                width = _size[0];// : this._adjust_width;
                if (width > minwidth)
                    minwidth = width;
                adjust_fit_height = this._getAdjustFitPositionHeight(height, parent_fittocontents);
                if (adjust_fit_height != height)
                    this._fit_height = minheight = height = adjust_fit_height;

                height = _size[1];
                if (height > minheight)
                    minheight = height;
                adjust_fit_width = this._getAdjustFitPositionWidth(width, parent_fittocontents);
                if (adjust_fit_width != width)
                    this._fit_width = minwidth = width = adjust_fit_width;
                break;
            default:
                adjust_fit_height = this._getAdjustFitPositionHeight(height, parent_fittocontents);
                if (adjust_fit_height != height)
                    this._fit_height = height = adjust_fit_height;
                //if (height > minheight)
                //    minheight = height;
                adjust_fit_width = this._getAdjustFitPositionWidth(width, parent_fittocontents);
                if (adjust_fit_width != width)
                    this._fit_width = width = adjust_fit_width;
                //if (width > minwidth)
                //    minwidth = width;
                break;
        }
        return [width, height, minwidth, minheight];
    };

    _pDiv.fetchStateData = function (includeall)
    {
        let form = this._p_form;
        if (!form || !this._is_loadedform)
            return;

        return form._processStateData(1, includeall);
    };

    _pDiv._processStateData = function (type, includeall)
    {
        let form = this._p_form;
        if (!form || !this._is_loadedform)
            return;

        return form._processStateData(type, includeall);
    };

    _pDiv.restoreStateData = function (includeall)
    {
        let form = this._p_form;
        if (!form || !this._is_loadedform)
            return;

        return form._processStateData(0, includeall);
    };
    _pDiv = null;
    //delete _pDiv;
}
