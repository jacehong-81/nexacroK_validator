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

if (!nexacro.HTMLContentBox)
{
    //==============================================================================
    // nexacro.HTMLContentBox
    //==============================================================================
    nexacro.HTMLContentBox = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.HTMLComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pHTMLContentBox = nexacro._createPrototype(nexacro.HTMLComponent, nexacro.HTMLContentBox);
    nexacro.HTMLContentBox.prototype = _pHTMLContentBox;
    _pHTMLContentBox._type_name = "HTMLContentBox";
}
