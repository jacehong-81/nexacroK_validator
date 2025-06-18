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
if (nexacro._OS == "iOS" && (window.location.pathname.split("/").pop() == "Run.html" || window.location.pathname.split("/").pop() == "nexacro.html" || window.location.pathname.split("/").pop() == "popup.html"))
{
    nexacro.DeviceI.prototype.setup = function ()
    {
        this._userCreatedObj = {};
        this.isphone = 0;
        this._is_hybrid = true;
        // @deprecated
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
            this.curDevice = nexacro._DeviceType.IOS;

            if (!this._use_wkwebview)
            {
                if (!this.bridge && this._isHybrid())
                {
                    this.bridge = document.createElement("IFRAME");
                    this.bridge.setAttribute("height", "0px");
                    this.bridge.setAttribute("width", "0px");
                    this.bridge.setAttribute("frameborder", "0");
                    this.bridge.style.display = "none";
                    document.documentElement.appendChild(this.bridge);
                    this.msgqueue = [];
                    this.msgqueue.length = 0;
                    setInterval(() => nexacro.Device.execiOS(), 20);
                }
            }
        }
    };

    nexacro.DeviceI.prototype.execiOS = function ()
    {
        if (this.msgqueue.length > 0 && this.curDevice == nexacro._DeviceType.IOS) 
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
        var rootPathCheck = strAlias.substring(0, 9);
        var iosFilePath = "";
        if (rootPathCheck.toLowerCase() == "%userapp%")
        {
            iosFilePath = strAlias.substring(9, strAlias.length);
            if (iosFilePath.charAt(0) != "/")
                iosFilePath = "/" + iosFilePath;

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
            nexacro._destroyManagerShadow(_win_handle);
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

    nexacro._isHybrid = function ()
    {
        return nexacro.Device._isHybrid();
    };

    nexacro._checkDevicePermission = function (permission_types)
    {
        if (permission_types === undefined || permission_types === null)
            return;

        var params = {
            permissions: permission_types
        };
        var json = {
            id: null,
            div: "Permission",
            method: "checkDevicePermission",
            params: params
        };

        var jsonstr = JSON.stringify(json);
        nexacro.Device.exec(jsonstr);
    };

    nexacro._requestDevicePermission = function (permission_types, description)
    {
        if (permission_types === undefined || permission_types === null)
            return;

        var params;
        if (description === undefined || description === null)
        {
            params = {
                permissions: permission_types,
                description: null
            };
        }
        else 
        {
            params = {
                permissions: permission_types,
                description: description
            };
        }

        var json = {
            id: null,
            div: "Permission",
            method: "requestDevicePermission",
            params: params
        };

        var jsonstr = JSON.stringify(json);
        nexacro.Device.exec(jsonstr);
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
        // 하위 호환성을 위해 유지함 (구 엔진에서 최신 프레임워크 실행)
        var protocolparameters = nexacro.Device._protocolparameters[name];
        if (protocolparameters == undefined)
        {
            nexacro.Device._protocolparameters[name] = {};
            protocolparameters = nexacro.Device._protocolparameters[name];
        }
        protocolparameters[key] = val;

        // Android / Windows 와 동작을 맞추기 위해 setParam을 DeviceAPI로 호출함.
        var params = {
            name: name,
            key: key,
            value: val
        };
        var json = {
            id: null,
            div: "ProtocolAdaptor",
            method: "setParam",
            params: params
        };

        var jsonstr = JSON.stringify(json);
        nexacro.Device.exec(jsonstr, true);

        return true;
    };

    nexacro._userNotify = function (notifyid, message)
    {
        var params = {
            notifyid: notifyid,
            message: message
        };
        var json = {
            id: null,
            div: "nexacro",
            method: "userNotify",
            params: params
        };

        var jsonstr = JSON.stringify(json);
        nexacro.Device.exec(jsonstr, true);

        return true;
    }

    nexacro._execBrowser = function (strUrl)
    {
        this._id = nexacro.Device.makeID();

        if (strUrl == null)
        {
            return false;
        }

        var params = {
            url: strUrl
        };
        var json = {
            id: this._id,
            div: "Browser",
            method: "execBrowser",
            params: params
        };

        var jsonstr = JSON.stringify(json);
        nexacro.Device.exec(jsonstr);

        return true;
    };

    nexacro._execDefaultBrowser = function (url, newwindow)
    {
        return nexacro._execBrowser(url);
    };

    nexacro._setPreferencesValue = function (key, value)
    {
        if (!key)
            return false;

        var params;

        if (value) 
        {
            params = {
                key: key,
                value: nexacro.Device.encodeString(value)
            };
        }
        else 
        {
            params = {
                key: key,
                value: undefined
            };
        }

        var json = {
            id: 0,
            div: "Preferences",
            method: "setPreferencesValue",
            params: params
        };

        var jsonstr = JSON.stringify(json);
        nexacro.Device.exec(jsonstr);

        return true;
    };

    nexacro._callExtensionLibraryMethod = function () 
    {
        if (nexacro._isHybrid && nexacro._isHybrid())
        {
            var option, divValue = "ExtensionAPI";
            var parameter = {};

            if (arguments)
            {
                if (arguments.length > 3)
                {
                    for (let h = 3; h < arguments.length; h++)
                    {
                        parameter[h - 3] = arguments[h];
                    }
                }
                if (arguments[2] == "__loadLibraryExtensionAPI")
                {
                    var classPath = parameter[0].split(".");
                    divValue = classPath[classPath.length - 1];
                }
                if (arguments[2] == "__getLastErrorMessageExtensionAPI")
                {
                    option =
                    {
                        method: arguments[2] // __load, __callmethod등
                    };
                }
                else
                {
                    option =
                    {
                        id: arguments[0],       // handle
                        div: divValue,          // load시 class 이름, 아닌 경우 "ExtensionAPI"
                        method: arguments[2],   // __load, __callmethod등..
                        async: arguments[1],    // 0=sync, 1=async
                        params: parameter       // ExtensionAPI 라이브러리 함수로 보낼 인자
                    };
                }
            }
            var json =
            {
                class: "extensionapi",
                action: arguments[2],
                options: option
            };

            var jsonstr = JSON.stringify(json);
            var returnValue = nexacro.Device.exec(jsonstr, (arguments[1] ? false : true));
            return returnValue;
        }
        return nexacro.__callMethodExtensionAPI.apply(this, arguments);
    }

    nexacro._initDeviceAPI();
}