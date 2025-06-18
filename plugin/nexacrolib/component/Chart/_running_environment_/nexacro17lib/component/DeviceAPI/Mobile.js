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

if (!nexacro.Device)
{  
    nexacro.DeviceI = function ()
    {
        this._userCreatedObj = {};
        this.curDevice = 0;
        this.isphone = 0;
        this._is_hybrid = true;
    };
		
	var _pDeviceI = nexacro.DeviceI.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.DeviceI);	
	_pDeviceI._type_name = "Device";
	_pDeviceI.setup = function () { };
	_pDeviceI.execiOS = function () { };
	
	_pDeviceI.exec = function(method){};		
	_pDeviceI.makeID = function () { };
	_pDeviceI.runCallback = function (sid, sfunc, params) { };
	_pDeviceI.on_created = function () { };
	_pDeviceI._isHybrid = function () { };

	_pDeviceI.publicNumCheck = function () { };
	_pDeviceI.paramck_folderName = function (strName) { };
	_pDeviceI.publicNumCheck_Sms = function () { };
	_pDeviceI.pramck_makeCall = function (strPhoneNumber, bAutoDialing) { };
	_pDeviceI.paramck_play = function (strFilePath) { };
	_pDeviceI.paramck_phoneNumber = function (strPhoneNumber) { };
	_pDeviceI.paramck_message = function (strMessage) { };
	_pDeviceI.paramck_sendMessage = function (strPhoneNumber, strMessage) { };
	_pDeviceI.paramck_deleteMessage = function (id) { };
	_pDeviceI.paramck_AudioLoad = function (strFilePath) { };
	_pDeviceI.paramck_isReachable = function (strUrl) { };
	_pDeviceI.paramck_watchStart = function (strTime) { };
	_pDeviceI.parmack_Geolocation = function (nAccuracy, nTimeout, method) { };
	_pDeviceI.paramck_vibstartpos = function (v) { };
	_pDeviceI.paramck_vibrepeatcount = function (v) { };
	_pDeviceI.paramck_vibpattern = function (obj) { };
	_pDeviceI.paramck_accuracy = function (v) { };
	_pDeviceI.parmack_AccelgetCurrentPosition = function (nAccuracy) { };
	_pDeviceI.pramck_AccelwatchStart = function (nIntervalTime, nAccuracy) { };
	_pDeviceI.pramck_virtualproperty = function (property) { };
	_pDeviceI.pramck_asyncOpen = function (strFileName, nOptions) { };
	_pDeviceI.pramck_asyncRead = function (nLength) { };
	_pDeviceI.pramck_asyncReadLine = function (strDelimeter) { };
	_pDeviceI.paramck_asyncSeek = function (nOffset, nOption) { };
	_pDeviceI.pramck_asyncDelete = function (strFilePath) { };
	_pDeviceI.pramck_asyncIsExist = function (strPath) { };
	_pDeviceI.pramck_asyncGetFileList = function (strPath, strSearchExpr, constOption) { };
	_pDeviceI.pramck_filedialog_defaultextension = function (property) { };
	_pDeviceI.pramck_filedialog_filter = function (property) { };
	_pDeviceI.pramck_filedialog_numbercheck = function (property) { };
	_pDeviceI.pramck_filedialogasyncOpen = function (strTitle, constOpenMode, strInitialPath, strFileName) { };
	_pDeviceI.pramck_contactString = function (strProperty) { };
	_pDeviceI.isConvertDateToString = function (dateString) { };
	_pDeviceI.isValidDate = function (argDate) { };
	_pDeviceI.pramk_ContactFieldArray = function (argContactFieldArr) { };
	_pDeviceI.pramk_ContactIMArray = function (argContactIMArr) { };
	_pDeviceI.pramk_ContactAddressArray = function (argContactAddressArr) { };
	_pDeviceI.pramk_ContactOrganizationArray = function (argContactOrganizationArr) { };
	_pDeviceI.pramk_ContactPhotoArray = function (argContactPhotoArr) { };
	_pDeviceI.parseDateToInt = function (strDate) { };
	_pDeviceI.paramck_takePicture = function (nQuality, nWidth, nHeight, strEncodingType, strGetType) { };
	_pDeviceI.paramck_busytimeout = function (timout) { };
	_pDeviceI.paramck_datasource = function (datasrc) { };
	_pDeviceI.paramck_asyncOpen = function (strDataSource, constOpenFlag) { };
	_pDeviceI.paramck_query = function (db_query) { };
	_pDeviceI.paramck_paramck_ldbconnection = function (objconnection) { };
	_pDeviceI.paramck_asyncExecuteQuery = function (db_query) { };
	_pDeviceI.paramck_ImagePicker_asyncOpen = function (nQuality, nWidth, nHeight, strEncodingType, strGetType) { };
	_pDeviceI.encodeString = function (source) { };
	_pDeviceI.DatasetToJSONString = function (dataset) { };
	_pDeviceI.DatasetToJSONObject = function (dataset) { };
	_pDeviceI.JSONObjectToDataset = function (jsonObject, dataset) { };
	_pDeviceI.JSONStringToDataset = function (jsonString, dataset) { };
	_pDeviceI.DatasetToJSONString2 = function (dataset) { };
	_pDeviceI.DatasetToJSONObject2 = function (dataset) { };
	_pDeviceI.JSONObjectToDataset2 = function (jsonObject, dataset) { };
	_pDeviceI.JSONStringToDataset2 = function (jsonString, dataset) { };
	_pDeviceI.exit = function (useCache) { };
	delete _pDeviceI;

	nexacro.Device = new nexacro.DeviceI();
	
	if (nexacro.Device._isHybrid())
	{
	    if (window.system)
	    {
	        if (nexacro.Device.curDevice == DeviceType.IOS)
	        {
			  // iOS System을 위해 init 부분 필요.
	            nexacro.System.prototype();

				// iOS 의 경우 callback형태로 데이터를 받기위해 필요.
	            nexacro.System.getSystemInfo();
			}
		}
	}
	
	if (nexacro.System)
	{   
	    nexacro.System.getSystemInfo = function () { };
	    nexacro.System.recvPhoneInfo = function (params) { };
	    nexacro.System.setOrientation = function (nOrientation) { };
	}
}
//==============================================================================
// 1. Phone
//==============================================================================

//==============================================================================
// nexacro.Phone
//==============================================================================

if (!nexacro.Phone)
{
    nexacro.Phone = function (name, parent)
    {
        this.id = this.name = name || null;

        if (parent)
            this.parent = parent;

        this._id = nexacro.Device.makeID();
        nexacro.Device._userCreatedObj[this._id] = this;

        // TODO : property setter,getter?
        //this.phonenumber = "";
        //this.bAutoDialing = false;

        var params = '""';
        var jsonstr;

        jsonstr = '{"id":' + this._id + ', "div":"Call", "method":"constructor", "params":' + params + '}';
        nexacro.Device.exec(jsonstr);
    };

    var _pPhone = nexacro.Phone.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.Phone);
    _pPhone._type_name = "Phone";

    _pPhone.destroy = function ()
    {
        var params = '""';
        var jsonstr;
        
        delete nexacro.Device._userCreatedObj[this._id];

        jsonstr = '{"id":' + this._id + ', "div":"Call", "method":"destroy", "params":' + params + '}';
        nexacro.Device.exec(jsonstr);

        return true;
    };
    
    _pPhone.on_created = function () { };

    //===============================================================
    // nexacro.Phone : Properties
    //=============================================================== 

    //===============================================================
    // nexacro.Phone : Methods
    //===============================================================
    _pPhone.makeCall = function (strPhoneNumber, bAutoDialing)
    {
        // parameter 
        // strPhoneNumber : 상대방 전화번호, 
        // bAutoDialing : makecall 호출시 바로 발신이 되도록 할지 다이얼러 화면으로 넘어갈지 결정. default는 false
        if (bAutoDialing == "undefined" || bAutoDialing == null)
        {
            this.bAutoDialing = false;
        }
        else
        {
            this.bAutoDialing = bAutoDialing;
        }

        var pcheck = nexacro.Device.pramck_makeCall(strPhoneNumber, this.bAutoDialing);
        if (pcheck == true) //파라미터 체크
        {
            var renamephonNumber = strPhoneNumber;
            renamephonNumber = renamephonNumber.split("-").join("");

            // iOS webView 에서 전화걸기를 실행 할 경우 숫자 3자리 미만은 전화 연결이 이루어지지 않음. 따라서 파라메타 에러 처리로 적용함. 2012.3.15 pg
            // Android 도 같은 동작을 하도록 통일 (설계 지침) 2012.3.21
            var tempPhoneNumber = renamephonNumber.split("+").join("");
            if (tempPhoneNumber.length < 3)
            {
                return false;
            }

            var jsonstr;
            if (nexacro.Device.curDevice == DeviceType.ANDROID)
            {
                var params = '{"telNo":"' + renamephonNumber + '", "bAuto":"' + this.bAutoDialing + '"}';
                jsonstr = '{"id":' + this._id + ', "div":"Call", "method":"sendCall", "params":' + params + '}';
                nexacro.Device.exec(jsonstr);
            }
            else
            {
                // hjshin : ajax pc 버전 브라우저 동작시 동작하면 안되므로 처리함.
                if ((typeof nexacro.Device._isHybrid() == "undefined") || nexacro.Device._isHybrid() == false)
                    return true;

				jsonstr = "";
				jsonstr = "tel://" + renamephonNumber;
				nexacro.Device.exec(jsonstr);
            }
            return true;
        }
        else
        {
            // System은 error handler를 사용할 수 없으므로 false 를 리턴한다.             
            return false;
        }
    };

    delete _pPhone;
}

//==============================================================================
// 2. Sms
//==============================================================================
//==============================================================================
// nexacro.Sms
// 단문 메시지 서비스(SMS)를 지원하는 Object로서 문자메시지 송수신을 처리한다.
//==============================================================================
if (!nexacro.Sms)
{
    nexacro.Sms = function (name, parent)
    {
        this.id = this.name = name || null;

        if (parent)
            this.parent = parent;

		this._id = nexacro.Device.makeID();
		nexacro.Device._userCreatedObj[this._id] = this;

		this._refform = parent;
		
		this.phonenumber = "";												// 보낼 전화번호
		this.message = "";													// 보낼 메세지
		
		this.enableevent = true;
		this._is_alive = true;
		
		this._event_list =
        {
		    "cansendmessage":1, "onsendmessage":1, "onrecvmessage":1, 
		    "ondeletemessage":1,  "onerror":1,  "onreadmessagelist":1
	    };	
	    
        this.cansendmessage = null;
        this.onsendmessage = null;
        this.onrecvmessage = null;
        this.ondeletemessage = null;
        this.onerror = null;
        this.onreadmessagelist = null;
	  
		var params = '""';
		var jsonstr;
		
		jsonstr = '{"id":'+this._id+', "div":"Sms", "method":"constructor", "params":'+params+'}'; 
        nexacro.Device.exec(jsonstr);		
	};

	var _pSms = nexacro.Sms.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.Sms);	
	_pSms._type_name = "Sms";
	
	_pSms.destroy = function ()
	{
	    var params = '""';
	    var jsonstr;
	    this._is_alive = false;

	    delete nexacro.Device._userCreatedObj[this._id];

	    jsonstr = '{"id":' + this._id + ', "div":"Sms", "method":"destroy", "params":' + params + '}';
	    nexacro.Device.exec(jsonstr);

	    return true;
	};
	
	_pSms.on_created = function () { };
		
	_pSms._getReferenceContext = function() 
	{
        return this._refform;
	};		
		
    //===============================================================
    // nexacro.Sms : Properties
    //===============================================================
	_pSms.set_phonenumber = function (v)
	{
	    if (this.paramck_phoneNumber(v) == true)
	    {
	        this.phonenumber = v;
	        return true;
	    }
	    return false;
	};
    
	_pSms.set_message = function (v)
	{
	    if (this.paramck_message(v) == true)
	    {
	        this.message = v;
	        return true;
	    }
	    return false;
	};
    
    //===============================================================
    // nexacro.Sms : Methods
    //===============================================================
	_pSms.sendMessage = function (strNumber, strMessage)
	{
	    if (nexacro.Device.curDevice == DeviceType.IOS)
	    {
			// iPad 지원 불가 
	        if (nexacro._SystemType == "ipad")
	        {
				this.sendUnsupportedFunc();		
				return false;	
			}
		}
				
		var objSmsMessage = new nexacro.SmsMessage("SmsMessage");
		objSmsMessage.set_smsid("-1");

		if (strNumber == null && strMessage == null)
		{
			objSmsMessage.set_phonenumber(this.phonenumber || "");
			objSmsMessage.set_message(this.message || "");
		} 
		else if (strNumber && strMessage)
		{
		    if (typeof (strNumber) == "undefined")
		    {
		        strNumber = "";
		    }
		    if (typeof (strMessage) == "undefined")
		    {
		        strMessage = "";
		    }

		    if (!objSmsMessage.set_phonenumber(strNumber))
		    {
				return false;
			}
	
			objSmsMessage.set_message(strMessage);
		} 
		else if (strNumber != null || strMessage != null)
		{
		    if (typeof (strNumber) == "undefined")
		    {
		        strNumber = "";
		    }
		    if (!objSmsMessage.set_phonenumber(strNumber))
		    {
					return false;
			}
				
			objSmsMessage.set_message(strMessage || "");
		} 
		else
		{		
			return false;
		}

		var cansendFlag = this._cansendmessage(objSmsMessage.phonenumber, objSmsMessage.message);
		if (cansendFlag != null)
		{
		    //_cansendmessage 핸들러 등록이 있으면 true false 값 , 없을 경우에 default null
		    if (cansendFlag.toString() == "false")
		    {
				return false;
			}
		}

		if (this.paramck_sendMessage(objSmsMessage.phonenumber, objSmsMessage.message))
		{
			var params;
			var jsonstr;
			var renamephonNumber = objSmsMessage.phonenumber.split("+").join("");
			
            if (nexacro.Device.curDevice == DeviceType.ANDROID || nexacro.Device.curDevice == DeviceType.WINDOWS)
			{
                params = '{"number":"'+renamephonNumber+'", "msg":"'+ objSmsMessage.message+'"}';	                 
			}
			else
			{
				params = '{  "number":"' + objSmsMessage.phonenumber;
	        	params+= '", "msg":"' + objSmsMessage.message.replace(/\n/g, "_NEWLINE_");
	        	params+= '"}'; 	        	
			}

            jsonstr = '{"id":' + this._id + ', "windowhandle":"' + this.parent._getWindow().handle + '", "div":"Sms", "method":"sendMessage", "params":' + params + '}';
			nexacro.Device.exec(jsonstr);

			return true;
		}
		else
		{
			return false;
		}
	};

	_pSms.recvStart = function()
	{
        if (nexacro.Device.curDevice == DeviceType.ANDROID || nexacro.Device.curDevice == DeviceType.WINDOWS)
	    {
    	    var params = '""';
            var jsonstr = '{"id":' + this._id + ', "windowhandle":"' + this.parent._getWindow().handle + '", "div":"Sms", "method":"recvStart", "params":' + params + '}';
            nexacro.Device.exec(jsonstr);
	    }
	    else
	    {
    	    this.sendUnsupportedFunc();
        }
	};

	_pSms.recvStop = function()
	{
        if (nexacro.Device.curDevice == DeviceType.ANDROID || nexacro.Device.curDevice == DeviceType.WINDOWS)
	    {
			var params = '""';	 
            var jsonstr = '{"id":' + this._id + ', "windowhandle":"' + this.parent._getWindow().handle + '", "div":"Sms", "method":"recvStop", "params":' + params + '}';
			nexacro.Device.exec(jsonstr);
	    }
	    else
	    {
			this.sendUnsupportedFunc();
		}
	};    
	
	_pSms.readMessageList = function()
	{
        if (nexacro.Device.curDevice == DeviceType.ANDROID || nexacro.Device.curDevice == DeviceType.WINDOWS)
	    {
			var params = '""';	 
            var jsonstr = '{"id":' + this._id + ', "windowhandle":"' + this.parent._getWindow().handle + '", "div":"Sms", "method":"readMessageList", "params":' + params + '}';
			nexacro.Device.exec(jsonstr);
	    }
	    else
	    {
			this.sendUnsupportedFunc();
		}
	};
	
	_pSms.deleteMessage = function (nSmsid)
	{
	    if (nexacro.Device.curDevice == DeviceType.IOS)
	    {
			// iOS 미지원 기능.
			this.sendUnsupportedFunc();
			return false;
		}
				
	    this.index = nSmsid;
		if (this.paramck_deleteMessage(this.index))
		{
            if (nexacro.Device.curDevice == DeviceType.ANDROID || nexacro.Device.curDevice == DeviceType.WINDOWS)
		    {
		        this.id = nSmsid;
				var params = '{"id":"'+ this.id +'"}'; 
                var jsonstr = '{"id":' + this._id + ', "windowhandle":"' + this.parent._getWindow().handle + '", "div":"Sms", "method":"deleteMessage", "params":' + params + '}';
				nexacro.Device.exec(jsonstr);
			}
            return true;
		}
		else
		{
            return false;
		}
	};
	
    //===============================================================
    // nexacro.Sms : Event Handler
    //===============================================================
	_pSms._onsendmessage = function(objData)
	{
        var e;
        if (nexacro.Device.curDevice == DeviceType.WINDOWS && typeof objData == "string")
        {
            //trace("{{_pSms._onsendmessage[objData=" + objData + ", typeof objData=" + typeof objData + "]}}");
            var jsonObjData = JSON.parse(objData);
            if (jsonObjData)
            {
                e = new nexacro.SmsEventInfo("onsendmessage", jsonObjData.smsid, jsonObjData.phonenumber, jsonObjData.message);
            }
        }
		else if (nexacro.Device.curDevice == DeviceType.ANDROID)
		{			
			e = new nexacro.SmsEventInfo("onsendmessage", objData.smsid, objData.phonenumber, objData.message);
		}
		else
		{			
			e = new nexacro.SmsEventInfo("onsendmessage", -1, objData.phonenumber, objData.message);
		}		
		this._fire_onsendmessage(this, e);
	};

	_pSms._fire_onsendmessage = function(objSms, eSmsEventInfo)
	{
	    if (this.onsendmessage && this.onsendmessage._has_handlers)
	    {
			return this.onsendmessage._fireEvent(this, eSmsEventInfo);
		}
		return true;
	};

	_pSms._onrecvmessage = function(objData)
	{
        var e;
        if (nexacro.Device.curDevice == DeviceType.WINDOWS && typeof objData == "string")
        {
            //trace("{{_pSms._onrecvmessage[objData=" + objData + ", typeof objData=" + typeof objData + "]}}");
            var jsonObjData = JSON.parse(objData);
            if (jsonObjData)
            {
                e = new nexacro.SmsEventInfo("onrecvmessage", jsonObjData.smsid, jsonObjData.phonenumber, jsonObjData.message);
            }
        }
        else
        {
            e = new nexacro.SmsEventInfo("onrecvmessage", objData.smsid, objData.phonenumber, objData.message);
        }
		this._fire_onrecvmessage(this, e);
	};

	_pSms._fire_onrecvmessage = function(objSms, eSmsEventInfo)
	{
	    if (this.onrecvmessage && this.onrecvmessage._has_handlers)
	    {
			return this.onrecvmessage._fireEvent(this, eSmsEventInfo);
		}
		return true;
	};
	
	//안드로이드 전용 SMS 수신 , 발신 조회시 발생하는 event
	_pSms._onreadmessagelist = function(objData)
    {
        var arr, jsonOb, temp;
        var i;
        var e;

        if (nexacro.Device.curDevice == DeviceType.WINDOWS && typeof objData == "string")
        {
            //trace("{{_pSms._onreadmessagelist[objData=" + objData + ", typeof objData=" + typeof objData + "]}}");
            var jsonObjData = JSON.parse(objData);
            if (jsonObjData)
            {
                arr = new Array(jsonObjData.length);
                for (i = 0; i < jsonObjData.length; i++)
                {
                    jsonOb = nexacro._executeGlobalEvalStr("(" + jsonObjData[i] + ")");
			        temp = new nexacro.SmsMessage(jsonOb.id, jsonOb.phonenumber, jsonOb.message, jsonOb.type, jsonOb.date);
			        arr[i] = temp;
                    trace("\tSmsMessage[" + i + " : " + arr[i] + "]");
		        }
		        e = new nexacro.SmsMessageListEventInfo(arr);
		        this._fire_onreadmessagelist(this, e);
            }
        }
        else
        {
            arr = new Array(objData.length);
            for (i = 0; i < objData.length; i++)
            {
                jsonOb = nexacro._executeGlobalEvalStr("(" + objData[i] + ")");
                temp = new nexacro.SmsMessage(jsonOb.id, jsonOb.phonenumber, jsonOb.message, jsonOb.type, jsonOb.date);
                arr[i] = temp;
            }
            e = new nexacro.SmsMessageListEventInfo(arr);
            this._fire_onreadmessagelist(this, e);
        }
	};

	_pSms._fire_onreadmessagelist = function(objSms, eSmsMsgList)
	{
	    if (this.onreadmessagelist && this.onreadmessagelist._has_handlers)
	    {
			return this.onreadmessagelist._fireEvent(this, eSmsMsgList);
		}
		return true;
	};

	//안드로이드 전용 SMS 삭제시 발생하는  event
	_pSms._ondeletemessage = function(objData)
    {
        var e;
        if (nexacro.Device.curDevice == DeviceType.WINDOWS && typeof objData == "string")
        {
            //trace("{{_pSms._ondeletemessage[objData=" + objData + ", typeof objData=" + typeof objData + "]}}");
            var jsonObjData = JSON.parse(objData);
            if (jsonObjData)
            {
                e = new nexacro.SmsEventInfo("ondeletemessage", jsonObjData.smsid, jsonObjData.phonenumber, jsonObjData.message);
            }
        }
        else
        {
            e = new nexacro.SmsEventInfo("ondeletemessage", objData.smsid, objData.phonenumber, objData.message);
        }
		this._fire_ondeletemessage(this, e);
	};

	_pSms._fire_ondeletemessage = function(objSms, eSmsEventInfo)
	{
	    if (this.ondeletemessage && this.ondeletemessage._has_handlers)
	    {
			return this.ondeletemessage._fireEvent(this, eSmsEventInfo);
		}
		return true;
	};

	_pSms._cansendmessage = function(strPhoneNumber, strMessage)
	{
		var e;
				
		if (nexacro.Device.curDevice == DeviceType.ANDROID)
		{   
		    var productType = nexacro.__getMobileProductType();
		    if (productType)
		    {
		        if (productType.toLowerCase() == "shw-m380s") {
		            // Android 미지원 기종.
		            this.sendUnsupportedFunc();
		            return false;
		        }
			}
            e = new nexacro.SmsEventInfo("cansendmessage", "-1", strPhoneNumber, strMessage);
        }
        else if (nexacro.Device.curDevice == DeviceType.WINDOWS)
        {
			e = new nexacro.SmsEventInfo("cansendmessage", "-1", strPhoneNumber, strMessage);
		}
		else
		{		
			// iPad 지원 불가 
		    if (nexacro._SystemType == "ipad")
		    {
				this.sendUnsupportedFunc();		
				return false;	
			}
			e = new nexacro.SmsEventInfo("cansendmessage", -1, strPhoneNumber, strMessage);
		}

		return this._fire_cansendmessage(this, e);
	};

	_pSms._fire_cansendmessage = function(objSms, eSmsEventInfo)
	{
	    if (this.cansendmessage && this.cansendmessage._has_handlers)
	    {
			return this.cansendmessage._fireEvent(this, eSmsEventInfo);
		}
		return true;
	};
	
	_pSms._onerror = function(objData)
	{
	    var e;
        if (nexacro.Device.curDevice == DeviceType.WINDOWS && typeof objData == "string")
        {
            //trace("{{_pSms._onerror[objData=" + objData + ", typeof objData=" + typeof objData + "]}}");
            var jsonObjData = JSON.parse(objData);
            if (jsonObjData)
            {
                e = new nexacro.SmsErrorEventInfo("onerror", jsonObjData.smsid, jsonObjData.phonenumber, jsonObjData.message, jsonObjData.errorcode, jsonObjData.errormsg);
            }
        }
	    else if (nexacro.Device.curDevice == DeviceType.ANDROID)
	    {			
			e = new nexacro.SmsErrorEventInfo("onerror", objData.smsid, objData.phonenumber, objData.message, objData.errorcode, objData.errormsg);
	    }
	    else
	    {
			objSmsMessage.set_smsid(-1);
			e = new nexacro.SmsErrorEventInfo("onerror", objData.smsid, objData.phonenumber, objData.message, objData.errorcode, objData.errormsg);
		}
		this._fire_onerror(this, e);
	};

	_pSms._fire_onerror = function(objSms, SmsErrorEventInfo)
	{
	    if (this.onerror && this.onerror._has_handlers)
	    {
			return this.onerror._fireEvent(this, SmsErrorEventInfo);
		}
		return true;
	};
	
    //===============================================================
    // nexacro.Sms : Logical Part
    //===============================================================
	_pSms.sendUnsupportedFunc = function ()
	{
	    var smsobj = this;

	    nexacro._OnceCallbackTimer.callonce(this, function ()
	    {
	        var e = new nexacro.SmsErrorEventInfo("onerror", "-1", smsobj.phonenumber, smsobj.message, "2002", "The phone does not support");
	        this._fire_onerror(this, e);
	    }, 20);

	    return true;
	};

	_pSms.paramck_phoneNumber = function (strPhoneNumber)
	{
	    if (strPhoneNumber == null || typeof (strPhoneNumber) == "undefined")
	    {
	        return false;
	    }
	    else
	    {
	        strPhoneNumber = strPhoneNumber.toString();
	    }

	    // 아래 형태 문자열은 실패 처리 한다. 2012.02.15 pg
	    // e-mail 전송 추가 [REQ 23684]
	    /*
        if (strPhoneNumber.indexOf(".")  != -1){  return false;   }
        if (strPhoneNumber.indexOf("--") != -1){  return false;   }
        if (strPhoneNumber.indexOf("++") != -1){  return false;   }
        if (strPhoneNumber.indexOf("+-") != -1){  return false;   }
        if (strPhoneNumber.indexOf("-+") != -1){  return false;   }
	     */
	    var number = "";
	    try
	    {
	        number = strPhoneNumber.split("+").join("");
	        number = number.split("-").join("");
	    }
	    catch (e)
	    {
	        return false;
	    }

	    if (number.length < 3)
	    {
	        return false;
	    }

	    if (!this.publicNumCheck_Sms(number))
	    {
	        return false;
	    }
	    return true;
	};

	_pSms.paramck_message = function (strMessage)
	{
	    if (strMessage == null || typeof (strMessage) == "undefined" || typeof (strMessage) != "string")
	    {
	        return false;
	    }
	    return true;
	};
	
	_pSms.paramck_sendMessage = function (strPhoneNumber, strMessage)
	{
	    if (strPhoneNumber == null || strMessage == null || typeof (strPhoneNumber) == "undefined" || typeof (strMessage) == "undefined"
		   || typeof (strMessage) != "string")
	    {
	        return false;
	    }
	    else
	    {
	        strPhoneNumber = strPhoneNumber.toString();
	    }

        var number;
	    try
	    {
	        number = "";
	        number = strPhoneNumber.split("+").join("");
	        number = number.split("-").join("");
	    }
	    catch (e)
	    {
	        return false;
	    }

	    if (!this.publicNumCheck_Sms(number))
	    {
	        return false;
	    }

	    return true;
	};

	_pSms.paramck_deleteMessage = function (id)
	{
	    if (id == null || typeof (id) == "undefined")
	    {
	        return false;
	    }

	    if (!nexacro.Device.publicNumCheck(id))
	    {
	        return false;
	    }

	    if (id < 1)
	    {
	        return false;
	    }

	    return true;
	};

    //for only sms send, multi send sms 
	_pSms.publicNumCheck_Sms = function (v)
	{
		var strlength;
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

	    var numberss;
	    try
	    {
	        numberss = Number(v.toString());
	    }
	    catch (e)
	    {
	        return false;
	    }

	    return true;
	};

	delete _pSms;
}

//==============================================================================
// nexacro.SmsMessageListEventInfo
// Sms 수신 / 발신, 문자메시지를 가지고 있다.
//==============================================================================
if (!nexacro.SmsMessageListEventInfo)
{
    nexacro.SmsMessageListEventInfo = function(obj)
    {
		this.eventid = "onreadmessagelist";
		this.smsmessages = obj;										
	};
    var _pSmsMsgList = nexacro.SmsMessageListEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.SmsMessageListEventInfo);
 	_pSmsMsgList._type_name ="SmsMessageListEventInfo";
	
 	delete _pSmsMsgList;
}

//==============================================================================
// nexacro.SmsMessage
// Sms에서 사용될 전화번호, 문자메시지를 가지고 있다.
//==============================================================================
if (!nexacro.SmsMessage)
{
    nexacro.SmsMessage = function(_id, _number, _message, _type, _data)
    {
		this.smsid = _id;		
		this.phonenumber = _number;	// 송신전화번호
		this.message = _message;		// 송신메시지
		this.type = _type;
		this.date = _data;
	};
    var _pSmsMessage = nexacro.SmsMessage.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.SmsMessage);
 	_pSmsMessage._type_name = "SmsMessage";
 	
    //===============================================================
    // nexacro.SmsMessage : properties
    //===============================================================
 	_pSmsMessage.set_phonenumber = function (v)
 	{
 	    if (this.paramck_phoneNumber(v) == true)
 	    {
 	        this.phonenumber = v;
 	        return true;
 	    }
 	    return false;
 	};
 	
 	_pSmsMessage.set_message = function (v)
 	{
 	    if (this.paramck_message(v) == true)
 	    {
 	        this.message = v;
 	        return true;
 	    }
 	    return false;
 	};

 	_pSmsMessage.set_smsid = function (v)
 	{
 	    if (typeof (v) == "undefined")
 	    {
 	        this.smsid = "";
 	        return true;
 	    }
 	    else if (typeof (v) == "string")
 	    {
 	        this.smsid = Number(v);
 	        return true;
 	    }
 	    else
 	    {
 	        this.smsid = v;
 	        return true;
 	    }
 	    return false;
 	};

 	_pSmsMessage.set_type = function (v)
 	{
 	    if (typeof (v) == "undefined")
 	    {
 	        this.Type = "";
 	        return true;
 	    }
 	    else
 	    {
 	        this.Type = v;
 	        return true;
 	    }
 	    return false;
 	};

 	_pSmsMessage.set_date = function (v)
 	{
 	    if (typeof (v) == "undefined")
 	    {
 	        this.date = "";
 	        return true;
 	    }
 	    else
 	    {
 	        this.date = v;
 	        return true;
 	    }
 	    return false;
 	};

    //===============================================================
    // nexacro.SmsMessage : Logical Part
    //===============================================================
 	_pSmsMessage.paramck_phoneNumber = function (strPhoneNumber)
 	{
 	    if (strPhoneNumber == null || typeof (strPhoneNumber) == "undefined")
 	    {
 	        return false;
 	    }       
 	    else
 	    {
 	        strPhoneNumber = strPhoneNumber.toString();
 	    }

 	    var number = "";
 	    try
 	    {
 	        number = strPhoneNumber.split("+").join("");
 	        number = number.split("-").join("");
 	    }
 	    catch (e)
 	    {
 	        return false;
 	    }

 	    if (number.length < 3)
 	    {
 	        return false;
 	    }

 	    if (!this.publicNumCheck_Sms(number))
 	    {
 	        return false;
 	    }
 	    return true;
 	};
 	
 	_pSmsMessage.paramck_message = function (strMessage)
 	{
 	    if (strMessage == null || typeof (strMessage) == "undefined" || typeof (strMessage) != "string")
 	    {
 	        return false;
 	    }
 	    return true;
 	};

    _pSmsMessage.publicNumCheck_Sms = function (v)
    {
        var strlength;

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
 	        var numberss = Number(v.toString());
 	    }
 	    catch (e)
 	    {
 	        return false;
 	    }

 	    return true;
 	};

 	delete _pSmsMessage;
}

