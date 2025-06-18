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
if (!nexacro.FileUpTransfer)
{
	//==============================================================================
	// nexacro.FileUpTransferEventInfo
	//==============================================================================
	nexacro.FileUpTransferEventInfo = function (obj, id, dsArray, code, message, url, index)
	{
		this.id = this.eventid = id || "onsuccess";
		this.fromobject = this.fromreferenceobject = obj;

		this.datasets = dsArray;
		this.code = code;
		this.message = message;
		this.url = url;

		//this.index = index;
	};

	var _pFileUpTransferEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.FileUpTransferEventInfo);
	nexacro.FileUpTransferEventInfo.prototype = _pFileUpTransferEventInfo;
	_pFileUpTransferEventInfo._type_name = "FileUpTransferEventInfo";

	_pFileUpTransferEventInfo = null;
	//delete _pFileUpTransferEventInfo;

	//==============================================================================
	// nexacro.FileUpTransferErrorEventInfo
	//==============================================================================
	nexacro.FileUpTransferErrorEventInfo = function (obj, id, errortype, errormsg, errorobj, statuscode, requesturi, locationuri, index)
	{
		nexacro.ErrorEventInfo.call(this, obj, id, errortype, errormsg, errorobj, statuscode, requesturi, locationuri);

		//this.index = index;
	};

	var _pFileUpTransferErrorEventInfo = nexacro._createPrototype(nexacro.ErrorEventInfo, nexacro.FileUpTransferErrorEventInfo);
	nexacro.FileUpTransferErrorEventInfo.prototype = _pFileUpTransferErrorEventInfo;
	_pFileUpTransferErrorEventInfo._type_name = "FileUpTransferErrorEventInfo";

	_pFileUpTransferErrorEventInfo = null;
	//delete _pFileUpTransferErrorEventInfo;

	//==============================================================================
	// nexacro.FileUpTransferProgressEventInfo
	//==============================================================================
	nexacro.FileUpTransferProgressEventInfo = function (obj, id, loaded, total, index)
	{
		this.id = this.eventid = id || "onprogress";
		this.fromobject = this.fromreferenceobject = obj;

		this.loaded = loaded;	// 현재까지 전송된 크기
		this.total = total;		// 전송할 전체 크기

		//this.index = index;
	};

	var _pFileUpTransferProgressEventInfo = nexacro._createPrototype(nexacro.ErrorEventInfo, nexacro.FileUpTransferProgressEventInfo);
	nexacro.FileUpTransferProgressEventInfo.prototype = _pFileUpTransferProgressEventInfo;
	_pFileUpTransferProgressEventInfo._type_name = "FileUpTransferProgressEventInfo";

	_pFileUpTransferProgressEventInfo = null;
	//delete _pFileUpTransferProgressEventInfo;

	//==============================================================================
	// nexacro.FileUpTransfer
	//==============================================================================
	nexacro.FileUpTransfer = function (id, parent)
	{
		nexacro._EventSinkObject.call(this, id, parent);

		this._p_filelist = new nexacro.Collection();
		this._p_postdatalist = new nexacro.Collection();

		if (nexacro._OS == "Android" && nexacro._isHybrid && nexacro._isHybrid())
		{
			this._id = nexacro.Device.makeID();
			nexacro.Device._userCreatedObj[this._id] = this;

			var json = {
				id: this._id,
				div: "FileUpTransfer",
				method: "constructor",
				params: ""
			};

			var jsonstr = JSON.stringify(json);
			nexacro.Device.exec(jsonstr);
		}
	};
	var _pFileUpTransfer = nexacro.FileUpTransfer.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.FileUpTransfer);
	_pFileUpTransfer._type_name = "FileUpTransfer";

	/* default properties */
	_pFileUpTransfer._p_url = "";

	/* internal variable */
	_pFileUpTransfer._handle = null;
	_pFileUpTransfer._aborted = false;
	_pFileUpTransfer._user_aborted = false;

	_pFileUpTransfer._TransferType =
	{
		ALL: 1,			// filelist 전체를 한묶음으로 취급
		PART: 2,		// filelist 중 일부를 묶음 ( 1 ~ n )
		PARTALL: 3		// filelist 전체를 한개씩 취급
	};

	/* event list */
	_pFileUpTransfer._event_list = {
		"onsuccess": 1, "onerror": 1,
		"onprogress": 1
	};

	//===============================================================
	// nexacro._pFileUpTransfer : Create & Destroy & Update
	//===============================================================
	_pFileUpTransfer.destroy = function ()
	{
		if (this._p_filelist)
		{
			this._p_filelist.destroy();
			this._p_filelist = null;
		}

		if (this._p_postdatalist)
		{
			this._p_postdatalist.destroy();
			this._p_postdatalist = null;
		}

		if (nexacro._OS == "Android" && nexacro._isHybrid && nexacro._isHybrid())
		{
			delete nexacro.Device._userCreatedObj[this._id];

			var json = {
				id: this._id,
				div: "FileUpTransfer",
				method: "destroy",
				params: ""
			};

			var jsonstr = JSON.stringify(json);
			nexacro.Device.exec(jsonstr);
		}

		return true;
	};

	//===============================================================
	// nexacro._pFileUpTransfer : Properties
	//===============================================================
	_pFileUpTransfer.set_filelist = nexacro._emptyFn;
	_pFileUpTransfer.set_postdatalist = nexacro._emptyFn;
	_pFileUpTransfer.set_url = function (v)
	{
		if (this._p_url != v)
		{
			this._p_url = v;
		}
	};

	_pFileUpTransfer._properties = [
		{ name: "filelist", readonly: true }, { name: "postdatalist", readonly: true }, { name: "url" }
	];

	nexacro._defineProperties(_pFileUpTransfer, _pFileUpTransfer._properties);

	//===============================================================
	// nexacro._pFileUpTransfer : Methods
	//===============================================================
	_pFileUpTransfer.setFile = function (nIndex, vFile)
	{
		if (!vFile || !(vFile instanceof nexacro.VirtualFile))
			return false;

		return this._p_filelist.set_item(nIndex, vFile);
	};

	_pFileUpTransfer.addFile = function (id, vFile)
	{
		if (id === null || id === undefined || id === "" || this._p_filelist[id])
			return -1;

		if (!vFile || !(vFile instanceof nexacro.VirtualFile))
			return -1;

		return this._p_filelist.add_item(id, vFile);
	};

	_pFileUpTransfer.removeFile = function (id)
	{
		return this._p_filelist.delete_item(id);
	};

	_pFileUpTransfer.removeFileByIndex = function (nIndex)
	{
		nIndex = nIndex | 0;
		if (nIndex < 0 || nIndex >= this._p_filelist.length)
		{
			return -1;
		}

		return this._p_filelist.delete_item(nIndex);
	};

	_pFileUpTransfer.getFileArrayByFileName = function (strFileName)
	{
		var ret = null;

		for (var i = 0, file, filelist = this._p_filelist, len = filelist.length; i < len; i++)
		{
			file = filelist[i];
			if (strFileName == file.filename)
			{
				if (!ret)
					ret = [];

				ret.push(file);
			}
		}

		return ret;
	};

	_pFileUpTransfer.getIndexArrayByFileName = function (strFileName)
	{
		var ret = null;

		for (var i = 0, filelist = this._p_filelist, len = filelist.length; i < len; i++)
		{
			if (strFileName == filelist[i].filename)
			{
				if (!ret)
					ret = [];

				ret.push(i);
			}
		}

		return ret;
	};

	_pFileUpTransfer.existFile = function (vFile)
	{
		var ret = false;

		if (!vFile || !(vFile instanceof nexacro.VirtualFile))
			return ret;

		for (var i = 0, filelist = this._p_filelist, len = filelist.length; i < len; i++)
		{
			if (nexacro._isEqualTransferFile(filelist[i], vFile))
			{
				ret = true;
				break;
			}
		}

		return ret;
	};

	_pFileUpTransfer.setPostData = function (strKey, value)
	{
		if (!strKey)
			return;

		this._p_postdatalist.setItem(strKey, value);
	};

	_pFileUpTransfer.removePostData = function (strKey)
	{
		this._p_postdatalist.delete_item(strKey);
	};

	_pFileUpTransfer.getPostData = function (strKey)
	{
		return this._p_postdatalist.getItem(strKey);
	};

	_pFileUpTransfer.clearFileList = function ()
	{
		this._p_filelist.clear();
	};

	_pFileUpTransfer.clearPostDataList = function ()
	{
		this._p_postdatalist.clear();
	};

	_pFileUpTransfer.upload = function (strUrl)
	{
		// init
		this._aborted = false;
		this._user_aborted = false;

		// url validate
		strUrl = strUrl ? nexacro._getServiceLocation(strUrl, null, null, false) : (this._p_url ? nexacro._getServiceLocation(this._p_url, null, null, false) : "");
		if (!strUrl)
			return;

		nexacro._uploadTransfer(this._p_filelist, this._p_postdatalist, strUrl, -1, this);
	};

	//===============================================================
	// nexacro._pFileUpTransfer : Event Handlers
	//===============================================================
	_pFileUpTransfer.on_load = function (data, url, index)
	{
		// 약속된 response를 처리함. 예외형식은 이전단계에서 걸러냄.
		if (data)
		{
			var info = data[0];
			var datasets = data[1];

			if (info)
			{
				var errorcode = info["ErrorCode"];
				var errormsg = info["ErrorMsg"];

				if (errorcode < 0)
				{
					return this.on_fire_onerror("ObjectError", errormsg, this, 9901, url, url, index);
				}
				else
				{
					return this.on_fire_onsuccess(datasets, errorcode, errormsg, url, index);
				}
			}
		}

		return this.on_fire_onerror("ObjectError", "fail to get", this, 9901, url, url, index);
	};

	_pFileUpTransfer.on_message = function (e)
	{
		// cors postmessage 응답용

		// 고정값
		var result;
		var request_url = e.data[0];
		var request_index = e.data[1];

		var data = e.message;
		if (data)
		{
			var data_type;
			var decode_str = nexacro.trimLeft(decodeURIComponent(data.replace(/\+/g, " ")));
			var xmldoc = nexacro._parseXMLDocument(decode_str);

			if (nexacro._getContentType(xmldoc) == "XML")
			{
				data = xmldoc;
				data_type = "XML";
			}
			else
			{
				data_type = data.substring(0, 5).toUpperCase();

				if (data_type.indexOf("<?XML") == 0) data_type = "XML";
				if (data_type.indexOf("SSV") == 0) data_type = "SSV";
				if (data_type.indexOf("{") == 0) data_type = "JSON";
			}

			if (nexacro._Deserializer[data_type])
			{
				result = nexacro._Deserializer[data_type](data);
			}
		}

		this.on_load(result, request_url, request_index);
	};

	_pFileUpTransfer.on_load_android_webview = function (objData)
	{
		if (objData.status < 0)
		{
			this.on_error(9901, "", objData.httpcode, objData._p_url);
		}
		else if (objData.status == 4)
		{
			this.on_progress(objData.loaded, objData.total);
		}
		else
		{
			var data = objData.data.trimLeft();
			if (data)
			{
				var data_type = data.slice(0, 5).toUpperCase();

				if (data_type.indexOf("<?XML") == 0) data_type = "XML";
				if (data_type.indexOf("SSV") == 0) data_type = "SSV";
				if (data_type.indexOf("{") == 0) data_type = "JSON";

				if (data_type == "XML")
				{
					data = nexacro._parseXMLDocument(data);
				}

				if (nexacro._Deserializer[data_type])
				{
					data = nexacro._Deserializer[data_type](data);
				}

				this.on_load(data, objData._p_url);
			}
		}
	};

	_pFileUpTransfer.on_error = function (errorcode, errormsg, httpcode, url, index)
	{
		// Component에러가 있으면 Env error 내보내지 않음.
		this.on_fire_onerror("ObjectError", errormsg, this, httpcode || errorcode, url, url, index);
	};

	_pFileUpTransfer.on_progress = function (loaded, total, index)
	{
		this.on_fire_onprogress(loaded, total, index);
	};

	_pFileUpTransfer.on_fire_onsuccess = function (datasets, code, msg, url, index)
	{
		if (this.onsuccess && this.onsuccess._has_handlers)
		{
			var evt = new nexacro.FileUpTransferEventInfo(this, "onsuccess", datasets, code, msg, url, index);
			this.onsuccess._fireEvent(this, evt);
		}
	};

	_pFileUpTransfer.on_fire_onerror = function (errortype, errormsg, errorobj, statuscode, requesturi, locationuri, index)
	{
		if (this.onerror && this.onerror._has_handlers)
		{
			var evt = new nexacro.FileUpTransferErrorEventInfo(this, "onerror", errortype, errormsg, errorobj, statuscode, requesturi, locationuri, index);
			this.onerror._fireEvent(this, evt);
		}
	};

	_pFileUpTransfer.on_fire_onprogress = function (loaded, total, index)
	{
		if (this.onprogress && this.onprogress._has_handlers)
		{
			var evt = new nexacro.FileUpTransferProgressEventInfo(this, "onprogress", loaded, total, index);
			return this.onprogress._fireEvent(this, evt);
		}
		return true;
	};

	//===============================================================
	// nexacro._pFileUpTransfer : Logical Part
	//===============================================================

	//===============================================================
	// nexacro._pFileUpTransfer : Util Function
	//===============================================================
	_pFileUpTransfer._getForm = function ()
	{
		if (this.parent instanceof nexacro.Form)
		{
			return this.parent;
		}
		return null;
	};

	_pFileUpTransfer._getTransferType = function ()
	{
		return this._TransferType[this.type.toUpperCase()] || 0;
	};

	_pFileUpTransfer = null;
	//delete _pFileUpTransfer;
}
