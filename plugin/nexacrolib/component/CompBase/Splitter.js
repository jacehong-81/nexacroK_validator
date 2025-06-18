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

if (!nexacro.SplitterControl)
{
    //===============================================================
    // nexacro._SplitterGhostControl : Component
    //===============================================================
    nexacro._SplitterGhostControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    const _pSplitterGhostControl = nexacro._createPrototype(nexacro.Component, nexacro._SplitterGhostControl);
    nexacro._SplitterGhostControl.prototype = _pSplitterGhostControl;

    _pSplitterGhostControl._type_name = "StaticControl";

    /* internal variable */
    _pSplitterGhostControl._is_subcontrol = true;
    _pSplitterGhostControl._is_focus_accept = false;
    _pSplitterGhostControl._is_nc_control = true;
    _pSplitterGhostControl._is_simple_control = true;

    // ==============================================================================
    // nexacro.Splitter  : Component
    // ==============================================================================
    nexacro.SplitterControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._ghostcontrol = null;
    };

    const _pSplitterControl = nexacro._createPrototype(nexacro.Component, nexacro.SplitterControl);
    nexacro.SplitterControl.prototype = _pSplitterControl;

    _pSplitterControl._type_name = "SplitterControl";

    /* properties */
    _pSplitterControl._p_direction = "vertical";
    _pSplitterControl._p_movetype = "self";
    _pSplitterControl._p_zindex = 0;
    _pSplitterControl._p_gripmargin = 0;

    /* internal variable */
    _pSplitterControl._is_scrollable = false;
    _pSplitterControl._is_nc_control = true;
    _pSplitterControl._is_focus_accept = false;
    _pSplitterControl._is_subcontrol = true;
    _pSplitterControl._is_track = true;
    _pSplitterControl._is_simple_control = true;
    _pSplitterControl._ownerframe_cursor = "";
    _pSplitterControl._gripper = null;

    //==============================================================================
    // nexacro.Splitter : Style Part
    //==============================================================================
    _pSplitterControl.on_get_css_assumedtypename = function ()
    {
        if (this._p_direction == "vertical")
            return "VSplitterControl";
        else if (this._p_direction == "horizontal")
            return "HSplitterControl";

        return this._type_name;
    };

    //===============================================================
    // nexacro.Splitter : Create & Destroy & Update
    //===============================================================
    _pSplitterControl.on_create_contents = function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            this._createGripper(control_elem);
        }
    };

    _pSplitterControl.on_create_contents_command = function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            this._createGripper(control_elem);

            const gripper = this._gripper;
            if (gripper)
            {
                return gripper.createCommand();
            }
        }
        return "";
    };

    _pSplitterControl.on_attach_contents_handle = function (win)
    {
        if (this._gripper)
        {
            this._gripper.attachHandle(win);
        }
    };

    _pSplitterControl.on_destroy_contents = function (callremovechild)
    {
        if (this._movetrack_animationframe)
        {
            this._movetrack_animationframe.stop();
            this._movetrack_animationframe.destroy();
        }
        this._cancelEvent();
        this._destroyGripper();
        this._destroyGhostControl();
    };

    _pSplitterControl.on_created_contents = function (win)
    {
        const gripper = this._gripper;
        if (gripper)
        {
            gripper.create(win);
        }

        const control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementOverflow("visible"); // Set overflow to visible for handling gripper and ghostcontrol rendering outside the splittercontrol
        }
        this.on_apply_direction();
        this.on_apply_zindex();
        this.on_apply_movetype();
        this.on_apply_gripmargin();
    };

    _pSplitterControl.on_change_containerRect = function (width, height)
    {
        const gripper = this._gripper;
        if (gripper)
        {
            let gripperX = 0;
            let gripperY = 0;
            let gripperWidth = width;
            let gripperHeight = height;

            const gripmargin = this._p_gripmargin;

            if (this._p_direction === "vertical")
            {
                gripperX -= gripmargin;
                gripperWidth += (gripmargin * 2);
            }
            else
            {
                gripperY -= gripmargin;
                gripperHeight += (gripmargin * 2);
            }
            gripper.setElementPosition(gripperX, gripperY);
            gripper.setElementSize(gripperWidth, gripperHeight);
        }
    };

    _pSplitterControl.on_changeUserStatus = function (changestatus, value, applyuserstatus/*, currentstatus, currentuserstatus*/)
    {
        if (value)
        {
            return changestatus;
        }
        return applyuserstatus;
    };

    _pSplitterControl.on_getIDCSSSelector = function ()
    {
        return "splitter";
    };

    //===============================================================
    // nexacro.Splitter : Override
    //===============================================================
    _pSplitterControl._cancelEvent = function ()
    {
        const trackinfo = this._trackinfo;
        if (trackinfo)
        {
            this._endTrack(trackinfo.x, trackinfo.y);
        }
    };

    //===============================================================
    // nexacro.Splitter : Properties
    //===============================================================
    _pSplitterControl.set_direction = function (v)
    {
        const direction_enum = ["horizontal", "vertical"];
        if (direction_enum.indexOf(v) == -1)
            return;

        if (this._p_direction != v)
        {
            this._p_direction = v;
            this.on_apply_direction();
        }
    };

    _pSplitterControl.on_apply_direction = function ()
    {
        if (this._p_direction === "vertical")
            this.set_cursor("col-resize");
        else if (this._p_direction === "horizontal")
            this.set_cursor("row-resize");
    };

    _pSplitterControl.set_movetype = function (v)
    {
        const movetype_enum = ["self", "ghost"];
        if (movetype_enum.indexOf(v) == -1)
            return;

        if (this._p_movetype != v)
        {
            this._p_movetype = v;
            this.on_apply_movetype();
        }
    };

    _pSplitterControl.on_apply_movetype = function ()
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return;

        if (this._p_movetype === "self")
            this._destroyGhostControl();
        else if (this._p_movetype === "ghost")
            this._createGhostControl();
    };

    _pSplitterControl.set_zindex = function (v)
    {
        if (this._p_zindex != v)
        {
            this._p_zindex = v;
            this.on_apply_zindex();
        }
    };

    _pSplitterControl.on_apply_zindex = function ()
    {
        if (this._control_element)
        {
            this._control_element.setElementZIndex(this._p_zindex);
        }
    };

    _pSplitterControl.set_gripmargin = function (v)
    {
        const gripmargin = nexacro._toInt(v);
        if (gripmargin < 0)
            return;

        if (this._p_gripmargin != gripmargin)
        {
            this._p_gripmargin = gripmargin;
            this.on_apply_gripmargin();
        }
    };

    _pSplitterControl.on_apply_gripmargin = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            this.on_change_containerRect(this._getClientWidth(), this._getClientHeight());
        }
    };

    _pSplitterControl._properties = [{ name: "direction" }, { name: "movetype" }, { name: "zindex" }];
    nexacro._defineProperties(_pSplitterControl, _pSplitterControl._properties);

    //===============================================================
    // nexacro.Splitter : Method
    //===============================================================
    _pSplitterControl.move = function (left, top, width, height, right, bottom)
    {
        if (this._ghostcontrol)
        {
            this._ghostcontrol.set_visible(true);
            this._ghostcontrol.move(left - this._p_left, top - this._p_top, width, height);

            return;
        }
        // self
        nexacro.Component.prototype.move.call(this, left, top, width, height, right, bottom);
    };

    //===============================================================
    // nexacro.Splitter : Event Handlers
    //===============================================================
    _pSplitterControl._on_starttrack = function ()
    {
        if (!this._is_alive)
            return false;

        const ownerframe = this._getOwnerFrame();
        if (ownerframe && ownerframe._is_frameset)
        {
            if (ownerframe._on_splitter_starttrack(this))
            {
                this._trackinfo = {};
                this._changeUserStatus("trackmove", true);
                this._ownerframe_cursor = ownerframe._p_cursor;

                return true;
            }
        }
        return false;
    };

    _pSplitterControl._on_endtrack = function (x, y)
    {
        if (!this._is_alive)
            return;

        this._endTrack(x, y);
    };

    _pSplitterControl._on_movetrack = function (x, y)
    {
        if (!this._is_alive)
            return;

        if (this._trackinfo)
        {
            this._trackinfo.x = x;
            this._trackinfo.y = y;
        }

        const ownerframe = this._getOwnerFrame();
        if (ownerframe && ownerframe._is_frameset)
        {
            if (this._p_direction === "vertical")
            {
                y = 0;
                ownerframe.set_cursor("col-resize");
            }
            else
            {
                x = 0;
                ownerframe.set_cursor("row-resize");
            }

            if (nexacro._SupportAnimationFrame)
            {
                const callbackfunc = () => { ownerframe._on_splitter_movetrack(this, x, y); };
                if (!this._movetrack_animationframe)
                {
                    const pThis = this;
                    this._movetrack_animationframe = new nexacro.AnimationFrame(pThis, callbackfunc);
                }
                else
                    this._movetrack_animationframe._setCallback(callbackfunc);
                this._movetrack_animationframe.stop();
                this._movetrack_animationframe.start();
            }
            else
                ownerframe._on_splitter_movetrack(this, x, y);
        }
    };

    //===============================================================
    // nexacro.Splitter : Logical Part
    //===============================================================
    _pSplitterControl._createGhostControl = function ()
    {
        if (!this._ghostcontrol)
        {
            const ghostcontrol = this._ghostcontrol = new nexacro._SplitterGhostControl("ghost", 0, 0, this._p_width, this._p_height, null, null, null, null, null, null, this);
            if (ghostcontrol)
            {
                ghostcontrol.set_visible(false);
                ghostcontrol.createComponent();
            }
        }
    };

    _pSplitterControl._destroyGhostControl = function ()
    {
        if (this._ghostcontrol)
        {
            this._ghostcontrol.destroy();
            this._ghostcontrol = null;
        }
    };

    _pSplitterControl._createGripper = function (parent)
    {
        if (!this._gripper)
        {
            const gripper = this._gripper = new nexacro.Element(parent);
            if (gripper)
            {
                gripper.setElementSize(this._getClientWidth(), this._getClientHeight());
            }
        }
    };

    _pSplitterControl._destroyGripper = function ()
    {
        if (this._gripper)
        {
            this._gripper.destroy();
            this._gripper = null;
        }
    };

    _pSplitterControl._endTrack = function (x, y)
    {
        const ownerframe = this._getOwnerFrame();
        if (ownerframe && ownerframe._is_frameset)
        {
            this._trackinfo = null;
            this._changeUserStatus("trackmove", false);
            ownerframe.set_cursor(this._ownerframe_cursor);

            if (this._p_direction === "vertical")
                y = 0;
            else
                x = 0;

            if (this._movetrack_animationframe)
                this._movetrack_animationframe.stop();

            ownerframe._on_splitter_endtrack(this, x, y);
        }
    };
}


