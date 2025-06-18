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


if (!nexacro._ExprInfo)
{
    //==============================================================================
    // nexacro._ExprInfo for nexacro.ComplexComponent
    //==============================================================================

    // [BindInfo Information 처리]
    // InnerBind/FullBind용 개별 BindInfo 정보 처리

    nexacro._ExprInfo = function ()
    {
        this.baseid = "";               // expr info base id,
        this.basesq = -1;               // expr info base index (multi items index)
        this.target = null;             // expr target child control id,                null/empty/undefined = self target
        this.setter = "";               // expr target setter function id,              null/empty/undefined = no action
        this.values = null;             // expr result value, variant or array,         null/empty/undefined = value;

        this.exprcx = "";               // expr syntax string
        this.exprix = -1;               // expr cache index
    };

    var _pExprInfo = nexacro._createPrototype(Object, nexacro._ExprInfo);
    nexacro._ExprInfo.prototype = _pExprInfo;
    _pExprInfo._type_name = "_ExprInfo";

    // public methods
    /*
    _pBindInfo.toString = function ()
    {
        return "[object " + this._type_name + "]";
    };
    */

    _pExprInfo._isSetExprCtx = function ()
    {
        return this.exprcx != "";
    };
    _pExprInfo._isSetExprIdx = function ()
    {
        return this.exprix >= 0;
    };

    _pExprInfo._setExprFuncCtx = function (funcctx)
    {
        this.exprcx = funcctx;
    };
    _pExprInfo._setExprFuncIdx = function (funcidx)
    {
        this.exprix = funcidx;
    };
    _pExprInfo._setExprInfo = function (exprinfo)
    {
        this.exprif = exprinfo;
    };

    _pExprInfo._clear = function ()
    {
        /*
        this.baseid = "";
        this.basesq = -1;
        this.setter = "";
        */

        this.target = null;
        this.values = null;

        this.exprif = null;
        this.exprcx = "";
        this.exprix = -1;
    };

    _pExprInfo = null;
}


if (!nexacro._ExprData)
{
    //==============================================================================
    // nexacro._ExprData for nexacro.ComplexComponent
    //==============================================================================

    // [BindData Information 처리]
    // InnerBind/FullBind용 Dataset 정보 처리
    // ValueBind는 SimpleComponent 상속    

    nexacro._ExprData = function (valueexpr, dataexpr, fullexpr)
    {
        this._setExprType(valueexpr, dataexpr, fullexpr);

        this._exprparser = null;        // nexacro.ExprParser
        this._exprtarget = null;        // Expr Target Component

        this._exprinfo = [];            // Expr Info Array
        this._exprfunc = [];            // Expr Func Array
        /*
        this._useexprcache = false;     // Expr Cache
        this._expridxcache = {};        // Expr Func Index Cache
        this._exprretcache = [];        // Expr Func Return Cache
        this._exprexecache = [];        // Expr Func Execute Cache
        */
    };

    var _pExprData = nexacro._createPrototype(Object, nexacro._ExprData);
    nexacro._ExprData.prototype = _pExprData;
    _pExprData._type_name = "_ExprData";

    // public methods
    /*
    _pExprData.toString = function ()
    {
        return "[object " + this._type_name + "]";
    };
    */

    _pExprData._setExprType = function (valueexpr, dataexpr, fullexpr, xmlexpr, jsonexpr)
    {
        this._exprtype = (valueexpr ? 0x01 : 0) + (dataexpr ? 0x02 : 0) + (xmlexpr ? 0x04 : 0) + (jsonexpr ? 0x08 : 0) + (fullexpr ? 0x10 : 0);
    };

    _pExprData._isValueExpr = function () { return (this._exprtype & 0x01) != 0; };
    _pExprData._isInnerExpr = function () { return (this._exprtype & 0x02) != 0; };
    _pExprData._isFullExpr = function () { return (this._exprtype & 0x10) != 0; };
    _pExprData._isDataExpr = function () { return (this._exprtype & 0x1E) != 0; };
    _pExprData._isXMLExpr = function () { return (this._exprtype & 0x04) != 0; };
    _pExprData._isJSONExpr = function () { return (this._exprtype & 0x08) != 0; };

    _pExprData._initExprParser = function ()
    {
        // TODO : Change Global Static Parser
        this._exprparser = new nexacro.ExprParser();
    };
    _pExprData._initExprOwner = function (owner)
    {
        this._exprowner = owner;
    };
    _pExprData._initExprTarget = function (target)
    {
        this._exprtarget = target;
    };

    _pExprData._getExprInfos = function ()
    {
        return this._exprinfo;
    };
    _pExprData._initExprInfo = function (exprinfo)
    {
        if (exprinfo && this._exprparser && this._exprtarget)
        {
            var exprcx = exprinfo.exprcx;
            var exprfn = nexacro._createInlineFunc(this._exprparser.makeExpr(this._exprtarget, exprcx));

            if (exprfn)
            {
                exprinfo._setExprFuncIdx(this.setExprFunc(exprcx, exprfn));
            }
        }
    };
    _pExprData._initExprInfoArray = function (exprinfos)
    {
        if (exprinfos)
        {
            for (var i = 0, l = exprinfos.length; i < l; i++)
            {
                this._initExprInfo(exprinfos[i]);
            }
        }
    };
    _pExprData._pushExprInfoArray = function (exprinfos)
    {
        if (exprinfos)
        {
            for (var i = 0, l = exprinfos.length; i < l; i++)
            {
                this._exprinfo.push(exprinfos[i]);
                exprinfos[i] = null;
            }
        }
    };
    _pExprData._pushInfoArray = function (infos, array)
    {
        if (infos && array)
        {
            for (var i = 0, l = infos.length; i < l; i++)
            {
                array.push(infos[i]);
                infos[i] = null;
            }
        }
    };
    _pExprData._setExprInfos = function (exprinfos)
    {
        this._clearExprInfos();
        this._clearExprFuncs();

        this._addExprInfo(exprinfos);
    };
    _pExprData._addExprInfo = function (exprinfo)
    {
        if (exprinfo.length)
        {
            this._initExprInfoArray(exprinfo);
            this._pushExprInfoArray(exprinfo);
        }
        else
        {
            this._initExprInfo(exprinfo);
            this._exprinfo.push(exprinfo);
        }
    };
    _pExprData.setExprFunc = function (exprctx, exprfunc)
    {
        var expridx = this._exprfunc.length;

        this._exprfunc.push(exprfunc);

        // TODO : exprfunc cache
        /*
        if (this._useexprcache)
        {
            this._expridxcache[exprctx] = expridx;
            this._exprretcache[expridx] = null;
            this._exprrescache[expridx] = false;
        }
        */

        return expridx;
    };
    _pExprData.getExprFuncByIdx = function (index)
    {
        return index >= 0 && index < this._exprfunc.length ? this._exprfunc[index] : null;
    };
    _pExprData.getExprFuncByCtx = function (ctx)
    {
        // TODO : exprfunc cache
        /*
        if (this._useexprcache)
        {
            return this.getExprFuncByIdx(this.getExprCacheIdx(ctx));
        }
        */
    };

    // TODO : exprfunc cache
    /*
    _pExprData.setExprCacheIdx = function (exprctx, expridx)
    {
        this._expridxcache[exprctx] = expridx;
    };
    _pExprData.setExprCacheRet = function (expridx, exprret)
    {
        this._exprretcache[expridx] = exprret;
    };
    _pExprData.getExprCacheIdx = function (exprctx)
    {
        return this._expridxcache[exprctx];
    };
    _pExprData.getExprCacheRet = function (expridx)
    {
        return expridx < this._exprretcache.length;
    };
    _pExprData.getExprCacheRet = function (expridx)
    {
        if (expridx < this._exprretcache.length)
            return this._exprretcache[expridx];
        else
            return 
    };
    */

    _pExprData._getExprData = function (index)
    {
        var infos = this._exprinfo;

        if (infos)
        {
            for (var i = 0, l = infos.length; i < l; i++)
            {
                var info = infos[i];

                if (info)
                {
                    info.values = this._fetchExprData(info.exprix, index);
                }
            }
        }

        return this;
    };

    _pExprData._fetchExprData = function (exprix, index)
    {
        if (exprix >= 0)
        {
            // TODO : exprfunc cache
            /*
            if (this._useexprcache)
            {
                var exprex = this._exprexecache[exprix];

                if (exprex)
                {
                    return this._exprretcache[exprix];
                }

                var exprfn = this._exprfunc[exprix];

                if (exprfn)
                {
                    var ret = exprfn.call(this._exprowner, this._exprtarget);

                    this._exprretcache[exprix] = ret;
                    this._exprexecache[exprix] = true;

                    return ret;
                }
            }
            else
            */
            {
                var exprfn = this._exprfunc[exprix];

                if (exprfn)
                {
                    return exprfn.call(this._exprowner, this._exprtarget);
                }
            }
        }

        return undefined;
    };

    _pExprData._clearExprTarget = function ()
    {
        this._exprtarget = null;
    };
    _pExprData._clearExprParser = function ()
    {
        if (this._exprparser)
        {
            delete this._exprparser;
            this._exprparser = null;
        }
    };
    _pExprData._clearExprInfos = function ()
    {
        for (var i = 0, l = this._exprinfo.length; i < l; i++)
        {
            if (this._exprinfo[i])
            {
                this._exprinfo[i]._clear();
                delete this._exprinfo[i];
                this._exprinfo[i] = null;
            }
        }

        this._exprinfo = [];
    };
    _pExprData._clearExprFuncs = function ()
    {
        for (var i = 0, l = this._exprfunc.length; i < l; i++)
        {
            if (this._exprfunc[i])
            {
                delete this._exprfunc[i];
                this._exprfunc[i] = null;
            }
        }

        this._exprfunc = [];
    };

    /*
    _pExprData._resetExprRetCache = function ()
    {
        for (var i = 0, l = this._exprretcache.length; i < l; i++)
        {
            this._exprretcache[i] = null;
        }
    };
    _pExprData._resetExprExeCache = function ()
    {
        for (var i = 0, l = this._exprexecache.length; i < l; i++)
        {
            this._exprexecache[i] = false;
        }
    };
    _pExprData._clearExprIdxCache = function ()
    {
        this._exprcache = {};
    };
    _pExprData._clearExprRetCache = function ()
    {
        this._resetExprRetCache();
        this._exprretcache = [];
    };
    _pExprData._clearExprExeCache = function ()
    {
    //  this._resetExprExeCache();
        this._exprexecache = [];
    };
    _pExprData._clearExprCache = function ()
    {
        this._clearExprRetCache();
        this._clearExprExeCache();
        this._clearExprIdxCache();
    };
    */

    _pExprData._clear = function ()
    {
        //  this._clearExprCache();
        this._clearExprInfos();
        this._clearExprFuncs();
        this._clearExprParser();
        this._clearExprTarget();
    };

    _pExprData = null;
}

