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
        _jsContext.FileDialog = nexacro.FileDialog;
        _jsContext.VirtualFile = nexacro.VirtualFile;

        _jsContext.DomParser = nexacro.DomParser;
        _jsContext.Sketch = nexacro.Sketch;
        _jsContext.ColumnInfo = nexacro.DSColumnInfo;
        _jsContext.Plugin = nexacro.Plugin;

        _jsContext.TCPClientSocket = nexacro.TCPClientSocket;

        _jsContext.DragDataFormats = nexacro.DragDataFormats;
        _jsContext.DragDataObject = nexacro.DragDataObject;

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
        _jsContext.FileDialog = null;
        _jsContext.VirtualFile = null;
        _jsContext.DomParser = null;
        _jsContext.Sketch = null;
        _jsContext.ColumnInfo = null;
        _jsContext.Plugin = null;
        _jsContext.TCPClientSocket = null;
    };

    //---------------------------------------------------------------------------------------
    // System Object : Object Type. --> application.system = nexacro.System;
    //---------------------------------------------------------------------------------------
    nexacro.System = {};

    nexacro.System.screenToClientX = function (comp, posX)
    {
        if (comp._control_element)
        {
            var p = nexacro._getElementScreenPosition(comp._control_element);
            return posX - p.x;
        }
    };

    nexacro.System.screenToClientY = function (comp, posY)
    {
        if (comp._control_element)
        {
            var p = nexacro._getElementScreenPosition(comp._control_element);
            return posY - p.y;
        }
    };

    nexacro.System.clientToScreenX = function (comp, posX)
    {
        if (comp._control_element)
        {
            var p = nexacro._getElementScreenPosition(comp._control_element);
            return posX + p.x;
        }
    };

    nexacro.System.clientToScreenY = function (comp, posY)
    {
        if (comp._control_element)
        {
            var p = nexacro._getElementScreenPosition(comp._control_element);
            return posY + p.y;
        }
    };

    //******************************************************************************
    //  Methods
    //******************************************************************************
    nexacro.System.convertRealPath = function (path)
    {
        return nexacro._convertRealPath(path);
    };

    nexacro.System.execBrowser = function (url)
    {
        nexacro._execBrowser(url);
    };

    nexacro.System.execShell = function (exeUrl)
    {
        nexacro._execShell(exeUrl);
    };

    nexacro.System.execNexacro = function (command)
    {
        nexacro._execNexacro(command);
    };

    nexacro.System.setClipboard = function (format, data)
    {
        return nexacro._setClipboard(format, data);
    };

    nexacro.System.getClipboard = function (format)
    {
        return nexacro._getClipboard(format);
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

    nexacro.System._getMobileOrientation = function ()
    {
        var orientation = nexacro._getMobileOrientation();
        switch (orientation)
        {
            case 0:
                {
                    return "Portrait";
                }
                break;
            case 1:
                {
                    return "ReversePortrait";
                }
                break;
            case 2:
                {
                    return "LandscapeLeft";
                }
                break;
            case 3:
                {
                    return "LandscapeRight";
                }
                break;
            default:
                {
                    return "resize";
                }
                break;
        }
    };

    nexacro.System._os = nexacro._OS;
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
    nexacro.System._language = nexacro._getLanguage();
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

    nexacro.System._setNotificationToken = function (notificationtoken)
    {
        nexacro.System.notificationtoken = notificationtoken;
    };

    nexacro.System.saveToImageFile = function (comp, fileName, fileType, compressOption, bIsOverflowClip)
    {
        if (comp)
        {
            return nexacro._saveToImageFile(comp, fileName, fileType, compressOption, bIsOverflowClip);
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

    nexacro.System.saveToImageBase64String = function (comp, bIsOverflowClip)
    {
        if (comp)
        {
            return nexacro._saveToImageBase64String2(comp, bIsOverflowClip);
        }
        return "";
    };


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
                if (pthis.context && !pthis.context._timerManager.deleteTimerItem(pthis))
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
        this.updateList = [];
        this.updateCnt = 0;
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
    __pLoadManager.getUpdateItem = function (url)
    {
        var updates = this.updateList;
        var cnt = updates.length;
        for (var i = 0; i < cnt; i++)
        {
            var item = updates[i];
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
            if (item.url == url)
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
        if (type == "data")
        {
            var svcid = "__preload_" + ((typeof target) == "string" ? target : target.id);
            this.loadPreloadDataModule(url, target, false, false, svcid, args, service);
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
                var handle = nexacro._loadJSModule(url, this, this.on_load_main, cache, service, async);
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
                load_item = new nexacro._LoadItem(url, "globalmodule", null);
                this.globalList.push(load_item);
                this.globalCnt++;
                load_item.handle = nexacro._loadJSText(url, this, this.on_load_globalmodule, service, async);
            }
        }
    };

    //__pLoadManager.loadloadJSText = function (url, cache, async, service)
    //{
    //	if (async == null)
    //		async = true;
    //	if (this.status < 7)
    //	{
    //		var load_item = this.getGlobalItem(url);
    //		if (!load_item)
    //		{
    //			load_item = new nexacro._LoadItem(url, "globalmodule", null);
    //			this.globalList.push(load_item);
    //			this.globalCnt++;
    //			load_item.handle = nexacro._loadJSText(url, this, this.on_load_globalmodule, service, async);
    //		}
    //	}
    //};


    __pLoadManager.loadUpdateModule = function (url, type, targetpath, ref, ver, failpass, service)
    {
        if (this.status < 7)
        {
            var load_item = this.getUpdateItem(url);
            if (!load_item)
            {
                load_item = new nexacro._LoadItem(url, type, null);
                load_item._targetpath = targetpath;
                load_item._ref = ref;
                load_item._ver = ver;
                load_item._failpass = failpass;
                this.updateList.push(load_item);
                this.updateCnt++;
                load_item.handle = nexacro._loadUpdateModule(url, this, this.on_load_updatemodule, service, true, type, targetpath, ref, ver, failpass);
            }
        }
    };

    __pLoadManager.loadIncludeModule = function (url, cache, async, service)
    {
        if (cache == null)
            cache = true;
        if (async == null)
            async = true;

        if (this.status < 7)
        {
            var load_item = this.getLocalItem(url);
            var parent_context;
            if (!load_item)
            {
                load_item = new nexacro._LoadItem(url, "include", this.context);
                this.localList.push(load_item);

                this.localCnt++;
                load_item.handle = nexacro._loadJSModule(url, this, this.on_load_localmodule, cache, service, async);

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
            else
            {
                this.localCnt++;
                load_item.handle = nexacro._loadJSModule(url, this, this.on_load_localmodule, cache, service, async);

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
                load_item = new nexacro._LoadItem(url, "css", this.context);
                this.localList.push(load_item);

                this.localCnt++;

                if (csstype)
                    load_item.handle = nexacro._loadCSSModule(url, this, this.on_load_localmodule, cache, service, async, cssreq);
                else
                    load_item.handle = nexacro._loadJSModule(url, this, this.on_load_localmodule, cache, service, async);
            }
        }
    };

    __pLoadManager.loadJSModule = function (url, cache, async, service)
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
                load_item = new nexacro._LoadItem(url, "text", this.context);
                this.localList.push(load_item);

                this.localCnt++;
                load_item.handle = nexacro._loadJSModule(url, this, this.on_load_localmodule, cache, service, async);
            }
        }
    };


    __pLoadManager.loadPreloadJSModule = function (url, target, cache, async, service)
    {
        if (cache == null)
            cache = false;
        if (async == null)
            async = true;

        var increase = false;
        if (this.status < 6)
        {
            var load_item = this.getPreloadItem("fdl", url);
            var parent_context;
            if (load_item && target)
            {
                if (load_item.addTarget(target) && !load_item._bLoaded)
                {
                    this.preloadCnt++;
                    parent_context = this.context.getParentContext();
                    while (parent_context)
                    {
                        if (!parent_context._is_created)
                            parent_context._load_manager.preloadCnt++;
                        parent_context = parent_context.getParentContext();
                    }
                    increase = true;
                }
            }
            else
            {
                load_item = new nexacro._LoadItem(url, "fdl");
                //load_item.addTarget(target);
                if (target && load_item.addTarget(target))
                {
                    this.preloadCnt++;
                    parent_context = this.context.getParentContext();
                    while (parent_context)
                    {
                        if (!parent_context._is_created)
                            parent_context._load_manager.preloadCnt++;
                        parent_context = parent_context.getParentContext();
                    }
                    increase = true;
                    this.preloadList.push(load_item);
                    load_item.handle = nexacro._loadJSModule(url, this, this.on_load_preloadjsmodule, cache, service, async);
                }
            }
        }
    };

    __pLoadManager.loadPreloadDataModule = function (url, target, cache, async, svcid, args, service)
    {
        if (nexacro.isDesignMode) return;
        var increase = false;
        if (this.status < 6)
        {
            var load_item = this.getPreloadItem("data", svcid);
            if (load_item && target)
            {
                if (load_item.addTarget(target))
                {
                    this.preloadCnt++;
                    increase = true;
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
                    increase = true;

                    this.preloadList.push(load_item);
                    load_item.handle = nexacro._preloadData(url, this, this.on_load_preloaddatamodule, service, svcid, referer, args, async, 0, false);
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
            load_item = new nexacro._LoadItem(svcid, "data", this.context);
            load_item._requrl = url;

            this.dataList.push(load_item);
            this.dataCnt++;
            load_item._context_callback = callback;
            load_item.handle = nexacro._loadData(url, this, this.on_load_datamodule, service, this.context, svcid, indatasets, outdatasets, parameters, async, datatype, compress);
        }
        else
        {
            // 비동기통신일때 동일한id로 여러번 transaction시 callback이 한번만 호출되는 현상
            this.context._onHttpTransactionError(this.context, true, this.context, "comm_fail_duplication_svcid", svcid, 10405, url, null);
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
            load_item = new nexacro._LoadItem(url, "css", this.context);
            this.localList.push(load_item);
        }

        this.localCnt++;

        if (csstype)
            load_item.handle = nexacro._loadCSSModule(url, this, this.on_reload_localmodule, cache, service, async, cssreq);
        else
            load_item.handle = nexacro._loadJSModule(url, this, this.on_reload_localmodule, cache, service, async);
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
                        module.refs = ++refs;
                    }
                }
                module.call(this.context);
            }
            else
            {
                // adl 
                var application = nexacro.getApplication();
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

    __pLoadManager.on_load_globalmodule = function (url, errstatus, jstext, fireerrorcode, returncode, requesturi, locationuri, extramsg)
    {
        var load_Item = this.getGlobalItem(url);
        if (load_Item)
        {
            load_Item.handle = null;
            if (errstatus === 0)
            {
                if (jstext !== "")
                {
                    load_Item.data = jstext;
                }
            }
            else
            {
                load_Item.errcode = errstatus;
                nexacro._onHttpSystemError(this.context, true, this.context, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
            }
            this.globalCnt--;
            this._check_fire_oninit(); // _check_fire_oninit
        }
    };
    __pLoadManager.on_load_updatemodule = function (url, errstatus, binarymodule, fireerrorcode, returncode, requesturi, locationuri, extramsg)
    {
        var load_Item = this.getUpdateItem(url);
        if (load_Item)
        {
            load_Item.handle = null;

            if (errstatus !== 0)
            {
                load_Item.errcode = errstatus;
                nexacro._onHttpSystemError(this.context, true, this.context, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
            }
            this.updateCnt--;
            this._check_fire_oninit(); // _check_fire_oninit
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
                                    module.refs = ++refs;
                                }
                            }
                            module.call(this.context, load_Item.url);
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
            var parent_context = this.context.getParentContext();
            while (parent_context && parent_context._load_manager.childlocalCnt > 0)
            {

                parent_context._load_manager.childlocalCnt--;
                parent_context._load_manager.preloadCnt--;
                parent_context._load_manager._check_fire_onload();

                parent_context = parent_context.getParentContext();
            }
            return;
        }
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
                                module.refs = ++refs;
                            }
                        }
                        module.call(this.context, load_Item.url);
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
            var parent_context = this.context.getParentContext();
            while (parent_context && parent_context._load_manager.childlocalCnt > 0)
            {

                parent_context._load_manager.childlocalCnt--;
                parent_context._load_manager.preloadCnt--;
                parent_context._load_manager._check_fire_onload();

                parent_context = parent_context.getParentContext();
            }
            return;
        }
    };
    __pLoadManager.on_load_localcssmodule = function (url, errstatus, module, fireerrorcode, returncode, requesturi, locationuri, extramsg)
    {
        var load_Item = this.getLocalItem(url);
        if (load_Item)
        {

            //var handle = load_Item.handle;
            load_Item.handle = null;
            if (errstatus === 0)
            {
                load_Item._bLoaded = true;
                //load_Item.module = module;                
            }
            else
            {
                load_Item.errcode = errstatus;
                nexacro._onHttpSystemError(this.context, true, this.context, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
            }

            this.localCnt--;
            this._check_fire_oninit();  // _check_fire_oninit()

            // sync 인 경우 handle 이 없다.
            var parent_context = this.context.getParentContext();
            while (parent_context && parent_context._load_manager.childlocalCnt > 0)
            {

                parent_context._load_manager.childlocalCnt--;
                parent_context._load_manager.preloadCnt--;
                parent_context._load_manager._check_fire_onload();

                parent_context = parent_context.getParentContext();
            }
            return;
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
                    if (this.context.components)
                    {
                        var target = targets[i];
                        if ((typeof target) == "string")
                        {
                            target = this.context.components[target];
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
        var load_Item = this.getPreloadItem("data", url);
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
                    if (this.context.all)
                    {
                        var target = targets[i];
                        if ((typeof target) == "string")
                        {
                            target = this.context.all[target];
                        }
                        if (target && target.on_preload_data)
                        {
                            target.on_preload_data(load_Item._requrl, errstatus, data, fireerrorcode, returncode, requesturi, locationuri, extramsg);
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

                    ret = this.context._onHttpTransactionError(this.context, true, this.context, fireerrorcode, requesturi, returncode, requesturi, locationuri, extramsg);

                    if (fireerrorcode != "comm_cancel_byuser" && fireerrorcode != "comm_stop_transaction_byesc")
                        ret = false;
                    if (ret) return true;
                }
            }

            if (fireerrorcode == "comm_cancel_byuser" || fireerrorcode == "comm_stop_transaction_byesc")
            {
                // handle이 없는경우는 async=false일때            
                if (ret && load_Item.handle && !load_Item.handle._user_aborted && load_Item.handle._user_aborted !== undefined)
                    return ret;
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

    __pLoadManager.on_reload_css = function (url, errstatus, module, fireerrorcode, returncode, requesturi, locationuri, extramsg)
    {
        var load_Item = this.getLocalItem(url);
        if (load_Item)
        {
            //var handle = load_Item.handle;
            load_Item.handle = null;
            if (errstatus === 0 && module && typeof (module) == "function")
            {
                load_Item._bLoaded = true;

                if (nexacro._Browser == "Runtime")
                {
                    if (module.bcache)
                    {
                        var refs = module.refs | 0;
                        module.refs = ++refs;
                    }
                }
                module.call(this.context, load_Item.url);
                load_Item.module = null;
            }
            else
            {
                load_Item.errcode = errstatus;
                nexacro._onHttpSystemError(this.context, true, this.context, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
            }

            return;
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

    __pLoadManager.on_child_load_completed = function (url, child)
    {
        var load_Item = this.getPreloadItem("fdl", url);
        if (load_Item)
        {
            if (load_Item.deleteTarget(child))
            {
                this.preloadCnt--;
                this.context._check_fire_onload();
            }
        }
    };

    __pLoadManager._check_fire_oninit = function ()
    {
        if (this.status < 2 || !this._is_mainloaded)
            return false;

        var cnt, i, item;
        if (this.status == 2)
        {
            if (this.updateCnt > 0)
                return false;
            else
            {
                cnt = this.updateList.length;
                for (i = 0; i < cnt; i++)
                {
                    item = this.updateList[i];
                    if (item._bLoaded === false)
                    {
                        item._bLoaded = true;
                        if (item.errorcode >= 0)
                        {
                            nexacro._completedUpdateResource(item.data, item.url, item._type, item._targetpath, item._ref, item._failpass, i, cnt);
                            item.data = null;
                        }
                    }
                }
                this.status = 3;
            }
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
                        if (item.errorcode >= 0)
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
                                        item.module.refs = ++refs;
                                    }
                                }
                                item.module.call(this.context);
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

        if (nexacro._Browser == "Runtime")
        {
            var cache = nexacro._CacheList[this.main_url];
            if (cache)
            {
                var module = cache.data;
                if (typeof (module) == "function" && module.bcache)
                {
                    var refs = module.refs | 0;
                    if (refs > 0) refs = --module.refs;
                    if (refs == 0)
                        delete nexacro._CacheList[this.main_url];
                }
            }
        }

        this._is_mainloaded = false;

        var updates = this.updateList;
        var ucnt = updates.length, i;
        for (i = 0; i < ucnt; i++)
        {
            var updateitem = updates[i];
            if (updateitem.handle)
                nexacro._cancelLoad(updateitem.handle);
            updateitem.destroy();
        }
        updates.splice(0, ucnt);

        var globals = this.globalList;
        var gcnt = globals.length;
        for (i = 0; i < gcnt; i++)
        {
            var globalitem = globals[i];
            if (globalitem.handle)
                nexacro._cancelLoad(globalitem.handle);
            globalitem.destroy();
        }
        globals.splice(0, gcnt);

        var locals = this.localList;
        var lcnt = locals.length;
        for (i = 0; i < lcnt; i++)
        {
            var localitem = locals[i];
            if (localitem.handle)
                nexacro._cancelLoad(localitem.handle, localitem.url);

            if (nexacro._Browser == "Runtime")
            {
                var cache = nexacro._CacheList[localitem.url];
                if (cache)
                {
                    var module = cache.data;
                    if (typeof (module) == "function" && module.bcache)
                    {
                        var refs = module.refs | 0;
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
        for (i = 0; i < pcnt; i++)
        {
            var preloaditem = preloads[i];
            if (preloaditem.handle)
                nexacro._cancelLoad(preloaditem.handle);
            preloaditem.destroy();
        }
        preloads.splice(0, pcnt);

        var datas = this.dataList;
        var dcnt = datas.length;
        for (i = 0; i < dcnt; i++)
        {
            var dataitem = datas[i];
            if (dataitem.handle)
                nexacro._cancelLoad(dataitem.handle);
            dataitem.destroy();
        }
        datas.splice(0, dcnt);

        var trs = this.transactionList;
        if (trs)
            trs.splice(0, trs.length);
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
        this.name = name;
        this.screenid = screenid;
        this.width = w;
        this.height = h;
        this._form = obj;
        this.change_fn = changefn;
        //this.recover_fn = recoverfn;
    };

    var _pLayout = nexacro._createPrototype(nexacro.Object, nexacro.Layout);
    nexacro.Layout.prototype = _pLayout;
    _pLayout._type_name = "Layout";
    _pLayout.stepcount = 0;
    _pLayout.stepindex = 0;
    _pLayout.mobileorientation = "";  //설정값이 없으면 모든 경우에 선택대상   'portrait', 'landscape', "" 

    _pLayout.destroy = function ()
    {
        this.name = "";
        this.screenid = "";
        this.description = "";
        this.context = null;
        this.width = 0;
        this.height = 0;
        this._form = null;
        this.change_fn = null;
        //this.recover_fn = null;
        this.stepcount = 0;
        this.stepindex = 0;
        this.mobileorientation = undefined;
    };

    _pLayout.set_name = function (v)
    {
        this.name = v;
    };

    _pLayout.set_screenid = function (v)
    {
        this.screenid = v;
    };

    _pLayout.set_description = function (v)
    {
        this.description = v;
    };

    _pLayout.set_width = function (v)
    {
        this.width = v;
    };

    _pLayout.set_height = function (v)
    {
        this.height = v;
    };

    _pLayout.set_stepcount = function (v)
    {
        v = parseInt(v) | 0;
        if (v !== this.stepcount)
        {
            if (v === "" || (+v) != (+v))
            {
                v = 0;
            }
            this.stepcount = v;
        }
    };

    _pLayout.set_stepindex = function (v)
    {
        v = parseInt(v) | 0;
        if (v != this.stepindex && v < this.stepcount)
        {
            this.stepindex = v;
        }
    };

    _pLayout.set_mobileorientation = function (v)
    {
        this.mobileorientation = v;
    };

    //---------------------------------------------------------------------------------------
    // LayoutManager
    //---------------------------------------------------------------------------------------
    nexacro._LayoutManager = function (context)
    {
        this.context = context;

        //------------------- internal variable ------------------ //
        this._layout_list = [];
    };
    var __pLayoutManager = nexacro._createPrototype(nexacro.Object, nexacro._LayoutManager);
    nexacro._LayoutManager.prototype = __pLayoutManager;
    __pLayoutManager._type_name = "LayoutManager";

    __pLayoutManager.checkValid = function (form, szContainer)
    {
        if (!form) return -1;
        var layout_list = form._layout_list;
        if (!layout_list) return -1;
        var layout_len = layout_list.length;
        if (layout_len === 0) return -1;
        var abs_gap_min_x = 2000, gap_min_x = 2000/*, gap_min_y = 2000*/, abs_gap_min_y = 2000;
        var abs_gap_x = -1, gap_x = 0, abs_gap_y = -1;
        var correct_type = -1;
        var optimal_layout_num = -1;

        // var over_layout_width = [], over_layout_height = [];
        var is_portrait = szContainer.cx < szContainer.cy ? true : false;
        var mobileorientation = is_portrait ? "portrait" : "landscape";

        var curscreenid = nexacro._getCurrentScreenID();
        var curscreentype = nexacro._getCurrentScreenType();

        var i, layout;


        function checkScreenSize()
        {
            gap_x = szContainer.cx - layout.width;
            abs_gap_x = Math.abs(gap_x);

            //figure out
            if (abs_gap_min_x > abs_gap_x)
            {
                gap_min_x = gap_x;
                abs_gap_min_x = abs_gap_x;
                abs_gap_min_y = Math.abs(szContainer.cy - layout.height);
                optimal_layout_num = i;
            }
            else if (abs_gap_min_x == abs_gap_x)
            {
                if (gap_min_x == abs_gap_x)
                {
                    abs_gap_y = Math.abs(szContainer.cy - layout.height);
                    if (abs_gap_min_y > abs_gap_y)
                    {
                        optimal_layout_num = i;
                    }
                }
            }
        }


        for (i = 0; i < layout_len; i++)
        {
            layout = layout_list[i];

            if (layout.screenid.length > 0)
            {
                var layout_screenid_list = layout.screenid.split(",");
                if (layout_screenid_list.indexOf(curscreenid) < 0)
                    continue;
            }
            else
                continue; // no screenid skip

            correct_type = 1;
            //mobileorientation
            if (nexacro._isDesktop())
                ;
            else if (curscreentype != "desktop" && layout.mobileorientation && layout.mobileorientation != mobileorientation)
                continue;
            correct_type = 2;
            checkScreenSize();
        }

        //if there is no screenid
        if (optimal_layout_num < 0 && correct_type < 0)
        {
            for (i = 0; i < layout_len; i++)
            {
                layout = layout_list[i];
                if (nexacro._isDesktop())
                    ;
                else if (curscreentype != "desktop" && layout.mobileorientation && layout.mobileorientation != mobileorientation)
                    continue;
                checkScreenSize();
            }
        }

        if (optimal_layout_num < 0 && correct_type == 1)
        {
            for (i = 0; i < layout_len; i++)
            {
                layout = layout_list[i];
                checkScreenSize();
            }
        }


        //defalut layout 
        if (optimal_layout_num < 0)
        {
            optimal_layout_num = 0;
        }

        //matched screen and best layout are exist, but matched mobileorientation is not exist.
        //if (correct_type < 0)
        //{
        //    //Todo.
        //}
        return optimal_layout_num;
    };

    __pLayoutManager.changeLayout = function (form, layout)
    {
        var current_layout = null, def_layout = null;

        if (form == null || layout == null)
            return;

        if (form._cur_real_layout == layout.name)
            return;

        if (form._current_layout_name == layout.name)
        {
            form._cur_real_layout = form._current_layout_name;
            return;
        }

        if (form._current_layout_name === "")
            form._current_layout_name = "default";


        if (form._current_layout_name == "default")
        {
            current_layout = form._default_layout;
        }
        else
        {
            current_layout = form._layout_list.get_item(form._current_layout_name);
            def_layout = form._default_layout;
        }

        if (current_layout == null)
            return;


        form._current_layout_name = layout.name;
        form._cur_real_layout = layout.name;

        this.loadLayout(form, current_layout, layout, def_layout);

    };

    __pLayoutManager.loadLayout = function (form, cur, target, def)
    {
        var old_stepindex = -1, old_stepcount = 0;
        var new_stepindex = -1, new_stepcount = 0;
        if (cur)
        {
            old_stepindex = cur.stepindex;
            old_stepcount = cur.stepcount;
        }
        if (target)
        {
            new_stepindex = target.stepindex;
            new_stepcount = target.stepcount;

            if (form._layout_list.length > 0)
                form.on_fire_onbeforelayoutchange(form, "onbeforelayoutchange", cur, target.name);
        }

        if (form._layout_list.length > 0)
        {
            if (def && def.change_fn)
            {
                def.change_fn.call(this, form);
            }
            if (target && target.change_fn)
            {
                target.change_fn.call(this, form);
            }
        }
        form._on_prepare_stepcontents(old_stepcount, old_stepindex, new_stepcount, new_stepindex);
        form._on_refresh_stepcontents(old_stepcount, old_stepindex, new_stepcount, new_stepindex);
    };

    __pLayoutManager.refreshStepControl = function (form, cur, target, def)
    {
        var old_stepindex = -1, old_stepcount = 0;
        var new_stepindex = -1, new_stepcount = 0;
        if (cur)
        {
            old_stepindex = cur.stepindex;
            old_stepcount = cur.stepcount;
        }
        if (target)
        {
            new_stepindex = target.stepindex;
            new_stepcount = target.stepcount;
        }

        form._on_prepare_stepcontents(old_stepcount, old_stepindex, new_stepcount, new_stepindex);
        form._on_refresh_stepcontents(old_stepcount, old_stepindex, new_stepcount, new_stepindex);
    };

    __pLayoutManager.getNormalLayout = function (form)
    {
        var len = form._layout_list.length;
        for (var i = 0; i < len; i++)
        {
            if (this.GetLayoutName(form, i) == "default")
            {
                return form._layout_list.get_item(i);
            }
        }

        return undefined;
    };

    __pLayoutManager.getLayoutName = function (form, nIdx)
    {
        if (form == null)
        {
            return "";
        }

        return form._layout_list[nIdx].name;
    };

    __pLayoutManager.clearLayout = function (form)
    {
        if (form == null)
        {
            return;
        }
        var layout_list = form._layout_list;
        var len = layout_list.length;
        for (var i = 0; i < len; i++)
        {
            var layout = layout_list.get_item(i);
            layout.destroy();
        }
        form._layout_list.clear();
    };

    __pLayoutManager.getCurrentLayout = function (form)
    {
        this.checkValid(form, { cx: form._adjust_width, cy: form._adjust_height });
        var layout = form._layout_list[form._current_layout_name];

        return layout || form._default_layout;
    };

    __pLayoutManager.getStepCount = function (form)
    {
        if (!form) return 0;

        var current_layout = this.getCurrentLayout(form);
        if (current_layout)
        {
            return current_layout.stepcount;
        }
        else
        {
            return 0;
        }
    };
    __pLayoutManager.getCurrStepIndex = function (form)
    {
        if (!form) return 0;

        var current_layout = this.getCurrentLayout(form);
        if (current_layout)
        {
            return current_layout.stepindex;
        }
        else
        {
            return 0;
        }
    };

    __pLayoutManager.setStepIndex = function (form, index)
    {
        if (!form) return 0;

        var current_layout = this.getCurrentLayout(form);
        var stepcount = this.getStepCount(form);

        if (index < 0)
        {
            index = current_layout.stepindex;
        }
        if (stepcount < 0)
        {
            return;
        }

        current_layout.stepindex = index;
    };

    __pLayoutManager.__onbeforelayoutchange = function (obj/*, e*/)
    {
        if (obj)
        {
            var current_layout = this.getCurrentLayout(obj);
            obj._updateStepManager(current_layout);
        }
    };

    __pLayoutManager.__onlayoutchanged = function (obj/*, e*/)
    {
        var stepmanager = obj._stepmanager;
        if (stepmanager)
        {
            stepmanager.initPositionStep();
        }
    };

    nexacro._getLayoutManager = function ()
    {
        return nexacro._layout_manager ? nexacro._layout_manager : nexacro._layout_manager = new nexacro._LayoutManager();
    };


    //==============================================================================
    // nexacro.Window
    //==============================================================================
    nexacro._Window = function (id, parent, is_main)
    {
        this.id = id;
        this.parent = parent;
        this.frame = null;
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

        this._cur_screen_pos = { "x": undefined, "y": undefined }; // for Checking mousemove event
        this._cur_wheel_pos = { "x": undefined, "y": undefined }; // for Checking mousewheel event
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


    };

    var __pWindow = nexacro._createPrototype(nexacro.Object, nexacro._Window);
    nexacro._Window.prototype = __pWindow;
    __pWindow._type_name = "Window";

    __pWindow._gesture_manager = null;

    //------------------------------------------------------------------------------
    __pWindow.attachHandle = function (handle)
    {
        if (!this.handle)
        {
            this.handle = handle;
            this._doc = this._dest_doc = nexacro._getWindowDocumentHandle(handle);
            this.dest_handle = nexacro._getWindowDestinationHandle(handle);

            this.left = nexacro._getWindowHandlePosX(handle);
            this.top = nexacro._getWindowHandlePosY(handle);
            this.width = nexacro._getWindowHandleOuterWidth(handle);
            this.height = nexacro._getWindowHandleOuterHeight(handle);
            var clientWidth = nexacro._getWindowHandleClientWidth(handle);
            var clientHeight = nexacro._getWindowHandleClientHeight(handle);
            this.clientWidth = (clientWidth === 0) ? this.width : clientWidth;
            this.clientHeight = (clientHeight === 0) ? this.height : clientHeight;
            this._gap_client_width = this.width - this.clientWidth;
            this._gap_client_height = this.height - this.clientHeight;
        }
    };

    __pWindow.attachFrame = function (frame, refresh_flag)
    {
        this.frame = frame;
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
        nexacro._postMessage(id, this, target_comp);
    };

    __pWindow._onPrepareWindowHandle = function ()
    {
        if (!this._prepared_flag)
        {
            this._prepared_flag = true;

            if (this.frame)
                this.frame.on_created();

        }
    };
    __pWindow._onPrepareModalWindowHandle = function ()
    {
        if (!this._prepared_flag)
        {
            this._prepared_flag = true;
            if (this.frame)
            {
                this.frame.createComponent();
                this.frame.on_created();
            }
        }
    };
    __pWindow.refresh = function ()
    {
        if (this.handle && this._prepared_flag && this.frame)
        {
            this.frame.on_refresh();
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
        var handle = null;
        if (_parent)
        {
            handle = _parent.handle;
            _parent._child_list.add_item(name, this);
        }
        nexacro._createWindowHandle(_parent, this, name, left, top, width, height, resizable, layered, taskbar, this._is_main);
    };


    __pWindow.createModal = function (_parent, name, width, height, left, top, resizable, layered, lockmode)
    {
        var handle = null;
        if (_parent)
        {
            handle = _parent.handle;
            _parent._child_list.add_item(name, this);
        }
        return nexacro._createModalWindowHandle(_parent, this, name, left, top, width, height, resizable, layered, lockmode);
    };

    __pWindow.createModalAsync = function (_parent, name, width, height, left, top, resizable, layered, lockmode)
    {
        var handle = null;
        if (_parent)
        {
            handle = _parent.handle;
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
            this._lock_list[0] = this.frame._runbase_window;

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
            var locklen = this._lock_list.length;
            for (var i = locklen - 1; i >= 0; i--)
            {
                var locked_window = this._lock_list[i];
                if (!locked_window || !locked_window.frame)
                    continue;
                nexacro._setWindowHandleLock(locked_window.handle, false, this.handle, true);
            }
        }

        // close handle
        if (this.handle)
        {
            var repeatInfo = nexacro._cur_repeat_info;
            if (repeatInfo && repeatInfo.targetwin == this)
            {
                if (repeatInfo._timer)
                {
                    nexacro._clearSystemTimer(this.handle, repeatInfo._timer);
                }
            }
            nexacro._closeWindowHandle(this.handle);
        }

    };

    __pWindow._destroyInternalPart = function ()
    {

        nexacro._removeProtocols();

        if (this.parent)
            this.parent._child_list.delete_item(this.id);

        // destroy modal frames
        var modal_frame_stack = this._modal_frame_stack;
        var modal_frame_stack_len = modal_frame_stack.length;
        for (var i = modal_frame_stack_len - 1; i >= 0; i--)
        {
            var modal_frame_info = modal_frame_stack[i];
            var frame = modal_frame_info[0];
            if (frame._is_alive)
                frame._destroy();
        }

        // destroy Self
        if (this.frame)
        {

            if (!this.frame._is_main)
                this.frame._on_close();

            if (this.frame._is_alive)
                this.frame._destroy();

        }

        nexacro._destroyPopupFrameInfo(this);
        nexacro._destroyManagerFrame(this.handle);
        this._doc = this._dest_doc = null;
        this.dest_handle = null;
        this.parent = null;
        this._postmsg_data_que = null;

        //////////////////////////////////////////////////////////////////////////
        // clear event handlers
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
    };

    //------------------------------------------------------------------------------
    __pWindow.moveBy = function (dx, dy)
    {
        if (this.handle && dx && dy)
        {
            var l = this.left + (dx | 0);
            var t = this.top + (dy | 0);
            nexacro._setWindowHandlePos(this.handle, l, t);
            this.left = nexacro._getWindowHandlePosX(this.handle);
            this.top = nexacro._getWindowHandlePosY(this.handle);
        }
    };

    __pWindow.moveTo = function (l, t)
    {
        if (this.handle)
        {
            if (l === undefined || l === null) l = this.left;
            if (t === undefined || t === null) t = this.top;
            nexacro._setWindowHandlePos(this.handle, l, t);
            this.left = nexacro._getWindowHandlePosX(this.handle);
            this.top = nexacro._getWindowHandlePosY(this.handle);
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
            this.left = nexacro._getWindowHandlePosX(this.handle);
            this.top = nexacro._getWindowHandlePosY(this.handle);
            this.width = nexacro._getWindowHandleOuterWidth(this.handle);
            this.height = nexacro._getWindowHandleOuterHeight(this.handle);
            this.clientWidth = nexacro._getWindowHandleClientWidth(this.handle);
            this.clientHeight = nexacro._getWindowHandleClientHeight(this.handle);
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
            this.clientWidth = nexacro._getWindowHandleClientWidth(this.handle);
            this.clientHeight = nexacro._getWindowHandleClientHeight(this.handle);
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
            this.left = nexacro._getWindowHandlePosX(this.handle);
        return this.left;
    };
    __pWindow.getTop = function ()
    {
        if (this.handle)
            this.top = nexacro._getWindowHandlePosY(this.handle);
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
        var frame = this._getLastModalFrame();
        if (frame)
            return frame;

        frame = this.frame;
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
                obj = null;
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
        if (x === undefined && y === undefined)
        {
            var tmp = elem;
            while (tmp && !tmp._is_component)
            {
                tmp = tmp.parent;
            }
            return tmp;
        }
        else
        {
            if (!elem) return [elem, x, y];
            var tmp = elem;
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
        if (x === undefined && y === undefined)
        {
            var tmp = elem;
            while (tmp)
            {
                if (tmp && tmp._is_component)
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
            var tmp = elem;
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
        if (this.frame)
            return this.frame._control_element;
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
            return popup.linkedcontrol.parent.control_element;
        return popup;
    };

    __pWindow._flashWindow = function (type, count, interval)
    {
        return nexacro._flashWindow(this.handle, type, count, interval);
    };



    __pWindow._closeChildWindows = function (is_close_all)
    {
        var child_len, i;
        if (is_close_all)
        {
            var popupframes = nexacro.getPopupFrames();
            if (popupframes)
            {
                child_len = popupframes.length;
                for (i = child_len - 1; i >= 0; i--)
                {
                    var child = popupframes[i]._window;
                    if (child && child.frame && child.frame._is_alive)
                    {
                        child._ignore_close_confirm = true;
                        child.frame._destroy();
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
                var child = this._child_list[i];
                if (!child || child.parent != this) // possible?
                    continue;

                if (child.frame && child.frame._is_alive)
                {
                    child._ignore_close_confirm = true;
                    child.frame._destroy();
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
        var application = nexacro.getApplication();
        if (application)
        {
            var form = application.getActiveForm();
            if (form)
            {
                var focus_comp;
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
                        var _window = form._getWindow();
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
                        focus_comp._adjust_top + focus_comp._adjust_height);

                    if (nexacro._enableaccessibility)
                    {
                        if (nexacro._accessibilitytype == 5)
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
    __pWindow._is_hotkey = false;

    __pWindow._on_default_sys_message = function (id)
    {
        var id_arr = id.split("--boundary--");
        if (id_arr.length > 1)
        {
            // cors message
            var data = this._postmsg_data_que.shift();
            if (data)
            {
                var e = { id: data.id, message: id_arr[1], data: data.userdata };

                data.func.call(data.target, e);
            }
        }
        else
        {
            // standard message
            var data = this._postmsg_data_que.shift();
            if (data)
            {
                var e = { id: data.id, data: data.userdata };

                data.func.call(data.target, e);
            }
        }
    };

    __pWindow._on_default_sys_lbuttondown = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY)
    {
        nexacro._gap_client_height = screenY - windowY;
        nexacro._gap_client_width = screenX - windowX;

        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);

        this._lbuttondown_wx = windowX;
        this._lbuttondown_wy = windowY;
        this._cur_ldown_elem = elem; //save elem at lbuttondown.

        if (elem && elem._is_track)
        {
            if (nexacro._current_popups.length > 0)
            {
                var is_capture = nexacro._current_popups[0]._track_capture;
                var comp = this.findComponent(elem);
                nexacro._checkClosePopupComponent(comp, false);
                var cur_popup = nexacro._current_popups[0];
                if (!is_capture)
                {
                    this._click_cancel = false;
                }
                else if (!cur_popup)
                {
                    this._click_cancel = true;
                    return false;
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
            var comp = this.findComponent(elem);
            if (comp)
            {
                if (nexacro._current_popups.length > 0)
                {
                    var is_capture = nexacro._current_popups[0]._track_capture;
                    nexacro._checkClosePopupComponent(comp, true);
                    var cur_popup = nexacro._current_popups[0];
                    if (!is_capture)
                    {
                        this._click_cancel = false;
                    }
                    else if (!cur_popup)
                    {
                        this._click_cancel = true;
                        return false;
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

                ret = firecur_comp._on_lbuttondown(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
            }
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);

        return ret;
    };

    __pWindow._on_touch_to_lbuttondown = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY)
    {
        nexacro._gap_client_height = screenY - windowY;
        nexacro._gap_client_width = screenX - windowX;

        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);

        this._lbuttondown_wx = windowX;
        this._lbuttondown_wy = windowY;
        this._cur_ldown_elem = elem; //save elem at lbuttondown.

        if (elem && elem._is_track)
        {
            if (nexacro._current_popups.length > 0)
            {
                var is_capture = nexacro._current_popups[0]._track_capture;
                var comp = this.findComponent(elem);
                nexacro._checkClosePopupComponent(comp, false);
                var cur_popup = nexacro._current_popups[0];
                if (!is_capture)
                {
                    this._click_cancel = false;
                }
                else if (!cur_popup)
                {
                    this._click_cancel = true;
                    return false;
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
            var comp = this.findComponent(elem);
            if (comp)
            {
                if (nexacro._current_popups.length > 0)
                {
                    var is_capture = nexacro._current_popups[0]._track_capture;
                    nexacro._checkClosePopupComponent(comp, true);
                    var cur_popup = nexacro._current_popups[0];
                    if (!is_capture)
                    {
                        this._click_cancel = false;
                    }
                    else if (!cur_popup)
                    {
                        this._click_cancel = true;
                        return false;
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

                ret = firecur_comp._on_touch_lbuttondown(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);

                return { cp: comp, cX: canvasX, cY: canvasY };
            }
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);
    };

    __pWindow._on_lbuttondown = function (/*elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_rbuttondown = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY)
    {
        nexacro._gap_client_height = screenY - windowY;
        nexacro._gap_client_width = screenX - windowX;

        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);
        this._cur_rdown_elem = elem; //save elem at lbuttondown.
        var comp = this.findComponent(elem);
        if (comp)
        {
            if (nexacro._current_popups.length > 0)
            {
                var is_capture = nexacro._current_popups[0]._track_capture;
                nexacro._checkClosePopupComponent(comp);
                var cur_popup = nexacro._current_popups[0];
                if (!is_capture)
                {
                    this._click_cancel = false;
                }
                else if (!cur_popup)
                {
                    this._click_cancel = true;
                    return false;
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

            ret = firecur_comp._on_rbuttondown(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);

        return ret;
    };

    __pWindow._on_rbuttondown = function (/*elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_lbuttonup = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY)
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
            if (comp)
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

                comp._on_drop(elem, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
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
            _is_track = true;
        }

        if (extratrackInfo)
        {
            extratrackInfo.distX = windowX - extratrackInfo.startX;
            extratrackInfo.distY = windowY - extratrackInfo.startY;
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

            ret = firecur_comp._on_lbuttonup(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, undefined, undefined, undefined, upelem);

            if (!checkup_comp.onlbuttonup || (checkup_comp.onlbuttonup && !checkup_comp.onlbuttonup.defaultprevented))
            {
                var downcomp = firecur_comp;
                var upcomp = this.findComponent(upelem);
                // pseudo 변경 시 IE에서 stretch , quad에 따라서 destroy 후 create 하는 경우 mouseout event 발생. 
                // 이로 인해 up되는 시점에 upelem을 정상적으로 전달 못하고 mainframe을 넘기는 경우 발생. 예외 처리 
                if (upcomp && upcomp._is_main && downcomp != upcomp)
                {
                    upcomp = firecur_comp;
                }
                //track 으로 처리되는 경우에는 click 발생안함 
                if (downcomp && upcomp && downcomp == upcomp)
                {
                    if (!_is_track || (_is_track && upcomp != trackInfo.target))
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
                        if (!_is_input || _is_click || _is_drag || (!_is_drag && !_is_click && _is_text))
                        {
                            upcomp._on_click(upelem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
                        }
                    }
                }
            }
            _is_drag = false;

            if (firecur_comp._is_alive)
                firecur_comp._on_last_lbuttonup();
            else if (firecur_comp._is_subcontrol && firecur_rootcomp)
                firecur_rootcomp._on_last_lbuttonup();
        }

        nexacro._cur_drag_info = null;
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

    __pWindow._on_default_sys_rbuttonup = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY)
    {
        if (this._click_cancel)
        {
            this._click_cancel = false;
            return;
        }

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

            ret = firecur_comp._on_rbuttonup(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, undefined, undefined, undefined, elem);
        }

        this._cur_rdown_elem = null;

        if (is_runbase) nexacro._setRunBaseWindow(null);
    };

    __pWindow._on_rbuttonup = function (/*elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_mouseup = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY)
    {
        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);
        var comp = this.findComponent(elem);
        if (comp)
        {
            var elem_pos, canvasX, canvasY;
            if (comp._control_element == elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
            {
                canvasX = offsetX + comp[1];
                canvasY = offsetY + comp[2];
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

            ret = firecur_comp._on_mouseup(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY, undefined, undefined, undefined, elem);
        }
        this._cur_mdown_elem = null;

        if (is_runbase) nexacro._setRunBaseWindow(null);

        return ret;
    };

    __pWindow._on_default_sys_mousedown = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY)
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

            ret = firecur_comp._on_mousedown(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);

        return ret;
    };

    __pWindow._on_default_sys_mousemove = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY)
    {
        var ret;
        var dragInfo = nexacro._cur_drag_info;
        var repeatInfo = nexacro._cur_repeat_info;
        var trackInfo = nexacro._cur_track_info;
        var extratrackInfo = nexacro._cur_extra_track_info;
        var comp, evt_elem = elem;
        var elem_pos, canvasX, canvasY;
        if (dragInfo && dragInfo.targetwin == this)
        {
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
                    }
                    else if (comp._control_element == evt_elem && nexacro._use_offset && offsetX != undefined && offsetY != undefined)
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

                    if (comp)
                    {

                        ret = comp._on_drag(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
                        if (ret && ret[0] === true && nexacro._cur_drag_info)
                        {
                            dragInfo.isDragging = ret[0];
                            dragInfo.target = ret[1];
                            dragInfo.referTarget = ret[2];
                            dragInfo.data = ret[3];
                            dragInfo.userdata = ret[4];
                            comp._on_dragmove(elem, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
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
                    nexacro._cur_drag_info = null;
                }
                //IE에서 mousedown과 동시에 mousemove가 들어오는 경우에 drag정보가 지워져 drag가 발생 안하는 경우가 있음
                //application._cur_drag_info = null;
            }
            else // (!dragInfo.isDragging)
            {
                comp = this.findComponent(elem);
                if (comp)
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

                    comp._on_dragmove(elem, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
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
            if (comp && comp._isRtl())
            {
                trackInfo.distX = trackInfo.startX - windowX;
                trackInfo.distY = windowY - trackInfo.startY;
            }
            else
            {
                trackInfo.distX = windowX - trackInfo.startX;
                trackInfo.distY = windowY - trackInfo.startY;
            }

            trackInfo.target._on_movetrack(trackInfo.distX, trackInfo.distY, trackInfo.data, windowX, windowY);
        }

        if (extratrackInfo)
        {
            if (comp && comp._isRtl())
            {
                extratrackInfo.distX = extratrackInfo.startX - windowX;
                extratrackInfo.distY = windowY - extratrackInfo.startY;
            }
            else
            {
                extratrackInfo.distX = windowX - extratrackInfo.startX;
                extratrackInfo.distY = windowY - extratrackInfo.startY;
            }

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

            ret = firecur_comp._on_mousemove(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);

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

    __pWindow._on_default_sys_dblclick = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY)
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
                ret = capture_comp._on_dblclick(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
            else
                ret = firecur_comp._on_dblclick(elem, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);
        return ret;
    };

    __pWindow._on_dblclick = function (/*elem, strButton, altKey, ctrlKey, shiftKey, screenX, windowX, windowY, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_mouseenter = function (elem, from_elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY)
    {
        var ret;
        var dragInfo = nexacro._cur_drag_info;
        var comp, from_comp;

        comp = this.findComponent(elem);
        from_comp = this.findComponent(from_elem);

        if (comp && comp != from_comp)
        {
            var capture_comp = this._getCaptureComp(true, false, comp);
            var firecur_comp = capture_comp ? capture_comp : comp;
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

                if (dragInfo && dragInfo.isDragging && dragInfo.targetwin == this)
                    ret = firecur_comp._on_dragenter(elem, from_comp, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
                else
                    ret = firecur_comp._on_mouseenter(elem, from_comp, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
            }
        }
        return ret;
    };

    __pWindow._on_mouseenter = function (/*elem, from_elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_mouseleave = function (elem, to_elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY)
    {
        var ret;
        var dragInfo = nexacro._cur_drag_info;
        var comp, to_comp;

        comp = this.findComponent(elem);
        to_comp = this.findComponent(to_elem);

        if (comp && comp != to_comp)
        {
            var capture_comp = this._getCaptureComp(true, false, comp);
            var firecur_comp = comp ? comp : capture_comp;
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

                if (dragInfo && dragInfo.isDragging && dragInfo.targetwin == this)
                    ret = firecur_comp._on_dragleave(elem, to_comp, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
                else
                    ret = firecur_comp._on_mouseleave(elem, to_comp, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
            }
        }
        return ret;
    };

    __pWindow._on_mouseleave = function (/*elem, toelem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_mousewheel = function (elem, wheelDeltaX, wheelDeltaY, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY)
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
                ret = capture_comp._on_mousewheel(elem, wheelDeltaX, wheelDeltaY, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
            else
                ret = firecur_comp._on_mousewheel(elem, wheelDeltaX, wheelDeltaY, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);
        return ret;
    };


    __pWindow._on_mousewheel = function (/*elem, wheelDeltaX, wheelDeltaY, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_dragenter = function (elem, fromElem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, filelist)
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
                    if (!dragInfo.filelist)
                        dragInfo.filelist = nexacro._convertVirtualFileList(filelist);

                    ret = comp._on_dragenter(elem, from_comp, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
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

                    ret = comp._on_dragenter(elem, from_comp, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
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

    __pWindow._on_default_sys_dragleave = function (elem, toElem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, filelist)
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

                    if (!dragInfo.filelist)
                        dragInfo.filelist = nexacro._convertVirtualFileList(filelist);

                    if (to_comp)
                    {
                        ret = comp._on_dragleave(elem, to_comp, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
                    }
                    else
                    {
                        ret = comp._on_dragleave(elem, to_comp, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
                    }
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

    __pWindow._on_default_sys_dragover = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, filelist)
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

                        ret = comp._on_dragmove(elem, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);
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

    __pWindow._on_default_sys_drop = function (elem, strButton, altKey, ctrlKey, shiftKey, windowX, windowY, screenX, screenY, offsetX, offsetY, filelist)
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

                    ret = comp._on_drop(elem, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, strButton, altKey, ctrlKey, shiftKey, canvasX, canvasY, screenX, screenY);

                    nexacro._cur_drag_info = null;
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

    __pWindow._on_default_sys_keydown = function (elem, keycode, altKey, ctrlKey, shiftKey)
    {
        // TODO tab키처리 등. RT버젼의 Pretranslate처리를 분리해야함.
        //      tab키 이동시에도 컴포넌트 onkeydown을 거친 후 form의 onkeydown에서 처리가 됨.
        //      호출순서가 하->상 인지 상->하 인지 확인 필요.
        //
        //      참고로 Pretranslate는 Keydown만 처리하면 됨. 
        // var ret = this._on_pretranslate_keydown()

        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);

        var comp = this.findComponent(elem);

        var capture_comp;
        if (comp) capture_comp = this._getCaptureComp(false, true, comp);

        if (capture_comp && capture_comp != comp)
            comp = capture_comp;

        if (nexacro._enableaccessibility)
        {
            var env = nexacro.getEnvironment();
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
                comp._is_hotkey = true;
            }

            if (keycode == nexacro.Event.KEY_TAB)
            {
                // TODO check tabpage가 현재 subcontrol로 분류되어있어 문제가됨.
                if (comp._is_subcontrol)
                {
                    comp = comp._getFromComponent(comp);
                }
                if (!comp._getDlgCode(keycode, altKey, ctrlKey, shiftKey).want_tab && _form)
                {
                    comp = _form;
                }
            }
            //for test - If this annotation makes a bug, you should roll back.
            else if (nexacro._enableaccessibility && (keycode == nexacro.Event.KEY_UP || keycode == nexacro.Event.KEY_DOWN) && !altKey && !ctrlKey && !shiftKey) // || keycode == nexacro.Event.KEY_LEFT || keycode == nexacro.Event.KEY_RIGHT))
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

            this._keydown_element = elem;
            ret = comp._on_keydown(elem, keycode, altKey, ctrlKey, shiftKey);
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);
        return ret;
    };

    __pWindow._on_keydown = function (/*elem, keycode, altKey, ctrlKey, shiftKey, eventBubbles*/)
    {
        return true;
    };

    __pWindow._on_default_sys_keypress = function (elem, keycode, charcode, altKey, ctrlKey, shiftKey)
    {
        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);
        var comp = this.findComponent(elem);

        var capture_comp = this._getCaptureComp(false, true, comp);
        if (capture_comp && capture_comp != comp)
            comp = capture_comp;

        if (comp)
        {
            ret = comp._on_keypress(elem, keycode, charcode, altKey, ctrlKey, shiftKey);
        }
        if (is_runbase) nexacro._setRunBaseWindow(null);
        return ret;
    };

    __pWindow._on_keypress = function (/*elem, keycode, charcode, altKey, ctrlKey, shiftKey*/)
    {
        return true;
    };

    __pWindow._on_default_sys_keyup = function (elem, keycode, altKey, ctrlKey, shiftKey)
    {
        var ret;
        var is_runbase = nexacro._isRunBaseWindow(this);
        if (this._keydown_element)
        {
            var comp = this.findComponent(elem);
            if (comp)
            {
                var capture_comp = this._getCaptureComp(false, true, comp);
                if (capture_comp && capture_comp != comp)
                    comp = capture_comp;

                if (comp)
                {
                    ret = comp._on_keyup(elem, keycode, altKey, ctrlKey, shiftKey);

                    if (!altKey && !ctrlKey && !shiftKey)
                        this._keydown_element = null;

                    if (comp._is_alive)
                        comp._on_last_keyup();
                }
                else
                {
                    if (!altKey && !ctrlKey && !shiftKey)
                        this._keydown_element = null;
                }
            }
        }
        else
        {
            var comp = this.findComponent(elem);
            if (comp)
            {
                if (comp._is_alive)
                    comp._on_last_keyup();
            }
        }

        if (is_runbase) nexacro._setRunBaseWindow(null);
        return ret;
    };

    __pWindow._on_keyup = function (/*elem, keycode, altKey, ctrlKey, shiftKey, fireComp*/)
    {
        return true;
    };

    __pWindow._on_default_sys_contextmenu = function (elem)
    {
        var comp = this.findComponent(elem);
        if (comp)
        {
            return comp._on_contextmenu(elem);
        }
    };

    __pWindow._on_contextmenu = function (/*elem*/)
    {
        return false;
    };

    __pWindow._on_default_sys_resize = function (width, height, wparam)
    {
        var handle = this.handle;
        if (handle)
        {
            this.width = nexacro._getWindowHandleOuterWidth(handle);
            this.height = nexacro._getWindowHandleOuterHeight(handle);
            this.left = nexacro._getWindowHandlePosX(handle);
            this.top = nexacro._getWindowHandlePosY(handle);

            nexacro._checkClosePopupComponent(null);
            if (nexacro._Browser == "Runtime" && (nexacro._SystemType.toLowerCase() == "win32" || nexacro._SystemType.toLowerCase() == "win64"))
            {
                // win7 이상 AeroSnap으로 최대화시 maximize 처리되지 않고 resize로 최대화 처리가 된다.
                // 윈도우 크기가 먼저 바뀌지 않고 move로 처리됨.....
                // 최대화 처리를 위해 move되는지 알수 있다면 그쪽에서 처리하고 이쪽 분기코드를 없애야 한다...
                this.clientWidth = width || nexacro._getWindowHandleClientWidth(handle);
                this.clientHeight = height || nexacro._getWindowHandleClientHeight(handle);

                var frame_width = this.clientWidth;
                var frame_height = this.clientHeight;
                if (this.frame && this.frame._is_click_openstatus === false)
                {
                    // wParam
                    // 0: size_restored
                    // 1: size_minimized
                    // 2: size_maximized

                    // frame._state_openstatus
                    // normal(0), restore(1), minimize(2), maximize(3)

                    if (this.frame._state_openstatus == 2) 
                    {
                        if (wparam === 0) // min->normal;
                        {
                            this.frame._setSize(frame_width, frame_height, this.frame._isRtl());
                            // [84123] showModal 후 최소화 했다가 노말로 변경 시 오동작
                            this.frame._on_syscommand(this.frame._control_element, "restore", undefined, this.frame);
                        }
                        else if (wparam === 2) // min->max;
                        {
                            this.frame._iscallfromresize = true;
                            var ret = this.frame._on_syscommand(this.frame._control_element, "maximize", undefined, this.frame);
                            this.frame._iscallfromresize = false;
                            // [85364] 윈도우7 에서 브라우저 최대화후 최소화 다시 최대화를 하면 작업표시줄 전체 클릭이 막힘
                            // return ret;
                        }
                        else if (wparam == undefined) //window create 직후 최대화
                        {
                            if (this.frame._is_window && this.frame.openalign)
                            {
                                if (this.frame.top != this.top && this.frame.height != frame_height)
                                    this.frame._move(this.left, this.top);
                                else if (this.frame.left != this.left && this.frame.width != frame_width)
                                    this.frame._move(this.left, this.top);
                            }
                        }
                    }
                    else if (this.frame._state_openstatus == 3) 
                    {
                        if (wparam === 0) // max->normal;
                        {
                            this.frame._setSize(frame_width, frame_height, this.frame._isRtl());
                            return this.frame._on_syscommand(this.frame._control_element, "restore", undefined, this.frame);
                        }
                        else if (wparam === 1) // max->min;
                        {
                            this.frame._iscallfromresize = true;
                            var ret = this.frame._on_syscommand(this.frame._control_element, "minimize", undefined, this.frame);
                            this.frame._iscallfromresize = false;
                            return ret;
                        }
                        else if (wparam == undefined) //window create 직후 최대화
                        {
                            if (this.frame._is_window && this.frame.openalign)
                            {
                                if (this.frame.top != this.top && this.frame.height != frame_height)
                                    this.frame._move(this.left, this.top);
                                else if (this.frame.left != this.left && this.frame.width != frame_width)
                                    this.frame._move(this.left, this.top);
                            }
                        }
                    }
                    else if (wparam == 2 && this.frame._state_openstatus === 0) // normal->max;
                    {
                        this.frame._setSize(frame_width, frame_height, this.frame._isRtl());
                        return this.frame._on_syscommand(this.frame._control_element, "maximize", undefined, this.frame);
                    }
                }
            }
            else
            {
                // HTML의 경우 지정된 크기로 바꿔도 문제가 없었지만
                // Autozoom 처리시 싸이즈 sync가 맞지 않아 handle로 부터 얻은 값을 우선하도록함.
                this.clientWidth = nexacro._getWindowHandleClientWidth(handle) || width;
                this.clientHeight = nexacro._getWindowHandleClientHeight(handle) || height;
            }

            var resize_func = function (pThis)
            {
                return function ()
                {
                    nexacro._calculateZoomLevel();

                    var frame_width = pThis.clientWidth;
                    var frame_height = pThis.clientHeight;

                    if (pThis.frame)
                    {
                        pThis.frame._setSize(frame_width, frame_height);

                        // windowed frame window가 resize된 경우만..
                        if (nexacro._resize_popup_inbound === true)
                        {
                            var len = nexacro._current_popups.length;
                            for (var i = len - 1; i >= 0; i--)
                            {
                                var cur_popup_comp = nexacro._current_popups[i];
                                if (cur_popup_comp)
                                {
                                    cur_popup_comp._resizePopupInbound(frame_width, frame_height);
                                }
                            }
                        }
                    }
                    /*
                    //Showmodal
                    if (nexacro._Browser != "Runtime" && !nexacro._isDesktop())
                    {
                        if (pThis.handle)
                        {
                            var popupframes = pThis.handle._popupframes;
                            if (popupframes)
                            {
                                for (var i = 0, len = popupframes.length; i < len; i++)
                                {
                                    var popupframe = popupframes[i];
                                    if (popupframe)
                                        popupframe._setSize(frame_width, frame_height);
                                }
                            }
                        }   
                    }   
                    */
                    var modal_stack = pThis._modal_frame_stack;
                    for (var i = 0; i < modal_stack.length; i++)
                    {
                        var modal_info = modal_stack[i];
                        var modal_frame = modal_info[0];
                        modal_frame._setModalOverlaySize(frame_width, frame_height);
                    }

                    if (pThis._resizemanager)
                    {
                        var curtime = new Date().getTime();
                        var lasttime = pThis._resizemanager._last_time;
                        var stop_interval = pThis._resizemanager._interval;

                        if ((curtime - lasttime) > stop_interval)
                        {
                            pThis._resizemanager.stop();
                            pThis._resizemanager = null;
                        }
                        else
                            pThis._resizemanager.start();
                    }

                    //iphone 5 orientation bug
                    //iPad mini orientation bug
                    if (nexacro._OS == "iOS" && !nexacro._allow_default_pinchzoom)// && nexacro._SystemType == "iphone")
                    {
                        setTimeout(function ()
                        {
                            window.scrollTo(0, 0);
                            pThis.frame._setSize(frame_width, frame_width > frame_height ? frame_height : window.innerHeight);
                        }, 500);
                    }

                };
            };

            if (!nexacro._isDesktop())
                resize_func(this)();
            else
            {
                if (this.frame)
                {
                    if (!this._resizemanager)
                    {
                        this._resizemanager = new nexacro._ResizeManager(new nexacro.AnimationFrame(this.frame, resize_func(this)));
                        this._resizemanager.start();
                    }
                    this._resizemanager.setLastTime(new Date().getTime());
                }

            }


            resize_func = null;
        }
    };

    __pWindow._on_default_sys_move = function (x, y)
    {
        var handle = this.handle;
        if (handle)
        {
            var clientWidth = nexacro._getWindowHandleClientWidth(handle);
            var clientHeight = nexacro._getWindowHandleClientHeight(handle);
            this.left = x;
            this.top = y;

            this.width = nexacro._getWindowHandleOuterWidth(handle);
            this.height = nexacro._getWindowHandleOuterHeight(handle);
            this.clientWidth = clientWidth ? clientWidth : this.width;
            this.clientHeight = clientHeight ? clientHeight : this.height;
        }

        // frame.move는 openstatus=normal일때만 작동함
        var frame = this.frame;
        if (frame && frame._is_window)
            frame._move(x, y);
    };

    __pWindow._on_default_sys_activate = function ()
    {
        // Google Chrome에서 activate 이벤트가 2번씩 나오는 문제로 validation한다.
        if (this._is_active_window !== true)
        {
            // Pseudo change : Focused
            var cur_focus_paths = this.getCurrentFocusPaths();
            var cur_focus_paths_len = (cur_focus_paths ? cur_focus_paths.length : 0);
            for (var i = 0; i < cur_focus_paths_len; i++)
            {
                var _comp = cur_focus_paths[i];
                if (!_comp)
                    continue;
                /*  if (_comp._is_frame || _comp._is_form)
                  {
                      nexacro.Component.prototype._on_activate.call(_comp);
                  }
                  else*/
                if (_comp._is_frame)
                    _comp._changeStatus("deactivate", false);
                else if (!_comp._is_form)
                    _comp._on_activate();
            }

            var frame = this._getLastModalFrame();
            if (!frame)
                frame = this.getActiveFrame();
            if (!frame)
                frame = this.frame;

            if (frame)
            {
                frame._changeStatus("deactivate", false);
                //frame._stat_change("activate", "activate");

                this._is_active_window = true;

                // IE Browser에서 Tab영역을 누르면 focus가 빠져버리기때문에 추가처리

                if (this._last_focused_elem)
                    this._last_focused_elem.setElementFocus();
            }
        }
    };

    __pWindow._on_default_sys_deactivate = function ()
    {
        // Google Chrome에서 activate 이벤트가 2번씩 나오는 문제로 validation한다.
        if (this._is_active_window !== false)
        {
            nexacro._cur_drag_info = null;
            nexacro._cur_repeat_info = null;
            nexacro._cur_track_info = null;

            var frame = this._getLastModalFrame();
            if (!frame)
                frame = this.frame;
            if (frame)
            {
                frame._changeStatus("deactivate", true);
                //frame._stat_change("activate", "deactivate");

                this._is_active_window = false;
            }

            // Pseudo change : Non-Focused
            var cur_focus_paths = this.getCurrentFocusPaths();
            var cur_focus_paths_len = (cur_focus_paths ? cur_focus_paths.length : 0);
            for (var i = 0; i < cur_focus_paths_len; i++)
            {
                var _comp = cur_focus_paths[i];
                if (_comp)
                {
                    /* if (_comp._is_frame || _comp._is_form)
                     {
                         nexacro.Component.prototype._on_deactivate.call(_comp);
                     }
                     else*/
                    if (_comp._is_frame)
                        _comp._changeStatus("deactivate", true);
                    else if (!_comp._is_form)
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
                var cur_focus_paths = this.getCurrentFocusPaths();
                var comp = cur_focus_paths[cur_focus_paths.length - 1];
                nexacro._checkClosePopupComponent(comp ? comp : null, true);
            }
            else
                nexacro._checkClosePopupComponent(null);
        }
    };

    __pWindow._on_default_sys_beforeclose = function ()
    {
        // Safari는 팝업을 X버튼으로 닫으면 beforeunload 이벤트가 발생하지 않음

        // 여기에서는 닫힐지 말지 알 수가 없다. 취소가 가능함
        // 리소스를 내리는 작업은 정말 닫힐때 (close에서) 처리

        // Parent에 의해 같이 닫히는 경우 Parent에서 한꺼번에 Confirm함
        if (!this._ignore_close_confirm)
        {
            var frame = this.frame;
            var confirm_message = frame._on_beforeclose();
            return confirm_message;
        }
    };

    __pWindow._on_default_sys_close = function ()
    {
        if (this._is_alive)
        {

            nexacro._checkClosePopupComponent(null);
            nexacro._removePopupComponent(null);
        }

        if (this._is_main)
        {
            var application = nexacro.getApplication();
            if (application)
                application.beforeExit(); // ??

            nexacro._clearLocalStorage();
            this._closeChildWindows(true);

            if (application && nexacro._Browser == "Runtime")
                application.exit();
        }
        else if (this._is_alive)
            this.destroy();

        // IE는 window.close를 호출해도 window가 즉시 사라지지 않는 경우가 있기때문에
        // closed 속성이 true로 바뀔때까지 기다렸다가 콜백을 수행한다. 
        // 다행히 closed는 모든 브라우저에서 정확한 값을 보여주고 있다.

        if (!this._is_main && this.frame)
        {
            nexacro._createModalAsyncCallbackHandler(this.handle, this.frame);
        }
    };

    // IE 8이하의 경우, main window에서 Open Window의 DOM을 create 하면 속도가 많이 느림.
    // 때문에 Open Window의 onload Event를 받아서 Frame create 하도록 처리.
    __pWindow._on_default_sys_load = function (win_handle)
    {
        if (!this.handle && win_handle)
        {
            this.attachHandle(win_handle);
        }

        if (this.handle)
        {
            for (var i = 0; i < this._lock_list.length; i++)
                nexacro._setWindowHandleLock(this._lock_list[i] ? this._lock_list[i].handle : null, true, this.handle, true);

            if (this.frame)
            {
                this.frame._on_window_loaded();
            }
        }
    };

    __pWindow._on_default_sys_reload = function (elem)
    {
        if (elem)
        {
            var comp = this.findComponent(elem);
            if (comp)
            {
                var ref_form = comp._getForm();
                if (ref_form)
                {
                    var frame = ref_form.getOwnerFrame();
                    if (frame && frame.form)
                    {
                        frame.form.reload();
                    }
                }
            }
        }
    };

    __pWindow._on_default_sys_syscommand = function (command)
    {
        if (this.frame)
        {
            var f = this.frame;
            f._on_syscommand(f._control_element, command, true, f, null);
        }
    };

    __pWindow._on_default_sys_getminmaxinfo = function ()
    {
        if (this.frame)
        {
            var minmaxinfo = this.frame._getMinMaxInfo();
            return [minmaxinfo.cx, minmaxinfo.cy];
        }

        return null;
    };

    __pWindow._on_default_sys_touchstart = function (elem, touchid, clientX, clientY, screenX, screenY, curtime, orgtime, is_last_changedtouch, first_touchid)
    {
        var manager = this._getTouchGestureManager();
        if (!manager) return;

        this._cur_touch_elem = elem;

        if (nexacro._current_popups.length > 0)
        {
            var is_capture = nexacro._current_popups[0]._track_capture;
            var comp = this.findComponent(elem);
            nexacro._checkClosePopupComponent(comp, false);
            var cur_popup = nexacro._current_popups[0];
            if (!is_capture)
            {
                this._click_cancel = false;
            }
            else if (!cur_popup)
            {
                this._click_cancel = true;
                return;
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

        if (nexacro._current_popups.length > 0)
        {
            var is_capture = nexacro._current_popups[0]._track_capture;
            var comp = this.findComponent(elem);
            nexacro._checkClosePopupComponent(comp, false);
            var cur_popup = nexacro._current_popups[0];
            if (!is_capture)
            {
                this._click_cancel = false;
            }
            else if (!cur_popup)
            {
                this._click_cancel = true;
                return;
            }
        }
        else
        {
            this._click_cancel = false;
        }

        //trace("_on_gesture_sys_touchstart", touches, changedTouches, time);
        var ret = manager.ontouchstart(this, elem, touches, changedTouches, time);

        return ret;
    };

    __pWindow._on_default_sys_touchmove = function (elem, touchid, clientX, clientY, screenX, screenY, curtime, orgtime, is_last_changedtouch)
    {
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

        //trace("_on_gesture_sys_touchmove", touches, changedTouches, time);
        var ret = manager.ontouchmove(this, elem, touches, changedTouches, time);

        return ret;
    };

    __pWindow._on_default_sys_touchend = function (elem, touchid, clientX, clientY, screenX, screenY, curtime, orgtime, is_last_changedtouch)
    {
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

        //trace("_on_gesture_sys_touchend", touches, changedTouches, time);
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

        //trace("_on_gesture_sys_touchcancel", touches, changedTouches, time);
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

        if (this.frame)
        {
            this.frame._on_orientationchange(orientation);
        }
    };

    __pWindow._on_default_sys_accessibilitygesture = function (direction)
    {
        // direction (0: left , 1: right)
        //trace("javascript _on_default_sys_accessibilitygesture direction: " + direction);

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
        //trace("javascript _on_default_sys_accessibilityhover " + "elem " + elem + "clientX " + clientX + "clientY " + clientY + "screenX " + screenX + "screenY " + screenY);
        //trace("javascript _on_default_sys_accessibilityhover " + "elem " + elem);
        var comp;
        var control;
        var ret = false;
        if (elem instanceof nexacro.ModalOverlayElement) return ret;
        var old_comp = this._accessibility_last_focused_comp;

        comp = this.findComponent(elem, 0, 0);
        //trace("checkpoint 1 : " + comp[0].name);
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
                //trace("checkpoint 2 : " + comp.name + " " + ret);
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
                //trace("checkpoint 3 : " + my_tapstop_childs_cnt);

                if (my_tapstop_childs_cnt == 0) // TODO : 무조건 1로 나옴, 확인 필요
                {
                    ret = comp._setAccessibilityInfoByHover(control);
                }
            }
        }
        //if (this._accessibility_last_focused_comp)
        //    trace("checkpoint final : " + this._accessibility_last_focused_comp.name);
        return ret;
    };

    __pWindow._updateWrapper = function (brun, action)
    {
        nexacro._updateWrapper(this.handle, brun, action);
    };

    __pWindow._cancelEvent = function ()
    {
        var is_runbase = nexacro._isRunBaseWindow(this);
        var elem = this._cur_ldown_elem || this._keydown_element;
        var comp = this.findComponent(elem);
        var repeatInfo = nexacro._cur_repeat_info;

        if (comp)
        {
            var comp_org = comp._getRootComponent(comp);
            comp_org._cancelEvent(comp);
        }

        if (repeatInfo && repeatInfo._timer)
        {
            var handle = nexacro._getWindowHandle(this.handle);
            nexacro._clearSystemTimer(handle, repeatInfo._timer);
        }
        nexacro._cur_drag_info = null;
        nexacro._cur_repeat_info = null;
        nexacro._cur_track_info = null;
        this._cur_ldown_elem = null; //clear elem at lbuttondown.
        this._lbuttondown_wx = null;
        this._lbuttondown_wy = null;
        this._curWindowX = null;
        this._curWindowY = null;
        this._keydown_element = null;
    };

    __pWindow._getEnableWheelZoom = function ()
    {
        return this._enableWheelZoom;
    }

    __pWindow._setEnableWheelZoom = function (newEnableWheelZoom)
    {
        this._enableWheelZoom = newEnableWheelZoom;
    }

    __pWindow._getWheelZoom = function ()
    {
        return this._wheelZoom;
    }
    __pWindow._setWheelZoom = function (newWheelZoom)
    {
        if ((50 <= newWheelZoom) && (newWheelZoom <= 200) && (newWheelZoom % 10 == 0))
        {
            this._wheelZoom = newWheelZoom;
            var zoomframeElement = this.frame._is_popup_frame != true ? this.frame.frame.getElement() : this.frame.getElement();    // _window.frame : mainframe
            zoomframeElement.setElementZoom(newWheelZoom);
            zoomframeElement.setElementSize(zoomframeElement._unscaledwidth, zoomframeElement._unscaledheight);
            if (this._modal_frame_stack.length > 0)
            {
                var modalCount = this._modal_frame_stack.length;
                var modalFrameElement;
                for (var loopI = 0; loopI < modalCount; loopI++)
                {
                    modalFrameElement = this._modal_frame_stack[loopI][0].getElement();
                    modalFrameElement.setElementZoom(newWheelZoom);
                    modalFrameElement.setElementSize(modalFrameElement._unscaledwidth, modalFrameElement._unscaledheight, false, true);
                }
            }
        }
    }
    //==============================================================================
    // nexacro.Window
    //==============================================================================
    nexacro._PopupWindow = function (id, parent)
    {
        nexacro._Window.call(this, id, parent, false);

        //------------------ internal variable ---------------------//
        this.comp = null;
        this._old_focused_comp = null;
    };

    var __pPopupWindow = nexacro._createPrototype(nexacro._Window, nexacro._PopupWindow);
    nexacro._PopupWindow.prototype = __pPopupWindow;
    __pPopupWindow._type_name = "PopupWindow";

    //------------------------------------------------------------------------------
    __pPopupWindow.attachHandle = function (handle)
    {
        if (!this.handle)
        {
            this.handle = this.dest_handle = handle;
            this._doc = this._dest_doc = nexacro._getPopupWindowDocumentHandle(handle);

            this.left = nexacro._getPopupWindowHandlePosX(handle);
            this.top = nexacro._getPopupWindowHandlePosY(handle);
            this.width = nexacro._getPopupWindowHandleOuterWidth(handle);
            this.height = nexacro._getPopupWindowHandleOuterHeight(handle);
            this.clientWidth = nexacro._getPopupWindowHandleClientWidth(handle);
            this.clientHeight = nexacro._getPopupWindowHandleClientHeight(handle);
            this._gap_client_width = this.width - this.clientWidth;
            this._gap_client_height = this.height - this.clientHeight;
        }
    };

    __pPopupWindow.attachFrame = function (/*frame, refresh_flag*/)
    {
        // do nothing
    };

    __pPopupWindow.attachComp = function (comp, refresh_flag)
    {
        this.comp = comp;
        if (refresh_flag)
            this._onPrepareWindowHandle();
    };

    __pPopupWindow.create = function (_parent, name, width, height, left, top/*, resizable*/)
    {
        nexacro._createPopupWindowHandle(_parent, this, name, left, top, width, height);
    };

    __pPopupWindow.destroy = function ()
    {
        if (!this._is_alive)
            return;

        this._is_alive = false;

        var handle = this.handle;
        if (handle)
        {
            nexacro._closePopupWindowHandle(handle);
            this.handle = null;
        }
        this.comp = null;
        nexacro._Window.prototype.destroy.call(this);
    };

    //------------------------------------------------------------------------------
    __pPopupWindow.moveBy = function (dx, dy)
    {
        var handle = this.handle;
        if (handle && dx && dy)
        {
            var l = this.left + (dx | 0);
            var t = this.top + (dy | 0);
            nexacro._setPopupWindowHandlePos(handle, l, t);
            this.left = nexacro._getPopupWindowHandlePosX(handle);
            this.top = nexacro._getPopupWindowHandlePosY(handle);
        }
    };

    __pPopupWindow.moveTo = function (l, t)
    {
        var handle = this.handle;
        if (handle)
        {
            l = (l || this.left);
            t = (t || this.top);
            nexacro._setPopupWindowHandlePos(handle, l, t);
            this.left = nexacro._getPopupWindowHandlePosX(handle);
            this.top = nexacro._getPopupWindowHandlePosY(handle);
        }
    };

    __pPopupWindow.setArea = function (l, t, w, h)
    {
        var handle = this.handle;
        if (handle)
        {
            l = (l != null ? l : this.left);
            t = (t != null ? t : this.top);
            w = (w || this.width);
            h = (h || this.height);
            nexacro._setPopupWindowHandleArea(handle, l, t, w, h);
            this.left = nexacro._getPopupWindowHandlePosX(handle);
            this.top = nexacro._getPopupWindowHandlePosY(handle);
            this.width = nexacro._getPopupWindowHandleOuterWidth(handle);
            this.height = nexacro._getPopupWindowHandleOuterHeight(handle);
            this.clientWidth = nexacro._getPopupWindowHandleClientWidth(handle);
            this.clientHeight = nexacro._getPopupWindowHandleClientHeight(handle);
            this._gap_client_width = this.width - this.clientWidth;
            this._gap_client_height = this.height - this.clientHeight;
        }
    };
    __pPopupWindow.setSize = function (w, h)
    {
        var handle = this.handle;
        if (handle)
        {
            w = (w || this.width);
            h = (h || this.height);
            nexacro._setPopupWindowHandleSize(handle, w, h);
            this.width = nexacro._getPopupWindowHandleOuterWidth(handle);
            this.height = nexacro._getPopupWindowHandleOuterHeight(handle);
            this.clientWidth = nexacro._getPopupWindowHandleClientWidth(handle);
            this.clientHeight = nexacro._getPopupWindowHandleClientHeight(handle);
            this._gap_client_width = this.width - this.clientWidth;
            this._gap_client_height = this.height - this.clientHeight;
        }
    };

    __pPopupWindow.setVisible = function (visible)
    {
        if (this.visible != visible)
        {
            this.visible = visible;

            // Popup 닫힐때 Focus 복원
            // PopupDiv, PopupMenu가 해당됨.
            var root_window = this._getRootWindow();
            if (visible)
            {
                var cur_focus_paths = root_window.getCurrentFocusPaths();
                if (cur_focus_paths && cur_focus_paths.length > 0)
                {
                    var comp = cur_focus_paths[cur_focus_paths.length - 1];

                    comp = comp._last_focused ? comp._last_focused : comp;

                    if (comp._is_killfocusing)
                    {
                        comp = root_window._setfocusing_comp;
                    }
                    this._old_focused_comp = comp;
                }
                else
                {
                    this._old_focused_comp = null;
                }
            }
            else
            {
                if (this._old_focused_comp)
                {
                    this._old_focused_comp.setFocus();
                }
            }

            // Popup이 닫힐때 KillFocus 처리
            // Focus 관리를 Frame window 단위
            nexacro._setPopupWindowHandleVisible(this.handle, visible);
        }
    };

    __pPopupWindow.getTopComp = function ()
    {
        return this.comp;
    };

    __pPopupWindow._setCaptureComp = function (comp)
    {
        var root_win = this._getRootWindow();
        if (root_win)
            root_win._setCaptureLock(comp, true, false);
    };

    __pPopupWindow._releaseCaptureComp = function (comp)
    {
        var root_win = this._getRootWindow();
        if (root_win)
            root_win._releaseCaptureLock(comp);
    };

    __pPopupWindow._on_default_sys_activate = nexacro._emptyFn;
    __pPopupWindow._on_default_sys_deactivate = nexacro._emptyFn;
    __pPopupWindow._getRootWindow = function ()
    {
        var root_window = this;
        while (root_window)
        {
            if (root_window.frame)
                return root_window;
            root_window = root_window.parent;
        }
        return this;
    };

    // FocusPath 관련 API를 모두 Frame Window로 호출하도록함. 
    // 아예 호출되지 않는 것이 최상의 시나리오임
    // 최종적으로는 모두 제거 대상
    __pPopupWindow.getCurrentFocusPaths = function ()
    {
        return this._getRootWindow().getCurrentFocusPaths();
    };
    __pPopupWindow.addCurrentFocusPaths = function (obj)
    {
        this._getRootWindow().addCurrentFocusPaths(obj);
    };
    __pPopupWindow.clearCurrentFocusPaths = function ()
    {
        this._getRootWindow().clearCurrentFocusPaths();
    };
    __pPopupWindow._removeFromCurrentFocusPath = function (obj, clear_last_focus, new_focus, new_refer_focus)
    {
        this._getRootWindow()._removeFromCurrentFocusPath(obj, clear_last_focus, new_focus, new_refer_focus);
    };
    __pPopupWindow._indexOfCurrentFocusPaths = function (obj)
    {
        return this._getRootWindow()._indexOfCurrentFocusPaths(obj);
    };

    nexacro._is_loaded_application = false;

    nexacro._addLoadCallbacklist = function (item)
    {
        if (!nexacro._is_loaded_application)
        {
            if (!nexacro._load_callbacklist)
                nexacro._load_callbacklist = [];
            nexacro._load_callbacklist.push(item);
            return true;
        }
        return false;
    };

    //==============================================================================
    // nexacro Application
    //==============================================================================
    if (!this._application)
    {
        var _pApplication = nexacro.Application = nexacro._createPrototype(nexacro._EventSinkObject);

        _pApplication._type_name = "Application";

        _pApplication.id = "application";
        _pApplication.name = "application";

        // Application Collections
        // all is special Collection - direct access not allowed
        _pApplication.all = new nexacro.Collection();
        _pApplication.trays = new nexacro.Collection();

        _pApplication.components = new nexacro.Collection();

        //property
        _pApplication.mainframe = null;
        _pApplication.key = "";
        _pApplication.xadl = "";
        _pApplication.componentpath = "";
        _pApplication.commthreadcount = 3;
        _pApplication.commthreadwaittime = 0;
        _pApplication.cachedir = "";
        _pApplication.errorfile = "";
        _pApplication.onlyone = false;

        _pApplication.version = "";

        _pApplication.engineversion = "";
        _pApplication.enginesetupkey = "";
        _pApplication.licenseurl = "";
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
        //_pApplication._protocols = {};

        _pApplication._active_window = null; //not use
        _pApplication._global_context = this;   // lookup topmost


        _pApplication._is_loaded = false;
        _pApplication._is_hybrid = false;
        _pApplication._is_loadforms = false;

        _pApplication._loglevel = 4;

        //--------------------------------------
        // Managers
        // CSS containers
        //_pApplication._css_selectors = { _is_selector: true, _has_items: false, _has_attr_items: false };
        //_pApplication._cssfinder_cache = {};


        _pApplication._load_manager = new nexacro._LoadManager(nexacro.Application);

        // Multi-LayoutManager 
        //--------------------------------------
        _pApplication._device_name = "";
        //  _pApplication._layout_manager = new nexacro._LayoutManager(nexacro.Application);

        //--------------------------------------

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
            return nexacro._is_loaded_application;
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
            this.on_fire_onload(obj, url);

            var callbacklist = nexacro._load_callbacklist;
            //var callbacklist = this._load_callbacklist;
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

        _pApplication.on_fire_onerror = function (obj, errortype, errormsg, errorobj, statuscode, requesturi, locationuri)
        {
            if (this.onerror && this.onerror._has_handlers)
            {
                var evt = new nexacro.ErrorEventInfo(obj, "onerror", errortype, errormsg, errorobj, statuscode, requesturi, locationuri);
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
                    var globalvalue = matched[0]; // a=A, 또는 a=A
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

        _pApplication._getClientWidth = _pApplication._getClientHeight = nexacro._emptyFn;
        //==============================================================================
        // nexacro.Application : System Utility Functions
        //==============================================================================



        _pApplication._onHttpTransactionError = function (obj, bfireevent, errorobj, errortype, url, returncode, requesturi, locationuri, extramsg)
        {
            var ret = false;
            var commerrorobj = nexacro.MakeCommunicationError(this, errortype, url, returncode, requesturi, locationuri, extramsg);
            if (bfireevent)
            {
                ret = this.on_fire_onerror(obj, commerrorobj.name, commerrorobj.message, errorobj, returncode, requesturi, locationuri);
                if (!ret)
                {
                    var environment = nexacro.getEnvironment();
                    if (environment)
                    {
                        ret = environment.on_fire_onerror(obj, commerrorobj.name, commerrorobj.message, errorobj, returncode, requesturi, locationuri);
                    }
                }
            }


            //   this._onFireSystemError(obj, false, commerrorobj.name, 1, commerrorobj.message, true);                                      
            if (commerrorobj.message)
            {
                nexacro._writeTraceLog(1, commerrorobj.message, true, this._loglevel);

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
                var globalvalue = matched[0]; // a=A, 또는 a=A
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
        // Application Infomation Control Utils Get/Set
        // this function will deprecate!!, use 'load' function! 
        _pApplication.quickView = function (url, project_path/*, archive_path*/)
        {
            if (project_path)
            {
                // set server path if archive 
                this._project_url = project_path;
                nexacro._setProjectURL(project_path);
                var base_url = nexacro._getProjectBaseURL(url);

                if (this._project_url != base_url)
                {
                    nexacro._localcache_path = base_url;
                }
            }

            this.loadADL(url);
        };

        _pApplication._load = function (key, url)
        {
            this.key = key;
            //load theme
            this._loadTheme(nexacro._curthemeid);

            //load initvalue
            this._loadInitValueFile(nexacro._initvaluefileid);

            this.xadl = url;
            //load adl
            var service = nexacro._getServiceObject(url);
            this._load_manager.loadMainModule(url, false, true, false, service);
        };


        _pApplication.load = function (key, url, curscreen, project_path, archive_path)
        {
            //추후 삭제 
            if (curscreen && typeof curscreen == "string")
            {
                archive_path = project_path;
                project_path = curscreen;
                curscreen = null;
            }

            if (project_path)
            {
                // set server path if archive 
                this._project_url = project_path;
                nexacro._setProjectURL(project_path);
                var base_url = nexacro._getProjectBaseURL(url);

                if (this._project_url != base_url)
                {
                    nexacro._localcache_path = base_url;
                }
            }

            nexacro._setCurrentScreen(curscreen);
            nexacro._applySelectedScreen(curscreen);

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
            var service;
            if (service_url && service_url.length > 0)
                service = nexacro._getServiceObject(service_url);
            else
                service = nexacro._getServiceObject(url);

            this._load_manager.loadIncludeModule(url, null, asyncmode, service);
        };

        //Base::test.xcss 
        //theme::Base_test.xcss 이렇게 바꿔서...  : // 2018.01.16 2월 정기 반영전 

        // xcss:: 로 고정경로로 변경 2018.01.16 2월 정기에 변경됨 
        _pApplication.loadCss = function (url)
        {
            if (!nexacro._cssurls)
                nexacro._cssurls = [];

            nexacro._cssurls.push(url);

            var cssurl, base_url;
            var loadurl = url.replace("::", "_");
            //경로 설정하는 api 필요
            cssurl = nexacro._getServiceLocation("theme://" + loadurl, nexacro._project_absolutepath, null, false);
            if (nexacro._localcache_path)
            {
                base_url = cssurl.substring(nexacro._project_absolutepath.length, cssurl.length);
                cssurl = nexacro._localcache_path + base_url;
            }

            var cssmapurl = cssurl;
            var pos = cssurl.lastIndexOf('/');
            cssurl = cssurl.substring(0, pos + 1) + nexacro._getCSSFileName(cssurl.substring(pos + 1, cssurl.length - 5));

            var service = nexacro._getServiceObject(url);
            pos = cssmapurl.lastIndexOf('.');
            cssmapurl = cssmapurl.substring(0, pos + 1) + "map.js";

            var env = nexacro.getEnvironment();
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
            if (!themeid)
                return;

            var idx = themeid.indexOf("theme::");
            if (nexacro._localcache_path && idx >= 0)
                themeid = themeid.substring(idx + 7);

            //default
            //this._clearLocalThemeCache();
            var cssurl, base_url;
            var localcachetype = false;
            var service = nexacro._getServiceObject(themeid);

            if (nexacro._localcache_path && nexacro._hasLocalCacheUrl(themeid))
            {
                cssurl = nexacro._getLocalCacheUrl(themeid);
                if (cssurl)
                {
                    this._load_manager.loadCssModule(cssurl, null, null, service);
                    return;
                }

                localcachetype = true;
                base_url = nexacro._localcache_path;
            }

            //html
            cssurl = nexacro._theme_uri + "/" + nexacro._getCSSFileName("theme");
            //cssurl = themeid + "/" + nexacro._getCSSFileName("theme")
            cssurl = nexacro._getServiceLocation(cssurl, base_url, null, false);

            // cssurl += ".js";                    

            //for info
            var cssmapurl = nexacro._theme_uri + "/theme.map";
            //cssurl = themeid + "/theme.map";
            cssmapurl = nexacro._getServiceLocation(cssmapurl, base_url, null, false);
            cssmapurl += ".js";

            var env = nexacro.getEnvironment();
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

            this._load_manager.loadCssModule(cssurl, null, null, service, true, 0);
            this._load_manager.loadCssModule(cssmapurl, null, null, service);
        };

        _pApplication._loadInitValueFile = function (initvaluefile)
        {
            if (!initvaluefile)
                return;
            //default

            //this._clearLocalThemeCache();
            var initvalueurl, base_url;
            var localcachetype = false;
            var service;
            if (nexacro._localcache_path && nexacro._hasLocalCacheUrl(initvaluefile))
            {
                initvalueurl = nexacro._getLocalCacheUrl(initvaluefile);
                if (initvalueurl)
                {
                    service = nexacro._getServiceObject(initvaluefile);
                    this._load_manager.loadGlobalModule(initvaluefile, null, null, service);
                    return;
                }

                localcachetype = true;
                base_url = nexacro._localcache_path;
            }

            initvalueurl = nexacro._getServiceLocation(initvaluefile, base_url);

            if (localcachetype)
            {
                nexacro._addLocalCacheUrl(initvaluefile, initvalueurl);
            }

            service = nexacro._getServiceObject(initvalueurl);
            this._load_manager.loadGlobalModule(initvalueurl, null, null, service);
        };

        _pApplication.createMainFrame = function (id, left, top, width, height, right, bottom, parent)
        {
            var mainframe = new nexacro.MainFrame(id, left, top, width, height, right, bottom, parent);
            this[id] = this.mainframe = mainframe;
            this.all.add_item(id, mainframe);

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
            this.trays.add_item(id, tray);
            this.all.add_item(id, tray);
            return tray;
        };

        _pApplication.addTray = function (id, obj)
        {
            if (obj._type_name != "Tray")
                return -1;

            if (this.trays.indexOf(id) > -1)
                return -1;

            var idx = this.trays.add_item(id, obj);
            this.all.add_item(id, obj);
            return idx;
        };

        _pApplication.removeTray = function (id)
        {
            if (typeof (id) == "string")
            {
                if (this.trays[id])
                {
                    this.trays[id]._destroy();
                }
            }
            else
            {
                // remove all
                var cnt = this.trays.length;
                for (var i = cnt - 1; i >= 0; i--)
                {
                    if (this.trays[i])
                    {
                        this.trays[i]._destroy();
                    }
                }
            }
        };

        _pApplication._addPreloadList = function (type, url, id, args)
        {
            if (!url) return;

            var service = nexacro._getServiceObject(url);
            if (type == "data")
            {
                var fullurl = nexacro._getServiceLocation(url);
                this._load_manager.addPreloadItem(type, fullurl, id, args, service);
            }
            else
            {
                var fullurl = nexacro._getFDLLocation(url);
                this._load_manager.addPreloadItem(type, url, (id ? id : this), null, service);
            }
        };



        //CHECK
        _pApplication.getParentContext = function ()
        {
            return null;
        };




        // protocol is Global resource - App level



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

            this.all.add_item(id, val);

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

        _pApplication._addObject = function (id, obj)
        {
            this[id] = obj;
            this.all.add_item(id, obj);
        };

        _pApplication._getDatasetObject = function (datasetid)
        {
            return this[datasetid];
        };

        _pApplication._waitCursor = function (wait_flag, context)
        {
            var mainframe = this.mainframe;
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
            var frame = this.mainframe;
            var _window = frame._getWindow();
            if (_window && _window._is_active_window)
                return _window.getActiveFrame();

            var popupframes = nexacro.getPopupFrames();
            if (popupframes)
            {
                for (var i = 0, len = popupframes.length; i < len; i++)
                {
                    _window = popupframes[i]._window;
                    if (_window && _window._is_active_window)
                        return _window.getActiveFrame();
                }
            }
            return null;
        };
        _pApplication.getActiveForm = function ()
        {
            var frame = this.getActiveFrame();
            if (frame)
                return frame.form;
            else
                return null;
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
                var thisp = this;
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
                        this.all.delete_item(id);
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

        //_pApplication.isNumeric = function (v)
        //{
        //    if (!v) return false;
        //    if (typeof v == "string")
        //    {
        //        var len = v.length;
        //        for (var i = 0; i < len; i++)
        //        {
        //            var ch = v.charAt(i);
        //            if (ch < "0" || ch > "9") return false;
        //        }
        //        return true;
        //    }
        //    return false;
        //};

        _pApplication.lookup = function (name)
        {
            if (name in this)
                return this[name];
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

        //추후 삭제 
        //_pApplication.set_useajaximagefilter = function (v)
        //{

        //};

        _pApplication.set_version = function (v)
        {
            this.version = v;
        };

        _pApplication.set_licenseurl = function (v)
        {
            this.licenseurl = v;
        };

        _pApplication.set_screenid = function (screenid)
        {
            this.screenid = screenid;
        };

        _pApplication._setLocale = function (v)
        {
            var mainframe = this.mainframe;
            if (mainframe)
            {
                mainframe._on_apply_locale(v);
            }
        };

        //_pApplication.set_enableanimation = function (v)
        //{
        //    this.enableanimation = nexacro._toBoolean(v);
        //};

        _pApplication.set_enginesetupkey = function (v)
        {
            this.enginesetupkey = v;
        };

        _pApplication.set_engineurl = function (v)
        {
            this.engineurl = v;
        };

        _pApplication.set_engineversion = function (v)
        {
            this.engineversion = v;
        };



        //engineurl - fullpath 

        //os(windows, windows_7) > device (default)
        //os(ios, ios_5) > device (default, iphone5s)
        _pApplication._updateEngine = function (updateengine)
        {
            var enginesetupkey = "", engineversion = "", engineurl = "";
            if (updateengine)
            {
                var cur_device_str = nexacro._DEVICE.toLowerCase();
                var cur_osversion = nexacro._getOSVersion();   // desktop의 경우 undefined 이기 때문에 toLowerCase() 하면 안됨            
                var cur_os_str = (cur_osversion ? cur_osversion.toLowerCase().replace(/ /g, "_") : "");

                var cur_systype_str = nexacro._SystemType.toLowerCase();
                if (cur_systype_str.indexOf("win") >= 0) cur_systype_str = "windows";
                else if (cur_systype_str.indexOf("ipad") >= 0) cur_systype_str = "iphone";

                var selectos = updateengine[cur_systype_str];  //windows
                if (cur_device_str.length <= 0)
                    cur_device_str = "default";

                if (updateengine[cur_os_str])                  //windows_7, windows_xp
                {
                    selectos = updateengine[cur_os_str];
                }
                else
                {
                    if (selectos[cur_os_str])                 //windows.windows_7, window.windows_xp  
                        selectos = selectos[cur_os_str];
                }

                if (selectos)
                {
                    var selectitem = selectos[cur_device_str];   // windows_7.default or windows.windows_7.default or windows.default 
                    if (selectitem)
                    {
                        enginesetupkey = selectitem.enginesetupkey;
                        engineversion = selectitem.engineversion;
                        engineurl = selectitem.engineurl;
                    }
                }
            }

            if (enginesetupkey.length > 0 && engineurl.length > 0 && engineversion.length > 0)
            {
                var requesturl = this._transfullurl(this._project_url, engineurl);
                nexacro._updateEngine(enginesetupkey, requesturl, engineversion);   // 엔진업데이트 시작시 throw exception
            }

        };


        //"fatal" : 치명적이 에러인 경우 - 0 
        //"error" : 일반적인 에러인 경우 - 1
        //"warn" : 경고인 경우          - 2
        //"info" : 일반 정보인 경우     - 3
        //"debug" : 디버그 정보인 경우  - 4
        //_pApplication.set_loglevel = function (v)
        //{
        //    if (v == "fatal")
        //        this._loglevel = 0;
        //    else if (v == "error")
        //        this._loglevel = 1;
        //    else if (v == "warn")
        //        this._loglevel = 2;
        //    else if (v == "info")
        //        this._loglevel = 3;
        //    else
        //        this._loglevel = 4;

        //    this.loglevel = v;
        //};

        //'runtime' : 일반적인 런타임 에러만 onerror 이벤트를 발생시킵니다.
        //'all' : 스크립트 에러도 onerror 이벤트를 발생시킵니다.
        _pApplication.set_errorlevel = function (v)
        {
            this.errorlevel = v;
        };


        //_pApplication.set_cookiecachetype = function (v)
        //{
        //    //"cache" 만 지원  "none"은 지원하지 않음 
        //    //
        //};


        _pApplication.set_fullscreen = function (v)
        {
            this.fullscreen = nexacro._toBoolean(v);
        };



        _pApplication.set_modallockmode = function (v)
        {
            this.modallockmode = v;
        };


        _pApplication.set_okclosebutton = function (v)
        {
            this.okclosebutton = v;
        };


        _pApplication.reload_theme = function (/*form, url*/)
        {
        };

        _pApplication.reload = function ()
        {
            window.location.reload();
        };

        //Multi-LayoutManager 
        //_pApplication.getLayoutManager = function ()
        //{
        //    return this._layout_manager;
        //};


        //PopupComponent 제어

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
            var datalist = this._load_manager.dataList;
            if (!datalist)
                return -1;
            var canceledCnt = 0, j;

            if (id != undefined)
            {
                var datalistid = (typeof id == "string") ? id.split(",") : id;
                if (datalistid.length > 0)
                {
                    var datalistfilter = [];
                    for (var k = 0; k < datalist.length; k++)
                    {
                        datalistfilter[k] = datalist[k].url;
                    }

                    var datalistfiltered = [], i;
                    for (j = 0; datalistfilter.length > j; j++)
                    {
                        var datalistfound = false;
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

            var datalen = datalist.length;
            for (j = 0; j < datalen; j++)
            {
                var dataitem = datalist[j];
                var dataitem_handle = dataitem.handle;
                dataitem_handle._user_aborted = true;
                dataitem._is_cancel = true;
                nexacro._cancelLoad(dataitem_handle);
                canceledCnt++;
            }
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

            // destroy tray
            this.removeTray();

            // mainframe BeforeClose, Close process
            var mainframe = this.mainframe;
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
                    if (chframe && chframe.form)
                    {
                        chframe.form.close();
                    }
                }
            }
            this.mainframe._destroy();

            this._global_context = null;   // lookup topmost
            nexacro._applicationExit();
        };

        _pApplication.exit = function ()
        {
            // 사용자 호출시 window.close를 같이 수행함.
            if (this._exit() === false)
                return;
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
            nexacro._initApplication();
            this.on_initApplication();
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
            var suburl = nexacro._getServiceLocation(url);
            /*
                        var includeurl = [];
                        includeurl.push(suburl);
                        includeurl.push(".js");
                        suburl = includeurl.join("");
            */

            var scriptlist = this._includescriptlist;
            var len = scriptlist.length;
            var item;
            for (var i = 0; i < len; i++)
            {
                item = scriptlist[i];
                if (item.url == suburl && !item.isexecuted)
                {
                    item.isexecuted = true;
                    item.fn.call(this);

                    break;
                }
            }
        };

        _pApplication._executeScript = function (context)
        {
            if (context && context._registerscriptfn)
            {
                context._registerscriptfn.call(context);
            }
        };


        _pApplication.registerScript = function (filename, fn)
        {
            var scriptlist = this._includescriptlist;
            var len = scriptlist.length;

            for (var i = 0; i < len; i++)
            {
                if (scriptlist[i].url == filename)
                {
                    scriptlist[i].fn = fn;
                    return;
                }
            }

            this._registerscriptfn = fn;
        };


        _pApplication.addIncludeScript = function (mainurl, url)
        {
            if (url)
            {
                var _svcurl;
                if (nexacro._Browser == "Runtime" && (nexacro._SystemType.toLowerCase() == "win32" || nexacro._SystemType.toLowerCase() == "win64"))
                    _svcurl = url;

                var suburl = nexacro._getServiceLocation(url);
                /*
                                var includeurl = [];
                                includeurl.push(suburl);
                                includeurl.push(".js");
                                suburl = includeurl.join("");
                */
                var includescript;
                var len = this._includescriptlist.length;
                for (var i = 0; i < len; i++)
                {
                    includescript = this._includescriptlist[i];
                    if (includescript.url == suburl)
                    {
                        return;
                    }
                }

                this._includescriptlist.push({ target: mainurl, url: suburl, fn: nexacro._emptyFn, isload: false, isexecuted: false, service_url: _svcurl });
            }
        };

        _pApplication.loadIncludeScript = function (mainurl)
        {
            var includescript;
            var len = this._includescriptlist.length;
            for (var i = 0; i < len; i++)
            {
                includescript = this._includescriptlist[i];
                if (includescript.isload == false)
                {
                    // IE9에서 open시 FormBase에 링크된 loadIncludeScript 가 호출될 때,
                    // 함수 내에서 또 this의 함수(_loadInclude)를 호출하면 this가 window로 바뀌는 문제가 있다.
                    // call을 통해 호출하면 문제가 발생하지 않음... why?? 2014.02.14 neoarc
                    includescript.isload = true;
                    this._loadInclude.call(this, mainurl, includescript.url, true, includescript.service_url);
                }
            }
        };


        // for runtime
        var _global_context = this;

        //context에 global, local load가 완료된 후에 호출되는 함수
        //compile된 adl안에 구현 되어 있어야 함
        //component를 만들기 시작하는 함수


        _pApplication._on_init = function ()
        {
            // globalvars 오류시 project load되지 않는 문제
            try
            {
                //check globalcnt 
                //check localcnt
                //nexacro._initializeGlobalObjects(_global_context);
                // this._RegisterClass(_global_context);

                nexacro._observeGlobalEvent(null, "beforeuserconfirm", "onbeforeuserconfirm", this._on_callback_beforeuserconfirm);
                nexacro._observeGlobalEvent(null, "afteruserconfirm", "onafteruserconfirm", this._on_callback_afteruserconfirm);

                this.initApplication();

                if (this.mainframe)
                    this.mainframe.createBodyFrame();

                this._executeScript(this);
                this.initEvent();

                // this.on_fire_onloadtypedefinition(this, this._typedefinition_url);  삭제
                this.loadGlobalVariables();
                this.on_fire_onloadingappvariables(this, this._globalvar_uri);

                var cnt = this._datasets.length, i;
                for (i = 0; i < cnt; i++)
                {
                    this._datasets[i].on_created();
                }

                if (this.mainframe)
                {
                    this.mainframe.createComponent();
                    this.mainframe.on_created();
                }

                cnt = this.trays.length;
                for (i = 0; i < cnt; i++)
                {
                    this.trays[i].on_created();
                }

                // load default wait image
                //if (!this.loadingimage)
                //{
                //    var loadingimage = this._getLoadingImageUrl();
                //    loadingimage = nexacro._getImageLocation(loadingimage);
                //    nexacro._getImageSize(loadingimage, this._on_loadwaitimage, this);
                //}
                nexacro._is_loaded_application = true;
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
            var mainframe = this.mainframe;
            var statusbar = mainframe ? mainframe.statusbar : null;
            if (statusbar)
            {
                statusbar._beginCommProgress();
            }
        };

        _pApplication._stepCommProgress = function (current, overall)
        {
            var mainframe = this.mainframe;
            var statusbar = mainframe ? mainframe.statusbar : null;
            if (statusbar)
            {
                statusbar._stepCommProgress(current, overall);
            }
        };

        _pApplication._endCommProgress = function ()
        {
            var mainframe = this.mainframe;
            var statusbar = mainframe ? mainframe.statusbar : null;
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
    }

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

            comp = null;
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

        var ret = true;
        var touch_len = touches.length;

        var target_elem = elem ? elem : this._start_elem;
        var target_compinfo = win.findComponent(target_elem, 0, 0);
        var target_elem_pos = target_elem._getPositionInWindow();

        // set TouchInput
        var touch_input = new nexacro.TouchInput(elem, "touchmove", time);

        var first_touch_id = session.getFirstTouchId();
        var touch, touchTarget;
        var compinfo, elem_pos, client_pos, comp;
        for (var i = 0; i < touch_len; i++)
        {
            touch = touches[i];

            if (!touch.target && !elem) return;
            touchTarget = touch.target || elem;


            comp = null;
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

        var prev_elem = session._cur_elem, ret;
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

                if (!dragInfo.isDragging)
                {
                    if (windowX != dragInfo.startX || windowY != dragInfo.startY)
                    {
                        var drag_elem = dragInfo.target_elem;
                        comp = win.findComponent(drag_elem);
                        var elem_pos = drag_elem._getPositionInWindow();
                        var canvasX = windowX - elem_pos[0];
                        var canvasY = windowY - elem_pos[1];
                        var retDrag = comp._on_drag(drag_elem, "touch", false, false, false, canvasX, canvasY, screenX, screenY);
                        if (retDrag && retDrag[0] === true)
                        {
                            dragInfo.isDragging = true;
                            dragInfo.target = retDrag[1];
                            dragInfo.referTarget = retDrag[2];
                            dragInfo.data = retDrag[3];
                            dragInfo.userdata = retDrag[4];
                            comp._on_dragmove(drag_elem, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, "touch", false, false, false, canvasX, canvasY, screenX, screenY);

                            // TODO Fire Enter & Leave ?

                            session.stop();
                            return true;
                        }
                    }
                    nexacro._cur_drag_info = null;
                }
                else
                {
                    elem = (touch.target || elem);
                    comp = win.findComponent(elem);
                    if (comp)
                    {
                        var elem_pos, canvasX, canvasY;
                        if (prev_elem == elem)
                        {
                            elem_pos = comp.getElement()._getPositionInWindow();
                            canvasX = windowX - elem_pos[0];
                            canvasY = windowY - elem_pos[1];
                            comp._on_dragmove(elem, dragInfo.target, dragInfo.referTarget, dragInfo.data, dragInfo.userdata, dragInfo.datatype, dragInfo.filelist, "touch", false, false, false, canvasX, canvasY, screenX, screenY);
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

            if (nexacro._enabletouchevent)
            {
                var trackInfo = nexacro._cur_track_info;
                var repeatInfo = nexacro._cur_repeat_info;
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
        for (i = 0; i < change_len; i++)
        {
            touch = changedTouches[i];

            if (!touch.target && !elem) return;
            touchTarget = touch.target || elem;

            var compinfo, elem_pos, client_pos, comp = null;
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

            var compinfo, elem_pos, client_pos, comp = null;
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
                var comp = win.findComponent(up_elem);
                if (comp)
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
        nexacro._cur_drag_info = null;

        var target_comp = target_compinfo[0];
        // fire ontouchend event
        this.on_fire_ontouch(win, target_comp, target_elem, touch_input);

        // grid용 제거하면 좋겠는데...
        if (target_comp && target_comp._is_alive)
            target_comp._on_last_lbuttonup();

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
        var compinfo, elem_pos, client_pos, comp = null;
        var touch, touchTarget, first_touch_id = session.getFirstTouchId();
        for (var i = 0; i < change_len; i++)
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
            //if (prevented)
            //{
            //    //this._touch_session
            //}
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
            //if (prevented)
            //{
            //    //this._touch_session
            //}
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
            //if (prevented)
            //{
            //    //this._touch_session
            //}
        }
    };
    _pTouchGestureManager.onlongpress = function (elem, data, touches/*, changedTouches*/)
    {
        var target_elem = this._start_elem ? this._start_elem : elem;
        var target_win = this._start_win ? this._start_win : target_elem._getWindow();
        if (!target_elem || !target_win) return;

        var compinfo = target_win.findComponent(target_elem, 0, 0);
        if (compinfo && compinfo[0])
        {
            if (nexacro._enabletouchevent)
            {
                compinfo[0]._on_longpress(target_elem, touches);
            }
            else
            {
                var touch = this.getFirstTouchInputInfo(touches);
                compinfo[0]._on_rbuttondown(target_elem, "touch", false, false, false, touch._canvasx, touch._canvasy, touch.screenx, touch.screeny);
                //compinfo[0]._on_rbuttonup(target_elem, "touch", false, false, false, touch.canvasx, touch.canvasy, touch.screenx, touch.screeny); // buttonup 아래에...event2번 발생.
                this._is_ondrag = false;
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

            if (!nexacro._enabletouchevent)
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
            if (nexacro._enabletouchevent)
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
            if (nexacro._enabletouchevent)
            {
                compinfo[0]._on_dbltap(touch.target, touch._canvasx, touch._canvasy, touch.screenx, touch.screeny);
            }
            else if (touch)
            {
                compinfo[0]._on_dblclick(touch.target, "lbutton", false, false, false, touch._canvasx, touch._canvasy, touch.screenx, touch.screeny);
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
        var target_elem = this._start_elem ? this._start_elem : elem;
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
        if (nexacro._enabletouchevent)
        {
            var ret;
            switch (evttype)
            {
                case nexacro.Touch._TOUCH_START:
                    comp._on_touchstart(this, touches, changedTouches);
                    break;
                case nexacro.Touch._TOUCH_MOVE:
                    comp._on_touchmove(this, touches, changedTouches);
                    break;
                case nexacro.Touch._TOUCH_END:
                    ret = comp._on_touchend(this, touches, changedTouches);
                    if (this._is_ondrag && this._scroll_mode == -1) //check
                    {
                        var touch = this.getFirstTouchInputInfo(touches);
                        if (touch && elem == touch.target)
                            comp._on_tap(elem, touch._canvasx, touch._canvasy, touch.screenx, touch.screeny);
                    }
                    if (ret == true)
                    {
                        input.preventAction();
                    }
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
                        win._on_sys_lbuttondown(this._start_elem, "touch", false, false, false, firstTouch.windowx, firstTouch.windowy, firstTouch.screenx, firstTouch.screeny);
                        win._on_sys_lbuttonup(target, "touch", false, false, false, firstTouch.windowx, firstTouch.windowy, firstTouch.screenx, firstTouch.screeny, undefined, undefined, undefined, elem);

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
        }

        if (!elem || (!linkedcontrol && !focused_comp))
            return;

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
                    if (focused_comp == linkedcontrol)
                        return true;

                    var is_focused_input = elem instanceof nexacro.InputElement;
                    if (is_focused_input)
                        return true;

                    if (elem._use_decoration)
                        return true;

                    if (nexacro._enableaccessibility)
                        return true;

                    var is_plugin_elem = elem instanceof nexacro.PluginElement;
                    if (is_plugin_elem)
                        return true;

                    var is_webbrowser = focused_comp instanceof nexacro.WebBrowser;
                    if (is_webbrowser)
                        return true;
                    // TODO Focus되지 않은 Input에 Tap 하는 경우, Tap위치에 바로 Caret 이동 How to??
                    break;
            }
        }
        else if (nexacro._OS == "Android")
        {
            switch (type)
            {
                case 0: // touchstart
                    return true;
                    break;
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

                    if (nexacro._BrowserExtra == "SamsungBrowser")
                    {
                        if (focused_comp_type == "edit")
                            return true;
                    }
                    else
                    {
                        if (focused_comp_type == "edit")
                        {
                            if (!(elem instanceof nexacro.InputElement))
                            {
                                if (linkedcontrol instanceof nexacro.Form)
                                    return true;
                            }
                            else//if (nexacro._enabletouchevent)
                                return true;
                        }
                    }

                    if (elem._use_decoration)
                        return true;

                    if (nexacro._enableaccessibility)
                        return true;

                    var is_plugin_elem = elem instanceof nexacro.PluginElement;
                    if (is_plugin_elem)
                        return true;

                    var is_webbrowser = focused_comp instanceof nexacro.WebBrowser;
                    if (is_webbrowser)
                        return true;

                    break;
            }
        }
        return false;
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
            } else
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
    nexacro.Environment = function ()
    {
        this._hotkey_list = []; // Hotkey 사용하는 Component와 Hotkey정보 리스트
        /* nexacro namespace로 이동해야됨. 연관된 작업이 많아 임시로 env에 저장 */
    };

    var _pEnvironment = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.Environment);
    nexacro.Environment.prototype = _pEnvironment;
    _pEnvironment._type_name = "Environment";

    /* property */
    _pEnvironment.addcookietovariable = true;
    _pEnvironment.codepage = "";
    _pEnvironment.checkversion = false;
    _pEnvironment.version = "";

    _pEnvironment.enableevent = true;

    //accessibility Property
    _pEnvironment.enableaccessibility = false;
    _pEnvironment.accessibilitytype = "standard"; //standard/sensereader/jaws
    _pEnvironment.accessibilityreplayhotkey = "";
    _pEnvironment.accessibilitybackwardkey = "";
    _pEnvironment.accessibilityforwardkey = "";
    _pEnvironment.accessibilityhistorycount = 5;
    _pEnvironment.accessibilitywholereadhotkey = "";
    //_pEnvironment.accessibilityreplayhotkey = "";
    _pEnvironment.accessibilitywholereadtype = "none"; // none/load/change/loadchange
    _pEnvironment.accessibilitydescreadtype = "label"; //multienum - label/action/description
    _pEnvironment.accessibilityfirstovermessage = ""; //
    _pEnvironment.accessibilitylastovermessage = "";
    _pEnvironment.accessibilityheadingnexthotkey = "";
    _pEnvironment.accessibilityheadingprevhotkey = "";

    _pEnvironment.tabkeycirculation = "form,cycle";

    _pEnvironment._accessibilitywholereadtype = 0;
    _pEnvironment._accessibilityHistoryList = null;
    _pEnvironment._accessibilityHistoryCursor = -1;


    _pEnvironment.enabletouchevent = false;
    _pEnvironment.filesecurelevel = "private";    //  all, private (default)
    _pEnvironment.highcontrastthemeid = "";
    _pEnvironment.httpretry = 0;
    _pEnvironment.httptimeout = 30;
    _pEnvironment.imepastemode = 0;
    _pEnvironment.initvaluefileid = "";
    _pEnvironment.key = "";
    _pEnvironment.language = "";   //미구현
    _pEnvironment.layoutselecttype = "";  //미구현
    _pEnvironment.loadingimage = "";
    _pEnvironment.locale = "";
    _pEnvironment.loglevel = "debug";
    _pEnvironment.mousewheeltype = 0;
    _pEnvironment.networksecurelevel = "private";      //  0:all, 1:private (default)
    _pEnvironment.popuptype = ""; // 미구현
    _pEnvironment.proxyretry = 0;
    _pEnvironment.proxytimeout = 30;
    _pEnvironment.services = new nexacro.Collection();
    _pEnvironment.themeid = "";
    _pEnvironment.traceduration = -1;
    _pEnvironment.tracemode = "none";
    _pEnvironment.datasetloadtype = "onsuccess";

    _pEnvironment.updates = null;
    _pEnvironment.usecontextmenu = "all";
    _pEnvironment.usehttpkeepalive = false;
    _pEnvironment.useproxykeepalive = false;
    _pEnvironment.usewaitcursor = true;
    _pEnvironment.scrollbarsize = undefined;
    _pEnvironment.scrollbartype = undefined;
    _pEnvironment.scrollindicatorsize = undefined;

    _pEnvironment.rtl = undefined;	// true/false
    _pEnvironment.enablescreencapture = true;
    _pEnvironment.enablecookie = true;
    _pEnvironment.enablecache = true;
    _pEnvironment.enableclipboard = true;
    _pEnvironment.name = "environment";
    _pEnvironment.id = "environment";
    _pEnvironment.mousehovertime = 500;
    //internal 
    nexacro._enabletouchevent = false;
    nexacro._tabkeycirculation = 0;
    nexacro._default_loadingimage = "./images/waitimage.gif";
    nexacro._resource_path = "";
    nexacro._usewaitcursor = true;
    nexacro._rtl = undefined;
    nexacro._httpretry = 0;
    nexacro._httptimeout = 30;
    nexacro._traceduration = -1;
    nexacro._tracemode = "none";
    nexacro._loadingimage = "";
    nexacro._loglevel = 4;
    nexacro._quickview_mode = false;
    nexacro._viewtoollog = false;
    nexacro._addcookietovariable = true;
    nexacro._locale = "";
    nexacro._desktopscreenwidth = 1280;

    /* init internal prop */
    _pEnvironment._typedefinition_url = "";
    _pEnvironment._project_url = "";

    /* event list */
    _pEnvironment._event_list =
    {
        "onerror": 1,
        "onaccessibilitykey": 1,
        "onload": 1
    };


    //===============================================================
    // nexacro.Environment : Create & Update
    //===============================================================
    _pEnvironment.create = function ()
    {

    };

    _pEnvironment.set_tabkeycirculation = function (v)
    {
        if (this.tabkeycirculation != v)
        {
            switch (v)
            {
                case "form,nocycle":
                    nexacro._tabkeycirculation = 1;
                    this.tabkeycirculation = v;
                    break;
                default:
                    nexacro._tabkeycirculation = 0;
                    this.tabkeycirculation = "form,cycle";
                    break;
            }
        }
    };

    _pEnvironment.set_rtl = function (v)
    {
        this.rtl = v;
        nexacro._rtl = nexacro._toBoolean(v);
    };

    _pEnvironment.set_enablescreencapture = function (v)
    {
        this.enablescreencapture = nexacro._toBoolean(v);
        nexacro._setEnableScreenCapture(v);
    };

    _pEnvironment.set_enablecookie = function (v)
    {
        this.enablecookie = nexacro._toBoolean(v);
        nexacro._setEnableCookie(v);
    };

    _pEnvironment.set_enablecache = function (v)
    {
        this.enablecache = nexacro._toBoolean(v);
        nexacro._setEnableCache(v);
    };

    _pEnvironment.set_enableclipboard = function (v)
    {
        this.enableclipboard = nexacro._toBoolean(v);
        nexacro._setEnableClipboard(v);
    };

    _pEnvironment.set_addcookietovariable = function (v)
    {
        v = nexacro._toBoolean(v);
        this.addcookietovariable = v;
        nexacro._addcookietovariable = v;
    };

    _pEnvironment.set_codepage = function (v)
    {

    };

    _pEnvironment.set_enableevent = function (v)
    {
        this.enableevent = nexacro._toBoolean(v);
    };

    _pEnvironment.set_enabletouchevent = function (v)
    {
        this.enabletouchevent = nexacro._toBoolean(v);
        nexacro._enabletouchevent = this.enabletouchevent;
    };

    _pEnvironment.set_filesecurelevel = function (v)
    {
        this.filesecurelevel = v;
        nexacro._setFileSecureLevel(v);
    };

    _pEnvironment.set_highcontrastthemeid = function (v)
    {
        this.highcontrastthemeid = v;
    };

    _pEnvironment.set_httpretry = function (v)
    {
        var httpretry = nexacro._parseInt(v);
        this.httpretry = (httpretry > 0) ? httpretry : 0;
        nexacro._httpretry = this.httpretry;
        nexacro._setHttpRetry(this.httpretry);
    };

    _pEnvironment.set_httptimeout = function (v)
    {
        var timeout = nexacro._parseInt(v);
        this.httptimeout = (timeout > 0) ? timeout : 0;
        nexacro._httptimeout = this.httptimeout;
        nexacro._setHttpTimeout(this.httptimeout);
    };

    _pEnvironment.set_imepastemode = function (v)
    {
        this.imepastemode = v;
    };

    _pEnvironment.set_initvaluefileid = function (v)
    {
        // generation 시에 index.html popup.html, start.json 안에 포함함
        this.initvaluefileid = v;
    };

    _pEnvironment.set_key = function (v)
    {
        //Load 시 
        this.key = v;
    };

    _pEnvironment.set_mousehovertime = function (v)
    {
        this.mousehovertime = v;
        nexacro._setMouseHovertime(this.mousehovertime);
    };

    _pEnvironment.set_xadl = function (v)
    {
        //Load 시 
        this.xadl = v;
    };

    _pEnvironment.set_language = function (/*v*/)
    {

    };

    _pEnvironment.set_layoutselecttype = function (v)
    {
        this.layoutselecttype = v;
    };


    _pEnvironment.set_loadingimage = function (v)
    {
        this.loadingimage = v;
        nexacro._loadingimage = v;
        //if (this._is_loaded)
        //{
        //	var imagesize = nexacro._getImageSize(v, this._on_loadwaitimage, this);
        //}
    };

    _pEnvironment._on_loadwaitimage = function ()
    {
    };

    _pEnvironment.set_locale = function (v)
    {
        if (v != this.locale)
        {
            this.locale = v;
            nexacro._setLocale(v);
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
            nexacro._loglevel = 0;
        else if (v == "error")
            nexacro._loglevel = 1;
        else if (v == "warn")
            nexacro._loglevel = 2;
        else if (v == "info")
            nexacro._loglevel = 3;
        else
            nexacro._loglevel = 4;

        this.loglevel = v;
    };

    _pEnvironment.set_mousewheeltype = function (v)
    {
        this.mousewheeltype = v;
    };

    _pEnvironment.set_networksecurelevel = function (v)
    {
        this.networksecurelevel = v;
        nexacro._setNetworkSecureLevel(v);
    };

    _pEnvironment.set_popuptype = function (v)
    {
        this.popuptype = v;
    };

    _pEnvironment.set_proxyretry = function (v)
    {
        this.proxyretry = nexacro._parseInt(v);
    };

    _pEnvironment.set_proxytimeout = function (v)
    {
        this.proxytimeout = nexacro._parseInt(v);
    };

    //논의 필요
    _pEnvironment.set_services = function (/*v*/)
    {

    };

    _pEnvironment.set_themeid = function (v)
    {
        this.themeid = v;
    };

    _pEnvironment.set_traceduration = function (v)
    {
        var traceduration = this.traceduration;
        var val = nexacro._parseInt(v);

        if (traceduration != val)
        {
            this.traceduration = val;
            nexacro._traceduration = val;
            if (this.tracemode == "append" && val < 1)
            {
                nexacro._deleteTraceLogFile();
            }
        }
    };

    //"none" : 로그 파일을 만들지 않습니다.
    //"new" : Application이 시작할때마다 로그 파일을 새로 만듭니다.
    //"append" : 기존에 있는 로그 파일에 추가합니다.
    _pEnvironment.set_tracemode = function (v)
    {
        var tracemode = this.tracemode;

        if (tracemode != v)
        {
            this.tracemode = v;
            nexacro._tracemode = v;
            if (this.tracemode != "append")
            {
                nexacro._deleteTraceLogFile();
            }
        }
    };

    //논의 필요
    _pEnvironment.set_updates = function (/*v*/)
    {

    };

    _pEnvironment.set_usecontextmenu = function (v)
    {
        this.usecontextmenu = v;
    };

    _pEnvironment.set_usehttpkeepalive = function (v)
    {
        v = nexacro._toBoolean(v);
        this.usehttpkeepalive = v;
        nexacro._setUseHttpKeepAlive(v);
    };

    _pEnvironment.set_useproxykeepalive = function (v)
    {
        this.useproxykeepalive = nexacro._toBoolean(v);
    };

    _pEnvironment.set_usewaitcursor = function (v)
    {
        this.usewaitcursor = nexacro._toBoolean(v);
        nexacro._usewaitcursor = this.usewaitcursor;
    };

    _pEnvironment.set_scrollbarsize = function (v)
    {
        this.scrollbarsize = parseInt(v);
    };

    _pEnvironment.set_scrollindicatorsize = function (v)
    {
        this.scrollindicatorsize = parseInt(v);
    };

    _pEnvironment.set_scrollbartype = function (v)
    {
        this.scrollbartype = v;
    };

    _pEnvironment.set_userfontid = function (v)
    {
        if (!this._request_mainurl)
            this.userfontid = v;
    };

    //favicon for supported
    _pEnvironment.set_icon = function (v)
    {
        this.icon = v;
    };

    _pEnvironment.set_checkversion = function (v)
    {
        this.checkversion = nexacro._toBoolean(v);
    };

    _pEnvironment.set_version = function (v)
    {
        this.version = v;
    };

    _pEnvironment.set_datasetloadtype = function (v)
    {
        var type_enum = ["onsuccess", "errorallow"];

        if (v)
            v = v.toString().toLowerCase();

        if (type_enum.indexOf(v) >= 0)
            this.datasetloadtype = v;
    };

    //// 호출 시점에 대한 논의가 필요함
    ////현재는 mainwindow 생성시에 등록하도록 함
    _pEnvironment._registerClass = function (_jsContext)
    {
        var registerclass = nexacro._registerclass;
        var len = registerclass.length;
        for (var i = 0; i < len; i++)
        {
            var item = registerclass[i];
            if (item && !_jsContext[item.id])
            {
                _jsContext[item.id] = nexacro._executeGlobalEvalStr(item.classname);
            }
        }
    };

    _pEnvironment._setCurrentScreen = function (screeninfo)
    {
        this._curscreen = screeninfo;

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

        this._curscreen = null;
        delete this._curscreen;
    };

    var _global_context = this;
    _pEnvironment.init = function ()
    {
        nexacro._initializeGlobalObjects(_global_context);
        this._registerClass(_global_context);

        var component_uri = nexacro._component_uri;
        if (component_uri)
        {
            nexacro._resource_path = nexacro._transfullurl(component_uri, "../resources/");
        }

        this.on_init();
        this._applyScreenProp();

        var _locale_info = nexacro.Locale.getLocaleInfo(nexacro._locale);
        nexacro._rtl = nexacro._rtl ? nexacro._rtl : _locale_info.direction == "rtl";
    };

    ///////////////////////////////// Start accessibility //////////////////////////////////

    _pEnvironment.set_enableaccessibility = function (v)
    {
        var enableaccessibility = nexacro._toBoolean(v);
        if (enableaccessibility == this.enableaccessibility)
            return;
        this.enableaccessibility = enableaccessibility;
        if (this.enableaccessibility === true)
        {
            if (this._accessibilityHistoryList == null)
                this._accessibilityHistoryList = [];

            this.on_fire_onaccessibility("", this, this);
        }
        else
        {
            this._accessibilityHistoryList = null;
        }

        nexacro._setEnableAccessibility(v);
        if (enableaccessibility && nexacro._enableaccessibility != this.enableaccessibility)
        {
            nexacro._onSystemWarning(this, "native_require_add_module_accessibility");
        }
    };

    _pEnvironment.set_accessibilitytype = function (v)
    { //standard/sensereader/jaws
        this.accessibilitytype = v;
        nexacro._setAccessibilityType(v);
    };

    _pEnvironment.set_accessibilityreplayhotkey = function (v)
    {
        var cur_accessibilityreplayhotkey = this._accessibilityreplayhotkey;
        if (cur_accessibilityreplayhotkey)
            this._unregisterHotkey(cur_accessibilityreplayhotkey);
        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this.accessibilityreplayhotkey = "";
            this._accessibilityreplayhotkey = null;
            hotkey = null;
        }
        else
        {
            this.accessibilityreplayhotkey = hotkey._toString();
            this._accessibilityreplayhotkey = hotkey;

            this._registerHotkey(hotkey);
        }
    };


    _pEnvironment.set_accessibilitybackwardkey = function (v)
    {
        var cur_accessibilitybackwardkey = this._accessibilitybackwardkey;
        if (cur_accessibilitybackwardkey)
            this._unregisterHotkey(cur_accessibilitybackwardkey);
        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this.accessibilitybackwardkey = null;
            this._accessibilitybackwardkey = null;
            hotkey = null;
        }
        else
        {
            this.accessibilitybackwardkey = hotkey._toString();
            this._accessibilitybackwardkey = hotkey;

            this._registerHotkey(hotkey);
        }
    };

    _pEnvironment.set_accessibilityforwardkey = function (v)
    {
        var cur_accessibilityforwardkey = this._accessibilityforwardkey;
        if (cur_accessibilityforwardkey)
            this._unregisterHotkey(cur_accessibilityforwardkey);
        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this.accessibilityforwardkey = null;
            this._accessibilityforwardkey = null;
            hotkey = null;
        }
        else
        {
            this.accessibilityforwardkey = hotkey._toString();
            this._accessibilityforwardkey = hotkey;
            this._registerHotkey(hotkey);
        }
    };

    _pEnvironment.set_accessibilityhistorycount = function (v)
    {
        v = parseInt(v);
        if (isNaN(v) || v < 0)
            v = 0;

        this.accessibilityhistorycount = v;
        var historylist = this._accessibilityHistoryList;
        var len = historylist.length;
        if (len > v)
        {
            while (len-- > v)
                historylist.shift();

            this._accessibilityHistoryCursor = v - 1;
        }

    };

    _pEnvironment.set_accessibilitywholereadhotkey = function (v)
    {
        var cur_accessibilitywholereadhotkey = this._accessibilitywholereadhotkey;
        if (cur_accessibilitywholereadhotkey)
            this._unregisterHotkey(cur_accessibilitywholereadhotkey);
        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this.accessibilitywholereadhotkey = "";
            this._accessibilitywholereadhotkey = null;
            hotkey = null;
        }
        else
        {
            this.accessibilitywholereadhotkey = hotkey._toString();
            this._accessibilitywholereadhotkey = hotkey;

            this._registerHotkey(hotkey);
        }
    };

    _pEnvironment.set_accessibilitywholereadtype = function (v)
    {
        this.accessibilitywholereadtype = v;
        nexacro._setAccessibilityWholeReadType(v);
    };

    _pEnvironment.set_accessibilitydescreadtype = function (v)
    {
        this.accessibilitydescreadtype = v;
        nexacro._setAccessibilityDescReadType(v);
    };


    _pEnvironment.set_accessibilityfirstovermessage = function (v)
    {
        this.accessibilityfirstovermessage = v;
    };

    _pEnvironment.set_accessibilitylastovermessage = function (v)
    {
        this.accessibilitylastovermessage = v;
    };


    _pEnvironment.set_accessibilityheadingnexthotkey = function (v)
    {
        var cur_accessibilityheadingnexthotkey = this._accessibilityheadingnexthotkey;
        if (cur_accessibilityheadingnexthotkey)
            this._unregisterHotkey(cur_accessibilityheadingnexthotkey);
        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this.accessibilityheadingnexthotkey = "";
            this._accessibilityheadingnexthotkey = null;
            hotkey = null;
        }
        else
        {
            this.accessibilityheadingnexthotkey = hotkey._toString();
            this._accessibilityheadingnexthotkey = hotkey;
            this._registerHotkey(hotkey);
        }
    };

    _pEnvironment.set_accessibilityheadingprevhotkey = function (v)
    {
        var cur_accessibilityheadingprevhotkey = this._accessibilityheadingprevhotkey;
        if (cur_accessibilityheadingprevhotkey)
            this._unregisterHotkey(cur_accessibilityheadingprevhotkey);
        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this.accessibilityheadingprevhotkey = "";
            this._accessibilityheadingprevhotkey = null;
            hotkey = null;
        }
        else
        {
            this.accessibilityheadingprevhotkey = hotkey._toString();
            this._accessibilityheadingprevhotkey = hotkey;
            this._registerHotkey(hotkey);
        }
    };

    _pEnvironment.set_accessibilitycomponentnexthotkey = function (v)
    {
        var cur_accessibilitycomponentnexthotkey = this._accessibilitycomponentnexthotkey;
        if (cur_accessibilitycomponentnexthotkey)
            this._unregisterHotkey(cur_accessibilitycomponentnexthotkey);
        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this.accessibilitycomponentnexthotkey = "";
            this._accessibilitycomponentnexthotkey = null;
            hotkey = null;
        }
        else
        {
            this.accessibilitycomponentnexthotkey = hotkey._toString();
            this._accessibilitycomponentnexthotkey = hotkey;
            this._registerHotkey(hotkey);
        }
    };

    _pEnvironment.set_accessibilitycomponentprevhotkey = function (v)
    {
        var cur_accessibilitycomponentprevhotkey = this._accessibilitycomponentprevhotkey;
        if (cur_accessibilitycomponentprevhotkey)
            this._unregisterHotkey(cur_accessibilitycomponentprevhotkey);
        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this.accessibilitycomponentprevhotkey = "";
            this._accessibilitycomponentprevhotkey = null;
            hotkey = null;
        }
        else
        {
            this.accessibilitycomponentprevhotkey = hotkey._toString();
            this._accessibilitycomponentprevhotkey = hotkey;
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
        if (nexacro._enableaccessibility)
        {
            var forwardkey = this._accessibilityforwardkey;
            var backwardkey = this._accessibilitybackwardkey;
            var replayhotkey = this._accessibilityreplayhotkey;
            var wholereadhotkey = this._accessibilitywholereadhotkey;
            var headingnexthotkey = this._accessibilityheadingnexthotkey;
            var headingprevhotkey = this._accessibilityheadingprevhotkey;
            var componentnexthotkey = this._accessibilitycomponentnexthotkey;
            var componentprevhotkey = this._accessibilitycomponentprevhotkey;

            var comp;
            if (forwardkey && keycode == forwardkey._keycode &&
                altKey == ((forwardkey._modifierkey & 0x02) == 0x02) &&
                ctrlKey == ((forwardkey._modifierkey & 0x01) == 0x01) &&
                shiftKey == ((forwardkey._modifierkey & 0x04) == 0x04))
            {
                var readcursor = this._accessibilityHistoryCursor + 1;
                if (readcursor >= this._accessibilityHistoryList.length)
                    readcursor = this._accessibilityHistoryCursor = this._accessibilityHistoryList.length - 1;
                else
                    this._accessibilityHistoryCursor = readcursor;

                comp = this._get_accessibility_history(readcursor);
                if (comp)
                    this.playAccessibility(comp);
            }
            else if (backwardkey && keycode == backwardkey._keycode &&
                altKey == ((backwardkey._modifierkey & 0x02) == 0x02) &&
                ctrlKey == ((backwardkey._modifierkey & 0x01) == 0x01) &&
                shiftKey == ((backwardkey._modifierkey & 0x04) == 0x04))
            {


                var readcursor = this._accessibilityHistoryCursor - 1;
                if (readcursor < 0)
                    readcursor = this._accessibilityHistoryCursor = 0;
                else
                    this._accessibilityHistoryCursor = readcursor;

                comp = this._get_accessibility_history(readcursor);
                if (comp)
                    this.playAccessibility(comp);

            }
            else if (replayhotkey && keycode == replayhotkey._keycode &&
                altKey == ((replayhotkey._modifierkey & 0x02) == 0x02) &&
                ctrlKey == ((replayhotkey._modifierkey & 0x01) == 0x01) &&
                shiftKey == ((replayhotkey._modifierkey & 0x04) == 0x04))
            {
                comp = this._get_accessibility_history(this._accessibilityHistoryCursor);
                if (comp)
                    this.playAccessibility(comp);
            }
            else if (wholereadhotkey && keycode == wholereadhotkey._keycode &&
                altKey == ((wholereadhotkey._modifierkey & 0x02) == 0x02) &&
                ctrlKey == ((wholereadhotkey._modifierkey & 0x01) == 0x01) &&
                shiftKey == ((wholereadhotkey._modifierkey & 0x04) == 0x04))
            {
                //todo whole read hotkey 
                if (nexacro._accessibilitywholereadtype !== 0)
                {
                    //var ar = this._accessibilityHistoryList;
                    var lastfocusedcomp = this._get_accessibility_history(this._accessibilityHistoryList.length - 1);
                    var form = lastfocusedcomp._getForm();
                    form._playAccessibilityWholeReadLabel("wholeread");
                }
            }
            else if (headingnexthotkey && keycode == headingnexthotkey._keycode &&
                altKey == ((headingnexthotkey._modifierkey & 0x02) == 0x02) &&
                ctrlKey == ((headingnexthotkey._modifierkey & 0x01) == 0x01) &&
                shiftKey == ((headingnexthotkey._modifierkey & 0x04) == 0x04))
            {
                var form = curcomp._getForm();
                var lastfocus_comp = form._last_focused;
                comp = form._getNextHeadingComponent(lastfocus_comp);
                if (comp)
                    comp._setFocus(true, 2, true);
            }
            else if (headingprevhotkey && keycode == headingprevhotkey._keycode &&
                altKey == ((headingprevhotkey._modifierkey & 0x02) == 0x02) &&
                ctrlKey == ((headingprevhotkey._modifierkey & 0x01) == 0x01) &&
                shiftKey == ((headingprevhotkey._modifierkey & 0x04) == 0x04))
            {
                var form = curcomp._getForm();
                var lastfocus_comp = form._last_focused;
                comp = form._getPrevHeadingComponent(lastfocus_comp);
                if (comp)
                    comp._setFocus(true, 3, true);
            }
            else if (componentnexthotkey && keycode == componentnexthotkey._keycode &&
                altKey == ((componentnexthotkey._modifierkey & 0x02) == 0x02) &&
                ctrlKey == ((componentnexthotkey._modifierkey & 0x01) == 0x01) &&
                shiftKey == ((componentnexthotkey._modifierkey & 0x04) == 0x04))
            {
                var form = curcomp._getForm();
                if (form instanceof nexacro.Tab)
                    form = form._getForm();
                var last_comp = form._getLastFocused();
                comp = form._searchNextTabFocus(last_comp ? last_comp : form, undefined, undefined, 2);
                if (comp && comp[0])
                    form._processArrowKey(true, comp);
            }
            else if (componentprevhotkey && keycode == componentprevhotkey._keycode &&
                altKey == ((componentprevhotkey._modifierkey & 0x02) == 0x02) &&
                ctrlKey == ((componentprevhotkey._modifierkey & 0x01) == 0x01) &&
                shiftKey == ((componentprevhotkey._modifierkey & 0x04) == 0x04))
            {
                var form = curcomp._getForm();
                if (form instanceof nexacro.Tab)
                    form = form._getForm();
                var last_comp = form._getLastFocused();
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

        var historyList = this._accessibilityHistoryList;
        var historyCount, currentCount, lasthistorycomp;
        if (historyList)
        {
            historyCount = this.accessibilityhistorycount;
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

                    this._accessibilityHistoryCursor = currentCount;

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

            this._accessibilityHistoryCursor = currentCount;
        }
    };

    _pEnvironment._get_accessibility_history = function (n, replay)
    {
        var historyList = this._accessibilityHistoryList;
        if (historyList)
        {
            var historyCount = this.accessibilityhistorycount;
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
        var historyList = this._accessibilityHistoryList;
        for (var i = 0, len = historyList.length; i < len; i++)
        {
            if (historyList[i] == comp)
            {
                historyList.splice(i, 1);
                if (i <= this._accessibilityHistoryCursor)
                    this._accessibilityHistoryCursor--;
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
        var ret;
        if (comp instanceof nexacro.MainFrame)
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
            var child_list = comp.frames;
            if (!child_list)
                return null;

            var child_length = child_list.length;
            var i = 0;
            if (startcomp)
            {
                var index = nexacro._indexOf(child_list, startcomp) + 1;
                if (index > 0)
                    i = index;
            }
            for (; i < child_length; i++)
            {
                var child = (dir == "prev") ? child = child_list[child_length - 1 - i] : child_list[i];
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
            ret = _validation(comp.form, startcomp);
            if (ret == 1)
                return comp.form;
            if (ret == -1)
                startcomp = null;

            return this._findAccessibility(comp.form, startcomp, value, type, dir, depth, findfrom);
        }
        else if (comp._hasContainer()) // form, div, Tab, tabpage, popupdiv?
        {
            // Form은 taborder순으로 검색함
            //var child_list = comp._child_list;
            var child_list = comp._getComponentsByTaborder(comp, true);
            if (!child_list)
                return null;

            var child_length = child_list.length;
            var i = 0;
            if (startcomp)
            {
                var index = nexacro._indexOf(child_list, startcomp) + 1;
                if (index > 0)
                    i = index;
            }
            for (; i < child_length; i++)
            {
                var child = (dir == "prev") ? child = child_list[child_length - 1 - i] : child_list[i];
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

    _pEnvironment.registerScript = function (filename, fn)
    {
        this._registerfn = fn;
    };

    _pEnvironment._executeScript = function (filename, fn)
    {
        if (this._registerfn)
        {
            this._registerfn.call(this);
            this._registerfn = null;
        }
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
        //trace("loadingimage:" + loadingimage);
        nexacro._getImageSize(loadingimage, this._on_loadwaitimage, this);
    };


    _pEnvironment._load = function (project_path)
    {
        this.loadTypeDefinition();
        this.init();

        this._makeProjectPathinfo(this.xadl, nexacro._typedefinition_url, project_path);
        this._makeDesignPathinfo(this.themeid, this.highcontrastthemeid, this.initvaluefileid);

        if (this.icon)
            nexacro._setApplicationIcon(this.icon);

        this.loadVariables();

        this._executeScript();
        this.initEvent();

        this.on_fire_onload();
        //this._loadLoadingImage();
    };

    _pEnvironment.setDesktopScreenWidth = function (v)
    {
        var app = nexacro.getApplication();
        if (app && app._isLoaded())
            return;

        nexacro._desktopscreenwidth = v;   //모바일 환경에서 선택된 screen이 desktop인 & userzoom = true
    };

    _pEnvironment.on_fire_onload = function ()
    {
        if (this.onload && this.onload._has_handlers)
        {
            var url = nexacro._transfullurl(nexacro._project_absolutepath, "environment.xml.js");
            var evt = new nexacro.LoadEventInfo(this, "onload", url);
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


    _pEnvironment.on_fire_onerror = function (obj, errortype, errormsg, errorobj, statuscode, requesturi, locationuri)
    {
        if (this.onerror && this.onerror._has_handlers)
        {
            var evt = new nexacro.ErrorEventInfo(obj, "onerror", errortype, errormsg, errorobj, statuscode, requesturi, locationuri);
            return this.onerror._fireEvent(this, evt);
        }
        return false;
    };

    _pEnvironment.on_init = _pEnvironment.on_initEvent = nexacro._emptyFn;
    _pEnvironment.addIncludeScript = function ()
    {
        nexacro._onSystemWarning(this, "native_notsupport_include");
        //trace("Environment does not support the include syntax.");
    };


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
            if (project_path || (nexacro._OS == "iOS" && nexacro._isHybrid && nexacro._isHybrid()))
            {
                var base_url = nexacro._getProjectBaseURL(xadl);
                nexacro._setProjectURL(project_path);
                //nexacro._project_url = project_path;

                if (!nexacro._isAbsolutePath(request_url))
                    request_url = nexacro._transfullurl(nexacro._project_absolutepath, request_url);

                if (nexacro._project_url != base_url)
                {
                    nexacro._localcache_path = base_url;
                    var cache_url = xadl;
                    if (cache_url.substring(cache_url.length - 3) == ".js")
                    {
                        cache_url = cache_url.substring(0, cache_url.length - 3);
                    }
                    if (nexacro._hasLocalCacheUrl(cache_url))
                    {
                        request_url = nexacro._transfullurl(nexacro._localcache_path, xadl);
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
        }

        nexacro._typedefinition_url = nexacro._transfullurl(nexacro._project_absolutepath, nexacro._typedefinition_url);
        this._request_mainurl = request_url;
    };

    _pEnvironment._makeDesignPathinfo = function (themeid, highcontrastthemeid, initvaluefileid)
    {
        //theme path
        var curthemeid = themeid;
        if (nexacro._checkHighContrast() && highcontrastthemeid)
        {
            curthemeid = highcontrastthemeid;
        }
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
            nexacro._curthemeid = curthemeid;
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
            nexacro._initvaluefileid = initvaluefileid;
        }
    };

    _pEnvironment.userNotify = function (notifyid, message)
    {
        nexacro._userNotify(notifyid, message);
    };

    nexacro._getLoadingImageUrl = function ()
    {
        if (nexacro._loadingimage)
        {
            return nexacro._loadingimage;
        }
        return nexacro._transfullurl(nexacro._resource_path, nexacro._default_loadingimage);
    };

    nexacro._getCookieVariables = function (type)
    {
        return nexacro._getLocalStorageAll(type);
    };

    nexacro._getEnvironmentVariables = function (name)
    {
        return nexacro._getLocalStorageAll(3);
    };

    nexacro._hasEnvironmentVariable = function (name)
    {
        return nexacro._hasLocalStorage(name, 3);
    };

    nexacro.getEnvironmentVariable = function (name)
    {
        return nexacro._getLocalStorage(name, 3);
    };

    nexacro.setEnvironmentVariable = function (name, value)
    {
        if (name)
        {
            nexacro._setLocalStorage(name, value, 3);
        }
    };

    nexacro.removeEnvironmentVariable = function (name)
    {
        nexacro._removeLocalStorage(name, 3);
    };

    nexacro.getHTTPHeaderVariable = function (name)
    {
        return nexacro._getLocalStorage(name, 5);
    };

    nexacro.setHTTPHeaderVariable = function (name, value)
    {
        if (name)
        {
            nexacro._setLocalStorage(name, value, 5);
        }
    };

    nexacro.removeHTTPHeaderVariable = function (name)
    {
        nexacro._removeLocalStorage(name, 5);
    };

    /*
       nexacro.getCookieVariable = function (name)
       {
           // localstorage 에서 값을 가져온다. 
           var ret = nexacro._getLocalStorage(name, 4);
           if (nexacro._isNull(ret))
               ret = nexacro._getLocalStorage(name, 6);
   
           return ret;    	
       };
    */

    nexacro.getCookieVariable = function (name, bsecure)
    {
        // bsecure : undefined/false/true (all/non-secure/secure)

        var ret;
        // localstorage 에서 값을 가져온다.         
        if (bsecure !== true)
            ret = nexacro._getLocalStorage(name, 4);

        if (!ret && bsecure !== false)
            ret = nexacro._getLocalStorage(name, 6);

        return ret;
    };


    nexacro.setCookieVariable = function (name, value, bsecure/*,expires*/)
    {
        if (name)
        {
            bsecure = nexacro._toBoolean(bsecure);
            var type = bsecure ? 6 : 4;
            var remove_type = bsecure ? 4 : 6;

            if (nexacro._getLocalStorage(name, remove_type))
                nexacro._removeCookieVariable(name, remove_type);

            //변수가 없으면 추가하고 설정

            nexacro._setLocalStorage(name, value, type);
            nexacro._setCookie(name, value, null, bsecure);
        }

        // 통신시 cookie로 적용될 변수.. 
        // 바로 cookie로 넣어야되나?? 아니면 localstorage에도 넣고 cookie로도 넣어야 되나?
    };

    // 변수로만 생성, cookie 값은 갱신하지 않는다.
    nexacro._setCookieVariable = function (name, value, bsecure/*,expires*/)
    {
        if (name)
        {
            bsecure = nexacro._toBoolean(bsecure);
            var type = bsecure ? 6 : 4;
            var remove_type = bsecure ? 4 : 6;

            if (nexacro._getLocalStorage(name, remove_type))
                nexacro._removeLocalStorage(name, remove_type);

            //변수가 없으면 추가하고 설정
            nexacro._setLocalStorage(name, value, type);
        }
    };

    nexacro._removeCookieVariable = function (name, type)
    {
        nexacro._removeCookie(name);
        nexacro._removeLocalStorage(name, type);

    };

    nexacro.removeCookieVariable = function (name, bsecure)
    {
        // bsecure : undefined/false/true (all/non-secure/secure)

        if (bsecure !== true)
            nexacro._removeLocalStorage(name, 4);

        if (bsecure !== false)
            nexacro._removeLocalStorage(name, 6);
    };

    nexacro.isExistCookieVariable = function (name, bsecure)
    {
        // bsecure : undefined/false/true (all/non-secure/secure)
        var ret;

        if (bsecure !== true)
            ret = nexacro._hasLocalStorage(name, 4);

        if (!ret)
        {
            if (bsecure !== false)
                ret = nexacro._hasLocalStorage(name, 6);
        }

        return ret;
    };

    nexacro.getEnvironment = function ()
    {
        return nexacro._environment;
    };

    nexacro.getApplication = function ()
    {
        return _global_context._application;
    };

    nexacro.deleteCacheDB = function ()
    {
        return nexacro._deleteCacheDB(); //only runtime;
    };

    nexacro.getProjectPath = function ()
    {
        return nexacro._project_absolutepath;
    };


    // xcss prefix 에 있는 것만 지원 
    // xcss::
    //sync 처리 
    nexacro.loadStyle = function (url)
    {
        var styleurl = url;
        if (!nexacro._cssurls)
            nexacro._cssurls = [];

        nexacro._cssurls.push(url);

        var cssurl, base_url;
        url = url.replace("::", "_");
        //경로 설정하는 api 필요
        cssurl = nexacro._getServiceLocation("theme://" + url, nexacro._project_absolutepath);

        if (nexacro._localcache_path)
        {
            base_url = cssurl.substring(nexacro._project_absolutepath.length, cssurl.length);
            cssurl = nexacro._localcache_path + base_url;
        }

        var cssmapurl = cssurl;
        var pos = cssurl.lastIndexOf('/');
        cssurl = cssurl.substring(0, pos + 1) + nexacro._getCSSFileName(cssurl.substring(pos + 1, cssurl.length - 5));

        var service = nexacro._getServiceObject(styleurl);
        pos = cssmapurl.lastIndexOf('.');
        cssmapurl = cssmapurl.substring(0, pos + 1) + "map.js";

        var app = nexacro.getApplication();
        if (app)
        {
            app._load_manager.reloadCssModule(cssmapurl, null, false, service);  //map
            app._load_manager.reloadCssModule(cssurl, false, false, service, true, 1); //css
            nexacro._refreshCssAll();
        }
    }


    nexacro._com_waiting = false;
    nexacro._skipDragEventAfterMsgBox = false;

    //application 환경
    nexacro._loadADL = function (project_path)
    {
        var application = _global_context._application = nexacro.Application;
        application.init();
        var env = nexacro.getEnvironment();
        env._load(project_path);  // 이때 xadl 값은 설정되어 있어야 한다. 

        application._load(env.key, env._request_mainurl);

        //application 의 locale 
    };

    //form 환경
    nexacro._loadFDL = function (/*formurl*/)
    {
        //var env = nexacro.getEnvironment();

        //form 의 locale 
        //theme
        //initvalue
    };

    nexacro._getMsg = function (errorcode)
    {
        if (nexacro._errortable)
        {
            var lang = "en";
            if (nexacro._errortable[system._language])
                lang = system._language;

            var errmsg = nexacro._errortable[lang][errorcode];

            if (!errmsg) return "";
            var arg = Array.prototype.slice.call(arguments, 1);
            var n = arg.length;

            for (var i = 0; i < n; i++)
            {
                var a = "%[" + i + "]";
                errmsg = errmsg.replace(a, arg[i]);
            }
            return errmsg;
        }
    };

    nexacro._getErrorMessge = function (errorcode)
    {
        if (nexacro._errortable)
        {
            var lang = "en";
            if (nexacro._errortable[system._language])
                lang = system._language;

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
                    var argnum = (str.charCodeAt(1) - 0x30) >>> 0;
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
        return nexacro._setLocalStorage(key, varValue, 1, common_flag);
    };

    nexacro.getPrivateProfile = function (key, common_flag)
    {
        return nexacro._getLocalStorage(key, 1, common_flag);
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

    nexacro.flashWindow = function (frame, type, count, interval)
    {
        if (frame && frame._window)
            return frame._window._flashWindow(frame, type, count, interval);
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

    //strName,strFormURL,objParentFrame,{objArgumentList},strOpenStyle,nLeft,nTop[,nRight,nBottom[,objOpener]]
    //str_id, _parent_frame, arr_arg, opener, _lockmode, callback, _is_async
    nexacro.open = function (id, formurl, parent_frame, arr_arg, openstyles, left, top, width, height, opener, ext_openstyles)
    {
        // Android, iOS Runtime 미지원
        if (nexacro._Browser == "Runtime" && (nexacro._OS == "iOS" || nexacro._OS == "Android"))
            return false;

        var parentframe = parent_frame;
        if (parentframe && parentframe[id])
        {
            throw nexacro.MakeNativeError(this, "native_exist_id", id);
        }

        //popupframe에 있는지 먼저 체크 
        if (nexacro._isPopupFrame(id))
        {
            throw nexacro.MakeNativeError(this, "native_exist_id", id);
        }

        if (parent_frame)
        {
            if (!parent_frame._is_frame)
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

        var ext_options = "";   // HTML5 전용 options
        if (!parent_window)
            showontaskbar = true;

        if (openstyles)
        {
            var openstyle = openstyles.split(" ");
            for (var i = 0; i < openstyle.length; i++)
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
            for (var i = 0; i < ext_opt.length; i++)
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
            var _focus_obj = null;
            if (parentframe && parentframe._focusManager)
                _focus_obj = parentframe._focusManager[0];
            if (_focus_obj)
            {
                if (_focus_obj.parent._is_form)
                    frameopener = _focus_obj.parent;
                else
                    frameopener = parentframe ? parentframe.form : null;
            }
            else
            {
                frameopener = parentframe ? parentframe.form : null;
            }
        }

        if (!this._popupframeoption)
            this._popupframeoption = {};

        if (width == undefined || width < 0)
            width = 0;
        if (height == undefined || height < 0)
            height = 0;

        this._popupframeoption[id] = {
            "_openstyles": openstyles,
            "_formurl": formurl,
            //"_parentwindow": parent_window,
            //"_opener": frameopener.id,
            //"_args": arr_arg,
            //"_parentframe": parentframe,
            "_left": left,
            "_top": top,
            "_width": width,
            "_height": height
        };

        if (nexacro._Browser == "Runtime" && (nexacro._SystemType.toLowerCase() == "win32" || nexacro._SystemType.toLowerCase() == "win64"))
        {
            if (parent_window)
                nexacro._registerPopupFrame(id, this, parent_window);
            else
                nexacro._registerPopupFrame(id, this);
        }
        else
        {
            nexacro._registerPopupFrame(id, this, parent_window);
        }

        var handle = nexacro._createOpenWindowHandle(parent_window, id, formurl, left, top, width, height, resizable, layered, showontaskbar, false, parentframe, frameopener, arr_arg, ext_options);
        if (handle)
            return true;
        return false;
    };
    //CHECK LKE Framework init 부분은 Docinit 이전에 수행되어야 함, 추후 별도의 파일로 분리해야 하지 않을까 판단됨

    nexacro._ServiceItem = function (prefixid, type, url, cachelevel, codepage, language, version, communicationversion)
    {
        this.prefixid = prefixid;
        this.type = type;
        this.url = url;

        if (nexacro._viewtoollog)
            this.cachelevel = "none";
        else
            this.cachelevel = cachelevel ? cachelevel : "session";

        this.codepage = codepage;
        this.language = language;
        this.version = version | "0.0";
        this.communicationversion = communicationversion;


    };
    var __pServiceItem = nexacro._createPrototype(nexacro.Object, nexacro._ServiceItem);
    nexacro._ServiceItem.prototype = __pServiceItem;

    __pServiceItem.set_cachelevel = function (v)
    {
        if (nexacro._viewtoollog)
            this.cachelevel = "none";
        else if (v == "none" || v == "static" || v == "session" || v == "dynamic")
            this.cachelevel = v;
    };

    __pServiceItem.set_version = function (v)
    {
        this.version = v;
    };

    __pServiceItem.set_url = function (v)
    {
        this.url = v;
        nexacro._setLocalStorageforService(this.prefixid, this.url, this.cachelevel);
    };

    __pServiceItem.set_codepage = function (v)
    {
        this.codepage = v;
    };

    __pServiceItem.set_language = function (v)
    {
        this.language = v;
    };

    __pServiceItem.set_communicationversion = function (v)
    {
        this.communicationversion = v;
    };

    nexacro._getRegisterClass = function (objid)
    {
        var registerclass = nexacro._registerclass;
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

    nexacro._addRegisterClass = function (registername, classname)
    {
        var registerclass = nexacro._registerclass;
        if (!registerclass)
            registerclass = nexacro._registerclass = [];
        registerclass.push({ id: registername, classname: classname });
    };

    nexacro._addService = function (prefixid, type, url, cachelevel, codepage, language, version, communication)
    {
        var service = new nexacro._ServiceItem(prefixid, type, url, cachelevel, codepage, language, version, communication);
        var env = nexacro.getEnvironment();
        if (env)
            env.services.add(prefixid, service);
    };

    nexacro._removeService = function (prefixid)
    {
        var env = nexacro.getEnvironment();
        if (env && env.services)
        {
            var service = env.services[prefixid];
            if (service)
            {
                env.services.delete_item(prefixid);
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
        nexacro._registerclass = registerclass;
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
        var registerclass = nexacro._registerclass;
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

    //Error 
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
        if (bfireevent)
        {
            var environment = nexacro.getEnvironment();
            if (environment)
            {
                environment.on_fire_onerror(environment, errortype, message, errorobj);
            }
        }

        // ignore trace log when without message
        if (message)
        {
            nexacro._writeTraceLog(msglevel, message, bsystemlog, nexacro._loglevel);
        }
    };

    if (!this.system)
        this.system = nexacro.System;

    /*
    if (!this._application)
    {
        this._application = nexacro.Application;
        _application.init();
    }*/

} // end of (!nexacro._bInitPlatform)

//trace("application:=========="+application);
if (_process)
{
    delete _process;

    delete __pTimerManager;
    delete __pEventTimer;
    delete __pDelayTask;
    delete __pCallbackTimer;
    delete __pOnceCallbackTimer;
    delete _pAnimationFrame;
    delete __pLoadItem;
    delete __pLoadManager;
    delete __pServiceItem;
    delete __pComponentItem;
    delete __pUpdateItem;
    delete __pTypeDefinition;
    delete _pLayout;
    delete __pLayoutManager;
    delete __pWindow;
    delete __pPopupWindow;
    delete __pTouchManager;
    delete __pFlingHandler;
    delete __pTouchTimer;
    delete __pCubicBezier;
    delete _pEnvironment;
    delete _pResizeManager;
}
