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
// Accessibility Utility Function
//==============================================================================

// set default accessibilitytype
/*if (!nexacro._isDesktop())  ==> set_enableaccessibility 로 옮김
{
    if (nexacro._OS == "Android")
    {
        nexacro._accessibilitytype = 5; // talkback;
    }
    else if (nexacro._OS == "iOS")
    {
        nexacro._accessibilitytype = 4; // voiceover;
    }
    else
        nexacro._accessibilitytype = 1; // standard;
}
else
{
    nexacro._accessibilitytype = 1; // standard;
}*/

nexacro._a11y_module_loaded = true;

nexacro._setEnableAccessibility = function (env, v)
{
    v = nexacro._toBoolean(v);

    //this._env._p_enableaccessibility = v;
    if (v && (!nexacro._isDesktop() && nexacro._Browser != "Runtime"))
        env._use_translate_scroll = 0;

    if (env._a11ytype === 0) //초기화가 되지 않음
    {
        nexacro._setAccessibilityType(env, env._p_accessibilitytype);
    }

    nexacro.__setEnableAccessibility(v);
};

nexacro._setAccessibilityType = function (env, accessibilitytype)
{
    //standard = 1 , sensereader= 2, jaws = 3, voiceover = 4, talkback = 5
    var v = nexacro._toString(accessibilitytype).toLowerCase();

    switch (v)
    {
        case "sensereader":
            env._a11ytype = 2;
            break;
        case "jaws":
            env._a11ytype = 3;
            break;
        default:
            env._a11ytype = 1; // standard;
            break;
    }

    if (!nexacro._isDesktop())
    {
        if (nexacro._OS == "Android")
        {
            env._a11ytype = 5; // talkback;
        }
        else if (nexacro._OS == "iOS")
        {
            env._a11ytype = 4; // voiceover;
        }
    }

    nexacro.__setAccessibilityType(accessibilitytype);
};

nexacro._setAccessibilityDescReadType = function (env, v)
{
    //0x00 null, 0x01 label, 0x02 action, 0x04 description
    //0x03 label,action , 0x05 label,description 0x06 action, description
    //0x07 label,action,description
    env._a11ydescreadtype = 0;
    if (v.match("label"))
        env._a11ydescreadtype |= 0x01;
    if (v.match("action"))
        env._a11ydescreadtype |= 0x02;
    if (v.match("description"))
        env._a11ydescreadtype |= 0x04;
};
nexacro._setAccessibilityWholeReadType = function (env, v)
{
    if (v == "load")
        env._a11ywholereadtype = 1;
    else if (v == "change")
        env._a11ywholereadtype = 2;
    else if (v == "load,change")
        env._a11ywholereadtype = 3;
    else
        env._a11ywholereadtype = 0;
};

nexacro._setAccessibilityContentSearchKey = function (v)
{
    v = nexacro._toBoolean(v);
    nexacro._accessibilitycontentsearchkey = v;
};

//nexacro._AccessibilityUtil
nexacro._AccessibilityUtil.getAccessibilityLabel = function (elem)
{
    var strLabel = "";
    if (elem)
    {
        strLabel = elem.accessibilitylabel;
    }
    return strLabel;
};

nexacro._AccessibilityUtil.getAccessibilityAction = function (elem)
{
    var strAction = "";
    if (elem)
    {
        strAction = elem.accessibilityaction;
    }
    return strAction;
};

nexacro._AccessibilityUtil.getAccessibilityDescription = function (elem)
{
    var strDescription = "";
    if (elem)
    {
        strDescription = elem.accessibilitydescription;
    }
    return strDescription;
};

nexacro._AccessibilityUtil.setDOMNodeLabel = function (node, label)
{
    if (!node)
        return;

    const env = nexacro.getEnvironment();
    if (env._a11ytype == 2)
    {
        node.innerText = label;
    }
    else
    {
        node.setAttribute("aria-live", "assertive");
        node.innerHTML = label;
    }
};

nexacro._AccessibilityUtil.checkComponentHotkey = function (obj, keyCode, altKey, ctrlKey, shiftKey)
{
    var strHotkey = "";
    var hotkeyList = null;

    if (obj instanceof nexacro.Grid)
    {
        hotkeyList = {};
        const env = obj._env;
        if (env._a11ytype == 2)        
        {
            hotkeyList[nexacro.Event.KEY_CTRL + " " + nexacro.Event.KEY_ALT + " " + nexacro.Event.KEY_HOME] = nexacro._AccessibilityUtil.Hotkey.FIRSTCELLINROW;
            hotkeyList[nexacro.Event.KEY_CTRL + " " + nexacro.Event.KEY_ALT + " " + nexacro.Event.KEY_END] = nexacro._AccessibilityUtil.Hotkey.LASTCELLINROW;
            hotkeyList[nexacro.Event.KEY_CTRL + " " + nexacro.Event.KEY_ALT + " " + nexacro.Event.KEY_PAGE_UP] = nexacro._AccessibilityUtil.Hotkey.FIRSTCELLINCOLUMN;
            hotkeyList[nexacro.Event.KEY_CTRL + " " + nexacro.Event.KEY_ALT + " " + nexacro.Event.KEY_PAGE_DOWN] = nexacro._AccessibilityUtil.Hotkey.LASTCELLINCOLUMN;
        }
        else
        {
            hotkeyList[nexacro.Event.KEY_CTRL + " " + nexacro.Event.KEY_ALT + " " + nexacro.Event.KEY_HOME] = nexacro._AccessibilityUtil.Hotkey.FIRSTCELL;
            hotkeyList[nexacro.Event.KEY_CTRL + " " + nexacro.Event.KEY_ALT + " " + nexacro.Event.KEY_END] = nexacro._AccessibilityUtil.Hotkey.LASTCELL;
            hotkeyList[nexacro.Event.KEY_CTRL + " " + nexacro.Event.KEY_ALT + " " + nexacro.Event.KEY_SHIFT + " " + nexacro.Event.KEY_UP] = nexacro._AccessibilityUtil.Hotkey.FIRSTCELLINCOLUMN;
            hotkeyList[nexacro.Event.KEY_CTRL + " " + nexacro.Event.KEY_ALT + " " + nexacro.Event.KEY_SHIFT + " " + nexacro.Event.KEY_DOWN] = nexacro._AccessibilityUtil.Hotkey.LASTCELLINCOLUMN;
            hotkeyList[nexacro.Event.KEY_CTRL + " " + nexacro.Event.KEY_ALT + " " + nexacro.Event.KEY_SHIFT + " " + nexacro.Event.KEY_LEFT] = nexacro._AccessibilityUtil.Hotkey.FIRSTCELLINROW;
            hotkeyList[nexacro.Event.KEY_CTRL + " " + nexacro.Event.KEY_ALT + " " + nexacro.Event.KEY_SHIFT + " " + nexacro.Event.KEY_RIGHT] = nexacro._AccessibilityUtil.Hotkey.LASTCELLINROW;
        }
    }

    if (ctrlKey)
    {
        strHotkey = strHotkey + nexacro.Event.KEY_CTRL + " ";
    }
    if (altKey)
    {
        strHotkey = strHotkey + nexacro.Event.KEY_ALT + " ";
    }
    if (shiftKey)
    {
        strHotkey = strHotkey + nexacro.Event.KEY_SHIFT + " ";
    }

    strHotkey = strHotkey + keyCode;

    if (hotkeyList)
    {
        return hotkeyList[strHotkey];
    }

    return nexacro._AccessibilityUtil.Hotkey.NONE;
};

