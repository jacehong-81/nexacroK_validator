//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacrochart-public-license-readme-1.1.html
//
//==============================================================================
//==============================================================================
// nexacro.VoiceRecognition
//==============================================================================
if (!nexacro.VoiceRecognition)
{
    nexacro.VoiceRecognition = function (id, parent)	
    {
        nexacro.DeviceAdaptor.call(this, id, parent);
        //TODO
        this._entityanalyzer = new nexacro._VoiceRecognitionEntityAnalyzer("VoiceRecognition_EntityAnalyzer", this);
        this._intentanalyzer = new nexacro._VoiceRecognitionIntentAnalyzer("VoiceRecognition_IntentAnalyzer", this);
        nexacro.addErrorMessage(system._language, this._const_fail_load_codestring, ["fail load deviceadpator. [", "%0", ":", "%1", " - ", "%2", "]"]);
    };

    var _pVoiceRecognition = nexacro._createPrototype(nexacro.DeviceAdaptor, nexacro.VoiceRecognition);
    nexacro.VoiceRecognition.prototype = _pVoiceRecognition;
    // property, method 정의

    _pVoiceRecognition._p_intentanalyzersvcurl = "";
    _pVoiceRecognition._p_entityanalyzersvcurl = "";
    _pVoiceRecognition._p_subscriptionkey = undefined;
    _pVoiceRecognition._p_serviceregion = undefined;
    _pVoiceRecognition._p_servicelanguage = undefined;
    //en-US - (English)
    //ko-KR - (Korean)
    //ja    - (Japanese)


    _pVoiceRecognition._const_fail_load_codestring = "object_voice_fail_load";
    _pVoiceRecognition._intentanalyzer = null;
    _pVoiceRecognition._entityanalyzer = null;
    //_pVoiceRecognition._intentanalyzersvcurl = null;
    //_pVoiceRecognition._entityanalyzersvcurl = null;

    _pVoiceRecognition._event_list = {
        //"onextendedcommand": 1,
        //  "onevent": 1
        //  "onsuccess": 1,
        //  "onerror": 1
    };

    _pVoiceRecognition._handle = null;

    //===============================================================
    // nexacro.VoiceRecognition : Create & Destroy & Update
    //===============================================================

    _pVoiceRecognition.init = function (configs) 	
    {
        // initialize
        var handle;
        // load library , platform별 분기처리
        var _os = nexacro._OS;
        switch (_os)
        {
            case "Windows":
                var path;
                if (system.navigatorfullname == "Nexacro N Engine (x86)")
                {
                    path = "%COMPONENTHOME%VoiceRecognition/x86/voicerecognition.dll";
                }
                else
                {
                    path = "%COMPONENTHOME%VoiceRecognition/x64/voicerecognition.dll";
                }

                handle = nexacro._loadExtensionLibrary(path);
                if (!handle)
                {
                    nexacro._onSystemWarning(this, this._const_fail_load_codestring, this.id, nexacro.System.convertRealPath(path), nexacro._getExtensionLoadErrorMessage());
                }
                break;
            case "Android":
                handle = nexacro._loadExtensionLibrary("com.nexacro.deviceapi.VoiceRecognition");
                break;
            case "iOS":
                handle = nexacro._loadExtensionLibrary("VoiceRecognition");
                break;
            default:
                break;
        }
        this._handle = handle;
        if (configs)
        {
            for (var prop in configs)
            {
                var fn = this["set_" + prop];
                if (fn)
                    fn.call(this, configs[prop]);
            }
            if (this._p_subscriptionkey)
                this.setup();
        }
        return handle;
    };

    _pVoiceRecognition.destroy = function () 	
    {
        nexacro._unloadExtensionLibrary(this._handle)
    };

    _pVoiceRecognition.resetData = function () 	
    {
        this._intentanalyzer.value = "";
        this._entityanalyzer.value = "";
    };

    //===============================================================
    // nexacro.VoiceRecognition : Properties
    //===============================================================  
    _pVoiceRecognition.set_intentanalyzersvcurl = function (v)
    {
        if (this._p_intentanalyzersvcurl != v)
        {
            this._p_intentanalyzersvcurl = v;
            this.on_apply_intentanalyzersvcurl();
        }
    };

    //_pVoiceRecognition.get_intentanalyzersvcurl = function (v)
    //{
    //    return this._p_intentanalyzersvcurl;
    //};

    _pVoiceRecognition.on_apply_intentanalyzersvcurl = function (v)
    {
        var intentanalyzer = this._intentanalyzer;
        if (intentanalyzer)
            intentanalyzer.set_url(this._p_intentanalyzersvcurl);
    };

    _pVoiceRecognition.set_entityanalyzersvcurl = function (v)
    {
        if (this._p_entityanalyzersvcurl != v)
        {
            this._p_entityanalyzersvcurl = v;
            this.on_apply_entityanalyzersvcurl();
        }
    };

    //_pVoiceRecognition.get_entityanalyzersvcurl = function (v)
    //{
    //    return this._p_entityanalyzersvcurl;
    //};

    _pVoiceRecognition.on_apply_entityanalyzersvcurl = function (v)
    {
        var entityanalyzer = this._entityanalyzer;
        if (entityanalyzer)
            entityanalyzer.set_url(this._p_entityanalyzersvcurl);
    };

    _pVoiceRecognition.set_subscriptionkey = function (v)
    {
        if (this._p_subscriptionkey != v)
        {
            this._p_subscriptionkey = v;
        }
    };

    _pVoiceRecognition.set_serviceregion = function (v)
    {
        if (this._p_serviceregion != v)
        {
            this._p_serviceregion = v;
        }
    };

    _pVoiceRecognition.set_servicelanguage = function (v)
    {
        if (this._p_servicelanguage != v)
        {
            this._p_servicelanguage = v;
        }
    };

    //Object.defineProperty(_pVoiceRecognition, "intentanalyzersvcurl", { get: _pVoiceRecognition.get_intentanalyzersvcurl, set: _pVoiceRecognition.set_intentanalyzersvcurl, configurable: false });
    //Object.defineProperty(_pVoiceRecognition, "entityanalyzersvcurl", { get: _pVoiceRecognition.get_entityanalyzersvcurl, set: _pVoiceRecognition.set_entityanalyzersvcurl, configurable: false });

    _pVoiceRecognition._properties = [{ name: "intentanalyzersvcurl" }, { name: "entityanalyzersvcurl" }, { name: "subscriptionkey" }, { name: "serviceregion" }, { name: "servicelanguage" }];
    nexacro._defineProperties(_pVoiceRecognition, _pVoiceRecognition._properties);

    //===============================================================
    // nexacro.VoiceRecognition : Methods
    //===============================================================
    _pVoiceRecognition._analyzeIntents = function (text)
    {
        var intentanalyzer = this._intentanalyzer;
        if (intentanalyzer)
            intentanalyzer.analyze(text);
    };

    _pVoiceRecognition._analyzeEntities = function (text)
    {
        var entityanalyzer = this._entityanalyzer;
        if (entityanalyzer)
            entityanalyzer.analyze(text);
    };

    _pVoiceRecognition.setup = function ()
    {
        if (this.subscriptionkey)
            this.callMethod("setup", this.subscriptionkey, this.serviceregion, this.servicelanguage);
    };

    _pVoiceRecognition.recognize = function ()
    {
        this.callMethod("recognize");
    };

    _pVoiceRecognition.recognizeTest = function (text)
    {
        trace("_recognizeSTT");
        this.callMethod("recognizeTest", text);
    };

    _pVoiceRecognition.speak = function (text)
    {
        this.callMethod("speak", text);
    };

    _pVoiceRecognition.callMethod = function () 
    {
        //var async_type = 1;
        var handle = this._handle;
        var len = arguments.length;

        if (handle && len > 0) 
        {
            if (nexacro._isHybrid && nexacro._isHybrid()) 
            {
                var jsonstr = '{"id":' + handle;
                jsonstr += ', "div":"' + this.name + '"';
                jsonstr += ', "method":"' + arguments[0] + '"';

                // make params
                var params = '';

                if (len > 1) // method, param1, and more
                {
                    params += '"1": "' + arguments[1] + '"';
                    for (var i = 2; i < len; i++)
                    {
                        params = params + ', "' + i + '": "' + arguments[i] + '"';
                    }
                    params = '{ ' + params + ' }';
                    jsonstr = jsonstr + ', "params":' + params + '}';
                }
                else
                    jsonstr = jsonstr + '}';


                nexacro.Device.exec(jsonstr);

            }
            else
            {
                var arrArguments =
                    [
                        handle,
                        1
                    ];
                for (var i = 0; i < len; i++)
                    arrArguments.push(arguments[i]);
                return nexacro._callExtensionLibraryMethod.apply(this, arrArguments);
            }
        }
    };

    _pVoiceRecognition.on_event = function (eventid, eventtype, data)
    {
        var intent = "";
        var evt_type = eventtype;

        if (eventtype == "Recognized" || eventtype == "RecognizedTest")
        {
            intent = this._intentanalyzer.value;
            if (intent)
            {
                intent[1] = data;
            }
            else
            {
                this._analyzeIntents(data);
                intent = this._intentanalyzer.value;
            }
            evt_type = "onintent";
        }
        else if (eventtype == "SpeechCompleted")
        {
            evt_type = "onspeakcompleted";
        }

        return this.fireEvent(eventid, evt_type, this.name, intent);
    };


    _pVoiceRecognition.on_event_default_action = function (eventid, eventtype, data)    
    {
        trace("_pVoiceRecognition.on_event_default_action", eventid, eventtype, data);
        if (eventtype == "onintent" && data && data[1])
        {
            this._analyzeEntities(data[1]);
            var entity = this._entityanalyzer.value;
            return this.fireEvent(eventid, "onentity", this.name, entity);
        }
        return true;
    };

    _pVoiceRecognition = null;
    /*
    //==============================================================================
    // nexacro.VoiceRecognitionEventInfo
    //==============================================================================
    nexacro.VoiceRecognitionEventInfo = function (strEventId, objData)
    {
        this.eventid = strEventId;
        this.objData = objData;
    };
    var _pVoiceRecognitionEventInfo = nexacro.VoiceRecognitionEventInfo.prototype = nexacro._createPrototype(nexacro.EventInfo, nexacro.VoiceRecognitionEventInfo);
    _pVoiceRecognitionEventInfo._type_name = "VoiceRecognitionEventInfo";

    delete _pVoiceRecognitionEventInfo;
    */
}

