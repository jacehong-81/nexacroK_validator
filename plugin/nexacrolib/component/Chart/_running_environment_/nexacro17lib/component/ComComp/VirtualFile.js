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

if (!nexacro.VirtualFile)
{
	//==============================================================================
	// nexacro.Event.VirtualFileEventInfo
	// 가상파일에 요청된 작업이 성공했을 때 발생되는 이벤트에서 사용되는 EventInfo Object
	//==============================================================================
	nexacro.VirtualFileEventInfo = function (strEventId, nReason, strTextdata, strBinarydata, strFilelist, strFilesize, strExist)
	{
		this.eventid = strEventId;												// 이벤트ID
		this.reason = nReason;												    // 이벤트 발생분류 코드
		this.textdata = strTextdata;											// 읽어들인 텍스트 데이터
		this.binarydata = strBinarydata;										// 읽어들인 바이너리 데이터
		this.fileattributelist = nexacro._getFileAttributeList(strFilelist);	// 지정된 결로의 파일목록
		this.filesize = strFilesize;											// 오픈한 파일의 크기 또는 없으면 setterfullpath 값의 사이즈 
		this.fileisexist = strExist;
	};
	var _pVirtualFileEventInfo = nexacro.VirtualFileEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.VirtualFileEventInfo);
	_pVirtualFileEventInfo._type_name = "VirtualFileEventInfo";

	delete _pVirtualFileEventInfo;

	//==============================================================================
	// nexacro.VirtualFileErrorEventInfo
	// 가상파일에 요청된 작업이 실패했을 때 발생되는 이벤트에서 사용되는 EventInfo Object
	//==============================================================================
	nexacro.VirtualFileErrorEventInfo = function (strEventId, intErrorCode, strErrorMsg)
	{
		this.id = this.eventid = strEventId;									// 이벤트ID            
		this.errortype = "ObjectError";
		this.statuscode = intErrorCode;											// 오류코드 : integer 로 된 errorcode 
		this.errormsg = strErrorMsg;											// 오류메세지 : string으로 된 errormsg 
	};

	var _pVirtualFileErrorEventInfo = nexacro.VirtualFileErrorEventInfo.prototype = nexacro._createPrototype(nexacro.Event, nexacro.VirtualFileErrorEventInfo);
	_pVirtualFileErrorEventInfo._type_name = "VirtualFileErrorEventInfo";

	delete _pVirtualFileErrorEventInfo;

	//==============================================================================
	// nexacro.FileAttribute
	// 파일을 읽거나 쓰기위해 사용되는 가상파일 Object
	//==============================================================================
	nexacro._FileAttribute = function (jsonObj)
	{
		this.accesstime = jsonObj.accesstime;										// 파일 또는 디렉토리의 마지막 엑세스 시간을 반환합니다.
		this.createtime = jsonObj.createtime;										// 파일 또는 디렉토리의 생성 시간을 반환합니다.
		this.filename = jsonObj.filename;											// 파일 또는 디렉토리의 이름을 반환합니다.
		this.groupid = jsonObj.groupid;												// 파일 또는 디렉토리의 소유자 그룹정보를 문자열로 반환합니다.
		this.modifytime = jsonObj.modifytime;										// 파일 또는 디렉토리의 마지막으로 수정된 시간을 반환합니다.
		this.size = jsonObj.size;													// 파일 크기를 byte 단위로 반환합니다.
		this.userid = jsonObj.userid;												// 파일 또는 디렉토리의 소유자 ID를 문자열로 반환합니다.
		this.isdirectory = jsonObj.isdirectory;										// 디렉토리인지 여부를 반환합니다.
		this.isreadonly = jsonObj.isreadonly;										// 파일 또는 디렉토리가 읽기전용인지 여부를 반환합니다.
	};
	var _pFileAttribute = nexacro._FileAttribute.prototype = nexacro._createPrototype(nexacro.Object, nexacro._FileAttribute);

	_pFileAttribute._type_name = "_FileAttribute";

	_pFileAttribute.isDirectory = function ()
	{
		return this.isdirectory;
	};

	_pFileAttribute.isHidden = function ()
	{
		// TODO
	};

	_pFileAttribute.isLink = function ()
	{
		// TODO
	};

	_pFileAttribute.isReadOnly = function ()
	{
		return this.isreadonly;
	};

	delete _pFileAttribute;

	//==============================================================================
	// nexacro.VirtualFile
	//==============================================================================
	nexacro.VirtualFile = function (id, parent)
	{
		this.id = this.name = id;
		this.parent = parent;

		if (arguments.length == 3)
		{
			this._handle = nexacro._createVirtualFileHandle(this, arguments[2]);
		}
		else
		{
			this._handle = nexacro._createVirtualFileHandle(this);
		}
	};

	var _pVirtualFile = nexacro.VirtualFile.prototype = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.VirtualFile);
	_pVirtualFile._type_name = "VirtualFile";

	/* default properties */
	_pVirtualFile.filename = "";
	_pVirtualFile.fullpath = "";
	_pVirtualFile.path = "";
	_pVirtualFile.async = "true";

	/* internal variable */
	_pVirtualFile._file = null;

	/* event list */
	_pVirtualFile._event_list = {
		"onsuccess": 1, "onerror": 1
	};

	/* VirtualFile Constant */
	//- Open Option Flags
	nexacro.VirtualFile.openRead = 0x0001;
	nexacro.VirtualFile.openWrite = 0x0002;
	nexacro.VirtualFile.openAppend = 0x0010;
	nexacro.VirtualFile.openCreate = 0x1000;
	nexacro.VirtualFile.openText = 0x0100;
	nexacro.VirtualFile.openBinary = 0x0200;

	//- Seek Option Flags
	nexacro.VirtualFile.seekBegin = 0x0000;
	nexacro.VirtualFile.seekCurrent = 0x0001;
	nexacro.VirtualFile.seekEnd = 0x0002;

	//- Find File Options Flags
	nexacro.VirtualFile.findAll = 0x0001;
	nexacro.VirtualFile.findFileOnly = 0x0002;
	nexacro.VirtualFile.findDirectoryOnly = 0x0003;
	nexacro.VirtualFile.findCaseless = 0x0010;

	//===============================================================
	// nexacro.VirtualFile : Create & Destroy & Update
	//===============================================================
	_pVirtualFile.on_created = nexacro._emptyFn;

	_pVirtualFile.destroy = function ()
	{
		nexacro._destroyVirtualFileHandle(this);
		if (this._handle)
		{
			this._handle = null;
		}

		return true;
	};

	//===============================================================
	// nexacro.VirtualFile : Properties
	//===============================================================
	_pVirtualFile.set_filename = nexacro._emptyFn;
	_pVirtualFile.set_fullpath = nexacro._emptyFn;
	_pVirtualFile.set_path = nexacro._emptyFn;

	_pVirtualFile.set_async = function (v)
	{
		v = nexacro._toBoolean(v);
		if (this.async != v)
		{
			this.async = v;
			this.on_apply_async();
		}
	};

	_pVirtualFile.on_apply_async = function ()
	{
		nexacro._setVirtualFileHandleAsync(this, this.async);
	};

	//===============================================================
	// nexacro.VirtualFile : Methods
	//===============================================================
	_pVirtualFile.open = function (strFileName, nConstOptions)
	{
		// 매개변수 생략은 허용 안함.
		if (arguments.length < 2)
			return false;

		if (!strFileName)
		{
			// 내부적으로 제공하는 VirtualFile은 fullpath, path, filename이 설정되어있다. (HTML은 filenname만 제공)
			if (this.fullpath || this.path || this.filename)
			{
				return nexacro._openVirtualFileHandle(this, this.fullpath, nConstOptions);
			}
		}
		else
		{
			var strFullPath = strFileName.split("\\").join("/");

			this._setFullPath(strFullPath);
			this._setPath(this._getPath(strFullPath));
			this._setFileName(this._getFileName(strFullPath));

			return nexacro._openVirtualFileHandle(this, strFileName, nConstOptions);
		}

		return false;
	};

	_pVirtualFile.close = function ()
	{
		nexacro._closeVirtualFileHandle(this);
	};

	_pVirtualFile.read = function (nLength, strCharset)
	{
		nLength = nLength || -1;
		strCharset = strCharset || "utf-8";

		return nexacro._readVirtualFileHandle(this, nLength, strCharset);
	};

	_pVirtualFile.readLine = function (strDelimeter, strCharset)
	{
		strDelimeter = strDelimeter || "\n";
		strCharset = strCharset || "utf-8";

		return nexacro._readlineVirtualFileHandle(this, strDelimeter, strCharset);
	};

	_pVirtualFile.seek = function (nOffset, nConstOptions)
	{
		if (isNaN(nOffset = +nOffset))
			return false;

		if (arguments.length == 1)
			nConstOptions = nexacro.VirtualFile.seekCurrent;

		// 생략 가능한 매개변수여서 after 체크
		if (isNaN(nConstOptions = +nConstOptions))
			return false;

		return nexacro._seekVirtualFileHandle(this, nOffset, nConstOptions);
	};

	_pVirtualFile.write = function (varData, strCharset)
	{
		var _varData = varData;		// 필수
		var _strCharset = "utf-8";	// 옵션

		if (typeof (_varData) == "undefined" || _varData.length == 0)
		{
			return false;
		}
		if (arguments.length == 2)
		{
			_strCharset = strCharset;
		}

		return nexacro._writeVirtualFileHandle(this, _varData, _strCharset);
	};

	_pVirtualFile.remove = function (strFilePath)
	{
		if (!strFilePath)
			return false;

		if (strFilePath instanceof nexacro.VirtualFile)
			strFilePath = strFilePath.fullpath;

		return nexacro._removeVirtualFileHandle(this, strFilePath);
	};

	_pVirtualFile.copy = function (strSrc, strDest)
	{
		if (!strSrc || !strDest)
			return false;

		return nexacro._copyVirtualFileHandle(this, strSrc, strDest);
	};

	_pVirtualFile.rename = function (strOldname, strNewname)
	{
		if (!strOldname || !strNewname)
			return false;

		return nexacro._renameVirtualFileHandle(this, strOldname, strNewname);
	};

	_pVirtualFile.getFileList = function (strPath, strSearchExpr, nConstOptions)
	{
		if (!strPath || !strSearchExpr || !nConstOptions || isNaN(nConstOptions = +nConstOptions))
			return false;

		if (arguments.length <= 2)
			nConstOptions = nexacro.VirtualFile.findAll;

		return nexacro._getFileListVirtualFileHandle(this, strPath, strSearchExpr, nConstOptions);
	};

	_pVirtualFile.getFileSize = function ()
	{
		return nexacro._getFileSizeVirtualFileHandle(this, this.fullpath);
	};

	_pVirtualFile.isExist = function (strPath)
	{
		if (!strPath)
			return false;

		return nexacro._isExistVirtualFileHandle(this, strPath);
	};

	_pVirtualFile.createDirectory = function (strPath, bAllCreate)
	{
		if (!strPath)
			return false;

		if (arguments.length == 1)
		{
			bAllCreate = false;
		}
		else if (arguments.length == 2)
		{
			bAllCreate = nexacro._toBoolean(bAllCreate);
		}

		return nexacro._createDirectoryVirtualFileHandle(this, strPath, bAllCreate);
	};

	_pVirtualFile.deleteDirectory = function (strPath, bAllChild)
	{
		if (!strPath)
			return false;

		if (arguments.length == 1)
		{
			bAllChild = false;
		}
		else if (arguments.length == 2)
		{
			bAllChild = nexacro._toBoolean(bAllChild);
		}

		return nexacro._deleteDirectoryVirtualFileHandle(this, strPath, bAllChild);
	};

	_pVirtualFile.renameDirectory = function (strPath, strNewName)
	{
		if (!strPath || !strNewName)
			return false;

		if (strNewName.match(/[\"\/:*?<>|]/))
		{
			return false;
		}

		return nexacro._renameDirectoryVirtualFileHandle(this, strPath, strNewName);
	};

	//===============================================================
	// nexacro.VirtualFile : Event Handlers
	//===============================================================
	_pVirtualFile.on_success = function (reason, textdata, bindata, fileattributelist, filesize, fileisexist)
	{
		textdata = this._replaceEntity(textdata, ["&amp;", "&lt;", "&gt;", "&quot;", "&apos;", "&#32;", "&#13;", "&#10;", "&#9;"]) || "";
		bindata = this._replaceEntity(bindata, ["&amp;", "&lt;", "&gt;", "&quot;", "&apos;", "&#32;", "&#13;", "&#10;", "&#9;"]) || "";

		return this.on_fire_onsuccess(reason, textdata, bindata, fileattributelist, filesize, fileisexist);
	};

	_pVirtualFile._onsuccess = function (objData)  //iOS
	{
		var textdata = this._replaceEntity(objData.textdata, ["&amp;", "&lt;", "&gt;", "&quot;", "&apos;", "&#32;", "&#13;", "&#10;", "&#9;"]) || "";
		var bindata = this._replaceEntity(objData.binarydata, ["&amp;", "&lt;", "&gt;", "&quot;", "&apos;", "&#32;", "&#13;", "&#10;", "&#9;"]) || "";

		this.on_fire_onsuccess(objData.reason, textdata, bindata, objData.fileattributelist, objData.filesize, objData.fileisexist);
	};

	_pVirtualFile.on_fire_onsuccess = function (reason, textdata, bindata, fileattributelist, filesize, fileisexist)
	{
		if (this.onsuccess && this.onsuccess._has_handlers)
		{
			var evt = new nexacro.VirtualFileEventInfo("onsuccess", reason, textdata, bindata, fileattributelist, filesize, fileisexist)
			this.onsuccess._fireEvent(this, evt);
		}
		return true;
	};

	_pVirtualFile.on_error = function (errorcode, errormsg)
	{
		this.on_fire_onerror(errorcode, errormsg);
	};

	_pVirtualFile._onerror = function (objData)
	{
		this.on_fire_onerror(objData.errorcode, objData.errormsg);
	};

	_pVirtualFile.on_fire_onerror = function (errorcode, errormsg)
	{
		if (this.onerror && this.onerror._has_handlers)
		{
			var evt = new nexacro.VirtualFileErrorEventInfo("onerror", errorcode, errormsg);
			this.onerror._fireEvent(this, evt);
		}
		return true;
	};

	//===============================================================
	// nexacro.VirtualFile : Logical Part
	//===============================================================
	_pVirtualFile._createVirtualFileHandle = function (target)
	{
		this._handle = nexacro._createVirtualFileHandle(target);
	};

	//===============================================================
	// nexacro.VirtualFile : Util Function
	//===============================================================
	_pVirtualFile._setPath = function (v)
	{
		this.path = v;
	};

	_pVirtualFile._setFullPath = function (v)
	{
		this.fullpath = v;
	};

	_pVirtualFile._setFileName = function (v)
	{
		this.filename = v;
	};

	_pVirtualFile._getPath = function (strFullpath)
	{
		if (!strFullpath)
			return strFullpath;

		strFullpath = strFullpath.split("\\").join("/");

		var path_idx = strFullpath.lastIndexOf("/");
		if (path_idx == -1)
			path_idx = strFullpath.lastIndexOf("%");

		return strFullpath.substring(0, path_idx + 1);
	};

	_pVirtualFile._getFileName = function (strFullpath)
	{
		if (!strFullpath)
			return strFullpath;

		strFullpath = strFullpath.split("\\").join("/");

		var name_idx = strFullpath.lastIndexOf("/");
		if (name_idx == -1)
			name_idx = strFullpath.lastIndexOf("%");

		return strFullpath.substring(name_idx + 1, strFullpath.length);
	};

	_pVirtualFile._replaceEntity = function (strText, entitylist)
	{
		if (!strText)
			return strText;

		var _map = { "\&amp\;": "\&", "\&lt\;": "\<", "\&gt\;": "\>", "\&quot\;": "\"", "\&apos\;": "\'", "\&\#32\;": "\ ", "\&\#13\;": "\\r", "\&\#10\;": "\\n", "\&\#9\;": "\\t" };

		if (entitylist.length)
		{
			var entity = entitylist.pop();
			return this._replaceEntity(strText.replace(new RegExp(entity, "g"), _map[entity]), entitylist);
		}

		return strText;
	}

	delete _pVirtualFile;
}