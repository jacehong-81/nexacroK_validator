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

if (nexacro.SplitterControl)
{
    var _pSplitter = nexacro.SplitterControl.prototype;

    _pSplitter.updatePreviewPosition = function ()
    {
        const form = this._p_parent;

        let ghost_offset_left = 0;
        let ghost_offset_top = 0;

        if (this._p_direction == "vertical")
        {
            this.setOffsetWidth(nexacro.FrameSetBase.DEFAULT_SPLITTER_SIZE);
            this.setOffsetHeight(200);

            ghost_offset_left = 20;
        }
        else if (this._p_direction == "horizontal")
        {
            this.setOffsetWidth(200);
            this.setOffsetHeight(nexacro.FrameSetBase.DEFAULT_SPLITTER_SIZE);

            ghost_offset_top = 20;
        }

        let offset_left = (form._adjust_width / 2) - (this._adjust_width / 2);
        let offset_top = (form._adjust_height / 2) - (this._adjust_height / 2);

        this.move(offset_left, offset_top);
        this.set_movetype("ghost");
        this.move(ghost_offset_left, ghost_offset_top);
    };

    delete _pSplitter;
}