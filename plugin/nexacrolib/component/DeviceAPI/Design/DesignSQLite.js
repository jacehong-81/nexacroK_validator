if (nexacro.LiteDBConnection)
{
    var _pLiteDBConnection = nexacro.LiteDBConnection.prototype;
    _pLiteDBConnection = function (id, parent)
    {
        this.id = this._p_name = id;
        if (parent)
        {
            this._p_parent = parent;
        }
        // set property
        this._p_sqlstatement = "";                                                 // SQLStatement의 executeQuery 함수의 결과를 제어하는 Object
        this._p_busytimeout = 60000;												// SQLite 연결시 Table에 Lock이 걸렸을 경우 응답을 받기 위한 대기시간
        this._p_openflag = 1;														// Database를 open할때 사용될 Flag
        this._p_datasource = "";													// 연결할 SQLite Database 경로
        this._p_preconnect = "false";
        this._p_async = "true";                                                    // 동기/비동기 여부


        this._event_list =
        {
            "onsuccess": 1, "onerror": 1
        };

        this.onsuccess = null;
        this.onerror = null;
        this._openflag = 1;	    
    };
    delete _pLiteDBConnection;
};

if (nexacro.LiteDBStatement)
{
    var _pLiteDBStatement = nexacro.LiteDBStatement.prototype;
    _pLiteDBStatement = function (id, parent)
    {
        this.id = this._p_name = id;
        if (parent)
        {
            this._p_parent = parent;
        }

        this._p_query = "";
        this._p_ldbconnection = "";
        this._p_parameters = {};
        this.applyrowpos = -1;
        this._p_async = "true";

        this._event_list =
        {
            "onsuccess": 1, "onerror": 1
        };

        this.onsuccess = null;
        this.onerror = null;
    };

    _pLiteDBStatement.set_ldbconnection = function (v)
    {
        if (typeof (v) == "string")
        {
            var at = "@";
            if (v.indexOf(at) == 0) //@ 있으면 제거.
            {
                v = v.substring(at.length);
            }
            this._p_ldbconnection = v;
        }        
    };
    delete _pLiteDBStatement;
};