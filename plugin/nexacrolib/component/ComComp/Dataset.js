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

if (!nexacro.Dataset) 
{
    //==============================================================================
    // nexacro.Dataset	
    //==============================================================================
    nexacro.Dataset = function (id, parent) 
    {
        nexacro.DatasetBase.call(this, id, parent);

        this._p_url = "";
        this._p_arguments = "";
        this._p_serverdatasetid = "";
        this._p_firefirstcount = 0;
        this._p_firenextcount = 0;
        this._p_progressload = false;
        this._p_preload = false;

        // ----------------- internal variable ------------------ // 
        this._is_preloaded = false;
        this._is_created = false;
    };

    var _pDataset = nexacro._createPrototype(nexacro.DatasetBase, nexacro.Dataset);
    nexacro.Dataset.prototype = _pDataset;

    // Dataset Event Reasons
    nexacro.Dataset.ROWTYPE_EMPTY = 0; //존재하지 않는 Row 상태
    nexacro.Dataset.ROWTYPE_NORMAL = 1; //초기 Row 상태
    nexacro.Dataset.ROWTYPE_INSERT = 2; //추가된 Row 상태
    nexacro.Dataset.ROWTYPE_UPDATE = 4; //수정된 Row 상태
    nexacro.Dataset.ROWTYPE_DELETE = 8; //삭제된 Row 상태
    nexacro.Dataset.ROWTYPE_GROUP = 16; //Group 정보 Row 상태
    // [TODO] Nexacro K용 Metainfo/Manual 작업
    nexacro.Dataset.ROWTYPE_GROUPHEADER = 32; //Group Header Row 상태

    nexacro.Dataset.REASON_LOAD = 0; //Dataset의 Load가 완료되었을 때
    nexacro.Dataset.REASON_LOADPROCESS = 1; //Dataset을 Loading 중일 때 
    nexacro.Dataset.REASON_RESET = 2; //Dataset의 변경사항을 무시하고 이전상태로 Reset되었을 때
    nexacro.Dataset.REASON_LOADCONTENT = 3; //ADL 또는 FDL에 정의된 Dataset의 Load가 완료되었을 때. Form의 onload() 이벤트보다 먼저 발생합니다.

    nexacro.Dataset.REASON_ASSIGN = 10; //Dataset이 Assign 되었을 때
    nexacro.Dataset.REASON_COPY = 11; //Dataset이 복사되었을 때
    nexacro.Dataset.REASON_APPEND = 12; //Dataset이 추가되었을 때
    nexacro.Dataset.REASON_MERGE = 13; //Dataset이 통합되었을 때
    nexacro.Dataset.REASON_DELETE = 20; //Dataset의 Row가 삭제되었을 때
    nexacro.Dataset.REASON_DELETEALL = 22; //Dataset의 모든 Row가 삭제되었을 때
    nexacro.Dataset.REASON_CLEARDATA = 23; //Dataset의 모든 Row가 완전 삭제되었을 때
    nexacro.Dataset.REASON_CLEAR = 24; //Dataset의 모든 Column 및 Row가 완전히 삭제되었을 때
    nexacro.Dataset.REASON_SORTGROUP = 30; //Dataset의 데이터가 정렬 또는 그룹화 되었을 때
    nexacro.Dataset.REASON_FILTER = 31; //Dataset의 데이터가 Filter 되었을 때
    nexacro.Dataset.REASON_MOVE = 32; //Dataset의 Row가 다른 위치로 이동되었을 때
    nexacro.Dataset.REASON_EXCHANGE = 33; //Dataset의 두 Row가 서로 위치가 바뀌었을 때
    nexacro.Dataset.REASON_CHANGELAYOUT = 34; //Dataset의 Column 정보가 변경되었을 때
    nexacro.Dataset.REASON_CHANGESTATUS = 40; //Dataset의 Row 상태(Type, Select)이 변경되었을 때
    nexacro.Dataset.REASON_ENABLEEVENT = 41; //Dataset의 enableevent 속성이 'true'가 되었을 때
    nexacro.Dataset.REASON_CHANGEDATAOBJECT = 43; //Dataset의 데이터가 DataObject로부터 변경되었을 때

    nexacro.Dataset.REASON_ROWCHANGE = 51; //Dataset의 row object, index가 함께 변경된 경우
    nexacro.Dataset.REASON_ROWINDEXCHANGE = 52; //Dataset의 row object는 변경없고, index만 변경된 경우
    nexacro.Dataset.REASON_ROWOBJECTCHANGE = 53; //Dataset의 row object가 변경되고, index는 변경없는 경우;

    nexacro.Dataset.REASON_BINDSOURCE = 90; //Dataset을 Bind 했을 때 

    nexacro.Dataset.REASON_BINDDATAOBJECT_UPDATE = 70; //Dataset의 DataObject에 대한 정보가 업데이트 되었을 때

    _pDataset.on_created = function () 
    {
        if (this.binddataobject && !this._binddataobject)
        {
            this._binddataobject = this._findDataObject(this.binddataobject);
            this._loadDataObject(false);
        }

        if (this._p_url == "" || this._p_preload == false)
        {
            if (this._p_colcount > 0) 
            {
                this._endLoad(0, "SUCCESS", 3);	// 3 == REASON_LOADCONTENT
            }
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
                    var data = loadmanager.getPreloadDataModule(this.id);
                    if (data)
                    {
                        var serverdatasetid = this._p_serverdatasetid;
                        if (!serverdatasetid)
                        {
                            serverdatasetid = "output";
                        }
                        var outds = this.id + "=" + serverdatasetid;
                        var tritem = new nexacro.TransactionItem(url, this._p_parent, svcid, "", outds, "", 0, true);
                        tritem._usewaitcursor = false;
                        tritem._loadFromData(data);
                        this._is_preloaded = true;
                    }
                }
            }
        }

        if (!this._is_created)
        {
            this._defaultKeyStr = this._p_keystring;
            this._defaultFilterStr = this._p_filterstr;
        }
        this._is_created = true;

    };

    _pDataset.destroy = function ()
    {
        nexacro.DatasetBase.prototype.destroy.call(this);
        this._refform = null;
    };


    _pDataset.set_url = function (v) 
    {
        this._p_url = v;
    };

    _pDataset.set_arguments = function (v)
    {
        this._p_arguments = v;
    };

    _pDataset.set_firefirstcount = function (v)
    {
        v = parseInt(v) | 0;
        if (isFinite(v))
            this.firefirstcount = v;
    };

    _pDataset.set_firenextcount = function (v)
    {
        v = parseInt(v) | 0;
        if (isFinite(v))
            this.firenextcount = v;
    };

    _pDataset.set_progressload = function (v)
    {
        this._p_progressload = nexacro._toBoolean(v);
    };

    _pDataset.set_preload = function (v) 
    {
        this._p_preload = nexacro._toBoolean(v);
    };
    _pDataset.set_serverdatasetid = function (v) 
    {
        this._p_serverdatasetid = v;
    };

    _pDataset._getRowcount = function ()
    {
        return this._p_rowcount;
    };

    _pDataset.on_notify_onload_dataobject = function (/*dataobj, reason*/)
    {
        this._loadDataObject(true, 0);
    };

    _pDataset.on_notify_onvaluechanged_dataobject = function (dataobject, evtinfo)
    {
        if (this._p_dataobjectbindmode == "twoway")
        {
            var datapath = evtinfo.dataobjectpath;
            var updatedsid = evtinfo.sourcedatasetid;
            if (updatedsid == this.id)// && evtinfo.reason != 16) //need to modify
                return;

            if (this._isUpdatedBinddata(datapath) == false) //also need to modify
            {
                return;
            }
            var idx = evtinfo.index;
            var value = evtinfo.value;
            var colid = this._getColIDFromDataobjectkey(evtinfo.key);
            this._is_data_updating = true;
            if (idx == -1)// || this.filterstr) //reload
            {
                this.loadFromDataObject();
            }
            else
            {
                var colinfo = this._p_colinfos[colid];
                if (colinfo)
                {
                    var rowRow = this.__getParsedRow(this._rawRecords[idx]);
                    if (rowRow)
                        this._setColumn(idx, rowRow, colinfo, value);
                }
            }
            this._is_data_updating = false;
        }
    };

    _pDataset._getColIDFromDataobjectkey = function (key)
    {
        var colist = this._p_colinfos;
        if (key)
        {
            var datapathkey = "@." + key;
            for (var i = 0, len = colist.length; i < len; i++)
            {
                var col = colist[i];
                var datapath = col._p_datapath;
                if (datapath)
                {
                    if (datapath[0] == "$" && (("@." + datapath) == datapathkey))
                    {
                        //Todo..
                        return col.id;
                    }
                    else if (datapath == datapathkey)
                    {
                        return col.id;
                    }
                }
            }
        }
    };

    _pDataset.on_notify_ondatachanged_dataobject = function (dataobject, evtinfo)
    {
        //var datapath = evtinfo.dataobjectpath;
        //if (updatedsid == this.id) //need to modify
        //    return; //loop
        if (this._p_dataobjectbindmode == "twoway")
        {
            var bFireevent = false;
            var bReload = false;
            var datasetid = this.id;
            this._is_data_updating = true;
            var infoarray = evtinfo.infoarray;
            if (infoarray)
            {
                for (var i = 0, len = infoarray.length; i < len; i++)
                {
                    var item = infoarray[i];
                    var dataobjectpath = item.dataobjectpath;
                    var srcdsid = item.sourcedatasetid;
                    var index = item.index;
                    if (index == -1)
                    {
                        bReload = true;
                        break;
                    }

                    if (srcdsid == datasetid)
                        continue;
                    if (this._isUpdatedBinddata(dataobjectpath) == false) //also need to modify
                    {
                        continue;
                    }
                    var type = item.type;
                    var data = item.data;

                    if (type == "update")
                    {
                        if (data)
                        {
                            var orgRow = this._rawRecords[index];
                            this._copyDataObjectRowData(this._rawRecords[index], data);
                            this._rawRecords[index]._orgrow = orgRow;
                            this._rawRecords[index]._rtype = 4;
                        }
                    }
                    else if (type == "add")
                    {
                        var rawRecords = this._rawRecords;
                        var viewRecords = this._viewRecords;

                        var idx = rawRecords.length;
                        var rowRow = [];
                        rowRow._rawidx = idx;
                        rowRow._rtype = (this._p_updatecontrol ? 2 : 1);
                        rowRow._level = 0;

                        if (viewRecords != rawRecords)
                        {
                            viewRecords[viewRecords.length] = rowRow;
                        }

                        rawRecords[idx] = rowRow;
                        this._p_rowcount = viewRecords.length;

                        ///this.addRow();
                        if (data)
                            this._addDataObjectRowData(this._rawRecords[idx], data);
                    }
                    else if (type == "insert")
                    {
                        // rawRecords Add
                        // viewRecords Insert
                        var viewRecords = this._viewRecords;
                        var rawRecords = this._rawRecords;

                        //if (index >= viewRecords.length)
                        //    this._appendRow();

                        var rowRow = [];
                        rowRow._rawidx = index;//rawRecords.length;
                        rowRow._rtype = (this._p_updatecontrol ? 2 : 1);
                        rowRow._level = 0;
                        var rawidx;
                        // direct control
                        if (viewRecords == rawRecords)
                        {
                            //not indexed
                            rawRecords.splice(index, 0, rowRow);
                            this._adjustRawIdx(index, rawRecords.length);
                        }
                        else
                        {
                            // indexed
                            rawidx = viewRecords[index]._rawidx;
                            viewRecords.splice(index, 0, rowRow);
                            rawRecords.splice(rawidx, 0, rowRow);
                            this._adjustRawIdx(rawidx, rawRecords.length);
                        }
                        this._p_rowcount = viewRecords.length;
                        if (data)
                            this._addDataObjectRowData(this._rawRecords[index], data);
                    }
                    else if (type == "delete")
                    {
                        //this.deleteRow(index);
                        this._deleteRow(index);
                    }
                    bFireevent = true;
                }
                if (bReload)
                {
                    this.loadFromDataObject();
                }
                else if (bFireevent)
                {
                    var oldpos = this._p_rowposition;
                    this.on_fire_onrowsetchanged(-1, "SUCCESS", 43);
                    var setpos = this._p_rowposition;
                    if (type == "delete" && oldpos == this._p_rowposition)
                    {
                        if (setpos == index)
                        {
                            if (this._p_rowcount == 0)
                            {
                                this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                            }
                            else
                            {
                                if (setpos == this._p_rowcount)
                                {
                                    this._forcesetRowPosition(this._p_rowcount - 1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                                }
                                else
                                {
                                    this._setRowPosition(setpos, 53, true);// nexacro.Dataset.REASON_ROWOBJECTCHANGE
                                }
                            }
                        }
                        else if (setpos > index)
                        {
                            this._setRowPosition(setpos - 1, 51);
                        }
                    }
                    else if (type != "update")
                        this._setRowPosition(index, oldpos == index ? 53 : 51, true);
                }

            }
            this._is_data_updating = false;
            //test code for filter
            //        this._reFilter();
            // this._resetSortGroup();
        }
    };

    _pDataset._isUpdatedBinddata = function (changeddatapath) 
    {
        var ret = false;
        var datapath = this._p_dataobjectpath;
        if (datapath == changeddatapath || datapath.indexOf(changeddatapath) > -1)
            ret = true;
        return ret;
    };

    _pDataset._copyDataObjectRowData = function (destRow, srcRow)
    {
        var colList = this._p_colinfos;
        function __copyRowData_loopFn(i)
        {
            var dpath = this._getPath(colList[i]._datapath);
            if (srcRow[dpath] !== undefined)
            {
                if (typeof srcRow[dpath] == "object") // array
                {
                    for (var j = 0; j < srcRow[dpath].length; j++) 
                    {
                        destRow[i] = srcRow[dpath][j];
                        i++;
                    }
                }
                else
                {
                    destRow[i] = srcRow[dpath];
                }
            }
        }
        var cnt = Object.keys(srcRow).length < colList.length ? Object.keys(srcRow).length : colList.length;
        nexacro.__forLoop(this, 0, cnt, __copyRowData_loopFn);
    };

    _pDataset._addDataObjectRowData = function (destRow, srcRow)
    {
        var colList = this._p_colinfos;
        function __copyRowData_loopFn(i)
        {
            var dpath = this._getPath(colList[i]._datapath);
            destRow[i] = srcRow[dpath];
        }
        var cnt = srcRow.length < colList.length ? srcRow.length : colList.length;
        nexacro.__forLoop(this, 0, cnt, __copyRowData_loopFn);
    };

    _pDataset._getPath = function (arr)
    {
        if (!arr)
            return;

        var first_char = arr[0];
        if (first_char == "@")
        {
            return arr[1];
        }
        else if (first_char == "$")
        {
            //Todo
            return arr[1];
        }
    };

    _pDataset._getPathFromColinfo = function (colinfo)
    {
        var datapath;
        if (!colinfo || !colinfo._p_datapath)
            return;
        var arr_datapath = colinfo._datapath;
        if (!arr_datapath)
            arr_datapath = colinfo._datapath = colinfo._p_datapath.match(/[^\]\[.]+/g);
        var first_char = arr_datapath[0];
        if (first_char == "@")
        {
            var len = arr_datapath.length;
            if (len == 2)
                datapath = arr_datapath[1];
            else if (len > 2)
            {
                datapath = "";
                for (var i = 1; i < len; i++)
                {
                    if (i == 1)
                        datapath += arr_datapath[i];
                    else
                        datapath += '[' + arr_datapath[i] + ']';
                }
            }
        }
        else if (first_char == "$")
        {
            datapath = colinfo._p_datapath;
        }
        return datapath;
    };

    _pDataset.set_binddataobject = function (str)
    {
        if (str != this._p_binddataobject)
        {
            var prev_binddataobject = this._binddataobject;
            if (prev_binddataobject)
            {
                prev_binddataobject._removeEventHandler("onload", this.on_notify_onload_dataobject, this);
                prev_binddataobject._removeBindDataset();
            }
            if (!str)
            {
                this._binddataobject = null;
                this._p_binddataobject = "";
            }
            else
            {
                var binddataobject = this._binddataobject = this._findDataObject(str);
                if (binddataobject)
                {
                    binddataobject._setEventHandler("onload", this.on_notify_onload_dataobject, this);
                    binddataobject._setEventHandler("ondatachanged", this.on_notify_ondatachanged_dataobject, this);
                    binddataobject._setEventHandler("onvaluechanged", this.on_notify_onvaluechanged_dataobject, this);
                }
                this._p_binddataobject = str;
            }
            this.on_apply_binddataobject();
        }
        return this._p_binddataobject;
    };

    _pDataset.on_apply_binddataobject = function ()
    {
        if (this._is_created)
            this._loadDataObject(true, 3);
        if (this._binddataobject)
            this._binddataobject._addbindDataset();
    };
    /*
    _pDataset._on_apply_binddataobject = function ()
    {
        binddataobject = this._binddataobject = this._findDataObject(this.binddataobject);
        if (binddataobject)
        {
            binddataobject._setEventHandler("onload", this.on_notify_onload_dataobject, this);
            binddataobject._setEventHandler("ondatachanged", this.on_notify_ondatachanged_dataobject, this);
            binddataobject._setEventHandler("onvaluechanged", this.on_notify_onvaluechanged_dataobject, this);
        }
    };
    */
    _pDataset.set_dataobjectpath = function (v)
    {
        this._p_dataobjectpath = v;
        this.on_apply_dataobjectpath();
    };

    _pDataset.on_apply_dataobjectpath = function (v)
    {
        var dataobject = this._binddataobject;
        if (this._is_created && dataobject)
        {
            this._loadDataObject(true, 3);
        }
    };

    _pDataset.set_dataobjectbindmode = function (v)
    {
        this._p_dataobjectbindmode = v;
    };

    _pDataset.load = function (async, datatype) 
    {
        var baseurl;
        if (this._refform)
        {
            baseurl = this._refform._getRefFormBaseUrl();
        }
        var url = nexacro._getServiceLocation(this._p_url, baseurl);

        if (url.length && this._p_parent)
        {
            var svcid = "__normaldataset_loadurl_" + this.id;
            var loadmanager = this._p_parent._load_manager;
            if (loadmanager)
            {
                var serverdatasetid = this._p_serverdatasetid;
                if (!serverdatasetid)
                {
                    serverdatasetid = "output";
                }
                var outds = this.id + "=" + serverdatasetid;
                var service = nexacro._getServiceObject(this._p_url, true);
                loadmanager.loadDataModule(url, svcid, "", outds, this._p_arguments, null, async, datatype, false, service);
            }
        }
        else
        {
            this._endLoad(-1, "empty url", 3);	// 3 == REASON_LOADCONTENT
        }
    };


    _pDataset.append = function (url)
    {
        this._append(url, true, 0); // async = true, datatype = XML
    };

    _pDataset._append = function (svcurl, async, datatype)
    {
        var baseurl;
        if (this._refform)
        {
            baseurl = this._refform._getRefFormBaseUrl();
        }

        var serviceurl = svcurl ? svcurl : this._p_url;

        if (!serviceurl)
        {
            this._endLoad(-1, "empty url", 0);	// 3 == REASON_LOAD
            return;
        }

        var url = nexacro._getServiceLocation(serviceurl, baseurl);
        if (url && url.length && this._p_parent)
        {
            var svcid = "__normaldataset_appendurl_" + this.id;
            var loadmanager = this._p_parent._load_manager;
            if (loadmanager)
            {
                var serverdatasetid = this._p_serverdatasetid;
                if (!serverdatasetid)
                {
                    serverdatasetid = "output";
                }
                var outds = this.id + "=" + serverdatasetid + ":P";
                var service = nexacro._getServiceObject(url, true);

                loadmanager.loadDataModule(url, svcid, "", outds, this._p_arguments, null, async, datatype, false, service);
            }
        }
        else
        {
            this._endLoad(-1, "empty url", 0);	// 3 == REASON_LOAD
        }
    };

    _pDataset.on_preload_data = function (url, errstatus, data, fireerrorcode, returncode, requesturi, locationuri, extramsg)
    {
        if (errstatus != 0)
        {
            nexacro._onHttpSystemError(this, true, this, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
        }
        else if (data && !this._is_preloaded)
        {
            var keys = [];
            keys.push("__preload");
            keys.push(this._p_url);
            keys.push(this.id);
            keys.push(this._p_serverdatasetid);
            var svcid = keys.join('_');

            var serverdatasetid = this._p_serverdatasetid;
            if (!serverdatasetid)
            {
                serverdatasetid = "output";
            }
            var outds = this.id + "=" + serverdatasetid;
            var tritem = new nexacro.TransactionItem(this._p_url, this._p_parent, svcid, "", outds, "", 0, true);
            tritem._usewaitcursor = false;
            tritem._loadFromData(data);
            this._is_preloaded = true;
        }
    };

    _pDataset._findDataObject = function (id)
    {
        if (id && id.length > 0)
        {
            var dataobj;
            var parent = this._p_parent;
            if (parent)
            {
                dataobj = parent[id];
                if (dataobj && (dataobj._type_name == "DataObject"))
                {
                    return dataobj;
                }
            }

            if (this._refform)
            {
                dataobj = this._refform.lookup(id);
                if (dataobj && (dataobj._type_name == "DataObject"))
                {
                    return dataobj;
                }
            }
        }
        return undefined;
    };

    _pDataset._loadDataObject = function (fireevent, reason)
    {
        var data = null;
        var binddataobject = this._p_binddataobject;
        var _binddataobject = this._binddataobject;

        if (binddataobject && !_binddataobject)
            _binddataobject = this._binddataobject = this._findDataObject(binddataobject);

        if (_binddataobject)
        {
            data = _binddataobject._p_data;
        }

        if (this._p_parent._is_created)
            this._is_created = true;

        this._loadFromJSONObject(data);

        if (fireevent !== false && this._is_created)
        {
            this._bWorkingstatus = true;

            this._reFilter();
            this._resetSortGroup();

            if (this._eventstat)
            {
                this.on_fire_onload(0, "SUCCESS", reason ? reason : 0);

                if (this._viewRecords && this._viewRecords.length > 0)
                {
                    this._forcesetRowPosition(0, 51);
                }
                else
                {
                    this._forcesetRowPosition(-1, 51);
                }
            }
            else if (this._viewRecords && this._viewRecords.length > 0)
            {
                this._p_rowposition = 0;
            }

            this._bWorkingstatus = false;
        }

        if (reason == 0 || reason == 3)
        {
            var view = nexacro.Component.prototype._getRootComponent.call(this, this._p_parent);
            if (view && view._is_view)
            {
                if (this._p_name == view._p_viewdataset)
                {
                    // 반드시 view여야만 함.
                    var form = view._p_parent;
                    // view의 parent는 무조건 form이다
                    var manager = form._trigger_manager;
                    var triggertype = "";
                    var triggerview = view._ismodeltrigger ? view : form;
                    var triggerobj = view.getViewDataset();

                    triggertype = "Model Load Success";
                    manager._notifyTrigger(triggertype, triggerobj, triggerview);
                }
            }
        }
    };
    _pDataset._properties = [{ name: "arguments" }, { name: "binddataobject" }, { name: "colcount", readonly: true },
    { name: "colinfos", readonly: true }, { name: "collation" }, { name: "constcount", readonly: true },
    { name: "dataobjectbindmode" }, { name: "dataobjectpath" }, { name: "enableevent" },
    { name: "filterstr" }, { name: "keystring" }, { name: "loadfiltermode" },
    { name: "loadkeymode" }, { name: "name" }, { name: "preload" },
    { name: "progressload" }, { name: "reversesubsum" }, { name: "rowcount", readonly: true },
    { name: "rowposition" }, { name: "saveinfinity" }, { name: "saveinvaliddate" },
    { name: "savenan" }, { name: "serverdatasetid" }, { name: "updatecontrol" },
    { name: "url" }, { name: "useclientlayout" }
    ];
    nexacro._defineProperties(_pDataset, _pDataset._properties);
    _pDataset = null;

    nexacro.NormalDataset = nexacro.Dataset;
    //delete _pDataset;
}
