//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2023 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file
//          in accordance with the terms of the license agreement accompanying it.
//
//==============================================================================

if (nexacro._Browser != "Runtime" && !nexacro.FlexibleControlElement)
{
    "use strict";
    var _process = true;
    //======================================================================
    // nexacro.FlexibleControlElement - this FlexibleControlElement has container or element
    //======================================================================
    nexacro.FlexibleControlElement = function (parent_elem)
    {
        nexacro.ControlElement.call(this, parent_elem);
        this.parent = parent_elem;
        this.parent_elem = parent_elem;
    };

    var _pFlexibleControlElement = nexacro._createPrototype(nexacro.ControlElement, nexacro.FlexibleControlElement);
    nexacro.FlexibleControlElement.prototype = _pFlexibleControlElement;
    // overide nexacro.Object
    _pFlexibleControlElement._type_name = "FlexibleControlElement";

    // layout
    _pFlexibleControlElement._is_flexible = true;
    _pFlexibleControlElement._layoutbasis = null;
    _pFlexibleControlElement._layouttype = "horizontal";
    _pFlexibleControlElement._layouthorizontalgap = undefined;
    _pFlexibleControlElement._layoutverticalgap = undefined;
    _pFlexibleControlElement._flexmainaxisalign = "";
    _pFlexibleControlElement._flexcrossaxisalign = "";
    _pFlexibleControlElement._flexcrossaxiswrapalign = "";
    _pFlexibleControlElement._flexwrap = "";
    _pFlexibleControlElement._tablecellalign = "";
    _pFlexibleControlElement._tablecellhalign = "";
    _pFlexibleControlElement._tablecellvalign = "";
    _pFlexibleControlElement._tablecellincompalign = "";
    _pFlexibleControlElement._tablecellincomphalign = "";
    _pFlexibleControlElement._tablecellincompvalign = "";
    _pFlexibleControlElement._tabletemplate = "";
    _pFlexibleControlElement._tabletemplatearea = "";
    _pFlexibleControlElement._tabledirection = "";
    _pFlexibleControlElement._layoutspacing = "";

    _pFlexibleControlElement._refreshControl = function (handle, handle_style)
    {
        nexacro.ControlElement.prototype._refreshControl.call(this, handle, handle_style);

        var handle = this.handle;
        // Layout set
        switch (this._layouttype)
        {
            case "horizontal":
            case "vertical":
                nexacro.__setDOMStyle_CompLayoutType(handle.style, this._layouttype);

                if (this._layouthorizontalgap > -1 || this._layoutverticalgap > -1)
                    nexacro.__setDOMStyle_LayoutGap(handle.style, this._layouthorizontalgap, this._layoutverticalgap);
                if (this._layoutspacing)
                    nexacro.__setDOMStyle_LayoutSpacing(handle.style, this._layoutspacing, this.rtl);

                if (this._flexmainaxisalign)
                    nexacro.__setDOMStyle_FlexMainAxisAlign(handle.style, this._flexmainaxisalign);
                if (this._flexcrossaxisalign)
                    nexacro.__setDOMStyle_FlexCrossAxisAlign(handle.style, this._flexcrossaxisalign);
                if (this._flexcrossaxiswrapalign)
                    nexacro.__setDOMStyle_FlexCrossAxisWrapAlign(handle.style, this._flexcrossaxiswrapalign);
                if (this._flexwrap)
                    nexacro.__setDOMStyle_FlexWrap(handle.style, this._flexwrap);
                break;
            case "table":
                nexacro.__setDOMStyle_CompLayoutType(handle.style, this._layouttype);

                if (this._layouthorizontalgap > -1 || this._layoutverticalgap > -1)
                    nexacro.__setDOMStyle_LayoutGap(handle.style, this._layouthorizontalgap, this._layoutverticalgap);
                if (this._layoutspacing)
                    nexacro.__setDOMStyle_LayoutSpacing(handle.style, this._layoutspacing, this.rtl);

                if (this._tablecellhalign)
                    nexacro.__setDOMStyle_TableCellHAlign(handle.style, this._tablecellhalign);
                if (this._tablecellvalign)
                    nexacro.__setDOMStyle_TableCellVAlign(handle.style, this._tablecellvalign);
                if (this._tablecellincomphalign)
                    nexacro.__setDOMStyle_TableCellinCompHAlign(handle.style, this._tablecellincomphalign);
                if (this._tablecellincompvalign)
                    nexacro.__setDOMStyle_TableCellinCompVAlign(handle.style, this._tablecellincompvalign);
                if (this._tabletemplate)
                    nexacro.__setDOMStyle_TableTemplate(handle.style, this._tabletemplate);
                if (this._tabletemplatearea)
                    nexacro.__setDOMStyle_TableTemplateArea(handle.style, this._tabletemplatearea);
                if (this._tabledirection)
                    nexacro.__setDOMStyle_TableDirection(handle.style, this._tabledirection);
                break;
            default:
                nexacro.__setDOMStyle_LayoutType(handle.style, this._layouttype);

                if (this._layouthorizontalgap > -1 || this._layoutverticalgap > -1)
                    nexacro.__clearDOMStyle_LayoutGap(handle.style);
                if (this._layoutspacing)
                    nexacro.__clearDOMStyle_LayoutSpacing(handle.style);
                break;
        }
    };

    _pFlexibleControlElement.setElementPadding = function (padding)
    {
        if (this.padding != padding)
        {
            this.padding = padding;
            this.onApplyPadding();
        }
    };

    _pFlexibleControlElement.onApplyPadding = function ()
    {
        if (this._apply_client_padding)
        {
            var handle = this.handle;
            if (handle)
            {
                var padding = this.padding ? this.padding : this._padding_info;
                nexacro.__setDOMStyle_PaddingObject(handle.style, padding, this.rtl);
            }
        }
    };

    _pFlexibleControlElement._refreshCommonStyleProps = function (handle_style)
    {
        nexacro.ControlElement.prototype._refreshCommonStyleProps.call(this, handle_style);
        this.onApplyPadding();
    };

    _pFlexibleControlElement.setElementStatus = function (status)
    {
        if (this.status != status)
        {
            nexacro.ControlElement.prototype.setElementStatus.call(this, status);
            this.onApplyPadding();
        }
    };

    _pFlexibleControlElement.setElementUserStatus = function (userstatus)
    {
        if (this.userstatus != userstatus)
        {
            nexacro.ControlElement.prototype.setElementUserStatus.call(this, userstatus);
            this.onApplyPadding();
        }
    };

    _pFlexibleControlElement._getCommonStyleStr = function ()
    {
        var str = nexacro.ControlElement.prototype._getCommonStyleStr.call(this);

        if (this._apply_client_padding)
        {
            var padding = this.padding ? this.padding : this._padding_info;
            str += nexacro.__getHTMLStyle_PaddingObject(padding, this.rtl);
        }

        switch (this._layouttype)
        {
            case "horizontal":
            case "vertical":
                str += nexacro.__getHTMLStyle_CompLayoutType(this._layouttype);

                if (this._layouthorizontalgap > -1 || this._layoutverticalgap > -1)
                    str += nexacro.__getHTMLStyle_LayoutGap(this._layouthorizontalgap, this._layoutverticalgap);
                if (this._layoutspacing)
                    str += nexacro.__getHTMLStyle_LayoutSpacing(this._layoutspacing, this.rtl);

                if (this._flexmainaxisalign)
                    str += nexacro.__getHTMLStyle_FlexMainAxisAlign(this._flexmainaxisalign);
                if (this._flexcrossaxisalign)
                    str += nexacro.__getHTMLStyle_FlexCrossAxisAlign(this._flexcrossaxisalign);
                if (this._flexcrossaxiswrapalign)
                    str += nexacro.__getHTMLStyle_FlexCrossAxisWrapAlign(this._flexcrossaxiswrapalign);
                if (this._flexwrap)
                    str += nexacro.__getHTMLStyle_FlexWrap(this._flexwrap);
                break;
            case "table":
                str += nexacro.__getHTMLStyle_CompLayoutType(this._layouttype);

                if (this._layouthorizontalgap > -1 || this._layoutverticalgap > -1)
                    str += nexacro.__getHTMLStyle_LayoutGap(this._layouthorizontalgap, this._layoutverticalgap);
                if (this._layoutspacing)
                    str += nexacro.__getHTMLStyle_LayoutSpacing(this._layoutspacing, this.rtl);

                if (this._tablecellhalign)
                    str += nexacro.__getHTMLStyle_TableCellHAlign(this._tablecellhalign);
                if (this._tablecellvalign)
                    str += nexacro.__getHTMLStyle_TableCellVAlign(this._tablecellvalign);
                if (this._tablecellincomphalign)
                    str += nexacro.__getHTMLStyle_TableCellinCompHAlign(this._tablecellincomphalign);
                if (this._tablecellincompvalign)
                    str += nexacro.__getHTMLStyle_TableCellinCompVAlign(this._tablecellincompvalign);
                if (this._tabletemplate)
                    str += nexacro.__getHTMLStyle_TableTemplate(this._tabletemplate);
                if (this._tabletemplatearea)
                    str += nexacro.__getHTMLStyle_TableTemplateArea(this._tabletemplatearea);
                if (this._tabledirection)
                    str += nexacro.__getHTMLStyle_TableDirection(this._tabledirection);
                break;
        }
        return str;
    };

    _pFlexibleControlElement.setElementLayoutType = function (layouttype)
    {
        if (this._layouttype != layouttype)
        {
            this._layouttype = layouttype;

            var handle = this.handle;

            if (handle)
            {
                nexacro.__setDOMStyle_LayoutType(handle.style, layouttype);
            }
        }
    };

    _pFlexibleControlElement.setElementLayoutHorizontalGap = function (layouthorizontalgap)
    {
        if (this._layouthorizontalgap != layouthorizontalgap)
        {
            this._layouthorizontalgap = layouthorizontalgap;

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_LayoutGap(handle.style, layouthorizontalgap, this._layoutverticalgap);
            }
        }
    };

    _pFlexibleControlElement.setElementLayoutVerticalGap = function (layoutverticalgap)
    {
        if (this._layoutverticalgap != layoutverticalgap)
        {
            this._layoutverticalgap = layoutverticalgap;

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_LayoutGap(handle.style, this._layouthorizontalgap, layoutverticalgap);
            }
        }
    };

    _pFlexibleControlElement.setElementFlexMainAxisAlign = function (flexmainaxisalign)
    {
        if (this._flexmainaxisalign != flexmainaxisalign)
        {
            this._flexmainaxisalign = flexmainaxisalign;

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_FlexMainAxisAlign(handle.style, flexmainaxisalign);
            }
        }
    };

    _pFlexibleControlElement.setElementFlexCrossAxisAlign = function (flexcrossaxisalign)
    {
        if (this._flexcrossaxisalign != flexcrossaxisalign)
        {
            this._flexcrossaxisalign = flexcrossaxisalign;

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_FlexCrossAxisAlign(handle.style, flexcrossaxisalign);
            }
        }
    };

    _pFlexibleControlElement.setElementFlexCrossAxisWrapAlign = function (flexcrossaxiswrapalign)
    {
        if (this._flexcrossaxiswrapalign != flexcrossaxiswrapalign)
        {
            this._flexcrossaxiswrapalign = flexcrossaxiswrapalign;

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_FlexCrossAxisWrapAlign(handle.style, flexcrossaxiswrapalign);
            }
        }
    };

    _pFlexibleControlElement.setElementFlexWrap = function (flexwrap)
    {
        if (this._flexwrap != flexwrap)
        {
            this._flexwrap = flexwrap;

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_FlexWrap(handle.style, flexwrap);
            }
        }
    };

    _pFlexibleControlElement.setElementLayoutSpacing = function (layoutspacing)
    {
        if (this._layoutspacing != layoutspacing)
        {
            this._layoutspacing = layoutspacing;

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_LayoutSpacing(handle.style, layoutspacing, this.rtl);
            }
        }
    };

    _pFlexibleControlElement.setElementTableCellAlign = function (tablecellalign)
    {
        if (this._tablecellalign != tablecellalign)
        {
            this._tablecellalign = tablecellalign;
            var Arralign = this._parseLayoutCellAlign(tablecellalign);
            if (Arralign && Arralign.length == 2)
            {
                this._tablecellhalign = Arralign[0];
                this._tablecellvalign = Arralign[1];
            }

            var handle = this.handle;
            if (handle)
            {
                if (this._tablecellhalign)
                    nexacro.__setDOMStyle_TableCellHAlign(handle.style, this._tablecellhalign);
                if (this._tablecellvalign)
                    nexacro.__setDOMStyle_TableCellVAlign(handle.style, this._tablecellvalign);
            }
        }
    };

    _pFlexibleControlElement.setElementTableCellinCompAlign = function (tablecellincompalign)
    {
        if (this._tablecellincompalign != tablecellincompalign)
        {
            this._tablecellincompalign = tablecellincompalign;
            var Arralign = this._parseLayoutCellAlign(tablecellincompalign);

            if (Arralign && Arralign.length == 2)
            {
                this._tablecellincomphalign = Arralign[0];
                this._tablecellincompvalign = Arralign[1];
            }

            var handle = this.handle;
            if (handle)
            {
                if (this._tablecellincomphalign)
                    nexacro.__setDOMStyle_TableCellinCompHAlign(handle.style, this._tablecellincomphalign);
                if (this._tablecellincompvalign)
                    nexacro.__setDOMStyle_TableCellinCompHAlign(handle.style, this._tablecellincompvalign);
            }
        }
    };

    _pFlexibleControlElement.setElementTableDirection = function (tabledirection)
    {
        if (this._tabledirection != tabledirection)
        {
            this._tabledirection = tabledirection;

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setDOMStyle_TableDirection(handle.style, tabledirection);
            }
        }
    };

    _pFlexibleControlElement.setElementTableTemplate = function (tabletemplate)
    {
        if (this._tabletemplate != tabletemplate)
        {
            this._tabletemplate = tabletemplate;
            // validation 필요. 정상값 외엔 "1fr / 1fr"

            var handle = this.handle;
            if (handle)
            {
                var childs = handle.childNodes;
                var nodes = [];

                if (tabletemplate)
                    nexacro.__setDOMStyle_TableTemplate(handle.style, tabletemplate);
                else
                    nexacro.__clearDOMStyle_TableTemplate(handle.style);

                nexacro.__setDOMStyle_TableTemplateArea(handle.style, this._tabletemplatearea);
            }
        }
    };

    _pFlexibleControlElement.setElementTableTemplateArea = function (tabletemplatearea)
    {
        if (this._tabletemplatearea != tabletemplatearea)
        {
            this._tabletemplatearea = tabletemplatearea;

            var handle = this.handle;
            if (handle)
            {
                if (tabletemplatearea)
                    nexacro.__setDOMStyle_TableTemplateArea(handle.style, tabletemplatearea);
                else
                    nexacro.__clearDOMStyle_TableTemplateArea(handle.style);
            }
        }
    };


    //======================================================================
    // nexacro.LabelElement
    //======================================================================
    nexacro.LabelElement = function (parent_elem)
    {
        nexacro.ControlElement.call(this, parent_elem);
    };

    var _pLabelElement = nexacro._createPrototype(nexacro.ControlElement, nexacro.LabelElement);
    nexacro.LabelElement.prototype = _pLabelElement;

    _pLabelElement._type_name = "LabelElement";

    _pLabelElement.For = function (input_elem)
    {
        if (input_elem && input_elem.handle && this.handle)
        {
            this.handle.htmlFor = input_elem.handle.id;
        }
    };

    //======================================================================
    // nexacro.SimpleInputElement - this Element
    //======================================================================
    nexacro.SimpleInputElement = function (parent_elem, id)
    {
        nexacro.InputElement.call(this, parent_elem, id);
    };

    var _pSimpleInputElement = nexacro._createPrototype(nexacro.InputElement, nexacro.SimpleInputElement);
    nexacro.SimpleInputElement.prototype = _pSimpleInputElement;

    _pSimpleInputElement._type_name = "SimpleInputElement";
    _pSimpleInputElement._use_html_maxlength = true;
    _pSimpleInputElement.inputmode = "text"; //['text(default)', 'password', 'numeric', 'tel', decimal, email, url... ] for HTML inputmode

    _pSimpleInputElement._createElementHandle = function (owner_elem, _doc)
    {
        var handle = this.handle = _doc.createElement("input");
        var handle_style = handle.style;

        handle.id = this.name;
        nexacro.__setDOMNode_ClassName(handle, this._getElementClassName());

        handle._linked_element = this;

        this._refreshCommonStyleProps(handle_style);
        this._setElementDefaultLineHeight();

        if (this.textAlign)
            nexacro.__setDOMStyle_textAlign(handle_style, this.textAlign, this.rtl);

        if (this.padding)
            nexacro.__setDOMStyle_PaddingObject(handle_style, this.padding, this.rtl);

        if (!this.enable)
            nexacro.__setDOMNode_Enable(handle, false);

        if (this.readonly)
            nexacro.__setDOMNode_ReadOnly(handle, true);

        nexacro.__setDOMNode_Value(handle, this.value);
        nexacro.__setDOMNode_Type(handle, this.inputtype);
        nexacro.__setDOMNode_InputMode(handle, this.inputmode);

        if (this.maxlength > 0)
            nexacro.__setDOMNode_MaxLength(handle, this.maxlength);

        this._on_createAccessibilityHandle(_doc, owner_elem, handle);

        nexacro.__setDOMNode_Autocomplete(handle, "new-password");

        if (this.handle)
        {
            nexacro.__appendDOMNode(owner_elem.dest_handle, this.handle);
        }
    };

    _pSimpleInputElement._TestDisplayArea = function (v)
    {
        var handle = this.handle;
        if (handle)
        {
            var border;
            if (v)
                border = nexacro.BorderObject("1px dotted blue");
            else
                border = nexacro.BorderObject("0px none");

            nexacro.__setDOMStyle_BorderObject(handle.style, border, this.rtl);
        }
    }

    _pSimpleInputElement.createCommand = function ()
    {
        var owner_elem = this.parent_elem.getContainerElement(this.position_step);
        if (owner_elem && !this._created)
        {
            this.owner_elem = owner_elem;
            this.rtl = this._isParentRtl();

            var handle_style = this._getCommonStyleStr();

            if (!this.enable)
                handle_style += nexacro.__getHTMLStyle_Enable(this.enable, this._disabled_color);

            if (this.textAlign)
                handle_style += nexacro.__getHTMLStyle_textAlign(this.textAlign, this.rtl);

            if (this.padding)
                handle_style += nexacro.__getHTMLStyle_PaddingObject(this.padding, this.rtl);

            if (this.imemode)
            {
                if (this._imedisable)
                    handle_style += nexacro.__getHTMLStyle_ImeMode("disabled");
                else
                    handle_style += nexacro.__getHTMLStyle_ImeMode(this.imemode);
            }

            handle_style += this._getElementDefaultLineHeight();

            var handle_attr =
                nexacro.__getHTMLAttr_Enable(this.enable) +
                nexacro.__getHTMLAttr_ReadOnly(this.readonly);

            if (this.maxlength > 0 && this._use_html_maxlength)
                handle_attr += nexacro.__getHTMLAttr_MaxLength(this.maxlength);

            var str = "";
            str += "<input id='" + this.name + "' class='" + this._getElementClassName() + "' ";
            str += (handle_style) ? (" style='" + handle_style + "' ") : "";

            if (!nexacro._isNull(this.value) || this.value === "")
            {
                const env = nexacro.getEnvironment();
                if (env._p_enableaccessibility != true || env._a11ytype != 5 || (this.owner_elem.linkedcontrol && !(this.owner_elem.linkedcontrol instanceof nexacro.MaskEdit)))
                    str += "value ='" + nexacro._encodeXml(this.value) + "' ";
            }
            else
            {
                str += "value ='" + nexacro._encodeXml(this.defaultvalue) + "' ";
            }

            if (nexacro._isTouchInteraction && nexacro._OS == "Android")
            {
                handle_attr += nexacro.__getHTMLAttr_InputType(this.usesoftkeyboard ? this.inputtype : "text");
                handle_attr += nexacro.__getHTMLAttr_InputMode(this.usesoftkeyboard ? this.inputmode : "none");
            }
            else
            {
                handle_attr += nexacro.__getHTMLAttr_InputType(this.inputtype);
                handle_attr += nexacro.__getHTMLAttr_InputMode(this.inputmode);
            }

            if (this.inputtype == "password")
                str += nexacro.__getHTMLAttr_Autocomplete("new-password");
            else
                str += nexacro.__getHTMLAttr_Autocomplete("off");

            str += handle_attr ? (" " + handle_attr) : "";
            str = this._on_createAccessibilityCommand(str);
            str += ">";

            return str;
        }
        return "";
    };
    /* 필요시 해제
    _pSimpleInputElement._bindSysEvent = function ()
    {
        nexacro.InputElement.prototype._bindSysEvent.call(this);
        var input = this.handle;
        if (input)
        {
            nexacro._observeSysEvent(input, "invalid", "oninvalid", this._on_sys_invalid);
        }
    };

    _pSimpleInputElement._unbindSysEvent = function ()
    {
        nexacro.InputElement.prototype._unbindSysEvent.call(this);
        var input = this.handle;
        if (input)
        {
            nexacro._stopSysObserving(input, "invalid", "oninvalid", this._on_sys_invalid);
        }
    };
    */
    _pSimpleInputElement.attachHandle = function (win)
    {
        if (this.name && !this.handle)
        {
            var input_handle = win._doc.getElementById(this.name);
            this.handle = input_handle;
            this.handle._linked_element = this;

            this._bindSysEvent();

            const env = nexacro.getEnvironment();
            if (this._use_accessibility_label && env._p_enableaccessibility)
                this._label_handle = win._doc.getElementById(this.name + ":label");
        }
    };

    _pSimpleInputElement._getCommonStyleStr = function ()
    {
        var str;
        if (nexacro._OS == "Android")
        {
            str = nexacro.Element.prototype._getCommonStyleStr.call(this, true);

            if (this.width >= 0 && this.height >= 0)
                str += nexacro.__getHTMLStyle_Size(this.inputtype == "date" ? this.width + this._INDICATOR_WIDTH : this.width, this.height);
        }
        else
        {
            str = nexacro.Element.prototype._getCommonStyleStr.call(this);
        }
        return str;
    };

    _pSimpleInputElement._refreshCommonStyleProps = function (handle_style)
    {
        if (nexacro._OS == "Android")
        {
            nexacro.Element.prototype._refreshCommonStyleProps.call(this, handle_style, true);

            var linked_control = this.linkedcontrol;
            if (!(linked_control && linked_control._is_frame && (linked_control._isMainFrameBody() && !nexacro._allow_default_pinchzoom)))   //if it is not mainframe
            {
                if (this.width && this.height)
                    nexacro.__setDOMStyle_Size(handle_style, this.inputtype == "date" ? this.width + this._INDICATOR_WIDTH : this.width, this.height);
            }
        }
        else
        {
            nexacro.Element.prototype._refreshCommonStyleProps.call(this, handle_style);
        }
    };

    _pSimpleInputElement._getInputID = function ()
    {
        return this.name + ":simpleinput";
    };

    _pSimpleInputElement._getInputValue = function ()
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            return nexacro.__getDOMNodeValue(input_handle);
        }
        return "";
    };

    _pSimpleInputElement._clearNumberGabageValue = function ()
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            if (!input_handle.value)    // 값은 없지만 화면 상에는 존재하는 경우가 있음.
                input_handle.value = "";
        }
    };

    _pSimpleInputElement._getValidity = function ()
    {
        var input_handle = this.handle;
        if (input_handle)
        {
            return input_handle.validity;
        }
    };

    /* field는 inputmode를 내부에서 사용하기 때문에 인터페이스를 inputelement와 분리 */
    if (nexacro._isTouchInteraction && nexacro._OS == "Android")
    {
        _pSimpleInputElement.setElementInputType = function (type)
        {
            if (this.inputtype != type)
            {
                this.inputtype = type;
            }

            var input_handle = this.handle;
            if (input_handle)
            {
                if (this.usesoftkeyboard)
                {
                    nexacro.__changeInputDOMNodeType(input_handle, type);
                }
                else
                {
                    nexacro.__changeInputDOMNodeType(input_handle, "text");
                }
            }
        };

        _pSimpleInputElement.setElementInputMode = function (mode)
        {
            if (this.inputmode != mode)
            {
                this.inputmode = mode == "number" ? "decimal" : mode;
            }

            // inputmode와 관계없이 usesoftkeyboard의 영향을 받기 위해 수정
            var input_handle = this.handle;
            if (input_handle)
            {
                if (this.usesoftkeyboard)
                {
                    nexacro.__setDOMNode_InputMode(input_handle, this.inputmode);
                }
                else
                {
                    nexacro.__setDOMNode_InputMode(input_handle, "none");
                }
            }
        };
    }
    else
    {
        _pSimpleInputElement.setElementInputType = function (type)
        {
            if (this.inputtype != type)
            {
                this.inputtype = type;
                var input_handle = this.handle;
                if (input_handle)
                {
                    nexacro.__changeInputDOMNodeType(input_handle, type);
                }
            }
        };

        _pSimpleInputElement.setElementInputMode = function (mode)
        {
            if (this.inputmode != mode)
            {
                this.inputmode = mode;
                var input_handle = this.handle;
                if (input_handle)
                {
                    nexacro.__setDOMNode_InputMode(input_handle, mode);
                }
            }
        };
    }

    _pSimpleInputElement.setElementUseSoftKeyboard = function (usesoftkeyboard)
    {
        if (this.usesoftkeyboard != usesoftkeyboard)
        {
            this.usesoftkeyboard = usesoftkeyboard;
            this.setElementInputMode(this.inputmode);
        }
    };

    _pSimpleInputElement._on_sys_focus = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            if (!pThis) return;

            if (!pThis.on_sys_focus_before_process(evt)) return;
            if (!pThis.on_sys_focus_process(evt)) return;

            var comp = pThis.parent.linkedcontrol;
            if (comp)
                comp.on_input_focus();
        }
    };

    _pSimpleInputElement._on_sys_invalid = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            if (!pThis) return;

            var comp = pThis.parent.linkedcontrol;
            if (comp && comp.on_input_invalid)
                comp.on_input_invalid();
        }
    };

    _pSimpleInputElement._on_sys_compositionend = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            pThis.on_sys_compositionend_process.call(pThis, evt);
        }
    };

    _pSimpleInputElement.on_sys_compositionend_process = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            if (!pThis) return;

            var pos = pThis.getElementCaretPos();
            pThis._composer.setStatus(nexacro._CompositionState.END, pos.end);

            pThis.value = input_handle.value;

            var comp = pThis.parent.linkedcontrol;
            if (comp && comp.on_input_compositionend)
                comp.on_input_compositionend();
        }
    };


    _pSimpleInputElement._on_sys_compositionstart = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            var pos = pThis.getElementCaretPos();
            pThis._composer.setStatus(nexacro._CompositionState.START, pos.begin);
        }
    };

    _pSimpleInputElement._on_sys_compositionupdate = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            var pos = pThis.getElementCaretPos();
            pThis._composer.setStatus(nexacro._CompositionState.COMPOSING, pos.end);
            pThis.on_sys_compositionupdate_process.call(pThis, evt);
        }
    };

    _pSimpleInputElement.setElementValue = function (value)
    {
        var text = (nexacro._isNull(value) ? this.defaultvalue : (value + ""));

        if ((this.value == value) && (this._getInputValue() == text))
            return;

        this.value = value;
        this._input_text = text;

        var input_handle = this.handle;
        var comp = this.parent_elem.linkedcontrol;
        if (input_handle)
        {
            this._setElementLastSelectionRange();

            if (this.value || this.value === "")
            {
                if (!comp._is_killfocusing && (this._is_focused || !this._checkmax_editing_only))
                {
                    if (this.maxlength > 0 && text.length > this.maxlength)
                    {
                        text = text.substring(0, this.maxlength);
                    }
                }

                this._updateInputValue(text);
            }
            else
            {
                this._updateInputValue(text);
            }
        }
    };

    _pSimpleInputElement._on_sys_beforeinput_forward = function (evt)
    {
        var input_handle = evt.target;
        if (input_handle)
        {
            // undo redo 차단하고 keydown 에서만 처리 하는 것 추가
            if (evt.inputType == "historyUndo" || evt.inputType == "historyRedo")
            {
                evt.preventDefault();
            }
        }

        return nexacro.InputElement.prototype._on_sys_beforeinput_forward.call(this, evt);
    };

    _pSimpleInputElement.on_apply_imeSet = function (evt)
    {
        var i, len;
        var input_handle = evt ? evt.target : null;
        var pThis = input_handle ? input_handle._linked_element : this;

        var _locale = pThis._imelocale.getLocale();
        var _cache_inputelement_set = nexacro._cache_simpleinputelement_set[_locale];
        if (_locale && _cache_inputelement_set)
        {
            // 기존 ime에서 자체적으로 만든 함수, 변수 제거 해야함
            // clear함수 필요

            for (var prop in _cache_inputelement_set)
            {
                pThis[prop] = _cache_inputelement_set[prop];
            }

            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                if (!nexacro._cache_simpleinputelement_set[_locale][nexacro._inputelement_user_override_func[i]])
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.SimpleInputElement.prototype[nexacro._inputelement_user_override_func[i]];
            }
        }
        else
        {
            // 기존ime 정보 clear함수 필요

            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                pThis[nexacro._inputelement_user_override_func[i]] = nexacro.SimpleInputElement.prototype[nexacro._inputelement_user_override_func[i]];
            }

        }

        // edit/textarea
        var comp = pThis.parent_elem.linkedcontrol;
        if (comp.on_apply_imeSet) comp.on_apply_imeSet();

        pThis.on_apply_ime_environment(evt);
    };
    /*
    _pSimpleInputElement.on_apply_imeSet = function (evt)
    {
        var i, len;
        var input_handle = evt ? (evt.target || evt.srcElement) : this.handle;
        var pThis = input_handle ? input_handle._linked_element : this;

        var _locale = pThis._imelocale.getLocale();        
        if (_locale && nexacro._cache_inputelement_set[_locale] && nexacro._cache_textareaelement_set[_locale])
        {
            // 기존 ime에서 자체적으로 만든 함수, 변수 제거 해야함
            // clear함수 필요            
            var proto_simple_input_element = nexacro.SimpleInputElement.prototype;
            //var proto_simple_textarea_element = nexacro.SimpleTextAreaElement.prototype;
            var _inputelement_user_override_func = nexacro._inputelement_user_override_func;
            for (i = 0, len = _inputelement_user_override_func.length; i < len; i++)
            {
                var item = _inputelement_user_override_func[i];
                pThis[item] = proto_simple_input_element[item];

                if (proto_simple_textarea_element[item])
                    pThis[item] = proto_simple_textarea_element[item];
            }
            var _cache_inputelement_set = nexacro._cache_inputelement_set;
            for (var prop in _cache_inputelement_set[_locale])
            {
                pThis[prop] = _cache_inputelement_set[_locale][prop];
            }
            var _cache_simpleinputelement_set = nexacro._cache_simpleinputelement_set;
            for (var prop in _cache_simpleinputelement_set[_locale])
            {
                pThis[prop] = _cache_simpleinputelement_set[_locale][prop];
            }

            for (i = 0, len = _inputelement_user_override_func.length; i < len; i++)
            {
                var item = _inputelement_user_override_func[i];
                if (!_inputelement_user_override_func[_locale][item] &&
                    !nexacro._cache_textareaelement_set[_locale][item] &&
                    pThis[item] !== nexacro.InputElement.prototype[item])
                    pThis[item] = nexacro.TextAreaElement.prototype[item];
            }
        }
        else if (_locale && nexacro._cache_inputelement_set[_locale])
        {
            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                pThis[nexacro._inputelement_user_override_func[i]] = nexacro.InputElement.prototype[nexacro._inputelement_user_override_func[i]];
                if (nexacro.TextAreaElement.prototype[nexacro._inputelement_user_override_func[i]])                        
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.TextAreaElement.prototype[nexacro._inputelement_user_override_func[i]];
            }

            for (var prop in nexacro._cache_inputelement_set[_locale])
            {
                pThis[prop] = nexacro._cache_inputelement_set[_locale][prop];
            }

            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                if (!nexacro._cache_inputelement_set[_locale][nexacro._inputelement_user_override_func[i]] &&
                    pThis[nexacro._inputelement_user_override_func[i]] !== nexacro.InputElement.prototype[nexacro._inputelement_user_override_func[i]])
                {
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.TextAreaElement.prototype[nexacro._inputelement_user_override_func[i]];
                }
            }
        }
        else if (_locale && nexacro._cache_textareaelement_set[_locale])
        {
            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                pThis[nexacro._inputelement_user_override_func[i]] = nexacro.InputElement.prototype[nexacro._inputelement_user_override_func[i]];
                if (nexacro.TextAreaElement.prototype[nexacro._inputelement_user_override_func[i]])
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.TextAreaElement.prototype[nexacro._inputelement_user_override_func[i]];
            }

            for (var prop in nexacro._cache_textareaelement_set[_locale])
            {
                pThis[prop] = nexacro._cache_textareaelement_set[_locale][prop];
            }

            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                if (!nexacro._cache_textareaelement_set[_locale][nexacro._inputelement_user_override_func[i]] &&
                    pThis[nexacro._inputelement_user_override_func[i]] !== nexacro.InputElement.prototype[nexacro._inputelement_user_override_func[i]])
                {
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.TextAreaElement.prototype[nexacro._inputelement_user_override_func[i]];
                }
            }
        }
        else
        {
            // 기존ime 정보 clear함수 필요
            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                pThis[nexacro._inputelement_user_override_func[i]] = nexacro.InputElement.prototype[nexacro._inputelement_user_override_func[i]];
                if (nexacro.TextAreaElement.prototype[nexacro._inputelement_user_override_func[i]])
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.TextAreaElement.prototype[nexacro._inputelement_user_override_func[i]];
            }

            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                // prototype 함수와 다를때만 넣어주자
                if (pThis[nexacro._inputelement_user_override_func[i]] !== nexacro.InputElement.prototype[nexacro._inputelement_user_override_func[i]])
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.TextAreaElement.prototype[nexacro._inputelement_user_override_func[i]];
            }

        }

        // edit/textarea
        var comp = pThis.parent_elem.linkedcontrol;
        if (comp.on_apply_imeSet) comp.on_apply_imeSet();

        pThis.on_apply_ime_environment(evt);
    };
    */

    //======================================================================
    // nexacro.SimpleTextAreaElement - this Element
    //======================================================================
    nexacro.SimpleTextAreaElement = function (parent_elem, id)
    {
        nexacro.TextAreaElement.call(this, parent_elem, id);
    };

    var _pSimpleTextAreaElement = nexacro._createPrototype(nexacro.TextAreaElement, nexacro.SimpleTextAreaElement);
    nexacro.SimpleTextAreaElement.prototype = _pSimpleTextAreaElement;

    _pSimpleTextAreaElement._type_name = "SimpleTextAreaElement";
    _pSimpleTextAreaElement._use_html_maxlength = true;

    _pSimpleTextAreaElement._TestDisplayArea = function (v)
    {
        var handle = this.handle;
        if (handle)
        {
            var border;
            if (v)
                border = nexacro.BorderObject("1px dotted blue");
            else
                border = nexacro.BorderObject("0px none");

            nexacro.__setDOMStyle_BorderObject(handle.style, border, this.rtl);
        }
    }

    _pSimpleTextAreaElement._getInputID = function ()
    {
        return this.name + ":simpletextarea";
    };

    _pSimpleTextAreaElement._on_sys_focus = function (evt)
    {
        var input_handle = (evt.target || evt.srcElement);
        if (input_handle)
        {
            var pThis = input_handle._linked_element;
            if (!pThis) return;

            if (!pThis.on_sys_focus_before_process(evt)) return;
            if (!pThis.on_sys_focus_process(evt)) return;

            var comp = pThis.parent.linkedcontrol;
            if (comp)
                comp.on_input_focus();
        }
    };

    _pSimpleTextAreaElement._on_sys_compositionend = _pSimpleInputElement._on_sys_compositionend;
    _pSimpleTextAreaElement._on_sys_compositionstart = _pSimpleInputElement._on_sys_compositionstart;
    _pSimpleTextAreaElement._on_sys_compositionupdate = _pSimpleInputElement._on_sys_compositionupdate;

    _pSimpleTextAreaElement._on_sys_beforeinput_forward = function (evt)
    {
        var input_handle = evt.target;
        if (input_handle)
        {
            // undo redo 차단하고 keydown 에서만 처리 하는 것 추가
            if (evt.inputType == "historyUndo" || evt.inputType == "historyRedo")
            {
                evt.preventDefault();
            }
        }

        return nexacro.TextAreaElement.prototype._on_sys_beforeinput_forward.call(this, evt);
    };

    _pSimpleTextAreaElement.on_apply_imeSet = function (evt)
    {
        var i, len;
        var input_handle = evt ? (evt.target || evt.srcElement) : this.handle;
        var pThis = input_handle ? input_handle._linked_element : this;

        var _locale = pThis._imelocale.getLocale();
        if (_locale && nexacro._cache_simpleinputelement_set[_locale] && nexacro._cache_simpletextareaelement_set[_locale])
        {
            // 기존 ime에서 자체적으로 만든 함수, 변수 제거 해야함
            // clear함수 필요            
            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                pThis[nexacro._inputelement_user_override_func[i]] = nexacro.SimpleInputElement.prototype[nexacro._inputelement_user_override_func[i]];

                if (nexacro.SimpleTextAreaElement.prototype[nexacro._inputelement_user_override_func[i]])
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.SimpleTextAreaElement.prototype[nexacro._inputelement_user_override_func[i]];
            }

            for (var prop in nexacro._cache_simpleinputelement_set[_locale])
            {
                pThis[prop] = nexacro._cache_simpleinputelement_set[_locale][prop];
            }

            for (var prop in nexacro._cache_simpletextareaelement_set[_locale])
            {
                pThis[prop] = nexacro._cache_simpletextareaelement_set[_locale][prop];
            }

            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                if (!nexacro._cache_simpleinputelement_set[_locale][nexacro._inputelement_user_override_func[i]] &&
                    !nexacro._cache_simpletextareaelement_set[_locale][nexacro._inputelement_user_override_func[i]] &&
                    pThis[nexacro._inputelement_user_override_func[i]] !== nexacro.SimpleInputElement.prototype[nexacro._inputelement_user_override_func[i]])
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.SimpleTextAreaElement.prototype[nexacro._inputelement_user_override_func[i]];
            }
        }
        else if (_locale && nexacro._cache_simpleinputelement_set[_locale])
        {
            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                pThis[nexacro._inputelement_user_override_func[i]] = nexacro.SimpleInputElement.prototype[nexacro._inputelement_user_override_func[i]];
                if (nexacro.SimpleTextAreaElement.prototype[nexacro._inputelement_user_override_func[i]])
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.SimpleTextAreaElement.prototype[nexacro._inputelement_user_override_func[i]];
            }

            for (var prop in nexacro._cache_simpleinputelement_set[_locale])
            {
                pThis[prop] = nexacro._cache_simpleinputelement_set[_locale][prop];
            }

            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                if (!nexacro._cache_simpleinputelement_set[_locale][nexacro._inputelement_user_override_func[i]] &&
                    pThis[nexacro._inputelement_user_override_func[i]] !== nexacro.SimpleInputElement.prototype[nexacro._inputelement_user_override_func[i]])
                {
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.SimpleTextAreaElement.prototype[nexacro._inputelement_user_override_func[i]];
                }
            }
        }
        else if (_locale && nexacro._cache_simpletextareaelement_set[_locale])
        {
            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                pThis[nexacro._inputelement_user_override_func[i]] = nexacro.SimpleInputElement.prototype[nexacro._inputelement_user_override_func[i]];
                if (nexacro.SimplkeTextAreaElement.prototype[nexacro._inputelement_user_override_func[i]])
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.SimpleTextAreaElement.prototype[nexacro._inputelement_user_override_func[i]];
            }

            for (var prop in nexacro._cache_simpletextareaelement_set[_locale])
            {
                pThis[prop] = nexacro._cache_simpletextareaelement_set[_locale][prop];
            }

            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                if (!nexacro._cache_simpletextareaelement_set[_locale][nexacro._inputelement_user_override_func[i]] &&
                    pThis[nexacro._inputelement_user_override_func[i]] !== nexacro.SimpleInputElement.prototype[nexacro._inputelement_user_override_func[i]])
                {
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.SimpleTextAreaElement.prototype[nexacro._inputelement_user_override_func[i]];
                }
            }
        }
        else
        {
            // 기존ime 정보 clear함수 필요
            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                pThis[nexacro._inputelement_user_override_func[i]] = nexacro.SimpleInputElement.prototype[nexacro._inputelement_user_override_func[i]];
                if (nexacro.SimpleTextAreaElement.prototype[nexacro._inputelement_user_override_func[i]])
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.TextAreaElement.prototype[nexacro._inputelement_user_override_func[i]];
            }

            for (i = 0, len = nexacro._inputelement_user_override_func.length; i < len; i++)
            {
                // prototype 함수와 다를때만 넣어주자
                if (pThis[nexacro._inputelement_user_override_func[i]] !== nexacro.InputElement.prototype[nexacro._inputelement_user_override_func[i]])
                    pThis[nexacro._inputelement_user_override_func[i]] = nexacro.TextAreaElement.prototype[nexacro._inputelement_user_override_func[i]];
            }

        }

        // edit/textarea
        var comp = pThis.parent_elem.linkedcontrol;
        if (comp.on_apply_imeSet) comp.on_apply_imeSet();

        pThis.on_apply_ime_environment(evt);
    };


} // end of HTML


if (_process)
{
    _process = null;
    //_pMobileElement = null;
    _pFlexibleControlElement = null;
    _pSimpleInputElement = null;
    _pSimpleTextAreaElement = null;
}
