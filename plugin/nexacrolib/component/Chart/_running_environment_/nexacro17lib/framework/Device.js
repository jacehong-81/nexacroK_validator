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
// 00. Device
//==============================================================================
if (!nexacro.DeviceI)
{
    nexacro.DeviceI = function()
    {
        this.setup();
    };

    var _pDeviceI = nexacro.DeviceI.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.DeviceI);
    _pDeviceI._type_name = "Device";

    _pDeviceI.libraryversion = {}; // 0:jarversion, 1:soversion

	_pDeviceI.setup = function() {};

	_pDeviceI.execiOS = function() {};
	
	_pDeviceI.keyEvent = function (keytype/*, keyaction*/)
	{
        var _keyKind = 1; // 0:HOME 1:MENU 2:CANCEL(BACK)
	  
        var MENUKEY = 82;
        var BACKKEY = 4;
	         
        if (keytype == MENUKEY)
        {
            _keyKind = 1;
        }
        else if (keytype == BACKKEY)
        {
            _keyKind = 2;
        } 	

        var application = nexacro.getApplication();
        if (application)
            return application.getActiveForm()._on_devicebuttonup({ button: _keyKind });
	};

	_pDeviceI.uniqueID = 0;

	_pDeviceI.makeID = function()
	{
	    /*
        var curtime = new Date();
        var strMakeID = curtime.getMilliseconds().toString() + Math.floor(Math.random()*100).toString();
        return parseInt(strMakeID);
        */

	    this.uniqueID++;

	    //var curtime = new Date();
	    var strMakeID = this.uniqueID.toString()
                      + Math.floor((Math.random() * (1000 - 100 + 1)) + 100).toString();
	    return parseInt(strMakeID);
	};
	
	_pDeviceI.runCallback = function(sid, sfunc, params)
	{
        // alert('sid : ' + sid + '\n' + 'sfunc : ' + sfunc  + '\n' + '  params : ' + params);
        var obj;
		    
        if (nexacro.Device.curDevice == 0 || nexacro.Device.curDevice == DeviceType.MACOS)
        {
            obj = nexacro._executeGlobalEvalStr("(" + params + ")");
        }
        else
        {
            obj = params;
        }
	    
        var willrunfunc = this._userCreatedObj[sid];
		
        if ((willrunfunc != undefined) && (typeof willrunfunc[sfunc] == "function"))
        {
            return willrunfunc[sfunc](obj);  
        }
	};

    _pDeviceI.on_created = function() {};

    // for debug
    _pDeviceI.print = function(strPrint)
    {
    	// html page 안에 'DeviceAPI_status' id를 갖는 tag가 있어야만 한다.
		var element = document.getElementById('DeviceAPI_status');
		element.innerHTML = element.innerHTML + strPrint + '<br />';
    };

	//-----------------------------------------------------------------------------------------
	//===============================================================================
	//파라미터 체크
	//===============================================================================
    _pDeviceI.publicNumCheck = function (v)
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

        if ((+numberss) != (+numberss))
        {
            return false;
        }

        return true;
    };
    
	/*nexacro.System*/
	//makeCall
    _pDeviceI.pramck_makeCall = function(strPhoneNumber, bAutoDialing)
    {
        if (strPhoneNumber == null || typeof (strPhoneNumber) == "undefined")
        {
			return false;
        }
        else
        {
			strPhoneNumber = strPhoneNumber.toString();
		}
	
		var number ="";
		try{
			number = strPhoneNumber.split("+").join("");
			number = number.split("-").join("");
		}
        catch (e)
        {
			return false;
		}

		var normalize = /[^0-9+-]/gi;
		if (normalize.test(strPhoneNumber) == true)
		{
			normalize.lastIndex = 0;
			return false;
		}
				
		if (typeof (bAutoDialing) != "boolean")
		{
			return false;
		}
		return true;
	};
		
	//play
    _pDeviceI.paramck_play = function(strFilePath)
    {
        if (strFilePath == null || typeof (strFilePath) == "undefined" || typeof (strFilePath) != "string")
        {
			return false;
		}
		var strlength = strFilePath.split(" ").join("");
		if (strlength.length == 0)
		{
	    	return false ;
	    }
		return true;
	};
	/*nexacro.System END*/
		
	/* nexacro.ContactSet */
    _pDeviceI.pramck_contactString = function(strProperty)
    {
        if (strProperty == null || typeof (strProperty) == "undefined" || typeof (strProperty) != "string")
        {
			return false;
		}
		return true;
	};
	
    //not used
    /*
    _pDeviceI.pramck_contactObject = function(strProperty, objType)
    {
        if (!(strProperty instanceof objType))
        {
			return false;
	    }
		return true;
	}
	*/

    _pDeviceI.isConvertDateToString = function(dateString)
    {
	    var dateStringSplit;
	    var date = new Date();
	
	    try {
	    	dateStringSplit = dateString.split('/');
	    	
	        date.setYear(parseInt(dateStringSplit[0]) | 0);
	        date.setMonth(parseInt(dateStringSplit[1]) | 0 - 1);
	        date.setDate(parseInt(dateStringSplit[2]) | 0);
	    } catch (e) {
	        return date;
	    }
	    return date;
	};
	    
	_pDeviceI.parseDateToInt = function(strDate)
	{
	    if (strDate < 10)
	    {
	        strDate = "0"+strDate;
	    }
	    return strDate;
	};
	/* nexacro.ContactSet END */

	_pDeviceI.encodeString = function(source)
	{
		if (source === undefined || source === null)
		    return "";
		if (typeof(source) != 'string')
		    return source;
	    //return encodeURI(source);
		var value = source;
		value = value.replace(/\&/g, "&amp;");
		value = value.replace(/\</g, "&lt;");
		value = value.replace(/\>/g, "&gt;");
		value = value.replace(/\"/g, "&quot;");
		value = value.replace(/\'/g, "&apos;");
		value = value.replace(/\ /g, "&#32;");
		value = value.replace(/\r/g, "&#13;");
		value = value.replace(/\n/g, "&#10;");
		value = value.replace(/\t/g, "&#9;");
        value = value.replace(/\\/g, "&#92;");
        value = value.replace(/\x1d/g, "&#029;"); // Group Separator
		value = value.replace(/\x1e/g, "&#30;"); // SSV - RS
		value = value.replace(/\x1f/g, "&#31;"); // SSV - US
        value = value.replace(/\x03/g, "&#3;");
		return value;
	};
	
	_pDeviceI.decodeString = function(source)
	{
		if (source === undefined || source === null)
		    return "";
		if (typeof(source) != 'string')
		    return source;
	    //return decodeURI(source);
		var value = source;
		value = value.replace(/\&lt\;/g, "<");
		value = value.replace(/\&gt\;/g, ">");
		value = value.replace(/\&quot\;/g, "\"");
		value = value.replace(/\&apos\;/g, "'");
		value = value.replace(/\&\#32\;/g, " ");
		value = value.replace(/\&\#13\;/g, "\r");
		value = value.replace(/\&\#10\;/g, "\n");
		value = value.replace(/\&\#9\;/g, "\t");
        value = value.replace(/\&\#92\;/g, "\\");
        value = value.replace(/\&\#29\;/g, String.fromCharCode(29)); // Group Separator
		value = value.replace(/\&\#30\;/g, String.fromCharCode(30)); // SSV - RS
		value = value.replace(/\&\#31\;/g, String.fromCharCode(31)); // SSV - US
		value = value.replace(/\&\#3\;/g, String.fromCharCode(3));
		value = value.replace(/\&amp\;/g, "&");
		return value;
	};
	
		/* nexacro.Dataset */
	// Dataset JSON
	// {
	//   "columnInfos":[{"name":"?","type":?},
	//                  {"name":"?","type":?},
	//                  ...,
	//                  {"name":"?","type":?}
	//                 ],
	//   "rows":[[?,?,...,?],
	//           [?,?,...,?],
	//           ...,
	//           [?,?,...,?]
	//          ]
	// }
	
	// Dataset -> JSON string
	_pDeviceI.DatasetToJSONString = function(dataset)
	{
		if (dataset == undefined)
			return '{"columnInfos":[], "rows":[]}';
			
		var colSize = dataset.getColCount();
		var rowSize = dataset.getRowCount();
		
		//var colNames = [];
		var started = false;
		var jsonString = '{"columnInfos":[';
        var i, colInfo;
		for (i = 0; i < colSize; i++)
		{
		    colInfo = dataset.getColumnInfo(i);
		    //colNames.push(colInfo.name);
		    if (started)
		        jsonString += (',{"name":"' + colInfo.name + '", "type":' + colInfo.ntype + '}');
		    else
		        jsonString += ('{"name":"' + colInfo.name + '", "type":' + colInfo.ntype + '}');
		    started = true;
		}

		started = false;
		jsonString += '],"rows":[';
		for (i = 0; i < rowSize; i++)
		{
			if (started)
				jsonString += ',[';
			else
				jsonString += '[';
			started = true;
			
			var colStarted = false;
			for (var j = 0; j < colSize; j++)
			{
				colInfo = dataset.getColumnInfo(j);
				var value = dataset.getColumn(i, colInfo.name);
				
				if (colStarted)
					jsonString += ',';
				colStarted = true;
				
				var valueString;
				if (value == null)
					valueString = 'null';
				else if (value == undefined)
					valueString = 'undefined';
				else 
				{
					switch (colInfo.ntype) 
					{
						case 2: /* int */
						case 3: /* float, double */
							valueString = nexacro.DataUtils.toTextFromDecimal(value);
							break;
						case 4: /* decimal, bigdecimal */
							valueString = '"' + nexacro.DataUtils.toTextFromDecimal(value) + '"';
							break;
						case 5: /* date */
							valueString = '"' + nexacro.DataUtils.toTextFromDate(value) + '"';
							break;
						case 6: /* time */
							valueString = '"' + nexacro.DataUtils.toTextFromTime(value) + '"';
							break;
						case 7: /* datetime */
							if (value.dateObj == undefined)
								valueString = '"' + nexacro.DataUtils.toTextFromDateTime(value) + '"';
							else
								valueString = '"' + nexacro.DataUtils.toTextFromDateTime(value.dateObj) + '"';
							break;
						case 1: /* string */
							valueString = '"' + nexacro.Device.encodeString(value) + '"';
							break;
						case 0: /* undefined */
						case 8: /* blob */
						case 9: /* variant */
						default:
						    valueString = '"' + value + '"';
						    break;
					}
				}
				jsonString += valueString;
			}
			jsonString += ']';
		}
		jsonString += ']}';
		
		return jsonString;
	};

	// Dataset -> Object
	_pDeviceI.DatasetToJSONObject = function(dataset)
	{
        return nexacro._executeEvalStr('(' + nexacro.Device.DatasetToJSONString(dataset) + ')');
	};

	// Object -> Dataset
	_pDeviceI.JSONObjectToDataset = function(jsonObject, dataset)
	{
		if (jsonObject == undefined)
			return dataset;
		if (dataset == undefined)
			dataset = new nexacro.Dataset();
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
						dataset.setColumn(ridx,colInfos[j].name,nexacro.Device.decodeString(rows[i][j]));
						break;
					case 4: /* decimal, bigdecimal */
						dataset.setColumn(ridx,colInfos[j].name,rows[i][j]);
						//dataset.setColumn(ridx,colInfos[j].name,new nexacro.Decimal(rows[i][j]));
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
						dataset.setColumn(ridx,colInfos[j].name,rows[i][j]);
						break;
				}
			}
		}
		return dataset;
	};

	// JSON string -> Dataset
	_pDeviceI.JSONStringToDataset = function(jsonString, dataset)
	{
		if (dataset == undefined)
			dataset = new nexacro.Dataset();
		return nexacro.Device.JSONObjectToDataset(nexacro._executeEvalStr('(' + jsonString + ')'));
	};
	
	/* nexacro.Dataset */
	// Dataset JSON
	// {
	//   "columnInfos":[{"name":"?","type":?},
	//                  {"name":"?","type":?},
	//                  ...,
	//                  {"name":"?","type":?}
	//                 ],
	//   "rows":[{"columnId":?,"columnId":?,...,"columnId":?},
	//           {"columnId":?,"columnId":?,...,"columnId":?},
	//           ...,
	//           {"columnId":?,"columnId":?,...,"columnId":?}
	//          ]
	// }
	
	// Dataset -> JSON string
	_pDeviceI.DatasetToJSONString2 = function(dataset)
	{
		if (dataset == undefined)
			return '{"columnInfos":[], "rows":[]}';
			
		var colSize = dataset.getColCount();
		var rowSize = dataset.getRowCount();
		
		//var colNames = [];
		var started = false;
		var jsonString = '{"columnInfos":[';
        var i, colInfo;
		for (i = 0; i < colSize; i++)
		{
		    colInfo = dataset.getColumnInfo(i);
		    //colNames.push(colInfo.name);
		    if (started)
		        jsonString += (',{"name":"' + colInfo.name + '", "type":' + colInfo.ntype + '}');
		    else
		        jsonString += ('{"name":"' + colInfo.name + '", "type":' + colInfo.ntype + '}');
		    started = true;
		}

		started = false;
		jsonString += '],"rows":[';
		for (i = 0; i < rowSize; i++)
		{
			if (started)
				jsonString += ',{';
			else
				jsonString += '{';
			started = true;
			
			var colStarted = false;
			for (var j = 0; j < colSize; j++) 
			{
				colInfo = dataset.getColumnInfo(j);
				var value = dataset.getColumn(i, colInfo.name);
				if (value == undefined)
					continue;
				
				if (colStarted)
					jsonString += ',';
				colStarted = true;
				
				jsonString += '"' + colInfo.name + '":';
				
				var valueString;
				if (value == null)
					valueString = 'null';
				else if (value == undefined)
					valueString = 'undefined';
				else 
				{
					switch (colInfo.ntype) 
					{
						case 2: /* int */
						case 3: /* float, double */
							valueString = nexacro.DataUtils.toTextFromDecimal(value);
							break;
						case 4: /* decimal, bigdecimal */
							valueString = '"' + nexacro.DataUtils.toTextFromDecimal(value) + '"';
							break;
						case 5: /* date */
							valueString = '"' + nexacro.DataUtils.toTextFromDate(value) + '"';
							break;
						case 6: /* time */
							valueString = '"' + nexacro.DataUtils.toTextFromTime(value) + '"';
							break;
						case 7: /* datetime */
							if (value.dateObj == undefined)
								valueString = '"' + nexacro.DataUtils.toTextFromDateTime(value) + '"';
							else
								valueString = '"' + nexacro.DataUtils.toTextFromDateTime(value.dateObj) + '"';
							break;
						case 1: /* string */
							valueString = '"' + nexacro.Device.encodeString(value) + '"';
							break;
						case 0: /* undefined */
						case 8: /* blob */
						case 9: /* variant */
						default:
							valueString = '"' + value + '"';
							break;
					}
				}
				jsonString += valueString;
			}
			jsonString += '}';
		}
		jsonString += ']}';
		
		return jsonString;
	};

	// Dataset -> Object
	_pDeviceI.DatasetToJSONObject2 = function(dataset)
	{
	    return nexacro._executeEvalStr('(' + nexacro.Device.DatasetToJSONString2(dataset) + ')');
	};

	_pDeviceI.JSONObjectToDataset2 = function(jsonObject, dataset)
	{
		if (jsonObject == undefined)
			return dataset;
		if (dataset == undefined)
		    dataset = new nexacro.Dataset();

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
						dataset.setColumn(ridx,colInfos[j].name,nexacro.Device.decodeString(rows[i][colInfos[j].name]));
						break;
					case 4: /* decimal, bigdecimal */
						//dataset.setColumn(ridx,colInfos[j].name,new nexacro.Decimal(rows[i][colInfos[j].name]));
						dataset.setColumn(ridx,colInfos[j].name,rows[i][colInfos[j].name]);
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
						dataset.setColumn(ridx,colInfos[j].name,rows[i][colInfos[j].name]);
						break;
				}
			}
		}
		return dataset;
	};

	// JSON string -> Dataset
	_pDeviceI.JSONStringToDataset2 = function (jsonString, dataset)
	{
	    if (dataset == undefined)
	        dataset = new nexacro.Dataset();

	    return nexacro.Device.JSONObjectToDataset2(nexacro._executeEvalStr('(' + jsonString + ')'), dataset);
	};
	
	_pDeviceI._isHybrid = function()
	{
	    return this._is_hybrid;
	};

	_pDeviceI.exit = function (useCache)
	{
	    var _useCache = false;

	    if (arguments.length == 0)
	    {
	        _useCache = "false";
	    }
	    else
	    {
	        if (useCache == true || (typeof (useCache) == "string" && useCache == "true"))
	        {
	            _useCache = "true";
	        }
	        else if (useCache == false || (typeof (useCache) == "string" && useCache == "false"))
	        {
	            _useCache = "false";
	        }
	        else
	        {
	            return false;	// param 내용이 맞지 않으므로 false 리턴
	        }
	    }

	    // iOS
	    if (nexacro.Device.curDevice == DeviceType.IOS)
	    {
	        var jsonstr = "";
	        jsonstr = "EXIT" + _useCache;
	        nexacro.Device.exec(jsonstr);
	    }
	};

	delete _pDeviceI;
}

//==============================================================================
// 01. System
//==============================================================================

//==============================================================================
// nexacro.System
// 모바일 기기에 대한 정보를 조회하거나 기본적인 기능들을 수행한다.
//==============================================================================
if (nexacro.System)
{
    nexacro.System.prototype = function()
    {
		this._id = nexacro.Device.makeID();
		nexacro.Device._userCreatedObj[this._id] = this;
		
		this.enableevent = true;
		if (nexacro.Device.curDevice == DeviceType.IOS)
		{
		    //iOS, 
		    //osversion과 mobileproducttype은 빈값이 나오는 문제로 주석처리하고 system.js에 있는 값을 불러오게 함.
		    var osname = "iOS";
		    var devicename, version;
		    var iphone = navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/);
		    var ipad = navigator.userAgent.match(/(iPad).*OS\s([\d_]+)/);
		    if (iphone)
		    {
		        devicename = "iphone";
		        version = iphone[2].replace(/_/g, '.');
		    }
		    if (ipad)
		    {
		        devicename = "ipad";
		        version = ipad[2].replace(/_/g, '.');
		    }

		    this.osversion = osname + " " + version;        		// OS 명칭과 버전 ex) "Android 2.2" or "iOS 4.3.5"
		    this.navigatorname = "nexacro";				            // "NEXACRO-Device"로 고정
		    this.navigatorversion = "17";							// "17"로 고정
		    this.mobilephonenumber = "";							// "01034197718" : '-'가 생략된 번호로만.. Android만 가능, iOS는 가져올수 없으므로 빈값 처리
		    this.mobileproducttype = devicename;					// 모델명 ex) 안드로이드 "SHW-M110S" , 아이폰 "iPhone 3,1"
		    this.mobileuniqueid = "";								// iOS의 경우 UDID를 읽어온다.
		    this.mobileorientation = "";							// 0(Portrait), 1(LandscapeLeft), 2(ReversePortrait), 3(LandscapeRight)   
		    this.taskbarsize = "20";								// iOS의 경우 iPhone,iPAD모두 20 pixel로 고정되어 있다.
		    this.userapppath = "";
		}
	};
	/* readonly 처리*/
    // window.system.getSystemInfo();
    nexacro.System.prototype.set_osversion = function() {};
    nexacro.System.prototype.set_navigatorname = function() {};
    nexacro.System.prototype.set_navigatorversion = function() {};
    nexacro.System.prototype.set_mobilephonenumber = function() {};
    nexacro.System.prototype.set_mobileproducttype = function() {};
    nexacro.System.prototype.set_mobileuniqueid = function() {};
    nexacro.System.prototype.set_mobileorientation = function() {};                    
    nexacro.System.prototype.set_taskbarsize = function() {};
    nexacro.System.prototype.set_userapppath = function() {};
    nexacro.System.prototype.set_sdcardpath = function() {};
    
    nexacro.System.prototype.destroy = function()
    {
		delete nexacro.Device._userCreatedObj[this._id];
		return true;
    };

    /*
    nexacro.Application.prototype.execUpdate = function(bRestart){
    	this._id = nexacro.Hybrid.makeID();
		nexacro.Hybrid._userCreatedObj[this._id] = this;
		
		if (bRestart == "undefined" || bRestart == null){
			this.bRestart = false;
		}else{
			this.bRestart = bRestart;
		}
    	
    	var params = '{"bRestart":"'+this.bRestart+'"}';
    	
    	if (nexacro.Hybrid.curDevice == 0){
    		var jsonstr = '{"id":'+this._id+', "div":"update", "method":"execUpdate",  "params":'+params+'}';
    		nexacro.Hybrid.exec(jsonstr);
    	}else {
    		var jsonstr = '{"id":'+this._id+', "div":"Update",  "method":"execUpdate", "params":'+params+'}';
    		nexacro.Hybrid.exec(jsonstr);
    	}
    };
     */
   
	// DeviceAPI 구동을 위해 내부적으로 쓰이는 API
    //iPhone Only
    nexacro.System.getSystemInfo = function()
    { 
    	this._id = nexacro.Device.makeID();
		nexacro.Device._userCreatedObj[this._id] = this;		
        nexacro.Device.exec('{"id":'+this._id+', "div":"PhoneInfo","method":"getAll"}');
    };
    
    nexacro.System.recvPhoneInfo = function(params)
    {
//        var info = eval("("+params+")");
        nexacro.System.osversion = params.osversion;						// OS 명칭과 버전 ex) "Android 2.2" or "iOS 4.3.5"		
        nexacro.System.mobilephonenumber = params.mobilephonenumber;		// "01034197718" : '-'가 생략된 번호로만.. Android만 가능, iOS는 가져올수 없으므로 빈값 처리
        nexacro.System.mobileproducttype = params.mobileproducttype;		// 모델명 ex) 안드로이드 "SHW-M110S" , 아이폰 "iPhone 3,1"
        nexacro.System.mobileuniqueid = params.mobileuniqueid;			// uniqueID, 안드로이드의 경우 IMEI를 읽어오므로 3G가 없는 PMP성격의 단말인경우 해당 값이 없을수 있다.
        nexacro.System.mobileorientation = params.mobileorientation;   	// 0(Portrait), 1(ReversePortrait), 2(LandscapeLeft), 3(LandscapeRight)	
        this.userapppath = params.userapppath;
        this.sdcardpath = "";
        
        if (nexacro.Device.curDevice == DeviceType.IOS)
        {
            //iOS
            nexacro.Device.isphone = params.isIPhone;
            nexacro.System.computername = params.computername;
            nexacro.System.cpuarchitecture = params.cpuarchitecture;
            nexacro.System.cputype = params.cputype;
            nexacro.System.cpucount = params.cpucount;
            nexacro.Device.libraryversion[0] = params.libraryversion;

            if (params.preferences)
            {
                var localstorage = window.localStorage;
                if (localstorage)
                {
                    var preferences = JSON.parse(params.preferences);
                    for (var key in preferences)
                    {
                        var value = nexacro.Device.decodeString(preferences[key]);
                        // trace("preferences[" + key + "] = " + value + ", localstorage[" + key + "] = " + localstorage[key]);
                        if (!localstorage[key])
                            localstorage.setItem(key, value);
                        else
                        {
                            if (value != localstorage[key])
                                nexacro._setPreferencesValue(key, localstorage[key]);
                        }
                    }
                }
            }
        }
		// ready callback : iOS의 경우 callback 형태로 데이터를 받아야 하므로 해당 데이터가 채워진 시점을 callback으로 전달합니다. 
        // Android 의 경우 필요 없음.
        //oninitend();
    };  

    // js -> native set orientation
    nexacro.System.setOrientation = function (nOrientation)
    {
        if ((nOrientation == null || typeof (nOrientation) == "undefined"))
        {
            return false;
        }

        if (typeof (nOrientation) == "string")
        {
            nOrientation = Number(nOrientation);
        }

        if (nOrientation < 0 || nOrientation > 3) //0,1,2,3
        {
            return false;
        }

        if (nexacro.Device.curDevice == DeviceType.ANDROID)
        {
            nexacro._setOrientation(nOrientation);
        }
        else
        {
            var jsonstr = "";
            jsonstr = "ORIENTATION:" + nOrientation;
            nexacro.Device.exec(jsonstr);
        }
        return true;
    };

    // native -> js set orientation
    nexacro.System._setOrientation = function (nOrientation)
    {
    	// native에서 orienation의 변화가 감지된 경우에 호출하여 js 상의 mobileorientation값을 갱신한다.
    	// 0(Portrait), 1(ReversePortrait), 2(LandscapeLeft), 3(LandscapeRight) 외의 값이 있다면 Native에서 올려주지 않는다. 
    	this.mobileorientation = nOrientation;
    	//iOS
    	if (nexacro.Device.curDevice == DeviceType.IOS)
    	{
    		nexacro.System.mobileorientation = nOrientation;
    	}
    };  
}

/* [shsh_2011.09.21] Device버전에만 초기화 되도록 html.bdt.Device에서 nexacro.$initDeviceAPI()로 초기화 
if (window.system) {
	window.system.init();
	if (nexacro.Device.curDevice == 1) {
        // iOS 의 경우 callback형태로 데이터를 받기위해 필요.
		window.system.getSystemInfo();
	}
}
*/

DeviceType =
{
	ANDROID: 0,
    IOS: 1,
    WINDOWS: 2,
    MACOS:3
};

nexacro._initDeviceAPI = function()
{   
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
}; 