//==============================================================================
// nexacro.SmsMessage
// Sms 송수신시 발생되는 EventInfo Object
//==============================================================================
if (!nexacro.SmsEventInfo)
{
    nexacro.SmsEventInfo = function (strEventId, strSmsId, strPhonenumber, strMessage)
    {
        if (typeof (strSmsId) == "undefined")
        {
            this.smsid = "";
        }
        else if (typeof (strSmsId) == "string")
        {
            // 삭제시 필요한 SmsID
            this.smsid = Number(strSmsId);
        }
        else
        {
            this.smsid = strSmsId;
        }

        this.eventid = strEventId;				// 이벤트ID
        this.phonenumber = strPhonenumber;		// Sms Phone Number

        if (nexacro.Device.curDevice == DeviceType.ANDROID || nexacro.Device.curDevice == DeviceType.WINDOWS)
        {
            this.message = strMessage;												// Sms Message
        }
        else
        {
            this.message = strMessage.replace(/__NEW_LINE__/g, "\n");
        }
    };

    var _pSmsEventInfo = nexacro.SmsEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.SmsEventInfo);
 	_pSmsEventInfo._type_name = "SmsEventInfo";
	
 	delete _pSmsEventInfo;
}

//==============================================================================
// nexacro.SmsErrorEventInfo
// Sms 송수신시 처리에 실패했을 때 발생되는 이벤트의 EventInfo Object
//==============================================================================
if (!nexacro.SmsErrorEventInfo)
{
    nexacro.SmsErrorEventInfo = function (strEventId, strSmsId, strPhonenumber, strMessage, intErrorCode, strErrorMsg)
    {
        if (typeof (strSmsId) == "undefined")
        {
            this.smsid = "";
        }
        else
        {
            this.smsid = strSmsId; // 삭제시 필요한 SmsID
        }
        this.eventid = strEventId;												// 이벤트ID
        this.smsid = strSmsId;													// sms id
        this.phonenumber = strPhonenumber;										// 전화번호

        if (nexacro.Device.curDevice == DeviceType.ANDROID || nexacro.Device.curDevice == DeviceType.WINDOWS)
        {
            this.message = strMessage;												// 메시지
        }
        else
        {
            this.message = strMessage.replace(/__NEW_LINE__/g, "\n");
        }
		this.errortype = "ObjectError";
		this.statuscode = intErrorCode;											// 오류코드 : integer 로 된 errorcode (iOS/Android에서 발생하는 errorcode를 그대로 사용)
        this.errormsg = strErrorMsg;											// 오류메세지 : string으로 된 errormsg (iOS/Android에서 발생하는 error message를 그대로 사용)
    };

    var _pSmsErrorEventInfo = nexacro.SmsErrorEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.SmsErrorEventInfo);
 	_pSmsErrorEventInfo._type_name = "SmsErrorEventInfo";
	
 	delete _pSmsErrorEventInfo;
}

//==============================================================================
// 03. AudioPlayer
//==============================================================================

//==============================================================================
// nexacro.AudioPlayer
// 모바일 기기의 오디오 파일을 재생한다.
//==============================================================================
if (!nexacro.AudioPlayer)
{
    nexacro.AudioPlayer = function (name, parent)
    {
        this.id = this.name = name || null;
        if (parent)
            this.parent = parent;

        this._id = nexacro.Device.makeID();
        nexacro.Device._userCreatedObj[this._id] = this;
        this._refform = parent;
        
	    // status manage
	    this.bload = false;
	    this.bplay = false;
	    this.bpaused = false;
	    this.enableevent = true;
        this._is_alive = true; 
        
		this.url = "";													// audio file path, local 또는 http 경로
		this.duration = 0.0;                                            // audio file의 전체 재생 시간 (단위:ms)
		this.currentpos = 0.0;											// 현재 재생 시간 (단위: ms)
		this.repeatcount = 1;											// 반복 재생시 회수 지정 (0:회수지정없음.무한반복)
		this.startpos = -1;											    // 구간반복시 구간시작 지점 설정 (단위 : seconds)
		this.stoppos = -1; 											    // 구간반복시 구간끝 지점 설정	(단위 : seconds)
		this.volume = -1;												// 볼륨 (min 0 ~ max 1 , Default : -1)		
		this.pan = -1;													// pan (min 0 ~ max 1 , Default : -1)
		
		this._event_list =
        {
		    "onload":1, "onplay":1, "onplaying":1, 
		    "onstop":1,  "onerror":1,  "onmovepos":1
	    };	
	    
        this.onload = null;
        this.onplay = null;
        this.onplaying = null;
        this.onstop = null;
        this.onerror = null;
        this.onmovepos = null;
	  
        var params = '""';
        var jsonstr = '{"id":' + this._id + ', "div":"Sound", "method":"constructor", "params":' + params + '}';
        nexacro.Device.exec(jsonstr);
    };

    var _pAudioPlayer = nexacro.AudioPlayer.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.AudioPlayer);
	_pAudioPlayer._type_name = "AudioPlayer";
   
	_pAudioPlayer.destroy = function ()
	{
	    var params = '""';
	    var jsonstr;
	    this._is_alive = false;

	    delete nexacro.Device._userCreatedObj[this._id];

	    jsonstr = '{"id":' + this._id + ', "div":"Sound", "method":"destroy", "params":' + params + '}';
	    nexacro.Device.exec(jsonstr);

	    return true;
	};
		
	_pAudioPlayer.on_created = function () { };
	
	_pAudioPlayer._getReferenceContext = function ()
	{
	    return this._refform;
	};
	
	// iOS system volume 변경시 setting 을 위한 func.
	_pAudioPlayer.setSystemVolume = function (v)
	{
	    this.volume = v;
	};

	// readonly 처리 2012.02.15 by pg
	_pAudioPlayer.set_duration = function (v) { };
	_pAudioPlayer.set_currentpos = function (v) { };

    //===============================================================
    // nexacro.AudioPlayer : Properties
    //===============================================================
	_pAudioPlayer.set_repeatcount = function (v)
	{
	    if (typeof (v) == "undefined" || v == null)
	    {
	        return false;
	    }
	    else
	    {
	        if (nexacro.Device.publicNumCheck(v))
	        {
	            if (v >= 0)
	            {
	                this.repeatcount = v;
	            }
	            else
	            {
                   return false;
	            }
	        }   
	        else
	        {
	            return false;
	        }
	    }
	    return true;
	};

	_pAudioPlayer.set_startpos = function (v)
	{
	    if (typeof (v) == "undefined" || v == null)
	    {
	        return false;
	    }
	    else
	    {
	        if ((v == -1) || (0 <= v && v <= this.duration))
	        {
	            this.startpos = v;
	        }
	        else
	        {
	            return false;
	        }
	    }
	    return true;
	};

	_pAudioPlayer.set_stoppos = function (v)
	{
	    if (typeof (v) == "undefined" || v == null)
	    {
	        return false;
	    }
	    else
	    {
	        if ((v == -1) || (0 <= v && v <= this.duration))
	        {
	            this.stoppos = v;
	        }
	        else
	        {
	            return false;
	        }
	    }
	    return true;
	};

	_pAudioPlayer.set_volume = function (v)
	{
	    if (typeof (v) == "undefined" || v == null)
	    {
	        return false;
	    }
	    else
	    {
	        if ((v >= 0.0 && v <= 1.0) || v == -1)
	        {
	            this.volume = v;
	        }
	        else
	        {
	            return false;
	        }
	    }
	    return true;
	};

	_pAudioPlayer.set_pan = function (v)
	{
	    if (typeof (v) == "undefined" || v == null)
	    {
	        return false;
	    }
	    else
	    {
	        if ((v >= 0.0 && v <= 1.0) || v == -1)
	        {
	            this.pan = v;
	        }
	        else
	        {
	            return false;
	        }
	    }
	    return true;
	};
    
	_pAudioPlayer.set_url = function (v)
	{
	    var pcheck = this.paramck_AudioLoad(v); 
	    if (pcheck == true)
	    {
	        this.url = v;
	        return true;
	    }
	    else
	    {
	        return false;
	    }
	};
 	
    //===============================================================
    // nexacro.AudioPlayer : Methods
    //===============================================================
    _pAudioPlayer.load = function(strUrl)
    {
        this.startpos = -1;
        this.stoppos = -1;

        var pcheck = this.paramck_AudioLoad(strUrl); 
		if (pcheck == true)
		{
            this.url = strUrl;
            var params;
            var rootPathCheck, _filecache;

			if (nexacro.Device.curDevice == DeviceType.ANDROID)
			{
				var EnvironmentPath = "";
				var androidFilePath = "";
				rootPathCheck = strUrl.substring(0,9);
				
				if (rootPathCheck.toLowerCase() == "%userapp%")
				{
					EnvironmentPath = 1;
					androidFilePath = strUrl.substring(9, strUrl.length);
				}
				else if (rootPathCheck.toLowerCase() == "%sd_card%")
				{
					EnvironmentPath = 2;
					androidFilePath = strUrl.substring(9, strUrl.length);
				}
				else if (rootPathCheck.substring(0, 7) == "http://")
				{
					androidFilePath = strUrl;
					EnvironmentPath = "";
				}
				else
				{
					_filecache = nexacro._getFileCache(strUrl);
					if (null != _filecache)
					{
					  EnvironmentPath = 3;
					  androidFilePath = _filecache;
					}
					else
					{
					    androidFilePath = strUrl;
					}
				}
				params = '{"target":"'+androidFilePath+'", "EnvironmentPath":"'+EnvironmentPath+'"}';
			}
			else
			{
                var iosfilepath = "";                
				rootPathCheck = strUrl.substring(0,9);
            
				if (rootPathCheck.toLowerCase() == "%userapp%")
				{
					iosfilepath = "_userapp_" + strUrl.substring(9,strUrl.length);
				}
				else if (rootPathCheck.substring(0, 7) == "http://")
				{
					iosfilepath = strUrl;
				}
				else
				{
					_filecache = nexacro._getFileCache(strUrl);
					if (null != _filecache)
					{
	            		iosfilepath = "_userapp_" + _filecache;
					}
					else
					{
					    iosfilepath = strUrl;
					}
                }
                params = '{"target":"' + iosfilepath + '"}';
			}
			var jsonstr = '{"id":' + this._id + ', "div":"Sound", "method":"load", "params":' + params + '}';
			nexacro.Device.exec(jsonstr);
            return true;
		}
		else
		{
            return false;
		}
    };

    _pAudioPlayer.play = function (nIntervalTime)
    {
        var params;
        var jsonstr;

        var IntervalTimeState;
        if (typeof (nIntervalTime) == "undefined" || nIntervalTime == null || nIntervalTime == "")
        {
            nIntervalTime = 0;
            IntervalTimeState = 1;
        }
        else
        {
            if (nexacro.Device.publicNumCheck(nIntervalTime) && nIntervalTime >= 0 && nIntervalTime <= 86400000)
            {
                if (nIntervalTime < 200)
                {
                    return false;
                }
                else
                {
                    IntervalTimeState = 0;
                }
            }
            else
            {
                return false;
            }
        }

        if (typeof (this.repeatcount) == "undefined" || this.repeatcount == null)
        {
            this.repeatcount = 1;
        }
        if (typeof (this.startpos) == "undefined" || this.startpos == null || this.startpos == 0)
        {
            this.startpos = -1;
        }

        if (typeof (this.stoppos) == "undefined" || this.stoppos == null || this.stoppos == 0)
        {
            this.stoppos = -1;
        }

        if (this.volume >= 0.0 && this.volume <= 1.0)
        {
            this.setvolume();
        }

        if ((this.pan >= 0.0 && this.pan <= 1.0) || this.pan == -1)
        {
            this.setpan();
        }

        if (nexacro.Device.curDevice == DeviceType.ANDROID)
        {
            params = '{  repeatstartpos:"' + this.startpos;
            params += '", repeatstoppos:"' + this.stoppos;
            params += '", repeatcount:"' + this.repeatcount;
            params += '", playingeventtime:"' + nIntervalTime;
            params += '", intervaltimestate:"' + IntervalTimeState;
            params += '"}';
        }
        else
        {
            params = '{  "repeatstartpos":"' + this.startpos;
            params += '", "repeatstoppos":"' + this.stoppos;
            params += '", "repeatcount":"' + this.repeatcount;
            params += '", "playingeventtime":"' + nIntervalTime;
            params += '", "intervaltimestate":"' + IntervalTimeState;
            params += '"}';
        }

        // status manage
        if (this.bload == false)
        {
            nexacro._OnceCallbackTimer.callonce(this, function ()
            {
                var e = new nexacro.AudioErrorEventInfo("onerror", "", "0", "1007", "Not loaded");
                this._fire_onerror(this, e);
            }, 20);
            return true;
        }

        if (this.bplay == true)
        {
            var avobj = this;

            nexacro._OnceCallbackTimer.callonce(this, function ()
            {
                var e = new nexacro.AudioErrorEventInfo("onerror", "", avobj.currentpos, "1008", "Already playing");
                this._fire_onerror(this, e);
            }, 20);
            return true;
        }

        // repeatplay 역할도 해야 한다.
        if (this.startpos == -1 && this.stoppos == -1)
        {
            jsonstr = '{"id":' + this._id + ', "div":"Sound", "method":"play", "params":' + params + '}';
        }
        else
        {
            jsonstr = '{"id":' + this._id + ', "div":"Sound", "method":"repeatplay", "params":' + params + '}';
        }

        nexacro.Device.exec(jsonstr);
        return true;
    };

    _pAudioPlayer.pause = function ()
    {
        if (this.bload == false)
        {
            nexacro._OnceCallbackTimer.callonce(this, function ()
            {
                var e = new nexacro.AudioErrorEventInfo("onerror", "", "0", "1007", "Not loaded");
                this._fire_onerror(this, e);
            }, 20);

            return;
        }

        if (this.bplay == false && this.bpaused == false)
        {
            nexacro._OnceCallbackTimer.callonce(this, function ()
            {
                var e = new nexacro.AudioErrorEventInfo("onerror", "", "0", "1009", "Not playing");
                this._fire_onerror(this, e);
            }, 20);

            return;
        }

        if (this.bpaused == true)
        {
            nexacro._OnceCallbackTimer.callonce(this, function ()
            {
                var e = new nexacro.AudioErrorEventInfo("onerror", "", this.currentpos, "1303", "Already paused");
                this._fire_onerror(this, e);
            }, 20);

            return;
        }

        var params = '""';
        var jsonstr = '{"id":' + this._id + ', "div":"Sound", "method":"pause", "params":' + params + '}';
        nexacro.Device.exec(jsonstr);
    };

    _pAudioPlayer.resume = function ()
    {
        if (this.bload == false)
        {
            nexacro._OnceCallbackTimer.callonce(this, function ()
            {
                var e = new nexacro.AudioErrorEventInfo("onerror", "", "0", "1007", "Not loaded");
                this._fire_onerror(this, e);
            }, 20);

            return;
        }

        if (this.bplay == true)
        {
            nexacro._OnceCallbackTimer.callonce(this, function ()
            {
                var e = new nexacro.AudioErrorEventInfo("onerror", "", this.currentpos, "1011", "Not Paused");
                this._fire_onerror(this, e);
            }, 20);

            return;
        }

        if (this.bpaused == false)
        {
            nexacro._OnceCallbackTimer.callonce(this, function ()
            {
                var e = new nexacro.AudioErrorEventInfo("onerror", "", this.currentpos, "1010", "Can't resume.");
                this._fire_onerror(this, e);
            }, 20);

            return;
        }

        var params = '""';
        var jsonstr = '{"id":' + this._id + ', "div":"Sound", "method":"resume", "params":' + params + '}';

        nexacro.Device.exec(jsonstr);
    };

    _pAudioPlayer.stop = function ()
    {
        if (this.bload == false)
        {
            nexacro._OnceCallbackTimer.callonce(this, function ()
            {
                var e = new nexacro.AudioErrorEventInfo("onerror", "", "0", "1007", "Not loaded");
                this._fire_onerror(this, e);
            }, 20);

            return;
        }

        if (this.bplay == false && this.bpaused != true)
        {
            nexacro._OnceCallbackTimer.callonce(this, function ()
            {
                var e = new nexacro.AudioErrorEventInfo("onerror", "", this.currentpos, "1009", "Not playing");
                this._fire_onerror(this, e);
            }, 20);

            return;
        }

        // repeatstop 역할도 해야 한다.
        var params = '""';
        var jsonstr = '{"id":' + this._id + ', "div":"Sound", "method":"stop", "params":' + params + '}';

        nexacro.Device.exec(jsonstr);
    };

    _pAudioPlayer.movePos = function (nPos)
    {
        if (this.bload == false)
        {
            nexacro._OnceCallbackTimer.callonce(this, function ()
            {
                var e = new nexacro.AudioErrorEventInfo("onerror", "", 0, "1007", "Not loaded");
                this._fire_onerror(this, e);
            }, 20);

            return;
        }

        if (typeof (nPos) != "undefined" && (nPos >= 0 && nPos <= this.duration) && nexacro.Device.publicNumCheck(nPos))
        {
            this.time = nPos || "";
            var params;
            if (nexacro.Device.curDevice == DeviceType.ANDROID)
            {
                params = '{  desttime:"' + this.time;
                params += '"}';
            }
            else
            {
                params = '{  "desttime":"' + this.time;
                params += '"}';
            }
            var jsonstr = '{"id":' + this._id + ', "div":"Sound", "method":"movePos", "params":' + params + '}';
            nexacro.Device.exec(jsonstr);
            return true;
        }
        else
        {
            return false;
        }
    };

    //===============================================================
    // nexacro.AudioPlayer : Event Handlers
    //===============================================================
    _pAudioPlayer._onload = function(objData)
    {
		var e = new nexacro.AudioEventInfo("onload", objData.reason, objData.url, objData.playtime, objData.curtime, objData.repeatstart, objData.repeatend, objData.repeatcount);
		this.duration = objData.playtime;

		// status manage		
		this.bload = true;
		this.bplay = false;
		this.bpaused = false;
		this.duration = objData.playtime;	
		this._fire_onload(this, e);
    };

    _pAudioPlayer._fire_onload = function(objAudioPlayer, eAudioEventInfo)
    {
        if (this.onload && this.onload._has_handlers)
        {
			return this.onload._fireEvent(this, eAudioEventInfo);
		}
		return true;
    };
    
    _pAudioPlayer._onplay = function(objData)
    {
        // onrepeatplay 역할도 해야 한다.
		var e = new nexacro.AudioEventInfo("onplay", objData.reason, objData.url, objData.playtime, objData.curtime, objData.repeatstart, objData.repeatend, objData.repeatcount);
		this.duration = objData.playtime;
		this.currentpos = objData.curtime;
		
	  	// status manage
		this.bplay = true;
		this.bpaused = false;
		
		this._fire_onplay(this, e);
    };

    _pAudioPlayer._fire_onplay = function(objAudioPlayer, eAudioEventInfo)
    {
        if (this.onplay && this.onplay._has_handlers)
        {
			return this.onplay._fireEvent(this, eAudioEventInfo);
		}
		return true;
    };

    _pAudioPlayer._onplaying = function(objData)
    {
		var e = new nexacro.AudioEventInfo("onplaying", objData.reason, objData.url, objData.playtime, objData.curtime, objData.repeatstart, objData.repeatend, objData.repeatcount);
		this.duration = objData.playtime;
		this.currentpos = objData.curtime;
		this._fire_onplaying(this, e);
    };

    _pAudioPlayer._fire_onplaying = function(objAudioPlayer, eAudioEventInfo)
    {
        if (this.onplaying && this.onplaying._has_handlers)
        {
			return this.onplaying._fireEvent(this, eAudioEventInfo);
		}
		return true;
    };
    
    _pAudioPlayer._onstop = function(objData)
    {
        // onrepeatstop 이벤트도 포함한다.
		var e = new nexacro.AudioEventInfo("onstop", objData.reason, objData.url, objData.playtime, objData.curtime, objData.repeatstart, objData.repeatend, objData.repeatcount);
		this.duration = objData.playtime;
		this.currentpos = objData.curtime;
		// status manage
		if (objData.reason == "4" || objData.reason == "5")
		{
			// stop
			this.bpaused = false;
			this.bplay = false;
			this.currentpos = 0.0; //종료시 pos 초기화 
		}
		else if (objData.reason == "6")
		{
			// pause
			this.bpaused = true;
			this.bplay = false;
		}
		this._fire_onstop(this, e);
    };

    _pAudioPlayer._fire_onstop = function(objAudioPlayer, eAudioEventInfo)
    {
        if (this.onstop && this.onstop._has_handlers)
        {
			return this.onstop._fireEvent(this, eAudioEventInfo);
		}
		return true;
    };

    _pAudioPlayer._onmovepos = function(objData)
    {
		this.currentpos = objData.curtime;
		var e = new nexacro.AudioEventInfo("onmovepos", objData.reason, objData.url, objData.playtime, objData.curtime, objData.repeatstart, objData.repeatend, objData.repeatcount);
		this.duration = objData.playtime;
		this._fire_onmovepos(this, e);
    };

    _pAudioPlayer._fire_onmovepos = function(objAudioPlayer, eAudioEventInfo)
    {
        if (this.onmovepos && this.onmovepos._has_handlers)
        {
			return this.onmovepos._fireEvent(this, eAudioEventInfo);
		}
		return true;
	};
	
    _pAudioPlayer.setvolume = function()
    {
		var params;
		if (nexacro.Device.curDevice == DeviceType.ANDROID)
		{
            params = '{  volume:"' + this.volume;
            params+= '"}';
		}
		else
		{
            params = '{  "volume":"' + this.volume;
            params+= '"}';
		}

		var jsonstr = '{"id":' + this._id + ', "div":"Sound", "method":"setvolum", "params":' + params + '}';
		nexacro.Device.exec(jsonstr);
	};

    _pAudioPlayer.setpan = function()
    {
		var params; 
		if (nexacro.Device.curDevice == DeviceType.ANDROID)
		{
            params = '{  pan:"' + this.pan;
            params+= '"}';
		}
		else
		{
            params = '{  "pan":"' + this.pan;
            params+= '"}';
		}

		var jsonstr = '{"id":' + this._id + ', "div":"Sound", "method":"setpan", "params":' + params + '}';
		nexacro.Device.exec(jsonstr);
	};
	
    _pAudioPlayer._onerror = function(objData)
    {
		var e = new nexacro.AudioErrorEventInfo("onerror", objData.url, objData.curtime, objData.errorcode, objData.errormsg);
		this._fire_onerror(this, e);
    };

    _pAudioPlayer._fire_onerror = function(objAudioPlayer, AudioErrorEventInfo)
    {
        if (this.onerror && this.onerror._has_handlers)
        {
			return this.onerror._fireEvent(this, AudioErrorEventInfo);
		}
		return true;
	};
	
    //===============================================================
    // nexacro.AudioPlayer : Logical Part
    //===============================================================
    _pAudioPlayer.paramck_AudioLoad = function (strFilePath)
    {
        if (strFilePath == null || typeof (strFilePath) == "undefined" || typeof (strFilePath) != "string")
        {
            return false;
        }
        return true;
    };

    delete _pAudioPlayer;
}

//==============================================================================
// nexacro.AudioEventInfo
// AudioPlay 객체에서 발생되는 이벤트에서 사용되는 EventInfo Object
//==============================================================================
if (!nexacro.AudioEventInfo)
{
    nexacro.AudioEventInfo = function (strEventId, strReason, strUrl, intPlaytime, intCurtime, intrepeatstart, intrepeatend, intrepeatcount)
    {
        this.eventid = strEventId;												// 이벤트ID
        this.reason = strReason;												// 이벤트 발생분류 코드
        this.url = strUrl;														// 오디오 파일의 소스 URL
        this.duration = intPlaytime;											// Audio Recorder file 전체 재생시간
        this.currentpos = intCurtime;											// 현재 재생(레코딩)시간, 위치
    };
    var _pAudioEventInfo = nexacro.AudioEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.AudioEventInfo);
 	_pAudioEventInfo._type_name = "AudioEventInfo";
 	
 	delete _pAudioEventInfo;
}

//==============================================================================
// nexacro.AudioErrorEventInfo
// AudioPlay 객체에서 처리가 실패했을 때 발생하는 이벤트에서 사용되는 EventInfo Object
//==============================================================================
if (!nexacro.AudioErrorEventInfo)
{
    nexacro.AudioErrorEventInfo = function (strEventId, strUrl, intCurtime, intErrorCode, strErrorMsg)
    {
        this.eventid = strEventId;												// 이벤트ID
        this.url = strUrl;														// 오디오 파일의 소스 URL
        this.currentpos = intCurtime;                                           // 현재 재생(레코딩)시간, 위치 
        this.errortype = "ObjectError";
        this.statuscode = intErrorCode;											// 오류코드 : integer 로 된 errorcode (iOS/Android에서 발생하는 errorcode를 그대로 사용)
        this.errormsg = strErrorMsg;											// 오류메세지 : string으로 된 errormsg (iOS/Android에서 발생하는 error message를 그대로 사용)
    };
    var _pAudioErrorEventInfo = nexacro.AudioErrorEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.AudioErrorEventInfo);
	_pAudioErrorEventInfo._type_name = "AudioErrorEventInfo";
	
	delete _pAudioErrorEventInfo;
}

//==============================================================================
// 03. Geolocation
//==============================================================================

