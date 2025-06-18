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

if (nexacro._Browser == "Runtime")
{
    //==============================================================================
    // Element_Runtime
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
                nexacro.__setElementHandleAccessibilityStatHidden(handle, hidden);
            }
        };

        //delete _pElement;
    }

    if (nexacro.ControlElement) // 추후에 수정
    {
        var _pControlElement = nexacro.ControlElement.prototype;
        // role - component role
        _pControlElement.setElementAccessibilityRole = function (role)
        {
            var accrole = nexacro._roleList[role];
            if (this.accessibilityrole != accrole)
            {
                this.accessibilityrole = accrole;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityRole(handle, accrole);
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

        _pControlElement.setElementAccessibilityEnable = function (enable)
        {
            if (this.accessibilityenable != enable)
            {
                this.accessibilityenable = enable;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityEnable(handle, enable);
            }
        };

        _pControlElement.setElementAccessibilityDescription = function (desc)
        {
            if (this.accessibilitydescription != desc)
            {
                this.accessibilitydescription = desc;
                this._updateElementAccessibilityLabel();

                /*
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityDescription(handle, desc);
                */
            }
        };



        _pControlElement.setElementAccessibilityDescLevel = function (desclevel)
        {
            if (this.accessibilitydesclevel != desclevel)
            {
                this.accessibilitydesclevel = desclevel;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityDescLevel(handle, desclevel);
            }
        };

        _pControlElement.setElementAccessibilityAction = function (action)
        {
            if (this.accessibilityaction != action)
            {
                this.accessibilityaction = action;
                this._updateElementAccessibilityLabel();
                //Todo
            }

        };

        _pControlElement.setElementAccessibilityValue = function (value)
        {
        };

        _pControlElement.setElementAccessibilityStatDisabled = function (disabled)
        {
            if (this.accessibility_stat_disabled != disabled)
            {
                this.accessibility_stat_disabled = disabled;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityStatDisabled(handle, disabled);
            }
        };

        _pControlElement.setElementAccessibilityStatHidden = function (hidden)
        {
            if (this.accessibility_stat_hidden != hidden)
            {
                this.accessibility_stat_hidden = hidden;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityStatHidden(handle, hidden);
            }
        };

        _pControlElement.setElementAccessibilityStatChecked = function (checked)
        {
            if (this.accessibility_stat_checked != checked)
            {
                this.accessibility_stat_checked = checked;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityStatChecked(handle, checked);
            }
        };

        _pControlElement.setElementAccessibilityStatPressed = function (pressed)
        {
            if (this.accessibility_stat_pressed != pressed)
            {
                this.accessibility_stat_pressed = pressed;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityStatPressed(handle, pressed);
            }
        };

        _pControlElement.setElementAccessibilityStatSelected = function (selected)
        {
            if (this.accessibility_stat_selected != selected)
            {
                this.accessibility_stat_selected = selected;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setElementHandleAccessibilityStatSelected(handle, selected);
                }
            }
        };

        _pControlElement.setElementAccessibilityStatLive = function (v)
        {
            if (this.accessibilitylive != v)
            {
                this.accessibilitylive = v;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityLive(handle, v);
            }
        };

        _pControlElement.setElementAccessibilityStatExpanded = function (expanded)
        {
            if (this.accessibility_stat_expanded != expanded)
            {
                this.accessibility_stat_expanded = expanded;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityStatExpanded(handle, expanded);
            }
        };

        _pControlElement.setElementAccessibilityStatAutoComplete = function (autocomplete)
        {
            // autocomplete for html
            //if (this.accessibility_stat_autocomplete != autocomplete)
            //{
            //    this.accessibility_stat_autocomplete = autocomplete;
            //    var handle = this.handle;
            //    if (handle)
            //        nexacro.__setElementHandleAccessibilityStatAutoComplete(handle, autocomplete);
            //}
        };

        _pControlElement.setElementAccessibilityFlagHasPopup = function (haspopup)
        {
            if (this.accessibility_flag_haspopup != haspopup)
            {
                this.accessibility_flag_haspopup = haspopup;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityStatHasPopup(handle, haspopup);
            }
        };

        _pControlElement.setElementAccessibilityFlagFocusable = function (focusable)
        {
            if (this.accessibility_flag_focusable != focusable)
            {
                this.accessibility_flag_focusable = focusable;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityFlagFocusable(handle, focusable);
            }
        };

        _pControlElement.setElementAccessibilityFlagReadOnly = function (readonly)
        {
            if (this.accessibility_flag_readonly != readonly)
            {
                this.accessibility_flag_readonly = readonly;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityFlagReadOnly(handle, readonly);
            }
        };

        _pControlElement.setElementAccessibilityFlagPassword = function (password)
        {
            if (this.accessibility_flag_password != password)
            {
                this.accessibility_flag_password = password;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityFlagPassword(handle, password);
            }
        };

        _pControlElement.setElementAccessibilityFlagMultiSelectable = function (multiselectable)
        {
            if (this.accessibility_flag_multiselectable != multiselectable)
            {
                this.accessibility_flag_multiselectable = multiselectable;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityFlagMultiSelectable(handle, multiselectable);
            }
        };

        _pControlElement.setElementAccessibilityFlagDefaultButton = function (defaultbutton)
        {
            if (this.accessibility_flag_defaultbutton != defaultbutton)
            {
                this.accessibility_flag_defaultbutton = defaultbutton;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityStatDefaultButton(handle, defaultbutton);
            }
        };

        _pControlElement.setElementAccessibilityFlagMultiLine = function (multiline)
        {
            if (this.accessibility_flag_multiline != multiline)
            {
                this.accessibility_flag_multiline = multiline;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityFlagMultiLine(handle, multiline);
            }
        };

        _pControlElement.setElementAccessibilityInfoCount = function (count)
        {
            if (this.accessibility_prop_infocount != count)
            {
                this.accessibility_prop_infocount = count;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityInfoCount(handle, count);
            }
        };

        _pControlElement.setElementAccessibilityInfoIndex = function (index)
        {
            if (this.accessibility_prop_infoindex != index)
            {
                this.accessibility_prop_infoindex = index;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityInfoIndex(handle, index);
            }
        };

        _pControlElement.setElementAccessibilityInfoValueMax = function (valuemax)
        {
            if (this.accessibility_prop_infovaluemax != valuemax)
            {
                this.accessibility_prop_infovaluemax = valuemax;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityInfoValueMax(handle, valuemax);
            }
        };

        _pControlElement.setElementAccessibilityInfoValueMin = function (valuemin)
        {
            if (this.accessibility_prop_infovaluemin != valuemin)
            {
                this.accessibility_prop_infovaluemin = valuemin;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityInfoValueMin(handle, valuemin);
            }
        };

        _pControlElement.setElementAccessibilityInfoValueCur = function (valuecur)
        {
            if (this.accessibility_prop_infovaluecur != valuecur)
            {
                this.accessibility_prop_infovaluecur = valuecur;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityInfoValueCur(handle, valuecur);
            }
        };

        _pControlElement.setElementAccessibilityInfoLevel = function (level)
        {
            if (this.accessibility_prop_infolevel != level)
            {
                this.accessibility_prop_infolevel = level;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityInfoLevel(handle, level);
            }
        };

        _pControlElement.setElementAccessibilityInfoColIndex = nexacro._emptyFn;
        _pControlElement.setElementAccessibilityInfoRowIndex = nexacro._emptyFn;
        _pControlElement.setElementAccessibilityInfoColCount = nexacro._emptyFn;
        _pControlElement.setElementAccessibilityInfoRowCount = nexacro._emptyFn;
        _pControlElement.setElementAccessibilityInfoColIndexText = nexacro._emptyFn;
        _pControlElement.setElementAccessibilityInfoRowIndexText = nexacro._emptyFn;

        _pControlElement.setElementAccessibilityHotKey = function (hotkey)
        {
            if (this.accessibility_prop_hotkey != hotkey)
            {
                this.accessibility_prop_hotkey = hotkey;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityHotKey(handle, hotkey);
            }
        };

        // acccessibility 코드내에서만 사용하는 함수
        _pControlElement.setElementAccessibilityActiveDescendant = nexacro._emptyFn;
        _pControlElement.setElementAccessibilityControls = nexacro._emptyFn;
        _pControlElement.setElementAccessibilityOwns = nexacro._emptyFn;

        _pControlElement.setElementAccessibilityStatFocus = function (label)
        {
            var notifyvalue;
            var handle = this.handle;
            if (handle)
            {
                if (label)
                    notifyvalue = label;
                else
                {
                    var readlabel = this._makeAccessibilityLabelbyReadtype(this);
                    this.accessibilityreadlabel = readlabel;
                    notifyvalue = readlabel;
                }

                nexacro.__setElementHandleAccessibilityLabel(handle, notifyvalue);
                nexacro._notifyAccessibility(handle, notifyvalue, "focus", this);
            }
        };

        // for killfocus
        _pControlElement.setElementAccessibilityStatKillFocus = function ()
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro._notifyAccessibility(handle, null, "killfocus", this);
            }
        };

        _pControlElement.notifyAccessibility = function (label, notifyevent)
        {
            var handle = this.handle;
            if (handle)
            {
                var readlabel = this._makeAccessibilityLabelbyReadtype(this);
                if (readlabel != this.accessibilityreadlabel)
                {
                    this.accessibilityreadlabel = readlabel;
                    nexacro.__setElementHandleAccessibilityLabel(handle, readlabel);
                }
                nexacro._notifyAccessibility(handle, label ? label : this.accessibilityreadlabel, notifyevent ? notifyevent : "notify", this);
            }
        };

        _pControlElement._refreshAccessibilityInfo = function (handle)
        {
            var env = nexacro.getEnvironment();
            if (env._p_enableaccessibility)            
            {
                if (this.accessibilityrole)
                {
                    nexacro.__setElementHandleAccessibilityRole(handle, this.accessibilityrole);
                }

                if (this.accessibilityenable)
                {
                    if (this.accessibilityenable)
                        nexacro.__setElementHandleAccessibilityEnable(handle, this.accessibilityenable);
                    if (this.accessibilitydesclevel)
                        nexacro.__setElementHandleAccessibilityDescLevel(handle, this.accessibilitydesclevel);
                    // if (this.accessibilitydescription)
                    //     nexacro.__setElementHandleAccessibilityDescription(handle, this.accessibilitydescription);
                    var readlabel = this._makeAccessibilityLabelbyReadtype(this);
                    if (readlabel != this.accessibilityreadlabel)
                    {
                        this.accessibilityreadlabel = readlabel;
                        nexacro.__setElementHandleAccessibilityLabel(handle, this.accessibilityreadlabel);
                    }
                }
                else
                {
                    nexacro.__setElementHandleAccessibilityEnable(handle, this.accessibilityenable);
                }

                if (this.accessibility_stat_disabled)
                    nexacro.__setElementHandleAccessibilityStatDisabled(handle, this.accessibility_stat_disabled);
                if (this.accessibility_stat_hidden)
                    nexacro.__setElementHandleAccessibilityStatHidden(handle, this.accessibility_stat_hidden);
                if (this.accessibility_stat_checked)
                    nexacro.__setElementHandleAccessibilityStatChecked(handle, this.accessibility_stat_checked);

                if (this.accessibility_stat_pressed)
                    nexacro.__setElementHandleAccessibilityStatPressed(handle, this.accessibility_stat_pressed);
                if (this.accessibility_stat_selected)
                    nexacro.__setElementHandleAccessibilityStatSelected(handle, this.accessibility_stat_selected);
                if (this.accessibility_stat_expanded)
                    nexacro.__setElementHandleAccessibilityStatExpanded(handle, this.accessibility_stat_expanded);
                //if (this.accessibility_stat_autocomplete)
                //    nexacro.__setElementHandleAccessibilityStatAutoComplete(handle, this.accessibility_stat_autocomplete);

                if (this.accessibility_flag_haspopup)
                    nexacro.__setElementHandleAccessibilityStatHasPopup(handle, this.accessibility_flag_haspopup);
                if (this.accessibility_flag_focusable)
                    nexacro.__setElementHandleAccessibilityFlagFocusable(handle, this.accessibility_flag_focusable);
                if (this.accessibility_flag_readonly)
                    nexacro.__setElementHandleAccessibilityFlagReadOnly(handle, this.accessibility_flag_readonly);

                if (this.accessibility_flag_password)
                    nexacro.__setElementHandleAccessibilityFlagPassword(handle, this.accessibility_flag_password);
                if (this.accessibility_flag_multiselectable)
                    nexacro.__setElementHandleAccessibilityFlagMultiSelectable(handle, this.accessibility_flag_multiselectable);
                if (this.accessibility_flag_defaultbutton)
                    nexacro.__setElementHandleAccessibilityStatDefaultButton(handle, this.accessibility_flag_defaultbutton);

                if (this.accessibility_flag_multiline)
                    nexacro.__setElementHandleAccessibilityFlagMultiLine(handle, this.accessibility_flag_multiline);

                if (this.accessibility_prop_hotkey)
                    nexacro.__setElementHandleAccessibilityHotKey(handle, this.accessibility_prop_hotkey);

                if (this.accessibility_prop_itemcount)
                    nexacro.__setElementHandleAccessibilityInfoCount(handle, this.accessibility_prop_itemcount);
                if (this.accessibility_prop_itemindex)
                    nexacro.__setElementHandleAccessibilityInfoIndex(handle, this.accessibility_prop_itemindex);

                if (this.accessibility_prop_valuemax)
                    nexacro.__setElementHandleAccessibilityInfoValueMax(handle, this.accessibility_prop_valuemax);
                if (this.accessibility_prop_valuemin)
                    nexacro.__setElementHandleAccessibilityInfoValueMin(handle, this.accessibility_prop_valuemin);
            }
        };

        _pControlElement._makeAccessibilityLabelbyReadtype = function (b_label)
        {
            var label, originlabel = "";
            if (this.accessibilitydesclevel != "none" && this.accessibilitydesclevel != "child")
            {
                const env = nexacro.getEnvironment();
                if (b_label !== false && (env._a11ydescreadtype & 0x01) == 0x01)
                {
                    label = originlabel = nexacro._AccessibilityUtil.getAccessibilityLabel(this);
                }
                if ((env._a11ydescreadtype & 0x02) == 0x02 && this.accessibilityaction)
                    label += " " + nexacro._AccessibilityUtil.getAccessibilityAction(this);
                if ((env._a11ydescreadtype & 0x04) == 0x04 && this.accessibilitydescription)
                    label += " " + nexacro._AccessibilityUtil.getAccessibilityDescription(this);
                if (nexacro._AccessibilityUtil.getAccessibilityAdditionalLabel)
                {
                    // label을 설정하지 않으면 value 또는 text가 설정됨
                    // edit, textarea는 센스리더가 value + role을 읽어주는 특성이 있어 label + value + role로 읽게 되어 두번 읽는 것이 정상
                    var additionalLabel = nexacro._AccessibilityUtil.getAccessibilityAdditionalLabel(this);
                    label += " " + additionalLabel;
                    label = label.trim();
                }
            }
            else if (this.accessibilitydesclevel == "none")
            {
                if (nexacro._AccessibilityUtil.getAccessibilityAdditionalLabel)
                {
                    label += " " + nexacro._AccessibilityUtil.getAccessibilityAdditionalLabel(this);
                    label = label.trim();
                }
            }

            if (this.accessibilityparentlabel)
                label = this.accessibilityparentlabel + " " + label;

            return label;

        };

        _pControlElement._setAccessibilityNotifyEvent = function ()
        {
            var handle = this.handle;
            if (handle)
                nexacro.__setElementHandleAccessibilityNotifyEvent(handle);
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
                    this.accessibilityreadlabel = readlabel;
                    nexacro.__setElementHandleAccessibilityLabel(handle, readlabel);
                    nexacro._notifyAccessibility(handle, readlabel, "notify", this);
                }
            }
        };
        _pControlElement._setElementAccessibilityTextContent = nexacro._emptyFn;
        _pControlElement._setElementAccessibilityDescriptionBy = nexacro._emptyFn;

        //delete _pControlElement;
    }

    if (nexacro.InputElement)
    {
        var _pInputElement = nexacro.InputElement.prototype;

        _pInputElement.setElementAccessibilityRole = function (role)
        {
            var accrole = nexacro._roleList[role];
            var input_handle = this.handle;

            if (input_handle)
            {
                nexacro.__setElementHandleAccessibilityRole(input_handle, accrole);
            }
        };

        _pInputElement.setElementAccessibilityActiveDescendant = nexacro._emptyFn;
        _pInputElement.setElementAccessibilityControls = nexacro._emptyFn;
        _pInputElement.setElementAccessibilityOwns = nexacro._emptyFn;
        _pInputElement.setElementAccessibilityStatAutoComplete = nexacro._emptyFn;
        _pInputElement.setElementAccessibilityStatExpanded = nexacro._emptyFn;
        _pInputElement.setElementAccessibilityFlagHasPopup = nexacro._emptyFn;

        _pInputElement.setElementAccessibilityFlagReadOnly = function (readonly)
        {
            if (this.accessibility_flag_readonly != readonly)
            {
                this.accessibility_flag_readonly = readonly;
                var handle = this.handle;
                if (handle)
                    nexacro.__setElementHandleAccessibilityFlagReadOnly(handle, readonly);
            }
        };

        /*_pInputElement.setElementAccessibilityFlagMultiLine = function (multiline)
        {
            if (this.accessibility_flag_multiline != multiline)
            {
                this.accessibility_flag_multiline = multiline;
                var handle = this.handle;
                if (handle)
                {
                    nexacro.__setElementHandleAccessibilityFlagMultiLine(handle, multiline);
                }
            }
        };*/

        _pInputElement.setElementAccessibilityInfoValueMax = nexacro._emptyFn;
        _pInputElement.setElementAccessibilityInfoValueMin = nexacro._emptyFn;
        _pInputElement.setElementAccessibilityInfoValueCur = nexacro._emptyFn;
        _pInputElement._setElementInputRole = nexacro._emptyFn;
        _pInputElement._setAccessibilityLabel = nexacro._emptyFn;

        //reader기가 browser 에서 value를 자동으로 읽어주는 경우를 제어
        _pInputElement._wantAccessibilityAdditionalLabel = function ()
        {
            return true;
        };

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

                nexacro.__setElementHandleAccessibilityLabel(handle, readlabel);
                nexacro._notifyAccessibility(handle, readlabel, "notify", this);
            }
        };

        _pInputElement.setElementAccessibilityStatLive = function (v)
        {
            var handle = this.handle;
            if (handle)
            {
                nexacro.__setElementHandleAccessibilityLive(handle, v);
            }
        };

        //delete _pInputElement;
    }

    nexacro.__notifyInitAccessibility = nexacro._emptyFn;
    nexacro.__notifyAccessibilityInputElement = nexacro._emptyFn;
    nexacro.__createNotifyAccessibilityInputElement = nexacro._emptyFn;
    //==============================================================================
    // SystemBase_Runtime
    //==============================================================================

    if (nexacro._OS == "Windows")
    {
        nexacro._roleList =
        {
            "alert": "0x08", // ROLE_SYSTEM_ALERT
            "application": "0x0e", // ROLE_SYSTEM_APPLICATION
            "button": "0x2b", // ROLE_SYSTEM_PUSHBUTTON
            "calendar": "0x09", // ROLE_SYSTEM_WINDOW //"0x0a", // ROLE_SYSTEM_CLIENT
            "chart": "0x09", // ROLE_SYSTEM_WINDOW //"0x0a", // ROLE_SYSTEM_CLIENT
            "checkbox": "0x2c", // ROLE_SYSTEM_CHECKBUTTON
            "columnheader": "0x09", // ROLE_SYSTEM_WINDOW //"0x29", // ROLE_SYSTEM_STATICTEXT // -> ROLE_SYSTEM_COLUMNHEADER 시 읽어주지 않음
            "combobox": "0x2e", // ROLE_SYSTEM_COMBOBOX
            "datepicker": "0x09", // ROLE_SYSTEM_WINDOW //"0x29", // ROLE_SYSTEM_STATICTEXT
            "dialog": "0x12", // ROLE_SYSTEM_DIALOG
            "edit": "0x2a", // ROLE_SYSTEM_TEXT
            "fileupload": "0x09", // ROLE_SYSTEM_WINDOW //"0x0a", // ROLE_SYSTEM_CLIENT
            "form": "0x09", // ROLE_SYSTEM_WINDOW // -> ROLE_SYSTEM_CLIENT 시 읽어주지 않음
            "frame": "0x09", // ROLE_SYSTEM_WINDOW
            "grid": "0x09", // ROLE_SYSTEM_WINDOW //"0x18", // ROLE_SYSTEM_TABLE
            "gridcell": "0x1d", // ROLE_SYSTEM_CELL
            "groupbox": "0x09", // ROLE_SYSTEM_WINDOW //"0x14", // ROLE_SYSTEM_GROUPING
            "heading": "0x09", // ROLE_SYSTEM_WINDOW //"0x14", // ROLE_SYSTEM_GROUPING
            "image": "0x09", // ROLE_SYSTEM_WINDOW //"0x28", // ROLE_SYSTEM_GRAPHIC
            "link": "0x1e", // ROLE_SYSTEM_LINK
            "listbox": "0x21", // ROLE_SYSTEM_LIST
            "listitem": "0x22", // ROLE_SYSTEM_LISTITEM
            "listview": "0x09", // ROLE_SYSTEM_WINDOW
            "listviewband": "0x24", // ROLE_SYSTEM_OUTLINEITEM
            "menubar": "0x02", // ROLE_SYSTEM_MENUBAR
            "menu": "0x0b", // ROLE_SYSTEM_MENUPOPUP
            "menuitem": "0x0c", // ROLE_SYSTEM_MENUITEM
            "none": "0x09", // ROLE_SYSTEM_WINDOW //"0x0a", // ROLE_SYSTEM_CLIENT
            "progressbar": "0x09", // ROLE_SYSTEM_WINDOW //"0x30", // ROLE_SYSTEM_PROGRESSBAR
            "radio": "0x09", // ROLE_SYSTEM_WINDOW //"0x0a", // ROLE_SYSTEM_CLIENT
            "radioitem": "0x2d", // ROLE_SYSTEM_RADIOBUTTON
            "rowheader": "0x09", // ROLE_SYSTEM_WINDOW //"0x29", // ROLE_SYSTEM_STATICTEXT // -> ROLE_SYSTEM_ROWHEADER 시 읽어주지 않음
            "scrollbar": "0x03", // ROLE_SYSTEM_SCROLLBAR
            "slider": "0x33", // ROLE_SYSTEM_SLIDER
            "spin": "0x34", // ROLE_SYSTEM_SPINBUTTON
            "splitter": "0x15", // ROLE_SYSTEM_SEPARATOR
            "static": "0x29", // ROLE_SYSTEM_STATICTEXT
            "statusbar": "0x17", // ROLE_SYSTEM_STATUSBAR
            "tab": "0x3c", // ROLE_SYSTEM_PAGETABLIST
            "tabitem": "0x25", // ROLE_SYSTEM_PAGETAB
            "tabpage": "0x09", // ROLE_SYSTEM_WINDOW // ROLE_SYSTEM_PAGETAB 
            "textbox": "0x2a", // ROLE_SYSTEM_TEXT
            "textarea": "0x2a", // ROLE_SYSTEM_TEXT
            "titlebar": "0x01", // ROLE_SYSTEM_TITLEBAR
            "toolbar": "0x16", // ROLE_SYSTEM_TOOLBAR
            "tooltip": "0x0d", // ROLE_SYSTEM_TOOLTIP
            "treegrid": "0x09", // ROLE_SYSTEM_WINDOW //"0x0a", // ROLE_SYSTEM_CLIENT
            "treeitem": "0x24",  // ROLE_SYSTEM_OUTLINEITEM
            "webbrowser": "0x09",  // ROLE_SYSTEM_WINDOW
            "webview": "0x09",  // ROLE_SYSTEM_WINDOW
        };
    }
    else if (nexacro._OS == "OSX")
    {
        nexacro._roleList =
        {
            "alert": "0x08", // ROLE_SYSTEM_ALERT
            "application": "0x0e", // ROLE_SYSTEM_APPLICATION
            "button": "0x2b", // ROLE_SYSTEM_PUSHBUTTON
            "calendar": "0x44", // CY_ROLE_SYSTEM_CALENDAR
            "chart": "0x09", // ROLE_SYSTEM_WINDOW //"0x0a", // ROLE_SYSTEM_CLIENT
            "checkbox": "0x2c", // ROLE_SYSTEM_CHECKBUTTON
            "columnheader": "0x19", // ROLE_SYSTEM_COLUMNHEADER 시 읽어주지 않음
            "combobox": "0x2e", // ROLE_SYSTEM_COMBOBOX
            "datepicker": "0x45", // CY_ROLE_SYSTEM_DATEPICKER
            "dialog": "0x12", // ROLE_SYSTEM_DIALOG
            "edit": "0x2a", // ROLE_SYSTEM_TEXT
            "fileupload": "0x09", // ROLE_SYSTEM_WINDOW //"0x0a", // ROLE_SYSTEM_CLIENT
            "form": "0x09", // ROLE_SYSTEM_WINDOW // -> ROLE_SYSTEM_CLIENT 시 읽어주지 않음
            "frame": "0x09", // ROLE_SYSTEM_WINDOW
            "grid": "0x18", // ROLE_SYSTEM_TABLE
            "gridcell": "0x1d", // ROLE_SYSTEM_CELL
            "groupbox": "0x14", // ROLE_SYSTEM_GROUPING
            "image": "0x28", // ROLE_SYSTEM_GRAPHIC
            "listbox": "0x21", // ROLE_SYSTEM_LIST
            "listboxitem": "0x22", // ROLE_SYSTEM_LISTITEM
            "listview": "0x09", // ROLE_SYSTEM_WINDOW
            "listviewband": "0x24", // ROLE_SYSTEM_OUTLINEITEM
            "menubar": "0x02", // ROLE_SYSTEM_MENUBAR
            "menu": "0x0b", // ROLE_SYSTEM_MENUPOPUP
            "menuitem": "0x0c", // ROLE_SYSTEM_MENUITEM
            "none": "0x09", // ROLE_SYSTEM_WINDOW //"0x0aD", // ROLE_SYSTEM_CLIENT
            "progressbar": "0x30", // ROLE_SYSTEM_PROGRESSBAR
            "radio": "0x41", // ROLE_SYSTEM_WINDOW //"0x0a", // ROLE_SYSTEM_CLIENT
            "radioitem": "0x2d", // ROLE_SYSTEM_RADIOBUTTON
            "rowheader": "0x09", // ROLE_SYSTEM_WINDOW //"0x29", // ROLE_SYSTEM_STATICTEXT // -> ROLE_SYSTEM_ROWHEADER 시 읽어주지 않음
            "scrollbar": "0x03", // ROLE_SYSTEM_SCROLLBAR
            "slider": "0x33", // ROLE_SYSTEM_SLIDER
            "spin": "0x34", // ROLE_SYSTEM_SPINBUTTON
            "splitter": "0x15", // ROLE_SYSTEM_SEPARATOR
            "static": "0x29", // ROLE_SYSTEM_STATICTEXT
            "statusbar": "0x17", // ROLE_SYSTEM_STATUSBAR
            "tab": "0x3c", // ROLE_SYSTEM_PAGETABLIST
            "tabitem": "0x25", // ROLE_SYSTEM_PAGETAB
            "tabpage": "0x25", // ROLE_SYSTEM_PAGETAB
            "textbox": "0x2a", // ROLE_SYSTEM_TEXT
            "textarea": "0x2a", // ROLE_SYSTEM_TEXT
            "titlebar": "0x01", // ROLE_SYSTEM_TITLEBAR
            "toolbar": "0x16", // ROLE_SYSTEM_TOOLBAR
            "tooltip": "0x0d", // ROLE_SYSTEM_TOOLTIP
            "treegrid": "0x09", // ROLE_SYSTEM_WINDOW //"0x0a", // ROLE_SYSTEM_CLIENT
            "treeitem": "0x24",  // ROLE_SYSTEM_OUTLINEITEM
            "webbrowser": "0x42",  // ROLE_SYSTEM_BROWSER
            "webview": "0x42",  // ROLE_SYSTEM_BROWSER
        };
    }
    else // Android
    {
        nexacro._roleList =
        {
            "alert": "0x08", // ROLE_SYSTEM_ALERT
            "application": "0x0e", // ROLE_SYSTEM_APPLICATION
            "button": "0x2b", // ROLE_SYSTEM_PUSHBUTTON
            "calendar": "0x2a", // ROLE_SYSTEM_TEXT
            "chart": "0x09", // ROLE_SYSTEM_WINDOW //"0x0a", // ROLE_SYSTEM_CLIENT
            "checkbox": "0x2c", // ROLE_SYSTEM_CHECKBUTTON
            "columnheader": "0x19", // ROLE_SYSTEM_COLUMNHEADER
            "combobox": "0x2e", // ROLE_SYSTEM_COMBOBOX
            "datepicker": "0x09", // ROLE_SYSTEM_WINDOW //"0x29", // ROLE_SYSTEM_STATICTEXT
            "dialog": "0x12", // ROLE_SYSTEM_DIALOG
            "edit": "0x2a", // ROLE_SYSTEM_TEXT
            "fileupload": "0x09", // ROLE_SYSTEM_WINDOW //"0x0a", // ROLE_SYSTEM_CLIENT
            "form": "0x09", // ROLE_SYSTEM_WINDOW // -> ROLE_SYSTEM_CLIENT 시 읽어주지 않음
            "frame": "0x09", // ROLE_SYSTEM_WINDOW
            "grid": "0x09", // ROLE_SYSTEM_WINDOW //"0x18", // ROLE_SYSTEM_TABLE
            "gridcell": "0x1d", // ROLE_SYSTEM_CELL
            "groupbox": "0x09", // ROLE_SYSTEM_WINDOW //"0x14", // ROLE_SYSTEM_GROUPING
            "image": "0x28", // ROLE_SYSTEM_GRAPHIC
            "link": "0x1e", // ROLE_SYSTEM_LINK
            "listbox": "0x21", // ROLE_SYSTEM_LIST
            "listboxitem": "0x22", // ROLE_SYSTEM_LISTITEM
            "listview": "0x09", // ROLE_SYSTEM_WINDOW
            "listviewband": "0x24", // ROLE_SYSTEM_OUTLINEITEM
            "menubar": "0x02", // ROLE_SYSTEM_MENUBAR
            "menu": "0x0b", // ROLE_SYSTEM_MENUPOPUP
            "menuitem": "0x0c", // ROLE_SYSTEM_MENUITEM
            "none": "0x09", // ROLE_SYSTEM_WINDOW //"0x0a", // ROLE_SYSTEM_CLIENT
            "progressbar": "0x09", // ROLE_SYSTEM_WINDOW //"0x30", // ROLE_SYSTEM_PROGRESSBAR
            "radio": "0x2d", // ROLE_SYSTEM_RADIOBUTTON
            "radioitem": "0x2d", // ROLE_SYSTEM_RADIOBUTTON //"0x0a", // ROLE_SYSTEM_CLIENT
            "rowheader": "0x09", // ROLE_SYSTEM_WINDOW //"0x29", // ROLE_SYSTEM_STATICTEXT // -> ROLE_SYSTEM_ROWHEADER 시 읽어주지 않음
            "scrollbar": "0x03", // ROLE_SYSTEM_SCROLLBAR
            "slider": "0x33", // ROLE_SYSTEM_SLIDER
            "spin": "0x34", // ROLE_SYSTEM_SPINBUTTON
            "splitter": "0x15", // ROLE_SYSTEM_SEPARATOR
            "static": "0x29", // ROLE_SYSTEM_STATICTEXT
            "statusbar": "0x17", // ROLE_SYSTEM_STATUSBAR
            "tab": "0x3c", // ROLE_SYSTEM_PAGETABLIST
            "tabitem": "0x25", // ROLE_SYSTEM_PAGETAB
            "tabpage": "0x25", // ROLE_SYSTEM_PAGETAB
            "textbox": "0x2a", // ROLE_SYSTEM_TEXT
            "textarea": "0x2a", // ROLE_SYSTEM_TEXT
            "titlebar": "0x01", // ROLE_SYSTEM_TITLEBAR
            "toolbar": "0x16", // ROLE_SYSTEM_TOOLBAR
            "tooltip": "0x0d", // ROLE_SYSTEM_TOOLTIP
            "treegrid": "0x09", // ROLE_SYSTEM_WINDOW //"0x0a", // ROLE_SYSTEM_CLIENT
            "treeitem": "0x24",  // ROLE_SYSTEM_OUTLINEITEM
            "webbrowser": "0x09",  // ROLE_SYSTEM_WINDOW
            "webview": "0x09",  // ROLE_SYSTEM_WINDOW
        };
    }

}