if (!nexacro._SelectInfo)
{
    //==============================================================================
    // nexacro._SelectInfo for nexacro.SimpleComponent
    //==============================================================================

    // [SelectInfo Information 처리]
    // InnerBind/FullBind용 개별 SelectInfo 정보 처리
    // SelectInfo는 ExprInfo를 상속하여 처리됨

    // nexacro._SelectConst
    nexacro._SelectConst =
    {
        SELECTTYPE_NONE: 0x00,         // None Select
        SELECTTYPE_VALUE: 0x01,        // Value Component Default
        SELECTTYPE_TEXT: 0x02,         // Text/Edit Component Select Default
        SELECTTYPE_COMP: 0x04,         // Simple Component Select Default
        SELECTTYPE_ITEM: 0x08,         // Complex Component Item Select Default
        SELECTTYPE_USER: 0xFF
    };

    // nexacro._SelectInfo
    nexacro._SelectInfo = function (selecttype, positcount, rangecount, multicount, unselvalue)
    {
        /*
        this._selectlist = [];          // select data list select:[range:[posit:[pos]...]...]...]

        this._unselvalue = null;        // unselect value
        this._selecttype = 0;           // select type : comp:component self, item:child item list, text:text property, value:value proeprty
        this._positcount = 1;           // select position dimension    posit:[pos][pos][pos]       0<=:no posit error, 1:single posit no array, 1>=:multi posit array
        this._rangecount = 1;           // select range dimension       range:[posit][posit]        0<=:no range error, 1:single range no array, 1>=:multi range array
        this._multicount = 0;           // select multi count           multi:[range][range]        0==:single select,  1:single select toggle,  1>=:multi select array limited,  0<:multi select unlimited
        this._currselect = -1;          // current select point for select list
        */

        this._initSelect(selecttype, positcount, rangecount, multicount, unselvalue);
    };

    var _pSelectInfo = nexacro._createPrototype(nexacro.Object, nexacro._SelectInfo);
    nexacro._SelectInfo.prototype = _pSelectInfo;
    _pSelectInfo._type_name = "_SelectInfo";

    // public methods
    /*
    _pSelectInfo.toString = function ()
    {
        return "[object " + this._type_name + "]";
    };
    */

    _pSelectInfo._initSelect = function (selecttype, positcount, rangecount, multicount, unselvalue)
    {
        this._selectlist = [];
        this._unselvalue = unselvalue;

        this._selecttype = selecttype ? selecttype : nexacro._SelectConst.SELECTTYPE_NONE;

        this._positcount = positcount ? positcount : 1;
        this._rangecount = rangecount ? rangecount : 1;
        this._multicount = multicount ? multicount : 1;

        this._currselect = this._multicount >= 0 ? this._multicount - 1 : -1;
    };

    // TODO : Event 처리는 SelectManager를 생성하여 Manager에서 처리
    _pSelectInfo._setSelectEvent = function (target)
    {
        // set select event target
        this.eventtarget = target;
    };
    _pSelectInfo._clearSelectEvent = function ()
    {
        // clear scroll event
        this.eventtarget = null;
    };

    _pSelectInfo._getCurrentSelect = function ()
    {
        if (this._currselect < 0 || this._currselect >= this._selectlist.length)
            return this._unselvalue;
        else
            return this._selectlist[this._currselect];
    };
    _pSelectInfo._setCurrentSelect = function (select)
    {
        this._currselect = this._currselect < 0 ? 0 : this._currselect;
        this._selectlist.length = this._currselect + 1;

        var old = this._selectlist[this._currselect];
        if (this._checkSelectChange(old, select))
        {
            this._selectlist[this._currselect] = select;

            if (this.eventtarget)
                this.eventtarget._onChangeSelect(this, this._selecttype, old, select);
        }
    };
    _pSelectInfo._addMultiSelect = function (select)
    {
        if (this._multicount < 0)
        {
            this._currselect++;
            this._selectlist.length = this._currselect + 1;
            this._selectlist[this._currselect] = select;

            if (this.eventtarget)
                this.eventtarget._onChangeSelect(this, this._selecttype, null, select);
        }
        else if (this._multicount > 0)
        {
            if (this._currselect + 1 < this._multicount)
            {
                this._currselect++;
                this._selectlist[this._currselect] = select;

                if (this.eventtarget)
                    this.eventtarget._onChangeSelect(this, this._selecttype, null, select);
            }
        }
    };
    _pSelectInfo._popMultiSelect = function ()
    {
        if (this._multicount < 0)
        {
            this._currselect--;
            this._selectlist.length = this._currselect - 1;

            if (this.eventtarget)
                this.eventtarget._onChangeSelect(this, this._selecttype, null, null);
        }
        else if (this._multicount > 0)
        {
            if (this._currselect - 1 >= 0)
            {
                this._selectlist[this._currselect] = this._unselvalue;
                this._currselect--;
            }
        }
    };

    _pSelectInfo._clearCurrentSelect = function ()
    {
        if (this._multicount)
            this._selectlist[this._currselect] = this._unselvalue;
        else
            this._clear();

        if (this.eventtarget)
            this.eventtarget._onChangeSelect(this, this._selecttype, this._currselect, null);
    };
    _pSelectInfo._clearCurrentSelectPos = function ()
    {
        this._selectlist = [];
        this._currselect = this._multicount >= 0 ? this._multicount - 1 : -1;
    };
    _pSelectInfo._clearMultiSelectList = function ()
    {
        this._selectlist = [];
        this._selectlist.length = this._multicount > 0 ? this._multicount : 0;
        this._currselect = this._multicount > 0 ? this._multicount - 1 : -1;

        for (var i = 0, n = this._multicount; i < n; i++)
            this._selectlist[i] = this._unselvalue;

        if (this.eventtarget)
            this.eventtarget._onChangeSelect(this, this._selecttype, this._currselect, null);
    };

    _pSelectInfo._checkAboveCurrentSelect = function (idx1, idx2)
    {
        // TODO: check
    };
    _pSelectInfo._checkAboveMultiSelectList = function (idx1, idx2)
    {
        // TODO: check
    };
    _pSelectInfo._checkSelectChange = function (oldselect, newselect)
    {
        if (this.eventtarget)
            return this.eventtarget._onCheckSelectChange(oldselect, newselect);
    };

    _pSelectInfo._getMultiSelectCount = function ()
    {
        return this._multicount ? this._multicount : this._selectlist.length;
    };
    _pSelectInfo._getMultiSelectList = function ()
    {
        return this._selectlist;
    };

    _pSelectInfo._clear = function ()
    {
        this._selectlist = [];
        this._unselvalue = null;
        this._eventtarget = null;
        this._currselect = -1;
    };

    _pSelectInfo = null;
}

