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
if (nexacro._Browser == "Runtime")
{
    nexacro._XPushController = function (control)
    {
        this.linkedcontrol = control;
    };

    var _pXPushController = nexacro._createPrototype(nexacro.Object, nexacro._XPushController);
    nexacro._XPushController.prototype = _pXPushController;

    _pXPushController.handle = null;

    _pXPushController.retry = 1;
    _pXPushController.controlretry = 5;
    _pXPushController.layouturl = "";
    _pXPushController.keepalivetime = 30;
    _pXPushController.timeout = 30;
    _pXPushController.keeptimeout = 60;

    _pXPushController.projectid = "";
    _pXPushController.protocolversion = 2;

    _pXPushController.create = function ()
    {
        var comp = this.linkedcontrol;
        var _win = comp._getWindow();
        if (_win && _win.handle)
        {
            this.handle = nexacro.__createXPushHandle(this, _win.handle);
            nexacro.__setXPushHandleOnEvent(this.handle, this._on_xpush, this._on_success, this._on_error, this._on_keepalive);
            nexacro.__setXPushHandleOnFunction(this.handle, this._getRandomIPInfo, this._setError);
        }
    };

    _pXPushController.destroy = function ()
    {
        nexacro.__destroyXPushHandle(this.handle);

        this.handle = null;
        this.linkedcontrol = null;
    };

    _pXPushController.setXPushAsync = function (async)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__setXPushHandleAsync(handle, async);
        }
    };

    _pXPushController.setXPushControlRetry = function (cnt)
    {
        this.controlretry = cnt;

        var handle = this.handle;
        if (handle)
        {
            nexacro.__setXPushHandleControlRetry(handle, cnt);
        }
    };

    _pXPushController.setXPushDebug = function (debug)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__setXPushHandleDebug(handle, debug);
        }
    };

    _pXPushController.setXPushKeepAliveTime = function (time)
    {
        this.keepalivetime = time;

        var handle = this.handle;
        if (handle)
        {
            nexacro.__setXPushHandleKeepAliveTime(handle, time);
        }
    };

    _pXPushController.setXPushKeepTimeout = function (time)
    {
        this.keeptimeout = time;
    };

    _pXPushController.setXPushTimeout = function (time)
    {
        this.timeout = time;
    };

    _pXPushController.setXPushLayoutURL = function (layouturl)
    {
        var handle = this.handle;
        if (handle)
        {
            if (nexacro._OS != "Android")
            {
                var url = layouturl;
                if (url.substring(0, 4).toLowerCase() == "url(")
                {
                    url = url.substring(5, url.length - 2);
                }

                var form = this.linkedcontrol._findForm(this.linkedcontrol.parent);
                if (form)
                {
                    if (url.indexOf("%") < 0)
                    {
                        layouturl = nexacro._getServiceLocation(url, form._getRefFormBaseUrl());
                    }
                }
            }

            nexacro.__setXPushHandleLayoutURL(handle, layouturl);
        }
    };

    _pXPushController.setXPushRetry = function (cnt)
    {
        this.retry = cnt;

        var handle = this.handle;
        if (handle)
        {
            nexacro.__setXPushHandleRetry(handle, cnt);
        }
    };

    _pXPushController.setXPushProjectId = function (id)
    {
        this.projectid = id;
    };

    _pXPushController.setXPushProtocolVersion = function (version)
    {
        this.protocolversion = version;

        var handle = this.handle;
        if (handle)
        {
            nexacro.__setXPushHandleProtocolversion(handle, version);
        }
    };

    _pXPushController.connectXPush = function (userid, sessionid, projectid)
    {
        var handle = this.handle;
        if (handle)
        {
            this.linkedcontrol._resetIPList();
            nexacro.__connectXPushHandle(handle, userid, sessionid, projectid, this.retry, this.timeout, this.controlretry, this.keeptimeout, true);
        }
    };

    _pXPushController.disconnectXPush = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__disconnectXPushHandle(handle);
        }
    };

    _pXPushController.sendResponseXPush = function (id)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__sendResponseXPushHandle(handle, id);
        }
    };

    _pXPushController.requestMessageXPush = function (type, keys)
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__requestMessageXPushHandle(handle, type, keys);
        }
    };

    _pXPushController.fireErrorEventXPush = function ()
    {
        var handle = this.handle;
        if (handle)
        {
            nexacro.__fireXPushHandleErrorEvent(handle, -701);
        }
    };

    _pXPushController.commandXPush = function (commandcontrol)
    {
        var handle = this.handle;
        if (handle)
        {
            var projectid = "";
            if (this.protocolversion == 3)
                projectid = commandcontrol.projectid || this.projectid;

            //            __debugMsg("[Runtime] commandXPush : projectid > " + projectid)
            nexacro.__commandXPushHandle(handle, commandcontrol.actiontype, commandcontrol.messagetype, commandcontrol.messagekey, commandcontrol.type, commandcontrol.userid, projectid);
        }
    };

    _pXPushController._on_xpush = function (recvObj)
    {
        var comp = this.linkedcontrol;
        if (comp)
        {
            comp._on_xpush(recvObj);
        }
    };

    _pXPushController._on_success = function (reason, action, classtype, messagetype, messagekey, returnvalue, strlayout)
    {
        var comp = this.linkedcontrol;
        if (comp)
        {
            if (action == 11 /* RTID */)
            {
                var data = {};
                for (var i = 0; i < returnvalue.length; i++)
                {
                    var topictype = returnvalue[i]["topictype"];
                    var topicid = returnvalue[i]["topicid"];

                    if (data[topictype])
                    {
                        data[topictype].push(topicid);
                    }
                    else
                    {
                        data[topictype] = [topicid];
                    }
                }

                returnvalue = data;
            }
            comp._on_success(reason, action, classtype, messagetype, messagekey, returnvalue, this._getLayoutFromXMLString(strlayout));
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

    _pXPushController._getRandomIPInfo = function ()
    {
        var comp = this.linkedcontrol;
        if (!comp) return null;

        return comp._getRandomIPInfo();
    };

    _pXPushController._setError = function (errorcode, errormsg)
    {
        var comp = this.linkedcontrol;
        if (comp)
        {
            comp._setError(errorcode, errormsg);
        }
    };

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

                        arrlayout.push(layout);
                    }
                }
            }
        }
        return arrlayout;
    };

    _pXPushController = null;
}