nexacro._AccessibilityUtil.isUseTooltipText = function ()
{
    return true;
};

nexacro._AccessibilityUtil.getAccessibilityAdditionalLabel = function (elem)
{
    var strAdditionalLabel = "";
    if (!elem)
        return strAdditionalLabel;

    var comp = elem.linkedcontrol;
    const env = nexacro.getEnvironment();
    const a11ytype = env._a11ytype;
    if (a11ytype == 2)
    {
        if (comp)
            strAdditionalLabel = comp._on_getAccessibilityAdditionalLabel() + comp._on_getAccessibilityAdditionalRole();
    }
    else if (a11ytype == 4)
    {
        if (comp)
        {
            if (comp._has_inputElement || comp._input_element)
            {
                if (!comp._p_password)
                {
                    if (comp._is_compound)
                    {
                        strAdditionalLabel = (comp._p_text) ? comp._p_text : "";
                    }
                    else
                    {
                        strAdditionalLabel = (comp._primitivevalue) ? comp._makeCalendarText(comp._primitivevalue) : "";
                    }
                }
            }
            strAdditionalLabel += " " + comp._on_getAccessibilityAdditionalLabel() + comp._on_getAccessibilityAdditionalRole();;
        }
    }
    else if (a11ytype == 5)
    {
        if (comp)
        {
            if (comp._has_inputElement || comp._input_element)
            {
                if (!comp._p_password)
                {
                    if (comp._is_created)
                    {
                        if (comp._p_usedecorate)
                        {
                            strAdditionalLabel = comp._p_displaytext;
                        }
                        else
                        {
                            if (nexacro._Browser == "Runtime")
                            {
                                strAdditionalLabel = (comp._p_value) ? comp._p_text : comp._p_displaynulltext ? comp._p_displaynulltext : "";
                            }
                            else
                            {
                                if (comp._is_compound)
                                    strAdditionalLabel = comp._on_getAccessibilityAdditionalLabel();
                                //else
                                //    strAdditionalLabel = "";
                            }
                        }
                    }
                    else
                    {
                        if (nexacro._Browser == "Runtime")
                        {
                            strAdditionalLabel = (comp._primitivevalue) ? comp._makeCalendarText(comp._primitivevalue) : (comp._p_value) ? comp._p_text : comp._p_displaynulltext ? comp._p_displaynulltext : "";
                        }
                        else
                        {
                            //if (comp._is_compound)
                            //    strAdditionalLabel = (comp._p_text) ? comp._p_text : comp.displaynulltext ? comp.displaynulltext : "";
                            //else
                            //{
                            //strAdditionalLabel = (comp._primitivevalue) ? comp._makeCalendarText(comp._primitivevalue) : "";
                            strAdditionalLabel += " " + comp._on_getAccessibilityAdditionalLabel();
                            //   strAdditionalLabel = strAdditionalLabel.trim();
                            //}
                        }
                    }
                }
            }
            else
            {
                strAdditionalLabel += " " + comp._on_getAccessibilityAdditionalLabel();
                strAdditionalLabel = strAdditionalLabel.trim();
            }
        }
    }

    return strAdditionalLabel;
};

nexacro._AccessibilityUtil.supportMobileApplicationAccessibility = function (container_handle, bForce)
{
    const env = nexacro.getEnvironment();
    if (env._a11ytype == 4)
    {
        var container_element = container_handle._linked_element;

        if (container_element && !bForce)
        {
            var comp = container_element.parent.linkedcontrol;

            if ((comp && comp._is_component && !comp._hasContainer() && !comp._is_subcontrol && !comp._p_parent._is_frame && !comp._is_frame))
            {
                if (comp._p_accessibilityrole != "spin" && comp._p_accessibilityrole != "grid" && comp._p_accessibilityrole != "treegrid" && comp._p_accessibilityrole != "radio" && comp._p_accessibilityrole != "listbox" && comp._p_accessibilityrole != "textbox" && comp._p_accessibilityrole != "edit" && comp._p_accessibilityrole != "webbrowser" && comp._p_accessibilityrole != "webview" && comp._p_accessibilityrole != "form" && comp._p_accessibilityrole != "fileupload")
                {
                    nexacro.__setDOMAccessibility_StatHidden(container_handle, true);
                }
            }
            else if (comp && (comp instanceof nexacro.ScrollBarControl))
            {
                nexacro.__setDOMAccessibility_StatHidden(container_handle, true);
            }
        }
        else
        {
            nexacro.__setDOMAccessibility_StatHidden(container_handle, true);
        }
    }
    return;
};

nexacro._AccessibilityUtil.unsupportMobileApplicationAccessibility = function (control_element, bForce)
{
    return;
};

nexacro._AccessibilityUtil.cancelTouchEvent = function (elem)
{
    const env = nexacro.getEnvironment();
    if (env._a11ytype == 4 || env._a11ytype == 5)
    {
        var linkedcontrol = elem ? elem.linkedcontrol : null;
        if (!linkedcontrol && elem.parent)
        {
            linkedcontrol = elem.parent.linkedcontrol;
            if (linkedcontrol)
            {
                return elem.parent.accessibilityrole == "link";
            }
        }
    }
    return;
};

//==============================================================================
// Platform
//==============================================================================

//==============================================================================
// SystemBase
//==============================================================================