//==============================================================================
// nexacro.Geolocation
// 모바일 기기의 위치정보를 제공한다.
//==============================================================================
if (!nexacro.Geolocation)
{
    nexacro.Geolocation = function (name, parent)
    {
        this.id = this.name = name || null;
        if (parent)
            this.parent = parent;

		this._id = nexacro.Device.makeID();
		nexacro.Device._userCreatedObj[this._id] = this;
        
		this.ACCURACY_0 = 0;  // iOS, Android 공용
		this.ACCURACY_1 = 1;  // iOS, Android 공용
		this.ACCURACY_2 = 2;  // iOS, Android 공용
		this.ACCURACY_3 = 3;  // iOS 만 사용
		this.ACCURACY_4 = 4;  // iOS 만 사용
		
		this.coords = {															// 위치정보
			  latitude : 0.0														// 위도
			, longitude : 0.0													// 경도
			, altitude : 0.0														// 고도
			, heading :0.0														// 방위
			, speed : 0.0														// 속도
			, accuracy : 0.0														// 위치정확도
			, altitudeaccuracy : 0.0 											// 고도정확도
            , set_latitude : function() {}
            , set_longitude : function() {}
            , set_altitude : function() {}
            , set_heading : function() {}
            , set_speed : function() {}
            , set_accuracy : function() {}
            , set_altitudeaccuracy : function() {}
            };
		this.timestamp = "";													// 위치정보를 얻은 시각
		this.sourcetype = "";													// 위치정보를 얻은 소스의 종류 (GPS : 0,WPS : 1)
		this.enableevent = true;
        
		this._event_list =
        {
		    "onrecvsuccess":1, "onrecverror":1 
	    };	
	    
        this.onrecvsuccess = null;
        this.onrecverror = null;
	    
        var params = '""';
        var jsonstr;
        
        jsonstr = '{"id":'+this._id+', "div":"Geolocation", "method":"constructor", "params":'+params+'}';     
		nexacro.Device.exec(jsonstr);
    };

    var _pGeolocation = nexacro.Geolocation.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.Geolocation);
	_pGeolocation._type_name = "Geolocation";

	_pGeolocation.destroy = function ()
	{
	    var params = '""';
	    var jsonstr;

	    delete nexacro.Device._userCreatedObj[this._id];

	    jsonstr = '{"id":' + this._id + ', "div":"Geolocation", "method":"destroy", "params":' + params + '}';
	    nexacro.Device.exec(jsonstr);

	    return true;
	};
	
	_pGeolocation.on_created = function () { };
	
    //===============================================================
    // nexacro.Geolocation : Properties
    //===============================================================

    // 2011.10.23 LKE readonly 처리
	_pGeolocation.set_coords = function () { };
    /*
	if (_pGeolocation.coords) {
		_pGeolocation.coords.set_latitude = function() {};
		_pGeolocation.coords.set_longitude = function() {};
		_pGeolocation.coords.set_altitude = function() {};
		_pGeolocation.coords.set_heading = function() {};
		_pGeolocation.coords.set_speed = function() {};
		_pGeolocation.coords.set_accuracy = function() {};
		_pGeolocation.coords.set_altitudeaccuracy = function() {};
	}
	*/

	_pGeolocation.set_latitude = function () { };
	_pGeolocation.set_longitude = function () { };
	_pGeolocation.set_altitude = function () { };
	_pGeolocation.set_heading = function () { };
	_pGeolocation.set_speed = function () { };
	_pGeolocation.set_accuracy = function () { };
	_pGeolocation.set_altitudeaccuracy = function () { };

	_pGeolocation.set_sourcetype = function () { };
	_pGeolocation.set_timestamp = function () { };

    //===============================================================
    // nexacro.Geolocation : Methods
    //===============================================================
	_pGeolocation.getCurrentPosition = function(nAccuracy, nTimeout)
	{
	    var params;

	    if (nAccuracy == null || nTimeout == null)
	        return false;

	    if (this.parmack_Geolocation(nAccuracy, nTimeout, 1))
	    {
	        this.Accuracy = nAccuracy;
	        this.Timeout = nTimeout;
            if (nexacro.Device.curDevice == DeviceType.ANDROID || nexacro.Device.curDevice == DeviceType.WINDOWS)
	        {   
                params = '{Accuracy:"'+this.Accuracy+'", Timeout:"' + this.Timeout+'"}';
            }
	        else
	        {               
                params = '{"Accuracy":"' + this.Accuracy; 
                params += '", "timeout":"' + this.Timeout + '"}';
            }

            var jsonstr = '{"id":' + this._id + ', "windowhandle":"' + this.parent._getWindow().handle + '", "div":"Geolocation", "method":"getCurrentPosition", "params":' + params + '}';
	        nexacro.Device.exec(jsonstr);

            return true;
	    }
	    else
	    { 
            return false;
        }
	};	

	_pGeolocation.watchStart = function(nAccuracy, nIntervalTime)
	{
	    var params ;

	    if (nAccuracy == null || nIntervalTime == null)
	        return false;

	    if (this.parmack_Geolocation(nAccuracy, nIntervalTime, 2))
	    {
            this.Accuracy = nAccuracy.toString();
            this.IntervalTime = nIntervalTime.toString();

            if (nexacro.Device.curDevice == DeviceType.ANDROID || nexacro.Device.curDevice == DeviceType.WINDOWS)
	        {
                params = '{"Accuracy":"' + this.Accuracy + '", "IntervalTime":"' + this.IntervalTime + '"}';                
	        }
	        else
	        {
                this.Accuracy = nAccuracy;
                params = '{"Accuracy":"' + this.Accuracy; 
                params += '", "timeout":"' + this.IntervalTime + '"}';
	        }

            var jsonstr = '{"id":' + this._id + ', "windowhandle":"' + this.parent._getWindow().handle + '", "div":"Geolocation", "method":"watchStart", "params":' + params + '}';
	        nexacro.Device.exec(jsonstr);
	    }
	    else
	    {
            return false;
        }
        return true;
	};

	_pGeolocation.watchStop = function()
	{		
        var params = '""'; 
        var jsonstr = '{"id":' + this._id + ', "windowhandle":"' + this.parent._getWindow().handle + '", "div":"Geolocation", "method":"watchStop", "params":' + params + '}';
        nexacro.Device.exec(jsonstr);		
	};

    //===============================================================
    // nexacro.Geolocation : Event Handlers
    //===============================================================
	_pGeolocation._onrecvsuccess = function (objData)
	{
	    // 현재 객체에 값을 세팅한다.
        if (nexacro.Device.curDevice == DeviceType.WINDOWS && typeof objData == "string")
        {
            //trace("{{_pGeolocation._onrecvsuccess[objData=" + objData + ", typeof objData=" + typeof objData + "]}}");
            var jsonObjData = JSON.parse(objData);
            if (jsonObjData)
            {
                this.coords.latitude = jsonObjData.coords.latitude;
                this.coords.longitude = jsonObjData.coords.longitude;
                this.coords.altitude = jsonObjData.coords.altitude;
                this.coords.heading = jsonObjData.coords.heading;
                this.coords.speed = jsonObjData.coords.speed;
                this.coords.accuracy = jsonObjData.coords.accuracy;
                this.coords.altitudeaccuracy = jsonObjData.coords.altitudeaccuracy;
                this.timestamp = new Date(jsonObjData.timestamp);
                this.sourcetype = jsonObjData.sourcetype;
            }
        }
        else
        {
            this.coords.latitude = objData.coords.latitude;
            this.coords.longitude = objData.coords.longitude;
            this.coords.altitude = objData.coords.altitude;
            this.coords.heading = objData.coords.heading;
            this.coords.speed = objData.coords.speed;
            this.coords.accuracy = objData.coords.accuracy;
            this.coords.altitudeaccuracy = objData.coords.altitudeaccuracy;
            this.timestamp = new Date(objData.timestamp);
            this.sourcetype = objData.sourcetype;
        }

	    var e = new nexacro.GeolocationEventInfo("onrecvsuccess", this.coords, this.timestamp, this.sourcetype);
	    this._fire_onrecvsuccess(this, e);
	};

	_pGeolocation._fire_onrecvsuccess = function (objGeolocation, eGeolocationEventInfo)
	{
	    if (this.onrecvsuccess && this.onrecvsuccess._has_handlers)
	    {
	        return this.onrecvsuccess._fireEvent(this, eGeolocationEventInfo);
	    }
	    return true;
	};

	_pGeolocation._onrecverror = function(objData)
    {
        var e;
        if (nexacro.Device.curDevice == DeviceType.WINDOWS && typeof objData == "string")
        {
            //trace("{{_pGeolocation._onrecverror[objData=" + objData + ", typeof objData=" + typeof objData + "]}}");
            var jsonObjData = JSON.parse(objData);
            if (jsonObjData)
            {
                e = new nexacro.GeolocationErrorEventInfo("onrecverror", jsonObjData.errorcode, jsonObjData.errormsg);
            }
        }
        else
        {
            e = new nexacro.GeolocationErrorEventInfo("onrecverror", objData.errorcode, objData.errormsg);
        }
		this._fire_onrecverror(this, e);
	};

	_pGeolocation._fire_onrecverror = function(objGeolocation, eGeolocationErrorEventInfo)
	{
	    if (this.onrecverror && this.onrecverror._has_handlers)
	    {
			return this.onrecverror._fireEvent(this, eGeolocationErrorEventInfo);
		}
		return true;
	};
    	
    //===============================================================
    // nexacro.Geolocation : Logical Part
    //===============================================================
	_pGeolocation.parmack_Geolocation = function (nAccuracy, nTimeout, method)
	{
	    if (nAccuracy == null || typeof (nAccuracy) == "undefined")
	    {
	        return false;
	    }

	    if (nTimeout == null || typeof (nTimeout) == "undefined")
	    {
	        return false;
	    }

	    if (method == null || typeof (method) == "undefined")
	    {
	        return false;
	    }

	    if (!nexacro.Device.publicNumCheck(nAccuracy))
	    {
	        return false;
	    }

	    if (!nexacro.Device.publicNumCheck(nTimeout))
	    {
	        return false;
	    }

	    if (nexacro.Device.curDevice == DeviceType.ANDROID)
	    {
	        if (method == 1)
	        {
	            //getCurrentPosition  체크
	            if ((nAccuracy >= 0 && nAccuracy < 3) && (nTimeout >= 200 && nTimeout <= 86400000))
	            {
	                return true;
	            }
	            else
	            {
	                return false;
	            }
	        }
	        else if (method == 2)
	        {
	            //Watchstart 체크
	            if ((nAccuracy >= 0 && nAccuracy < 3) && (nTimeout >= 200 && nTimeout <= 86400000)) {
	                return true;
	            }
	            else
	            {
	                return false;
	            }
	        }
	    }
	    else if (nexacro.Device.curDevice == DeviceType.WINDOWS)
	    {
	        if (method == 1)
	        {
	            //getCurrentPosition  체크
	            if ((nAccuracy == 0) && (nTimeout >= 200 && nTimeout <= 86400000))
	            {
	                return true;
	            }
	            else
	            {
	                return false;
	            }
	        }
	        else if (method == 2)
	        {
	            //Watchstart 체크
	            if ((nAccuracy == 0) && (nTimeout >= 200 && nTimeout <= 86400000)) {
	                return true;
	            }
	            else
	            {
	                return false;
	            }
	        }
	    }
	    else
	    {
	        if (method == 1)
	        {
	            //getCurrentPosition  체크
	            if ((nAccuracy >= 0 && nAccuracy < 5) && (nTimeout >= 200 && nTimeout <= 86400000))
	            {
	                return true;
	            }
	            else
	            {
	                return false;
	            }
	        }
	        else if (method == 2)
	        {
	            //Watchstart 체크
	            if ((nAccuracy >= 0 && nAccuracy < 5) && (nTimeout >= 200 && nTimeout <= 86400000))
	            {
	                return true;
	            }
	            else
	            {
	                return false;
	            }
	        }
	    }
	    return true;
	};
    
	delete _pGeolocation;
}

//==============================================================================
// nexacro.GeolocationEventInfo
// 위치정보를 요청하였을 경우 발생하는 이벤트에서 사용되는 EventInfo Object
//==============================================================================
if (!nexacro.GeolocationEventInfo)
{
    nexacro.GeolocationEventInfo = function (strEventId, objCoords, strTimestamp, strSourcetype)
    {
        this.eventid = strEventId;												// 이벤트ID
        this.coords = {															// 위치정보
            latitude: Number(objCoords.latitude)								// 위도
			, longitude: Number(objCoords.longitude)							// 경도
			, altitude: Number(objCoords.altitude)								// 고도
			, heading: Number(objCoords.heading)								// 방위
			, speed: Number(objCoords.speed)									// 속도
			, accuracy: Number(objCoords.accuracy)								// 위치정확도
			, altitudeaccuracy: Number(objCoords.altitudeaccuracy) 			// 고도정확도
        };
        this.timestamp = strTimestamp;											// 위치정보를 얻은 시각
        this.sourcetype = strSourcetype;										// 위치정보를 얻은 소스의 종류 (GPS,WPS)
    };
	var _pGeolocationEventInfo = nexacro.GeolocationEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.GeolocationEventInfo); 	
 	_pGeolocationEventInfo._type_name = "GeolocationEventInfo";
	
 	delete _pGeolocationEventInfo;
}

//==============================================================================
// nexacro.GeolocationErrorEventInfo
// 위치정보를 요청이 실패했을 때 발생하는 이벤트에서 사용되는 EventInfo Object
//==============================================================================
if (!nexacro.GeolocationErrorEventInfo)
{
    nexacro.GeolocationErrorEventInfo = function (strEventId, intErrorCode, strErrorMsg)
    {
        this.eventid = strEventId;												// 이벤트ID
		this.errortype = "ObjectError";
		this.statuscode = intErrorCode;											// 오류코드 : integer 로 된 errorcode (iOS/Android에서 발생하는 errorcode를 그대로 사용)
        this.errormsg = strErrorMsg;											// 오류메세지 : string으로 된 errormsg (iOS/Android에서 발생하는 error message를 그대로 사용)
    };
    var _pGeolocationErrorEventInfo = nexacro.GeolocationErrorEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.GeolocationErrorEventInfo);
	_pGeolocationErrorEventInfo._type_name = "GeolocationErrorEventInfo";
	
	delete _pGeolocationErrorEventInfo;
}

//==============================================================================
// 05. Acceleration
//==============================================================================

//==============================================================================
// nexacro.Acceleration
// 모바일 기기의 가속도 정보를 제공한다.
//==============================================================================
if (!nexacro.Acceleration)
{
    nexacro.Acceleration = function (name, parent)
    {
        this.id = this.name = name || null;
        if (parent)
            this.parent = parent;

		this._id = nexacro.Device.makeID();
		nexacro.Device._userCreatedObj[this._id] = this;
		    
		this.xpos = 0;															// x축의 값
		this.ypos = 0;				 											// y축의 값
		this.zpos = 0;				 											// z축의 값
		this.timestamp = "";													// 가속도 정보를 얻은 시각
		this.accuracy = 0;
		this.enableevent = true;												// 정확도
	        
   	    this._event_list = {
           "onrecvsuccess":1, "onrecverror":1 
        };	
    
        this.onrecvsuccess = null;
        this.onrecverror = null;
           
        var params = '""';
        var jsonstr = '{"id":'+this._id+', "div":"Acceleration", "method":"constructor", "params":'+params+'}'; 
        nexacro.Device.exec(jsonstr);
    };

    var _pAcceleration = nexacro.Acceleration.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.Acceleration);
	_pAcceleration._type_name = "Acceleration";
    
	_pAcceleration.destroy = function ()
	{
	    var params = '""';
	    var jsonstr;

	    delete nexacro.Device._userCreatedObj[this._id];

	    jsonstr = '{"id":' + this._id + ', "div":"Acceleration", "method":"destroy", "params":' + params + '}';
	    nexacro.Device.exec(jsonstr);

	    return true;
	};

	_pAcceleration.on_created = function () { };

    //===============================================================
    // nexacro.Acceleration : Properties
    //===============================================================
	_pAcceleration.set_xpos = function(){};
	_pAcceleration.set_ypos = function(){};
	_pAcceleration.set_zpos = function(){};
	_pAcceleration.set_timestamp = function(){};
	_pAcceleration.set_accuracy = function(){};               
 
    //===============================================================
    // nexacro.Acceleration : Methods
    //===============================================================
	_pAcceleration.getCurrentAcceleration = function(nAccuracy)
	{
	    //현재 가속도 정보를 요청한다.
	    var params;

		if (typeof (nAccuracy) == "undefined" || nAccuracy == null)
	    {
		   this.accuracy = 0;
	    }
	    else
	    {
	        if (this.paramck_accuracy(nAccuracy))
	        {
	            if (nAccuracy >= 0 && nAccuracy <= 3)
	            {
		    		this.accuracy = nAccuracy;
	            }
	            else
                {
                    return false;
                }
	        }
	        else
	        {
				return false;
			}
		}
		
	    var pcheck = this.parmack_AccelgetCurrentPosition(this.accuracy);
		if (pcheck == true)
		{
            if (nexacro.Device.curDevice == DeviceType.ANDROID || nexacro.Device.curDevice == DeviceType.WINDOWS)
		    {
		        params = '{"Accuracy" : "' + this.accuracy.toString() + '"}';
		    }
		    else
		    {
	            params = '{"Accuracy":"' + this.accuracy + '"}';	           
		    }

            var jsonstr = '{"id":' + this._id + ', "windowhandle":"' + this.parent._getWindow().handle + '", "div":"Acceleration", "method":"getCurrentAcceleration", "params":' + params + '}';
		    nexacro.Device.exec(jsonstr);

			return true;
		}
		else
		{ 
			return false;
		}
	};
    	
	_pAcceleration.watchStart = function(nAccuracy, nIntervalTime)
	{
	    // 가속도 정보의 모니터링을 시작한다.
	    var params;

	    var pcheck = this.pramck_AccelwatchStart(nIntervalTime, nAccuracy); 
		if (pcheck == true)
		{	
            if (nexacro.Device.curDevice == DeviceType.ANDROID || nexacro.Device.curDevice == DeviceType.WINDOWS)
		    {
                params = '{  IntervalTime:"' + nIntervalTime;
		        params+= '", Accuracy:"' + nAccuracy ;
		        params+= '"}';		     
		    }
		    else
		    {
                params = '{"timeout":"' + nIntervalTime;
	            params+= '", "Accuracy":"' + nAccuracy;
	            params+= '"}';	           
		    }

            var jsonstr = '{"id":' + this._id + ', "windowhandle":"' + this.parent._getWindow().handle + '", "div":"Acceleration", "method":"watchStart", "params":' + params + '}';
		    nexacro.Device.exec(jsonstr);

            return true;
		}
		else
		{
            return false;
		}
	};
	
	_pAcceleration.watchStop = function()
	{
	    // 가속도 정보의 모니터링을 중지한다.		
        var params = '""';
        var jsonstr = '{"id":' + this._id + ', "windowhandle":"' + this.parent._getWindow().handle + '", "div":"Acceleration", "method":"watchStop", "params":' + params + '}';
        nexacro.Device.exec(jsonstr);	    
	};

    //===============================================================
    // nexacro.Acceleration : Event Handlers
    //===============================================================
	_pAcceleration._onrecvsuccess = function (objData)
    {
        var e;
        if (nexacro.Device.curDevice == DeviceType.WINDOWS && typeof objData == "string")
        {
            //trace("{{_pAcceleration._onrecvsuccess[objData=" + objData + ", typeof objData=" + typeof objData + "]}}");
            var jsonObjData = JSON.parse(objData);
            if (jsonObjData)
            {
                this.xpos = parseFloat(jsonObjData.xpos);
                this.ypos = parseFloat(jsonObjData.ypos);
                this.zpos = parseFloat(jsonObjData.zpos);
                this.timestamp = new Date(jsonObjData.timestamp);
                this.accuracy = parseFloat(jsonObjData.accuracy);
                e = new nexacro.AccelerationEventInfo("onrecvsuccess", this);
            }
        }
        else
        {
            this.xpos = parseFloat(objData.xpos);
            this.ypos = parseFloat(objData.ypos);
            this.zpos = parseFloat(objData.zpos);
            this.timestamp = new Date(objData.timestamp);
            this.accuracy = parseFloat(objData.accuracy);
            e = new nexacro.AccelerationEventInfo("onrecvsuccess", this);
        }
	    this._fire_onrecvsuccess(this, e);
	};

	_pAcceleration._fire_onrecvsuccess = function (objAcceleration, eAccelerationEventInfo)
	{
	    if (this.onrecvsuccess && this.onrecvsuccess._has_handlers)
	    {
	        return this.onrecvsuccess._fireEvent(this, eAccelerationEventInfo);
	    }
	    return true;
	};

	_pAcceleration._onrecverror = function(objData)
    {
        var e;
        if (nexacro.Device.curDevice == DeviceType.WINDOWS && typeof objData == "string")
        {
            //trace("{{_pAcceleration._onrecverror[objData=" + objData + ", typeof objData=" + typeof objData + "]}}");
            var jsonObjData = JSON.parse(objData);
            if (jsonObjData)
            {
                e = new nexacro.AccelerationErrorEventInfo("onrecverror", jsonObjData.errorcode, jsonObjData.errormsg);
            }
        }
        else
        {
            e = new nexacro.AccelerationErrorEventInfo("onrecverror", objData.errorcode, objData.errormsg);
        }
		this._fire_onrecverror(this, e);
	};

	_pAcceleration._fire_onrecverror = function(objAcceleration, eAccelerationErrorEventInfo)
	{
	    if (this.onrecverror && this.onrecverror._has_handlers)
	    {
			return this.onrecverror._fireEvent(this, eAccelerationErrorEventInfo);
		}
		return true;
	};
	
    //===============================================================
    // nexacro.Acceleration : Logical Part
    //===============================================================
	_pAcceleration.paramck_accuracy = function (v)
	{
	    if (v == null || typeof (v) == "undefined")
	    {
	        return false;
	    }
	    if (!nexacro.Device.publicNumCheck(v))
	    {
	        return false;
	    }
	    return true;
	};

	_pAcceleration.parmack_AccelgetCurrentPosition = function (nAccuracy)
	{
	    if (!nexacro.Device.publicNumCheck(nAccuracy))
	    {
	        return false;
	    }
	    return true;
	};

	_pAcceleration.pramck_AccelwatchStart = function (nIntervalTime, nAccuracy)
	{
	    if (nIntervalTime == null || typeof (nIntervalTime) == "undefined")
	        return false;

	    if (nAccuracy == null || typeof (nAccuracy) == "undefined")
	        return false;
        	
	    if ((nAccuracy >= 0 && nAccuracy <= 3) && (nIntervalTime >= 200 && nIntervalTime <= 86400000))
	    {
	    }
	    else
	    {
	        return false;
	    }

	    if (!nexacro.Device.publicNumCheck(nIntervalTime))
	    {
	        return false;
	    }

	    if (!nexacro.Device.publicNumCheck(nAccuracy))
	    {
	        return false;
	    }

	    return true;
	};

	delete _pAcceleration;
}

//==============================================================================
// nexacro.AccelerationEventInfo
// 가속도 정보를 조회에 성공했을 때 발생되는 이벤트의 EventInfo Object
//==============================================================================
if (!nexacro.AccelerationEventInfo)
{
    nexacro.AccelerationEventInfo = function (strEventId, objAcceleration)
    {
        this.eventid = strEventId;	// 이벤트ID
        this.xpos = objAcceleration.xpos;
        this.ypos = objAcceleration.ypos;
        this.zpos = objAcceleration.zpos;
        this.timestamp = objAcceleration.timestamp;
        this.accuracy = objAcceleration.accuracy;
    };
	var _pAccelerationEventInfo = nexacro.AccelerationEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.AccelerationEventInfo); 	
 	_pAccelerationEventInfo._type_name = "AccelerationEventInfo";
 	
 	delete _pAccelerationEventInfo;
}

//==============================================================================
// nexacro.AccelerationErrorEventInfo
// 가속도 정보를 조회에 실패했을 때 발생되는 이벤트의 EventInfo Object
//==============================================================================
if (!nexacro.AccelerationErrorEventInfo)
{
    nexacro.AccelerationErrorEventInfo = function (strEventId, intErrorCode, strErrorMsg)
    {
        this.eventid = strEventId;												// 이벤트ID
		this.errortype = "ObjectError";
		this.statuscode = intErrorCode;											// 오류코드 : integer 로 된 errorcode (iOS/Android에서 발생하는 errorcode를 그대로 사용)
        this.errormsg = strErrorMsg;											// 오류메세지 : string으로 된 errormsg (iOS/Android에서 발생하는 error message를 그대로 사용)
    };
	var _pAccelerationErrorEventInfo = nexacro.AccelerationErrorEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.AccelerationErrorEventInfo);	
	_pAccelerationErrorEventInfo._type_name = "AccelerationErrorEventInfo";
	
	delete _pAccelerationErrorEventInfo;
}

//==============================================================================
// 06.Vibrator
//==============================================================================

//==============================================================================
// nexacro.Vibrator
// 모바일 기기의 진동기능을 제공한다.
//==============================================================================
if (!nexacro.Vibrator)
{
    nexacro.Vibrator = function (name, parent)
    {
        this.id = this.name = name || null;
        if (parent)
            this.parent = parent;

        this._id = nexacro.Device.makeID();
        nexacro.Device._userCreatedObj[this._id] = this;
        
		this.repeatcount = "1";				 									// 진동 반복횟수
		this.patterns = new Array(100, 100);									// 진동 패턴문자열
		this.startpos = "0";	
		this.enableevent = true;		 										// 진동 시작위치
		
        this._event_list = {
		    "onplay":1, "onstop":1, "onerror":1 
	    };	
	    
        this.onplay = null;
        this.onstop = null;
        this.onerror = null;
	   
        var params = '""';
        var jsonstr = '{"id":' + this._id + ', "div":"Vibrator", "method":"constructor", "params":' + params + '}';
        nexacro.Device.exec(jsonstr);        
    };

    var _pVibrator = nexacro.Vibrator.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.Vibrator);
	_pVibrator._type_name = "Vibrator";

	_pVibrator.destroy = function ()
	{
	    var params = '""';
	    var jsonstr;

	    delete nexacro.Device._userCreatedObj[this._id];

	    jsonstr = '{"id":' + this._id + ', "div":"Vibrator", "method":"destroy", "params":' + params + '}';
	    nexacro.Device.exec(jsonstr);

	    return true;
	};
	
	_pVibrator.on_created = function () { };
	
    //===============================================================
    // nexacro.Vibrator : Properties
    //===============================================================    
	_pVibrator.set_repeatcount = function(v)
	{
	    if (this.paramck_vibrepeatcount(v))
        {
            this.repeatcount = v;
            return true ; 
        }
        return false;
	};

	_pVibrator.set_patterns = function(v)
	{
	    if (this.paramck_vibpattern(v))
        {
            this.patterns = v;
            return true ; 
        }
        return false;
	};

	_pVibrator.set_startpos = function(v)
	{
        if (this.paramck_vibstartpos(v))
        {
            this.startpos = v;
            return true ; 
        }
        return false;
	};

    //===============================================================
    // nexacro.Vibrator : Methods
    //===============================================================

	_pVibrator.hasVibrator = function ()
	{
	    if (nexacro.Device.curDevice == DeviceType.ANDROID)
	    {
	        return nexacro.__hasVibrator();
	    }
	    else
	    {
	        if (nexacro.Device.isphone == 1)
	        {
	            return true;
	        }
	        else
	        {
	            return false;
	        }
	    }
	};

	_pVibrator.play = function()
	{
	    // 진동을 발생시킨다.
	    var params;

	    if (nexacro.Device.curDevice == DeviceType.ANDROID)
	    {
	        if (this.startpos < this.patterns.length && this.startpos >= 0)
	        {
	        	var startPosArray  = new Array();
	        	var startIndex = 0;
	        	if (Number(this.startpos) % 2 != 0)
	        	{
	        		startPosArray[0] = 0;
	        		startIndex++;
	        	}
	        		
	        	var lastIndex = this.patterns.length ;
	        	for (var i = this.startpos ; i < lastIndex ; i++)
	        	{
	        	    startPosArray[startIndex] = this.patterns[i];
	        	    startIndex++;
	        	}
	        		
		        params = '{  turn:"' + this.repeatcount.toString();
			    params+= '", delay:"' + startPosArray;
			    params+= '"}'; 			     
	        }
	        else
	        {
                return this._onerror({errorcode : '00001', errormsg : 'parameter error'});
	        }
	    }
	    else
	    {
            params = '{  "turn":"' + this.repeatcount;
	        params+= '", "delay":"' + this.patterns;
	        params+= '", "startpos":"' + this.startpos;
	        params+= '"}';
        
	        if (nexacro.Device.isphone != DeviceType.IOS) //isPad
	        {
	            return this._onerror({errorcode : '10001', errormsg : 'Unsupported device Vibrator'});
	        }
	    }

	    var jsonstr = '{"id":' + this._id + ', "div":"Vibrator", "method":"play", "params":' + params + '}';
	    nexacro.Device.exec(jsonstr);
	};

	_pVibrator.stop = function ()
	{	    
	    var params = '""';
	    var jsonstr = '{"id":' + this._id + ', "div":"Vibrator", "method":"stop", "params":' + params + '}';
	    nexacro.Device.exec(jsonstr);	    
	};

    //===============================================================
    // nexacro.Vibrator : Event Handlers
    //===============================================================
	_pVibrator._onplay = function(objData)
	{
		var e = new nexacro.VibratorEventInfo("onplay");
		this._fire_onplay(this, e);
	};

	_pVibrator._fire_onplay = function(objVibrator, eVibratorEventInfo)
	{
	    if (this.onplay && this.onplay._has_handlers)
	    {
			return this.onplay._fireEvent(this, eVibratorEventInfo);
		}
		return true;
	};

	_pVibrator._onstop = function(objData)
	{
		var e = new nexacro.VibratorEventInfo("onstop");
		this._fire_onstop(this, e);
	};

	_pVibrator._fire_onstop = function(objVibrator, eVibratorEventInfo)
	{
	    if (this.onstop && this.onstop._has_handlers)
	    {
			return this.onstop._fireEvent(this, eVibratorEventInfo);
		}
		return true;
	};
    
	_pVibrator._onerror = function(objData)
	{
		var e = new nexacro.VibratorErrorEventInfo("onerror",objData.errorcode, objData.errormsg);
		this._fire_onerror(this, e);
	};

	_pVibrator._fire_onerror = function(objVibrator, VibratorErrorEventInfo)
	{
	    if (this.onerror && this.onerror._has_handlers)
	    {
			return this.onerror._fireEvent(this, VibratorErrorEventInfo);
		}
		return true;
	};	

    //===============================================================
    // nexacro.Vibrator : Logical Part
    //===============================================================
	_pVibrator.paramck_vibstartpos = function (v)
	{
	    if (!nexacro.Device.publicNumCheck(v) || Number(v) < 0)
	    {
	        return false;
	    }
	    return true;
	};

	_pVibrator.paramck_vibrepeatcount = function (v)
	{
	    if (!nexacro.Device.publicNumCheck(v))
	    {
	        return false;
	    }
	    if (Number(v) < 0)
	    {
	        return false;
	    }
	    return true;
	};

	_pVibrator.paramck_vibpattern = function (obj)
	{
	    if (obj instanceof Array)
	    {
	        if (obj.length <= 100)
	        {		
	            for (var i = 0; i < obj.length; i++)
	            {
	                if (!nexacro.Device.publicNumCheck(obj[i]))
	                {
	                    return false;
	                }

	                if (obj[i] < 1)
	                {
	                    return false;
	                }
	            }
	        }
	        else
	        {
	            return false;
	        }

	        if (obj.length % 2 != 0)
	        {
	            return false;
	        }
	    }
	    else
	    {
	        return false;
	    }
	    return true;
	};

	delete _pVibrator;
}

//==============================================================================
// nexacro.VibratorEventInfo
// 모바일 기기에서 진동이 처리된 후 발생되는 이벤트의 EventInfo Object
//==============================================================================
if (!nexacro.VibratorEventInfo)
{
    nexacro.VibratorEventInfo = function(strEventId)
    {
		this.eventid = strEventId;												// 이벤트ID
	};
	var _pVibratorEventInfo = nexacro.VibratorEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.VibratorEventInfo); 	
 	_pVibratorEventInfo._type_name = "VibratorEventInfo";
	
 	delete _pVibratorEventInfo;
}
//==============================================================================
// nexacro.VibratorErrorEventInfo
// Vibrator  파리미터용 에러 오브젝트
//==============================================================================
if (!nexacro.VibratorErrorEventInfo)
{
    nexacro.VibratorErrorEventInfo = function(strEventId, strErrorCode, strErrorMsg)
    {
		this.eventid = strEventId;
		this.errortype = "ObjectError";
		this.statuscode = strErrorCode;											// 오류코드  
		this.errormsg = strErrorMsg;											// 오류메세지 
	};
    var _pVibratorErrorEventInfo = nexacro.VibratorErrorEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.VibratorErrorEventInfo);
 	_pVibratorErrorEventInfo._type_name = "VibratorErrorEventInfo";
	
 	delete _pVibratorErrorEventInfo;
}

//==============================================================================
// 07. Network
//==============================================================================

//==============================================================================
// nexacro.Network
// 모바일 기기의 네트워크 연결정보를 제공한다.
//==============================================================================
if (!nexacro.Network)
{
    nexacro.Network = function (name, parent)
    {
        this.id = this.name = name || null;
        if (parent)
            this.parent = parent;

        this._id = nexacro.Device.makeID();
		nexacro.Device._userCreatedObj[this._id] = this;
		
		this.availabletype = "";												// 사용가능한 네트워크 타입
		this.timestamp = "";
		this.enableevent = true;				 									// 네트워크 사용을 확인한 최종시간
		        
 	    this._event_list = {
		    "onrecvsuccess":1, "onrecverror":1 
	    };	
	    
        this.onrecvsuccess = null;
        this.onrecverror = null;
	           
        var params = '""';
        var jsonstr = '{"id":'+this._id+', "div":"Network", "method":"constructor", "params":'+params+'}'; 
        nexacro.Device.exec(jsonstr);		
    };

    var _pNetwork = nexacro.Network.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.Network);
	_pNetwork._type_name = "Network";
    
	_pNetwork.destroy = function()
	{
		var params = '""';
		var jsonstr;
		
		delete nexacro.Device._userCreatedObj[this._id];
				
        jsonstr = '{"id":'+this._id+', "div":"Network", "method":"destroy", "params":'+params+'}';        
        nexacro.Device.exec(jsonstr);

		return true;
	};
	
	_pNetwork.on_created = function(){};
	
    //===============================================================
    // nexacro.Network : Properties
    //=============================================================== 

    // 2012.02.16 readonly 처리 by pg
	_pNetwork.set_availabletype = function () { };
	_pNetwork.set_timestamp = function () { };

    //===============================================================
    // nexacro.Network : Methods
    //===============================================================
	_pNetwork.isReachable = function(strURL)
	{
	    var params;

	    if (strURL == null)
		    return false;

		var pcheck = this.paramck_isReachable(strURL);
		if (pcheck == true)
		{
            if (nexacro.Device.curDevice == DeviceType.ANDROID || nexacro.Device.curDevice == DeviceType.WINDOWS)
		    {
	            this.url = strURL || "";
	            params = '{"url":"'+this.url+'"}';	           
		    }
		    else
		    {
	            params = '{"target":"'+strURL+'"}';
	            this.availabletype = "availabletype"; 
	            this.timestamp = "timestamp";
		    }

            var jsonstr = '{"id":' + this._id + ', "windowhandle":"' + this.parent._getWindow().handle + '", "div":"Network", "method":"isReachable", "params":' + params + '}';
		    nexacro.Device.exec(jsonstr);

            return true;
		}
		else
		{
            return false;
		}
	};

	_pNetwork.watchStart = function(nIntervalTime)
	{
	    var params;
	    var pcheck = this.paramck_watchStart(nIntervalTime);

		if (pcheck == true)
		{
            if (nexacro.Device.curDevice == DeviceType.ANDROID || nexacro.Device.curDevice == DeviceType.WINDOWS)
		    {
				this.intervalTime  = nIntervalTime || "";
				params = '{"target":"'+this.intervalTime+'"}';				
		    }
		    else
		    {
	            params = '{"target":"'+nIntervalTime+'"}';	           
		    }

            var jsonstr = '{"id":' + this._id + ', "windowhandle":"' + this.parent._getWindow().handle + '", "div":"Network", "method":"watchStart", "params":' + params + '}';
		    nexacro.Device.exec(jsonstr);

            return true;
		}
		else
		{ 
            return false;
		}
	};

	_pNetwork.watchStop = function()
	{	    
        var params = '""';
        var jsonstr = '{"id":' + this._id + ', "windowhandle":"' + this.parent._getWindow().handle + '", "div":"Network", "method":"watchStop", "params":' + params + '}';
        nexacro.Device.exec(jsonstr);	    
	};

    //===============================================================
    // nexacro.Network : Event Handlers
    //=============================================================== 
	_pNetwork._onrecvsuccess = function(objData)
    {
        var e;
        if (nexacro.Device.curDevice == DeviceType.WINDOWS && typeof objData == "string")
        {
            //trace("{{_pNetwork._onrecvsuccess[objData=" + objData + ", typeof objData=" + typeof objData + "]}}");
            var jsonObjData = JSON.parse(objData);
            if (jsonObjData)
            {
                this.availabletype = parseInt(jsonObjData.availabletype) | 0;
                this.timestamp = new Date(jsonObjData.timestamp);
                e = new nexacro.NetworkEventInfo("onrecvsuccess");
            }
        }
        else
        {
            this.availabletype = parseInt(objData.availabletype) | 0;
            this.timestamp = new Date(objData.timestamp);
            e = new nexacro.NetworkEventInfo("onrecvsuccess");
        }
		this._fire_onrecvsuccess(this, e);
	};

	_pNetwork._fire_onrecvsuccess = function(objNetwork, eNetworkEventInfo)
	{
	    if (this.onrecvsuccess && this.onrecvsuccess._has_handlers)
	    {
			return this.onrecvsuccess._fireEvent(this, eNetworkEventInfo);
		}
		return true;
	};

	_pNetwork._onrecverror = function(objData)
    {
        var e;
        if (nexacro.Device.curDevice == DeviceType.WINDOWS && typeof objData == "string")
        {
            //trace("{{_pNetwork._onrecverror[objData=" + objData + ", typeof objData=" + typeof objData + "]}}");
            var jsonObjData = JSON.parse(objData);
            if (jsonObjData)
            {
                e = new nexacro.NetworkErrorEventInfo("onrecverror", jsonObjData.errorcode, jsonObjData.errormsg);
            }
        }
        else
        {
            e = new nexacro.NetworkErrorEventInfo("onrecverror", objData.errorcode, objData.errormsg);
        }
		this._fire_onrecverror(this, e);
	};

	_pNetwork._fire_onrecverror = function(objNetwork, eNetworkErrorEventInfo)
	{
	    if (this.onrecverror && this.onrecverror._has_handlers)
	    {
			return this.onrecverror._fireEvent(this, eNetworkErrorEventInfo);
		}
		return true;
	};
	
    //===============================================================
    // nexacro.Network : Logical Part
    //===============================================================
	_pNetwork.paramck_isReachable = function (strUrl)
	{
	    if (strUrl.trim().length < 1 || strUrl == null || typeof (strUrl) == "undefined" || typeof (strUrl) != "string" || strUrl == "")
	    {
	        return false;
	    }
	    return true;
	};

	_pNetwork.paramck_watchStart = function (strTime)
	{
	    if (strTime == null || typeof (strTime) == "undefined")
	    {
	        return false;
	    }

	    if (!nexacro.Device.publicNumCheck(strTime))
	    {
	        return false;
	    }

	    if (strTime < 200 || strTime > 86400000)
	    {
	        return false;
	    }
	    return true;
	};

	delete _pNetwork;
}

