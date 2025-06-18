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

if (!nexacro.TabBarControl)
{
    //==============================================================================
    // nexacro._TabBarItemControl
    //==============================================================================
    class TabBarItemStateMachine
    {
        constructor(owner)
        {
            const states = {
                normal: { select: ["selected"], disable: ["disabled"], pin: ["pinned"], hide: ["hidden"] },
                selected: { unselect: ["!selected"], pin: ["selected", "pinned"] },
                disabled: { enable: ["!disabled"] },
                hidden: { show: ["!hidden"] },
                pinned: { unpin: ["!pinned"], select: ["selected", "pinned"] }
            };

            const actions = {
                normal: {
                    select: () => { owner._changeUserStatus("selected", true); }, // console.log(owner.id + " 🔵 Tab이 선택됨"); },
                    pin: () => { owner._changeUserStatus("pinned", true); }, // console.log(owner.id + " 📌 Tab이 고정됨"); },
                    disable: () => { owner._setEnable(false); }, // console.log(owner.id + " ⚫ Tab이 비활성화됨"); }
                    hide: () => { owner.set_visible(false); } // console.log(owner.id + " ⬛ Tab이 숨겨짐"); }
                },
                selected: {
                    unselect: () => { owner._changeUserStatus("selected", false); }, // console.log(owner.id + " ⚪ Tab 선택 해제됨"); },
                    pin: () => { owner._changeUserStatus("pinnedselected", true); } // console.log(owner.id + " 📌 선택된 Tab이 고정됨"); },
                },
                disabled: {
                    enable: () => { owner._setEnable(true); } // console.log(owner.id + " 🟢 Tab이 다시 활성화됨"); }
                },
                hidden: {
                    show: () => { owner.set_visible(true); } // console.log(owner.id + " Tab이 다시 보임"); }
                },
                pinned: {
                    unpin: () => { owner._changeUserStatus("pinned", false); }, // console.log(owner.id + " 📌 Tab 고정 해제됨"); },
                    select: () => { owner._changeUserStatus("pinnedselected", true); } // console.log(owner.id + " 📌 선택된 Tab이 고정됨"); },
                }
            };

            this.states = states;
            this.currentStates = new Set(["normal"]);
            this.actions = actions;
        }

        transition(event)
        {
            let nextStates = new Set(this.currentStates);
            let triggeredActions = new Set();

            this.currentStates.forEach((state) =>
            {
                const newState = this.states[state]?.[event];
                if (newState)
                {
                    newState.forEach((s) =>
                    {
                        if (s.startsWith("!"))
                        {
                            nextStates.delete(s.substring(1));
                        } else
                        {
                            nextStates.add(s);
                        }
                    });

                    if (this.actions[state]?.[event])
                    {
                        triggeredActions.add(this.actions[state][event]);
                    }
                }
            });

            if (![...nextStates].some((s) => s !== undefined))
            {
                // console.warn(`Invalid transition: ${[...this.currentStates]} cannot handle '${event}'`);
            }
            else
            {
                // console.log(`Transition: ${[...this.currentStates]} -> ${[...nextStates]} on '${event}'`);
                this.currentStates = nextStates;
                triggeredActions.forEach((action) => action());
            }
        }
    };

    nexacro._TabBarItemControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._p_icontext = new nexacro._IconText("icontext", 0, 0, 0, 0, null, null, null, null, null, null, this);
        this._p_pinbutton = new nexacro.Button("pinbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
        this._p_closebutton = new nexacro.Button("closebutton", 0, 0, 0, 0, null, null, null, null, null, null, this);

        this._state_machine = new TabBarItemStateMachine(this);
    };

    var _pTabBarItemControl = nexacro._createPrototype(nexacro.Component, nexacro._TabBarItemControl);
    nexacro._TabBarItemControl.prototype = _pTabBarItemControl;
    _pTabBarItemControl._type_name = "TabBarItemControl";
    _pTabBarItemControl._DEFAULT_BUTTON_SIZE = 16;
    _pTabBarItemControl._DEFAULT_CONTENT_GAP = 4;

    /* internal value */
    _pTabBarItemControl._is_subcontrol = true;
    _pTabBarItemControl._is_focus_accept = false;
    _pTabBarItemControl._use_selected_status = true;

    /* properties */
    _pTabBarItemControl._p_icontext = null;
    _pTabBarItemControl._p_pinbutton = null;
    _pTabBarItemControl._p_closebutton = null;
    _pTabBarItemControl._p_pinbuttonposition = "start";
    _pTabBarItemControl._p_usepinbutton = false;
    _pTabBarItemControl._p_pinbuttonsize = undefined;
    _pTabBarItemControl._p_closebuttonsize = undefined;

    /* internal variable */
    _pTabBarItemControl._linked_frame = null;
    _pTabBarItemControl._pinbuttonwidth = -1;
    _pTabBarItemControl._pinbuttonheight = -1;
    _pTabBarItemControl._closebuttonwidth = -1;
    _pTabBarItemControl._closebuttonheight = -1;
    _pTabBarItemControl._selectstatus = false;
    _pTabBarItemControl._pinstatus = false;
    _pTabBarItemControl._ori_text = undefined;
    _pTabBarItemControl._ori_icon = undefined;
    _pTabBarItemControl._ori_closebuttonvisible = undefined;
    _pTabBarItemControl._ori_pinbuttonvisible = undefined;
    _pTabBarItemControl._ori_icontextvisible = undefined;

    //===============================================================
    // nexacro._TabBarItemControl : Create & Destroy & Update
    //===============================================================
    _pTabBarItemControl.on_create_contents = function ()
    {
        this._registerTooltipTextMessage();
        this._createControl();
    };

    _pTabBarItemControl.on_created_contents = function (win)
    {
        this._bindEvent();
        this._createdControl(win);
    };

    _pTabBarItemControl.on_destroy_contents = function (callremovechild)
    {
        this._unBindEvent();
        this._destroyControls();
    };

    _pTabBarItemControl.on_change_containerRect = function (width, height)
    {
        nexacro.Component.prototype.on_change_containerRect.call(this, width, height);

        this._recalcLayout(width, height);
    };

    //===============================================================
    // nexacro._TabBarItemControl : Properties
    //===============================================================
    _pTabBarItemControl.set_pinbuttonposition = function (val)
    {
        if (this._p_pinbuttonposition != val)
        {
            this._p_pinbuttonposition = val;
            this.on_apply_pinbuttonposition();
        }
    };

    _pTabBarItemControl.on_apply_pinbuttonposition = function ()
    {
        this._recalcLayout();
    };

    _pTabBarItemControl.set_usepinbutton = function (val)
    {
        if (this._p_usepinbutton != val)
        {
            this._p_usepinbutton = val;
            this.on_apply_usepinbutton();
        }
    };

    _pTabBarItemControl.on_apply_usepinbutton = function ()
    {
        this._recalcLayout();
    };

    _pTabBarItemControl.set_pinbuttonsize = function (val)
    {
        if (this._p_pinbuttonsize != val)
        {
            this._p_pinbuttonsize = val;

            if (val)
            {
                const buttonsize = val.split(" ");
                const buttonwidth = +buttonsize[0];
                const buttonheight = (buttonsize[1]) ? +buttonsize[1] : buttonwidth;

                this._pinbuttonwidth = isNaN(buttonwidth) ? this._DEFAULT_BUTTON_SIZE : buttonwidth;
                this._pinbuttonheight = isNaN(buttonheight) ? this._DEFAULT_BUTTON_SIZE : buttonheight;
            }
            else
            {
                this._pinbuttonwidth = -1;
                this._pinbuttonheight = -1;
            }
            this.on_apply_pinbuttonsize();
        }
    };

    _pTabBarItemControl.on_apply_pinbuttonsize = function ()
    {
        this._recalcLayout();
    };

    _pTabBarItemControl.set_closebuttonsize = function (val)
    {
        if (this._p_closebuttonsize != val)
        {
            this._p_closebuttonsize = val;

            if (val)
            {
                const buttonsize = val.split(" ");
                const buttonwidth = +buttonsize[0];
                const buttonheight = (buttonsize[1]) ? +buttonsize[1] : buttonwidth;

                this._closebuttonwidth = isNaN(buttonwidth) ? this._DEFAULT_BUTTON_SIZE : buttonwidth;
                this._closebuttonheight = isNaN(buttonheight) ? this._DEFAULT_BUTTON_SIZE : buttonheight;
            }
            else
            {
                this._closebuttonwidth = -1;
                this._closebuttonheight = -1;
            }
            this.on_apply_closebuttonsize();
        }
    };

    _pTabBarItemControl.on_apply_closebuttonsize = function ()
    {
        this._recalcLayout();
    };

    //===============================================================
    // nexacro._TabBarItemControl : Logical Part
    //===============================================================
    _pTabBarItemControl._createControl = function ()
    {
        const icontext = this._p_icontext;
        const pinbutton = this._p_pinbutton;
        const closebutton = this._p_closebutton;

        if (icontext)
        {
            icontext._setControl();
            icontext.createComponent(true);
        }
        if (pinbutton)
        {
            pinbutton.set_tooltiptext(nexacro._GetSystemErrorMsg(this, this.isPinned() ? `${this._type_name}.${this.pinbutton.id}_unpin` : `${this._type_name}.${this.pinbutton.id}_pin`));
            pinbutton._setControl();
            pinbutton.createComponent(true);
        }
        if (closebutton)
        {
            closebutton.set_tooltiptext(nexacro._GetSystemErrorMsg(this, `${this._type_name}.${this.closebutton.id}`));
            closebutton._setControl();
            closebutton.createComponent(true);
        }
    };

    _pTabBarItemControl._createdControl = function (win)
    {
        const icontext = this._p_icontext;
        const pinbutton = this._p_pinbutton;
        const closebutton = this._p_closebutton;

        if (icontext)
        {
            icontext.on_created(win);
        }
        if (pinbutton)
        {
            pinbutton.on_created(win);
        }
        if (closebutton)
        {
            closebutton.on_created(win);
        }
    };

    _pTabBarItemControl._destroyControls = function ()
    {
        if (this._p_icontext)
        {
            this._p_icontext.destroy();
            this._p_icontext = null;
        }
        if (this._p_pinbutton)
        {
            this._p_pinbutton.destroy();
            this._p_pinbutton = null;
        }
        if (this._p_closebutton)
        {
            this._p_closebutton.destroy();
            this._p_closebutton = null;
        }
        if (this._linked_frame)
        {
            this._linked_frame = null;
        }
        if (this._state_machine)
        {
            this._state_machine = null;
        }
    };

    _pTabBarItemControl._registerTooltipTextMessage = function ()
    {
        // 다국어 처리를 위해 tooltiptext 를 error message로 등록
        // message id rule : "${this._type_name}.${buttonId}[_${state}]"
        //
        let msgId = `${this._type_name}.${this.pinbutton.id}_pin`;

        nexacro.addErrorMessage("ko", msgId, "고정");
        nexacro.addErrorMessage("en", msgId, "Pin");
        nexacro.addErrorMessage("ja", msgId, "ピン留め");
        nexacro.addErrorMessage("zh", msgId, "固定");

        msgId = `${this._type_name}.${this.pinbutton.id}_unpin`;

        nexacro.addErrorMessage("ko", msgId, "고정해제");
        nexacro.addErrorMessage("en", msgId, "Unpin");
        nexacro.addErrorMessage("ja", msgId, "ピン留め解除");
        nexacro.addErrorMessage("zh", msgId, "取消固定");

        msgId = `${this._type_name}.${this.closebutton.id}`;

        nexacro.addErrorMessage("ko", msgId, "닫기");
        nexacro.addErrorMessage("en", msgId, "Close");
        nexacro.addErrorMessage("ja", msgId, "閉じる");
        nexacro.addErrorMessage("zh", msgId, "关闭");
    };

    _pTabBarItemControl._setTemporaryText = function (text)
    {
        const icontext = this._p_icontext;
        if (icontext)
        {
            this._ori_text = icontext.text;

            icontext.set_text(text);
        }
    };

    _pTabBarItemControl._setTemporaryIcon = function (icon)
    {
        const icontext = this._p_icontext;
        if (icontext)
        {
            this._ori_icon = icontext.icon;

            icontext.set_icon(icon);
        }
    };

    _pTabBarItemControl._setTemporaryIconTextVisible = function (visible)
    {
        const icontext = this._p_icontext;
        if (icontext)
        {
            this._ori_icontextvisible = icontext.visible;

            icontext.set_visible(visible);
        }
    };

    _pTabBarItemControl._restoreIconText = function ()
    {
        const icontext = this._p_icontext;
        if (icontext)
        {
            if (this._ori_text)
            {
                icontext.set_text(this._ori_text);
            }
            if (this._ori_icon)
            {
                icontext.set_icon(this._ori_icon);
            }
            this._ori_text = undefined;
            this._ori_icon = undefined;
        }
    };

    _pTabBarItemControl._restoreText = function ()
    {
        const icontext = this._p_icontext;
        if (icontext)
        {
            if (this._ori_text)
            {
                icontext.set_text(this._ori_text);
            }
            this._ori_text = undefined;
        }
    };

    _pTabBarItemControl._restoreIcon = function ()
    {
        const icontext = this._p_icontext;
        if (icontext)
        {
            if (this._ori_icon)
            {
                icontext.set_icon(this._ori_icon);
            }
            this._ori_icon = undefined;
        }
    };

    _pTabBarItemControl._restoreIconTextVisible = function ()
    {
        const icontext = this._p_icontext;
        if (icontext)
        {
            if (this._ori_icontextvisible)
            {
                icontext.set_visible(this._ori_icontextvisible);
            }
            this._ori_icontextvisible = undefined;
        }
    };

    _pTabBarItemControl._setTemporaryCloseButtonVisible = function (visible)
    {
        const closebutton = this._p_closebutton;
        if (closebutton)
        {
            this._ori_closebuttonvisible = closebutton.visible;

            closebutton.set_visible(visible);
        }
    };

    _pTabBarItemControl._restoreCloseButtonVisible = function ()
    {
        const closebutton = this._p_closebutton;
        if (closebutton)
        {
            if (this._ori_closebuttonvisible)
            {
                closebutton.set_visible(this._ori_closebuttonvisible);
            }
            this._ori_closebuttonvisible = undefined;
        }
    };

    _pTabBarItemControl._setTemoraryPinButtonVisible = function (visible)
    {
        const pinbutton = this._p_pinbutton;
        if (pinbutton)
        {
            this._ori_pinbuttonvisible = pinbutton.visible;

            pinbutton.set_visible(visible);
        }
    }

    _pTabBarItemControl._restorePinButtonVisible = function ()
    {
        const pinbutton = this._p_pinbutton;
        if (pinbutton)
        {
            if (this._ori_pinbuttonvisible)
            {
                pinbutton.set_visible(this._ori_pinbuttonvisible);
            }
            this._ori_pinbuttonvisible = undefined;
        }
    };

    _pTabBarItemControl._restoreAll = function ()
    {
        this._restoreIconText();
        this._restoreIconTextVisible();
        this._restoreCloseButtonVisible();
        this._restorePinButtonVisible();
    };

    _pTabBarItemControl._calcFirstCharWidth = function ()
    {
        const icontext = this._p_icontext;
        if (icontext)
        {
            let firstcharwidth = 0;

            const textpadding = this._getCSSStyleValue("textPadding");
            if (textpadding)
            {
                firstcharwidth += textpadding.left + textpadding.right;
            }

            const text = icontext.text[0]; // icontext 의 첫글자 크기를 구한다.
            if (!text)
                return firstcharwidth;

            const font = icontext._getCurrentStyleInheritValue("font");
            const refer_font = icontext._getReferenceAbsoluteFont(font); // use to em / rem
            const textsize = nexacro._getTextSize(text, font, false, undefined, this.wordWrap, this._getCurrentStyleInheritValue("wordSpacing"), this._getCurrentStyleInheritValue("letterSpacing"), undefined, undefined, undefined, refer_font);

            if (textsize && textsize[0] > 0)
            {
                firstcharwidth += textsize[0];
            }
            return firstcharwidth;
        }
    };

    _pTabBarItemControl._canDisplayText = function (display_text_width)
    {
        // 주어진 text 표시 공간이 text 의 첫글자를 tex-padding 을 포함하여 표시할 수 있는지 여부
        return this._calcFirstCharWidth() <= display_text_width;
    };

    _pTabBarItemControl._getAvailableTextDisplayWidth = function (width)
    {
        const icontext = this._p_icontext;
        if (!icontext)
            return width;

        // 아이콘 너비 측정
        this._setTemporaryText("");
        const iconwidth = icontext._on_getFitSize()[0];
        this._restoreText();

        const [pinbuttonwidth,] = this._getPinButtonSize();
        const [closebuttonwidth,] = this._getCloseButtonSize();

        let totalGap = 0;

        if (pinbuttonwidth > 0)
        {
            totalGap += this._DEFAULT_CONTENT_GAP;
        }
        if (closebuttonwidth > 0)
        {
            totalGap += this._DEFAULT_CONTENT_GAP;
        }
        return width - iconwidth - pinbuttonwidth - closebuttonwidth - totalGap;
    };

    _pTabBarItemControl._applyLayoutPriority = function (width)
    {
        // 주어진 width 를 가용공간으로 사용하여 contents 의 layout 우선순위를 적용
        if (!this._is_created_contents)
            return;

        // 레이아웃 우선순위 적용에 의한 임시 설정 복원
        this._restoreAll();

        // 레이아웃 우선순위에 의해 visible 상태나 icon, text 설정이 임시로 변경된 경우, 향후 fitsize 계산에 영향을 주기때문에 여기서 캐쉬 처리
        this._cached_fitsize = this._on_getFitSize();

        // Text 표시 가능 영역 계산
        let avail_width = this._getAvailableTextDisplayWidth(width);
        if (this._canDisplayText(avail_width))
            return;

        this._setTemoraryPinButtonVisible(false);

        // Text 표시 가능 영역 계산
        avail_width = this._getAvailableTextDisplayWidth(width);
        if (this._canDisplayText(avail_width))
            return;

        if (this.isPinned())
        {
            if (this._p_icontext.icon)
            {
                // pinned 이고 icon 이 있으면 icon 만 표시
                this._setTemporaryText("");
            }
            else
            {
                // pinned 이고 icon 이 없으면 text 첫글자를 표시
                const ori_text = this._p_icontext.text;
                if (ori_text.length > 0)
                {
                    this._setTemporaryText(ori_text[0]);
                }
            }
        }
        else if (this.isSelected())
        {
            if (this._p_icontext.icon)
            {
                // selected 이고 icon 이 있으면 icon 을 숨김
                this._setTemporaryIcon("");

                avail_width = this._getAvailableTextDisplayWidth(width);
                if (this._canDisplayText(avail_width))
                    return;

                this._setTemporaryIconTextVisible(false);
            }
            else
            {
                // closebutton 만 표시
                this._setTemporaryIconTextVisible(false);
            }
        }
        else
        {
            // hide closebutton
            this._setTemporaryCloseButtonVisible(false);

            avail_width = this._getAvailableTextDisplayWidth(width);
            if (this._canDisplayText(avail_width))
                return;

            if (this._p_icontext.icon)
            {
                // icon 이 있으면 icon 만 표시
                this._setTemporaryText("");
            }
            else
            {
                // icon 이 없으면 text 첫글자를 표시
                const ori_text = this._p_icontext.text;
                if (ori_text.length > 0)
                {
                    this._setTemporaryText(ori_text[0]);
                }
            }
        }
    };

    _pTabBarItemControl._getCloseButtonSize = function ()
    {
        const closebutton = this._p_closebutton;
        if (closebutton && closebutton.visible)
        {
            let closebuttonwidth = this._closebuttonwidth;
            let closebuttonheight = this._closebuttonheight;
            if (closebuttonwidth < 0 || closebuttonheight < 0)
            {
                const closebuttonsize = closebutton._on_getFitSize();
                closebuttonwidth = closebuttonsize[0];
                closebuttonheight = closebuttonsize[1];
            }
            return [closebuttonwidth, closebuttonheight];
        }
        return [0, 0];
    };

    _pTabBarItemControl._getPinButtonSize = function ()
    {
        const pinbutton = this._p_pinbutton;
        if (pinbutton && pinbutton.visible && this._p_usepinbutton)
        {
            let pinbuttonwidth = this._pinbuttonwidth;
            let pinbuttonheight = this._pinbuttonheight;
            if (pinbuttonwidth < 0 || pinbuttonheight < 0)
            {
                const pinbuttonsize = pinbutton._on_getFitSize();
                pinbuttonwidth = pinbuttonsize[0];
                pinbuttonheight = pinbuttonsize[1];
            }
            return [pinbuttonwidth, pinbuttonheight];
        }
        return [0, 0];
    };

    _pTabBarItemControl._recalcLayout = function (width, height)
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return;

        width = width ?? this._getClientWidth();
        height = height ?? this._getClientHeight();

        this._applyLayoutPriority(width);

        let left = 0;

        let icontextwidth = 0;
        const icontextheight = height;
        const icontexttop = 0;

        const [closebuttonwidth, closebuttonheight] = this._getCloseButtonSize();
        const closebuttontop = height / 2 - closebuttonheight / 2;

        if (this._p_usepinbutton && this._p_pinbutton.visible)
        {
            const [pinbuttonwidth, pinbuttonheight] = this._getPinButtonSize();
            const pinbuttontop = height / 2 - pinbuttonheight / 2;

            icontextwidth = this._p_icontext.visible ? width - pinbuttonwidth - closebuttonwidth : 0;
            if (closebuttonwidth > 0 && icontextwidth > 0)
            {
                icontextwidth -= this._DEFAULT_CONTENT_GAP;
            }

            if (this._p_pinbuttonposition === "start")
            {
                this._p_pinbutton.move(left, pinbuttontop, pinbuttonwidth, pinbuttonheight);
                left += pinbuttonwidth + this._DEFAULT_CONTENT_GAP;

                if (pinbuttonwidth > 0 && icontextwidth > 0)
                {
                    icontextwidth -= this._DEFAULT_CONTENT_GAP;
                }
                this._p_icontext.move(left, icontexttop, icontextwidth, icontextheight);

                if (closebuttonwidth > 0)
                {
                    left += icontextwidth + this._DEFAULT_CONTENT_GAP;
                    this._p_closebutton.move(left, closebuttontop, closebuttonwidth, closebuttonheight);
                }
            }
            else // beforeclosebutton
            {
                if (pinbuttonwidth > 0 && icontextwidth > 0)
                {
                    icontextwidth -= this._DEFAULT_CONTENT_GAP;
                }

                this._p_icontext.move(left, icontexttop, icontextwidth, icontextheight);
                left += (icontextwidth > 0 ? icontextwidth + this._DEFAULT_CONTENT_GAP : 0);
                this._p_pinbutton.move(left, pinbuttontop, pinbuttonwidth, pinbuttonheight);

                if (closebuttonwidth > 0)
                {
                    left += pinbuttonwidth + this._DEFAULT_CONTENT_GAP;
                    this._p_closebutton.move(left, closebuttontop, closebuttonwidth, closebuttonheight);
                }
            }
        }
        else
        {
            // pinbutton 이 보이지 않거나 사용하지 않는 경우
            this._p_pinbutton.move(left, 0, 0, 0);

            icontextwidth = this._p_icontext.visible ? width - closebuttonwidth : 0;
            if (closebuttonwidth > 0 && icontextwidth > 0)
            {
                icontextwidth -= this._DEFAULT_CONTENT_GAP;
            }

            this._p_icontext.move(left, icontexttop, icontextwidth, icontextheight);

            if (closebuttonwidth > 0)
            {
                if (icontextwidth > 0) // text + closebutton
                {
                    left += icontextwidth + this._DEFAULT_CONTENT_GAP;
                }
                else // closebutton only
                {
                    left += (width / 2 - closebuttonwidth / 2);
                }
                this._p_closebutton.move(left, closebuttontop, closebuttonwidth, closebuttonheight);
            }
        }
    }

    _pTabBarItemControl._bindEvent = function ()
    {
        if (this._p_pinbutton)
            this._p_pinbutton.addEventHandler("onclick", this._on_pinbutton_onclick, this);

        if (this._p_closebutton)
            this._p_closebutton.addEventHandler("onclick", this._on_closebutton_onclick, this);

        if (this._p_icontext)
            this._p_icontext.addEventHandler("onclick", this._on_icontext_onclick, this);
    }

    _pTabBarItemControl._unBindEvent = function ()
    {
        if (this._p_pinbutton)
            this._p_pinbutton.removeEventHandler("onclick", this._on_pinbutton_onclick, this);

        if (this._p_closebutton)
            this._p_closebutton.removeEventHandler("onclick", this._on_closebutton_onclick, this);

        if (this._p_icontext)
            this._p_icontext.removeEventHandler("onclick", this._on_icontext_onclick, this);
    };

    //===============================================================
    // nexacro._TabBarItemControl : Event Handler
    //===============================================================
    _pTabBarItemControl._on_pinbutton_onclick = function (obj, e)
    {
        const linked_frame = this._linked_frame;
        if (linked_frame)
            linked_frame.set_pinned(!linked_frame.pinned); // toggle pinned
    }

    _pTabBarItemControl._on_closebutton_onclick = function (obj, e)
    {
        const linked_frame = this._linked_frame;
        if (linked_frame)
            linked_frame._on_closebutton_click(obj, e);
    }

    _pTabBarItemControl._on_icontext_onclick = function (obj, e)
    {
        const parent = this.parent;
        if (parent && typeof parent._on_item_onclick === "function")
        {
            parent._on_item_onclick(this, e);
        }
    }

    //===============================================================
    // nexacro._TabBarItemControl : override
    //===============================================================
    _pTabBarItemControl.on_getIDCSSSelector = function ()
    {
        return "tabbaritem";
    };

    _pTabBarItemControl.on_changeUserStatus = function (changestatus, value, applyuserstatus, currentstatus, currentuserstatus)
    {
        if (value)
        {
            if (changestatus === "pinned" || changestatus === "pinnedselected") // pinbutton 이 unpin 버튼으로 동작할때 selected 상태로 설정
            {
                this._p_pinbutton._changeUserStatus("selected", true);
                this._p_pinbutton.set_tooltiptext(nexacro._GetSystemErrorMsg(this, `${this._type_name}.${this.pinbutton.id}_unpin`));
                this._p_closebutton.set_visible(false);
            }
            applyuserstatus = changestatus;
        }
        else
        {
            if (currentuserstatus === "pinnedselected")
            {
                if (changestatus === "selected") // unselect
                {
                    applyuserstatus = "pinned";
                }
                else if (changestatus === "pinned") // unpin
                {
                    applyuserstatus = "selected";

                    this._p_pinbutton._changeUserStatus("selected", false);
                    this._p_pinbutton.set_tooltiptext(nexacro._GetSystemErrorMsg(this, `${this._type_name}.${this.pinbutton.id}_pin`));
                    this._p_closebutton.set_visible(true);
                }
            }
            else if (currentuserstatus === "pinned")
            {
                if (changestatus === "pinned") // unpin
                {
                    applyuserstatus = "";

                    this._p_pinbutton._changeUserStatus("selected", false);
                    this._p_pinbutton.set_tooltiptext(nexacro._GetSystemErrorMsg(this, `${this._type_name}.${this.pinbutton.id}_pin`));
                    this._p_closebutton.set_visible(true);
                }
            }
        }
        return applyuserstatus;
    };

    _pTabBarItemControl.on_apply_status = function (status, userstatus)
    {
        this.set_positionstep((userstatus == "pinned" || userstatus === 'pinnedselected') ? 0 : 1); // 0 : fixed container, 1 : scrollable container

        const parent = this.parent;
        if (parent)
            parent._recalcLayout(); // 상태변경시 contents 표시 우선 순위 적용을 위해 부모에게 layout 재계산을 먼저 요청 (공간의 결정이 우선)

        this._recalcLayout();
    };

    _pTabBarItemControl.on_apply_prop_enable = function (v)
    {
        const icontext = this._p_icontext;
        const pinbutton = this._p_pinbutton;
        const closebutton = this._p_closebutton;

        if (icontext)
        {
            icontext._setEnable(v);
        }
        if (pinbutton)
        {
            pinbutton._setEnable(v);
        }
        if (closebutton)
        {
            closebutton._setEnable(v);
        }
    };

    _pTabBarItemControl._on_getFitSize = function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            const icontext = this._p_icontext;
            const icontextwidth = icontext._on_getFitSize()[0];
            const icontextheight = icontext._on_getFitSize()[1];

            let total_w = icontextwidth;
            let total_h = icontextheight;

            if (this._p_usepinbutton && this._p_pinbutton.visible)
            {
                const [pinbuttonwidth, pinbuttonheight] = this._getPinButtonSize();

                if (pinbuttonwidth > 0 && icontextwidth > 0)
                {
                    total_w += this._DEFAULT_CONTENT_GAP;
                }
                total_w += pinbuttonwidth;
                total_h = Math.max(total_h, pinbuttonheight);
            }

            const [closebuttonwidth, closebuttonheight] = this._getCloseButtonSize();
            if (closebuttonwidth > 0 && icontextwidth > 0)
            {
                total_w += this._DEFAULT_CONTENT_GAP;
            }
            total_w += closebuttonwidth;
            total_h = Math.max(total_h, closebuttonheight);

            const border = this._getCurrentStyleBorder();
            const padding = this._getCurrentStylePadding();
            if (border)
            {
                total_w += border._getBorderWidth();
                total_h += border._getBorderHeight();
            }
            if (padding)
            {
                total_w += padding.left + padding.right;
                total_h += padding.top + padding.bottom;
            }

            return [total_w, total_h];
        }
        return [this._adjust_width, this._adjust_height];
    };

    //===============================================================
    // nexacro._TabBarItemControl : methods
    //===============================================================
    _pTabBarItemControl.pin = function ()
    {
        this._state_machine.transition("pin");
    };

    _pTabBarItemControl.unpin = function ()
    {
        this._state_machine.transition("unpin");
    };

    _pTabBarItemControl.isPinned = function ()
    {
        return this._state_machine.currentStates.has("pinned");
    };

    _pTabBarItemControl.select = function ()
    {
        this._state_machine.transition("select");
    };

    _pTabBarItemControl.unselect = function ()
    {
        this._state_machine.transition("unselect");
    };

    _pTabBarItemControl.isSelected = function ()
    {
        return this._state_machine.currentStates.has("selected");
    };

    _pTabBarItemControl.normal = function () // enable 은 prop name 과 충돌하여 normal 을 함수명으로 사용
    {
        this._state_machine.transition("enable");
    };

    _pTabBarItemControl.disable = function ()
    {
        this._state_machine.transition("disable");
    };

    _pTabBarItemControl.isDisabled = function ()
    {
        return this._state_machine.currentStates.has("disabled");
    };

    _pTabBarItemControl.show = function ()
    {
        this._state_machine.transition("show");
    };

    _pTabBarItemControl.hide = function ()
    {
        this._state_machine.transition("hide");
    };

    _pTabBarItemControl.isHidden = function ()
    {
        return this._state_machine.currentStates.has("hidden");
    };

    _pTabBarItemControl.setLinkedFrame = function (frame)
    {
        this._linked_frame = frame;
    };

    _pTabBarItemControl._properties = [
        { name: "icontext", readonly: true },
        { name: "pinbutton", readonly: true },
        { name: "closebutton", readonly: true }
    ];
    nexacro._defineProperties(_pTabBarItemControl, _pTabBarItemControl._properties);


    //==============================================================================
    // nexacro._TabBarItemSetControl
    //==============================================================================
    nexacro._TabBarItemSetControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._items = new nexacro.Collection();
    };

    var _pTabBarItemSetControl = nexacro._createPrototype(nexacro.Component, nexacro._TabBarItemSetControl);
    nexacro._TabBarItemSetControl.prototype = _pTabBarItemSetControl;
    _pTabBarItemSetControl._type_name = "TabBarItemSetControl";

    /* internal value */
    _pTabBarItemSetControl._is_subcontrol = true;
    _pTabBarItemSetControl._is_focus_accept = false;
    _pTabBarItemSetControl._is_scrollable = true;

    /* constants */
    _pTabBarItemSetControl._SCROLLDELTA = nexacro.Component.prototype._scroll_default_value;

    /* properties */
    _pTabBarItemSetControl._p_itemusepinbutton = false;
    _pTabBarItemSetControl._p_itempinbuttonposition = "start";
    _pTabBarItemSetControl._p_itempinbuttonsize = undefined;
    _pTabBarItemSetControl._p_itemclosebuttonsize = undefined;

    _pTabBarItemSetControl._event_list = {
        "onvscroll": 1, "onhscroll": 1
    };

    //===============================================================
    // nexacro._TabBarItemSetControl : Create & Destroy & Update
    //===============================================================
    _pTabBarItemSetControl.on_create_contents = function ()
    {
        this._createItemControls();
    };

    _pTabBarItemSetControl.on_created_contents = function (win)
    {
        this._bindEvent();
        this._applyItemControlsProperties();
        this._createdItemControls(win);
    };

    _pTabBarItemSetControl.onCreatedAfter = function (resultCreated)
    {
        if (!resultCreated)
            return;

        this._scrollToSelectedItem();
    };

    _pTabBarItemSetControl.on_destroy_contents = function (callremovechild)
    {
        this._unbindEvent();
        this._destroyItems();
    };

    //===============================================================
    // nexacro._TabBarItemSetControl : Properties
    //===============================================================
    _pTabBarItemSetControl.set_itemusepinbutton = function (val)
    {
        if (this._p_itemusepinbutton != val)
        {
            this._p_itemusepinbutton = val;
            this.on_apply_itemusepinbutton();
        }
    };

    _pTabBarItemSetControl.on_apply_itemusepinbutton = function ()
    {
        this._applyItemControlsProperties();
        this._recalcLayout();
        this._updateSelectedItemIndicator();
    };

    _pTabBarItemSetControl.set_itempinbuttonposition = function (val)
    {
        if (this._p_itempinbuttonposition != val)
        {
            this._p_itempinbuttonposition = val;
            this.on_apply_itempinbuttonposition();
        }
    };

    _pTabBarItemSetControl.on_apply_itempinbuttonposition = function ()
    {
        this._applyItemControlsProperties();
        this._recalcLayout();
    };

    _pTabBarItemSetControl.set_itempinbuttonsize = function (val)
    {
        if (this._p_itempinbuttonsize != val)
        {
            this._p_itempinbuttonsize = val;
            this.on_apply_itempinbuttonsize();
        }
    };

    _pTabBarItemSetControl.on_apply_itempinbuttonsize = function ()
    {
        this._applyItemControlsProperties();
        this._recalcLayout();
    };

    _pTabBarItemSetControl.set_itemclosebuttonsize = function (val)
    {
        if (this._p_itemclosebuttonsize != val)
        {
            this._p_itemclosebuttonsize = val;
            this.on_apply_itemclosebuttonsize();
        }
    };

    _pTabBarItemSetControl.on_apply_itemclosebuttonsize = function ()
    {
        this._applyItemControlsProperties();
        this._recalcLayout();
    };

    //===============================================================
    // nexacro._TabBarItemSetControl : Logical Part
    //===============================================================
    _pTabBarItemSetControl._createItem = function (frame, is_dynamic_create)
    {
        const item = new nexacro._TabBarItemControl(`tabbaritem_${frame.id}`, 0, 0, 0, 0, null, null, null, null, null, null, this);
        if (item && frame)
        {
            const parent = this.parent;
            if (parent)
            {
                item[frame.pinned ? "pin" : "unpin"]();
                item[frame._isEnable() ? "normal" : "disable"]();
                item[frame.visible ? "show" : "hide"]();

                item.setLinkedFrame(frame);

                if (is_dynamic_create)
                {
                    this._applyItemControlProperties(item);
                    item.createComponent();
                }
                return item;
            }
        }
        return null;
    }

    _pTabBarItemSetControl._updateItem = function (frame)
    {
        const items = this._items;
        if (items)
        {
            const item = items.get_item(frame.id);
            if (item)
            {
                this._applyItemControlProperties(item);

                item._recalcLayout();

                return true;
            }
        }
        return false;
    };

    _pTabBarItemSetControl._createItemControls = function ()
    {
        const items = this._items;
        if (items)
        {
            for (let i = 0, len = items.length; i < len; i++)
            {
                const item = items.get_item(i);
                if (item)
                {
                    this._applyItemControlProperties(item);
                    item.createComponent(true);
                }
            }
        }
    };

    _pTabBarItemSetControl._createdItemControls = function (win)
    {
        const items = this._items;
        if (items)
        {
            for (let i = 0, len = items.length; i < len; i++)
            {
                const item = items.get_item(i);
                if (item)
                {
                    item.on_created(win);
                }
            }
        }
    };

    _pTabBarItemSetControl._applyItemControlsProperties = function ()
    {
        const items = this._items;
        if (items)
        {
            for (let i = 0, len = items.length; i < len; i++)
            {
                const item = items.get_item(i);
                this._applyItemControlProperties(item);
            }
        }
    };

    _pTabBarItemSetControl._applyItemControlProperties = function (item)
    {
        const parent = this.parent;
        if (!parent)
            return;

        if (item && item._linked_frame)
        {
            const frame = item._linked_frame;

            // frame 의 속성값을 item 에 적용
            item.set_positionstep(frame.pinned ? 0 : 1); // 0 : fixed container, 1 : scrollable container
            item.set_tooltiptext(frame.titletext);
            item.icontext.set_text(frame.titletext);

            if (frame.showtitleicon && frame.titlebar && frame.titlebar.titleicon)
            {
                item.icontext.set_icon(frame.titlebar.titleicon._getCSSStyleValue("icon"));
                item.icontext.set_iconPosition(frame.titlebar.titleicon._getCSSStyleValue("iconPosition"));
            }
            else
            {
                item.icontext.set_icon("");
                item.icontext.set_iconPosition("left top");
            }

            // parent 의 속성값을 item 에 적용
            item.set_usepinbutton(parent.itemusepinbutton && frame.allowtabbaritempinbutton); // frame 의 allowtabbaritempinbutton 속성에 의한 pinbnutton 표시 여부 동시 체크
            item.set_pinbuttonposition(parent.itempinbuttonposition);
            item.set_pinbuttonsize(parent.itempinbuttonsize);
            item.set_closebuttonsize(parent.itemclosebuttonsize);
        }
    };

    _pTabBarItemSetControl._destroyItems = function ()
    {
        const items = this._items;
        if (items)
        {
            for (let i = 0, len = items.length; i < len; i++)
            {
                const item = items.get_item(i);
                if (item)
                {
                    item.destroy();
                }
            }
            items.clear();
        }
        this._items.destroy();
        this._items = null;
    };

    _pTabBarItemSetControl._getSelectedItemIndicator = function (frameset)
    {
        if (!this._is_created)
            return;

        let indicator = this._selecteditemindicator;
        if (indicator)
            return indicator;

        indicator = new nexacro.Static("tabbarselecteditemindicator", 0, 0, 0, 0, null, null, null, null, null, null, frameset);
        if (indicator)
        {
            indicator._is_focus_accept = false;
            indicator._is_simple_control = true;
            indicator._is_nc_control = true;
            indicator._setControl();
            indicator.createComponent();

            this._selecteditemindicator = indicator;
        }
        return indicator;
    }

    _pTabBarItemSetControl._updateSelectedItemIndicator = function ()
    {
        const parent = this.parent;
        if (!parent)
            return;

        const frameset = parent._getOwnerFrame(); // TabBar 를 소유하는 FrameSet
        if (!frameset)
            return;

        const indicator = this._getSelectedItemIndicator(frameset);
        if (!indicator)
            return;

        const item = this._getSelectedItem();
        if (!item || item.isDisabled() || item.isHidden()) // selected item 이 없거나 disabled, hidden 인 경우는 indicator hide
        {
            indicator.move(0, 0, 0, 0);
            return;
        }

        const screenPosX = nexacro.System.clientToScreenX(item, 0, false);
        const screenPosY = nexacro.System.clientToScreenY(item, 0, false);

        const clientPosX = nexacro.System.screenToClientX(frameset, screenPosX, false);
        const clientPosY = nexacro.System.screenToClientY(frameset, screenPosY, false);

        const item_border = item._getCurrentStyleBorder();
        const frameset_border = frameset._getCurrentStyleBorder();

        let item_border_left = item_border ? item_border.left._width : 0;
        let item_border_top = item_border ? item_border.top._width : 0;

        let indicatorPosX = clientPosX + item_border_left - frameset_border.left._width;
        let indicatorPosY = clientPosY + item_border_top - frameset_border.top._width;
        let indicatorWidth = item.getOffsetWidth() - item_border._getBorderWidth();
        let indicatorHeight = item.getOffsetHeight() - item_border._getBorderHeight();

        if (!item.isPinned()) // scrollable item 인 경우는 scroll 영역을 고려하여 indicator 크기 조정
        {
            const scroll_elem = this._control_element.getContainerElement(true);

            const padding = this._getCurrentStylePadding();
            const parent_border = parent._getCurrentStyleBorder();
            const parent_padding = parent._getCurrentStylePadding();

            if (this._isAttachPositionHorizontal())
            {
                const scroll_elem_left = scroll_elem.left +
                    (parent_border ? parent_border.left._width : 0) +
                    (parent_padding ? parent_padding.left : 0) +
                    (padding ? padding.left : 0);

                if (indicatorPosX < scroll_elem_left) // scroll 영역의 왼쪽 잘림
                {
                    indicatorWidth -= scroll_elem_left - indicatorPosX;
                    indicatorPosX = scroll_elem_left;
                }
                if (indicatorPosX + indicatorWidth > scroll_elem_left + scroll_elem.width) // scroll 영역의 오른쪽 잘림
                {
                    indicatorWidth = scroll_elem_left + scroll_elem.width - indicatorPosX;
                }
            }
            else // vertical
            {
                const scroll_elem_top = scroll_elem.top +
                    (parent_border ? parent_border.top._width : 0) +
                    (parent_padding ? parent_padding.top : 0) +
                    (padding ? padding.top : 0);

                if (indicatorPosY < scroll_elem_top) // scroll 영역의 위쪽 잘림
                {
                    indicatorHeight -= scroll_elem_top - indicatorPosY;
                    indicatorPosY = scroll_elem_top;
                }
                if (indicatorPosY + indicatorHeight > scroll_elem_top + scroll_elem.height) // scroll 영역의 아래쪽 잘림
                {
                    indicatorHeight = scroll_elem_top + scroll_elem.height - indicatorPosY;
                }
            }
        }

        if (this._isAttachPositionLeft())
        {
            indicatorPosX += indicatorWidth;
            indicatorWidth = this._getSelectedItemIndicatorSize();
        }
        else if (this._isAttachPositionTop())
        {
            indicatorPosY += indicatorHeight;
            indicatorHeight = this._getSelectedItemIndicatorSize();
        }
        else if (this._isAttachPositionRight())
        {
            indicatorWidth = this._getSelectedItemIndicatorSize();
            indicatorPosX -= indicatorWidth;
        }
        else if (this._isAttachPositionBottom())
        {
            indicatorHeight = this._getSelectedItemIndicatorSize();
            indicatorPosY -= indicatorHeight;
        }
        indicator.set_visible(parent.visible);
        indicator.move(indicatorPosX, indicatorPosY, indicatorWidth, indicatorHeight);
    };

    _pTabBarItemSetControl._getSelectedItemIndicatorSize = function ()
    {
        const parent = this.parent;
        if (!parent)
            return 0;

        const item = this._getSelectedItem();
        if (!item)
            return 0;

        let size = 0;

        const item_border = item._getCurrentStyleBorder();
        const border = this._getCurrentStyleBorder();
        const padding = this._getCurrentStylePadding();
        const parent_border = parent._getCurrentStyleBorder();
        const parent_padding = parent._getCurrentStylePadding();

        if (this._isAttachPositionLeft())
        {
            size = item_border ? item_border.right._width : 0;
            size += padding ? padding.right : 0;
            size += border ? border.right._width : 0;
            size += parent_padding ? parent_padding.right : 0;
            size += parent_border ? parent_border.right._width : 0;
        }
        else if (this._isAttachPositionTop())
        {
            size = item_border ? item_border.bottom._width : 0;
            size += padding ? padding.bottom : 0;
            size += border ? border.bottom._width : 0;
            size += parent_padding ? parent_padding.bottom : 0;
            size += parent_border ? parent_border.bottom._width : 0;
        }
        else if (this._isAttachPositionRight())
        {
            size = item_border ? item_border.left._width : 0;
            size += padding ? padding.left : 0;
            size += border ? border.left._width : 0;
            size += parent_padding ? parent_padding.left : 0;
            size += parent_border ? parent_border.left._width : 0;
        }
        else if (this._isAttachPositionBottom())
        {
            size = item_border ? item_border.top._width : 0;
            size += padding ? padding.top : 0;
            size += border ? border.top._width : 0;
            size += parent_padding ? parent_padding.top : 0;
            size += parent_border ? parent_border.top._width : 0;
        }
        return size;
    };

    _pTabBarItemSetControl._bindEvent = function ()
    {
        const items = this._items;
        if (items)
        {
            for (let i = 0, len = items.length; i < len; i++)
            {
                const item = items.get_item(i);
                if (item)
                {
                    item.addEventHandler("onclick", this._on_item_onclick, this);
                }
            }
        }
    };

    _pTabBarItemSetControl._unbindEvent = function ()
    {
        const items = this._items;
        if (items)
        {
            for (let i = 0, len = items.length; i < len; i++)
            {
                const item = items.get_item(i);
                if (item)
                {
                    item.removeEventHandler("onclick", this._on_item_onclick, this);
                }
            }
        }
    };

    _pTabBarItemSetControl._getSelectedItem = function ()
    {
        const items = this._items;
        if (items && items.length > 0)
        {
            for (let i = 0, len = items.length; i < len; i++)
            {
                const item = items.get_item(i);
                if (item && item.isSelected())
                {
                    return item;
                }
            }
        }
        return null;
    };

    _pTabBarItemSetControl._scrollToSelectedItem = function ()
    {
        if (!this._is_created)
            return;

        const selectedItem = this._getSelectedItem();
        if (selectedItem)
        {
            this.scrollToItem(selectedItem);

            this._updateSelectedItemIndicator();
            this._resetScrollButtonState();
        }
    };

    _pTabBarItemSetControl._recalcLayout = function (width, height)
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return;

        width = width ?? this._getClientWidth();
        height = height ?? this._getClientHeight();

        let item_left = 0;
        let item_top = 0;
        let item_width = 0;
        let item_height = 0;

        const moveItems = (isPinned) =>
        {
            let itemCount = 0;

            for (let i = 0, len = this._items.length; i < len; i++)
            {
                const item = this._items.get_item(i);
                if (item.isPinned() !== isPinned)
                    continue;

                if (item.isHidden())
                    continue;

                item_width = this._getItemWidth(item, width);
                item_height = this._getItemHeight(item, height);

                if (this._isAttachPositionLeft())
                {
                    item.move(undefined, item_top, item_width, item_height, 0, undefined);

                    item_top += item_height + this._getItemGap();
                }
                else if (this._isAttachPositionTop())
                {
                    item.move(item_left, undefined, item_width, item_height, undefined, 0);

                    item_left += item_width + this._getItemGap();
                }
                else if (this._isAttachPositionRight())
                {
                    item.move(0, item_top, item_width, item_height);

                    item_top += item_height + this._getItemGap();
                }
                else if (this._isAttachPositionBottom())
                {
                    item.move(item_left, 0, item_width, item_height);

                    item_left += item_width + this._getItemGap();
                }
                itemCount++;
            }
            return itemCount;
        };

        const pinnedItemCount = moveItems(true); // pinned items

        const padding = this._getCurrentStylePadding();
        const isHorizontal = this._isAttachPositionHorizontal();
        const gap = pinnedItemCount > 0 ? this._getItemGap() : 0; // 고정된 아이템이 없을 경우 FixedArea 의 마지막 gap 과 일반 아이템의 시작 gap 은 0
        if (isHorizontal)
        {
            control_elem.setFixedArea(item_left + (padding ? padding.left : 0) - gap, height, true);

            item_left = gap;
        }
        else
        {
            control_elem.setFixedArea(width, item_top + (padding ? padding.top : 0) - gap, false);

            item_top = gap;
        }

        moveItems(false); // unpinned items

        this._resetScrollMaxSize(width, height);
        this._resetScrollButtonState();
    };

    _pTabBarItemSetControl._adjustMinMaxItemWidth = function (width)
    {
        const parent = this.parent;
        if (parent && parent.itemminwidth && width < parent.itemminwidth)
        {
            width = parent.itemminwidth;
        }
        if (parent && parent.itemmaxwidth && width > parent.itemmaxwidth)
        {
            width = parent.itemmaxwidth;
        }
        return width;
    };

    _pTabBarItemSetControl._adjustMinMaxItemHeight = function (height)
    {
        const parent = this.parent;
        if (parent && parent.itemminheight && height < parent.itemminheight)
        {
            height = parent.itemminheight;
        }
        if (parent && parent.itemmaxheight && height > parent.itemmaxheight)
        {
            height = parent.itemmaxheight;
        }
        return height;
    };

    _pTabBarItemSetControl._getJusityfiedItemWidth = function (containerWidth)
    {
        const parent = this.parent;
        if (!parent)
            return;

        if (this._isAttachPositionVertical())
            return;

        if (parent.itemjustify)
        {
            let visibleCount = 0;
            for (let i = 0, len = this._items.length; i < len; i++)
            {
                if (this._items[i].isHidden() === false)
                {
                    visibleCount++;
                }
            }

            if (visibleCount > 0)
            {
                const justifiedItemWidth = (containerWidth - this._getItemGap() * (visibleCount - 1)) / visibleCount;

                return this._adjustMinMaxItemWidth(justifiedItemWidth);
            }
        }
        return;
    };

    _pTabBarItemSetControl._getJusityfiedItemHeight = function (containerHeight)
    {
        const parent = this.parent;
        if (!parent)
            return;

        if (this._isAttachPositionHorizontal())
            return;

        if (parent.itemjustify)
        {
            let visibleCount = 0;
            for (let i = 0, len = this._items.length; i < len; i++)
            {
                if (this._items[i].isHidden() === false)
                {
                    visibleCount++;
                }
            }

            if (visibleCount > 0)
            {
                const justifiedItemHeight = (containerHeight - this._getItemGap() * (visibleCount - 1)) / visibleCount;

                return this._adjustMinMaxItemHeight(justifiedItemHeight);
            }
        }
        return;
    };

    _pTabBarItemSetControl._getItemWidth = function (item, containerWidth)
    {
        let itemwidth = this._getJusityfiedItemWidth(containerWidth) || 0;

        const parent = this.parent;
        if (parent && itemwidth === 0)
        {
            if (parent.itemwidth)
            {
                itemwidth = parent.itemwidth;
            }
            else
            {
                if (item._cached_fitsize)
                {
                    itemwidth = item._cached_fitsize[0];
                }
                else
                {
                    itemwidth = item._on_getFitSize()[0];
                }
            }

            if (containerWidth && itemwidth > containerWidth)
            {
                itemwidth = containerWidth;
            }

            itemwidth = this._adjustMinMaxItemWidth(itemwidth);
        }
        return itemwidth;
    };

    _pTabBarItemSetControl._getItemHeight = function (item, containerHeight)
    {
        let itemheight = this._getJusityfiedItemHeight(containerHeight) || 0;

        const parent = this.parent;
        if (parent && itemheight === 0)
        {
            if (parent.itemheight)
            {
                itemheight = parent.itemheight;
            }
            else
            {
                if (item._cached_fitsize)
                {
                    itemheight = item._cached_fitsize[1];
                }
                else
                {
                    itemheight = item._on_getFitSize()[1];
                }
            }

            if (containerHeight && itemheight > containerHeight)
            {
                itemheight = containerHeight;
            }

            itemheight = this._adjustMinMaxItemHeight(itemheight);
        }
        return itemheight;
    };

    _pTabBarItemSetControl._getItemGap = function ()
    {
        const parent = this.parent;
        if (parent)
        {
            return parent.itemgap;
        }
        return 0;
    };

    _pTabBarItemSetControl._resetScrollMaxSize = function (width, height)
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return;

        const items = this._items;
        if (items && items.length > 0)
        {
            let max_width = 0;
            let max_height = 0;
            let itemcount = 0
            for (let i = 0, len = items.length; i < len; i++)
            {
                const item = items.get_item(i);
                if (item && !item.isPinned() && !item.isHidden())
                {
                    max_width += this._getItemWidth(item, width);
                    max_height += this._getItemHeight(item, height);

                    itemcount++;
                }
            }

            if (itemcount > 0)
            {
                const total_gap = (itemcount - 1) * this._getItemGap();

                max_width += total_gap;
                max_height += total_gap;
            }
            control_elem.setElementScrollMaxSize(max_width, max_height);
        }
    };

    _pTabBarItemSetControl._resetScrollButtonState = function ()
    {
        const parent = this.parent;
        if (!parent)
            return;

        parent.updateScrollButtonState();
    };

    _pTabBarItemSetControl._isAttachPositionLeft = function ()
    {
        const parent = this.parent;
        if (!parent)
            return false;

        if (parent._isAttachPositionLeft())
        {
            return true;
        }
        return false;
    };

    _pTabBarItemSetControl._isAttachPositionTop = function ()
    {
        const parent = this.parent;
        if (!parent)
            return false;

        if (parent._isAttachPositionTop())
        {
            return true;
        }
        return false;
    };

    _pTabBarItemSetControl._isAttachPositionRight = function ()
    {
        const parent = this.parent;
        if (!parent)
            return false;

        if (parent._isAttachPositionRight())
        {
            return true;
        }
        return false;
    };

    _pTabBarItemSetControl._isAttachPositionBottom = function ()
    {
        const parent = this.parent;
        if (!parent)
            return false;

        if (parent._isAttachPositionBottom())
        {
            return true;
        }
        return false;
    };

    _pTabBarItemSetControl._isAttachPositionVertical = function ()
    {
        const parent = this.parent;
        if (!parent)
            return false;

        if (parent._isAttachPositionVertical())
        {
            return true;
        }
        return false;
    };

    _pTabBarItemSetControl._isAttachPositionHorizontal = function ()
    {
        if (this._isAttachPositionVertical())
        {
            return false;
        }
        return true;
    };

    //===============================================================
    // nexacro._TabBarItemSetControl : Event Handler
    //===============================================================
    _pTabBarItemSetControl._on_item_onclick = function (obj, e)
    {
        const owner = this.parent;
        if (owner && typeof owner._on_item_onclick === "function")
        {
            owner._on_item_onclick(obj, e);
        }
    };

    //===============================================================
    // nexacro._TabBarItemSetControl : override
    //===============================================================
    _pTabBarItemSetControl.on_create_control_element = function (parent_elem)
    {
        // create control element
        const control_elem = new nexacro.TabBarItemSetControlElement(parent_elem);
        if (control_elem)
            control_elem.setLinkedControl(this);

        this._control_element = control_elem;

        return control_elem;
    };

    _pTabBarItemSetControl.on_change_containerRect = function (width, height)
    {
        nexacro.Component.prototype.on_change_containerRect.call(this, width, height);

        this._recalcLayout(width, height);
        this._scrollToSelectedItem();
    };

    _pTabBarItemSetControl._on_getFitSize = function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            let total_w = 0;
            let total_h = 0;

            if (this._isAttachPositionHorizontal())
            {
                const items = this._items;
                if (items)
                {
                    for (let i = 0, len = items.length; i < len; i++)
                    {
                        const item = items.get_item(i);
                        const itemwidth = this._getItemWidth(item);
                        total_w += itemwidth + this._getItemGap();
                        total_h = Math.max(total_h, this._getItemHeight(item));
                    }
                }
            }
            else // vertical
            {
                const items = this._items;
                if (items)
                {
                    for (let i = 0, len = items.length; i < len; i++)
                    {
                        const item = items.get_item(i);
                        const itemheight = this._getItemHeight(item);
                        total_h += itemheight + this._getItemGap();
                        total_w = Math.max(total_w, this._getItemWidth(item));
                    }
                }
            }

            const border = this._getCurrentStyleBorder();
            const padding = this._getCurrentStylePadding();

            if (border)
            {
                total_w += border._getBorderWidth();
                total_h += border._getBorderHeight();
            }

            if (padding)
            {
                total_w += padding.left + padding.right;
                total_h += padding.top + padding.bottom;
            }
            return [total_w, total_h];
        }
        return [this._adjust_width, this._adjust_height];
    };

    _pTabBarItemSetControl._onResetScrollBar = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            this._setHscrollPos(control_elem.scroll_left);
            this._setVscrollPos(control_elem.scroll_top);
        }
    };

    //===============================================================
    // nexacro._TabBarItemSetControl : methods
    //===============================================================
    _pTabBarItemSetControl.addItem = function (frame)
    {
        if (!frame)
            return;

        const items = this._items;
        if (items)
        {
            items.add_item(frame.id, this._createItem(frame, this._is_created_contents));
        }
        this._recalcLayout();
    };

    _pTabBarItemSetControl.insertItem = function (idx, frame)
    {
        if (!frame)
            return;

        const items = this._items;
        if (items)
        {
            items.insert_item(idx, frame.id, this._createItem(frame, this._is_created_contents));
        }
        this._recalcLayout();
    };

    _pTabBarItemSetControl.removeItem = function (frame)
    {
        if (!frame)
            return;

        const items = this._items;
        if (items)
        {
            for (let i = 0, len = items.length; i < len; i++)
            {
                const item = items.get_item(i);
                if (item && item._linked_frame === frame)
                {
                    item.destroy();
                    items.delete_item(i);
                    break;
                }
            }
        }
        this._recalcLayout();
    };

    _pTabBarItemSetControl.pinItem = function (frame)
    {
        if (frame)
        {
            const items = this._items;
            const item = items[frame.id];
            if (item)
            {
                item.pin();

                this._recalcLayout();
                this._updateSelectedItemIndicator();
            }
        }
    };

    _pTabBarItemSetControl.unpinItem = function (frame)
    {
        if (frame)
        {
            const items = this._items;
            const item = items[frame.id];
            if (item)
            {
                item.unpin();

                this._recalcLayout();
                this._updateSelectedItemIndicator();
            }
        }
    };

    _pTabBarItemSetControl.selectItem = function (frame)
    {
        if (frame)
        {
            const items = this._items;
            const item = items[frame.id];
            if (item)
            {
                const selectedItem = this._getSelectedItem();
                if (selectedItem && selectedItem !== item)
                    selectedItem.unselect();

                item.select();

                this._recalcLayout();
                this._updateSelectedItemIndicator();

                this.scrollToItem(item);
            }
        }
    };

    _pTabBarItemSetControl.enableItem = function (frame)
    {
        if (frame)
        {
            const items = this._items;
            const item = items[frame.id];
            if (item)
            {
                item.normal();

                this._recalcLayout();
                this._updateSelectedItemIndicator();
            }
        }
    };

    _pTabBarItemSetControl.disableItem = function (frame)
    {
        if (frame)
        {
            const items = this._items;
            const item = items[frame.id];
            if (item)
            {
                item.disable();

                this._recalcLayout();
                this._updateSelectedItemIndicator();
            }
        }
    };

    _pTabBarItemSetControl.updateItem = function (frame)
    {
        const updated = this._updateItem(frame);
        if (updated)
        {
            this._recalcLayout();
            this._updateSelectedItemIndicator();
        }
    };

    _pTabBarItemSetControl.showItem = function (frame)
    {
        if (frame)
        {
            const items = this._items;
            const item = items[frame.id];
            if (item)
            {
                item.show();

                this._recalcLayout();
                this._updateSelectedItemIndicator();
            }
        }
    };

    _pTabBarItemSetControl.hideItem = function (frame)
    {
        if (frame)
        {
            const items = this._items;
            const item = items[frame.id];
            if (item)
            {
                item.hide();

                this._recalcLayout();
                this._updateSelectedItemIndicator();
            }
        }
    };

    _pTabBarItemSetControl.scrollBackward = function ()
    {
        if (this._isAttachPositionHorizontal())
        {
            this.scrollBy(this._SCROLLDELTA, 0);
        }
        else // vertical
        {
            this.scrollBy(0, this._SCROLLDELTA);
        }
    };

    _pTabBarItemSetControl.scrollForward = function ()
    {
        if (this._isAttachPositionHorizontal())
        {
            this.scrollBy(-this._SCROLLDELTA, 0);
        }
        else // vertical
        {
            this.scrollBy(0, -this._SCROLLDELTA);
        }
    };

    _pTabBarItemSetControl.scrollToItem = function (item)
    {
        if (item.isPinned()) // 고정 item 은 스크롤 대상이 아님
            return;

        if (this._isAttachPositionHorizontal())
        {
            this.scrollTo(item.getOffsetLeft(), 0);
        }
        else // vertical
        {
            this.scrollTo(0, item.getOffsetTop());
        }
    };

    _pTabBarItemSetControl.canForwardScroll = function ()
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return false;

        if (this._isAttachPositionHorizontal())
        {
            const scrollLeft = control_elem.scroll_left;
            const hScrollLimit = control_elem.hscroll_limit;

            if (hScrollLimit > 10e-10) // TODO : nexacro._EPSILON 처리할것
            {
                if (scrollLeft === 0)
                {
                    return false;
                }
                return true;
            }
        }
        else // vertical
        {
            const scrollTop = control_elem.scroll_top;
            const vScrollLimit = control_elem.vscroll_limit;

            if (vScrollLimit > 10e-10) // TODO : nexacro._EPSILON 처리할것
            {
                if (scrollTop === 0)
                {
                    return false;
                }
                return true;
            }
        }
        return false;
    };

    _pTabBarItemSetControl.canBackwardScroll = function ()
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return false;

        if (this._isAttachPositionHorizontal())
        {
            const scrollLeft = control_elem.scroll_left;
            const hScrollLimit = control_elem.hscroll_limit;

            if (hScrollLimit > 10e-10) // TODO : nexacro._EPSILON 처리할것
            {
                return scrollLeft !== hScrollLimit;
            }
        }
        else // vertical
        {
            const scrollTop = control_elem.scroll_top;
            const vScrollLimit = control_elem.vscroll_limit;

            if (vScrollLimit > 10e-10) // TODO : nexacro._EPSILON 처리할것
            {
                return scrollTop !== vScrollLimit;
            }
        }
        return false;
    };

    _pTabBarItemSetControl.update = function ()
    {
        this._recalcLayout();
        this._updateSelectedItemIndicator();
    };

    //==============================================================================
    // nexacro._TabBarButtonSetControl
    //==============================================================================
    nexacro._TabBarButtonSetControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._buttons = new Map();
    };

    var _pTabBarButtonSetControl = nexacro._createPrototype(nexacro.Component, nexacro._TabBarButtonSetControl);
    nexacro._TabBarButtonSetControl.prototype = _pTabBarButtonSetControl;
    _pTabBarButtonSetControl._type_name = "TabBarButtonSetControl";
    _pTabBarButtonSetControl._DEFAULT_BUTTON_SIZE = 16;
    _pTabBarButtonSetControl._EXTRABUTTON_ID_PREFIX = "extrabutton";
    _pTabBarButtonSetControl._FORWARDSCROLLBUTTON_ID = "forwardscrollbutton";
    _pTabBarButtonSetControl._BACKWARDSCROLLBUTTON_ID = "backwardscrollbutton";
    _pTabBarButtonSetControl._FRAMELISTPOPUPMENUBUTTON_ID = "framelistpopupmenubutton";
    _pTabBarButtonSetControl._CLOSEALLBUTTON_ID = "closeallbutton";
    _pTabBarButtonSetControl._MAXRESTOREBUTTON_ID = "maxrestorebutton";
    _pTabBarButtonSetControl._CASCADEBUTTON_ID = "cascadebutton";
    _pTabBarButtonSetControl._HORIZONTALBUTTON_ID = "horizontalbutton";
    _pTabBarButtonSetControl._VERTICALBUTTON_ID = "verticalbutton";
    _pTabBarButtonSetControl._ARRANGESEPARATOR_ID = "arrangeseparator";
    _pTabBarButtonSetControl._EXTRASEPARATOR_ID = "extraseparator";

    /* internal value */
    _pTabBarButtonSetControl._is_subcontrol = true;
    _pTabBarButtonSetControl._is_focus_accept = false;

    /* properties */
    _pTabBarButtonSetControl._p_buttongap = 4;
    _pTabBarButtonSetControl._p_buttonsize = undefined;
    _pTabBarButtonSetControl._p_buttonshow = "all";
    _pTabBarButtonSetControl._p_separatorsize = 1;

    /* Internal Variable */
    _pTabBarButtonSetControl._buttonwidth = -1;
    _pTabBarButtonSetControl._buttonheight = -1;
    _pTabBarButtonSetControl._buttongap = 4;
    _pTabBarButtonSetControl._separatorsize = 1;
    _pTabBarButtonSetControl._extraButtonInfos = new Array();
    _pTabBarButtonSetControl._buttonInfos = [   // Array 입력 순서대로 생성되고 관리됨
        {
            type: "button",
            id: _pTabBarButtonSetControl._FORWARDSCROLLBUTTON_ID,
            tooltiptextmsg: {
                default: {
                    ko: "앞으로",
                    en: "Forward",
                    ja: "進む",
                    zh: "前进"
                }
            }
        },
        {
            type: "button",
            id: _pTabBarButtonSetControl._BACKWARDSCROLLBUTTON_ID,
            tooltiptextmsg: {
                default: {
                    ko: "뒤로",
                    en: "Backward",
                    ja: "戻る",
                    zh: "后退"
                }
            }
        },
        {
            type: "button",
            id: _pTabBarButtonSetControl._FRAMELISTPOPUPMENUBUTTON_ID,
            tooltiptextmsg: {
                default: {
                    ko: "화면목록",
                    en: "Screen List",
                    ja: "画面一覧",
                    zh: "页面列表"
                }
            }
        },
        {
            type: "button",
            id: _pTabBarButtonSetControl._CLOSEALLBUTTON_ID,
            tooltiptextmsg: {
                default: {
                    ko: "모두닫기",
                    en: "Close All",
                    ja: "すべて閉じる",
                    zh: "全部关闭"
                }
            }
        },
        {
            type: "button",
            id: _pTabBarButtonSetControl._MAXRESTOREBUTTON_ID,
            tooltiptextmsg: {
                maximize: {
                    ko: "최대화",
                    en: "Maximize",
                    ja: "最大化",
                    zh: "最大化"
                },
                restore: {
                    ko: "복원",
                    en: "Restore",
                    ja: "元に戻す",
                    zh: "还原"
                }
            }
        },
        {
            type: "separator",
            id: _pTabBarButtonSetControl._ARRANGESEPARATOR_ID,
            tooltiptextmsg: {
                default: undefined
            }
        },
        {
            type: "button",
            id: _pTabBarButtonSetControl._CASCADEBUTTON_ID,
            tooltiptextmsg: {
                default: {
                    ko: "중첩배열",
                    en: "Cascade",
                    ja: "カスケード表示",
                    zh: "层叠排列"
                }
            }
        },
        {
            type: "button",
            id: _pTabBarButtonSetControl._HORIZONTALBUTTON_ID,
            tooltiptextmsg: {
                default: {
                    ko: "수평배열",
                    en: "Horizontal",
                    ja: "水平に並べる",
                    zh: "水平排列"
                }
            }
        },
        {
            type: "button",
            id: _pTabBarButtonSetControl._VERTICALBUTTON_ID,
            tooltiptextmsg: {
                default: {
                    ko: "수직배열",
                    en: "Vertical",
                    ja: "垂直に並べる",
                    zh: "垂直排列"
                }
            }
        },
        {
            type: "separator",
            id: _pTabBarButtonSetControl._EXTRASEPARATOR_ID,
            tooltiptextmsg: {
                default: undefined
            }
        }
    ];

    //===============================================================
    // nexacro._TabBarButtonSetControl : Create & Destroy & Update
    //===============================================================
    _pTabBarButtonSetControl.on_create_contents = function ()
    {
        this._registerTooltipTextMessage();
        this._createButtons();

        this.setMaximizeState(this._is_maximized);
    };

    _pTabBarButtonSetControl.on_created_contents = function (win)
    {
        this._bindEvent();
        this._createdButtons(win);

        this.on_apply_buttonshow();
    };

    _pTabBarButtonSetControl.on_destroy_contents = function (callremovechild)
    {
        this._unBindEvent();
        this._destroyButtons();
    };

    _pTabBarButtonSetControl.on_change_containerRect = function (width, height)
    {
        nexacro.Component.prototype.on_change_containerRect.call(this, width, height);

        this._recalcLayout(width, height);
    };

    //===============================================================
    // nexacro._TabBarButtonSetControl : Properties
    //===============================================================
    _pTabBarButtonSetControl.set_buttongap = function (val)
    {
        if (this._p_buttongap != val)
        {
            this._p_buttongap = val;
            this._buttongap = parseInt(val);
            if (this._buttongap < 0)
                this._buttongap = 0;

            this.on_apply_buttongap();
        }
    };

    _pTabBarButtonSetControl.on_apply_buttongap = function ()
    {
        this._recalcLayout();
    };

    _pTabBarButtonSetControl.set_buttonsize = function (val)
    {
        if (this._p_buttonsize != val)
        {
            this._p_buttonsize = val;

            if (val)
            {
                const buttonsize = val.split(" ");
                const buttonwidth = +buttonsize[0];
                const buttonheight = (buttonsize[1]) ? +buttonsize[1] : buttonwidth;

                this._buttonwidth = isNaN(buttonwidth) ? this._DEFAULT_BUTTON_SIZE : buttonwidth;
                this._buttonheight = isNaN(buttonheight) ? this._DEFAULT_BUTTON_SIZE : buttonheight;
            }
            else
            {
                this._buttonwidth = -1;
                this._buttonheight = -1;
            }
            this.on_apply_buttonsize();
        }
    };

    _pTabBarButtonSetControl.on_apply_buttonsize = function ()
    {
        this._recalcLayout();
    };

    _pTabBarButtonSetControl.set_buttonshow = function (val)
    {
        if (this._p_buttonshow != val)
        {
            this._p_buttonshow = val;
            this.on_apply_buttonshow();
        }
    };

    _pTabBarButtonSetControl.on_apply_buttonshow = function ()
    {
        this._hideButtonAll();
        this._applyButtonShowOptions();
        this._recalcLayout();
    };

    _pTabBarButtonSetControl.set_separatorsize = function (val)
    {
        if (this._p_separatorsize != val)
        {
            this._p_separatorsize = val;
            this._separatorsize = parseInt(val);
            if (this._separatorsize < 0)
                this._separatorsize = 0;

            this.on_apply_separatorsize();
        }
    };

    _pTabBarButtonSetControl.on_apply_separatorsize = function ()
    {
        this._recalcLayout();
    };

    //===============================================================
    // nexacro._TabBarButtonSetControl : Logical Part
    //===============================================================
    _pTabBarButtonSetControl._createButtons = function ()
    {
        const buttons = this._buttons;
        if (buttons)
        {
            const createButton = (info, extra) =>
            {
                if (buttons.has(info.id))
                    return;

                if (info.type === "button")
                {
                    const button = new nexacro.Button(info.id, 0, 0, 0, 0, null, null, null, null, null, null, this);
                    if (button)
                    {
                        buttons.set(info.id, { type: info.type, comp: button });
                        if (extra)
                            button.set_tooltiptext(info.tooltiptextmsg);
                        else
                            button.set_tooltiptext(nexacro._GetSystemErrorMsg(this, `${this._type_name}.${info.id}`));
                        button._setControl();
                        button.createComponent(true);
                    }
                }
                else if (info.type === "separator")
                {
                    const separator = new nexacro.Static(info.id, 0, 0, 0, 0, null, null, null, null, null, null, this);
                    if (separator)
                    {
                        buttons.set(info.id, { type: info.type, comp: separator });
                        separator._setControl();
                        separator.createComponent(true);
                    }
                }
            };

            this._buttonInfos.forEach(info => createButton(info, false));
            this._extraButtonInfos.forEach(info => createButton(info, true));
        }
    };

    _pTabBarButtonSetControl._createdButtons = function (win)
    {
        const buttons = this._buttons;
        if (buttons)
        {
            buttons.forEach((button) =>
            {
                button.comp.on_created(win);
            });
        }
    };

    _pTabBarButtonSetControl._destroyButtons = function ()
    {
        const buttons = this._buttons;
        if (buttons)
        {
            buttons.forEach((button, key) =>
            {
                button.comp.destroy();
                button = null;

                buttons.delete(key);
            });
        }
    };

    _pTabBarButtonSetControl._recreateContents = function ()
    {
        if (!this._is_created_contents)
            return;

        // destroy contents
        this._unBindEvent();
        this._destroyButtons();

        // create contents
        this._registerTooltipTextMessage();
        this._createButtons();
        this._bindEvent();
        this._createdButtons(this._getWindowHandle());

        // show buttons
        this.on_apply_buttonshow();

        // set maximize state
        this.setMaximizeState(this._is_maximized);

        // recalc layout
        this._recalcLayout();
    };

    _pTabBarButtonSetControl._registerTooltipTextMessage = function ()
    {
        // 다국어 처리를 위해 tooltiptext 를 error message로 등록
        // message id rule : "${this._type_name}.${buttonId}[_${state}]"
        //
        const addTooltipTextMessages = (infos) =>
        {
            if (!infos)
                return;

            infos.forEach(info =>
            {
                Object.entries(info.tooltiptextmsg).forEach(([state, messages]) =>
                {
                    if (messages)
                    {
                        const msgId = `${this._type_name}.${info.id}${state !== "default" ? "_" + state : ""}`;
                        ["ko", "en", "ja", "zh"].forEach(lang =>
                            nexacro.addErrorMessage(lang, msgId, messages[lang] || "")
                        );
                    }
                });
            });
        };

        addTooltipTextMessages(this._buttonInfos);
    };

    _pTabBarButtonSetControl._recalcLayout = function (width, height)
    {
        const buttons = this._buttons;
        if (buttons)
        {
            width = width ?? this._getClientWidth();
            height = height ?? this._getClientHeight();

            const buttongap = this._buttongap;
            let buttonwidth = this._buttonwidth;
            let buttonheight = this._buttonheight;
            const separatorsize = this._separatorsize;
            const useAutofitButtonSize = (buttonwidth < 0 || buttonheight < 0);

            let left = 0;
            let top = 0;

            if (this._isAttachPositionHorizontal())
            {
                buttons.forEach((button) =>
                {
                    if (!button.comp.visible)
                        return;

                    if (button.type === "separator")
                    {
                        button.comp.move(left, 0, separatorsize, height);
                        left += separatorsize + buttongap;
                    }
                    else // button
                    {
                        if (useAutofitButtonSize)
                        {
                            const buttonsize = button.comp._on_getFitSize();

                            buttonwidth = buttonsize[0];
                            buttonheight = buttonsize[1];
                        }
                        top = height / 2 - buttonheight / 2;

                        button.comp.move(left, top, buttonwidth, buttonheight);
                        left += buttonwidth + buttongap;
                    }
                });
            }
            else // vertical
            {
                buttons.forEach((button) =>
                {
                    if (!button.comp.visible)
                        return;

                    if (button.type === "separator")
                    {
                        button.comp.move(0, top, width, separatorsize);
                        top += separatorsize + buttongap;
                    }
                    else // button
                    {
                        if (useAutofitButtonSize)
                        {
                            const buttonsize = button.comp._on_getFitSize();

                            buttonwidth = buttonsize[0];
                            buttonheight = buttonsize[1];
                        }
                        left = width / 2 - buttonwidth / 2;

                        button.comp.move(left, top, buttonwidth, buttonheight);
                        top += buttonheight + buttongap;
                    }
                });
            }
        }
    };

    _pTabBarButtonSetControl._bindEvent = function ()
    {
        const buttons = this._buttons;
        if (buttons)
        {
            buttons.forEach((button) =>
            {
                if (button.type === "button")
                    button.comp.addEventHandler("onclick", this._on_button_onclick, this);
            });
        }
    };

    _pTabBarButtonSetControl._unBindEvent = function ()
    {
        const buttons = this._buttons;
        if (buttons)
        {
            buttons.forEach((button) =>
            {
                if (button.type === "button")
                    button.comp.removeEventHandler("onclick", this._on_button_onclick, this);
            });
        }
    };

    _pTabBarButtonSetControl._showButtonAll = function ()
    {
        const buttons = this._buttons;
        if (buttons)
        {
            buttons.forEach((button, key) =>
            {
                this._showButton(key);
            });
        }
    };

    _pTabBarButtonSetControl._hideButtonAll = function ()
    {
        const buttons = this._buttons;
        if (buttons)
        {
            buttons.forEach((button, key) =>
            {
                this._hideButton(key);
            });
        }
    };

    _pTabBarButtonSetControl._showButton = function (id)
    {
        const button = this._buttons.get(id);
        if (button)
        {
            if (button._dynamic_visible !== undefined)
                button.comp.set_visible(true && button._dynamic_visible);
            else
                button.comp.set_visible(true);

            this._updateSeparatorVisible();
        }
    };

    _pTabBarButtonSetControl._hideButton = function (id)
    {
        const button = this._buttons.get(id);
        if (button)
        {
            if (button._dynamic_visible !== undefined)
                button.comp.set_visible(false && button._dynamic_visible);
            else
                button.comp.set_visible(false);

            this._updateSeparatorVisible();
        }
    };

    _pTabBarButtonSetControl._isAnyButtonVisible = function (idarray)
    {
        // 입력된 id 배열에 해당하는 버튼이 하나라도 보이는지 체크
        const buttons = this._buttons;
        if (buttons && idarray && idarray.length > 0)
        {
            for (let i = 0; i < idarray.length; i++)
            {
                const button = buttons.get(idarray[i]);
                if (button && button.comp.visible)
                {
                    return true;
                }
            }
        }
        return false;
    };

    _pTabBarButtonSetControl._isAnyExtraButtonVisible = function ()
    {
        // extra 버튼이 하나라도 보이는지 체크
        const buttons = this._buttons;
        if (buttons)
        {
            for (let i = 0; i < this._extraButtonInfos.length; i++)
            {
                const button = buttons.get(this._extraButtonInfos[i].id);
                if (button && button.comp.visible)
                {
                    return true;
                }
            }
        }
        return false;
    };

    _pTabBarButtonSetControl._updateSeparatorVisible = function ()
    {
        const buttons = this._buttons;
        if (!buttons)
            return;

        const controlButtonVisible = this._isAnyButtonVisible([
            this._FORWARDSCROLLBUTTON_ID,
            this._BACKWARDSCROLLBUTTON_ID,
            this._FRAMELISTPOPUPMENUBUTTON_ID,
            this._CLOSEALLBUTTON_ID,
            this._MAXRESTOREBUTTON_ID]);

        const arrangeButtonVisible = this._isAnyButtonVisible([
            this._CASCADEBUTTON_ID,
            this._HORIZONTALBUTTON_ID,
            this._VERTICALBUTTON_ID]);

        const arrangeSeparator = buttons.get(this._ARRANGESEPARATOR_ID);
        if (arrangeSeparator)
            arrangeSeparator.comp.set_visible(controlButtonVisible && arrangeButtonVisible);

        const extraSeparator = buttons.get(this._EXTRASEPARATOR_ID);
        if (extraSeparator)
            extraSeparator.comp.set_visible((controlButtonVisible || arrangeButtonVisible) && this._isAnyExtraButtonVisible());
    };

    _pTabBarButtonSetControl._applyButtonShowOptions = function ()
    {
        const buttonshow = this._p_buttonshow;
        if (!buttonshow)
            return;

        const options = buttonshow.split(",");
        if (options.length > 0)
        {
            if (options.includes("all")) this._showButtonAll();
            if (options.includes("itemscroll")) this.showScrollButton();
            if (options.includes("arrange")) this.showArrangeButton();
            if (options.includes("closeall")) this.showCloseAllButton();
            if (options.includes("maxrestore")) this.showMaxRestoreButton();
            if (options.includes("framelistpopupmenu")) this.showFrameListPopupMenuButton();
            if (options.includes("extra")) this.showExtraButton();
        }
    };

    _pTabBarButtonSetControl._isAttachPositionLeft = function ()
    {
        const parent = this.parent;
        if (!parent)
            return false;

        if (parent._isAttachPositionLeft())
        {
            return true;
        }
        return false;
    };

    _pTabBarButtonSetControl._isAttachPositionTop = function ()
    {
        const parent = this.parent;
        if (!parent)
            return false;

        if (parent._isAttachPositionTop())
        {
            return true;
        }
        return false;
    };

    _pTabBarButtonSetControl._isAttachPositionRight = function ()
    {
        const parent = this.parent;
        if (!parent)
            return false;

        if (parent._isAttachPositionRight())
        {
            return true;
        }
        return false;
    };

    _pTabBarButtonSetControl._isAttachPositionBottom = function ()
    {
        const parent = this.parent;
        if (!parent)
            return false;

        if (parent._isAttachPositionBottom())
        {
            return true;
        }
        return false;
    };

    _pTabBarButtonSetControl._isAttachPositionVertical = function ()
    {
        if (this._isAttachPositionLeft() || this._isAttachPositionRight())
        {
            return true;
        }
        return false;
    };

    _pTabBarButtonSetControl._isAttachPositionHorizontal = function ()
    {
        if (this._isAttachPositionVertical())
        {
            return false;
        }
        return true;
    };

    //===============================================================
    // nexacro._TabBarButtonSetControl : Event Handler
    //===============================================================
    _pTabBarButtonSetControl._on_button_onclick = function (obj, e)
    {
        const owner = this.parent;
        if (owner)
        {
            const id = obj.id;
            if (id.startsWith(this._EXTRABUTTON_ID_PREFIX))
            {
                owner._on_extrabutton_onclick(obj, e);
                return;
            }
            else
            {
                switch (id)
                {
                    case this._FORWARDSCROLLBUTTON_ID:
                        owner._on_forwardscrollbutton_onclick(obj, e);
                        break;
                    case this._BACKWARDSCROLLBUTTON_ID:
                        owner._on_backwardscrollbutton_onclick(obj, e);
                        break;
                    case this._FRAMELISTPOPUPMENUBUTTON_ID:
                        owner._on_framelistpopupmenubutton_onclick(obj, e);
                        break;
                    case this._CLOSEALLBUTTON_ID:
                        owner._on_closeallbutton_onclick(obj, e);
                        break;
                    case this._MAXRESTOREBUTTON_ID:
                        owner._on_maxrestorebutton_onclick(obj, e);
                        break;
                    case this._CASCADEBUTTON_ID:
                        owner._on_cascadebutton_onclick(obj, e);
                        break;
                    case this._HORIZONTALBUTTON_ID:
                        owner._on_horizontalbutton_onclick(obj, e);
                        break;
                    case this._VERTICALBUTTON_ID:
                        owner._on_verticalbutton_onclick(obj, e);
                        break;
                }
            }
        }
    };

    //===============================================================
    // nexacro._TabBarButtonSetControl : override
    //===============================================================
    _pTabBarButtonSetControl._on_getFitSize = function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            let total_w = 0;
            let total_h = 0;

            const border = this._getCurrentStyleBorder();
            const padding = this._getCurrentStylePadding();

            if (border)
            {
                total_w += border._getBorderWidth();
                total_h += border._getBorderHeight();
            }

            if (padding)
            {
                total_w += padding.left + padding.right;
                total_h += padding.top + padding.bottom;
            }

            const buttons = this._buttons;
            const buttongap = this._buttongap;
            let buttonwidth = this._buttonwidth;
            let buttonheight = this._buttonheight;
            const separatorsize = this._separatorsize;
            const useAutofitButtonSize = (buttonwidth < 0 || buttonheight < 0);

            if (this._isAttachPositionHorizontal())
            {
                let max_height = 0;

                buttons.forEach((button) =>
                {
                    if (!button.comp.visible)
                        return;

                    if (button.type === "separator")
                    {
                        total_w += separatorsize + buttongap;
                    }
                    else // button.type === "button"
                    {
                        if (useAutofitButtonSize)
                        {
                            const buttonsize = button.comp._on_getFitSize();

                            buttonwidth = buttonsize[0];
                            buttonheight = buttonsize[1];
                        }
                        max_height = Math.max(max_height, buttonheight);
                        total_w += buttonwidth + buttongap;
                    }
                });

                total_h += max_height;

                if (buttons.size > 0)
                {
                    total_w -= buttongap;
                }
                return [total_w, total_h];
            }
            else // vertical
            {
                let max_width = 0;

                buttons.forEach((button) =>
                {
                    if (!button.comp.visible)
                        return;

                    if (button.type === "separator")
                    {
                        total_h += separatorsize + buttongap;
                    }
                    else // button.type === "button"
                    {
                        if (useAutofitButtonSize)
                        {
                            const buttonsize = button.comp._on_getFitSize();

                            buttonwidth = buttonsize[0];
                            buttonheight = buttonsize[1];
                        }
                        max_width = Math.max(max_width, buttonwidth);
                        total_h += buttonheight + buttongap;
                    }
                });

                total_w += max_width;

                if (buttons.size > 0)
                {
                    total_h -= buttongap;
                }
                return [total_w, total_h];
            }
        }
        return [this._adjust_width, this._adjust_height];
    };

    //===============================================================
    // nexacro._TabBarButtonSetControl : methods
    //===============================================================
    _pTabBarButtonSetControl.showScrollButton = function ()
    {
        this._showButton(this._FORWARDSCROLLBUTTON_ID);
        this._showButton(this._BACKWARDSCROLLBUTTON_ID);
    };

    _pTabBarButtonSetControl.hideScrollButton = function ()
    {
        this._hideButton(this._FORWARDSCROLLBUTTON_ID);
        this._hideButton(this._BACKWARDSCROLLBUTTON_ID);
    };

    _pTabBarButtonSetControl.showArrangeButton = function ()
    {
        this._showButton(this._CASCADEBUTTON_ID);
        this._showButton(this._HORIZONTALBUTTON_ID);
        this._showButton(this._VERTICALBUTTON_ID);
    };

    _pTabBarButtonSetControl.hideArrangeButton = function ()
    {
        this._hideButton(this._CASCADEBUTTON_ID);
        this._hideButton(this._HORIZONTALBUTTON_ID);
        this._hideButton(this._VERTICALBUTTON_ID);
    };

    _pTabBarButtonSetControl.showCloseAllButton = function ()
    {
        this._showButton(this._CLOSEALLBUTTON_ID);
    };

    _pTabBarButtonSetControl.hideCloseAllButton = function ()
    {
        this._hideButton(this._CLOSEALLBUTTON_ID);
    };

    _pTabBarButtonSetControl.showMaxRestoreButton = function ()
    {
        this._showButton(this._MAXRESTOREBUTTON_ID);
    };

    _pTabBarButtonSetControl.hideMaxRestoreButton = function ()
    {
        this._hideButton(this._MAXRESTOREBUTTON_ID);
    };

    _pTabBarButtonSetControl.showFrameListPopupMenuButton = function ()
    {
        this._showButton(this._FRAMELISTPOPUPMENUBUTTON_ID);
    };

    _pTabBarButtonSetControl.hideFrameListPopupMenuButton = function ()
    {
        this._hideButton(this._FRAMELISTPOPUPMENUBUTTON_ID);
    };

    _pTabBarButtonSetControl.showExtraButton = function ()
    {
        const buttons = this._buttons;
        if (buttons)
        {
            this._extraButtonInfos.forEach((info) =>
            {
                this._showButton(info.id);
            });
        }
    };

    _pTabBarButtonSetControl.hideExtraButton = function ()
    {
        const buttons = this._buttons;
        if (buttons)
        {
            this._extraButtonInfos.forEach((info) =>
            {
                this._hideButton(info.id);
            });
        }
    };

    _pTabBarButtonSetControl.applyShowPriority = function (size)
    {
        if (!this._is_created_contents)
            return;

        // 버튼의 visible 을 buttonshow 속성값대로 복원
        this._applyButtonShowOptions();

        const isHorizontal = this._isAttachPositionHorizontal();
        const getFitSize = () => isHorizontal ? this._on_getFitSize()[0] : this._on_getFitSize()[1];

        const button_priority = [
            this.hideArrangeButton.bind(this),
            this.hideMaxRestoreButton.bind(this),
            this.hideCloseAllButton.bind(this),
            this.hideScrollButton.bind(this),
            this.hideExtraButton.bind(this)
        ];

        while (button_priority.length > 0 && getFitSize() > size)
        {
            button_priority.shift()(); // 우선순위대로 버튼 숨김
        }
    };

    _pTabBarButtonSetControl.setMaximizeState = function (isMaximized)
    {
        this._is_maximized = isMaximized;

        const button = this._buttons.get(this._MAXRESTOREBUTTON_ID);
        if (button)
        {
            // maxrestorebutton 은 selected 상태일때 restore 버튼으로 동작
            button.comp._changeUserStatus("selected", isMaximized);

            // 상태에 맞도록 tooltiptext 변경
            button.comp.set_tooltiptext(nexacro._GetSystemErrorMsg(this, `${this._type_name}.${button.comp.id}` + (isMaximized ? "_restore" : "_maximize")));
        }
    };

    _pTabBarButtonSetControl.setEnableItemScrollButton = function (enableForwardScroll, enableBackwardScroll)
    {
        const control_elem = this.getElement();
        if (!control_elem)
            return;

        const forwardscrollbutton = this._buttons.get(this._FORWARDSCROLLBUTTON_ID);
        if (forwardscrollbutton)
        {
            forwardscrollbutton.comp.set_enable(enableForwardScroll);
        }

        const backwardscrollbutton = this._buttons.get(this._BACKWARDSCROLLBUTTON_ID);
        if (backwardscrollbutton)
        {
            backwardscrollbutton.comp.set_enable(enableBackwardScroll);
        }
    }

    _pTabBarButtonSetControl.setExtraButtonInfo = function (count, tooltiptext)
    {
        const getExtraButtonToolTipText = (info, idx) =>
        {
            if (!info)
                return undefined;

            return info[idx] || undefined;
        };

        const tooltiptextinfo = tooltiptext ? tooltiptext.split(",") : undefined;

        if (count > 0)
        {
            this._extraButtonInfos = new Array(count);
            for (let i = 0; i < count; i++)
            {
                const buttonId = `${this._EXTRABUTTON_ID_PREFIX}${i + 1}`;
                this._extraButtonInfos[i] = {
                    type: "button",
                    id: buttonId,
                    tooltiptextmsg: getExtraButtonToolTipText(tooltiptextinfo, i) || undefined
                };
            }
        }
        else
        {
            this._extraButtonInfos = new Array();
        }

        this._recreateContents();
    };

    _pTabBarButtonSetControl.setExtraButtonVisible = function (from, to, visible)
    {
        const buttons = this._buttons;
        if (buttons)
        {
            for (let i = from; i <= to; i++)
            {
                const buttonId = `${this._EXTRABUTTON_ID_PREFIX}${i}`;
                const button = buttons.get(buttonId);
                if (button)
                {
                    button._dynamic_visible = visible; // 메소드에 의한 동적 visible 설정
                    button.comp.set_visible(visible);
                }
            }
        }
    };

    _pTabBarButtonSetControl.getExtraButtonVisible = function (idx)
    {
        const buttons = this._buttons;
        if (buttons)
        {
            const buttonId = `${this._EXTRABUTTON_ID_PREFIX}${idx}`;
            const button = buttons.get(buttonId);
            if (button)
            {
                return button.comp.visible;
            }
        }
        return false;
    };

    //==============================================================================
    // nexacro.TabBarControl
    //==============================================================================
    nexacro.TabBarControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._itemset = new nexacro._TabBarItemSetControl("tabbaritemset", 0, 0, 0, 0, null, null, null, null, null, null, this);
        this._buttonset = new nexacro._TabBarButtonSetControl("tabbarbuttonset", 0, 0, 0, 0, null, null, null, null, null, null, this);

        this._initFrameListPopupMenu();
    };

    var _pTabBarControl = nexacro._createPrototype(nexacro.Component, nexacro.TabBarControl);
    nexacro.TabBarControl.prototype = _pTabBarControl;

    _pTabBarControl._type_name = "TabBarControl";
    _pTabBarControl._DEFAULT_BUTTON_SIZE = 16;
    _pTabBarControl._DEFAULT_ITEMSET_AREA_THRESHOLD = 200;

    /* properties */
    _pTabBarControl._p_attachposition = "top";
    _pTabBarControl._p_extrabuttoncount = 0;
    _pTabBarControl._p_extrabuttontooltiptext = undefined;

    _pTabBarControl._p_itemheight = undefined;
    _pTabBarControl._p_itemminheight = 0;
    _pTabBarControl._p_itemmaxheight = undefined;
    _pTabBarControl._p_itemwidth = undefined;
    _pTabBarControl._p_itemminwidth = 0;
    _pTabBarControl._p_itemmaxwidth = undefined;
    _pTabBarControl._p_itemgap = 0;
    _pTabBarControl._p_itemjustify = false;
    _pTabBarControl._p_itemusepinbutton = false;
    _pTabBarControl._p_itempinbuttonposition = "start";
    _pTabBarControl._p_itempinbuttonsize = undefined;
    _pTabBarControl._p_itemclosebuttonsize = undefined;

    _pTabBarControl._p_buttonshow = "all";
    _pTabBarControl._p_buttongap = 4;
    _pTabBarControl._p_buttonsize = undefined;
    _pTabBarControl._p_buttonseparatorsize = 1;

    /* internal variable */
    _pTabBarControl._itempinbuttonwidth = _pTabBarControl._DEFAULT_BUTTON_SIZE;
    _pTabBarControl._itempinbuttonheight = _pTabBarControl._DEFAULT_BUTTON_SIZE;
    _pTabBarControl._itemclosebuttonwidth = _pTabBarControl._DEFAULT_BUTTON_SIZE;
    _pTabBarControl._itemclosebuttonheight = _pTabBarControl._DEFAULT_BUTTON_SIZE;
    _pTabBarControl._buttonwidth = -1;
    _pTabBarControl._buttonheight = -1;

    /* internal value */
    _pTabBarControl._is_subcontrol = true;
    _pTabBarControl._is_focus_accept = false;
    _pTabBarControl._is_nc_control = true;

    //===============================================================
    // nexacro.TabBarControl : Create & Destroy & Update
    //===============================================================
    _pTabBarControl.on_create_contents = function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            const itemset = this._itemset;
            if (itemset)
            {
                itemset.set_scrolltype("both");
                itemset.set_scrollbartype("none");

                itemset.createComponent(true);
            }

            const buttonset = this._buttonset;
            if (buttonset)
            {
                buttonset.createComponent(true);
            }

            const framelistpopupmenu = this._framelistpopupmenu;
            if (framelistpopupmenu)
            {
                framelistpopupmenu._is_focus_accept = false;
                framelistpopupmenu._setControl();
                framelistpopupmenu.createComponent(true);
            }
        }
    };

    _pTabBarControl.on_created_contents = function (win)
    {
        this._itemset.on_created(win);
        this._buttonset.on_created(win);
        this._framelistpopupmenu.on_created(win);

        this._bindEvent();
        this.on_apply_buttonshow();
    };

    _pTabBarControl.on_destroy_contents = function (callremovechild)
    {
        this._unBindEvent();
        this._destroyFrameListPopupMenu();

        if (this._itemset)
        {
            this._itemset.destroy(callremovechild);
            this._itemset = null;
        }
        if (this._buttonset)
        {
            this._buttonset.destroy(callremovechild);
            this._buttonset = null;
        }
    };

    _pTabBarControl.on_change_containerRect = function (width, height)
    {
        nexacro.Component.prototype.on_change_containerRect.call(this, width, height);

        this._recalcLayout(width, height);
    };

    //===============================================================
    // nexacro.TabBarControl : Properties
    //===============================================================
    _pTabBarControl.set_attachposition = function (val)
    {
        if (this._p_attachposition != val)
        {
            this._p_attachposition = val;
        }
    };

    _pTabBarControl.set_extrabuttoncount = function (val)
    {
        if (val !== undefined)
        {
            if (isNaN(val = +val) || val < 0)
                return;

            if (val > 5)
                val = 5; // extrabutton 은 최대 5개까지만 지원
        }

        if (this._p_extrabuttoncount != val)
        {
            this._p_extrabuttoncount = val;
            this.on_apply_extrabuttoncount();
        }
    };

    _pTabBarControl.on_apply_extrabuttoncount = function ()
    {
        const buttonset = this._buttonset;
        if (buttonset)
            buttonset.setExtraButtonInfo(this._p_extrabuttoncount, this._p_extrabuttontooltiptext);

        if (this._is_created_contents)
        {
            this._recalcLayout();
            this.updateScrollButtonState();
        }
    };

    _pTabBarControl.set_extrabuttontooltiptext = function (val)
    {
        if (val !== undefined)
        {
            if (typeof val != "string")
                return;
        }

        if (this._p_extrabuttontooltiptext != val)
        {
            this._p_extrabuttontooltiptext = val;
            this.on_apply_extrabuttontooltiptext();
        }
    };

    _pTabBarControl.on_apply_extrabuttontooltiptext = function ()
    {
        const buttonset = this._buttonset;
        if (buttonset)
            buttonset.setExtraButtonInfo(this._p_extrabuttoncount, this._p_extrabuttontooltiptext);

        if (this._is_created_contents)
        {
            this._recalcLayout();
            this.updateScrollButtonState();
        }
    }

    _pTabBarControl.set_itemheight = function (val)
    {
        if (val !== undefined)
        {
            if (isNaN(val = +val) || val < 0)
            {
                return;
            }
        }

        if (this._p_itemheight != val)
        {
            this._p_itemheight = val;
            this.on_apply_itemheight();
        }
    };

    _pTabBarControl.on_apply_itemheight = function ()
    {
        if (this._is_created_contents)
        {
            const itemset = this._itemset;
            if (itemset)
                itemset.update();
        }
    };

    _pTabBarControl.set_itemminheight = function (val)
    {
        if (val !== undefined)
        {
            if (isNaN(val = +val) || val < 0)
            {
                return;
            }
        }

        if (this._p_itemminheight != val)
        {
            this._p_itemminheight = val;
            this.on_apply_itemminheight();
        }
    };

    _pTabBarControl.on_apply_itemminheight = function ()
    {
        if (this._is_created_contents)
        {
            const itemset = this._itemset;
            if (itemset)
                itemset.update();
        }
    };

    _pTabBarControl.set_itemmaxheight = function (val)
    {
        if (val !== undefined)
        {
            if (isNaN(val = +val) || val < 0)
            {
                return;
            }
        }

        if (this._p_itemmaxheight != val)
        {
            this._p_itemmaxheight = val;
            this.on_apply_itemmaxheight();
        }
    };

    _pTabBarControl.on_apply_itemmaxheight = function ()
    {
        if (this._is_created_contents)
        {
            const itemset = this._itemset;
            if (itemset)
                itemset.update();
        }
    };

    _pTabBarControl.set_itemwidth = function (val)
    {
        if (val !== undefined)
        {
            if (isNaN(val = +val) || val < 0)
            {
                return;
            }
        }

        if (this._p_itemwidth != val)
        {
            this._p_itemwidth = val;
            this.on_apply_itemwidth();
        }
    }

    _pTabBarControl.on_apply_itemwidth = function ()
    {
        if (this._is_created_contents)
        {
            const itemset = this._itemset;
            if (itemset)
                itemset.update();
        }
    };

    _pTabBarControl.set_itemminwidth = function (val)
    {
        if (val !== undefined)
        {
            if (isNaN(val = +val) || val < 0)
            {
                return;
            }
        }

        if (this._p_itemminwidth != val)
        {
            this._p_itemminwidth = val;
            this.on_apply_itemminwidth();
        }
    }

    _pTabBarControl.on_apply_itemminwidth = function ()
    {
        if (this._is_created_contents)
        {
            const itemset = this._itemset;
            if (itemset)
                itemset.update();
        }
    };

    _pTabBarControl.set_itemmaxwidth = function (val)
    {
        if (val !== undefined)
        {
            if (isNaN(val = +val) || val < 0)
            {
                return;
            }
        }

        if (this._p_itemmaxwidth != val)
        {
            this._p_itemmaxwidth = val;
            this.on_apply_itemmaxwidth();
        }
    };

    _pTabBarControl.on_apply_itemmaxwidth = function ()
    {
        if (this._is_created_contents)
        {
            const itemset = this._itemset;
            if (itemset)
                itemset.update();
        }
    };

    _pTabBarControl.set_itemgap = function (val)
    {
        if (val !== undefined)
        {
            if (isNaN(val = +val) || val < 0)
            {
                return;
            }
        }

        if (this._p_itemgap != val)
        {
            this._p_itemgap = val;
            this.on_apply_itemgap();
        }
    };

    _pTabBarControl.on_apply_itemgap = function ()
    {
        if (this._is_created_contents)
        {
            const itemset = this._itemset;
            if (itemset)
                itemset.update();
        }
    };

    _pTabBarControl.set_itemjustify = function (val)
    {
        if (this._p_itemjustify != val)
        {
            this._p_itemjustify = val;
            this.on_apply_itemjustify();
        }
    }

    _pTabBarControl.on_apply_itemjustify = function ()
    {
        if (this._is_created_contents)
        {
            const itemset = this._itemset;
            if (itemset)
                itemset.update();
        }
    };

    _pTabBarControl.set_itemusepinbutton = function (val)
    {
        if (this._p_itemusepinbutton != val)
        {
            this._p_itemusepinbutton = val;
            this.on_apply_itemusepinbutton();
        }
    }

    _pTabBarControl.on_apply_itemusepinbutton = function ()
    {
        const itemset = this._itemset;
        if (itemset)
            itemset.set_itemusepinbutton(this._p_itemusepinbutton);
    };

    _pTabBarControl.set_itempinbuttonposition = function (val)
    {
        if (this._p_itempinbuttonposition != val)
        {
            this._p_itempinbuttonposition = val;
            this.on_apply_itempinbuttonposition();
        }
    };

    _pTabBarControl.on_apply_itempinbuttonposition = function ()
    {
        const itemset = this._itemset;
        if (itemset)
            itemset.set_itempinbuttonposition(this._p_itempinbuttonposition);
    }

    _pTabBarControl.set_itempinbuttonsize = function (val)
    {
        if (this._p_itempinbuttonsize != val)
        {
            this._p_itempinbuttonsize = val;
            this.on_apply_itempinbuttonsize();
        }
    };

    _pTabBarControl.on_apply_itempinbuttonsize = function ()
    {
        const itemset = this._itemset;
        if (itemset)
            itemset.set_itempinbuttonsize(this._p_itempinbuttonsize);
    };

    _pTabBarControl.set_itemclosebuttonsize = function (val)
    {
        if (this._p_itemclosebuttonsize != val)
        {
            this._p_itemclosebuttonsize = val;
            this.on_apply_itemclosebuttonsize();
        }
    };

    _pTabBarControl.on_apply_itemclosebuttonsize = function ()
    {
        const itemset = this._itemset;
        if (itemset)
            itemset.set_itemclosebuttonsize(this._p_itemclosebuttonsize);
    };

    _pTabBarControl.set_buttonshow = function (val)
    {
        if (this._p_buttonshow != val)
        {
            this._p_buttonshow = val;
            this.on_apply_buttonshow();
        }
    };

    _pTabBarControl.on_apply_buttonshow = function ()
    {
        const buttonset = this._buttonset;
        if (buttonset)
        {
            buttonset.set_buttonshow(this._p_buttonshow);

            if (this._is_created_contents)
                this._recalcLayout();
        }
    };

    _pTabBarControl.set_buttongap = function (val)
    {
        if (this._p_buttongap != val)
        {
            this._p_buttongap = val;
            this.on_apply_buttongap();
        }
    };

    _pTabBarControl.on_apply_buttongap = function ()
    {
        const buttonset = this._buttonset;
        if (buttonset)
        {
            buttonset.set_buttongap(this._p_buttongap);

            if (this._is_created_contents)
                this._recalcLayout();
        }
    };

    _pTabBarControl.set_buttonsize = function (val)
    {
        if (this._p_buttonsize != val)
        {
            this._p_buttonsize = val;
            this.on_apply_buttonsize();
        }
    };

    _pTabBarControl.on_apply_buttonsize = function ()
    {
        const buttonset = this._buttonset;
        if (buttonset)
        {
            buttonset.set_buttonsize(this._p_buttonsize);

            if (this._is_created_contents)
                this._recalcLayout();
        }
    };

    _pTabBarControl.set_buttonseparatorsize = function (val)
    {
        if (this._p_buttonseparatorsize != val)
        {
            this._p_buttonseparatorsize = val;
            this.on_apply_buttonseparatorsize();
        }
    };

    _pTabBarControl.on_apply_buttonseparatorsize = function ()
    {
        const buttonset = this._buttonset;
        if (buttonset)
        {
            buttonset.set_separatorsize(this._p_buttonseparatorsize);

            if (this._is_created_contents)
                this._recalcLayout();
        }
    };

    //===============================================================
    // nexacro.TabBarControl :  Event Handlers
    //===============================================================
    _pTabBarControl._on_item_onclick = function (obj, e)
    {
        const frame = obj._linked_frame;
        if (frame)
        {
            frame._changeStateActivate(true);
        }
    }

    _pTabBarControl._on_forwardscrollbutton_onclick = function (obj, e)
    {
        const itemset = this._itemset;
        if (itemset)
        {
            itemset.scrollForward();
        }
    };

    _pTabBarControl._on_backwardscrollbutton_onclick = function (obj, e)
    {
        const itemset = this._itemset;
        if (itemset)
        {
            itemset.scrollBackward();
        }
    };

    _pTabBarControl._on_framelistpopupmenubutton_onclick = function (obj, e)
    {
        this._showFrameListPopupMenu(obj);
    };

    _pTabBarControl._on_closeallbutton_onclick = function (obj, e)
    {
        const ownerframe = this._getOwnerFrame();
        if (ownerframe)
        {
            const frames_to_close = Object.values(ownerframe.frames).filter(frame =>
                frame && typeof frame._on_closebutton_click === "function" && !frame.pinned // pinned frame 제외
            );

            for (const frame of frames_to_close)
            {
                frame._on_closebutton_click(obj, e);
            }
        }
    };

    _pTabBarControl._on_maxrestorebutton_onclick = function (obj, e)
    {
        const ownerframe = this._getOwnerFrame();
        if (ownerframe)
        {
            const active_frame = ownerframe.getActiveFrame();
            if (!active_frame)
                return;

            if (!active_frame.resizable) // resizable 이 false 인 경우는 maximize 버튼을 클릭해도 동작하지 않음 (버튼 disable 상태 연동은 요구시 추가 구현)
                return;

            if (obj._isSelected())
            {
                active_frame._on_normalbutton_click(obj, e);
            }
            else
            {
                active_frame._on_maxbutton_click(obj, e);
            }
        }
    };

    _pTabBarControl._on_cascadebutton_onclick = function (obj, e)
    {
        const ownerframe = this._getOwnerFrame();
        if (ownerframe && typeof ownerframe.arrange === "function")
        {
            ownerframe.arrange("cascade");
        }
    };

    _pTabBarControl._on_horizontalbutton_onclick = function (obj, e)
    {
        const ownerframe = this._getOwnerFrame();
        if (ownerframe && typeof ownerframe.arrange === "function")
        {
            ownerframe.arrange("horizontal");
        }
    };

    _pTabBarControl._on_verticalbutton_onclick = function (obj, e)
    {
        const ownerframe = this._getOwnerFrame();
        if (ownerframe && typeof ownerframe.arrange === "function")
        {
            ownerframe.arrange("vertical");
        }
    };

    _pTabBarControl._on_framelistpopupmenu_onmenuclick = function (obj, e)
    {
        const ownerframe = this._getOwnerFrame();
        if (ownerframe)
        {
            const frame = ownerframe._p_frames.get_item(e.id); // e.id 는 frame.id
            if (frame)
            {
                if (e.fromreferenceobject && e.fromreferenceobject.id === 'popupmenuitemcheckbox')
                {
                    if (frame.pinned)
                        this.unpinItem(frame);
                    else
                        this.pinItem(frame);
                }
                else
                {
                    frame._changeStateActivate(true);
                }
            }
        }
    };

    _pTabBarControl._on_extrabutton_onclick = function (obj, e)
    {
        const ownerframe = this._getOwnerFrame();
        if (ownerframe)
        {
            ownerframe.on_fire_ontabbarextrabuttonclick(obj, e);
        }
    }

    _pTabBarControl._on_itemset_onhscroll = function (obj, e)
    {
        if (this._isAttachPositionVertical())
            return;

        this.updateSelectedItemIndicator();
        this.updateScrollButtonState();
    };

    _pTabBarControl._on_itemset_onvscroll = function (obj, e)
    {
        if (this._isAttachPositionHorizontal())
            return;

        this.updateSelectedItemIndicator();
        this.updateScrollButtonState();
    };

    //===============================================================
    // nexacro._TabBarControl : override
    //===============================================================
    _pTabBarControl._on_getFitSize = function ()
    {
        const control_elem = this.getElement();
        if (control_elem)
        {
            let total_w = 0;
            let total_h = 0;

            const itemset = this._itemset;
            const itemset_width = itemset._on_getFitSize()[0];
            const itemset_height = itemset._on_getFitSize()[1];

            const buttonset = this._buttonset;
            const buttonset_width = buttonset._on_getFitSize()[0];
            const buttonset_height = buttonset._on_getFitSize()[1];

            if (this._isAttachPositionHorizontal())
            {
                total_w += itemset_width;
                total_w += buttonset_width;
                total_h = Math.max(itemset_height, buttonset_height);
            }
            else // attachposition is vertical
            {
                total_h += itemset_height;
                total_h += buttonset_height;
                total_w = Math.max(itemset_width, buttonset_width);
            }

            const border = this._getCurrentStyleBorder();
            const padding = this._getCurrentStylePadding();

            if (border)
            {
                total_w += border._getBorderWidth();
                total_h += border._getBorderHeight();
            }

            if (padding)
            {
                total_w += padding.left + padding.right;
                total_h += padding.top + padding.bottom;
            }

            return [total_w, total_h];
        }
        return [this._adjust_width, this._adjust_height];
    };

    //===============================================================
    // nexacro.TabBarControl : Logical Part
    //===============================================================
    _pTabBarControl._recalcLayout = function (width, height)
    {
        // attachposition 에 따라 itemset 과 buttonset 을 배치
        // buttonset 을 우선 배치하고 남은 영역이 itemset 의 가용영역이 된다
        //
        width = width ?? this._getClientWidth();
        height = height ?? this._getClientHeight();

        let itemset_left = 0;
        let itemset_top = 0;
        let itemset_width = 0;
        let itemset_height = 0;

        let buttonset_left = 0;
        let buttonset_top = 0;
        let buttonset_width = 0;
        let buttonset_height = 0;

        if (this._isAttachPositionHorizontal())
        {
            this._buttonset.applyShowPriority(width - this._DEFAULT_ITEMSET_AREA_THRESHOLD);

            buttonset_width = this._buttonset._on_getFitSize()[0];
            buttonset_height = height;
            buttonset_left = width - buttonset_width;

            itemset_left = 0;
            itemset_height = height;
            itemset_width = width - buttonset_width;

            if (itemset_width < 0)
                this._itemset.set_visible(false);
            else
                this._itemset.set_visible(true);
        }
        else // attachposition is vertical
        {
            this._buttonset.applyShowPriority(height - this._DEFAULT_ITEMSET_AREA_THRESHOLD);

            buttonset_width = width;
            buttonset_height = this._buttonset._on_getFitSize()[1];
            buttonset_top = height - buttonset_height;

            itemset_top = 0;
            itemset_width = width;
            itemset_height = height - buttonset_height;

            if (itemset_height < 0)
                this._itemset.set_visible(false);
            else
                this._itemset.set_visible(true);
        }
        this._buttonset.move(buttonset_left, buttonset_top, buttonset_width, buttonset_height);
        this._itemset.move(itemset_left, itemset_top, itemset_width, itemset_height);
    };

    _pTabBarControl._isAttachPositionLeft = function ()
    {
        const attachposition = this._p_attachposition;
        if (!attachposition)
            return false;

        if (attachposition === 'left')
        {
            return true;
        }
        return false;
    };

    _pTabBarControl._isAttachPositionTop = function ()
    {
        const attachposition = this._p_attachposition;
        if (!attachposition)
            return false;

        if (attachposition === 'top')
        {
            return true;
        }
        return false;
    };

    _pTabBarControl._isAttachPositionRight = function ()
    {
        const attachposition = this._p_attachposition;
        if (!attachposition)
            return false;

        if (attachposition === 'right')
        {
            return true;
        }
        return false;
    };

    _pTabBarControl._isAttachPositionBottom = function ()
    {
        const attachposition = this._p_attachposition;
        if (!attachposition)
            return false;

        if (attachposition === 'bottom')
        {
            return true;
        }
        return false;
    };

    _pTabBarControl._isAttachPositionVertical = function ()
    {
        if (this._isAttachPositionLeft() || this._isAttachPositionRight())
        {
            return true;
        }
        return false;
    };

    _pTabBarControl._isAttachPositionHorizontal = function ()
    {
        if (this._isAttachPositionVertical())
        {
            return false;
        }
        return true;
    };

    _pTabBarControl._initFrameListPopupMenu = function ()
    {
        const innerdataset = this._innerdataset = new nexacro.NormalDataset("framelistpopupmenu:innerdataset", this);
        if (innerdataset)
        {
            innerdataset.set_enableevent(false);
            innerdataset.addColumn("id", "string", 256);
            innerdataset.addColumn("level", "string", 256);
            innerdataset.addColumn("icon", "string", 256);
            innerdataset.addColumn("caption", "string", 256);
            innerdataset.addColumn("enable", "string", 256);
            innerdataset.set_enableevent(true);
        }

        const framelistpopupmenu = this._framelistpopupmenu = new nexacro.PopupMenu("framelistpopupmenu", 0, 0, 0, 0, null, null, null, null, null, null, this);
        if (framelistpopupmenu)
        {
            framelistpopupmenu.set_innerdataset(innerdataset);
            framelistpopupmenu.set_idcolumn("id");
            framelistpopupmenu.set_levelcolumn("level");
            framelistpopupmenu.set_iconcolumn("icon");
            framelistpopupmenu.set_captioncolumn("caption");
            framelistpopupmenu.set_enablecolumn("enable");

            // PopupMenu 를 SubControl 로 쓰는 경우 이벤트 타겟을 TabBarControl 로 변경하기 위해 동적 override 함
            framelistpopupmenu._getRootComponent = function ()
            {
                return this;
            }
        }
    };

    _pTabBarControl._showFrameListPopupMenu = function (obj)
    {
        const framelistpopupmenu = this._framelistpopupmenu;
        const innerdataset = this._innerdataset;
        const itemset = this._itemset;

        if (framelistpopupmenu && innerdataset && itemset)
        {
            innerdataset.set_enableevent(false);
            innerdataset.deleteAll();

            const addMenuItem = (isPinned) =>
            {
                for (let i = 0, len = itemset._items.length; i < len; i++)
                {
                    const item = itemset._items.get_item(i);
                    if (item.isPinned() !== isPinned)
                        continue;

                    if (item.isHidden())
                        continue;

                    const frame = item._linked_frame;
                    if (!frame)
                        continue;

                    const row = innerdataset.addRow();
                    if (row > -1)
                    {
                        innerdataset.setColumn(row, "id", frame.id);
                        innerdataset.setColumn(row, "level", 0);
                        innerdataset.setColumn(row, "caption", frame.titletext);
                        innerdataset.setColumn(row, "enable", frame._isEnable());

                        if (frame.showtitleicon && frame.titlebar && frame.titlebar.titleicon)
                        {
                            innerdataset.setColumn(row, "icon", frame.titlebar.titleicon._getCSSStyleValue("icon"));
                        }

                    }
                }
            };

            addMenuItem(true);
            // addMenuItemSeparator(); // 고정, 비고정 메뉴 item 사이 separator 추가는 필요시 구현
            addMenuItem(false);

            innerdataset.set_enableevent(true);

            if (innerdataset.rowcount > 0)
            {
                const color = this._color ? this._color : this._getCurrentStyleInheritValue("color");
                if (color)
                    framelistpopupmenu.set_color(color.value);
                const font = this._font ? this._font : this._getCurrentStyleInheritValue("font");
                if (font)
                    framelistpopupmenu.set_font(font.value);

                framelistpopupmenu.set_cssclass(this.cssclass);
                framelistpopupmenu._trackPopup(obj);
            }
        }
    };

    _pTabBarControl._destroyFrameListPopupMenu = function ()
    {
        const framelistpopupmenu = this._framelistpopupmenu;
        if (framelistpopupmenu)
        {
            framelistpopupmenu.destroy();
            this._framelistpopupmenu = null;
        }

        const innerdataset = this._innerdataset;
        if (innerdataset)
        {
            innerdataset.destroy();
            this._innerdataset = null;
        }
    };

    _pTabBarControl._bindEvent = function ()
    {
        const framelistpopupmenu = this._framelistpopupmenu;
        if (framelistpopupmenu)
        {
            framelistpopupmenu.addEventHandler("onmenuclick", this._on_framelistpopupmenu_onmenuclick, this);
        }

        const itemset = this._itemset;
        if (itemset)
        {
            itemset.addEventHandler("onhscroll", this._on_itemset_onhscroll, this);
            itemset.addEventHandler("onvscroll", this._on_itemset_onvscroll, this);
        }
    };

    _pTabBarControl._unBindEvent = function ()
    {
        const framelistpopupmenu = this._framelistpopupmenu;
        if (framelistpopupmenu)
        {
            framelistpopupmenu.removeEventHandler("onmenuclick", this._on_framelistpopupmenu_onmenuclick, this);
        }

        const itemset = this._itemset;
        if (itemset)
        {
            itemset.removeEventHandler("onhscroll", this._on_itemset_onhscroll, this);
            itemset.removeEventHandler("onvscroll", this._on_itemset_onvscroll, this);
        }
    };

    //===============================================================
    // nexacro.TabBarControl : methods
    //===============================================================
    _pTabBarControl.addItem = function (frame)
    {
        const itemset = this._itemset;
        if (itemset)
        {
            itemset.addItem(frame);
        }
    };

    _pTabBarControl.insertItem = function (idx, frame)
    {
        const itemset = this._itemset;
        if (itemset)
        {
            itemset.insertItem(idx, frame);
        }
    };

    _pTabBarControl.removeItem = function (frame)
    {
        const itemset = this._itemset;
        if (itemset)
        {
            itemset.removeItem(frame);

            if (itemset._items.length == 0)
            {
                this.setMaximizeState(false); // remove 결과 잔여 item 이 없을 경우 maximize 상태 해제
            }
        }
    };

    _pTabBarControl.pinItem = function (frame)
    {
        const itemset = this._itemset;
        if (itemset)
        {
            itemset.pinItem(frame);
        }
    };

    _pTabBarControl.unpinItem = function (frame)
    {
        const itemset = this._itemset;
        if (itemset)
        {
            itemset.unpinItem(frame);
        }
    };

    _pTabBarControl.selectItem = function (frame)
    {
        const itemset = this._itemset;
        if (itemset)
        {
            itemset.selectItem(frame);
        }
    };

    _pTabBarControl.enableItem = function (frame)
    {
        const itemset = this._itemset;
        if (itemset)
        {
            itemset.enableItem(frame);
        }
    };

    _pTabBarControl.disableItem = function (frame)
    {
        const itemset = this._itemset;
        if (itemset)
        {
            itemset.disableItem(frame);
        }
    };

    _pTabBarControl.updateItem = function (frame)
    {
        const itemset = this._itemset;
        if (itemset)
        {
            itemset.updateItem(frame);
        }
    };

    _pTabBarControl.showItem = function (frame)
    {
        const itemset = this._itemset;
        if (itemset)
        {
            itemset.showItem(frame);
        }
    };

    _pTabBarControl.hideItem = function (frame)
    {
        const itemset = this._itemset;
        if (itemset)
        {
            itemset.hideItem(frame);
        }
    };

    _pTabBarControl.setMaximizeState = function (isMaximized)
    {
        const buttonset = this._buttonset;
        if (buttonset)
        {
            buttonset.setMaximizeState(isMaximized);
        }
    };

    _pTabBarControl.updateSelectedItemIndicator = function ()
    {
        const itemset = this._itemset;
        if (itemset)
        {
            itemset._updateSelectedItemIndicator();
        }
    };

    _pTabBarControl.updateScrollButtonState = function (forward, backward)
    {
        const itemset = this._itemset;
        const buttonset = this._buttonset;
        if (itemset && buttonset)
        {
            buttonset.setEnableItemScrollButton(itemset.canForwardScroll(), itemset.canBackwardScroll());
        }
    };

    _pTabBarControl.setExtraButtonVisible = function (from, to, visible)
    {
        const buttonset = this._buttonset;
        if (buttonset)
            buttonset.setExtraButtonVisible(from, to, visible);

        this._recalcLayout();
    };

    _pTabBarControl.getExtraButtonVisible = function (idx)
    {
        const buttonset = this._buttonset;
        if (buttonset)
            return buttonset.getExtraButtonVisible(idx);

        return false;
    };

    _pTabBarControl._properties = [
        { name: "itemheight" },
        { name: "itemminheight" },
        { name: "itemmaxheight" },
        { name: "itemwidth" },
        { name: "itemminwidth" },
        { name: "itemmaxwidth" },
        { name: "itemgap" },
        { name: "itemjustify" },
        { name: "itemusepinbutton" },
        { name: "itempinbuttonposition" },
        { name: "itempinbuttonsize" },
        { name: "itemclosebuttonsize" },
        { name: "buttonshow" },
        { name: "buttongap" },
        { name: "buttonsize" },
        { name: "buttonseparatorsize" },
        { name: "extrabuttoncount" },
        { name: "extrabuttontooltiptext" }
    ];
    nexacro._defineProperties(_pTabBarControl, _pTabBarControl._properties);

    _pTabBarControl = null;
    _pTabBarItemControl = null;
    _pTabBarItemSetControl = null;
    _pTabBarButtonSetControl = null;
}

