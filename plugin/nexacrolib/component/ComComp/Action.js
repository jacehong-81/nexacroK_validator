//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacro17-public-license-readme-1.1.html	
//
//==============================================================================

if (!nexacro.Action)
{
    "use strict";

	//===============================================================
    // nexacro.ActionEventInfo
    //===============================================================
    nexacro.ActionEventInfo = function (obj, id)
    {
        this.id = this.eventid = id;
        this.fromobject = this.fromreferenceobject = obj;
    };
    var _pActionEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ActionEventInfo);
    nexacro.ActionEventInfo.prototype = _pActionEventInfo;
    _pActionEventInfo._type_name = "ActionEventInfo";

	//==============================================================================
	// nexacro.Action
	//==============================================================================
	nexacro.Action = function (id, parent)
	{
        nexacro._EventSinkObject.call(this, id, parent);
        this._p_name = id;
	};
		
	var _pAction = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.Action);		
		nexacro.Action.prototype = _pAction;
	_pAction._type_name = "Action";		
		
    /* default properties */
    _pAction._p_targetview = "";
    _pAction._targetview = null;
	_pAction._contents = null;		

    /* internal variable */

    _pAction._event_list = {
        "onsuccess": 1, "onerror": 1
    };
		
    //===============================================================
    // nexacro.Action : Create & Destroy & Update
    //===============================================================
	_pAction.destroy = function ()
	{
        this._contents = null;
        this._targetview = null;

        if (this._p_parent)
            this._p_parent.removeChild(this.id);
        this._p_parent = null;

        nexacro._EventSinkObject.prototype.destroy.call(this);
	};

    //===============================================================
    // nexacro.Action : Properties
    //===============================================================
	_pAction.set_targetview = function (v)
	{
        if (this._p_targetview !== v)
		{
            this._p_targetview = v;
            this._targetview = null;
		}
    };

    _pAction.set_name = function (v)
    {
        if (this._p_name != v)
        {
            this._p_name = v;
        }
    };

    _pAction._properties = [{name: "targetview"}, {name: "name"}];
    nexacro._defineProperties(_pAction, _pAction._properties);

    //===============================================================
    // nexacro.Action : Event part
    //===============================================================
    _pAction.on_fire_onsuccess = function ()
    {
		var event = this.onsuccess;
		if (event && event._has_handlers)
		{
            var evt = new nexacro.ActionEventInfo(this, "onsuccess");
			event._fireEvent(this, evt);
		}
    };

    _pAction.on_fire_onerror = function ()
    {
		var event = this.onerror;
		if (event && event._has_handlers)
		{
            var evt = new nexacro.ActionEventInfo(this, "onerror");
			event._fireEvent(this, evt);
		}
    };
		
    //===============================================================
    // nexacro.Action : Logical part
    //===============================================================
	_pAction._setContents = function (v)
    {
        if (nexacro._isObject(v))
            this._contents = v;			
        else
            this._contents = JSON.parse(v);
    };

    _pAction.getContents = function (key)
    {
        key = nexacro._toString(key);

        return this._contents ? (this._contents[key]/* || this._contents*/) : null;
    };

	_pAction._findViewObject = function (strName)
    {
        var parent = this._p_parent;
        if (!parent)
            return null;

		var targetview = parent[strName];
        if (targetview instanceof nexacro.View)
            return targetview;

        return null;
    };

    _pAction.getTargetView = function ()
    {
        if (this._targetview)
            return this._targetview;

        return this._targetview = this._findViewObject(this._p_targetview);
    };
       
	_pAction.run = nexacro._emptyFn;
}