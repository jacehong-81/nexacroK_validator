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

if (!nexacro.Component)
{
    "use strict";

    var _process = true;

    //==============================================================================
    // nexacro.Component
    //==============================================================================
    nexacro.Component = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro._EventSinkObject.call(this, id, parent);
        this._env = nexacro.getEnvironment();

        if (parent)
        {
            this._refform = this._findForm(parent);
        }

        var horz = 0;
        var vert = 0;

        if (left != null) horz++;
        if (width != null) horz++;
        if (right != null) horz++;
        if (top != null) vert++;
        if (height != null) vert++;
        if (bottom != null) vert++;

        if (horz >= 2 && vert >= 2)
        {
            this._p_left = left;
            this._p_top = top;
            this._p_width = width;
            // TODO2 : %pixel 처리 필요
            //this._p_width = this._setWidth(width);
            this._p_height = height;
            if (!(left != undefined && width != undefined && right != undefined))
                this._p_right = right;
            if (!(top != undefined && height != undefined && bottom != undefined))
                this._p_bottom = bottom;

            this._setMaxwidth(maxwidth);
            this._setMinwidth(minwidth);
            this._setMaxheight(maxheight);
            this._setMinheight(minheight);

            this._parseArrangeInfo(left, top, right, bottom, width, height);
            this._calcBasisSize();
            this._calcArrangePosition();
        }

        this._makeStatusMap();
    };

    var _pComponent = nexacro._createPrototype(nexacro._EventSinkObject, nexacro.Component);
    nexacro.Component.prototype = _pComponent;
    _pComponent._type_name = "Component";

    /* inner control */
    _pComponent._control_element = null;

    /* control */
    _pComponent._p_hscrollbar = null;
    _pComponent._p_vscrollbar = null;
    _pComponent._p_resizer = null;

    /* default properties */
    _pComponent._p_initvalueid = "";
    _pComponent._p_hittesttype = "";
    _pComponent._p_name = "";
    _pComponent._p_text = "";

    _pComponent._p_expr = "";
    _pComponent._p_cssclass = "";
    _pComponent._p_visible = true;
    _pComponent._p_enable = true;
    _pComponent._p_taborder = 0;
    _pComponent._p_tabstop = true;

    _pComponent._p_transparenthittest = false;
    _pComponent._p_enableredraw = true;
    _pComponent._p_enableevent = true;
    _pComponent._p_tooltiptype = "default";
    _pComponent._p_tooltiptext = undefined;
    _pComponent._p_fittocontents = "none";

    _pComponent._p_hotkey = null;
    _pComponent._p_rtl = undefined;
    _pComponent._p_positionstep = 0;

    _pComponent._p_resizertype = "none";
    _pComponent._p_resizerdirection = "both";

    _pComponent._p_scrollbartype = undefined;
    _pComponent._p_scrolltype = "both";
    _pComponent._p_scrollbarsize = undefined;
    _pComponent._p_scrollindicatorsize = undefined;
    _pComponent._p_scrollbarbarminsize = undefined;
    _pComponent._p_scrollbarbaroutsize = undefined;
    _pComponent._p_scrollbardecbuttonsize = undefined;
    _pComponent._p_scrollbarincbuttonsize = undefined;
    _pComponent._p_scrollbartrackbarsize = undefined;

    _pComponent._p_left = null;
    _pComponent._p_top = null;
    _pComponent._p_right = null;
    _pComponent._p_bottom = null;
    _pComponent._p_width = null;
    _pComponent._p_height = null;

    _pComponent._p_minwidth = null;
    _pComponent._p_maxwidth = null;
    _pComponent._p_minheight = null;
    _pComponent._p_maxheight = null;

    _pComponent._p_color = "";
    _pComponent._p_font = "";
    _pComponent._p_wordSpacing = "";
    _pComponent._p_letterSpacing = "";
    _pComponent._p_textDecoration = "";
    _pComponent._p_wordWrap = "";

    _pComponent._p_borderRadius = "";
    _pComponent._p_border = "";
    _pComponent._p_background = "";
    _pComponent._p_edge = "";

    _pComponent._p_cursor = "";
    _pComponent._p_opacity = "";
    _pComponent._p_boxShadow = "";

    _pComponent._p_margin = "";
    _pComponent._p_padding = "";
    _pComponent._p_textAlign = "";
    _pComponent._p_verticalAlign = "";

    _pComponent._p_accessibilityrole = "";
    _pComponent._p_accessibilityenable = true;
    _pComponent._p_accessibilitylabel = "";
    _pComponent._p_accessibilitydescription = "";
    _pComponent._p_accessibilityaction = "";
    _pComponent._p_accessibilitydesclevel = "all";
    _pComponent._p_itemaccessibilityenable = true;


    /* Fluid Layout Component Init*/
    _pComponent._p_flexgrow = undefined;
    _pComponent._p_flexshrink = undefined;
    _pComponent._p_layoutorder = 0;
    _pComponent._p_tablecellarea = "";

    /* internal variable */
    nexacro._is_enable_setting = false; //set_enable, _setEnable 진입 구분

    _pComponent._tablecellarea = "";
    _pComponent._left = null;
    _pComponent._top = null;
    _pComponent._right = null;
    _pComponent._bottom = null;
    _pComponent._width = null;
    _pComponent._height = null;

    _pComponent._minwidth = null;
    _pComponent._maxwidth = null;
    _pComponent._minheight = null;
    _pComponent._maxheight = null;

    _pComponent._adjust_left = -1;
    _pComponent._adjust_top = -1;
    _pComponent._adjust_width = -1;
    _pComponent._adjust_height = -1;

    _pComponent._bind_event = null;
    _pComponent._statusmap = null;
    _pComponent._userstatusmap = null;

    _pComponent._unique_id = "";
    _pComponent._displaytext = "";

    _pComponent._status = "";
    _pComponent._userstatus = "";
    _pComponent._oldstatus = "";
    _pComponent._olduserstatus = "";

    _pComponent._real_enable = null;
    _pComponent._real_visible = false;
    _pComponent._last_focused = null;
    _pComponent._hotkey = null;
    _pComponent._track_capture = true;
    _pComponent._focus_direction = -1;
    _pComponent._rtl = undefined;
    _pComponent._is_enable_changing = false; // 변경 후 apply_pseudo에서 다시 타지 않게 함
    _pComponent._block_inner_focus = false;

    _pComponent._env = null;
    // for scrollbar
    _pComponent._vscrollbartype = undefined;
    _pComponent._hscrollbartype = undefined;
    _pComponent._hscroll_pos = 0;
    _pComponent._vscroll_pos = 0;
    _pComponent._hscrollbar_id = "hscrollbar";
    _pComponent._vscrollbar_id = "vscrollbar";
    _pComponent._hscrollindicator_id = "hscrollindicator";
    _pComponent._vscrollindicator_id = "vscrollindicator";

    _pComponent._scroll_top = 0;
    _pComponent._scroll_left = 0;
    _pComponent._scroll_height = 0;
    _pComponent._scroll_default_value = 30;

    //for resizer
    _pComponent._resizer_id = "resizer";

    _pComponent._color = null;
    _pComponent._font = null;
    _pComponent._wordspacing = null;
    _pComponent._letterspacing = null;
    _pComponent._textdecoration = null;
    _pComponent._borderradius = null;
    _pComponent._border = null;
    _pComponent._background = null;
    _pComponent._edge = null;
    _pComponent._cursor = null;
    _pComponent._opacity = null;
    _pComponent._boxshadow = null;
    _pComponent._padding = null;

    _pComponent._is_view = false;
    _pComponent._is_group = false; //panelitem
    _pComponent._group_panel = null; //panelitem

    _pComponent._default_scrollbarsize = 17;
    _pComponent._default_scrollindicatorsize = 6;

    if (nexacro._isTouchInteraction && nexacro._SupportTouch)
    {
        _pComponent._default_scrollbartype = "autoindicator";
    }
    else
    {
        _pComponent._default_scrollbartype = "auto";
    }

    /* status */
    _pComponent._is_loading = false;
    _pComponent._is_create_commandstr = false;
    _pComponent._is_created = false;
    _pComponent._is_created_contents = false;
    _pComponent._is_initcssselector = false;
    _pComponent._is_alive = true;

    _pComponent._is_component = true;
    _pComponent._is_subcontrol = false;
    _pComponent._is_form = false;
    _pComponent._is_frame = false;
    _pComponent._is_window = false;
    _pComponent._is_nc_control = false;
    _pComponent._is_simple_control = false;
    _pComponent._is_scrollable = false;
    _pComponent._is_popup_control = false;
    _pComponent._is_fluid_control = true;
    _pComponent._is_focus_accept = true;
    _pComponent._is_eventinfo_control = true;
    _pComponent._is_locale_control = false;
    _pComponent._is_editable_control = false;
    _pComponent._is_track = false;

    _pComponent._is_container = false;      // this has a container. ex) Div, PopupDiv, Tabpage...
    _pComponent._is_containerset = false;   // this has containers. ex) Tab
    _pComponent._is_listtype = false;       // this has itemes, ex) Radio, ListBox, FileUpload...

    _pComponent._use_pushed_status = false;
    _pComponent._use_selected_status = false;
    _pComponent._use_readonly_status = false;

    _pComponent._use_translate_move = false;
    _pComponent._use_container_move = true;
    _pComponent._use_container_multi = false;

    _pComponent._apply_client_padding = true;

    //accessibility
    _pComponent._block_read_aria_stat = true;
    _pComponent._is_compound = false;

    _pComponent._is_flexible = false;
    _pComponent._excluded_flex = false;

    _pComponent._fling_cubic_bezier = null;
    _pComponent._fling_max_distance = null;

    _pComponent._use_softkeyboard = 1;

    _pComponent._computed_prop_list = [
        "cssclass", "color", "font", "wordSpacing", "letterSpacing", "textDecoration", "wordWrap", "borderRadius",
        "border", "background", "edge", "cursor", "opacity", "boxShadow", "padding", "textAlign", "verticalAlign", "icon", "iconPosition"
    ];

    _pComponent._event_list = {
        "onclick": 1, "ondblclick": 1, "onkillfocus": 1, "onsetfocus": 1,
        "oninput": 1, "onkeydown": 1, "onkeyup": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1,
        "onmousedown": 1, "onmouseup": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmousewheel": 1,
        "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
        "onmove": 1, "onsize": 1, "oncontextmenu": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1, "ondevicebuttonup": 1,
        "oncontentloaded": 1, "onvaluechanged": 1, "onenablestatuschanged": 1
    };

    //===============================================================
    // nexacro.Component : Create & Destroy & Update
    //===============================================================
    // create component
    _pComponent.createComponent = function (bCreateOnly)
    {
        var parent_elem = null;
        var _p = this._p_parent;

        if (!this._is_window && _p)
        {
            parent_elem = _p._control_element;
            if (!parent_elem)
            {
                return false;
            }
        }

        this._initComponent();

        if (this.onCreateComponent(parent_elem))
        {
            if (!bCreateOnly && _p && _p._control_element && _p._control_element.handle)
            {
                this.on_created(this._getWindow());
            }

            if (_p && _p._control_element)
                this.onCreateComponentAfter(_p._control_element);

            return true;
        }

        return false;
    };

    _pComponent.onCreateComponent = function (parent_elem)
    {
        if (this._createControlElement(parent_elem))
        {
            this._initControlElement();

            this._applyProperties();
            this._applyAccessibility();

            this._initContents();

            return true;
        }
    };

    _pComponent.onCreateComponentAfter = function (parent_elem)
    {

    };

    // init component
    _pComponent._initComponent = function ()
    {
        this._initUniqueID();
    };

    _pComponent._initUniqueID = function ()
    {
        if (this._unique_id.length <= 0)
        {
            var _p = this._p_parent;
            this._unique_id = _p && _p._unique_id ? (nexacro._filterIDRootNodeClassName(_p._unique_id) + "." + this.id) : (this.id ? this.id : "");
        }
    };

    // create element
    _pComponent._createControlElement = function (parent_elem)
    {
        var control_elem = this.getElement();
        if (!control_elem)
        {
            control_elem = this.on_create_control_element(parent_elem);
            control_elem._is_nc_element = this._is_nc_control;
        }

        return control_elem;
    };

    _pComponent.on_create_control_element = function (parent_elem)
    {
        // create
        var control_elem = null;

        if (this._is_tablecell)
        {
            control_elem = this.on_create_tablecell_control_element(parent_elem);
        }
        else if (this._is_frame)
        {
            control_elem = this.on_create_frame_control_element(parent_elem);
        }
        else if (this._is_scrollable || this._is_expandable)
        {
            control_elem = this.on_create_scrollable_control_element(parent_elem);
        }
        else if (this._is_popup_control)
        {
            control_elem = this.on_create_popup_control_element(parent_elem);
        }
        else
        {
            control_elem = this.on_create_normal_control_element(parent_elem);
        }

        return control_elem;
    };

    _pComponent.on_create_normal_control_element = function (parent_elem)
    {
        var control_elem = new nexacro.ControlElement(parent_elem);
        control_elem.setLinkedControl(this);
        this._control_element = control_elem;
        return control_elem;
    };

    _pComponent.on_create_scrollable_control_element = function (parent_elem)
    {
        var control_elem = new nexacro.ScrollableControlElement(parent_elem, this._use_container_multi);
        control_elem.setLinkedControl(this);
        this._control_element = control_elem;
        return control_elem;
    };

    _pComponent.on_create_frame_control_element = function (parent_elem)
    {
        var control_elem = new nexacro.FrameControlElement(parent_elem);
        control_elem.setLinkedControl(this);
        this._control_element = control_elem;
        return control_elem;
    };

    _pComponent.on_create_tablecell_control_element = function (parent_elem)
    {
        var control_elem = new nexacro.CellControlElement(parent_elem);
        control_elem.setLinkedControl(this);
        this._control_element = control_elem;
        return control_elem;
    };

    _pComponent.on_create_popup_control_element = function (parent_elem)
    {
        var control_elem = new nexacro.ControlElement(parent_elem);
        control_elem.setLinkedControl(this);
        this._control_element = control_elem;
        return control_elem;
    };

    _pComponent.on_create_popupscrollable_control_element = function (parent_elem)
    {
        var control_elem = new nexacro.ScrollableControlElement(parent_elem);
        control_elem.setLinkedControl(this);
        this._control_element = control_elem;
        return control_elem;
    };

    // init element
    _pComponent._initControlElement = function ()
    {
        this._initControlElementInfo();
        this._initControlElementCssInfo();
        this._initControlElementNormalProps();
        this._initControlElementStyleProps();
        this._initControlElementLayoutProps();
    };

    _pComponent._initControlElementInfo = function ()
    {
        this.getElement().initElementInfo();
    };

    _pComponent._initControlElementCssInfo = function ()
    {
        if (!this._is_initcssselector)
        {
            var ret = this._setControlElementCssSelector();

            this._makeCSSMapInfo();

            this._setControlElementCssMapInfo();

            this._is_initcssselector = ret;
        }
    };

    _pComponent._initControlElementNormalProps = function ()
    {
        this._applyElementVisible(this._p_visible);

        this.on_apply_prop_rtl();

        if (!this._is_subcontrol)
            this._registerHotkey();
    };

    _pComponent._initControlElementStyleProps = function ()
    {
        //// apply to control Element
        //form inherit
        //color
        //font
        //line-height
        //word-spacing
        //letter-spacing

        //textDecoration -- no inherit : apply to child Element : controlElement
        // white-space, word-break, word-wrap : 묶음처리 -- inherit : but apply to child Element
        //borderRadius
        //border
        //background
        //margin
        //padding -- no inherit
        //cursor
        //opacity
        //boxShadow

        //// no inherit : apply to child Element
        var control_elem = this.getElement();
        // common styles - this inheteted --> apply to ControlElement : inherit to Child
        //
        if (this._color)
            control_elem.setElementColor(this._color);
        if (this._font)
            control_elem.setElementFont(this._font);
        //if (this._p_wordWrap) // this css set
        //    control_elem.setElementWordWrap(this._p_wordWrap);
        if (this._wordspacing)
            control_elem.setElementWordSpacing(this._wordspacing);
        if (this._letterspacing)
            control_elem.setElementLetterSpacing(this._letterspacing);

        // no inherit : apply to Child Element
        //if (this._p_textDecoration)
        //	control_elem.setElementTextDecoration(this._p_textDecoration);

        if (this._borderradius)
            control_elem.setElementBorderRadius(this._borderradius);
        if (this._border)
            control_elem.setElementBorder(this._border);

        if (this._background)
            control_elem.setElementBackground(this._background);

        // no inherit : but ControlElement has falgs && apply to child Element
        if (this._padding)
            control_elem.setElementPadding(this._padding);

        if (this._cursor)
            control_elem.setElementCursor(this._cursor);
        if (this._opacity)
            control_elem.setElementOpacity(this._opacity);
        if (this._boxshadow)
            control_elem.setElementBoxShadow(this._boxshadow);

        if (this._edge)
            control_elem.setElementEdge(this._edge);

        if (!nexacro._isNull(this._p_tooltiptext))
            control_elem.setElementToolTip(this._p_tooltiptext);
    };

    _pComponent._initControlElementLayoutProps = function ()
    {
        var control_elem = this.getElement();
        if (this._is_container)
            this._calcBasisSize();
        if (this._is_fluid_control && !this._is_nc_control)
        {
            if (this._isFluidContainer())
            {
                if (this._isFluidContainerCalculation())
                {
                    control_elem.setElementPosition(this._adjust_left, this._adjust_top);
                    control_elem.setElementSize(this._adjust_width, this._adjust_height);
                }
                else
                {
                    control_elem.clearElementPosition(); //Need to Check!!!
                    control_elem.setElementLayoutContentsProps();
                    if (this._is_subcontrol)
                    {
                        this._calcArrangePosition();
                        this._adjustPosition();
                        control_elem.setElementSize(this._adjust_width, this._adjust_height);
                    }
                }
            }
            else
            {
                this._calcArrangePosition();
                this._adjustPosition();
                //this._setDefaultSize();

                control_elem.setElementPosition(this._adjust_left, this._adjust_top);
                control_elem.setElementSize(this._adjust_width, this._adjust_height);
            }
        }
        else
        {
            this._calcArrangePosition();
            this._adjustPosition();

            control_elem.setElementPosition(this._adjust_left, this._adjust_top);
            control_elem.setElementSize(this._adjust_width, this._adjust_height);
        }
    };

    // apply component props
    _pComponent._applyProperties = function ()
    {
        this.on_apply_prop_taborder();

        if (!nexacro._isNull(this._p_tooltiptext))
            this.on_apply_prop_tooltip();

        this.on_apply_positionstep();

        if (this._hittest_type)
            this.on_apply_hittesttype();

        if (this._is_locale_control)
        {
            this._setLocale(this._getForm()._locale);
        }

        this.onApplyProperties();
        this.on_apply_prop_stringresource();
    };

    _pComponent.onApplyProperties = function () { };

    _pComponent._applyAccessibility = function ()
    {
        this.on_apply_accessibility();
    };

    // init component contents
    _pComponent._initContents = function ()
    {
        this.onCreateContents();

        this._is_created_contents = true;
        this._is_loading = false;
    };

    _pComponent.onCreateContents = function ()
    {
        // 컴포넌트별 컨텐츠생성
        this.on_create_contents();
    };

    _pComponent.on_create_contents = function () { this._on_create_accessibility_contents(); };

    // created component
    _pComponent.on_created = function (window)
    {
        // interface
        var ret = this.onCreated(window);
        this.onCreatedAfter(ret);
    };

    _pComponent.onCreated = function (window)
    {
        // ComponentBase Logic
        if (this._is_loading)
            return;

        var parent_elem = null;
        if (!this._is_window)
        {
            parent_elem = this._p_parent ? this._p_parent._control_element : null;
            if (!parent_elem)
            {
                return false;
            }
        }

        window = window || this._getWindow();

        if (this._createdControlElement(window))
        {
            this._createdControlElementStatus();

            if (this._is_subcontrol && this._isFluidContainer())
            {
                if (!this._excluded_flex)
                    this._control_element._setElementLayoutPosition();

                this._update_position_fluid(false);
            }

            this._createdControlElementLayoutProps();

            this._createdContents(window);

            return true;
        }
    };

    _pComponent.onCreatedAfter = function (resultCreated) { };

    _pComponent.on_created_contents = function (win) { this._on_created_accessibility_contents(win); };

    // created element
    _pComponent._createdControlElement = function (window)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.create(window);
            return control_elem.handle;
        }
        return null;
    };

    _pComponent._createdControlElementStatus = function ()
    {
        // apply enable
        var enable = this._isEnable();

        if ((this._real_enable == null && enable == false) || (this._real_enable && this._real_enable != enable))
        {
            this._real_enable = enable;
            this._changeStatus("disabled", !enable);
            this.on_apply_prop_enable(enable);
        }
        else
        {
            this._real_enable = enable;
        }

        // apply status
        if (this._status || this._userstatus)
            this._apply_status_toelement("", this._status, "", this._userstatus);
    };

    _pComponent._createdControlElementLayoutProps = function ()
    {
        // 폼단위에서 fluid layout을 계산
    };

    _pComponent._createdContents = function (window)
    {
        if (!this._is_created)
        {
            this.on_created_contents(window);
            this._is_created = true;
            this.on_after_created();
        }
    };

    // create command
    _pComponent.createCommand = function ()
    {
        var str = "";
        if (!this._is_loading)
        {

            // showModal시 createComponent는 실패한채 created가 먼저 처리되는 문제가 있어
            // createComponent와 동일 조건으로 created를 방지함. 이 두 함수 모두 modal callback에서 다시 호출됨.

            //처음 생성시에 enable = false인 경우에만 disable 이되도록 수정
            //set_enable _is_created 된후에만 real_enable 값 설정
            var enable = this._isEnable();

            if ((this._real_enable == null && enable == false) || (this._real_enable && this._real_enable != enable))
            {
                this._real_enable = enable;
                this._changeStatus("disabled", !enable);
                this.on_apply_prop_enable(enable);
            }
            else
            {
                this._real_enable = enable;
                this._setAccessibilityStatFlag(this._status, this._userstatus);
            }

            if (this._status || this._userstatus)
                this._apply_status_toelement("", this._status, "", this._userstatus);

            var control_elem = this._control_element;
            if (control_elem)
            {
                str = control_elem.createCommandStart();
                if (str)
                {
                    str += this.on_create_contents_command();
                    str += control_elem.createCommandEnd();
                }
            }

            if (!this._is_subcontrol)
                this._registerHotkey();

            this._is_create_commandstr = true;
        }
        return str;
    };

    _pComponent.attachHandle = function (win, bContainer)
    {
        // TODL LAYOUT innerHTML 적용된후처리 가급적 createCommand에서 다 만들기
        if (!this._is_created && this._is_create_commandstr)
        {
            var control_elem = this._control_element;
            if (control_elem)
                control_elem.attachHandle(win);
            if (!bContainer)
            {
                this.on_attach_contents_handle(win);

                this._is_created = true;
                this.on_after_created();
            }
        }
    };

    _pComponent.on_create_contents_command = function ()
    {
        return "";
    };

    _pComponent.on_attach_contents_handle = function (win) { this._on_attach_accessibility_contents_handle(win); };
    _pComponent.on_after_created = function () { };

    // destroy contents
    _pComponent.destroyComponent = function (callremovechild)
    {
        if (!this._is_alive)
            return;

        this._is_alive = false;
        if (!this._is_subcontrol)
            this._unregisterHotkey();

        const env = this._env;
        if (env._p_enableaccessibility && env._a11yHistoryList)
        {
            env._remove_accessibility_history(this);
        }

        this._clearEventListeners();

        if (this._p_parent && this._p_parent.removeChild)
        {
            if (callremovechild != false)
                this._p_parent.removeChild(this.id);
        }
        else
        {
            var win = this._getWindow();
            if (win)
                win._removeFromCurrentFocusPath(this);

            if (this._unregisterPopupFrame)
            {
                if (nexacro._Browser == "Runtime" && (nexacro._SystemType.toLowerCase() == "win32" || nexacro._SystemType.toLowerCase() == "win64"))
                    this._unregisterPopupFrame(win?._parentwindowforopen, this.id);
                else
                    this._unregisterPopupFrame(win, this.id);
            }

        }
        if (this._control_element)
        {
            this._control_element.destroy();
            this._control_element = null;
        }

        if (this._p_vscrollbar)
        {
            this._p_vscrollbar.destroy();
            this._p_vscrollbar = null;
        }
        if (this._p_hscrollbar)
        {
            this._p_hscrollbar.destroy();
            this._p_hscrollbar = null;
        }
        if (this._p_resizer)
        {
            this._p_resizer.destroy();
            this._p_resizer = null;
        }

        this.on_destroy_contents(callremovechild);

        this._is_created = false;
        this._arrange_info = null;

        if (this._refform)
            this._refform = null;
        if (this._p_parent)
            this._p_parent = null;
        if (this._refobj)
            this._refobj = null;

        if (this._p_hotkey)
            this._p_hotkey = null;

        if (this._event_list)
            this._event_list = null;
        if (this._last_focused)
            this._last_focused = null;
        if (this._cssselector)
            this._cssselector = null;

        this._clearStyleObject();
        if (this._cssclass)
            this._cssclass = null;

        if (this._statusmap)
            this._statusmap = null;

        if (this._userstatusmap)
            this._userstatusmap = null;

        if (this._fling_cubic_bezier)
            this._fling_cubic_bezier = null;

        if (this._env)
            this._env = null;

        return true;
    };

    _pComponent.on_destroy_contents = function () { };

    // layout contents
    _pComponent.on_change_containerRect = function (width, height)
    {
        this._repositionResizer();
        this._onResetScrollBar();
    };

    _pComponent.on_change_containerPos = function (left, top) { };

    // recreate component

    // reset component
    _pComponent._resetComponent = function ()				// reset 공통
    {
        this._clearComponent();

        this._resetObject();
        this._resetStatus();
        this._resetProperties();
    };

    _pComponent._resetObject = nexacro._emptyFn;			// 각 Component 환경에 맞게 사용
    _pComponent._resetStatus = nexacro._emptyFn;			// 각 Component 환경에 맞게 사용
    _pComponent._resetProperties = nexacro._emptyFn;		// 각 Component 환경에 맞게 사용

    // clear component
    _pComponent._clearComponent = function ()				// clear 공통
    {
        this._clearEventListeners();
        this._clearFocus();

        this._clearObject();
        this._clearContents();

        // Clear Inline Properties
        var ret = this._beforeClearProperties();
        this._clearProperties();
        this._afterClearProperties(ret);
    };
    _pComponent._clearStyleObject = function ()
    {
        if (this._color)
            this._color = null;
        if (this._font)
            this._font = null;
        if (this._wordspacing)
            this._wordspacing = null;
        if (this._letterspacing)
            this._letterspacing = null;
        if (this._textdecoration)
            this._textdecoration = null;
        if (this._borderradius)
            this._borderradius = null;
        if (this._border)
            this._border = null;
        if (this._background)
            this._background = null;
        if (this._edge)
            this._edge = null;
        if (this._cursor)
            this._cursor = null;
        if (this._opacity)
            this._opacity = null;
        if (this._boxshadow)
            this._boxshadow = null;
        if (this._padding)
            this._padding = null;
    };
    _pComponent._clearFocus = function ()
    {
        var win = this._getWindow();
        if (win)
        {
            win._removeFromCurrentFocusPath(this);
        }
    };
    _pComponent._clearObject = nexacro._emptyFn;			// 각 Component 환경에 맞게 사용
    _pComponent._clearContents = nexacro._emptyFn;			// 각 Component 환경에 맞게 사용
    _pComponent._clearProperties = nexacro._emptyFn;		// 각 Component 환경에 맞게 사용
    _pComponent._beforeClearProperties = nexacro._emptyFn;	// 각 Component 환경에 맞게 사용
    _pComponent._afterClearProperties = nexacro._emptyFn;	// 각 Component 환경에 맞게 사용
    _pComponent._clearUserFunctions = nexacro._emptyFn;	// 각 Component 환경에 맞게 사용
    _pComponent._setTablecellareacoordinate = nexacro._emptyFn; //DesignForm 
    //_pComponent._setDefaultSize = nexacro._emptyFn; // Div (for fittocontents)

    //===============================================================
    // nexacro.Component : Properties
    //===============================================================
    _pComponent.set_initvalueid = function (initvalueid)
    {
        if (!this._is_created)
        {
            this._p_initvalueid = initvalueid;
            const fn = this._type_name + initvalueid;
            const nexacro_init = nexacro.getNexacro_init();
            if (nexacro_init[fn])
                nexacro_init[fn].call(this, this);
        }
    };

    _pComponent.set_hittesttype = function (hittesttype)
    {
        if (this._hittest_type != hittesttype)
        {
            this._p_hittesttype = hittesttype;
            this._hittest_type = hittesttype;
            this.on_apply_hittesttype();
        }
    };

    _pComponent.on_apply_hittesttype = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementHittestType(this._hittest_type);
    };

    _pComponent.set_positionstep = function (v)
    {
        if (isNaN(v = +v) || v < -1)
        {
            return;
        }

        if (this._p_positionstep != v)
        {
            this._p_positionstep = v;
            this.on_apply_positionstep();
        }
    };

    _pComponent.on_apply_positionstep = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            control_elem.setElementPositionStep(this._p_positionstep);
        }
    };

    // Fluid Layout Component setter
    _pComponent.set_flexgrow = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v) || v < 0)
            {
                return;
            }
        }

        if (this._p_flexgrow != v)
        {
            this._p_flexgrow = v;
            this.on_apply_flexgrow();
        }
    };

    _pComponent.on_apply_flexgrow = function ()
    {
        if (!this._is_subcontrol)
        {
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                manager.applyFluidLayoutContentsProeprty(this, "flexgrow");
            }
        }
    };

    _pComponent.set_flexshrink = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v) || v < 0)
            {
                return;
            }
        }

        if (this._p_flexshrink != v)
        {
            this._p_flexshrink = v;
            this._flexshrink = v;
            this.on_apply_flexshrink();
        }
    };

    _pComponent.on_apply_flexshrink = function ()
    {
        if (!this._is_subcontrol)
        {
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                manager.applyFluidLayoutContentsProeprty(this, "flexshrink");
            }
        }
    };

    _pComponent.set_layoutorder = function (v)
    {
        if (isNaN(v = +v) || v < 0)
        {
            v = 0;
        }

        if (this._p_layoutorder != v)
        {
            this._p_layoutorder = parseInt(v);

            this.on_apply_layoutorder();
        }
    };

    _pComponent.on_apply_layoutorder = function ()
    {
        if (!this._is_subcontrol)
        {
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                manager.applyFluidLayoutContentsProeprty(this, "layoutorder");
            }
        }
    };

    _pComponent.set_tablecellarea = function (v)
    {
        // TODO2 validation 필요해보임
        if (this._p_tablecellarea !== v)
        {
            this._p_tablecellarea = v;
            this.on_apply_tablecellarea();
        }
    };

    _pComponent.on_apply_tablecellarea = function ()
    {
        this._tablecellarea = this._p_tablecellarea;
        if (!this._is_subcontrol)
        {
            var manager = nexacro._getLayoutManager();
            if (manager)
            {
                manager.applyFluidLayoutContentsProeprty(this, "tablecellarea");
            }
        }
    };

    _pComponent.set_cssclass = function (cssname)
    {
        if (this._p_cssclass != cssname)
        {
            this._p_cssclass = cssname;
            var cssclass = new nexacro.BindableValue();
            cssclass._set(cssname);
            this._cssclass = cssclass;
            if (cssclass._bindtype == 2)
                this._cssclass_exprfn = this._makeExprFn(cssclass._value);

            this.on_apply_cssclass();
        }
    };

    _pComponent.on_apply_cssclass = function ()
    {
        if (!this._isEnableRedraw()) return;
        var control_elem = this._control_element;
        if (control_elem)
        {
            var cssclassselector;
            var expr = this._cssclass_exprfn;
            if (expr)
            {
                try
                {
                    cssclassselector = nexacro._toString(expr.call(null, this));
                }
                catch (e)
                {
                    nexacro._settracemsg(e);
                }
                this._cssclass_exprfn = null;
                this._cssclass_expr = cssclassselector;
            }

            cssclassselector = this._getElementClassCSSSelector();
            if (cssclassselector)
                control_elem.setElementClassCSSSelector(cssclassselector.join(" "));
            else
                control_elem.setElementClassCSSSelector("");

            this._makeCSSMapInfo();

            if (this._is_scrollable)
            {
                this._onResetScrollBar();
            }
        }
        this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus, true);
        this.on_apply_prop_cssclass();

        this._setControlElementCssSelector();
    };

    _pComponent.set_name = function (v)
    {
        if (this._p_name != v)
        {
            this._p_name = v;
        }
    };

    _pComponent.set_text = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_text != v)
        {
            this._p_text = v;
            this._on_apply_text(v);
        }
    };

    _pComponent._on_apply_text = function (text)
    {
        text = this._getStringResourceProperty(this._p_text);
        var exprfn = this._expr_fn;
        if (exprfn)
        {
            try
            {
                text = nexacro._toString(exprfn.call(null, this));
            }
            catch (e)
            {
                nexacro._settracemsg(e);
            }
        }
        this._displaytext = text;

        if (this._env._p_enableaccessibility)
            this.on_apply_prop_accessibilitylabel();

        this.on_apply_text(text);
    };

    _pComponent.on_apply_text = function (text) { };

    _pComponent.set_expr = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_expr != v)
        {
            this._p_expr = v;
            this._on_apply_expr(v);
        }
    };

    _pComponent._on_apply_expr = function (expr)
    {
        if (expr)
        {
            this._expr_fn = null;
            this._expr_fn = this._makeExprFn(expr);
            this._on_apply_text(this._p_text);
        }
        else
        {
            this._expr_fn = null;
            this._on_apply_text(this._p_text);
        }
    };

    _pComponent.on_apply_expr = function () { };

    _pComponent._applyElementVisible = function (v) // HTML visibility vs display
    {
        this._control_element.setElementVisible(v);

        if (!this._is_nc_control)
        {
            if (this._isFluidContainer() && !this._isFluidContainerCalculation() && !this._isSelfCalculationPosition())
                this._control_element.setElementLayoutFluidPos(v);
        }
    };

    _pComponent.set_visible = function (v)
    {
        if (v === undefined || v === null) return;

        v = nexacro._toBoolean(v);
        if (this._p_visible != v)
        {
            // Visible/Enable AutoFocus
            var _window = this._getWindow();
            var newfocus_comp;
            if (!v && this._is_created && this._p_parent)
            {
                if (_window && _window._indexOfCurrentFocusPaths(this) > -1)
                {
                    // Focus가 넘어갈 대상을 미리 탐색 (visible flag가 바뀌면 결과가 다름)
                    var cur_tabstop = this._p_tabstop;
                    this._p_tabstop = false;
                    newfocus_comp = this._getForm()._searchNextTabFocus();
                    this._p_tabstop = cur_tabstop;
                }
            }

            this._p_visible = v;

            var control_elem = this._control_element;
            if (control_elem)
            {
                if (this._env._p_enableaccessibility)
                {
                    if (this._is_subcontrol && this._isFocusAcceptable() == false)
                    {
                        this._setAccessibilityStatHidden(true);
                    }
                    else
                    {
                        this._setAccessibilityStatHidden(!v);
                    }
                }

                if (!this._is_subcontrol)
                {
                    var manager = nexacro._getLayoutManager();
                    if (manager)
                    {
                        manager.applyFluidLayoutContentsProeprty(this, "visible");
                    }
                }

                this._applyElementVisible(v);

                var parent = this._p_parent;
                if (this._p_visible)
                {
                    // 동적으로 컴포넌트 생성시, show,hide시 Scroll이 자동으로 갱신되면 안됨.
                    // 필요한 경우 사용자가 resetScroll 호출.

                    // display=none인 경우 DOM값을 세팅해도 세팅되지 않는 문제때문에
                    // 나타나는 순간에 값을 갱신해줘야 함. (하위 모두 적용이 안됐으므로 재귀호출)

                    // Visible/Enable AutoFocus
                    if (!this._is_subcontrol && this._is_created && parent && parent._is_created && !parent._getLastFocused())
                    {
                        // Parent가 최종 포커스인 상태에서 Hidden이던 Child가 다시 나타나면 포커스
                        if (_window && _window._focus_list && _window._indexOfCurrentFocusPaths(parent) == _window._getCurrentFocusPathsLength() - 1)
                        {
                            this._on_focus(true);
                        }
                    }
                    this._apply_status("", this._status, "", this._userstatus, true);
                }
                else
                {
                    // Focus된 컴포넌트가 사라지는 Case처리
                    // Visible/Enable AutoFocus
                    if (!this._is_subcontrol && parent)
                    {
                        if (_window && _window._indexOfCurrentFocusPaths(this) > -1)
                        {
                            // 임시스펙 FocusComp가 사라지면 Tab키 누른것처럼 다음 컴포넌트가 포커스
                            _window._removeFromCurrentFocusPath(this, false);
                            if (newfocus_comp && newfocus_comp[0])
                                newfocus_comp[0]._on_focus(true);
                        }
                    }

                    if (this._status === "mouseover")
                    {
                        this._changeStatus("mouseover", false);
                    }
                }
            }
        }
    };

    _pComponent.set_enable = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_enable != v)
        {
            // Visible/Enable AutoFocus
            var _window = this._getWindow();
            var newfocus_comp;
            if (!this._is_subcontrol && !v && this._is_created && this._p_parent)
            {
                if (_window && _window._indexOfCurrentFocusPaths(this) > -1)
                {
                    // Focus가 넘어갈 대상을 미리 탐색 (enable flag가 바뀌면 결과가 다름)
                    var cur_tabstop = this._p_tabstop;
                    this._p_tabstop = false;
                    newfocus_comp = this._getForm()._searchNextTabFocus();
                    this._p_tabstop = cur_tabstop;
                }
            }

            this._p_enable = v;
            if (this._is_created)
            {
                var enable_flag = (this._getParentEnable() && v);
                if (this._real_enable != enable_flag)
                {
                    nexacro._is_enable_setting = true;
                    this._setEnable(enable_flag); //_setEnable 내부에서 동작함
                    nexacro._is_enable_setting = false;
                    // Visible/Enable AutoFocus
                    var parent = this._p_parent;
                    if (!this._is_subcontrol && this._is_created && parent && parent._is_created)
                    {
                        if (enable_flag)
                        {
                            if (_window && _window._indexOfCurrentFocusPaths(parent) == _window._getCurrentFocusPathsLength() - 1
                                && !parent._last_focused)
                            {
                                this._on_focus(true);
                            }
                        }
                        else
                        {
                            if (_window && _window._indexOfCurrentFocusPaths(this) > -1)
                            {
                                // 임시스펙 FocusComp가 사라지면 Tab키 누른것처럼 다음 컴포넌트가 포커스
                                if (newfocus_comp && newfocus_comp[0])
                                    newfocus_comp[0]._on_focus(true);
                                else
                                    _window._removeFromCurrentFocusPath(this, false);
                            }
                        }
                    }
                }
            }
        }
    };

    _pComponent.set_taborder = function (v)
    {
        if (isNaN(v = +v) || v < 0)
        {
            return;
        }

        if (this._p_taborder != v)
        {
            this._p_taborder = v;
            this.on_apply_prop_taborder();
        }
    };

    _pComponent.set_tabstop = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_tabstop != v)
        {
            this._p_tabstop = v;
            this.on_apply_prop_taborder();
        }
    };

    _pComponent.set_tooltiptext = function (v)
    {
        if (nexacro._isNull(v))
        {
            this._p_tooltiptext = v;
            this.on_apply_prop_tooltip();
        }
        else
        {
            v = nexacro._toString(v);
            if (this._p_tooltiptext != v)
            {
                this._p_tooltiptext = v;
                this.on_apply_prop_tooltip();
            }
        }
    };

    _pComponent.set_tooltiptype = function (v)
    {
        var tooltiptype_enum = ["default", "hover", "inplace", "default,mouseleave", "hover,mouseleave", "inplace,mouseleave"];
        if (tooltiptype_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_tooltiptype != v)
        {
            this._p_tooltiptype = v;
            this.on_apply_prop_tooltip();
        }
    };

    _pComponent.set_enableevent = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_enableevent != v)
        {
            this._p_enableevent = v;
        }
    };

    _pComponent.set_enableredraw = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_enableredraw != v)
        {
            this._p_enableredraw = v;
            this.on_apply_enableredraw();
        }
    };

    _pComponent.on_apply_enableredraw = function ()
    {
        this.on_apply_color(this._color);
        this.on_apply_font(this._font);
        this.on_apply_wordSpacing(this._wordspacing);
        this.on_apply_letterSpacing(this._letterSpacing);
        this.on_apply_borderRadius(this._borderradius);
        this.on_apply_border(this._border);
        this.on_apply_background(this._background);
        this.on_apply_edge(this._edge);
        this.on_apply_margin();
        this.on_apply_opacity(this._opacity);
        this.on_apply_boxShadow(this._boxshadow);
        this.on_apply_cssclass();
    };

    _pComponent.set_hotkey = function (v)
    {
        var cur_hotkey = this._hotkey;
        if (cur_hotkey)
        {
            this._unregisterHotkey();
        }

        var hotkey = new nexacro._HotKey(v);
        if (hotkey._isEmpty())
        {
            this._p_hotkey = null;
            this._hotkey = null;
        }
        else
        {
            this._p_hotkey = hotkey._toString();
            this._hotkey = hotkey;

            if (this._is_created)
                this._registerHotkey();
        }
    };

    _pComponent.set_rtl = function (v)
    {
        if (this._p_rtl != v)
        {
            this._p_rtl = v;
            this._rtl = nexacro._isBoolean(v) ? nexacro._toBoolean(v) : undefined;
            this.on_apply_prop_rtl();
        }
    };

    _pComponent.set_transparenthittest = nexacro._emptyFn; // removed prop

    _pComponent.set_locale = nexacro._emptyFn;

    _pComponent.on_apply_locale = nexacro._emptyFn;

    // position prop
    _pComponent.set_left = function (v)
    {
        this._setLeft(v);
        this._update_position();
    };

    _pComponent.set_top = function (v)
    {
        this._setTop(v);
        this._update_position();
    };

    _pComponent.set_right = function (v)
    {
        this._setRight(v);
        this._update_position();
    };

    _pComponent.set_bottom = function (v)
    {
        this._setBottom(v);
        this._update_position();
    };

    _pComponent.set_width = function (v)
    {
        this._setWidth(v);
        this._update_position();
    };

    _pComponent.set_height = function (v)
    {
        this._setHeight(v);
        this._update_position();
    };

    _pComponent.set_minwidth = function (v)
    {
        this._setMinwidth(v);
        this._update_position();
    };

    _pComponent.set_maxwidth = function (v)
    {
        this._setMaxwidth(v);
        this._update_position();
    };

    _pComponent.set_minheight = function (v)
    {
        this._setMinheight(v);
        this._update_position();
    };

    _pComponent.set_maxheight = function (v)
    {
        this._setMaxheight(v);
        this._update_position();
    };

    _pComponent.set_fittocontents = function (v)
    {
        var fittocontents_enum = ["none", "width", "height", "both"];
        if (fittocontents_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this._p_fittocontents != v)
        {
            this._p_fittocontents = v;
            this.on_apply_fittocontents();
        }
    };

    _pComponent.on_apply_fittocontents = function ()
    {
        if (this._is_created)
        {
            if (this._p_fittocontents == "height") // for wordwrap (orginal width)
            {
                var fittemp = this._p_fittocontents;
                this._p_fittocontents = "none";
                this._calcArrangePosition();
                this._adjustPosition();
                this._p_fittocontents = fittemp;
            }
            this._update_position();
        }
        this._on_apply_fittocontents();
    };

    _pComponent._on_apply_fittocontents = function ()
    {
        //fluid
        if (this._isFluidContainer())
        {
            var control_elem = this.getElement();
            if (control_elem)
            {
                var form = this._is_group ? this._group_panel : this._p_parent;
                if (form)
                {
                    var manager = nexacro._getLayoutManager();
                    if (!manager) return;
                    var fm = manager._fluidlayoutmanager
                    //var arrangetype = fm.getLayoutArrangeType();
                    //if (arrangetype == 1) return;
                    var layouttype = manager.getLayoutType(form);
                    var fittocontents = this._p_fittocontents;
                    if (fittocontents == "none")
                    {
                        this._flexshrink = this._p_flexshrink;
                        control_elem.setElementFlexShrink(this._p_flexshrink);
                    }
                    else
                    {
                        if (layouttype == 1)
                        {
                            if (fittocontents == "width" || fittocontents == "both")
                            {
                                this._flexshrink = 0;
                                control_elem.setElementFlexShrink(0);
                            }
                        }
                        else if (layouttype == 2)
                        {
                            if (fittocontents == "height" || fittocontents == "both")
                            {
                                this._flexshrink = 0;
                                control_elem.setElementFlexShrink(0);
                            }
                        }
                        else if (this._flexshrink != this._p_flexshrink)
                        {
                            this._flexshrink = this._p_flexshrink;
                        }
                    }
                }
            }
        }
    };

    // scrollbar prop
    _pComponent.set_scrollbartype = function (v)
    {
        v = nexacro._toString(v).trim();

        var new_vscrollbartype;
        var new_hscrollbartype;
        var arr = v.toLowerCase().split(" ");

        this._p_scrollbartype = v;

        for (var i = 0; i < arr.length; i++)
        {
            switch (arr[i])
            {
                case "none": case "auto": case "fixed": case "autoindicator": case "indicator": case "default":
                    if (i == 0)
                        new_hscrollbartype = arr[i];
                    else if (i == 1)
                        new_vscrollbartype = arr[i];
                    break;
                default:
                    break;
            }
        }

        if (!new_hscrollbartype && !new_vscrollbartype)
        {
            this._hscrollbartype = undefined;
            this._vscrollbartype = undefined;
        }
        else
        {
            if (!new_hscrollbartype || new_hscrollbartype == "default")
                this._hscrollbartype = new_hscrollbartype = undefined;
            else
                this._hscrollbartype = new_hscrollbartype;

            if (!new_vscrollbartype)
                this._vscrollbartype = new_hscrollbartype;
            else if (new_vscrollbartype == "default")
                this._vscrollbartype = undefined;
            else
                this._vscrollbartype = new_vscrollbartype;
        }

        this.on_apply_scrollbartype();

        return v;
    };

    _pComponent.on_apply_scrollbartype = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var hscrollbarsize = this._getHScrollBarSize();
            var vscrollbarsize = this._getVScrollBarSize();

            var hscrollbartype = this._getHScrollBarType();
            var vscrollbartype = this._getVScrollBarType();

            control_elem.setElementScrollbarSize(hscrollbarsize, vscrollbarsize, hscrollbartype, vscrollbartype, this._p_scrolltype);
            this._onResetScrollBar();
        }
    };

    _pComponent.set_scrolltype = function (v)
    {
        v = nexacro._toString(v);

        if (!nexacro._isNull(v))
            v = v.toLowerCase();

        switch (v)
        {
            case "none": case "both": case "horizontal": case "vertical":
                this._p_scrolltype = v;
                this._scrolltype = v;

                this.on_apply_scrolltype();
                break;
            default:
                break;
        }

        return v;
    };

    _pComponent.on_apply_scrolltype = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var hscrollbarsize = this._getHScrollBarSize();
            var vscrollbarsize = this._getVScrollBarSize();

            var hscrollbartype = this._getHScrollBarType();
            var vscrollbartype = this._getVScrollBarType();

            control_elem.setElementScrollbarSize(hscrollbarsize, vscrollbarsize, hscrollbartype, vscrollbartype, this._p_scrolltype);
            this._onResetScrollBar();
        }
    };

    _pComponent.set_scrollbarbarminsize = function (scrollbarbarminsize)
    {
        if (!this._is_scrollable)
            return;

        if (scrollbarbarminsize !== undefined)
        {
            scrollbarbarminsize = parseInt(scrollbarbarminsize);
            if (isNaN(scrollbarbarminsize))
                return;
        }

        if (this._p_scrollbarbarminsize != scrollbarbarminsize)
        {
            this._p_scrollbarbarminsize = scrollbarbarminsize;
            var scrollbar = this._p_vscrollbar;
            if (scrollbar)
                scrollbar.set_barminsize(scrollbarbarminsize);

            scrollbar = this._p_hscrollbar;
            if (scrollbar)
                scrollbar.set_barminsize(scrollbarbarminsize);
        }
    };

    _pComponent.set_scrollbardecbuttonsize = function (scrollbardecbuttonsize)
    {
        if (!this._is_scrollable)
            return;

        if (scrollbardecbuttonsize !== undefined)
        {
            scrollbardecbuttonsize = parseInt(scrollbardecbuttonsize);
            if (isNaN(scrollbardecbuttonsize))
                return;
        }

        if (this._p_scrollbardecbuttonsize != scrollbardecbuttonsize)
        {
            this._p_scrollbardecbuttonsize = scrollbardecbuttonsize;
            var scrollbar = this._p_vscrollbar;
            if (scrollbar)
                scrollbar.set_decbuttonsize(scrollbardecbuttonsize);

            scrollbar = this._p_hscrollbar;
            if (scrollbar)
                scrollbar.set_decbuttonsize(scrollbardecbuttonsize);
        }
    };

    _pComponent.set_scrollbarbaroutsize = function (scrollbarbaroutsize)
    {
        if (!this._is_scrollable)
            return;

        if (scrollbarbaroutsize !== undefined)
        {
            scrollbarbaroutsize = parseInt(scrollbarbaroutsize);
            if (isNaN(scrollbarbaroutsize))
                return;
        }

        if (this._p_scrollbarbaroutsize != scrollbarbaroutsize)
        {
            this._p_scrollbarbaroutsize = scrollbarbaroutsize;
            var scrollbar = this._p_vscrollbar;
            if (scrollbar)
                scrollbar.set_baroutsize(scrollbarbaroutsize);

            scrollbar = this._p_hscrollbar;
            if (scrollbar)
                scrollbar.set_baroutsize(scrollbarbaroutsize);
        }
    };

    _pComponent.set_scrollbarincbuttonsize = function (scrollbarincbuttonsize)
    {
        if (!this._is_scrollable)
            return;
        if (scrollbarincbuttonsize !== undefined)
        {
            //var scrollbarbaroutsize = parseInt(scrollbarincbuttonsize);
            if (isNaN(scrollbarincbuttonsize))
                return;
        }

        if (this._p_scrollbarincbuttonsize != scrollbarincbuttonsize)
        {
            this._p_scrollbarincbuttonsize = scrollbarincbuttonsize;
            var scrollbar = this._p_vscrollbar;
            if (scrollbar)
                scrollbar.set_incbuttonsize(scrollbarincbuttonsize);
            scrollbar = this._p_hscrollbar;
            if (scrollbar)
                scrollbar.set_incbuttonsize(scrollbarincbuttonsize);
        }
    };

    _pComponent.set_scrollbarsize = function (scrollbarsize)
    {
        if (!this._is_scrollable)
            return;

        if (scrollbarsize !== undefined)
        {
            scrollbarsize = parseInt(scrollbarsize);
            if (isNaN(scrollbarsize))
                return;
        }

        if (this._p_scrollbarsize != scrollbarsize)
        {
            this._p_scrollbarsize = scrollbarsize;
            this.on_apply_scrollbarsize();
        }

    };

    _pComponent.on_apply_scrollbarsize = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var hscrollbarsize = this._getHScrollBarSize();
            var vscrollbarsize = this._getVScrollBarSize();

            var hscrollbartype = this._getHScrollBarType();
            var vscrollbartype = this._getVScrollBarType();

            control_elem.setElementScrollbarSize(hscrollbarsize, vscrollbarsize, hscrollbartype, vscrollbartype, this._p_scrolltype);
        }

        this._onResetScrollBar();
    };

    _pComponent.set_scrollindicatorsize = function (scrollindicatorsize)
    {
        if (!this._is_scrollable)
            return;
        if (scrollindicatorsize !== undefined)
        {
            scrollindicatorsize = parseInt(scrollindicatorsize);
            if (isNaN(scrollindicatorsize))
                return;
        }

        if (this._p_scrollindicatorsize != scrollindicatorsize)
        {
            this._p_scrollindicatorsize = scrollindicatorsize;
            this.on_apply_scrollbarsize();
        }
    };

    _pComponent.set_scrollbartrackbarsize = function (scrollbartrackbarsize)
    {
        if (!this._is_scrollable)
            return;

        if (scrollbartrackbarsize !== undefined)
        {
            scrollbartrackbarsize = parseInt(scrollbartrackbarsize);
            if (isNaN(scrollbartrackbarsize))
                return;
        }

        if (this._p_scrollbartrackbarsize != scrollbartrackbarsize)
        {
            this._p_scrollbartrackbarsize = scrollbartrackbarsize;
            var scrollbar = this._p_vscrollbar;
            if (scrollbar)
                scrollbar.set_trackbarsize(scrollbartrackbarsize);
            scrollbar = this._p_hscrollbar;
            if (scrollbar)
                scrollbar.set_trackbarsize(scrollbartrackbarsize);
        }
    };

    // resizer prop
    _pComponent.set_resizertype = function (v)
    {
        v = nexacro._toString(v);

        if (!nexacro._isNull(v))
            v = v.toLowerCase();

        switch (v)
        {
            case "none": case "live": case "deferred":
                this._p_resizertype = v;

                this.on_apply_prop_resizertype();
                break;
            default:
                break;
        }

        return v;
    };

    _pComponent.on_apply_prop_resizertype = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            this._resetResizer(this._getVScrollBarSize(), this._getHScrollBarSize());
        }
    };

    _pComponent.set_resizerdirection = function (v)
    {
        v = nexacro._toString(v);

        if (!nexacro._isNull(v))
            v = v.toLowerCase();

        switch (v)
        {
            case "both": case "horizontal": case "vertical":
                this._p_resizerdirection = v;

                this.on_apply_prop_resizerdirection();
                break;
            default:
                break;
        }

        return v;
    };

    _pComponent.on_apply_prop_resizerdirection = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            this._resetResizer(this._getVScrollBarSize(), this._getHScrollBarSize());
        }
    };

    // accessibility prop
    _pComponent.set_accessibilityrole = function (accessibilityrole)
    {
        if (this._p_accessibilityrole != accessibilityrole)
        {
            this._p_accessibilityrole = accessibilityrole;
            this.on_apply_prop_accessibilityrole();
        }
    };

    _pComponent.on_apply_prop_accessibilityrole = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            // edit 계열은 input에 직업 role 설정
            if (!this._has_inputElement || nexacro._Browser == "Runtime")
            {
                this._setAccessibilityRole(this._getAccessibilityRole());
            }
        }
    };

    _pComponent.set_accessibilityenable = function (accessibilityenable)
    {
        var accenable = nexacro._toBoolean(accessibilityenable);
        if (this._p_accessibilityenable != accenable)
        {
            this._p_accessibilityenable = accenable;
            this.on_apply_prop_accessibilityenable();
        }
    };

    _pComponent.on_apply_prop_accessibilityenable = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
            this._setAccessibilityEnable(this._p_accessibilityenable);
    };

    _pComponent.set_accessibilitylabel = function (accessibilitylabel)
    {
        if (this._p_accessibilitylabel != accessibilitylabel)
        {
            this._p_accessibilitylabel = accessibilitylabel;
            this.on_apply_prop_accessibilitylabel();
        }
    };

    _pComponent.on_apply_prop_accessibilitylabel = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            this._setAccessibilityLabel(this._getAccessibilityLabel());
        }
    };

    _pComponent.set_accessibilitydescription = function (accessibilitydescription)
    {
        if (this._p_accessibilitydescription != accessibilitydescription)
        {
            this._p_accessibilitydescription = accessibilitydescription;
            this.on_apply_prop_accessibilitydescription();
        }
    };

    _pComponent.on_apply_prop_accessibilitydescription = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            this._setAccessibilityDescription(this._getAccessibilityDescription());
        }
    };

    _pComponent.set_accessibilityaction = function (accessibilityaction)
    {
        if (this._p_accessibilityaction != accessibilityaction)
        {
            this._p_accessibilityaction = accessibilityaction;
            this.on_apply_prop_accessibilityaction();
        }
    };

    _pComponent.on_apply_prop_accessibilityaction = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            this._setAccessibilityAction(this._getAccessibilityAction()); // TODO : 접근성 우선순위 고려
        }
    };

    _pComponent.set_accessibilitydesclevel = function (accessibilitydesclevel)
    {
        if (this._p_accessibilitydesclevel != accessibilitydesclevel)
        {
            this._p_accessibilitydesclevel = accessibilitydesclevel;
            this.on_apply_prop_accessibilitydesclevel();
        }
    };

    _pComponent.on_apply_prop_accessibilitydesclevel = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
            this._setAccessibilityDescLevel(this._getAccessibilityDescLevel());
    };

    _pComponent.on_apply_accessibility = function ()
    {
        this.on_apply_prop_accessibilityrole();
        this.on_apply_prop_accessibilityenable();
        this.on_apply_prop_accessibilitylabel();
        this.on_apply_prop_accessibilitydescription();
        this.on_apply_prop_accessibilityaction();
        this.on_apply_prop_accessibilitydesclevel();
    };

    _pComponent.set_itemaccessibilityenable = function (accessibilityenable)
    {
        var accenable = nexacro._toBoolean(accessibilityenable);
        if (this._p_itemaccessibilityenable != accenable)
        {
            this._p_itemaccessibilityenable = accenable;
            this.on_apply_prop_itemaccessibilityenable();
        }
    };

    _pComponent.on_apply_prop_itemaccessibilityenable = nexacro._emptyFn;

    // inline style prop
    _pComponent.set_color = function (val)
    {
        this._p_color = val;

        if (val)
        {
            if (this._color == null || this._color.value != val)
            {
                var color = nexacro.ColorObject(val);
                this._color = color;
                this.on_apply_color(color);
            }
        }
        else
        {
            if (this._color)
            {
                this._color = null;
                this.on_apply_color(null);
            }
        }
    };

    _pComponent.on_apply_color = function (color)
    {
        if (!this._isEnableRedraw()) return;
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementColor(color);
    };

    _pComponent.set_font = function (val)
    {
        this._p_font = val;
        if (val)
        {
            if (this._font == null || this._font.value != val)
            {
                var font = nexacro.FontObject(val);
                this._font = font;
                this.on_apply_font(font);
            }
        }
        else
        {
            if (this._font)
            {
                this._font = null;
                this.on_apply_font(null);
            }
        }
    };

    _pComponent.on_apply_font = function (font)
    {
        if (!this._isEnableRedraw()) return;
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementFont(font);
    };

    _pComponent.set_textDecoration = function (val)
    {
        this._p_textDecoration = val;
        if (val)
        {
            if (this._textdecoration == null || this._textdecoration.value != val)
            {
                var textDecoration = nexacro.TextDecorationObject(val);
                this._textdecoration = textDecoration;
                this.on_apply_textDecoration(textDecoration);
            }
        }
        else
        {
            if (this._textdecoration)
            {
                this._textdecoration = null;
                this.on_apply_textDecoration(null);
            }
        }
    };

    _pComponent.on_apply_textDecoration = function (textDecoration) { };

    _pComponent.set_wordSpacing = function (val)
    {
        val = nexacro._toString(val);
        this._p_wordSpacing = val;
        if (val)
        {
            if (this._wordspacing == null || this._wordspacing.value != val)
            {
                var wordSpacing = nexacro.CSSValueObject(val);
                this._wordspacing = wordSpacing;
                this.on_apply_wordSpacing(wordSpacing);
            }
        }
        else
        {
            if (this._wordspacing)
            {
                this._wordspacing = null;
                this.on_apply_wordSpacing(null);
            }
        }
    };

    _pComponent.on_apply_wordSpacing = function (wordSpacing)
    {
        if (!this._isEnableRedraw()) return;
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementWordSpacing(wordSpacing);
    };

    _pComponent.set_letterSpacing = function (val)
    {
        val = nexacro._toString(val);
        this._p_letterSpacing = val;
        if (val)
        {
            if (this._letterspacing == null || this._letterspacing.value != val)
            {
                var letterSpacing = nexacro.CSSValueObject(val);
                this._letterspacing = letterSpacing;
                this.on_apply_letterSpacing(letterSpacing);
            }
        }
        else
        {
            if (this._letterspacing)
            {
                this._letterspacing = null;
                this.on_apply_letterSpacing(null);
            }
        }
    };

    _pComponent.on_apply_letterSpacing = function (letterSpacing)
    {
        if (!this._isEnableRedraw()) return;
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementLetterSpacing(letterSpacing);
    };

    _pComponent.set_wordWrap = function (val)
    {
        if (val)
        {
            if (this._p_wordWrap == null || this._p_wordWrap != val)
            {
                var wordWrap = val;
                this._p_wordWrap = wordWrap;
                this.on_apply_wordWrap(wordWrap);
            }
        }
        else
        {
            if (this._p_wordWrap)
            {
                this._p_wordWrap = null;
                this.on_apply_wordWrap(null);
            }
        }
    };

    _pComponent.on_apply_wordWrap = function (wordWrap) { };

    _pComponent.set_borderRadius = function (val)
    {
        this._p_borderRadius = val;
        if (val)
        {
            if (this._borderradius == null || this._borderradius.value != val)
            {
                var borderRadius = nexacro.BorderRadiusObject(val);
                this._borderradius = borderRadius;
                this.on_apply_borderRadius(borderRadius);
            }
        }
        else
        {
            if (this._borderradius)
            {
                this._borderradius = null;
                this.on_apply_borderRadius(null);
            }
        }
    };

    _pComponent.on_apply_borderRadius = function (borderRadius)
    {
        if (!this._isEnableRedraw()) return;
        var control_elem = this._control_element;
        if (control_elem)
        {
            control_elem.setElementBorderRadius(borderRadius);
        }
    };

    _pComponent.set_border = function (val)
    {
        this._p_border = val;
        if (val)
        {
            if (this._border == null || !this._border._single || this._border.value != val)
            {
                var border = nexacro.BorderObject(val);
                this._border = border;
                this.on_apply_border(border);
            }
        }
        else
        {
            if (this._border)
            {
                this._border = null;
                this.on_apply_border(null);
            }
        }
    };

    _pComponent.on_apply_border = function (border)
    {
        if (!this._isEnableRedraw()) return;
        var control_elem = this._control_element;
        if (control_elem)
        {
            control_elem.setElementBorder(border);
        }
    };

    _pComponent.set_background = function (val)
    {
        this._p_background = val;
        if (val)
        {
            if (this._background == null || this._background.value != val)
            {
                var backgroud = nexacro.BackgroundObject(val, this);
                this._background = backgroud;
                this.on_apply_background(backgroud);
            }
        }
        else
        {
            if (this._background)
            {
                this._background = null;
                this.on_apply_background(null);
            }
        }
    };

    _pComponent.on_apply_background = function (background)
    {
        if (!this._isEnableRedraw()) return;
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementBackground(background);
    };

    _pComponent.set_edge = function (val)
    {
        this._p_edge = val;
        if (val)
        {
            if (this._edge == null || this._edge.value != val)
            {
                var edge = nexacro.EdgeImageObject(val, this);
                this._edge = edge;
                this.on_apply_edge(edge);
            }
        }
        else
        {
            if (this._edge)
            {
                this._edge = null;
                this.on_apply_edge(null);
            }
        }
    };

    _pComponent.on_apply_edge = function (edge)
    {
        if (!this._isEnableRedraw()) return;
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementEdge(edge);
    };

    _pComponent.set_margin = function (val) // removed prop
    {
        if (val)
        {
            if (this._p_margin == null || this._p_margin.value != val)
            {
                var margin = nexacro._getCachedMarginObject(val);
                this._p_margin = margin;
                this.on_apply_margin(margin);
            }
        }
        else
        {
            if (this._p_margin)
            {
                this._p_margin = null;
                this.on_apply_margin(null);
            }
        }
    };

    _pComponent.on_apply_margin = function (/*margin*/)
    {
        if (!this._isEnableRedraw()) return;
        var control_elem = this._control_element;
        if (control_elem)
        {
            this._adjustPosition();

            control_elem.setElementVisible(this._p_visible);
            control_elem.setElementPosition(this._adjust_left, this._adjust_top);
            control_elem.setElementSize(this._adjust_width, this._adjust_height);
        }
    };

    _pComponent.set_padding = function (val)
    {
        this._p_padding = val;
        if (val)
        {
            if (this._padding == null || this._padding.value != val)
            {
                var padding = nexacro.PaddingObject(val);
                this._padding = padding;
                this._on_apply_padding(padding);
            }
        }
        else
        {
            if (this._padding)
            {
                this._padding = null;
                this._on_apply_padding(null);
            }
        }
    };

    _pComponent._on_apply_padding = function (padding)
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            control_elem.setElementPadding(padding);
            this.on_apply_padding(padding);
        }
    };

    _pComponent.on_apply_padding = function (padding) { };

    _pComponent.set_textAlign = function (val)
    {
        if (val)
        {
            if (this._p_textAlign == null || this._p_textAlign != val)
            {
                this._p_textAlign = val;
                this.on_apply_textAlign(val);
            }
        }
        else
        {
            if (this._p_textAlign)
            {
                this._p_textAlign = null;
                this.on_apply_textAlign(null);
            }
        }
    };

    _pComponent.on_apply_textAlign = function (halign) { };

    _pComponent.set_verticalAlign = function (val)
    {
        if (val)
        {
            if (this._p_verticalAlign == null || this._p_verticalAlign != val)
            {
                this._p_verticalAlign = val;
                this.on_apply_verticalAlign(val);
            }
        }
        else
        {
            if (this._p_verticalAlign)
            {
                this._p_verticalAlign = null;
                this.on_apply_verticalAlign(null);
            }
        }
    };

    _pComponent.on_apply_verticalAlign = function (valign) { };

    _pComponent.set_cursor = function (val)
    {
        this._p_cursor = val;
        if (val)
        {
            if (this._cursor == null || this._cursor.value != val)
            {
                var cursor = nexacro.CursorObject(val);
                this._cursor = cursor;
                this.on_apply_cursor(cursor);
            }
        }
        else
        {
            if (this._cursor)
            {
                this._cursor = null;
                this.on_apply_cursor(null);
            }
        }
    };

    _pComponent.on_apply_cursor = function (cursor)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementCursor(cursor);
    };

    _pComponent._updateCursor = function (cursor)
    {
        if (nexacro._cur_track_info || nexacro._cur_extra_track_info)
            return;

        var cursorobj = this._cursor;
        if (cursor)
            cursorobj = nexacro.CursorObject(cursor);

        this.on_apply_cursor(cursorobj);
    };

    _pComponent.set_opacity = function (val)
    {
        this._p_opacity = val;
        if (0 === val || val)
        {
            if (this._opacity == null || this._opacity.value != val)
            {
                var opacity = nexacro.OpacityObject(val);
                this._opacity = opacity;
                this.on_apply_opacity(opacity);
            }
        }
        else
        {
            if (this._opacity)
            {
                this._opacity = null;
                this.on_apply_opacity(null);
            }
        }
    };

    _pComponent.on_apply_opacity = function (opacity)
    {
        if (!this._isEnableRedraw()) return;
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementOpacity(opacity);
    };

    _pComponent.set_boxShadow = function (val)
    {
        this._p_boxShadow = val;
        if (val)
        {
            if (this._boxshadow == null || this._boxshadow.value != val)
            {
                var shadow = nexacro.ShadowObject(val);
                this._boxshadow = shadow;
                this.on_apply_boxShadow(shadow);
            }
        }
        else
        {
            if (this._boxshadow)
            {
                this._boxshadow = null;
                this.on_apply_boxShadow(null);
            }
        }
    };

    _pComponent.on_apply_boxShadow = function (shadow)
    {
        if (!this._isEnableRedraw()) return;
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementBoxShadow(shadow);
    };

    _pComponent.on_apply_scrollbarbarminsize = nexacro._emptyFn;
    _pComponent.on_apply_scrollbarbaroutsize = nexacro._emptyFn;
    _pComponent.on_apply_scrollbardecbuttonsize = nexacro._emptyFn;
    _pComponent.on_apply_scrollbarincbuttonsize = nexacro._emptyFn;
    _pComponent.on_apply_scrollbartrackbarsize = nexacro._emptyFn;

    _pComponent._properties = [{ name: "expr" }, { name: "cssclass" }, { name: "visible" }, { name: "enable" }, { name: "taborder" }, { name: "tabstop" }, { name: "enableredraw" }, { name: "enableevent" }, { name: "tooltiptype" }, { name: "tooltiptext" }, { name: "fittocontents" }, { name: "hotkey" }, { name: "rtl" }, { name: "positionstep" }, { name: "resizertype" }, { name: "resizerdirection" }, { name: "scrollbartype" }, { name: "scrolltype" }, { name: "scrollbarsize" }, { name: "scrollindicatorsize" }, { name: "scrollbarbarminsize" }, { name: "scrollbarbaroutsize" }, { name: "scrollbardecbuttonsize" }, { name: "scrollbarincbuttonsize" }, { name: "scrollbartrackbarsize" }, { name: "left" }, { name: "top" }, { name: "right" }, { name: "bottom" }, { name: "width" }, { name: "height" }, { name: "minwidth" }, { name: "maxwidth" }, { name: "minheight" }, { name: "maxheight" }, { name: "color" }, { name: "font" }, { name: "wordSpacing" }, { name: "letterSpacing" }, { name: "textDecoration" }, { name: "wordWrap" }, { name: "borderRadius" },
    { name: "border" }, { name: "background" }, { name: "edge" }, { name: "cursor" }, { name: "opacity" }, { name: "boxShadow" }, { name: "padding" }, { name: "textAlign" }, { name: "verticalAlign" }, { name: "accessibilityrole" }, { name: "accessibilityenable" }, { name: "accessibilitylabel" }, { name: "accessibilitydescription" }, { name: "accessibilityaction" }, { name: "accessibilitydesclevel" }, { name: "itemaccessibilityenable" }, { name: "flexgrow" }, { name: "flexshrink" }, { name: "layoutorder" }, { name: "tablecellarea" }, { name: "initvalueid" }, { name: "hittesttype" }, { name: "name" }, { name: "text" }, { name: "hscrollbar", readonly: true }, { name: "vscrollbar", readonly: true }];
    nexacro._defineProperties(_pComponent, _pComponent._properties);

    //===============================================================
    // nexacro.Component : Methods
    //===============================================================
    _pComponent.bringToFront = function ()
    {
        if (this._p_parent)
        {
            var parent = this._p_parent;
            var parent_child_list = parent._child_list;

            var len = parent_child_list.length;
            var last_Idx = len - 1;

            var cur_Index = nexacro._indexOf(parent_child_list, this);

            if (cur_Index >= 0 && cur_Index < last_Idx)
            {
                parent_child_list.splice(cur_Index, 1);
                parent_child_list.splice(last_Idx, 0, this);

                var parent_elem = parent.getElement();
                var cur_elem = this._control_element;



                parent_elem.bringToFrontElement(cur_elem);
                this._applyScrollPos();

            }
        }
    };

    _pComponent.bringToPrev = function ()
    {
        if (this._p_parent)
        {
            var parent = this._p_parent;
            var parent_child_list = parent._child_list;

            var len = parent_child_list.length;
            var last_Idx = len - 1;

            var cur_Index = nexacro._indexOf(parent_child_list, this);

            if (cur_Index >= 0 && cur_Index < last_Idx)
            {


                this.moveToPrev(parent_child_list[cur_Index + 1]);


            }
        }
    };

    _pComponent.moveToNext = function (objOrId)
    {
        if (this._p_parent)
        {
            var parent = this._p_parent;
            var target = (nexacro._isString(objOrId)) ? parent[objOrId] : objOrId;

            if (target == null)
                return;

            var child_list = parent._child_list;
            var cur_idx = nexacro._indexOf(child_list, this);
            var target_idx = nexacro._indexOf(child_list, target);

            if (cur_idx < 0 || target_idx < 0) return;

            if (cur_idx > -1 && target_idx > -1 && cur_idx != target_idx - 1)
            {
                child_list.splice(cur_idx, 1);
                var idx = nexacro._indexOf(child_list, target);

                child_list.splice(idx, 0, this);

                var parent_elem = parent.getElement();
                parent_elem.moveToNextElement(this._control_element, target.getElement());
                this._applyScrollPos();
            }
        }
    };

    _pComponent.moveToPrev = function (objOrId)
    {
        if (this._p_parent)
        {
            var parent = this._p_parent;
            var target = (nexacro._isString(objOrId)) ? parent[objOrId] : objOrId;

            if (target == null)
                return;

            var child_list = parent._child_list;
            var cur_idx = nexacro._indexOf(child_list, this);
            var target_idx = nexacro._indexOf(child_list, target);

            if (cur_idx < 0 || target_idx < 0)
                return;

            if (cur_idx > -1 && target_idx > -1 && cur_idx != target_idx + 1)
            {
                child_list.splice(cur_idx, 1);

                var index = nexacro._indexOf(child_list, target);
                child_list.splice(index + 1, 0, this);

                var parent_elem = parent.getElement();
                parent_elem.moveToPrevElement(this._control_element, target.getElement());
                this._applyScrollPos();
            }
        }
    };

    _pComponent.sendToBack = function ()
    {
        if (this._p_parent)
        {
            var parent = this._p_parent;
            var child_list = parent._child_list;

            var cur_idx = nexacro._indexOf(child_list, this);
            if (cur_idx > 0)
            {
                child_list.splice(cur_idx, 1);
                child_list.splice(0, 0, this);

                var parent_elem = parent.getElement();
                parent_elem.sendToBackElement(this._control_element);
                this._applyScrollPos();
            }
        }
    };

    _pComponent.sendToNext = function ()
    {
        if (this._p_parent)
        {
            var p = this._p_parent;
            var child_list = p._child_list;
            var cur_idx = nexacro._indexOf(child_list, this);
            if (cur_idx > 0)
            {
                this.moveToNext(child_list[cur_idx - 1]);

            }
        }
    };

    _pComponent.beginTransitionEffect = function (obj)
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            control_elem.beginTransitionEffect(obj);
        }
    };

    _pComponent.applyTransitionEffect = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            control_elem.applyTransitionEffect();
        }
    };

    _pComponent.cancelTransitionEffect = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            control_elem.cancelTransitionEffect();
        }
    };

    _pComponent.create = function ()
    {
        this.initProperties();
        this.initEvents();
    };

    _pComponent.destroy = function (callremovechild)
    {
        if (!this._is_alive)
            return;

        return this.destroyComponent(callremovechild);
    };

    _pComponent.init = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight)
    {
        if (id)
        {
            this.id = this._p_name = id;
        }

        if (left != undefined && width != undefined && right != undefined)
            right = null;
        if (top != undefined && height != undefined && bottom != undefined)
            bottom = null;

        var horz = 0;
        var vert = 0;

        if (left != null) horz++;
        if (width != null) horz++;
        if (right != null) horz++;
        if (top != null) vert++;
        if (height != null) vert++;
        if (bottom != null) vert++;

        if (horz >= 2 && vert >= 2)
        {
            this._p_left = left;
            this._p_top = top;
            this._p_width = width;
            this._p_height = height;
            this._p_right = right;
            this._p_bottom = bottom;

            this._setMaxwidth(maxwidth);
            this._setMinwidth(minwidth);
            this._setMaxheight(maxheight);
            this._setMinheight(minheight);

            this._parseArrangeInfo(left, top, right, bottom, width, height);
            this._update_position();
        }
    };

    _pComponent.move = function (left, top, width, height, right, bottom)
    {
        // arg : (left, top) ==> 기존 width, height, right, bottom 적용
        // arg : (left, top, width, height) ==> ==> 기존 right, bottom 적용
        // arg : (left, top, width, height, right, bottom)  ==> 입력값으로 적용
        switch (arguments.length)
        {
            case 1:
                return;
            case 2:
                width = this._p_width;
            case 3:
                height = this._p_height;
            case 4:
                right = this._p_right;
            case 5:
                bottom = this._p_bottom;
            default:
                if (width == undefined && right == undefined)
                    (this._p_width != undefined) ? width = this._p_width : right = this._p_right;
                if (height == undefined && bottom == undefined)
                    (this._p_height != undefined) ? height = this._p_height : bottom = this._p_bottom;
                break;
        }

        var horz = 0;
        var vert = 0;

        if (left != null) horz++;
        if (width != null) horz++;
        if (right != null) horz++;
        if (top != null) vert++;
        if (height != null) vert++;
        if (bottom != null) vert++;

        if (horz < 2 || vert < 2)
            return;

        if (left != undefined && width != undefined && right != undefined)
            right = null;
        if (top != undefined && height != undefined && bottom != undefined)
            bottom = null;

        var update = false;

        if (this._p_left != left)
        {
            update = true;
            this._p_left = left;
        }
        if (this._p_top != top)
        {
            update = true;
            this._p_top = top;
        }
        if (this._p_width != width)
        {
            update = true;
            this._p_width = width;
        }
        if (this._p_height != height)
        {
            update = true;
            this._p_height = height;
        }
        if (this._p_right != right)
        {
            update = true;
            this._p_right = right;
        }
        if (this._p_bottom != bottom)
        {
            update = true;
            this._p_bottom = bottom;
        }
        if (update)
            this._parseArrangeInfo(this._p_left, this._p_top, this._p_right, this._p_bottom, this._p_width, this._p_height);

        this._update_position(this._isRtl()); //rtl 의 경우 무조건 업데이트
    };

    _pComponent.resize = function (w, h)
    {
        // 리사이즈에 음수 허용 안함.
        if (w < 0 || h < 0)
            return;

        if (w == this._adjust_width && h == this._adjust_height)
            return;

        if (this._p_width != w || this._p_height != h)
        {
            this._parseArrangeInfoProp("width", w);
            this._parseArrangeInfoProp("height", h);
            this._p_width = w;
            this._p_height = h;

            if (this._p_left != null && this._p_right != null)
                this._setRight(null);
            if (this._p_top != null && this._p_bottom != null)
                this._setBottom(null);
        }

        this._update_position();
    };

    _pComponent.show = function ()
    {
        var parent = this._p_parent;
        if (parent)
        {
            var control_element = this._control_element;
            if (!control_element)
            {
                if (this.createComponent(true))
                    this.on_created(this._getWindow());
            }
            else
            {
                // TODO ControlElement.recreate 같은 인터페이스가 만들어져야 할듯.
                // 또는 element.handle이 이미 존재할 경우 Append하여 재사용하도록 모든 Element에 작업되어야함.
            }

            if (this._isFluidContainer())
            {
                if (!this._isFluidContainerCalculation() && !this._excluded_flex)
                    this._control_element._setElementLayoutPosition();
                this._update_position_fluid(false);
            }
        }
    };

    _pComponent.redraw = function () { };

    _pComponent.setFocus = function (bResetScroll, bInnerFocus)
    {
        var win = this._getRootWindow();
        if (!this.getElement())
            return;
        // Modal 아래에 가려진 컴포넌트인 경우 setFocus 차단.
        var is_active_layer = win._isActiveLayerComponent(this);
        if (!is_active_layer)
            return;

        var focus_direction = this._focus_direction;

        if (this._env._p_enableaccessibility)
        {
            // accessibility focus accept on acessibilityenable
            if (!this._isAccessibilityEnable() && focus_direction > 1 && focus_direction < 4)
            {
                return;
            }
            // 미리 체크할 항목: visiblestate / enablestate / focusacceptable
            if (!this._isVisible() /* || !this._p_enableevent */ || !this._isFocusAcceptable())
                return;
        }
        else
        {
            // 미리 체크할 항목: visiblestate / enablestate / focusacceptable
            if (!this._isVisible() || !this._isEnable() /* || !this._p_enableevent */ || !this._isFocusAcceptable())
                return;
        }

        // 메뉴얼상 Form계열은 false가 default라고 하나..실제 9.2동작은 그렇지 않다. 무조건 true임.
        if (bResetScroll === undefined)
            bResetScroll = true;

        // bContainerFocus
        // true: Container 자신까지만 포커스를 갖도록
        // false: Container 내부 Taborder / LastFocus에 의해 최종 포커스 탐색

        if (bInnerFocus === undefined)
            bInnerFocus = true;

        var bContainerFocus = !bInnerFocus;
        var block_inner, from_child = false;

        if (bContainerFocus)
        {
            // 내가 Container이면 하위 탐색을 하지 않도록함.
            if (this._hasContainer())
            {
                if (this._block_inner_focus)
                    block_inner = true;
                this._block_inner_focus = true;

                // 명시적으로 호출한 경우 LastFocus제거. 상위로 올라갈수 있도록함.
                if (this._last_focused)
                {
                    if (win._indexOfCurrentFocusPaths(this._last_focused) >= 0)
                    {
                        from_child = true;
                        win._removeFromCurrentFocusPath(this._last_focused);
                    }
                    else
                    {
                        this._last_focused = null;
                    }
                }
            }
        }

        // 브라우저에 의해 조절되기 전에 미리 resetScroll처리
        if (bResetScroll)
        {
            var _p = this._p_parent;

            if (_p && _p._is_form && bInnerFocus == true && !this._block_inner_focus)
            {
                if (_p._bFireLoadEvent == true) //form.onloading
                {
                    if (_p._p_parent && _p._p_parent._is_frame && _p._p_parent._window_type == 5)
                    {
                        var _window = _p._getWindow();
                        if (_window && _window._prepared_flag != true)
                        {
                            _p._delayedfocuscomp = this;
                        }
                    }
                }
            }

            // 9.2버젼 대비 스펙 변경사항
            // --> 최종적으로 focus될 말단 컴포넌트가 resetScroll 대상이다.


            var c = this, c_temp, target_comp = this;
            if (!this._block_inner_focus)
            {
                while (c)
                {
                    c_temp = c._getLastFocused();
                    if (!c_temp)
                        c_temp = c._getTabOrderFirst();
                    if (c_temp)
                        target_comp = c_temp;
                    c = c_temp;
                }

                target_comp._resetScrollPos(target_comp,
                    target_comp._adjust_left,
                    target_comp._adjust_top,
                    target_comp._adjust_left + target_comp._adjust_width,
                    target_comp._adjust_top + target_comp._adjust_height, focus_direction);
            }
            else
            {
                nexacro.Component.prototype._resetScrollPos.call(this, this,
                    this._adjust_left,
                    this._adjust_top,
                    this._adjust_left + this._adjust_width,
                    this._adjust_top + this._adjust_height, focus_direction);
            }
        }

        var last_focused = this._find_lastFocused();
        var evt_name = "focus";
        //if (focus_direction >= 0)
        //    evt_name = "tabkey";
        // tabkey 사용시 focus 방향을 evt_name으로 구분
        //focus direction
        //0 - tab
        //1 - shift_tab
        //2 - down_key
        //3 - up_key

        if (focus_direction == 0)
        {
            evt_name = "tabkey";
        }
        else if (focus_direction == 1)
        {
            evt_name = "shifttabkey";
        }
        else if (focus_direction == 2)
        {
            evt_name = "downkey";
        }
        else if (focus_direction == 3)
        {
            evt_name = "upkey";
        }
        //evt_name = this._focus_direction;
        this._focus_direction = -1;

        this._on_focus(true, evt_name);
        if (from_child)
        {
            this._apply_setfocus(evt_name);
        }

        if (this._block_inner_focus && !block_inner)
            this._block_inner_focus = false;

        return last_focused;
    };

    _pComponent.scrollTo = function (x, y)
    {
        if (this._scrolltype == "none")
            return;
        this._scrollTo(x, y);
    };

    _pComponent.scrollBy = function (x, y)
    {
        this._scrollBy(x, y);
    };

    _pComponent.getHScrollPos = function ()
    {
        return this._hscroll_pos;
    };

    _pComponent.getVScrollPos = function ()
    {
        return this._vscroll_pos;
    };

    _pComponent.getDisplayText = function ()
    {
        return this._on_getDisplayText();
    };

    // get componet's position to pixel
    _pComponent.getPixelLeft = function ()
    {
        return this._left;
    };
    _pComponent.getPixelTop = function ()
    {
        return this._top;
    };
    _pComponent.getPixelRight = function ()
    {
        return this._right;
    };
    _pComponent.getPixelBottom = function ()
    {
        return this._bottom;
    };
    _pComponent.getPixelWidth = function ()
    {
        return this._width;
    };
    _pComponent.getPixelHeight = function ()
    {
        return this._height;
    };

    // get componet's offset position to pixel from parent's left/top
    _pComponent.getOffsetLeft = function ()
    {
        return this._adjust_left;
    };
    _pComponent.getOffsetTop = function ()
    {
        return this._adjust_top;
    };
    _pComponent.getOffsetRight = function ()
    {
        return this._adjust_left + this._adjust_width;
    };
    _pComponent.getOffsetBottom = function ()
    {
        return this._adjust_top + this._adjust_height;
    };
    _pComponent.getOffsetWidth = function ()
    {
        return this._adjust_width;
    };
    _pComponent.getOffsetHeight = function ()
    {
        return this._adjust_height;
    };

    _pComponent.setOffsetLeft = function (v)
    {
        return this.set_left(v);
    };
    _pComponent.setOffsetTop = function (v)
    {
        this.set_top(v);
    };
    _pComponent.setOffsetRight = function (v)
    {
        this.set_width((v | 0) - this._adjust_left);
    };
    _pComponent.setOffsetBottom = function (v)
    {
        this.set_height((v | 0) - this._adjust_top);
    };
    _pComponent.setOffsetWidth = function (v)
    {
        this.set_width(v);
    };
    _pComponent.setOffsetHeight = function (v)
    {
        this.set_height(v);
    };

    //===============================================================
    // nexacro.Component : Event Handlers
    //===============================================================
    // wait comp 닫힌 후 내부적으로 포커스 처리등 필요시 사용
    _pComponent._on_afterHideWaitComp = function (status)
    {
        if (this._status != status)
            this._changeStatus(this._status, true);
    };

    _pComponent.on_notify_hscroll_onscroll = function (obj, e)
    {
        this._scrollTo(e.pos, this._vscroll_pos, false, false, e.type, e._evtkind);
    };

    _pComponent.on_notify_vscroll_onscroll = function (obj, e)
    {
        this._scrollTo(this._hscroll_pos, e.pos, false, false, e.type, e._evtkind);
    };

    _pComponent._on_resizer_starttrack = function ()
    {
        const parent = this._p_parent;
        if (parent)
        {
            const resizer = this._p_resizer;
            if (resizer)
                resizer._createGhostControl(this);

            this._resizer_trackinfo = {
                "width": this._adjust_width,
                "height": this._adjust_height
            };
            return true;
        }
        return false;
    };

    _pComponent._on_resizer_movetrack = function (x, y, cursor)
    {
        const parent = this._p_parent;
        if (parent)
            parent.on_apply_cursor(cursor);

        const resizer = this._p_resizer;
        if (resizer)
            resizer._applyCursor(cursor);

        this._resizeByResizer(x, y);
    };

    _pComponent._on_resizer_endtrack = function (x, y)
    {
        const parent = this._p_parent;
        if (parent)
            parent.on_apply_cursor(parent._cursor);

        const resizer = this._p_resizer;
        if (resizer)
        {
            resizer._restoreCursor();
            resizer._destroyGhostControl();
        }
        this._resizeByResizer(x, y, true);
        this._resizer_trackinfo = null;
    };

    //===============================================================
    // nexacro.Component : Stock Methods
    //===============================================================
    _pComponent.on_apply_prop_cssclass = function () { };

    _pComponent.on_apply_prop_enable = function (v)
    {
        if (this._is_scrollable == true)
        {
            if (this._p_vscrollbar)
                this._p_vscrollbar._setEnable(v);
            if (this._p_hscrollbar)
                this._p_hscrollbar._setEnable(v);
        }
    };

    _pComponent.on_apply_prop_taborder = function ()
    {
        if (this._p_tabstop)
            this._setAccessibilityFlagFocusable(true);
    };

    _pComponent.on_apply_prop_tooltip = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var stringrc_prop = this._getStringResourceProperty(this._p_tooltiptext);
            control_elem.setElementToolTip(stringrc_prop ? stringrc_prop : this._p_tooltiptext, this._p_tooltiptype);
        }
        this.on_apply_prop_accessibilitydescription();
        this._updateAccessibilityLabel();
    };

    _pComponent.on_apply_prop_rtl = function ()
    {
        //TODO : set direction attribute at Element's style.
        // calculate component layout.
        if (!nexacro._SupportRTL)
            return;

        this._rtl = this._isRtl();
        var control_elem = this._control_element;
        if (control_elem)
        {
            control_elem.setElementRtl(this._rtl);
        }
    };

    _pComponent.on_apply_prop_stringresource = function ()
    {
        if (!nexacro._StringResource)
            return;

        var comps;

        if (this._p_components)
            comps = this._p_components;
        else if (this._p_form)
            comps = this._p_form._p_components;

        if (comps)
        {
            for (var i = 0; i < comps.length; i++)
            {
                var comp = comps[i];
                comp.on_apply_prop_stringresource();
            };
        };

        this._on_apply_text(this._p_text);
        this.on_apply_prop_tooltip();

        if (this._env._p_enableaccessibility)
        {
            if (this.on_apply_prop_accessibilitylabel)
                this.on_apply_prop_accessibilitylabel();
            if (this.on_apply_prop_accessibilitydescription)
                this.on_apply_prop_accessibilitydescription();
            if (this.on_apply_prop_accessibilityaction)
                this.on_apply_prop_accessibilityaction();
        }
    };

    _pComponent._apply_setfocus = function (evt_name)
    {
        // 가장 말단 element에 focus 호출.
        var control_elem = this._control_element;
        if (control_elem)
        {
            var selffocus = ((evt_name == "lbutton") ? false : this._env._p_enableaccessibility);
            control_elem.setElementFocus(selffocus);
        }
    };

    _pComponent.on_get_popupControlTypeName = function ()
    {
        var rootcomp = this._getRootComponent(this);
        return rootcomp.on_get_css_assumedtypename();
    };

    _pComponent.on_get_prop_tabstop = function ()
    {
        return this._p_tabstop;
    };

    _pComponent._on_getFitSize = function ()
    {
        return [this._adjust_width, this._adjust_height];
    };


    _pComponent._getSizeInfo = function ()
    {
        var size = [0, 0];
        switch (this._p_fittocontents)
        {
            case "width":
                size = this._on_getFitSize();
                size[2] = size[0] = size[0] < 0 ? 0 + "" : size[0] + "";
                size[1] = this._p_height;
                break;
            case "height":
                size = this._on_getFitSize();
                size[0] = this._p_width;
                size[3] = size[1] = size[1] < 0 ? 0 + "" : size[1] + "";
                break;
            case "both":
                size = this._on_getFitSize();
                size[2] = size[0] = size[0] < 0 ? 0 + "" : size[0] + "";
                size[3] = size[1] = size[1] < 0 ? 0 + "" : size[1] + "";
                //minwidth = size[0];
                //minheight = size[1];
                break;
            default:
                /*
                if (objComponent._arrange_info && objComponent._control_element)
                {
                    if ((objComponent._arrange_info.width && objComponent._arrange_info.width.compid) || (objComponent._arrange_info.height && objComponent._arrange_info.height.compid))
                        objComponent._control_element._setElementLayoutBasis(true);
                }
                */
                size[0] = this._p_width;
                size[1] = this._p_height;
                var parent_comp = this._getParentComponent();
                var parent_fittocontents = parent_comp ? parent_comp._p_fittocontents : "none";
                size[1] = this._fit_height = this._getAdjustFitPositionHeight(this._p_height, parent_fittocontents);
                /*
                if (minheight != null && height > minheight)
                    minheight = height;
                */
                size[0] = this._fit_width = this._getAdjustFitPositionWidth(this._p_width, parent_fittocontents);
                /*
                if (minwidth != null && width > minwidth)
                    minwidth = width;
                */
                //}
                break;
        }
        return size;
    };

    _pComponent._on_getFitSize_style = function ()    
    {
        var total_w = 0;
        var total_h = 0;
        var border = this._getCurrentStyleBorder();
        if (border)
        {
            total_w += border._getBorderWidth();
            total_h += border._getBorderHeight();
        }

        var padding = this._getCurrentStylePadding();
        if (padding)
        {
            total_w += padding.left + padding.right;
            total_h += padding.top + padding.bottom;
        }
        return [total_w, total_h];
    };

    _pComponent._on_getFitSize_scroll = function ()    
    {
        var total_w = 0;
        var total_h = 0;
        var fittocontents = this._getFittocontents();
        if (fittocontents == "width")
        {
            var vscrollbar = this ? this._p_vscrollbar : null;
            if (vscrollbar && vscrollbar._p_visible)
            {
                total_w += vscrollbar._adjust_width;
            }
        }

        if (fittocontents == "height")
        {
            var hscrollbar = this ? this._p_hscrollbar : null;
            if (hscrollbar && hscrollbar._p_visible)// && hscrollbar._adjust_top > -1)
            {
                total_h += hscrollbar._adjust_height;
            }
        }
        return [total_w, total_h];
    };

    _pComponent._on_getDisplayText = function ()
    {
        return this._displaytext;
    };
    // GetDlgCode 컴포넌트가 어떤 키를 처리하길 원하는지의 여부 ..
    _pComponent._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        // Ex)
        // want_tab:true    : Tab키를 눌러도 포커스 이동을 하지 않음 (Grid,TextArea)
        // want_return:true : Enter키를 눌러도 DefaultButton 처리를 하지 않음 (Menu,PopupMenu,Grid,TextArea)
        // want_escape:true : ............... EscapeButton 처리를 하지 않음
        // want_chars       : 미사용
        // want_arrows      : 미사용
        // want_touchmove   : touchmove를 직접 제어함 (body 스크롤이 되지 않음)
        //                    scroll이 없는 컴포넌트임에도 body스크롤을 방지하고 싶을때 true.

        return {
            want_tab: false,
            want_return: false,
            want_escape: false,
            want_chars: false,
            want_arrows: false,
            want_touchstart: false,
            want_touchmove: false
        };
    };

    // Bind
    _pComponent.applyto_bindSource = function (propid, Val)
    {
        if (!this._bind_event)
            return true;

        var evt =
        {
            propid: propid,
            val: Val
        };
        var ret = this._bind_event._fireEvent(this, evt);
        return ret;
    };

    _pComponent.on_getBindableProperties = function ()
    {
        return [];
    };

    _pComponent.on_init_bindSource = function (columnid, propid, ds)
    {
        return;
    };

    _pComponent.on_change_bindSource = function (propid, ds, row, col)
    {
        return;
    };

    _pComponent.on_getIDCSSSelector = function ()
    {
        return this._p_name;
    };

    _pComponent.on_get_css_assumedtypename = function ()
    {
        return this._type_name;
    };

    _pComponent.initProperties = nexacro._emptyFn;
    _pComponent.initEvents = nexacro._emptyFn;
    _pComponent._resizePopupInbound = nexacro._emptyFn;
    //_pComponent._restore = nexacro._emptyFn;

    _pComponent._cancelEvent = nexacro._emptyFn;
    _pComponent._applyZoomPopup = nexacro._emptyFn;

    _pComponent._getComponentsByTaborder = nexacro._emptyFn;
    _pComponent._getFormBaseUrl = nexacro._emptyFn;
    _pComponent._getTabOrderNext = nexacro._emptyFn;
    _pComponent._getTabOrderFirst = nexacro._emptyFn;
    _pComponent._getTabOrderLast = nexacro._emptyFn;
    _pComponent._searchNextTabFocus = nexacro._emptyFn;
    _pComponent._searchPrevTabFocus = nexacro._emptyFn;

    _pComponent._getHeadingOrderNext = nexacro._emptyFn;
    _pComponent._getHeadingOrderFirst = nexacro._emptyFn;
    _pComponent._getHeadingOrderLast = nexacro._emptyFn;
    _pComponent._searchNextHeadingFocus = nexacro._emptyFn;
    _pComponent._searchPrevHeadingFocus = nexacro._emptyFn;
    _pComponent._setAccessibilityInfoByHover = nexacro._emptyFn;
    _pComponent._setAccessibilityNotifyEvent = nexacro._emptyFn;

    _pComponent._on_getAccessibilityAdditionalLabel = function ()
    {
        return "";
    };

    _pComponent._on_getAccessibilityAdditionalRole = function ()
    {
        return "";
    };

    _pComponent.on_get_accessibility_label = function ()
    {
        return "";
    };

    _pComponent.on_get_accessibility_description = function ()
    {
        return "";
    };

    _pComponent.on_get_accessibility_action = function ()
    {
        return "";
    };

    _pComponent._getStringResourceProperty = function (v)
    {
        if (v == undefined)
            return;

        if (nexacro._StringResource)
        {
            if (this._p_expr)
                v = nexacro._getTextTemplateValue(this._p_expr);
            else if (v && v.indexOf("TEXT(") > -1)
                v = nexacro._getTextTemplateValue(v);
        }
        return v;
    };

    _pComponent._getAccessibilityRole = nexacro._emptyFn;
    _pComponent._getAccessibilityLabel = nexacro._emptyFn;
    _pComponent._getAccessibilityDescLevel = nexacro._emptyFn;
    _pComponent._getAccessibilityDescription = nexacro._emptyFn;
    _pComponent._getAccessibilityAction = nexacro._emptyFn;
    _pComponent._getAccessibilityReadLabel = nexacro._emptyFn;
    _pComponent._getLinkedLabel = nexacro._emptyFn;
    _pComponent._getLinkedDescription = nexacro._emptyFn;
    _pComponent._getDescLevel = nexacro._emptyFn;
    _pComponent._getLinkedAction = nexacro._emptyFn;
    _pComponent._getAccessibilityParentValue = nexacro._emptyFn;
    _pComponent._getNextAccessibilityOrderIndex = nexacro._emptyFn;

    _pComponent._setAccessibilityRole = nexacro._emptyFn;
    _pComponent._setAccessibilityLabel = nexacro._emptyFn;
    _pComponent._setAccessibilityEnable = nexacro._emptyFn;
    _pComponent._setAccessibilityDescription = nexacro._emptyFn;
    _pComponent._setAccessibilityAction = nexacro._emptyFn;
    _pComponent._setAccessibilityDescLevel = nexacro._emptyFn;
    _pComponent._setAccessibilityStatDisabled = nexacro._emptyFn;
    _pComponent._setAccessibilityStatHidden = nexacro._emptyFn;
    _pComponent._setAccessibilityStatChecked = nexacro._emptyFn;
    _pComponent._setAccessibilityStatPressed = nexacro._emptyFn;
    _pComponent._setAccessibilityStatSelected = nexacro._emptyFn;
    _pComponent._setAccessibilityStatExpanded = nexacro._emptyFn;
    _pComponent._setAccessibilityStatAutoComplete = nexacro._emptyFn;
    _pComponent._setAccessibilityFlagHasPopup = nexacro._emptyFn;
    _pComponent._setAccessibilityFlagFocusable = nexacro._emptyFn;
    _pComponent._setAccessibilityFlagReadOnly = nexacro._emptyFn;
    _pComponent._setAccessibilityFlagPassword = nexacro._emptyFn;
    _pComponent._setAccessibilityFlagMultiSelectable = nexacro._emptyFn;
    _pComponent._setAccessibilityFlagSelectable = nexacro._emptyFn;
    _pComponent._setAccessibilityFlagDefaultButton = nexacro._emptyFn;
    _pComponent._setAccessibilityFlagMultiLine = nexacro._emptyFn;
    _pComponent._setAccessibilityInfoCount = nexacro._emptyFn;
    _pComponent._setAccessibilityInfoIndex = nexacro._emptyFn;
    _pComponent._setAccessibilityInfoValueMax = nexacro._emptyFn;
    _pComponent._setAccessibilityInfoValueMin = nexacro._emptyFn;
    _pComponent._setAccessibilityInfoValueCur = nexacro._emptyFn;
    _pComponent._setAccessibilityInfoLevel = nexacro._emptyFn;
    _pComponent._setAccessibilityHotKey = nexacro._emptyFn;
    _pComponent._setAccessibilityActiveDescendant = nexacro._emptyFn;
    _pComponent._setAccessibilityStatFlag = nexacro._emptyFn;
    _pComponent._setAccessibilityValue = nexacro._emptyFn;
    _pComponent._setAccessibilityStatFocus = nexacro._emptyFn;
    _pComponent._setAccessibilityStatKillFocus = nexacro._emptyFn;
    _pComponent._setAccessibilityStatLive = nexacro._emptyFn;
    _pComponent._updateAccessibilityLabel = nexacro._emptyFn;

    _pComponent._notifyAccessibility = nexacro._emptyFn;

    _pComponent._isAccessibilityEnable = function () { return false; };
    _pComponent._isItemAccessibilityEnable = function () { return false; };
    _pComponent._isAccessibilityRoleHeading = nexacro._emptyFn;
    _pComponent._isComponentKeydownAction = function () { return true; };
    _pComponent._isFireVirtualMouseEvent = function () { return false; }; // 센스리더가 발생하는 가상 마우스 이벤트 체크
    _pComponent._isFireAccessibilityKeydown = function () { return false; }; // 센스리더 가상커서에서 keyup 처리 필요여부 체크
    _pComponent._accessibility_focusin = nexacro._emptyFn; // 스크린리더 가상커서 focus 처리
    _pComponent._accessibility_focusout = nexacro._emptyFn; // 스크린리더 가상커서 focusout 처리
    _pComponent._accessibility_keydown = nexacro._emptyFn; // 스크린리더 keyup 처리 (센스리더용)
    _pComponent._on_create_accessibility_contents = nexacro._emptyFn; // 동적 생성시 create 시점 접근성 처리
    _pComponent._on_created_accessibility_contents = nexacro._emptyFn; // 동적 생성시 created 시점 접근성 처리
    _pComponent._on_attach_accessibility_contents_handle = nexacro._emptyFn; // command 생성시 접근성 처리

    //===============================================================
    // nexacro.Component : Logical Part (Status)
    //===============================================================
    _pComponent._makeStatusMap = function ()
    {
        this._statusmap = { disabled: false, mouseover: false, focused: false, deactivate: false };
        if (this._use_readonly_status)
            this._statusmap.readonly = false;

        this._userstatusmap = {};
        if (this._use_pushed_status)
            this._userstatusmap.pushed = false;

        if (this._use_selected_status)
            this._userstatusmap.selected = false;
    };

    //basic id > cssclass > type
    //component : not supported id selector
    //cssclass > typename
    //control : not supported cssclass selector

    //Static
    //Static.UsrClass
    //StaticControl
    //StaticControl.UsrClass
    _pComponent._makeCSSMapInfo = function ()
    {
        var findcssmap = [];
        var typeselector = this.on_get_css_assumedtypename();

        var mapfortypename = nexacro._dimension_maps[typeselector];
        if (mapfortypename)
        {
            var mapfortypename_self = mapfortypename.self;
            if (mapfortypename_self)
                findcssmap.push(mapfortypename_self);
        }

        var arr_mapfortypename_class;
        if (mapfortypename)
        {
            arr_mapfortypename_class = mapfortypename["class"];
        }

        var cssselectors = this._getClassCSSSelector();
        var len, i, j, jlen, matchcount = 0;
        if (arr_mapfortypename_class && cssselectors)
        {
            len = cssselectors.length;
            jlen = arr_mapfortypename_class.length;
            for (j = 0; j < jlen; j++)
            {
                if (len == matchcount)
                    break;
                var mapfortypename_class = arr_mapfortypename_class[j];
                var mapforclass;
                for (i = 0; i < len; i++)
                {
                    var cssselector = cssselectors[i];
                    if (cssselector)
                    {
                        mapforclass = mapfortypename_class[cssselector.trim()];
                        if (mapforclass)
                        {
                            var mapforclass_self = mapforclass.self;
                            if (mapforclass_self)
                            {
                                findcssmap.push(mapforclass_self);
                            }
                            matchcount++;
                            break;
                        }
                    }
                }
            }
        }

        // id selector
        if (this._is_subcontrol && this._p_parent && this._p_parent._is_component)
        {
            var idselector = this._getIDCSSSelector();
            if (idselector)
            {
                var searchmapdata;
                var mapforid = nexacro._dimension_maps[idselector];
                if (mapforid)
                {
                    searchmapdata = [];
                    searchmapdata.push(mapforid);
                }

                if (mapforid)
                    this._getCSSMapParent()._makeRefCSSMapInfo(findcssmap, searchmapdata, cssselectors);
                /*  not support root idselector */
            }
        }

        var pitem;
        len = findcssmap.length;

        this._cssselector = { enabled: {} };
        var selector = this._cssselector;
        for (i = len - 1; i >= 0; i--)
        {
            var findselector = findcssmap[i];
            for (var status in findselector)
            {
                if (!findselector.hasOwnProperty(status)) continue;
                var item = findselector[status];

                if (nexacro._include_status_map)
                {
                    if (!selector[status])
                        selector[status] = {};
                }

                Object.entries(Object.getOwnPropertyDescriptors(item)).forEach(
                    ([attr, descriptor]) =>
                    {
                        if (selector[status] && selector[status][attr])
                            return;

                        if (!item.hasOwnProperty(attr))
                            return;

                        if (!selector[status])
                            selector[status] = {};

                        if (typeof descriptor.get === 'function')
                        {
                            Object.defineProperty(selector[status], attr, {
                                get: descriptor.get,
                                enumerable: descriptor.enumerable,
                                configurable: descriptor.configurable,
                            });
                        }
                        else
                        {
                            selector[status][attr] = descriptor.value;
                        }
                    }
                );
            }
        }
    };

    _pComponent._getCSSMapParent = function ()
    {
        return this._p_parent;
    };


    /*
    //.Grid .band .row .cell, .Grid .band .row .oddcell
    //.Grid .band .row .cell.UserClass, .Grid .band .row .oddcell.UserClass
    //.Grid .band .row .cell .controledit - display
    //.Grid .band .row .cell.UserClass .controledit, .Grid .band .row .oddcell.UserClass .controledit  - for display
    //Grid .band .cell.UserClass .controledit
    //ListBox .listboxitem
    //ListBox .listboxitem.UserClass
    //ListBox.UserClass .listboxitem
    //ListBox.UserClass .listboxitem.UserClass
    
    // Grid .band .cell
    // Grid .BandControl .cell -> 지원 안함
    // TypeName id  id
    // TypeName.Class id id
    // TypeName id.Class id
    // TypeName.Class id.Class id
    //sub_cssselectors : child의 cssclass
    */
    _pComponent._makeRefCSSMapInfo = function (cssmap, searchmapdata, sub_cssselectors)
    {
        var len, i, j, jlen, matchcount = 0;
        var mapforclass, cssselector;
        var typeselector = this.on_get_css_assumedtypename();
        var idselector = this._getIDCSSSelector();
        var cssselectors = this._getClassCSSSelector();

        var mapforid_parent = searchmapdata.shift();
        var findmaplist = [];
        var mapforid_class = null;

        while (mapforid_parent)
        {
            var _mapforid_parent = mapforid_parent.parent;
            if (_mapforid_parent)
            {
                var mapforid;
                if (idselector)
                {
                    mapforid = _mapforid_parent[idselector];
                    if (mapforid)
                    {
                        findmaplist.push(mapforid);
                        mapforid_class = mapforid["class"];
                        if (mapforid_class && cssselectors)
                        {
                            len = cssselectors.length;
                            for (i = 0; i < len; i++)
                            {
                                cssselector = cssselectors[i];
                                if (cssselector)
                                {
                                    mapforclass = mapforid_class[cssselector.trim()];
                                    if (mapforclass)
                                    {
                                        findmaplist.push(mapforclass);
                                    }
                                }
                            }
                        }
                    }
                }

                var mapfortypename = _mapforid_parent[typeselector];

                if (mapfortypename)
                {
                    var mapfortypename_self = mapfortypename.self;
                    if (mapfortypename_self)
                    {
                        cssmap.push(mapfortypename_self);
                    }

                    var arr_mapfortypename_class = mapfortypename["class"];
                    if (arr_mapfortypename_class && cssselectors)
                    {
                        len = cssselectors.length;
                        jlen = arr_mapfortypename_class.length;
                        matchcount = 0;
                        for (j = 0; j < jlen; j++)
                        {
                            if (len == matchcount)
                                break;

                            var mapfortypename_class = arr_mapfortypename_class[j];
                            for (i = 0; i < len; i++)
                            {
                                cssselector = cssselectors[i];
                                if (cssselector)
                                {
                                    mapforclass = mapfortypename_class[cssselector.trim()];
                                    if (mapforclass && mapforclass.self)
                                    {
                                        cssmap.push(mapforclass.self);
                                        matchcount++;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            var arr_mapforid_class = mapforid_parent["class"];
            if (arr_mapforid_class && sub_cssselectors)
            {
                jlen = arr_mapforid_class.length;
                len = sub_cssselectors.length;
                matchcount = 0;
                for (j = 0; j < jlen; j++)
                {
                    if (len == matchcount)
                        break;
                    for (i = 0; i < len; i++)
                    {
                        cssselector = sub_cssselectors[i];
                        if (cssselector)
                        {
                            mapforid_class = arr_mapforid_class[j];
                            mapforclass = mapforid_class[cssselector.trim()];
                            if (mapforclass && mapforclass.parent)
                            {
                                var mapforclass_parent_id = mapforclass.parent[idselector];
                                if (mapforclass_parent_id)
                                {
                                    findmaplist.push(mapforclass_parent_id);
                                    matchcount++;
                                }
                                else if (!this._is_subcontrol)
                                {
                                    cssmap.push(mapforclass.parent[typeselector].self);
                                }
                            }
                        }
                    }
                }
            }

            mapforid_parent = searchmapdata.shift();
        }

        var parent = this._getCSSMapParent();
        if (findmaplist.length > 0 && parent && parent._is_component)
        {
            parent._makeRefCSSMapInfo(cssmap, findmaplist, cssselectors);
        }
    };

    _pComponent._setControlElementCssSelector = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            // typename
            control_elem.setElementTypeCSSSelector(this.on_get_css_assumedtypename());

            //id
            if (this._is_subcontrol)
            {
                // .Tab .spinbutton and Spin .spinbutton distinction
                //  Tab을 포함한 Form Component에 한해 바로 하위의 subcontrol 만 id 변경해서 처리
                // .Tab .spinbuttonTab
                // .Tab .tabbuttonitemTab .extrabutton
                // .Tab .tabpageTab
                // .Tab.CLSA .spinbuttonTabCLSA
                //  tab multiclass : .Tab .spinbuttonTabCLSA .spinbuttonTabCLSB
                // .Div .vscrollbarDiv .incbutton
                // .VScrollBarControl .incbutton
                var idselector = this.on_getIDCSSSelector();
                var _p = this._p_parent;
                if (_p && !_p._is_subcontrol && (_p._is_container || _p._is_containerset || _p._is_form || _p._is_frame))
                {
                    idselector = idselector + _p.on_get_css_assumedtypename();
                    var parentidselector = idselector;
                    var parentcssclass = _p._getClassCSSSelector();
                    if (parentcssclass)
                    {
                        var len = parentcssclass.length;
                        idselector = parentidselector + " ";
                        for (var i = 0; i < len; i++)
                        {
                            idselector += parentidselector + parentcssclass[i];
                            if ((i + 1) < len)
                                idselector += " ";
                        }
                    }
                }

                control_elem.setElementIDCSSSelector(idselector);
            }
            else
            {
                control_elem.setElementIDCSSSelector(this._getIDCSSSelector());
            }

            //cssclass
            var cssclass = this._getElementClassCSSSelector();
            if (cssclass)
                control_elem.setElementClassCSSSelector(cssclass.join(" "));
            else
                control_elem.setElementClassCSSSelector("");

            return true;
        }

        return false;
    };

    _pComponent._setControlElementCssMapInfo = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var enabledselector = this._cssselector.enabled;
            if (enabledselector)
            {
                var edge = enabledselector.edge;
                if (edge && this._rtl && enabledselector.rtlEdgeImage)
                    edge = enabledselector.rtlEdgeImage;
                this._control_element.setElementCSSMapInfo(enabledselector.border, enabledselector.padding, edge);
            }
        }
    };

    //status : enable, disabled, focused, mouseover
    _pComponent._changeStatus = function (status, value)
    {
        this._on_changeStatus(status, value);
    };

    _pComponent.on_changeStatus = function (changestatus, value, applystatus, currentstatus, currentuserstatus)
    {
        return applystatus;
    };

    //disabled > mouseover > focused > deactivate > readonly > enable
    //우선순위 변경 disabled > readonly > mouseover > focused > deactivate >  enable
    _pComponent._on_changeStatus = function (status, value)
    {
        if (!this._is_alive)
            return;

        this._oldstatus = this._status;
        var applystatus = "enabled";

        this._statusmap[status] = value;
        var statusmap = this._statusmap;
        if (statusmap.disabled)
            applystatus = "disabled";
        else if (statusmap.readonly && this._use_readonly_status)
            applystatus = "readonly";
        else if (statusmap.mouseover)
            applystatus = "mouseover";
        else if (statusmap.focused)
            applystatus = "focused";
        else if (statusmap.deactivate)
            applystatus = "deactivate";

        //this._status = applystatus;
        this._status = this.on_changeStatus(status, value, applystatus, this._status, this._userstatus);

        //폼에서 마우스 다운후 드래그해서 버튼위로 올라갔을때
        if (this._status == "mouseover" && nexacro._cur_track_info)
        {
            this._status = this._oldstatus;
            statusmap.mouseover = false;
            return;
        }

        if (this._oldstatus != this._status)
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus, undefined, status, value);

        if (this._env._p_enableaccessibility)
            this._setAccessibilityStatFlag(this._status, this._userstatus);
    };

    //userstatus :  pushed > selectedreadonly >  selected > readonly
    _pComponent._changeUserStatus = function (changestatus, value)
    {

        return this._on_changeUserStatus(changestatus, value);
    };

    _pComponent.on_changeUserStatus = function (changestatus, value, applyuserstatus, currentstatus, currentuserstatus)
    {
        return applyuserstatus;
    };

    _pComponent._on_changeUserStatus = function (status, value)
    {
        this._olduserstatus = this._userstatus;
        var applystatus = "";

        this._userstatusmap[status] = value;
        var statusmap = this._userstatusmap;

        if (this._use_pushed_status && statusmap.pushed)
            applystatus = "pushed";
        else if (this._use_selected_status && statusmap.selected)
            applystatus = "selected";

        this._userstatus = this.on_changeUserStatus(status, value, applystatus, this._status, this._userstatus);
        if (this._olduserstatus != this._userstatus)
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus, undefined, status, value);

        this._setAccessibilityStatFlag(this._status, this._userstatus);
    };

    _pComponent.on_apply_status = function (status, userstatus, status_param, value_param) { };

    _pComponent._on_apply_status = function (oldstatus, status, olduserstatus, userstatus, apply, status_param, value_param, applycssstatus, applycssuserstatus)
    {
        if (apply || (oldstatus != status) || (olduserstatus != userstatus))
            this.on_apply_status(status, userstatus, status_param, value_param);

        var control_elem = this._control_element;
        if (control_elem)
        {
            if (oldstatus != status)
            {
                control_elem.setElementStatus(applycssstatus);
            }

            if (olduserstatus != userstatus || applycssuserstatus === "")
            {
                control_elem.setElementUserStatus(applycssuserstatus);
            }
        }
    };

    _pComponent._apply_status = function (oldstatus, status, olduserstatus, userstatus, apply, status_param, value_param)
    {
        // parent에서 enable 설정 시, _real_enable check 안함
        var enable = (nexacro._is_enable_setting) ? this._p_enable : this._p_enable && this._real_enable;

        var form;
        if (!this._is_frame || (this._is_frame && !this._is_popup_frame))
            form = this._p_parent;

        while (form != null)    // parent가 enable이 변경 -> this의 real_enable이 설정되기 전
        {
            if (!form._is_frame || (form._is_frame && !form._is_popup_frame))
            {
                if (form._is_subcontrol == false)
                {
                    if (form._real_enable == false || form._p_enable == false)
                    {
                        enable = false;
                        break;
                    }
                }
                form = form._p_parent;
            }
            else
            {
                break;
            }
        }

        if (this._setEnable(enable))
            return;

        this._apply_status_toelement(oldstatus, status, olduserstatus, userstatus, apply, status_param, value_param);
    };

    _pComponent._apply_status_toelement = function (oldstatus, status, olduserstatus, userstatus, apply, status_param, value_param)
    {
        var control_elem = this._control_element;
        if (this._p_visible && control_elem)
        {
            //disabled disabled_selected selected
            var multistatus = "";
            if (status != "enabled" && status && userstatus)
                multistatus = status + "_" + userstatus;

            var settingstatus = false;
            var settinguserstatus = false;

            var border = null;
            var padding = null;
            var edge = null;

            // multistatus >  status > userstatus > enabled ==>	change to //multistatus > disabled(status) > userstatus > status > enable
            var cssselector;
            if (multistatus)
            {
                cssselector = this._cssselector[multistatus];
                if (cssselector)
                {
                    settingstatus = true;
                    settinguserstatus = true;

                    border = cssselector.border;
                    padding = cssselector.padding;
                    edge = cssselector.edge;
                }
            }

            var disabled_status = false;
            if (status === "disabled")
            {
                disabled_status = true;
                cssselector = this._cssselector[status];
                if (cssselector)
                {
                    settingstatus = true;

                    if (!border) border = cssselector.border;
                    if (!padding) padding = cssselector.padding;
                    if (!edge) edge = cssselector.edge;
                }
            }

            if (userstatus)
            {
                cssselector = this._cssselector[userstatus];
                if (cssselector)
                {
                    settinguserstatus = true;
                    if (!border) border = cssselector.border;
                    if (!padding) padding = cssselector.padding;
                    if (!edge) edge = cssselector.edge;
                }
            }

            if (!disabled_status && status != "enabled")
            {
                cssselector = this._cssselector[status];
                if (cssselector)
                {
                    settingstatus = true;

                    if (!border) border = cssselector.border;
                    if (!padding) padding = cssselector.padding;
                    if (!edge) edge = cssselector.edge;
                }
            }

            var enableselector = this._cssselector.enabled;
            if (!border) border = enableselector.border;
            if (!padding) padding = enableselector.padding;
            if (!edge) edge = enableselector.edge;

            if (edge && this._isRtl() && enableselector.rtlEdgeImage)
                edge = enableselector.rtlEdgeImage;

            control_elem.setElementCSSMapInfo(border, padding, edge);

            var applycssstatus = status;
            var applycssuserstatus = userstatus;

            if (nexacro._include_status_map)
            {
                applycssstatus = (settingstatus ? status : "");
                applycssuserstatus = (settinguserstatus ? userstatus : "");
            }

            this._on_apply_status(oldstatus, status, olduserstatus, userstatus, apply, status_param, value_param, applycssstatus, applycssuserstatus);
        }
    };

    _pComponent._setTablecellarea = function (v)
    {
        // TODO2 validation 필요해보임
        if (this._tablecellarea !== v)
        {
            this._tablecellarea = v;
            var control_elem = this.getElement();
            if (control_elem)
                control_elem.setElementTableCellArea(v);
            //this._tablecellarea = v;
        }
    };

    _pComponent._getCurrentLayoutTablecellarea = function ()
    {
        return this._tablecellarea ? this._tablecellarea : this._p_tablecellarea;
    };


    //===============================================================
    // nexacro.Component : Logical Part (Position)
    //===============================================================
    _pComponent._adjustPosition = function ()
    {
        var parent = this._is_group ? this._group_panel : this._p_parent ? this._p_parent : this._getForm();
        var parent_comp = this._is_innerform ? this._p_parent : this._getParentComponent();
        var fittocontents = this._p_fittocontents;
        var info = this._arrange_info;
        var target1, target2;

        var left = this._left;
        var top = this._top;
        var right = this._right;
        var bottom = this._bottom;
        var width = this._width;
        var height = this._height;

        var minwidth = this._minwidth;
        var maxwidth = this._maxwidth;
        var minheight = this._minheight;
        var maxheight = this._maxheight;

        //로직 개선
        var p_width = parent ? parent._getClientWidth() : 0;
        var p_height = parent ? parent._getClientHeight() : 0;
        var parent_fittocontents = parent_comp ? parent_comp._p_fittocontents : "none";

        /*
        var parent_comp = parent ? parent._p_parent : null;
        if (parent_comp && parent_comp._default_width > -1)
            p_width = parent_comp._default_width;
        if (parent_comp && parent_comp._default_height > -1)
            p_height = parent_comp._default_height;
        */

        var calc_pos;
        var calc_left = 0, calc_top = 0, calc_right = 0, calc_bottom = 0, calc_width = 0, calc_height = 0;

        //horz
        if (left != null)
        {
            if (info && (target1 = this._getArrangeComp("left")))
                calc_pos = target1._adjust_left + target1._adjust_width;
            else
                calc_pos = 0;

            calc_left = calc_pos + left;

            if (right != null)
            {
                if (info && (target2 = this._getArrangeComp("right")))
                    calc_pos = target2._adjust_left;
                else
                    calc_pos = p_width;

                if (fittocontents == "width" || fittocontents == "both")
                    calc_right = calc_left + width;
                else
                    calc_right = calc_pos - right;

                if (!target1 && target2)
                {
                    if (minwidth != null && ((calc_right - calc_left) < minwidth))
                        calc_left = calc_right - minwidth;
                    else if (maxwidth != null && ((calc_right - calc_left) > maxwidth))
                        calc_left = calc_right - maxwidth;
                }
            }
            else
            {
                calc_right = calc_left + width;
            }
        }
        else
        {
            if (info && (target2 = this._getArrangeComp("right")))
                calc_pos = target2._adjust_left;
            else
                calc_pos = p_width;

            calc_right = calc_pos - right;
            calc_left = calc_right - width;

            if (minwidth != null && (width < minwidth))
                calc_left = calc_right - minwidth;
            else if (maxwidth != null && (width > maxwidth))
                calc_left = calc_right - maxwidth;
        }

        //vert
        if (top != null)
        {
            if (info && (target1 = this._getArrangeComp("top")))
                calc_pos = target1._adjust_top + target1._adjust_height;
            else
                calc_pos = 0;

            calc_top = calc_pos + top;

            if (bottom != null)
            {
                if (info && (target2 = this._getArrangeComp("bottom")))
                    calc_pos = target2._adjust_top;
                else if ((parent_fittocontents == "both" || parent_fittocontents == "height") && parent_comp._basis_height)
                {
                    calc_pos = parent_comp._basis_height;
                }
                else
                    calc_pos = p_height;

                if (fittocontents == "height" || fittocontents == "both")
                    calc_bottom = calc_top + height;
                else
                    calc_bottom = calc_pos - bottom;

                if (!target1 && target2)
                {
                    if (minheight != null && ((calc_bottom - calc_top) < minheight))
                        calc_top = calc_bottom - minheight;
                    else if (maxheight != null && ((calc_bottom - calc_top) > maxheight))
                        calc_top = calc_bottom - maxheight;
                }
            }
            else
            {
                calc_bottom = calc_top + height;
            }
        }
        else
        {
            if (info && (target2 = this._getArrangeComp("bottom")))
                calc_pos = target2._adjust_top;
            else
                calc_pos = p_height;

            calc_bottom = calc_pos - bottom;
            calc_top = calc_bottom - height;

            if (minheight != null && (height < minheight))
                calc_top = calc_bottom - minheight;
            else if (maxheight != null && (height > maxheight))
                calc_top = calc_bottom - maxheight;
        }

        //adjust_width
        calc_width = calc_right - calc_left;
        if (calc_width < 0)
            calc_width = 0;

        if (minwidth != null && (calc_width < minwidth))
            calc_width = (minwidth < 0) ? 0 : minwidth;
        else if (maxwidth != null && (calc_width > maxwidth))
            calc_width = (maxwidth < 0) ? 0 : maxwidth;

        //adjust_height
        calc_height = calc_bottom - calc_top;
        if (calc_height < 0)
            calc_height = 0;

        if (minheight != null && (calc_height < minheight))
            calc_height = (minheight < 0) ? 0 : minheight;
        else if (maxheight != null && (calc_height > maxheight))
            calc_height = (maxheight < 0) ? 0 : maxheight;

        // set adjust pos
        this._setAdjustProps(calc_left, calc_top, calc_width, calc_height);
    };

    _pComponent._setLeft = function (propVal)
    {
        if (propVal === "")
            propVal = null;

        if (this._p_left != propVal)
        {
            this._p_left = propVal;
            this._parseArrangeInfoProp("left", propVal);

            if (propVal == null)
            {
                if (this._p_width == null)
                {
                    this._setWidth(this._adjust_width);
                }
                else if (this._p_right == null)
                {
                    var right = this._p_parent._adjust_width - (this._adjust_left + this._adjust_width);
                    this._setRight(right);
                }
            }
            else
            {
                if (this._p_right != null && this._p_width != null)
                    this._setRight(null);
            }
        }
    };

    _pComponent._setTop = function (propVal)
    {
        if (propVal === "")
            propVal = null;

        if (this._p_top != propVal)
        {
            this._p_top = propVal;
            this._parseArrangeInfoProp("top", propVal);

            if (propVal == null)
            {
                if (this._p_height == null)
                {
                    this._setHeight(this._adjust_height);
                }
                else if (this._p_bottom == null)
                {
                    var bottom = this._p_parent._adjust_height - (this._adjust_top + this._adjust_height);
                    this._setBottom(bottom);
                }
            }
            else
            {
                if (this._p_bottom != null && this._p_height != null)
                    this._setBottom(null);
            }
        }
    };

    _pComponent._setRight = function (propVal)
    {
        if (propVal === "")
            propVal = null;

        if (this._p_right != propVal)
        {
            this._p_right = propVal;
            this._parseArrangeInfoProp("right", propVal);

            if (propVal == null)
            {
                if (this._p_width == null)
                    this._setWidth(this._adjust_width);
                else if (this._p_left == null)
                    this._setLeft(this._adjust_left);
            }
            else
            {
                if (this._p_left != null && this._p_width != null)
                    this._setWidth(null);
            }
        }
    };

    _pComponent._setBottom = function (propVal)
    {
        if (propVal === "")
            propVal = null;

        if (this._p_bottom != propVal)
        {
            this._p_bottom = propVal;
            this._parseArrangeInfoProp("bottom", propVal);

            if (propVal == null)
            {
                if (this._p_height == null)
                    this._setHeight(this._adjust_height);
                else if (this._p_top == null)
                    this._setTop(this._adjust_top);
            }
            else
            {
                if (this._p_top != null && this._p_height != null)
                    this._setHeight(null);
            }
        }
    };

    _pComponent._setWidth = function (propVal)
    {
        //trace("_setWidth",propVal)
        //nexacro._traceV8CallStack();
        if (propVal === "")
            propVal = null;

        if (this._p_width != propVal)
        {
            this._p_width = propVal;
            this._parseArrangeInfoProp("width", propVal);

            if (propVal == null)
            {
                if (this._p_left == null)
                {
                    this._setLeft(this._adjust_left);
                }
                else if (this._p_right == null)
                {
                    var right = this._p_parent._adjust_width - (this._adjust_left + this._adjust_width);
                    this._setRight(right);
                }
            }
            else
            {
                if (this._p_left != null && this._p_right != null)
                    this._setRight(null);
            }
        }
    };

    _pComponent._setHeight = function (propVal)
    {
        if (propVal === "")
            propVal = null;

        if (this._p_height != propVal)
        {
            this._p_height = propVal;
            this._parseArrangeInfoProp("height", propVal);

            if (propVal == null)
            {
                if (this._p_top == null)
                {
                    this._setTop(this._adjust_top);
                }
                else if (this._p_bottom == null)
                {
                    var bottom = this._p_parent._adjust_height - (this._adjust_top + this._adjust_height);
                    this._setBottom(bottom);
                }
            }
            else
            {
                if (this._p_top != null && this._p_bottom != null)
                    this._setBottom(null);
            }
        }
    };

    _pComponent._setMinwidth = function (v)
    {
        if (v != null && isNaN(parseInt(v)))
            return;

        if (this._p_minwidth != v)
        {
            if (v == null)
            {
                this._p_minwidth = null;
                this._minwidth = null;
            }
            else
            {
                this._p_minwidth = v;
                this._minwidth = parseInt(v);
            }

            if ((v && this._p_maxwidth) && (this._minwidth > this._maxwidth))
            {
                this._setMaxwidth(this._minwidth);
            }
        }
    };

    _pComponent._setMaxwidth = function (v)
    {
        if (v != null && isNaN(parseInt(v)))
            return;

        if (this._p_maxwidth != v)
        {
            if (v == null)
            {
                this._p_maxwidth = null;
                this._maxwidth = null;
            }
            else
            {
                this._p_maxwidth = v;
                this._maxwidth = parseInt(v);
            }

            if ((v && this._p_minwidth) && (this._maxwidth < this._minwidth))
            {
                this._setMinwidth(this._maxwidth);
            }
        }
    };

    _pComponent._setMinheight = function (v)
    {
        if (v != null && isNaN(parseInt(v)))
            return;

        if (this._p_minheight != v)
        {
            if (v == null)
            {
                this._p_minheight = null;
                this._minheight = null;
            }
            else
            {
                this._p_minheight = v;
                this._minheight = parseInt(v);
            }

            if ((v && this._p_maxheight) && (this._minheight > this._maxheight))
            {
                this._setMaxheight(this._minheight);
            }
        }
    };

    _pComponent._setMaxheight = function (v)
    {
        if (v != null && isNaN(parseInt(v)))
            return;

        if (this._p_maxheight != v)
        {
            if (v == null)
            {
                this._p_maxheight = null;
                this._maxheight = null;
            }
            else
            {
                this._p_maxheight = v;
                this._maxheight = parseInt(v);
            }

            if ((v && this._p_minheight) && (this._maxheight < this._p_minheight))
            {
                this._setMinheight(this._maxheight);
            }
        }
    };

    _pComponent.on_update_position = function (resize_flag, move_flag, update)
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            if (move_flag)
            {
                control_elem.setElementPosition(this._adjust_left, this._adjust_top);
                this.on_fire_onmove(this._adjust_left, this._adjust_top);
            }
            if (resize_flag || update)
            {
                control_elem.setElementSize(this._adjust_width, this._adjust_height, update);
                if (resize_flag)
                    this.on_fire_onsize(this._adjust_width, this._adjust_height);
            }
        }
    };

    _pComponent._update_position = function (isrtl)
    {
        if (this._is_subcontrol)
        {
            this._update_position_static(isrtl);

        }
        else
        {
            //this._is_calculated = false;
            if (this._is_container)
                this._calcBasisSize();
            if (this._isFluidContainer())
            {
                this._setContainerCalcedContainer(false);
                if (this._is_created)
                    this._update_position_fluid(false);
            }
            else
            {
                this._update_position_static(isrtl);
            }
        }
    };
    _pComponent._update_position_static = function (isrtl)
    {
        var old_left = this._adjust_left;
        var old_top = this._adjust_top;
        var old_width = this._adjust_width;
        var old_height = this._adjust_height;
        var update = false;
        var bsize = false, bmove = false;

        this._calcArrangePosition();
        this._adjustPosition();

        if (this._adjust_width != old_width || this._adjust_height != old_height)
        {
            bsize = true;

            if (old_width == 0 || old_height == 0)
                update = true;
        }
        if (this._adjust_left != old_left || this._adjust_top != old_top)
        {
            bmove = true;
        }

        this.on_update_position(bsize, bmove, bmove ? false : isrtl);

        if (update)
        {
            this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);
        }
    };
    _pComponent._update_position_fluid = function (isAllContainer)
    {
        var manager = nexacro._getLayoutManager();
        if (manager)
        {
            var old_width = this.getOffsetWidth();
            var old_height = this.getOffsetHeight();
            /*
            if (this._p_fittocontents != "none")
            {
                var control_elem = this.getElement();
                if (control_elem)
                {
                    var layoutbasis = this._getLayoutBasis();
                    if (layoutbasis)
                        control_elem._setElementLayoutBasis(layoutbasis);
                }   
            }
            */
            if (isAllContainer)
            {
                // 폼을 알수없거나 전체 화면 갱신이 필요할때 사용
                manager.calcFluidLayoutContents();
            }
            else
            {
                var container;
                if (this._is_group && this._group_panel)
                {
                    container = this._group_panel;
                }
                else
                    container = this._getForm();
                if (container && container._is_created)
                    manager.calcFluidLayoutContents(container);
            }

            var new_width = this.getOffsetWidth();
            var new_height = this.getOffsetHeight();
            if (old_width != new_width || old_height != new_height)
            {
                //trace("_update_position_fluid",this.id, this.parent.id, old_width,new_width, old_height, new_height)
                this._update_layoutbasis();
            }

            if (this.getOffsetWidth() != old_width || this.getOffsetHeight() != old_height)
            {
                this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);
            }
        }
    };
    //em, rem 기준 Absolute unit Font 찾기
    _pComponent._getReferenceAbsoluteFont = function (target_font)
    {
        var comp = null;
        var ret_font = null, font = null;

        if (!target_font)
        {
            // self
            if (this["font"])
            {
                target_font = this._getSettedFontObject();
            }
            else
            {
                target_font = this._getCSSStyleValue("font");
            }
        }

        font = target_font;

        if (!font)
        {
            if (this._isMainFrame() || this._is_popup_frame)
            {
                ret_font = nexacro._getSystemFont();
            }
            else
            {
                // find inherit font
                if (this._is_group)
                {
                    comp = this._group_panel;
                }
                else
                {
                    comp = this._p_parent
                }

                if (comp && comp._is_component)
                {
                    ret_font = comp._getReferenceAbsoluteFont();
                }
            }
        }
        else
        {
            if (font._unit == "rem" || font._unit == "em")
            {
                // find absolute unit (px)
                if (font._unit == "rem")
                {
                    comp = this._getMainFrame();
                }
                else
                {
                    if (this._is_group)
                    {
                        comp = this._group_panel;
                    }
                    else
                    {
                        comp = this._p_parent;
                    }
                }

                if (comp && comp._is_component)
                {
                    ret_font = comp._getReferenceAbsoluteFont();
                }
            }
            else if (font._unit == "px" || font._unit == "pt")
            {
                // not find absolute unit
                ret_font = font;
            }
        }

        return ret_font;
    };
    // (%, em, rem) to px 처리
    _pComponent._convToPixel = function (val, parent_size)
    {
        var calc_val = null;
        if (typeof (val) == "string")
        {
            if (val.indexOf("%") >= 0)
            {
                calc_val = (parent_size * parseFloat(val)) / 100;
            }
            else if (val.indexOf("rem") >= 0 || val.indexOf("em") >= 0)
            {
                calc_val = parseFloat(val);
                if (val.indexOf("pt") >= 0)
                {
                    calc_val = calc_val * (100 / 75);
                }

                calc_val = parent_size * calc_val;
            }
        }

        return (calc_val === null) ? (parseInt(val) | 0) : calc_val;
    };
    // px to (%, em, rem) 처리
    _pComponent._convToRelativeUnit = function (val, parent_size, unit)
    {
        var calc_val = null;
        if (typeof (val) == "number")
        {
            if (unit == "%")
            {
                calc_val = (parseFloat(val) * 100) / parent_size;
            }
            else if (unit == "rem" || unit == "em")
            {
                calc_val = parseFloat(val) / parent_size;
            }
        }

        return (calc_val === null) ? (parseFloat(val) | 0) : calc_val;
    };

    _pComponent._parseArrangeVal = function (val)
    {
        var info = null;

        if (val && typeof val == "string")
        {
            var arr = val.split(":");

            if (arr.length == 2)
            {
                if (!isNaN(parseFloat(arr[1])))
                    info = { compid: arr[0], distance: arr[1] };
            }
            else if (val.indexOf("%") >= 0)
            {
                if (!isNaN(parseFloat(val)))
                    info = { compid: null, distance: val };
            }
            else if (val.indexOf("rem") >= 0 || val.indexOf("em") >= 0)
            {
                if (!isNaN(parseFloat(val)))
                    info = { compid: null, distance: val };
            }
        }
        return info;
    };

    _pComponent._parseArrangeInfoProp = function (prop_name, val)
    {
        var info_obj = this._arrange_info;
        var info;

        if (val != undefined)
        {
            if (!info_obj)
                info_obj = {};

            info = this._parseArrangeVal(val);
            if (info)
            {
                info_obj[prop_name] = info;
            }
            else
            {
                info_obj[prop_name] = undefined;
                delete info_obj[prop_name];
            }

        }
        else
        {
            if (info_obj)
            {
                info_obj[prop_name] = undefined;
                delete info_obj[prop_name];
            }
        }

        if (info_obj)
        {
            this._arrange_info = info_obj;

            for (info in info_obj)
                break;

            if (!info)
                this._arrange_info = null;
        }
    };

    _pComponent._parseArrangeInfo = function (left, top, right, bottom, width, height)
    {
        if (left == undefined && top == undefined && right == undefined && bottom == undefined && width == undefined && height == undefined)
        {
            this._arrange_info = null;
            return;
        }

        var info;
        var info_obj = {};

        if (left && (info = this._parseArrangeVal(left)))
            info_obj.left = info;
        if (top && (info = this._parseArrangeVal(top)))
            info_obj.top = info;
        if (right && (info = this._parseArrangeVal(right)))
            info_obj.right = info;
        if (bottom && (info = this._parseArrangeVal(bottom)))
            info_obj.bottom = info;
        if (width && (info = this._parseArrangeVal(width)))
            info_obj.width = info;
        if (height && (info = this._parseArrangeVal(height)))
            info_obj.height = info;

        this._arrange_info = info_obj;

        for (info in this._arrange_info)
            break;

        if (!info)
            this._arrange_info = null;
    };

    _pComponent._calcArrangePosition = function ()
    {
        var info = this._arrange_info;
        var form = this._is_subcontrol ? this._p_parent : this._is_group ? this._group_panel : this._getForm();
        var comp, comp_width, comp_height, obj, parsePosition;
        //var parent_comp = form ? form._p_parent : null;
        var parent_comp = this._getParentComponent();

        var size;
        var fittocontents = this._p_fittocontents;
        if (fittocontents != "none")
            size = this._on_getFitSize();

        var refer_font, distance;
        if (info && (obj = info.left))
        {
            if (form && form._is_created_contents)   // 초기 loading중일 때 .left 등 설정 안함.
            {
                distance = obj.distance;
                comp = this._findComponentForArrange(obj.compid);
                if (!comp)
                {
                    if (distance.indexOf("rem") > -1 || distance.indexOf("em") > -1)
                    {
                        comp = this;
                        if (distance.indexOf("rem") > -1)
                        {
                            comp = this._getMainFrame();
                        }

                        refer_font = comp._getReferenceAbsoluteFont();
                        comp_width = refer_font ? refer_font._size : 1;
                    }
                    else
                    {
                        if (parent_comp._p_fittocontents == "width" || parent_comp._p_fittocontents == "both")
                        {
                            comp_width = parent_comp._basis_width;
                        }
                        else
                        {
                            comp = form;
                            comp_width = comp._getClientWidth();
                        }
                    }
                }
                else
                {
                    comp_width = comp._adjust_width;
                }

                this._left = this._convToPixel(distance, comp_width);
            }
        }
        else
        {
            if (this._p_left != null)
                this._left = isNaN(parsePosition = parseFloat(this._p_left)) ? this._left : parsePosition;
            else
                this._left = null;
        }

        if (info && (obj = info.top))
        {
            if (form && form._is_created_contents)
            {
                distance = obj.distance;
                comp = this._findComponentForArrange(obj.compid);
                if (!comp)
                {
                    if (distance.indexOf("rem") > -1 || distance.indexOf("em") > -1)
                    {
                        comp = this;
                        if (distance.indexOf("rem") > -1)
                        {
                            comp = this._getMainFrame();
                        }

                        refer_font = comp._getReferenceAbsoluteFont();
                        comp_height = refer_font ? refer_font._size : 1;
                    }
                    else
                    {
                        if (parent_comp._p_fittocontents == "height" || parent_comp._p_fittocontents == "both")
                        {
                            comp_height = parent_comp._basis_height;
                        }
                        else
                        {
                            comp = form;
                            comp_height = comp._getClientHeight();
                        }
                    }
                }
                else
                {
                    comp_height = comp._adjust_height;
                }

                this._top = this._convToPixel(distance, comp_height);
            }
        }
        else
        {
            if (this._p_top != null)
                this._top = isNaN(parsePosition = parseFloat(this._p_top)) ? this._top : parsePosition;
            else
                this._top = null;
        }

        if (info && (obj = info.right))
        {
            if (form && form._is_created_contents)
            {
                distance = obj.distance;
                comp = this._findComponentForArrange(obj.compid);
                if (!comp)
                {
                    if (distance.indexOf("rem") > -1 || distance.indexOf("em") > -1)
                    {
                        comp = this;
                        if (distance.indexOf("rem") > -1)
                        {
                            comp = this._getMainFrame();
                        }

                        refer_font = comp._getReferenceAbsoluteFont();
                        comp_width = refer_font ? refer_font._size : 1;
                    }
                    else
                    {
                        if (parent_comp._p_fittocontents == "width" || parent_comp._p_fittocontents == "both")
                        {
                            comp_width = parent_comp._basis_width;
                        }
                        else
                        {
                            comp = form;
                            comp_width = comp._getClientWidth();
                        }
                    }
                }
                else
                {
                    comp_width = comp._adjust_width;
                }

                this._right = this._convToPixel(distance, comp_width);
            }
        }
        else
        {
            if (this._p_right != null)
                this._right = isNaN(parsePosition = parseFloat(this._p_right)) ? this._right : parsePosition;
            else
                this._right = null;
        }

        if (info && (obj = info.bottom))
        {
            if (form && form._is_created_contents)
            {
                distance = obj.distance;
                comp = this._findComponentForArrange(obj.compid);
                if (!comp)
                {
                    if (distance.indexOf("rem") > -1 || distance.indexOf("em") > -1)
                    {
                        comp = this;
                        if (distance.indexOf("rem") > -1)
                        {
                            comp = this._getMainFrame();
                        }

                        refer_font = comp._getReferenceAbsoluteFont();
                        comp_height = refer_font ? refer_font._size : 1;
                    }
                    else
                    {
                        if ((parent_comp._p_fittocontents == "height" || parent_comp._p_fittocontents == "both") && comp_height < 0)                             
                        {
                            comp_height = parent_comp._basis_height;
                        }
                        else
                        {
                            comp = form;
                            comp_height = comp._getClientHeight();
                        }
                    }
                }
                else
                {
                    comp_height = comp._adjust_height;
                }

                this._bottom = this._convToPixel(distance, comp_height);
            }
        }
        else
        {
            if (this._p_bottom != null)
                this._bottom = isNaN(parsePosition = parseFloat(this._p_bottom)) ? this._bottom : parsePosition;
            else
                this._bottom = null;
        }

        if (fittocontents == "width" || fittocontents == "both")
        {
            if (size)
                this._width = size[0];
        }
        else
        {
            if (info && (obj = info.width))
            {
                if (form && form._is_created_contents)
                {
                    distance = obj.distance;
                    comp = this._findComponentForArrange(obj.compid);
                    if (!comp)
                    {
                        if (distance.indexOf("rem") > -1 || distance.indexOf("em") > -1)
                        {
                            comp = this;
                            if (distance.indexOf("rem") > -1)
                            {
                                comp = this._getMainFrame();
                            }

                            refer_font = comp._getReferenceAbsoluteFont();
                            comp_width = refer_font ? refer_font._size : 1;
                        }
                        else
                        {
                            if (parent_comp._p_fittocontents == "width" || parent_comp._p_fittocontents == "both")
                            {
                                comp_width = parent_comp._basis_width;
                            }
                            else
                            {
                                comp = form;
                                comp_width = comp._getClientWidth();
                            }
                        }
                    }
                    else
                    {
                        comp_width = comp._adjust_width;
                    }

                    this._width = this._convToPixel(distance, comp_width);//comp._getClientWidth());
                }
            }
            else
            {
                if (this._p_width != null)
                    this._width = isNaN(parsePosition = parseFloat(this._p_width)) ? this._width : parsePosition;
                else
                    this._width = null;
            }
        }

        if (fittocontents == "height" || fittocontents == "both")
        {
            if (size)
                this._height = size[1];
        }
        else
        {
            if (info && (obj = info.height))
            {
                if (form && form._is_created_contents)
                {
                    distance = obj.distance;
                    comp = this._findComponentForArrange(obj.compid);
                    if (!comp)
                    {
                        if (distance.indexOf("rem") > -1 || distance.indexOf("em") > -1)
                        {
                            comp = this;
                            if (distance.indexOf("rem") > -1)
                            {
                                comp = this._getMainFrame();
                            }

                            refer_font = comp._getReferenceAbsoluteFont();
                            comp_height = refer_font ? refer_font._size : 1;
                        }
                        else
                        {
                            if (parent_comp._p_fittocontents == "height" || parent_comp._p_fittocontents == "both")
                            {
                                comp_height = parent_comp._basis_height;
                            }
                            else
                            {
                                comp = form;
                                comp_height = comp._getClientHeight();
                            }
                        }
                    }
                    else
                    {
                        comp_height = comp._adjust_height;
                    }

                    this._height = this._convToPixel(distance, comp_height);//comp._getClientHeight());
                }
            }
            else
            {
                if (this._p_height != null)
                    this._height = isNaN(parsePosition = parseFloat(this._p_height)) ? this._height : parsePosition;
                else
                    this._height = null;
            }
        }
    };

    _pComponent._getArrangeComp = function (position_prop)
    {
        switch (position_prop)
        {
            case "left":
            case "top":
            case "width":
            case "height":
            case "right":
            case "bottom":
                break;
            default:
                return undefined;
        }

        var info = this._arrange_info;

        if (!info)
            return null;

        var info_obj = info[position_prop];
        if (!info_obj)
            return null;

        return this._findComponentForArrange(info_obj.compid);
    };

    _pComponent._findComponentForArrange = function (compid)
    {
        var comp = null;
        var form = null;
        var comps, this_idx, target_idx, source_idx;
        if (compid)
        {
            if (!this._is_subcontrol)
            {
                form = this._getForm();
                if (form)
                {
                    comps = form._p_components;
                    this_idx = comps.indexOf(this.id);
                    target_idx = comps.indexOf(compid);

                    if (this_idx < target_idx)
                        return null;

                    var target_comp = comps[compid];
                    if (target_comp)
                    {
                        if ((this._p_positionstep != target_comp._p_positionstep) ||
                            this._p_positionstep == -1 || target_comp._p_positionstep == -1)
                            return null;
                    }

                    comp = comps[target_idx];
                }
            }
            else
            {
                var parent = this._p_parent;
                if (parent._findChild)
                {
                    var target = parent._findChild(compid);

                    if (!target || target._p_taborder > this._p_taborder)
                        return null;

                    comp = target;
                }
                else
                {
                    form = this._getForm();
                    if (form)
                    {
                        comps = form._p_components;
                        source_idx = comps.indexOf(this.id);
                        target_idx = comps.indexOf(compid);

                        if (source_idx < target_idx)
                            return null;

                        comp = comps[target_idx];
                    }
                }
            }
        }

        return comp;
    };

    _pComponent._setInnerFlexibleFlag = function (is_flexible, is_calc)
    {
        // empty
    };
    _pComponent._isFluidContainer = function (binner)
    {
        if (this._is_subcontrol)
        {
            if (this._excluded_flex)
                return false;

            return this._p_parent._is_flexible;
        }

        if (this._is_popup_control) return false;
        if (this._is_group) return true; //check

        var form = binner ? this._p_parent._getForm() : this._getForm();
        return form ? form._is_flexible_container : false;
    };
    _pComponent._isFluidContainerCalculation = function ()
    {
        if (this._is_subcontrol)
            return false;
        var form = this._getForm();
        if (this._is_group) 
        {
            return this._group_panel._is_flexible_container_calculation; //check
        }
        return form ? form._is_flexible_container_calculation : true;
    };

    _pComponent._getTablecellareaCoordinate = function ()
    {
        var tablecellarea = this._p_tablecellarea ? this._p_tablecellarea : this._tablecellareacoordinates;
        //parse
        //var row_start, row_end, col_start ,col_end;
        var merge_pos = [];
        if (tablecellarea)
        {
            var coord = tablecellarea.split("/");
            coord.forEach(function (cell_pos)
            {
                cell_pos = cell_pos.trim();
                var tmp = cell_pos.split(" ");
                if (tmp.length == 1)
                {
                    merge_pos.push(+cell_pos);
                    merge_pos.push(+cell_pos);
                }
                else if (tmp.length == 2)
                {
                    if (tmp[0] > tmp[1])
                    {
                        tmp.push(tmp.shift());
                    }
                    tmp.forEach(function (cell_pos)
                    {
                        merge_pos.push(+cell_pos);
                    });
                }
            });
        }

        return merge_pos;
    };

    _pComponent._areConsecutive = function ()
    {
        return false;
    }


    //===============================================================
    // nexacro.Component : Logical Part (Scroll)
    //===============================================================
    _pComponent._onRecalcScrollSize = nexacro._emptyFn;

    _pComponent._getFittocontents = function ()
    {
        return this._fittocontents ? this._fittocontents : this._p_fittocontents;
    }

    _pComponent._onResetScrollBar = function ()
    {
        if (!this._is_scrollable)
            return;

        var control_elem = this._control_element;
        if (control_elem)
        {

            var hscrollbar_size = this._getHScrollBarSize();
            var vscrollbar_size = this._getVScrollBarSize();

            var bcreatevscroll = false;
            var bcreatehscroll = false;

            var hscrollbartype = this._getHScrollBarType();
            var vscrollbartype = this._getVScrollBarType();
            var scrolltype = this._scrolltype;
            if (hscrollbartype != "none")
                bcreatehscroll = true;
            if (vscrollbartype != "none")
                bcreatevscroll = true;
            if (this._is_form && this.getStepCount() > 0)
                bcreatehscroll = false;
            /*
            if (scrolltype == "none")
            {
                //bcreatehscroll = false;
                //bcreatevscroll = false;
            }
            else
            {
                if (scrolltype != "vertical" && hscrollbartype != "none")
                    bcreatehscroll = true;
    
                if (scrolltype != "horizontal" && vscrollbartype != "none")
                    bcreatevscroll = true;
    
                if (this._is_form && this.getStepCount() > 0)
                    bcreatehscroll = false;
            }
            */

            var client_left = control_elem.client_left;
            var client_top = control_elem.client_top;
            var client_width = control_elem.client_width;
            var client_height = control_elem.client_height;
            var zclient_width = control_elem._zclient_width;
            var zclient_height = control_elem._zclient_height;

            var paddingleft = 0, paddingtop = 0, paddingright = 0, paddingbottom = 0;
            var padding = control_elem.padding ? control_elem.padding : control_elem._padding_info;

            var vscroll_enable = false;
            var hscroll_enable = false;

            if (control_elem._apply_client_padding && padding)
            {
                paddingleft = padding.left;
                paddingtop = padding.top;
                paddingright = padding.right;
                paddingbottom = padding.bottom;
            }

            var hscroll_left = client_left - paddingleft;
            var hscroll_top = client_height + paddingtop + paddingbottom;
            var hscroll_width = client_width + paddingleft + paddingright;

            var vscroll_left = client_width + paddingleft + paddingright;
            var vscroll_top = client_top - paddingtop;
            var vscroll_height = client_height + paddingtop + paddingbottom;

            if (bcreatehscroll)
            {
                this._createHScrollBar(hscrollbar_size);

                if (hscrollbar_size > 0)
                {
                    if (control_elem.hscroll_limit <= 0 && hscrollbartype != "fixed")
                        hscrollbar_size = 0;

                    if (hscrollbartype == "autoindicator")
                    {
                        hscroll_top -= hscrollbar_size;
                        this._p_hscrollbar.set_visible(false);
                    }
                    else
                        this._p_hscrollbar.set_visible(true);

                }


            }
            else
            {
                if (this._p_hscrollbar)
                {
                    this._p_hscrollbar.destroy();
                    this._p_hscrollbar = null;
                }
            }

            if (bcreatevscroll)
            {
                this._createVScrollBar(vscrollbar_size);

                if (vscrollbar_size > 0)
                {
                    if (control_elem.vscroll_limit <= 0 && vscrollbartype != "fixed")
                    {
                        vscrollbar_size = 0;
                    }

                    if (vscrollbartype == "autoindicator")
                    {
                        vscroll_left -= vscrollbar_size;
                        this._p_vscrollbar.set_visible(false);
                    }
                    else
                        this._p_vscrollbar.set_visible(true);

                    //hscroll_width -= vscrollbar_size;
                }
            }
            else
            {
                if (this._p_vscrollbar)
                {
                    this._p_vscrollbar.destroy();
                    this._p_vscrollbar = null;
                }
            }

            // ScrollBar Visible시 생성
            if (this._p_hscrollbar)
            {
                if (this._isEnable() && hscrollbar_size > 0 && (scrolltype != "none" && scrolltype != "vertical") && control_elem.hscroll_limit > 0)
                    hscroll_enable = true;

                const rootcomp = this._getRootComponent(this);
                if (rootcomp && rootcomp._p_resizertype != "none" && vscrollbar_size == 0) 
                {
                    // Creates space for the resizer (only when the horizontal scrollbar exists alone)
                    hscroll_width -= hscrollbar_size;
                }

                this._p_hscrollbar._setScrollInfo(hscroll_left, hscroll_top, hscroll_width, hscrollbar_size, 0, control_elem.hscroll_limit, this._scroll_default_value, zclient_width, zclient_width, hscroll_enable, control_elem.scroll_left);

                if (!this._p_hscrollbar._is_created)
                    this._p_hscrollbar.on_created(this._getWindow());

            }

            if (this._p_vscrollbar)
            {
                if (this._isEnable() && vscrollbar_size > 0 && (scrolltype != "none" && scrolltype != "horizontal") && control_elem.vscroll_limit > 0)
                    vscroll_enable = true;

                const rootcomp = this._getRootComponent(this);
                if (rootcomp && rootcomp._p_resizertype != "none" && hscrollbar_size == 0)
                {
                    // Creates space for the resizer (only when the vertical scrollbar exists alone)
                    vscroll_height -= vscrollbar_size;
                }

                this._p_vscrollbar._setScrollInfo(vscroll_left, vscroll_top, vscrollbar_size, vscroll_height, 0, control_elem.vscroll_limit, this._scroll_default_value, zclient_height, zclient_height, vscroll_enable, control_elem.scroll_top);
                if (!this._p_vscrollbar._is_created)
                    this._p_vscrollbar.on_created(this._getWindow());

            }
        }
    };

    _pComponent._setFlingScrollBezier = function (p1x, p1y, p2x, p2y)
    {
        this._fling_cubic_bezier = [p1x, p1y, p2x, p2y];    // this component only
    };

    _pComponent._setFlingScrollMaxDistance = function (maxdistance)
    {
        this._fling_max_distance = maxdistance;
    };

    _pComponent._on_beforescroll = function (prehpos, prevpos, posthpos, postvpos, evttype, evtkind)
    {
        return true;
    };

    _pComponent._scrollBy = function (x, y, bapplyscrollbar, bautohidetimer, evttype, evtkind)
    {
        x = parseInt(x) + this._hscroll_pos;
        y = parseInt(y) + this._vscroll_pos;

        this._scrollTo(x, y, bapplyscrollbar, bautohidetimer, evttype, evtkind);
    };

    _pComponent._correctScrollPos = function (pos)
    {
        return parseInt(pos) | 0;
    };

    _pComponent._scrollTo = function (hpos, vpos, bapplyscrollbar, bautohidetimer, evttype, evtkind)
    {
        if (nexacro._isNull(bapplyscrollbar))
            bapplyscrollbar = true;
        if (nexacro._isNull(bautohidetimer))
            bautohidetimer = false;

        var control_elem = this.getElement();

        if (!control_elem)
            return false;

        var scrolltype = this._scrolltype;
        var evttype_h, evttype_v;

        var hscrollbartype = this._getHScrollBarType();
        var vscrollbartype = this._getVScrollBarType();

        var hscroll_limit = control_elem.hscroll_limit;
        var vscroll_limit = control_elem.vscroll_limit;

        var current_hpos = this._hscroll_pos;
        var current_vpos = this._vscroll_pos;
        var bchange_hscroll_pos = false;
        var bchange_vscroll_pos = false;

        if (nexacro._isNull(hpos) || scrolltype == "vertical")
            hpos = current_hpos;
        if (nexacro._isNull(vpos) || scrolltype == "horizontal")
            vpos = current_vpos;

        hpos = this._correctScrollPos(hpos);
        vpos = this._correctScrollPos(vpos);

        hpos = hpos < 0 ? 0 : hpos;
        vpos = vpos < 0 ? 0 : vpos;

        var bscroll = this._on_beforescroll(current_hpos, current_vpos, hpos, vpos, evttype, evtkind);

        hpos = hpos > hscroll_limit ? hscroll_limit : hpos;
        vpos = vpos > vscroll_limit ? vscroll_limit : vpos;

        if ((evtkind == "slide" || evtkind == "fling") && this._p_stepselector && this._p_stepselector.stepcount > 0)
        {
            var hmove = Math.abs(current_hpos - hpos);
            var vmove = Math.abs(current_vpos - vpos);
            if (this._is_step_vscrolling)
            {
                hpos = current_hpos;
            }
            else if (this._is_step_hscrolling)
            {
                vpos = current_vpos;
            }
            else
            {
                if (hmove < vmove)
                {
                    hpos = current_hpos;
                    this._is_step_vscrolling = true;
                }
                else
                {
                    vpos = current_vpos;
                    this._is_step_hscrolling = true;
                }
            }
        }

        if (hpos != current_hpos && vpos != current_vpos)
        {
            bchange_hscroll_pos = true;
            bchange_vscroll_pos = true;

            if (bscroll)
            {
                control_elem.setElementScrollPos(hpos, vpos);
            }

            this._hscroll_pos = hpos;
            this._vscroll_pos = vpos;
        }
        else if (hpos != current_hpos)
        {
            bchange_hscroll_pos = true;
            if (bscroll)
            {
                control_elem.setElementHScrollPos(hpos);
            }
            this._hscroll_pos = hpos;
        }
        else if (vpos != current_vpos)
        {
            bchange_vscroll_pos = true;
            if (bscroll)
            {
                control_elem.setElementVScrollPos(vpos);
            }
            this._vscroll_pos = vpos;
        }

        if (evtkind != "vertical" && evtkind != "page_v" && evtkind != "mousewheel_v")
        {
            if (evttype)
                evttype_h = evttype;
            else
                evttype_h = this._getScrollEventType(current_hpos, hpos, 0, hscroll_limit, "h");
        }

        if (bchange_hscroll_pos || evttype_h)
        {
            if (evttype_h && evtkind == "mousewheel_h")
                evttype_h = "wheel" + evttype_h;
            else if (evtkind == "page_h" && (evttype_h == "left" || evttype_h == "right"))
                evttype_h = "page" + evttype_h;
            else if (evtkind == "slide" || evtkind == "fling")
            {
                if (evttype_h == "first" || evttype_h == "firstover" || evttype_h == "last" || evttype_h == "lastover")
                    evttype_h = "slide" + evttype_h;
                else if (evttype_h == "left" || evttype_h == "right")
                {
                    evttype_h = "slidescroll" + evttype_h;
                }
                else
                    evttype_h = "slide";
            }

            if (evttype_h == "left" || evttype_h == "right")
                evttype_h = "none";

            if (bchange_hscroll_pos || evttype_h != "none")
                this.on_fire_onhscroll("onhscroll", hpos, evttype_h ? evttype_h : evttype, evtkind);
        }

        if (evtkind != "horizontal" && evtkind != "page_h" && evtkind != "mousewheel_h")
        {
            if (evttype)
                evttype_v = evttype;
            else
                evttype_v = this._getScrollEventType(current_vpos, vpos, 0, vscroll_limit, "v");
        }

        if (bchange_vscroll_pos || evttype_v)
        {
            if (evttype_v && evtkind == "mousewheel_v")
                evttype_v = "wheel" + evttype_v;
            else if (evtkind == "page_v" && (evttype_v == "up" || evttype_v == "down"))
                evttype_v = "page" + evttype_v;
            else if (evtkind == "slide" || evtkind == "fling")
            {
                if (evttype_v == "first" || evttype_v == "firstover" || evttype_v == "last" || evttype_v == "lastover")
                    evttype_v = "slide" + evttype_v;
                else if (evttype_v == "up" || evttype_v == "down")
                {
                    evttype_v = "slidescroll" + evttype_v;
                }
                else
                    evttype_v = "slide";
            }

            if (evttype_v == "up" || evttype_v == "down")
                evttype_v = "none";

            if ((bchange_vscroll_pos || evttype_v != "none") && evtkind != "stepchange")
                this.on_fire_onvscroll("onvscroll", vpos, evttype_v ? evttype_v : evttype, evtkind);
        }
        /*
        if (bchange_hscroll_pos || bchange_vscroll_pos)
        {
            var focused_comp = this._last_focused;
            if (focused_comp && focused_comp._is_editable_control)
            {
                focused_comp._on_scroll_change();
            }
        }
        */

        if (bapplyscrollbar)
        {
            var hscrollbar = this._p_hscrollbar;
            if (hscrollbar && hscrollbar._p_enable && bchange_hscroll_pos)
            {
                if (hscrollbartype == "autoindicator")
                {
                    hscrollbar.set_visible(true);

                    if (bautohidetimer)
                    {
                        nexacro._OnceCallbackTimer.callonce(this, function ()
                        {
                            this._p_hscrollbar.set_visible(false);
                        }, 500);
                    }
                }

                hscrollbar._setPos(hpos, evtkind, false);

            }

            var vscrollbar = this._p_vscrollbar;
            if (vscrollbar && vscrollbar._p_enable && bchange_vscroll_pos)
            {
                if (vscrollbartype == "autoindicator")
                {
                    vscrollbar.set_visible(true);

                    if (bautohidetimer)
                    {
                        nexacro._OnceCallbackTimer.callonce(this, function ()
                        {
                            this._p_vscrollbar.set_visible(false);
                        }, 500);
                    }
                }

                vscrollbar._setPos(vpos, evtkind, false);
            }
        }

        return true;
    };

    _pComponent._createVScrollBar = function (scroll_size)
    {
        var vscrollbartype = this._getVScrollBarType();
        var vscrollbar;

        if (vscrollbartype == "autoindicator" || vscrollbartype == "indicator")
        {
            if (this._p_vscrollbar && (this._p_vscrollbar.id != this._vscrollindicator_id))
            {
                this._p_vscrollbar.destroy();
                this._p_vscrollbar = null;
            }

            if (!this._p_vscrollbar)
                this._p_vscrollbar = new nexacro.ScrollIndicatorControl(this._vscrollindicator_id, 0, 0, scroll_size, this._getClientWidth(), null, null, null, null, null, null, this);

        }
        else
        {
            if (this._p_vscrollbar && (this._p_vscrollbar.id != this._vscrollbar_id))
            {
                this._p_vscrollbar.destroy();
                this._p_vscrollbar = null;
            }

            if (!this._p_vscrollbar)
                this._p_vscrollbar = new nexacro.ScrollBarControl(this._vscrollbar_id, 0, 0, scroll_size, this._getClientWidth(), null, null, null, null, null, null, this);
        }

        vscrollbar = this._p_vscrollbar;

        if (!nexacro._isNull(this._p_scrollbarbaroutsize))
            vscrollbar.set_baroutsize(this._p_scrollbarbaroutsize);
        if (!nexacro._isNull(this._p_scrollbarincbuttonsize))
            vscrollbar.set_incbuttonsize(this._p_scrollbarincbuttonsize);
        if (!nexacro._isNull(this._p_scrollbardecbuttonsize))
            vscrollbar.set_decbuttonsize(this._p_scrollbardecbuttonsize);
        if (!nexacro._isNull(this._p_scrollbarbarminsize))
            vscrollbar.set_barminsize(this._p_scrollbarbarminsize);
        if (!nexacro._isNull(this._p_scrollbartrackbarsize))
            vscrollbar.set_trackbarsize(this._p_scrollbartrackbarsize);

        if (!vscrollbar._is_created_contents)
        {
            vscrollbar.set_direction("vertical");
            vscrollbar._setEventHandler("onscroll", this.on_notify_vscroll_onscroll, this);
            vscrollbar.createComponent(true);
        }

        vscrollbar.on_apply_cssclass();

        vscrollbar.move(0, 0, scroll_size, this._getClientWidth(), null, null);
    };

    _pComponent._createHScrollBar = function (scroll_size)
    {
        var hscrollbar;
        var hscrollbartype = this._getHScrollBarType();

        if (hscrollbartype == "autoindicator" || hscrollbartype == "indicator")
        {

            if (this._p_hscrollbar && (this._p_hscrollbar.id != this._hscrollindicator_id))
            {
                this._p_hscrollbar.destroy();
                this._p_hscrollbar = null;
            }

            if (!this._p_hscrollbar)
                this._p_hscrollbar = new nexacro.ScrollIndicatorControl(this._hscrollindicator_id, 0, 0, this._getClientHeight(), scroll_size, null, null, null, null, null, null, this);
        }
        else
        {

            if (this._p_hscrollbar && (this._p_hscrollbar.id != this._hscrollbar_id))
            {
                this._p_hscrollbar.destroy();
                this._p_hscrollbar = null;
            }

            if (!this._p_hscrollbar)
                this._p_hscrollbar = new nexacro.ScrollBarControl(this._hscrollbar_id, 0, 0, this._getClientHeight(), scroll_size, null, null, null, null, null, null, this);
        }

        hscrollbar = this._p_hscrollbar;

        if (!nexacro._isNull(this._p_scrollbarbaroutsize))
            hscrollbar.set_baroutsize(this._p_scrollbarbaroutsize);
        if (!nexacro._isNull(this._p_scrollbarincbuttonsize))
            hscrollbar.set_incbuttonsize(this._p_scrollbarincbuttonsize);
        if (!nexacro._isNull(this._p_scrollbardecbuttonsize))
            hscrollbar.set_decbuttonsize(this._p_scrollbardecbuttonsize);
        if (!nexacro._isNull(this._p_scrollbarbarminsize))
            hscrollbar.set_barminsize(this._p_scrollbarbarminsize);
        if (!nexacro._isNull(this._p_scrollbartrackbarsize))
            hscrollbar.set_trackbarsize(this._p_scrollbartrackbarsize);

        if (!hscrollbar._is_created_contents)
        {
            hscrollbar.set_direction("horizontal");
            hscrollbar._setEventHandler("onscroll", this.on_notify_hscroll_onscroll, this);
            hscrollbar.createComponent(true);
        }

        hscrollbar.on_apply_cssclass();

        hscrollbar.move(0, 0, this._getClientHeight(), scroll_size, null, null);
    };

    //===============================================================
    // nexacro.Component : Logical Part (Resizer)
    //===============================================================
    _pComponent._resetResizer = function (width, height)
    {
        this._destroyResizer();

        if (this._p_resizertype != "none")
        {
            this._createResizer(width, height);
        }
    };

    _pComponent._createResizer = function (width, height)
    {
        if (!this._p_resizer)
            this._p_resizer = new nexacro.ResizerControl(this._resizer_id, null, null, width, height, 0, 0, null, null, null, null, this);

        const resizer = this._p_resizer;
        if (resizer)
        {
            resizer.set_type(this._p_resizertype === "live" ? "self" : "ghost");
            resizer.set_direction(this._p_resizerdirection);
            resizer.createComponent();
            resizer.on_apply_cssclass();
        }
    };

    _pComponent._destroyResizer = function ()
    {
        if (this._p_resizer)
        {
            this._p_resizer.destroy();
            this._p_resizer = null;
        }
    };

    _pComponent._repositionResizer = function ()
    {
        const resizer = this._p_resizer;
        if (resizer)
            resizer.move(null, null, resizer._adjust_width, resizer._adjust_height, 0, 0);
    };

    _pComponent._resizeByResizer = function (x, y, endtrack)
    {
        const resizer_trackinfo = this._resizer_trackinfo;
        if (resizer_trackinfo)
        {
            const resize_width = resizer_trackinfo.width + x;
            const resize_height = resizer_trackinfo.height + y;

            const resizer = this._p_resizer;
            if (resizer)
                resizer._resize(this, resize_width, resize_height, endtrack);

            const parent = this._p_parent;
            if (parent && parent.resetScroll)
                parent.resetScroll();
        }
    };

    //===============================================================
    // nexacro.Component : Logical Part (Hotkey)
    //===============================================================
    _pComponent._registerHotkey = function ()
    {
        var hotkey = this._hotkey;
        if (!hotkey || hotkey._is_registered)
            return;

        this._setAccessibilityHotKey(this._p_hotkey);

        var _form = this._getMainForm();
        if (this._is_frame || this == _form)
        {
            // form 또는 frame의 hotkey는 ownerFrame에 등록
            var owner_frame = this.getOwnerFrame();
            if (owner_frame)
            {
                nexacro._registerHotkeyComp(owner_frame, this, hotkey);
            }
            else
            {
                const form = this._getRootForm();
                if (form)
                    nexacro._registerHotkeyComp(form, this, hotkey);
            }
        }
        else
        {
            if (_form)
            {
                nexacro._registerHotkeyComp(_form, this, hotkey);
            }
        }
    };

    _pComponent._unregisterHotkey = function ()
    {
        var hotkey = this._hotkey;
        if (!hotkey || !hotkey._is_registered)
            return;
        var _form = this._getMainForm();
        if (this._is_frame || this == _form)
        {
            // form 또는 frame의 hotkey는 ownerFrame에 등록
            var owner_frame = this.getOwnerFrame();
            if (owner_frame)
            {
                nexacro._unregisterHotkeyComp(owner_frame, this, hotkey);
            }
            else
            {
                const form = this._getRootForm();
                if (form)
                    nexacro._unregisterHotkeyComp(form, this, hotkey);
            }
        }
        else
        {
            if (_form)
            {
                nexacro._unregisterHotkeyComp(_form, this, hotkey);
            }
            else
            {
                // frame이 파괴되는 도중 (form과 끊어진 상황)
                delete this._hotkey;
                this._hotkey = null;
            }
        }
    };

    _pComponent._processHotkey = function (keycode, altKey, ctrlKey, shiftKey)
    {
        // Hotkey처리 및 버블링
        var _form = this._getMainForm();
        if (!this._is_frame && this != _form)
        {
            if (_form)
            {
                // Main Form부터 시작
                return _form._processHotkey(keycode, altKey, ctrlKey, shiftKey, this);
            }
        }
    };

    _pComponent._on_hotkey = function (keycode, altKey, ctrlKey, shiftKey)
    {
        // Hotkey가 눌렸을때 처리. 각 컴포넌트의 DefaultAction 수행
        // -> Button,CheckBox는 click처리 나머지는 focus처리
        this.setFocus();
    };

    _pComponent._refreshLayoutInfo = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            control_elem._refreshLayoutInfo();
        }
    };

    //===============================================================
    // nexacro.Component : Logical Part (ETC)
    //===============================================================
    _pComponent._destroy = function (callremovechild)
    {
        return this.destroy(callremovechild);
    };

    _pComponent._applyScrollPos = function ()
    {
        // Node의 이동으로 인해 handle의 scrollleft,scrolltop이 0으로 초기화 되는 문제 수정
        // Node의 visible 처리로 인해 초기화 되는 문제 추가 

        var child_list;
        var comp;
        var i;
        if (this.form)
        {
            child_list = this.form._child_list;
        }
        else
            child_list = this._child_list;

        if (child_list != null) // || child_list != undefined)
        {
            for (i = 0; i < child_list.length; i++)
            {
                comp = child_list[i];
                comp._applyScrollPos(); //재귀호출 

            }
        }
        if ((this._is_scrollable && this._use_container_move) || this._applyMultiContainerScrollPos)
        {
            if (this._applyMultiContainerScrollPos)
            {
                this._applyMultiContainerScrollPos();  // Grid와 같이 Control별로 Container 복수 구조 일 시 또는 하위 Control에 scroll존재시에 overrid해야함  
            }
            else
            {
                if (this._control_element)
                {
                    this._control_element._reset_scrollpos = true;  // Grid때문에 Control의 scroll_left,top reset처리용 변수가 존재함 

                    this._control_element.setElementHScrollPos(this._control_element.scroll_left);  // container handle(HTMLDivelement)에 left,top을 원래값으로 적용 
                    this._control_element.setElementVScrollPos(this._control_element.scroll_top);
                    this._control_element._reset_scrollpos = false;
                }
            }
        }
    };
    _pComponent._makeExprFn = function (expr)
    {
        expr = expr.trim().split(":");
        var len = expr.length;
        var parser = new nexacro.ExprParser();
        var conv_expr, exprfn;
        var str;

        if (len == 1)
        {
            str = expr[0];
        }
        else
        {
            if (expr[0].trim().toUpperCase() != "EXPR")
            {
                str = expr.join(":");
            }
            else
            {
                str = expr.slice(1).join(":");
            }
        }

        conv_expr = parser.makeExpr(this, str);
        exprfn = nexacro._createInlineFunc(conv_expr, ["comp"]);
        return exprfn;
    };

    _pComponent._closePopup = function ()
    {
        var popup = this._popupcontrol;
        if (popup)
        {
            popup._closePopup();
        }
    };

    _pComponent._on_beforerepeat = function ()
    {
        return [true, false];   // [bRepeat, bBubble]
    };
    _pComponent._setFluidcontents = nexacro._emptyFn;
    _pComponent._getLayoutChildlist = function ()
    {
        return this._layoutchild_list ? this._layoutchild_list : this._child_list;
    }

    //===============================================================
    // nexacro.Component : Util Function
    //===============================================================
    _pComponent.getElement = function ()
    {
        return this._control_element;
    };

    _pComponent._getOwnerFrame = function ()
    {
        var form = this;
        while (form && !form._is_frame)
        {
            form = form._p_parent;
        }
        return form;
    };

    _pComponent._getMainFrame = function ()
    {
        var pThis = this;
        while (pThis && !pThis._is_main) // Form 이 Main일 수 있음
        {
            pThis = pThis._p_parent;
        }

        if (!pThis?._is_frame)
            return null;

        return pThis;

    };

    _pComponent._isMainFrame = function ()
    {
        return (this._is_frame && this._is_main);
    };
    _pComponent._isMainFrameBody = function ()
    {
        // mainframe 이 document.body (기존)임을 간주하고 예외처리 부분 처리용 api
        return (this._isMainFrame() && !nexacro.ismodule)
    };
    _pComponent._isMainForm = function ()
    {
        return (this._is_form && this._is_main);
    };
    _pComponent._isMain = function ()
    {
        return (this._isMainFrame() || this._isMainForm());
    };

    _pComponent._getApplication = function ()
    {
        if (!this._p_parent) return null;

        if (this._p_parent && this._p_parent._is_application)
            return this._p_parent;
        const mainframe = this._getMainFrame();
        if (mainframe)
            return mainframe._p_parent;
        return null;
    };

    _pComponent._getRootObject = function ()
    {
        const app = this._getApplication();
        if (!app)
        {
            const win = this._getRootWindow();
            if (win)
                return win.getRootInstance()
        }
        return app;
    };


    _pComponent._getWindow = function ()
    {
        var parent = this._p_parent;
        if (parent)
        {
            return parent._getWindow();
        }

        var form = this._refform;
        if (form && form != this)
        {
            return form._getWindow();
        }

    };

    _pComponent._getRootWindow = function ()
    {
        var _window = this._getWindow();
        while (_window)
        {
            if (_window.root)
                return _window;

            _window = _window._p_parent;
        }

        return this._getWindow();
    };

    _pComponent._getWindowHandle = function ()
    {
        var _window = this._getWindow();
        if (_window)
            return _window.handle;
        return null;
    };

    _pComponent._getForm = function ()
    {
        return this._refform;
    };

    _pComponent._getRootForm = function ()
    {
        var form = this._refform;
        while ((form && form._is_form == false) ||
            (form && form._is_form && (form instanceof nexacro._InnerForm)))
        {
            form = form._p_parent;
        }

        return form;
    };

    _pComponent._getMainForm = function ()
    {
        var comp = this;
        while (comp)
        {
            if (comp._is_frame)
            {
                return comp.form;
            }
            if (!comp._is_form && comp._refform)
                comp = comp._refform;
            else if (comp._p_parent)
                comp = comp._p_parent;
            else
            {
                if (comp._is_form)
                    return comp;
                return null; // this is removed component!
            }
        }

        return null;
    };

    _pComponent._getParentForm = function ()
    {
        var p = this._p_parent;
        if (!p)
            return null;

        while (p)
        {
            if (p._is_form && !p._is_frame)
                return p;
            p = p._p_parent;
        }
        return null;
    };
    /*
    _pComponent._getParentComponent = function ()
    {
        if (this._is_group)
            return this._group_panel;
        return this._getForm()._p_parent;
    };
    */

    _pComponent._getLastFocused = function ()
    {
        return this._last_focused;
    };

    _pComponent._getRefFormBaseUrl = function ()
    {
        if (this._refform)
            return this._refform._getFormBaseUrl();
    };

    _pComponent._getFormChildById = function (id)
    {
        var form = this._getForm();
        if (form)
            return form[id];

        return null;
    };

    _pComponent._getRootComponent = function (component)
    {
        var comp = component;
        while (comp && (comp._is_subcontrol || !comp._is_component || comp instanceof nexacro._InnerForm))
        {
            if (comp == comp._p_parent)
                return null;
            comp = comp._p_parent;
        }

        return comp;
    };

    _pComponent._getPopupRootComponent = function (component)
    {
        var comp = component;
        while (comp && (comp._is_subcontrol || !comp._is_component || comp instanceof nexacro._InnerForm) && !comp._popupcontrol)
        {
            if (comp == comp._p_parent)
                return null;
            comp = comp._p_parent;
        }

        return comp;
    };

    _pComponent._getEventInfoComponent = function ()
    {
        return this;
    };

    _pComponent._getFocusAcceptableComponent = function (component)
    {
        var comp = component;
        while (comp && comp._is_subcontrol && !comp._is_focus_accept)
        {
            if (comp == comp._p_parent)
            {
                return null;
            }
            comp = comp._p_parent;
        }
        return comp;
    };

    _pComponent._getReferenceContext = function ()
    {
        return this._refform;
    };

    // css getter
    _pComponent._getCSSStyleValue = function (prop, status, userstatus)
    {
        if (status === undefined) status = this._status;
        if (userstatus === undefined) userstatus = this._userstatus;

        var multistatus = "";
        if (status != "enabled" && status && userstatus) multistatus = status + "_" + userstatus;

        if (!this._cssselector)
            return;

        var bRtl = this._isRtl();
        var rtlprop = (prop == "icon" ? "rtlIcon" : prop);

        var cssselector;
        if (multistatus && this._cssselector[multistatus])
        {
            cssselector = this._cssselector[multistatus];
            if (cssselector && cssselector[prop])
            {
                if (bRtl && prop == "icon" && cssselector[rtlprop])
                    return cssselector[rtlprop];
                else
                    return cssselector[prop];
            }
        }

        var value;
        var rtlvalue;
        var disabled_status = false;
        if (status === "disabled" && this._cssselector[status])
        {
            disabled_status = true;
            value = this._cssselector[status][prop];
            rtlvalue = this._cssselector[status][rtlprop];

            if (value)
            {
                if (bRtl && rtlvalue)
                    return rtlvalue;
                else
                    return value;
            }
        }

        if (userstatus && this._cssselector[userstatus])
        {
            value = this._cssselector[userstatus][prop];
            rtlvalue = this._cssselector[userstatus][rtlprop];

            if (value)
            {
                if (bRtl && rtlvalue)
                    return rtlvalue;
                else
                    return value;
            }
        }
        if (!disabled_status && this._cssselector[status])
        {
            value = this._cssselector[status][prop];
            rtlvalue = this._cssselector[status][rtlprop];

            if (value)
            {
                if (bRtl && rtlvalue)
                    return rtlvalue;
                else
                    return value;
            }
        }

        value = this._cssselector["enabled"][prop];
        rtlvalue = this._cssselector["enabled"][rtlprop];

        if (value && bRtl && rtlvalue)
            return rtlvalue;
        else
            return value;
    };

    _pComponent._getCurrentStyleInheritValue = function (prop, status, userstatus)
    {
        if (this[prop])
        {
            switch (prop)
            {
                case "font":
                    return this._getSettedFontObject();
                case "color":
                    return this._getSettedColorObject();
                case "wordSpacing":
                    return this._getSettedWordSpacingObject();
                case "letterSpacing":
                    return this._getSettedLetterSpacingObject();
                default:
                    return this["_" + prop];
            }
        }

        var value = this._getCSSStyleValue(prop, status, userstatus);
        if (!value && (prop == "font" || prop == "color" || prop == "wordSpacing" || prop == "letterSpacing"))
        {
            if (this._p_parent && this._p_parent._is_component)
            {
                value = this._p_parent._getCurrentStyleInheritValue(prop, status, userstatus);
            }
            else
            {
                if (prop == "font")
                    value = nexacro._getSystemFont();
            }
        }

        return value;
    };

    _pComponent._getCSSSelector = function ()
    {
        return this._cssselector;
    };

    //map 화일에서 cssclassselector를 처리하기 위해 호출
    _pComponent._getClassCSSSelector = function ()
    {
        var cssclassselector = this._p_cssclass || this._cssclass_expr;

        if (cssclassselector)
        {
            var classArray = cssclassselector.split(",");
            var resultArray = [];
            var len = classArray.length;

            for (var i = 0; i < len; i++)
            {
                resultArray.push(classArray[i].trim());
            }
            return resultArray //multi class
        }
        return "";
    };

    // element의 cssselector 설정할 값
    _pComponent._getElementClassCSSSelector = function ()
    {
        var cssclassselector = this._p_cssclass || this._cssclass_expr;

        //is_popup
        if (this._isPopupContains())
        {
            cssclassselector = this._getPopupContainerCSSSelector();
        }

        if (cssclassselector)
        {
            return cssclassselector.trim().split(",");  //multi class
        }
        return "";
    };

    _pComponent._getIDCSSSelector = function ()
    {
        if (this._is_subcontrol)
            return this.on_getIDCSSSelector();

        return "";
    };

    //popup의 경우 cssclass 의 개수를 늘려 우선순위를 높인다.
    //
    /*
        cell 의 우선순위처리를 위해 dummy를 붙여 처리한 것처럼 dummy를 붙이는 방식으로 처리
        control 이 있을 경우에 dummy 추가
        UserClass가 설정된 경우 dummy 추가
        *** 기존에 적용했던 컨트롤유저클라스 dummy 규칙도 유효, dummy 총 개수에 유저클라스에 따른 개수도 포함됨
    
        .Grid.UserGrid .body.UserBody .row .cell.UserCell .cellcombo .combolist
         ==>popupCombocombolist,
            popupGridCellControlcellcombocombolist,
            popupGridBandControlrowcellcellcombocombolist,
            popupGridbodyrowcellcellcombocombolist,
            popupGridbodyrowcellcellcombocombolist,
            popupGridbodyUserBandrowcellcellcombocombolist,
            popupGridUserGridbodyrowcellcellcombocombolist,
            popupGridUserGridbodyUserBandrowcellcellcombocombolist,
            popupGridbodyrowcellUserCellcellcombocombolist,
            popupGridbodyUserBandrowcellUserCellcellcombocombolist,
            popupGridUserGridbodyUserBandrowcellUserCellcellcombocombolist,
            popupGridUserGridbodyrowcellUserCellcellcombocombolist, dummy, dummy,dummy, dummy,dummy, dummy, dummy, dummy,dummy, dummy,dummy, dummy
    */

    _pComponent._getPopupContainerCSSSelector = function ()
    {
        var popupcontrol = this._p_parent._getPopupControl();
        if (popupcontrol)
        {
            var i, len;
            var cssselector_str = "";
            var popupcomp_type_name = "popup" + popupcontrol.on_get_popupControlTypeName();
            var dummystr = "dummy";

            var parentid = "", subidselector = "";
            var parent = this._p_parent;

            var dummycount = 1;
            var userclassselectors, userclassdummy;
            var parentidselector;
            var userclassselector_str;

            while (parent)
            {
                if (parent._is_subcontrol)
                    cssselector_str += "popup" + parent.on_get_css_assumedtypename() + parentid + this.on_getIDCSSSelector() + ",";
                else
                {
                    if (!userclassselectors)
                        cssselector_str += popupcomp_type_name + parentid + this.on_getIDCSSSelector() + ",";
                    break;
                }

                subidselector = parentid + this.on_getIDCSSSelector();
                parentidselector = parent.on_getIDCSSSelector();
                parentid = parentidselector + parentid;

                if (userclassselectors || parent._p_cssclass)
                {
                    if (!userclassselectors)
                    {
                        userclassselectors = [];
                        userclassdummy = [];
                    }

                    if (userclassselectors.length == 0)
                    {
                        userclassselectors.push(parentidselector + subidselector);
                        if (parent._p_cssclass)
                            userclassselectors.push(parentidselector + parent._p_cssclass + subidselector);
                        userclassdummy.push(2);
                    }
                    else
                    {
                        var tempuserclassselectors = [];
                        while (userclassselectors.length != 0)
                        {
                            userclassselector_str = userclassselectors.pop();
                            tempuserclassselectors.push(parentidselector + userclassselector_str);
                            if (parent._p_cssclass)
                                tempuserclassselectors.push(parentidselector + parent._p_cssclass + userclassselector_str);
                        }


                        len = userclassdummy.length;
                        for (i = 0; i < len; i++)
                        {
                            var classdummycnt = userclassdummy[i];
                            userclassdummy[i] = classdummycnt + 1;
                        }
                        if (parent._p_cssclass)
                            userclassdummy.push(2);
                        userclassselectors = tempuserclassselectors;
                    }
                }
                dummycount++;

                parent = parent._p_parent;
            }

            if (userclassselectors && userclassselectors.length > 0)
            {
                while (userclassselectors.length > 0)
                {
                    userclassselector_str = userclassselectors.pop();
                    cssselector_str += "," + popupcomp_type_name + userclassselector_str;
                    if (parent._p_cssclass)
                    {
                        cssselector_str += "," + popupcomp_type_name + parent._p_cssclass + userclassselector_str;
                    }
                }

                if (parent._p_cssclass)
                {
                    dummycount++;
                }

                len = userclassdummy.length;
                for (i = 0; i < len; i++)
                {
                    dummycount += userclassdummy[i];
                }
            }
            else if (parent._p_cssclass)
            {
                var cssclass;
                var cssclass_arr = parent._p_cssclass.split(",");
                for (var i = 0; i < cssclass_arr.length; i++)
                {
                    cssclass = cssclass_arr[i];
                    cssselector_str += popupcomp_type_name + cssclass + parentid + this.on_getIDCSSSelector();
                    if (i != (cssclass_arr.length - 1))
                    {
                        cssselector_str += ",";
                    }
                    dummycount++;
                }
            }

            for (i = 0; i < dummycount; i++)
            {
                cssselector_str += "," + dummystr;
            }



            return cssselector_str;
        }
    };

    // position getter
    _pComponent._getScreenPosition = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var elem_pos = nexacro._getElementScreenPosition(control_elem);

            var screenLeft = elem_pos.x;
            var screenTop = elem_pos.y;
            return { x: screenLeft, y: screenTop };
        }
        return { x: 0, y: 0 };
    };

    _pComponent._getWindowPosition = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var border = this._getCurrentStyleBorder();
            var elem_pos = nexacro._getElementXYInWindow(control_elem.handle);
            var windowLeft = elem_pos[0] - (border ? border._getBorderLeftWidth() : 0);
            var windowTop = elem_pos[1] - (border ? border._getBorderTopWidth() : 0);
            return { x: windowLeft, y: windowTop };
        }
        return { x: 0, y: 0 };
    };

    _pComponent._getClientWidth = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            return control_elem.getClientWidth();
        }
        return 0;
    };

    _pComponent._getClientHeight = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            return control_elem.getClientHeight();
        }
        return 0;
    };

    _pComponent._getClientLeft = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            return control_elem.getClientLeft();
        }
        return 0;
    };

    _pComponent._getInnerWidth = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var width = control_elem.inner_width;
            if (control_elem._apply_client_padding)
            {
                var padding = control_elem.padding ? control_elem.padding : control_elem._padding_info;
                if (padding)
                {
                    width -= padding.left + padding.right;
                }
            }

            return width;
        }

        return 0;
    };

    _pComponent._getInnerHeight = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var height = control_elem.inner_height;
            if (control_elem._apply_client_padding)
            {
                var padding = control_elem.padding ? control_elem.padding : control_elem._padding_info;
                if (padding)
                {
                    height -= padding.top + padding.bottom;
                }
            }

            return height;
        }
        return 0;
    };

    _pComponent._getClientTop = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            return control_elem.getClientTop();
        }
        return 0;
    };

    // 누적된 zoomfactor 얻기
    _pComponent._getCumulativeZoomFactor = function ()
    {
        var comp = this;
        var zoomfactor = 100;
        while (comp && !(comp instanceof nexacro.Frame))
        {
            if (comp._getZoom)
            {
                var value = comp._getZoom();
                if (value != 100)
                    zoomfactor *= (value / 100.0);
            }
            comp = comp._p_parent;
        }

        return zoomfactor;
    };

    // Parent의 Scroll 크기 결정에 영향을 주는 고정된 right,bottom offset값을 리턴한다.
    _pComponent._getFixedOffsetValue = function ()
    {
        var r, b, val;

        if (this._p_right != null)
        {
            // right일때 음수값인지 체크
            // %이면 100%보다 큰 값인지 체크

            r = 0;
        }
        else if (this._p_width != null)
        {
            val = this._p_width;
            if (typeof (val) == "string" && val.indexOf("%") >= 0)
            {
                // 100%이면 right와 같다.
                // 100% 보다 크면 무조건 스크롤바가 생긴다.
                if (parseFloat(val) <= 100)
                    r = 0;
                else
                    r = this.getOffsetRight();
            }
            else
                r = this.getOffsetRight();
        }

        if (this._p_bottom != null)
        {
            b = 0;
        }
        else if (this._p_height != null)
        {
            val = this._p_height;
            if (typeof (val) == "string" && val.indexOf("%") >= 0)
            {
                if (parseFloat(val) <= 100)
                    b = 0;
                else
                    b = this.getOffsetBottom();
            }
            else
                b = this.getOffsetBottom();
        }

        return { right: r, bottom: b };
    };

    // scroll getter
    _pComponent._getScrollEventType = function (oldpos, newpos, min, max, dir)
    {
        var type;

        if (min == max)
            return type;

        if (oldpos > newpos && newpos > min)
        {
            if (dir == "h")
                type = "left";
            else
                type = "up";
        }
        else if (oldpos < newpos && newpos < max)
        {
            if (dir == "h")
                type = "right";
            else
                type = "down";
        }
        else if (newpos == min)
        {
            if (oldpos == newpos)// || newpos < min)
            {
                type = "firstover";
            }
            else
            {
                type = "first";
            }
        }
        else if (newpos == max)
        {
            if (oldpos == newpos)// || newpos > max)
            {
                type = "lastover";
            }
            else
            {
                type = "last";
            }
        }

        return type;
    };

    _pComponent._getScrollBarSize = function ()
    {
        var scrollbarsize = this._p_scrollbarsize;

        if (!nexacro._isNull(scrollbarsize))
            return scrollbarsize;

        var env = this._env;
        scrollbarsize = env._p_scrollbarsize;

        if (!nexacro._isNull(scrollbarsize))
            return scrollbarsize;

        return this._default_scrollbarsize;
    };

    _pComponent._getScrollIndicatorSize = function ()
    {
        var scrollindicatorsize = this._p_scrollindicatorsize;

        if (!nexacro._isNull(scrollindicatorsize))
            return scrollindicatorsize;

        var env = this._env;
        scrollindicatorsize = env._p_scrollindicatorsize;

        if (!nexacro._isNull(scrollindicatorsize))
            return scrollindicatorsize;

        return this._default_scrollindicatorsize;
    };

    _pComponent._getHScrollBarSize = function ()
    {
        var scrollbartype = this._getHScrollBarType();
        if (scrollbartype == "autoindicator" || scrollbartype == "indicator")
            return this._getScrollIndicatorSize();
        else
            return this._getScrollBarSize();
    };

    _pComponent._getVScrollBarSize = function ()
    {
        var scrollbartype = this._getVScrollBarType();
        if (scrollbartype == "autoindicator" || scrollbartype == "indicator")
            return this._getScrollIndicatorSize();
        else
            return this._getScrollBarSize();
    };

    _pComponent._getHScrollBarType = function ()
    {
        var hscrollbartype = this._hscrollbartype;
        if (hscrollbartype != "" && !nexacro._isNull(hscrollbartype))
            return hscrollbartype;
        var scrollbartype = this._p_scrollbartype;
        var env = this._env;

        function _splitScrollBarType(str)
        {
            var ret = new Array(2);
            var h, v;

            if (scrollbartype)
            {
                var arr = nexacro._toString(scrollbartype).toLowerCase().split(" ");

                for (var i = 0; i < arr.length; i++)
                {
                    switch (arr[i])
                    {
                        case "none": case "auto": case "fixed": case "autoindicator": case "indicator": case "default":
                            if (i == 0)
                                h = arr[i];
                            else if (i == 1)
                                v = arr[i];
                            break;

                        default:
                            break;
                    }
                }

                if (!v)
                    v = h;

                ret[0] = h;
                ret[1] = v;
            }

            return ret;
        }

        var types = _splitScrollBarType(scrollbartype);

        hscrollbartype = types[0];

        if (!hscrollbartype || hscrollbartype == "default")
        {
            if (env)
                scrollbartype = env._p_scrollbartype;

            if (scrollbartype == "" || nexacro._isNull(scrollbartype))
                scrollbartype = this._default_scrollbartype;

            types = _splitScrollBarType(scrollbartype);

            hscrollbartype = types[0];
        }

        return hscrollbartype;
    };

    _pComponent._getVScrollBarType = function ()
    {
        var vscrollbartype = this._vscrollbartype;
        if (vscrollbartype != "" && !nexacro._isNull(vscrollbartype))
            return vscrollbartype;

        var scrollbartype = this._p_scrollbartype;
        var env = this._env;

        function _splitScrollBarType(str)
        {
            var ret = new Array(2);
            var h, v;

            if (scrollbartype)
            {
                var arr = nexacro._toString(scrollbartype).toLowerCase().split(" ");

                for (var i = 0; i < arr.length; i++)
                {
                    switch (arr[i])
                    {
                        case "none": case "auto": case "fixed": case "autoindicator": case "indicator": case "default":
                            if (i == 0)
                                h = arr[i];
                            else if (i == 1)
                                v = arr[i];
                            break;

                        default:
                            break;
                    }
                }

                if (!v)
                    v = h;

                ret[0] = h;
                ret[1] = v;
            }

            return ret;
        }


        var types = _splitScrollBarType(scrollbartype);

        vscrollbartype = types[1];

        if (!vscrollbartype || vscrollbartype == "default")
        {
            if (env)
                scrollbartype = env._p_scrollbartype;

            if (scrollbartype == "" || nexacro._isNull(scrollbartype))
                scrollbartype = this._default_scrollbartype;

            types = _splitScrollBarType(scrollbartype);

            vscrollbartype = types[1];
        }

        return vscrollbartype;
    };

    _pComponent._getScrollable = function ()
    {
        if (!this._is_scrollable || !this._isEnable()) return false;
        if (this._p_scrolltype != "none")
        {
            return true;
        }

        return false;
    };

    _pComponent._getScrollWidth = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            if (this._is_scrollable)
                return this._getClientWidth();

            return control_elem.getElementScrollWidth();
        }
        return 0;
    };

    _pComponent._getScrollHeight = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            if (this._is_scrollable)
                return this._getClientHeight();

            return control_elem.getElementScrollHeight();
        }
        return 0;
    };

    _pComponent._getScrollLeft = function ()
    {
        if (!this._is_scrollable)
            return 0;

        var control_elem = this._control_element;
        if (control_elem)
        {
            return control_elem.getElementScrollLeft();
        }
        return 0;
    };

    _pComponent._getScrollTop = function ()
    {
        if (!this._is_scrollable)
            return 0;

        var control_elem = this._control_element;
        if (control_elem)
        {
            return control_elem.getElementScrollTop();
        }
        return 0;
    };

    // etc
    _pComponent._getDragData = function ()
    {
        var ret = null;

        if (this._p_text) ret = this._p_text;

        return ret;
    };

    _pComponent._getParentEnable = function (/*v*/)
    {
        return this._p_parent._real_enable;
    };

    _pComponent._getPopupControl = function ()
    {
        return this._popupcontrol;
    };

    _pComponent._is_popup = function ()
    {
        return false;
    };

    _pComponent._getLocale = function ()
    {
        if (!this._is_locale_control) return;

        const env = this._env;
        var locale = env && env._p_locale ? env._p_locale : nexacro._getLocale();
        var pThis = this;

        while (pThis)
        {
            if (pThis._locale)
            {
                locale = pThis._locale;
                break;
            }
            pThis = pThis._p_parent;
        }

        return locale;
    };

    _pComponent._isRtl = function (comp)
    {
        if (!comp) comp = this;

        //var rtl = comp._rtl;

        while (comp)
        {
            if (comp._rtl !== undefined)
            {
                return comp._rtl;
            }
            comp = comp._p_parent;
        }

        return this._env._rtl;
    };

    // styleObject getter
    _pComponent._getCurrentStylePadding = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            return control_elem.padding ? control_elem.padding : control_elem._padding_info;
        }
        return undefined;
    };

    _pComponent._getCurrentStyleBorder = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            var border = control_elem.border ? control_elem.border : control_elem._border_info;
            if (control_elem.borderLeftNone || control_elem.borderRightNone || control_elem.borderTopNone || control_elem.borderBottomNone)
            {
                if (border)
                {
                    var values = [border.top.value, border.right.value, border.bottom.value, border.left.value];

                    if (control_elem.borderLeftNone)
                        values[3] = "0px solid transparent";
                    if (control_elem.borderRightNone)
                        values[1] = "0px solid transparent";
                    if (control_elem.borderTopNone)
                        values[0] = "0px solid transparent";
                    if (control_elem.borderBottomNone)
                        values[2] = "0px solid transparent";

                    values = values.join(",");
                    return nexacro.BorderObject(values);
                }
            }
            return border;
        }
        return undefined;
    };

    _pComponent._getCurrentStyleEdge = function ()
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            return control_elem.edge ? control_elem.edge : control_elem._edge_info;
        }
        return undefined;
    };

    _pComponent._getSettedColorObject = function ()
    {
        return this._color;
    };

    _pComponent._getSettedFontObject = function ()
    {
        return this._font;
    };

    _pComponent._getSettedWordSpacingObject = function ()
    {
        return this._wordspacing;
    };

    _pComponent._getSettedLetterSpacingObject = function ()
    {
        return this._letterspacing;
    };

    _pComponent._getSettedTextDecorationObject = function ()
    {
        return this._textdecoration;
    };

    _pComponent._getSettedBorderRadiustObject = function ()
    {
        return this._borderradius;
    };

    _pComponent._getSettedBorderObject = function ()
    {
        return this._border;
    };

    _pComponent._getSettedBackgroundObject = function ()
    {
        return this._background;
    };

    _pComponent._getSettedEdgeObject = function ()
    {
        return this._edge;
    };

    _pComponent._getSettedCursorObject = function ()
    {
        return this._cursor;
    };

    _pComponent._getSettedOpacityObject = function ()
    {
        return this._opacity;
    };

    _pComponent._getSettedBoxShadowObject = function ()
    {
        return this._boxshadow;
    };

    // component status getter
    _pComponent._isVisible = function ()
    {
        var form = this;
        while (form != null)
        {
            if (form._p_visible == false)
                return false;
            if (form._is_window)
                break;

            form = form._p_parent;
        }
        return true;
    };

    _pComponent._isEnable = function ()
    {
        var form = this;
        while (form != null)
        {
            if (form._is_frame && form._is_popup_frame)
                break;

            if (form._real_enable == false || form._p_enable == false)
                return false;

            form = form._p_parent;
        }
        return true;
    };

    _pComponent._isEnableRedraw = function ()
    {
        var comp = this._getFromComponent(this);

        if (!comp)
            return true;

        return comp._p_enableredraw;
    };

    _pComponent._isEditableComponent = function (edittype)
    {
        if (this.readonly !== undefined)
        {
            if (edittype && edittype.match(this._type_name))
            {
                if (this._type_name == "Edit")
                {
                    var obj = edittype.split(",");
                    for (var i = 0; i < obj.length; i++)
                    {
                        if (obj[i].trim() == this._type_name)
                            return true;
                    }
                }
                else
                    return true;
            }
            else if (edittype === undefined || edittype == "" || edittype == "All")
            {
                return true;
            }
            else
                return false;
        }
        return false;
    };

    _pComponent._isFocusAcceptable = function ()
    {
        return this._is_focus_accept;
    };

    _pComponent._isPopupVisible = function ()
    {
        return false;
    };

    _pComponent._isPopupContains = function ()
    {
        return this._is_popupcontains ? this._is_popupcontains : false;
    };

    _pComponent._isWheelScrollable = function (delta)
    {
        var control_elem = this._control_element;
        if (!control_elem) return false;

        var st = control_elem.scroll_top;
        var sh = control_elem.container_maxheight;
        var ch = this._getClientHeight();

        if ((st + ch >= sh && delta < 0) || (st == 0 && delta > 0))
        {
            return false;
        }
        return true;
    };

    _pComponent._isSelfCalculationPosition = function ()
    {
        //return this._is_calc_position ? this._is_calc_position : false;
        return this._is_subcontrol ? true : false;
    };
    // finder
    _pComponent._findForm = function (comp)
    {
        var form = comp;
        while (form && form._is_form == false)
        {
            form = form._p_parent;
        }
        return form;
    };

    _pComponent._findDataset = function (id)
    {
        if (id && id.length > 0)
        {
            var ds = this[id];

            if (ds && (ds._type_name == "Dataset"))
            {
                return ds;
            }

            if (this._refform)
            {
                var refform = this._refform;
                if (refform._p_parent && refform._p_parent._is_view)
                {
                    if (refform._p_parent._p_viewdataset == id)
                        return refform._p_parent.getViewDataset();
                    else
                        ds = refform[id];
                }
                else
                {
                    ds = refform[id];
                }

                if (ds && (ds._type_name == "Dataset"))
                {
                    return ds;
                }

                var _p = refform.opener || refform._p_parent;
                if (_p && _p._findDataset)
                    return _p._findDataset(id);
                else if (_p)
                    return _p.lookup(id);
            }
        }

        return undefined;
    };

    _pComponent._find_lastFocused = function ()
    {
        var form = this._getMainForm();
        if (!form)
            return null;

        var last_focus = form._last_focused;
        while (last_focus && last_focus._hasContainer())
        {
            var child_last_focus = last_focus._getLastFocused();
            if (!child_last_focus)
                break;
            last_focus = child_last_focus;
        }

        return last_focus;
    };

    _pComponent._hasContainer = function ()
    {
        if (this._is_form || this._is_container || this._is_containerset || this._is_panel)
        {
            return true;
        }

        return false;
    };

    _pComponent._contains = function (oDescendant)
    {
        while (oDescendant && !oDescendant._window)
        {
            if (oDescendant == this) return true;
            oDescendant = oDescendant._p_parent;
        }

        return false;
    };

    //setter
    _pComponent._setControl = function (typename)
    {
        this._is_subcontrol = true;
        if (typename)
            this._type_name = typename;
        else
            this._type_name = this.on_get_css_assumedtypename() + "Control";
    };

    _pComponent._setFocus = function (bResetScroll, calledby, block_inner_focus)
    {
        // calledby : setFocus를 호출한 주체(동작)
        // - 0: tabkey forward
        // - 1: tabkey backward (shift+tab)
        // - 2: down key
        // - 3: up key
        // - undefined: etc

        /*
        if (calledby == 0)
        {
            this._focus_reason = "tabkey";
        }
        else if (calledby == 1)
            {
            this._focus_reason = "shifttabkey";
        }
        */

        // Modal 아래에 가려진 컴포넌트인 경우 setFocus 차단.
        var win = this._getRootWindow();
        var is_active_layer = win._isActiveLayerComponent(this);
        if (!is_active_layer)
            return;

        if (calledby > -1 || calledby < 4)
            this._focus_direction = calledby;
        else
            this._focus_direction = -1;

        if (block_inner_focus == true)
        {
            this._block_inner_focus = true;

            if (this._env._p_enableaccessibility)
            {
                var bInnerFocus = (this._is_container || this instanceof nexacro.Tab) && this._focus_direction == 3 ? false : true;
                this.setFocus(bResetScroll, bInnerFocus);
            }
            else
            {
                this.setFocus(bResetScroll);
            }

            this._block_inner_focus = false;
        }
        else
        {
            return this.setFocus(bResetScroll);
        }
    };

    _pComponent._setHscrollPos = function (v)
    {
        this._hscroll_pos = nexacro._toInt(v);
    };

    _pComponent._setVscrollPos = function (v)
    {
        this._vscroll_pos = nexacro._toInt(v);
    };

    _pComponent._setEnable = function (v)
    {
        if (this._is_enable_changing)
            return false;

        var enable_flag = (v && this._p_enable);
        if (this._real_enable != enable_flag)
        {
            this._real_enable = enable_flag;

            this._is_enable_changing = true;
            this._changeStatus("disabled", !enable_flag);
            this._is_enable_changing = false;

            this.on_apply_prop_enable(this._real_enable);

            return true;
        }
        return false;
    };

    _pComponent._setLocale = function (v)
    {
        if (this.locale)
            return;

        if (this._locale != v)
        {
            this._locale = v;
            this.on_apply_locale(v);
        }
    };

    _pComponent._setPopupContains = function (is_popupcontains)
    {
        this._is_popupcontains = is_popupcontains;
    };

    // Parent의 Inherit Style Prop Value를 강제로 설정
    _pComponent._setInheritStyleValues = function (parent_comp)
    {
        if (this._control_element)
        {
            if (parent_comp)
            {
                this._control_element.setElementFont(parent_comp._getCurrentStyleInheritValue("font"));
                this._control_element.setElementColor(parent_comp._getCurrentStyleInheritValue("color"));
                this._control_element.setElementWordSpacing(parent_comp._getCurrentStyleInheritValue("wordSpacing"));
                this._control_element.setElementLetterSpacing(parent_comp._getCurrentStyleInheritValue("letterSpacing"));
            }
        }
    };

    _pComponent._setAdjustProps = function (left, top, width, height)
    {
        this._setAdjustPosition(left, top);
        this._setAdjustSize(width, height);
    };
    _pComponent._setAdjustPosition = function (left, top)
    {
        this._adjust_left = this._adjustFloatingPoint(left);
        this._adjust_top = this._adjustFloatingPoint(top);
    };
    _pComponent._setAdjustSize = function (width, height)
    {
        this._adjust_width = this._adjustFloatingPoint(width);
        this._adjust_height = this._adjustFloatingPoint(height);
        //this._update_layoutbasis();
    };
    _pComponent._update_layoutbasis = function ()
    {
        if (this._isFluidContainer())
        {
            var control_elem = this.getElement();
            if (control_elem)
            {
                var layoutbasis = this._getLayoutBasis();
                if (layoutbasis)
                {
                    control_elem._setElementLayoutBasis(layoutbasis);
                }
            }
        }
    };

    _pComponent._getLayoutBasis = function ()
    {
        var layouttype = "horizontal";
        var manager = nexacro._getLayoutManager();
        if (!manager) return;
        var form = this._is_group ? this._group_panel : this._getForm();
        layouttype = manager.getLayoutProperty(form, "type");
        if (layouttype == "default")
        {
            return;
        }

        var pThis = this;
        //if (this._is_innerform)
        //    pThis = this._p_parent;

        var layoutbasis;
        var fit_size = [0, 0];

        var width = pThis._p_width; // ? pThis.width : pThis._width;
        var height = pThis._p_height; // ? pThis.height : pThis._height;      
        if (pThis._fit_height > -1)
            height = pThis._fit_height; //정리 필요함 Temporary
        if (pThis._fit_width > -1)
            width = pThis._fit_width;

        var minwidth = pThis._p_minwidth ? pThis._p_minwidth + "px" : undefined;
        var maxwidth = pThis._p_maxwidth ? pThis._p_maxwidth + "px" : undefined;

        var minheight = pThis._p_minheight ? pThis._p_minheight + "px" : undefined;
        var maxheight = pThis._p_maxheight ? pThis._p_maxheight + "px" : undefined;

        var is_percent_width = (typeof (width) == "string" && width.indexOf("%") >= 0);
        var is_percent_height = (typeof (height) == "string" && height.indexOf("%") >= 0);

        var is_pixel_width = (typeof (width) == "string" && width.indexOf("px") > -1);
        var is_pixel_height = (typeof (height) == "string" && height.indexOf("px") > -1);

        if (pThis._p_fittocontents == "width")
        {
            //fit_size = pThis._on_getFitSize();

            width = this._adjust_width + "px";
            height = is_percent_height ? height : height + "px";
        }
        else if (pThis._p_fittocontents == "height")
        {
            //fit_size = this._on_getFitSize();

            width = is_percent_width ? width : width + "px";
            height = this._adjust_height + "px";
        }
        else if (pThis._p_fittocontents == "both")
        {
            //fit_size = pThis._on_getFitSize();

            width = this._adjust_width + "px";
            height = this._adjust_height + "px";
        }
        else
        {
            height = is_percent_height ? height : height + (is_pixel_height ? "" : "px");
            width = is_percent_width ? width : width + (is_pixel_width ? "" : "px");

        }
        layoutbasis = {
            type: layouttype,
            width: width,
            height: height,
            maxwidth: maxwidth,
            maxheight: maxheight,
            minwidth: minwidth,
            minheight: minheight
        };
        return layoutbasis;
    };

    _pComponent._getParentComponent = function ()
    {
        if (this._is_group)
            return this._group_panel;
        var parent = this._p_parent;
        if (parent instanceof nexacro._InnerForm)
            parent = parent._p_parent;
        return parent;
    };

    _pComponent._getAdjustFitPositionHeight = function (height, parent_fittocontents)
    {
        var comp_height, obj, refer_font;
        if (!height) return -1;
        if (parent_fittocontents == "both" || parent_fittocontents == "height")
        {
            if (typeof height === "string" && height.indexOf("%") > -1) /*this._fit_height < 0 && */
            {
                //var form = this._getParentForm();
                var containerComp = this._getParentComponent();
                var info = this._arrange_info;
                if (info && (obj = info.height))
                {
                    //if (containerComp && containerComp._is_created)
                    var distance = obj.distance;
                    var comp = this._findComponentForArrange(obj.compid);
                    if (!comp)
                    {
                        if (distance.indexOf("rem") > -1 || distance.indexOf("em") > -1)
                        {
                            comp = this;
                            if (distance.indexOf("rem") > -1)
                            {
                                comp = this._getMainFrame();
                            }

                            refer_font = comp._getReferenceAbsoluteFont();
                            comp_height = refer_font ? refer_font._size : 1;
                        }
                        else
                        {
                            comp_height = containerComp._basis_height ? containerComp._basis_height : containerComp._height;
                        }
                    }
                    else
                    {
                        comp_height = comp._adjust_height;
                    }

                    height = this._convToPixel(distance, comp_height);//comp._getClientHeight());
                }
            }
        }

        return height;
    };

    _pComponent._getAdjustFitPositionWidth = function (width, parent_fittocontents)
    {
        if (!width) return -1;
        var comp_width, obj, refer_font;
        if (parent_fittocontents == "both" || parent_fittocontents == "width")
        {
            if (typeof width === "string" && width.indexOf("%") > -1)
            {
                var containerComp = this._getParentComponent();
                var info = this._arrange_info;
                if (info && (obj = info.width))
                {
                    //if (containerComp && containerComp._is_created)
                    var distance = obj.distance;
                    var comp = this._findComponentForArrange(obj.compid);
                    if (!comp)
                    {
                        if (distance.indexOf("rem") > -1 || distance.indexOf("em") > -1)
                        {
                            comp = this;
                            if (distance.indexOf("rem") > -1)
                            {
                                comp = this._getMainFrame();
                            }

                            refer_font = comp._getReferenceAbsoluteFont();
                            comp_width = refer_font ? refer_font._size : 1;
                        }
                        else
                        {
                            comp_width = containerComp._basis_width ? containerComp._basis_width : containerComp._width;
                        }
                    }
                    else
                    {
                        comp_width = comp._adjust_width;
                    }
                    width = this._convToPixel(distance, comp_width);//comp._getClientHeight());
                }
            }
        }
        return width;
    };

    _pComponent._calcBasisSize = function ()
    {
        var width = this._p_width;
        var containerComp = this._getParentComponent();
        if (!containerComp) return;
        if (width)
        {
            if (typeof width === "string" && width.indexOf("%") > -1)
            {
                if (!containerComp._basis_width)
                    return;
                this._basis_width = this._convToPixel(width, containerComp._basis_width);
            }
            else
                this._basis_width = +width;
        }

        var height = this._p_height;
        if (height)
        {
            if (typeof height === "string" && height.indexOf("%") > -1)
            {
                if (!containerComp._basis_height)
                    return;
                this._basis_height = this._convToPixel(height, containerComp._basis_height);
            }
            else
                this._basis_height = +height;

        }
        //right
        var right = this._p_right;
        if (right)
        {
            if (!containerComp._basis_width)
                return;
            if (typeof right === "string" && right.indexOf("%") > -1)
            {
                this._basis_width = containerComp._basis_width - this._convToPixel(right, containerComp._basis_width);
            }
            else
            {
                this._basis_width = containerComp._basis_width - +right - this._adjust_left;
            }

        }
        //bottom
        var bottom = this._p_bottom;
        if (bottom)
        {
            if (!containerComp._basis_height)
                return;
            if (typeof bottom === "string" && bottom.indexOf("%") > -1)
            {
                this._basis_height = containerComp._basis_height - this._convToPixel(bottom, containerComp._basis_height);
            }
            else
            {
                this._basis_height = containerComp._basis_height - +bottom - (this._adjust_top > 0 ? this._adjust_top : 0);
            }
        }
    };
    _pComponent._setContainerCalcedContainer = function (is_calc)
    {
        if (this._isFluidContainer())
        {
            var parent = this._is_group ? this._group_panel : this._p_parent;
            if (parent)
                parent._setCalcedContainer(is_calc);
        }
    };
    _pComponent._setCalcedContainer = nexacro._emptyFn;

    _pComponent._setContentSize = function (width, height)
    {
        this._width = this._adjustFloatingPoint(width);
        this._height = this._adjustFloatingPoint(height);
    };

    _pComponent._setContentInfo = function (content)
    {
        var control_elem = this.getElement();
        if (!control_elem) return;
        var is_move = this._adjust_left != content._adjust_pos[0] || this._adjust_top != content._adjust_pos[1];
        var is_resize = this._adjust_width != content._adjust_pos[2] || this._adjust_height != content._adjust_pos[3];
        this._setContentSize(content._size[0], content._size[1]);
        this._setAdjustProps(content._adjust_pos[0], content._adjust_pos[1], content._adjust_pos[2], content._adjust_pos[3]);
        control_elem._updateInnerElement(content._adjust_pos[2], content._adjust_pos[3]);
        this._update_layoutbasis();
        //if (is_move || is_resize)
        //{           
        //}
        if (is_move)
        {
            //if (this._is_group)
            //    control_elem.setElementPosition(content._adjust_pos[0], content._adjust_pos[1]);
            this.on_fire_onmove(this._adjust_left, this._adjust_top);
        }

        if (is_resize)
        {
            this.on_fire_onsize(this._adjust_width, this._adjust_height);
        }

    };

    // Tab키로 포커스 이동시 다음 대상이 자기자신이면, 자기 자신에서 멈춰야 하는지 여부 체크
    _pComponent._checkContainerTabFocus = function ()
    {
        // true: 자기자신에서 focus를 멈춤
        if (this._hasContainer() && !(this instanceof nexacro._InnerForm))
            return true;

        // false: First TabOrder Child까지 Focus 진입
        return false;
    };

    _pComponent._checkContainerHeadingFocus = function ()
    {
        // true: 자기자신에서 focus를 멈춤
        if (this._hasContainer() && this._env._p_enableaccessibility && this._isAccessibilityEnable() == true && this._isAccessibilityRoleHeading())
            return true;

        // false: First TabOrder Child까지 Focus 진입
        return false;
    };

    _pComponent._isInvalidValue = function (v)
    {
        return false;
    };

    _pComponent._convertValueType = function (v, type, fn)
    {
        var datatyperule = this._env._p_datatyperule;
        if (datatyperule == "1.0")
            return v;

        if (nexacro._isNull(v))
            return v;

        if (fn && (typeof fn) == "function")
            return fn(v);

        var ret;
        switch (type)
        {
            case 1:                     //int
                ret = parseInt(v);
                break;
            case 2:                     //float
                ret = parseFloat(v);
                break;
            default:                    //string
                ret = nexacro._toString(v);
                break;
        }

        return ret;
    };

    _pComponent._adjustFloatingPoint = function (floatingPoint)
    {
        // under / over 계산된 floatingPoint를 절삭 / 절상
        // 예외 발생시 케이스보고 추가 처리...
        floatingPoint = +floatingPoint;
        var diff = floatingPoint.toFixed(3) - floatingPoint;
        if (diff < 0)
        {
            if (diff.toFixed(3) == 0)
            {
                floatingPoint = Math.floor(floatingPoint * 1000) / 1000;
            }
        }
        else if (diff > 0)
        {
            if (diff.toFixed(3) == 0)
            {
                floatingPoint = Math.floor(floatingPoint * 1000) / 1000;
            }
        }
        return floatingPoint;
    };

    _pComponent._getContentsmaxSize = function (objContainer)
    {
        var manager = nexacro._getLayoutManager();
        if (!manager)
            return;

        return manager.getContentsMaxRect(objContainer);
    };

    _pComponent._isAccessibilityCotainerComponent = function ()
    {
        return false;
    };

    _pComponent._restorePosition = function () 
    {
        //trace(this.id, this._p_left, this._p_top, this._p_right, this._p_bottom, this._p_width, this._p_height);
        this._parseArrangeInfo(this._p_left, this._p_top, this._p_right, this._p_bottom, this._p_width, this._p_height);
        this._update_position(this._isRtl()); //rtl 의 경우 무조건 업데이트
        this._update_layoutbasis();
    };

    _pComponent._getUseSoftKeyboardValue = function (v)
    {
        const env = this._env;
        v = v !== undefined ? this._p_usesoftkeyboard : env._p_usesoftkeyboard;
        this._use_softkeyboard = env._p_enabletouchsoftkeyboard ? (v ? 2 : 0) : 1;
        return v;
    };

    _pComponent._convertObjectContents = function (str)
    {
        var normalDataset = null, node = null;
        if (typeof str == "object")
        {
            node = str["Dataset"];

            if (!node)
                return null;

            normalDataset = new nexacro.NormalDataset(node.id, this);
            normalDataset._setContents(node);
        }
        else
        {
            var doc = nexacro._parseXMLDocument(str);
            node = doc.getElementsByTagName("Dataset")[0];

            if (!node)
                return null;

            var idstr = node.attributes[0].value;

            normalDataset = new nexacro.NormalDataset(idstr, this);

            // has subcontents
            if (node.firstChild)
            {
                var childnode = node.firstChild;

                var strXML = "";
                while (childnode)
                {
                    if (node.nodeType == 1)
                    {
                        strXML += nexacro._documentToXml(childnode);
                    }
                    childnode = childnode.nextSibling;
                }
                normalDataset._setContents(strXML);
            }
        }
        return normalDataset;
    };

    //for moduledeveloper contents property
    _pComponent._setContents = nexacro._emptyFn;

    //==============================================================================
    // nexacro.PopupControl
    //==============================================================================
    nexacro.PopupControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);


    };

    var _pPopupControl = nexacro.PopupControl.prototype = nexacro._createPrototype(nexacro.Component, nexacro.PopupControl);
    _pPopupControl._type_name = "PopupControl";

    /* control */
    _pPopupControl._attached_comp = null;
    _pPopupControl._call_comp = null;

    /* default properties */
    _pPopupControl._p_visible = false;
    _pPopupControl._p_accessibilityrole = "application";

    /* internal variable */
    _pPopupControl._is_window = true;
    _pPopupControl._is_subcontrol = true;
    _pPopupControl._is_popup_control = true;
    _pPopupControl._is_simple_control = true;
    _pPopupControl._is_selfclose = true;

    _pPopupControl._default_zindex = nexacro._zindex_popup;
    _pPopupControl._track_capture = true;

    //===============================================================
    // nexacro.PopupControl : PopupComponent's Create & Update
    //===============================================================

    _pPopupControl.on_create_control_element = function (parent_elem)
    {
        var control_elem = this.on_create_popup_control_element(parent_elem);
        /*if (control_elem && this._default_zindex > 0)
        {
            control_elem.setElementZIndex(this._default_zindex);
        }*/
        return control_elem;
    };

    _pPopupControl.on_created = function (_window)
    {
        if (!this._is_created)
        {
            nexacro.Component.prototype.on_created.call(this, _window);
        }

        // 팝업이 화면에 보이지 않아도 body의 스크롤 영역을 차지하게 되기때문에 작게 만들어 구석으로 배치
        var control_elem = this._control_element;

        //this.attachHookEvent();



        if (!this._p_visible && control_elem)
        {
            control_elem.setElementPosition(0, 0);
            control_elem.setElementSize(1, 1);
        }
    };

    _pPopupControl.on_created_contents = function (win)
    {
        // 팝업이 화면에 보이지 않아도 body의 스크롤 영역을 차지하게 되기때문에 작게 만들어 구석으로 배치
        var control_elem = this._control_element;
        if (!this._p_visible && control_elem)
        {
            control_elem.setElementPosition(0, 0);
            control_elem.setElementSize(1, 1);

            this._setInheritStyleValues(this);
        }
    };


    _pPopupControl.destroyComponent = function ()
    {
        this._is_alive = false;

        if (this._p_visible)
        {
            nexacro._removePopupComponent(this);
            this._p_visible = false;
        }

        const env = this._env;
        if (env && env._p_enableaccessibility)
        {
            if (env._a11yHistoryList && !this._is_subcontrol)
            {
                env._remove_accessibility_history(this);
            }
        }

        var _window = this._getWindow();
        if (_window && this._track_capture)
        {
            _window._releaseCaptureLock(this);
            _window._releaseCaptureLock(this._attached_comp);
            this._track_capture = false;
        }

        if (this._attached_comp)
        {
            this._detach(this._attached_comp);
        }
        this._call_comp = null;

        //return nexacro.Component.prototype.destroyComponent.call(this);
        if (this._p_parent && this._p_parent.removeChild)
        {
            this._p_parent.removeChild(this.id);
        }
        else if (_window)
        {
            _window._removeFromCurrentFocusPath(this);
        }

        //this.disattachHookEvent();


        if (this._control_element)
        {
            this._control_element.destroy();
            this._control_element = null;
        }
        this._clearEventListeners();
        this.on_destroy_contents();

        this._is_created = false;

        if (this._p_parent)
            this._p_parent = null;

        return true;
    };

    _pPopupControl.on_change_containerRect = function (container_width, container_height)
    {
        var comp = this._attached_comp;
        if (comp && comp != this)
        {
            if (!this._is_created || this._p_visible)
                comp.move(0, 0, container_width, container_height);
        }
    };

    _pPopupControl._contains = function (oDescendant)
    {
        while (oDescendant)
        {
            if (oDescendant == this._attached_comp) return true;
            oDescendant = oDescendant._p_parent;
        }
        return false;
    };

    _pPopupControl.set_visible = function (v)
    {
        if (v === undefined || v === null) return;

        if (this._p_visible != v)
        {
            if (!v)
            {
                var _window = this._getWindow();
                if (_window && this._track_capture)
                {
                    _window._releaseCaptureLock(this._attached_comp);
                }
            }

            this._p_visible = v;

            var control_elem = this._control_element;
            if (!control_elem) return;

            var comp = this._attached_comp;
            var _window = this._getWindow();

            v = nexacro._toBoolean(v);

            control_elem.setElementVisible(v);

            if (this._p_visible)
            {
                if (comp && comp != this)
                {
                    comp.move(this._adjust_left, this._adjust_top, this._getClientWidth(), this._getClientHeight());
                }

                if (!this._is_subcontrol)
                {
                    this._call_comp = this._p_parent._last_focused ? this._p_parent._last_focused : this._p_parent;
                }
            }
            else
            {
                // Visible=false로 변경시 팝업 컴포넌트가 전체화면의 스크롤 영역을 차지하지 않도록
                // 이동 및 최소화 처리
                //control_elem.setElementPosition(-5000, 0);
                //control_elem.setElementSize(1, 1);
            }

            if (this._env._p_enableaccessibility)
            {
                this._setAccessibilityStatHidden(!v);

                if (comp)
                {
                    if (!(comp instanceof nexacro.PopupDiv))
                        comp._setAccessibilityStatExpanded(v);
                    comp._setAccessibilityStatHidden(!v);
                }
            }

            if (this._is_selfclose)
            {
                if (!v)
                {
                    if (comp && comp.on_fire_oncloseup)
                    {
                        comp.on_fire_oncloseup(comp);
                    }

                    nexacro._removePopupComponent(this);
                    _window._removeFromCurrentFocusPath(this, false);

                    if (!this._is_subcontrol)
                    {
                        if (nexacro._Browser == "Runtime")
                        {
                            if (_window._is_active_window)
                            {
                                this._call_comp._on_focus(true);
                            }
                            else
                            {
                                // deactivate 상태에서 focus 동작시 active 상태가 엉키는 문제 (RP 94349)
                                var _form = this._call_comp._getForm();
                                if (_form)
                                {
                                    _form._setLastFocus(this._call_comp);
                                    nexacro.__setLastFocusedElement(this._call_comp.getElement());
                                }
                            }
                        }
                        else
                        {
                            this._call_comp._on_focus(true);
                        }
                    }
                }
                else
                {
                    nexacro._appendPopupComponent(this);

                    //control_elem.setElementZIndex(nexacro._zindex_popup + nexacro._current_popups.length - 1);
                }
            }
        }
    };

    _pPopupControl._properties = [{ name: "visible" }];
    nexacro._defineProperties(_pPopupControl, _pPopupControl._properties);

    _pPopupControl._attach = function (comp)
    {
        this._attached_comp = comp;
        if (!comp._isPopupContains())
            comp._setPopupContains(true);
        var contrl_element = this._control_element;
        if (comp && comp != this && comp._control_element && contrl_element)
        {
            var sub_control_element = comp._control_element;
            if (sub_control_element)
            {
                var sub_parent = sub_control_element.parent_elem;
                if (comp._is_created && sub_parent != contrl_element)
                    sub_control_element._removeFromContainer();

                sub_control_element.parent_elem = contrl_element;
            }

            if (comp._is_created)
            {
                sub_control_element._appendToContainer(contrl_element);
            }
        }
    };

    _pPopupControl._attach_multi = function (comp, sub_comp)
    {
        this._attached_comp = comp;
        this._attached_sub_comp = sub_comp;
        if (!comp._isPopupContains())
            comp._setPopupContains(true);
        var contrl_element = this._control_element;
        if (comp && comp != this && comp._control_element && contrl_element)
        {
            var sub_control_element = comp._control_element;
            if (sub_control_element)
            {
                var sub_parent = sub_control_element.parent_elem;
                if (comp._is_created && sub_parent != contrl_element)
                    sub_control_element._removeFromContainer();

                sub_control_element.parent_elem = contrl_element;
            }

            if (comp._is_created)
            {
                sub_control_element._appendToContainer(contrl_element);
            }
        }

        if (!sub_comp._isPopupContains())
            sub_comp._setPopupContains(true);
        var contrl_element = this._control_element;
        if (sub_comp && sub_comp != this && sub_comp._control_element && contrl_element)
        {
            var sub_control_element = sub_comp._control_element;
            if (sub_control_element)
            {
                var sub_parent = sub_control_element.parent_elem;
                if (sub_comp._is_created && sub_parent != contrl_element)
                    sub_control_element._removeFromContainer();

                sub_control_element.parent_elem = contrl_element;
            }

            if (sub_comp._is_created)
            {
                sub_control_element._appendToContainer(contrl_element);
            }
        }
    };

    _pPopupControl._detach = function (comp)
    {
        if (this._attached_comp == comp && comp != this)
        {
            this._attached_comp = null;
            comp._setPopupContains(false);
            var contrl_element = this._control_element;
            var sub_control_element = comp._control_element;
            if (sub_control_element && contrl_element)
            {
                if (comp._is_created)
                {
                    sub_control_element._removeFromContainer();
                }
                sub_control_element.parent_elem = null;
            }
        }
    };

    _pPopupControl._is_popup = function ()
    {
        return this._p_visible;
    };

    _pPopupControl._popup = function (left, top, width, height)
    {
        if (!this._attached_comp)
            return;

        var _window = this._getWindow();
        if (_window && this._track_capture)
        {
            var capture_comp = _window._getCaptureComp(true, false, this._attached_comp);
            if (capture_comp != this._attached_comp)
                _window._setCaptureLock(this._attached_comp, true, false);
        }

        var control_elem = this._control_element;
        if (control_elem)
        {
            _window = this._getWindow();
            if (_window && (_window._wheelZoom != undefined))
            {
                control_elem.setElementZoom(_window._wheelZoom);
                if (_window._wheelZoom != 100)
                {
                    left = left * nexacro._getDevicePixelRatio(control_elem);
                    top = top * nexacro._getDevicePixelRatio(control_elem);
                }
            }

            control_elem.setElementPosition(left, top);
            control_elem.setElementSize(width, height);
            control_elem._showPopOver();
            // this._updateClientSize(control_elem);
        }

        if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
        {
            if (nexacro._called_msg_window)
            {
                nexacro._called_msg_window = false;
                nexacro._OnceCallbackTimer.callonce(this, function ()
                {
                    this.set_visible(true);
                }, 0);
            }
            else
            {
                this.set_visible(true);
            }
        }
        else
        {
            this.set_visible(true);
        }
    };

    _pPopupControl._popupBy = function (from_comp, left, top, width, height, center)
    {
        if (!this._attached_comp /*|| !from_comp*/)
            return;
        var p = { x: 0, y: 0 };
        var _window = this._getWindow();
        if (_window)
        {
            nexacro._flushCommand(_window);

            if (this._track_capture)
            {
                var capture_comp = _window._getCaptureComp(true, false, this._attached_comp);
                if (capture_comp != this._attached_comp)
                    _window._setCaptureLock(this._attached_comp, true, false);
            }
        }

        if (center)
        {
            if (from_comp)
                p = nexacro._getElementPositionInFrame(from_comp.getElement());

            left += p.x;
            top += p.y;
        }
        else
        {
            if (from_comp)
                p = nexacro._getPopupElementPositionInFrame(from_comp.getElement(), left, top, width, height, true);



            left = p.x;
            top = p.y;

        }

        var control_elem = this._control_element;

        if (_window && (_window._wheelZoom != undefined))
        {

            control_elem.setElementZoom(_window._wheelZoom);
            if (_window._wheelZoom != 100)
            {
                left = left * nexacro._getDevicePixelRatio(from_comp.getElement());
                top = top * nexacro._getDevicePixelRatio(from_comp.getElement());
            }
        }
        if (control_elem)
        {
            control_elem.setElementPosition(left, top);
            control_elem.setElementSize(width, height);
        }

        if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
        {
            if (nexacro._called_msg_window)
            {
                nexacro._called_msg_window = false;
                nexacro._OnceCallbackTimer.callonce(this, function ()
                {
                    this.set_visible(true);
                }, 0);
            }
            else
            {
                this.set_visible(true);
            }
        }
        else
        {
            this.set_visible(true);
        }
        if (control_elem)
            control_elem._showPopOver();
    };

    _pPopupControl._closePopup = function ()
    {
        this.set_visible(false);
        var control_elem = this._control_element;
        if (control_elem)
            control_elem._hidePopOver();
    };


    _pPopupControl._findOwnerElementHandle = function ()
    {
        // 팝업이 소속된 Layer에 따라 element의 owner handle이 달라진다.
        var frame;
        var ret = {};
        ret.owner_handle = null;
        ret.is_append = true;
        ret.ref_handle = null;

        var win = this._getWindow();
        if (win)
        {
            var layer_info;
            if (this instanceof nexacro._WaitControl)
            {
                layer_info = {};
                layer_info.popup_zindex = nexacro._zindex_waitcursor;
            }
            else
            {
                layer_info = win._getComponentLayerInfo(this);
            }

            /*if (layer_info.is_modal)
            {
                // modal의 popup: overlay에 append
                frame = layer_info.frame;
                var overlay_elem = frame._modal_overlay_elem;
                ret.owner_handle = overlay_elem.handle;
                ret.is_append = true;
            }
            else*/
            {
                // popupControl은 부모 Component의 container handle 하위에 다른 control로 동일 레벨로 구성한다.
                // 신규 popover spec을 적용했기 때문에 굳이 owner 의 main handle에 붙을 필요 없음.


                const element = this._control_element;
                const parent_elem = this._p_parent ? this._p_parent._control_element : null;
                const owner_elem = (element._is_nc_element) ? parent_elem : parent_elem.getContainerElement(element.position_step);

                const owner_handle = owner_elem.handle;
                ret._is_append = true;
                if (owner_handle)
                {
                    ret.owner_handle = owner_handle;
                    if (owner_handle._linked_element)
                        ret.ref_handle = owner_handle._linked_element.dest_handle;
                }


                /*if (layer_info.ref_first_modal_frame)
                {
                    // main의 popup + modal이 존재하는 상황
                    ///overlay element가 mainframe-simplecontainer 하위에 붙는 구조로 되어 있음(14와 구조변경이 있었음 변경원인은 모름)

                    frame = layer_info.ref_first_modal_frame;
                    if (win.root._control_element.handle && win.root._control_element.handle._linked_element)
                        ret.owner_handle = win.root._control_element.handle._linked_element.dest_handle;  //이때 win.dest_handle._linked_element 는 Mainframe ControlElelement && ret.owner_handle은 simplecontainerelement
                    else
                        ret.owner_handle = win.root._control_element.handle;

                    ret.is_append = false;
                    ret.ref_handle = frame._modal_overlay_elem.handle;
                }
                else
                {
                    // main의 popup + modal이 존재하지 않는 상황
                    ret.owner_handle = win.root._control_element.handle || win.dest_handle;
                    if (win.root._control_element.handle._linked_element)
                    {

                        ret.ref_handle = win.root._control_element.handle._linked_element.dest_handle;
                    }
                    ret._is_append = true;
                }*/
            }
        }

        return ret;
    };

    _pPopupControl._getRootFrame = function ()
    {
        let root_frame;
        const owner_frame = this._getOwnerFrame();
        if (owner_frame)
        {
            const win = owner_frame._getWindow();
            if (win)
            {
                root_frame = win.root;
            }
        }
        else
        {
            const form = this._getRootForm();
            const win = form._getWindow();
            if (win)
            {
                root_frame = win.root;
            }
        }

        return root_frame;
    };

    //==============================================================================
    // nexacro._WaitControl
    //==============================================================================
    nexacro._WaitControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.PopupControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        this._p_visible = false;

        //------------------ internal variable ---------------------//
        this._context_list = [];
        this._is_subcontrol = false; // 직접 keydown 처리
        this._is_simple_control = true; // 직접 keydown 처리

        this._img_elem = null;
        this._image_width = 0;
        this._image_height = 0;
    };

    var __pWaitControl = nexacro._WaitControl.prototype = nexacro._createPrototype(nexacro.PopupControl, nexacro._WaitControl);
    __pWaitControl._type_name = "WaitControl";

    __pWaitControl._is_selfclose = false;
    __pWaitControl._default_zindex = nexacro._zindex_waitcursor;
    __pWaitControl._is_focus_accept = false;

    //===============================================================
    // nexacro._WaitControl : PopupComponent's Create & Update
    //===============================================================
    __pWaitControl.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            this._img_elem = new nexacro.ImageElement(control_elem);
        }
    };

    __pWaitControl.on_created_contents = function (_window)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var img_elem = this._img_elem;
            if (img_elem)
            {
                img_elem.setElementVisible(true);
                img_elem.create(_window);
            }
        }

        //TODO
        //if (this._env._p_enableaccessibility)
        this.on_apply_accessibility();
        this._setAccessibilityStatHidden(true);
    };

    __pWaitControl.on_change_containerRect = function (container_width, container_height)
    {
        var img_elem = this._img_elem;
        if (img_elem)
        {
            var left = Math.round((container_width - this._image_width) / 2);
            var top = Math.round((container_height - this._image_height) / 2);

            img_elem.setElementPosition(left, top);
            img_elem.setElementSize(this._image_width, this._image_height);
        }
    };

    __pWaitControl._getAccessibilityLabel = function (/*accessibility*/)
    {
        return " "; // 출력 방지 (스펙 추가되면 설정) //return "Wait Cursor";
    };

    __pWaitControl._on_loadimage = function (imgurl, w, h)
    {
        if (!this._is_alive)
            return;

        var img_elem = this._img_elem;
        if (img_elem && w > 0 && h > 0)
        {
            this._image_width = w;
            this._image_height = h;

            var bw = this._adjust_width;
            var bh = this._adjust_height;
            var left = Math.round((bw - w) / 2);
            var top = Math.round((bh - h) / 2);

            img_elem.setElementPosition(left, top);
            img_elem.setElementSize(w, h);

            img_elem.setElementImage(nexacro.UrlObject(imgurl));
        }
    };

    __pWaitControl.setImage = function (imageurl)
    {
        var img_elem = this._img_elem;
        if (img_elem)
        {
            var imagesize = nexacro._getImageSize(imageurl, this._on_loadimage, this);
            if (imagesize)
            {
                this._image_width = imagesize.width;
                this._image_height = imagesize.height;

                var bw = this._adjust_width;
                var bh = this._adjust_height;

                var left = Math.round((bw - imagesize.width) / 2);
                var top = Math.round((bh - imagesize.height) / 2);

                img_elem.setElementPosition(left, top);
                img_elem.setElementSize(imagesize.width, imagesize.height);
                img_elem.setElementImage(nexacro.UrlObject(imageurl));
            }
        }
    };

    __pWaitControl.show = function ()
    {
        if (!this._is_created || !this._p_parent)
            return;

        var _window = this._getWindow();
        if (_window)
        {
            var width, height;


            if (_window.root)
            {
                if (!nexacro.ismodule)
                {
                    var frame = _window.root;
                    width = frame.getOffsetWidth();
                    height = frame.getOffsetHeight();
                }
                else
                {
                    width = nexacro._getContainerHandleClientWidth(_window.handle);
                    height = width = nexacro._getContainerHandleClientHeight(_window.handle);
                }
            }
            else
            {
                width = _window.getClientWidth();
                height = _window.getClientHeight();
            }


            _window._setCaptureLock(this, true, true);

            // Window에 fit 하므로 0,0에 배치
            this.move(0, 0, width, height);

            var control_elem = this._control_element;
            if (control_elem)
            {
                control_elem.setElementPosition(0, 0);
                control_elem.setElementSize(width, height);
                control_elem._showPopOver();
            }

            this.set_visible(true);



        }
    };
    __pWaitControl.hide = function ()
    {
        var _window = this._getWindow();
        if (_window)
        {
            _window._updateWrapper(false);
            _window._releaseCaptureLock(this);

            var control_elem = this._control_element;
            if (control_elem)
            {
                control_elem.setElementSize(1, 1);
                control_elem._hidePopOver();
            }
        }

        if (this._is_created && this._is_alive)
        {
            var form = this._p_parent;

            while (form)
            {
                if (form._is_form)
                    break;

                form = form._last_focused;
            }

            this.set_visible(false);

            if (form)
            {
                var last_focus = form._last_focused;
                if (last_focus)
                {
                    //var cursor;
                    if (form._obj_mousemove && (form._obj_mousemove != last_focus))
                    {
                        last_focus._on_afterHideWaitComp("enabled");
                        /*
                        if (form._obj_mousemove instanceof nexacro._WaitControl)
                            cursor = nexacro.CursorObject("arrow");
                        else
                            cursor = form._obj_mousemove._cursor;
                            */
                    }
                    else
                    {
                        last_focus._on_afterHideWaitComp(last_focus._pseudo);
                        //cursor = last_focus._cursor ? last_focus._cursor : null;
                    }
                }
            }



        }
    };

    __pWaitControl._addContext = function (context)
    {
        if (context)
            this._context_list.push(context);
    };

    __pWaitControl._removeContext = function (context)
    {
        if (!context)
            return;
        var idx = nexacro._indexOf(this._context_list, context);
        if (idx >= 0)
        {
            this._context_list[idx] = null;
            delete this._context_list[idx];
            this._context_list.splice(idx, 1);
        }
    };

    __pWaitControl.on_fire_onlbuttondown = function (/*button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp*/)
    {
        return true;
    };

    __pWaitControl._on_keydown = function (elem, keycode/*, altKey, ctrlKey, shiftKey*/)
    {
        if (keycode == nexacro.Event.KEY_TAB)
        {
            elem._event_stop = true;
        }
        else if (keycode == nexacro.Event.KEY_ESC)
        {
            // Stop All Communication
            var context_list = this._context_list;
            var len = context_list.length;
            for (var i = 0; i < len; i++)
            {
                var context = context_list[i];
                if (context && (context._is_form || context._is_application))
                {
                    context._stopTransaction();
                }
            }
        }

        return true;
    };


    nexacro.CanvasComponent = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this.id = this._p_name = id || null;

        //property
        this._p_enableevent = false;

        //--------------- internal variable ---------------------//
        this._apply_client_padding = false;
        this._canvas = null;
        this._drawn = false;

        this._control_element = null;
        this._inner_elem = null;

    };
    var _pCanvasComponent = nexacro._createPrototype(nexacro.Component, nexacro.CanvasComponent);
    nexacro.CanvasComponent.prototype = _pCanvasComponent;
    // overide nexacro.Object
    _pCanvasComponent._type_name = "CanvasComp";

    _pCanvasComponent.on_create_contents = function ()
    {
        var control = this.getElement();
        var tcanvas = new nexacro.CanvasElement(control);
        tcanvas.setElementPosition(0, 0);
        tcanvas.setElementSize(this._getClientWidth(), this._getClientHeight());
        this._canvas = tcanvas;
    };

    // -- All Componets overide this function
    _pCanvasComponent.on_created_contents = function (_window)
    {
        var pCanvas = this._canvas;
        if (pCanvas)
        {
            pCanvas.create(_window);
        }
        this.ondraw(pCanvas);
    };

    _pCanvasComponent._initInner = function ()
    {
        this._apply_status(this._oldstatus, this._status, this._olduserstatus, this._userstatus);

    };

    _pCanvasComponent.on_destroy_contents = function ()
    {
        if (this._canvas)
        {
            this._canvas.destroy();
            this._canvas = null;
        }
    };

    _pCanvasComponent.on_change_containerRect = function (width, height)
    {
        if (this._canvas)
        {
            this._canvas._moveCanvas(0, 0, width, height);
            this._drawn = false;
            this.ondraw(this._canvas);
        }
    };

    // onDraw
    _pCanvasComponent.ondraw = function (/*canvas*/) { };
    _pCanvasComponent.redraw = function ()
    {
        this.ondraw(this._canvas);
    };

    //==============================================================================
    // ButtonCtrl : Button used as Control ==> use Event Notifiers, style control - controlType
    // RepeatPushedButtonCtrl : ButtonCtrl : has repeat push operation
    // TrackButtonCtrl : ButtonCtrl : has mouse track opetation
    //==============================================================================

}