nexacro._notifyAccessibility = function (node, label, notifyevent, elem, bfocus, benable)
{
    var env = nexacro.getEnvironment();
    if (env)
    {
        var from_refer_comp = elem ? elem.linkedcontrol : env;
        env.on_fire_onaccessibility(label, env, from_refer_comp);
    }

    nexacro.__notifyAccessibility(node, label, notifyevent, elem, bfocus, benable);
};

nexacro._notifyAccessibilityInitialize = function ()
{
    const env = nexacro.getEnvironment();
    if (nexacro._Browser == "Chrome" && env._a11ytype == 2)
        nexacro.__notifyInitAccessibility();
};

nexacro._notifyAccessibilityInputElement = function (label)
{
    const env = nexacro.getEnvironment();
    if (nexacro._Browser == "Chrome" && env._a11ytype == 2)
        nexacro.__notifyAccessibilityInputElement(label);
};

nexacro._createNotifyAccessibilityInputElement = function (label)
{
    const env = nexacro.getEnvironment();
    if (nexacro._Browser == "Chrome" && env._a11ytype == 2)
        nexacro.__createNotifyAccessibilityInputElement();
};

//==============================================================================
// CompBase
//==============================================================================

if (nexacro.Component)
{
    var _pComponent = nexacro.Component.prototype;
    _pComponent._block_read_aria_stat = false;
    _pComponent._accessibilitylive = false;
    //==============================================================================
    // Component : Overrides
    //==============================================================================

    //==============================================================================
    // Component : Accessibility Function
    //==============================================================================
    _pComponent._isAccessibilityRoleHeading = function ()
    {
        let role = this._getAccessibilityRole();
        return (role.indexOf("heading") > -1);
    };

    _pComponent._getAccessibilityRole = function ()
    {
        return this._p_accessibilityrole ? this._p_accessibilityrole : "none";
    };

    _pComponent._getAccessibilityLabel = function ()
    {
        var label = "";
        label = (label = this._getLinkedLabel(this._p_accessibilitylabel)) ? label : this.on_get_accessibility_label();
        label = this._getStringResourceProperty(label);

        var env = this._env;
        var form = this._refform;
        if (form && form._is_form && !form._is_subcontrol && !form._is_track)
        {
            // first accessibilityenable true component in a form
            var comps = form._getComponentsByTaborder(form, 15, true);
            if (comps)
            {
                var comps_len = comps._p_length;
                if (comps_len > 0 && this == comps[0])
                {
                    // "this is the first component"
                    if (env && env.accessibilityfirstovermessage)
                        label = env.accessibilityfirstovermessage + " " + label;
                }

                if (comps_len > 0 && this == comps[comps_len - 1])
                {
                    // "this is the last component"                            
                    if (env && env.accessibilitylastovermessage)
                        label += " " + env.accessibilitylastovermessage;
                }
            }
        }
        return label ? label : "";
    };

    _pComponent._on_getAccessibilityAdditionalLabel = function ()
    {
        //Example : index or count
        //need to override
        return "";
    };

    _pComponent._on_getAccessibilityAdditionalRole = function ()
    {
        if (nexacro._Browser == "Runtime" && this._getAccessibilityRole() == "image")
            return " graphic";
        if (nexacro._Browser == "Runtime" && this._getAccessibilityRole() == "tabpage")
            return " frame";
        return "";
    };

    _pComponent._getAccessibilityDescLevel = function ()
    {
        var desclevel = this._p_accessibilitydesclevel;
        if (desclevel == "none" || desclevel == "child")
            return desclevel;
        var comp = this._p_parent;
        if (comp && comp._getDescLevel)
            return comp._getDescLevel();
        else
            return desclevel;
    };

    _pComponent._getAccessibilityDescription = function ()
    {
        var description = this._getLinkedDescription(this._p_accessibilitydescription);
        description = (description) ? description : this.on_get_accessibility_description();
        return this._getStringResourceProperty(description);
    };

    _pComponent._getAccessibilityAction = function ()
    {
        var action = this._getLinkedAction(this._p_accessibilityaction);
        action = action ? action : this.on_get_accessibility_action();
        return this._getStringResourceProperty(action);
    };

    _pComponent._getAccessibilityReadLabel = function (b_label)
    { //use form
        var control = this.getElement();
        if (control)
        {
            return control._makeAccessibilityLabelbyReadtype(b_label);
        }
        return "";
    };

    //on_gets
    _pComponent.on_get_accessibility_label = function ()
    {
        return ""; //accessibilitylabel의 default 값 설정 안하도록 스펙 제거
    };

    _pComponent.on_get_accessibility_description = function ()
    {
        return ""; // component.tooltiptext 설정시 accessibilitydescription과 중복 충돌이 발생하여 제거로 스펙 변경
    };

    _pComponent.on_get_accessibility_action = function ()
    {
        return "";
    };

    // get label, description, action  by linked id
    _pComponent.__getLinkedString = function (linked_str, get_func)
    {
        var ret = "";
        if (linked_str && get_func)
        {
            var _rs_ = String.fromCharCode(30);
            var arr = linked_str.toString().replace(/\[/g, _rs_ + "[").split(_rs_);
            var len = arr.length;

            for (var i = 0; i < len; i++)
            {
                var str = arr[i];
                var start = str.search("@");
                var end = str.search("]");

                if (start > 0 && end > 0)
                {
                    start += 1;

                    var linkedId = str.substring(start, end);
                    var linkedComp = this._getFormChildById(linkedId);
                    if (linkedComp)
                    {
                        // [@CompId] 형식 갖추면 찾아서 출력
                        ret += get_func.call(linkedComp);

                        // [@CompId] 형식 외 나머지 존재하는 경우
                        if (end + 1 < str.length)
                        {
                            end += 1;
                            ret += str.substring(end);
                        }
                    }
                    else
                    {
                        // [@CompId] 형식 안맞으면 그대로 출력
                        ret += str;
                    }
                }
                else
                {
                    // [@CompId] 형식 안맞으면 그대로 출력
                    start = (start < 0) ? 0 : start;
                    ret += str.substring(start);
                }
            }
        }
        return ret;
    };

    _pComponent._getLinkedLabel = function (label)
    {
        return this.__getLinkedString(label, this._getAccessibilityLabel);
    };

    _pComponent._getLinkedDescription = function (description)
    {
        return this.__getLinkedString(description, this._getAccessibilityDescription);
    };

    _pComponent._getLinkedAction = function (action)
    {
        return this.__getLinkedString(action, this._getAccessibilityAction);
    };

    _pComponent._getDescLevel = function ()
    {

        var desclevel = this._p_accessibilitydesclevel;
        var comp = this._p_parent;
        if (desclevel == "none" || desclevel == "self")
            return "none";
        else if (comp && comp._getDescLevel)
            return comp._getDescLevel();

        return "all";
    };

    _pComponent._getAccessibilityParentValue = function (accessibility)
    {
        var label = "";
        var type = this._env._a11ydescreadtype;
        if ((type & 0x01) == 0x01)
        {
            var _label = this._getAccessibilityLabel(accessibility);
            if (_label)
                label = _label;
        }
        if ((type & 0x02) == 0x02 && this._p_accessibilityaction)
        {
            var _action = " " + this._getAccessibilityAction(accessibility);
            if (_action)
                label += _action;
        }
        if ((type & 0x04) == 0x04 && this._p_accessibilitydescription)
        {
            var _description = " " + this._getAccessibilityDescription(accessibility);
            if (_description)
                label += _description;
        }
        return label;
    };

    _pComponent._setAccessibilityRole = function (role)
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            // heading role 인경우 level 같이 설정
            if (this._isAccessibilityRoleHeading())
            {
                let level = +(role.charAt(role.length - 1))
                this._setAccessibilityInfoLevel(isNaN(level) ? 1 : level);
            }
            control_elem.setElementAccessibilityRole(role);
        }
    };

    _pComponent._setAccessibilityLabel = function (label)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityLabel(label);
    };

    _pComponent._setAccessibilityEnable = function (enable)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityEnable(enable);
    };

    _pComponent._setAccessibilityDescription = function (desc)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityDescription(desc);
    };

    _pComponent._setAccessibilityAction = function (action)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityAction(action);
    };

    _pComponent._setAccessibilityDescLevel = function (desclevel)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityDescLevel(desclevel);
    };

    _pComponent._setAccessibilityValue = function (value, bfocus)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityValue(value, this._input_element, bfocus);
    };

    _pComponent._setAccessibilityStatDisabled = function (disabled)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityStatDisabled(disabled);
    };

    _pComponent._setAccessibilityStatHidden = function (hidden)
    {
        var control_elem = this._control_element;
        if (control_elem)
        {
            const env = this._env;
            if (env._a11ytype == 4 || env._a11ytype == 5)
            {
                if (!this._skip_mobile_tabfocus && !this._p_accessibilityenable)
                    hidden = true;
            }

            control_elem.setElementAccessibilityStatHidden(hidden);
        }

    };

    _pComponent._setAccessibilityStatChecked = function (checked)
    {
        if (this._control_element)
        {
            this._control_element.setElementAccessibilityStatChecked(checked);
        }
    };

    _pComponent._setAccessibilityStatPressed = function (pressed)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityStatPressed(pressed);
    };

    _pComponent._setAccessibilityStatSelected = function (selected)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityStatSelected(selected);
    };

    _pComponent._setAccessibilityStatExpanded = function (expanded)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityStatExpanded(expanded);
    };

    _pComponent._setAccessibilityStatLive = function (v)
    {
        this._accessibilitylive = v;
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityStatLive(v);
    };

    _pComponent._setAccessibilityStatAutoComplete = function (autocomplete)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityStatAutoComplete(autocomplete);
    };

    _pComponent._setAccessibilityFlagHasPopup = function (haspopup)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityFlagHasPopup(haspopup);
    };

    _pComponent._setAccessibilityFlagFocusable = function (focusable)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityFlagFocusable(focusable);
    };

    _pComponent._setAccessibilityFlagReadOnly = function (readonly)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityFlagReadOnly(readonly);
    };

    _pComponent._setAccessibilityFlagPassword = function (password)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityFlagPassword(password);
    };

    _pComponent._setAccessibilityFlagMultiSelectable = function (multiselectable)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityFlagMultiSelectable(multiselectable);
    };

    _pComponent._setAccessibilityFlagDefaultButton = function (defaultbutton)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityFlagDefaultButton(defaultbutton);
    };

    _pComponent._setAccessibilityFlagMultiLine = function (multiline)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityFlagMultiLine(multiline);
    };

    _pComponent._setAccessibilityInfoCount = function (count)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityInfoCount(count);
    };

    _pComponent._setAccessibilityInfoIndex = function (index)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityInfoIndex(index);
    };

    _pComponent._setAccessibilityInfoValueMax = function (valuemax)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityInfoValueMax(valuemax);
    };

    _pComponent._setAccessibilityInfoValueMin = function (valuemin)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityInfoValueMin(valuemin);
    };

    _pComponent._setAccessibilityInfoValueCur = function (valuecur)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityInfoValueCur(valuecur);
    };


    _pComponent._setAccessibilityInfoLevel = function (level)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityInfoLevel(level);
    };

    _pComponent._setAccessibilityHotKey = function (hotkey)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityHotKey(hotkey);
    };

    _pComponent._setAccessibilityActiveDescendant = function (subcontrol, element)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityActiveDescendant(subcontrol, element ? element : control_elem);
    };

    _pComponent._setAccessibilityControls = function (id_list, element)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityControls(id_list, element ? element : control_elem);
    };

    _pComponent._setAccessibilityOwns = function (id_list, element)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem.setElementAccessibilityOwns(id_list, element ? element : control_elem);
    };

    _pComponent._setAccessibilityDescriptionBy = function (id)
    {
        var control_elem = this._control_element;
        if (control_elem)
            control_elem._setElementAccessibilityDescriptionBy(id);
    };

    _pComponent._notifyAccessibility = function (label, notifyevent)
    {
        if (this._control_element)
        {
            this._control_element.notifyAccessibility(label, notifyevent);
        }
    };

    _pComponent._setAccessibilityStatFlag = function (status, userstatus)
    {
        if (nexacro._Browser != "Runtime" && !nexacro._isDesktop() && this._block_read_aria_stat)
        {
            this._setAccessibilityStatHidden(true);
        }

        if (status == "disabled")
        {
            this._setAccessibilityStatDisabled(true);
        }
        else //if (status == "enabled")
        {
            this._setAccessibilityStatDisabled(false);
        }

        if (status == "readonly")
        {
            this._setAccessibilityFlagReadOnly(true);
        }
        else if (status == "enabled")
        {
            this._setAccessibilityFlagReadOnly(false);
        }

        /*      // Todo : mobilesafari에서 "toggle button" 읽는 문제
        if (userstatus == "pushed")
            this._setAccessibilityStatPressed(true);
        else
            this._setAccessibilityStatPressed(false);
            */

        if (this._use_selected_status)
        {
            var is_selected = this._userstatusmap.selected ? true : false;
            if (this instanceof nexacro._RadioItemControl || this instanceof nexacro.CheckBox)
            {

                // if (this._env._a11ytype == 4 || this._env._a11ytype == 5 || nexacro._Browser == "Runtime")
                this._setAccessibilityStatChecked(is_selected);
                //  else
                //      this._setAccessibilityStatSelected(is_selected);
            }
            else
            {
                this._setAccessibilityStatSelected(is_selected);
            }
        }

        if (userstatus == "selected" && status != "focused")
        {
            const env = this._env;
            if (env._a11ytype == 4 || env._a11ytype == 5)
            {
                this._setAccessibilityStatFocus();

            }
        }

        if (nexacro._Browser != "Runtime" && !nexacro._isDesktop() && (this._block_read_aria_stat && this._p_accessibilityenable))
        {
            nexacro._OnceCallbackTimer.callonce(this, function () { this._setAccessibilityStatHidden(false); }, 100);
        }
    };

    _pComponent._isAccessibilityEnable = function ()
    {
        if (!this._env._p_enableaccessibility || !this._p_accessibilityenable)
            return false;
        return true;
    };

    _pComponent._isItemAccessibilityEnable = function ()
    {
        // listtype component만 해당 (Radio, Listbox, FileUpload)
        if (!this._env._p_enableaccessibility || !this._is_listtype || !this._p_itemaccessibilityenable)
            return false;
        return true;
    };

    _pComponent._updateAccessibilityLabel = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
            control_elem._updateElementAccessibilityLabel();

    };

    _pComponent._setAccessibilityTextContent = function (text)
    {
        var control_elem = this.getElement();
        if (control_elem)
            control_elem._setElementAccessibilityTextContent(text);
    };

    _pComponent._setAccessibilityStatFocus = function (evt_name)
    {
        var env = this._env;
        if (this._control_element)
        {
            this._control_element.setElementAccessibilityStatFocus();

            // for showModal
            var form = this._getForm();
            if (form)
            {
                var _window = form._getWindow();
                _window._accessibility_last_focused_comp = this._getRootComponent(this);
            }
        }

        if (env)
            env._set_accessibility_history(this, evt_name);
    };

    // for killfocus
    _pComponent._setAccessibilityStatKillFocus = function ()
    {
        // edit 계열을 별도의 시점으로 처리되어 나중에 정리
        if (this._control_element && !this._is_editable_control)
        {
            this._control_element.setElementAccessibilityStatKillFocus();
        }
    };

    _pComponent._setAccessibilityNotifyEvent = function (direction)
    {
        var control_element = this.getElement();
        if (control_element && control_element.accessibilityenable)
        {
            if (direction !== undefined)
            {
                this._resetScrollPos(
                    this,
                    this._adjust_left,
                    this._adjust_top,
                    this._adjust_left + this._adjust_width,
                    this._adjust_top + this._adjust_height,
                    (direction > 0) ? 0 : 1);
            }

            control_element.notifyAccessibility();
            var form = this._getForm();
            if (form)
            {
                var _window = form._getWindow();
                _window._accessibility_last_focused_comp = this._getRootComponent(this);
            }
            return true;
        }
        return false;
    };

    _pComponent._setAccessibilityInfoByHover = function ()
    {
        return this._setAccessibilityNotifyEvent();
    };

    _pComponent._accessibility_focusin = function (refer_comp, related_comp, reset_scroll)
    {
        this._on_focus(true, "");

        if (reset_scroll)
        {
            this._resetScrollPos(this, this._adjust_left,
                this._adjust_top,
                this._adjust_left + this._adjust_width,
                this._adjust_top + this._adjust_height,
                this._focus_direction);
        }
    };

    _pComponent._accessibility_focusout = function (refer_comp, related_comp)
    {
        if (refer_comp && refer_comp._type_name == "Button")
        {
            if (refer_comp._status == "mouseover")
            {
                refer_comp._changeStatus("mouseover", false);
            }
        }
    };

    // system keydown event 발생 체크 (accessibility)
    _pComponent._isComponentKeydownAction = function ()
    {
        var ret = true;
        if (this._env._p_enableaccessibility)
        {
            var _win = this._getWindow();
            if (_win)
            {
                ret = _win._is_fire_sys_keydown;
            }
        }
        return ret;
    };

    // 가상커서에서 발생된 마우스 이벤트 인지 체크
    _pComponent._isFireVirtualMouseEvent = function ()
    {
        var ret = false;
        if (this._env._p_enableaccessibility && this._env._a11ytype == 2)
        {
            var _win = this._getWindow();
            if (_win)
            {
                ret = _win._is_fire_virtual_mousedown;
            }
        }
        return ret;
    };

    _pComponent._accessibility_keydown = function (elem, refer_comp, keycode, alt_key, ctrl_key, shift_key, meta_key)
    {
        //trace("_accessibility_keyaction",this.id);
        if (this._env._p_enableaccessibility && this._env._a11ytype == 2)
        {
            var ret;
            var env = this._env;
            if (env)
            {
                ret = env.on_fire_onaccessibilitykey(keycode, alt_key, ctrl_key, shift_key, this, this);
                if (ret)
                {
                    elem._event_stop = true;
                    return;
                }
            }

            var _comp = this;
            var _form = this._getForm();
            if (_form)
            {
                if (keycode == nexacro.Event.KEY_TAB)
                {
                    if (!this._getDlgCode(keycode, alt_key, ctrl_key, shift_key).want_tab)
                    {
                        _comp = _form;
                    }
                }
                else if ((keycode == nexacro.Event.KEY_UP || keycode == nexacro.Event.KEY_DOWN) && !alt_key && !ctrl_key && !shift_key)
                {
                    if (!this._getDlgCode(keycode, alt_key, ctrl_key, shift_key).want_arrows)
                    {
                        _comp = _form;
                    }
                }
            }
            if (keycode === nexacro.Event.KEY_SPACE) // checkbox toggle
            {
                var win = this._getWindow();
                win._keydown_element = this._keydown_element = elem;
                win._keydown_element_list.setItem(keycode, this._keydown_element);
            }
            ret = _comp._on_keydown(elem, keycode, alt_key, ctrl_key, shift_key, meta_key);
            if (ret || elem._event_stop)
            {
                elem._event_stop = false;
            }
            else
            {
                ret = _comp._on_keyup(elem, keycode, alt_key, ctrl_key, shift_key, meta_key);
            }
            return ret;
        }
        return false;
    };

    // allow keyaction at keyup event (가상커서 활성모드)
    _pComponent._isFireAccessibilityKeydown = function (keycode, alt_key, ctrl_key, shift_key, meta_key)
    {
        return (keycode === nexacro.Event.KEY_SPACE || keycode === nexacro.Event.KEY_TAB || keycode === nexacro.Event.KEY_UP || keycode === nexacro.Event.KEY_DOWN);
    };

    _pComponent._isAccessibilityCotainerComponent = function ()
    {
        //Mobile, Div, Radio, Listbox, Grid
        if (this._env._a11ytype == 4 || this._env._a11ytype == 5)
        {
            if (this._p_accessibilityenable == true && (this._p_accessibilitydesclevel == "all" || this._p_accessibilitydesclevel == "self"))
                return true;
        }
        return false;
    };
    _pComponent._clearAccessibilityInfoByHover = nexacro._emptyFn;

    //delete _pComponent;
}

