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
if (nexacro.DateField)
{
    var _pDateField = nexacro.DateField.prototype;

    //==============================================================================
    // nexacro.DateField 
    //==============================================================================


    //===============================================================
    // nexacro.DateField : Create & Destroy & Update
    //===============================================================


    //===============================================================
    // nexacro.DateField : Override
    //===============================================================


    //===============================================================
    // nexacro.DateField : Properties
    //===============================================================


    //===============================================================
    // nexacro.DateField : Methods
    //===============================================================


    //===============================================================
    // nexacro.DateField : Events
    //===============================================================


    //===============================================================
    // nexacro.DateField : Logical Part
    //===============================================================
    _pDateField.createCssDesignContents = function ()
    {
        this.set_value("today");
    };

    _pDateField._on_apply_expr = nexacro._emptyFn;

    delete _pDateField;
}