if (!nexacro.SimpleComponent)
{
    //==============================================================================
    // nexacro.UserEventInfo
    //==============================================================================
    /*
    nexacro.UserEventInfo = function (obj, id, arg)
    {
        this.id = this.eventid = id || "on";
        this.fromobject = this.fromreferenceobject = obj;
        this.arg = arg;
    };

    var _pUserEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.UserEventInfo);
    nexacro.UserEventInfo.prototype = _pUserEventInfo;
    _pUserEventInfo._type_name = "UserEventInfo";

    delete _pUserEventInfo;
    */

    //==============================================================================
    // nexacro.SimpleComponent
    //==============================================================================

    /* template comment
    // [interface:status]               : template code inteface comment
    // [interface.subinterface:status]  : sub interface comment
    // [interface/]                     : close comment
    */
    /* template code
    // nexacro                          : nexacro. 과 같은 Package Name
    // SimpleComponent                  : SimpleComponent Type Name
    // Component                        : SimpleComponent Inherited Parent Component Type Name
    // BasicComponent                   : Nexacro Basic Component
    // ControlComponent                 : User Component의 하위 Control Component
    // Property(n)                      : User Property
    // Method(n)                        : User Method
    // Event(n)                         : User Event
    // Variant(n)                       : User Variant
    // PredefineStatus(n)               : Component Status
    // Status(n)                        : User Status
    // DEFAULT_VALUE                    : Property default value
    */

    // [object.inherit:create]
    nexacro.SimpleComponent = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        // TODO : InitComponent로 이동시킬것
        this._initProperties();
        this._initEvents();
    };

    // [object.prototype:create]
    var _pSimpleComponent = nexacro._createPrototype(nexacro.Component, nexacro.SimpleComponent);
    nexacro.SimpleComponent.prototype = _pSimpleComponent;

    // [component.typename:create]
    _pSimpleComponent._type_name = "SimpleComponent";   // 각각 Component Type 개별 지정, Override 필요.
    _pSimpleComponent._is_simple_control = true;        // Simple/Complex Flag 고정 지정, Override 없음.


    //===============================================================
    // nexacro.SimpleComponent : Init
    //===============================================================

    // [component.variable:init]
    /*
    _pSimpleComponent._var1 = true;
    _pSimpleComponent._var2 = null;
    _pSimpleComponent._var3 = false;
    */

    // [object.property:init]
    /*
    _pSimpleComponent.prop1 = true;
    _pSimpleComponent.prop2 = false;
    _pSimpleComponent.prop3 = false;
    */

    // [component.status:init]
    /*
    _pComplexComponent._use_pushed_status = true;
    _pComplexComponent._use_selected_status = true;
    */

    // [component.accessibility:init]
    /*
    _pComplexComponent._accessibility_role = "RoleName";
    */

    // [object.event:init]
    /*
    _pSimpleComponent._event_list = 
    {
            "onlbuttondown": 1,
            "onlbuttonup": 1, 
            "onmouseenter": 1,
            "onmouseleave": 1,
            "onmousemove": 1,
            "onmove": 1,
            "onsize": 1,
            "onmousedown": 1,
            "onmouseup": 1,
            "ontouchstart": 1,
            "ontouchmove": 1,
            "ontouchend": 1,
            "onflingstart": 1,
            "onfling": 1,
            "onflingend": 1,
            "onpinchstart": 1,
            "onpinch": 1,
            "onpinchend": 1,
            "onlongpress": 1,
            "onslidestart": 1,
            "onslide": 1,
            "onslideend": 1
    };
    */


    //===============================================================
    // nexacro.SimpleComponent : Create/Destroy
    //===============================================================

    // [Simple Component 처리]
    // Control/Contents Element 및 주요 내용 Element(ex:IconText Element)의 처리 code는
    // 해당 Element를 가지는 Basic Component에서 모두 처리, 하위 상속에서는 노출없음.

    // [object:create]                              // 이부분의 override는 없음.
    _pSimpleComponent.create = function ()          
    {
        // check created
        if (this._is_created)
            return;

        // create component
        this.createComponent();
    };

    // [component:create]                           // 이부분 override는 basic component에서만
    _pSimpleComponent.onCreateComponent = function ()     
    {
        // check parent
        var parentElem = this._getParentElement();

        if (parentElem)
        {
            // create control element
            if (this._createControlElement(parentElem))
            {
                // init control elements
                this._initControlElement();

                // apply properties
                this._applyProperties();
                // apply accessibility
                this._applyAccessibility();

                // init bindinfo for value
                this._initBindInfo();
                // init exprinfo for value
                this._initExprInfo();
                // init/create contents
                this._initContents();
            }

            return true;
        }
        else
        {
            return false;
        }
    };

    // [component:created]                          // 이부분 override는 최소화 (window 별도 처리에만 override)
    _pSimpleComponent.onCreated = function (window)
    {
        // check form loading
        if (this._is_loading)                       // TODO:_is_loading? 확인
            return;

        // check parent
        var parentElem = this._getParentElement();

        if (parentElem)
        {
            // check window
            window = window || this._getWindow();

            // created control element
            if (this._createdControlElement(window))
            {
                // created init logic
                this._initHotKey();
                this._resetStatus();

                // created contents
                if (!this._is_created)                 // TODO:_is_created? 확인
                {
                    this._createdContents(window);    // Basic Component Override
                    this._is_created = true;
                }

                // layout
                this._recalcLayout();
            }
        }
    };

    // [component:init]                             // 이부분 override는 없음
    _pSimpleComponent._initComponent = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight)
    {
        var control_elem = this._control_element;
        if (!control_elem)
        {
            this._initUniqueID();
            this._initOverflow();
            this._initBind();
            this._initExpr();
            this._initSelect();
            this._initStatus();
            //  this._initProperties();
            //  this._initEvents();
            this._initAccessibility();
        }
    };
    // [component:init]                             // Override 제외 // TODO : createComponent 내에서 통합
    _pSimpleComponent._initComponentClone = function (source)
    {

        this._initUniqueID();
        this._initOverflow();
        this._initBind();
        this._initExpr();
        this._initSelect();
        this._initStatus();
        //  this._initProperties();
        this._cloneProperties(source);
        //  this._initEvents();
        this._initAccessibility();

    };

    // [component:clone]      // Override 제외
    _pSimpleComponent._cloneProperties = function (source)
    {
        if (source) this._onCloneProperities(source);
    };

    // [component:uninit]                          // 이부분 override는 없음, TODO: Interface별로 분리할것.
    _pSimpleComponent._uninitComponent = function ()
    {
        // clear propinit
        this._clearInitValue();
        // clear event listners
        this._clearEventListeners();
        // clear capture
        this._clearCaptureLock();
        // remove parent
        this._clearParentsList();
        // clear inner vars 
        this._clearInnerVars();
        // clear style vars
        this._clearStyleVars();
    };

    // [component.properity.initvalue:clear]
    _pSimpleComponent._clearInitValue = function ()
    {
        // clear propinit
        if (this._setpropinitfn)
        {
            delete this._setpropinitfn;
            this._setpropinitfn = null;
        }
    };

    // [component.capture:clear]
    _pSimpleComponent._clearCaptureLock = function ()
    {
        // clear capture
        var _window = this._getWindow();
        if (_window && this._track_capture)
        {
            _window._releaseCaptureLock(this);
            _window._releaseCaptureLock(this._attached_comp);
            this._track_capture = false;
        }
    };

    // [component:clearParent]
    _pSimpleComponent._clearParentsList = function ()
    {
        // remove parent
        if (this.parent && this.parent.removeChild)
        {
            this.parent.removeChild(this.id);
        }
        else
        {
            var win = this._getWindow();
            if (win)
                win._removeFromCurrentFocusPath(this);
        }
    };

    // [component:clearinnervar]
    _pSimpleComponent._clearInnerVars = function ()
    {
        // clear inner vars // TODO:Interface별로 분리
        if (this._refform)
            this._refform = null;
        if (this.parent)
            this.parent = null;
        if (this._refobj)
            this._refobj = null;
        if (this.hotkey)
            this.hotkey = null;
        if (this._event_list)
            this._event_list = null;
        if (this._last_focused)
            this._last_focused = null;
        if (this._cssselector)
            this._cssselector = null;
    };

    // [component:clearstylevar]
    _pSimpleComponent._clearStyleVars = function ()
    {
        // clear style vars
        this._clearStyleObject();
    };

    // [component:destory]                          // 이부분 override는 basic component에서만
    _pSimpleComponent.onDestroyComponent = function ()
    {
        // destory client contents
        //      if (!this._is_created)
        {
            this._is_created = false;
            this.onDestroyContents();               // 모든 Component Override
        }

        // clear logic
        this._clearHotKey();
        this._clearBind();
        this._clearExpr();
        this._clearSelect();
        this._clearStatus();

        // clear accessibility
        this._clearAccessibility();
        // clear properties
        this._clearProperties();

        // destory controlelement
        this._destroyControlElement();
    };

    // [component:destroy]                          // override는 최소화. onDestroyComponent에서 override 처리
    _pSimpleComponent.destroyComponent = function ()
    {
        //  if (!this._is_loading)                      // TODO:_is_loading? 확인
        {
            this._is_alive = false;

            // uninit component
            this._uninitComponent();

            // destory override
            this.onDestroyComponent();

            return true;
        }
    };

    // [object:destroy]                             // override 없음
    _pSimpleComponent.destroy = function ()
    {
        // check alive
        if (!this._is_alive)
            return false;

        // destroy component
        return this.destroyComponent();
    };



    //===============================================================
    // nexacro.SimpleComponent : Control Element
    //===============================================================

    // [상위 Component 처리]
    // BasicComponent 까지만 ControlElement 직접코딩가능
    // UserComponent는 ControlElement 관련 Override 및 직접코딩 불가

    // [component.controlelement:created]           // 이부분 override는 basic component에서만
    _pSimpleComponent._createdControlElement = function (_window)
    {
        var controlElem = this._control_element;
        if (controlElem)
        {
            controlElem.create(_window);

            //  onCreatedControlElement();              // 이 override 노출은 제외

            return controlElem.handle;
        }
        return null;
    };

    // [component.controlelement:destroy]           // 이부분 override는 basic component에서만, 가급적 제외
    _pSimpleComponent._destroyControlElement = function ()
    {
        if (this._control_element)
        {
            this._control_element.destroy();
            this._control_element = null;
        }

        //  onDestroyControlElement();                  // 이 override 노출은 가급적 제외
    };


    //===============================================================
    // nexacro.SimpleComponent : Client Element
    //===============================================================

    // [SimpleComponent Component 처리]
    // BasicComponent 까지만 ClientElement 직접코딩가능
    // UserComponent는 ClientElement 관련 Override 및 직접코딩 불가

    // TODO : ControlElement내 ClientElement로 통합

    // [component.clientelement:create]             // 이부분 override는 basic component에서만
    _pSimpleComponent._createClientElement = function ()
    {
        // check parent
        var control_elem = this._control_element;
        if (control_elem)
        {
            // create client element
            this._onCreateClientElement(control_elem);

            // check client elements
            if (this._client_elem)
            {
                // init client elements
                this._initClientElement();
            }
        }
    };
    // [component.clientelement:create]             // 이부분 override는 basic component에서만
    _pSimpleComponent._onCreateClientElement = function (parent_elem)
    {
        this._client_elem = new nexacro.IconTextElement(parent_elem);
    };

    // [component.clientelement:init]               // 이부분 override는 basic component에서만
    _pSimpleComponent._initClientElement = function ()
    {
        this._initClientElementPositionSize();
        this._initClientElementStyleProps();
        this._initClientElementValueProps();
    };

    // [component.clientelement.init:possize]       // 이부분 override는 basic component에서만
    _pSimpleComponent._initClientElementPositionSize = function ()
    {
        this._client_elem.setElementPosition(0, 0);
        this._client_elem.setElementSize(this._getClientWidth(), this._getClientHeight());
    };

    // [component.clientelement.init:styleprop]     // 이부분 override는 basic component에서만
    _pSimpleComponent._initClientElementStyleProps = function ()
    {
        if (this.textAlign)
            this._client_elem.setElementTextAlign(this.textAlign);
        if (this.verticalAlign)
            this._client_elem.setElementVerticalAlign(this.verticalAlign);
    };

    // [component.clientelement.init:valueprop]     // 이부분 override는 basic component에서만
    _pSimpleComponent._initClientElementValueProps = function ()
    {
        // TODO : Basic Component별 처리
        /*
            if (this.id)
                this._setClientElementText(this.id);
        */
    };

    // [component.clientelement:get]                // 이부분 override는 basic component에서만
    _pSimpleComponent._getClientElement = function ()
    {
        return this._client_elem;
    };
    // [component.clientelement:set]                // 이부분 override는 basic component에서만
    _pSimpleComponent._setClientElementText = function (text)
    {
        this._client_elem.setElementText(text);
    };

    // [component.clientelement:created]            // 이부분 override는 basic component에서만, 가급적 제외
    _pSimpleComponent._createdClientElement = function (_window)
    {
        if (this._client_elem)
        {
            this._client_elem.create(_window);      // create? created?
        }

        //  onCreatedClientElement();                   // 이 override 노출은 제외
    };

    // [component.clientelement:destroy]            // 이부분 override는 basic component에서만, 가급적 제외
    _pSimpleComponent._destroyClientElement = function ()
    {
        if (this._client_elem)
        {
            this._client_elem.destroy();
            this._client_elem = null;
        }

        //  onDestroyClientElement();                   // 이 override 노출은 가급적 제외
    };

    //===============================================================
    // nexacro.SimpleComponent : Overflow
    //===============================================================

    // [Simple Component 처리]
    // Overflow는 Scroll/Expand 처리의 기본 설정만 제공
    // Simple에서는 현재 별도 처리 없고 Complex에서 별도 처리

    // [component:init]                             // 이부분 override는 Complex만
    _pSimpleComponent._initOverflow = function ()
    {
    };

    //===============================================================
    // nexacro.SimpleComponent : Contents
    //===============================================================

    // [Simple Component 처리]
    // 아래는 Basic Component만 override 가능
    // 각 하위 Component는 ClientElement만 직접코딩가능

    // [component.contents:created]                 // 이부분 override는 basic component에서만      
    _pSimpleComponent._createdContents = function (_window)
    {
        this.onCreatedContents(_window);
    };

    // [component.contents:clear]                   // 이부분 override는 basic component에서만
    _pSimpleComponent._clearContents = function ()
    {
        this.onClearContents();                     // Recreate 처리를 위해 Content Clear는 여기서 모두 처리
    };

    // [component.contents:set]                     // 이부분 override는 basic component에서만   
    _pSimpleComponent._setContents = function (strContents)
    {
        this._onSetContents(strContents);           // Contents 변경시에 Override 
    };

    // [개별 Component 처리]
    // 아래는 각 Component에서 override 가능
    // 각 하위 Component는 ClientElement만 직접코딩가능

    // [component.contents:create]                  // Contents 변경시에 Override       
    _pSimpleComponent.onCreateContents = function (created)
    {
        this._createClientElement();
    };

    // [component.contents:created]                 // TODO: onCreatedContents와 소스통합        
    _pSimpleComponent.on_created_contents = function (_window)
    {
        this.onCreatedContents(_window);
    };
    // [component.contents:created]                 // Contents 변경시에 Override             
    _pSimpleComponent.onCreatedContents = function (_window)
    {
        this._createdClientElement(_window);
    };

    // [component.contents:clear]                   // Contents 변경시에 Override          
    _pSimpleComponent.onClearContents = function ()
    {
        this._destroyClientElement();
    };
    // [component.contents:destory]                 // 이부분 override는 basic component에서만
    _pSimpleComponent.onDestroyContents = function ()
    {
        this._clearContents();                      // Recreate 처리를 위해 ClearContents로 모두 처리
    };

    // [component.contents:set]                     // Contents 변경시에 Override 
    _pSimpleComponent._onSetContents = function (strContents)
    {

    };

    //===============================================================
    // nexacro.SimpleComponent : Recreate
    //===============================================================

    // [상위 Component 처리]
    // Recreate 처리용 Component에 한하여 추가처리


    // [component.contents:recreate]                
    _pSimpleComponent._recreateContents = function ()
    {
        this._clearContents();
        this._initContents();
        this._createdContents(this._getWindow());

        this._recalcLayout(true);
    };
    // [component:recreate]                         
    _pSimpleComponent._recreateComponent = function ()
    {
        this.destroyComponent();
        this.createComponent();
    };
    // [object:recreate]                           
    _pSimpleComponent._recreate = function ()
    {
        this.destroy();
        this.create();
    };

    // [하위 Component 처리]
    // Recreate Logic이 별도인 Basic Component에 한하여 Override



    //===============================================================
    // nexacro.SimpleComponent : Create Command/Handle
    //===============================================================

    // [상위 Component 처리]
    // Command/Attach는 Contents 수정시 같이 수정되도록 제공
    // SimpleComponent 까지는 Element Command/Attach 코딩가능

    // [component:createcommand]   
    _pSimpleComponent.createCommand = function ()     // TODO:소스통합
    {
        return this._createCommand();
    };
    _pSimpleComponent.attachHandle = function (win)   // TODO:소스통합
    {
        return this._attachHandle(win);
    };

    // [component:createcommand]                    
    _pSimpleComponent._createCommand = function ()
    {
        var str = "";
        var controlElem = this._control_element;
        if (controlElem && !this._is_loading)
        {
            var enable = this._isEnable();

            if ((this._real_enable == null && enable == false) || (this._real_enable && this._real_enable != enable))
            {
                this._real_enable = enable;
                this._changeStatus("disabled", !enable);
                this.on_apply_prop_enable(enable);
            }
            else
            {
                this._real_enable = enable;
                this._setAccessibilityStatFlag(this._status, this._userstatus);
            }

            if (this._status || this._userstatus)
                this._apply_status_toelement("", this._status, "", this._userstatus);

            // prepare command
            this.onPrepareCommand();

            // get command
            str = controlElem.createCommandStart();
            if (str)
            {
                str += this.onCreateContentsCommand();  // Basic Component에서만 Override
                str += controlElem.createCommandEnd();
            }

            this._is_create_commandstr = true;
        }
        return str;
    };

    // [component.contents:preparecommand]           
    _pSimpleComponent.onPrepareCommand = function ()
    {
        // apply propeties for command
        this._applyProperties();

        // apply position for command
        this._update_position();

        // apply layout for command
        this._recalcLayout(true);
    };

    // [component.contents:createcommand]           
    _pSimpleComponent.onCreateContentsCommand = function ()
    {
        return this._client_elem ? this._client_elem.createCommand() : "";
    };

    // [component:attachhandle]                     
    _pSimpleComponent._attachHandle = function (win)
    {
        if (!this._is_created && this._is_create_commandstr)
        {
            // attach handle
            this.onAttachControlHandle(win);            // Basic Component에서만 Override
            this.onAttachContentsHandle(win);           // Basic Component에서만 Override

            // apply status for command
            this._resetStatus();

            // created
            this._is_created = true;
        }
    };

    // [component.control:attachhandle]            
    _pSimpleComponent.onAttachControlHandle = function (win)
    {
        var controlElem = this._control_element;
        if (controlElem)
        {
            controlElem.attachHandle(win);
        }
    };
    // [component.contents:attachhandle]            
    _pSimpleComponent.onAttachContentsHandle = function (win)
    {
        var clientElem = this._client_elem;
        if (clientElem)
        {
            clientElem.attachHandle(win);
        }
    };

    // [하위 Component 처리]
    // Command/Attach는 Contents 와 무관하게 최대한 자동처리되도록 처리
    // UserComponent에서는 Element의 Command/Attach 불가, Control만 가능


    //===============================================================
    // nexacro.SimpleComponent : Layout/Recalc
    //===============================================================

    // [Simple Component 처리]
    // RecalcLayout으로 모두 통합처리
    // RTL도 추후 포함
    // SimpleComponent에서는 항상 100%임으로 별도 Override는 없음
    // AutoSize 부분은 내부 자동처리로 UserComponent에서 처리 없음

    // TODO:소스통합
    _pSimpleComponent.on_change_containerPos = function (left, top)
    {
        this._onChangeContainerPos(left, top);
    };
    _pSimpleComponent.on_change_containerRect = function (width, height)
    {
        this._onChangeContainerRect(width, height);
    };

    // [component.layout:setpos]                    // SimpleComponent에서는 Override 없음
    _pSimpleComponent._onChangeContainerPos = function (left, top)
    {
        //  this._setContainerPos(left, top);
    };

    // [component.layout:setsize]                   // SimpleComponent에서는 Override 없음
    _pSimpleComponent._onChangeContainerRect = function (width, height)
    {
        this._setContainerSize(width, height);

        this._recalcLayout(false);
    };

    // [component.layout.container:pos]             // SimpleComponent에서는 Override 없음
    _pSimpleComponent._setContainerPos = function (left, top)
    {
        var client_elem = this._client_elem;
        if (client_elem)
        {
            client_elem.setElementPosition(left, top);
        }
    };
    // [component.layout.container:size]            // SimpleComponent에서는 Override 없음
    _pSimpleComponent._setContainerSize = function (width, height)
    {
        var client_elem = this._client_elem;
        if (client_elem)
        {
            client_elem.setElementSize(width, height);
        }
    };

    // [component.layout:recalc]                    // SimpleComponent에서는 사용하지 않음
    _pSimpleComponent._recalcLayout = function (reset)
    {
        if (this._is_created || reset)   // TODO: RecalcLayout 처리허용 Component Status 처리
        {
            this._onRecalcLayout(reset);
        }
    };


    // [하위 Component 처리]
    // SimpleComponent에서는 Override 없음

    // [component.layout:recalc]                    // SimpleComponent에서는 사용하지 않음
    _pSimpleComponent._onRecalcLayout = function (reset)
    {
    };



    //===============================================================
    // nexacro.SimpleComponent : ValueBind/Expr
    //===============================================================

    // [Simple Component 처리]
    // value bind는 기본으로 제공

    // [component.bind.valuebind:initprop]   
    _pSimpleComponent._is_valuebind = false;
    // [component.expr.valueexpr:initprop]   
    _pSimpleComponent._is_valueexpr = false;


    // [component.bind:init]                   
    _pSimpleComponent._initBind = function ()
    {
    };
    // [component.bind:initinfo]                   
    _pSimpleComponent._initBindInfo = function ()
    {
    };
    // [component.bind:clear]    
    _pSimpleComponent._clearBind = function ()
    {
    };

    // [component.expr:init]                   
    _pSimpleComponent._initExpr = function ()
    {
        if (this._is_valueexpr)
        {
            // [component.expr:create]
            this._exprdata = new nexacro._ExprData(true, false, false);

            // [component.expr:init]
            this._exprdata._initExprParser();
            this._exprdata._initExprTarget(this);
        }
    };
    // [component.expr:initinfo]                   
    _pSimpleComponent._initExprInfo = function ()
    {
        if (this._is_valueexpr)
        {
            // [component.expr.exprinfo:apply]
            this._applyExprInfos();

            // [component.expr.value:apply]
            this._applyValue();
        }
    };
    // [component.expr:applyinfo]                   // override 최소화
    _pSimpleComponent._applyExprInfos = function ()
    {
        if (this._exprdata)
        {
            // [component.expr.exprinfo:set]
            this._exprdata._setExprInfos(this._onGetExprInfos());
        }
    };
    // [component.expr:clear]    
    _pSimpleComponent._clearExpr = function ()
    {
        if (this._exprdata)
        {
            this._exprdata._clear();
            delete this._exprdata;
            this._exprdata = null;
        }
    };

    // [component.expr.cache:get]    
    _pSimpleComponent._getExprFuncByCtx = function (ctx)
    {
        if (this._exprdata)
        {
            return this._exprdata.getExprFuncByCtx(ctx);
        }
    };
    // [component.expr.cache:set]    
    _pSimpleComponent._setExprFuncByCtx = function (ctx, func)
    {
        if (this._exprdata)
        {
            return this._exprdata.setExprCacheIdx(ctx, this._exprdata.setExprFunc(ctx, func));
        }
    };

    // [component.expr.info:create]
    _pSimpleComponent.createExprInfo = function (baseid, targetid, targetprop, exprprop)
    {
        var exprinfo = new nexacro._ExprInfo();

        exprinfo.baseid = baseid;
        exprinfo.target = nexacro._nvl(targetid, false) ? targetid.split('.') : null;
        exprinfo.setter = nexacro._nvl(targetprop, false) ? "set_" + targetprop : "set_text";
        exprinfo.exprid = nexacro._nvl(exprprop, false) ? exprprop : this._onGetExprProp();

        return exprinfo;
    };
    // [component.bind.databind:init]               // expr시 override
    _pSimpleComponent._onGetExprProp = function ()
    {
        return "expr";
    };

    // [component.expr.dataexpr:init]               // dataexpr시 override
    _pSimpleComponent._onGetExprInfos = function ()
    {
        if (this._is_valueexpr)
            return [this.createExprInfo()];

        return null;
    };

    // [component.bind.valuebind:initprop]          // value property가 없거나 다른 property로 처리시 override
    _pSimpleComponent._onGetBindableProperties = function ()      // 왜 Properties 복수지??
    {
        return "value";
    };

    // [component.bind.valuebind:initbind]          // TODO: 소스통합             
    _pSimpleComponent.on_init_bindSource = function (columnid, propid, ds)
    {
        return this._onInitBindSource(columnid, propid, ds);
    };
    // [component.bind.valuebind:initbind]
    // [component.bind.valueexpr:initexpr]
    _pSimpleComponent._onInitBindSource = function (columnid, propid, ds)
    {
        if (this._is_valuebind && propid == this._onGetBindableProperties())
        {
            this._setValue(undefined);
            this._applyVaule();
        }
        if (this._is_valueexpr && propid == this._onGetExprProperty())
        {
            this._setValue(undefined);
            this._applyVaule();
        }
    };

    // [component.bind.valuebind:changebind]        // TODO: 소스통합                 
    _pSimpleComponent.on_change_bindSource = function (propid, ds, row, col)
    {
        return this._onChangeBindSource(propid, ds, row, col);
    };
    // [component.bind.valuebind:changebind]                  
    _pSimpleComponent._onChangeBindSource = function (propid, ds, row, col)
    {
        if (this._is_created)
        {
            if (this._is_valuebind && propid == this._onGetBindableProperties())
            {
                this._setValue(ds.getColumn(row, col));
                this._applyValue();
            }
            if (this._is_valueexpr && propid == this._onGetExprProperty())
            {
                this._setValue(this._getExprData(row));
                this._applyValue();
            }
        }
    };

    // [component.bind.valuebind:valuetobind]               
    _pSimpleComponent._applyToBindSource = function (propid, Val)
    {
        if (!this._bind_event)
            return true;

        var evt =
        {
            propid: propid,
            val: Val
        };
        var ret = this._bind_event._fireEvent(this, evt);
        return ret;
    };

    // [component.bind.valuebind:set]                  
    _pSimpleComponent._setValue = function (v)
    {
        this[this._onGetBindableProperties()] = v;
    };

    // [component.bind.valuebind:get]                  
    _pSimpleComponent._getValue = function (v)
    {
        return this[this._onGetBindableProperties()];
    };

    // [component.bind.valuebind:applyvalue]                  
    _pSimpleComponent._applyValue = function ()
    {
        this.on_apply_value();
    };

    // [component.bind.valuebind:applyvalue]        // ValueBind시 Override                  
    _pSimpleComponent.on_apply_value = function ()
    {
        if (this._client_elem)
        {
            var value = this._getValue();
            if (value != null)
            {
                this._client_elem.setElementText(value);
            }
        }
    };


    // [하위 Component 처리]
    // value bind 처리시 override
    /*
    // [component.bind.valuebind:initprop]          // value property가 없거나 다른 property로 처리시 override
    _pSimpleComponent._onGetBindableProperties = function ()
    {
        return "value";
    };

    // [component.bind.valuebind:valuetobind]               
    _pSimpleComponent.updateToDataset = function ()
    {
        return this._applyToBindSource(this._onGetBindableProperties(), this.value);
    };
    */


    //===============================================================
    // nexacro.ComplexComponent : Select (Single/Multi)
    //===============================================================

    // [상위 Component 처리]
    // Select 사용시 Interface 제공
    // Select의 Single/Multi 여부는 Component의 Simple/Complex 여부와 무관
    // Select의 정보구성은 각 Component별 정보에 따름

    // [component.select:init]                      
    _pSimpleComponent._use_select = false;                  // Select 지원시 설정
    _pSimpleComponent.selectdragmode = "default";           // Scroll/Drag 동시지원시 추가

    // [component.select:get]
    _pSimpleComponent.getSelect = function ()
    {
        return this._onGetCurrentSelect();
    };
    // [component.select:set]
    _pSimpleComponent.setSelect = function (select, subselect)
    {
        return this._onSetCurrentSelect(this._onGetSelectArgument(select, subselect));
    };
    // [component.select:clear]
    _pSimpleComponent.clearSelect = function ()
    {
        return this._onClearCurrentSelect();
    };
    // [component.select:check]
    _pSimpleComponent.isAboveSelected = function (idx1, idx2)
    {
        return this._onCheckAboveCurrentSelect(idx1, idx2);
    };

    // [component.select:init]                   
    _pSimpleComponent._initSelect = function ()
    {
        if (this._use_select)
        {
            this._selectinfo = new nexacro._SelectInfo();

            this._selectinfo._setSelectEvent(this);

            this._onInitSelect();
        }
    };
    _pSimpleComponent._onInitSelect = function (selecttype, positcount, rangecount, multicount, unselvalue)
    {
        if (this._selectinfo)
        {
            // TODO : Simple Component 기본 Select 정보 처리 제공
            // edit  : text
            // value : value
            // control : comp

            this._selectinfo._initSelect(nexacro._SelectConst.SELECTTYPE_COMP, positcount, rangecount, multicount, unselvalue);
        }
    };

    // [component.select:clear]    
    _pSimpleComponent._clearSelect = function ()
    {
        this._onClearSelect();

        if (this._selectinfo)
        {
            this._selectinfo._clear();
            delete this._selectinfo;
            this._selectinfo = null;
        }
    };
    _pSimpleComponent._onClearSelect = function ()
    {
    };


    // [component.select:argument]
    _pSimpleComponent._onGetSelectArgument = function (select, subselect)
    {
        return select;
    };
    // [component.select:get]
    _pSimpleComponent._onGetCurrentSelect = function ()
    {
        if (this._selectinfo) return this._selectinfo._getCurrentSelect();
    };
    // [component.select:set]
    _pSimpleComponent._onSetCurrentSelect = function (select)
    {
        // TODO: SelectType별 Select Status 연동처리

        if (this._selectinfo) return this._selectinfo._setCurrentSelect(select);
    };
    // [component.select:clear]
    _pSimpleComponent._onClearCurrentSelect = function ()
    {
        // TODO: SelectType별 Select Status 연동처리

        if (this._selectinfo) return this._selectinfo._clearCurrentSelectPos();
    };
    // [component.select:check]
    _pSimpleComponent._onCheckAboveCurrentSelect = function (idx1, idx2)
    {
        if (this._selectinfo) return this._selectinfo._checkAboveCurrentSelect(idx1, idx2);
    };
    _pSimpleComponent._onCheckSelectChange = function (oldvalue, newvalue)
    {
        return oldvalue != newvalue;
    };
    _pSimpleComponent._onCheckSelectable = function ()
    {
        if (this._use_selected_status) return true;
    };

    // [component.select:event]
    _pSimpleComponent._onChangeSelect = function (obj, type, oldvalue, newvalue)
    {
        this._on_basic_onselect(oldvalue, newvalue);
        this._on_fire_onselect(oldvalue, newvalue);
        this._on_default_onselect(oldvalue, newvalue);
    };

    // [component.select.event.onselect:fireevent]
    _pSimpleComponent._on_fire_onselect = function (oldvalue, newvalue)
    {
        if (this.onselect && this.onselect._has_handlers)
        {
            /* TODO : basic change event info
            // [component.eventinfo:create]         // User EventInfo 코드
            var evt = new nexacro.ChangeEventInfo(this, "onselect", oldvalue, newvalue);
            
            this.onselect._fireEvent(this, evt);
            */
            this.onselect._fireEvent(this, null);
        }
        return true;
    };
    // [component.select.event.onselect:basicaction]
    _pSimpleComponent._on_basic_onselect = function (oldvalue, newvalue)
    {
        if (this._selectinfo)
        {
            // Select Complex Comp Status
            switch (this._selectinfo._selecttype)
            {
                case 0x04: // nexacro._SelectConst.SELECTTYPE_COMP:
                    {
                        // Select Status
                        if (this._use_selected_status)
                        {
                            this._changeUserStatus("selected", newvalue ? (this._onCheckSelectable() ? true : false) : false);
                        }

                        break;
                    }
                case 0x02: // nexacro._SelectConst.SELECTTYPE_TEXT:
                case 0x01: // nexacro._SelectConst.SELECTTYPE_VALUE:
                case 0xFF: // nexacro._SelectConst.SELECTTYPE_USER:
                    {
                        break;
                    }
            }
        }
    };
    // [component.select.event.onselect:defaultaction]
    _pSimpleComponent._on_default_onselect = function (oldvalue, newvalue)
    {
    };


    //===============================================================
    // nexacro.SimpleComponent : Interface Logic Override
    //===============================================================

    // [Simple Component 처리]
    // 해당 interface별 변경이 요구될때 Override 처리

    // [component.dlgcode:init]                     // dlgcode 설정값 변경이 필요하면 override, default는 모두 false
    _pSimpleComponent._onGetDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        return { want_tab: true, want_return: true, want_escape: true, want_chars: true, want_arrows: true };
    };

    // [component.dragdrop:getdragdata]             // drag 허용시 drag data
    _pSimpleComponent._onGetDragData = function ()
    {
        return this.id;
        //  return this.getSelectedText();
    };

    // [component.tabstop:get]                      // Accessibility 용 별도 처리시 override
    _pSimpleComponent._onGetTabstop = function ()
    {
        // [component.accessibility.tabstop:get]
        if (this._env._p_enableaccessibility)
        {
            var accessibility = this._p_accessibility;
            if (accessibility && accessibility._p_enable && accessibility.role == "link")
                return true;
        }
        return false;
    };

    // [component.focus:get]                        // Accessibility 용 별도 처리시 override
    _pSimpleComponent._onGetFocusAcceptable = function ()
    {
        // [component.accessibility.focus:get]
        return this._env._p_enableaccessibility;
    };

    // [component.hotkey:init]                      
    _pSimpleComponent._initHotKey = function (keycode, altKey, ctrlKey, shiftKey)
    {
        if (!this._is_subcontrol)
            this._registerHotkey();
    };
    // [component.hotkey:clear]                      
    _pSimpleComponent._clearHotKey = function ()
    {
        if (!this._is_subcontrol)
            this._unregisterHotkey();
    };
    // [component.hotkey:action]                    // hotkey 기본 Action 변경시 override
    _pSimpleComponent._onHotkey = function (keycode, altKey, ctrlKey, shiftKey)
    {
        // [component.hotkey:action]
        this.click();
    };

    //===============================================================
    // nexacro.SimpleComponent : RTL/Locale (추후제공)
    //===============================================================

    // [상위 Component 처리]
    // Simple Component의 RTL/Locale은 ClientElement 대상으로만 처리
    // Basic Component에서만 처리되며 User Component에서는 별도 처리가 없다.

    // 상세 추후 추가


    // [하위 Component 처리]
    // Basic Component에서만 RTL Interface 일부 Override 처리

    // 상세 추후 추가


    //===============================================================
    // nexacro.SimpleComponent : Status
    //===============================================================

    // [Simple Component 처리]
    // 상태는 기본적으로 Basic Component에서 모두 제공하도록 구성
    // User Component에서는 추가된 UserStatus를 사용만 코딩하며 Metainfo에만 노출
    // 명시적인 상태를 추가하려면 Property/Method Interface를 이용하여 처리한다.

    // [component.status:init]
    _pSimpleComponent._initStatus = function ()     // Basic Component 에서 Override
    {
        /*
        this._sysstatus = null;                     // Stock Sys Status 값 변경시 설정
        this._usrstatus = null;                     // Stock Usr Status 값 변경시 설정
        */
        this._onInitStatus();                       // User Status 추가시 Override
    };

    // [component.status:init]                      // User Component는 이 Override를 아직 허용하지 않음
    _pSimpleComponent._onInitStatus = function ()
    {
        // status init logic
        /*
        this._sysstatus = null;                     // Stock Sys Status 값 변경시 설정
        this._usrstatus = null;                     // Stock Usr Status 값 변경시 설정
        */
    };

    // [component.status:reset]                     // User Component는 이 Override를 아직 허용하지 않음
    _pSimpleComponent._resetStatus = function ()    
    {
        this._resetSysStatus();
        this._resetUserStatus();
    };
    // [component.status.sys:reset]                 // Override 없음
    _pSimpleComponent._resetSysStatus = function ()
    {
        return this._onResetSysStatus();
    };
    // [component.status.user:reset]                // Override 없음
    _pSimpleComponent._resetUserStatus = function ()         
    {
        return this._onResetUserStatus();
    };

    // [component.status:onreset]                   // 기본 SysStatus Check Logic이 다른 Basic Component 에서만 Override
    _pSimpleComponent._onResetSysStatus = function ()
    {
        // check real sys status
        this._onResetSysEnable();
        if (this._use_readonly_status) this._onResetSysReadOnly();

        /*
        if (this._use_parent_mouseover) this._onResetSysMouseOver();
        if (this._use_parent_focused)   this._onResetSysFocused();
        if (this._use_parent_activate)  this._onResetSysActivate();
        */
    };
    // [component.status:onchange]                  // 기본 UserStatus Check Logic이 다른 Basic Component 에서만 Override
    _pSimpleComponent._onResetUserStatus = function ()
    {
        // check real user status
        /*
        if (this._use_parent_usrstat1)  this._onResetUserStatus1();
        */
    };

    // [component.status.reset:enable]
    _pSimpleComponent._onResetSysEnable = function ()
    {
        // check real sys status
        var parent = this.parent;
        if (parent)
        {
            this._real_enable = parent._real_enable != false && this._p_enable;
            this._changeSysStatus("disabled", !this._real_enable);
            this._spreadSysStatus("disabled", !this._real_enable);
        }
    };
    // [component.status.reset:readonly]
    _pSimpleComponent._onResetSysReadOnly = function ()
    {
        // check real sys status
        var parent = this.parent;
        if (parent)
        {
            this._real_readonly = parent._real_readonly == true || this._p_readonly;
            this._changeSysStatus("readonly", this._real_readonly);
            this._spreadSysStatus("readonly", this._real_readonly);
        }
    };
    // [component.status.reset:userstat]
    /*
    _pSimpleComponent._onResetUserStatus1 = function ()
    {
        // check real user status
        var parent = this.parent;
        if (parent)
        {
            this._real_userstat = parent._real_userstat || this.userstat;
            this._changeUserStatus("userstat", this._real_userstat);
            this._spreadUserStatus("userstat", this._real_userstat);
        }
    };
    */

    // [component.status.sys:change]                // Override 없음
    _pSimpleComponent._changeSysStatus = function (status, value)
    {
        return this._onChangeSysStatus(status, value);
    };
    // [component.status.user:change]               // Override 없음
    _pSimpleComponent._changeUserStatus = function (status, value)         
    {
        return this._onChangeUserStatus(status, value);
    };

    // [component.status:onchange]                 // 기본 SysStatus Change Logic이 다른 Basic Component 에서만 Override
    _pSimpleComponent._onChangeSysStatus = function (status, value)
    {
        /*
        this._on_changeStatus(status, value);      // TODO:소스통합  
        */

        this._oldstatus = this._status;
        this._statusmap[status] = value;

        var statusmap = this._statusmap;
        var applystatus = "enabled";

        if (statusmap.disabled)
            applystatus = "disabled";
        else if (statusmap._p_readonly && this._use_readonly_status)
            applystatus = "readonly";
        else if (statusmap.mouseover)
            applystatus = "mouseover";
        else if (statusmap.focused)
            applystatus = "focused";
        else if (statusmap.deactivate)
            applystatus = "deactivate";

        //this._status = applystatus;
        this._status = this.on_changeStatus(status, value, applystatus, this._status, this._userstatus);

        //폼에서 마우스 다운후 드래그해서 버튼위로 올라갔을때 // TODO : Sys Real Status 예외처리는 Element Layer에서 처리
        if (this._status == "mouseover" && nexacro._cur_track_info)
            return;

        if (this._oldstatus != this._status)
            this._apply_status_toelement(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

        if (this._env._p_enableaccessibility)
            this._setAccessibilityStatFlag(this._status, this._userstatus);

    };
    // [component.status:onchange]                 // 기본 UserStatus Change Logic이 다른 Basic Component 에서만 Override
    _pSimpleComponent._onChangeUserStatus = function (status, value)
    {
        /*
        this._on_changeUserStatus(status, value); // TODO:소스통합  
        */

        this._olduserstatus = this._userstatus;
        this._userstatusmap[status] = value;

        var statusmap = this._userstatusmap;
        var applystatus = "";

        if (this._use_pushed_status && statusmap.pushed)
            applystatus = "pushed";
        else if (this._use_selected_status && statusmap.selected)
            applystatus = "selected";

        this._userstatus = this.on_changeUserStatus(status, value, applystatus, this._status, this._userstatus);

        if (this._olduserstatus != this._userstatus)
            this._apply_status_toelement(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

        if (this._env._p_enableaccessibility)
            this._setAccessibilityStatFlag(this._status, this._userstatus);
    };

    // [component.status:clear]                 // Clear 처리시 Override
    _pSimpleComponent._clearStatus = function ()
    {
    };

    /*
    // [component.logic:statuschange]               // User Status는 사용자 로직에서 _changeUserStatus 호출로 처리
    _pSimpleComponent._userLogic = function ()
    {
        // [object.status:change] 
        this._changeUserStatus("userstatus1", true);// 이 User Status 값은 Metainfo에 노출되어야 함
        this._changeUserStatus("userstatus2", true);
    };
    */

    // [object.status:spread] 
    _pSimpleComponent._spreadStatus = function (statusname, statusstat)
    {
    };
    _pSimpleComponent._spreadSysStatus = function (statusname, statusstat)
    {
        return this._spreadStatus(statusname, statusstat);
    };
    _pSimpleComponent._spreadUserStatus = function (statusname, statusstat)
    {
        return this._spreadStatus(statusname, statusstat);
    };

    //===============================================================
    // nexacro.ComplexComponent : Enable (Disabled)
    //===============================================================

    // [component.disabled:init]
    /*
    _pSimpleComponent._is_disabled_control = false;         // 기본 system status
    _pSimpleComponent._use_disabled_status = false;         // 기본 system status
    _pSimpleComponent._p_enable = true;                        // 기본 system status

    _pSimpleComponent.set_enable = function (v)
    {
        v = nexacro._toBoolean(v);
        if (v != this._p_readonly)
        {
            this._p_enable = v;
            this.on_apply_prop_enable(v);
        }
    };
    */

    _pSimpleComponent.on_apply_prop_enable = function (enable)
    {
        this._changeStatus("disabled", !enable);
        this._spreadStatus("disabled", !enable);
    };

    _pSimpleComponent._isEnable = function ()
    {
        return this.parent ? this.parent._real_enable && this._p_enable : this._p_enable;
    };
    _pSimpleComponent._isDisable = function ()
    {
        return !this._isEnable();
    };

    //===============================================================
    // nexacro.ComplexComponent : Edit (Editable/ReadOnly)
    //===============================================================

    // [상위 Component 처리]
    // Editable/ReadOnly 사용시 Interface 제공
    // Edit의 실제 처리부는 Component별 구성
    // Readonly Property와 Stats는 일괄제공

    // [component.editable:init]                      
    _pSimpleComponent._is_editable_control = false;         // Editable 지원시 설정
    _pSimpleComponent._use_readonly_status = false;         // readonly 지원시 설정
    _pSimpleComponent._p_readonly = undefined;                 // readonly 지원시 true/false 설정

    _pSimpleComponent.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (v !== this._p_readonly || v !== this._real_readonly)
        {
            this._p_readonly = v;
            this._real_readonly = this._p_readonly || (this.parent ? (this.parent._real_readonly ? true : false) : false);

            this.on_apply_readonly(this._real_readonly);
        }
    };
    _pSimpleComponent.on_apply_readonly = function (readonly)
    {
        this._changeStatus("readonly", readonly);
        this._spreadStatus("readonly", readonly);
    };

    _pSimpleComponent._isReadOnly = function ()
    {
        return this._is_editable_control && this._p_readonly == true || this._real_readonly == true;
    };
    _pSimpleComponent._isEditable = function ()
    {
        return this._is_editable_control && this._p_readonly != true && this._real_readonly != true;
    };
    _pSimpleComponent._isEditableComponent = function ()
    {
        return this._is_editable_control || this._p_readonly !== undefined;
    };
    _pSimpleComponent._checkProcessedKey = function (keycode, alt_key, ctrl_key, shift_key, check_comp, refer_comp)
    {
        return check_comp && refer_comp && refer_comp._isEditableComponent() && refer_comp._isEnable() && check_comp._isEnable();
    };

    //===============================================================
    // nexacro.SimpleComponent : Property
    //===============================================================

    // [기본 Component 처리]
    // Component Stock이나 상위 Componnet의 DefaultValue를 바꾸고자 하면 Override 하여 처리

    // [component.property:init]
    _pSimpleComponent._initProperties = function ()
    {
        /*
        this.stock_prop1 = DEFAULT_VALUE;           // 이 property는 상속되는 초기값 변경처리
        this.stock_prop2 = DEFAULT_VALUE;           
        */

        // TODO : Init Prop 변경 체크
        // [component.property:init]
        this.onInitProperties();                    // Property 추가처리시 Override

        // [component.property:initvalue]
        this._onInitValueProp();                    // InitValue Init
    };
    // [component.property:apply]
    _pSimpleComponent._applyProperties = function ()
    {
        // stock prop
        this.on_apply_prop_taborder();

        if (!nexacro._isNull(this.tooltiptext))
            this.on_apply_prop_tooltip();

        this.on_apply_positionstep();

        this.on_apply_hittesttype();
        this.on_apply_readonly();

        // override prop
        this.onApplyProperties();                  // Property 추가처리시 Override
    };
    // [component.property:clear]
    _pSimpleComponent._clearProperties = function ()
    {
        /*
        this.on_clear_stock_prop1();                // Component Stock Normal Property Clear
        this.on_clear_stock_prop2();
        */
        this.onClearProperties();                  // 별도의 clear 처리시 Override
    };

    // [기본 Component 처리]
    // 비상속 Proeprty 처리
    // Primitive형 Property이면 생성만 처리
    // new/delete가 요구되는 Property이면 생성/삭제까지 처리

    // [component.property.initvalue:init]          // initvalue 처리, no override, TODO:소스통합
    _pSimpleComponent._onInitValueProp = function ()
    {
        //  this._on_apply_setpropinitfn();             // InitValue Init
    };

    // [component.property.peripheral:init]         // 비상속용 Property 추가시 Override
    _pSimpleComponent.onInitProperties = function ()
    {
        /*
        this.property1 = true;
        this.property2 = false;
        this.property3 = false;
        */
    };
    // [component.property.peripheral:apply]        // 비상속용 Property 추가시 Override
    _pSimpleComponent.onApplyProperties = function ()
    {
        /*
        this.on_apply_property1();
        this.on_apply_property2();
        this.on_apply_property3();
        */
    };
    // [component.property.peripheral:clear]        // 비상속용 Property 추가시 별도의 clear 처리일때 Override
    _pSimpleComponent.onClearProperties = function ()
    {
        // clear property
        /*
        this.on_clear_property1();
        this.on_clear_property2();
        this.on_clear_property3();
        */
    };

    /*
    // [component.property:init]
    _pSimpleComponent.proeprty1 = true;

    // [component.property:set]                     // readonly 아닌 Property 추가시 생성
    _pSimpleComponent.set_property1 = function (v)
    {
        // property check
        if (this.property1 != v)
        {
            // property set & type value check
            this.property1 = nexacro._toBoolean(v);

            // apply property
            this.on_apply_property1();
        }
    };

    // [object.property:apply]                      // readonly 아닌 Property 추가시 생성
    _pSimpleComponent.on_apply_property1 = function ()
    {
        // property apply user logic
        if (this.property1)
        {
            ;
        }
    };

    // [object.property:clear]                      // 별도의 property 개별 clear 처리시 생성
    _pSimpleComponent.on_clear_property1 = function ()
    {
        // property clear user logic
        this.property1 = null;
    };
    */

    //===============================================================
    // nexacro.SimpleComponent : Methods
    //===============================================================

    // [개별 Component 처리]
    // Method 추가 처리
    // Status 를 명시적으로 추가하고자 할때에는 Proeprty/Method로 처리

    /*
    // [method:call]
    _pSimpleComponent.click = function ()
    {
        // method user logic

        // [event:call]
        this.on_fire_event1("none", false, false, false, -1, -1, -1, -1, -1, -1, this, this);
    };

    // [method:get]
    _pSimpleComponent.getAMethod = function ()
    {
        // [property:get]
        return this._A;
    };

    // [method:set]
    _pSimpleComponent.setAStatus = function (v)
    {
        // [property:set]
        var ret = this._A;
        this._A = v;

        // [status:change]
        this._changeUserStatus("Status1", v);

        return ret;
    };
    */

    //===============================================================
    // nexacro.SimpleComponent : Events
    //===============================================================

    // [개별 Component 처리]
    // 기본 System Event Handler는 Basic Component에서 모두 처리하며 User Component에서 이의 수정은 제공하지 않는다.
    // 모든 Event Handler는 Override 가능한 FireAction/DefaultAction/BasicAction Handler를 제공한다.
    // 이벤트 하위추가는 기존 event_list을 재정의하여 추가
    // 이벤트 하위삭제는 없으며, Metainfo에서만 삭제처리
    // EventInfo 변경, Action 변경시 Override 처리
    // Element 코드는 반드시 Basic Component에서만 허용

    // [component.event:init]
    _pSimpleComponent._initEvents = function ()     // Event 추가시 Override
    {
        this._event_list =
        {
            "onkillfocus": 1, "onsetfocus": 1,
            "oninput": 1, "onkeydown": 1, "onkeyup": 1,
            "onclick": 1, "ondblclick": 1,
            "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1, "onmousedown": 1, "onmouseup": 1,
            "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1,
            "onmousewheel": 1,
            "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
            "onmove": 1, "onsize": 1,
            "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
            "oncontextmenu": 1

            // [event:init]
            // "onnewevent": 1
        };

        // [event:init]
        // this._event_list["onnewevent"] = 1;

        // 현재 Event 추가 방식 유지시 이 Override는 없음
        // this._onInitEvents();                            
    };

    // TODO : Event Action Handler Normalize
    // 기존 Event Action normalize
    // 형식일반화

    // [component.clickevent:basicaction]
    _pSimpleComponent._on_basic_onclick = function (obj, e)
    {
        // basic action
        return this.on_click_basic_action(null, e.button, e.alt_key, e.ctrl_key, e.shift_key, e.screenX, e.screenY, e.canvasX, e.canvasY/*, e.clientX, e.clientY*/, e.meta_key);
    };
    // [component.clickevent:defaultaction]
    _pSimpleComponent._on_default_onclick = function (obj, e)
    {
        // user default action
        //  return this.on_click_default_action(null, e.button, e.alt_key, e.ctrl_key, e.shift_key, e.screenX, e.screenY, e.canvasX, e.canvasY/*, e.clientX, e.clientY*/);
    };
    // [component.clickevent:fireevent]
    _pSimpleComponent._on_fire_onclick = function (obj, e)
    {
        if (this.onclick && this.onclick._has_handlers)
        {
            // [component.eventinfo:create]         // User EventInfo 코드
            return this.onclick._fireEvent(this, new nexacro.ClickEventInfo(this, "onclick", e.button, e.alt_key, e.ctrl_key, e.shift_key, e.screenX, e.screenY, e.canvasX, e.canvasY, e.clientX, e.clientY, this, e.from_refer_comp, e.meta_key));
        }
        return true;
    };

    // 기존 Event Action override
    // 동작을 변경하거나 EventInfo를 변경할때 Override하여 처리
    /*
    // [component.clickevent:basicaction]
    _pSimpleComponent.on_click_basic_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY)
    {
        // user basic action
    };
    // [component.clickevent:defaultaction]
    _pSimpleComponent.on_click_default_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY)
    {
        // user default action
    };
    // [component.clickevent:fireevent]
    _pSimpleComponent.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp)
    {
        if (this.onclick && this.oneditclick._has_handlers)
        {
            // [component.eventinfo:create]         // User EventInfo 코드
            var evt = new nexacro.MyClickEventInfo(this, "onclick", caretpos, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientXY[0], clientXY[1], this, this);
            return this.onclick._fireEvent(this, evt);
        }
        return true;
    };

    // [component.mouseevent:fireevent]             // Event Override (왜 따로하지?)
    _pSimpleComponent.on_fire_sys_onmouseup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp)
    {
        if (this.onmouseup && this.onmouseup._has_handlers)
        {
            var rootComp = this._getRootComponent(from_comp);

            // [event:eventinfo]                    // User EventInfo 코드
            var evt = new nexacro.UserMouseEventInfo(rootComp, "onmouseup", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp);

            return this.onmouseup._fireSysEvent(this, evt);
        }
        return false;
    };
    // [component.mouseevent:fireevent]             // Event Override (왜 따로하지?)
    _pSimpleComponent.on_fire_user_onmouseup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp)
    {
        if (this.onmouseup && this.onmouseup._has_handlers)
        {
            var rootComp = this._getRootComponent(from_comp);

            // [component.eventinfo:create]         // User EventInfo 코드
            var evt = new nexacro.UserMouseEventInfo(rootComp, "onmouseup", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp);

            return this.onmouseup._fireUserEvent(this, evt);
        }
        return false;
    };
    */

    //===============================================================
    // nexacro.SimpleComponent : Accessibility (추후제공)
    //===============================================================

    // [Simple Component 처리]
    // 접근성용 Interface 일부 Override 처리
    /* 접근성 JS로 이동 */


    //===============================================================
    // nexacro.SimpleComponent : Inner Logic
    //===============================================================

    _pSimpleComponent._getParentElement = function ()
    {
        return (!this._is_window && this.parent) ? this.parent._control_element : null;
    };

    //===============================================================
    // nexacro.SimpleComponent : Util Logic
    //===============================================================

    _pSimpleComponent._clone = function ()
    {
        return nexacro._clone(this);
    };
    _pSimpleComponent._onCloneProperities = function (source)
    {
    };

    _pSimpleComponent._setPositionOrigin = function ()
    {
        var elem = this.getElement();
        if (elem && elem.handle)
        {
            var l = this.getOffsetLeft();
            var t = this.getOffsetTop();

            elem.setElementPosition(l, t);
        }
    };
    _pSimpleComponent._setPositionAdjust = function (l, t)
    {
        var elem = this.getElement();
        if (elem && elem.handle)
        {
            l += this.getOffsetLeft();
            t += this.getOffsetTop();

            elem.setElementPosition(l, t);
        }
    };
    _pSimpleComponent._setPositionAbsolute = function (ownc, zorder)
    {
        if (!ownc) return;

        var elem = this.getElement();
        var owne = ownc.getElement();

        if (elem && owne && elem.handle && owne.handle)
        {
            var ownt = owne.getContainerElement(elem.position_step);
            if (ownt)
            {
                this._moveElementNode(elem, elem.owner_elem, ownt, false, true);
            }
            else
            {
                elem.setElementZIndex(zorder);
            }

            this._setPositionOrigin();
        }
    };
    _pSimpleComponent._setPositionFixed = function (ownc, l, t, above)
    {
        if (!ownc) return;

        var elem = this.getElement();
        var owne = ownc.getElement();

        if (elem && owne && elem.handle && owne.handle)
        {
            if (above || above === undefined)
            {
                this._moveElementNode(elem, elem.owner_elem, owne, true, false);
            }
            else
            {
                owne.bringToFrontElement(elem);
            }

            this._setPositionAdjust(l, t);
        }
    };

    if (nexacro._Browser == "Runtime")
    {
        _pSimpleComponent._moveElementNode = function (elem, srce, tare, srcc, tarc)
        {
            if (elem.owner_elem != tare)
            {
                elem.owner_elem = tare;

                var setn = elem.handle;
                var srcn = srcc ? srce.dest_handle : srce.handle;
                var tarn = tarc ? tare.dest_handle : tare.handle;

                if (srcn && tarn)
                {
                    nexacro.__unlinkElementHandle(srcn, setn);
                    nexacro.__appendElementHandle(tarn, setn);
                }
            }
        };
    }
    else
    {
        _pSimpleComponent._moveElementNode = function (elem, srce, tare, srcc, tarc)
        {
            if (elem.owner_elem != tare)
            {
                elem.owner_elem = tare;

                var setn = elem.handle;
                var srcn = srcc ? srce.dest_handle : srce.handle;
                var tarn = tarc ? tare.dest_handle : tare.handle;

                if (srcn && tarn)
                {
                    nexacro.__unlinkDOMNode(srcn, setn);
                    nexacro.__appendDOMNode(tarn, setn);
                }
            }
        };
    }


    _pSimpleComponent._getSubArray = function (array, start, count)
    {
        var ret = [];
        for (var i = Math.max(start, 0), l = Math.min(start + count, array.length); i < l; i++)
        {
            ret.push(array[i]);
        }
        return ret;
    };

    _pSimpleComponent = null;
}


