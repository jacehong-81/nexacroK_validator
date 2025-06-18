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

if (nexacro._Browser != "Runtime")
{
    //==============================================================================
    // Element_HTML5
    //==============================================================================
    if (nexacro.Element)
    {
        var _pElement = nexacro.Element.prototype;
        _pElement.setElementAccessibilityStatHidden = function (hidden)
        {
            // controlelement에만 stat 변수로 저장
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMAccessibility_StatHidden(handle, hidden);
            }
        };

        //delete _pElement;
    }

    if (nexacro.IconTextElement)
    {
        var _pIconTextElement = nexacro.IconTextElement.prototype;
        _pIconTextElement._on_createAccessibilityHandle = function (handle)
        {
            const env = nexacro.getEnvironment();
            if (env._p_enableaccessibility && handle)
            {
                let parent_elem = this.parent_elem;
                if (parent_elem)
                {
                    let comp = parent_elem.linkedcontrol;
                    if (env._a11ytype == 4)
                    {
                        if (comp instanceof nexacro._GridButtonControl)
                        {
                            nexacro.__setDOMAccessibility_Role(handle, "button");
                            nexacro.__setDOMNode_TabIndex(handle, "-1");
                        }
                        else
                            nexacro.__setDOMAccessibility_StatHidden(handle, true);
                    }
                    else if (env._a11ytype < 4)
                    {
                        if (comp instanceof nexacro.Button && comp._isAccessibilityRoleHeading())
                        {
                            // heading(h tag)는 자체로 초점이 이동 안되어 Button 일때는 내부 role도 설정하여 초점 이동하도록 추가
                            nexacro.__setDOMAccessibility_Role(handle, "button");
                            nexacro.__setDOMNode_TabIndex(handle, "-1");
                        }
                        // RP 100788 101631 label default 변경으로 text contents 출력 
                    }
                }
            }
        };

        _pIconTextElement._on_createAccessibilityCommand = function (acc_command)
        {
            const env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)
            {
                if (env._a11ytype == 4)
                {
                    acc_command += nexacro.__getDOMAccessibilityStr_StatHidden(true);
                }
                else if (env._a11ytype < 4)
                {
                    let parent_elem = this.parent_elem;
                    if (parent_elem)
                    {
                        let comp = parent_elem.linkedcontrol;
                        if (comp instanceof nexacro.Button && comp._isAccessibilityRoleHeading())
                        {
                            // heading(h tag)는 자체로 초점이 이동 안되어 Button 일때는 내부 role도 설정하여 초점 이동하도록 추가
                            acc_command += nexacro.__getDOMAccessibilityStr_Role("button");
                            acc_command += nexacro.__getHTMLAttr_TabIndex("-1");
                        }
                    }
                    // RP 100788 101631 label default 변경으로 text contents 출력
                }
            }

            return acc_command;
        };

        //delete _pIconTextElement;
    }

    //======================================================================
    // nexacro.ControlElement
    //======================================================================
    if (nexacro.ControlElement) // 추후에 수정
    {
        var _pControlElement = nexacro.ControlElement.prototype;
        //======================================================================
        // nexacro.ControlElement : Accessibility Fuction
        //======================================================================
        _pControlElement._refreshControlTabIndex = function (handle, tabindex)
        {
            if (!handle)
                handle = this.handle;

            if (handle)
            {
                if (tabindex === undefined)
                {
                    if (this.tabindex > -1)
                    {
                        nexacro.__setDOMNode_TabIndex(handle, this.tabindex);
                    }
                    else
                    {
                        // 동적 생성된 Component의 초점 허용 추가(정적생성과 동일 규칙)
                        var comp = this.linkedcontrol;
                        if (comp && comp._isFocusAcceptable() && !comp._is_editable_control && this._is_simple_control)
                        {
                            nexacro.__setDOMNode_TabIndex(handle, this.tabindex);
                        }
                    }
                }
                else
                {
                    if (tabindex !== null)
                    {
                        nexacro.__setDOMNode_TabIndex(handle, tabindex);
                    }
                    else
                    {
                        nexacro.__removeHTMLAttr_Property(handle, "tabindex");
                    }
                }
            }
        };

        _pControlElement._on_createAccessibilityHandle = function ()
        {
            const env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)
            {
                if (env._a11ytype == 5) //android talkback
                {
                    var linkedcontrol = this.linkedcontrol
                    if (linkedcontrol && linkedcontrol._skip_mobile_tabfocus)
                        this.tabindex = -99;
                }
            }
        };

        _pControlElement._on_createAccessibilityCommand = function (acc_command)
        {
            const env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)
            {
                if (!this._is_popup)
                {
                    var comp = this.linkedcontrol;
                    if (comp)
                    {
                        var is_remove_tabindex = false;
                        var is_taborder_bounds = false;
                        if (env._a11ytype == 5) //android talkback
                        {
                            is_remove_tabindex = (comp._skip_mobile_tabfocus || comp._input_element || comp._has_inputElement
                                || (!comp._p_semantictag && comp._p_parent instanceof nexacro.ProgressBar));
                        }
                        else if (env._a11ytype < 4) // Desktop WRE
                        {
                            // focus 처리가 필요한 control 및 item은 tabindex를 명시 센스리더는 tabindex 명시하면 초점 이동 (값 무관)   
                            var root_win = comp._getRootWindow();
                            var is_embedded = nexacro._isEmbeddedWindow(root_win);
                            if (is_embedded)
                            {
                                var _form = comp._refform;
                                if (comp._p_taborder == 0 || comp._p_taborder == _form._child_list.length - 1) // taborderfirst, taborderlast
                                    is_taborder_bounds = true;
                            }
                            else
                            {
                                is_remove_tabindex = (comp._is_editable_control || !this.accessibilityenable || !comp._isFocusAcceptable())
                            }
                        }

                        // screen reader 의 초점 이동 방지
                        if (is_remove_tabindex)
                        {
                            var replace_str = "tabindex ='" + this.tabindex + "'";

                            if (is_taborder_bounds)
                                acc_command = acc_command.replace(replace_str, "tabindex ='0'");
                            else if (is_remove_tabindex)
                                acc_command = acc_command.replace(replace_str, "");
                        }
                    }

                    acc_command += this._getAccessibilityInfoStr();
                }
            }

            return acc_command;
        };

        _pControlElement.setElementAccessibilityRole = function (role)
        {
            var accrole = nexacro._roleList[role];
            const env = nexacro.getEnvironment();
            if (env._a11ytype > 3)
            {
                var linkedcontrol = this.linkedcontrol;
                if (linkedcontrol && linkedcontrol._skip_mobile_tabfocus)
                {
                    accrole = "";
                }
            }

            //if (this.accessibilityrole != accrole)
            {
                this.accessibilityrole = accrole;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setDOMAccessibility_Role(handle, accrole);
                }
            }
        };

        _pControlElement.setElementAccessibilityLabel = function (label)
        {
            if (this.accessibilitylabel != label)
            {
                this.accessibilitylabel = label;
            }

            this._updateElementAccessibilityLabel();
        };

        _pControlElement.accessibilityparentlabel = "";

        _pControlElement.setElementAccessibilityParentLabel = function (parentlabel)
        {
            if (this.accessibilityparentlabel != parentlabel)
            {
                this.accessibilityparentlabel = parentlabel;
            }

            this._updateElementAccessibilityLabel();
        };

        _pControlElement._updateElementAccessibilityLabel = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                var readlabel = this._makeAccessibilityLabelbyReadtype(this);
                if (readlabel != this.accessibilityreadlabel)
                {
                    var comp = this.linkedcontrol;
                    this.accessibilityreadlabel = readlabel;
                    if (this._isAriaDescription())
                    {
                        if (comp && comp instanceof nexacro._GridCellControl)
                        {
                            readlabel += " " + comp._displaytext;
                        }
                        nexacro.__setDOMAccessibility_Description(handle, readlabel);
                        nexacro.__setDOMAccessibility_Label(handle, "");
                    }
                    else
                    {
                        var env = nexacro.getEnvironment();
                        nexacro.__setDOMAccessibility_Description(handle, "");
                        if (env._a11ytype > 3 || !comp._is_editable_control)
                            nexacro.__setDOMAccessibility_Label(handle, readlabel);
                    }
                }
            }
        };

        _pControlElement.setElementAccessibilityEnable = function (enable)
        {
            if (this.accessibilityenable != enable)
            {
                this.accessibilityenable = enable;
                var handle = this.handle;
                if (handle)
                {
                    //label
                    var readlabel = this._makeAccessibilityLabelbyReadtype(this);
                    if (enable) 
                    {
                        //role
                        nexacro.__setDOMAccessibility_Role(handle, this.accessibilityrole);
                        if (readlabel != this.accessibilityreadlabel) 
                        {
                            this.accessibilityreadlabel = readlabel;
                            nexacro.__setDOMAccessibility_Label(handle, readlabel);
                        }

                        this.setElementAccessibilityStatHidden(false);
                        this._refreshControlTabIndex(handle, -1); // tabindex
                    }
                    else 
                    {
                        var comp = this.linkedcontrol;
                        const accessibilitytype = comp._env._a11ytype;
                        if ((accessibilitytype > 3) && comp && !comp._skip_mobile_tabfocus)
                        {
                            nexacro.__setDOMAccessibility_Role(handle, "");
                            this.setElementAccessibilityStatHidden(true);
                        }
                        else if (accessibilitytype < 4)
                        {
                            // scrollable, container component는 내부에 진입해야 하므로 hidden 처리 안함
                            if (comp && comp._is_containerset != true && comp._is_container != true && comp._is_subcontrol != true && comp._is_scrollable != true)
                            {
                                this.setElementAccessibilityStatHidden(true);
                                this._refreshControlTabIndex(handle, null); // tabindex 제거
                            }

                            nexacro.__setDOMAccessibility_Disabled(handle);
                            nexacro.__setDOMAccessibility_Label(handle, readlabel);
                        }
                    }
                }
            }
        };

        _pControlElement.setElementAccessibilityDescription = function (desc)
        {
            if (this.accessibilitydescription != desc)
            {
                this.accessibilitydescription = desc;
                var handle = this.handle;
                /*
                if (handle)
                    nexacro.__setDOMAccessibility_Description(handle, desc);
                */
                this._updateElementAccessibilityLabel();
            }
        };

        _pControlElement.setElementAccessibilityDescLevel = function (desclevel)
        {
            this.accessibilitydesclevel = desclevel;

            this._updateElementAccessibilityLabel();
        };

        _pControlElement.setElementAccessibilityAction = function (action)
        {
            this.accessibilityaction = action;

            this._updateElementAccessibilityLabel();
        };

        _pControlElement.setElementAccessibilityValue = function (value, input, bfocus)
        {
            if (this.accessibility_value != value)
            {
                this.accessibility_value = value;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_Value(handle, value, input, bfocus);
            }
        };

        _pControlElement.setElementAccessibilityStatDisabled = function (disabled)
        {
            if (this.accessibility_stat_disabled != disabled)
            {
                this.accessibility_stat_disabled = disabled;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_StatDisabled(handle, disabled);
            }
        };

        _pControlElement.setElementAccessibilityStatHidden = function (hidden)
        {
            if (this.accessibility_stat_hidden != hidden)
            {
                this.accessibility_stat_hidden = hidden;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_StatHidden(handle, hidden);
            }
        };

        _pControlElement.setElementAccessibilityStatChecked = function (checked)
        {
            if (this.accessibility_stat_checked != checked)
            {
                this.accessibility_stat_checked = checked;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_StatChecked(handle, checked);
            }
        };

        _pControlElement.setElementAccessibilityStatPressed = function (pressed)
        {
            if (this.accessibility_stat_pressed != pressed)
            {
                this.accessibility_stat_pressed = pressed;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_StatPressed(handle, pressed);
            }
        };

        _pControlElement.setElementAccessibilityStatSelected = function (selected)
        {
            if (this.accessibility_stat_selected != selected)
            {
                this.accessibility_stat_selected = selected;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_StatSelected(handle, selected);
            }
        };

        _pControlElement.setElementAccessibilityStatLive = function (v)
        {
            if (this.accessibilitylive != v)
            {
                this.accessibilitylive = v;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_Live(handle, v);
            }

        };

        _pControlElement.setElementAccessibilityStatExpanded = function (expanded)
        {
            this.accessibility_stat_expanded = expanded;
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMAccessibility_StatExpanded(handle, expanded);
            }
        };

        _pControlElement.setElementAccessibilityStatAutoComplete = function (autocomplete)
        {
            if (this.accessibility_stat_autocomplete != autocomplete)
            {
                this.accessibility_stat_autocomplete = autocomplete;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_StatAutoComplete(handle, autocomplete);
            }
        };

        _pControlElement.setElementAccessibilityFlagHasPopup = function (haspopup)
        {
            if (this.accessibility_flag_haspopup != haspopup)
            {
                this.accessibility_flag_haspopup = haspopup;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_StatHasPopup(handle, haspopup);
            }
        };

        _pControlElement.setElementAccessibilityFlagFocusable = function (focusable)
        {
            if (this.accessibility_flag_focusable != focusable)
            {
                this.accessibility_flag_focusable = focusable;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_FlagFocusable(handle, focusable);
            }
        };

        _pControlElement.setElementAccessibilityFlagReadOnly = function (readonly)
        {
            //if (this.accessibility_flag_readonly != readonly)
            {
                this.accessibility_flag_readonly = readonly;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setDOMAccessibility_FlagReadOnly(handle, readonly);
                }
            }
        };

        _pControlElement.setElementAccessibilityFlagPassword = function (password)
        {
            if (this.accessibility_flag_password != password)
            {
                this.accessibility_flag_password = password;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_FlagPassword(handle, password);
            }
        };

        _pControlElement.setElementAccessibilityFlagMultiSelectable = function (multiselectable)
        {
            if (this.accessibility_flag_multiselectable != multiselectable)
            {
                this.accessibility_flag_multiselectable = multiselectable;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_FlagMultiSelectable(handle, multiselectable);
            }
        };

        _pControlElement.setElementAccessibilityFlagDefaultButton = function (defaultbutton)
        {
            if (this.accessibility_flag_defaultbutton != defaultbutton)
            {
                this.accessibility_flag_defaultbutton = defaultbutton;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_FlagDefaultButton(handle, defaultbutton);
            }
        };

        _pControlElement.setElementAccessibilityFlagMultiLine = function (multiline)
        {
            if (this.accessibility_flag_multiline != multiline)
            {
                this.accessibility_flag_multiline = multiline;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_FlagMultiLine(handle, multiline);
            }
        };

        _pControlElement.setElementAccessibilityInfoCount = function (count)
        {
            if (this.accessibility_prop_infocount != count)
            {
                this.accessibility_prop_infocount = count;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_InfoCount(handle, count);
            }
        };

        _pControlElement.setElementAccessibilityInfoIndex = function (index)
        {
            if (this.accessibility_prop_infoindex != index)
            {
                this.accessibility_prop_infoindex = index;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_InfoIndex(handle, index);
            }
        };

        _pControlElement.setElementAccessibilityInfoValueMax = function (valuemax)
        {
            if (this.accessibility_prop_infovaluemax != valuemax)
            {
                this.accessibility_prop_infovaluemax = valuemax;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_InfoValueMax(handle, valuemax);
            }
        };

        _pControlElement.setElementAccessibilityInfoValueMin = function (valuemin)
        {
            if (this.accessibility_prop_infovaluemin != valuemin)
            {
                this.accessibility_prop_infovaluemin = valuemin;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_InfoValueMin(handle, valuemin);
            }
        };

        _pControlElement.setElementAccessibilityInfoValueCur = function (valuecur)
        {
            if (this.accessibility_prop_infovaluecur != valuecur)
            {
                this.accessibility_prop_infovaluecur = valuecur;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_InfoValueCur(handle, valuecur);
            }
        };

        _pControlElement.setElementAccessibilityInfoLevel = function (level)
        {
            if (this.accessibility_prop_infolevel != level)
            {
                this.accessibility_prop_infolevel = level;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_InfoLevel(handle, level);
            }
        };

        _pControlElement.setElementAccessibilityInfoColIndex = function (index)
        {
            if (this.accessibility_prop_infocolindex != index)
            {
                this.accessibility_prop_infocolindex = index;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_InfoColIndex(handle, index);
            }
        };

        _pControlElement.setElementAccessibilityInfoRowIndex = function (index)
        {
            if (this.accessibility_prop_inforowindex != index)
            {
                this.accessibility_prop_inforowindex = index;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_InfoRowIndex(handle, index);
            }
        };

        _pControlElement.setElementAccessibilityInfoColCount = function (count)
        {
            if (this.accessibility_prop_infocolcount != count)
            {
                this.accessibility_prop_infocolcount = count;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_InfoColCount(handle, count);
            }
        };

        _pControlElement.setElementAccessibilityInfoRowCount = function (count)
        {
            if (this.accessibility_prop_inforowcount != count)
            {
                this.accessibility_prop_inforowcount = count;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_InfoRowCount(handle, count);
            }
        };

        _pControlElement.setElementAccessibilityInfoColIndexText = function (text)
        {
            if (this.accessibility_prop_infocolindextext != text)
            {
                this.accessibility_prop_infocolindextext = text;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_InfoColIndexText(handle, text);
            }
        };

        _pControlElement.setElementAccessibilityInfoRowIndexText = function (text)
        {
            if (this.accessibility_prop_inforowindextext != text)
            {
                this.accessibility_prop_inforowindextext = text;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_InfoRowIndexText(handle, text);
            }
        };

        _pControlElement.setElementAccessibilityHotKey = function (hotkey)
        {
            if (this.accessibility_prop_hotkey != hotkey)
            {
                this.accessibility_prop_hotkey = hotkey;
                var handle = this.handle;
                if (handle)
                    nexacro.__setDOMAccessibility_HotKey(handle, hotkey);
            }
        };

        _pControlElement.setElementAccessibilityActiveDescendant = function (control, target_elem)
        {
            this.accessibility_prop_activedescendant = control._unique_id;
            var handle = target_elem.handle;
            if (handle)
                nexacro.__setDOMAccessibility_ActiveDescendant(handle, this.accessibility_prop_activedescendant);
        };

        _pControlElement.setElementAccessibilityControls = function (id_list, target_elem)
        {
            this.accessibility_prop_controls = id_list;
            var handle = target_elem.handle;
            if (handle)
                nexacro.__setDOMAccessibility_Controls(handle, this.accessibility_prop_controls);
        };

        _pControlElement.setElementAccessibilityOwns = function (id_list, target_elem)
        {
            this.accessibility_prop_owns = id_list;
            var handle = target_elem.handle;
            if (handle)
                nexacro.__setDOMAccessibility_Owns(handle, this.accessibility_prop_owns);
        };

        _pControlElement.setElementAccessibilityStatFocus = function (readlabel)
        {
            var handle = this.handle;
            var linkedcontrol = this.linkedcontrol;
            var env = linkedcontrol._env;

            if (readlabel)
            {
                this.accessibilityreadlabel = readlabel;
            }
            else
            {
                readlabel = this._makeAccessibilityLabelbyReadtype(this);
                this.accessibilityreadlabel = readlabel;
            }

            /* 가상커서 이동시에도 읽어줘야 하기 때문에 무조건 설정 */
            if (handle)
            {
                if (env._a11ytype < 4)
                {
                    // 데스크탑은 input에 라벨도 직접 설정하도록 변경함 RP 100002
                    // 근거 WAIARIA가 1.2 부터 권장, 센스리더가 직접 설정하지 않은 라벨과 value가 겹치면 value 음성출력을 제거함
                    if (!linkedcontrol._is_editable_control)
                    {
                        if (!this._isAriaDescription() || linkedcontrol._isComponentKeydownAction())
                        {
                            nexacro.__setDOMAccessibility_Label(handle, readlabel);
                        }
                    }
                }
                else
                {
                    if (!this._isAriaDescription() || linkedcontrol._isComponentKeydownAction())
                    {
                        nexacro.__setDOMAccessibility_Label(handle, readlabel);
                    }
                }
            }

            if (!linkedcontrol._isEnable())
            {
                readlabel += " " + (linkedcontrol._p_value ? linkedcontrol._p_value : "");
                if (handle)
                {
                    nexacro._notifyAccessibility(handle, readlabel, "notify", this, false, false);
                }
            }
            else
            {
                env.on_fire_onaccessibility(readlabel, env, linkedcontrol);
            }
            /*
                        var notifyvalue;
                        if (label)
                            notifyvalue = label;
                        else
                        {
                            var readlabel = this._makeAccessibilityLabelbyReadtype(this);
                            this.accessibilityreadlabel = readlabel;
                            notifyvalue = readlabel;
                        }
                        
                        
                        var handle = this.handle;
                        if (handle)
                            nexacro._notifyAccessibility(handle, notifyvalue, "focus", this);
            */
        };

        _pControlElement.notifyAccessibility = function (label, notifyevent, bfocus)
        {
            var readlabel = this._makeAccessibilityLabelbyReadtype(this);
            this.accessibilityreadlabel = readlabel;
            nexacro._notifyAccessibility(this.handle, label ? label : this.accessibilityreadlabel, notifyevent ? notifyevent : "notify", this, bfocus);
        };

        _pControlElement._makeAccessibilityLabelbyReadtype = function (b_label)
        {
            var label = " ";
            const env = nexacro.getEnvironment();

            if (this.accessibilityenable && this.accessibilitydesclevel != "none" && this.accessibilitydesclevel != "child")
            {
                if ((env._a11ydescreadtype & 0x01) == 0x01)
                {
                    label = nexacro._AccessibilityUtil.getAccessibilityLabel(this);
                }

                if ((env._a11ydescreadtype & 0x02) == 0x02 && this.accessibilityaction)
                {
                    label += " " + nexacro._AccessibilityUtil.getAccessibilityAction(this);
                }

                if ((env._a11ydescreadtype & 0x04) == 0x04 && this.accessibilitydescription)
                {
                    label += " " + nexacro._AccessibilityUtil.getAccessibilityDescription(this);
                }

                if (nexacro._AccessibilityUtil.getAccessibilityAdditionalLabel)
                {
                    label += " " + nexacro._AccessibilityUtil.getAccessibilityAdditionalLabel(this);
                }

                if (this.accessibilityparentlabel)
                {
                    label = this.accessibilityparentlabel + " " + label;
                }
            }
            else // accessibilityenable false / accessibilitydesclevel none or child
            {
                var linkedcontrol = this.linkedcontrol;
                var is_editable = (linkedcontrol && linkedcontrol._is_editable_control);
                if (is_editable && nexacro._AccessibilityUtil.getAccessibilityAdditionalLabel)
                {
                    if (env._a11ytype == 4 || (this.accessibilitydesclevel == "none" || this.accessibilitydesclevel == "child"))
                    {
                        label += " " + nexacro._AccessibilityUtil.getAccessibilityAdditionalLabel(this);
                    }
                }
                else
                {
                    label = '\u200b'; // ZWSP 적용 (라벨출력 방지)
                }
            }

            return label;
        };

        _pControlElement._refreshAccessibilityInfo = function (handle, handle_style)
        {
            var comp = this.linkedcontrol;
            const env = nexacro.getEnvironment();

            if (this.accessibilityenable)
            {
                if ((env._a11ytype == 4 || env._a11ytype == 5) && comp && comp._skip_mobile_tabfocus)
                    ;
                else if (env._a11ytype == 5 && comp && !(comp instanceof nexacro.TextArea) && comp._input_element)
                    ;
                else if (env._a11ytype == 4 && comp && comp._input_element)
                    ;
                else
                    nexacro.__setDOMAccessibility_Role(handle, this.accessibilityrole);

                var readlabel = this._makeAccessibilityLabelbyReadtype(this);
                if (readlabel != this.accessibilityreadlabel)
                {
                    this.accessibilityreadlabel = readlabel;
                }

                if (this._isAriaDescription())
                {
                    if (comp && comp instanceof nexacro.TextArea)
                    {
                        nexacro.__setDOMAccessibility_Description(handle, this.accessibilityreadlabel + " " + comp._p_text);
                    }
                    else
                    {
                        nexacro.__setDOMAccessibility_Description(handle, this.accessibilityreadlabel);
                    }
                    nexacro.__setDOMAccessibility_Label(handle, "");
                }
                else
                {
                    nexacro.__setDOMAccessibility_Description(handle, "");
                    // 누락코드 추가
                    if (env._a11ytype > 3 || (comp && !comp._is_editable_control))
                    {
                        if (env._a11ytype > 3)
                        {
                            if (comp && comp instanceof nexacro._CellButtonControl)
                                this.accessibility_stat_hidden = true;
                        }
                        nexacro.__setDOMAccessibility_Label(handle, this.accessibilityreadlabel);
                    }
                }

                // nexacro.__setDOMAccessibility_LabelBy(handle, "accessibility_notify_0");
            }
            else
            {
                if ((env._a11ytype == 4 || env._a11ytype == 5) && comp && !comp._skip_mobile_tabfocus)
                {
                    nexacro.__setDOMAccessibility_Role(handle, "");
                    this.accessibility_stat_hidden = true;
                }
                else
                {
                    nexacro.__setDOMAccessibility_Disabled(handle);
                    this._refreshControlTabIndex(handle, null);
                }
            }

            if (this.accessibility_value)
                nexacro.__setDOMAccessibility_Value(handle, this.accessibility_value);

            if (this.accessibility_stat_disabled !== undefined)
                nexacro.__setDOMAccessibility_StatDisabled(handle, this.accessibility_stat_disabled);
            if (this.accessibility_stat_hidden !== undefined)
                nexacro.__setDOMAccessibility_StatHidden(handle, this.accessibility_stat_hidden);

            if (this.accessibility_stat_checked !== undefined)
                nexacro.__setDOMAccessibility_StatChecked(handle, this.accessibility_stat_checked);
            if (this.accessibility_stat_pressed !== undefined)
                nexacro.__setDOMAccessibility_StatPressed(handle, this.accessibility_stat_pressed);
            if (this.accessibility_stat_selected !== undefined)
                nexacro.__setDOMAccessibility_StatSelected(handle, this.accessibility_stat_selected);
            if (this.accessibility_stat_expanded !== undefined)
                nexacro.__setDOMAccessibility_StatExpanded(handle, this.accessibility_stat_expanded);
            if (this.accessibility_stat_autocomplete !== undefined)
                nexacro.__setDOMAccessibility_StatAutoComplete(handle, this.accessibility_stat_autocomplete);

            if (this.accessibility_flag_haspopup !== undefined)
                nexacro.__setDOMAccessibility_StatHasPopup(handle, this.accessibility_flag_haspopup);
            if (this.accessibility_flag_focusable !== undefined)
                nexacro.__setDOMAccessibility_FlagFocusable(handle, this.accessibility_flag_focusable);
            if (this.accessibility_flag_readonly !== undefined)
                nexacro.__setDOMAccessibility_FlagReadOnly(handle, this.accessibility_flag_readonly);

            if (this.accessibility_flag_password !== undefined)
                nexacro.__setDOMAccessibility_FlagPassword(handle, this.accessibility_flag_password);
            if (this.accessibility_flag_multiselectable !== undefined)
                nexacro.__setDOMAccessibility_FlagMultiSelectable(handle, this.accessibility_flag_multiselectable);
            if (this.accessibility_flag_defaultbutton !== undefined)
                nexacro.__setDOMAccessibility_FlagDefaultButton(handle, this.accessibility_flag_defaultbutton);
            if (this.accessibility_flag_multiline !== undefined)
                nexacro.__setDOMAccessibility_FlagMultiLine(handle, this.accessibility_flag_multiline);

            if (this.accessibility_prop_infocount !== undefined)
                nexacro.__setDOMAccessibility_InfoCount(handle, this.accessibility_prop_infocount);
            if (this.accessibility_prop_infoindex !== undefined)
                nexacro.__setDOMAccessibility_InfoIndex(handle, this.accessibility_prop_infoindex);

            if (this.accessibility_prop_infovaluecur !== undefined)
                nexacro.__setDOMAccessibility_InfoValueCur(handle, this.accessibility_prop_infovaluecur);
            if (this.accessibility_prop_infovaluemax !== undefined)
                nexacro.__setDOMAccessibility_InfoValueMax(handle, this.accessibility_prop_infovaluemax);
            if (this.accessibility_prop_infovaluemin !== undefined)
                nexacro.__setDOMAccessibility_InfoValueMin(handle, this.accessibility_prop_infovaluemin);
            if (this.accessbility_prop_infocolindex !== undefined)
                nexacro.__setDOMAccessibility_InfoColIndex(handle, this.accessbility_prop_infocolindex);
            if (this.accessbility_prop_inforowindex !== undefined)
                nexacro.__setDOMAccessibility_InfoRowIndex(handle, this.accessbility_prop_inforowindex);
            if (this.accessibility_prop_infocolcount !== undefined)
                nexacro.__setDOMAccessibility_InfoColCount(handle, this.accessibility_prop_infocolcount);
            if (this.accessibility_prop_inforowcount !== undefined)
                nexacro.__setDOMAccessibility_InfoRowCount(handle, this.accessibility_prop_inforowcount);
            if (this.accessibility_prop_infolevel !== undefined)
                nexacro.__setDOMAccessibility_InfoLevel(handle, this.accessibility_prop_infolevel);
        };

        _pControlElement._getAccessibilityInfoStr = function ()
        {
            var str = "", comp = this.linkedcontrol;
            const env = nexacro.getEnvironment();
            const a11ytype = env._a11ytype;

            var readlabel = this._makeAccessibilityLabelbyReadtype(this);
            if (this.accessibilityenable)
            {
                if ((a11ytype == 4 || a11ytype == 5) && comp && comp._skip_mobile_tabfocus)
                    str = "";
                else if (a11ytype == 5 && comp && !(comp instanceof nexacro.TextArea) && comp._input_element) //(nexacro._accessibilitytype == 4 || nexacro._accessibilitytype == 5) && this.linkedcontrol &&/*!(this.linkedcontrol instanceof nexacro.TextArea) &&*/ this.linkedcontrol._input_element)
                    str = "";
                else if (a11ytype == 4 && comp && comp._input_element)
                    str = "";
                else
                    str = nexacro.__getDOMAccessibilityStr_Role(this.accessibilityrole);

                //sense reader 8.1 자동읽기 기능 off - 추후에 자동읽기 기능이 필요하면 논의 후 기능 추가
                if (a11ytype == 2)
                {
                    str += nexacro.__getDOMAccessibilityStr_Live("off");
                }

                if (readlabel != this.accessibilityreadlabel)
                {
                    this.accessibilityreadlabel = readlabel;
                }

                if (this._isAriaDescription())
                {
                    if (comp)
                    {
                        let description_label = this.accessibilityreadlabel;
                        if (comp instanceof nexacro.TextArea)
                        {
                            description_label += " " + comp._p_text;
                        }
                        else if (comp instanceof nexacro._GridCellControl)
                        {
                            description_label += " " + comp._displaytext;
                        }

                        str += nexacro.__getDOMAccessibilityStr_Description(description_label);
                    }
                    else
                    {
                        //if (this.accessibilityreadlabel != " ")
                        str += nexacro.__getDOMAccessibilityStr_Description(this.accessibilityreadlabel);
                    }
                    str += nexacro.__getDOMAccessibilityStr_Label("");
                }
                else
                {
                    str += nexacro.__getDOMAccessibilityStr_Description("");
                    if (env._a11ytype > 3 || !comp._is_editable_control)
                    {
                        if (env._a11ytype > 3)
                        {
                            if (comp && comp instanceof nexacro._CellButtonControl)
                                this.accessibility_stat_hidden = true;
                        }
                        str += nexacro.__getDOMAccessibilityStr_Label(this.accessibilityreadlabel);
                    }
                }
                //  str += nexacro.__getDOMAccessibilityStr_LabelBy("accessibility_notify_0");
            }
            else
            {
                if ((a11ytype == 4 || a11ytype == 5) && comp)
                {
                    if (!comp._skip_mobile_tabfocus)
                        this.accessibility_stat_hidden = true;
                    else
                        str = "";
                }
                else if (a11ytype < 4)
                {
                    // scrollable, container component는 내부에 진입해야 하므로 hidden 처리 안함
                    if (comp && comp._is_containerset != true && comp._is_container != true && comp._is_subcontrol != true && comp._is_scrollable != true)
                    {
                        if (!comp._isItemAccessibilityEnable())
                        {
                            this.accessibility_stat_hidden = true;
                        }
                    }

                    str = nexacro.__getDOMAccessibilityStr_Disabled();
                    str = nexacro.__getDOMAccessibilityStr_Label(readlabel);
                }
            }
            // this part set event handler --> move to attach_handle()
            //if (this.accessibility_value)
            //	nexacro.__getDOMAccessibilityStr_Value(this.accessibility_value);

            if (this.accessibility_stat_disabled !== undefined)
                str += nexacro.__getDOMAccessibilityStr_StatDisabled(this.accessibility_stat_disabled);
            if (this.accessibility_stat_hidden !== undefined)
                str += nexacro.__getDOMAccessibilityStr_StatHidden(this.accessibility_stat_hidden);

            if (this.accessibility_stat_checked !== undefined)
                str += nexacro.__getDOMAccessibilityStr_StatChecked(this.accessibility_stat_checked);
            if (this.accessibility_stat_pressed !== undefined)
                str += nexacro.__getDOMAccessibilityStr_StatPressed(this.accessibility_stat_pressed);
            if (this.accessibility_stat_selected !== undefined)
                str += nexacro.__getDOMAccessibilityStr_StatSelected(this.accessibility_stat_selected);
            if (this.accessibility_stat_expanded !== undefined)
                str += nexacro.__getDOMAccessibilityStr_StatExpanded(this.accessibility_stat_expanded);
            if (this.accessibility_stat_autocomplete !== undefined)
                str += nexacro.__getDOMAccessibilityStr_StatAutoComplete(this.accessibility_stat_autocomplete);

            if (this.accessibility_flag_haspopup !== undefined)
                str += nexacro.__getDOMAccessibilityStr_StatHasPopup(this.accessibility_flag_haspopup);
            if (this.accessibility_flag_focusable !== undefined)
                str += nexacro.__getDOMAccessibilityStr_FlagFocusable(this.accessibility_flag_focusable);
            if (this.accessibility_flag_readonly !== undefined)
                str += nexacro.__getDOMAccessibilityStr_FlagReadOnly(this.accessibility_flag_readonly);

            if (this.accessibility_flag_password !== undefined)
                str += nexacro.__getDOMAccessibilityStr_FlagPassword(this.accessibility_flag_password);
            if (this.accessibility_flag_multiline !== undefined)
                str += nexacro.__getDOMAccessibilityStr_FlagMultiLine(this.accessibility_flag_multiline);
            if (this.accessibility_flag_multiselectable !== undefined)
                str += nexacro.__getDOMAccessibilityStr_FlagMultiSelectable(this.accessibility_flag_multiselectable);

            if (this.accessibility_flag_defaultbutton !== undefined)
                str += nexacro.__getDOMAccessibilityStr_FlagDefaultButton(this.accessibility_flag_defaultbutton);

            if (this.accessibility_prop_infocount !== undefined)
                str += nexacro.__getDOMAccessibilityStr_InfoCount(this.accessibility_prop_infocount);
            if (this.accessibility_prop_infoindex !== undefined)
                str += nexacro.__getDOMAccessibilityStr_InfoIndex(this.accessibility_prop_infoindex);

            if (this.accessibility_prop_infovaluecur !== undefined)
                str += nexacro.__getDOMAccessibilityStr_InfoValueCur(this.accessibility_prop_infovaluecur);
            if (this.accessibility_prop_infovaluemax !== undefined)
                str += nexacro.__getDOMAccessibilityStr_InfoValueMax(this.accessibility_prop_infovaluemax);
            if (this.accessibility_prop_infovaluemin !== undefined)
                str += nexacro.__getDOMAccessibilityStr_InfoValueMin(this.accessibility_prop_infovaluemin);

            if (this.accessbility_prop_infocolindex !== undefined)
                str += nexacro.__getDOMAccessibility_InfoColIndex(this.accessbility_prop_infocolindex);
            if (this.accessbility_prop_inforowindex !== undefined)
                str += nexacro.__getDOMAccessibility_InfoRowIndex(this.accessbility_prop_inforowindex);
            if (this.accessibility_prop_infocolcount !== undefined)
                str += nexacro.__getDOMAccessibility_InfoColCount(this.accessibility_prop_infocolcount);
            if (this.accessibility_prop_inforowcount !== undefined)
                str += nexacro.__getDOMAccessibility_InfoRowCount(this.accessibility_prop_inforowcount);
            if (this.accessibility_prop_infolevel !== undefined)
                str += nexacro.__getDOMAccessibilityStr_InfoLevel(this.accessibility_prop_infolevel);

            return str;
        };

        _pControlElement._setAccessibility_notify = function (handle)
        {
            if (this.accessibility_value)
                nexacro._notifyAccessibility(handle, this.accessibility_value, this);
        };

        _pControlElement._isAriaDescription = function (role)
        {
            const env = nexacro.getEnvironment();
            if (env._a11ytype < 4)
            {
                var comp = this.linkedcontrol;
                if (comp && comp instanceof nexacro.TextArea)
                {
                    if (comp._p_readonly || !comp._p_enable)
                    {
                        return true;
                    }
                }

                if (nexacro._Browser == "Chrome")
                {
                    if (this.accessibilityrole == "none" ||
                        this.accessibilityrole == "tabpanel" ||
                        this.accessibilityrole == "cell" ||
                        this.accessibilityrole == "columnheader" ||
                        this.accessibilityrole == "rowheader" ||
                        this.accessibilityrole == "link")
                    {
                        return true;
                    }
                }
            }
            return false;
        };

        _pControlElement._setElementAccessibilityTextContent = function (textContent)
        {
            var handle = this.handle;
            if (handle)
                nexacro.__setDOM_TextContent(handle, textContent);
        };

        _pControlElement._setElementAccessibilityDescriptionBy = function (id)
        {
            var handle = this.handle;
            if (handle)
                nexacro.__setDOMAccessibility_DescriptionBy(handle, id);
        };

        //delete _pControlElement;
    }

    //======================================================================
    // nexacro.ScrollableControlElement
    //======================================================================
    if (nexacro.ScrollableControlElement)
    {
        var _pScrollableControlElement = nexacro.ScrollableControlElement.prototype;
        _pScrollableControlElement._refreshControl = function (handle, handle_style/*, _doc*/)
        {
            var linkedcontrol = this.linkedcontrol;

            if (linkedcontrol && linkedcontrol._skip_mobile_tabfocus && linkedcontrol._env._a11ytype == 5)
                this.tabindex = -99;    // skips setting tabindex                

            nexacro.ControlElement.prototype._refreshControl.call(this, handle, handle_style);
        };

        //delete _pScrollableControlElement;
    }

    //======================================================================
    // nexacro.FrameControlElement
    //======================================================================
    if (nexacro.FrameControlElement)
    {
        var _pFrameControlElement = nexacro.FrameControlElement.prototype;
        _pFrameControlElement._refreshControl = function (handle, handle_style/*, _doc*/)
        {
            const env = nexacro.getEnvironment()
            if (env._a11ytype == 5)
            {
                this.tabindex = -99;
            }

            nexacro.ControlElement.prototype._refreshControl.call(this, handle, handle_style);
        };

        //delete _pFrameControlElement;
    }

    //======================================================================
    // nexacro.GridRowControlElement
    //======================================================================
    if (nexacro.GridRowControlElement)
    {
        var _pGridRowControlElement = nexacro.GridRowControlElement.prototype;
        _pGridRowControlElement._refreshControl = function (handle, handle_style/*, _doc*/)
        {
            var env = nexacro.getEnvironment();
            if (env._p_enableaccessibility && env._a11ytype == 5) //android talkback
            {
                var linkedcontrol = this.linkedcontrol;
                if (linkedcontrol && linkedcontrol._skip_mobile_tabfocus)
                    this.tabindex = -99;
            }

            nexacro.ControlElement.prototype._refreshControl.call(this, handle, handle_style);
        };

        _pGridRowControlElement._setScrollableElementHScrollPos = function (evt, left)
        {
            // change the scroll of grid by changing grid row
            var env = nexacro.getEnvironment();
            if (env._p_enableaccessibility && env._a11ytype > 3)
            {
                var scrollable_elem = this.parent_elem.parent_elem;
                if (scrollable_elem._last_scroll_left != left)
                {
                    // change scrollpos (GridScrollableControlElement > GridBandControlElement > GridRowControlElement)
                    scrollable_elem._setContainerHScrollPos(left);
                    nexacro._stopSysEvent(evt);
                }
            }
        }

        //delete _pGridRowControlElement;
    }

    //======================================================================
    // nexacro.TextBoxElement
    //======================================================================
    if (nexacro.TextBoxElement)
    {
        var _pTextBoxElement = nexacro.TextBoxElement.prototype;
        _pTextBoxElement._on_createAccessibilityHandle = function (handle)
        {
            const env = nexacro.getEnvironment();
            if (env._p_enableaccessibility && handle)
            {
                const parent_elem = this.parent_elem;
                if (parent_elem)
                {
                    var comp = parent_elem.linkedcontrol;
                    if (comp)
                    {
                        if (env._a11ytype < 4)
                        {
                            // 테이블 모드 지원위해서 설정
                            if (comp instanceof nexacro._GridCellControl)
                            {
                                this.setElementAccessibilityStatHidden(true);
                            }
                        }
                        else // for mobile
                        {
                            if (comp instanceof nexacro.Static)
                            {
                                nexacro.__setDOMAccessibility_StatHidden(handle, true);
                            }
                        }
                    }
                }
                // RP 100788 101631 label default 변경으로 text contents 출력
            }
        };

        _pTextBoxElement._on_createAccessibilityCommand = function (acc_command)
        {
            const env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)
            {
                const parent_elem = this.parent_elem;
                if (parent_elem)
                {
                    var comp = parent_elem.linkedcontrol;
                    if (comp)
                    {
                        if (env._a11ytype < 4)
                        {
                            // 테이블 모드 지원위해서 설정
                            if (comp instanceof nexacro._GridCellControl)
                            {
                                acc_command += nexacro.__getDOMAccessibilityStr_StatHidden(true);
                            }
                        }
                        else // for mobile
                        {
                            if (comp instanceof nexacro.Static)
                            {
                                acc_command += nexacro.__getDOMAccessibilityStr_StatHidden(true);
                            }
                        }
                    }
                }
                // RP 100788 101631 label default 변경으로 text contents 출력
            }
            return acc_command;
        };

        //delete _pTextBoxElement;
    }

    //======================================================================
    // nexacro.TextAreaElement
    //======================================================================
    if (nexacro.TextAreaElement)
    {
        var _pTextAreaElement = nexacro.TextAreaElement.prototype;
        _pTextAreaElement._on_createAccessibilityCommand = function (acc_command)
        {
            var env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)
            {
                var parent_elem = this.parent_elem;
                if (parent_elem)
                {
                    // 데스크탑은 input에 라벨도 직접 설정하도록 변경함 RP 100002
                    // 근거 WAIARIA가 2.1 부터 권장, 센스리더가 직접 설정하지 않은 라벨과 value가 겹치면 value 음성출력을 제거함
                    var comp_label = parent_elem._makeAccessibilityLabelbyReadtype();
                    if (env._a11ytype < 4)
                    {
                        acc_command += nexacro.__getDOMAccessibilityStr_Label(comp_label);
                    }
                    else
                    {
                        acc_command += nexacro.__getDOMAccessibilityStr_LabelBy(parent_elem.name);
                        acc_command += nexacro.__getDOMAccessibilityStr_Role(parent_elem.accessibilityrole);
                    }

                    var tmp_command = nexacro.__getDOMAccessibilityStr_Labelfor(this.name);
                    acc_command = tmp_command + acc_command;
                }
            }

            return acc_command;
        };

        //delete _pTextAreaElement;
    }

    //======================================================================
    // nexacro.InputElement
    //======================================================================
    if (nexacro.InputElement)
    {
        var _pInputElement = nexacro.InputElement.prototype;
        _pInputElement._on_createAccessibilityHandle = function (_doc, owner_elem, handle)
        {
            var env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)
            {
                if (!this._label_handle)
                {
                    var label_handle = nexacro.__createLabelElementHandle(_doc, this.name);
                    if (label_handle)
                    {
                        this._label_handle = label_handle;
                        nexacro.__appendDOMNode(owner_elem.dest_handle, label_handle);
                    }
                }

                var parent_elem = this.parent_elem;
                if (parent_elem)
                {
                    // 데스크탑은 input에 라벨도 직접 설정하도록 변경함 RP 100002
                    // 근거 WAIARIA가 1.2 부터 권장, 센스리더가 직접 설정하지 않은 라벨과 value가 겹치면 value 음성출력을 제거함                
                    if (env._a11ytype < 4)
                    {
                        var comp_label = parent_elem._makeAccessibilityLabelbyReadtype();
                        nexacro.__setDOMAccessibility_Label(handle, comp_label);
                    }
                    else
                    {
                        nexacro.__setDOMAccessibility_LabelBy(handle, parent_elem.name);
                        nexacro.__setDOMAccessibility_Role(handle, parent_elem.accessibilityrole);
                    }
                }
            }
        };

        _pInputElement._on_createAccessibilityCommand = function (acc_command)
        {
            var env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)
            {
                var owner_elem = this.owner_elem;
                if (owner_elem)
                {
                    if (!nexacro._isNull(this.value) || this.value === "")
                    {
                        var owner_comp = owner_elem.linkedcontrol;
                        if (env._a11ytype == 5 || (owner_comp && (owner_comp instanceof nexacro.MaskEdit)))
                        {
                            var replace_str = "value ='" + nexacro._encodeXml(this.value) + "'";
                            acc_command.replace(replace_str, "");
                        }
                    }

                    if (env._a11ytype < 4)
                    {
                        acc_command += "tabIndex='" + this.tabindex + "' ";
                    }

                    // 데스크탑은 input에 라벨도 직접 설정하도록 변경함 RP 100002
                    // 근거 WAIARIA가 1.2 부터 권장, 센스리더가 직접 설정하지 않은 라벨과 value가 겹치면 value 음성출력을 제거함
                    var comp_label = owner_elem._makeAccessibilityLabelbyReadtype();
                    if (env._a11ytype < 4)
                    {
                        acc_command += nexacro.__getDOMAccessibilityStr_Label(comp_label);
                    }
                    else
                    {
                        acc_command += nexacro.__getDOMAccessibilityStr_LabelBy(owner_elem.name);
                        acc_command += nexacro.__getDOMAccessibilityStr_Role(owner_elem.accessibilityrole);
                    }
                }

                var tmp_command = nexacro.__getDOMAccessibilityStr_Labelfor(this.name);
                acc_command = tmp_command + acc_command;
            }

            return acc_command;
        };

        _pInputElement.setElementAccessibilityRole = function (role)
        {
            var accrole = nexacro._roleList[role];
            var input_handle = this.handle;
            if (input_handle)
            {
                nexacro.__setDOMAccessibility_Role(input_handle, accrole);
            }
        };

        _pInputElement.setElementAccessibilityActiveDescendant = function (target_id)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMAccessibility_ActiveDescendant(handle, target_id);
            }
        };

        _pInputElement.setElementAccessibilityControls = function (controls_list)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMAccessibility_Controls(handle, controls_list);
            }
        };

        _pInputElement.setElementAccessibilityOwns = function (owns_list)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMAccessibility_Owns(handle, owns_list);
            }
        };

        _pInputElement.setElementAccessibilityStatAutoComplete = function (autocomplete)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMAccessibility_StatAutoComplete(handle, autocomplete);
            }
        };

        _pInputElement.setElementAccessibilityStatExpanded = function (expanded)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMAccessibility_StatExpanded(handle, expanded);
            }
        };

        _pInputElement.setElementAccessibilityFlagHasPopup = function (haspopup)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMAccessibility_StatHasPopup(handle, haspopup);
            }
        };

        _pInputElement.setElementAccessibilityFlagReadOnly = function (readonly)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMAccessibility_FlagReadOnly(handle, readonly);
            }
        };

        _pInputElement.setElementAccessibilityInfoValueMax = function (valuemax)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMAccessibility_InfoValueMax(handle, valuemax);
            }
        };

        _pInputElement.setElementAccessibilityInfoValueMin = function (valuemin)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMAccessibility_InfoValueMin(handle, valuemin);
            }
        };

        _pInputElement.setElementAccessibilityInfoValueCur = function (valuecur)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMAccessibility_InfoValueCur(handle, valuecur);
            }
        };

        // CHECK : Element Value Cache를 사용하여 처리할 것
        _pInputElement._setElementInputRole = function ()
        {
        };

        if (nexacro._Browser == "Chrome" || nexacro._Browser == "Gecko" || nexacro._Browser == "Edge")
        {
            _pInputElement._wantAccessibilityAdditionalLabel = function ()
            {
                return true;
            };
        }

        // controlelement의 label을 input에 업데이트 (WAI-ARIA 2.1)
        _pInputElement._updateElementAccessibilityLabel = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                var readlabel = "";

                var control_elem = this.parent_elem;
                if (control_elem)
                {
                    readlabel = control_elem.accessibilityreadlabel;
                }

                nexacro.__setDOMAccessibility_Label(handle, readlabel);
            }
        };

        _pInputElement.on_sys_focus_process = function (evt)
        {
            var input_handle = evt.target;
            var pThis = input_handle._linked_element;

            if (pThis._accept_focus_process === false)
            {
                pThis._accept_focus_process = true;
                return;
            }

            var _parent = pThis.parent;
            const env = nexacro.getEnvironment();
            const enableaccessibility = env._p_enableaccessibility;

            if (_parent)
            {
                if (pThis._need_reset_update_value)
                {
                    pThis.on_reset_update_value(true);
                }

                var comp = _parent.linkedcontrol;
                if (comp)
                {
                    var _win = comp._getWindow();

                    var old_focused_comp;
                    var cur_focus_paths, focuspath_index;

                    if (enableaccessibility)
                    {
                    }
                    else
                    {
                        if (_win && _win._is_active_window)
                        {
                            cur_focus_paths = _win.getCurrentFocusPaths();
                            focuspath_index = cur_focus_paths ? nexacro._indexOf(cur_focus_paths, comp._getRootComponent(comp)) : -1;

                            if (focuspath_index == -1)
                            {
                                old_focused_comp = cur_focus_paths ? cur_focus_paths[cur_focus_paths.length - 1] : null;
                                if (old_focused_comp)
                                {
                                    if (pThis._use_event_beforeinput)
                                        pThis._skip_sys_keyinput = true;

                                    if (pThis.id == "simpleinput")
                                        return;

                                    if (nexacro._Browser == "Chrome" || nexacro._Browser == "Opera" || nexacro._Browser == "Edge" || nexacro._OS == "iOS")
                                    {
                                        // Chrome, Opera, iOS인 경우 연속 실행취소 시 입력값 원복                                
                                        pThis.setElementValue(comp._p_value, pThis._is_invalid_value);
                                    }
                                    old_focused_comp._apply_setfocus();
                                    return;
                                }
                            }
                        }
                    }
                }
            }

            pThis._is_sys_focused = true;

            // mouse로 set focus 시 browser mouseup의 기본 동작이 set caret position 이기 때문에
            // input node의 lbuttonup 이벤트의 default action을 prevent 해야 함.
            // --> Element 기능으로 처리
            var _doc = pThis._getRootWindowHandle();
            if (pThis.autoselect && pThis.inputtype != "date")
            {
                pThis.__prevent_sys_lbuttonup = true;
                if (nexacro._OS == "iOS")
                {
                    nexacro.__setInputDOMNode_SetSelect(_doc, input_handle, 0, pThis._getInputValue().length);
                }
                else
                {
                    nexacro.__setDOMNode_Select(_doc, input_handle);
                }
            }
            else if (pThis._last_selection_range)
            {
                var sel = pThis._last_selection_range;

                if (enableaccessibility)
                {
                    // 접근성 모바일 안드로이드 (웹) 수행되면 안됨. (RP_78155)
                    if (env._a11ytype != 5)
                    {
                        nexacro.__setInputDOMNode_SetSelect(_doc, input_handle, sel[0], sel[1]);
                    }
                }
                else
                {
                    nexacro.__setInputDOMNode_SetSelect(_doc, input_handle, sel[0], sel[1]);
                }
            }

            if (pThis.value == null)
            {
                pThis._zerolength_value = undefined;
            }
            else
            {
                pThis._zerolength_value = "";
            }

            var pos = pThis.getElementCaretPos();
            pThis._composer.setStatus(nexacro._CompositionState.NONE, pos.begin);

            return true;
        };

        _pInputElement.setElementAccessibilityStatLive = function (v)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMAccessibility_Live(handle, v);
            }
        };

        //delete _pInputElement;
    }

    //======================================================================
    // nexacro._ContainerElement
    //======================================================================
    if (nexacro._ContainerElement)
    {
        var _pContainerElement = nexacro._ContainerElement.prototype;
        var _bind_container_scroll_handler_after = function (elem, hpos, vpos)
        {
            var control_elem, linked_control;
            var env = nexacro.getEnvironment();
            if (env._a11ytype == 5)
            {
                control_elem = elem.parent;
                if (control_elem)
                {
                    control_elem.scroll_top = vpos;
                    control_elem.scroll_left = hpos;
                    linked_control = control_elem.linkedcontrol;
                    if (linked_control)
                    {
                        linked_control._setHscrollPos(hpos);
                        linked_control._setVscrollPos(vpos);
                    }
                }
            }
            else if (env._a11ytype == 4)
            {
                control_elem = elem.parent;
                if (control_elem)
                {
                    linked_control = control_elem.linkedcontrol;
                    if (linked_control)
                    {
                        linked_control._scrollTo(hpos, vpos, true, false, undefined, "slide");
                    }
                }
            }
        };

        _pContainerElement._on_createAccessibilityHandle = function (handle)
        {
            var env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)
            {
                nexacro._AccessibilityUtil.supportMobileApplicationAccessibility(handle);

                let owner_elem = this.parent_elem;
                if (env._a11ytype > 3) 
                {
                    if (!this._use_translate_scroll)
                    {
                        var handle_style = handle.style;

                        // for scrolling by virtual focusing 
                        if (!(owner_elem instanceof nexacro.GridScrollableControlElement || owner_elem instanceof nexacro.GridBandControlElement || owner_elem instanceof nexacro.GridRowControlElement))
                        {
                            if (env._a11ytype == 4)
                            {
                                nexacro.__setDOMStyle_Overflow(handle_style, "scroll");
                            }

                            nexacro.__setDOMStyle_Display(handle_style, "block");
                        }
                    }
                }
                else
                {
                    if (owner_elem instanceof nexacro.GridRowControlElement)
                    {
                        // left band는 rowheader 처리
                        let is_left = (this.type === "left");
                        nexacro.__setDOMAccessibility_Role(handle, (is_left) ? nexacro._roleList["null"] : nexacro._roleList["row"]);
                        this.setElementAccessibilityStatHidden(is_left);
                    }
                }
            }
        };

        _pContainerElement._on_createAccessibilityCommand = function (acc_command)
        {
            var env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)
            {
                if (env._a11ytype < 4)
                {
                    var owner_elem = this.parent_elem;
                    if (owner_elem instanceof nexacro.GridRowControlElement)
                    {
                        // left band는 rowheader 처리
                        let is_left = (this.type === "left");
                        acc_command += nexacro.__getDOMAccessibilityStr_Role((is_left) ? nexacro._roleList["null"] : nexacro._roleList["row"]);
                        acc_command += nexacro.__getDOMAccessibilityStr_StatHidden(is_left);
                    }
                }
            }
            return acc_command;
        };

        // container의 style 관련함수 분리
        _pContainerElement._getAccessibilityStyleStr = function ()
        {
            let acc_command = "";
            var env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)
            {
                // for scrolling by virtual focusing
                if (env._a11ytype > 3)
                {
                    let owner_elem = this.parent_elem;
                    if (!this._use_translate_scroll)
                    {
                        if (!(owner_elem instanceof nexacro.GridScrollableControlElement || owner_elem instanceof nexacro.GridBandControlElement || owner_elem instanceof nexacro.GridRowControlElement))
                        {
                            acc_command += "overflow:scroll;display:block;";
                        }
                    }
                }
            }
            return acc_command;
        };

        _pContainerElement = null;
        //delete _pContainerElement;
    }

    if (nexacro._WebBrowserPluginElement)
    {
        var __pWebBrowserPluginElement = nexacro._WebBrowserPluginElement.prototype;

        __pWebBrowserPluginElement._createInternalAccessibilityElementHandle = function (win, owner_elem)
        {
            var message_elem = null;
            var env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)
            {
                message_elem = new nexacro.TextBoxElement(owner_elem);
                if (message_elem)
                {
                    message_elem.setElementText('\u200b'); //ZWSP
                    message_elem.setElementPosition(this.width, this.height)

                    if (nexacro._Browser == "MobileSafari" || nexacro._OS == "Android")
                    {
                        message_elem.setElementVisible(false);
                    }

                    message_elem.create(win);

                    var message_elem_handle = message_elem.handle;
                    if (message_elem_handle)
                    {
                        nexacro.__setDOMAccessibility_StatHidden(message_elem_handle, false);
                        nexacro.__setDOMNode_TabIndex(message_elem_handle, -1);

                        var message_elem_style = message_elem_handle.style;
                        nexacro.__setDOMStyle_OpacityObject(message_elem_style, 0);

                        nexacro._observeSysEvent(message_elem_handle, "focus", "onfocus", this._iframe_onfocus_forward);
                    }
                }
            }

            return message_elem;
        };

        //delete __pWebBrowserPluginElement;
    }

    if (nexacro._WebViewPluginElement)
    {
        var __pWebViewPluginElement = nexacro._WebViewPluginElement.prototype;
        __pWebViewPluginElement._createInternalAccessibilityElementHandle = __pWebBrowserPluginElement._createInternalAccessibilityElementHandle;

        //delete __pWebViewPluginElement;
    }

    //==============================================================================
    // SystemBase_HTML5
    //==============================================================================  
    nexacro.__setDOMAccessibility_Disabled = function (node)
    {
        node.setAttribute("role", this._roleList.noread);
        node.setAttribute("aria-label", "");
        //node.setAttribute("aria-description", "");
        //  node.setAttribute("aria-labelledby", "accessibility_notify_0");
    };
    nexacro.__getDOMAccessibilityStr_Disabled = function ()
    {
        //return "role='listitem' aria-label='&#8203;' aria-description='&#8203;' aria-labelledby='accessibility_notify_0'"; // 빈줄출력 방지
        return "role='listitem' aria-label=''"; // 빈줄출력 방지
    };

    nexacro.__setDOMAccessibility_Role = function (node, role)
    {
        if (role)
            node.setAttribute("role", role);
        else
            node.removeAttribute("role");
        //node.setAttribute("role", (role ? role : "document"));
    };
    nexacro.__getDOMAccessibilityStr_Role = function (role)
    {
        //if (role)
        //    return "role='" + this._roleList[role] + "'";
        return "role='" + (role ? role : "") + "'";

    };

    nexacro.__setDOMAccessibility_Label = function (node, label)
    {
        node.setAttribute("aria-label", (label ? label : " "));
    };
    nexacro.__getDOMAccessibilityStr_Label = function (label, text)
    {
        if (label)
            label = label.toString().replace(/[\'\"]/g, "");

        /*if (nexacro._accessibilitytype == 5)
        { //displaynulltext 두번읽어주는 문제로 기본테스트에 정상동작하고 불필요하다고 판단하여 주석 처리 
            if (label)
                label = label.trim();

            return " aria-label='" + (label ? label : " ") + (text? text : "") + "'";
        }
        else*/
        return " aria-label='" + (label ? label : " ") + (text ? text : "") + "'";
    };

    nexacro.__setDOMAccessibility_DescLevel = function (node, label)
    {
        node.setAttribute("aria-label", " ");
    };
    nexacro.__getDOMAccessibilityStr_DescLevel = function (label)
    {
        return " aria-label=' '";
    };
    nexacro.__setDOMAccessibility_LabelBy = function (node, id)
    {
        node.setAttribute("aria-labelledby", (id ? id : "accessibility_notify_0"));
    };
    nexacro.__getDOMAccessibilityStr_LabelBy = function (id)
    {
        return " aria-labelledby='" + (id ? id : "accessibility_notify_0") + "'";
    };
    nexacro.__setDOMAccessibility_Description = function (node, desc)
    {
        node.setAttribute("aria-description", desc);
    };
    nexacro.__getDOMAccessibilityStr_Description = function (desc)
    {
        if (desc)
            desc = desc.toString().replace(/[\'\"]/g, "");

        return " aria-description='" + (desc ? desc : "") + "'";
    };

    nexacro.__setDOMAccessibility_DescriptionBy = function (node, id)
    {
        if (id)
        {
            node.setAttribute("aria-describedby", id);
        }
    };
    nexacro.__getDOMAccessibilityStr_DescriptionBy = function (id)
    {
        return id ? (" aria-describedby='" + id + "'") : "";
    };


    //stat/Flag
    nexacro.__setDOMAccessibility_StatNormal = function (node, normal)
    {
        //
    };

    nexacro.__setDOMAccessibility_StatDisabled = function (node, disable)
    {
        node.setAttribute("aria-disabled", (disable ? "true" : "false"));
    };
    nexacro.__getDOMAccessibilityStr_StatDisabled = function (disable)
    {
        return " aria-disabled='" + (disable ? "true" : "false") + "'";
    };

    nexacro.__setDOMAccessibility_StatHidden = function (node, hidden)
    {
        if (hidden)
            node.setAttribute("aria-hidden", "true");
        else
            node.removeAttribute("aria-hidden");
    };
    nexacro.__getDOMAccessibilityStr_StatHidden = function (hidden)
    {
        //return " aria-hidden='" + (hidden ? "true" : "false") + "'";
        return hidden ? " aria-hidden='true'" : "";
    };
    nexacro.__setDOMAccessibility_StatChecked = function (node, check)
    {
        node.setAttribute("aria-checked", check);
    };
    nexacro.__getDOMAccessibilityStr_StatChecked = function (check)
    {
        return " aria-checked='" + check + "'";
    };

    nexacro.__setDOMAccessibility_StatPressed = function (node, press)
    {
        node.setAttribute("aria-pressed", press);
    };
    nexacro.__getDOMAccessibilityStr_StatPressed = function (press)
    {
        return " aria-pressed='" + press + "'";
    };

    nexacro.__setDOMAccessibility_StatSelected = function (node, select)
    {
        node.setAttribute("aria-selected", select);
    };
    nexacro.__getDOMAccessibilityStr_StatSelected = function (select)
    {
        return " aria-selected='" + select + "'";
    };

    nexacro.__setDOMAccessibility_StatExpanded = function (node, expanded)
    {
        node.setAttribute("aria-expanded", expanded);
    };
    nexacro.__getDOMAccessibilityStr_StatExpanded = function (expanded)
    {
        return " aria-expanded='" + expanded + "'";
    };

    nexacro.__setDOMAccessibility_StatAutoComplete = function (node, autocomplete)
    {
        node.setAttribute("aria-autocomplete", autocomplete);
    };
    nexacro.__getDOMAccessibilityStr_StatAutoComplete = function (autocomplete)
    {
        return " aria-autocomplete='" + autocomplete + "'";
    };

    nexacro.__setDOMAccessibility_StatHasPopup = function (node, haspopup)
    {
        node.setAttribute("aria-haspopup", haspopup);
    };
    nexacro.__getDOMAccessibilityStr_StatHasPopup = function (haspopup)
    {
        return " aria-haspopup='" + haspopup + "'";
    };

    nexacro.__setDOMAccessibility_FlagFocusable = function (node, focus)
    {
        //
    };
    nexacro.__getDOMAccessibilityStr_FlagFocusable = function (focus)
    {
        return "";
    };

    nexacro.__setDOMAccessibility_FlagReadOnly = function (node, readonly)
    {
        node.setAttribute("aria-readonly", readonly);
    };
    nexacro.__getDOMAccessibilityStr_FlagReadOnly = function (readonly)
    {
        return " aria-readonly='" + readonly + "'";
    };

    nexacro.__setDOMAccessibility_FlagPassword = function (node, password)
    {
        //
    };
    nexacro.__getDOMAccessibilityStr_FlagPassword = function (password)
    {
        return "";
    };

    nexacro.__setDOMAccessibility_FlagMultiLine = function (node, multiline)
    {
        node.setAttribute("aria-multiline", multiline);
    };
    nexacro.__getDOMAccessibilityStr_FlagMultiLine = function (node, multiline)
    {
        return " aria-multiline='" + multiline + "'";
    };

    nexacro.__setDOMAccessibility_FlagMultiSelectable = function (node, multiselectable)
    {
        node.setAttribute("aria-multiselectable", multiselectable);
    };
    nexacro.__getDOMAccessibilityStr_FlagMultiSelectable = function (multiselectable)
    {
        return " aria-multiselectable='" + multiselectable + "'";
    };

    nexacro.__setDOMAccessibility_FlagDefaultButton = function (node, button)
    {
        //
    };
    nexacro.__getDOMAccessibilityStr_FlagDefaultButton = function (button)
    {
        return "";
    };


    nexacro.__setDOMAccessibility_InfoCount = function (node, count)
    {
        node.setAttribute("aria-setsize", count);
    };
    nexacro.__getDOMAccessibilityStr_InfoCount = function (count)
    {
        return " aria-setsize='" + count + "'";
    };

    nexacro.__setDOMAccessibility_InfoIndex = function (node, index)
    {
        node.setAttribute("aria-posinset", index);
    };
    nexacro.__getDOMAccessibilityStr_InfoIndex = function (index)
    {
        return " aria-posinset='" + index + "'";
    };

    nexacro.__setDOMAccessibility_InfoValueMax = function (node, maxvalue)
    {
        node.setAttribute("aria-valuemax", maxvalue);
    };
    nexacro.__getDOMAccessibilityStr_InfoValueMax = function (maxvalue)
    {
        return " aria-valuemax='" + maxvalue + "'";
    };

    nexacro.__setDOMAccessibility_InfoValueMin = function (node, minvalue)
    {
        node.setAttribute("aria-valuemin", minvalue);
    };
    nexacro.__getDOMAccessibilityStr_InfoValueMin = function (minvalue)
    {
        return " aria-valuemin='" + minvalue + "'";
    };

    nexacro.__setDOMAccessibility_InfoValueCur = function (node, value)
    {
        node.setAttribute("aria-valuenow", value);
    };
    nexacro.__getDOMAccessibilityStr_InfoValueCur = function (value)
    {
        return " aria-valuenow='" + value + "'";
    };

    nexacro.__setDOMAccessibility_InfoValueText = function (node, text)
    {
        node.setAttribute("aria-valuetext", text);
    };
    nexacro.__getDOMAccessibilityStr_InfoValueText = function (text)
    {
        return " aria-valuetext='" + text + "'";
    };

    nexacro.__setDOMAccessibility_InfoLevel = function (node, level)
    {
        // level start value 1
        if (level)
        {
            node.setAttribute("aria-level", level);
        }
        else
        {
            node.removeAttribute("aria-level");
        }
    };
    nexacro.__getDOMAccessibilityStr_InfoLevel = function (level)
    {
        // level start value 1
        return level ? " aria-level='" + level + "'" : "";
    };

    /* attribute for table/grid/treegrid start */
    // col index
    nexacro.__getDOMACcessibilityStr_InfoColIndex = function (index)
    {
        if (index)
            return " aria-colindex'" + index + "'";
        else
            return "";
    };
    nexacro.__setDOMAccessibility_InfoColIndex = function (node, index)
    {
        if (index)
            node.setAttribute("aria-colindex", index);
        else
            node.removeAttribute("aria-colindex");
    };

    // row index
    nexacro.__getDOMACcessibilityStr_InfoRowIndex = function (index)
    {
        if (index)
            return " aria-rowindex'" + index + "'";
        else
            return "";
    };
    nexacro.__setDOMAccessibility_InfoRowIndex = function (node, index)
    {
        if (index)
            node.setAttribute("aria-rowindex", index);
        else
            node.removeAttribute("aria-rowindex");
    };

    // col count
    nexacro.__getDOMACcessibilityStr_InfoColCount = function (count)
    {
        if (count)
            return " aria-colcount'" + count + "'";
        else
            return "";
    };
    nexacro.__setDOMAccessibility_InfoColCount = function (node, count)
    {
        if (count)
            node.setAttribute("aria-colcount", count);
        else
            node.removeAttribute("aria-colcount");
    };

    // row count
    nexacro.__getDOMACcessibilityStr_InfoRowCount = function (count)
    {
        if (count)
            return " aria-rowcount'" + count + "'";
        else
            return "";
    };
    nexacro.__setDOMAccessibility_InfoRowCount = function (node, count)
    {
        if (count)
            node.setAttribute("aria-rowcount", count);
        else
            node.removeAttribute("aria-rowcount");
    };

    // col text
    nexacro.__getDOMACcessibilityStr_InfoColIndexText = function (text)
    {
        if (text)
            return " aria-colindextext'" + text + "'";
        else
            return "";
    };
    nexacro.__setDOMAccessibility_InfoColIndexText = function (node, text)
    {
        if (text)
            node.setAttribute("aria-colindextext", text);
        else
            node.removeAttribute("aria-colindextext");
    };

    // row text
    nexacro.__getDOMACcessibilityStr_InfoRowIndexText = function (text)
    {
        if (text)
            return " aria-rowindextext'" + text + "'";
        else
            return "";
    };
    nexacro.__setDOMAccessibility_InfoRowIndexText = function (node, text)
    {
        if (text)
            node.setAttribute("aria-rowindextext", text);
        else
            node.removeAttribute("aria-rowindextext");
    };
    /* attribute for table/grid/treegrid end */

    nexacro.__createLabelElementHandle = function (_doc, name, value)
    {
        var handle = _doc.createElement("label");
        var handle_style = handle.style;
        handle.setAttribute("for", name);
        handle.textContent = value ? value : "";
        handle.id = name + ":label";
        nexacro.__setDOMStyle_Absolute(handle_style);
        nexacro.__setDOMStyle_Size(handle_style, 0, 0);
        nexacro.__setDOMAccessibility_StatHidden(handle, true);
        return handle;
    };

    nexacro.__getDOMAccessibilityStr_Labelfor = function (name, value)
    {
        return "<label for= '" + name + "' style='position:absolute;width:0px;overflow:hidden;' aria-hidden=true>" + (value ? value : "") + "</label>";
    };
    /*
    nexacro.__setDOMNode_Value = function (node, value)
    {
        node.setAttribute("value",value);
    };
    */

    nexacro.__setDOMAccessibility_Selection = function (node, select)
    {
        //Todo..
    };

    nexacro.__setDOMAccessibility_HotKey = function (node, select)
    {
        //Todo..
    };

    nexacro.__setDOMAccessibility_ActiveDescendant = function (node, id)
    {
        node.setAttribute("aria-activedescendant", id);
    };

    nexacro.__setDOMAccessibility_Owns = function (node, id_list)
    {
        node.setAttribute("aria-owns", id_list);
    };

    nexacro.__setDOMAccessibility_Controls = function (node, id_list)
    {
        node.setAttribute("aria-controls", id_list);
    };

    nexacro.__setDOMAccessibility_TabStop = function (node, id)
    {

    };

    nexacro.__setDOMAccessibility_Live = function (node, v)
    {
        if (v == true)
        {
            node.setAttribute("aria-relevant", "text");
            node.setAttribute("aria-live", "assertive");
            node.setAttribute("aria-atomic", "false");
        }
        else if (v == "off")
        {
            node.setAttribute("aria-relevant", "");
            node.setAttribute("aria-live", "off");
            node.setAttribute("aria-atomic", "");
        }
        else
        {
            node.setAttribute("aria-relevant", "");
            node.setAttribute("aria-live", "");
            node.setAttribute("aria-atomic", "");
        }
    };

    nexacro.__getDOMAccessibilityStr_Live = function (live)
    {
        return " aria-live='" + live + "'";
    };

    //변경된 값만 읽는다.
    nexacro.__setDOMAccessibility_Value = function (node, value, elem, bfocus)
    {
        nexacro._notifyAccessibility(node, value, "valuechange", elem, bfocus);
    };

    nexacro.__setDOM_TextContent = function (node, text)
    {
        node.textContent = text;
    };

    nexacro.__notifyAccessibilityInputElement = function (label)
    {
        var notifynode = this._notify_inputnode;
        if (!notifynode)
        {
            notifynode = nexacro.__createNotifyAccessibilityInputElement();
        }

        // 값 미입력하면 live 기능 제거 (초점 이동 방지)
        if (nexacro._isNull(label))
        {
            notifynode.setAttribute("aria-live", "");
        }
        else
        {
            notifynode.setAttribute("aria-live", "assertive");
        }

        // 지웠다가 넣어야 출력됨
        notifynode.setAttribute("aria-label", "");
        notifynode.setAttribute("aria-label", " ");
        notifynode.textContent = "";
        notifynode.textContent = label;
    };

    nexacro.__createNotifyAccessibilityInputElement = function ()
    {
        var notifynode = this._notify_inputnode;
        if (!notifynode)
        {
            var _doc = document;

            var node = _doc.createElement("div");
            node.id = "accessibility_notify_input";

            var node_style = node.style;
            nexacro.__setDOMStyle_Absolute(node_style);
            nexacro.__setDOMStyle_Size(node_style, 0, 0);

            //nexacro.__setDOMAccessibility_Role(node, "textbox");
            //nexacro.__setDOMAccessibility_Live(node, true);
            node.setAttribute("aria-live", "assertive");

            _doc.body.appendChild(node);
            this._notify_inputnode = notifynode = node;
        }

        return notifynode;
    };

    /* mouse event check from virtual cursor in sensereader */
    nexacro._getAccessibilityVirtualCursorMouseEvent = function (evt, win)
    {
        var env = nexacro.getEnvironment();
        if (env._p_enableaccessibility && env._a11ytype === 2)
        {
            if (evt && evt.detail === 0 && evt.offsetX === 0 && evt.offsetY === 0)
            {
                return true;
            }
        }
        return false;
    };

    /*
    강제읽기 기능 분기 처리, accessibilityreplayhotkey, accessibilitywholereadtype, accessibilitybackwardkey 키등
    playaccessibility나 notifyaccessibility를 통해 강제읽기 기능으로 구현된 기능에서 브라우져 버그가 발생하여 분기처리함.
    */

    nexacro._AccessibilityNotifyManager = function ()
    {
        this._nodes = [];
        this._index = -1;
        this._count = 0;
    };

    var _pAccessibilityNotifyManager = nexacro._createPrototype(Object, nexacro._AccessibilityNotifyManager);
    nexacro._AccessibilityNotifyManager.prototype = _pAccessibilityNotifyManager;


    _pAccessibilityNotifyManager._init = nexacro._emptyFn;
    _pAccessibilityNotifyManager._notifyAriaLive = function (label)
    {
        var _doc = document;
        var node = this._nodes[this._index];
        if (node)
        {
            _doc.body.removeChild(node);
            this._nodes.pop();
            node = null;
        }

        node = _doc.createElement("div");
        node.id = "accessibility_notify_0";

        var node_style = node.style;
        nexacro.__setDOMStyle_Absolute(node_style);
        nexacro.__setDOMStyle_Size(node_style, 0, 0);

        nexacro.__setDOMAccessibility_Role(node, "alert");
        nexacro.__setDOMAccessibility_Live(node, true);
        nexacro.__setDOMAccessibility_Label(node, label);

        _doc.body.appendChild(node);

        this._nodes.push(node);

        this._count = 1;
        this._index = 0;

        return node;
    };


    _pAccessibilityNotifyManager._getNotifyNode_Gecko = function ()
    {
        if (this._index == -1)
        {
            var _doc = document;
            var node = _doc.createElement("div");
            node.id = "accessibility_notify_" + this._count;

            var node_style = node.style;
            nexacro.__setDOMStyle_Absolute(node_style);
            nexacro.__setDOMStyle_Size(node_style, 0, 0);

            //nexacro.__setDOMNode_TabIndex(node, -1);
            // nexacro.__setDOMAccessibility_Role(node, "document");
            _doc.body.appendChild(node);


            this._nodes.push(node);

            this._count = this._count + 1;

            var node2 = _doc.createElement("div");
            node2.id = "accessibility_notify_" + this._count;

            var node2_style = node2.style;
            nexacro.__setDOMStyle_Absolute(node2_style);
            nexacro.__setDOMStyle_Size(node2_style, 0, 0);

            _doc.body.appendChild(node2);
            //  nexacro.__setDOMAccessibility_Role(node2, "document");
            this._nodes.push(node2);
            this._index = 0;
        }

        return this._nodes;
    };

    _pAccessibilityNotifyManager._notify_Gecko = function (handle, label, notifyevent, elem, bfocus, benable)
    {
        var _is_live = (notifyevent == "arialive") ? true : undefined;
        if (_is_live)
        {
            this._notifyAriaLive(label);
        }
        else
        {
            var nodes = this._getNotifyNode_Gecko();
            if (nodes)
            {
                var node;
                if (notifyevent == "notify")
                {
                    node = nodes[this._index];
                    node.innerText = label;
                    nexacro.__setDOMNode_Title(node, label);

                    if (benable === false)
                        nexacro.__setDOMAccessibility_StatDisabled(node, true);
                    else
                        nexacro.__setDOMAccessibility_StatDisabled(node, false);

                    node.focus();
                    nexacro.__setDOMStyle_Pos(node.style, 0, 0);
                }
                else
                {
                    node = nodes[0];
                    node.innerText = label;
                    nexacro.__setDOMNode_Title(node, label);
                }
            }
            this._index = this._index ^ 1;
        }
    };

    _pAccessibilityNotifyManager._getNotifyNode_Mobile = function ()
    {
        if (this._index == -1)
        {
            var _doc = document;
            var _container = _doc.createElement("div");
            var node_style = _container.style;
            nexacro.__setDOMStyle_Absolute(node_style);
            nexacro.__setDOMStyle_Size(node_style, 0, 0);
            nexacro.__setDOMAccessibility_StatHidden(_container, true);
            _doc.body.appendChild(_container);

            var node = _doc.createElement("div");
            node.id = "accessibility_notify_" + this._count;

            node_style = node.style;
            nexacro.__setDOMStyle_Absolute(node_style);
            nexacro.__setDOMStyle_Size(node_style, 0, 0);
            nexacro.__setDOMNode_TabIndex(node, -1);
            nexacro.__setDOMAccessibility_Role(node, "document");
            _container.appendChild(node);


            this._nodes.push(node);

            this._count = this._count + 1;

            var node2 = _doc.createElement("div");
            node2.id = "accessibility_notify_" + this._count;

            var node2_style = node2.style;
            nexacro.__setDOMStyle_Absolute(node2_style);
            nexacro.__setDOMStyle_Size(node2_style, 0, 0);
            nexacro.__setDOMNode_TabIndex(node2, -1);

            _container.appendChild(node2);
            nexacro.__setDOMAccessibility_Role(node2, "document");
            this._nodes.push(node2);
            this._index = 0;
        }

        return this._nodes;
    };

    _pAccessibilityNotifyManager._notify_Mobile = function (handle, label, notifyevent, elem, bfocus, benable)
    {
        var nodes = this._getNotifyNode_Mobile();
        if (nodes)
        {
            var node;
            if (notifyevent == "notify")
            {
                node = nodes[this._index];

                if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
                {
                    node.innerText = "";
                    nexacro.__setDOMAccessibility_Label(node, label);
                }
                else
                {
                    node.innerText = label;
                }

                if (elem)
                {
                    if (elem.accessibilityrole)
                    {
                        nexacro.__setDOMAccessibility_Role(node, elem.accessibilityrole);
                    }
                    else
                    {
                        nexacro.__setDOMAccessibility_Role(node, "");
                    }
                    nexacro.__setDOMStyle_Pos(node.style, elem.left, elem.top);
                }
                else
                {
                    nexacro.__setDOMAccessibility_Role(node, handle ? handle.getAttribute('role') : "");
                }

                if (benable === false)
                    nexacro.__setDOMAccessibility_StatDisabled(node, true);
                else
                    nexacro.__setDOMAccessibility_StatDisabled(node, false);

                node.focus();
                nexacro.__setDOMStyle_Pos(node.style, 0, 0);
            }
            else
            {
                node = nodes[this._index];

                if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
                    nexacro.__setDOMAccessibility_Label(node, "");

                if (notifyevent == "valuechange")
                {
                    if (label == "#textarea:msg_accessibility_emptyline")
                    {
                        label = nexacro._getErrorMessge("msg_accessibility_emptyline");
                    }

                    node.innerText = label;
                    nexacro.__setDOMAccessibility_Role(node, "listitem");
                    nexacro.__setDOMAccessibility_ActiveDescendant(handle, node.id);

                    if (elem && elem.input_handle)
                    {
                        //nexacro.__setDOMAccessibility_Role(elem.input_handle, "document");
                    }
                    if (bfocus)
                        node.focus();
                    nexacro.__setDOMStyle_Pos(node.style, 0, 0);
                }
                else if (notifyevent == "daychange")
                {
                    if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
                    {
                        node.innerText = "";
                        nexacro.__setDOMAccessibility_Label(node, label);
                    }
                    else
                    {
                        node.innerText = label;
                    }
                    nexacro.__setDOMAccessibility_ActiveDescendant(handle, node.id);
                    nexacro.__setDOMStyle_Pos(node.style, 0, 0);
                }
                else if (notifyevent == "wholeread")
                {
                    if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
                    {
                        node.innerText = "";
                        nexacro.__setDOMAccessibility_Label(node, label);
                    }
                    else
                    {
                        node.innerText = label;
                    }
                    //node.innerText = label;
                    nexacro.__setDOMAccessibility_Role(node, "document");
                    node.focus();
                }
                else
                {
                    node.innerText = label;
                }
            }

        }
        this._index = this._index ^ 1;
    };

    _pAccessibilityNotifyManager._getNotifyNode_etc = function ()
    {
        if (this._index == -1)
        {
            var _doc = document;
            var node = _doc.createElement("div");
            node.id = "accessibility_notify_" + this._count;

            var node_style = node.style;
            nexacro.__setDOMStyle_Absolute(node_style);
            nexacro.__setDOMStyle_Size(node_style, 0, 0);

            const env = nexacro.getEnvironment();
            if (env._a11ytype == 2 && nexacro._Browser == "Chrome")
            {
                nexacro.__setDOMAccessibility_Role(node, "listitem");
                nexacro.__setDOMAccessibility_StatHidden(node, true);
            }
            else
                nexacro.__setDOMAccessibility_Role(node, "document");

            _doc.body.appendChild(node);


            this._nodes.push(node);

            this._count = this._count + 1;

            var node2 = _doc.createElement("div");
            node2.id = "accessibility_notify_" + this._count;

            var node2_style = node2.style;
            nexacro.__setDOMStyle_Absolute(node2_style);
            nexacro.__setDOMStyle_Size(node2_style, 0, 0);

            _doc.body.appendChild(node2);
            if (env._a11ytype == 2 && nexacro._Browser == "Chrome")
            {
                nexacro.__setDOMAccessibility_Role(node2, "listitem");
                nexacro.__setDOMAccessibility_StatHidden(node2, true);
            }
            else
                nexacro.__setDOMAccessibility_Role(node2, "document");
            this._nodes.push(node2);

            //accessibility false node
            var node_hidden = _doc.createElement("div");
            node_hidden.id = "accessibility_notify_hidden";

            var node_hidden_style = node_hidden.style;
            nexacro.__setDOMStyle_Absolute(node_hidden_style);
            nexacro.__setDOMStyle_Size(node_hidden_style, 0, 0);

            _doc.body.appendChild(node_hidden);
            if (env._a11ytype == 2 && nexacro._Browser == "Chrome")
            {
                nexacro.__setDOMAccessibility_Role(node_hidden, "listitem");
                nexacro.__setDOMAccessibility_StatHidden(node_hidden, true);
            }
            //this._nodes.push(node_hidden);

            this._index = 0;
        }

        return this._nodes;
    };

    _pAccessibilityNotifyManager._notify_etc = function (handle, label, notifyevent, elem, bfocus, benable)
    {
        var _is_live = (notifyevent == "arialive") ? true : undefined;
        if (_is_live)
        {
            this._notifyAriaLive(label);
        }
        else
        {
            var nodes = this._getNotifyNode_etc();
            if (nodes)
            {
                var node;
                if (notifyevent == "notify")
                {
                    node = nodes[this._index];

                    if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
                    {
                        node.innerText = "";
                        nexacro.__setDOMAccessibility_Label(node, label);
                    }
                    else
                    {
                        node.innerText = label;
                    }

                    if (elem)
                    {
                        if (elem.accessibilityrole)
                        {
                            nexacro.__setDOMAccessibility_Role(node, elem.accessibilityrole);
                        }
                        else
                        {
                            nexacro.__setDOMAccessibility_Role(node, "");
                        }
                        nexacro.__setDOMStyle_Pos(node.style, elem.left, elem.top);
                    }
                    else
                    {
                        nexacro.__setDOMAccessibility_Role(node, handle ? handle.getAttribute('role') : "");
                    }

                    if (benable === false)
                        nexacro.__setDOMAccessibility_StatDisabled(node, true);
                    else
                        nexacro.__setDOMAccessibility_StatDisabled(node, false);

                    node.focus();
                    nexacro.__setDOMStyle_Pos(node.style, 0, 0);
                }
                else
                {
                    node = nodes[this._index];

                    if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
                        nexacro.__setDOMAccessibility_Label(node, "");

                    if (notifyevent == "valuechange")
                    {
                        if (label == "#textarea:msg_accessibility_emptyline")
                        {
                            label = nexacro._getErrorMessge("msg_accessibility_emptyline");
                        }

                        node.innerText = label;
                        nexacro.__setDOMAccessibility_Role(node, "listitem");
                        nexacro.__setDOMAccessibility_ActiveDescendant(handle, node.id);

                        if (elem && elem.input_handle)
                        {
                            //nexacro.__setDOMAccessibility_Role(elem.input_handle, "document");
                        }
                        if (bfocus)
                            node.focus();
                        nexacro.__setDOMStyle_Pos(node.style, 0, 0);
                    }
                    else if (notifyevent == "daychange")
                    {
                        if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
                        {
                            node.innerText = "";
                            nexacro.__setDOMAccessibility_Label(node, label);
                        }
                        else
                        {
                            node.innerText = label;
                        }
                        nexacro.__setDOMAccessibility_ActiveDescendant(handle, node.id);
                        nexacro.__setDOMStyle_Pos(node.style, 0, 0);
                    }
                    else if (notifyevent == "wholeread")
                    {
                        if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
                        {
                            node.innerText = "";
                            nexacro.__setDOMAccessibility_Label(node, label);
                        }
                        else
                        {
                            node.innerText = label;
                        }
                        //node.innerText = label;
                        nexacro.__setDOMAccessibility_Role(node, "document");
                        node.focus();
                    }
                    else
                    {
                        node.innerText = label;
                    }
                }

            }
            this._index = this._index ^ 1;
        }
    };

    _pAccessibilityNotifyManager._init = function ()
    {
        const env = nexacro.getEnvironment();
        if (!(nexacro._Browser === "Gecko") && !(env._a11ytype == 4 || env._a11ytype == 5))
        {
            var nodes = this._getNotifyNode_etc();
            if (nodes)
            {
                var node;
                for (var i = 0; i < nodes.length; i++)
                {
                    node = nodes[i];
                    nexacro.__setDOMAccessibility_Label(node, "");
                }
            }
        }
    };

    _pAccessibilityNotifyManager._notify = function (handle, label, notifyevent, elem, bfocus, benable)
    {
        const env = nexacro.getEnvironment();
        if (nexacro._Browser === "Gecko") 
        {
            this._notify_Gecko(handle, label, notifyevent, elem, bfocus, benable);
        }
        else if (env._a11ytype == 4 || env._a11ytype == 5) 
        {
            this._notify_Mobile(handle, label, notifyevent, elem, bfocus, benable);
        }
        else 
        {
            this._notify_etc(handle, label, notifyevent, elem, bfocus, benable);
        }
    };

    nexacro.__notifyAccessibility = function (node, label, notifyevent, elem, bfocus, benable)
    {
        if (!nexacro._AccessibilityNotifyNode)
            nexacro._AccessibilityNotifyNode = new nexacro._AccessibilityNotifyManager();
        nexacro._AccessibilityNotifyNode._notify(node, label, notifyevent, elem, bfocus, benable);
    };

    //특수한 케이스에대해 예외처리를 해주기위해
    nexacro._notifyAccessibilityValue = function (elem, label, notifyevent)
    {
        if (!nexacro._AccessibilityNotifyNode)
            nexacro._AccessibilityNotifyNode = new nexacro._AccessibilityNotifyManager();
        var handle = elem.handle;
        if (handle)
        {
            nexacro._AccessibilityNotifyNode._notify(handle, label, notifyevent, elem);
        }
    };

    nexacro.__notifyInitAccessibility = function ()
    {
        if (!nexacro._AccessibilityNotifyNode)
            return;
        nexacro._AccessibilityNotifyNode._init();
    };



    if (nexacro._OS == "Android")
    {
        nexacro._roleList =
        {    //nexacro role : present role , //problem - checked
            "alert": "alert",
            "application": "application",
            "button": "button",
            "calendar": "textbox",
            "chart": "",
            "checkbox": "checkbox",
            "columnheader": "cell",
            "combobox": "combobox",
            "datepicker": "",
            "dialog": "dialog",
            "edit": "textbox",
            "fileupload": "",
            "form": "",
            "frame": "",
            "grid": "grid",
            "gridcell": "cell",
            "groupbox": "group",
            "image": "img",
            "listbox": "listbox",
            "listboxitem": "option",
            "listview": "presentation",
            "listviewband": "treeitem",
            "menubar": "menubar",
            "menu": "menu",
            "menuitem": "menuitem",
            "none": "",
            "progressbar": "", //sensereader bug
            //"radio": "radiogroup",
            "radio": "radiogroup",
            "radioitem": "radio",
            "row": "row",
            "rowheader": "cell",
            "rowgroup": "rowgroup", // rowelement  처리용
            "scrollbar": "scrollbar",
            "slider": "slider",
            "spin": "spin",
            //"spinbutton" : "spinbutton",
            "splitter": "",
            "static": "option",
            "statusbar": "status",
            "step": "",
            "tab": "tablist",
            "tabitem": "tab",
            "tabpage": "tabpanel",
            "textarea": "textbox",
            "textbox": "textbox",
            "titlebar": "region",
            "toolbar": "toolbar",
            "tooltip": "tooltip",
            //"treegrid": "treegrid",             // grid 내부로 진입못함.
            "treegrid": "",
            "treeitem": "treeitem",
            "webbrowser": "",
            "webview": "",
            "link": "link",
            "noread": "document",
            "null": "", // role is not setting
            // RP 101516 heading role aria-level 지원 추가 (legacy용 HTML spec)
            "heading": "heading",
            "heading1": "heading",
            "heading2": "heading",
            "heading3": "heading",
            "heading4": "heading",
            "heading5": "heading",
            "heading6": "heading",

            // section tag roles - 아직 사용하지 않으나 필요하면 스펙추가
            "header": "banner",
            "aside": "complementarty",
            "footer": "contentinfo",
            "main": "main",
            "nav": "navigation",
            "section": "region",
            "article": "article"
        };
    }
    else if (nexacro._Browser == "MobileSafari")
    {
        nexacro._roleList =
        {    //nexacro role : present role , //problem - checked
            "alert": "alert",
            "application": "application",
            "button": "button",
            "calendar": "textbox",
            "chart": "",
            "checkbox": "checkbox",
            "columnheader": "cell",
            "combobox": "combobox",
            "datepicker": "",
            "dialog": "dialog",
            "edit": "textbox",
            "fileupload": "",
            "form": "",
            "frame": "",
            "grid": "grid",
            "gridcell": "cell",
            "gridedit": "textbox", //temporary
            "groupbox": "group",
            "image": "img",
            "listbox": "listbox",
            "listboxitem": "option",
            "listview": "presentation",
            "listviewband": "option",
            "menubar": "menubar",
            "menu": "menu",
            "menuitem": "menuitem",
            "none": "",
            "progressbar": "meter",
            //"radio": "radiogroup",
            "radio": "radiogroup",
            "radioitem": "radio",
            "row": "row",
            "rowheader": "cell",
            "rowgroup": "rowgroup", // rowelement  처리용
            "scrollbar": "scrollbar",
            "slider": "slider",
            //"spin": "document",
            //"spinbutton" : "spinbutton",
            "splitter": "",
            "static": "",
            "statusbar": "status",
            "step": "",
            "tab": "tablist",
            "tabitem": "tab",
            "tabpage": "tabpanel",
            "textarea": "textbox",
            "textbox": "textbox",
            "titlebar": "region",
            "toolbar": "toolbar",
            "tooltip": "tooltip",
            //"treegrid": "treegrid",             // grid 내부로 진입못함.
            "treegrid": "",
            "treeitem": "option",                 // treeitem은 skip되서 option으로 변경.
            "webbrowser": "",
            "webview": "",
            "link": "link",
            "noread": "",
            "null": "", // role is not setting
            // RP 101516 heading role aria-level 지원 추가 (legacy용 HTML spec)
            "heading": "heading",
            "heading1": "heading",
            "heading2": "heading",
            "heading3": "heading",
            "heading4": "heading",
            "heading5": "heading",
            "heading6": "heading",

            // section tag roles - 아직 사용하지 않으나 필요하면 스펙추가
            "header": "banner",
            "aside": "complementarty",
            "footer": "contentinfo",
            "main": "main",
            "nav": "navigation",
            "section": "region",
            "article": "article"
        };
    }
    else if (nexacro._Browser == "Chrome" || nexacro._Browser == "Edge")
    {
        nexacro._roleList =
        {    //nexacro role : present role , //problem - checked
            "alert": "alert",
            "application": "application",
            "button": "button",
            "calendar": "",
            "chart": "",
            "checkbox": "checkbox",
            "columnheader": "columnheader",
            "combobox": "combobox",
            "datepicker": "",
            "dialog": "dialog",
            "edit": "textbox",
            "fileupload": "",
            "form": "form",
            "frame": "",
            "grid": "grid",
            "gridcell": "cell",
            "groupbox": "group",
            "image": "img",
            "listbox": "none",
            "listboxitem": "listitem",
            "listview": "presentation",
            "listviewband": "treeitem",
            "menubar": "menubar",
            "menu": "menu",
            "menuitem": "menuitem",
            "none": "none", // label 출력 temporary : "treeitem" (sensereader 8.0)
            "progressbar": "meter",
            "radio": "radiogroup", //check 필요 for sensereader 8.0 
            "radioitem": "radio",
            "row": "row",
            "rowheader": "rowheader",
            "rowgroup": "rowgroup",  // rowelement  처리용
            "scrollbar": "scrollbar",
            "slider": "slider",
            "spin": "textbox",
            "splitter": "",
            "static": "treeitem", // treeitem도 안되면 ZWSP로 우회 처리 해야함
            "statusbar": "status",
            "step": "none",
            "tab": "tablist",
            "tabitem": "tab",
            "tabpage": "tabpanel",
            "textarea": "textbox",
            "textbox": "textbox",
            "titlebar": "region",
            "toolbar": "toolbar",
            "tooltip": "tooltip",
            "treegrid": "treegrid",
            "treeitem": "treeitem",
            "webbrowser": "cell", //내부적으로 aria description 사용하려고
            "webview": "cell",
            "link": "link",
            "noread": "listitem",
            "null": "", // role is not setting
            // RP 101516 heading role aria-level 지원 추가 (legacy용 HTML spec)
            "heading": "heading",
            "heading1": "heading",
            "heading2": "heading",
            "heading3": "heading",
            "heading4": "heading",
            "heading5": "heading",
            "heading6": "heading",

            // section tag roles - 아직 사용하지 않으나 필요하면 스펙추가
            "header": "banner",
            "aside": "complementarty",
            "footer": "contentinfo",
            "main": "main",
            "nav": "navigation",
            "section": "region",
            "article": "article"
        };
    }
    else if (nexacro._Browser == "Gecko")
    {
        nexacro._roleList =
        {    //nexacro role : present role , //problem - checked
            "alert": "alert",
            "application": "application",
            "button": "button",
            "calendar": "",
            "chart": "",
            "checkbox": "checkbox",
            "columnheader": "columnheader",
            "combobox": "combobox",
            "datepicker": "",
            "dialog": "dialog",
            //"edit": "textbox",
            "fileupload": "",
            "form": "",
            "frame": "",
            "grid": "",
            "gridcell": "gridcell",
            "groupbox": "group",
            "image": "img",
            "listbox": "listbox",
            "listboxitem": "option",
            "listview": "presentation",
            "listviewband": "treeitem",
            "menubar": "menubar",
            "menu": "menu",
            "menuitem": "menuitem",
            "none": "",
            "progressbar": "", //sensereader bug
            //"radio": "radiogroup",
            "radio": "radiogroup",
            "radioitem": "radio",
            "row": "row",
            "rowheader": "rowheader",
            "rowgroup": "rowgroup", // rowelement  처리용
            "scrollbar": "scrollbar",
            "slider": "slider",
            "spin": "document",
            "splitter": "",
            "static": "",
            "statusbar": "status",
            "step": "",
            "tab": "tablist",
            "tabitem": "tab",
            "tabpage": "tabpanel",
            //"textarea": "textbox",
            //"textbox": "textbox",
            "textbox": "textbox",
            "titlebar": "region",
            "toolbar": "toolbar",
            "tooltip": "tooltip",
            "treegrid": "treegrid",
            "treeitem": "treeitem",
            "webbrowser": "",
            "webview": "",
            "link": "link",
            "noread": "document",
            "null": "", // role is not setting
            // RP 101516 heading role aria-level 지원 추가 (legacy용 HTML spec)
            "heading": "heading",
            "heading1": "heading",
            "heading2": "heading",
            "heading3": "heading",
            "heading4": "heading",
            "heading5": "heading",
            "heading6": "heading",

            // section tag roles - 아직 사용하지 않으나 필요하면 스펙추가
            "header": "banner",
            "aside": "complementarty",
            "footer": "contentinfo",
            "main": "main",
            "nav": "navigation",
            "section": "region",
            "article": "article"
        };
    }
    else
    {
        nexacro._roleList =
        {    //nexacro role : present role , //problem - checked
            "alert": "alert",
            "application": "application",
            "button": "button",
            "calendar": "document",
            "chart": "",
            "checkbox": "checkbox",
            "columnheader": "columnheader",
            "combobox": "combobox",
            "datepicker": "",
            "dialog": "dialog",
            //"edit": "textbox",
            "fileupload": "",
            "form": "",
            "frame": "",
            "grid": "",
            "gridcell": "gridcell",
            "groupbox": "group",
            //"image": "img",
            "listbox": "listbox",
            "listboxitem": "option",
            "listview": "presentation",
            "listviewband": "treeitem",
            "menubar": "menubar",
            "menu": "menu",
            "menuitem": "menuitem",
            "none": "",
            "progressbar": "", //sensereader bug
            //"radio": "radiogroup",
            "radio": "radiogroup",
            "radioitem": "radio",
            "row": "row",
            "rowheader": "rowheader",
            "rowgroup": "rowgroup", // rowelement  처리용
            "scrollbar": "scrollbar",
            "slider": "slider",
            "spin": "document",
            //"spinbutton" : "spinbutton",
            "splitter": "",
            "static": "",
            "statusbar": "status",
            "step": "",
            "tab": "tablist",
            "tabitem": "tab",
            "tabpage": "tabpanel",
            //"textarea": "textbox",
            //"textbox": "textbox",
            "titlebar": "region",
            "toolbar": "toolbar",
            "tooltip": "tooltip",
            "treegrid": "treegrid",
            "treeitem": "treeitem",
            "webbrowser": "",
            "webview": "",
            "link": "link",
            "noread": "document",
            "null": "", // role is not setting
            // RP 101516 heading role aria-level 지원 추가 (legacy용 HTML spec)
            "heading": "heading",
            "heading1": "heading",
            "heading2": "heading",
            "heading3": "heading",
            "heading4": "heading",
            "heading5": "heading",
            "heading6": "heading",

            // section tag roles - 아직 사용하지 않으나 필요하면 스펙추가
            "header": "banner",
            "aside": "complementarty",
            "footer": "contentinfo",
            "main": "main",
            "nav": "navigation",
            "section": "region",
            "article": "article"
        };
    }
}