//==============================================================================
// nexacro.NetworkEventInfo
// 지정된 URL에 접속정보 조회에 성공했을 때 발생되는 이벤트의 EventInfo Object
//==============================================================================
if (!nexacro.NetworkEventInfo)
{
    nexacro.NetworkEventInfo = function(strEventId)
    {
		this.eventid = strEventId;												// 이벤트ID
	};
	var _pNetworkEventInfo = nexacro.NetworkEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.NetworkEventInfo); 	
 	_pNetworkEventInfo._type_name = "NetworkEventInfo";
	
 	delete _pNetworkEventInfo;
}

//==============================================================================
// nexacro.NetworkErrorEventInfo
// 지정된 URL에 접속정보 조회에 실패했을 때 발생되는 이벤트의 EventInfo Object
//==============================================================================
if (!nexacro.NetworkErrorEventInfo)
{
    nexacro.NetworkErrorEventInfo = function(strEventId, intErrorCode, strErrorMsg)
    {
		this.eventid = strEventId;												// 이벤트ID
		this.errortype = "ObjectError";
		this.statuscode = intErrorCode;											// 오류코드 : integer 로 된 errorcode (iOS/Android에서 발생하는 errorcode를 그대로 사용)
		this.errormsg = strErrorMsg;											// 오류메세지 : string으로 된 errormsg (iOS/Android에서 발생하는 error message를 그대로 사용)
	};
	var _pNetworkErrorEventInfo = nexacro.NetworkErrorEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.NetworkErrorEventInfo);	
	_pNetworkErrorEventInfo._type_name = "NetworkErrorEventInfo";
	
	delete _pNetworkErrorEventInfo;
}

//==============================================================================
// 10. FileDialog ( Copy From FileDialog.js )
//==============================================================================
if (!nexacro.FileDialog)
{
	//==============================================================================
	// nexacro.FileDialogEventInfo
	//==============================================================================
	nexacro.FileDialogEventInfo = function (strEventId, strReason, strPath, arrVirtualfiles)
	{
		this.eventid = strEventId;												// 이벤트ID
		this.reason = strReason;												// 이벤트 발생분류 코드
		this.path = strPath;													// 선택한 디렉토리 경로
		this.virtualfiles = arrVirtualfiles;									// 선택한 파일(VirtualFile)의 Array
	}
	var _pFileDialogEventInfo = nexacro.FileDialogEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.FileDialogEventInfo);
	_pFileDialogEventInfo._type_name = "FileDialogEventInfo";

	delete _pFileDialogEventInfo;
	_pFileDialogEventInfo = null;

	//==============================================================================
	// nexacro.FileDialog
	// 로컬시스템의 파일을 찾거나 저장하기 위해 사용되는  파일선택 대화상자(File Dialog) Object
	//==============================================================================
	nexacro.FileDialog = function (id, parent)
	{
		this.id = this.name = id;
		this.EnvironmentPath = 1; // 내장 1, 외장 2 (안드로이드 런타임 전용)

		this._handle = nexacro._createFileDialogHandle(this);
	};

	var _pFileDialog = nexacro.FileDialog.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.FileDialog);
	_pFileDialog._type_name = "FileDialog";

	/* default properties */
	_pFileDialog.accept = "";
	_pFileDialog.defaultextension = true;
	_pFileDialog.dialogtype = undefined;
	_pFileDialog.filter = "";
	_pFileDialog.filterindex = 0;

	/* event list */
	_pFileDialog._event_list = {
		"onclose": 1
	};

	/* FileDialog Constant */
	nexacro.FileDialog.LOAD = 1;
	nexacro.FileDialog.SAVE = 2;
	nexacro.FileDialog.MULTILOAD = 3;
	nexacro.FileDialog.SELFOLDER = 4;

	//===============================================================
	// nexacro.FileDialog : Create & Destroy & Update
	//===============================================================
	_pFileDialog.on_created = nexacro._emptyFn;

	_pFileDialog.destroy = function ()
	{
		nexacro._destroyFileDialogHandle(this);
		this._handle = null;

		return true;
	};

	//===============================================================
	// nexacro.FileDialog : Properties
	//===============================================================
	_pFileDialog.set_accept = function (v)
	{
		v = nexacro._toString(v);
		if (this.accept != v)
		{
			this.accept = v;
			this.on_apply_accept();
		}
	};

	_pFileDialog.on_apply_accept = function ()
	{
		nexacro._setFileDialogHandleAccept(this, this.accept);
	};

	_pFileDialog.set_defaultextension = function (v)
	{
		v = nexacro._toBoolean(v);
		if (this.defaultextension != v)
		{
			this.defaultextension = v;
			this.on_apply_defaultextension();
		}
	};

	_pFileDialog.on_apply_defaultextension = function ()
	{
		nexacro._setFileDialogHandleDefaultExtension(this, this.defaultextension);
	};

	_pFileDialog.set_dialogtype = function (v)
	{
		if (this.dialogtype != v)
		{
			this.dialogtype = v;
		}
	};

	_pFileDialog.set_filter = function (v)
	{
		v = nexacro._toString(v);
		if (this.filter != v)
		{
			if (this._isValidPropertyFilter(v))
			{
				this.filter = v;
				this.on_apply_filter();
			}
		}
	};

	_pFileDialog.on_apply_filter = function ()
	{
		nexacro._setFileDialogHandleFilter(this, this.filter);
	};

	_pFileDialog.set_filterindex = function (v)
	{
		if (isNaN(v = +v) || v < 0)
		{
			return;
		}

		if (this.filterindex != v)
		{
			this.filterindex = v;
			this.on_apply_filterindex();
		}
	};

	_pFileDialog.on_apply_filterindex = function ()
	{
		nexacro._setFileDialogHandleFilterIndex(this, this.filterindex);
	};

	//===============================================================
	// nexacro.FileDialog : Methods
	//===============================================================
	_pFileDialog.open = function (strTitle, constOpenMode, strInitialPath, strFileName)
	{
		if (isNaN(constOpenMode = +constOpenMode) || (constOpenMode < 1 || constOpenMode > 4))
		{
			return;
		}

		strTitle = strTitle ? strTitle : this.id;
		strInitialPath = strInitialPath ? strInitialPath : "%USERAPP%";
		strFileName = strFileName ? strFileName : "";

		var filter = this.filter ? this.filter : "All(*.*)|*.*|";
		var filterarr = filter.split("|");

		if (this.filter == "")
		{
			nexacro._setFileDialogHandleFilter(this, "All(*.*)|*.*|");
		}

		if (this.defaultextension && this.filterindex >= (filterarr.length / 2))
		{
			return false;
		}

		nexacro._openFileDialogHandle(this, strTitle, constOpenMode, strInitialPath, strFileName, this.dialogtype);

		return true;
	};

	//===============================================================
	// nexacro.FileDialog : Event Handlers
	//===============================================================
	_pFileDialog.on_close = function (reason, path, vfiles)
	{
		this.on_fire_onclose(reason, path, vfiles);
	};

	_pFileDialog._onclose = function (objData) // android runtime & iOS hybrid
	{
		var _virtualFile = objData.virtualfiles;
		var vfiles = new Array(_virtualFile.length);

		for (var i = 0; i < _virtualFile.length; i++)
		{
			var obj = new nexacro.VirtualFile("VirtualFile", "");
			obj.filename = _virtualFile[i].filename;
			obj.fullpath = _virtualFile[i].fullpath;
			obj.path = _virtualFile[i].path;
			vfiles[i] = obj;
		}

		this.on_fire_onclose(objData.reason, objData.reason == 4 ? objData.path : undefined, vfiles);
	};

	_pFileDialog.on_fire_onclose = function (reason, path, vfiles)
	{
		if (this.onclose && this.onclose._has_handlers)
		{
			var evt = new nexacro.FileDialogEventInfo("onclose", reason, path, vfiles);
			return this.onclose._fireEvent(this, evt);
		}
		return true;
	};

	//===============================================================
	// nexacro.FileDialog : Logical Part
	//===============================================================

	//===============================================================
	// nexacro.FileDialog : Util Function
	//===============================================================
	_pFileDialog._isValidPropertyFilter = function (strFilter)
	{
		if (strFilter === "")
			return true;

		var filterarr = strFilter.split("|");
		var f_len = filterarr.length;
		if (f_len < 2)
		{
			return false;
		}

		if ((f_len % 2 == 1) && filterarr[f_len - 1] != "")
		{
			return false;
		}

		var normalize = /[\*].[a-zA-Z0-9가-힣\*]/gi;

		for (var i = 0; i < f_len; i++)
		{
			if (i % 2 == 1)
			{
				if (normalize.test(filterarr[i]) == false)
				{
					return false;
				}
				normalize.lastIndex = 0;
			}
		}

		return true;
	};

	delete _pFileDialog;
}

//==============================================================================
//08. Camera
//==============================================================================

//==============================================================================
//nexacro.Camera
//모바일 기기의 카메라 장비를 연동하여 촬영한 이미지 또는 이미지 경로를 얻는다.
//==============================================================================
if (!nexacro.Camera)
{
    nexacro.Camera = function (name, parent)
    {
        this.id = this.name = name || null;
        if (parent)
            this.parent = parent;

        this._id = nexacro.Device.makeID();
        nexacro.Device._userCreatedObj[this._id] = this;
   
        this.imagequality = "100";								// 이미지 Quality 값 (JPEG)
        this.imagewidth = "0";				 					// 이미지의 넓이
        this.imageheight = "0";				 					// 이미지의 높이
        this.encodingtype = "JPEG";				 				// 이미지 인코딩 타입 ("JPEG", "PNG")
        this.gettype = "url";                                   // 리턴받을 이미지 형태 (‘url’, ‘imagedata’)
        this.usegallery = true;                                 // 갤러리에 저장 여부 

        this.enableevent = true;

        this._event_list = {
            "oncapture": 1, "onerror": 1
        };

        this.oncapture = null;
        this.onerror = null;

        var params = '""';
        var jsonstr = "";

        jsonstr = '{"id":' + this._id + ', "div":"Camera", "method":"constructor", "params":' + params + '}';       
        nexacro.Device.exec(jsonstr);
    };

    var _pCamera = nexacro.Camera.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.Camera);
    _pCamera._type_name = "Camera";

    _pCamera.destroy = function()
    {
        var params = '""';
        var jsonstr;

        delete nexacro.Device._userCreatedObj[this._id];
       
        jsonstr = '{"id":' + this._id + ', "div":"Camera", "method":"destroy", "params":' + params + '}';
        nexacro.Device.exec(jsonstr);

        return true;
    };

    _pCamera.on_created = function() {};

    //===============================================================
    // nexacro.Camera : Properties
    //===============================================================
    _pCamera.set_imagequality = function(v)
    {
        if (typeof (v) == "undefined" || v == null || v == "")
        {
            this.imagequality = 100;
        }
        else
        {
            if (v >= 0 && v <= 100)
            {
                this.imagequality = v;
            }
            else
            {                
                return false;
            }
        }
        return true;
    };

    _pCamera.set_imagewidth = function(v)
    {
        if (typeof (v) == "undefined" || v == null || v == "")
        {
            this.imagewidth = 0;
        }
        else
        {
            if (v >= 0)
            {
                this.imagewidth = v;
            }
            else
            {  
                return false;
            }
        }
        return true;
    };

    _pCamera.set_imageheight = function(v)
    {
        if (typeof (v) == "undefined" || v == null || v == "")
        {
            this.imageheight = 0;
        }
        else
        {
            if (v >= 0)
            {
                this.imageheight = v;
            }
            else
            {               
                return false;
            }
        }
        return true;
    };

    _pCamera.set_encodingtype = function(v)
    {
        if (typeof (v) == "undefined" || v == null || v == "")
        {
            this.encodingtype = "JPEG";
        }
        else
        {
            if (v == "JPEG" || v.toUpperCase() == "JPEG")
            {
                this.encodingtype = "JPEG";
            }
            else if (v == "PNG" || v.toUpperCase() == "PNG")
            {
                this.encodingtype = "PNG";
            }
            else
            {                
                return false;
            }
        }
        return true;
    };

    _pCamera.set_gettype = function(v)
    {
        if (typeof (v) == "undefined" || v == null || v == "")
        {
            this.gettype = "url";
        }
        else
        {
            if (v.toLowerCase() == "url")
            {
                this.gettype = "url";
            }
            else if (v.toLowerCase() == "imagedata")
            {
                this.gettype = "imagedata";
            }
            else
            {              
                return false;
            }
        }
        return true;
    };

    _pCamera.set_usegallery = function (v)
    {
        if (typeof (v) == "string")
        {
            if (v.toUpperCase() == "TRUE")
                this.usegallery = true;
            else
                this.usegallery = false;
        }
        else
        {
            this.usegallery = v ? true : false;
        }
    };

    //===============================================================
    // nexacro.Camera : Methods
    //===============================================================
    _pCamera.takePicture = function()
    {
        // 이미지를 얻기위해 카메라 어플리케이션을 구동시킨다.		
        if (this.paramck_takePicture(this.imagequality, this.imagewidth, this.imageheight, this.encodingtype, this.gettype))
        {
            var params = '{  "quality":"' + this.imagequality.toString();
            params += '", "width":"' + this.imagewidth.toString();
            params += '", "height":"' + this.imageheight.toString();
            params += '", "encodingType":"' + this.encodingtype.toString();
            params += '", "gettype":"' + this.gettype.toString();	// "url", "imagedata"
            params += '", "usegallery":"' + this.usegallery;
            params += '"}';

            var jsonstr = "";
            jsonstr = '{"id":' + this._id + ', "windowhandle":"' + this.parent._getWindow().handle + '", "div":"Camera", "method":"takePicture", "params":' + params + '}';
            nexacro.Device.exec(jsonstr);
        }
    };

    //===============================================================
    // nexacro.Camera : Event Handlers
    //===============================================================
    _pCamera._oncapture = function(objData)
    {
        var e;
        if (nexacro.Device.curDevice == DeviceType.WINDOWS && typeof objData == "string")
        {
            //trace("{{_pCamera._oncapture[objData=" + objData + ", typeof objData=" + typeof objData + "]}}");
            var jsonObjData = JSON.parse(objData);
            if (jsonObjData)
            {
                e = new nexacro.CameraEventInfo("oncapture", jsonObjData.reason, jsonObjData.url, jsonObjData.imagedata, jsonObjData.imagewidth, jsonObjData.imageheight);
            }
        }
        else
        {
            e = new nexacro.CameraEventInfo("oncapture", objData.reason, objData.url, objData.imagedata, objData.imagewidth, objData.imageheight);
        }
        this._fire_oncapture(this, e);
    };

    _pCamera._fire_oncapture = function(objCamera, eCameraEventInfo)
    {
        if (this.oncapture && this.oncapture._has_handlers)
        {
            return this.oncapture._fireEvent(this, eCameraEventInfo);
        }
        return true;
    };

    _pCamera._onerror = function(objData)
    {
        var e;
        if (nexacro.Device.curDevice == DeviceType.WINDOWS && typeof objData == "string")
        {
            //trace("{{_pCamera._onerror[objData=" + objData + ", typeof objData=" + typeof objData + "]}}");
            var jsonObjData = JSON.parse(objData);
            if (jsonObjData)
            {
                e = new nexacro.CameraErrorEventInfo("onerror", jsonObjData.errorcode, jsonObjData.errormsg);
            }
        }
        else
        {
            e = new nexacro.CameraErrorEventInfo("onerror", objData.errorcode, objData.errormsg);
        }
        this._fire_onerror(this, e);
    };

    _pCamera._fire_onerror = function(objCamera, eCameraErrorEventInfo)
    {
        if (this.onerror && this.onerror._has_handlers)
        {
            return this.onerror._fireEvent(this, eCameraErrorEventInfo);
        }
        return true;
    };

    //===============================================================
    // nexacro.Camera : Logical Part
    //===============================================================
    _pCamera.paramck_takePicture = function (nQuality, nWidth, nHeight, strEncodingType, strGetType)
    {
        if (nQuality != null)
        {
            if (!nexacro.Device.publicNumCheck(nQuality))
            {
                return false;
            }
        }

        if (nWidth != null)
        {
            if (!nexacro.Device.publicNumCheck(nWidth))
            {
                return false;
            }
        }

        if (nHeight != null)
        {
            if (!nexacro.Device.publicNumCheck(nHeight))
            {
                return false;
            }
        }

        if (strGetType != null)
        {
            if (typeof (strGetType) != "string")
            {
                return false;
            }
        }

        if (strEncodingType != null)
        {
            if (typeof (strEncodingType) != "string")
            {
                return false;
            }
        }

        return true;
    };

    delete _pCamera;
}

//==============================================================================
//nexacro.CameraEventInfo
//카메라 어플리케이션 종료 후 이미지를 얻는데 성공했을 때 발생되는 이벤트에서 사용되는 EventInfo Object
//==============================================================================
if (!nexacro.CameraEventInfo)
{
    nexacro.CameraEventInfo = function (strEventId, strReason, strUrl, strImagedata, strImagewidth, strImageheight)
    {
        this.eventid = strEventId;												// 이벤트ID
        this.reason = strReason;												// 이벤트 발생분류 코드
        this.url = strUrl;														// 이미지 파일의 소스 URL
        this.imagedata = strImagedata;											// 이미지 데이터
        this.imagewidth = strImagewidth;								// 이미지 width
        this.imageheight = strImageheight;							// 이미지 height 
    };
    var _pCameraEventInfo = nexacro.CameraEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.CameraEventInfo);    
    _pCameraEventInfo._type_name = "CameraEventInfo";

    delete _pCameraEventInfo;
}

//==============================================================================
//nexacro.CameraErrorEventInfo
//카메라 어플리케이션이 취소되었거나 종료된 후 촬영된 이미지를 얻는데 실패했을 때 발생되는 이벤트의 EventInfo Object
//==============================================================================
if (!nexacro.CameraErrorEventInfo)
{
    nexacro.CameraErrorEventInfo = function(strEventId, intErrorCode, strErrorMsg)
    {
        this.eventid = strEventId;												// 이벤트ID
		this.errortype = "ObjectError";
		this.statuscode = intErrorCode;											// 오류코드 : integer 로 된 errorcode (iOS/Android에서 발생하는 errorcode를 그대로 사용)
        this.errormsg = strErrorMsg;											// 오류메세지 : string으로 된 errormsg (iOS/Android에서 발생하는 error message를 그대로 사용)
    };
    var _pCameraErrorEventInfo = nexacro.CameraErrorEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.CameraErrorEventInfo);    
    _pCameraErrorEventInfo._type_name = "CameraErrorEventInfo";

    delete _pCameraErrorEventInfo;
}

//==============================================================================
// 14. Image Picker
//==============================================================================

//==============================================================================
// nexacro.ImagePicker
// 모바일 기기의 사진앨범을 연동하여 저장되어 있는 이미지 또는 이미지 경로를 얻는다.
//==============================================================================
if (!nexacro.ImagePicker)
{
    nexacro.ImagePicker = function (name, parent)
    {
        this.id = this.name = name || null;
        if (parent)
            this.parent = parent;

        this._id = nexacro.Device.makeID();
        nexacro.Device._userCreatedObj[this._id] = this;
      
        this.imagequality = "100";								// 이미지 Quality 값 (JPEG)
        this.imagewidth = "0";				 					// 이미지의 넓이
        this.imageheight = "0";				 					// 이미지의 높이
        this.encodingtype = "JPEG";				 				// 이미지 인코딩 타입 ("JPEG", "PNG")
        this.gettype = "url";                                   // 리턴받을 이미지 형태 (‘url’, ‘data’)ta’)

        this.enableevent = true;

        this._event_list = {
            "onsuccess": 1, "onerror": 1
        };
        this.onsuccess = null;
        this.onerror = null;

        var params = '""';
        var jsonstr = "";
        if (nexacro.Device.curDevice == DeviceType.ANDROID)
        {
            jsonstr = '{"id":' + this._id + ', "div":"ImagePicker", "method":"constructor", "params":' + params + '}';
        }
        else
        {
            jsonstr = '{"id":' + this._id + ', "div":"Camera", "method":"constructor", "params":' + params + '}';
        }
        nexacro.Device.exec(jsonstr);
    };
    var _pImagePicker = nexacro.ImagePicker.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.ImagePicker);    
    _pImagePicker._type_name = "ImagePicker";
    
    _pImagePicker.destroy = function()
    {
        var params = '""';
        var jsonstr;

        delete nexacro.Device._userCreatedObj[this._id];
        if (nexacro.Device.curDevice == DeviceType.ANDROID)
        {
            jsonstr = '{"id":' + this._id + ', "div":"ImagePicker", "method":"destroy", "params":' + params + '}';
        }
        else
        {
            jsonstr = '{"id":' + this._id + ', "div":"Camera", "method":"destroy", "params":' + params + '}';
        }
        nexacro.Device.exec(jsonstr);
        return true;
    };

    _pImagePicker.on_created = function() {};

    //===============================================================
    // nexacro.ImagePicker : Properties
    //===============================================================
    _pImagePicker.set_imagequality = function(v)
    {
        if (typeof (v) == "undefined" || v == null || v == "")
        {
            this.imagequality = 100;
        }
        else
        {
            if (v >= 0 && v <= 100)
            {
                this.imagequality = v;
            }
            else
            {              
                return false;
            }
        }
        return true;
    };

    _pImagePicker.set_imagewidth = function(v)
    {
        if (typeof (v) == "undefined" || v == null || v == "")
        {
            this.imagewidth = 0;
        }
        else
        {
            if (v >= 0)
            {
                this.imagewidth = v;
            }
            else
            {                
                return false;
            }
        }
        return true;
    };

    _pImagePicker.set_imageheight = function(v)
    {
        if (typeof (v) == "undefined" || v == null || v == "")
        {
            this.imageheight = 0;
        }
        else
        {
            if (v >= 0)
            {
                this.imageheight = v;
            }
            else
            {  
                return false;
            }
        }
        return true;
    };

    _pImagePicker.set_encodingtype = function(v)
    {
        if (typeof (v) == "undefined" || v == null || v == "")
        {
            this.encodingtype = "JPEG";
        }
        else
        {
            if (v == 0)
            {
                this.encodingtype = "JPEG";
            }
            else if (v == 1)
            {
                this.encodingtype = "PNG";
            }
            else if (v == "JPEG" || v.toUpperCase() == "JPEG")
            {
                this.encodingtype = "JPEG";
            }
            else if (v == "PNG" || v.toUpperCase() == "PNG")
            {
                this.encodingtype = "PNG";
            }
            else
            {
                return false;
            }
        }
        return true;
    };

    _pImagePicker.set_gettype = function(v)
    {
        if (typeof (v) == "undefined" || v == null || v == "")
        {
            this.gettype = "url";
        }
        else
        {
            if (v == 0)
            {
                this.gettype = "url";
            }
            else if (v == 1)
            {
                this.gettype = "imagedata";
            }
            else if (v.toLowerCase() == "url")
            {
                this.gettype = "url";
            }
            else if (v.toLowerCase() == "imagedata")
            {
                this.gettype = "imagedata";
            }
            else
            {
                return false;
            }
        }
        return true;
    };

    //===============================================================
    // nexacro.ImagePicker : Methods
    //===============================================================
    _pImagePicker.open = function (enumGettype, enumGetimagetype)
    {
        // 이미지를 얻기위해 카메라 어플리케이션을 구동시킨다.		
        if (enumGettype != null && typeof (enumGettype) != "undefined" && (typeof (enumGettype) == "string" &&
            ((enumGettype.toLowerCase() == "url") || (enumGettype.toLowerCase() == "imagedata"))) ||
             ((enumGettype == 0) || (enumGettype == 1) || (enumGettype == "0") || (enumGettype == "1")))
            this.gettype = enumGettype;
        else
            return false;

        if (enumGetimagetype != null && typeof (enumGetimagetype) != "undefined" && (typeof (enumGetimagetype) == "string" &&
          ((enumGetimagetype.toUpperCase() == "JPEG") || (enumGetimagetype.toUpperCase() == "PNG"))) ||
            ((enumGetimagetype == 0) || (enumGetimagetype == 1) || (enumGetimagetype == "0") || (enumGetimagetype == "1")))
            this.encodingtype = enumGetimagetype;
        else
            return false;

        if (this.paramck_ImagePicker_asyncOpen(this.imagequality, this.imagewidth, this.imageheight, this.encodingtype, this.gettype))
        {
            var params = '{  "quality":"' + this.imagequality.toString();
            params += '", "width":"' + this.imagewidth.toString();
            params += '", "height":"' + this.imageheight.toString();
            params += '", "encodingType":"' + this.encodingtype.toString(); // JPEG, PNG
            params += '", "gettype":"' + this.gettype.toString();	// url, imagedata
            params += '"}';

            var jsonstr = "";
            if (nexacro.Device.curDevice == DeviceType.ANDROID)
            {
                jsonstr = '{"id":' + this._id + ', "div":"ImagePicker", "method":"open", "params":' + params + '}';
            }
            else
            {
                jsonstr = '{"id":' + this._id + ', "div":"Camera", "method":"open", "params":' + params + '}';
            }

            nexacro.Device.exec(jsonstr);
            return true;
        }
        else
        {
            return false;
        }
    };

    //===============================================================
    // nexacro.ImagePicker : Event Handlers
    //===============================================================
    _pImagePicker._onsuccess = function(objData)
    {
        var e = new nexacro.ImagePickerEventInfo("onsuccess", objData.url, objData.imagedata, objData.imagefile);
        this._fire_onsuccess(this, e);
    };

    _pImagePicker._fire_onsuccess = function(objImagePicker, eImagePickerEventInfo)
    {
        if (this.onsuccess && this.onsuccess._has_handlers)
        {
            return this.onsuccess._fireEvent(this, eImagePickerEventInfo);
        }
        return true;
    };

    _pImagePicker._onerror = function(objData)
    {
        var e = new nexacro.ImagePickerErrorEventInfo("onerror", objData.errorcode, objData.errormsg);
        this._fire_onerror(this, e);
    };

    _pImagePicker._fire_onerror = function(objImagePicker, eImagePickerErrorEventInfo)
    {
        if (this.onerror && this.onerror._has_handlers)
        {
            return this.onerror._fireEvent(this, eImagePickerErrorEventInfo);
        }
        return true;
    };

    //===============================================================
    // nexacro.ImagePicker : Logical Part
    //===============================================================
    _pImagePicker.paramck_ImagePicker_asyncOpen = function (nQuality, nWidth, nHeight, strEncodingType, strGetType)
    {
        if (nQuality != null)
        {
            if (!nexacro.Device.publicNumCheck(nQuality))
            {
                return false;
            }
        }

        if (nWidth != null)
        {
            if (!nexacro.Device.publicNumCheck(nWidth))
            {
                return false;
            }
        }

        if (nHeight != null)
        {
            if (!nexacro.Device.publicNumCheck(nHeight))
            {
                return false;
            }
        }

        if (strGetType != null)
        {
            if (typeof (strGetType) != "string")
            {
                return false;
            }
        }

        if (strEncodingType != null)
        {
            if (typeof (strEncodingType) != "string")
            {
                return false;
            }
        }
        return true;
    };

    delete _pImagePicker;
}

//==============================================================================
// nexacro.ImagePickerEventInfo
// 카메라 어플리케이션 종료 후 이미지를 얻는데 성공했을 때 발생되는 이벤트에서 사용되는 EventInfo Object
//==============================================================================
if (!nexacro.ImagePickerEventInfo)
{
    nexacro.ImagePickerEventInfo = function(strEventId, strUrl, strImagedata, strImagefile)
    {
        this.eventid = strEventId;												// 이벤트ID
        this.imageurl = strUrl;														// 이미지 파일의 소스 URL
        this.imagedata = strImagedata;											// 이미지 데이터
        this.imagefile = strImagefile;                                          // fullname, fullpath, path array
    };
    var _pImagePickerEventInfo = nexacro.ImagePickerEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.ImagePickerEventInfo);    
    _pImagePickerEventInfo._type_name = "ImagePickerEventInfo";

    delete _pImagePickerEventInfo;
}

