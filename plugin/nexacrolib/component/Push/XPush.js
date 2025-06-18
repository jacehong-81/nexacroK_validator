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
if (!nexacro.XPush)
{
    //==============================================================================
    // nexacro.XPushEventInfo
    //==============================================================================
    nexacro.XPushEventInfo = function (eventid, action, serverip, serverport, pushmessageobject, layout)
    {
        this.eventid = eventid;

        this.action = action;
        this.message = pushmessageobject;
        this.serverip = serverip;
        this.serverport = serverport;
        this.returnvalue = null;
        this.layout = layout;

        if (this.action == 11 /* RTID */)
        {
            this.returnvalue = pushmessageobject.returnvalue;
        }
        else
        {
            if (pushmessageobject && pushmessageobject.returnvalue != undefined && pushmessageobject.returnvalue[0] != undefined)
                this.returnvalue = pushmessageobject.returnvalue[0].count;
        }
    };

    var _pXPushEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.XPushEventInfo);
    nexacro.XPushEventInfo.prototype = _pXPushEventInfo;
    _pXPushEventInfo._type_name = "XPushEventInfo";

    //delete _pXPushEventInfo;
    _pXPushEventInfo = null;

    //==============================================================================
    // nexacro.XPushErrorEventInfo
    //==============================================================================
    nexacro.XPushErrorEventInfo = function (eventid, action, errormsg, serverip, serverport, statuscode, pushmessageobject)
    {
        this.eventid = eventid;

        this.action = action;
        this.errormsg = errormsg;
        this.errortype = "ObjectError";
        this.message = pushmessageobject;
        this.serverip = serverip;
        this.serverport = serverport;
        this.statuscode = statuscode;
        this.reply = null;
    };

    var _pXPushErrorEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.XPushErrorEventInfo);
    nexacro.XPushErrorEventInfo.prototype = _pXPushErrorEventInfo;
    _pXPushErrorEventInfo._type_name = "XPushErrorEventInfo";

    //delete _pXPushErrorEventInfo;
    _pXPushErrorEventInfo = null;

    //==============================================================================
    // nexacro.XPushKeepAliveEventInfo
    //==============================================================================
    nexacro.XPushKeepAliveEventInfo = function (eventid, type)
    {
        this.eventid = eventid;
        this.type = type;
    };

    var _pXPushKeepAliveEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.XPushKeepAliveEventInfo);
    nexacro.XPushKeepAliveEventInfo.prototype = _pXPushKeepAliveEventInfo;
    _pXPushKeepAliveEventInfo._type_name = "XPushKeepAliveEventInfo";

    //delete _pXPushErrorEventInfo;
    _pXPushErrorEventInfo = null;

    //==============================================================================
    // nexacro.CommandControl
    //==============================================================================
    nexacro.CommandControl = function (strCommand, strMessageType, strMessageKey, objForm, objDataset, strType, strCallBack, nRow, strCheck, bUseActiveFormCallBack, strUserID, strProjectId)
    {
        this._id = nexacro.Device.makeID();
        nexacro.Device._userCreatedObj[this._id] = this;

        this.actiontype = strCommand;
        this.callback = strCallBack;
        this.check = strCheck ? strCheck : "0";
        this.messagekey = strMessageKey;
        this.messagetype = strMessageType;
        this.objdataset = objDataset;
        this.objform = objForm;
        this.row = nexacro._isNull(nRow) ? 0 : nRow;
        this.type = strType ? strType : "update";
        this.useactiveformcallback = bUseActiveFormCallBack ? nexacro._toBoolean(bUseActiveFormCallBack) : false;
        this.userid = strUserID ? strUserID : "";
        this.projectid = strProjectId ? strProjectId : "";
    };

    var _pCommandControl = nexacro.CommandControl.prototype = nexacro._createPrototype(nexacro.EventSinkObject);
    _pCommandControl._type_name = "CommandControl";

    _pCommandControl.destroy = function () { };

    _pCommandControl.equal = function (other)
    {
        if (this.callback != other.callback)
            return false;
        if (this.check != other.check)
            return false;
        if (this.messagekey != other.messagekey)
            return false;
        if (this.messagetype != other.messagetype)
            return false;

        // objdataset, objform은 객체라 조건이 ===, !== 이런식임.
        if (this.objdataset !== other.objdataset)
            return false;
        if (this.objform !== other.objform)
            return false;

        if (this.row != other.row)
            return false;
        if (this.type != other.type)
            return false;
        if (this.useactiveformcallback != other.useactiveformcallback)
            return false;
        if (this.userid != other.userid)
            return false;

        return true;
    };

    _pCommandControl.toJSON = function (idx)
    {
        return {
            "_id": this._id,
            "messagetype": this.messagetype,
            "messagekey": this.messagekey
        };
    };

    _pCommandControl.remove = function (idx)
    {
        return (idx < 0 || idx > this.length) ? this : this.slice(0, idx).concat(this.slice(idx + 1, this.length));
    };

    _pCommandControl = null;
    //delete _pCommandControl;

    //==============================================================================
    // nexacro.PushMessage
    //==============================================================================
    nexacro.PushMessage = function (strMessageId, strMessageType, strMessageKey, retVal)
    {
        this.messageid = strMessageId || "";
        this.messagetype = strMessageType || "";
        this.messagekey = strMessageKey || "";
        this.returnvalue = retVal || "";
    };

    var _pPushMessage = nexacro.PushMessage.prototype = nexacro._createPrototype(nexacro.EventSinkObject);
    _pPushMessage._type_name = "PushMessage";

    _pPushMessage = null;
    //delete _pPushMessage;

    //==============================================================================
    // nexacro.XPush
    //==============================================================================
    nexacro.XPush = function (id, parent)
    {
        nexacro._EventSinkObject.call(this, id, parent);

        this._xpush_controller = new nexacro._XPushController(this);
        this._xpush_controller.create();
        this._commandlist = [];
        this._iplist = [];
    };

    var _pXPush = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.XPush);
    nexacro.XPush.prototype = _pXPush;
    _pXPush._type_name = "XPush";

    /* default properties */
    _pXPush._p_enableevent = true;
    _pXPush._p_async = true;    //메뉴얼 미노출
    //_pXPush.channeltype;
    _pXPush._p_controlretry = 5;
    _pXPush._p_debug = false;
    _pXPush._p_errorcode = null;
    _pXPush._p_errormsg = null;
    _pXPush._p_keepalivetime = 30;
    _pXPush._p_keeptimeout = 60;
    _pXPush._p_layouturl = "";
    _pXPush._p_retry = 1;
    _pXPush._p_sessionid = "";
    _pXPush._p_timeout = 30;
    _pXPush._p_userid = "";
    _pXPush._p_projectid = "";
    _pXPush._p_protocolversion = 2;
    _pXPush._p_iplist = "";

    /* internal variable */
    _pXPush._connectSuccess = false;
    _pXPush._registerDeviceSuccess = false;
    _pXPush._currentipinfo = null;

    /* event list */
    _pXPush._event_list = {
        "onsuccess": 1, "onerror": 1, "onkeepalive": 1
    };

    /* XPush XPushAction Const */
    nexacro.XPushAction = {
        AUTH: 0,
        BYEC: 1,
        ADDF: 2,
        DELF: 3,
        REQD: 4,
        RECT: 5,
        RGST: 6,
        UNRG: 7,
        ADUI: 8,
        UNUI: 9,
        MSGC: 10,
        RTID: 11
    };

    /* XPush Inner Const */
    _pXPush._XPushErrorCode = {
        BYEC: -401,
        RECT: -901,
        REQD: -902,
        RGST: -1001,
        UNRG: -1001,
        ADUI: -1002,
        UNUI: -1003,
        MSGC: -1004,
        RTID: -1005
    };

    _pXPush._XPushErrorMessage = {
        "-100": "object_push_send_byec",
        "-101": "object_push_socket_timeout",
        "-200": "object_push_fail_command_auth",
        "-201": "object_push_fail_all_command_auth",
        "-202": "object_push_fail_data_auth",
        "-300": "object_push_fail_connect",
        "-301": "object_push_fail_send_receive",
        "-302": "object_push_connected_already",
        "-401": "object_push_fail_disconnect",
        "-501": "object_push_fail_suspend",
        "-601": "object_push_fail_resume",
        "-701": "object_push_fail_command",
        "-702": "object_push_notfound_layouturl",
        "-703": "object_push_invalid_layouturl",
        "-801": "object_push_fail_protocol_version",
        "-901": "object_push_fail_rect",
        "-902": "object_push_fail_reqd",
        "-1001": "object_push_fail_rgst_unrg",
        "-1002": "object_push_fail_adui",
        "-1003": "object_push_fail_unui",
        "-1004": "object_push_fail_msgc",
        "-1005": "object_push_fail_rtid",
        "-1072": "object_push_fail_already_device_token_exists",
        "-1092": "object_push_fail_already_topic_exists"
    };

    //===============================================================
    // nexacro.XPush : Create & Destroy
    //===============================================================
    _pXPush.destroy = function ()
    {
        if (this._xpush_controller)
        {
            this._xpush_controller.destroy();
            this._xpush_controller = null;
        }

        if (this._p_parent)
        {
            this._p_parent.removeChild(this.id);
            this._p_parent = null;
        }

        nexacro._EventSinkObject.prototype.destroy.call(this);
    };

    //===============================================================
    // nexacro.XPush : Override
    //===============================================================
    _pXPush._findForm = function (comp)
    {
        var form = comp;
        while (form && form._is_form == false)
        {
            form = form._p_parent;
        }
        return form;
    };

    _pXPush._getWindow = function ()
    {
        var parent = this._p_parent;
        if (parent && parent._getWindow)
        {
            return parent._getWindow();
        }
        return null;
    };

    //===============================================================
    // nexacro.XPush : Properties
    //===============================================================
    _pXPush.set_commandlist = nexacro._emptyFn;
    _pXPush.set_errorcode = nexacro._emptyFn;
    _pXPush.set_errormsg = nexacro._emptyFn;

    _pXPush.set_name = function (v)
    {
        this.id = this._p_name = v;
    };

    _pXPush.set_enableevent = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_enableevent != v)
        {
            this._p_enableevent = v;
        }
    };

    _pXPush.set_async = function (v)
    {
        //Andoird/iOS/HTML5 버전은 무조건 async=true로동작
        if (v === undefined || v === null) return;
        v = nexacro._toBoolean(v);

        this._p_async = v;

        this.on_apply_async();
    };

    _pXPush.on_apply_async = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
            xpush.setXPushAsync(this._p_async);
    };

    _pXPush.set_controlretry = function (v)
    {
        v = parseInt(v);
        if (v === undefined || v === null || !nexacro._isNumber(v) || v < 0)
        {
            //default propVal
            v = 5;
        }

        if (this._p_controlretry != v)
        {
            this._p_controlretry = v;
        }

        this.on_apply_controlretry();
    };

    _pXPush.on_apply_controlretry = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
            xpush.setXPushControlRetry(this._p_controlretry);
    };

    _pXPush.set_debug = function (v)
    {
        if (v === undefined || v === null) return;
        v = nexacro._toBoolean(v);

        if (this._p_debug != v)
        {
            this._p_debug = v;
        }

        this.on_apply_debug();
    };

    _pXPush.on_apply_debug = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
            xpush.setXPushDebug(this._p_debug);
    };

    _pXPush.set_iplist = function (v)
    {
        // init iplist
        this._iplist = [];

        // validation
        if (v === "undefined" || v === null || v === "")
            return true;

        this._p_iplist = v;

        var TCP_PROTOCOL = ["tcp", "tcps"];
        var HTTP_PROTOCOL = ["http", "https"];

        var info_tmp;
        var infolist = [];
        var type, ip, port;

        if (v.indexOf(",") >= 0)
        {
            infolist = v.split(",");
        }
        else
        {
            infolist.push(v);
        }

        for (var i = 0; i < infolist.length; i++)
        {
            info_tmp = infolist[i];
            info_tmp = info_tmp.replace(/(^\s*)|(\s*$)/gi, "");
            info_tmp = info_tmp.split(":");

            type = info_tmp[0];
            if (HTTP_PROTOCOL.indexOf(type) > -1 || TCP_PROTOCOL.indexOf(type) > -1)
            {
                ip = info_tmp[1].split("//")[1];
                port = 0;
                if (info_tmp[2])
                {
                    var temp_port = info_tmp[2].split("/");
                    if (temp_port && temp_port.length > 0)
                    {
                        port = temp_port[0].valueOf();

                        for (var n = 1; n < temp_port.length; n++)
                        {
                            if (temp_port[n])
                                ip += "/" + temp_port[n];
                        }
                    }
                    else
                    {
                        port = info_tmp[2].valueOf();
                    }
                }
            }
            else
            {
                type = "tcp";
                ip = info_tmp[0];
                port = info_tmp[1] ? info_tmp[1].valueOf() : "";
            }

            if (this._isWebPush())
            {
                // http만
                if (TCP_PROTOCOL.indexOf(type) > -1)
                {
                    continue;
                }
            }
            else
            {
                // tcp만
                if (HTTP_PROTOCOL.indexOf(type) > -1)
                {
                    continue;
                }
            }

            this._iplist.push({ "type": type, "ip": ip, "port": port, "retry": false });
        }

        return true;
    };

    _pXPush.set_keepalivetime = function (v)
    {
        v = parseInt(v);
        if (v === undefined || v === null || !nexacro._isNumber(v) || v < 0)
        {
            //default propVal
            v = 30;
        }

        if (this._p_keepalivetime != v)
        {
            this._p_keepalivetime = v;
        }

        this.on_apply_keepalivetime();
    };

    _pXPush.on_apply_keepalivetime = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
            xpush.setXPushKeepAliveTime(this._p_keepalivetime);
    };

    _pXPush.set_keeptimeout = function (v)
    {
        v = parseInt(v);
        if (v === undefined || v === null || !nexacro._isNumber(v) || v <= 0)
        {
            //default propVal
            v = 60;
        }

        if (this._p_keeptimeout != v)
        {
            this._p_keeptimeout = v;
        }

        this.on_apply_keeptimeout();
    };

    _pXPush.on_apply_keeptimeout = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
            xpush.setXPushKeepTimeout(this._p_keeptimeout);
    };

    _pXPush.set_layouturl = function (v)
    {
        if (v === undefined || v === null)
        {
            //default propVal
            v = "";
        }

        if (this._p_layouturl != v)
        {
            this._p_layouturl = v;
        }

        this.on_apply_layouturl();
    };

    _pXPush.on_apply_layouturl = function ()
    {
        var layouturl = this._p_layouturl;
        if (layouturl != "")
        {
            var xpush = this._xpush_controller;
            if (xpush)
                xpush.setXPushLayoutURL(layouturl);
        }
    };

    _pXPush.set_retry = function (v)
    {
        v = parseInt(v);
        if (v === undefined || v === null || !nexacro._isNumber(v) || v < 0)
        {
            //default propVal
            v = 1;
        }

        if (this._p_retry != v)
        {
            this._p_retry = v;
        }

        this.on_apply_retry();
    };

    _pXPush.on_apply_retry = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
            xpush.setXPushRetry(this._p_retry);
    };

    _pXPush.set_timeout = function (v)
    {
        v = parseInt(v);
        if (v === undefined || v === null || !nexacro._isNumber(v) || v <= 0)
        {
            //default propVal
            v = 30;
        }

        if (this._p_timeout != v)
        {
            this._p_timeout = v;
        }

        this.on_apply_timeout();
    };

    _pXPush.on_apply_timeout = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
            xpush.setXPushTimeout(this._p_timeout);
    };

    _pXPush.set_userid = function (v)
    {
        if (v === undefined || v === null)
        {
            //default propVal
            v = "";
        }

        if (this._p_userid != v)
        {
            this._p_userid = v;
        }
    };

    _pXPush.set_sessionid = function (v)
    {
        if (v === undefined || v === null)
        {
            //default propVal
            v = "";
        }

        if (this._p_sessionid != v)
        {
            this._p_sessionid = v;
        }
    };

    _pXPush.set_projectid = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_projectid !== v)
        {
            this._p_projectid = v;
        }

        this.on_apply_projectid();

    }

    _pXPush.on_apply_projectid = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
            xpush.setXPushProjectId(this._p_projectid);
    };

    _pXPush.set_protocolversion = function (v)
    {
        var val = nexacro._parseInt(v, 2);
        if (val < 0)
        {
            val = 2;
        }

        if (this._p_protocolversion != val)
        {
            this._p_protocolversion = val;
        }

        this.on_apply_protocolversion();
    };

    _pXPush.on_apply_protocolversion = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
            xpush.setXPushProtocolVersion(this._p_protocolversion);
    };

    //===============================================================
    // nexacro.XPush : Methods
    //===============================================================
    _pXPush.subscribe = function (strMessageType, strMessageKey, objForm, objDataset, strType, strCallBack, nRow, strCheck, bUseActiveFormCallBack)
    {
        var xpush = this._xpush_controller;
        if (xpush)
        {
            if (nexacro._isNull(objForm) || nexacro._isNull(objDataset) ||
                strMessageType === undefined || strMessageType === null || strMessageType === "" ||
                strMessageKey === undefined || strMessageKey === null || strMessageKey === "" ||
                strType === undefined || strType === null || strType == "" ||
                strCallBack === undefined || strCallBack === null || strCallBack == "")
            {
                xpush.fireErrorEventXPush();
                return;
            }

            strType = strType.toLowerCase();
            var type_enum = ["append", "insert", "replace", "update", "allupdate", "updateorappend"];
            if (type_enum.indexOf(strType) == -1)
            {
                xpush.fireErrorEventXPush();
                return;
            }

            strCallBack = strCallBack.toString();
            if (!objForm[strCallBack])
            {
                xpush.fireErrorEventXPush();
                return;
            }

            var i, n;
            var item;
            var commandlist = this._commandlist;
            var commandcontrol = new nexacro.CommandControl("ADDF", strMessageType, strMessageKey, objForm, objDataset, strType, strCallBack, nRow, strCheck, bUseActiveFormCallBack);
            for (i = 0, n = commandlist.length; i < n; i++)
            {
                item = commandlist[i];
                if (item.equal(commandcontrol))
                {
                    break;
                }
            }
            if (i == n)
            {
                commandlist.push(commandcontrol);
            }

            xpush.commandXPush(commandcontrol);
        }
    };

    _pXPush.unsubscribe = function (strMessageType, strMessageKey, objForm, objDataset, strType, strCallBack)
    {
        var xpush = this._xpush_controller;
        if (xpush)
        {
            if (nexacro._isNull(objForm) || nexacro._isNull(objDataset) ||
                strMessageType === undefined || strMessageType === null || strMessageType === "" ||
                strMessageKey === undefined || strMessageKey === null || strMessageKey === "" ||
                strType === undefined || strType === null || strType == "" ||
                strCallBack === undefined || strCallBack === null || strCallBack == "")
            {
                xpush.fireErrorEventXPush();
                return;
            }

            strType = strType.toLowerCase();
            var type_enum = ["append", "insert", "replace", "update", "allupdate", "updateorappend"];
            if (type_enum.indexOf(strType) == -1)
            {
                xpush.fireErrorEventXPush();
                return;
            }

            strCallBack = strCallBack.toString();
            if (!objForm[strCallBack])
            {
                xpush.fireErrorEventXPush();
                return;
            }

            var commandcontrol = new nexacro.CommandControl("DELF", strMessageType, strMessageKey, objForm, objDataset, strType, strCallBack);
            xpush.commandXPush(commandcontrol);
        }
    };

    _pXPush.registerDevice = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
        {
            var action = "RGST";

            if (this._connectSuccess)
            {
                var commandcontrol = new nexacro.CommandControl(action);

                this._commandlist.push(commandcontrol);
                xpush.commandXPush(commandcontrol);
            }
            else
            {
                var errorcode = this._getErrorCode(action);
                xpush._on_error(errorcode, action);
            }
        }
    };

    _pXPush.unregisterDevice = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
        {
            var action = "UNRG";

            if (this._connectSuccess)
            {
                var commandcontrol = new nexacro.CommandControl(action);

                this._commandlist.push(commandcontrol);
                xpush.commandXPush(commandcontrol);
            }
            else 
            {
                var errorcode = this._getErrorCode(action);
                xpush._on_error(errorcode, action);
            }
        }
    };

    _pXPush.registerTopic = function (strMessageType, strMessageKey)
    {
        var xpush = this._xpush_controller;
        if (xpush)
        {
            var action = "ADUI";

            if (this._connectSuccess)
            {
                var commandcontrol = new nexacro.CommandControl(action, strMessageType, strMessageKey);

                this._commandlist.push(commandcontrol);
                xpush.commandXPush(commandcontrol);
            }
            else 
            {
                var errorcode = this._getErrorCode(action);
                xpush._on_error(errorcode, action);
            }
        }
    };

    _pXPush.unregisterTopic = function (strMessageType, strMessageKey)
    {
        var xpush = this._xpush_controller;
        if (xpush)
        {
            var action = "UNUI";

            if (this._connectSuccess)
            {
                var commandcontrol = new nexacro.CommandControl(action, strMessageType, strMessageKey);

                this._commandlist.push(commandcontrol);
                xpush.commandXPush(commandcontrol);
            }
            else 
            {
                var errorcode = this._getErrorCode(action);
                xpush._on_error(errorcode, action);
            }
        }
    };

    _pXPush.requestMessageCount = function (strMessageType, strMessageKey)
    {
        var xpush = this._xpush_controller;
        if (xpush)
        {
            var action = "MSGC";

            if (this._connectSuccess)
            {
                var commandcontrol = new nexacro.CommandControl(action, strMessageType, strMessageKey);

                this._commandlist.push(commandcontrol);
                xpush.commandXPush(commandcontrol);
            }
            else 
            {
                var errorcode = this._getErrorCode(action);
                xpush._on_error(errorcode, action);
            }
        }
    };

    _pXPush.registerTopicWithUserID = function (strMessageType, strMessageKey, strUserID, strProjectId)
    {
        var xpush = this._xpush_controller;
        if (xpush) 
        {
            var action = "ADUI";
            if (this._p_protocolversion == 3 && nexacro._isNull(strProjectId))
                strProjectId = this._p_projectid;

            if (this._connectSuccess)
            {
                var commandcontrol = new nexacro.CommandControl(action, strMessageType, strMessageKey, "", "", "", "", "", "", "", strUserID, strProjectId);

                this._commandlist.push(commandcontrol);
                xpush.commandXPush(commandcontrol);
            }
            else 
            {
                var errorcode = this._getErrorCode(action);
                xpush._on_error(errorcode, action);
            }
        }
    };

    _pXPush.unregisterTopicWithUserID = function (strMessageType, strMessageKey, strUserID, strProjectId)
    {
        var xpush = this._xpush_controller;
        if (xpush) 
        {
            var action = "UNUI";
            if (this._p_protocolversion == 3 && nexacro._isNull(strProjectId))
                strProjectId = this._p_projectid;

            if (this._connectSuccess)
            {
                var commandcontrol = new nexacro.CommandControl(action, strMessageType, strMessageKey, "", "", "", "", "", "", "", strUserID, strProjectId);

                this._commandlist.push(commandcontrol);
                xpush.commandXPush(commandcontrol);
            }
            else 
            {
                var errorcode = this._getErrorCode(action);
                xpush._on_error(errorcode, action);
            }
        }
    };

    _pXPush.requestMessageCountWithUserID = function (strMessageType, strMessageKey, strUserID, strProjectId)
    {
        var xpush = this._xpush_controller;
        if (xpush) 
        {
            var action = "MSGC";
            if (this._p_protocolversion == 3 && nexacro._isNull(strProjectId))
                strProjectId = this._p_projectid;

            if (this._connectSuccess)
            {
                var commandcontrol = new nexacro.CommandControl(action, strMessageType, strMessageKey, "", "", "", "", "", "", "", strUserID, strProjectId);

                this._commandlist.push(commandcontrol);
                xpush.commandXPush(commandcontrol);
            }
            else 
            {
                var errorcode = this._getErrorCode(action);
                xpush._on_error(errorcode, action);
            }
        }
    };

    _pXPush.connect = function (userid, sessionid)
    {
        var xpush = this._xpush_controller;
        if (xpush)
        {
            if (userid == null)
            {
                userid = this._p_userid;
            }

            if (sessionid == null)
            {
                sessionid = this._p_sessionid;
            }

            var projectid = this._p_protocolversion == 3 ? this._p_projectid : "";

            xpush.connectXPush(userid, sessionid, projectid);
        }
    };

    _pXPush.disconnect = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
        {
            var action = "BYEC";

            if (this._connectSuccess)
            {
                this._connectSuccess = false;
                xpush.disconnectXPush();
            }
            else
            {
                var errorcode = this._getErrorCode(action);
                xpush._on_error(errorcode, action);
            }
        }
    };

    _pXPush.sendResponse = function (msgid)
    {
        var xpush = this._xpush_controller;
        if (xpush)
        {
            var action = "RECT";

            if (this._connectSuccess)
            {
                xpush.sendResponseXPush(nexacro._toString(msgid));
            }
            else
            {
                var errorcode = this._getErrorCode(action);
                xpush._on_error(errorcode, action);
            }
        }
    };

    _pXPush.requestMessage = function ()
    {
        if (arguments.length < 2)
            return;

        var xpush = this._xpush_controller;
        if (xpush)
        {
            var action = "REQD";

            if (this._connectSuccess)
            {
                var messagetype = arguments[0];
                var messagekeys = new Array();

                for (var i = 1; i < arguments.length; i++)
                {
                    messagekeys.push(arguments[i]);
                }

                if (messagekeys.length > 0)
                {
                    xpush.requestMessageXPush(messagetype, messagekeys);
                }
            }
            else
            {
                var errorcode = this._getErrorCode(action);
                xpush._on_error(errorcode, action);
            }
        }
    };

    _pXPush.getRegisteredTopics = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
        {
            var action = "RTID";

            if (this._connectSuccess)
            {
                var commandcontrol = new nexacro.CommandControl(action);

                // this._commandlist.push(commandcontrol);
                xpush.commandXPush(commandcontrol);
            }
            else 
            {
                var errorcode = this._getErrorCode(action);
                xpush._on_error(errorcode, action);
            }
        }
    }

    _pXPush.getRegisteredTopicsWithUserID = function (strUserID, strProjectId)
    {
        var xpush = this._xpush_controller;
        if (xpush) 
        {
            var action = "RTID";
            if (this._p_protocolversion == 3 && nexacro._isNull(strProjectId))
                strProjectId = this._p_projectid;

            if (this._connectSuccess)
            {
                var commandcontrol = new nexacro.CommandControl(action, "", "", "", "", "", "", "", "", "", strUserID, strProjectId);

                // this._commandlist.push(commandcontrol);
                xpush.commandXPush(commandcontrol);
            }
            else 
            {
                var errorcode = this._getErrorCode(action);
                xpush._on_error(errorcode, action);
            }
        }
    };

    _pXPush.getCurrentIP = function ()
    {
        if (this._currentipinfo)
        {
            return this._currentipinfo.ip;
        }
        else
        {
            return null;
        }
    };

    _pXPush.getCurrentPort = function ()
    {
        if (this._currentipinfo)
        {
            return this._currentipinfo.port;
        }
        else
        {
            return null;
        }
    };

    //===============================================================
    // nexacro.XPush : Event Handlers
    //===============================================================
    // Device Event Callback
    _pXPush._onxpush = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
        {
            xpush._on_xpush.apply(xpush, arguments);
        }
    };

    _pXPush._onsuccess = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
        {
            xpush._on_success.apply(xpush, arguments);
        }
    };

    _pXPush._onerror = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
        {
            xpush._on_error.apply(xpush, arguments);
        }
    };

    _pXPush._onkeepalive = function ()
    {
        var xpush = this._xpush_controller;
        if (xpush)
        {
            xpush._on_keepalive.apply(xpush, arguments);
        }
    };

    // Common Event Callback
    _pXPush._on_xpush = function (recv)
    {
        var paramRow;
        var paramChangeColumns = new Array();
        var paramAllColumns = new Array();
        var paramChangeRows = new Array();
        var paramobjChangeList = new Array();
        var paramChangeRowsTemp = new Array();

        for (var i = 0; i < this._commandlist.length; i++)
        {
            var cc = this._commandlist[i];
            var ds = cc.objdataset;
            if (!ds) continue;

            if (cc.messagetype == recv.type)
            {
                var cr = -1;

                var datalist = recv.datalist;
                var datalistlen = datalist.length;

                var usedatakey = false;
                var datakeycol = -1;
                var datakeyval = "";

                var data, layoutKey, messageKey, checkfield;
                var colidx, colval;

                // datakey를 사용하는 push_message_layout 형태인지 판단이 먼저 이루어져야함.
                for (var j = 0; j < datalistlen; j++)
                {
                    if (datalist[j].key)
                    {
                        usedatakey = true;
                        datakeycol = datalist[j].id;
                        datakeyval = datalist[j].item;
                    }
                }

                // messagekey를 제외한 컬럼이 업데이트 되었을경우에만 콜백을 태워주기 위한 플래그.
                var callfunc = false;
                var callfunc1 = false;

                for (j = 0; j < datalistlen; j++)
                {
                    data = datalist[j];
                    layoutKey = data.id;
                    messageKey = data.item;
                    checkfield = data.checkfield;

                    // 이 조건이면 push_message_layout에서 첫번째 필드가 무조건 messagekey 필드라고 약속이 되어있어야 하는데...
                    // 원래부터 있는 코드여서 추적검토 필요.
                    if (j == 0 && messageKey != cc.messagekey)
                    {
                        break;
                    }

                    colidx = ds.getColIndex(layoutKey);
                    if (colidx >= 0)
                    {
                        if (cc.type == "append")
                        {
                            if (cr == -1)
                            {
                                if (cc.messagekey == messageKey)
                                {
                                    cr = ds.addRow();
                                    ds.setColumn(cr, colidx, messageKey);
                                    paramAllColumns.push(layoutKey);
                                    paramChangeColumns.push(layoutKey);
                                }
                            }
                            else
                            {
                                callfunc = true;
                                ds.setColumn(cr, colidx, messageKey);
                                paramAllColumns.push(layoutKey);
                                paramChangeColumns.push(layoutKey);
                                paramRow = cr;
                            }
                            callfunc1 = true;
                        }
                        else if (cc.type == "insert")
                        {
                            if (cr == -1)
                            {
                                if (cc.messagekey == messageKey)
                                {
                                    cr = ds.insertRow(cc.row);
                                    ds.setColumn(cr, colidx, messageKey);
                                    paramAllColumns.push(layoutKey);
                                    paramChangeColumns.push(layoutKey);
                                }
                            }
                            else
                            {
                                callfunc = true;
                                ds.setColumn(cr, colidx, messageKey);
                                paramAllColumns.push(layoutKey);
                                paramChangeColumns.push(layoutKey);
                                paramRow = cr;
                            }
                            callfunc1 = true;
                        }
                        else if (cc.type == "replace")
                        {
                            if (ds.getRowCount() > 0)
                            {
                                colval = ds.getColumn(0, colidx);
                                if (colval != messageKey)
                                {
                                    ds.setColumn(0, colidx, messageKey);
                                    paramChangeColumns.push(layoutKey);
                                    paramRow = cc.row;
                                    callfunc = true;
                                }
                                callfunc1 = true;
                                paramAllColumns.push(layoutKey);
                            }
                        }
                        else if (cc.type == "update")
                        {
                            if (usedatakey)
                            {
                                if (cr == -1)
                                {
                                    if (cc.messagekey == messageKey)
                                    {
                                        cr = ds.findRowExpr(layoutKey + " == $0", 0, -1, [messageKey]);
                                    }
                                }
                                else
                                {
                                    // 변경사항이 있는 컬럼만 업데이트.
                                    colval = ds.getColumn(cr, colidx);
                                    if (colval != messageKey)
                                    {
                                        callfunc = true;
                                        callfunc1 = true;

                                        if ((cc.check == "0") || (checkfield && checkfield == cc.check))
                                        {
                                            ds.setColumn(cr, colidx, messageKey);
                                            paramChangeColumns.push(layoutKey);
                                            paramRow = cr;
                                        }
                                    }
                                }
                                paramAllColumns.push(layoutKey);
                            }
                            else
                            {
                                this._on_error(-703);
                            }
                        }
                        else if (cc.type == "allupdate")
                        {
                            if (usedatakey)
                            {
                                if (paramChangeRowsTemp.length == 0)
                                {
                                    do
                                    {
                                        if (cc.messagekey == messageKey)
                                        {
                                            cr = ds.findRowExpr(layoutKey + " == $0", cr, -1, [messageKey]);
                                            if (cr >= 0)
                                            {
                                                paramChangeRows.push(cr);
                                                paramChangeRowsTemp.push(cr);
                                                cr++;
                                            }
                                        }
                                    }
                                    while (cr >= 0);
                                }
                                else
                                {
                                    while (paramChangeRowsTemp.length)
                                    {
                                        cr = paramChangeRowsTemp.splice(0, 1);
                                        colval = ds.getColumn(cr, colidx);
                                        if (colval != messageKey)
                                        {
                                            if ((cc.check == "0") || (checkfield && checkfield == cc.check))
                                            {
                                                ds.setColumn(cr, colidx, messageKey);
                                                paramobjChangeList.push(cr + "," + layoutKey);
                                            }
                                        }
                                    }
                                    paramChangeRowsTemp = paramChangeRows.slice();

                                    callfunc = true;
                                }
                                callfunc1 = true;
                            }
                            else
                            {
                                this._on_error(-703);
                            }
                        }
                        else if (cc.type == "updateorappend")
                        {
                            if (usedatakey)
                            {
                                if (cr == -1)
                                {
                                    if (cc.messagekey == messageKey)
                                    {
                                        cr = ds.findRowExpr(layoutKey + " == $0", 0, -1, [messageKey]);

                                        if (cr == -1)
                                        {
                                            // append
                                            cr = ds.addRow();
                                            ds.setColumn(cr, colidx, messageKey);
                                            paramAllColumns.push(layoutKey);
                                            paramChangeColumns.push(layoutKey);
                                        }
                                    }
                                }
                                else
                                {
                                    // 변경사항이 있는 컬럼만 업데이트.
                                    colval = ds.getColumn(cr, colidx);
                                    if (colval != messageKey)
                                    {
                                        callfunc = true;
                                        callfunc1 = true;

                                        if ((cc.check == "0") || (checkfield && checkfield == cc.check))
                                        {
                                            ds.setColumn(cr, colidx, messageKey);
                                            paramChangeColumns.push(layoutKey);
                                            paramRow = cr;
                                        }
                                    }
                                }
                            }
                            else
                            {
                                this._on_error(-703);
                            }
                        }
                    }
                }

                if (recv.action == "RELI" && recv.msgid != null)
                {
                    callfunc = true;
                }

                if (!callfunc || !callfunc1)
                {
                    continue;
                }

                if ((!cc.useactiveformcallback) || (cc.useactiveformcallback && (cc.objform === this.parent._getRootObject().getActiveForm())))
                {
                    var callbackFn;
                    if (cc.type == "allupdate")
                    {
                        callbackFn = cc.objform[cc.callback];
                        if (callbackFn instanceof Function)
                        {
                            callbackFn.call(cc.objform, paramChangeRows.join(), null, paramobjChangeList, "DATA", recv.action, recv.msgid);
                            paramChangeRows.splice(0, paramChangeRows.length);
                            paramobjChangeList.splice(0, paramobjChangeList.length);
                        }
                    }
                    else
                    {
                        callbackFn = cc.objform[cc.callback];
                        if (callbackFn instanceof Function)
                        {
                            callbackFn.call(cc.objform, paramRow, paramChangeColumns.join(), paramAllColumns.join(), "DATA", recv.action, recv.msgid);
                            paramChangeRows.splice(0, paramChangeRows.length);
                            paramAllColumns.splice(0, paramAllColumns.length);
                        }
                    }
                }
            }
        }
    };

    _pXPush._on_success = function (reason, action, classtype, messagetype, messagekey, returnvalue, layout, form, dataset)
    {
        var msg_id = "";
        var msg_type = "";
        var msg_key = "";
        var ret_val = "";

        if (action == 0)
            this._connectSuccess = true;

        if (classtype == "RECT")
        {
            msg_id = messagetype;
        }
        else if (classtype == "RGST")
        {
            if (nexacro._OS == "Android")
            {
                this._registerDeviceSuccess = true;
            }
        }
        else if (classtype == "MSGC")
        {
            msg_type = messagetype;
            msg_key = messagekey;
            ret_val = returnvalue;
        }
        else if (classtype == "RTID")
        {
            // msg_type = messagetype;
            // msg_key = messagekey;
            ret_val = returnvalue;
        }
        else
        {
            if (action != 0 && action != 1)
            {
                msg_type = messagetype;
                msg_key = messagekey;
            }
        }

        var pushmessageobject = null;
        if (classtype == "ADDF" || classtype == "DELF" || classtype == "REQD" || classtype == "RECT" || classtype == "ADUI" || classtype == "UNUI" || classtype == "MSGC" || classtype == "RTID")
        {
            pushmessageobject = new nexacro.PushMessage(msg_id, msg_type, msg_key, ret_val);
        }

        // commandlist
        var command;
        var listlength = this._commandlist.length;
        var index;

        for (index = 0; index < listlength; index++)
        {
            command = this._commandlist[index].valueOf();
            if (command.messagetype == messagetype)
            {
                if (command.messagekey == messagekey &&
                    ((command.actiontype == classtype) || (classtype == "DELF" && command.actiontype == "ADDF")) &&
                    (form ? (command.objform == form && command.objdataset == dataset) : true))
                {
                    break;
                }
            }
        }
        if (index == listlength) command = null;
        if (command && (classtype == "DELF" || classtype == "ADUI" || classtype == "DELF" || classtype == "UNUI" || classtype == "MSGC" || classtype == "RGST " || classtype == "UNRG"))
        {
            command.actiontype = classtype;

            this.on_fire_onsuccess(action, this.getCurrentIP(), this.getCurrentPort(), pushmessageobject);
            this._commandlist.splice(index, 1);
        }
        else
        {
            this.on_fire_onsuccess(action, this.getCurrentIP(), this.getCurrentPort(), pushmessageobject, layout);

            if ( (nexacro._OS != "iOS" && !(nexacro._isHybrid && nexacro._isHybrid())) ||
                 (nexacro._OS != "Mac OS" && !(nexacro._macOSWebView))
               )
            {
                if (action == 1)
                {
                    this._currentipinfo = null;
                    this._commandlist = null;
                    this._commandlist = new Array();
                }
            }
        }
    };

    _pXPush._on_error = function (errorcode, classtype, messagetype, messagekey, reply)
    {
        var actioncode = this._getActionCode(classtype);
        var errormsg = this._getErrorMessage(errorcode);

        var msg_id = "";
        var msg_type = "";
        var msg_key = "";
        var ret_val = "";

        if (classtype == "RECT")
        {
            msg_id = messagetype;
        }
        else
        {
            msg_type = messagetype;
            msg_key = messagekey;
        }

        var pushmessageobject = null;
        if (classtype == "ADDF" || classtype == "DELF" || classtype == "REQD" || classtype == "RECT" || classtype == "ADUI" || classtype == "UNUI" || classtype == "MSGC")
        {
            pushmessageobject = new nexacro.PushMessage(msg_id, msg_type, msg_key, ret_val);
        }

        // commandlist
        var command;
        var listlength = this._commandlist.length;
        for (var i = 0; i < listlength; i++)
        {
            command = this._commandlist[i];
            if (command.messagetype == messagetype)
            {
                if (command.messagekey == messagekey)
                {
                    break;
                }
            }
        }

        this._setError(errorcode, errormsg);
        this.on_fire_onerror(actioncode, errormsg, this.getCurrentIP(), this.getCurrentPort(), errorcode, pushmessageobject, reply);
    };

    _pXPush._on_keepalive = function (type)
    {
        this.on_fire_onkeepalive(type);
    };

    _pXPush.on_fire_onsuccess = function (action, ip, port, pushmessageobject, layout)
    {
        if (this.onsuccess && this.onsuccess._has_handlers)
        {
            var evt = new nexacro.XPushEventInfo("onsuccess", action, ip, port, pushmessageobject, layout);
            return this.onsuccess._fireEvent(this, evt);
        }
        return true;
    };

    _pXPush.on_fire_onerror = function (action, errormsg, ip, port, code, pushmessageobject, reply)
    {
        if (this.onerror && this.onerror._has_handlers)
        {
            var evt = new nexacro.XPushErrorEventInfo("onerror", action, errormsg, ip, port, code, pushmessageobject, reply);
            return this.onerror._fireEvent(this, evt);
        }
        return true;
    };

    _pXPush.on_fire_onkeepalive = function (type)
    {
        if (this.onkeepalive && this.onkeepalive._has_handlers)
        {
            var evt = new nexacro.XPushKeepAliveEventInfo("onkeepalive", type);
            return this.onkeepalive._fireEvent(this, evt);
        }
    };

    //===============================================================
    // nexacro.XPush : Logical Part
    //===============================================================
    _pXPush._resetIPList = function ()
    {
        var length = this._iplist.length;
        for (var i = 0; i < length; i++)
        {
            if (this._iplist[i].retry)
                this._iplist[i].retry = false;
        }
    };

    //===============================================================
    // nexacro.XPush : Util Function
    //===============================================================
    _pXPush._getActionCode = function (action)
    {
        var code = nexacro.XPushAction[action];
        if (nexacro._isNull(code))
        {
            return -1;
        }
        else
        {
            return code;
        }
    };

    _pXPush._getErrorCode = function (action)
    {
        var code = this._XPushErrorCode[action];
        if (nexacro._isNull(code))
        {
            return -701;
        }
        else
        {
            return code;
        }
    };

    _pXPush._getErrorMessage = function (errorcode)
    {
        var message = this._XPushErrorMessage[errorcode];
        if (nexacro._isNull(message))
        {
            return "";
        }
        else
        {
            return nexacro._getErrorMessge(message);
        }
    };

    _pXPush._getRandomIPInfo = function ()
    {
        var length = this._iplist.length;
        if (length > 0)
        {
            for (var i = 0; i < length; i++)
            {
                if (this._iplist[i].retry == false)
                {
                    break;
                }
            }

            if (i == length)
            {
                return null;
            }

            var randidx;
            do
            {
                randidx = Math.floor((nexacro._random() * ((length - 1) - 0 + 1))) + 0;
            } while (this._iplist[randidx].retry);

            this._iplist[randidx].retry = true;
            this._currentipinfo = this._iplist[randidx];
            return this._currentipinfo;
        }
        return null;
    };

    _pXPush._setError = function (errorcode, errormsg)
    {
        this._p_errorcode = errorcode;
        this._p_errormsg = errormsg;
    };

    _pXPush._isWebPush = function ()
    {
        if (nexacro._Browser != "Runtime" && (!nexacro.Device._isHybrid() && !nexacro._macOSWebView))
        {
            return true;
        }

        return false;
    };

    _pXPush.getObject = function (sid)
    {
        var willrunfunc;

        if (sid == undefined)
        {
            willrunfunc = null;
        }
        else
        {
            sid = sid * 1;
            willrunfunc = nexacro.Device._userCreatedObj[sid];

            if (typeof willrunfunc == "undefined" || willrunfunc == null)
                willrunfunc = null;
        }
        return willrunfunc;
    };

    _pXPush._properties = [{ name: "async" }, { name: "controlretry" }, { name: "debug" }, { name: "enableevent" }, { name: "errorcode", readonly: true }, { name: "errormsg", readonly: true }, { name: "iplist" }, { name: "keepalivetime" }, { name: "keeptimeout" }, { name: "layouturl" }, { name: "name" }, { name: "projectid" }, { name: "protocolversion" }, { name: "retry" }, { name: "sessionid" }, { name: "timeout" }, { name: "userid" }];
    nexacro._defineProperties(_pXPush, _pXPush._properties);

    //delete _pXPush;
    _pXPush = null;
}
