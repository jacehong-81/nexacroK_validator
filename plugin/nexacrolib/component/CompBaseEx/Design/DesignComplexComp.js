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

if (nexacro.ComplexComponent)
{
    //==============================================================================
    // nexacro.ComplexComponent : Design
    //==============================================================================

    var _pComplexComponent = nexacro.ComplexComponent.prototype;

    //==============================================================================
    // nexacro.ComplexComponent : Design Contents
    //==============================================================================
 
    // [상위 Component 처리]
    // Design 시점에 별도로 처리되어야 하는 부분 처리
    
    /*
    // [component.design.contents.css:create]      // Css 편집화면에서 Preview용 Contents를 설정할때 Override 
    _pComponent._createCssDesignContents = function ()
    {
        this._onCreateCssDesignContents();
    };
    // [component.design.contents.css:show]
    _pComponent._showCssDesignContents = function ()
    {
        this._onCreateCssDesignContents();
    };
    // [component.design.contents.css:destroy] 
    _pComponent._destroyCssDesignContents = function ()
    {
        this._onDestroyCssDesignContents();
    };

    // [component.design.contents.form:create]      // Form 편집화면에서 Preview가 다를때 Override
    _pComponent._createFormDesignContents = function ()
    {
        this._onCreateFormDesignContents();
    };
    // [component.design.contents.form:show] 
    _pComponent._showFormDesignContents = function ()
    {
        this._onCreateFormDesignContents();
    };
    // [component.design.contents.form:destroy] 
    _pComponent._destroyFormDesignContents = function ()
    {
        this._onDestroyFormDesignContents();
    };

     // [component.design.contents.ctse:create]     // Formats Component의 Contents Editor의 Preview가 존재할때 Override
    _pComponent._createCtseDesignContents = function ()
    {
        this._onCreateCtseDesignContents();
    };
    // [component.design.contents.ctse:show] 
    _pComponent._showCtseDesignContents = function ()
    {
        this._onCreateCtseDesignContents();
    };
    // [component.design.contents.ctse:destroy] 
    _pComponent._destroyCtseDesignContents = function ()
    {
        this._onDestroyCtseDesignContents();
    };
    */

    /*
    // [component.design.contents:create]           // Css 편집화면에서 Preview용 Contents를 설정할때 Override 
    _pComplexComponent._onCreateCssDesignContents = function (mode)
    {
        // user sample contents create
        var _innerdataset = new nexacro.NormalDataset("_innerdataset", this);
        _innerdataset._setContents("<ColumnInfo><Column id=\"column1\" size=\"256\"/><Column id=\"column2\" size=\"256\"/></ColumnInfo><Rows><Row><Col id=\"column1\">1</Col><Col id=\"column2\">Item 1</Col></Row><Row><Col id=\"column1\">2</Col><Col id=\"column2\">Item 2</Col></Row><Row><Col id=\"column1\">3</Col><Col id=\"column2\">Item 3</Col></Row></Rows>");

        this.set_innerdataset(_innerdataset);
        this.set_codecolumn("column1");
        this.set_datacolumn("column2");
    };
    // [component.design.contents:show] 
    _pComplexComponent._onShowCssDesignContents = function ()
    {
        // user sample apperance set
        this.set_index(1);
    };
    // [component.design.contents:destroy] 
    _pComplexComponent._onDestroyCssDesignContents = function ()
    {
        // user sample contents destroy
        this.set_innerdataset(null);
    };

    // Form 편집화면에서 Preview가 다를때 Override 
    // [component.design.contents.form:create]      
    _pComplexComponent._onCreateFormDesignContents = function ()
    {
    };
    // [component.design.contents.form:show] 
    _pComplexComponent._onShowFormDesignContents = function ()
    {
    };
    // [component.design.contents.form:destroy] 
    _pComplexComponent._onDestroyFormDesignContents = function ()
    {
    };

    // Formats Component의 Contents Editor의 Preview가 존재할때 Override 
    // [component.design.contents.ctse:create]     
    _pComplexComponent._onCreateCtseDesignContents = function ()
    {
    };
    // [component.design.contents.ctse:show] 
    _pComplexComponent._onShowCtseDesignContents = function ()
    {
    };
    // [component.design.contents.ctse:destroy] 
    _pComplexComponent._onDestroyCtseDesignContents = function ()
    {
    };
    */

    //==============================================================================
    // nexacro.ComplexComponent : Design Logic
    //==============================================================================



    delete _pComplexComponent;
}