//==============================================================================
// nexacro.ImagePickerErrorEventInfo
// 카메라 어플리케이션이 취소되었거나 종료된 후 촬영된 이미지를 얻는데 실패했을 때 발생되는 이벤트의 EventInfo Object
//==============================================================================
if (!nexacro.ImagePickerErrorEventInfo)
{
    nexacro.ImagePickerErrorEventInfo = function(strEventId, intErrorCode, strErrorMsg)
    {
        this.eventid = strEventId;												// 이벤트ID
		this.errortype = "ObjectError";
		this.statuscode = intErrorCode;											// 오류코드 : integer 로 된 errorcode (iOS/Android에서 발생하는 errorcode를 그대로 사용)
        this.errormsg = strErrorMsg;											// 오류메세지 : string으로 된 errormsg (iOS/Android에서 발생하는 error message를 그대로 사용)
    };
    var _pImagePickerErrorEventInfo = nexacro.ImagePickerErrorEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.ImagePickerErrorEventInfo);    
    _pImagePickerErrorEventInfo._type_name = "ImagePickerErrorEventInfo";

    delete _pImagePickerErrorEventInfo;
}

//==============================================================================
// 13. AudioRecorder
//==============================================================================

//==============================================================================
// nexacro.AudioRecorder
// 모바일 기기의 오디오를 레코딩하여 파일로 저장한다.
//==============================================================================
if (!nexacro.AudioRecorder)
{
    nexacro.AudioRecorder = function (name, parent)
    {
        this.id = this.name = name || null;
        if (parent)
            this.parent = parent;

        this._refform = parent;
		this._id = nexacro.Device.makeID();
		nexacro.Device._userCreatedObj[this._id] = this;
		
	    // status manage
	    this.brecording = false;
	    this.bpaused = false;
	    this.reccurtime = "";
    
		this.audiofile = "";										// 저장할 오디오 파일객체
		this.samplerate = 8000;										// 샘플 비율
		this.channelconfig = 1;										// 오디오 채널의 종류

		if (nexacro.Device.curDevice == DeviceType.ANDROID)
		{
			this.audioformat = "mp3";									// 오디오 데이터의 포멧
		}
		else
		{
			this.audioformat = "wav";
		}

		this.enableevent = true;
		this._is_alive = true; 
		//this.onrecord = new nexacro.EventListener("onrecord");	// 모바일 기기에서 오디오 데이터를 레코딩중일 때 발생하는 이벤트
		//this.onrecording = new nexacro.EventListener("onrecording");	// 모바일 기기에서 오디오 데이터를 레코딩중일 때 발생하는 이벤트
		//this.onstop = new nexacro.EventListener("onstop");				// 모바일 기기에서 오디오 데이터의 레코딩이 종료 되었을 때 발생하는 이벤트
		//this.onerror = new nexacro.EventListener("onerror");			// 모바일 기기에서 오디오 데이터의 레코딩 처리가 실패했을 때 발생하는 이벤트
		
		this._event_list =
        {
		    "onrecord":1, "onrecording":1, "onstop":1, "onerror":1
	    };	
	    
		this.onrecord = null;
		this.onrecording = null;
		this.onstop = null;
		this.onerror = null;
					    
		var params = '""';
        var jsonstr = "";
       
        jsonstr = '{"id":' + this._id + ', "div":"AudioRecorder", "method":"constructor", "params":' + params + '}';
        nexacro.Device.exec(jsonstr);
    };

    var _pAudioRecorder = nexacro.AudioRecorder.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.AudioRecorder);	
	_pAudioRecorder._type_name = "AudioRecorder";

	_pAudioRecorder.destroy = function()
	{
		var params = '""';
		var jsonstr;
		this._is_alive = false;
		 
		delete nexacro.Device._userCreatedObj[this._id];
		
		jsonstr = '{"id":' + this._id + ', "div":"AudioRecorder", "method":"destroy", "params":' + params + '}';		
		nexacro.Device.exec(jsonstr);

		return true;
	};
	
	_pAudioRecorder.on_created = function() { };
		
	_pAudioRecorder._getReferenceContext = function()
	{
		return this._refform;
	};
	
    //===============================================================
    // nexacro.AudioRecorder : Properties
    //===============================================================
	_pAudioRecorder.set_audiofile = function(v)
	{
	    if (typeof (v) == "undefined" || v == null || v == "")
	    {
            return false;
	    }
	    else
	    {
        	this.audiofile = v;
        }
        return true;
	};

	_pAudioRecorder.set_samplerate = function(v)
	{
	    if (typeof (v) == "undefined" || v == null)
	    {
            return false;
	    }
	    else
	    {
	        if (nexacro.Device.publicNumCheck(v))
	        {
	            if (v >= 8000 && v <= 96000)
	            {
					this.samplerate = v;
				}
				else
				{
					return false;
				}
	        }
	        else
	        {
        		return false;
        	}
        }
        return true;
	};

	_pAudioRecorder.set_channelconfig = function(v)
	{
	    if (typeof (v) == "undefined" || v == null)
	    {
            return false;
	    }
	    else
	    {
	        if (v == 1 || v == 2)
	        {
        		this.channelconfig = v;
        	}
        	else
        	{
        		return false;
        	}
        }
        return true;
	};

	_pAudioRecorder.set_audioformat = function(v)
	{
	    if (typeof (v) == "undefined" || v == null)
	    {
            return false;
	    }
	    else
	    {
			var dotIndex =  v.lastIndexOf(".");
			var extentionStr = v.substring(dotIndex,v.length).toUpperCase();
			
			if (nexacro.Device.curDevice == DeviceType.ANDROID)
			{
				if (extentionStr == "OGG" || extentionStr == "AMR_NB" || extentionStr == "AMR_WB" || extentionStr == "MP3") 
				{
    				this.audioformat = v.toUpperCase();
				}
				else
				{
					return false;
				}
			}
			else
			{
			    if (extentionStr == "WAV")
			    {
    				this.audioformat = "WAV"; 
				}
				else
				{
					return false;
				}
    		}
        }
        return true;
    };
	
    //===============================================================
    // nexacro.AudioRecorder : Methods
    //===============================================================
	_pAudioRecorder.recordingStart = function(nIntervalTime)
	{
	    //모바일 기기에서 오디오 데이터의 레코딩을 시작한다

		var IntervalTimeState;
		if (typeof (nIntervalTime) == "undefined" || nIntervalTime == null || nIntervalTime == "")
		{
		    nIntervalTime = 0;
		    IntervalTimeState = 1;
		}		
		else
		{
		    if (nexacro.Device.publicNumCheck(nIntervalTime) && nIntervalTime <= 86400000 && nIntervalTime >= 0)
		    {
		        if (nIntervalTime < 200)
		        {
					return false;
		        }
		        else
		        {
					IntervalTimeState = 0;
				}
		    }
		    else
		    {
				return false;
			}
		}

		// rec status manage
		if (this.brecording == true)
		{
		    nexacro._OnceCallbackTimer.callonce(this, function()
		    {
				var e = new nexacro.AudioErrorEventInfo("onerror", this.audiofile, this.reccurtime, "1301", "Already recording");
				this._fire_onerror(this, e);			
			}, 20);

		    return false;
		}
        
		if (this.audiofile == "" || typeof (this.audiofile) == "undefined")
		{    	
			var arobj = this;
			nexacro._OnceCallbackTimer.callonce(this, function()
			{
				var e = new nexacro.AudioErrorEventInfo("onerror", this.audiofile, this.reccurtime, "1304", "Recording Setting Error");
				this._fire_onerror(this, e);			
			}, 20);

			return false;
        }

        var jsonstr, rootPathCheck, params;
		if (nexacro.Device.curDevice == DeviceType.ANDROID)
		{
			var EnvironmentPath = "";
			var androidFilePath = "";
			rootPathCheck = this.audiofile.substring(0,9);
			
			if (rootPathCheck.toLowerCase() == "%userapp%")
			{
				EnvironmentPath = 1;
				androidFilePath = this.audiofile.substring(9, this.audiofile.length);
			}
			else if (rootPathCheck.toLowerCase() == "%sd_card%")
			{
				EnvironmentPath = 2;
				androidFilePath = this.audiofile.substring(9, this.audiofile.length);
			}
			else
			{
			    nexacro._OnceCallbackTimer.callonce(this, function()
			    {
					var e = new nexacro.AudioErrorEventInfo("onerror", this.audiofile, this.reccurtime, "1304", "Recording Setting Error");
					this._fire_onerror(this, e);			
				}, 20);
			
				return false;
			}
			
			params = '{  "audiofile":"' + androidFilePath;
			params+= '", "samplerate":"' + this.samplerate;
			params+= '", "channelconfig":"' + this.channelconfig;
			params+= '", "audioFormat":"' + this.audioformat;
			params+= '", "EnvironmentPath":"' + EnvironmentPath;
			params+= '", playingeventtime:"' + nIntervalTime;
	        params+= '", intervaltimestate:"' + IntervalTimeState;
	        params += '"}';

	        jsonstr = "";
	        jsonstr = '{"id":' + this._id + ', "div":"AudioRecorder", "method":"recordingStart", "params":' + params + '}';
	        
		}
		else
		{
        	var iPhoneFilePath = "";
        	rootPathCheck = this.audiofile.substring(0,9);

        	if (rootPathCheck.toLowerCase() == "%userapp%")
        	{
        		iPhoneFilePath = "_userapp_" + this.audiofile.substring(9,this.audiofile.length);
        	}
        	else
        	{
        	    nexacro._OnceCallbackTimer.callonce(this, function()
        	    {
					var e = new nexacro.AudioErrorEventInfo("onerror", this.audiofile, this.reccurtime, "1304", "Recording Setting Error");
					this._fire_onerror(this, e);			
				}, 20);
        		return false;
        	}

        	params = '{ "audiofile":"' + iPhoneFilePath;
        	params+= '", "samplerate":"' + this.samplerate;
        	params+= '", "channelconfig":"' + this.channelconfig;
        	params+= '", "audioFormat":"' + this.audioformat;
			params+= '", "playingeventtime":"' + nIntervalTime;
            params+= '", "intervaltimestate":"' + IntervalTimeState;
        	params+= '"}';

      		jsonstr = "";
      		jsonstr = '{"id":' + this._id + ', "div":"Sound", "method":"recordingStart", "params":' + params + '}';
		}

		nexacro.Device.exec(jsonstr);

        return true;
	};
    
	_pAudioRecorder.recordingStop = function ()
	{
	    //모바일 기기에서 오디오 데이타의 레코딩을 중지한다.
	    if (this.brecording == false)
	    {
	        nexacro._OnceCallbackTimer.callonce(this, function ()
	        {
	            var e = new nexacro.AudioErrorEventInfo("onerror", "", "0", "1302", "Not recording");
	            this._fire_onerror(this, e);
	        }, 20);
	        return;
	    }

	    var params = '""';
	    var jsonstr = "";
	    
	    if (nexacro.Device.curDevice == DeviceType.ANDROID)
	    {
	        jsonstr = '{"id":' + this._id + ', "div":"AudioRecorder", "method":"recordingStop", "params":' + params + '}';
	    }
	    else
	    {
	        jsonstr = '{"id":' + this._id + ', "div":"Sound", "method":"recordingStop", "params":' + params + '}';
	    }

	    nexacro.Device.exec(jsonstr);
	};

	_pAudioRecorder.pause = function ()
	{
	    //모바일 기기에서 오디오 데이타의 레코딩을 중지한다.
	    if (nexacro.Device.curDevice == DeviceType.IOS)
	    {
	        // rec status manage
	        if (this.brecording == false)
	        {
	            nexacro._OnceCallbackTimer.callonce(this, function ()
	            {
	                var e = new nexacro.AudioErrorEventInfo("onerror", "", "0", "1302", "Not recording");
	                this._fire_onerror(this, e);
	            }, 20);

	            return;
	        }
	        if (this.bpaused == true)
	        {
	            nexacro._OnceCallbackTimer.callonce(this, function ()
	            {
	                var e = new nexacro.AudioErrorEventInfo("onerror", this.audiofile, this.reccurtime, "1303", "Already paused");
	                this._fire_onerror(this, e);
	            }, 20);

	            return;
	        }

	        var params = '""';
	        var jsonstr = "";

	        jsonstr = '{"id":' + this._id + ', "div":"Sound", "method":"recpause", "params":' + params + '}';
	       
	        nexacro.Device.exec(jsonstr);
	    }
	};

	_pAudioRecorder.resume = function ()
	{
	    //모바일 기기에서 오디오 파일의 일시중지를 해제한다.
	    if (nexacro.Device.curDevice == DeviceType.IOS)
	    {
	        // rec status manage
	        if (this.brecording == false)
	        {
	            nexacro._OnceCallbackTimer.callonce(this, function ()
	            {
	                var e = new nexacro.AudioErrorEventInfo("onerror", "", "0", "1302", "Not recording");
	                this._fire_onerror(this, e);
	            }, 20);

	            return;
	        }
	        if (this.bpaused == false)
	        {
	            nexacro._OnceCallbackTimer.callonce(this, function ()
	            {
	                var e = new nexacro.AudioErrorEventInfo("onerror", this.audiofile, this.reccurtime, "1011", "Not paused");
	                this._fire_onerror(this, e);
	            }, 20);

	            return;
	        }

	        var params = '""';
	        var jsonstr = "";

	        jsonstr = '{"id":' + this._id + ', "div":"Sound", "method":"recresume", "params":' + params + '}';
	
	        nexacro.Device.exec(jsonstr);
	    }
	};

    //===============================================================
    // nexacro.AudioRecorder : Event Handlers
    //===============================================================
    /*
	_pAudioRecorder._onrecord = function (objData)
	{
		this.brecording = true;
		this.bpaused = false;	
	};
    
	_pAudioRecorder._fire_onrecord = function(objAudioPlayer, eAudioEventInfo)
	{
	    if (this.onrecord && this.onrecord._has_handlers)
	    {
			return this.onrecord._fireEvent(this, eAudioEventInfo);
		}
		return true;
	};
	*/

	_pAudioRecorder._onrecording = function(objData)
	{
		this.brecording = true;
		this.bpaused = false;
		this.reccurtime = objData.curtime;
		var e = new nexacro.AudioEventInfo("onrecording", objData.reason, objData.url, objData.playtime, objData.curtime, null, null, null);
		this._fire_onrecording(this, e);
	};

	_pAudioRecorder._fire_onrecording = function(objAudioPlayer, eAudioEventInfo)
	{
	    if (this.onrecording && this.onrecording._has_handlers)
	    {
			return this.onrecording._fireEvent(this, eAudioEventInfo);
		}
		return true;
	};
	
	_pAudioRecorder._onstop = function(objData)
	{
	    if (objData.reason == "5")
	    {
			this.brecording = false;
			this.bpaused = false;
		}
		else if (objData.reason == "6")
		{
			this.brecording= true;
			this.bpaused = true;
		}
		var e = new nexacro.AudioEventInfo("onstop", objData.reason, objData.url, objData.playtime, objData.curtime, null, null, null);
		this._fire_onstop(this, e);
	};

	_pAudioRecorder._fire_onstop = function(objAudioPlayer, eAudioEventInfo)
	{
	    if (this.onstop && this.onstop._has_handlers)
	    {
			return this.onstop._fireEvent(this, eAudioEventInfo);
		}
		return true;
	};
		
	_pAudioRecorder._onerror = function(objData)
	{
		var e = new nexacro.AudioErrorEventInfo("onerror", objData.url, objData.curtime, objData.errorcode, objData.errormsg);
		this._fire_onerror(this, e);
	};

	_pAudioRecorder._fire_onerror = function(objAudioRecoder, AudioErrorEventInfo)
	{
	    if (this.onerror && this.onerror._has_handlers)
	    {
			return this.onerror._fireEvent(this, AudioErrorEventInfo);
		}
		return true;
	};
	
	delete _pAudioRecorder;
}

//==============================================================================
// 09. ContactSet
//==============================================================================