//==============================================================================
// FormBase
//==============================================================================

if (nexacro.FormBase)
{
    var _pFormBase = nexacro.FormBase.prototype;
    _pFormBase._skip_mobile_tabfocus = true;

    //==============================================================================
    // FormBase : Overrides
    //==============================================================================

    //==============================================================================
    // FormBase : Accessibility Function
    //==============================================================================

    _pFormBase._searchNextHeadingFocus = function (current, filter_type)
    {
        // accessing only by accessibility mode
        if (!this._env._p_enableaccessibility)
            return null;

        // 15 = this check to true on accessibilityenable
        if (nexacro._isNull(filter_type))
            filter_type = 15;

        var next = this._getHeadingOrderNext(current, 1, filter_type);
        if (!next)
        {
            var parent = this._p_parent;
            if (parent)
            {
                if (parent._hasContainer && parent._hasContainer())
                {
                    // container component (DIv, TabPage)
                    parent = this._getRootComponent(parent);

                    var parent_form = this._getParentForm();
                    next = parent_form._searchNextHeadingFocus(parent, filter_type);
                }
                else
                {
                    // formbase type (Form)
                    next = parent._searchNextHeadingFocus(this, filter_type);
                }
            }
        }

        return next;
    };

    _pFormBase._searchPrevHeadingFocus = function (current, filter_type)
    {
        // accessing only by accessibility mode
        if (!this._env._p_enableaccessibility)
            return null;

        // 15 = this check to true on accessibilityenable
        if (nexacro._isNull(filter_type))
            filter_type = 15;

        var next = this._getHeadingOrderNext(current, -1, filter_type);
        if (!next)
        {
            var parent = this._p_parent;
            if (parent)
            {
                if (parent._hasContainer && parent._hasContainer())
                {
                    // container component (DIv, TabPage)
                    parent = this._getRootComponent(parent);

                    var parent_form = this._getParentForm();
                    next = parent_form._searchPrevHeadingFocus(parent, filter_type);
                }
                else
                {
                    // formbase type (Form)
                    next = parent._searchPrevHeadingFocus(this, filter_type);
                }
            }
        }

        return next;
    };

    // Function use to only type of formbase
    _pFormBase._getHeadingOrderFirst = function (filter_type)
    {
        return this._getHeadingOrderNext(null, 1, filter_type);
    };

    // Function use to only type of formbase
    _pFormBase._getHeadingOrderLast = function (filter_type)
    {
        return this._getHeadingOrderNext(null, -1, filter_type);
    };

    // Function use to only type of formbase
    _pFormBase._getHeadingOrderNext = function (current, direction, filter_type)
    {
        // accessing only by accessibility mode
        if (!this._env._p_enableaccessibility)
            return null;

        if (nexacro._isNull(filter_type))
            filter_type = 15; // filter validation

        if (nexacro._isNull(direction))
            direction = 1; // direction validation

        var ar = this._getComponentsByTaborder(this, filter_type);
        var len = ar._p_length;
        var cur_idx = -1;

        if (nexacro._isNull(current))
        {
            // null of current paremeter be to searching first or last comp
            if (direction < 0)
                cur_idx = len - 1;
            else
                cur_idx = 0;
        }
        else
        {
            // next heding comp search
            cur_idx = nexacro._indexOf(ar, current._getRootComponent(current));
            if (cur_idx < 0)
                return null;

            cur_idx += direction;
        }

        var comp = null, child = null;
        var i = cur_idx;

        if (direction < 0)
        {
            for (; i >= 0; i--)
            {
                comp = ar[i];
                if (comp._hasContainer && comp._hasContainer())
                {
                    child = comp._getHeadingOrderLast(filter_type);

                    if (child)
                    {
                        comp = child;
                        break;
                    }
                }
                else if (comp._isAccessibilityRoleHeading())
                {
                    break;
                }

                comp = null;
            }
        }
        else
        {
            for (; i < len; i++)
            {
                comp = ar[i];
                if (comp._isAccessibilityRoleHeading())
                {
                    break;
                }
                else if (comp._hasContainer())
                {
                    child = comp._getHeadingOrderFirst(filter_type);

                    if (child)
                    {
                        comp = child;
                        break;
                    }
                }

                comp = null;
            }
        }

        return comp;
    };

    _pFormBase = null;
}

