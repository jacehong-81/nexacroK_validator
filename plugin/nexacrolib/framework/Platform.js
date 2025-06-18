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
// nexacro Platform Objects
//==============================================================================

if (!nexacro._bInitPlatform)
{
    "use strict";

    var _process = true;
    var _global_context = this ? this : globalThis;


    nexacro._bInitPlatform = true;

    nexacro.isDesignMode = false;
    nexacro.isPluginMode = nexacro._isPluginMode();
    //for RTL IMPLEMENTATION;    
    nexacro._SupportRTL = true; //nexacro._Browser != "Runtime";

    //==============================================================================
    // nexacro_SysEvent
    // Basic System Event Utils
    //==============================================================================
    nexacro._initializeGlobalObjects = function (_jsContext)
    {
        if (nexacro.ismodule) return;
        //==============================================================================
        // _emptyFn
        _jsContext.emptyFn = nexacro._emptyFn;

        // global API's for script
        // isNumber, isString, isUndefined, isArray, isFunction, isObject

        // Basic Util Functions
        _jsContext.isNumber = nexacro._isNumber;
        _jsContext.isString = nexacro._isString;
        _jsContext.isUndefined = nexacro._isUndefined;
        _jsContext.isObject = nexacro._isObject;
        _jsContext.isArray = nexacro._isArray;
        _jsContext.isFunction = nexacro._isFunction;


        //==============================================================================
        // nexacro Object Register for HTML Documents
        //==============================================================================
        _jsContext.MainFrame = nexacro.MainFrame;
        _jsContext.ChildFrame = nexacro.ChildFrame;
        _jsContext.FrameSet = nexacro.FrameSet;
        _jsContext.VFrameSet = nexacro.VFrameSet;
        _jsContext.HFrameSet = nexacro.HFrameSet;
        _jsContext.TileFrameSet = nexacro.TileFrameSet;
        _jsContext.Form = nexacro.Form;
        _jsContext.Layout = nexacro.Layout;
        _jsContext.BindItem = nexacro.BindItem;
        _jsContext.FlashPlayer = nexacro.FlashPlayer;
        _jsContext.Button = nexacro.Button;
        _jsContext.Calendar = nexacro.Calendar;
        _jsContext.Combo = nexacro.Combo;
        _jsContext.CheckBox = nexacro.CheckBox;
        _jsContext.Div = nexacro.Div;
        _jsContext.Dataset = nexacro.NormalDataset;
        _jsContext.Edit = nexacro.Edit;
        _jsContext.FileDownload = nexacro.FileDownload;
        _jsContext.FileUpload = nexacro.FileUpload;
        _jsContext.Grid = nexacro.Grid;
        _jsContext.GroupBox = nexacro.GroupBox;
        _jsContext.ImageViewer = nexacro.ImageViewer;
        _jsContext.ExcelImportObject = nexacro.ExcelImportObject;
        _jsContext.ListBox = nexacro.ListBox;
        _jsContext.MaskEdit = nexacro.MaskEdit;
        _jsContext.TextArea = nexacro.TextArea;
        _jsContext.Radio = nexacro.Radio;
        _jsContext.Spin = nexacro.Spin;
        _jsContext.Static = nexacro.Static;
        _jsContext.ExcelExportObject = nexacro.ExcelExportObject;
        _jsContext.ExportItem = nexacro.ExportItem;
        _jsContext.ExportProgress = nexacro.ExportProgress;
        _jsContext.Menu = nexacro.Menu;
        _jsContext.PopupMenu = nexacro.PopupMenu;
        _jsContext.Tab = nexacro.Tab;
        _jsContext.Tabpage = nexacro.Tabpage;
        _jsContext.ProgressBar = nexacro.ProgressBar;
        _jsContext.PopupDiv = nexacro.PopupDiv;
        _jsContext.WebBrowser = nexacro.WebBrowser;
        _jsContext.WebView = nexacro.WebView;
        _jsContext.FileDialog = nexacro.FileDialog;
        _jsContext.VirtualFile = nexacro.VirtualFile;
        _jsContext.View = nexacro.View;
        _jsContext.Action = nexacro.Action;

        _jsContext.DomParser = nexacro.DomParser;
        _jsContext.Sketch = nexacro.Sketch;
        _jsContext.ColumnInfo = nexacro.DSColumnInfo;
        _jsContext.Plugin = nexacro.Plugin;

        _jsContext.TCPClientSocket = nexacro.TCPClientSocket;

        _jsContext.DragDataFormats = nexacro.DragDataFormats;
        _jsContext.DragDataObject = nexacro.DragDataObject;
        if (nexacro._Browser == "Runtime")
        {
            _jsContext.XMLHttpRequest = nexacro.XMLHttpRequest;
            _jsContext.WebSocket = nexacro.WebSocket;
        }

        _jsContext.DataObject = nexacro.DataObject;
        _jsContext.Panel = nexacro.Panel;
        _jsContext.PanelItem = nexacro.PanelItem;
    };

    // IE6,7 에서 window urlchange 시 leak.
    nexacro._finalizeGlobalObjects = function (_jsContext)
    {
        //==============================================================================
        // _emptyFn
        _jsContext.emptyFn = null;

        // global API's for script
        // isNumber, isString, isUndefined, isArray, isFunction, isObject

        // Basic Util Functions
        _jsContext.isNumber = null;
        _jsContext.isString = null;
        _jsContext.isUndefined = null;
        _jsContext.isObject = null;
        _jsContext.isArray = null;
        _jsContext.isFunction = null;


        //==============================================================================
        // nexacro Object Register for HTML Documents
        //==============================================================================
        _jsContext.MainFrame = null;
        _jsContext.ChildFrame = null;
        _jsContext.FrameSet = null;
        _jsContext.VFrameSet = null;
        _jsContext.HFrameSet = null;
        _jsContext.TileFrameSet = null;
        _jsContext.Form = null;
        _jsContext.Layout = null;
        _jsContext.BindItem = null;
        _jsContext.FlashPlayer = null;
        _jsContext.Button = null;
        _jsContext.Calendar = null;
        _jsContext.Combo = null;
        _jsContext.CheckBox = null;
        _jsContext.Div = null;
        _jsContext.Dataset = null;
        _jsContext.Edit = null;
        _jsContext.FileDownload = null;
        _jsContext.FileUpload = null;
        _jsContext.Grid = null;
        _jsContext.GroupBox = null;
        _jsContext.ImageViewer = null;
        _jsContext.ExcelImportObject = null;
        _jsContext.ListBox = null;
        _jsContext.MaskEdit = null;
        _jsContext.TextArea = null;
        _jsContext.Radio = null;
        _jsContext.Spin = null;
        _jsContext.Static = null;
        _jsContext.ExcelExportObject = null;
        _jsContext.ExportItem = null;
        _jsContext.ExportProgress = null;
        _jsContext.Menu = null;
        _jsContext.PopupMenu = null;
        _jsContext.Tab = null;
        _jsContext.Tabpage = null;
        _jsContext.ProgressBar = null;
        _jsContext.PopupDiv = null;
        _jsContext.WebBrowser = null;
        _jsContext.WebView = null;
        _jsContext.FileDialog = null;
        _jsContext.VirtualFile = null;
        _jsContext.DomParser = null;
        _jsContext.Sketch = null;
        _jsContext.ColumnInfo = null;
        _jsContext.Plugin = null;
        _jsContext.TCPClientSocket = null;
        _jsContext.DragDataFormats = null;
        _jsContext.DragDataObject = null;
        if (nexacro._Browser == "Runtime")
            _jsContext.XMLHttpRequest = null;
        _jsContext.DataObject = null;
        _jsContext.Panel = null;
        _jsContext.PanelItem = null;
    };

    //---------------------------------------------------------------------------------------
    // System Object : Object Type. --> application.system = nexacro.System;
    //---------------------------------------------------------------------------------------

    nexacro.System.screenToClientX = function (comp, posX, round)
    {
        if (comp._control_element)
        {
            var p = nexacro._getElementScreenPosition(comp._control_element, round);
            var value = (posX - p.x) / nexacro._getDevicePixelRatio(comp._control_element);

            return (round === false) ? value : Math.round(value);
        }
    };

    nexacro.System.screenToClientY = function (comp, posY, round)
    {
        if (comp._control_element)
        {
            var p = nexacro._getElementScreenPosition(comp._control_element, round);
            var value = (posY - p.y) / nexacro._getDevicePixelRatio(comp._control_element);

            return (round === false) ? value : Math.round(value);
        }
    };

    nexacro.System.clientToScreenX = function (comp, posX, round)
    {
        if (comp._control_element)
        {
            var p = nexacro._getElementScreenPosition(comp._control_element, round);
            var value = posX * nexacro._getDevicePixelRatio(comp._control_element);

            return ((round === false) ? value : Math.round(value)) + p.x;
        }
    };

    nexacro.System.clientToScreenY = function (comp, posY, round)
    {
        if (comp._control_element)
        {
            var p = nexacro._getElementScreenPosition(comp._control_element, round);
            var value = posY * nexacro._getDevicePixelRatio(comp._control_element);

            return ((round === false) ? value : Math.round(value)) + p.y;
        }
    };

    nexacro.System.getScreenPosition = function (comp)
    {
        if (comp._control_element)
        {
            return nexacro._getElementScreenPosition(comp._control_element);
        }
    };

    nexacro.System.getPackageVersion = function ()
    {
    };

    //******************************************************************************
    //  Methods
    //******************************************************************************
    nexacro.System.convertRealPath = function (path)
    {
        if (globalThis.chrome && globalThis.chrome.webview)
        {
            var params = { strpath: path };
            return nexacro._messageToNative("0000", "nexacroapi", "_convertRealPath", params, true, true);
        }

        return nexacro._convertRealPath(path);
    };

    nexacro.System.execBrowser = function (url)
    {
        if (globalThis.chrome && globalThis.chrome.webview)
        {
            var params = { strurl: url };
            nexacro._messageToNative("0000", "nexacroapi", "_execBrowser", params, true, true);
            return;
        }
        nexacro._execBrowser(url);
    };

    nexacro.System.execDefaultBrowser = function (url, newwindow)
    {
        if (globalThis.chrome && globalThis.chrome.webview)
        {
            var params = { strexeUrl: url, bNewWindow: newwindow };
            nexacro._messageToNative("0000", "nexacroapi", "_execShell", params, true, true);
            return;
        }
        nexacro._execDefaultBrowser(url, newwindow);
    };

    nexacro.System.execShell = function (exeUrl)
    {
        if (globalThis.chrome && globalThis.chrome.webview)
        {
            var params = { strexeUrl: exeUrl };
            nexacro._messageToNative("0000", "nexacroapi", "_execShell", params, true, true);
            return;
        }
        nexacro._execShell(exeUrl);
    };

    nexacro.System.execNexacro = function (command)
    {
        if (globalThis.chrome && globalThis.chrome.webview)
        {
            var params = { strcommand: command };
            nexacro._messageToNative("0000", "nexacroapi", "_execNexacro", params, true, true);
            return;
        }

        nexacro._execNexacro(command);
    };

    nexacro.System.setClipboard = function (format, data)
    {
        return nexacro._setClipboard(format, data);
    };

    nexacro.System.getClipboard = function (format, callback, target)
    {
        return nexacro._getClipboard(format, callback, target);
    };

    nexacro.System.clearClipboard = function ()
    {
        nexacro._clearClipboard();
    };

    nexacro.System.getScreenResolution = function (monitor_index)
    {
        var ret_val = "";
        if (monitor_index)
        {
            var screenwidth = nexacro._getScreenWidth(monitor_index);
            var screenheight = nexacro._getScreenHeight(monitor_index);
            ret_val = screenwidth + " " + screenheight;
            return ret_val;
        }
    };

    nexacro.System.getScreenRect = function (monitor_index)
    {
        if (monitor_index)
        {
            return nexacro._getScreenRect(monitor_index);
        }
    };

    nexacro.System.showModalSync = function (childframe, str_id, _parent_frame, arr_arg, opener)
    {
        return nexacro._showModalSync(childframe, str_id, _parent_frame, arr_arg, opener);
    };

    nexacro.System.showModalWindow = function (childframe, str_id, parent_frame, arr_arg, opener)
    {
        return nexacro._showModalWindow(childframe, str_id, parent_frame, arr_arg, opener);
    };

    nexacro.System.isPrimaryMonitor = function (monitor_index)
    {
        if (monitor_index)
        {
            return nexacro._isPrimaryMonitor(monitor_index);
        }
    };

    nexacro.System.getMonitorIndex = function (cursorX, cursorY)
    {
        return nexacro._getMonitorIndex(cursorX, cursorY);
    };

    nexacro.System.getCursorX = function ()
    {
        return nexacro._getCursorX();
    };

    nexacro.System.getCursorY = function ()
    {
        return nexacro._getCursorY();
    };

    nexacro.System.getScreenHeight = function (monitor_index)
    {
        return nexacro._getScreenHeight(monitor_index);
    };

    nexacro.System.getScreenWidth = function (monitor_index)
    {
        return nexacro._getScreenWidth(monitor_index);
    };

    nexacro.System.checkDevicePermission = function (permission_types)
    {
        nexacro._checkDevicePermission(permission_types);
    };

    nexacro.System.requestDevicePermission = function (permission_types, description)
    {
        nexacro._requestDevicePermission(permission_types, description);
    };

    nexacro.System.computername = nexacro._getComputerName();
    nexacro.System.cpuarchitecture = nexacro._getCPUArchitecture();
    nexacro.System.cpucount = nexacro._getCPUCount();
    nexacro.System.cputype = nexacro._getCPUType();
    nexacro.System.locale = nexacro._getLocale();
    nexacro.System.loginuser = nexacro._getLoginUser();
    nexacro.System.mobileorientation = nexacro._getMobileOrientation();
    nexacro.System.mobilephonenumber = nexacro._getMobilePhoneNumber();
    nexacro.System.mobileproducttype = nexacro._getMobileProductType();
    nexacro.System.mobileuniqueid = nexacro._getMobileUniqueID();
    nexacro.System.monitorcount = nexacro._getMonitorCount();
    nexacro.System.navigatorname = nexacro._getNavigatorName();
    nexacro.System.navigatorfullname = nexacro._getNavigatorFullName();
    nexacro.System.navigatorversion = nexacro._BrowserVersion;
    nexacro.System.osversion = nexacro._getOSVersion();
    nexacro.System.taskbarsize = nexacro._getTaskbarSize();
    nexacro.System.notificationtoken = null;

    nexacro.System.print = function (comp, defaultprint, valign, halign, fitonepage, strOrientation)
    {
        try
        {
            if (comp)
                return nexacro._beforePrintCheckPlugin(comp, comp._refform, defaultprint, valign, halign, fitonepage, strOrientation);
        }
        catch (e)
        {
            return false;
        }
        return false;
    };

    nexacro.System.getScreenPrintString = function (comp)
    {
        try
        {
            if (comp)
            {
                return nexacro._getScreenPrintString(comp);
            }
        }
        catch (e)
        {
            return "";
        }
        return "";
    };

    nexacro.System.exportPDF = function (comp, strFileName/*, nPageWidth, nPageHeight, nDPI, options, strWatermarkText, strWatermarkImageUrl, watermarkOptions*/)
    {
        try
        {
            if (comp)
            {
                return nexacro._exportPDF(comp, strFileName/*, nPageWidth, nPageHeight, nDPI, options, strWatermarkText, strWatermarkImageUrl, watermarkOptions*/);
            }
        }
        catch (e)
        {
            return false;
        }
        return false;
    };

    nexacro.System._setNotificationToken = function (notificationtoken)
    {
        nexacro.System.notificationtoken = notificationtoken;
    };

    nexacro.System.saveToImageFile = function (comp, fileName, fileType, compressOption, bIsOverflowClip)
    {
        if (comp)
        {
            return nexacro._saveToImageFile(comp, fileName, fileType, compressOption, bIsOverflowClip, false);
        }
        return false;
    };

    nexacro.System.saveToImageObject = function (comp)
    {
        if (comp)
        {
            var control_elem = comp.getElement();
            if (control_elem)
                return control_elem.saveToImageObject();
        }
    };

    nexacro.System.saveToImageBase64String = function (comp, bIsOverflowClip, imgType, compressOption)
    {
        if (comp)
        {

            return nexacro._saveToImageBase64StringM2(comp, bIsOverflowClip, imgType, compressOption);

        }
        return "";
    };



    //==============================================================================
    // MFE API
    //==============================================================================
    if (!nexacro.__MFEAPI)
        nexacro.__MFEAPI = {};

    nexacro.__MFEAPI._emptyFn = function (args = undefined)
    {
    };

    nexacro.__MFEAPI._loadAppContainer = nexacro.__MFEAPI._emptyFn;
    nexacro.__MFEAPI._getSysEvent = nexacro.__MFEAPI._emptyFn;
    nexacro.__MFEAPI._getRootApp = nexacro.__MFEAPI._emptyFn;
    nexacro.__MFEAPI._getRootApps = nexacro.__MFEAPI._emptyFn;
    nexacro.__MFEAPI._getContainerInfo = nexacro.__MFEAPI._emptyFn;
    nexacro.__MFEAPI._getContainer = nexacro.__MFEAPI._emptyFn;
    nexacro.__MFEAPI._getLinkedWindow = nexacro.__MFEAPI._emptyFn;


    //==============================================================================
    // Timer & Timer Manager
    //==============================================================================
    nexacro._TimerManager = function (context)
    {
        this.context = context;
        this.status = 0;
        this.timerList = [];
    };
    var __pTimerManager = nexacro._createPrototype(nexacro.Object, nexacro._TimerManager);
    nexacro._TimerManager.prototype = __pTimerManager;

    __pTimerManager.addTimer = function (timer)
    {
        var timers = this.timerList;
        var len = timers.length;
        for (var i = 0; i < len; i++)
        {
            var tmitem = timers[i];
            if (tmitem.id == timer.id)
            {
                tmitem.destroy();
                timers.splice(i, 1);
                break;
            }
        }
        timers.push(timer);
    };
    __pTimerManager.stopTimer = function (id)
    {
        var timers = this.timerList;
        var len = timers.length;
        for (var i = 0; i < len; i++)
        {
            var tmitem = timers[i];
            if (tmitem.id == id)
            {
                tmitem.stop();
                return true;
            }
        }
        return false;
    };
    __pTimerManager.startTimer = function (id)
    {
        var timers = this.timerList;
        var len = timers.length;
        for (var i = 0; i < len; i++)
        {
            var tm = timers[i];
            if (tm.id == id)
            {
                tm.start();
                return true;
            }
        }
        return false;
    };
    __pTimerManager.deleteTimer = function (id)
    {
        var timers = this.timerList;
        var len = timers.length;
        for (var i = 0; i < len; i++)
        {
            var tm = timers[i];
            if (tm.id == id)
            {
                tm.destroy();
                timers.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    __pTimerManager.deleteTimerItem = function (item)
    {
        var timers = this.timerList;
        var len = timers.length;
        for (var i = 0; i < len; i++)
        {
            var tm = timers[i];
            if (tm == item)
            {
                tm.destroy();
                timers.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    __pTimerManager.clearAll = function ()
    {
        var timers = this.timerList;
        var len = timers.length;
        for (var i = 0; i < len; i++)
        {
            var tm = timers[i];
            tm.destroy();
        }
        timers.splice(0, len);
    };

    __pTimerManager.destroy = function ()
    {
        this.clearAll();
        this.context = null;
    };

    //---------------------------------------------------------------------------------------
    // EventTimer
    //---------------------------------------------------------------------------------------
    nexacro._on_bindEventTimerHandler = function (pthis, timerid)
    {
        return function ()
        {
            var context = pthis;
            if (context && context._is_alive && context.ontimer && context.ontimer._has_handlers)
            {
                var evt = new nexacro.TimerEventInfo(context, "ontimer", timerid);
                context.ontimer._fireEvent(context, evt);
            }
        };
    };

    //event timer 
    nexacro._EventTimer = function (target, id, interval)
    {
        // event target must be context
        this.id = id;
        this.context = target._getReferenceContext(); //refcontext is  selfcontext
        this.interval = (interval | 0);

        //------------ internal variable ------------------//
        this.handle = null;
        this._ontimer = nexacro._on_bindEventTimerHandler(this.context, id); // bind  
        this.context._timerManager.addTimer(this);
    };

    var __pEventTimer = nexacro._createPrototype(nexacro.Object, nexacro._EventTimer);
    nexacro._EventTimer.prototype = __pEventTimer;

    __pEventTimer.setInterval = function (interval)
    {
        if (this.handle) this.stop();
        this.interval = interval;
    };
    __pEventTimer.start = function ()
    {
        if (this.handle) this.stop();
        this.handle = nexacro._setSystemTimer(this.context._getWindowHandle(), this._ontimer, this.interval);
    };
    __pEventTimer.stop = function ()
    {
        if (this.handle)
        {
            nexacro._clearSystemTimer(this.context._getWindowHandle(), this.handle);
            this.handle = null;
        }
    };
    __pEventTimer.destroy = function ()
    {
        this.stop();
        this.context = null;
        this._ontimer = null;
    };


    //---------------------------------------------------------------------------------------
    // delay for Scroll track, wheel 
    //---------------------------------------------------------------------------------------
    nexacro._DelayTask = function (target, fn, interval)
    {
        this.context = target._getReferenceContext(); //refcontext is  selfcontext
        this.handle = null;
        var handle_window = this.context._getWindowHandle();
        this._call = this.createDelayFunc(fn, interval, target, handle_window, this);
    };

    var __pDelayTask = nexacro._createPrototype(nexacro.Object, nexacro._DelayTask);
    nexacro._DelayTask.prototype = __pDelayTask;

    __pDelayTask.createDelayFunc = function (fn, interval, scope, win_handle, pthis)
    {
        var lastCallTime, elapsed, lastArgs,
            execute = function ()
            {
                pthis.stop();
                fn.apply(scope, lastArgs);
                lastCallTime = new Date().getTime();
            };

        return function ()
        {
            lastArgs = arguments;
            elapsed = new Date().getTime() - lastCallTime;
            if (pthis.handle)
            {
                nexacro._clearSystemTimer(win_handle, pthis.handle);
                pthis.handle = null;
            }
            if (!lastCallTime || (elapsed >= interval))
            {
                execute();
            }
            else
            {
                pthis.handle = nexacro._setSystemTimer(win_handle, execute, interval - elapsed);
            }
        };
    };

    __pDelayTask.run = function ()
    {
        this._call.apply(null, arguments);
    };

    __pDelayTask.stop = function ()
    {
        if (this.handle)
        {
            nexacro._clearSystemTimer(this.context._getWindowHandle(), this.handle);
            this.handle = null;
        }
    };

    __pDelayTask.destroy = function ()
    {
        this.stop();
        this.context = null;
        this._call = null;
    };


    //---------------------------------------------------------------------------------------
    // CallbackTimer
    //---------------------------------------------------------------------------------------
    nexacro._CallbackTimerIdNo = 1000;
    nexacro._on_bindCallbackTimerHandler = function (pthis)
    {
        return function ()
        {
            var target = pthis.target;
            if (target && target._is_alive)
                pthis.callback.call(target, pthis.id);
        };
    };

    nexacro._CallbackTimer = function (target, callback, interval)
    {
        var id = nexacro._CallbackTimerIdNo;
        nexacro._CallbackTimerIdNo++;
        this.id = id;
        this.target = target;
        this.context = target._getReferenceContext();
        this.callback = callback;
        this.interval = (interval | 0);

        // ------------ internal variable -------------- //
        this.handle = null;
        this._ontimer = nexacro._on_bindCallbackTimerHandler(this, callback);
        this.context._timerManager.addTimer(this);
    };

    var __pCallbackTimer = nexacro._createPrototype(nexacro.Object, nexacro._CallbackTimer);
    nexacro._CallbackTimer.prototype = __pCallbackTimer;

    __pCallbackTimer.setInterval = function (interval)
    {
        if (this.handle) this.stop();
        this.interval = interval;
    };
    __pCallbackTimer.start = function ()
    {
        if (this.handle) this.stop();
        this.handle = nexacro._setSystemTimer(this.context._getWindowHandle(), this._ontimer, this.interval);
    };
    __pCallbackTimer.stop = function ()
    {
        if (this.handle)
        {
            nexacro._clearSystemTimer(this.context._getWindowHandle(), this.handle);
            this.handle = null;
        }
    };
    __pCallbackTimer.destroy = function ()
    {
        this.stop();
        this.target = null;
        this.context = null;
        this._ontimer = null;
    };


    //---------------------------------------------------------------------------------------
    // OnceCallbackTimer
    //---------------------------------------------------------------------------------------
    nexacro._on_bindOnceCallbackTimerHandler = function (pthis)
    {
        return function ()
        {
            if (pthis)
            {
                pthis.stop();

                var target = pthis.target;
                if (target && target._is_alive)
                    pthis.callback.call(target, pthis.id);
                if (pthis.context && pthis.context._timerManager && !pthis.context._timerManager.deleteTimerItem(pthis))
                    pthis.destroy();
                pthis = null;
            }
        };
    };

    nexacro._OnceCallbackTimer = function (target, callback, interval)
    {
        var id = nexacro._CallbackTimerIdNo;
        nexacro._CallbackTimerIdNo++;
        this.id = id;
        this.target = target;
        this.context = target._getReferenceContext();
        this.callback = callback;
        this.interval = (interval | 0);

        // ----------- internal variable ------------- //
        this.handle = null;
        this._ontimer = nexacro._on_bindOnceCallbackTimerHandler(this);

        if (this.context._timerManager)
            this.context._timerManager.addTimer(this);
    };

    var __pOnceCallbackTimer = nexacro._createPrototype(nexacro.Object, nexacro._OnceCallbackTimer);
    nexacro._OnceCallbackTimer.prototype = __pOnceCallbackTimer;


    __pOnceCallbackTimer.setInterval = function (interval)
    {
        if (this.handle) this.stop();
        this.interval = interval;
    };
    __pOnceCallbackTimer.start = function ()
    {
        if (this.handle)
            this.stop();
        this.handle = nexacro._setSystemTimer(this.context._getWindowHandle(), this._ontimer, this.interval);
    };
    __pOnceCallbackTimer.stop = function ()
    {
        if (this.handle)
        {
            nexacro._clearSystemTimer(this.context._getWindowHandle(), this.handle);
            this.handle = null;
        }
    };
    __pOnceCallbackTimer.destroy = function ()
    {
        this.stop();
        this.target = null;
        this.context = null;
        this._ontimer = null;
    };

    nexacro._OnceCallbackTimer.callonce = function (target, callback, interval)
    {
        var timer = new nexacro._OnceCallbackTimer(target, callback, interval);
        timer.start();
        return timer;
    };
    //---------------------------------------------------------------------------------------
    // SysOnceCallbackTimer 
    // nexacro._OnceCallbackTimer를 사용할 수 없는 대상
    //---------------------------------------------------------------------------------------
    nexacro._on_no_bindOnceCallbackTimerHandler = function (pthis)
    {
        return function ()
        {
            if (pthis)
            {
                pthis.stop();

                var target = pthis.target;
                if (target && target._is_alive)
                {
                    pthis.callback.call(target, pthis.id);
                }

                pthis.destroy();
                pthis = null;
            }
        };
    };

    nexacro._SysOnceCallbackTimer = function (target, callback, interval)
    {
        var id = nexacro._CallbackTimerIdNo;
        nexacro._CallbackTimerIdNo++;
        this.id = id;
        this.target = target;
        this.callback = callback;
        this.interval = (interval | 0);

        // ----------- internal variable ------------- //
        this.handle = null;
        this._ontimer = nexacro._on_no_bindOnceCallbackTimerHandler(this);


    };

    var __pSysOnceCallbackTimer = nexacro._createPrototype(nexacro.Object, nexacro._SysOnceCallbackTimer);
    nexacro._SysOnceCallbackTimer.prototype = __pSysOnceCallbackTimer;


    __pSysOnceCallbackTimer.setInterval = function (interval)
    {
        if (this.handle) this.stop();
        this.interval = interval;
    };
    __pSysOnceCallbackTimer.start = function ()
    {

        if (this.handle)
            this.stop();
        this.handle = nexacro._setSystemTimer(nexacro._getWindowHandle(this.target.handle), this._ontimer, this.interval);
    };
    __pSysOnceCallbackTimer.stop = function ()
    {
        if (this.handle)
        {
            nexacro._clearSystemTimer(nexacro._getWindowHandle(this.target.handle), this.handle);
            this.handle = null;
        }
    };
    __pSysOnceCallbackTimer.destroy = function ()
    {
        this.stop();
        this.target = null;
        this._ontimer = null;
    };

    nexacro._SysOnceCallbackTimer.callonce = function (target, callback, interval)
    {
        var timer = new nexacro._SysOnceCallbackTimer(target, callback, interval);
        timer.start();
        return timer;
    };

    //---------------------------------------------------------------------------------------
    // AnimationFrame Object
    //---------------------------------------------------------------------------------------
    nexacro.AnimationFrame = function (comp, callback)
    {
        // 다음 Rendering frame에 Callback을 1회 수행한다.
        this._comp = comp;
        this._window = comp._getWindow();
        this.callback = callback;
        this._timer_interval = 1;
        this._timer = null;
    };

    var _pAnimationFrame = nexacro._createPrototype(nexacro.Object, nexacro.AnimationFrame);
    nexacro.AnimationFrame.prototype = _pAnimationFrame;


    _pAnimationFrame.start = function ()
    {
        if (nexacro._SupportAnimationFrame)
            this.id = nexacro._requestAnimationFrame(this._window, this.callback);
        else
        {
            this._timer = new nexacro._OnceCallbackTimer(this._comp, this.callback, this._timer_interval);
            this._timer.start();
        }
    };

    _pAnimationFrame.stop = function ()
    {
        if (nexacro._SupportAnimationFrame)
            nexacro._cancelAnimationFrame(this._window, this.id);
        else
        {
            if (this._timer)
                this._timer.stop();
        }
    };

    _pAnimationFrame.destroy = function ()
    {
        this.stop();
        this._comp = null;
        this._window = null;
        this.callback = null;
    };

    _pAnimationFrame._setCallback = function (callback)
    {
        this.callback = callback;
    };

    //---------------------------------------------------------------------------------------
    // AnimationFrame Object
    //---------------------------------------------------------------------------------------
    nexacro._ResizeManager = function (animationframe)
    {
        this._animationframe = animationframe;
        this._last_time = null;
        this._interval = 300;
    };

    var _pResizeManager = nexacro._createPrototype(nexacro.Object, nexacro._ResizeManager);
    nexacro._ResizeManager.prototype = _pResizeManager;

    _pResizeManager.setLastTime = function (v)
    {
        this._last_time = v;
    };

    _pResizeManager.start = function ()
    {
        if (this._animationframe)
        {
            this._animationframe.start();
        }
    };

    _pResizeManager.stop = function ()
    {
        if (this._animationframe)
        {
            this._animationframe.stop();
            this._animationframe = null;
        }
    };

    //---------------------------------------------------------------------------------------
    // LoadItem Object
    //---------------------------------------------------------------------------------------
    nexacro._LoadItem = function (url, type)
    {
        this.url = url;
        this.type = type;
        this.errorcode = 0;
        this.module = null;
        this.data = null;
        this.targets = [];

        // -------------- internal variable ----------------- //
        this.handle = null;
        this._bLoaded = false;
        this._context_callback = null;
        this._requrl = url;    // for transaction : url is transaction service id, _requrl is request url
        this._is_cancel = false;
        this._is_process = false;
    };
    var __pLoadItem = nexacro._createPrototype(nexacro.Object, nexacro._LoadItem);
    nexacro._LoadItem.prototype = __pLoadItem;

    __pLoadItem.addTarget = function (target)
    {
        var targets = this.targets;
        if (targets && nexacro._indexOf(targets, target) < 0)
        {
            targets.push(target);
            return true;
        }
        return false;
    };
    __pLoadItem.deleteTarget = function (target)
    {
        var targets = this.targets;
        var idx = nexacro._indexOf(targets, target);
        if (idx >= 0)
        {
            targets.splice(idx, 1);
            return true;
        }
        return false;
    };
    __pLoadItem.destroy = function ()
    {
        this.targets = null;
        this.handle = null;
        this._context_callback = null;
    };


    //---------------------------------------------------------------------------------------
    // LoadManager
    //---------------------------------------------------------------------------------------
    //
    // load Manager status
    //   0 : not init
    //   1 : loading main
    //   2 : end load main --> loading mandatory module : global, include, css
    //   3 : end loading mandatory : start init --> wait for preload list
    //   4 : end loading : on_load start
    //   preload는 component에 preload 옵션이 있는 component에 해당됨 (div, tabpage, dataset)
    nexacro._LoadManager = function (context)
    {
        this.context = context;
        this.status = 0;
        this.main_url = "";
        this.globalCnt = 0;
        this.globalList = [];
        this.localCnt = 0;
        this.localList = [];
        this.preloadCnt = 0;
        this.preloadList = [];
        this.dataCnt = 0;
        this.dataList = [];
        this.childlocalCnt = 0;
        this.transactionList = [];

        // ---------- internal variable ------------ //
        this._main_handle = null;
        this._is_mainloaded = false;
        this._use_transition_effect = false;
    };

    var __pLoadManager = nexacro._createPrototype(nexacro.Object, nexacro._LoadManager);
    nexacro._LoadManager.prototype = __pLoadManager;

    __pLoadManager.getGlobalItem = function (url)
    {
        var globals = this.globalList;
        var cnt = globals.length;
        for (var i = 0; i < cnt; i++)
        {
            var item = globals[i];
            if (item.url == url)
                return item;
        }
        return null;
    };
    __pLoadManager.getLocalItem = function (url)
    {
        var locals = this.localList;
        var cnt = locals.length;
        for (var i = 0; i < cnt; i++)
        {
            var item = locals[i];
            if (item.url == url)
                return item;
        }
        return null;
    };
    __pLoadManager.getDataItem = function (url)
    {
        var datas = this.dataList;
        var cnt = datas.length;
        for (var i = 0; i < cnt; i++)
        {
            var item = datas[i];
            if (item.url == url)
                return item;
        }
        return null;
    };

    __pLoadManager.getTransactionItem = function (url)
    {
        var transactions = this.transactionList;
        var cnt = transactions.length;
        for (var i = 0; i < cnt; i++)
        {
            var item = transactions[i];
            if (item.path == url)
                return item;
        }
        return null;
    };
    __pLoadManager.removeTransactionItem = function (url)
    {
        var transactions = this.transactionList;
        var cnt = transactions.length;
        for (var i = 0; i < cnt; i++)
        {
            var item = transactions[i];
            if (item.svcid == url)
            {
                for (var key in item.parameters)
                {
                    item.parameters[key].rval = ""; // check osm
                }

                transactions.splice(i, 1);
                break;
            }
        }
    };
    __pLoadManager.removeDataItem = function (url)
    {
        var datas = this.dataList;
        var cnt = datas.length;
        for (var i = 0; i < cnt; i++)
        {
            var item = datas[i];
            if (item.url == url)
            {
                datas.splice(i, 1);
                break;
            }
        }
    };
    __pLoadManager.getPreloadItem = function (type, url)
    {
        var preloads = this.preloadList;
        var cnt = preloads.length;
        for (var i = 0; i < cnt; i++)
        {
            var item = preloads[i];
            if (item.type == type && item.url == url)
                return item;
        }
        return null;
    };

    __pLoadManager.addPreloadItem = function (type, url, target, args, service)
    {
        var svcid = "";
        if (type == "data")
        {
            svcid = "__preload_" + ((typeof target) == "string" ? target : target.id);
            this.loadPreloadDataModule(url, target, false, false, svcid, args, service);
        }
        else if (type == "dataobject")
        {
            svcid = "__preload_" + ((typeof target) == "string" ? target : target.id);
            //this.loadPreloadDataModule(url, target, false, false, svcid, args, service);
            this.loadPreloadDataObjectModule(url, target, false, false, svcid, args, service);
        }
        else
        {
            this.loadPreloadJSModule(url, target, true, null, service);
        }
    };

    __pLoadManager.loadMainModule = function (url, cache, async, reload, service)
    {
        if (cache == null)
            cache = false;
        if (async == null)
            async = true;
        if (reload == null)
            reload = false;

        if (reload === true || this.main_url != url)
        {
            if (this._main_handle)
            {
                nexacro._cancelLoad(this._main_handle);
                this._main_handle = null;
            }
            this.main_url = url;
            this.status = 1;

            var parent_context = this.context.getParentContext();
            var ret = 0;
            while (parent_context)
            {
                //form/div content/div url 이 붙는 경우 preloadlist가 form에 있어서 검색 필요

                ret = parent_context._load_manager.getPreloadJSModule(url, this.context);
                if (ret === 0)
                {
                    parent_context = parent_context.getParentContext();
                }
                else
                    break;
            }

            if (ret === 0)
            {
                var handle = nexacro._loadModule("module", url, this, this.on_load_main, cache, service, async);
                if (async || this.status > 1) this._main_handle = handle;
            }
            else
            {
                return ret;  //preload
            }
        }
    };

    __pLoadManager.loadGlobalModule = function (url, cache, async, service)
    {
        if (async == null)
            async = true;
        if (this.status < 7)
        {
            var load_item = this.getGlobalItem(url);
            if (!load_item)
            {
                load_item = new nexacro._LoadItem(url, "globalmodule");
                this.globalList.push(load_item);
                this.globalCnt++;
                load_item.handle = nexacro._loadModule("text", url, this, this.on_load_globalmodule, cache, service, async);
            }
        }
    };

    __pLoadManager.loadGlobalJsonResource = function (url, cache, async, service)
    {
        if (async == null)
            async = true;
        if (this.status < 7)
        {
            var load_item = this.getGlobalItem(url);
            if (!load_item)
            {
                load_item = new nexacro._LoadItem(url, "json");
                this.globalList.push(load_item);
                this.globalCnt++;
                load_item.handle = nexacro._loadModule("json", url, this, this.on_load_globalmodule, cache, service, async);
            }
        }
    };


    __pLoadManager.loadIncludeModule = function (url, cache, async, service)
    {
        if (cache == null)
            cache = true;
        if (async == null)
            async = true;

        if (this.status <= 7)
        {
            var load_item = this.getLocalItem(url);
            var parent_context;
            if (!load_item)
            {
                load_item = new nexacro._LoadItem(url, "include");
                this.localList.push(load_item);
            }

            this.localCnt++;
            load_item.handle = nexacro._loadModule("module", url, this, this.on_load_localmodule, cache, service, async);

            // IE7 : cache로부터 load 할 경우 sync로 동작한다.
            if (!load_item._bLoaded)
            {
                parent_context = this.context.getParentContext();
                while (parent_context && parent_context._load_manager.status != 7)
                {
                    parent_context._load_manager.childlocalCnt++;
                    parent_context._load_manager.preloadCnt++;

                    parent_context = parent_context.getParentContext();
                }
            }
        }
    };

    // csstype - true : browser css (html/runtime)
    //          false : css js 
    // cssreq  - 0:themecss, 1:appcss
    __pLoadManager.loadCssModule = function (url, cache, async, service, csstype, cssreq)
    {
        if (cache == null)
            cache = true;
        if (async == null)
            async = true;

        if (this.status < 7)
        {
            var load_item = this.getLocalItem(url);
            if (!load_item)
            {
                load_item = new nexacro._LoadItem(url, "css");
                this.localList.push(load_item);

                this.localCnt++;

                if (csstype)
                    load_item.handle = nexacro._loadModule("css", url, this, this.on_load_localmodule, cache, service, async, cssreq);
                else
                    load_item.handle = nexacro._loadModule("module", url, this, this.on_load_localmodule, cache, service, async);
            }
        }
    };

    __pLoadManager.loadJSModule = function (url, cache, async, service)
    {
        if (cache == null)
            cache = true;
        if (async == null)
            async = true;

        if (this.status <= 7)
        {
            var load_item = this.getLocalItem(url);
            if (!load_item)
            {
                load_item = new nexacro._LoadItem(url, "text");
                this.localList.push(load_item);

                this.localCnt++;
                load_item.handle = nexacro._loadModule("module", url, this, this.on_load_localmodule, cache, service, async);
            }
        }
    };


    __pLoadManager.loadPreloadJSModule = function (url, target, cache, async, service)
    {
        if (cache == null)
            cache = false;
        if (async == null)
            async = true;

        if (this.status < 6)
        {
            var load_item = this.getPreloadItem("fdl", url);
            var parent_context;
            let newitem = false;
            if (!load_item)
            {
                load_item = new nexacro._LoadItem(url, "fdl");
                newitem = true;
            }

            if (target && load_item && load_item.addTarget(target) && !load_item._bLoaded)
            {
                this.preloadCnt++;
                parent_context = this.context.getParentContext();
                while (parent_context)
                {
                    if (!parent_context._is_created)
                        parent_context._load_manager.preloadCnt++;
                    parent_context = parent_context.getParentContext();
                }
            }

            if (newitem)
            {
                this.preloadList.push(load_item);
                load_item.handle = nexacro._loadModule("module", url, this, this.on_load_preloadjsmodule, cache, service, async);
            }
        }
    };

    __pLoadManager.loadPreloadDataModule = function (url, target, cache, async, svcid, args, service)
    {
        if (nexacro.isDesignMode) return;

        if (this.status < 6)
        {
            var load_item = this.getPreloadItem("data", svcid);
            if (load_item && target)
            {
                if (load_item.addTarget(target))
                {
                    this.preloadCnt++;
                }
            }
            else
            {
                var referer = "";
                if (this.context) referer = this.context._url;

                load_item = new nexacro._LoadItem(svcid, "data");
                load_item._requrl = url;

                if (target && load_item.addTarget(target))
                {
                    this.preloadCnt++;

                    this.preloadList.push(load_item);
                    load_item.handle = nexacro._preloadData(url, this, this.on_load_preloaddatamodule, service, svcid, referer, args, async, 0, false);
                }
            }
        }
    };

    __pLoadManager.loadPreloadDataObjectModule = function (url, target, cache, async, svcid, args, service)
    {
        if (nexacro.isDesignMode || nexacro._isDesignMode()) return;

        if (this.status < 6)
        {
            var load_item = this.getPreloadItem("dataobject", svcid);
            if (load_item && target)
            {
                if (load_item.addTarget(target))
                {
                    this.preloadCnt++;
                }
            }
            else
            {
                var referer = "";
                if (this.context) referer = this.context._url;

                load_item = new nexacro._LoadItem(svcid, "dataobject");
                load_item._requrl = url;

                if (target && load_item.addTarget(target))
                {
                    this.preloadCnt++;

                    this.preloadList.push(load_item);
                    load_item.handle = nexacro._preloadDataObject(url, this, this.on_load_preloaddataobjectmodule, service, svcid, referer, args, async, 0, false);
                }
            }
        }
    };

    __pLoadManager.loadDataModule = function (url, svcid, indatasets, outdatasets, parameters, callback, async, datatype, compress, service)
    {
        if (async == null)
            async = true;
        var load_item = this.getDataItem(svcid);
        if (!load_item)
        {
            load_item = new nexacro._LoadItem(svcid, "data");
            load_item._requrl = url;

            this.dataList.push(load_item);
            this.dataCnt++;
            load_item._context_callback = callback;
            load_item.handle = nexacro._loadData(url, this, this.on_load_datamodule, service, this.context, svcid, indatasets, outdatasets, parameters, async, datatype, compress);
        }
        else
        {
            // 비동기통신일때 동일한id로 여러번 transaction시 callback이 한번만 호출되는 현상
            this.context._onHttpTransactionError(this.context, true, this.context, "comm_fail_duplication_svcid", url, 10405, url, null, undefined, svcid);
        }
    };

    __pLoadManager.loadDataObjectModule = function (url, svcid, method, outdataobj, parameters, async, datatype, compress, service)
    {
        if (async == null)
            async = true;
        var load_item = this.getDataItem(svcid);
        if (!load_item)
        {
            load_item = new nexacro._LoadItem(svcid, "dataobject");
            load_item._requrl = url;

            this.dataList.push(load_item);
            this.dataCnt++;
            //load_item._context_callback = callback;
            load_item.handle = nexacro._loadDataObject(url, this, this.on_load_dataobjectmodule, service, this.context, svcid, method, outdataobj, parameters, async, datatype, compress);
        }
        else if (outdataobj)
        {
            // 비동기통신일때 동일한id로 여러번 transaction시 callback이 한번만 호출되는 현상
            outdataobj._onDataObjectRequestError(outdataobj, true, this.context, "comm_fail_duplication_svcid", url, 10405, url, null, undefined, "");
        }
    };

    __pLoadManager.reloadCssModule = function (url, cache, async, service, csstype, cssreq)
    {
        if (cache == null)
            cache = true;
        if (async == null)
            async = true;

        var load_item = this.getLocalItem(url);
        if (!load_item)
        {
            load_item = new nexacro._LoadItem(url, "css");
            this.localList.push(load_item);
        }

        this.localCnt++;

        if (csstype)
            load_item.handle = nexacro._loadModule("css", url, this, this.on_reload_localmodule, cache, service, async, cssreq);
        else
            load_item.handle = nexacro._loadModule("module", url, this, this.on_reload_localmodule, cache, service, async);
    };

    __pLoadManager.reloadJsonResource = function (url, cache, async, service)
    {
        if (cache == null)
            cache = true;
        if (async == null)
            async = true;

        let load_item = this.getLocalItem(url);
        if (!load_item)
        {
            load_item = new nexacro._LoadItem(url, "json");
            this.localList.push(load_item);
        }

        this.localCnt++;
        load_item.handle = nexacro._loadModule("json", url, this, this.on_load_json, cache, service, async);
    };

    //------------------------------------------------
    // load handlers
    //for error : errstatus, null, errormsgcode, returncode, requesturi, locationuri
    __pLoadManager.on_load_main = function (url, errstatus, module, fireerrorcode, returncode, requesturi, locationuri, extramsg)
    {
        if (url == this.main_url)
        {
            this.status = 2;
            this._main_handle = null;
            this._is_mainloaded = false;
            if (errstatus === 0 && module && typeof (module) == "function")
            {
                if (nexacro._Browser == "Runtime")
                {
                    if (module.bcache)
                    {
                        var refs = module.refs | 0;
                        module.refs = refs + 1;
                    }
                }

                // sync 일때는 preload를 하지 않는다.
                // NP17 Div는 InnerForm을 context로 가지므로 parent 객체 접근 
                if (this.context.parent && this.context.parent.async === false && this.context.parent._type_name == "Div")
                {
                    this.context._addPreloadList = nexacro._emptyFn;
                }
                module.call(this.context, ...nexacro.__getProcessExportArgs(this.context));
            }
            else
            {
                // adl 
                const application = this.context._getApplication ? this.context._getApplication() : undefined;
                if (application)
                {
                    if (this.context == application)
                    {
                        nexacro._onHttpSystemError(this.context, true, this.context, "comm_fail_loadinvalidurl", url, returncode, requesturi, locationuri, extramsg);
                        return;
                    }
                    else
                    {
                        // if (this.context && this.context.parent && this.context.parent._is_frame)
                        //{
                        // main form
                        //  var child_frame = this.context.parent;
                        //  child_frame._is_loadform_failed = true;                    	
                        if (this.context)
                            this.context._onHttpSystemError(this.context, true, this.context, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
                        //}
                        nexacro._onHttpSystemError(this.context, true, this.context, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
                    }
                }
                else
                    nexacro._onHttpSystemError(this.context, true, this.context, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);

            }

            this._is_mainloaded = true;
            this._check_fire_oninit();
        }
    };

    __pLoadManager.on_load_localmodule = function (url, errstatus, module, fireerrorcode, returncode, requesturi, locationuri, extramsg)
    {
        var load_Item = this.getLocalItem(url);
        if (load_Item)
        {
            //var handle = load_Item.handle;
            load_Item.handle = null;
            if (errstatus === 0)
            {
                if (module)
                {
                    if (typeof (module) == "function")
                    {
                        if (load_Item.type == "include")
                        {
                            load_Item._bLoaded = true;

                            if (nexacro._Browser == "Runtime")
                            {
                                if (module.bcache)
                                {
                                    var refs = module.refs | 0;
                                    module.refs = refs + 1;
                                }
                            }
                            module.call(this.context, load_Item.url, ...nexacro.__getProcessExportArgs(this.context));
                            load_Item.module = null;
                        }
                        else
                        {
                            load_Item.module = module;
                        }
                    }
                    else 
                    {
                        load_Item._bLoaded = true;
                        load_Item.module = module;
                    }
                }
                else if (load_Item.type == "css")
                {
                    load_Item._bLoaded = true;
                }
                else
                {
                    load_Item.errcode = errstatus;
                    nexacro._onHttpSystemError(this.context, true, this.context, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
                }
            }
            else
            {
                load_Item.errcode = errstatus;
                nexacro._onHttpSystemError(this.context, true, this.context, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
            }

            this.localCnt--;
            this._check_fire_oninit();  // _check_fire_oninit()
            nexacro._log_tr = "";
            // sync 인 경우 handle 이 없다.
            if (this.context)
            {
                var parent_context = this.context.getParentContext();
                while (parent_context && parent_context._load_manager.childlocalCnt > 0)
                {

                    parent_context._load_manager.childlocalCnt--;
                    parent_context._load_manager.preloadCnt--;
                    parent_context._load_manager._check_fire_onload();
                    parent_context = parent_context.getParentContext();
                }
            }
            return;
        }
    };

    __pLoadManager.on_load_globalmodule = function (url, errstatus, module, fireerrorcode, returncode, requesturi, locationuri, extramsg)
    {
        var load_Item = this.getGlobalItem(url);
        if (!load_Item) return;

        load_Item.handle = null;
        let type = load_Item.type;

        if (errstatus === 0)
        {
            if (module && type == "json")
            {
                try
                {
                    load_Item._bLoaded = true;
                    // load_Item.data = module;  //?? check!!
                    if (module[nexacro._StringResourceLang])
                        nexacro._StringResource = module[nexacro._StringResourceLang];
                    else if (url && url.indexOf("_resource_/_stringrc_/") > -1)
                    {
                        nexacro._StringResourceLang = "en";
                        if (module[nexacro._StringResourceLang])
                            nexacro._StringResource = module[nexacro._StringResourceLang];
                        else
                            nexacro._onHttpSystemError(this.context, true, this.context, "comm_fail_loaddetail_stringresource", url, 10598, requesturi, locationuri/*, extramsg*/);
                    }
                    else
                        nexacro._onHttpSystemError(this.context, true, this.context, "comm_fail_loaddetail_stringresource", url, 10598, requesturi, locationuri/*, extramsg*/);

                }
                catch (e)
                {
                    this.globalCnt--;
                    nexacro._executeScript(load_Item.data, load_Item.url);
                }
            }
            else if (type == "globalmodule" && module !== "")
            {
                load_Item.data = module;
            }
        }
        else
        {
            load_Item.errcode = errstatus;
            nexacro._onHttpSystemError(this.context, true, this.context, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
        }
        this.globalCnt--;
        this._check_fire_oninit();
    };

    __pLoadManager.on_load_json = function (url, errstatus, module, fireerrorcode, returncode, requesturi, locationuri, extramsg)
    {
        if (errstatus === 0)
        {
            if (module)
            {
                try
                {
                    if (module[nexacro._StringResourceLang])
                    {
                        nexacro._StringResource = module[nexacro._StringResourceLang];
                    }
                    else if (url && url.indexOf("_resource_/_stringrc_/") > -1)
                    {
                        nexacro._StringResourceLang = "en";
                        if (module[nexacro._StringResourceLang])
                            nexacro._StringResource = module[nexacro._StringResourceLang];
                        else
                        {
                            nexacro._onHttpSystemError(this.context, true, this.context, "comm_fail_loaddetail_stringresource", url, 10598, requesturi, locationuri/*, extramsg*/);
                        }
                    }
                    else
                    {
                        nexacro._onHttpSystemError(this.context, true, this.context, "comm_fail_loaddetail_stringresource", url, 10598, requesturi, locationuri/*, extramsg*/);
                    }
                }
                catch (e)
                {
                    (new Function("return " + module))();
                }
            }
        }
        else
        {
            nexacro._onHttpSystemError(this.context, true, this.context, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
        }
        this.localCnt--;
    };

    __pLoadManager.on_reload_localmodule = function (url, errstatus, module, fireerrorcode, returncode, requesturi, locationuri, extramsg)
    {
        var load_Item = this.getLocalItem(url);
        if (load_Item)
        {
            load_Item.handle = null;
            if (errstatus === 0)
            {
                if (module)
                {
                    if (typeof (module) == "function")
                    {
                        load_Item._bLoaded = true;

                        if (nexacro._Browser == "Runtime")
                        {
                            if (module.bcache)
                            {
                                var refs = module.refs | 0;
                                module.refs = refs + 1;
                            }
                        }
                        module.call(this.context, load_Item.url, ...nexacro.__getProcessExportArgs(this.context));
                        load_Item.module = null;
                    }
                    else
                    {
                        load_Item._bLoaded = true;
                        load_Item.module = module;
                    }
                }
                else if (load_Item.type == "css")
                {
                    load_Item._bLoaded = true;
                }
                else
                {
                    load_Item.errcode = errstatus;
                    nexacro._onHttpSystemError(this.context, true, this.context, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
                }
            }
            else
            {
                load_Item.errcode = errstatus;
                nexacro._onHttpSystemError(this.context, true, this.context, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
            }

            this.localCnt--;
            this._check_fire_oninit();  // _check_fire_oninit()
            nexacro._log_tr = "";
            // sync 인 경우 handle 이 없다.
            // childlocalCnt++, preloadCnt++ 코딩이 없어 삭제
            // var parent_context = this.context.getParentContext();
            // while (parent_context && parent_context._load_manager.childlocalCnt > 0)
            // {

            //     parent_context._load_manager.childlocalCnt--;
            //     parent_context._load_manager.preloadCnt--;
            //     parent_context._load_manager._check_fire_onload();

            //     parent_context = parent_context.getParentContext();
            // }            
        }
    };

    __pLoadManager.on_load_preloadjsmodule = function (url, errstatus, module, fireerrorcode, returncode, requesturi, locationuri, extramsg)
    {
        var load_Item = this.getPreloadItem("fdl", url);
        if (load_Item)
        {
            load_Item.errcode = errstatus;
            load_Item.module = module;
            load_Item.handle = null;
            load_Item._bLoaded = true;
            var targets = load_Item.targets;
            var target_len = targets.length;
            if (target_len > 0)
            {
                for (var i = 0; i < target_len; i++)
                {
                    if (this.context._p_components)
                    {
                        var target = targets[i];
                        if ((typeof target) == "string")
                        {
                            target = this.context._p_components[target];
                        }
                        if (target)
                        {
                            target._load_manager.on_load_main(url, errstatus, module, fireerrorcode, returncode, requesturi, locationuri, extramsg);
                        }
                    }
                }

                targets.splice(0, target_len);
                this.preloadCnt -= target_len;
                this._check_fire_onload();

                var parent_context = this.context.getParentContext();
                while (parent_context && parent_context._load_manager.preloadCnt > 0)
                {
                    parent_context._load_manager.preloadCnt -= target_len;
                    parent_context._load_manager._check_fire_onload();
                    parent_context = parent_context.getParentContext();
                }
            }
        }
    };

    __pLoadManager.on_load_preloaddatamodule = function (url, errstatus, data, fireerrorcode, returncode, requesturi, locationuri, extramsg)
    {
        this.on_load_preloaddata_module(1, url, errstatus, data, fireerrorcode, returncode, requesturi, locationuri, extramsg);
    };

    __pLoadManager.on_load_preloaddataobjectmodule = function (url, errstatus, data, fireerrorcode, returncode, requesturi, locationuri, extramsg)
    {
        this.on_load_preloaddata_module(2, url, errstatus, data, fireerrorcode, returncode, requesturi, locationuri, extramsg);
    };

    //type 1 : "data", 2 : "dataobject"
    __pLoadManager.on_load_preloaddata_module = function (type, url, errstatus, data, fireerrorcode, returncode, requesturi, locationuri, extramsg)
    {
        let fn = (type == 1 ? "on_preload_data" : "on_preload_dataobject");
        let itemtype = (type == 1 ? "data" : "dataobject");

        var load_Item = this.getPreloadItem(itemtype, url);
        if (load_Item)
        {
            load_Item.errcode = errstatus;
            load_Item.data = data;
            load_Item.handle = null;
            load_Item._bLoaded = true;
            var targets = load_Item.targets;
            var target_len = targets.length;

            if (target_len > 0)
            {
                for (var i = 0; i < target_len; i++)
                {
                    if (this.context._p_all)
                    {
                        var target = targets[i];
                        if ((typeof target) == "string")
                        {
                            target = this.context._p_all[target];
                        }
                        if (target && target[fn])
                        {
                            target[fn](load_Item._requrl, errstatus, data, fireerrorcode, returncode, load_Item._requrl, locationuri, extramsg);
                        }
                    }
                }

                targets.splice(0, target_len);
                this.preloadCnt -= target_len;
            }
            this._check_fire_onload();
        }
    };

    __pLoadManager.on_load_datamodule = function (svcid, errstatus, message, fireerrorcode, returncode, requesturi, locationuri, extramsg)
    {
        this.on_load_data_module(1, svcid, errstatus, message, fireerrorcode, returncode, requesturi, locationuri, extramsg);
    };

    __pLoadManager.on_load_dataobjectmodule = function (svcid, errstatus, message, fireerrorcode, returncode, requesturi, locationuri, extramsg, dataobj, response, responseheaders)
    {
        this.on_load_data_module(2, svcid, errstatus, message, fireerrorcode, returncode, requesturi, locationuri, extramsg, dataobj, response, responseheaders);
    };

    //type 1 : "data", 2 : "dataobject"
    __pLoadManager.on_load_data_module = function (type, svcid, errstatus, message, fireerrorcode, returncode, requesturi, locationuri, extramsg, dataobj, response, responseheaders)
    {
        var load_Item = this.getDataItem(svcid);
        if (load_Item)
        {
            var callback_id = load_Item._context_callback;
            var callback_func = this.context[callback_id];

            //받은 데이타가 아무것도 없을때는 callback만 호출됨
            var ret = false;
            if (errstatus < 0 && fireerrorcode)
            {
                load_Item.errcode = errstatus;
                if (fireerrorcode != "comm_cancel_byuser" || fireerrorcode != "comm_stop_transaction_byesc" ||
                    load_Item._is_cancel || !load_Item.handle || (load_Item.handle && !load_Item.handle._user_aborted && load_Item.handle._user_aborted !== undefined))
                {
                    if (dataobj && type == 2)
                        ret = dataobj._onDataObjectRequestError(dataobj, true, dataobj, fireerrorcode, requesturi, returncode, requesturi, locationuri, extramsg, svcid, response, responseheaders);
                    else
                        ret = this.context._onHttpTransactionError(this.context, true, this.context, fireerrorcode, requesturi, returncode, requesturi, locationuri, extramsg, svcid);

                    if (fireerrorcode != "comm_cancel_byuser" && fireerrorcode != "comm_stop_transaction_byesc")
                        ret = false;

                    if (ret) return true;
                }
            }

            if (fireerrorcode == "comm_cancel_byuser" || fireerrorcode == "comm_stop_transaction_byesc")
            {
                // handle이 없는경우는 async=false일때
                //            	if (ret && load_Item.handle && !load_Item.handle._user_aborted && load_Item.handle._user_aborted !== undefined)
                //                    return ret;
                if (load_Item._is_cancel !== undefined && !load_Item._is_cancel)
                    return ret;
            }

            //callback 함수내에서 같은 service 호출하는 경우
            this.removeDataItem(svcid);
            this.removeTransactionItem(svcid);
            this.dataCnt--;

            if (callback_func && typeof (callback_func) == "function")
            {
                callback_func.call(this.context, svcid, errstatus, message);
                if (errstatus === 0)
                {
                    load_Item.handle = null;
                }
            }

            return ret;
        }
    };

    __pLoadManager.getPreloadJSModule = function (url, child)
    {
        var load_Item = this.getPreloadItem("fdl", url);
        if (load_Item)
        {
            if (load_Item._bLoaded)
            {
                child._load_manager.on_load_main(url, load_Item.errcode, load_Item.module);
                return 2;
            }
            else
            {
                if (load_Item.addTarget(child))
                {
                    this.preloadCnt++;
                    var parent_context = this.context.getParentContext();
                    while (parent_context && parent_context._load_manager.status < 6)
                    {
                        parent_context._load_manager.preloadCnt++;
                        parent_context = parent_context.getParentContext();
                    }
                }
                return 1;
            }
        }
        return 0;
    };
    __pLoadManager.getPreloadDataModule = function (id)
    {
        var svcid = "__preload_" + id;
        var load_Item = this.getPreloadItem("data", svcid);
        if (load_Item && load_Item._bLoaded)
        {
            return load_Item.data;
        }
    };

    __pLoadManager.getPreloadDataObjectModule = function (id)
    {
        var svcid = "__preload_" + id;
        var load_Item = this.getPreloadItem("dataobject", svcid);
        if (load_Item && load_Item._bLoaded)
        {
            return load_Item.data;
        }
    };

    __pLoadManager._check_fire_oninit = function ()
    {
        if (this.status < 2 || !this._is_mainloaded)
            return false;

        var cnt, i, item;
        if (this.status == 2)
        {
            //deleted unused updateList            
            this.status = 3;
        }

        if (this.status == 3)
        {
            if (this.globalCnt > 0)
                return false;
            else
            {
                cnt = this.globalList.length;
                for (i = 0; i < cnt; i++)
                {
                    item = this.globalList[i];
                    if (item._bLoaded === false)
                    {
                        item._bLoaded = true;
                        if (item.errorcode >= 0 && item.type != "json")
                        {
                            nexacro._executeScript(item.data, item.url);
                            item.data = null;
                        }
                    }
                }
                this.status = 4;
            }
        }

        if (this.status == 4)
        {
            if (this.localCnt > 0)
                return false;
            else
            {
                cnt = this.localList.length;
                for (i = 0; i < cnt; i++)
                {
                    item = this.localList[i];
                    if (item._bLoaded === false)
                    {
                        item._bLoaded = true;
                        if (item.errorcode >= 0)
                        {
                            if (item.type != "include" && item.module)
                            {
                                if (nexacro._Browser == "Runtime")
                                {
                                    if (item.module.bcache)
                                    {
                                        var refs = item.module.refs | 0;
                                        item.module.refs = refs + 1;
                                    }
                                }
                                item.module.call(this.context, ...nexacro.__getProcessExportArgs(this.context));
                            }

                            item.module = null;
                        }

                    }
                }
                this.status = 5;
            }
        }


        // fire oninit & _check_fire_obload
        if (this.status == 5 && this.context)
        {
            // this function defined by compiler for ADL/FDL
            // create child Objects & Components
            this.context._on_init();
            this._check_fire_onload();
        }
    };

    __pLoadManager._check_fire_onload = function ()
    {
        if (this.status < 5 || !this._is_mainloaded)
            return;

        if (this.status == 5)
        {
            if (this.preloadCnt > 0)
                return false;
            else
            {
                //preload load               
                this.status = 6;
            }
        }

        if (this.status == 6)
        {
            //preload의 include count를 누적해서 가지고 있다.
            if (this.childlocalCnt > 0)
                return false;
            else
                this.status = 7;
        }

        //this.status = 5;
        // fire onload
        if (this.status == 7 && this.context)
        {
            var context = this.context;
            if (!context.parent || !context.parent._is_component) // application
                context._on_load(context, this.main_url);
            else
            {
                if (!context.parent._is_frame || context.parent._is_created)
                    context._on_load(context, this.main_url);

                // frame을 init만 한 상태에서 form이 로딩 f완료 될 경우, 
                // frame이 created 처리 될 때 form onload도 같이 처리한다.
            }

            // clear preload datamodule
            this.clearPreload("data");
        }
    };

    __pLoadManager.clearAllLoad = function ()
    {
        if (this._main_handle)
        {
            nexacro._cancelLoad(this._main_handle, this.main_url);
            this._main_handle = null;
        }
        var cache, module, refs;
        if (nexacro._Browser == "Runtime")
        {
            cache = nexacro._CacheList[this.main_url];
            if (cache)
            {
                module = cache.data;
                if (typeof (module) == "function" && module.bcache)
                {
                    refs = module.refs | 0;
                    if (refs > 0) refs = --module.refs;
                    if (refs == 0)
                        delete nexacro._CacheList[this.main_url];
                }
            }
        }

        this._is_mainloaded = false;

        var globals = this.globalList;
        var gcnt = globals.length;
        for (let i = 0; i < gcnt; i++)
        {
            var globalitem = globals[i];
            if (globalitem.handle)
                nexacro._cancelLoad(globalitem.handle);
            globalitem.destroy();
        }
        globals.splice(0, gcnt);

        var locals = this.localList;
        var lcnt = locals.length;
        for (let i = 0; i < lcnt; i++)
        {
            var localitem = locals[i];
            if (localitem.handle)
                nexacro._cancelLoad(localitem.handle, localitem.url);

            if (nexacro._Browser == "Runtime")
            {
                cache = nexacro._CacheList[localitem.url];
                if (cache)
                {
                    module = cache.data;
                    if (typeof (module) == "function" && module.bcache)
                    {
                        refs = module.refs | 0;
                        if (refs > 0) refs = --module.refs;
                        if (refs == 0)
                            delete nexacro._CacheList[localitem.url];
                    }
                }
            }

            localitem.destroy();
        }
        locals.splice(0, lcnt);

        var preloads = this.preloadList;
        var pcnt = preloads.length;
        for (let i = 0; i < pcnt; i++)
        {
            var preloaditem = preloads[i];
            if (preloaditem.handle)
                nexacro._cancelLoad(preloaditem.handle);
            preloaditem.destroy();
        }
        preloads.splice(0, pcnt);

        var datas = this.dataList;
        var dcnt = datas.length;
        for (let i = 0; i < dcnt; i++)
        {
            var dataitem = datas[i];
            if (dataitem.handle)
                nexacro._cancelLoad(dataitem.handle);
            dataitem.destroy();
        }
        datas.splice(0, dcnt);

        var trs = this.transactionList;
        var tcnt = trs.length;
        for (let i = 0; i < tcnt; i++)
        {
            var titem = trs[i];
            if (titem)
                titem._hideWaitCursor(this.context);

        }
        trs.splice(0, tcnt);

    };

    __pLoadManager.clearPreload = function (type)
    {
        var preloads = this.preloadList;
        var pcnt = preloads.length;
        for (var i = pcnt - 1; i > 0; i--)
        {
            var preloaditem = preloads[i];
            if (preloaditem.handle && (!type || type == preloaditem.type))
            {
                nexacro._cancelLoad(preloaditem.handle);
                if (type)
                {
                    preloads.splice(i, 1);
                }
                preloaditem.destroy();
            }
        }

        if (!type)
        {
            preloads.splice(0, pcnt);
        }
    };

    __pLoadManager.destroy = function ()
    {
        this.clearAllLoad();
        this.context = null;
    };



    //---------------------------------------------------------------------------------------
    // ComponentItem Object
    //---------------------------------------------------------------------------------------
    nexacro._ComponentItem = function (name, type, classname, moduleurl, version)
    {
        this.name = name;
        this.type = type;
        this.classname = classname;
        this.moduleurl = moduleurl;
        this.version = version | "0.0";
    };
    var __pComponentItem = nexacro._createPrototype(nexacro.Object, nexacro._ComponentItem);
    nexacro._ComponentItem.prototype = __pComponentItem;


    //---------------------------------------------------------------------------------------
    // UpdateItem Object
    //---------------------------------------------------------------------------------------
    nexacro._UpdateItem = function (type, moduleurl, targetpath, ref, version, desc, failpass)
    {
        // this.id = id;
        this.type = type;
        this.file = moduleurl;
        this.targetpath = targetpath;
        this.ref = ref;
        this.version = version;
        this.desc = desc;
        this.failpass = failpass;

    };
    var __pUpdateItem = nexacro._createPrototype(nexacro.Object, nexacro._UpdateItem);
    nexacro._UpdateItem.prototype = __pUpdateItem;

    //---------------------------------------------------------------------------------------
    // Layout Object
    //---------------------------------------------------------------------------------------
    nexacro.Layout = function (name, screenid, w, h, obj, changefn) //, recoverfn)
    {
        this._p_name = name;
        this._p_screenid = screenid;
        this._p_width = w;
        this._p_height = h;
        this._form = obj;
        this.change_fn = changefn;
        //this.recover_fn = recoverfn;

        this._contents_max_rect = [0, 0];
    };

    var _pLayout = nexacro._createPrototype(nexacro.Object, nexacro.Layout);
    nexacro.Layout.prototype = _pLayout;
    _pLayout._type_name = "Layout";
    _pLayout._p_stepcount = 0;
    _pLayout._p_stepindex = 0;
    _pLayout._p_mobileorientation = ""; //설정값이 없으면 모든 경우에 선택대상   'portrait', 'landscape', ""

    // Fluid Layout
    _pLayout._p_type = "default";
    _pLayout._p_spacing = "";
    _pLayout._p_horizontalgap = undefined;
    _pLayout._p_verticalgap = undefined;

    _pLayout._p_flexwrap = "nowrap";
    _pLayout._p_flexmainaxisalign = "start";
    _pLayout._p_flexcrossaxisalign = "start";
    _pLayout._p_flexcrossaxiswrapalign = "start";

    _pLayout._p_tabletemplate = "1* / 1*";
    _pLayout._p_tabletemplatearea = "";
    _pLayout._p_tabledirection = "horizontal";
    _pLayout._p_tablecellalign = "start start";
    _pLayout._p_tablecellincompalign = "start start";
    _pLayout._p_tablecellmovingtype = "autofill";
    _pLayout._is_created = false;
    _pLayout._max_contents_width = 0;
    _pLayout._max_contents_height = 0;

    _pLayout._prop_map_layoutalign_basic = ["start", "center", "end"];
    _pLayout._prop_map_layoutalign_space = ["spacebetween", "spacearound", "spaceevenly"];

    _pLayout.destroy = function ()
    {
        this._p_name = "";
        this._p_screenid = "";
        this._p_description = "";
        this.context = null;
        this._p_width = 0;
        this._p_height = 0;
        this._form = null;
        this.change_fn = null;
        //this.recover_fn = null;
        this._p_stepcount = 0;
        this._p_stepindex = 0;
        this._p_mobileorientation = undefined;

        // Fluid Layout
        this._p_type = "";
        this._p_spacing = "";
        this._p_horizontalgap = undefined;
        this._p_verticalgap = undefined;

        this._p_flexwrap = "";
        this._p_flexmainaxisalign = "";
        this._p_flexcrossaxisalign = "";
        this._p_flexcrossaxiswrapalign = "";

        this._p_tabletemplate = "";
        this._p_tabletemplatearea = "";
        this._p_tabledirection = "";
        this._p_tablecellalign = "";
        this._p_tablecellincompalign = "";
        this._p_tablecellmovingtype = "autofill";

        this._prop_map_layoutalign_basic = null;
        this._prop_map_layoutalign_space = null;
    };

    _pLayout.set_initvalueid = function (initvalueid)
    {
        if (!this._is_created)
        {
            this._p_initvalueid = initvalueid;

            const fn = this._type_name + initvalueid;
            const nexacro_init = nexacro.getNexacro_init();
            if (nexacro_init[fn])
                nexacro_init[fn].call(this, this);
        }
    };


    _pLayout.set_name = function (v)
    {
        this._p_name = v;
    };

    _pLayout.set_screenid = function (v)
    {
        this._p_screenid = v;
    };

    _pLayout.set_description = function (v)
    {
        this._p_description = v;
    };

    _pLayout.set_width = function (v)
    {
        this._p_width = v;
    };

    _pLayout.set_height = function (v)
    {
        this._p_height = v;
    };

    _pLayout.set_stepcount = function (v)
    {
        if (this._p_type != "default")
            return;

        v = parseInt(v) | 0;
        if (v !== this._p_stepcount)
        {
            this._p_stepcount = v;
        }
    };

    _pLayout.set_stepindex = function (v)
    {
        v = parseInt(v) | 0;
        if (v != this._p_stepindex && v < this._p_stepcount)
        {
            this._p_stepindex = v;
        }
    };

    _pLayout.set_mobileorientation = function (v)
    {
        this._p_mobileorientation = v;
    };

    // Fluid Layout Setter
    _pLayout.set_type = function (v)
    {
        if (this._p_stepcount > 0)
        {
            this._p_type = "default";
            return;
        }

        var type_enum = ["default", "horizontal", "vertical", "table"];
        if (type_enum.indexOf(v) == -1)
        {
            v = "default";
        }

        if (this._p_type != v)
        {
            this._p_type = v;
        }
    };

    _pLayout.set_spacing = function (v)
    {
        this._p_spacing = v;
        this._spacing = new nexacro.PaddingObject(v);
    };

    _pLayout.set_horizontalgap = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v) || v < 0)
            {
                return;
            }
        }

        if (this._p_horizontalgap != v)
        {
            this._p_horizontalgap = v;
        }
    };

    _pLayout.set_verticalgap = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v) || v < 0)
            {
                return;
            }
        }

        if (this._p_verticalgap != v)
        {
            this._p_verticalgap = v;
        }
    };


    _pLayout.set_flexwrap = function (v)
    {
        var wrap_enum = ["nowrap", "wrap"];
        if (wrap_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_flexwrap != v)
        {
            this._p_flexwrap = v;
        }
    };

    _pLayout.set_flexmainaxisalign = function (v)
    {
        var align_enum = this._prop_map_layoutalign_basic.concat(this._prop_map_layoutalign_space);
        if (align_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_flexmainaxisalign != v)
        {
            this._p_flexmainaxisalign = v;
        }
    };

    _pLayout.set_flexcrossaxisalign = function (v)
    {
        var align_enum = this._prop_map_layoutalign_basic;
        if (align_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_flexcrossaxisalign != v)
        {
            this._p_flexcrossaxisalign = v;
        }
    };

    _pLayout.set_flexcrossaxiswrapalign = function (v)
    {
        var align_enum = this._prop_map_layoutalign_basic.concat(this._prop_map_layoutalign_space);
        if (align_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_flexcrossaxiswrapalign != v)
        {
            this._p_flexcrossaxiswrapalign = v;
        }
    };


    _pLayout.set_tabletemplate = function (v)
    {
        if (v && this._p_tabletemplate != v)
        {
            this._p_tabletemplate = v;
            this.on_apply_tabletemplate(v);
        }
    };
    _pLayout._setDefaultTabletemplate = function (v)
    {
        this._tabletemplate = v;
    };

    _pLayout.on_apply_tabletemplate = function (v)
    {
        v = v ? v : this._p_tabletemplate;
        if (!this._tabletemplate)
            this._tabletemplate = v;
        if (nexacro._isDesignMode())
            return;
        if (v)// && this.tablecellmovingtype && this.tablecellmovingtype != "none")
        {
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                var current_layout = manager.getCurrentLayout(this._form);
                if (!current_layout) return;
                var current_layout_name = current_layout._p_name;
                if (current_layout_name != this._p_name)
                    return;

                var fluidLayoutmanager = manager._fluidlayoutmanager;
                if (fluidLayoutmanager)
                {
                    var _form = this._form;
                    if (_form)
                    {
                        //check
                        if (nexacro._isDesignMode())
                        {
                            fluidLayoutmanager._prev_tabletemplate = this._tabletemplate;
                        }
                        else
                        {
                            var control_element = _form.getElement();
                            if (control_element)
                                control_element.setElementTableTemplate(v);
                            fluidLayoutmanager._prev_tabletemplate = this._tabletemplate; //this._prev_tabletemplate ? this._prev_tabletemplate : this._tabletemplate;
                        }
                        _form._is_changed_tabletemplate = true;
                        manager.calcFluidLayoutContents(_form);
                        _form._is_changed_tabletemplate = false;
                        //if (!nexacro._isDesignMode())// && current_layout_name ==this.name)
                        //    this._tabletemplate = v;
                    }
                }
            }
        }
    };

    _pLayout.set_tabletemplatearea = function (v)
    {
        this._p_tabletemplatearea = v;
    };

    _pLayout.set_tablecellmovingtype = function (v)
    {
        var type_enum = ["none", "autofit", "autofill"];
        if (type_enum.indexOf(v) == -1)
        {
            return;
        }
        this._p_tablecellmovingtype = v;
        //this.on_apply_tablecellmovingtype();
    };
    /*
    _pLayout.on_apply_tablecellmovingtype = function (v)
    {
        if (this.tablecellmovingtype && this.tablecellmovingtype != "none" && nexacro._isDesignMode())
        {
            this.on_apply_tabletemplate();
        }
    };
    */
    _pLayout.set_tabledirection = function (v)
    {
        var direction_enum = ["horizontal", "vertical"];
        if (direction_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_tabledirection != v)
        {
            this._p_tabledirection = v;
        }
    };


    _pLayout.set_tablecellalign = function (v)
    {
        this._p_tablecellalign = v;
    };

    _pLayout.set_tablecellincompalign = function (v)
    {
        this._p_tablecellincompalign = v;
    };

    _pLayout._setLayoutContentsMaxRect = function (w, h)
    {
        this._contents_max_rect = [w, h];
    };

    _pLayout._getLayoutContentsMaxRect = function ()
    {
        return this._contents_max_rect;
    };

    _pLayout._setLayoutFitContentsMaxRect = function (w, h)
    {
        this._fit_contents_max_rect = [w, h];
    };
    _pLayout._getLayoutFitContentsMaxRect = function ()
    {
        return this._fit_contents_max_rect;
    };

    _pLayout._properties = [{ name: "description" }, { name: "flexcrossaxisalign" }, { name: "flexcrossaxiswrapalign" }, { name: "flexmainaxisalign" }, { name: "flexwrap" }, { name: "height" }, { name: "horizontalgap" }, { name: "initvalueid" }, { name: "mobileorientation" }, { name: "name" }, { name: "screenid" }, { name: "spacing" }, { name: "stepcount" }, { name: "stepindex" }, { name: "tablecellalign" }, { name: "tablecellincompalign" }, { name: "tablecellmovingtype" }, { name: "tabledirection" }, { name: "tabletemplate" }, { name: "tabletemplatearea" }, { name: "type" }, { name: "verticalgap" }, { name: "width" }];
    nexacro._defineProperties(_pLayout, _pLayout._properties);

    // TODO LAYOUT 신규 매니저 작업
    //==============================================================================
    // nexacro._LayoutManager
    //==============================================================================
    nexacro._LayoutManager = function (useMulti, useStep, useFluid)
    {
        if (useMulti)
            this.initMultiLayoutManager();

        if (useStep)
            this.initStepLayoutManager();

        if (useFluid)
            this.initFluidLayoutManager();

        this.container_info = [];
    };
    var __pLayoutManager = nexacro._createPrototype(nexacro.Object, nexacro._LayoutManager);
    nexacro._LayoutManager.prototype = __pLayoutManager;
    __pLayoutManager._type_name = "LayoutManager";

    // common layout API
    __pLayoutManager.addLayoutList = function (objContainer, objLayout)
    {
        // screenid과 통일한것만 추가할지는 추적검토
        var layout_list = this.getLayoutList(objContainer);
        if (layout_list)
        {
            var item = layout_list.get_item(objLayout._p_name);
            if (item && objLayout._p_width < 11) //timing problem //DesignForm
                return;
            layout_list.add_item(objLayout._p_name, objLayout);
        }
    };
    __pLayoutManager.updateLayoutList = function (objContainer, layoutname, propval)
    {
        var layout_list = this.getLayoutList(objContainer);
        if (layout_list)
        {
            var idx = layout_list.indexOf(layoutname);
            layout_list.update_id(idx, propval);
        }
    }
    __pLayoutManager.getLayoutList = function (objContainer)
    {
        var container_info = this._findContainerInfo(objContainer);
        if (container_info)
        {
            return container_info.layout_list;
        }
    };

    __pLayoutManager.getLayout = function (objContainer, strLayoutName)
    {
        var container_info = this._findContainerInfo(objContainer);
        if (container_info)
        {
            if (!strLayoutName || strLayoutName == "")
                strLayoutName = "default";

            return container_info.layout_list[strLayoutName];
        }
    };
    __pLayoutManager.getCurrentLayout = function (objContainer)
    {
        var container_info = this._findContainerInfo(objContainer);
        if (container_info)
        {
            var layout = this._getLayoutObject(container_info.current_layout_name, container_info.layout_list);
            if (!layout)
            {
                layout = this._getLayoutObject("default", container_info.layout_list);
            }
            return layout;
        }
    };
    __pLayoutManager.getCurrentLayoutName = function (objContainer)
    {
        var container_info = this._findContainerInfo(objContainer);
        if (container_info)
        {
            return container_info.current_layout_name;
        }
        return "default";
    }

    __pLayoutManager.setLayoutProperty = function (objContainer, strLayoutName, strPropName, PropValue)
    {
        var layout = this.getLayout(objContainer, strLayoutName);
        if (layout)
        {
            layout["set_" + strPropName].call(layout, PropValue);
        }
    }
    __pLayoutManager.getLayoutProperty = function (objContainer, strPropName, strLayoutName)
    {
        // 레이아웃이 지정된게 없으면 Current
        if (!strLayoutName)
        {
            strLayoutName = this.getCurrentLayoutName(objContainer);
        }

        var layout = this.getLayout(objContainer, strLayoutName);
        if (layout)
        {
            return layout[strPropName];
        }

        return;
    };
    __pLayoutManager.getLayoutProperties = function (objContainer, arrPropName, strLayoutName)
    {
        // 레이아웃이 지정된게 없으면 Current
        if (!strLayoutName)
        {
            strLayoutName = this.getCurrentLayoutName(objContainer);
        }

        var layout = this.getLayout(objContainer, strLayoutName);
        if (layout)
        {
            var ret = {};
            arrPropName.forEach(function (strPropName)
            {
                ret[strPropName] = layout[strPropName];
            }, this);

            return ret;
        }

        return;
    };

    __pLayoutManager.acceptMultiLayoutManager = function ()
    {
        return !!this._multilayoutmanager;
    };
    __pLayoutManager.acceptFluidLayoutManager = function ()
    {
        return !!this._fluidlayoutmanager;
    };

    // multilayout
    __pLayoutManager.initMultiLayoutManager = function ()
    {
        // manager init
        this._multilayoutmanager = new nexacro._MultiLayoutManager();
    };

    __pLayoutManager.selectLayout = function (objContainer)
    {
        if (!this.acceptMultiLayoutManager()) return false;
        if (!objContainer._orgurl) return false;

        var manager_multi = this._multilayoutmanager;
        var manager_fluid = this._fluidlayoutmanager;

        var container_info = this._findContainerInfo(objContainer);
        if (container_info)// && objContainer._adjust_width > 0  && objContainer._adjust_height > 0)
        {
            // Form, url이 설정된 Div 의 경우 사이즈기반 판단.
            var def_layout = this._getLayoutObject("default", container_info.layout_list);
            var cur_layout = this._getLayoutObject(container_info.current_layout_name, container_info.layout_list);
            var new_layout = manager_multi.getValidLayoutObject(container_info, objContainer._adjust_width, objContainer._adjust_height);

            if (cur_layout != new_layout)
            {
                var old_layoutname = cur_layout ? cur_layout._p_name : "";
                var old_layoutwidth = cur_layout ? cur_layout._p_name : 0;
                var old_layoutheight = cur_layout ? cur_layout._p_name : 0;
                var is_defaultload = old_layoutname == "" && new_layout._p_name == "default";
                old_layoutname = old_layoutname == "" ? "default" : old_layoutname;
                var ret;
                if (!is_defaultload)
                    ret = objContainer.on_fire_canlayoutchange(objContainer, "canlayoutchange", old_layoutname, new_layout._p_name, old_layoutwidth, new_layout._p_width, old_layoutheight, new_layout._p_height);
                if (ret === true || ret === undefined)
                {
                    manager_multi.changeLayout(objContainer, container_info, new_layout, def_layout);
                    // div의 레이아웃이 분리되면서 url 폼 갱신시 컨텐츠 컨테이너 갱신이 별도로 필요함
                    this._changeChildContainerLayout(objContainer, this._getContainerLevel(objContainer), container_info.current_layout_name);
                    if (!is_defaultload)
                        objContainer.on_fire_onlayoutchanged(objContainer, "onlayoutchanged", old_layoutname, new_layout._p_name, old_layoutwidth, new_layout._p_width, old_layoutheight, new_layout._p_height);
                    objContainer._setInnerFlexibleFlag(this.isFluidLayoutType(objContainer), manager_fluid.getLayoutArrangeType());
                    //this.calcFluidLayoutContents(objContainer);
                    return true;
                }
            }
            else if (!cur_layout) // || cur_layout != new_layout)      
            {
                objContainer._setInnerFlexibleFlag(this.isFluidLayoutType(objContainer), manager_fluid.getLayoutArrangeType());
                this._changeChildContainerLayout(objContainer, this._getContainerLevel(objContainer), container_info.current_layout_name);
            }
        }

        return false;
    };
    __pLayoutManager.selectLayoutForDesign = function (objContainer)
    {
        if (!this.acceptMultiLayoutManager()) return;

        var container_info = this._findContainerInfo(objContainer);
        if (container_info)
        {
            var manager_multi = this._multilayoutmanager;
            var new_layout = manager_multi.getValidLayoutObject(container_info, objContainer._adjust_width, objContainer._adjust_height);

            manager_multi.changeLayout(objContainer, container_info, new_layout);

            return new_layout;
        }
    };
    __pLayoutManager.selectLayoutAllContainer = function ()
    {
        if (!this.acceptMultiLayoutManager()) return;

        // div이 url과 컨텐츠 생성을 분리
        // 레이아웃 이름 및 사이즈로 판단
    };
    __pLayoutManager._changeChildContainerLayout = function (objContainer, nContainerLevel, changeLayoutName)
    {
        var manager_multi = this._multilayoutmanager;

        // 받아온 컨테이너 기준으로 아래 레빌을 검색
        var infos = this.container_info;
        var next_level = nContainerLevel + 1;
        var next_level_info = infos[next_level];
        if (next_level_info)
        {
            next_level_info.forEach(function (info)
            {
                var parent_context = info.parentContext;
                var self_context = info.selfContext;
                if (!self_context._orgurl)
                {
                    var is_same = this._equalContainer(objContainer, parent_context);
                    if (is_same)
                    {
                        var def_layout = this._getLayoutObject("default", info.layout_list);
                        var new_layout = info.layout_list[changeLayoutName];

                        // 바뀔 레이아웃의 정보가 없으면 해당 컨테이너는 굳이 변경을 시도하지 않음

                        if (new_layout)
                        {
                            manager_multi.changeLayout(self_context, info, new_layout, def_layout);
                        }
                        this.applyFluid(self_context);
                        self_context._setInnerFlexibleFlag(this.isFluidLayoutType(self_context), this._fluidlayoutmanager.getLayoutArrangeType())
                        if (self_context._is_created_contents)
                            this.calcFluidLayoutContents(self_context);
                        this._changeChildContainerLayout(self_context, next_level, changeLayoutName);
                    }
                }
            }, this);
        }
    };
    __pLayoutManager.setLayoutChangeFlag = function (v)
    {
        if (!this.acceptMultiLayoutManager()) return;

        this._multilayoutmanager.setLayoutChangeFlag(v);
    };
    __pLayoutManager.getLayoutChangeFlag = function ()
    {
        if (!this.acceptMultiLayoutManager()) return;

        this._multilayoutmanager.getLayoutChangeFlag();
    }
    __pLayoutManager.getValidLayout = function (objContainer)
    {
        if (!this.acceptMultiLayoutManager()) return;

        var container_info = this._findContainerInfo(objContainer);
        if (container_info)
        {
            return this._multilayoutmanager.getValidLayoutObject(container_info, objContainer._adjust_width, objContainer._adjust_height);
        }
    };

    // steplayout
    __pLayoutManager.initStepLayoutManager = function ()
    {
        // define

        // bind
        this._steplayoutmanager = {};
        this._steplayoutmanager[""];
    };
    __pLayoutManager.applyStep = function (objContainer)
    {
        // 레이아웃 변경후 Step설정 적용
        var container_info = this._findContainerInfo(objContainer);
        if (container_info)
        {
            if (nexacro.isDesignMode && !container_info.current_layout_name)
                container_info.current_layout_name = container_info.default_layout_name;


            var layout = this._getLayoutObject(container_info.current_layout_name, container_info.layout_list);
            if (layout && layout._p_stepcount > 0)
            {
                var stepcount = layout._p_stepcount;
                var stepindex = layout._p_stepindex;

                objContainer._on_prepare_stepcontents(stepcount, stepindex);
                objContainer._on_refresh_stepcontents(stepcount, stepindex);
            }
        }
    };
    __pLayoutManager.applyFluid = function (objContainer)
    {
        // 레이아웃 변경후 Layout설정 적용
        if (!this.acceptFluidLayoutManager()) return;
        if (!objContainer || !objContainer._is_created) return;

        var manager = this._fluidlayoutmanager;
        if (!manager) return;

        var arrange_type = manager.getLayoutArrangeType();
        switch (arrange_type)
        {
            case 0: // CSS Native
            case 1: // Adjust Calc
                switch (this.getLayoutType(objContainer))
                {
                    case 0: //LAYOUT_TYPE_ABSOLUTE
                        break;
                    case 1: //LAYOUT_TYPE_FLUIDHORIZONTAL
                    case 2: //LAYOUT_TYPE_FLUIDVERTICAL
                    case 3: //LAYOUT_TYPE_FLUIDTABLE
                        var layout = this.getCurrentLayout(objContainer);
                        if (layout)
                        {
                            var control_elem = objContainer.getElement();
                            if (control_elem)
                            {
                                control_elem.setElementLayoutContainerProps();
                            }
                        }
                        break;
                }
                break;
            //   break;
        }
    };

    // fluidlayout
    __pLayoutManager.calcLayout = function (objContainer)
    {
        switch (this.getLayoutType(objContainer))
        {
            case 0: //LAYOUT_TYPE_ABSOLUTE
                this.calcAbsoluteLayoutContents(objContainer);
                break;
            case 1: //LAYOUT_TYPE_ABSOLUTE
            case 2: //LAYOUT_TYPE_ABSOLUTE
            case 3: //LAYOUT_TYPE_ABSOLUTE
                this.calcFluidLayoutContents(objContainer);
                break;
        }
    };

    __pLayoutManager.initFluidLayoutManager = function ()
    {
        // manager init
        this._fluidlayoutmanager = new nexacro._FluidLayoutManager();
    };
    __pLayoutManager.calcFluidLayoutContents = function (objContainer)
    {
        //trace("calcFluidLayoutContents");
        //nexacro._traceV8CallStack();
        if (!this.acceptFluidLayoutManager()) return;

        var manager = this._fluidlayoutmanager;
        if (!manager) return;

        var container_info = this._findContainerInfo(objContainer);
        if (container_info)
        {
            var fittype = container_info.container_fittype;
        }

        var arrange_type = manager.getLayoutArrangeType();
        switch (arrange_type)
        {
            case 0: // CSS Native

                if (objContainer)
                {
                    //perf check point
                    //if (objContainer.getOffsetWidth() <= 0 || objContainer.getOffsetHeight() <= 0) return;
                    if ((fittype == 0 && (objContainer.getOffsetWidth() <= 0 || objContainer.getOffsetHeight() <= 0))
                        || (fittype == 1 && objContainer.getOffsetHeight() <= 0) || (fittype == 2 && objContainer.getOffsetWidth() <= 0)) return;

                    this._calcFluidLayoutTargetContainer(objContainer);
                }
                else
                {
                    this._calcFluidLayoutAllContainer();
                }

                break;
            case 1: // Adjust Calc
                if (objContainer)
                {
                    if ((fittype == 0 && (objContainer.getOffsetWidth() <= 0 || objContainer.getOffsetHeight() <= 0))
                        || (fittype == 1 && objContainer.getOffsetHeight() <= 0) || (fittype == 2 && objContainer.getOffsetWidth() <= 0)) return;

                    this._calcFluidLayoutTargetContainer(objContainer);
                }
                else
                {
                    this._calcFluidLayoutAllContainer();
                }
                break;
        }
    };
    __pLayoutManager.calcAbsoluteLayoutContents = function (objContainer)
    {
        if (objContainer)
        {
            //if (objContainer.getOffsetWidth() <= 0 || objContainer.getOffsetHeight() <= 0) return;

            this._calcAbsoluteLayoutTargetContainer(objContainer);
        }
        else
        {
            this._calcAbsoluteLayoutAllContainer();
        }
    };

    __pLayoutManager.applyFluidLayoutContentsProeprty = function (objContents, propname)
    {
        if (!this.acceptFluidLayoutManager())
            return;

        var manager = this._fluidlayoutmanager;
        if (!objContents || !manager)
            return;

        var objContainer = objContents._is_group ? objContents._group_panel : objContents._getForm();
        if (!objContainer)
            return;

        if (this.isFluidLayoutType(objContainer))
        {
            var arrange_type = manager.getLayoutArrangeType();
            switch (arrange_type)
            {
                case 0:
                    var control_elem = objContents.getElement();
                    if (control_elem)
                    {
                        switch (propname)
                        {
                            case "flexgrow": control_elem.setElementFlexGrow(objContents._p_flexgrow); break;
                            case "flexshrink": control_elem.setElementFlexShrink(objContents._p_flexshrink); break;
                            case "layoutorder": control_elem.setElementLayoutOrder(objContents._p_layoutorder); break;
                            case "tablecellarea": control_elem.setElementTableCellArea(objContents._p_tablecellarea); break;
                        }
                    }
                    if (!objContainer._is_changed_tabletemplate)
                    {
                        objContainer._setCalcedContainer(false);
                        this._calcFluidLayoutTargetContainer(objContainer);
                    }
                    break;
                case 1:
                    if (!objContainer._is_changed_tabletemplate)
                        this._calcFluidLayoutTargetContainer(objContainer);
                    break;
            }
        }
    };

    __pLayoutManager.setLayoutScrollType = function (objContainer)
    {
        var manager = this._fluidlayoutmanager;
        if (!manager) return;

        var is_fluidlayout = this.isFluidLayoutType(objContainer);
        if (!is_fluidlayout && !(objContainer instanceof nexacro._InnerForm))
            return;
        var arrange_type = manager.getLayoutArrangeType();
        switch (arrange_type)
        {
            case 0: // CSS Native
                objContainer._use_translate_scroll = false;
                break;
            case 1: // Adjust Calc
                objContainer._use_translate_scroll = true;
                break;
        }
    };

    __pLayoutManager.getLayoutType = function (objContainer)
    {
        var ret = this._fluidlayoutmanager._FLUIDLAYOUT_CONST["LAYOUT_TYPE_ABSOLUTE"];

        if (!this.acceptFluidLayoutManager()) return ret;

        var manager = this._fluidlayoutmanager;
        if (!manager) return ret;

        var container_info = this._findContainerInfo(objContainer);
        if (container_info)
        {
            var layout = this.getCurrentLayout(objContainer);
            ret = manager.getLayoutContainerType(layout);
        }

        return ret;
    };
    __pLayoutManager.getContentsMaxRect = function (objContainer)
    {
        var layout = this.getCurrentLayout(objContainer);
        if (layout)
        {
            return layout._getLayoutContentsMaxRect();
        }

        return [0, 0];
    };

    __pLayoutManager.isFluidLayoutType = function (objContainer)
    {
        var ret = false;

        if (!this.acceptFluidLayoutManager()) return ret;

        var manager = this._fluidlayoutmanager;
        if (!manager) return ret;

        var layout = this.getCurrentLayout(objContainer);
        if (layout)
        {
            var container_type = manager.getLayoutContainerType(layout);
            switch (container_type)
            {
                case 1: //LAYOUT_TYPE_FLUIDHORIZONTAL
                case 2: //LAYOUT_TYPE_FLUIDVERTICAL
                case 3: //LAYOUT_TYPE_FLUIDTABLE
                    ret = true;
                    break;
                case 0: //LAYOUT_TYPE_ABSOLUTE
                default:
                    break;
            }
        }

        return ret;
    };

    __pLayoutManager._calcFluidLayoutTargetContainer = function (objContainer)
    {
        var manager = this._fluidlayoutmanager;
        if (!manager) return;

        var layout = this.getCurrentLayout(objContainer);
        var container_info = this._findContainerInfo(objContainer);
        if (container_info)
        {
            if (container_info.__calc_container)
            {
                container_info.__calc_container = false;
                if (container_info.container_fittype == 0)
                    return;
            }
            else
            {
                container_info.__calc_container = true;
            }

            var contents_info;
            switch (this.getLayoutType(objContainer))
            {
                case 0: //LAYOUT_TYPE_ABSOLUTE
                    break;
                case 1: //LAYOUT_TYPE_FLUIDHORIZONTAL
                    contents_info = this.createFlexLayoutContentsInfo(container_info);
                    if (contents_info.length == 0) 
                    {
                        container_info.__calc_container = false;
                        if (container_info.container_fittype == 0)
                            return;
                    }

                    manager.initFluidFlexProps(layout._form || objContainer, layout, contents_info, container_info);
                    manager.calcFluidHorizontalContents(layout);
                    if (manager.calcContainer(container_info, layout))
                    {
                        container_info.parentContext._setCalcedContainer(false);
                        this.calcLayout(container_info.parentContext);
                    }
                    break;
                case 2: //LAYOUT_TYPE_FLUIDVERTICAL
                    contents_info = this.createFlexLayoutContentsInfo(container_info);
                    if (contents_info.length == 0) 
                    {
                        container_info.__calc_container = false;
                        if (container_info.container_fittype == 0)
                            return;
                    }

                    manager.initFluidFlexProps(layout._form || objContainer, layout, contents_info, container_info);
                    manager.calcFluidVerticalContents(layout);
                    if (manager.calcContainer(container_info, layout))
                    {
                        container_info.parentContext._setCalcedContainer(false);
                        this.calcLayout(container_info.parentContext);
                    }
                    break;
                case 3: //LAYOUT_TYPE_FLUIDTABLE
                    contents_info = this.createTableLayoutContentsInfo(container_info);
                    manager.initFluidTableProps(layout._form || objContainer, layout, contents_info, this.getLayout(objContainer, "default"), container_info);
                    manager.calcFluidTableContents(layout._form || objContainer);
                    layout._setLayoutContentsMaxRect(manager._max_contents_right, manager._max_contents_bottom);
                    layout._setLayoutFitContentsMaxRect(manager._max_fit_contents_right, manager._max_fit_contents_bottom);
                    if (manager.calcContainer(container_info, layout))
                    {
                        this.calcLayout(container_info.parentContext);
                    }
                    break;
                default:
                    break;
            }

            container_info.__calc_container = false;
        }
    };
    __pLayoutManager._calcFluidLayoutAllContainer = function ()
    {
        this.container_info.forEach(function (infos)
        {
            infos.forEach(function (info)
            {
                var layout = this._getLayoutObject(info.current_layout_name, info.layout_list);
                if (!layout)
                {
                    layout = this._getLayoutObject("default", info.layout_list);
                }

                if (layout && layout._form)
                {
                    if (layout._form.getOffsetWidth() <= 0 || layout._form.getOffsetHeight() <= 0) return;

                    this._calcFluidLayoutTargetContainer(layout._form);
                }
            }, this);
        }, this);
    };

    __pLayoutManager._calcAbsoluteLayoutTargetContainer = function (objContainer)
    {
        var manager = this._fluidlayoutmanager;
        if (!manager) return;

        var layout = this.getCurrentLayout(objContainer);
        var container_info = this._findContainerInfo(objContainer);
        if (container_info)
        {
            if (container_info.__calc_container)
            {
                container_info.__calc_container = false;
                return;
            }

            container_info.__calc_container = true;

            switch (this.getLayoutType(objContainer))
            {
                case 0: //LAYOUT_TYPE_ABSOLUTE
                    if (layout)
                    {
                        var rect = objContainer._calcScrollMaxSize();
                        layout._setLayoutContentsMaxRect(rect.w, rect.h);
                        if (manager.calcContainer(container_info, layout))
                        {
                            this.calcLayout(container_info.parentContext);
                        }
                    }
                    break;
                default:
                    break;
            }
            container_info.__calc_container = false;
        }
    };
    __pLayoutManager._calcAbsoluteLayoutAllContainer = function ()
    {
        this.container_info.forEach(function (infos)
        {
            infos.forEach(function (info)
            {
                var layout = this._getLayoutObject(info.current_layout_name, info.layout_list);
                if (!layout)
                {
                    layout = this._getLayoutObject("default", info.layout_list);
                }

                if (layout && layout._form)
                {
                    if (layout._form.getOffsetWidth() <= 0 || layout._form.getOffsetHeight() <= 0) return;

                    this._calcAbsoluteLayoutTargetContainer(layout._form);
                }
            }, this);
        }, this);
    };

    __pLayoutManager._getTemplateRectInfo = function (objContainer)
    {
        var ret = [];

        if (!this.acceptFluidLayoutManager()) return ret;

        var manager = this._fluidlayoutmanager;
        if (!manager) return ret;

        var arrange_type = manager.getLayoutArrangeType();
        if (arrange_type === 0)
        {
            return ret;
        }

        var container_type = this.getLayoutType(objContainer);
        switch (container_type)
        {
            case 0: //LAYOUT_TYPE_ABSOLUTE
            case 1: //LAYOUT_TYPE_FLUIDHORIZONTAL
            case 2: //LAYOUT_TYPE_FLUIDVERTICAL
                break;
            case 3: //LAYOUT_TYPE_FLUIDTABLE
                ret = manager._getTemplateRectInfo();
                break;
            default:
                break;
        }

        return ret;
    };

    // containerinfo
    __pLayoutManager.createLayoutContainerInfo = function (objContext)
    {
        // container_info = [
        //  [{Form}],
        //  [{Div1.form}, {Tab.Tabpage.form}]
        //  [{Div1.form.Div1.form}]
        //]

        // 중복체크
        var container_info = this._findContainerInfo(objContext);
        if (container_info) return;

        var level = this._getContainerLevel(objContext);
        if (!this.container_info[level])
        {
            this.container_info[level] = [];
        }

        this.container_info[level].push(this._makeContainerInfo(objContext));
    };

    __pLayoutManager.updateLayoutContainerInfo = function (objContainer)
    {
        var container_info = this._findContainerInfo(objContainer);
        if (container_info)
        {
            container_info.parentContext = objContainer._is_group ? objContainer._group_panel : objContainer._p_parent._is_form ? objContainer._p_parent : objContainer._p_parent._getParentForm();
            //나머지는 필요하면
        }
    };

    __pLayoutManager.destroyLayoutContainerInfo = function (objContext)
    {
        var nLevel = this._getContainerLevelContainerInfoBase(objContext);
        if (nLevel == 0 && this.container_info[nLevel] && this.container_info[nLevel].length == 1)
        {
            var container_info = this.container_info[nLevel] ? this.container_info[nLevel][0] : null;
            if (container_info)
            {
                // layout 날리고
                var layouts = container_info.layout_list;
                for (var i = layouts.length - 1; i >= 0; i--)
                {
                    var layout = layouts.get_id(i);
                    if (layout)
                    {
                        if (layouts[layout].destroy)
                            layouts[layout].destroy();
                        layouts.delete_item(layout);
                    }
                }

                this.container_info[nLevel].pop();
            }
        }
        else if (nLevel >= 0)
        {
            var infos = this.container_info[nLevel];
            if (!infos) return null;

            var i;
            var is_find = false
            for (i = 0; i < infos.length; i++)
            {
                var container_info = infos[i];
                var container_context = container_info.selfContext;
                var is_same = this._equalContainer(objContext, container_context);
                if (is_same)
                {
                    is_find = true;
                    break;
                }
            }

            if (is_find)
            {
                this.container_info[nLevel].splice(i, 1);
            }
        }
    };
    __pLayoutManager.getContainerInfo = function (objContext)
    {
        return this._findContainerInfo(objContext);
    };

    __pLayoutManager.setContainerFitType = function (objContainer, type)
    {
        if (!objContainer) return;

        var manager = this._fluidlayoutmanager;
        if (!manager) return;

        var container_info = this._findContainerInfo(objContainer);
        if (!container_info) return;

        container_info["container_fittype"] = manager.getLayoutContainerFitType(type);
    };

    __pLayoutManager._makeContainerInfo = function (objContainer)
    {
        var ret = {
            container_name: objContainer._p_name,

            selfContext: objContainer,
            parentContext: objContainer._is_group ? objContainer._group_panel : objContainer._p_parent ? (objContainer._p_parent._is_form ? objContainer._p_parent : objContainer._p_parent._getParentForm()) : null,
            default_layout_name: "default",
            current_layout_name: "",
            layout_list: new nexacro.Collection(),

            container_fittype: nexacro._FluidLayoutManager.prototype._FLUIDLAYOUT_CONST.LAYOUT_CONTAINER_FITTYPE_CONV["none"],
        };

        return ret;
    };
    __pLayoutManager._removeSelfContainerInfo = function (objContainer)
    {
        var ret = -1;
        var container_level = this._getContainerLevelContainerInfoBase(objContainer);

        var infos = this.container_info[container_level];
        if (!infos)
            return;

        for (var i = 0; i < infos.length; i++)
        {
            var container_info = infos[i];
            var container_context = container_info.selfContext;
            var is_same = this._equalContainer(objContainer, container_context);
            if (is_same)
            {
                ret = container_level;
                var layouts = container_info.layout_list;
                for (var j = layouts.length - 1; j >= 0; j--)
                {
                    var layout = layouts.get_id(j);
                    if (layout)
                    {
                        if (layouts[layout].destroy)
                            layouts[layout].destroy();
                        layouts.delete_item(layout);
                    }
                }
                this.container_info[container_level].splice(i, 1);
                break;
            }
        }

        return ret;
    };
    __pLayoutManager._removeSubContainerInfo = function (objContainer, target_level)
    {
        var next_level = target_level + 1;

        var infos = this.container_info[next_level];
        if (!infos) return null;
        var remove_info_idx = [];
        for (var i = 0, is_child = false; i < infos.length; i++)
        {
            var container_info = infos[i];
            var container_context = container_info.parentContext;
            var is_child = this._equalContainer(objContainer, container_context);
            if (is_child)
            {
                // 자식중에 부모가 일치하는걸 찾았음...
                // 얠 기준으로 다시 아래 레벨에서 탐색...
                // 재귀를 돌다보면 부모가 일치하지 않는 시점이 나옴. 이때는 아무것도 안함
                remove_info_idx.push(i);

                this._removeSubContainerInfo(container_info, next_level);

            }
        }

        // 마지막부터 삭제
        remove_info_idx.reverse();
        remove_info_idx.forEach(function (info_idx)
        {
            var container_info = infos[info_idx];
            var layouts = container_info.layout_list;
            for (var i = layouts.length - 1; i >= 0; i--)
            {
                var layout = layouts.get_id(i);
                if (layout)
                {
                    if (layouts[layout].destroy)
                        layouts[layout].destroy();
                    layouts.delete_item(layout);
                }
            }
            this.container_info[next_level].splice(info_idx, 1);
        }, this);
    };
    __pLayoutManager._findContainerInfo = function (objContainer)
    {
        if (!objContainer) return null;

        var nLevel = this._getContainerLevel(objContainer);

        var i;
        var infos = this.container_info[nLevel];
        if (!infos) return null;

        for (i = 0; i < infos.length; i++)
        {
            if (this._equalContainer(objContainer, infos[i].selfContext))
                return infos[i];

        }

        return null;
    };
    __pLayoutManager._getContainerLevel = function (objContainer)
    {
        var level = 0;

        var objParent = objContainer._p_parent;

        if (!objParent)
            return level;

        while (objParent && !objParent._is_frame)
        {
            if (objParent instanceof nexacro.Form)// && !(objContainer instanceof nexacro.Panel))
            {
                level++;
            }
            objParent = objParent._p_parent ? objParent._p_parent : null;
        }

        return level;
    };
    __pLayoutManager._getContainerLevelContainerInfoBase = function (objContainer)
    {
        // 컨테이너 트리가 완성형태일때 사용가능
        // 컨테이너가 컨테이너인포에 반드시 존재함
        var level = 0;
        var infos = this.container_info;
        if (objContainer._unique_id == "form")
        {
            // url 사용
            for (var level = 0, is_find = false; level < infos.length; level++)
            {
                var info = infos[level];
                for (var i = 0; i < info.length; i++)
                {
                    if (objContainer._orgurl == info[i].selfContext._orgurl)
                    {
                        is_find = true;
                        break;
                    }
                }
                if (is_find) break;
            }
        }
        else
        {
            // contents 사용. uniqueid로 비교
            for (var level = 0, is_find = false; level < infos.length; level++)
            {
                var info = infos[level];
                if (!info) continue;
                for (var i = 0; i < info.length; i++)
                {
                    //if (objContainer._unique_id == info[i].selfContext._unique_id)
                    if (this._equalContainer(objContainer, info[i].selfContext))
                    {
                        is_find = true;
                        break;
                    }
                }
                if (is_find) break;
            }
        }

        return level;
    };
    __pLayoutManager._equalContainer = function (pThis, target)
    {
        if (Object.is)
        {
            return Object.is(pThis, target);
        }
        else
        {
            var check_fn = function (v1, v2)
            {
                if (v1 === v2)
                {
                    return v1 !== 0 || 1 / v1 === 1 / v2;
                }
                else
                {
                    return v1 !== v1 && v2 !== v2;
                }
            };

            return check_fn(pThis, target);
        }
    };

    // contentsinfo
    __pLayoutManager.createFlexLayoutContentsInfo = function (objContainerInfo)
    {
        // 수평 수직 레이아웃에서 사용할 컨텐츠 집합
        var i;
        var contents_info = [];
        var comps = objContainerInfo.selfContext._p_components;
        if (objContainerInfo.selfContext._is_panel)
        {
            var items = objContainerInfo.selfContext.items;

            for (i = 0; i < items.length; i++)
            {
                var comp = items[i]._getComponent();
                if (!comp)
                    continue;
                var comp_info = this._makeContentsInfo(comp, 1);

                if (!comp_info.visible)
                    continue;

                if (!contents_info[comp_info.order])
                    contents_info[comp_info.order] = new Array();

                contents_info[comp_info.order].push(comp_info);
            }
        }
        else
        {
            for (i = 0; i < comps.length; i++)
            {
                var comp = comps[i];
                var comp_info = this._makeContentsInfo(comp, 1);

                if (!comp_info.visible || comp._is_group)
                    continue;

                if (!contents_info[comp_info.order])
                    contents_info[comp_info.order] = new Array();

                contents_info[comp_info.order].push(comp_info);
            }
        }

        return contents_info;
    };
    __pLayoutManager.createTableLayoutContentsInfo = function (objContainerInfo)
    {
        // 테이블 레이아웃에서 사용할 컨텐츠 집합
        var i;
        var is_panel = false;
        var contents_info = {
            coordinate_contents: [],
            ordering_contents: [],
        };
        var comps = objContainerInfo.selfContext._p_components;
        if (objContainerInfo.selfContext._is_panel)
        {
            is_panel = true;
            comps = objContainerInfo.selfContext._getComponents();
        }

        for (i = 0; i < comps.length; i++)
        {
            var comp = comps[i];
            var comp_info = this._makeContentsInfo(comp, 2);

            if (!comp_info.visible || (!is_panel && comp._is_group))
                continue;

            if (comp_info.coordinate)
            {
                contents_info.coordinate_contents.push(comp_info);
            }
            else
            {
                if (!contents_info.ordering_contents[comp_info.order])
                    contents_info.ordering_contents[comp_info.order] = new Array();

                contents_info.ordering_contents[comp_info.order].push(comp_info);
            }
        }

        return contents_info;
    };
    __pLayoutManager._makeContentsInfo = function (objComponent, dimension)
    {
        // FluidLayout 컴포넌트 스펙 변경시 참조 수정

        // common info
        //var size = [0, 0];

        var sizeinfo = objComponent._getSizeInfo();
        var minwidth = sizeinfo[2]
        var minheight = sizeinfo[3];

        var ret = {
            visible: objComponent._p_visible,
            order: (objComponent._p_layoutorder > 0 ? objComponent._p_layoutorder : 0),

            size: [sizeinfo[0], sizeinfo[1]],
            min_size: [minwidth ? minwidth : objComponent._p_minwidth ? +objComponent._p_minwidth : null, minheight ? minheight : objComponent._p_minheight ? +objComponent._p_minheight : null],
            max_size: [objComponent._p_maxwidth ? +objComponent._p_maxwidth : null, objComponent._p_maxheight ? +objComponent._p_maxheight : null],
            fittocontents: objComponent._p_fittocontents,
            _adjust_pos: [0, 0, 0, 0],
            _target: objComponent,
        };

        // fluid 타입별 추가 info
        switch (dimension)
        {
            case 1:
                ret["grow"] = objComponent._p_flexgrow !== undefined ? objComponent._p_flexgrow : 0;
                ret["shrink"] = objComponent._flexshrink !== undefined ? objComponent._flexshrink : 1;
                ret["_is_flex"] = ret["grow"] > 0 || ret["shrink"] > 0;
                break;
            case 2:
                ret["coordinate"] = objComponent._getCurrentLayoutTablecellarea();
                ret["org_coordinate"] = objComponent._p_tablecellarea;
                break;
        }

        return ret;
    };

    // manager Util
    __pLayoutManager._getLayoutObject = function (layout_name, layout_list)
    {
        if (layout_list)
        {
            return layout_list[layout_name];
        }
    };


    // global util
    nexacro._initLayoutManager = function (useMulti, useStep, useFluid)
    {
        if (!nexacro._layout_manager)
            nexacro._layout_manager = new nexacro._LayoutManager(useMulti, useStep, useFluid);
    };
    nexacro._getLayoutManager = function ()
    {
        return nexacro._layout_manager;
    };

    //==============================================================================
    // nexacro._MultiLayoutManager
    //==============================================================================
    nexacro._MultiLayoutManager = function ()
    {

    };
    var __pMultiLayoutManager = nexacro._createPrototype(nexacro.Object, nexacro._MultiLayoutManager);
    nexacro._MultiLayoutManager.prototype = __pMultiLayoutManager;
    __pMultiLayoutManager._type_name = "MultiLayoutManager";

    __pMultiLayoutManager.setLayoutChangeFlag = function (v)
    {
        this._cancelChangeLayout = v;
    }
    __pMultiLayoutManager.getLayoutChangeFlag = function ()
    {
        return this._cancelChangeLayout;
    }

    __pMultiLayoutManager.getValidLayoutObject = function (objContainerInfo, container_width, container_height)
    {
        var abs_gap_min_x = 5000;
        var abs_gap_min_y = 5000;
        var gap_min_x = 5000;
        //var gap_min_y = 2000;
        var abs_gap_x = -1;
        var abs_gap_y = -1;
        var gap_x = 0;

        const env = nexacro.getEnvironment();
        var curscreen_id = env._curscreenid;
        var curscreen_type = env._curscreentype;

        //        var curscreen_id = nexacro._getCurrentScreenID();
        //        var curscreen_type = nexacro._getCurrentScreenType();

        var layout;
        var checked_list = [];
        var layout_list = objContainerInfo.layout_list;
        for (var i = 0; i < layout_list.length; i++)
        {
            layout = layout_list[i];
            if (!layout.screenid || layout.screenid == "")
            {
                checked_list.push(layout);
                continue;
            }

            var screenid_list = layout.screenid.split(',');
            for (var j = 0; j < screenid_list.length; j++)
            {
                if (curscreen_id == screenid_list[j])
                {
                    checked_list.push(layout);
                    continue;
                }
            }
        }
        var layout_len = checked_list.length;
        var optimal_layout_num = -1;

        var is_portrait = container_width < container_height ? true : false;
        var mobileorientation = is_portrait ? "portrait" : "landscape";

        var correct_type = -1;
        var checkScreenSize = function (idx)
        {
            //if (container_width == 0 && container_height == 0)
            //    return;
            gap_x = container_width - layout._p_width;
            abs_gap_x = Math.abs(gap_x);

            //figure out
            if (abs_gap_min_x > abs_gap_x)
            {
                gap_min_x = gap_x;
                abs_gap_min_x = abs_gap_x;
                abs_gap_min_y = Math.abs(container_height - layout._p_height);
                optimal_layout_num = idx;
            }
            else if (abs_gap_min_x == abs_gap_x)
            {
                if (gap_min_x == abs_gap_x)
                {
                    abs_gap_y = Math.abs(container_height - layout._p_height);
                    if (abs_gap_min_y > abs_gap_y)
                    {
                        optimal_layout_num = idx;
                    }
                }
            }
        };

        for (var i = 0; i < layout_len; i++)
        {
            layout = checked_list[i];

            var screenid_list = layout._p_screenid.split(",");
            if (layout._p_screenid != "" && screenid_list.indexOf(curscreen_id) < 0)
            {
                continue;
            }

            correct_type = 1;

            if (!nexacro._isDesktop())
            {
                if (curscreen_type != "desktop" && layout._p_mobileorientation && layout._p_mobileorientation.toLowerCase() != mobileorientation)
                {
                    continue;
                }
            }

            correct_type = 2;
            checkScreenSize(i);
        }

        if (optimal_layout_num < 0)
        {
            if (correct_type < 0)
            {
                for (i = 0; i < layout_len; i++)
                {
                    layout = checked_list[i];
                    if (!nexacro._isDesktop())
                    {
                        if (curscreen_type != "desktop" && layout._p_mobileorientation && layout._p_mobileorientation.toLowerCase() != mobileorientation)
                        {
                            continue;
                        }
                    }

                    checkScreenSize(i);
                }
            }
            else if (correct_type == 1)
            {
                for (i = 0; i < layout_len; i++)
                {
                    layout = checked_list[i];
                    checkScreenSize(i);
                }
            }
        }
        // 스크린아이디도 있고, 오리엔테이션도 같아. 그러면 추가로직없이 크기 검색
        // 레이아웃중에 매칭되는 스크린아이디가 없어, 그럼 레이아웃리스트중에 오리엔테이션이 같은걸 검색
        // 레이아웃중에 매칭되는 스크린아이디는 있는데, 오리엔테이션 값이 전부 다를때. 레이아웃리스트를 전부 검색

        if (optimal_layout_num < 0) optimal_layout_num = 0;

        return checked_list[optimal_layout_num];
    };

    __pMultiLayoutManager.changeLayout = function (objContainer, container_info, target_layout, default_layout)
    {
        var prev_layout_name = container_info.current_layout_name;
        if (target_layout)
            container_info.current_layout_name = target_layout._p_name;

        if (default_layout && default_layout.change_fn)// && prev_layout_name != "default" && default_layout != target_layout)
        {
            default_layout.change_fn.call(this, objContainer);
        }
        if (target_layout && target_layout.change_fn)
        {
            target_layout.change_fn.call(this, objContainer);
        }
    };

    //==============================================================================
    // nexacro._StepLayoutManager
    //==============================================================================

    //==============================================================================
    // nexacro._FluidLayoutManager
    //==============================================================================
    nexacro._FluidLayoutManager = function ()
    {
    };
    var __pFluidLayoutManager = nexacro._createPrototype(nexacro.Object, nexacro._FluidLayoutManager);
    nexacro._FluidLayoutManager.prototype = __pFluidLayoutManager;
    __pFluidLayoutManager._type_name = "FluidLayoutManager";

    // manager CONST
    __pFluidLayoutManager._FLUIDLAYOUT_CONST = {
        LAYOUT_ARRANGE_NATIVE: 0,
        LAYOUT_ARRANGE_ADJUST: 1,

        LAYOUT_TYPE_ABSOLUTE: 0,
        LAYOUT_TYPE_FLUIDHORIZONTAL: 1,
        LAYOUT_TYPE_FLUIDVERTICAL: 2,
        LAYOUT_TYPE_FLUIDTABLE: 3,
        LAYOUT_TYPE_CONV: {
            default: 0,
            horizontal: 1,
            vertical: 2,
            table: 3,
        },

        LAYOUT_CONTAINER_FITTYPE_NONE: 0,
        LAYOUT_CONTAINER_FITTYPE_WIDTH: 1,
        LAYOUT_CONTAINER_FITTYPE_HEIGHT: 2,
        LAYOUT_CONTAINER_FITTYPE_BOTH: 3,
        LAYOUT_CONTAINER_FITTYPE_CONV: {
            none: 0,
            width: 1,
            height: 2,
            both: 3,
        },

        LAYOUT_CONTENT_ALIGN_START: 0,
        LAYOUT_CONTENT_ALIGN_END: 1,
        LAYOUT_CONTENT_ALIGN_CENTER: 2,
        LAYOUT_CONTENT_ALIGN_SPACEBETWEEN: 3,
        LAYOUT_CONTENT_ALIGN_SPACEAROUND: 4,
        LAYOUT_CONTENT_ALIGN_SPACEEVENLY: 5,
        LAYOUT_CONTENT_ALIGN_CONV: {
            start: 0,
            end: 1,
            center: 2,
            spacebetween: 3,
            spacearound: 4,
            spaceevenly: 5,
        },

        LAYOUT_WRAP_NONE: 0,
        LAYOUT_WRAP_WRAP: 1,
        LAYOUT_WRAP_CONV: {
            nowrap: 0,
            wrap: 1,
        },

        LAYOUT_DIRECTION_HORIZONTAL: 0,
        LAYOUT_DIRECTION_VERTICAL: 1,
        LAYOUT_DIRECTION_CONV: {
            horizontal: 0,
            vertical: 1,
        },
    };

    // Prop Getter : layout property를 manager에서 쓰기 쉽게 가공해서 반환
    // FluidLayout 레이아웃 Proeprty스펙 변경시 수정
    __pFluidLayoutManager.getLayoutArrangeType = function ()
    {
        var ret;
        var browser = nexacro._Browser;
        switch (browser)
        {
            case "Runtime":
                //case "Chrome":
                // 모든 컨텐츠의 adjust 계산
                ret = this._FLUIDLAYOUT_CONST.LAYOUT_ARRANGE_ADJUST;
                break;
            case "MobileSafari":
                if (nexacro._BrowserVersion > 14.4)
                    ret = this._FLUIDLAYOUT_CONST.LAYOUT_ARRANGE_NATIVE;
                else
                    ret = this._FLUIDLAYOUT_CONST.LAYOUT_ARRANGE_ADJUST;
                break;
            default:
                // WRE : CSS
                ret = this._FLUIDLAYOUT_CONST.LAYOUT_ARRANGE_NATIVE;
                break;
        }

        return ret;
    };
    __pFluidLayoutManager.getLayoutContainerFitType = function (type)
    {
        var const_convert = this._FLUIDLAYOUT_CONST.LAYOUT_CONTAINER_FITTYPE_CONV;
        return const_convert[type] || const_convert["none"];
    };

    __pFluidLayoutManager.getLayoutContainerType = function (layout)
    {
        // 해당 안되면 default
        if (layout)
        {
            var const_convert = this._FLUIDLAYOUT_CONST.LAYOUT_TYPE_CONV;
            return const_convert[layout.type] || const_convert["default"];
        }
        else
        {
            return 0;
        }
    };
    __pFluidLayoutManager.getFlexWrapType = function (layout)
    {
        // 해당 안되면 nowrap

        if (layout)
        {
            var const_convert = this._FLUIDLAYOUT_CONST.LAYOUT_WRAP_CONV;
            return const_convert[layout.flexwrap] || const_convert["nowrap"];
        }
        else
        {
            return 0;
        }
    };

    __pFluidLayoutManager.getLayoutContainerPadding = function (layout)
    {
        if (layout)
        {
            return layout._spacing || new nexacro.PaddingObject("0px");
        }
        else
        {
            return new nexacro.PaddingObject("0px");
        }
    };
    __pFluidLayoutManager.getLayoutContentsGap = function (layout)
    {
        if (layout)
        {
            return [layout._p_horizontalgap || 0, layout._p_verticalgap || 0];
        }
        else
        {
            return 0;
        }
    };

    __pFluidLayoutManager.getLayoutAlign = function (layout)
    {
        var ret;
        var const_convert = this._FLUIDLAYOUT_CONST.LAYOUT_CONTENT_ALIGN_CONV;
        switch (this.getLayoutContainerType(layout))
        {
            case 0: //LAYOUT_TYPE_ABSOLUTE
                break;
            case 1: //LAYOUT_TYPE_FLUIDHORIZONTAL
                var horz_align = const_convert[layout._p_flexmainaxisalign] || const_convert["start"];
                var vert_align = const_convert[layout._p_flexcrossaxisalign] || const_convert["start"];
                var wrap_align = const_convert[layout._p_flexcrossaxiswrapalign] || const_convert["start"];

                ret = [horz_align, vert_align, wrap_align];
                break;
            case 2: //LAYOUT_TYPE_FLUIDVERTICAL
                var horz_align = const_convert[layout._p_flexmainaxisalign] || const_convert["start"];
                var vert_align = const_convert[layout._p_flexcrossaxisalign] || const_convert["start"];
                var wrap_align = const_convert[layout._p_flexcrossaxiswrapalign] || const_convert["start"];

                ret = [horz_align, vert_align, wrap_align];
                break;
            case 3: //LAYOUT_TYPE_FLUIDTABLE
                var cell_h = "start";
                var cell_v = "start";
                var comp_h = "start";
                var comp_v = "start";

                var cell_align = layout._p_tablecellalign;
                if (cell_align)
                {
                    cell_align = cell_align.split(" ");
                    if (cell_align.length)
                    {
                        cell_h = const_convert[cell_align[0]] || const_convert["start"];

                        if (cell_align.length == 1) cell_v = const_convert["start"];
                        if (cell_align.length == 2) cell_v = const_convert[cell_align[1]] || const_convert["start"];
                    }
                    else
                    {
                        cell_h = const_convert["start"];
                        cell_v = const_convert["start"];
                    }
                }
                else
                {
                    cell_h = const_convert["start"];
                    cell_v = const_convert["start"];
                }

                var comp_align = layout._p_tablecellincompalign;
                if (comp_align)
                {
                    comp_align = comp_align.split(" ");
                    if (comp_align.length)
                    {
                        comp_h = const_convert[comp_align[0]] || const_convert["start"];

                        if (comp_align.length == 1) comp_v = const_convert["start"];
                        if (comp_align.length == 2) comp_v = const_convert[comp_align[1]] || const_convert["start"];
                    }
                    else
                    {
                        comp_h = const_convert["start"];
                        comp_v = const_convert["start"];
                    }
                }
                else
                {
                    comp_h = const_convert["start"];
                    comp_v = const_convert["start"];
                }

                ret = [cell_h, cell_v, comp_h, comp_v];
                break;
            default:
                break;
        }

        return ret;
    };

    __pFluidLayoutManager.getLayoutTemplate = function (layout)
    {
        var ret;

        switch (this.getLayoutContainerType(layout))
        {
            case 0:
            case 1:
            case 2:
                break;
            case 3:
                ret = layout._p_tabletemplate;
                break;

        }

        return ret;
    };
    __pFluidLayoutManager.getLayoutTemplateArea = function (layout)
    {
        var ret;

        switch (this.getLayoutContainerType(layout))
        {
            case 0:
            case 1:
            case 2:
                break;
            case 3:
                ret = layout._p_tabletemplatearea;
                break;
        }

        return ret;
    };
    __pFluidLayoutManager.getLayoutDirection = function (layout)
    {
        var ret;
        var const_convert = this._FLUIDLAYOUT_CONST.LAYOUT_DIRECTION_CONV;
        switch (this.getLayoutContainerType(layout))
        {
            case 0:
                break;
            case 1:
                ret = const_convert["horizontal"];
                break;
            case 2:
                ret = const_convert["vertical"];
                break;
            case 3:
                ret = const_convert[layout._p_tabledirection] || const_convert["horizontal"];
                break;

        }

        return ret;
    };

    __pFluidLayoutManager.getLayoutTablecellmovingtype = function (layout)
    {
        var ret;

        switch (this.getLayoutContainerType(layout))
        {
            case 0:
            case 1:
            case 2:
                break;
            case 3:
                ret = layout._p_tablecellmovingtype;
                break;

        }
        return ret;
    };

    // init Fluid
    __pFluidLayoutManager.initFluidCommonProps = function (context, objLayout, defaultLayout)
    {
        var context_border = context._getCurrentStyleBorder();
        var context_border_parent = (context._p_parent && context._p_parent._is_container) ? context._p_parent._getCurrentStyleBorder() : null;

        // uninit
        this.uninitFluidCommonProps();

        // common
        var container_size = this._getContainerSize(context);
        this._container_width = container_size[0];
        this._container_height = container_size[1];

        this._container_padding = this.getLayoutContainerPadding(objLayout);
        this._container_hscroll_size = 0;
        this._container_vscroll_size = 0;
        this._is_apply_hscrollbar_size = false;
        this._is_apply_vscrollbar_size = false;
        var is_panel = context._is_panel;
        if (is_panel != true)
        {
            var h_scrollbartype = context._getHScrollBarType();
            var v_scrollbartype = context._getVScrollBarType();

            this._container_hscroll_size = (h_scrollbartype == "none" || h_scrollbartype == "autoindicator" || h_scrollbartype == "indicator") ? 0 : context._getHScrollBarSize();
            this._container_vscroll_size = (v_scrollbartype == "none" || v_scrollbartype == "autoindicator" || v_scrollbartype == "indicator") ? 0 : context._getVScrollBarSize();
        }

        this._contents_width = this._container_width - (this._container_padding.left + this._container_padding.right);
        this._contents_height = this._container_height - (this._container_padding.top + this._container_padding.bottom);

        this._contents_width -= context_border ? context_border._getBorderWidth() : 0;
        this._contents_height -= context_border ? context_border._getBorderHeight() : 0;

        this._contents_width -= context_border_parent ? context_border_parent._getBorderWidth() : 0;
        this._contents_height -= context_border_parent ? context_border_parent._getBorderHeight() : 0;

        this._align = this.getLayoutAlign(objLayout);
        this._gap = this.getLayoutContentsGap(objLayout);
        this._direction = this.getLayoutDirection(objLayout);

        this._max_contents_right = 0;
        this._max_contents_bottom = 0;

        this._tablecellmovingtype = this.getLayoutTablecellmovingtype(objLayout);
        if (defaultLayout)
        {
            this._default_tabletemplate = defaultLayout._tabletemplate;
            this._default_tablecellmovingtype = this.getLayoutTablecellmovingtype(defaultLayout);
        }
    };
    __pFluidLayoutManager.initFluidFlexProps = function (context, objLayout, objContentsInfo, objContainerInfo)
    {
        // init common
        this.initFluidCommonProps(context, objLayout);

        // uninit flex
        this.uninitFluidFlexProps();

        // init flex
        this._fluidcontents = objContentsInfo.reduce(function (acc, val) { return acc.concat(val) }, []);
        if (objContentsInfo && objContentsInfo.length > 1)
            context._setFluidcontents(this._fluidcontents);
        this._flexwrap = this.getFlexWrapType(objLayout);

        this._fittocontents = objContainerInfo.container_fittype;

        this._is_flexible = this._fluidcontents.some(function (content) { return content._is_flex === true; });

        this._contents_width_remain = this._contents_width;
        this._contents_height_remain = this._contents_height;

        this._current_main_spacing = 0;
        this._current_cross_spacing = 0;
        this._is_panel = context && context._is_panel ? true : false;
    };
    __pFluidLayoutManager.initFluidTableProps = function (context, objLayout, objContentsInfo, defaultLayout, objContainerInfo)
    {
        // init common
        this.initFluidCommonProps(context, objLayout, defaultLayout);

        // uninit table
        this.uninitFluidTableProps();

        // init table
        this._container_horizontal_spacing = 0;
        this._container_vertical_spacing = 0;

        this._max_fit_contents_right = 0;
        this._max_fit_contents_bottom = 0;

        this._fittocontents = objContainerInfo.container_fittype;

        var order_contents_length = objContentsInfo.ordering_contents.reduce(function (length, contents)
        {
            return length += contents.length;
        }, 0);
        this._tabletemplate = this.getLayoutTemplate(objLayout);
        this._tabletemplatearea = this.getLayoutTemplateArea(objLayout);

        var parse = this._parseTableTemplate(this._tabletemplate);
        this._tabletemplate_parse = parse.parse;
        this._tabletemplate_matrix = parse.matrix;

        parse = this._parseTableTemplateArea(this._tabletemplatearea);
        this._tabletemplatearea_matrix = parse.area_matrix;
        this._tabletemplatearea_coordinate = parse.area_coordinate;

        this._max_row_sizes = [];
        this._max_col_sizes = [];

        var template_max_row = this._tabletemplate_parse[0].length;
        var template_max_col = this._tabletemplate_parse[1].length;

        var area_max_row = this._tabletemplatearea_matrix.length;
        var area_max_col = this._tabletemplatearea_matrix.length ? this._tabletemplatearea_matrix[0].length : 0;

        var coordinate_max_row = 0;
        var coordinate_max_col = 0;

        var unidentification_max_row = 0;
        var unidentification_max_col = 0;

        objContentsInfo.coordinate_contents.forEach(function (content)
        {
            var content_w = isNaN(+content.size[0]) ? 0 : +content.size[0];
            var content_h = isNaN(+content.size[1]) ? 0 : +content.size[1];

            var merge_pos = [];
            var org_merge_pos = [];
            var coord = content.coordinate;
            var org_coord = content.org_coordinate;
            var area = this._tabletemplatearea_coordinate[coord];
            if (area)
            {
                this._tablecontents_area.push(content);
                area.forEach(function (coordinate)
                {
                    this._used_cell.add_item("use" + coordinate[0] + coordinate[1], [coordinate[0], coordinate[1]]);
                }, this);
            }
            else
            {
                coord = coord.split("/");
                coord.forEach(function (cell_pos, idx, orgArr)
                {
                    cell_pos = cell_pos.trim();
                    var tmp = cell_pos.split(" ");
                    if (tmp.length == 1)
                    {
                        merge_pos.push(+cell_pos);
                        merge_pos.push(+cell_pos);
                    }
                    else if (tmp.length == 2)
                    {
                        if (+tmp[0] > +tmp[1])
                        {
                            tmp.push(tmp.shift());
                        }
                        tmp.forEach(function (cell_pos)
                        {
                            merge_pos.push(+cell_pos);
                        });
                    }
                });

                if (org_coord && org_coord.length)
                {
                    org_coord = org_coord.split("/");
                    org_coord.forEach(function (cell_pos, idx, orgArr)
                    {
                        cell_pos = cell_pos.trim();
                        var tmp = cell_pos.split(" ");
                        if (tmp.length == 1)
                        {
                            org_merge_pos.push(+cell_pos);
                            org_merge_pos.push(+cell_pos);
                        }
                        else if (tmp.length == 2)
                        {
                            if (+tmp[0] > +tmp[1])
                            {
                                tmp.push(tmp.shift());
                            }
                            tmp.forEach(function (cell_pos)
                            {
                                org_merge_pos.push(+cell_pos);
                            });
                        }
                    });
                }

                var is_valid = merge_pos.every(function (pos)
                {
                    var ret = true;
                    if (isNaN(pos))
                        ret = false;
                    else if (pos < 0)
                        ret = false;

                    return ret;
                });
                if (merge_pos.length != 4)
                {
                    is_valid = false;
                }

                if (is_valid)
                {
                    content.rowstart = merge_pos[0];
                    content.colstart = merge_pos[2];
                    content.rowend = merge_pos[1];
                    content.colend = merge_pos[3];

                    if (org_merge_pos && org_merge_pos.length)
                    {
                        content.org_rowstart = org_merge_pos[0];
                        content.org_colstart = org_merge_pos[2];
                        content.org_rowend = org_merge_pos[1];
                        content.org_colend = org_merge_pos[3];
                    }

                    this._tablecontents_coordinate.push(content);

                    coordinate_max_row = Math.max(coordinate_max_row, content.rowend);
                    coordinate_max_col = Math.max(coordinate_max_col, content.colend);

                    for (var i = content.rowstart; i <= content.rowend; i++)
                    {
                        for (var j = content.colstart; j <= content.colend; j++)
                        {
                            this._used_cell.add_item("use" + i + j, [i, j]);
                        }
                    }
                }
                else
                {
                    var row_cnt = template_max_row + 2;
                    var col_cnt = template_max_col + 2;
                    var row_idx = row_cnt - 1;
                    var col_idx = col_cnt - 1;

                    content.rowstart = content.rowend = row_idx;
                    content.colstart = content.colend = col_idx;

                    this._tablecontents_unidentification.push(content);

                    unidentification_max_row = row_cnt;
                    unidentification_max_col = col_cnt;

                    this._used_cell.add_item("use" + row_idx + col_idx, [row_idx, col_idx]);
                }

                this._max_row_sizes[row_idx] = this._max_row_sizes[row_idx] ? Math.max(this._max_row_sizes[row_idx], content_h) : content_h;
                this._max_col_sizes[col_idx] = this._max_col_sizes[col_idx] ? Math.max(this._max_col_sizes[col_idx], content_w) : content_w;
            }

        }, this);

        this._tablecontents_order = objContentsInfo.ordering_contents;
        this._tablecontents_length = this._tablecontents_area.length + this._tablecontents_coordinate.length + this._tablecontents_unidentification.length + order_contents_length;

        if (context && !context._is_changed_tabletemplate)// && !nexacro._isDesignMode())
        {
            var max_row = Math.max(template_max_row, area_max_row, coordinate_max_row + 1, unidentification_max_row);
            var max_col = Math.max(template_max_col, area_max_col, coordinate_max_col + 1, unidentification_max_col);

            var add_row_cnt = max_row - template_max_row;
            var add_col_cnt = max_col - template_max_col;

            // add row
            this._addTableTemplateMatrix(add_row_cnt, "1&", 0);
            this._addTableTemplateMatrix(add_col_cnt, "1&", 1);

            // 자동배치할 영역이 남았는지 판단후 템플릿 추가
            var cell_length = max_row * max_col;
            var empty_cell = cell_length - this._used_cell.length;
            var remain_cell = empty_cell - order_contents_length;
            /*
            if (!nexacro._isDesignMode() && remain_cell < 0)
            {
                remain_cell *= -1;

                switch (this._direction)
                {
                    case 0:
                        add_row_cnt = Math.ceil(remain_cell / max_col);

                        // add row
                        this._addTableTemplateMatrix(add_row_cnt, "1&", 0);
                        break;
                    case 1:
                        add_col_cnt = Math.ceil(remain_cell / max_row);
                        //add col
                        this._addTableTemplateMatrix(add_col_cnt, "1&", 1);

                        break;
                }
            }
            */

            this._tablecontents_order.forEach(function (contents)
            {
                contents.forEach(function (content)
                {
                    var content_w = isNaN(+content.size[0]) ? 0 : +content.size[0];
                    var content_h = isNaN(+content.size[1]) ? 0 : +content.size[1];

                    for (var i = 0; i < this._tabletemplate_parse[0].length; i++)
                    {
                        for (var j = 0; j < this._tabletemplate_parse[1].length; j++)
                        {
                            var coord_name = "use" + i + j;
                            if (!this._used_cell[coord_name])
                            {
                                content.rowstart = content.rowend = i;
                                content.colstart = content.colend = j;

                                this._used_cell.add_item("use" + i + j, [i, j]);

                                this._max_row_sizes[i] = this._max_row_sizes[i] ? Math.max(this._max_row_sizes[i], content_h) : content_h;
                                this._max_col_sizes[j] = this._max_col_sizes[j] ? Math.max(this._max_col_sizes[j], content_w) : content_w;
                            }
                        }
                    }
                }, this);
            }, this);
        }
    };

    __pFluidLayoutManager.uninitFluidCommonProps = function ()
    {
        this._fluidcontents = [];

        this._container_padding = null;
    };
    __pFluidLayoutManager.uninitFluidFlexProps = function ()
    {

    };
    __pFluidLayoutManager.uninitFluidTableProps = function ()
    {
        this._tablecontents_area = [];
        this._tablecontents_coordinate = [];
        this._tablecontents_order = [];
        this._tablecontents_unidentification = [];

        this._used_cell = new nexacro.Collection();

        this._tabletemplate_rect = [];
        this._tabletemplatearea_rect = {};
    };

    // Fluid Calculator API
    __pFluidLayoutManager.calcFluidHorizontalContents = function (layout)
    {
        // [컨텐츠 총합, 여백, 컨텐츠갯수] * wrap_line 정보 생성
        var layout_info = this._getContentsInfo();

        // 계산된 컨텐츠 정보로 컴포넌트에 적용
        this._adjustHorizontalContent(layout_info);
        layout._setLayoutContentsMaxRect(this._max_contents_right, this._max_contents_bottom);
        this._applyContent();
    };
    __pFluidLayoutManager.calcFluidVerticalContents = function (layout)
    {
        // [컨텐츠 총합, 여백, 컨텐츠갯수] * wrap_line 정보 생성
        var layout_info = this._getContentsInfo();

        // 계산된 컨텐츠 정보로 컴포넌트에 적용
        this._adjustVerticalContent(layout_info);
        layout._setLayoutContentsMaxRect(this._max_contents_right, this._max_contents_bottom);
        this._applyContent();
    };
    __pFluidLayoutManager.calcFluidTableContents = function (context)
    {
        // template 기반 계산
        var layout_info = this._getTableInfo();

        if (this._tablecontents_length > 0)
        {
            // template 과 컨텐츠 를 결합한 계산
            this._fluidcontents = this._calcTableContentAdjust(layout_info, context);

            // 계산결과를 Apply
            this._applyContent();
        }
    };

    __pFluidLayoutManager.calcContainer = function (containerInfo, layout)
    {
        // 계산된 컨텐츠 최대 크기를 가지고 컨테이너 크기를 옵션별로 조절함
        // Div나 Tabpage만 계산
        // Form은 리사이징 없음

        if (!containerInfo.parentContext)
            return;

        var ret = false;
        var context = containerInfo.selfContext;

        if (!(context instanceof nexacro._InnerForm) && !context._is_panel)
            return;

        var container_comp = context._is_panel ? context : context._p_parent;
        var container_size = [0, 0];

        var layout_type = this.getLayoutContainerType(layout);
        switch (layout_type)
        {
            case 0: //LAYOUT_TYPE_ABSOLUTE
                //container_comp._parseArrangeInfo(container_comp._p_left, container_comp._p_top, container_comp._p_right, container_comp._p_bottom, container_comp._p_width, container_comp._p_height);
                //container_comp._update_position_static();
                container_comp._restorePosition();
                container_size = container_comp._on_getAbsoluteContainerSize(layout._contents_max_rect);
                ret = this._applyAbsoluteContainer(context, container_size);
                break;
            case 1: //LAYOUT_TYPE_HORIZONTAL
                container_size = container_comp._on_getFluidHorizontalContainerSize(layout._contents_max_rect);
                ret = this._applyFluidContainer(context, container_size);
                break;
            case 2: //LAYOUT_TYPE_VERTICAL
                container_size = container_comp._on_getFluidVerticalContainerSize(layout._contents_max_rect);
                ret = this._applyFluidContainer(context, container_size);
                break;
            case 3: //LAYOUT_TYPE_TABLE
                container_size = container_comp._on_getFluidTableContainerSize(layout._fit_contents_max_rect, layout._contents_max_rect);
                ret = this._applyFluidContainer(context, container_size);
                break;
        }

        return ret;
    };

    // Flex Common
    __pFluidLayoutManager._getContentsInfo = function ()
    {
        var ret;

        if (this._is_flexible)
        {
            ret = this._getFluidContentSizeInfo();
        }
        else
        {
            ret = this._getContentSizeInfo();
        }

        if (this._checkRecalcLayout(ret)) ret = this._getContentsInfo();

        return ret;
    };
    __pFluidLayoutManager._getFluidContentSizeInfo = function ()
    {
        // direction, wrap 에 따른 분기
        var ret;

        switch (this._direction)
        {
            case 0: // Horizontal
                switch (this._flexwrap)
                {
                    case 0: // NOWRAP
                        ret = this._getFluidHorizontalContentSizeInfoNoWrap();
                        break;
                    case 1: // WRAP
                        ret = this._getFluidHorizontalContentSizeInfoWrap();
                        break;
                }
                break;
            case 1: // Vertical
                switch (this._flexwrap)
                {
                    case 0: // NOWRAP
                        ret = this._getFluidVerticalContentSizeInfoNoWrap();
                        break;
                    case 1: // WRAP
                        ret = this._getFluidVerticalContentSizeInfoWrap();
                        break;
                }
                break;
        }

        return ret;
    };
    __pFluidLayoutManager._getContentSizeInfo = function ()
    {
        // direction, wrap 에 따른 분기
        var ret;

        switch (this._direction)
        {
            case 0: // Horizontal
                switch (this._flexwrap)
                {
                    case 0: // NOWRAP
                        ret = this._getHorizontalContentSizeInfoNoWrap();
                        break;
                    case 1: // WRAP
                        ret = this._getHorizontalContentSizeInfoWrap();
                        break;
                }
                break;
            case 1: // Vertical
                switch (this._flexwrap)
                {
                    case 0: // NOWRAP
                        ret = this._getVerticalContentSizeInfoNoWrap();
                        break;
                    case 1: // WRAP
                        ret = this._getVerticalContentSizeInfoWrap();
                        break;
                }
                break;
        }

        return ret;
    };
    __pFluidLayoutManager._getContainerSize = function (context)
    {
        var container_comp = context._is_panel ? context : context._p_parent;
        var form = container_comp ? (container_comp._is_group ? container_comp._group_panel : container_comp._getForm()) : null;
        var info = container_comp ? container_comp._arrange_info : null;
        var comp, obj, distance, refer_font;

        var container_width = container_comp._is_container ? container_comp._adjust_width : context._adjust_width;
        var container_height = container_comp._is_container ? container_comp._adjust_height : context._adjust_height;
        var form_width, form_height;

        //여기 수정
        var context_fittype_parent = (container_comp && container_comp._is_container) ? this.getLayoutContainerFitType(container_comp._p_fittocontents) : 0;
        if (context_fittype_parent == 1 || context_fittype_parent == 3)
        {
            container_width = context._width;
            if (info && (obj = info.width))
            {
                comp = container_comp._findComponentForArrange(obj.compid);
                if (!comp)
                {
                    distance = obj.distance;
                    form_width = form._adjust_width;

                    if (distance.indexOf("em") > -1)
                    {
                        comp = container_comp;
                        if (distance.indexOf("rem") > -1)
                        {
                            comp = comp._getMainFrame();
                        }

                        refer_font = comp._getReferenceAbsoluteFont();
                        form_width = refer_font ? refer_font._size : 1;
                    }

                    container_width = this._parseContentSize(distance, form_width);
                }
            }
        }
        if (context_fittype_parent == 2 || context_fittype_parent == 3)
        {
            container_height = context._height;
            if (info && (obj = info.height))
            {
                comp = container_comp._findComponentForArrange(obj.compid);
                if (!comp)
                {
                    distance = obj.distance;
                    form_height = form._adjust_height;

                    if (distance.indexOf("em") > -1)
                    {
                        comp = container_comp;
                        if (distance.indexOf("rem") > -1)
                        {
                            comp = comp._getMainFrame();
                        }

                        refer_font = comp._getReferenceAbsoluteFont();
                        form_height = refer_font ? refer_font._size : 1;
                    }

                    container_height = this._parseContentSize(distance, form_height);
                }
            }
        }

        var minwidth = container_comp._minwidth;
        var maxwidth = container_comp._maxwidth;
        var minheight = container_comp._minheight;
        var maxheight = container_comp._maxheight;

        if (minwidth != null && (container_width < minwidth))
            container_width = (minwidth < 0) ? 0 : minwidth;
        else if (maxwidth != null && (container_width > maxwidth))
            container_width = (maxwidth < 0) ? 0 : maxwidth;

        if (minheight != null && (container_height < minheight))
            container_height = (minheight < 0) ? 0 : minheight;
        else if (maxheight != null && (container_height > maxheight))
            container_height = (maxheight < 0) ? 0 : maxheight;

        return [container_width, container_height]
    }

    __pFluidLayoutManager._calcTableContentsSize = function (templateInfo)
    {
        var templateinfo_tmp = JSON.parse(JSON.stringify(templateInfo));

        var contents_area = this._tablecontents_area;
        var contents_coordinate = this._tablecontents_coordinate;
        var contents_order = this._tablecontents_order;
        var contents_unidentification = this._tablecontents_unidentification;

        var row_gap = this._gap[1];
        var col_gap = this._gap[0];

        var fr_w = 0;
        var fr_h = 0;

        // find maximum size per 1*
        if (contents_area.length)
        {
            contents_area.forEach(function (content)
            {
                var prop_area = content.coordinate;
                var area = this._tabletemplatearea_coordinate[prop_area];
                if (area)
                {
                    // Area 계산
                    var row_start, row_end, col_start, col_end;
                    area.forEach(function (area_coord)
                    {
                        var row = area_coord[0];
                        var col = area_coord[1];

                        if (row_start == undefined || row_start > row) row_start = row;
                        if (row_end == undefined || row_end < row) row_end = row;
                        if (col_start == undefined || col_start > col) col_start = col;
                        if (col_end == undefined || col_end < col) col_end = col;
                    }, this);

                    var template_rect = this._getTemplateRect(row_start, row_end, col_start, col_end);

                    var content_w = content.size[0];
                    var content_h = content.size[1];

                    // width / height 정수변환
                    content_w = this._parseContentSize(content_w, template_rect[2]);
                    content_h = this._parseContentSize(content_h, template_rect[3]);

                    // min / max 보정
                    content_w = this._getContentMinMaxSize(content_w, content.min_size[0], content.max_size[0]);
                    content_h = this._getContentMinMaxSize(content_h, content.min_size[1], content.max_size[1]);

                    if (this._fittocontents == 1 || this._fittocontents == 3) content.size[0] = content_w;
                    if (this._fittocontents == 2 || this._fittocontents == 3) content.size[1] = content_h;

                    var c_w = content_w;
                    var c_h = content_h;
                    var col_flex_sum = 0;
                    var row_flex_sum = 0;
                    var i, cell_info;

                    for (i = col_start; i <= col_end; i++)
                    {
                        cell_info = templateInfo[0][i];

                        if (cell_info._is_flexible_col)
                        {
                            col_flex_sum += cell_info._col_flexible_length;
                        }
                        else
                        {
                            c_w -= this._parseContentSize(cell_info._inner_col, this._contents_width);
                            if (cell_info._org_col.indexOf("%"))
                                cell_info._inner_col = template_rect[2];
                        }
                    }
                    for (i = row_start; i <= row_end; i++)
                    {
                        cell_info = templateInfo[i][0];

                        if (cell_info._is_flexible_row)
                        {
                            row_flex_sum += cell_info._row_flexible_length;
                        }
                        else
                        {
                            c_h -= this._parseContentSize(cell_info._inner_row, this._contents_height);
                            if (cell_info._org_row.indexOf("%"))
                                cell_info._inner_row = template_rect[3];
                        }
                    }

                    c_w -= (col_end - col_start) * col_gap;
                    c_h -= (row_end - row_start) * row_gap;

                    if (col_flex_sum > 0 && fr_w < c_w / col_flex_sum) fr_w = c_w / col_flex_sum;
                    if (row_flex_sum > 0 && fr_h < c_h / row_flex_sum) fr_h = c_h / row_flex_sum;

                    this._removeTableTemplateInfo(templateinfo_tmp, row_start, row_end, col_start, col_end);
                }
            }, this);
        }

        if (contents_coordinate.length)
        {
            contents_coordinate.forEach(function (content)
            {
                var row_start = content.rowstart;
                var col_start = content.colstart;
                var row_end = content.rowend;
                var col_end = content.colend;

                var template_rect = this._getTemplateRect(row_start, row_end, col_start, col_end);

                var content_w = content.size[0];
                var content_h = content.size[1];

                // width / height 정수변환
                content_w = this._parseContentSize(content_w, template_rect[2]);
                content_h = this._parseContentSize(content_h, template_rect[3]);

                // min / max 보정
                content_w = this._getContentMinMaxSize(content_w, content.min_size[0], content.max_size[0]);
                content_h = this._getContentMinMaxSize(content_h, content.min_size[1], content.max_size[1]);

                if (this._fittocontents == 1 || this._fittocontents == 3) content.size[0] = content_w;
                if (this._fittocontents == 2 || this._fittocontents == 3) content.size[1] = content_h;

                var c_w = content_w;
                var c_h = content_h;
                var col_flex_sum = 0;
                var row_flex_sum = 0;
                var i, cell_info;

                for (i = col_start; i <= col_end; i++)
                {
                    cell_info = templateInfo[0][i];

                    if (cell_info._is_flexible_col)
                    {
                        col_flex_sum += cell_info._col_flexible_length;
                    }
                    else
                    {
                        c_w -= this._parseContentSize(cell_info._inner_col, this._contents_width);
                        if (cell_info._org_col.indexOf("%"))
                            cell_info._inner_col = template_rect[2];
                    }
                }
                for (i = row_start; i <= row_end; i++)
                {
                    cell_info = templateInfo[i][0];

                    if (cell_info._is_flexible_row)
                    {
                        row_flex_sum += cell_info._row_flexible_length;
                    }
                    else
                    {
                        c_h -= this._parseContentSize(cell_info._inner_row, this._contents_height);
                        if (cell_info._org_row.indexOf("%"))
                            cell_info._inner_row = template_rect[3];
                    }
                }

                c_w -= (col_end - col_start) * col_gap;
                c_h -= (row_end - row_start) * row_gap;

                if (col_flex_sum > 0 && fr_w < c_w / col_flex_sum) fr_w = c_w / col_flex_sum;
                if (row_flex_sum > 0 && fr_h < c_h / row_flex_sum) fr_h = c_h / row_flex_sum;

                this._removeTableTemplateInfo(templateinfo_tmp, row_start, row_end, col_start, col_end);
            }, this);
        }

        if (contents_order.length)
        {
            contents_order.forEach(function (contents)
            {
                for (var i = 0; i < contents.length; i++)
                {
                    var content = contents[i];

                    var cell_info = this._findUsableCell(templateinfo_tmp);
                    if (cell_info)
                    {
                        var template_rect = this._getTemplateRect(cell_info._idx_row, cell_info._idx_row, cell_info._idx_col, cell_info._idx_col);

                        var content_w = content.size[0];
                        var content_h = content.size[1];

                        // width / height 정수변환
                        content_w = this._parseContentSize(content_w, template_rect[2]);
                        content_h = this._parseContentSize(content_h, template_rect[3]);

                        // min / max 보정
                        content_w = this._getContentMinMaxSize(content_w, content.min_size[0], content.max_size[0]);
                        content_h = this._getContentMinMaxSize(content_h, content.min_size[1], content.max_size[1]);

                        if (this._fittocontents == 1 || this._fittocontents == 3) content.size[0] = content_w;
                        if (this._fittocontents == 2 || this._fittocontents == 3) content.size[1] = content_h;

                        var c_w = 0;
                        var c_h = 0;

                        if (cell_info._is_flexible_col)
                        {
                            c_w = content_w / cell_info._col_flexible_length;
                            if (fr_w < c_w) fr_w = c_w;
                        }

                        if (cell_info._is_flexible_row)
                        {
                            c_h = content_h / cell_info._row_flexible_length;
                            if (fr_h < c_h) fr_h = c_h;
                        }
                    }
                }
            }, this);
        }

        // calc contents size
        if (this._fittocontents == 1 || this._fittocontents == 3)
        {
            var contents_w = 0;
            var col_len = 0;

            templateInfo[0].forEach(function (col_info)
            {
                if (col_info._is_flexible_col)
                    contents_w += fr_w * col_info._col_flexible_length;
                else
                    contents_w += this._parseContentSize(col_info._inner_col, this._contents_width);

                col_len++;
            }, this);

            var gap_sum_h = (col_len - 1) * col_gap;
            this._contents_width = contents_w + gap_sum_h;
        }
        if (this._fittocontents == 2 || this._fittocontents == 3)
        {
            var contents_h = 0
            var row_len = 0;

            templateInfo.forEach(function (row_info)
            {
                if (row_info[0]._is_flexible_row)
                    contents_h += fr_h * row_info[0]._row_flexible_length;
                else
                    contents_h += this._parseContentSize(row_info[0]._inner_row, this._contents_height);

                row_len++;
            }, this);

            var gap_sum_v = (row_len - 1) * row_gap;
            this._contents_height = contents_h + gap_sum_v;
        }
    };

    __pFluidLayoutManager._checkRecalcLayout = function (layoutInfo)
    {
        var ret = false;

        if (!ret) ret = this._checkScrollVisible(layoutInfo);

        return ret;
    };
    __pFluidLayoutManager._checkScrollVisible = function (layoutInfo)
    {
        var ret = false;
        if (this._is_panel) return ret;
        var last_info = layoutInfo[layoutInfo.length - 1];
        if (last_info)
        {
            var main_align = this._align[0];
            var cross_align = this._flexwrap ? this._align[2] : this._align[1];

            var safe_contents_width = 0;
            var safe_contents_height = 0;
            switch (this._direction)
            {
                case 0: // Horizontal
                    switch (main_align)
                    {
                        case 0: //LAYOUT_CONTENT_ALIGN_START
                        case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                            safe_contents_width = this._container_width - this._container_padding.left;
                            break;
                        case 1: //LAYOUT_CONTENT_ALIGN_END
                            safe_contents_width = this._container_width - this._container_padding.right;
                            this._is_apply_hscrollbar_size = true;
                            break;
                        case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                        case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                        case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                            safe_contents_width = this._container_width;
                            break;
                    }

                    switch (cross_align)
                    {
                        case 0: //LAYOUT_CONTENT_ALIGN_START
                        case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                            safe_contents_height = this._container_height - this._container_padding.top;
                            break;
                        case 1: //LAYOUT_CONTENT_ALIGN_END
                            safe_contents_height = this._container_height - this._container_padding.bottom;
                            this._is_apply_vscrollbar_size = true;
                            break;
                        case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                        case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                        case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                            safe_contents_height = this._container_height;
                            break;
                    }
                    if (last_info[0] > safe_contents_width)
                    {
                        if (!this._is_apply_hscrollbar_size)
                        {
                            if (this._fittocontents != 1 && this._fittocontents != 3)
                            {
                                this._is_apply_hscrollbar_size = true;
                                this._contents_height -= this._container_hscroll_size;
                                this._contents_height_remain = this._contents_height;
                                ret = true;
                            }
                        }
                        if (last_info[2] < 0)
                        {
                            if (!this._is_apply_vscrollbar_size)
                            {
                                this._is_apply_vscrollbar_size = true;
                                this._contents_width -= this._container_vscroll_size;
                                this._contents_width_remain = this._contents_width;
                                ret = true;
                            }
                        }
                    }
                    else if ((this._contents_height - last_info[2]) > safe_contents_height)
                    {
                        if (!this._is_apply_vscrollbar_size)
                        {
                            this._is_apply_vscrollbar_size = true;
                            this._contents_width -= this._container_vscroll_size;
                            this._contents_width_remain = this._contents_width;
                            ret = true;
                        }
                    }
                    break;
                case 1: // Vertical
                    switch (main_align)
                    {
                        case 0: //LAYOUT_CONTENT_ALIGN_START
                        case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                            safe_contents_height = this._container_height - this._container_padding.top;
                            break;
                        case 1: //LAYOUT_CONTENT_ALIGN_END
                            safe_contents_height = this._container_height - this._container_padding.bottom;
                            this._is_apply_vscrollbar_size = true;
                            break;
                        case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                        case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                        case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                            safe_contents_height = this._container_height;
                            break;
                    }

                    switch (cross_align)
                    {
                        case 0: //LAYOUT_CONTENT_ALIGN_START
                        case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                            safe_contents_width = this._container_width - this._container_padding.left;
                            break;
                        case 1: //LAYOUT_CONTENT_ALIGN_END
                            safe_contents_width = this._container_width - this._container_padding.right;
                            this._is_apply_hscrollbar_size = true;
                            break;
                        case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                        case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                        case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                            safe_contents_width = this._container_width;
                            break;
                    }
                    if (last_info[0] > safe_contents_height)
                    {
                        if (!this._is_apply_vscrollbar_size)
                        {
                            if (this._fittocontents != 2 && this._fittocontents != 3)
                            {
                                this._is_apply_vscrollbar_size = true;
                                this._contents_width -= this._container_vscroll_size;
                                this._contents_width_remain = this._contents_width;
                                ret = true;
                            }
                        }
                        if (last_info[2] < 0)
                        {
                            if (!this._is_apply_hscrollbar_size)
                            {
                                this._is_apply_hscrollbar_size = true;
                                this._contents_height -= this._container_hscroll_size;
                                this._contents_height_remain = this._contents_height;
                                ret = true;
                            }
                        }
                    }
                    else if ((this._contents_width - last_info[2]) > safe_contents_width)
                    {
                        if (!this._is_apply_hscrollbar_size)
                        {
                            this._is_apply_hscrollbar_size = true;
                            this._contents_height -= this._container_hscroll_size;
                            this._contents_height_remain = this._contents_height;
                            ret = true;
                        }
                    }
                    break;
            }
        }

        return ret;
    };

    // Flex Horizontal
    __pFluidLayoutManager._getHorizontalContentSizeInfoNoWrap = function ()
    {
        return [this._calcFluidHorizontalContentSize()];
    };
    __pFluidLayoutManager._getHorizontalContentSizeInfoWrap = function ()
    {
        var ret = [];
        var contents = this._fluidcontents;

        var c_cnt = 0;

        var c_m_sum = 0;    // contents_main_sum
        var c_c_max = 0;    // contents_cross_max

        var c_m_space = 0   // container_main_spae
        var c_c_space = 0;  // container_cross_space

        var gap = this._gap;

        var contents_w = this._contents_width;
        var contents_h = this._contents_height;

        contents.forEach(function (content, idx, orgArr)
        {
            var is_last = idx == (orgArr.length - 1);

            var c_w = content.size[0];
            var c_h = content.size[1];

            var comp_width = this._contents_width;
            var comp_height = this._contents_height;

            // position base
            var info = content._target._arrange_info;
            if (info)
            {
                var obj, comp, distance, refer_font;
                if (obj = info.width)
                {
                    distance = obj.distance;
                    comp = content._target._findComponentForArrange(obj.compid);
                    if (comp)
                    {
                        c_w = distance;
                        comp_width = comp._width;
                    }
                    else
                    {
                        if (distance.indexOf("em") > -1)
                        {
                            comp = content._target;
                            if (distance.indexOf("rem") > -1)
                            {
                                comp = comp._getMainFrame();
                            }

                            refer_font = comp._getReferenceAbsoluteFont();

                            c_w = distance;
                            comp_width = refer_font ? refer_font._size : 1;
                        }
                    }
                }

                if (obj = info.height)
                {
                    distance = obj.distance;
                    comp = content._target._findComponentForArrange(obj.compid);
                    if (comp)
                    {
                        c_h = distance;
                        comp_height = comp._height;
                    }
                    else
                    {
                        if (distance.indexOf("em") > -1)
                        {
                            comp = content._target;
                            if (distance.indexOf("rem") > -1)
                            {
                                comp = comp._getMainFrame();
                            }

                            refer_font = comp._getReferenceAbsoluteFont();

                            c_h = distance;
                            comp_height = refer_font ? refer_font._size : 1;
                        }
                    }
                }
            }

            // width / height 정수변환
            c_w = this._parseContentSize(c_w, comp_width);
            c_h = this._parseContentSize(c_h, comp_height);

            content._size = [c_w, c_h];

            // min / max 보정
            c_w = this._getContentMinMaxSize(c_w, content.min_size[0], content.max_size[0]);
            c_h = this._getContentMinMaxSize(c_h, content.min_size[1], content.max_size[1]);

            // FloatingPoint 보정
            c_w = this._adjustFloatingPoint(c_w);
            c_h = this._adjustFloatingPoint(c_h);

            var is_over;
            switch (this._fittocontents)
            {
                case 0: // none
                case 2: // height
                    is_over = (c_m_sum + c_w) > contents_w;
                    break;
                case 1: // width
                case 3: // both
                    is_over = false;
                    break;
            }

            // 총합계 계산
            if (is_last)
            {
                // 마지막 컨텐츠
                if (is_over)
                {
                    // 나를 배치 불가능
                    // 이전에 더하고 온 갭 제외
                    // 현재 정보까지를 저장하고 다음라인 변경.

                    c_m_sum -= gap[0];
                    c_m_space = contents_w - c_m_sum;
                    c_c_space = contents_h - c_c_max - gap[1];

                    ret.push([this._adjustFloatingPoint(c_m_sum), this._adjustFloatingPoint(c_m_space), this._adjustFloatingPoint(c_c_space), c_cnt, this._adjustFloatingPoint(c_c_max)]);

                    c_cnt = 1;
                    c_m_sum = c_w;
                    c_m_space = contents_w - c_m_sum;
                    c_c_space -= c_h;

                    ret.push([this._adjustFloatingPoint(c_m_sum), this._adjustFloatingPoint(c_m_space), this._adjustFloatingPoint(c_c_space), c_cnt, this._adjustFloatingPoint(c_c_max)]);
                }
                else
                {
                    // 나를 배치 가능
                    // 전체 컨텐츠 더하고. 카운팅 넣고.

                    c_cnt++;
                    c_m_sum += c_w;
                    c_c_max = c_h > c_c_max ? c_h : c_c_max;

                    c_m_space = contents_w - c_m_sum;
                    c_c_space = contents_h - c_c_max;

                    ret.push([this._adjustFloatingPoint(c_m_sum), this._adjustFloatingPoint(c_m_space), this._adjustFloatingPoint(c_c_space), c_cnt, this._adjustFloatingPoint(c_c_max)]);
                }
            }
            else
            {
                // 다음 컨텐츠가 있음
                if (is_over)
                {
                    // 컨텐츠 배치 불가능함. 다음라인에 배치될거임
                    // 이전에 더하고 온 갭 제외
                    // 현재 정보까지를 저장하고 라인 변경을 위한 초기화.

                    c_m_sum -= gap[0];
                    c_m_space = contents_w - c_m_sum;
                    c_c_space = contents_h - c_c_max - gap[1];
                    contents_h = c_c_space;

                    ret.push([this._adjustFloatingPoint(c_m_sum), this._adjustFloatingPoint(c_m_space), this._adjustFloatingPoint(c_c_space), c_cnt, this._adjustFloatingPoint(c_c_max)]);

                    c_cnt = 1;
                    c_m_sum = c_w;
                    c_m_sum += gap[0];
                    c_c_max = c_h;
                }
                else
                {
                    // 현재 컨텐츠 배치 가능함.
                    // 전체 컨텐츠에 더하고. 갭넣고. 카운팅 더하고.

                    c_cnt++;
                    c_m_sum += c_w;
                    c_m_sum += gap[0];

                    c_c_max = c_h > c_c_max ? c_h : c_c_max;
                }
            }

            // 컨텐츠 크기 설정
            // 컨텐츠 위치는 나중에 지정
            this._setContentAdjustSize(content, 0, 0, c_w, c_h);
        }, this);

        return ret;
    };

    __pFluidLayoutManager._getFluidHorizontalContentSizeInfoNoWrap = function ()
    {
        var ret = [];

        ret = this._calcFluidHorizontalContentSize();
        ret = this._growFluidHorizontalContent(ret);
        ret = this._shrinkFluidHorizontalContent(ret);

        return [ret];
    };
    __pFluidLayoutManager._getFluidHorizontalContentSizeInfoWrap = function ()
    {
        // wrap은 shrink를 무시하고 줄바꿈처리
        var ret = [];

        ret = this._calcFluidHorizontalContentSize();

        if (ret[1] >= 0)
        {
            // 여백이 있으면 wrap을 하지 않음
            ret = [this._growFluidHorizontalContent(ret)];
        }
        else
        {
            // 여백이 없을때만 wrap 계산
            ret = this._wrapFluidHorizontalContent(ret);
        }

        return ret;
    };

    __pFluidLayoutManager._calcFluidHorizontalContentSize = function (contentsList)
    {
        var contents = contentsList ? contentsList : this._fluidcontents;

        var c_cnt = 0;          // contents_count

        var c_sum = 0;          // contents_sum
        var c_m_sum = 0;        // contents_main_sum
        var g_sum = this._gap[0] * (contents.length - 1);   // gap_sum

        var c_c_max = 0;        // contents_cross_max

        var c_m_space = 0;    // container_main_space
        var c_c_space = 0;    // container_cross_space

        contents.forEach(function (content)
        {
            var c_w = content.size[0];
            var c_h = content.size[1];

            var comp_width = this._contents_width;
            var comp_height = this._contents_height;

            // position base
            var info = content._target._arrange_info;
            if (info)
            {
                var obj, comp, distance, refer_font;
                if (obj = info.width)
                {
                    distance = obj.distance;
                    comp = content._target._findComponentForArrange(obj.compid);
                    if (comp)
                    {
                        c_w = distance;
                        comp_width = comp._width;
                    }
                    else
                    {
                        if (distance.indexOf("em") > -1)
                        {
                            comp = content._target;
                            if (distance.indexOf("rem") > -1)
                            {
                                comp = comp._getMainFrame();
                            }

                            refer_font = comp._getReferenceAbsoluteFont();

                            c_w = distance;
                            comp_width = refer_font ? refer_font._size : 1;
                        }
                    }
                }

                if (obj = info.height)
                {
                    distance = obj.distance;
                    comp = content._target._findComponentForArrange(obj.compid);
                    if (comp)
                    {
                        c_h = distance;
                        comp_height = comp._height;
                    }
                    else
                    {
                        if (distance.indexOf("em") > -1)
                        {
                            comp = content._target;
                            if (distance.indexOf("rem") > -1)
                            {
                                comp = comp._getMainFrame();
                            }

                            refer_font = comp._getReferenceAbsoluteFont();

                            c_h = distance;
                            comp_height = refer_font ? refer_font._size : 1;
                        }
                    }
                }
            }

            c_cnt++;

            // width / height 정수변환
            c_w = this._parseContentSize(c_w, comp_width);
            c_h = this._parseContentSize(c_h, comp_height);

            content._size = [c_w, c_h];

            // min / max 보정
            c_w = this._getContentMinMaxSize(c_w, content.min_size[0], content.max_size[0]);
            c_h = this._getContentMinMaxSize(c_h, content.min_size[1], content.max_size[1]);

            c_w = this._adjustFloatingPoint(c_w);
            c_h = this._adjustFloatingPoint(c_h);

            c_sum += c_w;
            c_c_max = c_h > c_c_max ? c_h : c_c_max;

            this._setContentAdjustSize(content, 0, 0, c_w, c_h);
        }, this);

        c_m_sum = this._adjustFloatingPoint(c_sum + g_sum);

        switch (this._fittocontents)
        {
            case 0: // none
                c_m_space = this._adjustFloatingPoint(this._contents_width_remain - c_m_sum);
                c_c_space = this._adjustFloatingPoint(this._contents_height_remain - c_c_max);
                break;
            case 1: // width
                c_m_space = 0;
                c_c_space = this._adjustFloatingPoint(this._contents_height_remain - c_c_max);
                break;
            case 2: // height
                c_m_space = this._adjustFloatingPoint(this._contents_width_remain - c_m_sum);
                c_c_space = 0;
                break;
            case 3: // both
                c_m_space = 0;
                c_c_space = 0;
                break;
        }

        // [contents_main_sum, container_main_spacing, container_cross_spacing, content_count, content_cross_maxsize]
        return [c_m_sum, c_m_space, c_c_space, c_cnt, c_c_max];
    };

    __pFluidLayoutManager._growFluidHorizontalContent = function (sizeInfo, contentsList)
    {
        // 여백이 있을때만 grow 계산
        if (sizeInfo[1] <= 0)
            return sizeInfo;

        var contents = contentsList ? contentsList : this._fluidcontents;
        var no_limited_contents = [];
        var grow_total = 0;
        var grow_info = contents.reduce(function (acc, content)
        {
            if (content.grow > 0 && content._adjust_pos[2] > 0)
            {
                acc[1].push(content);
                acc[0] += content.grow;
            }
            return acc;
        }, [0, []]);

        grow_info[1].forEach(function (content)
        {
            if (!(content.fittocontents == "width" || content.fittocontents == "both"))
            {
                var content_width = this._getContentAdjustWidth(content);

                var grow_rate = content.grow / grow_info[0];
                var grow_size = grow_rate * sizeInfo[1];
                var grow_width = content_width + grow_size;

                var adjsut_width = this._getContentMinMaxSize(grow_width, content.min_size[0], content.max_size[0]);
                if (grow_width == adjsut_width)
                {
                    no_limited_contents.push(content);
                }

                adjsut_width = this._adjustFloatingPoint(adjsut_width);
                grow_total += adjsut_width - content_width;

                this._setContentAdjustWidth(content, adjsut_width);
            }

        }, this);


        sizeInfo[0] = this._adjustFloatingPoint(sizeInfo[0] + grow_total); // 변경된 차이만큼 컨텐츠 총합에 더해야함
        sizeInfo[1] = this._adjustFloatingPoint(sizeInfo[1] - grow_total); // 변경된 차이만큼 여백에서 빼야함

        // 오차범위 포함한 재귀
        if (no_limited_contents.length && sizeInfo[1] > 0.05 && grow_total != 0)
        {
            sizeInfo = this._growFluidHorizontalContent(sizeInfo, no_limited_contents)
        }

        return sizeInfo;
    };
    __pFluidLayoutManager._shrinkFluidHorizontalContent = function (sizeInfo, contentsList)
    {
        // 여백이 없을때만 shrink 계산
        if (sizeInfo[1] >= 0)
            return sizeInfo;

        var contents = contentsList ? contentsList : this._fluidcontents;
        var brecalc = true;
        // shrink가 있을때 보정할 기준 계산
        var shrink_total = 0;
        var shrink_info = contents.reduce(function (acc, content)
        {
            if (content.shrink > 0 && content._adjust_pos[2] > 0)
            {
                acc[0].push(content._adjust_pos[2]);
                acc[1].push(content);
                acc[2] += content._adjust_pos[2] * content.shrink;
            }
            return acc;
        }, [[], [], 0]);

        shrink_info[1].forEach(function (content, idx)
        {
            var adjsut_width = 0;
            var content_width = this._getContentAdjustWidth(content);
            var fittocontents = content.fittocontents;
            if (fittocontents != "both" && fittocontents != "width")
            {
                var basis_width = shrink_info[0][idx] * content.shrink;

                var shrink_rate = basis_width / shrink_info[2];
                var shrink_size = shrink_rate * sizeInfo[1];
                var shrink_width = content_width + shrink_size;

                adjsut_width = this._getContentMinMaxSize(shrink_width, content.min_size[0], content.max_size[0]);
                if (adjsut_width >= 0)
                {
                    adjsut_width = this._adjustFloatingPoint(adjsut_width);
                }
                if (adjsut_width == content.min_size[0] || adjsut_width == content.max_size[0])
                    brecalc = false;
                this._setContentAdjustWidth(content, adjsut_width);
            }
            shrink_total += content_width - adjsut_width;

        }, this);

        sizeInfo[0] = this._adjustFloatingPoint(sizeInfo[0] - shrink_total); // 변경된 차이만큼 컨텐츠 총합에서 빼야함
        sizeInfo[1] = this._adjustFloatingPoint(sizeInfo[1] + shrink_total); // 변경된 차이만큼 여백에선 더해야함

        // 컨텐츠 과분이 있으면 보이는 컨텐츠들을 계속 줄여나가야함
        if (shrink_info[1].length && sizeInfo[1] < 0 && brecalc)
        {
            sizeInfo = this._shrinkFluidHorizontalContent(sizeInfo);
        }

        return sizeInfo;
    };
    __pFluidLayoutManager._wrapFluidHorizontalContent = function (sizeInfo, contentsList, isRecursive)
    {
        var contents = contentsList ? contentsList : this._fluidcontents;
        var curr_content = contents.slice(); // 복사해서 사용
        var wrap_content = [];

        var content_width = 0;
        var content_main_gap = this._gap[0];
        var content_cross_gap = this._gap[1];
        var main_spacing = sizeInfo[1];     // 음수임

        for (var i = contents.length - 1; i >= 0; i--)
        {
            var content = contents[i];

            if (main_spacing >= 0)
            {
                // 여백이 양수가 된순간 curr와 wrap을 각각 계산
                // wrap 결과는 또다시 여백이 음수일수 있음
                var curr_info = this._calcFluidHorizontalContentSize(curr_content);

                this._contents_height_remain = curr_info[2] - content_cross_gap;

                var wrap_info = this._calcFluidHorizontalContentSize(wrap_content);

                // wrap 계산에서 음수가 안나올때까지 계산해야함
                if (wrap_info[1] < 0)
                {
                    // wrap_contents가 2개 이상일때만 추가로 wrap을 할수가 있음
                    if (wrap_content.length > 1)
                    {
                        sizeInfo = this._wrapFluidHorizontalContent(wrap_info, wrap_content, true);
                        curr_info = this._growFluidHorizontalContent(curr_info, curr_content);

                        sizeInfo.splice(0, 0, curr_info);
                    }
                    else
                    {
                        // wrap된게 한개면 계산 끝냄. 여백이 마이너스 여도 shrink 적용은 하지 않음
                        curr_info = this._growFluidHorizontalContent(curr_info, curr_content);
                        wrap_info = this._shrinkFluidHorizontalContent(wrap_info, wrap_content);

                        sizeInfo = [curr_info];
                        sizeInfo.push(wrap_info);
                    }

                    break;
                }
                else
                {
                    // 줄나누기가 끝났으면 각 라인에 grow 적용
                    curr_info = this._growFluidHorizontalContent(curr_info, curr_content);
                    wrap_info = this._growFluidHorizontalContent(wrap_info, wrap_content);

                    if (isRecursive)
                    {
                        // 재귀로 사용시 바로 반환
                        return [curr_info, wrap_info];
                    }
                    else
                    {
                        // 두줄로 끝나는 wrap임
                        sizeInfo = [curr_info, wrap_info];
                        break;
                    }
                }
            }
            else
            {
                // 공백이 음수. 컨텐츠를 나눠야함
                if (curr_content.length > 1)
                {
                    content_width = this._getContentAdjustWidth(content);

                    wrap_content.splice(0, 0, curr_content.pop());  // 다음줄로 보내고
                    main_spacing += content_width;                  // 공백 줄여보고
                    main_spacing += content_main_gap;               // 컨텐츠 하나 빠졌으니 갭도 하나 뺌
                }
                else
                {
                    // 공백이 음수지만 현재 컨텐츠가 한개밖에 없음. 더빼면 안됨. 현시점 기준으로 계산을 끝냄
                    var curr_info = this._calcFluidHorizontalContentSize(curr_content);

                    this._contents_height_remain = curr_info[2] - content_cross_gap;

                    var wrap_info = this._calcFluidHorizontalContentSize(wrap_content);
                    if (wrap_info[1] < 0)
                    {
                        if (wrap_content.length > 1)
                        {
                            sizeInfo = this._wrapFluidHorizontalContent(wrap_info, wrap_content, true);
                            curr_info = this._growFluidHorizontalContent(curr_info, curr_content);
                            curr_info = this._shrinkFluidHorizontalContent(curr_info, curr_content);

                            sizeInfo.splice(0, 0, curr_info);
                        }
                        else
                        {
                            curr_info = this._growFluidHorizontalContent(curr_info, curr_content);
                            curr_info = this._shrinkFluidHorizontalContent(curr_info, curr_content);
                            wrap_info = this._shrinkFluidHorizontalContent(wrap_info, wrap_content);

                            sizeInfo = [curr_info];
                            sizeInfo.push(wrap_info);
                        }

                        break;
                    }
                    else
                    {
                        curr_info = this._growFluidHorizontalContent(curr_info, curr_content);
                        curr_info = this._shrinkFluidHorizontalContent(curr_info, curr_content);
                        wrap_info = this._growFluidHorizontalContent(wrap_info, wrap_content);

                        if (isRecursive)
                        {
                            return [curr_info, wrap_info];
                        }
                        else
                        {
                            sizeInfo = [curr_info, wrap_info];
                            break;
                        }
                    }
                    //sizeInfo = [curr_info];
                }
            }
        }
        return sizeInfo;
    };

    __pFluidLayoutManager._adjustHorizontalContent = function (layoutInfo)
    {
        // 인포가 없을상황이면 안됨..
        if (layoutInfo.length == 0)
            return;

        switch (this._flexwrap)
        {
            case 0: // NOWRAP
                this._adjustHorizontalContentSingleLine(layoutInfo);
                break;
            case 1: // WRAP
                this._adjustHorizontalContentMultiLine(layoutInfo);
                break;
        }
    };
    __pFluidLayoutManager._adjustHorizontalContentSingleLine = function (layoutInfo)
    {
        var info = layoutInfo[0];

        var m_space = 0;

        var pad_l = this._container_padding.left;
        var pad_t = this._container_padding.top;
        var pad_r = this._container_padding.right;
        var pad_b = this._container_padding.bottom;

        var gap = this._gap;

        var main_align = this._align[0];
        var cross_align = this._align[1];

        var main_spacing = info[1];
        var cross_spacing = info[2];
        var content_len = info[3];
        var cross_max = info[4];

        var l = 0;
        var t = 0;

        // Main 보정
        switch (main_align)
        {
            case 0: //LAYOUT_CONTENT_ALIGN_START
                l += pad_l;
                break;
            case 1: //LAYOUT_CONTENT_ALIGN_END
                m_space = main_spacing;
                l += pad_l + m_space;
                break;
            case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                m_space = main_spacing / 2;
                l += pad_l + m_space;
                break;
            case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                m_space = (main_spacing > 0) ? main_spacing / (content_len - 1) : 0;
                l += pad_l;
                break;
            case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                m_space = (main_spacing > 0) ? main_spacing / (content_len * 2) : main_spacing / 2;
                l += pad_l + m_space;
                break;
            case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                m_space = (main_spacing > 0) ? main_spacing / (content_len + 1) : main_spacing / 2;
                l += pad_l + m_space;
                break;
        }

        // Cross 여백 보정
        switch (cross_align)
        {
            case 0: //LAYOUT_CONTENT_ALIGN_START
                t += pad_t;
                break;
            case 1: //LAYOUT_CONTENT_ALIGN_END
                t += pad_t + cross_spacing;
                break;
            case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                t += pad_t + (cross_spacing / 2);
                break;
        }

        // Adjust 계산
        this._fluidcontents.forEach(function (content)
        {
            var pos = content._adjust_pos;

            l = this._adjustFloatingPoint(l);

            pos[0] = l;

            l += gap[0];
            l += pos[2];
            if (l < 0) l = 0;

            // 다음 content 간격
            switch (main_align)
            {
                case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                    l += (main_spacing > 0) ? m_space : 0;
                    break;
                case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                    l += (main_spacing > 0) ? (m_space * 2) : 0;
                    break;
            }

            // content 개별 top 높이 조절
            switch (cross_align)
            {
                case 0: //LAYOUT_CONTENT_ALIGN_START
                    pos[1] = this._adjustFloatingPoint(t);
                    break;
                case 1: //LAYOUT_CONTENT_ALIGN_END
                    pos[1] = this._adjustFloatingPoint(t + (cross_max - pos[3]));
                    break;
                case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                    pos[1] = this._adjustFloatingPoint(t + ((cross_max - pos[3]) / 2));
                    break;
                case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                    // 동작 없음. 이쪽으로 들어올때 버그의심
                    break;
            }

            // 최대 rect 저장
            var curr_right = 0;
            if (pos[2] > 0)
                curr_right = pos[0] + pos[2] + pad_r;
            var curr_bottom = 0;
            if (pos[3] > 0)
                curr_bottom = pos[1] + pos[3] + pad_b;

            if (curr_right > this._getContentMaxRight()) this._setContentMaxRight(curr_right);
            if (curr_bottom > this._getContentMaxBottom()) this._setContentMaxBottom(curr_bottom);
        }, this);
    };
    __pFluidLayoutManager._adjustHorizontalContentMultiLine = function (layoutInfo)
    {
        var info;
        var info_len = layoutInfo.length;

        var pos;
        var content;
        var m_space = 0;
        var c_space = 0;

        var pad_l = this._container_padding.left;
        var pad_t = this._container_padding.top;
        var pad_r = this._container_padding.right;
        var pad_b = this._container_padding.bottom;

        var gap = this._gap;

        var main_align = this._align[0];
        var cross_align = this._align[1];
        var cross_wrapalign = this._align[2];

        var main_spacing = 0;
        var cross_spacing = layoutInfo[info_len - 1][2];

        var l = 0;
        var t = 0;

        // Container cross 여백 보정
        switch (cross_wrapalign)
        {
            case 0: //LAYOUT_CONTENT_ALIGN_START
                t += pad_t;
                break;
            case 1: //LAYOUT_CONTENT_ALIGN_END
                t += pad_t + cross_spacing;
                break;
            case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                t += pad_t + (cross_spacing / 2);
                break;
            case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                c_space = (cross_spacing > 0) ? cross_spacing / (info_len - 1) : 0;
                t += pad_t;
                break;
            case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                c_space = (cross_spacing > 0) ? cross_spacing / (info_len * 2) : cross_spacing / 2;
                t += pad_t + c_space;
                break;
            case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                c_space = (cross_spacing > 0) ? cross_spacing / (info_len + 1) : cross_spacing / 2;
                t += pad_t + c_space;
                break;
        }

        var i = 0;
        var j = 0;
        for (; i < info_len; i++)
        {
            info = layoutInfo[i];

            main_spacing = info[1];
            var content_len = info[3];
            var cross_max = info[4];

            // 시작위치 결정
            l = 0;

            // Main 보정
            switch (main_align)
            {
                case 0: //LAYOUT_CONTENT_ALIGN_START
                    l += pad_l;
                    break;
                case 1: //LAYOUT_CONTENT_ALIGN_END
                    m_space = main_spacing;
                    l += pad_l + m_space;
                    break;
                case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                    m_space = main_spacing / 2;
                    l += pad_l + m_space;
                    break;
                case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                    m_space = (main_spacing > 0) ? main_spacing / (content_len - 1) : 0;
                    l += pad_l;
                    break;
                case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                    m_space = (main_spacing > 0) ? main_spacing / (content_len * 2) : main_spacing / 2;
                    l += pad_l + m_space;
                    break;
                case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                    m_space = (main_spacing > 0) ? main_spacing / (content_len + 1) : main_spacing / 2;
                    l += pad_l + m_space;
                    break;
            }

            // adjust 계산
            while (content_len)
            {
                content = this._fluidcontents[j];
                pos = content._adjust_pos;

                l = this._adjustFloatingPoint(l);

                pos[0] = l;

                l += gap[0];
                l += pos[2];
                if (l < 0) l = 0;

                switch (main_align)
                {
                    case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                    case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                        l += (main_spacing > 0) ? m_space : 0;
                        break;
                    case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                        l += (main_spacing > 0) ? (m_space * 2) : 0;
                        break;
                }

                switch (cross_align)
                {
                    case 0: //LAYOUT_CONTENT_ALIGN_START
                        pos[1] = this._adjustFloatingPoint(t);
                        break;
                    case 1: //LAYOUT_CONTENT_ALIGN_END
                        pos[1] = this._adjustFloatingPoint(t + (cross_max - pos[3]));
                        break;
                    case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                        pos[1] = this._adjustFloatingPoint(t + ((cross_max - pos[3]) / 2));
                        break;
                    case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                    case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                    case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                        // 동작 없음. 이쪽으로 들어올때 버그의심
                        break;
                }

                // 최대 rect 저장
                var max_right = this._getContentMaxRight();
                var max_bottom = this._getContentMaxBottom();

                if ((pos[0] + pos[2] + pad_r) > max_right)
                {
                    this._setContentMaxRight(pos[0] + pos[2] + pad_r);
                }
                if ((pos[1] + pos[3] + pad_b) > max_bottom)
                {
                    this._setContentMaxBottom(pos[1] + pos[3] + pad_b);
                }

                j++
                content_len--;
            }

            // next top pos
            if (info[3])
            {
                t += cross_max;
                t += gap[1];
            }

            switch (cross_wrapalign)
            {
                case 0: //LAYOUT_CONTENT_ALIGN_START
                case 1: //LAYOUT_CONTENT_ALIGN_END
                case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                    t += (cross_spacing > 0) ? c_space : 0;
                    break;
                case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                    t += (cross_spacing > 0) ? (c_space * 2) : 0;
                    break;
            }
        }
    };

    // Flex Vertical
    __pFluidLayoutManager._getVerticalContentSizeInfoNoWrap = function ()
    {
        return [this._calcFluidVerticalContentSize()];
    };
    __pFluidLayoutManager._getVerticalContentSizeInfoWrap = function ()
    {
        var ret = [];
        var contents = this._fluidcontents;

        var c_cnt = 0;

        var c_m_sum = 0;    // contents_main_sum
        var c_c_max = 0;    // contents_cross_max

        var c_m_space = 0   // container_main_spae
        var c_c_space = 0;  // container_cross_space

        var gap = this._gap;

        var contents_w = this._contents_width;
        var contents_h = this._contents_height;

        contents.forEach(function (content, idx, orgArr)
        {
            var is_last = idx == (orgArr.length - 1);

            var c_w = content.size[0];
            var c_h = content.size[1];

            var comp_width = this._contents_width;
            var comp_height = this._contents_height;

            // position base
            var info = content._target._arrange_info;
            if (info)
            {
                var obj, comp, distance, refer_font;
                if (obj = info.width)
                {
                    distance = obj.distance;
                    comp = content._target._findComponentForArrange(obj.compid);
                    if (comp)
                    {
                        c_w = distance;
                        comp_width = comp._width;
                    }
                    else
                    {
                        if (distance.indexOf("em") > -1)
                        {
                            comp = content._target;
                            if (distance.indexOf("rem") > -1)
                            {
                                comp = comp._getMainFrame();
                            }

                            refer_font = comp._getReferenceAbsoluteFont();

                            c_w = distance;
                            comp_width = refer_font ? refer_font._size : 1;
                        }
                    }
                }

                if (obj = info.height)
                {
                    distance = obj.distance;
                    comp = content._target._findComponentForArrange(obj.compid);
                    if (comp)
                    {
                        c_h = distance;
                        comp_height = comp._height;
                    }
                    else
                    {
                        if (distance.indexOf("em") > -1)
                        {
                            comp = content._target;
                            if (distance.indexOf("rem") > -1)
                            {
                                comp = comp._getMainFrame();
                            }

                            refer_font = comp._getReferenceAbsoluteFont();

                            c_h = distance;
                            comp_height = refer_font ? refer_font._size : 1;
                        }
                    }
                }
            }

            // width / height 정수변환
            c_w = this._parseContentSize(c_w, comp_width);
            c_h = this._parseContentSize(c_h, comp_height);

            content._size = [c_w, c_h];

            // min / max 보정
            c_w = this._getContentMinMaxSize(c_w, content.min_size[0], content.max_size[0]);
            c_h = this._getContentMinMaxSize(c_h, content.min_size[1], content.max_size[1]);

            // FloatingPoint 보정
            c_w = this._adjustFloatingPoint(c_w);
            c_h = this._adjustFloatingPoint(c_h);

            var is_over;
            switch (this._fittocontents)
            {
                case 0: // none
                case 1: // width
                    is_over = (c_m_sum + c_h) > contents_h;
                    break;
                case 2: // height
                case 3: // both
                    is_over = false;
                    break;
            }

            // 총합계 계산
            if (is_last)
            {
                // 마지막 컨텐츠
                if (is_over)
                {
                    // 나를 배치 불가능
                    // 이전에 더하고 온 갭 제외
                    // 현재 정보까지를 저장하고 다음라인 변경.

                    c_m_sum -= gap[1];
                    c_m_space = contents_h - c_m_sum;
                    c_c_space = contents_w - c_c_max - gap[0];

                    ret.push([this._adjustFloatingPoint(c_m_sum), this._adjustFloatingPoint(c_m_space), this._adjustFloatingPoint(c_c_space), c_cnt, this._adjustFloatingPoint(c_c_max)]);

                    c_cnt = 1;
                    c_m_sum = c_h;
                    c_m_space = contents_h - c_m_sum;
                    c_c_space -= c_w;

                    ret.push([this._adjustFloatingPoint(c_m_sum), this._adjustFloatingPoint(c_m_space), this._adjustFloatingPoint(c_c_space), c_cnt, this._adjustFloatingPoint(c_c_max)]);
                }
                else
                {
                    // 나를 배치 가능
                    // 전체 컨텐츠 더하고. 카운팅 넣고.

                    c_cnt++;
                    c_m_sum += c_h;
                    c_c_max = c_w > c_c_max ? c_w : c_c_max;

                    c_m_space = contents_h - c_m_sum;
                    c_c_space = contents_w - c_c_max;

                    ret.push([this._adjustFloatingPoint(c_m_sum), this._adjustFloatingPoint(c_m_space), this._adjustFloatingPoint(c_c_space), c_cnt, this._adjustFloatingPoint(c_c_max)]);
                }
            }
            else
            {
                // 다음 컨텐츠가 있음
                if (is_over)
                {
                    // 컨텐츠 배치 불가능함. 다음라인에 배치될거임
                    // 이전에 더하고 온 갭 제외
                    // 현재 정보까지를 저장하고 라인 변경을 위한 초기화.

                    c_m_sum -= gap[1];
                    c_m_space = contents_h - c_m_sum;
                    c_c_space = contents_w - c_c_max - gap[0];
                    contents_w = c_c_space;

                    ret.push([this._adjustFloatingPoint(c_m_sum), this._adjustFloatingPoint(c_m_space), this._adjustFloatingPoint(c_c_space), c_cnt, this._adjustFloatingPoint(c_c_max)]);

                    c_cnt = 1;
                    c_m_sum = c_h;
                    c_m_sum += gap[1];
                    c_c_max = c_w;
                }
                else
                {
                    // 현재 컨텐츠 배치 가능함.
                    // 전체 컨텐츠에 더하고. 갭넣고. 카운팅 더하고.

                    c_cnt++;
                    c_m_sum += c_h;
                    c_m_sum += gap[1];

                    c_c_max = c_w > c_c_max ? c_w : c_c_max;
                }
            }

            // 컨텐츠 크기 설정
            // 컨텐츠 위치는 나중에 지정
            this._setContentAdjustSize(content, 0, 0, c_w, c_h);
        }, this);

        return ret;
    };

    __pFluidLayoutManager._getFluidVerticalContentSizeInfoNoWrap = function ()
    {
        var ret = [];

        ret = this._calcFluidVerticalContentSize();
        ret = this._growFluidVerticalContent(ret);
        ret = this._shrinkFluidVerticalContent(ret);

        return [ret];
    };
    __pFluidLayoutManager._getFluidVerticalContentSizeInfoWrap = function ()
    {
        // wrap은 shrink를 무시하고 줄바꿈처리
        var ret = [];

        ret = this._calcFluidVerticalContentSize();

        if (ret[1] >= 0)
        {
            // 여백이 있으면 wrap을 하지 않음
            ret = [this._growFluidVerticalContent(ret)];
        }
        else
        {
            // 여백이 없을때만 wrap 계산
            ret = this._wrapFluidVerticalContent(ret);
        }

        return ret;
    };

    __pFluidLayoutManager._calcFluidVerticalContentSize = function (contentsList)
    {
        var contents = contentsList ? contentsList : this._fluidcontents;

        var c_cnt = 0;          // contents_count

        var c_sum = 0;          // contents_sum
        var c_m_sum = 0;        // contents_main_sum
        var g_sum = this._gap[1] * (contents.length - 1);   // gap_sum

        var c_c_max = 0;        // contents_cross_max

        var c_m_space = 0;    // container_main_space
        var c_c_space = 0;    // container_cross_space

        contents.forEach(function (content)
        {
            var c_w = content.size[0];
            var c_h = content.size[1];

            var comp_width = this._contents_width;
            var comp_height = this._contents_height;

            // position base
            var info = content._target._arrange_info;
            if (info)
            {
                var obj, comp, distance, refer_font;
                if (obj = info.width)
                {
                    distance = obj.distance;
                    comp = content._target._findComponentForArrange(obj.compid);
                    if (comp)
                    {
                        c_w = distance;
                        comp_width = comp._width;
                    }
                    else
                    {
                        if (distance.indexOf("em") > -1)
                        {
                            comp = content._target;
                            if (distance.indexOf("rem") > -1)
                            {
                                comp = comp._getMainFrame();
                            }

                            refer_font = comp._getReferenceAbsoluteFont();

                            c_w = distance;
                            comp_width = refer_font ? refer_font._size : 1;
                        }
                    }
                }

                if (obj = info.height)
                {
                    distance = obj.distance;
                    comp = content._target._findComponentForArrange(obj.compid);
                    if (comp)
                    {
                        c_h = distance;
                        comp_height = comp._height;
                    }
                    else
                    {
                        if (distance.indexOf("em") > -1)
                        {
                            comp = content._target;
                            if (distance.indexOf("rem") > -1)
                            {
                                comp = comp._getMainFrame();
                            }

                            refer_font = comp._getReferenceAbsoluteFont();

                            c_h = distance;
                            comp_height = refer_font ? refer_font._size : 1;
                        }
                    }
                }
            }

            c_cnt++;

            // width / height 정수변환
            c_w = this._parseContentSize(c_w, comp_width);
            c_h = this._parseContentSize(c_h, comp_height);

            content._size = [c_w, c_h];

            // min / max 보정
            c_w = this._getContentMinMaxSize(c_w, content.min_size[0], content.max_size[0]);
            c_h = this._getContentMinMaxSize(c_h, content.min_size[1], content.max_size[1]);

            // FloatingPoint 보정
            c_w = this._adjustFloatingPoint(c_w);
            c_h = this._adjustFloatingPoint(c_h);

            c_sum += c_h;
            c_c_max = c_w > c_c_max ? c_w : c_c_max;

            this._setContentAdjustSize(content, 0, 0, c_w, c_h);
        }, this);

        c_m_sum = this._adjustFloatingPoint(c_sum + g_sum);

        switch (this._fittocontents)
        {
            case 0: // none
                c_m_space = this._adjustFloatingPoint(this._contents_height_remain - c_m_sum);
                c_c_space = this._adjustFloatingPoint(this._contents_width_remain - c_c_max);
                break;
            case 1: // width
                c_m_space = this._adjustFloatingPoint(this._contents_height_remain - c_m_sum);
                c_c_space = 0;
                break;
            case 2: // height
                c_m_space = 0;
                c_c_space = this._adjustFloatingPoint(this._contents_width_remain - c_c_max);
                break;
            case 3: // both
                c_m_space = 0;
                c_c_space = 0;
                break;
        }

        // [contents_main_sum, container_main_spacing, container_cross_spacing, content_count, content_cross_maxsize]
        return [c_m_sum, c_m_space, c_c_space, c_cnt, c_c_max];
    };

    __pFluidLayoutManager._growFluidVerticalContent = function (sizeInfo, contentsList)
    {
        // 여백이 있을때만 grow 계산
        if (sizeInfo[1] <= 0)
            return sizeInfo;

        var contents = contentsList ? contentsList : this._fluidcontents;
        var no_limited_contents = [];

        var grow_total = 0;
        var grow_info = contents.reduce(function (acc, content)
        {
            if (content.grow > 0 && content._adjust_pos[3] > 0)
            {
                acc[0] += content.grow;
                acc[1].push(content);
            }
            return acc;
        }, [0, []]);

        grow_info[1].forEach(function (content)
        {
            if (!(content.fittocontents == "height" || content.fittocontents == "both"))
            {
                var content_height = this._getContentAdjustHeight(content);

                var grow_rate = content.grow / grow_info[0];
                var grow_size = grow_rate * sizeInfo[1];
                var grow_height = content_height + grow_size;

                var adjsut_height = this._getContentMinMaxSize(grow_height, content.min_size[1], content.max_size[1]);
                if (grow_height == adjsut_height)
                {
                    no_limited_contents.push(content);
                }

                adjsut_height = this._adjustFloatingPoint(adjsut_height);
                grow_total += adjsut_height - content_height;

                this._setContentAdjustHeight(content, adjsut_height);
            }
        }, this);

        sizeInfo[0] = this._adjustFloatingPoint(sizeInfo[0] + grow_total); // 변경된 차이만큼 컨텐츠 총합에 더해야함
        sizeInfo[1] = this._adjustFloatingPoint(sizeInfo[1] - grow_total); // 변경된 차이만큼 여백에서 빼야함

        // 오차범위 포함한 재귀
        if (no_limited_contents.length && sizeInfo[1] > 0.05 && grow_total != 0)
        {
            sizeInfo = this._growFluidVerticalContent(sizeInfo, no_limited_contents)
        }

        return sizeInfo;
    };
    __pFluidLayoutManager._shrinkFluidVerticalContent = function (sizeInfo, contentsList)
    {
        // 여백이 없을때만 shrink 계산
        if (sizeInfo[1] >= 0)
            return sizeInfo;

        var contents = contentsList ? contentsList : this._fluidcontents;
        var brecalc = true;
        // shrink가 있을때 보정할 기준 계산
        var shrink_total = 0;
        var shrink_info = contents.reduce(function (acc, content)
        {
            if (content.shrink > 0 && content._adjust_pos[3] > 0)
            {
                acc[0].push(content._adjust_pos[3]);
                acc[1].push(content);
                acc[2] += content._adjust_pos[3] * content.shrink;
            }
            return acc;
        }, [[], [], 0]);

        shrink_info[1].forEach(function (content, idx)
        {
            var adjsut_height = 0;
            var content_height = this._getContentAdjustHeight(content);
            var fittocontents = content.fittocontents;
            if (fittocontents != "both" && fittocontents != "height")
            {
                var basis_height = shrink_info[0][idx] * content.shrink;
                var shrink_rate = basis_height / shrink_info[2];
                var shrink_size = shrink_rate * sizeInfo[1];
                var shrink_height = content_height + shrink_size;

                adjsut_height = this._getContentMinMaxSize(shrink_height, content.min_size[1], content.max_size[1]);
                if (adjsut_height >= 0)
                {
                    adjsut_height = this._adjustFloatingPoint(adjsut_height);
                }

                if (adjsut_height == content.min_size[1] || adjsut_height == content.max_size[1])
                    brecalc = false;
                this._setContentAdjustHeight(content, adjsut_height);
            }
            shrink_total += content_height - adjsut_height;
        }, this);

        sizeInfo[0] = this._adjustFloatingPoint(sizeInfo[0] - shrink_total); // 변경된 차이만큼 컨텐츠 총합에서 빼야함
        sizeInfo[1] = this._adjustFloatingPoint(sizeInfo[1] + shrink_total); // 변경된 차이만큼 여백에선 더해야함

        // 컨텐츠 과분이 있으면 보이는 컨텐츠들을 계속 줄여나가야함
        if (shrink_info[1].length && sizeInfo[1] < 0 && brecalc)
        {
            sizeInfo = this._shrinkFluidVerticalContent(sizeInfo);
        }

        return sizeInfo;
    };
    __pFluidLayoutManager._wrapFluidVerticalContent = function (sizeInfo, contentsList, isRecursive)
    {
        var contents = contentsList ? contentsList : this._fluidcontents;
        var curr_content = contents.slice(); // 복사해서 사용
        var wrap_content = [];

        var content_height = 0;
        var content_main_gap = this._gap[1];
        var content_cross_gap = this._gap[0];
        var main_spacing = sizeInfo[1];     // 음수임

        for (var i = contents.length - 1; i >= 0; i--)
        {
            var content = contents[i];

            if (main_spacing >= 0)
            {
                // 여백이 양수가 된순간 curr와 wrap을 각각 계산
                // wrap 결과는 또다시 여백이 음수일수 있음
                var curr_info = this._calcFluidVerticalContentSize(curr_content);

                this._contents_width_remain = curr_info[2] - content_cross_gap;

                var wrap_info = this._calcFluidVerticalContentSize(wrap_content);

                // wrap 계산에서 음수가 안나올때까지 계산해야함
                if (wrap_info[1] < 0)
                {
                    // wrap_contents가 2개 이상일때만 추가로 wrap을 할수가 있음
                    if (wrap_content.length > 1)
                    {
                        sizeInfo = this._wrapFluidVerticalContent(wrap_info, wrap_content, true);
                        curr_info = this._growFluidVerticalContent(curr_info, curr_content);

                        sizeInfo.splice(0, 0, curr_info);
                    }
                    else
                    {
                        // wrap된게 한개면 계산 끝냄. 여백이 마이너스 여도 shrink 적용은 하지 않음
                        curr_info = this._growFluidVerticalContent(curr_info, curr_content);

                        sizeInfo = [curr_info];
                        sizeInfo.push(wrap_info);
                    }

                    break;
                }
                else
                {
                    // 줄나누기가 끝났으면 각 라인에 grow 적용
                    curr_info = this._growFluidVerticalContent(curr_info, curr_content);
                    wrap_info = this._growFluidVerticalContent(wrap_info, wrap_content);

                    if (isRecursive)
                    {
                        // 재귀로 사용시 바로 반환
                        return [curr_info, wrap_info];
                    }
                    else
                    {
                        // 두줄로 끝나는 wrap임
                        sizeInfo = [curr_info, wrap_info];
                        break;
                    }
                }
            }
            else
            {
                // 공백이 음수. 컨텐츠를 나눠야함
                if (curr_content.length > 1)
                {
                    content_height = this._getContentAdjustHeight(content);

                    wrap_content.splice(0, 0, curr_content.pop());  // 다음줄로 보내고
                    main_spacing += content_height;                  // 공백 줄여보고
                    main_spacing += content_main_gap;               // 컨텐츠 하나 빠졌으니 갭도 하나 뺌
                }
                else
                {
                    // 공백이 음수지만 현재 컨텐츠가 한개밖에 없음. 더빼면 안됨. 현시점 기준으로 계산을 끝냄
                    var curr_info = this._calcFluidVerticalContentSize(curr_content);

                    this._contents_width_remain = curr_info[2] - content_cross_gap;

                    var wrap_info = this._calcFluidVerticalContentSize(wrap_content);
                    if (wrap_info[1] < 0)
                    {
                        if (wrap_content.length > 1)
                        {
                            sizeInfo = this._wrapFluidVerticalContent(wrap_info, wrap_content, true);
                            curr_info = this._growFluidVerticalContent(curr_info, curr_content);
                            curr_info = this._shrinkFluidVerticalContent(curr_info, curr_content);

                            sizeInfo.splice(0, 0, curr_info);
                        }
                        else
                        {
                            curr_info = this._growFluidVerticalContent(curr_info, curr_content);
                            curr_info = this._shrinkFluidVerticalContent(curr_info, curr_content);
                            wrap_info = this._shrinkFluidVerticalContent(wrap_info, wrap_content);

                            sizeInfo = [curr_info];
                            sizeInfo.push(wrap_info);
                        }

                        break;
                    }
                    else
                    {
                        curr_info = this._growFluidVerticalContent(curr_info, curr_content);
                        curr_info = this._shrinkFluidVerticalContent(curr_info, curr_content);
                        wrap_info = this._growFluidVerticalContent(wrap_info, wrap_content);

                        if (isRecursive)
                        {
                            return [curr_info, wrap_info];
                        }
                        else
                        {
                            sizeInfo = [curr_info, wrap_info];
                            break;
                        }
                    }
                    //sizeInfo = [curr_info];
                }
            }
        }
        return sizeInfo;
    };

    __pFluidLayoutManager._adjustVerticalContent = function (layoutInfo)
    {
        // 인포가 없을상황이면 안됨..
        if (layoutInfo.length == 0)
            return;

        switch (this._flexwrap)
        {
            case 0: // NOWRAP
                this._adjustVerticalContentSingleLine(layoutInfo);
                break;
            case 1: // WRAP
                this._adjustVerticalContentMultiLine(layoutInfo);
                break;
        }
    };
    __pFluidLayoutManager._adjustVerticalContentSingleLine = function (layoutInfo)
    {
        var info = layoutInfo[0];

        var m_space = 0;

        var pad_l = this._container_padding.left;
        var pad_t = this._container_padding.top;
        var pad_r = this._container_padding.right;
        var pad_b = this._container_padding.bottom;

        var gap = this._gap;

        var main_align = this._align[0];
        var cross_align = this._align[1];

        var main_spacing = info[1];
        var cross_spacing = info[2];
        var content_len = info[3];
        var cross_max = info[4];

        var l = 0;
        var t = 0;

        // Main 보정
        switch (main_align)
        {
            case 0: //LAYOUT_CONTENT_ALIGN_START
                t += pad_t;
                break;
            case 1: //LAYOUT_CONTENT_ALIGN_END
                m_space = main_spacing;
                t += pad_t + m_space;
                break;
            case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                m_space = main_spacing / 2;
                t += pad_t + m_space;
                break;
            case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                m_space = (main_spacing > 0) ? main_spacing / (content_len - 1) : 0;
                t += pad_t;
                break;
            case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                m_space = (main_spacing > 0) ? main_spacing / (content_len * 2) : main_spacing / 2;
                t += pad_t + m_space;
                break;
            case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                m_space = (main_spacing > 0) ? main_spacing / (content_len + 1) : main_spacing / 2;
                t += pad_t + m_space;
                break;
        }

        // Cross 여백 보정
        switch (cross_align)
        {
            case 0: //LAYOUT_CONTENT_ALIGN_START
                l += pad_l;
                break;
            case 1: //LAYOUT_CONTENT_ALIGN_END
                l += pad_l + cross_spacing;
                break;
            case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                l += pad_l + (cross_spacing / 2);
                break;
        }

        // Adjust 계산
        this._fluidcontents.forEach(function (content)
        {
            var pos = content._adjust_pos;

            t = this._adjustFloatingPoint(t);

            pos[1] = t;

            t += gap[1];
            t += pos[3];
            if (t < 0) t = 0;

            // 다음 content 간격
            switch (main_align)
            {
                case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                    t += (main_spacing > 0) ? m_space : 0;
                    break;
                case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                    t += (main_spacing > 0) ? (m_space * 2) : 0;
                    break;
            }

            // content 개별 top 높이 조절
            switch (cross_align)
            {
                case 0: //LAYOUT_CONTENT_ALIGN_START
                    pos[0] = this._adjustFloatingPoint(l);
                    break;
                case 1: //LAYOUT_CONTENT_ALIGN_END
                    pos[0] = this._adjustFloatingPoint(l + (cross_max - pos[2]));
                    break;
                case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                    pos[0] = this._adjustFloatingPoint(l + ((cross_max - pos[2]) / 2));
                    break;
                case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                    break;
            }

            // 최대 rect 저장
            var curr_right = 0;
            if (pos[2] > 0)
                curr_right = pos[0] + pos[2] + pad_r;
            var curr_bottom = 0;
            if (pos[3] > 0)
                curr_bottom = pos[1] + pos[3] + pad_b;

            if (curr_right > this._getContentMaxRight()) this._setContentMaxRight(curr_right);
            if (curr_bottom > this._getContentMaxBottom()) this._setContentMaxBottom(curr_bottom);
        }, this);
    };
    __pFluidLayoutManager._adjustVerticalContentMultiLine = function (layoutInfo)
    {
        var info;
        var info_len = layoutInfo.length;

        var pos;
        var content;
        var m_space = 0;
        var c_space = 0;

        var pad_l = this._container_padding.left;
        var pad_t = this._container_padding.top;
        var pad_r = this._container_padding.right;
        var pad_b = this._container_padding.bottom;

        var gap = this._gap;

        var main_align = this._align[0];
        var cross_align = this._align[1];
        var cross_wrapalign = this._align[2];

        var main_spacing = 0;
        var cross_spacing = layoutInfo[info_len - 1][2];

        var l = 0;
        var t = 0;

        // Container cross 여백 보정
        switch (cross_wrapalign)
        {
            case 0: //LAYOUT_CONTENT_ALIGN_START
                l += pad_l;
                break;
            case 1: //LAYOUT_CONTENT_ALIGN_END
                l += pad_l + cross_spacing;
                break;
            case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                l += pad_l + (cross_spacing / 2);
                break;
            case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                c_space = (cross_spacing > 0) ? cross_spacing / (info_len - 1) : 0;
                l += pad_l;
                break;
            case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                c_space = (cross_spacing > 0) ? cross_spacing / (info_len * 2) : cross_spacing / 2;
                l += pad_l + c_space;
                break;
            case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                c_space = (cross_spacing > 0) ? cross_spacing / (info_len + 1) : cross_spacing / 2;
                l += pad_l + c_space;
                break;
        }

        var i = 0;
        var j = 0;
        for (; i < info_len; i++)
        {
            info = layoutInfo[i];

            main_spacing = info[1];
            var content_len = info[3];
            var cross_max = info[4];

            // 시작위치 결정
            t = 0;

            // Main 보정
            switch (main_align)
            {
                case 0: //LAYOUT_CONTENT_ALIGN_START
                    t += pad_t;
                    break;
                case 1: //LAYOUT_CONTENT_ALIGN_END
                    m_space = main_spacing;
                    t += pad_t + m_space;
                    break;
                case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                    m_space = main_spacing / 2;
                    t += pad_t + m_space;
                    break;
                case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                    m_space = (main_spacing > 0) ? main_spacing / (content_len - 1) : 0;
                    t += pad_t;
                    break;
                case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                    m_space = (main_spacing > 0) ? main_spacing / (content_len * 2) : main_spacing / 2;
                    t += pad_t + m_space;
                    break;
                case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                    m_space = (main_spacing > 0) ? main_spacing / (content_len + 1) : main_spacing / 2;
                    t += pad_t + m_space;
                    break;
            }

            // adjust 계산
            while (content_len)
            {
                content = this._fluidcontents[j];
                pos = content._adjust_pos;

                t = this._adjustFloatingPoint(t);

                pos[1] = t;

                t += gap[1];
                t += pos[3];
                if (t < 0) t = 0;

                switch (main_align)
                {
                    case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                    case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                        t += (main_spacing > 0) ? m_space : 0;
                        break;
                    case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                        t += (main_spacing > 0) ? (m_space * 2) : 0;
                        break;
                }

                switch (cross_align)
                {
                    case 0: //LAYOUT_CONTENT_ALIGN_START
                        pos[0] = this._adjustFloatingPoint(l);
                        break;
                    case 1: //LAYOUT_CONTENT_ALIGN_END
                        pos[0] = this._adjustFloatingPoint(l + (cross_max - pos[2]));
                        break;
                    case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                        pos[0] = this._adjustFloatingPoint(l + ((cross_max - pos[2]) / 2));
                        break;
                    case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                    case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                    case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                        break;
                }

                // 최대 rect 저장

                var curr_right = pos[0] + pos[2] + pad_r;
                var curr_bottom = pos[1] + pos[3] + pad_b;

                if (curr_right > this._getContentMaxRight()) this._setContentMaxRight(curr_right);
                if (curr_bottom > this._getContentMaxBottom()) this._setContentMaxBottom(curr_bottom);

                j++
                content_len--;
            }

            // next left pos
            if (info[3])
            {
                l += cross_max;
                l += gap[0];
            }

            switch (cross_wrapalign)
            {
                case 0: //LAYOUT_CONTENT_ALIGN_START
                case 1: //LAYOUT_CONTENT_ALIGN_END
                case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                    l += (cross_spacing > 0) ? c_space : 0;
                    break;
                case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                    l += (cross_spacing > 0) ? (c_space * 2) : 0;
                    break;
            }
        }
    };

    // Table Template Calc
    __pFluidLayoutManager._getTableInfo = function ()
    {
        var info = this._getTableTemplateInfo();

        if (this._fittocontents != 0)
        {
            this._calcTableTemplateRect(info);
            this._calcTableContentsSize(info);
        }

        // 컨터이너의 템플릿만의 순수한 좌표 계산
        this._calcTableTemplateRect(info);

        return info;
    };
    __pFluidLayoutManager._calcTableTemplateRect = function (templateInfo)
    {
        var contents_w = this._contents_width;
        var contents_h = this._contents_height;

        var l = 0;
        var t = 0;

        var pad_l = this._container_padding.left;
        var pad_t = this._container_padding.top;

        var row_gap = this._gap[1];
        var col_gap = this._gap[0];
        var row_len = 0;
        var col_len = 0;
        var row_auto_len = 0;
        var col_auto_len = 0;
        var row_flex_sum = 0;
        var col_flex_sum = 0;
        var row_fixed_sum = 0;
        var col_fixed_sum = 0;
        var row_auto_sum = 0;
        var col_auto_sum = 0;

        var cell_align_h = this._align[0];
        var cell_align_v = this._align[1];

        // 템플릿에서 flex영역과 fix, auto영역 구분
        templateInfo.forEach(function (row_info, row_idx)
        {
            // row계산은 0번째 컬럼을 강제로 끌어와서 함
            // row의 합계이기때문에 루프를 다돌아야함
            if (row_info[0]._is_flexible_row)
                row_flex_sum += row_info[0]._row_flexible_length;
            else if (row_info[0]._is_auto_row)
            {
                row_auto_len++;
                row_auto_sum += this._max_row_sizes[row_idx] ? this._max_row_sizes[row_idx] : 0;
            }

            else
                row_fixed_sum += this._parseContentSize(row_info[0]._inner_row, contents_h);

            // Column계산은 처음만 하면 됨. 템플릿을 row마다 다른 column을 설정할수가 없음
            if (row_idx == 0)
            {
                row_info.forEach(function (col_info, col_idx)
                {
                    if (col_info._is_flexible_col)
                        col_flex_sum += col_info._col_flexible_length;
                    else if (col_info._is_auto_col)
                    {
                        col_auto_len++;
                        col_auto_sum += this._max_col_sizes[col_idx] ? this._max_col_sizes[col_idx] : 0;
                    }
                    else
                        col_fixed_sum += this._parseContentSize(col_info._inner_col, contents_w);

                    col_len++;
                }, this);
            }

            row_len++;
        }, this);

        var gap_sum_h = (col_len - 1) * col_gap;
        var gap_sum_v = (row_len - 1) * row_gap;

        var spacing_w = contents_w - col_fixed_sum - col_auto_sum - gap_sum_h;
        var spacing_h = contents_h - row_fixed_sum - row_auto_sum - gap_sum_v;

        spacing_w = spacing_w < 0 ? 0 : spacing_w;
        spacing_h = spacing_h < 0 ? 0 : spacing_h;

        // autocell 영역을 고적픽셀화
        templateInfo.forEach(function (row_info, row_idx)
        {
            if (row_info[0]._is_auto_row)
            {
                var change_val = (this._max_row_sizes[row_idx] ? this._max_row_sizes[row_idx] : 0) + "";
                this._changeTableTemplate(templateInfo, "row", row_idx, change_val);
            }

            if (row_idx == 0)
            {
                row_info.forEach(function (col_info, col_idx)
                {
                    if (col_info._is_auto_col)
                    {
                        var change_val = (this._max_col_sizes[col_idx] ? this._max_col_sizes[col_idx] : 0) + "";
                        this._changeTableTemplate(templateInfo, "col", col_idx, change_val);
                    }

                }, this);
            }
        }, this);

        this._container_horizontal_spacing = (col_flex_sum > 0 || col_auto_sum > 0) ? 0 : spacing_w;
        this._container_vertical_spacing = (row_flex_sum > 0 || row_auto_sum > 0) ? 0 : spacing_h;

        // 순수하게 컨테이너 영역을 분할
        // 템플릿상의 계산은 중간계산으로 앞에게 변할일이 없다
        templateInfo.forEach(function (row_info, idx)
        {
            var is_last_row = (row_len - 1 == idx);
            // padding 보정
            l = pad_l;
            t = idx == 0 ? pad_t : t;

            // row 앞 보정
            if (row_flex_sum === 0 || (row_flex_sum === 0 && row_auto_sum === 0))
            {
                switch (cell_align_v)
                {
                    case 0: //LAYOUT_CONTENT_ALIGN_START
                        break;
                    case 1: //LAYOUT_CONTENT_ALIGN_END
                        if (idx === 0)
                            t += spacing_h;
                        break;
                    case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                        if (idx === 0)
                            t += spacing_h / 2;
                        break;
                    case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                        if (idx !== 0)
                        {
                            if (row_len > 1)
                            {
                                t += spacing_h / (row_len - 1);
                            }
                        }
                        break;
                    case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                        t += spacing_h / (row_len * 2);
                        break;
                    case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                        t += spacing_h / (row_len + 1);
                        break;
                }
            }

            row_info.forEach(function (col_info, idx)
            {
                var col_w = 0;
                var col_h = 0;
                var is_last_col = (col_len - 1 == idx);
                // column 앞 보정
                if (col_flex_sum === 0 || (col_flex_sum === 0 && col_auto_sum === 0))
                {
                    switch (cell_align_h)
                    {
                        case 0: //LAYOUT_CONTENT_ALIGN_START
                            break;
                        case 1: //LAYOUT_CONTENT_ALIGN_END
                            // flexible 여부 check? flexible일때 space가 0이긴 할거임...
                            if (idx === 0)
                                l += spacing_w;
                            break;
                        case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                            if (idx === 0)
                                l += spacing_w / 2;
                            break;
                        case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                            if (idx !== 0)
                            {
                                if (col_len > 1)
                                {
                                    l += spacing_w / (col_len - 1);
                                }
                            }
                            break;
                        case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                            l += spacing_w / (col_len * 2);
                            break;
                        case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                            l += spacing_w / (col_len + 1);
                            break;
                    }
                }

                // column 사이즈 계산
                if (col_info._is_flexible_col)
                    col_w = (col_info._col_flexible_length / col_flex_sum) * spacing_w;
                else if (col_info._is_auto_col)
                    col_w = this._parseContentSize(col_info._inner_col, contents_w);
                else
                    col_w = this._parseContentSize(col_info._inner_col, contents_w);

                if (col_info._is_flexible_row)
                    col_h = (col_info._row_flexible_length / row_flex_sum) * spacing_h;
                else if (col_info._is_auto_row)
                    col_h = this._parseContentSize(col_info._inner_row, contents_h);
                else
                    col_h = this._parseContentSize(col_info._inner_row, contents_h);

                l = this._adjustFloatingPoint(l);
                t = this._adjustFloatingPoint(t);
                col_w = this._adjustFloatingPoint(col_w);
                col_h = this._adjustFloatingPoint(col_h);
                // set column templatesize
                this._setTemplatAdjustSize(col_info, l, t, col_w, col_h);

                // column 뒷 보정
                if (col_flex_sum === 0 || (col_flex_sum === 0 && col_auto_sum === 0))
                {
                    switch (cell_align_h)
                    {
                        case 0: //LAYOUT_CONTENT_ALIGN_START
                        case 1: //LAYOUT_CONTENT_ALIGN_END
                        case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                        case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                        case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                            break;
                        case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                            l += spacing_w / (col_len * 2);
                            break;
                    }
                }
                l += col_gap;
                l += this._getTemplateAdjustWidth(col_info);


            }, this);

            // row 뒷 보정
            if (row_flex_sum === 0 || (row_flex_sum === 0 && row_auto_sum === 0))
            {
                switch (cell_align_v)
                {
                    case 0: //LAYOUT_CONTENT_ALIGN_START
                    case 1: //LAYOUT_CONTENT_ALIGN_END
                    case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                    case 3: //LAYOUT_CONTENT_ALIGN_SPACEBETWEEN
                    case 5: //LAYOUT_CONTENT_ALIGN_SPACEEVENLY
                        break;
                    case 4: //LAYOUT_CONTENT_ALIGN_SPACEAROUND
                        t += spacing_h / (row_len * 2);
                        break;
                }
            }

            t += row_gap;
            t += this._getTemplateAdjustHeight(row_info[0]);
        }, this);

        // set info
        this._setTemplateRectInfo(templateInfo);
    };

    // Table Contents Calc
    __pFluidLayoutManager._calcTableContentAdjust = function (templateInfo, context)
    {
        // template 기반으로 실제 컨텐츠의 사이즈 계산
        var ret = [];

        var templateinfo_tmp = JSON.parse(JSON.stringify(templateInfo));

        var pad_r = this._container_padding.right;
        var pad_b = this._container_padding.bottom;

        var cont_align_h = this._align[2];
        var cont_align_v = this._align[3];

        var cell_l = undefined;
        var cell_t = undefined;
        var cell_w = 0;
        var cell_h = 0;

        var contents_area = this._tablecontents_area;
        var contents_coordinate = this._tablecontents_coordinate;
        var contents_order = this._tablecontents_order;
        var contents_unidentification = this._tablecontents_unidentification;

        if (contents_area.length)
        {
            contents_area.forEach(function (content)
            {
                var prop_area = content.coordinate;
                var area = this._tabletemplatearea_coordinate[prop_area];
                if (area)
                {
                    // Area 계산
                    area.forEach(function (area_coord)
                    {
                        var row = area_coord[0];
                        var col = area_coord[1];

                        var cell_info = templateInfo[row][col];
                        if (cell_info)
                        {
                            var temp_l = this._getTemplateAdjustLeft(cell_info);
                            var temp_t = this._getTemplateAdjustTop(cell_info);
                            var temp_w = this._getTemplateAdjustWidth(cell_info);
                            var temp_h = this._getTemplateAdjustHeight(cell_info);

                            var temp_r = temp_l + temp_w;
                            var temp_b = temp_t + temp_h;

                            if (cell_l === undefined) cell_l = temp_l;
                            else cell_l = cell_l < temp_l ? cell_l : temp_l;

                            if (cell_t === undefined) cell_t = temp_t;
                            else cell_t = cell_t < temp_t ? cell_t : temp_t;

                            cell_w = cell_w < temp_r ? temp_r : cell_w;
                            cell_h = cell_h < temp_b ? temp_b : cell_h;

                            cell_w -= cell_l;
                            cell_h -= cell_t;
                        }
                        this._removeTableTemplateInfo(templateinfo_tmp, row, row, col, col);
                    }, this);

                    var content_w = content.size[0];
                    var content_h = content.size[1];

                    var comp_width = cell_w;
                    var comp_height = cell_h;

                    // position base
                    var info = content._target._arrange_info;
                    if (info)
                    {
                        var obj, comp, distance, refer_font;
                        if (obj = info.width)
                        {
                            distance = obj.distance;
                            comp = content._target._findComponentForArrange(obj.compid);
                            if (comp)
                            {
                                content_w = distance;
                                comp_width = comp._width;
                            }
                            else
                            {
                                if (distance.indexOf("em") > -1)
                                {
                                    comp = content._target;
                                    if (distance.indexOf("rem") > -1)
                                    {
                                        comp = comp._getMainFrame();
                                    }

                                    refer_font = comp._getReferenceAbsoluteFont();

                                    content_w = distance;
                                    comp_width = refer_font ? refer_font._size : 1;
                                }
                            }
                        }

                        if (obj = info.height)
                        {
                            distance = obj.distance;
                            comp = content._target._findComponentForArrange(obj.compid);
                            if (comp)
                            {
                                content_h = distance;
                                comp_height = comp._height;
                            }
                            else
                            {
                                if (distance.indexOf("em") > -1)
                                {
                                    comp = content._target;
                                    if (distance.indexOf("rem") > -1)
                                    {
                                        comp = comp._getMainFrame();
                                    }

                                    refer_font = comp._getReferenceAbsoluteFont();

                                    content_h = distance;
                                    comp_height = refer_font ? refer_font._size : 1;
                                }
                            }
                        }
                    }

                    // width / height 정수변환
                    content_w = this._parseContentSize(content_w, comp_width);
                    content_h = this._parseContentSize(content_h, comp_height);

                    content._size = [content_w, content_h];

                    // min / max 보정
                    content_w = this._getContentMinMaxSize(content_w, content.min_size[0], content.max_size[0]);
                    content_h = this._getContentMinMaxSize(content_h, content.min_size[1], content.max_size[1]);

                    var spacing_w = cell_w - content_w;
                    // 여백에 대해 정렬 적용
                    switch (cont_align_h)
                    {
                        case 0: //LAYOUT_CONTENT_ALIGN_START
                            break;
                        case 1: //LAYOUT_CONTENT_ALIGN_END
                            cell_l += spacing_w;
                            break;
                        case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                            cell_l += spacing_w / 2;
                            break;
                    }

                    var spacing_h = cell_h - content_h;
                    switch (cont_align_v)
                    {
                        case 0: //LAYOUT_CONTENT_ALIGN_START
                            break;
                        case 1: //LAYOUT_CONTENT_ALIGN_END
                            cell_t += spacing_h;
                            break;
                        case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                            cell_t += spacing_h / 2;
                            break;
                    }

                    this._setContentAdjustSize(content, this._adjustFloatingPoint(cell_l), this._adjustFloatingPoint(cell_t), this._adjustFloatingPoint(content_w), this._adjustFloatingPoint(content_h));

                    // 최대 rect 저장
                    var curr_right = cell_l + content_w + pad_r;
                    var curr_bottom = cell_t + content_h + pad_b;

                    if (curr_right > this._getContentMaxRight()) this._setContentMaxRight(curr_right);
                    if (curr_bottom > this._getContentMaxBottom()) this._setContentMaxBottom(curr_bottom);

                    var fit_right = cell_l + cell_w + pad_r;
                    var fit_bottom = cell_t + cell_h + pad_b;

                    if (fit_right > this._getFitContentMaxRight()) this._setFitContentMaxRight(fit_right);
                    if (fit_bottom > this._getFitContentMaxBottom()) this._setFitContentMaxBottom(fit_bottom);

                    ret.push(content);

                    cell_l = undefined;
                    cell_t = undefined;
                    cell_w = 0;
                    cell_h = 0;
                }
            }, this);
        }

        //table template 재배치
        var prev_template_max_col = 0;
        var tablecellmovingtype = this._tablecellmovingtype ? this._tablecellmovingtype : this._default_tablecellmovingtype;
        if (tablecellmovingtype != "none")
        {
            var prev_tabletemplate = this._prev_tabletemplate;
            if (!prev_tabletemplate || nexacro._isDesignMode())
                prev_tabletemplate = this._default_tabletemplate;
            if (prev_tabletemplate)
            {
                var _tabletemplate_parse = this._parseTableTemplate(prev_tabletemplate).parse;
                if (_tabletemplate_parse)
                {
                    prev_template_max_col = _tabletemplate_parse[1].length;
                }
            }
            /*
            var cur_tabletemplate = this._tabletemplate;
            if (cur_tabletemplate)
            {
                var _cur_tabletemplate_parse = this._parseTableTemplate(cur_tabletemplate).parse;
                if (_cur_tabletemplate_parse)
                {
                    cur_max_col = _cur_tabletemplate_parse[1].length;
                }
            }
           */
            //정렬

            if (contents_coordinate.length)
            {
                var len = contents_coordinate.length;
                for (var i = 0; i < len - 1; i++)
                {
                    for (var j = 0; j < len - i - 1; j++)
                    {
                        var cur_item = contents_coordinate[j];
                        var next_item = contents_coordinate[j + 1];
                        var cur_row_start = cur_item.rowstart;
                        var cur_col_start = cur_item.colstart;
                        var next_row_start = next_item.rowstart;
                        var next_col_start = next_item.colstart;

                        if (this._direction == 0)
                        {
                            if ((next_row_start == cur_row_start && cur_col_start > next_col_start) || next_row_start < cur_row_start)
                            {
                                var temp = contents_coordinate[j];
                                contents_coordinate[j] = contents_coordinate[j + 1];
                                contents_coordinate[j + 1] = temp;
                            }
                        }
                        else
                        {
                            if ((next_col_start == cur_col_start && cur_row_start > next_row_start) || next_col_start < cur_col_start)
                            {
                                var temp = contents_coordinate[j];
                                contents_coordinate[j] = contents_coordinate[j + 1];
                                contents_coordinate[j + 1] = temp;
                            }
                        }

                    }
                }
            }

            var acc_adjust_row = 0;
            var cur_adjust_row = 0;
            var acc_adjust_col = 0;
            var cur_max_col = templateInfo.length > 0 ? templateInfo[0].length : 0;
            var cur_max_row = templateInfo.length;// > 0 ? templateInfo[0].length : 0;
            //Template rearrange logic
            if (context && context._is_changed_tabletemplate && prev_template_max_col)// && prev_template_max_col != cur_max_col /* && contents_coordinate.length*/)
            {
                contents_coordinate.forEach(function (content)
                {
                    var row_start = content.org_rowstart !== undefined ? content.org_rowstart : content.rowstart;
                    var col_start = content.org_colstart !== undefined ? content.org_colstart : content.colstart;
                    var row_end = content.org_rowend !== undefined ? content.org_rowend : content.rowend;
                    var col_end = content.org_colend !== undefined ? content.org_colend : content.colend;

                    var ret_coordinate = "";
                    if (tablecellmovingtype)
                    {
                        if (this._direction == 0)
                        {
                            if (tablecellmovingtype == "autofit")
                            {
                                var prev_col_max = prev_template_max_col;
                                if (prev_col_max > cur_max_col)
                                {
                                    //줄어들경우 
                                    //재작업해야됨
                                    var row_cnt = parseInt(prev_col_max / cur_max_col);
                                    if (prev_col_max % cur_max_col)
                                        row_cnt++;
                                    cur_adjust_row = 0;
                                    var contents_length = content.colend - content.colstart;
                                    var col_start = content.colstart % cur_max_col;
                                    var col_end = col_start + contents_length;

                                    if (contents_length >= cur_max_col)
                                    {
                                        //Content크기가 전체 column개수보다 클경우 현재row에서 나머지영역에 배치
                                        col_end = cur_max_col;
                                        acc_adjust_row -= (row_cnt - 1);
                                        if (col_end == cur_max_col && cur_max_col == 1)
                                            acc_adjust_row++;
                                    }
                                    else if (col_end >= cur_max_col)
                                    {
                                        col_start = 0;
                                        col_end = contents_length;
                                        acc_adjust_row += parseInt(content.colstart / cur_max_col) | 1;
                                    }
                                    if (content.colstart >= cur_max_col)
                                    {
                                        cur_adjust_row = parseInt(content.colstart / cur_max_col);
                                    }

                                    var row_start = Math.max((content.rowstart * row_cnt) + acc_adjust_row, 0) + cur_adjust_row;
                                    var row_end = Math.max((content.rowend * row_cnt) + acc_adjust_row, 0) + cur_adjust_row;
                                    ret_coordinate = row_start + " " + row_end + "/" + col_start + " " + col_end;
                                    var comp = content._target;
                                    if (comp)
                                    {
                                        content.coordinate = ret_coordinate;
                                        content.colstart = col_start;
                                        content.colend = col_end;
                                        content.rowstart = row_start;
                                        content.rowend = row_end;
                                        comp._setTablecellarea(ret_coordinate);
                                    }
                                }
                                else
                                {
                                    //Do nothing
                                    //늘어날경우
                                }
                            }
                            else if (tablecellmovingtype == "autofill")
                            {
                                var prev_col_max = prev_template_max_col;
                                //if (prev_col_max != cur_max_col)
                                //{
                                var content_length = col_end - col_start + 1; //content.colend - content.colstart;
                                var content_height = row_end - row_start; //content.rowend - content.rowstart;
                                var total_start_cnt = ((row_start * prev_col_max) + col_start) + acc_adjust_col;
                                var total_end_cnt = ((row_end * prev_col_max) + col_end) + acc_adjust_col;
                                col_start = total_start_cnt % cur_max_col;// + acc_adjust_col;
                                row_start = Math.floor(total_start_cnt / cur_max_col) + acc_adjust_row;
                                col_end = col_start + content_length - 1;//total_end_cnt % max_col_length;
                                row_end = Math.floor(total_end_cnt / cur_max_col) + acc_adjust_row;
                                if (col_start + content_length >= cur_max_col)
                                {
                                    acc_adjust_col -= (col_end - cur_max_col + 1);
                                    col_end = cur_max_col - 1;
                                    row_end = row_start + content_height;
                                }
                                ret_coordinate = row_start + " " + row_end + "/" + col_start + " " + col_end;
                                var comp = content._target;
                                if (comp)
                                {
                                    content.coordinate = ret_coordinate;
                                    content.colstart = col_start;
                                    content.colend = col_end;
                                    content.rowstart = row_start;
                                    content.rowend = row_end;
                                    comp._setTablecellarea(ret_coordinate);
                                }
                                //}                            
                            }
                        }
                        else //direction =1 row
                        {
                            var prev_template_max_row = 0;
                            var prev_tabletemplate = this._prev_tabletemplate ? this._prev_tabletemplate : this._default_tabletemplate;
                            if (prev_tabletemplate)
                            {
                                var _tabletemplate_parse = this._parseTableTemplate(prev_tabletemplate).parse;
                                if (_tabletemplate_parse)
                                {
                                    prev_template_max_row = _tabletemplate_parse[0].length;
                                }
                            }

                            if (tablecellmovingtype == "autofit")
                            {
                                var prev_row_max = prev_template_max_row;
                                if (prev_row_max > cur_max_row)
                                {
                                    //줄어들경우 
                                    //재작업해야됨
                                    var col_cnt = parseInt(prev_row_max / cur_max_row);
                                    if (prev_row_max % cur_max_row)
                                        col_cnt++;
                                    cur_adjust_row = 0;
                                    var contents_length = content.colend - content.colstart;
                                    var contents_height = content.rowend - content.rowstart;
                                    var row_start = content.rowstart % cur_max_row;
                                    var row_end = row_start + contents_height;

                                    if (contents_height >= cur_max_row)
                                    {
                                        //Content크기가 전체 column개수보다 클경우 현재row에서 나머지영역에 배치
                                        row_end = cur_max_row;
                                        acc_adjust_row -= (col_cnt - 1);
                                        if (row_end == cur_max_row && cur_max_row == 1)
                                            acc_adjust_row++;
                                    }
                                    else if (row_end >= cur_max_row)
                                    {
                                        row_start = 0;
                                        row_end = contents_height;
                                        acc_adjust_row += parseInt(content.rowstart / cur_max_row) | 1;
                                    }
                                    if (content.rowstart >= cur_max_row)
                                    {
                                        cur_adjust_row = parseInt(content.rowstart / cur_max_row);
                                    }

                                    var col_start = Math.max((content.colstart * col_cnt) + acc_adjust_row, 0) + cur_adjust_row;
                                    var col_end = Math.max((content.colend * col_cnt) + acc_adjust_row, 0) + cur_adjust_row;
                                    ret_coordinate = row_start + " " + row_end + "/" + col_start + " " + col_end;
                                    var comp = content._target;
                                    if (comp)
                                    {
                                        content.coordinate = ret_coordinate;
                                        content.colstart = col_start;
                                        content.colend = col_end;
                                        content.rowstart = row_start;
                                        content.rowend = row_end;
                                        comp._setTablecellarea(ret_coordinate);

                                    }
                                }
                                else
                                {
                                    //Do nothing
                                    //늘어날경우
                                }
                            }
                            else if (tablecellmovingtype == "autofill")
                            {
                                var prev_row_max = prev_template_max_row;
                                //if (prev_col_max != cur_max_col)
                                {
                                    var content_length = col_end - col_start; //content.colend - content.colstart;
                                    var content_height = row_end - row_start; //content.rowend - content.rowstart;
                                    var total_start_cnt = ((col_start * prev_row_max) + row_start);
                                    var total_end_cnt = ((col_end * prev_row_max) + row_end);
                                    row_start = total_start_cnt % cur_max_row;
                                    col_start = parseInt(total_start_cnt / cur_max_row) + acc_adjust_row;
                                    row_end = row_start + content_height;//total_end_cnt % max_col_length;
                                    col_end = parseInt(total_end_cnt / cur_max_row) + acc_adjust_row;
                                    if (content_height >= cur_max_row)
                                    {
                                        row_end = cur_max_row - 1;
                                        col_end = col_start + content_length;
                                    }
                                    else if (row_start + content_height >= cur_max_row)
                                    {
                                        row_start = 0;
                                        row_end = cur_max_row - 1;
                                        col_start++;
                                        col_end = col_start + content_length;
                                    }
                                    ret_coordinate = row_start + " " + row_end + "/" + col_start + " " + col_end;
                                    var comp = content._target;
                                    if (comp)
                                    {
                                        content.coordinate = ret_coordinate;
                                        content.colstart = col_start;
                                        content.colend = col_end;
                                        content.rowstart = row_start;
                                        content.rowend = row_end;
                                        comp._setTablecellarea(ret_coordinate);


                                    }
                                }
                            }
                        }
                    }

                }, this);
            }
        } //재배치 end  


        if (contents_coordinate.length)
        {
            for (var i = 0; i < contents_coordinate.length; i++)
            {
                var content = contents_coordinate[i];

                var row_start = content.rowstart;
                var col_start = content.colstart;
                var row_end = content.rowend;
                var col_end = content.colend;

                var template_rect = this._getTemplateRect(row_start, row_end, col_start, col_end);

                var content_w = content.size[0];
                var content_h = content.size[1];

                var comp_width = template_rect[2];
                var comp_height = template_rect[3];

                // position base
                var info = content._target._arrange_info;
                if (info)
                {
                    var obj, comp, distance, refer_font;
                    if (obj = info.width)
                    {
                        distance = obj.distance;
                        comp = content._target._findComponentForArrange(obj.compid);
                        if (comp)
                        {
                            content_w = distance;
                            comp_width = comp._width;
                        }
                        else
                        {
                            if (distance.indexOf("em") > -1)
                            {
                                comp = content._target;
                                if (distance.indexOf("rem") > -1)
                                {
                                    comp = comp._getMainFrame();
                                }

                                refer_font = comp._getReferenceAbsoluteFont();

                                content_w = distance;
                                comp_width = refer_font ? refer_font._size : 1;
                            }
                        }
                    }

                    if (obj = info.height)
                    {
                        distance = obj.distance;
                        comp = content._target._findComponentForArrange(obj.compid);
                        if (comp)
                        {
                            content_h = distance;
                            comp_height = comp._height;
                        }
                        else
                        {
                            if (distance.indexOf("em") > -1)
                            {
                                comp = content._target;
                                if (distance.indexOf("rem") > -1)
                                {
                                    comp = comp._getMainFrame();
                                }

                                refer_font = comp._getReferenceAbsoluteFont();

                                content_h = distance;
                                comp_height = refer_font ? refer_font._size : 1;
                            }
                        }
                    }
                }

                // width / height 정수변환
                content_w = this._parseContentSize(content_w, comp_width);
                content_h = this._parseContentSize(content_h, comp_height);

                content._size = [content_w, content_h];

                // min / max 보정
                content_w = this._getContentMinMaxSize(content_w, content.min_size[0], content.max_size[0]);
                content_h = this._getContentMinMaxSize(content_h, content.min_size[1], content.max_size[1]);

                var isChanged;

                var spacing_w = template_rect[2] - content_w;
                if (spacing_w < 0 && (nexacro._isNumber(content.size[0]) || content.size[0].indexOf("%") == -1))
                {
                    isChanged = this._changeTableTemplates(templateInfo, "col", col_start, col_end, content_w);

                    if (isChanged)
                    {
                        this._calcTableTemplateRect(templateInfo);

                        ret = this._calcTableContentAdjust(templateInfo);
                        break;
                    }
                }
                else
                {
                    // 여백에 대해 정렬 적용
                    switch (cont_align_h)
                    {
                        case 0: //LAYOUT_CONTENT_ALIGN_START
                            break;
                        case 1: //LAYOUT_CONTENT_ALIGN_END
                            template_rect[0] += spacing_w;
                            break;
                        case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                            template_rect[0] += spacing_w / 2;
                            break;
                    }
                }

                var spacing_h = template_rect[3] - content_h;
                if (spacing_h < 0 && (nexacro._isNumber(content.size[1]) || content.size[1].indexOf("%") == -1))
                {
                    isChanged = this._changeTableTemplates(templateInfo, "row", row_start, row_end, content_h);

                    if (isChanged)
                    {
                        this._calcTableTemplateRect(templateInfo);

                        ret = this._calcTableContentAdjust(templateInfo);
                        break;
                    }
                }
                else
                {
                    switch (cont_align_v)
                    {
                        case 0: //LAYOUT_CONTENT_ALIGN_START
                            break;
                        case 1: //LAYOUT_CONTENT_ALIGN_END
                            template_rect[1] += spacing_h;
                            break;
                        case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                            template_rect[1] += Math.floor(spacing_h / 2);
                            break;
                    }
                }

                this._setContentAdjustSize(content, this._adjustFloatingPoint(template_rect[0]), this._adjustFloatingPoint(template_rect[1]), this._adjustFloatingPoint(content_w), this._adjustFloatingPoint(content_h));
                this._removeTableTemplateInfo(templateinfo_tmp, row_start, row_end, col_start, col_end);

                // 최대 rect 저장
                var curr_right = template_rect[0] + content_w + pad_r;
                var curr_bottom = template_rect[1] + content_h + pad_b;

                if (curr_right > this._getContentMaxRight()) this._setContentMaxRight(curr_right);
                if (curr_bottom > this._getContentMaxBottom()) this._setContentMaxBottom(curr_bottom);

                var fit_right = template_rect[0] + template_rect[2] + pad_r;
                var fit_bottom = template_rect[1] + template_rect[3] + pad_b;

                if (fit_right > this._getFitContentMaxRight()) this._setFitContentMaxRight(fit_right);
                if (fit_bottom > this._getFitContentMaxBottom()) this._setFitContentMaxBottom(fit_bottom);

                ret.push(content);
            }
        }
        if (contents_unidentification.length)
        {
            contents_unidentification.forEach(function (content)
            {
                var row_start = content.rowstart;
                var col_start = content.colstart;
                var row_end = content.rowend;
                var col_end = content.colend;

                var template_rect = this._getTemplateRect(row_start, row_end, col_start, col_end);

                var content_w = content.size[0];
                var content_h = content.size[1];

                var comp_width = template_rect[2];
                var comp_height = template_rect[3];

                // position base
                var info = content._target._arrange_info;
                if (info)
                {
                    var obj, comp, distance, refer_font;
                    if (obj = info.width)
                    {
                        distance = obj.distance;
                        comp = content._target._findComponentForArrange(obj.compid);
                        if (comp)
                        {
                            content_w = distance;
                            comp_width = comp._width;
                        }
                        else
                        {
                            if (distance.indexOf("em") > -1)
                            {
                                comp = content._target;
                                if (distance.indexOf("rem") > -1)
                                {
                                    comp = comp._getMainFrame();
                                }

                                refer_font = comp._getReferenceAbsoluteFont();

                                content_w = distance;
                                comp_width = refer_font ? refer_font._size : 1;
                            }
                        }
                    }

                    if (obj = info.height)
                    {
                        distance = obj.distance;
                        comp = content._target._findComponentForArrange(obj.compid);
                        if (comp)
                        {
                            content_h = distance;
                            comp_height = comp._height;
                        }
                        else
                        {
                            if (distance.indexOf("em") > -1)
                            {
                                comp = content._target;
                                if (distance.indexOf("rem") > -1)
                                {
                                    comp = comp._getMainFrame();
                                }

                                refer_font = comp._getReferenceAbsoluteFont();

                                content_h = distance;
                                comp_height = refer_font ? refer_font._size : 1;
                            }
                        }
                    }
                }

                // width / height 정수변환
                content_w = this._parseContentSize(content_w, comp_width);
                content_h = this._parseContentSize(content_h, comp_height);

                content._size = [content_w, content_h];

                // min / max 보정
                content_w = this._getContentMinMaxSize(content_w, content.min_size[0], content.max_size[0]);
                content_h = this._getContentMinMaxSize(content_h, content.min_size[1], content.max_size[1]);

                var spacing_w = template_rect[2] - content_w;
                // 여백에 대해 정렬 적용
                switch (cont_align_h)
                {
                    case 0: //LAYOUT_CONTENT_ALIGN_START
                        break;
                    case 1: //LAYOUT_CONTENT_ALIGN_END
                        template_rect[0] += spacing_w;
                        break;
                    case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                        template_rect[0] += spacing_w / 2;
                        break;
                }

                var spacing_h = template_rect[3] - content_h;
                switch (cont_align_v)
                {
                    case 0: //LAYOUT_CONTENT_ALIGN_START
                        break;
                    case 1: //LAYOUT_CONTENT_ALIGN_END
                        template_rect[1] += spacing_h;
                        break;
                    case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                        template_rect[1] += spacing_h / 2;
                        break;
                }
                this._setContentAdjustSize(content, this._adjustFloatingPoint(template_rect[0]), this._adjustFloatingPoint(template_rect[1]), this._adjustFloatingPoint(content_w), this._adjustFloatingPoint(content_h));
                this._removeTableTemplateInfo(templateinfo_tmp, row_start, row_end, col_start, col_end);

                // 최대 rect 저장
                var curr_right = template_rect[0] + content_w + pad_r;
                var curr_bottom = template_rect[1] + content_h + pad_b;

                if (curr_right > this._getContentMaxRight()) this._setContentMaxRight(curr_right);
                if (curr_bottom > this._getContentMaxBottom()) this._setContentMaxBottom(curr_bottom);

                ret.push(content);
            }, this);
        }
        if (contents_order.length)
        {
            contents_order.forEach(function (contents)
            {
                for (var i = 0, content; i < contents.length; i++)
                {
                    var content_w, content_h;
                    content = contents[i];
                    var cell_info = this._findUsableCell(templateinfo_tmp);
                    if (cell_info)
                    {
                        var template_rect = this._getTemplateRect(cell_info._idx_row, cell_info._idx_row, cell_info._idx_col, cell_info._idx_col);

                        content_w = content.size[0];
                        content_h = content.size[1];

                        var comp_width = template_rect[2];
                        var comp_height = template_rect[3];

                        // position base
                        var info = content._target._arrange_info;
                        if (info)
                        {
                            var obj, comp;
                            if (obj = info.width)
                            {
                                comp = content._target._findComponentForArrange(obj.compid);
                                if (comp)
                                {
                                    content_w = obj.distance;
                                    comp_width = comp._width;
                                }
                            }

                            if (obj = info.height)
                            {
                                comp = content._target._findComponentForArrange(obj.compid);
                                if (comp)
                                {
                                    content_h = obj.distance;
                                    comp_height = comp._height;
                                }
                            }
                        }

                        // width / height 정수변환
                        content_w = this._parseContentSize(content_w, comp_width);
                        content_h = this._parseContentSize(content_h, comp_height);

                        content._size = [content_w, content_h];

                        // min / max 보정
                        content_w = this._getContentMinMaxSize(content_w, content.min_size[0], content.max_size[0]);
                        content_h = this._getContentMinMaxSize(content_h, content.min_size[1], content.max_size[1]);

                        var spacing_w = template_rect[2] - content_w;
                        if (spacing_w < 0)
                        {
                            if (cell_info._is_flexible_col)
                            {
                                // 플렉시블한 영역에서 컨텐츠가 계산영역보다 클때
                                // 템플릿을 내부적으로 바꾸고 처음부터 다시계산.
                                this._changeTableTemplate(templateInfo, "col", cell_info._idx_col, content_w + "px");
                                this._calcTableTemplateRect(templateInfo);

                                ret = this._calcTableContentAdjust(templateInfo);
                                break;
                            }
                        }
                        else
                        {
                            // 여백에 대해 정렬 적용
                            switch (cont_align_h)
                            {
                                case 0: //LAYOUT_CONTENT_ALIGN_START
                                    break;
                                case 1: //LAYOUT_CONTENT_ALIGN_END
                                    template_rect[0] += spacing_w;
                                    break;
                                case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                                    template_rect[0] += spacing_w / 2;
                                    break;
                            }
                        }

                        var spacing_h = template_rect[3] - content_h;
                        if (spacing_h < 0)
                        {
                            if (cell_info._is_flexible_row)
                            {
                                // 플렉시블한 영역에서 컨텐츠가 계산영역보다 클때
                                // 템플릿을 내부적으로 바꾸고 처음부터 다시계산.
                                this._changeTableTemplate(templateInfo, "row", cell_info._idx_row, content_h + "px");
                                this._calcTableTemplateRect(templateInfo);

                                ret = this._calcTableContentAdjust(templateInfo);
                                break;
                            }
                        }
                        else
                        {
                            // 여백에 대해 정렬 적용
                            switch (cont_align_v)
                            {
                                case 0: //LAYOUT_CONTENT_ALIGN_START
                                    break;
                                case 1: //LAYOUT_CONTENT_ALIGN_END
                                    template_rect[1] += spacing_h;
                                    break;
                                case 2: //LAYOUT_CONTENT_ALIGN_CENTER
                                    template_rect[1] += spacing_h / 2;
                                    break;
                            }
                        }
                        //trace("contents_order.le",contents.length, content._target.id, this._adjustFloatingPoint(template_rect[0]), this._adjustFloatingPoint(template_rect[1]), cell_info._idx_row + "/" + cell_info._idx_col);
                        this._setContentAdjustSize(content, this._adjustFloatingPoint(template_rect[0]), this._adjustFloatingPoint(template_rect[1]), this._adjustFloatingPoint(content_w), this._adjustFloatingPoint(content_h));

                        // 최대 rect 저장
                        var curr_right = template_rect[0] + content_w + pad_r;
                        var curr_bottom = template_rect[1] + content_h + pad_b;

                        if (curr_right > this._getContentMaxRight()) this._setContentMaxRight(curr_right);
                        if (curr_bottom > this._getContentMaxBottom()) this._setContentMaxBottom(curr_bottom);

                        var fit_right = template_rect[0] + template_rect[2] + pad_r;
                        var fit_bottom = template_rect[1] + template_rect[3] + pad_b;

                        if (fit_right > this._getFitContentMaxRight()) this._setFitContentMaxRight(fit_right);
                        if (fit_bottom > this._getFitContentMaxBottom()) this._setFitContentMaxBottom(fit_bottom);

                        if (nexacro._isDesignMode())
                            content._target._setTablecellareacoordinate(cell_info._idx_row + "/" + cell_info._idx_col);
                        //else
                        //    content._target.set_tablecellarea(cell_info._idx_row + "/" + cell_info._idx_col);
                        //trace("content._target",content._target.id, cell_info._idx_row + " / " + cell_info._idx_col);
                        ret.push(content);
                    }
                    else
                    {
                        var left = 0, top = 0;
                        var col_len = templateinfo_tmp ? templateinfo_tmp[0].length : 0;
                        var row_len = templateinfo_tmp ? templateinfo_tmp.length : 0;
                        var _size = templateInfo[0][0]._template_pos;
                        content_w = +content.size[0];
                        content_h = +content.size[1];
                        if (isNaN(content_w))
                            content_w = 0;
                        if (isNaN(content_h))
                            content_h = 0;
                        if (templateInfo)
                        {
                            if (this._direction)
                            {
                                //horizontal
                                left = _size[2] * col_len;
                            }
                            else
                            {
                                //vertical
                                top = _size[3] * row_len;
                            }
                        }

                        this._setContentAdjustSize(content, left, top, content_w, content_h);
                        content._size = [content_w, content_h];
                        ret.push(content);
                    }
                }

            }, this);
        }

        return ret;
    };

    // TableInfo Handling
    __pFluidLayoutManager._makeTableTemplateInfo = function (nRow, nColumn, unitRow, unitColumn, strAreaName)
    {
        var ret = {
            _org_row: unitRow,  // original
            _org_col: unitColumn,  // original
            _inner_row: unitRow,       // logical value
            _inner_col: unitColumn,       // logical value

            _row_flexible_length: 0,
            _col_flexible_length: 0,
            _row_auto_length: 0,
            _col_auto_length: 0,

            _idx_row: nRow,
            _idx_col: nColumn,
            _area_name: strAreaName,

            _is_flexible_row: false,   // 오리지널 템플릿기준
            _is_flexible_col: false,   // 오리지널 템플릿기준
            _is_auto_row: false,   // 셀크기를 자의적으로 판단
            _is_auto_col: false,   // 셀크기를 자의적으로 판단

            _template_pos: [0, 0, 0, 0],
        };

        if (unitRow.indexOf("*") > -1)
        {
            ret._is_flexible_row = true;
            ret._row_flexible_length = +unitRow.substring(0, unitRow.indexOf("*"));
        }
        else if (unitRow.indexOf("&") > -1)
        {
            ret._is_auto_row = true;
            ret._row_auto_length = +unitRow.substring(0, unitRow.indexOf("&"));
        }

        if (unitColumn.indexOf("*") > -1)
        {
            ret._is_flexible_col = true;
            ret._col_flexible_length = +unitColumn.substring(0, unitColumn.indexOf("*"));
        }
        else if (unitColumn.indexOf("&") > -1)
        {
            ret._is_auto_col = true;
            ret._col_auto_length = +unitColumn.substring(0, unitColumn.indexOf("&"));
        }

        return ret;
    };
    __pFluidLayoutManager._changeTableTemplate = function (templateInfo, changeType, changeIdx, changeVal)
    {
        // row, col에 따라서 템플릿 인포를 일괄 변경
        switch (changeType)
        {
            case "row":
                var target = templateInfo[changeIdx];
                for (var i in target)
                {
                    target[i]._inner_row = changeVal;
                    target[i]._is_flexible_row = (changeVal.indexOf("*") > -1) ? true : false;
                    target[i]._row_flexible_length = (changeVal.indexOf("*") > -1) ? 1 : 0;

                }
                break;
            case "col":
                for (var i in templateInfo)
                {
                    templateInfo[i][changeIdx]._inner_col = changeVal;
                    templateInfo[i][changeIdx]._is_flexible_col = (changeVal.indexOf("*") > -1) ? true : false;
                    templateInfo[i][changeIdx]._col_flexible_length = (changeVal.indexOf("*") > -1) ? 1 : 0;
                }
                break;
        }
        return templateInfo;
    };

    __pFluidLayoutManager._changeTableTemplates = function (templateInfo, changeType, startIdx, endIdx, changeVal)
    {
        var i, cell_info, targets = [];
        if (changeType == "row")
        {
            var row_flex_sum = 0;
            var row_gap = this._gap[1];

            for (i = startIdx; i <= endIdx; i++)
            {
                cell_info = templateInfo[i][0];
                if (cell_info._is_flexible_row)
                {
                    row_flex_sum += cell_info._row_flexible_length;
                    targets.push(cell_info);
                }
                else
                {
                    changeVal -= cell_info._template_pos[3];
                }
            }
            changeVal -= (endIdx - startIdx) * row_gap;

            for (i = 0; i < targets.length; i++)
            {
                var c_h = (targets[i]._row_flexible_length / row_flex_sum) * changeVal;
                this._changeTableTemplate(templateInfo, "row", targets[i]._idx_row, c_h + "px");
            }
        }
        else if (changeType == "col")
        {
            var col_flex_sum = 0;
            var col_gap = this._gap[0];

            for (i = startIdx; i <= endIdx; i++)
            {
                cell_info = templateInfo[0][i];
                if (cell_info._is_flexible_col)
                {
                    col_flex_sum += cell_info._col_flexible_length;
                    targets.push(cell_info);
                }
                else
                {
                    changeVal -= cell_info._template_pos[2];
                }
            }
            changeVal -= (endIdx - startIdx) * col_gap;

            for (i = 0; i < targets.length; i++)
            {
                var c_w = (targets[i]._col_flexible_length / col_flex_sum) * changeVal;
                this._changeTableTemplate(templateInfo, "col", targets[i]._idx_col, c_w + "px");
            }
        }

        if (targets.length == 0)
            return false;
        else
            return true;
    };

    // TableMatrix Handling
    __pFluidLayoutManager._addTableTemplateMatrix = function (addCount, val, direction)
    {
        var target;
        direction = (direction === undefined) ? this._direction : direction;

        switch (direction)
        {
            case 0:
                target = this._tabletemplate_parse[0];
                break;
            case 1:
                target = this._tabletemplate_parse[1];
                break;
        }

        while (addCount)
        {
            addCount--;
            target.push(val);
        }
    };

    // Table Util
    __pFluidLayoutManager._getTableTemplateInfo = function ()
    {
        var ret = [];
        var area_matrix = this._tabletemplatearea_matrix;

        var rows = this._tabletemplate_parse[0];
        var cols = this._tabletemplate_parse[1];

        rows.forEach(function (row, row_idx)
        {
            if (!ret[row_idx]) ret[row_idx] = [];
            cols.forEach(function (col, col_idx)
            {
                if (area_matrix.length)
                {
                    var name = area_matrix[row_idx] ? area_matrix[row_idx][col_idx] : undefined;
                    var info = this._makeTableTemplateInfo(row_idx, col_idx, row, col, name);
                }
                else
                {
                    var info = this._makeTableTemplateInfo(row_idx, col_idx, row, col);
                }
                ret[row_idx].push(info);
            }, this);
        }, this);


        return ret;
    };
    __pFluidLayoutManager._removeTableTemplateInfo = function (info, row_start, row_end, col_start, col_end)
    {
        var row_diff = row_end - row_start;
        var col_diff = col_end - col_start;
        if (row_diff > 0)
        {
            if (col_diff > 0)
            {
                var del_row_idx = row_start;
                while (del_row_idx <= row_end)
                {
                    var del_col_idx = col_start;
                    while (del_col_idx <= col_end)
                    {
                        info[del_row_idx][del_col_idx] = null;
                        del_col_idx++;
                        //col_diff--;
                    }
                    del_row_idx++;
                    //row_diff--;
                }
            }
            else
            {
                var del_row_idx = row_start;
                while (row_diff >= 0)
                {
                    info[del_row_idx][col_start] = null;
                    del_row_idx++;
                    row_diff--;
                }
            }
        }
        else
        {
            if (col_diff > 0)
            {
                var del_col_idx = col_start;
                while (col_diff >= 0)
                {
                    if (info[row_start])
                        info[row_start][del_col_idx] = null;
                    del_col_idx++;
                    col_diff--;
                }
            }
            else
            {
                var row_start = info[row_start];
                if (row_start)
                    row_start[col_start] = null;
            }
        }
    };

    __pFluidLayoutManager._findUsableCell = function (templateInfo)
    {
        var cell;
        var row_idx = -1;
        var col_idx = -1;
        var row_len = 0;
        var col_len = 0;
        var a = 0;
        switch (this._direction)
        {
            case 0:
                row_len = templateInfo.length;
                for (var i = 0; i < row_len; i++)
                {
                    var row_info = templateInfo[i];
                    col_len = row_info.length;
                    for (var j = 0; j < col_len; j++)
                    {
                        var col_info = row_info[j];
                        if (col_info)
                        {
                            row_idx = i;
                            col_idx = j;
                            break;
                        }
                    }
                    if (row_idx > -1 && col_idx > -1)
                    {
                        break;
                    }
                }
                break;
            case 1:
                row_len = templateInfo.length;
                col_len = templateInfo && templateInfo[0] ? templateInfo[0].length : 0;
                for (var i = 0; i < col_len; i++)
                {
                    for (var j = 0; j < row_len; j++)
                    {
                        if (templateInfo[j][i])
                        {
                            row_idx = j;
                            col_idx = i;
                            break;
                        }
                    }

                    if (row_idx > -1 && col_idx > -1)
                        break;
                }
                break;
        }

        if (row_idx > -1 && col_idx > -1)
        {
            cell = templateInfo[row_idx][col_idx];
            templateInfo[row_idx][col_idx] = null;
        }

        return cell;
    };

    __pFluidLayoutManager._parseTableTemplate = function (strTemplate)
    {
        var ret = {
            parse: [[], []],
            matrix: [],
        };
        var parse = [[], []];

        if (!strTemplate)
        {
            return ret;
        }

        var info = strTemplate.split("/");
        if (info.length != 2)
        {
            return ret;
        }

        var i, j;
        for (i = 0; i < info.length; i++)
        {
            parse[i] = info[i].trim();
            parse[i] = parse[i].split(" ");

            for (j = 0; j < parse[i].length; j++)
            {
                if (!(parse[i][j].indexOf("px") > -1 || parse[i][j].indexOf("%") > -1 || parse[i][j].indexOf("*") > -1))
                {
                    return ret;
                }
            }
        }

        ret.parse = parse;

        return ret;
    };
    __pFluidLayoutManager._parseTableTemplateArea = function (strTemplateArea)
    {
        // return 형태 ( area_name matrix, arena_name coordinate)
        // 잘못된값일때 null, null임
        var ret = {
            area_matrix: [],
            area_coordinate: {},
            area_rect: {}
        };

        // parse templatearea
        if (strTemplateArea)
        {
            var objTemplatearea = [];

            var area_col;
            var tmp_area;

            var start_quat_idx = 0;
            var next_quat_idx = 0;
            do
            {
                start_quat_idx = strTemplateArea.indexOf("\"", next_quat_idx);
                if (start_quat_idx > -1)
                {
                    next_quat_idx = strTemplateArea.indexOf("\"", start_quat_idx + 1);
                    tmp_area = strTemplateArea.substring(start_quat_idx + 1, next_quat_idx);
                    tmp_area = tmp_area.split(" ");

                    // area 전체형태가 사각이 아닐경우 invalid
                    if (area_col === undefined) area_col = tmp_area.length;
                    else if (area_col != tmp_area.length) return ret;

                    objTemplatearea.push(tmp_area);
                }
                next_quat_idx += 1;
            }
            while (start_quat_idx > -1)

            if (objTemplatearea.length > 0)
            {
                // 모든 Area가 사각형인지를 판단함.
                var cache_area = {};
                var cached_area = {};
                var arr_area = [];

                var start_row = 0;
                var start_col = 0;
                var end_col = 0;
                var proc_check_startindex = false;

                var curr_area = "";

                var check_area = "";
                var check_ret;
                var check_range = 0;
                var check_progress = 0;
                var proc_rangecheck = false;

                var is_invalid = false;

                for (var i = start_row; i < objTemplatearea.length; i++)
                {
                    for (var j = start_col; j < objTemplatearea[i].length; j++)
                    {
                        curr_area = objTemplatearea[i][j];
                        cached_area = cache_area[curr_area];
                        if (!cached_area)
                        {
                            if (proc_rangecheck)
                            {
                                // 계산된 range만큼 각 row를 순회
                                if (check_range > check_progress)
                                {
                                    // 전부 일치하지 않으면 바로 윗줄만 사각형 형태임
                                    // 전부 일치하면 사각형 형태이며 다음줄 체크해야함
                                    // 일치 불일치가 섞여 있으면 사각형 형태가 아님
                                    check_progress++;
                                    if (check_area == curr_area)
                                    {
                                        if (check_ret === undefined)
                                        {
                                            // 최초 체크
                                            check_ret = true;
                                            arr_area.push([i, j]);
                                        }
                                        else
                                        {
                                            // 이전값이 true면 true
                                            // 이전값이 false면 invaild 처리하고 루프 종료
                                            if (!check_ret)
                                            {
                                                is_invalid = true;
                                                break;
                                            }
                                            else
                                            {
                                                arr_area.push([i, j]);
                                            }
                                        }
                                    }
                                    else if (check_area != curr_area)
                                    {
                                        if (check_ret === undefined)
                                        {
                                            check_ret = false;
                                        }
                                        else
                                        {
                                            // 이전값이 false면 false
                                            // 이전값이 true면 invaild 처리하고 루프 종료
                                            if (check_ret)
                                            {
                                                is_invalid = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    // 더 검사 안해도 됨
                                    break;
                                }
                            }
                            else
                            {

                                if (curr_area == ".")
                                {
                                    // "." 은 area를 설정하지 않는 의미이므로 check에서 제외함
                                    continue;
                                }

                                // 검색대상을 찾고 해당 row에서 차지하는 범위 계산
                                if (!proc_check_startindex)
                                {
                                    // 최초 검색 대상의 row, col 정보 저장
                                    proc_check_startindex = true;
                                    start_row = i;
                                    start_col = j;
                                }

                                check_range++;
                                arr_area.push([i, j]);

                                if (objTemplatearea[i][j + 1] != curr_area)
                                {
                                    // 현재 row에서  areaname 정보수집 완료
                                    if (objTemplatearea[i + 1])
                                    {
                                        // 다음 row가 있으면
                                        // check process 전환
                                        proc_rangecheck = true;
                                        check_area = curr_area;
                                        end_col = j;
                                    }
                                    else
                                    {
                                        // 다음 row가 없으면 성공 처리후 종료
                                        proc_rangecheck = true;
                                        check_area = curr_area;
                                        is_invalid = false;
                                        end_col = j;
                                    }

                                    break;
                                }
                            }
                        }
                        else
                        {
                            // 체크 대상을 찾는 도중에 캐쉬 되어 있는걸 발견함
                            // invalid 처리
                            if (!proc_rangecheck)
                            {
                                var is_find = false;
                                var len = cached_area.length;
                                while (len)
                                {
                                    if (cached_area[len - 1][0] == i && cached_area[len - 1][1] == j)
                                    {
                                        is_find = true;
                                        break;
                                    }
                                    len--;
                                }

                                if (!is_find)
                                {
                                    is_invalid = true;
                                    break;
                                }
                            }
                        }
                    }

                    if (proc_rangecheck)
                    {
                        if (is_invalid)
                        {
                            // invalid가 되는순간 모든 조건에 관계없이 종료
                            objTemplatearea = [];
                            cache_area = {};
                            break;
                        }
                        else
                        {
                            if (objTemplatearea[i + 1] && objTemplatearea[i + 1][start_col] == check_area)
                            {
                                // 다음라인이 있으면 check를 위한 초기화
                                check_progress = 0;
                                check_ret = undefined;
                            }
                            else
                            {
                                // 체크할 다음라인이 없으면 해당 Area체크는 성공 처리.
                                // 다음 Area 검색을 위한 초기화
                                cache_area[check_area] = arr_area;

                                check_range = 0;
                                check_progress = 0;
                                check_ret = undefined;

                                arr_area = [];
                                proc_rangecheck = false;
                                proc_check_startindex = false;

                                if (objTemplatearea[start_row][end_col + 1])
                                {
                                    // 처음 찾은 row가 더 탐색할 영역이 있음
                                    i = start_row - 1;
                                    start_col = end_col + 1;
                                }
                                else
                                {
                                    // 처음 찾은 row가 더 탐색할 영역이 없음
                                    if (objTemplatearea[start_row + 1])
                                    {
                                        // 다음 row가 있음
                                        i = start_row;
                                        start_col = 0;
                                    }
                                    else
                                    {
                                        // 다음 row가 없음
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        if (is_invalid)
                        {
                            // invalid가 되는순간 모든 조건에 관계없이 종료
                            objTemplatearea = [];
                            cache_area = {};
                            break;
                        }
                    }
                }
            }
            else
            {
                // invalid 처리
                objTemplatearea = [];
                cache_area = {};
            }

            ret.area_matrix = objTemplatearea;
            ret.area_coordinate = cache_area;
        }

        return ret;
    };

    __pFluidLayoutManager._getTablecellareaByTabletemplatearea = function (templatearea)
    {
        var info = this._tabletemplatearea_coordinate[templatearea];
        if (info)
        {
            var start_col = -1, start_row = -1, end_col = -1, end_row = -1;
            for (var i = 0, len = info.length; i < len; i++)
            {
                var coord = info[i];
                if (coord)
                {
                    var row_idx = coord[0];
                    var col_idx = coord[1];
                    if (i == 0)
                    {
                        start_row = end_row = row_idx;
                        start_col = end_col = col_idx;
                    }
                    else
                    {
                        if (row_idx < start_row)
                            start_row = row_idx;
                        if (col_idx < start_col)
                            start_col = col_idx;
                        if (row_idx > end_row)
                            end_row = row_idx;
                        if (col_idx > end_col)
                            end_col = col_idx;
                    }
                }
            }
            if (start_row == end_row && start_col == end_col)
                return start_row + "/" + start_col;
            else
                return start_row + " " + end_row + "/" + start_col + " " + end_col;
            //trace("_getTableTemplateInfo1",(start_row == end_row ? start_row : start_row + " " + end_row) + "/" +(start_col == end_col ? start_col : start_col + " " + end_col));
            //return (start_row == end_row ? start_row : start_row + " " + end_row) + "/" + (start_col == end_col ? start_col : start_col + " " + end_col);
        }
        return;
    };

    // Contents Apply
    __pFluidLayoutManager._applyContent = function ()
    {
        var contents = this._fluidcontents;
        var content, target;

        var arrange_type = this.getLayoutArrangeType();
        switch (arrange_type)
        {
            case 0: // CSS Native
                for (var i = 0; i < contents.length; i++)
                {
                    content = contents[i];
                    target = content._target;
                    var container_comp = target._is_group ? null : target._p_parent._p_parent;
                    if (container_comp && container_comp._calced_container && target._is_created)
                        return;
                    target._setContentInfo(content);
                }
                break;
            case 1: // Adjust Calc
                for (var i = 0; i < contents.length; i++)
                {
                    content = contents[i];
                    target = content._target;
                    // set adjust prop
                    var is_move = target._adjust_left != content._adjust_pos[0] || target._adjust_top != content._adjust_pos[1];
                    var is_resize = target._adjust_width != content._adjust_pos[2] || target._adjust_height != content._adjust_pos[3];
                    //trace("targetid", contents.length,target.id, is_resize, is_move, content._adjust_pos[0], content._adjust_pos[1]);

                    if (this._fittocontents != 0)
                    {
                        var container_comp = target._is_group ? null : target._p_parent._p_parent;
                        if (container_comp && container_comp._calced_container && target._is_created)
                            continue;
                    }

                    // set adjust prop
                    target._setContentSize(content._size[0], content._size[1]);
                    target._setAdjustProps(content._adjust_pos[0], content._adjust_pos[1], content._adjust_pos[2], content._adjust_pos[3]);
                    // set control update
                    target.on_update_position(is_resize, is_move);
                }
                break;
        }
    };
    __pFluidLayoutManager._applyAbsoluteContainer = function (objContainer, containerSize)
    {
        var container_comp = objContainer._p_parent;
        //var parent_comp = container_comp._p_parent;
        var is_resize = container_comp._adjust_width != containerSize[0] || container_comp._adjust_height != containerSize[1];

        container_comp._setAdjustSize(containerSize[0], containerSize[1]);
        //container_comp._update_layoutbasis();
        /*
        if (container_comp.parent._is_flexible_container)
        {
            var target_elem = container_comp.getElement();
            if (target_elem)
            {
                trace("_applyAbsoluteContainer",container_comp.id, containerSize[0], containerSize[1])
                //target_elem._setElementLayoutBasis(true);
            }
        }
        */
        container_comp.on_update_position(true, false);
        container_comp._calced_container = true;

        return is_resize;
    };
    __pFluidLayoutManager._applyFluidContainer = function (objContainer, containerSize)
    {
        var container_comp = objContainer._is_panel ? objContainer : objContainer._p_parent;
        var is_resize = container_comp._adjust_width != containerSize[0] || container_comp._adjust_height != containerSize[1];

        var arrange_type = this.getLayoutArrangeType();
        switch (arrange_type)
        {
            //여기 보완 필요함
            case 0: // CSS Native
                if (is_resize)
                {
                    container_comp._setAdjustSize(containerSize[0], containerSize[1]);
                    objContainer._setAdjustSize(containerSize[0], containerSize[1]);
                    // set control update
                    var target_elem = container_comp.getElement();
                    if (target_elem)
                    {
                        if (container_comp._isFluidContainer())
                        {
                            target_elem._updateInnerElement(containerSize[0], containerSize[1]);
                            container_comp._update_layoutbasis(true);
                        }
                        else
                            target_elem.setElementSize(containerSize[0], containerSize[1]);

                    }
                    container_comp.on_fire_onsize(containerSize[0], containerSize[1]);
                }
                break;
            case 1: // Adjust Calc
                container_comp._setAdjustSize(containerSize[0], containerSize[1]);
                objContainer._setAdjustSize(containerSize[0], containerSize[1]);

                container_comp.on_update_position(true, false);

                break;
        }
        container_comp._calced_container = true;

        return is_resize;
    };

    // FluidManager Util
    __pFluidLayoutManager._adjustFloatingPoint = function (floatingPoint)
    {
        // under / over 계산된 floatingPoint를 절삭 / 절상
        // 예외 발생시 케이스보고 추가 처리...
        floatingPoint = +floatingPoint;
        var diff = floatingPoint.toFixed(3) - floatingPoint;
        if (diff < 0)
        {
            if (diff.toFixed(3) == 0)
            {
                floatingPoint = Math.floor(floatingPoint * 100) / 100;
            }
        }
        else if (diff > 0)
        {
            if (diff.toFixed(3) == 0)
            {
                floatingPoint = Math.floor(floatingPoint * 100) / 100;
            }
        }
        return floatingPoint;
    };

    __pFluidLayoutManager._setContentAdjustSize = function (content, l, t, w, h)
    {
        content._adjust_pos = [l, t, w, h];
    };
    __pFluidLayoutManager._setContentAdjustLeft = function (content, l)
    {
        content._adjust_pos[0] = l;
    };
    __pFluidLayoutManager._setContentAdjustTop = function (content, t)
    {
        content._adjust_pos[1] = t;
    };
    __pFluidLayoutManager._setContentAdjustWidth = function (content, w)
    {
        content._adjust_pos[2] = w;
    };
    __pFluidLayoutManager._setContentAdjustHeight = function (content, h)
    {
        content._adjust_pos[3] = h;
    };

    __pFluidLayoutManager._getContentAdjustWidth = function (content)
    {
        return content._adjust_pos[2];
    };
    __pFluidLayoutManager._getContentAdjustHeight = function (content)
    {
        return content._adjust_pos[3];
    };
    __pFluidLayoutManager._getContentAdjustLeft = function (content)
    {
        return content._adjust_pos[0];
    };
    __pFluidLayoutManager._getContentAdjustTop = function (content)
    {
        return content._adjust_pos[1];
    };
    __pFluidLayoutManager._getContentAdjustRight = function (content)
    {
        return content._adjust_pos[0] + content._adjust_pos[2];
    };
    __pFluidLayoutManager._getContentAdjustBottom = function (content)
    {
        return content._adjust_pos[1] + content._adjust_pos[3];
    };
    __pFluidLayoutManager._setTemplatAdjustSize = function (content, l, t, w, h)
    {
        content._template_pos = [l, t, w, h];
    };

    __pFluidLayoutManager._getTemplateAdjustLeft = function (content)
    {
        return content._template_pos[0];
    };
    __pFluidLayoutManager._getTemplateAdjustTop = function (content)
    {
        return content._template_pos[1];
    };
    __pFluidLayoutManager._getTemplateAdjustWidth = function (content)
    {
        return content._template_pos[2];
    };
    __pFluidLayoutManager._getTemplateAdjustHeight = function (content)
    {
        return content._template_pos[3];
    };

    __pFluidLayoutManager._setTemplateRectInfo = function (info)
    {
        // auto-cell 포함되서 계속 갱신됨
        var rect = [];

        info.forEach(function (row, row_idx)
        {
            if (!rect[row_idx]) rect[row_idx] = [];

            row.forEach(function (col, col_idx) { rect[row_idx].push(col._template_pos); }, this);
        }, this);

        this._tabletemplate_rect = rect;
    };
    __pFluidLayoutManager._getTemplateRectInfo = function ()
    {
        return this._tabletemplate_rect;
    };
    __pFluidLayoutManager._getTemplateRect = function (row_start, row_end, col_start, col_end)
    {
        var templateInfo = this._tabletemplate_rect;
        var start_cell_l = 0;
        var start_cell_t = 0;
        var end_cell_l = 0;
        var end_cell_t = 0;
        var end_cell_w = 0;
        var end_cell_h = 0;
        var templateInfo_row = templateInfo[row_start];
        if (templateInfo_row)
        {
            var start_cell_info = templateInfo_row[col_start];
            if (start_cell_info)
            {
                start_cell_l = start_cell_info[0];
                start_cell_t = start_cell_info[1];
            }
        }
        templateInfo_row = templateInfo[row_end];
        if (templateInfo_row)
        {
            var end_cell_info = templateInfo_row[col_end];
            if (end_cell_info)
            {
                end_cell_l = end_cell_info[0];
                end_cell_t = end_cell_info[1];
                end_cell_w = end_cell_info[2];
                end_cell_h = end_cell_info[3];
            }
        }

        var cell_w = end_cell_l + end_cell_w - start_cell_l;
        var cell_h = end_cell_t + end_cell_h - start_cell_t;

        return [start_cell_l, start_cell_t, cell_w, cell_h];
    };
    __pFluidLayoutManager._parseContentSize = function (content_size, container_size)
    {
        switch (typeof content_size)
        {
            case "string":
                if (typeof content_size == "string")
                {
                    if (content_size.indexOf("%") > -1 || content_size.indexOf("em") > -1)
                    {
                        var _content_size = parseFloat(content_size);
                        if (content_size.indexOf("%") > -1)
                        {
                            _content_size *= 0.01;
                        }
                        content_size = _content_size * container_size;
                    }
                    else
                    {
                        content_size = parseFloat(content_size);
                    }
                }
                break;
            case "number":
            default:
                break;
        }

        return content_size;
    };

    __pFluidLayoutManager._getContentMinMaxSize = function (content_size, min, max)
    {
        if (min && min >= 0)
            if (min > content_size)
                content_size = min;

        if (max && max >= 0)
            if (max < content_size)
                content_size = max;

        return content_size;
    };

    __pFluidLayoutManager._setContentMaxRight = function (r)
    {
        this._max_contents_right = this._adjustFloatingPoint(r);
    };
    __pFluidLayoutManager._setContentMaxBottom = function (b)
    {
        this._max_contents_bottom = this._adjustFloatingPoint(b);
    };
    __pFluidLayoutManager._getContentMaxRight = function ()
    {
        return this._max_contents_right;
    };
    __pFluidLayoutManager._getContentMaxBottom = function ()
    {
        return this._max_contents_bottom;
    };

    __pFluidLayoutManager._setFitContentMaxRight = function (r)
    {
        this._max_fit_contents_right = r;
    };
    __pFluidLayoutManager._setFitContentMaxBottom = function (b)
    {
        this._max_fit_contents_bottom = b;
    };
    __pFluidLayoutManager._getFitContentMaxRight = function ()
    {
        return this._max_fit_contents_right;
    };
    __pFluidLayoutManager._getFitContentMaxBottom = function ()
    {
        return this._max_fit_contents_bottom;
    };

    //==============================================================================
    // nexacro.Window
    //==============================================================================
    nexacro._Window = function (id, parent, is_main)
    {
        this.id = id;
        this.parent = parent;
        this.frame = null;
        this.root = null;
        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;
        this.clientWidth = 0;
        this.clientHeight = 0;
        this._wheelZoom = 100;
        this._enableWheelZoom = true;

        //------------ internal variable --------------//
        this.handle = null;
        this._doc = null;
        this._dest_doc = null;
        this.dest_handle = null;
        this._is_window = true;
        this._is_alive = true;
        this._is_main = (is_main || false);
        this._Init_sysevent_flag = false;
        this._prepared_flag = false;

        this._offset_client_width = -1;
        this._offset_client_height = -1;

        this._gap_client_width = 0;
        this._gap_client_height = 0;
        this._is_killfocusing = false;

        this._focus_list = null;
        this._child_list = new nexacro.Collection(); // child nexacro.Window list (for modeless,modalAsync)
        this._lock_list = [];   // locked parent list
        this._locker_list = []; // window list that locked me
        this._disable_ref = 0;  // locked refcount (for modalAsync)
        this._capture_complist = []; // event capturing component list (stack) [comp, capturelevel]


        this._last_focused_elem = null; // for Forwarding KeyEvent 
        this._accessibility_last_focused_comp = null; // for accessibility Android runtime
        /* for accessibility sensereader virtual cursor mode */
        this._is_fire_sys_keydown = false; // checking fire the keydown event
        this._is_fire_sys_focusin = false; // checking fire the focusin event
        this._is_fire_virtual_mousedown = false; // checking fire mousedown from sensereader

        this._cur_screen_pos = { "x": undefined, "y": undefined }; // for Checking mousemove event
        this._cur_wheel_pos = { "x": undefined, "y": undefined }; // for Checking mousewheel event
        this._event_positions = { "screenX": undefined, "screenY": undefined, "clientX": undefined, "clientY": undefined };
        this._cur_touch_elem = null;
        this._cur_ldown_elem = null; // for current lbuttondown element
        this._cur_rdown_elem = null; // for current rbuttondown element
        this._cur_mdown_elem = null; // for current mousedown element except for lbutton and rbutton
        this._curWindowX = null; //save x at lbuttondown for track
        this._curWindowY = null; //save x at lbuttondown for track
        this._currentTouchEvents = [];

        this._modal_frame_stack = []; // stack of ModalFrameInfo
        this._ignore_close_confirm = false; // [I'm closing by parent] flag
        this._postmsg_data_que = []; // que postmessage

        this._gesture_manager = new nexacro._TouchGestureManager();

        // init initial event handler
        // changed by capture element -> restore by release capture
        this._on_sys_popstate = this._on_default_sys_popstate;
        this._on_sys_message = this._on_default_sys_message;
        this._on_sys_lbuttondown = this._on_default_sys_lbuttondown;
        this._on_sys_rbuttondown = this._on_default_sys_rbuttondown;
        this._on_sys_lbuttonup = this._on_default_sys_lbuttonup;
        this._on_sys_rbuttonup = this._on_default_sys_rbuttonup;
        this._on_sys_mouseup = this._on_default_sys_mouseup;
        this._on_sys_mousedown = this._on_default_sys_mousedown;
        this._on_sys_mouseenter = this._on_default_sys_mouseenter;
        this._on_sys_mouseleave = this._on_default_sys_mouseleave;
        this._on_sys_mousemove = this._on_default_sys_mousemove;
        this._on_sys_mousewheel = this._on_default_sys_mousewheel;
        this._on_sys_dragenter = this._on_default_sys_dragenter;
        this._on_sys_dragover = this._on_default_sys_dragover;
        this._on_sys_dragleave = this._on_default_sys_dragleave;
        this._on_sys_drop = this._on_default_sys_drop;
        this._on_sys_keydown = this._on_default_sys_keydown;
        this._on_sys_keypress = this._on_default_sys_keypress;
        this._on_sys_keyup = this._on_default_sys_keyup;
        //this._on_sys_click = this._on_default_sys_click;
        this._on_sys_dblclick = this._on_default_sys_dblclick;
        this._on_sys_contextmenu = this._on_default_sys_contextmenu;

        this._on_sys_resize = this._on_default_sys_resize;
        this._on_sys_move = this._on_default_sys_move;
        this._on_sys_getminmaxinfo = this._on_default_sys_getminmaxinfo;
        this._on_sys_activate = this._on_default_sys_activate;
        this._on_sys_deactivate = this._on_default_sys_deactivate;
        this._on_sys_beforeclose = this._on_default_sys_beforeclose;
        this._on_sys_close = this._on_default_sys_close;

        this._on_sys_reload = this._on_default_sys_reload;
        this._on_sys_syscommand = this._on_default_sys_syscommand;

        this._on_sys_touchstart = this._on_default_sys_touchstart;
        this._on_sys_touchmove = this._on_default_sys_touchmove;
        this._on_sys_touchend = this._on_default_sys_touchend;
        this._on_sys_touchcancel = this._on_default_sys_touchcancel;

        this._on_sys_load = this._on_default_sys_load;
        this._on_sys_orientationchange = this._on_default_sys_orientationchange;

        this._on_sys_accessibilitygesture = this._on_default_sys_accessibilitygesture;
        this._on_sys_accessibilityhover = this._on_default_sys_accessibilityhover;
        // ExtensionAPIv2
        this._on_sys_onextmodule = this._on_default_sys_onextmodule;
        this._on_sys_onextendedcommand = this._on_default_sys_onextendedcommand;



    };

    var __pWindow = nexacro._createPrototype(nexacro.Object, nexacro._Window);
    nexacro._Window.prototype = __pWindow;
    __pWindow._type_name = "Window";

    __pWindow._gesture_manager = null;
    __pWindow.__contaienr_rect = null;
    __pWindow._getBoundingClientRect = function ()
    {
        return this.__contaienr_rect.get();
    }
    __pWindow.__createRectManager = function (handle)
    {
        return (function ()
        {

            let state = { x: 0, y: 0, left: 0, top: 0, clientWidth: 0, clientHeight: 0, offsetWidth: 0, offsetHeight: 0 };
            let win_handle = handle;
            return {
                set: ({ left, top, width, height }) =>
                {
                    if (!nexacro._ishandleWindow(win_handle))
                    {
                        if (left !== undefined) state.left = left;
                        if (left !== undefined) state.top = top;
                        if (width !== undefined) state.clientWidth = width;
                        if (height !== undefined) state.clientHeight = height;
                    }
                },
                get: () => 
                {
                    let x = nexacro._getWindowHandlePosX(win_handle);
                    let y = nexacro._getWindowHandlePosY(win_handle);

                    state.x = x + state.left;
                    state.y = y + state.top;
                    if (!nexacro._ishandleWindow(win_handle))
                    {
                        state.x = x + state.left;
                        state.y = y + state.top;

                    }
                    else
                    {
                        state.x = state.left = x;
                        state.y = y + state.top;
                    }

                    // state를 유지해야 하기 때문에 copy return;
                    return { ...state }
                }
            };
        })();
    };
    __pWindow.getRootInstance = function () // Application | Form
    {
        const app = nexacro.getApplication();
        const findapp = () =>
        {
            return this.handle ? nexacro.__MFEAPI._getRootApp(this.handle) : null;
        }
        return app ? app : findapp();
    }
    __pWindow.updateClientRect = function (clientRect)
    {
        const { x, y, width, height } = clientRect;
        const elem = this.handle;
        /// getBoundingClientRect 좌표 계산 캐시용


    }
    __pWindow.getOffsetClientPos = function (handle)
    {
        const pos = { x: undefined, y: undefined };
        const win = nexacro._handletoWindow(handle);
        if (this._event_positions.screenX)
        {
            const ratio = nexacro._getDevicePixelRatio()
            pos.x = (this._event_positions.screenX - (this._event_positions.clientX * ratio));
            pos.y = (this._event_positions.screenY - (this._event_positions.clientY * ratio));
        }
        else
        {

            const outH = nexacro._getWindowHandleOuterHeight(handle);
            const inH = nexacro._getWindowHandleClientHeight(handle);

            pos.x = 0;
            pos.y = (outH - inH);

        }

        return pos;
    }
    //------------------------------------------------------------------------------
    __pWindow.attachHandle = function (handle)
    {
        if (!this.handle)
        {
            this.handle = handle;
            this._doc = this._dest_doc = nexacro._getWindowDocumentHandle(handle);
            this.dest_handle = nexacro._getWindowDestinationHandle(handle);

            this.left = nexacro._getContainerHandlePosX(handle);
            this.top = nexacro._getContainerHandlePosY(handle);
            this.width = nexacro._getWindowHandleOuterWidth(handle);
            this.height = nexacro._getWindowHandleOuterHeight(handle);
            var clientWidth = nexacro._getContainerHandleClientWidth(handle);
            var clientHeight = nexacro._getContainerHandleClientHeight(handle);
            this.clientWidth = (clientWidth === 0) ? this.width : clientWidth;
            this.clientHeight = (clientHeight === 0) ? this.height : clientHeight;
            this._gap_client_width = this.width - this.clientWidth;
            this._gap_client_height = this.height - this.clientHeight;
        }
    };


    __pWindow.attachRoot = function (rootcomp, refresh_flag, createcallback)
    {
        this.root = this.frame = rootcomp; // 임시 
        if (createcallback)
        {
            if (refresh_flag)
                return createcallback()._onPrepareWindowHandle();
            else
                return createcallback();
        }
        else
        {
            if (refresh_flag)
                this._onPrepareWindowHandle();
        }

    };

    __pWindow.attachFrame = function (frame, refresh_flag)
    {
        this.frame = frame;
        if (this.attachRoot) // 임시 처리
            return this.attachRoot(frame, refresh_flag)
        if (refresh_flag)
            this._onPrepareWindowHandle();
    };

    __pWindow._setSystemMenuResizable = function (resizable)
    {
        nexacro._setSystemMenuResizable(this.handle, resizable);
    };

    __pWindow._procSysCommand = function (command)
    {
        nexacro._procSysCommand(this.handle, command);
    };

    __pWindow._postMessage = function (target_comp, id, func, userdata)
    {
        var data = { id: id, userdata: userdata, target: target_comp, func: func };
        this._postmsg_data_que.push(data);
        nexacro._postMessage(id, this, target_comp, '*');
    };

    __pWindow._onPrepareWindowHandle = function ()
    {
        if (!this._prepared_flag)
        {
            this._prepared_flag = true;

            if (this.root)
                this.root.on_created();

        }
    };
    __pWindow._onPrepareModalWindowHandle = function ()
    {
        if (!this._prepared_flag)
        {
            this._prepared_flag = true;
            if (this.root)
            {
                this.root.createComponent();
                this.root.on_created();
            }
        }
    };

    __pWindow.refresh = function ()
    {
        if (this.handle && this._prepared_flag && this.root)
        {
            this.root.on_refresh();
        }
    };

    __pWindow.setLinkedWindow = function (handle)
    {
        nexacro._setLinkedWindow(handle, this);
        this.attachHandle(handle);
    };

    __pWindow.addChild = function (childwin)
    {
        this._child_list.add_item(childwin.id, childwin);
    };

    __pWindow.create = function (_parent, name, width, height, left, top, resizable, layered, taskbar)
    {
        if (_parent)
        {
            _parent._child_list.add_item(name, this);
        }
        nexacro._createWindowHandle(_parent, this, name, left, top, width, height, resizable, layered, taskbar, this._is_main);

        return this;
    };


    __pWindow.createModal = function (_parent, name, width, height, left, top, resizable, layered, lockmode)
    {
        if (_parent)
        {
            _parent._child_list.add_item(name, this);
        }
        return nexacro._createModalWindowHandle(_parent, this, name, left, top, width, height, resizable, layered, lockmode);
    };

    __pWindow.createModalAsync = function (_parent, name, width, height, left, top, resizable, layered, lockmode)
    {
        if (_parent)
        {
            _parent._child_list.add_item(name, this);
        }

        // lock windows
        var root_win = this; // 생성될 window의 root
        while (root_win.parent)
            root_win = root_win.parent;

        // parent=null인 경우 runbase를 parent로..
        if (_parent)
            this._lock_list[0] = root_win;
        else
            this._lock_list[0] = this.root._runbase_window;

        if (lockmode == 1) // lock=all
        {
            var popupframes = nexacro.getPopupFrames();
            if (popupframes)
            {
                for (var i = 0, len = popupframes.length; i < len; i++)
                {
                    var popup_frame = popupframes[i];
                    var popup_win = popup_frame._window;
                    if (popup_win == this)
                        continue;
                    var popup_root = popup_win;
                    while (popup_root.parent)
                        popup_root = popup_root.parent;
                    if (popup_root == root_win)
                        continue;
                    if (nexacro._indexOf(this._lock_list, popup_root) < 0)
                        this._lock_list.push(popup_root);
                }
            }
        }

        // create handle (for except from locklist)
        nexacro._createModalAsyncWindowHandle(_parent, this, name, left, top, width, height, resizable, layered, lockmode);

    };

    __pWindow.destroy = function ()
    {
        // ModalAsync callback처리시 IE에서 문제가 있어서 2개 파트로 나눔
        if (!this._is_alive)
            return;

        this._destroyVisiblePart();
        this._destroyInternalPart();
        if (this.handle)
        {
            nexacro._closeWindowHandle(this.handle);
        }
    };

    __pWindow._destroyVisiblePart = function ()
    {
        if (!this._is_alive)
            return;

        this._is_alive = false;

        // destroy childs
        this._closeChildWindows();

        // unlock if modalAsync
        if (this._lock_list.length > 0)
        {
            const locklen = this._lock_list.length;
            for (let i = locklen - 1; i >= 0; i--)
            {
                const locked_window = this._lock_list[i];
                if (!locked_window || !locked_window.root)
                    continue;
                nexacro._setWindowHandleLock(locked_window.handle, false, this.handle, true);
            }
        }

        // close handle
        if (this.handle)
        {
            const repeatInfo = nexacro._cur_repeat_info;
            if (repeatInfo && repeatInfo.targetwin == this)
            {
                if (repeatInfo._timer)
                {
                    nexacro._clearSystemTimer(this.handle, repeatInfo._timer);
                }
            }

        }

    };

    __pWindow._destroyInternalPart = function ()
    {

        nexacro._removeProtocols();
        nexacro._removeDeviceAdaptors();

        if (this.parent)
            this.parent._child_list.delete_item(this.id);

        // destroy modal frames
        const modal_frame_stack = this._modal_frame_stack;
        const modal_frame_stack_len = modal_frame_stack.length;
        for (let i = modal_frame_stack_len - 1; i >= 0; i--)
        {
            const modal_frame_info = modal_frame_stack[i];
            const frame = modal_frame_info[0];
            if (frame._is_alive)
                frame._destroy();
        }

        // destroy Self
        if (this.root)
        {
            nexacro._unregisterPopupFrame(this.root.id);
            if (!this.root._isMain() && (this.root._is_window && (this.root._window_type != 2 && this.root._window_type != 5)))
                this.root._on_close();

            if (this.root._is_alive)
                this.root._destroy();

        }

        nexacro._destroyPopupFrameInfo(this);
        nexacro._destroyManagerFrame(this.handle);
        nexacro._destroyManagerShadow(this.handle);
        this._doc = this._dest_doc = null;
        this.dest_handle = null;
        this.parent = null;
        this._postmsg_data_que = null;

        //////////////////////////////////////////////////////////////////////////
        // clear event handlers
        this._on_sys_popstate = null;
        this._on_sys_message = null;
        this._on_sys_lbuttondown = null;
        this._on_sys_rbuttondown = null;
        this._on_sys_lbuttonup = null;

        this._on_sys_drag_lbuttonup = null;

        this._on_sys_rbuttonup = null;
        this._on_sys_mouseup = null;
        this._on_sys_mousedown = null;
        this._on_sys_mouseenter = null;
        this._on_sys_mouseleave = null;
        this._on_sys_mousemove = null;

        this._on_sys_drag_mousemove = null;

        this._on_sys_mousewheel = null;

        this._on_sys_dragenter = null;
        this._on_sys_dragmove = null;
        this._on_sys_dragleave = null;
        this._on_sys_drop = null;

        this._on_sys_keydown = null;
        this._on_sys_keypress = null;
        this._on_sys_keyup = null;
        this._on_sys_click = null;
        this._on_sys_dblclick = null;
        this._on_sys_contextmenu = null;
        this._on_sys_resize = null;
        this._on_sys_move = null;
        this._on_sys_activate = null;
        this._on_sys_deactivate = null;

        this._on_sys_getminmaxinfo = null;
        this._on_sys_reload = null;
        this._on_sys_syscommand = null;
        this._on_sys_load = null;
        this._on_sys_orientationchange = null;

        this._on_sys_accessibilitygesture = null;
        this._on_sys_accessibilityhover = null;
        // ExtensionAPIv2
        this._on_sys_onextmodule = null;

    };

    //------------------------------------------------------------------------------
    __pWindow.moveBy = function (dx, dy)
    {
        if (this.handle && dx && dy)
        {
            var l = this.left + (dx | 0);
            var t = this.top + (dy | 0);
            nexacro._setWindowHandlePos(this.handle, l, t);
            this.left = nexacro._getContainerHandlePosX(this.handle);
            this.top = nexacro._getContainerHandlePosY(this.handle);
        }
    };

    __pWindow.moveTo = function (l, t)
    {
        if (this.handle)
        {
            if (l === undefined || l === null) l = this.left;
            if (t === undefined || t === null) t = this.top;
            nexacro._setWindowHandlePos(this.handle, l, t);
            this.left = nexacro._getContainerHandlePosX(this.handle);
            this.top = nexacro._getContainerHandlePosY(this.handle);
        }
    };

    __pWindow.setArea = function (l, t, w, h)
    {
        if (this.handle)
        {
            l = (l || this.left);
            t = (t || this.top);
            w = (w || this.width);
            h = (h || this.height);
            nexacro._setWindowHandleArea(this.handle, l, t, w, h);

            this.left = nexacro._getContainerHandlePosX(this.handle);
            this.top = nexacro._getContainerHandlePosY(this.handle);

            this.width = nexacro._getWindowHandleOuterWidth(this.handle);
            this.height = nexacro._getWindowHandleOuterHeight(this.handle);
            this.clientWidth = nexacro._getContainerHandleClientWidth(this.handle);
            this.clientHeight = nexacro._getContainerHandleClientHeight(this.handle);
            this._gap_client_width = this.width - this.clientWidth;
            this._gap_client_height = this.height - this.clientHeight;
        }
    };
    __pWindow.setSize = function (w, h)
    {
        if (this.handle)
        {
            w = (w || this.width);
            h = (h || this.height);
            nexacro._setWindowHandleSize(this.handle, w, h);
            this.width = nexacro._getWindowHandleOuterWidth(this.handle);
            this.height = nexacro._getWindowHandleOuterHeight(this.handle);
            this.clientWidth = nexacro._getContainerHandleClientWidth(this.handle);
            this.clientHeight = nexacro._getContainerHandleClientHeight(this.handle);
            this._gap_client_width = this.width - this.clientWidth;
            this._gap_client_height = this.height - this.clientHeight;
        }
    };

    __pWindow.setZIndex = function (zindex)
    {
        if (this.zindex != zindex)
        {
            this.zindex = zindex;
            var handle = this.handle;
            if (handle)
            {
                nexacro._setWindowHandleZIndex(handle, zindex);
            }
        }
    };

    __pWindow.getLeft = function ()
    {
        if (this.handle)
            this.left = nexacro._getContainerHandlePosX(this.handle);
        return this.left;
    };
    __pWindow.getTop = function ()
    {
        if (this.handle)
            this.top = nexacro._getContainerHandlePosY(this.handle);
        return this.top;
    };
    __pWindow.getWidth = function ()
    {
        return this.width;
    };
    __pWindow.getHeight = function ()
    {
        return this.height;
    };

    __pWindow.getClientWidth = function ()
    {
        return this.clientWidth;
    };
    __pWindow.getClientHeight = function ()
    {
        return this.clientHeight;
    };

    __pWindow.setVisible = function (/*visible*/)
    {

    };



    __pWindow.getActiveFrame = function ()
    {
        let frame = this._getLastModalFrame();
        if (frame)
            return frame;

        frame = this.root;
        while (frame && frame.getActiveFrame)
        {
            frame = frame.getActiveFrame();
        }
        return frame;
    };

    __pWindow.getCurrentFocusPaths = function ()
    {
        return this._focus_list;
    };

    __pWindow.addCurrentFocusPaths = function (obj)
    {
        if (this._focus_list == null)
            this._focus_list = [];
        this._focus_list.push(obj);
    };
    __pWindow.clearCurrentFocusPaths = function ()
    {
        if (this._focus_list)
        {
            var obj = this._focus_list.pop();
            while (obj)
            {
                obj = this._focus_list.pop();
            }
            this._focus_list.length = 0;
        }
    };

    // FocusPath에서 obj포함 그 이하를 모두 제거한다.
    __pWindow._removeFromCurrentFocusPath = function (obj, clear_last_focus, new_focus, new_refer_focus)
    {
        if (clear_last_focus === undefined)
            clear_last_focus = true;
        var idx = this._indexOfCurrentFocusPaths(obj);
        if (idx > -1 || (idx == -1 && obj == null))
        {
            // KillFocus처리까지
            var min_idx = (idx > -1) ? idx : 0;
            var focuspath_len = this._getCurrentFocusPathsLength() - 1;
            for (var i = focuspath_len; i >= min_idx; i--)
            {
                var comp = this._focus_list[i];
                if (comp)
                {
                    if (comp._is_alive)
                    {
                        if (comp._is_subcontrol)
                        {
                            var tmp_comp = comp;
                            var alive = true;

                            while (tmp_comp)
                            {
                                if (tmp_comp._is_alive === false)
                                {
                                    alive = false;
                                    break;
                                }
                                tmp_comp = tmp_comp.parent;
                            }

                            if (alive)
                            {
                                comp._changeStatus("focused", false);
                            }
                        }
                        else
                        {
                            comp._changeStatus("focused", false);
                        }
                    }
                    if (idx > -1)
                        --this._focus_list.length;

                    if (comp._is_alive && comp._on_killfocus)
                        comp._on_killfocus(new_focus, new_refer_focus);

                    if (comp.parent && clear_last_focus === true)
                    {
                        // showmodal의 경우 parent를 지정하게 되면 showmodal이 close될때 parent의 _last_focused를 지우게 됨.
                        // 이에 focusPath의 최상단의 경우 물려있는 _last_focused가 focuspath상에서 제거하려는 component와 동일한지 비교하여 같은 경우에만 제거
                        if (i > min_idx || comp.parent._last_focused == comp)
                        {
                            comp.parent._last_focused = null;
                        }
                    }
                }
            }

        }
    };

    __pWindow._indexOfCurrentFocusPaths = function (obj)
    {
        if (this._focus_list)
        {
            return nexacro._indexOf(this._focus_list, obj);
        }

        return -1;
    };

    __pWindow._getCurrentFocusPathsLength = function ()
    {
        if (this._focus_list)
            return this._focus_list.length;
        return 0;
    };

    // visible, enable, enableevent를 무시하고 component를 찾아냄.
    __pWindow.findComponent = function (elem, x, y)
    {
        var tmp;
        if (x === undefined && y === undefined)
        {
            tmp = elem;
            while (tmp && !tmp._is_component)
            {
                tmp = tmp.parent;
            }
            return tmp;
        }
        else
        {
            if (!elem) return [elem, x, y];
            tmp = elem;
            while (tmp && !tmp._is_component)
            {
                x += tmp.left;
                y += tmp.top;
                x -= tmp._scroll_left || 0;
                y -= tmp._scroll_top || 0;
                tmp = tmp.parent;
            }
            if (!tmp) return [tmp, x, y];
            var control_elem = tmp._control_element;
            if (control_elem)
            {
                x -= control_elem.left;
                y -= control_elem.top;
            }
            return [tmp, x, y];
        }
    };

    // 실제 이벤트가 발생할 수 있는 컴포넌트를 찾아냄.
    __pWindow._findComponentForEvent = function (elem, x, y)
    {
        var tmp;
        if (x === undefined && y === undefined)
        {
            tmp = elem;
            while (tmp)
            {
                if (tmp._is_component)
                {
                    if (tmp.visible && tmp._isEnable() && tmp.enableevent)
                        break;
                }
                tmp = tmp.parent;
            }
            return tmp;
        }
        else
        {
            if (!elem) return [elem, x, y];
            tmp = elem;
            var is_passed = false;
            while (tmp)
            {
                if (!tmp._is_component)
                {
                    x += tmp.left;
                    y += tmp.top;
                    x -= tmp._scroll_left || 0;
                    y -= tmp._scroll_top || 0;

                    tmp = tmp.parent;
                }
                else
                {
                    if (tmp.visible && tmp._isEnable() && tmp.enableevent)
                        break;
                    else
                        is_passed = true;
                    x = y = 0;
                    tmp = tmp._control_element.parent_elem;
                }
            }
            if (!tmp) return [tmp, x, y];
            var control_elem = tmp._control_element;
            if (control_elem)
            {
                x -= control_elem.left;
                y -= control_elem.top;
            }
            if (is_passed)
                return [tmp, x, y, true];
            return [tmp, x, y];
        }
    };

    // 공통 parent component를 찾아냄.
    __pWindow.findCommonParentComponent = function (comp1, comp2)
    {
        var comm1 = comp1;
        var comm2 = comp2;

        if (!comm1 || !comm2)
            return null;

        while (comm2 && !comm2._contains(comm1))
        {
            comm2 = comm2.parent;
        }
        return comm2;
    };

    __pWindow._findCommonParentElement = function (elem1, elem2)
    {
        var comm1 = elem1;
        var comm2 = elem2;

        if (!comm1 || !comm2)
            return null;

        while (comm2 && !comm2._contains(comm1))
        {
            comm2 = comm2.parent_elem;
        }
        return comm2;
    };

    __pWindow._findRootElement = function ()
    {
        if (this.root)
            return this.root._control_element;
        return null;
    };

    __pWindow._findPopupElement = function (elem)
    {
        var popup = elem;

        while (popup && !popup._is_popup)
        {
            popup = popup.parent_elem;
        }
        if (popup)
            return popup.linkedcontrol.parent._control_element;
        return popup;
    };

    __pWindow._flashWindow = function (type, count, interval)
    {
        return nexacro._flashWindow(this.handle, type, count, interval);
    };



    __pWindow._closeChildWindows = function (is_close_all)
    {
        let child, child_len, i;
        if (is_close_all)
        {
            const popupframes = nexacro.getPopupFrames();
            if (popupframes)
            {
                child_len = popupframes.length;
                for (i = child_len - 1; i >= 0; i--)
                {
                    child = popupframes[i]._window;
                    if (child && child.root && child.root._is_alive)
                    {
                        child._ignore_close_confirm = true;
                        child.root._destroy();
                    }
                }
            }
        }
        else
        {
            // destroy My Child window..
            child_len = this._child_list.length;
            for (i = child_len - 1; i >= 0; i--)
            {
                child = this._child_list[i];
                if (!child || child.parent != this) // possible?
                    continue;

                if (child.root && child.root._is_alive)
                {
                    child._ignore_close_confirm = true;
                    child.root._destroy();
                }
            }
        }
    };

    __pWindow._setTitleText = function (titletext)
    {
        if (this.handle)
        {
            return nexacro._setWindowHandleText(this.handle, titletext);
        }
    };

    __pWindow._setStatusText = function (statustext)
    {
        if (this.handle)
        {
            return nexacro._setWindowHandleStatusText(this.handle, statustext);
        }
    };

    __pWindow._resetScroll = function (accessibilityFocusId)
    {


        const app = this.getRootInstance()
        if (app)
        {
            const form = app.getActiveForm();

            if (form)
            {
                let focus_comp;
                if (accessibilityFocusId == undefined)
                {
                    focus_comp = form.getFocus();
                }
                else
                {
                    if (nexacro._OS == "OSX" && nexacro._Browser == "Runtime") 
                    {
                        focus_comp = this.findComponent(accessibilityFocusId);
                        if (focus_comp._is_subcontrol)
                            focus_comp = focus_comp.parent;
                    }
                    else
                    {
                        const _window = form._getWindow();
                        focus_comp = _window._accessibility_last_focused_comp;
                    }
                }

                if (focus_comp)
                {
                    focus_comp._resetScrollPos(
                        focus_comp,
                        focus_comp._adjust_left,
                        focus_comp._adjust_top,
                        focus_comp._adjust_left + focus_comp._adjust_width,
                        focus_comp._adjust_top + focus_comp._adjust_height
                    );

                    if (focus_comp._env._p_enableaccessibility)
                    {
                        if (focus_comp._env._a11ytype == 5)
                            focus_comp._setAccessibilityNotifyEvent();
                    }
                }
            }
        }
    };

    __pWindow._setCaptureLock = function (comp, capture_mouse, capture_key)
    {
        var ar = this._capture_complist;
        if (ar.length > 0)
        {
            var last_capture_info = ar[ar.length - 1];

            // WaitCursor가 나와있는데 Popup이 뜨는 경우
            if (last_capture_info[0] instanceof nexacro._WaitControl)
            {
                // insert
                ar.length = ar.length + 1;
                ar[ar.length - 1] = ar[ar.length - 2];
                ar[ar.length - 2] = [comp, capture_mouse, capture_key];
                return;
            }
        }

        ar.push([comp, capture_mouse, capture_key]);
    };

    __pWindow._releaseCaptureLock = function (comp)
    {
        var ar = this._capture_complist;
        var len = ar.length;
        for (var i = len - 1; i >= 0; i--)
        {
            if (ar[i][0] == comp)
            {
                ar[i][0] = null;
                // pop
                ar.splice(i, 1);
                break;
            }
        }
    };

    __pWindow._getCaptureComp = function (capture_mouse, capture_key, event_target_comp)
    {
        var ar = this._capture_complist;
        var len = ar.length;
        var comp;
        for (var i = len - 1; i >= 0; i--)
        {
            var info = ar[i];
            if (capture_mouse === true && info[1] === true)
            {
                comp = info[0];
                break;
            }
            if (capture_key === true && info[2] === true)
            {
                comp = info[0];
                break;
            }
        }

        if (comp)
        {
            // 이벤트 대상이 캡쳐 컴포넌트의 child인 경우, 그냥 이벤트 대상을 리턴. 직접 처리
            if (comp._contains(event_target_comp))
                return event_target_comp;
            return comp;
        }

        return null;
    };

    __pWindow._isContainsComp = function (capture_mouse, capture_key, event_target_comp)
    {
        var ar = this._capture_complist;
        var len = ar.length;

        for (var i = len - 1; i >= 0; i--)
        {
            var info = ar[i];
            if ((capture_mouse === info[1]) && (capture_key === info[2]) && (event_target_comp == info[0]))
            {
                return true;
            }
        }

        return false;
    };

    __pWindow._getLastModalFrame = function ()
    {
        if (this._modal_frame_stack.length > 0)
        {
            var modal_info = this._modal_frame_stack[this._modal_frame_stack.length - 1];
            return modal_info[0];
        }

        return null;
    };

    __pWindow._getComponentLayerInfo = function (comp)
    {
        var form = comp ? comp._refform : null;
        var frame = form ? form.getOwnerFrame() : null;
        if (!frame)
            return null;

        frame = frame._getRootLayerFrame();
        var is_modal = (frame._window_type == 1 || frame._window_type == 4);

        var layer_info = {};
        layer_info.frame = frame;
        layer_info.is_modal = is_modal;
        layer_info.popup_zindex = nexacro._zindex_popup;

        var win = this;
        if (win._getRootWindow)
            win = win._getRootWindow();

        var modal_frame_stack = win._modal_frame_stack;
        layer_info.ref_first_modal_frame = (modal_frame_stack.length > 0) ? modal_frame_stack[0][0] : null;
        if (is_modal)
        {
            for (var i = 0; i < modal_frame_stack.length; i++)
            {
                if (modal_frame_stack[i][0] == frame)
                {
                    layer_info.popup_zindex = modal_frame_stack[i][1];
                    break;
                }
            }
        }

        return layer_info;
    };

    // 활성화된 Layer에 속한 컴포넌트인지 판단한다.
    __pWindow._isActiveLayerComponent = function (comp)
    {
        var form = comp ? comp._refform : null;
        var frame = form ? form.getOwnerFrame() : null;
        if (!frame)
            return false;

        var win = this;
        if (win._getRootWindow)
            win = win._getRootWindow();

        frame = frame._getRootLayerFrame();
        //  var is_modal = (frame._window_type == 1 || frame._window_type == 4);

        // modal이 없다고 판단.
        var modal_frame_stack = win._modal_frame_stack;
        if (modal_frame_stack.length === 0)
            return true;

        // modal이 있으면
        if (frame == win._getLastModalFrame())
            return true;

        return false;
    };

    __pWindow._getPopupFrames = function ()
    {
        return nexacro._getPopupFrames(this);
    };



    //------------------------------------------------------------------------------
    // for Event Handlers
    nexacro._use_offset = 1;
    __pWindow._lbuttondown_wx = 0;
    __pWindow._lbuttondown_wy = 0;
    __pWindow._click_cancel = false;
    __pWindow._keydown_element = null;
    __pWindow._keydown_element_list = new nexacro.Collection();
    __pWindow._is_hotkey = false;





    __pWindow._on_default_sys_popstate = function (state)
    {
        const env = nexacro.getEnvironment();
        env._firePopStateEvent(state);
    };

    __pWindow._on_default_sys_message = function (id)
    {
        if (typeof (id) != "string")
            return;

        var e, data;
        var id_arr = id.split("--boundary--");
        if (id_arr.length > 1)
        {
            // cors message
            data = this._postmsg_data_que.shift();
            if (data)
            {
                e = { id: data.id, message: id_arr[1], data: data.userdata };

                data.func.call(data.target, e);
            }
        }
        else
        {
            // standard message
            data = this._postmsg_data_que.shift();
            if (data)
            {
                e = { id: data.id, data: data.userdata };

                data.func.call(data.target, e);
            }
        }
    };

    __pWindow._on_default_sys_lbuttondown = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, metaKey)
    {
        //nexacro._gap_client_height = screenY - (windowY * nexacro._getDevicePixelRatio(elem));
        //nexacro._gap_client_width = screenX - (windowX * nexacro._getDevicePixelRatio(elem));


        var is_runbase = nexacro._isRunBaseWindow(this);

        this._lbuttondown_wx = windowX;
        this._lbuttondown_wy = windowY;
        this._cur_ldown_elem = elem; //save elem at lbuttondown.

        var ret, is_capture, popup_len;
        var comp = this.findComponent(elem);
        if (elem && elem._is_track)
        {
            popup_len = nexacro._current_popups.length;
            if (popup_len > 0)
            {
                is_capture = nexacro._current_popups[0]._track_capture;
                nexacro._checkClosePopupComponent(comp, false);

                if (!is_capture)
                {
                    this._click_cancel = false;
                }
                else
                {
                    if (popup_len != nexacro._current_popups.length)
                    {
                        this._click_cancel = true;
                        return false;
                    }
                }
            }
            else
            {
                this._click_cancel = false;
            }

            nexacro._setTrackInfo(this, elem, windowX, windowY, screenX, screenY);
        }
        else
        {
            if (comp)
            {
                popup_len = nexacro._current_popups.length;
                if (popup_len > 0)
                {
                    is_capture = nexacro._current_popups[0]._track_capture;
                    nexacro._checkClosePopupComponent(comp, true);

                    if (!is_capture)
                    {
                        this._click_cancel = false;
                    }
                    else
                    {
                        if (popup_len != nexacro._current_popups.length)
                        {
                            this._click_cancel = true;
                            return false;
                        }
                    }
                }
                else
                {
                    this._click_cancel = false;
                }

                var _win = comp._getWindow();
                _win._curWindowX = windowX; //save x at lbuttondown for track
                _win._curWindowY = windowY; //save x at lbuttondown for track
                _win._testX = screenX; //save x at lbuttondown for track
                _win._testY = screenY; //save x at lbuttondown for track

                var elem_pos, canvasX, canvasY;
                if (comp._control_element == elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
                {
                    canvasX = offsetX;
                    canvasY = offsetY;
                }
                else
                {
                    // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                    elem_pos = nexacro._getElementXYInWindow(comp._control_element.handle);
                    canvasX = windowX - elem_pos[0];
                    canvasY = windowY - elem_pos[1];
                }

                var capture_comp = this._getCaptureComp(true, false, comp);
                var firecur_comp = capture_comp ? capture_comp : comp;

                ret = firecur_comp._on_lbuttondown(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
            }
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);

        return ret;
    };

    __pWindow._on_touch_to_lbuttondown = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, metaKey)
    {
        //nexacro._gap_client_height = screenY - (windowY * nexacro._getDevicePixelRatio(elem));
        //nexacro._gap_client_width = screenX - (windowX * nexacro._getDevicePixelRatio(elem));


        var is_runbase = nexacro._isRunBaseWindow(this);

        this._lbuttondown_wx = windowX;
        this._lbuttondown_wy = windowY;
        this._cur_ldown_elem = elem; //save elem at lbuttondown.

        var is_capture, popup_len;
        var comp = this.findComponent(elem);
        if (elem && elem._is_track)
        {
            popup_len = nexacro._current_popups.length;
            if (popup_len > 0)
            {
                is_capture = nexacro._current_popups[0]._track_capture;
                nexacro._checkClosePopupComponent(comp, false);

                if (!is_capture)
                {
                    this._click_cancel = false;
                }
                else
                {
                    if (popup_len != nexacro._current_popups.length)
                    {
                        this._click_cancel = true;
                        return false;
                    }
                }
            }
            else
            {
                this._click_cancel = false;
            }

            nexacro._setTrackInfo(this, elem, windowX, windowY);
        }
        else
        {
            if (comp)
            {
                popup_len = nexacro._current_popups.length;
                if (popup_len > 0)
                {
                    is_capture = nexacro._current_popups[0]._track_capture;
                    nexacro._checkClosePopupComponent(comp, true);

                    if (!is_capture)
                    {
                        this._click_cancel = false;
                    }
                    else
                    {
                        if (popup_len != nexacro._current_popups.length)
                        {
                            this._click_cancel = true;
                            return false;
                        }
                    }
                }
                else
                {
                    this._click_cancel = false;
                }

                var _win = comp._getWindow();
                _win._curWindowX = windowX; //save x at lbuttondown for track
                _win._curWindowY = windowY; //save x at lbuttondown for track

                var elem_pos, canvasX, canvasY;
                if (comp._control_element == elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
                {
                    canvasX = offsetX;
                    canvasY = offsetY;
                }
                else
                {
                    // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                    elem_pos = nexacro._getElementXYInWindow(comp._control_element.handle);
                    canvasX = windowX - elem_pos[0];
                    canvasY = windowY - elem_pos[1];
                }

                var capture_comp = this._getCaptureComp(true, false, comp);
                var firecur_comp = capture_comp ? capture_comp : comp;

                firecur_comp._on_touch_lbuttondown(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);

                return { cp: comp, cX: canvasX, cY: canvasY };
            }
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);
    };

    __pWindow._on_lbuttondown = function (/*elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_rbuttondown = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, metaKey)
    {
        //nexacro._gap_client_height = screenY - (windowY * nexacro._getDevicePixelRatio(elem));
        //nexacro._gap_client_width = screenX - (windowX * nexacro._getDevicePixelRatio(elem));


        var is_runbase = nexacro._isRunBaseWindow(this);

        this._cur_rdown_elem = elem; //save elem at lbuttondown.

        var ret;
        var comp = this.findComponent(elem);
        if (comp)
        {
            var popup_len = nexacro._current_popups.length;
            if (popup_len > 0)
            {
                var is_capture = nexacro._current_popups[0]._track_capture;
                nexacro._checkClosePopupComponent(comp);

                if (!is_capture)
                {
                    this._click_cancel = false;
                }
                else
                {
                    if (popup_len != nexacro._current_popups.length)
                    {
                        this._click_cancel = true;
                        return false;
                    }
                }
            }
            else
            {
                this._click_cancel = false;
            }

            var elem_pos, canvasX, canvasY;
            if (comp._control_element == elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
            {
                canvasX = offsetX;
                canvasY = offsetY;
            }
            else
            {
                // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                elem_pos = nexacro._getElementXYInWindow(comp._control_element.handle);
                canvasX = windowX - elem_pos[0];
                canvasY = windowY - elem_pos[1];
            }

            var capture_comp = this._getCaptureComp(true, false, comp);
            var firecur_comp = capture_comp ? capture_comp : comp;

            ret = firecur_comp._on_rbuttondown(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);

        return ret;
    };

    __pWindow._on_rbuttondown = function (/*elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_lbuttonup = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, metaKey)
    {
        if (this._click_cancel)
        {
            this._click_cancel = false;
            return;
        }

        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);
        var dragInfo = nexacro._cur_drag_info;
        var repeatInfo = nexacro._cur_repeat_info;
        var trackInfo = nexacro._cur_track_info;
        var extratrackInfo = nexacro._cur_extra_track_info;
        var comp, elem_pos, canvasX, canvasY;
        var _is_drag = false, _is_track = false;

        if (elem && dragInfo && dragInfo.isDragging && dragInfo.targetwin == this)
        {
            comp = this.findComponent(elem);
            var ischild = false;
            if (dragInfo.target && dragInfo.target._contains)
                ischild = dragInfo.target._contains(comp);
            if ((comp && !dragInfo.isSelfAction) || comp && (ischild && dragInfo.isSelfAction))
            {
                if (nexacro._use_offset && offsetX != undefined && offsetY != undefined)
                {
                    canvasX = offsetX;
                    canvasY = offsetY;
                }
                else
                {
                    // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                    elem_pos = nexacro._getElementXYInWindow(elem.handle);
                    canvasX = windowX - elem_pos[0];
                    canvasY = windowY - elem_pos[1];
                }

                comp._on_drop(elem, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
                _is_drag = true;
            }
        }

        if (repeatInfo && repeatInfo.targetwin == this)
        {
            if (repeatInfo._timer)
            {
                var handle = nexacro._getWindowHandle(this.handle);
                nexacro._clearSystemTimer(handle, repeatInfo._timer);
            }
            repeatInfo.distX = windowX - repeatInfo.startX;
            repeatInfo.distY = windowY - repeatInfo.startY;
            repeatInfo.target._on_endrepeat(repeatInfo.refer_comp, repeatInfo.distX, repeatInfo.distY, repeatInfo.data);
            nexacro._cur_repeat_info = null;
        }

        if (trackInfo && trackInfo.targetwin == this)
        {
            trackInfo.distX = windowX - trackInfo.startX;
            trackInfo.distY = windowY - trackInfo.startY;
            trackInfo.target._on_endtrack(trackInfo.distX, trackInfo.distY, trackInfo.data);
            nexacro._cur_track_info = null;

            if (!this._is_track)
            {
                var moving_threshold = 6;
                if (Math.abs(trackInfo.distX) >= moving_threshold || Math.abs(trackInfo.distY) >= moving_threshold)
                    _is_track = true;
            }
            else
            {
                _is_track = true;
            }
        }

        if (extratrackInfo)
        {
            extratrackInfo.distX = windowX - extratrackInfo.startX;
            extratrackInfo.distY = windowY - extratrackInfo.startY;

            if (extratrackInfo.target._is_alive)
                extratrackInfo.target._on_end_extratrack(extratrackInfo.distX, extratrackInfo.distY, extratrackInfo.data);

            nexacro._cur_extra_track_info = null;
        }

        var upelem = elem;
        elem = this._cur_ldown_elem;
        comp = this.findComponent(elem);
        if (comp)
        {
            if (comp._control_element == upelem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
            {
                canvasX = offsetX;
                canvasY = offsetY;
            }
            else
            {
                // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                elem_pos = nexacro._getElementXYInWindow(comp._control_element.handle);
                canvasX = windowX - elem_pos[0];
                canvasY = windowY - elem_pos[1];
            }

            var capture_comp = this._getCaptureComp(true, false, comp);
            var firecur_comp = capture_comp ? capture_comp : comp;
            var firecur_rootcomp = firecur_comp._getRootComponent(firecur_comp);

            // Logical onclick Event 
            // defaultprevented 처리 하면 default action인 click을 제어한다.
            var checkup_comp = firecur_comp;
            if (checkup_comp._is_subcontrol)
            {
                checkup_comp = checkup_comp._getFromComponent(checkup_comp);
            }

            ret = firecur_comp._on_lbuttonup(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, upelem, metaKey);

            if (!checkup_comp.onlbuttonup || (checkup_comp.onlbuttonup && !checkup_comp.onlbuttonup.defaultprevented))
            {
                var downcomp = firecur_comp;
                var upcomp = this.findComponent(upelem);
                // pseudo 변경 시 IE에서 stretch , quad에 따라서 destroy 후 create 하는 경우 mouseout event 발생. 
                // 이로 인해 up되는 시점에 upelem을 정상적으로 전달 못하고 mainframe을 넘기는 경우 발생. 예외 처리 
                if (upcomp && upcomp._isMainFrameBody() && downcomp != upcomp)
                {
                    upcomp = firecur_comp;
                }
                //track 으로 처리되는 경우에는 click 발생안함 
                if (upcomp && downcomp == upcomp)
                {
                    if (!_is_track || (upcomp != trackInfo.target))
                    {
                        if (upcomp._control_element == upelem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
                        {
                            canvasX = offsetX;
                            canvasY = offsetY;
                        }
                        else
                        {
                            // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                            elem_pos = nexacro._getElementXYInWindow(upcomp._control_element.handle);
                            canvasX = windowX - elem_pos[0];
                            canvasY = windowY - elem_pos[1];
                        }

                        var _is_text/*, _is_select*/, _is_click, _is_input;
                        _is_text = elem.getElementValue && !elem.getElementValue();

                        var moving_threshold = 6;
                        var diff_x = this._lbuttondown_wx - windowX;
                        var diff_y = this._lbuttondown_wy - windowY;
                        _is_click = (diff_x < 0 ? -diff_x : diff_x) < moving_threshold && (diff_y < 0 ? -diff_y : diff_y) < moving_threshold;
                        _is_input = elem.isInputElement();
                        if (!_is_input || _is_click || _is_drag || _is_text)
                        {
                            upcomp._on_click(upelem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
                        }
                    }
                }
            }

            if (firecur_comp._is_alive)
                firecur_comp._on_last_lbuttonup();
            else if (firecur_comp._is_subcontrol && firecur_rootcomp)
                firecur_rootcomp._on_last_lbuttonup();
        }

        nexacro._initDragInfo();

        this._cur_ldown_elem = null; //clear elem at lbuttondown.
        this._lbuttondown_wx = null;
        this._lbuttondown_wy = null;
        this._curWindowX = null;
        this._curWindowY = null;

        if (is_runbase) nexacro._setRunBaseWindow(null);

        return ret;
    };

    __pWindow._on_click = function (/*elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_rbuttonup = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, metaKey)
    {
        if (this._click_cancel)
        {
            this._click_cancel = false;
            return;
        }

        var is_runbase = nexacro._isRunBaseWindow(this);
        var comp = this.findComponent(elem);
        if (comp)
        {
            var elem_pos, canvasX, canvasY;
            if (comp._control_element == elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
            {
                canvasX = offsetX;
                canvasY = offsetY;
            }
            else
            {
                // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                elem_pos = nexacro._getElementXYInWindow(comp._control_element.handle);
                canvasX = windowX - elem_pos[0];
                canvasY = windowY - elem_pos[1];
            }

            var capture_comp = this._getCaptureComp(true, false, comp);
            var firecur_comp = capture_comp ? capture_comp : comp;

            firecur_comp._on_rbuttonup(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, elem, metaKey);
        }

        this._cur_rdown_elem = null;

        if (is_runbase) nexacro._setRunBaseWindow(null);
    };

    __pWindow._on_rbuttonup = function (/*elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_mouseup = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, metaKey)
    {
        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);
        var comp = this.findComponent(elem);
        if (comp)
        {
            var elem_pos, canvasX, canvasY;
            if (comp._control_element == elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
            {
                canvasX = offsetX;
                canvasY = offsetY;
            }
            else
            {
                // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                elem_pos = nexacro._getElementXYInWindow(comp._control_element.handle);
                canvasX = windowX - elem_pos[0];
                canvasY = windowY - elem_pos[1];
            }

            var capture_comp = this._getCaptureComp(true, false, comp);
            var firecur_comp = capture_comp ? capture_comp : comp;

            ret = firecur_comp._on_mouseup(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, elem, metaKey);
        }
        this._cur_mdown_elem = null;

        if (is_runbase) nexacro._setRunBaseWindow(null);

        return ret;
    };

    __pWindow._on_default_sys_mousedown = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, metaKey)
    {
        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);
        this._cur_mdown_elem = elem; //save elem at lbuttondown.

        var comp = this.findComponent(elem);
        if (comp)
        {
            var elem_pos, canvasX, canvasY;
            if (comp._control_element == elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
            {
                canvasX = offsetX;
                canvasY = offsetY;
            }
            else
            {
                // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                elem_pos = nexacro._getElementXYInWindow(comp._control_element.handle);
                canvasX = windowX - elem_pos[0];
                canvasY = windowY - elem_pos[1];
            }

            var capture_comp = this._getCaptureComp(true, false, comp);
            var firecur_comp = capture_comp ? capture_comp : comp;

            ret = firecur_comp._on_mousedown(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);

        return ret;
    };

    __pWindow._on_default_sys_mousemove = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, metaKey)
    {
        //nexacro._gap_client_height = screenY - (windowY * nexacro._getDevicePixelRatio(elem));
        //nexacro._gap_client_width = screenX - (windowX * nexacro._getDevicePixelRatio(elem));


        var ret, track_comp, extratrack_comp;
        var dragInfo = nexacro._cur_drag_info;
        var repeatInfo = nexacro._cur_repeat_info;
        var trackInfo = nexacro._cur_track_info;
        var extratrackInfo = nexacro._cur_extra_track_info;
        var comp, evt_elem = elem;
        var elem_pos, canvasX, canvasY;
        var useelemhandle = true;

        if (dragInfo && dragInfo.targetwin == this)
        {
            var xdeltavalue = windowX - dragInfo.startX;
            var ydeltavalue = windowY - dragInfo.startY;
            if (!dragInfo.isDragging)
            {
                if (windowX != dragInfo.startX || windowY != dragInfo.startY)
                {
                    elem = dragInfo.target_elem;
                    comp = this.findComponent(elem);

                    if (!elem.handle)
                    {
                        canvasX = windowX;
                        canvasY = windowY;
                        useelemhandle = false;
                    }


                    if (comp)
                    {
                        if (useelemhandle)
                        {
                            if (comp._control_element == evt_elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
                            {
                                canvasX = offsetX;
                                canvasY = offsetY;
                            }
                            else
                            {
                                // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                                elem_pos = nexacro._getElementXYInWindow(comp._control_element.handle);
                                canvasX = windowX - elem_pos[0];
                                canvasY = windowY - elem_pos[1];
                            }
                        }
                        ret = comp._on_drag(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
                        if (ret && ret[0] === true && nexacro._cur_drag_info)
                        {
                            dragInfo.isDragging = ret[0];
                            dragInfo.target = ret[1];
                            dragInfo.referTarget = ret[2];
                            dragInfo.data = ret[3];
                            dragInfo.userdata = ret[4];
                            if (trackInfo && trackInfo.targetwin == this && trackInfo.target && trackInfo.target._is_tracking == true)
                            {
                                if (trackInfo.target._getRootComponent)
                                    track_comp = trackInfo.target._getRootComponent(trackInfo.target);
                                else
                                    track_comp = comp;

                                if (track_comp._isRtl())
                                {
                                    trackInfo.distX = trackInfo.startX - windowX;
                                    trackInfo.distY = windowY - trackInfo.startY;
                                }
                                else
                                {
                                    trackInfo.distX = windowX - trackInfo.startX;
                                    trackInfo.distY = windowY - trackInfo.startY;
                                }

                            }
                            comp._on_dragmove(elem, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, xdeltavalue, ydeltavalue, metaKey);
                            var c = comp;
                            var is_scroll = false;

                            while (c)
                            {
                                if (c instanceof nexacro.ScrollBarControl)
                                {
                                    is_scroll = true;
                                    break;
                                }
                                c = c.parent;
                            }

                            if (!is_scroll)
                                return;
                        }
                    }
                    nexacro._initDragInfo();
                }
            }
            else // (!dragInfo.isDragging)
            {
                comp = this.findComponent(elem);
                var ischild = false;
                if (dragInfo.target && dragInfo.target._contains)
                    ischild = dragInfo.target._contains(comp);
                if ((comp && !dragInfo.isSelfAction) || comp && (ischild && dragInfo.isSelfAction))
                {
                    if (comp._control_element == evt_elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
                    {
                        canvasX = offsetX;
                        canvasY = offsetY;
                    }
                    else
                    {
                        // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                        elem_pos = nexacro._getElementXYInWindow(comp._control_element.handle);
                        canvasX = windowX - elem_pos[0];
                        canvasY = windowY - elem_pos[1];
                    }
                    if (trackInfo && trackInfo.targetwin == this && trackInfo.target && trackInfo.target._is_tracking == true)
                    {
                        if (trackInfo.target._getRootComponent)
                            track_comp = trackInfo.target._getRootComponent(trackInfo.target);
                        else
                            track_comp = comp;

                        if (track_comp._isRtl())
                        {
                            trackInfo.distX = trackInfo.startX - windowX;
                            trackInfo.distY = windowY - trackInfo.startY;
                        }
                        else
                        {
                            trackInfo.distX = windowX - trackInfo.startX;
                            trackInfo.distY = windowY - trackInfo.startY;
                        }

                    }
                    comp._on_dragmove(elem, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, xdeltavalue, ydeltavalue, metaKey);
                }
            }
            return;
        }

        if (repeatInfo && repeatInfo.targetwin == this)
        {
            repeatInfo.distX = windowX - repeatInfo.startX;
            repeatInfo.distY = windowY - repeatInfo.startY;
            repeatInfo.canvasX = repeatInfo.startCanvasX + repeatInfo.distX;
            repeatInfo.canvasY = repeatInfo.startCanvasY + repeatInfo.distY;
        }

        comp = this.findComponent(elem);

        if (trackInfo && trackInfo.targetwin == this)
        {
            if (trackInfo.target && trackInfo.target._getRootComponent)
                track_comp = trackInfo.target._getRootComponent(trackInfo.target);
            else
                track_comp = comp;

            if (track_comp && track_comp._isRtl())
            {
                trackInfo.distX = trackInfo.startX - windowX;
                trackInfo.distY = windowY - trackInfo.startY;
            }
            else
            {
                var target = trackInfo.target;
                if (nexacro._macOSWebView && target instanceof nexacro.TitleBarControl && target.parent._window_type != 1)
                {
                    trackInfo.distX = screenX - trackInfo.screenX;
                    trackInfo.distY = screenY - trackInfo.screenY;
                }
                else
                {
                    trackInfo.distX = windowX - trackInfo.startX;
                    trackInfo.distY = windowY - trackInfo.startY;
                }
            }

            trackInfo.target._on_movetrack(trackInfo.distX, trackInfo.distY, trackInfo.data, windowX, windowY);
        }

        if (extratrackInfo)
        {
            if (extratrackInfo.target && extratrackInfo.target._getRootComponent)
                extratrack_comp = extratrackInfo.target._getRootComponent(extratrackInfo.target);
            else
                extratrack_comp = comp;

            if (extratrack_comp && extratrack_comp._isRtl())
            {
                extratrackInfo.distX = extratrackInfo.startX - windowX;
                extratrackInfo.distY = windowY - extratrackInfo.startY;
            }
            else
            {
                extratrackInfo.distX = windowX - extratrackInfo.startX;
                extratrackInfo.distY = windowY - extratrackInfo.startY;
            }

            if (extratrackInfo.target._is_alive)
                extratrackInfo.target._on_move_extratrack(comp, windowX, windowY, extratrackInfo.distX, extratrackInfo.distY, screenX, screenY);
        }

        if (comp && comp._is_alive)
        {
            if (comp._control_element == evt_elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
            {
                canvasX = offsetX;
                canvasY = offsetY;
            }
            else
            {
                // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                elem_pos = nexacro._getElementXYInWindow(comp._control_element.handle);
                canvasX = windowX - elem_pos[0];
                canvasY = windowY - elem_pos[1];
            }

            var capture_comp = this._getCaptureComp(true, false, comp);
            var firecur_comp = capture_comp ? capture_comp : comp;

            // for waitcomponent
            var form = firecur_comp.parent;
            while (form)
            {
                if (form._is_form)
                    break;

                form = form._last_focused;
            }
            if (form)
                form._obj_mousemove = firecur_comp;

            ret = firecur_comp._on_mousemove(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);

            if (form)
                form._obj_mousemove = null;
        }
        return ret;
    };

    __pWindow._on_mousemove = function (/*elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_sys_repeat = function ()
    {
        var handle = nexacro._getWindowHandle(this.handle);
        var repeatInfo = nexacro._cur_repeat_info;
        if (repeatInfo && repeatInfo.targetwin == this)
        {
            var refer_comp, comp;
            if (repeatInfo.step == "first")
            {
                if (repeatInfo._timer)
                {
                    nexacro._clearSystemTimer(handle, repeatInfo._timer);
                }
                repeatInfo.step = "";
                refer_comp = repeatInfo.refer_comp;
                comp = repeatInfo.target;
                if (refer_comp === comp || comp._contains(refer_comp))
                {
                    comp._on_repeat(refer_comp, repeatInfo.canvasX, repeatInfo.canvasY, repeatInfo.data);
                }
                repeatInfo._timer = nexacro._setSystemTimer(handle, nexacro._cur_repeat_info._repeatfunc, 75);
            }
            else
            {
                refer_comp = repeatInfo.refer_comp;
                comp = repeatInfo.target;
                if (refer_comp === comp || comp._contains(refer_comp))
                {
                    comp._on_repeat(refer_comp, repeatInfo.canvasX, repeatInfo.canvasY, repeatInfo.data);
                }
            }
        }
    };

    __pWindow._on_default_sys_dblclick = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, metaKey)
    {
        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);
        var firecur_comp = this._findComponentForEvent(elem);
        var capture_comp = this._getCaptureComp(true, false, firecur_comp);

        if (firecur_comp && (strButton == "lbutton" || strButton == "none"))
        {
            var elem_pos, canvasX, canvasY;
            if (firecur_comp._control_element == elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
            {
                canvasX = offsetX;
                canvasY = offsetY;
            }
            else
            {
                // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                elem_pos = nexacro._getElementXYInWindow(firecur_comp._control_element.handle);
                canvasX = windowX - elem_pos[0];
                canvasY = windowY - elem_pos[1];
            }

            if (capture_comp)
                ret = capture_comp._on_dblclick(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
            else
                ret = firecur_comp._on_dblclick(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);
        return ret;
    };

    __pWindow._on_dblclick = function (/*elem, strButton, altKey, ctrlKey, shiftKey, screenX, windowX, windowY, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_mouseenter = function (elem, from_elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, metaKey)
    {
        var ret;
        var dragInfo = nexacro._cur_drag_info;
        var comp, from_comp;

        comp = this.findComponent(elem);
        from_comp = this.findComponent(from_elem);

        if (comp && comp != from_comp)
        {
            /* mouse leave와 동작 맞춤 */
            //var capture_comp = this._getCaptureComp(true, false, comp);
            //var firecur_comp = capture_comp ? capture_comp : comp;
            var firecur_comp = comp;
            var canvasX = 0;
            var canvasY = 0;
            var elem_pos;

            var cur_elem = firecur_comp._control_element;
            if (cur_elem && cur_elem.handle)
            {
                if (cur_elem == elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
                {
                    canvasX = offsetX;
                    canvasY = offsetY;
                }
                else
                {
                    // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                    elem_pos = nexacro._getElementXYInWindow(cur_elem.handle);
                    canvasX = windowX - elem_pos[0];
                    canvasY = windowY - elem_pos[1];
                }
                var isdragaction = true;
                var ischild = false;
                if (dragInfo && dragInfo.isDragging)
                {
                    if (dragInfo.target && dragInfo.target._contains)
                        ischild = dragInfo.target._contains(firecur_comp);
                    isdragaction = ((!dragInfo.isSelfAction) || (ischild && dragInfo.isSelfAction));
                }

                if (dragInfo && dragInfo.isDragging && dragInfo.targetwin == this && isdragaction)
                    ret = firecur_comp._on_dragenter(elem, from_comp, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
                else
                    ret = firecur_comp._on_mouseenter(elem, from_comp, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
            }
        }
        return ret;
    };

    __pWindow._on_mouseenter = function (/*elem, from_elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_mouseleave = function (elem, to_elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, metaKey)
    {
        var ret;
        var dragInfo = nexacro._cur_drag_info;
        var comp, to_comp;

        comp = this.findComponent(elem);
        to_comp = this.findComponent(to_elem);

        if (comp && comp != to_comp)
        {
            //var capture_comp = this._getCaptureComp(true, false, comp);
            var firecur_comp = comp;
            // var firecur_comp = capture_comp ? capture_comp : comp;
            var canvasX = 0;
            var canvasY = 0;
            var elem_pos;

            var cur_elem = firecur_comp._control_element;
            if (cur_elem && cur_elem.handle)
            {
                if (cur_elem == elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
                {
                    canvasX = offsetX;
                    canvasY = offsetY;
                }
                else
                {
                    // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                    elem_pos = nexacro._getElementXYInWindow(cur_elem.handle);
                    canvasX = windowX - elem_pos[0];
                    canvasY = windowY - elem_pos[1];
                }
                var isdragaction = true;
                var ischild = false;
                if (dragInfo && dragInfo.isDragging)
                {
                    if (dragInfo.target && dragInfo.target._contains)
                        ischild = dragInfo.target._contains(firecur_comp);
                    isdragaction = ((!dragInfo.isSelfAction) || (ischild && dragInfo.isSelfAction));
                }
                if (dragInfo && dragInfo.isDragging && dragInfo.targetwin == this && isdragaction)
                    ret = firecur_comp._on_dragleave(elem, to_comp, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
                else
                    ret = firecur_comp._on_mouseleave(elem, to_comp, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
            }
        }
        return ret;
    };

    __pWindow._on_mouseleave = function (/*elem, toelem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_mousewheel = function (elem, wheelDeltaX, wheelDeltaY, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, metaKey)
    {
        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);
        var firecur_comp = this._findComponentForEvent(elem);
        var capture_comp = this._getCaptureComp(true, false, firecur_comp);

        if (firecur_comp)
        {
            var elem_pos, canvasX, canvasY;
            if (firecur_comp._control_element == elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
            {
                canvasX = offsetX;
                canvasY = offsetY;
            }
            else
            {
                // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                elem_pos = nexacro._getElementXYInWindow(firecur_comp._control_element.handle);
                canvasX = windowX - elem_pos[0];
                canvasY = windowY - elem_pos[1];
            }

            if (capture_comp)
                ret = capture_comp._on_mousewheel(elem, wheelDeltaX, wheelDeltaY, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
            else
                ret = firecur_comp._on_mousewheel(elem, wheelDeltaX, wheelDeltaY, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);
        return ret;
    };


    __pWindow._on_mousewheel = function (/*elem, wheelDeltaX, wheelDeltaY, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_dragenter = function (elem, fromElem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, filelist, metaKey)
    {
        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);

        if (elem)
        {
            var comp = this.findComponent(elem);
            var from_comp = this.findComponent(fromElem);
            if (comp && comp != from_comp)
            {
                var _win = comp._getWindow();

                var elem_pos, canvasX, canvasY;
                if (comp._control_element == elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
                {
                    canvasX = offsetX;
                    canvasY = offsetY;
                }
                else
                {
                    elem_pos = nexacro._getElementXYInWindow(comp._control_element.handle);
                    canvasX = windowX - elem_pos[0];
                    canvasY = windowY - elem_pos[1];
                }

                if (comp._isRtl())
                {
                    canvasX = elem.width - canvasX;
                }

                var dragInfo = nexacro._cur_drag_info;
                if (dragInfo && dragInfo.isDragging && dragInfo.targetwin == this)
                {
                    dragInfo.isDragover = false;

                    if (!dragInfo.filelist)
                        dragInfo.filelist = nexacro._convertVirtualFileList(filelist);

                    ret = comp._on_dragenter(elem, from_comp, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
                }
                else
                {
                    nexacro._setDragInfo(_win, elem, windowX, windowY, windowX, windowY, null, null, nexacro._convertVirtualFileList(filelist), "file");

                    dragInfo = nexacro._cur_drag_info;
                    dragInfo.isDragging = true;

                    if (nexacro._Browser == "Runtime")
                    {
                        // 기존 runtime drag&drop 기능구현 내용유지 용도. ( Dprecated )
                        var dragdata = new nexacro.DragDataObject;
                        dragdata.setData("filedrop", filelist);
                        dragInfo.data = dragdata;
                    }

                    ret = comp._on_dragenter(elem, from_comp, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
                }
            }
        }

        if (is_runbase) nexacro._setRunBaseWindow(null);
        return ret;
    };

    __pWindow._on_dragenter = function ()
    {
        return true;
    };

    __pWindow._on_default_sys_dragleave = function (elem, toElem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, filelist, metaKey)
    {
        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);

        if (elem)
        {
            var comp = this.findComponent(elem);
            var to_comp = this.findComponent(toElem);
            var dragInfo = nexacro._cur_drag_info;

            if (comp && comp != to_comp && (dragInfo && dragInfo.targetwin == this))
            {
                dragInfo.isDragover = false;

                var cur_elem = comp._control_element;
                if (cur_elem && cur_elem.handle)
                {
                    var elem_pos, canvasX, canvasY;
                    if (cur_elem == elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
                    {
                        canvasX = offsetX;
                        canvasY = offsetY;
                    }
                    else
                    {
                        elem_pos = nexacro._getElementXYInWindow(cur_elem.handle);
                        canvasX = windowX - elem_pos[0];
                        canvasY = windowY - elem_pos[1];
                    }

                    if (dragInfo.filelist)
                    {
                        for (var i = 0; i < dragInfo.filelist.length; i++)
                        {
                            var file = dragInfo.filelist[i];
                            file.close();
                        }
                        dragInfo.filelist = null;
                    }

                    ret = comp._on_dragleave(elem, to_comp, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
                }
            }
        }

        if (is_runbase) nexacro._setRunBaseWindow(null);
        return ret;
    };

    __pWindow._on_dragleave = function ()
    {
        return true;
    };

    __pWindow._on_default_sys_dragover = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, filelist, metaKey)
    {
        var is_runbase = nexacro._isRunBaseWindow(this);

        if (elem)
        {
            var comp = this.findComponent(elem);
            if (comp)
            {
                var dragInfo = nexacro._cur_drag_info;
                if (dragInfo && dragInfo.targetwin == this)
                {
                    dragInfo.isDragover = true;

                    // 좌표 비교후 dragmove
                    var elem_pos, canvasX, canvasY;
                    if (comp._control_element == elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
                    {
                        canvasX = offsetX;
                        canvasY = offsetY;
                    }
                    else
                    {
                        // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                        elem_pos = nexacro._getElementXYInWindow(comp._control_element.handle);
                        canvasX = windowX - elem_pos[0];
                        canvasY = windowY - elem_pos[1];
                    }

                    if (comp._isRtl())
                    {
                        canvasX = elem.width - canvasX;
                    }

                    if (dragInfo.currX != windowX || dragInfo.currY != windowY)
                    {
                        dragInfo.currX = windowX;
                        dragInfo.currY = windowY;

                        if (!dragInfo.filelist)
                            dragInfo.filelist = nexacro._convertVirtualFileList(filelist);

                        comp._on_dragmove(elem, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);
                    }
                }
            }
        }

        if (is_runbase) nexacro._setRunBaseWindow(null);
        return false;
    };

    __pWindow._on_dragmove = function ()
    {
        // dragmove == dragover
        return true;
    };

    __pWindow._on_default_sys_drop = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, filelist, metaKey)
    {
        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);

        if (elem)
        {
            var comp = this.findComponent(elem);
            if (comp)
            {
                var dragInfo = nexacro._cur_drag_info;
                if (dragInfo && dragInfo.targetwin == this)
                {
                    var elem_pos, canvasX, canvasY;
                    if (comp._control_element == elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
                    {
                        canvasX = offsetX;
                        canvasY = offsetY;
                    }
                    else
                    {
                        elem_pos = nexacro._getElementXYInWindow(elem.handle);
                        canvasX = windowX - elem_pos[0];
                        canvasY = windowY - elem_pos[1];
                    }

                    if (!dragInfo.filelist)
                        dragInfo.filelist = nexacro._convertVirtualFileList(filelist);

                    ret = comp._on_drop(elem, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, metaKey);

                    nexacro._initDragInfo();
                }
            }
        }

        if (is_runbase) nexacro._setRunBaseWindow(null);
        return ret;
    };

    __pWindow._on_drop = function ()
    {
        return true;
    };

    __pWindow._on_default_sys_keydown = function (elem, keycode, altKey, ctrlKey, shiftKey, metaKey)
    {
        // TODO tab키처리 등. RT버젼의 Pretranslate처리를 분리해야함.
        //      tab키 이동시에도 컴포넌트 onkeydown을 거친 후 form의 onkeydown에서 처리가 됨.
        //      호출순서가 하->상 인지 상->하 인지 확인 필요.
        //
        //      참고로 Pretranslate는 Keydown만 처리하면 됨. 
        // var ret = this._on_pretranslate_keydown()

        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);

        // 조합키는 체크 제외 (alt, ctrl, shift, meta)
        this._is_fire_sys_keydown = (keycode != nexacro.Event.KEY_ALT && keycode != nexacro.Event.KEY_CTRL && keycode != nexacro.Event.KEY_SHIFT && keycode != nexacro.Event.KEY_META)
        var comp = this.findComponent(elem);

        var capture_comp;
        if (comp) capture_comp = this._getCaptureComp(false, true, comp);

        if (capture_comp && capture_comp != comp)
            comp = capture_comp;

        var env = nexacro.getEnvironment();

        if (nexacro._isPageReloadKey(ctrlKey, keycode))        
        {
            const browserreloadkey = env.browserreloadkey;
            if (browserreloadkey == "custom")
            {
                if (env.on_fire_onpressedreloadkey(keycode, altKey, ctrlKey, shiftKey, comp, comp, metaKey))
                {
                    elem._event_stop = true;
                    return;
                }

            }
            else
            {
                if (browserreloadkey == "reloadactiveform")
                {
                    const app = this.getRootInstance();
                    if (app)
                    {
                        const activeform = app.getActiveForm();
                        if (activeform)
                            activeform.reload();
                    }
                }

                elem._event_stop = true;
                return;
            }
        }

        if (env._processUserHotkey(keycode, altKey, ctrlKey, shiftKey, metaKey))
        {
            elem._event_stop = true;
            return;
        }

        if (env._p_enableaccessibility)
        {
            ret = env.on_fire_onaccessibilitykey(keycode, altKey, ctrlKey, shiftKey, comp, comp);
            if (ret)
            {
                if (is_runbase) nexacro._setRunBaseWindow(null);
                elem._event_stop = true;
                return;
            }
            env._processHotkey(keycode, altKey, ctrlKey, shiftKey, comp);
        }

        if (comp)
        {
            var _form = comp._getForm();
            if (comp._processHotkey(keycode, altKey, ctrlKey, shiftKey))
            {
                var keyinput_elem = elem;
                if (_form)
                {
                    var cur_focus_comp = _form.getFocus();
                    if (cur_focus_comp != comp)
                    {
                        if (cur_focus_comp == null) // ?
                            return;

                        comp = cur_focus_comp;
                        elem = cur_focus_comp._control_element;
                    }
                }
                keyinput_elem._event_stop = true;
                comp._processing_autoskip = true;
                comp._is_hotkey = true;
            }

            if (keycode == nexacro.Event.KEY_TAB)
            {
                // TODO check tabpage가 현재 subcontrol로 분류되어있어 문제가됨.
                if (comp._is_subcontrol)
                {
                    comp = comp._getAllowTabComp(comp);

                    if (comp._is_subcontrol && comp._use_subcontrol_tabkey)
                        _form = comp._getFromComponent(comp);
                }
                if (!comp._getDlgCode(keycode, altKey, ctrlKey, shiftKey).want_tab && _form)
                {
                    comp = _form;
                }
            }
            //for test - If this annotation makes a bug, you should roll back.
            else if ((keycode == nexacro.Event.KEY_UP || keycode == nexacro.Event.KEY_DOWN) && !altKey && !ctrlKey && !shiftKey)
            {
                // 탐색 키(상/하 방향키) 제어를 nexacro가 하는 경우
                if (env._p_enableaccessibility && env._p_accessibilitycontentsearchkey)
                {
                    if (comp._is_subcontrol)
                    {
                        comp = comp._getFromComponent(comp);
                    }
                    if (!comp._getDlgCode(keycode, altKey, ctrlKey, shiftKey).want_arrows && _form)
                    {
                        comp = _form;
                    }
                }
            }

            this._keydown_element = elem;
            this._keydown_element_list.setItem(keycode, this._keydown_element);

            ret = comp._on_keydown(elem, keycode, altKey, ctrlKey, shiftKey, metaKey);
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);
        return ret;
    };

    __pWindow._on_keydown = function (/*elem, keycode, altKey, ctrlKey, shiftKey, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_keypress = function (elem, keycode, charcode, altKey, ctrlKey, shiftKey, metaKey)
    {
        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);
        var comp = this.findComponent(elem);

        var capture_comp = this._getCaptureComp(false, true, comp);
        if (capture_comp && capture_comp != comp)
            comp = capture_comp;

        if (comp)
        {
            ret = comp._on_keypress(elem, keycode, charcode, altKey, ctrlKey, shiftKey, metaKey);
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);
        return ret;
    };

    __pWindow._on_keypress = function (/*elem, keycode, charcode, altKey, ctrlKey, shiftKey*/)
    {
        return true;
    };

    __pWindow._on_default_sys_keyup = function (elem, keycode, altKey, ctrlKey, shiftKey, metaKey)
    {
        var ret;
        var comp = this.findComponent(elem);
        var keydown_elem = this._keydown_element;

        var use_system_key = altKey || ctrlKey || shiftKey || metaKey;
        var is_accept_imeaction = false;
        var is_runbase = nexacro._isRunBaseWindow(this);

        if (comp)
        {
            var root_comp = comp._getFromComponent(comp);

            if (keydown_elem)
            {
                var keydown_elem_comp = null;
                if (keydown_elem.owner_elem)
                    keydown_elem_comp = keydown_elem.owner_elem.parent;
                var capture_comp = this._getCaptureComp(false, true, comp);
                if (capture_comp && capture_comp != comp)
                {
                    comp = capture_comp;
                }

                if (elem._event_stop)
                {
                    elem._event_stop = false;
                }
                else
                {
                    ret = comp._on_keyup(elem, keycode, altKey, ctrlKey, shiftKey, metaKey);
                }

                if (!use_system_key)
                {
                    if (keycode)
                    {
                        if (keycode == 229)
                        {
                            if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
                            {
                                var _win = this.handle;
                                var evt = _win.event;
                                var trigger_code = evt ? evt.code : "";
                                var exception_codes = ["NumpadEnter", "Enter", "Escape", "Delete", "ShiftLeft", "ShiftRight",
                                    "ControlLeft", "ControlRight", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "End", "PageUp", "PageDown",
                                    "NumpadAdd", "NumpadSubtract", "NumpadMultiply", "NumpadDivide", "NumpadDecimal", "Backquote"];

                                if (exception_codes.indexOf(trigger_code) < 0)
                                    this._keydown_element = null;
                            }
                            else
                            {
                                this._keydown_element = null;
                            }
                        }
                        else
                        {
                            this._keydown_element_list.delete_item(keycode.toString());

                            if (this._keydown_element_list.length == 0)
                            {
                                this._keydown_element = null;
                            }
                        }
                    }
                }

                if (comp._is_alive)
                {
                    comp._on_last_keyup();
                }

                if (nexacro._OS == "Android")
                {
                    if (!use_system_key && keydown_elem instanceof nexacro.InputElement)
                    {
                        if (comp._is_subcontrol)
                        {
                            if (root_comp instanceof nexacro.Grid || root_comp instanceof nexacro.ListView)
                            {
                                if (keydown_elem_comp instanceof nexacro._CellEditControl || keydown_elem_comp instanceof nexacro._CellMaskEditControl)
                                {
                                    is_accept_imeaction = true;
                                }
                            }
                        }
                        else
                        {
                            is_accept_imeaction = true;
                        }
                    }

                    if (is_accept_imeaction)
                    {
                        if (keycode == nexacro.Event.KEY_RETURN)
                        {
                            comp._on_imeaction(elem, keycode, altKey, ctrlKey, shiftKey, metaKey);
                        }
                    }
                }
            }
            else
            {
                if (comp._is_alive)
                {
                    comp._on_last_keyup();
                }
            }
        }

        if (is_runbase) nexacro._setRunBaseWindow(null);

        // accessibility flag init
        this._is_fire_sys_focusin = false;
        if (keycode != nexacro.Event.KEY_ALT && keycode != nexacro.Event.KEY_CTRL && keycode != nexacro.Event.KEY_SHIFT && keycode != nexacro.Event.KEY_META)
            this._is_fire_sys_keydown = false;

        return ret;
    };

    __pWindow._on_keyup = function (/*elem, keycode, altKey, ctrlKey, shiftKey, fireComp*/)
    {
        return true;
    };

    __pWindow._on_default_sys_contextmenu = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, metaKey)
    {
        var ret, canvasX, canvasY, clientXY, clientX, clientY;
        var is_runbase = nexacro._isRunBaseWindow(this);
        var comp = this.findComponent(elem);
        if (comp)
        {
            var capture_comp = this._getCaptureComp(true, false, comp);
            var firecur_comp = capture_comp ? capture_comp : comp;

            if (nexacro._OS == "iOS" ||
                (comp._control_element == elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined))
            {
                canvasX = offsetX;
                canvasY = offsetY;

                clientXY = firecur_comp._getClientXY(canvasX, canvasY);
                clientX = clientXY[0];
                clientY = clientXY[1];
            }
            else
            {
                // node left,top 값을 win ClientArea left,top 0을 기준으로 값을 얻는 함수 Call함.
                var elem_pos;
                elem_pos = nexacro._getElementXYInWindow(comp._control_element.handle);
                canvasX = windowX - elem_pos[0];
                canvasY = windowY - elem_pos[1]; //?

                clientX = offsetX;
                clientY = offsetY;
            }

            while (firecur_comp._is_subcontrol) // complex component
            {
                var canvas = firecur_comp._getRecalcCanvasXY(elem, canvasX, canvasY);
                canvasX = canvas[0];
                canvasY = canvas[1];

                firecur_comp = firecur_comp.parent;
                if (!firecur_comp._is_subcontrol)
                {
                    clientXY = firecur_comp._getClientXY(canvasX, canvasY);
                    clientX = clientXY[0];
                    clientY = clientXY[1];
                }
            }
            ret = comp._on_contextmenu(strButton, altKey, ctrlKey, shiftKey, clientX, clientY, screenX, screenY, canvasX, canvasY, metaKey);
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);

        return ret;
    };

    __pWindow._on_contextmenu = function ()
    {
        return false;
    };

    __pWindow._on_default_sys_resize = function (width, height, wparam)
    {
        const handle = this.handle;
        if (handle)
        {
            this.width = nexacro._getWindowHandleOuterWidth(handle);
            this.height = nexacro._getWindowHandleOuterHeight(handle);
            this.left = nexacro._getContainerHandlePosX(handle);
            this.top = nexacro._getContainerHandlePosY(handle);
            let ret;

            nexacro._checkClosePopupComponent(null);
            if (nexacro._Browser == "Runtime" && (nexacro._SystemType.toLowerCase() == "win32" || nexacro._SystemType.toLowerCase() == "win64"))
            {

                // win7 이상 AeroSnap으로 최대화시 maximize 처리되지 않고 resize로 최대화 처리가 된다.
                // 윈도우 크기가 먼저 바뀌지 않고 move로 처리됨.....
                // 최대화 처리를 위해 move되는지 알수 있다면 그쪽에서 처리하고 이쪽 분기코드를 없애야 한다...
                this.clientWidth = width || nexacro._getContainerHandleClientWidth(handle);
                this.clientHeight = height || nexacro._getContainerHandleClientHeight(handle);

                let frame_width = this.clientWidth;
                let frame_height = this.clientHeight;
                if (this.root && this.root._is_click_openstatus === false)
                {

                    // wParam
                    // 0: size_restored
                    // 1: size_minimized
                    // 2: size_maximized

                    // frame._state_openstatus
                    // normal(0), restore(1), minimize(2), maximize(3)
                    if (this.root._state_openstatus == 0)
                    {
                        if (wparam === 1) // Windows+D, Windows+M -> normal;
                        {
                            this.root._setSize(frame_width, frame_height, this.root._isRtl());
                            // [94885] showModal 후 Windows+D, Windows+M 로 상태 변경 후 노말로 변경 시 오동작 (팝업창이 좌측 상단에 표시)
                            this.root._on_syscommand(this.root._control_element, "restore", undefined, this.root);
                        }
                    }

                    if (this.root._state_openstatus == 2)
                    {
                        if (wparam === 0) // min->normal;
                        {
                            //[95932] mainframe을 최소화 처리 시 mainframe의 onsize이벤트가 발생 하지 않는 현상.
                            //[89312] 최초화 후 화면을 올리면 좌표 초기화 문제로 onmove, onsize 이벤트를 막는 코드 되돌림
                            //최소화일 때 windows의 left, top 값이 음수로 나와 좌표가 0,0으로 설정 되는 현상 수정 (연관 94550, 94885 확인)
                            const modal_frame = this._getLastModalFrame();
                            if (modal_frame)
                            {
                                const left = modal_frame._adjust_left;
                                const top = modal_frame._adjust_top;
                                const width = modal_frame._adjust_width;
                                const height = modal_frame._adjust_height;

                                const _window = modal_frame._getWindow();
                                const after_align_pos = modal_frame._getOpenAlignPos(_window, left, top, width, height);

                                if (after_align_pos)
                                {
                                    modal_frame._move(after_align_pos.left, after_align_pos.top, width, height);
                                }
                            }

                            this.root._setSize(frame_width, frame_height, this.root._isRtl());
                            // [84123] showModal 후 최소화 했다가 노말로 변경 시 오동작
                            this.root._on_syscommand(this.root._control_element, "restore", undefined, this.root);
                        }
                        else if (wparam === 2) // min->max;
                        {
                            //[95932] mainframe을 최소화 처리 시 mainframe의 onsize이벤트가 발생 하지 않는 현상.
                            //[89312] 최초화 후 화면을 올리면 좌표 초기화 문제로 onmove, onsize 이벤트를 막는 코드 되돌림
                            //최소화일 때 windows의 left, top 값이 음수로 나와 좌표가 0,0으로 설정 되는 현상 수정 (연관 94550, 94885 확인)
                            const modal_frame = this._getLastModalFrame();
                            if (modal_frame)
                            {
                                const left = modal_frame._adjust_left;
                                const top = modal_frame._adjust_top;
                                const width = modal_frame._adjust_width;
                                const height = modal_frame._adjust_height;

                                const _window = modal_frame._getWindow();
                                const after_align_pos = modal_frame._getOpenAlignPos(_window, left, top, width, height);
                                if (after_align_pos)
                                {
                                    modal_frame._move(after_align_pos.left, after_align_pos.top, width, height);
                                }
                            }

                            this.root._iscallfromresize = true;

                            this.root._on_syscommand(this.root._control_element, "maximize", undefined, this.root);
                            this.root._iscallfromresize = false;
                            // [85364] 윈도우7 에서 브라우저 최대화후 최소화 다시 최대화를 하면 작업표시줄 전체 클릭이 막힘
                            // return ret;
                        }
                        else if (wparam == undefined) //window create 吏곹썑 理쒕???
                        {
                            if (this.root._is_window && this.root.openalign)
                            {
                                if (this.root.top != this.top && this.root.height != frame_height)
                                    this.root._move(this.left, this.top);
                                else if (this.root.left != this.left && this.root.width != frame_width)
                                    this.root._move(this.left, this.top);
                            }
                        }
                    }
                    else if (this.root._state_openstatus == 3)
                    {
                        if (wparam === 0) // max->normal;
                        {
                            // [95253] 최대화한 전용 브라우저를 최소화 후 바로가기로 동일하게 재실행하면 normal크기로 실행됨
                            this.root._setSize(frame_width, frame_height, this.root._isRtl());

                            if (this.root._window_type == -1 || this.root._window_type == 2)
                                return this.root._on_syscommand(this.root._control_element, "restore", undefined, this.root);
                            else
                                return this.root._on_syscommand(this.root._control_element, "maximize", undefined, this.root);
                        }
                        else if (wparam === 1) // max->min;
                        {
                            // [94885] showModal 후 Windows+D, Windows+M 로 상태 변경 후 노말로 변경 시 오동작 (팝업창이 좌측 상단에 표시) (maximize => Windows +D(최소화) =>Windows +D(restore) 
                            this.root._setSize(frame_width, frame_height, this.root._isRtl());

                            this.root._iscallfromresize = true;
                            ret = this.root._on_syscommand(this.root._control_element, "minimize", undefined, this.root);
                            this.root._iscallfromresize = false;
                            return ret;
                        }
                        else if (wparam == undefined) //window create 직후 최대화
                        {
                            if (this.root._is_window && this.root.openalign)
                            {
                                if (this.root.top != this.top && this.root.height != frame_height)
                                    this.root._move(this.left, this.top);
                                else if (this.root.left != this.left && this.root.width != frame_width)
                                    this.root._move(this.left, this.top);
                            }
                        }
                    }
                    else if (wparam == 2 && this.root._state_openstatus === 0) // normal->max;
                    {
                        // [RP 87368] 팝업 생성후 normal에서 maximize (alt + space + x) 갈 경우 Overlay도 같이 변경하도록 수정.
                        const modal_stack = this._modal_frame_stack;
                        for (let j = 0; j < modal_stack.length; j++)
                        {
                            const modal_info = modal_stack[j];
                            const modal_frame = modal_info[0];
                            modal_frame._setModalOverlaySize(frame_width, frame_height);
                        }

                        this.root._setSize(frame_width, frame_height, this.root._isRtl());
                        return this.root._on_syscommand(this.root._control_element, "maximize", undefined, this.root);
                    }
                }
            }
            else
            {
                // HTML의 경우 지정된 크기로 바꿔도 문제가 없었지만
                // Autozoom 처리시 싸이즈 sync가 맞지 않아 handle로 부터 얻은 값을 우선하도록함.
                this.clientWidth = nexacro._getContainerHandleClientWidth(handle) || width;
                this.clientHeight = nexacro._getContainerHandleClientHeight(handle) || height;

                this._gap_client_width = this.width - this.clientWidth;
                this._gap_client_height = this.height - this.clientHeight;

            }

            // => 써서 this context 유지
            const resize_func = () =>
            {
                return () =>
                {
                    nexacro._calculateZoomLevel();

                    const frame_width = this.clientWidth;
                    const frame_height = this.clientHeight;

                    const overlay_width = this.width;
                    const overlay_height = this.height;
                    if (this.root)
                    {
                        nexacro._setDeactivate(wparam);
                        this.root._setSize(frame_width, frame_height);

                        if (nexacro._resize_popup_inbound === true)
                        {
                            const len = nexacro._current_popups.length;
                            for (let i = len - 1; i >= 0; i--)
                            {
                                const cur_popup_comp = nexacro._current_popups[i];
                                if (cur_popup_comp)
                                    cur_popup_comp._resizePopupInbound(frame_width, frame_height);
                            }
                        }
                    }

                    const modal_stack = this._modal_frame_stack;
                    for (let j = 0; j < modal_stack.length; j++)
                    {
                        const modal_info = modal_stack[j];
                        const modal_frame = modal_info[0];
                        modal_frame._setModalOverlaySize(overlay_width, overlay_height);
                    }

                    if (this._resizemanager)
                    {
                        const curtime = new Date().getTime();
                        const lasttime = this._resizemanager._last_time;
                        const stop_interval = this._resizemanager._interval;

                        if ((curtime - lasttime) > stop_interval)
                        {
                            this._resizemanager.stop();
                            this._resizemanager = null;
                        }
                        else
                            this._resizemanager.start();
                    }

                    //iphone 5 orientation bug
                    //iPad mini orientation bug


                    if (nexacro._OS == "iOS" && !nexacro._allow_default_pinchzoom && !nexacro._isHybrid())
                    {
                        // K 에서 필요한 내용인가?
                        setTimeout(function ()
                        {
                            if (this.handle instanceof Window)
                            {
                                window.scrollTo(0, 0);
                                this.root._setSize(frame_width, frame_width > frame_height ? frame_height : window.innerHeight);
                            }
                            else
                            {
                                this.root._setSize(frame_width, frame_height);
                            }

                        }.bind(this), 500);
                    }
                };
            };

            if (!nexacro._isDesktop())
                resize_func(this)();
            else
            {
                if (this.root)
                {
                    if (!this._resizemanager)
                    {
                        this._resizemanager = new nexacro._ResizeManager(new nexacro.AnimationFrame(this.root, resize_func(this)));
                        this._resizemanager.start();
                    }
                    this._resizemanager.setLastTime(new Date().getTime());
                }

            }

        }
    };

    __pWindow._on_default_sys_move = function (x, y)
    {
        const handle = this.handle;
        if (handle)
        {
            this.left = x;
            this.top = y;

            /*
            this.width = nexacro._getWindowHandleOuterWidth(handle);
            this.height = nexacro._getWindowHandleOuterHeight(handle);
            this.clientWidth = clientWidth ? clientWidth : this.width;
            this.clientHeight = clientHeight ? clientHeight : this.height;
            */
        }

        // frame.move는 openstatus=normal일때만 작동함

        if (this.root && this.root._is_window)
            this.root._move(x, y);
    };


    __pWindow._on_default_sys_activate = function (_sysevt = null, evt = null)
    {
        // Google Chrome에서 activate 이벤트가 2번씩 나오는 문제로 validation한다.
        let _is_active_window = this._is_active_window
        let _focuskeep = true;
        if (_sysevt && nexacro.ismodule)
        {
            let isfocus = this._is_active_window;
            if (evt && evt.type == "mousedown")
            {
                _focuskeep = isfocus = (this.handle == this._doc.activeElement || this.handle.contains(this._doc.activeElement));
                if (evt.target !== this._doc.activeElement)
                {
                    if (this._is_active_window)
                        isfocus = false;
                    _focuskeep = false;
                }
            }
            if (evt && evt.type == "focusin")
                isfocus = (this._doc.activeElement == evt.target && (evt.relatedTarget == null && this._is_active_window));
            _is_active_window = isfocus;

        }
        if (_is_active_window !== true)
        {
            // Pseudo change : Focused
            const cur_focus_paths = this.getCurrentFocusPaths();
            const cur_focus_paths_len = (cur_focus_paths ? cur_focus_paths.length : 0);
            for (let i = 0; i < cur_focus_paths_len; i++)
            {
                const _comp = cur_focus_paths[i];
                if (!_comp)
                    continue;

                if (_comp._is_frame)
                    _comp._changeStatus("deactivate", false);
                else if (!_comp._is_form || _comp._isMainForm())
                    _comp._on_activate();
            }

            let frame = this._getLastModalFrame();
            if (!frame)
                frame = this.getActiveFrame();
            if (!frame)
                frame = this.root;

            if (frame)
            {
                if (frame._is_frame)
                    frame._changeStatus("deactivate", false);
                else
                    frame._on_activate();
                this._is_active_window = true;

                if (nexacro.ismodule && !_focuskeep)
                {
                    if (this._last_focused_elem)
                        this._last_focused_elem.setElementFocus(true);
                }
            }
        }
    };


    __pWindow._on_default_sys_deactivate = function ()
    {

        var cur_focus_paths, cur_focus_paths_len;
        // Google Chrome에서 activate 이벤트가 2번씩 나오는 문제로 validation한다.
        if (this._is_active_window !== false)
        {
            nexacro._initDragInfo();
            nexacro._cur_repeat_info = null;
            nexacro._cur_track_info = null;

            var frame = this._getLastModalFrame();
            if (!frame)
                frame = this.root;
            if (frame)
            {
                if (frame._is_frame)
                    frame._changeStatus("deactivate", true);
                else
                    frame._on_deactivate();
                this._is_active_window = false;
            }

            // Pseudo change : Non-Focused
            cur_focus_paths = this.getCurrentFocusPaths();
            cur_focus_paths_len = (cur_focus_paths ? cur_focus_paths.length : 0);
            for (var i = 0; i < cur_focus_paths_len; i++)
            {
                var _comp = cur_focus_paths[i];
                if (_comp)
                {

                    if (_comp._is_frame)
                        _comp._changeStatus("deactivate", true);
                    else if (!_comp._is_form || _comp._isMainForm())
                        _comp._on_deactivate();
                }
            }
        }

        // Popup 된 것 close 처리
        // focus된 Comp killfoucs 하는데 이벤트 Fire하지 않음.
        if (this._is_alive)
        {
            if (nexacro._Browser == "Gecko")
            {
                cur_focus_paths = this.getCurrentFocusPaths();
                var comp = cur_focus_paths[cur_focus_paths.length - 1];
                nexacro._checkClosePopupComponent(comp ? comp : null, true);
            }
            else
                nexacro._checkClosePopupComponent(null);
        }
        this._isEmbeddedWindow();
    };

    __pWindow._isEmbeddedWindow = function ()
    {
        if (nexacro._Browser == "Runtime") // NRE
            return false;

        if (window)
        {
            var is_embedded = window.parent.document != window.document;
            if (is_embedded)
            {
                this._last_focused_elem = null;
                return true;
            }
        }
    };


    __pWindow._on_default_sys_beforeclose = function ()
    {
        // Safari는 팝업을 X버튼으로 닫으면 beforeunload 이벤트가 발생하지 않음

        // 여기에서는 닫힐지 말지 알 수가 없다. 취소가 가능함
        // 리소스를 내리는 작업은 정말 닫힐때 (close에서) 처리

        // Parent에 의해 같이 닫히는 경우 Parent에서 한꺼번에 Confirm함
        if (!this._ignore_close_confirm)
            return this.root._on_beforeclose();
    };

    __pWindow._on_default_sys_close = function (allclose)
    {


        const app = this.getRootInstance();

        if (this._is_alive)
        {
            if (allclose)
            {
                nexacro._checkClosePopupComponent(null);
                nexacro._removePopupComponent(null);
            }
        }

        if (this._is_main)
        {
            if (app && app._is_application && nexacro._Browser == "Runtime")
            {
                if (app._is_loaded)
                    if (!app.exit())
                        return false;
            }
            else if (app && app instanceof nexacro.Form)
            {
                if (!app._closing)
                    app.destroy(); // 자신이 root 이면 close가 아니고 destroy가 맞을듯
            }


            if (allclose)
                nexacro._clearLocalStorage();
            this._closeChildWindows(true);
        }
        else if (this._is_alive)
            this.destroy();

        // IE는 window.close를 호출해도 window가 즉시 사라지지 않는 경우가 있기때문에
        // closed 속성이 true로 바뀔때까지 기다렸다가 콜백을 수행한다. 
        // 다행히 closed는 모든 브라우저에서 정확한 값을 보여주고 있다.

        if (!this._is_main && this.root)
        {
            nexacro._createModalAsyncCallbackHandler(this.handle, this.root);
        }

        return true;
    };

    __pWindow._on_default_sys_load = function (win_handle)
    {
        if (!this.handle && win_handle)
        {
            this.attachHandle(win_handle);
        }

        if (this.handle)
        {
            for (let i = 0; i < this._lock_list.length; i++)
                nexacro._setWindowHandleLock(this._lock_list[i] ? this._lock_list[i].handle : null, true, this.handle, true);

            if (this.root)
            {
                this.root._on_window_loaded();
            }
        }
    };

    __pWindow._on_default_sys_reload = function (elem)
    {
        if (elem)
        {
            const comp = this.findComponent(elem);
            if (comp)
            {
                const ref_form = comp._getForm();
                if (ref_form)
                {
                    const frame = ref_form.getOwnerFrame();
                    if (frame && frame._p_form)
                    {
                        frame._p_form.reload();
                    }
                    else
                        ref_form.reload();
                }
            }
        }
    };

    __pWindow._on_default_sys_syscommand = function (command)
    {
        if (this.root)
        {
            const f = this.root;
            f._on_syscommand(f._control_element, command, true, f, null);
        }
    };

    __pWindow._on_default_sys_getminmaxinfo = function ()
    {
        if (this.root)
        {
            const minmaxinfo = this.root._getMinMaxInfo();
            return [minmaxinfo.cx, minmaxinfo.cy];
        }

        return null;
    };

    __pWindow._on_default_sys_touchstart = function (elem, touchid, clientX, clientY, screenX, screenY, curtime, orgtime, is_last_changedtouch, first_touchid)
    {
        var manager = this._getTouchGestureManager();
        if (!manager) return;

        this._cur_touch_elem = elem;

        var popup_len = nexacro._current_popups.length;
        if (popup_len > 0)
        {
            var is_capture = nexacro._current_popups[0]._track_capture;
            nexacro._checkClosePopupComponent(this.findComponent(elem), false);

            if (!is_capture)
            {
                this._click_cancel = false;
            }
            else
            {
                if (popup_len != nexacro._current_popups.length)
                {
                    this._click_cancel = true;
                    return false;
                }
            }
        }
        else
        {
            this._click_cancel = false;
        }


        var ret = manager.ontouchstart(this, elem, touchid, clientX, clientY, screenX, screenY, curtime, orgtime, is_last_changedtouch, first_touchid);

        // 모든 touchstart에 대해 default를 허용해야만 pinchzoom이 가능
        if (nexacro._allow_default_pinchzoom)
            return;

        return ret;
    };

    __pWindow._on_gesture_sys_touchstart = function (elem, touches, changedTouches, time)
    {
        var manager = this._gesture_manager;
        if (!manager) return;

        this._cur_touch_elem = elem;

        var popup_len = nexacro._current_popups.length;
        if (popup_len > 0)
        {
            var is_capture = nexacro._current_popups[0]._track_capture;
            nexacro._checkClosePopupComponent(this.findComponent(elem), false);

            if (!is_capture)
            {
                this._click_cancel = false;
            }
            else
            {
                if (popup_len != nexacro._current_popups.length)
                {
                    this._click_cancel = true;
                    return false;
                }
            }
        }
        else
        {
            this._click_cancel = false;
        }

        var ret = manager.ontouchstart(this, elem, touches, changedTouches, time);

        return ret;
    };

    __pWindow._on_default_sys_touchmove = function (elem, touchid, clientX, clientY, screenX, screenY, curtime, orgtime, is_last_changedtouch)
    {
        //nexacro._gap_client_height = screenY - (clientY * nexacro._getDevicePixelRatio(elem));
        //nexacro._gap_client_width = screenX - (clientX * nexacro._getDevicePixelRatio(elem));

        var manager = this._getTouchGestureManager();
        if (!manager) return;

        // pinchzoom 도중 touchmove는 모두 브라우저에 맡김 (검토)
        if (manager._allow_default)
            return;

        var ret = manager.ontouchmove(this, elem, touchid, clientX, clientY, screenX, screenY, curtime, orgtime, is_last_changedtouch);

        return ret;
    };

    __pWindow._on_gesture_sys_touchmove = function (elem, touches, changedTouches, time)
    {
        var manager = this._gesture_manager;
        if (!manager) return;

        var ret = manager.ontouchmove(this, elem, touches, changedTouches, time);

        return ret;
    };

    __pWindow._on_default_sys_touchend = function (elem, touchid, clientX, clientY, screenX, screenY, curtime, orgtime, is_last_changedtouch)
    {
        //nexacro._gap_client_height = screenY - (clientY * nexacro._getDevicePixelRatio(elem));
        //nexacro._gap_client_width = screenX - (clientX * nexacro._getDevicePixelRatio(elem));

        if (this._click_cancel)
        {
            this._click_cancel = false;
            return;
        }

        var manager = this._getTouchGestureManager();
        if (!manager) return;
        this._cur_touch_elem = elem;
        var ret = manager.ontouchend(this, elem, touchid, clientX, clientY, screenX, screenY, curtime, orgtime, is_last_changedtouch);

        if (manager._allow_default)
            return;

        return ret;
    };

    __pWindow._on_gesture_sys_touchend = function (elem, touches, changedTouches, time)
    {
        var manager = this._gesture_manager;
        if (!manager) return;

        var ret = manager.ontouchend(this, elem, touches, changedTouches, time);

        return ret;
    };

    __pWindow._on_default_sys_touchcancel = function (elem, touchid, clientX, clientY, screenX, screenY, curtime, orgtime, is_last_changedtouch)
    {
        var manager = this._getTouchGestureManager();
        if (!manager) return;
        var ret = manager.ontouchcancel(this, elem, touchid, clientX, clientY, screenX, screenY, curtime, orgtime, is_last_changedtouch);

        /*
        if (manager._allow_default)
            return;
        */

        return ret;
    };

    __pWindow._on_gesture_sys_touchcancel = function (elem, touches, changedTouches, time)
    {
        var manager = this._gesture_manager;
        if (!manager) return;

        var ret = manager.ontouchcancel(this, elem, touches, changedTouches, time);

        return ret;
    };

    __pWindow._getTouchGestureManager = function ()
    {
        var manager = nexacro._gesture_manager;
        if (!manager)
        {
            manager = nexacro._gesture_manager = new nexacro._TouchGestureManager();
        }
        return manager;
    };

    __pWindow._setFocus = function ()
    {
        nexacro._setWindowHandleFocus(this.handle);
    };

    __pWindow._setActivate = function ()
    {
        nexacro._setWindowHandleActivate(this.handle);
    };

    __pWindow._setForeground = function ()
    {
        nexacro._setWindowHandleForeground(this.handle);
    };

    __pWindow._on_default_sys_orientationchange = function (orientation)
    {
        nexacro._checkClosePopupComponent(null);

        if (this.root)
            this.root._on_orientationchange(orientation);

    };

    __pWindow._on_default_sys_accessibilitygesture = function (direction)
    {
        // direction (0: left , 1: right)

        var keycode = direction ? nexacro.Event.KEY_DOWN : nexacro.Event.KEY_UP;

        var comp = this._accessibility_last_focused_comp;
        if (comp)
        {
            if (!(comp._is_alive && comp._getForm()))
            {
                comp = null;
            }
        }

        if (!comp)
        {
            var cur_focus_paths = this.getCurrentFocusPaths();
            this._accessibility_last_focused_comp = comp = cur_focus_paths[cur_focus_paths.length - 1];

        }

        if (comp)
        {
            var _form = comp._getForm();

            if (comp._is_subcontrol)
            {
                comp = comp._getRootComponent(comp);
            }

            if (!comp._getDlgCode(keycode, false, false, false).want_arrows && _form)
            {
                comp = _form;
            }

            comp._on_accessibilitygesture(direction);
        }

        return;
    };

    __pWindow._on_default_sys_accessibilityhover = function (elem/*, clientX, clientY, screenX, screenY*/)
    {
        // elem: hit control node

        var comp;
        var control;
        var ret = false;
        if (elem instanceof nexacro.ModalOverlayElement) return ret;
        var old_comp = this._accessibility_last_focused_comp;

        comp = this.findComponent(elem, 0, 0);
        if (comp && comp[0])
        {
            comp = comp[0];

            if (comp._is_subcontrol)
            {
                control = comp;
                comp = comp._getRootComponent(comp);
            }

            if (!comp._is_form)	// touch component
            {
                ret = comp._setAccessibilityInfoByHover(control);
                if (ret)
                {
                    if (old_comp)
                    {
                        old_comp._clearAccessibilityInfoByHover();
                    }

                    this._accessibility_last_focused_comp = comp._getRootComponent(comp);
                }
            }
            else  // when touched div or form.
            {
                var my_tapstop_childs = comp._searchNextTabFocus(comp, undefined, true);
                var my_tapstop_childs_cnt = my_tapstop_childs ? my_tapstop_childs.length : 0;

                if (my_tapstop_childs_cnt == 0) // TODO : 무조건 1로 나옴, 확인 필요
                {
                    ret = comp._setAccessibilityInfoByHover(control);
                }
            }
        }
        return ret;
    };

    // ExtensionAPIv2
    __pWindow._on_default_sys_onextmodule = function (handle, eventinfoarray)//(eventinfoarray)
    {
        var env = nexacro.getEnvironment();
        if (env)
        {
            var eventid = eventinfoarray[0];
            var eventtype = eventinfoarray[1];
            var data = eventinfoarray[2];
            return env._on_onextmodule(handle, eventid, eventtype, data);
        }
    };

    __pWindow._on_default_sys_onextendedcommand = function (eventid, eventtype, deviceid, data)	
    {
        var ret;
        var app = this.getRootInstance();//nexacro.getApplication();
        if (app)						
        {
            let active_form = app.getActiveForm();

            if (active_form)
                ret = active_form._on_extendedcommand(eventid, eventtype, deviceid, data, true);
        }
        return ret;
    };

    __pWindow._updateWrapper = function (brun, action)
    {
        nexacro._updateWrapper(this.handle, brun, action);
    };


    __pWindow._clearDownEventFlag = function (comp, comp_org_)
    {

        if (comp)
        {
            var comp_org = comp_org_;
            if (!comp_org) comp_org = comp._getRootComponent(comp);
            if (comp_org)
                comp_org._cancelEvent(comp);
        }
        nexacro._cur_drag_info = null;
        nexacro._cur_repeat_info = null;
        nexacro._cur_track_info = null;
        nexacro._cur_extra_track_info = null;

        this._cur_ldown_elem = null;
        this._lbuttondown_wx = null;
        this._lbuttondown_wy = null;
        this._curWindowX = null;
        this._curWindowY = null;
        this._keydown_element = null;
        this._keydown_element_list.clear();
    };
    __pWindow._cancelEvent = function () 
    {
        var repeatInfo = nexacro._cur_repeat_info;

        if (repeatInfo && repeatInfo._timer)
        {
            var handle = nexacro._getWindowHandle(this.handle);
            nexacro._clearSystemTimer(handle, repeatInfo._timer);
        }

        var elem = this._cur_ldown_elem || this._keydown_element;
        var comp = this.findComponent(elem);
        var win = this;
        var comp_org;
        if (comp)
            comp_org = comp._getRootComponent(comp);

        if (comp_org && comp_org._cancelingEvent)
            comp_org._cancelingEvent();

        if (elem)
        {
            nexacro._SysOnceCallbackTimer.callonce(win, function ()
            {
                win._clearDownEventFlag(comp, comp_org);
            }
            );

        }
        else
            win._clearDownEventFlag(comp, comp_org);
    };

    __pWindow._blockImeInput = function (bBlockIme)
    {
        nexacro._blockWindowHandleMessage(this, false, bBlockIme);
    };

    __pWindow._getEnableWheelZoom = function ()
    {
        return this._enableWheelZoom;
    };

    __pWindow._setEnableWheelZoom = function (newEnableWheelZoom)
    {
        this._enableWheelZoom = newEnableWheelZoom;
    };

    __pWindow._getWheelZoom = function ()
    {
        return this._wheelZoom;
    };
    __pWindow._setWheelZoom = function (newWheelZoom) //only runtime
    {
        if ((50 <= newWheelZoom) && (newWheelZoom <= 200) && (newWheelZoom % 10 == 0))
        {
            this._wheelZoom = newWheelZoom;
            const zoomframeElement = this.root._is_popup_frame != true ? this.root.frame.getElement() : this.frame.getElement();    // _window.frame : mainframe
            zoomframeElement.setElementZoom(newWheelZoom);
            zoomframeElement.setElementSize(zoomframeElement._unscaledwidth, zoomframeElement._unscaledheight);
            if (this._modal_frame_stack.length > 0)
            {
                const modalCount = this._modal_frame_stack.length;
                let modalFrameElement;
                for (let loopI = 0; loopI < modalCount; loopI++)
                {
                    modalFrameElement = this._modal_frame_stack[loopI][0].getElement();
                    modalFrameElement.setElementZoom(newWheelZoom);
                    modalFrameElement.setElementSize(modalFrameElement._unscaledwidth, modalFrameElement._unscaledheight, false, true);
                    modalFrameElement._updateBorderElementsPosition();
                }
            }
        }
    };


    //==============================================================================
    // nexacro Application
    //==============================================================================
    nexacro.Application = function ()
    {
        this._load_manager = new nexacro._LoadManager(this);
    };

    //if (!this._application)
    //{
    var _pApplication = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.Application);

    nexacro.Application.prototype = _pApplication;
    _pApplication._type_name = "Application";

    _pApplication.id = "application";
    _pApplication._p_name = "application";

    // Application Collections
    // all is special Collection - direct access not allowed
    _pApplication._p_all = new nexacro.Collection();
    _pApplication._p_trays = new nexacro.Collection();
    _pApplication._p_components = new nexacro.Collection();

    //property
    _pApplication._p_mainframe = null;
    _pApplication.key = "";
    _pApplication.xadl = "";
    _pApplication.componentpath = "";
    _pApplication.commthreadcount = 3;
    _pApplication.commthreadwaittime = 0;
    _pApplication.cachedir = "";
    _pApplication.errorfile = "";
    _pApplication.onlyone = false;
    _pApplication._p_licenseurl = "";
    _pApplication._p_version = "";

    _pApplication.engineversion = "";
    _pApplication.enginesetupkey = "";

    _pApplication.mousehovertime = 500;
    _pApplication.mousewheeltype = 0;

    _pApplication.errorlevel = 0;
    _pApplication.cookiecachetype = "cache";


    //------------- internal variable --------------//
    _pApplication._is_application = true;

    _pApplication._need_init = true;

    // default Application environment
    //  _pApplication._project_uri = "";
    //    _pApplication._theme_uri = "./_theme_/default";


    _pApplication._variables = [];
    _pApplication._header_variables = [];
    _pApplication._datasets = [];
    _pApplication._dataobjects = [];
    //_pApplication._protocols = {};

    _pApplication._active_window = null; //not use
    _pApplication._global_context = this ? this : globalThis;// lookup topmost


    _pApplication._is_loaded = false;
    _pApplication._is_hybrid = false;
    _pApplication._is_loadforms = false;

    //_pApplication._loglevel = 4;

    //--------------------------------------
    // Managers
    // CSS containers
    //_pApplication._css_selectors = { _is_selector: true, _has_items: false, _has_attr_items: false };
    //_pApplication._cssfinder_cache = {};



    _pApplication._touch_manager = null;
    _pApplication._aliaslist = [];  //typedefinition에 등록된 alias 처리
    _pApplication._extensionmodules = [];

    _pApplication._globalvar_uri = "";
    _pApplication._includescriptlist = [];
    _pApplication._entered = null;

    //  _pApplication._closedmodalasync_list = []; // window handle까지 close처리된 frame,window_handle 리스트. callback처리 후 리스트에서 제거된다.

    //==============================================================================
    // nexacro.Application : Event Area
    //==============================================================================
    // Application's event list
    _pApplication._event_list = {
        "onload": 1, "onerror": 1, "onbeforeexit": 1, "onexit": 1, "onusernotify": 1,
        "onloadtypedefinition": 1, "onloadingappvariables": 1,
        "ondownloadactivex": 1, "oncopydata": 1, "onquickviewmenuclick": 1, "onbeforeuserconfirm": 1, "onafteruserconfirm": 1,
        "onaddlog": 1, "oncommunication": 1, // for plugin/AX
        "onloadforms": 1, "onduplicateexecution": 1,
        "onnotification": 1 // for Mobile PUSH/Notification
    };

    _pApplication._isEnable = function ()
    {
        return true;
    };

    _pApplication._isLoaded = function ()
    {
        return this._is_loaded;//nexacro._is_loaded_application;
    };

    //_pApplication._on_load = 
    _pApplication.on_fire_onload = function (obj, url)
    {
        if (this.onload && this.onload._has_handlers)
        {
            var evt = new nexacro.LoadEventInfo(obj, "onload", url);
            return this.onload._fireEvent(this, evt);
        }
    };

    //ie6 에서 cache되어 있는 화면을 가져올때 sync 처럼 동작하는 현상이 있어
    //application의 onload event 후에 form의 onload event를 발생시키기 위해 
    //application에 onload event 후에 호출할 form callbacklist를 달아놓는다.

    _pApplication._on_load = function (obj, url)
    {

        const env = nexacro.getEnvironment();
        if (env && env._p_preventbrowserbackbutton)
        {
            nexacro._preventBackNavigation();
        }

        this.on_fire_onload(obj, url);

        //var callbacklist = nexacro._load_callbacklist;
        var callbacklist = this._load_callbacklist;
        var n = callbacklist ? callbacklist.length : 0;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbacklist[i];
                var target = item.target;
                var _url = item.url;
                if (target._is_alive !== false)
                    item.callback.call(target, target, _url, true);
            }
            callbacklist.splice(0, n);
        }


        return true;
    };



    _pApplication._registerLoadforms = function (obj)
    {
        if (this._is_loadforms)
            return;

        if (!this._loadforms)
            this._loadforms = [];
        this._loadforms.push(obj);
    };

    _pApplication._notifyLoadforms = function (obj)
    {
        if (this._is_loadforms)
            return;

        var loadforms = this._loadforms;
        if (!loadforms) return false;
        var n = loadforms.length;
        for (var i = 0; i < n; i++)
        {
            var item = loadforms[i];
            if (obj == item)
            {
                loadforms.splice(i, 1);
            }
        }

        if (loadforms.length === 0)
        {
            this._is_loadforms = true;
            this.on_fire_onloadforms(this, this.xadl);
        }

        return false;
    };


    _pApplication.on_fire_onloadforms = function (obj, url)
    {
        if (this.onloadforms && this.onloadforms._has_handlers)
        {
            var evt = new nexacro.LoadEventInfo(obj, "onloadforms", url);
            return this.onloadforms._fireEvent(this, evt);
        }
    };

    _pApplication.on_fire_onloadtypedefinition = function (obj, url)
    {
        if (this.onloadtypedefinition && this.onloadtypedefinition._has_handlers)
        {
            var evt = new nexacro.LoadEventInfo(obj, "onloadtypedefinition", url);
            return this.onloadtypedefinition._fireEvent(this, evt);
        }
        return true;
    };

    _pApplication.on_fire_onloadingappvariables = function (obj, url)
    {
        if (this.onloadingappvariables && this.onloadingappvariables._has_handlers)
        {
            var evt = new nexacro.LoadEventInfo(obj, "onloadingappvariables", url);
            return this.onloadingappvariables._fireEvent(this, evt);
        }
        return true;
    };

    _pApplication.on_fire_onerror = function (obj, errortype, errormsg, errorobj, statuscode, requesturi, locationuri, errordata)
    {
        if (this.onerror && this.onerror._has_handlers)
        {
            var evt = new nexacro.ErrorEventInfo(obj, "onerror", errortype, errormsg, errorobj, statuscode, requesturi, locationuri, errordata);
            return this.onerror._fireEvent(this, evt);
        }
        return false;
    };

    _pApplication.on_fire_onbeforeexit = function (obj)
    {
        if (this.onbeforeexit && this.onbeforeexit._has_handlers)
        {
            var evt = new nexacro.ExitEventInfo(obj, "onbeforeexit");
            return this.onbeforeexit._fireEvent(this, evt);
        }
    };

    _pApplication.on_fire_onexit = function (obj)
    {
        if (this.onexit && this.onexit._has_handlers)
        {
            var evt = new nexacro.ExitEventInfo(obj, "onexit");
            return this.onexit._fireEvent(this, evt);
        }
        return true;
    };

    _pApplication.on_fire_onusernotify = function (obj, notifyid, message)
    {
        if (this.onusernotify && this.onusernotify._has_handlers)
        {
            var evt = new nexacro.UserNotify(obj, "onusernotify", notifyid, message);
            return this.onusernotify._fireEvent(this, evt);
        }
        return true;
    };

    _pApplication.on_fire_onaddlog = function (obj, message)
    {
        if (this.onaddlog && this.onaddlog._has_handlers)
        {
            var evt = new nexacro.AddLog(obj, "onaddlog", message);
            return this.onaddlog._fireEvent(this, evt);
        }
        return true;
    };

    _pApplication.on_fire_oncommunication = function (obj, state)
    {
        if (this.oncommunication && this.oncommunication._has_handlers)
        {
            var evt = new nexacro.Communication(obj, "oncommunication", state);
            return this.oncommunication._fireEvent(this, evt);
        }
        return true;
    };

    _pApplication._on_callback_beforeuserconfirm = function ()
    {
        return this.on_fire_onbeforeuserconfirm();
    };

    _pApplication._on_callback_afteruserconfirm = function ()
    {
        return this.on_fire_onafteruserconfirm();
    };

    _pApplication.on_fire_onbeforeuserconfirm = function ()
    {
        if (this.onbeforeuserconfirm && this.onbeforeuserconfirm._has_handlers)
        {
            var evt = new nexacro.EventInfo(this, "onbeforeuserconfirm");
            return this.onbeforeuserconfirm._fireEvent(this, evt);
        }
        return false;
    };

    _pApplication.on_fire_onafteruserconfirm = function ()
    {
        if (this.onafteruserconfirm && this.onafteruserconfirm._has_handlers)
        {
            var evt = new nexacro.EventInfo(this, "onafteruserconfirm");
            return this.onafteruserconfirm._fireEvent(this, evt);
        }
        return false;
    };

    _pApplication.on_fire_onnotification = function (v)
    {
        var parameters = JSON.parse(v);

        if (parameters.token != undefined)
            nexacro.System._setNotificationToken(parameters.token);

        if (this.onnotification && this.onnotification._has_handlers)
        {
            var evt = new nexacro.NotificationEventInfo(this, "onnotification", parameters.reason, parameters.messages);
            return this.onnotification._fireEvent(this, evt);
        }

        return false;
    };

    // _globalvalue = "val1:ev=EnvVal,val2:ec=EnvCook,val3:av=AppVal,val2=AppVal2"    
    _pApplication.on_fire_onduplicateexecution = function (_globalvalue)
    {
        if (this.onduplicateexecution && this.onduplicateexecution._has_handlers)
        {
            var _arguments = [];
            var apparguments = new nexacro.Collection();
            var envarguments = new nexacro.Collection();
            var cookiearguments = new nexacro.Collection();

            // Comma Separated, Quote 사용가능. 2013.04.03 neoarc
            var search_regexpr = /([a-z0-9_]*)(=|:ev=|:ec=|:av=)(([^,'"]+)|('[^']*')|("[^"]*"))(,|$)/ig;
            var matched;
            while (matched = search_regexpr.exec(_globalvalue))
            {
                var globalvalue = matched[0]; // a=A, ?먮뒗 a=A
                if (globalvalue.charAt(globalvalue.length - 1) == ',')
                    globalvalue = globalvalue.substr(0, globalvalue.length - 1);

                var equal_idx = globalvalue.indexOf("=");
                var variable_name = globalvalue.substr(0, equal_idx);

                // 숫자로 시작하는 변수명인 경우 걸러냄
                if (variable_name[0] >= '0' && variable_name.charAt(0) <= '9')
                    continue;
                var variable_value = globalvalue.substr(equal_idx + 1, globalvalue.length - equal_idx);

                // Type 지정여부 체크
                var variable_type = null;
                var colon_idx = variable_name.indexOf(":");
                if (colon_idx > 0)
                {
                    variable_type = variable_name.substr(colon_idx + 1, 2);
                    variable_name = variable_name.substr(0, colon_idx);
                }

                // Quote 처리 된 경우 Quote 제거
                if (variable_value.length > 2 &&
                    ((variable_value.charAt(0) == '\'' && variable_value.charAt(variable_value.length - 1) == '\'') ||
                        (variable_value.charAt(0) == '\"' && variable_value.charAt(variable_value.length - 1) == '\"')))
                {
                    variable_value = variable_value.substr(1, variable_value.length - 2);
                }

                //ev	Environment.Variable
                //ec	Environment.CookieVariable
                //av	Application.Variable (default)
                switch (variable_type)
                {
                    case "ev":
                        _arguments.push({ name: variable_name, value: variable_value, usecookie: false });
                        envarguments.add_item(variable_name, variable_value);
                        break;
                    case "ec": // cookie
                        _arguments.push({ name: variable_name, value: variable_value, usecookie: true });
                        cookiearguments.add_item(variable_name, variable_value);
                        break;
                    case "av":
                    default: // global(default)
                        _arguments.push({ name: variable_name, value: variable_value, usecookie: false });
                        apparguments.add_item(variable_name, variable_value);
                        break;
                }
            }

            var evt = new nexacro.DuplicateExecutionEventInfo(this, "onduplicateexecution", _arguments, apparguments, envarguments, cookiearguments);
            return this.onduplicateexecution._fireEvent(this, evt);
        }
        return false;
    };

    //==============================================================================
    // nexacro.Application : Application's default system event handlers
    //==============================================================================
    _pApplication._on_sys_focus = function (/*node, e, bubble*/)
    {
        return false;
    };
    _pApplication._on_sys_lbuttondown = function (/*node, e, bubble*/)
    {
        return false;
    };
    _pApplication._on_sys_lbuttonup = function (/*node, e, bubble*/)
    {
        return false;
    };
    _pApplication._on_sys_rbuttondown = function (/*node, e, bubble*/)
    {
        return false;
    };
    _pApplication._on_sys_rbuttonup = function (/*node, e, bubble*/)
    {
        return false;
    };
    _pApplication._on_sys_mouseup = function (/*node, e, bubble*/)
    {
        return false;
    };
    _pApplication._on_sys_mousedown = function (/*node, e, bubble*/)
    {
        return false;
    };
    _pApplication._on_sys_mouseenter = function (/*node, e, bubble*/)
    {
        return false;
    };
    _pApplication._on_sys_mouseleave = function (/*node, e, bubble*/)
    {
        return false;
    };
    _pApplication._on_sys_mousemove = function (/*node, e, bubble*/)
    {
        return false;
    };
    _pApplication._on_sys_mousewheel = function (/*node, e, bubble*/)
    {
        return false;
    };
    _pApplication._on_sys_keydown = function (/*node, e, bubble*/)
    {
        return false;
    };
    _pApplication._on_sys_keypress = function (/*node, e, bubble*/)
    {
        return false;
    };
    _pApplication._on_sys_keyup = function (/*node, e, bubble*/)
    {
        return false;
    };

    _pApplication._on_sys_dblclick = function (/*node, e, bubble*/)
    {
        return false;
    };
    _pApplication._on_sys_touch = function (/*node, e, bubble*/)
    {
        return false;
    };

    _pApplication._getClientWidth = nexacro._emptyFn;
    _pApplication._getClientHeight = nexacro._emptyFn;

    //==============================================================================
    // nexacro.Application : System Utility Functions
    //==============================================================================
    _pApplication._onHttpTransactionError = function (obj, bfireevent, errorobj, errortype, url, returncode, requesturi, locationuri, extramsg, svcid)
    {
        var ret = false;
        var commerrorobj = nexacro.MakeCommunicationError(this, errortype, url, returncode, requesturi, locationuri, extramsg);
        if (bfireevent)
        {
            ret = this.on_fire_onerror(obj, commerrorobj.name, commerrorobj.message, errorobj, returncode, requesturi, locationuri, svcid);
            if (!ret)
            {
                var environment = nexacro.getEnvironment();
                if (environment)
                {
                    ret = environment.on_fire_onerror(obj, commerrorobj.name, commerrorobj.message, errorobj, returncode, requesturi, locationuri, svcid);
                }
            }
        }


        //   this._onFireSystemError(obj, false, commerrorobj.name, 1, commerrorobj.message, true);                                      
        if (commerrorobj.message)
        {
            const environment = nexacro.getEnvironment();
            if (environment)
            {
                nexacro._writeTraceLog(1, commerrorobj.message, true, environment._loglevel, environment._p_traceduration, environment._p_tracemode);
            }
            else
                nexacro._writeTraceLog(1, commerrorobj.message, true);
        }
        return ret;
    };

    _pApplication._loadGlobalValueData = function (/*key, url*/)
    {
    };

    _pApplication._addInitialVariable = function ()
    {
        var variables, variable;

        if (nexacro._initappvar)
        {
            variables = nexacro._initappvar;

            for (variable in variables)
            {
                if (variables.hasOwnProperty(variable))
                {
                    this.setVariable(variable, variables[variable]);
                }
            }
            nexacro._initappvar = null;
            delete nexacro._initappvar;
        }
    };

    _pApplication._addGlobalVariableFromGlobalValue = function ()
    {
        if (globalThis.chrome && globalThis.chrome.webview)
        {
            var params = {};
            var globalvalues = nexacro._messageToNative("0000", "nexacroapi", "_addGlobalVariable", params, true, true);
        }
        else
            var globalvalues = nexacro._getGlobalValueData(this.key, this.xadl);

        if (!globalvalues)
            return;

        // nexacro._globalvalue 예:
        // nexacro._globalvalue = "a=A,b=B,c=씨,d='D,D',e=\"E=mc2,U+=LG\"";

        // Comma Separated, Quote 사용가능. 2013.04.03 neoarc
        var search_regexpr = /([a-z0-9_]*)(=|:ev=|:ec=|:av=)(([^,'"]+)|('[^']*')|("[^"]*"))(,|$)/ig;
        var matched;
        while (matched = search_regexpr.exec(globalvalues))
        {
            var globalvalue = matched[0]; // a=A, ?먮뒗 a=A
            if (globalvalue.charAt(globalvalue.length - 1) == ',')
                globalvalue = globalvalue.substr(0, globalvalue.length - 1);

            var equal_idx = globalvalue.indexOf("=");
            var variable_name = globalvalue.substr(0, equal_idx);

            // 숫자로 시작하는 변수명인 경우 걸러냄
            if (variable_name[0] >= '0' && variable_name.charAt(0) <= '9')
                continue;
            var variable_value = globalvalue.substr(equal_idx + 1, globalvalue.length - equal_idx);

            // Type 지정여부 체크
            var variable_type = null;
            var colon_idx = variable_name.indexOf(":");
            if (colon_idx > 0)
            {
                variable_type = variable_name.substr(colon_idx + 1, 2);
                variable_name = variable_name.substr(0, colon_idx);
            }

            // Quote 처리 된 경우 Quote 제거
            if (variable_value.length > 2 &&
                ((variable_value.charAt(0) == '\'' && variable_value.charAt(variable_value.length - 1) == '\'') ||
                    (variable_value.charAt(0) == '\"' && variable_value.charAt(variable_value.length - 1) == '\"')))
            {
                variable_value = variable_value.substr(1, variable_value.length - 2);
            }

            // Add to GlobalVariable
            //ev	Environment.Variable
            //ec	Environment.CookieVariable
            //av	Application.Variable (default)
            switch (variable_type)
            {
                case "ev":
                    // environment variable
                    nexacro.setEnvironmentVariable(variable_name, variable_value);
                    break;
                case "ec":
                    // cookie
                    // [sung 2018.07.31] non-secure cookie 로 취급. secure cookie로 할 방법은?  
                    nexacro.setCookieVariable(variable_name, variable_value, false);
                    break;
                case "av":
                default:
                    this.setVariable(variable_name, variable_value);
                    break;
            }
        }
    };

    //==============================================================================
    // nexacro.Application : Layout control Methods
    //==============================================================================
    _pApplication._load = function (key, url)
    {
        this.key = key;

        const env = nexacro.getEnvironment();
        //load theme
        this._loadTheme(env._curthemeid);

        //load initvalue
        this._loadInitValueFile(env._initvaluefileid);

        //load stringresource
        this._loadStringResource(env._stringrcfileid);

        this.xadl = url;
        //load adl
        var service = nexacro._getServiceObject(url);
        this._load_manager.loadMainModule(url, false, true, false, service);
    };

    _pApplication.loadADL = function (url, key)
    {
        this.key = key;

        var request_url = url;
        if (request_url.length > 5 && request_url.substring(request_url.length - 5) == ".xadl")
        {
            request_url = request_url + ".js";
        }

        var server_url = request_url;
        if (nexacro._isAbsolutePath(request_url))
        {
            if (!this._project_url)
            {
                this._project_url = nexacro._getBaseUrl(request_url);
                nexacro._setProjectURL(this._project_url);

            }
        }
        else
        {
            if (!this._project_url)
            {
                // archive adl을 사용하는 경우 외부에서 지정
                this._project_url = nexacro._getProjectBaseURL(request_url);
                nexacro._setProjectURL(this._project_url);
            }
            server_url = request_url = this._transfullurl(this._project_url, request_url);

            if (this._localcache_path)
            {
                var cache_url = url;
                if (cache_url.substring(cache_url.length - 3) == ".js")
                {
                    cache_url = cache_url.substring(0, cache_url.length - 3);
                }
                if (this._hasLocalCacheUrl(cache_url))
                {
                    request_url = this._transfullurl(this._localcache_path, url);
                }
            }
        }

        this.xadl = server_url;
        var service = this._getServiceObject(server_url);

        this._load_manager.loadMainModule(request_url, false, true, false, service);
    };


    //var moudles = ["Button.js","Static.js"];
    /*
    _pApplication._loadModules = function (modules)
    {
        var base_url;
        if (nexacro._localcache_path)
            base_url = nexacro._localcache_path;
 
        nexacro._component_uri = nexacro._getServiceLocation(nexacro._component_uri, base_url);
 
        // components has been loaded in index.html
        if (nexacro.Component)
            return;
 
        var cnt = modules.length;
        for (var i = 0; i < cnt; i++)
        {
            if (modules[i])
            {
                var realmoudlueurl = nexacro._getServiceLocation(modules[i], nexacro._component_uri);
                var service = nexacro._getServiceObject(modules[i]);
                this._load_manager.loadGlobalModule(realmoudlueurl, true, service);
            }
        }
    };
    */

    _pApplication._addExtensionModules = function (modules)
    {
        this._extensionmodules = modules;
        var extensionmodules = this._extensionmodules;
        if (extensionmodules)
        {
            var len = extensionmodules.length;
            if (len > 0)
            {
                for (var i = 0; i < len; i++)
                {
                    var item = extensionmodules[i];
                    if (item)
                    {
                        nexacro._addExtensionModule(item);
                    }
                }
            }
        }
    };

    _pApplication._loadInclude = function (mainurl, url, asyncmode, service_url)
    {
        nexacro._loadInclude(this, mainurl, url, asyncmode, service_url);
    };

    //Base::test.xcss 
    //theme::Base_test.xcss 이렇게 바꿔서...  : // 2018.01.16 2월 정기 반영전 

    // xcss:: 로 고정경로로 변경 2018.01.16 2월 정기에 변경됨
    _pApplication.loadCss = function (url)
    {
        if (!this._cssurls)
            this._cssurls = [];

        this._cssurls.push(url);

        var cssurl, base_url;
        var loadurl = url.replace("::", "_");
        //경로 설정하는 api 필요
        cssurl = nexacro._getServiceLocation("theme://" + loadurl, nexacro._project_absolutepath, null, false);

        const env = nexacro.getEnvironment();
        if (env._localcache_path)
        {
            base_url = cssurl.substring(nexacro._project_absolutepath.length, cssurl.length);
            cssurl = env._localcache_path + base_url;
        }

        var cssmapurl = cssurl;
        var pos = cssurl.lastIndexOf('/');
        cssurl = cssurl.substring(0, pos + 1) + nexacro._getCSSFileName(cssurl.substring(pos + 1, cssurl.length - 5));

        var service = nexacro._getServiceObject(url);
        pos = cssmapurl.lastIndexOf('.');
        cssmapurl = nexacro._getMapFileName(cssmapurl.substring(0, pos));

        var checkversion = env.checkversion;

        if (checkversion)
        {
            var version = service.version;
            if (!nexacro._isNull(version) && version !== "")
            {
                cssurl += nexacro._getVersionQueryString(cssurl, null, version);
                cssmapurl += nexacro._getVersionQueryString(cssmapurl, null, version);
            }
        }
        this._load_manager.loadCssModule(cssmapurl, null, null, service);  //map
        this._load_manager.loadCssModule(cssurl, null, null, service, true, 1); //css

    };

    _pApplication._loadTheme = function (themeid)
    {
        nexacro._loadTheme(this, themeid);
    };

    _pApplication._loadInitValueFile = function (initvaluefile)
    {
        nexacro._loadGlobalModule(this, initvaluefile);
    };

    //_pApplication._loadStringResource = _pApplication._loadInitValueFile;
    _pApplication._loadStringResource = function (initvaluefile)
    {
        if (!initvaluefile)
            return;
        //default

        //this._clearLocalThemeCache();
        var initvalueurl, base_url;
        var localcachetype = false;
        var service;
        const env = nexacro.getEnvironment();
        if (env._localcache_path && nexacro._hasLocalCacheUrl(initvaluefile))
        {
            initvalueurl = nexacro._getLocalCacheUrl(initvaluefile);
            if (initvalueurl)
            {
                service = nexacro._getServiceObject(initvaluefile);
                this._load_manager.loadGlobalJsonResource(initvaluefile, null, null, service);
                return;
            }

            localcachetype = true;
            base_url = env._localcache_path;
        }

        initvalueurl = nexacro._getServiceLocation(initvaluefile, base_url);

        if (localcachetype)
        {
            nexacro._addLocalCacheUrl(initvaluefile, initvalueurl);
        }

        service = nexacro._getServiceObject(initvaluefile);
        this._load_manager.loadGlobalJsonResource(initvalueurl, null, null, service);
    };

    _pApplication.createMainFrame = function (id, left, top, width, height, right, bottom, parent)
    {
        var mainframe = new nexacro.MainFrame(id, left, top, width, height, right, bottom, parent);
        this[id] = this._p_mainframe = mainframe;
        this._p_all.add_item(id, mainframe);

        if (nexacro._macOSWebView)
        {
            var params = {
                left: left,
                top: top,
                width: width,
                height: height
            };

            var json = {
                id: "0000",
                div: "NexacroWindow",
                method: "_initMainFrame",
                params: params
            };

            var jsonstr = JSON.stringify(json);
            nexacro.Device.exec(jsonstr, true);
        }

        return mainframe;
    };

    _pApplication.createWidget = function (/*id, left, top, width, height, right, bottom, parent*/)
    {
        var widget;
        return widget;
    };

    _pApplication.createTray = function (id, parent)
    {
        var tray = new nexacro.Tray(id, parent);
        this._p_trays.add_item(id, tray);
        this._p_all.add_item(id, tray);
        return tray;
    };

    _pApplication.addTray = function (id, obj)
    {
        if (obj._type_name != "Tray")
            return -1;

        if (this._p_trays.indexOf(id) > -1)
            return -1;

        var idx = this._p_trays.add_item(id, obj);
        this._p_all.add_item(id, obj);
        return idx;
    };

    _pApplication.removeTray = function (id)
    {
        if (typeof (id) == "string")
        {
            if (this._p_trays[id])
            {
                this._p_trays[id]._destroy();
            }
        }
        else
        {
            // remove all
            var cnt = this._p_trays.length;
            for (var i = cnt - 1; i >= 0; i--)
            {
                if (this._p_trays[i])
                {
                    this._p_trays[i]._destroy();
                }
            }
        }
    };

    _pApplication._addPreloadList = function (type, url, id, args)
    {
        nexacro._addPreloadList(this, type, url, id, args);
    };

    //CHECK
    _pApplication.getParentContext = function ()
    {
        return null;
    };

    _pApplication._addVariable = function (id, val/*, usecookie, defaultval, expire*/)
    {
        //runtime과 spec 조정 globalvars.js에 있는 variable의 default값은 ""
        //addvariable을 통해서 들어올때는 val 변수 그대로 처리
        if (arguments.length == 3 && val == null)
        {
            val = "";
        }

        this[id] = val;
        this._variables.push(id);

        this._p_all.add_item(id, val);

        return true;
    };

    _pApplication._getVariable = function (id)
    {
        return this[id];
    };

    _pApplication._existVariable = function (id)
    {
        var vars = this._variables;
        var len = vars.length;
        for (var i = 0; i < len; i++)
        {
            if (vars[i] == id) return true;
        }

        return false;
    };

    _pApplication._addDataset = function (id, obj)
    {
        this._addObject(id, obj);
        this._datasets.push(obj);
    };

    _pApplication._addDataObject = function (id, obj)
    {
        this._addObject(id, obj);
        this._dataobjects.push(obj);
    };

    _pApplication._addObject = function (id, obj)
    {
        this[id] = obj;
        this._p_all.add_item(id, obj);
    };

    _pApplication._getDatasetObject = function (datasetid)
    {
        var _ds;
        var pthis = "this.";
        if (datasetid.indexOf(".") > 0)
        {
            if (datasetid.indexOf(pthis) < 0)
            {
                datasetid = pthis + datasetid;
            }
            var fn = new Function("return " + datasetid);
            _ds = fn.call(this);
        }
        else
        {
            //return this[datasetid];
            _ds = datasetid ? this[datasetid] : null;
        }

        if (_ds == null)
        {
            const env = nexacro.getEnvironment();
            if (env)
                _ds = env[datasetid];
        }
        return _ds;
    };

    _pApplication._getDataObject = function (dataobjid)
    {
        return this[dataobjid];
    };

    _pApplication._waitCursor = function (wait_flag, context)
    {
        var mainframe = this._p_mainframe;
        if (mainframe)
        {
            mainframe._waitCursor(wait_flag, context);
        }
    };

    _pApplication._stopTransaction = function (is_cancel)
    {
        return nexacro.Form.prototype._stopTransaction.call(this, is_cancel);
    };

    //==============================================================================
    // nexacro.Application : Methods
    //==============================================================================        

    _pApplication.getActiveFrame = function ()
    {
        var frame = this._p_mainframe;
        var _window = frame._getWindow();
        if (_window && _window._is_active_window)
            return _window.getActiveFrame();

        var popupframes = nexacro.getPopupFrames(frame);
        if (popupframes && popupframes.length > 0)
        {
            return this._getActiveFrame(popupframes);
        }
        return null;
    };

    _pApplication._getActiveFrame = function (frames)
    {
        var finder;
        var _window;
        for (var i = 0, len = frames.length; i < len; i++)
        {
            var frame = frames[i];
            if (frame)
            {
                _window = frame._getWindow();
                if (_window && _window._is_active_window)
                {
                    finder = _window.getActiveFrame();
                    return finder;
                }
                var popupframes = nexacro.getPopupFrames(frame);
                if (popupframes == frames)
                {
                    finder = frame;
                    continue;
                }
                else
                {
                    if (popupframes && popupframes.length > 0)
                    {
                        return this._getActiveFrame(popupframes);
                    }
                }
            }
        }
        if (finder)
        {
            _window = finder._getWindow();
            if (_window && _window._is_active_window)
            {
                finder = _window.getActiveFrame();
                return finder;
            }
            else
            {
                finder = null;
            }
        }
        return finder;
    };

    _pApplication.getActiveForm = function ()
    {
        var frame = this.getActiveFrame();
        if (frame)
            return frame._p_form;
        else
            return null;
    };

    _pApplication._getActiveWindow = function ()
    {
        var frame = this._p_mainframe;
        var _window = frame._getWindow();
        if (_window && _window._is_active_window)
            return _window;

        var popupframes = nexacro.getPopupFrames(frame);
        if (popupframes && popupframes.length > 0)
        {
            return this._getActivePopupWindow(popupframes);
        }
        return null;
    };

    _pApplication._getActivePopupWindow = function (frames)
    {
        var _window;
        for (var i = 0, len = frames.length; i < len; i++)
        {
            var frame = frames[i];
            if (frame)
            {
                _window = frame._getWindow();
                if (_window && _window._is_active_window)
                {
                    return _window;
                }
                var popupframes = nexacro.getPopupFrames(frame);
                if (popupframes && popupframes.length > 0)
                {
                    return this._getActivePopupWindow(popupframes);
                }
            }
        }
    };

    _pApplication.userNotify = function (notifyid, message)
    {
        return this.on_fire_onusernotify(this, notifyid, message);
    };

    _pApplication.callScript = function (expr)
    {
        var start = expr.indexOf('(');
        var end = expr.indexOf(')', start + 1);

        if (start == -1 || end == -1)
        {
            return;
        }

        var name = expr.substring(0, start).trim();
        var args = expr.substring(start + 1, end).trim();

        var call_fn = this[name];
        if (typeof call_fn == "function")
        {
            return nexacro._executeEvalStr("call_fn.call(thisp, " + args + ");");
        }
    };

    _pApplication.trace = function (log, level)
    {
        // var loglevel = 4; // debug
        if (level)
            trace(level);
        else
            trace(log);

    };

    _pApplication.addVariable = function (id, value, type, expire)
    {
        if (this[id]) return -1;

        var use_cookie = false;

        //if (type)
        //{
        //    if (type == "share")
        //    {
        //        use_cookie = true;
        //    }
        //    else if (type == "header")
        //    {
        //        this._header_variables.push(id);
        //    }
        //}

        return this._addVariable(id, value, use_cookie, null, expire) === true ? 1 : 0;
    };

    //variable이 존재하면 set
    //variable이 없으면 add 
    _pApplication.setVariable = function (id, value, type, expire)
    {
        var vars = this._variables;
        var len = vars.length;
        for (var i = 0; i < len; i++)
        {
            if (vars[i] == id)
            {
                this[id] = value;
                return -1;
            }
        }

        return this.addVariable(id, value, type, expire);
    };

    _pApplication.getVariable = function (id)
    {
        var vars = this._variables;
        var len = vars.length;
        for (var i = 0; i < len; i++)
        {
            if (vars[i] == id)
            {
                return this[id];
            }
        }

        return null;
    };

    _pApplication.removeVariable = function (id)
    {
        var vars = this._variables;
        if (vars)
        {
            var len = vars.length;
            for (var i = 0; i < len; i++)
            {
                if (vars[i] == id)
                {
                    vars.splice(i, 1);
                    this[id] = null;
                    this._p_all.delete_item(id);
                    return;
                }
            }
        }
    };

    _pApplication.isExistVariable = function (id)
    {
        var vars = this._variables;
        var len = vars.length;
        for (var i = 0; i < len; i++)
        {
            if (vars[i] == id) return true;
        }

        return false;
    };

    _pApplication.lookup = function (name)
    {
        if (name in this)
            return this[name];

        const env = nexacro.getEnvironment();
        if (env)
            return env.lookup(name);

        return this._global_context[name];
    };

    _pApplication.lookupSetter = function (name, fnname)
    {
        if (!fnname) fnname = "set_" + name;

        var fn = this[fnname];
        if (fn)
        {
            return new nexacro.SetterBinder(this, name, fn);
        }
        if (name in this)
        {
            return new nexacro.PropBinder(this, name);
        }
        return new nexacro.PropBinder(this._global_context, name);
    };

    _pApplication.lookupFunc = function (name)
    {
        var fn = this[name];
        if (fn && fn instanceof Function)
        {
            return new nexacro.FuncBinder(this, fn);
        }
        fn = this._global_context[name];
        if (fn && fn instanceof Function)
        {
            return new nexacro.FuncBinder(this._global_context, fn);
        }
        return null;
    };

    //==============================================================================
    // nexacro.Application : Properties
    //==============================================================================
    // Application Object's properties

    _pApplication.set_version = function (v)
    {
        this._p_version = v;
    };

    _pApplication.set_licenseurl = function (v)
    {
        // this._p_licenseurl = v;            
        nexacro._onSystemWarning(this, "native_deprecate", "licenseurl");
    };

    _pApplication.set_screenid = function (screenid)
    {
        this._p_screenid = screenid;
    };

    _pApplication.reload_theme = function (/*form, url*/)
    {
    };

    _pApplication.reload = function ()
    {
        window.location.reload();
    };

    //------------------------------------------------
    // init
    //------------------------------------------------
    /*
     *  function name : init
     *  description : application init. 
     *     arguments  
        return : result 
     */
    _pApplication.init = function ()
    {
        nexacro._setBrowserErrorMsg();
        return;
    };

    _pApplication._checkLicense = function (strlicenseurl)
    {
        if (strlicenseurl == undefined || strlicenseurl.length <= 0)
            return;

        var real_url = nexacro._getServiceLocation(strlicenseurl);
        return nexacro._checkLicense(real_url, this.xadl);
    };



    // transaction Method
    //===============================================================================================================================================
    _pApplication.transaction = function (id, url, inDatasetsParam, outDatasetsParam, argsParam, callbackFn, isAsync, datatype, isCompress)
    {
        //bAsync,bBinary,bCompress -- option        
        var real_url = nexacro._getServiceLocation(url);

        var service = nexacro._getServiceObject(url, true);
        this._load_manager.loadDataModule(real_url, id, inDatasetsParam, outDatasetsParam, argsParam, callbackFn, isAsync, datatype, isCompress, service);
    };
    //===============================================================================================================================================

    _pApplication.cancelTransaction = function (id)
    {
        if (!this._load_manager)
            return -1;
        nexacro._cancelTransaction(this, id);
    };

    //------------------------------------------------
    // exit
    //------------------------------------------------
    /*
     *  function name : beforeExit
     *  description : exit 할지 여부를 결정한다. 이벤트 처리
     *     arguments
     *  return : cancle 여부
     */
    _pApplication.beforeExit = function ()
    {
        return false;
    };

    /*
     *  function name : exit
     *  description : mainframe 이하의 모든 form과 widget의 form을 close 할지 확인(canclose) 후 close 시나리오 진행한다. 
     *                Modal 창에 대한 처리가 필요함
     *     arguments
     *  return : void
     */
    _pApplication._exit = function ()
    {
        // application.onbeforeexit는 mainframe beforeclose에서 통합호출

        // mainframe BeforeClose, Close process
        var mainframe = this._p_mainframe;
        var msg = "";
        if (nexacro._Browser == "Runtime")
        {
            if (this._is_loaded)
            {
                msg = mainframe._on_beforeclose();
            }
        }
        else
            msg = mainframe._on_beforeclose();
        if (mainframe._checkAndConfirmClose(msg) === false)
            return false;

        // destroy tray
        this.removeTray();

        // 모든 창이 닫힘 확정 상태이므로 close confirm 무시
        var i;
        var popupframes = nexacro.getPopupFrames();
        if (popupframes)
        {
            var len = popupframes.length;
            for (i = len - 1; i >= 0; i--)
            {
                if (popupframes[i]._window)
                    popupframes[i]._window._ignore_close_confirm = true;
            }
        }

        mainframe._on_close();

        if (nexacro._Browser == "Runtime")
        {
            if (this._is_loaded)
            {
                this.on_fire_onexit();
                this._is_loaded = false;
            }
        }
        else
            this.on_fire_onexit();

        nexacro._removeProtocols();
        popupframes = nexacro.getPopupFrames();
        if (popupframes)
        {
            var popup_frame_len = popupframes.length;
            for (i = popup_frame_len - 1; i >= 0; i--)
            {
                var chframe = popupframes[i];
                if (chframe && chframe._p_form)
                {
                    chframe._p_form.close();
                }
            }
        }
        this._p_mainframe._destroy();

        this._global_context = null;   // lookup topmost
        //this._localecollator_list = null; // localecompare collator list
        nexacro._applicationExit();
    };

    _pApplication.exit = function ()
    {
        // 사용자 호출시 window.close를 같이 수행함.
        if (this._exit() === false)
            return false;
        nexacro._applicationExit(true);
    };


    /*
      *  function name : alert
      *  description : alert를 띄우기 위해 필요하다.  Async 지원에 대한 논의가 필요
      *                구현 방법 논의 필요
      *     arguments
      *  return : 
      */
    _pApplication.alert = function (strText, strCaption, strType)
    {
        nexacro._skipDragEventAfterMsgBox = true;
        nexacro._alert(this, strText, strCaption, strType);
    };

    /*
     *  function name : confirm
     *  description : confirm를 띄우기 위해 필요하다. Async 지원에 대한 논의가 필요
     *                   구현 방법 논의 필요
     *     arguments
     *  return : 
     */
    _pApplication.confirm = function (strText, strCaption, strType)
    {
        nexacro._skipDragEventAfterMsgBox = true;
        return nexacro._confirm(this, strText, strCaption, strType);
    };

    /*
     *  function name : userconfirm
     *  description :  작업대상 아님
     *     arguments
     *  return : 
     */
    _pApplication.userconfirm = function (/*strCaption, strText, strType*/)
    {
        return true;
    };



    _pApplication.checkLicense = function (licenseurl)
    {
        this._checkLicense(licenseurl);
    };

    _pApplication.loadTypeDefinition = nexacro._emptyFn;
    _pApplication.on_initApplication = nexacro._emptyFn;
    _pApplication.on_loadAppVariables = nexacro._emptyFn;
    _pApplication.on_initEvent = nexacro._emptyFn;
    _pApplication.on_createBodyFrame = nexacro._emptyFn;

    _pApplication.initApplication = function ()
    {
        nexacro._initApplication();  //-> NRE for hide splash 
        nexacro._initLayoutManager(true, true, true);
        this.on_initApplication();
        //nexacro._initInformation(); -> env 로 이동
    };

    _pApplication.loadGlobalVariables = function ()
    {
        this.on_loadAppVariables();

        this._addInitialVariable();
        // 미리 저장해둔 globalvalue 값 -> global variable로
        this._addGlobalVariableFromGlobalValue();
    };

    _pApplication.initEvent = function ()
    {
        this.on_initEvent();
    };
    _pApplication.createBodyFrame = function (mainframe)
    {
        this.on_createBodyFrame(mainframe);
    };
    //loadinclude 호출시 
    //adl 
    // include A 
    // include B
    // adl-script    
    //A
    //include A-1
    //include A-2
    //A-script    
    //B
    //include B-1
    //include B-2
    //B-script

    //[0]A-1
    //[1]A-2
    //[2]A-script
    //[3]B-1
    //[4]B-2
    //[5]B-script    
    //[6]adl-script 
    //
    // index 0 번 script 처리됨

    //executescript를 generate 코드에서 직접 호출로 변경 
    _pApplication.executeIncludeScript = function (url)
    {
        nexacro._executeIncludeScript(this, url);
    };

    _pApplication._executeScript = function (context)
    {
        nexacro._executeMainScript(context);
    };

    _pApplication.registerScript = function (filename, fn)
    {
        nexacro._registerScript(this, filename, fn);
    };

    _pApplication.addIncludeScript = function (mainurl, url)
    {
        nexacro._addIncludeScript(this, mainurl, url);
    };


    _pApplication.loadIncludeScript = function (mainurl)
    {
        nexacro._loadIncludeScript(this, mainurl);
    };



    _pApplication._on_init = function ()
    {
        // globalvars 오류시 project load되지 않는 문제
        try
        {
            nexacro._observeGlobalEvent(null, "beforeuserconfirm", "onbeforeuserconfirm", this._on_callback_beforeuserconfirm);
            nexacro._observeGlobalEvent(null, "afteruserconfirm", "onafteruserconfirm", this._on_callback_afteruserconfirm);

            this.initApplication();

            if (this._p_mainframe)
                this._p_mainframe.createBodyFrame();

            this._executeScript(this);
            this.initEvent();

            this.loadGlobalVariables();
            this.on_fire_onloadingappvariables(this, this._globalvar_uri);

            var cnt = this._datasets.length, i;
            for (i = 0; i < cnt; i++)
            {
                this._datasets[i].on_created();
            }

            cnt = this._dataobjects.length;
            for (i = 0; i < cnt; i++)
            {
                this._dataobjects[i].on_created();
            }

            if (this._p_mainframe)
            {
                this._p_mainframe.createComponent();
                this._p_mainframe.on_created();
            }

            cnt = this._p_trays.length;
            for (i = 0; i < cnt; i++)
            {
                this._p_trays[i].on_created();
            }

            //nexacro._is_loaded_application = true;
            this._is_loaded = true;

        }
        catch (e)
        {
            if (e.obj)
            {
                nexacro._onSystemError(e.obj, e.name, e.message);
            }
            else
            {
                var msg = nexacro._getExceptionMessage(e);

                var environment = nexacro.getEnvironment();
                if (environment)
                {
                    nexacro._onSystemError(environment, e.name, msg);
                }
            }
        }
    };

    // TODO check nexacro API로 옮기는게 맞을런지?? ..
    _pApplication._beginCommProgress = function ()
    {
        var mainframe = this._p_mainframe;
        var statusbar = mainframe ? mainframe._p_statusbar : null;
        if (statusbar)
        {
            statusbar._beginCommProgress();
        }
    };

    _pApplication._stepCommProgress = function (current, overall)
    {
        var mainframe = this._p_mainframe;
        var statusbar = mainframe ? mainframe._p_statusbar : null;
        if (statusbar)
        {
            statusbar._stepCommProgress(current, overall);
        }
    };

    _pApplication._endCommProgress = function ()
    {
        var mainframe = this._p_mainframe;
        var statusbar = mainframe ? mainframe._p_statusbar : null;
        if (statusbar)
        {
            statusbar._endCommProgress();
        }
    };

    _pApplication.enableAutoUpdate = function ()
    {
        // only mobile runtime
        this._id = nexacro.Device.makeID();
        nexacro.Device._userCreatedObj[this._id] = this;

        var jsonstr = '{"id":' + this._id + ', "div":"Update",  "method":"enableAutoUpdate"}';
        nexacro.Device.exec(jsonstr);
    };

    _pApplication.set_mainframe = function (mainframe)
    {
        this._p_mainframe = mainframe;
    };

    _pApplication._addLoadCallbacklist = function (item)
    {
        if (!this._is_loaded)
        {
            if (!this._load_callbacklist)
                this._load_callbacklist = [];
            this._load_callbacklist.push(item);
            return true;
        }
        return false;
    };


    _pApplication._load_new = function (key, url)
    {
        this.key = key;
        //load theme

        this.xadl = url;
        //load adl
        var service = nexacro._getServiceObject(url);
        this._load_manager.loadMainModule(url, false, true, false, service);
    };




    _pApplication._properties = [{ name: "version" }, { name: "licenseurl" }, { name: "screenid" }, { name: "mainframe" }, { name: "all", readonly: true }, { name: "trays", readonly: true }];
    nexacro._defineProperties(_pApplication, _pApplication._properties);

    _pApplication = null;

    //---------------------------------------------------------------------------------------
    // Touch & Gesture Manager
    //---------------------------------------------------------------------------------------
    nexacro._TouchGestureManager = function ()
    {
    };

    var _pTouchGestureManager = nexacro._TouchGestureManager.prototype;

    // Internal Variables
    _pTouchGestureManager._touch_session = null;
    _pTouchGestureManager._start_win = null;
    _pTouchGestureManager._start_elem = null;

    _pTouchGestureManager._first_touch = null;

    /*
    _pTouchGestureManager._allow_default = false; // <-> preventDefault touch events
    _pTouchGestureManager._slide_lock_horz = false;
    _pTouchGestureManager._slide_lock_vert = false;
    */

    _pTouchGestureManager._is_pressed = false;
    _pTouchGestureManager._is_fling = false;
    _pTouchGestureManager._is_tap = false;
    _pTouchGestureManager._is_ondrag = false;

    _pTouchGestureManager._scroll_end = true;
    _pTouchGestureManager._scroll_comp = null;
    _pTouchGestureManager._scroll_mode = -1;
    // 로직문제를 변수추가로 해결하지 말 것.


    //==== RawTouchEvent Handling ==========================================//
    _pTouchGestureManager.ontouchstart = function (win, elem, touches, changedTouches, time)
    {
        var session = this._touch_session;

        var ret = true;
        var touch_len = touches.length;
        var change_len = changedTouches.length;

        var is_first = (touch_len == change_len);
        if (is_first)
        {
            this._start_win = win;
            this._start_elem = elem;
            this._is_pressed = false;
            this._is_tap = false;
            this._is_ondrag = false;
        }

        var target_elem = this._start_elem ? this._start_elem : elem;
        var target_compinfo = win.findComponent(target_elem, 0, 0);
        var target_elem_pos = target_elem._getPositionInWindow();

        // set TouchInput
        var touch_input = new nexacro.TouchInput(elem, "touchstart", time);

        var touch, touchTarget;
        var compinfo, elem_pos, client_pos, comp;
        for (var i = 0; i < touch_len; i++)
        {
            touch = touches[i];
            touchTarget = touch.target || elem;

            if (touchTarget != target_elem)
            {
                compinfo = win.findComponent(touchTarget, 0, 0);
                elem_pos = touchTarget._getPositionInWindow();
            }
            else
            {
                compinfo = target_compinfo;
                elem_pos = target_elem_pos;
            }

            if (compinfo && compinfo[0] && elem_pos)
            {
                touch._canvasx = touch.canvasx = touch.windowx - elem_pos[0] + compinfo[1];
                touch._canvasy = touch.canvasy = touch.windowy - elem_pos[1] + compinfo[2];

                comp = compinfo[0];
                client_pos = comp._getClientXY(touch.canvasx, touch.canvasy);
                touch.clientx = client_pos[0];
                touch.clienty = client_pos[1];
            }

            touch.isfirst = (is_first && i == 0);
            touch_input.addTouchInfo(touch);
        }

        if (is_first)
        {
            win._curWindowX = touch_input.touches[0].windowx; //save x at lbuttondown for track
            win._curWindowY = touch_input.touches[0].windowy; //save x at lbuttondown for track
        }

        // fire ontouchstart event
        this.on_fire_ontouch(win, target_compinfo[0], target_elem, touch_input);

        if (is_first)
        {
            if (session && this._is_fling)
            {
                session.stop(); // for cur_detector(slide) fix
                session.init();

                this._touch_session = new nexacro.TouchSession(this, win, target_elem, session);
                session = this._touch_session;
            }
            else
            {
                this._touch_session = new nexacro.TouchSession(this, win, target_elem, session);
                if (session)
                {
                    session.destroy(); // stop fling
                }

                session = this._touch_session;
                this._is_fling = false;
            }
        }

        session.ontouch(target_elem, touch_input);

        if (!touch_input.prevented && this.checkPreventDefault(elem, 0))
        {
            ret = false;
        }

        return ret;
    };

    _pTouchGestureManager.ontouchmove = function (win, elem, touches, changedTouches, time)
    {
        var session = this._touch_session;
        if (!session)
            return;
        var trackInfo;
        const env = nexacro.getEnvironment();
        const enabletouchevent = env._p_enabletouchevent;
        if (enabletouchevent)        
        {
            trackInfo = nexacro._cur_track_info;
        }
        var ret = true;
        var touch_len = touches.length;

        var target_elem = elem ? elem : this._start_elem;
        var target_compinfo = win.findComponent(target_elem, 0, 0);
        var target_elem_pos = target_elem._getPositionInWindow();

        // set TouchInput
        var touch_input = new nexacro.TouchInput(elem, "touchmove", time);

        var first_touch_id = session.getFirstTouchId();
        var touch, touchTarget;
        var compinfo, elem_pos, client_pos, comp, canvasX, canvasY;
        for (var i = 0; i < touch_len; i++)
        {
            touch = touches[i];

            if (!touch.target && !elem) return;
            touchTarget = touch.target || elem;

            if (touchTarget != target_elem)
            {
                compinfo = win.findComponent(touchTarget, 0, 0);
                elem_pos = touchTarget._getPositionInWindow();
            }
            else
            {
                compinfo = target_compinfo;
                elem_pos = target_elem_pos;
            }

            if (compinfo && compinfo[0] && elem_pos)
            {
                touch._canvasx = touch.canvasx = touch.windowx - elem_pos[0] + compinfo[1];
                touch._canvasy = touch.canvasy = touch.windowy - elem_pos[1] + compinfo[2];

                comp = compinfo[0];
                client_pos = comp._getClientXY(touch.canvasx, touch.canvasy);
                touch.clientx = client_pos[0];
                touch.clienty = client_pos[1];
            }

            touch.isfirst = (first_touch_id == touch.id);
            touch_input.addTouchInfo(touch);
        }

        var prev_elem = session._cur_elem;
        if (touch_len == 1)
        {
            var dragInfo = nexacro._cur_drag_info;
            // var is_drag_return = false;
            if (dragInfo)
            {
                this._is_ondrag = true;
                touch = touches[0];
                var windowX = touch.windowx, windowY = touch.windowy;
                var screenX = touch.screenx, screenY = touch.screeny;
                var xdeltavalue = windowX - dragInfo.startX;
                var ydeltavalue = windowY - dragInfo.startY;
                if (!dragInfo.isDragging)
                {
                    if (windowX != dragInfo.startX || windowY != dragInfo.startY)
                    {
                        var drag_elem = dragInfo.target_elem;
                        comp = win.findComponent(drag_elem);
                        elem_pos = drag_elem._getPositionInWindow();
                        canvasX = windowX - elem_pos[0];
                        canvasY = windowY - elem_pos[1];
                        var retDrag = comp._on_drag(drag_elem, "touch", false, false, false, canvasX, canvasY, screenX, screenY);
                        if (retDrag && retDrag[0] === true)
                        {
                            dragInfo.isDragging = true;
                            dragInfo.target = retDrag[1];
                            dragInfo.referTarget = retDrag[2];
                            dragInfo.data = retDrag[3];
                            dragInfo.userdata = retDrag[4];
                            if (enabletouchevent)
                            {
                                if (trackInfo && trackInfo.target && trackInfo.target._is_tracking == true)
                                {
                                    trackInfo.distX = windowX - trackInfo.startX;
                                    trackInfo.distY = windowY - trackInfo.startY;

                                }
                            }
                            comp._on_dragmove(drag_elem, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, "touch", false, false, false, canvasX, canvasY, screenX, screenY, xdeltavalue, ydeltavalue);

                            // TODO Fire Enter & Leave ?

                            session.stop();
                            return true;
                        }
                    }
                    nexacro._initDragInfo();
                }
                else
                {
                    elem = (touch.target || elem);
                    comp = win.findComponent(elem);
                    var ischild = false;
                    if (dragInfo.target && dragInfo.target._contains)
                        ischild = dragInfo.target._contains(comp);
                    if ((comp && !dragInfo.isSelfAction) || comp && (ischild && dragInfo.isSelfAction))
                    {
                        if (prev_elem == elem)
                        {
                            elem_pos = comp.getElement()._getPositionInWindow();
                            canvasX = windowX - elem_pos[0];
                            canvasY = windowY - elem_pos[1];
                            if (enabletouchevent)
                            {
                                if (trackInfo && trackInfo.target && trackInfo.target._is_tracking == true)
                                {
                                    trackInfo.distX = windowX - trackInfo.startX;
                                    trackInfo.distY = windowY - trackInfo.startY;

                                }
                            }
                            comp._on_dragmove(elem, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, "touch", false, false, false, canvasX, canvasY, screenX, screenY, xdeltavalue, ydeltavalue);
                        }
                        else
                        {
                            var from_comp;
                            if (prev_elem && prev_elem.handle)
                            {
                                from_comp = win.findComponent(prev_elem);
                                elem_pos = from_comp.getElement()._getPositionInWindow();
                                canvasX = windowX - elem_pos[0];
                                canvasY = windowY - elem_pos[1];
                                from_comp._on_dragleave(prev_elem, comp, dragInfo.target, dragInfo.referTarget, dragInfo.data,
                                    dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, "touch", false, false, false, canvasX, canvasY, screenX, screenY);
                            }
                            if (elem && elem.handle)
                            {
                                from_comp = win.findComponent(prev_elem);
                                elem_pos = comp.getElement()._getPositionInWindow();
                                canvasX = windowX - elem_pos[0];
                                canvasY = windowY - elem_pos[1];
                                comp._on_dragenter(elem, from_comp, dragInfo.target, dragInfo.referTarget, dragInfo.data,
                                    dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, "touch", false, false, false, canvasX, canvasY, screenX, screenY);
                            }
                        }
                    }

                    session.update(target_elem, touch_input);

                    return true;
                }
            }

            if (enabletouchevent)
            {

                var repeatInfo = nexacro._cur_repeat_info;
                touch = touches[0];
                var windowx = touch.windowx;
                var windowy = touch.windowy;
                if (repeatInfo)
                {
                    repeatInfo.distX = windowx - repeatInfo.startX;
                    repeatInfo.distY = windowy - repeatInfo.startY;
                    repeatInfo.canvasX = repeatInfo.startCanvasX + repeatInfo.distX;
                    repeatInfo.canvasY = repeatInfo.startCanvasY + repeatInfo.distY;
                }

                if (trackInfo)
                {
                    trackInfo.distX = windowx - trackInfo.startX;
                    trackInfo.distY = windowy - trackInfo.startY;
                    trackInfo.target._on_movetrack(trackInfo.distX, trackInfo.distY, trackInfo.data);
                }
            }
        }

        this.on_fire_ontouch(win, target_compinfo[0], target_elem, touch_input);

        session.ontouch(target_elem, touch_input);

        if (!touch_input.prevented && this.checkPreventDefault(elem, 1))
        {
            ret = false;
        }

        return ret;
    };

    _pTouchGestureManager.ontouchend = function (win, elem, touches, changedTouches, time)
    {
        var session = this._touch_session;
        if (!session)
            return;

        var ret = true;
        var touch_len = touches.length;
        var change_len = changedTouches.length;

        var is_last = touch_len == 0;
        if (is_last)
        {
            this._is_pressed = false;
        }

        var target_elem = this._start_elem ? this._start_elem : elem;
        var target_compinfo = win.findComponent(target_elem, 0, 0);
        var target_elem_pos = target_elem._getPositionInWindow();

        // set TouchInput
        var touch_input = new nexacro.TouchInput(elem, "touchend", time);

        var first_touch_id = session.getFirstTouchId();
        var touch, touchTarget, i;
        var compinfo, elem_pos, client_pos, comp = null;
        for (i = 0; i < change_len; i++)
        {
            touch = changedTouches[i];

            if (!touch.target && !elem) return;
            touchTarget = touch.target || elem;

            if (touchTarget != target_elem)
            {
                compinfo = win.findComponent(touchTarget, 0, 0);
                elem_pos = touchTarget._getPositionInWindow();
            }
            else
            {
                compinfo = target_compinfo;
                elem_pos = target_elem_pos;
            }

            if (compinfo && compinfo[0] && elem_pos)
            {
                touch._canvasx = touch.canvasx = touch.windowx - elem_pos[0] + compinfo[1];
                touch._canvasy = touch.canvasy = touch.windowy - elem_pos[1] + compinfo[2];

                comp = compinfo[0];
                client_pos = comp._getClientXY(touch.canvasx, touch.canvasy);
                touch.clientx = client_pos[0];
                touch.clienty = client_pos[1];
            }

            touch.isfirst = (first_touch_id == touch.id);
            touch_input.addTouchInfo(touch);
        }
        for (i = 0; i < touch_len; i++)
        {
            touch = touches[i];
            touchTarget = touch.target || elem;

            if (touchTarget != target_elem)
            {
                compinfo = win.findComponent(touchTarget, 0, 0);
                elem_pos = touchTarget._getPositionInWindow();
            }
            else
            {
                compinfo = target_compinfo;
                elem_pos = target_elem_pos;
            }

            if (compinfo && compinfo[0] && elem_pos)
            {
                touch._canvasx = touch.canvasx = touch.windowx - elem_pos[0] + compinfo[1];
                touch._canvasy = touch.canvasy = touch.windowy - elem_pos[1] + compinfo[2];

                comp = compinfo[0];
                client_pos = comp._getClientXY(touch.canvasx, touch.canvasy);
                touch.clientx = client_pos[0];
                touch.clienty = client_pos[1];
            }

            touch.isfirst = (first_touch_id == touch.id);
            touch_input.addTouchInfo(touch);
        }

        if (is_last)
        {
            var up_touch = changedTouches[change_len - 1];
            var up_elem = up_touch.target || elem;

            // Drag & Drop (drop)
            var dragInfo = nexacro._cur_drag_info;
            if (up_elem && dragInfo && dragInfo.isDragging)
            {
                comp = win.findComponent(up_elem);
                var ischild = false;
                if (dragInfo.target && dragInfo.target._contains)
                    ischild = dragInfo.target._contains(comp);
                if ((comp && !dragInfo.isSelfAction) || comp && (ischild && dragInfo.isSelfAction))
                {
                    comp._on_drop(up_elem, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist,
                        "touch", false, false, false, up_touch.canvasx, up_touch.canvasy, up_touch.screenx, up_touch.screeny);

                    session.stop();
                }
            }

            var windowX = up_touch.windowx;
            var windowY = up_touch.windowy;

            var repeatInfo = nexacro._cur_repeat_info;
            if (repeatInfo)
            {
                if (repeatInfo._timer)
                {
                    var handle = nexacro._getWindowHandle(win.handle);
                    nexacro._clearSystemTimer(handle, repeatInfo._timer);
                }
                repeatInfo.distX = windowX - repeatInfo.startX;
                repeatInfo.distY = windowY - repeatInfo.startY;
                repeatInfo.target._on_endrepeat(repeatInfo.refer_comp, repeatInfo.distX, repeatInfo.distY, repeatInfo.data);
                nexacro._cur_repeat_info = null;
            }

            var trackInfo = nexacro._cur_track_info;
            if (trackInfo)
            {
                trackInfo.distX = windowX - trackInfo.startX;
                trackInfo.distY = windowY - trackInfo.startY;
                trackInfo.target._on_endtrack(trackInfo.distX, trackInfo.distY, trackInfo.data);
                nexacro._cur_track_info = null;
            }
        }
        nexacro._initDragInfo();

        var target_comp = target_compinfo[0];
        // fire ontouchend event
        this.on_fire_ontouch(win, target_comp, target_elem, touch_input);
        this._is_ondrag = false;

        const env = nexacro.getEnvironment();
        if (env._p_enabletouchevent)
        {
            // grid용 제거하면 좋겠는데...
            if (target_comp && target_comp._is_alive)
                target_comp._on_last_lbuttonup();
        }

        session.ontouch(target_elem, touch_input);

        if (!touch_input.prevented && this.checkPreventDefault(elem, 2))
        {
            ret = false;
        }
        return ret;
    };

    _pTouchGestureManager.ontouchcancel = function (win, elem, touches, changedTouches, time)
    {
        var touch_len = touches.length;
        var change_len = changedTouches.length;

        var session = this._touch_session;
        if (!session)
            return;

        var is_last = touch_len == 0;
        if (is_last)
        {
            this._touch_session = null;
            this._is_fling = false;
            this._is_pressed = false;
        }

        var target_elem = this._start_elem ? this._start_elem : elem;
        var target_compinfo = win.findComponent(target_elem, 0, 0);
        var target_elem_pos = target_elem._getPositionInWindow();

        // set TouchInput
        var touch_input = new nexacro.TouchInput(elem, "touchcancel", time);
        var compinfo, elem_pos, client_pos, comp = null, i;
        var touch, touchTarget, first_touch_id = session.getFirstTouchId();
        for (i = 0; i < change_len; i++)
        {
            touch = changedTouches[i];
            touchTarget = touch.target || elem;
            if (touchTarget != target_elem)
            {
                compinfo = win.findComponent(touchTarget, 0, 0);
                elem_pos = touchTarget._getPositionInWindow();
            }
            else
            {
                compinfo = target_compinfo;
                elem_pos = target_elem_pos;
            }

            if (compinfo && compinfo[0] && elem_pos)
            {
                touch._canvasx = touch.canvasx = touch.windowx - elem_pos[0] + compinfo[1];
                touch._canvasy = touch.canvasy = touch.windowy - elem_pos[1] + compinfo[2];

                comp = compinfo[0];
                client_pos = comp._getClientXY(touch.canvasx, touch.canvasy);
                touch.clientx = client_pos[0];
                touch.clienty = client_pos[1];
            }

            touch.isfirst = (first_touch_id == touch.id);
            touch_input.addTouchInfo(touch);
        }
        for (i = 0; i < touch_len; i++)
        {
            touch = touches[i];
            touchTarget = touch.target || elem;
            if (touchTarget != target_elem)
            {
                compinfo = win.findComponent(touchTarget, 0, 0);
                elem_pos = touchTarget._getPositionInWindow();
            }
            else
            {
                compinfo = target_compinfo;
                elem_pos = target_elem_pos;
            }

            if (compinfo && compinfo[0] && elem_pos)
            {
                touch._canvasx = touch.canvasx = touch.windowx - elem_pos[0] + compinfo[1];
                touch._canvasy = touch.canvasy = touch.windowy - elem_pos[1] + compinfo[2];

                comp = compinfo[0];
                client_pos = comp._getClientXY(touch.canvasx, touch.canvasy);
                touch.clientx = client_pos[0];
                touch.clienty = client_pos[1];
            }

            touch.isfirst = (first_touch_id == touch.id);
            touch_input.addTouchInfo(touch);
        }

        session.ontouchcancel(target_elem, touch_input);

        if (this._touch_session == null)
        {
            session.destroy();
        }
        return true;
    };

    _pTouchGestureManager.onactioncanceled = function (/*elem, data, touches, changedTouches*/)
    {
        this._is_pressed = false;
        this._is_fling = false;
    };

    _pTouchGestureManager.onslidestart = function (elem, data, touches, changedTouches)
    {
        var target_elem = this._start_elem ? this._start_elem : elem;
        var target_win = this._start_win ? this._start_win : target_elem._getWindow();
        if (!target_elem || !target_win) return;

        var compinfo = target_win.findComponent(target_elem, 0, 0);
        if (compinfo && compinfo[0])
        {
            var prevented = compinfo[0]._on_slidestart(target_elem, this, touches, data.distanceX, data.distanceY, data.deltaDistanceX, data.deltaDistanceY);
            if (prevented)
            {
                this._touch_session._cur_input.prevented = true;
            }
        }
    };
    _pTouchGestureManager.onslide = function (elem, data, touches, changedTouches)
    {
        var target_elem = this._start_elem ? this._start_elem : elem;
        var target_win = this._start_win ? this._start_win : target_elem._getWindow();
        if (!target_elem || !target_win) return;

        var compinfo = target_win.findComponent(target_elem, 0, 0);
        if (compinfo && compinfo[0])
        {
            var prevented = compinfo[0]._on_slide(target_elem, this, touches, data.distanceX, data.distanceY, data.deltaDistanceX, data.deltaDistanceY);
            if (prevented)
            {
                this._touch_session._cur_input.prevented = true;
            }
        }
    };

    _pTouchGestureManager.onslideend = function (elem, data, touches/*, changedTouches*/)
    {
        var target_elem = this._start_elem ? this._start_elem : elem;
        var target_win = this._start_win ? this._start_win : target_elem._getWindow();
        if (!target_elem || !target_win) return;

        var compinfo = target_win.findComponent(target_elem, 0, 0);
        if (compinfo && compinfo[0])
        {
            this._is_next_fire_fling = !!data.is_next_fire_fling;

            var prevented = compinfo[0]._on_slideend(target_elem, this, touches, data.distanceX, data.distanceY, data.deltaDistanceX, data.deltaDistanceY);
            if (prevented)
            {
                this._touch_session._cur_input.prevented = true;
            }
        }

        this._scroll_end = true;
        this._scroll_comp = null;
        this._scroll_mode = -1;
    };

    _pTouchGestureManager.onpinchstart = function (elem, data, touches/*, changedTouches*/)
    {
        var target_elem = this._start_elem ? this._start_elem : elem;
        var target_win = this._start_win ? this._start_win : target_elem._getWindow();
        if (!target_elem || !target_win) return;

        var session = this._touch_session;
        if (!session) return;

        var first_spacing = session._first_pointer_spacing;
        var compinfo = target_win.findComponent(target_elem, 0, 0);
        if (compinfo && compinfo[0])
        {
            compinfo[0]._on_pinchstart(target_elem, touches, data.accDeltaSpacing, data.deltaSpacing, first_spacing, data.spacing);
        }
    };
    _pTouchGestureManager.onpinch = function (elem, data, touches/*, changedTouches*/)
    {
        var target_elem = this._start_elem ? this._start_elem : elem;
        var target_win = this._start_win ? this._start_win : target_elem._getWindow();
        if (!target_elem || !target_win) return;

        var session = this._touch_session;
        if (!session) return;

        var first_spacing = session._first_pointer_spacing;
        var compinfo = target_win.findComponent(target_elem, 0, 0);
        if (compinfo && compinfo[0])
        {
            compinfo[0]._on_pinch(target_elem, touches, data.accDeltaSpacing, data.deltaSpacing, first_spacing, data.spacing);
        }
    };
    _pTouchGestureManager.onpinchend = function (elem, data, touches/*, changedTouches*/)
    {
        var target_elem = this._start_elem ? this._start_elem : elem;
        var target_win = this._start_win ? this._start_win : target_elem._getWindow();
        if (!target_elem || !target_win) return;

        var session = this._touch_session;
        if (!session) return;

        var first_spacing = session._first_pointer_spacing;
        var compinfo = target_win.findComponent(target_elem, 0, 0);
        if (compinfo && compinfo[0])
        {
            compinfo[0]._on_pinchend(target_elem, touches, data.accDeltaSpacing, data.deltaSpacing, first_spacing, data.spacing);
        }
    };
    _pTouchGestureManager.onlongpress = function (elem, data, touches/*, changedTouches*/)
    {
        var target_elem = this._start_elem ? this._start_elem : elem;
        var target_win = this._start_win ? this._start_win : target_elem._getWindow();
        if (!target_elem || !target_win) return;

        var touch;
        var compinfo = target_win.findComponent(target_elem, 0, 0);
        if (compinfo && compinfo[0])
        {
            const env = nexacro.getEnvironment();
            if (env._p_enabletouchevent)
            {
                compinfo[0]._on_longpress(target_elem, touches);
            }
            else
            {
                touch = this.getFirstTouchInputInfo(touches);
                compinfo[0]._on_rbuttondown(target_elem, "touch", false, false, false, touch._canvasx, touch._canvasy, touch.screenx, touch.screeny);
                this._is_ondrag = false;
            }
            if (nexacro._OS == "iOS")
            {
                //ios 브라우저에서 지원되지 않으므로 여기서 넣어준다.
                //추후에 sys_event로 처리가 가능하다면 2번 발생하므로 삭제
                //on_fire_user_onlongpress에 iOS분기는 삭제
                touch = this.getFirstTouchInputInfo(touches);
                target_win._on_default_sys_contextmenu(target_elem, "contextmenu", false, false, false, touch.windowx, touch.windowy, touch.screenx, touch.screeny, touch._canvasx, touch._canvasy, false);
            }
        }
        this._is_pressed = true;
    };
    _pTouchGestureManager.onlongpressup = function (elem, data, touches/*, changedTouches*/)
    {
        var target_elem = this._start_elem ? this._start_elem : elem;
        var target_win = this._start_win ? this._start_win : target_elem._getWindow();
        if (!target_elem || !target_win) return;

        var compinfo = target_win.findComponent(target_elem, 0, 0);
        if (compinfo && compinfo[0])
        {
            if (target_elem != elem)
            {
                var up_comp = nexacro._findParentComponent(elem);
                if (compinfo[0] != up_comp) return;
            }
            const env = nexacro.getEnvironment();
            if (!env._p_enabletouchevent)            
            {
                var touch = this.getFirstTouchInputInfo(touches);
                compinfo[0]._on_rbuttonup(target_elem, "touch", false, false, false, touch._canvasx, touch._canvasy, touch.screenx, touch.screeny);
            }
        }
        this._is_pressed = false;
    };
    _pTouchGestureManager.ontap = function (elem, data, touches/*, changedTouches*/)
    {
        var target_elem = this._start_elem ? this._start_elem : elem;
        var target_win = this._start_win ? this._start_win : target_elem._getWindow();
        if (!target_elem || !target_win) return;

        var compinfo = target_win.findComponent(target_elem, 0, 0);
        if (compinfo && compinfo[0])
        {
            if (target_elem != elem)
            {
                var up_comp = nexacro._findParentComponent(elem);
                if (compinfo[0] != up_comp) return;
            }

            var touch = this.getFirstTouchInputInfo(touches);
            const env = nexacro.getEnvironment();
            if (env._p_enabletouchevent)            
            {
                compinfo[0]._on_tap(target_elem, touch._canvasx, touch._canvasy, touch.screenx, touch.screeny);
            }
            else if (touch)
            {
                // 보통의 웹브라우저가 처리하는 것처럼 tap동작시 mousemove, mousedown, mouseup을 처리하도록 변경 2014.11.10
                //target_win._on_sys_mousemove(touch.target, "touch", false, false, false, touch.windowx, touch.windowy, touch.screenx, touch.screeny);
                //if (target_win._cur_ldown_elem == null) //Check!!
                compinfo[0]._on_lbuttondown(touch.target, "touch", false, false, false, touch._canvasx, touch._canvasy, touch.screenx, touch.screeny);
                var delaytime = nexacro._getLbuttonupDelayTime(elem);
                if (delaytime > 0)
                {
                    setTimeout(function ()
                    {
                        target_win._on_sys_lbuttonup(touch.target, "touch", false, false, false, touch.windowx, touch.windowy, touch.screenx, touch.screeny, undefined, undefined, undefined, elem);
                    }, delaytime);
                }
                else
                {
                    target_win._on_sys_lbuttonup(touch.target, "touch", false, false, false, touch.windowx, touch.windowy, touch.screenx, touch.screeny, undefined, undefined, undefined, elem);
                }
            }
        }
        this._is_tap = true;
    };
    _pTouchGestureManager.ondbltap = function (elem, data, touches/*, changedTouches*/)
    {
        var target_elem = this._start_elem ? this._start_elem : elem;
        var target_win = this._start_win ? this._start_win : target_elem._getWindow();
        if (!target_elem || !target_win) return;

        var compinfo = target_win.findComponent(target_elem, 0, 0);
        if (compinfo && compinfo[0])
        {
            if (target_elem != elem)
            {
                var up_comp = nexacro._findParentComponent(elem);
                if (compinfo[0] != up_comp) return;
            }
            var touch = this.getFirstTouchInputInfo(touches);
            var delaytime = nexacro._getLbuttonupDelayTime(elem);
            function on_dbltap()
            {
                const env = nexacro.getEnvironment();
                if (env._p_enabletouchevent)                
                {
                    compinfo[0]._on_dbltap(touch.target, touch._canvasx, touch._canvasy, touch.screenx, touch.screeny);
                }
                else if (touch)
                {
                    compinfo[0]._on_dblclick(touch.target, "lbutton", false, false, false, touch._canvasx, touch._canvasy, touch.screenx, touch.screeny);
                }
            }
            if (delaytime > 0)
            {
                nexacro._OnceCallbackTimer.callonce(compinfo[0], function ()
                {
                    on_dbltap();
                }, delaytime);
            }
            else
            {
                on_dbltap();
            }
        }
    };

    _pTouchGestureManager.onflingstart = function (elem, data/*, touches, changedTouches*/)
    {
        var target_elem = this._start_elem ? this._start_elem : elem;
        var target_win = this._start_win ? this._start_win : target_elem._getWindow();
        if (!target_elem || !target_win) return;

        var compinfo = target_win.findComponent(target_elem, 0, 0);
        if (compinfo && compinfo[0])
        {
            compinfo[0]._on_flingstart(target_elem, this, data.centerX, data.centerY, data.deltaDistanceX, data.deltaDistanceY, data.touchPointers);

            this._is_fling = true;
        }
    };

    _pTouchGestureManager.onfling = function (elem, data/*, touches, changedTouches*/)
    {
        var target_elem = this._start_elem ? this._start_elem : elem;
        var target_win = this._start_win ? this._start_win : target_elem._getWindow();
        if (!target_elem || !target_win) return;

        var compinfo = target_win.findComponent(target_elem, 0, 0);
        if (compinfo && compinfo[0])
        {
            compinfo[0]._on_fling(target_elem, this, data.centerX, data.centerY, data.deltaDistanceX, data.deltaDistanceY, data.touchPointers);
        }
    };

    _pTouchGestureManager.onflingend = function (elem, data/*, touches, changedTouches*/)
    {
        var target_elem = this._cur_elem ? this._cur_elem : elem;   // 다른 컴포넌트의 touchstart로 fling이 stop되는 경우 때문에 this._start_elem대신 cur_elem으로 사용해야 된다. 
        var target_win = this._start_win ? this._start_win : target_elem._getWindow();
        if (!target_elem || !target_win) return;

        var compinfo = target_win.findComponent(target_elem, 0, 0);
        if (compinfo && compinfo[0])
        {
            compinfo[0]._on_flingend(target_elem, this, data.centerX, data.centerY, data.deltaDistanceX, data.deltaDistanceY, data.touchPointers);
        }

        this._scroll_end = true;
        this._scroll_comp = null;
        this._scroll_mode = -1;

        this._is_fling = false;
    };

    //==== Fire Touch & Gesture Event functions ==========================================//
    _pTouchGestureManager.on_fire_ontouch = function (win, comp, elem, input)
    {
        if (!win || !elem || !input) return;
        if (!comp)
        {
            comp = win.findComponent(elem);
            if (!comp) return;
        }

        var evttype = input.type;
        var touches = input.touches;

        var changedTouches = input.changedTouches;
        var firstTouch = this.getFirstTouchInputInfo(touches);

        // fire
        const env = nexacro.getEnvironment();
        if (env._p_enabletouchevent)
        {
            var ret;
            switch (evttype)
            {
                case nexacro.Touch._TOUCH_START:
                    if (firstTouch && firstTouch.target)
                        win._cur_ldown_elem = firstTouch.target;
                    comp._on_touchstart(this, touches, changedTouches);
                    break;
                case nexacro.Touch._TOUCH_MOVE:
                    comp._on_touchmove(this, touches, changedTouches);
                    break;
                case nexacro.Touch._TOUCH_END:
                    ret = comp._on_touchend(this, touches, changedTouches);
                    if (this._is_ondrag && this._scroll_mode == -1) //check
                    {
                        if (win._cur_ldown_elem == null)
                        {
                            var touch = this.getFirstTouchInputInfo(touches);
                            if (touch && elem == touch.target)
                                comp._on_tap(elem, touch._canvasx, touch._canvasy, touch.screenx, touch.screeny);
                        }
                    }
                    if (ret == true)
                    {
                        input.preventAction();
                    }
                    win._cur_ldown_elem = null;
                    break;
            }
        }
        else if (firstTouch)
        {
            var target = firstTouch.target;
            // EnableTouchEvent = false인 경우 적절한 MouseEvent로 변환하여 Fire
            switch (evttype)
            {
                case nexacro.Touch._TOUCH_START:

                    win._on_touch_to_lbuttondown(target, "touch", false, false, false, firstTouch.windowx, firstTouch.windowy, firstTouch.screenx, firstTouch.screeny);
                    break;
                case nexacro.Touch._TOUCH_MOVE:

                    if (win._cur_ldown_elem == null) // tap이 아닐때 lbuttondown 발생해야 하는데....
                    {
                        win._on_sys_lbuttondown(target, "touch", false, false, false, firstTouch.windowx, firstTouch.windowy, firstTouch.screenx, firstTouch.screeny);
                    }
                    win._on_sys_mousemove(target, "touch", false, false, false, firstTouch.windowx, firstTouch.windowy, firstTouch.screenx, firstTouch.screeny);
                    break;
                case nexacro.Touch._TOUCH_END:
                    //if (!this._is_pressed && !this._is_tap)// && this._tap_blocked)
                    if (this._is_ondrag == true && this._scroll_mode == -1)
                    {
                        if (win._cur_ldown_elem == null) // tap이 아닐때 lbuttondown 발생해야 하는데....
                        {
                            win._on_sys_lbuttondown(this._start_elem, "touch", false, false, false, firstTouch.windowx, firstTouch.windowy, firstTouch.screenx, firstTouch.screeny);
                            win._on_sys_lbuttonup(target, "touch", false, false, false, firstTouch.windowx, firstTouch.windowy, firstTouch.screenx, firstTouch.screeny, undefined, undefined, undefined, elem);
                        }
                    }

                    break;
            }
        }

    };

    _pTouchGestureManager.checkPreventDefault = function (elem, type)
    {
        /* 2017.04.25
            input에 mouseup/mousedown이 발생하면 무조건 focus가 갈수밖에 없음.
            Touch 리팩토링으로 인해 nexacro14의 validation이 전부 검증이 안된상태.
            touch 로인한 동작중 input과 focus가 연관된 동작은 이쪽에서 확인해야함. 6월 정기 전에 주석 삭제
        */
        var focused_comp;
        var linkedcontrol = elem ? elem.linkedcontrol : null;
        if (!linkedcontrol && elem && elem.parent)
        {
            linkedcontrol = elem.parent.linkedcontrol;

            if ((elem instanceof nexacro.InputElement) && linkedcontrol._is_subcontrol)
            {
                linkedcontrol = linkedcontrol._getRootComponent(linkedcontrol);
            }
        }

        while (linkedcontrol && !linkedcontrol._is_focus_accept)
        {
            linkedcontrol = linkedcontrol.parent;
        }

        if (linkedcontrol && linkedcontrol._refform)
        {
            if (linkedcontrol._refform.getFocus)
            {
                focused_comp = linkedcontrol._refform.getFocus();
            }
            else if (linkedcontrol._refform._p_form && linkedcontrol._refform._p_form.getFocus)
            {
                focused_comp = linkedcontrol._refform._p_form.getFocus();
            }
        }

        if (!elem || !linkedcontrol)
            return;

        const env = linkedcontrol._env;
        var is_plugin_elem, is_webbrowser;
        if (nexacro._OS == "iOS")
        {
            switch (type)
            {
                case 0: // touchstart
                    break;
                case 1: // touchmove
                    if (this._scroll_end)
                        return true;
                    break;
                case 2: // touchend
                    if (focused_comp == linkedcontrol && nexacro._BrowserVersion < 13)
                        return true;

                    var is_focused_input = elem instanceof nexacro.InputElement;
                    if (is_focused_input)
                        return true;

                    if (elem._use_decoration)
                        return true;

                    if (env._p_enableaccessibility)
                        return true;

                    is_plugin_elem = elem instanceof nexacro.PluginElement;
                    if (is_plugin_elem)
                        return true;

                    is_webbrowser = nexacro._isWebTypeComponent(focused_comp);
                    if (is_webbrowser)
                        return true;
                    // TODO Focus되지 않은 Input에 Tap 하는 경우, Tap위치에 바로 Caret 이동 How to??
                    break;
            }
        }
        else if (nexacro._OS == "Android" || nexacro._AndroidDesktopMode)
        {
            switch (type)
            {
                case 0: // touchstart
                    return true;
                case 1: // touchmove
                    if (this._scroll_end)
                        return true;
                    break;
                case 2: // touchend
                    var focused_comp_type = "normal";
                    if (focused_comp)
                    {
                        if (focused_comp._has_inputElement == true)
                        {
                            if (!(focused_comp instanceof nexacro.Combo) || focused_comp.type != "dropdown")
                                focused_comp_type = "edit";
                        }
                    }

                    //var is_focused_input = (focused_comp == linkedcontrol);
                    //if (is_focused_input)
                    //    return true;
                    if (focused_comp_type == "edit")
                    {
                        if (!(elem instanceof nexacro.InputElement))
                        {
                            if (linkedcontrol instanceof nexacro.Form)
                                return true;
                            if (focused_comp._has_inputElement)
                                return true;
                        }
                        else
                            return true;
                    }

                    if (elem._use_decoration)
                        return true;

                    if (env._p_enableaccessibility)
                        return true;

                    is_plugin_elem = elem instanceof nexacro.PluginElement;
                    if (is_plugin_elem)
                        return true;

                    is_webbrowser = nexacro._isWebTypeComponent(focused_comp);
                    if (is_webbrowser)
                        return true;

                    break;
            }
        }
        else if (nexacro._OS == "Windows" && env._p_enabletouchevent && nexacro._SupportTouchEvent)
        {
            // Window도 터치 환경이 존재하여 focus를 직접 받는 컴포넌트는 이벤트를 차단하지 않도록 추가
            // 다른 모바일 OS의 일부분은 기본으로 가져옴( plugin, webbrowser, decoration, input, accessibility)
            switch (type)
            {
                case 0: // touchstart
                case 1: // touchmove
                    break;
                case 2: // touchend
                    if (elem._use_decoration)
                        return true;

                    if (env._p_enableaccessibility)
                        return true;

                    is_plugin_elem = elem instanceof nexacro.PluginElement;
                    if (is_plugin_elem)
                        return true;

                    if (focused_comp)
                    {
                        if (focused_comp._has_inputElement == true)
                            return true;

                        is_webbrowser = nexacro._isWebTypeComponent(focused_comp);
                        if (is_webbrowser)
                            return true;
                    }

                    break;
            }
            return false;
        };
    };

    _pTouchGestureManager.updateTouchInputInfosCanvasXY = function (touchinputinfos, offsetX, offsetY)
    {
        if (!touchinputinfos)
            return;

        var len = touchinputinfos.length;
        for (var i = 0; i < len; i++)
        {
            var touchinputinfo = touchinputinfos[i];
            touchinputinfo.canvasx += offsetX;
            touchinputinfo.canvasy += offsetY;
        }
    };

    _pTouchGestureManager.updateTouchInputInfosClientXY = function (touchinputinfos, comp)
    {
        if (!touchinputinfos)
            return;

        var len = touchinputinfos.length;
        for (var i = 0; i < len; i++)
        {
            var touchinputinfo = touchinputinfos[i];
            var clientXY = comp._getClientXY(touchinputinfo.canvasx, touchinputinfo.canvasy);
            touchinputinfo.clientx = clientXY[0];
            touchinputinfo.clienty = clientXY[1];
        }
    };


    _pTouchGestureManager.getFirstTouchInputInfo = function (touchinputinfos)
    {
        if (!touchinputinfos)
            return;

        var len = touchinputinfos.length;
        for (var i = 0; i < len; i++)
        {
            var touchinputinfo = touchinputinfos[i];
            if (touchinputinfo.isfirst)
                return touchinputinfo;
        }

        return null;
    };

    //---------------------------------------------------------------------------------------
    // FlingHandler (TouchManager[1]---[0..n]FlingHandler)
    //---------------------------------------------------------------------------------------
    nexacro._FlingHandler = function (id, win, elem, scroll_comp, scroll_mode, touchinfos, totalx, totaly, speedx, speedy, duration, touchlen, touch_manager)
    {
        this._id = id;
        this._touch_manager = touch_manager;

        // totalx,totaly = Scroll처리시 총 이동해야 할 양
        var compinfo = win.findComponent(elem, 0, 0);
        if (compinfo && compinfo[0] && (totalx || totaly))
        {
            this._target_comp = compinfo[0];
            this.totalx = totalx;
            this.totaly = totaly;
            this.speedx = speedx;
            this.speedy = speedy;
            this.duration = duration;
            this.touchlen = touchlen;

            this._target_window = win;
            this._target_elem = elem;
            this._starttime = (new Date()).getTime();
            this._compinfo = compinfo;
            this._scroll_comp = scroll_comp;
            this._scroll_mode = scroll_mode;
            this._oldspeedx = this._oldspeedy = this._oldcurvevalue = 0.0;

            this._is_alive = true;
        }
        else
        {
            this._is_alive = false;
        }

        if (!nexacro._FlingHandler.prototype._fling_bezier)
        {
            nexacro._FlingHandler.prototype._fling_bezier = new nexacro._CubicBezier(0.1, 0.4, 0.3, 1);
        }
    };

    var __pFlingHandler = nexacro._FlingHandler.prototype;
    //__pFlingHandler._scroll_mode_tts = 0; // 0: timer 1:CSS transform
    __pFlingHandler._fling_interval = 20;
    __pFlingHandler._fling_bezier = null;

    __pFlingHandler.start = function ()
    {
        // flingstart Event
        var touch_manager = this._touch_manager;
        var ret = touch_manager.on_fire_onflingstart(
            this._target_elem, this._compinfo, this,
            this.speedx, this.speedy,
            this.speedx, this.speedy,
            this.touchlen);
        if (ret == true)
        {
            // dead end
            this._touch_manager.onflingend(this._id);
            return;
        }

        // fling Event
        this._flingend_timer = new nexacro._TouchTimer(this._target_window, this._on_flingend_timer, this, this.duration);

        var pThis = this;
        this._fling_timer = new nexacro.AnimationFrame(this._target_comp, function () { pThis._on_fling_frame(); });
        this._fling_timer.start();
    };

    __pFlingHandler.stop = function ()
    {
        // Fling과 Scroll 모두 중단
        if (this._flingend_timer && this._flingend_timer.isWait())
        {
            this._fling_timer.stop();
            this._flingend_timer.stop();

            // flingend Event
            this.on_fire_onflingend();

            // dead
            this._touch_manager.onflingend(this._id);
        }
    };

    __pFlingHandler._on_fling_timer = function ()
    {
        // Interpolation
        var t = (new Date()).getTime() - this._starttime;
        if (!this._is_alive)
            return t;

        // Bezier곡선에서 현재 X에 해당하는 Y값 얻기
        var fling_bezier = this._fling_bezier;
        var epsilon = 1.0 / (200.0 * this.duration); // ?
        var solvedX = fling_bezier._getTForCoordinate(t / this.duration, fling_bezier._p1.x, fling_bezier._p2.x, epsilon);
        var c = fling_bezier._getCoordinateForT(solvedX, fling_bezier._p1.y, fling_bezier._p2.y);

        var offset_c = c - this._oldcurvevalue;
        var xdelta = (offset_c * this.speedx);
        var ydelta = (offset_c * this.speedy);

        this._proc_scroll = false; // 각 틱에 해당하는 스크롤을 처리 할 지 여부
        this._touch_manager.on_fire_onfling(this._target_elem, this._compinfo, this, this.speedx, this.speedy, xdelta, ydelta, this.touchlen);

        var scroll_comp = this._scroll_comp;
        if (scroll_comp && this._proc_scroll)
        {
            // Perform Scroll
            var scrolldeltax = (offset_c * this.totalx);
            var scrolldeltay = (offset_c * this.totaly);

            var scroll_mode = this._scroll_mode;
            var hscroll_pos = scroll_comp._hscroll_pos;
            var vscroll_pos = scroll_comp._vscroll_pos;

            if ((scroll_mode == 3 || scroll_mode == 2) && scrolldeltax)
            {
                hscroll_pos -= scrolldeltax;
            }

            if ((scroll_mode == 3 || scroll_mode == 1) && scrolldeltay)
            {
                vscroll_pos -= scrolldeltay;
            }

            if (scroll_comp._getHScrollBarType() == "autoindicator")
            {
                var hscrollbar = scroll_comp.hscrollbar;
                if (hscrollbar && hscrollbar.enable && !hscrollbar.visible)
                    hscrollbar.set_visible(true);
            }

            if (scroll_comp._getVScrollBarType() == "autoindicator")
            {
                var vscrollbar = scroll_comp.vscrollbar;
                if (vscrollbar && vscrollbar.enable && !vscrollbar.visible)
                    vscrollbar.set_visible(true);
            }

            scroll_comp._scrollTo(hscroll_pos, vscroll_pos, true, false, undefined, "fling");
        }

        this._oldcurvevalue = c;
        return (t / this.duration);
    };

    __pFlingHandler._on_fling_frame = function ()
    {
        var ret = this._on_fling_timer();
        if (ret < 1.0)
        {
            this._fling_timer.start();
        }
    };

    __pFlingHandler.on_fire_onflingend = function ()
    {
        this._touch_manager.on_fire_onflingend(this._target_elem, this._compinfo, this, this.speedx, this.speedy, 0, 0, this.touchlen);
        this._is_alive = false;
    };

    __pFlingHandler._setScrollComp = function (comp)
    {
        if (this._scroll_comp || !comp)
            return;
        this._scroll_comp = comp;
    };

    __pFlingHandler._on_flingend_timer = function ()
    {
        if (this._fling_timer)
        {
            this._fling_timer.stop();
            this._fling_timer.destroy();
        }
        this._flingend_timer.destroy();

        // flingend Event
        this.on_fire_onflingend();

        // dead
        this._touch_manager.onflingend(this._id);
    };


    //---------------------------------------------------------------------------------------
    // Touch Timer
    //---------------------------------------------------------------------------------------
    nexacro._TouchTimer = function (target, callbackfunc, scope, interval)
    {
        var pThis = this;
        this._callbackfunc = function ()
        {
            pThis.stop();
            callbackfunc.call(scope);
        };
        if (target._getReferenceContext)
        {
            this.context = target._getReferenceContext(); //refcontext는 자기 자신의 context
            this._win_handle = this.context._getWindowHandle();
        }
        else
        {
            this._win_handle = target.handle;
        }

        this.handle = null;

        if (interval != undefined)
        {
            this.start(interval);
        }
    };
    var __pTouchTimer = nexacro._TouchTimer.prototype;

    __pTouchTimer.start = function (interval)
    {
        if (this.handle) this.stop();
        this.handle = nexacro._setSystemTimer(this._win_handle, this._callbackfunc, interval);
    };

    __pTouchTimer.stop = function ()
    {
        if (this.handle)
        {
            nexacro._clearSystemTimer(this._win_handle, this.handle);
            this.handle = null;
        }
    };

    __pTouchTimer.isWait = function ()
    {
        return !!this.handle;
    };

    __pTouchTimer.destroy = function ()
    {
        this.stop();
        this.context = null;
        this._callbackfunc = null;
        this.scope = null;
    };


    //---------------------------------------------------------------------------------------
    // Cubic Bezier (4point bezier curve): Apple license
    //---------------------------------------------------------------------------------------
    nexacro._CubicBezier = function (p1x, p1y, p2x, p2y)
    {
        // Control Point 좌표값 Validation 삭제 (0 ~ 1 사이값이어야 함)

        // Control points
        this._p1 = { x: p1x, y: p1y };
        this._p2 = { x: p2x, y: p2y };
    };

    var __pCubicBezier = nexacro._CubicBezier.prototype;
    __pCubicBezier._getCoordinateForT = function (t, p1, p2)
    {
        var c = 3 * p1, b = 3 * (p2 - p1) - c, a = 1 - c - b;
        return ((a * t + b) * t + c) * t;
    };

    __pCubicBezier._getCoordinateDerivateForT = function (t, p1, p2)
    {
        var c = 3 * p1, b = 3 * (p2 - p1) - c, a = 1 - c - b;
        return (3 * a * t + 2 * b) * t + c;
    };

    __pCubicBezier._getTForCoordinate = function (c, p1, p2, epsilon)
    {
        if (!isFinite(epsilon) || epsilon <= 0)
        {
            throw new RangeError('"epsilon" must be a number greater than 0.');
        }
        var t2, i, c2, d2;

        // First try a few iterations of Newton's method -- normally very fast.
        for (t2 = c, i = 0; i < 8; i = i + 1)
        {
            c2 = this._getCoordinateForT(t2, p1, p2) - c;
            if (Math.abs(c2) < epsilon)
            {
                return t2;
            }
            d2 = this._getCoordinateDerivateForT(t2, p1, p2);
            if (Math.abs(d2) < 1e-6)
            {
                break;
            }
            t2 = t2 - c2 / d2;
        }

        // Fall back to the bisection method for reliability.
        t2 = c;
        var t0 = 0, t1 = 1;
        if (t2 < t0)
        {
            return t0;
        }
        if (t2 > t1)
        {
            return t1;
        }

        while (t0 < t1)
        {
            c2 = this._getCoordinateForT(t2, p1, p2);
            if (Math.abs(c2 - c) < epsilon)
            {
                return t2;
            }
            if (c > c2)
            {
                t0 = t2;
            }
            else
            {
                t1 = t2;
            }
            t2 = (t1 - t0) * 0.5 + t0;
        }

        // Failure.
        return t2;
    };

    __pCubicBezier.getPointForT = function (t)
    {
        // Special cases: starting and ending points
        if (t === 0 || t === 1)
        {
            return { x: t, y: t };
        }

        // Check for correct t value (must be between 0 and 1)
        if (t < 0 || t > 1)
        {
            throw new RangeError('"t" must be a number between 0 and 1' + 'Got ' + t + ' instead.');
        }

        return {
            x: this._getCoordinateForT(t, this._p1.x, this._p2.x),
            y: this._getCoordinateForT(t, this._p1.y, this._p2.y)
        };
    };

    __pCubicBezier.getTForX = function (x, epsilon)
    {
        return this._getTForCoordinate(x, this._p1.x, this._p2.x, epsilon);
    };

    __pCubicBezier.getTForY = function (y, epsilon)
    {
        return this._getTForCoordinate(y, this._p1.y, this._p2.y, epsilon);
    };

    __pCubicBezier._getAuxPoints = function (t)
    {
        if (t <= 0 || t >= 1)
        {
            throw new RangeError('"t" must be greater than 0 and lower than 1');
        }

        // First series of auxiliary points
        // First control point of the left curve
        var i0 = { x: t * this._p1.x, y: t * this._p1.y },
            i1 = { x: this._p1.x + t * (this._p2.x - this._p1.x), y: this._p1.y + t * (this._p2.y - this._p1.y) },
            // Second control point of the right curve
            i2 = { x: this._p2.x + t * (1 - this._p2.x), y: this._p2.y + t * (1 - this._p2.y) };

        // Second series of auxiliary points
        // Second control point of the left curve
        var j0 = { x: i0.x + t * (i1.x - i0.x), y: i0.y + t * (i1.y - i0.y) },
            // First control point of the right curve
            j1 = { x: i1.x + t * (i2.x - i1.x), y: i1.y + t * (i2.y - i1.y) };

        // The division point (ending point of left curve, starting point of right curve)
        var k = { x: j0.x + t * (j1.x - j0.x), y: j0.y + t * (j1.y - j0.y) };

        return { i0: i0, i1: i1, i2: i2, j0: j0, j1: j1, k: k };
    };

    __pCubicBezier.divideAtT = function (t)
    {
        if (t < 0 || t > 1)
        {
            throw new RangeError('"t" must be a number between 0 and 1. ' + 'Got ' + t + ' instead.');
        }

        // Special cases t = 0, t = 1: Curve can be cloned for one side, the other
        // side is a linear curve (with duration 0)
        if (t === 0 || t === 1)
        {
            var curves = [];
            curves[t] = this.linear();
            curves[1 - t] = this.clone();
            return curves;
        }

        var left = {}, right = {}, points = this._getAuxPoints(t);
        var i0 = points.i0, i2 = points.i2, j0 = points.j0, j1 = points.j1, k = points.k;

        // Normalize derived points, so that the new curves starting/ending point
        // coordinates are (0, 0) respectively (1, 1)
        var factorX = k.x, factorY = k.y;
        left.p1 = { x: i0.x / factorX, y: i0.y / factorY };
        left.p2 = { x: j0.x / factorX, y: j0.y / factorY };
        right.p1 = { x: (j1.x - factorX) / (1 - factorX), y: (j1.y - factorY) / (1 - factorY) };
        right.p2 = { x: (i2.x - factorX) / (1 - factorX), y: (i2.y - factorY) / (1 - factorY) };

        return [
            new nexacro._CubicBezier(left.p1.x, left.p1.y, left.p2.x, left.p2.y),
            new nexacro._CubicBezier(right.p1.x, right.p1.y, right.p2.x, right.p2.y)
        ];
    };

    __pCubicBezier.divideAtX = function (x, epsilon)
    {
        if (x < 0 || x > 1)
        {
            throw new RangeError('"x" must be a number between 0 and 1. ' + 'Got ' + x + ' instead.');
        }

        var t = this.getTForX(x, epsilon);
        return this.divideAtT(t);
    };

    __pCubicBezier.divideAtY = function (y, epsilon)
    {
        if (y < 0 || y > 1)
        {
            throw new RangeError('"y" must be a number between 0 and 1. ' + 'Got ' + y + ' instead.');
        }

        var t = this.getTForY(y, epsilon);
        return this.divideAtT(t);
    };

    __pCubicBezier.clone = function ()
    {
        return new nexacro._CubicBezier(this._p1.x, this._p1.y, this._p2.x, this._p2.y);
    };

    __pCubicBezier.toString = function ()
    {
        return "cubic-bezier(" + [this._p1.x, this._p1.y, this._p2.x, this._p2.y].join(", ") + ")";
    };

    __pCubicBezier.linear = function ()
    {
        return new nexacro._CubicBezier();
    };

    __pCubicBezier.ease = function ()
    {
        return new nexacro._CubicBezier(0.25, 0.1, 0.25, 1.0);
    };
    __pCubicBezier.linear = function ()
    {
        return new nexacro._CubicBezier(0.0, 0.0, 1.0, 1.0);
    };
    __pCubicBezier.easeIn = function ()
    {
        return new nexacro._CubicBezier(0.42, 0, 1.0, 1.0);
    };
    __pCubicBezier.easeOut = function ()
    {
        return new nexacro._CubicBezier(0, 0, 0.58, 1.0);
    };
    __pCubicBezier.easeInOut = function ()
    {
        return new nexacro._CubicBezier(0.42, 0, 0.58, 1.0);
    };

    //---------------------------------------------------------------------------------------
    // Environment 
    //---------------------------------------------------------------------------------------
    nexacro.EnvironmentUserHotkeyEventInfo = function (obj, id, alt_key, ctrl_key, shift_key, key_code, from_comp, from_refer_comp, meta_key, key_id)
    {
        this.id = this.eventid = id || "onenvironmentuserhotkeyevent";

        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;
        this.altkey = alt_key;
        this.ctrlkey = ctrl_key;
        this.shiftkey = shift_key;
        this.metakey = meta_key || false;
        this.keycode = key_code;
        this.keyid = key_id;
    };
    var _pEnvironmentUserHotkeyEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.EnvironmentUserHotkeyEventInfo);
    nexacro.EnvironmentUserHotkeyEventInfo.prototype = _pEnvironmentUserHotkeyEventInfo;
    _pEnvironmentUserHotkeyEventInfo._type_name = "EnvrionmentUserHotkeyEventInfo";

    nexacro.Environment = function ()
    {
        this._hotkey_list = []; // Hotkey 사용하는 Component와 Hotkey정보 리스트
        /* nexacro namespace로 이동해야됨. 연관된 작업이 많아 임시로 env에 저장 */

        this._load_manager = new nexacro._LoadManager(this);
        this._p_all = new nexacro.Collection();
        this._includescriptlist = [];

        this._rootcssclasslist = [];
    };

    var _pEnvironment = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.Environment);
    nexacro.Environment.prototype = _pEnvironment;
    _pEnvironment._type_name = "Environment";

    /* property */
    _pEnvironment._p_addcookietovariable = true;
    _pEnvironment._p_codepage = "";
    _pEnvironment._p_checkversion = false;
    _pEnvironment._p_version = "";

    _pEnvironment._p_enableevent = true;

    //accessibility Property
    _pEnvironment._p_enableaccessibility = false;
    _pEnvironment._p_accessibilitytype = "standard"; //standard/sensereader/jaws
    _pEnvironment._p_accessibilityreplayhotkey = "";
    _pEnvironment._p_accessibilitybackwardkey = "";
    _pEnvironment._p_accessibilityforwardkey = "";
    _pEnvironment._p_accessibilityhistorycount = 5;
    _pEnvironment._p_accessibilitywholereadhotkey = "";
    //_pEnvironment._p_accessibilityreplayhotkey = "";
    _pEnvironment._p_accessibilitywholereadtype = "none"; // none/load/change/loadchange
    _pEnvironment._p_accessibilitydescreadtype = "label"; //multienum - label/action/description
    _pEnvironment._p_accessibilityfirstovermessage = ""; //
    _pEnvironment._p_accessibilitylastovermessage = "";
    _pEnvironment._p_accessibilityheadingnexthotkey = "";
    _pEnvironment._p_accessibilityheadingprevhotkey = "";
    _pEnvironment._p_accessibilitycontentsearchkey = false; // component searching by nexacro

    _pEnvironment._p_tabkeycirculation = "form,cycle";


    _pEnvironment._p_enabletouchevent = false;
    _pEnvironment._p_enableinspector = false;
    _pEnvironment._p_filesecurelevel = "private";    //  all, private (default)
    _pEnvironment._p_highcontrastthemeid = "";
    _pEnvironment._p_httpretry = 0;
    _pEnvironment._p_httptimeout = 60;
    _pEnvironment._p_imepastemode = 0;
    _pEnvironment._p_initvaluefileid = "";
    _pEnvironment._p_key = "";
    _pEnvironment._p_language = "";   //미구현
    _pEnvironment._p_usestringresource = false;
    _pEnvironment._p_layoutselecttype = "";  //미구현
    _pEnvironment._p_loadingimage = "";
    _pEnvironment._p_locale = "";
    _pEnvironment._p_loglevel = "debug";
    _pEnvironment._p_mousewheeltype = 0;
    _pEnvironment._p_networksecurelevel = "private";      //  0:all, 1:private (default)
    _pEnvironment._p_popuptype = ""; //미구현
    _pEnvironment._p_proxyretry = 0;
    _pEnvironment._p_proxytimeout = 30;
    _pEnvironment._p_services = new nexacro.Collection();
    _pEnvironment._p_externals = new nexacro.Collection();
    _pEnvironment._p_templates = new nexacro.Collection();
    _pEnvironment._p_themeid = "";
    _pEnvironment._p_traceduration = -1;
    _pEnvironment._p_tracemode = "none";
    _pEnvironment._p_datasetloadtype = "onsuccess";

    _pEnvironment.updates = null;
    _pEnvironment._p_usecontextmenu = "all";
    _pEnvironment._p_usehttpkeepalive = false;
    _pEnvironment._p_useproxykeepalive = false;
    _pEnvironment._p_usewaitcursor = true;
    _pEnvironment._p_scrollbarsize = undefined;
    _pEnvironment._p_scrollbartype = undefined;
    _pEnvironment._p_scrollindicatorsize = undefined;

    _pEnvironment._p_rtl = undefined;	// true/false
    _pEnvironment._p_enablescreencapture = true;
    _pEnvironment._p_enablecookie = true;
    _pEnvironment._p_enablecache = true;
    _pEnvironment._p_enableclipboard = true;
    _pEnvironment._p_name = "environment";
    _pEnvironment.id = "environment";
    _pEnvironment._p_mousehovertime = 500;

    _pEnvironment._p_datatyperule = "1.0";

    _pEnvironment._p_datasetsavenan = "exclude";               // include/exclude
    _pEnvironment._p_datasetsaveinfinity = "include";          // include/exclude
    _pEnvironment._p_datasetsaveinvaliddate = "exclude";       // include/exclude

    _pEnvironment._p_ssvunitseparator = "";                    //default 0x1f
    _pEnvironment._p_ssvrecordseparator = "";                  //default 0x1e
    _pEnvironment._p_userhotkey = "";

    _pEnvironment._p_multivalueseparator = "";
    _pEnvironment._p_stringresourceserviceurl = "";

    _pEnvironment._p_usesoftkeyboard = true;
    _pEnvironment._p_enabletouchsoftkeyboard = false;

    _pEnvironment._p_licenseurl = "";
    _pEnvironment._p_preventbrowserbackbutton = false;
    _pEnvironment._p_browserreloadkey = "custom";  //prevent, reloadactiveform, custom (default)

    _pEnvironment._p_usesanitizer = false;
    _pEnvironment._p_allowtags = "initial";
    _pEnvironment._p_blocktags = "";
    _pEnvironment._p_allowattributes = "initial";
    _pEnvironment._p_blockattributes = "";
    _pEnvironment._p_webviewallowedsandbox = "";

    //internal     
    nexacro._default_loadingimage = "./images/waitimage.gif";
    nexacro._httptimeout = 60;  //-> 초기값
    nexacro._quickview_mode = false;
    nexacro._viewtoollog = false;

    /* init internal prop */
    _pEnvironment._resource_path = "";      // nexacro._resource_path 삭제    
    _pEnvironment._device_adaptor_list = {};
    _pEnvironment._device_adaptor_handlelist = {};
    _pEnvironment._userhotkey_list = {};
    _pEnvironment._userhotkeylist = {};
    _pEnvironment._tabkeycirculation = 0;    // nexacro._tabkeycirculation 삭제
    _pEnvironment._loglevel = 4;             //nexacro._loglevel 삭제
    _pEnvironment._use_translate_scroll = 1;  // use in _pEnvironment._p_enableaccessibility 
    _pEnvironment._a11ytype = 0;   //1:standard, 2:sensereader, 3:jaws, 4:voiceover(ios), 5:talkback(android)
    _pEnvironment._a11ydescreadtype = 0x01;  // _p_accessibilitydescreadtype
    _pEnvironment._a11ywholereadtype = 0;    //_p_accessibilitywholereadhotkey
    _pEnvironment._a11yHistoryList = null;
    _pEnvironment._a11yHistoryCursor = -1;
    _pEnvironment._curthemeid = "";          //nexacro._curthemeid 삭제
    _pEnvironment._initvaluefileid = "";     //nexacro._initvaluefileid 삭제
    _pEnvironment._stringrcfileid = "";      //nexacro._stringrcfileid 삭제 
    _pEnvironment._localcache_path = "";     //nexacro._localcache_path 삭제
    _pEnvironment._zoom_factor = 0;
    _pEnvironment._allow_default_pinchzoom = false;
    _pEnvironment._desktopscreenwidth = 1280;
    _pEnvironment._registerclass = undefined;   //from nexacro._registerclass 
    _pEnvironment._rtl = undefined;          //nexacro._rtl 삭제 , locale 도 반영

    /* event list */
    _pEnvironment._event_list =
    {
        "onerror": 1,
        "onaccessibilitykey": 1,
        "onload": 1,
        "onextendedcommand": 1,
        "ondevicepermission": 1,
        "onuserhotkey": 1,
        "onbeforepopstate": 1,
        "onpopstate": 1,
        "oninit": 1,
        "onpressedreloadkey": 1
    };


    //===============================================================
    // nexacro.Environment : Create & Update
    //===============================================================
    _pEnvironment.create = function ()
    {

    };

    _pEnvironment.set_tabkeycirculation = function (v)
    {
        if (this._p_tabkeycirculation != v)
        {
            switch (v)
            {
                case "form,nocycle":
                    this._tabkeycirculation = 1;
                    this._p_tabkeycirculation = v;
                    break;
                case "frame,cycle":
                    this._tabkeycirculation = 2;
                    this._p_tabkeycirculation = v;
                    break;
                case "frame,nocycle":
                    this._tabkeycirculation = 3;
                    this._p_tabkeycirculation = v;
                    break;
                default:
                    this._tabkeycirculation = 0;
                    this._p_tabkeycirculation = "form,cycle";
                    break;
            }
        }
    };

    _pEnvironment.set_rtl = function (v) 
    {
        this._p_rtl = v;
        this._rtl = nexacro._toBoolean(v);
    };

    _pEnvironment.set_webviewallowedsandbox = function (v)
    {
        this._p_webviewallowedsandbox = nexacro._toString(v).replace(/,/g, " "); //Tool에서 입력받는 경우 콤마로 구분되어 들어옴.
    };

    _pEnvironment.set_rootcssclass = function (v) 
    {
        if (this._p_rootcssclass != v)
        {
            const rootcssclass = this._p_rootcssclass = nexacro._toString(v);
            if (rootcssclass)
                this._rootcssclasslist = rootcssclass.trim().split(",");
            else
                this._rootcssclasslist = [];

            nexacro._setRootNodeClassName();
        }
    };

    _pEnvironment.set_enableinspector = function (v)
    {
        this._p_enableinspector = nexacro._toBoolean(v);
        nexacro._setEnableInspector(v);
    };

    _pEnvironment.set_enablescreencapture = function (v)
    {
        this._p_enablescreencapture = nexacro._toBoolean(v);
        nexacro._setEnableScreenCapture(v);
    };

    _pEnvironment.set_enablecookie = function (v)
    {
        this._p_enablecookie = nexacro._toBoolean(v);
        nexacro._setEnableCookie(v);
    };

    _pEnvironment.set_enablecache = function (v)
    {
        this._p_enablecache = nexacro._toBoolean(v);
        nexacro._setEnableCache(v);
    };

    _pEnvironment.set_enableclipboard = function (v)
    {
        this._p_enableclipboard = nexacro._toBoolean(v);
        nexacro._setEnableClipboard(v);
    };

    _pEnvironment.set_addcookietovariable = function (v)
    {
        v = nexacro._toBoolean(v);
        this._p_addcookietovariable = v;
        //nexacro._addcookietovariable = v;
    };

    _pEnvironment.set_codepage = function (v)
    {

    };

    _pEnvironment.set_enableevent = function (v)
    {
        this._p_enableevent = nexacro._toBoolean(v);
    };

    _pEnvironment.set_enabletouchevent = function (v)
    {
        this._p_enabletouchevent = nexacro._toBoolean(v);
        //nexacro._enabletouchevent = this._p_enabletouchevent;
    };

    _pEnvironment.set_filesecurelevel = function (v)
    {
        this._p_filesecurelevel = v;
        nexacro._setFileSecureLevel(v);
    };

    _pEnvironment.set_highcontrastthemeid = function (v)
    {
        this._p_highcontrastthemeid = v;
    };

    _pEnvironment.set_httpretry = function (v)
    {
        var httpretry = nexacro._parseInt(v);
        this._p_httpretry = (httpretry > 0) ? httpretry : 0;
    };

    _pEnvironment.set_httptimeout = function (v)
    {
        var timeout = nexacro._parseInt(v);
        this._p_httptimeout = (timeout >= 0) ? timeout : 60;
        nexacro._setHttpTimeout(this._p_httptimeout);
    };

    _pEnvironment.set_imepastemode = function (v)
    {
        this._p_imepastemode = v;
    };

    _pEnvironment.set_initvaluefileid = function (v)
    {
        // generation 시에 index.html popup.html, start.json 안에 포함함
        this._p_initvaluefileid = v;
    };

    _pEnvironment.set_key = function (v)
    {
        //Load 시 
        this._p_key = v;
    };

    _pEnvironment.set_mousehovertime = function (v)
    {
        this._p_mousehovertime = v;
        nexacro._setMouseHovertime(this._p_mousehovertime);
    };

    _pEnvironment.set_xadl = function (v)
    {
        //Load 시 
        this._p_xadl = v;
    };

    _pEnvironment.set_language = function (/*v*/)
    {

    };

    _pEnvironment.set_usestringresource = function (v)
    {
        v = nexacro._toBoolean(v);
        this._p_usestringresource = v;
    };

    _pEnvironment.set_stringresourceserviceurl = function (v)
    {
        this._p_stringresourceserviceurl = v;
    };


    _pEnvironment.set_layoutselecttype = function (v)
    {
        this._p_layoutselecttype = v;
    };


    _pEnvironment.set_loadingimage = function (v)
    {
        this._p_loadingimage = v;
    };

    _pEnvironment._on_loadwaitimage = function ()
    {
    };

    _pEnvironment.set_locale = function (v)
    {
        if (v != this._p_locale)
        {
            this._p_locale = v;
        }
    };



    //"fatal" : 치명적이 에러인 경우 - 0 
    //"error" : 일반적인 에러인 경우 - 1
    //"warn" : 경고인 경우          - 2
    //"info" : 일반 정보인 경우     - 3
    //"debug" : 디버그 정보인 경우  - 4
    _pEnvironment.set_loglevel = function (v)
    {
        if (v == "fatal")
            this._loglevel = 0;
        else if (v == "error")
            this._loglevel = 1;
        else if (v == "warn")
            this._loglevel = 2;
        else if (v == "info")
            this._loglevel = 3;
        else
            this._loglevel = 4;

        this._p_loglevel = v;

        nexacro._setLogLevel(this._loglevel);
    };

    _pEnvironment.set_mousewheeltype = function (v)
    {
        this._p_mousewheeltype = v;
    };

    _pEnvironment.set_networksecurelevel = function (v)
    {
        this._p_networksecurelevel = v;
        nexacro._setNetworkSecureLevel(v);
    };

    _pEnvironment.set_popuptype = function (v)
    {
        this._p_popuptype = v;
    };

    _pEnvironment.set_proxyretry = function (v)
    {
        this._p_proxyretry = nexacro._parseInt(v);
    };

    _pEnvironment.set_proxytimeout = function (v)
    {
        this._p_proxytimeout = nexacro._parseInt(v);
    };

    //논의 필요
    _pEnvironment.set_services = function (/*v*/)
    {

    };
    _pEnvironment.set_externals = function (/*v*/)
    {

    };

    _pEnvironment.set_themeid = function (v)
    {
        this._p_themeid = v;
    };

    _pEnvironment.set_traceduration = function (v)
    {
        var traceduration = this._p_traceduration;
        var val = nexacro._parseInt(v);

        if (traceduration != val)
        {
            this._p_traceduration = val;
            if (this._p_tracemode == "append" && val < 1)
            {
                nexacro._deleteTraceLogFile();
            }
        }
        nexacro._setTraceDuration(val);
    };

    //"none" : 로그 파일을 만들지 않습니다.
    //"new" : Application이 시작할때마다 로그 파일을 새로 만듭니다.
    //"append" : 기존에 있는 로그 파일에 추가합니다.
    _pEnvironment.set_tracemode = function (v)
    {
        var tracemode = this._p_tracemode;

        if (tracemode != v)
        {
            this._p_tracemode = v;
            // nexacro._tracemode = v;
            if (this._p_tracemode != "append")
            {
                //nexacro._deleteTraceLogFile();
            }
        }
        nexacro._setTraceMode(v);
    };

    //논의 필요
    _pEnvironment.set_updates = function (/*v*/)
    {

    };

    _pEnvironment.set_usecontextmenu = function (v)
    {
        this._p_usecontextmenu = v;
    };

    _pEnvironment.set_usehttpkeepalive = function (v)
    {
        v = nexacro._toBoolean(v);
        this._p_usehttpkeepalive = v;
        nexacro._setUseHttpKeepAlive(v);
    };

    _pEnvironment.set_useproxykeepalive = function (v)
    {
        this._p_useproxykeepalive = nexacro._toBoolean(v);
    };

    _pEnvironment.set_usewaitcursor = function (v)
    {
        this._p_usewaitcursor = nexacro._toBoolean(v);
    };

    _pEnvironment.set_scrollbarsize = function (v)
    {
        this._p_scrollbarsize = parseInt(v);
    };

    _pEnvironment.set_scrollindicatorsize = function (v)
    {
        this._p_scrollindicatorsize = parseInt(v);
    };

    _pEnvironment.set_scrollbartype = function (v)
    {
        this._p_scrollbartype = v;
    };

    _pEnvironment.set_userfontid = function (v)
    {
        if (!this._request_mainurl)
            this._p_userfontid = v;
    };

    //favicon for supported
    _pEnvironment.set_icon = function (v)
    {
        this._p_icon = v;
    };

    _pEnvironment.set_checkversion = function (v)
    {
        this._p_checkversion = nexacro._toBoolean(v);
    };

    _pEnvironment.set_csscollisionpreventkey = function (v)
    {
        this._p_csscollisionpreventkey = v;
    };

    _pEnvironment.set_version = function (v)
    {
        this._p_version = v;
    };

    _pEnvironment.set_datasetloadtype = function (v)
    {
        var type_enum = ["onsuccess", "errorallow"];

        if (v)
            v = v.toString().toLowerCase();

        if (type_enum.indexOf(v) >= 0)
            this._p_datasetloadtype = v;
    };

    /* 클로저를 통해 running 시에 1회만 setting 되도록 수정 */
    _pEnvironment.set_datatyperule = (function ()
    {
        let isSet = false;
        return function (v)
        {
            if (isSet && !nexacro._isDesignMode())
                return;
            if (v)
            {
                var type_enum = ["1.0", "2.0"];
                if (type_enum.indexOf(v) >= 0)
                {
                    this._p_datatyperule = nexacro._toString(v);

                    this.on_apply_datatyperule();

                    if (!nexacro._isDesignMode())
                    {
                        isSet = true; // 디자인 모드가 아닐 때만 설정 완료로 상태 업데이트
                    }
                }

            }
        };
    })();

    /*_pEnvironment.set_datatyperule = function (v)
    {
        if (nexacro._is_loaded_application)
            return;
    
        if (v)
        {
            nexacro._datatyperule = this._p_datatyperule = nexacro._toString(v);
            this.on_apply_datatyperule();
        }
    };*/

    _pEnvironment.on_apply_datatyperule = function ()
    {
        var v = this._p_datatyperule;
        switch (v)
        {
            case "2.0":
                nexacro.DataUtils = nexacro.DataUtilsSet["2.0"];
                break;
            default:
                nexacro.DataUtils = nexacro.DataUtilsSet["1.0"];
                break;
        }
    };

    _pEnvironment.set_datasetsavenan = function (v)
    {
        if (!v) return;

        var type_enum = ["exclude", "include"];

        v = v.toString().toLowerCase();

        if (type_enum.indexOf(v) >= 0)
            this._p_datasetsavenan = v;

    };

    _pEnvironment.set_datasetsaveinfinity = function (v)
    {
        if (!v) return;

        var type_enum = ["exclude", "include"];

        v = v.toString().toLowerCase();

        if (type_enum.indexOf(v) >= 0)
            this._p_datasetsaveinfinity = v;
    };

    _pEnvironment.set_datasetsaveinvaliddate = function (v)
    {
        if (!v) return;

        var type_enum = ["exclude", "include"];

        v = v.toString().toLowerCase();

        if (type_enum.indexOf(v) >= 0)
            this._p_datasetsaveinvaliddate = v;
    };

    _pEnvironment.set_ssvunitseparator = function (v)
    {
        if (!v) return;

        var ar = v.split(",");
        var arlen = ar.length;
        var pattern1 = /^(0|3|29|40|41|58|61)$/g;
        var n, j;

        if (nexacro._isArray(ar))
        {
            for (j = 0; j < arlen; j++)
            {
                n = parseInt(ar[j].trim());
                if (pattern1.test(n) || n >= 0x80 || n <= 0)
                    return nexacro._onSystemWarning(nexacro._environment, "range_invalide");
            }
        }
        else
        {
            n = parseInt(ar);
            if (pattern1.test(n) || n >= 0x80 || n <= 0)
                return nexacro._onSystemWarning(nexacro._environment, "range_invalide");
        }

        this._p_ssvunitseparator = v;
        nexacro._setSSVUnitTokenSeparator(nexacro._getSSVUnitSeparator()); // runtime only
    };

    _pEnvironment.set_ssvrecordseparator = function (v)
    {
        if (!v) return;

        var ar = v.split(",");
        var arlen = ar.length;
        var pattern1 = /^(0|3|29|72|72|90|93)$/g;
        var n, j;

        if (nexacro._isArray(ar))
        {
            for (j = 0; j < arlen; j++)
            {
                n = parseInt(ar[j].trim());
                if (pattern1.test(n) || n >= 0x80 || n <= 0)
                    return nexacro._onSystemWarning(nexacro._environment, "range_invalide");
            }
        }
        else
        {
            n = parseInt(ar);
            if (pattern1.test(n) || n >= 0x80 || n <= 0)
                return nexacro._onSystemWarning(nexacro._environment, "range_invalide");
        }

        this._p_ssvrecordseparator = v;
        nexacro._setSSVRecordTokenSeparator(nexacro._getSSVRecordSeparator()); // runtime only
    };

    _pEnvironment.set_userhotkey = function (v)
    {
        this._unregisterUserHotkey();

        if (v)
        {
            var ar_temp = [];

            v = v.toString();
            var ar = v.split(",");
            for (var i = 0; i < ar.length; i++)
            {
                var ar_iduserhotkey = ar[i].split("=");
                if (ar_iduserhotkey.length < 2)
                    continue;

                var propid = ar_iduserhotkey[0].trim();
                var propuserhotkey = ar_iduserhotkey[1].trim();

                var userhotkey = new nexacro._HotKey(propuserhotkey);

                if (propid && !userhotkey._isEmpty())
                    this._registerUserHotkey(propid, userhotkey);
            }

            for (var id in this._userhotkeylist)
            {
                var str_userhotkey = this._userhotkeylist[id]._toString();
                ar_temp.push(id + "=" + str_userhotkey);
            }

            this._p_userhotkey = ar_temp.join();
        }
    };

    _pEnvironment.set_usesoftkeyboard = function (v)
    {
        v = nexacro._toBoolean(v);
        if (v != this._p_usesoftkeyboard)
        {
            this._p_usesoftkeyboard = v;
        }
    };

    _pEnvironment.set_enabletouchsoftkeyboard = function (v)
    {
        v = nexacro._toBoolean(v);
        if (v != this._p_enabletouchsoftkeyboard)
        {
            this._p_enabletouchsoftkeyboard = v;
        }
    };

    _pEnvironment.set_licenseurl = function (v)
    {
        this._p_licenseurl = v;
    };


    _pEnvironment.set_preventbrowserbackbutton = function (v)
    {
        v = nexacro._toBoolean(v);
        if (v != this._p_preventbrowserbackbutton)
            this._p_preventbrowserbackbutton = v;
    };

    _pEnvironment.set_browserreloadkey = function (v)
    {
        if (!v) return;

        var type_enum = ["prevent", "reloadactiveform", "custom"];

        v = v.toString().toLowerCase();
        if (type_enum.indexOf(v) >= 0)
            this._p_browserreloadkey = v;
    };
    _pEnvironment.set_usesanitizer = function (v)
    {
        if (!v) return;
        v = nexacro._toBoolean(v);
        this._p_usesanitizer = v;
    };
    _pEnvironment.set_allowtags = function (v)
    {
        if (!v) return;
        v = v.toString().toLowerCase();
        this._p_allowtags = v;

    };
    _pEnvironment.set_blocktags = function (v)
    {
        if (!v) return;
        v = v.toString().toLowerCase();
        this._p_blocktags = v;
    };

    _pEnvironment.set_allowattributes = function (v)
    {
        if (!v) return;
        v = v.toString().toLowerCase();
        this._p_allowattributes = v;
    };
    _pEnvironment.set_blockattributes = function (v)
    {
        if (!v) return;
        v = v.toString().toLowerCase();
        this._p_blockattributes = v;
    };


    _pEnvironment._registerUserHotkey = function (id, userhotkey)
    {
        if (!id || !userhotkey || userhotkey._is_registered)
            return;

        for (var _id in this._userhotkeylist)
        {
            var _userhotkey = this._userhotkeylist[_id];
            if (id == _id || (userhotkey._keycode == _userhotkey._keycode && userhotkey._modifierkey == _userhotkey._modifierkey))
                return;
        }

        var userhotkeyinfo = {
            keycode: userhotkey._keycode,
            altkey: (userhotkey._modifierkey & 0x02) == 0x02,
            ctrlkey: (userhotkey._modifierkey & 0x01) == 0x01,
            shiftkey: (userhotkey._modifierkey & 0x04) == 0x04
        };

        this._userhotkey_list[id] = userhotkeyinfo;
        this._userhotkeylist[id] = userhotkey;

        userhotkey._is_registered = true;
    };

    _pEnvironment._unregisterUserHotkey = function ()
    {
        var userhotkey_list = this._userhotkey_list;
        var userhotkeylist = this._userhotkeylist;

        for (var propid in userhotkey_list)
        {
            delete userhotkey_list[propid];
            delete userhotkeylist[propid];
        }

        this._p_userhotkey = "";
    };

    _pEnvironment._processUserHotkey = function (keycode, altKey, ctrlKey, shiftKey, metaKey)
    {
        var userhotkeylist = this._userhotkey_list;
        for (var propid in userhotkeylist)
        {
            var userhotkeyinfo = userhotkeylist[propid];
            if (userhotkeyinfo.keycode == keycode &&
                userhotkeyinfo.altkey == altKey &&
                userhotkeyinfo.ctrlkey == ctrlKey &&
                userhotkeyinfo.shiftkey == shiftKey)
            {
                this.on_fire_onuserhotkey(keycode, altKey, ctrlKey, shiftKey, this, this, metaKey, propid);
                return true;
            }
        }
    };

    _pEnvironment.set_multivalueseparator = function (v)
    {
        this._p_multivalueseparator = v;
    };

    //// 호출 시점에 대한 논의가 필요함
    ////현재는 mainwindow 생성시에 등록하도록 함
    // nexacro._registerClass 함수로 변경
    // _pEnvironment._registerClass = function (_jsContext, _nexacro)
    // {
    //     if (!_nexacro)
    //         _nexacro = nexacro;

    //     var registerclass = this._registerclass;
    //     var len = registerclass.length;
    //     for (var i = 0; i < len; i++)
    //     {
    //         var item = registerclass[i];
    //         if (item && !_jsContext[item.id])
    //         {
    //             _jsContext[item.id] = _nexacro._executeGlobalEvalStr(item.classname);
    //         }
    //     }
    // };

    _pEnvironment._getRegisterClass = function ()
    {
        return this._registerclass;
    };


    _pEnvironment._setCurrentScreen = function (screeninfo)
    {
        this._curscreen = screeninfo;

        this._curscreenid = screeninfo.id ? screeninfo.id : "";
        this._curscreentype = screeninfo.type;
        this._curscreenzoomfactortype = screeninfo.zoomfactortype ? screeninfo.zoomfactortype : "portrait";
        this._allow_default_pinchzoom = screeninfo._allow_default_pinchzoom;
        this._zoom_factor = screeninfo._zoom_factor;


        // screeninfo 내의 env property는 env 로 적용한다. 
        /*
        for (var prop in screeninfo)
        {
            if (this["set_" + prop])
                this["set_" + prop](screeninfo[prop]);
        } */
    };

    _pEnvironment._applyScreenProp = function ()
    {
        var screeninfo = this._curscreen;

        // screeninfo 내의 env property는 env 로 적용한다. 
        for (var prop in screeninfo)
        {
            if (screeninfo.hasOwnProperty(prop))
            {
                if (prop == "id")
                    continue;
                if (this["set_" + prop])
                    this["set_" + prop](screeninfo[prop]);
            }
        }

        if (this._rtl === undefined)
        {
            var _locale_info = nexacro.Locale.getLocaleInfo(this._p_locale);
            this._rtl = _locale_info.direction == "rtl";
        }
        else if (!this._rtl)
        {
            this._rtl = false;
        }

        this._curscreen = null;
        delete this._curscreen;
    };

    _pEnvironment.init = function ()
    {
        /*if (nexacro.__APPLOADER_BASE_PATH__)
        {
            nexacro._component_uri = nexacro._component_uri.replace("./", nexacro.__APPLOADER_BASE_PATH__);
            nexacro._theme_uri = nexacro._theme_uri.replace("./", nexacro.__APPLOADER_BASE_PATH__);
        }*/
        nexacro._initializeGlobalObjects(_global_context);
        nexacro._registerClass(this._registerclass, _global_context);
        //this._registerClass(_global_context);

        var component_uri = nexacro._component_uri;
        if (component_uri)
        {
            this._resource_path = nexacro._transfullurl(component_uri, "../resources/");
        }

        this.on_init();
        this._applyScreenProp();
    };



    ///////////////////////////////// Start accessibility //////////////////////////////////

    _pEnvironment.set_enableaccessibility = function (v)
    {
        var enablea11y = nexacro._toBoolean(v);
        if (enablea11y == this._p_enableaccessibility)
            return;
        this._p_enableaccessibility = enablea11y;
        if (this._p_enableaccessibility === true)
        {
            if (this._a11yHistoryList == null)
                this._a11yHistoryList = [];

            this.on_fire_onaccessibility("", this, this);
        }
        else
        {
            this._a11yHistoryList = null;
        }

        nexacro._setEnableAccessibility(this, v);


        if (enablea11y && !nexacro._a11y_module_loaded)
        {
            nexacro._onSystemWarning(this, "native_require_add_module_accessibility");
        }
    };

    _pEnvironment.set_accessibilitytype = function (v)
    { //standard/sensereader/jaws
        this._p_accessibilitytype = v;
        nexacro._setAccessibilityType(this, v);
    };

    _pEnvironment.set_accessibilityreplayhotkey = function (v)
    {
        var cur_a11yreplayhotkey = this._a11yreplayhotkey;
        if (cur_a11yreplayhotkey)
            this._unregisterHotkey(cur_a11yreplayhotkey);
        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this._p_accessibilityreplayhotkey = "";
            this._a11yreplayhotkey = null;
        }
        else
        {
            this._p_accessibilityreplayhotkey = hotkey._toString();
            this._a11yreplayhotkey = hotkey;

            this._registerHotkey(hotkey);
        }
    };

    _pEnvironment.set_accessibilitybackwardkey = function (v)
    {
        var cur_a11ybackwardkey = this._a11ybackwardkey;
        if (cur_a11ybackwardkey)
            this._unregisterHotkey(cur_a11ybackwardkey);
        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this._p_accessibilitybackwardkey = null;
            this._a11ybackwardkey = null;
        }
        else
        {
            this._p_accessibilitybackwardkey = hotkey._toString();
            this._a11ybackwardkey = hotkey;

            this._registerHotkey(hotkey);
        }
    };

    _pEnvironment.set_accessibilityforwardkey = function (v)
    {
        var cur_a11yforwardkey = this._a11yforwardkey;
        if (cur_a11yforwardkey)
            this._unregisterHotkey(cur_a11yforwardkey);
        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this._p_accessibilityforwardkey = null;
            this._a11yforwardkey = null;
        }
        else
        {
            this._p_accessibilityforwardkey = hotkey._toString();
            this._a11yforwardkey = hotkey;
            this._registerHotkey(hotkey);
        }
    };

    _pEnvironment.set_accessibilityhistorycount = function (v)
    {
        v = parseInt(v);
        if (isNaN(v) || v < 0)
            v = 0;

        this._p_accessibilityhistorycount = v;
        var historylist = this._a11yHistoryList;
        if (historylist)
        {
            var len = historylist.length;
            if (len > v)
            {
                while (len-- > v)
                    historylist.shift();

                this._a11yHistoryCursor = v - 1;
            }
        }
    };

    _pEnvironment.set_accessibilitywholereadhotkey = function (v)
    {
        var cur_a11ywholereadhotkey = this._a11ywholereadtype;
        if (cur_a11ywholereadhotkey)
            this._unregisterHotkey(cur_a11ywholereadhotkey);
        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this._p_accessibilitywholereadhotkey = "";
            this._a11ywholereadtype = null;
        }
        else
        {
            this._p_accessibilitywholereadhotkey = hotkey._toString();
            this._a11ywholereadtype = hotkey;

            this._registerHotkey(hotkey);
        }
    };

    _pEnvironment.set_accessibilitywholereadtype = function (v)
    {
        this._p_accessibilitywholereadtype = v;
        nexacro._setAccessibilityWholeReadType(this, v);
    };

    _pEnvironment.set_accessibilitycontentsearchkey = function (v)
    {
        this._p_accessibilitycontentsearchkey = v;
        nexacro._setAccessibilityContentSearchKey(v);
    };

    _pEnvironment.set_accessibilitydescreadtype = function (v)
    {
        this._p_accessibilitydescreadtype = v;
        nexacro._setAccessibilityDescReadType(this, v);
    };

    _pEnvironment.set_accessibilityfirstovermessage = function (v)
    {
        this._p_accessibilityfirstovermessage = v;
    };

    _pEnvironment.set_accessibilitylastovermessage = function (v)
    {
        this._p_accessibilitylastovermessage = v;
    };

    _pEnvironment.set_accessibilityheadingnexthotkey = function (v)
    {
        var cur_a11yheadingnexthotkey = this._a11yheadingnexthotkey;
        if (cur_a11yheadingnexthotkey)
            this._unregisterHotkey(cur_a11yheadingnexthotkey);
        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this._p_accessibilityheadingnexthotkey = "";
            this._a11yheadingnexthotkey = null;
        }
        else
        {
            this._p_accessibilityheadingnexthotkey = hotkey._toString();
            this._a11yheadingnexthotkey = hotkey;
            this._registerHotkey(hotkey);
        }
    };

    _pEnvironment.set_accessibilityheadingprevhotkey = function (v)
    {
        var cur_a11yheadingprevhotkey = this._a11yheadingprevhotkey;
        if (cur_a11yheadingprevhotkey)
            this._unregisterHotkey(cur_a11yheadingprevhotkey);
        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this._p_accessibilityheadingprevhotkey = "";
            this._a11yheadingprevhotkey = null;
        }
        else
        {
            this._p_accessibilityheadingprevhotkey = hotkey._toString();
            this._a11yheadingprevhotkey = hotkey;
            this._registerHotkey(hotkey);
        }
    };

    _pEnvironment.set_accessibilitycomponentnexthotkey = function (v)
    {
        var cur_a11ycomponentnexthotkey = this._a11ycomponentnexthotkey;
        if (cur_a11ycomponentnexthotkey)
            this._unregisterHotkey(cur_a11ycomponentnexthotkey);
        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this._p_accessibilitycomponentnexthotkey = "";
            this._a11ycomponentnexthotkey = null;
        }
        else
        {
            this._p_accessibilitycomponentnexthotkey = hotkey._toString();
            this._a11ycomponentnexthotkey = hotkey;
            this._registerHotkey(hotkey);
        }
    };

    _pEnvironment.set_accessibilitycomponentprevhotkey = function (v)
    {
        var cur_a11ycomponentprevhotkey = this._a11ycomponentprevhotkey;
        if (cur_a11ycomponentprevhotkey)
            this._unregisterHotkey(cur_a11ycomponentprevhotkey);
        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this._p_accessibilitycomponentprevhotkey = "";
            this._a11ycomponentprevhotkey = null;
        }
        else
        {
            this._p_accessibilitycomponentprevhotkey = hotkey._toString();
            this._a11ycomponentprevhotkey = hotkey;
            this._registerHotkey(hotkey);
        }
    };

    _pEnvironment._registerHotkey = function (v)
    {
        if (!v || v._is_registered)
            return;

        nexacro._registerHotkeyComp(this, this, v);
    };

    _pEnvironment._unregisterHotkey = function (v)
    {
        if (!v || !v._is_registered)
            return;
        nexacro._unregisterHotkeyComp(this, this, v);
    };

    _pEnvironment._processHotkey = function (keycode, altKey, ctrlKey, shiftKey, comp)
    {
        var hotkeylist = this._hotkey_list;
        for (var i = 0; i < hotkeylist.length; i++)
        {
            var hotkeyinfo = hotkeylist[i];
            if (hotkeyinfo[1] == keycode &&
                hotkeyinfo[2] == altKey &&
                hotkeyinfo[3] == ctrlKey &&
                hotkeyinfo[4] == shiftKey)
            {
                this._on_hotkey(keycode, altKey, ctrlKey, shiftKey, comp);
                return true;
            }
        }
    };

    _pEnvironment._on_hotkey = function (keycode, altKey, ctrlKey, shiftKey, curcomp)
    {
        if (this._p_enableaccessibility)
        {
            var forwardkey = this._a11yforwardkey;
            var backwardkey = this._a11ybackwardkey;
            var replayhotkey = this._a11yreplayhotkey;
            var wholereadhotkey = this._a11ywholereadhotkey;
            var headingnexthotkey = this._a11yheadingnexthotkey;
            var headingprevhotkey = this._a11yheadingprevhotkey;
            var componentnexthotkey = this._a11ycomponentnexthotkey;
            var componentprevhotkey = this._a11ycomponentprevhotkey;

            var comp, readcursor, form, lastfocus_comp, last_comp;
            if (forwardkey && keycode == forwardkey._keycode &&
                altKey == ((forwardkey._modifierkey & 0x02) == 0x02) &&
                ctrlKey == ((forwardkey._modifierkey & 0x01) == 0x01) &&
                shiftKey == ((forwardkey._modifierkey & 0x04) == 0x04))
            {
                readcursor = this._a11yHistoryCursor + 1;
                if (readcursor >= this._a11yHistoryList.length)
                    readcursor = this._a11yHistoryCursor = this._a11yHistoryList.length - 1;
                else
                    this._a11yHistoryCursor = readcursor;

                comp = this._get_accessibility_history(readcursor);
                if (comp)
                    this.playAccessibility(comp);
            }
            else if (backwardkey && keycode == backwardkey._keycode &&
                altKey == ((backwardkey._modifierkey & 0x02) == 0x02) &&
                ctrlKey == ((backwardkey._modifierkey & 0x01) == 0x01) &&
                shiftKey == ((backwardkey._modifierkey & 0x04) == 0x04))
            {


                readcursor = this._a11yHistoryCursor - 1;
                if (readcursor < 0)
                    readcursor = this._a11yHistoryCursor = 0;
                else
                    this._a11yHistoryCursor = readcursor;

                comp = this._get_accessibility_history(readcursor);
                if (comp)
                    this.playAccessibility(comp);

            }
            else if (replayhotkey && keycode == replayhotkey._keycode &&
                altKey == ((replayhotkey._modifierkey & 0x02) == 0x02) &&
                ctrlKey == ((replayhotkey._modifierkey & 0x01) == 0x01) &&
                shiftKey == ((replayhotkey._modifierkey & 0x04) == 0x04))
            {
                comp = this._get_accessibility_history(this._a11yHistoryCursor);
                if (comp)
                    this.playAccessibility(comp);
            }
            else if (wholereadhotkey && keycode == wholereadhotkey._keycode &&
                altKey == ((wholereadhotkey._modifierkey & 0x02) == 0x02) &&
                ctrlKey == ((wholereadhotkey._modifierkey & 0x01) == 0x01) &&
                shiftKey == ((wholereadhotkey._modifierkey & 0x04) == 0x04))
            {
                //todo whole read hotkey 
                if (this._a11ywholereadtype !== 0)
                {
                    //var ar = this._a11yHistoryList;
                    lastfocus_comp = this._get_accessibility_history(this._a11yHistoryList.length - 1);
                    form = lastfocus_comp._getForm();
                    form._playAccessibilityWholeReadLabel("wholeread");
                }
            }
            else if (headingnexthotkey && keycode == headingnexthotkey._keycode &&
                altKey == ((headingnexthotkey._modifierkey & 0x02) == 0x02) &&
                ctrlKey == ((headingnexthotkey._modifierkey & 0x01) == 0x01) &&
                shiftKey == ((headingnexthotkey._modifierkey & 0x04) == 0x04))
            {
                form = curcomp._getForm();
                lastfocus_comp = form._last_focused;
                comp = form._getNextHeadingComponent(lastfocus_comp);
                if (comp)
                    comp._setFocus(true, 2, true);
            }
            else if (headingprevhotkey && keycode == headingprevhotkey._keycode &&
                altKey == ((headingprevhotkey._modifierkey & 0x02) == 0x02) &&
                ctrlKey == ((headingprevhotkey._modifierkey & 0x01) == 0x01) &&
                shiftKey == ((headingprevhotkey._modifierkey & 0x04) == 0x04))
            {
                form = curcomp._getForm();
                lastfocus_comp = form._last_focused;
                comp = form._getPrevHeadingComponent(lastfocus_comp);
                if (comp)
                    comp._setFocus(true, 3, true);
            }
            else if (componentnexthotkey && keycode == componentnexthotkey._keycode &&
                altKey == ((componentnexthotkey._modifierkey & 0x02) == 0x02) &&
                ctrlKey == ((componentnexthotkey._modifierkey & 0x01) == 0x01) &&
                shiftKey == ((componentnexthotkey._modifierkey & 0x04) == 0x04))
            {
                form = curcomp._getForm();
                if (form instanceof nexacro.Tab)
                    form = form._getForm();
                last_comp = form._getLastFocused();
                comp = form._searchNextTabFocus(last_comp ? last_comp : form, undefined, undefined, 2);
                if (comp && comp[0])
                    form._processArrowKey(true, comp);
            }
            else if (componentprevhotkey && keycode == componentprevhotkey._keycode &&
                altKey == ((componentprevhotkey._modifierkey & 0x02) == 0x02) &&
                ctrlKey == ((componentprevhotkey._modifierkey & 0x01) == 0x01) &&
                shiftKey == ((componentprevhotkey._modifierkey & 0x04) == 0x04))
            {
                form = curcomp._getForm();
                if (form instanceof nexacro.Tab)
                    form = form._getForm();
                last_comp = form._getLastFocused();
                comp = form._searchPrevTabFocus(last_comp ? last_comp : form, undefined, undefined, 2);
                if (comp && comp[0])
                    form._processArrowKey(false, comp);
            }
        }
    };

    _pEnvironment._set_accessibility_history = function (comp, evt_name)
    {
        if (!comp)
            return;

        if (comp._is_frame || comp._is_form)
            return;

        var historyList = this._a11yHistoryList;
        var historyCount, currentCount, lasthistorycomp;
        if (historyList)
        {
            historyCount = this._p_accessibilityhistorycount;
            currentCount = historyList.length;

            if (currentCount > 0)
            {
                lasthistorycomp = historyList[currentCount - 1];
                if (lasthistorycomp == comp)
                    return;
            }

            if (evt_name == "tabkey" || evt_name === "focus" || evt_name === undefined)
            {
                if (lasthistorycomp == comp.parent)
                {
                    historyList.splice(currentCount - 1, 1);
                    historyList.push(comp);

                    this._a11yHistoryCursor = currentCount;

                    return;
                }
            }

            if (currentCount < historyCount)
            {
                historyList.push(comp);
            }
            else
            {
                historyList.shift();
                historyList.push(comp);
                currentCount = historyList.length - 1;
            }

            this._a11yHistoryCursor = currentCount;
        }
    };

    _pEnvironment._get_accessibility_history = function (n, replay)
    {
        var historyList = this._a11yHistoryList;
        if (historyList)
        {
            var historyCount = this._p_accessibilityhistorycount;
            if (n > -1 && n <= historyCount)
            {
                return historyList[n];
            }
            else if (replay)
            {
                return historyList[n];
            }
        }
    };

    _pEnvironment._remove_accessibility_history = function (comp)
    {
        var historyList = this._a11yHistoryList;
        for (var i = 0, len = historyList.length; i < len; i++)
        {
            if (historyList[i] == comp)
            {
                historyList.splice(i, 1);
                if (i <= this._a11yHistoryCursor)
                    this._a11yHistoryCursor--;
            }
        }
    };


    _pEnvironment.playAccessibility = function (/*v*/)
    {//need to modify

        if (!nexacro._isDesktop())
            return;

        var len = arguments.length;

        if (len <= 0)
            return false;

        if (arguments[0] instanceof nexacro.Component)
        {
            var comp = arguments[0];
            comp._notifyAccessibility();
            return true;
        }
        else if ((typeof arguments[0]) == "string")
        {
            //var strLable = arguments[0];
            //var strDescript = arguments[1] ? arguments[1] : "";
            //var strValue = arguments[2] ? arguments[2] : "";

            //TODO

            return true;
        }

        return false;
    };

    /*
       comp 	       : 지정한 component 부터 하위로 검색 (MainFrame/ChildFrame/Form/Component 지정가능)		
       startcomp 	   : 지정한 component 부터 다음검색 (미지정시 처음부터)		
       findtext 	   : 찾고자 하는 text		
       label/desc/all : 검색대상 Accessilibity Object의 Property (label:lable, desc:description, all:label+description) 		
       next/prev	   : 지정한 startcomp로부터 검색방향 (next:동일 level next, prev:동일 level prev) 	
                        startcomp가 미지정이면, 지정한 component의 child 기준으로 next면 First Child, prev면 Last Child 부터 검색됨	
       child/all	   : 지정한 comp로부터 검색범위 (child:직속 하위 component/control, all:모든 하위 component/control) 	
                        지정한 component가 form 계열일 경우 child 검색은 component 단위까지로 제한됨	
       result	       : 검색된 Component, 복수일경우 첫번째를 리턴, 없으면 null		
       */
    _pEnvironment.findAccessibility = function (comp, startcomp, value, type, dir, depth)
    {
        if (!comp || !value) //|| !type  || !dir || !depth)
            return null;

        // combo,calendar,spin,chart는 하위 control검색
        // grid는 band/cell단위 검색
        // list,radio는 item단위 검색
        if (comp._findAccessibility)
            return comp._findAccessibility(comp, startcomp, value, type, dir, depth);

        if (depth == "child")
            depth = 2;
        else
            depth = -1; // infinite

        return this._findAccessibility(comp, startcomp, value, type, dir, depth);
    };

    // findAccessibility의 실제 검색 메소드
    // comp의 Child 레벨 부터 검색한다.
    _pEnvironment._findAccessibility = function (comp, startcomp, value, type, dir, depth, findfrom)
    {
        // Validation
        // 1:true / 0:false / -1:startcomp matched
        var _validation = function (obj, startcomp)
        {
            if (!obj._isVisible())
                return 0;
            if (obj == startcomp)
                return -1;
            //if (startcomp != null) // startcomp 지정시 startcomp 이전 검색대상은 모두 무시
            //    return 0;
            var label = obj.accessibilitylabel;
            var desc = obj.accessibilitydescription;
            if ((type == undefined || type == "all") && (label.toLowerCase().match(value) || desc.toLowerCase().match(value)))
                return 1;
            else if ((type == "label") && label.toLowerCase().match(value))
                return 1;
            else if ((type == "desc") && desc.toLowerCase().match(value))
                return 1;
            return 0;
        };

        // child로 검색한 경우 검색종료
        if (depth === 0)
            return null;
        depth = depth - 1;

        if (!findfrom)
            findfrom = comp;

        value = value.toLowerCase();

        // Find 로직을 각각의 컴포넌트에 코딩 할 필요가 있을지??
        var ret, index, child, child_list, child_length, i;
        if (comp instanceof nexacro.Mainframe)
        {
            ret = _validation(comp.frame, startcomp);
            if (ret == 1)
                return comp.frame;
            if (ret == -1)
                startcomp = null;

            return this._findAccessibility(comp.frame, startcomp, value, type, dir, depth);
        }
        else if (comp instanceof nexacro.FrameSet)
        {
            // TODO check 무슨 순서대로 검색해야 할지?
            child_list = comp.frames;
            if (!child_list)
                return null;

            child_length = child_list.length;
            i = 0;
            if (startcomp)
            {
                index = nexacro._indexOf(child_list, startcomp) + 1;
                if (index > 0)
                    i = index;
            }
            for (; i < child_length; i++)
            {
                child = (dir == "prev") ? child_list[child_length - 1 - i] : child_list[i];
                ret = _validation(child, startcomp);
                if (ret == 1)
                    return child;
                if (ret == -1)
                    startcomp = null;

                if (depth != 1)
                {
                    ret = this._findAccessibility(child, startcomp, value, type, dir, depth);
                    if (ret)
                        return ret;
                }
            }
        }
        else if (comp instanceof nexacro.ChildFrame)
        {
            ret = _validation(comp._p_form, startcomp);
            if (ret == 1)
                return comp._p_form;
            if (ret == -1)
                startcomp = null;

            return this._findAccessibility(comp._p_form, startcomp, value, type, dir, depth, findfrom);
        }
        else if (comp._hasContainer()) // form, div, Tab, tabpage, popupdiv?
        {
            // Form은 taborder순으로 검색함
            //var child_list = comp._child_list;
            child_list = comp._getComponentsByTaborder(comp, true);
            if (!child_list)
                return null;

            child_length = child_list.length;
            i = 0;
            if (startcomp)
            {
                index = nexacro._indexOf(child_list, startcomp) + 1;
                if (index > 0)
                    i = index;
            }
            for (; i < child_length; i++)
            {
                child = (dir == "prev") ? child_list[child_length - 1 - i] : child_list[i];
                ret = _validation(child, startcomp);
                if (ret == 1)
                    return child;
                //if (ret == -1)
                //    startcomp = null;

                if (depth != 1 && child._hasContainer())
                {
                    ret = this._findAccessibility(child, startcomp, value, type, dir, depth, findfrom);
                    if (ret)
                        return ret;
                }
            }
        }
        //else if (findfrom == comp)
        //{
        //    ;
        //    // TODO Component자신에서 시작된 경우 Control까지 검색
        //    // Control을 내부적으로 관리하는 기능 구현이 우선임.
        //}

        return null;
    };
    ///////////////////////////////// End accessibility //////////////////////////////////

    _pEnvironment.initEvent = function ()
    {
        this.on_initEvent();
    };

    _pEnvironment.loadVariables = function ()
    {
        this.on_loadVariables();
        this._addInitialVariable();   //nexacro.setInitialVariable ("environment", "cookie", "httpheader") 처리 
    };

    _pEnvironment._addInitialVariable = function ()
    {
        var variables, variable;
        if (nexacro._initenvvar)
        {
            variables = nexacro._initenvvar;
            for (variable in variables)
            {
                if (variables.hasOwnProperty(variable))
                {
                    nexacro.setEnvironmentVariable(variable, variables[variable]);
                }
            }

            nexacro._initenvvar = null;
            delete nexacro._initenvvar;
        }

        if (nexacro._initcookievar)
        {
            variables = nexacro._initcookievar;

            var expire;
            for (variable in variables)
            {
                if (variables.hasOwnProperty(variable))
                {
                    nexacro.setCookieVariable(variable, variables[variable], expire);
                }
            }
            nexacro._initcookievar = null;
            delete nexacro._initcookievar;
        }
        if (nexacro._inithttpvar)
        {
            variables = nexacro._inithttpvar;

            for (variable in variables)
            {
                if (variables.hasOwnProperty(variable))
                {
                    nexacro.setHTTPHeaderVariable(variable, variables[variable]);
                }
            }
            nexacro._inithttpvar = null;
            delete nexacro._inithttpvar;
        }

    };


    _pEnvironment._loadLoadingImage = function ()
    {
        var loadingimage = nexacro._getLoadingImageUrl();
        loadingimage = nexacro._getImageLocation(loadingimage);
        nexacro._getImageSize(loadingimage, this._on_loadwaitimage, this);
    };

    _pEnvironment.getDeviceAdaptor = function (deviceid)	
    {
        // deviceid에 해당하는 device object를 반환
        return this._device_adaptor_list[deviceid];
    }

    _pEnvironment._loadDeviceAdaptors = function ()
    {
        //_deviceList에 있는 device들의 library를 로드함.
        this.on_loadDeviceAdaptors();
    };

    _pEnvironment.on_loadDeviceAdaptors = nexacro._emptyFn;

    _pEnvironment._load = function (project_path)
    {
        this.loadTypeDefinition();
        this._loadDeviceAdaptors();
        this.init();

        this._makeProjectPathinfo(this._p_xadl, nexacro._typedefinition_url, project_path);
        this._makeDesignPathinfo(this._p_themeid, this._p_highcontrastthemeid, this._p_initvaluefileid);
        this._makeStringResourcePathinfo(this._p_usestringresource, this._p_stringresourceserviceurl);

        if (this._p_icon)
            nexacro._setApplicationIcon(this._p_icon);

        this.loadVariables();
        this._loadExternals();
        this._executeScript(this);
        this.initEvent();

        this.on_fire_onload();

    };


    _pEnvironment._loadExternals = async function ()
    {

        const itemtask = async (item) =>
        {
            return new Promise((resolve, reject) =>
            {
                (async () => 
                {
                    let result;
                    try
                    {
                        if (item.loadtype == "prefetch")
                            result = await nexacro._fetchExtResource(item);
                        else
                        {
                            switch (item.type)
                            {
                                case "js":
                                    result = await nexacro._loadExtJs(item);
                                    break;
                                case "module":
                                    result = await nexacro._loadExtModule(item);
                                    break;
                                case "style":
                                    result = await nexacro._loadExtCss(item);
                                    break;
                                /*case "template":
                                    result = await nexacro._loadExtTemplate(item);
                                    break;*/
                                default:
                                    throw new Error(`Unknown type: ${item.type}`);

                            }
                        }
                        resolve(result);
                    }
                    catch (e)
                    {
                        reject(new Error(`Unexpected error while loading externals: ${e.message}`));
                    }
                })();
            }).catch(err =>
            {
                return err;
            });
        };

        const results = [];


        for (const id of this._p_externals._idArray)
        {
            const item = this._p_externals[id];
            if (item.status == "success") return;
            const result = await Promise.allSettled([itemtask(item)]);
            results.push(result[0]);
        };
        /*  // 초기화 할 필요없음
        for (const id of this._p_templates._idArray)
        {
            const item = this._p_templates[id];
            if (item.status == "success") return;
            const result = await Promise.allSettled([itemtask(item)]);
            results.push(result[0]);
        };
        */
        return results;

    };



    /*----------------------------------------------
     * NexacroK
    ------------------------------------------------- */
    _pEnvironment._load_new = function (project_path)
    {
        this._load_manager._is_mainloaded = true;
        this._load_manager.status = 2;

        //this.loadTypeDefinition();
        this._loadDeviceAdaptors();
        this.init();

        this._makeProjectPathinfo(this._p_xadl, nexacro._typedefinition_url, project_path);
        this._makeDesignPathinfo(this._p_themeid, this._p_highcontrastthemeid, this._p_initvaluefileid);
        this._makeStringResourcePathinfo(this._p_usestringresource, this._p_stringresourceserviceurl);

        nexacro._initInformation();

        if (this._p_icon)
            nexacro._setApplicationIcon(this._p_icon);

        this._loadTheme(this._curthemeid);

        //load initvalue
        this._loadInitValueFile(this._initvaluefileid);

        //load stringresource
        this._loadStringResource(this._stringrcfileid);

        // this._load_manager._check_fire_oninit();

    };

    _pEnvironment._addPreloadList = function (type, url, id, args)
    {
        nexacro._addPreloadList(this, type, url, id, args);
    };

    _pEnvironment._executeScript = function (context)
    {
        nexacro._executeMainScript(context);
    };

    _pEnvironment.registerScript = function (filename, fn)
    {
        nexacro._registerScript(this, filename, fn);
    };

    //executescript를 generate 코드에서 직접 호출로 변경 
    _pEnvironment.executeIncludeScript = function (url)
    {
        nexacro._executeIncludeScript(this, url);
    };

    _pEnvironment.addIncludeScript = function (mainurl, url)
    {
        nexacro._addIncludeScript(this, mainurl, url);
    };

    _pEnvironment.loadIncludeScript = function (mainurl)
    {
        nexacro._loadIncludeScript(this, mainurl);
    };

    _pEnvironment._loadInclude = function (mainurl, url, asyncmode, service_url)
    {
        nexacro._loadInclude(this, mainurl, url, asyncmode, service_url);
    };


    _pEnvironment._loadTheme = function (themeid)
    {
        nexacro._loadTheme(this, themeid);
    };

    _pEnvironment._loadInitValueFile = function (initvaluefile)
    {
        if (initvaluefile)
        {
            //initvaluefile			
            if (initvaluefile.length > 5)
            {
                var ext = initvaluefile.substring(initvaluefile.length - 4);
                if (ext == ".xml" || ext == ".xiv")
                    initvaluefile = initvaluefile + ".js";
            }
        }

        nexacro._loadGlobalModule(this, initvaluefile);
    };



    //_pApplication._loadStringResource = _pApplication._loadInitValueFile;
    _pEnvironment._loadStringResource = function (stringrc)
    {
        if (!stringrc)
            return;
        //default

        //this._clearLocalThemeCache();
        var url, base_url;
        var localcachetype = false;
        var service;
        if (this._localcache_path && nexacro._hasLocalCacheUrl(stringrc))
        {
            url = nexacro._getLocalCacheUrl(stringrc);
            if (url)
            {
                service = nexacro._getServiceObject(stringrc);
                this._load_manager.loadGlobalJsonResource(stringrc, null, null, service);
                return;
            }

            localcachetype = true;
            base_url = this._localcache_path;
        }

        url = nexacro._getServiceLocation(stringrc, base_url);

        if (localcachetype)
        {
            nexacro._addLocalCacheUrl(stringrc, url);
        }

        service = nexacro._getServiceObject(stringrc);
        this._load_manager.loadGlobalJsonResource(url, null, null, service);
    };

    _pEnvironment._on_init = function ()
    {
        this.loadVariables();

        this._executeScript(this);
        this.initEvent();

        this.on_fire_oninit();

        // test가 끝나면 fire 이전으로

        this._loadExternals();

        this._createdInvisibleObject();
    };

    _pEnvironment._createdInvisibleObject = function ()
    {
        const len = this._p_all.length;
        let i;
        for (i = 0; i < len; i++)
        {
            this._p_all[i].on_created();
        }
    };

    _pEnvironment._on_load = function (obj, url)
    {
        this.on_fire_onload(obj, url);

        if (this._externalcallback) this._externalcallback.call();
        this._externalcallback = null;
        delete this._externalcallback;

    };

    _pEnvironment.addChild = function (id, obj)
    {
        if (id && id.length <= 0)
        {
            return -1;
        }

        if (!obj)
        {
            throw nexacro.MakeReferenceError(this, "reference_not_define", id);
        }

        if (this[id])
        {
            throw nexacro.MakeNativeError(this, "native_exist_id", id);
        }

        if (obj._is_component)
        {
            throw nexacro.MakeNativeError(this, "type_invalid", id);
        }

        if (!obj.id)
        {
            obj.id = obj._p_name = id;
        }
        else
            obj.id = id;

        this[id] = obj;
        obj._p_parent = this;

        return this._p_all.add_item(id, obj);

    };

    _pEnvironment.removeChild = function (id)
    {
        if (!id || id.length <= 0)
        {
            return null;
        }

        var obj = this[id];
        if (!obj)
            return null;

        obj._p_parent = null;
        delete this[id];
        this._p_all.delete_item(id);

        return obj;
    };

    _pEnvironment.lookup = function (name)
    {
        if (name in this)
            return this[name];
        return _global_context[name];
    };

    _pEnvironment.getParentContext = function ()
    {
        return null;
    };

    _pEnvironment._getDatasetObject = function (datasetid)
    {
        if (!datasetid) return null;

        let ds;
        const pthis = "this.";
        if (datasetid.indexOf(".") > 0)
        {
            if (datasetid.indexOf(pthis) < 0)
            {
                datasetid = pthis + datasetid;
            }
            ds = new Function("return " + datasetid).call(this);

        }
        else
        {
            //return this[datasetid];
            ds = this[datasetid] || null;
        }
        return ds;
    };

    _pEnvironment._getDataObject = function (dataobjid)
    {
        return this[dataobjid];
    };


    _pEnvironment.transaction = function (id, url, inDatasetsParam, outDatasetsParam, argsParam, callbackFn, isAsync, datatype, isCompress)
    {
        //bAsync,bBinary,bCompress -- option        
        var real_url = nexacro._getServiceLocation(url);

        var service = nexacro._getServiceObject(url, true);
        this._load_manager.loadDataModule(real_url, id, inDatasetsParam, outDatasetsParam, argsParam, callbackFn, isAsync, datatype, isCompress, service);
    };

    _pEnvironment.cancelTransaction = function (id)
    {
        if (!this._load_manager)
            return -1;
        nexacro._cancelTransaction(this, id);
    };

    _pEnvironment._waitCursor = function (wait_flag, context)
    {
        var mainframe = this._p_mainframe;
        if (mainframe)
        {
            mainframe._waitCursor(wait_flag, context);
        }
    };

    _pEnvironment._stopTransaction = function (is_cancel)
    {
        return nexacro.Form.prototype._stopTransaction.call(this, is_cancel);
    };

    _pEnvironment._onHttpTransactionError = function (obj, bfireevent, errorobj, errortype, url, returncode, requesturi, locationuri, extramsg, svcid)
    {
        var ret = false;
        var commerrorobj = nexacro.MakeCommunicationError(this, errortype, url, returncode, requesturi, locationuri, extramsg);
        if (bfireevent)
        {
            ret = this.on_fire_onerror(obj, commerrorobj.name, commerrorobj.message, errorobj, returncode, requesturi, locationuri, svcid);
        }
        //   this._onFireSystemError(obj, false, commerrorobj.name, 1, commerrorobj.message, true);                                      
        if (commerrorobj.message)
        {
            nexacro._writeTraceLog(1, commerrorobj.message, true, this._loglevel, this._p_traceduration, this._p_tracemode);

        }
        return ret;
    };

    nexacro._loadADL_new = async function (project_path, key, url)
    {
        let application = null;
        if (!nexacro.ismodule)
            application = _global_context._application = new nexacro.Application();
        else
            application = new nexacro.Application();
        application.init();

        if (project_path)
            nexacro._setProjectURL(project_path);

        var env = nexacro.getEnvironment();
        //env._load(project_path);  // 이때 xadl 값은 설정되어 있어야 한다. 
        key = key ? key : env.key;
        url = url ? url : env._request_mainurl;

        application._load_new(key, url);

        return application;
    };







    /*----------------------------------------------
     * End NexacroK
    ------------------------------------------------- */

    _pEnvironment.setDesktopScreenWidth = function (v)
    {
        var app = nexacro.getApplication();
        if (app && app._isLoaded())
            return;

        this._desktopscreenwidth = v;   //모바일 환경에서 선택된 screen이 desktop인 & userzoom = true
    };

    _pEnvironment.on_fire_oninit = function ()
    {
        if (this.oninit && this.oninit._has_handlers)
        {
            var evt = new nexacro.EventInfo(this, "oninit");
            return this.oninit._fireEvent(this, evt);
        }
        return false;
    };

    _pEnvironment.on_fire_onload = function (obj, url)
    {
        if (this.onload && this.onload._has_handlers)
        {
            //var url = nexacro._transfullurl(nexacro._project_absolutepath, "environment.xml.js");
            var evt = new nexacro.LoadEventInfo(obj, "onload", url);
            return this.onload._fireEvent(this, evt);
        }
        return false;
    };


    _pEnvironment.on_fire_onaccessibility = function (text, from_comp, from_refer_comp)
    {
        if (this.onaccessibility && this.onaccessibility._has_handlers)
        {
            var evt = new nexacro.AccessibilityEventInfo(this, "onaccessibility", text, from_comp, from_refer_comp);
            return this.onaccessibility._fireEvent(this, evt);
        }
        return false;
    };

    _pEnvironment.on_fire_onaccessibilitykey = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp)
    {
        if (this.onaccessibilitykey && this.onaccessibilitykey._has_handlers)
        {
            var evt = new nexacro.KeyEventInfo(this, "onaccessibilitykey", alt_key, ctrl_key, shift_key, key_code, from_comp, from_refer_comp);
            return this.onaccessibilitykey._fireEvent(this, evt);
        }
        return false;
    };


    _pEnvironment.on_fire_onerror = function (obj, errortype, errormsg, errorobj, statuscode, requesturi, locationuri, errordata)
    {
        if (this.onerror && this.onerror._has_handlers)
        {
            var evt = new nexacro.ErrorEventInfo(obj, "onerror", errortype, errormsg, errorobj, statuscode, requesturi, locationuri, errordata);
            return this.onerror._fireEvent(this, evt);
        }
        return false;
    };

    //_on_default_sys_onextmodule
    _pEnvironment._on_onextmodule = function (handle, eventid, eventtype, data)
    {
        var ret;
        if (this._device_adaptor_handlelist[handle])
        {
            ret = this._device_adaptor_handlelist[handle].processEvent(eventid, eventtype, data);
        }
        return ret;
    };

    _pEnvironment.on_fire_user_onextendedcommand = function (evt, refer_comp)
    {
        if (this.onextendedcommand && this.onextendedcommand._has_handlers)
        {
            var e = new nexacro.ExtendedCommandEventInfo(this, "onextendedcommand", evt, refer_comp);
            return this.onextendedcommand._fireEvent(this, e);
        }
        return false;
    };

    _pEnvironment.on_fire_sys_onextendedcommand = function (evt, refer_comp)
    {
        return false;
    };

    _pEnvironment.on_fire_onuserhotkey = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key, key_id)
    {
        if (this.onuserhotkey && this.onuserhotkey._has_handlers)
        {
            var evt = new nexacro.EnvironmentUserHotkeyEventInfo(this, "onuserhotkey", alt_key, ctrl_key, shift_key, key_code, from_comp, from_refer_comp, meta_key, key_id);
            return this.onuserhotkey._fireEvent(this, evt);
        }
    };

    _pEnvironment.on_fire_onpressedreloadkey = function (key_code, alt_key, ctrl_key, shift_key, from_comp, from_refer_comp, meta_key)
    {
        if (this.onpressedreloadkey && this.onpressedreloadkey._has_handlers)
        {
            var evt = new nexacro.KeyEventInfo(this, "onpressedreloadkey", alt_key, ctrl_key, shift_key, key_code, from_comp, from_refer_comp, meta_key);
            return this.onpressedreloadkey._fireEvent(this, evt);
        }
    };


    _pEnvironment.on_init = _pEnvironment.on_initEvent = nexacro._emptyFn;
    /*
    _pEnvironment.addIncludeScript = function ()
    {
        nexacro._onSystemWarning(this, "native_notsupport_include");
    };
    */

    _pEnvironment._makeProjectPathinfo = function (xadl, typedefinition_url, project_path)
    {
        //_project_url
        //nexacro._typedefinition_url
        //_localcache_path
        //_theme_uri    
        var request_url;
        if (xadl)
        {
            request_url = xadl;
            if (request_url.length > 5 && request_url.substring(request_url.length - 5) == ".xadl")
            {
                request_url = request_url + ".js";
            }

            //  archive adl을 사용하는 경우 외부에서 지정		
            if (project_path || ((nexacro._OS == "Android" || nexacro._OS == "iOS") && nexacro._isHybrid && nexacro._isHybrid()) || nexacro._macOSWebView)
            {
                var base_url = nexacro._getProjectBaseURL(xadl);
                nexacro._setProjectURL(project_path);

                if (!nexacro._isAbsolutePath(request_url))
                    request_url = nexacro._transfullurl(nexacro._project_absolutepath, request_url);

                if (nexacro._project_absolutepath != base_url)
                {
                    this._localcache_path = base_url;
                    var cache_url = xadl;
                    if (cache_url.substring(cache_url.length - 3) == ".js")
                    {
                        cache_url = cache_url.substring(0, cache_url.length - 3);
                    }
                    if (nexacro._hasLocalCacheUrl(cache_url))
                    {
                        request_url = nexacro._transfullurl(this._localcache_path, xadl);
                    }
                }
            }
            else
            {
                if (nexacro._isAbsolutePath(request_url))
                {
                    nexacro._setProjectURL(nexacro._getBaseUrl(request_url));
                }
                else
                {
                    nexacro._setProjectURL(request_url);
                }

                request_url = nexacro._transfullurl(nexacro._project_absolutepath, request_url);
            }
        }
        else
        {
            request_url = "";
            nexacro._setProjectURL(project_path);

            if (nexacro._macOSWebView && window.location.href.indexOf("file://") === 0)
            {
                this._localcache_path = nexacro._getProjectBaseURL();
            }
        }

        nexacro._typedefinition_url = nexacro._transfullurl(nexacro._project_absolutepath, nexacro._typedefinition_url);
        this._request_mainurl = request_url;
    };

    _pEnvironment._makeDesignPathinfo = function (themeid, highcontrastthemeid, initvaluefileid)
    {
        //theme path
        var curthemeid = themeid;

        if (curthemeid)
        {
            var themename;
            var idx = curthemeid.indexOf(".xtheme");
            if (idx < 0)
                themename = curthemeid;
            else if (idx > 0)
                themename = curthemeid.substring(0, idx);

            if (themename)
            {
                if (!nexacro._theme_uri)
                {
                    nexacro._theme_uri = "./_theme_/";
                }

                idx = themename.indexOf("::");

                if (idx >= 0)
                {
                    themename = themename.substring(idx + 2);
                    nexacro._theme_uri = nexacro._theme_uri + themename;
                }
                else
                {
                    nexacro._theme_uri = nexacro._theme_uri + themename;
                }
            }
            this._curthemeid = curthemeid;
            //nexacro._curthemeid = curthemeid;
        }

        if (initvaluefileid)
        {
            //initvaluefile			
            if (initvaluefileid.length > 5)
            {
                var ext = initvaluefileid.substring(initvaluefileid.length - 4);
                if (ext == ".xml" || ext == ".xiv")
                    initvaluefileid = initvaluefileid + ".js";
            }
            this._initvaluefileid = initvaluefileid;
        }

    };

    _pEnvironment._makeStringResourcePathinfo = function (usestringresource, stringresourceserviceurl)
    {
        var curlang;
        if (usestringresource)
        {
            curlang = nexacro._getStringResourceLanguage();  // 내부변수 nexacro._StringResourceLang 에 값 설정
            if (curlang)
                this._stringrcfileid = nexacro._stringrc_service + curlang + nexacro._stringresourceurl;
        }
        else
        {
            if (nexacro._isDesignMode())
                return;

            var len = stringresourceserviceurl.length;
            if (len <= 0)
                return;

            var locale = this._p_locale ? this._p_locale : nexacro._getLocale();  //environment.locale 일 적용된 후에 nexacro._locale 가 업데이트됨 
            curlang = locale.substring(0, 2);
            nexacro._StringResourceLang = curlang;

            if (stringresourceserviceurl.indexOf('?') > 0)
                stringresourceserviceurl += "&";
            else
                stringresourceserviceurl += "?";

            this._stringrcfileid = nexacro._stringrc_service + stringresourceserviceurl + "lang=" + curlang;
        }
    };

    //ExtensionAPIV2
    _pEnvironment._addDeviceAdaptor = function (deviceid, deviceclass, configs)		
    {
        // devicename에 해당되는 device object를 찾아 configs 값으로 초기화해준다.	

        if (!deviceclass)
            return;

        var device_obj = new deviceclass(deviceid);
        device_obj.initialize(configs);
        var handle = device_obj.getDeviceHandle();
        if (handle)  // handle 중복체크 필요
        {
            if (!this._device_adaptor_handlelist[handle])
            {
                this._device_adaptor_list[deviceid] = device_obj;   //getDeviceAdaptor 에서 사용하기 위한 내부 정보
                this._device_adaptor_handlelist[handle] = device_obj;  //event 처리를 위한 내부 정보
            }
        }
    };

    _pEnvironment.on_fire_ondevicepermission = function (v)
    {
        var parameters = JSON.parse(v);

        if (this.ondevicepermission && this.ondevicepermission._has_handlers)
        {
            var evt = new nexacro.DevicePermissionEventInfo(this, "ondevicepermission", parameters.reason, parameters.status);
            return this.ondevicepermission._fireEvent(this, evt);
        }

        return false;
    };

    //onbeforepopstate, onpopstate, 
    _pEnvironment._firePopStateEvent = function (state)
    {
        if (this._p_preventbrowserbackbutton) return;

        let beforestate = nexacro.History._currentstate;
        if (!beforestate && !state) return;

        let statedata;
        let event = this.onbeforepopstate;
        if (event && event._has_handlers)
        {
            statedata = nexacro.History.getCurrentState();
            let evt = new nexacro.PopStateEventInfo(this, "onbeforepopstate", beforestate, statedata?.data, statedata?.url, location.href);
            event._fireEvent(this, evt);
        }

        nexacro.History._currentstate = state;
        event = this.onpopstate;
        if (event && event._has_handlers)
        {
            statedata = nexacro.History.getCurrentState();
            let evt = new nexacro.PopStateEventInfo(this, "onpopstate", state, statedata?.data, statedata?.url, location.href);
            event._fireEvent(this, evt);
        }
    };


    _pEnvironment.userNotify = function (notifyid, message)
    {
        nexacro._userNotify(notifyid, message);
    };

    _pEnvironment._properties = [{ name: "accessibilitybackwardkey" }, { name: "accessibilitycomponentnexthotkey" }, { name: "accessibilitycomponentprevhotkey" }, { name: "accessibilitydescreadtype" }, { name: "accessibilityfirstovermessage" }, { name: "accessibilityforwardkey" }, { name: "accessibilityheadingnexthotkey" }, { name: "accessibilityheadingprevhotkey" }, { name: "accessibilityhistorycount" }, { name: "accessibilitylastovermessage" }, { name: "accessibilityrepolayhotkey" }, { name: "accessibilitytype" }, { name: "accessibilitywholereadhotkey" }, { name: "accessibilitywholereadtype" }, { name: "addcokietovariable" }, { name: "checkversion" }, { name: "codepage" }, { name: "datasetloadtype" }, { name: "datasetsaveinfinity" }, { name: "datasetsaveinvaliddate" }, { name: "datasetsavenan" }, { name: "datatyperule" }, { name: "enablecache" }, { name: "enableclipboard" }, { name: "enablecookie" }, { name: "enableevent" }, { name: "enableinspector" }, { name: "enablescreencapture" }, { name: "enabletouchevent" }, { name: "enableaccessibility" },
    { name: "filesecurelevel" }, { name: "highcontrastthemeid" }, { name: "httpretry" }, { name: "httptimeout" }, { name: "icon" }, { name: "imepastemode" }, { name: "initvaluefield" }, { name: "key" }, { name: "language" }, { name: "layoutsecttype" }, { name: "loadingimage" }, { name: "locale" }, { name: "loglevel" }, { name: "mouseovertime" }, { name: "mousewheeltype" }, { name: "multivalueseparator" }, { name: "networksecurelevel" }, { name: "popuptype" }, { name: "proxyretry" }, { name: "proxytimeout" }, { name: "rtl" }, { name: "scrollbarsize" }, { name: "scrollbartype" }, { name: "scrollindicatorsize" }, { name: "services", readonly: true }, { name: "externals", readonly: true }, { name: "ssvrecordseparator" }, { name: "ssvunitseparator" }, { name: "stringresourceserviceurl" }, { name: "tabkeycirculation" }, { name: "themeid" }, { name: "traceduration" }, { name: "tracemode" }, { name: "usecontextmenu" }, { name: "usehttpkeepalive" }, { name: "useproxykeepalive" }, { name: "userfontid" }, { name: "userhotkey" }, { name: "usestringresource" }, { name: "usewaitcursor" }, { name: "version" }, { name: "xadl" }, { name: "usesoftkeyboard" }, { name: "enabletouchsoftkeyboard" }, { name: "licenseurl" }, { name: "all", readonly: true }, { name: "preventbrowserbackbutton" }, { name: "browserreloadkey" }, { name: "usesanitizer" }, { name: "allowtags" }, { name: "blocktags" }, { name: "allowattributes" }, { name: "blockattributes" }, { name: "csscollisionpreventkey" },
    { name: "webviewallowedsandbox" }];
    nexacro._defineProperties(_pEnvironment, _pEnvironment._properties);

    nexacro._sanitize = function (contents) { return contents; }

    nexacro._getLoadingImageUrl = function ()
    {
        const env = nexacro.getEnvironment();
        if (env.loadingimage)
        {
            return env.loadingimage;
        }
        return nexacro._transfullurl(env._resource_path, nexacro._default_loadingimage, true, undefined);
    };

    nexacro._getCookieVariables = function (type)
    {
        return nexacro._getSharedVariableAll(type);
    };

    nexacro._hasEnvironmentVariable = function (name)
    {
        return nexacro._hasSharedVariable(name, 3);
    };

    nexacro.getEnvironmentVariable = function (name)
    {
        return nexacro._getSharedVariable(name, 3);
    };

    nexacro.setEnvironmentVariable = function (name, value)
    {
        if (name)
        {
            nexacro._setSharedVariable(name, value, 3);
        }
    };

    nexacro.removeEnvironmentVariable = function (name)
    {
        nexacro._removeSharedVariable(name, 3);
    };

    nexacro.getHTTPHeaderVariable = function (name)
    {
        return nexacro._getSharedVariable(name, 5);
    };

    nexacro.setHTTPHeaderVariable = function (name, value)
    {
        /* setHTTPHeaderVariable은 name, value 모두 필수 매개변수 */
        if (name && value)
        {
            nexacro._setSharedVariable(name, value, 5);
        }
    };

    nexacro.removeHTTPHeaderVariable = function (name)
    {
        nexacro._removeSharedVariable(name, 5);
    };

    nexacro.getCookieVariable = function (name, bsecure)
    {
        // bsecure : undefined/false/true (all/non-secure/secure)

        var ret;
        // localstorage 에서 값을 가져온다.
        if (bsecure !== true)
            ret = nexacro._getSharedVariable(name, 4);

        if (!ret && bsecure !== false)
            ret = nexacro._getSharedVariable(name, 6);

        return ret;
    };

    nexacro.setCookieVariable = function (name, value, bsecure/*,expires*/)
    {
        if (name)
        {
            bsecure = nexacro._toBoolean(bsecure);
            var type = bsecure ? 6 : 4;
            var remove_type = bsecure ? 4 : 6;

            if (nexacro._getSharedVariable(name, remove_type))
                nexacro._removeSharedVariable(name, remove_type);

            //변수가 없으면 추가하고 설정

            nexacro._setSharedVariable(name, value, type);
            nexacro._setCookie(name, value, null, bsecure);
        }

        // 통신시 cookie로 적용될 변수.. 
        // 바로 cookie로 넣어야되나?? 아니면 localstorage에도 넣고 cookie로도 넣어야 되나?
    };

    nexacro._hasCookieVariables = function ()
    {
        return (nexacro._getCookieVariables(4) || nexacro._getCookieVariables(6)) ? true : false;
    };

    // 변수로만 생성, cookie 값은 갱신하지 않는다.
    nexacro._setCookieVariable = function (name, value, bsecure/*,expires*/)
    {
        if (name)
        {
            bsecure = nexacro._toBoolean(bsecure);
            var type = bsecure ? 6 : 4;
            var remove_type = bsecure ? 4 : 6;

            if (nexacro._getSharedVariable(name, remove_type))
                nexacro._removeSharedVariable(name, remove_type);

            //변수가 없으면 추가하고 설정
            nexacro._setSharedVariable(name, value, type);
        }
    };

    nexacro._removeCookieVariable = function (name, type)
    {
        nexacro._removeCookie(name);
        nexacro._removeSharedVariable(name, type);

    };

    nexacro.removeCookieVariable = function (name, bsecure)
    {
        // bsecure : undefined/false/true (all/non-secure/secure)

        if (bsecure !== true)
            nexacro._removeSharedVariable(name, 4);

        if (bsecure !== false)
            nexacro._removeSharedVariable(name, 6);
    };

    nexacro.isExistCookieVariable = function (name, bsecure)
    {
        // bsecure : undefined/false/true (all/non-secure/secure)
        var ret;

        if (bsecure !== true)
            ret = nexacro._hasSharedVariable(name, 4);

        if (!ret)
        {
            if (bsecure !== false)
                ret = nexacro._hasSharedVariable(name, 6);
        }

        return ret;
    };

    nexacro.getEnvironment = function ()
    {
        return nexacro._environment;
    };


    nexacro.getApplication = function ()
    {
        if (_global_context._application) // 임시 
            return _global_context._application;
        return (!nexacro.ismodule) ? nexacro._application : null;
    };
    nexacro.getMainObject = function ()
    {
        if (!nexacro.ismodule)
            return nexacro.getApplication();

    }

    nexacro.__getMainObject = function (context, bapp)
    {
        if (bapp)
        {
            if (context._getApplication)
                return context._getApplication();
            else if (context._is_application)
                return context;
        }
        else
        {
            if (context._getRootObject)
                return context._getRootObject();
            else if (context._is_application)
                return context;
        }
        return null;
    };

    nexacro.__getActiveObject = function (context, bform)
    {
        if (bform)
        {
            if (context.getActiveForm)
                return context.getActiveForm();
        }
        else
        {
            if (context.getActiveFrame)
                return context.getActiveFrame();
        }
        return null;
    };

    nexacro.deleteCacheDB = function ()
    {
        if (globalThis.chrome && globalThis.chrome.webview)
        {
            var params = {};
            nexacro._messageToNative("0000", "nexacroapi", "_deleteCacheDB", params, true, true);
            return;
        }
        return nexacro._deleteCacheDB(); //only runtime;
    };

    nexacro.getProjectPath = function ()
    {
        return nexacro._project_absolutepath;
    };

    nexacro.getLogFilePath = function ()
    {
        return nexacro._getLogFilePath();
    };

    // 스크린타입별 사용자 CSS 적용 파일명 생성
    nexacro._getExtUserCssScreenType = function ()
    {
        return "";
    };

    nexacro._getMapFileName = function (mapfile)
    {
        //todo 
        // return mapfile += ".map.js";

        var ext_type = nexacro._getExtUserCssScreenType();
        if (nexacro._isUndefined(ext_type))
        {
            mapfile = mapfile + ".desktop";
        }
        else
        {
            if (ext_type && ext_type.length > 0)
            {
                mapfile += ("." + ext_type);
            }
        }
        mapfile += ".map.js";
        return mapfile;
    };

    // xcss prefix 에 있는 것만 지원 
    // xcss::
    //sync 처리 
    nexacro.loadStyle = function (url)
    {
        const env = nexacro.getEnvironment();

        var styleurl = url;
        if (!env._cssurls)
            env._cssurls = [];

        var idx = env._cssurls.indexOf(url);
        if (idx != -1)
            env._cssurls.splice(idx, 1);
        env._cssurls.push(url);

        var cssurl, base_url;
        url = url.replace("::", "_");
        //경로 설정하는 api 필요
        cssurl = nexacro._getServiceLocation("theme://" + url, nexacro._project_absolutepath, null, false);
        // xcss -> (map.js,css)확장자 변환을 밑에서 처리 - version정보는 확장자 뒤에 붙음

        var checkversion = env.checkversion;

        if (env._localcache_path)
        {
            base_url = cssurl.substring(nexacro._project_absolutepath.length, cssurl.length);
            cssurl = env._localcache_path + base_url;
        }

        var cssmapurl = cssurl;
        var pos = cssurl.lastIndexOf('/');
        cssurl = cssurl.substring(0, pos + 1) + nexacro._getCSSFileName(cssurl.substring(pos + 1, cssurl.length - 5));

        var service = nexacro._getServiceObject(styleurl);
        pos = cssmapurl.lastIndexOf('.');
        cssmapurl = nexacro._getMapFileName(cssmapurl.substring(0, pos));

        // checkversion 처리를 다시

        if (checkversion)
        {
            cssmapurl += nexacro._getVersionQueryString(cssmapurl, "theme");
            cssurl += nexacro._getVersionQueryString(cssurl, "theme");
        }


        if (env)
        {
            env._load_manager.reloadCssModule(cssmapurl, null, false, service);  //map
            env._load_manager.reloadCssModule(cssurl, false, false, service, true, 1); //css
            nexacro._refreshCssAll();
        }

    };


    nexacro._com_waiting = false;
    nexacro._skipDragEventAfterMsgBox = false;

    //application 환경
    nexacro._loadADL = async function (project_path)
    {

        let application = null;
        if (!nexacro.ismodule)
            application = _global_context._application = new nexacro.Application();
        else
            application = new nexacro.Application();
        application.init();

        var env = nexacro.getEnvironment();
        env._load(project_path);  // 이때 xadl 값은 설정되어 있어야 한다. 


        application._load(env.key, env._request_mainurl);

        return application;
    };


    //form 환경
    nexacro._loadFDL = async function (project_path, formurl)
    {

        let form = null;



        form = new nexacro.Form("form", 0, 0, 0, 0, null, null, null, null, null, null, null, true);

        nexacro._setBrowserErrorMsg();

        if (project_path)
            nexacro._setProjectURL(project_path);

        form._load(formurl);

        return form;
    };

    nexacro._getErrorMessge = function (errorcode)
    {
        if (nexacro._errortable)
        {
            var lang = "en";
            var _lang = nexacro._getLanguage();
            if (nexacro._errortable[_lang])
                lang = _lang;

            var errmsg = nexacro._errortable[lang][errorcode];

            if (!errmsg) return "";
            var args = Array.prototype.slice.call(arguments, 1);

            var result = "";
            var argnum = 0;
            var errormsgcount = errmsg.length;
            var argscount = args.length;
            for (var i = 0; i < errormsgcount; i++)
            {
                var str = errmsg[i];
                if (argscount > 0 && str.length == 2 && str.charCodeAt(0) == 0x25)
                {
                    argnum = (str.charCodeAt(1) - 0x30) >>> 0;
                    if (argnum < errormsgcount)
                    {
                        str = args[argnum];
                    }
                }
                result += str;
            }
            return result;
        }
    };

    nexacro.addErrorMessage = function (lang, code, msg)
    {
        if (!nexacro._errortable)
            nexacro._errortable = {};

        var args_len = arguments.length;
        if (args_len == 1)
        {
            var errortable = lang;
            var locale;
            for (locale in errortable)
            {
                var errortable_locale = errortable[locale];
                for (code in errortable_locale)
                {
                    var message = errortable_locale[code];
                    if (!nexacro._errortable[locale])
                        nexacro._errortable[locale] = {};

                    nexacro._errortable[locale][code] = message;
                }
            }
        }
        else
        {
            if (nexacro._errortable[lang] == null)
            {
                nexacro._errortable[lang] = nexacro._errortable['en'];
            }

            if (nexacro._errortable[lang])
                nexacro._errortable[lang][code] = msg;
        }
    };



    nexacro.setPrivateProfile = function (key, varValue, common_flag)
    {
        return nexacro._setPrivateProfile(key, varValue, common_flag);
    };

    nexacro.getPrivateProfile = function (key, common_flag)
    {
        return nexacro._getPrivateProfile(key, common_flag);
    };

    nexacro.removePrivateProfile = function (key)
    {
        nexacro._removePrivateProfile(key);
    };

    nexacro.getPopupFrames = function (context)
    {
        if (context === null)
            return;

        if (context && context._getWindow)
        {
            var win = context._getWindow();
            if (win)
            {
                return win._getPopupFrames();
            }
        }
        return nexacro._getPopupFrames();
    };

    nexacro.userNotify = function ()
    {

    };

    nexacro.flashWindow = function (type, count, interval)
    {
        if (globalThis.chrome && globalThis.chrome.webview)
        {
            var params = { type: type, count: count, interval: interval };
            nexacro._messageToNative("0000", "nexacroapi", "_flashWindow", params, true, true);
            return;
        }
    };

    nexacro.setInitialVariable = function (type, name, value)
    {
        type = type.toLowerCase();
        switch (type)
        {
            case "environment":
                {
                    if (!nexacro._initenvvar)
                        nexacro._initenvvar = {};

                    nexacro._initenvvar[name] = value;
                    break;
                }
            case "cookie":
                {
                    if (!nexacro._initcookievar)
                        nexacro._initcookievar = {};

                    nexacro._initcookievar[name] = value;
                    break;
                }
            case "httpheader":
                {
                    if (!nexacro._inithttpvar)
                        nexacro._inithttpvar = {};

                    nexacro._inithttpvar[name] = value;
                    break;
                }
            case "application":
            default:
                {
                    if (!nexacro._initappvar)
                        nexacro._initappvar = {};

                    nexacro._initappvar[name] = value;
                    break;
                }
        }
    };

    nexacro.open = function (id, formurl, parent_frame, arr_arg, openstyles, left, top, width, height, opener, ext_openstyles)
    {
        // Android, iOS Runtime 미지원
        if (nexacro._Browser == "Runtime" && (nexacro._OS == "iOS" || nexacro._OS == "Android"))
            return false;

        var parentframe = parent_frame;

        nexacro._cleanupPopupFrame(id, parentframe);

        if (parentframe && parentframe[id])
        {
            throw nexacro.MakeNativeError(this, "native_exist_id", id);
        }

        //popupframe에 있는지 먼저 체크 
        if (nexacro._isPopupFrame(id, parentframe))
        {
            throw nexacro.MakeNativeError(this, "native_exist_id", id);
        }

        if (parent_frame)
        {
            if (!parent_frame._is_frame && !parent_frame._is_main)
            {
                throw nexacro.MakeTypeError(this, "type_mismatch", parent_frame);
            }
        }

        var parent_window = parentframe ? parentframe._getWindow() : null;
        var resizable = false;
        var layered = false;
        var showontaskbar = false;
        var openstatus = "normal";
        var showstatusbar = true;
        var topmost = null;     // Runtime 전용 option
        var noactivate = null;  // Runtime 전용 option

        var ext_options = "";   // Runtime 전용 options
        if (!parent_window)
            showontaskbar = true;

        var i;
        if (openstyles)
        {
            var openstyle = openstyles.split(" ");
            for (i = 0; i < openstyle.length; i++)
            {
                var style = openstyle[i].split("=");
                if (style[0] == "resizable")
                    resizable = nexacro._toBoolean(style[1]);
                if (style[0] == "layered")
                    layered = nexacro._toBoolean(style[1]);
                if (style[0] == "showontaskbar")
                    showontaskbar = nexacro._toBoolean(style[1]);
                if (style[0] == "openstatus")
                    openstatus = style[1];
                if (style[0] == "showstatusbar")
                    showstatusbar = nexacro._toBoolean(style[1]);
                if (style[0] == "topmost")
                    topmost = nexacro._toBoolean(style[1]);
            }
        }

        if (ext_openstyles)
        {
            var btoolbar = false,
                bmenubar = false,
                blocation = false;

            ext_openstyles = ext_openstyles.toLowerCase();
            var ext_opt = ext_openstyles.split(" ");
            for (i = 0; i < ext_opt.length; i++)
            {
                var opt = ext_opt[i].split("=");
                if (opt[0] == "toolbar")
                    btoolbar = nexacro._toBoolean(opt[1]);
                else if (opt[0] == "menubar")
                    bmenubar = nexacro._toBoolean(opt[1]);
                else if (opt[0] == "location")
                    blocation = nexacro._toBoolean(opt[1]);
                else if (opt[0] == "noactivate")
                    noactivate = nexacro._toBoolean(opt[1]);
            }
            ext_options += "toolbar=" + (btoolbar ? "yes" : "no");
            ext_options += ",menubar=" + (bmenubar ? "yes" : "no");
            ext_options += ",location=" + (blocation ? "yes" : "no");
        }
        else
        {
            ext_options += "toolbar=no,menubar=no,location=no";
        }
        ext_options += showstatusbar ? ",status=yes" : ",status=no";

        if (openstatus)
        {
            openstatus = openstatus.toLowerCase();
            if (openstatus == "maximize")
                ext_options += ",fullscreen=yes";
        }

        // runtime 전용 추가
        ext_options += topmost ? ",topmost=true" : ",topmost=false";
        ext_options += noactivate ? ",noactivate=true" : ",noactivate=false";

        var frameopener = opener;
        if (opener === null || opener == undefined)
        {
            if (parentframe?._is_form)
            {
                frameopener = parentframe
            }
            else
                frameopener = parentframe ? parentframe._p_form : null;

        }

        //if (!nexacro._popupframeoption)
        //    nexacro._popupframeoption = {};

        if (width == undefined || width < 0)
            width = 0;
        if (height == undefined || height < 0)
            height = 0;

        // nexacro._popupframeoption[id] = {
        //     "_openstyles": openstyles,
        //     "_formurl": formurl,            
        //     "_left": left,
        //     "_top": top,
        //     "_width": width,
        //     "_height": height,
        //     "_popupparentframe" : parentframe,
        //     "_popupframeopener" : frameopener,
        //     "_popuparrarg" : arr_arg
        // };

        if (nexacro._Browser == "Runtime" && (nexacro._SystemType.toLowerCase() == "win32" || nexacro._SystemType.toLowerCase() == "win64"))
        {
            if (parent_window)
                nexacro._registerPopupFrame(id, this, parent_window);
            else
                nexacro._registerPopupFrame(id, this, nexacro._findWindow(nexacro._getMainWindowHandle()));
        }

        var handle = nexacro._createOpenWindowHandle(parent_window, id, formurl, left, top, width, height, resizable, layered, showontaskbar, false, parentframe, frameopener, arr_arg, ext_options, openstyles);
        if (handle)
            return true;
        return false;
    };
    //CHECK LKE Framework init 부분은 Docinit 이전에 수행되어야 함, 추후 별도의 파일로 분리해야 하지 않을까 판단됨

    nexacro._ServiceItem = function (prefixid, type, url, cachelevel, codepage, language, version, communicationversion)
    {
        this._p_prefixid = prefixid;
        this._p_type = type;
        this._p_url = url;

        if (nexacro._viewtoollog)
            this._p_cachelevel = "none";
        else
            this._p_cachelevel = cachelevel ? cachelevel : "session";

        this.codepage = codepage;
        this.language = language;
        this._p_version = version;
        this._p_communicationversion = communicationversion;


    };
    var __pServiceItem = nexacro._createPrototype(nexacro.Object, nexacro._ServiceItem);
    nexacro._ServiceItem.prototype = __pServiceItem;

    __pServiceItem.set_cachelevel = function (v)
    {
        if (nexacro._viewtoollog)
            this._p_cachelevel = "none";
        else if (v == "none" || v == "static" || v == "session" || v == "dynamic")
            this._p_cachelevel = v;
    };

    __pServiceItem.set_version = function (v)
    {
        this._p_version = v;
    };

    __pServiceItem.set_url = function (v)
    {
        this._p_url = v;
    };

    //__pServiceItem.set_codepage = function (v)
    //{
    //    this._p_codepage = v;
    //};

    //__pServiceItem.set_language = function (v)
    //{
    //    this._p_language = v;
    //};

    __pServiceItem.set_communicationversion = function (v)
    {
        this._p_communicationversion = v;
    };

    __pServiceItem._properties = [{ name: "prefixid", readonly: true }, { name: "type", readonly: true }, { name: "url" }, { name: "cachelevel" }, { name: "communicationversion" }, { name: "version" }];
    nexacro._defineProperties(__pServiceItem, __pServiceItem._properties);


    nexacro._ExternalItem = function (externalid, url, type, loadtype, crossorigin, integrity, template_src)
    {
        this._p_externalid = externalid;
        this._p_url = url;
        this._p_type = type;
        this._p_loadtype = loadtype;
        this._p_crossorigin = crossorigin;
        this._p_integrity = integrity;
        this._p_template_src = template_src;

        this._p_value = { isolateVal: new WeakMap(), shareVal: undefined };
        this._p_status = { isolateVal: new WeakMap(), shareVal: undefined };
        this.status = "init";
    };

    const __pExternalItem = nexacro._createPrototype(nexacro.Object, nexacro._ExternalItem);
    nexacro._ExternalItem.prototype = __pExternalItem;

    __pExternalItem._p_value = undefined;
    __pExternalItem._p_status = undefined;
    __pExternalItem._p_externalid = "";
    __pExternalItem._p_url = "";
    __pExternalItem._p_type = "";
    __pExternalItem._p_loadtype = "";
    __pExternalItem._p_crossorigin = "";
    __pExternalItem._p_integrity = "";
    __pExternalItem._p_template_src = "";


    __pExternalItem.set_value = function (v)
    {
        if (this.type == "module" || this.type == "js")
        {
            const context = globalThis;
            this._p_value.isolateVal.set(context, v);
        }
        else if (this.type == "template")
        {
            this._p_value.shareVal = v;
        }
        // style은 mapping 없음
    };
    __pExternalItem.get_value = function ()
    {
        if (this.type == "module" || this.type == "js")
        {
            const context = globalThis;
            return this._p_value.isolateVal.get(context);
        }
        return undefined;

    };
    __pExternalItem.hasValue = function ()
    {
        if (this.type == "module" || this.type == "js")
        {
            const context = globalThis;
            return this._p_value.isolateVal.has(context);
        }
        else if (this.type == "style")
        {
            return nexacro.__checkNodeDuplication("stylesheet", this.url);
        }

        return false;
    };
    __pExternalItem.set_status = function (v)
    {
        if (v == "init" || v == "error" || v == "success" || v == "prefetch")
        {
            if (this.type == "template")
            {
                this._p_status.shareVal = v;
            }
            else
            {
                const context = globalThis;
                this._p_status.isolateVal.set(context, v);
            }
        }

    };
    __pExternalItem.get_status = function (v)
    {
        if (this.type == "template")
        {
            return this._p_value.shareVal;
        }
        else
        {
            const context = globalThis;
            return this._p_value.isolateVal.get(context);
        }
    };


    __pExternalItem._properties = [{ name: "externalid", readonly: true },
    { name: "url", readonly: true },
    { name: "type", readonly: true },
    { name: "loadtype", readonly: true },
    { name: "crossorigin", readonly: true },
    { name: "integrity", readonly: true },
    { name: "template_src", readonly: true },
    { name: "status", getter: __pExternalItem.get_status },
    { name: "value", getter: __pExternalItem.get_value }];



    nexacro._defineProperties(__pExternalItem, __pExternalItem._properties);




    nexacro._getRegisterClass = function (objid)
    {
        const env = nexacro.getEnvironment();
        if (!env) return;

        var registerclass = env._registerclass;
        var len = registerclass.length;
        for (var i = 0; i < len; i++)
        {
            var item = registerclass[i];
            if (item && objid == item.id)
            {
                return item.classname;
            }
        }
    };

    //GoogleMapMarker 에서 호출,적용은 되지 않았을 것으로 확인되어 추가 확인이 필요함
    nexacro._addRegisterClass = function (registername, classname)
    {
        var registerclass = nexacro._registerclass;
        if (!registerclass)
            registerclass = nexacro._registerclass = [];
        registerclass.push({ id: registername, classname: classname });
    };


    nexacro._addService = function (prefixid, type, url, cachelevel, codepage, language, version, communication)
    {
        /*if (nexacro.__APPLOADER_BASE_PATH__)
        {
            url = url.replace("./", nexacro.__APPLOADER_BASE_PATH__);
        }*/
        var service = new nexacro._ServiceItem(prefixid, type, url, cachelevel, codepage, language, version, communication);
        var env = nexacro.getEnvironment();
        if (env)
            env._p_services.add(prefixid, service);
    };

    nexacro._removeService = function (prefixid)
    {
        var env = nexacro.getEnvironment();
        if (env && env._p_services)
        {
            var service = env._p_services[prefixid];
            if (service)
            {
                env._p_services.delete_item(prefixid);
            }
        }
    };


    nexacro._addExternal = function (externalid, url, type, loadtype, crossorigin, integrity, template_src)
    {
        const external = new nexacro._ExternalItem(externalid, url, type, loadtype, crossorigin, integrity, template_src);
        const env = nexacro.getEnvironment();
        if (env)
        {
            if (type == "template")
                env._p_templates.add(externalid, external);
            else
                env._p_externals.add(externalid, external);
        }
    };

    nexacro._removeExternal = function (externalid, type)
    {
        const env = nexacro.getEnvironment();
        if (type == "template")
        {
            if (env && env._p_templates)
            {
                const external = env._p_templates[externalid];
                if (external)
                {
                    env._p_templates.delete_item(externalid);
                }
            }
        }
        else
        {
            if (env && env._p_externals)
            {
                const external = env._p_externals[externalid];
                if (external)
                {
                    env._p_externals.delete_item(externalid);
                }
            }
        }
    };

    /**
    * @param {(  string  |  [  string  ,  string|null  ,  string|unll  ]  |  {url: string, crossorigin?: string|undefined, integrity?: string|undefined})}  args
    */
    nexacro.loadExternalJS = async function (args)
    {
        const promise = new Promise((resolve, reject) =>
        {
            (async () => 
            {
                let externalid, url, crossorigin, integrity = undefined;
                let type = "js";
                let loadtype = "preload";
                let module = undefined;
                if (typeof args === "string") 
                {
                    externalid = args;
                }
                else
                {
                    if (Array.isArray(args)) 
                    {
                        url = args[0];
                        crossorigin = args[1] || undefined;
                        integrity = args[2] || undefined;
                    }
                    else if (typeof args === "object" && args !== null) 
                    {
                        url = args.url;
                        crossorigin = args?.crossorigin;
                        integrity = args?.integrity;

                    }
                }

                if (externalid)
                {
                    const env = nexacro.getEnvironment();
                    const external = env._p_externals[externalid];
                    if (external && external.type == type)
                    {
                        if (external.hasValue())
                        {
                            module = external.value;
                        }
                        else
                        {
                            let ret = await nexacro._loadExtJs(external);
                            module = (ret !== external.value) ? ret : external.value;
                        }
                    }
                }
                else
                {
                    if (url && !nexacro.__checkNodeDuplication(type, url))
                    {
                        const external = new nexacro._ExternalItem("#dynamic", url, type, loadtype, crossorigin, integrity, /*template_src = */undefined);
                        let ret = await nexacro._loadExtJs(external);
                        module = (ret !== external.value) ? ret : external.value;
                    }
                }

                resolve(module);
            })();
        });

        let ret = await promise;
        return ret;

    };

    /**
    * @param {(  string  |  [  string  ,  string|null  ,  string|unll  ]  |  {url: string, crossorigin?: string|undefined, integrity?: string|undefined})}  args
    */
    nexacro.loadExternalModule = async function (args)
    {
        const promise = new Promise((resolve, reject) =>
        {
            (async () => 
            {
                let externalid, url, crossorigin, integrity = undefined;
                let type = "module";
                let loadtype = "preload";
                let module = undefined;
                if (typeof args === "string") 
                {
                    externalid = args;
                }
                else
                {
                    if (Array.isArray(args)) 
                    {
                        url = args[0];
                        crossorigin = args[1] || undefined;
                        integrity = args[2] || undefined;
                    }
                    else if (typeof args === "object" && args !== null) 
                    {
                        url = args.url;
                        crossorigin = args?.crossorigin;
                        integrity = args?.integrity;

                    }
                }

                if (externalid)
                {
                    const env = nexacro.getEnvironment();
                    const external = env._p_externals[externalid];
                    if (external && external.type == type)
                    {
                        if (external.hasValue())
                        {
                            module = external.value;
                        }
                        else
                        {
                            let ret = await nexacro._loadExtModule(external);
                            module = (ret !== external.value) ? ret : external.value;
                        }
                    }
                }
                else
                {
                    if (url && !nexacro.__checkNodeDuplication(type, url))
                    {
                        const external = new nexacro._ExternalItem("dynamic", url, type, loadtype, crossorigin, integrity, /*template_src = */undefined);
                        let ret = await nexacro._loadExtModule(external);
                        module = (ret !== external.value) ? ret : external.value;
                    }
                }

                resolve(module);
            })();
        });

        let ret = await promise;
        return ret;
    };


    /**
    * @param {(  string  |  [  string  ,  string|null  ,  string|unll  ]  |  {url: string, crossorigin?: string|undefined, integrity?: string|undefined})}  args
    */

    nexacro.loadExternalStyle = async function (args)
    {
        const promise = new Promise((resolve, reject) =>
        {
            (async () => 
            {
                let externalid, url, crossorigin, integrity = undefined;
                let type = "style";
                let loadtype = "preload";
                let module = false;
                if (typeof args === "string") 
                {
                    externalid = args;
                }
                else
                {
                    if (Array.isArray(args)) 
                    {
                        url = args[0];
                        crossorigin = args[1] || undefined;
                        integrity = args[2] || undefined;
                    }
                    else if (typeof args === "object" && args !== null) 
                    {
                        url = args.url;
                        crossorigin = args?.crossorigin;
                        integrity = args?.integrity;

                    }
                }

                if (externalid)
                {
                    const env = nexacro.getEnvironment();
                    const external = env._p_externals[externalid];
                    if (external && external.type == type)
                    {
                        // 
                        if (external.hasValue())
                        {
                            module = true;
                        }
                        else
                        {
                            await nexacro._loadExtCss(external);
                            if (external.hasValue())
                            {
                                module = true;
                            }
                        }
                    }
                }
                else
                {
                    if (url && nexacro.__checkNodeDuplication(type, url))
                    {
                        module = true;
                    }
                    else
                    {
                        const external = new nexacro._ExternalItem("#dynamic", url, type, loadtype, crossorigin, integrity, /*template_src = */undefined);
                        await nexacro._loadExtCss(external);
                        if (external.hasValue())
                        {
                            module = true;
                        }
                    }
                }

                resolve(module);
            })();
        });

        let ret = await promise;
        return ret;
    };

    /**
    * @param {(  string  )}  args
    */

    nexacro.loadHTMLTemplate = function (args)
    {
        const externalid = args;
        if (externalid)
        {
            const env = nexacro.getEnvironment();
            const external = env._p_templates[externalid];
            if (external)
            {
                return external.template_src;
            }
            else // bypass
            {
                return externalid;
            }
        }
    };

    nexacro._setTypeDefinitionURL = function (url)
    {
        nexacro._typedefinition_url = url;
        //adl 이 로드된 후에 fullpath로 변경 
        /*
        var typedefinition_url = nexacro._getServiceLocation(url);
        if (typedefinition_url)
        {
            nexacro._typedefinition_url = typedefinition_url;
        }*/

    };

    nexacro._addClasses = function (registerclass)
    {
        let env = nexacro.getEnvironment();
        if (nexacro._registerclass)   //Envionment 가 load되기전에 정보를 저장 
        {
            env._registerclass = registerclass.concat(nexacro._registerclass);
            nexacro._registerclass = null;
            delete nexacro._registerclass;
        }
        else
            env._registerclass = registerclass;
    };

    nexacro._addProtocol = function (name, protocoladp)
    {
        var protocols = nexacro._protocols;
        if (!protocols)
            protocols = nexacro._protocols = {};

        protocols[name] = protocoladp;
    };

    nexacro._isProtocol = function (name)
    {
        const env = nexacro.getEnvironment();
        var registerclass = env._registerclass;
        var len = registerclass.length;
        for (var i = 0; i < len; i++)
        {
            var item = registerclass[i];
            if (item && item.id == name && nexacro._isRuntimeProtocol(name) === false)
            {
                return true;
            }
        }
        return false;
    };

    nexacro._getProtocol = function (name)
    {
        if (!nexacro._protocols)
            nexacro._protocols = {};

        return nexacro._protocols[name];
    };

    nexacro._removeProtocols = function ()
    {
        var item;
        var protocols = nexacro._protocols;
        for (item in protocols)
        {
            if (protocols[item].finalize)
                protocols[item].finalize();
        }

        nexacro._protocols = {};
    };

    nexacro.setProtocolVar = function (name, key, val)
    {
        nexacro._setProtocolVar(name, key, val);
    };

    nexacro._registerClass = function (registerclass, jscontext)
    {
        if (!registerclass) return;
        if (nexacro.ismodule) return;
        let len = registerclass.length;
        for (let i = 0; i < len; i++)
        {
            let item = registerclass[i];
            if (item && !jscontext[item.id])
            {
                jscontext[item.id] = nexacro._executeGlobalEvalStr(item.classname);
            }
        }
    };

    //
    nexacro._loadTheme = function (context, themeid, excludemapfile)
    {
        if (!themeid || !context)
            return;

        const env = nexacro.getEnvironment();
        let localcache_path = env?._localcache_path;
        let idx = themeid.indexOf("theme::");
        if (localcache_path && idx >= 0)
            themeid = themeid.substring(idx + 7);

        //default
        //this._clearLocalThemeCache();
        let cssurl, cssmapurl, base_url;
        let service = nexacro._getServiceObject(themeid);
        let localcachetype = false;
        if (localcache_path && nexacro._hasLocalCacheUrl(themeid))
        {
            //localcache
            cssurl = nexacro._getLocalCacheUrl(themeid);
            cssmapurl = nexacro._getLocalCacheUrl(themeid + "map");
            if (cssurl && cssmapurl)            
            {
                context._load_manager.loadCssModule(cssurl, null, null, service, true, 0);
                context._load_manager.loadCssModule(cssmapurl, null, null, service);
                return;
            }
            localcachetype = true;
            base_url = localcache_path;
        }

        //html
        cssurl = nexacro._theme_uri + nexacro._getCSSFileName("/theme");
        //cssurl = themeid + "/" + nexacro._getCSSFileName("theme")
        cssurl = nexacro._getServiceLocation(cssurl, base_url, null, false);

        // cssurl += ".js";                    

        //for info
        cssmapurl = nexacro._getMapFileName(nexacro._theme_uri + "/theme");
        //cssurl = themeid + "/theme.map";
        cssmapurl = nexacro._getServiceLocation(cssmapurl, base_url, null, false);

        if (localcachetype)
        {
            nexacro._addLocalCacheUrl(themeid, cssurl);
            nexacro._addLocalCacheUrl(themeid + "map", cssmapurl);
        }

        let checkversion = env?._p_checkversion;
        if (checkversion)
        {
            var version = service.version;
            if (!nexacro._isNull(version) && version !== "")
            {
                cssurl += nexacro._getVersionQueryString(cssurl, null, version);
                cssmapurl += nexacro._getVersionQueryString(cssmapurl, null, version);
            }
        }

        context._load_manager.loadCssModule(cssurl, null, null, service, true, 0);
        if (!excludemapfile)
            context._load_manager.loadCssModule(cssmapurl, null, null, service);
    };

    nexacro._loadGlobalModule = function (context, path)
    {
        if (!path || !context)
            return;

        let url, base_url;
        var localcachetype = false;
        var service;
        const env = nexacro.getEnvironment();
        if (env?._localcache_path && nexacro._hasLocalCacheUrl(path))
        {
            url = nexacro._getLocalCacheUrl(path);
            if (url)
            {
                service = nexacro._getServiceObject(path);
                context._load_manager.loadGlobalModule(path, null, null, service);
                return;
            }

            localcachetype = true;
            base_url = env?._localcache_path;
        }

        url = nexacro._getServiceLocation(path, base_url);

        if (localcachetype)
        {
            nexacro._addLocalCacheUrl(path, url);
        }

        service = nexacro._getServiceObject(url);
        context._load_manager.loadGlobalModule(url, null, null, service);
    };

    nexacro._addPreloadList = function (context, type, url, id, args)
    {
        if (!url || !context) return;

        let service = nexacro._getServiceObject(url);
        if (type == "data" || type == "dataobject")
        {
            var fullurl = nexacro._getServiceLocation(url);
            context._load_manager.addPreloadItem(type, fullurl, id, args, service);
        }
        else
        {
            context._load_manager.addPreloadItem(type, url, (id ? id : this), null, service);
        }
    };

    nexacro._addIncludeScript = function (context, mainurl, url)
    {
        if (url && context)
        {
            let _svcurl = url;
            let suburl = nexacro._getServiceLocation(url);
            let includescript;
            let len = context._includescriptlist.length;
            let i = 0;
            for (i = 0; i < len; i++)
            {
                includescript = context._includescriptlist[i];
                if (includescript.url == suburl)
                {
                    return;
                }
            }

            context._includescriptlist.push({ target: mainurl, url: suburl, fn: nexacro._emptyFn, isload: false, isexecuted: false, service_url: _svcurl });
        }
    };

    nexacro._loadIncludeScript = function (context, mainurl)
    {
        if (!context) return;

        var includescript;
        var len = context._includescriptlist.length;
        for (var i = 0; i < len; i++)
        {
            includescript = context._includescriptlist[i];
            if (includescript.isload == false)
            {
                includescript.isload = true;
                context._loadInclude.call(context, mainurl, includescript.url, true, includescript.service_url);
            }
        }
    };

    nexacro._loadInclude = function (context, mainurl, url, asyncmode, service_url)
    {
        if (!context) return;

        let service;
        if (service_url && service_url.length > 0)
            service = nexacro._getServiceObject(service_url);
        else
            service = nexacro._getServiceObject(url);

        context._load_manager.loadIncludeModule(url, null, asyncmode, service);
    };

    nexacro._registerScript = function (context, filename, fn)
    {
        if (!context) return;

        var scriptlist = context._includescriptlist;
        var len = scriptlist.length;

        for (var i = 0; i < len; i++)
        {
            if (scriptlist[i].url == filename)
            {
                scriptlist[i].fn = fn;
                return;
            }
        }

        context._registerscriptfn = fn;   //xfdl 의 registerScript Function
    };

    nexacro._executeIncludeScript = function (context, url)
    {
        if (!context) return;

        var suburl = nexacro._getServiceLocation(url);
        var scriptlist = context._includescriptlist;
        var len = scriptlist.length;
        var item;
        for (var i = 0; i < len; i++)
        {
            item = scriptlist[i];
            if (item.url == suburl && !item.isexecuted)
            {
                item.isexecuted = true;
                item.fn.call(context, ...nexacro.__getProcessExportArgs(context));
                break;
            }
        }
    };

    nexacro._executeMainScript = function (context)
    {
        if (context && context._registerscriptfn)
        {
            context._registerscriptfn.call(context, ...nexacro.__getProcessExportArgs(context));
        }
    };


    nexacro._cancelTransaction = function (context, id)
    {
        if (!context) return;

        let datalist = context._load_manager.dataList;
        if (!datalist)
            return -1;
        let canceledCnt = 0, j;

        if (id != undefined)
        {
            let datalistid = (typeof id == "string") ? id.split(",") : id;
            if (datalistid.length > 0)
            {
                let datalistfilter = [];
                for (let k = 0; k < datalist.length; k++)
                {
                    datalistfilter[k] = datalist[k].url;
                }

                var datalistfiltered = [], i;
                for (j = 0; datalistfilter.length > j; j++)
                {
                    let datalistfound = false;
                    for (i = 0; datalistid.length > i; i++)
                    {
                        if (datalistid[i] == datalistfilter[j])
                        {
                            datalistfound = true;
                            break;
                        }
                    }
                    if (!datalistfound)
                    {
                        datalistfiltered.push(datalistfilter[j]);
                    }
                }

                for (j = datalistfiltered.length - 1; j >= 0; j--)
                {
                    for (i = datalist.length - 1; i >= 0; i--)
                    {
                        if (datalist[i].url == datalistfiltered[j])
                        {
                            datalist = nexacro._removedatalist(datalist, i);
                        }
                    }
                }
            }
        }

        let datalen = datalist.length;
        for (j = 0; j < datalen; j++)
        {
            let dataitem = datalist[j];
            let dataitem_handle = dataitem.handle;
            dataitem_handle._user_aborted = true;
            dataitem._is_cancel = true;
            nexacro._cancelLoad(dataitem_handle);
            canceledCnt++;
        }
        return canceledCnt;
    };

    //
    //Error 
    nexacro._onHttpSystemError = function (obj, bfireevent, errorobj, errortype, url, returncode, requesturi, locationuri, extramsg)
    {
        var ret = false;
        var commerrorobj = nexacro.MakeCommunicationError(obj, errortype, url, returncode, requesturi, locationuri, extramsg);
        if (bfireevent)
        {
            var environment = nexacro.getEnvironment();
            if (environment)
            {
                ret = environment.on_fire_onerror(obj, commerrorobj.name, commerrorobj.message, errorobj, returncode, requesturi, locationuri);
            }
        }

        nexacro._onFireSystemError(obj, false, commerrorobj.name, 1, commerrorobj.message, true);

        return ret;
    };

    nexacro._onSystemWarning = function (obj, errorcode)
    {
        var args = Array.prototype.slice.call(arguments, 1);
        var errormsg = nexacro._getErrorMessge.apply(this, args);

        this._onFireSystemError(obj, false, errorcode, 2, errormsg, true);
    };

    nexacro._onSystemError = function (obj, errortype, errormsg)
    {
        nexacro._onFireSystemError(obj, true, errortype, 1, errormsg, true);
    };

    //"fatal" : 치명적이 에러인 경우 - 0 
    //"error" : 일반적인 에러인 경우 - 1
    //"warn" : 경고인 경우          - 2
    //"info" : 일반 정보인 경우     - 3
    //"debug" : 디버그 정보인 경우  - 4

    //bsystemlog : 1(systemlog) 2(userlog) 
    //msglevel : 받은 메세지가 warinig 인지 error인지 2(warn) 1(error) 
    nexacro._onFireSystemError = function (errorobj, bfireevent, errortype, msglevel, message, bsystemlog)
    {
        var environment = nexacro.getEnvironment();

        if (bfireevent)
        {
            if (environment)
            {
                environment.on_fire_onerror(environment, errortype, message, errorobj);
            }
        }

        // ignore trace log when without message
        if (message)
        {
            if (environment)
            {
                nexacro._writeTraceLog(msglevel, message, bsystemlog, environment._loglevel, environment._p_traceduration, environment._p_tracemode);
            }
            else
                nexacro._writeTraceLog(msglevel, message, bsystemlog);
        }
    };

    if (!system)
        system = nexacro.System;

} // end of (!nexacro._bInitPlatform)

if (_process)
{
    _process = null;
    __pTimerManager = null;
    __pEventTimer = null;
    __pDelayTask = null;
    __pCallbackTimer = null;
    __pOnceCallbackTimer = null;
    _pAnimationFrame = null;
    __pLoadItem = null;
    __pLoadManager = null;
    __pServiceItem = null;
    __pComponentItem = null;
    __pUpdateItem = null;
    _pLayout = null;
    __pLayoutManager = null;
    __pWindow = null;
    __pFlingHandler = null;
    __pTouchTimer = null;
    __pCubicBezier = null;
    _pEnvironment = null;
    _pResizeManager = null;
}