//==============================================================================
// nexacro.ContactSet
// 모바일 기기의 연락처 데이터를 연동하여 처리한다.
//==============================================================================
if (!nexacro.ContactSet)
{
    nexacro.ContactSet = function (name, parent)
    {
        this.id = this.name = name || null;
        if (parent)
            this.parent = parent;

        this._id = nexacro.Device.makeID();
        nexacro.Device._userCreatedObj[this._id] = this;
        
        this.isRunning = false;
        this.enableevent = true;
          
        this._event_list =
        {
            "onsuccess": 1, "onerror": 1
        };

        this.onsuccess = null;
        this.onerror = null;

        var params = '""';
        var jsonstr = '{"id":' + this._id + ', "div":"ContactSet", "method":"constructor", "params":' + params + '}';
        nexacro.Device.exec(jsonstr);
    };

    var _pContactSet = nexacro.ContactSet.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.ContactSet);    
    _pContactSet._type_name = "ContactSet";

    _pContactSet.destroy = function()
    {
        var params = '""';
        var jsonstr;

        delete nexacro.Device._userCreatedObj[this._id];

        jsonstr = '{"id":' + this._id + ', "div":"ContactSet", "method":"destroy", "params":' + params + '}';
        nexacro.Device.exec(jsonstr);

        return true;
    };

    _pContactSet.on_created = function() { };

    //===============================================================
    // nexacro.ContactSet : Properties
    //===============================================================

    //Nothing.

    //===============================================================
    // nexacro.ContactSet : Methods
    //===============================================================
    _pContactSet.query = function(strQueryInfo, nResultCnt)
    {
        // 연락처를 조회한다.
        //var strQueryInfo; //조회조건문
        //var nResultCnt; //리턴할 갯수      

        if (typeof (strQueryInfo) == "undefined" || strQueryInfo == "")
        {
            return false;
        }

        if (!(nexacro.Device.pramck_contactString(strQueryInfo)))
        {
            return false;
        }

        if (nResultCnt == null || typeof (nResultCnt) == "undefined")
        {
            nResultCnt = -1;
        }
        else
        {
            var numberss;

            // 숫자가 아닌 경우도 return false
            try
            {
                numberss = Number(nResultCnt.toString());
            }
            catch (e)
            {
                return false;
            }

            if ((+numberss) != (+numberss))
            {
                return false;
            }

            // 0이거나 -1 이면 return false
            if (nResultCnt == 0 || nResultCnt < -1)
            {
                return false;
            }
        }

        // 검색어 키워드 검사 추가 2012.4.8 pg
        var arr = strQueryInfo.split(";");

        if (arr.length < 1)
        {
            return false;
        }

        for (var i = 0; i < arr.length; i++)
        {
            // 각 키워드의 짝이 맞는지 검사.
            var arr2 = arr[i].split(":");
            if (arr2.length < 2)
            {
                return false;
            }
            else
            {
                // all 과 나머지 키워드를 따로 검사함.	
                var strKeyword = arr2[0].toLowerCase();
                if (arr.length == 1)
                {
                    if (!(strKeyword == "all" || strKeyword == "uniqueid" || strKeyword == "categories" || strKeyword == "birthday" || strKeyword == "contactname" || strKeyword == "nickname" || strKeyword == "note" || strKeyword == "phonenumbers" || strKeyword == "emails" || strKeyword == "ims" || strKeyword == "urls" || strKeyword == "addresses" || strKeyword == "organizations"))
                    {
                        return false;
                    }
                }
                else
                {
                    if (!(strKeyword == "uniqueid" || strKeyword == "categories" || strKeyword == "birthday" || strKeyword == "contactname" || strKeyword == "nickname" || strKeyword == "note" || strKeyword == "phonenumbers" || strKeyword == "emails" || strKeyword == "ims" || strKeyword == "urls" || strKeyword == "addresses" || strKeyword == "organizations"))
                    {
                        return false;
                    }
                }
            }

            if (arr2[1].split(" ").join("").length == 0)
            {
                return false;
            }
        }

        // iOS 는 "?" = json error  이므로 치환 
        if (nexacro.Device.curDevice == DeviceType.IOS)
        {
            strQueryInfo = strQueryInfo.replace(/\?/g, "_QUESTION_");
        }

        // 전체 검색에 대해 필드를 지정해 주는 것으로 설계 변경 2012.3.21
        // 전체검색으로 적절히 들어오면 키워드를 빼서 보냄.
        //if (strQueryInfo.substring(0,4).toLowerCase() == "all:"){
        //	strQueryInfo = strQueryInfo.substring(4, strQueryInfo.length);
        //}

        var params = '{ "strQueryInfo":"' + strQueryInfo;
        params += '", "nResultCnt":"' + nResultCnt;
        params += '"}';

        var jsonstr = '{"id":' + this._id + ', "div":"ContactSet", "method":"query", "params":' + params + '}';

        if (this.isRunning)
        {
            return false;
        }

        this.isRunning = true;

        nexacro.Device.exec(jsonstr);
        return true;
    };

    _pContactSet.append = function(objContact)
    {
        // 연락처를 추가한다.
        if (!(objContact instanceof nexacro.Contact))
        {
            return false;
        }

        if (this.typeCheck(objContact) == false)
        {
            return false;
        }

        var params = objContact.toJson();
        var jsonstr = '{"id":' + this._id + ', "div":"ContactSet", "method":"append", "params":' + params + '}';

        if (this.isRunning)
        {
            return false;
        }

        this.isRunning = true;
        nexacro.Device.exec(jsonstr);
        return true;
    };

    _pContactSet.update = function(objContact)
    {
        // 연락처를 갱신한다.
        if (!(objContact instanceof nexacro.Contact))
        {
            return false;
        }

        if (this.typeCheck(objContact) == false)
        {
            return false;
        }

        var params = objContact.toJson();
        var jsonstr = '{"id":' + this._id + ', "div":"ContactSet", "method":"update", "params":' + params + '}';

        if (this.isRunning)
        {
            return false;
        }

        this.isRunning = true;
        nexacro.Device.exec(jsonstr);
        return true;
    };

    _pContactSet.remove = function(strUniqueID)
    {
        // 연락처를 삭제한다.
        if (typeof (strUniqueID) == "undefined")
        {
            return false;
        }

        if (strUniqueID != null)
        {
            if (((+strUniqueID) != (+strUniqueID)) || strUniqueID < 0)
            {
                return false;
            }
        }

        var params = '{ "strUniqueID":"' + strUniqueID;
        params += '"}';
        var jsonstr = '{"id":' + this._id + ', "div":"ContactSet", "method":"remove", "params":' + params + '}';

        if (this.isRunning)
        {
            return false;
        }

        this.isRunning = true;
        nexacro.Device.exec(jsonstr);
        return true;
    };

    //===============================================================
    // nexacro.ContactSet : Event Handlers
    //===============================================================
    _pContactSet._onsuccess = function(objData)
    {
        this.isRunning = false;
        var e;

        if (nexacro.Device.curDevice == DeviceType.ANDROID)
        {
            var reason = "";
            var uniqueid = "";
            var displayname = "";
            var familyname = "";
            var givenname = "";
            var middlename = "";
            var prefix = "";
            var suffix = "";
            var nickname = "";
            var birthday = "";
            var note = "";
            var phones = "";
            var emails = "";
            var ims = "";
            var categories = "";
            var urls = "";
            var address = "";
            var organ = "";
            var photo = "";
            var arr = new Array();

            for (var i = 0; i < objData.length; i++)
            {
                if (typeof (objData[i].contacts) != "undefined")
                {
                    if (typeof (objData[i].contacts.uniqueid) != "undefined")
                    {
                        uniqueid = objData[i].contacts.uniqueid;
                    }

                    if (typeof (objData[i].contacts.contactname) != "undefined")
                    {
                        // contactname.displayname
                        if (typeof (objData[i].contacts.contactname.displayname) != "undefined")
                        {
                            displayname = objData[i].contacts.contactname.displayname;
                        }

                        // contactname.familyname
                        if (typeof (objData[i].contacts.contactname.familyname) != "undefined")
                        {
                            familyname = objData[i].contacts.contactname.familyname;
                        }

                        // contactname.givenname
                        if (typeof (objData[i].contacts.contactname.givenname) != "undefined")
                        {
                            givenname = objData[i].contacts.contactname.givenname;
                        }

                        // contactname.middlename
                        if (typeof (objData[i].contacts.contactname.middlename) != "undefined")
                        {
                            middlename = objData[i].contacts.contactname.middlename;
                        }

                        // contactname.prefix
                        if (typeof (objData[i].contacts.contactname.prefix) != "undefined")
                        {
                            prefix = objData[i].contacts.contactname.prefix;
                        }

                        // contactname.suffix
                        if (typeof (objData[i].contacts.contactname.suffix) != "undefined")
                        {
                            suffix = objData[i].contacts.contactname.suffix;
                        }
                    }

                    // nickname 
                    if (typeof (objData[i].contacts.nickname) != "undefined")
                    {
                        nickname = objData[i].contacts.nickname;
                    }

                    // birthday
                    if (typeof (objData[i].contacts.birthday) != "undefined")
                    {
                        birthday = new Date(objData[i].contacts.birthday);
                    }

                    // note
                    if (typeof (objData[i].contacts.note) != "undefined")
                    {
                        note = objData[i].contacts.note;
                    }

                    var j;
                    // phonenumbers ContactField
                    if (typeof (objData[i].contacts.phonenumbers) != "undefined")
                    {
                        phones = new Array(objData[i].contacts.phonenumbers.length);
                        for (j = 0; j < objData[i].contacts.phonenumbers.length; j++)
                        {
                            var tmpPhone = new nexacro.ContactField("", objData[i].contacts.phonenumbers[j].type,
                                                                objData[i].contacts.phonenumbers[j].value,
                                                                objData[i].contacts.phonenumbers[j].label, "");
                            phones[j] = tmpPhone;
                        }
                    }
                    else
                    {
                        phones = new nexacro.ContactField("", "", "", "", "");
                    }

                    // emails ContactField
                    if (typeof (objData[i].contacts.emails) != "undefined")
                    {
                        emails = new Array(objData[i].contacts.emails.length);
                        for (j = 0; j < objData[i].contacts.emails.length; j++)
                        {
                            var tmpEmails = new nexacro.ContactField("", objData[i].contacts.emails[j].type,
                                                            objData[i].contacts.emails[j].value,
                                                            objData[i].contacts.emails[j].label, "");
                            emails[j] = tmpEmails;
                        }
                    }
                    else
                    {
                        emails = new nexacro.ContactField("", "", "", "", "");
                    }

                    // ims ContactIM
                    if (typeof (objData[i].contacts.ims) != "undefined")
                    {
                        ims = new Array(objData[i].contacts.ims.length);
                        for (j = 0; j < objData[i].contacts.ims.length; j++)
                        {
                            var tempIms = new nexacro.ContactIM("", objData[i].contacts.ims[j].type,
                                                        objData[i].contacts.ims[j].value,
                                                        objData[i].contacts.ims[j].label,
                                                        objData[i].contacts.ims[j].protocoltype,
                                                        objData[i].contacts.ims[j].protocollabel, "");
                            ims[j] = tempIms;
                        }
                    }
                    else
                    {
                        ims = new nexacro.ContactIM("", "", "", "", "", "", "");
                    }

                    // categories ContactField
                    if (typeof (objData[i].contacts.categories) != "undefined")
                    {
                        categories = new Array(objData[i].contacts.categories.length);
                        for (j = 0; j < objData[i].contacts.categories.length; j++)
                        {
                            var tmpCategories = new nexacro.ContactField("", objData[i].contacts.categories[j].type,
                                                                objData[i].contacts.categories[j].value,
                                                                objData[i].contacts.categories[j].label, "");
                            categories[j] = tmpCategories;
                        }
                    }
                    else
                    {
                        categories = new nexacro.ContactField("", "", "", "", "");
                    }

                    //urls ContactField
                    if (typeof (objData[i].contacts.urls) != "undefined")
                    {
                        urls = new Array(objData[i].contacts.urls.length);
                        for (j = 0; j < objData[i].contacts.urls.length; j++)
                        {
                            var tmpUrls = new nexacro.ContactField("", objData[i].contacts.urls[j].type,
                                                            objData[i].contacts.urls[j].value,
                                                            objData[i].contacts.urls[j].label, "");
                            urls[j] = tmpUrls;
                        }
                    }
                    else
                    {
                        urls = new nexacro.ContactField("", "", "", "", "");
                    }

                    //address ContactAddress
                    if (typeof (objData[i].contacts.addresses) != "undefined")
                    {
                        address = new Array(objData[i].contacts.addresses.length);
                        for (j = 0; j < objData[i].contacts.addresses.length; j++) {
                            var tmpAddress = new nexacro.ContactAddress("", objData[i].contacts.addresses[j].type,
                                                                objData[i].contacts.addresses[j].country,
                                                                objData[i].contacts.addresses[j].postcode,
                                                                objData[i].contacts.addresses[j].city,
                                                                objData[i].contacts.addresses[j].region,
                                                                objData[i].contacts.addresses[j].street,
                                                                objData[i].contacts.addresses[j].label, "");
                            address[j] = tmpAddress;
                        }
                    }
                    else
                    {
                        address = new nexacro.ContactAddress("", "", "", "", "", "", "", "", "");
                    }

                    // organizations ContactOrganization
                    if (typeof (objData[i].contacts.organizations) != "undefined")
                    {
                        organ = new Array(objData[i].contacts.organizations.length);
                        for (j = 0; j < objData[i].contacts.organizations.length; j++)
                        {
                            var tmpOrgan = new nexacro.ContactOrganization("", objData[i].contacts.organizations[j].type,
                                                                    objData[i].contacts.organizations[j].company,
                                                                    objData[i].contacts.organizations[j].department,
                                                                    objData[i].contacts.organizations[j].title,
                                                                    objData[i].contacts.organizations[j].label, "");
                            organ[j] = tmpOrgan;
                        }
                    }
                    else
                    {
                        organ = new nexacro.ContactOrganization("", "", "", "", "", "", "");
                    }

                    // photos ContactPhoto
                    if (typeof (objData[i].contacts.photos) != "undefined")
                    {
                        photo = new Array(objData[i].contacts.photos.length);
                        for (j = 0; j < objData[i].contacts.photos.length; j++)
                        {
                            var tmpPhoto = new nexacro.ContactPhoto("", objData[i].contacts.photos[j].imagedata,
                                                                objData[i].contacts.photos[j].label, "");
                            photo[j] = tmpPhoto;
                        }
                    }
                    else
                    {
                        photo = new nexacro.ContactPhoto("", "", "", "");
                    }

                    // all set
                    var temp = new nexacro.Contact("", uniqueid,
                                    displayname, familyname, givenname, middlename,
                                    prefix, suffix, nickname, birthday, note,
                                    phones, emails, ims, categories, urls, address, organ, photo, "");

                    arr[i] = temp;
                }

                if (nexacro.Device.curDevice == DeviceType.ANDROID)
                {
                    reason = objData[i].reason;
                }
                else
                {
                    reason = objData.reason;
                }
            }

            e = new nexacro.ContactSetEventInfo("onsuccess", reason, arr);
        }
        else
        {
            objData.contacts = this.makeContacts(objData.contacts);
            e = new nexacro.ContactSetEventInfo("onsuccess", objData.reason, objData.contacts);
        }

        this._fire_onsuccess(this, e);
    };

    _pContactSet._fire_onsuccess = function(objContactSet, eContactSetEventInfo)
    {
        if (this.onsuccess && this.onsuccess._has_handlers)
        {
            return this.onsuccess._fireEvent(this, eContactSetEventInfo);
        }
        return true;
    };

    _pContactSet._onerror = function(objData)
    {
        this.isRunning = false;
        var e = new nexacro.ContactSetErrorEventInfo("onerror", objData.errorcode, objData.errormsg);
        this._fire_onerror(this, e);
    };

    _pContactSet._fire_onerror = function(objContactSet, eContactSetErrorEventInfo)
    {
        if (this.onerror && this.onerror._has_handlers)
        {
            return this.onerror._fireEvent(this, eContactSetErrorEventInfo);
        }
        return true;
    };

    //===============================================================
    // nexacro.ContactSet : Logical Part
    //===============================================================
    _pContactSet.makeContacts = function(objData)
    {
        var str = objData;
        //        while(str.indexOf('\'')!= -1){
        //            str = str.replace("'", "\"");
        //        }

        var str2 = nexacro._executeGlobalEvalStr("(" + str + ")");
        var persons = new Array();
        persons = str2.contact;

        //반환용 contact 리스트
        var contactObjList = new Array();
        for (var k = 0; k < persons.length; k++)
        {
            var person = persons[k];
            var phoneObjList = new Array();
            var phonenumList = person.phonenumbers;
            var i;
            var tempVal;

            for (i = 0; i < phonenumList.length; i++)
            {
                var phonenum = new nexacro.ContactField("", phonenumList[i].type, phonenumList[i].value.replace(new RegExp("_NEWLINE_", "gi"), "\n"), phonenumList[i].label, "");
                phoneObjList[i] = phonenum;
            }

            var categoriObjList = new Array();
            var categoriList = person.categories;
            for (i = 0; i < categoriList.length; i++)
            {
                tempVal = new nexacro.ContactField("", categoriList[i].type, categoriList[i].value.replace(new RegExp("_NEWLINE_", "gi"), "\n"), categoriList[i].label, "");
                categoriObjList[i] = tempVal;
            }

            var photoObjList = new Array();
            var photoList = person.photos;
            for (i = 0; i < photoList.length; i++)
            {
                tempVal = new nexacro.ContactPhoto("", photoList[i].imagedata, photoList[i].label, "");
                photoObjList[i] = tempVal;
            }

            var organizationObjList = new Array();
            var organizationList = person.organizations;
            for (i = 0; i < organizationList.length; i++)
            {
                tempVal = new nexacro.ContactOrganization("", organizationList[i].type, organizationList[i].company, organizationList[i].department, organizationList[i].title, organizationList[i].label, "");
                organizationObjList[i] = tempVal;
            }

            var addressObjList = new Array();
            var addressList = person.addresses;
            for (i = 0; i < addressList.length; i++)
            {
                tempVal = new nexacro.ContactAddress("", addressList[i].type, addressList[i].country.replace(new RegExp("_NEWLINE_", "gi"), "\n"), addressList[i].postcode.replace(new RegExp("_NEWLINE_", "gi"), "\n"), addressList[i].city.replace(new RegExp("_NEWLINE_", "gi"), "\n"), addressList[i].region.replace(new RegExp("_NEWLINE_", "gi"), "\n"), addressList[i].street.replace(new RegExp("_NEWLINE_", "gi"), "\n"), addressList[i].label, "");
                addressObjList[i] = tempVal;
            }

            var urlsObjList = new Array();
            var urlsList = person.urls;
            for (i = 0; i < urlsList.length; i++)
            {
                tempVal = new nexacro.ContactField("", urlsList[i].type, urlsList[i].value.replace(new RegExp("_NEWLINE_", "gi"), "\n"), urlsList[i].label, "");
                urlsObjList[i] = tempVal;
            }

            var imsObjList = new Array();
            var imsList = person.ims;
            for (i = 0; i < imsList.length; i++)
            {
                tempVal = new nexacro.ContactIM("", imsList[i].type, imsList[i].value.replace(new RegExp("_NEWLINE_", "gi"), "\n"), imsList[i].label, imsList[i].ptype, imsList[i].plabel, "");
                imsObjList[i] = tempVal;
            }

            var emailsObjList = new Array();
            var emailsList = person.emails;
            for (i = 0; i < emailsList.length; i++)
            {
                tempVal = new nexacro.ContactField("", emailsList[i].type, emailsList[i].value.replace(new RegExp("_NEWLINE_", "gi"), "\n"), emailsList[i].label, "");
                emailsObjList[i] = tempVal;
            }

            if (typeof (person.note) != "undefined")
            {
                person.note = person.note.replace(new RegExp("&#32;", "gi"), " ");
                person.note = person.note.replace(new RegExp("_NEWLINE_", "gi"), "\n");
            }
            contactObjList[k] = new nexacro.Contact("", person.uniqueid, person.contactname.displayname, person.contactname.familyname, person.contactname.givenname, person.contactname.middlename, person.contactname.prefix, person.contactname.suffix, person.nickname, nexacro.Device.isConvertDateToString(person.birthday), person.note, phoneObjList, emailsObjList, imsObjList, categoriObjList, urlsObjList, addressObjList, organizationObjList, photoObjList, "");
        }
        return contactObjList;
    };

    _pContactSet.typeCheck = function(obj)
    {
        var i;
        var num, str;

        if (typeof (obj) == "undefined")
        {
            return false;
        }

        if (typeof (obj.phonenumbers) != "undefined")
        {
            if ((obj.phonenumbers.length) > 0)
            {
                for (i = 0; i < obj.phonenumbers.length; i++)
                {
                    num = obj.phonenumbers[i].type * 1;
                    if (num < 0 && num > 12)
                    {
                        return false;
                    }

                    str = obj.phonenumbers[i].type + "";
                    if (nexacro.Device.curDevice == DeviceType.ANDROID)
                    {
                        if (!(str == "0" || str == "1" || str == "2" || str == "3" || str == "4" || str == "6" || str == "7" || str == "9" || str == "10"))
                        {
                            return false;
                        }
                    }
                    else
                    {
                        if (str == "1")
                        {
                            return false;
                        }
                    }
                }
            }
        }

        if (typeof (obj.emails) != "undefined")
        {
            if ((obj.emails.length) > 0)
            {
                for (i = 0; i < obj.emails.length; i++)
                {
                    num = obj.emails[i].type * 1;
                    if (num < 0 && num > 12)
                    {
                        return false;
                    }

                    str = obj.emails[i].type + "";
                    if (nexacro.Device.curDevice == DeviceType.ANDROID)
                    {
                        if (!(str == "0" || str == "4" || str == "6" || str == "7" || str == "10"))
                        {
                            return false;
                        }
                    }
                    else
                    {
                        if (str == "1")
                        {
                            return false;
                        }
                    }
                }
            }
        }

        if (typeof (obj.categories) != "undefined")
        {
            if ((obj.categories.length) > 0)
            {
                for (i = 0; i < obj.categories.length; i++)
                {
                    num = obj.categories[i].type * 1;
                    if (num < 0 && num > 12)
                    {
                        return false;
                    }
                    str = obj.categories[i].type + "";
                    if (str != "0")
                    {
                        return false;
                    }
                }
            }
        }

        if (typeof (obj.urls) != "undefined")
        {
            if ((obj.urls.length) > 0)
            {
                for (i = 0; i < obj.urls.length; i++)
                {
                    num = obj.urls[i].type * 1;
                    if (num < 0 && num > 12)
                    {
                        return false;
                    }

                    str = obj.urls[i].type + "";
                    if (nexacro.Device.curDevice == DeviceType.ANDROID)
                    {
                        if (str != "12")
                        {
                            return false;
                        }
                    }
                    else
                    {
                        if (str == "1")
                        {
                            return false;
                        }
                    }
                }
            }
        }

        if (typeof (obj.ims) != "undefined")
        {
            if ((obj.ims.length) > 0)
            {
                for (i = 0; i < obj.ims.length; i++)
                {
                    num = obj.ims[i].type * 1;
                    if (num < 0 && num > 12)
                    {
                        return false;
                    }
                    str = obj.ims[i].type + "";
                    if (nexacro.Device.curDevice == DeviceType.ANDROID)
                    {
                        if (str != "7")
                        {
                            return false;
                        }

                        //  Android 는 protocoltype 도 체크합니다.
                        var str2 = obj.ims[i].protocoltype + "";
                        if (!(str2 == "0" || str2 == "1" || str2 == "2" || str2 == "3" || str2 == "4" || str2 == "5" || str2 == "6" || str2 == "7" || str2 == "8"))
                        {
                            return false;
                        }
                    }
                    else
                    {
                        if (str == "1")
                        {
                            return false;
                        }
                    }
                }
            }
        }

        if (typeof (obj.addresses) != "undefined")
        {
            if ((obj.addresses.length) > 0) {
                for (i = 0; i < obj.addresses.length; i++)
                {
                    num = obj.addresses[i].type * 1;
                    if (num < 0 && num > 12)
                    {
                        return false;
                    }
                    str = obj.addresses[i].type + "";
                    if (nexacro.Device.curDevice == DeviceType.ANDROID)
                    {
                        if (!(str == "0" || str == "4" || str == "7" || str == "10"))
                        {
                            return false;
                        }
                    }
                    else
                    {
                        if (str == "1")
                        {
                            return false;
                        }
                    }
                }
            }
        }

        if (typeof (obj.organizations) != "undefined")
        {
            if ((obj.organizations.length) > 0)
            {
                for (i = 0; i < obj.organizations.length; i++)
                {
                    num = obj.organizations[i].type * 1;
                    if (num < 0 && num > 12)
                    {
                        return false;
                    }

                    str = obj.organizations[i].type + "";
                    if (nexacro.Device.curDevice == DeviceType.ANDROID)
                    {
                        if (!(str == "0" || str == "7" || str == "10"))
                        {
                            return false;
                        }
                    }
                    else
                    {
                        if (str != "10")
                        {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    };

    delete _pContactSet;
}

//==============================================================================
// nexacro.ContactSetEventInfo
// 모바일 기기에서 연락처 데이터의 검색에 성공했을 때 발생되는 이벤트에서 사용되는 EventInfo Object
//==============================================================================
if (!nexacro.ContactSetEventInfo)
{
    nexacro.ContactSetEventInfo = function(strEventId, strReason, arrContacts)
    {
        this.eventid = strEventId;												// 이벤트ID
        this.reason = strReason;												// 이벤트 발생분류 코드
        this.contacts = arrContacts;											// 검색된 연락처 Object Array
    };
    var _pContactSetEventInfo = nexacro.ContactSetEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.ContactSetEventInfo);    
    _pContactSetEventInfo._type_name = "ContactSetEventInfo";

    delete _pContactSetEventInfo;
}

//==============================================================================
// nexacro.ContactSetErrorEventInfo
// 모바일 기기에서 연락처 검색에 실패했을 때 발생되는 이벤트의 EventInfo Object
//==============================================================================
if (!nexacro.ContactSetErrorEventInfo)
{
    nexacro.ContactSetErrorEventInfo = function(strEventId, intErrorCode, strErrorMsg)
    {
        this.eventid = strEventId;												// 이벤트ID
		this.errortype = "ObjectError";
		this.statuscode = intErrorCode;											// 오류코드 : integer 로 된 errorcode (iOS/Android에서 발생하는 errorcode를 그대로 사용)
        this.errormsg = strErrorMsg;											// 오류메세지 : string으로 된 errormsg (iOS/Android에서 발생하는 error message를 그대로 사용)
    };
    var _pContactSetErrorEventInfo = nexacro.ContactSetErrorEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.ContactSetErrorEventInfo);    
    _pContactSetErrorEventInfo._type_name = "ContactSetErrorEventInfo";

    delete _pContactSetErrorEventInfo;
}

//==============================================================================
// nexacro.Contact
// 모바일 기기의 연락처 데이터 Object
//==============================================================================
if (!nexacro.Contact)
{
    nexacro.Contact = function(name, strUniqueid, strDisplayname, strFamilyname, strGivenname,
						strMiddlename, strPrefix, strSuffix, strNickname, dtBirthday, strNote,
						arrPhonenumbers, arrEmails, arrIms, arrCategories, arrUrls, arrAddresses,
						arrOrganizations, arrPhotos, parent)
    {
        this.enableevent = true;
        if (arguments.length == 2)
        {
            this.id = this.name = name || null;
            if (parent)
                this.parent = parent;

            this._id = nexacro.Device.makeID();
            nexacro.Device._userCreatedObj[this._id] = this;
            
            this.uniqueid = "";		// uniqueID
            this.contactname = {						// 이름정보
                displayname: ""			// Display Name
				, familyname: ""			// Family Name 
				, givenname: ""				// Given Name
				, middlename: ""			// Middle Name 
				, prefix: ""					// 이름 앞에 붙는 호칭
				, suffix: ""					// 이름 뒤에 붙는 호칭
                , set_displayname: function() { }
              
                , set_familyname: function(val) {
                        this['familyname'] = val;
                }                  
                , set_givenname: function(val) {
                        this['givenname'] = val;
                }
                , set_middlename: function(val) {
                        this['middlename'] = val;
                }
                , set_prefix: function(val) {
                        this['prefix'] = val;
                }
                , set_suffix: function(val) {
                        this['suffix'] = val;
                }                
            };
            this.nickname = "";				// nickname 필드
            this.birthday = "";					// 생일필드
            this.note = "";						// Note 필드
            this.phonenumbers = "";		// 전화번호 필드
            this.emails = "";					// Email 필드
            this.ims = "";							// IM address 필드
            this.categories = "";			// Category 필드
            this.urls = "";						// Web page URL 필드
            this.addresses = "";				// 주소 필드
            this.organizations = "";		// 회사 필드
            this.photos = "";
        }
        else
        {
            this.uniqueid = strUniqueid || "";		// uniqueID
            this.contactname = {						// 이름정보
                displayname: (strDisplayname || "")			// Display Name
				, familyname: (strFamilyname || "")			// Family Name 
				, givenname: (strGivenname || "")			// Given Name
				, middlename: (strMiddlename || "")			// Middle Name 
				, prefix: (strPrefix || "")					// 이름 앞에 붙는 호칭
				, suffix: (strSuffix || "")					// 이름 뒤에 붙는 호칭
               , set_displayname: function() { }
               
                , set_familyname : function(val) {
                        this['familyname'] = val;
                }               
                , set_givenname : function(val) {
                        this['givenname'] = val;
                }
                , set_middlename: function(val) {
                        this['middlename'] = val;
                }
                , set_prefix: function(val) {
                        this['prefix'] = val;
                }
                , set_suffix: function(val) {
                        this['suffix'] = val;
                }                
            };
            this.nickname = (strNickname || "");				// nickname 필드
            this.birthday = (dtBirthday || "");					// 생일필드
            if (typeof (strNote) != "undefined" && strNote != "")
            {
                strNote = strNote.replace(/&#10;/g, "\n");
            }
            this.note = (strNote || "");						// Note 필드
            this.phonenumbers = (arrPhonenumbers || "");		// 전화번호 필드
            this.emails = (arrEmails || "");					// Email 필드
            this.ims = (arrIms || "");							// IM address 필드
            this.categories = (arrCategories || "");			// Category 필드
            this.urls = (arrUrls || "");						// Web page URL 필드
            this.addresses = (arrAddresses || "");				// 주소 필드
            this.organizations = (arrOrganizations || "");		// 회사 필드
            this.photos = (arrPhotos || "");					// 사진 필드
        }
    };

    //Const Type
    nexacro.Contact.TYPE_CUSTOM = 0;
    nexacro.Contact.TYPE_CALLBACK = 1;
    nexacro.Contact.TYPE_FAX_HOME = 2;
    nexacro.Contact.TYPE_FAX_WORK = 3;
    nexacro.Contact.TYPE_HOME = 4;
    nexacro.Contact.TYPE_MAIN = 5;
    nexacro.Contact.TYPE_MOBILE = 6;
    nexacro.Contact.TYPE_OTHER = 7;
    nexacro.Contact.TYPE_OTHER_FAX = 8;
    nexacro.Contact.TYPE_PAGER = 9;
    nexacro.Contact.TYPE_WORK = 10;
    nexacro.Contact.TYPE_IPHONE = 11;
    nexacro.Contact.TYPE_HOMEPAGE = 12;

    //Const ProtocolType
    nexacro.Contact.PTYPE_CUSTOM = 0;
    nexacro.Contact.PTYPE_AIM = 1;
    nexacro.Contact.PTYPE_MSN = 2;
    nexacro.Contact.PTYPE_YAHOO = 3;
    nexacro.Contact.PTYPE_SKYPE = 4;
    nexacro.Contact.PTYPE_QQ = 5;
    nexacro.Contact.PTYPE_GOOGLE_TALK = 6;
    nexacro.Contact.PTYPE_ICQ = 7;
    nexacro.Contact.PTYPE_JABBER = 8;
    nexacro.Contact.PTYPE_NETMEETING = 9;
    nexacro.Contact.PTYPE_FACEBOOK = 10;
    nexacro.Contact.PTYPE_GADUGADU = 11;

    var _pContact = nexacro.Contact.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.Contact);    
    _pContact._type_name = "Contact";

    _pContact.on_created = function() {};

    //===============================================================
    // nexacro.Contact : Properties
    //===============================================================
    _pContact.set_uniqueid = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.uniqueid = v;
            return true;
        }
        return false;
    };

    _pContact.set_displayname = function(v)
    {
        
    };

    _pContact.set_familyname = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.contactname.familyname = v;
            return true;
        }
        return false;
    };

    _pContact.set_givenname = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.contactname.givenname = v;
            return true;
        }
        return false;
    };

    _pContact.set_middlename = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.contactname.middlename = v;
            return true;
        }
        return false;
    };

    _pContact.set_prefix = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.contactname.prefix = v;
            return true;
        }
        return false;
    };

    _pContact.set_suffix = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.contactname.suffix = v;
            return true;
        }
        return false;
    };

    _pContact.set_nickname = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.nickname = v;
            return true;
        }
        return false;
    };

    _pContact.set_note = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.note = v;
            return true;
        }
        return false;
    };
    
    _pContact.set_birthday = function(v)
    {
        if (this.isValidDate(v) == true)
        {
            this.birthday = v;
            return true;
        }
        return false;
    };

    _pContact.set_phonenumbers = function(v)
    {
        if (this.pramk_ContactFieldArray(v) == true)
        {
            this.phonenumbers = v;
            return true;
        }
        return false;
    };

    _pContact.set_emails = function(v)
    {
        if (this.pramk_ContactFieldArray(v) == true)
        {
            this.emails = v;
            return true;
        }
        return false;
    };

    _pContact.set_ims = function(v)
    {
        if (this.pramk_ContactIMArray(v) == true)
        {
            this.ims = v;
            return true;
        }
        return false;
    };

    _pContact.set_categories = function(v)
    {
        if (this.pramk_ContactFieldArray(v) == true)
        {
            this.categories = v;
            return true;
        }
        return false;
    };

    _pContact.set_urls = function(v)
    {
        if (this.pramk_ContactFieldArray(v) == true)
        {
            this.urls = v;
            return true;
        }
        return false;
    };
    
    _pContact.set_addresses = function(v)
    {
        if (this.pramk_ContactAddressArray(v) == true)
        {
            this.addresses = v;
            return true;
        }
        return false;
    };

    _pContact.set_organizations = function(v)
    {
        if (this.pramk_ContactOrganizationArray(v) == true)
        {
            this.organizations = v;
            return true;
        }
        return false;
    };

    _pContact.set_photos = function(v)
    {
        if (this.pramk_ContactPhotoArray(v) == true)
        {
            this.photos = v;
            return true;
        }
        return false;
    };

    //===============================================================
    // nexacro.Contact : Logical Part
    //===============================================================
    _pContact.pramk_ContactFieldArray = function (argContactFieldArr)
    {
        if (Object.prototype.toString.call(argContactFieldArr) === "[object Array]" || argContactFieldArr == "")
        {
            for (var i = 0; i < argContactFieldArr.length; i++)
            {
                if (!(nexacro.Device.pramck_contactString(argContactFieldArr[i].type) &&
	    			nexacro.Device.pramck_contactString(argContactFieldArr[i].value) &&
	    			nexacro.Device.pramck_contactString(argContactFieldArr[i].label)))
                {
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    _pContact.pramk_ContactIMArray = function (argContactIMArr)
    {
        if (Object.prototype.toString.call(argContactIMArr) === "[object Array]" || argContactIMArr == "")
        {
            for (var i = 0; i < argContactIMArr.length; i++)
            {
                if (!(nexacro.Device.pramck_contactString(argContactIMArr[i].type) &&
	    			nexacro.Device.pramck_contactString(argContactIMArr[i].label) &&
	    			nexacro.Device.pramck_contactString(argContactIMArr[i].value) &&
	    			nexacro.Device.pramck_contactString(argContactIMArr[i].protocoltype) &&
	    			nexacro.Device.pramck_contactString(argContactIMArr[i].protocollabel)))
                {
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    _pContact.pramk_ContactAddressArray = function (argContactAddressArr)
    {
        if (Object.prototype.toString.call(argContactAddressArr) === "[object Array]" || argContactAddressArr == "")
        {
            for (var i = 0; i < argContactAddressArr.length; i++)
            {
                if (!(nexacro.Device.pramck_contactString(argContactAddressArr[i].type) &&
	    			nexacro.Device.pramck_contactString(argContactAddressArr[i].country) &&
	    			nexacro.Device.pramck_contactString(argContactAddressArr[i].postcode) &&
	    			nexacro.Device.pramck_contactString(argContactAddressArr[i].city) &&
	    			nexacro.Device.pramck_contactString(argContactAddressArr[i].region) &&
	    			nexacro.Device.pramck_contactString(argContactAddressArr[i].street) &&
	    			nexacro.Device.pramck_contactString(argContactAddressArr[i].label)))
                {
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    _pContact.pramk_ContactOrganizationArray = function (argContactOrganizationArr)
    {
        if (Object.prototype.toString.call(argContactOrganizationArr) === "[object Array]" || argContactOrganizationArr == "")
        {
            for (var i = 0; i < argContactOrganizationArr.length; i++)
            {
                if (!(nexacro.Device.pramck_contactString(argContactOrganizationArr[i].type) &&
	    			nexacro.Device.pramck_contactString(argContactOrganizationArr[i].company) &&
	    			nexacro.Device.pramck_contactString(argContactOrganizationArr[i].department) &&
	    			nexacro.Device.pramck_contactString(argContactOrganizationArr[i].title) &&
	    			nexacro.Device.pramck_contactString(argContactOrganizationArr[i].label)))
                {
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    _pContact.pramk_ContactPhotoArray = function (argContactPhotoArr)
    {
        if (Object.prototype.toString.call(argContactPhotoArr) === "[object Array]" || argContactPhotoArr == "")
        {
            for (var i = 0; i < argContactPhotoArr.length; i++)
            {
                if (!(nexacro.Device.pramck_contactString(argContactPhotoArr[i].imagedata) &&
	    			nexacro.Device.pramck_contactString(argContactPhotoArr[i].label)))
                {
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    _pContact.toJson = function()
    {
        if (this.contactname.familyname == null) { this.contactname.familyname = ""; }
        if (this.contactname.displayname == null) { this.contactname.displayname = ""; }
        if (this.contactname.givenname == null) { this.contactname.givenname = ""; }
        if (this.contactname.middlename == null) { this.contactname.middlename = ""; }
        if (this.contactname.prefix == null) { this.contactname.prefix = ""; }
        if (this.contactname.suffix == null) { this.contactname.suffix = ""; }

        if (typeof (this.uniqueid) == "undefined")
        {
            this.uniqueid = "";
        }

        var strJson = '{ "uniqueid":"' + this.uniqueid;

        if (nexacro.Device.curDevice == DeviceType.ANDROID)
        {
            strJson += '", "contactname":{';
            strJson += ' "familyname":"' + this.contactname.familyname;
            strJson += '", "displayname":"' + this.contactname.displayname;
            strJson += '", "givenname":"' + this.contactname.givenname;
            strJson += '", "middlename":"' + this.contactname.middlename;
            strJson += '", "prefix":"' + this.contactname.prefix;
            strJson += '", "suffix":"' + this.contactname.suffix;
            strJson += '"}';
        }
        else
        {
            strJson += '", "contactname":[{';
            strJson += ' "familyname":"' + this.contactname.familyname;
            strJson += '", "displayname":"' + this.contactname.displayname;
            strJson += '", "givenname":"' + this.contactname.givenname;
            strJson += '", "middlename":"' + this.contactname.middlename;
            strJson += '", "prefix":"' + this.contactname.prefix;
            strJson += '", "suffix":"' + this.contactname.suffix;
            strJson += '"}]';
        }

        if (typeof (this.nickname) == "undefined")
        {
            this.nickname = "";
        }

        strJson += ', "nickname":"' + this.nickname;

        if (nexacro.Device.curDevice == DeviceType.ANDROID)
        {
            if (this.birthday != "")
            {
                strJson += '", "birthday":"' + this.birthday.getFullYear() + '-' + nexacro._toString(this.birthday.getMonth() + 1).padLeft(2, "0") + '-' + this.birthday.getDate();
            }
            else
            {
                strJson += '", "birthday":"' + this.birthday;
            }
        }
        else
        {
            if (this.birthday != "")
            {
                strJson += '", "birthday":"' + this.birthday.getFullYear() + '/' + (this.birthday.getMonth() + 1) + '/' + this.birthday.getDate();
            }
            else
            {
                strJson += '", "birthday":"';
            }
        }

        if (typeof (this.note) == "undefined")
        {
            this.note = "";
        }

        if (nexacro.Device.curDevice == DeviceType.IOS)
        {
            this.note = this.note.replace(/\r/g, "");
            this.note = this.note.replace(/\n/g, "_NEWLINE_");
            this.note = this.note.replace(/&#10;/g, "_NEWLINE_");
        }

        strJson += '", "note":"' + this.note;
        strJson += '", "phonenumbers":';
        var i;

        if (typeof (this.phonenumbers) != "undefined")
        {
            if ((this.phonenumbers.length) > 0)
            {
                strJson += '[';
                for (i = 0; i < this.phonenumbers.length; i++)
                {
                    strJson += this.phonenumbers[i].toJson();
                    if (((this.phonenumbers.length) - 1) == i)
                    {
                    }
                    else
                    {
                        strJson += ',';
                    }
                }
                strJson += ']';
            }
            else
            {
                strJson += '""';
            }
        }
        else
        {
            strJson += '""';
        }

        strJson += ', "emails":';
        if (typeof (this.emails) != "undefined")
        {
            if ((this.emails.length) > 0)
            {
                strJson += '[';
                for (i = 0; i < this.emails.length; i++)
                {
                    strJson += this.emails[i].toJson();
                    if (((this.emails.length) - 1) == i)
                    {
                    }
                    else
                    {
                        strJson += ',';
                    }
                }
                strJson += ']';
            }
            else
            {
                strJson += '""';
            }
        }
        else
        {
            strJson += '""';
        }

        strJson += ', "ims":';
        if (typeof (this.ims) != "undefined")
        {
            if ((this.ims.length) > 0)
            {
                strJson += '[';
                for (i = 0; i < this.ims.length; i++)
                {

                    strJson += this.ims[i].toJson();
                    if (((this.ims.length) - 1) == i)
                    {
                    } else
                    {
                        strJson += ',';
                    }
                }
                strJson += ']';
            }
            else
            {
                strJson += '""';
            }
        }
        else
        {
            strJson += '""';
        }

        strJson += ', "categories":';
        if (typeof (this.categories) != "undefined")
        {
            if ((this.categories.length) > 0)
            {
                strJson += '[';
                for (i = 0; i < this.categories.length; i++)
                {
                    strJson += this.categories[i].toJson();
                    if (((this.categories.length) - 1) == i)
                    {
                    }
                    else
                    {
                        strJson += ',';
                    }
                }
                strJson += ']';
            }
            else
            {
                strJson += '""';
            }
        }
        else
        {
            strJson += '""';
        }

        strJson += ', "urls":';
        if (typeof (this.urls) != "undefined")
        {
            if ((this.urls.length) > 0)
            {
                strJson += '[';
                for (i = 0; i < this.urls.length; i++)
                {
                    strJson += this.urls[i].toJson();
                    if (((this.urls.length) - 1) == i)
                    {
                    }
                    else
                    {
                        strJson += ',';
                    }
                }
                strJson += ']';
            }
            else
            {
                strJson += '""';
            }
        }
        else
        {
            strJson += '""';
        }

        strJson += ', "addresses":';
        if (typeof (this.addresses) != "undefined")
        {
            if ((this.addresses.length) > 0)
            {
                strJson += '[';
                for (i = 0; i < this.addresses.length; i++)
                {
                    strJson += this.addresses[i].toJson();
                    if (((this.addresses.length) - 1) == i)
                    {
                    }
                    else
                    {
                        strJson += ',';
                    }
                }
                strJson += ']';
            }
            else
            {
                strJson += '""';
            }
        }
        else
        {
            strJson += '""';
        }

        strJson += ', "organizations":';
        if (typeof (this.organizations) != "undefined")
        {
            if ((this.organizations.length) > 0)
            {
                strJson += '[';
                for (i = 0; i < this.organizations.length; i++)
                {
                    strJson += this.organizations[i].toJson();
                    if (((this.organizations.length) - 1) == i)
                    {
                    }
                    else
                    {
                        strJson += ',';
                    }
                }
                strJson += ']';
            }
            else
            {
                strJson += '""';
            }
        }
        else
        {
            strJson += '""';
        }

        strJson += ', "photos":';
        if (typeof (this.photos) != "undefined")
        {
            if ((this.photos.length) > 0)
            {
                strJson += '[';
                for (i = 0; i < this.photos.length; i++)
                {
                    strJson += this.photos[i].toJson();
                    if (((this.photos.length) - 1) == i)
                    {
                    }
                    else
                    {
                        strJson += ',';
                    }
                }
                strJson += ']';
            }
            else
            {
                strJson += '""';
            }
        }
        else
        {
            strJson += '""';
        }

        strJson += '}';

        return strJson;
    };

    _pContact.isValidDate = function (argDate)
    {
        if (Object.prototype.toString.call(argDate) === "[object Date]" || argDate == "")
        {
            return true;
        }
        return false;
    };

    delete _pContact;
}

//==============================================================================
// nexacro.ContactField
// 연락처에서 사용되는 일반 필드 Object
//==============================================================================
if (!nexacro.ContactField)
{
    nexacro.ContactField = function (name, strType, strValue, strLabel, parent)
    {
        if (arguments.length == 2)
        {
            this.id = this.name = name || null;
            if (parent)
                this.parent = parent;

            this._id = nexacro.Device.makeID();
            nexacro.Device._userCreatedObj[this._id] = this;
            
            this.type = "";													// 필드 종류
            this.value = "";													// 필드 값
            this.label = "";													// 필드 명칭
        }
        else
        {
            this.type = strType || "";													// 필드 종류
            this.value = strValue || "";													// 필드 값
            this.label = strLabel || "";													// 필드 명칭
        }
        this.enableevent = true;
    };
    var _pContactField = nexacro.ContactField.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.ContactField);    
    _pContactField._type_name = "ContactField";

    _pContactField.on_created = function() {};

    //===============================================================
    // nexacro.ContactField : Properties
    //===============================================================
    _pContactField.set_type = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.type = v;
            return true;
        }
        this.type = "";
        return false;
    };

    _pContactField.set_value = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.value = v;
            return true;
        }
        this.value = "";
        return false;
    };

    _pContactField.set_label = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.label = v;
            return true;
        }
        this.label = "";
        return false;
    };

    //===============================================================
    // nexacro.ContactField : Logical Part
    //===============================================================
    _pContactField.toJson = function()
    {
        if (typeof (this.label) == "undefined" || this.label == null)
        {
            this.label = "";
        }
        if (typeof (this.value) == "undefined" || this.value == null)
        {
            this.value = "";
        }
        if (typeof (this.type) == "undefined" || this.type == null)
        {
            this.type = "";
        }

        var strJson = '{ "label":"' + this.label;
        strJson += '", "value":"' + this.value;
        strJson += '", "type":"' + this.type;
        strJson += '"}';

        return strJson;
    };

    delete _pContactField;
}

//==============================================================================
//nexacro.ContactIM
//연락처에서 사용되는 IM 필드 Object
//==============================================================================
if (!nexacro.ContactIM)
{
    nexacro.ContactIM = function (name, strType, strValue, strLabel, strPtype, strPlabel, parent)
    {
        if (arguments.length == 2)
        {
            this.id = this.name = name || null;
            if (parent)
                this.parent = parent;

            this._id = nexacro.Device.makeID();
            nexacro.Device._userCreatedObj[this._id] = this;
            
            this.type = "";					// 필드 종류
            this.value = "";				// 필드 값
            this.label = "";				// 필드 명칭
            this.protocoltype = "";			// 프로토콜 종류
            this.protocollabel = "";		// 프로토콜 명칭
        }
        else
        {
            this.type = strType || "";			// 필드 종류
            this.value = strValue || "";			// 필드 값
            this.label = strLabel || "";			// 필드 명칭
            this.protocoltype = strPtype || "";	// 프로토콜 종류
            this.protocollabel = strPlabel || "";	// 프로토콜 명칭
        }
        this.enableevent = true;
    };
    var _pContactIM = nexacro.ContactIM.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.ContactIM);    
    _pContactIM._type_name = "ContactIM";

    _pContactIM.on_created = function() {};

    //===============================================================
    // nexacro.ContactIM : Properties
    //===============================================================
    _pContactIM.set_type = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.type = v;
            return true;
        }
        this.type = "";
        return false;
    };

    _pContactIM.set_value = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.value = v;
            return true;
        }
        this.value = "";
        return false;
    };

    _pContactIM.set_label = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.label = v;
            return true;
        }
        this.label = "";
        return false;
    };

    _pContactIM.set_protocoltype = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.protocoltype = v;
            return true;
        }
        this.protocoltype = "";
        return false;
    };

    _pContactIM.set_protocollabel = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.protocollabel = v;
            return true;
        }
        this.protocollabel = "";
        return false;
    };

    //===============================================================
    // nexacro.ContactIM : Logical Part
    //===============================================================
    _pContactIM.toJson = function()
    {
        if (typeof (this.label) == "undefined" || this.label == null) { this.label = ""; }
        if (typeof (this.value) == "undefined" || this.value == null) { this.value = ""; }
        if (typeof (this.type) == "undefined" || this.type == null) { this.type = ""; }
        if (typeof (this.protocoltype) == "undefined" || this.protocoltype == null) { this.protocoltype = ""; }
        if (typeof (this.protocollabel) == "undefined" || this.protocollabel == null) { this.protocollabel = ""; }

        var strJson = '{ "label":"' + this.label;
        strJson += '", "value":"' + this.value;
        strJson += '", "type":"' + this.type;
        strJson += '", "ptype":"' + this.protocoltype;
        strJson += '", "plabel":"' + this.protocollabel;
        strJson += '"}';
        return strJson;
    };

    delete _pContactIM;
}

//==============================================================================
// nexacro.ContactAddress
// 연락처에서 사용되는 주소 필드 Object
//==============================================================================
if (!nexacro.ContactAddress)
{
    nexacro.ContactAddress = function (name, strType, strCountry, strPostcode, strCity, strRegion, strStreet, strLabel, parent)
    {
        if (arguments.length == 2)
        {
            this.id = this.name = name || null;
            if (parent)
                this.parent = parent;

            this._id = nexacro.Device.makeID();
            nexacro.Device._userCreatedObj[this._id] = this;
            
            this.type = "";													// 주소 종류
            this.country = "";												// 국가
            this.postcode = "";											// 우편번호
            this.city = "";													// 도/시
            this.region = "";												// 구/군/시
            this.street = "";												// 상세 주소
            this.label = "";													// 필드 명칭
        }
        else
        {
            this.type = strType || "";													// 주소 종류
            this.country = strCountry || "";												// 국가
            this.postcode = strPostcode || "";											// 우편번호
            this.city = strCity || "";													// 도/시
            this.region = strRegion || "";												// 구/군/시
            this.street = strStreet || "";												// 상세 주소
            this.label = strLabel || "";													// 필드 명칭
        }
        this.enableevent = true;
    };

    var _pContactAddress = nexacro.ContactAddress.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.ContactAddress);    
    _pContactAddress._type_name = "ContactAddress";

    _pContactAddress.on_created = function() {};

    //===============================================================
    // nexacro.ContactAddress : Properties
    //===============================================================
    _pContactAddress.set_type = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.type = v;
            return true;
        }
        return false;
    };

    _pContactAddress.set_country = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.country = v;
            return true;
        }
        return false;
    };

    _pContactAddress.set_postcode = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.postcode = v;
            return true;
        }
        return false;
    };

    _pContactAddress.set_city = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.city = v;
            return true;
        }
        return false;
    };

    _pContactAddress.set_region = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.region = v;
            return true;
        }
        return false;
    };

    _pContactAddress.set_street = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.street = v;
            return true;
        }
        return false;
    };

    _pContactAddress.set_label = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.label = v;
            return true;
        }
        return false;
    };

    //===============================================================
    // nexacro.ContactAddress : Logical Part
    //===============================================================
    _pContactAddress.toJson = function()
    {
        var strJson;

        if (nexacro.Device.curDevice == DeviceType.ANDROID)
        {
            if (typeof (this.label) == "undefined" || this.label == null) { this.label = ""; }
            if (typeof (this.country) == "undefined" || this.country == null) { this.country = ""; }
            if (typeof (this.postcode) == "undefined" || this.postcode == null) { this.postcode = ""; }
            if (typeof (this.city) == "undefined" || this.city == null) { this.city = ""; }
            if (typeof (this.region) == "undefined" || this.region == null) { this.region = ""; }
            if (typeof (this.street) == "undefined" || this.street == null) { this.street = ""; }
            if (typeof (this.type) == "undefined" || this.type == null) { this.type = ""; }

            strJson = '{ "label":"' + this.label;
            strJson += '", "country":"' + this.country;
            strJson += '", "postcode":"' + this.postcode;
            strJson += '", "city":"' + this.city;
            strJson += '", "region":"' + this.region;
            strJson += '", "street":"' + this.street;
            strJson += '", "type":"' + this.type;
            strJson += '"}';
        }
        else
        {
            if (typeof (this.label) == "undefined" || this.label == null) { this.label = ""; }
            if (typeof (this.type) == "undefined" || this.type == null) { this.type = ""; }
            if (typeof (this.country) == "undefined" || this.country == null) { this.country = ""; }
            if (typeof (this.postcode) == "undefined" || this.postcode == null) { this.postcode = ""; }
            if (typeof (this.city) == "undefined" || this.city == null) { this.city = ""; }
            if (typeof (this.region) == "undefined" || this.region == null) { this.region = ""; }
            if (typeof (this.street) == "undefined" || this.street == null) { this.street = ""; }

            strJson = '{ "label":"' + this.label;
            strJson += '", "type":"' + this.type;
            strJson += '", "value":{';
            strJson += '"Country":"' + this.country;
            strJson += '", "ZIP":"' + this.postcode;
            strJson += '", "City":"' + this.city;
            strJson += '", "State":"' + this.region;
            strJson += '", "Street":"' + this.street;
            strJson += '"}}';
        }
        return strJson;
    };

    delete _pContactAddress;
}