if (nexacro.Form)
{
    var _pForm = nexacro.Form.prototype;

    //==============================================================================
    // Form : Overrides
    //==============================================================================

    //==============================================================================
    // Form : Accessibility Function
    //==============================================================================

    _pForm._getPrevHeadingComponent = function (current)
    {
        return this._searchPrevHeadingFocus(current, 15);
    };

    _pForm._getNextHeadingComponent = function (current)
    {
        var comp = null;
        if (current && current._hasContainer())
        {
            comp = current._getHeadingOrderFirst(15);
        }
        else
        {
            comp = this._searchNextHeadingFocus(current, 15);
        }

        return comp;
    };

    _pForm = null;
}

if (nexacro._InnerForm)
{
    var _pInnerForm = nexacro._InnerForm.prototype;

    //==============================================================================
    // FormBase : Overrides
    //==============================================================================

    //==============================================================================
    // FormBase : Accessibility Function
    //==============================================================================

    _pInnerForm._setAccessibilityLabel = function (label)
    {
        var components = this._p_components;
        if (!components || components._p_length > 0)
            return; //Do nothing
        nexacro.FormBase.prototype._setAccessibilityLabel.call(this, label);
    };

    _pInnerForm = null;
}

//==============================================================================
// FrameBase
//==============================================================================

