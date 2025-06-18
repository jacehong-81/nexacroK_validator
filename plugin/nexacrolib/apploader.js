

// generate 시에 frameworkjs를 path를 넣어주고, 파일을 project root 위치로 copy
//const code = (function (global, frameworks = [])

/*const updatedCode = code.replace(
    /(frameworks\s*=\s*\[\s*\n?\s*\])/,
    `frameworks = [
    "./nexacrolib/framework/framework.mjs",
    "./nexacrolib/component/component.mjs",
    "./environment.xml.mjs"
]`
);*/
(function (global, frameworks = [

    "./nexacrolib/framework/Framework.mjs",
    "./nexacrolib/component/CompBase.mjs",
    "./nexacrolib/component/ComComp.mjs",
    "./nexacrolib/component/Grid.mjs",
    "./nexacrolib/component/ListView.mjs",
    "./nexacrolib/component/DeviceAPI.mjs",
    "./nexacrolib/component/MobileComp.mjs",
    "./environment.xml.mjs"

])
{

    const currentScript = document.currentScript;
    const rawSrc = currentScript?.getAttribute('src');
    let baseuri = "";
    if (rawSrc) 
    {
        const basePath = rawSrc.replace(/[^/]*$/, '');
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
    }

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

    const scriptPath = document.currentScript?.src || "unknown";

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
        static async loadModules(modulePaths) 
        {
            try 
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
            catch (error) 
            {
                console.error(`Failed to load one or more modules: ${error.message}`);
                throw error; // 모든 파일이 다 로딩되어야 하므로, 실패 시 에러를 다시 던짐
            }
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
                console.warn(`The loader script at "${scriptPath}" is already loaded!`);

        }
        static cleanloader(app)
        {
            nexacroApp.registry().deleteByValue(app);

            if (nexacroApp.registry().size == 0)
                nexacroApp.registry(true);

        }
        static async loadframework(modulePaths)
        {
            nexacroApp.initregistry();

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

    return nexacroApp.loadframework(frameworks);

})(window)





