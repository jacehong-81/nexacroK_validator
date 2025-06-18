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

//==============================================================================
if (nexacro._Browser != "Runtime")
{
    if (!nexacro._isHybrid() && !nexacro._macOSWebView)
    {
        //==============================================================================
        // nexacro._XPushController
        //==============================================================================
        nexacro._XPushController = function (control)
        {
            this.linkedcontrol = control;

            this.layoutlist = [];
            this._serverkeylist = [];

            this._is_created = true;
        };

        var _pXPushController = nexacro._createPrototype(nexacro.Object, nexacro._XPushController);
        nexacro._XPushController.prototype = _pXPushController;

        _pXPushController.handle = null;
        _pXPushController._ajax = null;

        _pXPushController.userid = "";
        _pXPushController.sessionid = "";
        _pXPushController.ip_idx = 0;
        _pXPushController.keepalivetime = 30;
        _pXPushController.retry_cnt = 1;
        _pXPushController.control_retry_cnt = 1;
        _pXPushController._is_connected = false;
        _pXPushController._is_created = false;
        _pXPushController._do_disconnect = false;

        _pXPushController.action = null;
        _pXPushController.msg_type = null;
        _pXPushController.msg_key = null;
        _pXPushController.type = null;

        _pXPushController.projectid = "";
        _pXPushController.protocolversion = 2;

        _pXPushController.setXPushAsync = nexacro._emptyFn;
        _pXPushController.setXPushControlRetry = nexacro._emptyFn;
        _pXPushController.setXPushKeepTimeout = nexacro._emptyFn;
        _pXPushController.setXPushKeepAliveTime = nexacro._emptyFn;
        _pXPushController.setXPushTimeout = nexacro._emptyFn;
        _pXPushController.setXPushDebug = nexacro._emptyFn;
        _pXPushController.setXPushRetry = nexacro._emptyFn;
        _pXPushController.resumeXPush = nexacro._emptyFn;
        _pXPushController.suspendXPush = nexacro._emptyFn;

        //===============================================================
        // nexacro._XPushController : Create & Destroy
        //===============================================================
        _pXPushController.create = nexacro._emptyFn;

        _pXPushController.destroy = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                handle.sockjsDisconnect();
            }
            this._destroy_handle();
            this._destroy_layout();

            this.InitServerKey();

            this.linkedcontrol = null;

            this._is_created = false;
        };

        _pXPushController._destroy_layout = function ()
        {
            if (this._ajax)
            {
                if (this._ajax._destroy)
                    this._ajax._destroy();
                this._ajax = null;
            }
        };

        _pXPushController._destroy_handle = function ()
        {
            if (this.handle)
            {
                this.handle._destroy();
                delete this.handle;
                this.handle = null;
            }
        };

        //===============================================================
        // nexacro._XPushController : Methods
        //===============================================================
        _pXPushController.setXPushLayoutURL = function (layouturl)
        {
            var comp = this.linkedcontrol;
            var url = layouturl;
            if (url.substring(0, 4).toLowerCase() == "url(")
                url = url.substring(5, url.length - 2);

            var form = comp._findForm(comp._p_parent);
            if (form)
            {
                if (url.indexOf("%") < 0)
                    layouturl = nexacro._getServiceLocation(url, form._getRefFormBaseUrl());
            }

            var i, j, k;
            var z, y, x;

            var pThis = this;
            var _ajax = this._ajax;
            if (_ajax)
            {
                this._destroy_layout();

                var layoutlist = this.layoutlist;
                for (i = 0, z = layoutlist.length; i < z; i++)
                {
                    layoutlist[i].listfield = [];
                }

                this.layoutlist = [];
            }

            _ajax = nexacro.__createHttpRequest();
            _ajax.handle.onreadystatechange = function (e)
            {
                if (this.readyState >= 4)
                {
                    var xml = _ajax.handle.responseXML;
                    if (xml)
                    {
                        var rootnode = xml.childNodes[0];

                        if (rootnode.nodeName != "message_layout")
                            return false;

                        var svcid = null;
                        var nokey = false;
                        var repeat = false;
                        var noreg = false;

                        var attr, fieldnode;
                        var check_idx = 0;
                        var layout, field;

                        var initLayoutForm = function ()
                        {
                            return {
                                "id": svcid,
                                "nokey": nokey,
                                "repeat": repeat,
                                "noreg": noreg,
                                "checkfieldidx": -1,
                                "listfield": []
                            };
                        };
                        var initFieldForm = function ()
                        {
                            return {
                                "id": null,
                                "type": null,
                                "size": 0,
                                "key": false,
                                "check": false
                            };
                        };

                        var childnodes = rootnode.childNodes;
                        for (i = 0, z = childnodes.length; i < z; i++)
                        {
                            if (childnodes[i].nodeName == "#text") continue;

                            attr = childnodes[i].attributes;
                            if (!attr) continue;
                            for (j = 0, y = attr.length; j < y; j++)
                            {
                                if (!svcid && attr[j].nodeName == "id" || attr[j].nodeName == "type")
                                    svcid = attr[j].nodeValue;
                                else if (attr[j].nodeName == "key")
                                    nokey = attr[j].nodeValue;
                                else if (attr[j].nodeName == "repeat")
                                    repeat = attr[j].nodeValue;
                                else if (attr[j].nodeName == "noreg")
                                    noreg = nexacro._toBoolean(attr[j].nodeValue);
                            }

                            fieldnode = childnodes[i];
                            y = fieldnode.childNodes.length;
                            if (y > 0)
                            {
                                layout = initLayoutForm();

                                for (j = 0; j < y; j++)
                                {
                                    if (fieldnode.childNodes[j].nodeName == "#text") continue;

                                    attr = fieldnode.childNodes[j].attributes;
                                    if (!attr) continue;

                                    field = initFieldForm();

                                    for (k = 0, x = attr.length; k < x; k++)
                                    {
                                        if (attr[k].nodeName == "id")
                                            field.id = attr[k].nodeValue;
                                        if (attr[k].nodeName == "type")
                                            field.type = attr[k].nodeValue;
                                        if (attr[k].nodeName == "size")
                                            field.size = parseInt(attr[k].nodeValue);
                                        if (attr[k].nodeName == "key")
                                        {
                                            field.key = nexacro._toBoolean(attr[k].nodeValue);
                                        }
                                        if (attr[k].nodeName == "check")
                                        {
                                            if (nexacro._toBoolean(attr[k].nodeValue))
                                            {
                                                field.check = true;
                                                layout.checkfieldidx = check_idx;
                                            }
                                        }
                                    }

                                    layout.listfield.push(field);
                                    check_idx++;
                                }

                                pThis.layoutlist.push(layout);
                            }
                        }
                    }
                    else
                    {
                        pThis._on_error(-703);
                        return false;
                    }
                }
            };

            try
            {
                _ajax.handle.open("GET", layouturl, false);
            }
            catch (e)
            {
                pThis._on_error(-703);
                _ajax = null;

                return false;
            }
            _ajax.handle.send("");
        };

        _pXPushController.setXPushProjectId = function (v)
        {
            this.projectid = v;
            if (this.handle)
            {
                this.handle.projectid = v;
            }
        };

        _pXPushController.setXPushProtocolVersion = function (v)
        {
            this.protocolversion = v;
        };

        _pXPushController.connectXPush = function (userid, sessionid, projectid)
        {
            var comp = this.linkedcontrol;

            comp._getRandomIPInfo();
            comp._resetIPList();

            this.userid = userid;
            this.sessionid = sessionid;
            this.projectid = projectid;

            this._connect();
        };

        _pXPushController.disconnectXPush = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                this._do_disconnect = true;
                handle.sockjsDisconnect();
            }
            else
            {
                this._on_error(-401, "BYEC");
            }

            this.InitServerKey();

            this._is_connected = false;
        };

        _pXPushController.sendResponseXPush = function (msgid)
        {
            var commandcontrol = new nexacro.CommandControl("RECT", msgid);
            this.commandXPush(commandcontrol);
        };

        _pXPushController.requestMessageXPush = function (type, keys)
        {
            var handle = this.handle;
            if (handle)
            {
                var i, n;
                var commandcontrol = new nexacro.CommandControl("REQD", type);
                for (i = 0, n = keys.length; i < n; i++)
                {
                    commandcontrol.messagekey = keys[i];
                    this.commandXPush(commandcontrol);
                }
            }
        };

        _pXPushController.fireErrorEventXPush = function ()
        {
            this._on_error(-701);
        };

        _pXPushController.commandXPush = function (commandcontrol)
        {
            var command = commandcontrol.actiontype;
            var messagetype = commandcontrol.messagetype;
            var messagekey = commandcontrol.messagekey;
            var type = commandcontrol.type;
            var form = commandcontrol.objform;
            var dataset = commandcontrol.objdataset;
            var userid = commandcontrol.userid || this.userid;
            var projectid = "";

            if (this.protocolversion == 3)
                projectid = commandcontrol.projectid || this.projectid;


            var comp = this.linkedcontrol;
            var handle = this.handle;
            if (handle)
            {
                if (command == "keepalive")
                {
                    handle.sockjsKeepalive();
                }
                else
                {
                    var layout = this._findLayout(messagetype);

                    if (command == "ADDF")
                    {
                        if (!this.AddServerKey(messagetype, messagekey, form, dataset))
                        {
                            this._on_error(-701);
                            return false;
                        }

                        if (!layout)
                        {
                            this._on_error(-703);
                            return false;
                        }

                        if (type == "update" || type == "allupdate" || type == "updateorappend")
                        {
                            if (!this._hasKey(messagetype))
                            {
                                this._on_error(-703);
                                return false;
                            }
                        }
                    }
                    else if (command == "DELF")
                    {
                        var ret = this.DelServerKey(messagetype, messagekey, form, dataset);
                        if (ret < 0)
                        {
                            this._on_error(-701);
                            return false;
                        }

                        if (!layout)
                        {
                            this._on_error(-703);
                            return false;
                        }
                        else
                        {
                            if (layout.noreg)
                            {
                                return true;
                            }
                        }
                    }

                    this.action = command;
                    this.msg_type = messagetype;
                    this.msg_key = messagekey;
                    this.type = type;
                    if (ret < 3)
                        this._on_success(0, comp ? comp._getActionCode(command) : -1, command, messagetype, messagekey, undefined, undefined, form, dataset);
                    else
                        handle.sockjsCommand(command, messagetype, messagekey, userid, projectid);
                    //return ret; 
                }
            }
            else
            {
                this.control_retry_cnt = 1;

                var errorcode = comp._getErrorCode(command);
                this._on_error(errorcode, command, messagetype, messagekey);
            }
        };

        //===============================================================
        // nexacro._XPushController : Event Handlers
        //===============================================================
        _pXPushController._on_xpush = function (recvObj)
        {
            var comp = this.linkedcontrol;
            if (comp)
            {
                comp._on_xpush(recvObj);
            }
        };

        _pXPushController._on_success = function (reason, action, classtype, messagetype, messagekey, returnvalue, layout, form, dataset)
        {
            var comp = this.linkedcontrol;
            if (comp)
            {
                comp._on_success(reason, action, classtype, messagetype, messagekey, returnvalue, layout, form, dataset);
            }
        };

        _pXPushController._on_error = function (errorcode, classtype, messagetype, messagekey)
        {
            var comp = this.linkedcontrol;
            if (comp)
            {
                comp._on_error(errorcode, classtype, messagetype, messagekey);
            }
        };

        _pXPushController._on_keepalive = function (type)
        {
            var comp = this.linkedcontrol;
            if (comp)
            {
                comp._on_keepalive(type);
            }
        };

        //===============================================================
        // nexacro._XPushController : Logical Part
        //===============================================================
        _pXPushController._connect = function ()
        {
            var comp = this.linkedcontrol;
            if (this._is_connected)
            {
                this._on_error(-302, "AUTH");
                return;
            }

            this._destroy_handle();

            var ip_idx = this.ip_idx;
            var ip_list = comp._iplist;
            var ip_list_len = ip_list ? ip_list.length : 0;
            if (ip_list && ip_idx >= ip_list_len)
            {
                this.retry_cnt++;
                ip_idx = 0;

                if ((parseInt(comp._p_retry) + 1) < this.retry_cnt)
                {
                    this.ip_idx = 0;
                    this.retry_cnt = 1;
                    this._on_error(-201, "AUTH");
                    return;
                }
            }

            var i;
            var skip = true;
            for (i = ip_idx; i < ip_list_len; i++)
            {
                if (ip_list[i].type == "http" || ip_list[i].type == "https")
                {
                    skip = false;
                    break;
                }
            }

            ip_idx = i;

            if (skip)
            {
                // no http type
                this.ip_idx = ip_idx;
                this._on_error(-201);
                return;
            }

            // update ip_info
            comp._currentipinfo = ip_list[ip_idx];

            var ip = comp._currentipinfo.ip;
            if (ip == "localhost")
            {
                ip = "127.0.0.1";
            }
            var sockjs_url = ip_list[ip_idx].type + "://" + ip + (comp._iplist[ip_idx].port ? (":" + comp._iplist[ip_idx].port) : "") + "/XPUSH";
            var sock_type = ["websocket"];
            var push_debug = comp._p_debug;
            var jsessionid = false;
            var options = { transports: sock_type, debug: push_debug, jsessionid: jsessionid };

            this.handle = new nexacro.SockJSWrapper(sockjs_url, [], options, this.userid, this.sessionid, this.projectid, this);

            this.ip_idx = ip_idx;
            this._do_disconnect = false;
        };

        _pXPushController._message = function (msg_data)
        {
            msg_data = JSON.parse(msg_data);

            var action = msg_data.Action;
            var result = msg_data.Result;
            var msg = msg_data.Message;

            var i;
            var reason, errorcode, messagetype, messagekey, returnval;

            var comp = this.linkedcontrol;
            var isDebug = comp && comp._p_debug;
            var actionCode = comp ? comp._getActionCode(action) : -1;

            if (action == "BYEC")
            {
                this._destroy_handle();

                this.ip_idx = 0;
                this._is_connected = false;

                if (this._do_disconnect)
                {
                    this._on_success(2, actionCode);
                }
                else
                {
                    this._on_error(-100);
                }
            }
            else if (action == "KEEP")
            {
                this._on_keepalive(2);
            }
            else if (action == "AUTH")
            {
                if (result == "OK")
                {
                    this.control_retry_cnt = 1;
                    this.retry = 1;
                    this._is_connected = true;

                    this._on_success(1, actionCode, undefined, undefined, undefined, undefined, this.layoutlist);
                }
                else if (result == "NG")
                {
                    this._on_error(-202, action);
                }
            }
            else if (action == "PUSH" || action == "RELI")
            {
                this.control_retry_cnt = 1;

                var layout = this._findLayout(msg_data.TopicType);
                if (!layout)
                {
                    this._on_error(-703);
                    return;
                }

                // ACKN
                if (action == "RELI" && this.handle)
                {
                    this.handle.sockjsAckn(msg_data.MessageID);
                }

                var data = {};
                var datalist = [];

                var recvObj = {};

                var listfield = layout.listfield;
                var field = listfield[0];
                data.id = field.id;
                data.item = msg_data.TopicId;
                data.key = field.key;
                var checkfield = field.check;

                if (layout.checkfieldidx == 0)
                {
                    checkfield = data.item;
                }
                else if (layout.checkfieldidx > 0)
                {
                    checkfield = msg[layout.checkfieldidx - 1];
                }

                data.checkfield = checkfield;

                datalist.push(data);

                // column 갯수만큼 message에 들어있다
                var data_val = "";
                var data_size = (msg_data.TopicType ? msg_data.TopicType.length : 0) + (msg_data.TopicId ? msg_data.TopicId.length : 0);
                var msg_len = msg.length;
                for (i = 0; i < msg_len; i++)
                {
                    data = {};

                    field = listfield[i + 1];
                    if (field)
                    {
                        data.id = field.id;
                        data.item = msg[i];

                        data.key = field.key;
                        data.checkfield = checkfield;
                        datalist.push(data);
                    }

                    if (isDebug)
                    {
                        if (i == 0)
                        {
                            data_val += msg[i];
                        }
                        else
                        {
                            data_val += " " + msg[i];
                        }
                    }
                }

                recvObj.type = msg_data.TopicType;
                recvObj.datalist = datalist;
                recvObj.action = action;
                if (msg_data.MessageID)
                {
                    recvObj.msgid = msg_data.MessageID;
                }

                this._on_keepalive(0);

                if (isDebug)
                {
                    data_size += data_val.length;
                }

                this._on_xpush(recvObj);
            }
            else if (action == "RTID")
            {
                if (result == "OK")
                {
                    var topic_collection = {};
                    var msg_list = msg_data.MsgcList;
                    for (i = 0; i < msg_list.length; i++)
                    {
                        var t_type = msg_list[i].type;
                        var t_id = msg_list[i].id;

                        if (topic_collection[t_type])
                        {
                            topic_collection[t_type].push(t_id);
                        }
                        else
                        {
                            topic_collection[t_type] = [t_id];
                        }
                    }

                    this._on_success(actionCode, actionCode, action, "", "", topic_collection);
                }
                else if (result == "NG")
                {
                    this._on_error(-1005, action, "", "");
                }
            }
            else
            {
                if (result == "OK")
                {
                    this.control_retry_cnt = 1;

                    if (action == "RECT")
                    {
                        reason = 5;
                        messagetype = msg_data.MessageID;
                        messagekey = msg_data.TopicId;
                    }
                    else if (action == "REQD")
                    {
                        reason = 6;
                        messagetype = msg_data.TopicType;
                        messagekey = msg_data.TopicId;
                    }
                    else if (action == "MSGC")
                    {
                        var msgc_list = [];
                        var msgc_len = msg_data.MsgcList.length;
                        for (i = 0; i < msgc_len; i++)
                        {
                            var msgcList = {};
                            msgcList.topictype = msg_data.MsgcList[i].type;
                            msgcList.topicid = msg_data.MsgcList[i].id;
                            msgcList.count = msg_data.MsgcList[i].count;

                            msgc_list.push(msgcList);
                        }

                        reason = 9;
                        messagetype = this.msg_type;
                        messagekey = this.msg_key;
                        returnval = msgc_list;
                    }
                    else
                    {
                        reason = 0;
                        messagetype = msg_data.TopicType;
                        messagekey = msg_data.TopicId;
                    }

                    this._on_success(reason, actionCode, action, messagetype, messagekey, returnval);
                }
                else if (result == "NG" || result == "F0" || result == "F1" || result == "H0" || result == "H1")
                {
                    if (action == "ADUI" || action == "RGST" || action == "UNUI")
                    {
                        if (action == "ADUI")
                        {
                            errorcode = -1092;
                            messagetype = msg_data.TopicType;
                            messagekey = msg_data.TopicId;
                        }
                        else if (action == "RGST")
                        {
                            errorcode = -1072;
                        }
                        else if (action == "UNUI")
                        {
                            errorcode = -1003;
                            messagetype = msg_data.TopicType;
                            messagekey = msg_data.TopicId;
                        }

                        this._on_error(errorcode, action, messagetype, messagekey);
                        return;
                    }

                    if (action == this.action &&
                        msg_data.TopicType == this.msg_type &&
                        msg_data.TopicId == this.msg_key)
                    {
                        this.control_retry_cnt++;
                        this.commandXPush(this.action, this.msg_type, this.msg_key, this.type);
                    }
                }
            }
        };

        _pXPushController._close = function (code)
        {
            // websocket.CloseEvent의 code값임

            this._is_connected = false;

            if (this._is_created)
            {
                switch (code)
                {
                    case 1000:
                        // Normal Case : XPush.disconnect > server close > callback
                        // Normal Case : server.shutdown > callback
                        this.InitServerKey();
                        break;
                    case 1002:
                        this.ip_idx++;
                        this._on_error(-300, "AUTH");

                        this._connect();
                        break;
                    case 1006:
                        this.InitServerKey();
                        this._on_error(-100);
                        break;
                    default:
                        break;
                }
            }
        };

        //===============================================================
        // nexacro._XPushController : Util Function
        //===============================================================
        _pXPushController._findLayout = function (id)
        {
            var layout = null;
            var layoutlist = this.layoutlist;
            var layoutlist_len = layoutlist.length;
            for (var i = 0; i < layoutlist_len; i++)
            {
                layout = layoutlist[i];
                if (layout.id == id)
                {
                    break;
                }
            }

            return layout;
        };

        _pXPushController._findLayoutIndex = function (id)
        {
            var index = -1;
            var layout = null;
            var layoutlist = this.layoutlist;
            var layoutlist_len = layoutlist.length;
            for (var i = 0; i < layoutlist_len; i++)
            {
                layout = layoutlist[i];
                if (layout.id == id)
                {
                    index = i;
                    break;
                }
            }

            return index;
        };

        _pXPushController._hasKey = function (strMessageType)
        {
            var layout = this._findLayout(strMessageType);
            if (layout)
            {
                if (layout.id == strMessageType)
                {
                    var i, n, field;
                    var listfield = layout.listfield;
                    var key = false;

                    for (i = 0, n = listfield.length; i < n; i++)
                    {
                        field = listfield[i];
                        key = field.key;
                        if (key)
                        {
                            break;
                        }
                    }

                    if (!key)
                    {
                        this._on_error(-703);
                        return false;
                    }

                    if (layout.noreg)
                    {
                        return false;
                    }
                }
            }
            else
            {
                this._on_error(-703);
                return false;
            }

            return true;
        };

        _pXPushController.FindKey = function (strMessageType, strMessageKey, objForm, objDataset)
        {
            // serverKey : { "type" : strMessageType, "keys": strMessageKey}
            // return : [i, j]
            var rtn = [-1, -1, -1];
            for (var i = 0, n = this._serverkeylist.length; i < n; i++)
            {
                var tmpServerKey = this._serverkeylist[i];
                if (tmpServerKey.type == strMessageType)
                {
                    rtn[0] = i;
                    for (var j = 0, tmpKeyList = tmpServerKey.keys.split(","), m = tmpKeyList.length; j < m; j++)
                    {
                        var tmpKey = tmpKeyList[j];
                        if (tmpKey == strMessageKey)
                        {
                            rtn[1] = j;
                            var formlist = tmpServerKey.forms;
                            for (var k = 0; k < formlist.length; k++)
                            {
                                var tmpObj = formlist[k];
                                var form = tmpObj.form;
                                var dataset = tmpObj.dataset;
                                if (form == objForm && dataset == objDataset)
                                {
                                    rtn[2] = k;
                                    break;
                                }
                            }

                            /*
                            var formlist = tmpServerKey.forms;
                            for (var k = 0; k < formlist.length;k++)
                            {
                                var tmpForm = formlist[k];
                                if (tmpForm == objForm)
                                {
                                    rtn[2] = k;
                                    var datasetlist = tmpForm._subscribe_datasets;
                                    for (var l = 0; l < datasetlist.length;l++)
                                    {
                                        var tmpDatset = datasetlist[l];
                                        if (tmpDatset == objDataset)
                                        {
                                            rtn[3] = l;
                                            break;                                            
                                        }
                                    }
                                }
                            } 
                            */
                        }
                    }
                    //break;
                }
            }
            return rtn;
        };

        _pXPushController.AddServerKey = function (strMessageType, strMessageKey, objForm, objDataset)
        {
            var formlist;
            var key = this.FindKey(strMessageType, strMessageKey, objForm, objDataset);
            var idx_form = key[2];
            if (idx_form == -1)
            {
                var _form = {};
                _form.form = objForm;
                _form.dataset = objDataset;
                formlist = [];
                formlist[0] = _form;
            }

            if (key[0] == -1)
            {
                var serverKey = { "type": strMessageType, "keys": strMessageKey, "forms": formlist };
                this._serverkeylist.push(serverKey);
                return true;
            }
            else if (key[1] == -1)
            {
                var tmpServerKey = this._serverkeylist[key[0]];
                tmpServerKey.keys += "," + strMessageKey;
                if (idx_form == -1)
                {
                    tmpServerKey.forms = formlist;
                }
                return true;
            }
            else if (idx_form == -1)
            {
                var tmpServerKey = this._serverkeylist[key[0]];
                tmpServerKey.forms.push(_form);
                return true;
            }
            return false;
        };

        _pXPushController.DelServerKey = function (strMessageType, strMessageKey, form, dataset)
        {
            var ret = -1;
            var key = this.FindKey(strMessageType, strMessageKey, form, dataset);
            if (key[0] > -1 && key[1] > -1 && key[2] > -1)
            {
                ret = 2;
                var tmpServerKey = this._serverkeylist[key[0]];
                var formlist = tmpServerKey.forms;
                formlist.splice(key[2], 1);
                if (formlist.length == 0)
                {
                    var tmpKeyList = tmpServerKey.keys.split(",");

                    tmpKeyList.splice(key[1], 1);
                    tmpServerKey.keys = tmpKeyList.join(",");

                    if (tmpKeyList.length == 0)
                    {
                        this._serverkeylist.splice(key[0], 1);
                        ret = 4;
                    }
                }
            }
            return ret;
        };

        _pXPushController.InitServerKey = function ()
        {
            this._serverkeylist = [];
        };

        _pXPushController = null;

        //==============================================================================
        // nexacro.SockJSWrapper
        //==============================================================================
        nexacro.SockJSWrapper = function (url, protocols, options, userid, sessionid, projectid, controller)
        {
            SockJS.call(this, url, protocols, options);

            this.userid = userid;
            this.sessionid = sessionid;
            this.interval_id = -1;
            this.projectid = projectid ? projectid : "";

            this._xpush_controller = controller;
        };

        var _pSockJSWrapper = nexacro._createPrototype(SockJS, nexacro.SockJSWrapper);
        nexacro.SockJSWrapper.prototype = _pSockJSWrapper;

        _pSockJSWrapper._destroy = function ()
        {
            clearInterval(this.interval_id);
        };

        _pSockJSWrapper.sockjsKeepalive = function ()
        {
            var cmd = {
                Action: 'KEEP'
            };
            this.sockjsSend(JSON.stringify(cmd));
        };

        _pSockJSWrapper.sockjsDisconnect = function ()
        {
            clearInterval(this.interval_id);

            var cmd = {
                Action: 'BYEC'
            };
            this.sockjsSend(JSON.stringify(cmd));
        };

        _pSockJSWrapper.sockjsAckn = function (messagetype)
        {
            var cmd = {
                Action: 'ACKN',
                'UserID': this.userid,
                'MessageID': messagetype
            };

            if (this._xpush_controller.protocolversion == 3)
                cmd["ProjectID"] = this.projectid;

            this.sockjsSend(JSON.stringify(cmd));
        };

        _pSockJSWrapper.sockjsCommand = function (command, messagetype, messagekey, userid, projectid)
        {
            var cmd = {
                'Action': command,
                'UserID': userid,
                'TopicType': messagetype,
                'TopicId': messagekey
            };

            if (command == "ADDF" || command == "DELF")
            {
                cmd = {
                    'Action': command,
                    'TopicType': messagetype,
                    'TopicId': messagekey
                };
            }
            else if (command == "MSGC" || command == "ADUI" || command == "UNUI")
            {
                cmd = {
                    'Action': command,
                    'UserID': userid,
                    'TopicType': messagetype,
                    'TopicId': messagekey
                };

                if (this._xpush_controller.protocolversion == 3)
                    cmd["ProjectID"] = projectid ? projectid : this.projectid;
            }
            else if (command == "RECT")
            {
                cmd = {
                    'Action': command,
                    'UserID': userid,
                    'MessageID': messagetype
                };

                if (this._xpush_controller.protocolversion == 3)
                    cmd["ProjectID"] = projectid ? projectid : this.projectid;
            }
            else if (command == "RGST" || command == "UNRG")
            {
                return;
            }
            else if (command == "REQD")
            {
                cmd = {
                    'Action': command,
                    'UserID': userid ? userid : this.userid,
                    'TopicType': messagetype,
                    'TopicId': messagekey
                };

                if (this._xpush_controller.protocolversion == 3)
                    cmd["ProjectID"] = this.projectid;
            }
            else if (command == "RTID")
            {
                // protocol version 3 이상 전용프로토콜
                if (this._xpush_controller.protocolversion == 3)
                {
                    cmd = {
                        'Action': command,
                        'ProjectID': projectid ? projectid : this.projectid,
                        'UserID': userid ? userid : this.userid
                    };
                }
                else
                {
                    return;
                }
            }

            this.sockjsSend(JSON.stringify(cmd));
        };

        _pSockJSWrapper.sockjsSend = function (jsonstr)
        {
            try
            {
                this.send(jsonstr);
            }
            catch (e)
            {
                //console.log(e);
                nexacro._settracemsg(e);
            }
        };

        _pSockJSWrapper.onopen = function ()
        {
            var AUTH = {
                'Action': 'AUTH',
                'ID': this.userid,
                'PW': this.sessionid
            };

            if (this._xpush_controller.protocolversion == 3)
                AUTH["ProjectID"] = this.projectid;

            this.sockjsSend(JSON.stringify(AUTH));

            var g_sockjs = this;
            if (g_sockjs)
                g_sockjs.sockjsKeepalive();

            this.interval_id = setInterval(function ()
            {
                if (g_sockjs)
                    g_sockjs.sockjsKeepalive();
            }, (this._xpush_controller.keepalivetime * 1000));
        };

        _pSockJSWrapper.onmessage = function (e)
        {
            var xpush = this._xpush_controller;
            if (xpush)
            {
                xpush._message(e.data);
            }
        };

        _pSockJSWrapper.onerror = nexacro._emptyFn;

        _pSockJSWrapper.onclose = function (e)
        {
            var xpush = this._xpush_controller;
            if (xpush)
            {
                xpush._close(e.code);
            }
        };

        _pSockJSWrapper = null;
    }
    else
    {
        nexacro._XPushController = function (control)
        {
            this.linkedcontrol = control;
            this.layoutlist = [];

            this._id = nexacro.Device.makeID();
            nexacro.Device._userCreatedObj[this._id] = control;

            var params = {};
            var json = {
                id: this._id,
                div: "XPush",
                method: "constructor",
                params: params
            };

            var jsonstr = JSON.stringify(json);
            nexacro.Device.exec(jsonstr);
        };

        var _pXPushController = nexacro._createPrototype(nexacro.Object, nexacro._XPushController);
        nexacro._XPushController.prototype = _pXPushController;

        _pXPushController.handle = null;
        _pXPushController._ajax = null;

        _pXPushController.retry = 1;
        _pXPushController.controlretry = 5;
        _pXPushController.layouturl = "";
        _pXPushController.keepalivetime = 30;
        _pXPushController.timeout = 30;
        _pXPushController.keeptimeout = 60;
        _pXPushController.async = true;
        _pXPushController.debug = false;

        _pXPushController.projectid = "";
        _pXPushController.protocolversion = 2;

        _pXPushController.create = nexacro._emptyFn;

        _pXPushController.destroy = function ()
        {
            this._destroy_layout();

            delete nexacro.Device._userCreatedObj[this._id];

            var params = {};
            var json = {
                id: this._id,
                div: "XPush",
                method: "destroy",
                params: params
            };

            var jsonstr = JSON.stringify(json);
            nexacro.Device.exec(jsonstr);
        };

        _pXPushController._destroy_layout = function ()
        {
            if (this._ajax)
            {
                if (this._ajax._destroy)
                    this._ajax._destroy();
                this._ajax = null;
            }
        };

        _pXPushController.setXPushAsync = function (v)
        {
            this.async = v;
        };

        _pXPushController.setXPushControlRetry = function (v)
        {
            this.controlretry = v;
        };

        _pXPushController.setXPushDebug = function (v)
        {
            this.debug = v;
        };

        _pXPushController.setXPushKeepAliveTime = function (v)
        {
            this.keepalivetime = v;
        };

        _pXPushController.setXPushKeepTimeout = function (v)
        {
            this.keeptimeout = v;
        };

        _pXPushController.setXPushTimeout = function (v)
        {
            this.timeout = v;
        };

        _pXPushController.setXPushLayoutURL = function (v)
        {
            this.layouturl = v;
            if ((nexacro._OS == "Windows" && nexacro._isHybrid()) ||
                (nexacro._OS == "Mac OS" && nexacro._macOSWebView)
            )
            {
                this.loadLayout(this.layouturl);
            }
        };

        _pXPushController.loadLayout = function (layouturl)
        {
            var comp = this.linkedcontrol;
            var url = layouturl;
            if (url.substring(0, 4).toLowerCase() == "url(")
                url = url.substring(5, url.length - 2);

            var form = comp._findForm(comp._p_parent);
            if (form)
            {
                if (url.indexOf("%") < 0)
                    layouturl = nexacro._getServiceLocation(url, form._getRefFormBaseUrl());
            }

            var i, j, k;
            var z, y, x;

            var pThis = this;
            var _ajax = this._ajax;
            if (_ajax)
            {
                this._destroy_layout();

                var layoutlist = this.layoutlist;
                for (i = 0, z = layoutlist.length; i < z; i++)
                {
                    layoutlist[i].listfield = [];
                }

                this.layoutlist = [];
            }

            _ajax = nexacro.__createHttpRequest();
            _ajax.handle.onreadystatechange = function (e)
            {
                if (this.readyState >= 4)
                {
                    var xml = _ajax.handle.responseXML;
                    if (xml)
                    {
                        var rootnode = xml.childNodes[0];

                        if (rootnode.nodeName != "message_layout")
                            return false;

                        var svcid = null;
                        var nokey = false;
                        var repeat = false;
                        var noreg = false;

                        var attr, fieldnode;
                        var check_idx = 0;
                        var layout, field;

                        var initLayoutForm = function ()
                        {
                            return {
                                "id": svcid,
                                "nokey": nokey,
                                "repeat": repeat,
                                "noreg": noreg,
                                "checkfieldidx": -1,
                                "listfield": []
                            };
                        };
                        var initFieldForm = function ()
                        {
                            return {
                                "id": null,
                                "type": null,
                                "size": 0,
                                "key": false,
                                "check": false
                            };
                        };

                        var childnodes = rootnode.childNodes;
                        for (i = 0, z = childnodes.length; i < z; i++)
                        {
                            if (childnodes[i].nodeName == "#text") continue;

                            attr = childnodes[i].attributes;
                            if (!attr) continue;
                            for (j = 0, y = attr.length; j < y; j++)
                            {
                                if (!svcid && attr[j].nodeName == "id" || attr[j].nodeName == "type")
                                    svcid = attr[j].nodeValue;
                                else if (attr[j].nodeName == "key")
                                    nokey = attr[j].nodeValue;
                                else if (attr[j].nodeName == "repeat")
                                    repeat = attr[j].nodeValue;
                                else if (attr[j].nodeName == "noreg")
                                    noreg = nexacro._toBoolean(attr[j].nodeValue);
                            }

                            fieldnode = childnodes[i];
                            y = fieldnode.childNodes.length;
                            if (y > 0)
                            {
                                layout = initLayoutForm();

                                for (j = 0; j < y; j++)
                                {
                                    if (fieldnode.childNodes[j].nodeName == "#text") continue;

                                    attr = fieldnode.childNodes[j].attributes;
                                    if (!attr) continue;

                                    field = initFieldForm();

                                    for (k = 0, x = attr.length; k < x; k++)
                                    {
                                        if (attr[k].nodeName == "id")
                                            field.id = attr[k].nodeValue;
                                        if (attr[k].nodeName == "type")
                                            field.type = attr[k].nodeValue;
                                        if (attr[k].nodeName == "size")
                                            field.size = parseInt(attr[k].nodeValue);
                                        if (attr[k].nodeName == "key")
                                        {
                                            field.key = nexacro._toBoolean(attr[k].nodeValue);
                                        }
                                        if (attr[k].nodeName == "check")
                                        {
                                            if (nexacro._toBoolean(attr[k].nodeValue))
                                            {
                                                field.check = true;
                                                layout.checkfieldidx = check_idx;
                                            }
                                        }
                                    }

                                    layout.listfield.push(field);
                                    check_idx++;
                                }

                                pThis.layoutlist.push(layout);
                            }
                        }
                    }
                    else
                    {
                        pThis._on_error(-703);
                        return false;
                    }
                }
            };

            try
            {
                _ajax.handle.open("GET", layouturl, false);
            }
            catch (e)
            {
                pThis._on_error(-703);
                _ajax = null;

                return false;
            }
            _ajax.handle.send("");
        };

        _pXPushController.setXPushRetry = function (v)
        {
            this.retry = v;
        };

        _pXPushController.setXPushProjectId = function (v)
        {
            this.projectid = v;
        };

        _pXPushController.setXPushProtocolVersion = function (v)
        {
            this.protocolversion = v;
        };

        _pXPushController.connectXPush = function (userid, sessionid, projectid)
        {
            var comp = this.linkedcontrol;
            var retry = this.retry;

            if (nexacro.Device.publicNumCheck(retry))
            {
                if (retry >= 0)
                {
                    retry = Number(retry);
                }
            }

            var address, addressList = [];
            comp._resetIPList();
            do
            {
                address = comp._getRandomIPInfo();
                if (address)
                    addressList.push(address);
            } while (address);

            var layouturl = this.layouturl;
            if (layouturl.substring(0, 4).toLowerCase() == "url(")
                layouturl = layouturl.substring(5, layouturl.length - 2);

            var form = comp._findForm(comp._p_parent);
            if (form)
            {
                if (layouturl.indexOf("%") < 0)
                    layouturl = nexacro._getServiceLocation(layouturl, form._getRefFormBaseUrl());
            }

            var params = {
                strUserID: userid,
                strSessionID: sessionid,
                protocolversion: this.protocolversion,
                projectid: this.protocolversion >= 3 ? this.projectid : undefined,
                strProjectID: projectid,
                iplist: comp._iplist,
                randomAddresss: addressList,
                retry: retry,
                controlretry: this.controlretry,
                layouturl: layouturl,
                layoutlist: this.layoutlist,
                keepalivetime: this.keepalivetime,
                keeptimeout: this.keeptimeout,
                timeout: this.timeout,
                async: this.async,
                commandlist: comp._commandlist
            };

            var json = {
                id: this._id,
                div: "XPush",
                method: "connect",
                params: params
            };

            var jsonstr = JSON.stringify(json);
            nexacro.Device.exec(jsonstr);
        };

        _pXPushController.disconnectXPush = function ()
        {
            var comp = this.linkedcontrol;
            if (comp)
            {
                comp._commandlist.length = 0;
            }

            var json = {
                id: this._id,
                div: "XPush",
                method: "disconnect",
                params: ""
            };

            var jsonstr = JSON.stringify(json);
            nexacro.Device.exec(jsonstr);
        };

        _pXPushController.sendResponseXPush = function (msgid)
        {
            var params = {
                msgid: msgid
            };
            var json = {
                id: this._id,
                div: "XPush",
                method: "sendResponse",
                params: params
            };

            var jsonstr = JSON.stringify(json);
            nexacro.Device.exec(jsonstr);
        };

        _pXPushController.requestMessageXPush = function (type, keys)
        {
            var messagekeyStr = "";
            var i, n;
            for (i = 0, n = keys.length; i < n; i++)
            {
                if (i > 1)
                    messagekeyStr += ",\"" + (keys[i]) + "\"";
                else
                    messagekeyStr += "\"" + (keys[i]) + "\"";
            }

            var params = '{"messagetype":"' + type + '", "messagekeys":[' + messagekeyStr + ']}';
            var jsonstr = '{"id":' + this._id + ', "div":"XPush", "method":"requestMessage", "params":' + params + '}';

            nexacro.Device.exec(jsonstr);
        };

        _pXPushController.fireErrorEventXPush = function ()
        {
            this._on_error(-701);
        };

        _pXPushController.commandXPush = function (commandcontrol)
        {
            var params = {};
            var command = commandcontrol.actiontype;

            if (command == "ADDF") 
            {
                var type = commandcontrol.type;
                params = {
                    type: type.toLowerCase(),
                    parameters: commandcontrol
                };
            }
            else 
            {
                params = commandcontrol;
            }

            var json = {
                id: this._id,
                div: "XPush",
                method: command,
                params: params
            };

            var jsonstr = JSON.stringify(json);
            nexacro.Device.exec(jsonstr);
        };

        _pXPushController._on_xpush = function (data)
        {
            var comp = this.linkedcontrol;
            if (comp)
            {
                var convData;
                if (nexacro._OS == "Android" || nexacro._OS == "Windows" || nexacro._OS == "Mac OS")
                {
                    convData = data;
                }
                else
                {
                    convData = nexacro._executeEvalStr("(" + data + ")");
                }
                var result = convData.recvdata;

                if (result.datalist)
                {
                    for (var i = 0; i < result.datalist.length; i++)
                    {
                        result.datalist[i].item = nexacro.Device.decodeString(result.datalist[i].item);
                    }
                }

                if (convData.action)
                {
                    result.action = convData.action;
                }

                if (convData.messageid)
                {
                    result.msgid = convData.messageid;
                }

                comp._on_xpush(result);
            }
        };

        _pXPushController._on_success = function (objData)
        {
            var comp = this.linkedcontrol;
            if (comp)
            {
                var data = {};
                if (objData.action == 11 /* RTID */)
                {
                    for (var i = 0; i < objData.returnvalue.length; i++)
                    {
                        var topictype = objData.returnvalue[i]["topictype"];
                        var topicid = objData.returnvalue[i]["topicid"];

                        if (data[topictype])
                        {
                            data[topictype].push(topicid);
                        }
                        else
                        {
                            data[topictype] = [topicid];
                        }
                    }
                    objData.returnvalue = data;
                }

                if (comp._currentipinfo == null)
                    comp._currentipinfo = [];
                comp._currentipinfo.ip = objData.serverip;
                comp._currentipinfo.port = objData.serverport;
                // [22/05/06] - 오지현 - [RP 94563][Xpush 에 set_layout() 으로 등록된 XPush_Message_Layout.xml 파일을 읽어오는 방법 문의]
                // iOS 작업용
                if (objData.layout)
                    comp._on_success(objData.reason, objData.action, objData.classtype, objData.messagetype, objData.messagekey, objData.returnvalue, this._getLayoutFromXMLString(nexacro.Device.decodeString(objData.layout)));
                else
                    comp._on_success(objData.reason, objData.action, objData.classtype, objData.messagetype, objData.messagekey, objData.returnvalue);
            }
        };

        // [22/05/06] - 오지현 - [RP 94563][Xpush 에 set_layout() 으로 등록된 XPush_Message_Layout.xml 파일을 읽어오는 방법 문의]
        // [RP : 94194][Xpush 에.. Layout.xml 파일을 읽어오는 방법 - WRE 작업내용] - 커밋 19dedb52(함경곤 책임)의 작업을 가져옴
        // iOS 작업용
        _pXPushController._getLayoutFromXMLString = function (strxml) 
        {
            var arrlayout = [];
            if (strxml)
            {
                var xml = nexacro._parseXMLDocument(strxml);
                if (xml) 
                {
                    var rootnode = xml.childNodes[0];
                    if (rootnode.nodeName != "message_layout")
                        return arrlayout;
                    var svcid = null;
                    var nokey = false;
                    var repeat = false;
                    var noreg = false;

                    var attr, fieldnode;
                    var check_idx = 0;
                    var layout, field;

                    var initLayoutForm = function ()
                    {
                        return {
                            "id": svcid,
                            "nokey": nokey,
                            "repeat": repeat,
                            "noreg": noreg,
                            "checkfieldidx": -1,
                            "listfield": []
                        };
                    };
                    var initFieldForm = function ()
                    {
                        return {
                            "id": null,
                            "type": null,
                            "size": 0,
                            "key": false,
                            "check": false
                        };
                    };

                    var childnodes = rootnode.childNodes;
                    for (var i = 0, z = childnodes.length; i < z; i++)
                    {
                        if (childnodes[i].nodeName == "#text") continue;

                        attr = childnodes[i].attributes;
                        if (!attr) continue;
                        for (var j = 0, y = attr.length; j < y; j++)
                        {
                            if (!svcid && attr[j].nodeName == "id" || attr[j].nodeName == "type")
                                svcid = attr[j].nodeValue;
                            else if (attr[j].nodeName == "key")
                                nokey = attr[j].nodeValue;
                            else if (attr[j].nodeName == "repeat")
                                repeat = attr[j].nodeValue;
                            else if (attr[j].nodeName == "noreg")
                                noreg = nexacro._toBoolean(attr[j].nodeValue);
                        }

                        fieldnode = childnodes[i];
                        y = fieldnode.childNodes.length;
                        if (y > 0)
                        {
                            layout = initLayoutForm();

                            for (var j = 0; j < y; j++)
                            {
                                if (fieldnode.childNodes[j].nodeName == "#text") continue;

                                attr = fieldnode.childNodes[j].attributes;
                                if (!attr) continue;

                                field = initFieldForm();

                                for (var k = 0, x = attr.length; k < x; k++)
                                {
                                    if (attr[k].nodeName == "id")
                                        field.id = attr[k].nodeValue;
                                    if (attr[k].nodeName == "type")
                                        field.type = attr[k].nodeValue;
                                    if (attr[k].nodeName == "size")
                                        field.type = parseInt(attr[k].nodeValue);
                                    if (attr[k].nodeName == "key")
                                    {
                                        field.key = nexacro._toBoolean(attr[k].nodeValue);
                                    }
                                    if (attr[k].nodeName == "check")
                                    {
                                        if (nexacro._toBoolean(attr[k].nodeValue))
                                        {
                                            field.check = true;
                                            layout.checkfieldidx = check_idx;
                                        }
                                    }
                                }

                                layout.listfield.push(field);
                                check_idx++;
                            }

                            arrlayout.push(layout);
                        }
                    }
                }
            }
            return arrlayout;
        };

        _pXPushController._on_error = function (objData)
        {
            var comp = this.linkedcontrol;
            if (comp)
            {
                if (typeof (objData) == "object")
                {
                    if (comp._currentipinfo == null)
                        comp._currentipinfo = [];
                    comp._currentipinfo.ip = objData.serverip;
                    comp._currentipinfo.port = objData.serverport;
                    comp._on_error(objData.errorcode, objData.classtype, objData.messagetype, objData.messagekey);
                }
                else
                {
                    comp._on_error(arguments[0], arguments[1]);
                }

            }
        };

        _pXPushController._on_keepalive = function (objData)
        {
            var comp = this.linkedcontrol;
            if (comp)
            {
                comp._on_keepalive(objData.type);
            }
        };

        _pXPushController = null;
    }
}