//==============================================================================
// nexacro.ContactOrganization
// 연락처에서 사용되는 조직 필드 Object
//==============================================================================
if (!nexacro.ContactOrganization)
{
    nexacro.ContactOrganization = function (name, strType, strCompany, strDepartment, strTitle, strLabel, parent)
    {
        if (arguments.length == 2)
        {
            this.id = this.name = name || null;
            if (parent)
                this.parent = parent;

            this._id = nexacro.Device.makeID();
            nexacro.Device._userCreatedObj[this._id] = this;
            
            this.type = "";													// 조직 종류
            this.company = "";												// 조직 이름
            this.department = "";										// 부서 이름
            this.title = "";													// 직급
            this.label = "";													// 필드 명칭
        }
        else
        {
            this.type = strType || "";													// 조직 종류
            this.company = strCompany || "";												// 조직 이름
            this.department = strDepartment || "";										// 부서 이름
            this.title = strTitle || "";													// 직급
            this.label = strLabel || "";													// 필드 명칭
        }
        this.enableevent = true;
    };

    var _pContactOrganization = nexacro.ContactOrganization.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.ContactOrganization);    
    _pContactOrganization._type_name = "ContactOrganization";

    _pContactOrganization.on_created = function() { };

    //===============================================================
    // nexacro.ContactOrganization : Properties
    //===============================================================
    _pContactOrganization.set_type = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.type = v;
            return true;
        }
        return false;
    };

    _pContactOrganization.set_company = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.company = v;
            return true;
        }
        return false;
    };

    _pContactOrganization.set_department = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.department = v;
            return true;
        }
        return false;
    };

    _pContactOrganization.set_title = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.title = v;
            return true;
        }
        return false;
    };

    _pContactOrganization.set_label = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.label = v;
            return true;
        }
        return false;
    };

    //===============================================================
    // nexacro.ContactAddress : Logical Part
    //===============================================================
    _pContactOrganization.toJson = function()
    {
        if (typeof (this.label) == "undefined" || this.label == null) { this.label = ""; }
        if (typeof (this.title) == "undefined" || this.title == null) { this.title = ""; }
        if (typeof (this.company) == "undefined" || this.company == null) { this.company = ""; }
        if (typeof (this.department) == "undefined" || this.department == null) { this.department = ""; }
        if (typeof (this.type) == "undefined" || this.type == null) { this.type = ""; }

        var strJson = '{ "label":"' + this.label;
        strJson += '", "title":"' + this.title;
        strJson += '", "company":"' + this.company;
        strJson += '", "department":"' + this.department;
        strJson += '", "type":"' + this.type;
        strJson += '"}';

        return strJson;
    };

    delete _pContactOrganization;
}

//==============================================================================
// nexacro.ContactPhoto
// 연락처에서 사용되는 사진 필드 Object
//==============================================================================
if (!nexacro.ContactPhoto)
{
    nexacro.ContactPhoto = function (name, strImagedata, strLabel, parent)
    {
        if (arguments.length == 2)
        {
            this.id = this.name = name || null;
            if (parent)
                this.parent = parent;

            this._id = nexacro.Device.makeID();
            nexacro.Device._userCreatedObj[this._id] = this;
            
            this.imagedata = "";											// 저장된 이미지
            this.label = "";													// 필드 명칭
        }
        else
        {
            this.imagedata = strImagedata || "";											// 저장된 이미지
            this.label = strLabel || "";													// 필드 명칭
        }
        this.enableevent = true;
    };

    var _pContactPhoto = nexacro.ContactPhoto.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.ContactPhoto);    
    _pContactPhoto._type_name = "ContactPhoto";

    _pContactPhoto.on_created = function() {};

    //===============================================================
    // nexacro.ContactPhoto : Properties
    //===============================================================
    _pContactPhoto.set_imagedata = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.imagedata = v;
            return true;
        }
        return false;
    };

    _pContactPhoto.set_label = function(v)
    {
        if (nexacro.Device.pramck_contactString(v) == true)
        {
            this.label = v;
            return true;
        }
        return false;
    };

    //===============================================================
    // nexacro.ContactPhoto : Logical Part
    //===============================================================
    _pContactPhoto.toJson = function()
    {
        var strJson = '{ "imagedata":"' + this.imagedata;
        strJson += '", "label":"' + this.label;
        strJson += '"}';

        return strJson;
    };

    delete _pContactPhoto;
}

// ExternalAPI, ExternalAPIEventinfo, ExternalAPIErrorEventinfo
//==============================================================================
//14. ExternalAPI
//==============================================================================
//==============================================================================
// nexacro.ExternalAPI
// 
//==============================================================================
if (!nexacro.ExternalAPI)
{
    nexacro.ExternalAPI = function (name, parent)
    {
        this.id = this.name = name || null;
        if (parent)
            this.parent = parent;

		this._id = nexacro.Device.makeID();
		nexacro.Device._userCreatedObj[this._id] = this;
		
        this.enableevent = true;
    
        this._event_list = {
            "onsuccess":1, "onerror":1, "onrecvdata":1
        };	
	    
        this.onsuccess = null;
        this.onerror = null;
        this.onrecvdata = null;
	    
        var params = '""';
        var jsonstr = "";
        jsonstr = '{"id":'+this._id+', "div":"ExternalAPI", "method":"constructor", "params":'+params+'}';
        nexacro.Device.exec(jsonstr);
    };

    var _pExternalAPI = nexacro.ExternalAPI.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.ExternalAPI);	
	_pExternalAPI._type_name = "ExternalAPI";

	_pExternalAPI.destroy = function()
	{
		var params = '""';
		var jsonstr;

		delete nexacro.Device._userCreatedObj[this._id];

        jsonstr = '{"id":'+this._id+', "div":"ExternalAPI", "method":"destroy", "params":'+params+'}'; 
        nexacro.Device.exec(jsonstr);

		return true;
	};

	_pExternalAPI.on_created = function() { };

    //===============================================================
    // nexacro.ExternalAPI : Methods
    //===============================================================
	_pExternalAPI.isAccessible = function(strApplicationID)
	{
	    if(typeof (strApplicationID) == "undefined" || strApplicationID.length == 0 || typeof (strApplicationID) != "string")
	    {
    	 	return false;
	    }
	    else
	    {
			var params = '{"appID":"'+ strApplicationID +'"}';
			var jsonstr = "";
			jsonstr = '{"id":'+this._id+', "div":"ExternalAPI", "method":"isAccessible", "params":'+params+'}';
			nexacro.Device.exec(jsonstr);
			return true; 
        }
    };

	_pExternalAPI.execExtAPI = function(strRecvID, strApplicationID, strAPI, strParams)
	{
	    if(typeof (strApplicationID) == "undefined" || strApplicationID.length == 0 || typeof (strApplicationID) != "string")
	    {
        	return false;
        }
        
	    if (typeof (strAPI) == "undefined" || strAPI.length == 0)
	    {
        	return false;
        }
    
    	var params = '{"recvID":"'+strRecvID+'"';
    	params += ', "appID":"'+ strApplicationID +'"';
    	params += ', "apiname":"'+ strAPI +'"';
    	//params += ', "params":"'+ strParams.replace(/'/g, "_QUOT_") +'"}';
    	params += ', "params":"'+ strParams +'"}';
        var jsonstr = "";
        jsonstr = '{"id":'+this._id+', "div":"ExternalAPI", "method":"execExtAPI", "params":'+params+'}';
		nexacro.Device.exec(jsonstr);
        return true; 
    };    

    //===============================================================
    // nexacro.ExternalAPI : Event Handlers
    //===============================================================
	_pExternalAPI._onsuccess = function(objData)
	{
		var e = new nexacro.ExternalAPIEventinfo("onsuccess", objData.reason, objData.recvid, objData.recvdata);
		this._fire_onsuccess(this, e);
	};
    
	_pExternalAPI._fire_onsuccess = function(objExternalAPI, eExternalAPIEventInfo)
	{
	    if (this.onsuccess && this.onsuccess._has_handlers)
	    {
			return this.onsuccess._fireEvent(this, eExternalAPIEventInfo);
		}
		return true;
	};

	_pExternalAPI._onrecvdata = function(objData)
	{
		var e = new nexacro.ExternalAPIEventinfo("onrecvdata", objData.reason, objData.recvid, objData.recvdata);
		this._fire_onrecvdata(this, e);
	};
    
	_pExternalAPI._fire_onrecvdata = function(objExternalAPI, eExternalAPIEventInfo)
	{
	    if (this.onrecvdata && this.onrecvdata._has_handlers)
	    {
			return this.onrecvdata._fireEvent(this, eExternalAPIEventInfo);
		}
		return true;
	};    
    
	_pExternalAPI._onerror = function(objData)
	{
		var e = new nexacro.ExternalAPIErrorEventInfo("onerror", objData.errorcode, objData.errormsg);
		this._fire_onerror(this, e);
	};
    
	_pExternalAPI._fire_onerror = function(objExternalAPI, eExternalAPIErrorEventInfo)
	{
	    if (this.onerror && this.onerror._has_handlers)
	    {
			return this.onerror._fireEvent(this, eExternalAPIErrorEventInfo);
		}
		return true;
	};
	
	delete _pExternalAPI;
}

//==============================================================================
// nexacro.ExternalAPIEventInfo
// 
//==============================================================================
if (!nexacro.ExternalAPIEventinfo)
{
    nexacro.ExternalAPIEventinfo = function(strEventId, strReason, strRecvid, strRecvdata)
    {
		this.eventid = strEventId;												
		this.reason = strReason;														
		this.recvid = strRecvid;
        this.recvdata = strRecvdata;										
	};
    var _pExternalAPIEventinfo = nexacro.ExternalAPIEventinfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.ExternalAPIEventinfo);	
	_pExternalAPIEventinfo._type_name = "ExternalAPIEventinfo";
	
	delete _pExternalAPIEventinfo;
}

//==============================================================================
// nexacro.ExternalAPIErrorEventInfo
//
//==============================================================================
if (!nexacro.ExternalAPIErrorEventInfo)
{
    nexacro.ExternalAPIErrorEventInfo = function (strEventId, intErrorCode, strErrorMsg)
    {
		this.eventid = strEventId;												// 이벤트ID
		this.errortype = "ObjectError";
		this.statuscode = intErrorCode;
        this.errormsg = strErrorMsg;	
    };
    var _pExternalAPIErrorEventInfo = nexacro.ExternalAPIErrorEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.ExternalAPIErrorEventInfo);	
	_pExternalAPIErrorEventInfo._type_name = "ExternalAPIErrorEventinfo";
	
	delete _pExternalAPIErrorEventInfo;
}

//==============================================================================
//12. LiteDB
//==============================================================================

//==============================================================================
//nexacro.LiteDBEventInfo
//LiteDBConnection에 요청된 작업이 성공했을 때 발생되는 이벤트에서 사용되는 EventInfo Object
//==============================================================================

if (nexacro._OS == "iOS" && !nexacro.LiteDBEventInfo)
{
    nexacro.LiteDBEventInfo = function(strEventId, strReason, strReturnValue)
    {
		this.eventid = strEventId;												// 이벤트ID
		this.reason = strReason;												// 이벤트 발생분류 코드
		this.returnvalue = strReturnValue;										// 이벤트 수행결과 (type:Variant)
	};
    var _pLiteDBEventInfo = nexacro.LiteDBEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.LiteDBEventInfo);	
	_pLiteDBEventInfo._type_name = "LiteDBEventInfo";
	
	delete _pLiteDBEventInfo;
}

//==============================================================================
//nexacro.LiteDBErrorEventInfo
//LiteDBConnection에 요청된 작업이 실패했을 때 발생되는 이벤트에서 사용되는 EventInfo Object
//==============================================================================
if (nexacro._OS == "iOS" && !nexacro.LiteDBErrorEventInfo)
{
    nexacro.LiteDBErrorEventInfo = function (strEventId, intErrorCode, strErrorMsg, strldbErrorCode, strldbErrorMsg)
    {
		this.eventid = strEventId;												// 이벤트ID
		this.errortype = "ObjectError";
		this.statuscode = intErrorCode;											// 오류코드 : integer 로 된 errorcode (iOS/Android에서 발생하는 errorcode를 그대로 사용)
		this.errormsg = strErrorMsg;											// 오류메세지 : string으로 된 errormsg (iOS/Android에서 발생하는 error message를 그대로 사용)
		this.ldberrorcode = strldbErrorCode;									// Database의 오류코드
		this.ldberrormsg = strldbErrorMsg;										// Database의 오류 메시지 
	};
    var _pLiteDBErrorEventInfo = nexacro.LiteDBErrorEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.LiteDBErrorEventInfo);	
	_pLiteDBErrorEventInfo._type_name = "LiteDBErrorEventInfo";
	
	delete _pLiteDBErrorEventInfo;
}

