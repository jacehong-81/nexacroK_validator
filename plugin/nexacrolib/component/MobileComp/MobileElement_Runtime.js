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

if (nexacro._Browser == "Runtime")
{
    "use strict";
    var _process = true;

    if (!nexacro.FlexibleControlElement)
    {
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

        _pFlexibleControlElement.setElementLayoutType = nexacro._emptyFn;
        _pFlexibleControlElement.setElementLayoutHorizontalGap = nexacro._emptyFn;
        _pFlexibleControlElement.setElementLayoutVerticalGap = nexacro._emptyFn;
        _pFlexibleControlElement.setElementFlexMainAxisAlign = nexacro._emptyFn;
        _pFlexibleControlElement.setElementFlexCrossAxisAlign = nexacro._emptyFn;
        _pFlexibleControlElement.setElementFlexCrossAxisWrapAlign = nexacro._emptyFn;
        _pFlexibleControlElement.setElementFlexWrap = nexacro._emptyFn;
        _pFlexibleControlElement.setElementLayoutSpacing = nexacro._emptyFn;
        _pFlexibleControlElement.setElementTableCellAlign = nexacro._emptyFn;
        _pFlexibleControlElement.setElementTableCellinCompAlign = nexacro._emptyFn;
        _pFlexibleControlElement.setElementTableDirection = nexacro._emptyFn;
        _pFlexibleControlElement.setElementTableTemplate = nexacro._emptyFn;
        _pFlexibleControlElement.setElementTableTemplateArea = nexacro._emptyFn;
        _pFlexibleControlElement.setElementLayoutBasis = nexacro._emptyFn;

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

        _pLabelElement.For = nexacro._emptyFn;

        //======================================================================
        // nexacro.SimpleInputElement
        //======================================================================
        nexacro.SimpleInputElement = function (parent_elem, id)
        {
            nexacro.InputElement.call(this, parent_elem, id);
        };

        var _pSimpleInputElement = nexacro._createPrototype(nexacro.InputElement, nexacro.SimpleInputElement);  // use nexacro.inputElement
        nexacro.SimpleInputElement.prototype = _pSimpleInputElement;

        _pSimpleInputElement._type_name = "SimpleInputElement";
        _pSimpleInputElement._is_simple_input = true;

        _pSimpleInputElement._clearNumberGabageValue = nexacro._emptyFn;

        _pSimpleInputElement._TestDisplayArea = function (v)
        {
            var border;
            if (v)
                border = "1px dotted blue";
            else
                border = "0px none";

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setElementHandleBorderObject(handle, border, this.rtl);
            }
        };

        _pSimpleInputElement._getInputID = function ()
        {
            return this.name + ":simpleinput";
        };

        _pSimpleInputElement._on_sys_focus = function ()
        {
            nexacro.InputElement.prototype._on_sys_focus.call(this);

            var comp = this.parent.linkedcontrol;
            if (comp)
                comp.on_input_focus();
        };

        _pSimpleInputElement._getValidity = nexacro._emptyFn;

        //======================================================================
        // nexacro.SimpleTextAreaElement - this Element
        //======================================================================
        nexacro.SimpleTextAreaElement = function (parent_elem, id)
        {
            nexacro.TextAreaElement.call(this, parent_elem, id);
        };

        var _pSimpleTextAreaElement = nexacro._createPrototype(nexacro.TextAreaElement, nexacro.SimpleInputElement);
        nexacro.SimpleTextAreaElement.prototype = _pSimpleTextAreaElement;

        _pSimpleTextAreaElement._type_name = "SimpleTextAreaElement";
        _pSimpleTextAreaElement._is_simple_input = true;

        _pSimpleTextAreaElement._TestDisplayArea = function (v)
        {
            let border = "";
            if (v)
                border = "1px dotted blue";
            else
                border = "0px none";

            var handle = this.handle;
            if (handle)
            {
                nexacro.__setElementHandleBorderObject(handle, border, this.rtl);
            }
        };

        _pSimpleTextAreaElement._getInputID = function ()
        {
            return this.name + ":simpletextarea";
        };

        _pSimpleTextAreaElement._on_sys_focus = function (evt)
        {
            nexacro.TextAreaElement.prototype._on_sys_focus.call(this, evt);

            var comp = this.parent.linkedcontrol;
            if (comp)
                comp.on_input_focus();
        };
    } // end of RUNTIME
}

if (_process)
{
    _process = null;
    _pSimpleInputElement = null;
}