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

//==================================================================
//Only iOS
//==================================================================
if (nexacro._OS == "iOS" && (window.location.pathname.split("/").pop() == "Run.html" || window.location.pathname.split("/").pop() == "nexacro.html"))
{
    nexacro.DeviceI.prototype.setup = function ()
    {   
        this._userCreatedObj = {};
        this.isphone = 0;
        this._is_hybrid = true;
        this._protocolparameters = {};

        if (!!window.webkit && !!window.webkit.messageHandlers && !!window.webkit.messageHandlers.nexacro)
        {
            this._use_wkwebview = true;
        }
        else
        {
            this._use_wkwebview = false;
        }

        if (nexacro._OS == "iOS")
        {
            this.curDevice = DeviceType.IOS;

            if (!this._use_wkwebview)
            {
                if (!this.bridge && this._isHybrid())
                {
                    this.bridge = document.createElement("IFRAME");
                    this.bridge.setAttribute("height","0px");
                    this.bridge.setAttribute("width","0px");
                    this.bridge.setAttribute("frameborder","0");
                    this.bridge.style.display = "none";
                    document.documentElement.appendChild(this.bridge);
                    this.msgqueue = [];
                    this.msgqueue.length = 0;
                    setInterval("nexacro.Device.execiOS()", 20);
                }
            }
        } 
    };

    nexacro.DeviceI.prototype.execiOS = function ()
    {
        if(this.msgqueue.length > 0 && this.curDevice == DeviceType.IOS) 
        { 
            this.msgqueue.reverse();
            //iOS8 대응으로 "?" 추가 삽입.
            this.bridge.src = "nexacro://?" + encodeURI(this.msgqueue.pop());
            this.msgqueue.reverse();
        }
    };

    nexacro.DeviceI.prototype.exec = function (method, sync)
    {
        if (this._isHybrid() == false)
            return;

        if (this._use_wkwebview)
        {
            if (!sync)
                window.webkit.messageHandlers.nexacro.postMessage(method);
            else
                return prompt("nexacro", method);
        }
        else
        {
            this.msgqueue.push(method); // msgqueue의 마지막에 명령 추가...
        }
    };

    // Alias convert를 위한 method for V13(only iOS) 
    nexacro._convertRealPath = function (strAlias)
    {
        if (nexacro.Device._isHybrid() == undefined || !nexacro.Device._isHybrid())
            return strAlias;

        if (strAlias === undefined || strAlias === null)
        {
            return "";
        }
        //strAlias : %USERAPP%pics/1349934624256.JPEG 
        //this.userapp : /data/data/com.tobesoft.nexacro.loader/files/NEXACRO/
        var rootPathCheck = strAlias.substring(0,9);
        var iosFilePath = "";
        if (rootPathCheck.toLowerCase()=="%userapp%")
        {
            iosFilePath = strAlias.substring(9,strAlias.length);
            return nexacro.System.userapppath + iosFilePath;
        }
        else 
        {
            return strAlias;
        }       
    };   

    nexacro._closeWindowHandle = function (_win_handle)
    {
        if (nexacro._getMainWindowHandle() == _win_handle)
        {
            nexacro._destroyManagerFrame(_win_handle);
            nexacro.Device.exit();
            _win_handle.open("", "_self");
        }
        // TODO check linked_window를 null로 세팅하고 close하면 닫을지 물어보는 Confirm창이 나온다.
        //            (Chrome + onbeforeunload 이벤트에서 close하는 경우 해당)
        //_win_handle._linked_window = null; // TOBEWindow
        _win_handle.close();
    };

    //Env Cookie, Cache
    nexacro._setEnableCookie = function (enable)
    {     
        nexacro.Device.exec("COOKIE::" + enable);
    };
        
    nexacro._setEnableCache = function (enable)
    {
        nexacro.Device.exec("CACHE::" + enable);
    };
    
    nexacro._isHybrid = function()
    {
        return nexacro.Device._isHybrid();
    };
    
    nexacro._convertDatasetSSVToBIN = function (ssvdata)
    {
        return ssvdata;
    };

    nexacro._convertDatasetBINToSSV = function (bindata)
    {
        return bindata;
    };

    nexacro._convertStreamSSVToBIN = function (ssvdata)
    {
        return ssvdata;
    };

    nexacro._convertStreamBINToSSV = function (bindata)
    {
        return bindata;
    };

    nexacro._setProtocolVar = function (name, key, val)
    {
        var protocol = nexacro.Device._protocolparameters[name];
      
        if (protocol == undefined) {
            nexacro.Device._protocolparameters[name] = {};
            protocol = nexacro.Device._protocolparameters[name];
        }
    
        protocol[key] = val;
    
        return true;
    };

    nexacro._execBrowser = function(strUrl)
    {
        this._id = nexacro.Device.makeID();
    
        if (strUrl == null || strUrl == undefined)
        {
            return false;
        }
    
        var params = '{"url":"'+strUrl+'"}';
        var jsonstr = '{"id":'+this._id+', "div":"Browser", "method":"execBrowser", "params":'+params+"}";

        nexacro.Device.exec(jsonstr);
    
        return true;    
    };

    //Event onactivate call for iOS 
    nexacro._on_activate = function()
    {
        var mainframe = nexacro.getApplication().mainframe;
        var _win = mainframe._window;

        var focuslist = _win.getCurrentFocusPaths();
        var len = focuslist.length;
        if (len > 0)
        {
            var last_focused_comp = focuslist[len -1];
            var form = last_focused_comp._findForm(last_focused_comp);
       
            form._on_activate(); 
        }
    };

    nexacro._setPreferencesValue = function(key, value)
    {
        if (!key)
            return false;

        var params = '{}';

        if (value)
            params = '{"key":"'+key+'","value":"'+nexacro.Device.encodeString(value)+'"}';
        else
            params = '{"key":"'+key+'","value":undefined}';

        var jsonstr = '{"id":0, "div":"Preferences", "method":"setPreferencesValue", "params":'+params+'}';

        nexacro.Device.exec(jsonstr);

        return true;
    };

    nexacro._initDeviceAPI();
}