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

if (!nexacro.FileDialog)
{
    //==============================================================================
    // nexacro.FileDialogEventInfo
    //==============================================================================
    nexacro.FileDialogEventInfo = function (strEventId, strReason, strPath, arrVirtualfiles)
    {
        this.eventid = strEventId;												// 이벤트ID
        this.reason = strReason;												// 이벤트 발생분류 코드
        this.path = strPath;													// 선택한 디렉토리 경로
        this.virtualfiles = arrVirtualfiles;									// 선택한 파일(VirtualFile)의 Array
    };
    var _pFileDialogEventInfo = nexacro.FileDialogEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.FileDialogEventInfo);
    _pFileDialogEventInfo._type_name = "FileDialogEventInfo";

    //delete _pFileDialogEventInfo;
    _pFileDialogEventInfo = null;

    //==============================================================================
    // nexacro.FileDialog
    //==============================================================================
    nexacro.FileDialog = function (id, parent)
    {
        nexacro._EventSinkObject.call(this, id);
        this.EnvironmentPath = 1; // 내장 1, 외장 2 (안드로이드 런타임 전용)

        this._handle = nexacro._createFileDialogHandle(this);
    };

    var _pFileDialog = nexacro.FileDialog.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.FileDialog);
    _pFileDialog._type_name = "FileDialog";

    /* default properties */
    _pFileDialog._p_accept = "";
    _pFileDialog._p_defaultextension = true;
    _pFileDialog._p_dialogtype = undefined;
    _pFileDialog._p_filter = "";
    _pFileDialog._p_filterindex = 0;

    /* event list */
    _pFileDialog._event_list = {
        "onclose": 1
    };

    /* FileDialog Constant */
    nexacro.FileDialog.LOAD = 1;
    nexacro.FileDialog.SAVE = 2;
    nexacro.FileDialog.MULTILOAD = 3;
    nexacro.FileDialog.SELFOLDER = 4;

    //===============================================================
    // nexacro.FileDialog : Create & Destroy & Update
    //===============================================================
    _pFileDialog.destroy = function ()
    {
        nexacro._destroyFileDialogHandle(this);
        this._handle = null;

        return true;
    };

    //===============================================================
    // nexacro.FileDialog : Properties
    //===============================================================
    _pFileDialog.set_accept = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_accept != v)
        {
            this._p_accept = v;
            this.on_apply_accept();
        }
    };

    _pFileDialog.on_apply_accept = function ()
    {
        nexacro._setFileDialogHandleAccept(this, this._p_accept);
    };

    _pFileDialog.set_defaultextension = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_defaultextension != v)
        {
            this._p_defaultextension = v;
            this.on_apply_defaultextension();
        }
    };

    _pFileDialog.on_apply_defaultextension = function ()
    {
        nexacro._setFileDialogHandleDefaultExtension(this, this._p_defaultextension);
    };

    _pFileDialog.set_dialogtype = function (v)
    {
        if (this._p_dialogtype != v)
        {
            this._p_dialogtype = v;
        }
    };

    _pFileDialog.set_filter = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_filter != v)
        {
            if (this._isValidPropertyFilter(v))
            {
                this._p_filter = v;
                this.on_apply_filter();
            }
        }
    };

    _pFileDialog.on_apply_filter = function ()
    {
        nexacro._setFileDialogHandleFilter(this, this._p_filter);
    };

    _pFileDialog.set_filterindex = function (v)
    {
        if (isNaN(v = +v) || v < 0)
        {
            return;
        }

        if (this._p_filterindex != v)
        {
            this._p_filterindex = v;
            this.on_apply_filterindex();
        }
    };

    _pFileDialog.on_apply_filterindex = function ()
    {
        nexacro._setFileDialogHandleFilterIndex(this, this._p_filterindex);
    };

    _pFileDialog._properties = [{ name: "accept" }, { name: "defaultextension" }, { name: "filter" }, { name: "filterindex" },
    { name: "id", readonly: true }, { name: "name" }, { name: "parent", readonly: true }];

    nexacro._defineProperties(_pFileDialog, _pFileDialog._properties);

    //===============================================================
    // nexacro.FileDialog : Methods
    //===============================================================
    _pFileDialog.open = function (strTitle, constOpenMode, strInitialPath, strFileName, nDlgWidth, nDlgHeight)
    {
        if (isNaN(constOpenMode = +constOpenMode) || (constOpenMode < 1 || constOpenMode > 4))
        {
            return;
        }

        strTitle = strTitle ? strTitle : this.id;
        strInitialPath = strInitialPath ? strInitialPath : "%USERAPP%";
        strFileName = strFileName ? strFileName : "";
        // runtime only
        nDlgWidth = nDlgWidth ? nDlgWidth : -1;
        nDlgHeight = nDlgHeight ? nDlgHeight : -1;

        var filter = this._p_filter ? this._p_filter : "All(*.*)|*.*|";
        var filterarr = filter.split("|");

        if (this._p_filter == "")
        {
            nexacro._setFileDialogHandleFilter(this, "All(*.*)|*.*|");
        }

        if (this._p_defaultextension && this._p_filterindex >= (filterarr.length / 2))
        {
            return false;
        }

        // runtime only
        nexacro._openFileDialogHandle(this, strTitle, constOpenMode, strInitialPath, strFileName, this._p_dialogtype, nDlgWidth, nDlgHeight);

        return true;
    };

    //===============================================================
    // nexacro.FileDialog : Event Handlers
    //===============================================================
    _pFileDialog.on_close = function (reason, path, vfiles)
    {
        this.on_fire_onclose(reason, path, vfiles);
    };

    _pFileDialog._onclose = function (objData) // android runtime & iOS hybrid
    {
        var _virtualFile = objData.virtualfiles;
        var vfiles = new Array(_virtualFile.length);

        for (var i = 0; i < _virtualFile.length; i++)
        {
            var obj = new nexacro.VirtualFile("VirtualFile", "");
            obj._p_filename = _virtualFile[i].filename;
            obj._p_fullpath = _virtualFile[i].fullpath;
            obj._p_path = _virtualFile[i].path;
            vfiles[i] = obj;
        }

        this.on_fire_onclose(objData.reason, objData.reason == 4 ? objData.path : undefined, vfiles);
    };

    _pFileDialog.on_fire_onclose = function (reason, path, vfiles)
    {
        if (this.onclose && this.onclose._has_handlers)
        {
            var evt = new nexacro.FileDialogEventInfo("onclose", reason, path, vfiles);
            return this.onclose._fireEvent(this, evt);
        }
        return true;
    };

    //===============================================================
    // nexacro.FileDialog : Logical Part
    //===============================================================

    //===============================================================
    // nexacro.FileDialog : Util Function
    //===============================================================
    _pFileDialog._isValidPropertyFilter = function (strFilter)
    {
        if (strFilter === "")
            return true;

        var filterarr = strFilter.split("|");
        var f_len = filterarr.length;
        if (f_len < 2)
        {
            return false;
        }

        if ((f_len % 2 == 1) && filterarr[f_len - 1] != "")
        {
            return false;
        }

        var normalize = /[\*].[a-zA-Z0-9가-힣\*]/gi;

        for (var i = 0; i < f_len; i++)
        {
            if (i % 2 == 1)
            {
                if (normalize.test(filterarr[i]) == false)
                {
                    return false;
                }
                normalize.lastIndex = 0;
            }
        }

        return true;
    };

    _pFileDialog = null;

    //delete _pFileDialog;
}