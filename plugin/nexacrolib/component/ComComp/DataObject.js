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
"use strict";

//--------------------------------------------------------------------------------------------
// nexacro.DataObjectLoadEventInfo
//--------------------------------------------------------------------------------------------
if (!nexacro.DataObject)
{
    nexacro.DataObjectLoadEventInfo = function (obj, id, url, reason)//, progressload)
    {
        this.id = this.eventid = id || "onload";
        this.fromobject = this.fromreferenceobject = obj;

        //this.errorcode = errorcode;
        //this.errormsg = errormsg;
        this.url = url;
        this.reason = reason;
    };
    var _pDataObjectLoadEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.DataObjectLoadEventInfo);
    nexacro.DataObjectLoadEventInfo.prototype = _pDataObjectLoadEventInfo;
    _pDataObjectLoadEventInfo._type_name = "DataObjectLoadEventInfo";

    _pDataObjectLoadEventInfo = null;

    //========================================================================
    // nexacro.DataObjectErrorEventInfo
    //========================================================================
    nexacro.DataObjectErrorEventInfo = function (obj, id, errortype, errormsg, errorobj, statuscode, requesturi, locationuri, errordata)
    {
        nexacro.ErrorEventInfo.call(this, obj, id, errortype, errormsg, errorobj, statuscode, requesturi, locationuri, errordata);
    };

    var _pDataObjectErrorEventInfo = nexacro._createPrototype(nexacro.ErrorEventInfo, nexacro.DataObjectErrorEventInfo);
    nexacro.DataObjectErrorEventInfo.prototype = _pDataObjectErrorEventInfo;
    _pDataObjectErrorEventInfo._type_name = "DataObjectErrorEventInfo";

    _pDataObjectErrorEventInfo = null;

    //--------------------------------------------------------------------------------------------
    // nexacro.DataObjectEventInfo  
    //--------------------------------------------------------------------------------------------
    nexacro.DataObjectEventInfo = function (obj, id, response, svcid, url, reason, method, statuscode)//, progressload)
    {
        this.id = this.eventid = id || "onload";
        this.fromobject = this.fromreferenceobject = obj;

        this.response = response;
        this.serviceid = svcid;
        this.url = url;
        this.reason = reason; //LOAD, REQUEST

        this.cancelable = true;
        this.method = method;
        this.statuscode = statuscode;
    };
    var _pDataObjectEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.DataObjectEventInfo);
    nexacro.DataObjectEventInfo.prototype = _pDataObjectEventInfo;
    _pDataObjectEventInfo._type_name = "DataObjectEventInfo";
    /*
    _pDataObjectEventInfo.getAllResponseHeaders = function ()
    {
        return this._parseResponseHeaders(this._response_header);
    };

    _pDataObjectEventInfo._parseResponseHeaders = function (allheaders)
    {
        // Convert the header string into an array of individual headers
        //trace(allheaders.trim().replace(/^\s*\n/gm, "") )
        var arr = allheaders.trim().replace(/\0[\s\S]*$/g,'').split(/[\r\n]+/);

        // Create a map of header names to values
        var headerMap = {};
        for (var i = 0; i < arr.length; i++)
        {
            var parts = arr[i].split(': ');
            var header = parts.shift();
            var value = parts.join(': ');
            headerMap[header] = value;
        }

        return headerMap;
    };
    */

    nexacro.DataObjectDataChangedEventInfo = function (obj, id, url, reason, infoarray)//, progressload)
    {
        this.id = this.eventid = id || "ondatachanged";
        this.fromobject = this.fromreferenceobject = obj;

        //this.errorcode = errorcode;
        //this.errormsg = errormsg;
        //this.url = url;
        //this.reason = reason;
        this.infoarray = infoarray;
        //this.dataobjectpath = datapath;
        //this.srcdatasetid = dsid;
    };
    var _pDataObjectDataChangedEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.DataObjectDataChangedEventInfo);
    nexacro.DataObjectDataChangedEventInfo.prototype = _pDataObjectDataChangedEventInfo;
    _pDataObjectDataChangedEventInfo._type_name = "DataObjectDataChangedEventInfo";
    _pDataObjectDataChangedEventInfo = null;

    nexacro.DataObjectValueChangedEventInfo = function (obj, id, reason, uid, path, index, key, newvalue, dsid)//, progressload)
    {
        this.id = this.eventid = id || "onvaluechanged";
        this.fromobject = this.fromreferenceobject = obj;

        //this.errorcode = errorcode;
        //this.errormsg = errormsg;
        //this.url = url;
        //this.reason = reason;
        this.uid = uid;
        this.dataobjectpath = path;
        this.index = index;
        this.key = key;
        //this.oldvalue = oldvalue;
        this.value = newvalue;
        this.sourcedatasetid = dsid;
    };
    var _pDataObjectValueChangedEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.DataObjectValueChangedEventInfo);
    nexacro.DataObjectValueChangedEventInfo.prototype = _pDataObjectValueChangedEventInfo;
    _pDataObjectValueChangedEventInfo._type_name = "DataObjectValueChangedEventInfo";
    _pDataObjectValueChangedEventInfo = null;

    nexacro.DataObjectLoadDatasetsEventInfo = function (obj, id, reason)
    {
        this.id = this.eventid = id || "onloaddatasets";
        this.fromobject = this.fromreferenceobject = obj;
        this.reason = reason;
    };
    var _pDataObjectLoadDatasetsEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.DataObjectLoadDatasetsEventInfo);
    nexacro.DataObjectLoadDatasetsEventInfo.prototype = _pDataObjectLoadDatasetsEventInfo;
    _pDataObjectLoadDatasetsEventInfo._type_name = "DataObjectLoadDatasetsEventInfo";
    _pDataObjectLoadDatasetsEventInfo = null;

    //===============================================================
    // nexacro.DataObject
    //===============================================================
    nexacro.DataObject = function (id, parent)
    {
        nexacro._EventSinkObject.call(this, id, parent);

        this._context_list = [];
        this._updatelist = [];
        this._remaining_updatelist = [];
    };

    var _pDataObject = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.DataObject);
    nexacro.DataObject.prototype = _pDataObject;
    _pDataObject._type_name = "DataObject";

    _pDataObject._p_url = "";
    _pDataObject._p_enableevent = true; //default
    _pDataObject._p_preload = false; //default
    _pDataObject._p_data = null; //default   

    _pDataObject._isData = true;
    _pDataObject._is_preloaded = false;
    _pDataObject._response = undefined;
    _pDataObject._response_headers = undefined;
    _pDataObject._bindcount = 0;
    _pDataObject._event_list =
    {
        "onsuccess": 1, "onload": 1, "onerror": 1, "ondatachanged": 1, "onvaluechanged": 1, "onloaddatasets": 1
    };


    // Dataset Event Reasons    
    nexacro.DataObject.REASON_LOAD = 0; //DataObject의 Load가 완료되었을 때
    nexacro.DataObject.REASON_LOADCONTENT = 1; //ADL 또는 FDL에 정의된 Dataset의 Load가 완료되었을 때. Form의 onload() 이벤트보다 먼저 발생합니다.
    nexacro.DataObject.REASON_REQUEST = 2; //Request 통신을 이용해 데이터가 로드가 완료되었을 때
    //nexacro.DataObject.REASON_UPDATE = 4; 


    //===============================================================
    // nexacro.DataObject : Create & Destroy & Update
    //===============================================================
    _pDataObject.create = function ()
    {
        //TODO
    };
    /*
    _pDataObject._addCallbackContext = function (context)
    {
        //TODO
        this._context_list.push(context);
    };
    
    _pDataObject._removeCallbackContext = function (context)
    {
        if (!context)
            return;
        var idx = nexacro._indexOf(this._context_list, context);
        if (idx >= 0)
        {
            this._context_list[idx] = null;
            delete this._context_list[idx];
            this._context_list.splice(idx, 1);
        }
    };
    */

    _pDataObject.on_created = function () 
    {
        if (this._p_url == "" || this._p_preload == false)
        {
            if (this._p_data)
                this._endLoad(0, "SUCCESS", 1);	// 1 == REASON_LOADCONTENT
        }

        //preload
        if (!nexacro.isDesignMode && this._p_preload && !this._is_preloaded)
        {
            if (this._p_url && this._p_parent)
            {
                //var bLoaded = false;

                var keys = [];
                keys.push("__preload");
                keys.push(this._p_url);
                keys.push(this.id);
                keys.push(this._p_serverdatasetid);
                var svcid = keys.join('_');

                var url = nexacro._getServiceLocation(this._p_url);

                var loadmanager = this._p_parent._load_manager;
                if (loadmanager)
                {
                    var data = loadmanager.getPreloadDataObjectModule(this.id);
                    if (data)
                    {
                        //통신
                        var tritem = new nexacro.RESTAPIItem(url, this._p_parent, svcid, "", this, "", 0, true);
                        tritem._usewaitcursor = false;
                        tritem._loadFromDataObject(data, this);
                        this._is_preloaded = true;
                    }
                }
            }
        }

        //Todo
        this._is_created = true;
    };

    _pDataObject.destroy = function ()
    {
        //TODO
        this._p_data = null;
        this._context_list = null;
        this._is_created = null;

        this._response = null;
        this._response_headers = null;
        if (this._p_parent)
            this._p_parent.removeChild(this.id);
        this._p_parent = null;
        this._updatelist.length = 0;
        this._updatelist = null;
        this._bindcount = 0;
        nexacro._EventSinkObject.prototype.destroy.call(this);
    };


    //===============================================================
    // nexacro.DataObject : Properties
    //===============================================================

    _pDataObject.set_data = function (data)
    {
        try
        {
            if (data)
            {
                if (typeof data == "string")
                    this._p_data = JSON.parse(data);
                else if (typeof data == "object")
                    this._p_data = data;
            }
            if (!this._p_data)
                this._p_data = undefined;
        }
        catch (err)
        {
            this._p_data = undefined;
        }
        finally
        {
            this.on_apply_data();
        }
    };

    _pDataObject.on_apply_data = function ()
    {
        this._endLoad(0, "SUCCESS", 1);
    };

    _pDataObject.set_url = function (url)
    {
        if (this._p_url != url)
        {
            this._p_url = url;
            this.on_apply_url();
        }
    };

    _pDataObject.on_apply_url = function ()
    {
        //Todo..        
    };

    _pDataObject.set_preload = function (v) 
    {
        this._p_preload = nexacro._toBoolean(v);
    };

    _pDataObject.set_enableevent = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_enableevent != v)
        {
            this._p_enableevent = v;
            this._eventstat = (v && !this.loadstatus);
            this.on_apply_enableevent(v);
        }
    };

    _pDataObject.on_apply_enableevent = function (v)
    {
        if (v)
        {
            //this.on_fire_onchangeddata(0, "SUCCESS", 1, path, updatalist); //test code
            this._before_fire_event = true;
            this.on_fire_ondatachanged(-1, -1, 41, this._updatelist); //nexacro.Dataset.REASON_ENABLEEVENT
            this._before_fire_event = false;
            //Todo..
            /*
            if (this.onvaluechanged && this.onvaluechanged._has_handlers)
            {
                var evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", this.rowposition, -1, -1, "", undefined, undefined);
                this.on_fire_onvaluechanged(evt);
            }
            */
        }
    };
    _pDataObject._properties = [{ name: "url" }, { name: "enableevent" }, { name: "preload" }, { name: "data" }];
    nexacro._defineProperties(_pDataObject, _pDataObject._properties);
    /*
    _pDataObject.set_updatecontrol = function (v)
    {
        this.updatecontrol = nexacro._toBoolean(v);
    };
    */
    //_pDataset.set_updateresetcontrol = function (v)
    //{
    //    this.updateresetcontrol = nexacro._toBoolean(v);
    //};

    //===============================================================
    // nexacro.DataObject : Methods
    //===============================================================

    _pDataObject.serializeToString = function (replacer, space)
    {
        var data = this._p_data;
        if (data)
            return JSON.stringify(data, replacer, space);
        return "";
    };

    //Check
    _pDataObject.load = function (async)
    {
        var _url = this._p_url;
        var baseurl;
        async = async === undefined ? true : async;
        if (this._refform)
        {
            baseurl = this._refform._getRefFormBaseUrl();
        }

        _url = nexacro._getServiceLocation(_url, baseurl);

        if (_url.length && this._p_parent)
        {
            var svcid = "";//"__dataobject_loadurl_" + this.id;
            var loadmanager = this._p_parent._load_manager;
            if (loadmanager)
            {
                //outds
                var service = nexacro._getServiceObject(this._p_url, true);
                loadmanager.loadDataObjectModule(_url, svcid, "", this, null, async, undefined, false, service);
            }
        }
        else
        {
            this._endLoad(-1, "empty url", 1);	// 1 == REASON_LOADCONTENT
        }

    };

    _pDataObject.getObject = function ()
    {
        //TODO
        return this._p_data;
    };

    _pDataObject.getObjectByPath = function (path)
    {
        //TODO
        return this._jsonPath(path);
    };


    //request("serviceid", "POST", "service::post.jsp", param)
    _pDataObject.request = function (svcid, method, url, jsonparam)
    {
        var baseurl;
        if (this._refform)
        {
            baseurl = this._refform._getRefFormBaseUrl();
        }
        var _url = nexacro._getServiceLocation(url, baseurl);
        if (url.length && this._p_parent)
        {
            //var svcid = "__dataobject_restapi_" + this.id;
            var loadmanager = this._p_parent._load_manager;
            if (loadmanager)
            {
                //outds
                var service = nexacro._getServiceObject(url, true);
                var async = jsonparam && jsonparam.async != undefined ? jsonparam.async : true;
                loadmanager.loadDataObjectModule(_url, svcid, method, this, jsonparam, async, undefined, false, service);//, undefined, undefined, 1);
            }
        }
        else
        {
            this._endLoad(-1, "empty url", 1);	// 1 == REASON_LOADCONTENT
        }

    };

    _pDataObject.getAllResponseHeaders = function ()
    {
        if (this._response_headers)
            return this._parseResponseHeaders(this._response_headers);
        return undefined;
    };

    _pDataObject.getResponseHeader = function (headername)
    {
        if (this._response_headers)
            return this._parseResponseHeaders(this._response_headers, headername);
        return null;
    };

    _pDataObject.getResponse = function ()
    {
        return this._response;
    };

    //Path, datapath, index,  
    //dataset에서 column 단위 업데이트 시
    //path, value [index,[key, [, srcdatasetid]]]
    _pDataObject.setDataValue = function (path, value, index, key, srcdsid)
    {
        //path 문법
        //$.body.server[*]
        // /body/servers/
        if (index == -1)
        {
            this._setPathValue(key, value);
            this._before_fire_event = true;
            this.on_fire_onvaluechanged(0, "SUCCESS", 16, /*rowobj,*/ "update_" + parseInt(nexacro._random() * 100000000), "", index, key, value, srcdsid); //test code
            this._before_fire_event = false;
        }
        else
        {
            var rootobj = this.getObjectByPath(path);
            if (rootobj)
            {
                var rowobj = rootobj[index];
                if (rowobj)
                {
                    //rowobj[key] = value;
                    var uid = "update_" + parseInt(nexacro._random() * 100000000);
                    this._setValueInKey(rowobj, key, value);
                    this._updatelist.push({ "uid": uid, "type": "update", "index": index, "data": rowobj, "dataobjectpath": path, "sourcedatasetid": srcdsid });
                    if (this.enableevent)
                    {
                        this._before_fire_event = true;
                        this.on_fire_onvaluechanged(0, "SUCCESS", 1, /*rowobj,*/ uid, path, index, key, value, srcdsid); //test code
                        this._before_fire_event = false;
                    }
                }
            }
        }
    };

    //Path, datapath, index, data 
    //setDataInPath path, data [ index,[ srcdatasetid]]
    _pDataObject.setDataInPath = function (path, data, index, sourcedatasetid)
    {
        var bReload = false;
        var rootobj = this.getObjectByPath(path);
        if (rootobj)
        {
            if (data.length > 0)
            {
                var updatalist = this._updatelist;
                for (var i = 0, len = data.length; i < len; i++)
                {
                    var cur_item = data[i];
                    var type = cur_item[0];
                    var index = cur_item[1];
                    var objdata = cur_item[2];
                    var obj;
                    //if (index == -1)
                    //{
                    //    this._setPathValue(key, value);
                    //}

                    if (type == "update")
                    {
                        if (bReload == true)
                        {
                            rootobj = this.getObjectByPath(path);
                            bReload = false;
                        }
                        obj = rootobj[index];
                        this._copyRowData(obj, objdata);
                    }
                    else if (type == "add")
                    {
                        obj = this._addRowData(path, objdata);
                        bReload = true;
                    }
                    else if (type == "delete")
                    {
                        obj = this._deleteRowData(path, index);
                        bReload = true;
                    }
                    else if (type == "insert")
                    {
                        obj = this._addRowData(path, objdata, index);
                        bReload = true;
                    }

                    updatalist.push({ "uid": type + "_" + parseInt(nexacro._random() * 100000000), "type": type, "index": index, "data": obj, "dataobjectpath": path, "sourcedatasetid": sourcedatasetid });
                }
            }
            else
            {
                var rowobj = rootobj[index];
                this._copyRowData(rowobj, data);
                this._updatelist.push({ "uid": "update" + "_" + parseInt(nexacro._random() * 100000000), "type": "update", "index": index, "data": rowobj, "dataobjectpath": path, "sourcedatasetid": sourcedatasetid });
            }
            if (this.enableevent)
            {
                this._before_fire_event = true;
                this.on_fire_ondatachanged(0, "SUCCESS", 1, this._updatelist); //test code
                this._before_fire_event = false;
            }
        }
    };

    //addDataInPath
    _pDataObject.addDataInPath = function (path, data, index, srcdsid)
    {
        var rootobj = this.getObjectByPath(path);
        if (rootobj)
        {
            var rowobj = this._addRowData(path, data, index);
            this._updatelist.push({ "uid": "add" + "_" + parseInt(nexacro._random() * 100000000), "type": "add", "index": index, "data": rowobj, "dataobjectpath": path, "sourcedatasetid": srcdsid });
            if (this.enableevent && rowobj)
            {
                this._before_fire_event = true;
                this.on_fire_ondatachanged(0, "SUCCESS", 1, this._updatelist); //test code
                this._before_fire_event = false;
            }
        }
    };

    //deleteDataInPath
    _pDataObject.deleteDataInPath = function (path, data, index, srcdsid)
    {
        var rootobj = this.getObjectByPath(path);
        if (rootobj)
        {
            var rowobj = this._deleteRowData(path, index);
            this._updatelist.push({ "uid": "delete" + "_" + parseInt(nexacro._random() * 100000000), "type": "delete", "index": index, "data": rowobj, "dataobjectpath": path, "sourcedatasetid": srcdsid });
            if (this.enableevent && rowobj)
            {
                this._before_fire_event = true;
                this.on_fire_ondatachanged(0, "SUCCESS", 1, this._updatelist); //test code
                this._before_fire_event = false;
            }
        }
    };

    //insertDataInPath
    _pDataObject.insertDataInPath = function (path, data, index, srcdsid)
    {
        var rootobj = this.getObjectByPath(path);
        if (rootobj)
        {
            var rowobj = this._addRowData(path, data, index);
            this._updatelist.push({ "uid": "insert" + "_" + parseInt(nexacro._random() * 100000000), "type": "insert", "index": index, "data": rowobj, "dataobjectpath": path, "sourcedatasetid": srcdsid });
            if (this.enableevent && rowobj)
            {
                this._before_fire_event = true;
                this.on_fire_ondatachanged(0, "SUCCESS", 1, this._updatelist); //test code
                this._before_fire_event = false;
            }
        }
    };

    //not use
    _pDataObject.setData = function (path, type, index, data, srcdsid)
    {
        var rowobj;
        var rootobj = this.getObjectByPath(path);
        if (type == "update")
        {
            rowobj = rootobj[index];
            this._copyRowData(rowobj, data);
        }
        else if (type == "add")
            rowobj = this._addRowData(path, data, index);
        else if (type == "delete")
            rowobj = data = this._deleteRowData(path, index);
        else if (type == "insert")
            rowobj = this._addRowData(path, data, index);

        //if (this.updatecontrol)
        this._updatelist.push({ "uid": type + "_" + parseInt(nexacro._random() * 100000000), "type": type, "index": index, "data": data, "dataobjectpath": path, "srcdatasetid": srcdsid });
        if (this.enableevent && rowobj)
        {
            this._before_fire_event = true;
            this.on_fire_ondatachanged(0, "SUCCESS", 1, this._updatelist); //test code
            this._before_fire_event = false;
        }
    };

    //not use
    _pDataObject.setDataList = function (path, datalist, srcdsid)
    {
        //datalist
        //array
        var bfire = false;
        var obj;
        var updatalist = this._updatelist;
        var rootobj = this.getObjectByPath(path);
        if (rootobj)
        {
            for (var i = 0, len = datalist.length; i < len; i++)
            {
                var cur_item = datalist[i];
                var type = cur_item[0];
                var index = cur_item[1];
                var data = cur_item[2];

                if (type == "update")
                {
                    obj = rootobj[index];
                    this._copyRowData(obj, data);
                }
                else if (type == "add")
                    obj = this._addRowData(path, data);
                else if (type == "delete")
                    obj = this._deleteRowData(path, index);
                else if (type == "insert")
                    obj = this._addRowData(path, data, index);

                //if (this.updatecontrol)
                updatalist.push({ "uid": type + "_" + parseInt(nexacro._random() * 100000000), "type": type, "index": index, "data": obj, "dataobjectpath": path, "srcdatasetid": srcdsid });
                if (this.enableevent)
                    bfire = true;
            }
        }

        if (bfire)
        {
            this._before_fire_event = true;
            this.on_fire_ondatachanged(0, "SUCCESS", 1, updatalist, srcdsid); //test code
            this._before_fire_event = false;
        }
    };

    _pDataObject.getChangedInfo = function ()
    {
        if (this._before_fire_event)
            return this._remaining_updatelist;
        return this._appendArray(this._updatelist, this._remaining_updatelist);
    };

    _pDataObject.clearChangedInfo = function ()
    {
        this._updatelist.length = 0;
        this._remaining_updatelist.length = 0;
    };

    _pDataObject.removeChangedInfo = function (uid)
    {
        var updatelist = this._remaining_updatelist;
        for (var i = 0, len = updatelist.length; i < len; i++)
        {
            if (updatelist[i].uid = uid)
            {
                updatelist.splice(i, 1);
                return uid;
            }
        }

        var updatelist = this._updatelist;
        for (var i = 0, len = updatelist.length; i < len; i++)
        {
            if (updatelist[i].uid = uid)
            {
                updatelist.splice(i, 1);
                return uid;
            }
        }
        return false;
    };

    //===============================================================
    // nexacro.DataObject : Events
    //===============================================================
    //onload Completed

    _pDataObject.on_fire_onload = function (errcode, errmsg, reason, url)
    {
        if (errcode >= 0)
        {
            // based on manual
            errcode = 0;
            errmsg = "SUCCESS";
        }

        var event = this.onload;
        if (event && event._has_handlers)
        {
            var evt = new nexacro.DataObjectLoadEventInfo(this, "onload", url, /*errcode, errmsg,*/ reason);
            event._fireEvent(this, evt);
        }
    };

    _pDataObject.on_fire_ondatachanged = function (errcode, errmsg, reason, datalist)
    {
        if (errcode >= 0)
        {
            // based on manual
            errcode = 0;
            errmsg = "SUCCESS";
        }

        var event = this.ondatachanged;
        if (event && event._has_handlers)
        {
            var evt = new nexacro.DataObjectDataChangedEventInfo(this, "ondatachanged", "", /*errcode, errmsg,*/ reason, datalist);
            event._fireEvent(this, evt);
        }

        //copy updatelist
        //testCode
        this._remaining_updatelist = this._appendArray(this._updatelist, this._remaining_updatelist);
        this._updatelist.length = 0;

    };

    _pDataObject.on_fire_onvaluechanged = function (errcode, errmsg, reason, uid, datapath, index, key, newvalue, srcdsid)
    {
        if (errcode >= 0)
        {
            // based on manual
            errcode = 0;
            errmsg = "SUCCESS";
        }

        var event = this.onvaluechanged;
        if (event && event._has_handlers)
        {
            var evt = new nexacro.DataObjectValueChangedEventInfo(this, "onvaluechanged", /*errcode, errmsg,*/ reason, uid, datapath, index, key, newvalue, srcdsid);
            event._fireEvent(this, evt);
        }

        //for test
        this._remaining_updatelist = this._appendArray(this._updatelist, this._remaining_updatelist);
        this._updatelist.length = 0;
    };

    /*
    _pDataObject.on_fire_onchanged = function (errcode, errmsg, reason, progressload)
    {
        if (errcode >= 0)
        {
            // based on manual
            errcode = 0;
            errmsg = "SUCCESS";
        }
    
        var event = this.onchanged;
        if (event && event._has_handlers)
        {
            var evt = new nexacro.DataObjectLoadEventInfo(this, "onchanged", errcode, errmsg, reason, progressload);
            event._fireEvent(this, evt);
        }
    };
    */
    _pDataObject.on_fire_onsuccess = function (response, svcid, url, reason, method, statuscode)
    {
        var event = this.onsuccess;
        if (event && event._has_handlers)
        {
            var evt = new nexacro.DataObjectEventInfo(this, "onsuccess", response, svcid, url, reason, method, statuscode);
            event._fireEvent(this, evt);
        }
    };

    _pDataObject.on_fire_onerror = function (errortype, errormsg, errorobj, statuscode, requesturi, locationuri, svcid)
    {
        if (this.onerror && this.onerror._has_handlers)
        {
            var evt = new nexacro.DataObjectErrorEventInfo(this, "onerror", errortype, errormsg, errorobj, statuscode, requesturi, locationuri, svcid);
            return this.onerror._fireEvent(this, evt);
        }
        return true;
    };

    _pDataObject.on_fire_onloaddatasets = function (errcode, errmsg, reason)
    {
        if (this.onloaddatasets && this.onloaddatasets._has_handlers)
        {
            var evt = new nexacro.DataObjectLoadDatasetsEventInfo(this, "onloaddatasets", reason);
            return this.onloaddatasets._fireEvent(this, evt);
        }
        return true;
    };


    _pDataObject._on_success = function (response, svcid, url, jsonobj, method, statuscode)
    {
        var pThis = this;
        var ret = this.on_fire_onsuccess(response, svcid, url, 2, method, statuscode);
        if (!pThis.onsuccess || (pThis.onsuccess && !pThis.onsuccess.defaultprevented) && method != "HEAD")
        {
            this.on_onsuccess_default_action(jsonobj, url);
        }
        return ret;
    };

    _pDataObject.on_onsuccess_default_action = function (jsonobj, url)
    {
        //this.set_contents(jsonobj);
        this._setContents(jsonobj, 2, url);
        //this._endLoad(0, "SUCCESS", 2);
    };


    //===============================================================
    // nexacro.DataObject : Logical Part 
    //===============================================================
    _pDataObject._setContents = function (data, reason, url)
    {
        if (data)
        {
            if (typeof data == "string")
                this._p_data = JSON.parse(data);
            else
                this._p_data = data;

            this._endLoad(0, "SUCCESS", reason != undefined ? reason : 1, url ? url : "");
        }
    };

    _pDataObject._parse = function (strobj)
    {
        return JSON.parse(strobj);
    };

    _pDataObject._jsonPath = function (expr)
    {
        var jsonobj = this._p_data;
        if (jsonobj)
        {
            return nexacro._JSONPath(jsonobj, expr);
        }
        else
            return null;
    };

    _pDataObject._endLoad = function (errorcode, errormsg, reason, url)
    {
        this.on_fire_onload(errorcode, errormsg, reason, url);
        var is_created = this._is_created ? true : this.parent && this.parent._is_created;
        if (is_created && this._p_data)
        {
            if (this._bindcount > 0)
                this.on_fire_onloaddatasets(errorcode, errormsg, reason);
            this._is_created = true;
        }
        /*
        var bindcontexts = this._context_list;
        for (var i = 0, len = bindcontexts.length; i < len; i++)
        {
            var context = bindcontexts[i];
            if (context.on_notify_onload_dataobject)
                context.on_notify_onload_dataobject.call(context, this, reason);
        }
        */
    };
    /*
    _pDataObject._endChanged = function (errorcode, errormsg, reason)
    {
        //if (this.enableevent)
        {
            this.on_fire_onchanged(errorcode, errormsg, reason);
        }
    
        if (reason == 0 || reason == 4)
        {
            //구조 수정예정
            var bindcontexts = this._context_list;
            for (var i = 0, len = bindcontexts.length; i < len; i++)
            {
                var context = bindcontexts[i];
                if (context.on_notify_onload_dataobject)
                    context.on_notify_onload_dataobject.call(context, this, reason);
            }
        }
    
    };
    */

    _pDataObject.on_preload_dataobject = function (url, errstatus, data, fireerrorcode, returncode, requesturi, locationuri, extramsg)
    {
        if (errstatus != 0)
        {
            //nexacro._onHttpSystemError(this, true, this, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
            this._onDataObjectRequestError(this, true, this, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
        }
        else if (data && !this._is_preloaded)
        {
            var keys = [];
            keys.push("__preload");
            keys.push(this._p_url);
            keys.push(this.id);
            keys.push(this._p_serverdatasetid);
            var svcid = keys.join('_');
            /*
            var serverdatasetid = this.serverdatasetid;
            if (!serverdatasetid)
            {
                serverdatasetid = "output";
            }*/
            //var outds = this.id + "=" + serverdatasetid;

            var tritem = new nexacro.RESTAPIItem(this._p_url, this._p_parent, svcid, "", this, "", 0, true);
            tritem._usewaitcursor = false;
            tritem._loadFromDataObject(data, this);
            this._is_preloaded = true;
        }
    };

    _pDataObject._onDataObjectRequestError = function (obj, bfireevent, errorobj, errortype, url, returncode, requesturi, locationuri, extramsg, svcid, response, response_headers)
    {
        var ret = false;
        var commerrorobj = nexacro.MakeCommunicationError(this, errortype, url, returncode, requesturi, locationuri, extramsg);
        this._addResponseInfo(response, response_headers);
        if (bfireevent)
        {
            var environment = nexacro.getEnvironment();
            if (environment)
            {
                ret = environment.on_fire_onerror(obj, /*commerrorobj.name*/"ObjectError", commerrorobj.message, errorobj, returncode, requesturi, locationuri, svcid);
            }
            if (!ret)
                ret = this.on_fire_onerror(/*commerrorobj.name*/ "ObjectError", commerrorobj.message, errorobj, returncode, requesturi, locationuri, svcid);
        }

        return ret;
    };

    /*
        _pDataObject._addDataset = function (dataset)
        {
            var ds_id = dataset.id;
            var datasets = this._datasets;
            if (datasets)
            {
                var cidx = nexacro._indexOf(datasets, ds_id);
                if (cidx < 0) 
                {
                    datasets.push(dataset);
                    return cidx;
                }
            }
    
            return -1;
        }
    
        _pDataObject._removeDataset = function (dataset)
        {        
            var cidx = nexacro._indexOf(this._datasets, dataset);
            if (cidx > -1)
            {
                this._datasets.splice(cidx, 1);    
                return cidx;            
            }
            return -1;
        }
    */

    _pDataObject._addResponseInfo = function (response, response_headers)
    {
        this._response = response;
        this._response_headers = response_headers;
    };

    _pDataObject._clearResponseInfo = function ()
    {
        this._response = undefined;
        this._response_headers = undefined;
    };

    _pDataObject._parseResponseHeaders = function (allheaders, headername)
    {
        var arr = allheaders.trim().replace(/\0[\s\S]*$/g, '').split(/[\r\n]+/);
        // Create a map of header names to values
        var headerMap = {};

        if (headername)
            headername = headername.toLowerCase();

        for (var i = 0; i < arr.length; i++)
        {
            var parts = arr[i].split(': ');
            if (parts)
            {
                var name = parts[0];
                if (name && name.indexOf("HTTP/") > -1)
                    continue;
                var header = parts.shift();
                if (header)
                {
                    if (headername)
                    {
                        var _headername = header;
                        _headername = _headername.toLowerCase();

                        if (_headername == headername)
                            return parts.pop();
                    }

                    headerMap[header] = parts.join(': ');
                }
            }
        }

        if (headername)
            return null;

        return headerMap;
    };



    _pDataObject._appendArray = function (srcarr, tararr)
    {
        return tararr.concat(srcarr);
    }

    _pDataObject._getAbsolutePathByDataobectpath = function (dataobjectpath)
    {
        var path = "";
        var arr_datapath = dataobjectpath.match(/[^\]\[.]+/g);
        if (arr_datapath)
        {
            for (var i = 1, len = arr_datapath.length; i < len; i++)
            {
                path = path + "/" + arr_datapath[i];
            }
            return path;// ? ret : "";
        }
        return path;
    };

    _pDataObject._copyRowData = function (destRow, srcRow)
    {
        for (var key in srcRow) 
        {
            if (typeof srcRow[key] == "object" && srcRow[key] != null)
            {
                this._copyRowData(destRow[key], srcRow[key]);
            }
            else if (key[0] == "$")
            {
                var rootobj = this.getObjectByPath(key);
                if (rootobj && rootobj[0])
                    rootobj[0] = srcRow[key];
            }
            else 
            {
                destRow[key] = srcRow[key];
            }
        }
    };

    _pDataObject._addRowData = function (datapath, srcRow, index)
    {
        if (!this._p_data)
            return false;
        var rootobj = this._getRootObjectByPath(datapath);
        if (!rootobj)
            return false;
        var destRow = {};
        for (var key in srcRow) 
        {
            if (typeof srcRow[key] == "object" && srcRow[key] != null) 
            {
                this._copyRowData(destRow[key], srcRow[key]);
            }
            else 
            {
                destRow[key] = srcRow[key];
            }
        }
        if (index > -1)
            rootobj.splice(index, 0, destRow);
        else
            rootobj.push(destRow);
        return destRow;
    };

    /*
    //add와 합칠수 있음
    _pDataObject._insertRowData = function (datapath, srcRow, index, colList)
    {
        //find Root Object
        var rootobj = this._getRootObjectByPath(datapath);
        if (!rootobj)
            return false;
        var destRow  = {};
        function __insertRowData_loopFn(i)
        {
            var dpath = this._getPath(colList[i]._datapath);
            destRow[dpath] = srcRow[i];
        }
        var cnt = srcRow.length < colList.length ? srcRow.length : colList.length;
        nexacro.__forLoop(this, 0, cnt, __insertRowData_loopFn);
        rootobj.splice(index, 0, destRow);
        return destRow;
    };
    */
    _pDataObject._deleteRowData = function (datapath, index)
    {
        //find Root Object
        var rootobj = this._getRootObjectByPath(datapath);
        if (!rootobj)
            return false;
        return rootobj.splice(index, 1)[0];
    };

    _pDataObject._deleteAllRowData = function (datapath)
    {
        //find Root Object
        var rootobj = this._getRootObjectByPath(datapath);
        if (!rootobj)
            return false;
        rootobj.length = 0;
    };

    _pDataObject._getPath = function (arr)
    {
        var first_char = arr[0];
        if (first_char == "@")
        {
            return arr[1];
        }
        else if (first_char == "$")
        {
            //Todo
        }
    };

    _pDataObject._getRootObjectByPath = function (datapath)
    {
        var data = this._p_data;
        var ret;
        if (data)
        {
            datapath = datapath.slice(0, datapath.lastIndexOf("["));
            var arr_datapath = datapath.match(/[^\]\[.]+/g);
            var ret = data;
            if (arr_datapath.length > 1)
            {
                //Todo           
                for (var i = 1, len = arr_datapath.length; i < len; i++)
                {
                    ret = ret[arr_datapath[i]];
                }
                return ret;// ? ret : "";
            }
        }

        return ret;
    };

    _pDataObject._setValueInKey = function (target, key, value)
    {
        var arr_datapath = key.match(/[^\]\[.]+/g);
        if (arr_datapath.length > 0)
        {
            if (key.indexOf("@") > -1 || key.indexOf("$") > -1)
            {
                var temp_target = [];
                for (var i = 1, len = arr_datapath.length; i < len; i++)
                {
                    if (i == len - 1)
                    {
                        if (arr_datapath.length > 2)
                            target[arr_datapath[i - 1]][arr_datapath[i]] = value;
                        else
                            target[arr_datapath[i]] = value;
                    }
                    else
                    {
                        temp_target = target[arr_datapath[i]];
                        if (!temp_target)
                        {
                            target[arr_datapath[i]] = {};
                            temp_target = target = target[arr_datapath[i]];
                        }
                    }
                }
            }
            else
            {
                for (var i = 0, len = arr_datapath.length; i < len; i++)
                {
                    if (i == len - 1)
                        target[arr_datapath[i]] = value;
                    else
                        target = target[arr_datapath[i]];
                }
            }
        }
        else
        {
            target[key] = value;
        }
    };
    _pDataObject._setPathValue = function (path, value)
    {
        var _data = this._p_data;
        if (_data)
        {
            var arr_datapath = path.match(/[^\]\[.]+/g);
            for (var i = 1; i < arr_datapath.length - 1; i++)
            {
                _data = _data[arr_datapath[i]];
            }
            if (_data)
                _data[arr_datapath[i]] = value;
        }
    };

    _pDataObject._addbindDataset = function ()
    {
        this._bindcount++;
    };

    _pDataObject._removeBindDataset = function ()
    {
        this._bindcount--;
    };

    _pDataObject = null;


    //==============================================================================
    // nexacro.TransactionItem : CommunicationItem 상속
    //==============================================================================
    nexacro.RESTAPIItem = function (path, context, svcid, method, outDataobject, argsJSONParam, datatype, async, last_modified, version)
    {
        nexacro._CommunicationItem.call(this, path, this.type, false, last_modified, version); //"data"type -> this.type

        this.context = context;
        this.method = method;
        this.svcid = svcid;
        //this.inputDatasets = this._parseDSParam(inDatasetsParam);
        //this.outputDatasets = this._parseDSParam(outDatasetsParam);
        this.outputdataobj = this._parseDOParam(outDataobject);//this._parseDSParam(outDataobjectsParam);
        //this.header = header;
        this.JSONParm = argsJSONParam;
        this._parseJSONParam(); //header, parameters, sync, postdata 
        // this.parameters = this._parseVarParam(argsJSONParam);
        this.datatype = (!datatype ? 0 : datatype); // datatype => 0:XML, 1:Binary(Runtime only), 2:SSV

        this._sendData = this._serializeData();

        const env = nexacro.getEnvironment();
        this._usewaitcursor = async && (env && env._p_usewaitcursor);
        this._remain_data = null;

        this._progress_data = null;           // for processing firstrow
        this._is_unknowntype_data = false;
        this._recieved_data = null;
        this._async_progress_timer_id = null;

        //this._has_firstcount_dataset = this._hasFirstCountDs();

        this._check_responseXML = false; // do not read responseXML.

        var hascookie = nexacro._hasCookieVariables();
        /*
        if (hascookie == false && !this.parameters && !this.inputDatasets)
            this._http_method = "GET";
        else
            this._http_method = "POST";
        */
    };
    var _pRESTAPIItem = nexacro._createPrototype(nexacro.TransactionItem, nexacro.RESTAPIItem);
    nexacro.RESTAPIItem.prototype = _pRESTAPIItem;

    _pRESTAPIItem.handle = null;
    _pRESTAPIItem.callbackList = [];
    _pRESTAPIItem.type = "dataobject";
    _pRESTAPIItem.bcache = false;

    _pRESTAPIItem._type_name = "RESTAPIItem";

    _pRESTAPIItem.on_load_dataobject = function (data, cookie, last_modified, response_header, status)
    {
        var dataobject = this.outputdataobj;
        var errorinfo;
        var bcache = this.bcache;
        var ret = null;
        var jsonobj = null;

        //dataobject.parent.t1 = Date.now();
        this._addCookieToCookieVariable(cookie);

        if (data && data._type_name == "DataObjectCache")
        {
            bcache = false;
            ret = data._loadDataObject(this);
            errorinfo = ret[0];
            //var _dataobject = ret[1];
            data = ret[2];
            jsonobj = ret[3];

        }
        else
        {
            if (dataobject)
                dataobject._addResponseInfo(data, response_header);

            if (data && this._protocol < 0)
                data = this.on_decrypt(data);

            ret = this._deserializeData(data);
            if (bcache)
            {
                dataobject = ret[1];
            }

            errorinfo = ret[0];
            jsonobj = ret[2];
        }

        if (bcache)
        {
            var d_cache = nexacro._DataObjectCacheList[this.path];
            if (!d_cache)
            {
                nexacro._DataObjectCacheList[this.path] = new nexacro._DataObjectCache(dataobject, last_modified, this.version, data, response_header);
            }
            else
            {
                d_cache.dataobject = dataobject;
                d_cache.last_modified = last_modified ? last_modified : "";
                d_cache.version = this.version;
                d_cache.data = data;
            }
        }

        if (this._usewaitcursor)
        {
            this._hideWaitCursor(this.context);
        }

        nexacro._removeCommContext(this.context);


        const root = this.context._getRootObject()
        if (root)
        {
            root.on_fire_oncommunication(root, 1);
        }

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            var errorcode = errorinfo ? errorinfo[0] : 0;
            var errormsg = errorinfo ? errorinfo[1] : "SUCCESS";

            var loadmanager = this.context._load_manager;
            var dataitem = loadmanager ? loadmanager.getDataItem(this.svcid) : null;
            if (dataitem)
            {
                dataitem._is_cancel = undefined;
            }

            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive != false)
                {
                    if (this._is_unknowntype_data)
                    {
                        item.callback.call(target, this.svcid, errorcode, errormsg, "comm_fail_loaddetail", 10599, this.path, this.path);
                    }
                    else
                    {
                        item.callback.call(target, this.svcid, errorcode, data);
                    }
                }
            }
            callbackList.splice(0, n);
        }

        var method = this.method;
        if (dataobject)
        {
            if (method)
                dataobject._on_success(data, this.svcid, this.path, jsonobj, method, status);
            else
                dataobject._setContents(jsonobj, 0, this.path);

            dataobject._clearResponseInfo();
        }

        this.handle = null;
    };

    _pRESTAPIItem._parseDOParam = function (outdataobj)
    {
        var obj;
        if (outdataobj)
        {
            if (typeof outdataobj == "object")
                obj = outdataobj;
            else if (this.context)
                obj = this.context[outdataobj];
        }
        return obj;
    };

    _pRESTAPIItem._parseJSONParam = function ()
    {
        //this.autoapply = this.method != "HEAD" ? true : false; //default value 수정
        var jsonparam = this.JSONParm;
        if (!jsonparam)
            return;

        //if (jsonparam.sync)
        //    this.sync = true;

        //if (jsonparam.postdata)
        //    this.parameter = this._parseVarParam(jsonparam.postdata);

        if (jsonparam.postdata)
            this.postdata = jsonparam.postdata;

        if (jsonparam.httpheader)
            this.header = jsonparam.httpheader;
    }


    _pRESTAPIItem._deserializeData = function (strRecvData)
    {
        if (!strRecvData)
        {
            return [[-1, "Stream Data is null!"], [], new nexacro.Collection()];
        }
        if (strRecvData.charAt(0) == " ")
            strRecvData = strRecvData.trim();

        return this.__deserializeJSON(strRecvData);
    };

    _pRESTAPIItem._loadFromDataObject = function (data, dataobject)
    {
        var ret = this._deserializeData(data);
        var errorcode = 0;
        var errormsg = "SUCCESS";
        var bcache = this.bcache;
        var last_modified = this.last_modified;

        var errorinfo = ret[0];
        if (errorinfo)
        {
            errorcode = errorinfo[0];
            errormsg = errorinfo[1];
        }

        if (bcache)
        {
            //var parameters = ret[1];
            dataobject = ret[1];
            var d_cache = nexacro._DataObjectCacheList[this.path];
            if (!d_cache)
            {
                nexacro._DataObjectCacheList[this.path] = new nexacro._DataObjectCache(dataobject, last_modified, this.version);
            }
            else
            {
                //d_cache.parameters = parameters;
                d_cache.dataobject = dataobject;
                d_cache.last_modified = last_modified ? last_modified : "";
                d_cache.version = this.version;
            }
        }

        var jsonobj = ret[2];

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive != false)
                {
                    item.callback.call(target, this.svcid, errorcode, errormsg);
                }
            }
            callbackList.splice(0, n);
        }

        var method = this.method;
        if (dataobject)
        {
            if (method)
                dataobject._on_success(data, this.svcid, this.path, jsonobj, method);
            else
                dataobject._setContents(jsonobj, 0, this.path);
            dataobject._clearResponseInfo();

        }

        this.handle = null;
    };


    _pRESTAPIItem.__deserializeJSON = function (strRecvData, doc)
    {
        var code = 0;
        var message = "SUCCESS";
        var dataobbj = this.outputdataobj ? this.outputdataobj : null;
        var json;

        if (strRecvData.length > 0)
        {
            try
            {
                json = JSON.parse(strRecvData);
            }
            catch (e)
            {
                this._is_unknowntype_data = true;
                return [[-1, "invalid nexacro communication format"], dataobbj];
            }
        }
        var errorinfo = [code, message];
        return [errorinfo, dataobbj, json];
    };


    _pRESTAPIItem.on_error = function (errstatus, fireerrorcode, returncode, locationurl, extramsg, response, responseheaders)
    {
        // cancel을 하게 되면 ajax.abort를 하기 전에 application.onerror를 fire해서 return값을 얻어온다.
        var dataobj = this.outputdataobj;
        if (this._usewaitcursor)
        {
            this._hideWaitCursor(this.context);
        }

        var callbackList = this.callbackList;
        var n = callbackList.length;
        var ret = false;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive != false)
                {
                    ret = item.callback.call(target, this.svcid, -1, "FAILED", fireerrorcode, returncode, this.path, locationurl, extramsg, dataobj, response, responseheaders);
                    if (ret)
                    {
                        if (this._usewaitcursor)
                        {
                            this._showWaitCursor(this.context);
                        }
                        continue;
                    }
                }
            }

            if (ret) return true;
        }

        var loadmanager = this.context._load_manager;
        var dataitem = loadmanager ? loadmanager.getDataItem(this.svcid) : null;
        //var dataitem_handle = dataitem ? dataitem.handle : null;

        // cancel로 들어올때는 dataitem이 null인상태임.

        if (dataitem && !dataitem._is_cancel) return;

        callbackList.splice(0, n);

        nexacro._removeCommContext(this.context);

        //if (dataitem_handle && dataitem_handle._user_aborted)

        const root = this.context._getRootObject();
        if (root)
        {
            root.on_fire_oncommunication(root, 1);
        }

        this.handle = null;
    };

    _pRESTAPIItem = null;
}