//==============================================================================
// nexacro.EntityAnalyzer
//==============================================================================
if (!nexacro._VoiceRecognitionEntityAnalyzer)
{
    nexacro._VoiceRecognitionEntityAnalyzer = function (id, parent) 
    {
        nexacro._EventSinkObject.call(this, id, parent);
    }
    var _pVoiceRecognitionEntityAnalyzer = nexacro._createPrototype(nexacro._EventSinkObject, nexacro._VoiceRecognitionEntityAnalyzer);
    nexacro._VoiceRecognitionEntityAnalyzer.prototype = _pVoiceRecognitionEntityAnalyzer;

    _pVoiceRecognitionEntityAnalyzer._type_name = "VoiceRecognitionEntityAnalyzer";
    _pVoiceRecognitionEntityAnalyzer._httpRequest = null;
    _pVoiceRecognitionEntityAnalyzer._entities = null;
    _pVoiceRecognitionEntityAnalyzer._entityanalyzertype = null; //next ver

    _pVoiceRecognitionEntityAnalyzer.url = "";
    _pVoiceRecognitionEntityAnalyzer.async = false;
    _pVoiceRecognitionEntityAnalyzer.value = undefined;
    /*
    _pEntityAnalyzer._event_list = {
        "onload": 1
    };
      */
    _pVoiceRecognitionEntityAnalyzer.set_url = function (v)
    {
        if (this.url != v)
            this.url = v;
    };

    _pVoiceRecognitionEntityAnalyzer.set_async = function (v)
    {
        if (this.async != v)
            this.async = v;
    };


    _pVoiceRecognitionEntityAnalyzer.analyze = function (text, url, async)
    {
        var httpRequest = this._http_request;
        if (!httpRequest)
        {
            httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = this._onresponse;
            httpRequest._entityAnalyzer = this;
        }
        this._entities = null;

        var _url = url ? url : this.url;
        if (_url)
            _url = _url + "?text=" + encodeURIComponent(text);
        httpRequest.open("GET", _url, async ? async : this.async);
        httpRequest.send();
    };

    _pVoiceRecognitionEntityAnalyzer._onresponse = function ()
    {
        if (this.readyState == 4 && this.status == 200) // OK
        {
            var entityAnalyzer = this._entityAnalyzer;
            var objSyntax = JSON.parse(this.response);
            if (objSyntax)
            {
                var entities = new Array();
                var response_entity = objSyntax.entities ? objSyntax.entities : objSyntax.phrases;
                if (response_entity)
                {
                    for (var i = 0; i < response_entity.length; i++)
                    {
                        var item = response_entity[i];
                        if (item)
                        {
                            if (item.indexOf)
                            {
                                var idx = item.indexOf("(", 0);
                                if (idx > -1)
                                {
                                    entities.push(item.substring(0, idx));
                                }
                            }
                            else if (item.entity)
                                entities.push(item.entity);
                        }
                    }
                    entityAnalyzer.value = entities;
                }
            }
        }
    };

}

