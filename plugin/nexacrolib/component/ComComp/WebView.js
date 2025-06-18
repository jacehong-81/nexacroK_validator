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

// ==============================================================================
// nexacro.WebView
// ==============================================================================
if (!nexacro.WebView)
{
	if (!nexacro.WebLoadCompEventInfo)  
	{
		nexacro.WebLoadCompEventInfo = function (obj, url, id)
		{
			this.id = this.eventid = id || "onloadcompleted";
			this.fromobject = this.fromreferenceobject = obj; // this property is not exist to menual
			this.url = url;
		};
		var _pWebLoadCompEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.WebLoadCompEventInfo);
		nexacro.WebLoadCompEventInfo.prototype = _pWebLoadCompEventInfo;
		_pWebLoadCompEventInfo._type_name = "WebLoadCompEventInfo";

		_pWebLoadCompEventInfo = null;
	}

	// TO DO : // this EventInfo is not exist to menual
	if (!nexacro.WebUserNotifyEventInfo)
	{
		nexacro.WebUserNotifyEventInfo = function (obj, userdata, id)
		{
			this.id = this.eventid = id || "onusernotify";
			this.fromobject = this.fromreferenceobject = obj; // this property is not exist to menual

			this.userdata = userdata;
		};
		var _pWebUserNotifyEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.WebUserNotifyEventInfo);
		nexacro.WebUserNotifyEventInfo.prototype = _pWebUserNotifyEventInfo;
		_pWebUserNotifyEventInfo._type_name = "WebUserNotifyEventInfo";

		_pWebUserNotifyEventInfo = null;
	}




	nexacro.WebView = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
	};

	// TODO expr, usedecorate

	var _pWebView = nexacro._createPrototype(nexacro.Component, nexacro.WebView);
	nexacro.WebView.prototype = _pWebView;

	_pWebView._type_name = "WebView";
	_pWebView._ifrm_elem = null;

	_pWebView.window = null;
	_pWebView.document = null;

	_pWebView._p_url = "";
	_pWebView._p_setupurl = "";
	_pWebView._p_useurlhistory = true;
	_pWebView._p_sandbox = "";

	_pWebView._url = "";
	_pWebView._setupUrl = "";

	_pWebView._current_url = "";
	_pWebView._p_accessibilityrole = "webview";
	_pWebView._p_accessibilityleavemessage = "";
	_pWebView._scriptcallbacklist = [];
	_pWebView._event_list = {
		"onclick": 1, "ondblclick": 1, "onkeypress": 1, "onkeydown": 1, "onkeyup": 1, "onkillfocus": 1, "onsetfocus": 1,
		"ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1, "onlbuttondown": 1, "onlbuttonup": 1,
		"onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmove": 1, "onsize": 1, "onrbuttondown": 1, "onrbuttonup": 1,
		"oncontextmenu": 1,
		//added event
		"onloadcompleted": 1, "onusernotify": 1, "ondevicebuttonup": 1
	};

	_pWebView.on_create_contents = function ()
	{
		var control_elem = this.getElement();
		if (control_elem)
		{
			this._ifrm_elem = new nexacro._WebViewPluginElement(control_elem);
			this._ifrm_elem.setElementSize(this._getClientWidth(), this._getClientHeight());
		}
	};
	_pWebView.on_create_contents_command = function ()
	{
		return "";

	};
	_pWebView.on_attach_contents_handle = function (win)
	{
		this.on_created_contents(win);
		return;

	};
	_pWebView.on_created_contents = function (win)
	{
		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem)
		{
			ifrm_elem.component = this;

			ifrm_elem.create(win);
			ifrm_elem.initEvent();
			this.document = ifrm_elem._document;
			this.window = ifrm_elem._winodw;

			nexacro._observeSysEvent(ifrm_elem.handle, "mouseover", "onmouseover", this._webview_mouseover);
		}
		if (this._url === "")
		{
			this._url = "about:blank";
		}
		this.on_apply_url();
		this.on_apply_setupurl();
		this.on_apply_sandbox();
		this._on_apply_accessibilityleavemessage();
	};
	_pWebView.on_destroy_contents = function ()
	{
		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem)
		{
			nexacro._stopSysObserving(ifrm_elem.handle, "mouseover", "onmouseover", this._webview_mouseover);

			this.window = null;
			this.document = null;
			ifrm_elem.destroy();
			this._ifrm_elem = null;
		}
	};
	_pWebView.on_update_position = function (resize_flag, move_flag, update)
	{
		nexacro.Component.prototype.on_update_position.call(this, resize_flag, move_flag, update);
		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem)
		{
			ifrm_elem.on_update_position();
		}
	};

	_pWebView.on_change_containerRect = function (width, height)
	{
		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem)
		{
			ifrm_elem.setElementSize(width, height);
		}
	};

	_pWebView.on_fire_onloadcompleted = function (obj, url)
	{
		if (this.onloadcompleted && this.onloadcompleted._has_handlers)
		{
			var evt = new nexacro.WebLoadCompEventInfo(obj, url);
			evt.eventid = "onloadcompleted";
			return this.onloadcompleted._fireEvent(this, evt);
		}
		return true;
	};
	_pWebView.fireUserNotify = function (msg)
	{
		if (msg.target)
			msg.target.on_fire_onusernotify(msg.target, msg.data);

	}
	_pWebView.on_fire_onusernotify = function (obj, userdata)
	{
		if (this.onusernotify && this.onusernotify._has_handlers)
		{
			var evt = new nexacro.WebUserNotifyEventInfo(obj, userdata);
			evt.eventid = "onusernotify";
			return this.onusernotify._fireEvent(this, evt);
		}
		return true;
	};

	_pWebView.on_ondevicebuttonup_default_action = function (button)
	{
		if (button == 2) // 2:CANCEL(BACK)
		{
			this.goBack();
		}
	}



	_pWebView._getDlgCode = function (keycode/*, altKey, ctrlKey, shiftKey*/)
	{
		var _ifrm_elem = this._ifrm_elem;
		if (_ifrm_elem)
		{
			if ((!_ifrm_elem._prev_outfocus_message_elem || (_ifrm_elem._prev_outfocus_message_elem._killfocus_flag == true && keycode == nexacro.Event.KEY_UP)) ||
				(!_ifrm_elem._next_outfocus_message_elem || (_ifrm_elem._next_outfocus_message_elem._killfocus_flag == true && keycode == nexacro.Event.KEY_DOWN))
			)
				this._want_arrow = false;
			else
				this._want_arrow = true;
		}
		return { want_tab: true, want_return: true, want_escape: false, want_chars: false, want_arrows: this._want_arrow };
	};

	_pWebView.on_fire_user_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp)
	{
		var E = nexacro.Event;
		if (keycode == E.KEY_TAB) // KEY_TAB
		{
			this._getWindow()._keydown_element._event_stop = false;
			if (nexacro._Browser == "Runtime")
			{
				var root_comp = this._getRootComponent(this);
				var next_comp = this._getForm().getNextComponent(root_comp, true);
				if (next_comp)
				{
					next_comp.setFocus();
				}
			}
		}
		else if (this._env._p_enableaccessibility)
		{
			var ifrm_elem = this._ifrm_elem;
			if (ifrm_elem)
			{
				ifrm_elem._setElementInternalFocus(keycode);
			}

		}
		return nexacro.Component.prototype.on_fire_user_onkeydown.call(this, keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp);
	};

	_pWebView._apply_setfocus = function (evt_name)
	{
		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem)
		{
			ifrm_elem._setElementFocus();
		}
	};

	_pWebView._webview_mouseover = function (/*evt*/)
	{
		if (this._linked_element && !this._linked_element._document)  //permissions problems, crossdomain etc.
		{
			nexacro._initDragInfo()
			nexacro._cur_track_info = null;
		}
	};

	// property
	_pWebView.set_text = function (v)
	{
		v = nexacro._toString(v);

		if (v && v != this._p_text)
		{
			this._p_text = v;
			this._displaytext = v.replace(/ /g, "\u00a0");
			this.on_apply_text(v);
		}
	};

	_pWebView.set_enable = function (v)
	{
		v = nexacro._toBoolean(v);
		if (this._p_enable != v)
		{
			this._p_enable = v;

			if (this._is_created)
			{
				var enable_flag = (this._p_parent._real_enable && v);
				if (this._real_enable != enable_flag)
				{
					this._real_enable = enable_flag;
					this._changeStatus("disabled", !enable_flag);
					this.on_apply_prop_enable(this._real_enable);
				}
			}
		}
	};

	_pWebView.callMethod = function (/*func*/)
	{
		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem)
		{
			return nexacro._WebViewPluginElement.prototype.callMethod.apply(ifrm_elem, arguments);
		}
	};


	_pWebView.set_visible = function (v)
	{
		if (v === undefined || v === null) return;

		v = nexacro._toBoolean(v);

		nexacro.Component.prototype.set_visible.call(this, v);

		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem)
		{
			ifrm_elem.setElementVisible(v);
		}
	};

	_pWebView.set_cookiesynctype = function (/*v*/)
	{
		//  TO DO : check need
	};

	_pWebView.set_url = function (v)
	{
		if (v == undefined)
		{
			return;
		}

		var val = v.toString();

		if (val != "about:blank" && val.match(/http:\/\/|file:\/\/|https:\/\//gi) == null)
		{
			val = "http://" + val;
		}

		this._url = val;
		this._p_url = v;

		this.on_apply_url();
	};

	_pWebView.set_setupurl = function (v)
	{
		if (v == undefined)
		{
			return;
		}

		var val = v.toString();

		if (val != "about:blank" && val.match(/http:\/\/|file:\/\/|https:\/\//gi) == null)
		{
			val = "http://" + val;
		}

		this._setupurl = val;
		this._p_setupurl = v;

		this.on_apply_setupurl();
	};

	_pWebView.set_useurlhistory = function (v)
	{
		this._p_useurlhistory = nexacro._toBoolean(v);
	};

	_pWebView.set_sandbox = function(v)
	{
		this._p_sandbox = nexacro._toString(v).replace(/,/g, " "); //Tool에서 입력받는 경우 콤마로 구분되어 들어옴.
		this.on_apply_sandbox();
	};

	_pWebView.get_sandbox = function(v)
	{
		const ifrm_elem = this._ifrm_elem;
		if (!ifrm_elem) 
		{
			return this._p_sandbox;
		}
		const sandboxValue = ifrm_elem.handle.getAttribute('sandbox');
		return sandboxValue || ""; 
	};

	_pWebView.set_accessibilityleavemessage = function (v)
	{
		this._p_accessibilityleavemessage = v;
		this._on_apply_accessibilityleavemessage();
	};

	_pWebView.on_apply_url = function ()
	{
		if (this._url === "http://" || this._url === "file://" || this._url === "https://" || this._url === "")
		{
			return;
		}

		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem)
		{
			ifrm_elem._setUrl(this._url, this._p_useurlhistory);
		}
	};

	_pWebView.on_apply_setupurl = function ()
	{
		if (this._setupurl === "http://" || this._setupurl === "file://" || this._setupurl === "https://" || this._setupurl === "")
		{
			return;
		}

		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem)
		{

			ifrm_elem._setInstallUrl(this._setupurl);
		}
	};

	_pWebView.on_apply_sandbox = function () 
	{
		var env = nexacro.getEnvironment();
		if (!env) return;

		const envsandboxlist = env._p_webviewallowedsandbox.split(" ");
		const webviewsandboxlist = this._p_sandbox.split(" ");
		const possiblelist = webviewsandboxlist.filter(element => envsandboxlist.includes(element));

		const ifrm_elem = this._ifrm_elem;
		if (ifrm_elem) 
		{
			const value = possiblelist.length > 0 ? possiblelist.join(' ') : "";
			ifrm_elem.handle.setAttribute('sandbox', value);
		}
	};

	_pWebView.on_apply_accessibility = function ()
	{
		nexacro.Component.prototype.on_apply_accessibility.call(this);
		this._on_apply_accessibilityleavemessage();
	};

	_pWebView.on_apply_prop_enable = function (v)
	{
		nexacro.Component.prototype.on_apply_prop_enable.call(this, v);

		if (this._ifrm_elem)
		{
			this._ifrm_elem.setElementEnable(v);
		}
	};

	_pWebView._properties = [{ name: "text" }, { name: "enable" }, { name: "visible" }, { name: "cookiesynctype" }, { name: "url" }, { name: "setupurl" }, { name: "useurlhistory" }, { name: "accessibilityleavemessage" },
							 { name: "sandbox", getter: _pWebView.get_sandbox}];
	nexacro._defineProperties(_pWebView, _pWebView._properties);

	_pWebView.reload = function ()
	{
		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem)
		{
			if (this._isCrossDomain(this._current_url)) // 2014-06-26 pss [REQ_36583] - for crossdomain check
			{
				var tmp_url = this._url;
				ifrm_elem._setUrl("");
				ifrm_elem._setUrl(tmp_url);
			}
			else
			{
				ifrm_elem._setGo();
			}
		}
	};

	_pWebView.goBack = function ()
	{
		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem)
		{
			if (!this._isCrossDomain(this._current_url)) // 2014-06-26 pss [REQ_36583] - for crossdomain check
			{
				return ifrm_elem._setBack();
			}
		}
	};

	_pWebView.goForward = function ()
	{
		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem)
		{
			if (!this._isCrossDomain(this._current_url)) // 2014-06-26 pss [REQ_36583] - for crossdomain check
			{
				return ifrm_elem._setForward();
			}
		}
	};

	_pWebView.on_load_handler = function (docurl)
	{
		// [23/03/13] - ������ - [RP 95548][WRE���� WebView ����� Cross Domain ��Ȳ�̸� goBack, goForward, callScript�� �������� �ʴ� ������ �Ŵ��� ��� ��û]
		// goBack, goFoward, callScript ���۽� _current_url ���� ������� �ʾ� isCrossDomain üũ�� ���������� ���� �ʴ� ���� �ؼ�
		if (this._current_url != docurl)
		{
			this._current_url = docurl;
		}

		this._current_url = docurl;
		this.document = this._ifrm_elem._getDoc();
		if (docurl != "about:blank")
		{
			this.on_fire_onloadcompleted(this, docurl == "" ? this._p_url : docurl);
		}
	};

	_pWebView.callScript = function (/*func*/func)
	{
		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem)
		{
			// [23/03/03] - ������ - [RP 95548][WRE���� WebView ����� Cross Domain ��Ȳ�̸� goBack, goForward, callScript�� �������� �ʴ� ������ �Ŵ��� ��� ��û]
			//    - [13dd7520 Ŀ��: RP:88886 WebView about:blank���� document�� ���ٵ��� �ʴ� ���� ����] �ǿ��� CrossDomain üũ �ּ� ó�� �κ� ����
			// [23/10/26] - ������ - [RP 97974][Environment.networksecurelevel = all�� ��� webview callscript �� crossdomain�̸� ȣ���̵��� �ʽ��ϴ�.]
			//    - Cy_WebView.cpp �ܿ��� �������� ���� �����ο� ������ ������ Ȯ���ϴ� �˾��� ���� ������� �����ϱ� ���� �ϱ� ���ǹ� �ּ�ó��.
			// if (!this._isCrossDomain(this._current_url) || this._current_url == "") // 2014-06-26 pss [REQ_36583] - for crossdomain check
			{
				// [23/07/21] - ������ - NRE���� ����������Ʈ post ��� ó�� �� ���� ���� �ʴ� ���� (RP 95548�� ����) - v24 ó����
				// WebView ������ URL�� ���� �ʰ� callscript�� ���� html�� ���� ��� "this._current_url"���� ��� ����
				// _isCrossDomain �Լ����� "this._current_url"���� ���� ��� CrossDomain ȯ���̶�� �Ǵ���.
				// �ٸ� �������� _isCrossDomain �Լ��� ����������� callscript������ ���������� this._current_url ���� ��� �־ ������ �� �ֵ��� ����
				return nexacro._WebViewPluginElement.prototype.injectScript.apply(ifrm_elem, arguments);
			}
		}
	};

	_pWebView.callScriptAsync = function (/*func*/func)
	{
		var ret;
		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem)
		{
			// [23/03/03] - ������ - [RP 95548][WRE���� WebView ����� Cross Domain ��Ȳ�̸� goBack, goForward, callScript�� �������� �ʴ� ������ �Ŵ��� ��� ��û]
			// [13dd7520 Ŀ��: RP:88886 WebView about:blank���� document�� ���ٵ��� �ʴ� ���� ����] �ǿ��� CrossDomain üũ �ּ� ó�� �κ� ����
			if (!this._isCrossDomain(this._current_url) || this._current_url == "") // 2014-06-26 pss [REQ_36583] - for crossdomain check
			{
				// [23/07/21] - ������ - NRE���� ����������Ʈ post ��� ó�� �� ���� ���� �ʴ� ���� (RP 95548�� ����) - v24 ó����
				// WebView ������ URL�� ���� �ʰ� callscript�� ���� html�� ���� ��� "this._current_url"���� ��� ����
				// _isCrossDomain �Լ����� "this._current_url"���� ���� ��� CrossDomain ȯ���̶�� �Ǵ���.
				// �ٸ� �������� _isCrossDomain �Լ��� ����������� callscript������ ���������� this._current_url ���� ��� �־ ������ �� �ֵ��� ����
				ret = nexacro._WebViewPluginElement.prototype.injectScriptAndReturnPromise.apply(ifrm_elem, arguments);
			}
		}

		if (!ret || !(ret instanceof Promise))
		{
			ret = new Promise(function (resolve, reject)
			{
				reject("Failed to execute method 'callscript' on WebView.");
			});
		}
		return ret;
	};

	_pWebView.addScriptOnDocumentCreated = function ()
	{
	};
	_pWebView.removeScriptOnDocumentCreated = function ()
	{
	};
	_pWebView.clearScriptOnDocumentCreated = function ()
	{
	};

	// runtime only 
	/*
	_pWebView.callScriptAsync = function (func,callbackfunc,scope)
	{
		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem)
		{
			
			{
				return nexacro._WebViewPluginElement.prototype.injectScriptAsync.apply(ifrm_elem, arguments);
			}
		}
	};
	*/

	_pWebView.addEventHandler = function (evt_id, func, target)
	{
		if (evt_id in this._event_list == false)
		{
			this._event_list[evt_id] = 1;
		}
		return nexacro.Component.prototype.addEventHandler.call(this, evt_id, func, target);
	};

	_pWebView.removeEventHandler = function (evt_id, func, target)
	{
		return nexacro.Component.prototype.removeEventHandler.call(this, evt_id, func, target);
	};

	_pWebView._isCrossDomain = function (target) // 2014-06-26 pss [REQ_36583] - for crossdomain check
	{
		if (target == "")
		{
			return true;
		}

		var rootForm = this._getRootForm();
		var base = rootForm._getRefFormBaseUrl();

		if (base.match(/^(file):\/\//))
		{
			return false;
		}

		if (nexacro._isSameOrigin(target, base))
			return false;

		return true;
	};

	_pWebView._on_apply_accessibilityleavemessage = function ()
	{
		var leavemessage = this._p_accessibilityleavemessage;
		if (leavemessage)
		{
			var ifrm_elem = this._ifrm_elem;
			if (ifrm_elem)
			{
				ifrm_elem._setElementLeaveMessage(leavemessage);
			}
		}
	};

	_pWebView.updateWindow = function ()
	{
		var ifrm_elem = this._ifrm_elem;
		if (ifrm_elem)
		{
			ifrm_elem.updateWindow();
		}
	};

	_pWebView = null;
}

