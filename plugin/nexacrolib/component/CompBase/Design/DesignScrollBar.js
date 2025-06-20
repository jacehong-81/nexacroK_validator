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

if (nexacro.ScrollBarControl)
{
	var _pScrollBar = nexacro.ScrollBarControl.prototype;

	_pScrollBar.createCssDesignContents = function ()
	{
		this.set_max(100);
		this.set_pos(30);
	};

	_pScrollBar.updatePreviewPosition = function ()
    {
        var form = this._p_parent;
        var scrollbarsize = form._p_scrollbarsize ? form._p_scrollbarsize : this._default_scrollbarsize;
        
        if (this._p_direction == "vertical")
        {
            this.setOffsetWidth(scrollbarsize);
            this.setOffsetHeight(200);
        }
        else if (this._p_direction == "horizontal")
        {
            this.setOffsetWidth(200);
            this.setOffsetHeight(scrollbarsize);
        }
        
        var offset_left = (form._adjust_width / 2) - (this._adjust_width / 2);
        var offset_top = (form._adjust_height / 2) - (this._adjust_height / 2);

        this.move(offset_left, offset_top);
    };

    delete _pScrollBar;
}