if (nexacro.Frame)
{
    var _pFrame = nexacro.Frame.prototype;

    //==============================================================================
    // Frame : Overrides
    //==============================================================================

    //==============================================================================
    // Frame : Accessibility Function
    //==============================================================================
    _pFrame._searchNextHeadingFocus = function (current, filter_type)
    {
        if (nexacro._isNull(filter_type))
            filter_type = 15; // filter validation

        var comp = null;

        if (this._is_frameset)
        {
            // frameset type (HFrameSet, VFrameSet, FrameSet)
            var frames = this._frames;
            var cur_idx = -1;

            if (nexacro._isNull(current))
            {
                // Serching start on first frame
                cur_idx = 0;
            }
            else
            {
                // Serching start on current frame
                cur_idx = nexacro._indexOf(frames, current);
                if (cur_idx < 0)
                {
                    return null;
                }

                cur_idx += 1;
            }

            var i = cur_idx;
            var len = frames._p_length;
            var frame = null;

            for (; i < len; i++)
            {
                frame = frames[i];
                comp = frame._searchNextHeadingFocus(null, filter_type);

                if (comp)
                {
                    break;
                }

                comp = null;
            }

            current = null;
        }
        else
        {
            // frame type (ChildFrame)
            if (this.form)
            {
                if (nexacro._isNull(current))
                {
                    // Current frame search
                    comp = this.form._getHeadingOrderFirst(filter_type);
                }
                else if (current._is_form)
                {
                    // Parent frame search
                    current = null;
                }
            }
        }

        if (nexacro._isNull(comp) && nexacro._isNull(current))
        {
            var parent_frame = this._p_parent;
            if (parent_frame && parent_frame._is_frame && !parent_frame._isMainFrame())
            {
                comp = parent_frame._searchNextHeadingFocus(this, filter_type);
            }
        }

        return comp;
    };

    _pFrame._searchPrevHeadingFocus = function (current, filter_type)
    {
        if (nexacro._isNull(filter_type))
            filter_type = 15; // filter validation

        var comp = null;

        if (this._is_frameset)
        {
            // frameset type (HFrameSet, VFrameSet, FrameSet)
            var frames = this._frames;
            var len = frames._p_length;
            var cur_idx = -1;

            if (nexacro._isNull(current))
            {
                // Serching start on last frame
                cur_idx = len - 1;
            }
            else
            {
                // Serching start on current frame
                cur_idx = nexacro._indexOf(frames, current);
                if (cur_idx < 0)
                {
                    return null;
                }

                cur_idx -= 1;
            }

            var i = cur_idx;
            var frame = null;

            for (; i >= 0; i--)
            {
                frame = frames[i];
                comp = frame._searchPrevHeadingFocus(null, filter_type);

                if (comp)
                {
                    break;
                }

                comp = null;
            }

            current = null;
        }
        else
        {
            // frame type (ChildFrame)
            if (this.form)
            {
                if (nexacro._isNull(current))
                {
                    // Current frame search
                    comp = this.form._getHeadingOrderLast(filter_type);
                }
                else if (current._is_form)
                {
                    // Parent frame search
                    current = null;
                }
            }
        }

        if (nexacro._isNull(comp) && nexacro._isNull(current))
        {
            var parent_frame = this._p_parent;
            if (parent_frame && parent_frame._is_frame && !parent_frame._isMainFrame())
            {
                comp = parent_frame._searchPrevHeadingFocus(this, filter_type);
            }
        }

        return comp;
    };

    _pFrame = null;
}

