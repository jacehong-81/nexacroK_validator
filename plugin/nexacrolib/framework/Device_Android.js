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

if (nexacro._OS == "Android" && (nexacro._Browser == "Runtime" || nexacro._isWebView()))
{
    nexacro.DeviceI.prototype.setup = function ()
    {
        if (nexacro.__initDevice)
            nexacro.__initDevice(this, this.runCallback, this.keyEvent, system, nexacro);

        if (nexacro.__getLibVersion)
            this.libraryversion = nexacro.__getLibVersion();

        if (nexacro._isWebView())
            this._is_hybrid = true;

        this._userCreatedObj = {};
        this.curDevice = nexacro._DeviceType.ANDROID;
        this.isphone = 0;
    };

    nexacro.DeviceI.prototype.exec = function (jsonString)
    {
        if (nexacro._Browser == "Runtime")
        {
            nexacro.__execDeviceAPI(jsonString);
        }
        else if (nexacro._isHybrid() && window._nativeApp)
        {
            return window._nativeApp.jsExec(jsonString);
        }
    };

    nexacro._callscript = function (script)
    {
        nexacro._executeEvalStr(script);
    };

    // Alias convert를 위한 method
    nexacro._convertRealPath = function (strAlias)
    {
        if (strAlias === undefined || strAlias === null)
        {
            return "";
        }
        //strAlias : %USERAPP%pics/1349934624256.JPEG 
        if (strAlias.toLowerCase().indexOf("%userapp%") !== 0 &&
            strAlias.toLowerCase().indexOf("%sd_card%") !== 0)
        {
            return strAlias;
        }

        var aliasPath = strAlias.substring(0, 9).toLowerCase();
        var filePath = strAlias.substring(9, strAlias.length);
        if (filePath.charAt(0) !== "/")
        {
            filePath = "/" + filePath;
        }

        if (aliasPath === "%userapp%")
        {
            // /data/data/com.tobesoft.nexacro.loader/files/nexacro/
            return nexacro.System.userapppath + filePath;
        }
        else if (aliasPath === "%sd_card%")
        {
            // /storage/emulated/0/Android/data/com.tobesoft.nexacro.loader/files/
            return nexacro.System.sdcardpath + filePath;
        }
    };

    nexacro._checkDevicePermission = function (permission_types)
    {
        if (nexacro._Browser == "Runtime")
        {
            return nexacro.__checkDevicePermission(permission_types);
        }
        else 
        {
            if (permission_types === undefined || permission_types === null)
                return;

            var params = {
                permissions: permission_types
            };
            var jsonobj = {
                id: "0000",
                div: "Permission",
                method: "checkDevicePermission",
                params: params
            };
            var jsonstr = JSON.stringify(jsonobj);
            nexacro.Device.exec(jsonstr);
        }
    };

    nexacro._requestDevicePermission = function (permission_types, description)
    {
        if (nexacro._Browser == "Runtime")
        {
            return nexacro.__requestDevicePermission(permission_types, description);
        }
        else
        {
            if (permission_types === undefined || permission_types === null)
                return;

            var params;
            if (description === undefined || description === null)
            {
                params = {
                    permissions: permission_types,
                    description: ""
                };
            }
            else 
            {
                params = {
                    permissions: permission_types,
                    description: description
                };
            }

            var jsonobj = {
                id: "0000",
                div: "Permission",
                method: "requestDevicePermission",
                params: params
            };
            var jsonstr = JSON.stringify(jsonobj);
            nexacro.Device.exec(jsonstr);
        }
    };

    nexacro._setProtocolVar = function (name, key, val)
    {
        // Windows 와 동작을 맞추기 위해 setParam을 DeviceAPI로 호출함.
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
        if (nexacro._Browser == "Runtime")
            return nexacro.__userNotify(notifyid, message);

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

    nexacro._isHybrid = function ()
    {
        return nexacro.Device._isHybrid();
    };

    nexacro._initDeviceAPI();
}