//==============================================================================
// nexacro.IntentAnalyzer
//==============================================================================
if (!nexacro._VoiceRecognitionIntentAnalyzer)
{
    nexacro._VoiceRecognitionIntentAnalyzer = function (id, parent) 
    {
        nexacro._EventSinkObject.call(this, id, parent);
    }
    var _pVoiceRecognitionIntentAnalyzer = nexacro._createPrototype(nexacro._EventSinkObject, nexacro._VoiceRecognitionIntentAnalyzer);
    nexacro._VoiceRecognitionIntentAnalyzer.prototype = _pVoiceRecognitionIntentAnalyzer;

    _pVoiceRecognitionIntentAnalyzer._type_name = "VoiceRecognitionIntentAnalyzer";
    _pVoiceRecognitionIntentAnalyzer._httpRequest = null;
    _pVoiceRecognitionIntentAnalyzer._intent = null;

    _pVoiceRecognitionIntentAnalyzer.url = "";
    _pVoiceRecognitionIntentAnalyzer.async = false;
    _pVoiceRecognitionIntentAnalyzer.value = undefined;

    /*
    _pIntentAnalyzer._event_list = {
        "onload": 1
    };
    */
    _pVoiceRecognitionIntentAnalyzer.set_url = function (v)
    {
        if (this.url != v)
            this.url = v;
    };

    _pVoiceRecognitionIntentAnalyzer.set_async = function (v)
    {
        if (this.async != v)
            this.async = v;
    };

    _pVoiceRecognitionIntentAnalyzer.analyze = function (text, url, async)
    {
        var httpRequest = this._http_request;
        if (!httpRequest)
        {
            httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = this._onresponse;
            httpRequest._intentAnalyzer = this;
        }
        this._intent = null;

        // Call MS LUIS RestAPI
        //var httpRequest = this._http_request;
        var _url = url ? url : this.url;
        if (_url)
            _url = _url + encodeURIComponent(text);
        httpRequest.open("GET", _url, async ? async : this.async);
        httpRequest.send();

        return this._intent;
    };

    _pVoiceRecognitionIntentAnalyzer._onresponse = function ()
    {
        if (this.readyState == 4 && this.status == 200) // OK
        {
            var obj = JSON.parse(this.response);
            if (obj)
            {
                var intents = new Array();
                intents.push(obj.topScoringIntent.intent);
                intents.push(obj.query);
                this._intentAnalyzer.value = intents;
            }
            //return this._intentAnalyzer.on_fire_extendedcommand();
        }
    };


}