if (nexacro.ChildFrame)
{
    var _pChildFrame = nexacro.ChildFrame.prototype;

    //==============================================================================
    // FormBase : Overrides
    //==============================================================================

    //==============================================================================
    // FormBase : Accessibility Function
    //==============================================================================
    if (nexacro._OS == "iOS" && nexacro._Browser == "MobileSafari")
    {
        _pChildFrame._accessibilityModalLock = function (modal_stack)
        {
            if (modal_stack.length > 0)
            {
                var modal_info = modal_stack[modal_stack.length - 1];
                var overlay_elem = modal_info[0]._modal_overlay_elem;
                if (overlay_elem)
                {
                    overlay_elem.setElementAccessibilityStatHidden(true);
                }
            }
            else
            {
                var app = this._getApplication();
                if (app)
                {
                    var parent_frame = app.mainframe.frame;
                    let control_elem = parent_frame.getElement();
                    if (control_elem)
                    {
                        control_elem.setElementAccessibilityStatHidden(true);
                        parent_frame._skip_mobile_tabfocus = false;
                        control_elem.setElementAccessibilityRole("button");
                    }
                }
                else
                {
                    const form = this._getRootObject();
                    if (form)
                    {
                        let control_elem = form.getElement();
                        if (control_elem)
                        {
                            control_elem.setElementAccessibilityStatHidden(true);
                            form._skip_mobile_tabfocus = false;
                            control_elem.setElementAccessibilityRole("button");
                        }
                    }
                }
            }
        };

        _pChildFrame._accessibilityModalUnLock = function (modal_stack)
        {

            if (modal_stack.length > 0)
            {
                var info = modal_stack[modal_stack.length - 1];
                var overlay_elem = info[0]._modal_overlay_elem;
                if (overlay_elem)
                {
                    overlay_elem.setElementAccessibilityStatHidden(false);
                }
            }
            else
            {
                var app = this._getApplication();
                if (app)
                {
                    var parent_frame = app.mainframe.frame;
                    let control_elem = parent_frame.getElement();
                    if (control_elem)
                    {
                        control_elem.setElementAccessibilityStatHidden(false);
                        parent_frame._skip_mobile_tabfocus = true;
                        control_elem.setElementAccessibilityRole(parent_frame.accessibilityrole);
                    }
                }
                else
                {
                    const form = this._getRootObject();
                    if (form)
                    {
                        let control_elem = form.getElement();
                        if (control_elem)
                        {
                            control_elem.setElementAccessibilityStatHidden(false);
                            form._skip_mobile_tabfocus = true;
                            control_elem.setElementAccessibilityRole(form.accessibilityrole);
                        }
                    }
                }
            }
        };
    }
    else
    {
        _pChildFrame._accessibilityModalLock = function (modal_stack)
        {
            if (modal_stack.length > 0)
            {
                var modal_info = modal_stack[modal_stack.length - 1];
                var overlay_elem = modal_info[0]._modal_overlay_elem;
                if (overlay_elem)
                {
                    overlay_elem.setElementAccessibilityStatHidden(true);
                }
            }
            else
            {
                var app = this._getApplication();
                if (app)
                {
                    var parent_frame = app.mainframe.frame;
                    let control_elem = parent_frame.getElement();
                    if (control_elem)
                        control_elem.setElementAccessibilityStatHidden(true);
                }
                else
                {
                    const form = this._getRootObject();
                    if (form)
                    {
                        let control_elem = form.getElement();
                        if (control_elem)
                        {
                            control_elem.setElementAccessibilityStatHidden(true);
                        }
                    }
                }
            }
        };

        _pChildFrame._accessibilityModalUnLock = function (modal_stack)
        {
            if (modal_stack.length > 0)
            {
                var info = modal_stack[modal_stack.length - 1];
                var overlay_elem = info[0]._modal_overlay_elem;
                if (overlay_elem)
                {
                    overlay_elem.setElementAccessibilityStatHidden(false);
                }
            }
            else
            {
                var app = this._getApplication();
                if (app)
                {
                    var parent_frame = app.mainframe.frame;
                    let control_elem = parent_frame.getElement();
                    if (control_elem)
                    {
                        control_elem.setElementAccessibilityStatHidden(false);
                    }
                }
                else
                {
                    const form = this._getRootObject();
                    if (form)
                    {
                        let control_elem = form.getElement();
                        if (control_elem)
                        {
                            control_elem.setElementAccessibilityStatHidden(false);
                        }
                    }
                }
            }
        };

        if (nexacro._OS != "Android" && nexacro._Browser == "Chrome")
        {
            _pChildFrame._setModalUnlock = function ()
            {
                var win;
                if (this._window_type == 5)
                {
                    win = this._p_parent ? this._p_parent._getWindow() : null;
                }
                else
                {
                    win = this._getWindow();
                }
                if (!win)
                    return;

                // destroy overlay
                var modal_stack = win._modal_frame_stack;
                var modal_stack_len = modal_stack.length;
                var modal_info;
                for (var i = 0; i < modal_stack_len; i++)
                {
                    modal_info = modal_stack[i];
                    if (modal_info[0] == this)
                    {
                        // pop
                        for (var j = i; j < modal_stack_len - 1; j++)
                        {
                            modal_stack[j] = modal_stack[j + 1];
                        }
                        modal_stack.length = modal_stack_len - 1;
                        break;
                    }
                }

                nexacro._unregisterPopupFrame(this.id, win);

                this._accessibilityModalUnLock(modal_stack);

                // restore window focus
                if (modal_info)
                {
                    var bFocus = false;
                    var old_focus_path = modal_info[2];
                    if (old_focus_path && old_focus_path.length > 0)
                    {
                        // TODO check modal로 막혀있는 도중 객체가 파괴됐을 경우?? 어쩌나??
                        var old_focus_path_len = old_focus_path.length;
                        for (i = 0; i < old_focus_path_len; i++)
                        {
                            var comp = old_focus_path[i];
                            if (comp instanceof nexacro.ChildFrame)
                            {
                                comp._changeStateActivate(true);
                                //comp._on_activate();
                                continue;
                            }
                            else if (comp._is_form)
                            {
                                comp._on_focus(true);
                                //break;
                            }
                            //추후에 접근성 그리드 스펙으로 이동할 필요있음

                            if (comp._is_alive && comp instanceof nexacro._GridCellControl)
                            {
                                bFocus = true;
                                comp._on_focus(true);
                            }
                            else if (bFocus && i == (old_focus_path_len - 1))
                            {
                                comp._on_focus(true);
                            }
                        }
                    }
                }

                if (this._modal_overlay_elem)
                {
                    this._modal_overlay_elem.destroy();
                    this._modal_overlay_elem = null;
                }

            };
        }

    }

    _pChildFrame = null;
}