//==============================================================================
//nexacro.LiteDBConnection
//모바일 기기에서 지원되는 SQLConnection Database를 연동하기 위해 사용한다.
//==============================================================================
if (nexacro._OS == "iOS" && !nexacro.LiteDBConnection)
{
    nexacro.LiteDBConnection = function (name, parent)
    {
        this.id = this.name = name || null;
        if (parent)
            this.parent = parent;

		this._id = nexacro.Device.makeID();
		nexacro.Device._userCreatedObj[this._id] = this;
		// set status boolean
		this.bbegin = false;
		this.enableevent = true;
		// set property
        this.sqlstatement = "";                                                 // SQLStatement의 executeQuery 함수의 결과를 제어하는 Object
		this.busytimeout = 60000;													// SQLite 연결시 Table에 Lock이 걸렸을 경우 응답을 받기 위한 대기시간
		this.openflag = 1;														// Database를 open할때 사용될 Flag		
		this.datasource = "";													// 연결할 SQLite Database 경로
		this.preconnect = "false";
		this.async = true;
	
		this._event_list = {
		    "onsuccess":1, "onerror":1
	    };	
	    
	    this.onsuccess = null;
	    this.onerror = null;
		
	    // native constructor
	    var params = '""';
        var jsonstr = '{"id":'+this._id+', "div":"SQLConnection", "method":"constructor", "params":'+params+'}';

        nexacro.Device.exec(jsonstr, true);     
	};
	
    // const value
    nexacro.LiteDBConnection.openReadWrite = 0;
    nexacro.LiteDBConnection.openReadWriteCreate = 1;
	
    var _pLiteDBConnection = nexacro.LiteDBConnection.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.LiteDBConnection);    
    _pLiteDBConnection._type_name = "LiteDBConnection";
	
    _pLiteDBConnection.destroy = function ()
	{
		var params = '""';
		var jsonstr;
		
		delete nexacro.Device._userCreatedObj[this._id];
		
        jsonstr = '{"id":'+this._id+', "div":"SQLConnection", "method":"destroy", "params":'+params+'}'; 
        nexacro.Device.exec(jsonstr);

        return true;
	};
	
    _pLiteDBConnection.on_created = function () { };

    //===============================================================
    // nexacro.LiteDBConnection : Properties
    //===============================================================
    _pLiteDBConnection.set_busytimeout = function (v)
	{
	    if (this.paramck_busytimeout(v))
	    {
		    this.busytimeout = v;
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
	        this.datasource = v;
	        if (this.preconnect == "true" || this.preconnect == true)
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
        if (v == nexacro.LiteDBConnection.openReadWrite || v == nexacro.LiteDBConnection.openReadWriteCreate)
        {
		    this.openflag = v;
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
		    this.preconnect = v;
		    if (this.preconnect == "true" || this.preconnect == true)
		    {
			    if (this.datasource != "")
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
		//Andoird/iOS/HTML5 버전은 무조건 async=true로 동장.
	};

    //===============================================================
    // nexacro.LiteDBConnection : Methods
    //===============================================================
    // SQLConnection에 연결된 Database에 Transaction을 설정한다	
    _pLiteDBConnection.begin = function ()
    {   	        
        var params = '""';
        var jsonstr = '{"id":'+this._id+', "div":"SQLConnection", "method":"begin", "params":'+params+'}'; 
        nexacro.Device.exec(jsonstr); 
    };

	// SQLConnection에 연결된 Database를 닫는다.
    _pLiteDBConnection.close = function ()
    {        
        var params = '""';
        var jsonstr = '{"id":'+this._id+', "div":"SQLConnection", "method":"closeDB", "params":'+params+'}'; 
        nexacro.Device.exec(jsonstr); 
    };

	// SQLConnection에 연결된 Database에 Commit을 수행한다
    _pLiteDBConnection.commit = function ()
    {        
        var params = '""';
        var jsonstr = '{"id":'+this._id+', "div":"SQLConnection", "method":"commit", "params":'+params+'}'; 
        nexacro.Device.exec(jsonstr); 
     };

	// SQLConnection이 Database에 연결되어 있는지 여부를 확인한다
    _pLiteDBConnection.isConnected = function ()
    {
        var params = '""';
        var jsonstr = '{"id":'+this._id+', "div":"SQLConnection", "method":"isConnected", "params":'+params+'}'; 
        nexacro.Device.exec(jsonstr); 
     };

	// SQLConnection이 Database에 연결한다
    _pLiteDBConnection.open = function (strDataSource, constOpenFlag)
    {
        if (typeof (constOpenFlag) != "undefined" || constOpenFlag != null)
        {
            this.openflag = constOpenFlag;      
        }

        if (typeof (strDataSource) != "undefined" || strDataSource != null)
        {
            this.datasource = strDataSource;
        }

        if (this.paramck_asyncOpen(this.datasource, this.openflag))
        {
            var params = '{"datasource":"'+this.datasource+'", "openflag":"'+this.openflag + '", "busytimeout":"'+this.busytimeout + '"}';
            var jsonstr = '{"id":'+this._id+', "div":"SQLConnection", "method":"openDB", "params":'+params+'}';  
            nexacro.Device.exec(jsonstr); 
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
    	var params = '""';
        var jsonstr = '{"id":'+this._id+', "div":"SQLConnection", "method":"rollback", "params":'+params+'}'; 
        nexacro.Device.exec(jsonstr);      
	};	
	
    //===============================================================
    // nexacro.LiteDBConnection : Event Handlers
    //===============================================================
    _pLiteDBConnection._onsuccess = function (objData)
    {
		var e = new nexacro.LiteDBEventInfo("onsuccess", objData.reason, objData.returnvalue);
		this._fire_onsuccess(this, e);
    };

    _pLiteDBConnection._fire_onsuccess = function (objLiteDBConnection, eLiteDBEventInfo)
    {
        if (this.onsuccess && this.onsuccess._has_handlers)
        {
			return this.onsuccess._fireEvent(this, eLiteDBEventInfo);
		}
		return true;
	};    
	
    _pLiteDBConnection._onerror = function (objData)
    {
		
		var e = new nexacro.LiteDBErrorEventInfo("onerror", objData.errorcode, objData.errormsg, objData.ldberrorcode, objData.ldberrormsg);
		this._fire_onerror(this, e);
    };

    _pLiteDBConnection._fire_onerror = function (objLiteDBConnection, eLiteDBErrorEventInfo)
    {
        if (this.onerror && this.onerror._has_handlers)
        {
			return this.onerror._fireEvent(this, eLiteDBErrorEventInfo);
		}
		return true;
	};
	
    //===============================================================
    // nexacro.LiteDBConnection : Logical Part
    //===============================================================
    _pLiteDBConnection.paramck_busytimeout = function (timout)
    {
        if (timout == null || typeof (timout) == "undefined")
        {
            return false;
        }

        if (!nexacro.Device.publicNumCheck(timout))
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
        if (datasrc == null || typeof (datasrc) == "undefined")
        {
            return false;
        }
        return true;
    };

    /*
	_pLiteDBConnection.paramck_preconnect = function(preconnect) {
		if (preconnect ==null || typeof(preconnect) == "undefined" || typeof(preconnect) != "boolean"  )
		{
			if (preconnect.toLowerCase() == 'true' || preconnect.toLowerCase() == 'false')
				return true;
			else
				return false;
		}else{
			return true;
		}	
	}
    */

    _pLiteDBConnection.paramck_asyncOpen = function (strDataSource, constOpenFlag)
    {
        if (strDataSource == null || typeof (strDataSource) == "undefined" || typeof (strDataSource) != "string")
        {
            return false;
        }

        if (!nexacro.Device.publicNumCheck(constOpenFlag))
        {
            return false;
        }
        return true;
    };

    _pLiteDBConnection.paramck_query = function (db_query)
    {
        if (db_query == null || typeof (db_query) == "undefined" || typeof (db_query) != "string")
        {
            return false;
        }
        return true;
    };
    
    _pLiteDBConnection.paramck_paramck_ldbconnection = function (objconnection)
    {
        if (objconnection == null || typeof (objconnection) == "undefined" || !(objconnection instanceof nexacro.LiteDBConnection))
        {
            if (typeof (objconnection) != "string")
            {
            }
            else
            {
                return false;
            }
        }
        return true;
    };

    _pLiteDBConnection.paramck_asyncExecuteQuery = function (db_query)
    {
        if (db_query == null || typeof (db_query) == "undefined" || typeof (db_query) != "string")
        {
            return false;
        }
        return true;
    };

    delete _pLiteDBConnection;
}

////==============================================================================
////nexacro.SQLParameter
////Query를 수행하는 Object
////==============================================================================
if (nexacro._OS == "iOS" && !nexacro.LiteDBParameter)
{
    nexacro.LiteDBParameter = function (name, type, value)
    {
		this.id = this.name = name || "";
		this.type = type || "string";
		this.value = value;
	};
    var _pLiteDBParameter = nexacro.LiteDBParameter.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.LiteDBParameter);    
    _pLiteDBParameter._type_name = "LiteDBParameter";
	
    //===============================================================
    // nexacro.SQLParameter : Properties
    //===============================================================
    _pLiteDBParameter.set_name = function (v)
	{
        if (this.paramck_datasource(v))
        {
            this.name = v;
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
		    this.value = v;
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
		    this.type = v;
		    return true;
	    }
	    else
	    {
    	    return false;
        }
    };
     
    _pLiteDBParameter.toJSON = function ()
    {
		var valueString;
		if(this.value == null) {
			valueString = 'null';
		}
		else if(this.value == undefined) {
			valueString = 'undefined';
		}
		else {
			switch (nexacro.DataUtils.toTypeCode(this.type)) {
			case 2: /* int */
			case 3: /* float, double */
				valueString = nexacro.DataUtils.toTextFromDecimal(this.value);
				break;
			case 4: /* decimal, bigdecimal */
				valueString = '"' + nexacro.DataUtils.toTextFromDecimal(this.value) + '"';
				break;
			case 5: /* date */
				valueString = '"' + nexacro.DataUtils.toTextFromDate(this.value) + '"';
				break;
			case 6: /* time */
				valueString = '"' + nexacro.DataUtils.toTextFromTime(this.value) + '"';
				break;
			case 7: /* datetime */
				if (this.value.dateObj == undefined)
					valueString = '"' + nexacro.DataUtils.toTextFromDateTime(this.value) + '"';
				else
					valueString = '"' + nexacro.DataUtils.toTextFromDateTime(this.value.dateObj) + '"';
				break;
			case 0: /* undefined */
			case 1: /* string */
			case 8: /* blob */
			case 9: /* variant */
			default:
				valueString = '"' + nexacro.Device.encodeString(this.value) + '"';
				break;
			}
		}
		return nexacro._executeGlobalEvalStr('({"name":"' + this.name + '","type":' + nexacro.DataUtils.toTypeCode(this.type) + ',"value":' + valueString + '})');
	};
	
    //===============================================================
    // nexacro.LiteDBParameter : Logical Part
    //===============================================================
    _pLiteDBParameter.paramck_datasource = function (datasrc)
	{
	    if (datasrc == null || typeof (datasrc) == "undefined")
	    {
	        return false;
	    }
	    return true;
	};

    delete _pLiteDBParameter;
}

////==============================================================================
////nexacro.LiteDBStatement
////Query를 수행하는 Object
////==============================================================================
if (nexacro._OS == "iOS" && !nexacro.LiteDBStatement)
{
    nexacro.LiteDBStatement = function (name, parent)
    {
        this.id = this.name = name || null;
        if (parent)
            this.parent = parent;

        this._id = nexacro.Device.makeID();
        nexacro.Device._userCreatedObj[this._id] = this;
        
        this._obj = parent;
		
        this.query = "";														// ?˜í–‰??SQL Query
        this.ldbconnection = "";												// SQLStatementë¥??˜í–‰??SQLConnection Object
        this.parameters = {};
        this.paramdataset;
        this.applyrowpos = -1;
        this.enableevent = true;
        this.async = true;

        this._event_list = {
             "onsuccess":1, "onerror":1
        };	
	    
        this.onsuccess = null;
        this.onerror = null;
		
        var params = '""';
        var jsonstr = '{"id":'+this._id+', "div":"SQLStatement", "method":"constructor", "params":'+params+'}'; 
        nexacro.Device.exec(jsonstr, true);        
    };

    var _pLiteDBStatement = nexacro.LiteDBStatement.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.LiteDBStatement);    
    _pLiteDBStatement._type_name = "LiteDBStatement";

	// destroy
    _pLiteDBStatement.destroy = function ()
	{
		var params = '""';
		var jsonstr;
		
		delete nexacro.Device._userCreatedObj[this._id];
			
        jsonstr = '{"id":'+this._id+', "div":"SQLStatement", "method":"destroy", "params":'+params+'}'; 	
        nexacro.Device.exec(jsonstr);

		return true;
    };

    _pLiteDBStatement.on_created = function () { };
	
    //===============================================================
    // nexacro.LiteDBStatement : Properties
    //===============================================================

    _pLiteDBStatement.set_query = function (v)
	{
	    if (this.paramck_query(v))
	    {
		    this.query = v;
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
			this.ldbconnection = v;
			ret = true;
		}
		else if (typeof (v) == "string")
		{
			var at = "@"; 
			if (v.indexOf(at) == 0) //@ 있으면 제거.
			{
				v = v.substring(at.length);
			}
			else if (v.match(/@/) == null) //없으면 붙여서 강제로 false.
			{ 
			  v = at + v;
			}
				
			if (null != this._obj[v] && this._obj[v] instanceof nexacro.LiteDBConnection)
			{
				this.ldbconnection = this._obj[v];
				ret = true;
			}			
		} 
		
		if (ret)
		{
            var params = '{"connectionID":"' + this.ldbconnection._id + '"}';
            var jsonstr = '{"id":'+ this._id +', "div":"SQLStatement", "method":"set_SQLConnection", "params":'+params+'}'; 
            nexacro.Device.exec(jsonstr);
		}
		
		return ret;
	};
	
    _pLiteDBStatement.set_parameters = function (v)
	{
	    if (v instanceof Object)
	    {
			this.parameters = v;
			return true;
		}
		return false;
	};
	
	_pLiteDBStatement.set_async = function (v)
	{
		//Andoird/iOS/HTML5 버전은 무조건 async=true로 동장.
	};
	
    //===============================================================
    // nexacro.LiteDBStatement : Methods
    //===============================================================
    _pLiteDBStatement.close = function ()
    {
        // Query 수행을 중단한다
        var params;
        
        if (nexacro.Device.curDevice == DeviceType.ANDROID)
	    {
            params = '{"id":"'+this._id+'"}';           
	    }
	    else
	    {
            params = '""';            
	    }
	    var jsonstr = '{"id":' + this._id + ',"div":"SQLStatement", "method":"close", "params":' + params + '}';
	    nexacro.Device.exec(jsonstr);
	};
    	
    _pLiteDBStatement.executeQuery = function (strQuery)
	{
	    // Query중 Select문을 지원한다
	    // query 검사 및 설정.
 
	    if (strQuery == null)
	    {
	        if (this.query.length == DeviceType.ANDROID)
	        {
	            return false;
	        }
	    }
	    else if (strQuery)
	    {
	        if (typeof (strQuery) == "string" && strQuery.length > 0)
	        {	           
	            this.query = strQuery;
	        }
	        else
	        {	          
	            return false;
	        }
	    }

	    var retType = this.caheckTypeKeyword(this.query);
	    // 1 = select, 2 = insert, 3 = update, 4 = delete
	    if (retType != 1)
	    {
	        return false;
	    }

	    // native 로 넘겨줄때만 쿼리 가공 2012.3.13 pg
	    // this.checkQueryString();
	    var retQuery = nexacro.Device.encodeString(this.query);
	    var param_dataset = new nexacro.Dataset();
	    var param_parameters = {};
	    var param_applyrowpos = -1;

	    if (this.parameters instanceof nexacro.Dataset)
	    {
	        param_dataset = this.parameters;
	    }
	    else
	    {
	        param_parameters = this.parameters;
	    }

	    // 실행 
	    /*
		if (nexacro.Device.curDevice == 0) {
			//var params = '{"query":"'+ retQuery +'","id":"'+ this.ldbconnection._id + '"}';
			var params = '{"query":"'+ retQuery +'","id":"'+ this.ldbconnection._id + '","parameters":'+JSON.stringify(this.parameters) + ',"paramdataset":' + nexacro.Device.DatasetToJSONString2(this.paramdataset) + ',"applyrowpos":' + this.applyrowpos+'}';
			var jsonstr = '{"id":'+this._id+',"div":"SQLStatement", "method":"executeQuery", "params":'+params+'}'; 
			nexacro.Device.exec(jsonstr);
		}else{
			//var params = '{"query":"'+retQuery+'", "qType":"'+ retType + '"}';
			var params = '{"query":"'+retQuery+'", "qType":"'+ retType + '","parameters":'+JSON.stringify(this.parameters) + ',"paramdataset":' + nexacro.Device.DatasetToJSONString2(this.paramdataset) + ',"applyrowpos":' + this.applyrowpos + '}';
			var jsonstr = '{"id":'+this._id+',"div":"SQLStatement", "method":"asyncExecuteQuery2", "params":'+params+'}'; 
			nexacro.Device.exec(jsonstr);
		}*/

        //2014.04.16 Android를 SQLite.js로 옮김 
        /* 
	    if (nexacro.Device.curDevice == 0)
	    {
	        //var params = '{"query":"'+ retQuery +'","id":"'+ this.ldbconnection._id + '"}';
	        var params = '{"query":"'+ retQuery +'","id":"'+ this.ldbconnection._id + '","parameters":'+JSON.stringify(param_parameters) + ',"paramdataset":' + nexacro.Device.DatasetToJSONString2(param_dataset) + ',"applyrowpos":' + param_applyrowpos+'}';
	        var jsonstr = '{"id":'+this._id+',"div":"SQLStatement", "method":"executeQuery", "params":'+params+'}';
	        nexacro.Device.exec(jsonstr);
	    }
	    else
        */
	    {
	        //var params = '{"query":"'+retQuery+'", "qType":"'+ retType + '"}';
	        var params = '{"query":"'+retQuery+ '","parameters":'+JSON.stringify(param_parameters) + ',"paramdataset":' + nexacro.Device.DatasetToJSONString2(param_dataset) + ',"applyrowpos":' + param_applyrowpos + '}';
	        var jsonstr = '{"id":' + this._id + ',"div":"SQLStatement", "method":"executeQuery", "params":' + params + '}';
	        nexacro.Device.exec(jsonstr);
	    }

	    // 파라메터 오류 없음 리턴.       

	    return true;
	};

    // Query중 Insert, Update, Delete 구문을 지원한다
    _pLiteDBStatement.executeUpdate = function (strQuery)
	{
	    // query 검사 및 설정.	   
	    if (strQuery == null)
	    {
	        if (this.query.length == 0)
	        {
	            return false;
	        }
	    }
	    else if (strQuery)
	    {
	        if (typeof (strQuery) == "string" && strQuery.length > 0)
	        {
	            this.query = strQuery;
	        }
	        else
	        {
	            return false;
	        }
	    }
	    else
	    {
	        return false;
	    }

	    var retType = this.caheckTypeKeyword(this.query);
	    // 1 = select, 2 = insert, 3 = update, 4 = delete, 0 = etc...

	    // native 로 넘겨줄때만 쿼리 가공 2012.3.13 pg
	    //this.checkQueryString();
	    var retQuery = nexacro.Device.encodeString(this.query);

	    var param_dataset = new nexacro.Dataset();
	    var param_parameters = {};
	    var param_applyrowpos = -1;

	    if (this.parameters instanceof nexacro.Dataset)
	    {
	        param_dataset = this.parameters;
	    }
	    else
	    {
	        param_parameters = this.parameters;
	    }

	    // 실행 
	    /*
		if (nexacro.Device.curDevice == 0) {
			//this.query = strQuery || "";
			//var params = '{"query":"'+ retQuery +'","id":"'+ this.ldbconnection._id + '"}';
			var params = '{"query":"'+ retQuery +'","id":"'+ this.ldbconnection._id + '","parameters":'+JSON.stringify(this.parameters) + ',"paramdataset":' + nexacro.Device.DatasetToJSONString2(this.paramdataset) + ',"applyrowpos":' + this.applyrowpos + '}';
			var jsonstr = '{"id":'+this._id+',"div":"SQLStatement", "method":"executeUpdate", "params":'+params+'}'; 
			nexacro.Device.exec(jsonstr);
		}else{
			//var params = '{"query":"'+retQuery+'", "qType":"'+ retType + '"}';
			var params = '{"query":"'+retQuery+'", "qType":"'+ retType + '","parameters":'+JSON.stringify(this.parameters) + ',"paramdataset":' + nexacro.Device.DatasetToJSONString2(this.paramdataset) + ',"applyrowpos":' + this.applyrowpos + '}';
			var jsonstr = '{"id":'+ this._id +', "div":"SQLStatement", "method":"asyncExecuteUpdate2", "params":'+params+'}'; 
			nexacro.Device.exec(jsonstr);
		}*/

        //2014.04.16 Android를 SQLite.js로 옮김
        /*
	    if (nexacro.Device.curDevice == 0)
	    {
	        //this.query = strQuery || "";
	        //var params = '{"query":"'+ retQuery +'","id":"'+ this.ldbconnection._id + '"}';
	        var params = '{"query":"'+ retQuery +'","id":"'+ this.ldbconnection._id + '","parameters":'+JSON.stringify(param_parameters) + ',"paramdataset":' + nexacro.Device.DatasetToJSONString2(param_dataset) + ',"applyrowpos":' + param_applyrowpos + '}';
	        var jsonstr = '{"id":'+this._id+',"div":"SQLStatement", "method":"executeUpdate", "params":'+params+'}';
	        nexacro.Device.exec(jsonstr);
	    }
	    else
        */
	    {
	        //var params = '{"query":"'+retQuery+'", "qType":"'+ retType + '"}';
	        var params = '{"query":"' + retQuery + '", "qType":"' + retType + '","parameters":' + JSON.stringify(param_parameters) + ',"paramdataset":' + nexacro.Device.DatasetToJSONString2(param_dataset) + ',"applyrowpos":' + param_applyrowpos + '}';
	        var jsonstr = '{"id":' + this._id + ', "div":"SQLStatement", "method":"executeUpdate", "params":' + params + '}';
	        nexacro.Device.exec(jsonstr);
	    }

	    // 파라메터 오류 없음 리턴. 
	    return true;
	};
    	
    //===============================================================
    // nexacro.LiteDBStatement : Event Handlers
    //===============================================================
    _pLiteDBStatement._onsuccess = function (objData)
	{
		var e;
		if (objData.reason != "7")
		{
			e = new nexacro.LiteDBEventInfo("onsuccess", objData.reason, objData.returnvalue);
		}
		else
		{			
			//executeQuery의 실행결과는 dataset로 리턴한다.
			var tempDS = new nexacro.Dataset("__tempDS", this._obj);
			/*
			var i=0, j=0;
			var dsdata = "";
			dsdata = objData.returnvalue;
				
			tempDS.clear();
			
			// col type 설정.
			if (dsdata.colType){
				for(i=0; i<dsdata.colType.length; i++) {
					if (dsdata.colType[i].type == "0") {	// NULL
						tempDS.addColumn(dsdata.colType[i].name, "String");
					} else if (dsdata.colType[i].type == "1") {	// INTEGER
						tempDS.addColumn(dsdata.colType[i].name, "Int");
					} else if (dsdata.colType[i].type == "2") {	// FLOAT
						tempDS.addColumn(dsdata.colType[i].name, "Float");
					} else if (dsdata.colType[i].type == "3") {	// STRING
						tempDS.addColumn(dsdata.colType[i].name, "String");
					} else if (dsdata.colType[i].type == "4") {	// BLOB
						tempDS.addColumn(dsdata.colType[i].name, "BLOB");
					}
				}
			}
			// row data 설정.
			if (dsdata.data){
				for(i=0; i<dsdata.data.length; i++) {
					tempDS.addRow();
					
					if (dsdata.colType){
						for(j=0; j<dsdata.colType.length; j++) {
					
							var value = dsdata.data[i][dsdata.colType[j].name];
							value = value.replace(/\&amp\;/g, "&");
							value = value.replace(/\&lt\;/g, "<");
							value = value.replace(/\&gt\;/g, ">");
							value = value.replace(/\&quot\;/g, "\"");
							value = value.replace(/\&apos\;/g, "'");
							value = value.replace(/\&\#32\;/g, " ");
							value = value.replace(/\&\#13\;/g, "\r");
							value = value.replace(/\&\#10\;/g, "\n");
							value = value.replace(/\&\#9\;/g, "\t");
							
							dsdata.data[i][dsdata.colType[j].name] = value;
							
							//console.info(dsdata.data[i][dsdata.colType[j].name]);
							
							//alert("COL:" + j + " ROW:"+i + " colName:" + dsdata.colType[j].name + " data:" + eval("dsdata.data[i]."+ dsdata.colType[j].name));
							tempDS.setColumn(i, dsdata.colType[j].name, eval("dsdata.data[i]."+ dsdata.colType[j].name));
						}
					}
				}
			}*/
			tempDS = nexacro.Device.JSONObjectToDataset2(objData.returnvalue, tempDS);
			e = new nexacro.LiteDBEventInfo("onsuccess", objData.reason, tempDS);
		}
		this._fire_onsuccess(this, e);
	};

    _pLiteDBStatement._fire_onsuccess = function (objLiteDBStatement, eLiteDBEventInfo)
	{
	    if (this.onsuccess && this.onsuccess._has_handlers)
	    {
			return this.onsuccess._fireEvent(this, eLiteDBEventInfo);
		}
		return true;
	};

    _pLiteDBStatement._onerror = function (objData)
	{
		var e = new nexacro.LiteDBErrorEventInfo("onerror", objData.errorcode, objData.errormsg, objData.ldberrorcode, objData.ldberrormsg);
		this._fire_onerror(this, e);
	};

    _pLiteDBStatement._fire_onerror = function (objLiteDBStatement, eLiteDBErrorEventInfo)
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
	        if (strQuery.match(/select/) != null) { return 1; }
	        else if (strQuery.match(/insert/) != null) { return 2; }
	        else if (strQuery.match(/update/) != null) { return 3; }
	        else if (strQuery.match(/delete/) != null) { return 4; }

            /*
	        if (nexacro._indexOf(arr[i], "select") > 0) { return 1; }
	        else if (nexacro._indexOf(arr[i], "insert") > 0) { return 2; }
	        else if (nexacro._indexOf(arr[i], "update") > 0) { return 3; }
	        else if (nexacro._indexOf(arr[i], "delete") > 0) { return 4; }
            */
	    }
        
	    return 0;
	};

    _pLiteDBStatement.paramck_query = function (db_query)
	{
	    if (db_query == null || typeof (db_query) == "undefined" || typeof (db_query) != "string")
	    {
	        return false;
	    }
	    return true;
	};

    delete _pLiteDBStatement;
}


// 2013.12.05 UltraLite 객체 UltraLite.js로 분리함.(for cocacola) 

if (!nexacro.FakeXMLHttpRequest) 
{
    nexacro.FakeXMLHttpRequest = function (name, parent, ndatatype, compress, async)
	{
	    this.id = this.name = name;
	    if (parent)
	        this.parent = parent;

		this._id = nexacro.Device.makeID();
		nexacro.Device._userCreatedObj[this._id] = this;
		this._obj = parent;
		
		this.strURL = "";
		this.strDataType = ndatatype || "";
		this.strCompress = compress;
		

		this.responseHeaders = {};
		this.responseAllHeaders = {}; // = {};
		this.requestHeaders = {};

		// XMLHttpRequest -->
		/* states */
		this.UNSENT = 0;
		this.OPENED = 1;
		this.HEADERS_RECEIVED = 2;
		this.LOADING = 3;
		this.DONE = 4; 

        /* attribute */
        this.method = "";
        this.async = async;

		this.readyState = 0;

		/* request */
		this.timeout = 0;
		this.withCredentials = false;
		this.upload = {}; // readonly

		this._filelist;     // for FileUpTransfer
		this._postdatalist; // for FileUpTransfer

        /* XMLHttpRequest properties */
		this.readyState = 0;
		this.status = 0;
		this.statusText = "";
		this.response  = "";
		this.responseType = "";
		this.responseText = "";
		this.responseXML = "";
		this.onreadystatechange = function() {}; // event handler
		
		if (async)
		{
			var params = '""';
			var jsonstr = '{"id":'+this._id+', "div":"FakeXMLHttpRequest", "method":"constructor", "params":'+params+'}'; 
			nexacro.Device.exec(jsonstr);
		}
	};
	
    var _pFakeXMLHttpRequest = nexacro.FakeXMLHttpRequest.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.FakeXMLHttpRequest);
    _pFakeXMLHttpRequest._type_name = "FakeXMLHttpRequest";

    _pFakeXMLHttpRequest.destory = function()
	{
    	var params = '""';
		var jsonstr;
		
		delete nexacro.Device._userCreatedObj[this._id];

		jsonstr = '{"id":'+this._id+', "div":"FakeXMLHttpRequest", "method":"destroy", "params":'+params+'}'; 
		nexacro.Device.exec(jsonstr);
		
		return true;
	};
	
	_pFakeXMLHttpRequest.on_created = function () {};
	
	_pFakeXMLHttpRequest.open = function(method, path, async) 
	{	
		this.method = method;
		this.strURL = path;	
	};

	_pFakeXMLHttpRequest.setRequestHeader = function(header, value) 
	{		
		this.requestHeaders[header] = value; 
	};

	_pFakeXMLHttpRequest.send = function (data) 
	{
		if (data instanceof FormData)
		{
			this.fileupload();
		}
		else
		{
			this.sendData(data);
		}
	};

	_pFakeXMLHttpRequest.sendData = function(data)
	{
		this.SendData = data;
		
        var attrs = '{"method":"'+this.method+'","async":'+this.async+'}';

		var params = '{"attrs":'+ attrs 
				   + ',"sendData":"' + nexacro.Device.encodeString(data)
				   + '","strURL":"'+ this.strURL 
				   + '","protocolparameters":'+ JSON.stringify(nexacro.Device._protocolparameters) 
				   + ',"strDataType":"'+ this.strDataType 
				   + '","bCompress":"'+ this.strCompress
				   + '","timeout":"' + this.timeout
				   + '","requestHeaders":'+ JSON.stringify(this.requestHeaders)
				   + '}';
		var jsonstr = '{"id":"' + this._id 
					+ '", "div":"FakeXMLHttpRequest", "method":"' + 'sendData'
					+ '", "params":' + params 
					+ '}';

		var response = nexacro.Device.exec(jsonstr, !this.async);
        if (!this.async)
        {
        	var jsonData = JSON.parse(response);
        	if (jsonData)
            {
                var responseHeaders;

        		if (jsonData['readyState'])
        			this.readyState = jsonData['readyState'];
        		if (jsonData['status'])
        			this.status = jsonData['status'];
        		if (jsonData['statusText'])
        			this.statusText = jsonData['statusText'];
        		if (jsonData['responseText'])
        			this.responseText = nexacro.Device.decodeString(jsonData['responseText']);
        		if (jsonData['responseAllHeaders'])
        			responseHeaders = JSON.parse(jsonData['responseAllHeaders']);
        		if (responseHeaders)
        			this.responseAllHeaders = JSON.stringify(responseHeaders);
        	}
        }
	};

	_pFakeXMLHttpRequest.fileupload = function ()
	{
		var FILE_SEPERATOR = "|";
		var POSTDATA_SEPERATOR = "&";

		this.async = true;

		var filelist = this._filelist;
		var postdatalist = this._postdatalist;
		
		var filelistkeys = Object ? Object.keys(filelist) : "";
		for (var i = 0, len = filelistkeys.length, fileliststr = ""; i < len; i++)
		{
			fileliststr += filelist[filelistkeys[i]].fullpath;
			fileliststr += (i < len - 1) ? FILE_SEPERATOR : "";
		}

		var postdatalistkeys = Object ? Object.keys(postdatalist) : "";
		for (var i = 0, len = postdatalistkeys.length, postdatastr = ""; i < len; i++)
		{
			postdatastr += postdatalistkeys[i];
			postdatastr += "=";
			postdatastr += postdatalist[postdatalistkeys[i]]
			postdatastr += (i < len - 1) ? POSTDATA_SEPERATOR : "";
		}

		var attrs = '{"method":"' + this.method + '","async":' + this.async + ',"username":"' + this.username + '","password":"' + this.password + '"}';

		var params = '{"strURL":"' + this.strURL + '"'
			+ ',"strDataType":"' + this.strDataType + '"'
			+ ',"postdata":"' + postdatastr + '"'
			+ ',"filelist":"' + fileliststr + '"'
			+ '}';
		var jsonstr = '{"id":"' + this._id
			+ '", "div":"FakeXMLHttpRequest", "method":"' + 'fileUpload'
			+ '", "params":' + params
			+ '}';

		nexacro.Device.exec(jsonstr, !this.async);
	};

	_pFakeXMLHttpRequest.getSendData = function ()
	{
		return nexacro.Device.encodeString(this.SendData);
	};
				
	_pFakeXMLHttpRequest.abort = function() 
	{		
		var params = '{}';
		var jsonstr = '{"id":' + this._id + ', "div":"FakeXMLHttpRequest", "method":"abort", "params":' + params + '}';
		
		nexacro.Device.exec(jsonstr);
	};

	_pFakeXMLHttpRequest.getResponseHeader = function(header)
	{
		return this.responseHeaders[header];
	};

	_pFakeXMLHttpRequest.getAllResponseHeaders = function()
	{
		return this.responseAllHeaders; 
	};

	_pFakeXMLHttpRequest.overrideMimeType = function(mime)
	{
	};

	/* native interface */
	_pFakeXMLHttpRequest._fire_onreadystatechange = function(ret)
	{
        var retData = nexacro._executeGlobalEvalStr("(" + ret + ")");
        this.readyState = retData.readyState;
        this.status = retData.status;
        var e;

        if (retData.e)
            e = JSON.parse(nexacro.Device.decodeString(retData.e));
        if (retData.responseText)
            this.responseText = nexacro.Device.decodeString(retData.responseText);
        if (retData.responseAllHeaders)
            this.responseHeaders = JSON.parse(nexacro.Device.decodeString(retData.responseAllHeaders));
        if (this.responseHeaders)
            this.responseAllHeaders = JSON.stringify(this.responseHeaders);

        if (e)
            this.onreadystatechange.call(this, e);
        else
            this.onreadystatechange.call();
	};

	_pFakeXMLHttpRequest._fire_ontargetevent = function(ret)
	{
		var retData = nexacro._executeGlobalEvalStr("(" + ret + ")");
		var eventname = retData.eventname;
		this.readyState = retData.readyState;
		this.status = retData.status;

		if (this.upload[eventname] != undefined)
			this.upload[eventname].call();
	};

	_pFakeXMLHttpRequest._fire_onfileupload = function (ret)
	{
		var retData = nexacro._executeGlobalEvalStr("(" + ret + ")");
		var status, data, url, errcode, httpcode, loaded, total;
		status = retData.status;
		if (retData.data)
			data = nexacro.Device.decodeString(retData.data);
		url = retData.url;
		httpcode = retData.httpcode;
		loaded = retData.loaded;
		total = retData.total;

		this.onreadystatechange.call(this, status, data, url, errcode, httpcode, loaded, total);
	};

	delete _pFakeXMLHttpRequest;

	//TODO check
	nexacro._getFileCache = function (fName)
	{
	    var app = nexacro.getApplication();
		if (nexacro._devicefiles && (nexacro._devicefiles[fName]))
		{
			return nexacro._devicefiles[fName];
		}

		if (fName.trim().indexOf("theme://") >= 0)
		{
			return nexacro._devicetheme[fName];
		}
		return null;
	};
}

if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
{
    if (nexacro.VideoPlayer)
    {
        var _pVideo = nexacro.VideoPlayer.prototype;
        
        _pVideo.play = function (strPlayMode)
        {   
            var obj_elem;

            if (nexacro._isNull(strPlayMode))
            {
                obj_elem = this._obj_elem;
                if (obj_elem)
                {
                    obj_elem._play();
                    this._need_change_event = false;
                }
            }
            else if (nexacro._isString(strPlayMode))
            {
                if ((strPlayMode.toLowerCase() == "360stereo") || strPlayMode.toLowerCase() == "360mono")
                {
                    obj_elem = this._obj_elem;
                    if (obj_elem)
                    {
                        obj_elem._vr360play(strPlayMode);
                        this._need_change_event = false;
                    }
                }
            }
            else
                return false;
        };

        delete _pVideo;
    }

    if (nexacro._VideoPlayerPluginElement)
    {
        var __pVideoPlayerPluginElement = nexacro._VideoPlayerPluginElement.prototype;

        __pVideoPlayerPluginElement._on_plugin_event = function (evt_id, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg8, arg9)
        {
            //trace("__pVideoPlayerPluginElement._on_plugin_event==>id-" + evt_id + ",arg0-" + arg0 + ",arg1-" + arg1 + ",arg2-" + arg2 + ",arg3-" + arg3 + ",arg4-" + arg4);
            var comp = (this.parent_elem ? this.parent_elem.linkedcontrol : null);
            if (comp)
            {
                if (evt_id == "PlayStateChange")
                {
                    var state = null;
                    var value = arg0;
                    
                    switch (value)
                    {
                        case "1":
                            state = "stop";
                            break;
                        case "2":
                            state = "pause";
                            break;
                        case "3":
                            state = "play";
                            break;
                        case "4":
                            state = "scanforward";
                            break;
                        case "5":
                            state = "scanreverse";
                            break;
                        case "6":
                            state = "buffer";
                            break;
                        case "7":
                            state = "wait";
                            break;
                        case "8":
                            state = "ended";
                            break;
                        case "9":
                            state = "transition";
                            break;
                        case "10":
                            state = "ready";
                            break;
                        default:
                            state = "undefined";
                            break;
                    }
                   
                    if (state)
                        comp._on_statuschanged(state);
                }
                else if (evt_id == "OpenStateChange")
                {
                	var objArgs = nexacro._executeGlobalEvalStr("(" + arg0 + ")");
                    var width, height, duration;
               
                    width = objArgs.width;
                    height = objArgs.height;
                    duration = objArgs.duration;

                    if (width > 0 && height > 0)
                    {
                        var nResult = height / width;
                        if (nResult == 0.7500)
                            comp.aspectratio = "4 : 3";
                        else if (nResult == 0.5625)
                            comp.aspectratio = "16 : 9";
                        else if (nResult == 0.625)
                            comp.aspectratio = "16 : 10";
                        else if (nResult == 0.8)
                            comp.aspectratio = "4 : 3";
                        else if (nResult == 1)
                            comp.aspectratio = "1 : 1";
                        else
                        {
                            if (width > 0 && height > 0)
                            {
                                var max, min;
                                var temp, gcd;
                                if (width < height)
                                {
                                    max = width;
                                    min = height;
                                }
                                else
                                {
                                    max = height;
                                    min = width;
                                }
                                while (max % min != 0)
                                {
                                    temp = max % min;
                                    max = min;
                                    min = temp;
                                }

                                gcd = min;

                                width = width / gcd;
                                height = height / gcd;

                                comp.aspectratio = width + " : " + height;
                            }
                            else
                            {
                                comp.aspectratio = width + " : " + height;
                            }
                        }

                        comp.videosize[0] = width;
                        comp.videosize[1] = height;
                    }
                    else
                    {
                        comp.videosize[0] = 0;
                        comp.videosize[1] = 0;
                    }
                    comp.duration = duration > 0 ? duration : 0;
                }
                else if (evt_id == "PositionChange")
                {
                    comp._on_currenttimechanged(arg0);
                }
                else if (evt_id == "MediaError")
                {
                    var errormsg = null;
                    var statuscode;
                    /*
                    switch (arg0)
                    {                      
					case 1:
					    errormsg = "media unknown";
						break;
					case 100:
					    errormsg = "media server died";
						break;
					case -1004:
					    errormsg = "media error io";
						break;
					case -1007:
					    errormsg = "media error malformed";
					    break;
                    case -1010:
                        errormsg = "media error unsupported";
                        break;
                    case -110:
                        errormsg = "media error timed out";
                        break;
                    case 2:
                        errormsg = "VR error";
                        break;
                         default:
                            errormsg = "media error";
                            break;
                    }
                     */
                    switch (arg0)
                    { 
                        case "100":
                        case "1007":
                            errormsg = "error occurred when downloading";
                            statuscode = 2;
                            break;
                        case "-1004":
                            errormsg = "error occurred when decoding";
                            statuscode = 3;
                            break;
                        case "-110":
                        case "2":
                        case "1":
                        case "-1010":
                            errormsg = "video not supported";
                            statuscode = 4;
                            break;
                        case "-1005":
                            errormsg = "fetching process aborted by user";
                            statuscode = 1;
                            break;
                        default:
                            errormsg = "video not supported";
                            statuscode = 4;
                            break;
                    }
                    comp._on_error("NativeError", errormsg, statuscode);
                }

                if (comp[evt_id])
                {
                    var listener = comp[evt_id];
                    if (listener)
                    {
                        return listener._fireEvent(this, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg8, arg9);
                    }
                }
            }
        };

        __pVideoPlayerPluginElement._setVideoCurrentTime = function (name, v) 
        {   
            if (v > -1)
            {
                var object = this._getPluginObject();
                if (object)
                {  
                    object.setProperty("currenttime", v);
                }
            }
        };

        __pVideoPlayerPluginElement._setVideoLoop = function (name, v)
        {
            var object = this._getPluginObject();
            if (object)
            {
                object.setProperty("repeat", v);
            }
        };

        __pVideoPlayerPluginElement._setVideoMute = function (name, v)
        {
            var object = this._getPluginObject();
            if (object)
            {
                object.setProperty("mute", v);
            }
        };

        __pVideoPlayerPluginElement._setVideoVolume = function (name, v)
        {   
            var object = this._getPluginObject();
            if (object)
            {
                object.setProperty("volume", v);
            }
        };

        __pVideoPlayerPluginElement._setVideo360VRMode = function (name, v)
        {
            var object = this._getPluginObject();
            if (object)
            {
                object.setProperty("vr360mode", v);
            }
        };

        __pVideoPlayerPluginElement._play = function ()
        {
            var object = this._getPluginObject();
            if (object)
            {
                object.callMethod("play");
            }
        };

        __pVideoPlayerPluginElement._vr360play = function (mode)
        {
            var object = this._getPluginObject();
            if (object)
            {
                object.callMethod("vr360fullScreen", mode);
            }
        };

        __pVideoPlayerPluginElement._pause = function () 
        {
            var object = this._getPluginObject();
            if (object) 
            {
                object.callMethod("pause");
            }
        };

        __pVideoPlayerPluginElement._stop = function ()
        {
            var object = this._getPluginObject();
            if (object)
            {
                object.callMethod("stop");
            } 
        };

        delete __pVideoPlayerPluginElement;
    }
}