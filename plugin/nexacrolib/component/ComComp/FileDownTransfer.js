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
if (!nexacro.FileDownTransfer)
{
	//==============================================================================
	// nexacro.FileDownTransferEventInfo
	//==============================================================================
	nexacro.FileDownTransferEventInfo = function (obj, id, url, fullpath)
	{
		this.id = this.eventid = id || "onsuccess";
		this.fromobject = this.fromreferenceobject = obj;

		this.url = url;
		this.targetfullpath = fullpath;
	};

	var _pFileDownTransferEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.FileDownTransferEventInfo);
	nexacro.FileDownTransferEventInfo.prototype = _pFileDownTransferEventInfo;
	_pFileDownTransferEventInfo._type_name = "FileDownTransferEventInfo";

	_pFileDownTransferEventInfo = null;
	//delete _pFileDownTransferEventInfo;

	//==============================================================================
	// nexacro.FileDownTransferErrorEventInfo
	//==============================================================================
	nexacro.FileDownTransferErrorEventInfo = function (obj, id, errortype, errormsg, errorobj, statuscode, requesturi, locationuri)
	{
		nexacro.ErrorEventInfo.call(this, obj, id, errortype, errormsg, errorobj, statuscode, requesturi, locationuri);
	};

	var _pFileDownTransferErrorEventInfo = nexacro._createPrototype(nexacro.ErrorEventInfo, nexacro.FileDownTransferErrorEventInfo);
	nexacro.FileDownTransferErrorEventInfo.prototype = _pFileDownTransferErrorEventInfo;
	_pFileDownTransferErrorEventInfo._type_name = "FileDownTransferErrorEventInfo";

	_pFileDownTransferErrorEventInfo = null;
	//delete _pFileDownTransferErrorEventInfo;

	//==============================================================================
	// nexacro.FileDownTransfer
	//==============================================================================
	nexacro.FileDownTransfer = function (id, parent)
	{
		nexacro._EventSinkObject.call(this, id, parent);

		this._p_postdatalist = new nexacro.Collection();

		if (nexacro._OS == "Android" && nexacro._isHybrid && nexacro._isHybrid() || nexacro._macOSWebView)
		{
			this._id = nexacro.Device.makeID();
			nexacro.Device._userCreatedObj[this._id] = this;

			var json = {
				id: this._id,
				div: "FileDownTransfer",
				method: "constructor",
				params: ""
			};

			var jsonstr = JSON.stringify(json);
			nexacro.Device.exec(jsonstr);
		}
	};
	var _pFileDownTransfer = nexacro.FileDownTransfer.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.FileDownTransfer);
	_pFileDownTransfer._type_name = "FileDownTransfer";

	/* default properties */
	_pFileDownTransfer._p_url = "";
	_pFileDownTransfer._p_downloadfilename = "";

	/* internal variable */

	/* event list */
	_pFileDownTransfer._event_list = {
		"onsuccess": 1, "onerror": 1
	};

	//===============================================================
	// nexacro.FileDownTransfer : Create & Destroy & Update
	//===============================================================
	_pFileDownTransfer.destroy = function ()
	{
		this._p_postdatalist = null;

		if (nexacro._OS == "Android" && nexacro._isHybrid && nexacro._isHybrid() || nexacro._macOSWebView)
		{
			delete nexacro.Device._userCreatedObj[this._id];

			var json = {
				id: this._id,
				div: "FileDownTransfer",
				method: "destroy",
				params: ""
			};

			var jsonstr = JSON.stringify(json);
			nexacro.Device.exec(jsonstr);
		}

		return true;
	};

	//===============================================================
	// nexacro.FileDownTransfer : Properties
	//===============================================================
	_pFileDownTransfer.set_postdatalist = nexacro._emptyFn;
	_pFileDownTransfer.set_url = function (v)
	{
		if (this._p_url != v)
		{
			this._p_url = v;
		}
	};
	_pFileDownTransfer.set_downloadfilename = function (v)
	{
		if (this._p_downloadfilename != v)
		{
			this._p_downloadfilename = v;
		}
	};

	_pFileDownTransfer._properties = [{ name: "downloadfilename" }, { name: "id", readonly: true }, { name: "name" }, { name: "postdatalist", readonly: true }, { name: "url" }];

	nexacro._defineProperties(_pFileDownTransfer, _pFileDownTransfer._properties);

	//===============================================================
	// nexacro.FileDownTransfer : Methods
	//===============================================================
	_pFileDownTransfer.setPostData = function (strKey, value)
	{
		if (!strKey)
			return;

		this._p_postdatalist.setItem(strKey, value);
	};

	_pFileDownTransfer.removePostData = function (strKey)
	{
		this._p_postdatalist.delete_item(strKey);
	};

	_pFileDownTransfer.getPostData = function (strKey)
	{
		return this._p_postdatalist.getItem(strKey);
	};

	_pFileDownTransfer.clearPostDataList = function ()
	{
		this._p_postdatalist.clear();
	};

	_pFileDownTransfer.download = function (strUrl, strTargetPath)
	{
		strUrl = strUrl ? nexacro._getImageLocation(strUrl) : (this._p_url ? nexacro._getServiceLocation(this._p_url, null, null, false) : "");
		strTargetPath = nexacro._toString(strTargetPath);

		if (!strUrl)
			return;

		var postdatalist = {};
		for (var i = 0, len = this._p_postdatalist.length; i < len; i++)
		{
			postdatalist[this._p_postdatalist._idArray[i]] = this._p_postdatalist[i];
		}

		nexacro._downloadTransfer(postdatalist, strUrl, strTargetPath, this);
	};

	//===============================================================
	// nexacro.FileDownTransfer : Event Handlers
	//===============================================================
	_pFileDownTransfer._on_load_android = function (objData)
	{
		this.on_load(objData.status, objData.fullpath, objData.url, "", objData.httpcode, objData.errmsg, "");
	};

	_pFileDownTransfer.on_load = function (status, data, url, errcode, httpcode, errmsg, extramsg)
	{
		if (data)
		{
			if (!nexacro._isArray(data))
			{
				if (status < 0)
				{
					return this.on_fire_onerror("ObjectError", errmsg, this, httpcode, url, url);
				}
				else
				{
					return this.on_fire_onsuccess(url, data);
				}
			}
			else
			{
				// TODO : XML response 처리용.
			}
		}

		return this.on_fire_onerror("ObjectError", "fail to get", this, 9901, url, url);
	};

	_pFileDownTransfer.on_error = function (url, errorcode, httpcode, errormsg)
	{
		this.on_fire_onerror("ObjectError", errormsg, this, httpcode, url, url);
	};

	_pFileDownTransfer.on_fire_onsuccess = function (url, fullpath)
	{
		if (this.onsuccess && this.onsuccess._has_handlers)
		{
			var evt = new nexacro.FileDownTransferEventInfo(this, "onsuccess", url, fullpath);
			this.onsuccess._fireEvent(this, evt);
		}
	};

	_pFileDownTransfer.on_fire_onerror = function (errortype, errormsg, errorobj, statuscode, requesturi, locationuri)
	{
		if (this.onerror && this.onerror._has_handlers)
		{
			var evt = new nexacro.FileDownTransferErrorEventInfo(this, "onerror", errortype, errormsg, errorobj, statuscode, requesturi, locationuri);
			return this.onerror._fireEvent(this, evt);
		}
		return true;
	};

	//===============================================================
	// nexacro.FileDownTransfer : Logical Part
	//===============================================================

	//===============================================================
	// nexacro.FileDownTransfer : Util Function
	//===============================================================
	_pFileDownTransfer._getForm = function ()
	{
		if (this.parent instanceof nexacro.Form)
		{
			return this.parent;
		}
		return null;
	};

	_pFileDownTransfer = null;

	//delete _pFileDownTransfer;
}