if (!nexacro._CompUtil) 
{
    //==============================================================================
    // nexacro._CompUtil for nexacro.SimpleComponent
    //==============================================================================

    // [추가 Utility 처리]
    // SimpleComponent/ComplexComponent용 Utility Function Set

    nexacro._CompUtil = true;

    // [util.scope.global:get]                 // TODO:Get Runtime Global Scope
    nexacro._getGlobalScope = function ()
    {
        return nexacro.__getOSType ? null : window;
    };
    // [util.scope.nexacro:get]                // TODO:Get Runtime Custom Scope
    nexacro._getCustomScope = function (scope)
    {
        return nexacro; // eval(scope); 
    };

    // [util.scope.construct:get]          // TODO: Cache for Except Type Search
    nexacro._getTypeConstructor = function (_type, _deftype)
    {
        // check default type
        if (!_type) _type = _deftype;

        /*
        if (!_type.includes("."))               // TODO: Cache for Except String Search
        {
            // get type construct
            return nexacro[_type];
        }
        else
        */
        {
            // find constructor scope/type      // TODO: Cache for Except String Split & Type Search
            var parts = _type.split('.');
            var index = 0;
            var final = parts.length - 1;
            var tname = parts[final];
            var scope = nexacro._getGlobalScope(); // TODO: Check Dynamic Object Create All Browser

            if (!scope)
            {
                scope = nexacro._getCustomScope(parts[0]); // TODO: Check Custom Scope
                index = 1;
            }

            if (scope)
            {
                for (; index < final; index++)
                {
                    scope = scope[parts[index]];
                }

                return scope[tname];
            }
        }

        return null;
    };

    // [util.clone:clone]                       // TODO:Optimize
    nexacro._clone = function (obj)
    {
        // extends 'from' object with members from 'to'. 
        // If 'to' is null, a deep clone of 'from' is returned
        function extend(from, to)
        {
            if (from == null || typeof from != "object") return from;
            if (from.constructor != Object && from.constructor != Array) return from;
            if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
                from.constructor == String || from.constructor == Number || from.constructor == Boolean)
                return new from.constructor(from);

            to = to || new from.constructor();

            for (var name in from)
            {
                to[name] = typeof to[name] == "undefined" ? extend(from[name], null) : to[name];
            }

            return to;
        }

        return extend(obj);
    };

    // [util.saveImage]                // TODO:FullStyle
    var _use_savetoimage_runtime = false;
    var _use_savetoimage_html = false;

    if (nexacro._Browser == "Runtime" && _use_savetoimage_runtime || _use_savetoimage_html)
    {
        // [util.saveImage:drawelem]
        nexacro._drawElement2Canvas = function (canvas, elem, left, top)
        {
            if (canvas && elem)
            {
                var l = left || 0;
                var t = top || 0;

                var image = nexacro.__saveToImageObject(elem);
                if (image)
                {
                    canvas.drawImage(image, l, t, image.width, image.height);
                }
            }
        };
        // [util.saveImage:drawcomp]
        nexacro._drawComponent2Canvas = function (canvas, comp, left, top)
        {
            if (canvas && comp)
            {
                var l = left || 0;
                var t = top || 0;

                var image = nexacro.System.saveToImageObject(comp);
                if (image)
                {
                    canvas.drawImage(image, l, t, image.width, image.height);
                }
            }
        };
    }
    else
    {
        // [util.saveImage:getCurrentStyle]         // TODO:FullStyle
        nexacro._getCurrentStyleObject = function (elem)
        {
            if (!elem) return null;

            if (nexacro._Browser == "Runtime")
            {
                return { curr: null, elem: elem, type: "runtime" };
            }
            else
            {
                var _doc = elem._getRootWindowHandle();
                var _win = _doc.defaultView || _doc.parentWindow;
                var _cps = _win.getComputedStyle || 0;
                var _obj = _cps ? _win.getComputedStyle(elem.handle) : elem.handle.currentStyle;

                return _cps ? { curr: _obj, elem: elem, type: "compute" }
                    : { curr: _obj, elem: elem, type: "current" };
            }
        };
        nexacro._getCurrentStyleValue = function (style, prop)
        {
            if (prop == "font")
            {
                if (style.type == "runtime")
                {
                    return style.elem._getComputedStyle("font");
                }
                else
                {
                    var font = [];
                    font.push(nexacro._getCurrentStyleValue(style, "font-style"));
                    font.push(nexacro._getCurrentStyleValue(style, "font-variant"));
                    font.push(nexacro._getCurrentStyleValue(style, "font-weight"));
                    font.push(nexacro._getCurrentStyleValue(style, "font-size"));
                    font.push(nexacro._getCurrentStyleValue(style, "font-family"));
                    return font.join(' ');
                }
            }
            else
            {
                var r;
                if (style.type == "runtime")
                {
                    r = prop.split('-');
                    if (r.length > 1 && r[0] == "background")
                    {
                        return style.elem._getComputedStyleSubValue(r[0], prop);
                    }
                    else
                    {
                        return style.elem._getComputedStyleValue(prop);
                    }
                }
                else if (style.type == "current")
                {
                    r = prop.split('-');
                    for (var i = 1, l = r.length; i < l; i++)
                    {
                        var s = r[i];
                        if (s.length)
                            s[0] = s[0].toUpperCase();
                    }
                    var p = r.join('');

                    return style.curr[p];
                }
                else if (style.type == "compute")
                {
                    return style.curr.getPropertyValue(prop);
                }
            }
        };

        // [util.saveImage:clip]
        nexacro._clipAdd2Canvas = function (canvas, left, top, width, height)
        {
            if (!canvas) return;

            var l = left, t = top, w = width, h = height;
            var a = canvas._cliprectarray;
            if (!a || !a.length)
            {
                canvas._cliprectarray = [[l, t, w, h]];
            }
            else
            {
                var r = a[a.length - 1];

                l = Math.max(r[0], left);
                t = Math.max(r[1], top);
                w = Math.min(r[0] + r[2], left + width) - l;
                h = Math.min(r[1] + r[3], top + height) - t;

                a.push([l, t, w, h]);
            }

            canvas.save();
            canvas.beginPath();
            canvas.rect(l, t, w, h);
            canvas.clip();
        };
        nexacro._clipPop2Canvas = function (canvas)
        {
            if (!canvas) return;

            var a = canvas._cliprectarray;
            if (a)
            {
                a.pop(); if (a.length <= 0) delete canvas._cliprectarray;
            }

            canvas.restore();
        };

        // [util.saveImage:drawelem]                // TODO:FullStyle
        nexacro._drawElement2Canvas = function (canvas, elem, left, top, optxt, opimg)
        {
            if (canvas && elem)
            {
                var l = left || 0;
                var t = top || 0;
                var w = elem.width;
                var h = elem.height;

                // style
                var style = nexacro._getCurrentStyleObject(elem);

                var bkcolor = nexacro._getCurrentStyleValue(style, "background-color");
                var bkimage = nexacro._getCurrentStyleValue(style, "background-image");
                var bkposit = nexacro._getCurrentStyleValue(style, "background-position");
                var bkrepeat = nexacro._getCurrentStyleValue(style, "background-repeat");

                var halign = nexacro._getCurrentStyleValue(style, "text-align");
                var font = nexacro._getCurrentStyleValue(style, "font");
                var color = nexacro._getCurrentStyleValue(style, ("color"));

                var drawImg, drawBox, drawIco, drawTxt;
                var image;

                // clip
                nexacro._clipAdd2Canvas(canvas, l, t, w, h);

                switch (elem._type_name)
                {
                    case "ControlElement":
                    case "ScrollableControlElement":
                    case "FrameControlElement":
                    case "GridScrollableControlElement":
                    case "GridBandControlElement":
                    case "GridRowControlElement":
                        {
                            var border = elem.border ? elem.border : elem._border_info;
                            var radius = elem.borderRadius ? elem.borderRadius : null;

                            // draw border
                            if (border)
                            {
                                var offset;

                                var rx = radius ? radius.x : 0;
                                var ry = radius ? radius.y : 0;

                                var tw = border.top._width;
                                var rw = border.right._width;
                                var bw = border.bottom._width;
                                var lw = border.left._width;

                                if (rx && ry)
                                {
                                    if (tw)
                                    {
                                        canvas._setLineStyle(border.top);
                                        canvas.drawStrokeInsetRoundRect(l, t, w, h, rx, ry);

                                        l += tw;
                                        t += tw;
                                        w -= tw;
                                        h -= tw;
                                    }
                                }
                                else if (border._single)
                                {
                                    if (tw)
                                    {
                                        canvas._setLineStyle(border.top);
                                        canvas.drawStrokeInsetRect(l, t, w, h);

                                        l += tw;
                                        t += tw;
                                        w -= tw;
                                        h -= tw;
                                    }
                                }
                                else
                                {
                                    if (border.top._isValid())
                                    {
                                        offset = t + tw / 2;
                                        canvas._setLineStyle(border.top);
                                        canvas.drawStrokeLine(l, offset, l + w, offset);
                                        t += tw;
                                    }
                                    if (border.right._isValid())
                                    {
                                        offset = l + w - rw / 2;
                                        canvas._setLineStyle(border.right);
                                        canvas.drawStrokeLine(offset, t, offset, t + h);
                                        w -= rw;
                                    }
                                    if (border.bottom._isValid())
                                    {
                                        offset = t + h - bw / 2;
                                        canvas._setLineStyle(border.bottom);
                                        canvas.drawStrokeLine(l, offset, l + w, offset);
                                        h -= bw;
                                    }
                                    if (border.left._isValid())
                                    {
                                        offset = l + lw / 2;
                                        canvas._setLineStyle(border.left);
                                        canvas.drawStrokeLine(offset, t, offset, t + h);
                                        l += lw;
                                    }
                                }
                            }

                            if (bkrepeat)
                            {
                                if (bkimage && bkimage != "none")
                                {
                                    //  canvas.createPattern();
                                    canvas.drawImage(elem, 0, 0, bkimage.width, bkimage.height);
                                }
                                else
                                {
                                    //  canvas.createPattern();
                                    canvas.setElementFillStyle(nexacro.ColorObject(bkcolor));
                                    canvas.drawFillRect(l, t, w, h);
                                }
                            }
                            else
                            {
                                if (bkimage && bkimage != "none")
                                {
                                    canvas.drawImage(bkimage, 0, 0, bkimage.width, bkimage.height);
                                }
                                else
                                {
                                    canvas.setElementFillStyle(nexacro.ColorObject(bkcolor));
                                    canvas.drawFillRect(l, t, w, h);
                                }
                            }

                            // draw edge
                            break;
                        }
                    case "IconElement":
                    case "ImageElement":
                        {
                            drawImg = !opimg || opimg == "drawImg";
                            drawBox = opimg && opimg == "drawBox";

                            // draw Image/Icon
                            if (drawImg)
                            {
                                if (style.type == "runtime")
                                {
                                    image = new nexacro.Image();
                                    if (elem.icon)
                                    {
                                        image.set_src(elem.icon.value);
                                    }
                                    if (elem.image)
                                    {
                                        image.set_src(elem.image.url);
                                    }

                                    canvas.drawImage(image, l, t, w, h);
                                }
                                else
                                {
                                    canvas.drawImage(elem, l, t, w, h);
                                }
                            }
                            // draw box
                            if (drawBox)
                            {
                                canvas.setElementStrokeStyle(canvas.color);
                                canvas.drawStrokeInsetRect(l, t, w, h);
                            }

                            break;
                        }
                    case "IconTextElement":
                        {
                            drawBox = elem._box_node || 0;
                            drawIco = elem._icon_node || elem.icon;
                            //drawTxt = elem._text_node || elem.text;

                            // draw box
                            if (drawBox)
                            {
                                if (bkcolor)
                                {
                                    canvas.setElementFillStyle(nexacro.ColorObject(bkcolor));
                                    canvas.drawFillRect(l, t, w, h);
                                }
                                if (bkimage && bkimage != "none")
                                {
                                    image = new nexacro.Image();
                                    image.set_src(bkimage);

                                    var ix = l, iy = t;
                                    var iw = image.width, ih = image.height;

                                    if (bkposit && elem.parent_elem)
                                    {
                                        var pw = elem.parent_elem.width;
                                        var ph = elem.parent_elem.height;

                                        ix += Math.max((pw - iw) / 2, 0);
                                        iy += Math.max((ph - ih) / 2, 0);
                                    }

                                    canvas.drawImage(image, ix, iy, iw, ih);
                                }
                            }
                            // draw icon
                            if (drawIco)
                            {
                                if (style.type == "runtime" && elem.icon)
                                {
                                    image = new nexacro.Image();
                                    image.set_src(elem.icon.value);

                                    canvas.drawImage(image, l, t, image.width, image.height);
                                }
                                else if (elem._icon_node)
                                {
                                    canvas.drawImage(elem._icon_node, l, t, elem._icon_node.width, elem._icon_node.height);
                                }
                            }
                            // draw text
                            //if (!drawTxt)
                            {
                                break;
                            }
                        }
                    case "TextBoxElement":
                    case "InputElement":
                    case "TextAreaElement":
                        {
                            drawBox = (optxt && optxt == "drawBox") && elem.text;
                            drawTxt = (!optxt || optxt == "drawTxt") && elem.text;

                            // adjust padding
                            var padding = elem.textPadding;
                            if (padding)
                            {
                                l += padding.left;
                                t += padding.top;
                            }
                            // apply align
                            if (halign)
                            {
                                canvas.setElementTextAlign(halign);
                            }
                            // apply font
                            if (font)
                            {
                                canvas.setElementFont(nexacro.FontObject(font));
                            }
                            // apply color
                            if (color)
                            {
                                canvas.setElementFillStyle(nexacro.ColorObject(color));
                            }

                            var x;
                            // draw text
                            if (drawTxt)
                            {
                                var text = elem.text;
                                switch (halign)
                                {
                                    case "right": x = l + w; break;
                                    case "center": x = l + w / 2; break;
                                    case "left": x = l; break;
                                }

                                canvas.fillText(text, x, t);
                            }
                            // draw box
                            if (drawBox)
                            {
                                var n = elem.text.length;
                                var c = 6, r = 8, s = 1;
                                x = Math.max(w - (c + s) * n - s, 0);

                                switch (halign)
                                {
                                    case "right": break;
                                    case "center": x /= 2; break;
                                    case "left": x = 0; break;
                                }

                                l = l + x;
                                t = (h - r) / 2;

                                for (var i = 0; i < n && l + c < l + w; i++, l += c + s)
                                {
                                    canvas.drawFillRect(l, t, c, r);
                                }
                            }

                            break;
                        }
                    case "CanvasElement":
                    case "PluginElement":
                    case "WebBrowserPluginElement":
                    case "VideoPlayerPluginElement":
                    case "GoogleMapElement":
                    case "ContainerElement":
                    case "ModalOverlayElement":
                        {
                            break;
                        }
                }

                // unclip
                nexacro._clipPop2Canvas(canvas);
            }
        };
        // [util.saveImage:drawcomp]                // TODO:FullStyle
        nexacro._drawComponent2Canvas = function (canvas, comp, left, top, optxt, opimg)
        {
            if (canvas && comp)
            {
                var l = left || 0;
                var t = top || 0;
                var w = comp.getOffsetWidth();
                var h = comp.getOffsetHeight();

                // clip
                nexacro._clipAdd2Canvas(canvas, l, t, w, h);

                var control_elem = comp.getElement();
                if (control_elem && control_elem.handle)
                {
                    var i, n;
                    var items, item, children, child;

                    var cl, ct;
                    var el, et;

                    // draw control/border/back/edge
                    var b = comp._getCurrentStyleBorder();
                    var bl = b ? b.left._width : 0;
                    var bt = b ? b.top._width : 0;

                    // draw
                    nexacro._drawElement2Canvas(canvas, control_elem, l, t, optxt, opimg);

                    l += bl;
                    t += bt;

                    // draw simple contents/client/cell
                    var child_elem = control_elem.getContainerElement();
                    child_elem = comp._getClientElement ? comp._getClientElement() : child_elem;
                    child_elem = comp._cell_elem ? comp._cell_elem : child_elem;
                    child_elem = comp._text_elem ? comp._text_elem : child_elem;
                    child_elem = comp._img_elem ? comp._img_elem : child_elem;
                    child_elem = comp._input_element ? comp._input_element : child_elem;

                    if (child_elem && child_elem != control_elem && child_elem.handle)
                    {
                        el = child_elem.left;
                        et = child_elem.top;

                        canvas.setElementFont(comp._getCurrentStyleInheritValue("font"));
                        canvas.setElementColor(comp._getCurrentStyleInheritValue("color"));

                        nexacro._drawElement2Canvas(canvas, child_elem, l + el, t + et, optxt, opimg);
                    }

                    // draw children
                    children = comp._getChildren ? comp._getChildren() : null;
                    if (children)
                    {
                        for (i = 0, n = children.length; i < n; i++)
                        {
                            child = children[i];
                            if (child)
                            {
                                cl = child.getOffsetLeft();
                                ct = child.getOffsetTop();

                                nexacro._drawComponent2Canvas(canvas, child, l + cl, t + ct, optxt, opimg);
                            }
                        }
                    }

                    // draw itmes
                    items = comp._getItems ? comp._getItems() : null;
                    if (items)
                    {
                        for (i = 0, n = items.length; i < n; i++)
                        {
                            item = items[i];
                            if (item)
                            {
                                cl = item.getOffsetLeft();
                                ct = item.getOffsetTop();

                                nexacro._drawComponent2Canvas(canvas, item, l + cl, t + ct, optxt, opimg);
                            }
                        }
                    }

                    // draw nc child
                    var ncchild = comp._getNCChildren ? comp._getNCChildren() : null;
                    if (ncchild)
                    {
                        for (i = 0, n = ncchild.length; i < n; i++)
                        {
                            child = ncchild[i];
                            if (child)
                            {
                                cl = child.getOffsetLeft();
                                ct = child.getOffsetTop();

                                nexacro._drawComponent2Canvas(canvas, child, l + cl, t + ct, optxt, opimg);
                            }
                        }
                    }
                }

                // flush
                nexacro._flushCommand(canvas.linked_control ? canvas.linked_control._getWindow() : canvas.parent ? canvas.parent._getWindow() : null);
                // unclip
                nexacro._clipPop2Canvas(canvas);
            }
        };
    }

    // [util.notify:notify]                     // TODO:Optimize
    nexacro._setNotifyType = function (type, comp)
    {
        this._notifytype = type;
        this._notifycomp = comp;
    };
    //nexacro._notify = function (msg)
    //{
    //    if (this._notifycomp && this._notifycomp.value)
    //    {
    //        switch (this._notifytype)
    //        {
    //            case "addtext"  : return this._notifycomp.value += msg;
    //            case "addline"  : return this._notifycomp.value += msg + "\n";
    //            case "settext"  : return this._notifycomp.value = msg;
    //        }
    //    }
    //    {
    //        switch (this._notifytype)
    //        {
    //            case "alert": return alert(msg);
    //            case "trace": return trace(msg);
    //        }
    //        switch (nexacro._Browser)
    //        {
    //            case "Runtime"  : return alert(msg);
    //            default         : return trace(msg);
    //        }
    //    }
    //};
    nexacro._errorV8CallStack = function ()
    {
        Error.stackTraceLimit = 30;

        var traceFn = nexacro.__onNexacroStudioError ? nexacro.__onNexacroStudioError : Error ? trace : null;
        if (traceFn)
        {
            var e = new Error();
            var stack = e.stack;
            var str = "";

            var i, j;
            var frame, func, argstr, tempstr;
            var _this, _obname, _fnname;

            try
            {
                // i=0은 현재 이 function
                for (i = 1; i < stack.length; i++)
                {
                    frame = stack[i];
                    func = frame.getFunction();
                    argstr = "";
                    for (j = 0; j < func.arguments.length; j++)
                    {
                        tempstr = func.arguments[j] + ", ";
                        if (tempstr.length > 30)
                        {
                            argstr += "[LONG STR], ";
                        }
                        else
                        {
                            argstr += tempstr;
                        }
                    }

                    _this = frame.getThis();
                    _obname = _this.id ? _this.id : _this.name;
                    _fnname = frame.getFunctionName();
                    str += "\n   " + _this + _obname + "." + _fnname + "(arg: " + argstr + ")";
                }

                var mode = 0;
                //var mode = 1;

                switch (mode)
                {
                    case 0:
                        traceFn("\n===[callstack(" + (stack.length - 1) + ")]==============================\n" + str + "\n============================================");
                        break;
                    case 1:
                        {
                            traceFn("\n===[callstack(" + (stack.length - 1) + ")]==============================");
                            var strlist = str.split("\n");
                            for (i = 0; i < strlist.length; i++)
                            {
                                traceFn(strlist[i]);
                            }
                            traceFn("============================================");
                        }
                        break;
                }
            }
            catch (e)
            {
                nexacro._settracemsg(e);
            }
        }
    };
}