if (!nexacro.HTMLComponent)
{
    class TemplateEngine
    {
        render(template, context = {})
        {
            if (!template)
                return '';

            const replaced = this._interpolate(template, context);
            return replaced;
        }

        _interpolate(text, context)
        {
            return text.replace(
                /\$\{([^|}]+)\|\|?\s*['"]([^'"]*)['"]\}|\$\{([^}]+)\}/g,
                (match, varWithDefault, defaultValue, simpleVar) =>
                {
                    const key = varWithDefault?.trim() || simpleVar?.trim();
                    return context[key] ?? (defaultValue?.trim() || '');
                }
            );
        }
    }

    //--------------------------------------------------------------------------------------------
    // nexacro.ValueChangedEventInfo
    //--------------------------------------------------------------------------------------------

    nexacro.ValueChangedEventInfo = function (obj, id, oldvalue, newvalue)
    {
        this.id = this.eventid = id || "onvaluechanged";
        this.fromobject = this.fromreferenceobject = obj;
        this.oldvalue = oldvalue;
        this.newvalue = newvalue;
    };
    var _pValueChangedEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.ValueChangedEventInfo);
    nexacro.ValueChangedEventInfo.prototype = _pValueChangedEventInfo;
    _pValueChangedEventInfo._type_name = "ValueChangedEventInfo";
    _pValueChangedEventInfo = null;

    //--------------------------------------------------------------------------------------------
    // nexacro.EnableStatusChangedEventInfo
    //--------------------------------------------------------------------------------------------

    nexacro.EnableStatusChangedEventInfo = function (obj, id, enablestatus)
    {
        this.id = this.eventid = id || "onenablestatuschanged";
        this.fromobject = this.fromreferenceobject = obj;
        this.enablestatus = enablestatus;
    };
    var _pEnableStatusChangedEventInfo = nexacro._createPrototype(nexacro.Event, nexacro.EnableStatusChangedEventInfo);
    nexacro.EnableStatusChangedEventInfo.prototype = _pEnableStatusChangedEventInfo;
    _pEnableStatusChangedEventInfo._type_name = "EnableStatusChangedEventInfo";
    _pEnableStatusChangedEventInfo = null;

    //==============================================================================
    // nexacro.HTMLComponent
    //==============================================================================
    nexacro.HTMLComponent = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pHTMLComponent = nexacro._createPrototype(nexacro.Component, nexacro.HTMLComponent);
    nexacro.HTMLComponent.prototype = _pHTMLComponent;
    _pHTMLComponent._type_name = "HTMLComponent";
    _pHTMLComponent._is_simple_control = true;

    /* default properties */
    _pHTMLComponent._p_content = "";

    //===============================================================
    // nexacro.HTMLComponent : Create & Destroy & Update
    //===============================================================
    _pHTMLComponent.on_create_control_element = function (parent_elem)
    {
        const control_elem = new nexacro.HTMLControlElement(parent_elem);
        if (control_elem)
        {
            control_elem.setLinkedControl(this);
            this._control_element = control_elem;
        }
        return control_elem;
    };

    _pHTMLComponent.on_after_created = function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
            control_elem.setElementOverflow("auto"); // Set overflow to 'auto' to prevent content clipping

        this.on_apply_content();
    };

    //===============================================================
    // nexacro.HTMLComponent : Override
    //===============================================================
    _pHTMLComponent.on_getBindableProperties = function ()
    {
        return "value";
    };

    _pHTMLComponent._isFocusAcceptable = function ()
    {
        return this._is_focus_accept;
    };

    //===============================================================
    // nexacro.HTMLComponent : Properties
    //===============================================================
    _pHTMLComponent.set_content = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_content != v)
        {
            this._p_content = v;
            this.on_apply_content();
        }
    };

    _pHTMLComponent.on_apply_content = async function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            const htmlTemplate = nexacro.loadHTMLTemplate(this._p_content);
            const result = await control_elem.setElementHTML(new TemplateEngine().render(htmlTemplate, this));

            if (result)
            {
                const isEnable = this._isEnable();
                this.on_apply_prop_enable(isEnable);
                this.on_fire_oncontentloaded(this, isEnable);
            };
        }
    };

    _pHTMLComponent._on_getFitSize = function ()
    {
        const elem = this.getElement();
        if (elem && elem.handle && elem.handle.scrollWidth > 0)
        {
            return [elem.handle.scrollWidth, elem.handle.scrollHeight];
        }
        return [this._basis_width, this._basis_height];
    };

    _pHTMLComponent.set_value = function (v)
    {
        v = nexacro._toString(v);
        if (this._p_value != v)
        {
            this._p_value = v;
            this.on_apply_value();
        }
    };

    _pHTMLComponent.on_apply_value = async function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            this.on_fire_onvaluechanged(this, this._isEnable());
        }
    };

    _pHTMLComponent._convertValueType = function (v, bapplyrule)
    {
        var ret;
        if (bapplyrule)
            ret = nexacro.Component.prototype._convertValueType.call(this, v);
        else
            ret = nexacro._isNull(v) ? v : nexacro._toString(v);

        return ret;
    };

    _pHTMLComponent.on_change_bindSource = function (propid, ds, row, col)
    {
        if (propid == "value")
        {
            let v = ds.getColumn(row, col);
            v = this._convertValueType(v, true);
            this._setValue(v);
        }
    };

    _pHTMLComponent._setValue = function (v)
    {
        this._p_text = nexacro._toString(v);
        this._p_value = v;

        this.on_apply_value(v);
    };

    _pHTMLComponent.set_enable = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this._p_enable != v)
        {
            this._p_enable = v;
            this.on_apply_prop_enable(v);

        }
    };

    _pHTMLComponent.on_apply_prop_enable = function (v)
    {
        if (this.onenablestatuschanged)
        {
            this.on_fire_onenablestatuschanged(this, v);
        }
    };

    _pHTMLComponent._properties = [{ name: "content" }, { name: "fittocontents" }, { name: "value" }, { name: "enable" }];
    nexacro._defineProperties(_pHTMLComponent, _pHTMLComponent._properties);

    //===============================================================
    // nexacro.HTMLComponent : Methods
    //===============================================================
    _pHTMLComponent.reload = function ()
    {
        this.on_apply_content();
    };

    _pHTMLComponent.querySelector = function (selector)
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return;

        return control_elem.querySelector(selector);
    };

    _pHTMLComponent.querySelectorAll = function (selector)
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return;

        return control_elem.querySelectorAll(selector);
    };

    _pHTMLComponent.getElementById = function (id)
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return;

        return control_elem.getElementById(id);
    };

    _pHTMLComponent.getElementsByTagName = function (name)
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return;

        return control_elem.getElementsByTagName(name);
    };

    _pHTMLComponent.getElementsByClassName = function (name)
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return;

        return control_elem.getElementsByClassName(name);
    };

    _pHTMLComponent.getElementsByName = function (name)
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return;

        return control_elem.getElementsByName(name);
    };

    //===============================================================
    // nexacro.HTMLComponent : Events
    //===============================================================

    _pHTMLComponent.on_fire_oncontentloaded = function (obj, enablestatus)
    {
        if (this.oncontentloaded && this.oncontentloaded._has_handlers)
        {
            var evt = new nexacro.LoadEventInfo(obj, "oncontentloaded", undefined, enablestatus);
            var ret = this.oncontentloaded._fireEvent(this, evt);
            return ret;
        }
        return true;
    };

    _pHTMLComponent.on_fire_onvaluechanged = function (obj, oldvalue, newvalue)
    {
        if (this.onvaluechanged && this.onvaluechanged._has_handlers)
        {
            var evt = new nexacro.ValueChangedEventInfo(this, "onvaluechanged", oldvalue, newvalue);
            return this.onvaluechanged._fireEvent(this, evt);
        }
        return true;
    };

    _pHTMLComponent.on_fire_onenablestatuschanged = function (obj, enablestatus)
    {
        if (this.onenablestatuschanged && this.onenablestatuschanged._has_handlers)
        {
            var evt = new nexacro.EnableStatusChangedEventInfo(obj, "onenablestatuschanged", enablestatus);
            var ret = this.onenablestatuschanged._fireEvent(this, evt);
            return ret;
        }
        return true;
    };

    //===============================================================
    // nexacro.HTMLComponent : Logical Part
    //===============================================================
}

if (_process)
{
    _process = null;
    _pComponent = null;
    _pPopupControl = null;
    __pWaitControl = null;
    _pCanvasComponent = null;
}
