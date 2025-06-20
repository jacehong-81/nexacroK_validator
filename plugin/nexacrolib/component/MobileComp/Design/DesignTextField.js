﻿//==============================================================================
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
if (nexacro.TextField)
{
    var _pTextField = nexacro.TextField.prototype;

    //==============================================================================
    // nexacro.TextField 
    //==============================================================================


    //===============================================================
    // nexacro.TextField : Create & Destroy & Update
    //===============================================================


    //===============================================================
    // nexacro.TextField : Override
    //===============================================================


    //===============================================================
    // nexacro.TextField : Properties
    //===============================================================


    //===============================================================
    // nexacro.TextField : Methods
    //===============================================================


    //===============================================================
    // nexacro.TextField : Events
    //===============================================================


    //===============================================================
    // nexacro.TextField : Logical Part
    //===============================================================
    _pTextField.createCssDesignContents = function ()
    {
        this.set_value("TextField");
        this.set_useleadingbutton(true);
        this.set_usetrailingbutton(true);
        this.set_prefixtext("PRE");
        this.set_postfixtext("POST");
    };

    delete _pTextField;
}
