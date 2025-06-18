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

if (!nexacro.ResizerControl)
{
    //===============================================================
    // nexacro._ResizerGhostControl : Component
    //===============================================================
    nexacro._ResizerGhostControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    const _pResizerGhostControl = nexacro._createPrototype(nexacro.Component, nexacro._ResizerGhostControl);
    nexacro._ResizerGhostControl.prototype = _pResizerGhostControl;

    _pResizerGhostControl._type_name = "ResizerGhostControl";

    /* internal variable */
    _pResizerGhostControl._is_subcontrol = true;
    _pResizerGhostControl._is_focus_accept = false;
    _pResizerGhostControl._is_nc_control = true;
    _pResizerGhostControl._is_simple_control = true;

    //===============================================================
    // nexacro._ResizerGripperControl : Component
    //===============================================================
    nexacro._ResizerGripperControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    const _pResizerGripperControl = nexacro._createPrototype(nexacro.Component, nexacro._ResizerGripperControl);
    nexacro._ResizerGripperControl.prototype = _pResizerGripperControl;

    _pResizerGripperControl._type_name = "StaticControl";

    /* properties */
    _pResizerGripperControl._p_direction = "both"; // both, horizontal, vertical

    /* internal variable */
    _pResizerGripperControl._is_subcontrol = true;
    _pResizerGripperControl._is_focus_accept = false;
    _pResizerGripperControl._is_nc_control = true;
    _pResizerGripperControl._is_track = true;
    _pResizerGripperControl._no_slide_scroll = true;
    _pResizerGripperControl._is_simple_control = true;

    //===============================================================
    // nexacro._ResizerGripperControl : Properties
    //===============================================================
    _pResizerGripperControl.set_direction = function (v)
    {
        const direction_enum = ["both", "horizontal", "vertical"];
        if (direction_enum.indexOf(v) == -1)
            return;

        if (this._p_direction != v)
        {
            this._p_direction = v;
            this.on_apply_direction();
        }
    };

    _pResizerGripperControl.on_apply_direction = function ()
    {
        if (this._p_direction === "vertical")
            this.set_cursor("ns-resize");
        else if (this._p_direction === "horizontal")
            this.set_cursor("ew-resize");
        else
            this.set_cursor("nwse-resize");
    };

    _pResizerGripperControl._properties = [{ name: "direction" }];
    nexacro._defineProperties(_pResizerGripperControl, _pResizerGripperControl._properties);

    //===============================================================
    // nexacro._ResizerGripperControl : Logical Part
    //===============================================================
    _pResizerGripperControl._endTrack = function (target, x, y)
    {
        const parent = this._p_parent;
        if (parent)
            parent._endTrack(target, x, y);
    };

    _pResizerGripperControl._setTrackInfo = function (target, x, y)
    {
        const parent = this._p_parent;
        if (parent)
            parent._setTrackInfo(target, x, y);
    };

    _pResizerGripperControl._getTrackInfo = function ()
    {
        const parent = this._p_parent;
        if (parent)
        {
            return parent._getTrackInfo();
        }
        return undefined;
    };

    _pResizerGripperControl._clearTrackInfo = function ()
    {
        const parent = this._p_parent;
        if (parent)
            parent._clearTrackInfo();
    };

    // ==============================================================================
    // nexacro.Resizer  : Component
    // ==============================================================================
    nexacro.ResizerControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._grippermap = new Map();
        this._ghostcontrol = null;
    };

    const _pResizerControl = nexacro._createPrototype(nexacro.Component, nexacro.ResizerControl);
    nexacro.ResizerControl.prototype = _pResizerControl;

    _pResizerControl._type_name = "ResizerControl";

    /* properties */
    _pResizerControl._p_type = "self"; // self, ghost
    _pResizerControl._p_direction = "both"; // both, horizontal, vertical

    /* internal variable */
    _pResizerControl._is_scrollable = false;
    _pResizerControl._is_nc_control = true;
    _pResizerControl._is_focus_accept = false;
    _pResizerControl._is_subcontrol = true;
    _pResizerControl._is_track = true;
    _pResizerControl._no_slide_scroll = true;
    _pResizerControl._is_simple_control = true;

    /* default value */
    _pResizerControl._gripper_default_size = 3;

    //===============================================================
    // nexacro.Resizer : Create & Destroy & Update
    //===============================================================
    _pResizerControl.on_destroy_contents = function (callremovechild)
    {
        nexacro.Component.prototype.on_destroy_contents.call(this, callremovechild);

        if (this._movetrack_animationframe)
        {
            this._movetrack_animationframe.stop();
            this._movetrack_animationframe.destroy();
        }
        this._cancelEvent();
        this._destroyGhostControl();
        this._destroyGripper();
    };

    _pResizerControl.on_created_contents = function (win)
    {
        nexacro.Component.prototype.on_created_contents.call(this, win);

        const control_elem = this.getElement();
        if (control_elem)
            control_elem.setElementOverflow("visible"); // Set overflow to visible for handling gripper rendering outside the resizer control

        this.on_apply_direction();
    };

    _pResizerControl.on_getIDCSSSelector = function ()
    {
        return "resizer";
    };

    _pResizerControl.on_update_position = function (resize_flag, move_flag, update)
    {
        nexacro.Component.prototype.on_update_position.call(this, resize_flag, move_flag, update);

        if (this._is_created)
        {
            this._repositionGripper();
        }
    };

    //===============================================================
    // nexacro.Resizer : Properties
    //===============================================================
    _pResizerControl.set_type = function (v)
    {
        const type_enum = ["self", "ghost"];
        if (type_enum.indexOf(v) == -1)
            return;

        if (this._p_type != v)
        {
            this._p_type = v;
            this.on_apply_type();
        }
    };

    _pResizerControl.on_apply_type = function ()
    {

    };

    _pResizerControl.set_direction = function (v)
    {
        const direction_enum = ["both", "horizontal", "vertical"];
        if (direction_enum.indexOf(v) == -1)
            return;

        if (this._p_direction != v)
        {
            this._p_direction = v;
            this.on_apply_direction();
        }
    };

    _pResizerControl.on_apply_direction = function ()
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return;

        if (this._p_direction === "vertical")
            this.set_cursor("ns-resize");
        else if (this._p_direction === "horizontal")
            this.set_cursor("ew-resize");
        else
            this.set_cursor("nwse-resize");

        this._destroyGripper();
        this._createGripper();
    };

    _pResizerControl.on_apply_prop_enable = function (v)
    {
        var enable = v;
        if (v == undefined)
            enable = this._p_enable;

        this._setEnableGripper(v);
    };

    _pResizerControl._properties = [{ name: "type" }, { name: "direction" }];
    nexacro._defineProperties(_pResizerControl, _pResizerControl._properties);

    //===============================================================
    // nexacro.Resizer : Override
    //===============================================================
    _pResizerControl._cancelEvent = function ()
    {
        const trackinfo = this._getTrackInfo();
        if (trackinfo)
        {
            trackinfo.target._endTrack(trackinfo.target, trackinfo.x, trackinfo.y);
        }
    };

    //===============================================================
    // nexacro.Resizer : Event Handlers
    //===============================================================
    _pResizerControl._on_starttrack = function ()
    {
        if (!this._is_alive)
            return false;

        const parent = this._p_parent;
        if (parent)
        {
            const rootcomp = this._getRootComponent(parent);
            if (rootcomp && rootcomp._on_resizer_starttrack())
            {
                this._setTrackInfo(this);
                this._changeUserStatus("trackmove", true);
                return true;
            }
        }
        return false;
    };

    _pResizerControl._on_endtrack = function (x, y)
    {
        if (!this._is_alive)
            return;

        this._endTrack(this, x, y);
    };

    _pResizerControl._on_movetrack = function (x, y)
    {
        if (!this._is_alive)
            return;

        const parent = this._p_parent;
        if (parent)
        {
            const rootcomp = this._getRootComponent(parent);
            if (rootcomp)
            {
                this._setTrackInfo(this, x, y);

                const direction = this.direction;
                if (direction === "vertical")
                    x = 0;
                else if (direction === "horizontal")
                    y = 0;

                const cursor = this._cursor;

                if (nexacro._SupportAnimationFrame)
                {
                    const callbackfunc = () => { rootcomp._on_resizer_movetrack(x, y, cursor); };
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
                    rootcomp._on_resizer_movetrack(x, y, cursor);
            }
        }
    };

    //===============================================================
    // nexacro.Resizer : Logical Part
    //===============================================================
    _pResizerControl._createGhostControl = function (target)
    {
        if (this._p_type === "self")
            return;

        if (!this._ghostcontrol)
        {
            if (target && target._p_parent)
            {
                const pos = this._calcPositionGhostControl(target);
                const ghostcontrol = this._ghostcontrol = new nexacro._ResizerGhostControl("ghost", pos[0], pos[1], target._adjust_width, target._adjust_height, null, null, target.minwidth, target.maxwidth, target.minheight, target.maxheight, target._p_parent);
                if (ghostcontrol)
                {
                    ghostcontrol.set_visible(true);
                    ghostcontrol.createComponent();
                }
            }
        }
    };

    _pResizerControl._calcPositionGhostControl = function (target)
    {
        let left = 0, top = 0;

        const targetElem = target.getElement();
        if (!targetElem)
            return [0, 0];

        const parent = target._p_parent;
        if (!parent)
            return [0, 0];

        const parentElem = parent.getElement();
        if (parentElem)
        {
            const coordinates = nexacro._getElementXYInWindow(targetElem.handle);
            const parent_coordinates = nexacro._getElementXYInWindow(parentElem.handle);

            left = coordinates[0] - parent_coordinates[0];
            top = coordinates[1] - parent_coordinates[1];
        }
        return [left, top];
    }

    _pResizerControl._destroyGhostControl = function ()
    {
        if (this._ghostcontrol)
        {
            this._ghostcontrol.destroy();
            this._ghostcontrol = null;
        }
    };

    _pResizerControl._calcGripperPosition = function (type)
    {
        let left = 0, top = 0, width = 0, height = 0;

        const parent = this._p_parent;
        if (!parent)
            return;

        const parent_width = parent._adjust_width;
        const parent_height = parent._adjust_height;

        const border = parent._getCurrentStyleBorder();
        const borderWidth = (border ? border._getBorderWidth() : 0);
        const borderHeight = (border ? border._getBorderHeight() : 0);
        const gripper_size = this._gripper_default_size;

        switch (type) 
        {
            case 'right':
                top = borderHeight;
                left = parent_width - gripper_size;
                width = gripper_size;
                height = parent_height - borderHeight - this._adjust_height;
                break;
            case 'bottom':
                left = borderWidth;
                top = parent_height - gripper_size;
                width = parent_width - borderWidth - this._adjust_width;
                height = gripper_size;
                break;
        }

        const adjust_offset_left = parent_width - this._adjust_width;
        const adjust_offset_top = parent_height - this._adjust_height;

        return { "left": left - adjust_offset_left, "top": top - adjust_offset_top, "width": width, "height": height };
    };

    _pResizerControl._createGripper = function ()
    {
        const grippermap = this._grippermap;
        if (grippermap)
        {
            const type = this._p_direction;
            switch (type) 
            {
                case 'both':
                    grippermap.set("right", new nexacro._ResizerGripperControl("right", 0, 0, 0, 0, null, null, null, null, null, null, this));
                    grippermap.set("bottom", new nexacro._ResizerGripperControl("bottom", 0, 0, 0, 0, null, null, null, null, null, null, this));
                    break;
                case 'horizontal':
                    grippermap.set("right", new nexacro._ResizerGripperControl("right", 0, 0, 0, 0, null, null, null, null, null, null, this));
                    break;
                case 'vertical':
                    grippermap.set("bottom", new nexacro._ResizerGripperControl("bottom", 0, 0, 0, 0, null, null, null, null, null, null, this));
                    break;
            }

            grippermap.forEach((gripper, key) =>
            {
                switch (key) 
                {
                    case 'right':
                        gripper.set_direction("horizontal");
                        break;
                    case 'bottom':
                        gripper.set_direction("vertical");
                        break;
                }
                gripper._on_starttrack = this._on_starttrack;
                gripper._on_movetrack = this._on_movetrack;
                gripper._on_endtrack = this._on_endtrack;
                gripper.createComponent();
            });
        }
        this._repositionGripper();
    };

    _pResizerControl._destroyGripper = function ()
    {
        const grippermap = this._grippermap;
        if (grippermap)
        {
            grippermap.forEach((gripper, key) =>
            {
                gripper.destroy();
                gripper = null;
            });
            grippermap.clear();
        }
    };

    _pResizerControl._repositionGripper = function ()
    {
        const grippermap = this._grippermap;
        if (grippermap)
        {
            grippermap.forEach((gripper, key) =>
            {
                let pos = this._calcGripperPosition(key);

                gripper.move(pos.left, pos.top, pos.width, pos.height);
            });
        }
    };

    _pResizerControl._setEnableGripper = function (v)
    {
        const grippermap = this._grippermap;
        if (grippermap)
        {
            grippermap.forEach((gripper, key) =>
            {
                gripper._setEnable(v);
            });
        }
    };

    _pResizerControl._resize = function (target, width, height, endtrack)
    {
        const border = target._getCurrentStyleBorder();
        const borderWidth = (border ? border._getBorderWidth() : 0);
        const borderHeight = (border ? border._getBorderHeight() : 0);
        const min_resize_width = this._adjust_width + borderWidth;
        const min_resize_height = this._adjust_height + borderHeight;

        width = width < min_resize_width ? min_resize_width : width;
        height = height < min_resize_height ? min_resize_height : height;

        if (!endtrack && this._ghostcontrol)
            this._ghostcontrol.resize(width, height);
        else
            target.resize(width, height);
    }

    _pResizerControl._applyCursor = function (cursor)
    {
        const parent = this._p_parent;
        if (parent)
            parent.on_apply_cursor(cursor);

        const grippermap = this._grippermap;
        if (grippermap)
        {
            grippermap.forEach((gripper, key) =>
            {
                gripper.on_apply_cursor(cursor);
            });
        }

        const ghost = this._ghostcontrol;
        if (ghost)
            ghost.on_apply_cursor(cursor);
    };

    _pResizerControl._restoreCursor = function ()
    {
        const parent = this._p_parent;
        if (parent)
            parent.on_apply_cursor(parent._cursor);

        const grippermap = this._grippermap;
        if (grippermap)
        {
            grippermap.forEach((gripper, key) =>
            {
                gripper.on_apply_cursor(gripper._cursor);
            });
        }

        const ghost = this._ghostcontrol;
        if (ghost)
            ghost.on_apply_cursor(ghost._cursor);
    };

    _pResizerControl._endTrack = function (target, x, y)
    {
        const parent = target._p_parent;
        if (parent)
        {
            const rootcomp = target._getRootComponent(parent);
            if (rootcomp)
            {
                target._clearTrackInfo();
                target._changeUserStatus("trackmove", false);

                const direction = target.direction;
                if (direction === "vertical")
                    x = 0;
                else if (direction === "horizontal")
                    y = 0;

                if (target._movetrack_animationframe)
                    target._movetrack_animationframe.stop();

                rootcomp._on_resizer_endtrack(x, y);
            }
        }
    };

    _pResizerControl._setTrackInfo = function (target, x, y)
    {
        const trackinfo = this._trackinfo;
        if (trackinfo)
        {
            trackinfo.target = target;
            trackinfo.x = x;
            trackinfo.y = y;
        }
        else
        {
            this._trackinfo = { target: target, x: x, y: y };
        }
    };

    _pResizerControl._getTrackInfo = function ()
    {
        return this._trackinfo ?? undefined;
    };

    _pResizerControl._clearTrackInfo = function ()
    {
        this._trackinfo = null;
    };
}


