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
// nexacro.Static && nexacro.Static_Style
//==============================================================================
if (nexacro.Static)
{
    var _pStatic = nexacro.Static.prototype;

    _pStatic.on_apply_text = function ()
    {
        var text = this._getStringResourceProperty(this._p_text);

        var cellElem = this._cell_elem;
        if (cellElem)
        {
            if (this._p_usedecorate)
                cellElem.setElementDecorateText(text);
            else
                cellElem.setElementText(text);
        }
    };

    _pStatic.createCssDesignContents = function ()
    {
        this.set_text("Static");
    };

    _pStatic = null;

}