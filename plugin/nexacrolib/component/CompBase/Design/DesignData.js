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
if (nexacro.DatasetBase)
{
    var _pDatasetBase = nexacro.DatasetBase.prototype;


    _pDatasetBase._p_updatecontrol = false;
    _pDatasetBase._design_updatecontrol = true;
    _pDatasetBase.design_set_updatecontrol = function (v)
    {
        this._design_updatecontrol = nexacro._toBoolean(v);
    };

    _pDatasetBase.design_get_updatecontrol = function ()
    {
        return this._design_updatecontrol;
    };

    _pDatasetBase._setContents = function (contents)
    {
        if (contents)
        {
            if (typeof contents == "string" && contents.length)
            {
                this._loadFromXMLStr(contents, undefined, undefined, undefined, true);
            }
            else
            {
                this._loadFromJSONObj(contents, true);
            }
            this._p_rowposition = -1;
        }
        //need to check
        var binddataobject = this._p_binddataobject;
        if (binddataobject)
        {
            if (!this._binddataobject)
                this._binddataobject = this._findDataObject(binddataobject);
            this._loadDataObject();
        }

        this.updateSortGroup();

        if (this._p_colcount > 0)
        {
            this._endLoad(0, "SUCCESS", 3);	// 3 == REASON_LOADCONTENT
        }
    };

    //insertcolumn 후 row data 정리 
    _pDatasetBase._adjustRowinsertColumn = function (idx)
    {
        var viewRecords = this._viewRecords;
        var rawRecords = this._rawRecords;

        if (viewRecords != rawRecords)
        {
            viewRecords = this._viewRecords = rawRecords.slice(0, rawRecords.length);
        }

        var start = 0;
        var end = viewRecords.length;
        function __adjustRow_loopFn(i)
        {
            var rowData = this.__getParsedRow(viewRecords[i]);
            if (rowData)
            {
                rowData.splice(idx, 0, undefined);
            }
        }
        nexacro.__forLoop(this, 0, end, __adjustRow_loopFn);

        var bfilter = (this._p_filterstr == null || this._p_filterstr == "") ? false : true;
        var bsortgroup = (this._p_keystring == "" || this._p_keystring == "S:" || this._p_keystring == "G:") ? false : true;
        if (bfilter)
            this._reFilter();
        if (bsortgroup)
            this._resetSortGroup();

        if (this._eventstat)
        {
            this.on_fire_onrowsetchanged(-1, -1, 34); //nexacro.Dataset.REASON_CHANGELAYOUT
            var evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", this._p_rowposition, -1, -1, "", undefined, undefined);
            this.on_fire_onvaluechanged(evt);
        }
    };

    _pDatasetBase._updateColType = function (idx, type)
    {
        var colList = this._p_colinfos;
        var constList = this._constVars;
        var updated;
        var evt;

        idx = this.getColIndex(idx);
        if (idx < 0)
        {
            return -1;
        }
        else if (idx < colList.length)
        {
            updated = colList._updateType(idx, type);
            if (updated)
            {
                this._clearAllExprs();
                if (this._eventstat)
                {
                    this.on_fire_onrowsetchanged(-1, -1, 34); //nexacro.Dataset.REASON_CHANGELAYOUT
                    evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", this._p_rowposition, -1, -1, "", undefined, undefined);
                    this.on_fire_onvaluechanged(evt);
                }
                return idx;
            }
        }
        else
        {
            updated = constList._updateType(idx - colList.length, type);
            if (updated)
            {
                this._clearAllExprs();
                if (this._eventstat)
                {
                    this.on_fire_onrowsetchanged(-1, -1, 34); //nexacro.Dataset.REASON_CHANGELAYOUT
                    evt = new nexacro.DSColChangeEventInfo(this, "onvaluechanged", this._p_rowposition, -1, -1, "", undefined, undefined);
                    this.on_fire_onvaluechanged(evt);
                }
                return idx;
            }
        }
        return -1;
    };
    delete _pDataset;


    var _pDSColumnInfoList = nexacro.DSColumnInfoList.prototype;
    _pDSColumnInfoList._updateType = function (idx, type)
    {
        var colinfo = this[idx];
        var intype = nexacro._toString(type).toLowerCase();
        var ntype = nexacro.DataUtils._typeint[intype];
        if (colinfo && colinfo.ntype != ntype)
        {
            colinfo.set_type(type);
            return true;
        }
        return false;
    };
    delete _pDSColumnInfoList;

    var _pVariableList = nexacro.VariableList.prototype;
    _pVariableList._updateType = function (idx, type)
    {
        var varinfo = this[idx];
        var intype = nexacro._toString(type).toLowerCase();
        var ntype = nexacro.DataUtils._typeint[intype];
        if (varinfo && varinfo.ntype != ntype)
        {
            varinfo.type = type;
            varinfo.ntype = ntype;
            return true;
        }
        return false;
    };
    delete _pVariableList;
}