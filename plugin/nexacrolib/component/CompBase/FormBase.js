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

if (!nexacro.Form)
{
    //===============================================================
    // nexacro.LayoutChangeEventInfo
    //===============================================================
    nexacro.LayoutChangeEventInfo = function (obj, id, curlayout_name, newlayout_name, cur_width, new_width, cur_height, new_height)
    {
        this.id = this.eventid = id || "onlayoutchanged";
        this.fromobject = this.fromreferenceobject = obj;

        this.bubbles = true;

        this.oldlayout = curlayout_name;
        this.newlayout = newlayout_name;
        this.oldlayoutwidth = cur_width;
        this.newlayoutwidth = new_width;
        this.oldlayoutheight = cur_height;
        this.newlayoutheight = new_height;
    };

    var _pLayoutChangeEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.LayoutChangeEventInfo);
    nexacro.LayoutChangeEventInfo.prototype = _pLayoutChangeEventInfo;

    _pLayoutChangeEventInfo._type_name = "LayoutChangeEventInfo";

    _pLayoutChangeEventInfo = null;


    //===============================================================
    // nexacro.DeviceButtonEventInfo
    //===============================================================
    nexacro.DeviceButtonEventInfo = function (obj, id, button, from_comp, from_refer_comp)
    {
        this.id = this.eventid = id || "ondevicebuttonup";
        this.fromobject = from_comp || obj;
        this.fromreferenceobject = from_refer_comp || obj;
        this.button = button;
        this._prevented = false;
        this.cancelable = true;
        this.bubbles = true;
    };
    var _pDeviceButtonEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.DeviceButtonEventInfo);
    nexacro.DeviceButtonEventInfo.prototype = _pDeviceButtonEventInfo;

    _pDeviceButtonEventInfo._type_name = "DeviceButtonEventInfo";

    _pDeviceButtonEventInfo = null;

    //==============================================================================
    // nexacro.TriggerManager
    //==============================================================================
    nexacro.TriggerManager = function (form)
    {
        nexacro.Object.call(this);

        /* internal variable */
        this._form = form;
        this._triggers = { "len": 0 };
        this._inittriggers = [];
    };

    var _pTriggerManager = nexacro.TriggerManager.prototype = nexacro._createPrototype(nexacro.Object, nexacro.TriggerManager);
    _pTriggerManager._type_name = "TriggerManager";

    _pTriggerManager.destroy = function ()
    {
        this._form = null;
        this._triggers = null;
        this._inittriggers = null;

        nexacro.Object.prototype.destroy.call(this);
    };

    //===============================================================
    // nexacro.TriggerManager : Logical Part
    //===============================================================
    _pTriggerManager._settriggerinfo = function (contents)
    {
        if (!contents)
            return;

        var len = contents.length;
        var triggerobj;

        for (var i = 0; i < len; i++)
        {
            triggerobj = contents[i].triggerobj;

            if (nexacro._isArray(this._triggers[triggerobj]))
            {
                this._triggers[triggerobj].push(contents[i]);
            }
            else
            {
                this._triggers[triggerobj] = [contents[i]];
            }
        }
        this._triggers.len = len;
        this._inittriggers = contents;
    };

    _pTriggerManager.inittriggerinfo = function ()
    {
        var triggers = this._inittriggers;
        if (!triggers || triggers.len <= 0)
            return;

        var parent = this._form;
        if (!parent)
            return;

        var triggertype;
        var triggerobj;
        var triggerview;

        for (var i = 0; i < triggers.length; i++)
        {
            triggertype = nexacro._trigger_type_table[triggers[i].triggertype];
            if (triggertype)
            {
                if (triggertype == "onmodelloadsuccess" || triggertype == "onmodelloadfail")
                {
                    triggerview = this._getTriggerView(triggers[i].triggerview);
                    triggerview._ismodeltrigger = true;
                }
                else
                {
                    triggerview = this._getTriggerView(triggers[i].triggerview);
                    if (triggerview && triggertype == "onload")
                        triggerobj = triggerview;
                    else
                        triggerobj = this._getTriggerObj(triggerview, triggers[i].triggerobj);

                    if (triggerview && triggerobj) 
                    {
                        if (triggerview.on_notifytrigger && triggerobj._findEventHandler(triggertype, triggerview.on_notifytrigger, triggerview))
                            triggerobj._addEventHandler(triggertype, triggerview.on_notifytrigger, triggerview);
                        //triggerview._addEventHandler("onnotifytrigger", parent._trigger_manager.on_notifytrigger, parent._trigger_manager);
                    }
                }
            }
        }
    };

    _pTriggerManager._getTriggerView = function (obj)
    {
        var form = this._form;
        if (!form)
            return;

        var triggerview = obj;
        var targetview = null;
        var ret = null;

        targetview = form[triggerview];

        if (!targetview)
        {
            targetview = form;
            // script 코딩이 되지 않기 때문에 targetview는 반드시 View나 Form이다
        }

        if (targetview._is_view || targetview._is_form)
            ret = targetview;

        return ret;
    };

    _pTriggerManager._getTriggerObj = function (obj, triggerobj)
    {
        var form = this._form;
        if (!form)
            return;

        var triggerview = obj;
        var targetobj = null;

        if (!triggerview || !triggerobj)
            return;

        if (triggerview._is_view)
        {
            targetobj = triggerview._p_form[triggerobj];
        }
        else if (triggerview._is_form)
        {
            targetobj = triggerview[triggerobj];
        }

        if (targetobj === undefined)
        {
            if (triggerview.name == triggerobj)
                targetobj = triggerview;
        }

        return targetobj;
    };

    _pTriggerManager._findTrigger = function (triggertype, triggerobj, triggerview)
    {
        var triggers = this._triggers;
        var targetobj = triggers[triggerobj];
        var targettrigger = [];

        if (!targetobj)
            return;
        // 같은 triggertype, triggerview, triggerobj가 있을 수 있으므로 list로 전달해야함.
        for (var i = 0; i < targetobj.length; i++)
        {
            if (targetobj[i].targetaction)
            {
                if (triggertype == targetobj[i].triggertype && triggerview == targetobj[i].triggerview)
                {
                    targettrigger.push(targetobj[i]);
                }
            }
        }

        return targettrigger;
    };

    _pTriggerManager._getAction = function (straction)
    {
        var form = this._form;
        if (!straction || !form)
            return undefined;

        straction = straction.toString();
        var ret = form[straction];

        if (ret && ret instanceof nexacro.Action)
            return ret;

        return undefined;

    };

    _pTriggerManager._notifyTrigger = function (triggertype, triggerobj, triggerview)
    {
        if (!triggertype || !triggerobj || !triggerview)
            return;

        // triggertype은 Form에서 바꿔서 전달.
        var targettrigger = this._findTrigger(triggertype, triggerobj.name, triggerview.name);
        if (!targettrigger || targettrigger.length <= 0)
            return;

        var len = targettrigger.length;
        var ret = true;

        for (var i = 0; i < len; i++)
        {
            if (targettrigger[i].condition)
            {
                var condition = targettrigger[i].condition;
                var exprfn = this._createExprFunc(condition, triggerview._viewdataset);

                ret = exprfn.call(this._form, triggerview, triggerobj, this._form);
            }

            if (ret)
            {
                var action = this._getAction(targettrigger[i].targetaction);
                if (action)
                    action.run();
            }
            else
                ret = true;
        }
    };

    _pTriggerManager._createExprFunc = function (expr_str, ds)
    {
        if (expr_str == null)
            return nexacro._NullFn;

        var parser = new nexacro.ExprParser();
        var conv_expr = expr_str;
        if (ds)
            conv_expr = parser.makeExpr(ds, expr_str);

        var exprfn = nexacro._createInlineFunc(conv_expr, ["triggerview", "triggerobj", "form"]);
        return exprfn;
    };

    _pTriggerManager = null;

    //==============================================================================
    // nexacro.BindingvaluechangedEventInfo
    //==============================================================================
    nexacro.BindingValueChangedEventInfo = function (obj, id, row, col, colidx, columnid, oldvalue, newvalue)
    {
        this.id = this.eventid = id || "onbindingvaluechanged";
        this.fromobject = this.fromreferenceobject = obj;

        this.row = row;
        this.col = col;
        this.colidx = colidx;
        this.columnid = columnid;
        this.oldvalue = oldvalue;
        this.newvalue = newvalue;
    };
    var _pBindingValueChangedEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.BindingValueChangedEventInfo);
    nexacro.BindingValueChangedEventInfo.prototype = _pBindingValueChangedEventInfo;
    _pBindingValueChangedEventInfo._type_name = "BindingValueChangedEventInfo";

    _pBindingValueChangedEventInfo = null;

    //==============================================================================
    // nexacro.BindItem
    //==============================================================================
    nexacro.BindItem = function (name, compid, propid, dsid, columnid)
    {
        nexacro.Object.call(this);
        this._p_name = name || "";
        this._p_compid = compid || "";
        this._p_propid = propid || "";
        this._p_datasetid = dsid || "";
        this._p_columnid = columnid || "";

        /* internal variable */
        this._en_type = 1; // readonly
        this._dataset = null;
        this._comp = null;
    };

    var _pBindItem = nexacro.BindItem.prototype = nexacro._createPrototype(nexacro.Object, nexacro.BindItem);
    _pBindItem._type_name = "BindItem";

    //==============================================================================
    // nexacro.BindItem : Properties
    //==============================================================================
    //_pBindItem.set_name = function (v)
    //{
    //    if (v && this.name != v)
    //    {
    //        this.name = v;
    //    }
    //};

    _pBindItem.set_compid = function (v)
    {
        if (v && this._p_compid != v)
        {
            this._p_compid = v;
        }
    };

    _pBindItem.set_propid = function (v)
    {
        if (v && this._p_propid != v)
        {
            this._p_propid = v;
        }
    };

    _pBindItem.set_datasetid = function (v)
    {
        if (v && this._p_datasetid != v)
        {
            this._p_datasetid = v;
        }
    };

    _pBindItem.set_columnid = function (v)
    {
        if (v && this._p_columnid != v)
        {
            this._p_columnid = v;
        }
    };

    _pBindItem._properties = [
        { name: "compid" },
        { name: "propid" },
        { name: "datasetid" },
        { name: "columnid" },
    ];

    nexacro._defineProperties(_pBindItem, _pBindItem._properties);
    //==============================================================================
    // nexacro.BindItem  : Methods
    //==============================================================================
    _pBindItem.init = function (name, compid, propid, datasetid, columnid)
    {
        this.set_name(name);
        this.set_compid(compid);
        this.set_propid(propid);
        this.set_datasetid(datasetid);
        this.set_columnid(columnid);
    };

    _pBindItem.destroy = function ()
    {
        this._dataset = null;
        this._comp = null;

        nexacro.Object.prototype.destroy.call(this);

        return true;
    };

    _pBindItem.bind = function ()
    {
        if (this._p_parent && !this._p_parent._is_loading)
        {
            if (this._p_compid == "" || this._p_propid == "" || this._p_datasetid == "" || this._p_columnid == "") return;
            this._p_parent._bind_manager._setBinditem(this, false);
            this._p_parent._bind_manager._notify(this);
        }
    };

    //===============================================================
    // nexacro.ScrollBarControl : Logical Part
    //===============================================================
    _pBindItem._checkType = function (propid)
    {
        var bindprops = propid;
        if (bindprops && typeof (bindprops) == "object")
        {
            for (var i = 0; i < bindprops.length; i++)
            {
                propid = bindprops[i];

                if (typeof propid == "string" && propid == this._p_propid)
                {
                    this._en_type = 2;
                    break;
                }
            }
        }
        else
        {
            if (typeof propid == "string" && propid == this._p_propid)
            {
                this._en_type = 2;
            }
        }
    };
    _pBindItem = null;

    //==============================================================================
    // nexacro.BindManager
    //==============================================================================
    nexacro.BindManager = function (form)
    {
        nexacro.Object.call(this);
        this.datasets = {};
        this.exception = "";

        /* internal variable */
        this._form = form;
    };

    var _pBindManager = nexacro.BindManager.prototype = nexacro._createPrototype(nexacro.Object, nexacro.BindManager);

    _pBindManager._type_name = "BindManager";


    _pBindManager.destroy = function ()
    {
        this.datasets = null;
        this._form = null;

        nexacro.Object.prototype.destroy.call(this);
    };

    //===============================================================
    // nexacro.BindManager : Event Handlers
    //===============================================================
    /*_pBindManager.exception;*/
    _pBindManager.on_changevalue = function (obj, e)
    {
        var prop_id = e.propid;
        var bind_item = this._findBindItem(obj, prop_id);
        var val = e.val;
        if (bind_item && bind_item._en_type == 2)
        { //CYBIND_TYPE_SIMPLE
            // found
            this.exception = obj;

            var ds = bind_item._dataset;
            var row_idx = ds._p_rowposition;
            var col = ds.getColIndex(bind_item._p_columnid);
            if (col !== undefined)
            {
                var ret = ds.setColumn(row_idx, col, val);
                if (ret == true)
                {
                    /*
                    var real_value = ds.getColumn(row_idx, col);
                    if (real_value != val)
                    {
                        val = real_value;
                    }
                    */
                    this.exception = null;
                    return true;
                }
                else
                {
                    this.exception = null;
                    return false;
                }
            }
        }
        this.exception = null;
        return true;
    };

    //Dataset Event
    //////////////////////////////////////////////////////////////////////
    _pBindManager.on_binddestroy = function (obj, e)
    {
        if (e.reason == 91) //nexacro.Dataset.REASON_UNBINDSOURCE  //don't fire userevent
        {
            if (obj._p_parent != this._form)
            {
                if (this._form)
                {
                    var _form = this._form;
                    var binds = _form._p_binds;
                    var len = binds.length;

                    for (var i = 0; i < len; i++)
                    {
                        var bindname = binds.get_id(i);
                        _form._bind_manager._setBinditem(binds.get_item(bindname), true);
                        _form[bindname] = null;
                    }
                }
            }
        }
    };

    _pBindManager.on_valuechanged = function (obj, e)
    {

        var ds = obj;
        var row = e.row;
        var col = e.col;
        var col_id = e.columnid;
        var val = e.newvalue;
        if (ds.rowposition == row || row < 0)
        {
            var ret = false;
            if (col < 0) ret = this._notifyAll(ds.name, null, -1, true, null);
            else ret = this._notifyAll(ds.name, col_id, col, false, val);
            var form = this._form;
            if (form)
                form._on_notify_onbindingvaluechanged(obj, e);
            return ret;
        }
        return true;
    };


    //===============================================================
    // nexacro.BindManager : Logical Part
    //===============================================================
    _pBindManager._delayBinds = function ()
    {
        var len = this._form._p_binds.length;
        for (var sx = 0; sx < len; sx++)
        {
            var bind_item = this._form._p_binds[sx];
            if (bind_item._dataset)
                continue;

            this._setBinditem(bind_item, false);
            this._notify(bind_item);
        }
    };

    _pBindManager._setBinditem = function (bind_item, close_flag)
    {
        if (!bind_item) return;

        //var binds = this._form.binds;
        var ds_id = bind_item._p_datasetid;

        var ds = bind_item._dataset;
        var comp = bind_item._comp;
        if (!bind_item._dataset)
        {
            var view = this._form._p_parent;
            var form = this._form;
            if (view && view.getSourceView && view.getSourceView())
            {
                var sourceview = view.getSourceView();
                form = sourceview._p_form;
                ds_id = sourceview._p_viewdataset;
                ds = form._getDatasetObject(ds_id);
                // bind_item._p_datasetid = ds_id;
            }
            else
            {
                ds = form._getDatasetObject(bind_item._p_datasetid);
            }
        }

        if (!bind_item._comp)
        {
            if (this._form._findChildObject)
                comp = this._form._findChildObject(bind_item._p_compid);
        }

        if (!ds || !comp) return;

        if (!close_flag)
        {
            bind_item._dataset = ds;
            bind_item._comp = comp;
            bind_item._checkType(comp.on_getBindableProperties());

            if (this.datasets[ds_id])
            {
                this.datasets[ds_id].push(bind_item);
            }
            else
            {
                this.datasets[ds_id] = [];
                this.datasets[ds_id].push(bind_item);
                ds.setEventHandler("onvaluechanged", this.on_valuechanged, this);
                ds._addEventHandler("onload", this.on_binddestroy, this);
            }

            // assign event
            if (!comp._bind_event)
            {
                comp._bind_event = new nexacro.EventListener("onbinditem");
                comp._bind_event._setHandler(this, this.on_changevalue);
            }
        }
        else
        {
            if (this.datasets[ds_id])
            {
                var cidx = nexacro._indexOf(this.datasets[ds_id], bind_item);
                if (cidx > -1)
                {
                    this.datasets[ds_id].splice(cidx, 1);
                    if (this.datasets[ds_id].length == 0)
                    {
                        ds.removeEventHandler("onvaluechanged", this.on_valuechanged, this);
                        delete this.datasets[ds_id];
                    }
                }
            }
            if (comp._bind_event)
            {
                comp._bind_event._removeHandler(this, this.on_changevalue);
                delete comp._bind_event;
            }
        }

    };

    _pBindManager._findBindItem = function (comp, propid)
    {
        for (var sx = 0; sx < this._form._p_binds.length; sx++)
        {
            var bind_item = this._form._p_binds[sx];
            if (bind_item._comp == comp && bind_item._p_propid == propid && bind_item._p_datasetid && bind_item._p_columnid)
            {
                return bind_item;
            }
        }
        return null;
    };

    _pBindManager._dettachSBindItem = function (comp)
    {
        if (!comp._bind_event) return;

        comp._bind_event._removeHandler(this);
        var binds = this._form._p_binds;
        var cnt = binds.length;
        for (var i = 0; i < cnt; i++)
        {
            if (binds[i]._comp == comp)
            {
                var datasetid = binds[i]._p_datasetid;
                if (this.datasets[datasetid])
                {
                    var cidx = nexacro._indexOf(this.datasets[datasetid], binds[i]);
                    if (cidx > -1)
                    {
                        this.datasets[datasetid][cidx].destroy();
                        this.datasets[datasetid].splice(cidx, 1);
                    }
                    binds[i]._comp = null;
                }
            }
        }
    };

    _pBindManager._notify = function (bindItem)
    {
        var ds = bindItem._dataset;
        var comp = bindItem._comp;
        var col;
        if (ds && comp)
        {
            var row_idx = ds.rowposition;

            if (bindItem._en_type == 2)
            { // CYBIND_TYPE_SIMPLE
                if (comp._p_enable && comp._p_parent._isEnable())
                {
                    if (row_idx < 0)
                    {
                        comp._setEnable(false);
                    }
                    else
                    {
                        comp._setEnable(true);
                    }
                }
                col = ds.getColIndex(bindItem._p_columnid);
                if (col >= 0 && comp.on_change_bindSource)
                {
                    comp.on_change_bindSource(bindItem._p_propid, bindItem._dataset, row_idx, col);
                }
            }
            else
            { // read only type
                if (bindItem._p_columnid && bindItem._p_columnid != "")
                {
                    col = ds.getColIndex(bindItem._p_columnid);
                    var val = ds.getColumn(row_idx, col);
                    if (bindItem._p_propid)
                    {
                        if (comp["set_" + bindItem._p_propid])
                            comp["set_" + bindItem._p_propid](val);
                    }
                }
            }
        }
    };

    _pBindManager._notifyAll = function (ds_id, col_id, col, all_flag, val)
    {
        var arr_bind = this.datasets[ds_id];
        var bind_item = null;
        var row_idx = -1;

        if (!arr_bind)
            return true;

        for (var sx = 0; sx < arr_bind.length; sx++)
        {
            bind_item = arr_bind[sx];
            if (!bind_item._dataset)
            {
                continue;
            }

            if (bind_item._p_columnid == "")
            {
                continue;
            }

            var ds = bind_item._dataset;
            row_idx = ds.rowposition;
            var comp = bind_item._comp;

            if (comp && comp._is_alive)
            {
                var parent = comp._is_group ? comp._group_panel : comp._p_parent;
                if (bind_item._en_type == 2)
                { //CYBIND_TYPE_SIMPLE
                    if (all_flag)
                    {
                        if (comp._p_enable && parent._isEnable())
                        {
                            if (row_idx < 0)
                            {
                                comp._setEnable(false);
                            }
                            else
                            {
                                comp._setEnable(true);
                            }
                        }

                        col = ds.getColIndex(bind_item._p_columnid);

                        if (col >= 0)
                        {
                            if (comp.on_change_bindSource)
                                comp.on_change_bindSource(bind_item._p_propid, bind_item._dataset, row_idx, col);
                        }
                        else
                        {
                            if (comp.on_init_bindSource)    // 바인딩된 dataset이 변경되어 바인딩이 끊어지는 경우 갱신이 필요함. 
                                comp.on_init_bindSource(bind_item._p_columnid, bind_item._p_propid, bind_item._dataset);
                        }
                    }
                    else
                    {
                        if (col >= 0)
                        {
                            if (bind_item._p_columnid == col_id && comp.on_change_bindSource)
                                comp.on_change_bindSource(bind_item._p_propid, bind_item._dataset, row_idx, col);
                        }
                        else
                        {
                            if (bind_item._p_columnid == col_id && comp.on_init_bindSource)    // 바인딩된 dataset이 변경되어 바인딩이 끊어지는 경우 갱신이 필요함. 
                                comp.on_init_bindSource(bind_item._p_columnid, bind_item._p_propid, bind_item._dataset);
                        }
                    }
                }
                else
                { // read only type
                    var val0;
                    if (all_flag)
                    {
                        col = ds.getColIndex(bind_item._p_columnid);
                        val0 = ds.getColumn(row_idx, col);
                    }
                    else
                    {
                        if (col_id == bind_item._p_columnid)
                        {
                            val0 = val;
                        }
                        else
                        {
                            continue;
                        }
                    }
                    if (bind_item._p_propid)
                    {
                        if (comp["set_" + bind_item._p_propid])
                            comp["set_" + bind_item._p_propid](val0);
                    }
                }
            }
        }
        return true;
    };

    _pBindManager = null;

    //==============================================================================
    // nexacro.FormBase 
    //==============================================================================
    nexacro.FormBase = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._refform = this;

        this._p_all = new nexacro.Collection();
        this._p_components = new nexacro.Collection();
        this._p_objects = new nexacro.Collection();
        this._p_binds = new nexacro.Collection();

        this._bind_manager = new nexacro.BindManager(this);
        this._load_manager = new nexacro._LoadManager(this);
        this._timerManager = new nexacro._TimerManager(this);

        this._child_list = [];							// components의 Array 형태
        this._hotkey_list = [];							// Hotkey를 사용하는 Component + Hotkey정보
        this._includescriptlist = [];					// Form에서 inclue로 포함한 Script List
        this._load_callbacklist = [];					// 통신 sync call시 application fire_onload 후에 호출해줘야 되는 subform list
        this._init_block_node = null;                   // MFE block node
    };

    var _pFormBase = nexacro.FormBase.prototype = nexacro._createPrototype(nexacro.Component, nexacro.FormBase);
    _pFormBase._type_name = "FormBase";

    /* control */
    _pFormBase._p_stepselector = null;

    /* default properties */
    _pFormBase._p_scrollbars = "autoboth";
    _pFormBase._p_dragscrolltype = "all";

    /* internal variable */
    _pFormBase._url = "";		// Form Full Url
    _pFormBase._orgurl = "";	// Form Original Url
    _pFormBase._base_url = "";	// Form Base Url
    _pFormBase._async = true;
    _pFormBase._asyncformload = true;

    _pFormBase._hittest_type = "";
    _pFormBase._last_focused = null;
    _pFormBase._obj_mousemove = null;
    _pFormBase._delayedfocuscomp = null;

    /* status */
    _pFormBase._is_form = true;
    _pFormBase._is_loaded = false;
    _pFormBase._is_completed = false;
    _pFormBase._is_scrollable = true;

    _pFormBase._searchNextHeadingFocus = nexacro._emptyFn;
    _pFormBase._searchPrevHeadingFocus = nexacro._emptyFn;
    _pFormBase._getHeadingOrderNext = nexacro._emptyFn;
    _pFormBase._getHeadingOrderFirst = nexacro._emptyFn;
    _pFormBase._getHeadingOrderLast = nexacro._emptyFn;
    _pFormBase._waitcomp = null;
    _pFormBase._ref_comm = 0;
    //===============================================================
    // nexacro.FormBase : Create & Destroy & Update
    //===============================================================
    _pFormBase.on_create = nexacro._emptyFn;

    _pFormBase._initControlElementLayoutProps = function ()
    {
        var control_elem = this.getElement();

        this._calcArrangePosition();
        this._adjustPosition();
        if (this._is_container)
            this._calcBasisSize();

        control_elem.setElementPosition(this._adjust_left, this._adjust_top);
        control_elem.setElementSize(this._adjust_width, this._adjust_height);
    };

    _pFormBase.on_create_contents = function ()
    {
        var comps = this._p_components;
        var len = comps.length;

        for (var i = 0; i < len; i++)
        {
            var comp = comps[i];
            comp.createComponent(true);
        }
    };

    _pFormBase.on_created_contents = function (win)
    {
        var len = this._p_objects.length;
        var i;
        for (i = 0; i < len; i++)
        {
            this._p_objects[i].on_created();
        }

        if (this._cssclass_exprfn)
        {
            nexacro._toString(this._cssclass_exprfn.call(null, this));
        }

        // TODO LAYOUT
        // Layout이 적용된 Component String ( position, width, height 등등 )
        nexacro._createdContents(this);

        if (this._p_binds)
        {
            for (i = 0; i < this._p_binds.length; i++)
            {
                this._p_binds[i].bind();
            }
        }

        if (this._p_stepselector)
        {
            this._p_stepselector.on_created(win);
        }

        this.resetScroll();

        if (this._is_scrollable)
        {
            var control_elem = this._control_element;
            if (control_elem && this._p_stepselector)
                control_elem.setElementHScrollPos(control_elem.client_width * control_elem._step_index);
        }

        nexacro._refreshWindow(this._getWindow().handle);
        if (this._env._p_enableaccessibility && this._env._a11ytype == 2 && nexacro._Browser == "Chrome")
        {
            this._setAccessibilityStatLive("off");
        }
    };

    _pFormBase.on_destroy_contents = function ()
    {
        if (this._timerManager)
        {
            this._timerManager.destroy();
            this._timerManager = null;
        }

        var i;
        if (this._load_manager)
        {
            var load_manager = this._load_manager;
            var tr_list = load_manager.transactionList;
            if (tr_list)
            {
                for (i = tr_list.length - 1; i >= 0; i--)
                {
                    var tr_item = tr_list[i];
                    if (tr_item._usewaitcursor)
                        tr_item._hideWaitCursor(this);
                }
            }
            this._load_manager.destroy();
            this._load_manager = null;
        }

        var binds = this._p_binds;
        var len = binds.length;
        for (i = 0; i < len; i++)
        {
            var bindname = binds.get_id(i);
            this._bind_manager._setBinditem(binds.get_item(bindname), true);
            this[bindname] = null;
        }

        var components = this._p_components;
        len = components.length;

        for (i = len - 1; i >= 0; i--)
        {
            var compname = components.get_id(i);
            if (this[compname])
            {
                if (this[compname]._destroy)
                {
                    this[compname]._destroy();
                    this[compname] = null;
                }
            }
        }

        var objects = this._p_objects;
        len = objects.length;
        for (i = len - 1; i >= 0; i--)
        {
            var objname = objects.get_id(i);
            if (this[objname])
            {
                if (this == this[objname]._p_parent)
                {
                    if (this[objname].destroy)
                        this[objname].destroy();
                }

                objects.delete_item(objname);
                delete this[objname];
                this[objname] = null;

            }
        }

        if (this._bind_manager)
        {
            this._bind_manager.destroy();
            this._bind_manager = null;
        }

        var manager = nexacro._getLayoutManager();
        if (manager)
        {
            manager.destroyLayoutContainerInfo(this);
        }

        this._p_all.clear();
        this._p_all = null;
        this._p_components.clear();
        this._p_components = null;
        this._p_objects.clear();
        this._p_objects = null;
        this._p_binds.clear();
        this._p_binds = null;
        this._child_list = null;

        this._includescriptlist = null;
        this._hotkey_list = null;
        this._load_callbacklist = null;
        this._is_fired_onload = false;

        this._obj_mousemove = null;
    };

    _pFormBase._clearUserFunctions = function ()
    {
        var objPrototype = null;
        if (this._type_name == "Div") objPrototype = nexacro.Div.prototype;
        else if (this._type_name == "Tab") objPrototype = nexacro.Tab.prototype;
        else if (this._type_name == "Tabpage") objPrototype = nexacro.Tabpage.prototype;
        else if (this._type_name == "PopupDiv") objPrototype = nexacro.PopupDiv.prototype;
        else if (this instanceof nexacro.Tab) objPrototype = nexacro.Tab.prototype;
        else if (this instanceof nexacro.Tabpage) objPrototype = nexacro.Tabpage.prototype;
        else if (this instanceof nexacro.PopupDiv) objPrototype = nexacro.PopupDiv.prototype;
        else if (this instanceof nexacro.Div) objPrototype = nexacro.Div.prototype;
        else if (this instanceof nexacro.Form) objPrototype = nexacro.Form.prototype;
        else if (this instanceof nexacro.Frame) objPrototype = nexacro.Frame.prototype;

        for (var func in this)
        {
            if (typeof this[func] === "function" && objPrototype && !objPrototype[func])
            {
                this[func] = null;
            }
        }
    };

    _pFormBase._clear = function ()
    {
        if (this._timerManager && this._timerManager.timerList.length > 0)
            this._timerManager.clearAll();

        this._clearEventListeners();

        var manager = nexacro._getLayoutManager()
        if (manager)
        {
            manager.destroyLayoutContainerInfo(this);
        }

        var control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.clearContents();

            if (this._p_stepselector)
            {
                this._p_stepselector.destroy();
                this._p_stepselector = null;
            }

            var binds = this._p_binds;
            var i, len = binds.length;
            for (i = 0; i < len; i++)
            {
                var bindname = binds.get_id(i);
                this._bind_manager._setBinditem(binds.get_item(bindname), true);
                delete this[bindname];
            }

            var components = this._p_components;
            var objects = this._p_objects;

            this._p_all = new nexacro.Collection();
            this._p_components = new nexacro.Collection();
            this._p_objects = new nexacro.Collection();

            len = components.length;
            for (i = 0; i < len; i++)
            {
                var compname = components.get_id(i);
                if (this[compname])
                {
                    if (this[compname]._destroy)
                        this[compname]._destroy();
                }
            }
            components.clear();

            len = objects.length;
            for (i = 0; i < len; i++)
            {
                var objname = objects.get_id(i);
                if (this[objname])
                {
                    if (this[objname].destroy)
                        this[objname].destroy();
                    delete this[objname];
                }
            }
            objects.clear();
            this._p_all.clear();
            this._p_components.clear();
            this._p_objects.clear();
            this._p_binds.clear();

            if (this._is_scrollable)
            {
                this._onRecalcScrollSize();
                this._onResetScrollBar();
            }
        }
        this._is_loaded = false;
        this._is_created = false;
        this._is_fired_onload = false;
    };

    _pFormBase._resetObject = function ()
    {
        // manager object
        this._bind_manager = new nexacro.BindManager(this);
        this._load_manager = new nexacro._LoadManager(this);
        this._timerManager = new nexacro._TimerManager(this);

        // collection object
        this._p_all = new nexacro.Collection();
        this._p_components = new nexacro.Collection();
        this._p_objects = new nexacro.Collection();
        this._p_binds = new nexacro.Collection();
    };

    _pFormBase._resetStatus = function ()
    {
        this._makeStatusMap();
    };

    _pFormBase._resetProperties = function ()
    {
        this._refform = this;

        this._child_list = [];
        this._hotkey_list = [];
        this._includescriptlist = [];
        this._load_callbacklist = [];
    };

    _pFormBase._clearObject = function ()
    {
        var i;

        // clear bind_manger
        var bindname = "";
        var len = this._p_binds.length;
        for (i = 0; i < len; i++)
        {
            bindname = this._p_binds.get_id(i);
            this._bind_manager._setBinditem(this._p_binds.get_item(bindname), true);

            delete this[bindname];
        }

        // clear load_manager
        if (this._load_manager)
        {
            this._load_manager.clearAllLoad();
        }

        // clear timerManager
        if (this._timerManager)
        {
            this._timerManager.clearAll();
        }

        var objname = "";
        len = this._p_components.length;
        for (i = len - 1; i >= 0; i--)
        {
            objname = this._p_components.get_id(i);
            if (this[objname])
            {
                if (this[objname]._destroy)
                    this[objname]._destroy();

                delete this[objname];
            }
        }

        len = this._p_objects.length;
        for (i = len - 1; i >= 0; i--)
        {
            objname = this._p_objects.get_id(i);
            if (this[objname])
            {
                if (this[objname].destroy)
                    this[objname].destroy();

                delete this[objname];
            }
        }

        this._p_components.clear();
        this._p_objects.clear();
        this._p_binds.clear();
        this._p_all.clear();
    };

    _pFormBase._clearContents = function ()
    {
        if (this._p_stepselector)
        {
            this._p_stepselector.destroy();
        }
        this._p_stepselector = null;

        if (this._control_element)
        {
            this._control_element.destroy();
            this._control_element = null;
        }
    };

    _pFormBase._clearProperties = function ()
    {
        var prop;
        var props = [];
        if (Object.keys)
        {
            props = Object.keys(this);

            while (props.length)
            {
                if (prop = props.pop()) delete this[prop];
            }
        }
        else
        {
            for (prop in this)
            {
                if (this.hasOwnProperty(prop))
                {
                    delete this[prop];
                }
            }
        }
    };

    _pFormBase._beforeClearProperties = function ()
    {
        // Form계열 초기화 할때 원본값이 보존되어야 하는 예외항목
        var ret = {};

        if (this._p_parent)
        {
            ret["parent"] = this._p_parent;
        }
        if (this._p_opener)
        {
            ret["opener"] = this._p_opener;
        }

        ret["_async"] = this._async;
        ret["_env"] = this._env;

        return ret;
    };

    _pFormBase._afterClearProperties = function (recovery_props)
    {
        for (var i in recovery_props)
        {
            this[i] = recovery_props[i];
        }
    };

    //===============================================================
    // nexacro.FormBase : Load
    //===============================================================

    // Application의 함수를 연결해서 쓰는 경우, 함수를 2depth 진입하면
    // this가 window로 바뀌는 문제가 있어서 사용시 주의가 필요함 (참고: Application.loadIncludeScript)
    _pFormBase.on_initEvent = nexacro._emptyFn;
    //  _pFormBase._loadInclude = _pApplication._loadInclude;
    _pFormBase._init = nexacro._emptyFn;
    _pFormBase.loadIncludeScript = nexacro._emptyFn;
    _pFormBase.loadPreloadList = nexacro._emptyFn;

    _pFormBase._onHttpSystemError = function (obj, bfireevent, errorobj, errortype, url, returncode, requesturi, locationuri, extramsg)
    {
        this.on_create = nexacro._emptyFn;

        if (this._p_parent._onHttpSystemError)
            this._p_parent._onHttpSystemError(obj, bfireevent, errorobj, errortype, url, returncode, requesturi, locationuri, extramsg);
    };

    _pFormBase._onHttpTransactionError = function (obj, bfireevent, errorobj, errortype, url, returncode, requesturi, locationuri, extramsg, svcid)
    {
        var ret = false;
        var commerrorobj = nexacro.MakeCommunicationError(this, errortype, url, returncode, requesturi, locationuri, extramsg);
        if (bfireevent)
        {
            ret = this.on_fire_onerror(obj, commerrorobj.name, commerrorobj.message, errorobj, returncode, requesturi, locationuri, svcid);
            if (!ret)
            {
                var environment = this._env;
                if (environment)
                {
                    ret = environment.on_fire_onerror(obj, commerrorobj.name, commerrorobj.message, errorobj, returncode, requesturi, locationuri, svcid);
                }
            }
        }

        return ret;
    };

    _pFormBase._onLocaleCompareError = function (obj, bfireevent, errorobj, errortype, url, returncode, requesturi, locationuri, extramsg, svcid)
    {
        var ret = false;
        var commerrorobj = nexacro.MakeCommunicationError(this, errortype, url, returncode, requesturi, locationuri, extramsg);
        if (bfireevent)
        {
            ret = this.on_fire_onerror(obj, commerrorobj.name, commerrorobj.message, errorobj, returncode, requesturi, locationuri, svcid);
            if (!ret)
            {
                var environment = this._env;
                if (environment)
                {
                    ret = environment.on_fire_onerror(obj, commerrorobj.name, commerrorobj.message, errorobj, returncode, requesturi, locationuri, svcid);
                }
            }
        }

        return ret;
    };

    _pFormBase.create = function ()
    {
        this.on_create();
    };

    _pFormBase.initEvent = function ()
    {
        this._init_status = 1;
        this.on_initEvent();
    };

    //context에 global, local load가 완료된 후에 호출되는 함수
    //compile된 fdl안에 구현 되어 있어야 함
    //component를 만들기 시작하는 함수
    _pFormBase._on_init = function ()
    {
        this._clear();
        this._init();
        this.create();

        this._is_loading = false;

        //for autosize
        if (this._p_parent && this._p_parent._p_form == this && !this._p_parent._is_autosized)
        {
            this._p_parent._loadedForm();
        }
        else if (!this._p_parent)
        {
            this._setLastFocus(this);
            this._is_autosized = true;
        }

        this._executeScript(this);
        this.initEvent();

        this._is_loaded = true;
    };
    _pFormBase._isLoaded = function ()
    {
        return this._id_loaded;
    }
    _pFormBase._addPreloadList = function (type, url, id, args)
    {
        if (!url) return;

        var fullurl;
        var service = nexacro._getServiceObject(url);
        if (type == "data" || type == "dataobject")
        {
            fullurl = nexacro._getServiceLocation(url);
            this._load_manager.addPreloadItem(type, fullurl, id, args, service);
        }
        else
        {
            fullurl = nexacro._getFDLLocation(url);
            this._load_manager.addPreloadItem(type, fullurl, this, null, service);
        }
    };

    _pFormBase._loadInclude = function (mainurl, url, asyncmode, service_url)
    {
        nexacro._loadInclude(this, mainurl, url, asyncmode, service_url);
    };

    // executescript를 generate 코드에서 직접 호출로 변경 
    _pFormBase.executeIncludeScript = function (url, scriptstr)
    {
        var suburl = nexacro._getServiceLocation(url);
        // direct call
        if (scriptstr)
        {
            //_is_loading = false 이면 로딩은 진행이 끝났다고 본다. 
            // 그 후에 executeIncludeScript 수행시에는 loadmanager 없이 바로 sync 호출로 처리 
            var async = this._async;
            this._async = false;

            nexacro._executeScript(scriptstr).call(this, suburl);
            this._executeScript(this, suburl);

            this._async = async;
        }
        else
        {
            nexacro._executeIncludeScript(this, url);
        }
    };

    _pFormBase._executeScript = function (context)
    {
        nexacro._executeMainScript(context);
        context._registerscriptfn = null;
        context._includescriptlist.length = 0;
    };

    _pFormBase.registerScript = function (filename, fn)
    {
        nexacro._registerScript(this, filename, fn);
    };

    _pFormBase.addIncludeScript = function (mainurl, url)
    {
        //this._is_loading = false 이면 xfdl loading은 이미 완료되었음
        //exeucteIncludeScript를 통해 호출되는 경우에는 loadmanager를 거치지 않도록 하기 위해 this._is_loading check 코드 추가

        if (url && this._is_loading)
        {
            nexacro._addIncludeScript(this, mainurl, url);
        }
    };

    _pFormBase.loadIncludeScript = function (mainurl)
    {
        var includescript;
        var len = this._includescriptlist.length;

        for (var i = 0; i < len; i++)
        {
            includescript = this._includescriptlist[i];

            if (includescript.isload == false)
            {
                // IE9에서 open시 FormBase에 링크된 loadIncludeScript 가 호출될 때,
                // 함수 내에서 또 this의 함수(_loadInclude)를 호출하면 this가 window로 바뀌는 문제가 있다.
                // call을 통해 호출하면 문제가 발생하지 않음... why?? 2014.02.14 neoarc    	
                includescript.isload = true;

                if (nexacro._viewtoollog == true
                    && this._asyncformload != this._async
                    && this._asyncformload != undefined)
                {
                    this._loadInclude.call(this, mainurl, includescript.url, this._asyncformload, includescript.service_url);
                }
                else
                {
                    this._loadInclude.call(this, mainurl, includescript.url, this._async, includescript.service_url);
                }
            }
        }
    };

    _pFormBase.setFocus = function (bResetScroll, bInnerFocus)
    {
        if (this._p_parent._is_frame)
        {
            var win = this._getRootWindow();
            if (!this.getElement())
                return;

            if (win && win._is_active_window == false)
            {
                if (win._is_active_window == false)
                {
                    win._setFocus(); // runtime                  
                }
            }
        }

        return nexacro.Component.prototype.setFocus.call(this, bResetScroll, bInnerFocus);
    };

    //===============================================================
    // nexacro.FormBase : Override
    //===============================================================
    _pFormBase._findForm = function ()
    {
        return this;
    };

    _pFormBase._getReferenceContext = function ()
    {
        return this;
    };

    // GetDlgCode 컴포넌트가 어떤 키를 처리하길 원하는지의 여부 .. 
    _pFormBase._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        // Ex)
        // want_tab:true    : Tab키를 눌러도 포커스 이동을 하지 않음 (Grid,TextArea)
        // want_return:true : Enter키를 눌러도 DefaultButton 처리를 하지 않음 (Menu,PopupMenu,Grid,TextArea)
        // want_escape:true : ............... EscapeButton 처리를 하지 않음
        // want_chars       : 미사용
        // want_arrows      : 미사용
        var last_focused_comp = this._getLastFocused();
        if (last_focused_comp && last_focused_comp != this)
        {
            return last_focused_comp._getDlgCode(keycode, altKey, ctrlKey, shiftKey);
        }
        return { want_tab: false, want_return: false, want_escape: false, want_chars: false, want_arrows: false };
    };

    _pFormBase._waitCursor = function (wait_flag, context)
    {
        var ownerframe = this.getOwnerFrame();
        if (ownerframe)
        {
            ownerframe._waitCursor(wait_flag, context);
        }
    };

    //===============================================================
    // nexacro.FormBase : Methods
    //===============================================================
    _pFormBase._destroy = function (callremovechild)
    {
        // Framework 내부에서 destroy할 때는 _destroy 사용
        if (!this._is_alive)
            return;

        return this.destroyComponent(callremovechild);
    };

    _pFormBase.destroy = function ()
    {
        // 사용자가 직접 호출한 경우라고 가정한다.
        if (!this._is_alive)
            return;

        var confirm_message = this._on_beforeclose();
        if (this._checkAndConfirmClose(confirm_message) == false)
            return false;

        if (this._window)
            this._window._ignore_close_confirm = true;

        this._on_close();

        this._is_fired_onload = false;

        return this.destroyComponent();
    };

    _pFormBase.loadCss = function (url, base_url, async)
    {
        //경로 설정하는 api 필요
        if (!base_url)
            base_url = this._base_url;

        var cssurl = nexacro._getServiceLocation(url, base_url, null, false);
        var cssmapurl = cssurl;

        var pos = cssurl.lastIndexOf('/');
        cssurl = cssurl.substring(0, pos + 1) + nexacro._getCSSFileName(cssurl.substring(pos + 1, cssurl.length - 4));

        pos = cssmapurl.lastIndexOf('.');
        cssmapurl = nexacro._getMapFileName(cssmapurl.substring(0, pos));

        var service = nexacro._getServiceObject(url);
        var env = this._env;
        var checkversion = env.checkversion;

        if (checkversion)
        {
            var version = service.version;
            if (!nexacro._isNull(version) && version !== "")
            {
                cssurl += nexacro._getVersionQueryString(cssurl, null, version);
                cssmapurl += nexacro._getVersionQueryString(cssmapurl, null, version);
            }
        }

        this._load_manager.loadCssModule(cssurl, null, async, service, true, 1); //css
        this._load_manager.loadCssModule(cssmapurl, null, async, service);  //map
    };

    _pFormBase.resize = function (w, h)
    {
        if (w < 0 || h < 0)
        {
            return;
        }

        if (w == this._adjust_width && h == this._adjust_height)
        {
            return;
        }

        if (this._adjust_width != (this._adjust_left + w) || this._adjust_height != (this._adjust_top + h))
        {
            this._p_width = w;
            this._p_height = h;
            this._update_position(true, false);
        }
        else
        {
            this._update_position(false, false);
        }
    };

    _pFormBase.confirm = function (strText, strCaption, strType)
    {
        var win = this._getWindow();
        if (!win)
            return;

        nexacro._skipDragEventAfterMsgBox = true;

        return nexacro._confirm(win.root, strText, strCaption, strType);
    };

    _pFormBase.alert = function (strText, strCaption, strType)
    {
        var win = this._getWindow();
        if (!win)
            return;

        nexacro._skipDragEventAfterMsgBox = true;

        nexacro._alert(win.root, strText, strCaption, strType);
    };

    _pFormBase.getOwnerFrame = function ()
    {
        var frame = null;
        if (this._p_parent && !(this._p_parent instanceof nexacro.Frame))
        {
            frame = this._p_parent.getOwnerFrame();
        }
        else
        {
            frame = this._p_parent;
        }
        if (frame && !frame._is_frame)
            return null;
        return frame;
    };

    _pFormBase.lookup = function (name)
    {
        for (var f = this; (f != null); f = (f._p_opener || f._p_parent))
        {
            if (name in f)
                return f[name];
        }

        return this._env?.lookup(name);
    };

    //for migration -> not apply to env 
    _pFormBase.lookupSetter = function (name, fnname)
    {
        if (!fnname)
            fnname = "set_" + name;
        for (var f = this; (f != null); f = (f._p_opener || f._p_parent))
        {
            var fn = f[fnname];
            if (fn)
            {
                return new nexacro.SetterBinder(f, name, fn);
            }
            if (name in f)
            {
                return new nexacro.PropBinder(f, name);
            }
        }
        return null;
    };

    _pFormBase.lookupFunc = function (name)
    {
        for (var f = this; (f != null); f = (f._p_opener || f._p_parent))
        {
            var fn = f[name];
            if (fn)
            {
                return new nexacro.FuncBinder(f, fn);
            }
        }
        return null;
    };

    _pFormBase.setSize = function (width, height)
    {
        if (this._adjust_width != width || this._adjust_height != height)
        {
            this._adjustPosition(this._p_left, this._p_top, null, null, width, height, this._p_parent._getClientWidth(), this._p_parent._getClientHeight());
            var control_elem = this._control_element;
            if (control_elem)
            {
                control_elem.setElementSize(width, height);
            }
        }
    };

    _pFormBase.addLayout = function (name, obj)
    {
        if (!obj) return;

        var manager = nexacro._getLayoutManager(this);
        if (manager)
        {
            manager.addLayoutList(this, obj);
        }
    };

    _pFormBase.getLayoutInfo = function (strLayoutName, strPropName)
    {
        var manager = nexacro._getLayoutManager();
        if (manager)
        {
            return manager.getLayoutProperty(this, strPropName, strLayoutName);
        }
        return;
    };

    _pFormBase.setFluidLayoutProperty = function (strLayoutName, strPropName, value)
    {
        var fluid_enum = ["tabletemplate"];
        if (fluid_enum.indexOf(strPropName) == -1)
        {
            return;
        }
        var manager = nexacro._getLayoutManager();
        if (manager)
        {
            if (arguments.length > 2)
            {
                var ret = manager.setLayoutProperty(this, strLayoutName, strPropName, value);
                /*          
                if (strPropName == "tabletemplate")
                {
                    var layout = manager.getLayout(this, strLayoutName);
                    if (layout && layout._form)
                    {
                        var _form =  layout._form;
                        if (_form)
                            _form._onApplyTabletemplate(strLayoutName);
                    }
                   
                }
                */
                return ret;
            }
            else if (strLayoutName instanceof Object)
            {
                //Todo JSON
            }
        }
        return;
    };

    _pFormBase.getPanel = function (obj)
    {
        var ret = null;
        if (!obj) return ret;
        if (obj._is_group)
            ret = obj._group_panel;
        return ret;
    };


    _pFormBase.fetchStateData = function (includeall)
    {
        this._processStateData(1, includeall);
    };

    //type - 1: fetch, 0: restore
    _pFormBase._processStateData = function (type, includeall)
    {
        let fn = type == 1 ? this.on_fire_onfetchstatedata : this.on_fire_onrestorestatedata;
        let ret = fn.call(this, this);
        if (ret && includeall)  //
        {
            let components = this._p_components;
            let len = components.length;
            for (let i = 0; i < len; i++)
            {
                let comp = components[i];
                if (!((comp._type_name != "PopupDiv" && comp instanceof nexacro.Div) || comp instanceof nexacro.Tab))
                    continue;

                comp._processStateData(type, includeall);
            }
        }
    };


    _pFormBase.restoreStateData = function (includeall)
    {
        this._processStateData(0, includeall);
    };
    //===============================================================
    // nexacro.FormBase : Event Handlers
    //===============================================================
    _pFormBase._on_activate = function ()
    {
        if (this._p_visible && this._isEnable() && this._p_enableevent)
        {
            this.on_fire_onactivate();
        }
    };

    _pFormBase._on_deactivate = function ()
    {
        if (this._p_visible && this._isEnable() && this._p_enableevent)
        {
            this.on_fire_ondeactivate();
        }
    };

    _pFormBase._on_beforeclose = function (root_closing_comp)
    {
        if (!this._is_alive || (this._is_form && !this._is_loaded))
            return;

        if (!root_closing_comp)
        {
            root_closing_comp = this;
        }

        var msg = "";
        // 모든 하위 form계열 beforeclose 호출
        var components = this._p_components;
        var len = components.length;
        for (var i = 0; i < len; i++)
        {
            var comp = components[i];
            if (!(comp instanceof nexacro.FormBase || comp instanceof nexacro.Div || comp instanceof nexacro.Tab))
                continue;

            var comp_msg = comp._on_beforeclose(root_closing_comp);
            msg = this._appendBeforeCloseMsg(msg, comp_msg);
        }

        // self
        var self_msg = this._on_bubble_beforeclose(root_closing_comp);
        msg = this._appendBeforeCloseMsg(msg, self_msg);

        return msg;
    };

    _pFormBase._on_close = function ()
    {
        if (!this._is_alive || (this._is_form && !this._is_loaded))
            return true;

        this._last_focused = null;

        var components = this._p_components;
        var len = components.length;
        for (var i = 0; i < len; i++)
        {
            var comp = components[i];
            if (!(comp instanceof nexacro.FormBase || comp instanceof nexacro.Div || comp instanceof nexacro.Tab))
                continue;

            comp._on_close();
        }

        this._on_bubble_close();
    };

    _pFormBase._on_notify_onbindingvaluechanged = function (obj, event_info)
    {
        return this.on_fire_onbindingvaluechanged(obj, event_info.fromobject, event_info.fromreferenceobject, event_info.row, event_info.col, event_info.colidx, event_info._p_columnid, event_info.oldvalue, event_info.newvalue);
    };

    _pFormBase._on_bubble_beforeclose = function (root_closing_comp, event_bubbles, fire_comp, refer_comp)
    {
        var first_call = false;
        if (event_bubbles === undefined) // firecomp
        {
            first_call = true;
            fire_comp = this;
            if (!refer_comp)
            {
                refer_comp = this;
            }
        }

        var msg = "";
        if (this._p_visible && this._isEnable())
        {
            if (this.enableevent)
            {
                if (first_call)
                    event_bubbles = false;

                msg = this.on_fire_onbeforeclose(this, fire_comp, refer_comp, root_closing_comp);
            }
        }

        // TODO check Form계열 close Event 버블링여부는 논의중.
        var bubbled_msg = "";
        if ((!this.onbeforeclose || (this.onbeforeclose && !this.onbeforeclose.stoppropagation)) && event_bubbles !== true && this._p_parent && !this._p_parent._is_application)
        {
            var _parent = this._p_parent;
            if (_parent && _parent._on_bubble_beforeclose)
            {
                bubbled_msg = _parent._on_bubble_beforeclose(root_closing_comp, event_bubbles, fire_comp, refer_comp);
            }
        }
        return this._appendBeforeCloseMsg(msg, bubbled_msg);
    };

    _pFormBase._on_bubble_close = function (event_bubbles, fire_comp, refer_comp)
    {
        var first_call = false;
        if (event_bubbles === undefined) // firecomp
        {
            first_call = true;
            fire_comp = this;
            if (!refer_comp)
                refer_comp = this;
        }

        if (this._p_visible && this._isEnable())
        {
            if (this._p_enableevent)
            {
                if (first_call)
                    event_bubbles = false;

                this.on_fire_onclose(this, fire_comp, refer_comp);
            }
        }

        // TODO check Form계열 close Event 버블링여부는 논의중.
        var parent = this._p_parent;
        if (parent && parent._on_bubble_close) // parent._is_frame
        {
            if ((!this.onclose || (this.onclose && !this.onclose.stoppropagation)) && event_bubbles !== true && !parent._is_application)
            {
                return parent._on_bubble_close(event_bubbles, fire_comp, refer_comp);
            }
        }
    };

    _pFormBase.on_fire_onbeforeclose = function (obj, from_comp, refer_comp, root_closing_comp)
    {
        if (this.onbeforeclose && this.onbeforeclose._has_handlers)
        {
            var evt = new nexacro.CloseEventInfo(obj, "onbeforeclose", from_comp, refer_comp, root_closing_comp);
            return this.onbeforeclose._fireEvent(this, evt);
        }
    };

    _pFormBase.on_fire_onactivate = function ()
    {
        if (this.onactivate && this.onactivate._has_handlers)
        {
            var evt = new nexacro.ActivateEventInfo(this, "onactivate", true, this, this);
            this.onactivate._fireEvent(this, evt);
        }
    };

    _pFormBase.on_fire_ondeactivate = function ()
    {
        if (this.ondeactivate && this.ondeactivate._has_handlers)
        {
            var evt = new nexacro.ActivateEventInfo(this, "ondeactivate", false, this, this);
            this.ondeactivate._fireEvent(this, evt);
        }
    };

    _pFormBase.on_fire_onclose = function (obj, from_comp, refer_comp)
    {
        if (this.onclose && this.onclose._has_handlers)
        {
            var evt = new nexacro.CloseEventInfo(obj, "onclose", from_comp, refer_comp);
            return this.onclose._fireEvent(this, evt);
        }
        return true;
    };

    _pFormBase.on_fire_onerror = function (obj, errortype, errormsg, errorobj, statuscode, requesturi, locationuri, errordata)
    {
        if (this.onerror && this.onerror._has_handlers)
        {
            var evt = new nexacro.ErrorEventInfo(obj, "onerror", errortype, errormsg, errorobj, statuscode, requesturi, locationuri, errordata);
            return this.onerror._fireEvent(this, evt);
        }
        return false;
    };

    _pFormBase.on_fire_onbindingvaluechanged = function (obj, from_obj, refer_obj, row, col, colidx, columnid, oldvalue, newvalue)
    {
        if (this.onbindingvaluechanged && this.onbindingvaluechanged._has_handlers)
        {
            var evt = new nexacro.BindingValueChangedEventInfo(obj, "onbindingvaluechanged", row, col, colidx, columnid, oldvalue, newvalue);
            return this.onbindingvaluechanged._fireEvent(this, evt);
        }
    };

    _pFormBase.on_fire_sys_onflingstart = function (elem, fling_handler, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp)
    {
        return nexacro.Component.prototype.on_fire_sys_onflingstart.call(this, elem, fling_handler, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp);
    };

    _pFormBase.on_fire_sys_onslidestart = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        if (this._p_stepselector)
        {
            this._is_step_vscrolling = false;
            this._is_step_hscrolling = false;

            // 스크롤 중에 또 잡아 끌면 취소
            if (this._stepchange_info)
                this._on_cancel_stepchange_animation();

            // slide 대상만 했으면 싶은데..
            var control_elem = this.getElement();
            if (control_elem)
            {
                control_elem.setElementTranslateStart();
            }
        }
        return nexacro.Component.prototype.on_fire_sys_onslidestart.call(this, elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp);
    };

    _pFormBase.on_fire_sys_onslideend = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        // 내가 slide로 인한 스크롤 대상이고
        var control_elem;
        if (touch_manager && touch_manager._scroll_comp == this)
        {
            control_elem = this.getElement();
            var stepselector = this._p_stepselector;
            if (!control_elem || !stepselector)
                return;

            control_elem.setElementTranslateEnd();

            // 현재 Step index와 정확히 일치하는 화면을 보고 있는 것이 아니라면
            //var zoomFactor = this._getZoom() / 100;
            var client_width = control_elem.client_width;

            var is_invalid_pos = (control_elem.scroll_left != (client_width * stepselector.stepindex));
            if (!is_invalid_pos)
                return;

            //var duration = 400;

            // 어디까지 스크롤 할것인가?

            // 1. 단순히 생각하면 그냥 가까운쪽
            //For now, stepchange logic is coded here. (referenced by nexacro14)               
            var target_pos = control_elem.scroll_left - (client_width / 2);
            var session = touch_manager._touch_session;
            if (session)
            {
                var cur_scale = session._scale;
                var data = session._cur_data;
                if (data)
                    target_pos -= (data.distanceX * cur_scale);

            }
            var target_index = nexacro.round(target_pos / (client_width) + 0.5);
            var cur_stepindex = stepselector.stepindex;
            var next_stepindex = cur_stepindex;
            if (target_index == cur_stepindex)
            {
                //stepchange cancel animation
                this._createStepChangeAnimation(target_index, 600); //just reuse the function 
            }
            else
            {
                //only one step change each one touch slide
                if (xaccvalue > 0)
                    next_stepindex--;
                else
                    next_stepindex++;
            }
            /*
            // 2. fling인 경우 좀 멀어도 가산점을 줌.  
            var flinginfo = touch_manager._is_fling;
            if (flinginfo)
            {
                var flingfactor = 3;
                var flingdistance = flinginfo.xstartvalue | 0; // fling 처리시 이동가능한 거리

                // TODO check 한번에 여러 Step 넘어갈 수 있게 할까?
                if (flingdistance < -(client_width / flingfactor))
                    flingdistance = -(client_width / flingfactor);
                if (flingdistance > (client_width / flingfactor))
                    flingdistance = (client_width / flingfactor);

                target_pos -= flingdistance;
            }
            */


            var ret = stepselector.set_stepindex(next_stepindex);

            if (ret)
            {
                // Animation 에 의해서도 hscrollpos가 호출되는데 중복 호출로 인한 경쟁으로 잔상현상 방지를 위해 Android runtime 에서는 또 태우지 않도록 함.
                if (nexacro._OS != "Android" && nexacro._Browser != "Runtime")
                {
                    control_elem.setElementHScrollPos(client_width * stepselector.stepindex);
                }
            }

            // 아직 fling 되기 전임. Fling이 발생하지 않도록 처리함.
            touch_manager._touch_session._fling_blocked = true;
        }
        else
        {
            control_elem = this.getElement();
            if (control_elem && this._p_stepselector)
            {
                control_elem.setElementTranslateEnd();
            }
            // 기본 호출
            return nexacro.Component.prototype.on_fire_sys_onslideend.call(this, elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp);
        }

        // slideend는 return 값이 의미가 없음
        return false;
    };

    _pFormBase.on_fire_onfetchstatedata = function (obj)
    {
        if (this.onfetchstatedata && this.onfetchstatedata._has_handlers)
        {
            //var evt = new nexacro.FetchStateDataEventInfo(obj, "onfetchstatedata");
            var evt = new nexacro.EventInfo(obj, "onfetchstatedata");
            return this.onfetchstatedata._fireCheckEvent(this, evt);
        }
        return true;
    };

    _pFormBase.on_fire_onrestorestatedata = function (obj)
    {
        if (this.onrestorestatedata && this.onrestorestatedata._has_handlers)
        {
            //var evt = new nexacro.RestoreStateDataEventInfo(obj, "onrestorestatedata");
            var evt = new nexacro.EventInfo(obj, "onrestorestatedata");
            return this.onrestorestatedata._fireCheckEvent(this, evt);
        }
    };

    //===============================================================
    // nexacro.FormBase : Properties
    //===============================================================    

    //===============================================================
    // nexacro.FormBase : Logical Part
    //===============================================================
    _pFormBase.loadForm = function (formurl, async, reload, baseurl)
    {
        if (!this._load_manager)
        {
            return;
        }

        var pThis = this._p_parent;
        var url = nexacro._getFDLLocation(formurl, baseurl);
        var service = nexacro._getServiceObject(formurl);

        this._url = url;
        this._orgurl = formurl;
        this._base_url = nexacro._getBaseUrl(url);

        this._is_loading = true;
        this._asyncformload = async;

        // ChildFrame > Form
        if (pThis && pThis._is_frame && pThis._window_type != 2)
        {
            if (pThis._p_form == this)
            {
                var application = this._getApplication();
                if (application)
                {
                    application._registerLoadforms(this);
                }
            }
        }

        this._load_manager.loadMainModule(url, undefined, async, reload, service);
    };

    _pFormBase.getParentContext = function ()
    {

    };

    _pFormBase._getFormBaseUrl = function ()
    {
        return this._base_url;
    };

    _pFormBase._findChildObject = function (queryid)
    {
        var npos = queryid.indexOf(".");
        if (npos > 0)
        {
            var querythis = queryid.substring(0, npos).trim();
            var pthis = this;
            var findobj;
            while (querythis && pthis)
            {
                findobj = pthis[querythis];
                queryid = queryid.substring(npos + 1, queryid.length).trim();
                npos = queryid.indexOf(".");
                if (npos > 0)
                    querythis = queryid.substring(0, npos).trim();
                else
                    return findobj ? findobj[queryid] : null;

                pthis = findobj;
            }
        }
        else
        {
            if (queryid == "this")
                return this;
            return this[queryid];
        }
    };

    _pFormBase._getDatasetObject = function (queryid)
    {
        var _ds;
        var pthis = "this.";
        if (queryid.indexOf(".") > 0)
        {
            if (queryid.indexOf(pthis) < 0)
            {
                queryid = pthis + queryid;
            }
            var fn = new Function("return " + queryid);
            _ds = fn.call(this);
        }
        else
        {
            _ds = queryid ? this[queryid] : null;
            var p = (this._p_opener || this._p_parent);

            if (_ds == null && p && !p._is_application)
            {
                while (p._p_parent && (p._is_container || p._is_containerset))
                    p = p._p_parent;

                _ds = p._getDatasetObject ? p._getDatasetObject(queryid) : null;
            }

            if (_ds == null && queryid)
            {
                var application = this._getApplication();
                if (application)
                    _ds = application[queryid];
            }

            if (_ds == null && queryid)
            {
                const env = this._env;
                if (env)
                    _ds = env[queryid];
            }

        }

        if (_ds && _ds._isDataset && !_ds._isDataset())
            _ds = null;

        return _ds;
    };

    _pFormBase._getTabOrderLast = function (filter_type)
    {
        if (nexacro._isNull(filter_type))
            filter_type = 4;

        var ar = this._getComponentsByTaborder(this, filter_type);
        if (ar && ar.length > 0)
            return ar[ar.length - 1];

        return null;
    };

    _pFormBase._getTabOrderFirst = function (filter_type, bAccessibility)
    {
        if (nexacro._isNull(filter_type))
            filter_type = 4;

        var ar = this._getComponentsByTaborder(this, filter_type, undefined, bAccessibility);
        if (ar && ar.length > 0)
            return ar[0];

        return null;
    };

    _pFormBase._getTabOrderNext = function (current, direction, filter_type)
    {
        if (nexacro._isNull(filter_type))
            filter_type = 4;

        var ar = this._getComponentsByTaborder(this, filter_type);
        var cur_idx = nexacro._indexOf(ar, current._getRootComponent(current));
        if (cur_idx < 0)
        {
            var ar_all = this._getComponentsByTaborder(this, this._env._p_enableaccessibility ? (8 + 7) : 7);
            var cur_all_idx = nexacro._indexOf(ar_all, current._getRootComponent(current));
            var comp, i;

            if (cur_all_idx < 0)
                return null;

            i = cur_all_idx;
            while (((i + direction) >= 0 && (i + direction) < ar_all.length))
            {
                comp = ar_all[i + direction];
                cur_idx = nexacro._indexOf(ar, comp._getRootComponent(comp));
                if (cur_idx >= 0)
                    return comp;

                i += direction;
            }

            return null;
        }


        return ar[cur_idx + direction];
    };

    // filter_type 
    // 0 : tabstop = true, enable = true;
    // 1 : tabstop = true/false, enable = true;
    // 2 : tabstop = true, enable = true/false;
    // 3 : tabstop = true/false, enable = true/false;
    // 4 : stop Tab on containertype component (tabstop = true, enable = true)
    // 5 : 4 + 1 
    // 6 : 4 + 2 
    // 7 : 4 + 3
    // 8 : component that accessibilityenable is true (tabstop = true, enable = true)
    _pFormBase._getComponentsByTaborder = function (p, filter_type, include_not_created, bAccessibility)//, arEdit)
    {
        // tabstop=false인 컴포넌트에서 Tab 이동시 필요하다. 
        if (filter_type === undefined)
            filter_type = 4;

        var ar = [];
        var comps = p._p_components;
        if (comps)
        {
            var comp_len = comps.length;
            for (var i = 0; i < comp_len; i++)
            {
                var comp = comps[i];
                if (!comp || (!include_not_created && !comp._is_created) || !comp._p_visible || ((comp._isEnable && !comp._isEnable() || !comp._p_enable) && !(filter_type & 2)) || comp._popup)
                    continue;
                if (!(filter_type & 1))
                {
                    if (bAccessibility)
                    {
                        if (!comp._p_accessibilityenable || !comp._p_visible)
                            continue;
                    }
                    else if (!comp.on_get_prop_tabstop())
                        continue;
                }
                if (((filter_type & 8) ? !comp._isAccessibilityEnable() : false))   //Accessibility
                {
                    if (!comp._hasContainer() && !comp._is_listtype)
                        continue;
                }

                var cur_stepindx = this.getStepIndex();
                if (cur_stepindx === -1 || cur_stepindx === comp._p_positionstep || comp._p_positionstep === -1)
                {
                    var tabidx = comp._p_taborder;
                    if (tabidx < 0)
                        tabidx = 0; //continue;
                    var j = ar.length;
                    while (j > 0 && ar[j - 1]._p_taborder > tabidx)
                    {
                        ar[j] = ar[j - 1];
                        j--;
                    }
                    ar[j] = comp;
                }
            }
        }
        return ar;
    };

    // Tab키로 포커스 이동시 대상 탐색을 위한 api
    // filter_type 
    // 0 : tabstop = true, enable = true;
    // 1 : tabstop = true/false, enable = true;
    // 2 : tabstop = true, enable = true/false;
    // 3 : tabstop = true/false, enable = true/false;
    // 4 : stop Tab on containertype component (tabstop = true, enable = true)
    // 5 : 4 + 1 
    // 6 : 4 + 2 
    // 7 : 4 + 3
    // 8 : component that accessibilityenable is true (tabstop = true, enable = true)
    _pFormBase._searchNextTabFocus = function (current, b_search_from_first, opt_force_cycle, filter_type)
    {
        if (filter_type === undefined)
            filter_type = 4;

        var env = this._env;
        var tabkeycirculation = env._tabkeycirculation;
        var opt_cycle = (opt_force_cycle == undefined) ? (tabkeycirculation == 0 || tabkeycirculation == 2) : opt_force_cycle;

        // my child중 누군가를 기준으로 탐색
        var ret, next;
        var my_tapstop_childs = this._getComponentsByTaborder(this, filter_type);
        var my_tabstop_child_cnt = my_tapstop_childs ? my_tapstop_childs.length : 0;

        var parent = this._p_parent;
        while ((parent && parent._hasContainer && !parent._hasContainer() && !parent._is_frame))
        {
            parent = parent._p_parent;
        }

        if (my_tabstop_child_cnt > 0 && current && !b_search_from_first)
        {
            next = this._getTabOrderNext(current, 1, filter_type);
            if (opt_cycle && !next && this._isPopupVisible())
                next = this._getTabOrderFirst(filter_type);
            if (!next)
            {
                // 한바퀴 다 돈 경우
                var root_win = this._getRootWindow();
                var keydown_elem = root_win._keydown_element;
                var is_embedded = nexacro._isEmbeddedWindow(root_win);

                if (is_embedded)
                    keydown_elem._event_stop = false;

                var parent_tabstop_childs = parent._getComponentsByTaborder(parent, filter_type);
                var parent_tabstop_child_cnt = parent_tabstop_childs ? parent_tabstop_childs.length : 0;
                if (!opt_cycle && (parent._is_frame || this._is_window) &&
                    (tabkeycirculation != 2 && tabkeycirculation != 3 || this._is_window))
                {
                    // "마지막 컴포넌트 입니다."
                    ret = [null, this, 1];
                }
                else if ((parent._hasContainer() && parent_tabstop_child_cnt > 0) ||
                    ((tabkeycirculation == 2 || tabkeycirculation == 3) &&
                        parent instanceof nexacro.ChildFrame &&
                        !(this._p_parent._window_type > 0 && this._p_parent._window_type < 6)))
                {
                    ret = parent._searchNextTabFocus(this, false, opt_cycle, filter_type);
                }
                else
                {
                    next = this._getTabOrderFirst(filter_type);
                }
            }
        }
        else
        {
            // this 자체가 focus되어있는 경우
            next = this._getTabOrderFirst(filter_type);
            if (!next)
            {
                // 텅빈 div인 경우
                if (!nexacro._isNull(parent) && parent._hasContainer && this._p_parent._is_form)
                {
                    ret = parent._searchNextTabFocus(this, false, opt_cycle, filter_type);
                }
                else if ((tabkeycirculation == 2 || tabkeycirculation == 3) && this._p_parent && this._p_parent._is_frameset)
                {
                    // this._p_parent = FrameSet
                    var _tabkeycirculation = this._p_parent._tabkeycirculation;
                    var _frames = this._p_parent._p_frames;
                    var n = _frames ? _frames.length : 0;
                    var _childframe = null;
                    var _frameset_idx = -1;
                    var _idx = -1;
                    for (var i = 0; i < n; i++)
                    {
                        if (_frames[i] instanceof nexacro.ChildFrame)
                        {
                            if (this.id == _frames[i].id)
                            {
                                _idx = i;
                            }
                            else if (_idx != -1)
                            {
                                if (_frames[i]._isFocusAcceptable())
                                {
                                    if (!(this._p_parent instanceof nexacro.FrameSet) ||
                                        (this._p_parent instanceof nexacro.FrameSet &&
                                            ((_tabkeycirculation == 3 && this._p_parent._arrange != 0) ||  // auto, cascade일때는 skip
                                                _tabkeycirculation == 0 ||
                                                (_tabkeycirculation == 1 && _frames[i]._state_openstatus != 2)) ||  // minimize제외
                                            _tabkeycirculation == 2 && _frames[i]._activate))    // active_only
                                    {
                                        if (_frames[i]._p_form && _frames[i].formurl)
                                        {
                                            _childframe = _frames[i];
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        else if (_frames[i]._is_frameset && _frames[i]._isFocusAcceptable())
                        {
                            if (_idx < i)
                            {
                                _frameset_idx = i;
                            }

                        }
                    }

                    if (!_childframe)
                    {
                        var _next_frame_ = null;
                        if (_frameset_idx != -1)
                        {
                            _childframe = _frames[_frameset_idx]._getNextChildFrame(_frames[_frameset_idx].frames);
                            if (_childframe)
                            {
                                next = _childframe._p_form ? _childframe._p_form._getTabOrderFirst(filter_type) : null;
                                if (!next)
                                    next = _childframe._p_form;
                            }
                            else
                            {
                                // 상위 frameset,frame 검색
                                var pp = this._p_parent._p_parent;
                                if (pp && pp._getNextFrame)
                                    _next_frame_ = pp._getNextFrame(this._p_parent.id, opt_cycle);
                                if (_next_frame_)
                                {
                                    if (_next_frame_ instanceof nexacro.ChildFrame)
                                    {
                                        next = _next_frame_._p_form ? _next_frame_._p_form._getTabOrderFirst(filter_type) : null;
                                        if (!next)
                                            next = _next_frame_._p_form;
                                    }
                                    else
                                        ret = _next_frame_._searchNextTabFocus(_next_frame_, false, opt_cycle, filter_type);
                                }
                            }
                        }
                        else
                        {
                            // 상위 frameset,frame 검색
                            var pp = this._p_parent._p_parent;
                            if (pp && pp._getNextFrame)
                                _next_frame_ = pp._getNextFrame(this._p_parent.id, opt_cycle);
                            else
                            {
                                // this._p_parent._p_parent는 MainFrame
                                // 가장 끝에 있는 ChildFrame구해와야 한다.   
                                if (tabkeycirculation == 2) 
                                {
                                    // cycle                                    
                                    if ((_tabkeycirculation == 1 && this._p_parent._state_openstatus == 2)  // minimize
                                        || (_tabkeycirculation == 2 && this._p_parent._activate) // active_only
                                        || (_tabkeycirculation == 3 && this._p_parent._arrange == 0)) // auto, cascade일때
                                    {
                                        next = this._p_form ? this._p_form._getTabOrderFirst(filter_type) : null;
                                        //if (!next)
                                        //    next = _next_frame_._p_form;
                                    }
                                    else
                                    {
                                        if (this._p_parent._getNextChildFrame)
                                        {
                                            _next_frame_ = this._p_parent._getNextChildFrame(this._p_parent.frames);
                                        }
                                    }
                                }
                                else
                                    ret = null;
                            }
                            if (_next_frame_)
                            {
                                if (_next_frame_ instanceof nexacro.ChildFrame)
                                {
                                    next = _next_frame_._p_form ? _next_frame_._p_form._getTabOrderFirst(filter_type) : null;
                                    if (!next)
                                        next = _next_frame_._p_form;
                                }
                                else
                                    ret = _next_frame_._searchNextTabFocus(_next_frame_, false, opt_cycle, filter_type);
                            }
                        }
                    }
                    else
                    {
                        next = _childframe._p_form ? _childframe._p_form._getTabOrderFirst(filter_type) : null;
                        if (!next)
                            next = _childframe._p_form;
                    }
                }
                else
                {
                    if (parent && parent._searchNextTabFocus)
                    {
                        ret = parent._searchNextTabFocus(this, undefined, undefined, filter_type);
                    }
                    else
                    {
                        ret = null;
                    }
                }
            }
        }

        if (next)
        {
            var next_tabstop_childs = (next._hasContainer() ? next._getComponentsByTaborder(next, filter_type) : null);
            var next_tabstop_child_cnt = next_tabstop_childs ? next_tabstop_childs.length : 0;
            if (next._hasContainer() && next._checkContainerTabFocus() == true && (filter_type & 4) && ((filter_type & 8) ? next._isAccessibilityEnable() : true))
            {
                ret = [next];
            }
            else if (next._hasContainer() && next_tabstop_child_cnt > 0)
            {
                ret = next._searchNextTabFocus(null, true, undefined, filter_type);
            }
            else
            {
                ret = [next];
            }
        }

        return ret;
    };

    // filter_type 
    // 0 : tabstop = true, enable = true;
    // 1 : tabstop = true/false, enable = true;
    // 2 : tabstop = true, enable = true/false;
    // 3 : tabstop = true/false, enable = true/false;
    // 4 : stop Tab on containertype component (tabstop = true, enable = true)
    // 5 : 4 + 1 
    // 6 : 4 + 2 
    // 7 : 4 + 3
    // 8 : component that accessibilityenable is true (tabstop = true, enable = true)
    _pFormBase._searchPrevTabFocus = function (current, bSearchFromLast, opt_force_cycle, filter_type)
    {
        var tabkeycirculation = nexacro._tabkeycirculation;
        var opt_cycle = (opt_force_cycle == undefined) ? (tabkeycirculation == 0 || tabkeycirculation == 2) : opt_force_cycle;

        var ret, next;
        var my_tapstop_childs = this._getComponentsByTaborder(this, filter_type);
        var my_tabstop_child_cnt = my_tapstop_childs ? my_tapstop_childs.length : 0;

        var parent = this._p_parent;
        while ((parent && parent._hasContainer && !parent._hasContainer() && !parent._is_frame))
        {
            parent = parent._p_parent;
        }

        if (my_tabstop_child_cnt && current && !bSearchFromLast)
        {
            next = this._getTabOrderNext(current, -1, filter_type);

            // PopupDiv 내부 순환
            if (opt_cycle && !next && this._isPopupVisible())
                next = this._getTabOrderLast(filter_type);
            if (!next)
            {
                // 한바퀴 다 돈 경우
                var root_win = this._getRootWindow();
                var keydown_elem = root_win._keydown_element;
                var is_embedded = nexacro._isEmbeddedWindow(root_win);

                if (is_embedded)
                    keydown_elem._event_stop = false;

                if (filter_type & 4 && parent._hasContainer())
                {
                    next = parent;
                }
                else
                {
                    var parent_tabstop_childs = parent._getComponentsByTaborder(parent, filter_type);
                    var parent_tabstop_child_cnt = parent_tabstop_childs ? parent_tabstop_childs.length : 0;
                    // var parent_comps = parent.components;
                    if (opt_cycle == false && (parent._is_frame || this._is_window) &&
                        (tabkeycirculation != 2 && tabkeycirculation != 3 || this._is_window))
                        ret = [null, this, -1];
                    else if ((parent._hasContainer() && parent_tabstop_child_cnt > 0) ||
                        ((tabkeycirculation == 2 || tabkeycirculation == 3) &&
                            this._p_parent instanceof nexacro.ChildFrame && !this._p_parent._window))
                        ret = parent._searchPrevTabFocus(this, undefined, undefined, filter_type);
                    else
                        next = this._getTabOrderLast(filter_type);
                }

            }
        }
        else
        {
            // Div인데 Child가 없거나, 
            // Div의 Next Comp에서 이동하는 경우..
            if (!bSearchFromLast)
            {
                if (this instanceof nexacro.PopupDiv)
                    next = this._getTabOrderLast(filter_type);
                else if (this._p_parent._is_form)
                {
                    ret = this._p_parent._searchPrevTabFocus(this, undefined, undefined, filter_type);
                }
                else
                    ret = null;
            }

            if (!ret)
            {
                next = this._getTabOrderLast(filter_type);
                if (!next)
                {
                    if (ret !== null)
                    {
                        if (this._checkContainerTabFocus() == true)
                            ret = [this];
                        else
                        {
                            ret = parent._searchPrevTabFocus(this, undefined, undefined, filter_type);
                        }
                    }
                    else
                    {
                        // if (this._checkContainerTabFocus() == true)
                        //    ret = [this];
                        if ((tabkeycirculation == 2 || tabkeycirculation == 3) && this._p_parent && this._p_parent._is_frameset)
                        {
                            // this._p_parent = FrameSet
                            var _tabkeycirculation = this._p_parent._tabkeycirculation;
                            var _frames = this._p_parent.frames;
                            var n = _frames ? _frames.length : 0;
                            var _childframe = null;
                            var _frameset_idx = -1;
                            var _idx = -1;
                            for (var i = n - 1; i >= 0; i--)
                            {
                                if (_frames[i] instanceof nexacro.ChildFrame)
                                {
                                    if (this.id == _frames[i].id)
                                    {
                                        _idx = i;
                                    }
                                    else if (_idx != -1)
                                    {
                                        if (_frames[i]._isFocusAcceptable())
                                        {
                                            if (!(this._p_parent instanceof nexacro.FrameSet) ||
                                                (this._p_parent instanceof nexacro.FrameSet &&
                                                    ((_tabkeycirculation == 3 && this._p_parent._arrange != 0) ||  // auto, cascade일때는 skip
                                                        _tabkeycirculation == 0 ||
                                                        (_tabkeycirculation == 1 && _frames[i]._state_openstatus != 2)) ||  // minimize제외
                                                    _tabkeycirculation == 2 && _frames[i]._activate))    // active_only
                                            {
                                                if (_frames[i]._p_form && _frames[i].formurl)
                                                {
                                                    _childframe = _frames[i];
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                else if (_frames[i]._is_frameset && _frames[i]._isFocusAcceptable())
                                {
                                    if (_idx > i)
                                    {
                                        _frameset_idx = i;
                                        break;
                                    }
                                }
                            }

                            if (!_childframe)
                            {
                                var _prev_frame_ = null;
                                if (_frameset_idx != -1)
                                {
                                    _childframe = _frames[_frameset_idx]._getPrevChildFrame(_frames[_frameset_idx].frames);
                                    if (_childframe)
                                    {
                                        next = _childframe._p_form ? _childframe._p_form._getTabOrderLast(filter_type) : null;
                                        if (!next)
                                            next = _childframe._p_form;
                                    }
                                }
                                else
                                {
                                    // 상위 frameset,frame 검색
                                    var pp = this._p_parent._p_parent;
                                    if (pp && pp._getPrevFrame_)
                                        _prev_frame_ = pp._getPrevFrame_(this._p_parent.id, opt_cycle);
                                    else
                                    {
                                        // this._p_parent._p_parent는 MainFrame
                                        // 가장 끝에 있는 ChildFrame구해와야 한다.
                                        if (tabkeycirculation == 2)
                                        {
                                            if (this._p_parent._getPrevChildFrame)
                                            {
                                                _prev_frame_ = this._p_parent._getPrevChildFrame(this._p_parent.frames);
                                            }
                                        }
                                    }
                                    if (_prev_frame_)
                                    {
                                        if (_prev_frame_ instanceof nexacro.ChildFrame)
                                        {
                                            if (tabkeycirculation == 3)
                                            {
                                                if (this._p_form == _prev_frame_._p_form)
                                                {
                                                    next = _prev_frame_._p_form ? _prev_frame_._p_form._getTabOrderFirst(filter_type) : null;
                                                    if (!next)
                                                        next = _prev_frame_._p_form;

                                                }
                                                else
                                                    next = _prev_frame_._p_form ? _prev_frame_._p_form._getTabOrderLast(filter_type) : null;
                                            }
                                            else
                                            {
                                                next = _prev_frame_._p_form ? _prev_frame_._p_form._getTabOrderLast(filter_type) : null;
                                                if (!next)
                                                    next = _prev_frame_._p_form;
                                            }
                                        }
                                        else
                                        {
                                            ret = _prev_frame_._searchPrevTabFocus(_prev_frame_, undefined, undefined, filter_type);
                                        }
                                    }
                                    else
                                    {
                                        // TODO
                                    }
                                }
                            }
                            else
                            {
                                next = _childframe._p_form ? _childframe._p_form._getTabOrderLast(filter_type) : null;
                                if (!next)
                                    next = _childframe._p_form;
                            }
                        }
                        else
                        {
                            if (parent && parent._searchPrevTabFocus)
                            {
                                ret = parent._searchPrevTabFocus(this, undefined, undefined, filter_type);
                            }
                            else
                            {
                                ret = null;
                            }
                        }
                    }
                }
            }
        }

        if (next)
        {
            var next_tabstop_childs = (next._hasContainer() ? next._getComponentsByTaborder(next, filter_type) : null);
            var next_tabstop_child_cnt = next_tabstop_childs ? next_tabstop_childs.length : 0;
            if (next._hasContainer() && next_tabstop_child_cnt > 0)
            {
                if (this._p_parent === next)
                    return [next];

                ret = next._searchPrevTabFocus(null, true, undefined, filter_type);
            }
            else
                ret = [next];
        }

        return ret;
    };

    _pFormBase._setPos = function (left, top)
    {
        if (this._adjust_left != left || this._adjust_top != top)
        {
            this._p_left = left;
            this._p_top = top;

            this._setAdjustPosition(left, top);

            if (this._p_parent)
                this._adjustPosition(this._p_left, this._p_top, this._p_right, this._p_bottom, this._p_width, this._p_height, this._p_parent._getClientWidth(), this._p_parent._getClientHeight());
            else
                this._adjustPosition(this._p_left, this._p_top, this._p_right, this._p_bottom, this._p_width, this._p_height, 0, 0);

            this.on_update_position(false, true);
        }
    };

    _pFormBase._setSize = function (width, height, update)
    {
        if ((this._adjust_width != width || this._adjust_height != height) || nexacro.__isDeactivate())
        {
            this._adjust_width = this._p_width = width;
            this._adjust_height = this._p_height = height;

            if (this._p_parent)
                this._adjustPosition(this._p_left, this._p_top, this._p_right, this._p_bottom, this._p_width, this._p_height, this._p_parent._getClientWidth(), this._p_parent._getClientHeight());
            else
                this._adjustPosition(this._p_left, this._p_top, this._p_right, this._p_bottom, this._p_width, this._p_height, 0, 0);

            this.on_update_position(true, false, update);
        }
    };

    _pFormBase._initLayoutManager = nexacro._emptyFn;

    _pFormBase._on_prepare_stepcontents = function (stepcount, stepindex)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            if (this._is_created)
            {
                var step_ctrl = this._p_stepselector;
                var step_ctrl_cnt = step_ctrl ? step_ctrl._p_stepcount : 0;
                if (step_ctrl_cnt > 0 || stepcount > 0)
                {
                    var comps = this._p_components;
                    var comp_len = comps.length;
                    for (var i = 0; i < comp_len; i++)
                    {
                        if (comps[i]._is_group)
                            continue;
                        var comp_elem = comps[i].getElement();
                        control_elem.removeChildElement(comp_elem);
                    }
                }
            }

            control_elem.setElementStepCount(stepcount);
            control_elem.setElementStepIndex(stepindex);
            if (stepindex > -1 && control_elem._step_count > stepindex)
            {
                control_elem.setElementHScrollPos(control_elem.client_width * stepindex);
            }
        }
    };

    _pFormBase._on_refresh_stepcontents = function (stepcount, stepindex)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            if (this._is_created)
            {
                var step_ctrl = this._p_stepselector;
                var step_ctrl_cnt = step_ctrl ? step_ctrl._p_stepcount : 0;
                if (step_ctrl_cnt > 0 || stepcount > 0)
                {
                    var comps = this._p_components;
                    var comp_len = comps.length;
                    for (var i = 0; i < comp_len; i++)
                    {
                        if ((comps[i].positionstep < stepcount) || stepcount == 0)
                        {
                            if (!comps[i]._is_created || comps[i]._p_positionstep >= step_ctrl_cnt)
                            {
                                comps[i].on_created();
                            }
                            var comp_elem = comps[i].getElement();
                            control_elem.appendChildElement(comp_elem);
                        }
                    }
                }
            }
        }

        if (!this._p_stepselector)
        {
            if (stepcount > 0)
            {
                this._createStepControl(stepcount, stepindex);
                if (this._is_created)
                {
                    this._p_stepselector.on_created();
                }
            }
        }
        else
        {
            if (this._p_stepselector.stepcount != stepcount)
            {
                this._p_stepselector.set_stepcount(stepcount);
                this._p_stepselector.set_stepindex(stepindex);
            }
        }
    };

    _pFormBase._on_restore_stepscroll = function (obj)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            //form scroll
            this._onRecalcScrollSize();
            this._onResetScrollBar();
            var stepindex = obj._p_stepindex;
            var client_elem = control_elem.getContainerElement(stepindex);
            var client_scroll_pos = client_elem._scroll_top;

            if (this._vscroll_pos != client_scroll_pos)
            {
                this._scrollTo(null, client_scroll_pos, undefined, undefined, undefined, "stepchange");
            }
        }
    };

    _pFormBase._createStepControl = function (stepcnt, stepidx)
    {
        if (!this._p_stepselector)
        {
            var step_ctrl = this._p_stepselector = new nexacro.StepControl("stepselector", 0, 0, 0, 0, null, null, null, null, null, null, this);
            step_ctrl.set_stepcount(stepcnt);
            step_ctrl.set_stepindex(stepidx);
            step_ctrl.set_stepitemsize(this._p_stepitemsize);
            step_ctrl.set_stepitemgap(this._p_stepitemgap);

            step_ctrl.createComponent(true);

            this._setEventHandler("onstepchanged", this._on_stepchanged, this);
        }
    };

    _pFormBase._recalcStepLayout = function ()
    {
        var control_elem = this.getElement();
        var step_ctrl = this._p_stepselector;
        if (control_elem && step_ctrl)
        {
            var form_width = this._getClientWidth();
            var form_height = this._getClientHeight();
            var step_area = step_ctrl._getItemAreaSize();

            var parts = this._p_stepalign.split(/\s+/);
            var halign = parts[0];
            var valign = parts[1];

            var left, top;
            var border = this._getCurrentStyleBorder();
            var border_l = 0, border_t = 0, border_r = 0, border_b = 0;
            if (border)
            {
                border_l = border.left._width;
                border_t = border.top._width;
                border_r = border.right._width;
                border_b = border.bottom._width;
            }

            switch (halign)
            {
                case "left":
                    left = border_l;
                    break;
                case "center":
                    left = (form_width - step_area.width - border_l - border_r) / 2;
                    break;
                case "right":
                    left = form_width - step_area.width - border_r;
                    break;
            }

            switch (valign)
            {
                case "top":
                    top = 0;
                    break;
                case "middle":
                    top = (form_height - step_area.height - border_t - border_b) / 2;
                    break;
                case "bottom":
                    top = form_height - step_area.height - border_b;
                    break;
            }

            step_ctrl.move(left, top, step_area.width, step_area.height, null, null);


        }
    };

    _pFormBase._on_stepchanged = function (/*obj, e*/)
    {
        // stepindex가 바뀌는 모든 상황
        var stepselector = this._p_stepselector;
        var control_elem = this.getElement();
        if (stepselector && control_elem)
        {
            // Touch Slide로 바뀐 경우 이미 애니메이션 종료 시점임.
            var zoomFactor = this._getZoom() / 100;
            var client_width = control_elem.client_width / zoomFactor;

            var is_invalid_pos = (control_elem.scroll_left != (client_width * stepselector.stepindex));
            if (!is_invalid_pos)
                return;

            this._createStepChangeAnimation(stepselector.stepindex, 400);
        }
    };

    _pFormBase._createStepChangeAnimation = function (target_index, duration)
    {
        if (this._stepchange_info)
        {
            this._on_cancel_stepchange_animation();
        }

        var control_elem = this.getElement();
        if (control_elem)
        {
            var info = {};
            info.is_alive = true;
            info.target_index = target_index;
            info.starttime = new Date().getTime();
            info.duration = duration;
            //var zoomFactor = this._getZoom() / 100;
            var hscroll_step = control_elem.hscroll_limit / (control_elem._step_count - 1);
            info.startpos = control_elem.scroll_left;
            info.endpos = hscroll_step * target_index;

            if (this._p_stepshowtype == "action")
            {
                var stepselector = this._p_stepselector;
                if (stepselector)
                {
                    stepselector.set_visible(true);
                }
            }

            var comps = this._p_components;
            var comp_len = comps.length;
            for (var i = 0; i < comp_len; i++)
            {
                comps[i].on_apply_positionstep();
            }

            var pThis = this;
            info.timer = new nexacro.AnimationFrame(this, function () { pThis._on_stepchange_animation(); });
            info.timer.start();

            this._stepchange_info = info;
        }
    };

    _pFormBase._on_stepchange_animation = function ()
    {
        var control_elem = this.getElement();
        if (!control_elem)
            return;

        var info = this._stepchange_info;
        if (info && info.is_alive)
        {
            var t = new Date().getTime() - info.starttime; // 0 ~ duration
            var d = info.duration;
            var q = t / d - 1;
            var c = Math.min((q * q * q + 1), 1); // Curve3Out Interpolation
            var curpos = info.startpos + ((info.endpos - info.startpos) * c);

            control_elem.setElementHScrollPos(curpos);
            if (t >= info.duration)
            {
                this._on_end_stepchange_animation();
            }
            else
            {
                info.timer.start();
            }
        }
    };

    _pFormBase._on_end_stepchange_animation = function ()
    {
        var info = this._stepchange_info;
        if (!info)
            return;

        info.is_alive = false;
        if (info.timer)
            info.timer.stop();

        var control_elem = this.getElement();
        var stepselector = this._p_stepselector;
        if (control_elem && stepselector)
        {
            var new_index = info.target_index;
            info = null;

            //control_elem.setElementStepIndex(new_index);
            var hscroll_step = control_elem.hscroll_limit / (control_elem._step_count - 1);
            control_elem.setElementHScrollPos(hscroll_step * new_index);

            this.on_apply_stepshowtype(this._p_stepshowtype);
            this._stepchange_info = null;
            this.resetScroll();
        }
    };

    _pFormBase._on_cancel_stepchange_animation = function ()
    {
        // 수행도중 다른 Animation 요청이 있으면....
        var info = this._stepchange_info;
        if (!info)
            return;

        info.is_alive = false;
        if (info.timer)
            info.timer.stop();
        info = null;
        this._stepchange_info = null;
    };

    _pFormBase._processArrowKey = function (bdown, newfocus_comp)
    {
        if (newfocus_comp[0] instanceof nexacro.Form && newfocus_comp[0]._last_focused)
        {
            var win = this._getWindow();
            win._removeFromCurrentFocusPath(newfocus_comp[0]._last_focused);
        }
        var dir = 2;
        if (!bdown)
            dir = 3;
        newfocus_comp[0]._setFocus(true, dir, false);
        //TODO
        var env = this._env, comp, _label;
        if (env.accessibilityfirstovermessage && newfocus_comp[0] == this._getTabOrderFirst())
        {
            comp = newfocus_comp[0];
            _label = comp._getAccessibilityReadLabel() + " " + env.accessibilityfirstovertext;
            comp.getElement().notifyAccessibility(_label, "focus");
        }
        else if (env.accessibilitylastovermessage && newfocus_comp[0] == this._getTabOrderLast())
        {
            comp = newfocus_comp[0];
            _label = comp._getAccessibilityReadLabel() + " " + env.accessibilitylastovertext;
            comp.getElement().notifyAccessibility(_label, "focus");
        }
    };

    _pFormBase._processHotkey = function (keycode, altKey, ctrlKey, shiftKey, obj)
    {
        // for tab
        var parent = null;
        if (obj) parent = obj._p_parent;

        // Hotkey를 설정한 컴포넌트를 등록순으로 탐색
        var hotkey_list = this._hotkey_list;
        for (var i = 0; i < hotkey_list.length; i++)
        {
            var hotkey_info = hotkey_list[i];
            if (hotkey_info[1] == keycode &&
                hotkey_info[2] == altKey &&
                hotkey_info[3] == ctrlKey &&
                hotkey_info[4] == shiftKey)
            {
                var comp = hotkey_info[0];
                // for tab(현재 보이는 tabpage의 component hotkey가 동작되어야함)
                if (parent && parent instanceof nexacro.Tabpage && obj != comp && comp._p_parent instanceof nexacro.Tabpage)
                    continue;

                if (!comp._p_enable) return true;

                comp._on_hotkey(keycode, altKey, ctrlKey, shiftKey);
                return true;
            }
        }

        // Modal인 경우만 return 하도록.. Modeless는 허용.
        if (this._is_frame && this._is_window && (this._window_type == 1 || this._window_type == 4))
            return;

        var owner_frame = this.getOwnerFrame();
        if (owner_frame)
        {
            return owner_frame._processHotkey(keycode, altKey, ctrlKey, shiftKey);
        }
    };

    _pFormBase._appendBeforeCloseMsg = function (current_message, new_message)
    {
        if (typeof (new_message) == "boolean")
            new_message = nexacro._toString(new_message);

        if (new_message === undefined || new_message == "" || new_message === null)
            return current_message;

        if (current_message === undefined || current_message === null)
            current_message = "";
        else if (current_message != "")
            current_message += "\n";

        return (current_message + new_message);
    };

    _pFormBase._checkAndConfirmClose = function (confirm_message)
    {
        if (confirm_message === undefined || confirm_message == "" || confirm_message === null)
            return true;

        if (this._window && this._window._ignore_close_confirm)
            return true;

        return nexacro._confirm(this, confirm_message);
    };

    _pFormBase._setFittocontents = function (v)
    {
        this._fittocontents = v;
    };

    _pFormBase = null;


    //==============================================================================
    // nexacro.Form
    //==============================================================================
    nexacro.Form = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, is_main = false)
    {
        nexacro.FormBase.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._chk_recalc_scroll = [];

        this._trigger_manager = new nexacro.TriggerManager(this);
        this._is_main = is_main;
    };

    var _pForm = nexacro._createPrototype(nexacro.FormBase, nexacro.Form);
    nexacro.Form.prototype = _pForm;
    _pForm._type_name = "Form";

    /* default properties */
    _pForm._p_layout = "";
    _pForm._p_opener = null;
    _pForm._p_statustext = "";
    _pForm._p_titletext = "";
    _pForm._p_stepalign = "center bottom";
    _pForm._p_stepitemgap = undefined;
    _pForm._p_stepitemsize = undefined;
    _pForm._p_stepshowtype = "always";
    _pForm._p_locale = "";
    _pForm._p_accessibilityrole = "form";



    /* internal variable */
    _pForm._url = "";
    _pForm._locale = "";
    _pForm._init_status = 0;
    _pForm._init_width = 0;
    _pForm._init_height = 0;
    _pForm._defaultbutton = null;
    _pForm._escapebutton = null;

    _pForm._zoomFactor = undefined;
    _pForm._autofittedZoomFactor = undefined;

    _pForm._is_fired_onload = false;

    _pForm._is_flexible_container = false;
    _pForm._is_flexible_container_calculation = false;

    /* MFE ContainerHandle <div>*/
    _pForm.__containerhandle = null;
    /* MFE Root Node */
    _pForm._is_mfe_root = false;
    _pForm._activate = false; // activate status : true / false  

    /* event list */
    _pForm._event_list = {
        "onbindingvaluechanged": 1, "onclick": 1, "ondblclick": 1, "onkillfocus": 1, "onsetfocus": 1,
        "onkeypress": 1, "onkeydown": 1, "onkeyup": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmousewheel": 1, "onmousedown": 1, "onmouseup": 1,
        "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
        "onmove": 1, "onsize": 1,
        //"ongesture": 1,
        "ontouch": 1,
        //added event
        "onvscroll": 1, "onhscroll": 1, "onactivate": 1, "onbeforeclose": 1,
        "onclose": 1, "ondeactivate": 1, "onsyscommand": 1, "ontimer": 1, "oninit": 1, "onload": 1,
        "canlayoutchange": 1, "canstepchange": 1, "onlayoutchanged": 1, "onstepchanged": 1,
        "ondevicebuttonup": 1,
        // Touch,TouchGesture
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
        "onorientationchange": 1, "oncontextmenu": 1,
        "onerror": 1,
        //ExtensionAPIV2
        "onextendedcommand": 1,
        //State
        "onfetchstatedata": 1, "onrestorestatedata": 1
    };

    _pForm._getPrevHeadingComponent = nexacro._emptyFn;
    _pForm._getNextHeadingComponent = nexacro._emptyFn;

    _pForm._load = function (url)
    {
        // mfe root self
        this.loadForm(url);
        if (this._control_element)
        {
            this.createComponent();
        }

    };
    _pForm.on_create_contents = function ()
    {
        const app = this._getRootObject();

        if (this == app)
        {
            if (!app?._isLoaded())
            {
                this._on_focus(true);

            }
            const rect = nexacro._getContentRect(this.__containerhandle)
            this.move(rect.paddingLeft, rect.paddingTop, rect.contentsWidth, rect.contentsHeight);
            //this._setSize(rect.contentsWidth, );



        }
        nexacro.FormBase.prototype.on_create_contents.call(this);
    };
    _pForm.on_created_contents = function (win)
    {
        const app = this._getRootObject();
        if (this == app)
        {
            var control_element = this._control_element;
            if (control_element)
            {
                const env = nexacro.getEnvironment();
                control_element.setElementRtl(env._rtl);
            }
        }

        nexacro.FormBase.prototype.on_created_contents.call(this, win);

    };
    _pForm.destroyComponent = function (callremovechild)
    {
        let ret = nexacro.FormBase.prototype.destroyComponent.call(this, callremovechild);
        const app = this._getRootObject();
        if (this == app)
        {

            if (this._waitcomp)
            {
                this._waitcomp.destroy();
                this._waitcomp = null;
            }
            if (this._openalign)
            {
                this._openalign = null;
            }
            if (nexacro._com_waiting)
                nexacro._com_waiting = false;

            if (this._window && this._window._is_alive)
            {
                this._window.destroy();
                this._window = null;
            }
            return true;

        }

        return ret;


    };



    //===============================================================
    // nexacro.Form : Create & Destroy & Update
    //===============================================================
    _pForm._initComponent = function ()
    {
        nexacro.FormBase.prototype._initComponent.call(this);

        if (!this.parent)
        {
            this.createWindow();
            if (this._is_mfe_root)
            {
                const env = this._env;
                if (env && env._p_locale)
                    this._on_apply_locale(env._p_locale);

                if (this._is_window)
                    nexacro._checkWindowActive(this._window);
            }
        }
    };
    _pForm.createWindow = function ()
    {
        const parent = this._p_parent;
        if (!parent && nexacro.ismodule)
            this.__containerhandle = nexacro.__MFEAPI._getContainer(this);

        if (!this.__containerhandle)
            return;

        this._is_mfe_root = true;
        let _win = this._window;
        if (_win == null)
        {
            _win = this._window = new nexacro._Window(this.name, null, true);
            this._is_window = true;
        }

        _win.attachRoot(this, false, () =>
        {
            return _win.create(null, this._p_name, this._width, this._height, this._left, this._top, this._p_resizable);
        });
        // window는 그대로 생성하고 element에만 zoom을 적용한다.

        //이게 필요한가? Form은 parent의 size에 fit되지 않는 유형이다.
        //_win._setSystemMenuResizable(this._p_resizable);
        //this._setSize(nexacro._getMainWindowWidth(_win), nexacro._getMainWindowHeight(_win));
    }

    // overide create function
    _pForm.onCreateComponent = function (parent_elem)
    {
        if (this._is_loading)
            return false;

        if (this._createControlElement(parent_elem))
        {
            this._afterprocess_activate = true;
        }
        else
        {
            this._afterprocess_delayfocus = this._is_scrollable;
            this.oldscrollleft = this._control_element.scroll_left;
            this.oldscrolltop = this._control_element.scroll_top;

            this._changeControlElement(parent_elem);
        }

        this._initLayoutManager();
        this._initControlElement();
        this._applyProperties();
        this._applyAccessibility();
        this._calcBasisSize();
        this._initContents();

        return true;
    };
    _pForm.onCreateComponentAfter = function (parent_elem)
    {
        // delayfocus 처리
        if (this._delayedfocuscomp)
        {
            var window = this._getWindow();
            var parent = this._p_parent;
            var parent_type = (parent && parent._is_frame && parent._window_type == 5) ? "modal" : "normal";
            var control_elem = this.getElement();

            if (window)
            {
                if (this._afterprocess_delayfocus)
                {
                    this._afterprocess_delayfocus = false;
                    if (parent_type == "modal")
                    {
                        if (this.oldscrollleft != undefined)
                            control_elem.scroll_left = this.oldscrollleft;

                        if (this.oldscrolltop != undefined)
                            control_elem.scroll_top = this.oldscrolltop;

                        this._onResetScrollBar();
                    }
                }

                if (parent_type != "modal" && window._prepared_flag == true)
                {
                    this._delayedfocuscomp = null;
                    delete this._delayedfocuscomp;
                }
            }
            else
            {
                this._delayedfocuscomp = null;
                delete this._delayedfocuscomp;
            }
        }

        if (this._afterprocess_activate)
        {
            this._afterprocess_activate = false;

            if (this._is_created)
                this._on_activate();
        }
    };

    // overide created function
    _pForm.onCreatedAfter = function (resultCreated)
    {
        if (resultCreated)
        {
            if (this._p_stepselector && !this._p_stepselector.getElement())
            {
                this._p_stepselector.createComponent(true);
                this._p_stepselector.on_created();
                this.on_apply_stepshowtype(this._p_stepshowtype);
            }


            if (this._init_status == 1)
                this.on_fire_oninit(this);

            this.on_fire_onload(this, this._url);
        }
    };

    // overide init element function
    _pForm._initControlElementLayoutProps = function ()
    {
        var control_elem = this.getElement();

        this._calcArrangePosition();
        this._adjustPosition();

        // Form 기능
        if (this._adjust_height > 0 && this._adjust_width > 0)
            this._selectLayout();

        if (this._isFluidContainer() && !this._isFluidContainerCalculation() && this.getStepCount() < 1)
        {
            control_elem.setElementLayoutContainerProps();
        }

        control_elem.setElementPosition(this._adjust_left, this._adjust_top);
        control_elem.setElementSize(this._adjust_width, this._adjust_height);
    };

    // overide created element function
    _pForm._createdControlElementLayoutProps = function ()
    {
        if (this._is_flexible_container)
        {
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                manager.calcFluidLayoutContents(this);
            }
        }
    };

    // overide layout function
    _pForm.on_change_containerRect = function (width, height)
    {
        this._is_calculated = false;
        if (this._is_flexible_container)
        {
            if (this._is_created)
                this._on_change_containerRect_fluid(width, height);
        }
        else
        {
            this._on_change_containerRect_static(width, height);
        }
    };
    _pForm._on_change_containerRect_static = function (width, height)
    {
        var chk = this._chk_recalc_scroll;

        for (var i = 0, n = chk.length; i < n; i++) // recursive scroll check (arrangement comp._update_position)
        {
            if (chk[i].w == width && chk[i].h == height)
                return;
        }

        chk.push({ w: width, h: height });

        var comp;
        var comps = this._p_components;
        var _move_scroll = false;
        var comp_bottom, comp_scroll_pos, last_comp, form_bottom;

        if (nexacro._OS == "Android" && this.vscrollbar && this.vscrollbar._p_visible)
        {
            _move_scroll = true;
            last_comp = this._getLastFocused();
            form_bottom = this.getOffsetBottom();
        }

        var rtl = this._isRtl();
        for (i = 0, n = comps.length; i < n; i++)
        {
            comp = comps[i];
            if (comp._is_group)
                continue;
            if (comp._control_element)
            {
                if (_move_scroll && comp instanceof nexacro.Edit)
                {
                    comp_bottom = comp.getOffsetBottom();
                    comp_scroll_pos = comp_bottom - form_bottom;
                    if (this.vscrollbar.pos < comp_scroll_pos && form_bottom < comp_bottom && last_comp == comp)
                    {
                        this.vscrollbar.set_pos(comp_scroll_pos);
                    }
                }
                comp._update_position(rtl);
            }
        }

        if (this._p_stepselector)
        {
            this._recalcStepLayout();
            var control_elem = this.getElement();
            if (control_elem)
            {
                var stepcount = this._p_stepselector.stepcount;
                var stepindex = this._p_stepselector.stepindex;
                if (stepcount > 0 && stepindex >= 0)
                    control_elem.setElementHScrollPos(control_elem.client_width * this._p_stepselector.stepindex);
            }
        }

        if (this._is_scrollable)
        {
            this._onRecalcScrollSize();
            this._onResetScrollBar();
        }

        this._chk_recalc_scroll = [];
    };
    _pForm._on_change_containerRect_fluid = function ()
    {
        var comp;
        var comps = this._p_components;
        var _move_scroll = false;
        var comp_bottom, comp_scroll_pos, last_comp, form_bottom;

        if (nexacro._OS == "Android" && this.vscrollbar && this.vscrollbar._p_visible)
        {
            _move_scroll = true;
            last_comp = this._getLastFocused();
            form_bottom = this.getOffsetBottom();
        }

        var rtl = this._isRtl();
        for (var i = 0, n = comps.length; i < n; i++)
        {
            comp = comps[i];
            if (comp._is_group)
                continue;
            if (comp._control_element)
            {
                if (_move_scroll && comp instanceof nexacro.Edit)
                {
                    comp_bottom = comp.getOffsetBottom();
                    comp_scroll_pos = comp_bottom - form_bottom;
                    if (this.vscrollbar.pos < comp_scroll_pos && form_bottom < comp_bottom && last_comp == comp)
                    {
                        this.vscrollbar.set_pos(comp_scroll_pos);
                    }
                }
                comp._update_position(rtl);
            }
        }

        var manager = nexacro._getLayoutManager();
        if (manager)
        {
            manager.calcFluidLayoutContents(this);
        }

        if (this._is_scrollable)
        {
            this._onRecalcScrollSize();
            this._onResetScrollBar();
        }
    };

    // overide destroy function
    _pForm.on_destroy_contents = function ()
    {
        nexacro.FormBase.prototype.on_destroy_contents.call(this);

        this._chk_recalc_scroll = null;

        if (this._trigger_manager)
        {
            this._trigger_manager.destroy();
            this._trigger_manager = null;
        }
    };

    // overide reset function
    _pForm._resetObject = function ()
    {
        // manager object
        this._bind_manager = new nexacro.BindManager(this);
        this._load_manager = new nexacro._LoadManager(this);
        this._timerManager = new nexacro._TimerManager(this);
        this._trigger_manager = new nexacro.TriggerManager(this);

        // collection object
        this._p_all = new nexacro.Collection();
        this._p_components = new nexacro.Collection();
        this._p_objects = new nexacro.Collection();
        this._p_binds = new nexacro.Collection();
    };
    _pForm._resetProperties = function ()
    {
        // refform
        this._refform = this;

        // position
        this.init("form", 0, 0, this._p_parent._getClientWidth(), this._p_parent._getClientHeight());

        // inner var
        this._child_list = [];
        this._hotkey_list = [];
        this._includescriptlist = [];
        this._load_callbacklist = [];

        this._chk_recalc_scroll = [];
    };

    // form API
    _pForm._changeControlElement = function (parent_elem)
    {
        if (parent_elem && parent_elem.handle)
        {
            parent_elem.appendChildElement(this._control_element);
            this._control_element._p_parent = this;
            return true;
        }
        return false;
    };

    //===============================================================
    // nexacro.Form : Load
    //===============================================================
    //ie6 에서 cache되어 있는 화면을 가져올때 sync 처럼 동작하는 현상이 있어
    //application의 onload event 후에 form의 onload event를 발생시키기 위해 
    //application에 onload event 후에 호출할 form callbacklist를 달아놓는다.
    _pForm._on_load = function (obj, url)
    {
        if (!this._load_callbacklist) return;

        var parent_foraddcallback = this._p_parent;
        if (this._p_parent && this._p_parent.form == this && this._p_parent._is_frame)
        {
            //parent_foraddcallback = nexacro;  //childframe의 경우만 application에 추가하고 나머지는 parent form에 추가
            //parent_foraddcallback = this._getApplication();//_application;
            parent_foraddcallback = this._getRootObject();//_application;
        }

        if (parent_foraddcallback && parent_foraddcallback._addLoadCallbacklist)
        {
            var pthis = this;
            var ret = parent_foraddcallback._addLoadCallbacklist({ target: pthis, callback: pthis._on_loadcallback, url: this.url });
            if (!ret)
            {
                this._on_loadcallback(obj, url);
            }
        }
        else if (this._p_parent || nexacro.ismodule)
        {
            this._on_loadcallback(obj, url);
        }

    };

    _pForm._addLoadCallbacklist = function (item)
    {
        if (!this._is_loaded && this._url && this._url.length > 0)  //parent가 contents인 경우에 처리 
        {
            if (!this._p_parent._load_callbacklist)
                this._p_parent._load_callbacklist = [];
            this._load_callbacklist.push(item);
            return true;
        }
        return false;
    };

    _pForm._on_loadcallback = function ()
    {
        var _window = this._getWindow();

        var callbacklist = this._load_callbacklist;
        var target;
        var n = callbacklist.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbacklist[i];
                target = item.target;
                var _url = item.url;
                if (target._is_alive != false)
                    item.callback.call(target, target, _url);
            }
            callbacklist.splice(0, n);
        }

        this.createComponent(true);

        this.on_fire_oninit(this);

        if (!this._is_created)
        {
            this.on_created(_window);
        }

        // focus와 상관없이 load되는 경우 activate가 되야 함. 
        if (this._is_created)
        {
            if (!(this instanceof nexacro.Tabpage) && (_window && !_window._bnoactivate))
            {
                this._on_activate();
            }
        }

        // for setfocus
        var parent = this._p_parent;
        if (parent)
        {
            if (parent._is_frame && parent._p_form == this)
            {
                // ChildFrame > Form
                parent._createdForm();
                if (parent._window_type != 2)  //not modeless
                {
                    var application = this._getApplication();
                    if (application)
                        application._notifyLoadforms(this);
                }
            }
            else
            {
                if (!_window)
                    _window = this._getRootWindow();

                if (_window && _window.root && _window.root._activate == true)
                {
                    var cur_focus_paths = _window.getCurrentFocusPaths();
                    target = this;
                    if (this instanceof nexacro._InnerForm)
                        target = parent;

                    const a11ywholereadtype = (this._env._p_enableaccessibility && this._env._a11ywholereadtype > 1);
                    if (cur_focus_paths && nexacro._indexOf(cur_focus_paths, target) > -1)
                    {
                        // TODO API로?
                        if (a11ywholereadtype)
                        {
                            this._playAccessibilityWholeReadLabel("wholeread");
                        }

                        this._on_focus(true);
                    }
                    else if (a11ywholereadtype)
                    {
                        this._playAccessibilityWholeReadLabel("wholeread");
                    }
                }
            }
        }
    };

    //===============================================================
    // nexacro.Form : Override
    //===============================================================
    _pForm._update_position = function (isrtl)
    {
        // form의 사이즈까지는 부모 기준으로 정적으로 계산해야함
        this._update_position_static(isrtl);

        if (!this._is_subcontrol && this._is_flexible_container)
        {
            // 계산된 form 기준으로 fluid 계산
            this._update_position_fluid();
        }
    };

    _pForm.on_update_position = function (resize_flag, move_flag, update)
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            control_elem.setElementPosition(this._adjust_left, this._adjust_top);

            if (resize_flag)
            {
                // form의 크기가 바뀌는 시점에 right,bottom 또는 % 좌표를 사용하는 child가 있을경우
                // 정렬 전에 scrollbar가 생길지 여부를 확정할 수가 없다.
                // (Nexacro 의 element는 max offset 값만 관리하기 때문에)

                // scrollbar가 생길지의 여부만 판단하기 위해 100% 기준 100% 이하인 값을 빼고
                // 최대 container size를 계산한다.

                // 무조건 리셋할것이 아니고 미리 계산할 방법이 필요하다..
                //control_elem.container_maxwidth = 0;
                //control_elem.container_maxheight = 0;
                var val = this._calcScrollMaxSize();
                control_elem._setElementContentsMaxSize(val.cw, val.ch);
                control_elem.container_maxwidth = val.w;
                control_elem.container_maxheight = val.h;
            }

            // elem.setElementSize
            //    elem._updateClientSize 를 수행
            //    -> elem._inner_width와 elem.container_maxwidth 등을 통해
            //       스크롤바가 보일지 여부, client size 조절
            //       스크롤바 크기 결정
            //       스크롤 정보 설정
            control_elem.setElementSize(this._adjust_width, this._adjust_height, update); // <-스크롤 갱신			

            // _updateClientSize
            //    client 크기 갱신 (element기준으로)
            //    child 컴포넌트 move처리 (adjustPosition 수행됨)
            //    _onRecalcScrollSize 호출
            //    -> 내 client 크기
            //  this._updateClientSize(control_elem);

            if (this._init_status < 2)
            {
                if (this._p_parent && this._p_parent._window_type == 5)
                    return;
            }

            if (move_flag)
            {
                this.on_fire_onmove(this._adjust_left, this._adjust_top);
            }
            if (resize_flag)
            {
                this.on_fire_onsize(this._adjust_width, this._adjust_height);
            }
        }
        const app = this._getRootObject();
        if (this == app)
        {
            if (this._is_window && (nexacro._Browser == "Runtime" ||
                (nexacro._allow_default_pinchzoom && !nexacro._isDesktop()) ||
                (nexacro._macOSWebView)))
            {
                var _window = this._window;
                if (_window)
                {
                    if (resize_flag)
                    {
                        // 모바일 Runtime인 경우 setSize는 무시 (view에 fit해야함)
                        if (nexacro._isDesktop() && update != undefined)
                            _window.setSize(this._adjust_width, this._adjust_height);
                    }

                    if (move_flag)
                    {
                        // adjustPosition에서 adjust_left,top은 0으로 보정하고 있다.
                        // (0이 아니면 내부적으로 밀리게됨)
                        _window.moveTo(this._left, this._top);
                    }
                }
            }
        }

    };

    _pForm.on_apply_prop_stringresource = function ()
    {
        if (!nexacro._StringResource)
            return;

        nexacro.Component.prototype.on_apply_prop_stringresource.call(this);

        if (nexacro.isDesignMode)
            return;

        if (!(this instanceof nexacro._InnerForm))
        {
            this._p_parent._applyStatusText();
            this._p_parent._applyTitleText();
        }
    };

    //==============================================================================
    // nexacro.Form : Properties
    //==============================================================================
    _pForm.set_opener = nexacro._emptyFn;

    _pForm.set_layout = nexacro._emptyFn;

    _pForm.set_statustext = function (v)
    {
        var parent = this._p_parent;
        if (parent && parent._is_frame)
        {
            if (this._p_statustext != v)
            {
                this._p_statustext = v;
                parent._applyStatusText();
            }
        }
        else
            this._p_statustext = v;
    };

    _pForm.set_titletext = function (v)
    {
        //this._setAccessibilityLabel(v);

        if (this._p_parent && this._p_parent._is_frame)
        {
            if (this._p_titletext != v)
            {
                this._p_titletext = v;
                this._p_parent._applyTitleText();
            }
        }
        else
            this._p_titletext = v;
    };

    _pForm.set_dragscrolltype = function (v)
    {
        /*
        none : 동작안함
        vert : 수직방향으로만 동작
        horz : 수평방향으로만 동작
        both : 수직,수평방향으로만 동작
        all  : 수직,수평,대각선 방향 모두 동작 (default)
        */
        var dragscrolltype_enum = ["none", "vert", "horz", "both", "all"];
        if (dragscrolltype_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_dragscrolltype != v)
        {
            this._p_dragscrolltype = v;
        }
    };

    _pForm.set_locale = function (v)
    {
        if (this._p_locale != v)
        {
            this._p_locale = v;
            this._locale = v;
            this.on_apply_locale(v);
        }
    };

    _pForm.on_apply_locale = function (locale)
    {
        var i, n, comp;
        var comps = this._p_components;

        for (i = 0, n = comps.length; i < n; i++)
        {
            comp = comps[i];
            if (comp._is_locale_control)
            {
                comp._setLocale(locale);
            }
        }
    };

    _pForm.set_stepalign = function (v)
    {
        var halign_enum = ["left", "center", "right"];
        var valign_enum = ["top", "middle", "bottom"];

        var parts1 = v.split(/\s+/);
        var parts2 = this._p_stepalign.split(/\s+/);

        if (halign_enum.indexOf(parts1[0]) > -1)
            parts2[0] = parts1[0];

        if (valign_enum.indexOf(parts1[1]) > -1)
            parts2[1] = parts1[1];

        v = parts2.join(" ");

        if (this._p_stepalign != v)
        {
            this._p_stepalign = v;
            this.on_apply_stepalign(v);
        }
    };

    _pForm.on_apply_stepalign = function (/*stepalign*/)
    {
        this._recalcStepLayout();
    };

    _pForm.set_stepitemgap = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v))
            {
                return;
            }
        }

        if (this._p_stepitemgap != v)
        {
            this._p_stepitemgap = v;
            this.on_apply_stepitemgap(v);
        }
    };

    _pForm.on_apply_stepitemgap = function (stepitemgap)
    {
        var step_ctrl = this._p_stepselector;
        if (step_ctrl)
        {
            step_ctrl.set_stepitemgap(stepitemgap);
        }
    };

    _pForm.set_stepitemsize = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v))
            {
                return;
            }
        }

        if (this._p_stepitemsize != v)
        {
            this._p_stepitemsize = v;
            this.on_apply_stepitemsize(v);
        }
    };

    _pForm.on_apply_stepitemsize = function (stepitemsize)
    {
        var step_ctrl = this._p_stepselector;
        if (step_ctrl)
        {
            step_ctrl.set_stepitemsize(stepitemsize);
        }
    };

    _pForm.set_stepshowtype = function (v)
    {
        var stepshowtype_enum = ["always", "action"];
        if (stepshowtype_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_stepshowtype != v)
        {
            this._p_stepshowtype = v;
            this.on_apply_stepshowtype(v);
        }
    };

    _pForm.on_apply_stepshowtype = function (stepshowtype)
    {
        var step_ctrl = this._p_stepselector;
        if (step_ctrl)
        {
            switch (stepshowtype)
            {
                case "action":
                    step_ctrl.set_visible(false);
                    break;
                case "always":
                default:
                    step_ctrl.set_visible(true);
                    break;
            }
        }
    };

    _pForm.on_apply_prop_enable = function (enable)
    {
        nexacro.Component.prototype.on_apply_prop_enable.call(this, enable);

        var i, n, comp;
        var comps = this._p_components;

        for (i = 0, n = comps.length; i < n; i++)
        {
            comp = comps[i];
            comp._setEnable(enable);
        }

        if (enable == true)
        {
            var root_form = this._getRootForm();
            var form = this;
            while (form)
            {
                var binds = form._p_binds;
                if (binds && binds.length > 0)
                    this._applyBinditemEnable(binds);
                if (root_form == form || form instanceof nexacro.ChildFrame)
                    break;
                form = form._getParentForm();
            }
        }
    };

    _pForm.set_visible = function (v)
    {
        if (v === undefined || v === null) return;
        v = nexacro._toBoolean(v);

        if (this._p_visible != v)
        {
            nexacro.Component.prototype.set_visible.call(this, v);

            const app = this._getRootObject();
            if (this == app)
            {
                var _win = this._getRootWindow();
                if (_win && _win.handle)
                {
                    nexacro._setPopupWindowHandleVisible(_win.handle, v);
                }
            }

        }
    }




    //===============================================================
    // nexacro.Form : Event Handlers
    //===============================================================
    _pForm._on_activate = function ()
    {

        if (!this._isMainForm())
        {
            if (!this._p_parent)
                return;

            var owner_frame = this.getOwnerFrame();
            if (!owner_frame || !owner_frame._activate)
                return;
        }
        else
        {
            this._activate = true;
        }

        nexacro.FormBase.prototype._on_activate.call(this);
    };

    _pForm._on_deactivate = function ()
    {
        const app = this._getRootObject();
        if (this == app)
        {
            if (this._is_window && this._window)
            {
                this._window._keydown_element = null;
                this._window._keydown_element_list.clear();
            }
        }


        if (!this._isMainForm())
        {
            if (!this._p_parent)
                return;

            var owner_frame = this.getOwnerFrame();
            if (!owner_frame || owner_frame._activate)
                return;
        }
        else
        {
            this._activate = false;
        }

        nexacro.FormBase.prototype._on_deactivate.call(this);
    };

    _pForm._on_starttrack = function ()
    {
        if (!this._is_alive)
            return false;
        if (nexacro._isTouchInteraction) //Can't dragmove
            return false;
        var ownerframe = this.getOwnerFrame();
        if (ownerframe)
            return ownerframe._on_titlebar_starttrack();

        return false;
    };

    _pForm._on_endtrack = function (x, y, dragdata)
    {
        if (!this._is_alive) return;
        var ownerframe = this.getOwnerFrame();
        if (ownerframe)
            ownerframe._on_titlebar_endtrack(x, y, dragdata);
    };

    _pForm._on_movetrack = function (x, y, dragdata, windowX, windowY)
    {
        if (!this._is_alive) return;
        var ownerframe = this.getOwnerFrame();
        if (ownerframe)
            ownerframe._on_titlebar_movetrack(x, y, dragdata, windowX, windowY);
    };

    _pForm._on_orientationchange = function (orientation)
    {
        this.on_fire_onorientationchange(orientation);

        var i, n, comp;
        var comps = this._p_components;

        for (i = 0, n = comps.length; i < n; i++)
        {
            comp = comps[i];
            if (comp._hasContainer() && comp._on_orientationchange)
                comp._on_orientationchange(orientation);
        }

    };

    _pForm.on_fire_sys_onrbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key) // 2013-09-04 pss - eventflow 
    {
        var ret = nexacro.Component.prototype.on_fire_sys_onrbuttonup.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        nexacro._quickview_mode = true;
        if (nexacro._quickview_mode && ret !== true && this._p_parent instanceof nexacro.ChildFrame)
        {
            //Edit류는 contextmenu를 띄워야 하기 땜에 quickview메뉴를 띄우지 않도록 수정.
            if (from_refer_comp && !from_refer_comp._input_element)
                return nexacro._showQuickviewMenu(this, screenX, screenY);
        }
        return ret;
    };

    _pForm.on_fire_user_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)
    {
        if (!this._is_alive)
            return;

        var newfocus_comp;
        var lastfocus_comp = this._last_focused;
        var focusedComp = refer_comp; // 이미 focus가 옮겨갔을 수 있기때문에 refer_comp

        // TODO check Tab,Enter,Esc는 keydown보다 먼저 처리되어야 하는것이 아닌지? (PretranslateMsg)
        if (!focusedComp)
            focusedComp = this.getFocus();
        if (!focusedComp)
            focusedComp = this;
        if (focusedComp)
        {
            // Pass SubControl
            focusedComp = focusedComp._getRootComponent(focusedComp);
            if (!focusedComp)       // event 처리 중 destroy 된 경우
                return;
        }

        var win = this._getWindow();
        var root_win = this._getRootWindow();
        var env = this._env;

        var keydown_elem = root_win._keydown_element;
        var dlgc = focusedComp._getDlgCode(keycode, alt_key, ctrl_key, shift_key);

        if (keycode == nexacro.Event.KEY_TAB)
        {
            if (!dlgc.want_tab && this._isComponentKeydownAction()) // tab을 직접 처리하는 컴포넌트는 제외
            {
                if (keydown_elem)
                    keydown_elem._event_stop = true;

                if (!shift_key)
                    newfocus_comp = this._searchNextTabFocus(this._last_focused, undefined, undefined, 0);
                else
                    newfocus_comp = this._searchPrevTabFocus(this._last_focused, undefined, undefined, 0);

                if (newfocus_comp)
                {
                    if (newfocus_comp[0])
                    {
                        if (newfocus_comp[0]._hasContainer() && newfocus_comp[0]._last_focused)
                            win._removeFromCurrentFocusPath(newfocus_comp[0]._last_focused);

                        // newfocus_comp가 최종 포커스 받을 대상이 된다.
                        // newfocus_comp가 Container Type인 경우, 내부 컴포넌트가 모두 포커스를 받을 수 없는
                        // 상황이다. 이 경우 더이상 내부로 진입시키면 안된다. -> block_inner_focus = true                   
                        newfocus_comp[0]._setFocus(true, (!shift_key ? 0 : 1), true);
                    }
                    else if (newfocus_comp[2] == -1)
                    {
                        if (lastfocus_comp) //크롬에서 읽어주지 않아 3번째 파라미터 "notify"를 줌.
                            lastfocus_comp.getElement().notifyAccessibility(env.accessibilityfirstovertext, "notify", true);
                    }
                    else if (newfocus_comp[2] == 1)
                    {
                        if (lastfocus_comp)
                            lastfocus_comp.getElement().notifyAccessibility(env.accessibilitylastovertext, "notify", true);
                    }
                }

                return true; // bubble되어 또 호출되면 안됨. 
            }
        }
        else if (keycode == nexacro.Event.KEY_RETURN)
        {
            // Button에 Focus된 경우 Focus된 Button이 클릭되어야 함. 이 동작은 dlgcode로 처리 want_return=true
            // 팝업 컴포넌트인경우 팝업되어있으면 Defaultbutton보다 우선으로 EnterKey를 받아야함. ( Calendar,Combo,Menu,Grid )
            if (!dlgc.want_return)
            {
                if (this instanceof nexacro.Form)
                {
                    var defaultbutton = this._defaultbutton;
                    if (!focusedComp._isPopupVisible())
                    {
                        if (defaultbutton && defaultbutton.enableevent && defaultbutton._isEnable())
                            defaultbutton._click(keycode);
                    }
                }
            }
        }
        else if (keycode == nexacro.Event.KEY_ESC)
        {
            // 현재 Window에 포함된 모든 Form,Div의 Transcantion 취소 -> 통신 취소가 되었을때는 EscapeButton을 처리하지 않아야 한다.
            if (nexacro._stopTransaction(this, 1) <= 0 && !dlgc.want_escape)
            {
                if (this instanceof nexacro.Form)
                {
                    var escapebutton = this._escapebutton;
                    if (escapebutton && escapebutton.enableevent && escapebutton._isEnable())
                        escapebutton._click(keycode);
                }
            }
        }


        if (env._p_enableaccessibility && this._isComponentKeydownAction())
        {
            var filter_type;
            if (keycode == nexacro.Event.KEY_DOWN && !alt_key && !ctrl_key && !shift_key) // || keycode == nexacro.Event.KEY_UP)
            {
                filter_type = 7 + 8;
                // if (this._last_focused && this._last_focused._hasContainer() && !this._last_focused._is_form)
                //     filter_type = 3;

                // filter_type += 8; // filter component that accessibilityenable is true;
                //****  if (keycode == nexacro.Event.KEY_TAB) 윗부분과 동기화되어야됨
                if (!dlgc.want_arrows && env._p_accessibilitycontentsearchkey) // arrow를 직접 처리하는 컴포넌트는 제외
                {
                    if (lastfocus_comp && lastfocus_comp._hasContainer())
                        newfocus_comp = lastfocus_comp._searchNextTabFocus(null, true, undefined, filter_type);
                    else
                        newfocus_comp = this._searchNextTabFocus(lastfocus_comp, undefined, undefined, filter_type);
                    if (newfocus_comp && newfocus_comp[0])
                    {
                        if (newfocus_comp[0]._hasContainer() && newfocus_comp[0]._last_focused)
                        {
                            var _win = this._getWindow();
                            _win._removeFromCurrentFocusPath(newfocus_comp[0]._last_focused);
                        }

                        newfocus_comp[0]._setFocus(true, 2, true);
                    }

                    if (keydown_elem)
                        keydown_elem._event_stop = true;

                    return true; // bubble되어 또 호출되면 안됨. 
                }
            }
            else if (keycode == nexacro.Event.KEY_UP && !alt_key && !ctrl_key && !shift_key)
            {
                if (!dlgc.want_arrows && env._p_accessibilitycontentsearchkey) // arrow를 직접 처리하는 컴포넌트는 제외
                {
                    filter_type = 7;
                    var first_comp = this._getTabOrderFirst(7);

                    filter_type += 8;

                    if (this instanceof nexacro._InnerForm && first_comp == lastfocus_comp)
                    {
                        if (this._p_parent._isAccessibilityEnable())
                            newfocus_comp = [this._p_parent];
                        else
                        {
                            var refform = this._p_parent._getForm();
                            if (this._p_parent instanceof nexacro.PopupDiv)
                                refform = this._p_parent;

                            newfocus_comp = refform._searchPrevTabFocus(this._p_parent, undefined, undefined, filter_type);
                        }
                    }
                    else
                    {
                        newfocus_comp = this._searchPrevTabFocus(lastfocus_comp, undefined, undefined, filter_type);
                    }

                    if (newfocus_comp && newfocus_comp[0])
                    {
                        if (newfocus_comp[0] instanceof nexacro.Form && newfocus_comp[0]._last_focused)
                        {
                            win._removeFromCurrentFocusPath(newfocus_comp[0]._last_focused);
                        }
                        newfocus_comp[0]._setFocus(true, 3, true);
                    }

                    if (keydown_elem)
                        keydown_elem._event_stop = true;

                    return true; // bubble되어 또 호출되면 안됨. 
                }
            }
        }

        var ret = nexacro.Component.prototype.on_fire_user_onkeydown.call(this, keycode, alt_key, ctrl_key, shift_key, this, refer_comp, meta_key);

        // 후처리 해야 하는 항목 임. 상단의 enter, esc, hotkey의 처리는 논의후 처리 예정 
        if (!this.onkeydown || (this.onkeydown && !this.onkeydown.defaultprevented))
        {
            var line;
            if (this._isComponentKeydownAction() && (keycode == nexacro.Event.KEY_LEFT || keycode == nexacro.Event.KEY_RIGHT))
            {
                var hscrollbar = this.hscrollbar;
                if (hscrollbar && hscrollbar._p_visible && (ctrl_key || env._p_accessibilitycontentsearchkey))
                {
                    if (!dlgc.want_arrows) // arrowkey를 직접 처리하는 컴포넌트는 제외
                    {
                        line = hscrollbar.line;
                        if (line <= 0)
                            line = hscrollbar._linedown;
                        if (keycode == nexacro.Event.KEY_LEFT)
                            line *= -1;

                        hscrollbar.set_pos(hscrollbar.pos + line);
                        return true;
                    }
                }
            }
            else if (this._isComponentKeydownAction() && (keycode == nexacro.Event.KEY_UP || keycode == nexacro.Event.KEY_DOWN))
            {
                var vscrollbar = this.vscrollbar;
                if (vscrollbar && vscrollbar._p_visible && (ctrl_key || env._p_accessibilitycontentsearchkey))
                {
                    if (!dlgc.want_arrows) // arrowkey를 직접 처리하는 컴포넌트는 제외
                    {
                        line = vscrollbar.line;
                        if (line <= 0)
                            line = vscrollbar._linedown;
                        if (keycode == nexacro.Event.KEY_UP)
                            line *= -1;

                        vscrollbar.set_pos(vscrollbar.pos + line);
                        return true;
                    }
                }
            }
        }

        return ret;
    };

    _pForm.on_fire_sys_onflingend = function (elem, fling_handler, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp)
    {
        var ret = nexacro.Component.prototype.on_fire_sys_onfling.call(this, elem, fling_handler, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp);

        if (from_comp == from_refer_comp)
        {
            if (nexacro._OS == "iOS")
            {
                var _win = this._getWindow();
                var cur_focus_paths = _win.getCurrentFocusPaths();
                var focused_comp = cur_focus_paths[cur_focus_paths.length - 1];
                var input_elem = focused_comp ? focused_comp._input_element : null;

                if (input_elem)
                {
                    nexacro._deleteRefreshNode();
                    nexacro._refreshCaret();
                }
            }
        }

        return ret;
    };

    _pForm.on_fire_oninit = function (obj)
    {
        if (this._init_status != 1)
            return true;

        this._init_status = 2;

        if (this.oninit && this.oninit._has_handlers)
        {
            var evt = new nexacro.Event(obj, "oninit");
            return this.oninit._fireEvent(this, evt);
        }
        return true;
    };

    _pForm.on_fire_canstepchange = function (obj)
    {
        if (this.canstepchange && this.canstepchange._has_handlers)
        {
            var evt = new nexacro.StepChangeEventInfo(obj, "canstepchange", obj._prestepindex, obj._poststepindex);
            return this.canstepchange._fireCheckEvent(this, evt);
        }

        return true;
    };

    _pForm.on_fire_onstepchanged = function (obj)
    {
        this._on_restore_stepscroll(obj);
        if (this.onstepchanged && this.onstepchanged._has_handlers)
        {
            var evt = new nexacro.StepChangeEventInfo(obj, "onstepchanged", obj._prestepindex, obj._poststepindex);
            return this.onstepchanged._fireEvent(this, evt);
        }
    };

    _pForm.on_fire_canlayoutchange = function (obj, eventid, curlayoutname, newlayoutname, curlayoutwidth, newlayoutwidth, curlayoutheight, newlayoutheight)
    {
        if (this.canlayoutchange && this.canlayoutchange._has_handlers)
        {
            var evt = new nexacro.LayoutChangeEventInfo(obj, eventid, curlayoutname, newlayoutname, curlayoutwidth, newlayoutwidth, curlayoutheight, newlayoutheight);
            return this.canlayoutchange._fireCheckEvent(this, evt);
        }

        return true;
    };

    _pForm.on_fire_onlayoutchanged = function (obj, eventid, curlayoutname, newlayoutname, curlayoutwidth, newlayoutwidth, curlayoutheight, newlayoutheight)
    {
        if (this.onlayoutchanged && this.onlayoutchanged._has_handlers)
        {
            var evt = new nexacro.LayoutChangeEventInfo(obj, eventid, curlayoutname, newlayoutname, curlayoutwidth, newlayoutwidth, curlayoutheight, newlayoutheight);
            return this.onlayoutchanged._fireEvent(this, evt);
        }
        return true;
    };

    _pForm.on_fire_onbeforelayoutchange = function (obj, eventid, curlayout, newlayout)
    {
        if (this.onbeforelayoutchange && this.onbeforelayoutchange._has_handlers)
        {
            var evt = new nexacro.LayoutChangeEventInfo(obj, eventid, curlayout, newlayout);
            return this.onbeforelayoutchange._fireEvent(this, evt);
        }
        return true;
    };

    _pForm.on_fire_onload = function (obj, url)
    {
        if (this._is_fired_onload)
            return true;

        if (this.onload && this.onload._has_handlers)
        {
            this._bFireLoadEvent = true;
            var evt = new nexacro.LoadEventInfo(obj, "onload", url);
            var ret = this.onload._fireEvent(this, evt);
            this._bFireLoadEvent = false;
            evt.destroy();
            //evt = null;

            if (!this._is_loading)
                this._is_fired_onload = true;

            return ret;
        }
        return true;
    };

    _pForm.on_fire_onorientationchange = function (orientation)
    {
        if (this.onorientationchange && this.onorientationchange._has_handlers)
        {
            var evt = new nexacro.OrientationChangeEventInfo(this, "onorientationchange", orientation);
            this.onorientationchange._fireEvent(this, evt);
        }
    };

    _pForm.on_fire_sys_onaccessibilitygesture = function (direction, fire_comp, refer_comp)
    {
        if (!this._is_alive)
            return;

        var _window = this._getWindow();
        //var accessibility_focus_comp = refer_comp;
        var comp = null;
        /*
        if (!accessibility_focus_comp)
        {
            accessibility_focus_comp = this.getFocus();
        }

        if (!accessibility_focus_comp)
        {
            accessibility_focus_comp = this;
        }

        if (accessibility_focus_comp)
        {
            accessibility_focus_comp = accessibility_focus_comp._getRootComponent(accessibility_focus_comp);
        }
        */
        var filter_type;
        var my_tapstop_childs, my_tapstop_childs_cnt;
        var new_comp;
        if (!direction)
        {
            filter_type = 3 + 8;
            comp = this._searchPrevTabFocus(_window._accessibility_last_focused_comp, undefined, undefined, filter_type);

            while (comp && comp[0] && comp[0]._hasContainer())
            {
                my_tapstop_childs = comp[0]._searchPrevTabFocus(null, undefined, undefined, filter_type);
                my_tapstop_childs_cnt = my_tapstop_childs ? my_tapstop_childs.length : 0;
                if (my_tapstop_childs_cnt == 0)
                {
                    break;
                }

                new_comp = comp[0]._searchPrevTabFocus(null, undefined, undefined, filter_type);
                if (comp[0] == new_comp[0])
                {
                    comp = new_comp;
                    break;
                }
                comp = new_comp;
            }

        }
        else
        {
            filter_type = 3 + 8;
            comp = this._searchNextTabFocus(_window._accessibility_last_focused_comp, undefined, undefined, filter_type);

            while (comp && comp[0] && comp[0]._hasContainer())
            {
                my_tapstop_childs = comp[0]._searchNextTabFocus(null, undefined, undefined, filter_type);
                my_tapstop_childs_cnt = my_tapstop_childs ? my_tapstop_childs.length : 0;

                if (my_tapstop_childs_cnt == 0)
                {
                    break;
                }

                new_comp = comp[0]._searchNextTabFocus(null, undefined, undefined, filter_type);
                if (comp[0] == new_comp[0])
                {
                    comp = new_comp;
                    break;
                }
                comp = new_comp;
            }
        }

        if (comp && comp[0])
        {
            comp[0]._setAccessibilityNotifyEvent(direction);
            return true;
        }

        return false;
    };

    //===============================================================
    // nexacro.Form : Methods
    //===============================================================
    _pForm.addChild = function (id, obj)
    {
        var ret = -1;

        if (id && id.length <= 0)
        {
            return -1;
        }
        if (!obj)
        {
            throw nexacro.MakeReferenceError(this, "reference_not_define", id);
        }

        if (this[id])
        {
            throw nexacro.MakeNativeError(this, "native_exist_id", id);
        }

        var is_component = false;
        var oldwindow, newwindow;

        if (obj._is_component)
            is_component = true;

        if (is_component)
            oldwindow = obj._getWindow();

        if (!obj.id)
        {
            obj.id = obj.name = id;
        }
        else
            obj.id = id;

        obj._p_parent = this;
        obj._refform = this;

        if (is_component)
            newwindow = obj._getWindow();

        this[id] = obj;
        this._p_all.add_item(id, obj);

        if (this._p_visible && !this._real_visible) obj._real_visible = false;
        else obj._real_visible = this._p_visible;

        if (is_component)
        {
            ret = this._p_components.add_item(id, obj);
            this._child_list.push(obj);

            if (oldwindow != newwindow)
            {
                // todo             		            	
                // destroy element handle element 
                // 
            }
            else if (obj._is_alive && obj._is_created)
            {
                this._control_element.appendChildElement(obj.getElement());
            }
        }
        else if (obj instanceof nexacro.BindItem)
        {
            ret = this._p_binds.add_item(id, obj);
        }
        else
        {
            ret = this._p_objects.add_item(id, obj);
        }
        return ret;
    };

    _pForm.resetScroll = function ()
    {
        if (this._is_created_contents)
        {
            var comp;
            var comps = this._p_components;
            for (var i = 0, n = comps.length; i < n; i++)
            {
                comp = comps[i];
                //if (comp._is_group)
                //    continue;
                if (comp._arrange_info || (comp.fittocontents != "none"))
                    comp._update_position();
            }
        }

        if (this._is_flexible_container)
        {
            this._setCalcedContainer(false);
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                manager.calcFluidLayoutContents(this);
            }
        }

        if (this._is_scrollable)
        {
            this._onRecalcScrollSize();
            this._onResetScrollBar();
        }
    };

    _pForm.close = function (arg)
    {
        if (this._closing) return;

        // MainForm 만 허용
        if (!this._p_parent || !this._p_parent._is_frame)
            return;

        this.setWaitCursor(false, null);

        var childframe = this._p_parent;

        var confirm_message = childframe._on_beforeclose();
        if (childframe._checkAndConfirmClose(confirm_message) == false)
            return false;

        // OpenWindow인 경우 이미 확인을 마친 상태
        if (childframe._window)
            childframe._window._ignore_close_confirm = true;

        this._closing = true;
        childframe._on_close();
        this._closing = null;

        if (typeof (arg) == "object")
            arg = null;

        if (this._p_parent) this._p_parent._closeForm(arg);
    };

    _pForm.getFirstComponent = function (no_composite_flag)
    {
        if (no_composite_flag !== true) no_composite_flag = false;
        var ar = this._getComponentsByTaborder(this, 6);

        var comp = null;
        if (ar && ar.length > 0)
            comp = ar[0];

        if (no_composite_flag)
        {
            var first = comp;
            while (first && first._hasContainer())
            {
                first = first._getTabOrderFirst(6);
                if (!first)
                    break;

                comp = first;
            }
        }

        if (comp && comp instanceof nexacro.Tabpage)
            comp = comp._p_parent;

        return comp;
    };

    _pForm.getLastComponent = function (no_composite_flag)
    {
        if (no_composite_flag !== true) no_composite_flag = false;
        var ar = this._getComponentsByTaborder(this, 6);

        var comp = null;
        if (ar && ar.length > 0)
            comp = ar[ar.length - 1];

        if (no_composite_flag)
        {
            var last = comp;
            while (last && last._hasContainer())
            {
                last = last._getTabOrderLast(6);
                if (!last)
                    break;

                comp = last;
            }
        }

        if (comp && comp instanceof nexacro.Tabpage)
            comp = comp._p_parent;

        return comp;
    };

    _pForm.getFirstAccessibilityComponent = function (no_composite_flag)
    {
        if (no_composite_flag !== true) no_composite_flag = false;
        var ar = this._getComponentsByTaborder(this, 6, undefined, true);

        var comp = null;
        if (ar && ar.length > 0)
            comp = ar[0];

        if (no_composite_flag)
        {
            var first = comp;
            while (first && first._hasContainer())
            {
                first = first._getTabOrderFirst(6, true);
                if (!first)
                    break;

                comp = first;
            }
        }

        if (comp && comp instanceof nexacro.Tabpage)
            comp = comp._p_parent;

        return comp;
    };

    _pForm.getLastAccessibilityComponent = function (no_composite_flag)
    {
        if (no_composite_flag !== true) no_composite_flag = false;
        var ar = this._getComponentsByTaborder(this, 6, undefined, true);

        var comp = null;
        if (ar && ar.length > 0)
            comp = ar[ar.length - 1];

        if (no_composite_flag)
        {
            var last = comp;
            while (last && last._hasContainer())
            {
                last = last._getTabOrderLast(6, true);
                if (!last)
                    break;

                comp = last;
            }
        }

        if (comp && comp instanceof nexacro.Tabpage)
            comp = comp._p_parent;

        return comp;
    };

    _pForm._getNextComponent = function (comp, no_composite_flag, only_enable_flag)
    {
        if (no_composite_flag !== true) no_composite_flag = false;
        if (only_enable_flag !== true) only_enable_flag = false;

        var tabstop_ar = this._getComponentsByTaborder(this, 6);
        var all_ar = this._getComponentsByTaborder(this, 7);

        var cur_idx = nexacro._indexOf(tabstop_ar, comp._getRootComponent(comp));
        if (cur_idx < 0)
        {
            var cur_all_idx = nexacro._indexOf(all_ar, comp._getRootComponent(comp));
            var i;

            if (cur_all_idx < 0)
                return null;

            i = cur_all_idx - 1;
            while ((i >= 0 && i < all_ar.length))
            {
                comp = all_ar[i];
                cur_idx = nexacro._indexOf(tabstop_ar, comp._getRootComponent(comp));
                if (cur_idx >= 0)
                    break;

                i--;
            }
        }

        var next;
        if (only_enable_flag)
            next = this._searchNextTabFocus(comp, false, undefined, no_composite_flag ? 0 : 4);
        else
            next = this._searchNextTabFocus(comp, false, undefined, no_composite_flag ? 2 : 6);

        if (next && next.length > 0)
            return next[0];

        return null;

    };
    _pForm.getNextComponent = function (comp, no_composite_flag)
    {
        return this._getNextComponent(comp, no_composite_flag, true);

    };

    _pForm._getPrevComponent = function (comp, no_composite_flag, only_enable_flag)
    {
        if (no_composite_flag !== true) no_composite_flag = false;
        if (only_enable_flag !== true) only_enable_flag = false;

        var tabstop_ar = this._getComponentsByTaborder(this, 6);
        var all_ar = this._getComponentsByTaborder(this, 7);

        var cur_idx = nexacro._indexOf(tabstop_ar, comp._getRootComponent(comp));
        if (cur_idx < 0)
        {
            var cur_all_idx = nexacro._indexOf(all_ar, comp._getRootComponent(comp));
            var i;

            if (cur_all_idx < 0)
            {
                var parent = (comp._p_parent instanceof nexacro._InnerForm) ? comp._p_parent._p_parent : comp._p_parent;
                var parent_form = parent._getForm();
                if (parent_form instanceof nexacro.ChildFrame) return null;
                return parent_form._getPrevComponent(parent, no_composite_flag, only_enable_flag);
            }

            i = cur_all_idx + 1;
            while ((i >= 0 && i < all_ar.length))
            {
                comp = all_ar[i];
                cur_idx = nexacro._indexOf(tabstop_ar, comp._getRootComponent(comp));
                if (cur_idx >= 0)
                    break;

                i++;
            }
        }

        var prev = null;

        if (only_enable_flag)
        {
            if (no_composite_flag)
                prev = this._searchPrevTabFocus(comp, false, undefined, 0);
            else
            {
                prev = this._searchPrevTabFocus(comp, false, undefined, 4);
            }
        }
        else
        {
            if (no_composite_flag)
                prev = this._searchPrevTabFocus(comp, false, undefined, 2);
            else
            {
                if (cur_idx > 0)
                    prev = tabstop_ar[cur_idx - 1];
                else if (cur_idx == 0)
                    prev = tabstop_ar[tabstop_ar.length - 1];
            }
        }
        if (prev && prev.length > 0)
            return prev[0];

        return prev;
    };
    _pForm.getPrevComponent = function (comp, no_composite_flag)
    {
        return this._getPrevComponent(comp, no_composite_flag);
    };

    _pForm.getFocus = function ()
    {
        // TODO check 컴포넌트에서 사용하는곳이 있을지
        //return this._last_focused;

        // TODO Form내 focus를 얻는것이 아니고 Platform전체에서 Focus를 가진 컴포넌트를 리턴해야함.

        var last_focus = this._find_lastFocused();
        if (last_focus == null)
            return this;
        return last_focus;
    };

    _pForm.go = function (strUrl)
    {
        if (this._orgurl != strUrl)
        {
            if (this._orgurl != "")
            {
                var confirm_message = this._on_beforeclose();

                if (this._checkAndConfirmClose(confirm_message) == false)
                {
                    return;
                }

                this._on_close();
            }

            this._resetComponent();

            if (strUrl)
            {
                this.loadForm(strUrl, this._async, true);
                this.set_visible(true);
            }
        }
    };

    _pForm.hasPopupFrame = function ()
    {
        var frame;
        var i, len;
        var popupframes = nexacro.getPopupFrames(this);
        if (popupframes)
        {
            for (i = 0, len = popupframes.length; i < len; i++)
            {
                frame = popupframes[i];
                if (frame && this === frame._p_opener)
                {
                    return true;
                }
            }
        }

        var win = this._getWindow();
        var modalframes = win._modal_frame_stack;
        var modal_info;

        if (modalframes)
        {
            for (i = 0, len = modalframes.length; i < len; i++)
            {
                modal_info = modalframes[i];
                frame = modal_info[0];
                if (frame && this === frame._p_opener)
                {
                    return true;
                }
            }
        }

        return false;
    };

    _pForm.insertChild = function (idx, id, obj)
    {
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

        if (!obj.id)
        {
            obj.id = obj.name = id;
        }
        else
            obj.id = id;

        obj._p_parent = this;
        obj._refform = this;

        this[id] = obj;
        this._p_all.add_item(id, obj);
        var ret;
        if (obj._is_component)
        {
            ret = this._p_components.insert_item(idx, id, obj);
            this._child_list.push(obj);
            if (obj._is_alive && obj._is_created)
            {
                var beforecomp = this._p_components[idx + 1];
                this._control_element.insertChildElement(obj.getElement(), beforecomp ? beforecomp.getElement() : null);
            }
        }
        else if (obj instanceof nexacro.BindItem)
        {
            ret = this._p_binds.insert_item(idx, id, obj);
        }
        else
        {
            ret = this._p_objects.insert_item(idx, id, obj);
        }

        // addChild는 스크롤을 자동으로 갱신하지 않음.
        // 사용자가 resetScroll을 호출했을때 갱신해야 함.
        // -> RecalcScroll 금지

        return ret;
    };

    _pForm.isValidObject = function (target)
    {
        if (typeof target == "string")
        {
            if (this[target]) return true;
        }
        else if (target instanceof Object)
        {
            var len = this._p_all.length;
            for (var i = 0; i < len; i++)
                if (this._p_all[i] == target) return true;
        }
        else
        {
            if (nexacro._indexOf(this._p_all, target) > -1) return true;
        }
        return false;
    };

    _pForm.killTimer = function (nTimerID)
    {
        this._timerManager.deleteTimer(nTimerID);
    };

    _pForm.setTimer = function (nTimerID, nElapse)
    {
        var timer = new nexacro._EventTimer(this, nTimerID, nElapse);
        timer.start();
    };

    _pForm.loadStyle = function (url, bclear)
    {
        if ((typeof (url) != "string") || url.length == 0)
        {
            return;
        }
        bclear = bclear == false ? false : true;
        var exceptcssselector = true;

        if (bclear)
        {
            exceptcssselector = false;
        }

        this._clearCssInfo(exceptcssselector);

        var base_url = this._base_url;
        var cssurl = [];
        cssurl.push(nexacro._getServiceLocation(url, base_url));
        cssurl.push(".js");

        var service = nexacro._getServiceObject(url);
        this._load_manager.reloadCssModule(cssurl.join(""), null, false, service);

        this._resetFormStatus(this);
    };

    _pForm.reload = function ()
    {
        var strUrl = this._orgurl ? this._orgurl : this._p_parent._formurl;

        this._resetComponent();

        if (strUrl)
        {
            this.loadForm(strUrl, this._async, true);
            this.set_visible(true);
        }
    };

    _pForm.removeChild = function (id)
    {
        if (!id || id.length <= 0)
        {
            return null;
        }

        var obj = this[id];
        if (!obj)
            return null;

        if (obj._is_component)
        {
            var is_focused = false;
            var _window = this._getWindow();
            if (_window)
            {
                is_focused = (_window._indexOfCurrentFocusPaths(obj) > -1);
            }

            // TODO check DefaultButton remove시 null 처리. 9.2확인 필요
            if (this._defaultbutton == obj)
                this._defaultbutton = null;
            if (this._escapebutton == obj)
                this._escapebutton = null;


            if (this._bind_manager)
                this._bind_manager._dettachSBindItem(obj);

            this._p_components.delete_item(id);
            var cidx = nexacro._indexOf(this._child_list, obj);
            if (cidx > -1)
            {
                this._child_list.splice(cidx, 1);
            }

            if (this._is_alive && obj._control_element)
            {
                if (obj._control_element)
                {
                    obj._control_element._removeFromContainer();
                    //fluid
                    var is_fluid = this._isFluidContainer();
                    if (is_fluid)
                    {
                        // 컴포넌트가 지워졌을때 해당 컴포넌트의 폼을 특정할수 없어짐.
                        // 현재 매니저 상에 있는 레이아웃을 전부 갱신
                        this._update_position_fluid(true);
                    }
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
                    _window._last_focused_elem = this._control_element;

                    // Visible/Enable AutoFocus
                    this._on_focus(true);
                }
            }
        }
        else if (obj instanceof nexacro.BindItem)
        {
            this._bind_manager._setBinditem(obj, true);
            this._p_binds.delete_item(id);
        }
        else
        {
            this._p_objects.delete_item(id);
        }

        //obj._window = null;
        obj._p_parent = null;
        delete this[id];
        this._p_all.delete_item(id);

        return obj;
    };

    //wait_flag = true/false 
    //forcely_flag = true/false 
    //true, true : 무조건 show waitcursor
    //true, false (env.usewaitcursor true) : show waitcursor
    //true, false (env.usewaitcursor false) : 무시 아무것도 안함
    //false, true : 무조건 hide waitcursor
    //false, false (env.usewaitcursor true) : hide waitcursor
    //false, false (env.usewaitcursor false) : 무시 아무것도 안함
    _pForm.setWaitCursor = function (wait_flag, forcely_flag)
    {
        var wait = wait_flag;
        var forcely = forcely_flag;
        if (wait == undefined) wait = true;
        if (forcely == undefined) forcely = false;

        const env = this._env;
        if (!forcely && !(env && env._p_usewaitcursor)) return;

        this._waitCursor(wait, null); // not communication -> Context=null
    };

    _pForm.sleep = function (nMilliseconds)
    {
        var then = new Date().getTime();
        var now = then;

        while ((now - then) < nMilliseconds)
        {
            now = new Date().getTime();
        }
    };

    _pForm.transaction = function (id, url, inDatasetsParam, outDatasetsParam, argsParam, callbackFn, isAsync, datatype, isCompress)
    {
        var realurl = nexacro._getServiceLocation(url, this._base_url, null, false);
        var service = nexacro._getServiceObject(url, true);

        this._load_manager.loadDataModule(realurl, id, inDatasetsParam, outDatasetsParam, argsParam, callbackFn, isAsync, datatype, isCompress, service);
    };

    _pForm.cancelTransaction = function (id)
    {
        if (!this._load_manager)
            return -1;
        var datalist = this._load_manager.dataList;
        if (!datalist)
            return -1;

        if (id != undefined)
        {
            var datalistid = (typeof id == "string") ? id.split(",") : id;
            if (datalistid.length > 0)
            {
                var datalistfilter = [];
                for (var k = 0; k < datalist.length; k++)
                {
                    datalistfilter[k] = datalist[k].url;
                }

                var j, i, datalistfiltered = [];
                for (j = 0; datalistfilter.length > j; j++)
                {
                    var datalistfound = false;
                    for (i = 0; datalistid.length > i; i++)
                        if (datalistid[i] == datalistfilter[j])
                        {
                            datalistfound = true;
                            break;
                        }
                    if (!datalistfound)
                    {
                        datalistfiltered.push(datalistfilter[j]);
                    }
                }

                for (j = datalistfiltered.length - 1; j >= 0; j--)
                {
                    for (i = datalist.length - 1; i >= 0; i--)
                    {
                        if (datalist[i].url == datalistfiltered[j])
                        {
                            datalist = nexacro._removedatalist(datalist, i);
                        }
                    }
                }
            }
        }

        this._stopTransaction(true);
    };

    _pForm.updateWindow = function ()
    {
        // To Do
    };

    _pForm.getStepCount = function ()
    {
        var step_ctrl = this._p_stepselector;
        if (step_ctrl)
        {
            return step_ctrl.stepcount;
        }

        return 0;
    };

    _pForm.setStepCount = function (cnt)
    {
        if (isNaN(cnt = +cnt) || cnt < 0)
        {
            return;
        }

        var manager = nexacro._getLayoutManager();
        if (!manager || manager.isFluidLayoutType())
            return;

        var idx, pre_idx, layout;

        if (!this._p_stepselector)
        {
            if (!cnt)
                return;
            this._createStepControl(cnt, 0);
            this._p_stepselector.on_created();

            this._on_prepare_stepcontents(cnt, 0);
            this._on_refresh_stepcontents(cnt, 0);
        }
        else
        {
            var step_ctrl = this._p_stepselector;

            if (step_ctrl)
            {
                idx = step_ctrl.stepindex;
                pre_idx = step_ctrl.stepindex;

                if (pre_idx >= cnt)
                    idx = cnt - 1 >= 0 ? cnt - 1 : 0;

                if (idx < 0 && cnt > 0)
                    idx = 0;

                this._on_prepare_stepcontents(cnt, idx);
                this._on_refresh_stepcontents(cnt, idx);
            }
        }

        layout = nexacro._getLayoutManager();

        if (this._p_stepselector && layout)
        {
            var layout_name = layout.getCurrentLayoutName();
            layout.setLayoutProperty(this, layout_name, "stepcount", this._p_stepselector.stepcount);
        }
    };

    _pForm.setStepIndex = function (index)
    {
        var step_ctrl = this._p_stepselector;
        if (step_ctrl)
        {
            return step_ctrl.set_stepindex(index);
        }

        return false;
    };

    _pForm.getStepIndex = function ()
    {
        var step_ctrl = this._p_stepselector;
        if (step_ctrl)
        {
            return step_ctrl.stepindex;
        }

        return -1;
    };

    _pForm.applyChange = function ()
    {
        // TODO getFocus로 가져와야 하는게 아닌지? 
        var comp = this._last_focused;
        if (!comp)
            return;
        comp.applyto_bindSource("value", comp._p_value);

        // BindManager.exception 처리되었기때문에 따로 Notify 한다.
        var binds = this._p_binds;
        var len = binds.length;
        for (var i = 0; i < len; i++)
        {
            var bind_item = binds[i];
            if (bind_item._comp == comp && bind_item._p_propid == "value")
            {
                this._bind_manager._notify(bind_item);
                return;
            }
        }
    };

    _pForm.getCurrentLayoutID = function ()
    {
        var manager = nexacro._getLayoutManager();
        if (manager)
        {
            return manager.getCurrentLayoutName(this);
        }

        return "default";
    };

    _pForm.getViewDataset = nexacro._emptyFn;

    _pForm.move = function (left, top, width, height, right, bottom)
    {
        nexacro.Component.prototype.move.call(this, left, top, width, height, right, bottom);

        var manager = nexacro._getLayoutManager();
        if (manager)
        {
            //manager.selectLayoutAllContainer();
            //resetscroll ?
        }
    };

    _pForm.resize = function (w, h)
    {
        if (w < 0 || h < 0)
        {
            return;
        }

        if (w == this._adjust_width && h == this._adjust_height)
        {
            return;
        }

        if (this._adjust_width != (this._adjust_left + w) || this._adjust_height != (this._adjust_top + h))
        {
            this._p_width = w;
            this._p_height = h;
            this._update_position(true, false);
        }
        else
        {
            this._update_position(false, false);
        }

        var manager = nexacro._getLayoutManager();
        if (manager)
        {
            //manager.selectLayoutAllContainer();
            //resetscroll?
        }
    };

    //===============================================================
    // nexacro.Form : Logical Part
    //===============================================================
    _pForm._onRecalcScrollSize = function (fromComp)
    {
        var control_elem = this._control_element;
        if (this._is_scrollable && control_elem)
        {
            var w = 0, h = 0, cw = 0, ch = 0;
            var container_width = control_elem.getContainerElement(control_elem._step_index).width;
            var container_height = control_elem.getContainerElement(control_elem._step_index).height;

            var container_maxwidth = control_elem.container_maxwidth;
            var container_maxheight = control_elem.container_maxheight;
            var contents_maxwidth = 0, contents_maxheight = 0;
            var zoom_factor = this._getZoom() / 100;
            var offsetbottom;
            container_width = container_width / zoom_factor;
            container_height = container_height / zoom_factor;

            container_maxwidth = container_maxwidth / zoom_factor;
            container_maxheight = container_maxheight / zoom_factor;

            if (!fromComp)
            {
                var i, n, comp, comps = this._p_components;
                if (this._p_stepselector && this._p_stepselector.stepcount > 0)
                {
                    for (i = 0, n = comps.length; i < n; i++)
                    {
                        comp = comps[i];
                        if (comp && comp._p_visible && comp.positionstep < this._p_stepselector.stepcount)
                        {
                            //var offsetright = comp.getOffsetRight();
                            offsetbottom = comp.getOffsetBottom();

                            //w = Math.max(w, offsetright);
                            h = Math.max(h, offsetbottom);
                        }
                    }

                    var _width = this.width;
                    if (nexacro._isString(_width))
                    {
                        _width = nexacro._toInt(_width);
                    }
                    w = _width * this._p_stepselector._poststepcount;
                    cw = w;
                    ch = h;
                }
                else
                {
                    var ret = this._calcScrollMaxSize();
                    w = ret.w;
                    h = ret.h;
                    cw = ret.cw;
                    ch = ret.ch;
                }

                contents_maxwidth = Math.max(cw, contents_maxwidth);
                contents_maxheight = Math.max(ch, contents_maxheight);

                w = Math.max(w, container_width);
                if (!this._p_stepselector)
                    h = Math.max(h, container_height);
                h = Math.max(h, container_height);

                control_elem._setElementContentsMaxSize(contents_maxwidth, contents_maxheight);
                control_elem.setElementScrollMaxSize(w, h);
            }
            else if (fromComp._p_visible)
            {

                var offsetRight = fromComp.getOffsetRight();
                var offsetBottom = fromComp.getOffsetBottom();

                if (container_maxwidth < offsetRight || container_maxheight < offsetBottom)
                {
                    w = Math.max(container_maxwidth, offsetRight);
                    h = Math.max(container_maxheight, offsetBottom);
                    control_elem.setElementScrollMaxSize(w, h);
                }
            }
        }
    };

    _pForm._resetScrollPos = function (target_comp, left, top, right, bottom, focus_direction)
    {
        /*
            1. right,bottom을 보이게 하는 것이 최우선
            2. right,bottom이 보일경우 left,top을 보이도록한다. right,bottom이 가려져선 안됨.
            3. right,bottom은 이격값이 아닌 절대좌표임.
            4. 내 기준에서 보일만큼 땡겼지만, 부모에 의해 안보일수 있음. 부모시점의 _resetScrollPos도 같이 되야함.
        */
        var control_elem = this.getElement();
        if (control_elem)
        {
            if (this._is_frame)
                return;

            var parent = this._p_parent;

            var hscroll = this._p_hscrollbar;
            var vscroll = this._p_vscrollbar;

            var hpos = 0;
            var vpos = 0;
            var form_left = (this instanceof nexacro._InnerForm) ? parent._adjust_left : this._adjust_left;
            var form_top = (this instanceof nexacro._InnerForm) ? parent._adjust_top : this._adjust_top;
            var client_width = control_elem.getClientWidth();
            var client_height = control_elem.getClientHeight();

            if (hscroll) // && (hscroll._p_visible || (hscroll instanceof nexacro.ScrollIndicatorControl)))
            {
                hpos = hscroll._p_pos;
                //if (this.scrolltype != "vertical" && this.scrolltype != "none")
                //{
                if (left - hpos < client_width && right - hpos > client_width)
                {
                    // Left는 보이고 Right는 Form 밖인 경우
                    if (focus_direction == 1 && right - left > client_width)
                        hscroll.set_pos(right - client_width);
                    else
                        hscroll.set_pos(left);
                }
                else if (hpos > left || (left - hpos > client_width))
                {
                    //tabkey 로 들어오는 경우 left 기준
                    //shifttabkey로 들어오는 경우 right 기준
                    var _hpos;
                    if (focus_direction == 1 && right - left > client_width)
                        _hpos = right - client_width;
                    else
                        _hpos = left;
                    hscroll.set_pos(_hpos);
                }
                /*
            else if (left - hpos > client_width)
            {
                // Left가 Form의 오른쪽을 넘어간 경우
                if (focus_direction == 1 && right - left > client_width)
                    hscroll.set_pos(right - client_width);
                else
                    hscroll.set_pos(left);
            }
            */
                //}
                hpos = hscroll._p_pos;
            }

            if (vscroll)// && (vscroll._p_visible || (vscroll instanceof nexacro.ScrollIndicatorControl)))
            {
                vpos = vscroll._p_pos;
                //if (this._p_scrolltype != "horizontal" && this.scrolltype != "none")
                //{
                if (top - vpos < client_height && bottom - vpos > client_height)
                {
                    // Top은 보이고 Bottom이 Form 밖인 경우
                    if (focus_direction == 1 && bottom - top > client_height)
                        vscroll.set_pos(bottom - client_height);
                    else
                        vscroll.set_pos(top);
                }
                else if ((vpos > top) || (top - vpos >= client_height))
                {
                    var _vpos;
                    if (focus_direction == 1 && bottom - top > client_height)
                        _vpos = bottom - client_height;
                    else
                        _vpos = top;
                    vscroll.set_pos(_vpos);
                }
                /*
                else if (top - vpos >= client_height)
                {
                    // Top이 Form의 아래를 넘어간 경우
                    if (focus_direction == 1 && bottom - top > client_height)
                        vscroll.set_pos(bottom - client_height);
                    else
                        vscroll.set_pos(top);
                }
                */
                //}
                vpos = vscroll._p_pos;
            }

            left = form_left + left - hpos;
            top = form_top + top - vpos;
            right = form_left + right - hpos;
            bottom = form_top + bottom - vpos;

            if (!this._is_popup_control && parent && parent != this)
            {
                parent._resetScrollPos(this, left, top, right, bottom, focus_direction);
            }
        }
    };

    _pForm._resetFormStatus = function (obj)
    {
        var i, n, comp;
        var comps = obj._p_components;

        for (i = 0, n = comps.length; i < n; i++)
        {
            comp = comps[i];
            if (comp)
            {
                if (comp._is_form)
                {
                    comp._apply_status("");
                    this._resetFormStatus(comp);
                }
                else
                {
                    comp._apply_status("");
                }
            }
        }

        this._apply_status("");
    };
    _pForm._on_getFitSize = function ()
    {
        var total_w = 0, total_h = 0;
        var size = this._calcScrollMaxSize();
        if (size)
        {
            total_w += size.w;
            total_h += size.h;

            var style_size = this._on_getFitSize_style();
            var scroll_size = this._on_getFitSize_scroll();
            if (size.w > 0)
                total_w += style_size[0] + scroll_size[0];
            if (size.h > 0)
                total_h += style_size[1] + scroll_size[1];
        }
        //border, padding
        return [total_w, total_h];
    };

    _pForm._calcScrollMaxSize = function ()
    {
        // right,bottom 또는 % 좌표를 갖는 child를 제외하고 확실한 좌표값을 갖는
        var ret = { w: -1, h: -1 };

        if (this._is_flexible_container)
        {
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                var rect = manager.getContentsMaxRect(this);
                ret = { w: rect[0], h: rect[1], cw: rect[0], ch: rect[1] };
            }
        }
        else
        {
            if (this._is_scrollable && this._control_element)
            {
                var _w = 0, _h = 0, _c_w = 0, _c_h = 0, offsetright, offsetbottom;
                var fittocontents, check_c_w, check_c_h;
                var comp;
                var comps = this._p_components;
                for (var i = 0, n = comps.length; i < n; i++)
                {
                    comp = comps[i];
                    if (comp && comp._p_visible)
                    {
                        if (comp._is_group)
                            continue;
                        fittocontents = comp._p_fittocontents;
                        check_c_w = fittocontents == "both" || fittocontents == "width" || comp._p_minwidth || comp._right < 0;
                        check_c_h = fittocontents == "both" || fittocontents == "height" || comp._p_minheight || comp._bottom < 0;
                        offsetright = comp.getOffsetRight();
                        offsetbottom = comp.getOffsetBottom();
                        _w = Math.max(_w, offsetright);
                        _h = Math.max(_h, offsetbottom);
                        if (check_c_w || !comp._p_right && (comp._p_width > 0) || (nexacro._isString(comp._p_width) && comp._p_width.indexOf("%") < 0))
                            _c_w = Math.max(_c_w, offsetright);
                        if (check_c_h || !comp._p_bottom && (comp._p_height > 0) || (nexacro._isString(comp._p_height) && comp._p_height.indexOf("%") < 0))
                            _c_h = Math.max(_c_h, offsetbottom);
                    }
                }
                ret = { w: _w, h: _h, cw: _c_w, ch: _c_h };
            }
        }

        return ret;
    };

    _pForm._onApplyTabletemplate = function (prev_layout_name)
    {
        var manager = nexacro._getLayoutManager();
        if (manager)
        {
            var layout = manager.getCurrentLayout(this);
            var tabletemplate = layout.tabletemplate;
            var fluidLayoutmanager = manager._fluidlayoutmanager;
            if (fluidLayoutmanager)
            {
                //check
                if (nexacro._isDesignMode())
                {
                    fluidLayoutmanager._prev_tabletemplate = layout._tabletemplate;
                }
                else
                    fluidLayoutmanager._prev_tabletemplate = manager.getLayout(this, prev_layout_name ? prev_layout_name : "default")._tabletemplate;

            }
            var control_element = this.getElement();
            if (control_element)
                control_element.setElementTableTemplate(tabletemplate);
            this._is_changed_tabletemplate = true;
            manager.calcFluidLayoutContents(this);
            this._is_changed_tabletemplate = false;
        }
    }

    //===============================================================
    // nexacro.Form : Util Function
    //===============================================================
    _pForm._setSize = function (width, height)
    {
        if (this._adjust_width != width || this._adjust_height != height)
        {
            if (this instanceof nexacro._InnerForm)
            {
                this._p_parent._calced_container = false;
            }
            var keyboardheight = this._height - height; //Android Keyboard
            var focused_comp = null;

            this._p_width = this._width = width;
            this._p_height = this._height = height;
            this._calcBasisSize();
            this._adjustPosition();
            var bAdjustVScroll = false;

            var layout_manger = nexacro._getLayoutManager();
            if (layout_manger)
            {
                var changelayout_flag = layout_manger.getLayoutChangeFlag();
                if (changelayout_flag !== undefined)
                {
                    if (this.getOwnerFrame()._activate)
                    {
                        layout_manger.setLayoutChangeFlag(false);
                    }

                    focused_comp = this._last_focused;

                    var input_top = 0, input_height = 0;
                    if (focused_comp)
                    {
                        input_top = focused_comp._adjust_top;
                        input_height = focused_comp._adjust_height;

                        while (focused_comp._p_form)
                        {
                            if (!focused_comp._p_form._last_focused)
                            {
                                break;
                            }
                            focused_comp = focused_comp._p_form._last_focused;
                            input_top += focused_comp._adjust_top;
                            input_height = focused_comp._adjust_height;
                        }
                    }

                    bAdjustVScroll = this._vscroll_pos + height < input_top + input_height;
                }
                else
                {
                    this._selectLayout();
                }
            }

            if (nexacro._isDesktop() && (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge"))
                this._notifyFrameResize();  // for scale bug (chrome, edge)
        }

        // client 크기 갱신
        // child component 이동 (div layout change 발생)
        this.on_update_position(true, false);

        if (bAdjustVScroll)
        {
            this.getElement().setElementVScrollPos(this._vscroll_pos + keyboardheight);

            if (this.getOwnerFrame()._activate)
                focused_comp.setFocus();
        }
    };

    _pForm._setZoom = function (v)
    {
        var prevZoomFactor = this._getZoom();
        if (typeof v == "string" && v.charAt(v.length - 1) == "%")
            v = v.slice(0, v.length - 1);

        // autofit 처리시 정확히 fit하기 위해 실수값 허용으로 변경
        v = parseFloat(v) | 0;
        if (v <= 0 || v == prevZoomFactor)
            return prevZoomFactor;

        var control_elem = this._control_element;
        if (control_elem)
        {
            // 미리 child 정렬을 위해 값을 보관
            this._zoomFactor = v;

            // zoom을 수행하기 전에 zoom될 크기에 맞게 내부 컴포넌트를 재정렬한다.
            control_elem.container_maxwidth = 0;
            control_elem.container_maxheight = 0;
            control_elem.setElementScrollMaxSize(0, 0);

            //this._adjust_width = 0;
            //this._adjust_height = 0;

            this._client_width = 0;
            this._client_height = 0;
            //   this._updateClientSize(control_elem);

            // zoom 및 scroll 정보 갱신
            control_elem.setElementZoom(v);
            nexacro._applyZoomEdge(control_elem, v);

            var popups = nexacro._current_popups;
            var len = popups.length;
            for (var i = 0; i < len; i++)
            {
                if (this._contains(popups[i]))
                    popups[i]._p_parent._applyZoomPopup();
            }
        }

        this.on_fire_onzoom(v, this, this);

        return prevZoomFactor;
    };

    _pForm._getZoom = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            return (this._zoomFactor !== undefined) ? this._zoomFactor : control_elem.zoom;
        }

        return 100;
    };

    _pForm._setFormPosition = function (width, height)
    {
        this._init_width = width;
        this._init_height = height;
    };

    _pForm._setDragMove = function (v, is_windowframe)
    {
        //this._is_track = v;

        if (v && is_windowframe)
            this._hittest_type = "caption";
        else
            this._hittest_type = "none";

        this.on_apply_hittesttype();
    };

    _pForm._stopTransaction = function (is_cancel)
    {
        // is_cancel    - true:  canceltransaction에서 호출 될때 
        //              - false: esc에 의한 호출
        if (!this._load_manager)
            return -1;
        var datalist = this._load_manager.dataList;
        if (!datalist)
            return -1;

        var trlist = this._load_manager.transactionList;
        var idx = 0;
        var pre_len = datalist.length;
        var canceledCnt = 0;
        var tritem;
        while (idx < datalist.length)
        {
            var dataitem = datalist[idx];
            if (!dataitem)
            {
                idx++;
                continue;
            }

            var dataitem_handle = dataitem.handle;
            if (!dataitem_handle)
            {
                idx++;
                continue;
            }

            if (dataitem._is_cancel || dataitem._is_process)
            {
                idx++;
                pre_len = datalist.length;
                continue;
            }

            if (!is_cancel)
            {
                dataitem_handle._user_aborted = false;
                tritem = trlist[idx];
                if (tritem)
                {
                    var ret = tritem.on_error(-1, "comm_stop_transaction_byesc", nexacro._CommunicationStatusTable.stop_transaction_byesc, "");
                    if (ret)
                    {
                        dataitem._is_process = true;
                        dataitem_handle._user_aborted = undefined;
                        idx++;
                        continue;
                    }
                }
            }

            dataitem_handle._user_aborted = true;
            dataitem._is_cancel = true;


            if (nexacro._Browser == "Runtime")
            {
                nexacro._cancelLoad(dataitem_handle);
            }
            else
            {
                // 일반 브라우저에서 정상적으로 cancelLoad가 되면 두번째 on_error에서 아무런 동작안함.
                // 강제로 on_error을 호출 이유? transaction주소 잘못준경우 waitcursor가 계속 떠있음.
                // 일부 브라우저의 특정상황에서 cancelLoad에서 처리 못하는 경우있음
                // (abort()호출하면 callback함수 수행이 안됨)
                tritem = trlist[idx];
                nexacro._cancelLoad(dataitem_handle);
                if (tritem)
                    tritem.on_error(0, "comm_cancel_byuser", nexacro._CommunicationStatusTable.cancel_byuser);
                //dataitem_handle = null;
                //dataitem = null;
            }

            canceledCnt++;

            if (pre_len == datalist.length)
                idx++;
            else
            {
                idx = 0;
                pre_len = datalist.length;
            }
        }


        return canceledCnt;
    };

    _pForm._dragEnd = function (info)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var stepselector = this._p_stepselector;
            if (stepselector)
            {
                var step_count = control_elem._step_count;
                var step_index = control_elem._step_index;
                var direction = info.direction;
                if (step_count > 0)
                {
                    var new_index = -1;
                    if (direction == "L")
                    {
                        new_index = step_index + 1;
                    }
                    else if (direction == "R")
                    {
                        new_index = step_index - 1;
                    }
                    if (new_index < 0 || new_index >= step_count)
                    {
                        return;
                    }
                    stepselector.set_stepindex(new_index);
                }
            }
        }
    };

    _pForm._getDefaultButton = function ()
    {
        var comps = this._p_components;
        if (comps)
        {
            var comp;
            for (var i = 0; i < comps.length; i++)
            {
                comp = comps[i];
                if (comp._is_form)
                {
                    var btn = comp._getDefaultButton();
                    if (btn) return btn;
                }
                else if (nexacro._toBoolean(comp.defaultbutton))
                {
                    return comp;
                }
            }
        }
        return null;
    };

    _pForm._getEscapeButton = function ()
    {
        var comps = this._p_components;
        if (comps)
        {
            var comp;
            for (var i = 0; i < comps.length; i++)
            {
                comp = comps[i];
                if (comp._is_form)
                {
                    var btn = comp._getEscapeButton();
                    if (btn) return btn;
                }
                else if (nexacro._toBoolean(comp.escapebutton))
                {
                    return comp;
                }
            }
        }
        return null;
    };

    _pForm._getAccessibilityWholeReadLabel = function ()
    {
        var readlabel = "";
        var comp, ar = this._getSortedDecendants(this, true, true);
        for (var i = 0; i < ar.length; i++)
        {
            comp = ar[i];
            if (comp._isAccessibilityEnable())
            {
                var label = comp._getAccessibilityReadLabel(true);
                if (label)
                {
                    label = label.trim();
                    if (label && label.length > 0)
                        readlabel += label + " ";
                }
            }
        }
        return readlabel;
    };

    _pForm._playAccessibilityWholeReadLabel = function (type)
    {
        if (!nexacro._isDesktop())
            return;

        var control = this.getElement();
        if (control)
        {
            var label = this._getAccessibilityWholeReadLabel();
            control.notifyAccessibility(label, type);
        }
    };

    _pForm._getSortedDecendants = function (p, include_not_tabstop, bAccessibility)//, arEdit)
    {
        // tabstop=false인 컴포넌트에서 Tab 이동시 필요하다. 
        if (include_not_tabstop === undefined)
            include_not_tabstop = false;

        var ar = [];
        var comps = p._p_components;
        if (comps)
        {
            var comp_len = comps.length;
            for (var i = 0; i < comp_len; i++)
            {
                var comp = comps[i];
                /* android app accessibility 일때 disable 상태라도 초점 가야됨 */
                if (!comp || !comp._is_created || !comp._p_visible || ((comp._isEnable && !comp._isEnable() || !comp._p_enable) && (!this._env._p_enableaccessibility || this._env._a11ytype != 5)) || comp._popup)
                {
                    continue;
                }
                /*
                if (bAccessibility)
                {
                    if (!comp._isAccessibilityEnable())
                            continue;
                }              
                */
                if (!bAccessibility && !include_not_tabstop && !comp.on_get_prop_tabstop())
                    continue;

                var tabidx = comp._taborder;
                if (tabidx < 0)
                    tabidx = 0; //continue;
                var j = ar.length;
                while (j > 0 && ar[j - 1]._taborder > tabidx)
                {
                    ar[j] = ar[j - 1];
                    j--;
                }
                ar[j] = comp;
            }
        }
        return ar;
    };

    _pForm._getAsync = function ()
    {
        return this._async;
    };
    _pForm.on_notifytrigger = function (obj, info)
    {
        if (info)
        {
            var manager = this._trigger_manager;
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

    _pForm._setTriggerInfo = function (contents)
    {
        if (this._trigger_manager)
        {
            this._trigger_manager._settriggerinfo(contents);
            this._trigger_manager.inittriggerinfo();
        }
    };

    _pForm._applyBinditemEnable = function (binds)
    {
        for (var i = 0, n = binds.length; i < n; i++)
        {
            var bindItem = binds[i];
            var ds = bindItem._dataset;
            var comp = bindItem._comp;
            if (ds && comp)
            {
                var row_idx = ds.rowposition;
                if (bindItem._en_type == 2)
                { // CYBIND_TYPE_SIMPLE
                    if (comp._p_enable && comp._p_parent._isEnable())
                    {
                        if (row_idx < 0)
                            comp._setEnable(false);
                    }
                }
            }
        }
    };

    _pForm._init = function ()
    {
        if (this._is_main)
            nexacro._initLayoutManager(true, true, true);

        this._initLayoutManager();
    };

    _pForm._initLayoutManager = function ()
    {
        if (this._is_subcontrol)
            return;

        var manager = nexacro._getLayoutManager();
        if (manager)
        {
            // form계열 init 마다 containerinfo추가
            manager.createLayoutContainerInfo(this);
            manager.setLayoutScrollType(this);
        }
    };

    _pForm._selectLayout = function ()
    {
        if (this._is_subcontrol)
            return;

        var layout_manager = nexacro._getLayoutManager();
        if (layout_manager)
        {
            var ret = layout_manager.selectLayout(this);

            //layout이 변경되면 StepCount 적용 (생성시점에도 적용)
            if (ret || !this._is_created)
            {
                layout_manager.applyStep(this);
            }

            if (this._is_created)
            {
                layout_manager.applyFluid(this);
            }
        }
    };

    _pForm._setInnerFlexibleFlag = function (is_flexible, is_calc)
    {
        // container 종류에만 설정되어야함
        if (is_flexible != this._is_flexible_container)
        {
            this._is_flexible_container = is_flexible;
            this._applyFlexiblePosition(is_flexible);
        }
        this._is_flexible_container_calculation = is_flexible ? !!is_calc : false;
    };

    _pForm._applyFlexiblePosition = function (is_flexible)
    {
        var components = this._p_components;
        for (var i = 0, len = components.length; i < len; i++)
        {
            var comp = components[i];
            var control_elem = comp.getElement();
            if (control_elem)
            {
                control_elem.setElementLayoutFluidPos(is_flexible);
            }
        }
    };

    _pForm._notifyFrameResize = function ()
    {
        var components = this._p_components;
        for (var i = 0, len = components.length; i < len; i++)
        {
            var comp = components[i];
            if (comp._use_notify_frame_resize)
                comp._notify_frame_resize();
        }
    };

    _pForm._areConsecutive = function (componentids)
    {
        if (!componentids) return false;
        //table
        var ret = false;
        var i, j, k, l, compid, idx, comp, form_comp_len;
        var org_form_comps = this._p_components;
        var form_comps = new nexacro.Collection();
        var comps = componentids.replace(/\s/g, "").split(",");
        var len = comps.length;
        var arr = [];
        var manager = nexacro._getLayoutManager();
        var layouttype = manager.getLayoutType(this);
        var fluidManager = manager._fluidlayoutmanager;
        var row_len = 0, col_len = 0;
        if (fluidManager && fluidManager._tabletemplate_rect)
        {
            var tableinfo = fluidManager._tabletemplate_rect;
            row_len = tableinfo.length;
            col_len = tableinfo[0].length;
        }
        var parent = null;
        for (i = 0, form_comp_len = org_form_comps.length; i < form_comp_len; i++)
        {
            var obj = org_form_comps[i];
            if (obj && !obj._is_group)
                form_comps.add_item(obj.id, obj);

        }
        //hashmap 관리?
        if (layouttype == 0) //default
        {
            //Todo
            for (i = 0; i < len; i++)
            {
                compid = comps[i];
                idx = org_form_comps.indexOf(compid);
                if (idx < 0)
                    return false; //같은 폼이 아니라면
                comp = org_form_comps[compid];
                if (comp._is_group)
                    return comp._group_panel._areConsecutive(componentids);
            }
            ret = true;
        }
        else if (layouttype == 1 || layouttype == 2) //horizontal vertical
        {

            for (i = 0; i < len; i++)
            {
                compid = comps[i];
                idx = form_comps.indexOf(compid);
                comp = form_comps[compid];
                var cur_parent;
                if (!comp)
                {
                    comp = org_form_comps[compid];
                    if (!comp)
                        return false;
                }

                if (!parent)
                    parent = comp._is_group ? comp._group_panel : comp._p_parent;
                else
                {
                    cur_parent = comp._is_group ? comp._group_panel : comp._p_parent;
                    if (cur_parent != parent) //같은 패널이 아닐경우
                        return false;
                }
                if (parent._is_panel)
                    return parent._areConsecutive(componentids);
                if (idx > -1)
                    arr.push(idx);
                else
                    return false; //같은 폼이 아니라면

            }

            if (arr.length > 0)
            {
                arr.sort(function (a, b)
                {
                    return a - b;
                });
                // checking the adjacent elements
                for (i = 1; i < len; i++)
                {
                    if (arr[i] != arr[i - 1] + 1)
                        return false;
                }
                ret = true;
            }
        }
        else if (layouttype == 3) // table
        {
            //arr 배열형태는 row/col이 바뀐 transposed matrix형태로
            //툴에서 보이는 형태 그대로 디버그시 보여짐
            var start_col = -1, start_row = -1, end_col = -1, end_row = -1;
            for (i = 0; i < col_len; i++)                    
            {
                var arrorw = [];
                for (j = 0; j < row_len; j++)
                {
                    arrorw.push(false);
                }
                arr.push(arrorw);
            }
            for (i = 0; i < len; i++)
            {
                compid = comps[i];
                idx = form_comps.indexOf(compid);
                if (idx > -1)
                {
                    comp = form_comps[compid];
                    var tca = comp._getTablecellareaCoordinate();
                    for (k = tca[2]; k <= tca[3]; k++)                    
                    {
                        for (l = tca[0]; l <= tca[1]; l++)
                        {
                            arr[l][k] = true;
                        }
                    }
                    if (i == 0)
                    {
                        start_row = tca[0];
                        end_row = tca[1];
                        start_col = tca[2];
                        end_col = tca[3];
                    }
                    else
                    {
                        if (tca[0] < start_row) start_row = tca[0];
                        if (tca[1] > end_row) end_row = tca[1];
                        if (tca[2] < start_col) start_col = tca[2];
                        if (tca[3] > end_col) end_col = tca[3];
                    }
                }
            }
            //trace(start_col, start_row, end_col, end_row, arr)
            for (i = start_col; i <= end_col; i++)                    
            {
                for (j = start_row; j <= end_row; j++)
                {
                    if (!arr[j][i])
                        return false;
                }
            }
            ret = true;
        }
        return ret;
    };

    _pForm._getComponentsRect = function (componentids)
    {
        //Todo..
        if (!componentids) return false;
        if (!this._areConsecutive(componentids)) return false;
        //table
        var ret = [];
        var i, compid, comp;
        var form_comps = this._p_components;
        //var form_width = this.getOffsetWidth();
        //var form_height = this.getOffsetHeight();
        var arr_componentids = componentids.replace(/\s/g, "").split(",");
        var min_left = -1, min_top = -1;
        var comp_left = 0, comp_top = 0;
        var max_height = 0, max_width = 0;

        var sum_width = 0, sum_height = 0, comp_width = 0, comp_height = 0;
        var len = arr_componentids.length;
        //horizontal return width height
        //table return start col, start row, end col, end row
        var manager = nexacro._getLayoutManager();
        var layouttype = manager.getLayoutType(this);
        //0 = default
        //1 = horizontal
        //2 = vertical
        //3 = table
        var parent = null;
        var parent_width;
        var parent_height;
        if (layouttype == 0)
        {
            //left, top, width, height
            var max_right = 0, max_bottom = 0;
            for (i = 0; i < len; i++)
            {
                compid = arr_componentids[i];
                comp = form_comps[compid];
                if (!comp) return false;
                if (!parent)
                    parent = comp._is_group ? comp._group_panel : comp._getForm();
                comp_left = comp.getOffsetLeft();
                comp_top = comp.getOffsetTop();
                comp_width = comp.getOffsetWidth();
                comp_height = comp.getOffsetHeight();
                if (i == 0)
                {
                    min_left = comp_left;
                    min_top = comp_top;
                    max_width = comp_width;
                    max_height = comp_height;
                }
                else
                {
                    if (min_left > comp_left)
                        min_left = comp_left;
                    if (min_top > comp_top)
                        min_top = comp_top;
                    max_width = max_width + comp_width;
                    if (comp_height > max_height)
                        max_height = comp_height;
                }
                /*
                if (i == 0)
                {
                    min_left = comp_left;
                    min_top = comp_top;
                    max_right = comp_left + comp_width;
                    max_bottom = comp_top + comp_height;
                }
                else
                {
                    if (min_left > comp_left)
                        min_left = comp_left;
                    if (min_top > comp_top)
                        min_top = comp_top;
                    if ((comp_left + comp_width) > max_right)
                        max_right = comp_left + comp_width;
                    if ((comp_top + comp_height) > max_bottom)
                        max_bottom = comp_top + comp_height;
                }*/

            }
            //max_width =  max_right - min_left;
            //max_height = max_bottom - min_top;
            if (parent)
            {
                parent_width = parent.getOffsetWidth();
                parent_height = parent.getOffsetHeight();
                var border = parent._getCurrentStyleBorder();
                if (border)
                {
                    parent_width -= border._getBorderWidth();
                    parent_height -= border._getBorderHeight();
                }

                var padding = parent._getCurrentStylePadding();
                if (padding)
                {
                    parent_width -= padding.left + padding.right;
                    parent_height -= padding.top + padding.bottom;
                }
                max_width = parent_width > max_width ? max_width : parent_width;
                max_height = parent_height > max_height ? max_height : parent_height;
            }

            ret = [min_left, min_top, max_width, max_height];
        }
        else if (layouttype == 1 || layouttype == 2) //horizontal
        {
            //left,top - undefined
            //
            max_height = 0;
            for (i = 0; i < len; i++)
            {
                compid = arr_componentids[i];
                comp = form_comps[compid];
                if (!comp) return false;
                if (!parent)
                    parent = comp._is_group ? comp._group_panel : comp._getForm();
                comp_left = comp.getOffsetLeft();
                comp_top = comp.getOffsetTop();
                if (i == 0)
                {
                    min_left = comp_left;
                    min_top = comp_top;
                }
                else
                {
                    if (min_left > comp_left)
                        min_left = comp_left;
                    if (min_top > comp_top)
                        min_top = comp_top;
                }

                comp_width = comp.getOffsetWidth();
                comp_height = comp.getOffsetHeight();
                if (comp_width > -1)
                    sum_width += comp_width;
                if (comp_height > max_height)
                    max_height = comp_height;
            }
            if (parent)
            {
                parent_width = parent.getOffsetWidth();
                parent_height = parent.getOffsetHeight();
                var border = parent._getCurrentStyleBorder();
                if (border)
                {
                    parent_width -= border._getBorderWidth();
                    parent_height -= border._getBorderHeight();
                }

                var padding = parent._getCurrentStylePadding();
                if (padding)
                {
                    parent_width -= padding.left + padding.right;
                    parent_height -= padding.top + padding.bottom;
                }
                sum_width = parent_width > sum_width ? sum_width : parent_width;
                max_height = parent_height > max_height ? max_height : parent_height;
            }
            ret = [min_left, min_top, sum_width, max_height];
        }/*
        else if (layouttype == 2) // vertical
        {
            //left,top - undefined
            var max_width = 0;
            for (i=0;i<len;i++)
            {
                compid = arr_componentids[i];
                comp = form_comps[compid];
                comp_left = comp._left;
                comp_top = comp._top;
                if (i == 0)
                {
                    min_left = comp_left;
                    min_top = comp_top;
                }
                else
                {
                    if (min_left > comp_left)
                        min_left = comp_left;
                    if (min_top > comp_top)
                        min_top = comp_top;
                }

                comp_width = comp._width;
                comp_height = comp._height;
                if (comp_width > max_width)
                    max_width = comp_width;
                if (comp_height > -1)
                    sum_height += comp_height;
            }
            ret = [min_left, comp_top,max_width, sum_height];
        }*/
        else if (layouttype == 3)
        {//table
            //left,top - undefined
            //width, height 100%
            var width = "100%";
            var height = "100%";
            var start_col = -1, start_row = -1, end_col = -1, end_row = -1;
            for (i = 0; i < len; i++)
            {
                compid = arr_componentids[i];
                comp = form_comps[compid];
                if (comp)
                {
                    comp_left = comp.getOffsetLeft();
                    comp_top = comp.getOffsetTop();
                    if (i == 0)
                    {
                        min_left = comp_left;
                        min_top = comp_top;
                    }
                    else
                    {
                        if (min_left > comp_left)
                            min_left = comp_left;
                        if (min_top > comp_top)
                            min_top = comp_top;
                    }
                    var tca = comp._getTablecellareaCoordinate();
                    if (i == 0)
                    {
                        start_row = tca[0];
                        end_row = tca[1];
                        start_col = tca[2];
                        end_col = tca[3];
                    }
                    else
                    {
                        if (tca[0] < start_row) start_row = tca[0];
                        if (tca[1] > end_row) end_row = tca[1];
                        if (tca[2] < start_col) start_col = tca[2];
                        if (tca[3] > end_col) end_col = tca[3];
                    }
                }
                //last col
                //last row                
            }
            var tablecellarea = start_row + " " + end_row + "/" + start_col + " " + end_col;
            ret = [min_left, min_top, width, height, tablecellarea];
        }
        //사이즈 갱신을 위한 테스트용
        return ret;
    };

    _pForm._removeChildFromContainer = function (obj)
    {
        //Panel을 위한 함수로
        //component를 폼에서 remove시키는것이 아닌 객체는 폼에 존재하고
        //실제 dom, handle만 Panel만 remove 시키는 동작
        if (!obj) return;
        var compid = obj.id;
        if (compid)
        {
            var step_count = this.getStepCount();
            if (step_count > 0)
            {
                var control_elem = this.getElement();//.getContainerElement(obj.positionstep);
                //trace("container_elem11111",container_elem);
                control_elem.removeChildElement(obj.getElement());
            }
            else
            {
                var container_elem = this.getElement().getContainerElement();
                if (container_elem.removeChildElement)
                    container_elem.removeChildElement(obj.getElement());
                else
                    this.getElement().removeChildElement(obj.getElement());
            }
        }
    };

    _pForm._addChildToContainer = function (obj)
    {
        //trace("_addChildFromContainer",obj.id, this.getStepCount());
        //Panel을 위한 함수로
        //component를 폼에서 remove시키는것이 아닌 객체는 폼에 존재하고
        //실제 dom, handle만 Panel만 remove 시키는 동작
        if (!obj) return;
        var compid = obj.id;
        if (compid)
        {
            var step_count = this.getStepCount();
            var control_elem = this.getElement();
            if (step_count > 0)
            {
                var stepindex = obj.positionstep;
                var client_elem = control_elem.getContainerElement(stepindex);
                client_elem.appendChildElement(obj.getElement())
            }
            else
            {

                control_elem.appendChildElement(obj.getElement());
            }
        }
    };
    //===============================================================
    // nexacro.Form : Active Api
    //================================================================
    _pForm._getActivePopupFrame = function ()
    {
        const popupframes = nexacro.getPopupFrames(this);
        if (popupframes && popupframes.length > 0)
        {
            return this._getActiveFrame(popupframes);
        }
        return null;

    }
    _pForm._getActiveFrame = function (frames)
    {
        let finder;
        let _window;
        for (let i = 0, len = frames.length; i < len; i++)
        {
            let frame = frames[i];
            if (frame)
            {
                _window = frame._getWindow();
                if (_window && _window._is_active_window)
                {
                    finder = _window.getActiveFrame();
                    return finder;
                }
                let popupframes = nexacro.getPopupFrames(frame);
                if (popupframes == frames)
                {
                    finder = frame;
                    continue;
                }
                else
                {
                    if (popupframes && popupframes.length > 0)
                    {
                        return this._getActiveFrame(popupframes);
                    }
                }
            }
        }
        if (finder)
        {
            _window = finder._getWindow();
            if (_window && _window._is_active_window)
            {
                finder = _window.getActiveFrame();
                return finder;
            }
            else
            {
                finder = null;
            }
        }
        return finder;
    };

    _pForm.getActiveForm = function ()
    {
        // application이 존재할 경우와 아닌경우 
        const app = this._getApplication();
        if (app)
        {
            return app.getActiveForm()
        }
        else
        {
            const frame = this.getActiveFrame();
            if (frame)
            {
                return frame._p_form;
            }
        }
        return this;
    }

    _pForm.getActiveFrame = function ()
    {
        const app = this._getApplication();
        if (app)
        {
            return app.getActiveFrame();
        }
        else
        {
            return this._getActivePopupFrame()
        }

    };

    _pForm._getActiveWindow = function ()
    {
        const app = this._getApplication();
        if (app)
        {
            return app._getActiveWindow();
        }

        const popupframes = nexacro.getPopupFrames(this);
        if (popupframes && popupframes.length > 0)
        {
            return this._getActivePopupWindow(popupframes);
        }
        let win = this._getWindow();
        if (win && win._is_active_window)
            return win;
        win = this._getRootWindow();
        if (win && win._is_active_window)
            return win;

        return null;
    };
    _pForm._getWindow = function ()
    {
        if (this._is_window)
        {
            return this._window;
        }
        else
        {
            return nexacro.Component.prototype._getWindow.call(this);
        }
    };

    _pForm._getWaitComponentElement = function ()
    {
        var waitComp = this._waitcomp;
        if (waitComp)
        {
            return waitComp.getElement();
        }
        return null;
    };
    _pForm._waitCursor = function (wait_flag, context)
    {
        const app = this._getRootObject();

        if (this == app)
        {
            if (this._window)
            {
                var waitcomp = this._waitcomp;
                if (wait_flag == true)
                {
                    if (this._ref_comm == 0)
                    {
                        nexacro._com_waiting = true;

                        if (waitcomp == null)
                        {
                            waitcomp = this._waitcomp = new nexacro._WaitControl("waitwindow", 0, 0, 0, 0, null, null, null, null, null, null, this);
                            waitcomp.createComponent();

                            waitcomp.on_created();
                        }

                        var waitcursor_imgurl = nexacro._getLoadingImageUrl();
                        waitcomp.setImage(waitcursor_imgurl);

                        this._window._updateWrapper(true);
                        this._window._cancelEvent();
                        this._window._blockImeInput(true);

                        waitcomp._setAccessibilityStatLive(true);
                        waitcomp._setAccessibilityStatHidden(false);
                        waitcomp.show();
                    }
                    waitcomp._addContext(context);
                    this._ref_comm++;
                }
                else
                {
                    this._window._updateWrapper(false);
                    if (this._ref_comm > 0)
                        this._ref_comm--;

                    if (waitcomp)
                    {
                        waitcomp._removeContext(context);
                        if (this._ref_comm <= 0)
                        {
                            this._ref_comm = 0;
                            nexacro._com_waiting = false;
                            this._window._blockImeInput(false);
                            waitcomp.hide();
                            waitcomp._setAccessibilityStatHidden(true);
                        }
                    }
                }
            }
        }
        else
            nexacro.FormBase.prototype._waitCursor.call(this, wait_flag, context);
    };


    _pForm._properties = [
        { name: "all", readonly: true },
        { name: "binds", readonly: true },
        { name: "components", readonly: true },
        { name: "objects", readonly: true },
        { name: "vscrollbar", readonly: true },
        { name: "hscrollbar", readonly: true },
        { name: "opener", readonly: true },
        { name: "layout", readonly: true },
        { name: "statustext" },
        { name: "titletext" },
        { name: "dragscrolltype" },
        { name: "locale" },
        { name: "stepalign" },
        { name: "stepitemgap" },
        { name: "stepitemsize" },
        { name: "stepshowtype" },
        { name: "stepselector", readonly: true }
    ];

    nexacro._defineProperties(_pForm, _pForm._properties);

    _pForm = null;

    if (!nexacro._InnerForm)
    {
        //==============================================================================
        // nexacro._InnerForm
        //==============================================================================
        nexacro._InnerForm = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
        {
            nexacro.Form.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        };

        var _pInnerForm = nexacro._createPrototype(nexacro.Form, nexacro._InnerForm);
        nexacro._InnerForm.prototype = _pInnerForm;
        _pInnerForm._type_name = "Form";

        _pInnerForm._is_subcontrol = false;
        _pInnerForm._is_innerform = true;

        //===============================================================
        // nexacro._InnerForm : Create & Destroy & Update
        //===============================================================
        _pInnerForm.on_created_contents = function (win)
        {
            nexacro.FormBase.prototype.on_created_contents.call(this, win);
            this._changeUserStatus("contents", true);
        };

        _pInnerForm._resetProperties = function ()
        {
            // refform
            this._refform = this;

            // position
            this.init("_inner_form", 0, 0, this._p_parent._getClientWidth(), this._p_parent._getClientHeight());

            // inner var
            this._child_list = [];
            this._hotkey_list = [];
            this._includescriptlist = [];
            this._load_callbacklist = [];

            this._chk_recalc_scroll = [];
        };

        //===============================================================
        // nexacro._InnerForm : Override
        //===============================================================
        _pInnerForm.on_update_position = function (resize_flag, move_flag, update)
        {
            nexacro.Form.prototype.on_update_position.call(this, resize_flag, move_flag, update);
        };

        _pInnerForm.on_changeUserStatus = function (changestatus, value, applyuserstatus/*, currentstatus, currentuserstatus*/)
        {
            if (value)
                return changestatus;

            return applyuserstatus;
        };

        _pInnerForm._on_load = function (obj, url)
        {
            nexacro.Form.prototype._on_load.call(this, obj, url);

            if (this._p_parent)
                this._p_parent.applyTransitionEffect();
        };

        _pInnerForm._getScrollBarSize = function ()
        {
            var scrollbarsize = this._p_scrollbarsize;
            if (this._p_parent && this._p_parent._p_formscrollbarsize != null)
            {
                scrollbarsize = this._p_parent._p_formscrollbarsize;
            }

            if (!nexacro._isNull(scrollbarsize))
                return scrollbarsize;

            var env = this._env;
            scrollbarsize = env._p_scrollbarsize;

            if (!nexacro._isNull(scrollbarsize))
                return scrollbarsize;
            return this._default_scrollbarsize;
        };

        _pInnerForm._getScrollIndicatorSize = function ()
        {
            var scrollindicatorsize = this._p_scrollindicatorsize;
            if (this._p_parent && this._p_parent._p_formscrollindicatorsize != null)
            {
                scrollindicatorsize = this._p_parent._p_formscrollindicatorsize;
            }

            if (!nexacro._isNull(scrollindicatorsize))
                return scrollindicatorsize;

            var env = this._env;
            scrollindicatorsize = env._p_scrollindicatorsize;

            if (!nexacro._isNull(scrollindicatorsize))
                return scrollindicatorsize;

            return this._default_scrollindicatorsize;
        };

        _pInnerForm._createVScrollBar = function (scroll_size)
        {
            var vscrollbartype = this._getVScrollBarType();
            var vscrollbar;

            if (vscrollbartype == "autoindicator" || vscrollbartype == "indicator")
            {
                if (this._p_vscrollbar && (this._p_vscrollbar.id != this._vscrollindicator_id))
                {
                    this._p_vscrollbar.destroy();
                    this._p_vscrollbar = null;
                }

                if (!this._p_vscrollbar)
                    this._p_vscrollbar = new nexacro.ScrollIndicatorControl(this._vscrollindicator_id, 0, 0, scroll_size, this._getClientWidth(), null, null, null, null, null, null, this);

            }
            else
            {
                if (this._p_vscrollbar && (this._p_vscrollbar.id != this._vscrollbar_id))
                {
                    this._p_vscrollbar.destroy();
                    this._p_vscrollbar = null;
                }

                if (!this._p_vscrollbar)
                    this._p_vscrollbar = new nexacro.ScrollBarControl(this._vscrollbar_id, 0, 0, scroll_size, this._getClientWidth(), null, null, null, null, null, null, this);
            }

            vscrollbar = this._p_vscrollbar;
            var _parent = this._p_parent;
            var scrollbarbaroutsize = nexacro._isNull(_parent._p_formscrollbarbaroutsize) ? this._p_scrollbarbaroutsize : _parent._p_formscrollbarbaroutsize;
            if (!nexacro._isNull(scrollbarbaroutsize))
                vscrollbar.set_baroutsize(scrollbarbaroutsize);
            var scrollbarincbuttonsize = nexacro._isNull(_parent._p_formscrollbarincbuttonsize) ? this._p_scrollbarincbuttonsize : _parent.formscrollbarincbuttonsize;
            if (!nexacro._isNull(scrollbarincbuttonsize))
                vscrollbar.set_incbuttonsize(scrollbarincbuttonsize);
            var scrollbardecbuttonsize = nexacro._isNull(_parent._p_formscrollbardecbuttonsize) ? this._p_scrollbardecbuttonsize : _parent.formscrollbardecbuttonsize;
            if (!nexacro._isNull(scrollbardecbuttonsize))
                vscrollbar.set_decbuttonsize(scrollbardecbuttonsize);
            var scrollbarbarminsize = nexacro._isNull(_parent._p_formscrollbarbarminsize) ? this._p_scrollbarbarminsize : _parent.formscrollbarbarminsize;
            if (!nexacro._isNull(scrollbarbarminsize))
                vscrollbar.set_barminsize(scrollbarbarminsize);
            var scrollbartrackbarsize = nexacro._isNull(_parent._p_formscrollbartrackbarsize) ? this._p_scrollbartrackbarsize : _parent.formscrollbartrackbarsize;
            if (!nexacro._isNull(scrollbartrackbarsize))
                vscrollbar.set_trackbarsize(scrollbartrackbarsize);

            if (!vscrollbar._is_created_contents)
            {
                vscrollbar.set_direction("vertical");
                vscrollbar._setEventHandler("onscroll", this.on_notify_vscroll_onscroll, this);
                vscrollbar.createComponent(true);
            }

            vscrollbar.on_apply_cssclass();

            vscrollbar.move(0, 0, scroll_size, this._getClientWidth(), null, null);
        };

        _pInnerForm._createHScrollBar = function (scroll_size)
        {
            var hscrollbar;
            var hscrollbartype = this._getHScrollBarType();

            if (hscrollbartype == "autoindicator" || hscrollbartype == "indicator")
            {

                if (this._p_hscrollbar && (this._p_hscrollbar.id != this._hscrollindicator_id))
                {
                    this._p_hscrollbar.destroy();
                    this._p_hscrollbar = null;
                }

                if (!this._p_hscrollbar)
                    this._p_hscrollbar = new nexacro.ScrollIndicatorControl(this._hscrollindicator_id, 0, 0, this._getClientHeight(), scroll_size, null, null, null, null, null, null, this);
            }
            else
            {

                if (this._p_hscrollbar && (this._p_hscrollbar.id != this._hscrollbar_id))
                {
                    this._p_hscrollbar.destroy();
                    this._p_hscrollbar = null;
                }

                if (!this._p_hscrollbar)
                    this._p_hscrollbar = new nexacro.ScrollBarControl(this._hscrollbar_id, 0, 0, this._getClientHeight(), scroll_size, null, null, null, null, null, null, this);
            }

            hscrollbar = this._p_hscrollbar;
            var _parent = this._p_parent;
            var scrollbarbaroutsize = nexacro._isNull(_parent._p_formscrollbarbaroutsize) ? this._p_scrollbarbaroutsize : _parent._p_formscrollbarbaroutsize;
            if (!nexacro._isNull(scrollbarbaroutsize))
                hscrollbar.set_baroutsize(scrollbarbaroutsize);
            var scrollbarincbuttonsize = nexacro._isNull(_parent._p_formscrollbarincbuttonsize) ? this._p_scrollbarincbuttonsize : _parent._p_formscrollbarincbuttonsize;
            if (!nexacro._isNull(scrollbarincbuttonsize))
                hscrollbar.set_incbuttonsize(scrollbarincbuttonsize);
            var scrollbardecbuttonsize = nexacro._isNull(_parent._p_formscrollbardecbuttonsize) ? this._p_scrollbardecbuttonsize : _parent._p_formscrollbardecbuttonsize;
            if (!nexacro._isNull(scrollbardecbuttonsize))
                hscrollbar.set_decbuttonsize(scrollbardecbuttonsize);
            var scrollbarbarminsize = nexacro._isNull(_parent._p_formscrollbarbarminsize) ? this._p_scrollbarbarminsize : _parent._p_formscrollbarbarminsize;
            if (!nexacro._isNull(scrollbarbarminsize))
                hscrollbar.set_barminsize(scrollbarbarminsize);
            var scrollbartrackbarsize = nexacro._isNull(_parent._p_formscrollbartrackbarsize) ? this._p_scrollbartrackbarsize : _parent._p_formscrollbartrackbarsize;
            if (!nexacro._isNull(scrollbartrackbarsize))
                hscrollbar.set_trackbarsize(scrollbartrackbarsize);

            if (!hscrollbar._is_created_contents)
            {
                hscrollbar.set_direction("horizontal");
                hscrollbar._setEventHandler("onscroll", this.on_notify_hscroll_onscroll, this);
                hscrollbar.createComponent(true);
            }

            hscrollbar.on_apply_cssclass();

            hscrollbar.move(0, 0, this._getClientHeight(), scroll_size, null, null);
        };

        _pInnerForm._setCalcedContainer = function (is_calc)
        {
            if (this._is_flexible_container)
                this._p_parent._calced_container = is_calc;
        };


        //===============================================================
        // nexacro._InnerForm : Properties
        //===============================================================
        _pInnerForm.set_url = function (v)
        {
            this._p_parent.set_url(v);
        };

        _pInnerForm.set_scrollbartype = function (v)
        {
            v = nexacro._toString(v).trim();
            this._p_scrollbartype = v;

            this.on_apply_scrollbartype();
        };

        _pInnerForm.on_apply_scrollbartype = function ()
        {
            var new_vscrollbartype;
            var new_hscrollbartype;
            var v = this._p_scrollbartype ? this._p_scrollbartype : "";
            var arr = v.toLowerCase().split(" ");
            var parent = this._p_parent;
            var div_hscrollbartype, div_vscrollbartype;
            if (parent) 
            {
                div_hscrollbartype = parent._hscrollbartype ? parent._hscrollbartype : "";
                div_vscrollbartype = parent._vscrollbartype ? parent._vscrollbartype : "";
            }

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

            if (div_hscrollbartype)
                new_hscrollbartype = div_hscrollbartype;
            if (div_vscrollbartype)
                new_vscrollbartype = div_vscrollbartype;


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

            var control_elem = this.getElement();
            if (control_elem)
            {
                var hscrollbarsize = this._getHScrollBarSize();
                var vscrollbarsize = this._getVScrollBarSize();

                var hscrollbartype = this._getHScrollBarType();
                var vscrollbartype = this._getVScrollBarType();

                control_elem.setElementScrollbarSize(hscrollbarsize, vscrollbarsize, hscrollbartype, vscrollbartype, this._scrolltype);
                this._onResetScrollBar();
            }
        };

        _pInnerForm.set_scrolltype = function (v)
        {
            v = nexacro._toString(v);

            if (!nexacro._isNull(v))
                v = v.toLowerCase();

            switch (v)
            {
                case "none": case "both": case "horizontal": case "vertical":
                    this._p_scrolltype = v;

                    this.on_apply_scrolltype();
                    break;
                default:
                    break;
            }

            return v;
        };

        _pInnerForm.on_apply_scrolltype = function ()
        {
            var v = this.scrolltype;
            var parent = this._p_parent;
            if (parent)
                this._scrolltype = parent._p_formscrolltype ? parent._p_formscrolltype : v;
            var control_elem = this.getElement();
            if (control_elem)
            {
                var hscrollbarsize = this._getHScrollBarSize();
                var vscrollbarsize = this._getVScrollBarSize();

                var hscrollbartype = this._getHScrollBarType();
                var vscrollbartype = this._getVScrollBarType();

                control_elem.setElementScrollbarSize(hscrollbarsize, vscrollbarsize, hscrollbartype, vscrollbartype, this._scrolltype);
                this._onResetScrollBar();
            }
        };

        _pInnerForm.set_scrollbarbarminsize = function (scrollbarbarminsize)
        {
            if (!this._is_scrollable)
                return;

            if (scrollbarbarminsize !== undefined)
            {
                scrollbarbarminsize = parseInt(scrollbarbarminsize);
                if (isNaN(scrollbarbarminsize))
                    return;
            }

            if (this._p_scrollbarbarminsize != scrollbarbarminsize)
            {
                this._p_scrollbarbarminsize = scrollbarbarminsize;
                this.on_apply_scrollbarbarminsize();
            }
        };

        _pInnerForm.on_apply_scrollbarbarminsize = function ()
        {
            var scrollbarbarminsize = nexacro._isNull(this._p_parent.formscrollbarbarminsize) ? this._p_scrollbarbarminsize : this._p_parent.formscrollbarbarminsize;
            var scrollbar = this._p_vscrollbar;
            if (scrollbar)
                scrollbar.set_barminsize(scrollbarbarminsize);

            scrollbar = this._p_hscrollbar;
            if (scrollbar)
                scrollbar.set_barminsize(scrollbarbarminsize);
        };

        _pInnerForm.set_scrollbarbaroutsize = function (scrollbarbaroutsize)
        {
            if (!this._is_scrollable)
                return;

            if (scrollbarbaroutsize !== undefined)
            {
                scrollbarbaroutsize = parseInt(scrollbarbaroutsize);
                if (isNaN(scrollbarbaroutsize))
                    return;
            }

            if (this._p_scrollbarbaroutsize != scrollbarbaroutsize)
            {
                this._p_scrollbarbaroutsize = scrollbarbaroutsize;
                this.on_apply_scrollbarbaroutsize();
            }
        };

        _pInnerForm.on_apply_scrollbarbaroutsize = function ()
        {
            var scrollbarbaroutsize = nexacro._isNull(this._p_parent.formscrollbarbaroutsize) ? this._p_scrollbarbaroutsize : this._p_parent.formscrollbarbaroutsize;
            var scrollbar = this._p_vscrollbar;
            if (scrollbar)
                scrollbar.set_baroutsize(scrollbarbaroutsize);

            scrollbar = this._p_hscrollbar;
            if (scrollbar)
                scrollbar.set_baroutsize(scrollbarbaroutsize);
        };

        _pInnerForm.set_scrollbardecbuttonsize = function (scrollbardecbuttonsize)
        {
            if (!this._is_scrollable)
                return;

            if (scrollbardecbuttonsize !== undefined)
            {
                scrollbardecbuttonsize = parseInt(scrollbardecbuttonsize);
                if (isNaN(scrollbardecbuttonsize))
                    return;
            }

            if (this._p_scrollbardecbuttonsize != scrollbardecbuttonsize)
            {
                this._p_scrollbardecbuttonsize = scrollbardecbuttonsize;
                this.on_apply_scrollbardecbuttonsize();

            }
        };

        _pInnerForm.on_apply_scrollbardecbuttonsize = function ()
        {
            var scrollbardecbuttonsize = nexacro._isNull(this._p_parent.formscrollbardecbuttonsize) ? this._p_scrollbardecbuttonsize : this._p_parent.formscrollbardecbuttonsize;
            var scrollbar = this._p_vscrollbar;
            if (scrollbar)
                scrollbar.set_decbuttonsize(scrollbardecbuttonsize);

            scrollbar = this._p_hscrollbar;
            if (scrollbar)
                scrollbar.set_decbuttonsize(scrollbardecbuttonsize);
        };

        _pInnerForm.set_scrollbarincbuttonsize = function (scrollbarincbuttonsize)
        {
            if (!this._is_scrollable)
                return;
            if (scrollbarincbuttonsize !== undefined)
            {
                //var scrollbarbaroutsize = parseInt(scrollbarincbuttonsize);
                if (isNaN(scrollbarincbuttonsize))
                    return;
            }

            if (this._p_scrollbarincbuttonsize != scrollbarincbuttonsize)
            {
                this._p_scrollbarincbuttonsize = scrollbarincbuttonsize;
                this.on_apply_scrollbarincbuttonsize();
            }
        };

        _pInnerForm.on_apply_scrollbarincbuttonsize = function ()
        {
            var scrollbarincbuttonsize = nexacro._isNull(this._p_parent.formscrollbarincbuttonsize) ? this._p_scrollbarincbuttonsize : this._p_parent.formscrollbarincbuttonsize;
            var scrollbar = this._p_vscrollbar;
            if (scrollbar)
                scrollbar.set_incbuttonsize(scrollbarincbuttonsize);
            scrollbar = this._p_hscrollbar;
            if (scrollbar)
                scrollbar.set_incbuttonsize(scrollbarincbuttonsize);
        };

        _pInnerForm.on_apply_scrollbarsize = function ()
        {
            var control_elem = this.getElement();
            if (control_elem)
            {
                var hscrollbarsize = this._getHScrollBarSize();
                var vscrollbarsize = this._getVScrollBarSize();

                var hscrollbartype = this._getHScrollBarType();
                var vscrollbartype = this._getVScrollBarType();

                control_elem.setElementScrollbarSize(hscrollbarsize, vscrollbarsize, hscrollbartype, vscrollbartype, this._scrolltype);
            }

            this._onResetScrollBar();
        };

        _pInnerForm.set_scrollbartrackbarsize = function (scrollbartrackbarsize)
        {
            if (!this._is_scrollable)
                return;

            if (scrollbartrackbarsize !== undefined)
            {
                scrollbartrackbarsize = parseInt(scrollbartrackbarsize);
                if (isNaN(scrollbartrackbarsize))
                    return;
            }

            if (this._p_scrollbartrackbarsize != scrollbartrackbarsize)
            {
                this._p_scrollbartrackbarsize = scrollbartrackbarsize;
                this.on_apply_scrollbartrackbarsize();

            }
        };

        _pInnerForm.on_apply_scrollbartrackbarsize = function ()
        {
            var scrollbartrackbarsize = nexacro._isNull(this._p_parent.formscrollbartrackbarsize) ? this._p_scrollbartrackbarsize : this._p_parent.formscrollbartrackbarsize;
            var scrollbar = this._p_vscrollbar;
            if (scrollbar)
                scrollbar.set_trackbarsize(scrollbartrackbarsize);
            scrollbar = this._p_hscrollbar;
            if (scrollbar)
                scrollbar.set_trackbarsize(scrollbartrackbarsize);
        };

        //===============================================================
        // nexacro._InnerForm : Methods
        //===============================================================       
        _pInnerForm.loadForm = function (formurl, async, reload, baseurl)
        {
            var parent_context = this.getParentContext();   //Form            
            var is_async;

            if (async)
            {
                while (parent_context && parent_context._is_form)
                {
                    is_async = parent_context._getAsync();
                    if (!parent_context._is_fired_onload && is_async === false)
                    {
                        async = false;
                        break;
                    }
                    parent_context = parent_context.getParentContext();
                }
            }

            if (this._load_manager)
            {
                var url = nexacro._getFDLLocation(formurl, baseurl);

                var parent = this._p_parent;
                while (parent && !parent._is_frame)
                {
                    if (parent._is_form)
                    {
                        var _p_url = parent._url;
                        if (url == _p_url)
                        {
                            // KISA 보안취약점(6-2) 지적사항
                            //trace("[ERROR] can not use same url with parent form");
                            return;
                            //throw nexacro.MakeURIError(this, "native_load_parent", formurl);
                        }
                    }
                    parent = parent._p_parent;
                }

                this._url = url;
                this._orgurl = formurl;

                this._base_url = nexacro._getBaseUrl(url);

                if (this._load_manager)
                    this._load_manager.clearAllLoad();

                this._clearUserFunctions();

                this._is_loading = true;
                if (this._p_parent._is_frame && this._p_parent._p_form == this)
                {
                    // ChildFrame > Form  
                    var application = this._getApplication();
                    if (application)
                        application._registerLoadforms(this);
                }

                var service = nexacro._getServiceObject(formurl);

                if (this._p_parent._urlchangeeffect)
                {
                    this._p_parent.beginTransitionEffect(this._p_parent._urlchangeeffect);
                    this._load_manager._use_transition_effect = true;
                }

                this._asyncformload = async;
                this._load_manager.loadMainModule(url, undefined, async, reload, service);
            }
        };

        _pInnerForm.addChild = function (id, obj)
        {
            var ret = -1;

            if (id && id.length <= 0)
            {
                return -1;
            }
            if (!obj)
            {
                throw nexacro.MakeReferenceError(this, "reference_not_define", id);
            }

            if (this[id])
            {
                throw nexacro.MakeNativeError(this, "native_exist_id", id);
            }

            if (!obj.id)
            {
                obj.id = obj.name = id;
            }
            else
                obj.id = id;

            obj._p_parent = this;
            obj._refform = this;

            this[id] = obj;
            this._p_all.add_item(id, obj);


            if (this._p_visible && !this._real_visible) obj._real_visible = false;
            else obj._real_visible = this._p_visible;

            if (obj._is_component)
            {
                ret = this._p_components.add_item(id, obj);
                this._child_list.push(obj);
                if (obj._is_alive && obj._is_created)
                    this._control_element.appendChildElement(obj.getElement());

            }
            else if (obj instanceof nexacro.BindItem)
            {
                ret = this._p_binds.add_item(id, obj);
            }
            else
            {
                ret = this._p_objects.add_item(id, obj);
            }

            if (obj._is_component)
                this._p_parent._destroyTextElement();

            return ret;
        };

        _pInnerForm.insertChild = function (idx, id, obj)
        {
            var ret = nexacro.Form.prototype.insertChild.call(this, idx, id, obj);
            if (ret != -1)
            {
                if (obj._is_component)
                    this._p_parent._destroyTextElement();
            }

            return ret;
        };

        _pInnerForm.removeChild = function (id)
        {
            var ret = nexacro.Form.prototype.removeChild.call(this, id);

            if (this._p_parent) this._p_parent.on_apply_text();

            if (this._last_focused)
            {
                if (this._last_focused.id == id)
                {
                    this._last_focused = null;
                }
            }

            return ret;
        };

        _pInnerForm.go = function (strUrl)
        {
            if (this._orgurl != strUrl)
            {
                if (this._orgurl != "")
                {
                    var confirm_message = this._on_beforeclose();

                    if (this._checkAndConfirmClose(confirm_message) == false)
                    {
                        return;
                    }

                    this._on_close();
                }

                this._resetComponent();

                if (strUrl)
                {
                    this._p_parent._p_url = strUrl;
                    this.loadForm(strUrl, this._async, true);
                    this.set_visible(true);
                }
            }
        };

        _pInnerForm.reload = function ()
        {
            this._p_parent.reload();
        };

        _pInnerForm.getOwnerFrame = function ()
        {
            var frame = null;
            if (this._p_parent && !(this._p_parent instanceof nexacro.Frame))
            {
                frame = this._p_parent.getOwnerFrame();
            }
            else
            {
                frame = this._p_parent;
            }
            if (frame && !frame._is_frame)
                return null;
            return frame;
        };

        _pInnerForm.getParentContext = function ()
        {
            return this._p_parent.getParentContext();
        };

        //===============================================================
        // nexacro._InnerForm : Event Handlers
        //===============================================================
        _pInnerForm.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
        {
            this._p_parent.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        };

        _pInnerForm.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
        {
            this._p_parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
        };

        _pInnerForm.on_fire_onhscroll = function (eventid, pos, strType, evtkind)
        {
            nexacro.Component.prototype.on_fire_onhscroll.call(this, eventid, pos, strType, evtkind);
            nexacro.Component.prototype.on_fire_onhscroll.call(this._p_parent, eventid, pos, strType, evtkind);
        };

        _pInnerForm.on_fire_onvscroll = function (eventid, pos, strType, evtkind)
        {
            nexacro.Component.prototype.on_fire_onvscroll.call(this, eventid, pos, strType, evtkind);
            nexacro.Component.prototype.on_fire_onvscroll.call(this._p_parent, eventid, pos, strType, evtkind);
        };

        _pInnerForm._parseArrangeInfo = nexacro._emptyFn;

        _pInnerForm = null;
    }

    if (!nexacro._CompositeComponent)
    {
        //======================================================
        // Object : CompositeComponent
        //====================================================== 
        nexacro._CompositeComponent = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
        {
            nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

            this._p_form = new nexacro._CompositeForm("form", 0, 0, width, height, null, null, null, null, null, null, this);
        };

        var _pCompositeComponent = nexacro._CompositeComponent.prototype = nexacro._createPrototype(nexacro.Component, nexacro._CompositeComponent);

        _pCompositeComponent._type_name = "CompositeComponent";

        /* status */
        _pCompositeComponent._apply_client_padding = false;
        _pCompositeComponent._is_simple_control = true;
        _pCompositeComponent._is_container = true;  //focus tab처리  _getDatasetObject 호출 

        /* accessibility */
        _pCompositeComponent._p_accessibilityrole = "form";

        _pCompositeComponent._event_list = {
            "onclick": 1, "ondblclick": 1, "onkillfocus": 1, "onsetfocus": 1,
            "onkeypress": 1, "onkeydown": 1, "onkeyup": 1,
            "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1,
            "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmousewheel": 1,
            "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
            "onmove": 1, "onsize": 1, "oncontextmenu": 1,
            "onvscroll": 1, "onhscroll": 1, "onmouseup": 1, "onmousedown": 1,
            "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1, "ondevicebuttonup": 1
        };

        _pCompositeComponent._getFormPosition = function ()
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

        _pCompositeComponent.getParentContext = function ()
        {
            return this._p_parent;
        };

        _pCompositeComponent.getOwnerFrame = function ()
        {
            return this._getOwnerFrame();
        };

        _pCompositeComponent._destroyTextElement = function ()
        {
        };

        _pCompositeComponent._destroyFormControl = function ()
        {
            if (this._p_form)
            {
                this._p_form._destroy();
                this._p_form = null;
            }
        };

        _pCompositeComponent.on_create_contents = function ()
        {
            this._load_module();
        };

        _pCompositeComponent.on_created_contents = function (win)
        {
            var form = this._p_form;
            if (form._is_loaded && !form._is_created)
            {
                form.createComponent();
            }

            this._recalcLayout();
        };

        _pCompositeComponent._load_module = function ()
        {
            var refform = this._refform;
            if (refform)
            {
                var baseurl = refform._getRefFormBaseUrl();
                var form = this._p_form;

                var module = this._get_form_module();
                if (module)
                {
                    var url = nexacro._getFDLLocation("CompositeInner.xfdl", baseurl);
                    form.loadModule(url, module);
                }
            }
        };

        _pCompositeComponent.on_destroy_contents = function ()
        {
            this._destroyFormControl();
        };

        _pCompositeComponent.on_create_contents_command = function ()
        {
            var str = "";

            return str;
        };

        _pCompositeComponent.on_attach_contents_handle = function (win)
        {
            var form = this._p_form;

            if (form._is_loaded && !form._is_created)
            {
                form.createComponent();
            }

            this._recalcLayout();
        };

        _pCompositeComponent.on_change_containerRect = function (width, height)
        {
            this._recalcLayout();
        };

        _pCompositeComponent.on_change_containerPos = function (/*left, top*/)
        {
            //
        };

        //===============================================================
        // nexacro.CompositeComponent : Override
        //===============================================================
        _pCompositeComponent.on_apply_prop_enable = function (v)
        {
            if (this._p_form)
            {
                this._p_form._setEnable(v);
            }
        };

        //===============================================================
        // nexacro.CompositeComponent : Properties
        //===============================================================
        _pCompositeComponent.set_padding = nexacro._emptyFn;
        _pCompositeComponent.set_scrollbarbarminsize = function (scrollbarbarminsize)
        {
            if (scrollbarbarminsize !== undefined)
            {
                scrollbarbarminsize = parseInt(scrollbarbarminsize);
                if (isNaN(scrollbarbarminsize))
                    return;
            }

            if (this._p_scrollbarbarminsize != scrollbarbarminsize)
            {
                this._p_scrollbarbarminsize = scrollbarbarminsize;
                nexacro.Component.prototype.set_scrollbarbarminsize.call(this._p_form, scrollbarbarminsize);
            }
        };

        _pCompositeComponent.set_scrollbarbaroutsize = function (scrollbarbaroutsize)
        {
            if (scrollbarbaroutsize !== undefined)
            {
                scrollbarbaroutsize = parseInt(scrollbarbaroutsize);
                if (isNaN(scrollbarbaroutsize))
                    return;
            }

            if (this._p_scrollbarbaroutsize != scrollbarbaroutsize)
            {
                this._p_scrollbarbaroutsize = scrollbarbaroutsize;
                nexacro.Component.prototype.set_scrollbarbaroutsize.call(this._p_form, scrollbarbaroutsize);
            }
        };

        _pCompositeComponent.set_scrollbardecbuttonsize = function (scrollbardecbuttonsize)
        {
            if (scrollbardecbuttonsize !== undefined)
            {
                scrollbardecbuttonsize = parseInt(scrollbardecbuttonsize);
                if (isNaN(scrollbardecbuttonsize))
                    return;
            }

            if (this._p_scrollbardecbuttonsize != scrollbardecbuttonsize)
            {
                this._p_scrollbardecbuttonsize = scrollbardecbuttonsize;
                nexacro.Component.prototype.set_scrollbardecbuttonsize.call(this._p_form, scrollbardecbuttonsize);
            }
        };

        _pCompositeComponent.set_scrollbarincbuttonsize = function (scrollbarincbuttonsize)
        {
            if (scrollbarincbuttonsize !== undefined)
            {
                scrollbarincbuttonsize = parseInt(scrollbarincbuttonsize);
                if (isNaN(scrollbarincbuttonsize))
                    return;
            }

            if (this._p_scrollbarincbuttonsize != scrollbarincbuttonsize)
            {
                this._p_scrollbarincbuttonsize = scrollbarincbuttonsize;
                nexacro.Component.prototype.set_scrollbarincbuttonsize.call(this._p_form, scrollbarincbuttonsize);
            }
        };

        _pCompositeComponent.set_scrollbarsize = function (scrollbarsize)
        {
            if (scrollbarsize !== undefined)
            {
                scrollbarsize = parseInt(scrollbarsize);
                if (isNaN(scrollbarsize))
                    return;
            }

            if (this._p_scrollbarsize != scrollbarsize)
            {
                this._p_scrollbarsize = scrollbarsize;
                nexacro.Component.prototype.set_scrollbarsize.call(this._p_form, scrollbarsize);
            }
        };

        _pCompositeComponent.set_scrollbartrackbarsize = function (scrollbartrackbarsize)
        {
            if (scrollbartrackbarsize !== undefined)
            {
                scrollbartrackbarsize = parseInt(scrollbartrackbarsize);
                if (isNaN(scrollbartrackbarsize))
                    return;
            }

            if (this._p_scrollbartrackbarsize != scrollbartrackbarsize)
            {
                this._p_scrollbartrackbarsize = scrollbartrackbarsize;
                nexacro.Component.prototype.set_scrollbartrackbarsize.call(this._p_form, scrollbartrackbarsize);
            }
        };

        _pCompositeComponent.set_scrollbartype = function (scrollbartype)
        {
            if (this._p_scrollbartype != scrollbartype)
                this._p_scrollbartype = nexacro.Component.prototype.set_scrollbartype.call(this._p_form, scrollbartype);
        };

        _pCompositeComponent.set_scrollindicatorsize = function (scrollindicatorsize)
        {
            if (scrollindicatorsize !== undefined)
            {
                scrollindicatorsize = parseInt(scrollindicatorsize);
                if (isNaN(scrollindicatorsize))
                    return;
            }

            if (this._p_scrollindicatorsize != scrollindicatorsize)
            {
                this._p_scrollindicatorsize = scrollindicatorsize;
                nexacro.Component.prototype.set_scrollindicatorsize.call(this._p_form, scrollindicatorsize);
            }
        };

        _pCompositeComponent.set_scrolltype = function (scrolltype)
        {
            if (this._p_scrolltype != scrolltype)
                this._p_scrolltype = nexacro.Component.prototype.set_scrolltype.call(this._p_form, scrolltype);
        };

        //===============================================================
        // nexacro.CompositeComponent : Methods
        //===============================================================

        _pCompositeComponent.getFocus = function ()
        {
            return this._p_parent ? this._p_parent.getFocus() : null;
        };


        //===============================================================
        // nexacro.CompositeComponent : Event Handlers
        //===============================================================
        _pCompositeComponent._on_activate = function ()
        {
            nexacro.Component.prototype._on_activate.call(this);

            if (this._p_form)
                this._p_form._on_activate();

            return true;
        };

        _pCompositeComponent._on_deactivate = function ()
        {
            nexacro.Component.prototype._on_deactivate.call(this);

            if (this._p_form)
                this._p_form._on_deactivate();

            return true;
        };

        _pCompositeComponent._on_bubble_beforeclose = function (root_closing_comp, event_bubbles, fire_comp, refer_comp)
        {
            return this._p_parent._on_bubble_beforeclose(root_closing_comp, event_bubbles, fire_comp, refer_comp);
        };

        _pCompositeComponent._on_bubble_close = function (event_bubbles, fire_comp, refer_comp)
        {
            return this._p_parent._on_bubble_close(event_bubbles, fire_comp, refer_comp);
        };

        //===============================================================
        // nexacro.CompositeComponent : Logical part
        //===============================================================
        _pCompositeComponent._loadedForm = nexacro._emptyFn;

        _pCompositeComponent._closeForm = function ()
        {
            this._destroyFormControl();
        };

        _pCompositeComponent._recalcLayout = function ()
        {
            var form = this._p_form;
            if (form)
            {
                var pos = this._getFormPosition();

                form._setPos(pos.left, pos.top);
                form._setSize(pos.width, pos.height);
            }
        };

        _pCompositeComponent._on_orientationchange = function (orientation)
        {
            if (this._p_form)
            {
                this._p_form._on_orientationchange(orientation);
            }
        };

        //===============================================================
        // nexacro.CompositeComponent : Util Function
        //===============================================================
        _pCompositeComponent._getComponentsByTaborder = function (/*p, b_include_all*/)
        {
            if (!this._p_form._isEnable() || !this._p_form._child_list || this._p_form._child_list.length == 0)
                return null;

            return [this._p_form];
        };

        _pCompositeComponent._searchNextTabFocus = function (current, bSearchFromFirst, opt_force_cycle, filter_type)
        {
            var ret = nexacro.FormBase.prototype._searchNextTabFocus.call(this, current, bSearchFromFirst, opt_force_cycle, filter_type);

            if (bSearchFromFirst && ret && ret[0] === this._p_form)
            {
                return this._p_parent._searchNextTabFocus(this, undefined, undefined, filter_type);
            }

            return ret;
        };

        _pCompositeComponent._searchPrevTabFocus = function (current, bSearchFromLast, opt_force_cycle, filter_type)
        {
            var ret = nexacro.FormBase.prototype._searchPrevTabFocus.call(this, current, bSearchFromLast, opt_force_cycle, filter_type);

            if (bSearchFromLast && ret && ret[0] === this._p_form)
            {
                return [this];
            }

            return ret;

        };

        _pCompositeComponent._getTabOrderNext = function (current, direction, filter_type)
        {
            return nexacro.FormBase.prototype._getTabOrderNext.call(this, current, direction, filter_type);
        };

        _pCompositeComponent._getTabOrderFirst = function (filter_type)
        {
            return nexacro.FormBase.prototype._getTabOrderFirst.call(this, filter_type);
        };

        _pCompositeComponent._getTabOrderLast = function (filter_type)
        {
            return nexacro.FormBase.prototype._getTabOrderLast.call(this, filter_type);
        };

        _pCompositeComponent._properties = [
            { name: "padding", readonly: true },
            { name: "form", readonly: true },
            { name: "scrollbarbarminsize" },
            { name: "scrollbarbaroutsize" },
            { name: "scrollbardecbuttonsize" },
            { name: "scrollbarincbuttonsize" },
            { name: "scrollbarsize" },
            { name: "scrollbartrackbarsize" },
            { name: "scrollbartype" },
            { name: "scrollindicatorsize" },
            { name: "scrolltype" }
        ];
        nexacro._defineProperties(_pCompositeComponent, _pCompositeComponent._properties);

        _pCompositeComponent = null;

        nexacro._CompositeForm = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
        {
            nexacro._InnerForm.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        };

        var _pCompositeForm = nexacro._createPrototype(nexacro._InnerForm, nexacro._CompositeForm);
        nexacro._CompositeForm.prototype = _pCompositeForm;
        _pCompositeForm._type_name = "Form";

        _pCompositeForm._is_subcontrol = false;

        _pCompositeForm.loadModule = function (url, module)
        {
            this._url = url;
            this._base_url = nexacro._getBaseUrl(url);

            this._load_manager.loadMainModuleByScript(url, module);
        };

        _pCompositeForm = null;

        if (nexacro._LoadManager)
        {
            var __pLoadManager = nexacro._LoadManager.prototype;
            if (__pLoadManager)
            {
                __pLoadManager.loadMainModuleByScript = function (url, module)
                {
                    this.main_url = url;
                    this.status = 1;

                    this.on_load_main(url, 0, module);
                };
            }
        }
    }
}
