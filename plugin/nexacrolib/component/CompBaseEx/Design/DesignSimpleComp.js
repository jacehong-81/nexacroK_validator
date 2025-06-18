//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2014 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacro-public-license-readme-1.0.html	
//
//==============================================================================

if (nexacro.SimpleComponent)
{
    //==============================================================================
    // nexacro.SimpleComponent : Design
    //==============================================================================

    var _pSimpleComponent = nexacro.SimpleComponent.prototype;

    //==============================================================================
    // nexacro.SimpleComponent : Design Contents
    //==============================================================================
 
    // [기존 Component 처리]
    // TODO: _ 노출여부 확인후 소스통합

    // Css 편집화면에서 Preview용 Contents를 설정할때 Interface, Override 없음
    _pSimpleComponent.createCssDesignContents = function ()
    {
        this._createCssDesignContents();
    };
    // [component.design.contents.css:create]         
    _pSimpleComponent.createCssDesignContents = function ()
    {
        this._createCssDesignContents();
    };
    // [component.design.contents.css:show] 
    _pSimpleComponent.showCssDesignContents = function ()
    {
        this._showCssDesignContents();
    };
    // [component.design.contents.css:destroy] 
    _pSimpleComponent.destroyCssDesignContents = function ()
    {
        this._destroyCssDesignContents();
    };

    // Form 편집화면에서 Preview가 다를때 Interface, Override 없음
    // [component.design.contents.form:create]
    _pSimpleComponent.createFormDesignContents = function ()
    {
        this._createFormDesignContents();
    };
    // [component.design.contents.form:show] 
    _pSimpleComponent.showFormDesignContents = function ()
    {
        this._showFormDesignContents();
    };
    // [component.design.contents.form:destroy] 
    _pSimpleComponent.destroyFormDesignContents = function ()
    {
        this._destroyFormDesignContents();
    };

    // Formats Component의 Contents Editor의 Preview가 존재할때 Interface, Override 없음
    // [component.design.contents.ctse:create]
    _pSimpleComponent.createCtseDesignContents = function ()
    {
        this._createCtseDesignContents();
    };
    // [component.design.contents.ctse:show] 
    _pSimpleComponent.showCtseDesignContents = function ()
    {
        this._showCtseDesignContents();
    };
    // [component.design.contents.ctse:destroy] 
    _pSimpleComponent.destroyCtseDesignContents = function ()
    {
        this._destroyCtseDesignContents();
    };


    // [Simple Component 처리]
    // Css 편집화면에서 Preview용 Contents를 설정할때 Interface, Override 없음
    // [component.design.contents.css:create]         
    _pSimpleComponent._createCssDesignContents = function ()
    {
        this._onCreateCssDesignContents();
    };
    // [component.design.contents.css:show] 
    _pSimpleComponent._showCssDesignContents = function ()
    {
        this._onCreateCssDesignContents();
    };
    // [component.design.contents.css:destroy] 
    _pSimpleComponent._destroyCssDesignContents = function ()
    {
        this._onDestroyCssDesignContents();
    };

    // Form 편집화면에서 Preview가 다를때 Interface, Override 없음
    // [component.design.contents.form:create]      
    _pSimpleComponent._createFormDesignContents = function ()
    {
        this._onCreateFormDesignContents();
    };
    // [component.design.contents.form:show] 
    _pSimpleComponent._showFormDesignContents = function ()
    {
        this._onCreateFormDesignContents();
    };
    // [component.design.contents.form:destroy] 
    _pSimpleComponent._destroyFormDesignContents = function ()
    {
        this._onDestroyFormDesignContents();
    };

    // Formats Component의 Contents Editor의 Preview가 존재할때 Interface, Override 없음
    // [component.design.contents.ctse:create]    
    _pSimpleComponent._createCtseDesignContents = function ()
    {
        this._onCreateCtseDesignContents();
    };
    // [component.design.contents.ctse:show] 
    _pSimpleComponent._showCtseDesignContents = function ()
    {
        this._onCreateCtseDesignContents();
    };
    // [component.design.contents.ctse:destroy] 
    _pSimpleComponent._destroyCtseDesignContents = function ()
    {
        this._onDestroyCtseDesignContents();
    };


    // [개별 Component 처리]
    // Design 시점에 별도로 처리되어야 하는 부분 처리

    // Css 편집화면에서 Preview용 Contents를 설정할때 Override
    // [component.design.contents:create]
    _pSimpleComponent._onCreateCssDesignContents = function (mode)
    {
        // user sample contents
        //this.set_value("User Component");
    };
    // [component.design.contents:show] 
    _pSimpleComponent._onShowCssDesignContents = function ()
    {
        // user sample apperance
    //  this.setSelect(5, 14);
    };
    // [component.design.contents:destroy] 
    _pSimpleComponent._onDestroyCssDesignContents = function ()
    {
    };

    // Form 편집화면에서 Preview가 다를때 Override 
    // [component.design.contents.form:create]      
    _pSimpleComponent._onCreateFormDesignContents = function ()
    {
        //if (this.id)
            //this._setClientElementText(this.id);
    };
    // [component.design.contents.form:show] 
    _pSimpleComponent._onShowFormDesignContents = function ()
    {
    };
    // [component.design.contents.form:destroy] 
    _pSimpleComponent._onDestroyFormDesignContents = function ()
    {
    };

    // Formats Component의 Contents Editor의 Preview가 존재할때 Override 
    // [component.design.contents.ctse:create]     
    _pSimpleComponent._onCreateCtseDesignContents = function ()
    {
    };
    // [component.design.contents.ctse:show] 
    _pSimpleComponent._onShowCtseDesignContents = function ()
    {
    };
    // [component.design.contents.ctse:destroy] 
    _pSimpleComponent._onDestroyCtseDesignContents = function ()
    {
    };

    //==============================================================================
    // nexacro.SimpleComponent : Design Logic
    //==============================================================================



    delete _pSimpleComponent;
};


if (nexacro._CompUtil) 
{
    //==============================================================================
    // nexacro._CompUtil Design
    //==============================================================================

    nexacro._notify = function (msg)
    {
        if (this._notifycomp && this._notifycomp.value)
        {
            switch (this._notifytype)
            {
                case "addtext"  : return this._notifycomp.value += msg;
                case "addline"  : return this._notifycomp.value += msg + "\n";
                case "settext"  : return this._notifycomp.value = msg;
            }
        }

        return nexacro.__onNexacroStudioError(msg);
    };

};