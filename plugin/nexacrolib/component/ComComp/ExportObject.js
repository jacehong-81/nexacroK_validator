﻿//==============================================================================
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

if (!nexacro.ExcelExportObject)
{

    //=========================================================================
    // nexacro.ExcelExportProgressEventInfo
    //========================================================================

    nexacro.ExcelExportProgressEventInfo = function (obj, id, itemindex, itemtype, recordindex, errorobj)
    {
        this.id = this.eventid = id || "onprogress";
        this.fromobject = obj;
        this.fromreferenceobject = errorobj;

        this.itemindex = itemindex;
        this.itemtype = itemtype;
        this.recordindex = recordindex;
    };
    var _pExportEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ExcelExportProgressEventInfo);
    nexacro.ExcelExportProgressEventInfo.prototype = _pExportEventInfo;
    _pExportEventInfo._type_name = "ExcelExportProgressEventInfo";

    _pExportEventInfo = null;
    //delete _pExportEventInfo;

    //========================================================================
    // nexacro.ExcelExportEventInfo
    //========================================================================
    nexacro.ExcelExportEventInfo = function (obj, id, url, errorobj)
    {
        this.id = this.eventid = id || "onsuccess";
        this.fromobject = obj;
        this.fromreferenceobject = errorobj;

        this.url = url;
    };
    var _pExcelExportEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ExcelExportEventInfo);
    nexacro.ExcelExportEventInfo.prototype = _pExcelExportEventInfo;
    _pExcelExportEventInfo._type_name = "ExcelExportEventInfo";

    _pExcelExportEventInfo = null;
    //delete _pExcelExportEventInfo;


    //========================================================================
    // nexacro.ExportErrorEventInfo
    //========================================================================
    nexacro.ExcelExportErrorEventInfo = function (obj, id, errortype, errormsg, errorobj, statuscode)
    {
        this.id = this.eventid = id || "onerror";
        this.fromobject = obj;
        this.fromreferenceobject = errorobj;

        this.errortype = errortype;
        this.errormsg = errormsg;
        this.statuscode = statuscode;
    };
    var _pExportErrorEventInfo = nexacro._createPrototype(nexacro.ErrorEventInfo, nexacro.ExcelExportErrorEventInfo);
    nexacro.ExcelExportErrorEventInfo.prototype = _pExportErrorEventInfo;
    _pExportErrorEventInfo._type_name = "ExcelExportErrorEventInfo";

    _pExportErrorEventInfo = null;
    //delete _pExportErrorEventInfo;


    //========================================================================
    // nexacro.ExcelExportObject
    //========================================================================
    nexacro.ExcelExportObject = function (name, parent)
    {
        this.id = this._p_name = name;


        // K에서는 부모를 지정하지 않으면 찾을 수 없다.
        if (!parent)
        {

            var app = nexacro.getApplication();
            if (app)
            {
                parent = app.getActiveForm();
                if (!parent)
                {
                    var currwin = app._p_mainframe._window;
                    var cur_focus_paths = currwin.getCurrentFocusPaths();
                    var cur_focus_paths_len = (cur_focus_paths ? cur_focus_paths.length : 0);
                    for (var i = 0; i < cur_focus_paths_len; i++)
                    {
                        var _comp = cur_focus_paths[i];
                        if (!_comp)
                            continue;
                        if (_comp._is_form)
                        {
                            parent = _comp;
                            break;
                        }
                    }
                }
            }
        }
        this._p_parent = parent;
        this._grids = [];
        this._dataset = [];
        this._xml = [];

        //event
        this.onsuccess = new nexacro.EventListener("onsuccess");
        this.onprogress = new nexacro.EventListener("onprogress");
        this.onerror = new nexacro.EventListener("onerror");
        this._hidden_frame_handle = null;
        nexacro._create_hidden_frame("", this.on_complete_download, this, "export");
    };
    var _pExcelExport = nexacro.ExcelExportObject.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.ExcelExportObject);
    _pExcelExport._type_name = "ExcelExportObject";

    // Property	
    _pExcelExport.activepagename = ""; // 미노출
    _pExcelExport._p_exportactivemode = "noactive";
    _pExcelExport._p_exporteventtype = "itemrecord";
    _pExcelExport._p_exportfilename = "";
    //_pExcelExport.exportfilpath = "";

    _pExcelExport._p_exportmessagealert = "";
    _pExcelExport._p_exportmessagecomplete = "";
    _pExcelExport._p_exportmessageprocess = "";
    _pExcelExport._p_exportmessageready = "";

    _pExcelExport.exportopenmode = "noopen"; // 미노출
    //this.exportpassword = ""; // [pss] support yet
    //this.exportsavemode = ""; // [pss] support yet

    _pExcelExport._exporttype = nexacro.ExportTypes.EXCEL;
    _pExcelExport._p_exporttype = nexacro.ExportTypes.EXCEL;
    _pExcelExport._p_exportuitype = "none";

    _pExcelExport.templatefilename = "";
    _pExcelExport._p_commdataformat = "SSV";

    _pExcelExport._p_commcompress = "none";
    _pExcelExport._p_exporturl = "";

    _pExcelExport._p_transferrowcount = 500;

    _pExcelExport.exportfilepasswrod = "";
    _pExcelExport._p_exportwordwrap = true;

    _pExcelExport._p_filefilter = "";
    _pExcelExport._p_filefilterindex = 0;

    _pExcelExport._p_separator = "";
    _pExcelExport._p_quotechar = "default";

    _pExcelExport._p_commandversion = "1.0";
    _pExcelExport._commdatadelimiter = String.fromCharCode(29); //commdataformat = "ssv" 일때 디폴트값

    _pExcelExport._defaultseparator = "0x2c"; // ','

    //internal variables
    _pExcelExport._exportuitype = 0;
    _pExcelExport._exporturl = "";
    _pExcelExport._commcompress = false;
    _pExcelExport._commdataformat = 2;

    _pExcelExport._allRowCount = 0;
    _pExcelExport._progress_pos = 0;
    _pExcelExport._uniqueIndex = 0;
    _pExcelExport._fileURL = "";
    _pExcelExport._itemsIndex = 0;

    _pExcelExport._argsParam = null;
    _pExcelExport._argsDsParam = null;
    //_pExcelExport._is_orgval = false; // get grid data type flag (value or text)
    _pExcelExport._orgval_type = 0; //  0:use displayed grid value, 1:use dataset value, 2: mixed (excel type)
    _pExcelExport._file_pw = null; // set filepassword (excel)
    _pExcelExport._wrap_text = true; // set wrap text (excel)
    _pExcelExport._filedownload = true; // filedownload flag
    _pExcelExport._righttoleft = true;

    _pExcelExport._exportBar = null;
    _pExcelExport._tempSaveMethod = null;

    _pExcelExport.excelTypeTable =
    {
        EXCEL: 0x0100,
        EXCEL97: 0x0110,
        EXCEL2007: 0x0120,
        HANCELL2010: 0x0400,
        HANCELL2014: 0x0410,
        CSV: 0x0500,
        TXT: 0x0510,
        256: 0x0100,
        272: 0x0110,
        288: 0x0120,
        1024: 0x0400,
        1040: 0x0410,
        1280: 0x0500,
        1296: 0x0510
    };

    _pExcelExport._event_list =
    {
        "onsuccess": 1, "onerror": 1, "onprogress": 1
    };

    //============================================================
    // nexacro.ExportObjectAsync : Properties
    //============================================================

    _pExcelExport.set_templatefilename = function (v)
    {
        if (v != this.templatefilename)
        {
            this.templatefilename = v;
        }
        return v;
    };

    _pExcelExport.set_commdataformat = function (v)
    {
        if (v != this._p_commdataformat)
        {
            this._p_commdataformat = v;
            switch (v.toString().toUpperCase())
            {
                case "XML":
                    this._commdataformat = 0;
                    break;
                case "BINARY":
                    this._commdataformat = 1;
                    break;
                case "JSON":
                    this._commdataformat = 3;
                    break;
                default:
                    this._commdataformat = 2; // SSV
                    break;
            }
        }
        return v;
    };

    _pExcelExport.set_commandversion = function (v)
    {
        this._p_commandversion = v;
    };

    _pExcelExport.set_commcompress = function (v)
    {
        if (v != this._p_commcompress)
        {
            this._p_commcompress = v;

            if (v.toString().toUpperCase() == "COMPRESS")
            {
                this._commcompress = true;
            }
            else
            {
                this._commcompress = false;
            }
        }
        return v;
    };

    _pExcelExport.set_exporturl = function (v)
    {
        if (v != this._p_exporturl)
        {
            this._p_exporturl = this._exporturl = v;
            if (v)
                this._exporturl = nexacro._getServiceLocation(v, this._p_parent._getFormBaseUrl(), null, false);
        }
        return v;
    };

    _pExcelExport.set_exporttype = function (v)
    {
        if (v != this._p_exporttype)
        {
            this._p_exporttype = v;
            var export_type = this.excelTypeTable[(v + "").toUpperCase()];
            if (!export_type)
            {
                export_type = 256;
            }
            this._exporttype = export_type;
        }
        return v;
    };

    _pExcelExport.set_separator = function (v)
    {
        var checkinvalid = false;
        if (v.length == 4)
        {
            if ((v.substr(0, 2) == "0x") || (v.substr(0, 2) == "0X"))
            {
                v = parseInt(v, 16);
            }
            else
                checkinvalid = true;
        }

        v = parseInt(v);
        var pattern16 = /^(0|3|10|13|29|34|39|40|41|58|61)$/g; // null, EOT, LF, CR, GS, '"', "'", "(", ")", ":", "="
        if (checkinvalid || pattern16.test(v) || v >= 0x80 || v <= 0x00)
            this._p_separator = v = this._defaultseparator;

        if (v != this._p_separator && nexacro._isInt(v))
        {
            this._p_separator = "0x" + v.toString(16);
        }

        return v;
    };

    _pExcelExport.set_quotechar = function (v)
    {
        var quotechar_enum = ['"', "'", "none", "default"];
        if (quotechar_enum.indexOf(v) == -1)
        {
            this._p_quotechar = v = "default";
        }

        if (v != this._p_quotechar)
        {
            this._p_quotechar = v;
        }
        return v;
    };

    _pExcelExport.set_activepagename = function (v)
    {
        if (v != this.activepagename)
        {
            this.activepagename = v;
        }
        return v;
    };

    _pExcelExport.set_exportactivemode = function (v)
    {
        if (v != this._p_exportactivemode)
        {
            this._p_exportactivemode = v;
        }
        return v;
    };

    _pExcelExport.set_exporteventtype = function (v)
    {
        if (v != this._p_exporteventtype)
        {
            this._p_exporteventtype = v;
        }
        return v;
    };

    _pExcelExport.set_exportopenmode = function (v)
    {
        if (v != this.exportopenmode)
        {
            this.exportopenmode = v;
        }
        return v;
    };

    _pExcelExport.set_exportfilename = function (v)
    {
        v = v + "";
        if (v != this._p_exportfilename)
        {
            // var special_xmlchar = /[&"'\<\>\r\n\t\\\/]/g;
            // if (v)
            // {
            //     v.match(special_xmlchar);
            // }
            this._p_exportfilename = v;
        }
        return v;
    };

    _pExcelExport.set_exportfilepath = function (v)
    {
        if (v != this._p_exportfilepath)
        {
            this._p_exportfilepath = v;
        }
        return v;
    };

    _pExcelExport.set_exportmessagealert = function (v)
    {
        if (v != this._p_exportmessagealert)
        {
            this._p_exportmessagealert = v;
        }
        return v;
    };

    _pExcelExport.set_exportuitype = function (v)
    {
        if (v != this._p_exportuitype)
        {
            this._p_exportuitype = v;
            switch (v)
            {
                case "exportprogress":
                    this._exportuitype = 1;
                    break;
                case "statusbar":
                    this._exportuitype = 2;
                    break;
                default:
                    this._exportuitype = 0;
                    break;
            }
        }
        return v;
    };

    _pExcelExport.set_exportmessageready = function (v)
    {
        if (v != this._p_exportmessageready)
        {
            this._p_exportmessageready = v;
        }

        return v;
    };

    _pExcelExport.set_exportmessageprocess = function (v)
    {
        if (v != this._p_exportmessageprocess)
        {
            this._p_exportmessageprocess = v;
        }

        return v;
    };

    _pExcelExport.set_exportmessagecomplete = function (v)
    {
        if (v != this._p_exportmessagecomplete)
        {
            this._p_exportmessagecomplete = v;
        }

        return v;
    };


    _pExcelExport.set_transferrowcount = function (v)
    {
        this._p_transferrowcount = nexacro._toInt(v);
    };

    _pExcelExport.set_exportfilepassword = function (v)
    {
        if (v != this._p_exportfilepassword)
        {
            this._p_exportfilepassword = v;
        }
    };

    _pExcelExport.set_exportwordwrap = function (v)
    {
        //v = nexacro._toBoolean(v);
        if (v != this._p_exportwordwrap)
        {
            this._p_exportwordwrap = v;
        }
    };

    _pExcelExport.set_filefilter = function (v)
    {
        this._p_filefilter = v;
    };

    _pExcelExport.set_filefilterindex = function (v)
    {
        this._p_filefilterindex = v;
    };

    _pExcelExport._properties = [{ name: "exporturl" }, { name: "exportactivemode" }, { name: "exporteventtype" }, { name: "exportfilename" }, { name: "exportfilepath" },
    { name: "exportmessagealert" }, { name: "exportmessagecomplete" }, { name: "exportmessageprocess" }, { name: "exportmessagready" }, { name: "exporttype" },
    { name: "exportuitype" }, { name: "templatefilename" }, { name: "commdataformat" }, { name: "commandversion" }, { name: "commcompress" }, { name: "separator" }, { name: "quotechar" },
    { name: "transferrowcount" }, { name: "exportfilepassword" }, { name: "exportmessageready" }, { name: "exportwordwrap" }, { name: "filefilter" }, { name: "filefilterindex" }];

    nexacro._defineProperties(_pExcelExport, _pExcelExport._properties);

    //============================================================
    // nexacro.ExportObjectAsync : methods
    //============================================================
    _pExcelExport.addExportItem = function (type, item/*, range*/)
    {
        var size = -1;
        var eItem;

        if (type && item)
        {
            var use_arg_len = arguments.length;
            if (item instanceof nexacro.ExportItem)
            {
                eItem = item;
                eItem.parent = this;
            }
            else if (type == this._getItemType(item))
            {
                eItem = new nexacro.ExportItem(this.id + "item" + this._uniqueIndex++, this);
                eItem.parent = this;
            }
            else
            {
                return -1;
            }

            // exportitem set argument
            if (use_arg_len != 2)
            {
                if (use_arg_len < 5 && nexacro._isArray(arguments[2]))
                {
                    switch (use_arg_len)
                    {
                        case 4: // valuetypebandid & valuetypecellindex
                            arguments[3] && eItem.set_valuetypebandid(arguments[3]);
                            arguments[2] && eItem.set_valuetypecellindex(arguments[2]);
                            break;
                        case 3: // valuetypecellindex                        
                            arguments[2] && eItem.set_valuetypecellindex(arguments[2]);
                            break;
                        default:
                            break;
                    }
                }
                else
                {
                    switch (use_arg_len)
                    {
                        case 12: arguments[11] && eItem.set_valuetypebandid(arguments[11]);
                        case 11: arguments[10] && eItem.set_valuetypecellindex(arguments[10]);
                        //    arguments[10] && eItem.set_acceptstyle(arguments[10]); -> 기능삭제 
                        case 10:
                            arguments[9] && eItem.set_exportsize(arguments[9]); // 2013-10-04 pss - [SEQ73910] syntax error
                        case 9:
                            arguments[8] && eItem.set_exceptstyle(arguments[8]);
                        case 8:
                            arguments[7] && eItem.set_exportimage(arguments[7]);
                        case 7:
                            arguments[6] && eItem.set_exportvalue(arguments[6]);
                        case 6:
                            arguments[5] && eItem.set_exportmerge(arguments[5]);
                        case 5:
                            arguments[4] && eItem.set_exportselect(arguments[4]);
                        case 4:
                            arguments[3] && eItem.set_exporthead(arguments[3]);
                        case 3:
                            arguments[2] && eItem.set_range(arguments[2]);
                        case 2:
                            arguments[1] && eItem.set_source(arguments[1]);
                            break;
                        default:
                            break;
                    }
                }
            }

            eItem._setEventHandler("onprogress", this.on_notify_onprogress, this);
            eItem._setEventHandler("onsuccess", this.on_notify_onsuccess, this);
            eItem._setEventHandler("onerror", this.on_notify_onerror, this);
        }
        else
        {
            return -1;
        }

        switch (type)
        {
            case nexacro.ExportItemTypes.GRID:
                eItem.set_type(type);
                size = this._grids.push(eItem) - 1;
                eItem._righttoleft = eItem.source._isRtl();
                break;
            case nexacro.ExportItemTypes.DATA:
                // TODO
                break;
            case nexacro.ExportItemTypes.XML:
                // TODO
                break;
        }
        return size;
    };

    _pExcelExport.clear = function ()
    {
        var count = 0;

        count += this._grids.length;
        count += this._dataset.length;
        count += this._xml.length;

        for (var i = 0, len = this._grids.length; i < len; i++)
        {
            var item = this._grids.pop();
            if (item)
            {
                item._clear();
            }
        }

        this._grids = [];
        this._dataset = [];
        this._xml = [];

        return count;
    };

    _pExcelExport.clearExportItems = function (type)
    {
        var length;
        if (type == nexacro.ExportItemTypes.GRID)
        {
            length = this._grids.length;
            for (var i = 0; i < length; i++)
            {
                var item = this._grids.pop();
                if (item)
                {
                    item._clear();
                }
            }
            this._grids = [];
        }

        if (length == 0)
            this._uniqueIndex = 0;
        return length;
    };

    _pExcelExport.count = function ()
    {
        var count = 0;

        count += this._grids.length;
        count += this._dataset.length;
        count += this._xml.length;

        return count;
    };

    _pExcelExport.countExportItems = function (type)
    {
        var count = 0;

        if (type == nexacro.ExportItemTypes.GRID)
        {
            count += this._grids.length;
        }

        return count;
    };

    _pExcelExport.delExportItem = function (type, index)
    {
        var isDelete = false;

        if (type == nexacro.ExportItemTypes.GRID)        
        {
            if (this._grids.splice(index, 1).length > 0)
            {
                isDelete = true;
            }
        }

        return isDelete;
    };

    _pExcelExport.getExportItem = function (type, index)
    {
        var item = null;

        if (type == nexacro.ExportItemTypes.GRID)
        {
            item = this._grids[index];
        }

        return item ? item : null;
    };

    _pExcelExport.setExportItem = function (type, index, item)
    {
        if (!item || !(item instanceof nexacro.ExportItem))
        {
            return false;
        }

        var reVal = false;

        if (type == nexacro.ExportItemTypes.GRID)
        {
            if (index > -1 && index < this._grids.length)
            {
                item._p_parent = this;
                this._grids[index] = item;
                reVal = true;
            }
        }

        return reVal;
    };

    _pExcelExport.exportItems = function (type)
    {
        var g_len = -1;
        if (!this._p_exporturl)
        {
            return g_len;
        }
        if (type == nexacro.ExportItemTypes.GRID)
        {
            var grid_items = this._grids;
            g_len = this._gCount = grid_items.length;
            this._allCount = g_len;

            if (g_len > 0)
            {
                if (this._p_exportmessagealert != "")
                {
                    nexacro.alert(this._p_exportmessagealert);
                }
                grid_items[0]._gridItemExport(this);
            }
        }
        return g_len; // TO DO : when other type
    };

    _pExcelExport.exportDataEx = function (argsParam, argsDsParam, bFileDownload)
    {
        this._is_export_ex = true;
        var retn = this.exportData(argsParam, argsDsParam, 0, bFileDownload);

        return retn;
    };

    _pExcelExport.exportData = function (argsParam, argsDsParam, nOrgValueType, bFileDownload)
    {
        this._argsParam = argsParam;
        this._argsDsParam = argsDsParam;
        //this._is_orgval = bOrgValue ? true : false; // default false
        //this._orgval_type = nOrgValueType; // 0:use displayed grid value, 1:use dataset value, 2: mixed (excel type)
        if (typeof nOrgValueType == "string")
        {
            nOrgValueType = nOrgValueType.toLowerCase();
            switch (nOrgValueType)
            {
                case "false": case "0":
                    this._orgval_type = 0;
                    break;
                case "true": case "1":
                    this._orgval_type = 1;
                    break;
                case "2":
                    this._orgval_type = 2;
                    break;
                default:
                    this._orgval_type = 0;
                    break;
            }
        }
        else if (typeof nOrgValueType == "number")
        {
            nOrgValueType = nexacro._toInt(nOrgValueType);
            if (nOrgValueType < 0 || nOrgValueType > 2)
                this._orgval_type = 0;
            else
                this._orgval_type = nOrgValueType;
        }
        else
        {
            if (nOrgValueType === true || nOrgValueType === false)
                this._orgval_type = nOrgValueType ? 1 : 0;
            else
                this._orgval_type = 0;
        }

        this._filedownload = (bFileDownload !== undefined) ? !!bFileDownload : true;

        var i;
        //      if (argsParam)
        //      {
        //          this._file_pw = null;
        //          var userDatas = argsParam.split(",");
        //          for (i = 0, u_len = userDatas.length; i < u_len; i++)
        //          {
        //              var dataArr = userDatas[i].split("=");
        //              if (dataArr[0] == "filepassword")
        //              {
        //                  this._file_pw = dataArr[1];
        //                  userDatas.splice(i, 1);
        //                  argsParam = userDatas.join(",");
        //                  break;
        //              }
        //              else if (dataArr[0] == "wraptext")
        //              {
        //                  this._wrap_text = nexacro._toBoolean(dataArr[1]);
        //                  userDatas.splice(i, 1);
        //              }
        //              else if (dataArr[0] == "contenttype")
        //              {
        //                  var datatype = dataArr[1].toLowerCase();
        //                  if (datatype == "json")
        //                  {
        //                      this._commdataformat = 3; // JSON
        //                  }
        //                  else
        //                  {
        //                      this._commdataformat = 2; // SSV
        //                  }
        //              }
        //          }
        //          argsParam = userDatas.join(",");
        //          this._argsParam = argsParam;
        //}

        this._file_pw = null;
        if (this._p_exportfilepassword)
        {
            this._file_pw = this._p_exportfilepassword;
        }

        if (this._p_exportwordwrap !== "")
        {
            var wordwrap = nexacro._toBoolean(this._p_exportwordwrap);
            if (wordwrap != this._wrap_text)
            {
                this._wrap_text = wordwrap;
            }
        }

        var ret = -1;
        if (!this._p_exporturl)
        {
            return ret;
        }

        if (this._commdataformat == 0 || (this._p_commandversion != "1.0" && this._commdataformat == 3)) //xml or json(commandversion 1.0)
        {
            // XML 구문자를 회피하기 위한 합의된 문자열
            this._commdatadelimiter = "_x001D_";
        }

        // TO DO : grid -> dataset -> xml
        var grid_items = this._grids;
        var g_len = this._gCount = grid_items.length;
        // Open this block when datasettype and xmltype support
        //var dataset_items = this._dataset;
        //var d_len = this._dCount = dataset_items.length;
        //var xml_items = this._xml;
        //var x_len = this._xCount = xml_items.length;
        this._allCount = g_len; // + d_len + x_len;
        if (this._allCount > 0 && this._p_exportmessagealert != "")
        {
            nexacro.alert(this._p_exportmessagealert);
        }


        for (i = 0; i < g_len; i++)
        {
            this._allRowCount += grid_items[i]._p_source._getGridRowCount();
        }
        // Open this block when datasettype and xmltype support
        //for (i = 0; i < d_len; i++)
        //{
        //    this._allRowCount += dataset_items[i].getRowCount();
        //}
        //for (i = 0; i < x_len; i++)
        //{
        //    // TO DO :
        //}
        if (g_len > 0)
        {
            grid_items[0]._gridItemExport(this);
        }
        // Open this block when datasettype and xmltype support
        //else if (d_len > 0)
        //{
        //    dataset_items[0]._datasetItemExport(this);
        //}
        //else if (x_len > 0)
        //{
        //    xml_items[0]._xmlItemExport(this);
        //}

        return this.count();
        //return ret;
    };

    _pExcelExport.destroy = function ()
    {
        var exportbar = this._exportBar;
        if (exportbar)
        {
            exportbar.destroy();
        }

        for (var i = 0, len = this._grids.length; i < len; i++) // 추가로직
        {
            var item = this._grids.pop();
            if (item)
            {
                item._clear();
            }
        }
        this._grids = null;
        this._dataset = null;
        this._grids = null;
        this._dataset = null;

        this._excel_suppress_info = null;
        this._merge_datas = null;
        this._xml.length = 0;

        if (this._p_parent)
            this._p_parent.removeChild(this.id);
        nexacro._EventSinkObject.prototype.destroy.call(this);
        return true;
    };


    //============================================================
    // nexacro.ExportObjectAsync : events
    //============================================================
    _pExcelExport.on_fire_onprogress = function (obj, e)
    {
        var event = this.onprogress;

        if (event && event._has_handlers)
        {
            event._fireEvent(this, e);
        }
    };

    _pExcelExport.on_fire_onsuccess = function (obj, e)
    {
        var event = this.onsuccess;

        if (event && event._has_handlers)
        {
            event._fireEvent(this, e);
        }
    };

    _pExcelExport.on_fire_onerror = function (obj, e)
    {
        var event = this.onerror;
        var ret;

        if (event && event._has_handlers)
        {
            ret = event._fireEvent(this, e);
        }
        return ret;
    };

    _pExcelExport.on_notify_onprogress = function (obj, e)
    {
        this.on_fire_onprogress(obj, e);
        return false;
    };

    _pExcelExport.on_notify_onsuccess = function (obj, e)
    {
        this.on_fire_onsuccess(obj, e);
        return false;
    };

    _pExcelExport.on_notify_onerror = function (obj, e)
    {
        this.on_fire_onerror(obj, e);
        return false;
    };

    _pExcelExport.on_complete_download = function (status, data, url, errcode, httpcode, errmsg)
    {
        if (status >= 0)
        {
            if (this._p_exportactivemode == "active")
            {
                nexacro._execShell(data);
            }
        }
    };

    //============================================================
    // nexacro.GroupBox : Logical Part
    //============================================================

    _pExcelExport._getItemType = function (item)
    {
        var rt;
        switch (item && item._type_name)
        {
            case "Grid":
                rt = nexacro.ExportItemTypes.GRID;
                break;
            case "Dataset":
                break;
            case "Xml":
                break;
            default:
                if (item instanceof nexacro.Grid)
                {
                    rt = nexacro.ExportItemTypes.GRID;
                }
                break;
        }
        return rt;
    };

    _pExcelExport._getProcessStr = function (item, itemrecord, totalrecord)
    {
        var str = "";
        str = this._p_exportmessageprocess.replace("%d", item);
        str = str.replace("%d", itemrecord);
        str = str.replace("%d", totalrecord);

        return str;
    };

    _pExcelExport._getForm = function ()
    {
        if (this._p_parent instanceof nexacro.Form)
        {
            return this._p_parent;
        }
        return null;
    };

    _pExcelExport._getExportBar = function (uiType)
    {
        var form = this._getForm();
        var pbar_name = "_exportBar";
        var obj = form[pbar_name];
        if (obj)
        {
            obj.destroy();
        }

        obj = new nexacro.ExportProgress(pbar_name, 0, 0, 10, 10, null, null, null, null, null, null, form);
        form.addChild(obj._p_name, obj);
        obj._uitype = uiType;
        if (obj.createComponent(true))
        {
            obj.on_created();
        }
        return obj;
    };

    _pExcelExport = null;
    //delete _pExcelExport;

    //==================================================================================
    // nexacro.ExportItem : ExportItem
    // description :  ExportObjectAsync'title subComp
    //==================================================================================
    nexacro.ExportItem = function (id, parent)
    {
        nexacro._EventSinkObject.call(this, id, parent);

        this._merge_datas = null;
        this._gridTempInfo = null;
        this._tmpSuppressInfos = undefined; // for rollback
        this._stylecache = {};
        this._excel_suppress_info = {};

        this._style_map1 = null;
        this._style_map2 = null;
        this._ds_style2 = null;
        this._ds_style = null;
        this._ds_cell = null;
        this._ds_response = null;
        this._load_manager = null;
        this._orgvalue_cells = null;
        this._orgvalue_bands = null;
    };

    var _pExportItem = nexacro.ExportItem.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.ExportItem);
    _pExportItem._type_name = "ExportItem";


    _pExportItem._p_exceptstyle = "none";
    _pExportItem._p_exporthead = "allband";
    _pExportItem._exporthead = "";
    _pExportItem._p_exportimage = "none";
    _pExportItem._p_exportmerge = "suppress";
    _pExportItem._exportmerge = 1; // suppress
    _pExportItem._p_exportselect = "allrecord";
    _pExportItem._p_exportvalue = "allstyle";
    _pExportItem._p_exportsize = "width";
    _pExportItem.valuetypecellindex = [];
    _pExportItem.valuetypebandid = "";

    _pExportItem._p_range = "";
    _pExportItem._p_source = "";
    _pExportItem._p_type = "";

    _pExportItem._applyA = true; // align
    _pExportItem._applyB = true; // background
    _pExportItem._applyC = true; // color
    _pExportItem._applyF = true; // font
    _pExportItem._applyHead = true; // font
    _pExportItem._applySumm = true; // font
    _pExportItem._applyL = true; // Line
    _pExportItem._d_BLColor = "";

    _pExportItem._seq = 1;
    _pExportItem._preStartRow = 0;
    _pExportItem._startRow = 0;
    _pExportItem._eof = false;
    _pExportItem._instanceId = "";

    _pExportItem._a_ct = 0; // align style count
    _pExportItem._bg_ct = 0; // background style count
    _pExportItem._c_ct = 0; // color style count
    _pExportItem._f_ct = 0; // font style count
    _pExportItem._l_ct = 0; // line style count
    _pExportItem._t_ct = 0; // cell type style count
    _pExportItem._sm_ct = 0; // suppress merge style count
    _pExportItem._g_ct = 0; // gradation style count
    _pExportItem._s_ct = 0; // style count
    _pExportItem._selectcount = 0;

    _pExportItem._righttoleft = false;

    _pExportItem._event_list = { "onsuccess": 1, "onprogress": 1, "onerror": 1 };

    _pExportItem._suppress_align_table = {
        "first": "top",
        "first,over": "top",
        "middle": "middle",
        "middle,over": "middle",
        "last": "bottom",
        "last,over": "bottom"
    };

    //===============================================================
    // nexacro.ExportItem : Create & Destroy & Update
    //===============================================================
    _pExportItem._clear = function () // 함수 추가 아래 내용 신규 _pExportItem.set_exceptstyle 함수위에 추가
    {
        if (this._ds_style2)
        {
            this._ds_style2.destroy();
            this._ds_style2 = null;
            delete this._ds_style2;
        }

        if (this._ds_style)
        {
            this._ds_style.destroy();
            this._ds_style = null;
            delete this._ds_style;
        }

        if (this._style_map1)
        {
            this._style_map1 = null;
        }

        if (this._style_map2)
        {
            this._style_map2 = null;
        }

        if (this._ds_command)
        {
            this._ds_command.destroy();
            this._ds_command = null;
            delete this._ds_command;
        }

        if (this._ds_cell)
        {
            this._ds_cell.destroy();
            this._ds_cell = null;
            delete this._ds_cell;
        }

        if (this._ds_response)
        {
            this._ds_response.destroy();
            this._ds_response = null;
            delete this._ds_response;
        }
        if (this._load_manager)
        {
            this._load_manager.destroy();
            this._load_manager = null;
            delete this._load_manager;
        }

        if (this._merge_datas)
            this._merge_datas = null;
        if (this._stylecache)
            this._stylecache = null;
        if (this.source)
            this.source = null;
        if (this._gridTempInfo)
            this._gridTempInfo = null;
        if (this._excel_suppress_info)
            this._excel_suppress_info = null;

        if (this._tmpSuppressInfos)
            this._tmpSuppressInfos = null;

        this._righttoleft = false;
        this._orgvalue_cells = null;
        this._orgvalue_bands = null;
    };

    //==================================================================================
    // nexacro.ExportItem : properties
    //==================================================================================
    /*
        _pExportItem.set_acceptstyle = function (v)
        {
            if (v != this.acceptstyle)
            {
                this.acceptstyle = v;
                switch (v.toLowerCase())
                {
                    case "cellline":
                        this._applyL = true;
                        break;
                }
            }
            return v;
        };
     */
    _pExportItem.set_exceptstyle = function (v)
    {
        if (v != this._p_exceptstyle)
        {
            var chkExceptstyle = 0;

            var except = v.replace(/ /g, "").split(",");
            var eLen = except.length;
            for (var i = 0; i < eLen; i++)
            {
                switch (except[i].toLowerCase())
                {
                    case "align":
                        this._applyA = false;
                        chkExceptstyle += 1;
                        break;
                    case "background":
                        this._applyB = false;
                        chkExceptstyle += 1;
                        break;
                    case "color":
                        this._applyC = false;
                        chkExceptstyle += 1;
                        break;
                    case "font":
                        this._applyF = false;
                        chkExceptstyle += 1;
                        break;
                    case "border":
                        this._applyL = false;
                        chkExceptstyle += 1;
                        break;
                    case "none":
                        this._applyA = true;
                        this._applyB = true;
                        this._applyC = true;
                        this._applyF = true;
                        this._applyL = true;
                        chkExceptstyle += 1;
                        break;
                }
            }

            if (eLen === chkExceptstyle)
            {
                this._p_exceptstyle = v;
            }
        }

        return v;
    };

    _pExportItem.set_exporthead = function (v)
    {
        if (v != this._p_exporthead)
        {
            this._p_exporthead = v;
            var except = v.replace(/ /g, "").split(",");
            var eLen = except.length;
            for (var i = 0; i < eLen; i++)
            {
                switch (except[i].toLowerCase())
                {
                    case "nohead":
                        this._applyHead = false;
                        break;
                    case "nosumm":
                        this._applySumm = false;
                        break;
                    default:
                        this._applySumm = true;
                        this._applySumm = true;
                        break;
                }
            }
        }

        if (!this._applyHead || !this._applySumm)
        {
            if (!this._applyHead && !this._applySumm)
            {
                this._exporthead = "nohead, nosumm";
            }
            else if (!this._applyHead)
            {
                this._exporthead = "nohead";
            }
            else
            {
                this._exporthead = "nosumm";
            }
        }
        else
        {
            this._exporthead = "allband";
        }

        return v;
    };

    _pExportItem.set_exportimage = function (v)
    {
        if (v != this._p_exportimage)
        {
            this._p_exportimage = v;
        }

        return v;
    };

    _pExportItem.set_exportmerge = function (v)
    {
        if (v != this._p_exportmerge)
        {
            this._p_exportmerge = v;
            switch (v)
            {
                case "nosuppress":
                    this._exportmerge = 0;
                    break;
                case "merge":
                    this._exportmerge = 2;
                    break;
                default:
                    this._exportmerge = 1;
                    break;
            }
        }

        return v;
    };

    _pExportItem.set_exportselect = function (v)
    {
        if (v != this._p_exportselect)
        {
            this._p_exportselect = v;
        }
        return v;
    };

    _pExportItem.set_exportvalue = function (v)
    {
        if (v != this._p_exportvalue)
        {
            this._p_exportvalue = v;
        }
        return v;
    };


    _pExportItem.set_range = function (v)
    {
        if (v != this._p_range)
        {
            this._p_range = v;
        }

        return v;
    };

    _pExportItem.set_source = function (v)
    {
        if (v != this._p_source)
        {
            this._p_source = v;
        }

        return v;
    };

    _pExportItem.set_type = function (v)
    {
        if (v != this._p_type)
        {
            this._p_type = v;
        }

        return v;
    };

    _pExportItem.set_exportsize = function (v)
    {
        if (v != this._p_exportsize)
        {
            this._p_exportsize = v;
        }
        return v;
    };

    _pExportItem.set_valuetypecellindex = function (cellindex)
    {
        if (cellindex != this._p_valuetypecellindex)
        {
            this._p_valuetypecellindex = cellindex;
            if (nexacro._isArray(cellindex))
            {
                var orgvalue_cells = [];
                for (var i = 0; i < cellindex.length; i++)
                {
                    orgvalue_cells[(cellindex[i] | 0)] = true;
                }

                this._orgvalue_cells = orgvalue_cells;
            }
        }
    };

    _pExportItem.set_valuetypebandid = function (bandid)
    {
        if (bandid != this._p_valuetypebandid)
        {
            this._p_valuetypebandid = bandid;
            if (nexacro._isString(bandid))
            {
                var _orgvalue_bands = [];
                switch (bandid)
                {
                    case "head":
                    case "body":
                    case "summ":
                        _orgvalue_bands[bandid] = true;
                        break;
                    default:
                        _orgvalue_bands = null;
                        break;
                }

                this._orgvalue_bands = _orgvalue_bands;
            }
        }
    };

    //==================================================================================
    // nexacro.ExportItem : methods
    //==================================================================================

    //==================================================================================
    // nexacro.ExportItem : events
    //==================================================================================

    _pExportItem.on_fire_onprogress = function (obj, itemindex, itemtype, recordindex)
    {
        var event = this._p_parent.onprogress;

        if (event && event._has_handlers)
        {
            var evt = new nexacro.ExcelExportProgressEventInfo(obj, "onprogress", itemindex, itemtype, recordindex, this);
            event._fireEvent(this._p_parent, evt);
        }
    };

    _pExportItem.on_fire_onsuccess = function (obj, referObj, url)
    {
        var event = this._p_parent.onsuccess;

        if (event && event._has_handlers)
        {
            var evt = new nexacro.ExcelExportEventInfo(obj, "onsuccess", url, this);
            event._fireEvent(this._p_parent, evt);
        }
    };


    _pExportItem.on_fire_onerror = function (obj, errortype, errormsg, statuscode)
    {
        var event = this._p_parent.onerror;

        if (event && event._has_handlers)
        {
            var evt = new nexacro.ExcelExportErrorEventInfo(obj, "onerror", errortype, errormsg, this, statuscode);
            event._fireEvent(this._p_parent, evt);
        }
    };

    //==================================================================================
    // nexacro.ExportItem : Logical Part
    //==================================================================================
    _pExportItem._getWindow = function ()
    {
        var excelexport = this._p_parent;
        if (excelexport)
        {
            var form = excelexport._p_parent;
            if (form._is_form)
            {
                return form._getWindow();
            }
        }
        return null;
    };

    _pExportItem._getWindowHandle = function ()
    {
        var excelexport = this._p_parent;
        if (excelexport)
        {
            var form = excelexport._p_parent;
            if (form._is_form)
            {
                return form._getWindowHandle();
            }
        }
        return null;
    };

    _pExportItem._getCellStyle = function (cell, rowIdx, odd, sn, status)
    {
        var cellStyleinfo;
        var userstatus = status == true ? "selected" : undefined;

        switch (sn)
        {
            case "align":
                cellStyleinfo = cell._query_status_align(rowIdx, cell.displaytype, userstatus, true);
                break;
            case "background":
                cellStyleinfo = cell._query_status_background(rowIdx, userstatus, true);
                if (cellStyleinfo && cellStyleinfo.indexOf("linear-gradient") >= 0)
                {
                    cellStyleinfo = this._getGradientValue(cellStyleinfo);
                }
                break;
            case "border":
                cellStyleinfo = cell._query_status_border(rowIdx, userstatus, true);
                break;
            case "color":
                cellStyleinfo = cell._query_status_color(rowIdx, userstatus, true);
                break;
            case "font":
                cellStyleinfo = cell._query_status_font(rowIdx, userstatus, true);
                break;
            case "textDecoration":
                cellStyleinfo = cell._grid._getCellStyleInfo(cell._cellidx, "textDecoration", rowIdx, userstatus);
                if (cellStyleinfo)
                {
                    cellStyleinfo = cellStyleinfo.match(/underline|line-through/g);
                    if (cellStyleinfo)
                    {
                        cellStyleinfo = cellStyleinfo.join(",");
                        cellStyleinfo = cellStyleinfo.replace("line-through", "strikeout");
                    }
                }

                break;

        }
        return cellStyleinfo;
    };


    _pExportItem._getCellText = function (source, rowidx, cellidx, subcellidx)
    {
        var celltext;

        if (source && source instanceof nexacro.Grid)
        {
            var band;
            var format = source._curFormat;
            var cellinfo;

            if (rowidx == -1)
            {
                band = "head";
                cellinfo = format._headcells[cellidx];
            }
            else if (rowidx == -2)
            {
                band = "summ";
                cellinfo = format._summcells[cellidx];
            }
            else
            {
                band = "body";
                cellinfo = format._bodycells[cellidx];
            }

            var export_obj = this._p_parent;

            var display_type = cellinfo._getDisplaytype(rowidx);
            var orgv_cells = this._orgvalue_cells;
            var isdecorate = false;
            if (display_type == "decoratetext")
                isdecorate = true;
            var orgv_bands = this._orgvalue_bands;
            var is_orgvalueband = false;
            if (!nexacro._isNull(orgv_bands) && !nexacro._isNull(orgv_bands[band]))
            {
                is_orgvalueband = true;
            }

            if (source.getSubCellCount(band, cellidx))
            {
                if (subcellidx == undefined)
                    return null;

                if (orgv_cells && orgv_cells[cellidx] && is_orgvalueband)
                {
                    celltext = source.getSubCellValue(rowidx, cellidx, subcellidx);
                }
                else if (export_obj._orgval_type)
                {
                    if (export_obj._orgval_type != 2 || (export_obj._orgval_type == 2 && display_type != "date"))
                    {
                        celltext = source.getSubCellValue(rowidx, cellidx, subcellidx);
                        isdecorate = false;
                    }
                    else
                        celltext = source.getSubCellText(rowidx, cellidx, subcellidx);
                }
                else
                    celltext = source.getSubCellText(rowidx, cellidx, subcellidx);
            }
            else
            {
                if (orgv_cells && orgv_cells[cellidx] && is_orgvalueband)
                {
                    celltext = source.getCellValue(rowidx, cellidx);
                }
                else if (export_obj._orgval_type)
                {
                    if (export_obj._orgval_type != 2 || (export_obj._orgval_type == 2 && display_type != "date"))
                    {
                        celltext = source.getCellValue(rowidx, cellidx);
                        isdecorate = false;
                    }
                    else
                        celltext = source.getCellText(rowidx, cellidx);
                }
                else
                    celltext = source.getCellText(rowidx, cellidx);
            }

            if (isdecorate)
                celltext = nexacro._getDisplayTextfromDecorateText(celltext);
        }

        return celltext;
    };

    //MakeLocaleInfo.js에서 추출하여 가공함;
    _pExportItem.__localeinfo =
    {
        "ko": "ko_KR",
        "ja": "ja_JP",
        "en": "en_US",
        "af": "af_ZA",
        "ar": "ar_SA",
        "as": "as_IN",
        "az": "az_AZ",
        "be": "be_BY",
        "bg": "bg_BG",
        "bn": "bn_IN",
        "br": "br_FR",
        "bs": "bs_BA",
        "ca": "ca_ES",
        "cs": "cs_CZ",
        "cy": "cy_GB",
        "da": "da_DK",
        "de": "de_DE",
        "dz": "dz_BT",
        "el": "el_GR",
        "es": "es_ES",
        "et": "et_EE",
        "eu": "eu_ES",
        "fa": "fa_IR",
        "fi": "fi_FI",
        "fo": "fo_FO",
        "fr": "fr_FR",
        "fy": "fy_NL",
        "ga": "ga_IE",
        "gd": "gd_GB",
        "gl": "gl_ES",
        "gu": "gu_IN",
        "gv": "gv_GB",
        "he": "he_IL",
        "hi": "hi_IN",
        "hr": "hr_HR",
        "hu": "hu_HU",
        "hy": "hy_AM",
        "id": "id_ID",
        "is": "is_IS",
        "it": "it_IT",
        "iw": "iw_IL",
        "ka": "ka_GE",
        "kk": "kk_KZ",
        "kl": "kl_GL",
        "km": "km_KH",
        "kn": "kn_IN",
        "ku": "ku_TR",
        "kw": "kw_GB",
        "ky": "ky_KG",
        "lg": "lg_UG",
        "lo": "lo_LA",
        "lt": "lt_LT",
        "lv": "lv_LV",
        "mg": "mg_MG",
        "mi": "mi_NZ",
        "mk": "mk_MK",
        "ml": "ml_IN",
        "mn": "mn_MN",
        "mr": "mr_IN",
        "ms": "ms_MY",
        "mt": "mt_MT",
        "my": "my_MM",
        "nb": "nb_NO",
        "ne": "ne_NP",
        "nl": "nl_NL",
        "nn": "nn_NO",
        "no": "no_NO",
        "nr": "nr_ZA",
        "oc": "oc_FR",
        "om": "om_ET",
        "or": "or_IN",
        "pa": "pa_IN",
        "pl": "pl_PL",
        "pt": "pt_PT",
        "ro": "ro_RO",
        "ru": "ru_RU",
        "rw": "rw_RW",
        "se": "se_NO",
        "si": "si_LK",
        "sk": "sk_SK",
        "sl": "sl_SI",
        "so": "so_SO",
        "sq": "sq_AL",
        "sr": "sr_RS",
        "ss": "ss_ZA",
        "st": "st_ZA",
        "sv": "sv_SE",
        "ta": "ta_IN",
        "te": "te_IN",
        "tg": "tg_TJ",
        "th": "th_TH",
        "ti": "ti_ET",
        "tl": "tl_PH",
        "tn": "tn_ZA",
        "tr": "tr_TR",
        "ts": "ts_ZA",
        "tt": "tt_RU",
        "uk": "uk_UA",
        "ur": "ur_PK",
        "uz": "uz_UZ",
        "ve": "ve_ZA",
        "vi": "vi_VN",
        "wa": "wa_BE",
        "xh": "xh_ZA",
        "yi": "yi_US",
        "zh": "zh_CN"
    };

    _pExportItem._getCellLocale = function (cell, rowidx)
    {
        var locale = cell ? cell._getLocale(rowidx) : "";
        if (!locale)
        {
            const env = nexacro.getEnvironment();
            locale = env && env._p_locale ? env._p_locale : nexacro._getLocale();
        }

        locale = locale.replace(/-/g, "_");

        if (locale.length == 2)
        {
            var _loc = locale.toLowerCase();
            var ret = _pExportItem.__localeinfo[_loc];

            return (ret ? ret : locale);

        }

        return locale;
    };

    _pExportItem._find_styleName = function (dataset, type, value, count, delimiter)
    {
        var style_map;
        if (dataset.id == "STYLE")
        {
            style_map = this._style_map1;
            if (!style_map)
                style_map = this._style_map1 = {};
        }
        else if (dataset.id == "STYLE2")
        {
            style_map = this._style_map2;
            if (!style_map)
                style_map = this._style_map2 = {};
        }

        var style_arr;
        if (style_map)
            style_arr = style_map[type];
        else
            style_map = {};

        if (!style_arr)
        {
            style_arr = style_map[type] = [];
        }

        var len = style_arr.length;
        var style_name, val;
        if (len > 0)
        {
            for (var i = 0; i < len; i++)
            {
                val = style_map[type][i].value;
                if (value == val)
                {
                    style_name = style_map[type][i].name;
                    break;
                }
            }
        }

        if (!style_name)
        {
            style_name = type + (++count);
            style_map[type][len] = { value: value, name: style_name };

            var r_count = dataset.getRowCount();
            dataset.addRow();
            dataset.setColumn(r_count, "type", type);
            dataset.setColumn(r_count, "name", style_name);

            // var delimiter = String.fromCharCode(29);
            if (value)
            {
                val = value.toString();
                var extra_value = val.split(delimiter);
                if (extra_value.length > 1)
                {
                    value = extra_value[0];
                    var locale = extra_value[1];
                    dataset.setColumn(r_count, "locale", locale);
                }
            }
            dataset.setColumn(r_count, "value", value);

        }
        return [style_name, count];
    };

    _pExportItem._getFitValue = function (obj)
    {
        if (!obj)
            return;

        var str = this._fontParseInfo(obj._sysvalue);

        return str;
    };

    _pExportItem._getFitFontValue = function (fontval)
    {
        var size = this._default_size, face = this._default_face, type;
        var unit;

        if (fontval)
        {
            var font = new nexacro._FontObject(fontval);
            font._parseInfo(fontval);

            size = font.size;
            type = font.type;
            if (font.face)
                font.face = font.face.replace(/"/gi, "");
            face = font.face;
            unit = font._unit;

            if (unit == "px")
            {
                size = parseInt(nexacro._convertPxToPt(size));
            }
        }

        return type + "," + size + "," + face;
    };

    _pExportItem._getColortoRGB = function (color)
    {
        var rgb = "transparent";
        if (color)
        {
            if (typeof color == "object")
            {
                rgb = this._getHexColor(color.value.split(" ")[0]);
            }
            else if (typeof (color) == "string" && (color.indexOf("rgb(") >= 0) || (color.indexOf("RGB(") >= 0))
            {
                rgb = "rgbstring";
            }
            else if (typeof (color) == "string" && (color.indexOf("rgba(") >= 0) || (color.indexOf("RGBA(") >= 0))
            {
                rgb = "rgbastring";
            }
            else if (typeof (color) == "string" && (color.indexOf("hsl(") >= 0) || (color.indexOf("HSL(") >= 0))
            {
                rgb = "hslstring";
            }
            else if (typeof (color) == "string" && (color.indexOf("hsla(") >= 0) || (color.indexOf("HSLA(") >= 0))
            {
                rgb = "hslastring";
            }
            else
            {
                rgb = this._getHexColor(color);
            }
            var style_a = [];

            if (rgb === "")
            {
                rgb = color._value;
                if (rgb === undefined)
                {
                    rgb = color.value;
                    if (typeof (rgb) == "string" && ((rgb.indexOf("rgb(") >= 0) || (rgb.indexOf("RGB(") >= 0) || (rgb.indexOf("rgba(") >= 0) || (rgb.indexOf("RGBA(") >= 0)))
                    {
                        rgb = this._getRGBAtoRGB(rgb);
                    }
                    else if (typeof (rgb) == "string" && ((rgb.indexOf("hsl(") >= 0) || (rgb.indexOf("HSL(") >= 0) || (rgb.indexOf("hsla(") >= 0) || (rgb.indexOf("HSLA(") >= 0)))
                    {
                        rgb = this._getHSLAtoRGB(rgb);
                    }
                }
            }
            else
            {
                if (rgb.indexOf("#") > -1)
                {
                    style_a.push(parseInt(rgb.substring(1, 3), 16));
                    style_a.push(parseInt(rgb.substring(3, 5), 16));
                    style_a.push(parseInt(rgb.substring(5, 7), 16));
                    rgb = style_a.join(",");
                }
                else if (rgb == "rgbstring" || rgb == "rgbastring")
                {
                    rgb = this._getRGBAtoRGB(color);
                }
                else if (rgb == "hslstring" || rgb == "hslastring")
                {
                    rgb = this._getHSLAtoRGB(color);
                }
                else if (rgb == "transparent")
                {
                    rgb = "transparent";
                }
                else
                {
                    var start = rgb.indexOf("(");
                    var end = rgb.indexOf(")");
                    style_a = rgb.substring(start + 1, end - 1).split(",");
                    style_a.pop();
                    rgb = style_a.join(",");
                }
            }
        }
        return rgb;
    };

    _pExportItem._getHSLAtoRGB = function (color)
    {
        var rgb = "transparent";
        var strbegin = color.indexOf("(") + 1;
        var strend = color.indexOf(")");

        color = color.substring(strbegin, strend);
        color = color.split(",");

        var len = color.length;

        if (len == 4 && color[3] == 0)
        {
            rgb = "transparent";
        }
        else
        {
            var rs = color[0].trim();
            var gs = color[1].trim();
            var bs = color[2].trim();

            gs = gs.substring(0, gs.indexOf("%"));
            gs = gs / 100;

            bs = bs.substring(0, bs.indexOf("%"));
            bs = bs / 100;

            function hueToRgb(t1, t2, hue)
            {
                if (hue < 0) hue += 6;
                if (hue >= 6) hue -= 6;
                if (hue < 1) return (t2 - t1) * hue + t1;
                else if (hue < 3) return t2;
                else if (hue < 4) return (t2 - t1) * (4 - hue) + t1;
                else return t1;
            }

            function hslToRgb(hue, sat, light)
            {
                var t1, t2, r, g, b;
                hue = hue / 60;
                if (light <= 0.5)
                {
                    t2 = light * (sat + 1);
                }
                else
                {
                    t2 = light + sat - (light * sat);
                }

                t1 = light * 2 - t2;
                r = hueToRgb(t1, t2, hue + 2) * 255;
                g = hueToRgb(t1, t2, hue) * 255;
                b = hueToRgb(t1, t2, hue - 2) * 255;

                return parseInt(r) + "," + parseInt(g) + "," + parseInt(b);
            }

            rgb = hslToRgb(rs, gs, bs);
        }

        return rgb;
    };

    _pExportItem._getRGBAtoRGB = function (color)
    {
        var rgb = "transparent";
        var strbegin = color.indexOf("(") + 1;
        var strend = color.indexOf(")");

        color = color.substring(strbegin, strend);
        color = color.split(",");

        var len = color.length;

        for (var i = 0; i < len; i++)
        {
            if (i > 2)
                color[i] = parseFloat(color[i]);    // rgba 에서 alpha값의 경우 소수값임
            else
                color[i] = parseInt(color[i]);
        }

        if (len == 4 && color[3] == 0)
        {
            rgb = "transparent";    // rgba의 alpha값이 0인경우 transparent 처리
        }
        else if (len == 4)
        {
            rgb = color.join(",");
            rgb = rgb.substring(0, rgb.lastIndexOf(","));
        }
        else
        {
            rgb = color.join(",");
        }

        return rgb;
    };

    _pExportItem._makeforDsStyle = function (ds_style, align, background, color, font, line, cell_type, row_merge, col_merge)
    {
        var rt, style_name = "";
        var cellStyleinfo = "";

        var delimiter = this._p_parent ? this._p_parent._commdatadelimiter : String.fromCharCode(29);

        if (this._applyA)
        {
            rt = this._find_styleName(ds_style, "align", align, this._a_ct, delimiter);
            style_name = rt[0];
            this._a_ct = rt[1];
            cellStyleinfo += "align:" + style_name + ",";
        }
        if (this._applyB)
        {
            rt = this._find_styleName(ds_style, "background", background, this._bg_ct, delimiter);
            style_name = rt[0];
            this._bg_ct = rt[1];
            cellStyleinfo += "background:" + style_name + ",";
        }
        if (this._applyC)
        {
            rt = this._find_styleName(ds_style, "color", color, this._c_ct, delimiter);
            style_name = rt[0];
            this._c_ct = rt[1];
            cellStyleinfo += "color:" + style_name + ",";
        }
        if (this._applyF)
        {
            rt = this._find_styleName(ds_style, "font", font, this._f_ct, delimiter);
            style_name = rt[0];
            this._f_ct = rt[1];
            cellStyleinfo += "font:" + style_name + ",";
        }

        line = line.replace(/transparent,[^:]*/g, "empty");

        rt = this._find_styleName(ds_style, "line", line, this._l_ct, delimiter);
        style_name = rt[0];
        this._l_ct = rt[1];
        cellStyleinfo += "line:" + style_name + ",";

        rt = this._find_styleName(ds_style, "type", cell_type, this._t_ct, delimiter);
        style_name = rt[0];
        this._t_ct = rt[1];
        cellStyleinfo += "type:" + style_name;

        if (row_merge > 1)
        {
            rt = this._find_styleName(ds_style, "rowsuppress", row_merge, this._sm_ct, delimiter);
            style_name = rt[0];
            this._sm_ct = rt[1];
            cellStyleinfo += ",rowsuppress:" + style_name;
        }
        if (col_merge > 1)
        {
            rt = this._find_styleName(ds_style, "colsuppress", col_merge, this._sm_ct, delimiter);
            style_name = rt[0];
            this._sm_ct = rt[1];
            cellStyleinfo += ",colsuppress:" + style_name;
        }

        rt = this._find_styleName(ds_style, "style", cellStyleinfo, this._s_ct, delimiter);
        style_name = rt[0];
        this._s_ct = rt[1];

        return style_name;
    };

    _pExportItem._checkExpr = function (obj, cssclass)
    {
        if (cssclass && cssclass._bindtype > 0)
        {
            return true;
        }

        if (obj && obj._bindtype > 0)
            return true;

        return false;
    };

    _pExportItem._checkGradation = function (background)
    {
        //      if (background._value.match(/@gradation/))
        //          return true;
        return false;
    };

    _pExportItem._getHexColor = function (color)
    {
        color = color.toLowerCase();
        var v = nexacro._xreNamedColorList[color];
        if (v)
        {
            return v;
        }

        var len = color.length;
        if (color.substring(0, 1) == '#')
        {
            if (len == 7)
            {
                return color;
            }
            if (len > 7)
            {
                return color.substr(0, 7);
            }
        }
        if (color.substring(0, 2) == "0x")
        {
            if (len == 8)
            {
                return "#" + color.substring(2);
            }
            if (len == 10)
            {
                return "#" + color.substring(2, 8);
            }
        }
        return "";
    };

    _pExportItem._getGradationColor = function (gradation)
    {
        var gColor;
        var gColor2;
        var gArr = [];
        if (gradation)
        {
            gColor = gradation._value;
            if (gColor != "")
            {
                gColor = this._getHexColor(gradation.start_color);
                gColor2 = this._getHexColor(gradation.end_color);

                if (gColor.indexOf("#") > -1)
                {
                    var name = gColor + gColor2;
                    if (this._stylecache[name])
                    {
                        return this._stylecache[name];
                    }
                    else
                    {
                        gArr.push(Math.round((parseInt(gColor.substring(1, 3), 16) + parseInt(gColor2.substring(1, 3), 16)) / 2));
                        gArr.push(Math.round((parseInt(gColor.substring(3, 5), 16) + parseInt(gColor2.substring(3, 5), 16)) / 2));
                        gArr.push(Math.round((parseInt(gColor.substring(5), 16) + parseInt(gColor2.substring(5), 16)) / 2));
                        gColor = gArr.join(",");
                        this._stylecache[name] = gColor;
                    }
                }
                return gColor;
            }
        }
        return "";
    };

    _pExportItem._getGradationColor = function (gColor, gColor2)
    {
        var gArr = [];

        if (gColor != "")
        {
            gColor = this._getColortoRGB(gColor);
            gColor2 = this._getColortoRGB(gColor2);

            var name = gColor + gColor2;
            if (this._stylecache[name])
            {
                return this._stylecache[name];
            }
            else
            {
                gColor = gColor.split(',');
                gColor2 = gColor2.split(',');
                gArr.push(Math.round((parseInt(gColor[0]) + parseInt(gColor2[0])) / 2));
                gArr.push(Math.round((parseInt(gColor[1]) + parseInt(gColor2[1])) / 2));
                gArr.push(Math.round((parseInt(gColor[2]) + parseInt(gColor2[2])) / 2));
                gColor = gArr.join(",");
                this._stylecache[name] = "rgb(" + gColor + ")";
            }

            return "rgb(" + gColor + ")";
        }

        return "";
    };

    _pExportItem._getGradientValue = function (background)
    {
        var bk = nexacro.BackgroundObject(background);
        if (bk)
        {
            if (bk.gradient)
            {
                bk.gradient._parseInfo(bk.gradient.value);
                if (bk.gradient.color_stops)
                {
                    var len = bk.gradient.color_stops.length;
                    var startcolor = bk.gradient.color_stops[0];
                    var endcolor = bk.gradient.color_stops[len - 1];
                    background = this._getGradationColor(nexacro.ColorObject(startcolor.color), nexacro.ColorObject(endcolor.color));

                    return background;
                }
            }
        }

        return "transparent";
    };

    _pExportItem._getCellBodyStyle = function (cell, idx)
    {
        var align, background, background2, color, color2, font, line, gradation2,
            c_style, c_style2, _background2, _color2;

        var ds_style = this._ds_style;
        var flag = false;
        var viewType = cell._getDisplaytype(0); // displaytype이 expr일 경우 어떻게?? 현재는 0번째 row가 기준
        var _linestyle = "empty:empty:empty:empty";
        var linecolor = { vertical: "empty", horizon: "empty", vertical1: "empty", horizon1: "empty" };

        align = cell._query_status_align(0, viewType, null, true);
        if (align == ",")
            align = "left,";
        if (cell._getVirtualMergeInfo(0 + 2))
        {
            var cells = cell._grid._getTempCell(idx, 0, null, null, null, true);
            var cell_control = cells.cell;
            background = cell.background || cell_control._getCSSStyleValue("background");
            color = cell.color || cell_control._getCSSStyleValue("color");
        }
        else
        {
            background = cell._query_status_background(0, null, true);
            color = cell._query_status_color(0, null, true);
        }
        if (background && background.indexOf("linear-gradient") >= 0)
        {
            background = this._getGradientValue(background);
        }
        font = cell._query_status_font(0, null, true);

        if (this._applyL)
        {
            line = cell._query_status_border(0, null, true);
        }

        if (cell._getVirtualMergeInfo(1 + 2))
        {
            background2 = cell.background;
            color2 = cell.color;
        }
        else
        {
            background2 = cell._query_status_background(1, null, true);
            color2 = cell._query_status_color(1, null, true);
        }
        if (background2 && background2.indexOf("linear-gradient") >= 0)
        {
            background2 = this._getGradientValue(background2);
        }
        var _background;

        var _align = align;
        if (this._checkGradation(background))
        {
            // todo?
            /*
            gradation = cell._stylecache["gradationfalsefalsenormal"];
            if (!gradation)
            {
                gradation = cell.style.gradation;
                if (!gradation)
                {
                    gradation = cell._query_pseudo_gradation(0, false, false, "normal");
                }
            }
            var _background = this._getGradationColor(gradation);
            */
        }
        else
        {
            _background = this._getColortoRGB(background);
        }

        var _color = this._getColortoRGB(color);
        var _font = nexacro._nvl(this._getFitFontValue(font), "");
        var textdecoration = this._getCellStyle(cell, 0, false, "textDecoration", "enabled");
        if (textdecoration)
            _font = textdecoration + "," + _font;

        if (this._applyL && line)
        {
            if (line.right && line.right.style != "none" && line.right._width != 0)
            {
                if (line.right.color == "transparent")
                {
                    linecolor.vertical = "empty";
                }
                else
                {
                    linecolor.vertical = this._getColortoRGB(line.right.color) + (line.right.style == "solid" ? "" : "," + line.right.style);
                }
            }

            if (line.left && line.left.style != "none" && line.left._width != 0)
            {
                if (line.left.color == "transparent")
                {
                    linecolor.vertical1 = "empty";
                }
                else
                {
                    linecolor.vertical1 = this._getColortoRGB(line.left.color) + (line.left.style == "solid" ? "" : "," + line.left.style);
                }
            }

            if (line.bottom && line.bottom.style != "none" && line.bottom._width != 0)
            {
                if (line.bottom.color == "transparent")
                {
                    linecolor.horizon = "empty";
                }
                else
                {
                    linecolor.horizon = this._getColortoRGB(line.bottom.color) + (line.bottom.style == "solid" ? "" : "," + line.bottom.style);
                }
            }

            if (line.top && line.top.style != "none" && line.top._width != 0)
            {
                if (line.top.color == "transparent")
                {
                    linecolor.horizon1 = "empty";
                }
                else
                {
                    linecolor.horizon1 = this._getColortoRGB(line.top.color) + (line.top.style == "solid" ? "" : "," + line.top.style);
                }

            }

            if (this._applyHead)
            {
                _linestyle = (cell._col == 0 ? linecolor.vertical1 : "empty") + ":" + "empty" + ":";
            }
            else
            {
                _linestyle = (cell._col == 0 ? linecolor.vertical1 : "empty") + ":" + (cell._row == 0 ? linecolor.horizon1 : "empty") + ":";
            }

            _linestyle += linecolor.vertical + ":" + linecolor.horizon;
            // linestyle : L T R B
        }

        if (this._checkExpr(align, cell.cssclass))
        {
            _align = undefined;
        }
        else
        {
            this._stylecache[idx + "align"] = _align;
        }

        if (this._checkExpr(background, cell.cssclass))
        {
            _background = undefined;
        }
        else
        {
            this._stylecache[idx + "background0"] = _background;
        }

        if (this._checkExpr(color, cell.cssclass))
        {
            _color = undefined;
        }
        else
        {
            this._stylecache[idx + "color0"] = _color;
        }

        if (this._checkExpr(font, cell.cssclass))
        {
            _font = undefined;
        }
        else
        {
            this._stylecache[idx + "font"] = _font;
        }

        if (this._checkExpr(line, cell.cssclass))
        {
            //_line = undefined;
        }
        else
        {
            this._stylecache[idx + "line"] = _linestyle;
        }

        if (background2)
        {
            if (this._checkGradation(background2))
            {
                gradation2 = cell._stylecache.gradationtruefalsenormal;
                if (!gradation2)
                {
                    gradation2 = cell.style.gradation2;
                    if (!gradation2)
                    {
                        gradation2 = cell._query_pseudo_gradation(0, true, false, "enabled");
                    }
                }
                _background2 = this._getGradationColor(gradation2);
            }
            else
            {
                _background2 = this._getColortoRGB(background2);
            }
            if (this._checkExpr(background2, cell.cssclass))
            {
                _background2 = undefined;
            }
            else
            {
                this._stylecache[idx + "background1"] = _background2;
            }
            if (_background != _background2)
            {
                flag = true;
            }
        }
        else
        {
            this._stylecache[idx + "background1"] = _background2 = _background;
        }

        if (color2)
        {
            _color2 = this._getColortoRGB(color2);
            if (this._checkExpr(color2, cell.cssclass))
            {
                _color2 = undefined;
            }
            else
            {
                this._stylecache[idx + "color1"] = _color2;
            }
            if (_color != _color2)
            {
                flag = true;
            }
        }
        else
        {
            this._stylecache[idx + "color1"] = _color2 = _color;
        }

        var cell_type = this._getFixedCellType(cell, 0);
        c_style = this._makeforDsStyle(ds_style, _align, _background, _color, _font, _linestyle, cell_type);
        if (flag)
        {
            c_style2 = this._makeforDsStyle(ds_style, _align, _background2, _color2, _font, _linestyle, cell_type);
        }

        var subCell = cell._subcells;
        var subL = subCell.length;
        if (subL)
        {
            var subCellFormat = "";
            for (var i = 0; i < subL; i++)
            {
                subCellFormat += this._modifyFormat(subCell[i], c_style, c_style2, 0, cell);
            }
            return subCellFormat;
        }
        else
        {
            return this._modifyFormat(cell, c_style, c_style2, 0);
        }

    };

    _pExportItem._getFixedCellType = function (cell, rowidx)
    {
        var cell_type = cell._getDisplaytype(rowidx);
        var displaytype = "";
        var format;
        var posttext;
        var exportObj = this._p_parent;

        if (exportObj._is_export_ex)
        {
            var orgv_cells = this._orgvalue_cells;
            if (orgv_cells)
            {
                var orgv_bands = this._orgvalue_bands;
                var band = (rowidx > -1) ? "body" : (rowidx > -2) ? "head" : "summ";
                var is_orgvalueband = false;
                if (!nexacro._isNull(orgv_bands) && !nexacro._isNull(orgv_bands[band]))
                {
                    is_orgvalueband = true;
                }

                if (!orgv_cells[cell._cellidx] || !is_orgvalueband)
                {
                    return "text";
                }
            }
        }

        switch (cell_type)
        {
            case "number":
                break;
            case "maskeditcontrol":
            case "mask":
                format = cell._getAttrValue(cell._p_maskeditformat, rowidx);
                posttext = cell._getAttrValue(cell._p_maskeditpostfixtext, rowidx);
                if (format != null && format.length != 0)
                {
                    displaytype = format;
                    if (posttext)
                        displaytype += posttext;
                }

                var masktype = cell._getAttrValue(cell._p_maskedittype, rowidx);
                if (masktype == "number")
                    cell_type = "number";
                else
                {
                    cell_type = "text";
                    displaytype = "";
                }
                break;
            case "calendarcontrol":
            case "date":
            case "time":
            case "datetime":
                cell_type = "date";
                var locale;
                format = cell._getAttrValue(cell._p_calendardateformat, rowidx);
                if (format == null || format.length == 0 || !format.match(/LONGDATE|SHORTDATE|[yMdHhms]/))
                {
                    format = "yyyy-MM-dd";
                }
                else
                {
                    locale = cell._getLocale(rowidx);

                    if (format == "SHORTDATE")
                    {
                        format = nexacro.Locale._makeDateMaskString(locale, format);
                        if (format == "")
                            format = nexacro.Locale._default_shortdate_format;
                    }
                    else if (format == "LONGDATE")
                    {
                        format = nexacro.Locale._makeDateMaskString(locale, "SHORTDATE");
                        if (format == "")
                            format = nexacro.Locale._default_longdate_format;
                    }
                }
                displaytype = format;

                // add locale info start
                locale = this._getCellLocale(cell, rowidx);
                var delimiter = exportObj._commdatadelimiter;//String.fromCharCode(29);

                if (locale)
                    displaytype += delimiter + locale;
                // add locale info end

                break;
            case "imagecontrol":
                if (this.exportimage.toLowerCase() == "image")
                {
                    displaytype += "image";
                    var _imgstretch = cell._getAttrValue(cell._p_imagestretch, rowidx);
                    if (_imgstretch)
                        displaytype += "," + _imgstretch;
                }
                cell_type = "text";
                break;
            case "text":
                if (cell._getAttrValue(cell._p_displaytype, rowidx) == "normal")
                {
                    cell_type = "normal";
                }
                else
                {
                    cell_type = "text";
                }
                break;
            default:
                cell_type = "text";
                break;
        }
        return cell_type + (displaytype ? ":" + displaytype : "");
    };

    _pExportItem._modifyFormat = function (cell, style1, style2, rowidx, mainCell, virtual_merge_value)
    {
        var text, temp_str, str;
        temp_str = str = "";
        // var subcells = cell._subcells;
        // var subLen = subcells ? subcells.length : 0;
        var colspan = cell._colspan;
        var rowspan = cell._rowspan;
        var row = cell._row;
        var col = cell._col;
        var _row = row;
        var _col = col;
        var displaytype = cell._getDisplaytype(rowidx);

        if (rowidx < 0)
        {
            text = cell._getDisplayText(rowidx);
            if (displaytype == "decoratetext")
            {
                text = nexacro._getDisplayTextfromDecorateText(text);
            }
            else if (displaytype == "imagecontrol")
            {
                var expImg = this._p_exportimage.toLowerCase();
                if (expImg == "url" || expImg == "image")
                {
                    var path = this._getCellText(this.source, rowidx, cell._cellidx);

                    if (path)
                    {
                        var url = nexacro._getURIValue(path);
                        text = nexacro._getImageLocation(url, this._getForm()._getFormBaseUrl());
                    }
                    else
                    {
                        text = path;
                    }
                }
                else
                {
                    text = "";
                }
            }
            else if (text && displaytype == "mask")
            {
                var maskeditpostfixtext = cell._getAttrValue(cell._p_maskeditpostfixtext, rowidx);
                if (maskeditpostfixtext)
                {
                    text = text.replace(maskeditpostfixtext, "");
                }
            }
        }
        else
            text = cell.text._value;

        if (nexacro._isString(text))
            text = nexacro._encodeXml(text);

        if (mainCell)
        {
            row = _row + mainCell._row;
            col = _col + mainCell._col;
        }

        str += "<Cell ";
        str += "row=\"" + row + "\" col=\"" + col + "\" ";

        temp_str += "rowspan=\"" + rowspan + "\" ";
        temp_str += "colspan=\"" + colspan + "\" ";


        if (this._exportmerge == 1)
        {
            if (virtual_merge_value != null)
            {
                text = virtual_merge_value;
            }
        }
        else if (this._exportmerge == 2)
        {
            if (virtual_merge_value != null)
            {
                temp_str = virtual_merge_value;
            }
        }

        str += temp_str;

        if (text)
        {
            str += "text=\"" + text + "\" ";
        }

        var dataType = "";
        // var grid = this.source;

        str += "style1=\"" + style1 + "\" ";

        if (style2)
        {
            str += "style2=\"" + style2 + "\" ";
        }

        var cType = cell._p_displaytype;
        if (cType)
        {
            dataType = displaytype;
            switch (dataType)
            {
                case "imagecontrol":
                    if (this._p_exportimage.toLowerCase() == "image")
                    {
                        str += "displaytype=\"imagecontrol\" ";
                    }
                case "text":
                    dataType = "string";
                    break;
                case "number":
                    dataType = "int";
                    break;
                case "calendarcontrol":
                case "date":
                case "time":
                case "datetime":
                    dataType = "date";
                    var format = cell._getAttrValue(cell._p_calendardateformat, rowidx);
                    if (format == null || format.length == 0 || !format.match(/[yMdHhms]/))
                    {
                        format = "yyyy-MM-dd";
                    }
                    str += "displaytype=\"" + format + "\" ";
                    break;
                default:
                    dataType = "text";
                    break;
            }
            str += "type=\"" + dataType + "\" ";
        }
        str += "/>";

        return str;
    };

    _pExportItem._getSubCellLine = function (subCell, defaultColor, linecolor, rsp, csp)
    {
        var lLine, tLine, rLine, bLine;

        var sbc = subCell._col;
        var sbr = subCell._row;

        if (sbc == csp)
        {
            rLine = linecolor.vertical;
        }
        else
        {
            rLine = "empty";
        }
        if (sbc == 0)
        {
            lLine = defaultColor.vertical;
        }
        else
        {
            lLine = "empty";
        }
        if (sbr == rsp)
        {
            bLine = linecolor.horizon;
        }
        else
        {
            bLine = "empty";
        }
        if (sbr == 0)
        {
            tLine = defaultColor.horizon;
        }
        else
        {
            tLine = "empty";
        }

        return lLine + ":" + tLine + ":" + rLine + ":" + bLine;
    };

    _pExportItem._makeVirtualLine = function (str, color, type)
    {
        var linestyle_str;
        switch (str)
        {
            case "topvirtual":
            case "bottomvirtual":
                linestyle_str = "empty:empty:" + color.vertical + ":empty";
                break;
            case "rightvirtual":
                if (type) // head
                {
                    linestyle_str = "empty:empty:empty:" + color.horizon;
                }
                else
                {
                    linestyle_str = "empty:" + color.horizon + ":empty:empty";
                }
                break;
            case "righttopvirtual":
            case "rightbottomvirtual":
                linestyle_str = "empty:empty:empty:empty";
                break;
            default:
                if (type) // head
                {
                    linestyle_str = "empty:empty:" + color.vertical + ":" + color.horizon;
                }
                else
                {
                    linestyle_str = "empty:" + color.horizon + ":" + color.vertical + ":empty";
                }
                break;
        }
        return linestyle_str;
    };

    _pExportItem._makeFormat = function (grid)
    {
        var bg, align, font, textdecoration, color, line, style, cell, subCell, background, gradation;

        var format = grid._curFormat;
        var hCells = format._headcells;
        var hLen = hCells ? hCells.length : 0;
        var bCells = format._bodycells;
        var bLen = bCells ? bCells.length : 0;
        var sCells = format._summcells;
        var sLen = sCells ? sCells.length : 0;
        var str = "";
        var ds_style = this._ds_style;
        var linecolor;// = { vertical: "empty", horizon: "empty" };
        var linestyle;// = "empty:empty:empty:empty";
        var subL = 0;
        var f_cols = format._cols;
        var f_hrows = format._headrows;
        var f_brows = format._bodyrows;
        var f_srows = format._summrows;

        var i, j, fcLen, frLen;
        var cell_type;
        var need_merge_cell = false;
        var virtual_value = null;
        var merge_data, temp_align, merge_str;

        str = "<Formats><Format><Columns>";
        for (i = 0, fcLen = f_cols.length; i < fcLen; i++)
        {
            str += '<Column size="' + Math.round(f_cols[i].getSize()) + '" />';
        }
        str += "</Columns><Rows>";
        for (i = 0, frLen = f_hrows ? f_hrows.length : 0; i < frLen; i++)
        {
            str += '<Row size="' + Math.round(f_hrows[i].size) + '" band="head" />';
        }
        for (i = 0, frLen = f_brows ? f_brows.length : 0; i < frLen; i++)
        {
            str += '<Row size="' + Math.round(f_brows[i].size) + '" />';
        }
        for (i = 0, frLen = f_srows ? f_srows.length : 0; i < frLen; i++)
        {
            str += '<Row size="' + Math.round(f_srows[i].size) + '" band="summ" />';
        }
        str += "</Rows>";

        if (hLen > 0 && this._applyHead)
        {
            str += "<Head>";
            for (i = 0; i < hLen; i++)
            {
                if (nexacro._Browser == "Runtime")
                    nexacro._peekWindowHandleMessageQueuePassing(this._getWindow());

                cell = hCells[i];
                background = this._getCellStyle(cell, -1, false, "background", "enabled");
                if (this._checkGradation(background))
                {
                    gradation = this._getCellStyle(cell, -1, false, "gradation", "enabled");
                    bg = this._getGradationColor(gradation);
                }
                else
                {
                    bg = this._getColortoRGB(background);
                }

                align = this._getCellStyle(cell, -1, false, "align", "enabled");
                font = this._getFitFontValue(this._getCellStyle(cell, -1, false, "font", "enabled"));
                textdecoration = this._getCellStyle(cell, -1, false, "textDecoration", "enabled");
                if (textdecoration)
                    font = textdecoration + "," + font;

                color = this._getColortoRGB(this._getCellStyle(cell, -1, false, "color", "enabled"));
                linecolor = { vertical: "empty", horizon: "empty", vertical1: "empty", horizon1: "empty" };

                if (this._applyL)
                {
                    line = this._getCellStyle(cell, -1, false, "border", "enabled");

                    if (line)
                    {
                        if (line.right && line.right.style != "none" && line.right._width != 0)
                        {
                            if (line.right.color == "transparent")
                            {
                                linecolor.vertical = "empty";
                            }
                            else
                            {
                                linecolor.vertical = this._getColortoRGB(line.right.color) + (line.right.style == "solid" ? "" : "," + line.right.style);
                            }
                        }

                        if (line.left && line.left.style != "none" && line.left._width != 0)
                        {
                            if (line.left.color == "transparent")
                            {
                                linecolor.vertical1 = "empty";
                            }
                            else
                            {
                                linecolor.vertical1 = this._getColortoRGB(line.left.color) + (line.left.style == "solid" ? "" : "," + line.left.style);
                            }
                        }

                        if (line.bottom && line.bottom.style != "none" && line.bottom._width != 0)
                        {
                            if (line.bottom.color == "transparent")
                            {
                                linecolor.horizon = "empty";
                            }
                            else
                            {
                                linecolor.horizon = this._getColortoRGB(line.bottom.color) + (line.bottom.style == "solid" ? "" : "," + line.bottom.style);
                            }
                        }

                        if (line.top && line.top.style != "none" && line.top._width != 0)
                        {
                            if (line.top.color == "transparent")
                            {
                                linecolor.horizon1 = "empty";
                            }
                            else
                            {
                                linecolor.horizon1 = this._getColortoRGB(line.top.color) + (line.top.style == "solid" ? "" : "," + line.top.style);
                            }
                        }
                    }
                }

                cell_type = this._getFixedCellType(cell, -1);
                subCell = cell._subcells;
                subL = subCell.length;
                if (subL)
                {
                    for (j = 0; j < subL; j++)
                    {
                        linestyle = this._getSubCellLine(subCell[j], linecolor, linecolor, cell._rowspan - 1, cell._colspan - 1);
                        style = this._makeforDsStyle(ds_style, align, bg, color, font, linestyle, cell_type);
                        str += this._modifyFormat(subCell[j], style, null, -1, cell);
                    }
                }
                else
                {
                    linestyle = (cell._col == 0 ? linecolor.vertical1 : "empty") + ":" + (cell._row == 0 ? linecolor.horizon1 : "empty") + ":";
                    linestyle += linecolor.vertical + ":" + linecolor.horizon; //default line
                    // linestyle : L T R B

                    need_merge_cell = false;
                    virtual_value = null;

                    if (this._exportmerge == 1) // set "suppress"
                    {
                        if (!!grid._checkVirtualMerge(cell, -1))
                        {
                            linestyle = this._makeVirtualLine(cell._getVirtualMergeInfo(1).remove, linecolor, true);
                            virtual_value = "";

                            merge_data = this._getMergeDatas(-1, i);
                            if (merge_data)
                            {
                                if (merge_data.isVirtualStart)
                                {
                                    virtual_value = nexacro._encodeXml(cell._getDisplayText(-1));
                                    if (align != "left,top")
                                    {
                                        temp_align = align.split(",");
                                        merge_str = merge_data[temp_align[1]] + "_" + merge_data[temp_align[0]];
                                        if (this._merge_datas[merge_str])
                                        {
                                            this._merge_datas[merge_str].disPlayText = virtual_value;
                                            this._merge_datas[merge_str].showText = true;
                                        }
                                        else
                                        {
                                            this._merge_datas[merge_str] = {
                                                disPlayText: virtual_value,
                                                showText: true
                                            };
                                        }
                                    }
                                    virtual_value = "";
                                }
                                else if (merge_data.showText)
                                {
                                    virtual_value = merge_data.disPlayText;
                                }
                            }
                        }
                    }
                    else if (this._exportmerge == 2)
                    {
                        merge_data = this._getMergeDatas(-1, i);
                        if (merge_data)
                        {
                            if (merge_data.isVirtualStart)
                            {
                                virtual_value = "rowspan=\"" + merge_data.rowspan + "\" colspan=\"" + merge_data.colspan + "\" ";
                            }
                            else
                            {
                                need_merge_cell = true;
                            }
                        }
                    }

                    if (!need_merge_cell)
                    {
                        style = this._makeforDsStyle(ds_style, align, bg, color, font, linestyle, cell_type);
                        str += this._modifyFormat(cell, style, null, -1, false, virtual_value);
                    }
                }
            }
            str += "</Head>";
        }

        if (bLen > 0)
        {
            str += "<Body>";
            for (i = 0; i < bLen; i++)
            {
                if (nexacro._Browser == "Runtime")
                    nexacro._peekWindowHandleMessageQueuePassing(this._getWindow());

                cell = bCells[i];
                str += this._getCellBodyStyle(cell, i);
            }
            str += "</Body>";
        }

        if (sLen > 0 && this._applySumm)
        {
            str += "<Summary>";
            for (i = 0; i < sLen; i++)
            {
                if (nexacro._Browser == "Runtime")
                    nexacro._peekWindowHandleMessageQueuePassing(this._getWindow());

                cell = sCells[i];
                background = this._getCellStyle(cell, -2, false, "background", "enabled");
                if (this._checkGradation(background))
                {
                    gradation = this._getCellStyle(cell, -2, false, "gradation", "enabled");
                    bg = this._getGradationColor(gradation);
                }
                else
                {
                    bg = this._getColortoRGB(background);
                }
                align = this._getCellStyle(cell, -2, false, "align", "enabled");
                font = this._getFitFontValue(this._getCellStyle(cell, -2, false, "font", "enabled"));
                textdecoration = this._getCellStyle(cell, -2, false, "textDecoration", "enabled");
                if (textdecoration)
                    font = textdecoration + "," + font;

                color = this._getColortoRGB(this._getCellStyle(cell, -2, false, "color", "enabled"));
                linecolor = { vertical: "empty", horizon: "empty" };

                if (this._applyL)
                {
                    line = this._getCellStyle(cell, -2, false, "border", "enabled");

                    if (line)
                    {
                        if (line.right && line.right.style != "none" && line.right._width != 0)
                        {
                            linecolor.vertical = this._getColortoRGB(line.right.color) + (line.right.style == "solid" ? "" : "," + line.right.style);
                        }

                        if (grid._p_summarytype == "default")
                        {
                            if (line.top && line.top.style != "none" && line.top._width != 0)
                            {
                                linecolor.horizon = this._getColortoRGB(line.top.color) + (line.top.style == "solid" ? "" : "," + line.top.style);
                            }
                        }
                        else
                        {
                            if (line.bottom && line.bottom.style != "none" && line.bottom.width != 0)
                            {
                                linecolor.horizon = this._getColortoRGB(line.bottom.color) + (line.bottom.style == "solid" ? "" : "," + line.bottom.style);
                            }
                        }
                    }
                }

                cell_type = this._getFixedCellType(cell, -2);
                subCell = cell._subcells;
                subL = subCell.length;
                if (subL)
                {
                    for (j = 0; j < subL; j++)
                    {
                        linestyle = this._getSubCellLine(subCell[j], linecolor, linecolor, cell._rowspan - 1, cell._colspan - 1);
                        style = this._makeforDsStyle(ds_style, align, bg, color, font, linestyle, cell_type);
                        str += this._modifyFormat(subCell[j], style, null, -2, cell);
                    }
                }
                else
                {
                    need_merge_cell = false;
                    linestyle = linecolor.vertical + ":" + linecolor.horizon + ":" + linecolor.vertical + ":" + linecolor.horizon;
                    if (this._exportmerge == 1) // set "suppress"
                    {
                        if (!!grid._checkVirtualMerge(cell, -2))
                        {
                            linestyle = this._makeVirtualLine(cell._getVirtualMergeInfo(0).remove, linecolor);
                            virtual_value = "";

                            merge_data = this._getMergeDatas(-2, i);
                            if (merge_data)
                            {
                                if (merge_data.isVirtualStart)
                                {
                                    virtual_value = nexacro._encodeXml(cell._getDisplayText(-2));
                                    if (align != "left,top")
                                    {
                                        temp_align = align.split(",");
                                        merge_str = merge_data[temp_align[1]] + "_" + merge_data[temp_align[0]];
                                        if (this._merge_datas[merge_str])
                                        {
                                            this._merge_datas[merge_str].disPlayText = virtual_value;
                                            this._merge_datas[merge_str].showText = true;
                                        }
                                        else
                                        {
                                            this._merge_datas[merge_str] = {
                                                disPlayText: virtual_value,
                                                showText: true
                                            };
                                        }
                                        virtual_value = "";
                                    }
                                }
                                else if (merge_data.showText)
                                {
                                    virtual_value = merge_data.disPlayText;
                                }
                            }
                        }
                    }
                    else if (this._exportmerge == 2)
                    {
                        if (!!grid._checkVirtualMerge(cell, -2))
                        {
                            merge_data = this._getMergeDatas(-2, i);
                            if (merge_data)
                            {
                                if (merge_data.isVirtualStart)
                                {
                                    virtual_value = "rowspan=\"" + merge_data.rowspan + "\" colspan=\"" + merge_data.colspan + "\" ";
                                }
                                else
                                {
                                    need_merge_cell = true;
                                }
                            }
                        }
                    }

                    if (!need_merge_cell)
                    {
                        style = this._makeforDsStyle(ds_style, align, bg, color, font, linestyle, cell_type);
                        str += this._modifyFormat(cell, style, null, -2, false, virtual_value);
                    }
                }
            }
            str += "</Summary>";
        }

        str += "</Format></Formats>";
        return str;
    };

    _pExportItem._getForm = function ()
    {
        return this._p_parent._p_parent;
    };

    _pExportItem._eventExport = function (exportObj, type, row_index, selectCnt)
    {
        var eventtype = exportObj._p_exporteventtype;
        var itemIndex = exportObj._itemsIndex;
        var exportbar = exportObj._exportBar;
        if (eventtype != "none")
        {
            var row_num = row_index + 1;
            var processStr = "";
            var is_end = row_num == this._bodyRowCnt;
            var progress_pos = exportObj._progress_pos + row_num;
            if (eventtype == "item" && is_end)
            {
                this.on_fire_onprogress(exportObj, itemIndex, this.type, selectCnt == null ? row_index : selectCnt);
                if (exportbar)
                {
                    processStr = exportObj._getProcessStr(itemIndex + 1, progress_pos, exportObj._allRowCount);
                    exportbar._set_text(processStr);
                    exportbar._set_pos((itemIndex + 1) / exportObj._allCount * 100);
                }
            }
            else if (eventtype == "itemrecord")
            {
                this.on_fire_onprogress(exportObj, itemIndex, this._p_type, selectCnt == null ? row_index : selectCnt);
                if (exportbar)
                {
                    processStr = exportObj._getProcessStr(itemIndex + 1, row_num, this._bodyRowCnt);
                    exportbar._set_text(processStr);
                    exportbar._set_pos(row_num / this._bodyRowCnt * 100);
                }
            }
            else if (eventtype == "totalrecord")
            {
                this.on_fire_onprogress(exportObj, itemIndex, this._p_type, selectCnt == null ? row_index : selectCnt);
                if (exportbar)
                {
                    processStr = exportObj._getProcessStr(itemIndex + 1, progress_pos, exportObj._allRowCount);
                    exportbar._set_text(processStr);
                    exportbar._set_pos(progress_pos / exportObj._allRowCount * 100);
                }
            }

            if (progress_pos == exportObj._allRowCount && exportObj._p_exportmessagecomplete != "")
            {
                if (exportbar)
                {
                    exportbar._set_text(exportObj._p_exportmessagecomplete);
                }
            }
            if (is_end && exportbar)
            {
                if (eventtype == "itemrecord")
                    exportObj._progress_pos = progress_pos;
                else
                    exportObj._progress_pos += this._startRow - this._preStartRow;
            }
        }
    };

    _pExportItem._updateBarPos = function (exportObj, eventtype)
    {
        if (eventtype != "none" && exportObj._exportuitype)
        {
            var itemIndex = exportObj._itemsIndex + 1;
            var exportbar = exportObj._exportBar;
            exportObj._progress_pos += this._startRow - this._preStartRow;
            var processStr = "";
            var is_end = this._startRow == this._bodyRowCnt;
            if (eventtype == "item" && is_end)
            {
                processStr = exportObj._getProcessStr(itemIndex, exportObj._progress_pos, exportObj._allRowCount);
                exportbar._set_text(processStr);
                exportbar._set_pos(itemIndex / exportObj._allCount * 100);
            }
            else if (eventtype == "itemrecord")
            {
                processStr = exportObj._getProcessStr(itemIndex, this._startRow, this._bodyRowCnt);
                exportbar._set_text(processStr);
                exportbar._set_pos(this._startRow / this._bodyRowCnt * 100);
            }
            else if (eventtype == "totalrecord")
            {
                processStr = exportObj._getProcessStr(itemIndex, exportObj._progress_pos, exportObj._allRowCount);
                exportbar._set_text(processStr);
                exportbar._set_pos(exportObj._progress_pos / exportObj._allRowCount * 100);
            }
            if (exportObj._progress_pos == exportObj._allRowCount && exportObj._p_exportmessagecomplete != "")
            {
                exportbar._set_text(exportObj._p_exportmessagecomplete);
            }
        }
    };

    _pExportItem._rollbackSuppressInfo = function ()
    {
        var cells = this._p_source._curFormat._bodycells;
        var supLen = this._tmpSuppressInfos && this._tmpSuppressInfos.length;
        for (var i = 0; i < supLen; i++)
        {
            cells[i]._suppress_infos = this._tmpSuppressInfos.shift();
        }
    };

    _pExportItem._gridSuppressUpdate = function (grid, rowcount)
    {
        var cells = grid._curFormat._bodycells;
        var cLen = cells.length;
        this._tmpSuppressInfos = [];
        var i;

        for (i = 0; i < cLen; i++)
        {
            this._tmpSuppressInfos.push(cells[i]._suppress_infos);
        }

        grid._analyzeSuppress(true);

        for (i = 0; i < rowcount; i++)
        {
            if (nexacro._Browser == "Runtime")
                nexacro._peekWindowHandleMessageQueuePassing(this._getWindow());

            grid._suppressUpdateRow(i, 0, rowcount - 1, true);
        }
    };

    _pExportItem._gridExportContinue = function (exportObj)
    {
        var maskeditpostfixtext_table = undefined
        var grid = this._p_source;
        var ds_command = this._ds_command;

        ds_command.setColumn(0, "command", "export");
        ds_command.setColumn(0, "type", exportObj._exporttype);
        ds_command.setColumn(0, "item", grid.id);
        ds_command.setColumn(0, "seq", this._seq);
        ds_command.setColumn(0, "startrow", this._startRow);
        ds_command.setColumn(0, "instanceid", this._instanceId);
        ds_command.setColumn(0, "url", exportObj._fileURL);
        ds_command.setColumn(0, "summarytype", grid._p_summarytype);

        ds_command.setColumn(0, "range", this._p_range);
        ds_command.setColumn(0, "exportsize", this._p_exportsize);
        ds_command.setColumn(0, "exporthead", this._exporthead);
        ds_command.setColumn(0, "exportimage", this._p_exportimage);

        ds_command.setColumn(0, "exportfilename", exportObj._p_exportfilename);
        ds_command.setColumn(0, "exportfilepath", exportObj._p_exportfilepath);
        ds_command.setColumn(0, "format", "");
        ds_command.setColumn(0, "password", exportObj._file_pw);
        ds_command.setColumn(0, "wraptext", exportObj._wrap_text);
        ds_command.setColumn(0, "righttoleft", this._righttoleft);
        ds_command.setColumn(0, "separator", exportObj._p_separator ? exportObj._p_separator : exportObj._defaultseparator);
        ds_command.setColumn(0, "quotechar", exportObj._p_quotechar);
        ds_command.setColumn(0, "commandversion", exportObj._p_commandversion);


        var ds_style = this._ds_style;

        var ds_style2 = this._ds_style2;

        if (!ds_style2)
        {
            ds_style2 = this._ds_style2 = new nexacro.DatasetBase("STYLE2");
            ds_style2.addColumn("type", "String", 10);
            ds_style2.addColumn("name", "String", 32);
            ds_style2.addColumn("value", "String", 1024);
            ds_style2.addColumn("locale", "String", 32);   // extra_value[1] : locale
        }
        else
        {
            this._ds_style2.clearData();
        }

        delete this._ds_cell;
        var ds = new nexacro.DatasetBase("CELL");
        this._ds_cell = ds;

        var bodycntcell = grid.getCellCount("body");

        var bodycntrow = this._bodyRowCnt;

        var style_name;
        var pre_displaytype = "";
        var sFlag = false;

        // suppressinfo가 excel 통신중에 깨져서 갱신 시점을 변경
        if (this._exportmerge && grid._is_use_suppress && bodycntrow >= grid._bodyBand._get_rows().length)
        {
            this._gridSuppressUpdate(grid, bodycntrow);
        }

        var export_param = null;
        var export_dsparam = null;
        if (bodycntcell > 0)
        {
            for (var jj = 0; jj < bodycntcell; jj++)
            {
                ds.addColumn("Column" + jj, "String", 256);
            }

            var partitionRow = this._partitionRow + this._startRow;
            if (partitionRow >= bodycntrow)
            {
                partitionRow = bodycntrow;
                this._eof = true;
                export_param = this._p_parent._argsParam;
                export_dsparam = this._p_parent._argsDsParam;
            }

            var cells = grid._curFormat._bodycells;

            var is_selected = false;
            var rr = 0;
            var subcnt;
            var d_BLColor, merge_data, line, cell_type;

            var emptyCellFlag = false;
            var _win = this._getWindow();

            for (var k = this._startRow; k < partitionRow; k++)
            {
                if (nexacro._Browser == "Runtime")
                    nexacro._peekWindowHandleMessageQueuePassing(_win);

                subcnt = 0;
                var val, j;
                var selectChk = false;
                for (j = 0; j < bodycntcell; j++)
                {
                    selectChk = selectChk || grid.isSelectedCell(j, "body", k, -9);
                }
                var is_selectRec = this.exportselect == "selectrecord";
                var idx;
                if (selectChk || !is_selectRec)
                {
                    idx = ds.addRow();
                    if (is_selectRec)
                    {
                        this._eventExport(exportObj, this._p_type, k, this._selectcount++);
                    }
                    else
                    {
                        this._eventExport(exportObj, this._p_type, k);
                    }
                }
                else
                {
                    continue;
                }

                var odd = k % 2;
                var activate_select_style = (this.exportvalue == "selectstyle");
                for (j = 0; j < bodycntcell; j++)
                {
                    emptyCellFlag = false;
                    is_selected = grid.isSelectedCell(j, "body", k, -9);
                    if (!is_selected)
                    {
                        if (is_selectRec)
                        {
                            emptyCellFlag = true;
                        }
                    }
                    var backgroundCell;
                    var alignCell;
                    var fontCell;
                    var colorCell;
                    var lineCell;

                    // var bodyBand = grid._bodyBand;

                    var cell = cells[j];
                    var rowspan = cell._rowspan;
                    var suppress_infos = cell._suppress_infos;
                    var selected = is_selected && activate_select_style;

                    var iscssclassexpr = this._checkExpr(null, cell.cssclass);
                    var cssclasses = iscssclassexpr ? cell._getAttrValue(cell._p_cssclass, k) : "";

                    var cacheindex = j + (cssclasses ? cssclasses : "");
                    var selectedcc = selected ? "-c" : "";

                    var cacheA = this._stylecache[cacheindex + "align" + selectedcc];
                    var cacheL = this._stylecache[cacheindex + "line" + selectedcc];
                    var cacheB, cacheC, cacheF;

                    // support yet
                    /*
                    if (is_selected && activate_select_style)
                    {
                        selected = true;
                        cacheB = "";
                        cacheC = "";
                        cacheF = "";
                    }
                    else
                    */
                    {
                        if (emptyCellFlag)
                        {
                            cacheB = "255,255,255";
                            cacheC = "255,255,255";
                            d_BLColor = this._d_BLColor;
                            cacheL = d_BLColor + ":" + d_BLColor + ":" + d_BLColor + ":" + d_BLColor;
                            sFlag = true;
                        }
                        else
                        {
                            cacheB = this._stylecache[cacheindex + "background" + odd + selectedcc];
                            cacheC = this._stylecache[cacheindex + "color" + odd + selectedcc];
                        }
                        cacheF = this._stylecache[cacheindex + "font" + selectedcc];
                    }

                    if (!nexacro._isNull(cacheA))
                    {
                        alignCell = cacheA;
                        if (iscssclassexpr)
                            sFlag = true;
                    }
                    else
                    {
                        if (this._applyA)
                        {
                            sFlag = true;
                            alignCell = nexacro._nvl(this._getCellStyle(cell, k, odd, "align", selected), "");

                            if (iscssclassexpr)
                                this._stylecache[cacheindex + "align" + selectedcc] = alignCell;
                        }
                    }
                    if (!nexacro._isNull(cacheB))
                    {
                        backgroundCell = cacheB;
                        if (iscssclassexpr)
                            sFlag = true;
                    }
                    else
                    {
                        if (this._applyB)
                        {
                            sFlag = true;
                            backgroundCell = nexacro._nvl(this._getColortoRGB(this._getCellStyle(cell, k, odd, "background", selected)), "");

                            if (iscssclassexpr)
                                this._stylecache[cacheindex + "background" + odd + selectedcc] = backgroundCell;
                        }
                    }
                    if (!nexacro._isNull(cacheC))
                    {
                        colorCell = cacheC;
                        if (iscssclassexpr)
                            sFlag = true;
                    }
                    else
                    {
                        if (this._applyC)
                        {
                            sFlag = true;
                            colorCell = nexacro._nvl(this._getColortoRGB(this._getCellStyle(cell, k, odd, "color", selected)), "");

                            if (iscssclassexpr)
                                this._stylecache[cacheindex + "color" + odd + selectedcc] = colorCell;
                        }
                    }
                    if (!nexacro._isNull(cacheF))
                    {
                        fontCell = cacheF;
                        if (iscssclassexpr)
                            sFlag = true;
                    }
                    else
                    {
                        if (this._applyF)
                        {
                            sFlag = true;
                            fontCell = nexacro._nvl(this._getFitFontValue(this._getCellStyle(cell, k, odd, "font", selected)), "");
                            var textdecoration = this._getCellStyle(cell, k, odd, "textDecoration", selected);
                            if (textdecoration)
                                fontCell = textdecoration + "," + fontCell;

                            if (iscssclassexpr)
                                this._stylecache[cacheindex + "font" + selectedcc] = fontCell;
                        }
                    }

                    var is_line_changed = false,
                        left_linecolor = null,
                        top_linecolor = null,
                        right_linecolor = null,
                        bottom_linecolor = null,
                        linecolor;

                    var row_suppress_count = 0;
                    var col_suppress_count = 0;

                    var issupp = false;
                    switch (this._exportmerge)
                    {
                        case 0: // nosuppress
                            break;
                        case 1: // suppress
                            if (cell._getSuppress(k) > 0) //expr : 1, bind : 2
                            {
                                sFlag = is_line_changed = true;

                                if (suppress_infos[k])
                                {
                                    if (suppress_infos[k].border_proc)
                                    {
                                        bottom_linecolor = "empty";
                                    }

                                    if (suppress_infos[k].text_proc)
                                    {
                                        emptyCellFlag = true;
                                    }
                                }
                            }

                            grid._checkVirtualMerge(cell, k);

                            if (cell._getVirtualMergeInfo(k + 2))
                            {
                                var virtual_border_str = cell._getVirtualMergeInfo(k + 2).remove;
                                if (virtual_border_str)
                                {
                                    sFlag = is_line_changed = true;
                                    switch (virtual_border_str)
                                    {
                                        case "bottomvirtual":
                                            bottom_linecolor = "empty";
                                            break;
                                        case "rightbottomvirtual":
                                            right_linecolor = bottom_linecolor = "empty";
                                            break;
                                        case "rightvirtual":
                                            right_linecolor = "empty";
                                            break;
                                    }
                                }
                            }
                            break;
                        case 2: // merge
                            if (cell._getSuppress(k) > 0)
                            {
                                sFlag = is_line_changed = true;
                                if (rowspan > 1)
                                    issupp = true;
                                var column_suppress = j + "count";
                                var excel_suppress_info = this._excel_suppress_info;
                                if (!excel_suppress_info[column_suppress])
                                {
                                    excel_suppress_info[column_suppress] = 0;
                                    alignCell = alignCell.split(",")[0] + "," + this._suppress_align_table[cell.suppressalign];
                                }

                                if (suppress_infos[k] && suppress_infos[k].border_proc)
                                {
                                    this._excel_suppress_info[column_suppress]++;
                                }
                                else
                                {
                                    row_suppress_count = ++excel_suppress_info[column_suppress];
                                    if (issupp)
                                        row_suppress_count = row_suppress_count * rowspan;

                                    if (issupp && row_suppress_count == 1)
                                        issupp = false;
                                    excel_suppress_info[column_suppress] = 0;
                                }
                            }

                            merge_data = this._getMergeDatas(k, j);
                            if (merge_data && merge_data.isVirtualEnd)
                            {
                                sFlag = is_line_changed = true;
                                row_suppress_count = merge_data.rowspan;
                                col_suppress_count = merge_data.colspan;
                            }
                            break;
                    }

                    if (grid._supphorztype > 0)
                    {
                        if (cell._area == "left" || cell._area == "right")
                        {
                            sFlag = is_line_changed = true;

                            if (suppress_infos[k])
                            {
                                if (suppress_infos[k].horz_text_proc)
                                {
                                    emptyCellFlag = true;
                                }
                            }
                        }
                    }

                    if (!is_line_changed && !nexacro._isNull(cacheL))
                    {
                        lineCell = cacheL;
                        if (iscssclassexpr)
                            sFlag = true;
                    }
                    else // suppress
                    {
                        if (this._applyL)
                        {
                            line = this._getCellStyle(cell, k, odd, "border", selected);
                            if (!left_linecolor)
                            {
                                left_linecolor = this._getColortoRGB(line.left.color) + (line.left.style == "solid" ? "" : "," + line.left.style);
                            }
                            if (!top_linecolor)
                            {
                                top_linecolor = this._getColortoRGB(line.top.color) + (line.top.style == "solid" ? "" : "," + line.top.style);
                            }
                            if (!right_linecolor)
                            {
                                right_linecolor = this._getColortoRGB(line.right.color) + (line.right.style == "solid" ? "" : "," + line.right.style);
                            }
                            if (!bottom_linecolor)
                            {
                                bottom_linecolor = this._getColortoRGB(line.bottom.color) + (line.bottom.style == "solid" ? "" : "," + line.bottom.style);
                            }
                            lineCell = left_linecolor + ":" + top_linecolor + ":" + right_linecolor + ":" + bottom_linecolor;

                            if (iscssclassexpr)
                                this._stylecache[cacheindex + "line" + selectedcc] = lineCell;
                        }
                        else
                        {
                            lineCell = "empty:empty:empty:empty:";
                        }
                    }

                    /*
                    if (this._applyA)
                    {
                        rt = this._find_styleName(ds_style, "align", alignCell, this._a_ct);
                        style_name = rt[0];
                        if (this._a_ct != rt[1])
                        {
                            rt = this._find_styleName(ds_style2, "align", alignCell, this._a_ct);
                        }
                        this._a_ct = rt[1];
                        cellStyle += "align:" + style_name + ",";
                    }

                    if (this._applyB)
                    {
                        rt = this._find_styleName(ds_style, "background", backgroundCell, this._bg_ct);
                        style_name = rt[0];
                        if (this._bg_ct != rt[1])
                        {
                            rt = this._find_styleName(ds_style2, "background", backgroundCell, this._bg_ct);
                        }
                        this._bg_ct = rt[1];
                        cellStyle += "background:" + style_name + ",";
                    }

                    if (this._applyC)
                    {
                        rt = this._find_styleName(ds_style, "color", colorCell, this._c_ct);
                        style_name = rt[0];
                        if (this._c_ct != rt[1])
                        {
                            rt = this._find_styleName(ds_style2, "color", colorCell, this._c_ct);
                        }
                        this._c_ct = rt[1];
                        cellStyle += "color:" + style_name + ",";
                    }
                    if (this._applyF)
                    {
                        rt = this._find_styleName(ds_style, "font", fontCell, this._f_ct);
                        style_name = rt[0];
                        if (this._f_ct != rt[1])
                        {
                            rt = this._find_styleName(ds_style2, "font", fontCell, this._f_ct);
                        }
                        this._f_ct = rt[1];
                        cellStyle += "font:" + style_name + ",";
                    }
                    rt = this._find_styleName(ds_style, "line", lineCell, this._l_ct);
                    style_name = rt[0];
                    if (this._l_ct != rt[1])
                    {
                        rt = this._find_styleName(ds_style2, "line", lineCell, this._l_ct);
                    }
                    this._l_ct = rt[1];
                    cellStyle += "line:" + style_name + ",";

                    var cell_type = this._getFixedCellType(cell, k);
                    rt = this._find_styleName(ds_style, "type", cell_type, this._t_ct);
                    style_name = rt[0];
                    if (this._t_ct != rt[1])
                    {
                        rt = this._find_styleName(ds_style2, "type", cell_type, this._t_ct);
                    }
                    this._t_ct = rt[1];
                    cellStyle += "type:" + style_name;
                    */

                    cell_type = this._getFixedCellType(cell, k); // rowidx
                    if (pre_displaytype)
                    {
                        //if (pre_displaytype != cell_type)
                        {
                            pre_displaytype = cell_type;
                            sFlag = true;
                        }
                    }
                    else
                    {
                        pre_displaytype = cell_type;
                    }

                    style_name = this._makeforDsStyle(ds_style2, alignCell, backgroundCell, colorCell, fontCell, lineCell, cell_type, row_suppress_count, col_suppress_count); // check this line 
                    var longdate_flag = false;
                    if (cell_type.indexOf("date") > -1 && (this._checkExpr(cell.locale) || this._checkExpr(cell.calendardateformat)))
                    {
                        sFlag = true;
                        if (cell._p_calendardateformat == "LONGDATE")
                            longdate_flag = true;
                    }
                    /*
                    if (row_suppress_count)
                    {
                        rt = this._find_styleName(ds_style, "rowsuppress", row_suppress_count, this._sm_ct);
                        style_name = rt[0];
                        if (this._sm_ct != rt[1])
                        {
                            rt = this._find_styleName(ds_style2, "rowsuppress", row_suppress_count, this._sm_ct);
                        }
                        this._sm_ct = rt[1];
                        cellStyle += ",rowsuppress:" + style_name;
                    }
                    if (col_suppress_count)
                    {
                        rt = this._find_styleName(ds_style, "colsuppress", col_suppress_count, this._sm_ct);
                        style_name = rt[0];
                        if (this._sm_ct != rt[1])
                        {
                            rt = this._find_styleName(ds_style2, "colsuppress", col_suppress_count, this._sm_ct);
                        }
                        this._sm_ct = rt[1];
                        cellStyle += ",colsuppress:" + style_name;
                    }

                    rt = this._find_styleName(ds_style, "style", cellStyle, this._s_ct);
                    style_name = rt[0];
                    if (this._s_ct != rt[1])
                    {
                        rt = this._find_styleName(ds_style2, "style", cellStyle, this._s_ct);
                    }
                    this._s_ct = rt[1];
                    */

                    var display_type = cell._getDisplaytype(k);
                    if (!sFlag)
                    {
                        if (display_type == "mask" || display_type == "maskeditcontrol")
                        {
                            var masktype = cell._getAttrValue(cell._p_maskedittype, k);
                            if (masktype == "number")
                                sFlag = true;
                        }
                    }

                    var display_text = this._getCellText(grid, k, j);
                    val = emptyCellFlag ? "" : display_text;

                    var orgv_cells = this._orgvalue_cells;
                    var orgv_bands = this._orgvalue_bands;
                    var is_orgvalueband = false;
                    if (!nexacro._isNull(orgv_bands) && !nexacro._isNull(orgv_bands["body"]))
                    {
                        is_orgvalueband = true;
                    }
                    var is_orgvaluecell = (orgv_cells && orgv_cells[j] && is_orgvalueband);

                    if (longdate_flag)
                    {
                        cell.calendardateformat = "SHORTDATE";
                        val = cell._getDisplayText_date(k);
                        cell.calendardateformat = "LONGDATE";
                    }

                    if (display_type == "imagecontrol")
                    {
                        var expImg = this._p_exportimage.toLowerCase();
                        if (expImg == "url" || expImg == "image")
                        {
                            var path = this._getCellText(grid, k, j);

                            if (path)
                            {
                                var url = nexacro._getURIValue(path);
                                val = nexacro._getImageLocation(url, this._getForm()._getFormBaseUrl());
                            }
                            else
                            {
                                val = path;
                            }
                        }
                        else
                        {
                            val = "";
                        }
                    }
                    else if (val && display_type == "mask")
                    {
                        if (!maskeditpostfixtext_table)
                            var maskeditpostfixtext_table = new Map();
                        var maskeditpostfixtext = maskeditpostfixtext_table.get(j);
                        if (maskeditpostfixtext == undefined)
                        {
                            maskeditpostfixtext = cell._getAttrValue(cell._p_maskeditpostfixtext, k);
                            maskeditpostfixtext_table.set(j, maskeditpostfixtext ? maskeditpostfixtext : "none");
                        }
                        if (maskeditpostfixtext && maskeditpostfixtext != "none")
                        {
                            val = val.replace(maskeditpostfixtext, "");
                        }
                    }

                    /* style name & value seperate using charcode */
                    var delimiter = exportObj._commdatadelimiter;
                    /*
                    if (exportObj._commdataformat == 0) 
                    {
                        // XML 구문자를 회피하기 위한 합의된 문자열
                        delimiter = "_x001D_";
                    }
                    else
                    {
                        if (exportObj.commandversion != "1.0" && exportObj._commdataformat == 3)
                            delimiter = "_x001D_";
                        else
                            delimiter = String.fromCharCode(29);
                    }*/

                    if (this._exportmerge == 1) // set "suppress"
                    {
                        if (cell._getSuppress(k) > 0)
                        {
                            if (suppress_infos[k] && suppress_infos[k].text_proc)
                            {
                                val = "";
                            }
                        }

                        if (grid._supphorztype > 0)
                        {
                            if (cell._area == "left" || cell._area == "right")
                            {
                                if (suppress_infos[k])
                                {
                                    if (suppress_infos[k].horz_text_proc)
                                    {
                                        val = "";
                                    }
                                }
                            }
                        }

                        if (!!grid._checkVirtualMerge(cell, k))
                        {
                            val = "";
                            merge_data = this._getMergeDatas(k, j);
                            if (merge_data)
                            {
                                if (merge_data.isVirtualStart)
                                {
                                    if (alignCell == "left,top")
                                    {
                                        val = display_text;
                                    }
                                    else
                                    {
                                        var temp_align = alignCell.split(",");
                                        var merge_str = merge_data[temp_align[1]] + "_" + merge_data[temp_align[0]];
                                        if (this._merge_datas[merge_str])
                                        {
                                            this._merge_datas[merge_str].disPlayText = display_text;
                                            this._merge_datas[merge_str].showText = true;
                                        }
                                        else
                                        {
                                            this._merge_datas[merge_str] = {
                                                disPlayText: display_text,
                                                showText: true
                                            };
                                        }
                                    }
                                }

                                if (merge_data.showText)
                                {
                                    val = merge_data.disPlayText;
                                }
                            }
                        }
                    }
                    else if (this._exportmerge == 2) // set "merge"
                    {
                        if (grid._supphorztype > 0)
                        {
                            if (cell._area == "left" || cell._area == "right")
                            {
                                if (suppress_infos[k])
                                {
                                    if (suppress_infos[k].horz_text_proc)
                                    {
                                        val = "";
                                    }
                                }
                            }
                        }
                    }

                    if (exportObj._orgval_type || is_orgvaluecell)
                    {
                        val = nexacro._isNumber(val) ? val : nexacro._isDecimal(val) ? val.toString() : nexacro._nvl(val, "");
                    }
                    else
                    {
                        val = nexacro._nvl(val, "");
                    }

                    if (exportObj._p_commandversion == "2.0")
                        val = nexacro.base64Encode(val);
                    else if (exportObj._p_commandversion == "3.0")
                        val = nexacro.base32Encode(val);

                    if (issupp)
                    {
                        ds.setColumn(idx, "Column" + (j + subcnt), val + delimiter + (sFlag || (is_selected && activate_select_style) ? style_name : "") + delimiter + issupp);
                        issupp = false;
                    }
                    else
                        ds.setColumn(idx, "Column" + (j + subcnt), val + delimiter + (sFlag || (is_selected && activate_select_style) ? style_name : ""));

                    if (cell._subcells.length)
                    {
                        var subCell = cell._subcells;
                        var subL = subCell.length;
                        var rsp = cell._rowspan - 1;
                        var csp = cell._colspan - 1;

                        var subline = "";
                        d_BLColor = this._d_BLColor;
                        if (this._applyL)
                        {
                            line = this._getCellStyle(cell, k, odd, "border", selected);
                            linecolor = this._getColortoRGB(line.right.color) + (line.right.style == "solid" ? "" : "," + line.right.style);
                        }
                        else
                        {
                            linecolor = d_BLColor;
                        }

                        var lLine;
                        var tLine;
                        var rLine;
                        var bLine;

                        for (var i = 0; i < subL; i++)
                        {
                            var sbc = subCell[i]._col;
                            var sbr = subCell[i]._row;
                            if (sbc == csp)
                            {
                                rLine = linecolor;
                            }
                            else
                            {
                                rLine = "empty";
                            }
                            if (sbc == 0)
                            {
                                lLine = d_BLColor;
                            }
                            else
                            {
                                lLine = "empty";
                            }
                            if (sbr == rsp)
                            {
                                bLine = linecolor;
                            }
                            else
                            {
                                bLine = "empty";
                            }
                            if (sbr == 0)
                            {
                                tLine = d_BLColor;
                            }
                            else
                            {
                                tLine = "empty";
                            }

                            subline = lLine + ":" + tLine + ":" + rLine + ":" + bLine;

                            cell_type = this._getFixedCellType(subCell[i], 0); // rowidx
                            style_name = this._makeforDsStyle(ds_style2, alignCell, backgroundCell, colorCell, fontCell, subline, cell_type);

                            if (i != 0)
                            {
                                ds.addColumn("Column" + (jj + subcnt), "String", 256);
                                subcnt++;
                            }

                            display_text = this._getCellText(grid, k, j, i);
                            val = emptyCellFlag ? "" : display_text;

                            if (exportObj._orgval_type || is_orgvaluecell)
                            {
                                val = nexacro._isNumber(val) ? val : nexacro._isDecimal(val) ? val.toString() : nexacro._nvl(val, "");
                            }
                            else
                            {
                                val = nexacro._nvl(val, "");
                            }

                            if (exportObj._p_commandversion == "1.0")
                                ds.setColumn(idx, "Column" + (j + subcnt), val + delimiter + style_name);
                            else if (exportObj._p_commandversion == "2.0")
                                ds.setColumn(idx, "Column" + (j + subcnt), nexacro.base64Encode(val) + delimiter + style_name);
                            else if (exportObj._p_commandversion == "3.0")
                                ds.setColumn(idx, "Column" + (j + subcnt), nexacro.base32Encode(val) + delimiter + style_name);
                        }
                    }
                }
                rr++;
            }
            this._preStartRow = this._startRow;
            this._startRow = partitionRow;
        }
        else
        {
            this._eof = true;
            export_param = this._p_parent._argsParam;
            export_dsparam = this._p_parent._argsDsParam;
        }

        ds_command.setColumn(0, "eof", this._eof);

        if (this._ds_response)
            delete this._ds_response;

        this._ds_response = new nexacro.DatasetBase("RESPONSE");

        // suppressinfo가 excel 통신중에 깨지는 경우 발생하여 갱신 시점을 변경
        this._rollbackSuppressInfo();

        if (export_dsparam != undefined)
        {
            this._transaction(this.id, exportObj._exporturl, "COMMAND=_ds_command STYLE=_ds_style2 CELL=_ds_cell" + " " + export_dsparam, "_ds_response=RESPONSE", export_param, "_exportCallback", true, exportObj._commdataformat, exportObj._commcompress);
        }
        else
        {
            this._transaction(this.id, exportObj._exporturl, "COMMAND=_ds_command STYLE=_ds_style2 CELL=_ds_cell", "_ds_response=RESPONSE", export_param, "_exportCallback", true, exportObj._commdataformat, exportObj._commcompress);
        }
        this._updateBarPos(exportObj, exportObj._p_exporteventtype);
    };


    _pExportItem._onHttpTransactionError = function (obj, bfireevent, errorobj, errortype, url, returncode, requesturi, locationuri, extramsg)
    {
        var ret = false;
        var commerrorobj = nexacro.MakeCommunicationError(this, errortype, url, returncode, requesturi, locationuri, extramsg);
        if (bfireevent)
        {
            ret = this.on_fire_onerror(obj, commerrorobj._p_name, commerrorobj.message, errorobj, returncode, requesturi, locationuri);
        }

        return ret;
    };

    _pExportItem._exportCallback = function (svcid, errstatus, message)
    {
        var grid = this._p_source;
        var exportObj = this._p_parent;
        var exportbar = exportObj._exportBar;
        if (errstatus < 0)
        {
            message = nexacro._decodeXml(message);
            this.on_fire_onerror(exportObj, "ObjectError", message, errstatus);
            nexacro._stopTransaction(this, 0);
            if (exportbar)
            {
                exportbar._hide();
                exportbar._set_pos(0);
                exportbar._set_text("");
            }
            if (grid._hasTree)
            {
                grid.set_treeinitstatus(this._gridTempInfo.treeinitstatus);
                nexacro.Grid.prototype._recreate_contents_all = exportObj._tempSaveMethod;
                exportObj._tempSaveMethod = null;
                grid._treeIndexes = this._gridTempInfo.treeIndexes;
                grid._treeStates = this._gridTempInfo.treeStates;
                grid._p_enableevent = this._gridTempInfo.enableevent;
                this._gridTempInfo = null;
            }
        }
        else
        {
            // var item_id = this._ds_response.getColumn(0, "item");

            this._instanceId = this._ds_response.getColumn(0, "instanceid");
            var excelURL = this._ds_response.getColumn(0, "url");
            if (excelURL != null && excelURL != "")
                exportObj._fileURL = excelURL;

            var itemIndex = exportObj._itemsIndex;
            var is_finish = itemIndex + 1 == exportObj._allCount;
            var is_end = this._startRow == this._bodyRowCnt;
            this._seq++;

            if (is_end)
            {
                if (grid._hasTree)
                {
                    grid.set_treeinitstatus(this._gridTempInfo.treeinitstatus);
                    nexacro.Grid.prototype._recreate_contents_all = exportObj._tempSaveMethod;
                    exportObj._tempSaveMethod = null;
                    grid._treeIndexes = this._gridTempInfo.treeIndexes;
                    grid._treeStates = this._gridTempInfo.treeStates;
                    grid._p_enableevent = this._gridTempInfo.enableevent;
                    this._gridTempInfo = null;
                }

                if (is_finish)
                {
                    var completemessage = exportObj._p_exportmessagecomplete;
                    if (completemessage)
                        exportbar._set_text(completemessage);
                    if (exportbar)
                    {
                        exportbar._hide();
                        exportbar._set_pos(0);
                        exportbar._set_text("");
                    }

                    // suppressinfo가 excel 통신중에 깨지는 경우 발생하여 갱신 시점을 변경
                    //this._rollbackSuppressInfo();

                    this._tmpSuppressInfos = null;
                    exportObj._fileURL = "";
                    exportObj._allRowCount = 0;
                    exportObj._progress_pos = 0;
                    exportObj._itemsIndex = 0;

                    var exportfilename_;
                    if (excelURL != null && excelURL != "")
                    {
                        var index_ = excelURL.lastIndexOf("/");
                        if (index_ == -1)
                        {
                            index_ = excelURL.lastIndexOf("\\");
                        }
                        if (index_ != -1)
                        {
                            exportfilename_ = excelURL.substring(index_ + 1);
                        }
                    }

                    const application = exportObj._p_parent._p_parent._getApplication();
                    if (application)
                        application._endCommProgress();


                    if (exportObj._filedownload)
                    {
                        // [45501] XENI 의 export-path 변경 후 FileDialog 의 파일이름에 exportfilename 이 적용되지 않음
                        if (exportObj._p_exportfilename == "")
                        {
                            var idx = exportfilename_.lastIndexOf(".");
                            if (idx != -1)
                            {
                                exportfilename_ = exportfilename_.substring(0, idx);
                            }
                            else
                            {
                                exportfilename_ = "";
                            }
                        }
                        else
                        {
                            exportfilename_ = exportObj._p_exportfilename;
                        }

                        switch (exportObj._p_exporttype)
                        {
                            case nexacro.ExportTypes.EXCEL:
                            case nexacro.ExportTypes.EXCEL97:
                                exportfilename_ += ".xls";
                                break;
                            case nexacro.ExportTypes.EXCEL2007:
                                exportfilename_ += ".xlsx";
                                break;
                            case nexacro.ExportTypes.HANCELL2010:
                            case nexacro.ExportTypes.HANCELL2014:
                                exportfilename_ += ".cell";
                                break;
                            case nexacro.ExportTypes.CSV:
                                exportfilename_ += ".csv";
                                break;
                            case nexacro.ExportTypes.TXT:
                                exportfilename_ += ".txt";
                                break;
                        }

                        //[RP 81278] Excelexport 할때, 파일다이얼로그창 출력 여부를 제어할 수 있는 기능 추가.
                        var exportfilepath_;
                        if (exportObj._p_exportfilepath != null && exportObj._p_exportfilepath != "")
                        {
                            exportfilepath_ = exportObj._p_exportfilepath;
                            if (exportfilepath_.charAt(exportfilepath_.length - 1) != '\\')
                            {
                                exportfilepath_ += "\\";
                            }
                        }

                        //--------------------------------------------------------------------------------------------
                        if (nexacro._Browser == "Runtime")
                        {
                            nexacro._downloadExport(excelURL, false, exportObj._hidden_frame_handle, exportfilename_, exportfilepath_, exportObj._p_filefilter, exportObj._p_filefilterindex, "export");
                        }
                        else
                        {
                            nexacro._downloadExport(excelURL, false, this);
                        }
                    }

                    //[RP 93307] export시 onsuccess 이벤트에서 execShell 이용하여  파일 실행시 오픈되지 않는현상. 다운로드 이후 onsuccess 이벤트 호출 하도록 변경
                    this.on_fire_onsuccess(exportObj, this, excelURL);
                }
                else
                {
                    exportObj._itemsIndex++;
                    if (exportObj._itemsIndex == exportObj._gCount)
                    {

                        // Open this block when datasettype and xmltype support
                        //if(this.d_len > 0)
                        //{
                        //    exportObj._dataset[0]._datasetItemExport();
                        //}
                        //else
                        //{
                        //    if(this.x_len > 0)
                        //    {
                        //        exportObj._xml[0]._xmlItemExport();
                        //    }
                        //}
                    }
                    else
                    {
                        exportObj._grids[exportObj._itemsIndex]._gridItemExport(exportObj);
                    }
                }
                this._instanceId = "";
                this._startRow = 0;
                this._seq = 1;
                this._eof = false;
                this._selectcount = 0;
            }
            else
            {
                // TODO : dataset , xml
                this._gridExportContinue(exportObj);
            }

            if (this._is_export_ex)
                this._is_export_ex = false;
        }
    };

    _pExportItem._makeMergeDatas = function (grid, format_body_rowcount, col_len)
    {
        var row_len = format_body_rowcount;
        var merge_datas = this._merge_datas = {};
        // var merge_end_row, merge_end_col, row_merge_count, col_merge_count, end_subrow;
        var virtual_mergecell, end_row, last_row, start_subrow, temp;
        start_subrow = 0;
        var rowspan, colspan, top_row, middle_row, bottom_row, left_col, center_col, right_col, start_col, end_col, start_row;
        var rowcount = grid._getGridRowCount() - 1;

        for (var i = 0, len = grid._virtual_mergecell_arr.length; i < len; i++)
        {
            if (nexacro._Browser == "Runtime")
                nexacro._peekWindowHandleMessageQueuePassing(this._getWindow());

            virtual_mergecell = grid._virtual_mergecell_arr[i];

            if (virtual_mergecell.start_subrow != null)
                start_subrow = virtual_mergecell.start_subrow;

            //if (virtual_mergecell.end_subrow != null)
            //    end_subrow = virtual_mergecell.end_subrow;

            if (virtual_mergecell.end_row > rowcount)
            {
                last_row = end_row = rowcount;
                // end_subrow = row_len - 1;
            }
            else
            {
                last_row = end_row = virtual_mergecell.end_row;
                // end_subrow = virtual_mergecell.end_subrow;
            }

            if (virtual_mergecell.start_row == -1)
            {
                row_len = grid._curFormat._headrows ? grid._curFormat._headrows.length : 0;
                end_row = start_row = 0;
            }
            else if (virtual_mergecell.start_row == -2)
            {
                row_len = grid._curFormat._summrows ? grid._curFormat._summrows.length : 0;
                end_row = start_row = 0;
            }
            else
            {
                start_row = virtual_mergecell.start_row;
            }

            rowspan = (row_len * end_row + virtual_mergecell.end_subrow) - (row_len * start_row + start_subrow) + 1;
            colspan = virtual_mergecell.end_column - virtual_mergecell.start_column + 1;

            temp = ((row_len * start_row + start_subrow + 1) + (row_len * end_row + virtual_mergecell.end_subrow + 1)) / 2 << 0;
            top_row = virtual_mergecell.start_row;
            middle_row = (temp - 1) / row_len << 0;
            bottom_row = last_row;

            start_col = col_len * start_subrow + virtual_mergecell.start_column;
            end_col = col_len * virtual_mergecell.end_subrow + virtual_mergecell.end_column;

            left_col = ((temp - 1) % row_len * col_len + virtual_mergecell.start_column) << 0;
            center_col = ((temp - 1) % row_len * col_len + (virtual_mergecell.start_column + virtual_mergecell.end_column) / 2) << 0;
            right_col = ((temp - 1) % row_len * col_len + virtual_mergecell.end_column) << 0;

            if (virtual_mergecell.start_row < 0)
                middle_row = virtual_mergecell.start_row;

            var cellinfos = virtual_mergecell.cellinfos;
            var cellinfo;

            for (var j = 0; j < cellinfos.length; j++)
            {
                cellinfo = cellinfos[j];
                var include_cells = [];
                var left_skip = false;
                var center_skip = false;
                var right_skip = false;
                var idx = -1;
                //var include = [];

                if (cellinfo._colspan > 1 || cellinfo._rowspan > 1) // format merge cell + grid.mergeCell 동시 적용된 경우, format merge cell이 left_col, center_col, right_col을 포함하고 있으면, format merge cell의 index로 변경필요.
                {
                    for (var k = cellinfo._col; k < (cellinfo._col + cellinfo._colspan); k++)
                    {
                        for (var l = cellinfo._row; l < (cellinfo._row + cellinfo._rowspan); l++)
                        {
                            idx = k + (l * col_len);
                            //        include.push(idx);

                            if (!left_skip && left_col == idx)
                            {
                                left_skip = true;
                                left_col = cellinfo._cellidx;
                            }
                            if (!center_skip && center_col == idx)
                            {
                                center_skip = true;
                                center_col = cellinfo._cellidx;
                            }
                            if (!right_skip && right_col == idx)
                            {
                                right_skip = true;
                                right_col = cellinfo._cellidx;
                            }
                        }
                    }
                }
            }

            merge_datas[top_row + "_" + start_col] = {
                isVirtualStart: true,
                left: left_col,
                center: center_col,
                right: right_col,
                top: top_row,
                middle: middle_row,
                bottom: bottom_row,
                rowspan: rowspan,
                colspan: colspan,
                cellinfos: cellinfos
            };

            merge_datas[bottom_row + "_" + end_col] = {
                isVirtualEnd: true,
                rowspan: rowspan,
                colspan: colspan,
                cellinfos: cellinfos
            };
        }
    };

    _pExportItem._getMergeDatas = function (row, cellidx)
    {
        //return this._merge_datas && this._merge_datas[row + "_" + cellidx] // 작업전 동작 필요시 해제

        var grid = this._p_source;
        var format = grid._curFormat;
        var cells, cell;
        var col_len = format._cols ? format._cols.length : 0;
        var start_col, end_col;
        var merge_data;

        if (col_len == 0)
            return null;

        if (row == -2)
            cells = format._summcells;
        else if (row == -1)
            cells = format._headcells;
        if (row >= 0)
            cells = format._bodycells;

        cell = cells[cellidx];

        start_col = (col_len * cell._row) + cell._col;
        end_col = (col_len * (cell._row + cell._rowspan - 1)) + (cell._col + cell._colspan - 1);

        merge_data = this._merge_datas && this._merge_datas[row + "_" + start_col];

        if (merge_data)
            return merge_data;

        merge_data = this._merge_datas && this._merge_datas[row + "_" + end_col];

        if (merge_data)
        {
            // 물리적 병합셀 존재시 논리적(mergecell) 병합정보 반영
            merge_data.rowspan -= (cell._rowspan - 1);
            merge_data.colspan -= (cell._colspan - 1);
            return merge_data;
        }

        return null;
    };

    _pExportItem._gridItemExport = function (exportObj)
    {
        var maskeditpostfixtext_table = undefined
        var uiType = exportObj._exportuitype;
        if (exportObj._p_exporteventtype != "none" && uiType)
        {
            var exportbar = exportObj._exportBar;
            if (!exportbar || exportbar._uitype != uiType)
            {
                exportbar = exportObj._exportBar = exportObj._getExportBar(uiType);
                var str = exportObj._getProcessStr(exportObj.count(), exportObj._allRowCount, exportObj._allRowCount);
                str = nexacro._getLongerStr(str, exportObj._p_exportmessagecomplete, exportObj._p_exportmessageready);

                var textbox = exportbar._textbox;
                var font = textbox ? textbox._getCurrentStyleInheritValue("font") : exportbar.font || exportbar._getCurrentStyleInheritValue("font");
                var refer_font = textbox._getReferenceAbsoluteFont(font); // use to em / rem
                var tSize = nexacro._getTextSize(str, font, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, refer_font);
                exportbar._textWidth = tSize[0];
                exportbar._textHeight = tSize[1];
            }

            if (exportObj._itemsIndex == 0 && exportObj._p_exportmessageready != "")
            {
                exportbar._set_text(exportObj._p_exportmessageready);
            }
            exportbar._show();
        }

        var grid = this._p_source;
        var cur_fomat_col_len = grid._curFormat._cols ? grid._curFormat._cols.length : 0;
        var cur_fomat_row_len = grid._curFormat._bodyrows ? grid._curFormat._bodyrows.length : 0;

        if (grid._hasTree)
        {
            this._gridTempInfo = {};
            exportObj._tempSaveMethod = nexacro.Grid.prototype._recreate_contents_all;
            nexacro.Grid.prototype._recreate_contents_all = nexacro._emptyFn;
            this._gridTempInfo.enableevent = grid._p_enableevent;
            grid._p_enableevent = false;
            this._gridTempInfo.treeIndexes = grid._treeIndexes.slice(0);
            this._gridTempInfo.treeStates = grid._treeStates.slice(0);
            this._gridTempInfo.treeinitstatus = grid._p_treeinitstatus;
            grid.set_treeinitstatus("expand,all");
        }

        if (grid._hasVirtualMergeCell())
        {
            this._makeMergeDatas(grid, cur_fomat_row_len, cur_fomat_col_len);
        }

        this._style_map1 = null;
        this._style_map2 = null;

        var ds_style = this._ds_style;

        if (!ds_style)
        {
            ds_style = this._ds_style = new nexacro.DatasetBase("STYLE");

            ds_style.addColumn("type", "String", 10);
            ds_style.addColumn("name", "String", 32);
            ds_style.addColumn("value", "String", 1024);
            ds_style.addColumn("locale", "String", 32);   // extra_value[1] : locale
        }
        else
            ds_style.clearData();


        var ds_command = this._ds_command;

        if (!ds_command)
        {
            ds_command = new nexacro.DatasetBase("COMMAND");
            this._ds_command = ds_command;

            ds_command.addColumn("command", "String", 32);
            ds_command.addColumn("type", "int", 32);
            ds_command.addColumn("item", "String", 256);
            ds_command.addColumn("seq", "int");
            ds_command.addColumn("startrow", "int", 32);
            ds_command.addColumn("eof", "boolean", 32);
            ds_command.addColumn("instanceid", "String", 256);
            ds_command.addColumn("url", "String", 256);
            ds_command.addColumn("summarytype", "String", 256);
            ds_command.addColumn("range", "String", 32);
            ds_command.addColumn("exportsize", "String", 32);
            ds_command.addColumn("exporthead", "String", 32);
            ds_command.addColumn("exportimage", "String", 32);
            ds_command.addColumn("exportfilename", "String", 32);
            ds_command.addColumn("exportfilepath", "String", 256);
            ds_command.addColumn("format", "String", 1024 * 1024); // 1MB??? BLOB don't support
            ds_command.addColumn("password", "String", 256);
            ds_command.addColumn("wraptext", "boolean", 32);
            ds_command.addColumn("locale", "String", 32);
            ds_command.addColumn("righttoleft", "boolean", 32);
            ds_command.addColumn("separator", "String", 32);
            ds_command.addColumn("quotechar", "String", 32);
            ds_command.addColumn("commandversion", "String", 32);
        }
        else
            ds_command.clearData();

        ds_command.addRow();

        ds_command.setColumn(0, "command", "export");
        ds_command.setColumn(0, "type", exportObj._exporttype);
        ds_command.setColumn(0, "item", grid.id);
        ds_command.setColumn(0, "seq", this._seq);
        ds_command.setColumn(0, "startrow", this._startRow);
        ds_command.setColumn(0, "instanceid", this._instanceId);
        ds_command.setColumn(0, "url", exportObj._fileURL);
        ds_command.setColumn(0, "summarytype", grid._p_summarytype);

        ds_command.setColumn(0, "commandversion", exportObj._p_commandversion);

        ds_command.setColumn(0, "range", this._p_range);
        var is_selectRec = this._p_exportselect == "selectrecord";
        var is_show_head = ((grid._p_selecttype != "area") && (grid._p_selecttype != "multiarea") && (grid._p_selecttype != "treecell")) ? true : false;
        if (is_show_head)
        {
            if (is_selectRec)
            {
                if (this._exporthead == "")
                {
                    this._exporthead = "nohead, nosumm";
                    this._applyHead = false;
                    this._applySumm = false;
                }
                this._exportmerge = false;
            }
        }
        else
        {
            this._exporthead = "nohead, nosumm";
            this._applyHead = false;
            this._applySumm = false;
        }
        ds_command.setColumn(0, "exportsize", this._p_exportsize);
        ds_command.setColumn(0, "exporthead", this._exporthead);
        ds_command.setColumn(0, "exportimage", this._p_exportimage);
        ds_command.setColumn(0, "exportfilename", exportObj._p_exportfilename);
        ds_command.setColumn(0, "exportfilepath", exportObj._p_exportfilepath);

        if (nexacro._Browser == "Runtime")
        {
            nexacro._flushCommand(this._getWindow());
        }
        var madeformat = nexacro._replaceAll(this._makeFormat(grid), "&#13;", "");

        if (exportObj._p_commandversion == "2.0")
            madeformat = nexacro.base64Encode(madeformat);
        else if (exportObj._p_commandversion == "3.0")
            madeformat = nexacro.base32Encode(madeformat);

        ds_command.setColumn(0, "format", madeformat);
        ds_command.setColumn(0, "password", exportObj._file_pw);
        ds_command.setColumn(0, "wraptext", exportObj._wrap_text);
        ds_command.setColumn(0, "righttoleft", this._righttoleft);
        ds_command.setColumn(0, "separator", exportObj._p_separator ? exportObj._p_separator : exportObj._defaultseparator);
        ds_command.setColumn(0, "quotechar", exportObj._p_quotechar);

        var locale = grid._getLocale();
        if (locale)
        {
            locale = locale.replace(/-/g, "_");
            ds_command.setColumn(0, "locale", locale);
        }

        var ds = new nexacro.DatasetBase("CELL");
        this._ds_cell = ds;

        var bodycntcell = grid.getCellCount("body");

        var bodycntrow = this._bodyRowCnt = grid._getGridRowCount();

        var style_name = "";
        var pre_displaytype = "";

        if (this._exportmerge && grid._is_use_suppress && bodycntrow >= grid._bodyBand._get_rows().length)
        {
            this._gridSuppressUpdate(grid, bodycntrow);
        }

        var export_param = null;
        var export_dsparam = null;

        // band = 'body'
        if (bodycntcell > 0)
        {
            for (var jj = 0; jj < bodycntcell; jj++)
            {
                ds.addColumn("Column" + jj, "String", 256);
            }

            var transferrowcount = this._p_parent ? (this._p_parent._p_transferrowcount || bodycntrow) : bodycntrow;
            var partRowCount = this._partitionRow = transferrowcount;

            if (partRowCount >= bodycntrow)
            {
                partRowCount = bodycntrow;
                this._eof = true;
                export_param = this._p_parent._argsParam;
                export_dsparam = this._p_parent._argsDsParam;
            }

            var cells = grid._curFormat._bodycells;

            var activate_select_style = (this._p_exportvalue == "selectstyle");
            var is_selected;
            var subcnt;
            var emptyCellFlag = false;
            var d_BLColor, merge_data, line, cell_type;

            var k, j;

            var _win = this._getWindow();

            for (k = 0; k < partRowCount; k++)
            {
                subcnt = 0;

                if (nexacro._Browser == "Runtime")
                    nexacro._peekWindowHandleMessageQueuePassing(_win);

                var val;
                var selectChk = false;
                var idx;
                for (j = 0; j < bodycntcell; j++)
                {
                    selectChk = selectChk || grid.isSelectedCell(j, "body", k, -9);
                }

                if (selectChk || !is_selectRec)
                {
                    idx = ds.addRow();
                    if (is_selectRec)
                    {
                        this._eventExport(exportObj, this._p_type, k, this._selectcount++);
                    }
                    else
                    {
                        this._eventExport(exportObj, this._p_type, k);
                    }
                }
                else
                {
                    continue;
                }
                var odd = k % 2;

                for (j = 0; j < bodycntcell; j++)
                {
                    emptyCellFlag = false;
                    is_selected = grid.isSelectedCell(j, "body", k, -9);

                    if (!is_selected)
                    {
                        if (is_selectRec)
                        {
                            emptyCellFlag = true;
                        }
                    }
                    var backgroundCell, alignCell, fontCell, colorCell, lineCell;

                    // var bodyBand = grid._bodyBand;

                    var cell = cells[j];
                    var suppress_infos = cell._suppress_infos;
                    var selected = is_selected && activate_select_style;
                    var sFlag = false;
                    var rowspan = cell._rowspan;

                    var iscssclassexpr = this._checkExpr(null, cell._p_cssclass);
                    var cssclasses = iscssclassexpr ? cell._getAttrValue(cell._p_cssclass, k) : "";

                    var cacheindex = j + (cssclasses ? cssclasses : "");
                    var selectedcc = selected ? "-c" : "";

                    var cacheA = this._stylecache[cacheindex + "align" + selectedcc];
                    var cacheL = this._stylecache[cacheindex + "line" + selectedcc];
                    var cacheB = undefined, cacheC = undefined, cacheF = undefined;


                    // support yet
                    /*
                    if (is_selected && activate_select_style)
                    {
                        selected = true;
                        cacheB = "";
                        cacheC = "";
                        cacheF = "";
                    }
                    else
                    */
                    {
                        if (emptyCellFlag)
                        {
                            cacheB = "255,255,255";
                            cacheC = "255,255,255";
                            d_BLColor = this._d_BLColor;
                            cacheL = d_BLColor + ":" + d_BLColor + ":" + d_BLColor + ":" + d_BLColor;
                            sFlag = true;
                        }
                        else
                        {
                            if (!cell._getVirtualMergeInfo(k + 2))
                            {
                                cacheB = this._stylecache[cacheindex + "background" + odd + selectedcc];
                                cacheC = this._stylecache[cacheindex + "color" + odd + selectedcc];
                            }
                        }
                        cacheF = this._stylecache[cacheindex + "font" + selectedcc];
                    }

                    if (!nexacro._isNull(cacheA))
                    {
                        alignCell = cacheA;
                        if (iscssclassexpr)
                            sFlag = true;
                    }
                    else
                    {
                        if (this._applyA)
                        {
                            sFlag = true;
                            alignCell = nexacro._nvl(this._getCellStyle(cell, k, odd, "align", selected), "");

                            if (iscssclassexpr)
                                this._stylecache[cacheindex + "align" + selectedcc] = alignCell;
                        }
                        else
                        {
                            alignCell = null;
                        }
                    }
                    if (!nexacro._isNull(cacheB))
                    {
                        backgroundCell = cacheB;
                        if (iscssclassexpr)
                            sFlag = true;
                    }
                    else
                    {
                        if (this._applyB)
                        {
                            sFlag = true;
                            backgroundCell = nexacro._nvl(this._getColortoRGB(this._getCellStyle(cell, k, odd, "background", selected)), "");

                            if (!iscssclassexpr && !cell._getVirtualMergeInfo(k + 2))
                                this._stylecache[cacheindex + "background" + odd + selectedcc] = backgroundCell;
                        }
                        else
                        {
                            backgroundCell = null;
                        }
                    }
                    if (!nexacro._isNull(cacheC))
                    {
                        colorCell = cacheC;
                        if (iscssclassexpr)
                            sFlag = true;
                    }
                    else
                    {
                        if (this._applyC)
                        {
                            sFlag = true;
                            colorCell = nexacro._nvl(this._getColortoRGB(this._getCellStyle(cell, k, odd, "color", selected)), "");

                            if (!iscssclassexpr && !cell._getVirtualMergeInfo(k + 2))
                                this._stylecache[cacheindex + "color" + odd + selectedcc] = colorCell;
                        }
                        else
                        {
                            colorCell = null;
                        }
                    }
                    if (!nexacro._isNull(cacheF))
                    {
                        fontCell = cacheF;
                        if (iscssclassexpr)
                            sFlag = true;
                    }
                    else
                    {
                        if (this._applyF)
                        {
                            sFlag = true;
                            fontCell = nexacro._nvl(this._getFitFontValue(this._getCellStyle(cell, k, odd, "font", selected)), "");
                            var textdecoration = this._getCellStyle(cell, k, odd, "textDecoration", selected);
                            if (textdecoration)
                                fontCell = textdecoration + "," + fontCell;

                            if (!iscssclassexpr)
                                this._stylecache[cacheindex + "font" + selectedcc] = fontCell;
                        }
                        else
                        {
                            fontCell = null;
                        }
                    }

                    var is_line_changed = false,
                        left_linecolor = null,
                        top_linecolor = null,
                        right_linecolor = null,
                        bottom_linecolor = null,
                        linecolor;

                    var row_suppress_count = 0;
                    var col_suppress_count = 0;

                    var issupp = false;
                    switch (this._exportmerge)
                    {
                        case 0: // nosuppress
                            break;
                        case 1: // suppress

                            if (cell._getSuppress(k) > 0) //expr : 1, bind : 2
                            {

                                sFlag = is_line_changed = true;

                                if (suppress_infos[k])
                                {
                                    if (suppress_infos[k].border_proc)
                                    {
                                        bottom_linecolor = "empty";
                                    }

                                    if (suppress_infos[k].text_proc)
                                    {
                                        emptyCellFlag = true;
                                    }
                                }
                            }

                            grid._checkVirtualMerge(cell, k);

                            if (cell._getVirtualMergeInfo(k + 2))
                            {
                                var virtual_border_str = cell._getVirtualMergeInfo(k + 2).remove;
                                if (virtual_border_str)
                                {
                                    sFlag = is_line_changed = true;
                                    switch (virtual_border_str)
                                    {
                                        case "bottomvirtual":
                                            bottom_linecolor = "empty";
                                            break;
                                        case "rightbottomvirtual":
                                            right_linecolor = bottom_linecolor = "empty";
                                            break;
                                        case "rightvirtual":
                                            right_linecolor = "empty";
                                            break;
                                    }
                                }
                            }

                            break;
                        case 2: // merge
                            if (cell._getSuppress(k) > 0)
                            {
                                if (rowspan > 1)
                                    issupp = true;
                                sFlag = is_line_changed = true;
                                var column_suppress = j + "count";
                                var excel_suppress_info = this._excel_suppress_info;
                                if (!excel_suppress_info[column_suppress])
                                {
                                    excel_suppress_info[column_suppress] = 0;
                                    alignCell = alignCell.split(",")[0] + "," + this._suppress_align_table[cell.suppressalign];
                                }

                                if (suppress_infos[k] && suppress_infos[k].border_proc)
                                {
                                    this._excel_suppress_info[column_suppress]++;
                                }
                                else
                                {
                                    row_suppress_count = ++excel_suppress_info[column_suppress];
                                    if (issupp)
                                        row_suppress_count = row_suppress_count * rowspan;

                                    if (issupp && row_suppress_count == 1)
                                        issupp = false;
                                    excel_suppress_info[column_suppress] = 0;
                                }
                            }
                            merge_data = this._getMergeDatas(k, j);
                            if (merge_data && merge_data.isVirtualEnd)
                            {
                                sFlag = is_line_changed = true;
                                row_suppress_count = merge_data.rowspan;
                                col_suppress_count = merge_data.colspan;
                            }
                            break;
                    }

                    if (grid._supphorztype > 0)
                    {
                        if (cell._area == "left" || cell._area == "right")
                        {
                            sFlag = is_line_changed = true;

                            if (suppress_infos[k])
                            {
                                if (suppress_infos[k].horz_text_proc)
                                {
                                    emptyCellFlag = true;
                                }
                            }
                        }
                    }

                    if (!is_line_changed && !nexacro._isNull(cacheL))
                    {
                        lineCell = cacheL;
                        if (iscssclassexpr)
                            sFlag = true;
                    }
                    else
                    {
                        if (this._applyL)
                        {
                            line = this._getCellStyle(cell, k, odd, "border", selected);
                            if (!left_linecolor)
                            {
                                if (line.left)
                                    left_linecolor = this._getColortoRGB(line.left.color) + (line.left.style == "solid" ? "" : "," + line.left.style);
                                else
                                    left_linecolor = "transparent,none";
                            }
                            if (!top_linecolor)
                            {
                                if (line.top)
                                    top_linecolor = this._getColortoRGB(line.top.color) + (line.top.style == "solid" ? "" : "," + line.top.style);
                                else
                                    top_linecolor = "transparent,none";
                            }
                            if (!right_linecolor)
                            {
                                if (line.right)
                                    right_linecolor = this._getColortoRGB(line.right.color) + (line.right.style == "solid" ? "" : "," + line.right.style);
                                else
                                    right_linecolor = "transparent,none";
                            }
                            if (!bottom_linecolor)
                            {
                                if (line.bottom)
                                    bottom_linecolor = this._getColortoRGB(line.bottom.color) + (line.bottom.style == "solid" ? "" : "," + line.bottom.style);
                                else
                                    bottom_linecolor = "transparent,none";
                            }
                            lineCell = left_linecolor + ":" + top_linecolor + ":" + right_linecolor + ":" + bottom_linecolor;

                            if (!iscssclassexpr)
                                this._stylecache[cacheindex + "line" + selectedcc] = lineCell;
                        }
                        else
                        {
                            lineCell = "empty:empty:empty:empty:";
                        }
                    }

                    cell_type = this._getFixedCellType(cell, k); // rowidx
                    if (pre_displaytype)
                    {
                        //if (pre_displaytype != cell_type)
                        {
                            pre_displaytype = cell_type;
                            sFlag = true;
                        }
                    }
                    else
                    {
                        pre_displaytype = cell_type;
                    }

                    style_name = this._makeforDsStyle(ds_style, alignCell, backgroundCell, colorCell, fontCell, lineCell, cell_type, row_suppress_count, col_suppress_count); // check this line 

                    var longdate_flag = false;
                    if (cell_type.indexOf("date") > -1 && (this._checkExpr(cell._p_locale) || this._checkExpr(cell._p_calendardateformat)))
                    {
                        sFlag = true;
                        if (cell._p_calendardateformat == "LONGDATE")
                            longdate_flag = true;
                    }

                    var display_type = cell._getDisplaytype(k);
                    if (!sFlag)
                    {
                        if (display_type == "mask" || display_type == "maskeditcontrol")
                        {
                            var masktype = cell._getAttrValue(cell._p_maskedittype, k);
                            if (masktype == "number")
                                sFlag = true;
                        }
                    }

                    var display_text = this._getCellText(grid, k, j);
                    val = emptyCellFlag ? "" : display_text;

                    var orgv_cells = this._orgvalue_cells;
                    var orgv_bands = this._orgvalue_bands;
                    var is_orgvalueband = false;
                    if (!nexacro._isNull(orgv_bands) && !nexacro._isNull(orgv_bands["body"]))
                    {
                        is_orgvalueband = true;
                    }
                    var is_orgvaluecell = (orgv_cells && orgv_cells[j] && is_orgvalueband);

                    if (longdate_flag)
                    {
                        cell._p_calendardateformat = "SHORTDATE";
                        val = cell._getDisplayText_date(k);
                        cell._p_calendardateformat = "LONGDATE";
                    }

                    if (display_type == "imagecontrol")
                    {
                        var expImg = this._p_exportimage.toLowerCase();
                        if (expImg == "url" || expImg == "image")
                        {
                            var path = this._getCellText(grid, k, j);

                            if (path)
                            {
                                var url = nexacro._getURIValue(path);
                                val = nexacro._getImageLocation(url, this._getForm()._getFormBaseUrl());

                            }
                            else
                            {
                                val = path;
                            }
                        }
                        else
                        {
                            val = "";
                        }
                    }
                    else if (val && display_type == "mask")
                    {
                        if (!maskeditpostfixtext_table)
                            var maskeditpostfixtext_table = new Map();
                        var maskeditpostfixtext = maskeditpostfixtext_table.get(j);
                        if (maskeditpostfixtext == undefined)
                        {
                            maskeditpostfixtext = cell._getAttrValue(cell._p_maskeditpostfixtext, k);
                            maskeditpostfixtext_table.set(j, maskeditpostfixtext ? maskeditpostfixtext : "none");
                        }
                        if (maskeditpostfixtext && maskeditpostfixtext != "none")
                        {
                            val = val.replace(maskeditpostfixtext, "");
                        }
                    }

                    /* style name & value seperate using charcode */
                    var delimiter = exportObj._commdatadelimiter;
                    /*
                    if (exportObj._commdataformat == 0) 
                    {
                        // XML 구문자를 회피하기 위한 합의된 문자열
                        delimiter = "_x001D_";
                    }
                    else
                    {
                        delimiter = String.fromCharCode(29);
                    }*/

                    if (this._exportmerge == 1) // set "suppress"
                    {
                        if (cell._getSuppress(k) > 0)
                        {
                            if (suppress_infos[k] && suppress_infos[k].text_proc)
                            {
                                val = "";
                            }
                        }

                        if (grid._supphorztype > 0)
                        {
                            if (cell._area == "left" || cell._area == "right")
                            {
                                if (suppress_infos[k])
                                {
                                    if (suppress_infos[k].horz_text_proc)
                                    {
                                        val = "";
                                    }
                                }
                            }
                        }


                        if (!!grid._checkVirtualMerge(cell, k))
                        {
                            val = "";
                            merge_data = this._getMergeDatas(k, j);
                            if (merge_data)
                            {
                                if (merge_data.isVirtualStart)
                                {
                                    if (alignCell == "left,top")
                                    {
                                        val = display_text;
                                    }
                                    else
                                    {
                                        var temp_align = alignCell.split(",");
                                        var merge_str = merge_data[temp_align[1]] + "_" + merge_data[temp_align[0]];
                                        if (this._merge_datas[merge_str])
                                        {
                                            this._merge_datas[merge_str].disPlayText = display_text;
                                            this._merge_datas[merge_str].showText = true;
                                        }
                                        else
                                        {
                                            this._merge_datas[merge_str] = {
                                                disPlayText: display_text,
                                                showText: true
                                            };
                                        }
                                    }
                                }

                                if (merge_data.showText)
                                {
                                    val = merge_data.disPlayText;
                                }
                            }
                        }
                    }
                    else if (this._exportmerge == 2) // set "merge"
                    {
                        if (grid._supphorztype > 0)
                        {
                            if (cell._area == "left" || cell._area == "right")
                            {
                                if (suppress_infos[k])
                                {
                                    if (suppress_infos[k].horz_text_proc)
                                    {
                                        val = "";
                                    }
                                }
                            }
                        }
                    }

                    if (exportObj._orgval_type || is_orgvaluecell)
                    {
                        val = nexacro._isNumber(val) ? val : nexacro._isDecimal(val) ? val.toString() : nexacro._nvl(val, "");
                    }
                    else
                    {
                        val = nexacro._nvl(val, "");
                    }

                    if (exportObj.commandversion == "2.0")
                        val = nexacro.base64Encode(val);
                    else if (exportObj.commandversion == "3.0")
                        val = nexacro.base32Encode(val);


                    if (issupp)
                    {
                        ds.setColumn(idx, "Column" + (j + subcnt), val + delimiter + (sFlag || (is_selected && activate_select_style) ? style_name : "") + delimiter + issupp);
                        issupp = false;
                    }
                    else
                        ds.setColumn(idx, "Column" + (j + subcnt), val + delimiter + (sFlag || (is_selected && activate_select_style) ? style_name : ""));

                    if (cell._subcells.length)
                    {
                        var subCell = cell._subcells;
                        var subL = subCell.length;
                        var rsp = cell._rowspan - 1;
                        var csp = cell._colspan - 1;

                        var subline = "";
                        d_BLColor = this._d_BLColor;
                        if (this._applyL)
                        {
                            line = this._getCellStyle(cell, k, odd, "border", selected);
                            linecolor = this._getColortoRGB(line.right.color) + (line.right.style == "solid" ? "" : "," + line.right.style);
                        }
                        else
                        {
                            linecolor = d_BLColor;
                        }
                        var lLine;
                        var tLine;
                        var rLine;
                        var bLine;

                        for (var i = 0; i < subL; i++)
                        {
                            var sbc = subCell[i]._col;
                            var sbr = subCell[i]._row;
                            if (sbc == csp)
                            {
                                rLine = linecolor;
                            }
                            else
                            {
                                rLine = "empty";
                            }
                            if (sbc == 0)
                            {
                                lLine = d_BLColor;
                            }
                            else
                            {
                                lLine = "empty";
                            }
                            if (sbr == rsp)
                            {
                                bLine = linecolor;
                            }
                            else
                            {
                                bLine = "empty";
                            }
                            if (sbr == 0)
                            {
                                tLine = d_BLColor;
                            }
                            else
                            {
                                tLine = "empty";
                            }

                            subline = lLine + ":" + tLine + ":" + rLine + ":" + bLine;
                            cell_type = this._getFixedCellType(subCell[i], 0); //rowidx
                            style_name = this._makeforDsStyle(ds_style, alignCell, backgroundCell, colorCell, fontCell, subline, cell_type);

                            if (i != 0)
                            {
                                ds.addColumn("Column" + (jj + subcnt), "String", 256);
                                subcnt++;
                            }

                            display_text = this._getCellText(grid, k, j, i);
                            val = emptyCellFlag ? "" : display_text;

                            if (exportObj._orgval_type || is_orgvaluecell)
                            {
                                val = nexacro._isNumber(val) ? val : nexacro._isDecimal(val) ? val.toString() : nexacro._nvl(val, "");
                            }
                            else
                            {
                                val = nexacro._nvl(val, "");
                            }

                            if (exportObj._p_commandversion == "1.0")
                                ds.setColumn(idx, "Column" + (j + subcnt), val + delimiter + style_name);
                            else if (exportObj._p_commandversion == "2.0")
                                ds.setColumn(idx, "Column" + (j + subcnt), nexacro.base64Encode(val) + delimiter + style_name);
                            else if (exportObj._p_commandversion != "1.0")
                                ds.setColumn(idx, "Column" + (j + subcnt), nexacro.base32Encode(val) + delimiter + style_name);

                        }
                    }
                }
            }
            this._preStartRow = this._startRow;
            this._startRow = partRowCount;
        }
        else
        {
            this._eof = true;
            export_param = this._p_parent._argsParam;
            export_dsparam = this._p_parent._argsDsParam;
        }

        ds_command.setColumn(0, "eof", this._eof);

        if (this._ds_response)
            delete this._ds_response;

        this._ds_response = new nexacro.DatasetBase("RESPONSE");

        // suppressinfo가 excel 통신중에 깨지는 경우 발생하여 갱신 시점을 변경
        this._rollbackSuppressInfo();

        if (export_dsparam != undefined)
        {
            this._transaction(this.id, exportObj._exporturl, "COMMAND=_ds_command STYLE=_ds_style CELL=_ds_cell" + " " + export_dsparam, "_ds_response=RESPONSE", export_param, "_exportCallback", true, exportObj._commdataformat, exportObj._commcompress);
        }
        else
        {
            this._transaction(this.id, exportObj._exporturl, "COMMAND=_ds_command STYLE=_ds_style CELL=_ds_cell", "_ds_response=RESPONSE", export_param, "_exportCallback", true, exportObj._commdataformat, exportObj._commcompress);
        }
        return true;
    };

    _pExportItem._transaction = function (id, url, inDatasetsParam, outDatasetsParam, argsParam, callbackFn, isAsync, datatype, isCompress)
    {

        this._load_manager = new nexacro._LoadManager(this);
        var service = nexacro._getServiceObject(url, true);
        this._load_manager.loadDataModule(url, id, inDatasetsParam, outDatasetsParam, argsParam, callbackFn, isAsync, datatype, isCompress, service);
    };

    _pExportItem._stopTransaction = function ()
    {
        nexacro.Form.prototype._stopTransaction.apply(this, arguments);
    };

    _pExportItem._getDatasetObject = function (queryid)
    {
        var _ds = this[queryid];
        var form = this._p_parent._p_parent;
        if (_ds == null && form)
        {
            _ds = form._getDatasetObject(queryid);
        }

        var app = this._p_parent._p_parent._getApplication();
        if (_ds == null && app)
        {

            _ds = app[queryid];
        }
        const env = nexacro.getEnvironment();
        if (_ds == null && env)
        {
            _ds = env[queryid];
        }

        return _ds;
    };

    _pExportItem._waitCursor = nexacro._emptyFn;

    _pExportItem._removeUrl = function (v)
    {
        if (v && v.length)
        {
            var index = v.indexOf("'");
            var end = -1;

            if (index > -1)
            {
                end = v.lastIndexOf("'");
                v = v.substring(index + 1, end);
            }

            index = v.indexOf("(");
            if (index > -1)
            {
                end = v.lastIndexOf(")");
                v = v.substring(index + 1, end);
            }
        }
        return v;
    };

    _pExportItem._properties = [{ name: "exceptstyle" }, { name: "exporthead" }, { name: "exportimage" }, { name: "exportmerge" }, { name: "exportselect" }, { name: "exportvalue" }, { name: "exportsize" }, { name: "range" }, { name: "source" }, { name: "type" }];
    nexacro._defineProperties(_pExportItem, _pExportItem._properties);

    _pExportItem = null;
    //delete _pExportItem;

    //==============================================================================
    // nexacro.ExportProgress
    // =============================================================================   
    nexacro.ExportProgress = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.PopupControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._uitype = 0; // export progress uitype
        this.visible = false;

        this.progressbar = null;
        this._textWidth = 0;
        this._textHeight = 0;
    };
    var _pExportProgress = nexacro.ExportProgress.prototype = nexacro._createPrototype(nexacro.PopupControl, nexacro.ExportProgress);

    _pExportProgress._type_name = "ExportProgress";

    //=================================================================
    // nexacro.ExportProgress : Style Part
    //=================================================================
    /*
    _pExportProgress.on_apply_custom_pseudo = function (pseudo)
    {
       
    };
    */
    _pExportProgress.on_apply_color = function (color)
    {
        var textbox = this._textbox;
        if (textbox)
        {
            if (color)
            {
                textbox.set_color(color);
            }
            else
            {
                textbox.set_color("");
            }
        }
    };

    _pExportProgress.on_apply_font = function (font)
    {
        var textbox = this._textbox;
        if (textbox)
        {
            textbox.set_font(font);
        }
    };
    /*
    _pExportProgress.on_apply_align = function (align)
    {
        var text_elem = this._text_elem;
        if (text_elem && align)
        {
            var halign = align.halign == "" ? "center" : align._halign;
            var valign = align.valign == "" ? "middle" : align._valign;
            text_elem.setElementAlignXY(halign, valign);
        }
    };
    */
    //===============================================================
    // nexacro.ExportProgress : Create & Destroy & Update
    //===============================================================
    _pExportProgress.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            switch (this._uitype)
            {
                case 1: //exportprogress
                    var progressbar = new nexacro.ProgressBar("progressbar", 0, 0, 1, 1, null, null, null, null, null, null, this);
                    progressbar._setControl();
                    progressbar.createComponent();
                    this.progressbar = progressbar;
                    var textbox = new nexacro.Static("progressbar:text", 0, 0, 1, 1, null, null, null, null, null, null, this);
                    textbox.set_textAlign("center");
                    textbox._setControl();
                    textbox.createComponent();
                    this._textbox = textbox;
                    break;
                case 2: // statusbar
                    var app = this._p_parent._p_parent._getApplication();
                    if (app)
                        this.progressbar = app.mainframe.statusbar;
                    break;
            }
        }
    };

    _pExportProgress.createCommand = function ()
    {
        return "";
    };

    _pExportProgress.on_created_contents = function (_window)
    {
        nexacro.PopupControl.prototype.on_created_contents.call(this, _window);
        _window = _window || this._getWindow();
        switch (this._uitype)
        {
            case 1: //exportprogress
                var textbox = this._textbox;
                var progressbar = this.progressbar;
                if (progressbar)
                {
                    progressbar.on_created();
                }
                if (textbox)
                {
                    textbox.on_created();
                }
                break;
            case 2: // statusbar
                break;
        }
    };

    _pExportProgress.on_change_containerRect = function (width, height)
    {
        switch (this._uitype)
        {
            case 1: //exportprogress
                var textbox = this._textbox;
                if (textbox)
                {
                    textbox.move(0, 0, width, height);
                    // var textwidth = this._textWidth;
                    // var textheight = this._textHeight;
                    //                   if (textwidth && textheight)
                    //    this._text_elem.setElementSize(width, height);
                }
                var progressbar = this.progressbar;
                if (progressbar)
                    progressbar.move(null, null, width, height, 0, 0);
                break;
            case 2: // statusbar
                break;
        }
    };

    _pExportProgress.on_destroy_contents = function ()
    {
        switch (this._uitype)
        {
            case 1: //exportprogress
                var textbox = this._textbox;
                if (textbox)
                {
                    textbox.destroy();
                }
                this.progressbar.destroy();
                this.progressbar = null;
                break;
            case 2: // statusbar
                this.textbox = null;
                this.progressbar = null;
                break;
        }

    };

    //==================================================================================
    // nexacro.ExportItem : Properties
    //==================================================================================

    //==================================================================================
    // nexacro.ExportItem : methods
    //==================================================================================

    _pExportProgress._getWindow = function ()
    {
        return nexacro.Component.prototype._getWindow.call(this);
    };

    //==================================================================================
    // nexacro.ExportItem : events
    //==================================================================================
    _pExportProgress.on_fire_onlbuttondown = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return true;
    };

    _pExportProgress._on_keydown = function (elem, keycode, altKey, ctrlKey, shiftKey, metakey)
    {
        if (keycode == nexacro.Event.KEY_TAB)
        {
            elem._event_stop = true;
        }
        else if (keycode == nexacro.Event.KEY_ESC)
        {
            // Stop All Communication
            nexacro._stopTransaction(this, 2);
        }

        return true;
    };


    //==================================================================================
    // nexacro.ExportItem : Logical Part
    //==================================================================================
    _pExportProgress._show = function ()
    {
        if (!this._is_created || !this._p_parent)
            return;

        var _window = this._getWindow();
        if (_window)
        {
            var width, height;

            // var left = _window.getLeft();
            // var top = _window.getTop();

            if (_window.root)
            {
                var frame = _window.root;
                width = frame.getOffsetWidth();
                height = frame.getOffsetHeight();
            }
            else
            {
                width = _window.getClientWidth();
                height = _window.getClientHeight();
            }

            var is_capture = _window._isContainsComp(true, true, this);
            if (!is_capture)
                _window._setCaptureLock(this, true, true);

            var cpd = this._getCurrentStylePadding();
            var pWidth = 0;
            var pHeight = 0;
            var _left = 0;
            var _top = 0;
            var gap = 20;
            var half_gap = 10;
            if (this._uitype == 1)
            {
                pWidth = (this._textWidth < 80 ? 100 : this._textWidth + gap);
                pHeight = this._textHeight + half_gap;
                if (cpd)
                {
                    pWidth += cpd.left + cpd.right;
                    pHeight += cpd.top + cpd.bottom;
                }
                _left = Math.round((width - pWidth) / 2);
                _top = Math.round((height - pHeight) / 2);
            }

            this.move(_left, _top, pWidth, pHeight, null, null);
            this.set_visible(true);
        }
    };

    _pExportProgress._hide = function ()
    {
        var excelexport = this._p_parent;
        if (excelexport)
        {
            var _window = excelexport._getWindow();
            if (_window)
            {
                _window._releaseCaptureLock(this);
                /*var len = _window._capture_complist.length;
                if (len > 0)
                for (var i = 0; i < len; i++)
                {
                    if (_window._capture_complist[i] && _window._capture_complist[i][0] == this)
                        _window._releaseCaptureLock(this);
                }*/
                if (nexacro._resize_popup_inbound == true)
                {
                    var control_elem = this._control_element;
                    if (control_elem)
                    {
                        control_elem.setElementSize(1, 1);
                        //this._updateClientSize(control_elem);
                    }
                }
            }
        }
        if (this._is_created && this._is_alive)
        {
            this.set_visible(false);
        }
    };

    _pExportProgress._closePopup = nexacro._emptyFn;

    nexacro._getLongerStr = function (str1, str2, str3)
    {
        var len = arguments.length;
        if (len < 2)
            return;

        var str = arguments[0];
        for (var i = 1; i < len; i++)
        {
            if (str.length < arguments[i].length)
            {
                str = arguments[i];
            }
        }
        return str;
    };

    _pExportProgress._set_text = function (v)
    {
        switch (this._uitype)
        {
            case 1:
                this._textbox.set_text(v);
                break;
            case 2:
                var form = this._getForm();
                form.set_statustext(v);
                break;
        }
    };
    _pExportProgress._set_pos = function (v)
    {
        switch (this._uitype)
        {
            case 1:
                if (this.progressbar)
                    this.progressbar.set_pos(v);
                break;
            case 2:
                var comp = this;
                while (comp && !comp._is_top_frame)
                {
                    if (comp._is_frame)
                    {
                        comp.statusbar && comp.statusbar.progressbar.set_pos(v);
                    }
                    comp = comp._p_parent;
                }
                break;
        }
    };

    _pExportProgress = null;
    //delete _pExportProgress;
}