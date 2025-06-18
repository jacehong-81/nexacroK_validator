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

if (!nexacro.Device /*|| nexacro._OS == "Windows"*/ || (nexacro._OS == "Android" && nexacro._Browser == "Runtime") || nexacro._OS == "OSX")
{
    // common interface, Platform 별 API 구현은 Device API(SQLite_HTML5/SQLite_Runtime) 파일에 있음.
    if (!nexacro._init_litedb_api)
    {
        // LiteDBConnection
        nexacro._createLiteDBConnectionObject = nexacro._emptyFn;
        nexacro._setLiteDBConnectionHandleBusyTimeOut = nexacro._emptyFn;
        nexacro._setLiteDBConnectionHandleDataSource = nexacro._emptyFn;
        nexacro._setLiteDBConnectionHandleOpenFlag = nexacro._emptyFn;
        nexacro._setLiteDBConnectionHandlePreConnect = nexacro._emptyFn;
        nexacro._setLiteDBConnectionHandleAsync = nexacro._emptyFn;
        nexacro._beginLiteDBConnectionHandle = nexacro._emptyFn;
        nexacro._closeLiteDBConnectionHandle = nexacro._emptyFn;
        nexacro._commitLiteDBConnectionHandle = nexacro._emptyFn;
        nexacro._isConnectedLiteDBConnectionHandle = nexacro._emptyFn;
        nexacro._openLiteDBConnectionHandle = nexacro._emptyFn;
        nexacro._rollbackLiteDBConnectionHandle = nexacro._emptyFn;

        // LiteDBStatement
        nexacro._createLiteDBStatementObject = nexacro._emptyFn;
        nexacro._setLiteDBStatementHandleQuery = nexacro._emptyFn;
        nexacro._setLiteDBStatementHandleldbConnection = nexacro._emptyFn;
        nexacro._initParamsLiteDBStatementHandle = nexacro._emptyFn;
        nexacro._addParamsLiteDBStatementHandle = nexacro._emptyFn;
        nexacro._setLiteDBStatementHandleParameter = nexacro._emptyFn;
        nexacro._closeLiteDBStatementHandle = nexacro._emptyFn;
        nexacro._executeQueryLiteDBStatementHandle = nexacro._emptyFn;
        nexacro._executeUpdateLiteDBStatementHandle = nexacro._emptyFn;
    }

    //==============================================================================
    //nexacro.LiteDBEventInfo
    //LiteDBConnection에 요청된 작업이 성공했을 때 발생되는 이벤트에서 사용되는 EventInfo Object
    //==============================================================================

    if (!nexacro.LiteDBEventInfo)
    {
        nexacro.LiteDBEventInfo = function (strEventId, strReason, strReturnValue)
        {
            this.id = this.eventid = strEventId || "onerror";						// 이벤트ID
            this.reason = strReason;												// 이벤트 발생분류 코드
            this.returnvalue = strReturnValue;										// 이벤트 수행결과 (type:Variant)
        };
        var _pLiteDBEventInfo = nexacro.LiteDBEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.LiteDBEventInfo);        
        _pLiteDBEventInfo._type_name = "LiteDBEventInfo";

        _pLiteDBEventInfo = null;
    }

    //==============================================================================
    //nexacro.LiteDBErrorEventInfo
    //LiteDBConnection에 요청된 작업이 실패했을 때 발생되는 이벤트에서 사용되는 EventInfo Object
    //==============================================================================
    if (!nexacro.LiteDBErrorEventInfo)
    {
        nexacro.LiteDBErrorEventInfo = function (strEventId, intErrorCode, strErrorMsg, strldbErrorCode, strldbErrorMsg)
        {
            this.id = this.eventid = strEventId || "onsuccess";						// 이벤트ID
            this.errortype = "ObjectError";
            this.statuscode = intErrorCode;											// 오류코드 : integer 로 된 errorcode (iOS/Android에서 발생하는 errorcode를 그대로 사용)
            this.errormsg = strErrorMsg;											// 오류메세지 : string으로 된 errormsg (iOS/Android에서 발생하는 error message를 그대로 사용)
            this.ldberrorcode = strldbErrorCode;									// Database의 오류코드
            this.ldberrormsg = strldbErrorMsg;										// Database의 오류 메시지  
        };

        var _pLiteDBErrorEventInfo = nexacro.LiteDBErrorEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.LiteDBErrorEventInfo);        
        _pLiteDBErrorEventInfo._type_name = "LiteDBErrorEventInfo";

        _pLiteDBErrorEventInfo = null;
    }

    //==============================================================================
    //nexacro.LiteDBConnection
    //모바일 기기에서 지원되는 SQLConnection Database를 연동하기 위해 사용한다.
    //==============================================================================
    if (!nexacro.LiteDBConnection)
    {
        nexacro.LiteDBConnection = function (id, parent)
        {
			nexacro._EventSinkObject.call(this, id, parent);

            // set property
            this._p_sqlstatement = "";                                                 // SQLStatement의 executeQuery 함수의 결과를 제어하는 Object
            this._p_busytimeout = 60000;												// SQLite 연결시 Table에 Lock이 걸렸을 경우 응답을 받기 위한 대기시간
            this._p_openflag = 1;														// Database를 open할때 사용될 Flag
            this._p_datasource = "";													// 연결할 SQLite Database 경로
            this._p_preconnect = "false";
            this._p_async = "true";                                                    // 동기/비동기 여부
            
            this._event_list = {
                "onsuccess": 1, "onerror": 1
            };

            this.onsuccess = null;
            this.onerror = null;

            // ----------------- internal variable ------------------ // 
            this.handle = nexacro._createLiteDBConnectionObject(this);
            this._openflag = 1;
            //this._win_handle = null;       
        };

        // const value
        nexacro.LiteDBConnection.openReadWrite = 0;
        nexacro.LiteDBConnection.openReadWriteCreate = 1;

        var _pLiteDBConnection = nexacro.LiteDBConnection.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.LiteDBConnection);        
        _pLiteDBConnection._type_name = "LiteDBConnection";

        _pLiteDBConnection.destroy = function ()
        {
            if (this.handle)
            {
                this.close();
                this.handle = null;
            }
            return true;
        };

        //===============================================================
        // nexacro.LiteDBConnection : Properties
        //===============================================================
        _pLiteDBConnection.set_busytimeout = function (v)
        {
            if (this.paramck_busytimeout(v))
            {
                this._p_busytimeout = v;
                nexacro._setLiteDBConnectionHandleBusyTimeOut(this, v);

                return true;
            }
            else
            {
                return false;
            }
        };

        _pLiteDBConnection.set_datasource = function (v)
        {
            if (this.paramck_datasource(v))
            {
                this._p_datasource = v;
                nexacro._setLiteDBConnectionHandleDataSource(this, v);

                if (this._p_preconnect == "true" || this._p_preconnect == true)
                {
                    this.open();
                }
                return true;
            }
            else
            {
                return false;
            }
        };

        _pLiteDBConnection.set_openflag = function (v)
        {
            if (v == "openReadWrite")
            {
                this._p_openflag = v;
                this._openflag = nexacro.LiteDBConnection.openReadWrite;
            }
            else if (v == "openReadWriteCreate")
            {
                this._p_openflag = v;
                this._openflag = nexacro.LiteDBConnection.openReadWriteCreate;
            }
            else if (v == nexacro.LiteDBConnection.openReadWrite || v == nexacro.LiteDBConnection.openReadWriteCreate)
            {
                this._openflag = v;
                this._p_openflag = v;
                nexacro._setLiteDBConnectionHandleOpenFlag(this, this._openflag);

                return true;
            }
            else
            {
                return false;
            }
        };

        _pLiteDBConnection.set_preconnect = function (v)
        {
            if (v == "true" || v == "false" || v == true || v == false)
            {
                this._p_preconnect = nexacro._toBoolean(v);
                nexacro._setLiteDBConnectionHandlePreConnect(this, this._p_preconnect);

                if (this._p_preconnect == "true" || this._p_preconnect == true)
                {
                    if (this._p_datasource != "")
                    {
                        this.open();
                    }
                }
                return true;
            }
            else
            {
                return false;
            }
        };

        _pLiteDBConnection.set_async = function (v)
        {
            if (v == "true" || v == "false" || v == true || v == false)
            {
                this._p_async = nexacro._toBoolean(v);
                nexacro._setLiteDBConnectionHandleAsync(this, this._p_async);

                return true;
            }
            else
            {
                return false;
            }
        };

        _pLiteDBConnection._properties = [{ name: "sqlstatement" }, { name: "busytimeout" }, { name: "openflag" }, { name: "datasource" }, { name: "preconnect" }, { name: "async" }];
        nexacro._defineProperties(_pLiteDBConnection, _pLiteDBConnection._properties);

        //===============================================================
        // nexacro.LiteDBConnection : Methods
        //===============================================================
        // SQLConnection에 연결된 Database에 Transaction을 설정한다	
        _pLiteDBConnection.begin = function ()
        {
        	if (this.handle)
            {
                nexacro._beginLiteDBConnectionHandle(this);
            }
        };

        // SQLConnection에 연결된 Database를 닫는다.
        _pLiteDBConnection.close = function ()
        {
        	if (this.handle)
            {
                nexacro._closeLiteDBConnectionHandle(this);
            }
        };

        // SQLConnection에 연결된 Database에 Commit을 수행한다
        _pLiteDBConnection.commit = function ()
        {
        	if (this.handle)
            {
                nexacro._commitLiteDBConnectionHandle(this);
            }
        };

        // SQLConnection이 Database에 연결되어 있는지 여부를 확인한다
        _pLiteDBConnection.isConnected = function ()
        {
        	if (this.handle)
            {
                nexacro._isConnectedLiteDBConnectionHandle(this);
            }
        };

        // SQLConnection이 Database에 연결한다
        _pLiteDBConnection.open = function (strDataSource, constOpenFlag)
        {
            if (arguments.length >= 2)
            {   
                if (constOpenFlag == "openReadWrite")
                    constOpenFlag = nexacro.LiteDBConnection.openReadWrite;
                else if (constOpenFlag == "openReadWriteCreate")
                    constOpenFlag = nexacro.LiteDBConnection.openReadWriteCreate;
                
                nexacro._setLiteDBConnectionHandleOpenFlag(this, constOpenFlag);
            }
            else
            {
                constOpenFlag = this._openflag;   
            }

            if (strDataSource != null)
            {
                this.datasource = strDataSource;
                nexacro._setLiteDBConnectionHandleDataSource(this, this._p_datasource);
            }

            if (this.paramck_open(this._p_datasource, constOpenFlag))
            {
                nexacro._openLiteDBConnectionHandle(this, this._p_datasource, constOpenFlag);
            }
            else
            {
                return false;
            }
            return true;
        };

        // SQLConnection에 연결된 Database에 Rollback을 수행한다
        _pLiteDBConnection.rollback = function ()
        {
        	if (this.handle)
            {
                nexacro._rollbackLiteDBConnectionHandle(this);
            }
        };

        //===============================================================
        // nexacro.LiteDBConnection : Event Handlers
        //===============================================================
        _pLiteDBConnection.on_success = function (reason, returnvalue)
        {
            var e = new nexacro.LiteDBEventInfo("onsuccess", reason, returnvalue);
            this.on_fire_onsuccess(this, e);
        };

        _pLiteDBConnection.on_fire_onsuccess = function (objLiteDBConnection, eLiteDBEventInfo)
        {
            if (this.onsuccess && this.onsuccess._has_handlers)
            {
                return this.onsuccess._fireEvent(this, eLiteDBEventInfo);
            }
            return true;
        };

        _pLiteDBConnection.on_error = function (errorcode, errormsg, ldberrorcode, ldberrormsg)
        {
            var e = new nexacro.LiteDBErrorEventInfo("onerror", errorcode, errormsg, ldberrorcode, ldberrormsg);
            this.on_fire_onerror(this, e);
        };

        _pLiteDBConnection.on_fire_onerror = function (objAsyncLiteDBConnection, eAsyncLiteDBErrorEventInfo)
        {
            if (this.onerror && this.onerror._has_handlers)
            {
                return this.onerror._fireEvent(this, eAsyncLiteDBErrorEventInfo);
            }
            return true;
        };

        //===============================================================
        // nexacro.LiteDBConnection : Logical Part
        //===============================================================
        _pLiteDBConnection.paramck_busytimeout = function (timout)
        {
            if (timout == null)
            {
                return false;
            }

            if (!this._publicNumCheck(timout))
            {
                return false;
            }

            if (timout < 200 || timout > 86400000)
            {
                return false;
            }

            return true;
        };

        _pLiteDBConnection.paramck_datasource = function (datasrc)
        {
            if (datasrc == null)
            {
                return false;
            }
            return true;
        };

        _pLiteDBConnection.paramck_open = function (strDataSource, constOpenFlag)
        {
            if (strDataSource == null || typeof (strDataSource) != "string")
            {
                return false;
            }

            if (!this._publicNumCheck(constOpenFlag))
            {
                return false;
            }
            return true;
        };

        _pLiteDBConnection._publicNumCheck = function (v)
        {
            var strlength;
            var numberss;

            try
            {
                strlength = v.toString().split(" ").join("");
            }
            catch (e)
            {
                return false;
            }

            if (strlength.length == 0)
            {
                return false;
            }

            try
            {
                numberss = Number(v.toString());
            }
            catch (e)
            {
                return false;
            }

            var checknumberss = +numberss;
            if (checknumberss != checknumberss)
            {
                return false;
            }

            return true;
        };

        _pLiteDBConnection = null;
    }

    ////==============================================================================
    ////nexacro.LiteDBParameter
    ////Query를 수행하는 Object
    ////==============================================================================
    if (!nexacro.LiteDBParameter)
    {
        nexacro.LiteDBParameter = function (name, type, value)
        {
            this.id = this._p_name = name || "";
            this._p_type = type || "string";
            this._p_value = value;
        };

        var _pLiteDBParameter = nexacro.LiteDBParameter.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.LiteDBParameter);        
        _pLiteDBParameter._type_name = "LiteDBParameter";

        //===============================================================
        // nexacro.LiteDBParameter : Properties
        //===============================================================
        _pLiteDBParameter.set_name = function (v)
        {
            if (this.paramck_datasource(v))
            {
                this._p_name = v;
                return true;
            }
            else
            {
                return false;
            }
        };

        _pLiteDBParameter.set_value = function (v)
        {
            if (this.paramck_datasource(v))
            {
                this._p_value = v;
                return true;
            }
            else
            {
                return false;
            }
        };

        _pLiteDBParameter.set_type = function (v)
        {
            if (this.paramck_datasource(v))
            {
                this._p_type = v;
                return true;
            }
            else
            {
                return false;
            }
        };

        _pLiteDBParameter._properties = [{ name: "type" }, { name: "value" }, { name: "name" }];
        nexacro._defineProperties(_pLiteDBParameter, _pLiteDBParameter._properties);

        if (nexacro.Device)
        {
            _pLiteDBParameter.toJSON = function ()
            {
                var valueString;
                if (this._p_value == null)
                {
                    valueString = 'null';
                }
                else if (this.value == undefined)
                {
                    valueString = 'undefined';
                }
                else
                {
                    switch (nexacro.DataUtils.toTypeCode(this._p_type))
                    {
                        case 2: /* int */
                        case 3: /* float, double */
                            valueString = nexacro.DataUtils.toTextFromDecimal(this._p_value);
                            break;
                        case 4: /* decimal, bigdecimal */
                            valueString = '"' + nexacro.DataUtils.toTextFromDecimal(this._p_value) + '"';
                            break;
                        case 5: /* date */
                            valueString = '"' + nexacro.DataUtils.toTextFromDate(this._p_value) + '"';
                            break;
                        case 6: /* time */
                            valueString = '"' + nexacro.DataUtils.toTextFromTime(this._p_value) + '"';
                            break;
                        case 7: /* datetime */
                            if (this.value.dateObj == undefined)
                                valueString = '"' + nexacro.DataUtils.toTextFromDateTime(this._p_value) + '"';
                            else
                                valueString = '"' + nexacro.DataUtils.toTextFromDateTime(this._p_value.dateObj) + '"';
                            break;
                        case 0: /* undefined */
                        case 1: /* string */
                        case 8: /* blob */
                        case 9: /* variant */
                        default:
                            valueString = '"' + nexacro.Device.encodeString(this._p_value) + '"';
                            break;
                    }
                }
                return nexacro._executeGlobalEvalStr('({"name":"' + this._p_name + '","type":' + nexacro.DataUtils.toTypeCode(this._p_type) + ',"value":' + valueString + '})');
            };
        }
    	
        //===============================================================
        // nexacro.LiteDBParameter : Logical Part
        //===============================================================
        _pLiteDBParameter.paramck_datasource = function (datasrc)
        {
            if (datasrc == null)
            {
                return false;
            }
            return true;
        };

        _pLiteDBParameter = null;
    }
    
    ////==============================================================================
    ////nexacro.LiteDBStatement
    ////Query를 수행하는 Object
    ////==============================================================================
    if (!nexacro.LiteDBStatement)
    {
        nexacro.LiteDBStatement = function (id, parent)
        {
			nexacro._EventSinkObject.call(this, id, parent);

            this._p_query = "";														
            this._p_ldbconnection = "";
            this._p_parameters = {};
            this._p_async = "true";                                                    // 동기/비동기 여부

            this.applyrowpos = -1;

            this._event_list = {
                "onsuccess": 1, "onerror": 1
            };

            this.onsuccess = null;
            this.onerror = null;

            // ----------------- internal variable ------------------ // 
            this.handle = nexacro._createLiteDBStatementObject(this);
            
        };
        var _pLiteDBStatement = nexacro.LiteDBStatement.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.LiteDBStatement);        
        _pLiteDBStatement._type_name = "LiteDBStatement";

        // destroy
        _pLiteDBStatement.destroy = function ()
        {
            if (this.handle)
            {
                this.close();
                this.handle = null;
            }

            return true;
        };

        //===============================================================
        // nexacro.LiteDBStatement : Properties
        //===============================================================

        _pLiteDBStatement.set_query = function (v)
        {
            if (this.paramck_query(v))
            {
                this._p_query = v;
                nexacro._setLiteDBStatementHandleQuery(this, v);

                return true;
            }
            else
            {
                return false;
            }
        };

        _pLiteDBStatement.set_ldbconnection = function (v)
        {
            var ret = false;

            if (v instanceof nexacro.LiteDBConnection)
            {
                this._p_ldbconnection = v;
                nexacro._setLiteDBStatementHandleldbConnection(this, v);
                ret = true;
            }
            else if (typeof (v) == "string")
            {
                var at = "@";
                if (v.indexOf(at) == 0) //@ 있으면 제거.
                {
                    v = v.substring(at.length);
                }
               /* else if (v.match(/@/) == null)
                { //없으면 붙여서 강제로 false.
                    v = at + v;
                }*/

                if (null != this.parent[v] && this.parent[v] instanceof nexacro.LiteDBConnection)
                {
                    this._p_ldbconnection = this.parent[v];
                    nexacro._setLiteDBStatementHandleldbConnection(this, this._p_parent[v]);
                    ret = true;
                }
            }

            return ret;
        };

        _pLiteDBStatement.set_parameters = function (v)
        {
            var nIdx, param;
            if (v instanceof nexacro.Dataset)
            {
                // nexacro.Dataset
                var dataset = v;
                var colsize = dataset.getColCount();
                var rowsize = dataset.getRowCount();

                nexacro._initParamsLiteDBStatementHandle(this);

                for (var row = 0; row < rowsize; row++)
                {
                    nIdx = nexacro._addParamsLiteDBStatementHandle(this);
                    for (var col = 0; col < colsize; col++)
                    {
                        param = new nexacro.LiteDBParameter();
                        var colinfo = dataset.getColumnInfo(col);
                        var value = dataset.getColumn(row, colinfo.name);

                        param.set_name(colinfo.name);
                        param.set_type(colinfo.type);
                        param.set_value(value);

                        nexacro._setLiteDBStatementHandleParameter(this, param, nIdx);
                    }
                }

                this._p_parameters = v;
                return true;
            }
            else if (v instanceof Array)
            {
                // nexacro.LiteDBParameter array
                nexacro._initParamsLiteDBStatementHandle(this);
                nIdx = nexacro._addParamsLiteDBStatementHandle(this);

                for (var i = 0; i < v.length; i += 1)
                {
                    param = v[i];
                    if (param instanceof nexacro.LiteDBParameter)
                    {
                        nexacro._setLiteDBStatementHandleParameter(this, param, nIdx);
                    }
                }

                this._p_parameters = v;
                return true;
            }
            else if (v instanceof Object)
            {
                // { name : nexacro.LiteDBParameter }
                nexacro._initParamsLiteDBStatementHandle(this);
                nIdx = nexacro._addParamsLiteDBStatementHandle(this);

                for (var id in v)
                {
                    param = v[id];
                    if (param instanceof nexacro.LiteDBParameter)
                    {
                        nexacro._setLiteDBStatementHandleParameter(this, param, nIdx);
                    }
                }
                this._p_parameters = v;
                return true;
            }

            return false;
        };

        _pLiteDBStatement.set_async = function (v)
        {
            if (v == "true" || v == "false" || v == true || v == false)
            {
                this._p_async = nexacro._toBoolean(v);
                nexacro._setLiteDBStatementHandleAsync(this, this._p_async);

                return true;
            }
            else
            {
                return false;
            }
        };

        _pLiteDBStatement._properties = [{ name: "query" }, { name: "ldbconnection" }, { name: "parameters" }, { name: "async" }]
        nexacro._defineProperties(_pLiteDBStatement, _pLiteDBStatement._properties);


        //===============================================================
        // nexacro.LiteDBStatement : Methods
        //===============================================================
        _pLiteDBStatement.close = function ()
        {
            // Query 수행을 중단한다
        	if (this.handle)
            {
                nexacro._closeLiteDBStatementHandle(this);
            }
        };

        _pLiteDBStatement.executeQuery = function (strQuery)
        {
            // Query중 Select문을 지원한다
            // query 검사 및 설정.

            if (strQuery == null)
            {
                if (this._p_query.length == 0)
                {
                    return false;
                }
            }
            else
            {
                if (typeof (strQuery) == "string" && strQuery.length > 0)
                {
                    this._p_query = strQuery;
                    nexacro._setLiteDBStatementHandleQuery(this, strQuery);
                }
                else
                {
                    return false;
                }
            }

            /* SQL문의 유형을 판단하지 않는다.
            var retType = this.caheckTypeKeyword(this.query);
            // 1 = select, 2 = insert, 3 = update, 4 = delete
            if (retType != 1)
            {
                return false;
            }
            */

            // native 로 넘겨줄때만 쿼리 가공 2012.3.13 pg
            // this.checkQueryString();
            //var retQuery = this.retQueryString(this.query);

            // dbconnection check
            if (this._p_ldbconnection == null || this._p_ldbconnection == undefined)
            {
                return false;
            }

            if (!(this._p_ldbconnection instanceof nexacro.LiteDBConnection))
            {
                return false;
            }

            // 실행 
            nexacro._executeQueryLiteDBStatementHandle(this);

            // 파라메터 오류 없음 리턴.       

            return true;
        };

        // Query중 Insert, Update, Delete 구문을 지원한다
        _pLiteDBStatement.executeUpdate = function (strQuery)
        {
            // query 검사 및 설정.	   
            if (strQuery == null)
            {
                if (this._p_query.length == 0)
                {
                    return false;
                }
            }
            else
            {
                if (typeof (strQuery) == "string" && strQuery.length > 0)
                {
                    this._p_query = strQuery;
                    nexacro._setLiteDBStatementHandleQuery(this, strQuery);
                }
                else
                {
                    return false;
                }
            }

            /* SQL문의 유형을 판단하지 않는다.
            var retType = this.caheckTypeKeyword(this.query);
            // 1 = select, 2 = insert, 3 = update, 4 = delete
            if (retType < 2)
            {
                return false;
            }
            */

            // native 로 넘겨줄때만 쿼리 가공 2012.3.13 pg
            //this.checkQueryString();
            //var retQuery = this.retQueryString(this.query);

            // dbconnection check
            if (this._p_ldbconnection == null || this._p_ldbconnection == undefined)
            {
                return false;
            }
            
            if (!(this._p_ldbconnection instanceof nexacro.LiteDBConnection))
            {
                return false;
            }

            // 실행 
            nexacro._executeUpdateLiteDBStatementHandle(this);
            
            // 파라메터 오류 없음 리턴. 
            return true;
        };

        //===============================================================
        // nexacro.LiteDBStatement : Event Handlers
        //===============================================================
        _pLiteDBStatement.on_success = function (reason, returnvalue)
        {
            var e;
            if (reason != "7")
            {
                e = new nexacro.LiteDBEventInfo("onsuccess", reason, returnvalue);
            }
            else
            {
                //executeQuery의 실행결과는 dataset로 리턴한다.
                var tempDS = new nexacro.DatasetBase("__tempDS", this._p_parent);

                tempDS = this.JSONStringToDataset2(returnvalue, tempDS);
                e = new nexacro.LiteDBEventInfo("onsuccess", reason, tempDS);
            }
            this.on_fire_onsuccess(this, e);
        };

        _pLiteDBStatement.on_fire_onsuccess = function (objLiteDBStatement, eLiteDBEventInfo)
        {
            if (this.onsuccess && this.onsuccess._has_handlers)
            {
                return this.onsuccess._fireEvent(this, eLiteDBEventInfo);
            }
            return true;
        };

        _pLiteDBStatement.on_error = function (errorcode, errormsg, ldberrorcode, ldberrormsg)
        {
            var e = new nexacro.LiteDBErrorEventInfo("onerror", errorcode, errormsg, ldberrorcode, ldberrormsg);
            this.on_fire_onerror(this, e);
        };

        _pLiteDBStatement.on_fire_onerror = function (objLiteDBStatement, eLiteDBErrorEventInfo)
        {
            if (this.onerror && this.onerror._has_handlers)
            {
                return this.onerror._fireEvent(this, eLiteDBErrorEventInfo);
            }
            return true;
        };

        //===============================================================
        // nexacro.LiteDBStatement : Logical Part
        //===============================================================
        // native 로 넘겨줄때만 쿼리 가공 2012.3.13 pg
        _pLiteDBStatement.retQueryString = function (str)
        {
            str = str.replace(/"/g, "_DQOUT_");//"&quot;");
            str = str.replace(/'/g, "_QUOT_");//apos;");
            return str;
        };

        _pLiteDBStatement.caheckTypeKeyword = function (strQuery)
        {
            if (typeof (strQuery) == "undefined" || strQuery.length == 0)
            {
                return;
            }

            var qry = strQuery.toLowerCase();
            var arr = qry.split(" ");
            for (var i = 0; i < arr.length; i++)
            {
                // string의 indexOf()의 용도가 exist check용이면 match() 로 대체
                if (strQuery.match(/select/i) != null) { return 1; }
                else if (strQuery.match(/insert/i) != null) { return 2; }
                else if (strQuery.match(/update/i) != null) { return 3; }
                else if (strQuery.match(/delete/i) != null) { return 4; }                                
            }

            return 0;
        };

        _pLiteDBStatement.paramck_query = function (db_query)
        {
            if (db_query == null || typeof (db_query) != "string")
            {
                return false;
            }
            return true;
        };
        
        //===============================================================
        // nexacro.LiteDBStatement : Util Part
        //===============================================================
        // JSON string -> Dataset
        _pLiteDBStatement.JSONStringToDataset2 = function (jsonString, dataset)
        {
            if (dataset == undefined)
                dataset = new nexacro.DatasetBase();

            return this.JSONObjectToDataset2(nexacro._executeGlobalEvalStr('(' + jsonString + ')'), dataset);
        };

        _pLiteDBStatement.JSONObjectToDataset2 = function (jsonObject, dataset)
        {
            if (jsonObject == undefined || jsonObject.columnInfos == undefined)
                return dataset;
            if (dataset == undefined)
                dataset = new nexacro.DatasetBase();

            var colInfos = jsonObject.columnInfos;
            var i;
            for (i = 0; i < colInfos.length; i++)
            {
                dataset.addColumn(colInfos[i].name, nexacro.DataUtils.toTypeName(colInfos[i].type));
            }

            var rows = jsonObject.rows;
            for (i = 0; i < rows.length; i++)
            {
                var ridx = dataset.addRow();
                for (var j = 0; j < colInfos.length; j++)
                {
                    switch (colInfos[j].type)
                    {
                        case 1: /* string */
                            dataset.setColumn(ridx, colInfos[j].name, this.jsonDecodeString(rows[i][colInfos[j].name]));
                            //dataset.setColumn(ridx, colInfos[j].name, jsonval);
                            break;
                        case 4: /* decimal, bigdecimal */
                            //dataset.setColumn(ridx,colInfos[j].name,new TOBE.Decimal(rows[i][colInfos[j].name]));
                            dataset.setColumn(ridx, colInfos[j].name, rows[i][colInfos[j].name]);
                            break;
                        case 2: /* int */
                        case 3: /* float, double */
                        case 5: /* date */
                        case 6: /* time */
                        case 7: /* datetime */
                        case 0: /* undefined */
                        case 8: /* blob */
                        case 9: /* variant */
                        default:
                            dataset.setColumn(ridx, colInfos[j].name, rows[i][colInfos[j].name]);
                            break;
                    }
                }
            }
            return dataset;
        };

        _pLiteDBStatement.jsonDecodeString = function (source)
        {
            if (source === undefined || source === null)
                return source;
            if (typeof (source) != 'string')
                return source;
            //return encodeURI(source);
            var value = source;
            value = value.replace(/\"/g, "&quot;");
            value = value.replace(/\'/g, "&apos;");
            value = value.replace(/\r/g, "&#13;");
            value = value.replace(/\n/g, "&#10;");
            value = value.replace(/\t/g, "&#9;");
            value = value.replace(/\\/g, "&#92;");
            return value;
        };

        _pLiteDBStatement.jsonDecodeString = function (source)
        {
            if (source === undefined || source === null)
                return source;
            if (typeof (source) != 'string')
                return source;
            //return decodeURI(source);
            var value = source;
            value = value.replace(/\&quot\;/g, "\"");
            value = value.replace(/\&apos\;/g, "'");
            value = value.replace(/\&\#13\;/g, "\r");
            value = value.replace(/\&\#10\;/g, "\n");
            value = value.replace(/\&\#9\;/g, "\t");
            value = value.replace(/\&\#92\;/g, "\\");
            return value;
        };

        _pLiteDBStatement = null;
    }
}