//==============================================================================
// nexacro.SimpleComponent
//==============================================================================
if (nexacro.SimpleComponent)
{
    var _pSimpleComponent = nexacro.SimpleComponent.prototype;
    //==============================================================================
    // SimpleComponent : Override
    //==============================================================================

    //==============================================================================
    // SimpleComponent : Accessibility Function
    //==============================================================================
    _pSimpleComponent._initAccessibility = function ()    // Basic Component 에서 Override
    {
        this._accessibility_role = "RoleName";      // Basic Component 에서 Role 지정

        //  this._onInitAccessibility();                // User Accessibility 처리시 Override
    };

    _pSimpleComponent._getAccessibilityRole = function ()
    {
        var role = this._p_accessibilityrole ? this._p_accessibilityrole : this._accessibility_role;
        if (!role) role = "none";
        return role;
    };

    _pSimpleComponent._getAccessibilityLabel = function ()
    {
        var label = this._getLinkedLabel(this._p_accessibilitylabel);
        return label ? label : this.on_get_accessibility_label();
    };

    _pSimpleComponent._applyAccessibility = function ()    // Basic Component 에서 Override
    {
        if (this._env._p_enableaccessibility)
            this.on_apply_accessibility();
    };

    _pSimpleComponent._clearAccessibility = function ()    // Basic Component 에서 Override
    {
        if (this._env._p_enableaccessibility)
        {
            const env = this._env;

            if (env && env._a11yHistoryList)
            {
                env._remove_accessibility_history(this);
            }
        }
    };

    // [하위 Component 처리]
    // 접근성용 Interface 일부 Override 처리
    _pSimpleComponent._onGetAccessibilityAdditionalRole = function ()
    {
        return "";      // TODO:공백없이 추가되도록
    };

    _pSimpleComponent = null;
}

if (nexacro.ComplexComponent)
{
    var _pComplexComponent = nexacro.ComplexComponent.prototype;
    //==============================================================================
    // ComplexComponent : Override
    //==============================================================================

    //==============================================================================
    // ComplexComponent : Accessibility Function
    //==============================================================================
    // [object.accessibility.role:getadd]
    _pComplexComponent._onGetAccessibilityAdditionalRole = function ()
    {
        return "";
    };

    _pComplexComponent = null;
}