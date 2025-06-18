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
// nexacro system Utility API's
// ==============================================================================


const ismodule = this === undefined ? true : false;

var nexacro = ismodule ? {} : (globalThis.nexacro = globalThis.nexacro || {});
const nexaAppFactory = ismodule ? (function (global)
{
    const apploader = {};
    const getRelativeModuleDir = function (docUrl, moduleUrl)
    {
        const doc = new URL(docUrl);
        const mod = new URL(moduleUrl);
        const docDir = doc.pathname.substring(0, doc.pathname.lastIndexOf('/') + 1);
        const modDir = mod.pathname.substring(0, mod.pathname.lastIndexOf('/') + 1);
        if (modDir === docDir) return './';
        return './' + modDir.substring(docDir.length);
    }
    apploader.createApp = function (rawSrc, load_modules)
    {
        const scriptPath = rawSrc || "unknown";



        let baseuri = "";
        if (rawSrc) 
        {


            const baseURL = getRelativeModuleDir(document.baseURI, rawSrc);
            const basePath = baseURL.replace(/[^/]*$/, '');
            if (basePath !== "./" || basePath !== "")
                baseuri = basePath;
        }

        const EventQueue = (() => 
        {
            const queue = [];
            let isFlushing = false;

            const flushQueue = () => 
            {
                while (queue.length) 
                {
                    const { target, event } = queue.shift();
                    target.dispatchEvent(event);
                }
                isFlushing = false;
            };

            return (target, event) => 
            {
                queue.push({ target, event });
                if (!isFlushing) 
                {
                    isFlushing = true;
                    queueMicrotask(flushQueue);
                }
            };
        })();
        const DispatchEvent = (target, event) => EventQueue(target, event);
        class BiMap extends Map 
        {
            constructor(entries) 
            {
                super(entries);
                this.reverseMap = new Map();
                if (entries)
                    for (const [key, value] of entries) { this.reverseMap.set(value, key); }
            }

            set(key, value) 
            {
                if (this.has(key))
                    this.delete(key);

                if (this.reverseMap.has(value))
                    this.deleteByValue(value);
                super.set(key, value);
                this.reverseMap.set(value, key);
                return this;
            }

            delete(key) 
            {
                if (this.has(key)) 
                {
                    const value = super.get(key);
                    super.delete(key);
                    this.reverseMap.delete(value);
                    return true;
                }
                return false;
            }

            deleteByValue(value) 
            {
                if (this.reverseMap.has(value)) 
                {
                    const key = this.reverseMap.get(value);
                    this.reverseMap.delete(value);
                    super.delete(key);
                    return true;
                }
                return false;
            }

            getKey(value) 
            {
                return this.reverseMap.get(value);
            }

            hasValue(value) 
            {
                return this.reverseMap.has(value);
            }

            clear() 
            {
                super.clear();
                this.reverseMap.clear();
            }
        };
        class ObservedContaner
        {
            static fdl_attr = "fdl"
            static css_attr = "css"
            static resizeopt = "content-box" //| "border-box" |"device-pixel-content-box"

            static event(status, id, detail, message = "")
            {
                let eventName = ""
                let _bubbles = false;
                switch (status)
                {
                    case "load":
                        eventName = "oncomplate";
                        _bubbles = true;
                        break;
                    case "unload":
                        eventName = "onunmount";
                        break;
                    case "size":
                        eventName = "resize"; // 받을때 이름을 똑같이~
                        break
                    case "error":
                        eventName = "onerror";
                        break
                }
                return new CustomEvent(eventName, {
                    bubbles: _bubbles,
                    detail: { id, ...detail, message }
                });
            }

            ContainerItem = class
            {
                static #Status = {
                    NORMAL: "normal",
                    ERROR: "error",
                };
                static getStatus(type)
                {
                    return this.#Status[type];
                }

                static escapeHTML(str)
                {
                    const div = document.createElement('div');
                    div.appendChild(document.createTextNode(str));
                    return div.innerHTML;
                }

                static validateDataAttributes(element) 
                {
                    const dataAttributes = Object.keys(element.dataset);

                    for (const attr of dataAttributes) 
                    {
                        if (attr == ObservedContaner.fdl_attr || attr == ObservedContaner.css_attr)
                        {
                            const originalValue = element.dataset[attr];
                            const escapedValue = this.escapeHTML(originalValue);
                            if (originalValue !== escapedValue)
                                return false;
                        }
                    }

                    return true;
                }
                app = undefined; // nexacro.Application or nexacro.Form
                sysevt = undefined; // HTMLSysEvent
                constructor(parent, node, _form = undefined, _css = undefined)
                {
                    this.status = this.constructor.getStatus("NORMAL");
                    this.parent = parent;
                    const nexacro = parent.nexacro();
                    this.node = node;

                    try
                    {
                        if (!this.constructor.validateDataAttributes(node))
                            throw new Error(`The container [${node.id}]is not a div element.`);

                        this.sysevt = new nexacro.HTMLSysEvent(node);
                        this.sysevt._initDocEventHandler();

                        let launchFunc = undefined;
                        if (_form)
                        {
                            if (_css)
                                nexacro.loadStyle(_css)
                            launchFunc = nexacro._loadFDL.bind(nexacro)

                        }
                        else
                            launchFunc = nexacro._loadADL.bind(nexacro)

                        launchFunc("", _form ? _form : undefined).then((from) =>
                        {
                            DispatchEvent(node, ObservedContaner.event("load", node.id ? node.id : node.nodeName, { from }, ""))
                            this.app = from;
                        })

                        this.parent.resizeobserver().observe(node, { box: ObservedContaner.resizeopt });

                        node.addEventListener("onunmount", this.onunmount, { once: true });
                    }
                    catch (e)
                    {
                        /*  eslint-disable no-console */
                        console.error(e.message);
                        this.status = this.constructor.getStatus("ERROR");
                        DispatchEvent(node, ObservedContaner.event("error", node.id ? node.id : node.nodeName, {}, e?.message));
                        DispatchEvent(node, ObservedContaner.event("unload", node.id ? node.id : node.nodeName, {}, ""));
                    }
                }

                async close()
                {
                    // nexacro 종료 동작으로 처리 하기 위해 unload event를 dispatch 하는 것이 좋음
                    const nexacro = this.parent.nexacro();

                    this.parent.resizeobserver().unobserve(this.node);

                    DispatchEvent(this.node, ObservedContaner.event("unload", this.node.id ? this.node.id : this.node.nodeName, {}, ""));

                    await this.parent.onunMountContainer(this);

                    this.parent = null;
                    this.sysevt = null;
                    this.app = null;
                    this.status = null;
                    this.node = null;
                    return this;
                }

                onunmount = async (event) =>
                {
                    try 
                    {
                        this.close();
                    }
                    catch (error) 
                    {
                        console.error("Error during onunmount:", error);
                    }
                }
            };
            #map = undefined;
            #mutationObserver = undefined;
            #resizeObserver = undefined;
            #nexacro = undefined;
            #key = undefined;

            constructor(key, nexacro)
            {
                this.#map = new BiMap();
                this.#key = key;
                this.#nexacro = nexacro;
                this.initObservers();
                document.addEventListener("#onmount", this.onMountContainer);
            }
            getContainerInfo(container) 
            {
                const dummy = { status: "unknown", parent: undefined, sysevt: undefined, app: undefined, node: undefined };
                const info = this.#map.get(container);
                return info ? info : dummy;
            }
            getContainer(app)
            {
                for (const [key, value] of this.#map.entries()) 
                {
                    if (value.app === app)
                        return key;
                }
                return undefined
            }
            getRootApps()
            {
                const apps = [];
                for (const [key, value] of this.#map.entries()) 
                {
                    if (value.app)
                        apps.push(value.app)
                }
                return apps
            }
            initObservers(debounceTime = 100) 
            {
                const createDebouncedHandler = (callback, debounceTime) => 
                {
                    const timers = new WeakMap();
                    return (target, ...args) => 
                    {
                        if (timers.has(target)) clearTimeout(timers.get(target));
                        const timer = setTimeout(() => 
                        {
                            callback(target, ...args);
                            timers.delete(target);
                        }, debounceTime);
                        timers.set(target, timer);
                    };
                };

                // MutationObserver 처리용
                const handleMutation = createDebouncedHandler((nodes, type) => 
                {
                    nodes.forEach(node => 
                    {
                        if (node.classList.contains(this.#key)) 
                        {
                            const eventType = type === "added" ? "load" : "unload";
                            if (eventType == "unload")
                                DispatchEvent(node, ObservedContaner.event(eventType, node.id || node.nodeName, {}, ""));
                            else
                                this.#nexacro.__MFEAPI._loadAppContainer(node);
                        }
                    });
                }, debounceTime);

                // ResizeObserver 처리용
                const updateSizeAndPosition = (entry) =>
                {
                    const rect = entry.target.getBoundingClientRect();
                    const contentWidth = entry.contentBoxSize[0].inlineSize;
                    const contentHeight = entry.contentBoxSize[0].blockSize;

                    const style = getComputedStyle(entry.target);
                    const paddingLeft = parseFloat(style.paddingLeft);
                    const paddingTop = parseFloat(style.paddingTop);

                    //return { x: paddingLeft, y: paddingTop, width: contentWidth, height: contentHeight };

                    return {
                        left: rect.x + paddingLeft,
                        top: rect.y + paddingTop,
                        x: rect.x + paddingLeft,
                        y: rect.y + paddingTop,
                        width: rect.width,
                        height: rect.height,
                        paddingLeft: paddingLeft,
                        paddingTop: paddingTop,
                        contentsWidth: contentWidth,
                        contentsHeight: contentHeight
                    };

                }

                const handleResize = createDebouncedHandler((entry) => 
                {
                    // transform scale 이 적용되면 getBoundingClientRect이 적용되어야 한다.
                    DispatchEvent(entry.target, ObservedContaner.event("size", entry.target.id, { rect: updateSizeAndPosition(entry)/*{ left: entry.contentRect.x, top: entry.contentRect.y, width: entry.contentRect.width, height: entry.contentRect.height }*/ }, "div custom event size."));
                }, debounceTime);

                const getRelevantNodes = (node) => 
                {

                    if (node.nodeType === Node.ELEMENT_NODE && (node.classList.contains('Form') || node.classList.contains('Mainframe')))
                        return node.parentNode ? [node.parentNode] : [];
                    const hasNexacroAppChild = node.querySelector ? node.querySelector(`.${this.#key}`) : undefined;
                    if (hasNexacroAppChild) return [hasNexacroAppChild];
                    if (node.nodeType === Node.ELEMENT_NODE && (node.classList.contains(this.#key)))
                        return [node];
                    return [];
                };

                const getAppendNodes = (node) => 
                {
                    if (node.querySelector)
                    {
                        const hasNexacroAppChild = node.querySelector(`.${this.#key}`);
                        if (hasNexacroAppChild) return [hasNexacroAppChild];
                        if (node.nodeType === Node.ELEMENT_NODE && (node.classList.contains(this.#key)))
                            return [node];
                    }
                    return [];
                };

                this.#mutationObserver = new MutationObserver((mutations) => 
                {
                    const removedNodes = new Set();
                    const addedNodes = new Set();

                    mutations.forEach((mutation) => 
                    {
                        if (mutation.type === 'childList') 
                        {
                            Array.from(mutation.removedNodes).flatMap(getRelevantNodes).forEach(node => removedNodes.add(node));
                            Array.from(mutation.addedNodes).flatMap(getAppendNodes).forEach(node => addedNodes.add(node));
                        }
                    });

                    queueMicrotask(() => 
                    {
                        handleMutation([...removedNodes], "removed");
                        handleMutation([...addedNodes], "added");
                    });
                });

                this.#mutationObserver.observe(document.body, { childList: true, subtree: true });

                this.#resizeObserver = new ResizeObserver((entries) => 
                {
                    entries.forEach((entry) => { handleResize(entry); });
                });
            }

            nexacro() { return this.#nexacro; }
            onunMountContainer = async (item) => { this.#map.deleteByValue(item); }
            resizeobserver() { return this.#resizeObserver; }

            onMountContainer = async (event) =>
            {
                queueMicrotask(() =>
                {
                    const { container, key } = event.detail;
                    if (!container || !key)
                        throw new Error("Initialization cannot proceed due to an error.");
                    if (this.#key !== key) return;
                    if (this.#map.get(container)) return;
                    const fdl = container.dataset[ObservedContaner.fdl_attr] ? container.dataset[ObservedContaner.fdl_attr] : undefined
                    const css = container.dataset[ObservedContaner.css_attr] ? container.dataset[ObservedContaner.css_attr] : undefined
                    this.#map.set(container, new this.ContainerItem(this, container, fdl, css))
                });

            }

            async cleanup()
            {
                const promises = [];
                this.#mutationObserver.disconnect();
                this.#resizeObserver.disconnect();
                this.#map.forEach((value, key) => { promises.push(value.onunmount()); });
                await Promise.all(promises);
                this.#map = null;
                this.#mutationObserver = null;
                this.#resizeObserver = null;
                this.#nexacro = null;
                this.#key = null;

            }

        };
        class nexacroApp
        {
            static event(status, id, detail, message = "")
            {
                let eventName = "";
                switch (status)
                {
                    case "init":
                        eventName = "onnexacroinit";
                        break;
                }
                return new CustomEvent(eventName, {
                    bubbles: true,
                    detail: { id, ...detail, message }
                });

            }
            // index.mjs 방식에서는 미사용
            static async loadModules(modulePaths) 
            {

                // component 에도 import로 로드 디펜던시를 보장하지 않으면 파일 순서에 따라 영향을 준다.
                // proto type 정의 코드에서 문제 발생
                /*
                return Promise.all(modulePaths.map(path =>
                    import(path).then(module => ({ path, module }))));
                */
                const results = [];
                for (const path of modulePaths) 
                {
                    try 
                    {
                        const module = await import(path);
                        if (module && module?.nexacro && baseuri !== "")
                        {
                            module.nexacro.__APPLOADER_BASE_PATH__ = baseuri;
                        }
                        results.push({ path, module });
                    }
                    catch (error) 
                    {
                        /*eslint-disable no-console*/
                        console.error(`Failed to load module at path: ${path}, error: ${error.message}`);
                        throw error; // 모든 파일이 다 로딩되어야 하므로, 실패 시 에러를 다시 던짐
                    }
                }
                return results;

            }

            static registry(bclear)
            {
                const NEXACRO_REGISTRY_SYMBOL = global.NEXACRO_REGISTRY_SYMBOL;
                if (!bclear)
                    return global[NEXACRO_REGISTRY_SYMBOL].loader_path;
                else
                {
                    global[NEXACRO_REGISTRY_SYMBOL].loader_path = null;
                    delete global[NEXACRO_REGISTRY_SYMBOL];
                    NEXACRO_REGISTRY_SYMBOL = null
                }
            }
            static initregistry()
            {
                if (!global.NEXACRO_REGISTRY_SYMBOL) 
                {
                    global.NEXACRO_REGISTRY_SYMBOL = Symbol('nexacro-registry');
                    global[global.NEXACRO_REGISTRY_SYMBOL] = { loader_path: new BiMap(), class_registry: {} };
                }
                if (nexacroApp.registry().has(scriptPath))
                {
                    console.warn(`The loader script at "${scriptPath}" is already loaded!`);
                    return false;
                }

                return true;

            }
            static cleanloader(app)
            {
                nexacroApp.registry().deleteByValue(app);

                if (nexacroApp.registry().size == 0)
                    nexacroApp.registry(true);

            }
            static async loadframework(nexacro)
            {
                const loaded = nexacroApp.initregistry();
                if (!loaded) return;

                if (nexacro)
                {
                    const retmodule = {};
                    nexacro.__APPLOADER_BASE_PATH__ = baseuri;
                    retmodule.nexacro = nexacro;
                    retmodule.key = retmodule.nexacro._environment.csscollisionpreventkey;
                    retmodule.env = retmodule.nexacro._environment;
                    nexacroApp.registry().set(scriptPath, new nexacroApp(retmodule));

                }
                else
                    console.error('Failed to load modules: framework error.');
            }
            /*static async loadframework(modulePaths)
            {
                let loaded = nexacroApp.initregistry();
                if (!loaded) return;

                const processModules = (modules) => 
                {
                    for (const { module } of modules) 
                    {
                        const exports = module.default || module;
                        if (exports)
                            return { ...exports, env: undefined, key: undefined };
                    }
                    console.error('Failed to process modules: no valid exports found.');
                    return null;
                };
                nexacroApp.loadModules(modulePaths).then((modules) =>
                {
                    let retmodule = processModules(modules);

                    if (retmodule) 
                    {
                        retmodule.key = retmodule.nexacro._environment.csscollisionpreventkey;
                        retmodule.env = retmodule.nexacro._environment;
                        nexacroApp.registry().set(scriptPath, new nexacroApp(retmodule));
                    }
                    else
                        console.error('Failed to load modules: framework error.');
                })
            }
            */

            #manager = undefined
            #exports = undefined

            constructor(exports)
            {
                this.#exports = exports
                const { nexacro, key } = this.#exports
                this.#manager = new ObservedContaner(key, nexacro);

                if (!nexacro.__MFEAPI)
                    nexacro.__MFEAPI = {};


                nexacro.__MFEAPI._loadAppContainer = async function (container)
                {
                    const key = this._environment.csscollisionpreventkey
                    if (
                        container.parentNode &&
                        container.nodeType === Node.ELEMENT_NODE &&
                        container.classList.contains(`${key}`)
                    )
                    {
                        document.dispatchEvent(new CustomEvent("#onmount", { detail: { container, key } }));
                        //console.log('Valid node for loading app container:', container);
                    }
                    else
                        console.log('Node does not meet the requirements.');

                }.bind(nexacro);

                nexacro.__MFEAPI._getSysEvent = function (container)
                {

                    const { sysevt = undefined } = this.#manager.getContainerInfo(container);
                    return sysevt;

                }.bind(this);

                nexacro.__MFEAPI._getRootApp = function (container)
                {
                    const { app = null } = this.#manager.getContainerInfo(container);
                    return app;

                }.bind(this);

                nexacro.__MFEAPI._getRootApps = function ()
                {
                    return this.#manager.getRootApps();
                }.bind(this);

                nexacro.__MFEAPI._getLinkedWindow = function (container)
                {
                    const { app = undefined } = this.#manager.getContainerInfo(container);
                    if (!app) return undefined;
                    if (app._is_application)
                    {
                        if (app.mainframe && app.mainframe._window)
                            return app.mainframe._window;
                    }

                    else if (app instanceof nexacro.Form)
                    {
                        if (app._window)
                            return app._window;
                    }

                    return undefined;

                }.bind(this);

                nexacro.__MFEAPI._getContainerInfo = function (container)
                {
                    const { status = "unknown", parent = undefined, sysevt = undefined, app = undefined, node = undefined } = this.#manager.getContainerInfo(container)
                    return { status, parent, sysevt, app, node };

                }.bind(this);

                nexacro.__MFEAPI._getContainer = function (app)
                {
                    return this.#manager.getContainer(app)
                }.bind(this);

                const state = document.readyState
                if (state == "loading" || state == "interactive") document.addEventListener('DOMContentLoaded', this.onstartApp, { once: true });
                else this.onstartApp()

                global.addEventListener('pagehide', this.oncloseApp);
            }

            onstartApp = (event) =>
            {
                const { nexacro, key } = this.#exports



                DispatchEvent(document, nexacroApp.event("init", document.id, { nexacro }, ""));
                queueMicrotask(() =>
                {
                    nexacro._prepareManagerFrame(window, document, function ()
                    {
                        document.body.querySelectorAll(`.${key}`).forEach(node => 
                        {
                            nexacro.__MFEAPI._loadAppContainer(node);
                        });
                    }, undefined);
                });
            }
            oncloseApp = async (event) =>
            {

                const bclose = event ? !event.persisted : true;
                if (bclose) 
                {
                    global.removeEventListener("pagehide", this.oncloseApp);
                    await this.#manager.cleanup()
                    this.#exports = null;
                    this.#manager = null;
                    nexacroApp.cleanloader(this);
                }
            }

        };
        return nexacroApp.loadframework(load_modules);
    };
    return apploader.createApp;


})(window) : undefined; // apploader object
nexacro.ismodule = ismodule;

nexacro.getNexacro_init = function ()
{
    // wre와 nre 임시로 분기 
    // window.nexacro_init 이 아니고 nexacro.nexacro_init이 되어야 함
    return nexacro?.nexacro_init ?? globalThis.nexacro_init;
}

if (!nexacro.System)
    nexacro.System = {};

var system = nexacro.ismodule ? nexacro.System : (globalThis.system = nexacro.System);
var trace = function ()
{
};
if (!nexacro._Init_systembase)
{
    "use strict";
    /* eslint-disable no-proto */
    if (nexacro.__proto__)
    {
        nexacro._createPrototype = function (super_fn, constructor_fn)
        {
            var ptype = new Object();
            if ((typeof super_fn) == "function")
            {
                ptype.__proto__ = super_fn.prototype;
                if (constructor_fn)
                {
                    ptype.constructor = constructor_fn;
                }
            }
            return ptype;
        };
    }
    else
    {
        nexacro._createPrototype = function (super_fn, constructor_fn)
        {
            if ((typeof super_fn) == "function")
            {
                var F = function F() { };
                F.prototype = super_fn.prototype;
                var ptype = new F();
                if (constructor_fn)
                {
                    ptype.constructor = constructor_fn;
                }
                return ptype;
            }
            return new Object();
        };
    }

    var _process = true;
    nexacro._Init_systembase = true;

    nexacro._defineProperties = function (obj, properties)
    {
        var name, benum, bconfig, propname, _setter_fn;
        var item;
        if (properties)
        {
            for (var i = 0, len = properties.length; i < len; i++)
            {
                item = properties[i];
                name = item.name;

                propname = "_p_" + name;
                _setter_fn = obj["set_" + name];

                if (!_setter_fn || item.readonly)
                    _setter_fn = nexacro._emptyFn;

                benum = item.benum == undefined ? true : item.benum;
                bconfig = item.bconfig == undefined ? false : item.bconfig;

                var _getter_fn = (item.getter && typeof (item.getter) == "function") ? item.getter : (new Function("return this." + propname));

                Object.defineProperty(obj, name, { get: _getter_fn, set: _setter_fn, enumerable: benum, configurable: bconfig });
            }
        }
    };

    //==============================================================================
    // Browser Type detection
    //==============================================================================
    nexacro._Browser = "";
    nexacro._BrowserVersion = -1;
    nexacro._BrowserType = "";

    if (nexacro.__getOSType)
    {
        // Runtime
        nexacro._Browser = "Runtime";
        nexacro._BrowserVersion = 24;
        nexacro._BrowserType = "Runtime";
    }
    else
    {
        if (navigator.userAgent.match(/Edg/))
        {
            nexacro._Browser = "Edge";
            nexacro._BrowserType = "WebKit";
            var ret = /Edg\/([\.\d]+)/.test(navigator.userAgent);
            nexacro._BrowserVersion = parseInt(RegExp.$1) | 0;
            ret = null;
        }
        else if (navigator.userAgent.match(/Chrome/))
        {
            nexacro._Browser = "Chrome";
            nexacro._BrowserType = "WebKit";
            var ret = /Chrome\/([\.\d]+)/.test(navigator.userAgent);
            nexacro._BrowserVersion = parseInt(RegExp.$1) | 0;
            ret = null;

            if (navigator.userAgent.match(/Samsung/))
                nexacro._BrowserExtra = "SamsungBrowser";
            else if (navigator.userAgent.match(/NAVER/))
                nexacro._BrowserExtra = "NaverBrowser";
            if (navigator.userAgent.match(/XiaoMi/))
                nexacro._BrowserExtra = "MiuiBrowser";
        }
        else if (navigator.userAgent.match(/CriOS/))
        {//iOS Chrome
            nexacro._Browser = "Chrome";
            nexacro._BrowserType = "WebKit";
            var ret = /CriOS\/([\.\d]+)/.test(navigator.userAgent);
            nexacro._BrowserVersion = parseInt(RegExp.$1) | 0;
            ret = null;

            if (navigator.userAgent.match(/Samsung/))
                nexacro._BrowserExtra = "SamsungBrowser";
        }
        else if (!!window.opera || navigator.userAgent.match(/Opera/) || navigator.userAgent.match(/OPR/))
        {
            nexacro._Browser = "Opera";
            nexacro._BrowserType = "Opera";
            var ret = /Version\/([\.\d]+)/.test(navigator.userAgent);
            nexacro._BrowserVersion = parseInt(RegExp.$1) | 0;
            ret = null;
        }
        else if (navigator.userAgent.match(/Apple.*Mobile/) || (navigator.platform == "MacIntel" && navigator.maxTouchPoints > 0))
        {
            nexacro._Browser = "MobileSafari";
            nexacro._BrowserType = "WebKit";
            nexacro._BrowserVersion = parseFloat(('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent)
                /*|| [0, ''])[1]).replace('undefined', '3_2').replace('_', '.').replace('_', ''))
                || parseFloat(('' + (/Intel.*OS X ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent)*/
                || [0, ''])[1]).replace('undefined', '3_2').replace('_', '.').replace('_', '')) || -1;
        }
        else if (navigator.userAgent.match(/AppleWebKit\//))
        {   //사파리 버젼을 추가하였는데, 다른버젼과 충돌 테스트 미확인
            //nexacro._Browser_RoundBorder 등 아래 내용은 Webkit내용 그대로 가져옴
            nexacro._Browser = "Safari";
            nexacro._BrowserType = "WebKit";
            var ret = /Version\/([\.\d]+)/.test(navigator.userAgent);
            nexacro._BrowserVersion = parseInt(RegExp.$1) | 0;
            ret = null;
        }
        else if (navigator.userAgent.match(/WebKit\//))
        {
            nexacro._Browser = "WebKit";
            nexacro._BrowserType = "WebKit";
            var ret = /WebKit\/([\.\d]+)/.test(navigator.userAgent);
            nexacro._BrowserVersion = parseInt(RegExp.$1) | 0;
            ret = null;
        }
        else if (navigator.userAgent.match(/Gecko\//))
        {
            nexacro._Browser = "Gecko";
            nexacro._BrowserType = "Gecko";
            var ret = /rv\:(.+?)[\);]/.test(navigator.userAgent);
            nexacro._BrowserVersion = parseInt(RegExp.$1) | 0;
            ret = null;
        }
    }
    //==============================================================================
    // nexacro framework version
    nexacro.Version = "24";
    nexacro._framework_libpath = "./nexacrolib";

    nexacro._dontenum_descriptor = { "writable": true, "enumerable": false };
    nexacro._dontwritableenum_descriptor = { "writable": false, "enumerable": false };

    // Z-Index Values
    nexacro._zindex_popup = 1e6 + 1;
    nexacro._zindex_firstmodal = 1e6 + 2;  // Overlay Layer가 하나씩 덮일때마다 1씩 증가
    nexacro._zindex_waitcursor = 2e6;  // 최상위 Layer에 있어야 함.
    nexacro._zindex_hide = -2e6;

    // MLM Screen에 의해 결정된 ZoomFactor
    //nexacro._zoom_factor = 0; // 0: no zoom  -> pEnvironment._zoom_factor 로 변경
    //nexacro._curscreenzoomfactortype = "portrait";
    nexacro._allow_default_pinchzoom = false;   // 브라우저 기본 Pinch Zoom을 허용할 지 여부

    nexacro._project_absolutepath = "";
    nexacro._comm_contextlist = [];
    //etc
    nexacro._use_firefirstcount = false;
    nexacro._use_progress_data = true;
    nexacro._interval_onprogress_timer = 10;  // ms
    nexacro._touch_velocity_adjust_ratio = 3;
    nexacro._use_translate_scroll = 1;      //초기값으로 사용 

    nexacro._stringresourceurl = "/stringresource.xstring.js";
    nexacro._stringrc_service = "stringrc::/";

    // WRE only
    nexacro._init_info = {};
    nexacro._init_block_node = null;

    //ExcelExport, ExcelImport

    nexacro.ExportTypes =
    {
        EXCEL: 0x0100,
        EXCEL97: 0x0110,
        EXCEL2007: 0x0120,
        HANCELL2010: 0x0400,
        HANCELL2014: 0x0410,
        CSV: 0x0500,
        TXT: 0x0510
    };

    nexacro.ImportTypes =
    {
        EXCEL: 0x0100,
        EXCEL97: 0x0110,
        EXCEL2007: 0x0120,
        HANCELL: 0x0420,
        HANCELL2014: 0x0410,
        CSV: 0x0500,
        TXT: 0x0510
    };

    nexacro.ExportItemTypes =
    {
        GRID: 0x0100
    };

    nexacro.DragDataFormats =
    {
        FILEDROP: "filedrop",
        TEXT: "text",
        UNICODETEXT: "unicodetext",
        CSV: "csv"
    };

    //==============================================================================
    // device permission
    //==============================================================================
    nexacro.DevicePermissionStatus =
    {
        DENIED: 0,
        GRANTED: 1
    };

    nexacro.DevicePermissionType =
    {
        CALENDAR: "calendar",   // Android: CALENDAR(READ_CALENDAR,WRITE_CALENDAR), iOS: Calendars
        CAMERA: "camera",     // Android: CAMERA(CAMERA), iOS : Camera
        CONTACTS: "contacts",   // Android: CONTACTS(READ_CONTACTS,WRITE_CONTACTS,GET_ACCOUNTS), iOS: Contacts
        LOCATION: "location",   // Android: LOCATION(ACCESS_FINE_LOCATION,ACCESS_COARSE_LOCATION), iOS: Location,Location Always,Location When In Use
        MICROPHONE: "microphone", // Android: MICROPHONE(RECORD_AUDIO), iOS: Microphone
        // Android
        PHONE: "phone",      // Android: PHONE(READ_PHONE_STATE,CALL_PHONE,READ_CALL_LOG,WRITE_CALL_LOG,ADD_VOICEMAIL,USE_SIP,PROCESS_OUTGOING_CALLS)
        SMS: "sms",        // Android: SMS(SEND_SMS,RECEIVE_SMS,READ_SMS,RECEIVE_WAP_PUSH,RECEIVE_MMS)
        STORAGE: "storage",    // Android: STORAGE(READ_EXTERNAL_STORAGE,WRITE_EXTERNAL_STORAGE)
        // iOS
        PHOTO: "photo",      // iOS: Photo Library
        REMINDERS: "reminders"   // iOS: Reminders

        // TODO: Android {SENSORS(BODY_SENSORS)}
        // TODO: iOS {CallKit, Motion, Bluetooth Peripheral, Media Library, Health Share, Health Update, HomeKit, Face ID, NFC Reader, Photo Library Additions, Siri, Speech recognition servers}
    };

    //XPush
    nexacro.XPushAction =
    {
        AUTH: 0,
        BYEC: 1,
        ADDF: 2,
        DELF: 3,
        REQD: 4,
        RECT: 5,
        RGST: 6,
        UNRG: 7,
        ADUI: 8,
        UNUI: 9,
        MSGC: 10
    };

    nexacro._datatyperule = "1.0";

    nexacro._trigger_type_table =
    {
        "Click": "onclick",
        "Row Change": "onrowposchanged",
        "Value Change": "oncolumnchanged",
        "External Input": "onextendedcommand",
        "Action Success": "onsuccess",
        "Action Fail": "onerror",
        "Model Load Success": "onmodelloadsuccess",
        "Model Load Fail": "onmodelloadfail",
        "Form Init": "onload",
        "Item Change": "onitemchanged",
        "Enter Key Press": "onkeypress",
        "Cell Click": "oncellclick",
        "Cell Double Click": "oncelldblclick"

    };

    // for input/textarea locale별 정보 mapping    
    nexacro._cache_edit_set = [];
    nexacro._cache_textarea_set = [];
    nexacro._cache_inputelement_set = [];
    nexacro._cache_simpleinputelement_set = [];
    nexacro._cache_simpletextareaelement_set = [];
    nexacro._cache_textareaelement_set = [];
    nexacro._cache_textfield_set = [];
    nexacro._cache_multilinetextfield_set = [];
    nexacro._locale_unicode = {};

    nexacro._edit_user_override_func = ["on_deactivate_process",
        "on_keydown_basic_before_process", "on_keydown_basic_specialkey_process", "on_keydown_basic_process",
        "on_keydown_default_before_process", "on_keydown_default_specialkey_process", "on_keydown_default_process",
        "on_keypress_basic_before_process", "on_keypress_basic_specialkey_process", "on_keypress_basic_process",
        "on_keyinput_basic_before_process", "on_keyinput_basic_process",
        "on_beforeinput_process_with_HTMLEvent", "on_beforeinput_process_with_NexacroInputEvent",
        "on_killfocus_basic_process"];

    nexacro._inputelement_user_override_func =
        ["on_apply_ime_environment_process", "on_apply_force_imeSet", "setCompositionComplete_process",
            "setCompositionCancel_process",
            "on_sys_keydown_before_process", "on_sys_keydown_specialkey_process", "on_sys_keydown_process",
            "on_sys_keyup_before_process", "on_sys_keyup_specialkey_process", "on_sys_keyup_process",
            "on_sys_keypress_before_process", "on_sys_keypress_specialkey_process", "on_sys_keypress_process",
            "on_sys_beforeinput_forward_process",
            "on_sys_keyinput_before_process", "on_sys_keyinput_process", "on_sys_compositionstart_process", "on_sys_compositionupdate_process",
            "on_sys_compositionend_process",
            "on_sys_touchstart_process", "on_sys_touchend_process",
            "on_sys_paste_before_process",
            "on_complete_composition_value_process"];



    nexacro._defineImeLocaleEdit = function (locale, obj)
    {
        if (obj.Edit)
            nexacro._cache_edit_set[locale] = obj.Edit;
        if (obj.TextArea)
            nexacro._cache_textarea_set[locale] = obj.TextArea;
        if (obj.InputElement)
            nexacro._cache_inputelement_set[locale] = obj.InputElement;
        if (obj.TextAreaElement)
            nexacro._cache_textareaelement_set[locale] = obj.TextAreaElement;
        if (obj.TextField)
            nexacro._cache_textfield_set[locale] = obj.TextField;
        if (obj.MultiLineTextField)
            nexacro._cache_multilinetextfield_set[locale] = obj.MultiLineTextField;
        if (obj.SimpleInputElement)
            nexacro._cache_simpleinputelement_set[locale] = obj.SimpleInputElement;
        if (obj.SimpleTextAreaElement)
            nexacro._cache_simpletextareaelement_set[locale] = obj.SimpleTextAreaElement;
    };

    nexacro._addImeLocaleInfo = function (locale, range)
    {
        //nexacro._locale_unicode.push({ locale: locale, range: range });
        nexacro._locale_unicode[locale] = range;
    };

    nexacro.sort_locale_unicode = function ()
    {
        for (var i = 0, n = nexacro._locale_unicode.length; i < n; i++)
        {
            nexacro._locale_unicode[i]["range"].begin.sort();
            nexacro._locale_unicode[i]["range"].end.sort();
        }

    };

    nexacro._settracemsg = function (e)
    {
        return;
        /*
       if (nexacro._Browser == "IE" && nexacro._BrowserVersion > 8)
       {
           if (e && e.message && trace)
           {
               trace(e.message);
           }
       }
       */
    };

    //---------------------------------
    nexacro.FuncBinder = function (pthis, fn)
    {
        this.pthis = pthis;
        this.fn = fn;
    };
    var _pFuncBinder = nexacro._createPrototype(Object, nexacro.FuncBinder);
    nexacro.FuncBinder.prototype = _pFuncBinder;

    _pFuncBinder.call = function ()
    {
        var fn = this.fn;
        if (fn) return fn.apply(this.pthis, arguments);
    };

    //---------------------------------
    nexacro.SetterBinder = function (pthis, prop, fn)
    {
        this.pthis = pthis;
        this.prop = prop;
        this.fn = fn;
    };
    var _pSetterBinder = nexacro._createPrototype(Object, nexacro.SetterBinder);
    nexacro.SetterBinder.prototype = _pSetterBinder;

    _pSetterBinder.set = function (val)
    {
        this.fn.call(this.pthis, val);
        return val;
    };
    _pSetterBinder.addset = function (val)
    {
        var pthis = this.pthis;
        var retval = pthis[this.prop] + val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pSetterBinder.subset = function (val)
    {
        var pthis = this.pthis;
        var retval = pthis[this.prop] - val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pSetterBinder.mulset = function (val)
    {
        var pthis = this.pthis;
        var retval = pthis[this.prop] * val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pSetterBinder.divset = function (val)
    {
        var pthis = this.pthis;
        var retval = pthis[this.prop] / val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pSetterBinder.modset = function (val)
    {
        var pthis = this.pthis;
        var retval = pthis[this.prop] % val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pSetterBinder.andset = function (val)
    {
        var pthis = this.pthis;
        var retval = pthis[this.prop] & val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pSetterBinder.orset = function (val)
    {
        var pthis = this.pthis;
        var retval = pthis[this.prop] | val;
        this.fn.call(pthis, retval);
        return retval;
    };

    _pSetterBinder.xorset = function (val)
    {
        var pthis = this.pthis;
        var retval = pthis[this.prop] ^ val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pSetterBinder.lshset = function (val)
    {
        var pthis = this.pthis;
        var retval = pthis[this.prop] << val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pSetterBinder.rshset = function (val)
    {
        var pthis = this.pthis;
        var retval = pthis[this.prop] >> val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pSetterBinder.zrshset = function (val)
    {
        var pthis = this.pthis;
        var retval = pthis[this.prop] >>> val;
        this.fn.call(pthis, retval);
        return retval;
    };

    _pSetterBinder.preInc = function ()
    {
        var val = this.pthis[this.prop];
        this.fn.call(this.pthis, ++val);
        return val;
    };
    _pSetterBinder.preDec = function ()
    {
        var val = this.pthis[this.prop];
        this.fn.call(this.pthis, --val);
        return val;
    };
    _pSetterBinder.postInc = function ()
    {
        var val = this.pthis[this.prop];
        this.fn.call(this.pthis, +val + 1);
        return val;
    };
    _pSetterBinder.postDec = function ()
    {
        var val = this.pthis[this.prop];
        this.fn.call(this.pthis, +val - 1);
        return val;
    };

    //---------------------------------
    nexacro.IntSetterBinder = function (pthis, prop, fn)
    {
        this.pthis = pthis;
        this.prop = prop;
        this.fn = fn;
    };
    var _pIntSetterBinder = nexacro._createPrototype(Object, nexacro.IntSetterBinder);
    nexacro.IntSetterBinder.prototype = _pIntSetterBinder;

    _pIntSetterBinder.set = function (val)
    {
        this.fn.call(this.pthis, val);
        return val;
    };
    _pIntSetterBinder.addset = function (val)
    {
        var pthis = this.pthis;
        var retval = (parseInt(pthis[this.prop]) | 0) + (val | 0);
        this.fn.call(pthis, retval);
        return retval;
    };
    _pIntSetterBinder.subset = function (val)
    {
        var pthis = this.pthis;
        var retval = (parseInt(pthis[this.prop]) | 0) - val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pIntSetterBinder.mulset = function (val)
    {
        var pthis = this.pthis;
        var retval = (parseInt(pthis[this.prop]) | 0) * val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pIntSetterBinder.divset = function (val)
    {
        var pthis = this.pthis;
        var retval = (parseInt(pthis[this.prop]) | 0) / val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pIntSetterBinder.modset = function (val)
    {
        var pthis = this.pthis;
        var retval = (parseInt(pthis[this.prop]) | 0) % val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pIntSetterBinder.andset = function (val)
    {
        var pthis = this.pthis;
        var retval = (parseInt(pthis[this.prop]) | 0) & val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pIntSetterBinder.orset = function (val)
    {
        var pthis = this.pthis;
        var retval = (parseInt(pthis[this.prop]) | 0) | val;
        this.fn.call(pthis, retval);
        return retval;
    };

    _pIntSetterBinder.xorset = function (val)
    {
        var pthis = this.pthis;
        var retval = (parseInt(pthis[this.prop]) | 0) ^ val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pIntSetterBinder.lshset = function (val)
    {
        var pthis = this.pthis;
        var retval = (parseInt(pthis[this.prop]) | 0) << val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pIntSetterBinder.rshset = function (val)
    {
        var pthis = this.pthis;
        var retval = (parseInt(pthis[this.prop]) | 0) >> val;
        this.fn.call(pthis, retval);
        return retval;
    };
    _pIntSetterBinder.zrshset = function (val)
    {
        var pthis = this.pthis;
        var retval = (parseInt(pthis[this.prop]) | 0) >>> val;
        this.fn.call(pthis, retval);
        return retval;
    };

    _pIntSetterBinder.preInc = function ()
    {
        var val = parseInt(this.pthis[this.prop]) | 0;
        this.fn.call(this.pthis, ++val);
        return val;
    };
    _pIntSetterBinder.preDec = function ()
    {
        var val = this.pthis[this.prop];
        this.fn.call(this.pthis, --val);
        return val;
    };
    _pIntSetterBinder.postInc = function ()
    {
        var val = parseInt(this.pthis[this.prop]) | 0;
        this.fn.call(this.pthis, val + 1);
        return val;
    };
    _pIntSetterBinder.postDec = function ()
    {
        var val = parseInt(this.pthis[this.prop]) | 0;
        this.fn.call(this.pthis, val - 1);
        return val;
    };

    //---------------------------------
    nexacro.PropBinder = function (pthis, prop)
    {
        this.pthis = pthis;
        this.prop = prop;
    };
    var _pPropBinder = nexacro._createPrototype(Object, nexacro.PropBinder);
    nexacro.PropBinder.prototype = _pPropBinder;

    _pPropBinder.set = function (val)
    {
        return (this.pthis[this.prop] = val);
    };
    _pPropBinder.addset = function (val)
    {
        return (this.pthis[this.prop] += val);
    };
    _pPropBinder.subset = function (val)
    {
        return (this.pthis[this.prop] -= val);
    };
    _pPropBinder.mulset = function (val)
    {
        return (this.pthis[this.prop] *= val);
    };
    _pPropBinder.divset = function (val)
    {
        return (this.pthis[this.prop] /= val);
    };
    _pPropBinder.modset = function (val)
    {
        return (this.pthis[this.prop] %= val);
    };
    _pPropBinder.andset = function (val)
    {
        return (this.pthis[this.prop] &= val);
    };
    _pPropBinder.orset = function (val)
    {
        return (this.pthis[this.prop] |= val);
    };
    _pPropBinder.xorset = function (val)
    {
        return (this.pthis[this.prop] ^= val);
    };
    _pPropBinder.lshset = function (val)
    {
        return (this.pthis[this.prop] <<= val);
    };
    _pPropBinder.rshset = function (val)
    {
        return (this.pthis[this.prop] >>= val);
    };
    _pPropBinder.zrshset = function (val)
    {
        return (this.pthis[this.prop] >>>= val);
    };

    _pPropBinder.preInc = function ()
    {
        return ++this.pthis[this.prop];
    };
    _pPropBinder.preDec = function ()
    {
        return --this.pthis[this.prop];
    };
    _pPropBinder.postInc = function ()
    {
        return this.pthis[this.prop]++;
    };
    _pPropBinder.postDec = function ()
    {
        return this.pthis[this.prop]--;
    };

    //---------------------------------
    nexacro.NumPropBinder = function (pthis, prop)
    {
        this.pthis = pthis;
        this.prop = prop;
    };
    var _pNumPropBinder = nexacro._createPrototype(Object, nexacro.NumPropBinder);
    nexacro.NumPropBinder.prototype = _pNumPropBinder;

    _pNumPropBinder.set = function (val)
    {
        return (this.pthis[this.prop] = val);
    };
    _pNumPropBinder.addset = function (val)
    {
        return (this.pthis[this.prop] = parseFloat(this.pthis[this.prop]) + (val | 0));
    };
    _pNumPropBinder.subset = function (val)
    {
        return (this.pthis[this.prop] = parseFloat(this.pthis[this.prop]) - val);
    };
    _pNumPropBinder.mulset = function (val)
    {
        return (this.pthis[this.prop] = parseFloat(this.pthis[this.prop]) * val);
    };
    _pNumPropBinder.divset = function (val)
    {
        return (this.pthis[this.prop] = parseFloat(this.pthis[this.prop]) / val);
    };
    _pNumPropBinder.modset = function (val)
    {
        return (this.pthis[this.prop] = parseFloat(this.pthis[this.prop]) % val);
    };
    _pNumPropBinder.andset = function (val)
    {
        return (this.pthis[this.prop] = parseFloat(this.pthis[this.prop]) & val);
    };
    _pNumPropBinder.orset = function (val)
    {
        return (this.pthis[this.prop] = parseFloat(this.pthis[this.prop]) | val);
    };
    _pNumPropBinder.xorset = function (val)
    {
        return (this.pthis[this.prop] = parseFloat(this.pthis[this.prop]) ^ val);
    };
    _pNumPropBinder.lshset = function (val)
    {
        return (this.pthis[this.prop] = parseFloat(this.pthis[this.prop]) << val);
    };
    _pNumPropBinder.rshset = function (val)
    {
        return (this.pthis[this.prop] = parseFloat(this.pthis[this.prop]) >> val);
    };
    _pNumPropBinder.zrshset = function (val)
    {
        return (this.pthis[this.prop] = parseFloat(this.pthis[this.prop]) >>> val);
    };

    _pNumPropBinder.preInc = function ()
    {
        var val = this.pthis[this.prop];
        this.pthis[this.prop] = ++val;
        return val;
    };
    _pNumPropBinder.preDec = function ()
    {
        var val = this.pthis[this.prop];
        this.pthis[this.prop] = --val;
        return val;
    };
    _pNumPropBinder.postInc = function ()
    {
        var val = this.pthis[this.prop];
        this.pthis[this.prop] = val + 1;
        return val;
    };
    _pNumPropBinder.postDec = function ()
    {
        var val = this.pthis[this.prop];
        this.pthis[this.prop] = val - 1;
        return val;
    };


    //---------------------------------
    // Basic Object's Getter/Setter
    Object.prototype.getSetter = function (name/*, fnname*/)
    {
        return new nexacro.PropBinder(this, name);
    };

    if (Object.defineProperty)
    {
        try
        {
            Object.defineProperty(Object.prototype, "getSetter", { "value": Object.prototype.getSetter, "writable": true, "enumerable": false });
        }
        catch (e)
        {
            nexacro._settracemsg(e);
        }
    }
    Object.prototype.getNumSetter = function (name/*, fnname*/)
    {
        return new nexacro.NumPropBinder(this, name);
    };

    if (Object.defineProperty)
    {
        try
        {
            Object.defineProperty(Object.prototype, "getNumSetter", { "value": Object.prototype.getNumSetter, "writable": true, "enumerable": false });
        }
        catch (e)
        {
            nexacro._settracemsg(e);
        }
    }

    nexacro._indexOf = function (arr, item)
    {
        if (arr == null) return -1;
        var len = arr.length;
        for (var i = 0; i < len; i++)
        {
            if (arr[i] == item)
            {
                return i;
            }
        }
        return -1;
    };

    nexacro._lastIndexOf = function (arr, item)
    {
        if (arr == null) return -1;
        var len = arr.length;
        for (var i = len; i > 0; i--)
        {
            if (arr[i - 1] == item)
            {
                return (i - 1);
            }
        }
        return -1;
    };

    //if (!String.prototype.replaceAll)
    //{
    //    // "//n"을 사용시 정규식으로 처리안되어 임시 조치 (다른문자는 정상동작)
    //    if (nexacro._Browser == "Runtime" || nexacro._Browser == "Chrome")
    //    {
    //        // for Chrome, V8 : use split().join()
    //        String.prototype.replaceAll = function (orgStr, repStr)
    //        {
    //            var src = this;
    //            return src.split(orgStr).join(repStr);
    //        };
    //    }
    //    else
    //    {
    //        // for other Browser : use RegExp
    //        String.prototype.replaceAll = function (orgStr, repStr)
    //        {
    //            var src = this;
    //            return src.replace(new RegExp(orgStr, "g"), repStr);
    //        };
    //    }
    //}
    // replaceAll
    // replaceAll는 javascript에서 제공하는 함수가 아니기 때문에 nexacro.replaceAll 형식으로 제공
    // 정규식 사용 버전은 특정문자("//n") 사용시 문제로 추가 안함
    nexacro.replaceAll = function (str, orgStr, repStr)
    {
        return str.split(orgStr).join(repStr);
    };

    if (nexacro._Browser == "Runtime" || nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
    {
        nexacro._replaceAll = function (str, orgStr, repStr)
        {
            return str.split(orgStr).join(repStr);
        };
    }
    else
    {
        nexacro._replaceAll = function (str, orgStr, repStr)
        {
            return str.replace(new RegExp(orgStr, "g"), repStr);
        };
    }

    // String's Extend function
    String.prototype.padLeft = function (n, pad)
    {
        var t = [];
        if (n > this.length)
        {
            for (var i = 0, cnt = n - this.length; i < cnt; i++)
            {
                t.push(pad);
            }
        }
        t.push(this);
        return t.join('');
    };

    String.prototype.padRight = function (n, pad)
    {
        var t = [];
        t.push(this);
        if (n > this.length)
        {
            for (var i = 0, cnt = n - this.length; i < cnt; i++)
            {
                t.push(pad);
            }
        }
        return t.join('');
    };

    nexacro.getMatchedCount = function (str, fstr)
    {
        var cnt = 0;
        var len = str.length;
        if (len.length <= 0 || fstr.length <= 0)
            return cnt;

        var ret = str.match(RegExp('[' + fstr + ']', 'g'));
        if (ret)
            cnt = ret.length;

        return cnt;
    };

    nexacro.isNumeric = function (v)
    {
        if (v == null || v === "") return false;
        if (typeof (v) == "number")
        {
            if (v >= 48 && v <= 57) // 0:48, 9:57
                return true;
            return false;
        }
        if (typeof (v) == "string")
        {
            var len = v.length;
            for (var i = 0; i < len; i++)
            {
                var c = v.charCodeAt(i);
                if (c >= 48 && c <= 57) // 0:48, 9:57
                    continue;
                return false;
            }
            return true;
        }
        return false;
    };

    nexacro.isAlpha = function (v)
    {
        // /[^a-zA-Z_]/
        if (v == null || v === "") return false;
        if (typeof (v) == "number")
        {
            if ((v >= 65 && v <= 90) || (v >= 97 && v <= 122)) // A:65,Z:90, a:97,z:122
                return true;
            return false;
        }
        if (typeof (v) == "string" || typeof v.valueOf() == "string")
        {
            var len = v.length;
            for (var i = 0; i < len; i++)
            {
                var c = v.charCodeAt(i);
                if ((c >= 65 && c <= 90) || (c >= 97 && c <= 122))
                    continue;
                return false;
            }
            return true;
        }
        return false;
    };

    nexacro.isAlphaNumeric = function (v)
    {
        // /[^0-9a-zA-Z_]/
        if (v == null || v === "") return false;
        if (typeof (v) == "number")
        {
            if ((v >= 48 && v <= 57) || (v >= 65 && v <= 90) || (v >= 97 && v <= 122) || (v == 95)) // 0:48, 9:57, A:65,Z:90, a:97,z:122, _:95
                return true;
            return false;
        }
        if (typeof (v) == "string" || typeof v.valueOf() == "string")
        {
            var len = v.length;
            for (var i = 0; i < len; i++)
            {
                var c = v.charCodeAt(i);
                if ((c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || (c == 95)) // 0:48, 9:57, A:65,Z:90, a:97,z:122, _:95
                    continue;
                return false;
            }
            return true;
        }
        return false;
    };

    nexacro.isSpace = function (v)
    {
        // /[^\s]/
        if (v == null) return false;
        if (typeof (v) == "number")
        {
            if (v == 32 || (v >= 9 && v <= 13) ||
                v == 160 || v == 5760 || v == 6158 || (v >= 8192 && v <= 8202) ||
                v == 8232 || v == 8233 || v == 8239 || v == 8287 || v == 12288)
                return true;
        }

        if (typeof (v) == "string" || typeof v.valueOf() == "string")
        {
            var len = v.length;
            if (len > 0)
            {
                for (var i = 0; i < len; i++)
                {
                    var c = v.charCodeAt(i);
                    if (c == 32 || (c >= 9 && c <= 13) ||
                        c == 160 || c == 5760 || c == 6158 || (c >= 8192 && c <= 8202) ||
                        c == 8232 || c == 8233 || c == 8239 || c == 8287 || c == 12288)
                        continue;
                    return false;
                }
                return true;
            }
        }
        return false;
    };

    nexacro.isLower = function (v)
    {
        // /[^a-z]/
        if (v == null) return false;
        if (typeof (v) == "number")
        {
            if (v >= 97 && v <= 122) // A:65,Z:90, a:97,z:122
                return true;
        }

        if (typeof (v) == "string" || typeof v.valueOf() == "string")
        {
            var len = v.length;
            if (len > 0)
            {
                for (var i = 0; i < len; i++)
                {
                    var c = v.charCodeAt(i);
                    if (c >= 97 && c <= 122) // A:65,Z:90, a:97,z:122
                        continue;
                    return false;
                }
                return true;
            }
        }
        return false;
    };

    nexacro.isUpper = function (v)
    {
        // /[^A-Z]/
        if (v == null) return false;
        if (typeof (v) == "number")
        {
            if (v >= 65 && v <= 90) // A:65,Z:90, a:97,z:122
                return true;
        }
        if (typeof (v) == "string" || typeof v.valueOf() == "string")
        {
            var len = v.length;
            if (len > 0)
            {
                for (var i = 0; i < len; i++)
                {
                    var c = v.charCodeAt(i);
                    if (c >= 65 && c <= 90) // A:65,Z:90, a:97,z:122
                        continue;
                    return false;
                }
                return true;
            }
        }
        return false;
    };

    if (nexacro._Browser == "Runtime" || nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
    {
        // for replaceAll : use split().join()
        nexacro.wrapQuote = function (str)
        {
            if (arguments.length === 0)
                return "";
            if (str == null)
                return "\"" + str + "\"";

            str = str + "";
            str = str.split(/\\/g).join("\\\\");
            str = str.split(/"/g).join("\\\"");

            return "\"" + str + "\"";
        };

        nexacro.stripQuote = function (v)
        {
            if (typeof (v) != "string")
                return v + "";

            if (v.length >= 2 &&
                ((v.substr(0, 1) == "'" && v.substr(v.length - 1, 1) == "'") ||
                    (v.substr(0, 1) == '"' && v.substr(v.length - 1, 1) == '"')))
            {
                v = v.substring(1, v.length - 1);
            }

            if (v.indexOf("\\") >= 0)
            {
                v = v.split(/\\\"/g).join("\"");
                v = v.split(/\\\\/g).join("\\");
                return v;
            }

            return v;
        };
    }
    else
    {
        // for replaceAll : use RegExp
        // for use object cache : use closure
        (function ()
        {
            var re_quot = /"/g, re_esc = /\\/g;
            var un_quot = /\\\"/g, un_esc = /\\\\/g;

            nexacro.wrapQuote = function (str)
            {
                if (arguments.length === 0)
                    return "";
                if (str == null)
                    return "\"" + str + "\"";

                str = str + "";
                str = str.replace(re_esc, "\\\\").replace(re_quot, "\\\"");

                return "\"" + str + "\"";
            };

            nexacro.stripQuote = function (v)
            {
                if (typeof (v) != "string")
                    return v + "";

                if (v.length >= 2 &&
                    ((v.substr(0, 1) == "'" && v.substr(v.length - 1, 1) == "'") ||
                        (v.substr(0, 1) == '"' && v.substr(v.length - 1, 1) == '"')))
                {
                    v = v.substring(1, v.length - 1);
                }

                if (v.indexOf("\\") >= 0)
                {
                    v = v.replace(un_quot, "\"").replace(un_esc, "\\");
                    return v;
                }

                return v;
            };
        })();
    }

    nexacro.trimLeft = function (str, v)
    {
        var len = str.length, s = -1;
        if (v)
        {
            while (++s < len && str.charAt(s) == v);
            return str.substring(s, len);
        }
        else
        {
            var c;
            while (++s < len &&
                ((c = str.charCodeAt(s)) == 32 || (c >= 9 && c <= 13) ||
                    c == 160 || c == 5760 || c == 6158 || (c >= 8192 && c <= 8202) ||
                    c == 8232 || c == 8233 || c == 8239 || c == 8287 || c == 12288))
                ;
            return str.substring(s);
        }
    };

    nexacro.trimRight = function (str, v)
    {
        var len = str.length;
        var e = len;

        if (v)
        {
            while (e-- >= 0 && str.charAt(e) == v);
            return str.substring(0, e + 1);
        }
        else
        {
            var c;
            while (--e >= 0 &&
                ((c = str.charCodeAt(e)) == 32 || (c >= 9 && c <= 13) ||
                    c == 160 || c == 5760 || c == 6158 || (c >= 8192 && c <= 8202) ||
                    c == 8232 || c == 8233 || c == 8239 || c == 8287 || c == 12288))
                ;
            return str.substring(0, e + 1);
        }
    };

    nexacro.trim = function (str, v)
    {
        var len = str.length, s, e;
        if (v)
        {
            s = 0;
            e = len - 1;
            while (s < len && str.charAt(s) == v && ++s)
                ;
            while (e > s && str.charAt(e) == v && --e)
                ;
            return str.substring(s, e + 1);
        }
        else
        {
            s = -1;
            e = len;
            var c;
            while (++s < len &&
                ((c = str.charCodeAt(s)) == 32 || (c >= 9 && c <= 13) ||
                    c == 160 || c == 5760 || c == 6158 || (c >= 8192 && c <= 8202) ||
                    c == 8232 || c == 8233 || c == 8239 || c == 8287 || c == 12288))
                ;
            while (--e > s &&
                ((c = str.charCodeAt(e)) == 32 || (c >= 9 && c <= 13) ||
                    c == 160 || c == 5760 || c == 6158 || (c >= 8192 && c <= 8202) ||
                    c == 8232 || c == 8233 || c == 8239 || c == 8287 || c == 12288))
                ;
            return str.substring(s, e + 1);
        }
    };

    nexacro.toNumber = function (v, NaNval, pinfval, ninfval)
    {
        var n = (+v);

        if (n != n)
        {
            return (NaNval !== undefined) ? NaNval : n;
        }
        else if (n == Infinity)
        {
            return (pinfval !== undefined) ? pinfval : n;
        }
        else if (n == -Infinity)
        {
            return (ninfval !== undefined) ? ninfval : n;
        }
        return n;
    };

    nexacro.fromCharCode = function ()
    {
        var ar = [];
        var len = arguments.length;
        var arlen;
        var str = "";
        var i, j;
        for (i = 0; i < len; i++)
        {
            ar = arguments[i].toString().split(",");
            arlen = ar.length;
            if (nexacro._isArray(ar))
            {
                for (j = 0; j < arlen; j++)
                {
                    str += String.fromCharCode(ar[j].trim());
                }
            }
            else
            {
                str += String.fromCharCode(ar);
            }
        }
        return str;
    };

    nexacro._getSSVUnitSeparator = function ()
    {
        var environment = nexacro.getEnvironment();
        var str = nexacro.fromCharCode(environment.ssvunitseparator ? environment.ssvunitseparator : 0x1f);
        str = str.substr(0, 5);
        return str;
    };

    nexacro._getSSVRecordSeparator = function ()
    {
        var environment = nexacro.getEnvironment();
        var str = nexacro.fromCharCode(environment.ssvrecordseparator ? environment.ssvrecordseparator : 0x1e);
        str = str.substring(0, 5);
        return str;
    };

    if (!Date.prototype.addMonth)
    {
        Date.prototype.addMonth = function (v)
        {
            return this.setMonth(this.getMonth() + v);
        };

        Date.prototype.addDate = function (v)
        {
            return this.setDate(this.getDate() + v);
        };

        Date.prototype.addHours = function (v)
        {
            return this.setHours(this.getHours() + v);
        };

        Date.prototype.addMilliseconds = function (v)
        {
            return this.setMilliseconds(this.getMilliseconds() + v);
        };

        Date.prototype.addMinutes = function (v)
        {
            return this.setMinutes(this.getMinutes() + v);
        };

        Date.prototype.addSeconds = function (v)
        {
            return this.setSeconds(this.getSeconds() + v);
        };

        Date.prototype.addYear = function (v)
        {
            return this.setFullYear(this.getFullYear() + v);
        };

        Date.prototype.getYear = function ()
        {
            var y = this.getFullYear();
            if (1900 <= y && y <= 1999)
                return (y - 1900);
            return y;
        };
    }

    nexacro._pow_factors = [1e-30, 1e-29, 1e-28, 1e-27, 1e-26, 1e-25, 1e-24, 1e-23, 1e-22, 1e-21,
        1e-20, 1e-19, 1e-18, 1e-17, 1e-16, 1e-15, 1e-14, 1e-13, 1e-12, 1e-11,
        1e-10, 1e-9, 1e-8, 1e-7, 1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1,
        1, 1e+1, 1e+2, 1e+3, 1e+4, 1e+5, 1e+6, 1e+7, 1e+8, 1e+9,
        1e+10, 1e+11, 1e+12, 1e+13, 1e+14, 1e+15, 1e+16, 1e+17, 1e+18, 1e+19,
        1e+20, 1e+21, 1e+22, 1e+23, 1e+24, 1e+25, 1e+26, 1e+27, 1e+28, 1e+29, 1e+30];
    //Math
    if (!nexacro.floor)
    {
        nexacro.floor = function (v, digit)
        {
            if (digit == undefined)
                return Math.floor(v);
            //var p = Math.pow(10, digit);
            var p = nexacro._pow_factors[digit + 30];
            return Math.floor(v * p) / p;
        };

        // [RP: 99761] nexacro.floor 소수점 계산 오류 문제로 인해 무한루프 발생 -> 내부에서 사용하는 floor 생성 (소수점 보정 추가) 
        nexacro._floor = function (v, digit)
        {
            if (digit == undefined)
                return Math.floor(v);
            var m, p = nexacro._pow_factors[digit + 30];

            if (digit && digit > 0)
                m = (v * p).toFixed(digit + 1);
            else
                m = (v * p);

            return Math.floor(m) / p;
        };
    }

    if (!nexacro.ceil)
    {
        nexacro.ceil = function (v, digit)
        {
            if (digit == undefined)
                return Math.ceil(v);
            var p = nexacro._pow_factors[digit + 30];
            return Math.ceil(v * p) / p;
        };
    }

    if (!nexacro.round)
    {
        nexacro.round = function (v, digit)
        {
            if (digit == undefined)
                return Math.round(v);
            var m, p = nexacro._pow_factors[digit + 30];

            if (digit && digit > 0)
                m = (v * p).toFixed(digit + 1);
            else
                m = (v * p);

            return Math.round(m) / p;
        };
    }

    //==============================================================================
    //Date.parse
    if (!nexacro.parseDate)
    {
        // Script Engine 분기 : replaceAll -- RegExp vs split().join()
        // replaceAll -- Chrome: V8 : use split().join()
        if (nexacro._Browser == "Runtime" || nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
        {
            nexacro.parseDate = function (date)
            {
                var ret;
                if (date && date.length > 0)
                {
                    if (date.length > 10)
                    {
                        ret = nexacro._parseDatetime(date);
                    }
                    else
                    {
                        // "/" 사용 시 ISO 8601 형식을 위배하므로 코드 삭제 (2021/01/19)
                        // date = date.split("-").join("/");
                        ret = Date.parse(date);
                    }

                    if (!ret)
                        ret = undefined;

                }

                return ret;
            };
        }
        else
        {
            // replaceAll -- use RegExp
            // for RegExp cache : use closure
            (function ()
            {
                // var re_minus = /-/g;
                var ret;
                nexacro.parseDate = function (date)
                {
                    if (date && date.length > 0)
                    {
                        if (date.length > 10)
                        {
                            ret = nexacro._parseDatetime(date);
                        }
                        else
                        {
                            // use RegExp
                            // "/" 사용 시 ISO 8601 형식을 위배하므로 코드 삭제 (2021/01/19)
                            // date = date.replace(re_minus, "/");
                            ret = Date.parse(date);
                        }

                        if (!ret)
                            ret = undefined;
                    }

                    return ret;
                };
            })();
        }

        nexacro._parseDatetime = function (datetime)
        {
            if (datetime.length > 0)
            {
                var parsedStr = "";
                // ISO8601 full format : W와 T 포맷은 동시 사용 불가
                if (datetime.length > 10)
                {
                    if (datetime[10] === "T" && datetime[5] !== "W" && datetime[datetime.length - 1] == "Z") // ("2008-10-11T12:32:33.95Z")
                    {
                        datetime = datetime.replace("T", " "); // ("2008-10-11 12:32:33.95Z")
                    }
                    else if (datetime[10] === "t")
                    {
                        datetime = datetime.replace("t", "T"); // 't' 미지원 브라우저(IE, FF) 원인으로 ISO8601로 변환
                    }
                }
                parsedStr = datetime.split(" ");
                if (parsedStr.length != 2)
                    return Date.parse(datetime);
                var date = parsedStr[0];
                var time = parsedStr[1];

                // Z 포맷 아닌 경우 기준 시간 local로 일치화 (Z포맷은 UTC)
                if (time[time.length - 1] != "Z")
                {
                    date += "T00:00:00";
                }
                var newdatetime = nexacro.parseDate(date);
                newdatetime += nexacro._parseTime(time);
                return newdatetime;
            }
            else
                return undefined;
        };
        nexacro._parseTime = function (time)
        { //12:32:33.95
            if (time.length > 0)
            {
                var parsedStr = "";
                parsedStr = time.split(":");
                var hour = parseInt(parsedStr[0]) | 0;
                var min = parseInt(parsedStr[1]) | 0;
                var sec = parsedStr[2];
                parsedStr = sec.split(".");
                sec = parseInt(parsedStr[0]) | 0;
                var strMillsec = "";
                if (parsedStr[1] != undefined)
                    strMillsec = parsedStr[1];
                var len = strMillsec.length;
                for (var i = len; i < 3; i++)
                {
                    strMillsec += "0";
                }
                var millsec = parseInt(strMillsec) | 0;
                var newtime = (hour * 3600 * 1000) + (min * 60 * 1000) + (sec * 1000) + millsec;
                return newtime;
            }
            else
                return undefined;
        };
    }

    //==============================================================================
    // Basic Function Bind to this
    // _nexacroBind
    // @param {object} o
    nexacro._nexacroBind = function (_this, fn)
    {
        var retfn = function ()
        {
            return fn.apply(_this, arguments);
        };
        retfn._bindthis = _this;
        return retfn;
    };

    // module 분기는 generate 개발 완료 시 삭제 되어야 함
    nexacro.__export_args_str = /*(nexacro.ismodule) ?*/ "nexacro, system, trace" //: "";
    nexacro.__export_args_list = nexacro.__export_args_str.split(',').map(s => s.trim());
    nexacro.__export_args = Object.values({ nexacro, system, trace }) //: [];

    nexacro.__getSafeScope = function (_nexa, _scope_context)
    {
        return (function () 
        {
            return new Proxy(_nexa, {
                get(target, prop, receiver) 
                {
                    if (prop === 'getApplication' || prop === 'getMainObject')
                    {
                        return () => 
                        {
                            if (prop === 'getApplication')
                                return nexacro.__getMainObject(_scope_context, true);
                            else
                                return nexacro.__getMainObject(_scope_context);
                        };
                    }
                    else if (prop === 'getActiveForm' || prop === 'getActiveFrame')
                    {
                        return () =>
                        {
                            if (prop === 'getActiveForm')
                                return nexacro.__getActiveObject(_scope_context, true);
                            else
                                return nexacro.__getActiveObject(_scope_context);
                        };
                    }
                    return Reflect.get(target, prop, receiver);
                }
            });
        })();
    };

    nexacro.__getProcessExportArgs = function (context)
    {
        const proxiedNexacro = nexacro.__getSafeScope(nexacro, context);
        return Object.values({ nexacro: proxiedNexacro, system, trace });
    };
    nexacro.__appendParamsToModuleFunction = function (code, newParams = nexacro.__export_args_list)
    {
        /*generator에 return function에 nexacro,system,trace 를 추가하지 않을 경우 프로그래밍 방식 처리용*/
        /*
            return (new Function("return " + evalstr))();
            ==>>
            nexacro.__appendParamsToModuleFunction(evalstr)
            return (new Function("return " + code))();
 
        */
        return code.replace(
            /return\s+function\s*\(([^)]*)\)/,
            (match, args) =>
            {
                const argsTrimmed = args.trim();
                const combined = argsTrimmed
                    ? argsTrimmed + ', ' + newParams.join(', ')
                    : newParams.join(', ');
                return `return function (${combined})`;
            }
        );
    };

    // Eval Function
    if (nexacro._Browser == "Runtime")
    {
        nexacro._executeEvalStr = function (evalstr, url)
        {
            try
            {
                if (url)
                {
                    evalstr += ("\r\n//# sourceURL=" + encodeURI(url));
                }
                return (new Function("return " + evalstr))();
            }
            catch (e)
            {
                // KISA 보안취약점(6-2) 지적사항 
                // 3월 19일 6-2의 지적사항으로 주석되었으나 디버그 용도가 아닌것과 4-2 지적사항의 만족을 위해 원복                
                if (trace)
                {
                    trace(nexacro._getEvalExceptionMessage(e, url));
                }
                return e;
            }
            finally
            {
                evalstr = null;
            }
        };

        nexacro._executeGlobalEvalStr = function (evalstr, url)
        {
            try
            {
                /*
                if (url)
                {
                    evalstr += ("\r\n//# sourceURL=" + encodeURI(url));
                }
                */
                if (typeof (evalstr) == "string")
                {
                    if (evalstr.indexOf("if") == 0)
                    {
                        new Function(evalstr)();
                        return;
                    }
                    else if (evalstr.indexOf("//") == 0)
                    {
                        var regExp = new RegExp("//.*\r\n");
                        evalstr = evalstr.replace(regExp, "").trim();
                    }
                    else if (evalstr.indexOf("/*") == 0)
                    {
                        var regExp = new RegExp("\/\*[^>](.*?)\*\/");
                        var endIndex = evalstr.indexOf("*/");
                        var substring = evalstr.slice(0, endIndex + 2);
                        evalstr = evalstr.replace(substring, "").trim();
                    }
                }

                if (url)
                {
                    const reg_pre = /^\(function\(\)\s*\{\s*return\s*(?=function)/;
                    const reg_post = /\}\s*\)\s*\(\s*\)\s*\;\s*$/;

                    const pre = evalstr.match(reg_pre);
                    if (pre)
                    {
                        const post = evalstr.match(reg_post);
                        if (post)
                        {
                            evalstr = evalstr.substring(pre[0].length, post.index);
                        }
                    }

                    evalstr += ("\r\n//# sourceURL=" + encodeURI(url));
                }
                return (new Function("return " + evalstr))();
            }
            catch (e)
            {
                // KISA 보안취약점(6-2) 지적사항
                // 3월 19일 6-2의 지적사항으로 주석되었으나 디버그 용도가 아닌것과 4-2 지적사항의 만족을 위해 원복
                if (trace)
                {
                    trace(nexacro._getEvalExceptionMessage(e, url));
                }
                return e;
            }
            finally
            {
                evalstr = null;
            }
        };

        nexacro._executeScript = function (script, url)
        {
            try
            {
                return nexacro.__executeScript(url, script);
            }
            catch (e)
            {
                // KISA 보안취약점(6-2) 지적사항
                // 3월 19일 6-2의 지적사항으로 주석되었으나 디버그 용도가 아닌것과 4-2 지적사항의 만족을 위해 원복
                if (trace)
                {
                    trace(nexacro._getEvalExceptionMessage(e, url));
                }
                return e;
            }
            finally
            {
                script = null;
            }
        };
    }
    else if (nexacro._Browser == "Gecko")
    {
        nexacro._executeEvalStr = function (evalstr, url)
        {
            var err = null;
            try
            {
                if (url)
                {
                    evalstr += ("\r\n//# sourceURL=" + encodeURI(url));
                }

                err = new Error('at eval script(' + url + ')'); // for calc line
                if (url)
                    return (new Function("return " + evalstr))();
                else
                    return (new Function(nexacro.__export_args_str, "return " + evalstr))(...nexacro.__export_args);
            }
            catch (e)
            {
                // KISA 보안취약점(6-2) 지적사항
                // 3월 19일 6-2의 지적사항으로 주석되었으나 디버그 용도가 아닌것과 4-2 지적사항의 만족을 위해 원복
                if (trace)
                {
                    trace(nexacro._getEvalExceptionMessage(e, url, err.lineNumber));
                }
                return e;
            }
            finally
            {
                evalstr = null;
            }
        };

        nexacro._executeGlobalEvalStr = function (evalstr, url)
        {
            var err = null;
            try
            {
                /*
                if (url)
                {
                    evalstr += ("\r\n//# sourceURL=" + encodeURI(url));
                }
                */
                err = new Error('at eval script(' + url + ')'); // for calc line
                if (typeof (evalstr) == "string")
                {
                    if (evalstr.indexOf("if") == 0)
                    {
                        new Function(evalstr)();
                        return;
                    }
                    else if (evalstr.indexOf("//") == 0)
                    {
                        var regExp = new RegExp("//.*\r\n");
                        evalstr = evalstr.replace(regExp, "").trim();
                    }
                    else if (evalstr.indexOf("/*") == 0)
                    {
                        var regExp = new RegExp("\/\*[^>](.*?)\*\/");
                        var endIndex = evalstr.indexOf("*/");
                        var substring = evalstr.slice(0, endIndex + 2);
                        evalstr = evalstr.replace(substring, "").trim();
                    }
                }

                if (url)
                {
                    const reg_pre = /^\(function\(\)\s*\{\s*return\s*(?=function)/;
                    const reg_post = /\}\s*\)\s*\(\s*\)\s*\;\s*$/;

                    const pre = evalstr.match(reg_pre);
                    if (pre)
                    {
                        const post = evalstr.match(reg_post);
                        if (post)
                        {
                            evalstr = evalstr.substring(pre[0].length, post.index);
                        }
                    }

                    evalstr += ("\r\n//# sourceURL=" + encodeURI(url));
                }
                if (url)
                    return (new Function("return " + evalstr))();
                else
                    return (new Function(nexacro.__export_args_str, "return " + evalstr))(...nexacro.__export_args);
            }
            catch (e)
            {
                // KISA 보안취약점(6-2) 지적사항
                // 3월 19일 6-2의 지적사항으로 주석되었으나 디버그 용도가 아닌것과 4-2 지적사항의 만족을 위해 원복
                if (trace)
                {
                    trace(nexacro._getEvalExceptionMessage(e, url, err.lineNumber));
                }
                return e;
            }
            finally
            {
                evalstr = null;
            }
        };
        nexacro._executeScript = nexacro._executeGlobalEvalStr;
    }
    else
    {
        nexacro._executeEvalStr = function (evalstr, url)
        {
            try
            {
                if (url)
                {
                    evalstr += ("\r\n//# sourceURL=" + encodeURI(url));
                }
                if (url && url.indexOf("_resource_/_stringrc_/") > -1)
                {
                    return (new Function("return " + evalstr)());
                }
                if (url)
                    return (new Function("return " + evalstr))();
                else
                    return (new Function(nexacro.__export_args_str, "return " + evalstr))(...nexacro.__export_args);
            }
            catch (e)
            {
                // KISA 보안취약점(6-2) 지적사항
                // 3월 19일 6-2의 지적사항으로 주석되었으나 디버그 용도가 아닌것과 4-2 지적사항의 만족을 위해 원복
                if (trace)
                {
                    trace(nexacro._getEvalExceptionMessage(e, url));
                }
                return e;
            }
            finally
            {
                evalstr = null;
            }
        };

        nexacro._executeGlobalEvalStr = function (evalstr, url)
        {
            try
            {
                /* if (url)
                 {
                     evalstr += ("\r\n//# sourceURL=" + encodeURI(url));
                 }*/
                if (typeof (evalstr) == "string")
                {
                    if (evalstr.indexOf("if") == 0)
                    {
                        new Function(evalstr)();
                        return;
                    }
                    else if (evalstr.indexOf("//") == 0)
                    {
                        var regExp = new RegExp("//.*\r\n");
                        evalstr = evalstr.replace(regExp, "").trim();
                    }
                    else if (evalstr.indexOf("/*") == 0)
                    {
                        var regExp = new RegExp("\/\*[^>](.*?)\*\/");
                        var endIndex = evalstr.indexOf("*/");
                        var substring = evalstr.slice(0, endIndex + 2);
                        evalstr = evalstr.replace(substring, "").trim();
                    }
                }

                if (url)
                {
                    const reg_pre = /^\(function\(\)\s*\{\s*return\s*(?=function)/;
                    const reg_post = /\}\s*\)\s*\(\s*\)\s*\;\s*$/;

                    const pre = evalstr.match(reg_pre);
                    if (pre)
                    {
                        const post = evalstr.match(reg_post);
                        if (post)
                        {
                            evalstr = evalstr.substring(pre[0].length, post.index);
                        }
                    }

                    evalstr += ("\r\n//# sourceURL=" + encodeURI(url));
                }
                if (url)
                    return (new Function("return " + evalstr))();
                else
                    return (new Function(nexacro.__export_args_str, "return " + evalstr))(...nexacro.__export_args);
            }
            catch (e)
            {
                // KISA 보안취약점(6-2) 지적사항
                // 3월 19일 6-2의 지적사항으로 주석되었으나 디버그 용도가 아닌것과 4-2 지적사항의 만족을 위해 원복
                if (trace)
                {
                    trace(nexacro._getEvalExceptionMessage(e, url));
                }
                return e;
            }
            finally
            {
                evalstr = null;
            }
        };
        nexacro._executeScript = nexacro._executeGlobalEvalStr;
    }

    nexacro._createInlineFunc = function (inline_expr, arglist)
    {
        var _fn_ = "_fn_ = function(";
        _fn_ += arglist.join(',');
        _fn_ += ") { ";
        _fn_ += "try { return " + inline_expr + "; } ";
        _fn_ += "catch(e) { return undefined; } };";
        _fn_ = nexacro._executeEvalStr(_fn_);
        return _fn_;
    };

    // Empty Function`s
    nexacro._emptyFn = function ()
    {
    };

    nexacro._emptyFnExistReturn = function ()
    {
        return null;
    };

    nexacro._echoFn = function (v)
    {
        return v;
    };

    // Basic Util Functions
    nexacro._isBoolean = function (v)
    {
        return (v === true || v === false || v === "true" || v === "false");
    };

    nexacro._isNumber = function (v)
    {
        return (typeof (v) == "number");
    };

    nexacro._isInt = function (v)
    {
        if (typeof (v) == "number")
            return (v == (v | 0));
        return false;
    };

    nexacro._isString = function (v)
    {
        return typeof (v) == "string";
    };

    nexacro._isUndefined = function (v)
    {
        return (v === undefined);
    };

    nexacro._isNull = function (v)
    {
        return (v === undefined || v === null);
    };

    if (Array.isArray)
    {
        nexacro._isArray = function (v)
        {
            return Array.isArray(v);
        };
    }
    else
    {
        nexacro._isArray = function (v)
        {
            return (v instanceof Array);
        };
    }

    nexacro._isFunction = function (v)
    {
        return (typeof (v) == "function");
    };

    nexacro._isObject = function (v)
    {
        return (typeof (v) == "object");
    };

    nexacro._isDecimal = function (v)
    {
        return (v instanceof nexacro.Decimal);
    };

    // undefined,null,""
    nexacro._nvl = function (v, def)
    {
        return (v === undefined || v === null || v === "") ? def : v;
    };
    // undefined,null,NaN
    nexacro._parseInt = function (v, def)
    {
        if (v === undefined || v === null) return def;
        var ret = parseInt(v);
        return (isFinite(ret)) ? ret : def;
    };

    nexacro._toString = function (v)
    {
        if (v != null && typeof v == "object" && v.toString)
            return v.toString();

        return (v == null) ? "" : v + "";
    };

    nexacro._toInt = function (v)
    {
        var num = parseInt(v) | 0;

        return (isFinite(num)) ? num : undefined;
    };

    nexacro._toBoolean = function (v)
    {
        if (typeof v == "number")
        {
            return (v == v) && v != 0; // !NaN and !0
        }
        if (typeof v == 'string')
        {
            if (v == "false" || v == "NaN")
                return false;
            return (+v) != 0;
        }
        else if (v instanceof nexacro.Decimal)
        {
            v = (+v);
            return (v == v) && v !== 0; // !NaN and !0
        }
        else
        {
            return !!v;
        }
    };

    // Convert Function for Graph
    nexacro._convertPtToPx = function (ptsize)
    {
        ptsize = parseInt(ptsize) | 0;
        if (!isNaN(ptsize))
        {
            return (ptsize * (0.35146 / 25.4) * 96);
        }
        return null;
    };

    nexacro._convertPxToPt = function (pxsize)
    {
        pxsize = parseInt(pxsize) | 0;
        if (!isNaN(pxsize))
        {
            return (pxsize / ((0.35146 / 25.4) * 96));
        }
        return null;
    };

    nexacro._isAbsolutePath = function (url)
    {
        if (!url) return false;

        var ch = url.charAt(0);
        if (ch == '/' || ch == '\\')
            return true;

        if (url.indexOf("::") >= 0)
            return false;

        if (url.substring(0, 8).toLowerCase() != "theme://" && url.indexOf(":\/") >= 0)
            return true;

        var format = nexacro._transImageBase64StringFormat(url, false, true);
        if (format)
            return true;

        return false;
    };

    // Convert Em,Rem unit FontObject to Px unit FontObject
    nexacro._convertToAbsUnitFontObj = function (font, refer_font)
    {
        if (font)
        {
            if (font._unit == "em" || font._unit == "rem")
            {
                if (refer_font && refer_font instanceof nexacro._FontObject)
                {
                    // calc px size
                    var calc_size = font._size * refer_font._size;
                    if (refer_font._unit == "pt")
                    {
                        calc_size = calc_size * (100 / 75);
                    }

                    // make convert value string
                    var str_org = nexacro._toString(font._size) + font._unit;
                    var str_calc = nexacro._toString(calc_size) + "px";

                    // create Abs FontObject
                    var str_conv = font.valueOf();
                    str_conv = nexacro._replaceAll(str_conv, str_org, str_calc);
                    font = nexacro.FontObject(str_conv);
                }
            }
        }
        return font;
    };

    if (nexacro._Browser == "Runtime" || nexacro._Browser == "Chrome" || (nexacro._Browser == "Edge" && nexacro._BrowserType == "WebKit"))
    {
        // replaceAll -- Chrome: V8 : use split().join()
        nexacro._getBaseUrl = function (url)
        {
            if (!url) return url;
            url = url.split("\\").join("/");
            //url 의 마지막이 파일인지 디렉토리인지의 여부는 "/" 로 종결하는지의 여부로 결정
            if (url.charAt(url.length - 1) != '/')
                url = url.substring(0, url.lastIndexOf("/") + 1);

            return url;
        };
    }
    else
    {
        // replaceAll : use RegExp
        (function ()
        {
            var re_backslach = /\\/g;

            nexacro._getBaseUrl = function (url)
            {
                url = url.replace(re_backslach, "/");
                //url 의 마지막이 파일인지 디렉토리인지의 여부는 "/" 로 종결하는지의 여부로 결정
                if (url.charAt(url.length - 1) != '/')
                    url = url.substring(0, url.lastIndexOf("/") + 1);
                return url;
            };
        })();
    }

    nexacro._getURIValue = function (uristr)
    {
        if (uristr && uristr.substring(0, 4).toLowerCase() == "url(")
        {
            if (uristr.charAt(4) == "'" && uristr.charAt(uristr.length - 2) == "'")
            {
                uristr = uristr.substring(5, uristr.length - 2);
            }
            else if (uristr.charAt(4) == "\"" && uristr.charAt(uristr.length - 2) == "\"")
            {
                uristr = uristr.substring(5, uristr.length - 2);
            }
            else
            {
                uristr = uristr.substring(4, uristr.length - 1);
            }
            return nexacro.stripQuote(uristr); // ",' 을 사용할 수 있다.
        }
        return uristr;
    };

    //==============================================================================
    nexacro.__uniqueIdNo = 0;
    nexacro.__getUniqueIdNo = function ()
    {
        return nexacro.__uniqueIdNo++;
    };

    //==============================================================================
    // nexacro.Object : All nexacro framework Object's Base
    //==============================================================================
    nexacro.Object = function (id, parent)
    {
        this.id = this._p_name = id || "";
        this._p_parent = parent || null;
    };

    var _pObject = nexacro._createPrototype(Object, nexacro.Object);
    nexacro.Object.prototype = _pObject;
    _pObject._type_name = "Object";

    /* default properties */
    _pObject._toString_str = "[object Object]";

    /* status */
    _pObject._is_array = false;
    _pObject._is_data = false;
    _pObject._is_event = false;
    _pObject._is_elelemt = false;
    _pObject._is_component = false;
    _pObject._is_context = false;
    _pObject._is_form = false;
    _pObject._is_frame = false;
    _pObject._is_window = false;
    _pObject._is_application = false;

    //===============================================================
    // nexacro.Object : Create & Destroy
    //===============================================================
    _pObject.destroy = function ()
    {
        this._p_parent = null;
    };

    //===============================================================
    // nexacro.Object : Properties
    //===============================================================
    // prevent for direct set by User-Script
    _pObject.set_id = function (id)
    {
        this.id = id;
    };

    _pObject.set_name = function (name)
    {
        this._p_name = name;
    };

    _pObject.set_parent = function (parent)
    {
        this._p_parent = parent;
    };


    _pObject._properties = [{ name: "name" }, { name: "parent" }];
    nexacro._defineProperties(_pObject, _pObject._properties);

    //===============================================================
    // nexacro.Object : Util Function
    //===============================================================
    _pObject.toString = function ()
    {
        return "[object " + this._type_name + "]";
    };

    // nexacro Object's Basic Getter/Setter
    _pObject.getSetter = function (name, fnname)
    {
        if (!fnname)
            fnname = "set_" + name;
        var fn = this[fnname];
        if (fn)
        {
            return new nexacro.SetterBinder(this, name, fn);
        }
        return new nexacro.PropBinder(this, name);
    };
    Object.defineProperty(_pObject, "getSetter", { "value": _pObject.getSetter, "writable": true, "enumerable": false });

    _pObject.getNumSetter = function (name, fnname)
    {
        if (!fnname)
            fnname = "set_" + name;
        var fn = this[fnname];
        if (fn)
        {
            return new nexacro.IntSetterBinder(this, name, fn);
        }
        return new nexacro.NumPropBinder(this, name);
    };
    Object.defineProperty(_pObject, "getNumSetter", { "value": _pObject.getNumSetter, "writable": false, "enumerable": false });

    //==============================================================================
    // nexacro.Collection
    // Basic Named Object Array
    //==============================================================================
    nexacro.Collection = function ()
    {
        this._idArray = [];
        this._idxMap = {};
        this._p_length = 0;
    };
    var _pCollection = nexacro._createPrototype(Object, nexacro.Collection);
    nexacro.Collection.prototype = _pCollection;
    _pCollection._type_name = "ObjectArray";

    //==== default flags =========//
    _pCollection._is_array = true;
    //==== end of initial =========//

    _pCollection.toString = function ()
    {
        return "[object " + this._type_name + "]";
    };


    _pCollection.get_id = function (idx)
    {
        return this._idArray[idx];
    };

    _pCollection.update_id = function (idx, newID)
    {
        var id_array = this._idArray;
        var oldID = id_array[idx];
        if (oldID != null && oldID != newID)
        {
            this[newID] = this[oldID];
            delete this[oldID];
            var idx_map = this._idxMap;
            idx_map[newID] = idx;
            delete idx_map[oldID];
            id_array[idx] = newID;
            return true;
        }
        return false;
    };

    _pCollection.indexOf = function (id)
    {
        return this._idxMap[id];
    };

    _pCollection.get_item = function (key)
    {
        return this[key];
    };
    _pCollection.set_item = function (key, val)
    {
        if (typeof (key) == "number")
        {
            var id = this._idArray[key];
            if (id != null)
                return (this[id] = this[key] = val);
        }
        else
        {
            var idx = this._idxMap[key];
            if (idx != null)
                return (this[key] = this[idx] = val);
        }
        return undefined;
    };

    _pCollection.getItem = function (key)
    {
        return this.get_item(key);
    };

    _pCollection.setItem = function (key, val)
    {
        var v = this.get_item(key);
        if (v)
            return this.set_item(key, val);
        else
            return this.add_item(key, val);
    };

    _pCollection.clear = function ()
    {
        var id_array = this._idArray;
        var len = id_array.length;
        for (var i = 0; i < len; i++)
        {
            delete this[id_array[i]];
            //this[id_array[i]] = null;
            delete this[i];
            //this[i] = null;
        }
        this._idArray = [];
        this._idxMap = {};
        this._p_length = 0;

        //id_array = null;
    };

    _pCollection.add_item = function (id, obj)
    {
        var idx_map = this._idxMap;
        var idx = idx_map[id];
        if (idx != null) //check
        {
            this[id] = this[idx] = obj;
        }
        else
        {
            idx = this._p_length;
            this[id] = this[idx] = obj;
            this._idArray.push(id);
            this._idxMap[id] = idx;
            this._p_length = this._idArray.length;
        }
        return idx;
    };
    _pCollection.add = _pCollection.add_item;
    _pCollection.append = _pCollection.add_item;
    _pCollection.appendItem = _pCollection.add_item;

    // XRE original Name : delete
    _pCollection.delete_item = function (key)
    {
        var id_array = this._idArray;
        var idx_map = this._idxMap;
        var len = id_array.length - 1, i;

        if (typeof (key) == "number")
        {
            if (key >= 0 && key <= len)
            {
                var id = id_array[key];
                delete this[id];

                id_array.splice(key, 1);
                for (i = key; i < len; i++)
                {
                    idx_map[id_array[i]] = i;
                    this[i] = this[i + 1];
                }
                delete this[i];
                delete idx_map[id];

                this._p_length = id_array.length;
                return key;
            }
            return -1;
        }
        else
        {
            var idx = idx_map[key];
            if (idx != null)
            {
                delete this[key];

                id_array.splice(idx, 1);
                for (i = idx; i < len; i++)
                {
                    idx_map[id_array[i]] = i;
                    this[i] = this[i + 1];
                }
                delete this[i];
                delete idx_map[key];

                this._p_length = id_array.length;
                return idx;
            }
            return -1;
        }
    };
    _pCollection.remove = _pCollection.delete_item;
    _pCollection.remove_item = _pCollection.delete_item;

    _pCollection.insert_item = function (idx, id, obj)
    {
        idx = (idx | 0);
        var id_array = this._idArray;
        var idx_map = this._idxMap;
        var len = id_array.length;
        if (idx >= len || idx == -1)
            return this.add_item(id, obj);
        if (id in idx_map)
            return this.set_item(idx, obj);

        this[id] = obj;
        id_array.splice(idx, 0, id);
        len++;
        for (var i = len - 1; i >= idx + 1; i--)
        {
            idx_map[id_array[i]] = i;
            this[i] = this[i - 1];
        }
        this[idx] = obj;
        idx_map[id] = idx;
        this._p_length = len;
        return idx;
    };
    _pCollection.insert = _pCollection.insert_item;

    _pCollection.destroy = function ()
    {
        var id_array = this._idArray;
        var len = id_array.length;
        for (var i = 0; i < len; i++)
        {
            this[id_array[i]] = null;
            this[i] = null;
        }
        this._idArray = null;
        this._idxMap = null;
        this._p_length = 0;
    };

    // prevent for direct set by User-Script
    _pCollection.set_length = nexacro._emptyFn;

    _pCollection._properties = [{ name: "length", readonly: true }];
    nexacro._defineProperties(_pCollection, _pCollection._properties);

    //==============================================================================
    // nexacro.Error
    // Error Exception Object - Class(constructor)
    //==============================================================================
    nexacro.Error = function (name, except)
    {
        this.id = this._p_name = name;
        this.except = except;
    };
    // nexacro.Error : basically has properties (nexacro.Object ==> except : text or System Error Object)
    var _pError = nexacro._createPrototype(nexacro.Object, nexacro.Error);
    nexacro.Error.prototype = _pError;

    _pError._type_name = "Error";

    _pError.toString = function ()
    {
        return this._p_name + ": " + this.except;
    };

    //errortable에서 실제 출력할 에러메세지를 뿌려준다.
    //component 별로 자체 errorevent를 출력할 경우에 사용
    nexacro._GetSystemErrorMsg = function (/*obj, errorcode*/)
    {
        var args = [];
        for (var i = 0; i < arguments.length; i++)
        {
            args.push(arguments[i]);
        }

        args = Array.prototype.slice.call(arguments, 1);
        var errormsg = nexacro._getErrorMessge.apply(this, args);

        return errormsg;
    };
    //==============================================================================
    // nexacro._EventSinkObject
    //==============================================================================
    nexacro._EventSinkObject = function (id, parent)
    {
        nexacro.Object.call(this, id, parent);
    };

    var _pEventSinkObject = nexacro._createPrototype(nexacro.Object, nexacro._EventSinkObject);
    nexacro._EventSinkObject.prototype = _pEventSinkObject;
    _pEventSinkObject._type_name = "EventSinkObject";

    _pEventSinkObject._event_list = {};
    _pEventSinkObject._loading_event_list = null;
    _pEventSinkObject._created_event_list = null;

    //===============================================================
    // nexacro._EventSinkObject : Create & Destroy & Update
    //===============================================================
    _pEventSinkObject.on_created = nexacro._emptyFn;

    _pEventSinkObject.destroy = function ()
    {
        nexacro.Object.prototype.destroy.call(this);

        this._clearEventListeners();

        this._event_list = null;
        this._loading_event_list = null;
        this._created_event_list = null;
    };

    //===============================================================
    // nexacro._EventSinkObject : Methods
    //===============================================================
    _pEventSinkObject.addEvent = function (eventid)
    {
        if (this._event_list && !this._event_list[eventid])
        {
            this._event_list[eventid] = 1;
            return true;
        }
        return false;
    };

    _pEventSinkObject.removeEvent = function (eventid)
    {
        if (this._event_list && this._event_list[eventid])
        {
            delete this._event_list[eventid];
            return true;
        }
        return false;
    };

    _pEventSinkObject.setEventHandler = function (evt_id, func, target)
    {
        if (!func)
            return -1;

        if (this._is_loading)
        {
            if (!this._loading_event_list)
            {
                this._loading_event_list = [];
            }

            this._loading_event_list.push({ id: evt_id, func: func, target: target });
        }

        var listener = this[evt_id];
        var idx = -1;
        if (listener)
        {
            if (target)
                idx = listener._setHandler(target, func, true);
            else
                idx = listener._setHandler(this, func, true);
        }
        else if (evt_id in this._event_list)
        {
            listener = new nexacro.EventListener(evt_id);
            this[evt_id] = listener;
            if (this._created_event_list)
            {
                this._created_event_list.push(evt_id);
            }
            else
            {
                this._created_event_list = [];
                this._created_event_list.push(evt_id);
            }
            if (target)
                idx = listener._setHandler(target, func, true);
            else
                idx = listener._setHandler(this, func, true);
        }
        return idx;
    };

    _pEventSinkObject.addEventHandler = function (evt_id, func, target)
    {
        if (this._is_loading)
        {
            if (!this._loading_event_list)
            {
                this._loading_event_list = [];
            }
            this._loading_event_list.push({ id: evt_id, func: func, target: target });
        }

        var listener = this[evt_id];
        var idx = -1;
        if (listener)
        {
            if (target)
                idx = listener._addHandler(target, func, true);
            else
                idx = listener._addHandler(this, func, true);
        }
        else if (evt_id in this._event_list)
        {
            listener = new nexacro.EventListener(evt_id);
            this[evt_id] = listener;
            if (this._created_event_list)
            {
                this._created_event_list.push(evt_id);
            }
            else
            {
                this._created_event_list = [];
                this._created_event_list.push(evt_id);
            }
            if (target)
                idx = listener._addHandler(target, func, true);
            else
                idx = listener._addHandler(this, func, true);
        }
        return idx;
    };

    _pEventSinkObject.insertEventHandler = function (evt_id, evt_idx, func, target)
    {
        evt_idx = evt_idx | 0;
        var listener = this[evt_id];
        var idx = -1;

        if (listener)
        {
            if (target)
                idx = listener._insertHandler(target, evt_idx, func, true);
            else
                idx = listener._insertHandler(this, evt_idx, func, true);
        }
        else if (evt_id in this._event_list)
        {
            listener = new nexacro.EventListener(evt_id);
            this[evt_id] = listener;
            if (this._created_event_list)
            {
                this._created_event_list.push(evt_id);
            }
            else
            {
                this._created_event_list = [];
                this._created_event_list.push(evt_id);
            }
            if (target)
                idx = listener._addHandler(target, func, true);
            else
                idx = listener._addHandler(this, func, true);
        }

        return idx;
    };

    _pEventSinkObject.removeEventHandler = function (evt_id, func, target)
    {
        if (!func)      // 내부코드에 func가 null이면 모두 지우게 되어있으나, 허용하지않음. 필요시 cleareventhandler 사용
            return 0;

        var listener = this[evt_id];
        var nRemovedEvt = 0;
        if (listener)
        {
            if (target)
                nRemovedEvt = listener._removeHandler(target, func, true);
            else
                nRemovedEvt = listener._removeHandler(null, func, true);
        }
        return nRemovedEvt;
    };

    _pEventSinkObject.findEventHandler = function (evt_id, func, target)
    {
        var listener = this[evt_id];
        var idx = -2;
        if (listener)
        {
            var handlers = listener._user_handlers;
            if (target)
                idx = listener._findHandler(handlers, target, func);
            else
                idx = listener._findHandler(handlers, this, func);
        }
        return idx;
    };

    _pEventSinkObject.getEventHandler = function (evt_id, idx)
    {
        var listener = this[evt_id];
        var fn = null;
        if (listener)
        {
            var handlers = listener._user_handlers;
            fn = listener._getHandler(handlers, idx);
        }
        return fn;
    };

    _pEventSinkObject.clearEventHandler = function (evt_id)
    {
        var listener = this[evt_id];
        if (listener)
            return listener._clearAll();
        return 0;
    };

    _pEventSinkObject.setEventHandlerLookup = function (evt_id, funcstr, target)
    {
        var listener = this[evt_id];
        var idx = -1;
        if (listener)
        {
            if (target)
                idx = listener._setHandlerLookup(target, funcstr);
            else
                idx = listener._setHandlerLookup(this, funcstr);
        }
        else if (evt_id in this._event_list)
        {
            listener = new nexacro.EventListener(evt_id);
            this[evt_id] = listener;
            if (this._created_event_list)
            {
                this._created_event_list.push(evt_id);
            }
            else
            {
                this._created_event_list = [];
                this._created_event_list.push(evt_id);
            }

            if (target)
                idx = listener._setHandlerLookup(target, funcstr);
            else
                idx = listener._setHandlerLookup(this, funcstr);
        }
        return idx;
    };

    _pEventSinkObject.addEventHandlerLookup = function (evt_id, funcstr, target)
    {
        var listener = this[evt_id];
        var idx = -1;
        if (listener)
        {
            if (target)
                idx = listener._addHandlerLookup(target, funcstr);
            else
                idx = listener._addHandlerLookup(this, funcstr);
        }
        else if (evt_id in this._event_list)
        {
            listener = new nexacro.EventListener(evt_id);
            this[evt_id] = listener;
            if (this._created_event_list)
            {
                this._created_event_list.push(evt_id);
            }
            else
            {
                this._created_event_list = [];
                this._created_event_list.push(evt_id);
            }
            if (target)
                idx = listener._addHandlerLookup(target, funcstr);
            else
                idx = listener._addHandlerLookup(this, funcstr);
        }
        return idx;
    };

    _pEventSinkObject.removeEventHandlerLookup = function (evt_id, funcstr, target)
    {
        var listener = this[evt_id];
        var nRemovedEvt = 0;
        if (listener)
        {
            if (target)
                nRemovedEvt = listener._removeHandlerLookup(target, funcstr);
            else
                nRemovedEvt = listener._removeHandlerLookup(this, funcstr);
        }
        return nRemovedEvt;
    };

    _pEventSinkObject.findEventHandlerLookup = function (evt_id, funcstr, target)
    {
        var listener = this[evt_id];
        var idx = -2; //no exist listener
        if (listener)
        {
            var handlers = listener._user_handlers;
            if (target)
                idx = listener._findHandlerLookup(handlers, target, funcstr);
            else
                idx = listener._findHandlerLookup(handlers, this, funcstr);
        }
        return idx;
    };

    //===============================================================
    // nexacro._EventSinkObject : Util Function
    //===============================================================
    _pEventSinkObject._clearEventListener = function (evt_id) // overriding to popupDiv because prevent to delete event which is not included in the form._event_list
    {
        var evt = this[evt_id];
        if (evt && evt._has_handlers)
        {
            evt._clearAll();
            this[evt_id] = null;
        }
    };

    _pEventSinkObject._clearEventListeners = function ()
    {
        var evt_list = this._created_event_list;
        if (evt_list)
        {
            var len = evt_list.length;
            if (len > 0)
            {
                var i = 0;
                while (true)
                {
                    if (i >= len) break; this._clearEventListener(evt_list[i++]);
                    if (i >= len) break; this._clearEventListener(evt_list[i++]);
                    if (i >= len) break; this._clearEventListener(evt_list[i++]);
                    if (i >= len) break; this._clearEventListener(evt_list[i++]);
                    if (i >= len) break; this._clearEventListener(evt_list[i++]);
                    if (i >= len) break; this._clearEventListener(evt_list[i++]);
                    if (i >= len) break; this._clearEventListener(evt_list[i++]);
                    if (i >= len) break; this._clearEventListener(evt_list[i++]);
                    if (i >= len) break; this._clearEventListener(evt_list[i++]);
                    if (i >= len) break; this._clearEventListener(evt_list[i++]);
                }
            }
        }
    };

    _pEventSinkObject._setEventHandler = function (evt_id, func, target)
    {
        var listener = this[evt_id];
        var idx = -1;
        if (listener)
        {
            if (target)
                idx = listener._setHandler(target, func);
            else
                idx = listener._setHandler(this, func);
        }
        else if (evt_id in this._event_list)
        {
            listener = new nexacro.EventListener(evt_id);
            this[evt_id] = listener;
            if (this._created_event_list)
            {
                this._created_event_list.push(evt_id);
            }
            else
            {
                this._created_event_list = [];
                this._created_event_list.push(evt_id);
            }
            if (target)
                idx = listener._setHandler(target, func);
            else
                idx = listener._setHandler(this, func);
        }
        return idx;
    };

    _pEventSinkObject._addEventHandler = function (evt_id, func, target)
    {
        var listener = this[evt_id];
        var idx = -1;
        if (listener)
        {
            if (target)
                idx = listener._addHandler(target, func);
            else
                idx = listener._addHandler(this, func);
        }
        else if (evt_id in this._event_list)
        {
            listener = new nexacro.EventListener(evt_id);
            this[evt_id] = listener;
            if (this._created_event_list)
            {
                this._created_event_list.push(evt_id);
            }
            else
            {
                this._created_event_list = [];
                this._created_event_list.push(evt_id);
            }
            if (target)
                idx = listener._addHandler(target, func);
            else
                idx = listener._addHandler(this, func);
        }
        return idx;
    };

    _pEventSinkObject._removeEventHandler = function (evt_id, func, target)
    {
        var listener = this[evt_id];
        var nRemovedEvt = 0;
        if (listener)
        {
            if (target)
                nRemovedEvt = listener._removeHandler(target, func);
            else
                nRemovedEvt = listener._removeHandler(null, func);
        }
        return nRemovedEvt;
    };

    _pEventSinkObject._findEventHandler = function (evt_id, func, target)
    {
        var listener = this[evt_id];
        var idx = -2;
        if (listener)
        {
            var handlers = listener._sys_handlers;
            if (target)
                idx = listener._findHandler(handlers, target, func);
            else
                idx = listener._findHandler(handlers, null, func);
        }
        return idx;
    };

    _pEventSinkObject._getRootObject = function ()
    {
        var pThis = this;
        while (pThis && !pThis._is_component)
        {
            pThis = pThis._p_parent;
        }
        if (pThis)
        {
            return pThis._getRootObject();
        }
        return null;
    };

    //==============================================================================
    // nexacro.EventListener
    // Event handler Container
    //==============================================================================
    nexacro.EventHandler = function (obj, fn)
    {
        this.target = obj;
        this.handler = fn;
    };

    nexacro.EventListener = function (id)
    {
        this.id = this._p_name = id;
        this._p_length = 0;

        // event flow 변경 작업
        //--------------------------------------------------------------------------------------------
        this.defaultprevented = false; // 이전 event listener 에서 취소된 event 임을 제공 (readonly)
        this.stoppropagation = false;
        //--------------------------------------------------------------------------------------------

        // -------------- internal variable -------------- //
        this._sys_handlers = [];
        this._user_handlers = [];
        this._has_handlers = false;
    };
    var _pEventListener = nexacro._createPrototype(nexacro.Object, nexacro.EventListener);
    nexacro.EventListener.prototype = _pEventListener;

    _pEventListener._type_name = "EventListener";

    // properties
    // readonly property
    _pEventListener.set_length = nexacro._emptyFn;
    _pEventListener._properties = [{ name: "length", readonly: true }];
    nexacro._defineProperties(_pEventListener, _pEventListener._properties);


    _pEventListener._findByObj = function (handlers, obj)
    {
        var len = handlers.length;
        for (var i = 0; i < len; i++)
        {
            if (handlers[i].target == obj)
                return i;
        }
        return -1;
    };

    _pEventListener._findHandler = function (handlers, obj, fn)
    {
        var len = handlers.length;
        for (var i = 0; i < len; i++)
        {
            if (handlers[i].target == obj && handlers[i].handler == fn)
                return i;
        }
        return -1;
    };

    _pEventListener._getHandler = function (handlers, idx)
    {
        var len = handlers.length;
        if (idx >= 0 && idx < len)
        {
            return handlers[idx].handler;
        }
        return undefined;
    };

    // internal method
    _pEventListener._setHandler = function (obj, fn, user_handler)
    {
        var handlers = this._sys_handlers;
        if (user_handler)
            handlers = this._user_handlers;

        var target = obj;
        var idx = this._findByObj(handlers, target);
        if (idx < 0)
        {
            idx = handlers.length;
            handlers.push(new nexacro.EventHandler(target, fn));
        }
        else
        {
            handlers[idx] = new nexacro.EventHandler(target, fn);
        }
        this._has_handlers |= handlers.length;
        return idx;
    };

    _pEventListener._addHandler = function (obj, fn, user_handler)
    {
        var handlers = this._sys_handlers;
        if (user_handler)
            handlers = this._user_handlers;
        var idx = -1;
        if (fn)
        {
            var target = obj;
            var len = handlers.length;
            var _handler = new nexacro.EventHandler(target, fn);
            for (var i = 0; i < len; i++)
            {
                if (handlers[i].handler == _handler.handler && handlers[i].target == _handler.target)
                    return i;
            }
            handlers.push(_handler);

            if (user_handler)
                this._p_length = handlers.length;

            this._has_handlers |= handlers.length;
            idx = len;
        }
        return idx;
    };

    _pEventListener._insertHandler = function (obj, evt_idx, fn, user_handler)
    {
        var handlers = this._sys_handlers;
        if (user_handler)
            handlers = this._user_handlers;
        var idx = -1;

        if (fn)
        {
            var target = obj;
            var len = handlers.length;
            var _handler = new nexacro.EventHandler(target, fn);
            for (var i = 0; i < len; i++)
            {
                if (handlers[i].handler == _handler.handler && handlers[i].target == _handler.target)
                    return i;
            }

            if (evt_idx == -1 || evt_idx >= len)
            {
                handlers.push(_handler);
                idx = len;
            }
            else
            {
                handlers.splice(evt_idx, 0, _handler);
                idx = evt_idx;
            }

            this._user_handlers = handlers;

            if (user_handler)
                this._p_length = handlers.length;

            this._has_handlers = handlers.length;
        }
        return idx;
    };

    _pEventListener._removeHandler = function (obj, fn, user_handler)
    {
        var handlers = this._sys_handlers;
        if (user_handler)
            handlers = this._user_handlers;
        var len = handlers.length;
        for (var i = len - 1; i >= 0; i--)
        {
            if (obj == null)
            {
                if (fn == null)
                    handlers.splice(i, 1);
                else if (handlers[i].handler == fn)
                    handlers.splice(i, 1);
            }
            else
            {
                if (fn == null)
                    handlers.splice(i, 1);
                else if (handlers[i].target == obj && handlers[i].handler == fn)
                    handlers.splice(i, 1);
            }
        }
        this._has_handlers |= handlers.length;

        if (user_handler)
            this._p_length = handlers.length;

        return len - handlers.length;
    };

    // for lookup function
    _pEventListener._setHandlerLookup = function (obj, fnstr)
    {
        let handlers = this._user_handlers;
        let idx = -1;
        let f, fn;
        if (fnstr.length > 0)
        {
            for (f = obj; (f != null); f = f.parent)
            {
                fn = f[fnstr];
                if (fn) break;
            }

            if (!fn) 
            {
                f = nexacro.getEnvironment();
                fn = f[fnstr];
            }

            if (fn)
            {
                let target = f;
                idx = this._findByObj(handlers, target);
                if (idx < 0 && handlers.length <= 0)
                {
                    idx = handlers.length;
                    handlers.push(new nexacro.EventHandler(target, fn));
                    this._p_length = handlers.length;
                }
                else
                {
                    idx = 0;
                    handlers[idx] = new nexacro.EventHandler(target, fn);
                }

                this._has_handlers |= handlers.length;
                return idx;
            }
        }
        return idx;
    };

    _pEventListener._addHandlerLookup = function (obj, fnstr)
    {
        var handlers = this._user_handlers;
        var idx = -1;
        let f, fn;
        if (fnstr.length > 0)
        {
            for (f = obj; (f != null); f = f.parent)
            {
                fn = f[fnstr];
                if (fn) break;
            }

            if (!fn) 
            {
                f = nexacro.getEnvironment();
                fn = f[fnstr];
            }

            if (fn)
            {
                let target = f;
                idx = handlers.length;

                for (let i = 0; i < idx; i++)
                {
                    if (handlers[i].handler == fn)
                        return i;
                }

                handlers.push(new nexacro.EventHandler(target, fn));
                this._has_handlers |= handlers.length;
                this._p_length = handlers.length;
                return idx;
            }
        }
        return idx;
    };

    _pEventListener._removeHandlerLookup = function (obj, fnstr)
    {
        let handlers = this._user_handlers;
        let len;
        let isremove = false;
        let f, fn;
        if (fnstr.length > 0)
        {
            for (f = obj; (f != null); f = f.parent)
            {
                fn = f[fnstr];
                if (fn) break;
            }

            if (!fn) 
            {
                f = nexacro.getEnvironment();
                fn = f[fnstr];
            }

            if (fn)
            {
                len = handlers.length;
                for (let i = len - 1; i >= 0; i--)
                {
                    if (handlers[i].handler == fn)
                    {
                        handlers.splice(i, 1);
                        isremove = true;
                    }
                }
                this._has_handlers |= handlers.length;
                this._p_length = handlers.length;
            }
        }
        return isremove ? 1 : 0;
    };

    _pEventListener._findHandlerLookup = function (handlers, obj, fnstr)
    {
        let len = handlers.length;
        let f, fn;
        if (fnstr.length > 0)
        {
            for (f = obj; (f != null); f = f.parent)
            {
                fn = f[fnstr];
                if (fn) break;
            }

            if (!fn) 
            {
                f = nexacro.getEnvironment();
                fn = f[fnstr];
            }

            if (fn)
            {
                for (let i = 0; i < len; i++)
                {
                    if (handlers[i].target == f && handlers[i].handler == fn)
                        return i;
                }
            }
        }
        return -1;
    };

    _pEventListener._clearAll = function ()
    {
        var numofEvent = this._sys_handlers.length + this._user_handlers.length;
        var len = this._sys_handlers.length;
        var handler;
        for (var i = 0; i < len; i++)
        {
            handler = this._sys_handlers[i];
            handler.target = null;
            handler.handler = null;
            this._sys_handlers[i] = null;
            delete this._sys_handlers[i];
        }

        len = this._user_handlers.length;
        for (i = 0; i < len; i++)
        {
            handler = this._user_handlers[i];
            handler.target = null;
            handler.handler = null;
            //handler = null;
            this._user_handlers[i] = null;
            delete this._user_handlers[i];
        }
        this._sys_handlers = [];
        this._user_handlers = [];
        this._p_length = 0;
        this._has_handlers = 0;
        return numofEvent;
    };

    _pEventListener._fireEvent = function (obj, evt)
    {
        var i, ret;
        var h;
        var handlers = this._user_handlers;
        var len = handlers.length;

        try
        {
            var retrtl = false;
            if (len > 0 && evt._xposConvertToRtl)
            {
                retrtl = evt._xposConvertToRtl(obj, evt.fromreferenceobject);
            }

            for (i = 0; i < len; i++)
            {
                h = handlers[i];
                if (obj._is_alive !== false && obj.enableevent !== false)
                    ret = h.handler.call(h.target, obj, evt);
                if (evt)
                {
                    this.defaultprevented = evt._prevented;
                    this.stoppropagation = evt._stoppropagation;
                }
            }

            if (retrtl)
            {
                evt._xposConvertToLtr(obj);
            }
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

        handlers = this._sys_handlers;
        len = handlers.length;

        for (i = 0; i < len; i++)
        {
            h = handlers[i];
            if (obj._is_alive !== false && obj.enableevent !== false)
                ret = h.handler.call(h.target, obj, evt);
            if (evt)
            {
                this.defaultprevented = evt._prevented;
                this.stoppropagation = evt._stoppropagation;
            }
        }

        return ret;
    };

    // event flow 변경 작업
    //--------------------------------------------------------------------------------------
    _pEventListener._fireSysEvent = function (obj, evt)
    {
        var i, ret;
        var handlers = this._sys_handlers;
        var len = handlers.length;
        var h;
        for (i = 0; i < len; i++)
        {
            h = handlers[i];
            if (obj.enableevent !== false)
                ret = h.handler.call(h.target, obj, evt);
            if (evt)
            {
                this.defaultprevented = evt._prevented;
                this.stoppropagation = evt._stoppropagation;
            }
        }
        return ret;
    };

    _pEventListener._fireUserEvent = function (obj, evt)
    {
        var i, ret;
        var h;
        var handlers = this._user_handlers;
        var len = handlers.length;

        try
        {
            if (len > 0 && evt._xposConvertToRtl)
            {
                evt._xposConvertToRtl(obj, evt.fromreferenceobject);
            }

            for (i = 0; i < len; i++)
            {
                h = handlers[i];

                if (obj.enableevent !== false)
                    ret = h.handler.call(h.target, obj, evt);
                if (evt)
                {
                    this.defaultprevented = evt._prevented;
                    this.stoppropagation = evt._stoppropagation;
                }

                if (!obj._is_alive) // event에서 this가 파괴된 경우
                    break;
            }
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
        return ret;
    };
    //--------------------------------------------------------------------------------------

    _pEventListener._fireCheckEvent = function (obj, evt)
    {
        var i, ret;
        var handlers = this._user_handlers;
        var len = handlers.length;
        var h;

        try
        {
            var retrtl = false;
            if (len > 0 && evt._xposConvertToRtl)
            {
                retrtl = evt._xposConvertToRtl(obj, evt.fromreferenceobject);
            }

            for (i = 0; i < len; i++)
            {
                h = handlers[i];

                if (obj.enableevent !== false)
                    ret = h.handler.call(h.target, obj, evt);
                if (evt)
                {
                    this.defaultprevented = evt._prevented;
                    this.stoppropagation = evt._stoppropagation;
                }

                if (ret)
                    ret = nexacro._toBoolean(ret);

                if (ret != null && (!ret))
                    return false;
            }

            if (retrtl)
            {
                evt._xposConvertToLtr(obj);
            }
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

        handlers = this._sys_handlers;
        len = handlers.length;

        for (i = 0; i < len; i++)
        {
            h = handlers[i];
            if (obj.enableevent)
                ret = h.handler.call(h.target, obj, evt);
            if (evt)
            {
                this.defaultprevented = evt._prevented;
                this.stoppropagation = evt._stoppropagation;
            }
            if (ret != null && (!ret))
                return false;
        }

        return true;
    };

    // external method
    _pEventListener.fireEvent = function (obj, evt, cancelable)
    {
        evt.eventid = this._p_name;
        evt.fromobject = obj;
        if (cancelable)
            return this._fireCheckEvent(obj, evt);

        return this._fireEvent(obj, evt);
    };

    _pEventListener.clear = function ()
    {
        var cnt = this._user_handlers.length;
        this._user_handlers = [];
        this._p_length = 0;
        this._has_handlers = (this._p_length + this._sys_handlers.length);
        return cnt;
    };


    //==============================================================================
    // nexacro.Event : Deprecated
    //==============================================================================
    nexacro.Event = function (obj, evt_id)
    {
        this.id = this.eventid = evt_id || "";
        this.fromobject = this.fromreferenceobject = obj;
        this._prevented = false;
        this._stoppropagation = false;
        this.cancelable = false;
        this.bubbles = false;
    };

    var _pEvent = nexacro._createPrototype(nexacro.Object, nexacro.Event);
    nexacro.Event.prototype = _pEvent;
    _pEvent._type_name = "Event";

    /* status */
    _pEvent._is_event = true;

    //===============================================================
    // nexacro.Event : Create & Destroy
    //===============================================================
    _pEvent.destroy = function ()
    {
        this.fromobject = null;
        this.fromreferenceobject = null;
    };

    //===============================================================
    // nexacro.Event : Methods
    //===============================================================
    _pEvent.preventDefault = function ()
    {
        this._prevented = this.cancelable;
    };

    _pEvent.stopPropagation = function ()
    {
        this._stoppropagation = this.bubbles;
    };

    //===============================================================
    // nexacro.Event : Static Constants
    //===============================================================
    nexacro.Event.KEY_META = 91;    // IOS : command key, window : window key
    nexacro.Event.KEY_RETURN = 13;
    nexacro.Event.KEY_ENTER = 13;
    nexacro.Event.KEY_TAB = 9;
    nexacro.Event.KEY_UP = 38;
    nexacro.Event.KEY_DOWN = 40;
    nexacro.Event.KEY_LEFT = 37;
    nexacro.Event.KEY_RIGHT = 39;
    nexacro.Event.KEY_SPACE = 32;
    nexacro.Event.KEY_SHIFT = 16;
    nexacro.Event.KEY_CTRL = 17;
    nexacro.Event.KEY_CONTROL = 17;
    nexacro.Event.KEY_ALT = 18; // ios : option key, windown : alt key
    nexacro.Event.KEY_ESC = 27;
    nexacro.Event.KEY_F1 = 112;
    nexacro.Event.KEY_F2 = 113;
    nexacro.Event.KEY_F3 = 114;
    nexacro.Event.KEY_F4 = 115;
    nexacro.Event.KEY_F5 = 116;
    nexacro.Event.KEY_F6 = 117;
    nexacro.Event.KEY_F7 = 118;
    nexacro.Event.KEY_F8 = 119;
    nexacro.Event.KEY_F9 = 120;
    nexacro.Event.KEY_F10 = 121;
    nexacro.Event.KEY_F11 = 122;
    nexacro.Event.KEY_F12 = 123;
    nexacro.Event.KEY_DEL = 46;
    nexacro.Event.KEY_DELETE = 46;
    nexacro.Event.KEY_BACKSPACE = 8;
    nexacro.Event.KEY_INSERT = 45;
    nexacro.Event.KEY_HOME = 36;
    nexacro.Event.KEY_END = 35;
    nexacro.Event.KEY_PAGE_UP = 33;
    nexacro.Event.KEY_PAGE_DOWN = 34;
    nexacro.Event.KEY_NUM_LOCK = 144;
    nexacro.Event.KEY_NUMPAD0 = 96;
    nexacro.Event.KEY_NUMPAD1 = 97;
    nexacro.Event.KEY_NUMPAD2 = 98;
    nexacro.Event.KEY_NUMPAD3 = 99;
    nexacro.Event.KEY_NUMPAD4 = 100;
    nexacro.Event.KEY_NUMPAD5 = 101;
    nexacro.Event.KEY_NUMPAD6 = 102;
    nexacro.Event.KEY_NUMPAD7 = 103;
    nexacro.Event.KEY_NUMPAD8 = 104;
    nexacro.Event.KEY_NUMPAD9 = 105;
    nexacro.Event.KEY_NUMPAD_DIVIDE = 111;
    nexacro.Event.KEY_NUMPAD_MULTIPLY = 106;
    nexacro.Event.KEY_NUMPAD_MINUS = 109;
    nexacro.Event.KEY_NUMPAD_PLUS = 107;

    //==============================================================================
    // nexacro.EventInfo
    //==============================================================================
    nexacro.EventInfo = function (obj, evt_id)
    {
        this.id = this.eventid = evt_id || "";
        this.fromobject = this.fromreferenceobject = obj;
        this._prevented = false;
        this._stoppropagation = false;
        this.cancelable = false;
        this.bubbles = false;
    };

    var _pEventInfo = nexacro._createPrototype(nexacro.Object, nexacro.EventInfo);
    nexacro.EventInfo.prototype = _pEventInfo;
    _pEventInfo._type_name = "EventInfo";

    /* status */
    _pEventInfo._is_event = true;

    //===============================================================
    // nexacro.EventInfo : Create & Destroy
    //===============================================================
    _pEventInfo.destroy = function ()
    {
        this.fromobject = null;
        this.fromreferenceobject = null;
    };

    //===============================================================
    // nexacro.EventInfo : Properties
    //===============================================================
    //_pEventInfo.set_eventid = function (v)
    //{
    //	if (v && v != this.eventid)
    //	{
    //		this.eventid = v;
    //	}
    //};

    //===============================================================
    // nexacro.EventInfo : Methods
    //===============================================================
    _pEventInfo.preventDefault = function ()
    {
        this._prevented = this.cancelable;
    };

    _pEventInfo.stopPropagation = function ()
    {
        this._stoppropagation = this.bubbles;
    };

    //==============================================================================
    // Form Event
    //==============================================================================
    // nexacro.TimerEventInfo
    //==============================================================================
    nexacro.TimerEventInfo = function (obj, id, timerid)
    {
        this.id = this.eventid = id || "ontimer";
        this.fromobject = this.fromreferenceobject = obj;
        this.timerid = timerid;
    };
    var _pTimerEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.TimerEventInfo);
    nexacro.TimerEventInfo.prototype = _pTimerEventInfo;
    _pTimerEventInfo._type_name = "TimerEventInfo";


    //==============================================================================
    // Application Event
    //==============================================================================
    // nexacro.ErrorEventInfo
    //==============================================================================
    nexacro.ErrorEventInfo = function (obj, id, errortype, errormsg, errorobj, statuscode, requesturi, locationuri, errordata)
    {
        this.id = this.eventid = id || "onerror";
        this.fromobject = this.fromreferenceobject = obj;

        this.cancelable = true;
        this.errortype = errortype;
        this.errormsg = errormsg;
        this.errorobj = errorobj;
        this.errordata = errordata;

        if (statuscode) this.statuscode = statuscode;
        else this.statuscode = 0;

        this.requesturi = requesturi;
        this.locationuri = locationuri;
    };
    var _pErrorEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ErrorEventInfo);
    nexacro.ErrorEventInfo.prototype = _pErrorEventInfo;
    _pErrorEventInfo._type_name = "ErrorEventInfo";

    //_pErrorEventInfo.set_errortype = function (n)
    //{
    //    if (n && this.errortype != n)
    //        this.errortype = n;
    //};

    //_pErrorEventInfo.set_errormsg = function (v)
    //{
    //    if (v && this.errormsg != v)
    //        this.errormsg = v;
    //};

    //_pErrorEventInfo.set_errorobj = function (obj)
    //{
    //    if (obj && this.errorobj != obj)
    //        this.errorobj = obj;
    //};

    //_pErrorEventInfo.set_locationuri = function (v)
    //{
    //    if (v && this.locationuri != v)
    //        this.locationuri = v;
    //};

    //_pErrorEventInfo.set_requesturi = function (v)
    //{
    //    if (v && this.requesturi != v)
    //        this.requesturi = v;
    //};

    //_pErrorEventInfo.set_statuscode = function (v)
    //{
    //    if (v && this.statuscode != v)
    //        this.statuscode = v;
    //};

    //_pErrorEventInfo.set_errordata = function (v)
    //{
    //    if (v && this.errordata != v)
    //        this.errordata = v;
    //};

    _pErrorEventInfo.getHexaErrorCode = function ()
    {
        return this.errorcode;
    };


    //==============================================================================
    // nexacro.ExitEventInfo
    //==============================================================================
    nexacro.ExitEventInfo = function (obj, id)
    {
        this.id = this.eventid = id || "onexit";
        this.fromobject = this.fromreferenceobject = obj;
    };
    var _pExitEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ExitEventInfo);
    nexacro.ExitEventInfo.prototype = _pExitEventInfo;
    _pExitEventInfo._type_name = "ExitEventInfo";


    //==============================================================================
    // nexacro.AccessibilityEventInfo
    //==============================================================================
    nexacro.AccessibilityEventInfo = function (obj, id, text, from_comp, refer_comp)
    {
        this.id = this.eventid = id || "onaccessibility";

        this.fromobject = from_comp || obj;
        this.fromreferenceobject = refer_comp || obj;

        this.text = text;
    };
    var _pAccessibilityEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.AccessibilityEventInfo);
    nexacro.AccessibilityEventInfo.prototype = _pAccessibilityEventInfo;
    _pAccessibilityEventInfo._type_name = "AccessibilityEventInfo";


    //==============================================================================
    // nexacro.ActivateEventInfo
    //==============================================================================
    nexacro.ActivateEventInfo = function (obj, id, state)
    {
        nexacro.Event.call(this, obj, id || "onactivate");
        this.fromobject = this.fromreferenceobject = obj;
        this.state = state;

        this.bubbles = true;
    };
    var _pActivateEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ActivateEventInfo);
    nexacro.ActivateEventInfo.prototype = _pActivateEventInfo;
    _pActivateEventInfo._type_name = "ActivateEventInfo";


    //==============================================================================
    // nexacro.SysCommandEventInfo
    //==============================================================================
    nexacro.SysCommandEventInfo = function (obj, id, systemcommand)
    {
        this.id = this.eventid = id || "onsyscommand";
        this.fromobject = this.fromreferenceobject = obj;

        this.bubbles = true;

        this.systemcommand = systemcommand;
    };
    var _pSysCommandEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.SysCommandEventInfo);
    nexacro.SysCommandEventInfo.prototype = _pSysCommandEventInfo;
    _pSysCommandEventInfo._type_name = "SysCommandEventInfo";


    //==============================================================================
    // nexacro.CloseEventInfo
    //==============================================================================
    nexacro.CloseEventInfo = function (obj, id, from_comp, refer_comp, root_closing_comp)
    {
        nexacro.Event.call(this, obj, id || "onclose");
        this.bubbles = true;

        this.fromobject = from_comp || obj;
        this.fromreferenceobject = refer_comp || obj;

        // 실제 닫히는 최상위의 컴포넌트
        this._root_closing_comp = root_closing_comp;
    };
    var _pCloseEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.CloseEventInfo);
    nexacro.CloseEventInfo.prototype = _pCloseEventInfo;
    _pCloseEventInfo._type_name = "CloseEventInfo";


    //==============================================================================
    // nexacro.LoadEventInfo
    //==============================================================================
    nexacro.LoadEventInfo = function (obj, id, url, enable)
    {
        nexacro.Event.call(this, obj, id || "onload");
        this.url = url;
        this.enable = enable;
    };
    var _pLoadEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.LoadEventInfo);
    nexacro.LoadEventInfo.prototype = _pLoadEventInfo;
    _pLoadEventInfo._type_name = "LoadEventInfo";


    //==============================================================================
    // nexacro.SetFocusEventInfo
    //==============================================================================
    nexacro.SetFocusEventInfo = function (obj, id, oldcomp, oldrefcomp, fromobject, fromreferenceobject)
    {
        this.id = this.eventid = id || "onsetfocus";
        this.fromobject = this.fromreferenceobject = obj;

        this.oldcomponent = oldcomp;
        this.oldreferencecomponent = oldrefcomp;

        if (fromobject)
            this.fromobject = fromobject;

        if (fromreferenceobject)
            this.fromreferenceobject = fromreferenceobject;
    };
    var _pSetFocusEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.SetFocusEventInfo);
    nexacro.SetFocusEventInfo.prototype = _pSetFocusEventInfo;
    _pSetFocusEventInfo._type_name = "SetFocusEventInfo";


    //==============================================================================
    // nexacro.KillFocusEventInfo
    //==============================================================================
    nexacro.KillFocusEventInfo = function (obj, id, newcomp, newrefcomp, fromobject, fromreferenceobject)
    {
        nexacro.Event.call(this, obj, id || "onkillfocus");
        this.newcomponent = newcomp;
        this.newreferencecomponent = newrefcomp;

        if (fromobject)
            this.fromobject = fromobject;

        if (fromreferenceobject)
            this.fromreferenceobject = fromreferenceobject;
    };
    var _pKillFocusEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.KillFocusEventInfo);
    nexacro.KillFocusEventInfo.prototype = _pKillFocusEventInfo;
    _pKillFocusEventInfo._type_name = "KillFocusEventInfo";


    //==============================================================================
    // nexacro.MoveEventInfo
    //==============================================================================
    nexacro.MoveEventInfo = function (obj, id, left, top)
    {
        this.id = this.eventid = id || "onmove";
        this.fromobject = this.fromreferenceobject = obj;

        this.x = left;
        this.y = top;
    };
    var _pMoveEventInfo = nexacro._createPrototype(nexacro.MouseEventInfo, nexacro.MoveEventInfo);
    nexacro.MoveEventInfo.prototype = _pMoveEventInfo;
    _pMoveEventInfo._type_name = "MoveEventInfo";


    //==============================================================================
    // nexacro.SizeEventInfo
    //==============================================================================
    nexacro.SizeEventInfo = function (obj, id, width, height)
    {
        this.id = this.eventid = id || "onsize";
        this.fromobject = this.fromreferenceobject = obj;

        this.cx = width;
        this.cy = height;

        this.reverse = false;

        this._orientation = nexacro._getMobileOrientation();

        switch (this._orientation)
        {
            case 0:
                this.orientation = "portrait";
                break;
            case 1:
                this.orientation = "portrait";
                this.reverse = true;
                break;
            case 2:
                this.orientation = "landscape";
                this.reverse = true;
                break;
            case 3:
                this.orientation = "landscape";
                break;
            default:
                this.orientation = "resize";
                break;
        }
    };
    var _pSizeEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.SizeEventInfo);
    nexacro.SizeEventInfo.prototype = _pSizeEventInfo;
    _pSizeEventInfo._type_name = "SizeEventInfo";


    //==============================================================================
    // nexacro.KeyEventInfo
    //==============================================================================
    nexacro.KeyEventInfo = function (obj, id, alt_key, ctrl_key, shift_key, key_code, from_comp, from_refer_comp, meta_key)
    {
        this.id = this.eventid = id || "onkey";

        this.cancelable = true;
        this.bubbles = true;

        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;
        this.altkey = alt_key;
        this.ctrlkey = ctrl_key;
        this.shiftkey = shift_key;
        this.metakey = meta_key || false;
        this.keycode = key_code;
    };
    var _pKeyEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.KeyEventInfo);
    nexacro.KeyEventInfo.prototype = _pKeyEventInfo;
    _pKeyEventInfo._type_name = "KeyEventInfo";


    //==============================================================================
    // nexacro.MouseEventInfo
    //==============================================================================
    nexacro.MouseEventInfo = function (obj, id, strButton, altKey, ctrlKey, shiftKey, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, metaKey)
    {
        this.id = this.eventid = id || "onmouse";

        this.cancelable = true;
        this.bubbles = true;

        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;
        this.altkey = altKey || false;
        this.ctrlkey = ctrlKey || false;
        this.button = strButton || "";
        this.shiftkey = shiftKey || false;
        this.metakey = metaKey || false;
        this.screenx = screenX || -1;
        this.screeny = screenY || -1;
        this.canvasx = canvasX || -1;
        this.canvasy = canvasY || -1;
        this.clientx = clientX || -1;
        this.clienty = clientY || -1;
    };

    var _pMouseEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.MouseEventInfo);
    nexacro.MouseEventInfo.prototype = _pMouseEventInfo;
    _pMouseEventInfo._type_name = "MouseEventInfo";

    _pMouseEventInfo._xposConvertToRtl = function (obj, from_refer_comp)
    {
        if (obj && obj._isRtl && obj._isRtl())
        {
            this._orgcanvasx = this.canvasx;
            this._orgclientx = this.clientx;
            this.canvasx = nexacro._getRTLCanvasXForMouseEvent(obj, from_refer_comp, this.canvasx);
            this.clientx = obj._getClientXY(this.canvasx, this.canvasy)[0];

            return true;
        }
        return false;
    };

    _pMouseEventInfo._xposConvertToLtr = function (obj)
    {
        if (obj && obj._isRtl && obj._isRtl())
        {
            this.canvasx = this._orgcanvasx;
            this.clientx = this._orgclientx;

            delete this._orgcanvas;
            delete this._orgclientx;
        }
    };

    nexacro.ClickEventInfo = function (obj, id, strButton, altKey, ctrlKey, shiftKey, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, metaKey)
    {
        this.id = this.eventid = id || "onclick";

        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;
        this.altkey = altKey || false;
        this.ctrlkey = ctrlKey || false;
        this.button = strButton || "";
        this.shiftkey = shiftKey || false;
        this.metakey = metaKey || false;
        this.screenx = (screenX === undefined ? -1 : screenX);
        this.screeny = (screenY === undefined ? -1 : screenY);
        this.canvasx = (canvasX === undefined ? -1 : canvasX);
        this.canvasy = (canvasY === undefined ? -1 : canvasY);
        this.clientx = (clientX === undefined ? -1 : clientX);
        this.clienty = (clientY === undefined ? -1 : clientY);
    };

    var _pClickEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ClickEventInfo);
    nexacro.ClickEventInfo.prototype = _pClickEventInfo;
    _pClickEventInfo._type_name = "ClickEventInfo";

    _pClickEventInfo._xposConvertToRtl = function (obj, from_refer_comp)
    {
        if (obj && obj._isRtl && obj._isRtl())
        {
            this._orgcanvasx = this.canvasx;
            this._orgclientx = this.clientx;
            this.canvasx = nexacro._getRTLCanvasXForMouseEvent(obj, from_refer_comp, this.canvasx);
            this.clientx = obj._getClientXY(this.canvasx, this.canvasy)[0];

            return true;
        }
        return false;
    };

    _pClickEventInfo._xposConvertToLtr = function (obj)
    {
        if (obj && obj._isRtl && obj._isRtl())
        {
            this.canvasx = this._orgcanvasx;
            this.clientx = this._orgclientx;

            delete this._orgcanvas;
            delete this._orgclientx;
        }
    };
    //==============================================================================
    // nexacro.MouseWheelEventInfo
    //==============================================================================
    nexacro.MouseWheelEventInfo = function (obj, id, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, delta, from_comp, from_refer_comp, meta_key)
    {
        this.id = this.eventid = id || "onmousewheel";

        this.bubbles = true;
        this.cancelable = true;

        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;
        this.altkey = alt_key || false;
        this.ctrlkey = ctrl_key || false;
        this.button = button || "";
        this.shiftkey = shift_key || false;
        this.metakey = meta_key || false;
        this.screenx = screenX || -1;
        this.screeny = screenY || -1;
        this.canvasx = canvasX || -1;
        this.canvasy = canvasY || -1;
        this.clientx = clientX || -1;
        this.clienty = clientY || -1;
        this.amount = delta;
    };
    var _pMouseWheelEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.MouseWheelEventInfo);
    nexacro.MouseWheelEventInfo.prototype = _pMouseWheelEventInfo;
    _pMouseWheelEventInfo._type_name = "MouseWheelEventInfo";

    _pMouseWheelEventInfo._xposConvertToRtl = function (obj, from_refer_comp)
    {
        if (obj && obj._isRtl && obj._isRtl())
        {
            this._orgcanvasx = this.canvasx;
            this._orgclientx = this.clientx;
            this.canvasx = nexacro._getRTLCanvasXForMouseEvent(obj, from_refer_comp, this.canvasx);
            this.clientx = obj._getClientXY(this.canvasx, this.canvasy)[0];

            return true;
        }
        return false;
    };

    _pMouseWheelEventInfo._xposConvertToLtr = function (obj)
    {
        if (obj && obj._isRtl && obj._isRtl())
        {
            this.canvasx = this._orgcanvasx;
            this.clientx = this._orgclientx;

            delete this._orgcanvas;
            delete this._orgclientx;
        }
    };
    //==============================================================================
    // nexacro.ScrollEventInfo
    //==============================================================================
    nexacro.ScrollEventInfo = function (obj, id, pos, type, from_comp, from_refer_comp)
    {
        this.id = this.eventid = id || "onscroll";
        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;

        this.pos = pos;
        this.type = type;
    };
    var _pScrollEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ScrollEventInfo);
    nexacro.ScrollEventInfo.prototype = _pScrollEventInfo;
    _pScrollEventInfo._type_name = "ScrollEventInfo";


    //==============================================================================
    // nexacro.DragEventInfo
    //==============================================================================
    nexacro.DragEventInfo = function (obj, id, dragdata, userdata, datatype, filelist, src_comp, src_refer_comp, from_comp, from_refer_comp,
        button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, meta_key)
    {
        this.id = this.eventid = id || "ondrag";
        if (!from_refer_comp) from_refer_comp = from_comp;

        this.cancelable = true;
        this.bubbles = true;

        this._p_dragdata = dragdata;
        this._p_userdata = userdata;
        this.datatype = datatype;
        this.filelist = filelist;
        this.sourceobject = src_comp;
        this.sourcereferenceobject = src_refer_comp;
        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;
        this.altkey = alt_key || false;
        this.ctrlkey = ctrl_key || false;
        this.button = button || "";
        this.shiftkey = shift_key || false;
        this.metakey = meta_key || false;
        this.screenx = screenX || -1;
        this.screeny = screenY || -1;
        this.canvasx = canvasX || -1;
        this.canvasy = canvasY || -1;
        this.clientx = clientX || -1;
        this.clienty = clientY || -1;
    };

    var _pDragEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.DragEventInfo);
    nexacro.DragEventInfo.prototype = _pDragEventInfo;
    _pDragEventInfo._type_name = "DragEventInfo";

    _pDragEventInfo._xposConvertToRtl = function (obj, from_refer_comp)
    {
        if (obj && obj._isRtl && obj._isRtl())
        {
            this._orgcanvasx = this.canvasx;
            this._orgclientx = this.clientx;
            this.canvasx = nexacro._getRTLCanvasXForMouseEvent(obj, from_refer_comp, this.canvasx);
            this.clientx = obj._getClientXY(this.canvasx, this.canvasy)[0];

            return true;
        }
        return false;
    };

    _pDragEventInfo._xposConvertToLtr = function (obj)
    {
        if (obj && obj._isRtl && obj._isRtl())
        {
            this.canvasx = this._orgcanvasx;
            this.clientx = this._orgclientx;

            delete this._orgcanvas;
            delete this._orgclientx;
        }
    };

    _pDragEventInfo.set_dragdata = function (v)
    {
        if (this._p_dragdata != v)
            this._p_dragdata = v;
    };
    _pDragEventInfo.set_userdata = function (v)
    {
        if (this._p_userdata != v)
            this._p_userdata = v;
    };

    _pDragEventInfo._properties = [{ name: "dragdata" }, { name: "userdata" }];
    nexacro._defineProperties(_pDragEventInfo, _pDragEventInfo._properties);

    //==============================================================================
    // nexacro.DragDataObject
    //==============================================================================
    nexacro.DragDataObject = function (id)
    {
        this.id = id || "dragdataobject";

        this._data_table = {};
    };

    var _pDragDataObject = nexacro._createPrototype(nexacro.Object, nexacro.DragDataObject);
    nexacro.DragDataObject.prototype = _pDragDataObject;
    _pDragDataObject._type_name = "DragDataObject";

    _pDragDataObject.setData = function (type, value)
    {
        if (this._data_table[type])
            delete this._data_table[type];

        this._data_table[type] = value;
    };

    _pDragDataObject.getData = function (type)
    {
        if (this._data_table[type])
            return this._data_table[type];

        return null;
    };

    _pDragDataObject.isAvailableData = function (type)
    {
        if (this._data_table[type])
            return true;

        return false;
    };

    //==============================================================================
    // nexacro.GestureEventInfo
    //==============================================================================

    // GestureEventInfo (Touch Gesture BaseObject)
    nexacro.GestureEventInfo = function (obj, id, pointinfos, from_comp, from_refer_comp)
    {
        this.id = this.eventid = id || "ongesture";

        this.bubbles = true;

        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;
        this.pointinfos = pointinfos;
        this.pointcount = pointinfos ? pointinfos.length : 0;
    };
    var _pGestureEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.GestureEventInfo);
    nexacro.GestureEventInfo.prototype = _pGestureEventInfo;
    _pGestureEventInfo._type_name = "GestureEventInfo";

    // TapEventInfo
    nexacro.TapEventInfo = function (obj, id, pointinfos, from_comp, from_refer_comp)
    {
        this.id = this.eventid = id || "ontap";
        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;
        this.pointinfos = pointinfos;
        this.pointcount = pointinfos ? pointinfos.length : 0;
    };
    var _pTapEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.TapEventInfo);
    nexacro.TapEventInfo.prototype = _pTapEventInfo;
    _pTapEventInfo._type_name = "TapEventInfo";

    // LongPressEventInfo
    nexacro.LongPressEventInfo = function (obj, id, pointinfos, from_comp, from_refer_comp)
    {
        this.id = this.eventid = id || "onlongpress";
        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;
        this.pointinfos = pointinfos;
        this.pointcount = pointinfos ? pointinfos.length : 0;

        this.cancelable = true;
        this.bubbles = true;
    };
    var _pLongPressEventInfo = nexacro._createPrototype(nexacro.GestureEventInfo, nexacro.LongPressEventInfo);
    nexacro.LongPressEventInfo.prototype = _pLongPressEventInfo;
    _pLongPressEventInfo._type_name = "LongPressEventInfo";

    // SlideEventInfo
    nexacro.SlideEventInfo = function (obj, id, pointinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        this.id = this.eventid = id || "onslide";
        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;
        this.pointinfos = pointinfos;
        this.pointcount = pointinfos ? pointinfos.length : 0;
        this.xaccvalue = xaccvalue;
        this.yaccvalue = yaccvalue;
        this.xdeltavalue = xdeltavalue;
        this.ydeltavalue = ydeltavalue;

        this.cancelable = true;
        this.bubbles = true;
    };
    var _pSlideEventInfo = nexacro._createPrototype(nexacro.GestureEventInfo, nexacro.SlideEventInfo);
    nexacro.SlideEventInfo.prototype = _pSlideEventInfo;
    _pSlideEventInfo._type_name = "SlideEventInfo";

    // PinchEventInfo
    nexacro.PinchEventInfo = function (obj, id, pointinfos, accvalue, deltavalue, from_comp, from_refer_comp)
    {
        this.id = this.eventid = id || "onpinch";
        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;
        this.pointinfos = pointinfos;
        this.pointcount = pointinfos ? pointinfos.length : 0;
        this.accvalue = accvalue;
        this.deltavalue = deltavalue;

        this.cancelable = true;
        this.bubbles = true;
    };
    var _pPinchEventInfo = nexacro._createPrototype(nexacro.GestureEventInfo, nexacro.PinchEventInfo);
    nexacro.PinchEventInfo.prototype = _pPinchEventInfo;
    _pPinchEventInfo._type_name = "PinchEventInfo";

    // FlingEventInfo
    nexacro.FlingEventInfo = function (obj, id, pointinfos, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp)
    {
        this.id = this.eventid = id || "onfling";
        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;

        this.pointcount = touchlen;
        this.xstartvalue = xstartvalue;
        this.ystartvalue = ystartvalue;
        this.xdeltavalue = xdeltavalue;
        this.ydeltavalue = ydeltavalue;

        this.cancelable = true;
        this.bubbles = true;
    };
    var _pFlingEventInfo = nexacro._createPrototype(nexacro.GestureEventInfo, nexacro.FlingEventInfo);
    nexacro.FlingEventInfo.prototype = _pFlingEventInfo;
    _pFlingEventInfo._type_name = "FlingEventInfo";

    // ZoomEventInfo
    nexacro.ZoomEventInfo = function (obj, id, zoomfactor, from_comp, from_refer_comp)
    {
        this.id = this.eventid = id || "onzoom";
        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;
        this.zoom = zoomfactor;
    };
    var _pZoomEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ZoomEventInfo);
    nexacro.ZoomEventInfo.prototype = _pZoomEventInfo;
    _pZoomEventInfo._type_name = "ZoomEventInfo";

    // OrientationChangeEventInfo
    nexacro.OrientationChangeEventInfo = function (obj, id, orientation)
    {
        this.id = this.eventid = id || "onzoom";
        this.fromobject = null;
        this.fromreferenceobject = null;
        this._orientation = orientation;
        if (orientation === 0 || orientation == 1)
            this.orientation = "portrait";
        else if (orientation == 2 || orientation == 3)
            this.orientation = "landscape";
        else
            this.orientation = "";
    };
    var _pOrientationChangeEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.OrientationChangeEventInfo);
    nexacro.OrientationChangeEventInfo.prototype = _pOrientationChangeEventInfo;
    _pOrientationChangeEventInfo._type_name = "OrientationChangeEventInfo";

    // ContextMenuEventInfo
    nexacro.ContextMenuEventInfo = function (obj, id, from_comp, from_refer_comp, button, altkey, ctrlkey, shiftkey, screenx, screeny, canvasx, canvasy, clientx, clienty, metakey)
    {
        this.id = this.eventid = id || "oncontextmenu";
        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;
        this.cancelable = true;
        this.button = button || "";
        this.altkey = altkey || false;
        this.ctrlkey = ctrlkey || false;
        this.shiftkey = shiftkey || false;
        this.screenx = screenx || -1;
        this.screeny = screeny || -1;
        this.canvasx = canvasx || -1;
        this.canvasy = canvasy || -1;
        this.clientx = clientx || -1;
        this.clienty = clienty || -1;
        this.metakey = metakey || false;
    };
    var _pContextMenuEventInfo = nexacro._createPrototype(nexacro.MouseEventInfo, nexacro.ContextMenuEventInfo);
    nexacro.ContextMenuEventInfo.prototype = _pContextMenuEventInfo;
    _pContextMenuEventInfo._type_name = "ContextMenuEventInfo";

    //===============================================================
    // nexacro.ExtendedCommandEventInfo
    //===============================================================
    nexacro.ExtendedCommandEventInfo = function (obj, id, deviceid, eventtype, data) 
    {
        this.id = this.eventid = id || "onextendedcommand";
        this.fromobject = this.fromreferenceobject = obj;

        this.deviceid = deviceid;
        this.eventtype = eventtype;
        this.data = data;
    }

    var _pExtendedCommandEventInfo = nexacro._createPrototype(nexacro.EventInfo, nexacro.ExtendedCommandEventInfo);
    nexacro.ExtendedCommandEventInfo.prototype = _pExtendedCommandEventInfo;
    _pExtendedCommandEventInfo._type_name = "ExtendedCommandEventInfo";

    //===============================================================
    // nexacro.ExtendedCommandErrorEventInfo
    //===============================================================
    nexacro.ExtendedCommandErrorEventInfo = function (obj, id, deviceid, eventtype, data) 
    {
        this.id = this.eventid = id || "onextendederrorcommand";
        this.fromobject = this.fromreferenceobject = obj;

        this.deviceid = deviceid;
        this.eventtype = eventtype;
        this.data = data;
    }

    var _pExtendedCommandErrorEventInfo = nexacro._createPrototype(nexacro.EventInfo, nexacro.ExtendedCommandErrorEventInfo);
    nexacro.ExtendedCommandErrorEventInfo.prototype = _pExtendedCommandErrorEventInfo;
    _pExtendedCommandErrorEventInfo._type_name = "ExtendedCommandErrorEventInfo";

    //==============================================================================
    // nexacro.TouchEventInfo
    //==============================================================================
    nexacro.TouchInputInfo = function (elem, type, touchid, time, is_first, screenX, screenY, windowX, windowY)
    {
        this.touchid = touchid;
        this.type = this._TOUCH_TYPES[type];
        this.time = time;
        this.isfirst = is_first;
        this.screenx = screenX;
        this.screeny = screenY;
        this.canvasx = undefined;
        this.canvasy = undefined;
        this.clientx = undefined;
        this.clienty = undefined;

        // internal variables
        this._elem = elem;
        this._current_state = type;
        this._x = this._oldx = this._startx = windowX;
        this._y = this._oldy = this._starty = windowY;
    };
    var _pTouchInputInfo = nexacro._createPrototype(nexacro.Object, nexacro.TouchInputInfo);
    nexacro.TouchInputInfo.prototype = _pTouchInputInfo;
    _pTouchInputInfo._type_name = "TouchInputInfo";

    _pTouchInputInfo._TOUCH_TYPES = { touchstart: 0, touchmove: 1, touchend: 2 };
    _pTouchInputInfo._updateInfo = function (elem, type, time, screenX, screenY, windowX, windowY)
    {
        this.type = this._TOUCH_TYPES[type];
        this.time = time;
        this.screenx = screenX;
        this.screeny = screenY;

        // internal variables
        this._elem = elem;
        this._current_state = type;
        this._oldx = this._x;
        this._oldy = this._y;
        this._x = windowX;
        this._y = windowY;
    };


    nexacro.TouchEventInfo = function (obj, id, touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {
        nexacro.Event.call(this, obj, id || "ontouch");

        this.cancelable = true;
        this.bubbles = true;

        this.touchinputinfos = touchinfos;
        this.changedtouchinputinfos = changedtouchinfos;
        this.fromobject = from_comp;
        this.fromreferenceobject = from_refer_comp;
    };
    var _pTouchEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.TouchEventInfo);
    nexacro.TouchEventInfo.prototype = _pTouchEventInfo;
    _pTouchEventInfo._type_name = "TouchEventInfo";


    //==============================================================================
    // nexacro.Touch
    //==============================================================================
    nexacro.Touch = function (id, type, time, target, changed, windowX, windowY, screenX, screenY, canvasX, canvasY, clientX, clientY)
    {
        this.touchid = id;
        this.type = nexacro.Touch._TOUCH_TYPES[type];
        this.time = time;
        this.target = target;
        this.changed = changed;
        this.windowx = windowX;
        this.windowy = windowY;
        this.screenx = screenX;
        this.screeny = screenY;
        this.canvasx = canvasX;
        this.canvasy = canvasY;
        this.clientx = clientX;
        this.clienty = clientY;
    };
    var _pTouch = nexacro._createPrototype(nexacro.Object, nexacro.Touch);
    nexacro.Touch.prototype = _pTouch;
    _pTouch._type_name = "Touch";

    _pTouch.isfirst = undefined;

    nexacro.Touch._DIRECTION_NONE = 1;
    nexacro.Touch._DIRECTION_LEFT = 2;
    nexacro.Touch._DIRECTION_RIGHT = 4;
    nexacro.Touch._DIRECTION_UP = 8;
    nexacro.Touch._DIRECTION_DOWN = 16;
    nexacro.Touch._DIRECTION_HORZ = nexacro.Touch._DIRECTION_LEFT | nexacro.Touch._DIRECTION_RIGHT;
    nexacro.Touch._DIRECTION_VERT = nexacro.Touch._DIRECTION_UP | nexacro.Touch._DIRECTION_DOWN;
    nexacro.Touch._DIRECTION_ALL = nexacro.Touch._DIRECTION_HORZ | nexacro.Touch._DIRECTION_VERT;
    nexacro.Touch._DIRECTIONS = {
        NONE: nexacro.Touch._DIRECTION_NONE,
        LEFT: nexacro.Touch._DIRECTION_LEFT,
        RIGHT: nexacro.Touch._DIRECTION_RIGHT,
        UP: nexacro.Touch._DIRECTION_UP,
        DOWN: nexacro.Touch._DIRECTION_DOWN,
        HORZ: nexacro.Touch._DIRECTION_HORZ,
        VERT: nexacro.Touch._DIRECTION_VERT,
        ALL: nexacro.Touch._DIRECTION_ALL
    };

    nexacro.Touch._TOUCH_START = 0;
    nexacro.Touch._TOUCH_MOVE = 1;
    nexacro.Touch._TOUCH_END = 2;
    nexacro.Touch._TOUCH_CANCEL = 3;
    nexacro.Touch._TOUCH_TYPES = {
        touchstart: nexacro.Touch._TOUCH_START,
        touchmove: nexacro.Touch._TOUCH_MOVE,
        touchend: nexacro.Touch._TOUCH_END,
        touchcancel: nexacro.Touch._TOUCH_CANCEL
    };

    _pTouch = null;

    //==============================================================================
    // nexacro.TouchInput
    //==============================================================================
    nexacro.TouchInput = function (elem, evtType, time)
    {
        this.type = nexacro.Touch._TOUCH_TYPES[evtType];
        this.time = time;
        this.target = elem;

        this.touches = [];
        this.changedTouches = [];
    };
    var _pTouchInput = nexacro._createPrototype(nexacro.Object, nexacro.TouchInput);
    nexacro.TouchInput.prototype = _pTouchInput;
    _pTouchInput._type_name = "TouchInput";

    _pTouchInput.touches = null;
    _pTouchInput.changedTouches = null;

    _pTouchInput.isFirst = false;
    _pTouchInput.isLast = false;
    _pTouchInput.prevented = false;

    _pTouchInput.computedData = null;

    _pTouchInput.addTouchInfo = function (touch)
    {
        if (!touch || touch.touchid === undefined)
            return null;

        this.touches.push(touch);
        if (touch.changed)
        {
            this.changedTouches.push(touch);
        }

        var touch_len = this.touches.length, change_len = this.changedTouches.length;
        this.isFirst = (this.type == 0 && touch_len == change_len);
        this.isLast = (this.type >= 2 && touch_len == change_len);
        return touch;
    };

    /*_pTouchInput.addTouchInfo = function (id, time, target, changed, windowX, windowY, screenX, screenY, canvasX, canvasY, clientX, clientY, isFirst)
    {
        if (id === undefined)
            return null;
 
        var touch = {
            id: id, time: time, target: target, isFirst: isFirst,
            windowX: windowX, windowY: windowY, screenX: screenX, screenY: screenY,
            canvasX: canvasX, canvasY: canvasY, clientX: clientX, clientY: clientY
        };
        this.touches.push(touch);
 
        if (changed)
        {
            this.changedTouches.push(touch);
        }
 
        var touch_len = this.touches.length, change_len = this.changedTouches.length;
        this.isFirst = (this.type == 1 && touch_len == change_len);
        this.isLast = (this.type > 2 && touch_len == change_len);
 
        return touch;
    };*/

    _pTouchInput.preventAction = function ()
    {
        this.prevented = true;
    };

    //==============================================================================
    // nexacro.TouchSession
    //==============================================================================
    // detectors = ['tap', ....]
    nexacro.TouchSession = function (manager, win, elem, prev_session, detectors)
    {
        this._start_win = win;
        this._start_elem = elem;
        this._manager = manager;

        this.DIRECTIONS = nexacro.Touch._DIRECTIONS;

        if (prev_session && prev_session._cur_session_action_type)
        {
            this._prev_session_action_type = prev_session._cur_session_action_type;
            this._prev_session_action_data = prev_session._cur_data;
        }

        this._detectors = [];
        if (!detectors)
        {
            detectors = nexacro.TouchSession._default_gesture_detectors;
        }

        var detector, detector_cnt = detectors ? detectors.length : 0;
        for (var i = 0; i < detector_cnt; i++)
        {
            detector = nexacro.TouchAction._getGestureDetector(detectors[i]);
            if (detector)
            {
                this._detectors.push(detector);
            }
        }
        this._applyCurrentZoomInfo();
    };
    var _pTouchSession = nexacro._createPrototype(nexacro.Object, nexacro.TouchSession);
    nexacro.TouchSession.prototype = _pTouchSession;
    _pTouchSession._type_name = "TouchSession";

    _pTouchSession._scale = 1;
    _pTouchSession._start_win = null;
    _pTouchSession._start_elem = null;
    _pTouchSession._cur_elem = null;
    _pTouchSession._manager = null;
    _pTouchSession._last_evttype = 0;

    _pTouchSession._detectors = null;
    _pTouchSession._cur_detector = null;
    _pTouchSession._cur_input = null;

    // action_data {
    //  == self info ==
    //  time, centerX, centerY, touchPointers, spacing
    //  == overall(current - first) info ==
    //  scale, direction, distanceX, distanceY, distance, leadTime,
    //  velocityX, velocityY, velocity, accDeltaSpacing,
    //  == delta(current - previous) info ==
    //  deltaDirection, deltaDistanceX, deltaDistanceY, deltaDistance, deltaTime,
    //  deltaVelocityX, deltaVelocityY, deltaVelocity, deltaSpacing
    // }
    _pTouchSession._cur_data = null;
    _pTouchSession._first_data = null;
    _pTouchSession._prev_data = null;
    _pTouchSession._offset_data = null;
    _pTouchSession._prev_velocity_data = null;

    _pTouchSession._cur_session_action_type = "";       // for dbltap, fling
    _pTouchSession._cur_session_action_status = "";       // for fling

    _pTouchSession._prev_session_action_type = "";       // for dbltap
    _pTouchSession._prev_session_action_data = "";       // for dbltap

    _pTouchSession._max_touch_pointers = 0;             // for swipe

    _pTouchSession._first_pointer_spacing = -1;          // for pinch scale
    _pTouchSession._first_touch_id = undefined;

    _pTouchSession.opt_interval = 50;
    _pTouchSession._velocity_adjust_ratio = 1;

    //nexacro.TouchSession._default_gesture_detectors = ['slide', 'pinch', 'longpress', 'tap'];
    nexacro.TouchSession._default_gesture_detectors = ['longpress', 'slide', 'tap'];


    _pTouchSession.destroy = function ()
    {
        this.stop();
        this._detectors = null;
    };

    _pTouchSession.stop = function ()
    {
        var detectors = this._detectors;
        var cnt = detectors.length;
        for (var i = 0; i < cnt; i++)
        {
            var detector = detectors[i];
            if (detector)
            {
                detector.reset();
            }
        }
    };

    _pTouchSession.update = function (elem, input)
    {
        this._cur_elem = elem;
        this._cur_input = input;
    };

    _pTouchSession.init = function (win, elem)
    {
        this._start_win = win;
        this._start_elem = elem;
        this._cur_elem = null;
        this._manager = null;
        this._last_evttype = 0;
        this._cur_input = null;

        this._cur_data = null;
        this._first_data = null;
        this._prev_data = null;
        this._offset_data = null;
        this._prev_velocity_data = null;
        this._first_pointer_spacing = -1;

        this._first_touch_id = undefined;
        this._velocity_adjust_ratio = 1;
    };

    _pTouchSession.getActionData = function ()
    {
        return this._cur_data;
    };

    _pTouchSession.getFirstTouchId = function ()
    {
        return this._first_touch_id;
    };

    _pTouchSession.detectGesture = function ()
    {
        var detectors = this._detectors;
        var cnt = detectors.length;
        for (var i = 0; i < cnt; i++)
        {
            var detector = detectors[i];
            if (detector)
            {
                if (!this._cur_detector || this._cur_detector == detector)
                {
                    detector.detect(this._last_evttype, this);
                }
                else
                {
                    detector.reset();
                }

                if (!this._cur_detector && detector._isStarted())
                {
                    this._cur_detector = detector;
                }
            }
        }
    };

    _pTouchSession.cancelGesture = function ()
    {
        if (this._cur_detector)
        {
            this._cur_detector.cancel();
            this._cur_detector = null;
            return;
        }
        var detectors = this._detectors;
        var cnt = detectors.length;
        for (var i = 0; i < cnt; i++)
        {
            var detector = detectors[i];
            if (detector)
            {
                detector.cancel();
            }
        }
    };

    _pTouchSession.ontouch = function (elem, input)
    {
        if (!elem || !input)
            return;

        var type = input.type, isFirst = input.isFirst;
        if (type == nexacro.Touch._TOUCH_START && (!this._start_elem || isFirst))
        {
            this._start_elem = elem;
            this._first_touch_id = input.touches[0].id;
            this._cur_data = null;
            this._first_data = null;
            this._prev_data = null;
            this._offset_data = null;
            this._prev_velocity_data = null;
            this._first_pointer_spacing = -1;

            this._velocity_adjust_ratio = nexacro._touch_velocity_adjust_ratio;
        }

        this._cur_elem = elem;
        this._cur_input = input;
        this._prev_data = this._cur_data;

        if ((this._cur_data = this.calcActionData(input)))
        {
            if (type == nexacro.Touch._TOUCH_START && isFirst)
                this._first_data = this._cur_data;
        }
        this._last_evttype = type;

        this.detectGesture();
    };

    _pTouchSession.ontouchcancel = function (elem, input)
    {
        if (!elem || !input)
            return;

        var type = input.type;
        this._cur_elem = elem;
        this._cur_input = input;
        this._prev_data = this._cur_data;
        this._cur_data = this.calcActionData(input);

        this._last_evttype = type;

        this.cancelGesture();

        this._cur_data = null;
    };

    _pTouchSession.getCurActionType = function ()
    {
        return this._cur_session_action_type;
    };

    _pTouchSession.isStarted = function ()
    {
        if (this._cur_detector)
        {
            return this._cur_detector._isStarted();
        }

        return (this._cur_session_action_status == nexacro.TouchAction._STATUS_START ||
            this._cur_session_action_status == nexacro.TouchAction._STATUS_PENDING);
    };

    _pTouchSession.onaction = function (name, status, data)
    {
        var manager = this._manager;
        var elem = this._cur_elem;
        var touches = this._cur_input.touches;
        var changedTouches = this._cur_input.changedTouches;

        //var prev_type = this._cur_session_action_type;
        this._cur_session_action_type = name;
        this._cur_session_action_status = status;

        if (status == nexacro.TouchAction._STATUS_CANCEL)
        {
            if (manager && manager.onactioncanceled)
            {
                manager.onactioncanceled(elem, data, touches, changedTouches);
            }
            return;
        }
        if (name == "slide")
        {
            switch (status)
            {
                case nexacro.TouchAction._STATUS_START:
                    {
                        //trace("slide start: distance(" + (-data.distanceX) + "," + (-data.distanceY) + "), delta(" + (-data.deltaDistanceX) + "," + (-data.deltaDistanceY) + ")");
                        if (manager && manager.onslidestart)
                        {
                            manager.onslidestart(elem, data, touches, changedTouches);
                        }
                    }
                    break;
                case nexacro.TouchAction._STATUS_PENDING:
                    {
                        //trace("slide: distance(" + (-data.distanceX) + "," + (-data.distanceY) + "), delta(" + (-data.deltaDistanceX) + "," + (-data.deltaDistanceY) + ")");
                        if (manager && manager.onslide)
                        {
                            manager.onslide(elem, data, touches, changedTouches);
                        }
                    }
                    break;
                case nexacro.TouchAction._STATUS_END:
                    {
                        //trace("slide end: distance(" + (-data.distanceX) + "," + (-data.distanceY) + "), delta(" + (-data.deltaDistanceX) + "," + (-data.deltaDistanceY) + ")");
                        if (manager && manager.onslideend)
                        {
                            manager.onslideend(elem, data, touches, changedTouches);
                        }
                    }
                    break;
            }
        }
        else if (name == "pinch") //Currently, doesn't support pinch
        {
            /*
            switch (status)
            {
                case nexacro.TouchAction._STATUS_START:
                    {
                        //trace("pinch start: scale(" + data.scale + "), center(" + data.centerX + "," + data.centerY + ")");
                        if (manager && manager.onpinchstart)
                        {
                            manager.onpinchstart(elem, data, touches, changedTouches);
                        }
                    }
                    break;
                case nexacro.TouchAction._STATUS_PENDING:
                    {
                        //trace("pinch: scale(" + data.scale + "), center(" + data.centerX + "," + data.centerY + ")");
                        if (manager && manager.onpinch)
                        {
                            manager.onpinch(elem, data, touches, changedTouches);
                        }
                    }
                    break;
                case nexacro.TouchAction._STATUS_END:
                    {
                        //trace("pinch end: scale(" + data.scale + "), center(" + data.centerX + "," + data.centerY + ")");
                        if (manager && manager.onpinchend)
                        {
                            manager.onpinchend(elem, data, touches, changedTouches);
                        }
                    }
                    break;
            }
            */
        }
        else if (name == "longpress")
        {
            switch (status)
            {
                case nexacro.TouchAction._STATUS_START:
                    {
                        //trace("longpress: hold");
                        if (manager && manager.onlongpress)
                        {
                            manager.onlongpress(elem, data, touches, changedTouches);
                        }
                    }
                    break;
                case nexacro.TouchAction._STATUS_END:
                    {
                        //trace("longpress: up");
                        if (manager && manager.onlongpressup)
                        {
                            manager.onlongpressup(elem, data, touches, changedTouches);
                        }
                    }
                    break;
            }
        }
        else if (name == "tap")
        {
            //trace("tap: " + elem.name);

            if (manager && manager.ontap)
            {
                manager.ontap(elem, data, touches, changedTouches);
            }
        }
        else if (name == "dbltap")
        {
            //trace("dbltap: " + elem.name);

            if (manager && manager.ondbltap)
            {
                manager.ondbltap(elem, data, touches, changedTouches);
            }
        }
        else if (name == "fling")
        {
            switch (status)
            {
                case nexacro.TouchAction._STATUS_START:
                    {
                        //trace("fling start: delta(" + data.deltaDistanceX + "," + data.deltaDistanceY + ")");
                        if (manager && manager.onflingstart)
                        {
                            //var start = Date.now();
                            manager.onflingstart(elem, data, touches, changedTouches);
                            //trace("fling start: time(" + (Date.now() - start) + ", delta(" + data.deltaDistanceX + "," + data.deltaDistanceY + ")");
                        }
                    }
                    break;

                case nexacro.TouchAction._STATUS_PENDING:
                    {
                        //trace("fling: delta(" + data.deltaDistanceX + "," + data.deltaDistanceY + ")");
                        if (manager && manager.onfling)
                        {
                            //var start = Date.now();
                            manager.onfling(elem, data, touches, changedTouches);
                            //trace("fling: time(" + (Date.now() - start) + ", delta(" + data.deltaDistanceX + "," + data.deltaDistanceY + ")");
                        }
                    }
                    break;
                case nexacro.TouchAction._STATUS_END:
                    {
                        //trace("fling end: delta(" + data.deltaDistanceX + "," + data.deltaDistanceY + ")");
                        if (manager && manager.onflingend)
                        {
                            //var start = Date.now();
                            manager.onflingend(elem, data, touches, changedTouches);
                            //trace("fling end: time(" + (Date.now() - start) + ", delta(" + data.deltaDistanceX + "," + data.deltaDistanceY + ")");
                        }
                    }
                    break;
            }
        }
    };

    _pTouchSession.calcActionData = function (input)
    {
        if (!input)
            return null;

        var type = input.type;
        var touches = input.touches;
        var pointers = touches.length;

        var computed_data =
        {
            time: input.time, centerX: 0, centerY: 0, touchPointers: pointers, spacing: 0,
            scale: 1, direction: 0, distanceX: 0, distanceY: 0, distance: 0, leadTime: 0,
            velocityX: 0, velocityY: 0, velocity: 0, accDeltaSpacing: 0,
            deltaDirection: 0, deltaDistanceX: 0, deltaDistanceY: 0, deltaDistance: 0, deltaTime: 0,
            deltaVelocityX: 0, deltaVelocityY: 0, deltaVelocity: 0, deltaSpacing: 0
        };

        // calulate self info
        var first_data = this._first_data;
        var center = this.getCenter(touches);

        var spacing = 0;
        if (pointers == 1)
        {
            this._first_pointer_spacing = -1;
        }
        else
        {
            var windowX, windowY, windowMaxX = 0, windowMinX = touches[0].windowx, windowMaxY = 0, windowMinY = touches[0].windowy;
            for (var i = 0; i < pointers; i++)
            {
                windowX = touches[i].windowx;
                windowY = touches[i].windowy;

                windowMaxX = Math.max(windowMaxX, windowX);
                windowMinX = Math.min(windowMinX, windowX);

                windowMaxY = Math.max(windowMaxY, windowY);
                windowMinY = Math.min(windowMinY, windowX);
            }
            var spacingX = Math.abs(windowMaxX - windowMinX);
            var spacingY = Math.abs(windowMaxY - windowMinY);
            spacing = this.getDistance(spacingX, spacingY);
            if (this._first_pointer_spacing < 0)
                this._first_pointer_spacing = spacing;
        }

        computed_data.centerX = center.x;
        computed_data.centerY = center.y;
        computed_data.spacing = spacing;


        // calulate overall info
        var scale = 1, direction = 0, distanceX = 0, distanceY = 0, distance = 0, leadTime = 0,
            velocityX = 0, velocityY = 0, velocity = 0, accDeltaSpacing = 0;
        if (first_data)
        {
            distanceX = center.x - first_data.centerX;
            distanceY = center.y - first_data.centerY;
            distance = this.getDistance(distanceX, distanceY);

            leadTime = input.time - first_data.time;
        }

        // if touch pointer count is changed
        var offset_data = this._offset_data, prev_data = this._prev_data;
        if (!offset_data || !prev_data || pointers != prev_data.touchPointers)
        {
            var oDistanceX = 0, oDistanceY = 0;
            if (prev_data)
            {
                oDistanceX = prev_data.distanceX;
                oDistanceY = prev_data.distanceY;
            }
            offset_data = this._offset_data = { centerX: center.x, centerY: center.y, distanceX: oDistanceX, distanceY: oDistanceY };
        }
        distanceX = offset_data.distanceX + (center.x - offset_data.centerX);
        distanceY = offset_data.distanceY + (center.y - offset_data.centerY);
        direction = this.getDirection(distanceX, distanceY);

        if (pointers > 1)
        {
            scale = spacing / this._first_pointer_spacing;
            accDeltaSpacing = spacing - this._first_pointer_spacing;
        }


        var v = this.getVelocity(leadTime, distanceX, distanceY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (Math.abs(v.x) > Math.abs(v.y)) ? v.x : v.y;

        computed_data.scale = scale;
        computed_data.accDeltaSpacing = accDeltaSpacing;
        computed_data.direction = direction;
        computed_data.distanceX = distanceX;
        computed_data.distanceY = distanceY;
        computed_data.distance = distance;
        computed_data.leadTime = leadTime;
        computed_data.velocityX = velocityX;
        computed_data.velocityY = velocityY;
        computed_data.velocity = velocity;


        // calulate delta info
        var deltaDirection = 0, deltaDistanceX = 0, deltaDistanceY = 0, deltaDistance = 0, deltaTime = 0,
            deltaVelocityX = 0, deltaVelocityY = 0, deltaVelocity = 0, deltaSpacing = 0;
        if (prev_data)
        {
            deltaDistanceX = center.x - prev_data.centerX;
            deltaDistanceY = center.y - prev_data.centerY;
            deltaDistance = this.getDistance(deltaDistanceX, deltaDistanceY);
            deltaDirection = this.getDirection(deltaDistanceX, deltaDistanceY);

            deltaTime = input.time - prev_data.time;
            deltaSpacing = prev_data.spacing - spacing;
        }

        var velocity_distanceX = 0, velocity_distanceY = 0, velocity_deltaTime = 0;
        var prev_velocity_data = this._prev_velocity_data;
        if (prev_velocity_data)
        {
            velocity_deltaTime = input.time - prev_velocity_data.time;
        }

        if (type != nexacro.Touch._TOUCH_CANCEL &&
            (!prev_velocity_data || velocity_deltaTime > this.opt_interval ||
                (type == nexacro.Touch._TOUCH_END && leadTime <= this.opt_interval)))
        {
            if (prev_velocity_data)
            {
                velocity_distanceX = distanceX - prev_velocity_data.distanceX;
                velocity_distanceY = distanceY - prev_velocity_data.distanceY;

                v = this.getVelocity(velocity_deltaTime, velocity_distanceX, velocity_distanceY);
                deltaVelocityX = v.x;
                deltaVelocityY = v.y;
                deltaVelocity = (Math.abs(v.x) > Math.abs(v.y)) ? v.x : v.y;
            }

            this._prev_velocity_data = computed_data;
        }
        else if (prev_velocity_data)
        {
            deltaVelocity = prev_velocity_data.deltaVelocity;
            deltaVelocityX = prev_velocity_data.deltaVelocityX;
            deltaVelocityY = prev_velocity_data.deltaVelocityY;
        }

        computed_data.deltaSpacing = deltaSpacing;
        computed_data.deltaDistanceX = deltaDistanceX;
        computed_data.deltaDistanceY = deltaDistanceY;
        computed_data.deltaDistance = deltaDistance;
        computed_data.deltaDirection = deltaDirection;
        computed_data.deltaTime = deltaTime;
        computed_data.deltaVelocityX = deltaVelocityX;
        computed_data.deltaVelocityY = deltaVelocityY;
        computed_data.deltaVelocity = deltaVelocity;

        this._max_touch_pointers = Math.max(this._max_touch_pointers, pointers);
        return computed_data;
    };

    _pTouchSession.getCenter = function (touches)
    {
        if (!touches) return null;

        var len = touches.length;
        var touch, pos;
        if (len === 1)
        {
            touch = touches[0];
            pos = nexacro._getPositionFromTouch(touch);
            return { x: Math.round(pos.x), y: Math.round(pos.y) };
        }

        var x = 0, y = 0;
        for (var i = 0; i < len; i++)
        {
            touch = touches[i];
            pos = nexacro._getPositionFromTouch(touch);
            x += pos.x;
            y += pos.y;
        }

        return { x: Math.round(x / len), y: Math.round(y / len) };
    };

    _pTouchSession.getAngle = function (dX, dY)
    {
        return Math.atan2(dY, dX) * 180 / Math.PI;
    };

    _pTouchSession.getDistance = function (dX, dY)
    {
        return Math.sqrt((dX * dX) + (dY * dY));
    };

    _pTouchSession.getDirection = function (dX, dY)
    {
        if (dX === dY)
        {
            return this.DIRECTIONS.NONE;
        }

        if (Math.abs(dX) >= Math.abs(dY))
        {
            return dX < 0 ? this.DIRECTIONS.LEFT : this.DIRECTIONS.RIGHT;
        }
        return dY < 0 ? this.DIRECTIONS.UP : this.DIRECTIONS.DOWN;
    };

    _pTouchSession.getVelocity = function (dT, dX, dY)
    {
        return {
            x: (dX / dT) * this._velocity_adjust_ratio || 0,
            y: (dY / dT) * this._velocity_adjust_ratio || 0
        };
    };

    if (nexacro._Browser != "Runtime")
    {
        _pTouchSession._applyCurrentZoomInfo = function ()
        {
            var default_detectors = nexacro.TouchSession._default_gesture_detectors;
            var detector, detector_cnt = default_detectors ? default_detectors.length : 0;
            var zoomfactor = nexacro._getCurrentZoomfactor();
            var detectors = this._detectors;
            for (var i = 0; i < detector_cnt; i++)
            {
                detector = detectors[i];
                if (detector)
                {
                    detector._on_applyCurrentZoomInfo(zoomfactor);
                }
            }
            this._scale = zoomfactor;
        };
    }
    else
    {
        _pTouchSession._applyCurrentZoomInfo = nexacro._emptyFn;
    }


    //==============================================================================
    // nexacro.TouchAction
    //==============================================================================
    nexacro.TouchAction = function ()
    {
        this.status = nexacro.TouchAction._STATUS_NONE;
    };
    var _pTouchAction = nexacro._createPrototype(nexacro.Object, nexacro.TouchAction);
    nexacro.TouchAction.prototype = _pTouchAction;
    _pTouchAction._type_name = "TouchAction";

    _pTouchAction.type = '';
    _pTouchAction.opt_enable = true;
    _pTouchAction.opt_touches = 1;
    _pTouchAction.opt_mintouches = 1;
    _pTouchAction.opt_accepttypes = 0;    // 0: all, enum(1:start, 2:move, 4:end)

    _pTouchAction._cur_evt_type = 0;
    _pTouchAction._cur_data = null;
    _pTouchAction._cur_session = null;

    // for dbltap
    _pTouchAction._prev_session_action_type = "";
    _pTouchAction._prev_session_action_data = null;

    nexacro.TouchAction._STATUS_NONE = 1;    // ready
    nexacro.TouchAction._STATUS_START = 2;       // start
    nexacro.TouchAction._STATUS_PENDING = 3;     // change
    nexacro.TouchAction._STATUS_END = 4;       // end
    nexacro.TouchAction._STATUS_CANCEL = 5;  // cancel

    nexacro.TouchAction._gesture_detectors = {};
    nexacro.TouchAction._registerGestureDetector = function (name, detector_class)
    {
        this._gesture_detectors[name] = detector_class;
    };
    nexacro.TouchAction._unregisterGestureDetector = function (name)
    {
        var detector_class = this._gesture_detectors[name];
        if (detector_class)
        {
            delete this._gesture_detectors[name];
        }
    };
    nexacro.TouchAction._getGestureDetector = function (name)
    {
        var detector_class = this._gesture_detectors[name];
        if (!detector_class) return null;

        return (new (detector_class)());
    };

    _pTouchAction._checkOption = function ()
    {
        var data = this._cur_data;
        if (!data) return false;

        if (this.opt_touches == 0)
        {
            return data.touchPointers >= this.opt_mintouches;
        }
        else
        {
            return data.touchPointers === this.opt_touches;
        }
    };

    _pTouchAction._resetStatus = function ()
    {
        if (this.status == nexacro.TouchAction._STATUS_END || this.status == nexacro.TouchAction._STATUS_CANCEL)
        {
            this.reset();
            this._setStatus(nexacro.TouchAction._STATUS_NONE);
        }
    };

    _pTouchAction._setStatus = function (status)
    {
        this.status = status;
        var evtType = this._cur_evt_type;

        switch (status)
        {
            case nexacro.TouchAction._STATUS_NONE:
                this.reset();
                break;
            case nexacro.TouchAction._STATUS_START:
                this._on_action(status);
                break;
            case nexacro.TouchAction._STATUS_PENDING:
                if (this.opt_accepttypes == 0 || this.opt_accepttypes & evtType)
                    this._on_action(status);
                break;
            case nexacro.TouchAction._STATUS_END:
                this._on_action(status);
                this.reset();
                break;
            case nexacro.TouchAction._STATUS_CANCEL:
                this._on_cancel();
                this.reset();
                break;
        }
    };

    _pTouchAction._setStart = function ()
    {
        return this._setStatus(nexacro.TouchAction._STATUS_START);
    };
    _pTouchAction._setPending = function ()
    {
        return this._setStatus(nexacro.TouchAction._STATUS_PENDING);
    };
    _pTouchAction._setEnd = function ()
    {
        return this._setStatus(nexacro.TouchAction._STATUS_END);
    };
    _pTouchAction._setCancel = function ()
    {
        return this._setStatus(nexacro.TouchAction._STATUS_CANCEL);
    };

    _pTouchAction._isStarted = function (/*evtType, session*/)
    {
        return (this.status == nexacro.TouchAction._STATUS_START ||
            this.status == nexacro.TouchAction._STATUS_PENDING);
    };

    _pTouchAction._analysysGesture = function ()
    {
        var evtType = this._cur_evt_type;

        var passOption = this._checkOption();
        if (passOption)
        {
            if (evtType == nexacro.Touch._TOUCH_END)
            {
                this._setEnd();
            }
            else if (this._isStarted())
            {
                this._setPending();
            }
            else
            {
                this._setStart();
            }
        }
        else
        {
            if (this._isStarted())
            {
                this._setCancel();
            }
            else
            {
                this.reset();
            }
        }
    };

    _pTouchAction.detect = function (evtType, session)
    {
        if (!session)
            return;

        if (!this.opt_enable)
        {
            this.reset();
            return;
        }

        this._cur_evt_type = evtType;
        this._cur_data = session.getActionData();
        this._cur_session = session;

        if (session._prev_session_action_type)
        {
            this._prev_session_action_type = session._prev_session_action_type;
            this._prev_session_action_data = session._prev_session_action_data;
        }

        this._resetStatus();

        return this._analysysGesture();
    };

    _pTouchAction.cancel = function ()
    {
        if (this.opt_enable && this._isStarted())
        {
            this._setCancel();
        }
        else
        {
            this.reset();
        }
    };

    _pTouchAction.reset = function ()
    {
    };

    _pTouchAction._on_action = function (status)
    {
        //var evtType = this._cur_evt_type;
        var session = this._cur_session;
        if (!session) return;

        var data = this._cur_data;
        if (!data) return;

        session.onaction(this.type, status, data);
    };
    _pTouchAction._on_cancel = function ()
    {
        var session = this._cur_session;
        if (!session) return;

        session.onaction(this.type, nexacro.TouchAction._STATUS_CANCEL, this);
    };

    _pTouchAction._on_applyCurrentZoomInfo = function (zoomfactor)
    {
        //;
    };

    //==============================================================================
    // nexacro.TouchAction_Slide
    //==============================================================================
    nexacro.TouchAction_Slide = function ()
    {
        nexacro.TouchAction.call(this);
        this._target_comp = null;
        this._fling_timing_function = new nexacro._CubicBezier(0, 0, 0.5, 1); //pre value (0.2, 0.15, 0.35, 1)
    };
    var _pTouchActionSlide = nexacro._createPrototype(nexacro.TouchAction, nexacro.TouchAction_Slide);
    nexacro.TouchAction_Slide.prototype = _pTouchActionSlide;
    _pTouchActionSlide._type_name = "TouchAction_Slide";

    nexacro.TouchAction._registerGestureDetector('slide', nexacro.TouchAction_Slide);

    _pTouchActionSlide.type = 'slide';
    _pTouchActionSlide.opt_accepttypes = 0;    // 0: all, enum(1:start, 2:move, 4:end)
    _pTouchActionSlide.opt_touches = 1;
    _pTouchActionSlide.opt_mintouches = 1;
    _pTouchActionSlide.opt_threshold = 9;    //distance 
    _pTouchActionSlide.opt_velocity = 0.3;     // for fling  //at first, 0.15
    _pTouchActionSlide.opt_friction = 0.997;    // for fling //at first, 0.998
    _pTouchActionSlide.opt_fling_threshold = 25;
    _pTouchActionSlide.opt_direction = nexacro.Touch._DIRECTION_ALL;
    _pTouchActionSlide.opt_distance_base = 350;

    // fling handler
    _pTouchActionSlide._is_fling = false;
    _pTouchActionSlide._fling_timing_function = null;
    _pTouchActionSlide._fling_timer = null;

    _pTouchActionSlide._fling_start_time = 0;
    _pTouchActionSlide._fling_duration = 0;
    _pTouchActionSlide._fling_point = null;

    _pTouchActionSlide._on_applyCurrentZoomInfo = function (zoomfactor)
    {
        this.opt_threshold /= zoomfactor;
        this.opt_velocity /= zoomfactor;
        this.opt_distance_base /= zoomfactor;
        this.opt_fling_threshold /= zoomfactor;
    };

    _pTouchActionSlide._checkOption = function ()
    {
        if (!nexacro.TouchAction.prototype._checkOption.call(this))
            return false;

        var evtType = this._cur_evt_type;
        if (this._isStarted())
            return true;
        else if (evtType == nexacro.Touch._TOUCH_END)
            return false;

        var data = this._cur_data;
        if (!data) return false;

        var direction = (data.deltaDirection & this.opt_direction);
        if (!direction)
            return false;
        return data.distance > this.opt_threshold;
    };

    _pTouchActionSlide._checkFlingOption = function (evtType, session)
    {
        if (!nexacro.TouchAction.prototype._checkOption.call(this))
            return false;

        evtType = this._cur_evt_type;
        session = this._cur_session;
        var data = this._cur_data;
        if (!data || evtType != nexacro.Touch._TOUCH_END)
            return false;

        if (session._fling_blocked === true)
            return false;

        var velocity, opt_direction = this.opt_direction;
        if (!opt_direction || !data.deltaDirection || data.distance <= this.opt_fling_threshold)
            return false;

        velocity = data.deltaVelocity;

        return Math.abs(velocity) > this.opt_velocity;
    };
    _pTouchActionSlide._analysysGesture = function ()
    {
        var is_fling = nexacro.TouchAction._STATUS_END && this._checkFlingOption()
        if (is_fling)
            this._cur_data.is_next_fire_fling = is_fling;
        nexacro.TouchAction.prototype._analysysGesture.call(this);
        // check fling
        if (nexacro.TouchAction._STATUS_END && this._checkFlingOption())
        {
            var session = this._cur_session;
            var data = this._cur_data;
            if (!session || !data) return;

            var comp = session._cur_elem;
            while (comp && !comp._is_component)
                comp = comp.parent;

            if (!comp || !comp._is_component)
                return;

            this._target_comp = comp;
            this._on_action_fling(this.status);
        }
    };

    _pTouchActionSlide._on_action_fling = function (/*status*/)
    {
        var session = this._cur_session;
        var data = this._cur_data;
        if (!session || !data) return;

        var comp = this._target_comp;
        if (!comp) return;

        var scroll_comp = comp;
        while (scroll_comp)
        {
            if (scroll_comp._is_scrollable) //_is_spinnable
            {
                if (scroll_comp._fling_cubic_bezier)
                {
                    var timing = scroll_comp._fling_cubic_bezier;
                    this._fling_timing_function = new nexacro._CubicBezier(timing[0], timing[1], timing[2], timing[3]);
                }
                if (scroll_comp._fling_max_distance)
                {
                    this._fling_max_distance = scroll_comp._fling_max_distance;
                }
                break;
            }
            scroll_comp = scroll_comp.parent;
        }

        var maxdistance = data.distance;

        if (this._fling_max_distance)
            maxdistance = Math.min(data.distance, this._fling_max_distance);

        var distance_adjust_ratio = maxdistance / this.opt_distance_base;
        if (distance_adjust_ratio > 1)
            distance_adjust_ratio = 1;

        var durationX = 0, distanceX = 0, velocityX = data.deltaVelocityX;
        if (Math.abs(velocityX) >= this.opt_velocity)
        {
            durationX = Math.log(this.opt_velocity / Math.abs(velocityX)) / Math.log(this.opt_friction);
            distanceX = velocityX * (1 - Math.pow(this.opt_friction, durationX + 1)) / (1 - this.opt_friction);
            distanceX *= distance_adjust_ratio;
        }

        var durationY = 0, distanceY = 0, velocityY = data.deltaVelocityY;
        if (Math.abs(velocityY) >= this.opt_velocity)
        {
            durationY = Math.log(this.opt_velocity / Math.abs(velocityY)) / Math.log(this.opt_friction);
            distanceY = velocityY * (1 - Math.pow(this.opt_friction, durationY + 1)) / (1 - this.opt_friction);
            distanceY *= distance_adjust_ratio;
        }

        data.leadTime = 0;
        data.distanceX = distanceX;
        data.distanceY = distanceY;
        data.deltaDistanceX = 0;
        data.deltaDistanceY = 0;

        var ret;
        // fling start

        this.status = nexacro.TouchAction._STATUS_START;
        ret = session.onaction("fling", nexacro.TouchAction._STATUS_START, data);

        if (ret === false)
        {
            this.reset();
            return;
        }

        this._is_fling = true;
        this._fling_duration = Math.max(durationX, durationY);
        this._fling_point = { x: 0, y: 0 };

        var pthis = this;
        this._fling_timer = new nexacro.AnimationFrame(comp, function () { pthis._on_fling_frame(); });
        this._fling_timer.start();
        this._fling_start_time = (new Date()).getTime();
    };

    _pTouchActionSlide._on_fling_frame = function ()
    {
        var session = this._cur_session;
        var data = this._cur_data;
        if (!session || !data) return;

        var distanceX = data.distanceX;
        var distanceY = data.distanceY;

        // var deltaX = 0, deltaY = 0;
        var timing_function = this._fling_timing_function;

        // Interpolation
        var leadTime = (new Date()).getTime() - this._fling_start_time;
        data.deltaTime = leadTime - data.leadTime;
        data.leadTime = leadTime;

        var duration = this._fling_duration;
        var c = (leadTime / duration);
        if (c < 1)
        {
            this._fling_timer.start();
        }
        // Bezier곡선에서 현재 X에 해당하는 Y값 얻기
        var epsilon = 1.0 / (200 * duration);
        var p1_x = timing_function._p1.x, p2_x = timing_function._p2.x;
        var p1_y = timing_function._p1.y, p2_y = timing_function._p2.y;

        var tx = timing_function._getTForCoordinate(c, p1_x, p2_x, epsilon);
        var cy = timing_function._getCoordinateForT(tx, p1_y, p2_y);

        var prev_point = this._fling_point;
        this._fling_point = { x: tx, y: cy };

        var offset_cy = cy - prev_point.y;
        data.deltaDistanceX = (offset_cy * distanceX);
        data.deltaDistanceY = (offset_cy * distanceY);

        this.status = nexacro.TouchAction._STATUS_PENDING;
        session.onaction("fling", this.status, data);

        if (c >= 1)
        {
            data.deltaDistanceX = 0;
            data.deltaDistanceY = 0;
            this.status = nexacro.TouchAction._STATUS_END;
            session.onaction("fling", this.status, data);
            this._is_fling = false;
            this._fling_start_time = null;
            this._fling_coord = null;
            return;
        }
    };

    _pTouchActionSlide.reset = function ()
    {
        nexacro.TouchAction.prototype.reset.call(this);

        if (this._fling_timer)
        {
            this._fling_timer.stop();
            this._fling_timer = null;
        }

        if (this._is_fling)
        {
            var session = this._cur_session;
            var data = this._cur_data;
            if (session && data)
            {
                data.deltaDistanceX = 0;
                data.deltaDistanceY = 0;
                this.status = nexacro.TouchAction._STATUS_END;
                session.onaction("fling", this.status, data);
                this._is_fling = false;
            }
        }

        this._target_comp = null;
        this._is_fling = false;
        this._fling_start_time = null;
        this._fling_coord = null;
    };

    nexacro._limitDecimal = function (number, decimal_places)
    {
        const factor = 10 ** decimal_places;
        return Math.round(number * factor) / factor;
    }

    //==============================================================================
    // nexacro.TouchAction_Pinch
    //==============================================================================
    nexacro.TouchAction_Pinch = function ()
    {
        nexacro.TouchAction.call(this);

    };
    var _pTouchActionPinch = nexacro._createPrototype(nexacro.TouchAction, nexacro.TouchAction_Pinch);
    nexacro.TouchAction_Pinch.prototype = _pTouchActionPinch;
    _pTouchActionPinch._type_name = "TouchAction_Pinch";

    nexacro.TouchAction._registerGestureDetector('pinch', nexacro.TouchAction_Pinch);

    _pTouchActionPinch.type = 'pinch';
    _pTouchActionPinch.opt_accepttypes = 0;    // 0: all, enum(1:start, 2:move, 4:end)
    _pTouchActionPinch.opt_touches = 0;
    _pTouchActionPinch.opt_mintouches = 2;
    _pTouchActionPinch.opt_threshold = 9;

    _pTouchActionPinch._on_applyCurrentZoomInfo = function (zoomfactor)
    {
        this.opt_threshold /= zoomfactor;
    };

    _pTouchActionPinch._checkOption = function ()
    {
        if (!nexacro.TouchAction.prototype._checkOption.call(this))
            return false;

        if (this._isStarted())
            return true;

        var data = this._cur_data;
        if (!data) return false;

        //if (Math.abs(data.scale - 1) > this.opt_threshold)
        if (Math.abs(data.accDeltaSpacing) > this.opt_threshold)
            return true;
        return false;
    };

    //==============================================================================
    // nexacro.TouchAction_Press
    //==============================================================================
    nexacro.TouchAction_Press = function ()
    {
        nexacro.TouchAction.call(this);

        this._timer = null;
        this._data = null;
    };
    var _pTouchActionPress = nexacro._createPrototype(nexacro.TouchAction, nexacro.TouchAction_Press);
    nexacro.TouchAction_Press.prototype = _pTouchActionPress;
    _pTouchActionPress._type_name = "TouchAction_Press";

    nexacro.TouchAction._registerGestureDetector('longpress', nexacro.TouchAction_Press);

    _pTouchActionPress.type = 'longpress';
    _pTouchActionPress.opt_accepttypes = 5;    // 0: all, enum(1:start, 2:move, 4:end)
    _pTouchActionPress.opt_touches = 1;
    _pTouchActionPress.opt_time = 301;
    _pTouchActionPress.opt_threshold = 9;

    _pTouchActionPress._on_applyCurrentZoomInfo = function (zoomfactor)
    {
        this.opt_threshold /= zoomfactor;
    };

    _pTouchActionPress._checkOption = function ()
    {
        if (!nexacro.TouchAction.prototype._checkOption.call(this))
            return false;

        var data = this._cur_data;
        if (!data) return false;

        return (data.distance < this.opt_threshold);
    };

    _pTouchActionPress.reset = function ()
    {
        nexacro.TouchAction.prototype.reset.call(this);
        this._clearTimer();
    };

    _pTouchActionPress._clearTimer = function ()
    {
        if (this._timer)
        {
            var session = this._cur_session;
            if (session && session._start_win)
            {
                nexacro._clearSystemTimer(session._start_win.handle, this._timer);
            }
            this._timer = null;
        }
    };

    nexacro._on_bindTouchLongPressTimerHandler = function (pthis)
    {
        return function (evt)
        {
            if (pthis)
            {
                if (evt)
                    window._event = evt;
                pthis._setStart();
                pthis._clearTimer();
                pthis = null;
            }
        };
    };

    _pTouchActionPress._analysysGesture = function ()
    {
        var evtType = this._cur_evt_type;
        var session = this._cur_session;

        if (!session)
            return;

        var data = this._cur_data;
        if (!data) return;

        var bPressed = data.leadTime > this.opt_time;

        var passOption = this._checkOption();
        if (passOption)
        {
            if (evtType == nexacro.Touch._TOUCH_START)
            {
                this.reset();

                var win_handle = nexacro._getWindowHandle(session._start_win.handle);
                var timer_handler = nexacro._on_bindTouchLongPressTimerHandler(this);
                this._timer = nexacro._setSystemTimer(win_handle, timer_handler, this.opt_time, nexacro._getWindowEvent());
            }
            else if (evtType == nexacro.Touch._TOUCH_END)
            {
                this.reset();
                if (bPressed)
                    this._setEnd();
                else
                    this._resetStatus();
            }
            else if (evtType == nexacro.Touch._TOUCH_CANCEL)
            {
                this.reset();
                if (bPressed)
                    this._setCancel();
                else
                    this._resetStatus();
            }
        }
        else
        {
            this.reset();
        }
    };

    //==============================================================================
    // nexacro.TouchAction_Tap
    //==============================================================================
    nexacro.TouchAction_Tap = function ()
    {
        nexacro.TouchAction.call(this);

        //this.time = 0;
        //this.centerX = 0;
        //this.centerY = 0;

        //this._timer = null;
        //this._input = null;
        //this.tabcount = 0;
    };
    var _pTouchActionTap = nexacro._createPrototype(nexacro.TouchAction, nexacro.TouchAction_Tap);
    nexacro.TouchAction_Tap.prototype = _pTouchActionTap;
    _pTouchActionTap._type_name = "TouchAction_Tap";

    nexacro.TouchAction._registerGestureDetector('tap', nexacro.TouchAction_Tap);

    _pTouchActionTap.type = 'tap';
    _pTouchActionTap.opt_accepttypes = 5;    // 0: all, enum(1:start, 2:move, 4:end)
    _pTouchActionTap.opt_touches = 1;
    _pTouchActionTap.opt_time = 300;        // for tap
    _pTouchActionTap.opt_distance = 50;      // for tap
    _pTouchActionTap.opt_interval = 350;    // for dbltap
    _pTouchActionTap.opt_threshold = 20;    // for dbltap

    _pTouchActionTap._on_applyCurrentZoomInfo = function (zoomfactor)
    {
        this.opt_threshold /= zoomfactor;
        this.opt_distance /= zoomfactor;
    };

    _pTouchActionTap._checkOption = function ()
    {
        if (!nexacro.TouchAction.prototype._checkOption.call(this))
            return false;

        var data = this._cur_data;
        if (!data) return false;
        return (data.distance < this.opt_distance && data.leadTime < this.opt_time);
    };

    _pTouchActionTap._checkDblTapOption = function ()
    {
        if (!nexacro.TouchAction.prototype._checkOption.call(this))
            return false;

        var data = this._cur_data;
        var prev_data = this._prev_session_action_data;
        if (!data || !prev_data) return false;

        var distanceX = data.centerX - prev_data.centerX;
        var distanceY = data.centerY - prev_data.centerY;
        var distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
        var intervalTime = data.time - prev_data.time;

        return (intervalTime < this.opt_interval) && (distance < this.opt_threshold);
    };

    _pTouchActionTap.reset = function ()
    {
        nexacro.TouchAction.prototype.reset.call(this);
        this._target_comp = null;
    };

    _pTouchActionTap._analysysGesture = function ()
    {
        var evtType = this._cur_evt_type;
        var session = this._cur_session, comp;

        if (evtType == nexacro.Touch._TOUCH_START && this._target_comp == null)
        {
            comp = session._cur_elem;
            while (comp && !comp._is_component)
            {
                comp = comp.parent;
            }
            if (!comp || !comp._is_component)
                return;

            this._target_comp = comp;
        }

        var passOption = this._checkOption();
        if (passOption)
        {
            if (!this._target_comp || evtType != nexacro.Touch._TOUCH_END)
                return;

            comp = session._cur_elem;
            while (comp && !comp._is_component)
            {
                comp = comp.parent;
            }
            if (!comp || !comp._is_component || this._target_comp != comp)
                return;

            this._setEnd();

            // handle double-tap
            if (this._prev_session_action_type == "tap")
            {
                if (this._checkDblTapOption())
                {
                    this._on_action_dbltap(this.status);
                }
            }
        }

        return this.state;
    };

    _pTouchActionTap._on_action_dbltap = function (status)
    {
        var session = this._cur_session;
        var data = this._cur_data;
        if (!session || !data) return;

        session.onaction("dbltap", status, data);
    };

    //==============================================================================
    // nexacro.ItemClickEventInfo
    //==============================================================================
    nexacro.ItemClickEventInfo = function (obj, id, index, itemtext, itemvalue, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, meta_key)
    {
        nexacro.ClickEventInfo.call(this, obj, id || "onitemclick", button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, obj, obj, meta_key);
        this.fromobject = this.fromreferenceobject = obj;

        this.index = index;
        this.itemtext = itemtext;
        this.itemvalue = itemvalue;
    };
    var _pItemClickEventInfo = nexacro._createPrototype(nexacro.ClickEventInfo, nexacro.ItemClickEventInfo);
    nexacro.ItemClickEventInfo.prototype = _pItemClickEventInfo;
    _pItemClickEventInfo._type_name = "ItemClickEventInfo";


    //==============================================================================
    // nexacro.ChangeEventInfo
    //==============================================================================
    nexacro.ChangeEventInfo = function (obj, id, pretext, prevalue, posttext, postvalue)
    {
        nexacro.Event.call(this, obj, id || "onchange");

        this.pretext = pretext;
        this.prevalue = prevalue;
        this.posttext = posttext;
        this.postvalue = postvalue;
    };
    var _pChangeEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ChangeEventInfo);
    nexacro.ChangeEventInfo.prototype = _pChangeEventInfo;
    _pChangeEventInfo._type_name = "ChangeEventInfo";

    //==============================================================================
    // nexacro.ChangedEventInfo
    //==============================================================================
    nexacro.ChangedEventInfo = function (obj, id, pretext, prevalue, posttext, postvalue)
    {
        this.id = this.eventid = id || "onchanged";
        this.fromobject = this.fromreferenceobject = obj;

        this.pretext = pretext;
        this.prevalue = prevalue;
        this.posttext = posttext;
        this.postvalue = postvalue;
    };
    var _pChangedEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ChangedEventInfo);
    nexacro.ChangedEventInfo.prototype = _pChangedEventInfo;
    _pChangedEventInfo._type_name = "ChangedEventInfo";

    //==============================================================================
    // nexacro.InnerdataChangedEventInfo
    //==============================================================================
    nexacro.InnerdataChangedEventInfo = function (obj, id, oldvalue, newvalue, columnid, col, row)
    {
        this.id = this.eventid = id || "oninnerdatachanged";
        this.fromobject = this.fromreferenceobject = obj;

        this.oldvalue = oldvalue;
        this.newvalue = newvalue;
        this.columnid = columnid;
        this.col = col;
        this.row = row;
    };
    var _pInnerdataChangedEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.InnerdataChangedEventInfo);
    nexacro.InnerdataChangedEventInfo.prototype = _pInnerdataChangedEventInfo;
    _pInnerdataChangedEventInfo._type_name = "InnerdataChangedEventInfo";

    //==============================================================================
    // nexacro.ItemChangeEventInfo
    //==============================================================================
    nexacro.ItemChangeEventInfo = function (obj, id, preindex, pretext, prevalue, postindex, posttext, postvalue)
    {
        this.id = this.eventid = id || "onitemchagne";
        this.fromobject = this.fromreferenceobject = obj;

        this.preindex = preindex;
        this.pretext = pretext;
        this.prevalue = prevalue;
        this.postindex = postindex;
        this.posttext = posttext;
        this.postvalue = postvalue;
    };
    var _pItemChangeEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ItemChangeEventInfo);
    nexacro.ItemChangeEventInfo.prototype = _pItemChangeEventInfo;
    _pItemChangeEventInfo._type_name = "ItemChangeEventInfo";


    //==============================================================================
    // nexacro.DuplicateExecutionEventInfo
    //==============================================================================
    nexacro.DuplicateExecutionEventInfo = function (obj, id, _arguments, apparguments, envarguments, cookiearguments)
    {
        this.id = this.eventid = id || "onduplicateexecution";
        this.fromobject = this.fromreferenceobject = obj;

        this.arguments = _arguments;
        this.apparguments = apparguments;
        this.envarguments = envarguments;
        this.cookiearguments = cookiearguments;
    };

    var _pDuplicateExecutionEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.DuplicateExecutionEventInfo);
    nexacro.DuplicateExecutionEventInfo.prototype = _pDuplicateExecutionEventInfo;
    _pDuplicateExecutionEventInfo._type_name = "DuplicateExecutionEventInfo";


    //==============================================================================
    // nexacro.UserNotifyEventInfo
    //==============================================================================
    nexacro.UserNotify = function (obj, id, notifyid, message)
    {
        // Plugin 사용시 application.userNotify를 호출하면 이벤트가 발생함.
        this.id = this.eventid = id || "onusernotify";
        this.fromobject = this.fromreferenceobject = obj;

        this.notifyid = notifyid;
        this.message = message;
    };
    var _pEventUserNotify = nexacro._createPrototype(nexacro.Event, nexacro.UserNotify);
    nexacro.UserNotify.prototype = _pEventUserNotify;
    _pEventUserNotify._type_name = "UserNotifyEvent";


    nexacro.ApplicationUserNotify = function (obj, id, userdata)
    {
        this.id = this.eventid = id || "onusernotify";
        this.fromobject = this.fromreferenceobject = obj;

        this.userdata = userdata;
    };
    var _pEventAppUserNotify = nexacro._createPrototype(nexacro.Event, nexacro.ApplicationUserNotify);
    nexacro.ApplicationUserNotify.prototype = _pEventAppUserNotify;
    _pEventAppUserNotify._type_name = "ApplicationUserNotifyEvent";

    nexacro.AddLog = function (obj, id, message)
    {
        this.id = this.eventid = id || "onaddlog";
        this.fromobject = this.fromreferenceobject = obj;
        this.message = message;
    };
    var _pEventAddLog = nexacro._createPrototype(nexacro.Event, nexacro.AddLog);
    nexacro.AddLog.prototype = _pEventAddLog;
    _pEventAddLog._type_name = "AddLogEvent";

    nexacro.Communication = function (obj, id, state)
    {
        this.id = this.eventid = id || "oncommunication";
        this.fromobject = this.fromreferenceobject = obj;
        this.state = state;
    };
    var _pEventCommunication = nexacro._createPrototype(nexacro.Event, nexacro.Communication);
    nexacro.Communication.prototype = _pEventCommunication;
    _pEventCommunication._type_name = "CommunicationEvent";

    //==============================================================================
    // nexacro.NotificationEventInfo
    //==============================================================================
    nexacro.NotificationEventInfo = function (obj, id, reason, messages)
    {
        this.id = this.eventid = id || "onnotification";
        this.fromobject = this.fromreferenceobject = obj;

        this.reason = reason;
        if (this.reason == 200 || this.resaon == '200')
            this.messages = messages;
    };
    var _pNotificationEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.NotificationEventInfo);
    nexacro.NotificationEventInfo.prototype = _pNotificationEventInfo;
    _pNotificationEventInfo._type_name = "NotificationEventInfo";

    //==============================================================================
    // nexacro.DevicePermissionEventInfo
    //==============================================================================
    nexacro.DevicePermissionEventInfo = function (obj, id, reason, status) 
    {
        this.id = this.eventid = id || "ondevicepermission";
        this.fromobject = this.fromreferenceobject = obj;

        this.reason = reason;
        this.status = status;
    };
    var _pDevicePermissionEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.DevicePermissionEventInfo);
    nexacro.DevicePermissionEventInfo.prototype = _pDevicePermissionEventInfo;
    _pDevicePermissionEventInfo._type_name = "DevicePermissionEventInfo";

    _pDevicePermissionEventInfo = null;


    //==============================================================================
    // nexacro.PopStateEventInfo
    //==============================================================================
    nexacro.PopStateEventInfo = function (obj, id, key, data, url, currenturl) 
    {
        this.id = this.eventid = id || "onpopstate";
        this.fromobject = this.fromreferenceobject = obj;

        this.key = key;
        this.data = data;
        this.url = url;
        this.currenturl = currenturl;
    };
    var _pPopStateEventInfo = nexacro._createPrototype(nexacro.EventInfo, nexacro.PopStateEventInfo);
    nexacro.PopStateEventInfo.prototype = _pPopStateEventInfo;
    _pPopStateEventInfo._type_name = "PopStateEventInfo";
    _pPopStateEventInfo = null;

    //==============================================================================
    // Basic Utils
    //==============================================================================
    nexacro._gen_arrmap = function (arr)
    {
        var arr_map = {};
        var len = arr.length;
        for (var i = 0; i < len; i++)
        {
            arr_map[arr[i]] = i;
        }
        return arr_map;
    };

    //==============================================================================
    // base 64 Encode/Decode, utf8 Encode/Decode
    //==============================================================================
    if (nexacro._Browser == "Runtime")
    {
        nexacro.base64Encode = function (input)
        {
            return nexacro.__base64Encode(input);
        };
        nexacro.base64Decode = function (input)
        {
            return nexacro.__base64Decode(input);
        };
    }
    /*  
    else if (window.btoa && window.atob && nexacro._Browser != "MobileSafari") 
    {
        nexacro.base64Encode = function (input) 
        {			
            return window.btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g,
                function toSolidBytes(match, p1) 
                {
                    return String.fromCharCode('0x' + p1); 
                }));			
//			return window.btoa(input);
        };
        nexacro.base64Decode = function (input) 
        {
            return decodeURIComponent(window.atob(input).split('').map(function(c) 
            {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            //return window.atob(input);
        };
    }*/
    else
    {
        (function ()
        {
            var _base64keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split('');
            var _base64keys = nexacro._gen_arrmap(_base64keyStr);
            var _re_not_base64Chars = /[^A-Za-z0-9\+\/\=]/g;
            // RP 99440 avest 바이러스프로그램이 바이러스로 검출하는 내용 수정(deploy시 문제 됨. 수정하면 안됨)
            const val2 = 2, val3 = 3, val4 = 4, val6 = 6, val15 = 15, val63 = 63;

            nexacro.base64Encode = function (input)
            {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;
                var _chr2, _chr3;

                input = nexacro.utf8Encode(input);
                const fval = 4; //RP 99440 avest 바이러스프로그램이 바이러스로 검출하는 내용 수정(deploy시 문제 됨. 수정하면 안됨)
                while (i < input.length)
                {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    //RP 99440 avest 바이러스프로그램이 바이러스로 검출하는 내용 수정(deploy시 문제 됨. 수정하면 안됨)
                    enc1 = chr1 >> val2;
                    enc2 = ((chr1 & val3) << val4) | (chr2 >> val4);
                    enc3 = ((chr2 & val15) << val2) | (chr3 >> val6);
                    enc4 = chr3 & val63;

                    _chr2 = +chr2;
                    _chr3 = +chr3;
                    if (_chr2 != _chr2)
                    {
                        enc3 = enc4 = 64;
                    }
                    else if (_chr3 != _chr3)
                    {
                        enc4 = 64;
                    }

                    output = output + _base64keyStr[enc1] + _base64keyStr[enc2] + _base64keyStr[enc3] + _base64keyStr[enc4];
                }

                return output;
            };

            // public method for decoding
            nexacro.base64Decode = function (input)
            {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;

                input = input.replace(_re_not_base64Chars, "");
                const fval = 4; //RP 99440 avest 바이러스프로그램이 바이러스로 검출하는 내용 수정(deploy시 문제 됨. 수정하면 안됨)
                while (i < input.length)
                {
                    enc1 = _base64keys[input[i++]];
                    enc2 = _base64keys[input[i++]];
                    enc3 = _base64keys[input[i++]];
                    enc4 = _base64keys[input[i++]];

                    //RP 99440 avest 바이러스프로그램이 바이러스로 검출하는 내용 수정(deploy시 문제 됨. 수정하면 안됨)
                    chr1 = (enc1 << val2) | (enc2 >> val4);
                    chr2 = ((enc2 & val15) << val4) | (enc3 >> val2);
                    chr3 = ((enc3 & val3) << val6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64)
                    {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64)
                    {
                        output = output + String.fromCharCode(chr3);
                    }

                }
                return nexacro.utf8Decode(output);
            };

        })();
    }

    // private method for UTF-8 encoding
    nexacro.utf8Encode = function (string)
    {
        var utf = "";
        for (var n = 0; n < string.length; n++)
        {
            var c = string.charCodeAt(n);

            if (c == 13) // \r
            {
                if (string.charCodeAt(n + 1) != '\n')
                    utf += String.fromCharCode(c);
            }
            else if (c < 128)
            {
                utf += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048))
            {
                utf += String.fromCharCode((c >> 6) | 192);
                utf += String.fromCharCode((c & 63) | 128);
            }
            else
            {
                utf += String.fromCharCode((c >> 12) | 224);
                utf += String.fromCharCode(((c >> 6) & 63) | 128);
                utf += String.fromCharCode((c & 63) | 128);
            }
        }
        return utf;
    };

    // private method for UTF-8 decoding
    nexacro.utf8Decode = function (utftext)
    {
        var i = 0, c = 0, c2 = 0, c3 = 0;

        var string = [];
        while (i < utftext.length)
        {
            c = utftext.charCodeAt(i);

            if (c < 128)
            {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224))
            {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else
            {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    };

    nexacro._crc32table = (() =>
    {
        let c;
        const table = [];
        for (let n = 0; n < 256; n++)
        {
            c = n;
            for (let k = 0; k < 8; k++)
            {
                if (c & 1)
                {
                    c = 0xedb88320 ^ (c >>> 1);
                }
                else
                {
                    c = c >>> 1;
                }
            }
            table[n] = c;
        }
        return table;
    })();

    nexacro._crc32 = function (data)
    {
        let crc = 0 ^ (-1);

        for (let i = 0; i < data.length; i++)
        {
            const byte = data[i];
            crc = (crc >>> 8) ^ nexacro._crc32table[(crc ^ byte) & 0xff];
        }

        return (crc ^ (-1)) >>> 0;
    }

    nexacro.lzssDecode = function (input)
    {
        const N = 4096;
        const F = 18;
        const TH = 2;

        let outBuf = [];
        let inBuf;

        if (input instanceof ArrayBuffer)
            inBuf = new Uint8Array(input);

        if (inBuf[0] != 0xff || inBuf[1] != 0xac) return null;

        let tot_len = inBuf.length;

        let text_buf = new Uint8Array(N + F - 1).fill(0x20);

        let i, j, k, r;
        let c;
        let ch;
        let flags;

        let cur_pos = 6;
        let checksum = (inBuf[2] << 24) | (inBuf[3] << 16) | (inBuf[4] << 8) | inBuf[5];

        let crc = nexacro._crc32(inBuf.slice(6));
        if (checksum != crc)
        {
            throw new Error("Checksum error.");
        }

        r = N - F;
        flags = 0;

        while (true)
        {
            if (((flags >>= 1) & 256) === 0)
            {
                if (cur_pos >= tot_len) break;
                c = inBuf[cur_pos++];
                flags = c | 0xff00;
            }

            if (flags & 1)
            {
                if (cur_pos >= tot_len) break;
                ch = inBuf[cur_pos++];
                outBuf.push(ch);
                text_buf[r++] = ch;
                r &= (N - 1);
            }
            else
            {
                if (cur_pos >= tot_len) break;
                i = inBuf[cur_pos++];
                if (cur_pos >= tot_len) break;
                j = inBuf[cur_pos++];

                i |= ((j & 0xf0) << 4);
                j = (j & 0x0f) + TH;

                for (k = 0; k <= j; k++)
                {
                    ch = text_buf[(i + k) & (N - 1)];
                    outBuf.push(ch);
                    text_buf[r++] = ch;
                    r &= (N - 1);
                }
            }
        }

        return new Uint8Array(outBuf);
    }

    nexacro._checkBase64String = function (str)
    {
        var regExp = /[^A-Za-z0-9+\/=]/g;

        if (str === "" || str == null)
        {
            return false;
        }

        if (str.length >= 10 && str.substr(0, 10).toLowerCase() == "data:image")
        {
            return true;
        }

        if (str.match(regExp) == null)
        {
            return true;
        }

        //regExp = null;

        return false;
    };
    nexacro._transImageBase64StringFormat = function (str, isinvaildskip, isnodatacheck)
    {
        var regExp = /[^A-Za-z0-9+\/=]/g;
        var base64format = {};
        if (str === "" || str == null)
        {
            return null;
        }
        var arrstr = str.split(',');
        var length = arrstr.length;

        var header, reg_exps0, reg_exps1, result, ext;
        switch (length)
        {
            case 1:
                if (isnodatacheck) return null;
                if (!isinvaildskip)
                {

                    if (str.match(regExp) == null)
                    {
                        base64format.data = "data:image";
                        base64format.ext = "";
                        base64format.encode = ";base64,";
                        base64format.contents = arrstr[0];
                    }
                    else
                    {
                        return null;
                    }
                }
                else
                {
                    base64format.data = "data:image";
                    base64format.ext = "";
                    base64format.encode = ";base64,";
                    base64format.contents = arrstr[0];
                }
                break;
            case 2:
                header = arrstr[0].toLowerCase();
                reg_exps0 = /(data:image)+?(;base64)/ig;
                reg_exps1 = /(data:image).+?(;base64)/ig;
                result = reg_exps0.exec(header);
                if (result == null)
                {
                    result = reg_exps1.exec(header);
                }
                if (result != null && result.length == 3)
                {
                    base64format.data = result[1];
                    ext = header.replace("data:image", "");
                    ext = ext.replace("\;base64", "");


                    if (ext)
                    {
                        base64format.ext = ext;
                    }
                    else
                    {
                        base64format.ext = "";
                    }
                    base64format.encode = result[2] + ",";
                    base64format.contents = arrstr[1];
                }
                else
                {
                    if (isnodatacheck) return null;
                    if (isinvaildskip)
                    {
                        base64format.data = "data:image";
                        base64format.ext = "";
                        base64format.encode = ";base64,";
                        base64format.contents = arrstr[1];
                    }
                    else
                        return null;

                }
                break;
            default:
                return null;
        }

        base64format.alldata = base64format.data + base64format.ext + base64format.encode + base64format.contents;
        //trace(base64format.alldata);
        return base64format;

    };

    (function ()
    {
        var _base32keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=".split('');
        var _base32keys = nexacro._gen_arrmap(_base32keyStr);
        var _re_not_base32Chars = /[^A-Za-z2-7\=]/g;
        //RP 99440 avest 바이러스프로그램이 바이러스로 검출하는 내용 수정(deploy시 문제 됨. 수정하면 안됨)
        const val1 = 1, val2 = 2, val3 = 3, val4 = 4, val5 = 5, val6 = 6, val7 = 7;

        nexacro.base32Encode = function (input)
        {
            var output = "";
            var c, n1, n2, n3, n4, n5, n6, n7, n8;
            var i = 0;

            input = nexacro.utf8Encode(input);

            while (i < input.length)
            {
                var offset = i;
                var remain = input.length - offset;
                var blocksize = (remain < 5 ? remain : 5);
                n1 = n2 = n3 = n4 = n5 = n6 = n7 = n8 = 0;
                //RP 99440 avest 바이러스프로그램이 바이러스로 검출하는 내용 수정(deploy시 문제 됨. 수정하면 안됨)
                switch (blocksize)
                {
                    case 5:
                        c = input.charCodeAt(offset + 4);
                        n8 = (c & 0x1f);
                        n7 = ((c & 0xe0) >> val5);
                    case 4:
                        c = input.charCodeAt(offset + 3);
                        n7 |= ((c & 0x03) << val3);
                        n6 = ((c & 0x7c) >> val2);
                        n5 = ((c & 0x80) >> val7);
                    case 3:
                        c = input.charCodeAt(offset + 2);
                        n5 |= ((c & 0x0f) << val1);
                        n4 = ((c & 0xf0) >> val4);
                    case 2:
                        c = input.charCodeAt(offset + 1);
                        n4 |= ((c & 0x01) << val4);
                        n3 = ((c & 0x3e) >> val1);
                        n2 = ((c & 0xc0) >> val6);
                    case 1:
                        c = input.charCodeAt(offset);
                        n2 |= ((c & 0x07) << val2);
                        n1 = ((c & 0xf8) >> val3);
                        break;
                    default:
                        break;
                }
                i += blocksize;

                /* Validate */
                // console.assert(n1 <= 31);
                // console.assert(n2 <= 31);
                // console.assert(n3 <= 31);
                // console.assert(n4 <= 31);
                // console.assert(n5 <= 31);
                // console.assert(n6 <= 31);
                // console.assert(n7 <= 31);
                // console.assert(n8 <= 31);

                /* Padding */
                switch (blocksize)
                {
                    case 1: n3 = n4 = 32;
                    case 2: n5 = 32;
                    case 3: n6 = n7 = 32;
                    case 4: n8 = 32;
                    case 5:
                        break;
                    default:
                        break;
                }

                output = output + _base32keyStr[n1] + _base32keyStr[n2] + _base32keyStr[n3] + _base32keyStr[n4]
                    + _base32keyStr[n5] + _base32keyStr[n6] + _base32keyStr[n7] + _base32keyStr[n8];
            }

            return output;
        };

        nexacro.base32Decode = function (input)
        {
            var output = "";
            var c1, c2, c3, c4, c5, n1, n2, n3, n4, n5, n6, n7, n8;
            var i = 0;

            input = input.replace(_re_not_base32Chars, "");
            input = input.toUpperCase();

            if (input.length % 8 != 0)
            {
                return;
            }

            while (i < input.length)
            {
                n1 = _base32keys[input[i++]];
                n2 = _base32keys[input[i++]];
                n3 = _base32keys[input[i++]];
                n4 = _base32keys[input[i++]];
                n5 = _base32keys[input[i++]];
                n6 = _base32keys[input[i++]];
                n7 = _base32keys[input[i++]];
                n8 = _base32keys[input[i++]];

                /* Validate base32 */
                if (n1 > 31 || n2 > 31)
                    return; /*ERROR - invalid base32 character*/

                /*the following can be padding*/
                if (n3 > 32 || n4 > 32
                    || n5 > 32 || n6 > 32
                    || n7 > 32 || n8 > 32)
                    return; /*ERROR - invalid base32 character*/

                //RP 99440 avest 바이러스프로그램이 바이러스로 검출하는 내용 수정(deploy시 문제 됨. 수정하면 안됨)
                c1 = ((n1 & 0x1f) << val3) | ((n2 & 0x1c) >> val2);
                c2 = ((n2 & 0x03) << val6) | ((n3 & 0x1f) << val1) | ((n4 & 0x10) >> val4);
                c3 = ((n4 & 0x0f) << val4) | ((n5 & 0x1e) >> val1);
                c4 = ((n5 & 0x01) << val7) | ((n6 & 0x1f) << val2) | ((n7 & 0x18) >> val3);
                c5 = ((n7 & 0x07) << val5) | (n8 & 0x1f);

                output = output + String.fromCharCode(c1);
                if (n3 != 32)
                {
                    output = output + String.fromCharCode(c2);
                }
                if (n5 != 32)
                {
                    output = output + String.fromCharCode(c3);
                }
                if (n6 != 32)
                {
                    output = output + String.fromCharCode(c4);
                }
                if (n8 != 32)
                {
                    output = output + String.fromCharCode(c5);
                }
            }
            return nexacro.utf8Decode(output);
        };
    })();


    //==============================================================================
    nexacro._mergeUrl = function (left, right)
    {
        if (left && right)
        {
            //var rpos = right.indexOf("/");
            if (left.charAt(left.length - 1) == '/')
            {
                if (right.charAt(0) == '/')
                {
                    return left + right.substring(1);
                }
                else
                {
                    return left + right;
                }
            }
            else
            {
                if (right.charAt(0) == '/')
                {
                    return left + right;
                }
                else
                {
                    return left + '/' + right;
                }
            }
        }
        else
        {
            return left || right;
        }
    };
    //----------------------------------------------------------------


    //==============================================================================
    // UTILS for Search Object Tree
    //==============================================================================
    nexacro._findParentComponent = function (elem)
    {
        var _comp = elem.parent;
        while (_comp && !_comp._is_component)
        {
            _comp = _comp.parent;
        }
        return _comp;
    };
    nexacro._findParentForm = function (comp)
    {
        var ctx = comp.parent;
        while (ctx && !ctx._is_form)
        {
            ctx = ctx.parent;
        }
        return ctx;
    };
    nexacro._findReferenceForm = function (comp)
    {
        var ctx = comp;
        while (ctx && !ctx._is_form)
        {
            ctx = ctx.parent;
        }
        return ctx;
    };

    nexacro._findParentContext = function (comp)
    {
        var ctx = comp.parent;
        while (ctx && !ctx._is_context)
        {
            ctx = ctx.parent;
        }
        return ctx;
    };
    nexacro._findReferenceContext = function (comp)
    {
        var ctx = comp;
        while (ctx && !ctx._is_context)
        {
            ctx = ctx.parent;
        }
        return ctx;
    };

    nexacro._findParentFrame = function (comp)
    {
        var frame = comp.parent;
        while (frame && !frame._is_frame)
        {
            frame = frame.parent;
        }
        return frame;
    };
    nexacro._findParentWindow = function (comp)
    {
        var win = comp.parent;
        while (win && !win._is_window)
        {
            win = win.parent;
        }
        return win;
    };



    //==============================================================================
    // Component's Functionality setters
    //==============================================================================
    // System Event
    // this function set system event handlers for simply forward to parent
    nexacro._setForwardingSystemEventHandlers = function (ptype)
    {
        var base = nexacro.Component.prototype;
        ptype._on_sys_focus = base._on_sys_focus_forward;
        ptype._on_sys_lbuttondown = base._on_sys_lbuttondown_forward;
        ptype._on_sys_lbuttonup = base._on_sys_lbuttonup_forward;
        ptype._on_sys_rbuttondown = base._on_sys_rbuttondown_forward;
        ptype._on_sys_rbuttonup = base._on_sys_rbuttonup_forward;
        ptype._on_sys_mouseenter = base._on_sys_mouseenter_forward;
        ptype._on_sys_mouseleave = base._on_sys_mouseleave_forward;
        ptype._on_sys_mousemove = base._on_sys_mousemove_forward;
        ptype._on_sys_keydown = base._on_sys_keydown_forward;
        ptype._on_sys_keypress = base._on_sys_keypress_forward;
        ptype._on_sys_keyup = base._on_sys_keyup_forward;
        //ptype._on_sys_click = base._on_sys_click_forward;
        ptype._on_sys_dblclick = base._on_sys_dblclick_forward;
        ptype._on_sys_mousewheel = base._on_sys_mousewheel_forward;
        ptype._on_sys_dragleave = base._on_sys_dragleave_forward;
        ptype._on_sys_drop = base._on_sys_drop_forward;
        ptype._on_sys_dragenter = base._on_sys_dragenter_forward;
        ptype._on_sys_dragmove = base._on_sys_dragmove_forward;
        ptype._on_sys_touch = base._on_sys_touch_forward;
    };
    // this function set system event handler - lbutton down for enable forwarding
    // setCapture and fire event _on_movetrack for mouse move & _on_end_track for lbuttonup
    //nexacro._setForMouseTrackSystemEventHandler = function(ptype)
    //{
    //    var base = nexacro.Component.prototype;
    //    ptype._on_sys_lbuttondown = base._on_sys_lbuttondown_simpletrack;
    //    ptype._on_starttrack = base._on_starttrack_simpletrack;
    //    ptype._on_movetrack = base._on_movetrack_simpletrack;
    //    ptype._on_endtrack = base._on_movetrack_simpletrack;
    //};

    //// Style
    //// this function enable Class Functionity for style(css) find Functionalitis
    //// --> this function use for non Component Class
    //nexacro._setStyleFinders_ForNonComponent = function(ptype)
    //{
    //    var base = nexacro.Component.prototype;
    //    ptype._find_comp_pseudo_obj = base._find_comp_pseudo_obj;
    //    ptype._find_ctrl_pseudo_obj = base._find_comp_pseudo_obj;
    //    ptype._find_typedctrl_pseudo_obj = base._find_comp_pseudo_obj;
    //    ptype._updateCurrentStyle = base._updateCurrentStyle;
    //    ptype._find_pseudo_obj = base._find_pseudo_obj;
    //};
    //// this function setting Component style find routines
    //nexacro._setForComponetStyleFinder = function(ptype)
    //{
    //    ptype._find_pseudo_obj = nexacro.Component.prototype._find_comp_pseudo_obj;
    //};
    //// this function setting Control style find routines
    //nexacro._setForControlStyleFinder = function(ptype)
    //{
    //    ptype._find_pseudo_obj = nexacro.Component.prototype._find_ctrl_pseudo_obj;
    //};
    //// this function setting Control style find routines
    //nexacro._setForTypedControlStyleFinder = function(ptype)
    //{
    //    ptype._find_pseudo_obj = nexacro.Component.prototype._find_typedctrl_pseudo_obj;
    //};

    //==============================================================================
    // Event
    //nexacro._setForEventListeners = function(ptype)
    //{
    //    // init/clear
    //    ptype._initEventHandlers = ptype._initEventListeners;
    //    ptype._clearEventHandlers = ptype._clearEventListeners;
    //};


    //style property for bind, expr
    //this._exprcache 를 필요에 따라 초기화해야함

    //nexacro._getValueForStyleBindExpr = function (comp, propobj, propid, rowidx)
    //{
    //    if (propobj && propobj._bindtype !== 0)
    //    {
    //        var compobj = comp;
    //        var dataset = comp._innerdataset;
    //        if (dataset == null)
    //        {
    //            propobj = null;
    //        }
    //        else
    //        {
    //            var val;
    //            if (propobj._bindtype == 1)
    //            {
    //                val = dataset.getColumn(rowidx, propobj._bindexpr);
    //            }
    //            else
    //            {
    //                var exprfn = compobj._exprcache[propobj._bindexpr];
    //                if (exprfn === null)
    //                {
    //                    exprfn = dataset._createExprFunc(propobj._bindexpr);
    //                    compobj._exprcache[propobj._bindexpr] = exprfn;
    //                }

    //                if ((typeof exprfn) == "function")
    //                {
    //                    val = exprfn.call(compobj, rowidx, rowidx, compobj, dataset);
    //                    if (val)
    //                    {
    //                        val = val.toString();
    //                    }
    //                }
    //                else
    //                {
    //                    val = propobj._bindexpr;
    //                }
    //            }
    //            if (val != null && val !== "")
    //            {
    //                propobj = nexacro._getCachedStyleObj(propid, val);
    //            }
    //            else
    //            {
    //                propobj = null;
    //            }
    //        }
    //    }
    //    return propobj;
    //};


    //==============================================================================
    // Load Manager
    //==============================================================================
    nexacro._CommunicationStatusTable =
    {
        "cancel_byuser": 10400,
        "stop_transaction_byesc": 10401,
        "duplication_svcid": 10405,
        "client_timeout": 10408,  // framework 내부 로직에서 client timeout 으로 판단한 경우 서버에서 받은 코드가 아님
        "server_timeout": 10504,  // framework 내부 로직에서 server timeout 으로 판단한 경우 서버에서 받은 코드가 아님
        "failunknown": 10499,
        "invalid_communication_format": 10599
    };

    nexacro._CommunicationManager = {};
    nexacro._CacheList = {};
    nexacro._DataCacheList = {};
    nexacro._DataObjectCacheList = {};

    nexacro._ParametersCache = function (id, value)
    {
        this.id = id;
        this.value = value;
    };
    nexacro._DataSetCache = function (id, colinfos, constVars, rawRecords)
    {
        this.id = id;
        this.rawRecords = null;
        this.colinfos = null;
        this.constVars = null;

        if (rawRecords)
        {
            this.rawRecords = nexacro._cloneObject(rawRecords);     //check performance
            //   this.rawRecords = JSON.parse(JSON.stringify(rawRecords));
        }

        var i;
        if (colinfos)
        {
            this.colinfos = new nexacro.DSColumnInfoList();
            for (i = 0; i < colinfos.length; i++)
            {
                this.colinfos.add(colinfos[i].id, colinfos[i]);
            }
        }

        if (constVars)
        {
            this.constVars = new nexacro.VariableList();
            for (i = 0; i < constVars.length; i++)
            {
                this.constVars.add(constVars[i].id, constVars[i]);
            }
        }

    };

    nexacro._DataObjectCache = function (dataobject, last_modified, version, data, response_headers)
    {
        this.dataobject = dataobject;
        this.last_modified = last_modified;
        this.version = version;
        this.data = data;
        this.response_headers = response_headers;

    };
    var __pDataObjectCache = nexacro._createPrototype(nexacro.Object, nexacro._DataObjectCache);
    nexacro._DataObjectCache.prototype = __pDataObjectCache;
    __pDataObjectCache._type_name = "DataObjectCache";

    __pDataObjectCache._loadDataObject = function (loadItem)
    {
        var json;
        var data = this.data;
        var dataobject = this.dataobject;
        var errorinfo = [0, "SUCCESS"];
        try
        {
            if (data)
            {
                json = JSON.parse(data);
            }
            dataobject._addResponseInfo(data, this.response_headers);
        }
        catch (e)
        {
            errorinfo = [-1, ""];
        }

        return [errorinfo, dataobject, data, json, this.response_headers];
    };

    nexacro._DataCache = function (parametersCaches, datasetCaches, last_modified, version)
    {
        this.parameters = parametersCaches; //array
        this.datasets = datasetCaches;      //nexacro.Collection
        this.last_modified = last_modified;
        this.version = version;
    };
    var __pDataCache = nexacro._createPrototype(nexacro.Object, nexacro._DataCache);
    nexacro._DataCache.prototype = __pDataCache;
    __pDataCache._type_name = "DataCache";

    __pDataCache.context = null;
    __pDataCache._setContext = function (context)
    {
        this.context = context;
        return this;
    }

    __pDataCache._loadData = function (loadItem)
    {
        var err_info = this._loadParametersFromCache(loadItem);
        this._loadDatasetsFromCache(loadItem, err_info[0], err_info[1]);

        return err_info;
    };

    __pDataCache._loadParametersFromCache = function (loadItem)
    {
        var params = this.parameters;
        var len = params.length;
        var form = loadItem.context;
        var id, val, code, message;

        for (var i = 0; i < len; i++)
        {
            id = params[i].id;
            val = params[i].value;

            if (id == "ErrorCode")
            {
                code = parseInt(val) | 0;
                if (isFinite(code) === false)
                {
                    code = -1;
                }
            }
            else if (id == "ErrorMsg")
            {
                message = val;
            }
            else if (id in form)  //1.form(application) variable
            {
                if (typeof (form[id]) != "object")
                {
                    form[id] = val;
                }
            }
            else 
            {
                if (this.context && id in this.context)
                {
                    if (typeof (this.context[id]) != "object")
                    {
                        this.context[id] = val;
                    }
                }
                else
                {
                    var app = nexacro.getApplication();
                    if (app && app._existVariable(id))
                    {
                        app[id] = val;
                    }
                }
            }
        }

        return [code, message];
    };

    __pDataCache._loadDatasetsFromCache = function (loadItem, errorcd, errormsg)
    {
        var datasets = this.datasets;
        var outputDatasets = loadItem.outputDatasets;

        if (!outputDatasets)
            return;

        var len = outputDatasets.length;
        var form = loadItem.context;
        var ds_cache, ds;
        var localId, constVars, colinfos, rawRecords;

        for (var i = 0; i < len; i++)
        {
            localId = outputDatasets[i].lval;
            ds_cache = datasets[localId];
            if (!ds_cache)
                continue;

            constVars = ds_cache.constVars;
            colinfos = ds_cache.colinfos;
            rawRecords = ds_cache.rawRecords;

            ds = form._getDatasetObject(localId);
            if (ds)
            {
                var target_colinfos = colinfos;

                if (ds._p_useclientlayout)
                {
                    ds.clearData();
                    target_colinfos = ds.colinfos;
                }
                else
                {
                    ds.clear();
                    ds._copyConstColList(constVars);
                    ds._appendColList(colinfos);
                }

                if (rawRecords)
                {
                    if (target_colinfos == colinfos)
                    {
                        // ds._rawRecords = rawRecords.slice(0, rawRecords.length);
                        ds._rawRecords = nexacro._cloneObject(rawRecords);
                    }
                    else
                    {
                        if (colinfos)
                        {
                            var colid, colidx, index;
                            var expr = "(function(){ return function(arr) { var ret = new Array(); ";
                            for (var j = 0; j < colinfos.length; j++)
                            {
                                colid = colinfos[j].id;
                                colidx = target_colinfos._idxMap[colid];
                                if (colidx >= 0)
                                {
                                    index = target_colinfos[colidx]._index;
                                    expr += "ret[" + index + "] = arr[" + index + "];";
                                }
                            }

                            expr += "return ret; };})();";

                            var convertFn = nexacro._executeGlobalEvalStr(expr);
                            for (var k = 0; k < rawRecords.length; k++)
                            {
                                ds._rawRecords[k] = convertFn(rawRecords[k]);
                                ds._rawRecords[k]._rawidx = rawRecords[k]._rawidx;
                                ds._rawRecords[k]._rtype = rawRecords[k]._rtype;
                                if (rawRecords[k]._orgcolstrings)
                                    ds._rawRecords[k]._orgcolstrings = convertFn(rawRecords[k]._orgcolstrings);

                            }
                        }

                    }

                    ds._reFilter();
                    ds._resetSortGroup();

                    if (ds._eventstat)
                    {
                        ds.on_fire_onload(errorcd, errormsg, 0); //nexacro.Dataset.REASON_LOAD  or nexacro.Dataset.REASON_APPEND
                        if (ds._viewRecords.length > 0)
                        {
                            ds._forcesetRowPosition(0, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                        }
                        else
                        {
                            ds._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                        }
                    }
                    else if (ds._viewRecords.length > 0)
                    {
                        ds._p_rowposition = 0;
                    }
                }
            }
        }
    };

    //for map file
    nexacro._ImgInfoCacheList = {};
    nexacro._getImageCacheMaps = function ()
    {
        return nexacro._ImgInfoCacheList;
    };

    nexacro._updateImageCacheMaps = function (arr)
    {
        if (!arr) return;

        const imgcache = nexacro._getImageCacheMaps();

        arr.forEach(function (item)
        {
            const path = nexacro._getImageLocation(item[0]);
            const width = item[1];
            const height = item[2];

            imgcache[path] = { width: width, height: height };
        });
    };

    // element id
    nexacro._prefixIDRootNodeClassName = function (nodeid)
    {
        const csscollisionpreventkey = nexacro.getEnvironment()?.csscollisionpreventkey;
        let retid = nodeid;
        if (csscollisionpreventkey)
        {
            retid = csscollisionpreventkey + "." + retid;
        }
        return retid;
    };
    nexacro._filterIDRootNodeClassName = function (nodeid)
    {
        const csscollisionpreventkey = nexacro.getEnvironment()?.csscollisionpreventkey;
        let retid = nodeid;
        if (csscollisionpreventkey)
        {
            const filterid = csscollisionpreventkey + "."
            retid = retid.replace(filterid, "");
        }
        return retid;

    };
    nexacro._getCSSPredefineValue = function (id)
    {
        const env = nexacro.getEnvironment();
        const css_predefine_map = nexacro._css_predefine_maps;
        if (!env.csscollisionpreventkey || !css_predefine_map)
            return undefined;

        const roocssclasslist = env._rootcssclasslist;
        const reverse_keys = Object.keys(css_predefine_map).reverse();
        for (const key of reverse_keys)
        {
            if (roocssclasslist.includes(key) && css_predefine_map[key].hasOwnProperty(id))
            {
                return css_predefine_map[key][id];
            }
        }
        return css_predefine_map[env.csscollisionpreventkey][id];
    };

    //for map.js 에서 screen 별 값 통합
    nexacro._getScreenCSSMapValue = function (styleobject, commonvalue, smallvalue, mediumvalue, largevalue, desktopvalue)
    {
        const env = nexacro.getEnvironment();
        let screentype = env._curscreentype;
        let screenvalue;
        switch (screentype)    
        {
            case "mobile_small": screenvalue = smallvalue; break;
            case "mobile_medium": screenvalue = mediumvalue; break;
            case "mobile_large": screenvalue = largevalue; break;
            case "desktop": screenvalue = desktopvalue; break;
            default: break;
        }

        if (!screenvalue)
            screenvalue = commonvalue;

        if (screenvalue)
            return styleobject(screenvalue);
        return null;
    };

    const isStyleObject = (obj) =>
    {
        return (
            obj &&
            typeof obj === 'object' &&
            typeof obj.value === 'string' &&
            typeof obj.valueOf === 'function' &&
            typeof obj.toString === 'function'
        );
    }

    const updateCSSMapObject = (target, source) =>
    {
        for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(source)))
        {
            if (typeof descriptor.get === 'function')
            {
                Object.defineProperty(target, key, descriptor);
                continue;
            }

            const sourceValue = descriptor.value;

            if (Array.isArray(sourceValue))
            {
                if (!Array.isArray(target[key])) target[key] = [];
                const targetArray = target[key];

                sourceValue.forEach(sourceItem =>
                {
                    const sourceKey = Object.keys(sourceItem)[0];
                    const targetItem = targetArray.find(item => Object.keys(item)[0] === sourceKey);
                    if (targetItem)
                    {
                        updateCSSMapObject(targetItem, sourceItem);
                    }
                    else
                    {
                        targetArray.push(sourceItem);
                    }
                });
            }
            else if (typeof sourceValue === 'object' && sourceValue !== null)
            {
                if (isStyleObject(sourceValue))
                {
                    target[key] = sourceValue;
                }
                else
                {
                    if (typeof target[key] !== 'object' || target[key] === null || Array.isArray(target[key]))
                    {
                        target[key] = {};
                    }
                    updateCSSMapObject(target[key], sourceValue);
                }
            }
            else
            {
                target[key] = sourceValue;
            }
        }
    };

    nexacro._setCSSPredefineMaps = function (map)
    {
        if (!nexacro._css_predefine_maps)
        {
            nexacro._css_predefine_maps = map;
        }
        else
        {
            updateCSSMapObject(nexacro._css_predefine_maps, map);
        }
    };

    nexacro._getCSSMaps = function ()
    {
        nexacro._dimension_maps = {};
        return nexacro._dimension_maps;
    };

    nexacro._setCSSMaps = function (map, extra)
    {
        if (!nexacro._dimension_maps)
        {
            nexacro._dimension_maps = map;
            nexacro._include_status_map = false;
        }
        else
        {
            updateCSSMapObject(nexacro._dimension_maps, map);
        }

        if (extra)
        {
            nexacro._include_status_map = extra.includeStatusMap;
            nexacro._has_listview_expand_status = extra.hasListViewExpandStatus;
            nexacro._apply_markup_validation = (nexacro._Browser == "Runtime") ? false : extra.applyMarkupValidation;
        }

        if (nexacro._apply_markup_validation)
        {
            nexacro._CSS_STATUS = "data-status";
            nexacro._CSS_USERSTATUS = "data-userstatus";
        }
        else
        {
            nexacro._CSS_STATUS = "status";
            nexacro._CSS_USERSTATUS = "userstatus";
        }
    };

    nexacro._clearCSSMaps = function ()
    {
        nexacro._dimension_maps = null;
    };

    nexacro._CommunicationItem = function (path, type, bcache, last_modified, version)
    {
        this.path = path;
        this.handle = null;
        this.callbackList = [];
        this.type = type;
        this.bcache = bcache;
        this.last_modified = last_modified;
        this.version = version ? version : "0";

        var ar = path.split("://");
        if (ar)
        {
            this.protocol = ar[0];
            switch (this.protocol)
            {
                case "http": this._protocol = 0; break;
                case "https": this._protocol = 1; break;
                case "file": this._protocol = 2; break;
                default: this._protocol = -1; break;
            }
        }

        this._addCookieFromCookieVariables();

        //== internal value ==//
        this._check_responseXML = false; // do not read responseXML.
    };
    var __pCommunicationItem = nexacro._CommunicationItem.prototype;

    __pCommunicationItem.appendCallback = function (pthis, callbackFn)
    {
        var callbackList = this.callbackList;
        callbackList.push({ target: pthis, callback: callbackFn });
    };

    __pCommunicationItem.removeCallback = function (pthis, callbackFn)
    {
        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                if (item.pthis == pthis && item.callback == callbackFn)
                {
                    callbackList.splice(i, 1);
                    if (callbackList.length === 0)
                    {
                        if (this.handle)
                            nexacro.__cancelCommunication(this.handle);
                        this.handle = null;
                        delete nexacro._CommunicationManager[this.path];
                    }
                    return true;
                }
            }
        }
        return false;
    };

    __pCommunicationItem._addCookieFromCookieVariables = function ()
    {
        nexacro._addCookieFromCookieVariables();
    };
    __pCommunicationItem._addCookieFromEnvHeadVariables = function (/*headers*/)
    {
        //var env = nexacro.getEnvironment();
        //Head Variable Cookie을 추가
        //TODO
        /*
        var len = headers.length;
        for (var i = 0; i < len; i++)
        {
            nexacro._setCookie(headers[i].id, headers[i].value);
        }*/
    };

    __pCommunicationItem._addCookieToCookieVariable = function (cookieStr)
    {
        nexacro._addCookieToCookieVariable(cookieStr);
    };

    __pCommunicationItem.on_decrypt = function (data)
    {
        if (this._protocol < 0)
        {
            var protocoladp = nexacro._getProtocol(this.protocol);
            if (protocoladp)
            {
                data = protocoladp.decrypt(this.path, data);
            }
        }
        return data;
    };

    __pCommunicationItem.on_encrypt = function (data)
    {
        if (this._protocol < 0)
        {
            var protocoladp = nexacro._getProtocol(this.protocol);
            if (protocoladp)
            {
                data = protocoladp.encrypt(this.path, data);
            }
        }
        return data;

    };

    __pCommunicationItem.on_start = nexacro._emptyFn;
    __pCommunicationItem.on_load = nexacro._emptyFn;

    __pCommunicationItem.on_load_module = function (data, cookie, last_modified)
    {
        // first, remove item from Manager
        // because, the new item can append at callback function.
        delete nexacro._CommunicationManager[this.path];
        var module;
        if (typeof (data) == "function")
        {
            module = data;
        }
        else if (typeof (data) == "undefined" && this.bcache)
        {
            var cache = nexacro._CacheList[this.path];
            module = cache.data;
        }
        else
        {
            if (this._protocol < 0)
            {
                data = this.on_decrypt(data);
            }

            this._addCookieToCookieVariable(cookie);

            if (this.path && this.path.indexOf("_resource_/_stringrc_/") > -1)
                module = nexacro._executeEvalStr(data, this.path);
            else
                module = nexacro._executeGlobalEvalStr(data, this.path);

            module.bcache = this.bcache;

            if (this.bcache)
            {
                var m_cache = nexacro._CacheList[this.path];

                if (!m_cache)
                {
                    nexacro._CacheList[this.path] = { data: module, last_modified: last_modified, version: this.version };
                }
                else
                {
                    m_cache.data = module;
                    m_cache.last_modified = last_modified;
                    m_cache.version = this.version;
                }
            }
        }

        var callbackList = this.callbackList;
        var item = null;

        if (callbackList.length > 0)
        {
            while (item = callbackList.pop())
            {
                var target = item.target;
                if (target && target.context && target.context.on_fire_oninit)
                {
                    target.context.on_fire_oninit(target.context);
                }

                item.callback.call(target, this.path, 0, module);
            }
        }

        this.handle = null;
    };

    __pCommunicationItem.on_load_text = function (data, cookie, last_modified)
    {
        delete nexacro._CommunicationManager[this.path];

        if (this._protocol < 0)
            data = this.on_decrypt(data);

        this._addCookieToCookieVariable(cookie);

        if (this.bcache)
        {
            var m_cache = nexacro._CacheList[this.path];
            if (!m_cache)
            {
                nexacro._CacheList[this.path] = { data: data, last_modified: last_modified, version: this.version };
            }
            else
            {
                m_cache.data = data;
                m_cache.last_modified = last_modified;
                m_cache.version = this.version;
            }
        }

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive !== false)
                {
                    item.callback.call(target, this.path, 0, data);
                }
            }
            callbackList.splice(0, n);
        }
        this.handle = null;
    };
    __pCommunicationItem.on_load_image = function (width, height)
    {
        delete nexacro._CommunicationManager[this.path];

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive !== false)
                {
                    item.callback.call(target, this.path, width, height);
                }
                else
                {
                    nexacro._releaseImageUrl(this.path);
                }
            }
            callbackList.splice(0, n);
        }
        this.handle = null;
    };
    __pCommunicationItem.on_load_update = function (data, cookie)
    {
        delete nexacro._CommunicationManager[this.path];
        if (this._protocol < 0)
            data = this.on_decrypt(data);

        this._addCookieToCookieVariable(cookie);

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive !== false)
                {
                    item.callback.call(target, this.path, 0);
                }
            }
            callbackList.splice(0, n);
        }
        this.handle = null;
    };
    __pCommunicationItem.on_load_json = function (data, cookie, last_modified)
    {
        delete nexacro._CommunicationManager[this.path];
        var module;

        if (this._protocol < 0)
            data = this.on_decrypt(data);

        this._addCookieToCookieVariable(cookie);

        if (typeof (data) == "object")
        {
            module = data;
        }
        else
        {
            try
            {
                module = JSON.parse(data);
            }
            catch (e)
            {
                module = (new Function("return " + data))();
            }
        }

        if (module)
            module.bcache = this.bcache;

        if (this.bcache)
        {
            var m_cache = nexacro._CacheList[this.path];
            if (!m_cache)
            {
                nexacro._CacheList[this.path] = { data: module, last_modified: last_modified, version: this.version };
            }
            else
            {
                m_cache.data = module;
                m_cache.last_modified = last_modified;
                m_cache.version = this.version;
            }
        }

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive !== false)
                {
                    item.callback.call(target, this.path, 0, module);
                }
            }
            callbackList.splice(0, n);
        }
        this.handle = null;
    };
    __pCommunicationItem.on_load_data = function (data, cookie/*, last_modified*/)
    {
        delete nexacro._CommunicationManager[this.path];
        if (this._protocol < 0)
            data = this.on_decrypt(data);

        this._addCookieToCookieVariable(cookie);

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive !== false)
                {
                    item.callback.call(target, this.path, 0, data);
                }
            }
            callbackList.splice(0, n);
        }
        this.handle = null;
    };

    __pCommunicationItem.on_load_dataobject = function (data, cookie/*, last_modified*/)
    {
        delete nexacro._CommunicationManager[this.path];
        if (this._protocol < 0)
            data = this.on_decrypt(data);

        this._addCookieToCookieVariable(cookie);

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive !== false)
                {
                    item.callback.call(target, this.path, 0, data);
                }
            }
            callbackList.splice(0, n);
        }
        this.handle = null;
    };

    __pCommunicationItem.on_load_arraybuffer = function (data, cookie/*, last_modified*/)
    {
        delete nexacro._CommunicationManager[this.path];
        if (this._protocol < 0)
            data = this.on_decrypt(data);

        this._addCookieToCookieVariable(cookie);

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive !== false)
                {
                    item.callback.call(target, this.path, 0, data);
                }
            }
            callbackList.splice(0, n);
        }
        this.handle = null;
    };

    __pCommunicationItem.on_progress = nexacro._emptyFn;
    __pCommunicationItem.on_progress_data = function (status, data)
    {
        if (this._protocol < 0)
            data = this.on_decrypt(data);

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive !== false)
                {
                    item.callback.call(target, this.path, 1, data);
                }
            }
        }
    };

    __pCommunicationItem.on_progress_arraybuffer_chunk = function (status, data)
    {
        if (this._protocol < 0)
            data = this.on_decrypt(data);

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive !== false)
                {
                    item.callback.call(target, this.path, 1, data);
                }
            }
        }
    };

    //errstatus : 마이너스값 , errorcode : 에러 테이블코드, returncode : 301.. 505, requesturi: , locationuri: 301인 경우
    //extramsg : 추가 runtime 메세지
    __pCommunicationItem.on_error = function (errstatus, fireerrorcode, returncode, locationuri, extramsg)
    {
        delete nexacro._CommunicationManager[this.path];

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive !== false)
                {
                    item.callback.call(target, this.path, errstatus, null, fireerrorcode, returncode, this.path, locationuri, extramsg);
                }
            }
            callbackList.splice(0, n);
        }
        this.handle = null;
    };

    __pCommunicationItem.on_error_image = function (width, height, handle, errstatus, fireerrorcode, returncode, locationuri, extramsg)
    {
        delete nexacro._CommunicationManager[this.path];

        var callbackList = this.callbackList;
        var n = callbackList.length;
        if (n > 0)
        {
            for (var i = 0; i < n; i++)
            {
                var item = callbackList[i];
                var target = item.target;
                if (target._is_alive !== false)
                {
                    item.callback.call(target, this.path, width, height, handle, errstatus, null, fireerrorcode, returncode, this.path, locationuri, extramsg);
                }
            }
            callbackList.splice(0, n);
        }
        this.handle = null;
    };

    __pCommunicationItem._destroy = nexacro._emptyFn;


    //==============================================================================
    // type : module, text, json, css
    nexacro._loadModule = function (type, path, target, handler, bcache, service, async, cssreq, cssfiletype)
    {
        var loadItem;
        var last_modified = "";
        if (async)
        {
            loadItem = nexacro._CommunicationManager[path];
            if (loadItem)
            {
                loadItem.appendCallback(target, handler);
                return loadItem.handle;
            }
        }

        var m_cache = nexacro._CacheList[path];

        if (service && m_cache)
        {
            if (service._p_cachelevel == "session" || service._p_cachelevel == "static")
            {
                if (m_cache.version >= service._p_version)
                {
                    let commtype = (type == "css") ? type : "module";
                    loadItem = new nexacro._CommunicationItem(path, commtype, false);
                    loadItem.appendCallback(target, handler);

                    loadItem.bcache = false;
                    if (type == "module" || type == "json")
                        loadItem._handle = nexacro._startCommunication(loadItem, path, "default", async, service);
                    else
                        loadItem.on_load_module(m_cache.data, null);
                    return loadItem.handle;
                }
            }

            m_cache.version = service._p_version;
            last_modified = m_cache.last_modified;
        }

        var bcache = true;
        if (!service || service._p_cachelevel == "none" || type == "css")
            bcache = false;

        loadItem = new nexacro._CommunicationItem(path, type, bcache, last_modified, service ? service._p_version : "0");
        nexacro._CommunicationManager[path] = loadItem;
        loadItem.appendCallback(target, handler);

        loadItem.handle = nexacro._startCommunication(loadItem, path, service ? service._p_cachelevel : "none", async, service, path, cssreq, cssfiletype);
        return loadItem.handle;
    };

    nexacro._loadUpdateModule = function (path, target, handler, service, async, type, targetpath, ref, ver, failpass)
    {
        var loadItem;
        if (async)
        {
            loadItem = nexacro._CommunicationManager[path];
            if (loadItem)
            {
                loadItem.appendCallback(target, handler);
                return loadItem.handle;
            }
            else
            {
                loadItem = new nexacro._CommunicationItem(path, "update");
                nexacro._CommunicationManager[path] = loadItem;
                loadItem.appendCallback(target, handler);
                loadItem.handle = nexacro._startCommunication(loadItem, path, "dynamic", true, service, null, type, targetpath, ref, ver, failpass);
                return loadItem.handle;
            }
        }
        else
        {
            loadItem = new nexacro._CommunicationItem(path, "update");
            loadItem.appendCallback(target, handler);
            nexacro._startCommunication(loadItem, path, "dynamic", false, service, null, type, targetpath, ref, ver, failpass);
        }

        handler.call(target, 0);
        return null;
    };

    nexacro._loadDataObject = function (path, target, handler, service, form, svcid, method, outdataobj, parameters, async, datatype, compress)
    {
        var loadItem;
        var last_modified = "";
        var servicecachelevel = service._p_cachelevel;
        var postdata;

        var d_cache = nexacro._DataObjectCacheList[path];
        if (service && d_cache)
        {
            if (service._p_cachelevel == "session" || service._p_cachelevel == "static")
            {
                if (!service._p_version || d_cache.version >= service._p_version)
                {
                    // getDataFromCache
                    loadItem = new nexacro.RESTAPIItem(path, form, svcid, method, outdataobj, parameters, datatype, async);
                    loadItem.appendCallback(target, handler);

                    loadItem.bcache = false;
                    loadItem.on_load_dataobject(d_cache, "", "");
                    return loadItem.handle;
                }
            }

            d_cache.version = service._p_version;
            last_modified = d_cache.last_modified;
        }

        loadItem = new nexacro.RESTAPIItem(path, form, svcid, method, outdataobj, parameters, datatype, async, last_modified, service._p_version);

        if (service && service._p_cachelevel != "none")
            loadItem.bcache = true;

        loadItem.last_modified = last_modified;

        loadItem.appendCallback(target, handler);
        loadItem.on_start();
        target.transactionList.push(loadItem);
        postdata = loadItem.postdata ? loadItem.postdata : null;
        service._p_cachelevel = servicecachelevel; // restore
        //return nexacro._startCommunication(loadItem, path, service.cachelevel, async, service, (form ? form._url : ""), loadItem._sendData, datatype, compress);
        return nexacro._startRESTAPICommunication(loadItem, path, service._p_cachelevel, async, service, (form ? form._url : ""), postdata, datatype, compress);
    };

    nexacro._loadData = function (path, target, handler, service, form, svcid, indatasets, outdatasets, parameters, async, datatype, compress)
    {
        var loadItem;
        var last_modified = "";
        var servicecachelevel = service._p_cachelevel;

        var d_cache = nexacro._DataCacheList[path];
        if (service && d_cache)
        {
            if (service._p_cachelevel == "session" || service._p_cachelevel == "static")
            {
                if (!service._p_version || d_cache.version >= service._p_version)
                {
                    // getDataFromCache
                    loadItem = new nexacro.TransactionItem(path, form, svcid, indatasets, outdatasets, parameters, datatype, async);
                    loadItem.appendCallback(target, handler);

                    loadItem.bcache = false;
                    loadItem.on_load_data(d_cache, "", "");
                    return loadItem.handle;
                }
            }

            d_cache.version = service._p_version;
            last_modified = d_cache.last_modified;
        }

        loadItem = new nexacro.TransactionItem(path, form, svcid, indatasets, outdatasets, parameters, datatype, async, last_modified, service._p_version);

        if (service && service._p_cachelevel != "none")
            loadItem.bcache = true;

        loadItem.last_modified = last_modified;

        loadItem.appendCallback(target, handler);
        loadItem.on_start();
        target.transactionList.push(loadItem);

        service._p_cachelevel = servicecachelevel; // restore
        return nexacro._startCommunication(loadItem, path, service._p_cachelevel, async, service, (form ? form._url : ""), loadItem._sendData, datatype, compress);
    };

    nexacro._preloadData = function (path, target, handler, service, svcid, referer, args, async, datatype, compress)
    {
        var bcache = false;
        var last_modified = "";
        var d_cache = nexacro._DataCacheList[path];
        var loadItem;
        if (service && d_cache)
        {
            if (service._p_cachelevel == "session" || service._p_cachelevel == "static")
            {
                if (!service._p_version || d_cache.version >= service._p_version)
                {
                    // getDataFromCache
                    loadItem = new nexacro._CommunicationItem(svcid, "data");
                    loadItem.bcache = bcache;
                    loadItem.appendCallback(target, handler);

                    loadItem.bcache = false;
                    loadItem.on_load_data(d_cache, "", "");

                    return loadItem.handle;
                }
            }

            d_cache.version = service._p_version;
            last_modified = d_cache.last_modified;
        }

        if (service && service._p_cachelevel != "none")
            bcache = true;

        var tritem = new nexacro.TransactionItem(path, target.context, svcid, "", "", args, 0, async);

        if (async)
        {
            loadItem = new nexacro._CommunicationItem(svcid, "data");
            loadItem.bcache = bcache;
            loadItem.last_modified = last_modified;

            loadItem.appendCallback(target, handler);
            loadItem.handle = nexacro._startCommunication(loadItem, path, "none", true, service, referer, tritem._sendData, datatype, compress);
            return loadItem.handle;
        }
        else
        {
            loadItem = new nexacro._CommunicationItem(svcid, "data");
            loadItem.bcache = bcache;
            loadItem.last_modified = last_modified;

            loadItem.appendCallback(target, handler);
            nexacro._startCommunication(loadItem, path, "none", false, service, referer, tritem._sendData, datatype, compress);
        }
    };

    nexacro._preloadDataObject = function (path, target, handler, service, svcid, referer, args, async, datatype, compress)
    {
        var bcache = false;
        var last_modified = "";
        var d_cache = nexacro._DataCacheList[path];
        var loadItem;
        if (service && d_cache)
        {
            if (service._p_cachelevel == "session" || service._p_cachelevel == "static")
            {
                if (!service._p_version || d_cache.version >= service._p_version)
                {
                    // getDataFromCache
                    loadItem = new nexacro._CommunicationItem(svcid, "dataobject");
                    loadItem.bcache = bcache;
                    loadItem.appendCallback(target, handler);

                    loadItem.bcache = false;
                    loadItem.on_load_dataobject(d_cache, "", "");

                    return loadItem.handle;
                }
            }

            d_cache.version = service._p_version;
            last_modified = d_cache.last_modified;
        }

        if (service && service._p_cachelevel != "none")
            bcache = true;
        var tritem = new nexacro.RESTAPIItem(path, target.context, svcid, "", "", args, 0, async);

        if (async)
        {
            loadItem = /*tritem*/ new nexacro._CommunicationItem(svcid, "dataobject");
            loadItem.bcache = bcache;
            loadItem.last_modified = last_modified;

            loadItem.appendCallback(target, handler);
            loadItem.handle = nexacro._startRESTAPICommunication(loadItem, path, "none", true, service, referer, tritem._sendData, datatype, compress);
            return loadItem.handle;
        }
        else
        {
            loadItem = /*tritem;*/new nexacro._CommunicationItem(svcid, "dataobject");
            loadItem.bcache = bcache;
            loadItem.last_modified = last_modified;

            loadItem.appendCallback(target, handler);
            nexacro._startRESTAPICommunication(loadItem, path, "none", false, service, referer, tritem._sendData, datatype, compress);
        }
    };

    nexacro._startCommunication = function (loadItem, url, cachelevel, async, service, referer, data, ndatatype, compress, ver, failpass)
    {
        //user protocol
        var path = url;
        var senddata = data;
        if (loadItem._protocol < 0)
        {
            var createadaptor = false;
            var protocoladp = nexacro._getProtocol(loadItem.protocol);
            if (!protocoladp)
            {
                var isprotocol = nexacro._isProtocol(loadItem.protocol);
                if (isprotocol)
                {
                    var adptorclass = nexacro._executeGlobalEvalStr(loadItem.protocol);
                    if (adptorclass)
                    {
                        protocoladp = new adptorclass;
                        createadaptor = true;
                    }
                }

                if (!protocoladp)
                {
                    if (nexacro.ProtocolAdp.isRuntimeProtocol && nexacro.ProtocolAdp.isRuntimeProtocol(loadItem.protocol))
                    {
                        protocoladp = new nexacro.ProtocolAdp;
                        protocoladp.protocolname = loadItem.protocol;
                        createadaptor = true;
                    }
                }
            }

            if (protocoladp)
            {
                if (createadaptor && protocoladp.initialize)
                {
                    protocoladp.initialize(url);
                    nexacro._addProtocol(loadItem.protocol, protocoladp);
                }

                var protocol = protocoladp.getUsingProtocol(url);
                var sep = path.split("://");
                if (sep)
                {
                    path = protocol + "://" + sep[1];
                }

                // encode
                if (data && protocoladp.encrypt)
                {
                    senddata = loadItem.on_encrypt(data);
                }

                // extra header 정보
                if (protocoladp.getCommunicationHeaders)
                {
                    var headers = protocoladp.getCommunicationHeaders(url);
                    if (nexacro._isArray(headers))
                    {
                        var len = headers.length;
                        for (var i = 0; i < len; i++)
                        {
                            nexacro._setCookie(headers[i].id, headers[i].value);
                        }
                    }
                }
            }
        }
        return nexacro.__startCommunication(loadItem, path, cachelevel, async, referer, senddata, ndatatype, compress, ver, failpass, service);
    };

    //수정해야됨
    nexacro._startRESTAPICommunication = function (loadItem, url, cachelevel, async, service, referer, data, ndatatype, compress, ver, failpass)
    {
        //user protocol
        var path = url;
        var senddata = data;
        if (loadItem._protocol < 0)
        {
            var createadaptor = false;
            var protocoladp = nexacro._getProtocol(loadItem.protocol);
            if (!protocoladp)
            {
                var isprotocol = nexacro._isProtocol(loadItem.protocol);
                if (isprotocol)
                {
                    var adptorclass = nexacro._executeGlobalEvalStr(loadItem.protocol);
                    if (adptorclass)
                    {
                        protocoladp = new adptorclass;
                        createadaptor = true;
                    }
                }

                if (!protocoladp)
                {
                    if (nexacro.ProtocolAdp.isRuntimeProtocol && nexacro.ProtocolAdp.isRuntimeProtocol(loadItem.protocol))
                    {
                        protocoladp = new nexacro.ProtocolAdp;
                        protocoladp.protocolname = loadItem.protocol;
                        createadaptor = true;
                    }
                }
            }

            if (protocoladp)
            {
                if (createadaptor && protocoladp.initialize)
                {
                    protocoladp.initialize(url);
                    nexacro._addProtocol(loadItem.protocol, protocoladp);
                }

                var protocol = protocoladp.getUsingProtocol(url);
                var sep = path.split("://");
                if (sep)
                {
                    path = protocol + "://" + sep[1];
                }

                // encode
                if (data && protocoladp.encrypt)
                {
                    senddata = loadItem.on_encrypt(data);
                }

                // extra header 정보
                if (protocoladp.getCommunicationHeaders)
                {
                    var headers = protocoladp.getCommunicationHeaders(url);
                    if (nexacro._isArray(headers))
                    {
                        var len = headers.length;
                        for (var i = 0; i < len; i++)
                        {
                            nexacro._setCookie(headers[i].id, headers[i].value);
                        }
                    }
                }
            }
        }
        return nexacro.__startRESTAPICommunication(loadItem, path, cachelevel, async, referer, senddata, ndatatype, compress, ver, failpass, service);
        //RESTAPI 통신        
    };

    nexacro.__startRESTAPICommunication = function (loadItem, path, cachelevel, async, referer, senddata, ndatatype, compress, ver, failpass, service)
    {
        function getRESTAPI()
        {
            var xhrobj = {};
            var use_fakexhr = false;
            if (nexacro._isHybrid && nexacro._isHybrid())
            {
                if (nexacro._OS == "iOS")
                {
                    // local에서는 Fetch API, XHR 모두 동작하지 않으므로 FakeXHR을 사용한다.
                    if (document.location.href.indexOf("file://") == 0)
                        use_fakexhr = true;
                }

                if (nexacro._OS == "Android")
                {
                    // local에서 cookie를 지원하기 위해서 FakeXHR을 사용한다.
                    if (loadItem.type == "data" && document.location.href.indexOf("file://") == 0)
                        use_fakexhr = true;
                }

                if (compress)
                    use_fakexhr = true;

                // Preload, 절대경로는 _protocol값 만으로 걸러지지 않음.
                if (loadItem._protocol == -1)
                {
                    // Preload의 경우 path에 "__preload_" 가 앞에 붙는다.
                    // 절대 경로는 path에 절대경로 그대로 들어옴
                    var ar = path.split("://");
                    if (ar)
                    {
                        if (ar.length == 1) // Protocol이 존재하지 않는 경우
                        {
                            use_fakexhr = false;
                        }
                        else
                        {
                            var real_protocol = ar[0];
                            switch (real_protocol)
                            {
                                case "http":
                                case "https":
                                case "file":
                                    use_fakexhr = false;
                                    break;
                                default:
                                    use_fakexhr = true; // Protocol Adaptor 사용하는 경우
                                    break;
                            }
                        }
                    }
                }
            }

            if (use_fakexhr)
            {
                xhrobj.handle = new nexacro.FakeXMLHttpRequest("FakeXMLHttpRequest", this, ndatatype, compress, async);

                // [24/03/20][RP 99460] - 여기서 destory 해줘야. FakeXMLHttpRequest에서 release됨.
                xhrobj._destroy = function ()
                {
                    if (this.handle)
                        this.handle.destory();
                };
            }
            else
            {
                xhrobj.handle = new XMLHttpRequest();
                xhrobj._destroy = nexacro._emptyFn;
            }

            return xhrobj;
        };
        var rest = getRESTAPI();
        var rest_handle = rest.handle;

        var bindfn = null;
        var method = "GET";

        bindfn = nexacro.__bindLoadDataObjectHandler(rest, loadItem);
        method = loadItem.method ? loadItem.method : "GET";

        rest_handle.onreadystatechange = bindfn;

        if (rest_handle.onerror !== undefined)
            rest_handle.onerror = bindfn;

        if (method == "GET" || method == "HEAD")// || method == "DELETE")
        {
            senddata = null;
        }

        if (path)
        {
            var ar = path.split("://");
            if (ar.length > 0)
            {
                var protocol = ar[0];
                if (protocol == "file")
                    path = nexacro._decodeURI(path);
                else
                    path = nexacro._encodeURI(path);
            }
        }
        const env = nexacro.getEnvironment();
        const envhttpretry = env ? env._p_httpretry : 0;
        var httpretry = (loadItem._httpretry !== undefined) ? loadItem._httpretry : envhttpretry;
        if (httpretry >= 1)
        {
            rest._path = path;
            rest._cachelevel = cachelevel;
            rest._async = async;
            rest._referer = referer;
            rest._senddata = senddata;
            rest._ndatatype = ndatatype;
            rest._compress = compress;
            rest._ver = ver;
            rest._failpass = failpass;
            rest._service = service;

            rest._httpretry = httpretry;
            rest._method = method;
            rest._bindfn = bindfn;
        }

        try
        {
            //trace(method, path);
            rest_handle.open(method, path, !!async);
        }
        catch (e)
        {
            var extrmsg = e.number + " " + e.message;
            loadItem.on_error(e.number, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.failunknown, "", extrmsg); //Check

            rest = null;
            return null;
        }

        //JSON
        //rest_handle.setRequestHeader("Content-Type", "application/json");


        if (env && env.networksecurelevel == "all")
        {
            rest_handle.withCredentials = true;
        }


        var protocoladp = nexacro._getProtocol(loadItem.protocol);
        if (protocoladp && protocoladp.version)
        {
            var protocolver = protocoladp.version();
            if (protocolver > "1.0")
            {
                var httpheaders = protocoladp.getHTTPHeader();
                var httpheaderlen = httpheaders.length;
                for (var i = 0; i < httpheaderlen; i++)
                {
                    rest_handle.setRequestHeader(httpheaders[i].id, httpheaders[i].value);
                }
            }
        }

        var httpvariables = nexacro._getSharedVariableAll(5);
        if (httpvariables)
        {
            for (var prop in httpvariables)
            {
                if (httpvariables.hasOwnProperty(prop))
                {
                    rest_handle.setRequestHeader(prop, httpvariables[prop].value);
                }
            }
        }

        if (service)
        {
            if (service._p_cachelevel == "none")
            {
                rest_handle.setRequestHeader("cache-control", "no-cache, no-store");
                rest_handle.setRequestHeader("Pragma", "no-cache");
                rest_handle.setRequestHeader("If-Modified-Since", "Sat, 01 Jan 2000 00:00:00 GMT");
                rest_handle.setRequestHeader("Expires", -1);
                //rest_handle.setRequestHeader("Access-Control-Allow-Origin", "*");
                //rest_handle.setRequestHeader("Access-Control-Max-Age", "3600");
                //rest_handle.setRequestHeader("Access-Control-Allow-Credentials", "true");
                //rest_handle.setRequestHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
                //rest_handle.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

            }
            else
            {
                rest_handle.setRequestHeader("cache-control", "no-cache");
                if (loadItem.last_modified)
                    rest_handle.setRequestHeader("If-Modified-Since", loadItem.last_modified);
            }
        }
        try
        {
            var httptimeout = envhttpretry;

            if (async)
            {
                // httptimeout property use for only async                    
                if (rest_handle.timeout != undefined && httptimeout >= 0 && httptimeout <= 2147483) //no have property from made by activeObject, add check property by comnik 20150324
                {
                    rest_handle.timeout = httptimeout * 1000;

                    // set the timeout & onload callback for timeout checking
                    rest_handle.ontimeout = bindfn;
                    rest_handle.onload = bindfn;
                }
            }

            //header
            var headers = loadItem.header;
            if (headers)
            {
                for (var prop in headers)
                {
                    //trace(prop, headers[prop]);
                    rest_handle.setRequestHeader(prop, headers[prop]);
                }
            }

            rest_handle.send(senddata ? senddata : null);

            if (!async)
                bindfn(rest, loadItem);

        }
        catch (e)
        {
            if (rest._user_aborted)
                loadItem.on_error(e.number, "comm_stop_transaction_byesc", nexacro._CommunicationStatusTable.stop_transaction_byesc);
            else
                loadItem.on_error(e.number, "comm_fail_loaddetail", nexacro._CommunicationStatusTable.failunknown, "", e.number);
            return null;
        }
        rest_handle = null;
        return rest;
    };

    nexacro.__retryRESTCommunication = function (_ajax, loaditem)
    {
        if (!_ajax || !loaditem)
            return false;

        var path = _ajax._path;
        var async = _ajax._async;
        var senddata = _ajax._senddata;
        var referer = _ajax._referer;
        var service = _ajax._service;
        var cachelevel = _ajax._cachelevel;
        var ndatatype = _ajax._ndatatype;
        var compress = _ajax._compress;
        var ver = _ajax._ver;
        var failpass = _ajax._failpass;
        var httpretry = _ajax._httpretry;

        loaditem._httpretry = httpretry - 1;
        _ajax.handle.abort();

        _ajax._destroy();
        _ajax = null;

        nexacro.__startRESTAPICommunication(loaditem, path, cachelevel, async, referer, senddata, ndatatype, compress, ver, failpass, service);

        return true;
    };

    nexacro._removedatalist = function (datalist, index)
    {
        return (index < 0 || index > datalist.length) ? datalist : datalist.slice(0, index).concat(datalist.slice(index + 1, datalist.length));
    };

    nexacro._cancelLoad = function (handle, url)
    {
        if (url)
        {
            if (nexacro._CommunicationManager[url])
            {
                delete nexacro._CommunicationManager[url];
            }
        }
        if (handle)
            nexacro.__cancelCommunication(handle);
    };

    // Transaction 중단 (flag 0: 동일 form / 1: 동일 window / 2: 모두)
    nexacro._stopTransaction = function (form, flag)
    {
        if (!form && flag != 2)
            return;

        var form_window;
        var ret = 0;
        var contextlist = nexacro._comm_contextlist.slice(0, nexacro._comm_contextlist.length); // copy array
        for (var i = 0; i < contextlist.length; i++)
        {
            var cur_context = contextlist[i];
            if (flag === 0)
            {
                if (cur_context == form)
                {
                    return form._stopTransaction();
                    //return;
                }
            }
            else if (flag == 1)
            {
                if (!form_window)
                    form_window = form._getWindow();
                if (form_window == cur_context._getWindow())
                {
                    ret = cur_context._stopTransaction();
                }
            }
            else if (flag == 2)
            {
                ret = cur_context._stopTransaction();
            }
        }
        return ret;
    };

    // 모든 Transaction 중단 for AX/Plugin stop Method
    nexacro._stopTransactionAll = function ()
    {
        nexacro._stopTransaction(null, 2);
    };

    //Hotkey
    nexacro._registerHotkeyComp = function (base, comp, hotkey, altKey, ctrlKey, shiftKey)
    {
        if (!hotkey)
            return;

        if (hotkey instanceof nexacro._HotKey)
        {
            base._hotkey_list.push([comp, hotkey._keycode,
                ((hotkey._modifierkey & 0x02) == 0x02),
                ((hotkey._modifierkey & 0x01) == 0x01),
                ((hotkey._modifierkey & 0x04) == 0x04)]);
            hotkey._is_registered = true;
        }
        else
        {
            var keycode = hotkey;
            base._hotkey_list.push([comp, keycode, altKey, ctrlKey, shiftKey]);
        }
    };

    nexacro._unregisterHotkeyComp = function (base, comp, hotkey, altKey, ctrlKey, shiftKey)
    {
        if (!hotkey)
            return;

        var keycode;
        if (hotkey instanceof nexacro._HotKey)
        {
            keycode = hotkey._keycode;
            altKey = ((hotkey._modifierkey & 0x02) == 0x02);
            ctrlKey = ((hotkey._modifierkey & 0x01) == 0x01);
            shiftKey = ((hotkey._modifierkey & 0x04) == 0x04);
        }
        else
        {
            keycode = hotkey;
        }

        var hotkey_list = base._hotkey_list;
        var cnt = hotkey_list.length;
        for (var i = 0; i < hotkey_list.length; i++)
        {
            var hotkey_info = hotkey_list[i];
            if (hotkey_info[1] == keycode &&
                hotkey_info[2] == altKey &&
                hotkey_info[3] == ctrlKey &&
                hotkey_info[4] == shiftKey)
            {
                for (var j = i; j < cnt - 1; j++)
                {
                    hotkey_list[j] = hotkey_list[j + 1];
                }
                hotkey_list[cnt - 1] = null;
                hotkey_list.length = hotkey_list.length - 1;

                if (hotkey instanceof nexacro._HotKey)
                {
                    hotkey._is_registered = false;
                }
                break;
            }
        }
    };

    nexacro._getFirstTouchInfo = function (touchinfos)
    {
        for (var i = 0; i < touchinfos.length; i++)
        {
            if (touchinfos[i].isfirst === true)
            {
                return touchinfos[i];
            }
        }
        return null;
    };

    nexacro._getElementRootComponent = function (elem)
    {
        var control_elem = elem;
        if (control_elem)
        {
            while (control_elem && !control_elem.linkedcontrol)
            {
                control_elem = control_elem.parent;
            }
            var comp = control_elem.linkedcontrol;
            while (comp && (comp._is_subcontrol || !comp._is_component))
            {
                if (comp == comp._p_parent) break;
                comp = comp._p_parent;
            }
            return comp;
        }
    };

    nexacro._isDesktop = function ()
    {
        var system_type = nexacro._SystemType.toLowerCase();
        switch (system_type)
        {
            case "win32": case "win64": case "mac": case "linux":
                return true;

            case "ipad":
            case "iphone":
            case "winphone":
            case "android":
                return false;

            default:
                break;
        }

        return true;
    };

    nexacro._isPortrait = function ()
    {
        var orientation = nexacro._getMobileOrientation();
        if (orientation === 0 || orientation == 1)
            return true;
        return false;
    };

    //nexacro._enableaccessibility = false;  -> _pEnvironment._p_enableaccessibility
    //nexacro._accessibilitytype = 1;         -> _pEnvironment._accessibilitytype
    //nexacro._accessibilitydescreadtype = 0x01;  -> _pEnvironment._accessibilitydescreadtype
    //nexacro._accessibilitywholereadtype = 0;    -> _pEnvironment._accessibilitywholereadtype

    nexacro._setEnableAccessibility = nexacro._emptyFn;
    nexacro._setAccessibilityType = nexacro._emptyFn;
    nexacro._setAccessibilityDescReadType = nexacro._emptyFn;
    nexacro._setAccessibilityWholeReadType = nexacro._emptyFn;
    nexacro._notifyAccessibilityInputElement = nexacro._emptyFn;
    nexacro._createNotifyAccessibilityInputElement = nexacro._emptyFn;
    nexacro._getAccessibilityVirtualCursorMouseEvent = function (evt) { return false; }; /* mouse event check from virtual cursor in sensereader */


    //===============================================================
    // nexacro.ProtocolAdp
    //===============================================================
    nexacro.ProtocolAdp = function ()
    {
        nexacro.Object.call(this);
    };
    var _pProtocolAdp = nexacro._createPrototype(nexacro.Object, nexacro.ProtocolAdp);
    nexacro.ProtocolAdp.prototype = _pProtocolAdp;
    _pProtocolAdp._type_name = "ProtocolAdp";

    _pProtocolAdp.encrypt = function (strUrl, data)
    {
        return data;
    };
    _pProtocolAdp.decrypt = function (strUrl, data)
    {
        return data;
    };

    _pProtocolAdp.initialize = function ()
    {

    };
    _pProtocolAdp.finalize = function ()
    {

    };

    _pProtocolAdp.getUsingProtocol = function (strUrl)
    {
        return "http";
    };
    _pProtocolAdp.getCommunicationHeaders = function (strUrl)
    {
        return [];
    };

    //===============================================================
    // nexacro.DeviceAdaptor
    //===============================================================
    nexacro.DeviceAdaptor = function (id, parent)			
    {
        nexacro._EventSinkObject.call(this, id, parent);

        this._handle = null;
    };


    var _pDeviceAdaptor = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.DeviceAdaptor);
    nexacro.DeviceAdaptor.prototype = _pDeviceAdaptor;

    _pDeviceAdaptor.initialize = function (configs)	
    {
        // 공통로직
        if (!nexacro.__isDesignMode || !nexacro.__isDesignMode())
            this._handle = this.init(configs);  //리턴값 필수, 받은 리턴값을 unique값이어야 함 getDeviceID 의 리턴값으로 사용됨

    };

    _pDeviceAdaptor.finalize = function ()	
    {
        // 공통로직
        this.destroy(this._handle);
    };

    //재정의 불가 	
    _pDeviceAdaptor.getDeviceHandle = function () 	
    {
        return this._handle;
    };

    _pDeviceAdaptor.init = function (configs)  
    {
        //return 값 필수
        /*return uniquekey;*/
    };

    _pDeviceAdaptor.processEvent = function (eventid, eventtype, data)  	
    {
        this.on_event(eventid, eventtype, data);
    };

    _pDeviceAdaptor.fireEvent = function (eventid, eventtype, deviceid, data)	
    {
        let ret;
        let _win;
        let app;
        if (this.parent && this.parent._getRootObject)
        {
            let target = this.parent._getRootObject();
            _win = target._getActiveWindow();
        }
        else
        {
            app = nexacro.getApplication();
            _win = app._getActiveWindow();
        }
        if (_win)
        {
            ret = _win._on_sys_onextendedcommand(eventid, eventtype, deviceid, data);
        }
        return ret;
    };

    _pDeviceAdaptor.callMethod = function () 
    {
        var handle = this._handle;
        if (handle) 
        {
            var arrArguments =
                [
                    handle,
                    1
                ];
            for (var i = 0; i < arguments.length; i++)
                arrArguments.push(arguments[i]);
            return nexacro._callExtensionLibraryMethod.apply(this, arrArguments);
        }
    };

    _pDeviceAdaptor.destroy = nexacro._emptyFn;
    _pDeviceAdaptor.on_event = function (eventid, eventtype, data)
    {

    };
    _pDeviceAdaptor.on_event_default_action = nexacro._emptyFn;

    nexacro.MakeError = function (type/*, obj, code, arg1*/)
    {
        var _args = Array.prototype.slice.call(arguments, 1);
        return nexacro._MakeError(type, _args);
    };

    nexacro.MakeEvalError = function (/*obj, code, arg1*/)
    {
        return nexacro._MakeError(EvalError, arguments);
    };

    nexacro.MakeRangeError = function (/*obj, code, arg1*/)
    {
        return nexacro._MakeError(RangeError, arguments);
    };

    nexacro.MakeReferenceError = function (/*obj, code, arg1*/)
    {
        return nexacro._MakeError(ReferenceError, arguments);
    };

    nexacro.MakeSyntaxError = function (/*obj, code, arg1*/)
    {
        return nexacro._MakeError(SyntaxError, arguments);
    };

    nexacro.MakeTypeError = function (/*obj, code, arg1*/)
    {
        return nexacro._MakeError(TypeError, arguments);
    };

    nexacro.MakeNativeError = function (/*obj, code, arg1*/)
    {
        return nexacro._MakeError(nexacro.NativeError, arguments);
    };

    nexacro.MakeCommunicationError = function (/*obj, code, arg1*/)
    {
        return nexacro._MakeError(nexacro.CommunicationError, arguments);
    };

    nexacro.MakeURIError = function (/*obj, code, arg1*/)
    {
        return nexacro._MakeError(URIError, arguments);
    };

    nexacro._MakeError = function (type, args)
    {
        var _args = Array.prototype.slice.call(args, 1);
        var str = nexacro._getErrorMessge.apply(this, _args);
        var error;
        if (type && (typeof (type) == "function"))
            error = new type(str);
        else
        {
            error = new Error(str);
            error.name = type;
        }

        error.obj = args[0];
        return error;
    };

    nexacro.CommunicationError = function (message)
    {
        this.name = "CommunicationError";
        this.message = message;
        this.obj = null;
    };

    var _pCommunicationError = nexacro._createPrototype(Error, nexacro.CommunicationError);
    nexacro.CommunicationError.prototype = _pCommunicationError;
    nexacro.CommunicationError._type_name = "CommunicationError";

    nexacro.NativeError = function (message)
    {
        this.name = "NativeError";
        this.message = message;
        this.obj = null;
    };
    var _pNativeError = nexacro._createPrototype(Error, nexacro.NativeError);
    nexacro.NativeError.prototype = _pNativeError;
    nexacro.NativeError._type_name = "NativeError";

    if (!nexacro._AccessibilityUtil)
    {
        nexacro._AccessibilityUtil = {};
        nexacro._AccessibilityUtil.Hotkey = {};
        nexacro._AccessibilityUtil.Hotkey.NONE = 0;
        nexacro._AccessibilityUtil.Hotkey.FIRSTCELL = 1;
        nexacro._AccessibilityUtil.Hotkey.LASTCELL = 2;
        nexacro._AccessibilityUtil.Hotkey.FIRSTCELLINCOLUMN = 3;
        nexacro._AccessibilityUtil.Hotkey.LASTCELLINCOLUMN = 4;
        nexacro._AccessibilityUtil.Hotkey.FIRSTCELLINROW = 5;
        nexacro._AccessibilityUtil.Hotkey.LASTCELLINROW = 6;

        /* Grid Hotkey */
        nexacro._AccessibilityUtil.GridHotkeyList = {};
        nexacro._AccessibilityUtil.GridHotkeyList[nexacro.Event.KEY_CTRL + " " + nexacro.Event.KEY_ALT + " " + nexacro.Event.KEY_HOME] = nexacro._AccessibilityUtil.Hotkey.FIRSTCELLINROW;
        nexacro._AccessibilityUtil.GridHotkeyList[nexacro.Event.KEY_CTRL + " " + nexacro.Event.KEY_ALT + " " + nexacro.Event.KEY_END] = nexacro._AccessibilityUtil.Hotkey.LASTCELLINROW;
        nexacro._AccessibilityUtil.GridHotkeyList[nexacro.Event.KEY_CTRL + " " + nexacro.Event.KEY_ALT + " " + nexacro.Event.KEY_PAGE_UP] = nexacro._AccessibilityUtil.Hotkey.FIRSTCELLINCOLUMN;
        nexacro._AccessibilityUtil.GridHotkeyList[nexacro.Event.KEY_CTRL + " " + nexacro.Event.KEY_ALT + " " + nexacro.Event.KEY_PAGE_DOWN] = nexacro._AccessibilityUtil.Hotkey.LASTCELLINCOLUMN;

        nexacro._AccessibilityUtil.checkComponentHotkey = nexacro._emptyFn;
        nexacro._AccessibilityUtil.getAccessibilityLabel = nexacro._emptyFn;
        nexacro._AccessibilityUtil.getAccessibilityAction = nexacro._emptyFn;
        nexacro._AccessibilityUtil.getAccessibilityDescription = nexacro._emptyFn;
        nexacro._AccessibilityUtil.setDOMNodeLabel = nexacro._emptyFn;
        nexacro._AccessibilityUtil.supportMobileApplicationAccessibility = nexacro._emptyFn;
        nexacro._AccessibilityUtil.unsupportMobileApplicationAccessibility = nexacro._emptyFn;
        nexacro._AccessibilityUtil.cancelTouchEvent = nexacro._emptyFn;

        nexacro._AccessibilityUtil.isUseTooltipText = function ()
        {
            return true;
        };
    }

    //nexacro.loadStringResource ("en")  -> usestringresourcce = true 동작
    //nexacro.loadStringResource ("Service::test")  -> full 경로로 호출 
    //nexacro.loadStringResource ("en", "Service::test") -> Service::test?lang=en 으로 호출
    nexacro.loadStringResource = function (lang, url)
    {
        var base_url;
        const env = nexacro.getEnvironment();
        let stringrcfileid;
        if (arguments.length == 1)
        {
            if (lang.length <= 2)
            {
                if (!env.usestringresource)
                    return;

                var langinfo = env.on_getResourceLanguageInfo();
                if (env.on_getStringResourceFileExt)
                {
                    var ext = nexacro._stringresourceurl.slice(- 3);
                    if (ext == ".js")
                        nexacro._stringresourceurl = nexacro._stringresourceurl.replace(ext, "." + env.on_getStringResourceFileExt());
                }
                if (langinfo[lang] == true)
                {
                    nexacro._StringResourceLang = lang;
                    stringrcfileid = nexacro._stringrc_service + lang + nexacro._stringresourceurl;
                }
                else
                    return;
            }
            else
                stringrcfileid = lang;
        }
        else if (arguments.length == 2)
        {
            if (typeof url == "string")
            {
                if (url.indexOf('?') > 0)
                    url += "&";
                else
                    url += "?";

                nexacro._StringResourceLang = lang;
                stringrcfileid = nexacro._stringrc_service + url + "lang=" + lang;
            }
        }

        var stringrc_url = nexacro._getServiceLocation(stringrcfileid, base_url);
        var service = nexacro._getServiceObject(stringrc_url);


        if (env)
        {
            env._load_manager.reloadJsonResource(stringrc_url, null, false, service);

            let app = nexacro.getApplication();
            if (app)
            {
                if (app.mainframe)
                    app.mainframe.on_apply_prop_stringresource();
            }
            else
            {
                if (nexacro.ismodule)
                {
                    const apps = nexacro.__MFEAPI._getRootApps();
                    for (const app of apps)
                    {
                        if (app._is_application)
                        {
                            if (app.mainframe)
                                app.mainframe.on_apply_prop_stringresource();
                        }
                        else
                        {
                            app.on_apply_prop_stringresource();
                        }
                    }

                }
            }
        }
    };

    nexacro.getStringResourceValue = function (key)
    {
        var str;
        if (nexacro._StringResource)
            str = nexacro._StringResource[key];
        else
            return;

        return str;
    };

    nexacro._getStringResourceValue = function (key, defaultvalue)
    {
        var v = nexacro.getStringResourceValue(key);
        if (v == undefined)
        {
            if (defaultvalue)
                v = defaultvalue;
            else
                v = key;
        }
        return v;
    };

    nexacro._getTextTemplateValue = function (v)
    {
        var key = "";
        var alter_str = "";
        if (v && v.indexOf("TEXT(") > -1)
        {
            var params_str = v.slice(5, -1).trim();

            var key_quote = params_str[0];
            var alter_quote = params_str[params_str.length - 1];
            var pattern = key_quote + "\\s*,\\s*" + alter_quote;
            var regex = new RegExp(pattern, "g");

            var arrParam = params_str.split(regex);
            if (arrParam.length == 2)
            {
                key = arrParam[0] = arrParam[0].trim().slice(1);
                alter_str = arrParam[1] = arrParam[1].slice(0, -1);
            }
            else if (arrParam.length == 1)
            {
                key = arrParam[0] = arrParam[0].trim().slice(1, -1);
            }

            v = nexacro.getStringResourceValue(key);
            if (v == undefined)
            {
                if (alter_str)
                {
                    v = alter_str;
                }
                else
                {
                    v = key;
                }
            }
        }
        return v;
    };



    /*nexacro._setStringResourceFileId = function (lang)
    {
        var stringrcfileid = "stringrc::";
        if (lang)
        {
            nexacro._StringResourceLang = lang;
            stringrcfileid += "/" + lang;
        }
        else if (nexacro._StringResourceLang)
            stringrcfileid += "/" + nexacro._StringResourceLang;
        else
            stringrcfileid += "/" + nexacro._getStringResourceLanguage();
 
        stringrcfileid += "/stringresource.xstring.js";
        nexacro._stringrcfileid = stringrcfileid;
    };*/

    nexacro.loadJSLibraries = function (accessibilityjs)
    {
        if (accessibilityjs)
        {
            var strsource, script;
            if (typeof accessibilityjs == "object")
            {
                var i;
                for (i = 0; i < accessibilityjs.length; i++)
                {
                    strsource = accessibilityjs[i];
                    script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = strsource;
                    document.getElementsByTagName('HEAD')[0].appendChild(script);
                }
                return true;
            }
            else if (typeof accessibilityjs == "string")
            {
                strsource = accessibilityjs;
                script = document.createElement("script");
                script.type = "text/javascript";
                script.src = strsource;
                document.getElementsByTagName('HEAD')[0].appendChild(script);
                return true;
            }
        }
        return false;
    };

    //for open performance
    nexacro._setTrackInfo = function (targetwin, target, windowX, windowY, screenX, screenY)
    {
        var trackData = target._on_starttrack();

        if (trackData === false) //starttrack을 시도했지만 track으로 사용하지 않는 경우에 return false 값을 사용하도록 함
            return;

        nexacro._cur_track_info = {
            "targetwin": targetwin,
            "target": target, "startX": windowX, "startY": windowY, "distX": 0, "distY": 0, "data": trackData,
            "screenX": screenX, "screenY": screenY
        };
    };

    nexacro._setExtraTrackInfo = function (targetwin, target, windowX, windowY, screenX, screenY, keepstart)
    {
        var trackData = target._on_start_extratrack(windowX, windowY, screenX, screenY, keepstart);
        nexacro._cur_extra_track_info = {
            "targetwin": targetwin,
            "target": target, "startX": windowX, "startY": windowY, "screenX": screenX, "screenY": screenY, "distX": 0, "distY": 0, "data": trackData
        };
    };

    nexacro._setDragInfo = function (targetwin, target_elem, startX, startY, currX, currY, dragimage, imagealign, filelist, datatype)
    {
        if (!startX && !startY && !currX && !currY)
            return;

        nexacro._cur_drag_info = {
            "targetwin": targetwin, "target_elem": target_elem, "target": null, "referTarget": null,
            "isDragging": false, "isSelfAction": false, "isDragover": false,
            "startX": startX, "startY": startY, "currX": currX, "currY": currY,
            "image": dragimage, "imagealign": imagealign,
            "data": null, "datatype": datatype, "userdata": null, "filelist": filelist
        };
    };

    nexacro._initDragInfo = function ()
    {
        nexacro._cur_drag_info = null;
    };

    nexacro._setRepeatInfo = function (target, win, refer_comp, windowX, windowY, canvasX, canvasY)
    {
        var handle = nexacro._getWindowHandle(win.handle);
        var ret = target._on_beforerepeat(refer_comp);  // ret[0] : bRepeat     ret[1] : bBubble

        if (ret && ret[0] === true)
        {
            var repeatData = target._on_startrepeat(refer_comp, canvasX, canvasY);

            if (win._cur_ldown_elem)    // _on_startrepeat함수에서 cancel event가 타는 경우 _cur_ldown_elem이 null이다.
            {
                nexacro._cur_repeat_info = {
                    "targetwin": win,
                    "target": target, "startX": windowX, "startY": windowY, "distX": 0, "distY": 0,
                    "startCanvasX": canvasX, "startCanvasY": canvasY,
                    "canvasX": canvasX, "canvasY": canvasY,
                    "data": repeatData, "refer_comp": refer_comp, "step": "first", "_repeatfunc": null, "_timer": null
                };

                if (!nexacro._cur_repeat_info._repeatfunc)
                {
                    nexacro._cur_repeat_info._repeatfunc = nexacro._nexacroBind(win, win._on_sys_repeat);
                }

                nexacro._cur_repeat_info._timer = nexacro._setSystemTimer(handle, nexacro._cur_repeat_info._repeatfunc, 500);
            }
        }

        if (ret && ret[1] === false)
            return true;

        return;
    };

    nexacro._getImageLocation = function (str, baseurl)
    {
        var url = str;

        var typedefinition_url = nexacro._typedefinition_url;

        if (!baseurl)
        {
            baseurl = nexacro._project_absolutepath;
        }

        //theme:// prefix를 사용하는 경우 HTML5에서 style로 설정되는 경우가 아닐 때(canvas) fullpath로 변경이 필요함

        return nexacro._transurl(baseurl, typedefinition_url, url);
    };

    nexacro._transfullurl = function (baseurl, url, bCheckVersion, type)
    {
        if (nexacro._isAbsolutePath(url) === true)
            return url;

        var env = nexacro.getEnvironment();
        var checkversion = env._p_checkversion & bCheckVersion;
        baseurl = nexacro._getBaseUrl(baseurl);

        var fullurl = null;

        if (baseurl.indexOf("?") >= 0)
        {
            fullurl = baseurl + url;
        }
        else
        {
            fullurl = nexacro._mergeUrl(baseurl, url);
        }

        if (checkversion)
            fullurl += nexacro._getVersionQueryString(fullurl, type, env._p_version);

        var urlarr = fullurl.split("/");

        var n = urlarr.length;


        var realpath = [];

        var i = 0;
        while (i < n)
        {
            if (urlarr[i] != "." && urlarr[i] != "..")
            {
                break;
            }
            realpath.push(urlarr[i]);
            i++;
        }

        while (i < n)
        {
            if (urlarr[i] != ".")
            {
                if (urlarr[i] == "..")
                {
                    realpath.pop();
                }
                else
                {
                    realpath.push(urlarr[i]);
                }
            }
            i++;
        }
        return realpath.join("/");
    };

    nexacro._addLocalCacheUrl = function (url, localurl)
    {
        if (url.indexOf("initvalue::") == 0)
        {
            if (url.length > 5)
            {
                var ext = url.substring(url.length - 4);
                if (ext == ".xml" || ext == ".xiv")
                    url = url + ".js";
            }
        }

        if (localurl) localurl = localurl.replace(/\\/g, "/");
        if (!nexacro._localcaches)
            nexacro._localcaches = {};
        nexacro._localcaches[url] = localurl;
    };


    nexacro._hasLocalCacheUrl = function (url)
    {
        if (!nexacro._localcaches)
            return false;

        return (url in nexacro._localcaches);
    };

    nexacro._getLocalCacheUrl = function (url)
    {
        return this._localcaches[url];
    };

    nexacro._getService = function (prefix, typedefintion_url)
    {
        var env = nexacro.getEnvironment();
        if (env)
            return env._p_services[prefix];
    };


    nexacro._transurl = function (baseurl, typedefintionurl, url, bCheckVersion, bKeepFileName)
    {

        // var exturl = this._getProtocolLocation(url);
        var exturl = url;
        if (bCheckVersion !== false)
            bCheckVersion = true;

        var env = nexacro.getEnvironment();
        var checkversion = env._p_checkversion && bCheckVersion;

        //theme://
        var bLocalCacheType, local_url, strA, suburl;
        if (exturl.indexOf("theme://") >= 0)
        { // _localthemecaches
            bLocalCacheType = false;
            if (nexacro._hasLocalCacheUrl(url))
            {
                local_url = nexacro._getLocalCacheUrl(url);
                if (local_url) return local_url;

                bLocalCacheType = true;
            }

            strA = exturl.split("://");
            //var name = strA[0];
            suburl = strA[1];

            var realpath = [];
            var separator = "/";

            var theme_uri = nexacro._theme_uri;
            realpath.push(theme_uri);

            if (theme_uri.charAt(theme_uri.length - 1) == "/")
                separator = "";
            realpath.push(suburl);

            exturl = realpath.join(separator).replace(/\\/g, "/");
            if (nexacro._isAbsolutePath(exturl) !== true)
            {
                if (bLocalCacheType)
                {
                    exturl = nexacro._transfullurl(env._localcache_path, exturl);
                }
                else
                {
                    exturl = nexacro._transfullurl(nexacro._project_absolutepath, exturl);
                }
            }

            if (checkversion)
            {
                exturl += nexacro._getVersionQueryString(exturl, "theme");
            }

            if (bLocalCacheType)
            {
                nexacro._addLocalCacheUrl(url, exturl);
            }
        }
        else
        {
            bLocalCacheType = false;
            if (nexacro._hasLocalCacheUrl(url))
            {
                local_url = nexacro._getLocalCacheUrl(url);
                if (local_url) return local_url;

                bLocalCacheType = true;
            }

            if (exturl.indexOf("::") < 0)
            {
                if (bLocalCacheType)
                {
                    baseurl = env._localcache_path;
                    exturl = nexacro._transfullurl(baseurl, exturl);
                }
                else if (nexacro._isAbsolutePath(exturl) !== true)
                {
                    exturl = exturl.replace(/\\/g, "/");
                    exturl = nexacro._transfullurl(baseurl, exturl);
                }
            }
            else
            {
                //service
                strA = exturl.split("::");
                suburl = strA[1];

                var prefix = strA[0];
                var service = nexacro._getService(prefix, typedefintionurl);
                if (service != null)
                {
                    var serviceurl = service.url;
                    if (serviceurl.charAt(serviceurl.length - 1) != "/")
                        serviceurl = serviceurl + "/";
                    if (suburl.charAt(0) == "/")
                        suburl = suburl.substring(1);

                    suburl = suburl.replace(/\\/g, "/");

                    if (nexacro._isAbsolutePath(serviceurl) === true)
                    {
                        exturl = nexacro._transfullurl(serviceurl, suburl);
                    }
                    else
                    {
                        var basepath;
                        if (bLocalCacheType)
                        {
                            basepath = nexacro._transfullurl(env._localcache_path, serviceurl);
                        }
                        else
                        {
                            basepath = nexacro._transfullurl(typedefintionurl, serviceurl);
                        }
                        exturl = nexacro._transfullurl(basepath, suburl);
                    }
                }
                else
                {
                    exturl = exturl.replace(/\\/g, "/");
                }

                if (exturl.match(/\.xfdl$|\.xjs$/) && !bKeepFileName)
                    exturl += ".js";

                if (checkversion)
                {
                    exturl += nexacro._getVersionQueryString(url, "service");
                }
            }

            if (bLocalCacheType)
            {
                nexacro._addLocalCacheUrl(url, exturl);
            }
        }

        return exturl;
    };

    nexacro._getVersionQueryString = function (url, type, version)
    {
        var ret = url ? url : "";
        var arr = ret.split("?");
        var qs = "";

        if (arr.length < 2)
            qs = "?";
        else
            qs = "&";

        //        var env = nexacro.getEnvironment();
        //        var checkversion = env.checkversion;
        var svc, ver;

        if (type == "theme")
            svc = nexacro._getServiceObject("theme::");
        else if (type == "service")
            svc = nexacro._getServiceObject(url);

        if (svc)
            ver = svc._p_version;
        else
            ver = version;

        if (!nexacro._isNull(ver) && ver !== "")
        {
            qs += "nexaversion=" + ver;
        }
        else
            qs = "";

        return qs;
    };

    nexacro._getServiceObject = function (url, bDefaultNone)
    {
        var serviceprefix = url.split("::");

        if (serviceprefix.length >= 2)
        {
            var service = nexacro._getService(serviceprefix[0]);
            if (service)
            {
                return service;
            }
        }

        if (!nexacro._defaultservice)
        {
            nexacro._defaultservice = new nexacro._ServiceItem();
        }

        if (url.toLowerCase().indexOf("file://") >= 0 || bDefaultNone || nexacro._viewtoollog)
            nexacro._defaultservice._p_cachelevel = "none";
        else
            nexacro._defaultservice._p_cachelevel = "session";

        return nexacro._defaultservice;
    };

    nexacro._getServiceLocation = function (url, baseurl, typedefinition_url, bCheckVersion, bKeepFileName)
    {
        if (!typedefinition_url)
            typedefinition_url = nexacro._typedefinition_url;

        if (!baseurl)
        {
            baseurl = nexacro._project_absolutepath;
        }

        return nexacro._transurl(baseurl, typedefinition_url, url, bCheckVersion, bKeepFileName);
    };

    nexacro._getStringResourceLanguage = function ()
    {
        var env = nexacro.getEnvironment();
        if (!env.usestringresource)
            return;

        if (!env.on_getResourceLanguageInfo)   // 제너레이션된 소스가 없을 경우
            return;

        var langinfo = env.on_getResourceLanguageInfo();
        if (env.on_getStringResourceFileExt)
        {
            var ext = nexacro._stringresourceurl.slice(- 3);
            if (ext == ".js")
                nexacro._stringresourceurl = nexacro._stringresourceurl.replace(ext, "." + env.on_getStringResourceFileExt());
        }

        var locale = env._p_locale ? env._p_locale : nexacro._getLocale();  //environment.locale 일 적용된 후에 nexacro._locale 가 업데이트됨 
        var curlang = locale.substring(0, 2);

        if (langinfo[curlang] == true)
            nexacro._StringResourceLang = curlang;
        else
            nexacro._StringResourceLang = curlang = "en";

        return curlang;
    };

    nexacro._getFDLLocation = function (fdlurl, baseurl)
    {
        if (!fdlurl || fdlurl.length <= 0) return fdlurl;

        var url = nexacro._getServiceLocation(fdlurl, baseurl);
        if (url.length > 5)
        {
            if (url.substring(url.length - 5) == ".xfdl")
            {
                url = url + ".js";
            }
        }

        return url;
    };

    //MLM
    nexacro._getScreenType = function (type, width, is_landscape, height)
    {
        var cur_type = "desktop";
        switch (type)
        {
            case "win32": case "win64": case "mac": case "linux":
                cur_type = "desktop";
                break;
            case "iphone": case "winphone":
                cur_type = "mobile_small";
                break;
            case "ipad":
                if (nexacro._MobileDesktopMode)
                    cur_type = "desktop";
                else
                    cur_type = "mobile_large";
                break;
            case "android":
                if (nexacro._Browser == "Runtime")
                {
                    cur_type = "mobile_large";
                    if (nexacro.__isPhone && nexacro.__isPhone())
                        cur_type = this._getWidthType(is_landscape ? height : width);
                }
                else
                {
                    cur_type = this._getWidthType(is_landscape ? height : width);
                }
                break;

        }
        return cur_type;
    };

    nexacro._getScreenOS = function (os)
    {
        var cur_os = "win32";
        switch (os)
        {
            case "win32": case "win64": case "winphone":
                cur_os = "windows";
                break;
            case "ipad": case "iphone":
                cur_os = "ios";
                break;
            case "android":
                cur_os = "android";
                break;
        }
        return cur_os;
    };

    nexacro._getMornitorIndex = function ()
    {
        var monitor_idx = 1;
        var monitor_cnt = nexacro._getMonitorCount();
        for (var i = 0; i < monitor_cnt; i++)
        {
            if (nexacro._isPrimaryMonitor(i))
                monitor_idx = i;
        }
        return monitor_idx;
    };


    nexacro._getWidthType = function (w)
    {
        var width_type = "desktop";
        /*
        if (w > 900 && w < 1119)
            width_type = "mobile_large";
        else if (w > 600 && w < 899)
            width_type = "mobile_medium";
        else if (w < 1599)
            width_type = "mobile_small";
        */
        if (!nexacro._isDesktop())
        {
            if (w < 490)
                width_type = "mobile_small";
            else if (w < 790)
                width_type = "mobile_medium";
            else
                width_type = "mobile_large";
        }

        return width_type;
    };

    nexacro._getTypePriority = function (type)
    {
        var ret = 5;
        if (type == "desktop")
            ret = 4;
        else if (type == "mobile_large")
            ret = 3;
        else if (type == "mobile_medium")
            ret = 2;
        else if (type == "mobile_small")
            ret = 1;
        return ret;
    };

    nexacro._getTypeScreenWidth = function (type, usepinchzoom)
    {
        if (!usepinchzoom) usepinchzoom = false;

        var ret = -1;
        if (type == "desktop" && usepinchzoom)
        {
            const env = nexacro.getEnvironment();
            ret = env._desktopscreenwidth;
        }
        else if (type == "mobile_large")
            ret = 800;
        else if (type == "mobile_medium")
            ret = 640;
        else if (type == "mobile_small")
            ret = 480;
        return ret;
    };

    nexacro._getTypeScreenHeight = function (type, usepinchzoom)
    {
        if (!usepinchzoom) usepinchzoom = false;

        var ret = -1;
        if (type == "desktop" && usepinchzoom)
        {
            const env = nexacro.getEnvironment();
            ret = env._desktopscreenwidth;
        }
        else if (type == "mobile_large")
            ret = 1280;
        else if (type == "mobile_medium")
            ret = 1024;
        else if (type == "mobile_small")
            ret = 768;
        return ret;
    };

    nexacro._getTypeScreenWidthOrientation = function (type, landscape, usepinchzoom)
    {
        if (!usepinchzoom) usepinchzoom = false;
        var ret = -1;
        if (landscape)
        {
            if (type == "mobile_large")
                ret = 1280;
            else if (type == "mobile_medium")
                ret = 1024;
            else if (type == "mobile_small")
                ret = 768;
        }
        else
        {
            if (type == "desktop" && usepinchzoom)
            {
                const env = nexacro.getEnvironment();
                ret = env._desktopscreenwidth;
            }
            else if (type == "mobile_large")
                ret = 800;
            else if (type == "mobile_medium")
                ret = 640;
            else if (type == "mobile_small")
                ret = 480;
        }

        return ret;
    };

    nexacro._getDeviceWidth = function ()
    {
        if (!nexacro._isDesktop() && nexacro._OS == "Android" && nexacro._Browser == "Chrome")
        {
            // orientation값만 바뀌고 screen 바뀌지 않는 케이스가 발견됨.
            // 세로로 길쭉한 장비가 확실한 경우, 직접 값을 swap해서 넘기도록...
            var is_portrait_device = nexacro._searchDeviceExceptionValue("is_portrait_device");
            if (is_portrait_device === true)
            {
                var orientation = nexacro._getMobileOrientation();
                var is_swap_screen = nexacro._searchDeviceExceptionValue("swap_screen");
                var is_delayed_swap_screen = nexacro._searchDeviceExceptionValue("delayed_swap_screen");
                if (orientation == 2 || orientation == 3) // landscape
                {
                    if (is_swap_screen === true && !is_delayed_swap_screen)
                    {
                        // swap되어서 w>h 이어야 하는 상황인데 그렇지 않음->오류상황
                        if (screen.width < screen.height)
                            return screen.height;
                    }
                }
            }
        }

        //if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
        //    return nexacro._getScreenAvailWidth();
        /*
        if (!nexacro._isDesktop() && nexacro._OS == "Android" && (nexacro._Browser != "Chrome" && nexacro._Browser != "Edge"))
        {
            return document.documentElement.clientWidth;
        }
        */
        return nexacro._getScreenAvailWidth();
    };

    nexacro._getDeviceHeight = function ()
    {
        return nexacro._getScreenAvailHeight();
    };

    nexacro._getDeviceInfo = function (device_name)
    {
        var device_info = this._device_infos[device_name];
        if (device_info)
        {
            return device_info;
        }
        else if (device_name)
        {
            var device_infos = this._device_infos, prop, n;
            for (prop in device_infos)
            {
                n = device_name.indexOf(prop);
                if (n > -1)
                    return device_infos[prop];
            }
        }
        return null;
    };

    nexacro._getDeviceName = function ()
    {
        if (this._DeviceName)
            return this._DeviceName;
        var ua = this._getUserAgent();
        var i = 0, j, k, p, q, matches, match, result;
        var devices = this._device_regular_expression;
        while (i < devices.length && !matches)
        {
            var regex = devices[i],       // even sequence (0,2,4,..)
                props = devices[i + 1];   // odd sequence (1,3,5,..)
            if (typeof result === 'undefined')
            {
                result = {};
                for (p in props)
                {
                    if (props.hasOwnProperty(p))
                    {
                        q = props[p];
                        if (typeof q === 'object')
                        {
                            result[q[0]] = undefined;
                        }
                        else
                        {
                            result[q] = undefined;
                        }
                    }
                }
            }
            j = k = 0;
            while (j < regex.length && !matches)
            {
                matches = regex[j++].exec(ua);
                if (!!matches)
                {
                    for (p = 0; p < props.length; p++)
                    {
                        match = matches[++k];
                        q = props[p];
                        // check if given property is actually array
                        if (typeof q === 'object' && q.length > 0)
                        {
                            if (q.length == 2)
                            {
                                if (typeof q[1] == 'function')
                                {
                                    result[q[0]] = q[1].call(this, match);
                                }
                                else
                                {
                                    result[q[0]] = q[1];
                                }
                            }
                            else if (q.length == 3)
                            {
                                if (typeof q[1] === 'function' && !(q[1].exec && q[1].test))
                                {
                                    result[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                                }
                                else
                                {
                                    result[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                                }
                            }
                            else if (q.length == 4)
                            {
                                result[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                            }
                        }
                        else
                        {
                            result[q] = match ? match : undefined;
                        }
                    }
                }
            }
            i += 2;
        }
        return result ? this._DeviceName = result.model : "";
    };


    nexacro._getOptimalScreenInfo = function (scr_info, cur_screen_type)
    {
        var len = scr_info.length;
        var optimal_screen = null, i, _screen;

        //match -> small
        for (i = 0; i < len; i++)
        {
            _screen = scr_info[i];
            if (_screen._type <= cur_screen_type)
            {
                if (optimal_screen)
                {
                    if (optimal_screen._type < _screen._type)
                        optimal_screen = _screen;
                }
                else
                    optimal_screen = _screen;
            }
        }

        //bigger
        if (!optimal_screen)
        {
            for (i = 0; i < len; i++)
            {
                _screen = scr_info[i];
                if (_screen._type >= cur_screen_type)
                {
                    if (optimal_screen)                        
                    {
                        if (optimal_screen._type > _screen._type)
                            optimal_screen = _screen;
                    }
                    else
                        optimal_screen = _screen;
                }
            }
        }

        //default
        if (!optimal_screen)
            ;//Todo..
        return optimal_screen;
    };


    nexacro._getScreen = function (screeninfo)
    {
        if (!screeninfo)
            return;

        var scr_info_list = screeninfo;
        var scr_len = scr_info_list.length;
        var matched_scrinfo = null;
        var cur_os = nexacro._getScreenOS(nexacro._SystemType);
        //var locale_info = nexacro.Locale.getLocaleInfo(nexacro._locale); //nexacro._locale 값이 없음 결국 nexacro._getLocale()을 호출함
        //var cur_locale = locale_info ? locale_info.name : nexacro._getLocale();
        var cur_locale = nexacro._getLocale();

        var monitor_idx = nexacro._getMornitorIndex();
        // var cur_orientation = nexacro._getMobileOrientation();
        var cur_width = nexacro._getDeviceWidth(monitor_idx);
        var cur_height = nexacro._getDeviceHeight(monitor_idx);
        var is_landscape = cur_width > cur_height ? true : false;
        var cur_type = "";
        var temp;
        if (nexacro._OS == "Android")
        {
            var device_name = nexacro._getDeviceName();
            var device_info = nexacro._getDeviceInfo(device_name);
            //var width = 0;
            if (device_info)
            {
                cur_width = +device_info.PortraitWidth;
                cur_height = +device_info.LandscapeWidth;
                cur_type = device_info.type;
                //if (device_info.ZoomFactor)
                //    this._zoom_factor = +device_info.ZoomFactor;              
                if (is_landscape)
                {
                    temp = cur_width;
                    cur_width = cur_height;
                    cur_height = temp;
                }
            }
        }
        else if (nexacro._OS == "iOS" && nexacro._Browser != "MobileSafari")
        {
            var win_handle = nexacro._getMainWindowHandle();
            var win_width = nexacro._getContainerHandleClientWidth(win_handle);
            var win_height = nexacro._getContainerHandleClientHeight(win_handle);

            is_landscape = win_width > win_height ? true : false;

            if (is_landscape)
            {
                temp = cur_width;
                cur_width = cur_height;
                cur_height = temp;
            }
        }

        if (!cur_type)
            cur_type = nexacro._getScreenType(nexacro._SystemType.toLowerCase(), cur_width, is_landscape, cur_height);

        //to select resonable screen
        //we use the priority which is calculated by mobile screen type, mobileos and mobile locale.
        //priority
        //type = 100
        //os = 10
        //locale = 1
        var i, j;
        for (i = 0; i < scr_len; i++)
        {
            var type_found = false;
            var scr_info = scr_info_list[i];
            var device_width = is_landscape ? (cur_height ? cur_height : nexacro._getScreenAvailHeight(monitor_idx)) : (cur_width ? cur_width : nexacro._getScreenAvailWidth(monitor_idx));
            scr_info._device_width = device_width;
            var device_height = is_landscape ? (cur_width ? cur_width : nexacro._getScreenAvailWidth(monitor_idx)) : (cur_height ? cur_height : nexacro._getScreenAvailHeight(monitor_idx));

            scr_info._device_height = device_height;
            if (scr_info.id == nexacro._launch_screenid)
            {
                return scr_info;
            }

            scr_info._priority = 0;

            // check type (desktop 0, mobile_large 1, mobile_medium 2, mobile_small 3)
            var type = scr_info.type;
            if (cur_type && type)
            {
                scr_info._type = nexacro._getTypePriority(type);
                /*   if (scr_info._type > 0)  
                   {
                       scr_info._screen_width = nexacro._getTypeScreenWidth(type, false);
                       scr_info._screen_height = nexacro._getTypeScreenHeight(type, false);
                   }
                */
                // type mismatch
                scr_info._priority = -100;

                if (type === cur_type)
                {
                    scr_info._priority = 100;
                    type_found = true;
                }
                if (!type_found)
                    continue;
            }

            var os = scr_info.specifiedos;
            if (cur_os && os)
            {
                var os_list = os.toLowerCase().split(",");
                var os_cnt = os_list.length;
                for (j = 0; j < os_cnt; j++)
                {
                    if (os_list[j] == cur_os)
                    {
                        scr_info._priority += 10;
                        break;
                    }
                }
            }

            // check specifedlocale
            var locale = scr_info.specifiedlocale;
            if (cur_locale && locale)
            {
                if (locale == cur_locale)
                {
                    scr_info._priority += 1;
                }
            }
            if (scr_info._priority >= 100)
            {
                if (!matched_scrinfo)
                    matched_scrinfo = scr_info;
                else if (matched_scrinfo._priority < scr_info._priority) //need to check!!!
                {
                    matched_scrinfo = scr_info;
                }
            }

        }

        if (matched_scrinfo)
            matched_scrinfo._cur_type = cur_type;
        else
        {
            var cur_screenpriority = nexacro._getTypePriority(cur_type);
            matched_scrinfo = nexacro._getOptimalScreenInfo(screeninfo, cur_screenpriority);
        }
        return matched_scrinfo;
    };

    nexacro._applySelectedScreen = function (curscreen)
    {
        if (!curscreen)
            return;

        var isScreenDesktop = curscreen.type == "desktop" ? true : false;

        var isMobileWeb = ((!nexacro._isDesktop() || nexacro._AndroidDesktopMode) && nexacro._Browser != "Runtime");

        let allow_default_pinchzoom = false;


        //PinchZoom
        if (isScreenDesktop && nexacro._isHybrid && !nexacro._isHybrid())
        {
            var isSupportPinchZoom = (curscreen.userzoom == "true") ? true : false;
            if (isSupportPinchZoom && isMobileWeb)
            {
                allow_default_pinchzoom = true;
            }
        }

        var is_landscape;
        var cur_width = nexacro._getDeviceWidth();
        var cur_height = nexacro._getDeviceHeight();
        var cur_type;
        var cur_zoomfactortype = curscreen.zoomfactortype ? curscreen.zoomfactortype : "portrait";
        var zoom_fitting_width, zoom_fitting_height;
        let zoom_factor = 0;
        is_landscape = cur_width > cur_height ? true : false;


        curscreen._zoom_factor = zoom_factor;
        curscreen._allow_default_pinchzoom = allow_default_pinchzoom;
        if (curscreen.type)
        {
            curscreen._screen_width = nexacro._getTypeScreenWidth(curscreen.type, allow_default_pinchzoom);
            curscreen._screen_height = nexacro._getTypeScreenHeight(curscreen.type, allow_default_pinchzoom);
        }

        //Autozoom & MLM for android runtime        
        if (nexacro._OS == "Android" && nexacro._Browser == "Runtime")
        {
            var device_name = nexacro._getMobileProductType(); //this._getDeviceName();
            var device_info = this._getDeviceInfo(device_name);
            var screen_height;


            if (device_info)
            {
                //  var cur_type = device_info.type;
                cur_width = +device_info.PortraitWidth;
                cur_height = +device_info.LandscapeWidth;

                if (is_landscape)
                {
                    //var temp = cur_width;
                    cur_width = cur_height;
                    //cur_height = temp;
                }
            }

            curscreen._device_width = cur_width ? cur_width : nexacro._getDeviceWidth();

            if (!curscreen.type)
            {
                cur_type = nexacro._getScreenType(nexacro._SystemType.toLowerCase(), curscreen._device_width, is_landscape, nexacro._getDeviceHeight());
                curscreen.type = cur_type;
            }

            curscreen._screen_width = nexacro._getTypeScreenWidthOrientation(curscreen.type, is_landscape, allow_default_pinchzoom);
            curscreen._screen_height = screen_height = nexacro._getTypeScreenWidthOrientation(curscreen.type, !is_landscape, allow_default_pinchzoom);

            if (curscreen._screen_width !== undefined)// && nexacro._toBoolean(curscreen.autozoom) === true)
            {
                //var zoom_factor = 0;

                if (nexacro.__setCurrentScreenInfo && nexacro.__getCurrentScreenScale)
                {
                    var screen_temp, device_temp;
                    var realDeviceWidth = nexacro._getScreenWidth();
                    var realDeviceHeight = nexacro._getScreenHeight();
                    //trace("@@@ nexacro._getScreenWidth > ", layoutWidth, ", nexacro._getScreenHeight > ", layoutHeight);

                    switch (cur_zoomfactortype)
                    {
                        case "portrait":
                            if (is_landscape)
                            {
                                screen_temp = screen_height;
                                screen_height = curscreen._screen_width;
                                curscreen._screen_width = screen_temp;

                                device_temp = realDeviceHeight;
                                realDeviceHeight = realDeviceWidth;
                                realDeviceWidth = device_temp;
                            }
                            break;
                        case "landscape":
                            if (!is_landscape)
                            {
                                screen_temp = screen_height;
                                screen_height = curscreen._screen_width;
                                curscreen._screen_width = screen_temp;

                                device_temp = realDeviceHeight;
                                realDeviceHeight = realDeviceWidth;
                                realDeviceWidth = device_temp;
                            }
                            break;
                    }

                    nexacro.__setCurrentScreenInfo(curscreen.type, curscreen._screen_width, is_landscape,
                        true, 0, 0,
                        curscreen._device_width, screen_height, realDeviceWidth, realDeviceHeight);

                    var scale = nexacro.__getCurrentScreenScale();
                    if (scale)
                        zoom_factor = scale * 100;
                }

                if (zoom_factor == 0)
                {
                    zoom_fitting_width = Math.abs(parseInt(curscreen._screen_width));
                    // screeninfo의 width를 실제 device width에 맞춘다.
                    zoom_factor = zoom_fitting_width * 100 / curscreen._device_width;
                    //nexacro._zoom_factor = curscreen._device_width * 100 / zoom_fitting_width;
                }
                //nexacro._zoom_factor = zoom_factor;
                curscreen._zoom_factor = zoom_factor;
            }
            else
            {
                nexacro._onSystemWarning(nexacro._environment, "native_exist_screenwdith");
            }
        }
        else
        {
            if (nexacro._OS == "iOS")
            {
                var win_handle = nexacro._getMainWindowHandle();
                var win_width = nexacro._getContainerHandleClientWidth(win_handle);
                var win_height = nexacro._getContainerHandleClientHeight(win_handle);

                is_landscape = win_width > win_height ? true : false;
            }
            /*
                        if (nexacro._zoom_factor)
                        {
                            return;
                        }
                            */
            /*if (!curscreen._screen_width)
            {
                curscreen._screen_width = nexacro._getTypeScreenWidth(curscreen.type);
                curscreen._screen_height = nexacro._getTypeScreenHeight(curscreen.type);
            }*/

            if (curscreen._screen_width == -1)
            {
                //nexacro._zoom_factor = 100;
                zoom_factor = 100;
                //curscreen._zoom_factor = 100;
            }
            else if (curscreen._screen_width !== undefined)// && nexacro._toBoolean(curscreen.autozoom) === true)
            {
                // 안드로이드 기본 브라우저 버그로, 320이하 크기인 경우 321로 보정함 (320이하 지원 불가) 현재 원인 불명
                if (parseInt(curscreen._screen_width) <= 320 && nexacro._OS == "Android" && nexacro._Browser != "Chrome")
                    curscreen._screen_width = "321";

                zoom_fitting_width = Math.abs(parseInt(curscreen._screen_width));
                // screeninfo의 width를 실제 device width에 맞춘다.
                zoom_fitting_height = Math.abs(parseInt(curscreen._screen_height));

                var zoom_fitting_val, device_val;

                switch (cur_zoomfactortype)
                {
                    case "portrait":
                        zoom_fitting_val = zoom_fitting_width;
                        device_val = curscreen._device_width;
                        break;
                    case "landscape":
                        zoom_fitting_val = zoom_fitting_height;
                        device_val = curscreen._device_height;
                        break;
                    case "auto":
                        zoom_fitting_val = is_landscape ? zoom_fitting_height : zoom_fitting_width;
                        device_val = is_landscape ? curscreen._device_height : curscreen._device_width;
                        break;
                }

                //nexacro._zoom_factor = device_val * 100 / zoom_fitting_val;
                zoom_factor = device_val * 100 / zoom_fitting_val;
                //curscreen._zoom_factor = device_val * 100 / zoom_fitting_val;
            }
            else
            {
                nexacro._onSystemWarning(nexacro._environment, "native_exist_screenwdith");
            }

            curscreen._zoom_factor = zoom_factor;
        }
    };

    nexacro._setCurrentScreen = function (curscreen)
    {
        //nexacro._curscreenid = curscreen.id ? curscreen.id : "";
        //nexacro._curscreentype = curscreen.type;
        // if (curscreen.zoomfactortype)
        //     nexacro._curscreenzoomfactortype = curscreen.zoomfactortype;
        //screen의 env property 를 env에 적용
        if (nexacro.getEnvironment)
        {
            var env = nexacro.getEnvironment();
            if (env)
                env._setCurrentScreen(curscreen);
        }
    };

    /* unused
    nexacro.getZoomFactorType = function ()
    {
        return nexacro._curscreenzoomfactortype;
    };
    */
    //nexacro._getCurrentScreen = function ()
    //{
    //    return nexacro._curscreenid;
    //};

    //  추후 삭제
    nexacro._getCurrentScreenID = function ()
    {
        const env = nexacro.getEnvironment();
        return env._curscreenid;
    };

    //  추후 삭제
    nexacro._getCurrentScreenType = function ()
    {
        const env = nexacro.getEnvironment();
        return env._curscreentype;
    };

    nexacro._removeLastPopupComponent = function ()
    {
        nexacro._current_popups.pop();
    };
    nexacro._removePopupComponent = function (popup_comp)
    {
        // null is clearall
        if (!popup_comp || !popup_comp._is_popup_control)
        {
            nexacro._current_popups = [];
        }
        else
        {
            var popups = nexacro._current_popups;
            var cnt = popups.length;
            if (cnt > 0)
            {
                var cur_popup = null;
                // var last_popup = null;
                //var root_comp = popup_comp._getRootComponent(popup_comp);
                for (var i = cnt; i > 0; i--)
                {
                    cur_popup = popups[i - 1];
                    if (!cur_popup)
                    {
                        break;
                    }
                    if (cur_popup == popup_comp)
                    {
                        nexacro._current_popups = popups.slice(0, i - 1);
                        break;
                    }

                    //last_popup = cur_popup;
                    //cur_popup = null;
                }
            }
        }
    };

    nexacro._current_popups = [];
    nexacro._appendPopupComponent = function (popup_comp)
    {
        var cur_popup = null;
        if (!popup_comp || !popup_comp._is_popup_control)
        {
            cur_popup = nexacro._current_popups[0];
            if (cur_popup)
            {
                cur_popup._closePopup();
            }
            this._current_popups = [];
        }
        else
        {
            //var root_comp = popup_comp._getRootComponent(popup_comp);
            var popups = nexacro._current_popups;
            var cnt = popups.length;
            if (cnt > 0)
            {
                var is_contain = false;
                var last_popup = null, i;
                for (i = cnt; i > 0; i--)
                {
                    cur_popup = popups[i - 1];
                    if (!cur_popup)
                    {
                        break;
                    }
                    if (cur_popup._contains(popup_comp))
                    {
                        is_contain = true;
                        if (last_popup)
                        {
                            last_popup._closePopup();
                        }
                        nexacro._current_popups = popups.slice(0, i);
                        break;
                    }

                    last_popup = cur_popup;
                }
                if (!is_contain)
                {
                    var len = nexacro._current_popups.length;
                    for (i = len - 1; i >= 0; i--)
                    {
                        last_popup = nexacro._current_popups[i];
                        if (last_popup)
                        {
                            last_popup._closePopup();
                        }
                    }
                    nexacro._current_popups = [];
                }
            }
            nexacro._current_popups.push(popup_comp);
        }
    };

    nexacro._checkClosePopupComponent = function (target_comp, bCheckSameParent)
    {
        var cur_popup = null, i, len;
        if (!target_comp)
        {
            len = nexacro._current_popups.length;
            for (i = len - 1; i >= 0; i--)
            {
                cur_popup = nexacro._current_popups[i];
                if (cur_popup)
                {
                    cur_popup._closePopup();
                }
            }

            nexacro._current_popups = [];
        }
        else
        {
            var popups = nexacro._current_popups;
            var cnt = popups.length;
            if (cnt > 0)
            {
                var is_contain = false;
                var last_popup = null;
                var child_popups = [], popup;
                for (i = cnt; i > 0; i--)
                {
                    cur_popup = popups[i - 1];
                    if (!cur_popup)
                    {
                        break;
                    }
                    if (bCheckSameParent)
                    {
                        if (cur_popup._contains(target_comp))
                        {
                            // popup안의 component click
                            is_contain = true;

                            for (var j = cnt; j >= i; j--)
                            {
                                popup = popups[j - 1];
                                if (cur_popup != popup && cur_popup._contains(popup))
                                {
                                    child_popups.push(popups[j - 1]);
                                    popups.splice(j - 1);
                                }
                            }
                        }
                        else
                        {
                            // popup을 포함한 component click
                            var root_comp;
                            root_comp = cur_popup._getPopupRootComponent(cur_popup);

                            if (root_comp)
                            {
                                is_contain = root_comp._contains(target_comp);
                                if (root_comp._is_frame)
                                    is_contain = false;
                            }

                        }
                    }
                    else
                    {
                        is_contain = cur_popup._contains(target_comp);
                    }

                    if (is_contain)
                    {
                        break;
                    }
                }

                if (!is_contain)
                {
                    len = nexacro._current_popups.length;
                    for (i = len - 1; i >= 0; i--)
                    {
                        last_popup = nexacro._current_popups[i];
                        if (last_popup)
                        {
                            last_popup._closePopup();
                        }
                    }
                    nexacro._current_popups = [];
                }
                else if (child_popups.length > 0)
                {
                    while (child_popups.length > 0)
                    {
                        popup = child_popups.shift();
                        if (popup)
                        {
                            popup._closePopup();
                        }
                    }
                }
            }
        }
    };

    if (!nexacro.__isDesignMode || !nexacro.__isDesignMode())
    {
        nexacro._loadExtensionLibrary = function (libpath)
        {
            if (nexacro._Browser == "Runtime")
            {
                if (nexacro._OS == "Windows" || nexacro._OS == "Android" || nexacro._OS == "OSX")
                {
                    return nexacro.__loadLibraryExtensionAPI(libpath);
                }
            }
            else
            {
                if (nexacro._macOSWebView || (nexacro._isHybrid && nexacro._isHybrid()))
                {
                    var deviceID = nexacro.Device.makeID();

                    if (deviceID)
                    {
                        var arrArguments =
                            [
                                deviceID,
                                0 // Sync Call
                            ];
                        arrArguments.push("__loadLibraryExtensionAPI");
                        arrArguments.push(libpath);

                        var retDeviceId = nexacro._callExtensionLibraryMethod.apply(this, arrArguments);
                        if ((retDeviceId != undefined) || retDeviceId == null)  // Handle값을 넘겨 줬거나 null인 경우(존재하지 않는 lib 로드시 null 반환)
                            return retDeviceId;
                    }

                    return deviceID;
                    //nexacro.Device._userCreatedObj[_id] = libpath; // for local evnet
                    //return _id;
                }
            }
        };
    }
    else
    {
        nexacro._loadExtensionLibrary = nexacro._emptyFn;
    }


    nexacro._unloadExtensionLibrary = function (handle)
    {
        if (nexacro._macOSWebView || (nexacro._isHybrid && nexacro._isHybrid()))
        {
            var arrArguments =
                [
                    handle,
                    0 // Sync Call
                ];
            arrArguments.push("__unloadLibraryExtensionAPI");
            return nexacro._callExtensionLibraryMethod.apply(this, arrArguments);
        }
        else
            return nexacro.__unloadLibraryExtensionAPI(handle);
    };

    nexacro._removeDeviceAdaptor = function (name)																
    {
        var device_obj = nexacro._device_adaptor_list[name];
        if (device_obj)															
        {
            device_obj.finalize();
            nexacro._device_adaptor_list[name] = null;
        }
    };

    nexacro._removeDeviceAdaptors = function ()																
    {
        for (var name in nexacro._device_adaptor_list)															
        {
            var device_obj = nexacro._device_adaptor_list[name];
            if (device_obj)														
            {
                device_obj.finalize();
                nexacro._device_adaptor_list[name] = null;
            }
        }
    };

    nexacro._getExtensionLoadErrorMessage = function ()
    {
        if (nexacro._macOSWebView || (nexacro._isHybrid && nexacro._isHybrid()))
        {
            var arrArguments =
                [
                    undefined,
                    0 // Sync Call
                ];
            arrArguments.push("__getLastErrorMessageExtensionAPI");
            return nexacro._callExtensionLibraryMethod.apply(this, arrArguments);
        }
        else
            return nexacro.__getLastErrorMessageExtensionAPI();
    };

    // ExtensionAPI - Local Event Callback function 설정
    nexacro._setExtensionObjectEvent = function (handle, target, fn)
    {
        if (nexacro._Browser == "Runtime")
        {
            if (nexacro._OS == "Windows" || nexacro._OS == "Android" || nexacro._OS == "OSX")
            {
                return nexacro.__setLocalEventExtensionAPI(handle, target, fn);
            }
        }
        else
        {
            if (nexacro._macOSWebView || (nexacro._isHybrid && nexacro._isHybrid()))
            {
                var eapiCallbackObject = nexacro.Device.getEapiCallbackObject(handle); // { handle, callbackInfo { target, function } }
                if (eapiCallbackObject == undefined || eapiCallbackObject == null)
                {// LocalEvent 세팅이 되어있지 않은 경우.
                    var callbackInfo =
                    {
                        "target": target,
                        "function": fn
                    };
                    nexacro.Device.setEapiCallbackObject(handle, callbackInfo);
                }
                else
                {
                    // TODO : ExtensionAPI의 Local Callback Event 정보가 있을 때
                }
            }
        }
    };

    nexacro._device_infos =
    {
        "SM-T715N0":
        {
            "model": "SM-T715N0", //SM-T715N0
            //"Device Name":"Galaxy Tab S2 8",
            //"Platform":"Android",
            //"OS Version":"",
            "type": "mobile_medium",
            "PortraitWidth": "768",
            "LandscapeWidth": "1024"
            //"Release Date":""
        },
        "SM-T800":
        {
            "model": "SM-T800", //SM-T715N0
            //"Device Name":"Galaxy Tab S2 8",
            //"Platform":"Android",
            //"OS Version":"",
            "type": "mobile_large",
            //"PortraitWidth": "768",
            //"LandscapeWidth": "1024"
            //"Release Date":""
        },
        "F100S":
        {
            "model": "F100S",
            //"Device Name":"LG Optimus Vu",
            //"Platform":"Android",
            //"OS Version":"",
            "type": "mobile_small",
            "PortraitWidth": "384",
            "LandscapeWidth": "512"
            //"Release Date":"2012-03"
        },
        "SM-G900":
        {
            "model": "SM-G900P",
            //"Device Name":"Samsung Galaxy S5",
            //"Platform":"Android",
            //"OS Version":"",
            "type": "mobile_small",
            "PortraitWidth": "360",
            "LandscapeWidth": "640"
            //"Release Date":"2012-03"
        },
        "SM-G920L":
        {
            "model": "SM-G920L",
            //"Device Name":"Samsung Galaxy S6",
            //"Platform":"Android",
            //"OS Version":"",
            "type": "mobile_small",
            "PortraitWidth": "360",
            "LandscapeWidth": "640"
            //"Release Date":"2012-03"
        },
        "SHV-E250S":
        {
            "'model'": "SHV-E250S",
            //"Device Name":"Samsung Galaxy Note 2 N7100",
            //"Platform":"Android",
            //"OS Version":"4.1.1",
            "PortraitWidth": "360",
            "LandscapeWidth": "640",
            "type": "mobile_small"
            //"Release Date":"2012-09"
        },
        "SHV-E230S":
        {
            "'model'": "SHV-E230S",
            //"Device Name":"Samsung Galaxy Note 2 N7100",
            //"Platform":"Android",
            //"OS Version":"4.1.1",
            "PortraitWidth": "800",
            "LandscapeWidth": "1280",
            "type": "mobile_large"
            //"Release Date":"2012-09"
        },
        "SM-P605S":
        {
            "'model'": "SM-P605S",
            //"Device Name":"Samsung Galaxy Note 2 N7100",
            //"Platform":"Android",
            //"OS Version":"4.1.1",
            "PortraitWidth": "800",
            "LandscapeWidth": "1280",
            "type": "mobile_large"
            //"Release Date":"2012-09"
        },
        "GT-N7100":
        {
            "'model'": "GT-N7100",
            //"Device Name":"Samsung Galaxy Note 2 N7100",
            //"Platform":"Android",
            //"OS Version":"4.1.1",
            "PortraitWidth": "360",
            "LandscapeWidth": "640",
            "type": "mobile_small"
            //"Release Date":"2012-09"
        },
        "SHW-M440S":
        {
            "model": "SHW-M440S",
            //"Device Name":"Samsung Galaxy S3 I9300",
            //"Platform":"Android",
            //"OS Version":"4.0.4",
            "type": "mobile_small",
            "PortraitWidth": "360",
            "LandscapeWidth": "640"
            //"Release Date":"2012-05"
        },
        "SHV-E330":
        {
            "model": "SHV-E330",
            //"Device Name":"Samsung Galaxy S4 I9505",
            //"Platform":"Android",
            //"OS Version":"4.2.2",
            "type": "mobile_small",
            "PortraitWidth": "360",
            "LandscapeWidth": "640"
            //"Release Date":"2013-04"
        },
        "SHW-M380":
        {
            "model": "SHW-M380",
            //"Device Name":"Samsung Galaxy Tab 10.1 P7510",
            //"Platform":"Android",
            //"OS Version":"3.2",       
            "type": "mobile_medium",
            "PortraitWidth": "800",
            "LandscapeWidth": "1280"
            //"Release Date":"2011-07"
        },
        "Nexus 5X":
        {
            "model": "Nexus 5X",
            //"Device Name":"Nexus 5X",
            //"Platform":"Android",
            //"OS Version":"4.4",
            "type": "mobile_small",
            "PortraitWidth": "412",
            "LandscapeWidth": "732"
            //"Release Date":"2013-10"
        },
        "Nexus 10":
        {
            "model": "Nexus 10",
            //"Device Name":"Nexus 10",
            //"Platform":"Android",
            //"OS Version":"4.2.2",
            "type": "mobile_medium",
            "PortraitWidth": "800",
            "LandscapeWidth": "1280"
            //"Release Date":"2012-11"
        },
        "Nexus 4":
        {
            "model": "Nexus 4",
            //"Device Name":"Nexus 4",
            //"Platform":"Android",
            //"OS Version":"4.2.1",
            "type": "mobile_small",
            "PortraitWidth": "384",
            "LandscapeWidth": "598"
            //"Release Date":"2012-11"
        },
        "Nexus 5":
        {
            "model": "Nexus 5",
            //"Device Name":"Nexus 5",
            //"Platform":"Android",
            //"OS Version":"4.4",
            "type": "mobile_small",
            "PortraitWidth": "360",
            "LandscapeWidth": "598"
            //"Release Date":"2013-10"
        },
        "Nexus 6":
        {
            "'model'": "Nexus 6",
            //"Device Name":"Nexus 6",
            //"Platform":"Android",
            //"OS Version":"4.1.1",
            "type": "mobile_medium",
            "PortraitWidth": "412",
            "LandscapeWidth": "732"
            //"Release Date":"2012-07"
        },
        "Nexus 7":
        {
            "model": "Nexus 7",
            //"Device Name":"Nexus 7",
            //"Platform":"Android",
            //"OS Version":"4.3",
            "type": "mobile_medium",
            "PortraitWidth": "601",
            "LandscapeWidth": "962"
            //"Release Date":"2012-07"
        },
        "IM-A910":
        {
            "model": "IM-A910",
            //"Device Name":"",
            //"Platform":"Android",
            //"OS Version":"4.3",
            "type": "mobile_small",
            "PortraitWidth": "360",
            "LandscapeWidth": "640"
            //"Release Date":"2012-07"
        },
        "IM-A840":
        {
            "model": "IM-A840",
            //"Device Name":"",
            //"Platform":"Android",
            //"OS Version":"4.3",
            "type": "mobile_small",
            "PortraitWidth": "360",
            "LandscapeWidth": "592"
            //"Release Date":"2012-07"
        },
        "SM-N900":
        {
            "model": "SM-N900",
            //"Device Name":"Samsung Galaxy Note 3 N9005",
            //"Platform":"Android",
            //"OS Version":"4.3",
            "type": "mobile_small",
            "PortraitWidth": "360",
            "LandscapeWidth": "640"
            //"Release Date":"2013-09"
        },
        "SM-G935S":
        {
            "model": "SM-G935S",
            //"Device Name":"Samsung Galaxy S7 Edge",
            //"Platform":"Android",
            "type": "mobile_small",
            "PortraitWidth": "360",
            "LandscapeWidth": "640",
            "ZoomFactor": "75"
        },
        "SM-G906K":
        {
            "model": "SM-G906K",
            //"Device Name":"Samsung Galaxy S7 Edge",
            //"Platform":"Android",
            "type": "mobile_small",
            "PortraitWidth": "360",
            "LandscapeWidth": "640",
            "ZoomFactor": "75"
        },
        "F180":
        {
            "model": "LG-F180S", //LG-F180S
            //"Device Name":"LG Optimus G E975",
            //"Platform":"Android",
            //"OS Version":"4.1.2",
            "type": "mobile_small",
            "PortraitWidth": "384",
            "LandscapeWidth": "640"
            //"Release Date":"2012-11"
        }
    };

    nexacro._openSystemCalendar = function (calendar, v, callbackFn)
    {
        nexacro.__openSystemCalendar(calendar, v, callbackFn);
    };

    nexacro._closeSystemCalendar = function ()
    {
        nexacro.__closeSystemCalendar();
    };

    nexacro._isDeactivate = function ()
    {
        return nexacro.__isDeactivate();
    };

    nexacro._setDeactivate = function (deactivate)
    {
        nexacro.__setDeactivate(deactivate);
    };

    nexacro._getDisplayTextfromDecorateText = function (text)
    {
        var strtemp = text;

        var expPrefixMap = [/<\/?ff\s+[v]\s*=['"].*?>/g, /<\/?fs\s+[v]\s*=['"].*?>/g, /<\/?fc\s+[v]\s*=['"].*?>/g, /<\/?b\s+[v].*?>/g, /<\/?i\s+[v].*?>/g, /<\/?u\s+[v].*?>/g, /<\/?s\s+[v].*?>/g, /<\/?l\s+[v].*?>/g];
        var expSufixMap = [/<\/ff>/g, /<\/fs>/g, /<\/fc>/g, /<\/b>/g, /<\/i>/g, /<\/u>/g, /<\/s>/g, /<\/l>/g];
        var expPrefixInvalidMap = [/<ff\s+(?!v\s*=\s*[^>]|\s)[^>]*>/g, /<fs\s+(?!v\s*=\s*[^>]|\s)[^>]*>/g, /<fc\s+(?!v\s*=\s*[^>]|\s)[^>]*>/g, /<b\s+(?!v\s*=\s*[^>]|\s)[^>]*>/g, /<i\s+(?!v\s*=\s*[^>]|\s)[^>]*>/g, /<u\s+(?!v\s*=\s*[^>]|\s)[^>]*>/g, /<s\s+(?!v\s*=\s*[^>]|\s)[^>]*>/g, /<l\s+(?!v\s*=\s*[^>]|\s)[^>]*>/g];
        var expSufixInvalidMap = [/<\/ff>/, /<\/fs>/, /<\/fc>/, /<\/b>/, /<\/i>/, /<\/u>/, /<\/s>/, /<\/l>/];
        var reg_valid = /<(?!\/?(ff|fs|fc|b|i|u|s|l)\s+v\s*=)[^>]*>/g;


        strtemp = strtemp.replace(reg_valid, "");

        for (var i = 0; i <= expPrefixMap.length - 1; i++)
        {
            var invalidexp = expPrefixInvalidMap[i];
            var invalidexec = invalidexp.exec(strtemp);

            // 형식에 맞지 않는 태그 제거 처리
            while (invalidexec)
            {
                strtemp = strtemp.replace(invalidexec[0], "").replace(expSufixInvalidMap[i], "");
                invalidexec = invalidexp.exec(strtemp);
            }
            //var idx = 0;
            var preexp = expPrefixMap[i];
            var sufexp = expSufixMap[i];
            var preexec = preexp.exec(strtemp);
            var sufexec;

            while (preexec)
            {
                sufexec = sufexp.exec(strtemp);
                var startidx = preexec.index;
                var endidx = sufexp.lastIndex;

                var frontstr = strtemp.substring(0, startidx);
                var endstr = strtemp.substring(endidx, strtemp.length);
                var changestr = strtemp.substring(startidx, endidx);

                if (sufexec)
                {
                    changestr = changestr.replace(preexec[0], "");
                    if (sufexec[0])
                    {
                        changestr = changestr.replace(sufexec[0], "");
                    }
                }
                else
                {
                    // 끝 태그가 없는 경우 시작태그를 제거하여 처리
                    changestr = "";
                    endidx = startidx + preexec[0].length;
                    endstr = strtemp.substring(endidx, strtemp.length);
                }

                strtemp = frontstr + changestr + endstr;

                preexp.lastIndex = 0;
                sufexp.lastIndex = 0;
                preexec = preexp.exec(strtemp);
            }
            // 종료 태그만 있는 경우

            sufexec = sufexp.exec(strtemp);
            while (sufexec)
            {
                strtemp = strtemp.replace(sufexec[0], "");
                sufexec = sufexp.exec(strtemp);
            }
        }

        return strtemp;
    };
    nexacro._CheckShowContextPrevented = function (comp, target, button, altKey, ctrlKey, shiftKey, clientX, clientY, screenX, screenY, offsetX, offsetY, metaKey)
    {

        //default
        //   ->rbuttonup
        // sapari
        //   ->rbuttondown
        // enabletouchevent
        //   ->oncontextmenu
        var canceldecontextmenu = false;
        var listener;
        var rbuttonActiondevice = false;
        const env = nexacro.getEnvironment();
        if (env._p_enabletouchevent)        
        {
            if (target._p_visible && target._isEnable())
                comp.on_fire_oncontextmenu(comp, target, button, offsetX, offsetY, clientX, clientY, altKey, ctrlKey, shiftKey, screenX, screenY, metaKey);

            listener = comp.oncontextmenu;
            if (listener && listener.defaultprevented)
            {
                canceldecontextmenu = true;
            }
        }
        else
        {
            if (nexacro._OS == "Mac OS" && nexacro._Browser != "Runtime")
                rbuttonActiondevice = true;

            if (nexacro._OS == "Android" || nexacro._OS == "iOS")
                rbuttonActiondevice = true;

            if (nexacro._OS == "Windows" && (nexacro._Browser == "Safari" || nexacro._Browser == "MobileSafari"))
                rbuttonActiondevice = true;

            if (rbuttonActiondevice)
            {
                listener = comp.onrbuttondown;
                if (listener && listener.defaultprevented)
                {
                    canceldecontextmenu = true;
                }
                else
                {
                    if (target._p_visible && target._isEnable())
                        comp.on_fire_oncontextmenu(comp, target, button, offsetX, offsetY, clientX, clientY, altKey, ctrlKey, shiftKey, screenX, screenY, metaKey);

                    listener = comp.oncontextmenu;
                    if (listener && listener.defaultprevented)
                    {
                        canceldecontextmenu = true;
                    }
                }
            }
            else
            {
                listener = comp.onrbuttonup;
                if (listener && listener.defaultprevented)
                {
                    canceldecontextmenu = true;
                }
                else
                {
                    if (target._p_visible && target._isEnable())
                        comp.on_fire_oncontextmenu(comp, target, button, offsetX, offsetY, clientX, clientY, altKey, ctrlKey, shiftKey, screenX, screenY, metaKey);

                    listener = comp.oncontextmenu;
                    if (listener && listener.defaultprevented)
                    {
                        canceldecontextmenu = true;
                    }
                }
            }
        }
        return canceldecontextmenu;

    };
    nexacro._checkShowContextMenu = function (comp)
    {
        var environment = nexacro.getEnvironment();
        var env_usecontextmenu = environment ? environment._p_usecontextmenu : "all";
        var bForm = (comp instanceof nexacro.Form);
        var bEdit = (comp instanceof nexacro.Edit || comp instanceof nexacro.MaskEdit || comp instanceof nexacro.TextArea);
        var bSketch = comp instanceof nexacro.Sketch; //Edit도 

        if (!bEdit && nexacro.TextField)
            bEdit = (comp instanceof nexacro.TextField || comp instanceof nexacro.MultiLineTextField);

        if (nexacro._Browser == "Runtime")
        {
            if (env_usecontextmenu == "all")
            {
                if (bEdit) return comp._p_usecontextmenu;
                return true;
            }
            else if (env_usecontextmenu == "form")
            {
                if (bForm) return true;
            }
            else if (env_usecontextmenu == "edit")
            {
                if (bEdit) return comp._p_usecontextmenu;
            }
        }
        else
        {
            if (env_usecontextmenu == "all" || env_usecontextmenu == "edit")
            {
                if (bEdit || bSketch) return comp._p_usecontextmenu;
            }
        }

        return false;
    };

    nexacro.setRenderingType = function (v)
    {
        nexacro._setRenderingType(v);
    };

    nexacro.gc = function ()
    {
        nexacro._gc();
    };

    nexacro.getEnableWheelZoom = function (targetFrame)
    {
        return nexacro._getEnableWheelZoom(targetFrame);
    };

    nexacro.setEnableWheelZoom = function (targetFrame, newEnableWheelZoom)
    {
        nexacro._setEnableWheelZoom(targetFrame, newEnableWheelZoom);
    };

    nexacro.getWheelZoom = function (targetFrame)
    {
        return nexacro._getWheelZoom(targetFrame);
    };

    nexacro.setWheelZoom = function (targetFrame, newWheelZoom)
    {
        nexacro._setWheelZoom(targetFrame, nexacro._toInt(newWheelZoom));
    };

    nexacro._getParsedUri = function (uri)
    {
        if (!uri)
            return null;

        var ret = uri.match(/^((\w+):)?(\/\/((\w+)?(:(\w+))?@)?([^\/\?:]+)(:(\d+))?)?(\/?([^\/\?#][^\?#]*)?)?(\?([^#]+))?/);

        return ret && {
            url: ret[0],
            protocol: ret[2],
            username: ret[5],
            password: ret[7],
            host: ret[8],
            port: ret[10],
            pathname: ret[11],
            querystring: ret[14]
        };
    };

    nexacro._isWebTypeComponent = function (comp)
    {
        if (comp && comp instanceof nexacro.WebBrowser
            || comp instanceof nexacro.WebView)
        {
            return true;
        }
        return false;
    };
    nexacro._isWebTypeElement = function (elem)
    {
        if (elem && elem instanceof nexacro._WebBrowserPluginElement
            || elem instanceof nexacro._WebViewPluginElement)
        {
            return true;
        }
        return false;
    };
    nexacro._isSameOrigin = function (v1, v2)
    {
        if (!v1 || !v2)
            return false;

        var uri1 = nexacro._getParsedUri(v1);
        var uri2 = nexacro._getParsedUri(v2);

        if (!uri1 || !uri2)
            return false;

        if (uri1.protocol != uri2.protocol)
            return false;

        if (uri1.host != uri2.host)
            return false;

        if (nexacro._Browser != "Runtime" && !nexacro._isSameDomain(uri1.host, uri2.host))
            return false;

        if (uri1.port != uri2.port)
            return false;

        return true;

    };

    nexacro._getContentType = nexacro._emptyFn;

    nexacro._Deserializer = {
        "SSV": function (strRecvData, target)
        {
            var variablelist = {};
            var datasetlist = [];

            //var _rs_ = String.fromCharCode(30);
            //var _cs_ = String.fromCharCode(31);
            var _rs_ = nexacro._getSSVRecordSeparator();
            var _cs_ = nexacro._getSSVUnitSeparator();

            var code = 0;
            var message = "SUCCESS";

            if (!strRecvData)
            {
                return [{ "ErrorCode": code, "ErrorMsg": message }, null];
            }

            //var form = target.context;

            var ssvLines = strRecvData.split(_rs_);
            var lineCnt = ssvLines.length;
            var curIdx = 1;
            var curStr;
            var paramStr, varInfo, val, sep_pos, id;
            // parse parameters		
            for (; curIdx < lineCnt; curIdx++)
            {
                curStr = ssvLines[curIdx];
                if (curStr.substring(0, 7) != "Dataset")
                {
                    var paramArr = curStr.split(_cs_);
                    var paramCnt = paramArr.length;
                    for (var i = 0; i < paramCnt; i++)
                    {
                        paramStr = paramArr[i];
                        varInfo = paramStr;
                        val = undefined;
                        sep_pos = paramStr.indexOf("=");
                        if (sep_pos >= 0)
                        {
                            varInfo = paramStr.substring(0, sep_pos);
                            val = paramStr.substring(sep_pos + 1);
                            if (val == String.fromCharCode(3))
                                val = undefined;
                        }

                        if (varInfo)
                        {
                            id = varInfo;
                            sep_pos = varInfo.indexOf(":");
                            if (sep_pos >= 0)
                            {
                                id = varInfo.substring(0, sep_pos);
                            }

                            if (id == "ErrorCode")
                            {
                                code = parseInt(val) | 0;
                                if (isFinite(code) == false)
                                {
                                    code = -1;
                                }
                                variablelist[id] = code;
                            }
                            else if (id == "ErrorMsg")
                            {
                                variablelist[id] = val;
                            }
                            else if (target)
                            {
                                target._setParamter(id, val);
                            }

                        }
                    }
                }
                else
                {
                    break;
                }
            }

            if (code <= -1)
            {
                ssvLines.length = 0;
                strRecvData = null;
                return [variablelist, null];
            }

            function __find_next_dataset_loopFn(i)
            {
                var curStr = ssvLines[i];
                if (curStr.substring(0, 7) == "Dataset")
                {
                    return true;
                }
            }

            while (true)
            {
                curIdx = nexacro.__forLoop(this, curIdx, lineCnt, __find_next_dataset_loopFn);
                if (curIdx >= lineCnt)
                    break;

                curStr = ssvLines[curIdx];
                sep_pos = curStr.indexOf(":");
                if (sep_pos >= 0)
                {
                    var remoteId = curStr.substring(sep_pos + 1);
                    if (remoteId && remoteId.length)
                    {
                        var ds = target && target._getDataset(remoteId);
                        if (!ds)
                            ds = new nexacro.DatasetBase(remoteId);

                        ds._p_rowposition = -1;
                        curIdx = ds.loadFromSSVArray(ssvLines, lineCnt, curIdx, true);
                        datasetlist.push(ds);
                    }
                    else
                    {
                        curIdx++;
                    }
                }
                else
                {
                    curIdx++;
                }
            }

            ssvLines.length = 0;
            return [variablelist, datasetlist];
        },
        "XML": function (doc, target)
        {
            var variablelist = {};
            var paramElems = doc.getElementsByTagName("Parameter");
            var code = 0;
            var i;
            if (paramElems && paramElems.length)
            {
                var varCnt = paramElems.length;
                for (i = 0; i < varCnt; i++)
                {
                    var paramElem = paramElems[i];
                    var id = paramElem.getAttribute("id");
                    if (id && id.length)
                    {
                        var val = (paramElem.textContent || (paramElem.firstChild ? paramElem.firstChild.nodeValue : ""));

                        if (id == "ErrorCode")
                        {
                            code = parseInt(val) | 0;
                            if (isFinite(code) == false)
                            {
                                code = -1;
                            }
                            variablelist[id] = code;
                        }
                        else if (id == "ErrorMsg")
                        {
                            variablelist[id] = val;
                        }
                        else
                        {
                            if (target)
                                target._setParamter(id, val);
                        }
                    }
                }
            }

            if (code < 0)
            {
                return [variablelist, null];
            }

            var datasetlist = [];
            var datasets = doc.getElementsByTagName("Dataset");
            if (datasets && datasets.length)
            {
                var dataCnt = datasets.length;
                for (i = 0; i < dataCnt; i++)
                {
                    var remoteId = datasets[i].getAttribute("id");
                    if (remoteId && remoteId.length)
                    {
                        var ds = target && target._getDataset(remoteId);
                        if (!ds)
                            ds = new nexacro.DatasetBase(remoteId);

                        ds._p_rowposition = -1;
                        ds.loadFromDOM(datasets[i]);
                        datasetlist.push(ds);
                    }
                }
            }
            return [variablelist, datasetlist];
        },
        "JSON": function (strRecvData, target)
        {
            var variablelist = {};
            var datasetlist = [];

            var code = 0;
            var message = "SUCCESS";
            // var env = nexacro.getEnvironment();
            //var datasetloadtype = env.datasetloadtype;
            var i, ds;

            if (!strRecvData)
            {
                return [[-1, "Stream Data is null!"], null, null];
            }

            //var form = this.context;
            var jsonobj = JSON.parse(strRecvData);
            var arr_ds = jsonobj.Datasets;

            //var head_parse_pos = 0;
            var paramsInfo = jsonobj.Parameters;
            if (paramsInfo)
            {
                var paramslen = paramsInfo.length;

                for (i = 0; i < paramslen; i++)
                {
                    var attr = paramsInfo[i];
                    var id = attr.id;
                    var val = attr.value;
                    var type = attr.type;
                    if (id && id.length)
                    {
                        if (id == "ErrorCode")
                        {
                            code = parseInt(val) | 0;
                            if (isFinite(code) == false)
                            {
                                code = -1;
                            }
                            val = code;
                        }
                        else if (id == "ErrorMsg")
                        {
                            message = val;
                        }
                        else if (target)
                        {
                            target._setParamter(id, val);
                        }
                        variablelist[id] = val;
                    }
                }
            }

            if (code <= -1)
            {
                return [variablelist, null];
            }

            var datasetInfo = arr_ds;
            var dslen = datasetInfo ? datasetInfo.length : 0;
            for (i = 0; i < dslen; i++)
            {
                var obj = datasetInfo[i];
                var remoteId = obj.id;
                var ds = target && target._getDataset(remoteId);
                if (!ds)
                    ds = new nexacro.DatasetBase(remoteId);
                if (ds)
                {
                    ds._p_rowposition = -1;
                    ds._loadFromJSONObj(datasetInfo[i], null, (type == "P"), code, message);
                    datasetlist.push(ds);
                }
            }
            return [variablelist, datasetlist];
        }
    };

    nexacro._addCookieToCookieVariable = function (cookieStr)
    {
        // addcookie to cookievariable
        //for cookie
        if (cookieStr)
        {
            var cookielist = cookieStr.split("; ");
            var cookievarCnt = cookielist.length;
            var sep_pos;
            var cookieid, cookievalue;
            for (var i = 0; i < cookievarCnt; i++)
            {
                sep_pos = cookielist[i].indexOf("=");
                if (sep_pos <= 0)
                {
                    cookieid = cookielist[i];
                }
                else
                {
                    cookieid = cookielist[i].substr(0, sep_pos);
                    cookievalue = cookielist[i].substr(sep_pos + 1);
                }

                const env = nexacro.getEnvironment();
                if (env && env._p_addcookietovariable)
                {
                    nexacro._setCookieVariable(cookieid, cookievalue, false);  // 변수로만 생성, cookie 값은 갱신하지 않는다.
                }
            }
        }
    };

    nexacro._addCookieFromCookieVariables = function ()
    {
        //Env 에 있는 cookie variable 을 가져온다..
        var envcookies = nexacro._getCookieVariables(4);
        var prop;
        if (envcookies)
        {
            for (prop in envcookies)
            {
                nexacro._setCookie(prop, envcookies[prop].value, null, false);
            }
        }

        var envsecurecookies = nexacro._getCookieVariables(6);
        if (envsecurecookies)
        {
            for (prop in envsecurecookies)
            {
                nexacro._setCookie(prop, envsecurecookies[prop].value, null, true);
            }
        }

    };

    nexacro._getRTLCanvasXForMouseEvent = function (obj, refer_comp, canvasX)
    {
        var tempX = canvasX;

        if (obj == refer_comp)
        {
            tempX = obj._adjust_width - canvasX;
        }
        else
        {
            var comp = refer_comp;
            tempX = comp._adjust_left + comp._adjust_width - tempX + comp._adjust_left;
            comp = comp._p_parent;
            while (obj != comp)
            {
                tempX += comp._adjust_left + comp._adjust_left;
                comp = comp._p_parent;
            }
        }
        return tempX;
    };

    nexacro._cloneObject = function (obj)
    {
        //a deep clone of 'from' is returned

        var arr_nexacro_types = ["Decimal", "Date"] //,"Point" ,"ObjectArray"]; // Add type_name of nexacro to this array, if you need
        if (obj && obj._type_name && arr_nexacro_types.indexOf(obj._type_name) >= 0)
        {
            return obj.clone();
        }

        function extend(from, to)
        {
            if (from == null || typeof from != "object") return from;
            if (from.constructor == RegExp || from.constructor == Function ||
                from.constructor == String || from.constructor == Number || from.constructor == Boolean)
                return new from.constructor(from);
            else if (from.constructor == Date)
                return new from.constructor(from.getTime());

            if (from.constructor != Object && from.constructor != Array)
            {
                if (!from._type_name || arr_nexacro_types.indexOf(from._type_name) < 0)
                    return from;
            }

            to = to || new from.constructor();

            for (var name in from)
            {
                //to[name] = typeof to[name] == "undefined" ? extend(from[name], null) : to[name];
                to[name] = extend(from[name]);
            }

            return to;
        }

        return extend(obj);
    };


    if (!nexacro._ImageType)
    {
        nexacro._ImageType = {};
        nexacro._ImageType._imagetable = {
            "file":
            {
                "BMP":
                {
                    "ntype": 0,
                    "datatype": "image/bmp",
                    "ext": "bmp"
                },
                "BMP_MONO":
                {
                    "ntype": 5,
                    "datatype": "image/bmp",
                    "ext": "bmp"
                },
                "JPG":
                {
                    "ntype": 2,
                    "datatype": "image/jpeg",
                    "ext": "jpg"
                },
                "TIF":
                {
                    "ntype": 4,
                    "datatype": "image/tiff",
                    "ext": "tif"
                },
                "TIF_24":
                {
                    "ntype": 6,
                    "datatype": "image/tiff",
                    "ext": "tif"
                },
                "TIF_MONO":
                {
                    "ntype": 7,
                    "datatype": "image/tiff",
                    "ext": "tif"
                },
                "GIF":
                {
                    "ntype": 3,
                    "datatype": "image/gif",
                    "ext": "gif"
                },
                "PNG":
                {
                    "ntype": 1,
                    "datatype": "image/png",
                    "ext": "png"
                }

            },
            "base64":
            {
                "PNG":
                {
                    "ntype": 1,
                    "datatype": "image/png"
                },
                "JPEG":
                {
                    "ntype": 2,
                    "datatype": "image/jpeg"
                },
                "JPG":
                {
                    "ntype": 2,
                    "datatype": "image/jpeg"
                },
                "GIF":
                {
                    "ntype": 3,
                    "datatype": "image/gif"
                },
                "BMP":
                {
                    "ntype": 8,
                    "datatype": "image/bmp"
                },
                "TIFF":
                {
                    "ntype": 4,
                    "datatype": "image/tiff"
                },
                "TIF":
                {
                    "ntype": 4,
                    "datatype": "image/tiff"
                },
                "X_ICON":
                {
                    "ntype": 1,
                    "datatype": "image/x-icon"
                },
                "SVG_XML":
                {
                    "ntype": 1,
                    "datatype": "image/svg+xml"
                },
                "WEBP":
                {
                    "ntype": 1,
                    "datatype": "image/webp"
                },
                "TIF_24":    // runtime 전용이지만 추가한다.
                {
                    "ntype": 6,
                    "datatype": "image/tiff_24"

                },
                "TIF_MONO":
                {
                    "ntype": 7,
                    "datatype": "image/tiff_mono"

                },
                "BMP_MONO":
                {
                    "ntype": 5,
                    "datatype": "image/bmp_mono"

                }
            }
        };
        nexacro._ImageType.getImageType = function (format, type)
        {
            var obj;
            var result = null;
            if (format && (format === "file" || format === "base64"))
            {
                if (!type)
                {
                    switch (format)
                    {
                        case "file":
                            type = "BMP";
                            break;
                        case "base64":
                            type = "PNG";
                            break;

                    }
                }
                obj = nexacro._ImageType._imagetable[format];
                if (obj && obj.hasOwnProperty(type))
                {
                    result = obj[type];
                    result.type = type;
                }
                else if (obj)  // 찾지 못했다면 기본값으로 적용되게 한다.
                {
                    switch (format)
                    {
                        case "file":
                            result = obj["BMP"];
                            result.type = "PNG";
                            break;
                        case "base64":
                            result = obj["PNG"];
                            result.type = "PNG";
                            break;

                    }
                }
            }
            return result;
        };
        nexacro._ImageType.calcImageQuality = function (datatype, option)
        {

            if (nexacro._Browser != "Runtime" && (datatype == "image/jpg" || datatype == "image/jpeg" || datatype == "image/webp"))
            {
                var result = 0.5;   // 메뉴얼상 동작은 0.5 기존동작은 1
                var str = option;
                var arrstr, length, item, filter, value, reg_exps0;
                if (typeof str == "string")
                {
                    arrstr = str.split(';');
                    length = arrstr.length;
                    reg_exps0 = /\bcompress:\b/ig;
                    for (var i = 0; i < length; i++)
                    {
                        item = arrstr[i].toLowerCase();
                        filter = reg_exps0.exec(item);

                        if (filter != null && filter.length == 1)
                        {
                            option = item.replace("compress:", "");
                        }
                    }

                }
                var opt = +option;
                if (!isNaN(opt))
                {
                    if (opt < 1)
                    {
                        result = ((opt) / 100).toFixed(2);
                    }
                    else
                        result = opt;
                }
                return result;
            }
            else
                return option;  // runtime API에서 파싱함 
        };
    }
    nexacro._getJSONPathObjectFromURL = function (url, path)
    {
        var jsonobj, rootobj;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.onreadystatechange = function ()
        {
            // In local files, status is 0 upon success in Mozilla Firefox
            if (xhr.readyState === XMLHttpRequest.DONE)
            {
                var status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400))
                {
                    var str = xhr.response;
                    if (str)
                        jsonobj = JSON.parse(str);
                }
            }
        };
        xhr.send(null);
        if (jsonobj)
            rootobj = nexacro._JSONPath(jsonobj, path);

        // KISA 보안취약점(6-2) 지적사항
        //trace(rootobj, XMLHttpRequest.DONE);

        return rootobj
    };


    /* JSONPath 0.8.0 - XPath for JSON
     *
     * Copyright (c) 2007 Stefan Goessner (goessner.net)
     * Licensed under the MIT (MIT-LICENSE.txt) licence.
     */
    nexacro._JSONPath = function (obj, expr, arg)
    {
        var $;
        var P = {
            resultType: arg && arg.resultType || "VALUE",
            result: [],
            normalize: function (expr) 
            {
                var subx = [];
                return expr.replace(/[\['](\??\(.*?\))[\]']/g, function ($0, $1) { return "[#" + (subx.push($1) - 1) + "]"; })
                    .replace(/'?\.'?|\['?/g, ";")
                    .replace(/;;;|;;/g, ";..;")
                    .replace(/;$|'?\]|'$/g, "")
                    .replace(/#([0-9]+)/g, function ($0, $1) { return subx[$1]; });
            },
            asPath: function (path)
            {
                var x = path.split(";"), p = "$";
                for (var i = 1, n = x.length; i < n; i++)
                    p += /^[0-9*]+$/.test(x[i]) ? ("[" + x[i] + "]") : ("['" + x[i] + "']");
                return p;
            },
            store: function (p, v) 
            {
                if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
                return !!p;
            },
            track: function (expr, val, path) 
            {
                if (expr)
                {
                    var x = expr.split(";"), loc = x.shift();
                    x = x.join(";");
                    if (val && val.hasOwnProperty(loc))
                        P.track(x, val[loc], path + ";" + loc);
                    else if (loc === "*")
                        P.walk(loc, x, val, path, function (m, l, x, v, p) { P.track(m + ";" + x, v, p); });
                    else if (loc === "..")
                    {
                        P.track(x, val, path);
                        P.walk(loc, x, val, path, function (m, l, x, v, p) { typeof v[m] === "object" && P.track("..;" + x, v[m], p + ";" + m); });
                    }
                    else if (/,/.test(loc)) 
                    { // [name1,name2,...]
                        for (var s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++)
                            P.track(s[i] + ";" + x, val, path);
                    }
                    else if (/^\(.*?\)$/.test(loc)) // [(expr)]
                        P.track(P.newfunc(loc, val, path.substr(path.lastIndexOf(";") + 1)) + ";" + x, val, path);
                    else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
                        P.walk(loc, x, val, path, function (m, l, x, v, p) { if (P.newfunc(l.replace(/^\?\((.*?)\)$/, "$1"), v[m], m)) P.track(m + ";" + x, v, p); });
                    else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
                        P.slice(loc, x, val, path);
                    else if (loc == "$")
                        P.store(loc, val);
                }
                else
                    P.store(path, val);
            },
            walk: function (loc, expr, val, path, f) 
            {
                if (val instanceof Array) 
                {
                    for (var i = 0, n = val.length; i < n; i++)
                        if (i in val)
                            f(i, loc, expr, val, path);
                }
                else if (typeof val === "object") 
                {
                    for (var m in val)
                        if (val.hasOwnProperty(m))
                            f(m, loc, expr, val, path);
                }
            },
            slice: function (loc, expr, val, path) 
            {
                if (val instanceof Array) 
                {
                    var len = val.length, start = 0, end = len, step = 1;
                    loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function ($0, $1, $2, $3) { start = parseInt($1 || start); end = parseInt($2 || end); step = parseInt($3 || step); });
                    start = (start < 0) ? Math.max(0, start + len) : Math.min(len, start);
                    end = (end < 0) ? Math.max(0, end + len) : Math.min(len, end);
                    for (var i = start; i < end; i += step)
                        P.track(i + ";" + expr, val, path);
                }
            },
            newfunc: function (x, _v, _vname) 
            {
                try { return $ && _v && new Function("_v", "return " + x.replace(/@/g, "_v"))(_v); }
                catch (e) { throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a")); }
            }
        };

        $ = obj;
        if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) 
        {
            P.track(P.normalize(expr).replace(/^\$;/, ""), obj, "$");
            return P.result.length > -1 ? P.result : false;
        }
    };
}

nexacro._encodeURI = function (url) 
{
    // encodeURIComponent 대상이 되는 특수 문자 목록
    const delimiters = ";,/?:@&=+$#";

    // 정규식 생성 (특수 문자를 구분자로 분리하기 위해 이스케이프 처리)
    const regex = new RegExp(`([${delimiters.split('').map(char => '\\' + char).join('')}])`);

    // URL을 특수 문자 기준으로 split하면서 구분자도 배열로 보관
    const parts = url.split(regex);

    // 각 파트를 처리 (디코딩한 후 다시 인코딩)
    const processedParts = parts.map(part =>
    {
        if (delimiters.includes(part)) return part; // 특수 문자는 그대로 유지

        try
        {
            const decodedPart = decodeURIComponent(part);
            return encodeURIComponent(decodedPart)
        }
        catch (e)
        {
            // 에러 시, 원본 사용
            return part;
        }
    });

    return processedParts.join('');
};

nexacro._decodeURI = function (url) 
{
    // encodeURIComponent 대상이 되는 특수 문자 목록
    const delimiters = ";,/?:@&=+$#";

    // 정규식 생성 (특수 문자를 구분자로 분리하기 위해 이스케이프 처리)
    const regex = new RegExp(`([${delimiters.split('').map(char => '\\' + char).join('')}])`);

    // URL을 특수 문자 기준으로 split하면서 구분자도 배열로 보관
    const parts = url.split(regex);

    // 각 파트를 처리 (디코딩한 후 다시 인코딩)
    const processedParts = parts.map(part =>
    {
        if (delimiters.includes(part)) return part; // 특수 문자는 그대로 유지

        try
        {
            return decodeURIComponent(part);
        }
        catch (e)
        {
            // 에러 시, 원본 사용
            return part;
        }
    });

    return processedParts.join('');
};

//chrome.webview 전용
if (globalThis.chrome && globalThis.chrome.webview)
{
    //js --> cpp
    nexacro._messageToNative = function (id, div, method, params, is_sync, is_get)
    {
        try
        {
            var json = { id: id, div: div, method: method, params: params };
            var jsonstr = JSON.stringify(json);
            if (is_sync === true)
            {
                let _native = globalThis.chrome.webview.hostObjects.hostNexacro;
                let _host = globalThis.chrome.webview.hostObjects.sync.hostNexacro;
                if (_native)
                {
                    if (is_get === true)
                        return _host.__exec(jsonstr);
                    else
                        _host.__message(jsonstr);
                }
            }
            else
            {
                globalThis.chrome.webview.postMessage(jsonstr);
            }
        }
        catch (e)
        {
            if (e && e.message)
            {
                trace(e.message);
            }
        }
    };

    //cpp(ExecuteScript) --> js
    //js에 function이 있으면 직접 호출하고 그 이외의 것은 여기 호출되게 하여 js 연계시킴;
    nexacro._messageFromNative = function (id, div, method, params)
    {
        //console.log("_messageFromNative = " + id + "," + div + "," + method);
    };
}

const createApp = nexaAppFactory ? nexaAppFactory : nexacro._emptyFn;

if (_process)
{
    _process = null;

    _pFuncBinder = null;
    _pSetterBinder = null;
    _pIntSetterBinder = null;
    _pPropBinder = null;
    _pNumPropBinder = null;
    _pObject = null;
    _pCollection = null;
    _pError = null;
    _pEventSinkObject = null;
    _pEventListener = null;

    _pEvent = null;
    _pEventInfo = null;
    _pTimerEventInfo = null;
    _pErrorEventInfo = null;
    _pExitEventInfo = null;
    _pAccessibilityEventInfo = null;
    _pActivateEventInfo = null;
    _pSysCommandEventInfo = null;
    _pCloseEventInfo = null;
    _pLoadEventInfo = null;
    _pSetFocusEventInfo = null;
    _pKillFocusEventInfo = null;
    _pMoveEventInfo = null;
    _pSizeEventInfo = null;
    _pKeyEventInfo = null;
    _pMouseEventInfo = null;
    _pClickEventInfo = null;
    _pMouseWheelEventInfo = null;
    _pScrollEventInfo = null;
    _pDragEventInfo = null;
    _pDragDataObject = null;
    _pGestureEventInfo = null;
    _pTapEventInfo = null;
    _pLongPressEventInfo = null;
    _pSlideEventInfo = null;
    _pPinchEventInfo = null;
    _pFlingEventInfo = null;
    _pZoomEventInfo = null;
    _pOrientationChangeEventInfo = null;
    _pContextMenuEventInfo = null;
    _pExtendedCommandEventInfo = null;
    _pTouchInput = null;
    _pTouchInputInfo = null;
    _pTouchEventInfo = null;
    _pItemClickEventInfo = null;
    _pChangeEventInfo = null;
    _pChangedEventInfo = null;
    _pItemChangeEventInfo = null;
    _pDuplicateExecutionEventInfo = null;
    _pEventUserNotify = null;
    _pEventAppUserNotify = null;
    _pEventAddLog = null;
    _pEventCommunication = null;
    _pNotificationEventInfo = null;
    _pDevicePermissionEventInfo = null;

    __pDataCache = null;
    __pCommunicationItem = null;
    _pProtocolAdp = null;
    _pDeviceAdaptor = null;
    _pCommunicationError = null;
    _pNativeError = null;
}
