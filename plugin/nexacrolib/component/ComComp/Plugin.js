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

// ==================================================================================================================
// 제약사항
// 1. 경로를 입력하는 모든 프로퍼티에 대해서 절대경로 및 상대경로를 지원하지 못합니다. HTTP Full URL 을 사용해야 합니다.
// 2. Flash 를 로드 할 경우 movie 에 대해서 Service 형태(ex>Base::sample.swf)의 path 를 지원할 수 없습니다.
// 3. windowed(for Runtime), popupstyle 속성과 install() 함수는 지원할 수 없습니다.
// 4. WMode는 ActiveX 또는 Flash Object 가 지원하는 기능입니다.
// ==================================================================================================================
// nexacro.Plugin 부분
// 1. IE 이외의 브라우저 지원
//   비 IE 브라우저에서 플래시와 같은 Plugin을 사용하기 위해서는 embed tag를 사용해야 하고
//   embed tag는 IE가 아닌 경우에만 동적 생성 가능 (IE에서 동적으로 생성하여 object의 child로 append 할 경우 오류 발생함)
//   때문에 dynamic dom create 방식이 아닌 innerHTML 방식으로 디자인합니다
// 2. windowed 속성과 WMode
//   windowed 속성값은 ajax에 영향을 미치지 않습니다 (Runtime 을 위한 속성값임)
//   WMode 는 ActiveX 또는 Flash Object 가 지원하는 속성으로 해당 Object 가 WMode 를 지원하지 않으면
//   해당 설정값은 무의미합니다
// ==================================================================================================================
if (!nexacro.Plugin)
{
    nexacro.Plugin = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._params = new nexacro.Collection();
        this._events = new nexacro.Collection();
    };

    var _pPlugin = nexacro._createPrototype(nexacro.Component, nexacro.Plugin);
    nexacro.Plugin.prototype = _pPlugin;

    _pPlugin._type_name = "Plugin";

    _pPlugin._p_classid = "";
    _pPlugin._p_classid64 = "";
    _pPlugin._p_codebase = "";
    _pPlugin._p_code = "";
    _pPlugin._p_archive = "";

    _pPlugin._p_mimetype = "";
    _pPlugin._p_pluginsrc = "";
    _pPlugin._p_pluginpage = "";
    _pPlugin._p_license = "";
    _pPlugin._p_lpkpath = "";

    _pPlugin._p_contents = "";
    _pPlugin._p_adjustalpha = false;
    _pPlugin._p_usepersistdata = false;

    _pPlugin._p_windowed = false;
    _pPlugin._p_popupstyle = false;

    //==== internal properties =========//
    _pPlugin._obj_id = "";
    _pPlugin._obj_elem = null;
    _pPlugin._params = null;

    _pPlugin._event_params = null;

    _pPlugin.set_visible = function (v)
    {
        if (v === undefined || v === null) return;
        v = nexacro._toBoolean(v);

        nexacro.Component.prototype.set_visible.call(this, v);

        var obj_elem = this._obj_elem;
        if (obj_elem)
        {
            obj_elem.setElementVisible(v);
        }
    };

    // -- Override
    _pPlugin.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var obj_elem = this._obj_elem = new nexacro.PluginElement(control_elem);
            obj_elem.setElementSize(this._getClientWidth(), this._getClientHeight());

            var params = this._params;
            var i, param_cnt = params.length;
            for (i = 0; i < param_cnt; i++)
            {
                obj_elem.setElementParam(params.get_id(i), params.get_item(i));
            }

            var events = this._events;
            var event_cnt = events.length;
            for (i = 0; i < event_cnt; i++)
            {
                obj_elem.addEventHandler(events.get_id(i), events.get_item(i));
            }
        }

        this.on_apply_classid();
        this.on_apply_classid64();
        this.on_apply_codebase();
        this.on_apply_code();
        this.on_apply_archive();
        this.on_apply_mimetype();
        this.on_apply_pluginsrc();
        this.on_apply_pluginpage();
        this.on_apply_plugintype();
        this.on_apply_license();
        this.on_apply_lpkpath();
        this.on_apply_adjustalpha();
        this.on_apply_usepersistdata();
        this.on_apply_windowed();
        this.on_apply_popupstyle();

    };

    _pPlugin.on_create_contents_command = function ()
    {
        if (this._obj_elem)
            return this._obj_elem.createCommand();

        return "";
    };

    _pPlugin.on_attach_contents_handle = function (win)
    {
        if (this._obj_elem)
        {
            this._obj_elem.component = this;
            this._obj_elem.attachHandle(win);
        }
    };

    _pPlugin.on_created_contents = function (win)
    {

        var obj_elem = this._obj_elem;
        if (obj_elem)
        {
            obj_elem.component = this;

            obj_elem.create(win);
            obj_elem.setElementVisible(this.visible);

            //obj_elem.initEvent(); // move to obj_elem.create();
        }

    };

    _pPlugin.on_destroy_contents = function ()
    {
        var obj_elem = this._obj_elem;
        if (obj_elem)
        {
            obj_elem.destroy();
            this._obj_elem = null;
        }
    };

    _pPlugin.on_update_position = function (resize_flag, move_flag, update)
    {
        nexacro.Component.prototype.on_update_position.call(this, resize_flag, move_flag, update);
        var obj_elem = this._obj_elem;
        if (obj_elem)
        {
            if (resize_flag || move_flag)
                obj_elem.on_update_position(resize_flag, move_flag, this._adjust_left, this._adjust_top);
        }
    };

    _pPlugin._apply_setfocus = function (/*focus*/)
    {
        var obj_elem = this._obj_elem;
        if (obj_elem)
        {
            obj_elem.setElementFocus();
        }
    };

    _pPlugin.on_change_containerRect = function (width, height)
    {
        var obj_elem = this._obj_elem;
        if (obj_elem)
        {
            obj_elem.setElementSize(width, height);
        }
    };

    _pPlugin._setContents = function (str)
    {
        if (str && str.length)
        {
            if (str.indexOf("<Contents/>") != 0 && str.indexOf("<Contents>") != 0)
            {
                str = "<Contents>" + str + "</Contents>";
            }
            var doc = nexacro._parseXMLDocument(str);
            if (doc)
            {
                this._params.clear();

                var elems = doc.getElementsByTagName("Param");
                if (elems)
                {
                    var len = elems.length;
                    for (var i = 0; i < len; i++)
                    {
                        var param = elems[i];
                        var name = param.getAttribute("name");
                        var value = param.getAttribute("value");

                        var obj_elem = this._obj_elem;
                        if (obj_elem)
                        {
                            obj_elem.setElementParam(name, value);
                        }
                        else
                        {
                            this._params.add_item(name, value);
                        }
                    }
                }

                elems = doc.getElementsByTagName("_persistdata");
                if (elems)
                {
                    var len = elems.length;
                    for (var i = 0; i < len; i++)
                    {
                        var data_node = elems[i];
                        if (data_node.childNodes && data_node.childNodes.length > 0)
                        {
                            var name = "__persistdata";
                            var value = data_node.childNodes[0].source;

                            var obj_elem = this._obj_elem;
                            if (obj_elem)
                            {
                                obj_elem.setElementParam(name, value);
                            }
                            else
                            {
                                this._params.add_item(name, value);
                            }
                        }
                    }
                }
            }
        }
    };

    // ==================================================================================================================
    // Properties
    // ==================================================================================================================    
    _pPlugin.set_contents = function (str)
    {
        this._p_contents = str;
        this._setContents(str);
    };

    _pPlugin.set_classid = function (v)
    {
        this._p_classid = v;
        this.on_apply_classid();
    };

    _pPlugin.on_apply_classid = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            var classid = this._p_classid;
            elem.setElementClassId(classid);
        }
    };

    _pPlugin.set_classid64 = function (v)
    {
        this._p_classid64 = v;
        this.on_apply_classid64();
    };

    _pPlugin.on_apply_classid64 = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            var classid64 = this._p_classid64;
            elem.setElementClassId64(classid64);
        }
    };

    _pPlugin.set_codebase = function (v)
    {
        this._p_codebase = v;
        this.on_apply_codebase();
    };

    _pPlugin.on_apply_codebase = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            var codebase = this._p_codebase;
            if (codebase)
            {
                elem.setElementCodebase(codebase);
            }
        }
    };

    _pPlugin.set_code = function (v)
    {
        this._p_code = v;
        this.on_apply_code();
    };

    _pPlugin.on_apply_code = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            var code = this._p_code;
            if (code)
            {
                elem.setElementCode(code);
            }
        }
    };

    _pPlugin.set_archive = function (v)
    {
        this._p_archive = v;
        this.on_apply_archive();
    };

    _pPlugin.on_apply_archive = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            var archive = this._p_archive;
            if (archive)
            {
                elem.setElementArchive(archive);
            }
        }
    };

    _pPlugin.set_mimetype = function (v)
    {
        this._p_mimetype = v;
        this.on_apply_mimetype();
    };

    _pPlugin.on_apply_mimetype = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            var mimetype = this._p_mimetype;
            if (mimetype)
            {
                elem.setElementMIMEType(mimetype);
            }
        }
    };

    _pPlugin.set_pluginsrc = function (v)
    {
        this._p_pluginsrc = v;
        this.on_apply_pluginsrc();
    };

    _pPlugin.on_apply_pluginsrc = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            var pluginsrc = this._p_pluginsrc;
            if (pluginsrc)
            {
                elem.setElementPluginSrc(pluginsrc);
            }
        }
    };

    _pPlugin.set_plugintype = function (v)
    {
        this.plugintype = v;
        this.on_apply_plugintype();
    };

    _pPlugin.on_apply_plugintype = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            var plugintype = this.plugintype;
            if (plugintype)
            {
                elem.setElementPluginMIMEType(plugintype);
            }
        }
    };

    _pPlugin.set_pluginpage = function (v)
    {
        this._p_pluginpage = v;
        this.on_apply_pluginpage();
    };

    _pPlugin.on_apply_pluginpage = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            var pluginpage = this._p_pluginpage;
            if (pluginpage)
            {
                elem.setElementPluginPage(pluginpage);
            }
        }
    };

    _pPlugin.set_license = function (v)
    {
        this._p_license = v;
        this.on_apply_license();
    };

    _pPlugin.on_apply_license = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            var license = this._p_license;
            if (license)
            {
                elem.setElementLicense(license);
            }
        }
    };

    _pPlugin.set_lpkpath = function (v)
    {
        this._p_lpkpath = v;
        this.on_apply_lpkpath();
    };

    _pPlugin.on_apply_lpkpath = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            var lpkpath = this._p_lpkpath;
            if (lpkpath)
            {
                elem.setElementLicenseFile(lpkpath);
            }
        }
    };

    _pPlugin.set_adjustalpha = function (v)
    {
        //this._p_adjustalpha = v;
        this._p_adjustalpha = nexacro._toBoolean(v);
        this.on_apply_adjustalpha();
    };

    _pPlugin.on_apply_adjustalpha = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            var adjustalpha = this._p_adjustalpha;
            if (adjustalpha)
            {
                elem.setElementAdjustAlpha(adjustalpha);
            }
        }
    };

    _pPlugin.set_usepersistdata = function (v)
    {
        this._p_usepersistdata = v;
        this.on_apply_usepersistdata();
    };

    _pPlugin.get_usepersistdata = function (v)
    {
        var elem = this._obj_elem;
        if (elem)
            return elem.getElementUsePersistData();
    };

    _pPlugin.on_apply_usepersistdata = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            var usepersistdata = this._p_usepersistdata;
            if (usepersistdata)
            {
                elem.setElementUsePersistData(usepersistdata);
            }
        }
    };

    /** 구현불가로 제약사항임 */
    _pPlugin.set_windowed = function (v)
    {
        //this._p_windowed = v;
        this._p_windowed = nexacro._toBoolean(v);
    };

    _pPlugin.on_apply_windowed = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            var windowed = this._p_windowed;
            if (windowed)
            {
                elem.setElementWindowed(windowed);
            }
        }
    }; // 이영민

    _pPlugin.set_popupstyle = function (v)
    {
        this._p_popupstyle = nexacro._toBoolean(v);
        this.on_apply_popupstyle();
    };

    _pPlugin.on_apply_popupstyle = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            var popupstyle = this._p_popupstyle;
            if (popupstyle)
            {
                elem.setElementPopupStyle(popupstyle);
            }
        }
    };

    _pPlugin._properties = [{ name: "classid" }, { name: "classid64" }, { name: "codebase" }, { name: "code" }, { name: "archive" }, { name: "mimetype" }, { name: "pluginsrc" }, { name: "pluginpage" }, { name: "license" }, { name: "lpkpath" }, { name: "contents" }, { name: "adjustalpha" }, { name: "usepersistdata" }, { name: "windowed" }, { name: "popupstyle" }];
    nexacro._defineProperties(_pPlugin, _pPlugin._properties);

    // ==================================================================================================================
    // Method
    // ==================================================================================================================
    _pPlugin.install = function ()
    {
        // 보안 문제로 RUNTIME만.
        var elem = this._obj_elem;
        if (elem)
        {
            elem.install();
        }
    };

    _pPlugin.isInstalled = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            return elem.isInstalled();
        }
        return false;
    };

    _pPlugin.isLoaded = function ()
    {
        var elem = this._obj_elem;
        if (elem)
        {
            return elem.isLoaded();
        }
        return false;
    };

    _pPlugin.setProperty = function (propId, val)
    {
        var fname = "set_" + propId;
        var setFn = this[fname];
        if (setFn)
        {
            setFn.call(this, val);
        }
        else
        {
            var obj_elem = this._obj_elem;
            if (obj_elem)
            {
                if (propId.toLowerCase() == "movie") //for use swf
                {
                    obj_elem.setElementPluginSrc(val);
                    obj_elem.setElementPluginMIMEType("application/x-shockwave-flash");
                }
            }

            this._setParam(propId, val);
        }
    };

    _pPlugin.getProperty = function (propId)
    {
        var val = this._getParam(propId);
        if (val == null)
        {
            val = this[propId];
        }
        return val;
    };

    _pPlugin.callMethod = function ()
    {
        var obj_elem = this._obj_elem;
        if (obj_elem)
        {
            var conv_args = Array.prototype.slice.call(arguments);
            for (var i = 0; i < conv_args.length; i++)
            {
                if (conv_args[i] instanceof nexacro.Plugin)
                {
                    var plugin_elem = conv_args[i]._obj_elem;
                    if (plugin_elem)
                    {
                        conv_args[i] = plugin_elem.getPluginObject();
                    }
                }
            }

            return this._callMethod.apply(this, conv_args);
        }
    };

    _pPlugin._fireEvent = function ()
    {
        var i, ret;
        var handlers = this._user_handlers;
        var len = handlers.length;

        for (i = 0; i < len; i++)
        {
            var h = handlers[i];
            if (h)
                ret = h.handler.apply(h.target, arguments);
        }
        return ret;
    };

    _pPlugin.addEventHandler = function (evt_id, func, target)
    {
        if (!func)
            return;

        var ret = false;
        var obj_elem = this._obj_elem;
        if (obj_elem)
        {
            ret = obj_elem.addEventHandler(evt_id, func);
        }
        if (ret == false)
        {
            this._events.add_item(evt_id, func);
        }
        if (evt_id in this._event_list == false)
        {
            this._event_list[evt_id] = 1;
        }
        ret = nexacro.Component.prototype.addEventHandler.call(this, evt_id, func, target);
        if (this[evt_id])
        {
            this[evt_id]._firePluginEvent = _pPlugin._fireEvent;
        }
        return ret;
    };

    _pPlugin.removeEventHandler = function (evt_id, func, target)
    {
        var obj_elem = this._obj_elem;
        if (obj_elem)
        {
            obj_elem.removeEventHandler(evt_id, func);
        }
        else
        {
            this._events.delete_item(evt_id);
        }
        return nexacro.Component.prototype.removeEventHandler.call(this, evt_id, func, target);
    };

    _pPlugin._getParam = function (propId)
    {
        var val;
        var obj_elem = this._obj_elem;
        if (obj_elem)
        {
            val = obj_elem.getElementParam(propId);
        }
        else
        {
            val = this._params.get_item(propId);
        }
        return val;
    };

    _pPlugin._setParam = function (propId, val)
    {
        var obj_elem = this._obj_elem;
        if (obj_elem)
        {
            obj_elem.setElementParam(propId, val);
        }
        else
        {
            this._params.add_item(propId, val);
        }
    };

    _pPlugin._callMethod = function ()
    {
        var _obj_elem = this._obj_elem;
        if (_obj_elem)
        {
            return _obj_elem.callMethod.apply(_obj_elem, arguments);
        }
    };

    _pPlugin = null;
}
